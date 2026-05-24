window.LISE_MAT_L50 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Factoring is the reverse of multiplication.</strong> If multiplication takes two simple pieces and glues them into one tangled expression, factoring is the patient art of taking a tangled expression and discovering the simple pieces hidden inside it. Every equation you will ever solve, every fraction you will ever simplify, every integral you will ever attempt — almost all of them start with a moment where you stop and ask: <em>can I factor this?</em></p>

<p class="l-text">By the end of this lesson, you will recognise the six classical factoring patterns by sight, know which technique to reach for in any given problem, and be able to factor polynomials of degree two, three, four, and beyond with confidence. The techniques themselves are mechanical. The hard part is pattern recognition — and that comes only from practice. We will do dozens of worked examples and finish with ten classical exercises.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Pull out the greatest common factor (GCF) from any polynomial — the first step in every problem</li>
<li>Apply grouping to four-term polynomials by splitting them into two pairs</li>
<li>Recognise and use the three special products: difference of squares, perfect square trinomial, and sum/difference of cubes</li>
<li>Factor monic quadratics $x^2 + px + q$ by finding two numbers with a given sum and product</li>
<li>Factor general quadratics $ax^2 + bx + c$ using the AC-method (the "snowflake" trick)</li>
<li>Apply the Rational Root Theorem to find candidate roots of higher-degree polynomials</li>
<li>Combine the Remainder Theorem with synthetic division to factor cubics and quartics completely</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Factor at All?</h2>

<div class="calc-highlight"><strong>Factoring is the single most useful algebraic skill at the high school level.</strong> Without it, you cannot solve quadratic equations cleanly, simplify rational expressions, find limits in calculus that take the indeterminate form 0/0, or split a complicated integral into easier pieces. Master factoring now and the next five years of mathematics become dramatically easier.</div>

<p class="l-text">Here is the central idea. Suppose you want to solve the equation $x^2 - 5x + 6 = 0$. You could plug it into the quadratic formula and grind out the arithmetic. Or you could notice that the left-hand side factors as $(x-2)(x-3)$, and then the equation becomes $(x-2)(x-3) = 0$. Now the <strong>zero-product property</strong> says a product of two numbers is zero if and only if at least one of them is zero. So either $x-2=0$ (giving $x=2$) or $x-3=0$ (giving $x=3$). Done in three lines.</p>

<div class="calc-formula"><div class="formula-label">THE ZERO-PRODUCT PROPERTY</div><div class="formula-main">$$A \\cdot B \\;=\\; 0 \\quad\\Longleftrightarrow\\quad A = 0 \\;\\text{ or }\\; B = 0$$</div><div class="formula-sub">This single fact is what makes factoring so powerful for solving equations. It only works for products equal to zero — never split $A \\cdot B = 12$ as $A=12, B=1$ or anything like that.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Solve equations</div><div class="card-body">Set everything to zero, factor, then use the zero-product property on each factor.</div></div>
<div class="calc-card"><div class="card-title">Simplify fractions</div><div class="card-body">A fraction like $\\dfrac{x^2-9}{x-3}$ simplifies to $x+3$ once you factor the numerator as $(x-3)(x+3)$.</div></div>
<div class="calc-card"><div class="card-title">Resolve 0/0 limits</div><div class="card-body">In calculus, $\\lim_{x \\to 2}\\dfrac{x^2-4}{x-2}$ is solved by factoring and cancelling — a recurring trick.</div></div>
</div>

<h2 class="lesson-title">2. The Greatest Common Factor (GCF) — Always Try This First</h2>

<div class="calc-highlight"><strong>Before anything else, look for a common factor.</strong> Every term in the polynomial may share the same number, the same variable, or both. Pull that common piece out of every term — the result is an immediately simpler expression that you can then factor further.</div>

<p class="l-text">The procedure is mechanical:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>Find the largest integer that divides <em>every</em> coefficient.</li>
<li>For each variable that appears in <em>every</em> term, take the lowest power present.</li>
<li>Multiply these together — that is the GCF.</li>
<li>Write the polynomial as GCF times (whatever is left).</li>
</ol>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Factor <strong>$5x^3 + 10x^2$</strong>.<br><br>Numbers: GCD(5, 10) = 5.<br>Variable: both terms contain $x^2$ at minimum (since $x^3 = x \\cdot x^2$).<br>GCF = $5x^2$.<br><br>Pulling it out: $5x^3 + 10x^2 = 5x^2(x + 2)$.<br><br><strong>Check by expanding:</strong> $5x^2 \\cdot x = 5x^3$ and $5x^2 \\cdot 2 = 10x^2$. Sum is $5x^3 + 10x^2$. Correct.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Factor <strong>$12a^4b^2 - 18a^2b^3 + 6a^2b^2$</strong>.<br><br>Numbers: GCD(12, 18, 6) = 6.<br>Variable $a$: lowest power is $a^2$.<br>Variable $b$: lowest power is $b^2$.<br>GCF = $6a^2b^2$.<br><br>Result: $6a^2b^2(2a^2 - 3b + 1)$. Note the "+1" — when you pull a factor out of itself, the remainder is 1, not 0.</div></div>

<div class="l-note"><strong>Common mistake:</strong> forgetting the +1. Students factor $6x^2 + 6$ as $6(x^2)$ instead of $6(x^2 + 1)$. Every term must be accounted for — if you pull the GCF out of a term that <em>is</em> the GCF, what is left is 1.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Factor $-3x^2 + 6x$. If the leading coefficient is negative, it is often clearer to pull out the negative as well: $-3x(x - 2)$. This is a matter of style, not correctness — both $-3x(x-2)$ and $3x(-x+2)$ are valid, but the first form is preferred because the leading coefficient inside the parentheses stays positive.</div></div>

<h2 class="lesson-title">3. Factoring by Grouping</h2>

<div class="calc-highlight"><strong>When a polynomial has four terms and no obvious common factor across all four, try grouping.</strong> Split the four terms into two pairs, factor each pair separately, and hope that the two pairs reveal a common binomial factor. If they do, you are done.</div>

<p class="l-text">The procedure has three steps:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>Group the four terms into two pairs (usually the first two and the last two).</li>
<li>Factor the GCF out of each pair separately.</li>
<li>If the parenthesised expressions match, factor out that common binomial.</li>
</ol>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Factor <strong>$x^3 + x^2 + 2x + 2$</strong>.<br><br>Group: $(x^3 + x^2) + (2x + 2)$.<br>Factor each pair: $x^2(x + 1) + 2(x + 1)$.<br>Common binomial: $(x + 1)$.<br>Pull it out: $\\mathbf{(x+1)(x^2 + 2)}$.<br><br><strong>Check:</strong> $(x+1)(x^2+2) = x^3 + 2x + x^2 + 2 = x^3 + x^2 + 2x + 2$. Correct.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4</div><div class="example-body">Factor <strong>$3xy - 6y + 5x - 10$</strong>.<br><br>Group: $(3xy - 6y) + (5x - 10)$.<br>Factor each pair: $3y(x - 2) + 5(x - 2)$.<br>Common binomial: $(x - 2)$.<br>Result: $\\mathbf{(x - 2)(3y + 5)}$.</div></div>

<div class="l-note"><strong>If the binomials don't match,</strong> try rearranging the original four terms in a different order before grouping. Sometimes pairing the first and third with the second and fourth works when the natural pairing fails. If no rearrangement helps, the polynomial is not factorable by grouping.</div>

<h2 class="lesson-title">4. Special Products: Difference of Squares and Perfect Square Trinomial</h2>

<div class="calc-highlight"><strong>Three special multiplication patterns appear so often that recognising them on sight saves enormous amounts of work.</strong> Memorise these now — you will use them every day for the next five years.</div>

<div class="calc-formula"><div class="formula-label">DIFFERENCE OF SQUARES</div><div class="formula-main">$$a^2 - b^2 \\;=\\; (a - b)(a + b)$$</div><div class="formula-sub">A subtraction of two perfect squares always factors. There is no analogous formula for $a^2 + b^2$ over the real numbers — a sum of squares does not factor (with real coefficients).</div></div>

<div class="calc-formula"><div class="formula-label">PERFECT SQUARE TRINOMIAL</div><div class="formula-main">$$a^2 + 2ab + b^2 \\;=\\; (a + b)^2 \\qquad\\qquad a^2 - 2ab + b^2 \\;=\\; (a - b)^2$$</div><div class="formula-sub">Recognise by: first and last terms are perfect squares, middle term is twice the product of their square roots.</div></div>

<div class="calc-graph"><div id="plot-l50-diff-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Geometric proof of $a^2 - b^2 = (a-b)(a+b)$:</strong> a large $a \\times a$ square has a smaller $b \\times b$ square cut out from one corner. The remaining L-shape can be rearranged into a single rectangle whose sides are $(a-b)$ and $(a+b)$. The areas are equal, so the algebraic identity is forced.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=4,b=1.5;
var sq1={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a×a square',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.15)'};
var sq2={x:[a-b,a,a,a-b,a-b],y:[a-b,a-b,a,a,a-b],mode:'lines',fill:'toself',name:'b×b removed',line:{color:'#ef4444',width:2},fillcolor:'rgba(239,68,68,0.30)'};
var annoA={x:a/2,y:-0.35,xref:'x',yref:'y',text:'a',showarrow:false,font:{color:'#e8e8e8',size:14}};
var annoB={x:a-b/2,y:a-b-0.35,xref:'x',yref:'y',text:'b',showarrow:false,font:{color:'#ef4444',size:14}};
var annoArea={x:1.5,y:1.5,xref:'x',yref:'y',text:'a² − b²<br>= (a−b)(a+b)',showarrow:false,font:{color:'#f59e0b',size:13}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.6,a+0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{range:[-0.6,a+0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',showticklabels:false},margin:{t:20,r:20,b:30,l:20},showlegend:false,annotations:[annoA,annoB,annoArea]};
Plotly.newPlot('plot-l50-diff-en',[sq1,sq2],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5</div><div class="example-body">Factor <strong>$x^2 - 25$</strong>.<br><br>Both terms are perfect squares: $x^2 = (x)^2$ and $25 = (5)^2$. Difference of squares pattern with $a=x, b=5$.<br>Result: $\\mathbf{(x-5)(x+5)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6</div><div class="example-body">Factor <strong>$9x^2 - 16y^4$</strong>.<br><br>Identify squares: $9x^2 = (3x)^2$, $16y^4 = (4y^2)^2$.<br>Apply pattern with $a = 3x, b = 4y^2$.<br>Result: $\\mathbf{(3x - 4y^2)(3x + 4y^2)}$.</div></div>

<div class="calc-graph"><div id="plot-l50-square-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Geometric proof of $(a+b)^2 = a^2 + 2ab + b^2$:</strong> a square with side $a+b$ is divided into four pieces — one $a \\times a$ square, two $a \\times b$ rectangles, and one $b \\times b$ square. Summing the areas gives the trinomial.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=3,b=1.8;
var s1={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a² (blue)',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.30)'};
var s2={x:[a,a+b,a+b,a,a],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'ab (gold)',line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.25)'};
var s3={x:[0,a,a,0,0],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'ab (gold)',line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.25)',showlegend:false};
var s4={x:[a,a+b,a+b,a,a],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'b² (red)',line:{color:'#ef4444',width:2},fillcolor:'rgba(239,68,68,0.30)'};
var t1={x:a/2,y:a/2,xref:'x',yref:'y',text:'a²',showarrow:false,font:{color:'#3b82f6',size:18}};
var t2={x:a+b/2,y:a/2,xref:'x',yref:'y',text:'ab',showarrow:false,font:{color:'#f59e0b',size:15}};
var t3={x:a/2,y:a+b/2,xref:'x',yref:'y',text:'ab',showarrow:false,font:{color:'#f59e0b',size:15}};
var t4={x:a+b/2,y:a+b/2,xref:'x',yref:'y',text:'b²',showarrow:false,font:{color:'#ef4444',size:15}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,a+b+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{range:[-0.5,a+b+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',showticklabels:false},margin:{t:20,r:20,b:30,l:20},showlegend:false,annotations:[t1,t2,t3,t4]};
Plotly.newPlot('plot-l50-square-en',[s1,s2,s3,s4],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7</div><div class="example-body">Factor <strong>$x^2 + 10x + 25$</strong>.<br><br>First term: $x^2 = (x)^2$. Last term: $25 = (5)^2$. Middle: $2 \\cdot x \\cdot 5 = 10x$. Matches perfect square pattern with $a = x, b = 5$.<br>Result: $\\mathbf{(x + 5)^2}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8</div><div class="example-body">Factor <strong>$4x^2 - 12x + 9$</strong>.<br><br>First term: $4x^2 = (2x)^2$. Last: $9 = (3)^2$. Middle: $-2 \\cdot (2x) \\cdot 3 = -12x$. Matches with $a = 2x, b = 3$ and the minus sign.<br>Result: $\\mathbf{(2x - 3)^2}$.</div></div>

<h2 class="lesson-title">5. Sum and Difference of Cubes</h2>

<div class="calc-highlight"><strong>Unlike sums of squares, sums of cubes <em>do</em> factor.</strong> Both $a^3 + b^3$ and $a^3 - b^3$ have clean factorisations. Memorise the signs carefully — they trip up almost every student the first time.</div>

<div class="calc-formula"><div class="formula-label">DIFFERENCE OF CUBES</div><div class="formula-main">$$a^3 - b^3 \\;=\\; (a - b)(a^2 + ab + b^2)$$</div></div>

<div class="calc-formula"><div class="formula-label">SUM OF CUBES</div><div class="formula-main">$$a^3 + b^3 \\;=\\; (a + b)(a^2 - ab + b^2)$$</div><div class="formula-sub">Mnemonic <strong>"SOAP"</strong>: <em>Same, Opposite, Always Positive</em>. The binomial keeps the same sign as the original, the middle term of the trinomial uses the opposite sign, and the last term of the trinomial is always positive.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9</div><div class="example-body">Factor <strong>$x^3 - 8$</strong>.<br><br>$8 = 2^3$, so $a = x, b = 2$. Difference of cubes.<br>Result: $\\mathbf{(x - 2)(x^2 + 2x + 4)}$.<br><br><strong>Check:</strong> $(x-2)(x^2+2x+4) = x^3 + 2x^2 + 4x - 2x^2 - 4x - 8 = x^3 - 8$. Correct.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 10</div><div class="example-body">Factor <strong>$27x^3 + 125$</strong>.<br><br>$27x^3 = (3x)^3$ and $125 = 5^3$. Sum of cubes with $a = 3x, b = 5$.<br>Result: $\\mathbf{(3x + 5)(9x^2 - 15x + 25)}$.</div></div>

<div class="l-note"><strong>The quadratic factor is irreducible over the reals.</strong> For instance, $x^2 + 2x + 4$ has discriminant $4 - 16 = -12 < 0$, so it never factors further with real coefficients. The cube factorisation is therefore complete.</div>

<h2 class="lesson-title">6. Factoring Monic Quadratics $x^2 + px + q$</h2>

<div class="calc-highlight"><strong>When the leading coefficient is 1</strong>, factoring $x^2 + px + q$ reduces to a small puzzle: <em>find two numbers whose sum is p and whose product is q</em>. Once you have those two numbers, the factorisation writes itself.</div>

<div class="calc-formula"><div class="formula-label">MONIC QUADRATIC FACTORISATION</div><div class="formula-main">$$x^2 + px + q \\;=\\; (x + m)(x + n) \\quad\\text{where}\\quad m + n = p,\\; m \\cdot n = q$$</div></div>

<p class="l-text">The reasoning is just the distributive law in reverse: $(x+m)(x+n) = x^2 + (m+n)x + mn$. So if we are given $x^2 + px + q$ and want to write it as $(x+m)(x+n)$, we need $m+n = p$ and $mn = q$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 11</div><div class="example-body">Factor <strong>$x^2 + 7x + 12$</strong>.<br><br>Need: two numbers with sum 7 and product 12. Try 3 and 4: $3+4=7$ ✓ and $3 \\cdot 4 = 12$ ✓.<br>Result: $\\mathbf{(x+3)(x+4)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 12</div><div class="example-body">Factor <strong>$x^2 - 5x + 6$</strong>.<br><br>Need: sum $-5$, product $+6$. Both numbers must be negative (positive product, negative sum). Try $-2, -3$: sum $-5$ ✓, product $6$ ✓.<br>Result: $\\mathbf{(x-2)(x-3)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 13</div><div class="example-body">Factor <strong>$x^2 + 2x - 15$</strong>.<br><br>Need: sum $+2$, product $-15$. Negative product means one number positive, one negative. Try $+5, -3$: sum $+2$ ✓, product $-15$ ✓.<br>Result: $\\mathbf{(x+5)(x-3)}$.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIGN OF q</div><div class="compare-item">$q > 0$: both numbers have the <strong>same sign</strong></div><div class="compare-item">$q < 0$: the two numbers have <strong>opposite signs</strong></div><div class="compare-item">Look at $p$ to decide which sign dominates</div></div><div class="compare-col"><div class="compare-title">SIGN OF p (when q &gt; 0)</div><div class="compare-item">$p > 0$: both numbers <strong>positive</strong></div><div class="compare-item">$p < 0$: both numbers <strong>negative</strong></div><div class="compare-item">When $q < 0$: the larger-magnitude number takes the sign of $p$</div></div></div>

<h2 class="lesson-title">7. The General Quadratic $ax^2 + bx + c$ — The AC Method</h2>

<div class="calc-highlight"><strong>When the leading coefficient is not 1</strong>, the puzzle is slightly harder. We use the <em>AC-method</em> (sometimes called the "snowflake" or "splitting the middle term" method).</div>

<p class="l-text">Procedure:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>Compute the product $a \\cdot c$.</li>
<li>Find two numbers whose <strong>product is $a \\cdot c$</strong> and whose <strong>sum is $b$</strong>.</li>
<li>Split the middle term $bx$ into the sum of those two numbers times $x$.</li>
<li>Factor by grouping the resulting four-term polynomial.</li>
</ol>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 14</div><div class="example-body">Factor <strong>$2x^2 + 7x + 3$</strong>.<br><br>$a \\cdot c = 2 \\cdot 3 = 6$. Need two numbers: product 6, sum 7. Try 6 and 1: ✓.<br>Split: $2x^2 + 6x + x + 3$.<br>Group: $(2x^2 + 6x) + (x + 3) = 2x(x + 3) + 1(x + 3) = (x+3)(2x+1)$.<br>Result: $\\mathbf{(2x + 1)(x + 3)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 15</div><div class="example-body">Factor <strong>$6x^2 - 11x - 10$</strong>.<br><br>$a \\cdot c = 6 \\cdot (-10) = -60$. Need two numbers: product $-60$, sum $-11$. Try $-15$ and $+4$: product $-60$ ✓, sum $-11$ ✓.<br>Split: $6x^2 - 15x + 4x - 10$.<br>Group: $(6x^2 - 15x) + (4x - 10) = 3x(2x - 5) + 2(2x - 5) = (2x - 5)(3x + 2)$.<br>Result: $\\mathbf{(2x - 5)(3x + 2)}$.</div></div>

<div class="think-box"><div class="think-label">WHY THE AC-METHOD WORKS</div><div class="think-body">If $ax^2 + bx + c = (mx + n)(px + q)$, then expanding gives $ax^2 + (mq + np)x + nq$, so $a = mp$, $c = nq$, and $b = mq + np$. The cross-term $mq$ has product $(mq)(np) = (mp)(nq) = ac$ with the other cross-term $np$, and their sum is $b$. That is why "product $ac$, sum $b$" is exactly the right search.</div></div>

<h2 class="lesson-title">8. The Rational Root Theorem</h2>

<div class="calc-highlight"><strong>For higher-degree polynomials, the rational root theorem dramatically narrows the search.</strong> Instead of trying every possible number, you only need to check a small finite list of candidates.</div>

<div class="calc-formula"><div class="formula-label">RATIONAL ROOT THEOREM</div><div class="formula-main">$$\\text{If } P(x) = a_n x^n + \\cdots + a_1 x + a_0 \\text{ has a rational root } \\tfrac{p}{q} \\text{ (in lowest terms),}$$ $$\\text{then } p \\mid a_0 \\;\\text{ and }\\; q \\mid a_n.$$</div><div class="formula-sub">In words: the numerator divides the constant term; the denominator divides the leading coefficient. Combine into a finite candidate list, then test each one.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 16</div><div class="example-body">Find a rational root of <strong>$P(x) = 2x^3 - 5x^2 - 4x + 3$</strong>.<br><br>Constant: 3. Divisors: $\\pm 1, \\pm 3$.<br>Leading: 2. Divisors: $\\pm 1, \\pm 2$.<br>Candidates $p/q$: $\\pm 1, \\pm 3, \\pm \\tfrac{1}{2}, \\pm \\tfrac{3}{2}$.<br><br>Test $x = 3$: $P(3) = 54 - 45 - 12 + 3 = 0$. ✓<br><br>So $x = 3$ is a root, which means $(x - 3)$ is a factor of $P(x)$. We can then divide $P(x)$ by $(x-3)$ to find the remaining quadratic factor.</div></div>

<p class="l-text">The rational root theorem only gives <em>candidates</em>. Many polynomials have no rational roots at all — for instance, $x^2 - 2$ has only irrational roots $\\pm\\sqrt{2}$. The theorem helps you spot rational roots quickly, but does not guarantee they exist.</p>

<h2 class="lesson-title">9. Factoring Higher-Degree Polynomials</h2>

<div class="calc-highlight"><strong>For polynomials of degree 3, 4, or higher, the workflow is: find one root using the rational root theorem, divide to peel off that factor, then repeat on the smaller quotient.</strong> The <em>Remainder Theorem</em> ties the algebra together.</div>

<div class="calc-formula"><div class="formula-label">REMAINDER &amp; FACTOR THEOREMS</div><div class="formula-main">$$P(c) = 0 \\quad\\Longleftrightarrow\\quad (x - c) \\text{ is a factor of } P(x)$$</div><div class="formula-sub">If plugging in $x = c$ gives zero, then $(x - c)$ divides the polynomial evenly. This is the bridge from "$c$ is a root" to "$(x-c)$ is a factor".</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 17 — full factorisation of a cubic</div><div class="example-body">Factor <strong>$P(x) = x^3 - 6x^2 + 11x - 6$</strong> completely.<br><br><strong>Step 1.</strong> Rational candidates: $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.<br>Test $x=1$: $1 - 6 + 11 - 6 = 0$ ✓. So $(x-1)$ is a factor.<br><br><strong>Step 2.</strong> Polynomial divide $P(x) \\div (x-1)$:<br>$x^3 - 6x^2 + 11x - 6 = (x - 1)(x^2 - 5x + 6)$.<br><br><strong>Step 3.</strong> Factor the quadratic $x^2 - 5x + 6$: sum $-5$, product $6$ gives $-2, -3$.<br>$x^2 - 5x + 6 = (x - 2)(x - 3)$.<br><br><strong>Final answer:</strong> $\\mathbf{P(x) = (x-1)(x-2)(x-3)}$. Roots: $1, 2, 3$.</div></div>

<div class="calc-graph"><div id="plot-l50-cubic-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>The cubic $P(x) = x^3 - 6x^2 + 11x - 6$ plotted alongside its three roots.</strong> The graph crosses the x-axis exactly at $x = 1, 2, 3$ — the same numbers that appear in the factorisation $(x-1)(x-2)(x-3)$. Roots and factors are two ways of looking at the same information.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=0.3+3.5*i/200;var y=x*x*x-6*x*x+11*x-6;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x) = x³−6x²+11x−6',line:{color:'#3b82f6',width:2.5}};
var roots={x:[1,2,3],y:[0,0,0],mode:'markers+text',name:'roots',marker:{color:'#f59e0b',size:11},text:['x=1','x=2','x=3'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var axis={x:[0,4],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0.2,3.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-0.6,0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l50-cubic-en',[axis,curve,roots],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Synthetic division</strong> is a compact shortcut for dividing $P(x)$ by $(x - c)$. Write the coefficients of $P$ in a row, drop the leading one, multiply by $c$, add to the next coefficient, and repeat. The last number should be 0 if $c$ is a root; the rest is the quotient.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 18 — synthetic division</div><div class="example-body">Divide $x^3 - 6x^2 + 11x - 6$ by $(x - 1)$ using synthetic division.<br><br>Coefficients: $[1, -6, 11, -6]$. Trial root: $c = 1$.<br><br><pre style="background:rgba(255,255,255,0.04);padding:0.8rem;border-radius:6px;color:#e8e8e8;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.6">  1 |  1   -6   11   -6
    |        1   -5    6
    |________________
       1   -5    6    0   ← remainder 0 confirms x=1 is a root</pre><br>Quotient: $x^2 - 5x + 6$. Remainder: 0. So $P(x) = (x-1)(x^2 - 5x + 6)$.</div></div>

<h2 class="lesson-title">10. Ten Classical Practice Problems</h2>

<div class="calc-highlight">Each problem targets a specific technique from above. Try each one before reading the solution. The solutions are placed below in compact form — review them only after your own attempt.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1 — GCF</div><div class="card-body">Factor $8x^3 + 12x^2 - 20x$.<br><br><em>Solution:</em> GCF = $4x$. Result: $4x(2x^2 + 3x - 5) = 4x(2x + 5)(x - 1)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2 — Grouping</div><div class="card-body">Factor $2x^3 + 6x^2 + x + 3$.<br><br><em>Solution:</em> $(2x^3 + 6x^2) + (x + 3) = 2x^2(x+3) + 1(x+3) = (x+3)(2x^2+1)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3 — Difference of squares</div><div class="card-body">Factor $49x^2 - 36$.<br><br><em>Solution:</em> $(7x)^2 - (6)^2 = (7x - 6)(7x + 6)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4 — Perfect square</div><div class="card-body">Factor $x^2 + 14x + 49$.<br><br><em>Solution:</em> $(x + 7)^2$.</div></div>
<div class="calc-card"><div class="card-title">Problem 5 — Difference of cubes</div><div class="card-body">Factor $8x^3 - 27$.<br><br><em>Solution:</em> $(2x)^3 - (3)^3 = (2x - 3)(4x^2 + 6x + 9)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 6 — Sum of cubes</div><div class="card-body">Factor $x^6 + 64$.<br><br><em>Solution:</em> $(x^2)^3 + (4)^3 = (x^2 + 4)(x^4 - 4x^2 + 16)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 7 — Monic trinomial</div><div class="card-body">Factor $x^2 - 11x + 24$.<br><br><em>Solution:</em> Sum $-11$, product $24$: $-3, -8$. Result: $(x - 3)(x - 8)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 8 — AC method</div><div class="card-body">Factor $3x^2 - 10x + 8$.<br><br><em>Solution:</em> $ac = 24$, sum $-10$: $-4, -6$. Split: $3x^2 - 4x - 6x + 8 = x(3x - 4) - 2(3x - 4) = (3x - 4)(x - 2)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 9 — Rational root</div><div class="card-body">Factor $P(x) = x^3 - 2x^2 - 5x + 6$.<br><br><em>Solution:</em> Try $x = 1$: $1 - 2 - 5 + 6 = 0$ ✓. Divide: $P(x) = (x-1)(x^2 - x - 6) = (x-1)(x-3)(x+2)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 10 — Mixed techniques</div><div class="card-body">Factor $P(x) = x^4 - 16$.<br><br><em>Solution:</em> Difference of squares: $(x^2 - 4)(x^2 + 4)$. The first factor is again a difference of squares: $(x - 2)(x + 2)$. The second is irreducible over reals. Final: $(x - 2)(x + 2)(x^2 + 4)$.</div></div>
</div>

<div class="think-box"><div class="think-label">DECISION FLOWCHART</div><div class="think-body">When you face a new polynomial, ask in this order: (1) <strong>Is there a GCF?</strong> Pull it out. (2) <strong>How many terms?</strong> Two terms → look for difference of squares or sum/difference of cubes. Three terms → trinomial factoring (monic or AC-method). Four terms → grouping. (3) <strong>Higher degree?</strong> Rational root theorem to find one root, divide, then recurse. Always re-check whether each new factor can be factored further until every piece is irreducible.</div></div>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">WHAT YOU NOW KNOW</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Always start by pulling out the GCF — every term, every problem</li>
<li>Three special products to recognise on sight: $a^2 - b^2$, $a^2 \\pm 2ab + b^2$, $a^3 \\pm b^3$</li>
<li>Monic quadratic $x^2 + px + q$ — find two numbers with sum $p$ and product $q$</li>
<li>General quadratic $ax^2 + bx + c$ — split the middle term using product $ac$, sum $b$, then group</li>
<li>Higher degree — rational root theorem narrows candidates; remainder theorem confirms each root; synthetic division peels off factors</li>
<li>Factor completely: keep going until every remaining factor is linear or irreducible quadratic</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Çarpanlara ayırma, çarpma işleminin tersidir.</strong> Çarpma iki basit parçayı alıp tek bir karmaşık ifadeye dönüştürürse, çarpanlara ayırma o karmaşık ifadeyi alıp içine gizlenmiş basit parçaları sabırla bulup çıkarma sanatıdır. Çözeceğin her denklem, sadeleştireceğin her kesir, hesaplayacağın her integral — hemen hepsi bir noktada durup sormakla başlar: <em>bunu çarpanlarına ayırabilir miyim?</em></p>

<p class="l-text">Bu dersin sonunda altı klasik çarpanlama desenini bir bakışta tanıyabilecek, herhangi bir problemde hangi tekniği seçeceğini bilecek ve ikinci, üçüncü, dördüncü ve daha yüksek dereceli polinomları güvenle çarpanlarına ayırabileceksin. Tekniklerin kendisi mekaniktir. Asıl zor olan kısım desen tanıma — ve bu yalnızca pratikle gelir. Düzinelerce çözümlü örnek yapacağız ve on klasik alıştırmayla bitireceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELERİ ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her polinomdan ortak çarpanı (EBOB) çekme — her problemin ilk adımı</li>
<li>Dört terimli polinomları iki gruba bölerek gruplandırma yöntemini uygulama</li>
<li>Üç özel çarpımı tanıma ve kullanma: iki kare farkı, tam kare üç terimli, küp toplamı/farkı</li>
<li>Verilen toplam ve çarpıma sahip iki sayıyı bularak $x^2 + px + q$ formundaki birim katsayılı ikinci dereceleri çarpanlarına ayırma</li>
<li>$ax^2 + bx + c$ genel ikinci dereceleri "kar yıldız" (AC-yöntemi) ile çarpanlarına ayırma</li>
<li>Yüksek dereceli polinomların olası rasyonel köklerini bulmak için Rasyonel Kök Teoremi'ni uygulama</li>
<li>Kalan Teoremi'ni sentetik bölme ile birleştirerek kübik ve dördüncü dereceli polinomları tamamen çarpanlarına ayırma</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Çarpanlara Ayırma?</h2>

<div class="calc-highlight"><strong>Çarpanlara ayırma, lise düzeyindeki tek en yararlı cebirsel beceridir.</strong> O olmadan ikinci dereceden denklemleri temiz biçimde çözemez, rasyonel ifadeleri sadeleştiremez, kalkülüste 0/0 belirsizliği veren limitleri bulamaz veya karmaşık bir integrali daha kolay parçalara bölemezsin. Şimdi çarpanlamayı iyi öğren, sonraki beş yıl matematik dramatik biçimde kolaylaşacak.</div>

<p class="l-text">Temel fikir şu. $x^2 - 5x + 6 = 0$ denklemini çözmek istediğini varsay. İkinci derece formülüne sokup işlemleri yapabilirsin. Veya sol tarafın $(x-2)(x-3)$ olarak çarpanlarına ayrıldığını fark edebilirsin; o zaman denklem $(x-2)(x-3) = 0$ olur. Şimdi <strong>çarpımların sıfır olma özelliği</strong> der ki: iki sayının çarpımı, ancak en az biri sıfırsa sıfır olabilir. Dolayısıyla ya $x-2=0$ (yani $x=2$) ya da $x-3=0$ (yani $x=3$). Üç satırda bitti.</p>

<div class="calc-formula"><div class="formula-label">ÇARPIMLARIN SIFIR OLMA ÖZELLİĞİ</div><div class="formula-main">$$A \\cdot B \\;=\\; 0 \\quad\\Longleftrightarrow\\quad A = 0 \\;\\text{ veya }\\; B = 0$$</div><div class="formula-sub">Bu tek gerçek, çarpanlamayı denklem çözmek için bu kadar güçlü kılar. Yalnızca sağ taraf sıfır olduğunda işe yarar — $A \\cdot B = 12$ ifadesini $A=12, B=1$ olarak asla bölme.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Denklem çözme</div><div class="card-body">Her şeyi sıfıra eşitle, çarpanlarına ayır, sonra her çarpan üzerinde çarpımların sıfır olma özelliğini kullan.</div></div>
<div class="calc-card"><div class="card-title">Kesir sadeleştirme</div><div class="card-body">$\\dfrac{x^2-9}{x-3}$ gibi bir kesir, pay $(x-3)(x+3)$ olarak çarpanlarına ayrılınca $x+3$ olur.</div></div>
<div class="calc-card"><div class="card-title">0/0 limitlerini çözme</div><div class="card-body">Kalkülüste $\\lim_{x \\to 2}\\dfrac{x^2-4}{x-2}$ limiti çarpanlama ve sadeleştirme ile çözülür — sık karşılaşılan bir hile.</div></div>
</div>

<h2 class="lesson-title">2. Ortak Çarpan (EBOB) — Daima Önce Bunu Dene</h2>

<div class="calc-highlight"><strong>Her şeyden önce ortak bir çarpan ara.</strong> Polinomdaki her terim aynı sayıyı, aynı değişkeni veya her ikisini paylaşıyor olabilir. O ortak parçayı her terimden çek — sonuç anında daha basit bir ifade olur ve onu daha da çarpanlarına ayırabilirsin.</div>

<p class="l-text">Yöntem mekaniktir:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li><em>Her</em> katsayıyı bölen en büyük tam sayıyı bul.</li>
<li><em>Her</em> terimde geçen her değişken için, bulunan en küçük üssü al.</li>
<li>Bunları çarp — sonuç EBOB'dur.</li>
<li>Polinomu EBOB çarpı (geriye kalan) olarak yaz.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body"><strong>$5x^3 + 10x^2$</strong> ifadesini çarpanlarına ayır.<br><br>Sayılar: EBOB(5, 10) = 5.<br>Değişken: her iki terim de en az $x^2$ içeriyor (çünkü $x^3 = x \\cdot x^2$).<br>EBOB = $5x^2$.<br><br>Çekme: $5x^3 + 10x^2 = 5x^2(x + 2)$.<br><br><strong>Açarak kontrol:</strong> $5x^2 \\cdot x = 5x^3$ ve $5x^2 \\cdot 2 = 10x^2$. Toplam $5x^3 + 10x^2$. Doğru.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body"><strong>$12a^4b^2 - 18a^2b^3 + 6a^2b^2$</strong> ifadesini çarpanlarına ayır.<br><br>Sayılar: EBOB(12, 18, 6) = 6.<br>$a$ değişkeni: en düşük üs $a^2$.<br>$b$ değişkeni: en düşük üs $b^2$.<br>EBOB = $6a^2b^2$.<br><br>Sonuç: $6a^2b^2(2a^2 - 3b + 1)$. "+1" terimine dikkat — bir terim çarpanın kendisine eşitse, kalan 0 değil 1 olur.</div></div>

<div class="l-note"><strong>Sık yapılan hata:</strong> +1'i unutmak. Öğrenciler $6x^2 + 6$ ifadesini $6(x^2 + 1)$ yerine $6(x^2)$ şeklinde yazar. Her terim hesaba katılmalıdır — EBOB'u kendisine eşit bir terimden çekersen geriye kalan 1'dir.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$-3x^2 + 6x$ ifadesini çarpanlarına ayır. Baş katsayı negatifse, negatifi de dışarı çekmek genellikle daha temizdir: $-3x(x - 2)$. Bu bir tarz meselesidir, doğruluk meselesi değil — hem $-3x(x-2)$ hem de $3x(-x+2)$ geçerlidir, ama birincisi tercih edilir çünkü parantez içindeki baş katsayı pozitif kalır.</div></div>

<h2 class="lesson-title">3. Gruplandırma Yöntemi</h2>

<div class="calc-highlight"><strong>Bir polinomun dört terimi varsa ve dört terim için açık bir ortak çarpan yoksa gruplandırmayı dene.</strong> Dört terimi iki çifte böl, her çifti ayrı ayrı çarpanlarına ayır ve iki çiftin ortak bir iki terimli çarpan ortaya çıkarmasını umut et. Eğer çıkarsa, iş bitmiştir.</div>

<p class="l-text">Yöntemin üç adımı vardır:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>Dört terimi iki çifte böl (genellikle ilk ikisi ve son ikisi).</li>
<li>Her çiftten EBOB'u ayrı ayrı çek.</li>
<li>Parantez içindeki ifadeler eşitse, o ortak iki terimliyi dışarı çek.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK 3</div><div class="example-body"><strong>$x^3 + x^2 + 2x + 2$</strong> ifadesini çarpanlarına ayır.<br><br>Grupla: $(x^3 + x^2) + (2x + 2)$.<br>Her çifti çarpanlara ayır: $x^2(x + 1) + 2(x + 1)$.<br>Ortak iki terimli: $(x + 1)$.<br>Çek: $\\mathbf{(x+1)(x^2 + 2)}$.<br><br><strong>Kontrol:</strong> $(x+1)(x^2+2) = x^3 + 2x + x^2 + 2 = x^3 + x^2 + 2x + 2$. Doğru.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4</div><div class="example-body"><strong>$3xy - 6y + 5x - 10$</strong> ifadesini çarpanlarına ayır.<br><br>Grupla: $(3xy - 6y) + (5x - 10)$.<br>Her çifti çarpanlara ayır: $3y(x - 2) + 5(x - 2)$.<br>Ortak iki terimli: $(x - 2)$.<br>Sonuç: $\\mathbf{(x - 2)(3y + 5)}$.</div></div>

<div class="l-note"><strong>İki terimliler eşleşmezse,</strong> gruplandırmadan önce orijinal dört terimi başka bir sırada düzenlemeyi dene. Bazen doğal eşleştirme başarısız olduğunda birinciyi üçüncüyle, ikinciyi dördüncüyle eşleştirmek işe yarar. Hiçbir düzenleme yardımcı olmuyorsa polinom gruplandırma ile çarpanlarına ayrılamaz.</div>

<h2 class="lesson-title">4. Özel Çarpımlar: İki Kare Farkı ve Tam Kare Üç Terimli</h2>

<div class="calc-highlight"><strong>Üç özel çarpma deseni o kadar sık görünür ki, onları bir bakışta tanımak büyük miktarda işten tasarruf sağlar.</strong> Bunları şimdi ezberle — önümüzdeki beş yıl boyunca her gün kullanacaksın.</div>

<div class="calc-formula"><div class="formula-label">İKİ KARE FARKI</div><div class="formula-main">$$a^2 - b^2 \\;=\\; (a - b)(a + b)$$</div><div class="formula-sub">İki tam karenin farkı her zaman çarpanlarına ayrılır. $a^2 + b^2$ için reel sayılarda benzer bir formül yoktur — iki karenin toplamı (reel katsayılarla) çarpanlarına ayrılmaz.</div></div>

<div class="calc-formula"><div class="formula-label">TAM KARE ÜÇ TERİMLİ</div><div class="formula-main">$$a^2 + 2ab + b^2 \\;=\\; (a + b)^2 \\qquad\\qquad a^2 - 2ab + b^2 \\;=\\; (a - b)^2$$</div><div class="formula-sub">Tanıma: ilk ve son terim tam karedir, orta terim kareköklerinin çarpımının iki katıdır.</div></div>

<div class="calc-graph"><div id="plot-l50-diff-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>$a^2 - b^2 = (a-b)(a+b)$ özdeşliğinin geometrik ispatı:</strong> büyük bir $a \\times a$ kareden bir köşesinden daha küçük $b \\times b$ kare çıkarılıyor. Geriye kalan L şekli, kenarları $(a-b)$ ve $(a+b)$ olan tek bir dikdörtgene yeniden düzenlenebilir. Alanlar eşittir, bu yüzden cebirsel özdeşlik geçerlidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=4,b=1.5;
var sq1={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a×a kare',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.15)'};
var sq2={x:[a-b,a,a,a-b,a-b],y:[a-b,a-b,a,a,a-b],mode:'lines',fill:'toself',name:'b×b çıkarılan',line:{color:'#ef4444',width:2},fillcolor:'rgba(239,68,68,0.30)'};
var annoA={x:a/2,y:-0.35,xref:'x',yref:'y',text:'a',showarrow:false,font:{color:'#e8e8e8',size:14}};
var annoB={x:a-b/2,y:a-b-0.35,xref:'x',yref:'y',text:'b',showarrow:false,font:{color:'#ef4444',size:14}};
var annoArea={x:1.5,y:1.5,xref:'x',yref:'y',text:'a² − b²<br>= (a−b)(a+b)',showarrow:false,font:{color:'#f59e0b',size:13}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.6,a+0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{range:[-0.6,a+0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',showticklabels:false},margin:{t:20,r:20,b:30,l:20},showlegend:false,annotations:[annoA,annoB,annoArea]};
Plotly.newPlot('plot-l50-diff-tr',[sq1,sq2],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÖRNEK 5</div><div class="example-body"><strong>$x^2 - 25$</strong> ifadesini çarpanlarına ayır.<br><br>Her iki terim de tam karedir: $x^2 = (x)^2$ ve $25 = (5)^2$. İki kare farkı deseni, $a=x, b=5$ ile.<br>Sonuç: $\\mathbf{(x-5)(x+5)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 6</div><div class="example-body"><strong>$9x^2 - 16y^4$</strong> ifadesini çarpanlarına ayır.<br><br>Kareleri tespit et: $9x^2 = (3x)^2$, $16y^4 = (4y^2)^2$.<br>Deseni $a = 3x, b = 4y^2$ ile uygula.<br>Sonuç: $\\mathbf{(3x - 4y^2)(3x + 4y^2)}$.</div></div>

<div class="calc-graph"><div id="plot-l50-square-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>$(a+b)^2 = a^2 + 2ab + b^2$ özdeşliğinin geometrik ispatı:</strong> kenarı $a+b$ olan bir kare dört parçaya bölünüyor — bir $a \\times a$ kare, iki $a \\times b$ dikdörtgen ve bir $b \\times b$ kare. Alanların toplamı üç terimliyi verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var a=3,b=1.8;
var s1={x:[0,a,a,0,0],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'a²',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.30)'};
var s2={x:[a,a+b,a+b,a,a],y:[0,0,a,a,0],mode:'lines',fill:'toself',name:'ab',line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.25)'};
var s3={x:[0,a,a,0,0],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'ab',line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.25)',showlegend:false};
var s4={x:[a,a+b,a+b,a,a],y:[a,a,a+b,a+b,a],mode:'lines',fill:'toself',name:'b²',line:{color:'#ef4444',width:2},fillcolor:'rgba(239,68,68,0.30)'};
var t1={x:a/2,y:a/2,xref:'x',yref:'y',text:'a²',showarrow:false,font:{color:'#3b82f6',size:18}};
var t2={x:a+b/2,y:a/2,xref:'x',yref:'y',text:'ab',showarrow:false,font:{color:'#f59e0b',size:15}};
var t3={x:a/2,y:a+b/2,xref:'x',yref:'y',text:'ab',showarrow:false,font:{color:'#f59e0b',size:15}};
var t4={x:a+b/2,y:a+b/2,xref:'x',yref:'y',text:'b²',showarrow:false,font:{color:'#ef4444',size:15}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,a+b+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{range:[-0.5,a+b+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',showticklabels:false},margin:{t:20,r:20,b:30,l:20},showlegend:false,annotations:[t1,t2,t3,t4]};
Plotly.newPlot('plot-l50-square-tr',[s1,s2,s3,s4],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÖRNEK 7</div><div class="example-body"><strong>$x^2 + 10x + 25$</strong> ifadesini çarpanlarına ayır.<br><br>İlk terim: $x^2 = (x)^2$. Son terim: $25 = (5)^2$. Orta: $2 \\cdot x \\cdot 5 = 10x$. Tam kare desenine uyuyor, $a = x, b = 5$ ile.<br>Sonuç: $\\mathbf{(x + 5)^2}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 8</div><div class="example-body"><strong>$4x^2 - 12x + 9$</strong> ifadesini çarpanlarına ayır.<br><br>İlk: $4x^2 = (2x)^2$. Son: $9 = (3)^2$. Orta: $-2 \\cdot (2x) \\cdot 3 = -12x$. Uyuyor, $a = 2x, b = 3$ ve eksi işareti ile.<br>Sonuç: $\\mathbf{(2x - 3)^2}$.</div></div>

<h2 class="lesson-title">5. Küp Toplamı ve Küp Farkı</h2>

<div class="calc-highlight"><strong>Kare toplamlarının aksine, küp toplamları çarpanlarına <em>ayrılır</em>.</strong> Hem $a^3 + b^3$ hem de $a^3 - b^3$ temiz çarpanlamalara sahiptir. İşaretleri dikkatle ezberle — hemen her öğrenciyi ilk seferde tökezletirler.</div>

<div class="calc-formula"><div class="formula-label">KÜP FARKI</div><div class="formula-main">$$a^3 - b^3 \\;=\\; (a - b)(a^2 + ab + b^2)$$</div></div>

<div class="calc-formula"><div class="formula-label">KÜP TOPLAMI</div><div class="formula-main">$$a^3 + b^3 \\;=\\; (a + b)(a^2 - ab + b^2)$$</div><div class="formula-sub">Anımsatıcı <strong>"SOAP"</strong>: <em>Aynı, Karşıt, Daima Pozitif</em>. İki terimli orijinalin aynı işaretini taşır, üç terimlinin orta terimi karşıt işaret kullanır, son terim her zaman pozitiftir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9</div><div class="example-body"><strong>$x^3 - 8$</strong> ifadesini çarpanlarına ayır.<br><br>$8 = 2^3$, dolayısıyla $a = x, b = 2$. Küp farkı.<br>Sonuç: $\\mathbf{(x - 2)(x^2 + 2x + 4)}$.<br><br><strong>Kontrol:</strong> $(x-2)(x^2+2x+4) = x^3 + 2x^2 + 4x - 2x^2 - 4x - 8 = x^3 - 8$. Doğru.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 10</div><div class="example-body"><strong>$27x^3 + 125$</strong> ifadesini çarpanlarına ayır.<br><br>$27x^3 = (3x)^3$ ve $125 = 5^3$. Küp toplamı, $a = 3x, b = 5$ ile.<br>Sonuç: $\\mathbf{(3x + 5)(9x^2 - 15x + 25)}$.</div></div>

<div class="l-note"><strong>İkinci dereceli çarpan reel sayılarda indirgenmez.</strong> Örneğin $x^2 + 2x + 4$ ifadesinin diskriminantı $4 - 16 = -12 < 0$ olduğundan, gerçel katsayılarla daha fazla çarpanlarına ayrılmaz. Küp çarpanlaması bu yüzden tamamlanmış sayılır.</div>

<h2 class="lesson-title">6. Birim Katsayılı İkinci Dereceler $x^2 + px + q$</h2>

<div class="calc-highlight"><strong>Baş katsayı 1 olduğunda</strong>, $x^2 + px + q$ ifadesini çarpanlarına ayırma küçük bir bulmacaya indirgenir: <em>toplamı p ve çarpımı q olan iki sayı bul</em>. O iki sayıyı bulunca çarpanlama kendiliğinden yazılır.</div>

<div class="calc-formula"><div class="formula-label">BİRİM KATSAYILI İKİNCİ DERECE ÇARPANLAMA</div><div class="formula-main">$$x^2 + px + q \\;=\\; (x + m)(x + n) \\quad\\text{burada}\\quad m + n = p,\\; m \\cdot n = q$$</div></div>

<p class="l-text">Mantık sadece dağılma özelliğinin tersidir: $(x+m)(x+n) = x^2 + (m+n)x + mn$. Yani $x^2 + px + q$ verildiğinde ve onu $(x+m)(x+n)$ olarak yazmak istediğimizde, $m+n = p$ ve $mn = q$ olmalıdır.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 11</div><div class="example-body"><strong>$x^2 + 7x + 12$</strong> ifadesini çarpanlarına ayır.<br><br>Gerekli: toplamı 7, çarpımı 12 olan iki sayı. 3 ve 4 dene: $3+4=7$ ✓ ve $3 \\cdot 4 = 12$ ✓.<br>Sonuç: $\\mathbf{(x+3)(x+4)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 12</div><div class="example-body"><strong>$x^2 - 5x + 6$</strong> ifadesini çarpanlarına ayır.<br><br>Gerekli: toplam $-5$, çarpım $+6$. Her iki sayı negatif olmalı (pozitif çarpım, negatif toplam). $-2, -3$ dene: toplam $-5$ ✓, çarpım $6$ ✓.<br>Sonuç: $\\mathbf{(x-2)(x-3)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 13</div><div class="example-body"><strong>$x^2 + 2x - 15$</strong> ifadesini çarpanlarına ayır.<br><br>Gerekli: toplam $+2$, çarpım $-15$. Negatif çarpım, bir sayının pozitif diğerinin negatif olması demek. $+5, -3$ dene: toplam $+2$ ✓, çarpım $-15$ ✓.<br>Sonuç: $\\mathbf{(x+5)(x-3)}$.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">q'NUN İŞARETİ</div><div class="compare-item">$q > 0$: iki sayı <strong>aynı işaretli</strong></div><div class="compare-item">$q < 0$: iki sayı <strong>zıt işaretli</strong></div><div class="compare-item">Hangi işaretin baskın olduğunu belirlemek için $p$'ye bak</div></div><div class="compare-col"><div class="compare-title">p'NIN İŞARETİ (q &gt; 0 iken)</div><div class="compare-item">$p > 0$: iki sayı <strong>pozitif</strong></div><div class="compare-item">$p < 0$: iki sayı <strong>negatif</strong></div><div class="compare-item">$q < 0$ iken: büyük mutlak değerli sayı $p$'nin işaretini alır</div></div></div>

<h2 class="lesson-title">7. Genel İkinci Derece $ax^2 + bx + c$ — "Kar Yıldız" Yöntemi</h2>

<div class="calc-highlight"><strong>Baş katsayı 1 değilse</strong>, bulmaca biraz daha zordur. <em>AC-yöntemini</em> (bazen "kar yıldız" veya "orta terimi bölme" yöntemi olarak da bilinir) kullanırız.</div>

<p class="l-text">Yöntem:</p>

<ol style="line-height:1.8;color:rgba(235,230,220,0.9);padding-left:1.4rem">
<li>$a \\cdot c$ çarpımını hesapla.</li>
<li><strong>Çarpımı $a \\cdot c$</strong> ve <strong>toplamı $b$</strong> olan iki sayı bul.</li>
<li>Orta terim $bx$'i bu iki sayının çarpı $x$ formundaki toplamına böl.</li>
<li>Ortaya çıkan dört terimli polinomu gruplandırma ile çarpanlarına ayır.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK 14</div><div class="example-body"><strong>$2x^2 + 7x + 3$</strong> ifadesini çarpanlarına ayır.<br><br>$a \\cdot c = 2 \\cdot 3 = 6$. Gereken iki sayı: çarpım 6, toplam 7. 6 ve 1 dene: ✓.<br>Böl: $2x^2 + 6x + x + 3$.<br>Grupla: $(2x^2 + 6x) + (x + 3) = 2x(x + 3) + 1(x + 3) = (x+3)(2x+1)$.<br>Sonuç: $\\mathbf{(2x + 1)(x + 3)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 15</div><div class="example-body"><strong>$6x^2 - 11x - 10$</strong> ifadesini çarpanlarına ayır.<br><br>$a \\cdot c = 6 \\cdot (-10) = -60$. Gereken iki sayı: çarpım $-60$, toplam $-11$. $-15$ ve $+4$ dene: çarpım $-60$ ✓, toplam $-11$ ✓.<br>Böl: $6x^2 - 15x + 4x - 10$.<br>Grupla: $(6x^2 - 15x) + (4x - 10) = 3x(2x - 5) + 2(2x - 5) = (2x - 5)(3x + 2)$.<br>Sonuç: $\\mathbf{(2x - 5)(3x + 2)}$.</div></div>

<div class="think-box"><div class="think-label">AC-YÖNTEMİ NEDEN İŞLER</div><div class="think-body">Eğer $ax^2 + bx + c = (mx + n)(px + q)$ ise, açıldığında $ax^2 + (mq + np)x + nq$ elde edilir, dolayısıyla $a = mp$, $c = nq$ ve $b = mq + np$. Çapraz terim $mq$ ile diğer çapraz terim $np$'nin çarpımı $(mq)(np) = (mp)(nq) = ac$ olur ve toplamları $b$'dir. "Çarpım $ac$, toplam $b$" tam olarak doğru arama bu yüzdendir.</div></div>

<h2 class="lesson-title">8. Rasyonel Kök Teoremi</h2>

<div class="calc-highlight"><strong>Yüksek dereceli polinomlar için rasyonel kök teoremi aramayı dramatik biçimde daraltır.</strong> Olası her sayıyı denemek yerine, sadece küçük bir sonlu adaylar listesini kontrol etmen yeterlidir.</div>

<div class="calc-formula"><div class="formula-label">RASYONEL KÖK TEOREMİ</div><div class="formula-main">$$\\text{Eğer } P(x) = a_n x^n + \\cdots + a_1 x + a_0 \\text{ polinomu rasyonel bir köke } \\tfrac{p}{q} \\text{ (en sade halde) sahipse,}$$ $$\\text{o zaman } p \\mid a_0 \\;\\text{ ve }\\; q \\mid a_n.$$</div><div class="formula-sub">Sözel olarak: pay sabit terimi böler; payda baş katsayıyı böler. Bunları sonlu bir aday listesinde birleştir, sonra her birini test et.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 16</div><div class="example-body"><strong>$P(x) = 2x^3 - 5x^2 - 4x + 3$</strong> polinomunun rasyonel kökünü bul.<br><br>Sabit: 3. Bölenler: $\\pm 1, \\pm 3$.<br>Baş: 2. Bölenler: $\\pm 1, \\pm 2$.<br>Adaylar $p/q$: $\\pm 1, \\pm 3, \\pm \\tfrac{1}{2}, \\pm \\tfrac{3}{2}$.<br><br>$x = 3$ test et: $P(3) = 54 - 45 - 12 + 3 = 0$. ✓<br><br>Yani $x = 3$ bir köktür, bu da $(x - 3)$'ün $P(x)$'in bir çarpanı olduğu anlamına gelir. Geriye kalan ikinci dereceli çarpanı bulmak için $P(x)$'i $(x-3)$'e bölebiliriz.</div></div>

<p class="l-text">Rasyonel kök teoremi yalnızca <em>aday</em> verir. Birçok polinomun hiç rasyonel kökü yoktur — örneğin $x^2 - 2$ yalnızca $\\pm\\sqrt{2}$ irrasyonel köklerine sahiptir. Teorem rasyonel kökleri hızlı bulmaya yardımcı olur, ama varlıklarını garanti etmez.</div>

<h2 class="lesson-title">9. Yüksek Dereceli Polinomları Çarpanlarına Ayırma</h2>

<div class="calc-highlight"><strong>3., 4. veya daha yüksek dereceli polinomlar için akış: rasyonel kök teoremiyle bir kök bul, o çarpanı çıkarmak için böl, sonra daha küçük bölümde tekrarla.</strong> <em>Kalan Teoremi</em> cebiri bir arada tutar.</div>

<div class="calc-formula"><div class="formula-label">KALAN VE ÇARPAN TEOREMLERİ</div><div class="formula-main">$$P(c) = 0 \\quad\\Longleftrightarrow\\quad (x - c) \\text{ ifadesi } P(x) \\text{ polinomunun bir çarpanıdır}$$</div><div class="formula-sub">$x = c$ yerleştirmek sıfır veriyorsa, $(x - c)$ polinomu kalansız böler. Bu "$c$ bir köktür" ifadesinden "$(x-c)$ bir çarpandır" ifadesine geçişin köprüsüdür.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 17 — bir kübiğin tam çarpanlaması</div><div class="example-body"><strong>$P(x) = x^3 - 6x^2 + 11x - 6$</strong> polinomunu tamamen çarpanlarına ayır.<br><br><strong>Adım 1.</strong> Rasyonel adaylar: $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.<br>$x=1$ test et: $1 - 6 + 11 - 6 = 0$ ✓. Yani $(x-1)$ bir çarpandır.<br><br><strong>Adım 2.</strong> $P(x) \\div (x-1)$ polinom bölmesi yap:<br>$x^3 - 6x^2 + 11x - 6 = (x - 1)(x^2 - 5x + 6)$.<br><br><strong>Adım 3.</strong> İkinci dereceyi $x^2 - 5x + 6$ çarpanlarına ayır: toplam $-5$, çarpım $6$ verir $-2, -3$.<br>$x^2 - 5x + 6 = (x - 2)(x - 3)$.<br><br><strong>Nihai cevap:</strong> $\\mathbf{P(x) = (x-1)(x-2)(x-3)}$. Kökler: $1, 2, 3$.</div></div>

<div class="calc-graph"><div id="plot-l50-cubic-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Üç köküyle birlikte çizilen $P(x) = x^3 - 6x^2 + 11x - 6$ kübiği.</strong> Grafik tam olarak $x = 1, 2, 3$ noktalarında x-eksenini keser — bu sayılar $(x-1)(x-2)(x-3)$ çarpanlamasında görünenlerle aynıdır. Kökler ve çarpanlar aynı bilgiye iki farklı bakış açısıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=0.3+3.5*i/200;var y=x*x*x-6*x*x+11*x-6;xs.push(x);ys.push(y);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x) = x³−6x²+11x−6',line:{color:'#3b82f6',width:2.5}};
var roots={x:[1,2,3],y:[0,0,0],mode:'markers+text',name:'kökler',marker:{color:'#f59e0b',size:11},text:['x=1','x=2','x=3'],textposition:'top center',textfont:{color:'#f59e0b',size:12}};
var axis={x:[0,4],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0.2,3.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'P(x)',range:[-0.6,0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:20,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l50-cubic-tr',[axis,curve,roots],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Sentetik bölme</strong> $P(x)$'i $(x - c)$'ye bölmek için kompakt bir kısayoldur. $P$'nin katsayılarını bir satıra yaz, baştakini olduğu gibi indir, $c$ ile çarp, bir sonraki katsayıya ekle ve tekrar et. $c$ bir kökse son sayı 0 olmalı; gerisi bölümdür.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 18 — sentetik bölme</div><div class="example-body">$x^3 - 6x^2 + 11x - 6$ polinomunu $(x - 1)$'e sentetik bölme ile böl.<br><br>Katsayılar: $[1, -6, 11, -6]$. Deneme kökü: $c = 1$.<br><br><pre style="background:rgba(255,255,255,0.04);padding:0.8rem;border-radius:6px;color:#e8e8e8;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.6">  1 |  1   -6   11   -6
    |        1   -5    6
    |________________
       1   -5    6    0   ← kalan 0, x=1'in kök olduğunu doğrular</pre><br>Bölüm: $x^2 - 5x + 6$. Kalan: 0. Yani $P(x) = (x-1)(x^2 - 5x + 6)$.</div></div>

<h2 class="lesson-title">10. On Klasik Alıştırma</h2>

<div class="calc-highlight">Her problem yukarıdaki belirli bir tekniği hedefler. Çözümü okumadan önce her birini kendin dene. Çözümler aşağıda kompakt biçimde verilmiştir — yalnızca kendi denemenden sonra incele.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1 — EBOB</div><div class="card-body">$8x^3 + 12x^2 - 20x$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> EBOB = $4x$. Sonuç: $4x(2x^2 + 3x - 5) = 4x(2x + 5)(x - 1)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2 — Gruplama</div><div class="card-body">$2x^3 + 6x^2 + x + 3$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $(2x^3 + 6x^2) + (x + 3) = 2x^2(x+3) + 1(x+3) = (x+3)(2x^2+1)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3 — İki kare farkı</div><div class="card-body">$49x^2 - 36$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $(7x)^2 - (6)^2 = (7x - 6)(7x + 6)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4 — Tam kare</div><div class="card-body">$x^2 + 14x + 49$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $(x + 7)^2$.</div></div>
<div class="calc-card"><div class="card-title">Problem 5 — Küp farkı</div><div class="card-body">$8x^3 - 27$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $(2x)^3 - (3)^3 = (2x - 3)(4x^2 + 6x + 9)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 6 — Küp toplamı</div><div class="card-body">$x^6 + 64$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $(x^2)^3 + (4)^3 = (x^2 + 4)(x^4 - 4x^2 + 16)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 7 — Birim üç terimli</div><div class="card-body">$x^2 - 11x + 24$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> Toplam $-11$, çarpım $24$: $-3, -8$. Sonuç: $(x - 3)(x - 8)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 8 — AC yöntemi</div><div class="card-body">$3x^2 - 10x + 8$ ifadesini çarpanlarına ayır.<br><br><em>Çözüm:</em> $ac = 24$, toplam $-10$: $-4, -6$. Böl: $3x^2 - 4x - 6x + 8 = x(3x - 4) - 2(3x - 4) = (3x - 4)(x - 2)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 9 — Rasyonel kök</div><div class="card-body">$P(x) = x^3 - 2x^2 - 5x + 6$ polinomunu çarpanlarına ayır.<br><br><em>Çözüm:</em> $x = 1$ test et: $1 - 2 - 5 + 6 = 0$ ✓. Böl: $P(x) = (x-1)(x^2 - x - 6) = (x-1)(x-3)(x+2)$.</div></div>
<div class="calc-card"><div class="card-title">Problem 10 — Karma teknikler</div><div class="card-body">$P(x) = x^4 - 16$ polinomunu çarpanlarına ayır.<br><br><em>Çözüm:</em> İki kare farkı: $(x^2 - 4)(x^2 + 4)$. İlk çarpan yine bir iki kare farkı: $(x - 2)(x + 2)$. İkincisi reel sayılarda indirgenmez. Nihai: $(x - 2)(x + 2)(x^2 + 4)$.</div></div>
</div>

<div class="think-box"><div class="think-label">KARAR ŞEMASI</div><div class="think-body">Yeni bir polinomla karşılaştığında şu sırayla sor: (1) <strong>EBOB var mı?</strong> Onu çek. (2) <strong>Kaç terim var?</strong> İki terim → iki kare farkı veya küp toplamı/farkına bak. Üç terim → üç terimli çarpanlama (birim katsayılı veya AC-yöntemi). Dört terim → gruplandırma. (3) <strong>Yüksek derece mi?</strong> Rasyonel kök teoremi ile bir kök bul, böl, sonra tekrarla. Her yeni çarpanın daha fazla çarpanlarına ayrılıp ayrılamayacağını her zaman yeniden kontrol et — ta ki her parça indirgenemez olana kadar.</div></div>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">ARTIK BİLİYORSUN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her zaman EBOB'u çekerek başla — her terim, her problem</li>
<li>Bir bakışta tanınacak üç özel çarpım: $a^2 - b^2$, $a^2 \\pm 2ab + b^2$, $a^3 \\pm b^3$</li>
<li>Birim katsayılı ikinci derece $x^2 + px + q$ — toplamı $p$, çarpımı $q$ olan iki sayı bul</li>
<li>Genel ikinci derece $ax^2 + bx + c$ — çarpım $ac$, toplam $b$ kullanarak orta terimi böl, sonra grupla</li>
<li>Yüksek derece — rasyonel kök teoremi adayları daraltır; kalan teoremi her kökü doğrular; sentetik bölme çarpanları soyup çıkarır</li>
<li>Tamamen çarpanlarına ayır: geriye kalan her çarpan doğrusal veya indirgenemez ikinci dereceli olana kadar devam et</li>
</ul>
</div>`

};
