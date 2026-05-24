window.LISE_MAT_L60 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>An equation says two quantities are equal; an inequality says one is bigger (or smaller) than the other.</strong> That is the whole difference in plain English, but it changes the kind of answer you get. Where an equation pins the unknown down to a single number (or a small handful), an inequality typically singles out a whole <em>interval</em> on the number line — a continuous range of values, possibly with one or both ends open. Reading and writing those intervals fluently is the first technical skill in this lesson.</p>

<p class="l-text">The second technical skill is solving compound conditions: two inequalities joined by "and" (the solution must satisfy both) or by "or" (the solution must satisfy at least one). And tucked between them is the single most common mistake in all of high-school algebra: forgetting to <strong>flip the inequality sign</strong> when you multiply or divide by a negative number. If you remember nothing else from this lesson, remember that.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and use the four inequality symbols ($&lt;$, $&gt;$, $\\le$, $\\ge$) correctly and distinguish strict from non-strict cases</li>
<li>Picture an inequality as a shaded region on the number line, using open and closed circles to mark excluded versus included endpoints</li>
<li>Switch fluently between interval notation $(a, b)$, $[a, b]$, $(a, \\infty)$ and set-builder notation $\\{x \\in \\mathbb{R} : x &gt; 0\\}$</li>
<li>Apply the order axioms — addition preserves, multiplication by a positive preserves, multiplication by a negative <strong>reverses</strong> the inequality</li>
<li>Solve linear inequalities and compound (AND / OR) inequalities, including triple inequalities of the form $a \\le f(x) &lt; b$</li>
<li>Translate everyday situations (tariffs, BMI ranges, work-hour limits) into inequalities and interpret the answer in plain language</li>
</ul>
</div>

<h2 class="lesson-title">1. The Four Inequality Symbols</h2>

<div class="calc-highlight"><strong>Four symbols, two distinctions.</strong> $&lt;$ and $&gt;$ are <em>strict</em>: they exclude equality. $\\le$ and $\\ge$ are <em>non-strict</em>: they include equality. Reading them aloud — "less than", "less than or equal to" — is the safest habit.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a &lt; b$ &mdash; strictly less</div><div class="card-body">"$a$ is less than $b$." The two numbers are <em>different</em>. Example: $3 &lt; 7$ (true); $5 &lt; 5$ (false).</div></div>
<div class="calc-card"><div class="card-title">$a \\le b$ &mdash; less than or equal</div><div class="card-body">"$a$ is less than $b$, or $a$ equals $b$." Either is enough. Example: $5 \\le 5$ (true); $5 \\le 4$ (false).</div></div>
<div class="calc-card"><div class="card-title">$a &gt; b$ &mdash; strictly greater</div><div class="card-body">"$a$ is greater than $b$." Just $&lt;$ written backwards. Example: $7 &gt; 3$ (true); $3 &gt; 3$ (false).</div></div>
<div class="calc-card"><div class="card-title">$a \\ge b$ &mdash; greater than or equal</div><div class="card-body">"$a$ is greater than $b$, or $a$ equals $b$." Example: $3 \\ge 3$ (true); $2 \\ge 5$ (false).</div></div>
</div>

<p class="l-text">A small mnemonic: the wide side of the symbol points to the <em>bigger</em> number; the narrow point (the "beak") points to the <em>smaller</em> one. $7 &gt; 3$ — wide side faces 7, point faces 3. Easy to remember, hard to forget.</p>

<div class="calc-example"><div class="example-label">QUICK CHECK</div><div class="example-body">Decide whether each statement is true or false.<br>(a) $-3 &lt; -1$. <em>True</em>: on the number line, $-3$ sits to the left of $-1$.<br>(b) $-5 \\ge -5$. <em>True</em>: "greater than or equal" includes equality.<br>(c) $\\dfrac{1}{2} &gt; 0.6$. <em>False</em>: $\\dfrac{1}{2} = 0.5 &lt; 0.6$.<br>(d) $0 \\le 0$. <em>True</em>: equality satisfies the non-strict version.</div></div>

<div class="l-note"><strong>Common confusion with negatives.</strong> Among positive numbers, "bigger" matches intuition: 7 is bigger than 3 because it stands for more cookies. Among negatives the picture flips: $-7$ is <em>smaller</em> than $-3$, because $-7$ sits further left on the number line (think temperature: $-7^\\circ$ is colder than $-3^\\circ$). When in doubt, draw the number line.</div>

<h2 class="lesson-title">2. Picturing an Inequality on the Number Line</h2>

<div class="calc-highlight"><strong>Every inequality in one variable has a picture on the number line.</strong> The solution is a ray, a half-line, or a finite segment, and the only fiddly bit is the endpoints: open circles for "strict" (excluded), closed circles for "non-strict" (included).</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Open circle (&deg;)</div><div class="card-body">Used at endpoints with $&lt;$ or $&gt;$. The endpoint itself is <em>not</em> part of the solution. Draw a small hollow ring on the number line at that value.</div></div>
<div class="calc-card"><div class="card-title">Closed circle (&bull;)</div><div class="card-body">Used at endpoints with $\\le$ or $\\ge$. The endpoint <em>is</em> part of the solution. Draw a small filled disc on the number line at that value.</div></div>
<div class="calc-card"><div class="card-title">Arrow (&rarr;)</div><div class="card-body">When the solution extends to infinity in a direction, draw an arrow. There is no circle at infinity because infinity is not a number — it can never be "included" or "excluded".</div></div>
</div>

<p class="l-text">Three quick worked pictures, for the inequalities $x &gt; 2$, $x \\le -1$, and $-2 &lt; x \\le 3$:</p>

<div class="calc-example"><div class="example-label">WORKED PICTURE 1 — $x &gt; 2$</div><div class="example-body">Open circle at $x = 2$ (since $2$ itself is excluded by the strict inequality), thick shading to the right, arrow heading off to $+\\infty$. Solution: every real number larger than $2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED PICTURE 2 — $x \\le -1$</div><div class="example-body">Closed circle at $x = -1$ (since $-1$ itself <em>is</em> included by the non-strict inequality), thick shading to the left, arrow heading off to $-\\infty$. Solution: every real number less than or equal to $-1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED PICTURE 3 — $-2 &lt; x \\le 3$</div><div class="example-body">Open circle at $-2$ (excluded), closed circle at $3$ (included), thick shading between the two endpoints. Solution: every real number strictly greater than $-2$ and less than or equal to $3$.</div></div>

<div class="calc-graph"><div id="plot-l60-numberline-en" class="plotly-graph" style="height:300px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the half-open interval $-2 &lt; x \\le 3$ drawn on the real line. Open hollow marker at $-2$ (excluded, strict); filled blue marker at $3$ (included, non-strict); thick blue segment for the solution set in between. Tick labels run from $-5$ to $5$ for context.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[-2,3],y:[0,0],mode:'lines',name:'solution',line:{color:'#3b82f6',width:6}};
var openL={x:[-2],y:[0],mode:'markers',name:'x = −2 (excluded)',marker:{color:'#0a0a0a',size:16,line:{color:'#3b82f6',width:3}}};
var closedR={x:[3],y:[0],mode:'markers',name:'x = 3 (included)',marker:{color:'#3b82f6',size:16}};
var ticks={x:[-5,-4,-3,-2,-1,0,1,2,3,4,5],y:[0,0,0,0,0,0,0,0,0,0,0],mode:'markers+text',name:'real line',marker:{color:'rgba(255,255,255,0.35)',size:4},text:['−5','−4','−3','−2','−1','0','1','2','3','4','5'],textposition:'bottom center',textfont:{color:'rgba(235,230,220,0.7)',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-6,6],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},yaxis:{range:[-0.5,0.8],gridcolor:'rgba(0,0,0,0)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l60-numberline-en',[ticks,seg,openL,closedR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Draw a number line and shade the solution sets of (a) $x \\ge 0$, (b) $x &lt; 4$, (c) $1 \\le x &lt; 5$. Mark each endpoint with the correct circle. If you confuse open with closed, write the inequality next to it as a reminder until the habit is automatic.</div></div>

<h2 class="lesson-title">3. Interval Notation</h2>

<div class="calc-highlight"><strong>Interval notation is the standard shorthand for the solution set of an inequality.</strong> A square bracket means the endpoint is included; a round bracket means it is excluded. Infinity always gets a round bracket — you cannot include something that is not a number.</div>

<div class="calc-formula"><div class="formula-label">THE FOUR ONE-DIMENSIONAL INTERVALS</div><div class="formula-main">$$\\begin{aligned} (a, b) &amp;= \\{x : a &lt; x &lt; b\\} \\qquad &amp;\\text{open interval, both endpoints excluded} \\\\ [a, b] &amp;= \\{x : a \\le x \\le b\\} \\qquad &amp;\\text{closed interval, both endpoints included} \\\\ [a, b) &amp;= \\{x : a \\le x &lt; b\\} \\qquad &amp;\\text{half-open, left included, right excluded} \\\\ (a, b] &amp;= \\{x : a &lt; x \\le b\\} \\qquad &amp;\\text{half-open, left excluded, right included} \\end{aligned}$$</div><div class="formula-sub">The pattern: a square bracket "[" or "]" matches a closed circle on the number line; a round bracket "(" or ")" matches an open circle.</div></div>

<p class="l-text"><strong>Unbounded intervals</strong> stretch to infinity in one or both directions:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Inequality</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Interval notation</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Set-builder</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Reading</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x &gt; a$</td><td style="padding:0.5rem 0.8rem">$(a, \\infty)$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x &gt; a\\}$</td><td style="padding:0.5rem 0.8rem">"strictly greater than $a$"</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x \\ge a$</td><td style="padding:0.5rem 0.8rem">$[a, \\infty)$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x \\ge a\\}$</td><td style="padding:0.5rem 0.8rem">"at least $a$"</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x &lt; b$</td><td style="padding:0.5rem 0.8rem">$(-\\infty, b)$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x &lt; b\\}$</td><td style="padding:0.5rem 0.8rem">"strictly less than $b$"</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x \\le b$</td><td style="padding:0.5rem 0.8rem">$(-\\infty, b]$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x \\le b\\}$</td><td style="padding:0.5rem 0.8rem">"at most $b$"</td></tr>
<tr><td style="padding:0.5rem 0.8rem">all reals</td><td style="padding:0.5rem 0.8rem">$(-\\infty, \\infty)$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">"any real number"</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">CONVERSION DRILL</div><div class="example-body">Translate each inequality into interval notation.<br>(a) $x &gt; 5$ &rarr; $\\mathbf{(5, \\infty)}$.<br>(b) $-3 \\le x \\le 7$ &rarr; $\\mathbf{[-3, 7]}$.<br>(c) $0 &lt; x \\le 1$ &rarr; $\\mathbf{(0, 1]}$.<br>(d) $x \\ne 4$ &rarr; $\\mathbf{(-\\infty, 4) \\cup (4, \\infty)}$ &mdash; a union of two intervals, since "everything except 4" is what is left when you remove the single point.</div></div>

<div class="l-note"><strong>Set-builder is more verbose but more flexible.</strong> Interval notation handles simple shapes (single segments, rays). For oddities like "all reals except $4$" or "all rationals between $0$ and $1$", set-builder $\\{x : \\text{condition}\\}$ is cleaner. Both notations are standard; learn to read both.</div>

<h2 class="lesson-title">4. The Order Axioms (and the One That Bites)</h2>

<div class="calc-highlight"><strong>Three rules govern what you can do to an inequality.</strong> Two preserve the direction; one reverses it. The reversal is the only rule with teeth, and it is the rule students forget. Practise it until it feels automatic.</div>

<div class="calc-formula"><div class="formula-label">RULE 1 — ADDITION / SUBTRACTION</div><div class="formula-main">$$a &lt; b \\;\\Longleftrightarrow\\; a + c &lt; b + c \\quad \\text{for any real } c$$</div><div class="formula-sub">You can add or subtract anything you like on both sides, and the inequality direction is unchanged. Same as for equations.</div></div>

<div class="calc-formula"><div class="formula-label">RULE 2 — MULTIPLY / DIVIDE BY A POSITIVE NUMBER</div><div class="formula-main">$$a &lt; b \\;\\Longleftrightarrow\\; ka &lt; kb \\quad (k &gt; 0)$$</div><div class="formula-sub">Positive scaling preserves the order. Example: $2 &lt; 5$, multiply by $3$ &rarr; $6 &lt; 15$. Still true, still pointing the same way.</div></div>

<div class="calc-formula"><div class="formula-label">RULE 3 &mdash; MULTIPLY / DIVIDE BY A NEGATIVE NUMBER &mdash; FLIPS</div><div class="formula-main">$$a &lt; b \\;\\Longleftrightarrow\\; ka &gt; kb \\quad (k &lt; 0)$$</div><div class="formula-sub">Negative scaling <strong>reverses</strong> the direction. Example: $2 &lt; 5$, multiply by $-3$ &rarr; $-6$ and $-15$. Is $-6 &lt; -15$? No: $-6$ is the larger number ($-6 &gt; -15$). The sign flipped.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Intuition for Rule 3</div><div class="card-body">Multiplying by $-1$ is a mirror reflection of the number line around zero. Numbers on the right get sent to the left, and vice versa. So the smaller number becomes the larger one &mdash; the order flips.</div></div>
<div class="calc-card"><div class="card-title">When the flip applies</div><div class="card-body">Only when you multiply or divide by a <em>negative</em> number. Adding or subtracting a negative does <strong>not</strong> trigger a flip &mdash; that is just normal subtraction.</div></div>
<div class="calc-card"><div class="card-title">When you flip</div><div class="card-body">Flip <em>all</em> the inequality symbols in the chain simultaneously. $a &lt; b \\le c$ becomes $-a &gt; -b \\ge -c$ when you multiply through by $-1$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; both rules in one go</div><div class="example-body">Start with $4 &lt; 9$. <br>Add $3$ to both sides &rarr; $7 &lt; 12$. Still true, same direction.<br>Multiply both sides by $2$ &rarr; $14 &lt; 24$. Still true, same direction.<br>Multiply both sides by $-2$ &rarr; $-28$ and $-48$. The flip rule says the direction reverses: $-28 &gt; -48$. Check: yes, $-28$ is bigger than $-48$ (closer to zero). Confirmed.</div></div>

<div class="l-note"><strong>Why the flip rule never goes away.</strong> Every inequality you solve that has a negative coefficient on the unknown forces you to use Rule 3 at the last step. Skipping it does not produce a small error &mdash; it produces the <em>opposite</em> of the right answer. The sign of the solution set is wrong end-to-end.</div>

<h2 class="lesson-title">5. Solving Linear Inequalities</h2>

<div class="calc-highlight"><strong>Same procedure as for equations, with one addition.</strong> Tidy each side, collect $x$ terms on one side and constants on the other, divide by the coefficient of $x$ &mdash; and <em>if</em> that coefficient is negative, flip the inequality sign.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 &mdash; Tidy</div><div class="card-body">Expand brackets, combine like terms, clear denominators (multiply by the LCM of all denominators &mdash; this is always positive, so no flip).</div></div>
<div class="calc-card"><div class="card-title">Step 2 &mdash; Collect</div><div class="card-body">Move all $x$ terms to one side, constants to the other. Addition and subtraction keep the direction.</div></div>
<div class="calc-card"><div class="card-title">Step 3 &mdash; Divide (and maybe flip!)</div><div class="card-body">Divide both sides by the coefficient of $x$. If it is positive, keep the direction. If it is <strong>negative, flip</strong> the inequality.</div></div>
<div class="calc-card"><div class="card-title">Step 4 &mdash; Write the solution set</div><div class="card-body">State the answer in interval notation, then optionally draw the number-line picture.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; no flip</div><div class="example-body">Solve $3x + 5 &lt; 14$.<br><br>Subtract $5$: $3x &lt; 9$. Divide by $3$ (positive &mdash; no flip): $x &lt; 3$.<br><br>Solution: $\\mathbf{(-\\infty, 3)}$. On the number line, open circle at $3$ and shading running left to $-\\infty$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; flip required</div><div class="example-body">Solve $-3x + 1 &lt; 10$.<br><br>Subtract $1$: $-3x &lt; 9$. Divide by $-3$ &mdash; <strong>flip the inequality</strong>:<br>$x &gt; -3$.<br><br>Solution: $\\mathbf{(-3, \\infty)}$. <em>Verify with one number from the proposed solution set: try $x = 0$. Original: $-3(0) + 1 = 1$, and $1 &lt; 10$ is true. Good.</em></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; brackets and $x$ on both sides</div><div class="example-body">Solve $4(x - 2) \\ge 2x + 6$.<br><br>Expand: $4x - 8 \\ge 2x + 6$.<br>Subtract $2x$ and add $8$: $2x \\ge 14$.<br>Divide by $2$ (positive, no flip): $x \\ge 7$.<br><br>Solution: $\\mathbf{[7, \\infty)}$. Closed circle at $7$, shading running right to $+\\infty$.</div></div>

<div class="think-box"><div class="think-label">THE FLIP CHECKLIST</div><div class="think-body">Every time you divide both sides by a number, ask yourself: <em>is this number negative?</em> If yes, flip the inequality. If no, leave it alone. Make this question a reflex. The single most common YKS mistake is forgetting to ask it.</div></div>

<h2 class="lesson-title">6. Compound Inequalities &mdash; AND (Conjunction)</h2>

<div class="calc-highlight"><strong>A compound inequality joined by "and" is a system of two conditions that must hold simultaneously.</strong> The solution is the <em>intersection</em> of the two individual solution sets &mdash; the overlap of the two intervals on the number line.</div>

<p class="l-text">A typical "and" inequality is written as a chain like $-3 \\le 2x + 1 &lt; 7$. Read this aloud as "$-3 \\le 2x + 1$ and $2x + 1 &lt; 7$". The unknown $x$ must satisfy both halves at once.</p>

<div class="calc-formula"><div class="formula-label">AND &mdash; THE INTERSECTION</div><div class="formula-main">$$\\underbrace{a \\le f(x)}_{\\text{condition 1}} \\;\\text{ and }\\; \\underbrace{f(x) &lt; b}_{\\text{condition 2}} \\;\\;\\Longleftrightarrow\\;\\; a \\le f(x) &lt; b$$</div><div class="formula-sub">Solve both halves separately, take the intersection of the two solution sets. For chain inequalities like $a \\le f(x) &lt; b$, work on all three parts at once: whatever you do to the middle, do also to both ends.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; chain form</div><div class="example-body">Solve $-3 \\le 2x + 1 &lt; 7$.<br><br>Subtract $1$ from all three parts: $-4 \\le 2x &lt; 6$.<br>Divide all three parts by $2$ (positive &mdash; no flip): $-2 \\le x &lt; 3$.<br><br>Solution: $\\mathbf{[-2, 3)}$. Closed circle at $-2$ (included), open circle at $3$ (excluded), thick shading between.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; written as two conditions</div><div class="example-body">Solve "$x &gt; -1$ and $x \\le 4$".<br><br>Solution 1: $(-1, \\infty)$. Solution 2: $(-\\infty, 4]$.<br>Intersection: numbers strictly bigger than $-1$ <em>and</em> at most $4$ &mdash; that is the half-open interval $(-1, 4]$.<br><br>Solution: $\\mathbf{(-1, 4]}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; empty intersection</div><div class="example-body">Solve "$x &gt; 5$ and $x &lt; 2$".<br><br>No number is simultaneously bigger than $5$ and smaller than $2$. The intersection is empty.<br><br>Solution: $\\mathbf{\\varnothing}$ &mdash; no solution. Watch for impossible chains like $5 &lt; x &lt; 2$ &mdash; the upper bound is smaller than the lower bound, so the chain itself is contradictory.</div></div>

<h2 class="lesson-title">7. Compound Inequalities &mdash; OR (Disjunction)</h2>

<div class="calc-highlight"><strong>A compound inequality joined by "or" is satisfied when at least one of the two conditions holds.</strong> The solution is the <em>union</em> of the two individual solution sets &mdash; the combined region on the number line. Often the two pieces do not touch, and the answer is written with a union symbol $\\cup$.</div>

<div class="calc-formula"><div class="formula-label">OR &mdash; THE UNION</div><div class="formula-main">$$\\underbrace{f(x) &lt; a}_{\\text{condition 1}} \\;\\text{ or }\\; \\underbrace{f(x) &gt; b}_{\\text{condition 2}} \\;\\;\\Longleftrightarrow\\;\\; (-\\infty, a) \\cup (b, \\infty)$$</div><div class="formula-sub">When the two intervals are disjoint (do not overlap) you must keep the union symbol &mdash; you cannot collapse them into a single interval.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; two rays in opposite directions</div><div class="example-body">Solve "$x &lt; -2$ or $x &gt; 5$".<br><br>Two rays heading off in opposite directions, neither touching the other. <br><br>Solution: $\\mathbf{(-\\infty, -2) \\cup (5, \\infty)}$. Number line: open circle at $-2$ with shading going left, open circle at $5$ with shading going right, blank gap in the middle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; overlapping rays</div><div class="example-body">Solve "$x &gt; 1$ or $x &gt; -3$".<br><br>Every number bigger than $1$ is automatically bigger than $-3$, but the second condition is broader: it accepts numbers like $0$ that the first one rejects. The union is the bigger of the two sets.<br><br>Solution: $\\mathbf{(-3, \\infty)}$. The first condition contributes nothing new because it is already contained in the second.</div></div>

<div class="calc-graph"><div id="plot-l60-compound-en" class="plotly-graph" style="height:320px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three solution patterns side by side on a single set of axes. The top row is AND (intersection), the answer $[-2, 3)$ &mdash; one thick segment. The middle row is OR (disjoint union), the answer $(-\\infty, -2) \\cup (5, \\infty)$ &mdash; two disconnected rays. The bottom row is OR (overlapping), the answer $(-3, \\infty)$ &mdash; a single ray, because one set already contains the other.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var andSeg={x:[-2,3],y:[2,2],mode:'lines',name:'AND: [−2, 3)',line:{color:'#3b82f6',width:6}};
var andL={x:[-2],y:[2],mode:'markers',name:'',marker:{color:'#3b82f6',size:14},showlegend:false};
var andR={x:[3],y:[2],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#3b82f6',width:3}},showlegend:false};
var orSeg1={x:[-7,-2],y:[1,1],mode:'lines',name:'OR: (−∞,−2) ∪ (5,∞)',line:{color:'#f59e0b',width:6}};
var orSeg2={x:[5,9],y:[1,1],mode:'lines',name:'',line:{color:'#f59e0b',width:6},showlegend:false};
var orL={x:[-2],y:[1],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:3}},showlegend:false};
var orR={x:[5],y:[1],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:3}},showlegend:false};
var ovSeg={x:[-3,9],y:[0,0],mode:'lines',name:'OR overlap: (−3, ∞)',line:{color:'#22c55e',width:6}};
var ovL={x:[-3],y:[0],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#22c55e',width:3}},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,10],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.4)'},yaxis:{range:[-0.5,2.8],gridcolor:'rgba(0,0,0,0)',zerolinecolor:'rgba(0,0,0,0)',showticklabels:false},margin:{t:30,r:30,b:50,l:30},legend:{orientation:'h',y:1.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l60-compound-en',[andSeg,andL,andR,orSeg1,orSeg2,orL,orR,ovSeg,ovL],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The "and / or" trap.</strong> Native English speakers often hear "or" inclusively (one or both) and "and" restrictively (both). In mathematics that is exactly what these words mean. But if a problem says "Ali earns less than 5,000 TL <em>or</em> more than 10,000 TL", be careful: the solution is the union of those two ranges, not the empty intersection.</div>

<h2 class="lesson-title">8. Triple Inequalities &mdash; The Chain Form</h2>

<div class="calc-highlight"><strong>A triple inequality is just an AND inequality written compactly.</strong> $1 &lt; x + 2 \\le 7$ is shorthand for "$1 &lt; x + 2$ <em>and</em> $x + 2 \\le 7$". Solve by performing the same operation on all three parts at once.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Solve $1 &lt; x + 2 \\le 7$.<br><br>Subtract $2$ from all three parts: $-1 &lt; x \\le 5$.<br><br>Solution: $\\mathbf{(-1, 5]}$. Open circle at $-1$, closed circle at $5$, thick shading between.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; involves division</div><div class="example-body">Solve $-2 \\le \\dfrac{2x - 1}{3} &lt; 4$.<br><br>Multiply all three parts by $3$ (positive &mdash; no flip): $-6 \\le 2x - 1 &lt; 12$.<br>Add $1$ to all three parts: $-5 \\le 2x &lt; 13$.<br>Divide all three parts by $2$ (positive &mdash; no flip): $-\\dfrac{5}{2} \\le x &lt; \\dfrac{13}{2}$.<br><br>Solution: $\\mathbf{\\left[-\\dfrac{5}{2}, \\, \\dfrac{13}{2}\\right)}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; negative middle coefficient</div><div class="example-body">Solve $-1 &lt; -2x + 3 \\le 5$.<br><br>Subtract $3$: $-4 &lt; -2x \\le 2$.<br>Divide by $-2$ &mdash; <strong>flip both inequalities</strong>:<br>$2 &gt; x \\ge -1$, which is the same as $-1 \\le x &lt; 2$.<br><br>Solution: $\\mathbf{[-1, 2)}$. <em>Always rewrite chain inequalities from smallest to largest at the end, so the picture is left-to-right.</em></div></div>

<div class="think-box"><div class="think-label">FORM CHECK</div><div class="think-body">A valid chain inequality always reads in one consistent direction. "$5 &lt; x &gt; 2$" is gibberish &mdash; the arrows point opposite ways. If you ever produce something like that, you have made a sign error. Rewrite from scratch.</div></div>

<h2 class="lesson-title">9. Word Problem 1 &mdash; A Tariff with a Threshold</h2>

<div class="calc-highlight"><strong>Many real-world problems involve thresholds: prices that change above a certain amount, taxes that kick in over a certain income, free shipping above a minimum order.</strong> All of these are linear inequalities in disguise.</div>

<p class="l-text"><strong>Problem.</strong> A mobile-data plan charges a fixed monthly fee of 80 TL plus 5 TL for each GB used beyond the first 10 GB (the first 10 GB are included). For what monthly usage does the total bill stay <em>at most</em> 200 TL?</p>

<p class="l-text"><strong>Setup.</strong> Let $x$ be the monthly usage in GB. The first 10 GB are free; only usage above 10 GB is billed. Two cases:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Case A: $x \\le 10$</div><div class="card-body">Total bill is just 80 TL (no extra charge). This is automatically $\\le 200$ TL, so every $x \\in [0, 10]$ satisfies the condition.</div></div>
<div class="calc-card"><div class="card-title">Case B: $x &gt; 10$</div><div class="card-body">Total bill is $80 + 5(x - 10)$ TL. We need $80 + 5(x - 10) \\le 200$.</div></div>
</div>

<p class="l-text"><strong>Solve Case B.</strong> $80 + 5(x - 10) \\le 200 \\;\\Longrightarrow\\; 5(x - 10) \\le 120 \\;\\Longrightarrow\\; x - 10 \\le 24 \\;\\Longrightarrow\\; x \\le 34$.</p>

<p class="l-text"><strong>Combine.</strong> The two cases together give $0 \\le x \\le 34$, that is the closed interval $[0, 34]$ GB. As long as monthly usage stays at $34$ GB or below, the bill is at most $200$ TL.</p>

<div class="calc-graph"><div id="plot-l60-tariff-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> total bill (TL) as a function of monthly data usage (GB). The blue piecewise line is flat at 80 TL while $x \\le 10$, then climbs with slope $5$ TL/GB beyond that. The dashed horizontal line $y = 200$ is the 200-TL threshold; the green solution segment along the x-axis marks the range of usage for which the bill stays at or below 200 TL.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=50;i++){var v=i;xs.push(v);ys.push(v<=10?80:80+5*(v-10));}
var billLine={x:xs,y:ys,mode:'lines',name:'total bill',line:{color:'#3b82f6',width:3}};
var threshold={x:[0,50],y:[200,200],mode:'lines',name:'200 TL limit',line:{color:'#f59e0b',width:2,dash:'dash'}};
var solRange={x:[0,34],y:[0,0],mode:'lines',name:'allowed usage',line:{color:'#22c55e',width:6}};
var solMark={x:[34],y:[200],mode:'markers+text',name:'',marker:{color:'#22c55e',size:12},text:['x = 34'],textposition:'top right',textfont:{color:'#22c55e',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'monthly usage (GB)',range:[0,50],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'total bill (TL)',range:[0,310],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:55,l:65},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l60-tariff-en',[billLine,threshold,solRange,solMark],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Word Problem 2 &mdash; BMI Range</h2>

<div class="calc-highlight"><strong>Body Mass Index (BMI) is defined as $\\text{BMI} = \\dfrac{m}{h^2}$, with $m$ in kilograms and $h$ in metres.</strong> The "normal" range used by the World Health Organisation is $18.5 \\le \\text{BMI} &lt; 25$. A chain inequality.</div>

<p class="l-text"><strong>Problem.</strong> A person is $1.70$ m tall. For what range of body mass $m$ (in kg) does the BMI fall in the normal range?</p>

<p class="l-text"><strong>Setup.</strong> $\\text{BMI} = \\dfrac{m}{1.70^2} = \\dfrac{m}{2.89}$. The condition is</p>

<div class="calc-formula"><div class="formula-main">$$18.5 \\;\\le\\; \\dfrac{m}{2.89} \\;&lt;\\; 25$$</div></div>

<p class="l-text"><strong>Solve.</strong> Multiply all three parts by $2.89$ (positive, no flip):</p>

<div class="calc-formula"><div class="formula-main">$$18.5 \\times 2.89 \\;\\le\\; m \\;&lt;\\; 25 \\times 2.89$$</div></div>

<p class="l-text">That is $53.47 \\le m &lt; 72.25$. <strong>Conclusion:</strong> for a $1.70$-m-tall person, body mass between roughly $53.5$ kg (included) and $72.3$ kg (excluded) gives a "normal" BMI. The interval is $[53.47, \\, 72.25)$.</p>

<div class="l-note"><strong>Why the right endpoint is excluded.</strong> WHO defines "overweight" as BMI $\\ge 25$, so the normal band stops <em>strictly below</em> 25 &mdash; the value 25 itself belongs to the next category. The asymmetry between $\\le$ on the left and $&lt;$ on the right is deliberate: every BMI value belongs to exactly one band, no overlap.</div>

<h2 class="lesson-title">11. Word Problem 3 &mdash; Work-Hour Limit</h2>

<div class="calc-highlight"><strong>Inequalities also model rules and limits.</strong> "At most 40 hours per week", "no more than three errors out of 20", "at least 75% attendance" &mdash; all linear inequalities once you write them in symbols.</div>

<p class="l-text"><strong>Problem.</strong> A student worker is paid 50 TL per hour. The job offers an additional bonus of 200 TL per week, but only if the student works <em>strictly fewer than</em> 5 hours during the weekend (so they have time for study). The student wants their total weekly pay (regular hours plus bonus, where applicable) to be at least 600 TL. Let $h$ be the number of weekend hours. For what values of $h$ does the student earn at least 600 TL and still receive the bonus?</p>

<p class="l-text"><strong>Setup.</strong> Total pay (with bonus) is $50h + 200$. Two conditions must hold simultaneously:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Condition 1: bonus eligibility</div><div class="card-body">$h &lt; 5$ &mdash; strictly fewer than 5 hours. Solution: $(-\\infty, 5)$.</div></div>
<div class="calc-card"><div class="card-title">Condition 2: pay at least 600 TL</div><div class="card-body">$50h + 200 \\ge 600 \\Rightarrow 50h \\ge 400 \\Rightarrow h \\ge 8$. Solution: $[8, \\infty)$.</div></div>
</div>

<p class="l-text"><strong>Combine (AND).</strong> Intersection of $(-\\infty, 5)$ and $[8, \\infty)$ is empty: no value of $h$ satisfies both. <strong>Conclusion:</strong> it is impossible to keep the bonus <em>and</em> earn at least 600 TL on weekend hours alone. The student would either have to give up the bonus, or earn the extra wages on weekdays instead. (Notice the role of the inequalities: with one click of an inequality direction the problem becomes solvable. Inequalities reveal constraints that equations cannot.)</p>

<h2 class="lesson-title">12. Common Errors</h2>

<div class="calc-highlight"><strong>Three mistakes catch students almost every time.</strong> Read this section twice, return to it before every exam.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ERROR 1 &mdash; forgetting to flip</div><div class="compare-item">"$-2x &lt; 6 \\Rightarrow x &lt; -3$" &mdash; WRONG: the sign was not flipped on division by $-2$.</div><div class="compare-item">"$-2x &lt; 6 \\Rightarrow x &gt; -3$" &mdash; CORRECT.</div><div class="compare-item"><strong>How to avoid:</strong> at the moment of division, look at the sign of the divisor. If negative, flip every $&lt;$ to $&gt;$ and every $\\le$ to $\\ge$.</div></div><div class="compare-col"><div class="compare-title">ERROR 2 &mdash; confusing strict with non-strict</div><div class="compare-item">"$x &lt; 5$ means $x \\le 4$ (when $x$ is an integer)" &mdash; only true if you are told $x$ is an integer. Over the reals, $x &lt; 5$ includes $4.999$, $4.9999$, and so on.</div><div class="compare-item"><strong>How to avoid:</strong> always read what kind of number $x$ is (real, integer, natural). Strict over the reals is genuinely different from non-strict.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ERROR 3 &mdash; mixing AND with OR</div><div class="compare-item">"Solve $x &gt; 2$ or $x &lt; 5$" &rarr; student writes intersection $(2, 5)$. <em>Wrong</em>: "or" gives the union, which here is <em>all</em> real numbers, $(-\\infty, \\infty) = \\mathbb{R}$.</div><div class="compare-item"><strong>How to avoid:</strong> draw the two solution sets as two shaded number lines stacked vertically. "AND" keeps only the column where both are shaded; "OR" keeps any column where at least one is shaded.</div></div><div class="compare-col"><div class="compare-title">ERROR 4 &mdash; opening / closing the wrong endpoint</div><div class="compare-item">Writing $[3, 5)$ when the answer was $(3, 5]$ &mdash; both endpoints right, but the brackets are swapped.</div><div class="compare-item"><strong>How to avoid:</strong> read off the original inequality character by character. $x \\ge 3$ &rarr; $[$; $x &gt; 3$ &rarr; $($; $x \\le 5$ &rarr; $]$; $x &lt; 5$ &rarr; $)$. No exceptions.</div></div></div>

<h2 class="lesson-title">13. Classical Exercises</h2>

<div class="calc-highlight">Eight problems mixing every technique above. Work each on paper before reading the answer. The asterisk (*) marks the harder ones.</div>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Solve $2x - 5 \\ge 7$.<br><br><em>Answer:</em> $2x \\ge 12 \\;\\Rightarrow\\; x \\ge 6$. Interval: $\\mathbf{[6, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 &mdash; flip required</div><div class="example-body">Solve $-3x + 1 &lt; 10$.<br><br><em>Answer:</em> $-3x &lt; 9$. Divide by $-3$ and <strong>flip</strong>: $x &gt; -3$. Interval: $\\mathbf{(-3, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 &mdash; chain form</div><div class="example-body">Solve $1 \\le x + 3 \\le 8$.<br><br><em>Answer:</em> subtract 3 from all parts: $-2 \\le x \\le 5$. Interval: $\\mathbf{[-2, 5]}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 &mdash; OR / disjoint</div><div class="example-body">Solve "$x &lt; -1$ or $x &gt; 4$".<br><br><em>Answer:</em> two disjoint rays. Solution: $\\mathbf{(-\\infty, -1) \\cup (4, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 &mdash; word problem</div><div class="example-body">A taxi charges 25 TL as a flat fee plus 8 TL per kilometre. For what distances does the total fare stay <em>strictly less than</em> 100 TL?<br><br><em>Setup:</em> let $d$ be the distance in km. Fare $= 25 + 8d$.<br><em>Inequality:</em> $25 + 8d &lt; 100 \\;\\Rightarrow\\; 8d &lt; 75 \\;\\Rightarrow\\; d &lt; 9.375$.<br><em>Answer:</em> for distances <strong>strictly less than $9.375$ km</strong>, that is $\\mathbf{[0, 9.375)}$ km (assuming non-negative distance).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 &mdash; chain with negative middle</div><div class="example-body">Solve $-7 &lt; -2x + 3 \\le 5$.<br><br><em>Answer:</em> subtract 3 from all parts: $-10 &lt; -2x \\le 2$. Divide by $-2$ and <strong>flip every inequality</strong>: $5 &gt; x \\ge -1$. Rewrite left-to-right: $-1 \\le x &lt; 5$. Interval: $\\mathbf{[-1, 5)}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7* &mdash; brackets, fraction, flip</div><div class="example-body">Solve $\\dfrac{2 - 3x}{4} \\ge x - 1$.<br><br><em>Setup:</em> multiply both sides by $4$ (positive &mdash; no flip): $2 - 3x \\ge 4(x - 1) = 4x - 4$.<br>Collect: $2 + 4 \\ge 4x + 3x \\;\\Rightarrow\\; 6 \\ge 7x$.<br>Divide by $7$ (positive &mdash; no flip): $\\dfrac{6}{7} \\ge x$, i.e. $x \\le \\dfrac{6}{7}$.<br><em>Answer:</em> $\\mathbf{\\left(-\\infty, \\, \\dfrac{6}{7}\\right]}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8* &mdash; mixed AND/OR</div><div class="example-body">Find all $x$ such that "$x &gt; 0$ <em>and</em> ($x &lt; -3$ <em>or</em> $x &gt; 5$)".<br><br><em>Reasoning:</em> the OR group gives $(-\\infty, -3) \\cup (5, \\infty)$. Intersecting with $x &gt; 0$ &mdash; the first piece $(-\\infty, -3)$ is wiped out (negative numbers cannot satisfy $x &gt; 0$); the second piece $(5, \\infty)$ survives intact.<br><em>Answer:</em> $\\mathbf{(5, \\infty)}$.</div></div>

<div class="think-box"><div class="think-label">FINAL SUMMARY &mdash; WHAT TO TAKE FROM THIS LESSON</div><div class="think-body"><strong>(1)</strong> Four symbols: $&lt;, &gt;$ are strict (excluded), $\\le, \\ge$ are non-strict (included). <strong>(2)</strong> Picture on number line: open circle = excluded, closed circle = included. <strong>(3)</strong> Interval notation: $($ or $)$ for strict, $[$ or $]$ for non-strict, infinity always uses a round bracket. <strong>(4)</strong> Order axioms: addition preserves, multiplication by positive preserves, <strong>multiplication by negative FLIPS the inequality</strong>. <strong>(5)</strong> Compound: AND is intersection, OR is union; for triple inequalities apply the same operation to all three parts at once. <strong>(6)</strong> Word problems: identify the threshold, write the inequality, solve, then state the answer with units and plain-language meaning.</div></div>
`,

/* ============================================================
   TÜRKÇE VERSİYON
   ============================================================ */
tr: `<p class="l-text"><strong>Denklem, iki niceliğin eşit olduğunu söyler; eşitsizlik ise birinin diğerinden büyük (ya da küçük) olduğunu söyler.</strong> Türkçe gündelik konuşmadaki bütün fark işte budur, ama bu fark cevabın türünü değiştirir. Denklem bilinmeyeni tek bir sayıya (ya da küçük bir avuca) sabitler; eşitsizlikse genellikle sayı doğrusunda bir <em>aralık</em> bulur &mdash; sürekli bir değer aralığı, uçlarından biri ya da her ikisi açık olabilir. Bu aralıkları akıcı biçimde okumak ve yazmak bu dersin ilk teknik becerisidir.</p>

<p class="l-text">İkinci teknik beceri bileşik koşulları çözmektir: "ve" (her ikisinin de doğru olması gerek) ya da "veya" (en az birinin doğru olması yeterli) ile bağlanmış iki eşitsizlik. Bunların arasına da tüm lise cebirinin en sık yapılan tek hatası yerleşir: negatif bir sayıyla çarptığında ya da böldüğünde <strong>eşitsizlik yönünü çevirmeyi unutmak</strong>. Bu dersten başka hiçbir şey aklında kalmayacaksa, bu kalsın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört eşitsizlik sembolünü ($&lt;$, $&gt;$, $\\le$, $\\ge$) doğru kullanacak ve kesin/kesin olmayan durumları birbirinden ayıracaksın</li>
<li>Bir eşitsizliği sayı doğrusu üzerinde taralı bir bölge olarak görselleştirecek, dahil/hariç uç noktaları açık ve dolu halka ile işaretleyeceksin</li>
<li>Aralık gösterimi $(a, b)$, $[a, b]$, $(a, \\infty)$ ile küme kuruluş gösterimi $\\{x \\in \\mathbb{R} : x &gt; 0\\}$ arasında akıcı geçiş yapabileceksin</li>
<li>Sıralama aksiyomlarını uygulayacaksın &mdash; toplama yön korur, pozitif çarpma yön korur, negatif çarpma <strong>yönü ters çevirir</strong></li>
<li>Lineer eşitsizlikleri ve bileşik (VE / VEYA) eşitsizlikleri çözeceksin; üçlü eşitsizliklerle ($a \\le f(x) &lt; b$) çalışabileceksin</li>
<li>Gündelik durumları (tarife, BMI aralığı, çalışma saati sınırı) eşitsizliğe çevirip sonucu sade Türkçeyle yorumlayabileceksin</li>
</ul>
</div>

<h2 class="lesson-title">1. Dört Eşitsizlik Sembolü</h2>

<div class="calc-highlight"><strong>Dört sembol, iki ayrım.</strong> $&lt;$ ve $&gt;$ <em>kesin</em>: eşitliği dışlar. $\\le$ ve $\\ge$ <em>kesin olmayan</em>: eşitliği içerir. Sembolleri sesli okumak &mdash; "küçüktür", "küçük ya da eşittir" &mdash; en güvenli alışkanlıktır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a &lt; b$ &mdash; kesin küçük</div><div class="card-body">"$a$ küçüktür $b$." İki sayı <em>farklı</em>. Örnek: $3 &lt; 7$ (doğru); $5 &lt; 5$ (yanlış).</div></div>
<div class="calc-card"><div class="card-title">$a \\le b$ &mdash; küçük ya da eşit</div><div class="card-body">"$a$, $b$'den küçüktür ya da $a$, $b$'ye eşittir." İkisinden biri yeter. Örnek: $5 \\le 5$ (doğru); $5 \\le 4$ (yanlış).</div></div>
<div class="calc-card"><div class="card-title">$a &gt; b$ &mdash; kesin büyük</div><div class="card-body">"$a$ büyüktür $b$." Tam olarak $&lt;$ işaretinin tersi. Örnek: $7 &gt; 3$ (doğru); $3 &gt; 3$ (yanlış).</div></div>
<div class="calc-card"><div class="card-title">$a \\ge b$ &mdash; büyük ya da eşit</div><div class="card-body">"$a$, $b$'den büyüktür ya da $a$, $b$'ye eşittir." Örnek: $3 \\ge 3$ (doğru); $2 \\ge 5$ (yanlış).</div></div>
</div>

<p class="l-text">Küçük bir bellek yardımı: sembolün geniş tarafı <em>büyük</em> sayıya bakar; dar uç (gaganın ucu) <em>küçük</em> sayıya bakar. $7 &gt; 3$ &mdash; geniş taraf 7'ye, uç 3'e dönük. Kolay öğrenilir, zor unutulur.</p>

<div class="calc-example"><div class="example-label">HIZLI KONTROL</div><div class="example-body">Her ifadenin doğru ya da yanlış olduğuna karar ver.<br>(a) $-3 &lt; -1$. <em>Doğru</em>: sayı doğrusunda $-3$, $-1$'in solundadır.<br>(b) $-5 \\ge -5$. <em>Doğru</em>: "büyük ya da eşit" eşitliği de kapsar.<br>(c) $\\dfrac{1}{2} &gt; 0.6$. <em>Yanlış</em>: $\\dfrac{1}{2} = 0.5 &lt; 0.6$.<br>(d) $0 \\le 0$. <em>Doğru</em>: kesin olmayan versiyonda eşitlik kabul edilir.</div></div>

<div class="l-note"><strong>Negatiflerde sık karışıklık.</strong> Pozitif sayılarda "büyük" sezgiyle örtüşür: 7, 3'ten büyüktür çünkü daha fazla kurabiye demektir. Negatiflerde tablo döner: $-7$, $-3$'ten <em>küçüktür</em>; çünkü sayı doğrusunda daha sola düşer (sıcaklığı düşün: $-7^\\circ$, $-3^\\circ$'den daha soğuktur). Tereddüt edersen sayı doğrusunu çiz.</div>

<h2 class="lesson-title">2. Eşitsizliği Sayı Doğrusunda Görselleştirmek</h2>

<div class="calc-highlight"><strong>Tek değişkenli her eşitsizliğin sayı doğrusu üzerinde bir resmi vardır.</strong> Çözüm bir ışın, yarım doğru ya da sonlu bir aralıktır; tek dikkat edilecek nokta uçlardır: "kesin" için açık halkalar (hariç), "kesin olmayan" için dolu halkalar (dahil).</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Açık halka (&deg;)</div><div class="card-body">$&lt;$ ya da $&gt;$ ile gelen uçlarda kullanılır. Uç noktanın kendisi çözümün <em>parçası değildir</em>. Sayı doğrusunda o değerde küçük boş bir halka çiz.</div></div>
<div class="calc-card"><div class="card-title">Dolu halka (&bull;)</div><div class="card-body">$\\le$ ya da $\\ge$ ile gelen uçlarda kullanılır. Uç noktanın kendisi çözümün <em>parçasıdır</em>. Sayı doğrusunda o değerde küçük dolu bir disk çiz.</div></div>
<div class="calc-card"><div class="card-title">Ok (&rarr;)</div><div class="card-body">Çözüm bir yönde sonsuza uzanıyorsa ok çiz. Sonsuzda halka yoktur; çünkü sonsuz bir sayı değildir, "dahil" ya da "hariç" yapılamaz.</div></div>
</div>

<p class="l-text">$x &gt; 2$, $x \\le -1$ ve $-2 &lt; x \\le 3$ için üç hızlı resim:</p>

<div class="calc-example"><div class="example-label">RESİM 1 &mdash; $x &gt; 2$</div><div class="example-body">$x = 2$'de açık halka (kesin eşitsizlik 2'yi dışlar), sağa kalın boyama, $+\\infty$'a giden ok. Çözüm: $2$'den büyük her reel sayı.</div></div>

<div class="calc-example"><div class="example-label">RESİM 2 &mdash; $x \\le -1$</div><div class="example-body">$x = -1$'de dolu halka (kesin olmayan eşitsizlik $-1$'i <em>dahil</em> eder), sola kalın boyama, $-\\infty$'a giden ok. Çözüm: $-1$'den küçük ya da $-1$'e eşit her reel sayı.</div></div>

<div class="calc-example"><div class="example-label">RESİM 3 &mdash; $-2 &lt; x \\le 3$</div><div class="example-body">$-2$'de açık halka (hariç), $3$'te dolu halka (dahil), iki uç nokta arasında kalın boyama. Çözüm: $-2$'den kesin büyük ve $3$'ten küçük ya da $3$'e eşit her reel sayı.</div></div>

<div class="calc-graph"><div id="plot-l60-numberline-tr" class="plotly-graph" style="height:300px"></div><div class="graph-caption"><strong>Ne görüyoruz:</strong> reel doğru üzerinde çizilmiş $-2 &lt; x \\le 3$ yarı açık aralığı. $-2$'de açık (boş) işaret (hariç, kesin); $3$'te dolu mavi işaret (dahil, kesin olmayan); aradaki çözüm kümesi için kalın mavi bant. Tik etiketleri bağlam olsun diye $-5$ ile $5$ arasında.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[-2,3],y:[0,0],mode:'lines',name:'çözüm',line:{color:'#3b82f6',width:6}};
var openL={x:[-2],y:[0],mode:'markers',name:'x = −2 (hariç)',marker:{color:'#0a0a0a',size:16,line:{color:'#3b82f6',width:3}}};
var closedR={x:[3],y:[0],mode:'markers',name:'x = 3 (dahil)',marker:{color:'#3b82f6',size:16}};
var ticks={x:[-5,-4,-3,-2,-1,0,1,2,3,4,5],y:[0,0,0,0,0,0,0,0,0,0,0],mode:'markers+text',name:'reel doğru',marker:{color:'rgba(255,255,255,0.35)',size:4},text:['−5','−4','−3','−2','−1','0','1','2','3','4','5'],textposition:'bottom center',textfont:{color:'rgba(235,230,220,0.7)',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-6,6],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},yaxis:{range:[-0.5,0.8],gridcolor:'rgba(0,0,0,0)',zerolinecolor:'rgba(255,255,255,0.4)',showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l60-numberline-tr',[ticks,seg,openL,closedR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir sayı doğrusu çiz ve (a) $x \\ge 0$, (b) $x &lt; 4$, (c) $1 \\le x &lt; 5$ çözüm kümelerini tarayarak göster. Her uç noktayı doğru halka ile işaretle. Açık ve dolu halkayı karıştırırsan, alışkanlık otomatikleşene kadar yanına eşitsizliği yazarak hatırlat.</div></div>

<h2 class="lesson-title">3. Aralık Gösterimi</h2>

<div class="calc-highlight"><strong>Aralık gösterimi, bir eşitsizliğin çözüm kümesi için standart kısaltmadır.</strong> Köşeli parantez uç noktanın dahil, yuvarlak parantez ise hariç olduğunu söyler. Sonsuz her zaman yuvarlak parantez alır &mdash; sayı olmayan bir şey "dahil edilemez".</div>

<div class="calc-formula"><div class="formula-label">DÖRT TEMEL ARALIK</div><div class="formula-main">$$\\begin{aligned} (a, b) &amp;= \\{x : a &lt; x &lt; b\\} \\qquad &amp;\\text{açık aralık, her iki uç hariç} \\\\ [a, b] &amp;= \\{x : a \\le x \\le b\\} \\qquad &amp;\\text{kapalı aralık, her iki uç dahil} \\\\ [a, b) &amp;= \\{x : a \\le x &lt; b\\} \\qquad &amp;\\text{yarı açık, sol dahil, sağ hariç} \\\\ (a, b] &amp;= \\{x : a &lt; x \\le b\\} \\qquad &amp;\\text{yarı açık, sol hariç, sağ dahil} \\end{aligned}$$</div><div class="formula-sub">Örüntü: köşeli parantez "[" veya "]" sayı doğrusundaki dolu halka ile eşleşir; yuvarlak parantez "(" veya ")" açık halka ile eşleşir.</div></div>

<p class="l-text"><strong>Sınırsız aralıklar</strong> bir ya da iki yönde sonsuza uzanır:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Eşitsizlik</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Aralık gösterimi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Küme gösterimi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Okunuş</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x &gt; a$</td><td style="padding:0.5rem 0.8rem">$(a, \\infty)$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x &gt; a\\}$</td><td style="padding:0.5rem 0.8rem">"$a$'dan kesin büyük"</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x \\ge a$</td><td style="padding:0.5rem 0.8rem">$[a, \\infty)$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x \\ge a\\}$</td><td style="padding:0.5rem 0.8rem">"en az $a$"</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x &lt; b$</td><td style="padding:0.5rem 0.8rem">$(-\\infty, b)$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x &lt; b\\}$</td><td style="padding:0.5rem 0.8rem">"$b$'den kesin küçük"</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$x \\le b$</td><td style="padding:0.5rem 0.8rem">$(-\\infty, b]$</td><td style="padding:0.5rem 0.8rem">$\\{x \\in \\mathbb{R} : x \\le b\\}$</td><td style="padding:0.5rem 0.8rem">"en fazla $b$"</td></tr>
<tr><td style="padding:0.5rem 0.8rem">tüm reeller</td><td style="padding:0.5rem 0.8rem">$(-\\infty, \\infty)$</td><td style="padding:0.5rem 0.8rem">$\\mathbb{R}$</td><td style="padding:0.5rem 0.8rem">"herhangi bir reel sayı"</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">ÇEVİRİ ALIŞTIRMASI</div><div class="example-body">Her eşitsizliği aralık gösterimine çevir.<br>(a) $x &gt; 5$ &rarr; $\\mathbf{(5, \\infty)}$.<br>(b) $-3 \\le x \\le 7$ &rarr; $\\mathbf{[-3, 7]}$.<br>(c) $0 &lt; x \\le 1$ &rarr; $\\mathbf{(0, 1]}$.<br>(d) $x \\ne 4$ &rarr; $\\mathbf{(-\\infty, 4) \\cup (4, \\infty)}$ &mdash; iki aralığın birleşimi; çünkü "4 dışındaki her şey" tek noktayı çıkardığında geriye kalan.</div></div>

<div class="l-note"><strong>Küme gösterimi daha uzun ama daha esnek.</strong> Aralık gösterimi basit şekilleri (tek bant, ışın) iyi anlatır. "Tüm reeller, 4 hariç" ya da "0 ile 1 arasındaki tüm rasyoneller" gibi tuhaflıklarda küme gösterimi $\\{x : \\text{koşul}\\}$ daha temizdir. İki gösterim de standarttır; ikisini de okumayı öğren.</div>

<h2 class="lesson-title">4. Sıralama Aksiyomları (ve Isıran Tek Kural)</h2>

<div class="calc-highlight"><strong>Bir eşitsizliğe yapabileceklerini üç kural yönetir.</strong> İkisi yönü korur; biri ters çevirir. Çeviren kural tek dişli olandır ve öğrencilerin unuttuğu kuraldır. Otomatik hâle gelene dek pratik yap.</div>

<div class="calc-formula"><div class="formula-label">KURAL 1 &mdash; TOPLAMA / ÇIKARMA</div><div class="formula-main">$$a &lt; b \\;\\Longleftrightarrow\\; a + c &lt; b + c \\quad \\text{her reel } c \\text{ için}$$</div><div class="formula-sub">İki tarafa istediğini ekleyip çıkarabilirsin; yön değişmez. Denklemlerle aynı.</div></div>

<div class="calc-formula"><div class="formula-label">KURAL 2 &mdash; POZİTİF SAYIYLA ÇARPMA / BÖLME</div><div class="formula-main">$$a &lt; b \\;\\Longleftrightarrow\\; ka &lt; kb \\quad (k &gt; 0)$$</div><div class="formula-sub">Pozitif ölçekleme sırayı korur. Örnek: $2 &lt; 5$, 3 ile çarp &rarr; $6 &lt; 15$. Hâlâ doğru, hâlâ aynı yönde.</div></div>

<div class="calc-formula"><div class="formula-label">KURAL 3 &mdash; NEGATİF SAYIYLA ÇARPMA / BÖLME &mdash; YÖN ÇEVİRİR</div><div class="formula-main">$$a &lt; b \\;\\Longleftrightarrow\\; ka &gt; kb \\quad (k &lt; 0)$$</div><div class="formula-sub">Negatif ölçekleme yönü <strong>ters çevirir</strong>. Örnek: $2 &lt; 5$, $-3$ ile çarp &rarr; $-6$ ve $-15$. $-6 &lt; -15$ mi? Hayır: $-6$ daha büyük sayıdır ($-6 &gt; -15$). İşaret çevrildi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kural 3'ün sezgisi</div><div class="card-body">$-1$ ile çarpmak, sayı doğrusunu sıfır etrafında ayna yansıtmaktır. Sağdaki sayılar sola, soldakiler sağa gider. Bu yüzden küçük sayı büyük olur &mdash; sıra çevrilir.</div></div>
<div class="calc-card"><div class="card-title">Çevirmenin uygulandığı yer</div><div class="card-body">Yalnız <em>negatif</em> bir sayıyla çarptığında ya da böldüğünde uygulanır. Negatif bir sayıyı eklemek ya da çıkarmak <strong>çevirmeyi tetiklemez</strong> &mdash; o sadece normal bir çıkarmadır.</div></div>
<div class="calc-card"><div class="card-title">Çevirdiğinde</div><div class="card-body">Zincirdeki <em>tüm</em> eşitsizlik sembollerini aynı anda çevir. $a &lt; b \\le c$, $-1$ ile çarpılınca $-a &gt; -b \\ge -c$ olur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; iki kural arka arkaya</div><div class="example-body">$4 &lt; 9$ ile başla.<br>İki tarafa 3 ekle &rarr; $7 &lt; 12$. Hâlâ doğru, aynı yön.<br>İki tarafı 2 ile çarp &rarr; $14 &lt; 24$. Hâlâ doğru, aynı yön.<br>İki tarafı $-2$ ile çarp &rarr; $-28$ ve $-48$. Çevirme kuralı yön ters döner der: $-28 &gt; -48$. Kontrol: evet, $-28$, $-48$'den büyük (sıfıra daha yakın). Onaylandı.</div></div>

<div class="l-note"><strong>Çevirme kuralı neden hiç yok olmaz.</strong> Bilinmeyenin katsayısı negatif olan her eşitsizlikte son adımda Kural 3'ü kullanmak zorundasın. Atlamak küçük bir hata üretmez &mdash; doğru cevabın <em>tam tersini</em> üretir. Çözüm kümesinin işareti baştan sona yanlış olur.</div>

<h2 class="lesson-title">5. Lineer Eşitsizlikleri Çözmek</h2>

<div class="calc-highlight"><strong>Denklemlerle aynı yöntem, bir ek ile.</strong> Her tarafı sadeleştir, $x$'li terimleri bir tarafa ve sabitleri diğer tarafa topla, $x$'in katsayısına böl &mdash; <em>eğer</em> bu katsayı negatifse eşitsizlik işaretini çevir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 &mdash; Sadeleştir</div><div class="card-body">Parantezleri aç, benzer terimleri topla, paydaları temizle (tüm paydaların EKOK'u ile çarp &mdash; bu daima pozitiftir, yön değişmez).</div></div>
<div class="calc-card"><div class="card-title">Adım 2 &mdash; Topla</div><div class="card-body">Tüm $x$'li terimleri bir tarafa, sabitleri diğer tarafa götür. Toplama ve çıkarma yönü korur.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 &mdash; Böl (gerekirse çevir!)</div><div class="card-body">İki tarafı $x$'in katsayısına böl. Pozitifse yönü koru. <strong>Negatifse çevir</strong>.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 &mdash; Çözüm kümesini yaz</div><div class="card-body">Cevabı aralık gösterimiyle ifade et, sonra opsiyonel olarak sayı doğrusu resmini çiz.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; çevirme yok</div><div class="example-body">$3x + 5 &lt; 14$ eşitsizliğini çöz.<br><br>5 çıkar: $3x &lt; 9$. 3'e böl (pozitif &mdash; yön değişmez): $x &lt; 3$.<br><br>Çözüm: $\\mathbf{(-\\infty, 3)}$. Sayı doğrusunda $3$'te açık halka ve sola doğru $-\\infty$'a uzanan boyama.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; çevirme gerekli</div><div class="example-body">$-3x + 1 &lt; 10$ eşitsizliğini çöz.<br><br>1 çıkar: $-3x &lt; 9$. $-3$'e böl &mdash; <strong>eşitsizliği çevir</strong>:<br>$x &gt; -3$.<br><br>Çözüm: $\\mathbf{(-3, \\infty)}$. <em>Önerilen çözüm kümesinden bir sayıyla doğrula: $x = 0$ dene. Orijinal: $-3(0) + 1 = 1$ ve $1 &lt; 10$ doğru. Onay.</em></div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; parantez ve iki tarafta $x$</div><div class="example-body">$4(x - 2) \\ge 2x + 6$ eşitsizliğini çöz.<br><br>Aç: $4x - 8 \\ge 2x + 6$.<br>$2x$ çıkar, 8 ekle: $2x \\ge 14$.<br>2'ye böl (pozitif, yön değişmez): $x \\ge 7$.<br><br>Çözüm: $\\mathbf{[7, \\infty)}$. $7$'de dolu halka, sağa doğru $+\\infty$'a uzanan boyama.</div></div>

<div class="think-box"><div class="think-label">ÇEVİRME KONTROL LİSTESİ</div><div class="think-body">Her iki tarafı bir sayıya böldüğün her seferinde kendine sor: <em>bu sayı negatif mi?</em> Evetse eşitsizliği çevir. Hayırsa olduğu gibi bırak. Bu soruyu refleks hâline getir. YKS'deki en sık tek hata bu soruyu sormayı unutmaktır.</div></div>

<h2 class="lesson-title">6. Bileşik Eşitsizlikler &mdash; VE (Kesişim)</h2>

<div class="calc-highlight"><strong>"Ve" ile bağlı bir bileşik eşitsizlik, aynı anda gerçekleşmesi gereken iki koşullu sistemdir.</strong> Çözüm, iki ayrı çözüm kümesinin <em>kesişimi</em>dir &mdash; sayı doğrusunda iki aralığın örtüştüğü yer.</div>

<p class="l-text">Tipik bir "ve" eşitsizliği $-3 \\le 2x + 1 &lt; 7$ gibi bir zincir olarak yazılır. Bunu sesli oku: "$-3 \\le 2x + 1$ ve $2x + 1 &lt; 7$". Bilinmeyen $x$, her iki yarımı da aynı anda sağlamalı.</p>

<div class="calc-formula"><div class="formula-label">VE &mdash; KESİŞİM</div><div class="formula-main">$$\\underbrace{a \\le f(x)}_{\\text{koşul 1}} \\;\\text{ ve }\\; \\underbrace{f(x) &lt; b}_{\\text{koşul 2}} \\;\\;\\Longleftrightarrow\\;\\; a \\le f(x) &lt; b$$</div><div class="formula-sub">İki yarımı ayrı ayrı çöz, iki çözüm kümesinin kesişimini al. $a \\le f(x) &lt; b$ gibi zincir eşitsizlikler için üç parçayı aynı anda işle: ortaya ne yaparsan iki uca da onu yap.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; zincir biçimi</div><div class="example-body">$-3 \\le 2x + 1 &lt; 7$ eşitsizliğini çöz.<br><br>Üç parçadan 1 çıkar: $-4 \\le 2x &lt; 6$.<br>Üç parçayı 2'ye böl (pozitif &mdash; çevirme yok): $-2 \\le x &lt; 3$.<br><br>Çözüm: $\\mathbf{[-2, 3)}$. $-2$'de dolu halka (dahil), $3$'te açık halka (hariç), aralarında kalın boyama.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; iki koşul olarak yazılı</div><div class="example-body">"$x &gt; -1$ ve $x \\le 4$" çöz.<br><br>1. çözüm: $(-1, \\infty)$. 2. çözüm: $(-\\infty, 4]$.<br>Kesişim: hem $-1$'den kesin büyük <em>hem</em> 4'ten küçük ya da eşit olan sayılar &mdash; yarı açık aralık $(-1, 4]$.<br><br>Çözüm: $\\mathbf{(-1, 4]}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; boş kesişim</div><div class="example-body">"$x &gt; 5$ ve $x &lt; 2$" çöz.<br><br>Hiçbir sayı aynı anda hem 5'ten büyük hem 2'den küçük değildir. Kesişim boştur.<br><br>Çözüm: $\\mathbf{\\varnothing}$ &mdash; çözüm yok. $5 &lt; x &lt; 2$ gibi imkânsız zincirlere dikkat &mdash; üst sınır alt sınırdan küçük, zincirin kendisi çelişkili.</div></div>

<h2 class="lesson-title">7. Bileşik Eşitsizlikler &mdash; VEYA (Birleşim)</h2>

<div class="calc-highlight"><strong>"Veya" ile bağlı bileşik eşitsizlik, iki koşuldan en az birinin sağlanmasıyla doğru olur.</strong> Çözüm, iki ayrı çözüm kümesinin <em>birleşimi</em>dir &mdash; sayı doğrusundaki ortak bölge. Çoğu zaman iki parça birbirine değmez, cevap birleşim sembolü $\\cup$ ile yazılır.</div>

<div class="calc-formula"><div class="formula-label">VEYA &mdash; BİRLEŞİM</div><div class="formula-main">$$\\underbrace{f(x) &lt; a}_{\\text{koşul 1}} \\;\\text{ veya }\\; \\underbrace{f(x) &gt; b}_{\\text{koşul 2}} \\;\\;\\Longleftrightarrow\\;\\; (-\\infty, a) \\cup (b, \\infty)$$</div><div class="formula-sub">İki aralık ayrıksa (örtüşmüyorsa) birleşim sembolünü mutlaka koru &mdash; tek bir aralığa indiremezsin.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; ters yönlere giden iki ışın</div><div class="example-body">"$x &lt; -2$ veya $x &gt; 5$" çöz.<br><br>Ters yönlere giden iki ışın, birbirine değmiyor.<br><br>Çözüm: $\\mathbf{(-\\infty, -2) \\cup (5, \\infty)}$. Sayı doğrusu: $-2$'de açık halka ve sola boyama, $5$'te açık halka ve sağa boyama, ortada boş aralık.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; örtüşen ışınlar</div><div class="example-body">"$x &gt; 1$ veya $x &gt; -3$" çöz.<br><br>1'den büyük her sayı zaten $-3$'ten büyüktür, ama ikinci koşul daha geniştir: ilk koşulun reddettiği $0$ gibi sayıları kabul eder. Birleşim, iki kümeden büyüğüdür.<br><br>Çözüm: $\\mathbf{(-3, \\infty)}$. Birinci koşul yeni bir şey katmıyor çünkü zaten ikincinin içinde.</div></div>

<div class="calc-graph"><div id="plot-l60-compound-tr" class="plotly-graph" style="height:320px"></div><div class="graph-caption"><strong>Ne görüyoruz:</strong> tek bir eksen üzerinde yan yana üç çözüm örüntüsü. Üst satır VE (kesişim), cevap $[-2, 3)$ &mdash; tek kalın bant. Orta satır VEYA (ayrık birleşim), cevap $(-\\infty, -2) \\cup (5, \\infty)$ &mdash; birbirinden ayrık iki ışın. Alt satır VEYA (örtüşen), cevap $(-3, \\infty)$ &mdash; tek ışın, çünkü bir küme zaten diğerini kapsıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var andSeg={x:[-2,3],y:[2,2],mode:'lines',name:'VE: [−2, 3)',line:{color:'#3b82f6',width:6}};
var andL={x:[-2],y:[2],mode:'markers',name:'',marker:{color:'#3b82f6',size:14},showlegend:false};
var andR={x:[3],y:[2],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#3b82f6',width:3}},showlegend:false};
var orSeg1={x:[-7,-2],y:[1,1],mode:'lines',name:'VEYA: (−∞,−2) ∪ (5,∞)',line:{color:'#f59e0b',width:6}};
var orSeg2={x:[5,9],y:[1,1],mode:'lines',name:'',line:{color:'#f59e0b',width:6},showlegend:false};
var orL={x:[-2],y:[1],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:3}},showlegend:false};
var orR={x:[5],y:[1],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#f59e0b',width:3}},showlegend:false};
var ovSeg={x:[-3,9],y:[0,0],mode:'lines',name:'VEYA örtüşen: (−3, ∞)',line:{color:'#22c55e',width:6}};
var ovL={x:[-3],y:[0],mode:'markers',name:'',marker:{color:'#0a0a0a',size:14,line:{color:'#22c55e',width:3}},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,10],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.4)'},yaxis:{range:[-0.5,2.8],gridcolor:'rgba(0,0,0,0)',zerolinecolor:'rgba(0,0,0,0)',showticklabels:false},margin:{t:30,r:30,b:50,l:30},legend:{orientation:'h',y:1.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l60-compound-tr',[andSeg,andL,andR,orSeg1,orSeg2,orL,orR,ovSeg,ovL],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>"Ve / veya" tuzağı.</strong> Günlük Türkçede "veya" bazen kapsayıcı (biri ya da her ikisi), "ve" bazen sınırlayıcı (her ikisi) duyulur. Matematikte bu kelimelerin tam karşılığı budur. Ama bir problem "Ali 5.000 TL'den az <em>veya</em> 10.000 TL'den çok kazanıyor" diyorsa dikkat: çözüm bu iki aralığın birleşimidir, boş kesişim değil.</div>

<h2 class="lesson-title">8. Üçlü Eşitsizlikler &mdash; Zincir Biçimi</h2>

<div class="calc-highlight"><strong>Üçlü eşitsizlik aslında kompakt yazılmış bir VE eşitsizliğidir.</strong> $1 &lt; x + 2 \\le 7$, "$1 &lt; x + 2$ <em>ve</em> $x + 2 \\le 7$" demenin kısa yoludur. Üç parçaya aynı işlemi aynı anda uygulayarak çöz.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body">$1 &lt; x + 2 \\le 7$ eşitsizliğini çöz.<br><br>Üç parçadan 2 çıkar: $-1 &lt; x \\le 5$.<br><br>Çözüm: $\\mathbf{(-1, 5]}$. $-1$'de açık halka, $5$'te dolu halka, aralarında kalın boyama.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; bölme içerir</div><div class="example-body">$-2 \\le \\dfrac{2x - 1}{3} &lt; 4$ eşitsizliğini çöz.<br><br>Üç parçayı 3 ile çarp (pozitif &mdash; çevirme yok): $-6 \\le 2x - 1 &lt; 12$.<br>Üç parçaya 1 ekle: $-5 \\le 2x &lt; 13$.<br>Üç parçayı 2'ye böl (pozitif &mdash; çevirme yok): $-\\dfrac{5}{2} \\le x &lt; \\dfrac{13}{2}$.<br><br>Çözüm: $\\mathbf{\\left[-\\dfrac{5}{2}, \\, \\dfrac{13}{2}\\right)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; ortada negatif katsayı</div><div class="example-body">$-1 &lt; -2x + 3 \\le 5$ eşitsizliğini çöz.<br><br>3 çıkar: $-4 &lt; -2x \\le 2$.<br>$-2$'ye böl &mdash; <strong>her iki eşitsizliği çevir</strong>:<br>$2 &gt; x \\ge -1$, yani $-1 \\le x &lt; 2$.<br><br>Çözüm: $\\mathbf{[-1, 2)}$. <em>Sonunda zincir eşitsizlikleri her zaman küçükten büyüğe yeniden yaz; böylece resim soldan sağa olur.</em></div></div>

<div class="think-box"><div class="think-label">BİÇİM KONTROLÜ</div><div class="think-body">Geçerli bir zincir eşitsizlik daima tutarlı tek bir yönde okunur. "$5 &lt; x &gt; 2$" anlamsızdır &mdash; oklar ters yönlere bakar. Eğer böyle bir şey üretirsen işaret hatası yapmışsındır. Sıfırdan yeniden yaz.</div></div>

<h2 class="lesson-title">9. Sözel Problem 1 &mdash; Eşikli Tarife</h2>

<div class="calc-highlight"><strong>Birçok gerçek hayat problemi eşik içerir: belirli bir miktarın üstünde değişen fiyatlar, belirli bir gelirin üstünde devreye giren vergiler, minimum siparişin üstünde ücretsiz kargo.</strong> Hepsi gizli birer lineer eşitsizliktir.</div>

<p class="l-text"><strong>Problem.</strong> Bir mobil veri planı, sabit aylık 80 TL ücret artı ilk 10 GB üzerindeki her GB için 5 TL alır (ilk 10 GB dahildir). Toplam faturanın <em>en fazla</em> 200 TL kalması için aylık kullanım hangi aralıkta olmalı?</p>

<p class="l-text"><strong>Kurulum.</strong> $x$ aylık kullanım (GB) olsun. İlk 10 GB ücretsiz; yalnız 10 GB'ın üstü ücretlendirilir. İki durum:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum A: $x \\le 10$</div><div class="card-body">Fatura yalnızca 80 TL (ek ücret yok). Bu otomatik olarak $\\le 200$ TL'dir, dolayısıyla $[0, 10]$ aralığındaki her $x$ koşulu sağlar.</div></div>
<div class="calc-card"><div class="card-title">Durum B: $x &gt; 10$</div><div class="card-body">Fatura $80 + 5(x - 10)$ TL. $80 + 5(x - 10) \\le 200$ gerekli.</div></div>
</div>

<p class="l-text"><strong>Durum B'yi çöz.</strong> $80 + 5(x - 10) \\le 200 \\;\\Longrightarrow\\; 5(x - 10) \\le 120 \\;\\Longrightarrow\\; x - 10 \\le 24 \\;\\Longrightarrow\\; x \\le 34$.</p>

<p class="l-text"><strong>Birleştir.</strong> İki durum birleşince $0 \\le x \\le 34$, yani kapalı aralık $[0, 34]$ GB. Aylık kullanım 34 GB ya da altında kaldığı sürece fatura en fazla 200 TL.</p>

<div class="calc-graph"><div id="plot-l60-tariff-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Ne görüyoruz:</strong> aylık veri kullanımına (GB) karşı toplam fatura (TL). Mavi parçalı doğru $x \\le 10$ iken 80 TL'de yatay; sonrasında 5 TL/GB eğimle yükselir. Kesik turuncu yatay çizgi $y = 200$, 200 TL eşiğidir; x ekseni üzerindeki yeşil çözüm bandı faturanın 200 TL'de ya da altında kaldığı kullanım aralığını gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=50;i++){var v=i;xs.push(v);ys.push(v<=10?80:80+5*(v-10));}
var billLine={x:xs,y:ys,mode:'lines',name:'toplam fatura',line:{color:'#3b82f6',width:3}};
var threshold={x:[0,50],y:[200,200],mode:'lines',name:'200 TL sınırı',line:{color:'#f59e0b',width:2,dash:'dash'}};
var solRange={x:[0,34],y:[0,0],mode:'lines',name:'izinli kullanım',line:{color:'#22c55e',width:6}};
var solMark={x:[34],y:[200],mode:'markers+text',name:'',marker:{color:'#22c55e',size:12},text:['x = 34'],textposition:'top right',textfont:{color:'#22c55e',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'aylık kullanım (GB)',range:[0,50],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'toplam fatura (TL)',range:[0,310],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:55,l:65},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l60-tariff-tr',[billLine,threshold,solRange,solMark],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Sözel Problem 2 &mdash; BMI Aralığı</h2>

<div class="calc-highlight"><strong>Beden Kütle İndeksi (BMI), $\\text{BMI} = \\dfrac{m}{h^2}$ formülüyle tanımlanır; $m$ kilogram, $h$ metre cinsindendir.</strong> Dünya Sağlık Örgütü'nün kullandığı "normal" aralık $18.5 \\le \\text{BMI} &lt; 25$ &mdash; bir zincir eşitsizlik.</div>

<p class="l-text"><strong>Problem.</strong> $1.70$ m boyundaki bir kişinin BMI'sinin normal aralığa düşmesi için vücut kütlesi $m$ (kg) hangi aralıkta olmalı?</p>

<p class="l-text"><strong>Kurulum.</strong> $\\text{BMI} = \\dfrac{m}{1.70^2} = \\dfrac{m}{2.89}$. Koşul:</p>

<div class="calc-formula"><div class="formula-main">$$18.5 \\;\\le\\; \\dfrac{m}{2.89} \\;&lt;\\; 25$$</div></div>

<p class="l-text"><strong>Çöz.</strong> Üç parçayı $2.89$ ile çarp (pozitif, çevirme yok):</p>

<div class="calc-formula"><div class="formula-main">$$18.5 \\times 2.89 \\;\\le\\; m \\;&lt;\\; 25 \\times 2.89$$</div></div>

<p class="l-text">Yani $53.47 \\le m &lt; 72.25$. <strong>Sonuç:</strong> $1.70$ m boyundaki bir kişi için yaklaşık $53.5$ kg (dahil) ile $72.3$ kg (hariç) arasındaki vücut kütlesi "normal" BMI verir. Aralık $[53.47, \\, 72.25)$.</p>

<div class="l-note"><strong>Sağ uç neden hariç?</strong> DSÖ "fazla kilolu"yu BMI $\\ge 25$ olarak tanımlar; o yüzden normal bant <em>kesin olarak 25'in altında</em> biter &mdash; 25 değeri bir sonraki kategoriye aittir. Soldaki $\\le$ ile sağdaki $&lt;$ arasındaki asimetri bilinçlidir: her BMI değeri tam olarak tek bir banda ait olur, çakışma olmaz.</div>

<h2 class="lesson-title">11. Sözel Problem 3 &mdash; Çalışma Saati Sınırı</h2>

<div class="calc-highlight"><strong>Eşitsizlikler kuralları ve sınırları da modeller.</strong> "Haftada en fazla 40 saat", "20 üzerinden en çok üç hata", "en az %75 devam" &mdash; sembollere döktüğünde hepsi lineer eşitsizlik.</div>

<p class="l-text"><strong>Problem.</strong> Öğrenci işçi saat başı 50 TL alıyor. İşveren ekstra 200 TL haftalık ikramiye veriyor, ama yalnız hafta sonu 5 saatten <em>kesin az</em> çalıştığı zaman (ders çalışmaya zaman kalsın). Öğrenci toplam haftalık geliri (saatlik kazanç artı uygunsa ikramiye) en az 600 TL olsun istiyor. $h$ hafta sonu çalışma saati olsun. Öğrenci hem ikramiyeyi alıp hem en az 600 TL kazanması için $h$'nin hangi değerlerinde olmalı?</p>

<p class="l-text"><strong>Kurulum.</strong> İkramiyeli toplam $50h + 200$. Aynı anda iki koşul:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Koşul 1: ikramiye uygunluğu</div><div class="card-body">$h &lt; 5$ &mdash; 5 saatten kesin az. Çözüm: $(-\\infty, 5)$.</div></div>
<div class="calc-card"><div class="card-title">Koşul 2: en az 600 TL</div><div class="card-body">$50h + 200 \\ge 600 \\Rightarrow 50h \\ge 400 \\Rightarrow h \\ge 8$. Çözüm: $[8, \\infty)$.</div></div>
</div>

<p class="l-text"><strong>Birleştir (VE).</strong> $(-\\infty, 5)$ ile $[8, \\infty)$ kesişimi boş: hiçbir $h$ değeri iki koşulu birden sağlamaz. <strong>Sonuç:</strong> hafta sonu çalışma saatleriyle hem ikramiyeyi tutmak hem en az 600 TL kazanmak imkânsız. Öğrenci ya ikramiyeden vazgeçer ya da ek kazancı hafta içi alır. (Eşitsizliklerin rolüne dikkat: eşitsizlik yönüne tek tıkla problem çözülebilir olur. Eşitsizlikler, denklemlerin gösteremediği kısıtlamaları açığa çıkarır.)</p>

<h2 class="lesson-title">12. Yaygın Hatalar</h2>

<div class="calc-highlight"><strong>Üç hata öğrencileri neredeyse her seferinde yakalar.</strong> Bu bölümü iki kez oku, her sınav öncesi geri dön.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA 1 &mdash; çevirmeyi unutmak</div><div class="compare-item">"$-2x &lt; 6 \\Rightarrow x &lt; -3$" &mdash; YANLIŞ: $-2$'ye bölünürken işaret çevrilmedi.</div><div class="compare-item">"$-2x &lt; 6 \\Rightarrow x &gt; -3$" &mdash; DOĞRU.</div><div class="compare-item"><strong>Nasıl önlersin:</strong> bölme anında bölenin işaretine bak. Negatifse her $&lt;$'yi $&gt;$'ye, her $\\le$'yi $\\ge$'ye çevir.</div></div><div class="compare-col"><div class="compare-title">HATA 2 &mdash; kesin ile kesin olmayanı karıştırmak</div><div class="compare-item">"$x &lt; 5$ demek $x \\le 4$ demektir (eğer $x$ tam sayıysa)" &mdash; ancak $x$'in tam sayı olduğu söylendiyse doğrudur. Reeller üzerinde $x &lt; 5$, $4.999$, $4.9999$ vb. değerleri kapsar.</div><div class="compare-item"><strong>Nasıl önlersin:</strong> $x$'in hangi sayı türünden olduğunu her zaman oku (reel, tam, doğal). Reellerde kesin ile kesin olmayan gerçekten farklıdır.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA 3 &mdash; VE ile VEYA'yı karıştırmak</div><div class="compare-item">"$x &gt; 2$ veya $x &lt; 5$" çöz &rarr; öğrenci kesişim $(2, 5)$ yazar. <em>Yanlış</em>: "veya" birleşimdir; burada <em>tüm</em> reel sayılar, $(-\\infty, \\infty) = \\mathbb{R}$.</div><div class="compare-item"><strong>Nasıl önlersin:</strong> iki çözüm kümesini iki ayrı taranmış sayı doğrusu olarak alt alta çiz. "VE" yalnız ikisinin de tarandığı kolonu tutar; "VEYA" en az birinin tarandığı her kolonu tutar.</div></div><div class="compare-col"><div class="compare-title">HATA 4 &mdash; yanlış ucu açmak / kapatmak</div><div class="compare-item">Cevap $(3, 5]$ iken $[3, 5)$ yazmak &mdash; iki uç doğru, ama parantezler ters.</div><div class="compare-item"><strong>Nasıl önlersin:</strong> orijinal eşitsizliği karakter karakter oku. $x \\ge 3$ &rarr; $[$; $x &gt; 3$ &rarr; $($; $x \\le 5$ &rarr; $]$; $x &lt; 5$ &rarr; $)$. İstisna yok.</div></div></div>

<h2 class="lesson-title">13. Klasik Alıştırmalar</h2>

<div class="calc-highlight">Yukarıdaki tüm teknikleri karıştıran sekiz problem. Her birini cevaba bakmadan önce kâğıda çöz. Yıldız (*) zor olanları gösterir.</div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">$2x - 5 \\ge 7$ eşitsizliğini çöz.<br><br><em>Cevap:</em> $2x \\ge 12 \\;\\Rightarrow\\; x \\ge 6$. Aralık: $\\mathbf{[6, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 &mdash; çevirme gerekli</div><div class="example-body">$-3x + 1 &lt; 10$ eşitsizliğini çöz.<br><br><em>Cevap:</em> $-3x &lt; 9$. $-3$'e böl ve <strong>çevir</strong>: $x &gt; -3$. Aralık: $\\mathbf{(-3, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 &mdash; zincir biçimi</div><div class="example-body">$1 \\le x + 3 \\le 8$ eşitsizliğini çöz.<br><br><em>Cevap:</em> üç parçadan 3 çıkar: $-2 \\le x \\le 5$. Aralık: $\\mathbf{[-2, 5]}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 &mdash; VEYA / ayrık</div><div class="example-body">"$x &lt; -1$ veya $x &gt; 4$" çöz.<br><br><em>Cevap:</em> iki ayrık ışın. Çözüm: $\\mathbf{(-\\infty, -1) \\cup (4, \\infty)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 &mdash; sözel problem</div><div class="example-body">Bir taksi 25 TL açılış ücreti artı kilometre başına 8 TL alıyor. Toplam ücretin <em>kesin olarak</em> 100 TL'den az kalması için mesafe ne aralıkta olmalı?<br><br><em>Kurulum:</em> $d$ mesafe (km) olsun. Ücret $= 25 + 8d$.<br><em>Eşitsizlik:</em> $25 + 8d &lt; 100 \\;\\Rightarrow\\; 8d &lt; 75 \\;\\Rightarrow\\; d &lt; 9.375$.<br><em>Cevap:</em> <strong>$9.375$ km'den kesin az</strong> mesafelerde, yani $\\mathbf{[0, 9.375)}$ km (mesafenin negatif olmadığı varsayılır).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 &mdash; ortada negatifli zincir</div><div class="example-body">$-7 &lt; -2x + 3 \\le 5$ eşitsizliğini çöz.<br><br><em>Cevap:</em> üç parçadan 3 çıkar: $-10 &lt; -2x \\le 2$. $-2$'ye böl ve <strong>her eşitsizliği çevir</strong>: $5 &gt; x \\ge -1$. Soldan sağa yeniden yaz: $-1 \\le x &lt; 5$. Aralık: $\\mathbf{[-1, 5)}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7* &mdash; parantez, kesir, çevirme</div><div class="example-body">$\\dfrac{2 - 3x}{4} \\ge x - 1$ eşitsizliğini çöz.<br><br><em>Kurulum:</em> iki tarafı 4 ile çarp (pozitif &mdash; çevirme yok): $2 - 3x \\ge 4(x - 1) = 4x - 4$.<br>Topla: $2 + 4 \\ge 4x + 3x \\;\\Rightarrow\\; 6 \\ge 7x$.<br>7'ye böl (pozitif &mdash; çevirme yok): $\\dfrac{6}{7} \\ge x$, yani $x \\le \\dfrac{6}{7}$.<br><em>Cevap:</em> $\\mathbf{\\left(-\\infty, \\, \\dfrac{6}{7}\\right]}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8* &mdash; karma VE/VEYA</div><div class="example-body">"$x &gt; 0$ <em>ve</em> ($x &lt; -3$ <em>veya</em> $x &gt; 5$)" eşitsizliğini sağlayan tüm $x$'leri bul.<br><br><em>Mantık:</em> VEYA grubu $(-\\infty, -3) \\cup (5, \\infty)$ verir. $x &gt; 0$ ile kesiştir &mdash; ilk parça $(-\\infty, -3)$ silinir (negatif sayılar $x &gt; 0$'ı sağlayamaz); ikinci parça $(5, \\infty)$ olduğu gibi kalır.<br><em>Cevap:</em> $\\mathbf{(5, \\infty)}$.</div></div>

<div class="think-box"><div class="think-label">SON ÖZET &mdash; BU DERSTEN AKLINDA NE KALSIN</div><div class="think-body"><strong>(1)</strong> Dört sembol: $&lt;, &gt;$ kesin (hariç), $\\le, \\ge$ kesin olmayan (dahil). <strong>(2)</strong> Sayı doğrusu resmi: açık halka = hariç, dolu halka = dahil. <strong>(3)</strong> Aralık gösterimi: kesin için $($ veya $)$, kesin olmayan için $[$ veya $]$, sonsuz her zaman yuvarlak parantez. <strong>(4)</strong> Sıralama aksiyomları: toplama yön korur, pozitif çarpma yön korur, <strong>negatif çarpma eşitsizliği ÇEVİRİR</strong>. <strong>(5)</strong> Bileşik: VE kesişim, VEYA birleşim; üçlü eşitsizliklerde aynı işlemi üç parçaya aynı anda uygula. <strong>(6)</strong> Sözel problemler: eşiği belirle, eşitsizliği yaz, çöz, sonra cevabı birim ve sade dille ifade et.</div></div>
`
};
