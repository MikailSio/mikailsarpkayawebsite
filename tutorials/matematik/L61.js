window.LISE_MAT_L61 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A rational inequality is what you get when you take a polynomial inequality and divide.</strong> Instead of comparing $P(x)$ to zero, you compare a ratio $P(x)/Q(x)$. The new ingredient is the denominator $Q(x)$, and that single new ingredient changes almost everything about how you solve. Denominators introduce holes (places where the function is not even defined), they introduce sign changes that have nothing to do with the numerator, and they make the most natural-looking algebraic move — "multiply both sides by $Q(x)$" — into a trap that flips the inequality without warning.</p>

<p class="l-text">By the end of this lesson you will have one safe procedure (bring to a single fraction, then sign chart) that handles every rational inequality you will meet on the YKS, on a university entrance test, or in a calculus class. You will know exactly when to use open versus closed circles on the number line, why you must never cross-multiply by an expression of unknown sign, and how to read the sign of a quotient directly off a graph or a sign table.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a rational inequality $P(x)/Q(x) \\;\\square\\; 0$ and state the domain restriction $Q(x) \\ne 0$</li>
<li>Understand <em>why</em> blindly cross-multiplying by $Q(x)$ is wrong, and what goes wrong concretely</li>
<li>Apply the one safe procedure: bring everything to one side, common denominator, sign chart</li>
<li>Build a sign chart that uses both numerator zeros and denominator zeros — open circles for denominator zeros, closed circles for numerator zeros (only when $\\le$ or $\\ge$)</li>
<li>Solve compound rational inequalities like $\\dfrac{1}{x - 2} > \\dfrac{1}{x + 1}$ by reducing to a single fraction</li>
<li>Spot the three classic mistakes (forgotten restriction, wrong cross-multiplication, closed circle at a denominator zero) before they cost you exam points</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Rational Inequality?</h2>

<div class="calc-highlight"><strong>A rational expression is a quotient of two polynomials</strong> $P(x)/Q(x)$. A rational <em>inequality</em> compares this quotient to zero (or to another rational expression that we will always rearrange so that it sits opposite zero). The four shapes you will meet are $P/Q > 0$, $P/Q \\ge 0$, $P/Q < 0$, $P/Q \\le 0$ — strict or non-strict, positive or negative side of zero.</div>

<div class="calc-formula"><div class="formula-label">GENERAL FORM</div><div class="formula-main">$$\\frac{P(x)}{Q(x)} \\;\\square\\; 0, \\qquad \\square \\in \\{<,\\;\\le,\\;>,\\;\\ge\\}, \\qquad Q(x) \\ne 0$$</div><div class="formula-sub">The clause $Q(x) \\ne 0$ is not optional decoration — it is part of the problem. Any candidate solution that makes the denominator zero must be thrown out at the end.</div></div>

<p class="l-text">Three small examples to fix the shape in your mind:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\dfrac{x - 1}{x + 2} > 0$</div><div class="card-body">Numerator is $x - 1$, denominator is $x + 2$. Restriction: $x \\ne -2$. We want the quotient to be strictly positive.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{x^2 - 1}{x + 3} \\ge 0$</div><div class="card-body">Numerator factors as $(x-1)(x+1)$, denominator is $x + 3$. Restriction: $x \\ne -3$. Quotient is non-negative — zero is allowed (at $x = \\pm 1$, but never at $x = -3$).</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{1}{x - 2} > \\dfrac{1}{x + 1}$</div><div class="card-body">Two rational expressions compared. The first job is to bring them to the same side and combine. Restrictions: $x \\ne 2$ and $x \\ne -1$.</div></div>
</div>

<div class="l-note"><strong>Why the restriction matters.</strong> The expression $1/(x - 2)$ has no meaning at $x = 2$ — it is "1 divided by 0," which is undefined. Even if a later algebraic manipulation makes $x = 2$ look like a solution, it is not, because the original inequality cannot even be evaluated there. State the restriction at the start and check it at the end.</div>

<h2 class="lesson-title">2. The Forbidden Move: "Just Multiply by $Q(x)$"</h2>

<div class="calc-highlight"><strong>If $Q(x)$ were a positive constant — say $7$ — multiplying both sides by $7$ would be fine: the inequality direction would not change.</strong> But $Q(x)$ is an expression in $x$, and its sign depends on $x$. Sometimes it is positive, sometimes negative. <em>Multiplying both sides of an inequality by something whose sign you do not know is mathematically illegal</em> — you simply do not know whether to keep or flip the inequality.</div>

<p class="l-text">Concrete demonstration. Take the inequality $\\dfrac{1}{x} > 0$. Anybody can see the answer by inspection: this holds exactly when $x > 0$. The solution set is $(0, +\\infty)$.</p>

<p class="l-text"><strong>Wrong attempt.</strong> "Multiply both sides by $x$ to clear the denominator," giving $1 > 0$ — which is true for every $x$. You would conclude that the inequality holds for all real $x$ except $x = 0$. That is wrong: it counts every negative number as a solution, even though plugging $x = -5$ into $1/x$ gives $-1/5$, which is clearly <em>not</em> greater than zero.</p>

<p class="l-text">The mistake is that when $x < 0$ you multiplied by a negative number and forgot to flip the inequality. The correct case analysis would have been: if $x > 0$, multiplying gives $1 > 0$, true, so all positive $x$ work; if $x < 0$, multiplying flips the inequality to $1 < 0$, false, so no negative $x$ works. Combined: $x > 0$. Correct.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WRONG (one-liner)</div><div class="compare-item">$\\dfrac{1}{x} > 0 \\;\\Longrightarrow\\; 1 > 0$ (multiply by $x$).</div><div class="compare-item">Conclusion: true for all $x \\ne 0$.</div><div class="compare-item">Reality: false for every negative $x$. The whole half-line $(-\\infty, 0)$ has been wrongly admitted.</div></div><div class="compare-col"><div class="compare-title">RIGHT (case split)</div><div class="compare-item">Case $x > 0$: multiply, keep direction. $1 > 0$ — true, all $x > 0$ work.</div><div class="compare-item">Case $x < 0$: multiply, <em>flip</em> direction. $1 < 0$ — false, no $x < 0$ works.</div><div class="compare-item">Union: $(0, +\\infty)$.</div></div></div>

<div class="l-note"><strong>The lesson:</strong> the case split is correct but tedious, and it gets worse as $Q(x)$ becomes a polynomial of degree 2 or 3 with multiple sign changes. The next section gives a procedure that avoids the split entirely — and works for every rational inequality without exception.</div>

<h2 class="lesson-title">3. The Safe Procedure — Bring to One Side, Sign Chart</h2>

<div class="calc-highlight"><strong>Step 1.</strong> Move every term to one side, so the right-hand side is $0$. <strong>Step 2.</strong> Combine into a single fraction $N(x)/D(x)$ over a common denominator. <strong>Step 3.</strong> Factor $N$ and $D$ as far as possible. <strong>Step 4.</strong> Build a sign chart on the real line using <em>all</em> the zeros of $N$ and <em>all</em> the zeros of $D$ as breakpoints. <strong>Step 5.</strong> Read off the solution intervals; handle the endpoints carefully.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why one side?</div><div class="card-body">A quotient is positive, negative, or zero. Comparing the whole quotient to $0$ is how we apply the sign chart. Comparing it to another rational expression is harder — so we subtract.</div></div>
<div class="calc-card"><div class="card-title">Why a single fraction?</div><div class="card-body">A single quotient $N(x)/D(x)$ has a sign that is fully determined by the signs of $N$ and $D$. Two separate fractions added together have no clean rule for combining signs.</div></div>
<div class="calc-card"><div class="card-title">Why factor?</div><div class="card-body">A factored polynomial changes sign exactly at its zeros, and each linear factor $(x - r)$ flips sign once at $r$. That is what makes the sign chart trivial.</div></div>
<div class="calc-card"><div class="card-title">Why include denominator zeros?</div><div class="card-body">Even though the function is <em>undefined</em> at a denominator zero, its sign changes across that point exactly like a numerator zero. We mark the column but with an open circle — never a candidate solution.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SIGN OF A QUOTIENT</div><div class="formula-main">$$\\text{sign}\\!\\left(\\frac{N(x)}{D(x)}\\right) \\;=\\; \\text{sign}(N(x)) \\,\\cdot\\, \\text{sign}(D(x))$$</div><div class="formula-sub">A positive divided by a positive is positive. Positive over negative is negative. Negative over negative is positive. Negative over positive is negative. Just like a product.</div></div>

<h2 class="lesson-title">4. Worked Example 1 — $(x - 1)/(x + 2) > 0$</h2>

<div class="calc-highlight">A textbook starter. Numerator $x - 1$ has a zero at $x = 1$. Denominator $x + 2$ has a zero at $x = -2$ — and this is the restriction: $x \\ne -2$.</div>

<p class="l-text"><strong>Sign chart.</strong> Mark $-2$ and $1$ on the number line. They divide the real line into three intervals: $(-\\infty, -2)$, $(-2, 1)$, $(1, +\\infty)$. In each interval pick any test point and read off the sign of $x - 1$, $x + 2$, and the quotient.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Interval</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 2$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">quotient</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, -2)$</td><td style="padding:0.5rem 0.8rem">$-5$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-2, 1)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(1, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$5$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Read off.</strong> We want the quotient to be strictly positive. The plus columns are $(-\\infty, -2)$ and $(1, +\\infty)$. Endpoints: $x = 1$ would make the quotient zero (excluded by the strict inequality), $x = -2$ is excluded by the domain. Both endpoints get open circles.</p>

<div class="calc-formula"><div class="formula-label">SOLUTION SET</div><div class="formula-main">$$\\boxed{\\;(-\\infty, -2) \\;\\cup\\; (1, +\\infty)\\;}$$</div></div>

<div class="calc-graph"><div id="plot-l61-ex1-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $y = (x - 1)/(x + 2)$ with a vertical asymptote at $x = -2$ (dashed orange) and a zero at $x = 1$. The shaded blue regions are where $y > 0$ — exactly the solution intervals $(-\\infty, -2)$ and $(1, +\\infty)$. Where the curve dips below the x-axis, the inequality fails.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return (x-1)/(x+2);}
var x1=[];var y1=[];for(var i=0;i<=140;i++){var v=-7+5*i/140;if(v>-2.02)break;x1.push(v);y1.push(f(v));}
var x2=[];var y2=[];for(var i=0;i<=240;i++){var v=-1.98+9*i/240;x2.push(v);y2.push(f(v));}
var leftBranch={x:x1,y:y1,mode:'lines',name:'y = (x−1)/(x+2)',line:{color:'#3b82f6',width:3}};
var rightBranch={x:x2,y:y2,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var asym={x:[-2,-2],y:[-8,8],mode:'lines',name:'x = −2 (asymptote)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var zero={x:[1],y:[0],mode:'markers',name:'zero at x = 1',marker:{color:'#22c55e',size:12}};
var shadeL=[];var shadeY=[];for(var i=0;i<=80;i++){var v=-7+5*i/80;if(v>-2.05)break;shadeL.push(v);shadeY.push(f(v));}
var shadeR=[];var shadeRY=[];for(var i=0;i<=180;i++){var v=1+6*i/180;shadeR.push(v);shadeRY.push(f(v));}
var solRegL={x:shadeL.concat(shadeL.slice().reverse()),y:shadeY.concat(shadeL.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},name:'y > 0',hoverinfo:'skip'};
var solRegR={x:shadeR.concat(shadeR.slice().reverse()),y:shadeRY.concat(shadeR.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l61-ex1-en',[solRegL,solRegR,leftBranch,rightBranch,asym,zero],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SANITY CHECK</div><div class="think-body">Test a point in each candidate interval. $x = -3$: $(-3-1)/(-3+2) = -4/-1 = 4 > 0$. Good. $x = 0$: $(0-1)/(0+2) = -1/2 < 0$. Excluded — also good. $x = 3$: $(3-1)/(3+2) = 2/5 > 0$. Good. Three test points, three confirmations.</div></div>

<h2 class="lesson-title">5. Worked Example 2 — $(x - 3)/(x - 1) \\le 0$ (Endpoint Care)</h2>

<div class="calc-highlight">Same procedure, but the inequality is non-strict ($\\le$), so the numerator zero $x = 3$ is <em>included</em> as a solution (it makes the quotient exactly zero). The denominator zero $x = 1$ remains excluded by the domain — non-strict or not, you cannot divide by zero.</div>

<p class="l-text">Numerator zero: $x = 3$. Denominator zero: $x = 1$. Domain restriction: $x \\ne 1$. Sign chart breakpoints: $1$ and $3$.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Interval</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 3$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">quotient</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, 1)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(1, 3)$</td><td style="padding:0.5rem 0.8rem">$2$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(3, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$4$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Read off.</strong> Inequality is $\\le 0$, so we want the minus column (negative) plus the spots where the quotient is exactly zero. Negative column: $(1, 3)$. Quotient is zero at $x = 3$ — include it. Quotient is undefined at $x = 1$ — exclude it.</p>

<div class="calc-formula"><div class="formula-label">SOLUTION SET</div><div class="formula-main">$$\\boxed{\\;(1, \\, 3]\\;}$$</div><div class="formula-sub">Open at $1$ (denominator zero, excluded even though the inequality is non-strict), closed at $3$ (numerator zero, included because $\\le$ permits equality).</div></div>

<div class="l-note"><strong>The endpoint rule.</strong> When the inequality is non-strict ($\\le$ or $\\ge$), <em>numerator zeros are included</em> in the solution set (the quotient is exactly zero there). <em>Denominator zeros are always excluded</em> — the inequality cannot even be evaluated at those points. Strict ($<$ or $>$) excludes both kinds of zero.</div>

<h2 class="lesson-title">6. Worked Example 3 — $(x^2 - 1)/(x + 3) \\ge 0$</h2>

<div class="calc-highlight">Numerator factors as $x^2 - 1 = (x - 1)(x + 1)$. Three numerator zeros now? No — two: $x = 1$ and $x = -1$. Denominator zero: $x = -3$. Domain restriction: $x \\ne -3$.</div>

<p class="l-text">Sign chart breakpoints: $-3, -1, 1$. Four intervals.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Interval</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 3$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">quotient</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, -3)$</td><td style="padding:0.5rem 0.8rem">$-4$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-3, -1)$</td><td style="padding:0.5rem 0.8rem">$-2$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-1, 1)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(1, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$2$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Read off.</strong> Want $\\ge 0$: take the plus intervals plus the spots where the quotient is exactly zero. Plus intervals: $(-3, -1)$ and $(1, +\\infty)$. Quotient is zero at $x = -1$ and $x = 1$ — include both. Quotient is undefined at $x = -3$ — exclude.</p>

<div class="calc-formula"><div class="formula-label">SOLUTION SET</div><div class="formula-main">$$\\boxed{\\;(-3, \\, -1] \\;\\cup\\; [1, \\, +\\infty)\\;}$$</div></div>

<div class="calc-graph"><div id="plot-l61-ex3-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $y = (x^2 - 1)/(x + 3)$. Vertical asymptote at $x = -3$, zeros at $x = \\pm 1$. The shaded blue regions are where $y \\ge 0$ — exactly the solution intervals $(-3, -1]$ and $[1, +\\infty)$. Closed dots at $\\pm 1$, open circle at $-3$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return (x*x-1)/(x+3);}
var x1=[];var y1=[];for(var i=0;i<=140;i++){var v=-9+6*i/140;if(v>-3.02)break;x1.push(v);y1.push(f(v));}
var x2=[];var y2=[];for(var i=0;i<=240;i++){var v=-2.98+10*i/240;x2.push(v);y2.push(f(v));}
var leftBranch={x:x1,y:y1,mode:'lines',name:'y = (x²−1)/(x+3)',line:{color:'#3b82f6',width:3}};
var rightBranch={x:x2,y:y2,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var asym={x:[-3,-3],y:[-12,12],mode:'lines',name:'x = −3 (asymptote)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var zeros={x:[-1,1],y:[0,0],mode:'markers',name:'zeros at x = ±1',marker:{color:'#22c55e',size:12}};
var shA=[];var shAY=[];for(var i=0;i<=120;i++){var v=-2.99+2*i/120;shA.push(v);shAY.push(f(v));}
var shB=[];var shBY=[];for(var i=0;i<=180;i++){var v=1+6*i/180;shB.push(v);shBY.push(f(v));}
var regA={x:shA.concat(shA.slice().reverse()),y:shAY.concat(shA.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},name:'y ≥ 0',hoverinfo:'skip'};
var regB={x:shB.concat(shB.slice().reverse()),y:shBY.concat(shB.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-9,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-10,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l61-ex3-en',[regA,regB,leftBranch,rightBranch,asym,zeros],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Worked Example 4 — $\\dfrac{1}{x - 2} > \\dfrac{1}{x + 1}$</h2>

<div class="calc-highlight">Two rational expressions on opposite sides of the inequality. The procedure is unchanged: subtract one from the other, combine over a common denominator, and apply the sign chart to the resulting single quotient.</div>

<p class="l-text"><strong>Step 1 — bring to one side.</strong> Subtract the right side:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{1}{x - 2} \\;-\\; \\frac{1}{x + 1} \\;>\\; 0$$</div></div>

<p class="l-text"><strong>Step 2 — common denominator.</strong> Multiply the first fraction top and bottom by $(x + 1)$ and the second by $(x - 2)$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x + 1) \\,-\\, (x - 2)}{(x - 2)(x + 1)} \\;>\\; 0 \\;\\;\\Longleftrightarrow\\;\\; \\frac{3}{(x - 2)(x + 1)} \\;>\\; 0$$</div><div class="formula-sub">The numerator collapsed to the constant $3$ — a happy accident here.</div></div>

<p class="l-text"><strong>Step 3 — sign analysis.</strong> The numerator $3$ is positive everywhere. So the quotient is positive whenever the denominator is positive. Denominator $(x - 2)(x + 1)$ is a product of two linear factors with zeros at $x = 2$ and $x = -1$. Domain restriction: $x \\ne 2$ and $x \\ne -1$.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Interval</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 2$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">denominator</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">quotient</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, -1)$</td><td style="padding:0.5rem 0.8rem">$-2$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-1, 2)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(2, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$3$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<div class="calc-formula"><div class="formula-label">SOLUTION SET</div><div class="formula-main">$$\\boxed{\\;(-\\infty, -1) \\;\\cup\\; (2, +\\infty)\\;}$$</div><div class="formula-sub">Both endpoints open: strict inequality and denominator zeros.</div></div>

<div class="calc-graph"><div id="plot-l61-ex4-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two curves $y = 1/(x - 2)$ (blue) and $y = 1/(x + 1)$ (red) on the same axes. The inequality $1/(x-2) > 1/(x+1)$ asks where blue lies above red. The two halves of the answer — $(-\\infty, -1)$ and $(2, +\\infty)$ — correspond to the two regions where the blue curve sits higher.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f1(x){return 1/(x-2);}
function f2(x){return 1/(x+1);}
var aX=[];var aY=[];for(var i=0;i<=180;i++){var v=-7+5*i/180;if(v>-1.02)break;aX.push(v);aY.push(f1(v));}
var bX=[];var bY=[];for(var i=0;i<=180;i++){var v=-0.98+2.96*i/180;if(v>1.98)break;bX.push(v);bY.push(f1(v));}
var cX=[];var cY=[];for(var i=0;i<=240;i++){var v=2.02+5*i/240;cX.push(v);cY.push(f1(v));}
var f1a={x:aX,y:aY,mode:'lines',name:'y = 1/(x−2)',line:{color:'#3b82f6',width:3}};
var f1b={x:bX,y:bY,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var f1c={x:cX,y:cY,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var dX=[];var dY=[];for(var i=0;i<=180;i++){var v=-7+6*i/180;if(v>-1.02)break;dX.push(v);dY.push(f2(v));}
var eX=[];var eY=[];for(var i=0;i<=240;i++){var v=-0.98+8*i/240;eX.push(v);eY.push(f2(v));}
var f2a={x:dX,y:dY,mode:'lines',name:'y = 1/(x+1)',line:{color:'#ef4444',width:3}};
var f2b={x:eX,y:eY,mode:'lines',name:'',line:{color:'#ef4444',width:3},showlegend:false};
var asy1={x:[2,2],y:[-6,6],mode:'lines',name:'x = 2',line:{color:'rgba(59,130,246,0.45)',width:1.5,dash:'dash'},showlegend:false};
var asy2={x:[-1,-1],y:[-6,6],mode:'lines',name:'x = −1',line:{color:'rgba(239,68,68,0.45)',width:1.5,dash:'dash'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l61-ex4-en',[asy1,asy2,f1a,f1b,f1c,f2a,f2b],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SANITY CHECK</div><div class="think-body">Pick $x = -5$ (in the first candidate interval). $1/(-5 - 2) = -1/7 \\approx -0.143$. $1/(-5 + 1) = -1/4 = -0.25$. Is $-0.143 > -0.25$? Yes — the less-negative number is greater. So $x = -5$ satisfies the inequality. Pick $x = 0$ (in the rejected middle interval). $1/(0 - 2) = -0.5$. $1/(0 + 1) = 1$. Is $-0.5 > 1$? No. Correctly excluded.</div></div>

<h2 class="lesson-title">8. Domain Restrictions — A Permanent Reminder</h2>

<div class="calc-highlight">A rational function is <em>not defined</em> where its denominator vanishes. The inequality you wrote down silently inherits that domain restriction. <em>You must state it in your working and check it against your final candidate set.</em> A candidate that lands exactly on a denominator zero is rejected, no matter what the algebra says.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Write it out</div><div class="card-body">Beginning of every problem: "Domain: $x \\ne$ (list of denominator zeros)." Three seconds of pen work prevents losing the whole question.</div></div>
<div class="calc-card"><div class="card-title">Open circle, always</div><div class="card-body">On the number line, every denominator zero gets an open circle (a hollow dot). Strict or non-strict makes no difference for denominator zeros.</div></div>
<div class="calc-card"><div class="card-title">Numerator zero: depends on the symbol</div><div class="card-body">If the inequality is $\\le$ or $\\ge$, numerator zeros are <em>included</em> (filled dot). If it is $<$ or $>$, they are <em>excluded</em> (open dot).</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ENDPOINT TABLE</div><div class="formula-main">$$\\begin{array}{l|c|c} \\text{Zero of } & \\text{strict } (<, >) & \\text{non-strict } (\\le, \\ge) \\\\ \\hline \\text{Numerator } N & \\text{excluded (open)} & \\text{included (closed)} \\\\ \\text{Denominator } D & \\text{excluded (open)} & \\text{excluded (open)} \\end{array}$$</div><div class="formula-sub">Memorise this little table. It decides every endpoint question in every rational inequality.</div></div>

<h2 class="lesson-title">9. The Three Classic Mistakes</h2>

<div class="calc-highlight"><strong>Mistake A:</strong> cross-multiplying by $Q(x)$ without case analysis (covered in section 2). <strong>Mistake B:</strong> forgetting denominator zeros as breakpoints in the sign chart. <strong>Mistake C:</strong> drawing a closed circle at a denominator zero just because the inequality is non-strict.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MISTAKE B — IN ACTION</div><div class="compare-item">Problem: $\\dfrac{x - 1}{x + 2} > 0$.</div><div class="compare-item">A student writes "$x - 1 > 0$ means $x > 1$" and stops. Reads off the answer as $(1, +\\infty)$.</div><div class="compare-item">The wrong answer misses the entire interval $(-\\infty, -2)$ where both numerator and denominator are negative and so the quotient is positive.</div><div class="compare-item">Fix: always include denominator zeros in the sign chart.</div></div><div class="compare-col"><div class="compare-title">MISTAKE C — IN ACTION</div><div class="compare-item">Problem: $\\dfrac{x - 3}{x - 1} \\le 0$.</div><div class="compare-item">A student writes "$\\le$ means we include the boundary, so $[1, 3]$."</div><div class="compare-item">Wrong: $x = 1$ makes the denominator zero, so the quotient is undefined there — never a solution.</div><div class="compare-item">Fix: numerator zero $\\Rightarrow$ filled dot (if $\\le/\\ge$). Denominator zero $\\Rightarrow$ open dot, always.</div></div></div>

<div class="l-note"><strong>One more subtle error.</strong> If a problem reads $1/(x - 2) > 1/(x + 1)$ and you "cross-multiply by $(x - 2)(x + 1)$," you have multiplied by a product whose sign depends on $x$ in <em>two</em> independent ways. The case analysis explodes to four sub-cases. The safe procedure of section 3 reduces to one calculation and one sign chart. Use it.</div>

<h2 class="lesson-title">10. Practice Exercises</h2>

<div class="calc-highlight">Eight problems to drill the procedure. Try each one before reading the solution. Endpoint care matters in every one of them.</div>

<div class="calc-example"><div class="example-label">EXERCISE 1 — straightforward</div><div class="example-body">Solve $\\dfrac{x + 4}{x - 2} > 0$.<br><br><em>Solution:</em> numerator zero $x = -4$, denominator zero $x = 2$. Three intervals. Test points $-5, 0, 3$ give signs $(+), (-), (+)$. Strict inequality, both endpoints open. Answer: $\\mathbf{(-\\infty, -4) \\cup (2, +\\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — non-strict, with numerator inclusion</div><div class="example-body">Solve $\\dfrac{2x - 6}{x + 5} \\le 0$.<br><br><em>Solution:</em> $2x - 6 = 0 \\Rightarrow x = 3$. $x + 5 = 0 \\Rightarrow x = -5$. Test points $-6, 0, 4$ give signs $(+), (-), (+)$. Want $\\le 0$: take the minus interval, include $x = 3$ (numerator zero, $\\le$ permits), exclude $x = -5$ (denominator). Answer: $\\mathbf{(-5, 3]}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — square in the numerator</div><div class="example-body">Solve $\\dfrac{(x - 1)^2}{x + 2} \\le 0$.<br><br><em>Solution:</em> $(x - 1)^2 \\ge 0$ always, so the quotient's sign equals the sign of $1/(x + 2)$, except at $x = 1$ where the quotient is exactly $0$. Denominator zero $x = -2$. Quotient is $\\le 0$ when either it is zero (so $x = 1$) or negative (when $x + 2 < 0$, i.e. $x < -2$). Answer: $\\mathbf{(-\\infty, -2) \\cup \\{1\\}}$. A typical exam trap — the isolated point $\\{1\\}$ is easy to miss.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — quadratic numerator</div><div class="example-body">Solve $\\dfrac{x^2 - 4}{x - 1} \\ge 0$.<br><br><em>Solution:</em> factor numerator: $(x - 2)(x + 2)$. Breakpoints $-2, 1, 2$. Test $-3, 0, 1.5, 3$. Signs of quotient: $(-, +, -, +)$. Want $\\ge 0$: take plus intervals plus numerator zeros. Include $x = \\pm 2$, exclude $x = 1$. Answer: $\\mathbf{[-2, 1) \\cup [2, +\\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — two-rational comparison</div><div class="example-body">Solve $\\dfrac{2}{x + 3} \\ge \\dfrac{1}{x - 1}$.<br><br><em>Solution:</em> bring to one side: $\\dfrac{2}{x + 3} - \\dfrac{1}{x - 1} \\ge 0$. Common denominator: $\\dfrac{2(x - 1) - (x + 3)}{(x + 3)(x - 1)} = \\dfrac{x - 5}{(x + 3)(x - 1)} \\ge 0$. Breakpoints: $-3, 1, 5$. Restrictions: $x \\ne -3, x \\ne 1$. Test $-4, 0, 2, 6$: signs $(-, +, -, +)$. Want $\\ge 0$: take $(-3, 1) \\cup [5, +\\infty)$. Numerator zero $5$ included, denominator zeros excluded. Answer: $\\mathbf{(-3, 1) \\cup [5, +\\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — concentration word problem</div><div class="example-body">A chemist has $100$ grams of pure salt dissolved in water. Adding $x$ litres of pure water dilutes the solution. The concentration (grams per litre) after adding $x$ litres is $C(x) = 100/(x + 5)$, where the original solution already contains $5$ litres. For what values of $x \\ge 0$ is the concentration <em>at least</em> $15$ g/L? <br><br><em>Setup:</em> $\\dfrac{100}{x + 5} \\ge 15$.<br><em>Move to one side:</em> $\\dfrac{100}{x + 5} - 15 \\ge 0 \\;\\Rightarrow\\; \\dfrac{100 - 15(x + 5)}{x + 5} \\ge 0 \\;\\Rightarrow\\; \\dfrac{25 - 15x}{x + 5} \\ge 0$. Numerator zero: $x = 25/15 = 5/3$. Denominator zero $x = -5$ — outside the physical domain $x \\ge 0$.<br><em>On $[0, +\\infty)$:</em> denominator $x + 5$ is always positive. So the sign of the quotient equals the sign of $25 - 15x$. That is $\\ge 0$ when $x \\le 5/3$.<br><em>Answer:</em> $\\mathbf{0 \\le x \\le 5/3}$ litres of added water. Beyond $5/3$ L, the solution becomes weaker than $15$ g/L.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 — squared denominator</div><div class="example-body">Solve $\\dfrac{x - 3}{(x + 1)^2} \\ge 0$.<br><br><em>Solution:</em> denominator $(x + 1)^2$ is $\\ge 0$ everywhere and zero at $x = -1$. Squared denominators do not change sign — only the numerator does. Sign of quotient on $x \\ne -1$: same as sign of $x - 3$. That is $\\ge 0$ when $x \\ge 3$. Include $x = 3$ (numerator zero, $\\ge$ permits). Exclude $x = -1$ (denominator zero). Answer: $\\mathbf{[3, +\\infty)}$. Note: $(- 1)$ is not a solution even though the quotient would be "very large positive" near it — it is undefined.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 — combined three-factor</div><div class="example-body">Solve $\\dfrac{(x - 1)(x + 2)}{x - 4} < 0$.<br><br><em>Solution:</em> three breakpoints $-2, 1, 4$. Restriction $x \\ne 4$. Test $-3, 0, 2, 5$ on the quotient: signs $(-, +, -, +)$. Want $< 0$: take minus intervals, all open (strict). Answer: $\\mathbf{(-\\infty, -2) \\cup (1, 4)}$.</div></div>

<div class="think-box"><div class="think-label">FINAL SUMMARY</div><div class="think-body"><strong>(1)</strong> A rational inequality compares $P(x)/Q(x)$ to $0$ (or to another rational, which you rearrange to one side). <strong>(2)</strong> Never cross-multiply by $Q(x)$ without case analysis on its sign — use the safe procedure instead. <strong>(3)</strong> Safe procedure: one side, common denominator, factor, sign chart, read off intervals. <strong>(4)</strong> The sign chart uses <em>both</em> numerator and denominator zeros as breakpoints. <strong>(5)</strong> Endpoints: numerator zeros are filled-in when $\\le/\\ge$, open otherwise; denominator zeros are <em>always open</em>. <strong>(6)</strong> State the domain restriction at the start and check it at the end — every time.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Rational inequality: $P(x)/Q(x) \\;\\square\\; 0$, with $Q(x) \\ne 0$ a permanent restriction</li>
<li>Multiplying both sides by $Q(x)$ is illegal unless you split into cases based on the sign of $Q(x)$</li>
<li>Safe method: subtract to one side, common denominator, factor, sign chart on the real line</li>
<li>Sign chart breakpoints are <em>all</em> zeros of $N$ and <em>all</em> zeros of $D$</li>
<li>Numerator zeros: filled dot when $\\le, \\ge$; open dot when $<, >$. Denominator zeros: open dot always</li>
<li>Compound inequalities (one rational vs another): subtract, combine, then sign chart on the single quotient</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Rasyonel eşitsizlik, bir polinom eşitsizliğini alıp böldüğünde ortaya çıkan şeydir.</strong> $P(x)$'i sıfırla karşılaştırmak yerine, $P(x)/Q(x)$ oranını karşılaştırırsın. Yeni bileşen paydadır — $Q(x)$ — ve bu tek bileşen, çözüm yöntemini neredeyse tamamen değiştirir. Paydalar delikler getirir (fonksiyonun tanımlı bile olmadığı noktalar), paydalar payın işaretinden bağımsız işaret değişimleri ekler ve en doğal görünen cebirsel hamleyi — "her iki tarafı $Q(x)$ ile çarp" — eşitsizliği uyarmadan ters çeviren bir tuzağa dönüştürür.</p>

<p class="l-text">Bu dersin sonunda, YKS'de, üniversite giriş sınavında ya da bir kalkülüs dersinde karşına çıkacak her rasyonel eşitsizliği çözebilen güvenli bir prosedüre sahip olacaksın (tek bir kesre indir, sonra işaret tablosu). Sayı doğrusunda ne zaman açık, ne zaman kapalı daire koyacağını, neden bilinmeyen işaretli bir ifadeyle asla çapraz çarpmaman gerektiğini ve bir bölümün işaretini doğrudan grafikten ya da işaret tablosundan nasıl okuyacağını net olarak bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Rasyonel eşitsizliği $P(x)/Q(x) \\;\\square\\; 0$ biçiminde tanımlamayı ve $Q(x) \\ne 0$ tanım kısıtını belirtmeyi</li>
<li>$Q(x)$ ile körü körüne çapraz çarpmanın <em>neden</em> yanlış olduğunu ve somut olarak neyin yanlış gittiğini anlamayı</li>
<li>Tek güvenli prosedürü uygulamayı: her şeyi bir tarafa al, ortak payda ile birleştir, işaret tablosu kur</li>
<li>Hem payın hem de paydanın sıfırlarını kullanan bir işaret tablosu kurmayı — payda sıfırlarına açık daire, pay sıfırlarına kapalı daire (yalnızca $\\le$ veya $\\ge$ ise)</li>
<li>$\\dfrac{1}{x - 2} > \\dfrac{1}{x + 1}$ gibi karşılaştırmalı rasyonel eşitsizlikleri tek bir kesre indirgeyerek çözmeyi</li>
<li>Üç klasik hatayı (kısıtı unutmak, yanlış çapraz çarpma, payda sıfırında kapalı daire) sınavda puan kaybetmeden önce yakalamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Rasyonel Eşitsizlik Nedir?</h2>

<div class="calc-highlight"><strong>Rasyonel ifade, iki polinomun bölümüdür</strong> $P(x)/Q(x)$. Rasyonel <em>eşitsizlik</em> ise bu bölümü sıfırla (ya da her zaman sıfırın karşısına alacağımız başka bir rasyonel ifadeyle) karşılaştırır. Karşılaşacağın dört biçim: $P/Q > 0$, $P/Q \\ge 0$, $P/Q < 0$, $P/Q \\le 0$ — sıkı ya da gevşek, sıfırın pozitif ya da negatif tarafı.</div>

<div class="calc-formula"><div class="formula-label">GENEL BİÇİM</div><div class="formula-main">$$\\frac{P(x)}{Q(x)} \\;\\square\\; 0, \\qquad \\square \\in \\{<,\\;\\le,\\;>,\\;\\ge\\}, \\qquad Q(x) \\ne 0$$</div><div class="formula-sub">$Q(x) \\ne 0$ şartı isteğe bağlı bir süs değildir — problemin parçasıdır. Paydayı sıfırlayan herhangi bir aday çözüm, en sonda atılmalıdır.</div></div>

<p class="l-text">Şekli zihninde sabitlemek için üç küçük örnek:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\dfrac{x - 1}{x + 2} > 0$</div><div class="card-body">Pay $x - 1$, payda $x + 2$. Kısıt: $x \\ne -2$. Bölümün kesin pozitif olmasını istiyoruz.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{x^2 - 1}{x + 3} \\ge 0$</div><div class="card-body">Pay $(x-1)(x+1)$ olarak çarpanlara ayrılır, payda $x + 3$. Kısıt: $x \\ne -3$. Bölüm negatif olmasın — sıfır kabul (pay $x = \\pm 1$'de sıfır, payda asla $x = -3$'te değil).</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{1}{x - 2} > \\dfrac{1}{x + 1}$</div><div class="card-body">İki rasyonel ifade karşılaştırılıyor. İlk iş, ikisini aynı tarafa getirip birleştirmek. Kısıtlar: $x \\ne 2$ ve $x \\ne -1$.</div></div>
</div>

<div class="l-note"><strong>Kısıtın önemi.</strong> $1/(x - 2)$ ifadesi $x = 2$'de anlamsızdır — "1 bölü 0", tanımsız. Sonradan yapılan cebirsel bir hamle $x = 2$'yi çözüm gibi gösterse bile değildir; çünkü orijinal eşitsizlik o noktada değerlendirilemez bile. Kısıtı baştan yaz, sonda kontrol et.</div>

<h2 class="lesson-title">2. Yasak Hamle: "Sadece $Q(x)$ ile Çarp"</h2>

<div class="calc-highlight"><strong>$Q(x)$ pozitif bir sabit olsaydı — diyelim $7$ — her iki tarafı $7$ ile çarpmak sorunsuzdu: eşitsizliğin yönü değişmezdi.</strong> Ama $Q(x)$ bir $x$ ifadesidir ve işareti $x$'e bağlıdır. Bazen pozitif, bazen negatif. <em>Bir eşitsizliğin her iki tarafını işaretini bilmediğin bir şeyle çarpmak matematiksel olarak yasaktır</em> — eşitsizliği koruyacağını mı yoksa çevireceğini mi bilemezsin.</div>

<p class="l-text">Somut bir gösterim. $\\dfrac{1}{x} > 0$ eşitsizliğini ele al. Herkes cevabı bakar bakmaz görür: bu, tam olarak $x > 0$ olduğunda sağlanır. Çözüm kümesi $(0, +\\infty)$.</p>

<p class="l-text"><strong>Yanlış deneme.</strong> "Paydayı temizlemek için her iki tarafı $x$ ile çarp" diyelim, bu $1 > 0$ verir — her $x$ için doğru. Sıfır hariç her gerçek $x$'in eşitsizliği sağladığı sonucuna varırsın. Bu yanlış: her negatif sayıyı çözüm olarak sayar; oysa $x = -5$ için $1/x = -1/5$, ki bu açıkça sıfırdan büyük <em>değil</em>.</p>

<p class="l-text">Hata şudur: $x < 0$ iken negatif bir sayıyla çarptın ve eşitsizliği çevirmeyi unuttun. Doğru durum analizi şöyle olurdu: $x > 0$ ise çarpmak $1 > 0$ verir, doğru, tüm pozitif $x$'ler çözümdür; $x < 0$ ise çarpmak eşitsizliği çevirip $1 < 0$ verir, yanlış, hiçbir negatif $x$ çözüm değildir. Birleşim: $x > 0$. Doğru.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YANLIŞ (tek satır)</div><div class="compare-item">$\\dfrac{1}{x} > 0 \\;\\Longrightarrow\\; 1 > 0$ ($x$ ile çarp).</div><div class="compare-item">Sonuç: $x \\ne 0$ olan her $x$ için doğru.</div><div class="compare-item">Gerçek: her negatif $x$ için yanlış. Tüm $(-\\infty, 0)$ yarı doğrusu hatalı olarak kabul edilmiş.</div></div><div class="compare-col"><div class="compare-title">DOĞRU (durum ayrımı)</div><div class="compare-item">Durum $x > 0$: çarp, yönü koru. $1 > 0$ — doğru, tüm $x > 0$ çözümdür.</div><div class="compare-item">Durum $x < 0$: çarp, <em>yönü çevir</em>. $1 < 0$ — yanlış, $x < 0$ çözüm değildir.</div><div class="compare-item">Birleşim: $(0, +\\infty)$.</div></div></div>

<div class="l-note"><strong>Çıkarılan ders:</strong> durum ayrımı doğru ama yorucudur ve $Q(x)$ derecesi 2 ya da 3 olan birden fazla işaret değiştiren bir polinoma dönüştükçe daha da kötüleşir. Sonraki bölüm, ayrımı tamamen ortadan kaldıran ve istisnasız her rasyonel eşitsizlikte işe yarayan bir prosedür veriyor.</div>

<h2 class="lesson-title">3. Güvenli Prosedür — Bir Tarafa Al, İşaret Tablosu</h2>

<div class="calc-highlight"><strong>Adım 1.</strong> Tüm terimleri bir tarafa taşı, sağ taraf $0$ olsun. <strong>Adım 2.</strong> Ortak payda üzerinde tek bir kesre $N(x)/D(x)$ birleştir. <strong>Adım 3.</strong> $N$ ve $D$'yi mümkün olduğu kadar çarpanlara ayır. <strong>Adım 4.</strong> $N$'nin <em>tüm</em> sıfırlarını ve $D$'nin <em>tüm</em> sıfırlarını kesim noktaları olarak kullanarak gerçel doğru üzerinde işaret tablosu kur. <strong>Adım 5.</strong> Çözüm aralıklarını oku; uç noktaları dikkatle ele al.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden bir tarafa?</div><div class="card-body">Bir bölüm ya pozitif, ya negatif, ya da sıfırdır. Tüm bölümü $0$ ile karşılaştırmak, işaret tablosunu uygulamamızı sağlar. Onu başka bir rasyonel ifadeyle karşılaştırmak daha zordur — bu yüzden çıkarırız.</div></div>
<div class="calc-card"><div class="card-title">Neden tek kesir?</div><div class="card-body">Tek bir bölüm $N(x)/D(x)$'in işareti, $N$ ve $D$'nin işaretleriyle tam olarak belirlenir. İki ayrı kesir toplandığında, işaretleri birleştirmek için temiz bir kural yoktur.</div></div>
<div class="calc-card"><div class="card-title">Neden çarpanlara ayır?</div><div class="card-body">Çarpanlarına ayrılmış bir polinom yalnızca sıfırlarında işaret değiştirir ve her $(x - r)$ doğrusal çarpanı $r$'de bir kez işaret değiştirir. İşaret tablosunu önemsiz kılan budur.</div></div>
<div class="calc-card"><div class="card-title">Neden payda sıfırları?</div><div class="card-body">Fonksiyon payda sıfırında <em>tanımsız</em> olsa da, işareti o noktada tıpkı bir pay sıfırı gibi değişir. Sütunu işaretler ama açık daire ile — asla aday çözüm olmaz.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BÖLÜMÜN İŞARETİ</div><div class="formula-main">$$\\text{işaret}\\!\\left(\\frac{N(x)}{D(x)}\\right) \\;=\\; \\text{işaret}(N(x)) \\,\\cdot\\, \\text{işaret}(D(x))$$</div><div class="formula-sub">Pozitif bölü pozitif, pozitif. Pozitif bölü negatif, negatif. Negatif bölü negatif, pozitif. Negatif bölü pozitif, negatif. Tıpkı bir çarpım gibi.</div></div>

<h2 class="lesson-title">4. Çözümlü Örnek 1 — $(x - 1)/(x + 2) > 0$</h2>

<div class="calc-highlight">Kitap usulü bir başlangıç. Pay $x - 1$, sıfırı $x = 1$. Payda $x + 2$, sıfırı $x = -2$ — ve kısıt budur: $x \\ne -2$.</div>

<p class="l-text"><strong>İşaret tablosu.</strong> $-2$ ve $1$'i sayı doğrusunda işaretle. Gerçel doğruyu üç aralığa böler: $(-\\infty, -2)$, $(-2, 1)$, $(1, +\\infty)$. Her aralıkta herhangi bir test noktası seç ve $x - 1$, $x + 2$ ile bölümün işaretini oku.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Aralık</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 2$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">bölüm</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, -2)$</td><td style="padding:0.5rem 0.8rem">$-5$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-2, 1)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(1, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$5$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Oku.</strong> Bölümün kesin pozitif olmasını istiyoruz. Artı sütunlar $(-\\infty, -2)$ ve $(1, +\\infty)$. Uç noktalar: $x = 1$ bölümü sıfır yapar (sıkı eşitsizlik nedeniyle dışarıda), $x = -2$ tanım gereği dışarıda. Her iki uç da açık daire.</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM KÜMESİ</div><div class="formula-main">$$\\boxed{\\;(-\\infty, -2) \\;\\cup\\; (1, +\\infty)\\;}$$</div></div>

<div class="calc-graph"><div id="plot-l61-ex1-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = (x - 1)/(x + 2)$ fonksiyonu, $x = -2$'de dikey asimptot (kesik turuncu) ve $x = 1$'de sıfır. Mavi taralı bölgeler $y > 0$ olan yerler — tam olarak $(-\\infty, -2)$ ve $(1, +\\infty)$ çözüm aralıkları. Eğri x-ekseninin altına düştüğünde eşitsizlik sağlanmaz.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return (x-1)/(x+2);}
var x1=[];var y1=[];for(var i=0;i<=140;i++){var v=-7+5*i/140;if(v>-2.02)break;x1.push(v);y1.push(f(v));}
var x2=[];var y2=[];for(var i=0;i<=240;i++){var v=-1.98+9*i/240;x2.push(v);y2.push(f(v));}
var leftBranch={x:x1,y:y1,mode:'lines',name:'y = (x−1)/(x+2)',line:{color:'#3b82f6',width:3}};
var rightBranch={x:x2,y:y2,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var asym={x:[-2,-2],y:[-8,8],mode:'lines',name:'x = −2 (asimptot)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var zero={x:[1],y:[0],mode:'markers',name:'x = 1 sıfır',marker:{color:'#22c55e',size:12}};
var shadeL=[];var shadeY=[];for(var i=0;i<=80;i++){var v=-7+5*i/80;if(v>-2.05)break;shadeL.push(v);shadeY.push(f(v));}
var shadeR=[];var shadeRY=[];for(var i=0;i<=180;i++){var v=1+6*i/180;shadeR.push(v);shadeRY.push(f(v));}
var solRegL={x:shadeL.concat(shadeL.slice().reverse()),y:shadeY.concat(shadeL.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},name:'y > 0',hoverinfo:'skip'};
var solRegR={x:shadeR.concat(shadeR.slice().reverse()),y:shadeRY.concat(shadeR.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l61-ex1-tr',[solRegL,solRegR,leftBranch,rightBranch,asym,zero],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">DOĞRULAMA</div><div class="think-body">Her aday aralıkta bir nokta dene. $x = -3$: $(-3-1)/(-3+2) = -4/-1 = 4 > 0$. İyi. $x = 0$: $(0-1)/(0+2) = -1/2 < 0$. Dışarıda — yine iyi. $x = 3$: $(3-1)/(3+2) = 2/5 > 0$. İyi. Üç test noktası, üç doğrulama.</div></div>

<h2 class="lesson-title">5. Çözümlü Örnek 2 — $(x - 3)/(x - 1) \\le 0$ (Uç Noktalara Dikkat)</h2>

<div class="calc-highlight">Aynı prosedür ama eşitsizlik gevşek ($\\le$), bu yüzden pay sıfırı $x = 3$ çözüme <em>dahildir</em> (bölümü tam olarak sıfır yapar). Payda sıfırı $x = 1$ tanım gereği yine dışarıdadır — gevşek ya da değil, sıfıra bölemezsin.</div>

<p class="l-text">Pay sıfırı: $x = 3$. Payda sıfırı: $x = 1$. Tanım kısıtı: $x \\ne 1$. İşaret tablosu kesim noktaları: $1$ ve $3$.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Aralık</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 3$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">bölüm</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, 1)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(1, 3)$</td><td style="padding:0.5rem 0.8rem">$2$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(3, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$4$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Oku.</strong> Eşitsizlik $\\le 0$, yani eksi sütunu artı bölümün tam sıfır olduğu noktaları al. Eksi aralık: $(1, 3)$. Bölüm $x = 3$'te sıfır — dahil et. Bölüm $x = 1$'de tanımsız — hariç tut.</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM KÜMESİ</div><div class="formula-main">$$\\boxed{\\;(1, \\, 3]\\;}$$</div><div class="formula-sub">$1$'de açık (payda sıfırı, gevşek olsa da dışarıda), $3$'te kapalı (pay sıfırı, $\\le$ eşitliğe izin verir).</div></div>

<div class="l-note"><strong>Uç nokta kuralı.</strong> Eşitsizlik gevşek ($\\le$ ya da $\\ge$) olduğunda, <em>pay sıfırları çözüme dahildir</em> (bölüm o noktada tam olarak sıfırdır). <em>Payda sıfırları her zaman dışarıdadır</em> — eşitsizlik o noktada değerlendirilemez bile. Sıkı ($<$ ya da $>$) her iki tür sıfırı da dışarıda bırakır.</div>

<h2 class="lesson-title">6. Çözümlü Örnek 3 — $(x^2 - 1)/(x + 3) \\ge 0$</h2>

<div class="calc-highlight">Pay $x^2 - 1 = (x - 1)(x + 1)$ olarak çarpanlara ayrılır. Şimdi üç pay sıfırı mı var? Hayır — iki: $x = 1$ ve $x = -1$. Payda sıfırı: $x = -3$. Tanım kısıtı: $x \\ne -3$.</div>

<p class="l-text">İşaret tablosu kesim noktaları: $-3, -1, 1$. Dört aralık.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Aralık</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 3$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">bölüm</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, -3)$</td><td style="padding:0.5rem 0.8rem">$-4$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-3, -1)$</td><td style="padding:0.5rem 0.8rem">$-2$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-1, 1)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(1, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$2$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Oku.</strong> $\\ge 0$ istiyoruz: artı aralıkları al, bölümün tam sıfır olduğu noktaları ekle. Artı aralıklar: $(-3, -1)$ ve $(1, +\\infty)$. Bölüm $x = -1$ ve $x = 1$'de sıfır — ikisini de dahil et. Bölüm $x = -3$'te tanımsız — hariç.</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM KÜMESİ</div><div class="formula-main">$$\\boxed{\\;(-3, \\, -1] \\;\\cup\\; [1, \\, +\\infty)\\;}$$</div></div>

<div class="calc-graph"><div id="plot-l61-ex3-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = (x^2 - 1)/(x + 3)$ fonksiyonu. $x = -3$'te dikey asimptot, $x = \\pm 1$'de sıfırlar. Mavi taralı bölgeler $y \\ge 0$ olan yerler — tam olarak $(-3, -1]$ ve $[1, +\\infty)$ çözüm aralıkları. $\\pm 1$'de dolu noktalar, $-3$'te açık daire.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return (x*x-1)/(x+3);}
var x1=[];var y1=[];for(var i=0;i<=140;i++){var v=-9+6*i/140;if(v>-3.02)break;x1.push(v);y1.push(f(v));}
var x2=[];var y2=[];for(var i=0;i<=240;i++){var v=-2.98+10*i/240;x2.push(v);y2.push(f(v));}
var leftBranch={x:x1,y:y1,mode:'lines',name:'y = (x²−1)/(x+3)',line:{color:'#3b82f6',width:3}};
var rightBranch={x:x2,y:y2,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var asym={x:[-3,-3],y:[-12,12],mode:'lines',name:'x = −3 (asimptot)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var zeros={x:[-1,1],y:[0,0],mode:'markers',name:'x = ±1 sıfırlar',marker:{color:'#22c55e',size:12}};
var shA=[];var shAY=[];for(var i=0;i<=120;i++){var v=-2.99+2*i/120;shA.push(v);shAY.push(f(v));}
var shB=[];var shBY=[];for(var i=0;i<=180;i++){var v=1+6*i/180;shB.push(v);shBY.push(f(v));}
var regA={x:shA.concat(shA.slice().reverse()),y:shAY.concat(shA.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},name:'y ≥ 0',hoverinfo:'skip'};
var regB={x:shB.concat(shB.slice().reverse()),y:shBY.concat(shB.map(function(){return 0;}).reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(0,0,0,0)'},showlegend:false,hoverinfo:'skip'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-9,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-10,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l61-ex3-tr',[regA,regB,leftBranch,rightBranch,asym,zeros],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Çözümlü Örnek 4 — $\\dfrac{1}{x - 2} > \\dfrac{1}{x + 1}$</h2>

<div class="calc-highlight">İki rasyonel ifade eşitsizliğin karşı taraflarında. Prosedür değişmez: birini diğerinden çıkar, ortak payda altında birleştir ve elde edilen tek bölüme işaret tablosu uygula.</div>

<p class="l-text"><strong>Adım 1 — bir tarafa al.</strong> Sağ tarafı çıkar:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{1}{x - 2} \\;-\\; \\frac{1}{x + 1} \\;>\\; 0$$</div></div>

<p class="l-text"><strong>Adım 2 — ortak payda.</strong> İlk kesrin payını ve paydasını $(x + 1)$ ile, ikincisini $(x - 2)$ ile çarp:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x + 1) \\,-\\, (x - 2)}{(x - 2)(x + 1)} \\;>\\; 0 \\;\\;\\Longleftrightarrow\\;\\; \\frac{3}{(x - 2)(x + 1)} \\;>\\; 0$$</div><div class="formula-sub">Pay sabit $3$'e indi — burada şanslı bir tesadüf.</div></div>

<p class="l-text"><strong>Adım 3 — işaret analizi.</strong> Pay $3$ her yerde pozitif. Yani bölüm, payda pozitif olduğunda pozitiftir. Payda $(x - 2)(x + 1)$, sıfırları $x = 2$ ve $x = -1$ olan iki doğrusal çarpanın çarpımıdır. Tanım kısıtı: $x \\ne 2$ ve $x \\ne -1$.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Aralık</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">test $x$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x - 2$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x + 1$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">payda</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">bölüm</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-\\infty, -1)$</td><td style="padding:0.5rem 0.8rem">$-2$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$(-1, 2)$</td><td style="padding:0.5rem 0.8rem">$0$</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$(2, +\\infty)$</td><td style="padding:0.5rem 0.8rem">$3$</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
</tbody></table>
</div>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM KÜMESİ</div><div class="formula-main">$$\\boxed{\\;(-\\infty, -1) \\;\\cup\\; (2, +\\infty)\\;}$$</div><div class="formula-sub">Her iki uç açık: sıkı eşitsizlik ve payda sıfırları.</div></div>

<div class="calc-graph"><div id="plot-l61-ex4-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı eksenlerde iki eğri — $y = 1/(x - 2)$ (mavi) ve $y = 1/(x + 1)$ (kırmızı). $1/(x-2) > 1/(x+1)$ eşitsizliği, mavinin kırmızının üstünde olduğu yerleri sorar. Cevabın iki parçası — $(-\\infty, -1)$ ve $(2, +\\infty)$ — mavi eğrinin daha yüksekte oturduğu iki bölgeye karşılık gelir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f1(x){return 1/(x-2);}
function f2(x){return 1/(x+1);}
var aX=[];var aY=[];for(var i=0;i<=180;i++){var v=-7+5*i/180;if(v>-1.02)break;aX.push(v);aY.push(f1(v));}
var bX=[];var bY=[];for(var i=0;i<=180;i++){var v=-0.98+2.96*i/180;if(v>1.98)break;bX.push(v);bY.push(f1(v));}
var cX=[];var cY=[];for(var i=0;i<=240;i++){var v=2.02+5*i/240;cX.push(v);cY.push(f1(v));}
var f1a={x:aX,y:aY,mode:'lines',name:'y = 1/(x−2)',line:{color:'#3b82f6',width:3}};
var f1b={x:bX,y:bY,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var f1c={x:cX,y:cY,mode:'lines',name:'',line:{color:'#3b82f6',width:3},showlegend:false};
var dX=[];var dY=[];for(var i=0;i<=180;i++){var v=-7+6*i/180;if(v>-1.02)break;dX.push(v);dY.push(f2(v));}
var eX=[];var eY=[];for(var i=0;i<=240;i++){var v=-0.98+8*i/240;eX.push(v);eY.push(f2(v));}
var f2a={x:dX,y:dY,mode:'lines',name:'y = 1/(x+1)',line:{color:'#ef4444',width:3}};
var f2b={x:eX,y:eY,mode:'lines',name:'',line:{color:'#ef4444',width:3},showlegend:false};
var asy1={x:[2,2],y:[-6,6],mode:'lines',name:'x = 2',line:{color:'rgba(59,130,246,0.45)',width:1.5,dash:'dash'},showlegend:false};
var asy2={x:[-1,-1],y:[-6,6],mode:'lines',name:'x = −1',line:{color:'rgba(239,68,68,0.45)',width:1.5,dash:'dash'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l61-ex4-tr',[asy1,asy2,f1a,f1b,f1c,f2a,f2b],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">DOĞRULAMA</div><div class="think-body">İlk aday aralıktan $x = -5$ seç. $1/(-5 - 2) = -1/7 \\approx -0{,}143$. $1/(-5 + 1) = -1/4 = -0{,}25$. $-0{,}143 > -0{,}25$ mi? Evet — daha az negatif olan daha büyüktür. Yani $x = -5$ eşitsizliği sağlar. Reddedilen orta aralıktan $x = 0$ seç. $1/(0 - 2) = -0{,}5$. $1/(0 + 1) = 1$. $-0{,}5 > 1$ mi? Hayır. Doğru şekilde dışarıda.</div></div>

<h2 class="lesson-title">8. Tanım Kısıtları — Kalıcı Bir Hatırlatma</h2>

<div class="calc-highlight">Bir rasyonel fonksiyon paydasının sıfırlandığı yerde <em>tanımlı değildir</em>. Yazdığın eşitsizlik o tanım kısıtını sessizce devralır. <em>Bunu çözümünde belirtmek ve aday kümene karşı kontrol etmek zorundasın.</em> Bir payda sıfırına denk düşen aday, cebir ne derse desin reddedilir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yaz</div><div class="card-body">Her problemin başında: "Tanım: $x \\ne$ (payda sıfırlarının listesi)." Üç saniyelik kalem işi, soruyu komple kaybetmeni önler.</div></div>
<div class="calc-card"><div class="card-title">Her zaman açık daire</div><div class="card-body">Sayı doğrusunda her payda sıfırına açık daire (içi boş nokta) konur. Sıkı ya da gevşek olması payda sıfırı için fark etmez.</div></div>
<div class="calc-card"><div class="card-title">Pay sıfırı: simgeye bağlı</div><div class="card-body">Eşitsizlik $\\le$ ya da $\\ge$ ise pay sıfırları <em>dahildir</em> (dolu nokta). $<$ ya da $>$ ise <em>dışarıdadır</em> (açık daire).</div></div>
</div>

<div class="calc-formula"><div class="formula-label">UÇ NOKTA TABLOSU</div><div class="formula-main">$$\\begin{array}{l|c|c} \\text{Sıfır:} & \\text{sıkı } (<, >) & \\text{gevşek } (\\le, \\ge) \\\\ \\hline \\text{Pay } N & \\text{dışarıda (açık)} & \\text{dahil (kapalı)} \\\\ \\text{Payda } D & \\text{dışarıda (açık)} & \\text{dışarıda (açık)} \\end{array}$$</div><div class="formula-sub">Bu küçük tabloyu ezberle. Her rasyonel eşitsizlikteki her uç nokta sorusunu o karara bağlar.</div></div>

<h2 class="lesson-title">9. Üç Klasik Hata</h2>

<div class="calc-highlight"><strong>Hata A:</strong> $Q(x)$ ile durum analizi yapmadan çapraz çarpmak (2. bölümde işlendi). <strong>Hata B:</strong> işaret tablosunda payda sıfırlarını kesim noktası olarak yazmayı unutmak. <strong>Hata C:</strong> eşitsizlik gevşek diye payda sıfırına kapalı daire çizmek.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA B — UYGULAMADA</div><div class="compare-item">Soru: $\\dfrac{x - 1}{x + 2} > 0$.</div><div class="compare-item">Bir öğrenci "$x - 1 > 0$ demek $x > 1$" yazar ve durur. Cevabı $(1, +\\infty)$ olarak okur.</div><div class="compare-item">Yanlış cevap, hem payın hem paydanın negatif olduğu ve bölümün dolayısıyla pozitif çıktığı $(-\\infty, -2)$ aralığını tamamen atlar.</div><div class="compare-item">Çözüm: işaret tablosuna payda sıfırlarını da her zaman dahil et.</div></div><div class="compare-col"><div class="compare-title">HATA C — UYGULAMADA</div><div class="compare-item">Soru: $\\dfrac{x - 3}{x - 1} \\le 0$.</div><div class="compare-item">Bir öğrenci "$\\le$ sınırı kapsar, o halde $[1, 3]$" yazar.</div><div class="compare-item">Yanlış: $x = 1$ paydayı sıfırlar, bölüm orada tanımsızdır — asla çözüm değildir.</div><div class="compare-item">Çözüm: pay sıfırı $\\Rightarrow$ dolu nokta ($\\le/\\ge$ ise). Payda sıfırı $\\Rightarrow$ her zaman açık daire.</div></div></div>

<div class="l-note"><strong>Bir başka ince hata.</strong> Soru $1/(x - 2) > 1/(x + 1)$ ise ve "$(x - 2)(x + 1)$ ile çapraz çarp" dersen, işareti $x$'e <em>iki</em> farklı şekilde bağımlı olan bir çarpımla çarpmış olursun. Durum analizi dört alt duruma patlar. 3. bölümün güvenli prosedürü bunu tek bir hesaba ve tek bir işaret tablosuna indirir. Onu kullan.</div>

<h2 class="lesson-title">10. Alıştırmalar</h2>

<div class="calc-highlight">Prosedürü pekiştirmek için sekiz problem. Çözümü okumadan önce her birini dene. Uç nokta dikkati her birinde önemli.</div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — basit</div><div class="example-body">$\\dfrac{x + 4}{x - 2} > 0$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> pay sıfırı $x = -4$, payda sıfırı $x = 2$. Üç aralık. Test noktaları $-5, 0, 3$ işaretleri $(+), (-), (+)$ verir. Sıkı eşitsizlik, her iki uç açık. Cevap: $\\mathbf{(-\\infty, -4) \\cup (2, +\\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — gevşek, pay dahil</div><div class="example-body">$\\dfrac{2x - 6}{x + 5} \\le 0$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> $2x - 6 = 0 \\Rightarrow x = 3$. $x + 5 = 0 \\Rightarrow x = -5$. Test noktaları $-6, 0, 4$ işaretleri $(+), (-), (+)$ verir. $\\le 0$ istiyoruz: eksi aralığı al, $x = 3$'ü dahil et (pay sıfırı, $\\le$ izin verir), $x = -5$'i hariç tut (payda). Cevap: $\\mathbf{(-5, 3]}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — payda kare</div><div class="example-body">$\\dfrac{(x - 1)^2}{x + 2} \\le 0$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> $(x - 1)^2 \\ge 0$ her zaman, yani bölümün işareti $1/(x + 2)$'nin işaretine eşittir, sadece $x = 1$'de bölüm tam olarak $0$'dır. Payda sıfırı $x = -2$. Bölüm $\\le 0$ olur ya sıfır olduğunda (yani $x = 1$) ya da negatif olduğunda ($x + 2 < 0$, yani $x < -2$). Cevap: $\\mathbf{(-\\infty, -2) \\cup \\{1\\}}$. Tipik bir sınav tuzağı — yalıtık $\\{1\\}$ noktası kolayca kaçırılır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — payda ikinci derece</div><div class="example-body">$\\dfrac{x^2 - 4}{x - 1} \\ge 0$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> payı çarpanlara ayır: $(x - 2)(x + 2)$. Kesim noktaları $-2, 1, 2$. Test $-3, 0, 1{,}5, 3$. Bölüm işaretleri: $(-, +, -, +)$. $\\ge 0$ istiyoruz: artı aralıkları al, pay sıfırlarını dahil et. $x = \\pm 2$ dahil, $x = 1$ hariç. Cevap: $\\mathbf{[-2, 1) \\cup [2, +\\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — iki rasyonel karşılaştırması</div><div class="example-body">$\\dfrac{2}{x + 3} \\ge \\dfrac{1}{x - 1}$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> bir tarafa al: $\\dfrac{2}{x + 3} - \\dfrac{1}{x - 1} \\ge 0$. Ortak payda: $\\dfrac{2(x - 1) - (x + 3)}{(x + 3)(x - 1)} = \\dfrac{x - 5}{(x + 3)(x - 1)} \\ge 0$. Kesim noktaları: $-3, 1, 5$. Kısıtlar: $x \\ne -3, x \\ne 1$. Test $-4, 0, 2, 6$: işaretler $(-, +, -, +)$. $\\ge 0$ istiyoruz: $(-3, 1) \\cup [5, +\\infty)$. Pay sıfırı $5$ dahil, payda sıfırları hariç. Cevap: $\\mathbf{(-3, 1) \\cup [5, +\\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — derişim problemi</div><div class="example-body">Bir kimyager elinde $100$ gram saf tuzu suda çözmüş halde tutuyor. $x$ litre saf su eklemek çözeltiyi seyreltir. Orijinal çözelti zaten $5$ litre içerdiğinden, $x$ litre eklendikten sonra derişim (gram/litre) $C(x) = 100/(x + 5)$ olur. Hangi $x \\ge 0$ değerlerinde derişim <em>en az</em> $15$ g/L'dir? <br><br><em>Kurulum:</em> $\\dfrac{100}{x + 5} \\ge 15$.<br><em>Bir tarafa al:</em> $\\dfrac{100}{x + 5} - 15 \\ge 0 \\;\\Rightarrow\\; \\dfrac{100 - 15(x + 5)}{x + 5} \\ge 0 \\;\\Rightarrow\\; \\dfrac{25 - 15x}{x + 5} \\ge 0$. Pay sıfırı: $x = 25/15 = 5/3$. Payda sıfırı $x = -5$ — fiziksel tanım $x \\ge 0$'ın dışında.<br><em>$[0, +\\infty)$ üzerinde:</em> payda $x + 5$ her zaman pozitif. Yani bölümün işareti $25 - 15x$'in işaretine eşit. Bu $x \\le 5/3$ olduğunda $\\ge 0$'dır.<br><em>Cevap:</em> $\\mathbf{0 \\le x \\le 5/3}$ litre eklenen su. $5/3$ L'den fazlası eklendiğinde çözelti $15$ g/L'den daha zayıf olur.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — paydada kare</div><div class="example-body">$\\dfrac{x - 3}{(x + 1)^2} \\ge 0$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> payda $(x + 1)^2$ her yerde $\\ge 0$ ve $x = -1$'de sıfırdır. Kare paydalar işaret değiştirmez — sadece pay değiştirir. $x \\ne -1$ için bölümün işareti $x - 3$'ün işaretine eşit. Bu $x \\ge 3$ olduğunda $\\ge 0$. $x = 3$'ü dahil et (pay sıfırı, $\\ge$ izin verir). $x = -1$'i hariç tut (payda sıfırı). Cevap: $\\mathbf{[3, +\\infty)}$. Not: $(-1)$ çözüm değildir — civarındaki bölüm "çok büyük pozitif" görünse de tanımsızdır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 — üç çarpanlı bileşik</div><div class="example-body">$\\dfrac{(x - 1)(x + 2)}{x - 4} < 0$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> üç kesim noktası $-2, 1, 4$. Kısıt $x \\ne 4$. Test $-3, 0, 2, 5$ bölüm işaretleri: $(-, +, -, +)$. $< 0$ istiyoruz: eksi aralıkları al, hepsi açık (sıkı). Cevap: $\\mathbf{(-\\infty, -2) \\cup (1, 4)}$.</div></div>

<div class="think-box"><div class="think-label">SON ÖZET</div><div class="think-body"><strong>(1)</strong> Rasyonel eşitsizlik, $P(x)/Q(x)$'i $0$ ile (ya da bir tarafa aldığın başka bir rasyonel ifadeyle) karşılaştırır. <strong>(2)</strong> $Q(x)$ ile durum analizi yapmadan asla çapraz çarpma — onun yerine güvenli prosedürü kullan. <strong>(3)</strong> Güvenli prosedür: bir taraf, ortak payda, çarpanlara ayır, işaret tablosu, aralıkları oku. <strong>(4)</strong> İşaret tablosu hem pay hem de payda sıfırlarını kesim noktası olarak kullanır. <strong>(5)</strong> Uç noktalar: pay sıfırları $\\le/\\ge$ iken dolu, aksi takdirde açık; payda sıfırları <em>her zaman açık</em>. <strong>(6)</strong> Tanım kısıtını baştan yaz ve sonda kontrol et — her seferinde.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Rasyonel eşitsizlik: $P(x)/Q(x) \\;\\square\\; 0$, kalıcı kısıt $Q(x) \\ne 0$</li>
<li>Her iki tarafı $Q(x)$ ile çarpmak, $Q(x)$'in işaretine göre durum ayrımı yapmadıkça yasaktır</li>
<li>Güvenli yöntem: bir tarafa çıkar, ortak payda, çarpanlara ayır, gerçel doğru üzerinde işaret tablosu</li>
<li>İşaret tablosu kesim noktaları $N$'nin <em>tüm</em> sıfırları ve $D$'nin <em>tüm</em> sıfırlarıdır</li>
<li>Pay sıfırları: $\\le, \\ge$ iken dolu nokta; $<, >$ iken açık daire. Payda sıfırları: her zaman açık daire</li>
<li>Bileşik eşitsizlikler (rasyonel vs rasyonel): çıkar, birleştir, sonra tek bölüm üzerinde işaret tablosu</li>
</ul>
</div>`
};
