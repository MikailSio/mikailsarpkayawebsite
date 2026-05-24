window.LISE_MAT_L52 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>An equation is a sentence with the verb "equals" in it.</strong> The two sides claim to name the same number, and the unknown letter $x$ is whatever value (or values) makes that claim true. A first-degree (linear) equation is the simplest possible such sentence: the unknown appears only to the first power, never squared, never under a root, never inside a sine. Despite this modest appearance, the technique you will learn in this lesson — isolate $x$ by undoing operations in reverse — is the template for every algebraic manoeuvre you will perform for the rest of your mathematical life.</p>

<p class="l-text">After equations come <em>inequalities</em>: the same structure, but the verb is "less than" or "greater than" instead of "equals." Almost every rule carries over unchanged. The one rule that changes — flipping the direction when you multiply or divide by a negative — is the single most common source of mistakes on the YKS (TYT/AYT) and every other Turkish high-school exam. Read this lesson carefully, especially section 7.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise an equation, identify its unknown, and check whether a given number is a solution</li>
<li>Solve any first-degree equation $ax + b = 0$ in four mechanical steps</li>
<li>Detect special cases — infinite solutions ($0 = 0$) and no solution ($0 = 5$) — without panicking</li>
<li>Clear denominators in fractional equations by multiplying through by the common denominator (LCM)</li>
<li>Solve absolute-value equations of the form $|ax + b| = c$ by splitting into two cases</li>
<li>Solve first-degree inequalities, knowing exactly when to flip the inequality sign, and translate word problems (age, speed-time-distance) into algebra</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is an Equation? Two Sides, One Claim</h2>

<div class="calc-highlight"><strong>An equation is a written promise:</strong> "the expression on the left of the $=$ sign and the expression on the right name the same number." The unknown $x$ is a placeholder. <em>Solving</em> the equation means finding every value of $x$ that keeps the promise true.</div>

<p class="l-text">Compare two sentences:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Expression</div><div class="card-body">$3x + 7$ — a recipe. Plug in a number for $x$ and it produces another number. There is nothing to "solve."</div></div>
<div class="calc-card"><div class="card-title">Equation</div><div class="card-body">$3x + 7 = 22$ — a claim. Only certain values of $x$ make the two sides agree. We are asked to find them.</div></div>
<div class="calc-card"><div class="card-title">Identity</div><div class="card-body">$3x + 3x = 6x$ — a claim that is true for <em>every</em> $x$. Identities are equations, but the interesting kind are the ones that pin down $x$ to specific values.</div></div>
</div>

<p class="l-text">A number is called a <strong>solution</strong> (or <em>root</em>) of an equation when substituting it for $x$ turns the equation into a true numerical statement. For example, $x = 5$ is a solution of $3x + 7 = 22$ because $3 \\cdot 5 + 7 = 15 + 7 = 22$, which is true. The number $x = 4$ is <em>not</em> a solution, because $3 \\cdot 4 + 7 = 19 \\ne 22$.</p>

<div class="calc-example"><div class="example-label">QUICK CHECK</div><div class="example-body">Is $x = -2$ a solution of $4x - 3 = -11$?<br><br>Substitute: $4(-2) - 3 = -8 - 3 = -11$. The two sides agree, so <strong>yes</strong>, $x = -2$ is a solution.</div></div>

<div class="l-note"><strong>Notation:</strong> the solution set is written either as a single value $x = 5$ or as a set $\\{5\\}$. For equations with two solutions (like absolute-value equations in section 6) we write $\\{-2, 8\\}$.</div>

<h2 class="lesson-title">2. The First-Degree Equation $ax + b = 0$</h2>

<div class="calc-highlight"><strong>A linear (first-degree) equation in one unknown is any equation that can be rearranged into the standard form $ax + b = 0$, where $a$ and $b$ are known numbers and $a \\ne 0$.</strong> The crucial restriction is $a \\ne 0$: if $a = 0$ the unknown disappears and the equation is no longer about $x$ at all.</div>

<div class="calc-formula"><div class="formula-label">STANDARD FORM</div><div class="formula-main">$$ax + b = 0 \\qquad (a \\ne 0)$$</div><div class="formula-sub">The unique solution is $x = -\\dfrac{b}{a}$. We will derive this in the next section.</div></div>

<p class="l-text">Many equations do not <em>start</em> in this form. They might look like $3x + 7 = 22$, or $5(x - 2) = 2x + 11$, or $\\dfrac{x}{3} + 1 = \\dfrac{x}{2}$. The first step in every problem is the same: <strong>collect every $x$ term on one side and every constant on the other</strong>, leaving an equivalent equation of the form $ax = c$, from which $x = c/a$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a$ — the coefficient</div><div class="card-body">The number multiplying $x$. After collecting, it must be non-zero. If it is zero, you have a special case (section 4).</div></div>
<div class="calc-card"><div class="card-title">$b$ — the constant</div><div class="card-body">The number with no $x$ in it. Sign matters: $-3$ and $+3$ give opposite solutions.</div></div>
<div class="calc-card"><div class="card-title">$x$ — the unknown</div><div class="card-body">Appears to the first power only. No $x^2$, no $\\sqrt{x}$, no $\\sin x$. That is what "first degree" means.</div></div>
</div>

<div class="l-note"><strong>Sanity check on $a \\ne 0$:</strong> if $a = 0$ and $b = 0$, the equation reads $0 = 0$ — true for every $x$ (infinite solutions). If $a = 0$ and $b \\ne 0$, it reads "non-zero $= 0$" — false for every $x$ (no solution). Section 4 handles both.</div>

<h2 class="lesson-title">3. The Four-Step Solving Procedure</h2>

<div class="calc-highlight"><strong>Every first-degree equation, no matter how messy it looks, is solved by the same four steps.</strong> Memorise them as a checklist and you will never get lost in algebra.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Tidy each side</div><div class="card-body">Expand brackets, combine like terms, clear denominators if there are any. After this step, each side of the $=$ sign is a clean sum of $x$ terms and constants.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Collect like to like</div><div class="card-body">Move every $x$ term to the left side and every constant to the right side, changing sign when you cross the equality. You should now have $ax = c$ for some numbers $a$ and $c$.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Divide by $a$</div><div class="card-body">Divide both sides by the coefficient of $x$. This isolates $x$ and gives $x = c/a$.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Verify</div><div class="card-body">Substitute your answer back into the <em>original</em> equation. If both sides agree, you are done. If not, find the arithmetic mistake.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — straightforward</div><div class="example-body">Solve $3x + 7 = 22$.<br><br>Step 1: both sides already tidy.<br>Step 2: subtract 7 from both sides &rarr; $3x = 15$.<br>Step 3: divide both sides by 3 &rarr; $x = 5$.<br>Step 4: check $3 \\cdot 5 + 7 = 22$. <br><br>Solution: $\\mathbf{x = 5}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — brackets and $x$ on both sides</div><div class="example-body">Solve $5(x - 2) = 2x + 11$.<br><br>Step 1: expand the bracket on the left &rarr; $5x - 10 = 2x + 11$.<br>Step 2: subtract $2x$ from both sides &rarr; $3x - 10 = 11$. Then add 10 &rarr; $3x = 21$.<br>Step 3: divide by 3 &rarr; $x = 7$.<br>Step 4: $5(7 - 2) = 25$ and $2 \\cdot 7 + 11 = 25$. <br><br>Solution: $\\mathbf{x = 7}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — negative coefficient</div><div class="example-body">Solve $-4x + 9 = 1$.<br><br>Step 2: subtract 9 &rarr; $-4x = -8$.<br>Step 3: divide both sides by $-4$ &rarr; $x = \\dfrac{-8}{-4} = 2$.<br>Step 4: $-4 \\cdot 2 + 9 = -8 + 9 = 1$. <br><br>Solution: $\\mathbf{x = 2}$. <em>Watch the signs in step 3 — negative divided by negative is positive.</em></div></div>

<div class="calc-graph"><div id="plot-l52-line-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Graphical view:</strong> the equation $3x + 7 = 22$ is equivalent to asking "where does the line $y = 3x + 7$ cross the horizontal line $y = 22$?" The single intersection at $x = 5$ is the solution. Every linear equation in one unknown has this geometric meaning.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=120;i++){var v=-2+12*i/120;xs.push(v);ys.push(3*v+7);}
var line={x:xs,y:ys,mode:'lines',name:'y = 3x + 7',line:{color:'#3b82f6',width:3}};
var hLine={x:[-2,10],y:[22,22],mode:'lines',name:'y = 22',line:{color:'#f59e0b',width:2,dash:'dash'}};
var sol={x:[5],y:[22],mode:'markers+text',name:'solution',marker:{color:'#22c55e',size:12},text:['x = 5'],textposition:'top right',textfont:{color:'#22c55e',size:13}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,40],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l52-line-en',[line,hLine,sol],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why the verification step is not optional.</strong> Arithmetic mistakes — a forgotten minus sign, a misplaced decimal — are the single biggest source of lost points on Turkish high-school exams. A 10-second substitution catches almost all of them.</div>

<h2 class="lesson-title">4. Special Cases: Infinite Solutions and No Solution</h2>

<div class="calc-highlight"><strong>Two pathological things can happen at the end of Step 2.</strong> The coefficient of $x$ might vanish, leaving an equation with no $x$ at all. What that residual equation says — true or false — decides the fate of the original problem.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">CASE A — Infinite solutions</div><div class="compare-item">Step 2 leaves you with $0 = 0$ (or another true numerical statement).</div><div class="compare-item">The two sides of the original equation were already identical after simplification.</div><div class="compare-item">Every real number is a solution. Write $x \\in \\mathbb{R}$.</div><div class="compare-item">Example: $2(x + 3) = 2x + 6$.</div></div><div class="compare-col"><div class="compare-title">CASE B — No solution</div><div class="compare-item">Step 2 leaves you with something like $0 = 5$ — a false numerical statement.</div><div class="compare-item">The two sides claimed to be equal, but they always differ by a constant.</div><div class="compare-item">No real number satisfies the equation. Write $x \\in \\varnothing$ (empty set).</div><div class="compare-item">Example: $2(x + 3) = 2x + 11$.</div></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Case A</div><div class="example-body">Solve $3(x + 4) - 2 = 3x + 10$.<br><br>Expand left: $3x + 12 - 2 = 3x + 10$ &rarr; $3x + 10 = 3x + 10$.<br>Subtract $3x$ from both sides: $10 = 10$. True for every $x$.<br><br>Solution set: $\\mathbf{x \\in \\mathbb{R}}$ (the equation is an <em>identity</em>).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Case B</div><div class="example-body">Solve $4x - 7 = 4x + 3$.<br><br>Subtract $4x$ from both sides: $-7 = 3$. False.<br><br>Solution set: $\\mathbf{x \\in \\varnothing}$ (no real number works).</div></div>

<div class="think-box"><div class="think-label">GEOMETRIC PICTURE</div><div class="think-body">Case A: the two lines $y = 3x + 10$ and $y = 3x + 10$ are literally the same line — they overlap at every point, so there are infinitely many "intersections." Case B: the two lines $y = 4x - 7$ and $y = 4x + 3$ are <em>parallel</em> (same slope, different intercept) — they never meet.</div></div>

<h2 class="lesson-title">5. Fractional Equations: Clearing Denominators</h2>

<div class="calc-highlight"><strong>When an equation has fractions, multiply both sides by the LCM (least common multiple) of all denominators.</strong> Every fraction collapses into an integer expression and the rest of the solve proceeds exactly as before.</div>

<div class="calc-formula"><div class="formula-label">THE LCM TRICK</div><div class="formula-main">$$\\frac{x}{2} + \\frac{x}{3} = 5 \\quad\\xrightarrow{\\;\\times \\, 6\\;}\\quad 3x + 2x = 30 \\;\\Longrightarrow\\; 5x = 30 \\;\\Longrightarrow\\; x = 6$$</div><div class="formula-sub">$\\mathrm{LCM}(2, 3) = 6$. Multiplying every term by 6 clears both denominators in one stroke.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $\\dfrac{x - 1}{4} + \\dfrac{x + 2}{3} = 2$.<br><br>$\\mathrm{LCM}(4, 3) = 12$. Multiply every term by 12:<br>$3(x - 1) + 4(x + 2) = 24$<br>$3x - 3 + 4x + 8 = 24$<br>$7x + 5 = 24 \\;\\Longrightarrow\\; 7x = 19 \\;\\Longrightarrow\\; x = \\dfrac{19}{7}$.<br><br>Solution: $\\mathbf{x = \\dfrac{19}{7}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — variable in the denominator</div><div class="example-body">Solve $\\dfrac{2}{x - 1} = \\dfrac{3}{x + 4}$ (assume $x \\ne 1$ and $x \\ne -4$).<br><br>Cross-multiply: $2(x + 4) = 3(x - 1)$.<br>$2x + 8 = 3x - 3 \\;\\Longrightarrow\\; -x = -11 \\;\\Longrightarrow\\; x = 11$.<br>Check the restriction: $11 \\ne 1$ and $11 \\ne -4$. <br><br>Solution: $\\mathbf{x = 11}$.</div></div>

<div class="l-note"><strong>Always state the restriction.</strong> An equation like $\\dfrac{1}{x - 3} = 5$ silently assumes $x \\ne 3$ (the denominator would be zero). When you solve, check that your answer respects this restriction. If it does not, the answer is rejected and the equation has no solution.</div>

<h2 class="lesson-title">6. Absolute-Value Equations of the First Degree</h2>

<div class="calc-highlight"><strong>The absolute value $|y|$ is the distance of $y$ from zero on the number line.</strong> Distance is always non-negative. So $|y| = c$ has solutions only when $c \\ge 0$, and in that case it splits into two cases: $y = c$ or $y = -c$.</div>

<div class="calc-formula"><div class="formula-label">THE SPLIT RULE</div><div class="formula-main">$$|ax + b| = c \\quad\\Longleftrightarrow\\quad ax + b = c \\;\\text{ or }\\; ax + b = -c \\qquad (c \\ge 0)$$</div><div class="formula-sub">Two ordinary first-degree equations replace one absolute-value equation. If $c &lt; 0$ there is no solution at all.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $|x - 3| = 5$.<br><br>Split: $x - 3 = 5$ or $x - 3 = -5$.<br>First: $x = 8$. Second: $x = -2$.<br><br>Solution set: $\\mathbf{\\{-2, 8\\}}$. <em>Geometric reading:</em> "all numbers whose distance from 3 is exactly 5." Those are $3 + 5 = 8$ and $3 - 5 = -2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Solve $|2x + 1| = 7$.<br><br>Split: $2x + 1 = 7$ or $2x + 1 = -7$.<br>First: $2x = 6$ &rarr; $x = 3$. Second: $2x = -8$ &rarr; $x = -4$.<br><br>Solution set: $\\mathbf{\\{-4, 3\\}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — impossible case</div><div class="example-body">Solve $|3x - 5| = -2$.<br><br>An absolute value cannot equal a negative number. <br><br>Solution set: $\\mathbf{\\varnothing}$ (no solution).</div></div>

<div class="think-box"><div class="think-label">SANITY CHECK</div><div class="think-body">Before solving, glance at the right-hand side. If it is negative, write "no solution" and move on. Spending three minutes algebraically deriving "no solution" when you can see it in one second is wasted exam time.</div></div>

<h2 class="lesson-title">7. First-Degree Inequalities</h2>

<div class="calc-highlight"><strong>An inequality says one side is smaller (or larger) than the other.</strong> The four symbols are $&lt;$ (strictly less), $\\le$ (less than or equal), $&gt;$ (strictly greater), $\\ge$ (greater than or equal). The solving rules mirror equations exactly, with one critical exception you must commit to memory.</div>

<div class="calc-formula"><div class="formula-label">THE INEQUALITY RULES</div><div class="formula-main">$$\\begin{aligned} a &lt; b &amp;\\;\\Longleftrightarrow\\; a + c &lt; b + c \\\\ a &lt; b &amp;\\;\\Longleftrightarrow\\; ka &lt; kb \\quad (k &gt; 0) \\\\ a &lt; b &amp;\\;\\Longleftrightarrow\\; ka &gt; kb \\quad (k &lt; 0) \\quad \\Leftarrow \\text{ flip!} \\end{aligned}$$</div><div class="formula-sub">Adding/subtracting any number to both sides keeps the direction. Multiplying or dividing by a <em>positive</em> number keeps the direction. Multiplying or dividing by a <em>negative</em> number reverses it.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — no flip</div><div class="example-body">Solve $3x + 5 \\le 14$.<br><br>$3x \\le 9 \\;\\Longrightarrow\\; x \\le 3$.<br><br>Solution set: $\\mathbf{(-\\infty, 3]}$ on the real line, or equivalently $\\{x \\in \\mathbb{R} : x \\le 3\\}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — flip required</div><div class="example-body">Solve $-2x + 7 &gt; 1$.<br><br>$-2x &gt; -6$. Now divide by $-2$ — <strong>flip the sign</strong>:<br>$x &lt; 3$.<br><br>Solution set: $\\mathbf{(-\\infty, 3)}$ — an open interval, $x = 3$ excluded because the inequality is strict.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — double inequality</div><div class="example-body">Solve $-5 &lt; 2x - 1 \\le 7$.<br><br>Treat all three parts simultaneously. Add 1 everywhere: $-4 &lt; 2x \\le 8$. Divide by 2 everywhere (positive — no flip): $-2 &lt; x \\le 4$.<br><br>Solution set: $\\mathbf{(-2, \\, 4]}$.</div></div>

<div class="calc-graph"><div id="plot-l52-numberline-en" class="plotly-graph" style="height:280px"></div><div class="graph-caption"><strong>Number-line picture:</strong> the solution set $-2 &lt; x \\le 4$ is the half-open interval shown in blue. Open circle at $x = -2$ (excluded), filled circle at $x = 4$ (included). Reading a number-line picture is faster than reading interval notation, especially under exam pressure.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[-2,4],y:[0,0],mode:'lines',name:'solution interval',line:{color:'#3b82f6',width:6}};
var openL={x:[-2],y:[0],mode:'markers',name:'x = −2 (excluded)',marker:{color:'#0a0a0a',size:16,line:{color:'#3b82f6',width:3}}};
var closedR={x:[4],y:[0],mode:'markers',name:'x = 4 (included)',marker:{color:'#3b82f6',size:16}};
var ticks={x:[-5,-4,-3,-2,-1,0,1,2,3,4,5,6],y:[0,0,0,0,0,0,0,0,0,0,0,0],mode:'markers+text',name:'real line',marker:{color:'rgba(255,255,255,0.35)',size:4},text:['−5','−4','−3','−2','−1','0','1','2','3','4','5','6'],textposition:'bottom center',textfont:{color:'rgba(235,230,220,0.7)',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-6,7],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},yaxis:{range:[-0.5,0.8],gridcolor:'rgba(0,0,0,0)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},margin:{t:20,r:30,b:30,l:30},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l52-numberline-en',[ticks,seg,openL,closedR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The flip rule — never forget.</strong> Whenever you multiply or divide both sides of an inequality by a negative number, the inequality sign reverses direction. $&lt;$ becomes $&gt;$, $\\le$ becomes $\\ge$, and vice versa. Forgetting this single rule loses students more points on YKS than any other single mistake in algebra.</div>

<h2 class="lesson-title">8. Word Problem 1 — The Age Problem</h2>

<div class="calc-highlight"><strong>Word problems are equation problems in disguise.</strong> The skill is translation: convert each sentence in the prompt into an algebraic statement, then solve. A small table is the most reliable translation tool.</div>

<p class="l-text"><strong>Problem.</strong> Ali is currently 8 years older than Ayşe. In 5 years' time, Ali's age will be twice Ayşe's age. Find their current ages.</p>

<p class="l-text"><strong>Translation table.</strong> Let $x$ = Ayşe's current age.</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Person</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Now</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">In 5 years</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Ayşe</td><td style="padding:0.5rem 0.8rem">$x$</td><td style="padding:0.5rem 0.8rem">$x + 5$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Ali</td><td style="padding:0.5rem 0.8rem">$x + 8$</td><td style="padding:0.5rem 0.8rem">$x + 13$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Equation.</strong> "Ali's age in 5 years will be twice Ayşe's age in 5 years":</p>

<div class="calc-formula"><div class="formula-main">$$x + 13 = 2(x + 5)$$</div></div>

<p class="l-text"><strong>Solve.</strong> $x + 13 = 2x + 10 \\;\\Longrightarrow\\; 3 = x$. So Ayşe is currently <strong>3</strong> and Ali is <strong>11</strong>. <em>Check:</em> in 5 years they will be 8 and 16, and $16 = 2 \\cdot 8$. Confirmed.</p>

<h2 class="lesson-title">9. Word Problem 2 — Speed, Time, Distance</h2>

<div class="calc-highlight"><strong>The universal formula:</strong> $\\text{distance} = \\text{speed} \\times \\text{time}$, or $d = v \\cdot t$. Two of the three are usually given (or expressible in terms of $x$); the third is what you want.</div>

<p class="l-text"><strong>Problem.</strong> A car leaves city A heading towards city B at a constant speed of 60 km/h. Two hours later a second car leaves the same point in the same direction at 90 km/h. How many hours after the second car's departure do the two cars meet?</p>

<p class="l-text"><strong>Setup.</strong> Let $t$ be the number of hours that have elapsed since the second car set off. When they meet, both cars are at the same distance from city A.</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Vehicle</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Speed (km/h)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Time on road (h)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Distance (km)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">First car</td><td style="padding:0.5rem 0.8rem">60</td><td style="padding:0.5rem 0.8rem">$t + 2$</td><td style="padding:0.5rem 0.8rem">$60(t + 2)$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Second car</td><td style="padding:0.5rem 0.8rem">90</td><td style="padding:0.5rem 0.8rem">$t$</td><td style="padding:0.5rem 0.8rem">$90t$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Equation.</strong> Distances equal at the meeting moment:</p>

<div class="calc-formula"><div class="formula-main">$$60(t + 2) = 90t$$</div></div>

<p class="l-text"><strong>Solve.</strong> $60t + 120 = 90t \\;\\Longrightarrow\\; 120 = 30t \\;\\Longrightarrow\\; t = 4$. The second car catches up <strong>4 hours</strong> after it sets off (6 hours after the first car). The meeting point is $90 \\cdot 4 = 360$ km from city A.</p>

<div class="calc-graph"><div id="plot-l52-meet-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Distance-time picture:</strong> the two straight lines plot distance from city A versus time. They intersect at $(t, d) = (4, 360)$, the moment and place where the second car overtakes the first. The slope of each line is its speed; the second line is steeper because its car is faster.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t1=[];var d1=[];for(var i=0;i<=8;i++){t1.push(i);d1.push(60*(i+2));}
var t2=[];var d2=[];for(var i=0;i<=8;i++){t2.push(i);d2.push(90*i);}
var car1={x:t1,y:d1,mode:'lines',name:'first car (60 km/h)',line:{color:'#f59e0b',width:3}};
var car2={x:t2,y:d2,mode:'lines',name:'second car (90 km/h)',line:{color:'#3b82f6',width:3}};
var meet={x:[4],y:[360],mode:'markers+text',name:'meeting point',marker:{color:'#22c55e',size:14},text:['(4 h, 360 km)'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (hours after second car departs)',range:[0,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'distance from city A (km)',range:[0,650],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:55,l:65},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l52-meet-en',[car1,car2,meet],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Classical Exercises</h2>

<div class="calc-highlight">Eight problems mixing equations, inequalities, and word problems. Try each one with paper and pencil before reading the answer. The asterisk (*) marks the harder ones.</div>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Solve $7x - 4 = 3x + 12$.<br><br><em>Answer:</em> $4x = 16 \\;\\Longrightarrow\\; \\mathbf{x = 4}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">Solve $\\dfrac{2x - 1}{5} = \\dfrac{x + 3}{4}$.<br><br><em>Answer:</em> cross-multiply: $4(2x - 1) = 5(x + 3) \\;\\Rightarrow\\; 8x - 4 = 5x + 15 \\;\\Rightarrow\\; 3x = 19 \\;\\Rightarrow\\; \\mathbf{x = \\dfrac{19}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body">Solve $|2x - 7| = 9$.<br><br><em>Answer:</em> $2x - 7 = 9$ gives $x = 8$; $2x - 7 = -9$ gives $x = -1$. Solution set: $\\mathbf{\\{-1, 8\\}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">Solve $-3x + 8 \\le 2x - 7$.<br><br><em>Answer:</em> $-5x \\le -15$. Divide by $-5$ and <strong>flip</strong>: $\\mathbf{x \\ge 3}$, i.e. interval $[3, +\\infty)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5*</div><div class="example-body">For what values of $m$ does the equation $(m - 2)x = 5$ have no solution?<br><br><em>Answer:</em> "no solution" means the coefficient of $x$ is zero while the right side is non-zero. Coefficient zero: $m - 2 = 0 \\;\\Rightarrow\\; m = 2$. Right side then is 5 (non-zero). So $\\mathbf{m = 2}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — age problem</div><div class="example-body">A father is currently three times as old as his son. In 12 years, he will be only twice as old. How old is each now?<br><br><em>Setup:</em> son = $x$, father = $3x$. In 12 years: son = $x + 12$, father = $3x + 12$.<br><em>Equation:</em> $3x + 12 = 2(x + 12) \\;\\Rightarrow\\; 3x + 12 = 2x + 24 \\;\\Rightarrow\\; x = 12$.<br><em>Answer:</em> son is <strong>12</strong>, father is <strong>36</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 — speed-time</div><div class="example-body">A train travels from A to B at 80 km/h and returns at 120 km/h. The total round-trip time is 5 hours. What is the distance from A to B?<br><br><em>Setup:</em> distance one way = $d$. Time out: $d/80$. Time back: $d/120$.<br><em>Equation:</em> $\\dfrac{d}{80} + \\dfrac{d}{120} = 5$. LCM is 240: $3d + 2d = 1200 \\;\\Rightarrow\\; 5d = 1200 \\;\\Rightarrow\\; d = 240$.<br><em>Answer:</em> <strong>240 km</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8* — mixed inequality and absolute value</div><div class="example-body">Solve $|x - 4| &lt; 6$.<br><br><em>Reasoning:</em> "distance from 4 is less than 6" means $-6 &lt; x - 4 &lt; 6$, i.e. $-2 &lt; x &lt; 10$.<br><em>Answer:</em> the open interval $\\mathbf{(-2, \\, 10)}$. <em>(We will study absolute-value inequalities in depth in later lessons; the geometric reading is the fastest route for now.)</em></div></div>

<div class="think-box"><div class="think-label">FINAL SUMMARY — WHAT TO TAKE FROM THIS LESSON</div><div class="think-body"><strong>(1)</strong> An equation is two expressions claiming to be equal; a solution makes the claim true. <strong>(2)</strong> Every first-degree equation reduces to $ax + b = 0$, solved in four steps: tidy, collect, divide, verify. <strong>(3)</strong> Two pathological cases — $0 = 0$ (infinite solutions) and $0 = c$ with $c \\ne 0$ (no solution) — appear when the $x$ coefficient vanishes. <strong>(4)</strong> Fractional equations: multiply through by the LCM of denominators. <strong>(5)</strong> Absolute-value equation $|y| = c$: split into $y = c$ or $y = -c$ when $c \\ge 0$, otherwise no solution. <strong>(6)</strong> Inequalities follow the same rules as equations, except multiplying or dividing by a negative <em>flips the sign</em>. <strong>(7)</strong> Word problems: build a translation table, write the equation, solve, then verify against the original sentence.</div></div>
`,

/* ============================================================
   TÜRKÇE VERSİYON
   ============================================================ */
tr: `<p class="l-text"><strong>Denklem, içinde "eşittir" fiili geçen bir cümledir.</strong> İki taraf da aynı sayıyı adlandırdığını iddia eder; bilinmeyen $x$ harfi de bu iddiayı doğru kılan değer (ya da değerler) için kullanılan bir yer tutucudur. Birinci derece (lineer) denklem ise bu tür cümlelerin en yalın hâlidir: bilinmeyen yalnızca birinci kuvvetten görünür — karesi alınmaz, kök içine girmez, sinüsün argümanı olmaz. Bu mütevazı görünüşe rağmen, dersin öğreteceği teknik — işlemleri ters sırayla geri alarak $x$'i yalnız bırakmak — geri kalan tüm matematiksel hayatın için kullanacağın cebir hamlesinin şablonudur.</p>

<p class="l-text">Denklemlerin ardından <em>eşitsizlikler</em> gelir: aynı yapı, ama "eşittir" yerine "küçüktür" veya "büyüktür" fiili. Hemen hemen bütün kurallar aynı kalır. Değişen tek bir kural vardır — negatif bir sayıyla çarptığında ya da böldüğünde yön değiştirme — ve bu kural, hem YKS'de (TYT/AYT) hem de tüm lise sınavlarında en çok puan kaybettiren tek hata kaynağıdır. Bölüm 7'yi özellikle dikkatle oku.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir denklemi tanıyacak, bilinmeyenini belirleyecek ve verilen bir sayının çözüm olup olmadığını kontrol edebileceksin</li>
<li>$ax + b = 0$ biçimindeki her birinci derece denklemi dört mekanik adımda çözeceksin</li>
<li>Özel durumları — sonsuz çözüm ($0 = 0$) ve çözümsüzlük ($0 = 5$) — paniğe kapılmadan ayırt edeceksin</li>
<li>Kesirli denklemlerde paydaların en küçük ortak katı (EKOK) ile çarparak kesirleri tek seferde temizleyebileceksin</li>
<li>$|ax + b| = c$ biçimindeki mutlak değerli denklemleri iki duruma ayırarak çözeceksin</li>
<li>Birinci derece eşitsizlikleri çözecek, eşitsizlik yönünü ne zaman çevireceğini tam olarak bilecek ve sözel problemleri (yaş, hız-zaman-yol) cebire çevirebileceksin</li>
</ul>
</div>

<h2 class="lesson-title">1. Denklem Nedir? İki Taraf, Tek İddia</h2>

<div class="calc-highlight"><strong>Bir denklem, yazılı bir vaattir:</strong> "$=$ işaretinin solundaki ifade ile sağındaki ifade aynı sayıyı adlandırır." Bilinmeyen $x$ bir yer tutucudur. Denklemi <em>çözmek</em>, bu vaadi doğru kılan tüm $x$ değerlerini bulmak demektir.</div>

<p class="l-text">Aşağıdaki üç cümleyi karşılaştır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İfade</div><div class="card-body">$3x + 7$ — bir tarif. $x$ yerine sayı koyarsın, sana başka bir sayı verir. Çözülecek hiçbir şey yoktur.</div></div>
<div class="calc-card"><div class="card-title">Denklem</div><div class="card-body">$3x + 7 = 22$ — bir iddia. Yalnızca belirli $x$ değerleri iki tarafı eşit kılar. Bu değerleri bulmamız istenir.</div></div>
<div class="calc-card"><div class="card-title">Özdeşlik</div><div class="card-body">$3x + 3x = 6x$ — <em>her</em> $x$ için doğru olan bir iddia. Özdeşlikler de denklemdir ama ilginç olanları, $x$'i belirli değerlere kilitleyenlerdir.</div></div>
</div>

<p class="l-text">Bir denklemin <strong>çözümü</strong> (ya da <em>kökü</em>), yerine konulduğunda denklemi doğru bir sayısal ifadeye dönüştüren sayıdır. Mesela $x = 5$ değeri $3x + 7 = 22$ denkleminin çözümüdür çünkü $3 \\cdot 5 + 7 = 15 + 7 = 22$, ve bu doğrudur. Buna karşılık $x = 4$ çözüm <em>değildir</em>: $3 \\cdot 4 + 7 = 19 \\ne 22$.</p>

<div class="calc-example"><div class="example-label">HIZLI KONTROL</div><div class="example-body">$x = -2$ değeri $4x - 3 = -11$ denkleminin çözümü müdür?<br><br>Yerine koyalım: $4(-2) - 3 = -8 - 3 = -11$. İki taraf eşittir; o hâlde <strong>evet</strong>, $x = -2$ bir çözümdür.</div></div>

<div class="l-note"><strong>Gösterim:</strong> çözüm kümesi ya tek bir değer olarak $x = 5$, ya da küme biçiminde $\\{5\\}$ yazılır. İki çözümü olan denklemlerde (örneğin bölüm 6'daki mutlak değerli denklemler) $\\{-2, 8\\}$ gibi yazarız.</div>

<h2 class="lesson-title">2. Birinci Derece Denklem $ax + b = 0$</h2>

<div class="calc-highlight"><strong>Tek bilinmeyenli lineer (birinci derece) denklem, $ax + b = 0$ standart biçimine getirilebilen denklemdir.</strong> Burada $a$ ve $b$ bilinen sayılar, $a \\ne 0$ koşulu da kritiktir: $a = 0$ olursa bilinmeyen kaybolur ve denklem artık $x$ hakkında bir şey söylemez.</div>

<div class="calc-formula"><div class="formula-label">STANDART BİÇİM</div><div class="formula-main">$$ax + b = 0 \\qquad (a \\ne 0)$$</div><div class="formula-sub">Tek çözümü $x = -\\dfrac{b}{a}$ olur. Bunu bir sonraki bölümde türeteceğiz.</div></div>

<p class="l-text">Karşına çıkacak çoğu denklem bu biçimde <em>başlamaz</em>. Onları $3x + 7 = 22$, ya da $5(x - 2) = 2x + 11$, ya da $\\dfrac{x}{3} + 1 = \\dfrac{x}{2}$ gibi görürsün. Her problemde ilk adım aynıdır: <strong>tüm $x$'li terimleri bir tarafa, tüm sabitleri diğer tarafa topla</strong>; geriye eşdeğer $ax = c$ biçiminde bir denklem kalır ve oradan $x = c/a$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a$ — katsayı</div><div class="card-body">$x$'i çarpan sayı. Topladıktan sonra mutlaka sıfırdan farklı olmalı. Sıfırsa özel duruma düşmüşsündür (bölüm 4).</div></div>
<div class="calc-card"><div class="card-title">$b$ — sabit terim</div><div class="card-body">İçinde $x$ bulunmayan sayı. İşaret çok önemli: $-3$ ile $+3$ ters işaretli çözümler verir.</div></div>
<div class="calc-card"><div class="card-title">$x$ — bilinmeyen</div><div class="card-body">Yalnızca birinci kuvvet. $x^2$ yok, $\\sqrt{x}$ yok, $\\sin x$ yok. "Birinci derece" demek tam olarak budur.</div></div>
</div>

<div class="l-note"><strong>$a \\ne 0$ koşulunun mantığı:</strong> Eğer $a = 0$ ve $b = 0$ olursa denklem $0 = 0$ olur — her $x$ için doğrudur (sonsuz çözüm). Eğer $a = 0$ ama $b \\ne 0$ ise "sıfırdan farklı = 0" olur — hiçbir $x$ için doğru değildir (çözüm yok). İki durumu da bölüm 4 ayrıntılı işler.</div>

<h2 class="lesson-title">3. Dört Adımlı Çözüm Yöntemi</h2>

<div class="calc-highlight"><strong>Her birinci derece denklem, dış görünüşü ne kadar karmaşık olursa olsun, aynı dört adımla çözülür.</strong> Bu adımları bir kontrol listesi gibi belle, cebirde kaybolmazsın.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Her tarafı sadeleştir</div><div class="card-body">Parantezleri aç, benzer terimleri topla, varsa paydaları temizle. Bu adım bittiğinde $=$ işaretinin her iki yanı, $x$'li terimler ile sabitlerin temiz bir toplamı olur.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Benzeri benzerin yanına</div><div class="card-body">$x$'li tüm terimleri sol tarafa, sabitleri sağ tarafa taşı; eşitliği geçerken işaret değiştir. Sonunda elinde $ax = c$ kalmış olmalı.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — $a$'ya böl</div><div class="card-body">Her iki tarafı $x$'in katsayısına böl. Bu, $x$'i yalnız bırakır ve $x = c/a$ verir.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — Doğrula</div><div class="card-body">Cevabını <em>orijinal</em> denkleme geri koy. İki taraf eşitse bitirdin. Eşit değilse aritmetik hatayı bul.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — düz uygulama</div><div class="example-body">$3x + 7 = 22$ denklemini çöz.<br><br>Adım 1: iki taraf zaten sade.<br>Adım 2: iki taraftan 7 çıkar &rarr; $3x = 15$.<br>Adım 3: iki tarafı 3'e böl &rarr; $x = 5$.<br>Adım 4: kontrol — $3 \\cdot 5 + 7 = 22$. <br><br>Çözüm: $\\mathbf{x = 5}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — parantezler ve iki tarafta $x$</div><div class="example-body">$5(x - 2) = 2x + 11$ denklemini çöz.<br><br>Adım 1: sol taraftaki parantezi aç &rarr; $5x - 10 = 2x + 11$.<br>Adım 2: iki taraftan $2x$ çıkar &rarr; $3x - 10 = 11$. Sonra 10 ekle &rarr; $3x = 21$.<br>Adım 3: 3'e böl &rarr; $x = 7$.<br>Adım 4: $5(7 - 2) = 25$ ve $2 \\cdot 7 + 11 = 25$. <br><br>Çözüm: $\\mathbf{x = 7}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — negatif katsayı</div><div class="example-body">$-4x + 9 = 1$ denklemini çöz.<br><br>Adım 2: 9 çıkar &rarr; $-4x = -8$.<br>Adım 3: iki tarafı $-4$'e böl &rarr; $x = \\dfrac{-8}{-4} = 2$.<br>Adım 4: $-4 \\cdot 2 + 9 = -8 + 9 = 1$. <br><br>Çözüm: $\\mathbf{x = 2}$. <em>3. adımdaki işaretlere dikkat — negatifin negatife bölümü pozitif.</em></div></div>

<div class="calc-graph"><div id="plot-l52-line-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiksel yorum:</strong> $3x + 7 = 22$ denklemi, "$y = 3x + 7$ doğrusu $y = 22$ yatay doğrusunu nerede keser?" sorusuna eşdeğerdir. $x = 5$ noktasındaki tek kesişim çözümdür. Tek bilinmeyenli her lineer denklem bu geometrik anlama sahiptir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=120;i++){var v=-2+12*i/120;xs.push(v);ys.push(3*v+7);}
var line={x:xs,y:ys,mode:'lines',name:'y = 3x + 7',line:{color:'#3b82f6',width:3}};
var hLine={x:[-2,10],y:[22,22],mode:'lines',name:'y = 22',line:{color:'#f59e0b',width:2,dash:'dash'}};
var sol={x:[5],y:[22],mode:'markers+text',name:'çözüm',marker:{color:'#22c55e',size:12},text:['x = 5'],textposition:'top right',textfont:{color:'#22c55e',size:13}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,40],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l52-line-tr',[line,hLine,sol],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Doğrulama adımı opsiyonel değil.</strong> Aritmetik hatalar — unutulan eksi işareti, kayan virgül — Türk lise sınavlarında kaybettiren en büyük tek nedendir. 10 saniyelik bir yerine koyma kontrolü neredeyse tamamını yakalar.</div>

<h2 class="lesson-title">4. Özel Durumlar: Sonsuz Çözüm ve Çözümsüzlük</h2>

<div class="calc-highlight"><strong>2. adımın sonunda iki patolojik şey olabilir.</strong> $x$'in katsayısı sıfırlanabilir ve geriye içinde $x$ kalmayan bir denklem kalır. Bu kalan denklem ne söylüyorsa — doğru mu yanlış mı — orijinal sorunun kaderini belirler.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DURUM A — Sonsuz çözüm</div><div class="compare-item">2. adım sonunda $0 = 0$ (ya da başka doğru bir sayısal ifade) kalır.</div><div class="compare-item">Orijinal denklemin iki tarafı sadeleştirme sonrasında zaten aynıydı.</div><div class="compare-item">Her reel sayı çözümdür. $x \\in \\mathbb{R}$ yaz.</div><div class="compare-item">Örnek: $2(x + 3) = 2x + 6$.</div></div><div class="compare-col"><div class="compare-title">DURUM B — Çözümsüzlük</div><div class="compare-item">2. adım sonunda $0 = 5$ gibi yanlış bir sayısal ifade kalır.</div><div class="compare-item">İki taraf eşit olduğunu iddia ediyordu ama aralarındaki fark her zaman sabit.</div><div class="compare-item">Hiçbir reel sayı denklemi sağlamaz. $x \\in \\varnothing$ (boş küme) yaz.</div><div class="compare-item">Örnek: $2(x + 3) = 2x + 11$.</div></div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — Durum A</div><div class="example-body">$3(x + 4) - 2 = 3x + 10$ denklemini çöz.<br><br>Sol tarafı aç: $3x + 12 - 2 = 3x + 10$ &rarr; $3x + 10 = 3x + 10$.<br>İki taraftan $3x$ çıkar: $10 = 10$. Her $x$ için doğru.<br><br>Çözüm kümesi: $\\mathbf{x \\in \\mathbb{R}}$ (denklem bir <em>özdeşlik</em>tir).</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — Durum B</div><div class="example-body">$4x - 7 = 4x + 3$ denklemini çöz.<br><br>İki taraftan $4x$ çıkar: $-7 = 3$. Yanlış.<br><br>Çözüm kümesi: $\\mathbf{x \\in \\varnothing}$ (hiçbir reel sayı işe yaramaz).</div></div>

<div class="think-box"><div class="think-label">GEOMETRİK GÖRÜNTÜ</div><div class="think-body">Durum A: $y = 3x + 10$ ve $y = 3x + 10$ doğruları tam tamına aynı doğru — her noktada üst üste binerler, dolayısıyla "sonsuz kesişim" vardır. Durum B: $y = 4x - 7$ ve $y = 4x + 3$ doğruları <em>paralel</em> (aynı eğim, farklı kesişim) — hiç buluşmazlar.</div></div>

<h2 class="lesson-title">5. Kesirli Denklemler: Paydadan Kurtulma</h2>

<div class="calc-highlight"><strong>Bir denklemde kesir varsa, iki tarafı tüm paydaların EKOK'u (en küçük ortak katı) ile çarp.</strong> Bütün kesirler tek hamlede tam sayılı bir ifadeye dönüşür ve geri kalan çözüm tam olarak öncekiyle aynı ilerler.</div>

<div class="calc-formula"><div class="formula-label">EKOK YÖNTEMİ</div><div class="formula-main">$$\\frac{x}{2} + \\frac{x}{3} = 5 \\quad\\xrightarrow{\\;\\times \\, 6\\;}\\quad 3x + 2x = 30 \\;\\Longrightarrow\\; 5x = 30 \\;\\Longrightarrow\\; x = 6$$</div><div class="formula-sub">$\\mathrm{EKOK}(2, 3) = 6$. Her terimi 6 ile çarpınca iki payda da tek hamlede yok olur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$\\dfrac{x - 1}{4} + \\dfrac{x + 2}{3} = 2$ denklemini çöz.<br><br>$\\mathrm{EKOK}(4, 3) = 12$. Her terimi 12 ile çarp:<br>$3(x - 1) + 4(x + 2) = 24$<br>$3x - 3 + 4x + 8 = 24$<br>$7x + 5 = 24 \\;\\Longrightarrow\\; 7x = 19 \\;\\Longrightarrow\\; x = \\dfrac{19}{7}$.<br><br>Çözüm: $\\mathbf{x = \\dfrac{19}{7}}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — paydada bilinmeyen</div><div class="example-body">$\\dfrac{2}{x - 1} = \\dfrac{3}{x + 4}$ denklemini çöz ($x \\ne 1$ ve $x \\ne -4$ kabul edilir).<br><br>Çapraz çarp: $2(x + 4) = 3(x - 1)$.<br>$2x + 8 = 3x - 3 \\;\\Longrightarrow\\; -x = -11 \\;\\Longrightarrow\\; x = 11$.<br>Kısıtı kontrol et: $11 \\ne 1$ ve $11 \\ne -4$. <br><br>Çözüm: $\\mathbf{x = 11}$.</div></div>

<div class="l-note"><strong>Kısıtı her zaman belirt.</strong> $\\dfrac{1}{x - 3} = 5$ gibi bir denklem sessizce $x \\ne 3$ olduğunu varsayar (payda sıfır olamaz). Çözdüğünde cevabının bu kısıtı sağlayıp sağlamadığını kontrol et. Sağlamıyorsa cevap reddedilir ve denklem çözümsüzdür.</div>

<h2 class="lesson-title">6. Birinci Derece Mutlak Değerli Denklemler</h2>

<div class="calc-highlight"><strong>$|y|$ mutlak değeri, $y$ sayısının sayı doğrusunda sıfıra olan uzaklığıdır.</strong> Uzaklık her zaman negatif değildir. Dolayısıyla $|y| = c$ denkleminin çözümü olabilmesi için $c \\ge 0$ gerekir, ve bu durumda iki duruma ayrılır: $y = c$ veya $y = -c$.</div>

<div class="calc-formula"><div class="formula-label">AYRIŞTIRMA KURALI</div><div class="formula-main">$$|ax + b| = c \\quad\\Longleftrightarrow\\quad ax + b = c \\;\\text{ veya }\\; ax + b = -c \\qquad (c \\ge 0)$$</div><div class="formula-sub">Tek bir mutlak değerli denklemin yerine iki sıradan birinci derece denklem geçer. Eğer $c &lt; 0$ ise hiç çözüm yoktur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$|x - 3| = 5$ denklemini çöz.<br><br>Ayrıştır: $x - 3 = 5$ veya $x - 3 = -5$.<br>Birincisi: $x = 8$. İkincisi: $x = -2$.<br><br>Çözüm kümesi: $\\mathbf{\\{-2, 8\\}}$. <em>Geometrik okuma:</em> "3'e uzaklığı tam 5 olan tüm sayılar." Bunlar $3 + 5 = 8$ ve $3 - 5 = -2$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body">$|2x + 1| = 7$ denklemini çöz.<br><br>Ayrıştır: $2x + 1 = 7$ veya $2x + 1 = -7$.<br>Birincisi: $2x = 6$ &rarr; $x = 3$. İkincisi: $2x = -8$ &rarr; $x = -4$.<br><br>Çözüm kümesi: $\\mathbf{\\{-4, 3\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — imkânsız durum</div><div class="example-body">$|3x - 5| = -2$ denklemini çöz.<br><br>Mutlak değer negatif olamaz. <br><br>Çözüm kümesi: $\\mathbf{\\varnothing}$ (çözüm yok).</div></div>

<div class="think-box"><div class="think-label">MANTIK KONTROLÜ</div><div class="think-body">Çözmeye başlamadan önce sağ tarafa bir göz at. Negatifse "çözüm yok" yaz ve geç. Bir saniyede görülecek bir şeyi cebirsel olarak üç dakikada türetmek sınavda boşa harcanmış zamandır.</div></div>

<h2 class="lesson-title">7. Birinci Derece Eşitsizlikler</h2>

<div class="calc-highlight"><strong>Eşitsizlik, bir tarafın diğerinden küçük (ya da büyük) olduğunu söyler.</strong> Dört sembol vardır: $&lt;$ (kesin küçük), $\\le$ (küçük ya da eşit), $&gt;$ (kesin büyük), $\\ge$ (büyük ya da eşit). Çözüm kuralları denklemlerle aynıdır — tek bir kritik istisna dışında, ki onu mutlaka belleğe yazman gerekir.</div>

<div class="calc-formula"><div class="formula-label">EŞİTSİZLİK KURALLARI</div><div class="formula-main">$$\\begin{aligned} a &lt; b &amp;\\;\\Longleftrightarrow\\; a + c &lt; b + c \\\\ a &lt; b &amp;\\;\\Longleftrightarrow\\; ka &lt; kb \\quad (k &gt; 0) \\\\ a &lt; b &amp;\\;\\Longleftrightarrow\\; ka &gt; kb \\quad (k &lt; 0) \\quad \\Leftarrow \\text{ yön değişir!} \\end{aligned}$$</div><div class="formula-sub">Her iki tarafa aynı sayıyı eklemek veya çıkarmak yönü korur. <em>Pozitif</em> bir sayıyla çarpmak veya bölmek yönü korur. <em>Negatif</em> bir sayıyla çarpmak veya bölmek yönü ters çevirir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — yön değişimi yok</div><div class="example-body">$3x + 5 \\le 14$ eşitsizliğini çöz.<br><br>$3x \\le 9 \\;\\Longrightarrow\\; x \\le 3$.<br><br>Çözüm kümesi: gerçek doğruda $\\mathbf{(-\\infty, 3]}$, veya eşdeğer olarak $\\{x \\in \\mathbb{R} : x \\le 3\\}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — yön değişimi var</div><div class="example-body">$-2x + 7 &gt; 1$ eşitsizliğini çöz.<br><br>$-2x &gt; -6$. Şimdi $-2$'ye böl — <strong>yönü çevir</strong>:<br>$x &lt; 3$.<br><br>Çözüm kümesi: $\\mathbf{(-\\infty, 3)}$ — açık aralık, $x = 3$ hariç çünkü eşitsizlik kesin.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — çift taraflı eşitsizlik</div><div class="example-body">$-5 &lt; 2x - 1 \\le 7$ eşitsizliğini çöz.<br><br>Üç parçayı aynı anda işle. Her yere 1 ekle: $-4 &lt; 2x \\le 8$. Her yeri 2'ye böl (pozitif — yön değişimi yok): $-2 &lt; x \\le 4$.<br><br>Çözüm kümesi: $\\mathbf{(-2, \\, 4]}$.</div></div>

<div class="calc-graph"><div id="plot-l52-numberline-tr" class="plotly-graph" style="height:280px"></div><div class="graph-caption"><strong>Sayı doğrusu görüntüsü:</strong> $-2 &lt; x \\le 4$ çözüm kümesi mavi renkle gösterilen yarı açık aralıktır. $x = -2$'de açık halka (hariç), $x = 4$'te dolu halka (dahil). Sayı doğrusu okumak, özellikle sınav baskısı altında, aralık gösteriminden daha hızlıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[-2,4],y:[0,0],mode:'lines',name:'çözüm aralığı',line:{color:'#3b82f6',width:6}};
var openL={x:[-2],y:[0],mode:'markers',name:'x = −2 (hariç)',marker:{color:'#0a0a0a',size:16,line:{color:'#3b82f6',width:3}}};
var closedR={x:[4],y:[0],mode:'markers',name:'x = 4 (dahil)',marker:{color:'#3b82f6',size:16}};
var ticks={x:[-5,-4,-3,-2,-1,0,1,2,3,4,5,6],y:[0,0,0,0,0,0,0,0,0,0,0,0],mode:'markers+text',name:'reel doğru',marker:{color:'rgba(255,255,255,0.35)',size:4},text:['−5','−4','−3','−2','−1','0','1','2','3','4','5','6'],textposition:'bottom center',textfont:{color:'rgba(235,230,220,0.7)',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-6,7],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},yaxis:{range:[-0.5,0.8],gridcolor:'rgba(0,0,0,0)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},margin:{t:20,r:30,b:30,l:30},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l52-numberline-tr',[ticks,seg,openL,closedR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yön değiştirme kuralı — asla unutma.</strong> Bir eşitsizliğin iki tarafını negatif bir sayıyla çarptığında ya da böldüğünde, eşitsizlik işareti yönünü değiştirir. $&lt;$ olur $&gt;$, $\\le$ olur $\\ge$ ve tersi. Bu tek kuralı unutmak, YKS'de cebirden en çok puan kaybettiren tek hatadır.</div>

<h2 class="lesson-title">8. Kelime Problemi 1 — Yaş Problemi</h2>

<div class="calc-highlight"><strong>Sözel problemler aslında kılık değiştirmiş denklem problemleridir.</strong> Beceri çeviridir: sorudaki her cümleyi cebirsel bir ifadeye dönüştür, sonra çöz. Küçük bir tablo en güvenilir çeviri aracıdır.</div>

<p class="l-text"><strong>Problem.</strong> Ali şu an Ayşe'den 8 yaş büyüktür. 5 yıl sonra Ali'nin yaşı Ayşe'nin yaşının iki katı olacaktır. Şu anki yaşlarını bul.</p>

<p class="l-text"><strong>Çeviri tablosu.</strong> $x$ = Ayşe'nin şimdiki yaşı olsun.</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Kişi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Şimdi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">5 yıl sonra</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Ayşe</td><td style="padding:0.5rem 0.8rem">$x$</td><td style="padding:0.5rem 0.8rem">$x + 5$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Ali</td><td style="padding:0.5rem 0.8rem">$x + 8$</td><td style="padding:0.5rem 0.8rem">$x + 13$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Denklem.</strong> "5 yıl sonra Ali'nin yaşı, Ayşe'nin 5 yıl sonraki yaşının iki katı olacak":</p>

<div class="calc-formula"><div class="formula-main">$$x + 13 = 2(x + 5)$$</div></div>

<p class="l-text"><strong>Çöz.</strong> $x + 13 = 2x + 10 \\;\\Longrightarrow\\; 3 = x$. Yani Ayşe şu an <strong>3</strong>, Ali <strong>11</strong> yaşında. <em>Kontrol:</em> 5 yıl sonra 8 ve 16 olacaklar, $16 = 2 \\cdot 8$. Doğrulandı.</p>

<h2 class="lesson-title">9. Kelime Problemi 2 — Hız, Zaman, Yol</h2>

<div class="calc-highlight"><strong>Evrensel formül:</strong> $\\text{yol} = \\text{hız} \\times \\text{zaman}$, yani $d = v \\cdot t$. Genelde üçten ikisi verilir (ya da $x$ cinsinden ifade edilebilir); üçüncüsünü bulmak istersin.</div>

<p class="l-text"><strong>Problem.</strong> Bir araba A şehrinden B şehrine doğru sabit 60 km/sa hızla yola çıkar. İki saat sonra ikinci bir araba aynı yerden aynı yöne 90 km/sa hızla hareket eder. İkinci arabanın hareketinden kaç saat sonra iki araba karşılaşır?</p>

<p class="l-text"><strong>Kurulum.</strong> $t$, ikinci arabanın yola çıkmasından itibaren geçen saat sayısı olsun. Karşılaştıklarında her iki araba da A şehrinden eşit uzaklıkta olur.</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Araç</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Hız (km/sa)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Yolda geçen süre (sa)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Alınan yol (km)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Birinci araba</td><td style="padding:0.5rem 0.8rem">60</td><td style="padding:0.5rem 0.8rem">$t + 2$</td><td style="padding:0.5rem 0.8rem">$60(t + 2)$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">İkinci araba</td><td style="padding:0.5rem 0.8rem">90</td><td style="padding:0.5rem 0.8rem">$t$</td><td style="padding:0.5rem 0.8rem">$90t$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Denklem.</strong> Karşılaşma anında alınan yollar eşit:</p>

<div class="calc-formula"><div class="formula-main">$$60(t + 2) = 90t$$</div></div>

<p class="l-text"><strong>Çöz.</strong> $60t + 120 = 90t \\;\\Longrightarrow\\; 120 = 30t \\;\\Longrightarrow\\; t = 4$. İkinci araba yola çıktıktan <strong>4 saat</strong> sonra birinci arabayı yakalar (birinci arabanın yola çıkmasından 6 saat sonra). Karşılaşma noktası A şehrinden $90 \\cdot 4 = 360$ km uzaklıktadır.</p>

<div class="calc-graph"><div id="plot-l52-meet-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Yol-zaman grafiği:</strong> iki düz çizgi, A şehrinden uzaklığın zamana göre değişimini gösterir. $(t, d) = (4, 360)$ noktasında kesişirler — bu, ikinci arabanın birinciyi geçtiği an ve yerdir. Her çizginin eğimi hızıdır; ikinci çizgi daha diktir çünkü arabası daha hızlıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t1=[];var d1=[];for(var i=0;i<=8;i++){t1.push(i);d1.push(60*(i+2));}
var t2=[];var d2=[];for(var i=0;i<=8;i++){t2.push(i);d2.push(90*i);}
var car1={x:t1,y:d1,mode:'lines',name:'birinci araba (60 km/sa)',line:{color:'#f59e0b',width:3}};
var car2={x:t2,y:d2,mode:'lines',name:'ikinci araba (90 km/sa)',line:{color:'#3b82f6',width:3}};
var meet={x:[4],y:[360],mode:'markers+text',name:'karşılaşma noktası',marker:{color:'#22c55e',size:14},text:['(4 sa, 360 km)'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (ikinci arabanın hareketinden sonraki saat)',range:[0,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'A şehrinden uzaklık (km)',range:[0,650],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:55,l:65},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l52-meet-tr',[car1,car2,meet],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<div class="calc-highlight">Denklem, eşitsizlik ve kelime problemlerini karıştıran sekiz soru. Çözümü okumadan önce her birini kâğıt-kalemle dene. Yıldız (*) işaretli olanlar daha zordur.</div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">$7x - 4 = 3x + 12$ denklemini çöz.<br><br><em>Cevap:</em> $4x = 16 \\;\\Longrightarrow\\; \\mathbf{x = 4}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">$\\dfrac{2x - 1}{5} = \\dfrac{x + 3}{4}$ denklemini çöz.<br><br><em>Cevap:</em> çapraz çarp: $4(2x - 1) = 5(x + 3) \\;\\Rightarrow\\; 8x - 4 = 5x + 15 \\;\\Rightarrow\\; 3x = 19 \\;\\Rightarrow\\; \\mathbf{x = \\dfrac{19}{3}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body">$|2x - 7| = 9$ denklemini çöz.<br><br><em>Cevap:</em> $2x - 7 = 9$ verir $x = 8$; $2x - 7 = -9$ verir $x = -1$. Çözüm kümesi: $\\mathbf{\\{-1, 8\\}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">$-3x + 8 \\le 2x - 7$ eşitsizliğini çöz.<br><br><em>Cevap:</em> $-5x \\le -15$. $-5$'e böl ve <strong>yönü çevir</strong>: $\\mathbf{x \\ge 3}$, yani $[3, +\\infty)$ aralığı.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5*</div><div class="example-body">$(m - 2)x = 5$ denkleminin çözümsüz olması için $m$ hangi değeri almalıdır?<br><br><em>Cevap:</em> "çözüm yok" demek, $x$'in katsayısının sıfır, sağ tarafın ise sıfırdan farklı olması demektir. Katsayı sıfır: $m - 2 = 0 \\;\\Rightarrow\\; m = 2$. Sağ taraf zaten 5 (sıfırdan farklı). Yani $\\mathbf{m = 2}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — yaş problemi</div><div class="example-body">Bir baba şu an oğlunun üç katı yaşındadır. 12 yıl sonra baba oğlunun yalnızca iki katı yaşında olacaktır. Şu an her ikisi kaç yaşındadır?<br><br><em>Kurulum:</em> oğul = $x$, baba = $3x$. 12 yıl sonra: oğul = $x + 12$, baba = $3x + 12$.<br><em>Denklem:</em> $3x + 12 = 2(x + 12) \\;\\Rightarrow\\; 3x + 12 = 2x + 24 \\;\\Rightarrow\\; x = 12$.<br><em>Cevap:</em> oğul <strong>12</strong>, baba <strong>36</strong>.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — hız-zaman</div><div class="example-body">Bir tren A'dan B'ye 80 km/sa hızla gidiyor ve aynı yoldan 120 km/sa hızla dönüyor. Toplam gidiş-dönüş süresi 5 saat. A ile B arasındaki uzaklık nedir?<br><br><em>Kurulum:</em> tek yön mesafesi $d$. Gidiş süresi: $d/80$. Dönüş süresi: $d/120$.<br><em>Denklem:</em> $\\dfrac{d}{80} + \\dfrac{d}{120} = 5$. EKOK 240: $3d + 2d = 1200 \\;\\Rightarrow\\; 5d = 1200 \\;\\Rightarrow\\; d = 240$.<br><em>Cevap:</em> <strong>240 km</strong>.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8* — eşitsizlik ve mutlak değer karışık</div><div class="example-body">$|x - 4| &lt; 6$ eşitsizliğini çöz.<br><br><em>Mantık:</em> "4'e uzaklık 6'dan küçük" demek, $-6 &lt; x - 4 &lt; 6$, yani $-2 &lt; x &lt; 10$.<br><em>Cevap:</em> açık aralık $\\mathbf{(-2, \\, 10)}$. <em>(Mutlak değerli eşitsizlikleri ilerleyen derslerde ayrıntılı işleyeceğiz; şimdilik en hızlı yol geometrik okuma.)</em></div></div>

<div class="think-box"><div class="think-label">SON ÖZET — DERSTEN ÇIKARILACAK ESAS NOKTALAR</div><div class="think-body"><strong>(1)</strong> Denklem, eşit olduğunu iddia eden iki ifadedir; çözüm bu iddiayı doğru kılar. <strong>(2)</strong> Her birinci derece denklem $ax + b = 0$ biçimine indirgenir ve dört adımda çözülür: sadeleştir, topla, böl, doğrula. <strong>(3)</strong> İki patolojik durum — $0 = 0$ (sonsuz çözüm) ve $0 = c$ ($c \\ne 0$, çözüm yok) — $x$'in katsayısı sıfırlandığında ortaya çıkar. <strong>(4)</strong> Kesirli denklemler: paydaların EKOK'u ile çarp. <strong>(5)</strong> Mutlak değerli denklem $|y| = c$: $c \\ge 0$ ise $y = c$ veya $y = -c$ olarak ayrıştır, aksi takdirde çözüm yok. <strong>(6)</strong> Eşitsizlikler denklemlerle aynı kurallarla çözülür; tek istisna negatifle çarpma/bölme yapıldığında <em>yön değişir</em>. <strong>(7)</strong> Sözel problemler: çeviri tablosu kur, denklemi yaz, çöz, sonra orijinal cümleye karşı doğrula.</div></div>
`
};
