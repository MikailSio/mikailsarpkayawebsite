/* ============================================================
   tutorials/matematik/L38.js
   Lesson 38 — Logaritmik Denklem ve Eşitsizlikler
   Pure educational content for Turkish high school students.
   No Python, no ML. Bilingual EN/TR with KaTeX + Plotly.
   ============================================================ */

window.LISE_MAT_L38 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `
<p class="l-text"><strong>Logarithmic equations and inequalities are the natural counterpart to exponential equations.</strong> Where an exponential equation hides the unknown in the exponent, a logarithmic equation hides it inside the argument of a logarithm. Solving one almost always involves converting between the two — either rewriting $\\log_a f(x) = b$ as $f(x) = a^b$, or compressing several $\\log$ terms into a single $\\log$ and matching the arguments. The algebra is short. What makes these problems easy to get wrong is the <em>domain</em>: every $\\log$ requires a strictly positive argument, and a value that solves the polynomial step but violates the domain is a <strong>fake</strong> solution that must be thrown away.</p>

<p class="l-text">In this lesson we work through three families of logarithmic equations, study substitution tricks that turn quadratics-in-$\\log x$ into ordinary quadratics, examine the inequality versions (where the direction of the inequality depends on whether the base is bigger or smaller than $1$), and finish with mixed exponential-plus-logarithmic problems and a long list of classroom-style exercises.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Identify the three canonical types of logarithmic equation and pick the right move for each</li>
<li>Write the <strong>domain conditions</strong> for every logarithm in a problem and use them to filter out fake roots</li>
<li>Convert $\\log_a f(x) = b$ to its exponential form $f(x) = a^b$ and solve cleanly</li>
<li>Compress $\\log_a f(x) = \\log_a g(x)$ to $f(x) = g(x)$ and check both sides against the domain</li>
<li>Apply the substitution $t = \\log x$ to turn $\\log^2 x - 5 \\log x + 6 = 0$ into a quadratic in $t$</li>
<li>Solve logarithmic inequalities, flipping the direction when the base satisfies $0 < a < 1$</li>
<li>Combine exponential and logarithmic moves in one problem (e.g. $x^{\\log x} = 100x$)</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1: Three Types of Logarithmic Equation
     ============================================================ -->
<h2 class="l-title">1. The Three Types of Logarithmic Equation</h2>

<p class="l-text">Practically every $\\log$-equation in a high-school exam reduces to one of three shapes. Recognising the shape tells you immediately which algebraic move to apply.</p>

<div class="l-highlight">
<strong>TYPE 1 — single log, equal to a number.</strong><br>
$\\log_a f(x) = b$ &nbsp;&nbsp; with $a > 0,\\ a \\neq 1$, $b \\in \\mathbb{R}$.<br>
<em>Move:</em> rewrite in exponential form: $f(x) = a^b$.
</div>

<div class="l-highlight">
<strong>TYPE 2 — two logs of the same base, set equal.</strong><br>
$\\log_a f(x) = \\log_a g(x)$.<br>
<em>Move:</em> since $\\log_a$ is one-to-one, equate the arguments: $f(x) = g(x)$.
</div>

<div class="l-highlight">
<strong>TYPE 3 — mixed (substitution).</strong><br>
A polynomial in $\\log x$ such as $\\log^2 x - 5 \\log x + 6 = 0$, or a combination like $\\log_a(f) + \\log_a(g) = c$ that compresses to Type 1 via the product law.<br>
<em>Move:</em> apply the log laws first (Lesson 36), then substitute $t = \\log x$ or rewrite in exponential form.
</div>

<p class="l-text"><strong>The hidden fourth step.</strong> For every type, after you have a candidate root, you must check it against the domain conditions — every $\\log_a (\\text{expression})$ requires <em>that expression to be strictly positive</em>. Skip this check and you will collect fake solutions.</p>

<div class="l-note"><strong>Domain reminder.</strong> $\\log_a y$ is defined only when $y > 0$ (and the base satisfies $a > 0$, $a \\neq 1$). Equal to $0$ is not allowed: $\\log_a 0$ is undefined. Negative arguments are not allowed: $\\log_a (-3)$ is undefined in the real numbers.</div>

<!-- ============================================================
     SECTION 2: Domain Check — the most important step
     ============================================================ -->
<h2 class="l-title">2. The Domain Check Is Mandatory</h2>

<p class="l-text">Before solving any logarithmic equation, write down <strong>every condition under which the original equation makes sense</strong>. Each $\\log_a (\\text{stuff})$ in the original problem contributes a condition $\\text{stuff} > 0$. There may also be conditions coming from the base (if the base itself depends on $x$).</p>

<div class="l-highlight"><strong>RECIPE</strong>
<ol style="margin-top:0.5rem;padding-left:1.2rem">
<li>List the domain conditions: every $\\log$ argument $> 0$.</li>
<li>Solve the algebraic equation, ignoring domain temporarily.</li>
<li>For each candidate root, plug back into the conditions in step (1).</li>
<li>Keep only the roots that satisfy <em>all</em> conditions; discard the rest as fake.</li>
</ol>
</div>

<p class="l-text"><strong>Mini-example.</strong> Solve $\\log_2 (x - 3) = 0$.</p>

<ul class="l-list">
<li><strong>Domain:</strong> $x - 3 > 0$, i.e. $x > 3$.</li>
<li><strong>Solve:</strong> $\\log_2 (x - 3) = 0 \\Rightarrow x - 3 = 2^0 = 1 \\Rightarrow x = 4$.</li>
<li><strong>Check:</strong> $4 > 3$ — passes. So $x = 4$ is the solution.</li>
</ul>

<p class="l-text"><strong>Mini-example where the check matters.</strong> Solve $\\log_2 (x^2 - 4) = \\log_2 (x + 2)$.</p>

<ul class="l-list">
<li><strong>Domain:</strong> $x^2 - 4 > 0$ <em>and</em> $x + 2 > 0$. The first gives $x < -2$ or $x > 2$; the second gives $x > -2$. Intersection: $x > 2$.</li>
<li><strong>Solve:</strong> equate arguments. $x^2 - 4 = x + 2 \\Rightarrow x^2 - x - 6 = 0 \\Rightarrow (x - 3)(x + 2) = 0$. Candidates: $x = 3$ or $x = -2$.</li>
<li><strong>Check:</strong> $x = 3$ satisfies $x > 2$ — keep. $x = -2$ violates $x > 2$ — discard.</li>
<li><strong>Answer:</strong> $x = 3$ only.</li>
</ul>

<div class="l-note"><strong>Why $x = -2$ would feel "right" without the check.</strong> If you naively plug $x = -2$ into the original, both sides become $\\log_2 0$, which is <em>undefined</em>. The polynomial $(x - 3)(x + 2) = 0$ does not know about the logarithm's domain — it produces both roots, but the original equation only allows one.</div>

<!-- ============================================================
     SECTION 3: Type 1 — Single Log Equal to a Number
     ============================================================ -->
<h2 class="l-title">3. Type 1: $\\log_a f(x) = b$</h2>

<p class="l-text">Rewrite directly in exponential form:</p>

$$\\log_a f(x) = b \\iff f(x) = a^b.$$

<p class="l-text">Then solve the resulting equation $f(x) = a^b$ as an ordinary algebra problem. Don't forget the domain.</p>

<div class="l-highlight"><strong>EXAMPLE 3.1.</strong> Solve $\\log_3 (2x + 1) = 2$.<br><br>
<em>Domain:</em> $2x + 1 > 0 \\Rightarrow x > -\\frac{1}{2}$.<br>
<em>Convert:</em> $2x + 1 = 3^2 = 9 \\Rightarrow x = 4$.<br>
<em>Check:</em> $4 > -\\frac{1}{2}$ — passes. <strong>Answer: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 3.2.</strong> Solve $\\log_{1/2}(x - 1) = -3$.<br><br>
<em>Domain:</em> $x - 1 > 0 \\Rightarrow x > 1$.<br>
<em>Convert:</em> $x - 1 = (1/2)^{-3} = 2^3 = 8 \\Rightarrow x = 9$.<br>
<em>Check:</em> $9 > 1$ — passes. <strong>Answer: $x = 9$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 3.3 (negative $b$).</strong> Solve $\\log_{10} x = -2$.<br><br>
<em>Domain:</em> $x > 0$.<br>
<em>Convert:</em> $x = 10^{-2} = \\frac{1}{100}$.<br>
<em>Check:</em> $\\frac{1}{100} > 0$ — passes. <strong>Answer: $x = \\frac{1}{100}$.</strong>
</div>

<!-- Plotly: log_10 x = 2 intersection -->
<div id="plot-l38-eq-en" class="plotly-graph" style="height:360px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[];
  for(var i=1;i<=400;i++){ var x=i/2; xs.push(x); ys.push(Math.log(x)/Math.LN10); }
  var t1={x:xs, y:ys, mode:"lines", name:"y = log₁₀ x", line:{color:"#c8a96e",width:2.6}};
  var t2={x:[0,200], y:[2,2], mode:"lines", name:"y = 2", line:{color:"#06b6d4",width:2,dash:"dash"}};
  var t3={x:[100], y:[2], mode:"markers", name:"intersection (100, 2)", marker:{size:11,color:"#f87171",line:{color:"#fff",width:1.5}}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[0,200],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},yaxis:{title:"y",range:[-1,3],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.2}};
  Plotly.newPlot("plot-l38-eq-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Graphical view of $\\log_{10} x = 2$: the curve $y = \\log_{10} x$ meets the horizontal line $y = 2$ at $x = 100$, exactly where $10^2 = 100$.</p>

<!-- ============================================================
     SECTION 4: Type 2 — log = log, same base
     ============================================================ -->
<h2 class="l-title">4. Type 2: $\\log_a f(x) = \\log_a g(x)$</h2>

<p class="l-text">Because the logarithm function is strictly monotone (and therefore <em>one-to-one</em>) on its domain, equal outputs force equal inputs:</p>

$$\\log_a f(x) = \\log_a g(x) \\iff f(x) = g(x) \\quad \\text{(with both } f(x) > 0,\\ g(x) > 0\\text{)}.$$

<p class="l-text">The "iff" is only valid when <em>both</em> sides are in the domain. So you must record the conditions and discard any candidate root that violates them.</p>

<div class="l-highlight"><strong>EXAMPLE 4.1.</strong> Solve $\\log_3 (x + 4) = \\log_3 (2x - 1)$.<br><br>
<em>Domain:</em> $x + 4 > 0 \\Rightarrow x > -4$ <em>and</em> $2x - 1 > 0 \\Rightarrow x > \\frac{1}{2}$. Combined: $x > \\frac{1}{2}$.<br>
<em>Equate:</em> $x + 4 = 2x - 1 \\Rightarrow x = 5$.<br>
<em>Check:</em> $5 > \\frac{1}{2}$ — passes. <strong>Answer: $x = 5$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 4.2 (one log per side after compression).</strong> Solve $\\log_2 (x) + \\log_2 (x - 2) = 3$.<br><br>
<em>Domain:</em> $x > 0$ <em>and</em> $x - 2 > 0 \\Rightarrow x > 2$.<br>
<em>Compress (product law):</em> $\\log_2 [x(x - 2)] = 3 \\Rightarrow x(x - 2) = 2^3 = 8$.<br>
$x^2 - 2x - 8 = 0 \\Rightarrow (x - 4)(x + 2) = 0 \\Rightarrow x = 4$ or $x = -2$.<br>
<em>Check:</em> $x = 4 > 2$ — keep. $x = -2$ fails $x > 2$ — discard. <strong>Answer: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 4.3 (compress with the quotient law).</strong> Solve $\\log_5 (x + 6) - \\log_5 (x - 2) = 1$.<br><br>
<em>Domain:</em> $x > -6$ and $x > 2 \\Rightarrow x > 2$.<br>
<em>Compress:</em> $\\log_5 \\!\\left( \\dfrac{x + 6}{x - 2} \\right) = 1 \\Rightarrow \\dfrac{x + 6}{x - 2} = 5$.<br>
$x + 6 = 5(x - 2) = 5x - 10 \\Rightarrow 4x = 16 \\Rightarrow x = 4$.<br>
<em>Check:</em> $4 > 2$ — passes. <strong>Answer: $x = 4$.</strong>
</div>

<!-- ============================================================
     SECTION 5: Quadratic-in-log Substitution
     ============================================================ -->
<h2 class="l-title">5. Quadratic-in-$\\log$: the Substitution $t = \\log x$</h2>

<p class="l-text">When the equation contains $\\log^2 x$, $\\log x$, and constants — but no $x$ outside a logarithm — substitute $t = \\log_a x$. The equation becomes an ordinary polynomial in $t$ that you already know how to solve.</p>

<div class="l-highlight"><strong>EXAMPLE 5.1.</strong> Solve $\\log_{10}^2 x - 5 \\log_{10} x + 6 = 0$.<br><br>
<em>Domain:</em> $x > 0$.<br>
<em>Substitute:</em> let $t = \\log_{10} x$. Then $t^2 - 5t + 6 = 0 \\Rightarrow (t - 2)(t - 3) = 0$.<br>
$t = 2 \\Rightarrow \\log_{10} x = 2 \\Rightarrow x = 100$.<br>
$t = 3 \\Rightarrow \\log_{10} x = 3 \\Rightarrow x = 1000$.<br>
<em>Check:</em> both positive — keep both. <strong>Answer: $x \\in \\{100,\\ 1000\\}$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 5.2.</strong> Solve $\\log_2^2 x - \\log_2 x - 2 = 0$.<br><br>
<em>Domain:</em> $x > 0$. Let $t = \\log_2 x$.<br>
$t^2 - t - 2 = 0 \\Rightarrow (t - 2)(t + 1) = 0 \\Rightarrow t = 2$ or $t = -1$.<br>
$t = 2 \\Rightarrow x = 2^2 = 4$. &nbsp;&nbsp; $t = -1 \\Rightarrow x = 2^{-1} = \\tfrac{1}{2}$.<br>
<strong>Answer: $x \\in \\{4,\\ \\tfrac{1}{2}\\}$.</strong>
</div>

<div class="l-note"><strong>Notation warning.</strong> "$\\log^2 x$" means $(\\log x)^2$, <em>not</em> $\\log(\\log x)$. Different textbooks may write it as $\\log^2 x$ or $(\\log x)^2$; both mean the same thing.</div>

<!-- ============================================================
     SECTION 6: Fake-Root Traps
     ============================================================ -->
<h2 class="l-title">6. Fake-Root Traps (Yabancı Kök)</h2>

<p class="l-text">A <strong>fake root</strong> (also called <em>extraneous</em>) is a number that solves the algebraic equation you derived, but does <em>not</em> satisfy the original logarithmic problem because some $\\log$ argument becomes $\\le 0$ at that value. They appear naturally because the step "$\\log_a u = \\log_a v \\Rightarrow u = v$" loses domain information.</p>

<div class="l-highlight"><strong>EXAMPLE 6.1 (squaring an argument introduces a fake root).</strong><br>
Solve $\\log_2 (x - 1) + \\log_2 (x + 1) = 3$.<br><br>
<em>Domain:</em> $x - 1 > 0$ <em>and</em> $x + 1 > 0 \\Rightarrow x > 1$.<br>
<em>Compress:</em> $\\log_2 (x^2 - 1) = 3 \\Rightarrow x^2 - 1 = 8 \\Rightarrow x^2 = 9 \\Rightarrow x = \\pm 3$.<br>
<em>Check:</em> $x = 3 > 1$ — keep. $x = -3$ fails $x > 1$ — discard (it makes both $\\log_2(-4)$ and $\\log_2(-2)$ undefined).<br>
<strong>Answer: $x = 3$ only.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 6.2.</strong> Solve $\\log_3 (x^2 - 3x) = \\log_3 (2x - 4)$.<br><br>
<em>Domain:</em> $x^2 - 3x > 0$ — factor $x(x - 3) > 0$, so $x < 0$ or $x > 3$. And $2x - 4 > 0 \\Rightarrow x > 2$. Combined: $x > 3$.<br>
<em>Equate:</em> $x^2 - 3x = 2x - 4 \\Rightarrow x^2 - 5x + 4 = 0 \\Rightarrow (x - 1)(x - 4) = 0 \\Rightarrow x = 1$ or $x = 4$.<br>
<em>Check:</em> $x = 4 > 3$ — keep. $x = 1$ fails $x > 3$ — discard.<br>
<strong>Answer: $x = 4$.</strong>
</div>

<div class="l-note"><strong>Rule of thumb.</strong> Whenever you raise both sides to remove the logarithms (or compress a sum/difference of logs into one $\\log$), you may pick up extra roots. <em>Always</em> verify against the original-equation domain.</div>

<!-- ============================================================
     SECTION 7: Logarithmic Inequalities
     ============================================================ -->
<h2 class="l-title">7. Logarithmic Inequalities</h2>

<p class="l-text">The key fact: the logarithm $\\log_a y$ as a function of $y$ is</p>

<ul class="l-list">
<li><strong>strictly increasing</strong> when $a > 1$, so it <em>preserves</em> the direction of an inequality;</li>
<li><strong>strictly decreasing</strong> when $0 < a < 1$, so it <em>reverses</em> the direction of an inequality.</li>
</ul>

<div class="l-highlight" style="text-align:center"><strong>BASE BIGGER OR SMALLER THAN 1 — the direction rule</strong><br><br>
$a > 1$: &nbsp; $\\log_a f(x) > \\log_a g(x) \\iff f(x) > g(x)$ (and both $> 0$).<br>
$0 < a < 1$: &nbsp; $\\log_a f(x) > \\log_a g(x) \\iff f(x) < g(x)$ (and both $> 0$).
</div>

<p class="l-text">The same direction rule applies to inequalities of the form $\\log_a f(x) > b$: rewrite as $f(x) > a^b$ (when $a > 1$) or $f(x) < a^b$ (when $0 < a < 1$). Always combine the result with the domain $f(x) > 0$.</p>

<div class="l-highlight"><strong>EXAMPLE 7.1 (base $> 1$, preserves direction).</strong> Solve $\\log_2 x \\ge 1$.<br><br>
<em>Domain:</em> $x > 0$.<br>
<em>Convert:</em> $x \\ge 2^1 = 2$.<br>
<em>Combine with domain:</em> $x \\ge 2$.<br>
<strong>Answer: $x \\in [2,\\ \\infty)$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 7.2 (base $< 1$, reverses direction).</strong> Solve $\\log_{1/3} x \\ge 1$.<br><br>
<em>Domain:</em> $x > 0$.<br>
<em>Convert (base $< 1$, flip):</em> $x \\le (1/3)^1 = \\tfrac{1}{3}$.<br>
<em>Combine with domain:</em> $0 < x \\le \\tfrac{1}{3}$.<br>
<strong>Answer: $x \\in (0,\\ \\tfrac{1}{3}]$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 7.3 (log vs log, base $> 1$).</strong> Solve $\\log_5 (x + 1) > \\log_5 (2x - 3)$.<br><br>
<em>Domain:</em> $x + 1 > 0$ and $2x - 3 > 0 \\Rightarrow x > \\tfrac{3}{2}$.<br>
<em>Preserve direction:</em> $x + 1 > 2x - 3 \\Rightarrow 4 > x$.<br>
<em>Combine:</em> $\\tfrac{3}{2} < x < 4$.<br>
<strong>Answer: $x \\in (\\tfrac{3}{2},\\ 4)$.</strong>
</div>

<!-- Plotly: log_2 x >= 1 shaded region -->
<div id="plot-l38-ineq-en" class="plotly-graph" style="height:360px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[];
  for(var i=1;i<=400;i++){ var x=i/25; xs.push(x); ys.push(Math.log(x)/Math.LN2); }
  var t1={x:xs, y:ys, mode:"lines", name:"y = log₂ x", line:{color:"#c8a96e",width:2.6}};
  var t2={x:[0,16], y:[1,1], mode:"lines", name:"y = 1", line:{color:"#06b6d4",width:2,dash:"dash"}};
  // Shade region x >= 2 (solution) under the curve up to y=1 line
  var sx=[], sy=[];
  for(var j=0;j<=200;j++){ var xx=2+(14)*j/200; sx.push(xx); sy.push(Math.log(xx)/Math.LN2); }
  var t3={x:[2].concat(sx).concat([16,2]), y:[1].concat(sy).concat([Math.log(16)/Math.LN2,1]), fill:"toself", mode:"lines", line:{color:"rgba(34,197,94,0.0)"}, fillcolor:"rgba(34,197,94,0.22)", name:"solution: x ≥ 2", hoverinfo:"skip"};
  var t4={x:[2], y:[1], mode:"markers+text", text:["x = 2"], textposition:"top right", textfont:{color:"#f87171"}, marker:{size:10,color:"#f87171",line:{color:"#fff",width:1.5}}, showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[0,16],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},yaxis:{title:"y",range:[-1.5,4.5],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.2}};
  Plotly.newPlot("plot-l38-ineq-en",[t3,t1,t2,t4],layout,{responsive:true,displayModeBar:false});
},200)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$\\log_2 x \\ge 1$: the green region is where the curve sits on or above the line $y = 1$. Solution set: $x \\ge 2$.</p>

<!-- ============================================================
     SECTION 8: Worked Examples (Mixed Bag)
     ============================================================ -->
<h2 class="l-title">8. Worked Examples — Equations and Inequalities</h2>

<div class="l-highlight"><strong>EXAMPLE 8.1.</strong> Solve $\\log_4 (x + 12) = 2$.<br><br>
Domain: $x + 12 > 0 \\Rightarrow x > -12$. Convert: $x + 12 = 4^2 = 16 \\Rightarrow x = 4$. Check: $4 > -12$. <strong>Answer: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 8.2.</strong> Solve $\\log_2 (x + 3) + \\log_2 (x - 1) = 5$.<br><br>
Domain: $x > -3$ and $x > 1 \\Rightarrow x > 1$. Compress: $\\log_2 [(x + 3)(x - 1)] = 5 \\Rightarrow (x + 3)(x - 1) = 32$.<br>
$x^2 + 2x - 3 = 32 \\Rightarrow x^2 + 2x - 35 = 0 \\Rightarrow (x - 5)(x + 7) = 0 \\Rightarrow x = 5$ or $x = -7$.<br>
Check: $5 > 1$ keep; $-7 < 1$ discard. <strong>Answer: $x = 5$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 8.3.</strong> Solve $\\log_3^2 x - 4 \\log_3 x + 3 = 0$.<br><br>
Domain: $x > 0$. Let $t = \\log_3 x$: $t^2 - 4t + 3 = 0 \\Rightarrow (t - 1)(t - 3) = 0$.<br>
$t = 1 \\Rightarrow x = 3$. $t = 3 \\Rightarrow x = 27$. Both positive. <strong>Answer: $x \\in \\{3,\\ 27\\}$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 8.4.</strong> Solve $\\log_5 (3x - 2) = \\log_5 (x + 6)$.<br><br>
Domain: $3x - 2 > 0 \\Rightarrow x > \\tfrac{2}{3}$; and $x + 6 > 0 \\Rightarrow x > -6$. Combined: $x > \\tfrac{2}{3}$.<br>
Equate: $3x - 2 = x + 6 \\Rightarrow 2x = 8 \\Rightarrow x = 4$. Check passes. <strong>Answer: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 8.5 (inequality, base $> 1$).</strong> Solve $\\log_3 (2x - 1) < 2$.<br><br>
Domain: $2x - 1 > 0 \\Rightarrow x > \\tfrac{1}{2}$. Convert: $2x - 1 < 3^2 = 9 \\Rightarrow x < 5$.<br>
Combine: $\\tfrac{1}{2} < x < 5$. <strong>Answer: $x \\in (\\tfrac{1}{2},\\ 5)$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 8.6 (inequality, base $< 1$).</strong> Solve $\\log_{1/2} (x + 1) > -2$.<br><br>
Domain: $x + 1 > 0 \\Rightarrow x > -1$. Convert (base $< 1$, flip direction): $x + 1 < (1/2)^{-2} = 4 \\Rightarrow x < 3$.<br>
Combine: $-1 < x < 3$. <strong>Answer: $x \\in (-1,\\ 3)$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 8.7 (quadratic-in-log inequality).</strong> Solve $\\log_2^2 x - 3 \\log_2 x + 2 \\le 0$.<br><br>
Domain: $x > 0$. Let $t = \\log_2 x$: $t^2 - 3t + 2 \\le 0 \\Rightarrow (t - 1)(t - 2) \\le 0 \\Rightarrow 1 \\le t \\le 2$.<br>
Convert back: $1 \\le \\log_2 x \\le 2 \\Rightarrow 2^1 \\le x \\le 2^2 \\Rightarrow 2 \\le x \\le 4$.<br>
<strong>Answer: $x \\in [2,\\ 4]$.</strong>
</div>

<!-- ============================================================
     SECTION 9: Mixed Exponential + Logarithmic
     ============================================================ -->
<h2 class="l-title">9. Mixed Exponential + Logarithmic Equations</h2>

<p class="l-text">Sometimes the unknown appears both in the base and in the exponent. The standard trick is to take $\\log$ of both sides. The base of the $\\log$ does not matter — pick a base that simplifies the algebra.</p>

<div class="l-highlight"><strong>EXAMPLE 9.1.</strong> Solve $x^{\\log_{10} x} = 100\\, x$ &nbsp;(with $x > 0$, $x \\neq 1$).<br><br>
Take $\\log_{10}$ of both sides. The left becomes $\\log_{10}(x^{\\log_{10} x}) = (\\log_{10} x)^2$. The right becomes $\\log_{10}(100 x) = \\log_{10} 100 + \\log_{10} x = 2 + \\log_{10} x$.<br>
So $(\\log_{10} x)^2 = 2 + \\log_{10} x$. Let $t = \\log_{10} x$: $t^2 - t - 2 = 0 \\Rightarrow (t - 2)(t + 1) = 0$.<br>
$t = 2 \\Rightarrow x = 100$. $t = -1 \\Rightarrow x = \\tfrac{1}{10}$. Both satisfy $x > 0$ and $x \\neq 1$. <strong>Answer: $x \\in \\{100,\\ \\tfrac{1}{10}\\}$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 9.2.</strong> Solve $2^x \\cdot 5^x = 100$.<br><br>
Combine: $(2 \\cdot 5)^x = 10^x = 100 = 10^2 \\Rightarrow x = 2$. <strong>Answer: $x = 2$.</strong> (Solving via logs gives the same answer; no domain conditions on $x$.)
</div>

<div class="l-highlight"><strong>EXAMPLE 9.3.</strong> Solve $5^{x-1} = 7$.<br><br>
Take $\\log_{10}$: $(x - 1) \\log_{10} 5 = \\log_{10} 7 \\Rightarrow x = 1 + \\dfrac{\\log_{10} 7}{\\log_{10} 5}$.<br>
Numerically: $\\log_{10} 7 \\approx 0.8451$, $\\log_{10} 5 \\approx 0.6990$, so $x \\approx 1 + 1.209 = 2.209$.<br>
<strong>Answer: $x = 1 + \\dfrac{\\ln 7}{\\ln 5} \\approx 2.209$.</strong>
</div>

<div class="l-highlight"><strong>EXAMPLE 9.4 (change of variable for $\\log_x$).</strong> Solve $\\log_x 4 = 2$ &nbsp;(with $x > 0$, $x \\neq 1$).<br><br>
Convert: $x^2 = 4 \\Rightarrow x = \\pm 2$. Domain forces $x > 0$, so $x = 2$. (Check $x \\neq 1$: passes.) <strong>Answer: $x = 2$.</strong>
</div>

<!-- ============================================================
     SECTION 10: Classroom Exercises
     ============================================================ -->
<h2 class="l-title">10. Classroom Exercises</h2>

<p class="l-text">Work each one with the recipe: <strong>(i)</strong> domain conditions, <strong>(ii)</strong> algebraic solve, <strong>(iii)</strong> filter candidates, <strong>(iv)</strong> state the final answer.</p>

<ol class="l-list">
<li>Solve $\\log_2 (3x - 1) = 4$.</li>
<li>Solve $\\log_5 (x^2 - 4x) = \\log_5 (3x - 10)$.</li>
<li>Solve $\\log_{10} x + \\log_{10} (x - 3) = 1$.</li>
<li>Solve $\\log_2^2 x - 6 \\log_2 x + 8 = 0$.</li>
<li>Solve $\\log_3 (x + 2) - \\log_3 (x - 4) = 1$.</li>
<li>Solve $\\log_{1/2} (x - 1) \\ge -2$.</li>
<li>Solve $\\log_4 (2x + 3) < \\log_4 (x + 9)$.</li>
<li>Solve $x^{\\log_3 x} = 27 \\, x^2$ &nbsp;($x > 0$, $x \\neq 1$).</li>
</ol>

<h3 style="color:#c8a96e;margin-top:1.6rem">Answer key (sketch)</h3>

<p class="l-text"><strong>1.</strong> Domain $x > \\tfrac{1}{3}$. Convert: $3x - 1 = 2^4 = 16 \\Rightarrow x = \\tfrac{17}{3}$. Passes. <strong>$x = \\tfrac{17}{3}$.</strong></p>

<p class="l-text"><strong>2.</strong> Domain: $x^2 - 4x > 0$ gives $x < 0$ or $x > 4$; $3x - 10 > 0$ gives $x > \\tfrac{10}{3}$. Combined: $x > 4$. Equate: $x^2 - 4x = 3x - 10 \\Rightarrow x^2 - 7x + 10 = 0 \\Rightarrow (x - 2)(x - 5) = 0 \\Rightarrow x = 2$ or $5$. Only $x = 5$ passes. <strong>$x = 5$.</strong></p>

<p class="l-text"><strong>3.</strong> Domain $x > 3$. Compress: $\\log_{10}[x(x - 3)] = 1 \\Rightarrow x(x - 3) = 10 \\Rightarrow x^2 - 3x - 10 = 0 \\Rightarrow (x - 5)(x + 2) = 0$. Only $x = 5$ passes. <strong>$x = 5$.</strong></p>

<p class="l-text"><strong>4.</strong> Let $t = \\log_2 x$: $t^2 - 6t + 8 = 0 \\Rightarrow (t - 2)(t - 4) = 0$. So $x = 2^2 = 4$ or $x = 2^4 = 16$. <strong>$x \\in \\{4,\\ 16\\}$.</strong></p>

<p class="l-text"><strong>5.</strong> Domain $x > 4$. Compress: $\\log_3 \\!\\left( \\dfrac{x + 2}{x - 4} \\right) = 1 \\Rightarrow \\dfrac{x + 2}{x - 4} = 3$. $x + 2 = 3x - 12 \\Rightarrow 2x = 14 \\Rightarrow x = 7$. Passes. <strong>$x = 7$.</strong></p>

<p class="l-text"><strong>6.</strong> Domain $x > 1$. Base $< 1$, flip: $x - 1 \\le (1/2)^{-2} = 4 \\Rightarrow x \\le 5$. Combined: $1 < x \\le 5$. <strong>$x \\in (1,\\ 5]$.</strong></p>

<p class="l-text"><strong>7.</strong> Domain: $2x + 3 > 0 \\Rightarrow x > -\\tfrac{3}{2}$; and $x + 9 > 0 \\Rightarrow x > -9$. Combined: $x > -\\tfrac{3}{2}$. Base $> 1$, preserve: $2x + 3 < x + 9 \\Rightarrow x < 6$. Combined: $-\\tfrac{3}{2} < x < 6$. <strong>$x \\in (-\\tfrac{3}{2},\\ 6)$.</strong></p>

<p class="l-text"><strong>8.</strong> Take $\\log_3$ of both sides: $(\\log_3 x)^2 = 3 + 2 \\log_3 x$. Let $t = \\log_3 x$: $t^2 - 2t - 3 = 0 \\Rightarrow (t - 3)(t + 1) = 0$. $t = 3 \\Rightarrow x = 27$; $t = -1 \\Rightarrow x = \\tfrac{1}{3}$. Both $> 0$ and $\\neq 1$. <strong>$x \\in \\{27,\\ \\tfrac{1}{3}\\}$.</strong></p>

<div class="l-highlight"><strong>Wrap-up.</strong> Logarithmic equations and inequalities are short on algebra but long on care. The single most important habit is to <em>write down the domain first</em>, do the algebra, and then <em>filter</em> the candidates against the domain. For inequalities, remember the base-direction rule — $a > 1$ preserves, $0 < a < 1$ flips — and you will rarely make a sign mistake again.</div>

<p class="l-text">In the next lesson we will look at <strong>applications</strong>: how exponential and logarithmic models describe radioactive decay, population growth, sound (the decibel scale), earthquakes (Richter), and the pH of chemistry — all using exactly the techniques you have just practised.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `
<p class="l-text"><strong>Logaritmik denklem ve eşitsizlikler, üstel denklemlerin doğal karşılığıdır.</strong> Üstel denklemde bilinmeyen üs içine saklanır; logaritmik denklemde ise logaritmanın argümanına saklanır. Çözüm hemen her zaman bu ikisi arasında dönüşüm gerektirir — ya $\\log_a f(x) = b$ ifadesini $f(x) = a^b$ olarak yeniden yazarız, ya da birden çok $\\log$ terimini tek bir $\\log$ altında topladıktan sonra argümanları eşitleriz. Cebir kısa. Sık yapılan hata cebirde değil, <em>tanım kümesinde</em>: her $\\log$, argümanının kesin pozitif olmasını gerektirir; cebirsel adımdan çıkan ama tanım kümesini ihlal eden bir değer <strong>yabancı (sahte) kök</strong>tür ve atılmak zorundadır.</p>

<p class="l-text">Bu derste logaritmik denklemlerin üç ailesini sırayla işleyeceğiz; $\\log^2 x$ içeren denklemleri sıradan ikinci derecelere indirgeyen değişken değiştirme hilesini kuracağız; eşitsizlik versiyonlarına bakacağız (taban $1$'den büyük ya da küçük olmasına göre eşitsizliğin yönü değişir); en sonda da karışık üstel-logaritmik problemler ve uzun bir alıştırma listesi var.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Logaritmik denklemin üç temel tipini tanı ve her birine uygun hamleyi seç</li>
<li>Probleme giren her logaritma için <strong>tanım kümesi koşullarını</strong> yaz, yabancı kökleri ele</li>
<li>$\\log_a f(x) = b$ denklemini üstel forma $f(x) = a^b$ çevirip sade biçimde çöz</li>
<li>$\\log_a f(x) = \\log_a g(x)$ denklemini $f(x) = g(x)$'e sıkıştır ve iki tarafı tanım kümesine karşı sına</li>
<li>$t = \\log x$ değişken değiştirmesiyle $\\log^2 x - 5 \\log x + 6 = 0$ tipi denklemleri ikinci dereceye indir</li>
<li>Logaritmik eşitsizlikleri çöz; taban $0 < a < 1$ ise eşitsizliğin yönünü çevir</li>
<li>Üstel ve logaritmik adımları aynı problemde birleştir (örn. $x^{\\log x} = 100x$)</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1: Logaritmik Denklem Türleri
     ============================================================ -->
<h2 class="l-title">1. Logaritmik Denklem Türleri</h2>

<p class="l-text">Lise sınavlarında karşına çıkan hemen hemen her $\\log$ denklemi şu üç biçimden birine indirgenir. Hangi biçimde olduğunu görebilmek, hangi cebirsel hamleyi yapacağını anında söyler.</p>

<div class="l-highlight">
<strong>TİP 1 — tek log, bir sayıya eşit.</strong><br>
$\\log_a f(x) = b$ &nbsp;&nbsp; ($a > 0,\\ a \\neq 1$, $b \\in \\mathbb{R}$).<br>
<em>Hamle:</em> üstel forma çevir: $f(x) = a^b$.
</div>

<div class="l-highlight">
<strong>TİP 2 — aynı tabanda iki log, eşit.</strong><br>
$\\log_a f(x) = \\log_a g(x)$.<br>
<em>Hamle:</em> $\\log_a$ birebir olduğundan argümanları eşitle: $f(x) = g(x)$.
</div>

<div class="l-highlight">
<strong>TİP 3 — karışık (değişken değiştirme).</strong><br>
$\\log x$'in polinomu, örneğin $\\log^2 x - 5 \\log x + 6 = 0$; veya logaritma kurallarıyla Tip 1'e indirgenecek $\\log_a(f) + \\log_a(g) = c$ gibi kombinasyonlar.<br>
<em>Hamle:</em> önce log kurallarını uygula (Ders 36), sonra $t = \\log x$ koy veya üstel forma çevir.
</div>

<p class="l-text"><strong>Gizli dördüncü adım.</strong> Her tipte, aday kök bulduktan sonra onu tanım kümesi koşullarına karşı kontrol etmek <em>zorundasın</em>. Her $\\log_a (\\text{ifade})$, ifadenin <em>kesin pozitif</em> olmasını gerektirir. Bu kontrolü atlarsan yabancı kökler toplamış olursun.</p>

<div class="l-note"><strong>Tanım kümesi hatırlatması.</strong> $\\log_a y$, ancak $y > 0$ iken (ve $a > 0$, $a \\neq 1$ iken) tanımlıdır. Sıfır da olmaz: $\\log_a 0$ tanımsızdır. Negatif argüman da olmaz: $\\log_a (-3)$ reel sayılarda tanımsızdır.</div>

<!-- ============================================================
     BÖLÜM 2: Tanım Kümesi Kontrolü ŞART
     ============================================================ -->
<h2 class="l-title">2. Tanım Kümesi Kontrolü Şart!</h2>

<p class="l-text">Logaritmik denklemi çözmeye geçmeden önce, <strong>orijinal denklemin anlamlı olabilmesi için gereken her koşulu yaz</strong>. Problemdeki her $\\log_a (\\text{şey})$ ifadesi, $\\text{şey} > 0$ koşulunu getirir. Taban $x$'e bağlıysa, tabandan da ek koşullar çıkabilir.</p>

<div class="l-highlight"><strong>REÇETE</strong>
<ol style="margin-top:0.5rem;padding-left:1.2rem">
<li>Tanım kümesi koşullarını listele: her $\\log$ argümanı $> 0$.</li>
<li>Cebirsel denklemi çöz; tanım kümesini geçici olarak unut.</li>
<li>Her aday kökü tekrar (1)'deki koşullara koy.</li>
<li>Sadece <em>tüm</em> koşulları sağlayan kökleri tut; ötekilerini yabancı kök olarak at.</li>
</ol>
</div>

<p class="l-text"><strong>Mini örnek.</strong> $\\log_2 (x - 3) = 0$.</p>

<ul class="l-list">
<li><strong>Tanım kümesi:</strong> $x - 3 > 0$, yani $x > 3$.</li>
<li><strong>Çöz:</strong> $\\log_2 (x - 3) = 0 \\Rightarrow x - 3 = 2^0 = 1 \\Rightarrow x = 4$.</li>
<li><strong>Kontrol:</strong> $4 > 3$ — geçer. Çözüm: $x = 4$.</li>
</ul>

<p class="l-text"><strong>Kontrol gerçekten önemli olan mini örnek.</strong> $\\log_2 (x^2 - 4) = \\log_2 (x + 2)$.</p>

<ul class="l-list">
<li><strong>Tanım kümesi:</strong> $x^2 - 4 > 0$ <em>ve</em> $x + 2 > 0$. Birincisi $x < -2$ veya $x > 2$; ikincisi $x > -2$. Kesişim: $x > 2$.</li>
<li><strong>Çöz:</strong> argümanları eşitle. $x^2 - 4 = x + 2 \\Rightarrow x^2 - x - 6 = 0 \\Rightarrow (x - 3)(x + 2) = 0$. Adaylar: $x = 3$ veya $x = -2$.</li>
<li><strong>Kontrol:</strong> $x = 3$, $x > 2$ koşulunu sağlar — tut. $x = -2$, $x > 2$ koşulunu sağlamaz — at.</li>
<li><strong>Cevap:</strong> sadece $x = 3$.</li>
</ul>

<div class="l-note"><strong>$x = -2$ neden cazip görünür?</strong> $x = -2$'yi orijinale safça yerine koyarsan her iki taraf da $\\log_2 0$ olur — <em>tanımsız</em>. Polinom $(x - 3)(x + 2) = 0$ logaritmanın tanım kümesini bilmez; iki kökü de verir, ama orijinal denklem sadece birini kabul eder.</div>

<!-- ============================================================
     BÖLÜM 3: Tip 1 — Tek Log = Sayı
     ============================================================ -->
<h2 class="l-title">3. Tip 1: $\\log_a f(x) = b$</h2>

<p class="l-text">Doğrudan üstel forma çevir:</p>

$$\\log_a f(x) = b \\iff f(x) = a^b.$$

<p class="l-text">Sonra elde edilen $f(x) = a^b$ denklemini sıradan bir cebir problemi gibi çöz. Tanım kümesini sakın unutma.</p>

<div class="l-highlight"><strong>ÖRNEK 3.1.</strong> $\\log_3 (2x + 1) = 2$ denklemini çöz.<br><br>
<em>Tanım kümesi:</em> $2x + 1 > 0 \\Rightarrow x > -\\frac{1}{2}$.<br>
<em>Çevir:</em> $2x + 1 = 3^2 = 9 \\Rightarrow x = 4$.<br>
<em>Kontrol:</em> $4 > -\\frac{1}{2}$ — geçer. <strong>Cevap: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 3.2.</strong> $\\log_{1/2}(x - 1) = -3$.<br><br>
<em>Tanım kümesi:</em> $x - 1 > 0 \\Rightarrow x > 1$.<br>
<em>Çevir:</em> $x - 1 = (1/2)^{-3} = 2^3 = 8 \\Rightarrow x = 9$.<br>
<em>Kontrol:</em> $9 > 1$ — geçer. <strong>Cevap: $x = 9$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 3.3 (negatif $b$).</strong> $\\log_{10} x = -2$.<br><br>
<em>Tanım kümesi:</em> $x > 0$.<br>
<em>Çevir:</em> $x = 10^{-2} = \\frac{1}{100}$.<br>
<em>Kontrol:</em> $\\frac{1}{100} > 0$ — geçer. <strong>Cevap: $x = \\frac{1}{100}$.</strong>
</div>

<!-- Plotly: log_10 x = 2 kesişim -->
<div id="plot-l38-eq-tr" class="plotly-graph" style="height:360px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[];
  for(var i=1;i<=400;i++){ var x=i/2; xs.push(x); ys.push(Math.log(x)/Math.LN10); }
  var t1={x:xs, y:ys, mode:"lines", name:"y = log₁₀ x", line:{color:"#c8a96e",width:2.6}};
  var t2={x:[0,200], y:[2,2], mode:"lines", name:"y = 2", line:{color:"#06b6d4",width:2,dash:"dash"}};
  var t3={x:[100], y:[2], mode:"markers", name:"kesişim (100, 2)", marker:{size:11,color:"#f87171",line:{color:"#fff",width:1.5}}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[0,200],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},yaxis:{title:"y",range:[-1,3],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.2}};
  Plotly.newPlot("plot-l38-eq-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$\\log_{10} x = 2$ denkleminin grafiksel görünümü: $y = \\log_{10} x$ eğrisi $y = 2$ yatay doğrusuyla $x = 100$'de kesişir; çünkü $10^2 = 100$.</p>

<!-- ============================================================
     BÖLÜM 4: Tip 2 — Aynı Tabanda log = log
     ============================================================ -->
<h2 class="l-title">4. Tip 2: $\\log_a f(x) = \\log_a g(x)$</h2>

<p class="l-text">Logaritma fonksiyonu tanım kümesi üzerinde kesin monoton (yani <em>birebir</em>) olduğundan, eşit çıktılar eşit girdileri zorlar:</p>

$$\\log_a f(x) = \\log_a g(x) \\iff f(x) = g(x) \\quad (\\text{her iki taraf da } > 0).$$

<p class="l-text">Bu "ancak ve ancak", sadece <em>iki taraf da</em> tanım kümesindeyken geçerlidir. Koşulları yaz, tanım kümesi ihlali yaratan adayı at.</p>

<div class="l-highlight"><strong>ÖRNEK 4.1.</strong> $\\log_3 (x + 4) = \\log_3 (2x - 1)$.<br><br>
<em>Tanım kümesi:</em> $x + 4 > 0 \\Rightarrow x > -4$ <em>ve</em> $2x - 1 > 0 \\Rightarrow x > \\frac{1}{2}$. Birleşim: $x > \\frac{1}{2}$.<br>
<em>Eşitle:</em> $x + 4 = 2x - 1 \\Rightarrow x = 5$.<br>
<em>Kontrol:</em> $5 > \\frac{1}{2}$ — geçer. <strong>Cevap: $x = 5$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 4.2 (toplamı sıkıştırarak).</strong> $\\log_2 (x) + \\log_2 (x - 2) = 3$.<br><br>
<em>Tanım kümesi:</em> $x > 0$ <em>ve</em> $x - 2 > 0 \\Rightarrow x > 2$.<br>
<em>Sıkıştır (çarpım kuralı):</em> $\\log_2 [x(x - 2)] = 3 \\Rightarrow x(x - 2) = 2^3 = 8$.<br>
$x^2 - 2x - 8 = 0 \\Rightarrow (x - 4)(x + 2) = 0 \\Rightarrow x = 4$ veya $x = -2$.<br>
<em>Kontrol:</em> $x = 4 > 2$ — tut. $x = -2$, $x > 2$ koşulunu sağlamaz — at. <strong>Cevap: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 4.3 (bölümle sıkıştır).</strong> $\\log_5 (x + 6) - \\log_5 (x - 2) = 1$.<br><br>
<em>Tanım kümesi:</em> $x > -6$ ve $x > 2 \\Rightarrow x > 2$.<br>
<em>Sıkıştır:</em> $\\log_5 \\!\\left( \\dfrac{x + 6}{x - 2} \\right) = 1 \\Rightarrow \\dfrac{x + 6}{x - 2} = 5$.<br>
$x + 6 = 5(x - 2) = 5x - 10 \\Rightarrow 4x = 16 \\Rightarrow x = 4$.<br>
<em>Kontrol:</em> $4 > 2$ — geçer. <strong>Cevap: $x = 4$.</strong>
</div>

<!-- ============================================================
     BÖLÜM 5: log'a İkinci Dereceden Denklem
     ============================================================ -->
<h2 class="l-title">5. $\\log$'a İkinci Dereceden: $t = \\log x$ Değişken Değiştirmesi</h2>

<p class="l-text">Denklem $\\log^2 x$, $\\log x$ ve sabitler içerip $x$ logaritma dışında geçmiyorsa, $t = \\log_a x$ koy. Denklem $t$ cinsinden sıradan bir polinom olur — onu zaten çözebiliyorsun.</p>

<div class="l-highlight"><strong>ÖRNEK 5.1.</strong> $\\log_{10}^2 x - 5 \\log_{10} x + 6 = 0$.<br><br>
<em>Tanım kümesi:</em> $x > 0$.<br>
<em>Değişken değiştir:</em> $t = \\log_{10} x$ olsun. $t^2 - 5t + 6 = 0 \\Rightarrow (t - 2)(t - 3) = 0$.<br>
$t = 2 \\Rightarrow \\log_{10} x = 2 \\Rightarrow x = 100$.<br>
$t = 3 \\Rightarrow \\log_{10} x = 3 \\Rightarrow x = 1000$.<br>
<em>Kontrol:</em> ikisi de pozitif — ikisini de tut. <strong>Cevap: $x \\in \\{100,\\ 1000\\}$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 5.2.</strong> $\\log_2^2 x - \\log_2 x - 2 = 0$.<br><br>
<em>Tanım kümesi:</em> $x > 0$. $t = \\log_2 x$ koy.<br>
$t^2 - t - 2 = 0 \\Rightarrow (t - 2)(t + 1) = 0 \\Rightarrow t = 2$ veya $t = -1$.<br>
$t = 2 \\Rightarrow x = 2^2 = 4$. &nbsp;&nbsp; $t = -1 \\Rightarrow x = 2^{-1} = \\tfrac{1}{2}$.<br>
<strong>Cevap: $x \\in \\{4,\\ \\tfrac{1}{2}\\}$.</strong>
</div>

<div class="l-note"><strong>Gösterim uyarısı.</strong> "$\\log^2 x$" demek $(\\log x)^2$ demektir, $\\log(\\log x)$ değil. Farklı kitaplar $\\log^2 x$ veya $(\\log x)^2$ yazar; ikisi de aynı anlama gelir.</div>

<!-- ============================================================
     BÖLÜM 6: Yabancı Kök Tuzakları
     ============================================================ -->
<h2 class="l-title">6. Sahte Çözüm (Yabancı Kök) Tuzakları</h2>

<p class="l-text"><strong>Yabancı kök</strong>, çıkardığın cebirsel denklemi sağlayan ama bir $\\log$ argümanı $\\le 0$ olduğu için orijinal logaritmik problemi sağlamayan değerdir. Doğal olarak ortaya çıkar; çünkü "$\\log_a u = \\log_a v \\Rightarrow u = v$" adımı tanım kümesi bilgisini kaybeder.</p>

<div class="l-highlight"><strong>ÖRNEK 6.1 (argüman karesi yabancı kök yaratır).</strong><br>
$\\log_2 (x - 1) + \\log_2 (x + 1) = 3$.<br><br>
<em>Tanım kümesi:</em> $x - 1 > 0$ <em>ve</em> $x + 1 > 0 \\Rightarrow x > 1$.<br>
<em>Sıkıştır:</em> $\\log_2 (x^2 - 1) = 3 \\Rightarrow x^2 - 1 = 8 \\Rightarrow x^2 = 9 \\Rightarrow x = \\pm 3$.<br>
<em>Kontrol:</em> $x = 3 > 1$ — tut. $x = -3$, $x > 1$ koşulunu sağlamaz — at ($\\log_2(-4)$ ve $\\log_2(-2)$ tanımsız).<br>
<strong>Cevap: sadece $x = 3$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 6.2.</strong> $\\log_3 (x^2 - 3x) = \\log_3 (2x - 4)$.<br><br>
<em>Tanım kümesi:</em> $x^2 - 3x > 0$ — çarpanlara ayır $x(x - 3) > 0$, yani $x < 0$ veya $x > 3$. Ve $2x - 4 > 0 \\Rightarrow x > 2$. Birleşim: $x > 3$.<br>
<em>Eşitle:</em> $x^2 - 3x = 2x - 4 \\Rightarrow x^2 - 5x + 4 = 0 \\Rightarrow (x - 1)(x - 4) = 0 \\Rightarrow x = 1$ veya $x = 4$.<br>
<em>Kontrol:</em> $x = 4 > 3$ — tut. $x = 1$, $x > 3$ koşulunu sağlamaz — at.<br>
<strong>Cevap: $x = 4$.</strong>
</div>

<div class="l-note"><strong>Kural.</strong> Logaritmaları yok etmek için her iki tarafı üst aldığında (veya log toplam/farkını tek loga sıkıştırdığında) fazladan kök kazanabilirsin. <em>Mutlaka</em> orijinalin tanım kümesine karşı doğrula.</div>

<!-- ============================================================
     BÖLÜM 7: Logaritmik Eşitsizlikler
     ============================================================ -->
<h2 class="l-title">7. Logaritmik Eşitsizlikler</h2>

<p class="l-text">Anahtar olgu: $\\log_a y$ fonksiyonu $y$'ye göre</p>

<ul class="l-list">
<li>$a > 1$ iken <strong>kesin artan</strong>dır; bu yüzden eşitsizliğin yönünü <em>korur</em>;</li>
<li>$0 < a < 1$ iken <strong>kesin azalan</strong>dır; bu yüzden eşitsizliğin yönünü <em>tersine çevirir</em>.</li>
</ul>

<div class="l-highlight" style="text-align:center"><strong>TABAN 1'DEN BÜYÜK YA DA KÜÇÜK — yön kuralı</strong><br><br>
$a > 1$: &nbsp; $\\log_a f(x) > \\log_a g(x) \\iff f(x) > g(x)$ (her iki taraf $> 0$).<br>
$0 < a < 1$: &nbsp; $\\log_a f(x) > \\log_a g(x) \\iff f(x) < g(x)$ (her iki taraf $> 0$).
</div>

<p class="l-text">$\\log_a f(x) > b$ tipi eşitsizlikler için aynı yön kuralı uygulanır: $f(x) > a^b$ ($a > 1$ ise) veya $f(x) < a^b$ ($0 < a < 1$ ise). Sonucu daima $f(x) > 0$ tanım kümesiyle kesiştir.</p>

<div class="l-highlight"><strong>ÖRNEK 7.1 (taban $> 1$, yönü korur).</strong> $\\log_2 x \\ge 1$.<br><br>
<em>Tanım kümesi:</em> $x > 0$.<br>
<em>Çevir:</em> $x \\ge 2^1 = 2$.<br>
<em>Tanım kümesiyle birleştir:</em> $x \\ge 2$.<br>
<strong>Cevap: $x \\in [2,\\ \\infty)$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 7.2 (taban $< 1$, yön tersine).</strong> $\\log_{1/3} x \\ge 1$.<br><br>
<em>Tanım kümesi:</em> $x > 0$.<br>
<em>Çevir (taban $< 1$, çevir):</em> $x \\le (1/3)^1 = \\tfrac{1}{3}$.<br>
<em>Tanım kümesiyle birleştir:</em> $0 < x \\le \\tfrac{1}{3}$.<br>
<strong>Cevap: $x \\in (0,\\ \\tfrac{1}{3}]$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 7.3 (log vs log, taban $> 1$).</strong> $\\log_5 (x + 1) > \\log_5 (2x - 3)$.<br><br>
<em>Tanım kümesi:</em> $x + 1 > 0$ ve $2x - 3 > 0 \\Rightarrow x > \\tfrac{3}{2}$.<br>
<em>Yönü koru:</em> $x + 1 > 2x - 3 \\Rightarrow 4 > x$.<br>
<em>Birleştir:</em> $\\tfrac{3}{2} < x < 4$.<br>
<strong>Cevap: $x \\in (\\tfrac{3}{2},\\ 4)$.</strong>
</div>

<!-- Plotly: log_2 x >= 1 taranmış bölge -->
<div id="plot-l38-ineq-tr" class="plotly-graph" style="height:360px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[];
  for(var i=1;i<=400;i++){ var x=i/25; xs.push(x); ys.push(Math.log(x)/Math.LN2); }
  var t1={x:xs, y:ys, mode:"lines", name:"y = log₂ x", line:{color:"#c8a96e",width:2.6}};
  var t2={x:[0,16], y:[1,1], mode:"lines", name:"y = 1", line:{color:"#06b6d4",width:2,dash:"dash"}};
  var sx=[], sy=[];
  for(var j=0;j<=200;j++){ var xx=2+(14)*j/200; sx.push(xx); sy.push(Math.log(xx)/Math.LN2); }
  var t3={x:[2].concat(sx).concat([16,2]), y:[1].concat(sy).concat([Math.log(16)/Math.LN2,1]), fill:"toself", mode:"lines", line:{color:"rgba(34,197,94,0.0)"}, fillcolor:"rgba(34,197,94,0.22)", name:"çözüm: x ≥ 2", hoverinfo:"skip"};
  var t4={x:[2], y:[1], mode:"markers+text", text:["x = 2"], textposition:"top right", textfont:{color:"#f87171"}, marker:{size:10,color:"#f87171",line:{color:"#fff",width:1.5}}, showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[0,16],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},yaxis:{title:"y",range:[-1.5,4.5],gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.2)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.2}};
  Plotly.newPlot("plot-l38-ineq-tr",[t3,t1,t2,t4],layout,{responsive:true,displayModeBar:false});
},200)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$\\log_2 x \\ge 1$: yeşil bölge, eğrinin $y = 1$ doğrusunda veya üstünde kaldığı bölgedir. Çözüm kümesi: $x \\ge 2$.</p>

<!-- ============================================================
     BÖLÜM 8: Çözümlü Sorular (Karışık)
     ============================================================ -->
<h2 class="l-title">8. Çözümlü Sorular — Denklem ve Eşitsizlik</h2>

<div class="l-highlight"><strong>ÖRNEK 8.1.</strong> $\\log_4 (x + 12) = 2$.<br><br>
Tanım kümesi: $x + 12 > 0 \\Rightarrow x > -12$. Çevir: $x + 12 = 4^2 = 16 \\Rightarrow x = 4$. Kontrol: $4 > -12$. <strong>Cevap: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 8.2.</strong> $\\log_2 (x + 3) + \\log_2 (x - 1) = 5$.<br><br>
Tanım kümesi: $x > -3$ ve $x > 1 \\Rightarrow x > 1$. Sıkıştır: $\\log_2 [(x + 3)(x - 1)] = 5 \\Rightarrow (x + 3)(x - 1) = 32$.<br>
$x^2 + 2x - 3 = 32 \\Rightarrow x^2 + 2x - 35 = 0 \\Rightarrow (x - 5)(x + 7) = 0 \\Rightarrow x = 5$ veya $x = -7$.<br>
Kontrol: $5 > 1$ tut; $-7 < 1$ at. <strong>Cevap: $x = 5$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 8.3.</strong> $\\log_3^2 x - 4 \\log_3 x + 3 = 0$.<br><br>
Tanım kümesi: $x > 0$. $t = \\log_3 x$ koy: $t^2 - 4t + 3 = 0 \\Rightarrow (t - 1)(t - 3) = 0$.<br>
$t = 1 \\Rightarrow x = 3$. $t = 3 \\Rightarrow x = 27$. İkisi de pozitif. <strong>Cevap: $x \\in \\{3,\\ 27\\}$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 8.4.</strong> $\\log_5 (3x - 2) = \\log_5 (x + 6)$.<br><br>
Tanım kümesi: $3x - 2 > 0 \\Rightarrow x > \\tfrac{2}{3}$; $x + 6 > 0 \\Rightarrow x > -6$. Birleşim: $x > \\tfrac{2}{3}$.<br>
Eşitle: $3x - 2 = x + 6 \\Rightarrow 2x = 8 \\Rightarrow x = 4$. Kontrol geçer. <strong>Cevap: $x = 4$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 8.5 (eşitsizlik, taban $> 1$).</strong> $\\log_3 (2x - 1) < 2$.<br><br>
Tanım kümesi: $2x - 1 > 0 \\Rightarrow x > \\tfrac{1}{2}$. Çevir: $2x - 1 < 3^2 = 9 \\Rightarrow x < 5$.<br>
Birleştir: $\\tfrac{1}{2} < x < 5$. <strong>Cevap: $x \\in (\\tfrac{1}{2},\\ 5)$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 8.6 (eşitsizlik, taban $< 1$).</strong> $\\log_{1/2} (x + 1) > -2$.<br><br>
Tanım kümesi: $x + 1 > 0 \\Rightarrow x > -1$. Çevir (taban $< 1$, yön çevir): $x + 1 < (1/2)^{-2} = 4 \\Rightarrow x < 3$.<br>
Birleştir: $-1 < x < 3$. <strong>Cevap: $x \\in (-1,\\ 3)$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 8.7 (log'a ikinci derece eşitsizlik).</strong> $\\log_2^2 x - 3 \\log_2 x + 2 \\le 0$.<br><br>
Tanım kümesi: $x > 0$. $t = \\log_2 x$: $t^2 - 3t + 2 \\le 0 \\Rightarrow (t - 1)(t - 2) \\le 0 \\Rightarrow 1 \\le t \\le 2$.<br>
Geri dön: $1 \\le \\log_2 x \\le 2 \\Rightarrow 2^1 \\le x \\le 2^2 \\Rightarrow 2 \\le x \\le 4$.<br>
<strong>Cevap: $x \\in [2,\\ 4]$.</strong>
</div>

<!-- ============================================================
     BÖLÜM 9: Karışık Üstel + Logaritmik
     ============================================================ -->
<h2 class="l-title">9. Karışık Üstel + Logaritmik Denklemler</h2>

<p class="l-text">Bilinmeyen bazen hem tabanda hem de üste girer. Standart hile, iki tarafa $\\log$ uygulamaktır. $\\log$'un tabanı önemli değil — cebirsel olarak en sade olanı seç.</p>

<div class="l-highlight"><strong>ÖRNEK 9.1.</strong> $x^{\\log_{10} x} = 100\\, x$ &nbsp; ($x > 0$, $x \\neq 1$).<br><br>
İki tarafa $\\log_{10}$ uygula. Sol: $\\log_{10}(x^{\\log_{10} x}) = (\\log_{10} x)^2$. Sağ: $\\log_{10}(100 x) = \\log_{10} 100 + \\log_{10} x = 2 + \\log_{10} x$.<br>
Yani $(\\log_{10} x)^2 = 2 + \\log_{10} x$. $t = \\log_{10} x$: $t^2 - t - 2 = 0 \\Rightarrow (t - 2)(t + 1) = 0$.<br>
$t = 2 \\Rightarrow x = 100$. $t = -1 \\Rightarrow x = \\tfrac{1}{10}$. İkisi de $x > 0$ ve $x \\neq 1$. <strong>Cevap: $x \\in \\{100,\\ \\tfrac{1}{10}\\}$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 9.2.</strong> $2^x \\cdot 5^x = 100$.<br><br>
Birleştir: $(2 \\cdot 5)^x = 10^x = 100 = 10^2 \\Rightarrow x = 2$. <strong>Cevap: $x = 2$.</strong> (Log alarak da aynı çıkar; tanım kümesi koşulu yok.)
</div>

<div class="l-highlight"><strong>ÖRNEK 9.3.</strong> $5^{x-1} = 7$.<br><br>
$\\log_{10}$ al: $(x - 1) \\log_{10} 5 = \\log_{10} 7 \\Rightarrow x = 1 + \\dfrac{\\log_{10} 7}{\\log_{10} 5}$.<br>
Sayısal: $\\log_{10} 7 \\approx 0.8451$, $\\log_{10} 5 \\approx 0.6990$, yani $x \\approx 1 + 1.209 = 2.209$.<br>
<strong>Cevap: $x = 1 + \\dfrac{\\ln 7}{\\ln 5} \\approx 2.209$.</strong>
</div>

<div class="l-highlight"><strong>ÖRNEK 9.4 ($\\log_x$ için değişken değiştirme).</strong> $\\log_x 4 = 2$ &nbsp; ($x > 0$, $x \\neq 1$).<br><br>
Çevir: $x^2 = 4 \\Rightarrow x = \\pm 2$. Tanım kümesi $x > 0$'ı zorlar, bu yüzden $x = 2$. ($x \\neq 1$ kontrolü: geçer.) <strong>Cevap: $x = 2$.</strong>
</div>

<!-- ============================================================
     BÖLÜM 10: Sınıf Alıştırmaları
     ============================================================ -->
<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Her birini reçeteyle çöz: <strong>(i)</strong> tanım kümesi koşulları, <strong>(ii)</strong> cebirsel çözüm, <strong>(iii)</strong> adayları filtrele, <strong>(iv)</strong> sonucu yaz.</p>

<ol class="l-list">
<li>$\\log_2 (3x - 1) = 4$ denklemini çöz.</li>
<li>$\\log_5 (x^2 - 4x) = \\log_5 (3x - 10)$ denklemini çöz.</li>
<li>$\\log_{10} x + \\log_{10} (x - 3) = 1$ denklemini çöz.</li>
<li>$\\log_2^2 x - 6 \\log_2 x + 8 = 0$ denklemini çöz.</li>
<li>$\\log_3 (x + 2) - \\log_3 (x - 4) = 1$ denklemini çöz.</li>
<li>$\\log_{1/2} (x - 1) \\ge -2$ eşitsizliğini çöz.</li>
<li>$\\log_4 (2x + 3) < \\log_4 (x + 9)$ eşitsizliğini çöz.</li>
<li>$x^{\\log_3 x} = 27 \\, x^2$ &nbsp;($x > 0$, $x \\neq 1$) denklemini çöz.</li>
</ol>

<h3 style="color:#c8a96e;margin-top:1.6rem">Çözüm anahtarı (özet)</h3>

<p class="l-text"><strong>1.</strong> Tanım kümesi: $x > \\tfrac{1}{3}$. Çevir: $3x - 1 = 2^4 = 16 \\Rightarrow x = \\tfrac{17}{3}$. Geçer. <strong>$x = \\tfrac{17}{3}$.</strong></p>

<p class="l-text"><strong>2.</strong> Tanım kümesi: $x^2 - 4x > 0 \\Rightarrow x < 0$ veya $x > 4$; $3x - 10 > 0 \\Rightarrow x > \\tfrac{10}{3}$. Birleşim: $x > 4$. Eşitle: $x^2 - 4x = 3x - 10 \\Rightarrow x^2 - 7x + 10 = 0 \\Rightarrow (x - 2)(x - 5) = 0 \\Rightarrow x = 2$ veya $5$. Sadece $x = 5$ geçer. <strong>$x = 5$.</strong></p>

<p class="l-text"><strong>3.</strong> Tanım kümesi: $x > 3$. Sıkıştır: $\\log_{10}[x(x - 3)] = 1 \\Rightarrow x(x - 3) = 10 \\Rightarrow x^2 - 3x - 10 = 0 \\Rightarrow (x - 5)(x + 2) = 0$. Sadece $x = 5$ geçer. <strong>$x = 5$.</strong></p>

<p class="l-text"><strong>4.</strong> $t = \\log_2 x$: $t^2 - 6t + 8 = 0 \\Rightarrow (t - 2)(t - 4) = 0$. Yani $x = 2^2 = 4$ veya $x = 2^4 = 16$. <strong>$x \\in \\{4,\\ 16\\}$.</strong></p>

<p class="l-text"><strong>5.</strong> Tanım kümesi: $x > 4$. Sıkıştır: $\\log_3 \\!\\left( \\dfrac{x + 2}{x - 4} \\right) = 1 \\Rightarrow \\dfrac{x + 2}{x - 4} = 3$. $x + 2 = 3x - 12 \\Rightarrow 2x = 14 \\Rightarrow x = 7$. Geçer. <strong>$x = 7$.</strong></p>

<p class="l-text"><strong>6.</strong> Tanım kümesi: $x > 1$. Taban $< 1$, çevir: $x - 1 \\le (1/2)^{-2} = 4 \\Rightarrow x \\le 5$. Birleşim: $1 < x \\le 5$. <strong>$x \\in (1,\\ 5]$.</strong></p>

<p class="l-text"><strong>7.</strong> Tanım kümesi: $2x + 3 > 0 \\Rightarrow x > -\\tfrac{3}{2}$; $x + 9 > 0 \\Rightarrow x > -9$. Birleşim: $x > -\\tfrac{3}{2}$. Taban $> 1$, koru: $2x + 3 < x + 9 \\Rightarrow x < 6$. Birleşim: $-\\tfrac{3}{2} < x < 6$. <strong>$x \\in (-\\tfrac{3}{2},\\ 6)$.</strong></p>

<p class="l-text"><strong>8.</strong> İki tarafa $\\log_3$ uygula: $(\\log_3 x)^2 = 3 + 2 \\log_3 x$. $t = \\log_3 x$: $t^2 - 2t - 3 = 0 \\Rightarrow (t - 3)(t + 1) = 0$. $t = 3 \\Rightarrow x = 27$; $t = -1 \\Rightarrow x = \\tfrac{1}{3}$. İkisi de $> 0$ ve $\\neq 1$. <strong>$x \\in \\{27,\\ \\tfrac{1}{3}\\}$.</strong></p>

<div class="l-highlight"><strong>Toparlama.</strong> Logaritmik denklem ve eşitsizliklerde cebir kısa ama dikkat uzun. En önemli alışkanlık: <em>önce tanım kümesini yaz</em>, sonra cebiri yap, en sonda adayları tanım kümesine karşı <em>filtrele</em>. Eşitsizliklerde taban-yön kuralını unutma — $a > 1$ korur, $0 < a < 1$ çevirir — ve neredeyse hiç işaret hatası yapmazsın.</div>

<p class="l-text">Sonraki derste <strong>uygulamalara</strong> bakacağız: üstel ve logaritmik modellerin radyoaktif bozunmayı, nüfus büyümesini, sesi (desibel ölçeği), depremleri (Richter) ve kimyada pH'ı nasıl anlattığını — hepsi az önce çalıştığın tekniklerle.</p>
`

};
