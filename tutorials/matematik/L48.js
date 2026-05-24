window.LISE_MAT_L48 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Once you know what a polynomial is, the next question is what you can <em>do</em> with two of them.</strong> The arithmetic of polynomials is built on top of the arithmetic of numbers and inherits its rules: you can add them, subtract them, multiply them, and (with care) divide them. The first three of these are mechanical once you spot that a polynomial is nothing more than a tidy list of like terms. Division is more delicate — it mirrors the long division of integers you learned in primary school, and it produces a quotient and a remainder rather than a single answer.</p>

<p class="l-text">By the end of this lesson you will be adding and subtracting polynomials in your sleep, multiplying two polynomials of any degree by patient distribution, predicting the degree of a product from the degrees of its factors, dividing one polynomial by another using the long-division algorithm, taking the shortcut of <em>synthetic division</em> when the divisor has the form $x - a$, and stating the division identity $P = D \\cdot Q + R$ that ties the whole picture together. These operations are not optional decoration — every lesson on factoring, roots, the remainder theorem, and rational functions that follows depends on them.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Add and subtract two polynomials by collecting like terms and confirm the degree of the result</li>
<li>Multiply a polynomial by a single term using the distributive law cleanly and without sign errors</li>
<li>Multiply two arbitrary polynomials by extended distribution (the general FOIL pattern)</li>
<li>Predict the degree of a product directly: $\\deg(P \\cdot Q) = \\deg P + \\deg Q$</li>
<li>Carry out long division of polynomials in five disciplined steps and stop at the correct moment</li>
<li>Use synthetic division as a shortcut when the divisor is $x - a$ and explain why it works</li>
<li>State the division identity $P(x) = D(x) \\cdot Q(x) + R(x)$ with $\\deg R < \\deg D$, and check answers using it</li>
</ul>
</div>

<h2 class="lesson-title">1. Addition and Subtraction: Collect Like Terms</h2>

<div class="calc-highlight"><strong>Adding two polynomials is the same as adding two columns of numbers.</strong> Line up the powers of $x$, add (or subtract) the coefficients within each column, and write the result. Nothing else changes — the powers themselves are unaffected. The only mistake to avoid is mixing different powers, just as you would never add the tens column to the hundreds column when adding plain integers.</div>

<p class="l-text">Two terms are called <em>like terms</em> when they involve the exact same power of $x$. For example, $5x^3$ and $-2x^3$ are like terms (both carry $x^3$); $5x^3$ and $-2x^2$ are not (different powers). Addition and subtraction of polynomials reduce to combining like terms.</p>

<div class="calc-formula"><div class="formula-label">SUM OF TWO POLYNOMIALS</div><div class="formula-main">$$P(x) + Q(x) \\;=\\; \\sum_{k=0}^{N} (a_k + b_k) \\, x^k$$</div><div class="formula-sub">$N$ is the larger of the two degrees. Missing coefficients on the shorter polynomial are treated as zero. The coefficients in the sum are obtained position by position.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Let $P(x) = 3x^3 - 2x^2 + 5x - 1$ and $Q(x) = x^3 + 4x^2 - 7$. Find $P(x) + Q(x)$.<br><br>Line up the like terms:<br>$x^3$ column: $3 + 1 = 4$.<br>$x^2$ column: $-2 + 4 = 2$.<br>$x^1$ column: $5 + 0 = 5$ (Q has no $x$ term).<br>$x^0$ column: $-1 + (-7) = -8$.<br><br>So $P(x) + Q(x) = \\mathbf{4x^3 + 2x^2 + 5x - 8}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">With the same $P$ and $Q$, find $P(x) - Q(x)$.<br><br>Subtraction flips the sign of <em>every</em> coefficient of $Q$ before adding:<br>$x^3$ column: $3 - 1 = 2$.<br>$x^2$ column: $-2 - 4 = -6$.<br>$x^1$ column: $5 - 0 = 5$.<br>$x^0$ column: $-1 - (-7) = -1 + 7 = 6$.<br><br>So $P(x) - Q(x) = \\mathbf{2x^3 - 6x^2 + 5x + 6}$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Degree of a sum</div><div class="card-body">$\\deg(P + Q) \\leq \\max(\\deg P, \\deg Q)$. Usually equality, but the leading terms can cancel — e.g. $(x^3) + (-x^3 + x) = x$ drops from degree 3 to degree 1.</div></div>
<div class="calc-card"><div class="card-title">Degree of a difference</div><div class="card-body">Same rule: $\\deg(P - Q) \\leq \\max(\\deg P, \\deg Q)$, with the same possibility of cancellation. Always check the leading coefficient of the answer.</div></div>
<div class="calc-card"><div class="card-title">Sign error trap</div><div class="card-body">When subtracting, the minus distributes over <em>every</em> term of $Q$. Writing $-(x^3 + 4x^2 - 7) = -x^3 - 4x^2 + 7$ (the last sign flips too) is where most mistakes live.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Let $P(x) = 2x^4 + x - 5$ and $Q(x) = -2x^4 + 3x^2 + 6$. What is the degree of $P + Q$? (Hint: do the leading terms cancel?) Answer: $P + Q = 3x^2 + x + 1$, which has degree 2 — the $x^4$ terms cancelled and the next-highest power that survives is $x^2$.</div></div>

<h2 class="lesson-title">2. Multiplication by a Single Term: Distribute</h2>

<div class="calc-highlight"><strong>To multiply a polynomial by one term, multiply <em>each</em> term of the polynomial by that term and add the results.</strong> This is the distributive law $a(b + c) = ab + ac$ applied as many times as there are terms. When multiplying powers of $x$, remember the exponent rule: $x^m \\cdot x^n = x^{m+n}$.</div>

<div class="calc-formula"><div class="formula-label">DISTRIBUTIVE LAW &mdash; SINGLE TERM</div><div class="formula-main">$$c \\cdot x^k \\cdot \\bigl( a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_0 \\bigr) \\;=\\; c \\, a_n x^{n+k} + c \\, a_{n-1} x^{n+k-1} + \\cdots + c \\, a_0 \\, x^k$$</div><div class="formula-sub">Multiply each coefficient by $c$. Add $k$ to every exponent. Done.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Expand $3x^2 (2x^3 - 4x + 5)$.<br><br>$3x^2 \\cdot 2x^3 = 6 \\, x^{2+3} = 6x^5$.<br>$3x^2 \\cdot (-4x) = -12 \\, x^{2+1} = -12x^3$.<br>$3x^2 \\cdot 5 = 15 x^2$.<br><br>Sum: $\\mathbf{6x^5 - 12x^3 + 15x^2}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Expand $-2x \\bigl( x^4 + 3x^2 - 7x + 1 \\bigr)$.<br><br>The leading $-2x$ multiplies each term:<br>$-2x \\cdot x^4 = -2x^5$.<br>$-2x \\cdot 3x^2 = -6x^3$.<br>$-2x \\cdot (-7x) = 14x^2$.<br>$-2x \\cdot 1 = -2x$.<br><br>Result: $\\mathbf{-2x^5 - 6x^3 + 14x^2 - 2x}$.</div></div>

<div class="l-note"><strong>Sign discipline.</strong> A negative outside the bracket flips the sign of <em>every</em> term inside. When two negatives meet, the product is positive — exactly as with integer arithmetic.</div>

<h2 class="lesson-title">3. Multiplication of Two Polynomials: General Distribution</h2>

<div class="calc-highlight"><strong>To multiply two polynomials, multiply <em>every</em> term of the first by <em>every</em> term of the second, then collect like terms.</strong> If the first polynomial has $m$ terms and the second has $n$ terms, this produces $m \\cdot n$ products before any cancellation. The familiar acronym <em>FOIL</em> (First, Outer, Inner, Last) is just the four-product special case when both factors are linear.</div>

<div class="calc-formula"><div class="formula-label">PRODUCT OF TWO BINOMIALS &mdash; FOIL</div><div class="formula-main">$$(a + b)(c + d) \\;=\\; \\underbrace{ac}_{\\text{First}} + \\underbrace{ad}_{\\text{Outer}} + \\underbrace{bc}_{\\text{Inner}} + \\underbrace{bd}_{\\text{Last}}$$</div><div class="formula-sub">Four products, every term of the left bracket paired with every term of the right bracket. The acronym just names the four products in order.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; FOIL</div><div class="example-body">Expand $(2x + 3)(x - 5)$.<br><br>First: $2x \\cdot x = 2x^2$.<br>Outer: $2x \\cdot (-5) = -10x$.<br>Inner: $3 \\cdot x = 3x$.<br>Last: $3 \\cdot (-5) = -15$.<br><br>Sum: $2x^2 - 10x + 3x - 15 = \\mathbf{2x^2 - 7x - 15}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; LARGER PRODUCT</div><div class="example-body">Expand $(x^2 + 2x - 1)(x + 3)$. The first bracket has three terms, the second has two — six products altogether.<br><br>$x^2 \\cdot x = x^3$<br>$x^2 \\cdot 3 = 3x^2$<br>$2x \\cdot x = 2x^2$<br>$2x \\cdot 3 = 6x$<br>$-1 \\cdot x = -x$<br>$-1 \\cdot 3 = -3$<br><br>Collect like terms (the two $x^2$ terms combine, the two $x$ terms combine):<br>$x^3 + (3 + 2) x^2 + (6 - 1) x - 3 = \\mathbf{x^3 + 5x^2 + 5x - 3}$.</div></div>

<div class="calc-graph"><div id="plot-l48-area-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this picture shows:</strong> the area model for $(2x + 3)(x + 4)$. The big rectangle has horizontal side $2x + 3$ and vertical side $x + 4$, so its total area is the product. Split the sides into pieces ($2x$ and $3$ horizontally; $x$ and $4$ vertically) and the rectangle splits into four smaller rectangles whose areas are exactly the four FOIL products: $2x \\cdot x = 2x^2$, $2x \\cdot 4 = 8x$, $3 \\cdot x = 3x$, $3 \\cdot 4 = 12$. Summing them gives $2x^2 + 11x + 12$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xVal=2;
var W1=2*xVal,W2=3,H1=xVal,H2=4;
var x0=0,y0=0;
var rect1={x:[x0,x0+W1,x0+W1,x0,x0],y:[y0,y0,y0+H1,y0+H1,y0],mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.30)',line:{color:'#3b82f6',width:2},name:'2x · x = 2x²'};
var rect2={x:[x0+W1,x0+W1+W2,x0+W1+W2,x0+W1,x0+W1],y:[y0,y0,y0+H1,y0+H1,y0],mode:'lines',fill:'toself',fillcolor:'rgba(245,158,11,0.30)',line:{color:'#f59e0b',width:2},name:'3 · x = 3x'};
var rect3={x:[x0,x0+W1,x0+W1,x0,x0],y:[y0+H1,y0+H1,y0+H1+H2,y0+H1+H2,y0+H1],mode:'lines',fill:'toself',fillcolor:'rgba(16,185,129,0.30)',line:{color:'#10b981',width:2},name:'2x · 4 = 8x'};
var rect4={x:[x0+W1,x0+W1+W2,x0+W1+W2,x0+W1,x0+W1],y:[y0+H1,y0+H1,y0+H1+H2,y0+H1+H2,y0+H1],mode:'lines',fill:'toself',fillcolor:'rgba(236,72,153,0.30)',line:{color:'#ec4899',width:2},name:'3 · 4 = 12'};
var labs={x:[x0+W1/2,x0+W1+W2/2,x0+W1/2,x0+W1+W2/2,x0+W1/2,x0+W1+W2+0.4,x0+W1+W2+0.4],y:[y0+H1/2,y0+H1/2,y0+H1+H2/2,y0+H1+H2/2,-0.5,y0+H1/2,y0+H1+H2/2],mode:'text',text:['2x²','3x','8x','12','width = 2x+3','height x','height 4'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.6,x0+W1+W2+2.5],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'horizontal split: 2x | 3'},yaxis:{range:[-1.2,y0+H1+H2+0.8],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',title:'vertical split: x | 4'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l48-area-en',[rect1,rect2,rect3,rect4,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why the picture works.</strong> Area is multiplication. If a rectangle has sides $A$ and $B$, its area is $A \\cdot B$. Slice the sides into sums ($A = a_1 + a_2$, $B = b_1 + b_2$) and the rectangle slices into four sub-rectangles whose areas are $a_1 b_1, a_1 b_2, a_2 b_1, a_2 b_2$. Their sum is the original $A \\cdot B$ — which is exactly $(a_1 + a_2)(b_1 + b_2)$. The algebraic FOIL pattern is the geometric area pattern in disguise.</div>

<h2 class="lesson-title">4. The Degree of a Product</h2>

<div class="calc-highlight"><strong>The leading term of a product is the product of the leading terms.</strong> Multiplying the highest-degree term of $P$ by the highest-degree term of $Q$ adds the exponents, so the highest power that appears in $P \\cdot Q$ is $\\deg P + \\deg Q$. No cancellation can occur there (the leading coefficients are non-zero by definition), so the rule is exact, not an inequality.</div>

<div class="calc-formula"><div class="formula-label">DEGREE OF A PRODUCT</div><div class="formula-main">$$\\deg(P \\cdot Q) \\;=\\; \\deg P + \\deg Q$$</div><div class="formula-sub">If $P(x) = a_n x^n + \\cdots$ and $Q(x) = b_m x^m + \\cdots$, then $P(x) Q(x) = a_n b_m \\, x^{n+m} + (\\text{lower powers})$. The leading coefficient of the product is the product of the leading coefficients.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">If $P(x) = 2x^3 - x + 4$ (degree 3) and $Q(x) = -x^2 + 5$ (degree 2), what is the degree of $P(x) Q(x)$? What is its leading coefficient?<br><br>$\\deg(PQ) = 3 + 2 = 5$.<br>Leading coefficient: $2 \\cdot (-1) = -2$.<br><br>So $P(x) Q(x) = -2x^5 + (\\text{lower-order terms})$. We didn't need to expand the whole product to see the top.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Constant times polynomial</div><div class="card-body">If $P$ has degree $n$ and $c \\neq 0$ is a number (degree 0), then $\\deg(cP) = n + 0 = n$. Scaling never changes the degree.</div></div>
<div class="calc-card"><div class="card-title">Powers of a polynomial</div><div class="card-body">$\\deg(P^k) = k \\cdot \\deg P$. For example $(x^2 + 1)^5$ has degree $5 \\cdot 2 = 10$.</div></div>
<div class="calc-card"><div class="card-title">Why no cancellation</div><div class="card-body">The leading coefficients of $P$ and $Q$ are both non-zero (that's part of "leading"). The product of two non-zero numbers is non-zero, so the leading term of $PQ$ cannot vanish.</div></div>
</div>

<h2 class="lesson-title">5. Long Division of Polynomials: The Algorithm</h2>

<div class="calc-highlight"><strong>Polynomial long division copies the long-division algorithm for integers.</strong> The dividend is the polynomial being divided; the divisor is the polynomial we are dividing by; the result splits into a quotient (the "answer") and a remainder (the leftover). Just as $17 \\div 5 = 3$ remainder $2$ (so $17 = 5 \\cdot 3 + 2$), polynomial division produces $P(x) = D(x) \\cdot Q(x) + R(x)$.</div>

<p class="l-text"><strong>Setup.</strong> Write both polynomials in standard form (descending powers), inserting zero coefficients for any missing powers. For instance, $x^3 - 7x + 6$ should be written $x^3 + 0 \\cdot x^2 - 7x + 6$ so that the place values line up. This step prevents the most common arithmetic slips.</p>

<div class="calc-formula"><div class="formula-label">FIVE-STEP RECIPE</div><div class="formula-main">$$\\boxed{\\text{Divide} \\;\\to\\; \\text{Multiply} \\;\\to\\; \\text{Subtract} \\;\\to\\; \\text{Bring down} \\;\\to\\; \\text{Repeat}}$$</div><div class="formula-sub">Five steps in a tight loop. Each loop strips off one degree from the running remainder. Stop when the running remainder has lower degree than the divisor.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Divide</div><div class="card-body">Divide the <em>leading term</em> of the current dividend by the <em>leading term</em> of the divisor. The result is the next term of the quotient. Example: $x^3 \\div x = x^2$.</div></div>
<div class="calc-card"><div class="card-title">2. Multiply</div><div class="card-body">Multiply the entire divisor by that new quotient term. Write the product underneath, aligned by powers of $x$.</div></div>
<div class="calc-card"><div class="card-title">3. Subtract</div><div class="card-body">Subtract the product from the current dividend. The leading term cancels (that's the whole point of the divide step) and what remains has degree one less than before.</div></div>
<div class="calc-card"><div class="card-title">4. Bring down</div><div class="card-body">If there is a next term in the original dividend that has not yet entered the calculation, bring it down to join the running remainder. (When all terms are already in play, skip this.)</div></div>
<div class="calc-card"><div class="card-title">5. Repeat (or stop)</div><div class="card-body">If the current remainder still has degree at least equal to the divisor's degree, go back to step 1. Otherwise, stop — what is left is the final remainder.</div></div>
</div>

<div class="calc-graph"><div id="plot-l48-longdiv-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this schematic shows:</strong> the long-division layout for $(x^3 - 7x + 6) \\div (x - 2)$. The top row holds the quotient as it grows. The middle band holds the dividend, with the leading zero coefficient for the missing $x^2$ term written in explicitly. Each labelled arrow corresponds to one of the five recipe steps; the colour code matches steps 1 (divide), 2 (multiply), 3 (subtract).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ann={x:[0.5,2.5,4.5,6.5,8.5,0.5,2.5,4.5,6.5,8.5,4.5,4.5,1,3,6,4.5,7.5],y:[5,5,5,5,5,4,4,4,4,4,3,2,4.6,2.5,1.5,1,0.5],mode:'text',text:['','x²','+ 2x','− 3','','x³','+ 0x²','− 7x','+ 6','','quotient row','dividend row (with 0 for missing x²)','÷ (x−2)','× (x−2) then subtract','remainder = 0','step 1: x³ ÷ x = x²','final answer: quotient = x²+2x−3, remainder 0'],textfont:{color:['#3b82f6','#3b82f6','#10b981','#f59e0b','#3b82f6','#e8e8e8','#e8e8e8','#e8e8e8','#e8e8e8','#e8e8e8','rgba(59,130,246,0.7)','rgba(255,255,255,0.55)','rgba(255,255,255,0.55)','rgba(255,255,255,0.55)','rgba(16,185,129,0.85)','rgba(59,130,246,0.7)','rgba(16,185,129,0.85)'],size:[14,16,16,16,14,15,15,15,15,15,11,11,10,10,11,11,11]},showlegend:false};
var hline={x:[0,9,null,0,9],y:[4.5,4.5,null,3.5,3.5],mode:'lines',line:{color:'rgba(255,255,255,0.4)',width:1.5},showlegend:false};
var arrow1={x:[1,2.3],y:[4.7,4.9],mode:'lines',line:{color:'rgba(59,130,246,0.6)',width:1,dash:'dot'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,10],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[0,6],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l48-longdiv-en',[ann,hline,arrow1],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>When do you stop?</strong> The instant the running remainder has degree <em>strictly less</em> than the divisor's degree. If the divisor has degree 1, you stop when the remainder is a constant (degree 0) or zero. If the divisor has degree 2, you stop when the remainder is linear or constant. This rule is identical to the integer rule "stop when the remainder is smaller than the divisor."</div>

<h2 class="lesson-title">6. Worked Example: $(x^3 - 7x + 6) \\div (x - 2)$</h2>

<p class="l-text">Let's run the algorithm in full. Dividend $P(x) = x^3 - 7x + 6$. Divisor $D(x) = x - 2$. We expect a quotient of degree $3 - 1 = 2$ and a remainder of degree less than 1 (so a constant, possibly zero).</p>

<p class="l-text"><strong>Step 0 (setup).</strong> Insert the missing $x^2$ coefficient: rewrite the dividend as $P(x) = x^3 + 0 x^2 - 7x + 6$.</p>

<div class="calc-example"><div class="example-label">FIRST ROUND</div><div class="example-body"><strong>Step 1 &mdash; divide.</strong> Leading term of dividend: $x^3$. Leading term of divisor: $x$. Quotient: $x^3 / x = \\mathbf{x^2}$. Write $x^2$ at the top.<br><br><strong>Step 2 &mdash; multiply.</strong> $x^2 \\cdot (x - 2) = x^3 - 2x^2$. Write underneath.<br><br><strong>Step 3 &mdash; subtract.</strong> $(x^3 + 0 x^2) - (x^3 - 2x^2) = 2x^2$. The $x^3$ cancels.<br><br><strong>Step 4 &mdash; bring down.</strong> Bring down the next term, $-7x$. Current running remainder: $2x^2 - 7x$.</div></div>

<div class="calc-example"><div class="example-label">SECOND ROUND</div><div class="example-body"><strong>Step 1.</strong> Leading term now $2x^2$, divide by $x$: get $\\mathbf{2x}$. Add to the quotient: $x^2 + 2x$.<br><br><strong>Step 2.</strong> $2x \\cdot (x - 2) = 2x^2 - 4x$.<br><br><strong>Step 3.</strong> $(2x^2 - 7x) - (2x^2 - 4x) = -3x$. The $2x^2$ cancels.<br><br><strong>Step 4.</strong> Bring down the $+6$. Running remainder: $-3x + 6$.</div></div>

<div class="calc-example"><div class="example-label">THIRD ROUND</div><div class="example-body"><strong>Step 1.</strong> Leading term $-3x$ divided by $x$ is $\\mathbf{-3}$. Add to the quotient: $x^2 + 2x - 3$.<br><br><strong>Step 2.</strong> $-3 \\cdot (x - 2) = -3x + 6$.<br><br><strong>Step 3.</strong> $(-3x + 6) - (-3x + 6) = 0$. Clean cancellation.<br><br><strong>Step 5 (stop).</strong> Remainder is $0$, which has degree less than 1. Done.</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\frac{x^3 - 7x + 6}{x - 2} \\;=\\; x^2 + 2x - 3, \\qquad R = 0$$</div><div class="formula-sub">Equivalently: $x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3)$.</div></div>

<p class="l-text"><strong>Sanity check by expansion.</strong> Multiply the quotient by the divisor:<br>$(x - 2)(x^2 + 2x - 3) = x^3 + 2x^2 - 3x - 2x^2 - 4x + 6 = x^3 - 7x + 6$. ✓</p>

<h2 class="lesson-title">7. Synthetic Division: The Shortcut for $x - a$</h2>

<div class="calc-highlight"><strong>When the divisor is of the special form $x - a$, you can drop all the $x$'s and just push coefficients through a table.</strong> This is <em>synthetic division</em>. It is mathematically the same algorithm as long division, but the bookkeeping is much lighter — you write only the numerical coefficients, not the variable, and you replace each "multiply and subtract" by "multiply by $a$ and add". For exam speed this is the method of choice when the divisor is linear and monic.</div>

<div class="calc-formula"><div class="formula-label">SETUP</div><div class="formula-main">$$\\frac{P(x)}{x - a} \\quad\\text{with}\\quad P(x) = c_n x^n + c_{n-1} x^{n-1} + \\cdots + c_0$$</div><div class="formula-sub">Write the coefficients $c_n, c_{n-1}, \\ldots, c_0$ in a row. Use $0$ for any missing power. Write the root $a$ to the left.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Bring down</div><div class="card-body">The leading coefficient $c_n$ drops straight down to the bottom row unchanged. This is the leading coefficient of the quotient.</div></div>
<div class="calc-card"><div class="card-title">2. Multiply by $a$</div><div class="card-body">Multiply the freshly written bottom-row entry by $a$. Write the result in the middle row, under the next coefficient.</div></div>
<div class="calc-card"><div class="card-title">3. Add</div><div class="card-body">Add the column: the original coefficient on top plus the middle-row product equals the next bottom-row entry.</div></div>
<div class="calc-card"><div class="card-title">4. Repeat</div><div class="card-body">Steps 2 and 3 march left-to-right across the row. The final bottom-row entry is the remainder; the rest of the bottom row are the coefficients of the quotient (one lower degree).</div></div>
</div>

<div class="l-note"><strong>Why "multiply by $a$, not $-a$?"</strong> Because the divisor is $x - a$. When you do long division and subtract the product of the divisor by the next quotient term, the $-a$ inside the divisor combined with the subtraction flips two signs, leaving a clean addition by $a$. The arithmetic shortcut hides this sign juggling.</div>

<h2 class="lesson-title">8. Worked Example: Same Problem by Synthetic Division</h2>

<p class="l-text">Let's divide $P(x) = x^3 - 7x + 6$ by $x - 2$ again, this time synthetically. The divisor is $x - 2$, so $a = 2$. Insert the missing $x^2$ coefficient: the coefficient list is $1, 0, -7, 6$.</p>

<div class="calc-formula"><div class="formula-label">SYNTHETIC TABLE</div><div class="formula-main">$$\\begin{array}{c|cccc} 2 & 1 & 0 & -7 & 6 \\\\ & & 2 & 4 & -6 \\\\ \\hline & 1 & 2 & -3 & 0 \\end{array}$$</div><div class="formula-sub">Top row: coefficients of $P$. Middle row: running multiply-by-2 products. Bottom row: quotient coefficients followed by the remainder (rightmost entry).</div></div>

<div class="calc-example"><div class="example-label">STEP-BY-STEP</div><div class="example-body"><strong>Bring down.</strong> The first coefficient $1$ drops to the bottom row.<br><br><strong>Multiply &amp; add.</strong> $1 \\cdot 2 = 2$, written under the next top entry $0$. Add: $0 + 2 = 2$. Bottom row now $1, 2$.<br><br><strong>Multiply &amp; add.</strong> $2 \\cdot 2 = 4$, under $-7$. Add: $-7 + 4 = -3$. Bottom row now $1, 2, -3$.<br><br><strong>Multiply &amp; add.</strong> $-3 \\cdot 2 = -6$, under $6$. Add: $6 + (-6) = 0$. Bottom row $1, 2, -3, 0$.<br><br><strong>Read off.</strong> Bottom row left to right: $1, 2, -3$ are the quotient coefficients of degrees $2, 1, 0$, and the final $0$ is the remainder. So the quotient is $x^2 + 2x - 3$ and the remainder is $0$, matching the long-division result exactly.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">LONG DIVISION</div><div class="compare-item">Works for <em>any</em> divisor</div><div class="compare-item">Writes the full polynomial each round</div><div class="compare-item">More writing, easier to follow logic</div><div class="compare-item">Slower in exam conditions</div></div><div class="compare-col"><div class="compare-title">SYNTHETIC DIVISION</div><div class="compare-item">Works only when divisor is $x - a$ (monic, linear)</div><div class="compare-item">Coefficients only — no $x$ written</div><div class="compare-item">Far less writing, faster</div><div class="compare-item">Watch the sign: $a$ comes from $x - a$, not $x + a$</div></div></div>

<h2 class="lesson-title">9. The Division Identity: $P = D \\cdot Q + R$</h2>

<div class="calc-highlight"><strong>Polynomial division satisfies the same identity as integer division.</strong> For any dividend $P$ and any non-zero divisor $D$, there exist a unique quotient $Q$ and a unique remainder $R$ such that $P = D Q + R$ with the remainder $R$ having strictly smaller degree than the divisor $D$ (or being zero).</div>

<div class="calc-formula"><div class="formula-label">DIVISION ALGORITHM FOR POLYNOMIALS</div><div class="formula-main">$$P(x) \\;=\\; D(x) \\cdot Q(x) + R(x), \\qquad \\deg R < \\deg D \\;\\text{ or }\\; R = 0$$</div><div class="formula-sub">This is the polynomial analogue of "dividend = divisor &times; quotient + remainder". Both $Q$ and $R$ are uniquely determined by $P$ and $D$.</div></div>

<p class="l-text"><strong>How to use it.</strong> Whenever you finish a division problem, you can verify your work by expanding $D \\cdot Q + R$ and checking that it equals $P$. If even a single coefficient is off, you have made an error somewhere — and the check will catch it before you move on.</p>

<div class="calc-example"><div class="example-label">CHECK FOR THE EARLIER PROBLEM</div><div class="example-body">We found $\\dfrac{x^3 - 7x + 6}{x - 2} = x^2 + 2x - 3$, $R = 0$.<br><br>So the identity claims $x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3) + 0$.<br><br>Expand:<br>$(x - 2)(x^2 + 2x - 3) = x \\cdot x^2 + x \\cdot 2x + x \\cdot (-3) - 2 \\cdot x^2 - 2 \\cdot 2x - 2 \\cdot (-3)$<br>$= x^3 + 2x^2 - 3x - 2x^2 - 4x + 6$<br>$= x^3 - 7x + 6$. ✓<br><br>The check holds — our quotient and remainder are correct.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE WITH NON-ZERO REMAINDER</div><div class="example-body">Divide $P(x) = 2x^2 + 5x + 1$ by $D(x) = x + 3$.<br><br>Synthetic with $a = -3$ (because $D = x - (-3)$): coefficients $2, 5, 1$.<br><br>Bring down 2. Multiply $2 \\cdot (-3) = -6$. Add $5 + (-6) = -1$. Multiply $-1 \\cdot (-3) = 3$. Add $1 + 3 = 4$.<br><br>Bottom row: $2, -1, 4$. So quotient $= 2x - 1$, remainder $= 4$.<br><br>Check: $(x + 3)(2x - 1) + 4 = 2x^2 - x + 6x - 3 + 4 = 2x^2 + 5x + 1$. ✓</div></div>

<div class="l-note"><strong>Look ahead.</strong> The next lesson uses this identity to state and prove the <em>Remainder Theorem</em>: when you divide $P(x)$ by $x - a$, the remainder is exactly $P(a)$. That collapses a whole long division to a single substitution — a remarkable simplification you will use constantly.</div>

<h2 class="lesson-title">10. Practice Problems</h2>

<p class="l-text">Ten standard exercises covering every operation in the lesson. Try each one before reading the answer.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SUM</div><div class="example-body"><strong>Compute</strong> $(4x^3 - x^2 + 2) + (-2x^3 + 3x^2 - 5x)$.<br><br>Like terms: $(4 - 2)x^3 + (-1 + 3)x^2 + (0 - 5)x + (2 + 0) = \\mathbf{2x^3 + 2x^2 - 5x + 2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; DIFFERENCE</div><div class="example-body"><strong>Compute</strong> $(5x^4 + 2x^2 - 7) - (5x^4 - x^3 + 2x^2)$.<br><br>Distribute the minus first: $5x^4 + 2x^2 - 7 - 5x^4 + x^3 - 2x^2 = (5-5)x^4 + x^3 + (2-2)x^2 - 7 = \\mathbf{x^3 - 7}$. Notice the degree dropped from 4 to 3 because the $x^4$ terms cancelled.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; SINGLE-TERM PRODUCT</div><div class="example-body"><strong>Expand</strong> $-4x^2 \\bigl(3x^3 - 2x^2 + x - 5\\bigr)$.<br><br>Distribute: $-4x^2 \\cdot 3x^3 = -12x^5$; $-4x^2 \\cdot (-2x^2) = 8x^4$; $-4x^2 \\cdot x = -4x^3$; $-4x^2 \\cdot (-5) = 20x^2$.<br><br>Sum: $\\mathbf{-12x^5 + 8x^4 - 4x^3 + 20x^2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; FOIL</div><div class="example-body"><strong>Expand</strong> $(3x - 2)(2x + 5)$.<br><br>F: $3x \\cdot 2x = 6x^2$. O: $3x \\cdot 5 = 15x$. I: $-2 \\cdot 2x = -4x$. L: $-2 \\cdot 5 = -10$.<br><br>Sum: $6x^2 + 15x - 4x - 10 = \\mathbf{6x^2 + 11x - 10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; LARGER PRODUCT</div><div class="example-body"><strong>Expand</strong> $(x^2 - 3x + 1)(x^2 + 2)$.<br><br>$x^2 \\cdot x^2 = x^4$; $x^2 \\cdot 2 = 2x^2$; $-3x \\cdot x^2 = -3x^3$; $-3x \\cdot 2 = -6x$; $1 \\cdot x^2 = x^2$; $1 \\cdot 2 = 2$.<br><br>Collect: $x^4 - 3x^3 + (2 + 1)x^2 - 6x + 2 = \\mathbf{x^4 - 3x^3 + 3x^2 - 6x + 2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; DEGREE PREDICTION</div><div class="example-body">If $P(x) = 3x^5 - x + 1$ and $Q(x) = -2x^3 + 7$, find the degree and the leading coefficient of $P(x) Q(x)$ without expanding.<br><br>Degree: $5 + 3 = 8$. Leading coefficient: $3 \\cdot (-2) = -6$. So $P(x)Q(x) = -6x^8 + (\\text{lower-order terms})$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; LONG DIVISION</div><div class="example-body"><strong>Divide</strong> $2x^3 + 5x^2 - x + 4$ by $x + 2$ using long division.<br><br>Step 1: $2x^3 / x = 2x^2$. Multiply: $2x^2(x+2) = 2x^3 + 4x^2$. Subtract: $(2x^3 + 5x^2) - (2x^3 + 4x^2) = x^2$. Bring down: $x^2 - x$.<br><br>Step 2: $x^2 / x = x$. Multiply: $x(x+2) = x^2 + 2x$. Subtract: $(x^2 - x) - (x^2 + 2x) = -3x$. Bring down: $-3x + 4$.<br><br>Step 3: $-3x / x = -3$. Multiply: $-3(x+2) = -3x - 6$. Subtract: $(-3x + 4) - (-3x - 6) = 10$. Stop (degree 0 < degree 1).<br><br>Quotient $= 2x^2 + x - 3$, remainder $= \\mathbf{10}$. So $2x^3 + 5x^2 - x + 4 = (x + 2)(2x^2 + x - 3) + 10$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SYNTHETIC DIVISION</div><div class="example-body">Redo problem 7 by synthetic division. Divisor $x + 2$ means $a = -2$. Coefficients $2, 5, -1, 4$.<br><br>Bring down 2. $2 \\cdot (-2) = -4$; $5 + (-4) = 1$. $1 \\cdot (-2) = -2$; $-1 + (-2) = -3$. $-3 \\cdot (-2) = 6$; $4 + 6 = 10$.<br><br>Bottom row: $2, 1, -3, 10$. Quotient $= 2x^2 + x - 3$, remainder $= 10$ — same as before, as it must be.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 &mdash; ZERO REMAINDER</div><div class="example-body">Divide $x^4 - 1$ by $x - 1$ using synthetic division.<br><br>Coefficients: $1, 0, 0, 0, -1$ (notice the three zeros for the missing powers). With $a = 1$:<br>Bring down 1. $1 \\cdot 1 = 1$; $0 + 1 = 1$. $1 \\cdot 1 = 1$; $0 + 1 = 1$. $1 \\cdot 1 = 1$; $0 + 1 = 1$. $1 \\cdot 1 = 1$; $-1 + 1 = 0$.<br><br>Bottom row: $1, 1, 1, 1, 0$. So $\\dfrac{x^4 - 1}{x - 1} = x^3 + x^2 + x + 1$ with remainder $0$. This is the geometric-series factorisation $x^4 - 1 = (x - 1)(x^3 + x^2 + x + 1)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10 &mdash; VERIFY THE IDENTITY</div><div class="example-body">For the division in problem 7, verify $P = D Q + R$ by direct expansion.<br><br>$D Q = (x + 2)(2x^2 + x - 3) = 2x^3 + x^2 - 3x + 4x^2 + 2x - 6 = 2x^3 + 5x^2 - x - 6$.<br><br>Add $R = 10$: $2x^3 + 5x^2 - x - 6 + 10 = 2x^3 + 5x^2 - x + 4$. ✓<br><br>This equals the original $P(x)$. The division is correct.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Add and subtract by collecting like terms, column by column; watch the sign when distributing the minus</li>
<li>Multiplication: distribute every term of one factor across every term of the other; FOIL is the linear-by-linear case</li>
<li>Degree rule: $\\deg(P \\cdot Q) = \\deg P + \\deg Q$; the leading coefficient is the product of the leading coefficients</li>
<li>Long division: divide, multiply, subtract, bring down, repeat; stop when $\\deg R < \\deg D$</li>
<li>Synthetic division: shortcut for divisors of the form $x - a$; the sign of $a$ is opposite to the sign inside the divisor</li>
<li>Division identity: $P(x) = D(x) Q(x) + R(x)$ with $\\deg R < \\deg D$; always check by expansion</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir polinomun ne olduğunu öğrendikten sonra, sıradaki soru iki polinomla <em>neler yapabileceğindir</em>.</strong> Polinomların aritmetiği sayıların aritmetiğinin üzerine kurulur ve onun kurallarını miras alır: onları toplayabilir, çıkarabilir, çarpabilir ve (dikkatle) bölebilirsin. Bunların ilk üçü, polinomun aslında benzer terimlerin düzenli bir listesi olduğunu görür görmez mekanik hâle gelir. Bölme daha hassastır — ilkokulda öğrendiğin tam sayılarla uzun bölmenin bir yansımasıdır ve tek bir cevap yerine bir bölüm ile bir kalan üretir.</p>

<p class="l-text">Bu dersin sonunda polinomları gözün kapalı toplayıp çıkarabileceksin, herhangi iki polinomu sabırlı bir dağılma ile çarpabileceksin, çarpımın derecesini doğrudan çarpanların derecelerinden tahmin edebileceksin, bir polinomu diğerine uzun bölme algoritmasıyla bölebileceksin, bölen $x - a$ biçimindeyken <em>sentetik bölme</em> kısayolunu kullanabileceksin ve tüm resmi bağlayan $P = D \\cdot Q + R$ özdeşliğini ifade edebileceksin. Bu işlemler isteğe bağlı süs değildir — çarpanlara ayırma, kökler, kalan teoremi ve rasyonel fonksiyonlar üzerine gelecek her ders bunlara dayanır.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İki polinomu benzer terimleri toplayarak toplamayı ve çıkarmayı; sonucun derecesini doğrulamayı</li>
<li>Bir polinomu tek bir terimle, dağılma yasasını temiz ve işaret hatasız uygulayarak çarpmayı</li>
<li>İki polinomu genişletilmiş dağılma (genel FOIL kalıbı) ile çarpmayı</li>
<li>Çarpımın derecesini doğrudan tahmin etmeyi: $\\deg(P \\cdot Q) = \\deg P + \\deg Q$</li>
<li>Polinomlarda uzun bölmeyi disiplinli beş adımda yürütmeyi ve doğru anda durmayı</li>
<li>Bölen $x - a$ biçimindeyken sentetik bölmeyi kısayol olarak kullanmayı ve neden işlediğini açıklamayı</li>
<li>$P(x) = D(x) \\cdot Q(x) + R(x)$ özdeşliğini $\\deg R < \\deg D$ koşuluyla ifade etmeyi ve cevapları onunla denetlemeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Toplama ve Çıkarma: Benzer Terimleri Topla</h2>

<div class="calc-highlight"><strong>İki polinomu toplamak, iki sayı sütununu toplamakla aynıdır.</strong> $x$'in kuvvetlerini hizala, her sütunun katsayılarını topla (ya da çıkar) ve sonucu yaz. Başka hiçbir şey değişmez — kuvvetlerin kendileri etkilenmez. Kaçınılması gereken tek hata farklı kuvvetleri karıştırmaktır; tıpkı sade tam sayıları toplarken onlar sütununu yüzler sütununa eklemeyeceğin gibi.</div>

<p class="l-text">İki terim aynı tam $x$ kuvvetini içeriyorsa <em>benzer terimler</em> denir. Örneğin $5x^3$ ve $-2x^3$ benzerdir (ikisi de $x^3$ taşır); $5x^3$ ile $-2x^2$ değildir (farklı kuvvetler). Polinom toplama ve çıkarması benzer terimleri birleştirmeye indirgenir.</p>

<div class="calc-formula"><div class="formula-label">İKİ POLİNOMUN TOPLAMI</div><div class="formula-main">$$P(x) + Q(x) \\;=\\; \\sum_{k=0}^{N} (a_k + b_k) \\, x^k$$</div><div class="formula-sub">$N$, iki derecenin büyük olanıdır. Kısa olan polinomda eksik olan katsayılar sıfır kabul edilir. Toplamın katsayıları konum konum elde edilir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$P(x) = 3x^3 - 2x^2 + 5x - 1$ ve $Q(x) = x^3 + 4x^2 - 7$ olsun. $P(x) + Q(x)$ değerini bul.<br><br>Benzer terimleri hizala:<br>$x^3$ sütunu: $3 + 1 = 4$.<br>$x^2$ sütunu: $-2 + 4 = 2$.<br>$x^1$ sütunu: $5 + 0 = 5$ ($Q$'nun $x$ terimi yok).<br>$x^0$ sütunu: $-1 + (-7) = -8$.<br><br>Sonuç: $P(x) + Q(x) = \\mathbf{4x^3 + 2x^2 + 5x - 8}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Aynı $P$ ve $Q$ ile $P(x) - Q(x)$ değerini bul.<br><br>Çıkarma, eklemeden önce $Q$'nun <em>her</em> katsayısının işaretini değiştirir:<br>$x^3$ sütunu: $3 - 1 = 2$.<br>$x^2$ sütunu: $-2 - 4 = -6$.<br>$x^1$ sütunu: $5 - 0 = 5$.<br>$x^0$ sütunu: $-1 - (-7) = -1 + 7 = 6$.<br><br>Sonuç: $P(x) - Q(x) = \\mathbf{2x^3 - 6x^2 + 5x + 6}$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplamın derecesi</div><div class="card-body">$\\deg(P + Q) \\leq \\max(\\deg P, \\deg Q)$. Genellikle eşitlik, ama baş terimler birbirini götürebilir — örn. $(x^3) + (-x^3 + x) = x$ derece 3'ten derece 1'e düşer.</div></div>
<div class="calc-card"><div class="card-title">Farkın derecesi</div><div class="card-body">Aynı kural: $\\deg(P - Q) \\leq \\max(\\deg P, \\deg Q)$, aynı götürülme olasılığıyla. Cevabın baş katsayısını her zaman kontrol et.</div></div>
<div class="calc-card"><div class="card-title">İşaret hatası tuzağı</div><div class="card-body">Çıkarmada eksi $Q$'nun <em>her</em> terimine dağılır. $-(x^3 + 4x^2 - 7) = -x^3 - 4x^2 + 7$ (son işaret de döner) — en çok hatanın yapıldığı yer burasıdır.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$P(x) = 2x^4 + x - 5$ ve $Q(x) = -2x^4 + 3x^2 + 6$ olsun. $P + Q$ polinomunun derecesi kaçtır? (İpucu: baş terimler götürülüyor mu?) Cevap: $P + Q = 3x^2 + x + 1$, derecesi 2 — $x^4$ terimleri götürüldü, hayatta kalan en yüksek kuvvet $x^2$.</div></div>

<h2 class="lesson-title">2. Tek Terimle Çarpma: Dağıt</h2>

<div class="calc-highlight"><strong>Bir polinomu tek bir terimle çarpmak için, polinomun <em>her</em> terimini o terimle çarp ve sonuçları topla.</strong> Bu, $a(b + c) = ab + ac$ dağılma yasasının terim sayısı kadar uygulanmasıdır. $x$'in kuvvetlerini çarparken üs kuralını hatırla: $x^m \\cdot x^n = x^{m+n}$.</div>

<div class="calc-formula"><div class="formula-label">DAĞILMA YASASI &mdash; TEK TERİM</div><div class="formula-main">$$c \\cdot x^k \\cdot \\bigl( a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_0 \\bigr) \\;=\\; c \\, a_n x^{n+k} + c \\, a_{n-1} x^{n+k-1} + \\cdots + c \\, a_0 \\, x^k$$</div><div class="formula-sub">Her katsayıyı $c$ ile çarp. Her üsse $k$ ekle. Bitti.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$3x^2 (2x^3 - 4x + 5)$ ifadesini aç.<br><br>$3x^2 \\cdot 2x^3 = 6 \\, x^{2+3} = 6x^5$.<br>$3x^2 \\cdot (-4x) = -12 \\, x^{2+1} = -12x^3$.<br>$3x^2 \\cdot 5 = 15 x^2$.<br><br>Toplam: $\\mathbf{6x^5 - 12x^3 + 15x^2}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$-2x \\bigl( x^4 + 3x^2 - 7x + 1 \\bigr)$ ifadesini aç.<br><br>Baştaki $-2x$ her terimle çarpılır:<br>$-2x \\cdot x^4 = -2x^5$.<br>$-2x \\cdot 3x^2 = -6x^3$.<br>$-2x \\cdot (-7x) = 14x^2$.<br>$-2x \\cdot 1 = -2x$.<br><br>Sonuç: $\\mathbf{-2x^5 - 6x^3 + 14x^2 - 2x}$.</div></div>

<div class="l-note"><strong>İşaret disiplini.</strong> Parantezin dışındaki bir eksi, parantezin içindeki <em>her</em> terimin işaretini çevirir. İki eksi karşılaştığında çarpım pozitiftir — aynen tam sayı aritmetiğindeki gibi.</div>

<h2 class="lesson-title">3. İki Polinomu Çarpma: Genel Dağılma</h2>

<div class="calc-highlight"><strong>İki polinomu çarpmak için birincinin <em>her</em> terimini ikincinin <em>her</em> terimiyle çarp ve sonra benzer terimleri topla.</strong> Birinci polinomun $m$ terimi, ikincinin $n$ terimi varsa, götürülmelerden önce bu $m \\cdot n$ çarpım üretir. Tanıdık <em>FOIL</em> kısaltması (İlk, Dış, İç, Son), her iki çarpan da doğrusal olduğunda yalnızca dört çarpımlı özel durumdur.</div>

<div class="calc-formula"><div class="formula-label">İKİ BİNOMUN ÇARPIMI &mdash; FOIL</div><div class="formula-main">$$(a + b)(c + d) \\;=\\; \\underbrace{ac}_{\\text{İlk}} + \\underbrace{ad}_{\\text{Dış}} + \\underbrace{bc}_{\\text{İç}} + \\underbrace{bd}_{\\text{Son}}$$</div><div class="formula-sub">Dört çarpım — sol parantezdeki her terim sağ parantezdeki her terimle eşleşir. Kısaltma sadece dört çarpımı sırayla adlandırır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 &mdash; FOIL</div><div class="example-body">$(2x + 3)(x - 5)$ ifadesini aç.<br><br>İlk: $2x \\cdot x = 2x^2$.<br>Dış: $2x \\cdot (-5) = -10x$.<br>İç: $3 \\cdot x = 3x$.<br>Son: $3 \\cdot (-5) = -15$.<br><br>Toplam: $2x^2 - 10x + 3x - 15 = \\mathbf{2x^2 - 7x - 15}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; DAHA BÜYÜK ÇARPIM</div><div class="example-body">$(x^2 + 2x - 1)(x + 3)$ ifadesini aç. İlk parantezde üç terim, ikincide iki terim var — toplamda altı çarpım.<br><br>$x^2 \\cdot x = x^3$<br>$x^2 \\cdot 3 = 3x^2$<br>$2x \\cdot x = 2x^2$<br>$2x \\cdot 3 = 6x$<br>$-1 \\cdot x = -x$<br>$-1 \\cdot 3 = -3$<br><br>Benzer terimleri topla (iki $x^2$ terimi birleşir, iki $x$ terimi birleşir):<br>$x^3 + (3 + 2) x^2 + (6 - 1) x - 3 = \\mathbf{x^3 + 5x^2 + 5x - 3}$.</div></div>

<div class="calc-graph"><div id="plot-l48-area-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $(2x + 3)(x + 4)$ için alan modeli. Büyük dikdörtgenin yatay kenarı $2x + 3$, dikey kenarı $x + 4$, dolayısıyla toplam alanı çarpımdır. Kenarları parçalara böl (yatayda $2x$ ve $3$; dikeyde $x$ ve $4$), dikdörtgen tam olarak dört FOIL çarpımına denk gelen dört küçük dikdörtgene bölünür: $2x \\cdot x = 2x^2$, $2x \\cdot 4 = 8x$, $3 \\cdot x = 3x$, $3 \\cdot 4 = 12$. Bunları topla: $2x^2 + 11x + 12$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xVal=2;
var W1=2*xVal,W2=3,H1=xVal,H2=4;
var x0=0,y0=0;
var rect1={x:[x0,x0+W1,x0+W1,x0,x0],y:[y0,y0,y0+H1,y0+H1,y0],mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.30)',line:{color:'#3b82f6',width:2},name:'2x · x = 2x²'};
var rect2={x:[x0+W1,x0+W1+W2,x0+W1+W2,x0+W1,x0+W1],y:[y0,y0,y0+H1,y0+H1,y0],mode:'lines',fill:'toself',fillcolor:'rgba(245,158,11,0.30)',line:{color:'#f59e0b',width:2},name:'3 · x = 3x'};
var rect3={x:[x0,x0+W1,x0+W1,x0,x0],y:[y0+H1,y0+H1,y0+H1+H2,y0+H1+H2,y0+H1],mode:'lines',fill:'toself',fillcolor:'rgba(16,185,129,0.30)',line:{color:'#10b981',width:2},name:'2x · 4 = 8x'};
var rect4={x:[x0+W1,x0+W1+W2,x0+W1+W2,x0+W1,x0+W1],y:[y0+H1,y0+H1,y0+H1+H2,y0+H1+H2,y0+H1],mode:'lines',fill:'toself',fillcolor:'rgba(236,72,153,0.30)',line:{color:'#ec4899',width:2},name:'3 · 4 = 12'};
var labs={x:[x0+W1/2,x0+W1+W2/2,x0+W1/2,x0+W1+W2/2,x0+W1/2,x0+W1+W2+0.4,x0+W1+W2+0.4],y:[y0+H1/2,y0+H1/2,y0+H1+H2/2,y0+H1+H2/2,-0.5,y0+H1/2,y0+H1+H2/2],mode:'text',text:['2x²','3x','8x','12','genişlik = 2x+3','yükseklik x','yükseklik 4'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.6,x0+W1+W2+2.5],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'yatay bölme: 2x | 3'},yaxis:{range:[-1.2,y0+H1+H2+0.8],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.2)',title:'dikey bölme: x | 4'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l48-area-tr',[rect1,rect2,rect3,rect4,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Görsel neden işliyor.</strong> Alan, çarpmadır. Bir dikdörtgenin kenarları $A$ ve $B$ ise alanı $A \\cdot B$'dir. Kenarları toplam olarak dilimle ($A = a_1 + a_2$, $B = b_1 + b_2$) ve dikdörtgen, alanları $a_1 b_1, a_1 b_2, a_2 b_1, a_2 b_2$ olan dört alt dikdörtgene bölünür. Toplamları orijinal $A \\cdot B$'ye eşittir — tam olarak $(a_1 + a_2)(b_1 + b_2)$. Cebirsel FOIL kalıbı, geometrik alan kalıbının kılık değiştirmiş hâlidir.</div>

<h2 class="lesson-title">4. Çarpımın Derecesi</h2>

<div class="calc-highlight"><strong>Bir çarpımın baş terimi, baş terimlerin çarpımıdır.</strong> $P$'nin en yüksek dereceli terimini $Q$'nun en yüksek dereceli terimiyle çarpmak üsleri toplar; dolayısıyla $P \\cdot Q$'da görünen en yüksek kuvvet $\\deg P + \\deg Q$'dur. Orada hiçbir götürülme olamaz (baş katsayılar tanım gereği sıfır değildir), bu nedenle kural bir eşitsizlik değil, tam bir eşitliktir.</div>

<div class="calc-formula"><div class="formula-label">ÇARPIMIN DERECESİ</div><div class="formula-main">$$\\deg(P \\cdot Q) \\;=\\; \\deg P + \\deg Q$$</div><div class="formula-sub">$P(x) = a_n x^n + \\cdots$ ve $Q(x) = b_m x^m + \\cdots$ ise, $P(x) Q(x) = a_n b_m \\, x^{n+m} + (\\text{daha düşük kuvvetler})$. Çarpımın baş katsayısı, baş katsayıların çarpımıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$P(x) = 2x^3 - x + 4$ (derece 3) ve $Q(x) = -x^2 + 5$ (derece 2) ise, $P(x) Q(x)$'nun derecesi kaçtır? Baş katsayısı kaçtır?<br><br>$\\deg(PQ) = 3 + 2 = 5$.<br>Baş katsayı: $2 \\cdot (-1) = -2$.<br><br>Dolayısıyla $P(x) Q(x) = -2x^5 + (\\text{daha düşük dereceli terimler})$. Tepeyi görmek için tüm çarpımı açmamıza gerek kalmadı.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sabit çarpı polinom</div><div class="card-body">$P$'nin derecesi $n$ ve $c \\neq 0$ bir sayı (derece 0) ise, $\\deg(cP) = n + 0 = n$. Ölçeklemek dereceyi asla değiştirmez.</div></div>
<div class="calc-card"><div class="card-title">Polinomun kuvvetleri</div><div class="card-body">$\\deg(P^k) = k \\cdot \\deg P$. Örneğin $(x^2 + 1)^5$ derecesi $5 \\cdot 2 = 10$'dur.</div></div>
<div class="calc-card"><div class="card-title">Neden götürülmez</div><div class="card-body">$P$ ve $Q$'nun baş katsayıları sıfır değildir ("baş"ın anlamı bu). Sıfırdan farklı iki sayının çarpımı sıfırdan farklıdır, dolayısıyla $PQ$'nun baş terimi yok olamaz.</div></div>
</div>

<h2 class="lesson-title">5. Polinomlarda Uzun Bölme: Algoritma</h2>

<div class="calc-highlight"><strong>Polinomlarda uzun bölme, tam sayılar için uzun bölme algoritmasını kopyalar.</strong> Bölünen, bölünen polinomdur; bölen, böldüğümüz polinomdur; sonuç bir bölüme ("cevaba") ve bir kalana (artana) bölünür. Tıpkı $17 \\div 5 = 3$ kalan $2$ olduğu gibi (yani $17 = 5 \\cdot 3 + 2$), polinom bölmesi $P(x) = D(x) \\cdot Q(x) + R(x)$ üretir.</div>

<p class="l-text"><strong>Kurulum.</strong> İki polinomu da standart biçimde (azalan kuvvetlerle) yaz, eksik kuvvetler için sıfır katsayıları ekle. Örneğin $x^3 - 7x + 6$ ifadesi, basamak değerlerinin hizalanması için $x^3 + 0 \\cdot x^2 - 7x + 6$ olarak yazılmalıdır. Bu adım, en sık yapılan aritmetik hatalarını önler.</p>

<div class="calc-formula"><div class="formula-label">BEŞ ADIMLI TARİF</div><div class="formula-main">$$\\boxed{\\text{Böl} \\;\\to\\; \\text{Çarp} \\;\\to\\; \\text{Çıkar} \\;\\to\\; \\text{İndir} \\;\\to\\; \\text{Tekrarla}}$$</div><div class="formula-sub">Sıkı bir döngüde beş adım. Her döngü, mevcut kalandan bir derece soyar. Mevcut kalanın derecesi bölenden küçük olduğunda dur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Böl</div><div class="card-body">Mevcut bölünenin <em>baş terimini</em> bölenin <em>baş terimine</em> böl. Sonuç bölümün bir sonraki terimidir. Örnek: $x^3 \\div x = x^2$.</div></div>
<div class="calc-card"><div class="card-title">2. Çarp</div><div class="card-body">Tüm böleni o yeni bölüm terimiyle çarp. Çarpımı altına yaz, $x$ kuvvetleriyle hizala.</div></div>
<div class="calc-card"><div class="card-title">3. Çıkar</div><div class="card-body">Çarpımı mevcut bölünenden çıkar. Baş terim götürülür (bölme adımının tüm amacı bu) ve geriye bir derece daha küçük bir şey kalır.</div></div>
<div class="calc-card"><div class="card-title">4. İndir</div><div class="card-body">Orijinal bölünende henüz hesaba girmemiş bir sonraki terim varsa, onu indirip mevcut kalana ekle. (Tüm terimler zaten oyundaysa bu adımı atla.)</div></div>
<div class="calc-card"><div class="card-title">5. Tekrarla (ya da dur)</div><div class="card-body">Mevcut kalanın derecesi hâlâ bölenin derecesinden büyük ya da eşitse, 1. adıma dön. Aksi takdirde dur — kalan kısım son kalandır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l48-longdiv-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Şema ne gösteriyor:</strong> $(x^3 - 7x + 6) \\div (x - 2)$ için uzun bölme düzeni. Üst satır bölümü büyürken tutar. Orta bant böleneni tutar — eksik $x^2$ terimi için baş sıfır katsayı açıkça yazılır. Her etiketli ok beş adımlı tarifin bir adımına karşılık gelir; renk kodu adım 1 (böl), 2 (çarp), 3 (çıkar) ile eşleşir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ann={x:[0.5,2.5,4.5,6.5,8.5,0.5,2.5,4.5,6.5,8.5,4.5,4.5,1,3,6,4.5,7.5],y:[5,5,5,5,5,4,4,4,4,4,3,2,4.6,2.5,1.5,1,0.5],mode:'text',text:['','x²','+ 2x','− 3','','x³','+ 0x²','− 7x','+ 6','','bölüm satırı','bölünen (eksik x² için 0)','÷ (x−2)','× (x−2) sonra çıkar','kalan = 0','adım 1: x³ ÷ x = x²','son cevap: bölüm = x²+2x−3, kalan 0'],textfont:{color:['#3b82f6','#3b82f6','#10b981','#f59e0b','#3b82f6','#e8e8e8','#e8e8e8','#e8e8e8','#e8e8e8','#e8e8e8','rgba(59,130,246,0.7)','rgba(255,255,255,0.55)','rgba(255,255,255,0.55)','rgba(255,255,255,0.55)','rgba(16,185,129,0.85)','rgba(59,130,246,0.7)','rgba(16,185,129,0.85)'],size:[14,16,16,16,14,15,15,15,15,15,11,11,10,10,11,11,11]},showlegend:false};
var hline={x:[0,9,null,0,9],y:[4.5,4.5,null,3.5,3.5],mode:'lines',line:{color:'rgba(255,255,255,0.4)',width:1.5},showlegend:false};
var arrow1={x:[1,2.3],y:[4.7,4.9],mode:'lines',line:{color:'rgba(59,130,246,0.6)',width:1,dash:'dot'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,10],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[0,6],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l48-longdiv-tr',[ann,hline,arrow1],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Ne zaman durursun?</strong> Mevcut kalanın derecesi bölenin derecesinden <em>kesinlikle</em> küçük olduğu anda. Bölenin derecesi 1 ise, kalan bir sabit (derece 0) ya da sıfır olduğunda dur. Bölenin derecesi 2 ise, kalan doğrusal ya da sabit olduğunda dur. Bu kural "kalan bölenden küçük olduğunda dur" tam sayı kuralıyla aynıdır.</div>

<h2 class="lesson-title">6. Çözümlü Örnek: $(x^3 - 7x + 6) \\div (x - 2)$</h2>

<p class="l-text">Algoritmayı baştan sona çalıştıralım. Bölünen $P(x) = x^3 - 7x + 6$. Bölen $D(x) = x - 2$. Derecesi $3 - 1 = 2$ olan bir bölüm ve derecesi 1'den küçük (yani sabit, olası sıfır) bir kalan bekliyoruz.</p>

<p class="l-text"><strong>Adım 0 (kurulum).</strong> Eksik $x^2$ katsayısını ekle: böleneni $P(x) = x^3 + 0 x^2 - 7x + 6$ olarak yeniden yaz.</p>

<div class="calc-example"><div class="example-label">BİRİNCİ TUR</div><div class="example-body"><strong>Adım 1 &mdash; böl.</strong> Bölünenin baş terimi: $x^3$. Bölenin baş terimi: $x$. Bölüm: $x^3 / x = \\mathbf{x^2}$. Üste $x^2$ yaz.<br><br><strong>Adım 2 &mdash; çarp.</strong> $x^2 \\cdot (x - 2) = x^3 - 2x^2$. Altına yaz.<br><br><strong>Adım 3 &mdash; çıkar.</strong> $(x^3 + 0 x^2) - (x^3 - 2x^2) = 2x^2$. $x^3$ götürülür.<br><br><strong>Adım 4 &mdash; indir.</strong> Bir sonraki terimi indir, $-7x$. Mevcut kalan: $2x^2 - 7x$.</div></div>

<div class="calc-example"><div class="example-label">İKİNCİ TUR</div><div class="example-body"><strong>Adım 1.</strong> Baş terim şimdi $2x^2$, $x$'e böl: $\\mathbf{2x}$ elde edersin. Bölüme ekle: $x^2 + 2x$.<br><br><strong>Adım 2.</strong> $2x \\cdot (x - 2) = 2x^2 - 4x$.<br><br><strong>Adım 3.</strong> $(2x^2 - 7x) - (2x^2 - 4x) = -3x$. $2x^2$ götürülür.<br><br><strong>Adım 4.</strong> $+6$'yı indir. Mevcut kalan: $-3x + 6$.</div></div>

<div class="calc-example"><div class="example-label">ÜÇÜNCÜ TUR</div><div class="example-body"><strong>Adım 1.</strong> Baş terim $-3x$, $x$'e bölünür: $\\mathbf{-3}$. Bölüme ekle: $x^2 + 2x - 3$.<br><br><strong>Adım 2.</strong> $-3 \\cdot (x - 2) = -3x + 6$.<br><br><strong>Adım 3.</strong> $(-3x + 6) - (-3x + 6) = 0$. Temiz götürülme.<br><br><strong>Adım 5 (dur).</strong> Kalan $0$, derecesi 1'den küçüktür. Bitti.</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\frac{x^3 - 7x + 6}{x - 2} \\;=\\; x^2 + 2x - 3, \\qquad R = 0$$</div><div class="formula-sub">Eşdeğeri: $x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3)$.</div></div>

<p class="l-text"><strong>Açarak doğrulama.</strong> Bölümü bölenle çarp:<br>$(x - 2)(x^2 + 2x - 3) = x^3 + 2x^2 - 3x - 2x^2 - 4x + 6 = x^3 - 7x + 6$. ✓</p>

<h2 class="lesson-title">7. Sentetik Bölme: $x - a$ İçin Kısayol</h2>

<div class="calc-highlight"><strong>Bölen $x - a$ özel biçimindeyken, tüm $x$'leri bırakabilir ve bir tabloda yalnızca katsayıları geçirebilirsin.</strong> Bu <em>sentetik bölmedir</em>. Matematiksel olarak uzun bölmeyle aynı algoritmadır ama defter tutma çok daha hafiftir — yalnızca sayısal katsayıları yazarsın, değişkeni yazmazsın ve her "çarp ve çıkar" yerine "$a$ ile çarp ve ekle" koyarsın. Sınav hızı için, bölen doğrusal ve baş katsayısı 1 olduğunda tercih edilen yöntem budur.</div>

<div class="calc-formula"><div class="formula-label">KURULUM</div><div class="formula-main">$$\\frac{P(x)}{x - a} \\quad\\text{burada}\\quad P(x) = c_n x^n + c_{n-1} x^{n-1} + \\cdots + c_0$$</div><div class="formula-sub">$c_n, c_{n-1}, \\ldots, c_0$ katsayılarını bir sıraya yaz. Eksik kuvvetler için $0$ kullan. Kökü $a$ sola yaz.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. İndir</div><div class="card-body">Baş katsayı $c_n$ değişmeden alt sıraya doğrudan iner. Bu, bölümün baş katsayısıdır.</div></div>
<div class="calc-card"><div class="card-title">2. $a$ ile çarp</div><div class="card-body">Yeni yazılan alt sıra girdisini $a$ ile çarp. Sonucu orta sıraya, bir sonraki katsayının altına yaz.</div></div>
<div class="calc-card"><div class="card-title">3. Topla</div><div class="card-body">Sütunu topla: üstteki orijinal katsayı artı orta sıradaki çarpım bir sonraki alt sıra girdisini verir.</div></div>
<div class="calc-card"><div class="card-title">4. Tekrarla</div><div class="card-body">Adım 2 ve 3 soldan sağa sırayı geçer. Son alt sıra girdisi kalandır; alt sıranın geri kalanı bölümün katsayılarıdır (bir derece düşük).</div></div>
</div>

<div class="l-note"><strong>Neden "$a$ ile çarp, $-a$ ile değil"?</strong> Çünkü bölen $x - a$'dır. Uzun bölme yapıp böleni bir sonraki bölüm terimiyle çarptıktan sonra çıkardığında, bölenin içindeki $-a$ ile çıkarma iki işareti çevirir, geriye $a$ ile temiz bir toplama bırakır. Aritmetik kısayol bu işaret oyunlarını gizler.</div>

<h2 class="lesson-title">8. Çözümlü Örnek: Aynı Problem Sentetik Bölmeyle</h2>

<p class="l-text">$P(x) = x^3 - 7x + 6$ ifadesini $x - 2$'ye tekrar bölelim, bu sefer sentetik olarak. Bölen $x - 2$ olduğu için $a = 2$. Eksik $x^2$ katsayısını ekle: katsayı listesi $1, 0, -7, 6$.</p>

<div class="calc-formula"><div class="formula-label">SENTETİK TABLO</div><div class="formula-main">$$\\begin{array}{c|cccc} 2 & 1 & 0 & -7 & 6 \\\\ & & 2 & 4 & -6 \\\\ \\hline & 1 & 2 & -3 & 0 \\end{array}$$</div><div class="formula-sub">Üst sıra: $P$'nin katsayıları. Orta sıra: 2 ile çarpma çarpımları. Alt sıra: bölüm katsayıları ve sonunda kalan (en sağdaki).</div></div>

<div class="calc-example"><div class="example-label">ADIM ADIM</div><div class="example-body"><strong>İndir.</strong> İlk katsayı $1$ alt sıraya iner.<br><br><strong>Çarp &amp; topla.</strong> $1 \\cdot 2 = 2$, bir sonraki üst girdi $0$'ın altına yazılır. Topla: $0 + 2 = 2$. Alt sıra şimdi $1, 2$.<br><br><strong>Çarp &amp; topla.</strong> $2 \\cdot 2 = 4$, $-7$'nin altında. Topla: $-7 + 4 = -3$. Alt sıra şimdi $1, 2, -3$.<br><br><strong>Çarp &amp; topla.</strong> $-3 \\cdot 2 = -6$, $6$'nın altında. Topla: $6 + (-6) = 0$. Alt sıra $1, 2, -3, 0$.<br><br><strong>Oku.</strong> Alt sıra soldan sağa: $1, 2, -3$ derece $2, 1, 0$ olan bölüm katsayılarıdır ve sondaki $0$ kalandır. Yani bölüm $x^2 + 2x - 3$ ve kalan $0$ — uzun bölme sonucuyla aynen örtüşür.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">UZUN BÖLME</div><div class="compare-item"><em>Her</em> bölen için çalışır</div><div class="compare-item">Her turda tüm polinomu yazar</div><div class="compare-item">Daha çok yazı, mantığı izlemesi daha kolay</div><div class="compare-item">Sınav koşullarında daha yavaş</div></div><div class="compare-col"><div class="compare-title">SENTETİK BÖLME</div><div class="compare-item">Yalnızca bölen $x - a$ (baş katsayısı 1, doğrusal) iken çalışır</div><div class="compare-item">Yalnızca katsayılar — $x$ yazılmaz</div><div class="compare-item">Çok daha az yazı, daha hızlı</div><div class="compare-item">İşarete dikkat: $a$, $x + a$'dan değil, $x - a$'dan gelir</div></div></div>

<h2 class="lesson-title">9. Bölme Özdeşliği: $P = D \\cdot Q + R$</h2>

<div class="calc-highlight"><strong>Polinom bölmesi tam sayı bölmesi ile aynı özdeşliği sağlar.</strong> Herhangi bir $P$ böleneni ve sıfırdan farklı $D$ böleni için, $P = D Q + R$ olacak ve kalan $R$'nin derecesi bölen $D$'nin derecesinden kesinlikle küçük (ya da sıfır) olacak şekilde tek bir $Q$ bölüm ve tek bir $R$ kalan vardır.</div>

<div class="calc-formula"><div class="formula-label">POLİNOMLAR İÇİN BÖLME ALGORİTMASI</div><div class="formula-main">$$P(x) \\;=\\; D(x) \\cdot Q(x) + R(x), \\qquad \\deg R < \\deg D \\;\\text{ ya da }\\; R = 0$$</div><div class="formula-sub">Bu, "bölünen = bölen &times; bölüm + kalan" ifadesinin polinom karşılığıdır. Hem $Q$ hem de $R$ benzersiz biçimde $P$ ve $D$ tarafından belirlenir.</div></div>

<p class="l-text"><strong>Nasıl kullanılır.</strong> Bir bölme problemini bitirdiğinde, $D \\cdot Q + R$ ifadesini açıp $P$'ye eşit olduğunu kontrol ederek işini doğrulayabilirsin. Tek bir katsayı bile yanlışsa, bir yerde hata yapmışsındır — ve denetim devam etmeden önce onu yakalayacaktır.</p>

<div class="calc-example"><div class="example-label">ÖNCEKİ PROBLEM İÇİN DENETİM</div><div class="example-body">$\\dfrac{x^3 - 7x + 6}{x - 2} = x^2 + 2x - 3$, $R = 0$ bulduk.<br><br>Yani özdeşlik şunu iddia ediyor: $x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3) + 0$.<br><br>Aç:<br>$(x - 2)(x^2 + 2x - 3) = x \\cdot x^2 + x \\cdot 2x + x \\cdot (-3) - 2 \\cdot x^2 - 2 \\cdot 2x - 2 \\cdot (-3)$<br>$= x^3 + 2x^2 - 3x - 2x^2 - 4x + 6$<br>$= x^3 - 7x + 6$. ✓<br><br>Denetim sağlanıyor — bölümümüz ve kalanımız doğrudur.</div></div>

<div class="calc-example"><div class="example-label">SIFIRDAN FARKLI KALANLI ÖRNEK</div><div class="example-body">$P(x) = 2x^2 + 5x + 1$ ifadesini $D(x) = x + 3$'e böl.<br><br>$a = -3$ ile sentetik (çünkü $D = x - (-3)$): katsayılar $2, 5, 1$.<br><br>2'yi indir. $2 \\cdot (-3) = -6$ ile çarp. $5 + (-6) = -1$ ile topla. $-1 \\cdot (-3) = 3$ ile çarp. $1 + 3 = 4$ ile topla.<br><br>Alt sıra: $2, -1, 4$. Yani bölüm $= 2x - 1$, kalan $= 4$.<br><br>Denetim: $(x + 3)(2x - 1) + 4 = 2x^2 - x + 6x - 3 + 4 = 2x^2 + 5x + 1$. ✓</div></div>

<div class="l-note"><strong>İlerideki ders.</strong> Bir sonraki ders bu özdeşliği kullanarak <em>Kalan Teoremini</em> ifade eder ve kanıtlar: $P(x)$'i $x - a$'ya böldüğünde kalan tam olarak $P(a)$'dır. Bu, tüm uzun bölmeyi tek bir yerine koymaya indirir — sürekli kullanacağın olağanüstü bir basitleştirme.</div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<p class="l-text">Derste anlatılan her işlemi kapsayan on standart alıştırma. Cevabı okumadan önce her birini dene.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; TOPLAM</div><div class="example-body"><strong>Hesapla:</strong> $(4x^3 - x^2 + 2) + (-2x^3 + 3x^2 - 5x)$.<br><br>Benzer terimler: $(4 - 2)x^3 + (-1 + 3)x^2 + (0 - 5)x + (2 + 0) = \\mathbf{2x^3 + 2x^2 - 5x + 2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; FARK</div><div class="example-body"><strong>Hesapla:</strong> $(5x^4 + 2x^2 - 7) - (5x^4 - x^3 + 2x^2)$.<br><br>Önce eksiyi dağıt: $5x^4 + 2x^2 - 7 - 5x^4 + x^3 - 2x^2 = (5-5)x^4 + x^3 + (2-2)x^2 - 7 = \\mathbf{x^3 - 7}$. Derecenin 4'ten 3'e düştüğüne dikkat — $x^4$ terimleri götürüldü.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TEK TERİMLİ ÇARPIM</div><div class="example-body"><strong>Aç:</strong> $-4x^2 \\bigl(3x^3 - 2x^2 + x - 5\\bigr)$.<br><br>Dağıt: $-4x^2 \\cdot 3x^3 = -12x^5$; $-4x^2 \\cdot (-2x^2) = 8x^4$; $-4x^2 \\cdot x = -4x^3$; $-4x^2 \\cdot (-5) = 20x^2$.<br><br>Toplam: $\\mathbf{-12x^5 + 8x^4 - 4x^3 + 20x^2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; FOIL</div><div class="example-body"><strong>Aç:</strong> $(3x - 2)(2x + 5)$.<br><br>İ: $3x \\cdot 2x = 6x^2$. D: $3x \\cdot 5 = 15x$. İ: $-2 \\cdot 2x = -4x$. S: $-2 \\cdot 5 = -10$.<br><br>Toplam: $6x^2 + 15x - 4x - 10 = \\mathbf{6x^2 + 11x - 10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DAHA BÜYÜK ÇARPIM</div><div class="example-body"><strong>Aç:</strong> $(x^2 - 3x + 1)(x^2 + 2)$.<br><br>$x^2 \\cdot x^2 = x^4$; $x^2 \\cdot 2 = 2x^2$; $-3x \\cdot x^2 = -3x^3$; $-3x \\cdot 2 = -6x$; $1 \\cdot x^2 = x^2$; $1 \\cdot 2 = 2$.<br><br>Topla: $x^4 - 3x^3 + (2 + 1)x^2 - 6x + 2 = \\mathbf{x^4 - 3x^3 + 3x^2 - 6x + 2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; DERECE TAHMİNİ</div><div class="example-body">$P(x) = 3x^5 - x + 1$ ve $Q(x) = -2x^3 + 7$ ise, açmadan $P(x) Q(x)$'nun derecesini ve baş katsayısını bul.<br><br>Derece: $5 + 3 = 8$. Baş katsayı: $3 \\cdot (-2) = -6$. Yani $P(x)Q(x) = -6x^8 + (\\text{daha düşük dereceli terimler})$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; UZUN BÖLME</div><div class="example-body">$2x^3 + 5x^2 - x + 4$ ifadesini $x + 2$'ye uzun bölme ile <strong>böl</strong>.<br><br>Adım 1: $2x^3 / x = 2x^2$. Çarp: $2x^2(x+2) = 2x^3 + 4x^2$. Çıkar: $(2x^3 + 5x^2) - (2x^3 + 4x^2) = x^2$. İndir: $x^2 - x$.<br><br>Adım 2: $x^2 / x = x$. Çarp: $x(x+2) = x^2 + 2x$. Çıkar: $(x^2 - x) - (x^2 + 2x) = -3x$. İndir: $-3x + 4$.<br><br>Adım 3: $-3x / x = -3$. Çarp: $-3(x+2) = -3x - 6$. Çıkar: $(-3x + 4) - (-3x - 6) = 10$. Dur (derece 0 < derece 1).<br><br>Bölüm $= 2x^2 + x - 3$, kalan $= \\mathbf{10}$. Yani $2x^3 + 5x^2 - x + 4 = (x + 2)(2x^2 + x - 3) + 10$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SENTETİK BÖLME</div><div class="example-body">Problem 7'yi sentetik bölme ile yeniden çöz. Bölen $x + 2$ olduğu için $a = -2$. Katsayılar $2, 5, -1, 4$.<br><br>2'yi indir. $2 \\cdot (-2) = -4$; $5 + (-4) = 1$. $1 \\cdot (-2) = -2$; $-1 + (-2) = -3$. $-3 \\cdot (-2) = 6$; $4 + 6 = 10$.<br><br>Alt sıra: $2, 1, -3, 10$. Bölüm $= 2x^2 + x - 3$, kalan $= 10$ — daha önceki gibi, olması gerektiği gibi.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 &mdash; SIFIR KALAN</div><div class="example-body">$x^4 - 1$ ifadesini $x - 1$'e sentetik bölme ile böl.<br><br>Katsayılar: $1, 0, 0, 0, -1$ (eksik kuvvetler için üç sıfıra dikkat). $a = 1$ ile:<br>1'i indir. $1 \\cdot 1 = 1$; $0 + 1 = 1$. $1 \\cdot 1 = 1$; $0 + 1 = 1$. $1 \\cdot 1 = 1$; $0 + 1 = 1$. $1 \\cdot 1 = 1$; $-1 + 1 = 0$.<br><br>Alt sıra: $1, 1, 1, 1, 0$. Yani $\\dfrac{x^4 - 1}{x - 1} = x^3 + x^2 + x + 1$ ve kalan $0$. Bu, geometrik seri çarpanlamasıdır: $x^4 - 1 = (x - 1)(x^3 + x^2 + x + 1)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10 &mdash; ÖZDEŞLİĞİ DOĞRULA</div><div class="example-body">Problem 7'deki bölme için doğrudan açarak $P = D Q + R$ özdeşliğini doğrula.<br><br>$D Q = (x + 2)(2x^2 + x - 3) = 2x^3 + x^2 - 3x + 4x^2 + 2x - 6 = 2x^3 + 5x^2 - x - 6$.<br><br>$R = 10$ ekle: $2x^3 + 5x^2 - x - 6 + 10 = 2x^3 + 5x^2 - x + 4$. ✓<br><br>Bu orijinal $P(x)$'e eşittir. Bölme doğrudur.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Benzer terimleri sütun sütun toplayıp çıkar; eksiyi dağıtırken işarete dikkat et</li>
<li>Çarpma: bir çarpanın her terimini diğerinin her terimine dağıt; FOIL, doğrusal-doğrusal özel durumdur</li>
<li>Derece kuralı: $\\deg(P \\cdot Q) = \\deg P + \\deg Q$; baş katsayı, baş katsayıların çarpımıdır</li>
<li>Uzun bölme: böl, çarp, çıkar, indir, tekrarla; $\\deg R < \\deg D$ olduğunda dur</li>
<li>Sentetik bölme: $x - a$ biçimli bölenler için kısayol; $a$'nın işareti bölenin içindeki işaretin tersidir</li>
<li>Bölme özdeşliği: $P(x) = D(x) Q(x) + R(x)$ ve $\\deg R < \\deg D$; her zaman açarak doğrula</li>
</ul>
</div>`
};
