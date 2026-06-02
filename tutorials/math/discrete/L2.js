window.DISCRETE_L2 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A generating function is a piece of algebra that pretends to be a sequence.</strong> You take an infinite list of numbers — Fibonacci, Catalan, the count of derangements, the binomial coefficients of row n — and you smuggle them into the coefficients of a single power series. From that moment on, every combinatorial question about the sequence becomes a question about a function, and the powerful machinery of algebra (polynomial division, partial fractions, quadratic formulas) does the heavy lifting.</p>

<p class="l-text">In this lesson we will build the idea from scratch, learn the four classic encodings, see how multiplication of generating functions corresponds to convolution of sequences, solve the Fibonacci recurrence in closed form by manipulating a power series, derive the Catalan number formula from a quadratic equation, meet the exponential generating function (EGF), use it to count derangements, and then turn to the inclusion-exclusion principle — generating functions' siblings in the combinatorial toolbox — to count surjections and revisit the birthday problem. Throughout, the focus is on the algebraic move: turn a recurrence into an equation, solve the equation, read off the formula.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Encode any sequence (a_0, a_1, a_2, ...) as an ordinary generating function A(x) = sum a_n x^n and treat x purely as a formal symbol</li>
<li>Recognise the four classic encodings — 1/(1-x), (1+x)^n, 1/(1-rx), and (1-x^(n+1))/(1-x) — and know which sequences they hide</li>
<li>Translate sum, product, shift, and derivative of generating functions into the matching operation on sequences</li>
<li>Solve the Fibonacci recurrence by manipulating its OGF and recover Binet's closed-form formula from a partial fraction</li>
<li>Derive the Catalan number formula C_n = C(2n,n)/(n+1) from the quadratic functional equation C(x) = 1 + x C(x)^2</li>
<li>Use the inclusion-exclusion principle to count derangements, surjections, and integers divisible by a given set of primes</li>
</ul>
</div>

<h2 class="lesson-title">1. What is a Generating Function?</h2>

<div class="calc-highlight"><strong>The core idea:</strong> attach the sequence (a_0, a_1, a_2, ...) to the powers of a formal symbol x. The result is one object — a power series A(x) — that carries all the information of the sequence at once. Operations on the sequence become operations on the series.</div>

<p class="l-text">Given any sequence of numbers (a_0, a_1, a_2, ...) — finite or infinite — its <strong>ordinary generating function (OGF)</strong> is the formal power series:</p>

<div class="calc-formula"><div class="formula-label">ORDINARY GENERATING FUNCTION (OGF)</div><div class="formula-main">$$A(x) = a_{0} + a_{1}\\, x + a_{2}\\, x^{2} + a_{3}\\, x^{3} + \\cdots = \\sum_{n \\geq 0} a_{n}\\, x^{n}$$</div><div class="formula-sub">x is a formal symbol — a clothesline on which the coefficients hang. We do not ask whether the series converges; we only manipulate it algebraically.</div></div>

<p class="l-text"><strong>Three things to internalise immediately:</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x is a formal symbol</div><div class="card-body">Do not plug in numbers. Do not worry about radius of convergence. A(x) is a bookkeeping device, like a polynomial of infinite degree. Add, multiply, differentiate it formally — the algebra works whether the series converges or not.</div></div>
<div class="calc-card"><div class="card-title">Coefficient extraction</div><div class="card-body">The notation [x^n] A(x) means "the coefficient of x^n in A(x)" — that is, a_n itself. The whole game is to manipulate A(x) into a known form, then read off [x^n] A(x).</div></div>
<div class="calc-card"><div class="card-title">Two flavours: OGF and EGF</div><div class="card-body">The OGF hangs a_n on x^n. The exponential generating function (EGF) hangs a_n on x^n / n!. We will meet the EGF in section 6; it is the right encoding for labelled structures and permutations.</div></div>
</div>

<div class="l-note"><strong>Why bother?</strong> Because algebra has rules. Once a recurrence relation between sequence terms is expressed as a relation between generating functions, the relation becomes an ordinary algebraic equation — a quadratic, a partial-fraction decomposition, a derivative — and the techniques of high-school algebra take over. The unknown sequence falls out at the end as the Taylor coefficients of a known function.</div>

<p class="l-text">In the next section we meet the four classical generating functions that you will reach for again and again. Memorise them the way you memorise sin(0) = 0 and cos(0) = 1 — they are the basic alphabet.</p>

<h2 class="lesson-title">2. Four Classic Generating Functions</h2>

<p class="l-text">There are four small power series that encode the most useful sequences in combinatorics. Each is worth a moment of inspection — the algebraic identity is what makes the encoding compact.</p>

<div class="calc-formula"><div class="formula-label">THE GEOMETRIC SERIES</div><div class="formula-main">$$\\frac{1}{1 - x} = 1 + x + x^{2} + x^{3} + \\cdots = \\sum_{n \\geq 0} x^{n}$$</div><div class="formula-sub">Encodes the all-ones sequence (1, 1, 1, 1, ...). Every coefficient is 1.</div></div>

<p class="l-text">This is the most important identity in the whole subject. To verify it formally: multiply both sides by (1 - x). The right side telescopes to 1, confirming the identity. Treat the equality as a definition: <em>1/(1-x) is the formal expression we use whenever a sequence is constantly 1</em>.</p>

<div class="calc-formula"><div class="formula-label">THE TRUNCATED ONES</div><div class="formula-main">$$1 + x + x^{2} + \\cdots + x^{n} = \\frac{1 - x^{n+1}}{1 - x}$$</div><div class="formula-sub">Encodes the sequence with n+1 ones followed by zeros: (1, 1, ..., 1, 0, 0, ...). Useful when modelling a counter that maxes out.</div></div>

<div class="calc-formula"><div class="formula-label">THE BINOMIAL THEOREM</div><div class="formula-main">$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}\\, x^{k}$$</div><div class="formula-sub">Encodes a single row of Pascal's triangle: (C(n,0), C(n,1), ..., C(n,n)). The coefficient of x^k is the binomial C(n,k) — the count of k-subsets of n items.</div></div>

<div class="calc-formula"><div class="formula-label">THE GEOMETRIC WITH RATIO r</div><div class="formula-main">$$\\frac{1}{1 - r\\, x} = 1 + r\\, x + r^{2}\\, x^{2} + r^{3}\\, x^{3} + \\cdots = \\sum_{n \\geq 0} r^{n}\\, x^{n}$$</div><div class="formula-sub">Encodes the geometric sequence (1, r, r^2, r^3, ...). For r = 1 it collapses to the all-ones series above; for r = 2 it is (1, 2, 4, 8, ...).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1/(1-x) — constants</div><div class="card-body">All-ones sequence. The starting brick for everything else. Anytime a coefficient pattern collapses to "all 1s," reach for this.</div></div>
<div class="calc-card"><div class="card-title">(1+x)^n — binomials</div><div class="card-body">Row n of Pascal's triangle. The OGF of any "choose k of n" count. The cornerstone of finite combinatorics.</div></div>
<div class="calc-card"><div class="card-title">1/(1-rx) — geometric</div><div class="card-body">Exponential growth. Reach for this whenever the sequence multiplies by a fixed factor each step. Replace r with anything: 2, -1, 1/2, even a complex number.</div></div>
<div class="calc-card"><div class="card-title">(1-x^(n+1))/(1-x) — truncated</div><div class="card-body">Finite counts. Used when the sequence is constant up to a cutoff. Tells the generating function "stop running."</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A SQUARE-AND-CUBE COUNT</div><div class="example-body">Let a_n = the number of ways to climb n steps using 1- or 2-step strides. Then a_n satisfies a_n = a_{n-1} + a_{n-2} with a_0 = a_1 = 1 — the Fibonacci recurrence shifted by 1. Anyone who has seen Fibonacci can already smell the answer. The next two sections will show that the OGF of this sequence is exactly x / (1 - x - x^2), and the closed form is Binet's formula.</div></div>

<div class="calc-graph"><div id="plot-l2-fibonacci-growth-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the first thirty Fibonacci numbers on a linear scale (blue) and a logarithmic scale (orange). On the linear axis they explode after n = 20; on the log axis they form a perfectly straight line with slope log10(phi) approximately 0.209. That straight log line is the visual signature of any sequence with a single dominant geometric mode — exactly what Binet's formula will prove algebraically.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[],fib=[],fibLog=[];var a=0,b=1;
for(var i=0;i<=30;i++){n.push(i);fib.push(a);fibLog.push(a===0?null:Math.log10(a));var c=a+b;a=b;b=c;}
var d1={x:n,y:fib,mode:'lines+markers',name:'F_n (linear axis)',line:{color:'#3b82f6',width:2.6},marker:{size:6,color:'#3b82f6'}};
var d2={x:n,y:fibLog,mode:'lines+markers',name:'log10(F_n) (right axis)',line:{color:'#f59e0b',width:2.6,dash:'dot'},marker:{size:6,color:'#f59e0b'},yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'F_n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'log10(F_n)',overlaying:'y',side:'right',gridcolor:'rgba(0,0,0,0)'},margin:{t:30,r:60,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-fibonacci-growth-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Operations on Generating Functions</h2>

<div class="calc-highlight"><strong>The dictionary:</strong> every elementary operation on a power series corresponds to a transformation of the underlying sequence. Memorise the dictionary and you can read combinatorial identities directly off algebraic ones.</div>

<p class="l-text">Suppose A(x) = sum a_n x^n and B(x) = sum b_n x^n. The basic operations are:</p>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.18);border-radius:8px;overflow:hidden">
<thead><tr style="background:rgba(59,130,246,0.12)"><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">OPERATION ON A(x)</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">EFFECT ON SEQUENCE (a_n)</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">PLAIN MEANING</th></tr></thead>
<tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A(x) + B(x)</td><td style="padding:0.6rem 1rem">a_n + b_n</td><td style="padding:0.6rem 1rem">Termwise sum</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">c &middot; A(x) where c is constant</td><td style="padding:0.6rem 1rem">c &middot; a_n</td><td style="padding:0.6rem 1rem">Scale every coefficient by c</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">x &middot; A(x)</td><td style="padding:0.6rem 1rem">a_{n-1} (with a_{-1} = 0)</td><td style="padding:0.6rem 1rem">Right shift the sequence by one</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">x^k &middot; A(x)</td><td style="padding:0.6rem 1rem">a_{n-k}</td><td style="padding:0.6rem 1rem">Right shift by k slots</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A(x) &middot; B(x)</td><td style="padding:0.6rem 1rem">sum_{k=0..n} a_k b_{n-k} (convolution)</td><td style="padding:0.6rem 1rem">Multiply the two sequences term by term, summing</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A'(x) (formal derivative)</td><td style="padding:0.6rem 1rem">(n+1) a_{n+1}</td><td style="padding:0.6rem 1rem">Shift left, multiply by index</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">x &middot; A'(x)</td><td style="padding:0.6rem 1rem">n &middot; a_n</td><td style="padding:0.6rem 1rem">Multiply each coefficient by its position index</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A(x) / (1 - x)</td><td style="padding:0.6rem 1rem">sum_{k=0..n} a_k</td><td style="padding:0.6rem 1rem">Cumulative (partial sum) sequence</td></tr>
</tbody></table>

<p class="l-text">The convolution rule deserves a moment alone. If you multiply two power series, the coefficient of x^n in the product is</p>

<div class="calc-formula"><div class="formula-label">CONVOLUTION (CAUCHY PRODUCT)</div><div class="formula-main">$$[x^{n}]\\, A(x) B(x) = \\sum_{k=0}^{n} a_{k}\\, b_{n-k}$$</div><div class="formula-sub">The coefficient of x^n in A times B is obtained by pairing each a_k with b_{n-k}. This is exactly the convolution operation of signal processing.</div></div>

<div class="calc-example"><div class="example-label">A QUICK DERIVATION</div><div class="example-body">Take A(x) = B(x) = 1/(1-x) = 1 + x + x^2 + .... Then A(x) B(x) = 1/(1-x)^2. By the convolution rule, [x^n] in the product = sum_{k=0..n} 1*1 = n + 1.<br><br>So 1/(1-x)^2 = sum_{n &gt;= 0} (n+1) x^n = 1 + 2x + 3x^2 + 4x^3 + .... The OGF of the sequence (1, 2, 3, 4, ...) is 1/(1-x)^2. One line of algebra has given us a brand-new encoding.</div></div>

<div class="l-note"><strong>The general identity</strong> 1/(1-x)^{k+1} = sum C(n+k, k) x^n encodes Pascal's diagonals. We will not derive it here, but the same convolution argument extended to k factors produces it. In ML this identity appears as the OGF of the count of compositions of n into k+1 non-negative integer parts — useful in any combinatorial decomposition problem.</div>

<h2 class="lesson-title">4. Solving Linear Recurrences with the OGF — Fibonacci</h2>

<div class="calc-highlight"><strong>The trick we are about to learn is the central skill of the whole lesson.</strong> Take a linear recurrence. Multiply each term by x^n. Sum. Recognise A(x), x A(x), x^2 A(x), and similar shifts on the left. Solve the resulting algebraic equation for A(x). Decompose by partial fractions and read off the closed form.</div>

<p class="l-text">Fibonacci is the textbook example. Define</p>

<div class="calc-formula"><div class="formula-label">FIBONACCI RECURRENCE</div><div class="formula-main">$$F_{0} = 0, \\quad F_{1} = 1, \\quad F_{n} = F_{n-1} + F_{n-2} \\text{ for } n \\geq 2$$</div><div class="formula-sub">Each term is the sum of the previous two. The sequence is 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ....</div></div>

<p class="l-text">Let <code>A(x) = sum_{n &gt;= 0} F_n x^n</code> be the OGF. Multiply the recurrence by <code>x^n</code> and sum over <code>n &gt;= 2</code>:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Sum the recurrence weighted by x^n</div><div class="step-detail">sum_{n &gt;= 2} F_n x^n = sum_{n &gt;= 2} F_{n-1} x^n + sum_{n &gt;= 2} F_{n-2} x^n.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Re-index each piece in terms of A(x)</div><div class="step-detail">Left side: A(x) - F_0 - F_1 x = A(x) - x. First right sum: x sum_{m &gt;= 1} F_m x^m = x(A(x) - F_0) = x A(x). Second right sum: x^2 sum_{m &gt;= 0} F_m x^m = x^2 A(x).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Assemble the algebraic equation</div><div class="step-detail">A(x) - x = x A(x) + x^2 A(x). Group all A(x) on one side: A(x) (1 - x - x^2) = x. Therefore A(x) = x / (1 - x - x^2). One line of algebra, and the OGF is in our hands.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">FIBONACCI OGF</div><div class="formula-main">$$A(x) = \\sum_{n \\geq 0} F_{n}\\, x^{n} = \\frac{x}{1 - x - x^{2}}$$</div><div class="formula-sub">The entire infinite Fibonacci sequence sits inside this one rational function. To extract F_n we need to expand it as a power series — and partial fractions is the right tool.</div></div>

<p class="l-text"><strong>Partial fractions for a closed form.</strong> Factor the denominator. The roots of <code>x^2 + x - 1 = 0</code> (note the sign flip when we rearrange <code>1 - x - x^2 = 0</code>) lead, with care, to the golden-ratio pair:</p>

<div class="calc-formula"><div class="formula-label">GOLDEN RATIO AND ITS CONJUGATE</div><div class="formula-main">$$\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618, \\qquad \\psi = \\frac{1 - \\sqrt{5}}{2} \\approx -0.618$$</div><div class="formula-sub">The golden ratio phi and its algebraic conjugate psi. Both are roots of t^2 - t - 1 = 0; equivalently, 1/phi and 1/psi are the roots of 1 - x - x^2 = 0.</div></div>

<p class="l-text">Writing <code>1 - x - x^2 = (1 - \\varphi x)(1 - \\psi x)</code> and decomposing:</p>

<div class="calc-formula"><div class="formula-label">PARTIAL FRACTION DECOMPOSITION</div><div class="formula-main">$$\\frac{x}{1 - x - x^{2}} = \\frac{1}{\\sqrt{5}} \\left( \\frac{1}{1 - \\varphi\\, x} - \\frac{1}{1 - \\psi\\, x} \\right)$$</div><div class="formula-sub">Two geometric series, each of which we already know how to expand: 1/(1 - r x) = sum r^n x^n.</div></div>

<p class="l-text">Extract the coefficient of <code>x^n</code> from each geometric piece and combine. The result is the closed form known as <strong>Binet's formula</strong>:</p>

<div class="calc-formula"><div class="formula-label">BINET'S FORMULA</div><div class="formula-main">$$F_{n} = \\frac{\\varphi^{n} - \\psi^{n}}{\\sqrt{5}}$$</div><div class="formula-sub">An exact, non-recursive formula for the n-th Fibonacci number. Since |psi| &lt; 1, the second term shrinks rapidly; F_n is the nearest integer to phi^n / sqrt(5).</div></div>

<div class="l-note"><strong>What just happened.</strong> A recurrence (an inductive definition) was turned into an algebraic equation, the equation was solved in closed form, and the closed form was a power series whose coefficients are exact integers despite being built from irrational golden-ratio powers. The OGF was the bridge.</div>

<div class="calc-example"><div class="example-label">A NUMERICAL CHECK</div><div class="example-body">Take n = 10. phi^10 / sqrt(5) approximately 122.99... and psi^10 / sqrt(5) approximately -0.0089.... Difference approximately 55.0. And indeed F_10 = 55. The arithmetic is exact because the irrational parts cancel exactly.</div></div>

<h2 class="lesson-title">5. Solving Linear Recurrences — Catalan Numbers</h2>

<div class="calc-highlight"><strong>Catalan numbers</strong> count many things: balanced parenthesis strings of length 2n, binary trees with n internal nodes, monotonic lattice paths that do not cross the diagonal, ways to triangulate an (n+2)-gon. They satisfy a <em>non-linear</em> recurrence — and yet generating functions still crack them, because the recurrence is a convolution.</div>

<p class="l-text">The Catalan numbers are defined by</p>

<div class="calc-formula"><div class="formula-label">CATALAN RECURRENCE</div><div class="formula-main">$$C_{0} = 1, \\qquad C_{n+1} = \\sum_{k=0}^{n} C_{k}\\, C_{n-k} \\text{ for } n \\geq 0$$</div><div class="formula-sub">The first ten Catalans: 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862. Notice the convolution on the right — exactly the Cauchy-product pattern from section 3.</div></div>

<p class="l-text">Let <code>C(x) = sum_{n &gt;= 0} C_n x^n</code>. The convolution on the right of the recurrence is precisely <code>C(x)^2</code>. Multiplying the recurrence by <code>x^{n+1}</code> and summing:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Identify the convolution</div><div class="step-detail">sum_{n &gt;= 0} C_{n+1} x^{n+1} = sum_{n &gt;= 0} ( sum_k C_k C_{n-k} ) x^{n+1} = x &middot; C(x)^2.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Identify the left side</div><div class="step-detail">sum_{n &gt;= 0} C_{n+1} x^{n+1} = C(x) - C_0 = C(x) - 1.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Read off the functional equation</div><div class="step-detail">C(x) - 1 = x C(x)^2, i.e. x C(x)^2 - C(x) + 1 = 0. A quadratic equation in C(x).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">QUADRATIC FOR C(x)</div><div class="formula-main">$$x\\, C(x)^{2} - C(x) + 1 = 0$$</div><div class="formula-sub">Treat C(x) as the unknown and apply the quadratic formula with a = x, b = -1, c = 1.</div></div>

<p class="l-text">The quadratic formula gives <code>C(x) = (1 \\pm \\sqrt{1 - 4 x}) / (2 x)</code>. The plus sign yields a function that diverges as x → 0 (its limit blows up), incompatible with C(0) = C_0 = 1. The minus sign passes the test: a Taylor expansion at x = 0 begins 1 + x + 2 x^2 + 5 x^3 + .... So:</p>

<div class="calc-formula"><div class="formula-label">CATALAN OGF</div><div class="formula-main">$$C(x) = \\frac{1 - \\sqrt{1 - 4 x}}{2 x}$$</div><div class="formula-sub">Extracting [x^n] from this rather exotic-looking expression takes one more identity: the generalised binomial series for (1 - 4x)^{1/2}.</div></div>

<p class="l-text">Using the generalised binomial theorem and simplifying carefully, the coefficient extraction collapses to one of the most elegant closed forms in combinatorics:</p>

<div class="calc-formula"><div class="formula-label">CATALAN CLOSED FORM</div><div class="formula-main">$$C_{n} = \\frac{1}{n+1}\\, \\binom{2 n}{n}$$</div><div class="formula-sub">Central binomial coefficient divided by n+1. Equivalently C_n = C(2n,n) - C(2n,n+1).</div></div>

<div class="calc-graph"><div id="plot-l2-catalan-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the first fifteen Catalan numbers on a log scale. The straight-line behaviour confirms that C_n grows like 4^n / (n^(3/2) sqrt(pi)) — the dominant exponential factor 4^n shows up as a constant slope on the log axis, with the n^(3/2) correction nibbling at it. This is sharply faster than Fibonacci's phi^n approximately 1.618^n.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[],cat=[];var c=1;
for(var i=0;i<=15;i++){n.push(i);cat.push(c);c=c*2*(2*i+1)/(i+2);}
var d1={x:n,y:cat,mode:'lines+markers',name:'C_n (log scale)',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'C_n',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-catalan-en',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Where Catalans show up in computer science.</strong> The number of distinct binary search trees on n keys, the number of correct nesting patterns for n pairs of parentheses, the number of ways to triangulate an n-gon, the number of stack-sortable permutations of length n, and the number of monotone lattice paths from (0,0) to (n,n) staying weakly below the diagonal — all C_n. A single OGF identity unifies them all.</div>

<h2 class="lesson-title">6. Exponential Generating Functions (EGFs)</h2>

<div class="calc-highlight"><strong>The OGF is the right tool for unlabelled, sequential structures.</strong> When the objects are <em>labelled</em> — when re-ordering matters, as in permutations — the natural encoding divides each coefficient by n!. The resulting power series is the <strong>exponential generating function</strong>.</div>

<p class="l-text">For a sequence <code>(a_n)</code>, the EGF is</p>

<div class="calc-formula"><div class="formula-label">EXPONENTIAL GENERATING FUNCTION</div><div class="formula-main">$$\\hat{A}(x) = \\sum_{n \\geq 0} a_{n}\\, \\frac{x^{n}}{n!}$$</div><div class="formula-sub">The same coefficient sequence, but hung on x^n / n! rather than x^n. Particularly natural for permutation-counting problems.</div></div>

<p class="l-text">Three benchmark EGFs to remember:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">a_n = 1 for all n</div><div class="card-body">EGF = sum x^n / n! = e^x. The exponential function is the EGF of the constant-one sequence.</div></div>
<div class="calc-card"><div class="card-title">a_n = n!</div><div class="card-body">EGF = sum n! &middot; x^n / n! = sum x^n = 1 / (1 - x). The number of permutations of an n-set is n!; its EGF is 1/(1-x), which is also the OGF of the all-ones sequence. The factorial cancels.</div></div>
<div class="calc-card"><div class="card-title">a_n = (-1)^n</div><div class="card-body">EGF = sum (-x)^n / n! = e^{-x}. The "sign-alternating" sequence is the EGF e^{-x}; useful in inclusion-exclusion.</div></div>
</div>

<p class="l-text"><strong>EGF product rule.</strong> If <code>\\hat{A}(x)</code> is the EGF of <code>(a_n)</code> and <code>\\hat{B}(x)</code> is the EGF of <code>(b_n)</code>, then the product <code>\\hat{A}(x) \\hat{B}(x)</code> is the EGF of the sequence</p>

<div class="calc-formula"><div class="formula-label">EGF CONVOLUTION</div><div class="formula-main">$$c_{n} = \\sum_{k=0}^{n} \\binom{n}{k}\\, a_{k}\\, b_{n-k}$$</div><div class="formula-sub">The binomial-weighted convolution. Each term counts ways to split an n-set into a labelled k-piece and a labelled (n-k)-piece, then attach an A-structure to one and a B-structure to the other.</div></div>

<div class="l-note"><strong>Algorithm-analysis aside (real, not forced).</strong> Concrete Mathematics by Graham, Knuth, and Patashnik develops large portions of algorithm analysis through generating functions; the average-case running time of quicksort, the expected length of cycles in random permutations, and many cache-miss expectations are computed exactly this way. The derangement count below is the cleanest illustration of why labelled structures want the EGF rather than the OGF.</div>

<h2 class="lesson-title">7. Derangements via EGF and Inclusion-Exclusion</h2>

<div class="calc-highlight"><strong>A derangement</strong> of an n-element set is a permutation that fixes no element — sigma(i) is never equal to i. How many are there? The two cleanest routes give two different proofs of the same identity, and one is the EGF route we have just built up.</div>

<p class="l-text">Let D_n be the number of derangements of n. First, an <strong>inclusion-exclusion</strong> derivation. Let A_i be the set of permutations of [n] with sigma(i) = i (i is fixed). We want the count of permutations in <em>none</em> of the A_i. By inclusion-exclusion:</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENTS BY INCLUSION-EXCLUSION</div><div class="formula-main">$$D_{n} = n! \\sum_{k=0}^{n} \\frac{(-1)^{k}}{k!}$$</div><div class="formula-sub">Each binomial term C(n,k) cancels with one factorial, leaving the elegant alternating sum.</div></div>

<p class="l-text">Second, an <strong>EGF</strong> derivation. Every permutation either has some set of fixed points or no fixed points. If we let <code>\\hat{D}(x)</code> be the EGF of <code>(D_n)</code> and remember that <code>e^x</code> is the EGF of "any selection of elements as fixed points" and <code>1 / (1 - x)</code> is the EGF of "all permutations," the labelled-product structure gives:</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENT EGF</div><div class="formula-main">$$\\hat{D}(x) = \\frac{e^{-x}}{1 - x}$$</div><div class="formula-sub">A product of two known EGFs. Expanding it in a Taylor series at x = 0 yields exactly the inclusion-exclusion formula above — the two derivations are equivalent.</div></div>

<p class="l-text">A striking corollary. As n grows, the sum sum_{k=0..n} (-1)^k / k! approaches e^{-1} approximately 0.3679 (it is the Taylor expansion of e^{-x} at x = 1). Therefore</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENT LIMIT</div><div class="formula-main">$$\\lim_{n \\to \\infty} \\frac{D_{n}}{n!} = \\frac{1}{e} \\approx 0.3679$$</div><div class="formula-sub">About 36.79% of all permutations of a large set are derangements. The convergence is extraordinarily fast — by n = 7 the ratio is already accurate to four decimal places.</div></div>

<div class="calc-graph"><div id="plot-l2-derangement-ratio-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the ratio D_n / n! plotted against n for n = 0..15, with the horizontal dashed line at 1/e approximately 0.3679 indicating the asymptote. The ratio oscillates around 1/e for the first few n (because the alternating series is truncated) but converges to the limit so quickly that by n = 7 the dot is visually on the line. Every "random permutation" simulation will reproduce this 36.79% figure.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[],rat=[];var d=1,f=1;rat.push(1);n.push(0);
for(var i=1;i<=15;i++){d=i*d+(i%2===0?1:-1);f=f*i;n.push(i);rat.push(d/f);}
var d1={x:n,y:rat,mode:'lines+markers',name:'D_n / n!',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var asy={x:[0,15],y:[1/Math.E,1/Math.E],mode:'lines',name:'1/e approximately 0.3679',line:{color:'#f59e0b',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'D_n / n!',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.05]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-derangement-ratio-en',[d1,asy],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The "hat-check problem" / "secret Santa" question.</strong> If n people put their hats into a basket and then each grabs a random hat, what is the probability that <em>nobody</em> retrieves their own hat? Exactly D_n / n!, which is approximately 36.79% for any moderate n. A counterintuitive constant: it does not vanish, and it does not approach 1; it sits stubbornly near 1/e regardless of the group size.</div>

<h2 class="lesson-title">8. The Inclusion-Exclusion Principle in Detail</h2>

<div class="calc-highlight"><strong>The principle:</strong> to count the size of a union of finite sets, add the sizes of each, subtract the sizes of pairwise intersections (you over-counted those), add back the triple intersections (you under-corrected), and so on, with alternating signs. Each correction undoes the previous one's over- or under-counting.</div>

<div class="calc-formula"><div class="formula-label">INCLUSION-EXCLUSION FORMULA</div><div class="formula-main">$$\\left| A_{1} \\cup A_{2} \\cup \\cdots \\cup A_{n} \\right| = \\sum_{\\emptyset \\neq S \\subseteq [n]} (-1)^{|S|+1}\\, \\left| \\bigcap_{i \\in S} A_{i} \\right|$$</div><div class="formula-sub">Sum over every non-empty subset S of indices, with a sign that flips each time |S| changes parity. The first three layers are the most common in practice.</div></div>

<p class="l-text">Written out for the first three orders:</p>

<div class="calc-formula"><div class="formula-label">FIRST THREE TERMS</div><div class="formula-main">$$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$</div><div class="formula-sub">Add singles, subtract pairs, add the triple. For n sets the pattern continues, with signs (-1)^{|S|+1}.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DIVISIBILITY IN [1, 100]</div><div class="example-body"><strong>How many integers in 1..100 are divisible by 2, 3, or 5?</strong><br><br>Let A_2, A_3, A_5 be the sets of multiples.<br>|A_2| = floor(100/2) = 50, |A_3| = 33, |A_5| = 20.<br>|A_2 cap A_3| = floor(100/6) = 16, |A_2 cap A_5| = 10, |A_3 cap A_5| = 6.<br>|A_2 cap A_3 cap A_5| = floor(100/30) = 3.<br><br>By inclusion-exclusion: |union| = 50 + 33 + 20 - 16 - 10 - 6 + 3 = <strong>74</strong>.<br><br>So 74 of the integers 1..100 are divisible by at least one of 2, 3, 5; the remaining 26 are coprime to 30 — and they correspond exactly to the units modulo 30 repeated within each block.</div></div>

<div class="calc-graph"><div id="plot-l2-iep-divisibility-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a stacked bar diagram of the inclusion-exclusion arithmetic for the divisibility question. The first three bars are the singleton counts (50, 33, 20 — added with a plus sign). The next three are the pairwise overlaps (16, 10, 6 — subtracted). The last bar is the triple overlap (3 — added back). The running total at the right edge is 74, the final answer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['|A2|','|A3|','|A5|','|A2 cap A3|','|A2 cap A5|','|A3 cap A5|','|A2 cap A3 cap A5|','union'];
var vals=[50,33,20,16,10,6,3,74];
var colors=['#3b82f6','#3b82f6','#3b82f6','#f87171','#f87171','#f87171','#10b981','#f59e0b'];
var d1={x:labels,y:vals,type:'bar',name:'count',marker:{color:colors},text:vals.map(function(v){return String(v);}),textposition:'auto',textfont:{color:'#0a0a0a',size:13}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',tickangle:-30},yaxis:{title:'count',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:80,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},showlegend:false};
Plotly.newPlot('plot-l2-iep-divisibility-en',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Sieve interpretation.</strong> Inclusion-exclusion is the formal basis of every elementary sieve in number theory — the count of primes up to N via the sieve of Eratosthenes, the count of squarefree integers (via Mobius mu), and many other classical results. The Mobius function is just inclusion-exclusion's signs distilled into a number-theoretic disguise.</div>

<h2 class="lesson-title">9. Surjections and Stirling Numbers of the Second Kind</h2>

<div class="calc-highlight"><strong>How many surjections (onto functions) are there from an n-element set to a k-element set?</strong> Direct counting is hard; we want to count functions whose image is the whole codomain. Inclusion-exclusion handles it: count all functions, subtract those that miss element 1, subtract those that miss element 2, add back those that miss both, and so on.</div>

<p class="l-text">There are k^n total functions from [n] to [k]. Let B_i be the functions that miss codomain element i. By inclusion-exclusion, the count of surjections is</p>

<div class="calc-formula"><div class="formula-label">NUMBER OF SURJECTIONS</div><div class="formula-main">$$\\mathrm{Surj}(n, k) = \\sum_{j=0}^{k} (-1)^{j}\\, \\binom{k}{j}\\, (k - j)^{n}$$</div><div class="formula-sub">Functions from n to k minus those missing at least one codomain element — corrected with alternating signs.</div></div>

<p class="l-text">A related object — the <strong>Stirling number of the second kind</strong> S(n, k) — counts the number of ways to partition a set of n labelled elements into exactly k non-empty unlabelled blocks. Since surjections correspond to ordered partitions (labelled blocks) and there are k! ways to order k blocks:</p>

<div class="calc-formula"><div class="formula-label">STIRLING S(n, k) FROM SURJECTIONS</div><div class="formula-main">$$S(n, k) = \\frac{1}{k!} \\sum_{j=0}^{k} (-1)^{j}\\, \\binom{k}{j}\\, (k - j)^{n} = \\frac{\\mathrm{Surj}(n, k)}{k!}$$</div><div class="formula-sub">Strip the labelling from the codomain by dividing through by k!. The Stirling numbers count <em>unordered</em> partitions; the surjection count multiplies them by k! to recover the ordered version.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S(n, 1) = 1</div><div class="card-body">Only one way to partition n items into one non-empty block: the whole set.</div></div>
<div class="calc-card"><div class="card-title">S(n, n) = 1</div><div class="card-body">Only one way to partition n items into n singleton blocks: each block is one element.</div></div>
<div class="calc-card"><div class="card-title">S(n, 2) = 2^(n-1) - 1</div><div class="card-body">Choose any non-empty proper subset for one block (2^n - 2 options) and divide by 2 because the two blocks are unordered.</div></div>
<div class="calc-card"><div class="card-title">Recurrence</div><div class="card-body">S(n, k) = k S(n-1, k) + S(n-1, k-1). Either drop element n into an existing block (k choices), or start a new singleton block containing n.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-stirling-heatmap-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a heatmap of S(n, k) on a log color scale for n = 1..10 and k = 1..10. The diagonal is all 1s (S(n,n)=1). Below the diagonal the values are zero (cannot partition n items into more than n blocks). The off-diagonal interior peaks in mid-range k for each row — for example S(10, 4) approximately 34105 is the maximum of row 10. This is the discrete analogue of the central limit phenomenon: most partitions of n use a moderate number of blocks.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=10;var S=[];for(var i=0;i<=N;i++){var row=[];for(var j=0;j<=N;j++)row.push(0);S.push(row);}
S[0][0]=1;
for(var n=1;n<=N;n++){for(var k=1;k<=n;k++){S[n][k]=k*S[n-1][k]+S[n-1][k-1];}}
var z=[],xLabels=[],yLabels=[];
for(var n=1;n<=N;n++){var row=[];for(var k=1;k<=N;k++){row.push(S[n][k]>0?Math.log10(S[n][k]+1):null);}z.push(row);yLabels.push('n='+n);}
for(var k=1;k<=N;k++)xLabels.push('k='+k);
var d1={z:z,x:xLabels,y:yLabels,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.2,'#1e3a8a'],[0.5,'#3b82f6'],[0.8,'#93c5fd'],[1,'#fbbf24']],colorbar:{title:'log10(S+1)',titleside:'right',tickfont:{color:'#e8e8e8'},titlefont:{color:'#e8e8e8'}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{gridcolor:'rgba(255,255,255,0.07)',side:'bottom'},yaxis:{gridcolor:'rgba(255,255,255,0.07)',autorange:'reversed'},margin:{t:30,r:30,b:50,l:60}};
Plotly.newPlot('plot-l2-stirling-heatmap-en',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l2-surjection-growth-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the count of surjections Surj(n, k) for k = 2, 3, 4, 5 plotted against n on a log scale. Each curve is roughly straight, with slope log10(k). For fixed k, the count grows like k^n (with a slowly varying correction); for very small n &lt; k the count is zero (no surjection possible).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binom(n,r){if(r<0||r>n)return 0;var v=1;for(var i=0;i<r;i++)v=v*(n-i)/(i+1);return v;}
function surj(n,k){var s=0;for(var j=0;j<=k;j++){s+=Math.pow(-1,j)*binom(k,j)*Math.pow(k-j,n);}return s;}
var ns=[];for(var i=1;i<=14;i++)ns.push(i);
var traces=[];var colors=['#f87171','#f59e0b','#10b981','#3b82f6'];
[2,3,4,5].forEach(function(k,idx){
  var ys=ns.map(function(n){var v=surj(n,k);return v>0?v:null;});
  traces.push({x:ns,y:ys,mode:'lines+markers',name:'k='+k,line:{color:colors[idx],width:2.4},marker:{size:6,color:colors[idx]}});
});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'Surj(n,k)',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-surjection-growth-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Probabilistic Inclusion-Exclusion — The Birthday Problem</h2>

<div class="calc-highlight"><strong>The birthday problem.</strong> In a room of n people, what is the probability that at least two share a birthday? The standard derivation uses complementary counting (all distinct), but inclusion-exclusion gives a direct path and exposes the structure: every collision pattern is one term in an alternating sum.</div>

<p class="l-text">Assuming 365 equally likely birthdays and independence, the probability that <em>all</em> n birthdays are distinct is</p>

<div class="calc-formula"><div class="formula-label">PROBABILITY ALL DISTINCT</div><div class="formula-main">$$P(\\text{all distinct}) = \\frac{365 \\cdot 364 \\cdots (365 - n + 1)}{365^{n}}$$</div><div class="formula-sub">So P(at least one collision) = 1 - this. The famous crossover at n = 23 (probability above 50%) follows.</div></div>

<p class="l-text">An equivalent inclusion-exclusion derivation: let <code>A_{i, j}</code> be the event that persons i and j share a birthday. Then</p>

<div class="calc-formula"><div class="formula-label">DIRECT INCLUSION-EXCLUSION</div><div class="formula-main">$$P\\left( \\bigcup_{i &lt; j} A_{i, j} \\right) = \\sum_{k=1}^{\\binom{n}{2}} (-1)^{k+1} \\sum P\\left( A_{i_{1} j_{1}} \\cap \\cdots \\cap A_{i_{k} j_{k}} \\right)$$</div><div class="formula-sub">The full expansion is unwieldy, but for small n the first two terms approximate the truth well: about C(n,2) / 365 minus a small correction.</div></div>

<div class="calc-example"><div class="example-label">FIRST-ORDER APPROXIMATION</div><div class="example-body">For n = 23 the first-order Bonferroni term is C(23, 2) / 365 = 253 / 365 approximately 0.693. That over-estimates because it ignores the over-count where two pairs coincide. The true probability is about 0.507. Inclusion-exclusion's second-order correction lops off most of the gap; the third order is essentially negligible by n = 23.</div></div>

<div class="l-note"><strong>The birthday paradox in cryptography.</strong> A hash function that produces b-bit outputs is collision-vulnerable after about 2^(b/2) inputs, because the same birthday-style counting applies (the so-called "birthday bound"). SHA-1, with 160-bit outputs, was retired when collision attacks reached 2^80 work. This is one of the few places where inclusion-exclusion shows up directly in applied cryptanalysis, no extra justification needed.</div>

<h2 class="lesson-title">11. Cycle Index and Pólya Counting — A Brief Glimpse</h2>

<div class="calc-highlight"><strong>What if symmetries matter?</strong> Counting necklaces with k colours of beads, distinct chemical isomers, or graph isomorphism classes asks for counts <em>up to a group of symmetries</em>. Burnside's lemma and the Pólya enumeration theorem extend inclusion-exclusion to this setting; we only sketch the idea here.</div>

<p class="l-text"><strong>Burnside's lemma.</strong> If a finite group G acts on a set X, the number of orbits is the average number of fixed points across G:</p>

<div class="calc-formula"><div class="formula-label">BURNSIDE'S LEMMA</div><div class="formula-main">$$|X / G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^{g}|$$</div><div class="formula-sub">|X^g| is the number of elements of X fixed by g. The orbit count is the average fix-count — a beautifully clean equation.</div></div>

<div class="calc-example"><div class="example-label">A NECKLACE WARM-UP</div><div class="example-body"><strong>How many distinct necklaces have 4 beads, each black or white, under the rotation group of order 4?</strong> The 16 total colourings are acted on by 4 rotations. Identity fixes all 16. Rotation by 90 fixes only the 2 monochromatic necklaces. Rotation by 180 fixes 4 (any colouring of opposite-pair classes). Rotation by 270 fixes 2. Burnside: (16 + 2 + 4 + 2) / 4 = <strong>6</strong> distinct necklaces. Try enumerating them by hand — you will find exactly 6.</div></div>

<div class="l-note"><strong>Pólya's theorem</strong> upgrades Burnside's count by tracking how many beads of each colour appear, via the "cycle index polynomial" of the group action. The result is a generating function in several variables whose coefficients give the count of necklaces with prescribed colour multiplicities. This is the deepest part of classical combinatorics; entire textbooks (Stanley's Enumerative Combinatorics) treat it in depth. Here we only flag its existence — the techniques you have just learned compose into something even stronger when symmetry enters.</div>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>Things to try.</strong> Crank <code>fib_naive</code> up to n = 35 and watch its time grow exponentially — at n = 40 it takes seconds on a modern CPU. <code>fib_dp</code> handles n = 1000 in milliseconds, but loses to <code>fib_matrix</code> for n = 100000. <code>fib_binet</code> is fastest of all but lies to you at large n because floating-point loses precision; compare its output with <code>fib_dp</code> for n = 80 and you will see disagreement. Change the prime list in the inclusion-exclusion routine to [2, 3, 5, 7, 11, 13]: the count of coprime numbers in 1..1000 should equal Euler's totient phi(30030) appropriately scaled — confirming that the IE sum and Euler's product formula are two sides of the same coin.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">A generating function is a power series whose coefficients are the terms of a sequence; the symbol x is formal, with no convergence concerns. The four classic OGFs (1/(1-x), (1+x)^n, 1/(1-rx), and (1-x^(n+1))/(1-x)) form an alphabet from which most elementary sequence encodings are built, and the operations (sum, product, shift, derivative) translate to clean transformations of the underlying sequence. The Cauchy product of generating functions corresponds to convolution of sequences — exactly the structure that makes linear recurrences solvable: multiply each term of the recurrence by x^n, sum, recognise A(x) and its shifts, and a single algebraic equation pops out. For Fibonacci that equation is A(x) = x / (1 - x - x^2), and partial fractions yield Binet's closed form. For Catalan numbers the equation is C(x) = 1 + x C(x)^2, a quadratic whose minus-root gives the OGF and the elegant C_n = C(2n,n)/(n+1) after a generalised binomial expansion. The exponential generating function divides by n!, naturally encoding labelled structures: e^x for the all-ones sequence, 1/(1-x) for n!, and the elegant e^{-x}/(1-x) for derangements, which yields the famous D_n/n! → 1/e asymptote. Inclusion-exclusion is the second main tool of this lesson — a signed alternating sum that counts unions of overlapping sets. It produces the derangement formula, the surjection count k! S(n, k), and the divisibility count we computed for [1, 100]. The Stirling numbers S(n, k) count unordered partitions and obey a clean two-term recurrence. Burnside's lemma and Pólya enumeration extend inclusion-exclusion to symmetry-respecting counts, the deepest classical chapter of combinatorics. Throughout, the algebraic move is the same: write the recurrence as an equation, solve the equation, read off the formula.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Üreteç fonksiyonu, bir dizinin kılığına bürünen küçük bir cebir parçasıdır.</strong> Sonsuz bir sayı listesini — Fibonacci'yi, Catalan'ı, derangement sayısını, n'inci satırın binom katsayılarını — alıp tek bir kuvvet serisinin katsayıları arasına gizlersiniz. O andan itibaren dizi hakkındaki her kombinatoryel soru bir fonksiyon sorusuna dönüşür ve cebrin güçlü makinesi (polinom bölümü, kısmi kesirler, ikinci derece denklem formülü) ağır işi üstlenir.</p>

<p class="l-text">Bu derste fikri sıfırdan inşa edeceğiz; dört klasik kodlamayı öğreneceğiz; iki üreteç fonksiyonunun çarpımının iki dizinin konvolüsyonuna karşılık geldiğini göreceğiz; Fibonacci tekrarlamasını bir kuvvet serisini cebirsel olarak işleyerek kapalı formda çözeceğiz; Catalan sayısı formülünü ikinci derece bir denklemden türeteceğiz; üstel üreteç fonksiyonuyla (EGF) tanışacağız ve onunla derangement sayılarını sayacağız. Sonra üreteç fonksiyonlarının kombinatoryel araç kutusundaki kız kardeşi olan içerme-dışlama prensibine döneceğiz: surjeksiyonları sayacağız ve doğum günü problemine yeniden bakacağız. Tüm ders boyunca odak cebirsel hamledir: tekrarlamayı bir denkleme dönüştür, denklemi çöz, formülü oku.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir (a_0, a_1, a_2, ...) dizisini sıradan üreteç fonksiyonu A(x) = sum a_n x^n olarak kodlayın ve x'i sadece formal bir sembol olarak işleyin</li>
<li>Dört klasik kodlamayı tanıyın — 1/(1-x), (1+x)^n, 1/(1-rx) ve (1-x^(n+1))/(1-x) — ve hangi dizileri sakladıklarını bilin</li>
<li>Üreteç fonksiyonlarının toplam, çarpım, kaydırma ve türev işlemlerini altta yatan dizinin eşleşen dönüşümüne tercüme edin</li>
<li>Fibonacci tekrarlamasını OGF'sini işleyerek çözün ve kısmi kesirden Binet'in kapalı form formülünü geri kazanın</li>
<li>C(x) = 1 + x C(x)^2 ikinci derece fonksiyonel denkleminden C_n = C(2n,n)/(n+1) Catalan formülünü türetin</li>
<li>İçerme-dışlama prensibini kullanarak derangement'ları, surjeksiyonları ve verilen bir asal kümesine bölünen tam sayıları sayın</li>
</ul>
</div>

<h2 class="lesson-title">1. Üreteç Fonksiyonu Nedir?</h2>

<div class="calc-highlight"><strong>Temel fikir:</strong> (a_0, a_1, a_2, ...) dizisini formal bir x sembolünün kuvvetlerine bağlayın. Sonuç tek bir nesnedir — bir A(x) kuvvet serisi — ve dizinin tüm bilgisini bir defada taşır. Dizi üzerindeki işlemler seri üzerindeki işlemlere dönüşür.</div>

<p class="l-text">Verilen herhangi bir (a_0, a_1, a_2, ...) sayı dizisi için — sonlu veya sonsuz — onun <strong>sıradan üreteç fonksiyonu (OGF)</strong> şu formal kuvvet serisidir:</p>

<div class="calc-formula"><div class="formula-label">SIRADAN ÜRETEÇ FONKSİYONU (OGF)</div><div class="formula-main">$$A(x) = a_{0} + a_{1}\\, x + a_{2}\\, x^{2} + a_{3}\\, x^{3} + \\cdots = \\sum_{n \\geq 0} a_{n}\\, x^{n}$$</div><div class="formula-sub">x formal bir semboldür — katsayıların asılı durduğu bir çamaşır ipi. Serinin yakınsadığını sormayız; sadece cebirsel olarak işleriz.</div></div>

<p class="l-text"><strong>Hemen içselleştirmeniz gereken üç şey:</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x formal bir semboldür</div><div class="card-body">İçine sayı koymayın. Yakınsaklık yarıçapı hakkında endişelenmeyin. A(x), sonsuz dereceli bir polinom gibi bir kayıt tutma aracıdır. Yakınsasın ya da yakınsamasın, onu formal olarak toplayın, çarpın, türevini alın — cebir işler.</div></div>
<div class="calc-card"><div class="card-title">Katsayı çıkarma</div><div class="card-body">[x^n] A(x) notasyonu "A(x) içindeki x^n katsayısı" anlamına gelir — yani a_n'in kendisi. Tüm oyun A(x)'i bilinen bir forma sokmak ve sonra [x^n] A(x)'i okumaktır.</div></div>
<div class="calc-card"><div class="card-title">İki çeşit: OGF ve EGF</div><div class="card-body">OGF, a_n'i x^n'e asar. Üstel üreteç fonksiyonu (EGF) ise a_n'i x^n / n!'e asar. EGF ile 6. bölümde tanışacağız; etiketli yapılar ve permütasyonlar için doğru kodlamadır.</div></div>
</div>

<div class="l-note"><strong>Neden uğraşıyoruz?</strong> Çünkü cebrin kuralları var. Dizi terimleri arasındaki bir tekrarlama bağıntısı üreteç fonksiyonları arasındaki bir bağıntı olarak ifade edildiğinde, bağıntı sıradan bir cebirsel denkleme dönüşür — ikinci derece bir denklem, bir kısmi-kesir ayrıştırması, bir türev — ve lise cebrinin teknikleri devralır. Bilinmeyen dizi sonunda bilinen bir fonksiyonun Taylor katsayıları olarak ortaya çıkar.</div>

<p class="l-text">Bir sonraki bölümde tekrar tekrar başvuracağınız dört klasik üreteç fonksiyonuyla tanışacağız. Bunları sin(0) = 0 ve cos(0) = 1'i ezberlediğiniz gibi ezberleyin — temel alfabedir.</p>

<h2 class="lesson-title">2. Dört Klasik Üreteç Fonksiyonu</h2>

<p class="l-text">Kombinatorikteki en yararlı dizileri kodlayan dört küçük kuvvet serisi vardır. Her biri bir an için incelemeye değer — cebirsel özdeşlik kodlamayı kompakt yapan şeydir.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRİK SERİ</div><div class="formula-main">$$\\frac{1}{1 - x} = 1 + x + x^{2} + x^{3} + \\cdots = \\sum_{n \\geq 0} x^{n}$$</div><div class="formula-sub">Tüm-birler dizisini (1, 1, 1, 1, ...) kodlar. Her katsayı 1'dir.</div></div>

<p class="l-text">Bu, tüm konunun en önemli özdeşliğidir. Formal olarak doğrulamak için her iki tarafı da (1 - x) ile çarpın. Sağ taraf 1'e teleskoplaşır ve özdeşliği doğrular. Eşitliği bir tanım olarak kabul edin: <em>1/(1-x), bir dizinin sabit 1 olduğu her durumda kullandığımız formal ifadedir</em>.</p>

<div class="calc-formula"><div class="formula-label">KESİLMİŞ BİRLER</div><div class="formula-main">$$1 + x + x^{2} + \\cdots + x^{n} = \\frac{1 - x^{n+1}}{1 - x}$$</div><div class="formula-sub">n+1 tane bir ve ardından sıfırlardan oluşan diziyi kodlar: (1, 1, ..., 1, 0, 0, ...). Sınıra ulaşan bir sayaç modellemek için yararlıdır.</div></div>

<div class="calc-formula"><div class="formula-label">BİNOM TEOREMİ</div><div class="formula-main">$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}\\, x^{k}$$</div><div class="formula-sub">Pascal üçgeninin tek bir satırını kodlar: (C(n,0), C(n,1), ..., C(n,n)). x^k'nin katsayısı C(n,k) binomudur — n öğenin k-altkümelerinin sayısıdır.</div></div>

<div class="calc-formula"><div class="formula-label">r ORANLI GEOMETRİK</div><div class="formula-main">$$\\frac{1}{1 - r\\, x} = 1 + r\\, x + r^{2}\\, x^{2} + r^{3}\\, x^{3} + \\cdots = \\sum_{n \\geq 0} r^{n}\\, x^{n}$$</div><div class="formula-sub">Geometrik diziyi (1, r, r^2, r^3, ...) kodlar. r = 1 için yukarıdaki tüm-birler serisine çöker; r = 2 için (1, 2, 4, 8, ...)'dir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1/(1-x) — sabitler</div><div class="card-body">Tüm-birler dizisi. Diğer her şey için başlangıç tuğlası. Bir katsayı deseni "hepsi 1"e çöktüğünde buna başvurun.</div></div>
<div class="calc-card"><div class="card-title">(1+x)^n — binomlar</div><div class="card-body">Pascal üçgeninin n. satırı. Her "n'den k seç" sayımının OGF'si. Sonlu kombinatoriğin köşe taşı.</div></div>
<div class="calc-card"><div class="card-title">1/(1-rx) — geometrik</div><div class="card-body">Üstel büyüme. Dizi her adımda sabit bir faktörle çarpıldığında buna başvurun. r'yi neyle isterseniz değiştirin: 2, -1, 1/2, hatta karmaşık sayı.</div></div>
<div class="calc-card"><div class="card-title">(1-x^(n+1))/(1-x) — kesilmiş</div><div class="card-body">Sonlu sayımlar. Dizi bir kesim noktasına kadar sabit olduğunda kullanılır. Üreteç fonksiyonuna "koşmayı bırak" der.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KARE-VE-KÜP SAYIMI</div><div class="example-body">a_n = n basamağı 1- veya 2-adımlı atlayışlarla tırmanmanın yol sayısı olsun. O zaman a_0 = a_1 = 1 ile a_n = a_{n-1} + a_{n-2} sağlanır — 1 kayıklı Fibonacci tekrarlaması. Fibonacci görmüş herkes cevabın kokusunu alabilir. Sonraki iki bölüm bu dizinin OGF'sinin tam olarak x / (1 - x - x^2) ve kapalı formun Binet formülü olduğunu gösterecek.</div></div>

<div class="calc-graph"><div id="plot-l2-fibonacci-growth-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> ilk otuz Fibonacci sayısı doğrusal eksende (mavi) ve logaritmik eksende (turuncu). Doğrusal eksende n = 20'den sonra patlarlar; log eksende eğimi yaklaşık log10(phi) yaklaşık 0.209 olan tamamen düz bir çizgi oluştururlar. Bu düz log çizgisi, tek bir baskın geometrik moda sahip her dizinin görsel imzasıdır — tam olarak Binet formülünün cebirsel olarak kanıtlayacağı şey.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[],fib=[],fibLog=[];var a=0,b=1;
for(var i=0;i<=30;i++){n.push(i);fib.push(a);fibLog.push(a===0?null:Math.log10(a));var c=a+b;a=b;b=c;}
var d1={x:n,y:fib,mode:'lines+markers',name:'F_n (doğrusal eksen)',line:{color:'#3b82f6',width:2.6},marker:{size:6,color:'#3b82f6'}};
var d2={x:n,y:fibLog,mode:'lines+markers',name:'log10(F_n) (sağ eksen)',line:{color:'#f59e0b',width:2.6,dash:'dot'},marker:{size:6,color:'#f59e0b'},yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'F_n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'log10(F_n)',overlaying:'y',side:'right',gridcolor:'rgba(0,0,0,0)'},margin:{t:30,r:60,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-fibonacci-growth-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Üreteç Fonksiyonları Üzerindeki İşlemler</h2>

<div class="calc-highlight"><strong>Sözlük:</strong> bir kuvvet serisi üzerindeki her temel işlem, altta yatan dizinin bir dönüşümüne karşılık gelir. Sözlüğü ezberleyin ve kombinatoryel özdeşlikleri doğrudan cebirsel olanlardan okuyabilirsiniz.</div>

<p class="l-text">A(x) = sum a_n x^n ve B(x) = sum b_n x^n varsayalım. Temel işlemler şunlardır:</p>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.18);border-radius:8px;overflow:hidden">
<thead><tr style="background:rgba(59,130,246,0.12)"><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">A(x) ÜZERİNDE İŞLEM</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">(a_n) DİZİSİ ÜZERİNDEKİ ETKİ</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">DÜZ ANLAMI</th></tr></thead>
<tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A(x) + B(x)</td><td style="padding:0.6rem 1rem">a_n + b_n</td><td style="padding:0.6rem 1rem">Terim-terim toplam</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">c &middot; A(x), c sabit</td><td style="padding:0.6rem 1rem">c &middot; a_n</td><td style="padding:0.6rem 1rem">Her katsayıyı c ile ölçeklendir</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">x &middot; A(x)</td><td style="padding:0.6rem 1rem">a_{n-1} (a_{-1} = 0 ile)</td><td style="padding:0.6rem 1rem">Diziyi bir slot sağa kaydır</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">x^k &middot; A(x)</td><td style="padding:0.6rem 1rem">a_{n-k}</td><td style="padding:0.6rem 1rem">k slot sağa kaydır</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A(x) &middot; B(x)</td><td style="padding:0.6rem 1rem">sum_{k=0..n} a_k b_{n-k} (konvolüsyon)</td><td style="padding:0.6rem 1rem">İki diziyi terim-terim çarpıp topla</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A'(x) (formal türev)</td><td style="padding:0.6rem 1rem">(n+1) a_{n+1}</td><td style="padding:0.6rem 1rem">Sola kaydır, indise göre çarp</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">x &middot; A'(x)</td><td style="padding:0.6rem 1rem">n &middot; a_n</td><td style="padding:0.6rem 1rem">Her katsayıyı kendi konum indisiyle çarp</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">A(x) / (1 - x)</td><td style="padding:0.6rem 1rem">sum_{k=0..n} a_k</td><td style="padding:0.6rem 1rem">Kümülatif (kısmi toplam) dizisi</td></tr>
</tbody></table>

<p class="l-text">Konvolüsyon kuralı tek başına bir dakika hak ediyor. İki kuvvet serisini çarparsanız, çarpımda x^n'in katsayısı şudur:</p>

<div class="calc-formula"><div class="formula-label">KONVOLÜSYON (CAUCHY ÇARPIMI)</div><div class="formula-main">$$[x^{n}]\\, A(x) B(x) = \\sum_{k=0}^{n} a_{k}\\, b_{n-k}$$</div><div class="formula-sub">A çarpı B'de x^n'in katsayısı, her a_k'yı b_{n-k} ile eşleştirerek elde edilir. Bu tam olarak sinyal işlemenin konvolüsyon işlemidir.</div></div>

<div class="calc-example"><div class="example-label">HIZLI BİR TÜRETME</div><div class="example-body">A(x) = B(x) = 1/(1-x) = 1 + x + x^2 + ... alın. O zaman A(x) B(x) = 1/(1-x)^2. Konvolüsyon kuralı gereği, çarpımdaki [x^n] = sum_{k=0..n} 1*1 = n + 1.<br><br>Yani 1/(1-x)^2 = sum_{n &gt;= 0} (n+1) x^n = 1 + 2x + 3x^2 + 4x^3 + .... (1, 2, 3, 4, ...) dizisinin OGF'si 1/(1-x)^2'dir. Tek satırlık cebir bize yepyeni bir kodlama verdi.</div></div>

<div class="l-note"><strong>Genel özdeşlik</strong> 1/(1-x)^{k+1} = sum C(n+k, k) x^n Pascal'ın köşegenlerini kodlar. Burada türetmeyeceğiz, ama k faktöre genişletilmiş aynı konvolüsyon argümanı bunu üretir. ML'de bu özdeşlik, n'in k+1 negatif olmayan tam sayı parçaya bileşimlerinin sayısının OGF'si olarak görünür — herhangi bir kombinatoryel ayrıştırma probleminde yararlı.</div>

<h2 class="lesson-title">4. OGF ile Doğrusal Tekrarlamaları Çözme — Fibonacci</h2>

<div class="calc-highlight"><strong>Birazdan öğreneceğimiz numara, tüm dersin merkez becerisidir.</strong> Doğrusal bir tekrarlama alın. Her terimi x^n ile çarpın. Toplayın. Sol tarafta A(x), x A(x), x^2 A(x) ve benzer kaymaları tanıyın. Ortaya çıkan cebirsel denklemi A(x) için çözün. Kısmi kesirlerle ayrıştırın ve kapalı formu okuyun.</div>

<p class="l-text">Fibonacci ders kitabı örneğidir. Şöyle tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">FIBONACCI TEKRARLAMASI</div><div class="formula-main">$$F_{0} = 0, \\quad F_{1} = 1, \\quad F_{n} = F_{n-1} + F_{n-2} \\text{ ve } n \\geq 2$$</div><div class="formula-sub">Her terim önceki ikisinin toplamıdır. Dizi 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ....</div></div>

<p class="l-text"><code>A(x) = sum_{n &gt;= 0} F_n x^n</code> OGF olsun. Tekrarlamayı <code>x^n</code> ile çarpın ve <code>n &gt;= 2</code> üzerinden toplayın:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Tekrarlamayı x^n ile ağırlıklandırıp topla</div><div class="step-detail">sum_{n &gt;= 2} F_n x^n = sum_{n &gt;= 2} F_{n-1} x^n + sum_{n &gt;= 2} F_{n-2} x^n.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Her parçayı A(x) cinsinden yeniden indeksle</div><div class="step-detail">Sol taraf: A(x) - F_0 - F_1 x = A(x) - x. Birinci sağ toplam: x sum_{m &gt;= 1} F_m x^m = x(A(x) - F_0) = x A(x). İkinci sağ toplam: x^2 sum_{m &gt;= 0} F_m x^m = x^2 A(x).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Cebirsel denklemi kur</div><div class="step-detail">A(x) - x = x A(x) + x^2 A(x). Tüm A(x)'leri bir tarafta grupla: A(x) (1 - x - x^2) = x. Yani A(x) = x / (1 - x - x^2). Tek satır cebir ve OGF elimizde.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">FIBONACCI OGF'Sİ</div><div class="formula-main">$$A(x) = \\sum_{n \\geq 0} F_{n}\\, x^{n} = \\frac{x}{1 - x - x^{2}}$$</div><div class="formula-sub">Tüm sonsuz Fibonacci dizisi bu tek rasyonel fonksiyonun içinde oturur. F_n'i çıkarmak için onu bir kuvvet serisi olarak açmamız gerekir — ve kısmi kesirler doğru araçtır.</div></div>

<p class="l-text"><strong>Kapalı form için kısmi kesirler.</strong> Paydayı çarpanlarına ayırın. <code>x^2 + x - 1 = 0</code>'ın kökleri (<code>1 - x - x^2 = 0</code>'ı yeniden düzenlerken işaret değişimine dikkat) dikkatle altın oran çiftine götürür:</p>

<div class="calc-formula"><div class="formula-label">ALTIN ORAN VE EŞLENİĞİ</div><div class="formula-main">$$\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618, \\qquad \\psi = \\frac{1 - \\sqrt{5}}{2} \\approx -0.618$$</div><div class="formula-sub">Altın oran phi ve cebirsel eşleniği psi. Her ikisi de t^2 - t - 1 = 0'ın kökleri; eşdeğer olarak, 1/phi ve 1/psi 1 - x - x^2 = 0'ın kökleridir.</div></div>

<p class="l-text"><code>1 - x - x^2 = (1 - \\varphi x)(1 - \\psi x)</code> yazıp ayrıştırarak:</p>

<div class="calc-formula"><div class="formula-label">KISMİ KESİR AYRIŞIMI</div><div class="formula-main">$$\\frac{x}{1 - x - x^{2}} = \\frac{1}{\\sqrt{5}} \\left( \\frac{1}{1 - \\varphi\\, x} - \\frac{1}{1 - \\psi\\, x} \\right)$$</div><div class="formula-sub">Her birini zaten nasıl açacağımızı bildiğimiz iki geometrik seri: 1/(1 - r x) = sum r^n x^n.</div></div>

<p class="l-text">Her geometrik parçadan <code>x^n</code> katsayısını çıkarıp birleştirin. Sonuç <strong>Binet formülü</strong> olarak bilinen kapalı formdur:</p>

<div class="calc-formula"><div class="formula-label">BİNET FORMÜLÜ</div><div class="formula-main">$$F_{n} = \\frac{\\varphi^{n} - \\psi^{n}}{\\sqrt{5}}$$</div><div class="formula-sub">n'inci Fibonacci sayısı için kesin, tekrarlamaya dayanmayan formül. |psi| &lt; 1 olduğundan, ikinci terim hızla küçülür; F_n, phi^n / sqrt(5)'e en yakın tam sayıdır.</div></div>

<div class="l-note"><strong>Az önce ne oldu?</strong> Bir tekrarlama (tümevarımlı bir tanım) cebirsel bir denkleme dönüştü, denklem kapalı formda çözüldü ve kapalı form, irrasyonel altın-oran kuvvetlerinden inşa edilmiş olmasına rağmen katsayıları tam sayılar olan bir kuvvet serisi oldu. OGF köprüydü.</div>

<div class="calc-example"><div class="example-label">SAYISAL KONTROL</div><div class="example-body">n = 10 alın. phi^10 / sqrt(5) yaklaşık 122.99... ve psi^10 / sqrt(5) yaklaşık -0.0089.... Fark yaklaşık 55.0. Ve gerçekten F_10 = 55. Aritmetik tamdır çünkü irrasyonel parçalar tam olarak sönerler.</div></div>

<h2 class="lesson-title">5. Doğrusal Tekrarlamaları Çözme — Catalan Sayıları</h2>

<div class="calc-highlight"><strong>Catalan sayıları</strong> birçok şeyi sayar: uzunluğu 2n olan dengeli parantez dizileri, n iç düğümlü ikili ağaçlar, köşegeni geçmeyen monoton kafes yolları, bir (n+2)-genin üçgenlemeleri. Bir <em>doğrusal olmayan</em> tekrarlamayı sağlarlar — yine de üreteç fonksiyonları onları kırar, çünkü tekrarlama bir konvolüsyondur.</div>

<p class="l-text">Catalan sayıları şöyle tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">CATALAN TEKRARLAMASI</div><div class="formula-main">$$C_{0} = 1, \\qquad C_{n+1} = \\sum_{k=0}^{n} C_{k}\\, C_{n-k} \\text{ , } n \\geq 0$$</div><div class="formula-sub">İlk on Catalan: 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862. Sağ taraftaki konvolüsyona dikkat edin — 3. bölümden tam olarak Cauchy-çarpımı deseni.</div></div>

<p class="l-text"><code>C(x) = sum_{n &gt;= 0} C_n x^n</code> olsun. Tekrarlamanın sağındaki konvolüsyon tam olarak <code>C(x)^2</code>'dir. Tekrarlamayı <code>x^{n+1}</code> ile çarpıp toplayın:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Konvolüsyonu tanı</div><div class="step-detail">sum_{n &gt;= 0} C_{n+1} x^{n+1} = sum_{n &gt;= 0} ( sum_k C_k C_{n-k} ) x^{n+1} = x &middot; C(x)^2.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sol tarafı tanı</div><div class="step-detail">sum_{n &gt;= 0} C_{n+1} x^{n+1} = C(x) - C_0 = C(x) - 1.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Fonksiyonel denklemi oku</div><div class="step-detail">C(x) - 1 = x C(x)^2, yani x C(x)^2 - C(x) + 1 = 0. C(x) cinsinden ikinci derece bir denklem.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">C(x) İÇİN İKİNCİ DERECE DENKLEM</div><div class="formula-main">$$x\\, C(x)^{2} - C(x) + 1 = 0$$</div><div class="formula-sub">C(x)'i bilinmeyen olarak kabul edin ve a = x, b = -1, c = 1 ile ikinci derece denklem formülünü uygulayın.</div></div>

<p class="l-text">İkinci derece denklem formülü <code>C(x) = (1 \\pm \\sqrt{1 - 4 x}) / (2 x)</code> verir. Artı işareti, x → 0'a giderken ıraksayan bir fonksiyon verir (limiti patlar), C(0) = C_0 = 1 ile uyumsuz. Eksi işareti testi geçer: x = 0'da Taylor açılımı 1 + x + 2 x^2 + 5 x^3 + ... olarak başlar. Yani:</p>

<div class="calc-formula"><div class="formula-label">CATALAN OGF'Sİ</div><div class="formula-main">$$C(x) = \\frac{1 - \\sqrt{1 - 4 x}}{2 x}$$</div><div class="formula-sub">Bu oldukça egzotik görünüşlü ifadeden [x^n]'i çıkarmak bir özdeşlik daha alır: (1 - 4x)^{1/2} için genelleştirilmiş binom serisi.</div></div>

<p class="l-text">Genelleştirilmiş binom teoremini kullanıp dikkatli bir şekilde sadeleştirerek, katsayı çıkarımı kombinatoriğin en zarif kapalı formlarından birine çöker:</p>

<div class="calc-formula"><div class="formula-label">CATALAN KAPALI FORMU</div><div class="formula-main">$$C_{n} = \\frac{1}{n+1}\\, \\binom{2 n}{n}$$</div><div class="formula-sub">Merkezi binom katsayısı bölü n+1. Eşdeğer olarak C_n = C(2n,n) - C(2n,n+1).</div></div>

<div class="calc-graph"><div id="plot-l2-catalan-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> ilk on beş Catalan sayısı log ekseninde. Düz çizgi davranışı, C_n'in 4^n / (n^(3/2) sqrt(pi)) gibi büyüdüğünü doğrular — baskın üstel faktör 4^n log ekseninde sabit bir eğim olarak görünür, n^(3/2) düzeltmesi onu hafifçe çiğnemektedir. Bu Fibonacci'nin phi^n yaklaşık 1.618^n'inden çok daha hızlıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[],cat=[];var c=1;
for(var i=0;i<=15;i++){n.push(i);cat.push(c);c=c*2*(2*i+1)/(i+2);}
var d1={x:n,y:cat,mode:'lines+markers',name:'C_n (log eksen)',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'C_n',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-catalan-tr',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Catalan'ların bilgisayar biliminde göründüğü yerler.</strong> n anahtar üzerinde farklı ikili arama ağaçlarının sayısı, n çift parantez için doğru iç içe geçme desenlerinin sayısı, n-genin üçgenleme sayısı, uzunluğu n olan yığın-sıralanabilir permütasyonların sayısı ve (0,0)'dan (n,n)'e köşegenin altında zayıfça kalan monoton kafes yollarının sayısı — hepsi C_n. Tek bir OGF özdeşliği hepsini birleştirir.</div>

<h2 class="lesson-title">6. Üstel Üreteç Fonksiyonları (EGF)</h2>

<div class="calc-highlight"><strong>OGF, etiketsiz ardışık yapılar için doğru araçtır.</strong> Nesneler <em>etiketli</em> olduğunda — permütasyonlarda olduğu gibi yeniden sıralama önemli olduğunda — doğal kodlama her katsayıyı n!'e böler. Ortaya çıkan kuvvet serisi <strong>üstel üreteç fonksiyonudur</strong>.</div>

<p class="l-text">Bir <code>(a_n)</code> dizisi için EGF şudur:</p>

<div class="calc-formula"><div class="formula-label">ÜSTEL ÜRETEÇ FONKSİYONU</div><div class="formula-main">$$\\hat{A}(x) = \\sum_{n \\geq 0} a_{n}\\, \\frac{x^{n}}{n!}$$</div><div class="formula-sub">Aynı katsayı dizisi, ama x^n yerine x^n / n!'e asılı. Özellikle permütasyon sayma problemleri için doğal.</div></div>

<p class="l-text">Hatırlanması gereken üç referans EGF:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">tüm n için a_n = 1</div><div class="card-body">EGF = sum x^n / n! = e^x. Üstel fonksiyon, sabit-bir dizisinin EGF'sidir.</div></div>
<div class="calc-card"><div class="card-title">a_n = n!</div><div class="card-body">EGF = sum n! &middot; x^n / n! = sum x^n = 1 / (1 - x). n-kümenin permütasyon sayısı n!'dir; EGF'si 1/(1-x), bu da tüm-birler dizisinin OGF'sidir. Faktöriyel söner.</div></div>
<div class="calc-card"><div class="card-title">a_n = (-1)^n</div><div class="card-body">EGF = sum (-x)^n / n! = e^{-x}. "İşaret-alternatif" dizi EGF e^{-x}'dir; içerme-dışlamada yararlı.</div></div>
</div>

<p class="l-text"><strong>EGF çarpım kuralı.</strong> <code>\\hat{A}(x)</code> <code>(a_n)</code>'in EGF'si ve <code>\\hat{B}(x)</code> <code>(b_n)</code>'in EGF'si ise, çarpım <code>\\hat{A}(x) \\hat{B}(x)</code> şu dizinin EGF'sidir:</p>

<div class="calc-formula"><div class="formula-label">EGF KONVOLÜSYONU</div><div class="formula-main">$$c_{n} = \\sum_{k=0}^{n} \\binom{n}{k}\\, a_{k}\\, b_{n-k}$$</div><div class="formula-sub">Binom-ağırlıklı konvolüsyon. Her terim, n-kümeyi etiketli bir k-parçaya ve etiketli bir (n-k)-parçaya bölüp birine A-yapı diğerine B-yapı eklemenin yollarını sayar.</div></div>

<div class="l-note"><strong>Algoritma-analizi notu (zorlama değil, gerçek).</strong> Graham, Knuth ve Patashnik'in Concrete Mathematics kitabı, algoritma analizinin büyük bölümlerini üreteç fonksiyonlarıyla geliştirir; quicksort'un ortalama-durum çalışma süresi, rastgele permütasyonlarda döngülerin beklenen uzunluğu ve birçok önbellek-kaçırma beklentisi tam olarak bu şekilde hesaplanır. Aşağıdaki derangement sayımı, etiketli yapıların neden OGF yerine EGF istediğinin en temiz örneğidir.</div>

<h2 class="lesson-title">7. EGF ve İçerme-Dışlama ile Derangement'lar</h2>

<div class="calc-highlight"><strong>n-elemanlı bir kümenin derangement'i</strong>, hiçbir elemanı sabitlemeyen bir permütasyondur — sigma(i) hiçbir zaman i'ye eşit değildir. Kaç tane vardır? İki en temiz yol aynı özdeşliğin iki farklı kanıtını verir ve biri henüz inşa ettiğimiz EGF yoludur.</div>

<p class="l-text">D_n, n'in derangement sayısı olsun. Önce bir <strong>içerme-dışlama</strong> türetmesi. A_i, [n]'nin sigma(i) = i (i sabit) olan permütasyonlarının kümesi olsun. <em>Hiçbiri</em> A_i'de olmayan permütasyonların sayısını istiyoruz. İçerme-dışlama ile:</p>

<div class="calc-formula"><div class="formula-label">İÇERME-DIŞLAMA İLE DERANGEMENT'LAR</div><div class="formula-main">$$D_{n} = n! \\sum_{k=0}^{n} \\frac{(-1)^{k}}{k!}$$</div><div class="formula-sub">Her C(n,k) binom terimi bir faktöriyel ile söner, zarif değişen toplamı bırakır.</div></div>

<p class="l-text">İkinci, bir <strong>EGF</strong> türetmesi. Her permütasyon ya bir sabit nokta kümesine sahiptir ya da hiç sabit noktası yoktur. <code>\\hat{D}(x)</code> <code>(D_n)</code>'in EGF'si olsun ve <code>e^x</code>'in "sabit noktalar olarak herhangi bir eleman seçimi"nin EGF'si, <code>1 / (1 - x)</code>'in ise "tüm permütasyonlar"ın EGF'si olduğunu hatırlayalım; etiketli-çarpım yapısı şunu verir:</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENT EGF'Sİ</div><div class="formula-main">$$\\hat{D}(x) = \\frac{e^{-x}}{1 - x}$$</div><div class="formula-sub">İki bilinen EGF'nin çarpımı. x = 0'da Taylor serisi olarak açıldığında yukarıdaki içerme-dışlama formülünü tam olarak verir — iki türetme eşdeğerdir.</div></div>

<p class="l-text">Çarpıcı bir sonuç. n büyüdükçe, sum_{k=0..n} (-1)^k / k! e^{-1} yaklaşık 0.3679'a yaklaşır (x = 1'de e^{-x}'in Taylor açılımıdır). Bu yüzden</p>

<div class="calc-formula"><div class="formula-label">DERANGEMENT LİMİTİ</div><div class="formula-main">$$\\lim_{n \\to \\infty} \\frac{D_{n}}{n!} = \\frac{1}{e} \\approx 0.3679$$</div><div class="formula-sub">Büyük bir kümenin tüm permütasyonlarının yaklaşık %36.79'u derangement'tır. Yakınsama olağanüstü hızlıdır — n = 7'de oran zaten dört ondalık basamağa kadar doğrudur.</div></div>

<div class="calc-graph"><div id="plot-l2-derangement-ratio-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> n = 0..15 için D_n / n! oranı, asimptotu belirten 1/e yaklaşık 0.3679'daki yatay kesik çizgiyle. Oran ilk birkaç n için 1/e etrafında salınır (çünkü değişen seri kesilmiştir) ama limite o kadar hızlı yakınsar ki n = 7'de nokta görsel olarak çizginin üzerindedir. Her "rastgele permütasyon" simülasyonu bu %36.79 rakamını yeniden üretecektir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=[],rat=[];var d=1,f=1;rat.push(1);n.push(0);
for(var i=1;i<=15;i++){d=i*d+(i%2===0?1:-1);f=f*i;n.push(i);rat.push(d/f);}
var d1={x:n,y:rat,mode:'lines+markers',name:'D_n / n!',line:{color:'#3b82f6',width:2.6},marker:{size:7,color:'#3b82f6'}};
var asy={x:[0,15],y:[1/Math.E,1/Math.E],mode:'lines',name:'1/e yaklaşık 0.3679',line:{color:'#f59e0b',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'D_n / n!',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.05]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-derangement-ratio-tr',[d1,asy],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>"Şapka-kontrol problemi" / "gizli Noel Baba" sorusu.</strong> n kişi şapkalarını bir sepete koyup sonra her biri rastgele bir şapka alırsa, <em>hiç kimsenin</em> kendi şapkasını almama olasılığı nedir? Tam olarak D_n / n!, herhangi bir orta n için yaklaşık %36.79. Sezgisel olmayan bir sabit: yok olmaz ve 1'e yaklaşmaz; grup büyüklüğünden bağımsız olarak inatla 1/e yakınında oturur.</div>

<h2 class="lesson-title">8. İçerme-Dışlama Prensibi Detaylı</h2>

<div class="calc-highlight"><strong>Prensip:</strong> sonlu kümelerin bir birleşiminin büyüklüğünü saymak için, her birinin büyüklüğünü ekleyin, ikili kesişimlerin büyüklüklerini çıkarın (bunları fazla saydınız), üçlü kesişimleri tekrar ekleyin (eksik düzelttiniz) ve böyle devam edin — değişen işaretlerle. Her düzeltme bir öncekinin fazla- veya eksik-saymasını geri alır.</div>

<div class="calc-formula"><div class="formula-label">İÇERME-DIŞLAMA FORMÜLÜ</div><div class="formula-main">$$\\left| A_{1} \\cup A_{2} \\cup \\cdots \\cup A_{n} \\right| = \\sum_{\\emptyset \\neq S \\subseteq [n]} (-1)^{|S|+1}\\, \\left| \\bigcap_{i \\in S} A_{i} \\right|$$</div><div class="formula-sub">İndislerin her boş olmayan S altkümesi üzerinden toplam, |S|'nin parite değişimiyle dönen bir işaretle. Pratikte en yaygın olanı ilk üç tabaka.</div></div>

<p class="l-text">İlk üç mertebe için açık yazılır:</p>

<div class="calc-formula"><div class="formula-label">İLK ÜÇ TERİM</div><div class="formula-main">$$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$</div><div class="formula-sub">Tekleri ekle, ikilileri çıkar, üçlüyü ekle. n küme için desen, (-1)^{|S|+1} işaretleriyle devam eder.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — [1, 100]'DE BÖLÜNEBİLİRLİK</div><div class="example-body"><strong>1..100'deki kaç tam sayı 2, 3 veya 5'e bölünür?</strong><br><br>A_2, A_3, A_5 katların kümeleri olsun.<br>|A_2| = floor(100/2) = 50, |A_3| = 33, |A_5| = 20.<br>|A_2 cap A_3| = floor(100/6) = 16, |A_2 cap A_5| = 10, |A_3 cap A_5| = 6.<br>|A_2 cap A_3 cap A_5| = floor(100/30) = 3.<br><br>İçerme-dışlama ile: |birleşim| = 50 + 33 + 20 - 16 - 10 - 6 + 3 = <strong>74</strong>.<br><br>Yani 1..100 tam sayılarının 74'ü 2, 3, 5'in en az birine bölünür; kalan 26'sı 30 ile aralarında asaldır — ve her blok içinde tekrarlanan 30 modülünün birimlerine tam karşılık gelirler.</div></div>

<div class="calc-graph"><div id="plot-l2-iep-divisibility-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> bölünebilirlik sorusu için içerme-dışlama aritmetiğinin istiflenmiş bir çubuk diyagramı. İlk üç çubuk tekli sayımlardır (50, 33, 20 — artı işaretiyle eklenir). Sonraki üçü ikili örtüşmelerdir (16, 10, 6 — çıkarılır). Son çubuk üçlü örtüşmedir (3 — geri eklenir). Sağ kenardaki çalışan toplam 74, son cevaptır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['|A2|','|A3|','|A5|','|A2 cap A3|','|A2 cap A5|','|A3 cap A5|','|A2 cap A3 cap A5|','birleşim'];
var vals=[50,33,20,16,10,6,3,74];
var colors=['#3b82f6','#3b82f6','#3b82f6','#f87171','#f87171','#f87171','#10b981','#f59e0b'];
var d1={x:labels,y:vals,type:'bar',name:'sayım',marker:{color:colors},text:vals.map(function(v){return String(v);}),textposition:'auto',textfont:{color:'#0a0a0a',size:13}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',tickangle:-30},yaxis:{title:'sayım',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:80,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},showlegend:false};
Plotly.newPlot('plot-l2-iep-divisibility-tr',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Elek yorumu.</strong> İçerme-dışlama, sayı teorisindeki her temel eleğin formal temelidir — Eratosthenes eleğiyle N'ye kadar asal sayısı, karesizs tam sayıların sayısı (Mobius mu aracılığıyla) ve diğer birçok klasik sonuç. Mobius fonksiyonu, içerme-dışlamanın işaretlerinin bir sayı-teorik kılığa damıtılmış halidir.</div>

<h2 class="lesson-title">9. Surjeksiyonlar ve İkinci Türden Stirling Sayıları</h2>

<div class="calc-highlight"><strong>n-elemanlı bir kümeden k-elemanlı bir kümeye kaç surjeksiyon (örten fonksiyon) vardır?</strong> Doğrudan sayma zordur; görüntüsü tüm değer kümesi olan fonksiyonları saymak istiyoruz. İçerme-dışlama bunu hallediyor: tüm fonksiyonları say, eleman 1'i ıskalayanları çıkar, eleman 2'yi ıskalayanları çıkar, ikisini birden ıskalayanları geri ekle ve böyle devam et.</div>

<p class="l-text">[n]'den [k]'ya toplam k^n fonksiyon vardır. B_i, değer kümesi elemanı i'yi ıskalayan fonksiyonlar olsun. İçerme-dışlama ile, surjeksiyon sayısı şudur:</p>

<div class="calc-formula"><div class="formula-label">SURJEKSİYON SAYISI</div><div class="formula-main">$$\\mathrm{Surj}(n, k) = \\sum_{j=0}^{k} (-1)^{j}\\, \\binom{k}{j}\\, (k - j)^{n}$$</div><div class="formula-sub">n'den k'ya fonksiyonlar eksi en az bir değer kümesi elemanını ıskalayanlar — değişen işaretlerle düzeltilmiş.</div></div>

<p class="l-text">İlgili bir nesne — <strong>ikinci türden Stirling sayısı</strong> S(n, k) — n etiketli elemandan oluşan bir kümeyi tam olarak k boş olmayan etiketsiz bloğa bölmenin yol sayısını sayar. Surjeksiyonlar sıralı bölümlere (etiketli bloklar) karşılık geldiği ve k bloğu sıralamanın k! yolu olduğu için:</p>

<div class="calc-formula"><div class="formula-label">SURJEKSİYONLARDAN STIRLING S(n, k)</div><div class="formula-main">$$S(n, k) = \\frac{1}{k!} \\sum_{j=0}^{k} (-1)^{j}\\, \\binom{k}{j}\\, (k - j)^{n} = \\frac{\\mathrm{Surj}(n, k)}{k!}$$</div><div class="formula-sub">k!'e bölerek değer kümesinin etiketlemesini sıyır. Stirling sayıları <em>sırasız</em> bölümleri sayar; surjeksiyon sayısı sıralı sürümü kurtarmak için onları k! ile çarpar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S(n, 1) = 1</div><div class="card-body">n öğeyi tek bir boş olmayan bloğa bölmenin tek yolu vardır: tüm küme.</div></div>
<div class="calc-card"><div class="card-title">S(n, n) = 1</div><div class="card-body">n öğeyi n tekli bloğa bölmenin tek yolu vardır: her blok bir elemandır.</div></div>
<div class="calc-card"><div class="card-title">S(n, 2) = 2^(n-1) - 1</div><div class="card-body">Bir blok için herhangi bir boş olmayan uygun altküme seçin (2^n - 2 seçenek) ve iki blok sırasız olduğu için 2'ye bölün.</div></div>
<div class="calc-card"><div class="card-title">Tekrarlama</div><div class="card-body">S(n, k) = k S(n-1, k) + S(n-1, k-1). Ya n. elemanı mevcut bir bloğa düşür (k seçenek), ya da n'yi içeren yeni bir tekli blok başlat.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-stirling-heatmap-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> n = 1..10 ve k = 1..10 için log renk ölçeğinde S(n, k) ısı haritası. Köşegen tümü 1'dir (S(n,n)=1). Köşegenin altında değerler sıfırdır (n öğe n'den fazla bloğa bölünemez). Köşegen-dışı iç kısım her satır için orta-aralık k'da zirveye ulaşır — örneğin S(10, 4) yaklaşık 34105 satır 10'un maksimumudur. Bu, merkezi limit olgusunun ayrık benzeridir: n'in çoğu bölümü orta sayıda blok kullanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=10;var S=[];for(var i=0;i<=N;i++){var row=[];for(var j=0;j<=N;j++)row.push(0);S.push(row);}
S[0][0]=1;
for(var n=1;n<=N;n++){for(var k=1;k<=n;k++){S[n][k]=k*S[n-1][k]+S[n-1][k-1];}}
var z=[],xLabels=[],yLabels=[];
for(var n=1;n<=N;n++){var row=[];for(var k=1;k<=N;k++){row.push(S[n][k]>0?Math.log10(S[n][k]+1):null);}z.push(row);yLabels.push('n='+n);}
for(var k=1;k<=N;k++)xLabels.push('k='+k);
var d1={z:z,x:xLabels,y:yLabels,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.2,'#1e3a8a'],[0.5,'#3b82f6'],[0.8,'#93c5fd'],[1,'#fbbf24']],colorbar:{title:'log10(S+1)',titleside:'right',tickfont:{color:'#e8e8e8'},titlefont:{color:'#e8e8e8'}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{gridcolor:'rgba(255,255,255,0.07)',side:'bottom'},yaxis:{gridcolor:'rgba(255,255,255,0.07)',autorange:'reversed'},margin:{t:30,r:30,b:50,l:60}};
Plotly.newPlot('plot-l2-stirling-heatmap-tr',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l2-surjection-growth-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> k = 2, 3, 4, 5 için Surj(n, k) surjeksiyon sayısı n'ye karşı log ölçeğinde. Her eğri yaklaşık düzdür ve eğimi log10(k)'dır. Sabit k için sayım yaklaşık k^n gibi büyür (yavaşça değişen bir düzeltmeyle); çok küçük n &lt; k için sayım sıfırdır (surjeksiyon mümkün değil).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binom(n,r){if(r<0||r>n)return 0;var v=1;for(var i=0;i<r;i++)v=v*(n-i)/(i+1);return v;}
function surj(n,k){var s=0;for(var j=0;j<=k;j++){s+=Math.pow(-1,j)*binom(k,j)*Math.pow(k-j,n);}return s;}
var ns=[];for(var i=1;i<=14;i++)ns.push(i);
var traces=[];var colors=['#f87171','#f59e0b','#10b981','#3b82f6'];
[2,3,4,5].forEach(function(k,idx){
  var ys=ns.map(function(n){var v=surj(n,k);return v>0?v:null;});
  traces.push({x:ns,y:ys,mode:'lines+markers',name:'k='+k,line:{color:colors[idx],width:2.4},marker:{size:6,color:colors[idx]}});
});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'n',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'Surj(n,k)',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-surjection-growth-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Olasılıksal İçerme-Dışlama — Doğum Günü Problemi</h2>

<div class="calc-highlight"><strong>Doğum günü problemi.</strong> n kişilik bir odada, en az ikisinin doğum gününü paylaşma olasılığı nedir? Standart türetme tümleyenle sayım kullanır (hepsi farklı), ama içerme-dışlama doğrudan bir yol verir ve yapıyı açığa çıkarır: her çakışma deseni değişen toplamda bir terimdir.</div>

<p class="l-text">365 eşit olası doğum günü ve bağımsızlık varsayarak, <em>tüm</em> n doğum gününün farklı olma olasılığı şudur:</p>

<div class="calc-formula"><div class="formula-label">HEPSİ FARKLI OLASILIĞI</div><div class="formula-main">$$P(\\text{all distinct}) = \\frac{365 \\cdot 364 \\cdots (365 - n + 1)}{365^{n}}$$</div><div class="formula-sub">Yani P(en az bir çakışma) = 1 eksi bu. n = 23'teki ünlü geçiş (olasılık %50'nin üstünde) bunu izler.</div></div>

<p class="l-text">Eşdeğer bir içerme-dışlama türetmesi: <code>A_{i, j}</code> i ve j kişilerinin doğum günü paylaşma olayı olsun. O zaman:</p>

<div class="calc-formula"><div class="formula-label">DOĞRUDAN İÇERME-DIŞLAMA</div><div class="formula-main">$$P\\left( \\bigcup_{i &lt; j} A_{i, j} \\right) = \\sum_{k=1}^{\\binom{n}{2}} (-1)^{k+1} \\sum P\\left( A_{i_{1} j_{1}} \\cap \\cdots \\cap A_{i_{k} j_{k}} \\right)$$</div><div class="formula-sub">Tam açılım hantaldır, ama küçük n için ilk iki terim gerçeği iyi yaklaştırır: yaklaşık C(n,2) / 365 eksi küçük bir düzeltme.</div></div>

<div class="calc-example"><div class="example-label">BİRİNCİ MERTEBE YAKLAŞIMI</div><div class="example-body">n = 23 için birinci mertebe Bonferroni terimi C(23, 2) / 365 = 253 / 365 yaklaşık 0.693. Bu, iki çiftin örtüştüğü fazla-saymayı yok saydığı için aşırı tahmin verir. Gerçek olasılık yaklaşık 0.507'dir. İçerme-dışlamanın ikinci mertebe düzeltmesi açığın çoğunu keser; üçüncü mertebe n = 23'te esasen ihmal edilebilir.</div></div>

<div class="l-note"><strong>Kriptografide doğum günü paradoksu.</strong> b-bit çıktı üreten bir hash fonksiyonu yaklaşık 2^(b/2) girdiden sonra çakışmaya karşı savunmasızdır, çünkü aynı doğum günü tarzı sayma uygulanır (sözde "doğum günü sınırı"). SHA-1, 160-bit çıktılarıyla, çakışma saldırıları 2^80 işe ulaştığında emekli edildi. Bu, içerme-dışlamanın uygulamalı kriptanalizdoğrudan göründüğü ek bir gerekçeye ihtiyaç duymayan birkaç yerden biridir.</div>

<h2 class="lesson-title">11. Döngü İndeksi ve Pólya Sayımı — Kısa Bir Bakış</h2>

<div class="calc-highlight"><strong>Ya simetriler önemliyse?</strong> k renkli boncuklu kolyeleri, farklı kimyasal izomerleri veya graf izomorfizm sınıflarını saymak, <em>simetri gruplarına kadar</em> sayım ister. Burnside'in lemması ve Pólya numaralandırma teoremi içerme-dışlamayı bu ortama genişletir; burada sadece fikri özetliyoruz.</div>

<p class="l-text"><strong>Burnside lemması.</strong> Sonlu bir G grubu X kümesi üzerinde etki ediyorsa, yörünge sayısı G üzerinden sabit nokta sayısının ortalamasıdır:</p>

<div class="calc-formula"><div class="formula-label">BURNSIDE LEMMASI</div><div class="formula-main">$$|X / G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^{g}|$$</div><div class="formula-sub">|X^g| g tarafından sabitlenen X elemanlarının sayısıdır. Yörünge sayısı, ortalama-sabit-sayımdır — güzel ve temiz bir denklem.</div></div>

<div class="calc-example"><div class="example-label">KOLYE ALIŞTIRMASI</div><div class="example-body"><strong>Mertebe 4 dönüş grubu altında her biri siyah veya beyaz olan 4 boncuklu kaç farklı kolye vardır?</strong> 16 toplam boyama, 4 dönüş tarafından eylenir. Birim hepsini 16'yı sabitler. 90 derece dönüş yalnızca 2 tekrenkli kolyeyi sabitler. 180 derece dönüş 4'ü sabitler (karşıt-çift sınıflarının herhangi bir boyaması). 270 derece dönüş 2'yi sabitler. Burnside: (16 + 2 + 4 + 2) / 4 = <strong>6</strong> farklı kolye. Elle saymayı deneyin — tam olarak 6 bulacaksınız.</div></div>

<div class="l-note"><strong>Pólya teoremi</strong>, grup eyleminin "döngü indeksi polinomu" aracılığıyla her renkten kaç boncuk göründüğünü izleyerek Burnside sayımını yükseltir. Sonuç, katsayıları öngörülen renk çokluklarına sahip kolyelerin sayısını veren çok değişkenli bir üreteç fonksiyonudur. Bu klasik kombinatoriğin en derin parçasıdır; bütün ders kitapları (Stanley'nin Enumerative Combinatorics'i) bunu derinlemesine işler. Burada sadece varlığına işaret ediyoruz — yeni öğrendiğiniz teknikler, simetri devreye girdiğinde daha da güçlü bir şeye dönüşür.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Deneyebilecekleriniz.</strong> <code>fib_naive</code>'i n = 35'e çıkarın ve süresinin üstel olarak büyüdüğünü izleyin — n = 40'ta modern bir CPU'da saniyeler alır. <code>fib_dp</code> n = 1000'i milisaniyelerde yakalar, ama n = 100000 için <code>fib_matrix</code>'a yenilir. <code>fib_binet</code> hepsinden hızlıdır ama büyük n'de kayan nokta hassasiyetini kaybettiği için yalan söyler; n = 80 için çıktısını <code>fib_dp</code> ile karşılaştırın ve uyuşmazlığı göreceksiniz. İçerme-dışlama rutinindeki asal listesini [2, 3, 5, 7, 11, 13] olarak değiştirin: 1..1000'deki aralarında asal sayılar sayısı, Euler'in phi(30030) totient'ine uygun şekilde ölçeklenmiş olarak eşit olmalıdır — IE toplamının ve Euler'in çarpım formülünün aynı madalyonun iki yüzü olduğunu doğrulayan.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Bir üreteç fonksiyonu, katsayıları bir dizinin terimleri olan bir kuvvet serisidir; x sembolü formaldir ve yakınsama kaygısı yoktur. Dört klasik OGF (1/(1-x), (1+x)^n, 1/(1-rx) ve (1-x^(n+1))/(1-x)) çoğu temel dizi kodlamasının inşa edildiği bir alfabe oluşturur ve işlemler (toplam, çarpım, kaydırma, türev) altta yatan dizinin temiz dönüşümlerine tercüme olur. Üreteç fonksiyonlarının Cauchy çarpımı dizilerin konvolüsyonuna karşılık gelir — tam olarak doğrusal tekrarlamaları çözülebilir kılan yapı: tekrarlamanın her terimini x^n ile çarpın, toplayın, A(x) ve kaymalarını tanıyın ve tek bir cebirsel denklem ortaya çıkar. Fibonacci için bu denklem A(x) = x / (1 - x - x^2)'dir ve kısmi kesirler Binet'in kapalı formunu verir. Catalan sayıları için denklem C(x) = 1 + x C(x)^2'dir, eksi-kökü OGF'yi veren ve genelleştirilmiş binom açılımından sonra zarif C_n = C(2n,n)/(n+1)'i veren bir ikinci derece denklem. Üstel üreteç fonksiyonu n!'e böler, etiketli yapıları doğal olarak kodlar: tüm-birler dizisi için e^x, n! için 1/(1-x) ve ünlü D_n/n! → 1/e asimptotunu veren derangement'lar için zarif e^{-x}/(1-x). İçerme-dışlama bu dersin ikinci ana aracıdır — örtüşen kümelerin birleşimlerini sayan işaretli değişen bir toplam. Derangement formülünü, surjeksiyon sayısı k! S(n, k)'yı ve [1, 100] için hesapladığımız bölünebilirlik sayımını üretir. Stirling sayıları S(n, k) sırasız bölümleri sayar ve temiz iki-terim tekrarlamasına uyar. Burnside lemması ve Pólya numaralandırması içerme-dışlamayı simetriye saygılı sayımlara genişletir, kombinatoriğin en derin klasik bölümü. Boyunca cebirsel hamle aynıdır: tekrarlamayı bir denklem olarak yazın, denklemi çözün, formülü okuyun.</p>
`
};
