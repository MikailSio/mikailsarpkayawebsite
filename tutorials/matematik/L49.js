window.LISE_MAT_L49 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>In Lesson 48 you learned how to divide one polynomial by another using long division.</strong> The mechanics work — you keep subtracting multiples of the divisor until what is left has lower degree than the divisor itself. But long division has two problems. First, when the divisor is a simple linear factor like (x &minus; 3), it is overkill: there is a shortcut that reads off the answer in a single line. Second, you may want only the <em>remainder</em> of a division and not care about the quotient at all — for instance, when checking whether one polynomial is a factor of another. This lesson gives you both shortcuts. They are called the <strong>Remainder Theorem</strong>, the <strong>Factor Theorem</strong>, and <strong>synthetic division</strong>.</p>

<p class="l-text">These three tools are not just exam tricks. They are the foundation of every method you will meet for finding the roots of a polynomial: rational root testing, factoring cubics and quartics, locating zeroes of higher-degree equations. By the end of this lesson, given any polynomial P(x) and any number a, you should be able to compute the remainder of P(x) divided by (x &minus; a) without writing out a single long division — purely by plugging in. And you should be able to test whether (x &minus; a) is a factor of P(x) in seconds.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the division algorithm for polynomials, P(x) = Q(x)&middot;D(x) + R(x), and identify the quotient and remainder</li>
<li>Apply the Remainder Theorem to compute the remainder of P(x) &divide; (x &minus; a) in one step by evaluating P(a)</li>
<li>Use the Factor Theorem to decide whether (x &minus; a) is a factor of a polynomial, and find roots by inspection</li>
<li>Carry out synthetic division on a linear divisor and read off both the quotient coefficients and the remainder</li>
<li>Recognise the geometric meaning of the Remainder Theorem on the graph of y = P(x)</li>
<li>State the Bezout identity for two polynomials and link it to the greatest common divisor (GCD)</li>
</ul>
</div>

<h2 class="lesson-title">1. The Division Algorithm Revisited</h2>

<div class="calc-highlight"><strong>From Lesson 48:</strong> for any two polynomials P(x) (dividend) and D(x) (divisor) with D(x) not the zero polynomial, there exist unique polynomials Q(x) (quotient) and R(x) (remainder) such that $P(x) = Q(x)\\cdot D(x) + R(x)$, where deg R &lt; deg D.</div>

<p class="l-text">This is the analogue of integer division. When you write $17 = 5\\cdot 3 + 2$, you have 17 = (quotient 5)&times;(divisor 3) + (remainder 2), and the remainder 2 is strictly smaller than the divisor 3. Polynomials behave the same way, with "smaller" replaced by "of lower degree".</p>

<div class="calc-formula"><div class="formula-label">DIVISION ALGORITHM FOR POLYNOMIALS</div><div class="formula-main">$$P(x) \\;=\\; Q(x)\\cdot D(x) \\;+\\; R(x), \\qquad \\deg R(x) \\;&lt;\\; \\deg D(x)$$</div><div class="formula-sub">Q and R are uniquely determined by P and D. When D(x) is linear (degree 1), R must have degree 0 — that is, R is a single constant.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dividend P(x)</div><div class="card-body">The polynomial we are dividing. Its degree is at least that of the divisor (otherwise Q = 0, R = P).</div></div>
<div class="calc-card"><div class="card-title">Divisor D(x)</div><div class="card-body">What we divide by. In this lesson we focus mostly on linear divisors of the form (x &minus; a).</div></div>
<div class="calc-card"><div class="card-title">Quotient Q(x)</div><div class="card-body">The "main part" of the answer. Has degree equal to deg P &minus; deg D.</div></div>
<div class="calc-card"><div class="card-title">Remainder R(x)</div><div class="card-body">What is left over. Has degree strictly less than that of D.</div></div>
</div>

<p class="l-text"><strong>Worked reminder.</strong> Divide $P(x) = x^3 - 2x^2 + 5$ by $D(x) = x - 3$ using long division. You arrange the dividend with all powers present (insert a 0 coefficient for the missing $x^1$ term), then repeatedly divide the leading term of the current dividend by the leading term of the divisor:</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (LONG DIVISION REVIEW)</div><div class="example-body">Divide $x^3 - 2x^2 + 0\\cdot x + 5$ by $x - 3$.<br><br>Step 1: $x^3 \\div x = x^2$. Multiply $x^2\\cdot(x-3) = x^3 - 3x^2$. Subtract: $(x^3 - 2x^2) - (x^3 - 3x^2) = x^2$.<br>Bring down: $x^2 + 0\\cdot x$.<br><br>Step 2: $x^2 \\div x = x$. Multiply $x\\cdot(x-3) = x^2 - 3x$. Subtract: $(x^2 + 0\\cdot x) - (x^2 - 3x) = 3x$.<br>Bring down: $3x + 5$.<br><br>Step 3: $3x \\div x = 3$. Multiply $3\\cdot(x-3) = 3x - 9$. Subtract: $(3x + 5) - (3x - 9) = 14$.<br><br>Result: $Q(x) = x^2 + x + 3$, $R = 14$. Check: $(x-3)(x^2 + x + 3) + 14 = x^3 - 2x^2 + 5$. ✓</div></div>

<div class="l-note"><strong>Key observation:</strong> the remainder we obtained, $R = 14$, is a single constant. That had to happen because the divisor (x &minus; 3) is linear, so deg R must be less than 1, i.e. zero. The remainder of any division by a linear divisor is always a constant.</div>

<h2 class="lesson-title">2. The Remainder Theorem</h2>

<div class="calc-highlight"><strong>Here is the shortcut.</strong> When the divisor is (x &minus; a), the remainder of $P(x) \\div (x - a)$ is exactly $P(a)$. No long division needed — just plug $a$ into the polynomial.</div>

<p class="l-text">In the worked example above we found $R = 14$ after three painful steps of long division. Watch what happens if we use the Remainder Theorem instead: compute $P(3) = 3^3 - 2\\cdot 3^2 + 5 = 27 - 18 + 5 = 14$. <strong>Same answer, one line.</strong></p>

<div class="calc-formula"><div class="formula-label">THE REMAINDER THEOREM</div><div class="formula-main">$$P(x) \\;=\\; Q(x)\\cdot(x - a) \\;+\\; R \\quad \\Longrightarrow \\quad R \\;=\\; P(a)$$</div><div class="formula-sub">The remainder R is a constant (since the divisor is linear), and that constant is precisely the value of P at x = a.</div></div>

<p class="l-text">This is sometimes called the <strong>Bezout Remainder Theorem</strong> after the French mathematician &Eacute;tienne B&eacute;zout (1730&ndash;1783), who proved it in full generality. The simple linear case is what you will use 95% of the time.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: identify a</div><div class="card-body">Read off a from the divisor (x &minus; a). For (x &minus; 3), a = 3. For (x + 4) = (x &minus; (&minus;4)), a = &minus;4 — careful with the sign!</div></div>
<div class="calc-card"><div class="card-title">Step 2: compute P(a)</div><div class="card-body">Substitute x = a into P and simplify. Pure arithmetic, no algebra.</div></div>
<div class="calc-card"><div class="card-title">Step 3: read the answer</div><div class="card-body">The number you computed is the remainder. Done.</div></div>
</div>

<h2 class="lesson-title">3. Proof of the Remainder Theorem</h2>

<p class="l-text">The proof is one line — and it tells you <em>why</em> the theorem works, not just <em>that</em> it works. Start from the division algorithm specialised to the linear divisor $D(x) = x - a$:</p>

<div class="calc-formula"><div class="formula-label">STARTING POINT</div><div class="formula-main">$$P(x) \\;=\\; Q(x)\\cdot(x - a) \\;+\\; R(x)$$</div><div class="formula-sub">where deg R(x) &lt; deg(x &minus; a) = 1, so deg R = 0, meaning R is a constant. Write it simply as R.</div></div>

<p class="l-text">Now <strong>substitute $x = a$</strong> into both sides. On the right, the factor $(a - a) = 0$ kills the entire $Q(a)\\cdot(a - a)$ term, regardless of what Q(a) happens to equal. Only the constant R survives:</p>

<div class="calc-formula"><div class="formula-label">THE SUBSTITUTION TRICK</div><div class="formula-main">$$P(a) \\;=\\; Q(a)\\cdot(a - a) \\;+\\; R \\;=\\; Q(a)\\cdot 0 \\;+\\; R \\;=\\; R$$</div><div class="formula-sub">Therefore R = P(a). QED.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">The proof never says anything about what Q(x) actually is. We do not need to <em>know</em> Q to deduce the remainder — we only need to know that <em>some</em> Q exists, which the division algorithm guarantees. That is why the Remainder Theorem is so cheap: it gives you R for free, without computing Q.</div></div>

<div class="l-note"><strong>Geometric reading.</strong> Plot $y = P(x)$. The graph crosses the vertical line $x = a$ at the height $y = P(a)$. The Remainder Theorem says: that height is exactly the remainder when you divide P by (x &minus; a). In particular, if the graph passes through the x-axis at $x = a$ (so $P(a) = 0$), then the remainder is zero and (x &minus; a) divides P evenly.</div>

<div class="calc-graph"><div id="plot-l49-remainder-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $P(x) = x^3 - 2x^2 + 5$ with the vertical line $x = 3$ and the point $(3, P(3)) = (3, 14)$ marked. The y-coordinate of that marked point — namely 14 — is the remainder when P is divided by $(x - 3)$. This is the Remainder Theorem made visible.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=-1+5*i/200;xs.push(x);ys.push(x*x*x-2*x*x+5);}
var curveEN={x:xs,y:ys,mode:'lines',name:'P(x) = x³ − 2x² + 5',line:{color:'#3b82f6',width:3}};
var vlineEN={x:[3,3],y:[-5,30],mode:'lines',name:'x = 3',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'}};
var hlineEN={x:[-1,3],y:[14,14],mode:'lines',name:'y = P(3) = 14',line:{color:'#10b981',width:1.5,dash:'dot'}};
var pointEN={x:[3],y:[14],mode:'markers+text',name:'(3, 14)',marker:{color:'#10b981',size:12,line:{color:'#0a0a0a',width:2}},text:['  (3, 14)  remainder'],textposition:'middle right',textfont:{color:'#10b981',size:13}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-6,32],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:40,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l49-remainder-en',[curveEN,vlineEN,hlineEN,pointEN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Applications: Computing Remainders Without Long Division</h2>

<p class="l-text">The Remainder Theorem turns a multi-step long division into a single substitution. Here is a battery of short examples to build fluency.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1</div><div class="example-body">Find the remainder when $P(x) = 2x^4 - 5x^3 + x - 7$ is divided by $(x - 2)$.<br><br>Identify $a = 2$.<br>Compute $P(2) = 2\\cdot 16 - 5\\cdot 8 + 2 - 7 = 32 - 40 + 2 - 7 = \\mathbf{-13}$.<br>Remainder is $-13$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — WATCH THE SIGN</div><div class="example-body">Find the remainder when $P(x) = x^3 + 4x^2 - x + 6$ is divided by $(x + 2)$.<br><br>Rewrite divisor: $(x + 2) = (x - (-2))$, so $a = -2$.<br>Compute $P(-2) = (-2)^3 + 4(-2)^2 - (-2) + 6 = -8 + 16 + 2 + 6 = \\mathbf{16}$.<br>Remainder is $16$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — UNKNOWN COEFFICIENT</div><div class="example-body">For what value of $k$ does $P(x) = x^3 - kx^2 + 2x - 5$ leave a remainder of $1$ when divided by $(x - 1)$?<br><br>By the Remainder Theorem: $P(1) = 1 - k + 2 - 5 = -2 - k$.<br>Set equal to 1: $-2 - k = 1 \\Rightarrow k = -3$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — TWO SIMULTANEOUS CONDITIONS</div><div class="example-body">A polynomial $P(x)$ leaves remainder $3$ when divided by $(x - 1)$ and remainder $-5$ when divided by $(x + 1)$. Express $P(0)$ in terms of these data, assuming $P(x) = ax^2 + bx + c$.<br><br>$P(1) = a + b + c = 3$ and $P(-1) = a - b + c = -5$. Add: $2a + 2c = -2 \\Rightarrow a + c = -1$. Subtract: $2b = 8 \\Rightarrow b = 4$.<br>$P(0) = c$. We have one equation $a + c = -1$ but two unknowns $a, c$ — so we cannot pin down $P(0)$ without more information. <em>Lesson</em>: two remainders for a degree-2 polynomial fix only two of its three coefficients.</div></div>

<h2 class="lesson-title">5. The Factor Theorem</h2>

<div class="calc-highlight"><strong>A polynomial $(x - a)$ is a factor of $P(x)$ if and only if $P(a) = 0$.</strong> This is the Factor Theorem, and it is the single most important consequence of the Remainder Theorem.</div>

<p class="l-text">Why does it follow? Because $(x - a)$ is a factor of $P(x)$ means $P(x) = Q(x)\\cdot(x - a)$ for some polynomial Q — equivalently, the remainder of the division is zero. By the Remainder Theorem, that remainder equals $P(a)$. So zero remainder $\\Leftrightarrow$ $P(a) = 0$.</p>

<div class="calc-formula"><div class="formula-label">THE FACTOR THEOREM</div><div class="formula-main">$$(x - a) \\text{ divides } P(x) \\quad \\Longleftrightarrow \\quad P(a) \\;=\\; 0$$</div><div class="formula-sub">Roots of P and linear factors of P are the same thing, viewed from two angles.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ROOT VIEWPOINT</div><div class="compare-item">a is a root of P means $P(a) = 0$</div><div class="compare-item">Algebraic fact about the value of the function</div><div class="compare-item">Geometric: graph crosses x-axis at $x = a$</div></div><div class="compare-col"><div class="compare-title">FACTOR VIEWPOINT</div><div class="compare-item">$(x - a)$ is a factor of P means $P = Q\\cdot(x - a)$</div><div class="compare-item">Algebraic fact about the structure of the polynomial</div><div class="compare-item">Useful: lets you peel off a factor and reduce the degree</div></div></div>

<p class="l-text"><strong>Hunting for roots.</strong> If you suspect that a polynomial has a "nice" integer root, the Factor Theorem turns the search into substitution: try $a = 1, -1, 2, -2, \\ldots$ and see which one gives $P(a) = 0$. Each hit gives you a factor $(x - a)$, which you can then divide out to reduce the polynomial's degree. We will systematise this in Lesson 50.</p>

<div class="calc-example"><div class="example-label">FACTOR HUNT</div><div class="example-body">Is $(x - 1)$ a factor of $P(x) = x^4 - 3x^3 + 2x^2 + x - 1$?<br><br>$P(1) = 1 - 3 + 2 + 1 - 1 = 0$. <strong>Yes</strong>, $(x - 1)$ is a factor.<br><br>Is $(x + 1)$ a factor? $P(-1) = 1 + 3 + 2 - 1 - 1 = 4 \\neq 0$. <strong>No.</strong></div></div>

<h2 class="lesson-title">6. Full Worked Example: $P(x) = x^3 - 2x^2 + 5$ Divided by $(x - 3)$</h2>

<p class="l-text">Let us tie sections 1&ndash;5 together on a single polynomial, using <em>three different methods</em> and comparing.</p>

<div class="calc-example"><div class="example-label">METHOD A — LONG DIVISION (FROM SECTION 1)</div><div class="example-body">After three steps of long division: $Q(x) = x^2 + x + 3$, $R = 14$.<br>Total time: about a minute on paper.</div></div>

<div class="calc-example"><div class="example-label">METHOD B — REMAINDER THEOREM</div><div class="example-body">$a = 3$.<br>$P(3) = 27 - 18 + 5 = 14$.<br>Remainder is 14. Total time: under ten seconds. But we only got R, not Q.</div></div>

<div class="calc-example"><div class="example-label">METHOD C — SYNTHETIC DIVISION (PREVIEW)</div><div class="example-body">Use coefficients only: $1, -2, 0, 5$ (insert 0 for the missing $x^1$ term). Bring down the 1. Multiply by 3, add to the next coefficient. Repeat:<br><br><code>3 │ 1   −2   0    5<br>  │     3   3    9<br>  └───────────────<br>    1   1   3   14</code><br><br>Bottom row: $1, 1, 3$ are the quotient coefficients (degree dropped by 1, so $Q(x) = x^2 + x + 3$), and the last number, 14, is the remainder. We get <strong>both Q and R in one pass</strong>, faster than long division.</div></div>

<p class="l-text"><strong>Comparison.</strong> The Remainder Theorem is fastest when you only want R. Synthetic division is fastest when you want both Q and R. Long division is unavoidable only when the divisor is not linear (e.g. dividing by $x^2 + 1$).</p>

<h2 class="lesson-title">7. Bezout&#39;s Identity for Polynomials</h2>

<div class="calc-highlight">For integers, Bezout&#39;s identity says: for any $a, b \\in \\mathbb{Z}$, their GCD can be written as $\\gcd(a, b) = ua + vb$ for some integers $u, v$. The same holds for polynomials.</div>

<p class="l-text">If $A(x)$ and $B(x)$ are two polynomials with greatest common divisor $D(x)$ (the highest-degree polynomial that divides both), then there exist polynomials $U(x)$ and $V(x)$ such that:</p>

<div class="calc-formula"><div class="formula-label">BEZOUT IDENTITY FOR POLYNOMIALS</div><div class="formula-main">$$\\gcd(A(x), B(x)) \\;=\\; U(x)\\cdot A(x) \\;+\\; V(x)\\cdot B(x)$$</div><div class="formula-sub">U and V can be computed by running the Euclidean algorithm on A and B (repeatedly using the division algorithm), then back-substituting.</div></div>

<p class="l-text"><strong>Why does this matter for high school?</strong> Two reasons. First, it justifies the existence of a "simplest" common factor: if you reduce a rational function $\\frac{A(x)}{B(x)}$ to lowest terms, you are dividing both numerator and denominator by their GCD. Second, in algebra and number theory, Bezout&#39;s identity is the engine behind everything from solving linear Diophantine equations to inverting elements in finite fields. The polynomial version generalises the integer version word-for-word.</p>

<div class="calc-example"><div class="example-label">SHORT EXAMPLE</div><div class="example-body">Let $A(x) = x^2 - 1$ and $B(x) = x - 1$. Their GCD is $(x - 1)$ (since $A = (x - 1)(x + 1)$).<br><br>We want $U, V$ such that $(x - 1) = U(x)\\cdot(x^2 - 1) + V(x)\\cdot(x - 1)$.<br><br>One solution: $U(x) = 0$, $V(x) = 1$. (Trivial here because B itself equals the GCD.)<br><br>A less trivial case: $A(x) = x^3 - 1$, $B(x) = x^2 + x + 1$. GCD is $(x^2 + x + 1)$ since $A = (x - 1)(x^2 + x + 1)$. So $U = 0$, $V = 1$ again. To get a richer example you need two polynomials with a common quadratic factor neither of them equals — beyond the scope of this lesson but a good Lesson 51 preview.</div></div>

<div class="l-note"><strong>Connection to the Factor Theorem.</strong> If $P(a) = 0$ and $P(b) = 0$ for distinct values $a, b$, then both $(x - a)$ and $(x - b)$ divide P. So $(x - a)(x - b)$ — their product — also divides P. The Factor Theorem combined with the unique factorisation of polynomials gives you, for free, a Bezout-style way to peel off multiple roots at once.</div>

<h2 class="lesson-title">8. Synthetic Division: The Tabular Shortcut</h2>

<div class="calc-highlight"><strong>Synthetic division is the fastest hand-method for dividing a polynomial by a linear factor $(x - a)$.</strong> It works only for linear divisors with leading coefficient 1, but those are precisely the divisors that show up most often in school and on exams.</div>

<p class="l-text">The idea: long division wastes time writing down powers of $x$ that we already know are there. If we just track the <em>coefficients</em> in a neat table, we can shave the procedure down to additions and multiplications by a single number $a$.</p>

<div class="calc-formula"><div class="formula-label">WHAT SYNTHETIC DIVISION COMPUTES</div><div class="formula-main">$$P(x) \\;\\div\\; (x - a) \\;=\\; Q(x) \\;+\\; \\frac{R}{x - a}$$</div><div class="formula-sub">Synthetic division returns the coefficients of Q(x) and the constant R, in that order, along the bottom row of the table.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">About 3&ndash;5&times; faster than long division for the same problem. Almost as fast as the Remainder Theorem, but also gives you Q.</div></div>
<div class="calc-card"><div class="card-title">Restriction</div><div class="card-body">Divisor must be of the form $(x - a)$. For $(2x - 3)$ you can adapt the method, but the basic form requires leading coefficient 1.</div></div>
<div class="calc-card"><div class="card-title">Cross-check</div><div class="card-body">The final number must equal $P(a)$. If it does not, you made an arithmetic slip.</div></div>
</div>

<div class="calc-graph"><div id="plot-l49-synthetic-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a visual flow of synthetic division for $P(x) = x^3 - 2x^2 + 5$ divided by $(x - 3)$. Each arrow represents one "multiply by 3, then add" step. Start with the leading coefficient (1), end with the remainder (14). The three middle numbers are the coefficients of Q(x).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var coefs=[1,-2,0,5];
var products=[null,3,3,9];
var bottom=[1,1,3,14];
var xpos=[0,1,2,3];
var topT={x:xpos,y:[3,3,3,3],mode:'markers+text',name:'coefficients of P',marker:{color:'#3b82f6',size:32,symbol:'circle'},text:coefs.map(function(c){return String(c);}),textfont:{color:'#0a0a0a',size:14,family:'Geist Mono'},textposition:'middle center'};
var midT={x:[1,2,3],y:[2,2,2],mode:'markers+text',name:'a · prev (a=3)',marker:{color:'#f59e0b',size:28,symbol:'diamond'},text:['+3','+3','+9'],textfont:{color:'#0a0a0a',size:13,family:'Geist Mono'},textposition:'middle center'};
var botT={x:xpos,y:[1,1,1,1],mode:'markers+text',name:'sum (Q & R)',marker:{color:'#10b981',size:32,symbol:'circle'},text:bottom.map(function(c){return String(c);}),textfont:{color:'#0a0a0a',size:14,family:'Geist Mono'},textposition:'middle center'};
var labelsT={x:[-0.5,-0.5,-0.5],y:[3,2,1],mode:'text',name:'',text:['coef','×3','sum'],textfont:{color:'#e8e8e8',size:12},textposition:'middle right',showlegend:false};
var anns=[];
for(var i=1;i<4;i++){anns.push({x:i,y:1.45,ax:i-1,ay:1.55,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowcolor:'#f59e0b',arrowsize:1,arrowwidth:1.2});anns.push({x:i,y:1.6,ax:i,ay:2.55,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowcolor:'#10b981',arrowsize:1,arrowwidth:1.2});}
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,3.6],showgrid:false,showticklabels:false,zeroline:false},yaxis:{range:[0.4,3.6],showgrid:false,showticklabels:false,zeroline:false},margin:{t:20,r:30,b:30,l:30},annotations:anns,legend:{orientation:'h',y:-0.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l49-synthetic-en',[topT,midT,botT,labelsT],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Synthetic Division: The Five Steps</h2>

<p class="l-text">Pick the polynomial $P(x) = 2x^3 + 3x^2 - 5x + 1$ and divide by $(x + 2)$. Here is the recipe step by step.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: read off a</div><div class="card-body">Divisor is $(x + 2) = (x - (-2))$, so $a = -2$. <strong>Mind the sign flip.</strong></div></div>
<div class="calc-card"><div class="card-title">Step 2: list the coefficients</div><div class="card-body">Write the coefficients of P in descending order, inserting 0 for any missing power. Here: $2, 3, -5, 1$ (no missing powers).</div></div>
<div class="calc-card"><div class="card-title">Step 3: bring down the first</div><div class="card-body">Copy the leading coefficient (2) straight down to the bottom row. This becomes the first coefficient of Q.</div></div>
<div class="calc-card"><div class="card-title">Step 4: multiply &amp; add</div><div class="card-body">Multiply the bottom-row number by $a = -2$, write the result in the middle row under the next coefficient, add the column. Repeat until you reach the end.</div></div>
<div class="calc-card"><div class="card-title">Step 5: read the answer</div><div class="card-body">All bottom-row numbers except the last are the coefficients of Q (degree dropped by 1). The final number is the remainder R = P(a).</div></div>
</div>

<div class="calc-example"><div class="example-label">FULL TABLE FOR THIS EXAMPLE</div><div class="example-body"><code>−2 │  2    3    −5    1<br>   │      −4     2    6<br>   └────────────────────<br>      2   −1    −3    7</code><br><br>So $Q(x) = 2x^2 - x - 3$ and $R = 7$.<br><br>Verification by Remainder Theorem: $P(-2) = 2(-8) + 3(4) - 5(-2) + 1 = -16 + 12 + 10 + 1 = 7$. ✓<br>Verification by multiplying back: $(x + 2)(2x^2 - x - 3) + 7 = 2x^3 - x^2 - 3x + 4x^2 - 2x - 6 + 7 = 2x^3 + 3x^2 - 5x + 1$. ✓</div></div>

<div class="l-note"><strong>Common slip:</strong> forgetting to insert 0 for missing powers. If you divide $x^4 + 1$ by $(x - 1)$, the coefficients must be $1, 0, 0, 0, 1$ — five numbers — not just $1, 1$. Skipping zeroes throws off every subsequent multiply-and-add.</div>

<div class="calc-graph"><div id="plot-l49-factor-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the polynomial $P(x) = (x - 1)(x + 2)(x - 3) = x^3 - 2x^2 - 5x + 6$ in blue, with its three roots $x = 1, -2, 3$ marked on the x-axis. By the Factor Theorem, each root corresponds to one linear factor. Each x-axis crossing is one "click" of the Factor Theorem in action — the graph touches $y = 0$ exactly at the values that make a linear factor vanish.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var x=-3.5+7*i/300;xs.push(x);ys.push((x-1)*(x+2)*(x-3));}
var curveEN={x:xs,y:ys,mode:'lines',name:'P(x) = (x−1)(x+2)(x−3)',line:{color:'#3b82f6',width:3}};
var rootsEN={x:[1,-2,3],y:[0,0,0],mode:'markers+text',name:'roots',marker:{color:'#ef4444',size:13,line:{color:'#0a0a0a',width:2}},text:['  x=1','x=−2  ','  x=3'],textposition:['middle right','middle left','middle right'],textfont:{color:'#ef4444',size:13}};
var zeroLineEN={x:[-3.5,3.5],y:[0,0],mode:'lines',name:'y = 0',line:{color:'rgba(255,255,255,0.25)',width:1,dash:'dot'}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.5,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-14,18],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l49-factor-en',[curveEN,zeroLineEN,rootsEN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Practice Problems</h2>

<p class="l-text">Try these by hand. Use the Remainder Theorem whenever you can — it is faster than long division and gets the answer in one line.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">Find the remainder when $P(x) = x^3 - 4x^2 + 6x + 2$ is divided by $(x - 1)$.<br><br><em>Answer:</em> $P(1) = 1 - 4 + 6 + 2 = 5$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">Find the remainder when $P(x) = 2x^4 + x^3 - 3x + 4$ is divided by $(x + 1)$.<br><br><em>Answer:</em> $P(-1) = 2 - 1 + 3 + 4 = 8$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">Is $(x - 2)$ a factor of $P(x) = x^3 - x^2 - 4x + 4$?<br><br><em>Answer:</em> $P(2) = 8 - 4 - 8 + 4 = 0$. Yes — $(x - 2)$ is a factor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">For what $k$ does $P(x) = x^3 + kx + 2$ have $(x - 2)$ as a factor?<br><br><em>Answer:</em> Need $P(2) = 0 \\Rightarrow 8 + 2k + 2 = 0 \\Rightarrow k = -5$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">Use synthetic division to divide $P(x) = x^3 - 6x^2 + 11x - 6$ by $(x - 1)$. Read off $Q$ and $R$.<br><br><em>Answer:</em> Table:<br><code>1 │ 1   −6   11   −6<br>  │     1   −5    6<br>  └───────────────<br>    1   −5    6    0</code><br>So $Q(x) = x^2 - 5x + 6$ and $R = 0$. Thus $(x - 1)$ is a factor — and $Q$ further factors as $(x - 2)(x - 3)$. Roots of P: $1, 2, 3$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body">A polynomial $P(x)$ leaves remainder $7$ when divided by $(x - 2)$ and remainder $-5$ when divided by $(x + 1)$. Find the remainder when $P(x)$ is divided by $(x - 2)(x + 1)$.<br><br><em>Strategy:</em> the divisor is now quadratic, so the remainder has degree at most 1: write $R(x) = ax + b$. Then $P(x) = (x - 2)(x + 1)Q(x) + ax + b$. Plug $x = 2$: $7 = 2a + b$. Plug $x = -1$: $-5 = -a + b$. Solve: $a = 4$, $b = -1$. Remainder is $4x - 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7</div><div class="example-body">Factor $P(x) = x^3 + 2x^2 - 5x - 6$ completely by first finding an integer root.<br><br><em>Try $x = 1$:</em> $1 + 2 - 5 - 6 = -8 \\neq 0$. <em>Try $x = -1$:</em> $-1 + 2 + 5 - 6 = 0$ ✓. So $(x + 1)$ is a factor.<br>Synthetic divide by $(x + 1)$: get $Q(x) = x^2 + x - 6 = (x + 3)(x - 2)$.<br>Therefore $P(x) = (x + 1)(x + 3)(x - 2)$. Roots: $-1, -3, 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8</div><div class="example-body">Show that $P(x) = x^{100} - 1$ is divisible by $(x - 1)$.<br><br><em>By the Factor Theorem:</em> compute $P(1) = 1^{100} - 1 = 0$. Done — $(x - 1)$ is a factor. (In fact $x^n - 1$ is divisible by $(x - 1)$ for every positive integer $n$, and the quotient is $1 + x + x^2 + \\cdots + x^{n-1}$.)</div></div>

<div class="think-box"><div class="think-label">END-OF-LESSON CHECKPOINT</div><div class="think-body">If you can do problems 1&ndash;5 without notes in under five minutes, you have mastered the mechanics. Problem 6 tests whether you can <em>extend</em> the Remainder Theorem to non-linear divisors — a key idea for next lesson. Problems 7&ndash;8 preview Lesson 50, where we systematise the hunt for roots using the Rational Root Theorem.</div></div>

<div class="l-note"><strong>What is next.</strong> Lesson 50 builds factoring techniques on top of this lesson: the Rational Root Theorem narrows down which integer candidates to test, and once you have one root, synthetic division lets you peel off the corresponding linear factor and continue with a polynomial of lower degree. Together with the quadratic formula (for degree 2) you can in principle factor any rational-rooted polynomial completely.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Ders 48&#39;de bir polinomu başka bir polinoma uzun bölme ile bölmeyi öğrendiniz.</strong> Mekanik çalışıyor — bölenden katsayılı katları sürekli çıkararak elinizde kalan polinomun derecesi bölenin derecesinden küçük olana kadar devam ediyorsunuz. Ama uzun bölmenin iki sıkıntısı var. Birincisi, bölen (x &minus; 3) gibi basit bir doğrusal çarpan olduğunda yöntem aşırıdır: cevabı tek satırda veren bir kısa yol mevcut. İkincisi, bazen yalnızca bölmenin <em>kalanı</em> ile ilgileniriz, bölümü hiç gerek duymayız — örneğin bir polinomun başka bir polinomun çarpanı olup olmadığını test ederken. Bu derste her iki kısa yolu da öğreniyoruz. Adları: <strong>Kalan Teoremi</strong>, <strong>Çarpan Teoremi</strong> ve <strong>sentetik bölme</strong>.</p>

<p class="l-text">Bu üç araç sadece sınav hilesi değil; bir polinomun köklerini bulmak için karşılaşacağınız her yöntemin temelidir: rasyonel kök testi, kübik ve kuartik denklemleri çarpanlara ayırma, yüksek dereceli denklemlerin sıfırlarını yerleştirme. Ders sonunda, verilen herhangi bir $P(x)$ polinomu ve herhangi bir $a$ sayısı için, $P(x)$&#39;in $(x - a)$&#39;ya bölümünden kalanı tek bir uzun bölme yazmadan — sadece yerine koyarak — hesaplayabilmeniz gerekir. Ayrıca $(x - a)$&#39;nın $P(x)$&#39;in bir çarpanı olup olmadığını saniyeler içinde sınayabilmelisiniz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Polinom bölme algoritmasını $P(x) = Q(x)\\cdot D(x) + R(x)$ formunda ifade edip bölüm ve kalanı tanımlama</li>
<li>$P(x) \\div (x - a)$ bölümünden kalanı tek adımda $P(a)$ değerini hesaplayarak bulmak için Kalan Teoremi&#39;ni uygulama</li>
<li>$(x - a)$&#39;nın bir polinomun çarpanı olup olmadığına Çarpan Teoremi ile karar verme ve kökleri gözlemle bulma</li>
<li>Doğrusal bölen üzerinde sentetik bölmeyi yürütüp bölüm katsayılarını ve kalanı okuma</li>
<li>Kalan Teoremi&#39;nin $y = P(x)$ grafiği üzerindeki geometrik anlamını tanıma</li>
<li>İki polinom için Bezout özdeşliğini ifade etme ve en büyük ortak böleni (OBEB) ile ilişkilendirme</li>
</ul>
</div>

<h2 class="lesson-title">1. Polinom Bölme Algoritması Hatırlatması</h2>

<div class="calc-highlight"><strong>Ders 48&#39;den:</strong> herhangi iki polinom $P(x)$ (bölünen) ve sıfır olmayan $D(x)$ (bölen) için, $P(x) = Q(x)\\cdot D(x) + R(x)$ ve $\\deg R &lt; \\deg D$ olacak biçimde tek bir $Q(x)$ (bölüm) ve $R(x)$ (kalan) polinom çifti vardır.</div>

<p class="l-text">Bu, tam sayı bölmenin polinom benzeri. $17 = 5\\cdot 3 + 2$ yazdığınızda, 17 = (bölüm 5)&times;(bölen 3) + (kalan 2) ve kalan 2, bölen 3&#39;ten kesin olarak küçük. Polinomlarda da aynı kural geçerli; "küçük" yerine "daha düşük dereceli" diyoruz.</p>

<div class="calc-formula"><div class="formula-label">POLİNOMLAR İÇİN BÖLME ALGORİTMASI</div><div class="formula-main">$$P(x) \\;=\\; Q(x)\\cdot D(x) \\;+\\; R(x), \\qquad \\deg R(x) \\;&lt;\\; \\deg D(x)$$</div><div class="formula-sub">Q ve R, P ile D tarafından tek biçimde belirlenir. D doğrusal (1. dereceden) ise R&#39;nin derecesi 0 olmalı — yani R tek bir sabit sayıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bölünen P(x)</div><div class="card-body">Böldüğümüz polinom. Derecesi en az bölenin derecesi kadardır (aksi halde Q = 0, R = P).</div></div>
<div class="calc-card"><div class="card-title">Bölen D(x)</div><div class="card-body">Neye böldüğümüz. Bu derste çoğunlukla $(x - a)$ formundaki doğrusal bölenler üzerinde yoğunlaşacağız.</div></div>
<div class="calc-card"><div class="card-title">Bölüm Q(x)</div><div class="card-body">Cevabın "ana parçası". Derecesi deg P &minus; deg D&#39;ye eşit.</div></div>
<div class="calc-card"><div class="card-title">Kalan R(x)</div><div class="card-body">Geriye kalan. Derecesi D&#39;nin derecesinden kesin olarak küçük.</div></div>
</div>

<p class="l-text"><strong>Hatırlatma örneği.</strong> $P(x) = x^3 - 2x^2 + 5$ polinomunu $D(x) = x - 3$&#39;e uzun bölme ile bölelim. Bölüneni eksiksiz dizip (eksik $x^1$ terimi için 0 katsayısı ekliyoruz), mevcut bölünenin baş terimini bölenin baş terimine bölmeyi tekrar tekrar yapıyoruz:</p>

<div class="calc-example"><div class="example-label">ÖRNEK (UZUN BÖLME TEKRARI)</div><div class="example-body">$x^3 - 2x^2 + 0\\cdot x + 5$ polinomunu $x - 3$&#39;e bölelim.<br><br>1. Adım: $x^3 \\div x = x^2$. Çarp: $x^2\\cdot(x-3) = x^3 - 3x^2$. Çıkar: $(x^3 - 2x^2) - (x^3 - 3x^2) = x^2$.<br>Aşağı indir: $x^2 + 0\\cdot x$.<br><br>2. Adım: $x^2 \\div x = x$. Çarp: $x\\cdot(x-3) = x^2 - 3x$. Çıkar: $(x^2 + 0\\cdot x) - (x^2 - 3x) = 3x$.<br>Aşağı indir: $3x + 5$.<br><br>3. Adım: $3x \\div x = 3$. Çarp: $3\\cdot(x-3) = 3x - 9$. Çıkar: $(3x + 5) - (3x - 9) = 14$.<br><br>Sonuç: $Q(x) = x^2 + x + 3$, $R = 14$. Kontrol: $(x-3)(x^2 + x + 3) + 14 = x^3 - 2x^2 + 5$. ✓</div></div>

<div class="l-note"><strong>Önemli gözlem:</strong> elde ettiğimiz kalan, $R = 14$, tek bir sabit. Bunun olması zorunluydu çünkü bölen $(x - 3)$ doğrusal, dolayısıyla deg R 1&#39;den küçük olmak zorunda, yani sıfır. Doğrusal bir bölene yapılan her bölmenin kalanı her zaman bir sabittir.</div>

<h2 class="lesson-title">2. Kalan Teoremi</h2>

<div class="calc-highlight"><strong>İşte kısa yol.</strong> Bölen $(x - a)$ olduğunda, $P(x) \\div (x - a)$&#39;nın kalanı tam olarak $P(a)$&#39;dır. Uzun bölmeye gerek yok — sadece $a$&#39;yı polinomda yerine koyun.</div>

<p class="l-text">Yukarıdaki örnekte üç sancılı uzun bölme adımıyla $R = 14$ bulduk. Şimdi Kalan Teoremi ile aynı sonuca nasıl ulaştığımıza bakalım: $P(3) = 3^3 - 2\\cdot 3^2 + 5 = 27 - 18 + 5 = 14$. <strong>Aynı cevap, tek satır.</strong></p>

<div class="calc-formula"><div class="formula-label">KALAN TEOREMİ</div><div class="formula-main">$$P(x) \\;=\\; Q(x)\\cdot(x - a) \\;+\\; R \\quad \\Longrightarrow \\quad R \\;=\\; P(a)$$</div><div class="formula-sub">Kalan R bir sabittir (çünkü bölen doğrusal) ve o sabit tam olarak P&#39;nin x = a noktasındaki değeridir.</div></div>

<p class="l-text">Bu teorem bazen Fransız matematikçi &Eacute;tienne B&eacute;zout&#39;nun (1730&ndash;1783) tam genelliği ile ispatlamasından dolayı <strong>Bezout Kalan Teoremi</strong> olarak da bilinir. Basit doğrusal durum, kullanma oranınız %95&#39;tir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Adım: a&#39;yı belirle</div><div class="card-body">$(x - a)$ böleninden $a$&#39;yı oku. $(x - 3)$ için $a = 3$. $(x + 4) = (x - (-4))$ için $a = -4$ — işarete dikkat!</div></div>
<div class="calc-card"><div class="card-title">2. Adım: P(a)&#39;yı hesapla</div><div class="card-body">$x = a$&#39;yı P&#39;de yerine koy ve sadeleştir. Saf aritmetik, cebir yok.</div></div>
<div class="calc-card"><div class="card-title">3. Adım: cevabı oku</div><div class="card-body">Hesapladığın sayı kalandır. Bitti.</div></div>
</div>

<h2 class="lesson-title">3. Kalan Teoremi&#39;nin Kanıtı</h2>

<p class="l-text">Kanıt tek satırlık — ve teoremin <em>neden</em> işe yaradığını, <em>ki</em> işe yaradığını değil, anlatıyor. $D(x) = x - a$ doğrusal bölenine özelleştirilmiş bölme algoritmasından başla:</p>

<div class="calc-formula"><div class="formula-label">BAŞLANGIÇ NOKTASI</div><div class="formula-main">$$P(x) \\;=\\; Q(x)\\cdot(x - a) \\;+\\; R(x)$$</div><div class="formula-sub">burada deg R(x) &lt; deg(x &minus; a) = 1, yani deg R = 0, dolayısıyla R bir sabit. Onu kısaca R diye yazalım.</div></div>

<p class="l-text">Şimdi her iki tarafta <strong>$x = a$ yerine koy</strong>. Sağ tarafta, $(a - a) = 0$ çarpanı, Q(a)&#39;nın değeri ne olursa olsun tüm $Q(a)\\cdot(a - a)$ terimini sıfırlıyor. Sadece R sabiti hayatta kalıyor:</p>

<div class="calc-formula"><div class="formula-label">YERİNE KOYMA HİLESİ</div><div class="formula-main">$$P(a) \\;=\\; Q(a)\\cdot(a - a) \\;+\\; R \\;=\\; Q(a)\\cdot 0 \\;+\\; R \\;=\\; R$$</div><div class="formula-sub">Dolayısıyla R = P(a). İspatlandı.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Kanıt, Q(x)&#39;in ne olduğu hakkında hiçbir şey söylemiyor. Kalanı çıkarmak için Q&#39;yu <em>bilmemize</em> gerek yok — sadece <em>bir</em> Q&#39;nun varlığını bilmemiz yeterli, onu da bölme algoritması garanti ediyor. Bu yüzden Kalan Teoremi bu kadar ucuz: size R&#39;yi bedava veriyor, Q&#39;yu hesaplamak zorunda kalmadan.</div></div>

<div class="l-note"><strong>Geometrik okuma.</strong> $y = P(x)$ grafiğini çizin. Grafik, $x = a$ düşey doğrusunu $y = P(a)$ yüksekliğinde kesiyor. Kalan Teoremi diyor ki: o yükseklik tam olarak P&#39;yi $(x - a)$&#39;ya böldüğünüzde elde edilen kalandır. Özel olarak, grafik $x = a$&#39;da x-ekseninden geçiyorsa (yani $P(a) = 0$), kalan sıfırdır ve $(x - a)$, P&#39;yi tam olarak böler.</div>

<div class="calc-graph"><div id="plot-l49-remainder-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $P(x) = x^3 - 2x^2 + 5$ grafiği, $x = 3$ düşey doğrusu ve $(3, P(3)) = (3, 14)$ noktası işaretli. O işaretli noktanın y-koordinatı — yani 14 — P&#39;yi $(x - 3)$&#39;e böldüğümüzde elde edilen kalandır. Görselleştirilmiş Kalan Teoremi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=-1+5*i/200;xs.push(x);ys.push(x*x*x-2*x*x+5);}
var curveTR={x:xs,y:ys,mode:'lines',name:'P(x) = x³ − 2x² + 5',line:{color:'#3b82f6',width:3}};
var vlineTR={x:[3,3],y:[-5,30],mode:'lines',name:'x = 3',line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'}};
var hlineTR={x:[-1,3],y:[14,14],mode:'lines',name:'y = P(3) = 14',line:{color:'#10b981',width:1.5,dash:'dot'}};
var pointTR={x:[3],y:[14],mode:'markers+text',name:'(3, 14)',marker:{color:'#10b981',size:12,line:{color:'#0a0a0a',width:2}},text:['  (3, 14)  kalan'],textposition:'middle right',textfont:{color:'#10b981',size:13}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-6,32],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:40,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l49-remainder-tr',[curveTR,vlineTR,hlineTR,pointTR],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Uygulamalar: Uzun Bölme Yapmadan Kalan Hesaplama</h2>

<p class="l-text">Kalan Teoremi, çok adımlı bir uzun bölmeyi tek bir yerine koymaya dönüştürüyor. Akıcılığı geliştirmek için kısa örnekler:</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$P(x) = 2x^4 - 5x^3 + x - 7$ polinomunun $(x - 2)$&#39;ye bölümünden kalanı bulun.<br><br>$a = 2$ olarak belirle.<br>$P(2) = 2\\cdot 16 - 5\\cdot 8 + 2 - 7 = 32 - 40 + 2 - 7 = \\mathbf{-13}$.<br>Kalan $-13$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — İŞARETE DİKKAT</div><div class="example-body">$P(x) = x^3 + 4x^2 - x + 6$ polinomunun $(x + 2)$&#39;ye bölümünden kalanı bulun.<br><br>Böleni yeniden yaz: $(x + 2) = (x - (-2))$, yani $a = -2$.<br>$P(-2) = (-2)^3 + 4(-2)^2 - (-2) + 6 = -8 + 16 + 2 + 6 = \\mathbf{16}$.<br>Kalan $16$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — BİLİNMEYEN KATSAYI</div><div class="example-body">$P(x) = x^3 - kx^2 + 2x - 5$ polinomu $(x - 1)$&#39;e bölündüğünde kalan $1$ ise, $k$ kaçtır?<br><br>Kalan Teoremi ile: $P(1) = 1 - k + 2 - 5 = -2 - k$.<br>1&#39;e eşitle: $-2 - k = 1 \\Rightarrow k = -3$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — İKİ EŞZAMANLI KOŞUL</div><div class="example-body">Bir $P(x)$ polinomu $(x - 1)$&#39;e bölündüğünde $3$, $(x + 1)$&#39;e bölündüğünde $-5$ kalanını verir. $P(x) = ax^2 + bx + c$ formundayken $P(0)$&#39;ı bu verilerle ifade edin.<br><br>$P(1) = a + b + c = 3$ ve $P(-1) = a - b + c = -5$. Topla: $2a + 2c = -2 \\Rightarrow a + c = -1$. Çıkar: $2b = 8 \\Rightarrow b = 4$.<br>$P(0) = c$. Elimizde tek denklem $a + c = -1$ ama iki bilinmeyen $a, c$ — yani daha fazla bilgi olmadan $P(0)$&#39;ı kesinleştiremeyiz. <em>Ders</em>: 2. dereceden bir polinom için iki kalan, üç katsayısından sadece ikisini sabitler.</div></div>

<h2 class="lesson-title">5. Çarpan Teoremi</h2>

<div class="calc-highlight"><strong>Bir $(x - a)$ polinomu, $P(x)$&#39;in çarpanıdır ancak ve ancak $P(a) = 0$ ise.</strong> İşte Çarpan Teoremi, Kalan Teoremi&#39;nin en önemli sonucu.</div>

<p class="l-text">Neden böyle? Çünkü $(x - a)$&#39;nın $P(x)$&#39;in çarpanı olması, bir Q polinomu için $P(x) = Q(x)\\cdot(x - a)$ anlamına gelir — eşdeğer olarak, bölmenin kalanı sıfırdır. Kalan Teoremi&#39;ne göre o kalan $P(a)$&#39;dır. Yani sıfır kalan $\\Leftrightarrow$ $P(a) = 0$.</p>

<div class="calc-formula"><div class="formula-label">ÇARPAN TEOREMİ</div><div class="formula-main">$$(x - a) \\,\\text{ polinomu } P(x) \\text{&#39;i böler} \\quad \\Longleftrightarrow \\quad P(a) \\;=\\; 0$$</div><div class="formula-sub">P&#39;nin kökleri ile P&#39;nin doğrusal çarpanları aynı şeydir, iki farklı açıdan bakılan.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">KÖK BAKIŞ AÇISI</div><div class="compare-item">a, P&#39;nin köküdür demek: $P(a) = 0$</div><div class="compare-item">Fonksiyonun değeri hakkında cebirsel olgu</div><div class="compare-item">Geometrik: grafik $x = a$&#39;da x-eksenini keser</div></div><div class="compare-col"><div class="compare-title">ÇARPAN BAKIŞ AÇISI</div><div class="compare-item">$(x - a)$, P&#39;nin çarpanıdır: $P = Q\\cdot(x - a)$</div><div class="compare-item">Polinomun yapısı hakkında cebirsel olgu</div><div class="compare-item">Faydalı: bir çarpanı koparıp derecesini düşürmeyi sağlar</div></div></div>

<p class="l-text"><strong>Kök avlama.</strong> Bir polinomun "güzel" bir tam sayı kökü olduğundan şüpheleniyorsanız, Çarpan Teoremi aramayı yerine koymaya dönüştürür: $a = 1, -1, 2, -2, \\ldots$ deneyin, hangisi $P(a) = 0$ veriyor diye bakın. Her isabet size bir $(x - a)$ çarpanı verir, onu da bölerek polinomun derecesini düşürebilirsiniz. Bunu Ders 50&#39;de sistematize edeceğiz.</p>

<div class="calc-example"><div class="example-label">ÇARPAN AVI</div><div class="example-body">$P(x) = x^4 - 3x^3 + 2x^2 + x - 1$&#39;in çarpanı $(x - 1)$ midir?<br><br>$P(1) = 1 - 3 + 2 + 1 - 1 = 0$. <strong>Evet</strong>, $(x - 1)$ bir çarpandır.<br><br>$(x + 1)$ çarpan mıdır? $P(-1) = 1 + 3 + 2 - 1 - 1 = 4 \\neq 0$. <strong>Hayır.</strong></div></div>

<h2 class="lesson-title">6. Tam İşlenmiş Örnek: $P(x) = x^3 - 2x^2 + 5$&#39;in $(x - 3)$&#39;e Bölümü</h2>

<p class="l-text">1&ndash;5. bölümleri tek bir polinom üzerinde, <em>üç farklı yöntem</em> ile birleştirip karşılaştıralım.</p>

<div class="calc-example"><div class="example-label">YÖNTEM A — UZUN BÖLME (1. BÖLÜMDEN)</div><div class="example-body">Üç uzun bölme adımının ardından: $Q(x) = x^2 + x + 3$, $R = 14$.<br>Toplam süre: kâğıt üzerinde yaklaşık bir dakika.</div></div>

<div class="calc-example"><div class="example-label">YÖNTEM B — KALAN TEOREMİ</div><div class="example-body">$a = 3$.<br>$P(3) = 27 - 18 + 5 = 14$.<br>Kalan 14. Toplam süre: on saniyenin altında. Ama sadece R&#39;yi aldık, Q&#39;yu değil.</div></div>

<div class="calc-example"><div class="example-label">YÖNTEM C — SENTETİK BÖLME (ÖN BAKIŞ)</div><div class="example-body">Sadece katsayıları kullan: $1, -2, 0, 5$ (eksik $x^1$ terimi için 0 ekledik). 1&#39;i aşağı indir. 3 ile çarp, bir sonraki katsayıya ekle. Tekrarla:<br><br><code>3 │ 1   −2   0    5<br>  │     3   3    9<br>  └───────────────<br>    1   1   3   14</code><br><br>Alt sıra: $1, 1, 3$ bölüm katsayılarıdır (derece 1 düştü, yani $Q(x) = x^2 + x + 3$) ve son sayı, 14, kalandır. <strong>Hem Q hem R&#39;yi tek geçişte</strong> aldık, uzun bölmeden daha hızlı.</div></div>

<p class="l-text"><strong>Karşılaştırma.</strong> Sadece R istiyorsanız Kalan Teoremi en hızlı yoldur. Hem Q hem R istiyorsanız sentetik bölme en hızlısı. Uzun bölme yalnızca bölen doğrusal değilse (örneğin $x^2 + 1$&#39;e bölerken) kaçınılmaz hale gelir.</p>

<h2 class="lesson-title">7. Polinomlar için Bezout Özdeşliği</h2>

<div class="calc-highlight">Tam sayılar için Bezout özdeşliği diyor ki: $a, b \\in \\mathbb{Z}$ için OBEB&#39;leri $\\gcd(a, b) = ua + vb$ olarak bazı $u, v$ tam sayıları için yazılabilir. Aynısı polinomlar için de geçerli.</div>

<p class="l-text">$A(x)$ ve $B(x)$ iki polinom ve $D(x)$ en büyük ortak bölenleri (her ikisini de bölen en yüksek dereceli polinom) olsun. O zaman aşağıdaki gibi $U(x)$ ve $V(x)$ polinomları vardır:</p>

<div class="calc-formula"><div class="formula-label">POLİNOMLAR İÇİN BEZOUT ÖZDEŞLİĞİ</div><div class="formula-main">$$\\gcd(A(x), B(x)) \\;=\\; U(x)\\cdot A(x) \\;+\\; V(x)\\cdot B(x)$$</div><div class="formula-sub">U ve V, A ile B üzerinde Öklid algoritması (bölme algoritmasını tekrarlayarak) yürütülüp geriye doğru yerleştirilerek hesaplanır.</div></div>

<p class="l-text"><strong>Lise için neden önemli?</strong> İki neden. Birincisi, "en sade" ortak çarpanın varlığını gerekçelendiriyor: bir rasyonel ifade $\\frac{A(x)}{B(x)}$&#39;yi en sade haline indirgediğinizde, hem payı hem paydayı OBEB&#39;lerine bölüyorsunuz. İkincisi, cebir ve sayılar teorisinde Bezout özdeşliği, doğrusal Diophant denklemlerini çözmekten sonlu cisimlerde eleman tersi almaya kadar her şeyin motorudur. Polinom versiyonu tam sayı versiyonunu kelimesi kelimesine genelliyor.</p>

<div class="calc-example"><div class="example-label">KISA ÖRNEK</div><div class="example-body">$A(x) = x^2 - 1$ ve $B(x) = x - 1$ olsun. OBEB&#39;leri $(x - 1)$&#39;dir (çünkü $A = (x - 1)(x + 1)$).<br><br>$(x - 1) = U(x)\\cdot(x^2 - 1) + V(x)\\cdot(x - 1)$ olacak şekilde $U, V$ arıyoruz.<br><br>Bir çözüm: $U(x) = 0$, $V(x) = 1$. (Burada önemsiz çünkü B zaten OBEB&#39;e eşit.)<br><br>Daha az önemsiz bir durum: $A(x) = x^3 - 1$, $B(x) = x^2 + x + 1$. $A = (x - 1)(x^2 + x + 1)$ olduğundan OBEB $(x^2 + x + 1)$&#39;dir. Yani yine $U = 0$, $V = 1$. Daha zengin bir örnek için ikisi de eşit olmayan ortak ikinci dereceden çarpana sahip iki polinom gerekir — bu dersin kapsamı dışında ama Ders 51 için iyi bir ön bakış.</div></div>

<div class="l-note"><strong>Çarpan Teoremi ile bağlantı.</strong> $P(a) = 0$ ve $P(b) = 0$ farklı $a, b$ değerleri için sağlanıyorsa, hem $(x - a)$ hem $(x - b)$ P&#39;yi böler. Dolayısıyla $(x - a)(x - b)$ — çarpımları — da P&#39;yi böler. Çarpan Teoremi ve polinomların tek türlü çarpanlara ayrılması, birden fazla kökü tek seferde koparmak için size bedava bir Bezout tarzı yol verir.</div>

<h2 class="lesson-title">8. Sentetik Bölme: Tablo Kısa Yolu</h2>

<div class="calc-highlight"><strong>Sentetik bölme, bir polinomu doğrusal bir $(x - a)$ çarpanına bölmek için en hızlı elle yöntemdir.</strong> Yalnızca baş katsayısı 1 olan doğrusal bölenler için işliyor, ama okul ve sınavlarda en sık karşımıza çıkan bölenler tam da bunlardır.</div>

<p class="l-text">Fikir şu: uzun bölme, zaten orada olduğunu bildiğimiz $x$ kuvvetlerini tekrar tekrar yazarak zaman israfı yapıyor. Sadece <em>katsayıları</em> düzenli bir tabloda izlersek, prosedürü tek bir $a$ sayısıyla toplama ve çarpmalara indirgeyebiliriz.</p>

<div class="calc-formula"><div class="formula-label">SENTETİK BÖLME NE HESAPLAR</div><div class="formula-main">$$P(x) \\;\\div\\; (x - a) \\;=\\; Q(x) \\;+\\; \\frac{R}{x - a}$$</div><div class="formula-sub">Sentetik bölme, Q(x)&#39;in katsayılarını ve sabit R&#39;yi, bu sırayla tablonun alt satırı boyunca döndürür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">Aynı problem için uzun bölmeden 3&ndash;5 kat hızlı. Kalan Teoremi&#39;ne yakın hız, ama size Q&#39;yu da veriyor.</div></div>
<div class="calc-card"><div class="card-title">Kısıtlama</div><div class="card-body">Bölen $(x - a)$ formunda olmak zorunda. $(2x - 3)$ için yöntemi uyarlayabilirsiniz, ama temel hali baş katsayısı 1 gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Çapraz kontrol</div><div class="card-body">Son sayı $P(a)$&#39;ya eşit olmak zorunda. Eşit değilse aritmetik hata yapmışsınızdır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l49-synthetic-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $P(x) = x^3 - 2x^2 + 5$ polinomunun $(x - 3)$&#39;e sentetik bölünmesinin görsel akışı. Her ok bir "3 ile çarp, sonra topla" adımını temsil eder. Baş katsayı (1) ile başla, kalan (14) ile bitir. Ortadaki üç sayı Q(x)&#39;in katsayılarıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var coefs=[1,-2,0,5];
var bottom=[1,1,3,14];
var xpos=[0,1,2,3];
var topT={x:xpos,y:[3,3,3,3],mode:'markers+text',name:'P katsayıları',marker:{color:'#3b82f6',size:32,symbol:'circle'},text:coefs.map(function(c){return String(c);}),textfont:{color:'#0a0a0a',size:14,family:'Geist Mono'},textposition:'middle center'};
var midT={x:[1,2,3],y:[2,2,2],mode:'markers+text',name:'a · önceki (a=3)',marker:{color:'#f59e0b',size:28,symbol:'diamond'},text:['+3','+3','+9'],textfont:{color:'#0a0a0a',size:13,family:'Geist Mono'},textposition:'middle center'};
var botT={x:xpos,y:[1,1,1,1],mode:'markers+text',name:'toplam (Q ve R)',marker:{color:'#10b981',size:32,symbol:'circle'},text:bottom.map(function(c){return String(c);}),textfont:{color:'#0a0a0a',size:14,family:'Geist Mono'},textposition:'middle center'};
var labelsT={x:[-0.5,-0.5,-0.5],y:[3,2,1],mode:'text',name:'',text:['katsayı','×3','toplam'],textfont:{color:'#e8e8e8',size:12},textposition:'middle right',showlegend:false};
var anns=[];
for(var i=1;i<4;i++){anns.push({x:i,y:1.45,ax:i-1,ay:1.55,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowcolor:'#f59e0b',arrowsize:1,arrowwidth:1.2});anns.push({x:i,y:1.6,ax:i,ay:2.55,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowcolor:'#10b981',arrowsize:1,arrowwidth:1.2});}
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,3.6],showgrid:false,showticklabels:false,zeroline:false},yaxis:{range:[0.4,3.6],showgrid:false,showticklabels:false,zeroline:false},margin:{t:20,r:30,b:30,l:30},annotations:anns,legend:{orientation:'h',y:-0.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l49-synthetic-tr',[topT,midT,botT,labelsT],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Sentetik Bölme: Beş Adım</h2>

<p class="l-text">$P(x) = 2x^3 + 3x^2 - 5x + 1$ polinomunu alın ve $(x + 2)$&#39;ye bölün. İşte adım adım tarif.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Adım: a&#39;yı oku</div><div class="card-body">Bölen $(x + 2) = (x - (-2))$, yani $a = -2$. <strong>İşaret değişimine dikkat.</strong></div></div>
<div class="calc-card"><div class="card-title">2. Adım: katsayıları diz</div><div class="card-body">P&#39;nin katsayılarını azalan derece sırasıyla yaz, eksik kuvvetler için 0 ekle. Burada: $2, 3, -5, 1$ (eksik kuvvet yok).</div></div>
<div class="calc-card"><div class="card-title">3. Adım: ilkini aşağı indir</div><div class="card-body">Baş katsayıyı (2) doğrudan alt sıraya kopyala. Bu, Q&#39;nun ilk katsayısı olur.</div></div>
<div class="calc-card"><div class="card-title">4. Adım: çarp ve topla</div><div class="card-body">Alt sıradaki sayıyı $a = -2$ ile çarp, sonucu bir sonraki katsayının altında orta sıraya yaz, sütunu topla. Sonuna kadar tekrarla.</div></div>
<div class="calc-card"><div class="card-title">5. Adım: cevabı oku</div><div class="card-body">Sonuncusu hariç tüm alt sıra sayıları Q&#39;nun katsayılarıdır (derece 1 düştü). Son sayı kalan R = P(a)&#39;dır.</div></div>
</div>

<div class="calc-example"><div class="example-label">BU ÖRNEK İÇİN TAM TABLO</div><div class="example-body"><code>−2 │  2    3    −5    1<br>   │      −4     2    6<br>   └────────────────────<br>      2   −1    −3    7</code><br><br>Yani $Q(x) = 2x^2 - x - 3$ ve $R = 7$.<br><br>Kalan Teoremi ile doğrulama: $P(-2) = 2(-8) + 3(4) - 5(-2) + 1 = -16 + 12 + 10 + 1 = 7$. ✓<br>Geriye çarpma ile doğrulama: $(x + 2)(2x^2 - x - 3) + 7 = 2x^3 - x^2 - 3x + 4x^2 - 2x - 6 + 7 = 2x^3 + 3x^2 - 5x + 1$. ✓</div></div>

<div class="l-note"><strong>Sık yapılan hata:</strong> eksik kuvvetler için 0 koymayı unutmak. $x^4 + 1$&#39;i $(x - 1)$&#39;e bölerseniz, katsayılar $1, 0, 0, 0, 1$ — beş sayı — olmalı, sadece $1, 1$ değil. Sıfırları atlamak, sonraki her çarp-ve-topla&#39;yı bozar.</div>

<div class="calc-graph"><div id="plot-l49-factor-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $P(x) = (x - 1)(x + 2)(x - 3) = x^3 - 2x^2 - 5x + 6$ polinomu mavi, üç kökü $x = 1, -2, 3$ x-ekseninde işaretli. Çarpan Teoremi&#39;ne göre her kök bir doğrusal çarpana karşılık gelir. Her x-ekseni kesişimi, Çarpan Teoremi&#39;nin bir "tıklaması" — grafik tam olarak doğrusal çarpanı sıfırlayan değerlerde $y = 0$&#39;a değiyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var x=-3.5+7*i/300;xs.push(x);ys.push((x-1)*(x+2)*(x-3));}
var curveTR={x:xs,y:ys,mode:'lines',name:'P(x) = (x−1)(x+2)(x−3)',line:{color:'#3b82f6',width:3}};
var rootsTR={x:[1,-2,3],y:[0,0,0],mode:'markers+text',name:'kökler',marker:{color:'#ef4444',size:13,line:{color:'#0a0a0a',width:2}},text:['  x=1','x=−2  ','  x=3'],textposition:['middle right','middle left','middle right'],textfont:{color:'#ef4444',size:13}};
var zeroLineTR={x:[-3.5,3.5],y:[0,0],mode:'lines',name:'y = 0',line:{color:'rgba(255,255,255,0.25)',width:1,dash:'dot'}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.5,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-14,18],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l49-factor-tr',[curveTR,zeroLineTR,rootsTR],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Bunları elle deneyin. Mümkün olduğunda Kalan Teoremi&#39;ni kullanın — uzun bölmeden daha hızlı ve cevabı tek satırda veriyor.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">$P(x) = x^3 - 4x^2 + 6x + 2$ polinomunun $(x - 1)$&#39;e bölümünden kalanı bulun.<br><br><em>Cevap:</em> $P(1) = 1 - 4 + 6 + 2 = 5$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">$P(x) = 2x^4 + x^3 - 3x + 4$ polinomunun $(x + 1)$&#39;e bölümünden kalanı bulun.<br><br><em>Cevap:</em> $P(-1) = 2 - 1 + 3 + 4 = 8$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">$(x - 2)$, $P(x) = x^3 - x^2 - 4x + 4$&#39;ün çarpanı mıdır?<br><br><em>Cevap:</em> $P(2) = 8 - 4 - 8 + 4 = 0$. Evet — $(x - 2)$ bir çarpandır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body">$P(x) = x^3 + kx + 2$ polinomunun çarpanı $(x - 2)$ olacak şekilde $k$ kaçtır?<br><br><em>Cevap:</em> $P(2) = 0 \\Rightarrow 8 + 2k + 2 = 0 \\Rightarrow k = -5$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">$P(x) = x^3 - 6x^2 + 11x - 6$ polinomunu sentetik bölme ile $(x - 1)$&#39;e bölün. $Q$ ve $R$&#39;yi okuyun.<br><br><em>Cevap:</em> Tablo:<br><code>1 │ 1   −6   11   −6<br>  │     1   −5    6<br>  └───────────────<br>    1   −5    6    0</code><br>Yani $Q(x) = x^2 - 5x + 6$ ve $R = 0$. Dolayısıyla $(x - 1)$ çarpandır — ve $Q$, $(x - 2)(x - 3)$ olarak da çarpanlara ayrılır. P&#39;nin kökleri: $1, 2, 3$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body">Bir $P(x)$ polinomu $(x - 2)$&#39;ye bölündüğünde $7$, $(x + 1)$&#39;e bölündüğünde $-5$ kalanını veriyor. $P(x)$&#39;in $(x - 2)(x + 1)$&#39;e bölümünden kalanı bulun.<br><br><em>Strateji:</em> bölen artık ikinci dereceden, yani kalanın derecesi en fazla 1: $R(x) = ax + b$ yaz. O zaman $P(x) = (x - 2)(x + 1)Q(x) + ax + b$. $x = 2$ koy: $7 = 2a + b$. $x = -1$ koy: $-5 = -a + b$. Çöz: $a = 4$, $b = -1$. Kalan $4x - 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7</div><div class="example-body">$P(x) = x^3 + 2x^2 - 5x - 6$ polinomunu önce bir tam sayı kök bularak tamamen çarpanlarına ayırın.<br><br><em>$x = 1$ deneyin:</em> $1 + 2 - 5 - 6 = -8 \\neq 0$. <em>$x = -1$ deneyin:</em> $-1 + 2 + 5 - 6 = 0$ ✓. Yani $(x + 1)$ bir çarpan.<br>$(x + 1)$&#39;e sentetik bölme: $Q(x) = x^2 + x - 6 = (x + 3)(x - 2)$ elde edilir.<br>Dolayısıyla $P(x) = (x + 1)(x + 3)(x - 2)$. Kökler: $-1, -3, 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8</div><div class="example-body">$P(x) = x^{100} - 1$&#39;in $(x - 1)$ ile bölünebildiğini gösterin.<br><br><em>Çarpan Teoremi ile:</em> $P(1) = 1^{100} - 1 = 0$ hesaplayın. Bitti — $(x - 1)$ bir çarpandır. (Aslında her pozitif $n$ tam sayısı için $x^n - 1$, $(x - 1)$&#39;e bölünebilir ve bölüm $1 + x + x^2 + \\cdots + x^{n-1}$&#39;dir.)</div></div>

<div class="think-box"><div class="think-label">DERS SONU KONTROL NOKTASI</div><div class="think-body">Problem 1&ndash;5&#39;i notsuz ve beş dakika içinde yapabiliyorsanız mekanikleri öğrenmişsiniz. Problem 6, Kalan Teoremi&#39;ni doğrusal olmayan bölenlere <em>genişletip</em> genişletemediğinizi test ediyor — bir sonraki dersin anahtar fikri. Problem 7&ndash;8, Rasyonel Kök Teoremi&#39;ni kullanarak kök avını sistemleştirdiğimiz Ders 50&#39;nin ön bakışı.</div></div>

<div class="l-note"><strong>Sırada ne var.</strong> Ders 50 bu dersin üstüne çarpanlara ayırma tekniklerini inşa ediyor: Rasyonel Kök Teoremi hangi tam sayı adaylarının test edileceğini daraltıyor ve bir kökünüz olduğunda sentetik bölme size karşılık gelen doğrusal çarpanı koparıp daha düşük dereceli bir polinomla devam etme imkanı veriyor. İkinci derece denklemler için karekök formülüyle birlikte, rasyonel köklü herhangi bir polinomu prensipte tamamen çarpanlarına ayırabilirsiniz.</div>`
};
