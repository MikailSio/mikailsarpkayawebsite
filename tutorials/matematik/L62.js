window.LISE_MAT_L62 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>An absolute-value inequality is a question about distance.</strong> Where the equation $|x - a| = c$ asked "which points are exactly $c$ units from $a$?", the inequality $|x - a| &lt; c$ asks "which points are <em>closer</em> than $c$ to $a$?" and $|x - a| &gt; c$ asks "which points are <em>farther</em> than $c$ from $a$?" The answer is no longer two isolated numbers but a continuous region of the number line — an interval, or the union of two rays. Reading the geometry first is faster than memorising algebraic rules.</p>

<p class="l-text">This lesson teaches you to translate any absolute-value inequality into either a double inequality ($-c &lt; \\text{stuff} &lt; c$) or a pair of one-sided inequalities ($\\text{stuff} &lt; -c$ or $\\text{stuff} &gt; c$), then solve each piece with the same techniques you already know from lesson 52. We also handle the trickier cases where the right-hand side is itself an expression in $x$, where you have to either square both sides or split into intervals and check the domain. These appear on the YKS (TYT/AYT) every single year — master the rules now and the rest is mechanical.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read $|x| &lt; a$ and $|x| &gt; a$ as distance questions, and convert each into ordinary inequalities</li>
<li>Solve $|ax + b| &lt; c$ by writing the double inequality $-c &lt; ax + b &lt; c$</li>
<li>Solve $|ax + b| &gt; c$ as the union $ax + b &lt; -c$ <em>or</em> $ax + b &gt; c$</li>
<li>Handle the edge cases $|f(x)| &lt; 0$ (no solution), $|f(x)| \\ge 0$ (always true), and $|f(x)| \\le 0$ (only the zero)</li>
<li>Compare two absolute values $|f(x)| &lt; |g(x)|$ by squaring both sides, and compare $|f(x)| &lt; g(x)$ with a careful domain check</li>
<li>Use the triangle inequality $|a + b| \\le |a| + |b|$ and apply tolerance-style word problems from manufacturing and measurement</li>
</ul>
</div>

<h2 class="lesson-title">1. Recall: Absolute Value Is Distance</h2>

<div class="calc-highlight"><strong>The absolute value $|x|$ of a real number is its distance from zero on the number line.</strong> Distance is never negative, so $|x| \\ge 0$ for every $x$. Sign disappears: $|+7| = 7$ and $|-7| = 7$. More generally, $|x - a|$ is the distance from $x$ to $a$ — exactly the picture every inequality in this lesson will exploit.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} x, &amp; x \\ge 0 \\\\ -x, &amp; x &lt; 0 \\end{cases} \\qquad\\text{and}\\qquad |x - a| \\;=\\; \\text{distance from } x \\text{ to } a$$</div><div class="formula-sub">Two equivalent views — algebraic (piecewise) and geometric (distance). Both will be used; the geometric one is faster on inequalities.</div></div>

<p class="l-text">A few baseline facts you should never need to re-derive:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Always non-negative</div><div class="card-body">$|x| \\ge 0$ for every real $x$. Equality $|x| = 0$ holds only at $x = 0$.</div></div>
<div class="calc-card"><div class="card-title">Symmetric</div><div class="card-body">$|-x| = |x|$. Reflecting across zero does not change distance.</div></div>
<div class="calc-card"><div class="card-title">Multiplicative</div><div class="card-body">$|xy| = |x| \\cdot |y|$ and $\\left|\\dfrac{x}{y}\\right| = \\dfrac{|x|}{|y|}$ (for $y \\ne 0$). Distance plays nicely with multiplication and division.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">What is $|x - 3|$ when $x = 7$? Distance from 7 to 3 is 4. What about $x = -1$? Distance from $-1$ to 3 is 4. So $|x - 3| = 4$ has <em>two</em> solutions, $x = 7$ and $x = -1$. Now: what are all the $x$ whose distance from 3 is <em>less than</em> 4? Geometrically: the open interval $(-1, 7)$. That is the entire content of section 2.</div></div>

<h2 class="lesson-title">2. The Inequality $|x| &lt; a$ (with $a &gt; 0$)</h2>

<div class="calc-highlight"><strong>Geometric reading:</strong> "the points whose distance from $0$ is less than $a$." Those are exactly the points strictly between $-a$ and $a$. So $|x| &lt; a$ is the same as $-a &lt; x &lt; a$. The solution is an open interval of length $2a$ centred at zero.</div>

<div class="calc-formula"><div class="formula-label">THE RULE</div><div class="formula-main">$$|x| &lt; a \\;\\;\\Longleftrightarrow\\;\\; -a &lt; x &lt; a \\qquad (a &gt; 0)$$</div><div class="formula-sub">For $\\le$ the inequalities become $\\le$ as well and the interval is closed: $|x| \\le a \\Leftrightarrow -a \\le x \\le a$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|x| &lt; 3$.<br><br>Geometric reading: distance from $0$ is less than $3$. So $-3 &lt; x &lt; 3$.<br><br>Solution set: $\\mathbf{(-3, \\, 3)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|x| \\le 5$.<br><br>Distance from $0$ is at most $5$. So $-5 \\le x \\le 5$.<br><br>Solution set: $\\mathbf{[-5, \\, 5]}$ — the closed interval, endpoints included.</div></div>

<div class="calc-graph"><div id="plot-l62-less-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $y = |x|$ in blue together with the horizontal line $y = 3$ in amber. The solution of $|x| &lt; 3$ is exactly the set of $x$-values where the V-curve sits <em>below</em> the line — the open interval $(-3, 3)$, shaded green. The two boundary points $x = \\pm 3$ are excluded (open circles).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var v=-6+12*i/200;xs.push(v);ys.push(Math.abs(v));}
var curve={x:xs,y:ys,mode:'lines',name:'y = |x|',line:{color:'#3b82f6',width:3}};
var hLine={x:[-6,6],y:[3,3],mode:'lines',name:'y = 3',line:{color:'#f59e0b',width:2,dash:'dash'}};
var shadeX=[];var shadeY=[];for(var j=0;j<=80;j++){var v2=-3+6*j/80;shadeX.push(v2);shadeY.push(Math.abs(v2));}
shadeX.push(3,-3);shadeY.push(3,3);
var shade={x:shadeX,y:shadeY,mode:'lines',fill:'toself',name:'|x| < 3',line:{color:'rgba(34,197,94,0)'},fillcolor:'rgba(34,197,94,0.25)'};
var openL={x:[-3],y:[3],mode:'markers',name:'x = −3 (excluded)',marker:{color:'#0a0a0a',size:14,line:{color:'#22c55e',width:2.5}}};
var openR={x:[3],y:[3],mode:'markers',name:'x = 3 (excluded)',marker:{color:'#0a0a0a',size:14,line:{color:'#22c55e',width:2.5}},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-0.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l62-less-en',[curve,hLine,shade,openL,openR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Watch the inequality direction.</strong> $|x| &lt; a$ produces an <em>AND</em> condition (both $-a &lt; x$ and $x &lt; a$ must hold simultaneously) — that is what the double inequality $-a &lt; x &lt; a$ encodes.</div>

<h2 class="lesson-title">3. The Inequality $|x| &gt; a$ (with $a &gt; 0$)</h2>

<div class="calc-highlight"><strong>Geometric reading:</strong> "the points whose distance from $0$ is greater than $a$." Those are points to the <em>left</em> of $-a$ or to the <em>right</em> of $+a$. So $|x| &gt; a$ becomes $x &lt; -a$ <em>or</em> $x &gt; a$. The solution is the union of two open rays.</div>

<div class="calc-formula"><div class="formula-label">THE RULE</div><div class="formula-main">$$|x| &gt; a \\;\\;\\Longleftrightarrow\\;\\; x &lt; -a \\;\\text{ or }\\; x &gt; a \\qquad (a &gt; 0)$$</div><div class="formula-sub">For $\\ge$ the inequalities become $\\le$ and $\\ge$, so the endpoints are included. In interval notation: $(-\\infty, -a] \\cup [a, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|x| &gt; 4$.<br><br>Distance from $0$ exceeds $4$. So $x &lt; -4$ or $x &gt; 4$.<br><br>Solution set: $\\mathbf{(-\\infty, -4) \\cup (4, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|x| \\ge 2$.<br><br>Distance from $0$ is at least $2$. So $x \\le -2$ or $x \\ge 2$.<br><br>Solution set: $\\mathbf{(-\\infty, -2] \\cup [2, \\infty)}$ — endpoints included.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$|x| &lt; a$ — AND</div><div class="compare-item">One bounded interval $(-a, a)$</div><div class="compare-item">A single double inequality $-a &lt; x &lt; a$</div><div class="compare-item">"Sandwich" picture: $x$ is squeezed between</div><div class="compare-item">Below the horizontal line on the V-graph</div></div><div class="compare-col"><div class="compare-title">$|x| &gt; a$ — OR</div><div class="compare-item">Two unbounded rays $(-\\infty, -a) \\cup (a, \\infty)$</div><div class="compare-item">Two separate one-sided inequalities</div><div class="compare-item">"Outside" picture: $x$ flees away from $0$</div><div class="compare-item">Above the horizontal line on the V-graph</div></div></div>

<h2 class="lesson-title">4. The Edge Cases: $|x| &lt; 0$, $|x| \\ge 0$, $|x| \\le 0$</h2>

<div class="calc-highlight"><strong>Three trivial-looking cases trip up students every year on the YKS.</strong> The right-hand side might be negative, zero, or sign-tagged in a way that makes the inequality either impossible or trivially true. Spot these before doing any algebra.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$|f(x)| &lt; 0$ — never</div><div class="card-body">Absolute value can never be strictly less than zero. Solution set: $\\varnothing$. No work needed.</div></div>
<div class="calc-card"><div class="card-title">$|f(x)| \\ge 0$ — always</div><div class="card-body">Absolute value is always non-negative. Every real $x$ in the domain of $f$ works. Solution set: $\\mathbb{R}$ (or the domain of $f$).</div></div>
<div class="calc-card"><div class="card-title">$|f(x)| \\le 0$ — equals zero</div><div class="card-body">The only way an absolute value is $\\le 0$ is for it to equal $0$. Solve the equation $f(x) = 0$. Solution set: $\\{x : f(x) = 0\\}$.</div></div>
</div>

<div class="calc-example"><div class="example-label">EDGE CASE WORKED — $|x+3| \\le 0$</div><div class="example-body">$|x + 3|$ cannot be negative, so $|x + 3| \\le 0$ forces $|x + 3| = 0$, i.e. $x + 3 = 0$ and $x = -3$.<br><br>Solution set: $\\mathbf{\\{-3\\}}$ — just the single point.</div></div>

<div class="calc-example"><div class="example-label">EDGE CASE WORKED — $|x-1| \\ge -2$</div><div class="example-body">$|x - 1|$ is always $\\ge 0$, which is itself $\\ge -2$. The inequality is therefore <strong>true for every real $x$</strong>.<br><br>Solution set: $\\mathbf{\\mathbb{R}}$.</div></div>

<div class="calc-example"><div class="example-label">EDGE CASE WORKED — $|2x-7| &lt; -5$</div><div class="example-body">No absolute value can be strictly less than a negative number.<br><br>Solution set: $\\mathbf{\\varnothing}$ — no solution at all. No algebra needed.</div></div>

<div class="think-box"><div class="think-label">FIRST GLANCE</div><div class="think-body">Before plunging into algebra, always look at the right-hand side of the inequality. If it is negative, the inequality is either impossible (with $&lt;$ or $\\le$) or trivially true (with $&gt;$ or $\\ge$). Spotting this saves three minutes of pointless work on a five-minute exam question.</div></div>

<h2 class="lesson-title">5. Inequalities of the Form $|ax + b| &lt; c$</h2>

<div class="calc-highlight"><strong>The general "less than" type.</strong> The expression inside the bars is no longer just $x$ but a linear expression $ax + b$. The rule extends without change: $|ax + b| &lt; c$ (with $c &gt; 0$) is the same as $-c &lt; ax + b &lt; c$. Solve the double inequality for $x$ in one go.</div>

<div class="calc-formula"><div class="formula-label">THE EXTENDED RULE</div><div class="formula-main">$$|ax + b| &lt; c \\;\\;\\Longleftrightarrow\\;\\; -c &lt; ax + b &lt; c \\qquad (c &gt; 0)$$</div><div class="formula-sub">Operate on all three parts at once: subtract $b$ from all three, then divide all three by $a$. If $a &lt; 0$, the divide step flips the direction of both inequalities.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|2x - 3| &lt; 5$.<br><br>Write the double inequality: $-5 &lt; 2x - 3 &lt; 5$.<br>Add $3$ to all three parts: $-2 &lt; 2x &lt; 8$.<br>Divide all three parts by $2$ (positive, no flip): $-1 &lt; x &lt; 4$.<br><br>Solution set: $\\mathbf{(-1, \\, 4)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|3x + 1| \\le 7$.<br><br>$-7 \\le 3x + 1 \\le 7$.<br>Subtract $1$: $-8 \\le 3x \\le 6$.<br>Divide by $3$: $-\\dfrac{8}{3} \\le x \\le 2$.<br><br>Solution set: $\\mathbf{\\left[-\\dfrac{8}{3}, \\, 2\\right]}$ — closed, endpoints included.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — negative coefficient inside</div><div class="example-body">Solve $|{-2x} + 5| &lt; 3$.<br><br>$-3 &lt; -2x + 5 &lt; 3$.<br>Subtract $5$: $-8 &lt; -2x &lt; -2$.<br>Divide by $-2$ — <strong>flip both inequalities</strong>: $4 &gt; x &gt; 1$, i.e. $1 &lt; x &lt; 4$.<br><br>Solution set: $\\mathbf{(1, \\, 4)}$. <em>Reminder: any time you divide by a negative number, both inequality signs flip — the same rule from lesson 52.</em></div></div>

<div class="l-note"><strong>Geometric reading.</strong> $|2x - 3| &lt; 5$ says "the distance from $2x$ to $3$ is less than $5$" — equivalently "the distance from $x$ to $\\dfrac{3}{2}$ is less than $\\dfrac{5}{2}$." That is an interval of length $5$ centred at $\\dfrac{3}{2}$ — which matches $(-1, 4)$ exactly. Try the geometric reading first whenever the inside is $x - a$.</div>

<h2 class="lesson-title">6. Inequalities of the Form $|ax + b| &gt; c$</h2>

<div class="calc-highlight"><strong>The general "greater than" type.</strong> Same extension: $|ax + b| &gt; c$ (with $c &gt; 0$) splits into the two one-sided inequalities $ax + b &gt; c$ or $ax + b &lt; -c$. Solve each separately and take the union.</div>

<div class="calc-formula"><div class="formula-label">THE EXTENDED RULE</div><div class="formula-main">$$|ax + b| &gt; c \\;\\;\\Longleftrightarrow\\;\\; ax + b &gt; c \\;\\text{ or }\\; ax + b &lt; -c \\qquad (c &gt; 0)$$</div><div class="formula-sub">Each branch is an ordinary first-degree inequality. Solve them independently; the solution set is the union of the two pieces.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|x + 1| &gt; 4$.<br><br>Split: $x + 1 &gt; 4$ or $x + 1 &lt; -4$.<br>First: $x &gt; 3$. Second: $x &lt; -5$.<br><br>Solution set: $\\mathbf{(-\\infty, -5) \\cup (3, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|2x + 1| \\ge 7$.<br><br>Split: $2x + 1 \\ge 7$ or $2x + 1 \\le -7$.<br>First: $2x \\ge 6 \\;\\Rightarrow\\; x \\ge 3$. Second: $2x \\le -8 \\;\\Rightarrow\\; x \\le -4$.<br><br>Solution set: $\\mathbf{(-\\infty, -4] \\cup [3, \\infty)}$.</div></div>

<div class="calc-graph"><div id="plot-l62-greater-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the V-shaped graph $y = |x + 1|$ (its vertex at $x = -1$) together with the horizontal line $y = 4$. The solution of $|x + 1| &gt; 4$ is exactly the set of $x$-values where the V sits <em>above</em> the line — two unbounded rays $x &lt; -5$ and $x &gt; 3$, both shaded amber. The boundary points $x = -5, 3$ are excluded (open circles).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var v=-9+15*i/200;xs.push(v);ys.push(Math.abs(v+1));}
var curve={x:xs,y:ys,mode:'lines',name:'y = |x + 1|',line:{color:'#3b82f6',width:3}};
var hLine={x:[-9,6],y:[4,4],mode:'lines',name:'y = 4',line:{color:'#f59e0b',width:2,dash:'dash'}};
var leftX=[];var leftY=[];for(var j=0;j<=40;j++){var v2=-9+4*j/40;leftX.push(v2);leftY.push(Math.abs(v2+1));}
leftX.push(-5,-9);leftY.push(4,4);
var leftShade={x:leftX,y:leftY,mode:'lines',fill:'toself',name:'x < −5',line:{color:'rgba(245,158,11,0)'},fillcolor:'rgba(245,158,11,0.22)'};
var rightX=[];var rightY=[];for(var j=0;j<=40;j++){var v3=3+3*j/40;rightX.push(v3);rightY.push(Math.abs(v3+1));}
rightX.push(6,3);rightY.push(4,4);
var rightShade={x:rightX,y:rightY,mode:'lines',fill:'toself',name:'x > 3',line:{color:'rgba(245,158,11,0)'},fillcolor:'rgba(245,158,11,0.22)'};
var openL={x:[-5],y:[4],mode:'markers',name:'x = −5 (excluded)',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:2.5}}};
var openR={x:[3],y:[4],mode:'markers',name:'x = 3 (excluded)',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:2.5}},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-9,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-0.5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l62-greater-en',[curve,hLine,leftShade,rightShade,openL,openR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Common error.</strong> Students sometimes write $|x + 1| &gt; 4$ as $-4 &gt; x + 1 &gt; 4$ — that double inequality is impossible (a single number cannot be both less than $-4$ <em>and</em> greater than $4$). For $&gt;$ you always need an OR split, not an AND sandwich.</div>

<h2 class="lesson-title">7. Comparing Two Absolute Values: $|f(x)| &lt; |g(x)|$</h2>

<div class="calc-highlight"><strong>When both sides are absolute values, we have a clean shortcut: square both sides.</strong> Squaring is valid because both sides are non-negative, and the inequality direction is preserved. The square of $|y|$ is just $y^2$ (the bars vanish), so the problem reduces to comparing two polynomials.</div>

<div class="calc-formula"><div class="formula-label">SQUARING SHORTCUT</div><div class="formula-main">$$|f(x)| &lt; |g(x)| \\;\\;\\Longleftrightarrow\\;\\; f(x)^2 &lt; g(x)^2 \\;\\;\\Longleftrightarrow\\;\\; g(x)^2 - f(x)^2 &gt; 0$$</div><div class="formula-sub">After squaring, factor as a difference of squares: $g^2 - f^2 = (g - f)(g + f)$. The sign of this product is read from a sign table on the real line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — squaring method</div><div class="example-body">Solve $|x + 1| &lt; |2x - 3|$.<br><br>Square both sides: $(x + 1)^2 &lt; (2x - 3)^2$.<br>Rearrange: $(2x - 3)^2 - (x + 1)^2 &gt; 0$. Factor as difference of squares:<br>$[(2x - 3) - (x + 1)] \\cdot [(2x - 3) + (x + 1)] &gt; 0$<br>$= (x - 4)(3x - 2) &gt; 0$.<br><br>Sign table: roots at $x = 4$ and $x = \\dfrac{2}{3}$. Product is positive when both factors share sign:<br>&bull; $x &lt; \\dfrac{2}{3}$: both negative &rarr; positive product.<br>&bull; $\\dfrac{2}{3} &lt; x &lt; 4$: signs differ &rarr; negative product.<br>&bull; $x &gt; 4$: both positive &rarr; positive product.<br><br>Solution set: $\\mathbf{\\left(-\\infty, \\, \\dfrac{2}{3}\\right) \\cup (4, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALTERNATIVE — case analysis</div><div class="example-body">The same inequality can also be solved by splitting into intervals based on where each absolute value changes sign ($x = -1$ for $|x + 1|$, $x = \\dfrac{3}{2}$ for $|2x - 3|$). Three sub-intervals: $(-\\infty, -1]$, $[-1, \\dfrac{3}{2}]$, $[\\dfrac{3}{2}, \\infty)$. In each sub-interval, replace the bars with the appropriate sign, solve the linear inequality, and intersect with that sub-interval. Tedious but always works. <strong>Squaring is faster when both sides are absolute values.</strong></div></div>

<div class="l-note"><strong>Why squaring works only here.</strong> If <em>one</em> side is an absolute value and the other is a generic expression, squaring can introduce spurious solutions when the generic side is negative (because squaring kills sign information). Only square when both sides are guaranteed non-negative — i.e. both are absolute values, or you've already established the generic side is non-negative.</div>

<h2 class="lesson-title">8. Mixed Case: $|f(x)| &lt; g(x)$ — Mind the Domain</h2>

<div class="calc-highlight"><strong>What if the right-hand side is a generic expression like $x + 1$ rather than a constant?</strong> The rule still extends, but now $g(x)$ must itself be positive for the inequality to have any chance — otherwise the left side (non-negative) is being compared with a non-positive quantity, and the answer is automatic. We must check the sign of $g(x)$ before reading off the solution.</div>

<div class="calc-formula"><div class="formula-label">RULE WITH DOMAIN CHECK</div><div class="formula-main">$$|f(x)| &lt; g(x) \\;\\;\\Longleftrightarrow\\;\\; \\bigl(g(x) &gt; 0\\bigr) \\;\\text{ AND }\\; \\bigl(-g(x) &lt; f(x) &lt; g(x)\\bigr)$$</div><div class="formula-sub">If $g(x) \\le 0$, the inequality $|f(x)| &lt; g(x)$ cannot hold (a non-negative quantity cannot be strictly less than a non-positive one). So $g(x) &gt; 0$ is a <em>necessary</em> precondition.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — domain matters</div><div class="example-body">Solve $|x - 2| &lt; x + 1$.<br><br><strong>Step A — Domain check.</strong> We need $x + 1 &gt; 0$, i.e. $x &gt; -1$.<br><br><strong>Step B — Double inequality.</strong> Under that domain, write $-(x + 1) &lt; x - 2 &lt; x + 1$.<br>Left half: $-(x + 1) &lt; x - 2 \\;\\Rightarrow\\; -x - 1 &lt; x - 2 \\;\\Rightarrow\\; 1 &lt; 2x \\;\\Rightarrow\\; x &gt; \\dfrac{1}{2}$.<br>Right half: $x - 2 &lt; x + 1 \\;\\Rightarrow\\; -2 &lt; 1$. Always true.<br><br><strong>Step C — Intersect.</strong> Combine domain $x &gt; -1$ with $x &gt; \\dfrac{1}{2}$: $x &gt; \\dfrac{1}{2}$ wins.<br><br>Solution set: $\\mathbf{\\left(\\dfrac{1}{2}, \\, \\infty\\right)}$.</div></div>

<div class="calc-example"><div class="example-label">SQUARING METHOD — verification</div><div class="example-body">Same problem with squaring (we may square because the domain $x &gt; -1$ guarantees the right side is positive).<br><br>$(x - 2)^2 &lt; (x + 1)^2$<br>$(x + 1)^2 - (x - 2)^2 &gt; 0$<br>$[(x + 1) - (x - 2)][(x + 1) + (x - 2)] &gt; 0$<br>$3(2x - 1) &gt; 0 \\;\\Rightarrow\\; x &gt; \\dfrac{1}{2}$.<br>Intersect with the domain $x &gt; -1$: $x &gt; \\dfrac{1}{2}$. Same answer.</div></div>

<div class="calc-graph"><div id="plot-l62-mixed-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the V-curve $y = |x - 2|$ in blue and the slanted line $y = x + 1$ in amber. The solution of $|x - 2| &lt; x + 1$ is exactly the set of $x$-values where the V sits <em>below</em> the line. The two curves meet at $x = \\dfrac{1}{2}$; for $x &gt; \\dfrac{1}{2}$ the line stays above the V forever, so the solution is $\\left(\\dfrac{1}{2}, \\, \\infty\\right)$, shaded green. For $x &lt; -1$ the line dips below the x-axis, making the inequality impossible regardless.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys1=[];var ys2=[];for(var i=0;i<=200;i++){var v=-3+9*i/200;xs.push(v);ys1.push(Math.abs(v-2));ys2.push(v+1);}
var vcurve={x:xs,y:ys1,mode:'lines',name:'y = |x − 2|',line:{color:'#3b82f6',width:3}};
var lineG={x:xs,y:ys2,mode:'lines',name:'y = x + 1',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var shadeX=[];var shadeYtop=[];var shadeYbot=[];for(var j=0;j<=80;j++){var v2=0.5+5.5*j/80;shadeX.push(v2);shadeYbot.push(Math.abs(v2-2));shadeYtop.push(v2+1);}
var polyX=shadeX.slice();var polyY=shadeYtop.slice();for(var k=shadeX.length-1;k>=0;k--){polyX.push(shadeX[k]);polyY.push(shadeYbot[k]);}
var shade={x:polyX,y:polyY,mode:'lines',fill:'toself',name:'|x − 2| < x + 1',line:{color:'rgba(34,197,94,0)'},fillcolor:'rgba(34,197,94,0.22)'};
var meet={x:[0.5],y:[1.5],mode:'markers+text',name:'meeting point',marker:{color:'#22c55e',size:11},text:['x = 1/2'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-2.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l62-mixed-en',[vcurve,lineG,shade,meet],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>$|f(x)| &gt; g(x)$ behaves more kindly.</strong> If the right side is negative or zero, the inequality is automatic (the left side, being non-negative, exceeds anything non-positive). If $g(x) &gt; 0$, you again split: $f(x) &gt; g(x)$ or $f(x) &lt; -g(x)$. The full solution is the union of "right side negative or zero" with the two split solutions.</div>

<h2 class="lesson-title">9. The Triangle Inequality</h2>

<div class="calc-highlight"><strong>One of the most important inequalities in mathematics:</strong> $|a + b| \\le |a| + |b|$. In words: the distance you travel by going directly is at most the distance you travel by going via a detour. Equality $|a + b| = |a| + |b|$ holds exactly when $a$ and $b$ have the same sign (or one is zero) — both vectors pointing the same way add lengths.</div>

<div class="calc-formula"><div class="formula-label">TRIANGLE INEQUALITY</div><div class="formula-main">$$|a + b| \\;\\le\\; |a| + |b| \\qquad\\text{for all real } a, b$$</div><div class="formula-sub">Plus the reverse version: $\\bigl||a| - |b|\\bigr| \\le |a - b|$. Both come up regularly.</div></div>

<p class="l-text"><strong>Informal proof.</strong> Squaring both sides (legal — both are non-negative): we want $(a + b)^2 \\le (|a| + |b|)^2$. Expand: $a^2 + 2ab + b^2 \\le a^2 + 2|a||b| + b^2$. Subtract the common terms: $2ab \\le 2|a||b|$, i.e. $ab \\le |ab|$. That is true for every real $a, b$ — the product is always at most its own absolute value. Equality requires $ab = |ab|$, i.e. $ab \\ge 0$, i.e. $a$ and $b$ have the same sign (or one is zero).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — strict inequality</div><div class="example-body">Take $a = 3$, $b = -5$.<br><br>$|a + b| = |3 + (-5)| = |-2| = 2$.<br>$|a| + |b| = 3 + 5 = 8$.<br>Indeed $2 \\le 8$ with strict inequality because $a$ and $b$ have opposite signs.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — equality</div><div class="example-body">Take $a = 3$, $b = 5$ (same sign).<br><br>$|a + b| = |8| = 8$.<br>$|a| + |b| = 3 + 5 = 8$.<br>Equality $|a + b| = |a| + |b|$ holds because $ab = 15 \\ge 0$.</div></div>

<div class="think-box"><div class="think-label">WHY "TRIANGLE"</div><div class="think-body">If you draw two line segments from a common starting point — one of length $|a|$ in one direction, the other of length $|b|$ tacked on at the end — the total distance from start to end is exactly $|a + b|$ (treating $a, b$ as vectors). But if you walked the full path (length $|a| + |b|$), you took a detour, so the detour is at least as long as the direct hop. That's the triangle inequality in geometry: any side of a triangle is at most the sum of the other two.</div></div>

<h2 class="lesson-title">10. Tolerance and Word Problems</h2>

<div class="calc-highlight"><strong>Manufacturing, measurement, and quality control all speak in tolerances:</strong> "within $\\pm$0.5 cm of 100 cm." This is exactly an absolute-value inequality: $|L - 100| \\le 0.5$ where $L$ is the actual length. Distance from the target value is the bar between acceptable and reject.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — manufacturing tolerance</div><div class="example-body">A factory produces metal rods with target length $100$ cm and tolerance $\\pm 0.5$ cm. Which rod lengths $L$ are acceptable?<br><br><em>Translate:</em> "within $0.5$ cm of $100$" means $|L - 100| \\le 0.5$.<br><em>Solve:</em> $-0.5 \\le L - 100 \\le 0.5$, i.e. $99.5 \\le L \\le 100.5$.<br><br>Acceptable range: $\\mathbf{[99.5, \\, 100.5]}$ cm.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — temperature monitor</div><div class="example-body">A server room must be kept within $2^\\circ$C of $22^\\circ$C. Outside that band, an alarm sounds. For which temperatures $T$ is the alarm silent?<br><br><em>Translate:</em> "within $2^\\circ$ of $22^\\circ$" means $|T - 22| \\le 2$.<br><em>Solve:</em> $-2 \\le T - 22 \\le 2$, i.e. $20 \\le T \\le 24$.<br><br>Silent band: $\\mathbf{[20, \\, 24]\\,^\\circ\\text{C}}$. For $T &lt; 20$ or $T &gt; 24$ the alarm sounds — the "outside" interpretation of $|T - 22| &gt; 2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — opinion poll margin</div><div class="example-body">A poll reports a candidate's support as $\\mathbf{47\\%}$ with margin of error $\\pm 3\\%$. The true support level $p$ (in percent) satisfies what inequality?<br><br>$|p - 47| \\le 3 \\;\\Rightarrow\\; -3 \\le p - 47 \\le 3 \\;\\Rightarrow\\; 44 \\le p \\le 50$. The reported $95\\%$ confidence interval is $[44, 50]$.</div></div>

<h2 class="lesson-title">11. Common Errors and How to Avoid Them</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MISTAKE 1 — AND vs OR mix-up</div><div class="compare-item">Writing $|x| &gt; 4$ as $-4 &gt; x &gt; 4$ (impossible double inequality).</div><div class="compare-item"><strong>Fix:</strong> for $&gt;$ always use OR. For $&lt;$ always use AND. Remember the geometric picture (interval vs two rays).</div></div><div class="compare-col"><div class="compare-title">MISTAKE 2 — forgetting domain</div><div class="compare-item">Solving $|x - 2| &lt; x + 1$ without first requiring $x + 1 &gt; 0$.</div><div class="compare-item"><strong>Fix:</strong> any time the right side has $x$ in it, check whether it can be negative or zero before applying the rule.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MISTAKE 3 — bar-removing</div><div class="compare-item">Treating $|x|$ as if it equals $x$ (or $-x$, depending on mood) without case analysis.</div><div class="compare-item"><strong>Fix:</strong> $|x| = x$ holds only for $x \\ge 0$. For $x &lt; 0$ it equals $-x$. The piecewise definition is non-negotiable.</div></div><div class="compare-col"><div class="compare-title">MISTAKE 4 — sign flip forgotten</div><div class="compare-item">Dividing both sides by a negative coefficient inside the bars without flipping the inequality.</div><div class="compare-item"><strong>Fix:</strong> the lesson 52 rule still applies — negative multiplier or divisor flips $&lt;$ to $&gt;$ and vice versa.</div></div></div>

<div class="l-note"><strong>The single best habit:</strong> draw a picture. A V-shaped graph of $y = |\\text{stuff}|$ together with the horizontal line or slanted line on the right side instantly tells you where the inequality holds. You almost never need to solve the algebra cold if you can see the geometry.</div>

<h2 class="lesson-title">12. Practice Problems</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EXERCISE 1</div><div class="card-body">Solve $|x - 2| &lt; 5$.<br><br><em>Solution:</em> $-5 &lt; x - 2 &lt; 5 \\;\\Rightarrow\\; -3 &lt; x &lt; 7$.<br><strong>Answer:</strong> $(-3, \\, 7)$.</div></div>
<div class="calc-card"><div class="card-title">EXERCISE 2</div><div class="card-body">Solve $|2x + 1| &gt; 7$.<br><br><em>Split:</em> $2x + 1 &gt; 7$ or $2x + 1 &lt; -7$.<br>First: $x &gt; 3$. Second: $x &lt; -4$.<br><strong>Answer:</strong> $(-\\infty, -4) \\cup (3, \\infty)$.</div></div>
<div class="calc-card"><div class="card-title">EXERCISE 3</div><div class="card-body">Solve $|x + 3| \\le 0$.<br><br><em>Reasoning:</em> $|x + 3|$ is non-negative, so $\\le 0$ forces equality. $x + 3 = 0 \\Rightarrow x = -3$.<br><strong>Answer:</strong> $\\{-3\\}$ (single point).</div></div>
<div class="calc-card"><div class="card-title">EXERCISE 4</div><div class="card-body">Solve $|x - 1| \\ge -2$.<br><br><em>Reasoning:</em> $|x - 1| \\ge 0 \\ge -2$ for every real $x$. Always true.<br><strong>Answer:</strong> $\\mathbb{R}$.</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EXERCISE 5</div><div class="card-body">Solve $|x| &lt; |x - 4|$.<br><br><em>Squaring:</em> $x^2 &lt; (x - 4)^2 = x^2 - 8x + 16 \\Rightarrow 0 &lt; -8x + 16 \\Rightarrow 8x &lt; 16 \\Rightarrow x &lt; 2$.<br><em>Reading:</em> "$x$ is closer to $0$ than to $4$" — all points to the left of the midpoint $x = 2$.<br><strong>Answer:</strong> $(-\\infty, \\, 2)$.</div></div>
<div class="calc-card"><div class="card-title">EXERCISE 6</div><div class="card-body">Solve $|x - 2| &lt; x + 1$ (domain matters).<br><br><em>Domain:</em> $x + 1 &gt; 0 \\Rightarrow x &gt; -1$.<br><em>Solve:</em> $-(x + 1) &lt; x - 2 &lt; x + 1$. Left half: $-x - 1 &lt; x - 2 \\Rightarrow x &gt; \\dfrac{1}{2}$. Right half: $-2 &lt; 1$ always.<br><em>Intersect:</em> $x &gt; \\dfrac{1}{2}$ (which is already inside the domain).<br><strong>Answer:</strong> $\\left(\\dfrac{1}{2}, \\, \\infty\\right)$.</div></div>
<div class="calc-card"><div class="card-title">EXERCISE 7</div><div class="card-body">Solve $|3 - 2x| \\le 5$.<br><br><em>Double inequality:</em> $-5 \\le 3 - 2x \\le 5$. Subtract $3$: $-8 \\le -2x \\le 2$. Divide by $-2$ (flip both): $4 \\ge x \\ge -1$, i.e. $-1 \\le x \\le 4$.<br><strong>Answer:</strong> $[-1, \\, 4]$.</div></div>
<div class="calc-card"><div class="card-title">EXERCISE 8*</div><div class="card-body">A bolt must have diameter $8$ mm with tolerance $\\pm 0.1$ mm. Write the inequality for acceptable diameters $d$ and find the range.<br><br><em>Inequality:</em> $|d - 8| \\le 0.1$. <em>Solve:</em> $7.9 \\le d \\le 8.1$.<br><strong>Answer:</strong> acceptable range $[7.9, \\, 8.1]$ mm.</div></div>
</div>

<div class="think-box"><div class="think-label">FINAL SUMMARY — WHAT TO TAKE FROM THIS LESSON</div><div class="think-body"><strong>(1)</strong> $|x|$ is a distance from $0$, so $|x - a|$ is the distance from $x$ to $a$. <strong>(2)</strong> $|x| &lt; a$ (with $a &gt; 0$) means $-a &lt; x &lt; a$: one bounded interval, AND condition. <strong>(3)</strong> $|x| &gt; a$ (with $a &gt; 0$) means $x &lt; -a$ or $x &gt; a$: two unbounded rays, OR condition. <strong>(4)</strong> Edge cases: $|f| &lt; 0$ never, $|f| \\ge 0$ always, $|f| \\le 0$ only at the zero. <strong>(5)</strong> $|ax + b| &lt; c$ extends as $-c &lt; ax + b &lt; c$; $|ax + b| &gt; c$ extends as the OR split. Negative coefficient inside flips the inequality the same way as in lesson 52. <strong>(6)</strong> $|f(x)| &lt; |g(x)|$: square both sides (both non-negative) and factor as difference of squares. <strong>(7)</strong> $|f(x)| &lt; g(x)$: first require $g(x) &gt; 0$, then apply the double-inequality rule; intersect with the domain. <strong>(8)</strong> Triangle inequality $|a + b| \\le |a| + |b|$ with equality only when $a, b$ have the same sign. <strong>(9)</strong> Tolerance problems translate directly: "within $\\delta$ of $T$" is $|x - T| \\le \\delta$.</div></div>
`,

/* ============================================================
   TÜRKÇE VERSİYON
   ============================================================ */
tr: `<p class="l-text"><strong>Mutlak değerli eşitsizlik, aslında bir uzaklık sorusudur.</strong> $|x - a| = c$ denklemi "hangi noktalar $a$'ya tam $c$ birim uzaklıktadır?" diye sorarken, $|x - a| &lt; c$ eşitsizliği "hangi noktalar $a$'ya $c$'den <em>daha yakındır</em>?" ve $|x - a| &gt; c$ ise "hangi noktalar $a$'dan $c$'den <em>daha uzaktır</em>?" diye sorar. Cevap artık iki ayrık sayı değil, sayı doğrusunun sürekli bir parçasıdır — bir aralık veya iki ışının birleşimi. Cebirsel kuralları ezberlemeden önce geometrik resmi okumak daha hızlıdır.</p>

<p class="l-text">Bu ders, herhangi bir mutlak değerli eşitsizliği ya çift eşitsizliğe ($-c &lt; \\text{şey} &lt; c$) ya da bir çift tek taraflı eşitsizliğe ($\\text{şey} &lt; -c$ veya $\\text{şey} &gt; c$) çevirmeyi ve her parçayı 52. derste öğrendiğin tekniklerle çözmeyi öğretiyor. Sağ tarafın da $x$ içerdiği daha zor durumlarla da ilgileniyoruz: ya iki tarafın karesini alıp ya da aralıklara bölüp tanım kümesini kontrol ederek. Bu tür sorular her yıl YKS'de (TYT/AYT) çıkıyor — kuralları şimdi öğren, gerisi mekanik.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$|x| &lt; a$ ve $|x| &gt; a$ ifadelerini uzaklık soruları olarak okuyacak, her birini sıradan eşitsizliklere çevirebileceksin</li>
<li>$|ax + b| &lt; c$ tipini, $-c &lt; ax + b &lt; c$ çift eşitsizliği yazarak çözeceksin</li>
<li>$|ax + b| &gt; c$ tipini, $ax + b &lt; -c$ <em>veya</em> $ax + b &gt; c$ birleşimi olarak çözeceksin</li>
<li>Sınır durumları — $|f(x)| &lt; 0$ (çözüm yok), $|f(x)| \\ge 0$ (her zaman doğru), $|f(x)| \\le 0$ (yalnız sıfır noktası) — kolayca ayırt edeceksin</li>
<li>$|f(x)| &lt; |g(x)|$ tipinde iki tarafın karesini alarak, $|f(x)| &lt; g(x)$ tipinde ise dikkatli bir tanım kümesi kontrolüyle çözebileceksin</li>
<li>Üçgen eşitsizliği $|a + b| \\le |a| + |b|$ kuralını ve üretim/ölçüm dünyasından tolerans-tipi sözel problemleri uygulayacaksın</li>
</ul>
</div>

<h2 class="lesson-title">1. Hatırlatma: Mutlak Değer Bir Uzaklıktır</h2>

<div class="calc-highlight"><strong>Bir gerçek sayının mutlak değeri $|x|$, sayı doğrusu üzerindeki sıfıra olan uzaklığıdır.</strong> Uzaklık asla negatif olmaz, o yüzden her $x$ için $|x| \\ge 0$. İşaret kaybolur: $|+7| = 7$ ve $|-7| = 7$. Daha genel olarak $|x - a|$, $x$'in $a$'ya uzaklığıdır — bu dersteki her eşitsizliğin tam olarak sömüreceği resim.</div>

<div class="calc-formula"><div class="formula-label">TANIM</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} x, &amp; x \\ge 0 \\\\ -x, &amp; x &lt; 0 \\end{cases} \\qquad\\text{ve}\\qquad |x - a| \\;=\\; x \\text{ ile } a \\text{ arasındaki uzaklık}$$</div><div class="formula-sub">İki eşdeğer bakış — cebirsel (parçalı tanımlı) ve geometrik (uzaklık). İkisi de kullanılacak; eşitsizlikler için geometrik olan daha hızlı.</div></div>

<p class="l-text">Asla yeniden türetmek zorunda kalmayacağın birkaç temel olgu:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Her zaman non-negatif</div><div class="card-body">Her gerçek $x$ için $|x| \\ge 0$. Eşitlik $|x| = 0$ yalnızca $x = 0$ noktasında sağlanır.</div></div>
<div class="calc-card"><div class="card-title">Simetrik</div><div class="card-body">$|-x| = |x|$. Sıfırın etrafında yansıtmak uzaklığı değiştirmez.</div></div>
<div class="calc-card"><div class="card-title">Çarpımsal</div><div class="card-body">$|xy| = |x| \\cdot |y|$ ve $\\left|\\dfrac{x}{y}\\right| = \\dfrac{|x|}{|y|}$ ($y \\ne 0$ için). Uzaklık çarpma ve bölme ile güzel uyum gösterir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$x = 7$ iken $|x - 3|$ kaçtır? $7$ ile $3$ arasındaki uzaklık $4$. Peki ya $x = -1$? $-1$ ile $3$ arasındaki uzaklık da $4$. Demek ki $|x - 3| = 4$ denkleminin <em>iki</em> çözümü var: $x = 7$ ve $x = -1$. Şimdi: $3$'e uzaklığı $4$'<em>ten</em> küçük olan tüm $x$'ler nelerdir? Geometrik olarak: açık aralık $(-1, 7)$. İşte 2. bölümün bütün içeriği bu.</div></div>

<h2 class="lesson-title">2. $|x| &lt; a$ Eşitsizliği (burada $a &gt; 0$)</h2>

<div class="calc-highlight"><strong>Geometrik okuma:</strong> "$0$'a uzaklığı $a$'dan küçük olan noktalar." Bunlar tam olarak $-a$ ile $+a$ arasındaki kesinlikle aradaki noktalardır. Yani $|x| &lt; a$ ifadesi $-a &lt; x &lt; a$ ile aynı şeydir. Çözüm, merkezi sıfır olan ve uzunluğu $2a$ olan bir açık aralıktır.</div>

<div class="calc-formula"><div class="formula-label">KURAL</div><div class="formula-main">$$|x| &lt; a \\;\\;\\Longleftrightarrow\\;\\; -a &lt; x &lt; a \\qquad (a &gt; 0)$$</div><div class="formula-sub">$\\le$ için eşitsizlikler de $\\le$ olur ve aralık kapalı hâle gelir: $|x| \\le a \\Leftrightarrow -a \\le x \\le a$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$|x| &lt; 3$ eşitsizliğini çöz.<br><br>Geometrik okuma: $0$'a uzaklık $3$'ten küçük. Yani $-3 &lt; x &lt; 3$.<br><br>Çözüm kümesi: $\\mathbf{(-3, \\, 3)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$|x| \\le 5$ eşitsizliğini çöz.<br><br>$0$'a uzaklık en fazla $5$. Yani $-5 \\le x \\le 5$.<br><br>Çözüm kümesi: $\\mathbf{[-5, \\, 5]}$ — kapalı aralık, uç noktalar dahil.</div></div>

<div class="calc-graph"><div id="plot-l62-less-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> $y = |x|$ grafiği mavi renkte, üzerine $y = 3$ yatay doğrusu kehribar renkte çizilmiş. $|x| &lt; 3$ çözümü, V-eğrisinin doğrudan <em>aşağıda</em> kaldığı $x$ değerlerinin kümesidir — açık aralık $(-3, 3)$, yeşille gölgeli. Sınır noktaları $x = \\pm 3$ hariç tutulmuş (içi boş daireler).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var v=-6+12*i/200;xs.push(v);ys.push(Math.abs(v));}
var curve={x:xs,y:ys,mode:'lines',name:'y = |x|',line:{color:'#3b82f6',width:3}};
var hLine={x:[-6,6],y:[3,3],mode:'lines',name:'y = 3',line:{color:'#f59e0b',width:2,dash:'dash'}};
var shadeX=[];var shadeY=[];for(var j=0;j<=80;j++){var v2=-3+6*j/80;shadeX.push(v2);shadeY.push(Math.abs(v2));}
shadeX.push(3,-3);shadeY.push(3,3);
var shade={x:shadeX,y:shadeY,mode:'lines',fill:'toself',name:'|x| < 3',line:{color:'rgba(34,197,94,0)'},fillcolor:'rgba(34,197,94,0.25)'};
var openL={x:[-3],y:[3],mode:'markers',name:'x = −3 (hariç)',marker:{color:'#0a0a0a',size:14,line:{color:'#22c55e',width:2.5}}};
var openR={x:[3],y:[3],mode:'markers',name:'x = 3 (hariç)',marker:{color:'#0a0a0a',size:14,line:{color:'#22c55e',width:2.5}},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-0.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l62-less-tr',[curve,hLine,shade,openL,openR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Eşitsizlik yönüne dikkat.</strong> $|x| &lt; a$ bir <em>VE</em> koşulu üretir (hem $-a &lt; x$ hem de $x &lt; a$ aynı anda sağlanmalı) — çift eşitsizlik $-a &lt; x &lt; a$ tam olarak bunu kodlar.</div>

<h2 class="lesson-title">3. $|x| &gt; a$ Eşitsizliği (burada $a &gt; 0$)</h2>

<div class="calc-highlight"><strong>Geometrik okuma:</strong> "$0$'a uzaklığı $a$'dan büyük olan noktalar." Bunlar $-a$'nın <em>solundaki</em> ya da $+a$'nın <em>sağındaki</em> noktalardır. Yani $|x| &gt; a$ ifadesi $x &lt; -a$ <em>veya</em> $x &gt; a$ olur. Çözüm, iki açık ışının birleşimidir.</div>

<div class="calc-formula"><div class="formula-label">KURAL</div><div class="formula-main">$$|x| &gt; a \\;\\;\\Longleftrightarrow\\;\\; x &lt; -a \\;\\text{ veya }\\; x &gt; a \\qquad (a &gt; 0)$$</div><div class="formula-sub">$\\ge$ için eşitsizlikler $\\le$ ve $\\ge$ olur, uç noktalar da dahil edilir. Aralık gösterimi: $(-\\infty, -a] \\cup [a, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$|x| &gt; 4$ eşitsizliğini çöz.<br><br>$0$'a uzaklık $4$'ü aşar. Yani $x &lt; -4$ veya $x &gt; 4$.<br><br>Çözüm kümesi: $\\mathbf{(-\\infty, -4) \\cup (4, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$|x| \\ge 2$ eşitsizliğini çöz.<br><br>$0$'a uzaklık en az $2$. Yani $x \\le -2$ veya $x \\ge 2$.<br><br>Çözüm kümesi: $\\mathbf{(-\\infty, -2] \\cup [2, \\infty)}$ — uç noktalar dahil.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$|x| &lt; a$ — VE</div><div class="compare-item">Tek bir sınırlı aralık $(-a, a)$</div><div class="compare-item">Tek bir çift eşitsizlik $-a &lt; x &lt; a$</div><div class="compare-item">"Sandviç" resmi: $x$ arada sıkışır</div><div class="compare-item">V-grafiğinin yatay doğrunun altında kaldığı yer</div></div><div class="compare-col"><div class="compare-title">$|x| &gt; a$ — VEYA</div><div class="compare-item">İki sınırsız ışın $(-\\infty, -a) \\cup (a, \\infty)$</div><div class="compare-item">İki ayrı tek taraflı eşitsizlik</div><div class="compare-item">"Dışarı kaç" resmi: $x$ sıfırdan uzağa kaçar</div><div class="compare-item">V-grafiğinin yatay doğrunun üstünde kaldığı yer</div></div></div>

<h2 class="lesson-title">4. Sınır Durumları: $|x| &lt; 0$, $|x| \\ge 0$, $|x| \\le 0$</h2>

<div class="calc-highlight"><strong>Görünüşte basit olan üç durum her yıl YKS'de öğrencileri yanıltıyor.</strong> Sağ taraf negatif, sıfır ya da işareti öyle olabilir ki eşitsizlik ya imkânsız hâle gelir ya da otomatik olarak doğru olur. Bu durumları cebire dalmadan önce hemen yakala.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$|f(x)| &lt; 0$ — asla olmaz</div><div class="card-body">Mutlak değer asla kesinlikle sıfırdan küçük olamaz. Çözüm kümesi: $\\varnothing$. İşlem gerekmiyor.</div></div>
<div class="calc-card"><div class="card-title">$|f(x)| \\ge 0$ — her zaman doğru</div><div class="card-body">Mutlak değer her zaman non-negatiftir. $f$'nin tanım kümesindeki her gerçek $x$ uyar. Çözüm kümesi: $\\mathbb{R}$ (veya $f$'nin tanım kümesi).</div></div>
<div class="calc-card"><div class="card-title">$|f(x)| \\le 0$ — sıfıra eşit</div><div class="card-body">Mutlak değer $\\le 0$ olabilmesinin tek yolu $0$'a eşit olmasıdır. $f(x) = 0$ denklemini çöz. Çözüm kümesi: $\\{x : f(x) = 0\\}$.</div></div>
</div>

<div class="calc-example"><div class="example-label">SINIR ÖRNEK — $|x+3| \\le 0$</div><div class="example-body">$|x + 3|$ negatif olamaz, o yüzden $|x + 3| \\le 0$ zorunlu olarak $|x + 3| = 0$ verir, yani $x + 3 = 0$ ve $x = -3$.<br><br>Çözüm kümesi: $\\mathbf{\\{-3\\}}$ — yalnızca tek nokta.</div></div>

<div class="calc-example"><div class="example-label">SINIR ÖRNEK — $|x-1| \\ge -2$</div><div class="example-body">$|x - 1| \\ge 0$ ve bu da $\\ge -2$. O hâlde eşitsizlik <strong>her gerçek $x$ için doğrudur</strong>.<br><br>Çözüm kümesi: $\\mathbf{\\mathbb{R}}$.</div></div>

<div class="calc-example"><div class="example-label">SINIR ÖRNEK — $|2x-7| &lt; -5$</div><div class="example-body">Hiçbir mutlak değer kesinlikle negatif bir sayıdan küçük olamaz.<br><br>Çözüm kümesi: $\\mathbf{\\varnothing}$ — hiç çözüm yok. Cebir gerekmiyor.</div></div>

<div class="think-box"><div class="think-label">İLK BAKIŞ</div><div class="think-body">Cebire dalmadan önce her zaman eşitsizliğin sağ tarafına bak. Eğer negatif ise, eşitsizlik ya imkânsız ($&lt;$ veya $\\le$ ile) ya da otomatik olarak doğrudur ($&gt;$ veya $\\ge$ ile). Bunu fark etmek beş dakikalık bir sınav sorusunda üç dakika boşa harcamamayı kurtarır.</div></div>

<h2 class="lesson-title">5. $|ax + b| &lt; c$ Biçimindeki Eşitsizlikler</h2>

<div class="calc-highlight"><strong>Genel "küçüktür" tipi.</strong> Çubukların içindeki ifade artık sadece $x$ değil, $ax + b$ lineer ifadesidir. Kural değişmeden uzanır: $|ax + b| &lt; c$ ($c &gt; 0$ ile), $-c &lt; ax + b &lt; c$ ile aynıdır. Çift eşitsizliği $x$ için tek hamlede çöz.</div>

<div class="calc-formula"><div class="formula-label">GENİŞLETİLMİŞ KURAL</div><div class="formula-main">$$|ax + b| &lt; c \\;\\;\\Longleftrightarrow\\;\\; -c &lt; ax + b &lt; c \\qquad (c &gt; 0)$$</div><div class="formula-sub">Üç parçaya aynı anda işlem yap: üçünden de $b$ çıkar, sonra üçünü de $a$'ya böl. Eğer $a &lt; 0$ ise bölme adımında iki eşitsizlik de yön değiştirir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$|2x - 3| &lt; 5$ eşitsizliğini çöz.<br><br>Çift eşitsizliği yaz: $-5 &lt; 2x - 3 &lt; 5$.<br>Üç parçaya $3$ ekle: $-2 &lt; 2x &lt; 8$.<br>Üç parçayı $2$'ye böl (pozitif, dönmüyor): $-1 &lt; x &lt; 4$.<br><br>Çözüm kümesi: $\\mathbf{(-1, \\, 4)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$|3x + 1| \\le 7$ eşitsizliğini çöz.<br><br>$-7 \\le 3x + 1 \\le 7$.<br>$1$ çıkar: $-8 \\le 3x \\le 6$.<br>$3$'e böl: $-\\dfrac{8}{3} \\le x \\le 2$.<br><br>Çözüm kümesi: $\\mathbf{\\left[-\\dfrac{8}{3}, \\, 2\\right]}$ — kapalı, uç noktalar dahil.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — içte negatif katsayı</div><div class="example-body">$|{-2x} + 5| &lt; 3$ eşitsizliğini çöz.<br><br>$-3 &lt; -2x + 5 &lt; 3$.<br>$5$ çıkar: $-8 &lt; -2x &lt; -2$.<br>$-2$'ye böl — <strong>iki eşitsizliği de çevir</strong>: $4 &gt; x &gt; 1$, yani $1 &lt; x &lt; 4$.<br><br>Çözüm kümesi: $\\mathbf{(1, \\, 4)}$. <em>Hatırlatma: ne zaman negatif bir sayıya bölersen, iki eşitsizlik işareti de döner — 52. dersteki aynı kural.</em></div></div>

<div class="l-note"><strong>Geometrik okuma.</strong> $|2x - 3| &lt; 5$ demek "$2x$ ile $3$ arasındaki uzaklık $5$'ten küçük" — eşdeğer olarak "$x$ ile $\\dfrac{3}{2}$ arasındaki uzaklık $\\dfrac{5}{2}$'den küçük." Bu, merkezi $\\dfrac{3}{2}$ olan ve uzunluğu $5$ olan bir aralık — ki bu da $(-1, 4)$ ile birebir uyuşur. İç kısım $x - a$ olduğu sürece her zaman önce geometrik okumayı dene.</div>

<h2 class="lesson-title">6. $|ax + b| &gt; c$ Biçimindeki Eşitsizlikler</h2>

<div class="calc-highlight"><strong>Genel "büyüktür" tipi.</strong> Aynı uzanma: $|ax + b| &gt; c$ ($c &gt; 0$ ile), $ax + b &gt; c$ veya $ax + b &lt; -c$ olarak iki tek taraflı eşitsizliğe bölünür. Her birini ayrı çöz ve birleşimini al.</div>

<div class="calc-formula"><div class="formula-label">GENİŞLETİLMİŞ KURAL</div><div class="formula-main">$$|ax + b| &gt; c \\;\\;\\Longleftrightarrow\\;\\; ax + b &gt; c \\;\\text{ veya }\\; ax + b &lt; -c \\qquad (c &gt; 0)$$</div><div class="formula-sub">Her dal sıradan birinci derece bir eşitsizliktir. Bağımsız çöz; çözüm kümesi iki parçanın birleşimidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$|x + 1| &gt; 4$ eşitsizliğini çöz.<br><br>Böl: $x + 1 &gt; 4$ veya $x + 1 &lt; -4$.<br>İlki: $x &gt; 3$. İkincisi: $x &lt; -5$.<br><br>Çözüm kümesi: $\\mathbf{(-\\infty, -5) \\cup (3, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$|2x + 1| \\ge 7$ eşitsizliğini çöz.<br><br>Böl: $2x + 1 \\ge 7$ veya $2x + 1 \\le -7$.<br>İlki: $2x \\ge 6 \\;\\Rightarrow\\; x \\ge 3$. İkincisi: $2x \\le -8 \\;\\Rightarrow\\; x \\le -4$.<br><br>Çözüm kümesi: $\\mathbf{(-\\infty, -4] \\cup [3, \\infty)}$.</div></div>

<div class="calc-graph"><div id="plot-l62-greater-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> V-şeklindeki $y = |x + 1|$ grafiği (tepe noktası $x = -1$'de) ile $y = 4$ yatay doğrusu birlikte. $|x + 1| &gt; 4$ çözümü, V'nin doğrudan <em>üstünde</em> kaldığı $x$ değerlerinin kümesidir — iki sınırsız ışın $x &lt; -5$ ve $x &gt; 3$, ikisi de kehribarla gölgeli. Sınır noktaları $x = -5, 3$ hariç tutulmuş (içi boş daireler).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var v=-9+15*i/200;xs.push(v);ys.push(Math.abs(v+1));}
var curve={x:xs,y:ys,mode:'lines',name:'y = |x + 1|',line:{color:'#3b82f6',width:3}};
var hLine={x:[-9,6],y:[4,4],mode:'lines',name:'y = 4',line:{color:'#f59e0b',width:2,dash:'dash'}};
var leftX=[];var leftY=[];for(var j=0;j<=40;j++){var v2=-9+4*j/40;leftX.push(v2);leftY.push(Math.abs(v2+1));}
leftX.push(-5,-9);leftY.push(4,4);
var leftShade={x:leftX,y:leftY,mode:'lines',fill:'toself',name:'x < −5',line:{color:'rgba(245,158,11,0)'},fillcolor:'rgba(245,158,11,0.22)'};
var rightX=[];var rightY=[];for(var j=0;j<=40;j++){var v3=3+3*j/40;rightX.push(v3);rightY.push(Math.abs(v3+1));}
rightX.push(6,3);rightY.push(4,4);
var rightShade={x:rightX,y:rightY,mode:'lines',fill:'toself',name:'x > 3',line:{color:'rgba(245,158,11,0)'},fillcolor:'rgba(245,158,11,0.22)'};
var openL={x:[-5],y:[4],mode:'markers',name:'x = −5 (hariç)',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:2.5}}};
var openR={x:[3],y:[4],mode:'markers',name:'x = 3 (hariç)',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:2.5}},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-9,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-0.5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l62-greater-tr',[curve,hLine,leftShade,rightShade,openL,openR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yaygın hata.</strong> Öğrenciler bazen $|x + 1| &gt; 4$ ifadesini $-4 &gt; x + 1 &gt; 4$ olarak yazarlar — bu çift eşitsizlik imkânsızdır (tek bir sayı hem $-4$'ten küçük hem de $4$'ten büyük olamaz). $&gt;$ için her zaman VEYA bölünmesi gerekir, VE sandviçi değil.</div>

<h2 class="lesson-title">7. İki Mutlak Değeri Karşılaştırma: $|f(x)| &lt; |g(x)|$</h2>

<div class="calc-highlight"><strong>İki taraf da mutlak değer ise temiz bir kısa yolumuz var: iki tarafın karesini al.</strong> Kare almak meşrudur çünkü iki taraf da non-negatif, ve eşitsizlik yönü korunur. $|y|$'nin karesi $y^2$ (çubuklar kaybolur), o yüzden problem iki polinomu karşılaştırmaya indirgenir.</div>

<div class="calc-formula"><div class="formula-label">KARESİNİ ALMA KISA YOLU</div><div class="formula-main">$$|f(x)| &lt; |g(x)| \\;\\;\\Longleftrightarrow\\;\\; f(x)^2 &lt; g(x)^2 \\;\\;\\Longleftrightarrow\\;\\; g(x)^2 - f(x)^2 &gt; 0$$</div><div class="formula-sub">Karesini aldıktan sonra kareler farkı olarak çarpanlara ayır: $g^2 - f^2 = (g - f)(g + f)$. Bu çarpımın işareti, sayı doğrusu üzerindeki bir işaret tablosundan okunur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — kare alma yöntemi</div><div class="example-body">$|x + 1| &lt; |2x - 3|$ eşitsizliğini çöz.<br><br>İki tarafın karesini al: $(x + 1)^2 &lt; (2x - 3)^2$.<br>Yeniden düzenle: $(2x - 3)^2 - (x + 1)^2 &gt; 0$. Kareler farkı olarak çarpanlara ayır:<br>$[(2x - 3) - (x + 1)] \\cdot [(2x - 3) + (x + 1)] &gt; 0$<br>$= (x - 4)(3x - 2) &gt; 0$.<br><br>İşaret tablosu: kökler $x = 4$ ve $x = \\dfrac{2}{3}$. Çarpan pozitif olur eğer ikisi aynı işaretliyse:<br>&bull; $x &lt; \\dfrac{2}{3}$: ikisi de negatif &rarr; çarpan pozitif.<br>&bull; $\\dfrac{2}{3} &lt; x &lt; 4$: işaretler farklı &rarr; çarpan negatif.<br>&bull; $x &gt; 4$: ikisi de pozitif &rarr; çarpan pozitif.<br><br>Çözüm kümesi: $\\mathbf{\\left(-\\infty, \\, \\dfrac{2}{3}\\right) \\cup (4, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALTERNATİF — durum analizi</div><div class="example-body">Aynı eşitsizlik, her bir mutlak değerin işaret değiştirdiği noktalara göre ($|x + 1|$ için $x = -1$, $|2x - 3|$ için $x = \\dfrac{3}{2}$) aralıklara bölünerek de çözülebilir. Üç alt aralık: $(-\\infty, -1]$, $[-1, \\dfrac{3}{2}]$, $[\\dfrac{3}{2}, \\infty)$. Her alt aralıkta çubukları uygun işaretle değiştir, lineer eşitsizliği çöz, alt aralıkla kesiştir. Uzun ama her zaman çalışır. <strong>İki taraf da mutlak değer olduğunda karesini almak daha hızlıdır.</strong></div></div>

<div class="l-note"><strong>Kare almak neden yalnızca burada işliyor.</strong> Eğer <em>bir</em> taraf mutlak değer, diğer taraf ise sıradan bir ifade ise, kare almak sıradan taraf negatif olduğunda sahte çözüm üretebilir (çünkü kare almak işaret bilgisini öldürür). Yalnızca iki taraf da non-negatif olduğu garanti edildiğinde kare al — yani iki taraf da mutlak değer ise veya sıradan tarafın non-negatif olduğunu önceden tespit ettiysen.</div>

<h2 class="lesson-title">8. Karışık Durum: $|f(x)| &lt; g(x)$ — Tanım Kümesine Dikkat</h2>

<div class="calc-highlight"><strong>Peki ya sağ taraf sabit değil de $x + 1$ gibi sıradan bir ifade ise?</strong> Kural hâlâ uzanır, ama bu sefer $g(x)$'in eşitsizliğin geçerli olması için <em>pozitif</em> olması gerekir — aksi takdirde sol taraf (non-negatif) non-pozitif bir miktarla karşılaştırılır ve cevap otomatik gelir. Çözümü okumadan önce $g(x)$'in işaretini kontrol etmeliyiz.</div>

<div class="calc-formula"><div class="formula-label">TANIM KONTROLLÜ KURAL</div><div class="formula-main">$$|f(x)| &lt; g(x) \\;\\;\\Longleftrightarrow\\;\\; \\bigl(g(x) &gt; 0\\bigr) \\;\\text{ VE }\\; \\bigl(-g(x) &lt; f(x) &lt; g(x)\\bigr)$$</div><div class="formula-sub">Eğer $g(x) \\le 0$ ise, $|f(x)| &lt; g(x)$ sağlanamaz (non-negatif bir miktar non-pozitif bir miktardan kesinlikle küçük olamaz). O yüzden $g(x) &gt; 0$ <em>gerekli</em> bir ön koşuldur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — tanım kümesi önemli</div><div class="example-body">$|x - 2| &lt; x + 1$ eşitsizliğini çöz.<br><br><strong>Adım A — Tanım kontrolü.</strong> $x + 1 &gt; 0$ gerekir, yani $x &gt; -1$.<br><br><strong>Adım B — Çift eşitsizlik.</strong> Bu tanım altında $-(x + 1) &lt; x - 2 &lt; x + 1$ yaz.<br>Sol yarı: $-(x + 1) &lt; x - 2 \\;\\Rightarrow\\; -x - 1 &lt; x - 2 \\;\\Rightarrow\\; 1 &lt; 2x \\;\\Rightarrow\\; x &gt; \\dfrac{1}{2}$.<br>Sağ yarı: $x - 2 &lt; x + 1 \\;\\Rightarrow\\; -2 &lt; 1$. Her zaman doğru.<br><br><strong>Adım C — Kesiştir.</strong> $x &gt; -1$ tanım kümesi ile $x &gt; \\dfrac{1}{2}$'yi birleştir: $x &gt; \\dfrac{1}{2}$ kazanır.<br><br>Çözüm kümesi: $\\mathbf{\\left(\\dfrac{1}{2}, \\, \\infty\\right)}$.</div></div>

<div class="calc-example"><div class="example-label">KARE ALMA YÖNTEMİ — doğrulama</div><div class="example-body">Aynı problem kare alarak (tanım kümesi $x &gt; -1$ sağ tarafın pozitif olmasını garanti ettiği için kare alabiliriz).<br><br>$(x - 2)^2 &lt; (x + 1)^2$<br>$(x + 1)^2 - (x - 2)^2 &gt; 0$<br>$[(x + 1) - (x - 2)][(x + 1) + (x - 2)] &gt; 0$<br>$3(2x - 1) &gt; 0 \\;\\Rightarrow\\; x &gt; \\dfrac{1}{2}$.<br>Tanım $x &gt; -1$ ile kesiştir: $x &gt; \\dfrac{1}{2}$. Aynı cevap.</div></div>

<div class="calc-graph"><div id="plot-l62-mixed-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> V-eğrisi $y = |x - 2|$ mavi renkte ve eğik doğru $y = x + 1$ kehribar renkte. $|x - 2| &lt; x + 1$ çözümü, V'nin doğrudan <em>aşağıda</em> kaldığı $x$ değerlerinin kümesidir. İki eğri $x = \\dfrac{1}{2}$ noktasında buluşur; $x &gt; \\dfrac{1}{2}$ için doğru her zaman V'nin üstünde kalır, o yüzden çözüm $\\left(\\dfrac{1}{2}, \\, \\infty\\right)$, yeşille gölgeli. $x &lt; -1$ için doğru x-ekseninin altına iner, eşitsizliği zaten imkânsız kılar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys1=[];var ys2=[];for(var i=0;i<=200;i++){var v=-3+9*i/200;xs.push(v);ys1.push(Math.abs(v-2));ys2.push(v+1);}
var vcurve={x:xs,y:ys1,mode:'lines',name:'y = |x − 2|',line:{color:'#3b82f6',width:3}};
var lineG={x:xs,y:ys2,mode:'lines',name:'y = x + 1',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var shadeX=[];var shadeYtop=[];var shadeYbot=[];for(var j=0;j<=80;j++){var v2=0.5+5.5*j/80;shadeX.push(v2);shadeYbot.push(Math.abs(v2-2));shadeYtop.push(v2+1);}
var polyX=shadeX.slice();var polyY=shadeYtop.slice();for(var k=shadeX.length-1;k>=0;k--){polyX.push(shadeX[k]);polyY.push(shadeYbot[k]);}
var shade={x:polyX,y:polyY,mode:'lines',fill:'toself',name:'|x − 2| < x + 1',line:{color:'rgba(34,197,94,0)'},fillcolor:'rgba(34,197,94,0.22)'};
var meet={x:[0.5],y:[1.5],mode:'markers+text',name:'kesişim',marker:{color:'#22c55e',size:11},text:['x = 1/2'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-2.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l62-mixed-tr',[vcurve,lineG,shade,meet],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>$|f(x)| &gt; g(x)$ daha cömert davranır.</strong> Eğer sağ taraf negatif veya sıfır ise eşitsizlik otomatik olarak doğrudur (sol taraf, non-negatif olduğu için, non-pozitif bir şeyden büyüktür). Eğer $g(x) &gt; 0$ ise yine bölünür: $f(x) &gt; g(x)$ veya $f(x) &lt; -g(x)$. Tam çözüm "sağ taraf negatif veya sıfır" durumu ile bölme çözümlerinin birleşimidir.</div>

<h2 class="lesson-title">9. Üçgen Eşitsizliği</h2>

<div class="calc-highlight"><strong>Matematikteki en önemli eşitsizliklerden biri:</strong> $|a + b| \\le |a| + |b|$. Sözle: doğrudan giderken aldığın yol, dolambaçlı giderken aldığın yoldan en fazla kadar uzundur. Eşitlik $|a + b| = |a| + |b|$ ise tam olarak $a$ ve $b$ aynı işaretli (veya biri sıfır) olduğunda sağlanır — aynı yöne giden iki vektör uzunlukları toplar.</div>

<div class="calc-formula"><div class="formula-label">ÜÇGEN EŞİTSİZLİĞİ</div><div class="formula-main">$$|a + b| \\;\\le\\; |a| + |b| \\qquad\\text{her gerçek } a, b \\text{ için}$$</div><div class="formula-sub">Ters versiyon da var: $\\bigl||a| - |b|\\bigr| \\le |a - b|$. İkisi de düzenli olarak karşımıza çıkar.</div></div>

<p class="l-text"><strong>Gayri resmi ispat.</strong> İki tarafın karesini al (meşru — ikisi de non-negatif): $(a + b)^2 \\le (|a| + |b|)^2$ olduğunu göstermek istiyoruz. Aç: $a^2 + 2ab + b^2 \\le a^2 + 2|a||b| + b^2$. Ortak terimleri çıkar: $2ab \\le 2|a||b|$, yani $ab \\le |ab|$. Bu her gerçek $a, b$ için doğrudur — çarpım her zaman kendi mutlak değerine eşit ya da küçüktür. Eşitlik için $ab = |ab|$, yani $ab \\ge 0$, yani $a$ ile $b$ aynı işaretli (veya biri sıfır) gerekir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — kesin eşitsizlik</div><div class="example-body">$a = 3$, $b = -5$ al.<br><br>$|a + b| = |3 + (-5)| = |-2| = 2$.<br>$|a| + |b| = 3 + 5 = 8$.<br>Gerçekten de $2 \\le 8$ kesin eşitsizlikle, çünkü $a$ ve $b$ ters işaretli.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — eşitlik</div><div class="example-body">$a = 3$, $b = 5$ al (aynı işaretli).<br><br>$|a + b| = |8| = 8$.<br>$|a| + |b| = 3 + 5 = 8$.<br>$|a + b| = |a| + |b|$ eşitliği sağlanır çünkü $ab = 15 \\ge 0$.</div></div>

<div class="think-box"><div class="think-label">NEDEN "ÜÇGEN"</div><div class="think-body">Ortak bir başlangıç noktasından iki doğru parçası çizersen — biri $|a|$ uzunluğunda bir yöne, diğeri $|b|$ uzunluğunda ekleyerek — başlangıçtan bitişe toplam uzaklık tam olarak $|a + b|$'dir ($a, b$'yi vektör gibi düşünürsek). Ama tam yolu yürürsen (uzunluk $|a| + |b|$), dolambaçlı yolu izledin; o yüzden dolambaç en az doğrudan yol kadar uzun. Geometride üçgen eşitsizliği de aynı: bir üçgenin herhangi bir kenarı, diğer iki kenarın toplamından en fazla kadar uzundur.</div></div>

<h2 class="lesson-title">10. Tolerans ve Sözel Problemler</h2>

<div class="calc-highlight"><strong>Üretim, ölçüm ve kalite kontrol hepsi tolerans diliyle konuşur:</strong> "$100$ cm'nin $\\pm$0.5 cm civarında." Bu tam olarak bir mutlak değer eşitsizliğidir: $|L - 100| \\le 0.5$ burada $L$ gerçek uzunluk. Hedef değere uzaklık, kabul ile ret arasındaki çubuktur.</div>

<div class="calc-example"><div class="example-label">ÖRNEK — üretim toleransı</div><div class="example-body">Bir fabrika hedef uzunluğu $100$ cm ve toleransı $\\pm 0.5$ cm olan metal çubuklar üretir. Hangi çubuk uzunlukları $L$ kabul edilebilir?<br><br><em>Çevir:</em> "$100$'ün $0.5$ cm civarında" demek $|L - 100| \\le 0.5$.<br><em>Çöz:</em> $-0.5 \\le L - 100 \\le 0.5$, yani $99.5 \\le L \\le 100.5$.<br><br>Kabul edilebilir aralık: $\\mathbf{[99.5, \\, 100.5]}$ cm.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — sıcaklık monitörü</div><div class="example-body">Bir sunucu odası $22\\,^\\circ$C'nin $2\\,^\\circ$C civarında tutulmalıdır. Bu bandın dışında alarm çalar. Hangi sıcaklıklarda $T$ alarm sessiz kalır?<br><br><em>Çevir:</em> "$22\\,^\\circ$C'nin $2\\,^\\circ$C civarında" demek $|T - 22| \\le 2$.<br><em>Çöz:</em> $-2 \\le T - 22 \\le 2$, yani $20 \\le T \\le 24$.<br><br>Sessiz bant: $\\mathbf{[20, \\, 24]\\,^\\circ\\text{C}}$. $T &lt; 20$ veya $T &gt; 24$ için alarm çalar — $|T - 22| &gt; 2$'nin "dışarı" yorumu.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — anket hata marjı</div><div class="example-body">Bir anket bir adayın oyunu $\\mathbf{\\%47}$ olarak rapor ediyor, hata marjı $\\pm \\%3$. Gerçek destek düzeyi $p$ (yüzde olarak) hangi eşitsizliği sağlar?<br><br>$|p - 47| \\le 3 \\;\\Rightarrow\\; -3 \\le p - 47 \\le 3 \\;\\Rightarrow\\; 44 \\le p \\le 50$. Bildirilen $\\%95$ güven aralığı $[44, 50]$.</div></div>

<h2 class="lesson-title">11. Yaygın Hatalar ve Bunlardan Kaçınma Yolları</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA 1 — VE/VEYA karışıklığı</div><div class="compare-item">$|x| &gt; 4$'ü $-4 &gt; x &gt; 4$ olarak yazmak (imkânsız çift eşitsizlik).</div><div class="compare-item"><strong>Çözüm:</strong> $&gt;$ için her zaman VEYA kullan. $&lt;$ için her zaman VE kullan. Geometrik resmi hatırla (aralık ya da iki ışın).</div></div><div class="compare-col"><div class="compare-title">HATA 2 — tanımı unutmak</div><div class="compare-item">$|x - 2| &lt; x + 1$'i önce $x + 1 &gt; 0$ koşulunu koymadan çözmek.</div><div class="compare-item"><strong>Çözüm:</strong> sağ tarafta $x$ olduğu her seferinde, kuralı uygulamadan önce negatif ya da sıfır olup olamayacağını kontrol et.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA 3 — çubuk silme</div><div class="compare-item">$|x|$'i durum analizi yapmadan $x$'e (ya da ruh hâline göre $-x$'e) eşit gibi davranmak.</div><div class="compare-item"><strong>Çözüm:</strong> $|x| = x$ yalnızca $x \\ge 0$ için sağlanır. $x &lt; 0$ için $-x$ olur. Parçalı tanım pazarlık konusu değildir.</div></div><div class="compare-col"><div class="compare-title">HATA 4 — işaret çevirme unutuluyor</div><div class="compare-item">Çubukların içindeki negatif katsayıya iki tarafı bölerken eşitsizliği çevirmemek.</div><div class="compare-item"><strong>Çözüm:</strong> 52. dersin kuralı hâlâ geçerli — negatif çarpan ya da bölen $&lt;$'yi $&gt;$'ye çevirir ve ters de geçerli.</div></div></div>

<div class="l-note"><strong>En iyi tek alışkanlık:</strong> bir resim çiz. $y = |\\text{şey}|$ V-grafiği ile sağ taraftaki yatay ya da eğik doğruyu birlikte çizmek, eşitsizliğin nerede sağlandığını anında söyler. Geometriyi görebilirsen, cebiri soğukkanlılıkla çözmen neredeyse hiç gerekmez.</div>

<h2 class="lesson-title">12. Alıştırma Problemleri</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ALIŞTIRMA 1</div><div class="card-body">$|x - 2| &lt; 5$ eşitsizliğini çöz.<br><br><em>Çözüm:</em> $-5 &lt; x - 2 &lt; 5 \\;\\Rightarrow\\; -3 &lt; x &lt; 7$.<br><strong>Cevap:</strong> $(-3, \\, 7)$.</div></div>
<div class="calc-card"><div class="card-title">ALIŞTIRMA 2</div><div class="card-body">$|2x + 1| &gt; 7$ eşitsizliğini çöz.<br><br><em>Böl:</em> $2x + 1 &gt; 7$ veya $2x + 1 &lt; -7$.<br>İlki: $x &gt; 3$. İkincisi: $x &lt; -4$.<br><strong>Cevap:</strong> $(-\\infty, -4) \\cup (3, \\infty)$.</div></div>
<div class="calc-card"><div class="card-title">ALIŞTIRMA 3</div><div class="card-body">$|x + 3| \\le 0$ eşitsizliğini çöz.<br><br><em>Akıl yürütme:</em> $|x + 3|$ non-negatiftir, o yüzden $\\le 0$ eşitlik zorlar. $x + 3 = 0 \\Rightarrow x = -3$.<br><strong>Cevap:</strong> $\\{-3\\}$ (tek nokta).</div></div>
<div class="calc-card"><div class="card-title">ALIŞTIRMA 4</div><div class="card-body">$|x - 1| \\ge -2$ eşitsizliğini çöz.<br><br><em>Akıl yürütme:</em> Her gerçek $x$ için $|x - 1| \\ge 0 \\ge -2$. Her zaman doğru.<br><strong>Cevap:</strong> $\\mathbb{R}$.</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ALIŞTIRMA 5</div><div class="card-body">$|x| &lt; |x - 4|$ eşitsizliğini çöz.<br><br><em>Kare alma:</em> $x^2 &lt; (x - 4)^2 = x^2 - 8x + 16 \\Rightarrow 0 &lt; -8x + 16 \\Rightarrow 8x &lt; 16 \\Rightarrow x &lt; 2$.<br><em>Okuma:</em> "$x$, $0$'a $4$'ten daha yakın" — orta nokta $x = 2$'nin solundaki tüm noktalar.<br><strong>Cevap:</strong> $(-\\infty, \\, 2)$.</div></div>
<div class="calc-card"><div class="card-title">ALIŞTIRMA 6</div><div class="card-body">$|x - 2| &lt; x + 1$ eşitsizliğini çöz (tanım önemli).<br><br><em>Tanım:</em> $x + 1 &gt; 0 \\Rightarrow x &gt; -1$.<br><em>Çöz:</em> $-(x + 1) &lt; x - 2 &lt; x + 1$. Sol yarı: $-x - 1 &lt; x - 2 \\Rightarrow x &gt; \\dfrac{1}{2}$. Sağ yarı: $-2 &lt; 1$ her zaman.<br><em>Kesiştir:</em> $x &gt; \\dfrac{1}{2}$ (zaten tanım içinde).<br><strong>Cevap:</strong> $\\left(\\dfrac{1}{2}, \\, \\infty\\right)$.</div></div>
<div class="calc-card"><div class="card-title">ALIŞTIRMA 7</div><div class="card-body">$|3 - 2x| \\le 5$ eşitsizliğini çöz.<br><br><em>Çift eşitsizlik:</em> $-5 \\le 3 - 2x \\le 5$. $3$ çıkar: $-8 \\le -2x \\le 2$. $-2$'ye böl (iki tarafı da çevir): $4 \\ge x \\ge -1$, yani $-1 \\le x \\le 4$.<br><strong>Cevap:</strong> $[-1, \\, 4]$.</div></div>
<div class="calc-card"><div class="card-title">ALIŞTIRMA 8*</div><div class="card-body">Bir cıvatanın çapı $8$ mm olmalı, toleransı $\\pm 0.1$ mm. Kabul edilebilir çaplar $d$ için eşitsizliği yaz ve aralığı bul.<br><br><em>Eşitsizlik:</em> $|d - 8| \\le 0.1$. <em>Çöz:</em> $7.9 \\le d \\le 8.1$.<br><strong>Cevap:</strong> kabul edilebilir aralık $[7.9, \\, 8.1]$ mm.</div></div>
</div>

<div class="think-box"><div class="think-label">SON ÖZET — DERSTEN ÇIKARILACAK ESAS NOKTALAR</div><div class="think-body"><strong>(1)</strong> $|x|$ bir uzaklıktır ($0$'a), o yüzden $|x - a|$ ise $x$'in $a$'ya uzaklığıdır. <strong>(2)</strong> $|x| &lt; a$ ($a &gt; 0$ ile), $-a &lt; x &lt; a$ demek: tek bir sınırlı aralık, VE koşulu. <strong>(3)</strong> $|x| &gt; a$ ($a &gt; 0$ ile), $x &lt; -a$ veya $x &gt; a$ demek: iki sınırsız ışın, VEYA koşulu. <strong>(4)</strong> Sınır durumları: $|f| &lt; 0$ asla, $|f| \\ge 0$ her zaman, $|f| \\le 0$ yalnızca sıfır noktasında. <strong>(5)</strong> $|ax + b| &lt; c$, $-c &lt; ax + b &lt; c$ olarak uzanır; $|ax + b| &gt; c$ ise VEYA bölünmesi olarak uzanır. İçte negatif katsayı eşitsizliği 52. dersteki aynı biçimde çevirir. <strong>(6)</strong> $|f(x)| &lt; |g(x)|$: iki tarafın karesini al (ikisi de non-negatif) ve kareler farkı olarak çarpanlara ayır. <strong>(7)</strong> $|f(x)| &lt; g(x)$: önce $g(x) &gt; 0$ koşulunu zorla, sonra çift eşitsizlik kuralını uygula; tanım kümesi ile kesiştir. <strong>(8)</strong> Üçgen eşitsizliği $|a + b| \\le |a| + |b|$, eşitlik yalnızca $a, b$ aynı işaretli olduğunda. <strong>(9)</strong> Tolerans problemleri doğrudan çevrilir: "$T$'nin $\\delta$ civarında" demek $|x - T| \\le \\delta$.</div></div>
`
};
