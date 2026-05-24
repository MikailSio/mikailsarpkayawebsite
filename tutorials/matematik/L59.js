window.LISE_MAT_L59 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The absolute value is the simplest function in mathematics that students still get wrong on the YKS.</strong> The definition is one line — $|x|$ is the distance from $x$ to zero on the number line — and yet equations involving it cause more lost marks than quadratics, fractions, and trigonometry combined. The reason is always the same: students forget that "distance" has no sign, so when they remove the absolute value bars they keep only one of the two cases instead of both.</p>

<p class="l-text">This lesson fixes that habit permanently. You will learn to read $|\\,\\cdot\\,|$ as a geometric instruction (a distance), to split equations into two cases mechanically, to combine multiple absolute values by partitioning the real line into intervals, and to check every candidate solution against the original equation. The procedure is rigid, almost mechanical — and that is exactly why it is reliable under exam pressure.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the piecewise definition of $|x|$ and interpret it geometrically as distance from zero</li>
<li>Solve $|f(x)| = c$ by splitting into the two cases $f(x) = c$ and $f(x) = -c$, rejecting the equation when $c &lt; 0$</li>
<li>Solve $|f(x)| = |g(x)|$ by treating the two cases $f = g$ and $f = -g$</li>
<li>Handle $|f(x)| = g(x)$ by checking the validity condition $g(x) \\ge 0$ on every candidate</li>
<li>Use interval analysis to remove nested absolute values like $|x - 1| + |x + 2| = 5$</li>
<li>Recognise the quadratic-in-$|x|$ substitution $u = |x|$ for equations such as $x^2 - 5|x| + 6 = 0$</li>
</ul>
</div>

<h2 class="lesson-title">1. The Absolute Value — Definition and Geometric Meaning</h2>

<div class="calc-highlight"><strong>The absolute value of a real number $x$, written $|x|$, is its distance from zero on the number line.</strong> Distance is never negative, so $|x| \\ge 0$ for every real $x$, and $|x| = 0$ only when $x = 0$ itself.</div>

<div class="calc-formula"><div class="formula-label">PIECEWISE DEFINITION</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} \\;\\;\\,x, &amp; \\text{if } x \\ge 0 \\\\ -x, &amp; \\text{if } x &lt; 0 \\end{cases}$$</div><div class="formula-sub">Positive numbers (and zero) stay as they are. Negative numbers get their sign flipped — the minus eats the minus and leaves a positive result.</div></div>

<p class="l-text">Three quick numerical sanity checks. <strong>$|7| = 7$</strong> because 7 is positive. <strong>$|-7| = 7$</strong> because the rule says we apply $-x$ when $x &lt; 0$, and $-(-7) = 7$. <strong>$|0| = 0$</strong>. The output is the magnitude — the size of the number — stripped of its sign.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geometric reading</div><div class="card-body">$|x|$ is the unsigned distance from the origin to the point $x$ on the number line. $|x - a|$ is the distance from $x$ to the point $a$.</div></div>
<div class="calc-card"><div class="card-title">Algebraic reading</div><div class="card-body">A piecewise function: identity on the right half-line, negation on the left. Continuous everywhere, but not differentiable at $x = 0$ (a "corner").</div></div>
<div class="calc-card"><div class="card-title">Square-root reading</div><div class="card-body">$|x| = \\sqrt{x^2}$. The square kills the sign, the square-root takes the positive root. Useful in proofs and in calculus.</div></div>
</div>

<div class="calc-graph"><div id="plot-l59-vshape-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>The classic V-shape:</strong> the graph of $y = |x|$. The two half-lines $y = x$ (for $x \\ge 0$) and $y = -x$ (for $x &lt; 0$) meet at the origin, forming a corner. The graph is always above (or on) the $x$-axis because $|x| \\ge 0$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var v=-5+10*i/200;xs.push(v);ys.push(Math.abs(v));}
var curve={x:xs,y:ys,mode:'lines',name:'y = |x|',line:{color:'#3b82f6',width:3}};
var vertex={x:[0],y:[0],mode:'markers+text',name:'vertex (0, 0)',marker:{color:'#22c55e',size:12},text:['(0, 0)'],textposition:'bottom right',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-1,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l59-vshape-en',[curve,vertex],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Read $|x - a|$ as a distance.</strong> The expression $|x - 3|$ is the distance from $x$ to 3 on the number line. The expression $|x + 5| = |x - (-5)|$ is the distance from $x$ to $-5$. Converting algebra into a distance statement is the fastest way to think about absolute-value equations and inequalities under exam pressure.</div>

<h2 class="lesson-title">2. The Basic Equation $|x| = a$</h2>

<div class="calc-highlight"><strong>Three cases by the sign of the right-hand side.</strong> The equation $|x| = a$ asks: "which numbers $x$ are at distance $a$ from zero?" The answer depends entirely on whether $a$ is positive, zero, or negative.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">CASE A — $a &gt; 0$</div><div class="compare-item">Two numbers are at distance $a$ from zero: one to the right ($+a$), one to the left ($-a$).</div><div class="compare-item">Solution: $x = a$ or $x = -a$. Written as $x = \\pm a$.</div><div class="compare-item">Example: $|x| = 4 \\Rightarrow x \\in \\{-4, 4\\}$.</div></div><div class="compare-col"><div class="compare-title">CASE B — $a = 0$</div><div class="compare-item">Only one number is at distance 0 from itself.</div><div class="compare-item">Solution: $x = 0$. A single root.</div><div class="compare-item">Example: $|x| = 0 \\Rightarrow x = 0$.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">CASE C — $a &lt; 0$</div><div class="compare-item">Distance is never negative. No number can be at "distance $-3$" from zero.</div><div class="compare-item">Solution set: $\\varnothing$ (empty).</div><div class="compare-item">Example: $|x| = -2 \\Rightarrow$ no solution.</div></div><div class="compare-col"><div class="compare-title">Mental check</div><div class="compare-item">Before doing any algebra, glance at the right-hand side. If it is a negative <em>constant</em>, write $\\varnothing$ and move on. Save the time.</div><div class="compare-item">If it is an <em>expression</em> in $x$ (not a constant), this trick does not apply — you must still split into cases and verify (section 6).</div></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Solve $|x| = 7$.<br><br>$a = 7 &gt; 0$, so $x = 7$ or $x = -7$.<br><br>Solution set: $\\mathbf{\\{-7, \\, 7\\}}$.</div></div>

<h2 class="lesson-title">3. Expression Equals a Constant: $|f(x)| = c$</h2>

<div class="calc-highlight"><strong>The split rule.</strong> When the absolute value of an expression equals a non-negative constant, the expression itself is either $+c$ or $-c$. Two ordinary equations replace one absolute-value equation.</div>

<div class="calc-formula"><div class="formula-label">THE SPLIT RULE</div><div class="formula-main">$$|f(x)| = c \\;\\;\\Longleftrightarrow\\;\\; f(x) = c \\;\\text{ or }\\; f(x) = -c \\qquad (c \\ge 0)$$</div><div class="formula-sub">If $c &lt; 0$, no solution. If $c = 0$, the two cases collapse into the single equation $f(x) = 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|2x - 3| = 5$.<br><br>Split into two cases:<br>Case 1: $2x - 3 = 5 \\;\\Rightarrow\\; 2x = 8 \\;\\Rightarrow\\; x = 4$.<br>Case 2: $2x - 3 = -5 \\;\\Rightarrow\\; 2x = -2 \\;\\Rightarrow\\; x = -1$.<br><br>Check (always!): $|2 \\cdot 4 - 3| = |5| = 5$. $|2 \\cdot (-1) - 3| = |-5| = 5$. Both work.<br><br>Solution set: $\\mathbf{\\{-1, \\, 4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|3x + 1| = 10$.<br><br>Case 1: $3x + 1 = 10 \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3$.<br>Case 2: $3x + 1 = -10 \\;\\Rightarrow\\; 3x = -11 \\;\\Rightarrow\\; x = -\\tfrac{11}{3}$.<br><br>Solution set: $\\mathbf{\\left\\{-\\tfrac{11}{3}, \\, 3\\right\\}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — no solution</div><div class="example-body">Solve $|5x - 2| = -4$.<br><br>The right-hand side is negative. No absolute value can equal a negative number.<br><br>Solution set: $\\mathbf{\\varnothing}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — the $c = 0$ case</div><div class="example-body">Solve $|4x + 8| = 0$.<br><br>The two cases $4x + 8 = 0$ and $4x + 8 = -0$ are identical. So $4x = -8 \\;\\Rightarrow\\; x = -2$.<br><br>Solution: $\\mathbf{x = -2}$ (a single root, not a pair).</div></div>

<div class="think-box"><div class="think-label">A COMMON MISTAKE</div><div class="think-body">Some students "remove the bars" and write $2x - 3 = 5$ as the entire solution, forgetting Case 2. This loses half the answer. Always write both cases on the page even before you start solving, so you cannot forget one.</div></div>

<h2 class="lesson-title">4. Two Absolute Values: $|f(x)| = |g(x)|$</h2>

<div class="calc-highlight"><strong>When two absolute values are equal, the two insides are either equal to each other or opposite (one is the negative of the other).</strong> Two new equations to solve; both candidate solutions must be checked against the original.</div>

<div class="calc-formula"><div class="formula-label">THE TWO-SIDED SPLIT</div><div class="formula-main">$$|f(x)| = |g(x)| \\;\\;\\Longleftrightarrow\\;\\; f(x) = g(x) \\;\\text{ or }\\; f(x) = -g(x)$$</div><div class="formula-sub">No "no solution" sub-case here — both absolute values are automatically non-negative, so the equation is well-posed for all real $x$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|x + 1| = |2x - 4|$.<br><br>Case 1 (equal insides): $x + 1 = 2x - 4 \\;\\Rightarrow\\; 5 = x$.<br>Case 2 (opposite insides): $x + 1 = -(2x - 4) \\;\\Rightarrow\\; x + 1 = -2x + 4 \\;\\Rightarrow\\; 3x = 3 \\;\\Rightarrow\\; x = 1$.<br><br>Check: $|5 + 1| = 6$ and $|2 \\cdot 5 - 4| = 6$. $|1 + 1| = 2$ and $|2 \\cdot 1 - 4| = 2$. Both check.<br><br>Solution set: $\\mathbf{\\{1, \\, 5\\}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|3x - 2| = |x + 4|$.<br><br>Case 1: $3x - 2 = x + 4 \\;\\Rightarrow\\; 2x = 6 \\;\\Rightarrow\\; x = 3$.<br>Case 2: $3x - 2 = -(x + 4) \\;\\Rightarrow\\; 3x - 2 = -x - 4 \\;\\Rightarrow\\; 4x = -2 \\;\\Rightarrow\\; x = -\\tfrac{1}{2}$.<br><br>Solution set: $\\mathbf{\\left\\{-\\tfrac{1}{2}, \\, 3\\right\\}}$.</div></div>

<div class="l-note"><strong>Why two cases and not four?</strong> One might think there are four sign combinations ($\\pm f = \\pm g$), but $f = g$ is the same as $-f = -g$ and $f = -g$ is the same as $-f = g$. The four cases collapse to two.</div>

<h2 class="lesson-title">5. Equation Equals a Variable Expression: $|f(x)| = g(x)$</h2>

<div class="calc-highlight"><strong>The crucial difference:</strong> the right-hand side is no longer a constant. It depends on $x$. Since the left side is non-negative, we need the right side to be non-negative too: <strong>any solution must satisfy $g(x) \\ge 0$.</strong> Forget this domain check and you will list spurious solutions.</div>

<div class="calc-formula"><div class="formula-label">THE METHOD</div><div class="formula-main">$$|f(x)| = g(x) \\;\\;\\Longleftrightarrow\\;\\; \\big[\\,f(x) = g(x) \\;\\text{ or }\\; f(x) = -g(x)\\,\\big] \\;\\text{ AND } g(x) \\ge 0$$</div><div class="formula-sub">Solve both cases, then discard any candidate that makes $g(x) &lt; 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|x - 2| = x + 1$.<br><br><strong>Domain:</strong> the right side must be $\\ge 0$, so $x + 1 \\ge 0 \\;\\Rightarrow\\; x \\ge -1$.<br><br>Case 1: $x - 2 = x + 1 \\;\\Rightarrow\\; -2 = 1$. False. No solution from this case.<br>Case 2: $x - 2 = -(x + 1) = -x - 1 \\;\\Rightarrow\\; 2x = 1 \\;\\Rightarrow\\; x = \\tfrac{1}{2}$.<br><br><strong>Domain check:</strong> $x = \\tfrac{1}{2} \\ge -1$. ✓<br><br>Verify in original: $|\\tfrac{1}{2} - 2| = |\\!-\\!\\tfrac{3}{2}| = \\tfrac{3}{2}$, and $\\tfrac{1}{2} + 1 = \\tfrac{3}{2}$. ✓<br><br>Solution: $\\mathbf{x = \\tfrac{1}{2}}$.</div></div>

<div class="calc-graph"><div id="plot-l59-cross-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Geometric picture:</strong> the two graphs $y = |x - 2|$ (V-shape with vertex at $(2, 0)$) and $y = x + 1$ (a straight line of slope 1, intercept 1). They cross exactly once, at $x = \\tfrac{1}{2}$. The would-be second intersection vanishes because the line $y = x + 1$ never gets above the right arm of the V on the other side.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var v1=[];var v2=[];for(var i=0;i<=200;i++){var v=-2+8*i/200;xs.push(v);v1.push(Math.abs(v-2));v2.push(v+1);}
var fA={x:xs,y:v1,mode:'lines',name:'y = |x − 2|',line:{color:'#3b82f6',width:3}};
var fB={x:xs,y:v2,mode:'lines',name:'y = x + 1',line:{color:'#f59e0b',width:3}};
var sol={x:[0.5],y:[1.5],mode:'markers+text',name:'solution',marker:{color:'#22c55e',size:13},text:['x = 1/2'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-1,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l59-cross-en',[fA,fB,sol],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — a candidate gets rejected</div><div class="example-body">Solve $|x - 1| = 2x + 3$.<br><br><strong>Domain:</strong> $2x + 3 \\ge 0 \\;\\Rightarrow\\; x \\ge -\\tfrac{3}{2}$.<br><br>Case 1: $x - 1 = 2x + 3 \\;\\Rightarrow\\; -4 = x$. Domain check: $-4 \\ge -\\tfrac{3}{2}$? <strong>No.</strong> Reject.<br>Case 2: $x - 1 = -(2x + 3) = -2x - 3 \\;\\Rightarrow\\; 3x = -2 \\;\\Rightarrow\\; x = -\\tfrac{2}{3}$. Domain check: $-\\tfrac{2}{3} \\ge -\\tfrac{3}{2}$? <strong>Yes.</strong> Keep.<br><br>Verify: $|\\!-\\!\\tfrac{2}{3} - 1| = |\\!-\\!\\tfrac{5}{3}| = \\tfrac{5}{3}$, and $2 \\cdot (-\\tfrac{2}{3}) + 3 = -\\tfrac{4}{3} + 3 = \\tfrac{5}{3}$. ✓<br><br>Solution: $\\mathbf{x = -\\tfrac{2}{3}}$. (The case-1 root $x = -4$ is spurious — it satisfies the split equation but makes the original RHS negative.)</div></div>

<h2 class="lesson-title">6. Case Analysis on Intervals: $|f| + |g| = c$</h2>

<div class="calc-highlight"><strong>When two or more absolute values appear in a single equation, the safest method is to partition the real line into intervals where each absolute value has a known sign, then drop the bars in each interval and solve the resulting linear equation.</strong></div>

<p class="l-text">For an absolute value $|h(x)|$, the "sign-change point" (also called the <em>critical point</em>) is where the inside vanishes, $h(x) = 0$. To the right of this point $h$ is positive and $|h| = h$; to the left it is negative and $|h| = -h$. With several absolute values, mark every critical point on the number line and look at the intervals between them.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — the classic two-modulus problem</div><div class="example-body">Solve $|x - 1| + |x + 2| = 5$.<br><br><strong>Step 1 — find critical points:</strong> $x - 1 = 0$ at $x = 1$; $x + 2 = 0$ at $x = -2$. Mark $-2$ and $1$ on the number line. They split it into three intervals.<br><br><strong>Step 2 — rewrite each modulus on each interval:</strong><br>
<table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin:0.8rem 0">
<thead><tr style="background:rgba(59,130,246,0.1)"><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">Interval</th><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">$|x - 1|$</th><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">$|x + 2|$</th><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">Sum</th></tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.4rem 0.6rem">$x &lt; -2$</td><td style="padding:0.4rem 0.6rem">$-(x - 1) = 1 - x$</td><td style="padding:0.4rem 0.6rem">$-(x + 2) = -x - 2$</td><td style="padding:0.4rem 0.6rem">$-2x - 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.4rem 0.6rem">$-2 \\le x &lt; 1$</td><td style="padding:0.4rem 0.6rem">$1 - x$</td><td style="padding:0.4rem 0.6rem">$x + 2$</td><td style="padding:0.4rem 0.6rem">$3$ (constant!)</td></tr>
<tr><td style="padding:0.4rem 0.6rem">$x \\ge 1$</td><td style="padding:0.4rem 0.6rem">$x - 1$</td><td style="padding:0.4rem 0.6rem">$x + 2$</td><td style="padding:0.4rem 0.6rem">$2x + 1$</td></tr>
</tbody></table>
<strong>Step 3 — solve each linear equation, keeping only solutions inside the corresponding interval:</strong><br>
Interval $x &lt; -2$: $-2x - 1 = 5 \\Rightarrow x = -3$. Check $-3 &lt; -2$? Yes. ✓<br>
Interval $-2 \\le x &lt; 1$: $3 = 5$. False — no solution from this slab.<br>
Interval $x \\ge 1$: $2x + 1 = 5 \\Rightarrow x = 2$. Check $2 \\ge 1$? Yes. ✓<br><br>
Solution set: $\\mathbf{\\{-3, \\, 2\\}}$.</div></div>

<div class="calc-graph"><div id="plot-l59-twomod-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Piecewise picture:</strong> the function $f(x) = |x - 1| + |x + 2|$ is piecewise linear with corners at $x = -2$ and $x = 1$. Between the corners it is constant at $f = 3$. Outside, it grows with slope $\\pm 2$. The horizontal line $y = 5$ cuts the graph at exactly two points: $x = -3$ and $x = 2$, matching the algebraic answer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var v=-6+12*i/300;xs.push(v);ys.push(Math.abs(v-1)+Math.abs(v+2));}
var f={x:xs,y:ys,mode:'lines',name:'y = |x − 1| + |x + 2|',line:{color:'#3b82f6',width:3}};
var hLine={x:[-6,6],y:[5,5],mode:'lines',name:'y = 5',line:{color:'#f59e0b',width:2,dash:'dash'}};
var sols={x:[-3,2],y:[5,5],mode:'markers+text',name:'solutions',marker:{color:'#22c55e',size:13},text:['x = −3','x = 2'],textposition:'top center',textfont:{color:'#22c55e',size:12}};
var corners={x:[-2,1],y:[3,3],mode:'markers+text',name:'corners',marker:{color:'#ef4444',size:9},text:['corner','corner'],textposition:'bottom center',textfont:{color:'#ef4444',size:10}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[0,11],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l59-twomod-en',[f,hLine,sols,corners],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The flat middle slab.</strong> Notice the surprising shape: $|x - 1| + |x + 2|$ is constant (equal to $3$) for every $x$ in $[-2, 1]$. Geometrically, this is the distance from $x$ to $1$ plus the distance from $x$ to $-2$. When $x$ is between them, this sum is just the gap between $-2$ and $1$, which is 3 — independent of where $x$ sits in the slab. This is the triangle inequality in action.</div>

<h2 class="lesson-title">7. Geometric Interpretation as Distance</h2>

<div class="calc-highlight"><strong>Convert algebra into distance language.</strong> The equation $|x - a| = d$ literally says: "the point $x$ is at distance $d$ from the point $a$." That gives an instant geometric solution: the two points $a + d$ and $a - d$.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$|x - 3| = 5$</div><div class="card-body">"$x$ is 5 units from 3." So $x = 3 + 5 = 8$ or $x = 3 - 5 = -2$.</div></div>
<div class="calc-card"><div class="card-title">$|x + 4| = 7$</div><div class="card-body">Rewrite as $|x - (-4)| = 7$. "$x$ is 7 units from $-4$." So $x = -4 + 7 = 3$ or $x = -4 - 7 = -11$.</div></div>
<div class="calc-card"><div class="card-title">$|x - 1| + |x + 2| = 5$</div><div class="card-body">"Distance from $x$ to $1$ plus distance from $x$ to $-2$ equals 5." The two endpoints $-2$ and $1$ are 3 units apart. We need 5 total, so $x$ lies either 1 unit to the left of $-2$ ($x = -3$) or 1 unit to the right of $1$ ($x = 2$).</div></div>
</div>

<p class="l-text">This trick is fast on multiple-choice exams. Read the algebra as a distance question; sketch a quick number line; write the answer down. Algebra is the safety net, but geometry is the shortcut.</p>

<h2 class="lesson-title">8. Quadratic-in-Modulus: Substitute $u = |x|$</h2>

<div class="calc-highlight"><strong>When the equation contains $x^2$ and $|x|$ but no plain $x$, substitute $u = |x|$.</strong> Since $x^2 = |x|^2 = u^2$, the equation becomes an ordinary quadratic in $u$. Solve for $u \\ge 0$, then unwrap back to $x$.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Solve $x^2 - 5|x| + 6 = 0$.<br><br>Let $u = |x|$, so $x^2 = u^2$:<br>$u^2 - 5u + 6 = 0 \\;\\Rightarrow\\; (u - 2)(u - 3) = 0 \\;\\Rightarrow\\; u = 2 \\;\\text{ or }\\; u = 3$.<br><br>Both values are $\\ge 0$, so both are valid moduli. Now unwrap:<br>$|x| = 2 \\;\\Rightarrow\\; x = \\pm 2$.<br>$|x| = 3 \\;\\Rightarrow\\; x = \\pm 3$.<br><br>Solution set: $\\mathbf{\\{-3, \\, -2, \\, 2, \\, 3\\}}$ — four solutions in total.</div></div>

<div class="l-note"><strong>Always check $u \\ge 0$ after solving for $u$.</strong> A negative $u$ corresponds to "$|x|$ equals a negative number" — impossible. Discard.</div>

<h2 class="lesson-title">9. Word Problem — Tolerance Bounds</h2>

<div class="calc-highlight"><strong>Absolute values are the natural language of "error" and "tolerance" in physics, engineering, and quality control.</strong> A statement like "the measured value differs from the target by at most 0.5 mm" translates immediately into $|x - \\mu| \\le 0.5$.</div>

<p class="l-text"><strong>Problem.</strong> A bottling machine is supposed to fill each bottle with 500 ml of water. Quality control accepts bottles whose actual content differs from 500 ml by at most 8 ml. A bottle just rejected was off the limit by exactly 1 ml. What were the possible actual contents of that bottle?</p>

<p class="l-text"><strong>Setup.</strong> Let $x$ be the actual content. The acceptance condition is $|x - 500| \\le 8$. "Just rejected, off by 1 ml" means $|x - 500| = 8 + 1 = 9$.</p>

<p class="l-text"><strong>Solve.</strong> $|x - 500| = 9 \\Rightarrow x - 500 = 9$ or $x - 500 = -9$, so $x = 509$ ml or $x = 491$ ml.</p>

<p class="l-text"><strong>Answer.</strong> The rejected bottle contained either <strong>509 ml</strong> (too much) or <strong>491 ml</strong> (too little).</p>

<h2 class="lesson-title">10. Common Errors — A Field Guide</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Error 1 — forgetting Case 2</div><div class="card-body">Writing $|2x - 3| = 5$ as just $2x - 3 = 5$ and stopping. Always write both cases first; never solve before splitting.</div></div>
<div class="calc-card"><div class="card-title">Error 2 — dropping bars too early</div><div class="card-body">"$|x - 4|$ is just $x - 4$" is true only when $x \\ge 4$. For $x &lt; 4$ you must use $-(x - 4) = 4 - x$. Mark the critical point first.</div></div>
<div class="calc-card"><div class="card-title">Error 3 — skipping the domain check</div><div class="card-body">In $|f(x)| = g(x)$, every candidate must satisfy $g(x) \\ge 0$. Failing to check produces phantom solutions.</div></div>
<div class="calc-card"><div class="card-title">Error 4 — keeping interval-mismatched roots</div><div class="card-body">In interval analysis, a solution found in interval I but lying outside I is invalid for that interval. Always check the candidate against the interval bounds.</div></div>
<div class="calc-card"><div class="card-title">Error 5 — solving $|f| = $ negative</div><div class="card-body">$|f(x)| = -7$ has no solution. Don't waste time on algebra. State $\\varnothing$ and move on.</div></div>
<div class="calc-card"><div class="card-title">Error 6 — squaring blindly</div><div class="card-body">Squaring both sides of $|f| = g$ gives $f^2 = g^2$ which is equivalent to $|f| = |g|$ — not to the original equation. You introduce spurious roots and must verify each one against the original equation.</div></div>
</div>

<h2 class="lesson-title">11. Practice Exercises</h2>

<div class="calc-highlight">Six worked exercises. Cover the answer with your hand and try each one with paper and pencil first. The starred ones (*) are harder.</div>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Solve $|2x - 3| = 5$.<br><br><em>Answer:</em> $2x - 3 = 5 \\Rightarrow x = 4$. $2x - 3 = -5 \\Rightarrow x = -1$. Solution set: $\\mathbf{\\{-1, \\, 4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">Solve $|x| = |3 - x|$.<br><br><em>Answer:</em> Case 1: $x = 3 - x \\Rightarrow 2x = 3 \\Rightarrow x = \\tfrac{3}{2}$. Case 2: $x = -(3 - x) = x - 3 \\Rightarrow 0 = -3$. False — no solution from Case 2. Solution set: $\\mathbf{\\left\\{\\tfrac{3}{2}\\right\\}}$. <em>Geometric reading: "$x$ is equidistant from 0 and 3" forces $x$ to be the midpoint $\\tfrac{3}{2}$.</em></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3*</div><div class="example-body">Solve $|x| + |x - 3| = 7$.<br><br><em>Answer:</em> Critical points 0 and 3. Three intervals.<br>$x &lt; 0$: $-x + 3 - x = 7 \\Rightarrow -2x = 4 \\Rightarrow x = -2$. In interval ✓.<br>$0 \\le x &lt; 3$: $x + 3 - x = 3$. So $3 = 7$ — false.<br>$x \\ge 3$: $x + x - 3 = 7 \\Rightarrow 2x = 10 \\Rightarrow x = 5$. In interval ✓.<br>Solution set: $\\mathbf{\\{-2, \\, 5\\}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">Solve $x^2 + 2|x| - 8 = 0$.<br><br><em>Answer:</em> Let $u = |x|$: $u^2 + 2u - 8 = 0 \\Rightarrow (u + 4)(u - 2) = 0 \\Rightarrow u = -4$ (reject, $u \\ge 0$) or $u = 2$.<br>Unwrap: $|x| = 2 \\Rightarrow x = \\pm 2$. Solution set: $\\mathbf{\\{-2, \\, 2\\}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5*</div><div class="example-body">Solve $|x - 1| = 2x + 3$ (with the domain check).<br><br><em>Answer:</em> Domain: $2x + 3 \\ge 0 \\Rightarrow x \\ge -\\tfrac{3}{2}$.<br>Case 1: $x - 1 = 2x + 3 \\Rightarrow x = -4$. Reject — outside domain.<br>Case 2: $x - 1 = -(2x + 3) = -2x - 3 \\Rightarrow 3x = -2 \\Rightarrow x = -\\tfrac{2}{3}$. Domain ✓.<br>Verify: $|\\!-\\!\\tfrac{2}{3} - 1| = \\tfrac{5}{3}$; $2(-\\tfrac{2}{3}) + 3 = \\tfrac{5}{3}$. ✓<br>Solution: $\\mathbf{x = -\\tfrac{2}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — quick geometric problem</div><div class="example-body">For what values of $a$ does the equation $|x - 4| = a$ have exactly one solution?<br><br><em>Answer:</em> Two solutions when $a &gt; 0$. Zero solutions when $a &lt; 0$. <strong>Exactly one</strong> solution only when $a = 0$ (the two cases collapse). Answer: $\\mathbf{a = 0}$.</div></div>

<div class="think-box"><div class="think-label">FINAL TAKEAWAYS</div><div class="think-body"><strong>(1)</strong> $|x|$ is distance from zero; always non-negative. <strong>(2)</strong> $|f(x)| = c$ splits into $f = c$ and $f = -c$ when $c \\ge 0$; no solution if $c &lt; 0$. <strong>(3)</strong> $|f| = |g|$ splits into $f = g$ and $f = -g$. <strong>(4)</strong> $|f| = g$ requires the domain check $g \\ge 0$ on every candidate. <strong>(5)</strong> Multi-modulus equations: partition the real line at critical points, drop bars on each interval, solve, keep in-interval roots. <strong>(6)</strong> Quadratic-in-modulus: substitute $u = |x|$, require $u \\ge 0$. <strong>(7)</strong> Geometric reading ($|x - a|$ = distance from $a$) is your fastest shortcut on multiple-choice questions.</div></div>
`,

/* ============================================================
   TÜRKÇE VERSİYON
   ============================================================ */
tr: `<p class="l-text"><strong>Mutlak değer, matematiğin en basit fonksiyonu olmasına rağmen öğrencilerin YKS'de hâlâ en çok yanlış yaptığı konudur.</strong> Tanımı tek satır — $|x|$, sayı doğrusunda $x$'in sıfıra olan uzaklığıdır — yine de bu konuyu içeren denklemler, ikinci derece, kesir ve trigonometriden daha çok puan kaybettirir. Sebep her zaman aynı: öğrenciler "uzaklığın işareti yoktur" gerçeğini unutur, mutlak değer çubuklarını kaldırırken iki durum yerine yalnızca birini alırlar.</p>

<p class="l-text">Bu ders o alışkanlığı kalıcı olarak düzeltir. $|\\,\\cdot\\,|$ ifadesini geometrik bir talimat (uzaklık) olarak okumayı, denklemleri mekanik biçimde iki duruma ayırmayı, çoklu mutlak değerleri reel ekseni aralıklara bölerek birleştirmeyi ve her aday çözümü orijinal denklemde kontrol etmeyi öğreneceksin. Yöntem katı, neredeyse mekanik — sınav stresinde güvenilir olmasının nedeni tam da budur.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$|x|$'in parçalı tanımını ifade etmek ve "sıfıra uzaklık" olarak geometrik yorumlamak</li>
<li>$|f(x)| = c$ denklemini $f(x) = c$ ve $f(x) = -c$ olarak ikiye ayırmak; $c &lt; 0$ olduğunda denklemi reddetmek</li>
<li>$|f(x)| = |g(x)|$ denklemini $f = g$ ve $f = -g$ olarak ikiye ayırmak</li>
<li>$|f(x)| = g(x)$ denkleminde $g(x) \\ge 0$ geçerlilik koşulunu her adayda kontrol etmek</li>
<li>$|x - 1| + |x + 2| = 5$ gibi iç içe mutlak değerleri çözmek için aralık analizini kullanmak</li>
<li>$x^2 - 5|x| + 6 = 0$ türü denklemlerde $u = |x|$ ile ikinci dereceye indirgeme yapmak</li>
</ul>
</div>

<h2 class="lesson-title">1. Mutlak Değer — Tanım ve Geometrik Anlamı</h2>

<div class="calc-highlight"><strong>Bir reel sayının mutlak değeri $|x|$, sayı doğrusunda o sayının sıfıra olan uzaklığıdır.</strong> Uzaklık asla negatif değildir, dolayısıyla her reel $x$ için $|x| \\ge 0$ ve yalnızca $x = 0$ olduğunda $|x| = 0$ olur.</div>

<div class="calc-formula"><div class="formula-label">PARÇALI TANIM</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} \\;\\;\\,x, &amp; x \\ge 0 \\text{ ise} \\\\ -x, &amp; x &lt; 0 \\text{ ise} \\end{cases}$$</div><div class="formula-sub">Pozitif sayılar (ve sıfır) olduğu gibi kalır. Negatif sayıların işareti tersine döner — eksi eksiyi yer ve sonuç pozitif olur.</div></div>

<p class="l-text">Üç hızlı sayısal kontrol. <strong>$|7| = 7$</strong>, çünkü 7 pozitiftir. <strong>$|-7| = 7$</strong>, çünkü kural $x &lt; 0$ olduğunda $-x$ uygulamayı söyler ve $-(-7) = 7$'dir. <strong>$|0| = 0$</strong>. Çıktı, sayının büyüklüğüdür — işaretten arındırılmış hâlidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geometrik okuma</div><div class="card-body">$|x|$, sayı doğrusundaki orijinden $x$ noktasına olan işaretsiz uzaklıktır. $|x - a|$ ise $x$'in $a$ noktasına olan uzaklığıdır.</div></div>
<div class="calc-card"><div class="card-title">Cebirsel okuma</div><div class="card-body">Parçalı bir fonksiyon: sağ yarı-doğruda özdeşlik, sol yarıda negasyon. Her yerde süreklidir ama $x = 0$'da türevlenemez ("köşe" vardır).</div></div>
<div class="calc-card"><div class="card-title">Karekök okuma</div><div class="card-body">$|x| = \\sqrt{x^2}$. Kare işareti yok eder, karekök pozitif kökü alır. İspatlarda ve analize geçişte oldukça kullanışlıdır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l59-vshape-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Klasik V şekli:</strong> $y = |x|$ fonksiyonunun grafiği. İki yarı-doğru — $x \\ge 0$ için $y = x$ ve $x &lt; 0$ için $y = -x$ — orijinde buluşarak bir köşe oluşturur. Grafik her zaman $x$-ekseninin üzerinde (ya da üstünde) durur çünkü $|x| \\ge 0$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var v=-5+10*i/200;xs.push(v);ys.push(Math.abs(v));}
var curve={x:xs,y:ys,mode:'lines',name:'y = |x|',line:{color:'#3b82f6',width:3}};
var vertex={x:[0],y:[0],mode:'markers+text',name:'tepe noktası (0, 0)',marker:{color:'#22c55e',size:12},text:['(0, 0)'],textposition:'bottom right',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-1,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l59-vshape-tr',[curve,vertex],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>$|x - a|$'yı bir uzaklık olarak oku.</strong> $|x - 3|$ ifadesi, $x$'in 3'e olan uzaklığıdır. $|x + 5| = |x - (-5)|$ ifadesi ise $x$'in $-5$'e olan uzaklığıdır. Cebiri uzaklık ifadesine dönüştürmek, sınav stresinde mutlak değerli denklem ve eşitsizlikleri çözmenin en hızlı yoludur.</div>

<h2 class="lesson-title">2. Temel Denklem $|x| = a$</h2>

<div class="calc-highlight"><strong>Sağ tarafın işaretine göre üç durum.</strong> $|x| = a$ denklemi şunu sorar: "Sıfıra $a$ uzaklıkta hangi sayılar vardır?" Cevap tamamen $a$'nın pozitif, sıfır veya negatif olmasına bağlıdır.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DURUM A — $a &gt; 0$</div><div class="compare-item">Sıfıra $a$ uzaklıkta iki sayı vardır: biri sağda ($+a$), biri solda ($-a$).</div><div class="compare-item">Çözüm: $x = a$ veya $x = -a$. Kısaca $x = \\pm a$.</div><div class="compare-item">Örnek: $|x| = 4 \\Rightarrow x \\in \\{-4, 4\\}$.</div></div><div class="compare-col"><div class="compare-title">DURUM B — $a = 0$</div><div class="compare-item">Sadece bir sayı kendine sıfır uzaklıktadır.</div><div class="compare-item">Çözüm: $x = 0$. Tek kök.</div><div class="compare-item">Örnek: $|x| = 0 \\Rightarrow x = 0$.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DURUM C — $a &lt; 0$</div><div class="compare-item">Uzaklık asla negatif olmaz. Hiçbir sayı sıfıra "$-3$ uzaklıkta" olamaz.</div><div class="compare-item">Çözüm kümesi: $\\varnothing$ (boş).</div><div class="compare-item">Örnek: $|x| = -2 \\Rightarrow$ çözüm yok.</div></div><div class="compare-col"><div class="compare-title">Zihinsel kontrol</div><div class="compare-item">Cebire başlamadan önce sağ tarafa bir göz at. Negatif bir <em>sabit</em> ise $\\varnothing$ yaz ve geç. Zamanı koru.</div><div class="compare-item">Sağ taraf $x$'e bağlı bir <em>ifade</em> ise (sabit değilse) bu hızlı yöntem uygulanmaz — yine de durumlara ayırıp doğrulamak gerekir (bölüm 6).</div></div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$|x| = 7$ denklemini çöz.<br><br>$a = 7 &gt; 0$, dolayısıyla $x = 7$ veya $x = -7$.<br><br>Çözüm kümesi: $\\mathbf{\\{-7, \\, 7\\}}$.</div></div>

<h2 class="lesson-title">3. İfade Eşittir Sabit: $|f(x)| = c$</h2>

<div class="calc-highlight"><strong>Ayırma kuralı.</strong> Bir ifadenin mutlak değeri, negatif olmayan bir sabite eşit olduğunda, ifadenin kendisi ya $+c$ ya da $-c$ olur. İki sıradan denklem, bir mutlak değerli denklemin yerini alır.</div>

<div class="calc-formula"><div class="formula-label">AYIRMA KURALI</div><div class="formula-main">$$|f(x)| = c \\;\\;\\Longleftrightarrow\\;\\; f(x) = c \\;\\text{ veya }\\; f(x) = -c \\qquad (c \\ge 0)$$</div><div class="formula-sub">$c &lt; 0$ ise çözüm yok. $c = 0$ ise iki durum birleşip tek bir $f(x) = 0$ denklemine dönüşür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$|2x - 3| = 5$ denklemini çöz.<br><br>İki duruma ayır:<br>Durum 1: $2x - 3 = 5 \\;\\Rightarrow\\; 2x = 8 \\;\\Rightarrow\\; x = 4$.<br>Durum 2: $2x - 3 = -5 \\;\\Rightarrow\\; 2x = -2 \\;\\Rightarrow\\; x = -1$.<br><br>Kontrol (her zaman!): $|2 \\cdot 4 - 3| = |5| = 5$. $|2 \\cdot (-1) - 3| = |-5| = 5$. İkisi de geçerli.<br><br>Çözüm kümesi: $\\mathbf{\\{-1, \\, 4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$|3x + 1| = 10$ denklemini çöz.<br><br>Durum 1: $3x + 1 = 10 \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3$.<br>Durum 2: $3x + 1 = -10 \\;\\Rightarrow\\; 3x = -11 \\;\\Rightarrow\\; x = -\\tfrac{11}{3}$.<br><br>Çözüm kümesi: $\\mathbf{\\left\\{-\\tfrac{11}{3}, \\, 3\\right\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 — çözüm yok</div><div class="example-body">$|5x - 2| = -4$ denklemini çöz.<br><br>Sağ taraf negatif. Hiçbir mutlak değer negatif bir sayıya eşit olamaz.<br><br>Çözüm kümesi: $\\mathbf{\\varnothing}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4 — $c = 0$ özel durumu</div><div class="example-body">$|4x + 8| = 0$ denklemini çöz.<br><br>$4x + 8 = 0$ ve $4x + 8 = -0$ durumları özdeş. Dolayısıyla $4x = -8 \\;\\Rightarrow\\; x = -2$.<br><br>Çözüm: $\\mathbf{x = -2}$ (tek kök, çift değil).</div></div>

<div class="think-box"><div class="think-label">SIK YAPILAN BİR HATA</div><div class="think-body">Bazı öğrenciler "çubukları kaldırıp" yalnızca $2x - 3 = 5$ yazar ve durum 2'yi unutur. Bu, cevabın yarısını kaybettirir. Çözmeye başlamadan önce her iki durumu da kâğıda yaz, böylece birini unutamazsın.</div></div>

<h2 class="lesson-title">4. İki Mutlak Değer: $|f(x)| = |g(x)|$</h2>

<div class="calc-highlight"><strong>İki mutlak değer eşit olduğunda, içerideki ifadeler ya birbirine eşit ya da birbirinin negatifidir.</strong> Çözülecek iki yeni denklem; her aday orijinal denklemde mutlaka kontrol edilmelidir.</div>

<div class="calc-formula"><div class="formula-label">İKİ TARAFLI AYRIŞTIRMA</div><div class="formula-main">$$|f(x)| = |g(x)| \\;\\;\\Longleftrightarrow\\;\\; f(x) = g(x) \\;\\text{ veya }\\; f(x) = -g(x)$$</div><div class="formula-sub">Burada "çözüm yok" alt-durumu yoktur — her iki mutlak değer de otomatik olarak negatif olmadığı için denklem her reel $x$ için anlamlıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$|x + 1| = |2x - 4|$ denklemini çöz.<br><br>Durum 1 (içler eşit): $x + 1 = 2x - 4 \\;\\Rightarrow\\; 5 = x$.<br>Durum 2 (içler zıt): $x + 1 = -(2x - 4) \\;\\Rightarrow\\; x + 1 = -2x + 4 \\;\\Rightarrow\\; 3x = 3 \\;\\Rightarrow\\; x = 1$.<br><br>Kontrol: $|5 + 1| = 6$ ve $|2 \\cdot 5 - 4| = 6$. $|1 + 1| = 2$ ve $|2 \\cdot 1 - 4| = 2$. İkisi de geçerli.<br><br>Çözüm kümesi: $\\mathbf{\\{1, \\, 5\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$|3x - 2| = |x + 4|$ denklemini çöz.<br><br>Durum 1: $3x - 2 = x + 4 \\;\\Rightarrow\\; 2x = 6 \\;\\Rightarrow\\; x = 3$.<br>Durum 2: $3x - 2 = -(x + 4) \\;\\Rightarrow\\; 3x - 2 = -x - 4 \\;\\Rightarrow\\; 4x = -2 \\;\\Rightarrow\\; x = -\\tfrac{1}{2}$.<br><br>Çözüm kümesi: $\\mathbf{\\left\\{-\\tfrac{1}{2}, \\, 3\\right\\}}$.</div></div>

<div class="l-note"><strong>Neden iki durum, dört değil?</strong> İlk bakışta dört işaret kombinasyonu varmış gibi ($\\pm f = \\pm g$) görünür ama $f = g$ ile $-f = -g$ aynıdır, $f = -g$ ile $-f = g$ aynıdır. Dört durum ikiye iner.</div>

<h2 class="lesson-title">5. Denklem Değişkene Bağlı: $|f(x)| = g(x)$</h2>

<div class="calc-highlight"><strong>Kritik fark:</strong> sağ taraf artık sabit değil, $x$'e bağlı. Sol taraf negatif olamayacağına göre, sağ tarafın da negatif olmaması gerekir: <strong>her çözüm $g(x) \\ge 0$ koşulunu sağlamalıdır.</strong> Bu kontrolü unutursan sahte çözümler listene girer.</div>

<div class="calc-formula"><div class="formula-label">YÖNTEM</div><div class="formula-main">$$|f(x)| = g(x) \\;\\;\\Longleftrightarrow\\;\\; \\big[\\,f(x) = g(x) \\;\\text{ veya }\\; f(x) = -g(x)\\,\\big] \\;\\text{ VE } g(x) \\ge 0$$</div><div class="formula-sub">İki durumu da çöz, sonra $g(x) &lt; 0$ yapan adayları ele.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$|x - 2| = x + 1$ denklemini çöz.<br><br><strong>Tanım kümesi:</strong> sağ taraf $\\ge 0$ olmalı, yani $x + 1 \\ge 0 \\;\\Rightarrow\\; x \\ge -1$.<br><br>Durum 1: $x - 2 = x + 1 \\;\\Rightarrow\\; -2 = 1$. Yanlış. Bu durumdan çözüm yok.<br>Durum 2: $x - 2 = -(x + 1) = -x - 1 \\;\\Rightarrow\\; 2x = 1 \\;\\Rightarrow\\; x = \\tfrac{1}{2}$.<br><br><strong>Tanım kontrolü:</strong> $x = \\tfrac{1}{2} \\ge -1$. ✓<br><br>Orijinalde doğrula: $|\\tfrac{1}{2} - 2| = |\\!-\\!\\tfrac{3}{2}| = \\tfrac{3}{2}$ ve $\\tfrac{1}{2} + 1 = \\tfrac{3}{2}$. ✓<br><br>Çözüm: $\\mathbf{x = \\tfrac{1}{2}}$.</div></div>

<div class="calc-graph"><div id="plot-l59-cross-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Geometrik görüntü:</strong> $y = |x - 2|$ (tepe noktası $(2, 0)$'da olan V şekli) ve $y = x + 1$ (eğimi 1, $y$-ekseni kesim noktası 1 olan doğru) grafikleri. Tam olarak $x = \\tfrac{1}{2}$ noktasında bir kez kesişiyorlar. İkinci olası kesişim noktası ortaya çıkmıyor çünkü doğru, V'nin sağ kolunun üstüne hiçbir zaman ulaşmıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var v1=[];var v2=[];for(var i=0;i<=200;i++){var v=-2+8*i/200;xs.push(v);v1.push(Math.abs(v-2));v2.push(v+1);}
var fA={x:xs,y:v1,mode:'lines',name:'y = |x − 2|',line:{color:'#3b82f6',width:3}};
var fB={x:xs,y:v2,mode:'lines',name:'y = x + 1',line:{color:'#f59e0b',width:3}};
var sol={x:[0.5],y:[1.5],mode:'markers+text',name:'çözüm',marker:{color:'#22c55e',size:13},text:['x = 1/2'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-1,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l59-cross-tr',[fA,fB,sol],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 — bir aday eleniyor</div><div class="example-body">$|x - 1| = 2x + 3$ denklemini çöz.<br><br><strong>Tanım kümesi:</strong> $2x + 3 \\ge 0 \\;\\Rightarrow\\; x \\ge -\\tfrac{3}{2}$.<br><br>Durum 1: $x - 1 = 2x + 3 \\;\\Rightarrow\\; -4 = x$. Tanım kontrolü: $-4 \\ge -\\tfrac{3}{2}$? <strong>Hayır.</strong> Ele.<br>Durum 2: $x - 1 = -(2x + 3) = -2x - 3 \\;\\Rightarrow\\; 3x = -2 \\;\\Rightarrow\\; x = -\\tfrac{2}{3}$. Tanım kontrolü: $-\\tfrac{2}{3} \\ge -\\tfrac{3}{2}$? <strong>Evet.</strong> Tut.<br><br>Doğrula: $|\\!-\\!\\tfrac{2}{3} - 1| = |\\!-\\!\\tfrac{5}{3}| = \\tfrac{5}{3}$ ve $2 \\cdot (-\\tfrac{2}{3}) + 3 = -\\tfrac{4}{3} + 3 = \\tfrac{5}{3}$. ✓<br><br>Çözüm: $\\mathbf{x = -\\tfrac{2}{3}}$. (Durum 1'in kökü $x = -4$ sahte — ayrıştırılmış denklemi sağlıyor ama orijinalde sağ tarafı negatife düşürüyor.)</div></div>

<h2 class="lesson-title">6. Aralık Analizi: $|f| + |g| = c$</h2>

<div class="calc-highlight"><strong>Tek bir denklemde iki veya daha fazla mutlak değer göründüğünde, en güvenli yöntem reel ekseni her mutlak değerin işaretinin bilindiği aralıklara bölmek, her aralıkta çubukları kaldırmak ve ortaya çıkan doğrusal denklemi çözmektir.</strong></div>

<p class="l-text">$|h(x)|$ için "işaret değiştirme noktası" (ya da <em>kritik nokta</em>), iç ifadenin sıfır olduğu yerdir; yani $h(x) = 0$. Bu noktanın sağında $h$ pozitiftir ve $|h| = h$; solunda negatiftir ve $|h| = -h$. Birden fazla mutlak değer varsa her kritik noktayı sayı doğrusuna işaretle ve aralara bak.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — klasik iki mutlak değer</div><div class="example-body">$|x - 1| + |x + 2| = 5$ denklemini çöz.<br><br><strong>Adım 1 — kritik noktaları bul:</strong> $x - 1 = 0$ noktası $x = 1$; $x + 2 = 0$ noktası $x = -2$. Sayı doğrusunda $-2$ ve $1$ noktalarını işaretle. Üç aralık oluşur.<br><br><strong>Adım 2 — her aralıkta her modülü yeniden yaz:</strong><br>
<table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin:0.8rem 0">
<thead><tr style="background:rgba(59,130,246,0.1)"><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">Aralık</th><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">$|x - 1|$</th><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">$|x + 2|$</th><th style="padding:0.4rem 0.6rem;text-align:left;color:#3b82f6">Toplam</th></tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.4rem 0.6rem">$x &lt; -2$</td><td style="padding:0.4rem 0.6rem">$-(x - 1) = 1 - x$</td><td style="padding:0.4rem 0.6rem">$-(x + 2) = -x - 2$</td><td style="padding:0.4rem 0.6rem">$-2x - 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.4rem 0.6rem">$-2 \\le x &lt; 1$</td><td style="padding:0.4rem 0.6rem">$1 - x$</td><td style="padding:0.4rem 0.6rem">$x + 2$</td><td style="padding:0.4rem 0.6rem">$3$ (sabit!)</td></tr>
<tr><td style="padding:0.4rem 0.6rem">$x \\ge 1$</td><td style="padding:0.4rem 0.6rem">$x - 1$</td><td style="padding:0.4rem 0.6rem">$x + 2$</td><td style="padding:0.4rem 0.6rem">$2x + 1$</td></tr>
</tbody></table>
<strong>Adım 3 — her doğrusal denklemi çöz, yalnızca ait olduğu aralıkta kalan kökleri tut:</strong><br>
$x &lt; -2$ aralığı: $-2x - 1 = 5 \\Rightarrow x = -3$. Kontrol $-3 &lt; -2$? Evet. ✓<br>
$-2 \\le x &lt; 1$ aralığı: $3 = 5$. Yanlış — bu dilimden çözüm yok.<br>
$x \\ge 1$ aralığı: $2x + 1 = 5 \\Rightarrow x = 2$. Kontrol $2 \\ge 1$? Evet. ✓<br><br>
Çözüm kümesi: $\\mathbf{\\{-3, \\, 2\\}}$.</div></div>

<div class="calc-graph"><div id="plot-l59-twomod-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Parçalı görüntü:</strong> $f(x) = |x - 1| + |x + 2|$ fonksiyonu $x = -2$ ve $x = 1$'de köşeleri olan parçalı doğrusal bir fonksiyondur. Köşeler arasında sabit $f = 3$ değerini alır. Dışarıda $\\pm 2$ eğimle büyür. $y = 5$ yatay doğrusu grafiği tam iki noktada keser: $x = -3$ ve $x = 2$ — cebirsel cevapla aynı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var v=-6+12*i/300;xs.push(v);ys.push(Math.abs(v-1)+Math.abs(v+2));}
var f={x:xs,y:ys,mode:'lines',name:'y = |x − 1| + |x + 2|',line:{color:'#3b82f6',width:3}};
var hLine={x:[-6,6],y:[5,5],mode:'lines',name:'y = 5',line:{color:'#f59e0b',width:2,dash:'dash'}};
var sols={x:[-3,2],y:[5,5],mode:'markers+text',name:'çözümler',marker:{color:'#22c55e',size:13},text:['x = −3','x = 2'],textposition:'top center',textfont:{color:'#22c55e',size:12}};
var corners={x:[-2,1],y:[3,3],mode:'markers+text',name:'köşeler',marker:{color:'#ef4444',size:9},text:['köşe','köşe'],textposition:'bottom center',textfont:{color:'#ef4444',size:10}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[0,11],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l59-twomod-tr',[f,hLine,sols,corners],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Düz orta dilim.</strong> $|x - 1| + |x + 2|$ ifadesi $[-2, 1]$ aralığındaki her $x$ için sabit ($= 3$) kalır. Geometrik olarak bu, $x$'in 1'e olan uzaklığı ile $-2$'ye olan uzaklığının toplamıdır. $x$ ikisi arasındayken toplam, $-2$ ile $1$ arasındaki boşluk olan 3'tür — $x$'in nerede olduğundan bağımsız. Bu, üçgen eşitsizliğinin pratikteki halidir.</div>

<h2 class="lesson-title">7. Geometrik Yorum: Uzaklık</h2>

<div class="calc-highlight"><strong>Cebiri uzaklık diline çevir.</strong> $|x - a| = d$ denklemi düpedüz şunu söyler: "$x$ noktası, $a$ noktasına $d$ uzaklıktadır." Bu da anında geometrik çözüm verir: iki nokta $a + d$ ve $a - d$.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$|x - 3| = 5$</div><div class="card-body">"$x$, 3'e 5 birim uzaklıkta." Dolayısıyla $x = 3 + 5 = 8$ veya $x = 3 - 5 = -2$.</div></div>
<div class="calc-card"><div class="card-title">$|x + 4| = 7$</div><div class="card-body">$|x - (-4)| = 7$ olarak yeniden yaz. "$x$, $-4$'e 7 birim uzaklıkta." Dolayısıyla $x = -4 + 7 = 3$ veya $x = -4 - 7 = -11$.</div></div>
<div class="calc-card"><div class="card-title">$|x - 1| + |x + 2| = 5$</div><div class="card-body">"$x$'in 1'e uzaklığı artı $x$'in $-2$'ye uzaklığı 5'tir." İki uç nokta $-2$ ve $1$ arasındaki mesafe zaten 3 birim. Toplamda 5 lazım, dolayısıyla $x$, $-2$'nin 1 birim solunda ($x = -3$) ya da $1$'in 1 birim sağında ($x = 2$) durur.</div></div>
</div>

<p class="l-text">Bu yöntem, çoktan seçmeli sınavlarda oldukça hızlıdır. Cebiri bir uzaklık sorusu gibi oku, hızlı bir sayı doğrusu çiz ve cevabı yaz. Cebir güvenlik ağı, geometri ise kestirme yoldur.</p>

<h2 class="lesson-title">8. İkinci Derece-Mutlak Değer: $u = |x|$ Dönüşümü</h2>

<div class="calc-highlight"><strong>Denklem $x^2$ ve $|x|$ içeriyor ama düz $x$ içermiyorsa, $u = |x|$ koy.</strong> $x^2 = |x|^2 = u^2$ olduğundan denklem sıradan bir ikinci dereceye dönüşür. $u \\ge 0$ kısıtıyla çöz, sonra $x$'e geri aç.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$x^2 - 5|x| + 6 = 0$ denklemini çöz.<br><br>$u = |x|$ olsun; $x^2 = u^2$:<br>$u^2 - 5u + 6 = 0 \\;\\Rightarrow\\; (u - 2)(u - 3) = 0 \\;\\Rightarrow\\; u = 2 \\;\\text{ veya }\\; u = 3$.<br><br>Her ikisi de $\\ge 0$, dolayısıyla her ikisi de geçerli modül. Şimdi $x$'e dön:<br>$|x| = 2 \\;\\Rightarrow\\; x = \\pm 2$.<br>$|x| = 3 \\;\\Rightarrow\\; x = \\pm 3$.<br><br>Çözüm kümesi: $\\mathbf{\\{-3, \\, -2, \\, 2, \\, 3\\}}$ — toplamda dört çözüm.</div></div>

<div class="l-note"><strong>$u$'yu çözdükten sonra mutlaka $u \\ge 0$ kontrolü yap.</strong> Negatif bir $u$, "$|x|$ negatif bir sayıya eşit" demek olur — imkânsız. Ele.</div>

<h2 class="lesson-title">9. Problem — Tolerans Sınırları</h2>

<div class="calc-highlight"><strong>Mutlak değer; fizikte, mühendislikte ve kalite kontrolde "hata" ve "tolerans" için doğal dildir.</strong> "Ölçülen değer, hedeften en çok 0.5 mm sapıyor" ifadesi doğrudan $|x - \\mu| \\le 0.5$ olarak yazılır.</div>

<p class="l-text"><strong>Problem.</strong> Bir şişeleme makinesi her şişeye 500 ml su doldurmaya ayarlı. Kalite kontrol, gerçek miktarı 500 ml'den en fazla 8 ml sapan şişeleri kabul ediyor. Az önce reddedilen bir şişe, sınırı tam 1 ml aşmış. Bu şişenin gerçek içerikleri ne olabilir?</p>

<p class="l-text"><strong>Kurulum.</strong> $x$ gerçek miktar olsun. Kabul koşulu $|x - 500| \\le 8$. "Tam sınırı 1 ml aştı" demek $|x - 500| = 8 + 1 = 9$.</p>

<p class="l-text"><strong>Çöz.</strong> $|x - 500| = 9 \\Rightarrow x - 500 = 9$ veya $x - 500 = -9$, yani $x = 509$ ml veya $x = 491$ ml.</p>

<p class="l-text"><strong>Cevap.</strong> Reddedilen şişe ya <strong>509 ml</strong> (fazla) ya da <strong>491 ml</strong> (az) içeriyordu.</p>

<h2 class="lesson-title">10. Sık Yapılan Hatalar — Alan Rehberi</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hata 1 — Durum 2'yi unutmak</div><div class="card-body">$|2x - 3| = 5$ denkleminde sadece $2x - 3 = 5$ yazıp durmak. Çözmeye başlamadan her iki durumu da yaz; ayırmadan çözme.</div></div>
<div class="calc-card"><div class="card-title">Hata 2 — çubukları erken kaldırmak</div><div class="card-body">"$|x - 4|$ zaten $x - 4$" ifadesi yalnızca $x \\ge 4$ için doğrudur. $x &lt; 4$ için $-(x - 4) = 4 - x$ kullanmak zorundasın. Önce kritik noktayı işaretle.</div></div>
<div class="calc-card"><div class="card-title">Hata 3 — tanım kontrolünü atlamak</div><div class="card-body">$|f(x)| = g(x)$ denkleminde her aday $g(x) \\ge 0$ olmalı. Kontrol etmemek hayalet çözümler üretir.</div></div>
<div class="calc-card"><div class="card-title">Hata 4 — aralık dışı kökleri tutmak</div><div class="card-body">Aralık analizinde, $I$ aralığında bulduğun ama $I$'nin dışına düşen bir kök o aralık için geçersizdir. Adayı aralık sınırlarıyla karşılaştır.</div></div>
<div class="calc-card"><div class="card-title">Hata 5 — $|f| = $ negatif çözmek</div><div class="card-body">$|f(x)| = -7$ çözümsüzdür. Cebirle vakit harcama. $\\varnothing$ yaz ve geç.</div></div>
<div class="calc-card"><div class="card-title">Hata 6 — körü körüne kare almak</div><div class="card-body">$|f| = g$ denkleminin iki tarafının karesini alırsan $f^2 = g^2$ olur ki bu $|f| = |g|$'ye denktir — orijinale değil. Sahte kökler doğar; her birini orijinal denklemde sınamak zorundasın.</div></div>
</div>

<h2 class="lesson-title">11. Alıştırmalar</h2>

<div class="calc-highlight">Altı çözümlü alıştırma. Cevabı elinle kapat, önce kâğıt-kalemle dene. Yıldızlı (*) olanlar daha zor.</div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">$|2x - 3| = 5$ denklemini çöz.<br><br><em>Cevap:</em> $2x - 3 = 5 \\Rightarrow x = 4$. $2x - 3 = -5 \\Rightarrow x = -1$. Çözüm kümesi: $\\mathbf{\\{-1, \\, 4\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">$|x| = |3 - x|$ denklemini çöz.<br><br><em>Cevap:</em> Durum 1: $x = 3 - x \\Rightarrow 2x = 3 \\Rightarrow x = \\tfrac{3}{2}$. Durum 2: $x = -(3 - x) = x - 3 \\Rightarrow 0 = -3$. Yanlış — Durum 2'den çözüm yok. Çözüm kümesi: $\\mathbf{\\left\\{\\tfrac{3}{2}\\right\\}}$. <em>Geometrik okuma: "$x$, 0 ve 3'e eşit uzaklıkta" demek $x$'i ortadaki nokta $\\tfrac{3}{2}$'ye sabitler.</em></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3*</div><div class="example-body">$|x| + |x - 3| = 7$ denklemini çöz.<br><br><em>Cevap:</em> Kritik noktalar 0 ve 3. Üç aralık.<br>$x &lt; 0$: $-x + 3 - x = 7 \\Rightarrow -2x = 4 \\Rightarrow x = -2$. Aralıkta ✓.<br>$0 \\le x &lt; 3$: $x + 3 - x = 3$. $3 = 7$ yanlış.<br>$x \\ge 3$: $x + x - 3 = 7 \\Rightarrow 2x = 10 \\Rightarrow x = 5$. Aralıkta ✓.<br>Çözüm kümesi: $\\mathbf{\\{-2, \\, 5\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">$x^2 + 2|x| - 8 = 0$ denklemini çöz.<br><br><em>Cevap:</em> $u = |x|$: $u^2 + 2u - 8 = 0 \\Rightarrow (u + 4)(u - 2) = 0 \\Rightarrow u = -4$ (ele, $u \\ge 0$) veya $u = 2$.<br>Geri aç: $|x| = 2 \\Rightarrow x = \\pm 2$. Çözüm kümesi: $\\mathbf{\\{-2, \\, 2\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5*</div><div class="example-body">$|x - 1| = 2x + 3$ denklemini çöz (tanım kontrolüyle).<br><br><em>Cevap:</em> Tanım: $2x + 3 \\ge 0 \\Rightarrow x \\ge -\\tfrac{3}{2}$.<br>Durum 1: $x - 1 = 2x + 3 \\Rightarrow x = -4$. Ele — tanım dışı.<br>Durum 2: $x - 1 = -(2x + 3) = -2x - 3 \\Rightarrow 3x = -2 \\Rightarrow x = -\\tfrac{2}{3}$. Tanım ✓.<br>Doğrula: $|\\!-\\!\\tfrac{2}{3} - 1| = \\tfrac{5}{3}$; $2(-\\tfrac{2}{3}) + 3 = \\tfrac{5}{3}$. ✓<br>Çözüm: $\\mathbf{x = -\\tfrac{2}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — hızlı geometrik soru</div><div class="example-body">$|x - 4| = a$ denkleminin tam olarak bir çözümü olması için $a$ ne olmalı?<br><br><em>Cevap:</em> $a &gt; 0$ ise iki çözüm. $a &lt; 0$ ise çözüm yok. <strong>Tek çözüm</strong> ancak $a = 0$ olursa (iki durum birleşir). Cevap: $\\mathbf{a = 0}$.</div></div>

<div class="think-box"><div class="think-label">BU DERSTEN ÇIKAR</div><div class="think-body"><strong>(1)</strong> $|x|$, sıfıra uzaklık; her zaman negatif olmayan. <strong>(2)</strong> $|f(x)| = c$, $c \\ge 0$ iken $f = c$ ve $f = -c$ olarak ayrışır; $c &lt; 0$ ise çözüm yok. <strong>(3)</strong> $|f| = |g|$, $f = g$ ve $f = -g$ olarak ayrışır. <strong>(4)</strong> $|f| = g$ için her adayda $g \\ge 0$ tanım kontrolü zorunlu. <strong>(5)</strong> Çoklu mutlak değer: reel ekseni kritik noktalarda böl, her aralıkta çubukları kaldır, çöz, aralık içindeki kökleri tut. <strong>(6)</strong> İkinci dereceli mutlak değer: $u = |x|$ koy, $u \\ge 0$ koşulunu uygula. <strong>(7)</strong> Geometrik okuma ($|x - a|$ = $a$'ya uzaklık), çoktan seçmeli sorularda en hızlı kestirme yoldur.</div></div>
`
};
