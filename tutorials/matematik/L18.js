window.LISE_MAT_L18 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>In lesson 17 you computed derivatives the long way — every single problem began with the limit definition $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$.</strong> That definition is the bedrock of differential calculus and you should never forget it. But if you had to use it on every polynomial in every exam question, you would run out of time before the bell. The pioneers of calculus realised this very early. By isolating a few patterns once and proving them once, they freed themselves to differentiate complicated expressions in seconds.</p>

<p class="l-text">This lesson collects those patterns into a small toolkit. After today you will differentiate constants, powers, sums, differences, and constant multiples on sight. You will combine them to handle any polynomial. You will extend them to negative and rational exponents, which covers $1/x$, $\\sqrt{x}$, $\\sqrt[3]{x^2}$, and friends. By the end you will look at $f(x) = 7x^5 - 4x^3 + 2x - 9$ and write $f'(x) = 35x^4 - 12x^2 + 2$ in one line.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the constant rule, the power rule, the sum/difference rules, and the constant-multiple rule</li>
<li>Prove the power rule $\\dfrac{d}{dx} x^n = n x^{n-1}$ for positive integers using the binomial theorem</li>
<li>Differentiate any polynomial directly without writing a limit</li>
<li>Apply the rules to negative exponents (so $\\frac{d}{dx}\\frac{1}{x} = -\\frac{1}{x^2}$) and to rational exponents (so $\\frac{d}{dx}\\sqrt{x} = \\frac{1}{2\\sqrt{x}}$)</li>
<li>Read $f'(x)$ off the graph of a polynomial and recognise where the slope is zero, positive, or negative</li>
<li>Solve typical AYT/YKS problems on tangent lines, critical points, and rates without invoking the limit</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Do We Need Rules?</h2>

<div class="calc-highlight"><strong>The bottleneck.</strong> The limit definition works for every differentiable function, but it is slow. Even a friendly polynomial like $f(x) = x^3$ takes half a page to differentiate from scratch: expand $(x+h)^3$, subtract $x^3$, divide by $h$, take the limit. Imagine doing that for $5x^7 - 2x^4 + x - 11$. The work is mechanical and repetitive — exactly the kind of thing that begs to be automated by a rule.</div>

<p class="l-text">Look back at the proofs you did in lesson 17. Every polynomial derivative followed the same script: open the binomial, watch the $h^0$ terms cancel, factor out $h$ from what remains, divide, send $h \\to 0$. The work was different only in detail; the structure was identical. When mathematicians see the same structure repeated, they extract a theorem. That theorem becomes a rule. You memorise the rule once, then apply it forever.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">One-shot proof</div><div class="card-body">Prove the rule once, carefully, using the limit definition. This is the hard part. We do it for each rule below.</div></div>
<div class="calc-card"><div class="card-title">Eternal use</div><div class="card-body">After the proof, every future problem with that structure is solved by applying the rule directly. Save the time, focus on harder things.</div></div>
<div class="calc-card"><div class="card-title">Combine freely</div><div class="card-body">The sum, difference, and constant-multiple rules let you decompose any polynomial into building blocks each handled by the power rule. Together they form a complete toolkit for polynomial differentiation.</div></div>
</div>

<p class="l-text"><strong>What "rule" means here.</strong> A differentiation rule is a theorem of the form "for functions of this shape, the derivative has that shape." Each rule we present comes with a proof from the limit definition. Once proved, the rule may be cited freely in any problem.</p>

<div class="think-box"><div class="think-label">A MENTAL EXPERIMENT</div><div class="think-body">If somebody asks you for $\\frac{d}{dx}(2x^4 - 3x^2 + 5)$ and you have only the limit definition, the calculation takes about four minutes if you do not slip. With the rules of this lesson, the answer is $8x^3 - 6x$, and the time to write it is the time to push the pen. That is the whole point.</div></div>

<h2 class="lesson-title">2. The Constant Rule</h2>

<div class="calc-highlight"><strong>Statement.</strong> If $f(x) = c$ is a constant function, then $f'(x) = 0$ for every $x$. Symbolically: $\\dfrac{d}{dx}(c) = 0$.</div>

<p class="l-text"><strong>Geometric meaning.</strong> A constant function has graph a horizontal line at height $c$. A horizontal line has slope zero everywhere. The derivative measures slope. So the derivative is zero. The picture and the symbol agree.</p>

<div class="calc-formula"><div class="formula-label">CONSTANT RULE</div><div class="formula-main">$$\\frac{d}{dx}(c) = 0$$</div><div class="formula-sub">For any real constant $c$, the derivative of the constant function $f(x) = c$ is the zero function.</div></div>

<p class="l-text"><strong>Proof from the limit definition.</strong> Let $f(x) = c$. Then $f(x + h) = c$ as well, because the value does not depend on the input. So</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = \\lim_{h \\to 0} \\frac{c - c}{h} = \\lim_{h \\to 0} \\frac{0}{h} = \\lim_{h \\to 0} 0 = 0.$$</div></div>

<p class="l-text">Notice the division $0 / h$ is well defined because $h \\neq 0$ during the limit (we approach zero but never reach it). The whole expression equals zero for every $h \\neq 0$, so its limit is zero. $\\blacksquare$</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $f(x) = 17$.<br><br>By the constant rule, $f'(x) = 0$. The graph of $f$ is the horizontal line $y = 17$; every tangent line is the line itself; the slope is zero everywhere.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $g(x) = -\\sqrt{2}$.<br><br>$-\\sqrt{2}$ is a real number, just an unusual-looking one. The constant rule gives $g'(x) = 0$ all the same.</div></div>

<div class="l-note"><strong>A common trap.</strong> Be careful: $\\frac{d}{dx}(c \\cdot x) = c$, not zero. The function $c \\cdot x$ depends on $x$. The constant rule applies only to functions that ignore $x$ entirely.</div>

<h2 class="lesson-title">3. The Power Rule</h2>

<div class="calc-highlight"><strong>Statement.</strong> For any real number $n$, $\\dfrac{d}{dx}(x^n) = n \\cdot x^{n-1}$. In words: bring the exponent down as a coefficient and reduce the exponent by one.</div>

<p class="l-text">This is the single most useful formula in differential calculus. Once you have it, every polynomial term collapses to one line of work. Let us prove it carefully for positive integers and then explain how it extends to negative and rational exponents.</p>

<div class="calc-formula"><div class="formula-label">POWER RULE</div><div class="formula-main">$$\\frac{d}{dx}\\left(x^n\\right) = n \\cdot x^{n-1}$$</div><div class="formula-sub">Valid for any constant real exponent $n$. Proved below for positive integer $n$; the negative and rational cases follow from rules covered in later lessons.</div></div>

<h3 class="lesson-subtitle">3a. Proof for Positive Integer $n$ via the Binomial Theorem</h3>

<p class="l-text">Recall the binomial expansion you met in lesson 9:</p>

<div class="calc-formula"><div class="formula-main">$$(x + h)^n = x^n + n x^{n-1} h + \\binom{n}{2} x^{n-2} h^2 + \\cdots + h^n.$$</div></div>

<p class="l-text">Substitute into the limit definition with $f(x) = x^n$:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}.$$</div></div>

<p class="l-text">The numerator becomes</p>

<div class="calc-formula"><div class="formula-main">$$(x+h)^n - x^n = n x^{n-1} h + \\binom{n}{2} x^{n-2} h^2 + \\cdots + h^n.$$</div></div>

<p class="l-text">Every term contains at least one factor of $h$. Divide by $h$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x+h)^n - x^n}{h} = n x^{n-1} + \\binom{n}{2} x^{n-2} h + \\cdots + h^{n-1}.$$</div></div>

<p class="l-text">Now let $h \\to 0$. Every term except the first contains a positive power of $h$ and therefore vanishes. What remains is</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = n \\cdot x^{n-1}. \\qquad \\blacksquare$$</div></div>

<h3 class="lesson-subtitle">3b. The Rule for $n = 0$</h3>

<p class="l-text">If $n = 0$ then $x^n = x^0 = 1$, a constant. The constant rule gives derivative zero. The power rule formally returns $0 \\cdot x^{-1} = 0$ as well (treating $x^{-1}$ as a finite expression for $x \\neq 0$). So the two rules agree.</p>

<h3 class="lesson-subtitle">3c. Extension to Negative Integers and Rational Exponents</h3>

<p class="l-text">The same formula $\\frac{d}{dx}(x^n) = n x^{n-1}$ continues to hold for negative integer exponents like $n = -1$ (so $\\frac{d}{dx}(1/x) = -1/x^2$) and for rational exponents like $n = 1/2$ (so $\\frac{d}{dx}(\\sqrt{x}) = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$). The proofs use additional machinery (the quotient rule for $n = -1$, implicit differentiation for $n = p/q$) that comes in later lessons. For now you may apply the power rule with any constant real $n$ — the formula always returns the right answer.</p>

<div class="calc-graph"><div id="plot-l18-power-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = x^3$ in blue and its derivative $f'(x) = 3x^2$ in orange. At each $x$, the height of the orange curve equals the slope of the blue curve. Notice $f'(x) > 0$ everywhere (except $x=0$), matching the fact that $x^3$ is monotonically increasing.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];for(var i=-200;i<=200;i++){var x=i/100;xs.push(x);f.push(x*x*x);fp.push(3*x*x);}
var t1={x:xs,y:f,mode:'lines',name:'f(x) = x^3',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3x^2",line:{color:'#f59e0b',width:3,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.2,2.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-9,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l18-power-en',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $f(x) = x^5$.<br><br>Apply the power rule with $n = 5$: $f'(x) = 5 \\cdot x^{5-1} = 5x^4$. Done in one line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $g(x) = x$.<br><br>Write $g(x) = x^1$. Apply the power rule with $n = 1$: $g'(x) = 1 \\cdot x^{0} = 1$. The function $g(x) = x$ has constant slope 1 everywhere — exactly what you would expect from a $45^\\circ$ line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $h(x) = x^{100}$.<br><br>The power rule does not care how large $n$ is: $h'(x) = 100 \\cdot x^{99}$. Try doing this with the limit definition — you would need the binomial expansion of $(x+h)^{100}$.</div></div>

<h2 class="lesson-title">4. The Constant-Multiple Rule</h2>

<div class="calc-highlight"><strong>Statement.</strong> If $c$ is a constant and $f$ is differentiable, then $\\dfrac{d}{dx}\\left(c \\cdot f(x)\\right) = c \\cdot f'(x)$. In words: a constant factor "comes out" of the derivative.</div>

<p class="l-text"><strong>Why it makes sense.</strong> Multiplying a function by a positive constant $c$ scales its graph vertically by a factor of $c$. A line of slope $m$ becomes a line of slope $cm$. The derivative tracks the slope, so it scales by the same factor.</p>

<div class="calc-formula"><div class="formula-label">CONSTANT-MULTIPLE RULE</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(c \\cdot f(x)\\bigr) = c \\cdot \\frac{d}{dx}f(x)$$</div><div class="formula-sub">For any real constant $c$ and any differentiable function $f$.</div></div>

<p class="l-text"><strong>Proof from the limit definition.</strong> Let $g(x) = c \\cdot f(x)$. Then $g(x + h) = c \\cdot f(x + h)$. Substitute into the limit:</p>

<div class="calc-formula"><div class="formula-main">$$g'(x) = \\lim_{h \\to 0} \\frac{c \\cdot f(x+h) - c \\cdot f(x)}{h} = \\lim_{h \\to 0} c \\cdot \\frac{f(x+h) - f(x)}{h}.$$</div></div>

<p class="l-text">A constant factor moves outside the limit (this is a basic limit law from lesson 14):</p>

<div class="calc-formula"><div class="formula-main">$$g'(x) = c \\cdot \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = c \\cdot f'(x). \\qquad \\blacksquare$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $f(x) = 7x^4$.<br><br>By the constant-multiple rule, $f'(x) = 7 \\cdot \\frac{d}{dx}(x^4)$. By the power rule, $\\frac{d}{dx}(x^4) = 4x^3$. So $f'(x) = 7 \\cdot 4x^3 = 28x^3$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $f(x) = -3x^2$.<br><br>$f'(x) = -3 \\cdot \\frac{d}{dx}(x^2) = -3 \\cdot 2x = -6x$.</div></div>

<div class="l-note"><strong>A useful shortcut.</strong> The combined "constant-multiple + power" pattern is so common that experienced students do it in one step: $\\frac{d}{dx}(c \\cdot x^n) = c \\cdot n \\cdot x^{n-1}$. So $\\frac{d}{dx}(7x^4) = 7 \\cdot 4 \\cdot x^3 = 28x^3$ in one line.</div>

<h2 class="lesson-title">5. The Sum and Difference Rules</h2>

<div class="calc-highlight"><strong>Statement.</strong> The derivative of a sum is the sum of derivatives, and the derivative of a difference is the difference of derivatives: $$\\frac{d}{dx}\\bigl(f(x) + g(x)\\bigr) = f'(x) + g'(x), \\qquad \\frac{d}{dx}\\bigl(f(x) - g(x)\\bigr) = f'(x) - g'(x).$$</div>

<p class="l-text"><strong>Why it makes sense.</strong> The slope of a sum of two functions at a point equals the sum of the individual slopes at that point. If you walk up two staircases stacked on top of each other, your altitude increases at a rate equal to the sum of the two staircases' steepnesses.</p>

<div class="calc-formula"><div class="formula-label">SUM RULE AND DIFFERENCE RULE</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(f \\pm g\\bigr) = f' \\pm g'$$</div><div class="formula-sub">Both $f$ and $g$ must be differentiable at the point $x$. The rule extends to any finite number of terms by induction.</div></div>

<p class="l-text"><strong>Proof of the sum rule.</strong> Let $s(x) = f(x) + g(x)$. Then</p>

<div class="calc-formula"><div class="formula-main">$$s'(x) = \\lim_{h \\to 0} \\frac{s(x+h) - s(x)}{h} = \\lim_{h \\to 0} \\frac{\\bigl[f(x+h) + g(x+h)\\bigr] - \\bigl[f(x) + g(x)\\bigr]}{h}.$$</div></div>

<p class="l-text">Group the $f$-terms and the $g$-terms:</p>

<div class="calc-formula"><div class="formula-main">$$s'(x) = \\lim_{h \\to 0} \\left[ \\frac{f(x+h) - f(x)}{h} + \\frac{g(x+h) - g(x)}{h} \\right].$$</div></div>

<p class="l-text">The limit of a sum is the sum of the limits (limit law from lesson 14, valid when both limits exist):</p>

<div class="calc-formula"><div class="formula-main">$$s'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} + \\lim_{h \\to 0} \\frac{g(x+h) - g(x)}{h} = f'(x) + g'(x). \\qquad \\blacksquare$$</div></div>

<p class="l-text">The difference rule follows by writing $f - g = f + (-1) \\cdot g$ and combining the sum rule with the constant-multiple rule (with $c = -1$).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $f(x) = x^3 + x^2$.<br><br>$f'(x) = \\frac{d}{dx}(x^3) + \\frac{d}{dx}(x^2) = 3x^2 + 2x$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate</strong> $f(x) = x^5 - x^2$.<br><br>$f'(x) = \\frac{d}{dx}(x^5) - \\frac{d}{dx}(x^2) = 5x^4 - 2x$.</div></div>

<h2 class="lesson-title">6. Putting It All Together: Polynomial Differentiation</h2>

<div class="calc-highlight"><strong>The master pattern.</strong> Every polynomial is a sum (or difference) of constant multiples of powers of $x$. To differentiate, apply the power rule to every term individually, multiply by its coefficient, and add the results.</div>

<p class="l-text">Concretely: for $f(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0$, the derivative is</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = n a_n x^{n-1} + (n-1) a_{n-1} x^{n-2} + \\cdots + a_1.$$</div></div>

<p class="l-text">Two things to notice. First, the constant term $a_0$ disappears (constant rule). Second, the derivative of a degree-$n$ polynomial is a polynomial of degree $n-1$. So the derivative is always "one degree simpler" than the original.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — split</div><div class="card-body">Write the polynomial as a sum of individual terms $c_k x^k$. Each term is handled independently.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — power rule</div><div class="card-body">For each term $c_k x^k$, multiply the coefficient by the exponent and reduce the exponent by one: $\\frac{d}{dx}(c_k x^k) = c_k k x^{k-1}$.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — combine</div><div class="card-body">Add the differentiated terms back together. The constant term drops to zero and disappears.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A FULL POLYNOMIAL</div><div class="example-body"><strong>Differentiate</strong> $f(x) = 7x^5 - 4x^3 + 2x - 9$.<br><br>Apply the power rule to each term:<br>$\\frac{d}{dx}(7x^5) = 35x^4$<br>$\\frac{d}{dx}(-4x^3) = -12x^2$<br>$\\frac{d}{dx}(2x) = 2$<br>$\\frac{d}{dx}(-9) = 0$<br><br>Add: $f'(x) = 35x^4 - 12x^2 + 2$. $\\blacksquare$</div></div>

<div class="calc-graph"><div id="plot-l18-poly-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the polynomial $f(x) = x^3 - 3x$ (blue) and its derivative $f'(x) = 3x^2 - 3$ (orange). Where the blue curve has horizontal tangents (slope zero), the orange curve crosses the $x$-axis. Where the blue curve climbs, the orange curve is positive; where the blue curve falls, the orange curve is negative. The derivative is a perfect "slope-detector."</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];for(var i=-250;i<=250;i++){var x=i/100;xs.push(x);f.push(x*x*x-3*x);fp.push(3*x*x-3);}
var t1={x:xs,y:f,mode:'lines',name:'f(x) = x^3 - 3x',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3x^2 - 3",line:{color:'#f59e0b',width:3,dash:'dash'}};
var crit={x:[-1,1],y:[0,0],mode:'markers',name:"f'(x) = 0",marker:{color:'#22c55e',size:11,symbol:'star'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-8,11],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l18-poly-en',[t1,t2,crit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Reference table.</strong> Before moving on to worked examples, take a moment to memorise the table below. Every entry follows directly from one of the rules you just proved. Re-read it after every problem in this lesson — by the end, you should be able to write any row from memory.</div>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(255,255,255,0.02);font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead><tr style="border-bottom:2px solid rgba(59,130,246,0.45);text-align:left;background:rgba(59,130,246,0.05)">
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Rule</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Function $f(x)$</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Derivative $f'(x)$</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Worked example</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Constant</td>
<td style="padding:0.55rem 0.9rem">$c$</td>
<td style="padding:0.55rem 0.9rem">$0$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(17) = 0$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Identity</td>
<td style="padding:0.55rem 0.9rem">$x$</td>
<td style="padding:0.55rem 0.9rem">$1$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x) = 1$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Power ($n \\in \\mathbb{Z}^+$)</td>
<td style="padding:0.55rem 0.9rem">$x^n$</td>
<td style="padding:0.55rem 0.9rem">$n \\cdot x^{n-1}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^5) = 5x^4$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Constant multiple</td>
<td style="padding:0.55rem 0.9rem">$c \\cdot f(x)$</td>
<td style="padding:0.55rem 0.9rem">$c \\cdot f'(x)$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(7x^4) = 28x^3$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Sum</td>
<td style="padding:0.55rem 0.9rem">$f(x) + g(x)$</td>
<td style="padding:0.55rem 0.9rem">$f'(x) + g'(x)$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^3 + x^2) = 3x^2 + 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Difference</td>
<td style="padding:0.55rem 0.9rem">$f(x) - g(x)$</td>
<td style="padding:0.55rem 0.9rem">$f'(x) - g'(x)$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^5 - x^2) = 5x^4 - 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Reciprocal</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x} = x^{-1}$</td>
<td style="padding:0.55rem 0.9rem">$-\\dfrac{1}{x^2}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(1/x) = -1/x^2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Square root</td>
<td style="padding:0.55rem 0.9rem">$\\sqrt{x} = x^{1/2}$</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{1}{2\\sqrt{x}}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(\\sqrt{x}) = \\dfrac{1}{2\\sqrt{x}}$</td>
</tr>
<tr>
<td style="padding:0.55rem 0.9rem">General power</td>
<td style="padding:0.55rem 0.9rem">$x^n$ (any real $n$)</td>
<td style="padding:0.55rem 0.9rem">$n \\cdot x^{n-1}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^{-3}) = -3x^{-4}$</td>
</tr>
</tbody>
</table>

<div class="calc-graph"><div id="plot-l18-power-extra-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three power functions $x$ (blue), $x^2$ (orange), $x^3$ (green) on top and their derivatives $1$, $2x$, $3x^2$ as dashed curves of matching colour on the bottom. Read it column by column: above each $x$-value, the height of a solid curve is the function value and the height of the dashed curve of the same colour is the slope of that function at the same $x$. The power rule $\\frac{d}{dx}x^n = n x^{n-1}$ is the single sentence behind all three pairs.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f1=[];var f2=[];var f3=[];var d1=[];var d2=[];var d3=[];for(var i=-200;i<=200;i++){var x=i/100;xs.push(x);f1.push(x);f2.push(x*x);f3.push(x*x*x);d1.push(1);d2.push(2*x);d3.push(3*x*x);}
var t1={x:xs,y:f1,mode:'lines',name:'f(x) = x',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:f2,mode:'lines',name:'f(x) = x^2',line:{color:'#f59e0b',width:3}};
var t3={x:xs,y:f3,mode:'lines',name:'f(x) = x^3',line:{color:'#22c55e',width:3}};
var d1t={x:xs,y:d1,mode:'lines',name:"f'(x) = 1",line:{color:'#3b82f6',width:2,dash:'dash'}};
var d2t={x:xs,y:d2,mode:'lines',name:"f'(x) = 2x",line:{color:'#f59e0b',width:2,dash:'dash'}};
var d3t={x:xs,y:d3,mode:'lines',name:"f'(x) = 3x^2",line:{color:'#22c55e',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.1,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-9,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l18-power-extra-en',[t1,t2,t3,d1t,d2t,d3t],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Five Worked Examples, Step by Step</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — A QUADRATIC</div><div class="example-body"><strong>Differentiate</strong> $f(x) = 3x^2 + 5x - 2$.<br><br>Term by term:<br>$\\frac{d}{dx}(3x^2) = 3 \\cdot 2 \\cdot x^{2-1} = 6x$<br>$\\frac{d}{dx}(5x) = 5$<br>$\\frac{d}{dx}(-2) = 0$<br><br>Sum: $f'(x) = 6x + 5$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — A CUBIC</div><div class="example-body"><strong>Differentiate</strong> $g(x) = 2x^3 - 4x^2 + x - 7$.<br><br>$\\frac{d}{dx}(2x^3) = 6x^2$<br>$\\frac{d}{dx}(-4x^2) = -8x$<br>$\\frac{d}{dx}(x) = 1$<br>$\\frac{d}{dx}(-7) = 0$<br><br>Sum: $g'(x) = 6x^2 - 8x + 1$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — A HIGH-DEGREE POLYNOMIAL</div><div class="example-body"><strong>Differentiate</strong> $h(x) = x^6 - 5x^4 + 3x^2 + 8$.<br><br>$\\frac{d}{dx}(x^6) = 6x^5$<br>$\\frac{d}{dx}(-5x^4) = -20x^3$<br>$\\frac{d}{dx}(3x^2) = 6x$<br>$\\frac{d}{dx}(8) = 0$<br><br>Sum: $h'(x) = 6x^5 - 20x^3 + 6x$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — MIXED COEFFICIENTS</div><div class="example-body"><strong>Differentiate</strong> $p(x) = \\frac{1}{2}x^4 - \\frac{2}{3}x^3 + \\pi x - \\sqrt{2}$.<br><br>Coefficients can be fractions, irrationals, or any constant. The rules apply unchanged:<br>$\\frac{d}{dx}\\left(\\frac{1}{2}x^4\\right) = \\frac{1}{2} \\cdot 4 x^3 = 2x^3$<br>$\\frac{d}{dx}\\left(-\\frac{2}{3}x^3\\right) = -\\frac{2}{3} \\cdot 3 x^2 = -2x^2$<br>$\\frac{d}{dx}(\\pi x) = \\pi$<br>$\\frac{d}{dx}(-\\sqrt{2}) = 0$<br><br>Sum: $p'(x) = 2x^3 - 2x^2 + \\pi$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 5 — EVALUATE AT A POINT</div><div class="example-body"><strong>Find</strong> $f'(2)$ where $f(x) = x^4 - 3x^2 + 5x - 1$.<br><br>First differentiate:<br>$f'(x) = 4x^3 - 6x + 5$.<br><br>Now substitute $x = 2$:<br>$f'(2) = 4(8) - 6(2) + 5 = 32 - 12 + 5 = 25$.<br><br>So the slope of the tangent to $y = f(x)$ at $x = 2$ equals $25$.</div></div>

<h2 class="lesson-title">8. Negative and Rational Exponents</h2>

<div class="calc-highlight"><strong>The power rule extends.</strong> The formula $\\frac{d}{dx}(x^n) = n x^{n-1}$ continues to hold when $n$ is a negative integer, a fraction, or even an arbitrary real number. The most useful instances at lise level are $n = -1$ (so $1/x$) and $n = 1/2$ (so $\\sqrt{x}$). Learn these two by heart.</div>

<p class="l-text">To use the extended power rule, rewrite the function as $x$ raised to a power, then differentiate, then (optionally) rewrite the answer in its original radical or fractional form.</p>

<div class="calc-formula"><div class="formula-label">TWO ESSENTIAL DERIVATIVES</div><div class="formula-main">$$\\frac{d}{dx}\\left(\\frac{1}{x}\\right) = -\\frac{1}{x^2}, \\qquad \\frac{d}{dx}\\bigl(\\sqrt{x}\\bigr) = \\frac{1}{2\\sqrt{x}}.$$</div><div class="formula-sub">First identity valid for $x \\neq 0$; second valid for $x > 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RECIPROCAL</div><div class="example-body"><strong>Differentiate</strong> $f(x) = \\dfrac{1}{x}$.<br><br>Rewrite: $f(x) = x^{-1}$.<br>Power rule with $n = -1$: $f'(x) = -1 \\cdot x^{-1-1} = -x^{-2}$.<br>Rewrite: $f'(x) = -\\dfrac{1}{x^2}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SQUARE ROOT</div><div class="example-body"><strong>Differentiate</strong> $f(x) = \\sqrt{x}$.<br><br>Rewrite: $f(x) = x^{1/2}$.<br>Power rule with $n = 1/2$: $f'(x) = \\dfrac{1}{2} \\cdot x^{1/2 - 1} = \\dfrac{1}{2} x^{-1/2}$.<br>Rewrite: $f'(x) = \\dfrac{1}{2\\sqrt{x}}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CUBE ROOT</div><div class="example-body"><strong>Differentiate</strong> $g(x) = \\sqrt[3]{x}$.<br><br>Rewrite: $g(x) = x^{1/3}$.<br>Power rule with $n = 1/3$: $g'(x) = \\dfrac{1}{3} x^{1/3 - 1} = \\dfrac{1}{3} x^{-2/3} = \\dfrac{1}{3 x^{2/3}} = \\dfrac{1}{3 \\sqrt[3]{x^2}}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — HIGHER NEGATIVE POWER</div><div class="example-body"><strong>Differentiate</strong> $h(x) = \\dfrac{5}{x^3}$.<br><br>Rewrite: $h(x) = 5 x^{-3}$.<br>Constant-multiple + power rule: $h'(x) = 5 \\cdot (-3) x^{-3 - 1} = -15 x^{-4} = -\\dfrac{15}{x^4}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — MIXED</div><div class="example-body"><strong>Differentiate</strong> $f(x) = 3\\sqrt{x} - \\dfrac{2}{x} + x^2$.<br><br>Rewrite each term as a power: $f(x) = 3 x^{1/2} - 2 x^{-1} + x^2$.<br>Differentiate term by term:<br>$\\frac{d}{dx}(3 x^{1/2}) = 3 \\cdot \\frac{1}{2} x^{-1/2} = \\frac{3}{2 \\sqrt{x}}$<br>$\\frac{d}{dx}(-2 x^{-1}) = -2 \\cdot (-1) x^{-2} = \\frac{2}{x^2}$<br>$\\frac{d}{dx}(x^2) = 2x$<br><br>Sum: $f'(x) = \\dfrac{3}{2 \\sqrt{x}} + \\dfrac{2}{x^2} + 2x$. $\\blacksquare$</div></div>

<div class="l-note"><strong>Procedure for radicals and rationals.</strong> Always rewrite as a power first ($\\sqrt{x} \\to x^{1/2}$, $1/x^n \\to x^{-n}$), apply the power rule, then (if you like) rewrite back. Trying to differentiate $\\sqrt{x}$ or $1/x^3$ directly without first rewriting is the most common source of mistakes.</div>

<h2 class="lesson-title">9. Classical Exercises</h2>

<p class="l-text">Try each exercise on paper before reading the solution. The aim is for the rules to become reflex.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Find</strong> $f'(x)$ for $f(x) = 4x^3 - 7x^2 + 6x - 1$.<br><br><em>Solution.</em> $f'(x) = 12x^2 - 14x + 6$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Find</strong> $g'(x)$ for $g(x) = x^7 - 5x^5 + 2$.<br><br><em>Solution.</em> $g'(x) = 7x^6 - 25x^4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Find</strong> $h'(x)$ for $h(x) = \\dfrac{3}{x^2}$.<br><br><em>Solution.</em> Rewrite as $h(x) = 3 x^{-2}$. Then $h'(x) = 3 \\cdot (-2) x^{-3} = -6 x^{-3} = -\\dfrac{6}{x^3}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Find</strong> $f'(x)$ for $f(x) = 2\\sqrt{x} + 5x$.<br><br><em>Solution.</em> $f(x) = 2 x^{1/2} + 5 x$. Differentiate: $f'(x) = 2 \\cdot \\frac{1}{2} x^{-1/2} + 5 = x^{-1/2} + 5 = \\dfrac{1}{\\sqrt{x}} + 5$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Find</strong> $f'(1)$ for $f(x) = x^4 - 2x^3 + x$.<br><br><em>Solution.</em> First $f'(x) = 4x^3 - 6x^2 + 1$. Substitute: $f'(1) = 4 - 6 + 1 = -1$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — TANGENT LINE</div><div class="example-body"><strong>Find</strong> the equation of the tangent line to $y = x^2 - 3x + 2$ at $x = 2$.<br><br><em>Solution.</em> First the point: $y(2) = 4 - 6 + 2 = 0$. So the point of tangency is $(2, 0)$.<br>Next the slope: $y'(x) = 2x - 3$, so $y'(2) = 4 - 3 = 1$.<br>Use point-slope form: $y - 0 = 1 \\cdot (x - 2)$, that is, $y = x - 2$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 — ZERO SLOPE</div><div class="example-body"><strong>For</strong> $f(x) = x^3 - 12x + 4$, find all $x$ where $f'(x) = 0$.<br><br><em>Solution.</em> $f'(x) = 3x^2 - 12$. Set $3x^2 - 12 = 0$: $x^2 = 4$, so $x = \\pm 2$. These are the only points where the tangent line is horizontal.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 — INSTANTANEOUS VELOCITY</div><div class="example-body"><strong>A particle's position is</strong> $s(t) = t^3 - 6t^2 + 9t + 2$ metres at time $t$ seconds. Find the velocity at $t = 1$ s.<br><br><em>Solution.</em> Velocity is the derivative of position: $v(t) = s'(t) = 3t^2 - 12t + 9$. At $t = 1$: $v(1) = 3 - 12 + 9 = 0$. The particle is momentarily at rest at $t = 1$ s.</div></div>

<div class="calc-highlight"><strong>What you now own.</strong> You can differentiate any polynomial in seconds. You can handle reciprocals, square roots, and cube roots by the rewrite-then-power-rule trick. You can find the slope of a tangent line at any point, the points where the slope is zero, and the instantaneous velocity of any polynomial motion. These four skills cover the majority of differentiation problems on lise mat exams and on YKS/AYT. The next lesson extends the toolkit to products and quotients.</div>

<p class="l-text"><strong>Reminders before you leave.</strong> Always rewrite radicals and reciprocals as powers of $x$ before differentiating. The derivative of a constant is zero — never write $\\frac{d}{dx}(5) = 1$. Constants stick to their term as a multiplicative factor; do not drop them when you reduce the exponent. And finally, the derivative of a sum is the sum of the derivatives, but as you will see in lesson 19, the derivative of a product is <em>not</em> the product of the derivatives. Calculus reserves a surprise for that case.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Ders 17'de türevleri uzun yoldan hesapladınız — her problem $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$ limit tanımıyla başladı.</strong> Bu tanım diferansiyel kalkülüsün temel taşıdır ve asla unutulmamalıdır. Ama sınavdaki her polinomda baştan limit kuracak olsaydınız, daha bitirmeden zil çalardı. Kalkülüsün öncüleri bunu erkenden fark etti. Birkaç deseni bir kez izole edip bir kez kanıtlayarak, karmaşık ifadeleri saniyeler içinde türevleme özgürlüğünü kendilerine kazandırdılar.</p>

<p class="l-text">Bu ders, o desenleri küçük bir alet çantasında toplar. Bugünden sonra sabitleri, kuvvetleri, toplamları, farkları ve sabit çarpanları görür görmez türeyeceksiniz. Bunları birleştirip her polinomu çözebileceksiniz. Negatif ve rasyonel üslere genişleteceksiniz; böylece $1/x$, $\\sqrt{x}$, $\\sqrt[3]{x^2}$ ve benzeri ifadeler de aynı kurala yakalanacak. Ders sonunda $f(x) = 7x^5 - 4x^3 + 2x - 9$ ifadesine bakıp $f'(x) = 35x^4 - 12x^2 + 2$ sonucunu tek satırda yazacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sabit kuralını, kuvvet kuralını, toplam/fark kurallarını ve sabit-çarpan kuralını ifade edebileceksiniz</li>
<li>Pozitif tamsayılar için kuvvet kuralı $\\dfrac{d}{dx} x^n = n x^{n-1}$ ifadesini binom teoremiyle kanıtlayacaksınız</li>
<li>Limit yazmadan herhangi bir polinomu doğrudan türeyebileceksiniz</li>
<li>Kuralları negatif üslere ($\\frac{d}{dx}\\frac{1}{x} = -\\frac{1}{x^2}$) ve rasyonel üslere ($\\frac{d}{dx}\\sqrt{x} = \\frac{1}{2\\sqrt{x}}$) uygulayabileceksiniz</li>
<li>Bir polinomun grafiği üzerinden $f'(x)$ okuyabilecek; eğimin sıfır, pozitif veya negatif olduğu noktaları tanıyabileceksiniz</li>
<li>Tipik AYT/YKS sorularını — teğet doğrusu, kritik nokta, hız problemleri — limite başvurmadan çözebileceksiniz</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Kurallara İhtiyacımız Var?</h2>

<div class="calc-highlight"><strong>Darboğaz.</strong> Limit tanımı her türevlenebilir fonksiyon için işe yarar ama yavaştır. $f(x) = x^3$ gibi dost canlısı bir polinomu bile sıfırdan türetmek yarım sayfa alır: $(x+h)^3$ açılır, $x^3$ çıkarılır, $h$'ye bölünür, limit alınır. Bunu $5x^7 - 2x^4 + x - 11$ için yapmayı hayal edin. İş mekanik ve tekrarlı — yani kurallaştırılmaya bağıran türden bir iş.</div>

<p class="l-text">Ders 17'deki kanıtlara dönüp bakın. Her polinom türevi aynı senaryoyu izledi: binomu açtık, $h^0$ terimlerinin sadeleşmesini izledik, kalanlardan $h$ ortak çarpanını çektik, böldük, $h \\to 0$ gönderdik. Detay farklıydı ama yapı aynıydı. Matematikçiler aynı yapının tekrarlandığını gördüklerinde bir teorem çıkarırlar. O teorem bir kurala dönüşür. Kuralı bir kez ezberlersiniz, sonra sonsuza kadar uygularsınız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek seferlik kanıt</div><div class="card-body">Kuralı bir kez, dikkatlice, limit tanımı kullanarak kanıtlayın. Zor kısım budur. Aşağıda her kural için yapıyoruz.</div></div>
<div class="calc-card"><div class="card-title">Sonsuz kullanım</div><div class="card-body">Kanıttan sonra, o yapıya sahip her problem doğrudan kural uygulanarak çözülür. Zaman kazanın, daha zor şeylere odaklanın.</div></div>
<div class="calc-card"><div class="card-title">Serbestçe birleştirin</div><div class="card-body">Toplam, fark ve sabit-çarpan kuralları herhangi bir polinomu, her biri kuvvet kuralıyla kolayca türevlenen yapı taşlarına ayırmanıza izin verir. Birlikte, polinom türevi için eksiksiz bir alet çantası oluştururlar.</div></div>
</div>

<p class="l-text"><strong>"Kural" ile kastedilen.</strong> Bir türev kuralı, "şu şekildeki fonksiyonların türevi bu şekildedir" formundaki bir teoremdir. Sunacağımız her kural, limit tanımından bir kanıtla gelir. Kanıtlandıktan sonra kural, herhangi bir problemde serbestçe alıntılanabilir.</p>

<div class="think-box"><div class="think-label">ZİHİNSEL BİR DENEY</div><div class="think-body">Biri sizden $\\frac{d}{dx}(2x^4 - 3x^2 + 5)$ isterse ve elinizde sadece limit tanımı varsa, kaymadan yaparsanız hesap dört dakika kadar sürer. Bu dersin kurallarıyla cevap $8x^3 - 6x$'tir ve onu yazmak için gereken süre, kalemi itme süresinden ibarettir. Olay tam olarak budur.</div></div>

<h2 class="lesson-title">2. Sabit Kuralı</h2>

<div class="calc-highlight"><strong>İfade.</strong> $f(x) = c$ bir sabit fonksiyonsa, her $x$ için $f'(x) = 0$ olur. Sembolle: $\\dfrac{d}{dx}(c) = 0$.</div>

<p class="l-text"><strong>Geometrik anlam.</strong> Sabit fonksiyonun grafiği, $c$ yüksekliğinde yatay bir doğrudur. Yatay doğrunun eğimi her yerde sıfırdır. Türev eğimi ölçer. Demek ki türev sıfırdır. Resim ve sembol birbirine uyuyor.</p>

<div class="calc-formula"><div class="formula-label">SABİT KURALI</div><div class="formula-main">$$\\frac{d}{dx}(c) = 0$$</div><div class="formula-sub">Herhangi bir reel sabit $c$ için, $f(x) = c$ sabit fonksiyonunun türevi sıfır fonksiyonudur.</div></div>

<p class="l-text"><strong>Limit tanımından kanıt.</strong> $f(x) = c$ olsun. O zaman $f(x + h) = c$ de olur, çünkü değer girdiye bağlı değildir. Limitte yerine koyalım:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = \\lim_{h \\to 0} \\frac{c - c}{h} = \\lim_{h \\to 0} \\frac{0}{h} = \\lim_{h \\to 0} 0 = 0.$$</div></div>

<p class="l-text">Dikkat: limit sırasında $h \\neq 0$ olduğundan $0/h$ bölmesi iyi tanımlıdır (sıfıra yaklaşıyoruz ama hiçbir zaman tam olarak ulaşmıyoruz). İfade $h \\neq 0$ olan her değer için sıfırdır; dolayısıyla limiti de sıfırdır. $\\blacksquare$</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = 17$.<br><br>Sabit kuralından $f'(x) = 0$. $f$'nin grafiği $y = 17$ yatay doğrusudur; her teğet doğrusu bizzat o doğrudur; eğim her yerde sıfırdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $g(x) = -\\sqrt{2}$.<br><br>$-\\sqrt{2}$ bir reel sayıdır, sadece görüntüsü biraz alışılmadıktır. Sabit kuralı yine $g'(x) = 0$ verir.</div></div>

<div class="l-note"><strong>Sık yapılan hata.</strong> Dikkatli olun: $\\frac{d}{dx}(c \\cdot x) = c$'dir, sıfır değil. $c \\cdot x$ fonksiyonu $x$'e bağlıdır. Sabit kuralı yalnızca $x$'i tamamen yok sayan fonksiyonlar için geçerlidir.</div>

<h2 class="lesson-title">3. Kuvvet Kuralı</h2>

<div class="calc-highlight"><strong>İfade.</strong> Herhangi bir reel sayı $n$ için $\\dfrac{d}{dx}(x^n) = n \\cdot x^{n-1}$. Sözcüklerle: üssü katsayı olarak öne çıkarın, üssü bir azaltın.</div>

<p class="l-text">Bu, diferansiyel kalkülüsteki en kullanışlı tek formüldür. Bir kez elde edince her polinom terimi tek satıra çöker. Pozitif tamsayılar için dikkatlice kanıtlayalım, sonra negatif ve rasyonel üslere nasıl genişlediğini açıklayalım.</p>

<div class="calc-formula"><div class="formula-label">KUVVET KURALI</div><div class="formula-main">$$\\frac{d}{dx}\\left(x^n\\right) = n \\cdot x^{n-1}$$</div><div class="formula-sub">Herhangi bir sabit reel üs $n$ için geçerlidir. Aşağıda pozitif tamsayı $n$ için kanıtlanmıştır; negatif ve rasyonel durumlar sonraki derslerdeki kurallardan çıkar.</div></div>

<h3 class="lesson-subtitle">3a. Pozitif Tamsayı $n$ için Binom Teoremi Kanıtı</h3>

<p class="l-text">Ders 9'da gördüğünüz binom açılımını hatırlayın:</p>

<div class="calc-formula"><div class="formula-main">$$(x + h)^n = x^n + n x^{n-1} h + \\binom{n}{2} x^{n-2} h^2 + \\cdots + h^n.$$</div></div>

<p class="l-text">$f(x) = x^n$ alıp limit tanımında yerine koyalım:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}.$$</div></div>

<p class="l-text">Pay şuna eşit olur:</p>

<div class="calc-formula"><div class="formula-main">$$(x+h)^n - x^n = n x^{n-1} h + \\binom{n}{2} x^{n-2} h^2 + \\cdots + h^n.$$</div></div>

<p class="l-text">Her terim en az bir $h$ çarpanı içerir. $h$'ye bölelim:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x+h)^n - x^n}{h} = n x^{n-1} + \\binom{n}{2} x^{n-2} h + \\cdots + h^{n-1}.$$</div></div>

<p class="l-text">Şimdi $h \\to 0$ alalım. İlk terim dışındaki her terim $h$'nin pozitif bir kuvvetini içerir, dolayısıyla sıfıra gider. Geride kalan:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = n \\cdot x^{n-1}. \\qquad \\blacksquare$$</div></div>

<h3 class="lesson-subtitle">3b. $n = 0$ Durumu</h3>

<p class="l-text">$n = 0$ ise $x^n = x^0 = 1$, yani sabit. Sabit kuralı türevi sıfır verir. Kuvvet kuralı da formel olarak $0 \\cdot x^{-1} = 0$ verir ($x \\neq 0$ için $x^{-1}$ sonludur). İki kural birbirini doğrular.</p>

<h3 class="lesson-subtitle">3c. Negatif Tamsayı ve Rasyonel Üslere Genişleme</h3>

<p class="l-text">Aynı $\\frac{d}{dx}(x^n) = n x^{n-1}$ formülü, $n = -1$ gibi negatif tamsayılarda (yani $\\frac{d}{dx}(1/x) = -1/x^2$) ve $n = 1/2$ gibi rasyonel üslerde (yani $\\frac{d}{dx}(\\sqrt{x}) = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$) de geçerlidir. Bunların kanıtları ek araçlara dayanır (negatif tamsayı için bölüm kuralı, $n = p/q$ için kapalı türev). Bunlar ileride gelecek. Şimdilik kuvvet kuralını herhangi bir sabit reel $n$ ile uygulayabilirsiniz — formül her zaman doğru cevabı verir.</p>

<div class="calc-graph"><div id="plot-l18-power-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $f(x) = x^3$ fonksiyonu mavi, türevi $f'(x) = 3x^2$ turuncu. Her $x$'te turuncu eğrinin yüksekliği mavi eğrinin eğimine eşittir. $f'(x) > 0$ (her yerde, $x=0$ hariç) — bu da $x^3$'ün monoton artan olmasıyla uyumlu.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];for(var i=-200;i<=200;i++){var x=i/100;xs.push(x);f.push(x*x*x);fp.push(3*x*x);}
var t1={x:xs,y:f,mode:'lines',name:'f(x) = x^3',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3x^2",line:{color:'#f59e0b',width:3,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.2,2.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-9,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l18-power-tr',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = x^5$.<br><br>$n = 5$ ile kuvvet kuralı: $f'(x) = 5 \\cdot x^{5-1} = 5x^4$. Tek satırda biter.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $g(x) = x$.<br><br>$g(x) = x^1$ yazın. $n = 1$ ile kuvvet kuralı: $g'(x) = 1 \\cdot x^{0} = 1$. $g(x) = x$ fonksiyonunun eğimi her yerde 1'dir — $45^\\circ$'lik bir doğrudan tam olarak bu beklenir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $h(x) = x^{100}$.<br><br>Kuvvet kuralı $n$ ne kadar büyük olursa olsun aynı şekilde çalışır: $h'(x) = 100 \\cdot x^{99}$. Bunu limit tanımıyla yapmayı deneyin — $(x+h)^{100}$ binom açılımına ihtiyacınız olur.</div></div>

<h2 class="lesson-title">4. Sabit-Çarpan Kuralı</h2>

<div class="calc-highlight"><strong>İfade.</strong> $c$ bir sabit ve $f$ türevlenebilirse, $\\dfrac{d}{dx}\\left(c \\cdot f(x)\\right) = c \\cdot f'(x)$. Sözcüklerle: sabit çarpan türevden "dışarı çıkar."</div>

<p class="l-text"><strong>Neden mantıklı.</strong> Bir fonksiyonu pozitif sabit $c$ ile çarpmak, grafiği dikey olarak $c$ katı ölçeklendirir. Eğimi $m$ olan bir doğru, eğimi $cm$ olan bir doğruya dönüşür. Türev eğimi izler, dolayısıyla aynı çarpanla ölçeklenir.</p>

<div class="calc-formula"><div class="formula-label">SABİT-ÇARPAN KURALI</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(c \\cdot f(x)\\bigr) = c \\cdot \\frac{d}{dx}f(x)$$</div><div class="formula-sub">Herhangi bir reel sabit $c$ ve türevlenebilir herhangi bir $f$ için.</div></div>

<p class="l-text"><strong>Limit tanımından kanıt.</strong> $g(x) = c \\cdot f(x)$ olsun. Bu durumda $g(x + h) = c \\cdot f(x + h)$. Limitte yerine koyalım:</p>

<div class="calc-formula"><div class="formula-main">$$g'(x) = \\lim_{h \\to 0} \\frac{c \\cdot f(x+h) - c \\cdot f(x)}{h} = \\lim_{h \\to 0} c \\cdot \\frac{f(x+h) - f(x)}{h}.$$</div></div>

<p class="l-text">Sabit çarpan limitin dışına çıkar (ders 14'teki temel bir limit kuralı):</p>

<div class="calc-formula"><div class="formula-main">$$g'(x) = c \\cdot \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = c \\cdot f'(x). \\qquad \\blacksquare$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = 7x^4$.<br><br>Sabit-çarpan kuralı: $f'(x) = 7 \\cdot \\frac{d}{dx}(x^4)$. Kuvvet kuralı: $\\frac{d}{dx}(x^4) = 4x^3$. Yani $f'(x) = 7 \\cdot 4x^3 = 28x^3$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = -3x^2$.<br><br>$f'(x) = -3 \\cdot \\frac{d}{dx}(x^2) = -3 \\cdot 2x = -6x$.</div></div>

<div class="l-note"><strong>Pratik bir kısayol.</strong> "Sabit-çarpan + kuvvet" kombinasyonu o kadar sık ki, deneyimli öğrenciler tek adımda yapar: $\\frac{d}{dx}(c \\cdot x^n) = c \\cdot n \\cdot x^{n-1}$. Yani $\\frac{d}{dx}(7x^4) = 7 \\cdot 4 \\cdot x^3 = 28x^3$ — tek satır.</div>

<h2 class="lesson-title">5. Toplam ve Fark Kuralları</h2>

<div class="calc-highlight"><strong>İfade.</strong> Toplamın türevi türevlerin toplamı, farkın türevi türevlerin farkıdır: $$\\frac{d}{dx}\\bigl(f(x) + g(x)\\bigr) = f'(x) + g'(x), \\qquad \\frac{d}{dx}\\bigl(f(x) - g(x)\\bigr) = f'(x) - g'(x).$$</div>

<p class="l-text"><strong>Neden mantıklı.</strong> Bir noktada iki fonksiyonun toplamının eğimi, ayrı ayrı eğimlerinin toplamına eşittir. Üst üste konmuş iki merdiveni çıkarken, yüksekliğiniz iki merdivenin diklik oranlarının toplamına eşit bir hızla artar.</p>

<div class="calc-formula"><div class="formula-label">TOPLAM KURALI VE FARK KURALI</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(f \\pm g\\bigr) = f' \\pm g'$$</div><div class="formula-sub">Hem $f$ hem $g$ noktada türevlenebilir olmalıdır. Kural tümevarımla sonlu sayıdaki terime genişler.</div></div>

<p class="l-text"><strong>Toplam kuralının kanıtı.</strong> $s(x) = f(x) + g(x)$ olsun.</p>

<div class="calc-formula"><div class="formula-main">$$s'(x) = \\lim_{h \\to 0} \\frac{s(x+h) - s(x)}{h} = \\lim_{h \\to 0} \\frac{\\bigl[f(x+h) + g(x+h)\\bigr] - \\bigl[f(x) + g(x)\\bigr]}{h}.$$</div></div>

<p class="l-text">$f$-terimlerini ve $g$-terimlerini gruplayalım:</p>

<div class="calc-formula"><div class="formula-main">$$s'(x) = \\lim_{h \\to 0} \\left[ \\frac{f(x+h) - f(x)}{h} + \\frac{g(x+h) - g(x)}{h} \\right].$$</div></div>

<p class="l-text">Toplamın limiti, limitlerin toplamıdır (ders 14'ten limit kuralı, her iki limit varken geçerli):</p>

<div class="calc-formula"><div class="formula-main">$$s'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} + \\lim_{h \\to 0} \\frac{g(x+h) - g(x)}{h} = f'(x) + g'(x). \\qquad \\blacksquare$$</div></div>

<p class="l-text">Fark kuralı, $f - g = f + (-1) \\cdot g$ yazıp toplam kuralını sabit-çarpan kuralıyla (burada $c = -1$) birleştirerek izler.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = x^3 + x^2$.<br><br>$f'(x) = \\frac{d}{dx}(x^3) + \\frac{d}{dx}(x^2) = 3x^2 + 2x$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = x^5 - x^2$.<br><br>$f'(x) = \\frac{d}{dx}(x^5) - \\frac{d}{dx}(x^2) = 5x^4 - 2x$.</div></div>

<h2 class="lesson-title">6. Hepsini Bir Araya Getirme: Polinom Türevi</h2>

<div class="calc-highlight"><strong>Ana desen.</strong> Her polinom, $x$'in kuvvetlerinin sabit çarpanlarının toplamıdır (veya farkıdır). Türevi almak için her terime ayrı ayrı kuvvet kuralı uygulayın, katsayısıyla çarpın ve sonuçları toplayın.</div>

<p class="l-text">Somut olarak: $f(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0$ için türev şudur:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = n a_n x^{n-1} + (n-1) a_{n-1} x^{n-2} + \\cdots + a_1.$$</div></div>

<p class="l-text">İki noktaya dikkat. Birincisi, sabit terim $a_0$ kaybolur (sabit kuralı). İkincisi, derece $n$ olan bir polinomun türevi, derece $n-1$ olan bir polinomdur. Türev her zaman orijinalden "bir derece daha basit"tir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — ayırın</div><div class="card-body">Polinomu tek tek $c_k x^k$ terimlerinin toplamı olarak yazın. Her terim bağımsız olarak işlenir.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — kuvvet kuralı</div><div class="card-body">Her $c_k x^k$ terimi için katsayıyı üsle çarpın ve üssü bir azaltın: $\\frac{d}{dx}(c_k x^k) = c_k k x^{k-1}$.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — birleştirin</div><div class="card-body">Türevlenmiş terimleri tekrar toplayın. Sabit terim sıfıra düşer ve kaybolur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TAM POLİNOM</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = 7x^5 - 4x^3 + 2x - 9$.<br><br>Her terime kuvvet kuralı:<br>$\\frac{d}{dx}(7x^5) = 35x^4$<br>$\\frac{d}{dx}(-4x^3) = -12x^2$<br>$\\frac{d}{dx}(2x) = 2$<br>$\\frac{d}{dx}(-9) = 0$<br><br>Topla: $f'(x) = 35x^4 - 12x^2 + 2$. $\\blacksquare$</div></div>

<div class="calc-graph"><div id="plot-l18-poly-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $f(x) = x^3 - 3x$ polinomu mavi, türevi $f'(x) = 3x^2 - 3$ turuncu. Mavi eğrinin yatay teğeti olduğu (eğim sıfır) noktalarda, turuncu eğri $x$-eksenini keser. Mavi eğri yükselirken turuncu pozitif, alçalırken turuncu negatif. Türev kusursuz bir "eğim-dedektörü"dür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];for(var i=-250;i<=250;i++){var x=i/100;xs.push(x);f.push(x*x*x-3*x);fp.push(3*x*x-3);}
var t1={x:xs,y:f,mode:'lines',name:'f(x) = x^3 - 3x',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3x^2 - 3",line:{color:'#f59e0b',width:3,dash:'dash'}};
var crit={x:[-1,1],y:[0,0],mode:'markers',name:"f'(x) = 0",marker:{color:'#22c55e',size:11,symbol:'star'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-8,11],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l18-poly-tr',[t1,t2,crit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Referans tablosu.</strong> Çözümlü örneklere geçmeden önce aşağıdaki tabloyu ezberlemek için bir dakika ayırın. Her satır, az önce kanıtladığınız kurallardan birinin doğrudan sonucudur. Bu dersteki her problemden sonra tekrar bakın — ders sonunda her satırı ezbere yazabiliyor olmalısınız.</div>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(255,255,255,0.02);font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead><tr style="border-bottom:2px solid rgba(59,130,246,0.45);text-align:left;background:rgba(59,130,246,0.05)">
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Kural</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Fonksiyon $f(x)$</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Türev $f'(x)$</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Çözümlü örnek</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Sabit</td>
<td style="padding:0.55rem 0.9rem">$c$</td>
<td style="padding:0.55rem 0.9rem">$0$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(17) = 0$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Birim</td>
<td style="padding:0.55rem 0.9rem">$x$</td>
<td style="padding:0.55rem 0.9rem">$1$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x) = 1$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Kuvvet ($n \\in \\mathbb{Z}^+$)</td>
<td style="padding:0.55rem 0.9rem">$x^n$</td>
<td style="padding:0.55rem 0.9rem">$n \\cdot x^{n-1}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^5) = 5x^4$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Sabit çarpan</td>
<td style="padding:0.55rem 0.9rem">$c \\cdot f(x)$</td>
<td style="padding:0.55rem 0.9rem">$c \\cdot f'(x)$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(7x^4) = 28x^3$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Toplam</td>
<td style="padding:0.55rem 0.9rem">$f(x) + g(x)$</td>
<td style="padding:0.55rem 0.9rem">$f'(x) + g'(x)$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^3 + x^2) = 3x^2 + 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Fark</td>
<td style="padding:0.55rem 0.9rem">$f(x) - g(x)$</td>
<td style="padding:0.55rem 0.9rem">$f'(x) - g'(x)$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^5 - x^2) = 5x^4 - 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Ters</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x} = x^{-1}$</td>
<td style="padding:0.55rem 0.9rem">$-\\dfrac{1}{x^2}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(1/x) = -1/x^2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">Karekök</td>
<td style="padding:0.55rem 0.9rem">$\\sqrt{x} = x^{1/2}$</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{1}{2\\sqrt{x}}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(\\sqrt{x}) = \\dfrac{1}{2\\sqrt{x}}$</td>
</tr>
<tr>
<td style="padding:0.55rem 0.9rem">Genel kuvvet</td>
<td style="padding:0.55rem 0.9rem">$x^n$ (her reel $n$)</td>
<td style="padding:0.55rem 0.9rem">$n \\cdot x^{n-1}$</td>
<td style="padding:0.55rem 0.9rem">$\\frac{d}{dx}(x^{-3}) = -3x^{-4}$</td>
</tr>
</tbody>
</table>

<div class="calc-graph"><div id="plot-l18-power-extra-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üstte üç kuvvet fonksiyonu $x$ (mavi), $x^2$ (turuncu), $x^3$ (yeşil); altta türevleri $1$, $2x$, $3x^2$ aynı renkte kesik çizgilerle. Her $x$ değerinin üzerinde, düz eğrinin yüksekliği fonksiyon değeridir; aynı renkteki kesik eğrinin yüksekliği ise o $x$'te eğimdir. Üç çiftin de arkasındaki tek cümle: $\\frac{d}{dx}x^n = n x^{n-1}$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f1=[];var f2=[];var f3=[];var d1=[];var d2=[];var d3=[];for(var i=-200;i<=200;i++){var x=i/100;xs.push(x);f1.push(x);f2.push(x*x);f3.push(x*x*x);d1.push(1);d2.push(2*x);d3.push(3*x*x);}
var t1={x:xs,y:f1,mode:'lines',name:'f(x) = x',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:f2,mode:'lines',name:'f(x) = x^2',line:{color:'#f59e0b',width:3}};
var t3={x:xs,y:f3,mode:'lines',name:'f(x) = x^3',line:{color:'#22c55e',width:3}};
var d1t={x:xs,y:d1,mode:'lines',name:"f'(x) = 1",line:{color:'#3b82f6',width:2,dash:'dash'}};
var d2t={x:xs,y:d2,mode:'lines',name:"f'(x) = 2x",line:{color:'#f59e0b',width:2,dash:'dash'}};
var d3t={x:xs,y:d3,mode:'lines',name:"f'(x) = 3x^2",line:{color:'#22c55e',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.1,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-9,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l18-power-extra-tr',[t1,t2,t3,d1t,d2t,d3t],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Adım Adım Beş Çözümlü Örnek</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — İKİNCİ DERECE</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = 3x^2 + 5x - 2$.<br><br>Terim terim:<br>$\\frac{d}{dx}(3x^2) = 3 \\cdot 2 \\cdot x^{2-1} = 6x$<br>$\\frac{d}{dx}(5x) = 5$<br>$\\frac{d}{dx}(-2) = 0$<br><br>Toplam: $f'(x) = 6x + 5$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — ÜÇÜNCÜ DERECE</div><div class="example-body"><strong>Türevini alın:</strong> $g(x) = 2x^3 - 4x^2 + x - 7$.<br><br>$\\frac{d}{dx}(2x^3) = 6x^2$<br>$\\frac{d}{dx}(-4x^2) = -8x$<br>$\\frac{d}{dx}(x) = 1$<br>$\\frac{d}{dx}(-7) = 0$<br><br>Toplam: $g'(x) = 6x^2 - 8x + 1$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — YÜKSEK DERECELİ POLİNOM</div><div class="example-body"><strong>Türevini alın:</strong> $h(x) = x^6 - 5x^4 + 3x^2 + 8$.<br><br>$\\frac{d}{dx}(x^6) = 6x^5$<br>$\\frac{d}{dx}(-5x^4) = -20x^3$<br>$\\frac{d}{dx}(3x^2) = 6x$<br>$\\frac{d}{dx}(8) = 0$<br><br>Toplam: $h'(x) = 6x^5 - 20x^3 + 6x$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — KARIŞIK KATSAYILAR</div><div class="example-body"><strong>Türevini alın:</strong> $p(x) = \\frac{1}{2}x^4 - \\frac{2}{3}x^3 + \\pi x - \\sqrt{2}$.<br><br>Katsayılar kesir, irrasyonel ya da herhangi bir sabit olabilir; kurallar değişmez:<br>$\\frac{d}{dx}\\left(\\frac{1}{2}x^4\\right) = \\frac{1}{2} \\cdot 4 x^3 = 2x^3$<br>$\\frac{d}{dx}\\left(-\\frac{2}{3}x^3\\right) = -\\frac{2}{3} \\cdot 3 x^2 = -2x^2$<br>$\\frac{d}{dx}(\\pi x) = \\pi$<br>$\\frac{d}{dx}(-\\sqrt{2}) = 0$<br><br>Toplam: $p'(x) = 2x^3 - 2x^2 + \\pi$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — BİR NOKTADA DEĞERLENDİRME</div><div class="example-body"><strong>Bul:</strong> $f(x) = x^4 - 3x^2 + 5x - 1$ için $f'(2)$.<br><br>Önce türevi alın:<br>$f'(x) = 4x^3 - 6x + 5$.<br><br>Şimdi $x = 2$ yerine koyun:<br>$f'(2) = 4(8) - 6(2) + 5 = 32 - 12 + 5 = 25$.<br><br>Yani $y = f(x)$ eğrisine $x = 2$'de çizilen teğet doğrusunun eğimi $25$'tir.</div></div>

<h2 class="lesson-title">8. Negatif ve Rasyonel Üsler</h2>

<div class="calc-highlight"><strong>Kuvvet kuralı genişler.</strong> $\\frac{d}{dx}(x^n) = n x^{n-1}$ formülü, $n$ negatif tamsayı, kesir veya keyfi reel sayı olduğunda da geçerlidir. Lise düzeyinde en yararlı durumlar $n = -1$ (yani $1/x$) ve $n = 1/2$ (yani $\\sqrt{x}$). Bu ikisini ezbere bilin.</div>

<p class="l-text">Genişletilmiş kuvvet kuralını kullanmak için fonksiyonu önce $x$'in bir kuvveti olarak yeniden yazın, sonra türev alın, sonra (istenirse) cevabı orijinal radikal veya kesir biçimine geri yazın.</p>

<div class="calc-formula"><div class="formula-label">İKİ TEMEL TÜREV</div><div class="formula-main">$$\\frac{d}{dx}\\left(\\frac{1}{x}\\right) = -\\frac{1}{x^2}, \\qquad \\frac{d}{dx}\\bigl(\\sqrt{x}\\bigr) = \\frac{1}{2\\sqrt{x}}.$$</div><div class="formula-sub">Birinci özdeşlik $x \\neq 0$ için, ikincisi $x > 0$ için geçerli.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TERS</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = \\dfrac{1}{x}$.<br><br>Yeniden yaz: $f(x) = x^{-1}$.<br>$n = -1$ ile kuvvet kuralı: $f'(x) = -1 \\cdot x^{-1-1} = -x^{-2}$.<br>Yeniden yaz: $f'(x) = -\\dfrac{1}{x^2}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KAREKÖK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = \\sqrt{x}$.<br><br>Yeniden yaz: $f(x) = x^{1/2}$.<br>$n = 1/2$ ile kuvvet kuralı: $f'(x) = \\dfrac{1}{2} \\cdot x^{1/2 - 1} = \\dfrac{1}{2} x^{-1/2}$.<br>Yeniden yaz: $f'(x) = \\dfrac{1}{2\\sqrt{x}}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KÜP KÖK</div><div class="example-body"><strong>Türevini alın:</strong> $g(x) = \\sqrt[3]{x}$.<br><br>Yeniden yaz: $g(x) = x^{1/3}$.<br>$n = 1/3$ ile kuvvet kuralı: $g'(x) = \\dfrac{1}{3} x^{1/3 - 1} = \\dfrac{1}{3} x^{-2/3} = \\dfrac{1}{3 x^{2/3}} = \\dfrac{1}{3 \\sqrt[3]{x^2}}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DAHA YÜKSEK NEGATİF KUVVET</div><div class="example-body"><strong>Türevini alın:</strong> $h(x) = \\dfrac{5}{x^3}$.<br><br>Yeniden yaz: $h(x) = 5 x^{-3}$.<br>Sabit-çarpan + kuvvet kuralı: $h'(x) = 5 \\cdot (-3) x^{-3 - 1} = -15 x^{-4} = -\\dfrac{15}{x^4}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KARIŞIK</div><div class="example-body"><strong>Türevini alın:</strong> $f(x) = 3\\sqrt{x} - \\dfrac{2}{x} + x^2$.<br><br>Her terimi kuvvet olarak yaz: $f(x) = 3 x^{1/2} - 2 x^{-1} + x^2$.<br>Terim terim türev:<br>$\\frac{d}{dx}(3 x^{1/2}) = 3 \\cdot \\frac{1}{2} x^{-1/2} = \\frac{3}{2 \\sqrt{x}}$<br>$\\frac{d}{dx}(-2 x^{-1}) = -2 \\cdot (-1) x^{-2} = \\frac{2}{x^2}$<br>$\\frac{d}{dx}(x^2) = 2x$<br><br>Toplam: $f'(x) = \\dfrac{3}{2 \\sqrt{x}} + \\dfrac{2}{x^2} + 2x$. $\\blacksquare$</div></div>

<div class="l-note"><strong>Köklü ve rasyonel ifadeler için yöntem.</strong> Her zaman önce kuvvet olarak yeniden yazın ($\\sqrt{x} \\to x^{1/2}$, $1/x^n \\to x^{-n}$), sonra kuvvet kuralını uygulayın, sonra (isterseniz) geri yazın. $\\sqrt{x}$ veya $1/x^3$'ü önce yeniden yazmadan doğrudan türemeye çalışmak en sık görülen hata kaynağıdır.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">Her alıştırmayı önce kağıtta deneyin, sonra çözüme bakın. Amaç kuralların refleks olmasıdır.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Bul:</strong> $f(x) = 4x^3 - 7x^2 + 6x - 1$ için $f'(x)$.<br><br><em>Çözüm.</em> $f'(x) = 12x^2 - 14x + 6$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Bul:</strong> $g(x) = x^7 - 5x^5 + 2$ için $g'(x)$.<br><br><em>Çözüm.</em> $g'(x) = 7x^6 - 25x^4$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Bul:</strong> $h(x) = \\dfrac{3}{x^2}$ için $h'(x)$.<br><br><em>Çözüm.</em> $h(x) = 3 x^{-2}$ yazın. $h'(x) = 3 \\cdot (-2) x^{-3} = -6 x^{-3} = -\\dfrac{6}{x^3}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Bul:</strong> $f(x) = 2\\sqrt{x} + 5x$ için $f'(x)$.<br><br><em>Çözüm.</em> $f(x) = 2 x^{1/2} + 5 x$. Türev: $f'(x) = 2 \\cdot \\frac{1}{2} x^{-1/2} + 5 = x^{-1/2} + 5 = \\dfrac{1}{\\sqrt{x}} + 5$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Bul:</strong> $f(x) = x^4 - 2x^3 + x$ için $f'(1)$.<br><br><em>Çözüm.</em> Önce $f'(x) = 4x^3 - 6x^2 + 1$. Yerine koy: $f'(1) = 4 - 6 + 1 = -1$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — TEĞET DOĞRUSU</div><div class="example-body"><strong>Bul:</strong> $y = x^2 - 3x + 2$ eğrisine $x = 2$'de çizilen teğet doğrusunun denklemini.<br><br><em>Çözüm.</em> Önce nokta: $y(2) = 4 - 6 + 2 = 0$. Yani değme noktası $(2, 0)$.<br>Sonra eğim: $y'(x) = 2x - 3$, dolayısıyla $y'(2) = 4 - 3 = 1$.<br>Nokta-eğim formu: $y - 0 = 1 \\cdot (x - 2)$, yani $y = x - 2$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — SIFIR EĞİM</div><div class="example-body"><strong>$f(x) = x^3 - 12x + 4$ için</strong> $f'(x) = 0$ olan tüm $x$ değerlerini bulun.<br><br><em>Çözüm.</em> $f'(x) = 3x^2 - 12$. $3x^2 - 12 = 0$ koyun: $x^2 = 4$, yani $x = \\pm 2$. Bunlar teğetin yatay olduğu tek noktalardır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 — ANLIK HIZ</div><div class="example-body"><strong>Bir parçacığın konumu</strong> $s(t) = t^3 - 6t^2 + 9t + 2$ metre, $t$ saniye cinsinden. $t = 1$ s'deki hızı bulun.<br><br><em>Çözüm.</em> Hız, konumun türevidir: $v(t) = s'(t) = 3t^2 - 12t + 9$. $t = 1$'de: $v(1) = 3 - 12 + 9 = 0$. Parçacık $t = 1$ s'de anlık olarak durmaktadır.</div></div>

<div class="calc-highlight"><strong>Artık neye sahipsiniz.</strong> Herhangi bir polinomu saniyeler içinde türeyebilirsiniz. Tersleri, karekökleri ve küp kökleri "yeniden-yaz-sonra-kuvvet-kuralı" hilesiyle çözebilirsiniz. Herhangi bir noktadaki teğet doğrusu eğimini, eğimin sıfır olduğu noktaları ve bir polinom hareketinin anlık hızını bulabilirsiniz. Bu dört beceri lise mat sınavlarında ve YKS/AYT'de görülen türev sorularının çoğunu kapsar. Bir sonraki ders alet çantasını çarpma ve bölmeye genişletir.</div>

<p class="l-text"><strong>Ayrılmadan önce hatırlatma.</strong> Köklü ifadeleri ve tersleri her zaman önce $x$'in bir kuvveti olarak yeniden yazın. Sabit türevi sıfırdır — asla $\\frac{d}{dx}(5) = 1$ yazmayın. Sabitler terimlerine çarpan olarak yapışıktır; üssü azaltırken onları düşürmeyin. Ve son olarak: toplamın türevi türevlerin toplamıdır, ama Ders 19'da göreceğiniz gibi, çarpımın türevi türevlerin çarpımı <em>değildir</em>. Kalkülüs o duruma bir sürpriz saklıyor.</p>`
};
