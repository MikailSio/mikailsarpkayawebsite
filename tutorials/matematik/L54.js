window.LISE_MAT_L54 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A quadratic equation is the simplest equation that is genuinely curved.</strong> Linear equations like $3x + 5 = 0$ describe straight lines and always have exactly one solution. The moment you square the unknown — write $x^2$ instead of just $x$ — geometry takes over, the graph becomes a parabola, and the number of solutions can be zero, one, or two depending on how high the curve sits above the x-axis. This lesson teaches you a single formula that solves every quadratic equation in one line.</p>

<p class="l-text">The formula in question is the <em>quadratic formula</em>, and it is one of the most-used results in all of mathematics. It is on every standard exam (YKS, ALES, GRE, SAT), it appears inside almost every physics problem about projectiles or oscillations, and the small piece of it called the <em>discriminant</em> tells you at a glance whether your equation has real solutions before you even start computing. By the end of this lesson you will derive the formula from scratch, use it on dozens of examples, and read the discriminant like a fluent reader.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise a quadratic equation in standard form $ax^2 + bx + c = 0$ with $a \\neq 0$ and identify the coefficients</li>
<li>Choose between four solution methods (factoring, completing the square, quadratic formula, graphing) and know when each is fastest</li>
<li>Derive the quadratic formula yourself by completing the square on the general equation</li>
<li>Apply $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ accurately on any quadratic equation</li>
<li>Compute the discriminant $\\Delta = b^2 - 4ac$ and read off the number and type of roots before solving</li>
<li>Handle complex roots when $\\Delta < 0$ using the imaginary unit $i = \\sqrt{-1}$ at high-school level</li>
</ul>
</div>

<h2 class="lesson-title">1. The Standard Form $ax^2 + bx + c = 0$</h2>

<div class="calc-highlight"><strong>Every quadratic equation can be rearranged into one universal layout.</strong> Bring every term to the left side, group by powers of $x$ from highest to lowest, and leave zero on the right. The result is the <em>standard form</em>, and the three numbers $a$, $b$, $c$ are all you need to solve the equation.</div>

<div class="calc-formula"><div class="formula-label">QUADRATIC EQUATION — STANDARD FORM</div><div class="formula-main">$$ax^2 + bx + c = 0, \\qquad a \\neq 0$$</div><div class="formula-sub">$a$ is the leading coefficient, $b$ is the linear coefficient, $c$ is the constant term. The condition $a \\neq 0$ is essential: if $a = 0$ the equation collapses to a linear one and the techniques of this lesson do not apply.</div></div>

<p class="l-text">The word <em>quadratic</em> comes from the Latin <em>quadratus</em>, meaning "made square." It refers to the $x^2$ term — the highest power of the unknown is two. A quadratic equation is therefore an equation in which the unknown appears squared, possibly also to the first power, and possibly with a constant.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pure quadratic</div><div class="card-body">$b = 0$, so the equation reduces to $ax^2 + c = 0$. Example: $x^2 - 9 = 0$. Solve by isolating $x^2$ and taking square roots.</div></div>
<div class="calc-card"><div class="card-title">Incomplete quadratic</div><div class="card-body">$c = 0$, so the equation is $ax^2 + bx = 0$. Example: $x^2 - 5x = 0$. Factor out $x$ to find one root at $x = 0$.</div></div>
<div class="calc-card"><div class="card-title">Complete quadratic</div><div class="card-body">All three coefficients non-zero: $ax^2 + bx + c = 0$. Example: $2x^2 - 7x + 3 = 0$. The general case, handled by the quadratic formula.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IDENTIFYING $a$, $b$, $c$</div><div class="example-body">Rearrange $3x^2 - 5 = 2x$ into standard form and identify the coefficients.<br><br>Move every term to the left: $3x^2 - 2x - 5 = 0$.<br>Now compare with $ax^2 + bx + c = 0$:<br>$a = 3, \\qquad b = -2, \\qquad c = -5$.<br><br>Caution: sign matters. The $-2$ is part of $b$, not separate from it.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Rewrite each as $ax^2 + bx + c = 0$ and list $a, b, c$:<br>(i) $x^2 = 16$ &rarr; $x^2 - 16 = 0$, so $a = 1, b = 0, c = -16$.<br>(ii) $5x - x^2 = 6$ &rarr; $-x^2 + 5x - 6 = 0$ or equivalently $x^2 - 5x + 6 = 0$ (multiply both sides by $-1$).<br>(iii) $(x - 3)^2 = 4$ &rarr; $x^2 - 6x + 9 = 4$ &rarr; $x^2 - 6x + 5 = 0$.</div></div>

<h2 class="lesson-title">2. Four Solution Methods at a Glance</h2>

<div class="calc-highlight"><strong>There are four standard techniques for solving a quadratic equation.</strong> Each is best suited to a particular form of the equation, and a fluent student picks the fastest method by inspection before reaching for a calculator.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">METHOD 1 — FACTORING</div><div class="compare-item">Idea: write $ax^2 + bx + c$ as a product of two linear factors $(px + q)(rx + s)$.</div><div class="compare-item">Best when: $a, b, c$ are small integers and the equation factors neatly.</div><div class="compare-item">Example: $x^2 - 5x + 6 = 0 \\Rightarrow (x - 2)(x - 3) = 0 \\Rightarrow x = 2, 3$.</div></div><div class="compare-col"><div class="compare-title">METHOD 2 — COMPLETING THE SQUARE</div><div class="compare-item">Idea: turn the left side into a perfect square $(x + h)^2 = k$, then take a square root.</div><div class="compare-item">Best when: you want to derive the formula or read off the vertex of the parabola.</div><div class="compare-item">Example: $x^2 + 6x - 7 = 0 \\Rightarrow (x + 3)^2 = 16 \\Rightarrow x = -3 \\pm 4$.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">METHOD 3 — QUADRATIC FORMULA</div><div class="compare-item">Idea: plug $a, b, c$ into $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.</div><div class="compare-item">Best when: nothing else looks easy, or the coefficients are awkward.</div><div class="compare-item">Always works. This is the universal tool.</div></div><div class="compare-col"><div class="compare-title">METHOD 4 — GRAPHING</div><div class="compare-item">Idea: draw $y = ax^2 + bx + c$ and read off the x-intercepts.</div><div class="compare-item">Best when: you only need an approximate answer or want to visualise the situation.</div><div class="compare-item">Limitation: graphical accuracy is at most 2 significant figures by eye.</div></div></div>

<p class="l-text">A practised student looks at the equation for two seconds before choosing. If the coefficients are tiny and the constant factors easily, factor. If the equation is already close to a perfect square, complete it. Otherwise reach for the quadratic formula — it never fails. Graphing is for understanding, not for high-precision answers.</p>

<div class="l-note"><strong>Calculator note:</strong> any modern scientific calculator (Casio fx-991, TI-30, etc.) has a built-in quadratic solver under the EQN/MODE menu. You enter $a$, $b$, $c$ and it returns the two roots. This is exactly the quadratic formula running inside the calculator. Learn the formula by hand first; the calculator is a productivity tool, not a substitute for understanding.</div>

<h2 class="lesson-title">3. Factoring Method</h2>

<div class="calc-highlight"><strong>The shortcut.</strong> A quadratic $x^2 + bx + c$ with leading coefficient 1 factors as $(x - r_1)(x - r_2)$ where $r_1$ and $r_2$ are the two roots. The Vieta relations tell us $r_1 + r_2 = -b$ and $r_1 \\cdot r_2 = c$. So you look for two numbers whose sum is $-b$ and whose product is $c$.</div>

<div class="calc-formula"><div class="formula-label">VIETA SUM AND PRODUCT (LEADING COEFFICIENT 1)</div><div class="formula-main">$$x^2 + bx + c = (x - r_1)(x - r_2), \\quad r_1 + r_2 = -b, \\quad r_1 r_2 = c$$</div><div class="formula-sub">Expand the right side and match coefficients to verify. This is the basis of mental factoring.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — POSITIVE COEFFICIENTS</div><div class="example-body">Solve $x^2 - 7x + 10 = 0$ by factoring.<br><br>We need two numbers whose sum is $7$ and whose product is $10$. Try $2$ and $5$: $2 + 5 = 7$ ✓, $2 \\times 5 = 10$ ✓.<br>So $x^2 - 7x + 10 = (x - 2)(x - 5)$.<br>The product is zero when either factor is zero:<br>$x - 2 = 0 \\Rightarrow x = 2$, and $x - 5 = 0 \\Rightarrow x = 5$.<br><br>Solution set: $\\{2, 5\\}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — MIXED SIGNS</div><div class="example-body">Solve $x^2 + 3x - 10 = 0$.<br><br>Two numbers whose sum is $-3$ and whose product is $-10$. Try $5$ and $-2$: $5 + (-2) = 3$ ✗ (sign wrong). Try $-5$ and $2$: $-5 + 2 = -3$ ✓, $-5 \\cdot 2 = -10$ ✓.<br>So $x^2 + 3x - 10 = (x - 2)(x + 5)$.<br>$x = 2$ or $x = -5$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — LEADING COEFFICIENT NOT 1</div><div class="example-body">Solve $2x^2 - 7x + 3 = 0$ by factoring.<br><br>Multiply $a \\cdot c = 2 \\cdot 3 = 6$. Find two numbers whose product is $6$ and sum is $-7$. Try $-1$ and $-6$: $-1 + (-6) = -7$ ✓, $-1 \\cdot -6 = 6$ ✓.<br>Split the middle term: $2x^2 - x - 6x + 3 = 0$.<br>Group: $x(2x - 1) - 3(2x - 1) = 0$, so $(2x - 1)(x - 3) = 0$.<br>$x = 1/2$ or $x = 3$.</div></div>

<div class="think-box"><div class="think-label">QUICK PRACTICE</div><div class="think-body">Factor each, then state the roots:<br>(i) $x^2 - 9x + 20 = 0$ &rarr; $(x - 4)(x - 5) = 0$, $x = 4, 5$.<br>(ii) $x^2 + x - 12 = 0$ &rarr; $(x + 4)(x - 3) = 0$, $x = -4, 3$.<br>(iii) $x^2 - 16 = 0$ &rarr; $(x - 4)(x + 4) = 0$, $x = \\pm 4$ (difference of squares).</div></div>

<div class="l-note"><strong>When factoring fails:</strong> if no integer pair has the right sum and product, the roots are not integers and factoring by inspection won't work. Switch to the quadratic formula. An equation like $x^2 - 3x + 1 = 0$ has irrational roots (you can check) and is never going to factor over the integers.</div>

<h2 class="lesson-title">4. Completing the Square — The Geometric Picture</h2>

<div class="calc-highlight"><strong>Completing the square is older than algebra.</strong> Babylonian and Greek mathematicians knew it 3000 years ago, long before symbolic notation. The name is literal: you take an "incomplete" square (a rectangle that almost forms a square but is missing a piece) and add exactly the piece needed to complete it geometrically.</div>

<p class="l-text">Suppose you have the expression $x^2 + 6x$. Picture this as the area of an L-shape: a square of side $x$ (area $x^2$) plus a $6 \\times x$ rectangle on the right. To make the whole figure a square, slice the rectangle in half lengthwise to get two $3 \\times x$ strips. Place one strip on top of the original square and the other on the right. You now have an "almost-square" of side $x + 3$ — with one small $3 \\times 3$ corner missing. Fill that corner with a square of area $9$ and you have completed a true square of side $x + 3$ and area $(x + 3)^2$.</p>

<div class="calc-graph"><div id="plot-l54-square-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the geometric decomposition of $x^2 + 6x$ into the original $x \\times x$ square plus two $3 \\times x$ rectangles, with the missing $3 \\times 3$ corner shown dashed. Adding the dashed area (value 9) <em>completes</em> the larger square of side $x + 3$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xVal=4;var halfB=3;
var sq={x:[0,xVal,xVal,0,0],y:[0,0,xVal,xVal,0],mode:'lines',fill:'toself',name:'x · x',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.25)'};
var rectR={x:[xVal,xVal+halfB,xVal+halfB,xVal,xVal],y:[0,0,xVal,xVal,0],mode:'lines',fill:'toself',name:'3 · x (right)',line:{color:'#10b981',width:2},fillcolor:'rgba(16,185,129,0.25)'};
var rectT={x:[0,xVal,xVal,0,0],y:[xVal,xVal,xVal+halfB,xVal+halfB,xVal],mode:'lines',fill:'toself',name:'3 · x (top)',line:{color:'#10b981',width:2},fillcolor:'rgba(16,185,129,0.25)',showlegend:false};
var corner={x:[xVal,xVal+halfB,xVal+halfB,xVal,xVal],y:[xVal,xVal,xVal+halfB,xVal+halfB,xVal],mode:'lines',fill:'toself',name:'3 · 3 missing',line:{color:'#f59e0b',width:2,dash:'dash'},fillcolor:'rgba(245,158,11,0.18)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'',range:[-0.5,xVal+halfB+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{title:'',range:[-0.5,xVal+halfB+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5},annotations:[{x:xVal/2,y:xVal/2,text:'x²',showarrow:false,font:{color:'#fff',size:18}},{x:xVal+halfB/2,y:xVal/2,text:'3x',showarrow:false,font:{color:'#fff',size:14}},{x:xVal/2,y:xVal+halfB/2,text:'3x',showarrow:false,font:{color:'#fff',size:14}},{x:xVal+halfB/2,y:xVal+halfB/2,text:'9',showarrow:false,font:{color:'#f59e0b',size:14}}]};
Plotly.newPlot('plot-l54-square-en',[sq,rectR,rectT,corner],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">COMPLETING THE SQUARE — KEY IDENTITY</div><div class="formula-main">$$x^2 + bx \\;=\\; \\left( x + \\frac{b}{2} \\right)^2 - \\left( \\frac{b}{2} \\right)^2$$</div><div class="formula-sub">Half of $b$ goes inside the square. The square of half-$b$ comes out as a correction. This is the algebraic version of the geometric picture.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — COMPLETE THE SQUARE</div><div class="example-body">Solve $x^2 + 6x - 7 = 0$ by completing the square.<br><br>Step 1: Move the constant. $x^2 + 6x = 7$.<br>Step 2: Half of $6$ is $3$; square it to get $9$. Add $9$ to both sides:<br>$x^2 + 6x + 9 = 7 + 9 = 16$.<br>Step 3: The left side is now a perfect square: $(x + 3)^2 = 16$.<br>Step 4: Take the square root of both sides: $x + 3 = \\pm 4$.<br>Step 5: $x = -3 + 4 = 1$ or $x = -3 - 4 = -7$.<br><br>Roots: $\\{1, -7\\}$.</div></div>

<div class="think-box"><div class="think-label">SELF-CHECK</div><div class="think-body">Try $x^2 - 4x + 1 = 0$. Half of $-4$ is $-2$, squared is $4$. Add and subtract: $(x - 2)^2 - 4 + 1 = 0$, so $(x - 2)^2 = 3$, giving $x = 2 \\pm \\sqrt{3}$.</div></div>

<h2 class="lesson-title">5. Deriving the Quadratic Formula</h2>

<div class="calc-highlight"><strong>The quadratic formula is not magic.</strong> It is what you get when you complete the square on the general equation $ax^2 + bx + c = 0$ instead of a specific numeric example. Follow the algebra carefully — every line uses the same moves as the previous section.</div>

<p class="l-text">Start with the general standard form, with $a \\neq 0$:</p>

<div class="calc-formula"><div class="formula-label">STEP 1 — START</div><div class="formula-main">$$ax^2 + bx + c = 0$$</div></div>

<p class="l-text">Divide every term by $a$ to make the leading coefficient $1$. This is the key first move: the completing-the-square trick requires it.</p>

<div class="calc-formula"><div class="formula-label">STEP 2 — DIVIDE BY $a$</div><div class="formula-main">$$x^2 + \\frac{b}{a} x + \\frac{c}{a} = 0$$</div></div>

<p class="l-text">Move the constant to the right side:</p>

<div class="calc-formula"><div class="formula-label">STEP 3 — MOVE THE CONSTANT</div><div class="formula-main">$$x^2 + \\frac{b}{a} x = -\\frac{c}{a}$$</div></div>

<p class="l-text">Now complete the square. Half of $b/a$ is $b/(2a)$; its square is $b^2/(4a^2)$. Add this to both sides:</p>

<div class="calc-formula"><div class="formula-label">STEP 4 — ADD THE COMPLETION</div><div class="formula-main">$$x^2 + \\frac{b}{a} x + \\frac{b^2}{4a^2} = \\frac{b^2}{4a^2} - \\frac{c}{a}$$</div></div>

<p class="l-text">The left side is now a perfect square. The right side needs a common denominator $4a^2$:</p>

<div class="calc-formula"><div class="formula-label">STEP 5 — FACTOR THE LEFT, COMBINE THE RIGHT</div><div class="formula-main">$$\\left( x + \\frac{b}{2a} \\right)^2 = \\frac{b^2 - 4ac}{4a^2}$$</div></div>

<p class="l-text">Take the square root of both sides. The $\\pm$ appears because both a positive and a negative square root produce the same square:</p>

<div class="calc-formula"><div class="formula-label">STEP 6 — SQUARE ROOT</div><div class="formula-main">$$x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$$</div></div>

<p class="l-text">Isolate $x$ by subtracting $b/(2a)$ from both sides:</p>

<div class="calc-formula"><div class="formula-label">STEP 7 — THE QUADRATIC FORMULA</div><div class="formula-main">$$\\boxed{\\; x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\;}$$</div><div class="formula-sub">Derived from $ax^2 + bx + c = 0$ by completing the square. Memorise this formula. It solves every quadratic equation.</div></div>

<div class="l-note"><strong>Mnemonic:</strong> read it as "minus $b$, plus or minus the square root of $b$ squared minus four-$a$-$c$, all over two-$a$." Say it aloud a few times. Most students who lose marks on a quadratic in the exam misremember a sign or forget the $\\pm$ — never the structure of the formula itself.</div>

<h2 class="lesson-title">6. Using the Quadratic Formula</h2>

<div class="calc-highlight"><strong>The recipe is mechanical.</strong> Identify $a$, $b$, $c$ from the equation in standard form, substitute into the formula, and simplify. Practise on three examples until the moves are automatic.</div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — TWO RATIONAL ROOTS</div><div class="example-body">Solve $2x^2 - 7x + 3 = 0$ using the quadratic formula.<br><br>$a = 2, \\, b = -7, \\, c = 3$.<br>Discriminant: $b^2 - 4ac = 49 - 24 = 25$. Square root: $\\sqrt{25} = 5$.<br>$x = \\dfrac{7 \\pm 5}{4}$.<br>$x_1 = \\dfrac{7 + 5}{4} = 3$, $\\quad x_2 = \\dfrac{7 - 5}{4} = \\dfrac{1}{2}$.<br><br>Roots: $\\{3, 1/2\\}$. Matches the factoring result from section 3.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — IRRATIONAL ROOTS</div><div class="example-body">Solve $x^2 - 3x + 1 = 0$.<br><br>$a = 1, \\, b = -3, \\, c = 1$.<br>$\\Delta = 9 - 4 = 5$. $\\sqrt{5}$ does not simplify.<br>$x = \\dfrac{3 \\pm \\sqrt{5}}{2}$.<br><br>Decimal: $x_1 \\approx \\dfrac{3 + 2.236}{2} \\approx 2.618$, $\\quad x_2 \\approx \\dfrac{3 - 2.236}{2} \\approx 0.382$.<br><br>These are the golden ratio and its conjugate — a famous pair.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — NEGATIVE LEADING COEFFICIENT</div><div class="example-body">Solve $-x^2 + 4x + 5 = 0$.<br><br>Either multiply through by $-1$ first ($x^2 - 4x - 5 = 0$) or apply the formula directly with $a = -1$. Both give the same answer.<br><br>With $a = -1, b = 4, c = 5$: $\\Delta = 16 - 4(-1)(5) = 16 + 20 = 36$, $\\sqrt{36} = 6$.<br>$x = \\dfrac{-4 \\pm 6}{-2}$.<br>$x_1 = \\dfrac{-4 + 6}{-2} = -1$, $\\quad x_2 = \\dfrac{-4 - 6}{-2} = 5$.<br><br>Roots: $\\{-1, 5\\}$.</div></div>

<div class="think-box"><div class="think-label">COMMON PITFALL</div><div class="think-body">Many students forget that the formula has a $2a$ in the denominator, not just $2$. If $a = 3$, the denominator is $6$, not $2$. Double-check this step every time.</div></div>

<h2 class="lesson-title">7. The Discriminant $\\Delta = b^2 - 4ac$</h2>

<div class="calc-highlight"><strong>The expression under the square root has its own name.</strong> We call $b^2 - 4ac$ the <em>discriminant</em> of the quadratic and write it with the capital Greek letter delta: $\\Delta = b^2 - 4ac$. Its sign tells you everything about the roots before you even compute them.</div>

<div class="calc-formula"><div class="formula-label">DISCRIMINANT — DEFINITION</div><div class="formula-main">$$\\Delta = b^2 - 4ac$$</div><div class="formula-sub">A single number that classifies the roots of $ax^2 + bx + c = 0$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\Delta > 0$ — two distinct real roots</div><div class="card-body">The square root in the formula is a positive real number. The $\\pm$ produces two different values. Graphically: the parabola crosses the x-axis at two points.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta = 0$ — one repeated real root</div><div class="card-body">The square root is zero, so $\\pm$ gives the same value twice. The single root is $x = -b/(2a)$. Graphically: the parabola just touches the x-axis at its vertex.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta < 0$ — no real roots</div><div class="card-body">The square root of a negative number is not real. The equation has no solutions in the real numbers. Graphically: the parabola sits entirely above or entirely below the x-axis. (Complex roots exist — see section 9.)</div></div>
</div>

<div class="calc-graph"><div id="plot-l54-discriminant-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three parabolas opening upward, one in each discriminant regime. Blue ($\\Delta > 0$) crosses the x-axis twice. Amber ($\\Delta = 0$) touches it at exactly one point. Red ($\\Delta < 0$) never touches the x-axis. The sign of $\\Delta$ predicts the geometry.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xx=[];for(var i=-50;i<=50;i++)xx.push(i/10);
var y1=xx.map(function(x){return x*x-4;});
var y2=xx.map(function(x){return x*x;});
var y3=xx.map(function(x){return x*x+2;});
var t1={x:xx,y:y1,mode:'lines',name:'Δ > 0: x² − 4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xx,y:y2,mode:'lines',name:'Δ = 0: x²',line:{color:'#f59e0b',width:2.5}};
var t3={x:xx,y:y3,mode:'lines',name:'Δ < 0: x² + 2',line:{color:'#ef4444',width:2.5}};
var ax0={x:[-5,5],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var roots={x:[-2,2,0],y:[0,0,0],mode:'markers',name:'roots',marker:{color:'#e8e8e8',size:9,symbol:'circle'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-5,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l54-discriminant-en',[t1,t2,t3,ax0,roots],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">DISCRIMINANT FIRST, ROOTS SECOND</div><div class="example-body">Without solving, classify the roots of each equation:<br><br>(i) $x^2 - 6x + 5 = 0$: $\\Delta = 36 - 20 = 16 > 0$. Two distinct real roots.<br>(ii) $x^2 - 4x + 4 = 0$: $\\Delta = 16 - 16 = 0$. One repeated real root.<br>(iii) $x^2 + x + 1 = 0$: $\\Delta = 1 - 4 = -3 < 0$. No real roots.<br><br>Now solve only the ones with real roots:<br>(i) $x = \\dfrac{6 \\pm 4}{2}$, so $x = 5$ or $x = 1$.<br>(ii) $x = \\dfrac{4 \\pm 0}{2} = 2$ (double root).<br>(iii) Complex roots only — see section 9.</div></div>

<div class="l-note"><strong>Exam strategy:</strong> in multiple choice problems that ask "for what values of $k$ does the equation have two real roots?" you almost always set $\\Delta > 0$ and solve an inequality in $k$. The discriminant turns the question into a tractable algebra problem.</div>

<div class="calc-example"><div class="example-label">PARAMETER PROBLEM</div><div class="example-body">For what values of $k$ does $x^2 - 4x + k = 0$ have two distinct real roots?<br><br>$\\Delta = 16 - 4k > 0$, so $k < 4$.<br><br>For one repeated root: $k = 4$. For no real roots: $k > 4$.</div></div>

<h2 class="lesson-title">8. Worked Examples — One of Each Discriminant Type</h2>

<div class="calc-highlight"><strong>Three full worked solutions, one per discriminant regime.</strong> Follow the steps carefully — this is the pattern you should reproduce on every quadratic equation problem.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE A — $\\Delta > 0$ (TWO REAL ROOTS)</div><div class="example-body"><strong>Equation:</strong> $3x^2 - 5x - 2 = 0$.<br><br><em>Step 1 — coefficients.</em> $a = 3, b = -5, c = -2$.<br><em>Step 2 — discriminant.</em> $\\Delta = (-5)^2 - 4(3)(-2) = 25 + 24 = 49$. Since $\\Delta > 0$, two distinct real roots.<br><em>Step 3 — square root.</em> $\\sqrt{49} = 7$.<br><em>Step 4 — apply the formula.</em> $x = \\dfrac{5 \\pm 7}{6}$.<br><em>Step 5 — two roots.</em> $x_1 = \\dfrac{12}{6} = 2$, $\\quad x_2 = \\dfrac{-2}{6} = -\\dfrac{1}{3}$.<br><em>Step 6 — verify.</em> $3(2)^2 - 5(2) - 2 = 12 - 10 - 2 = 0$ ✓ and $3(-1/3)^2 - 5(-1/3) - 2 = 1/3 + 5/3 - 2 = 0$ ✓.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE B — $\\Delta = 0$ (ONE DOUBLE ROOT)</div><div class="example-body"><strong>Equation:</strong> $9x^2 - 12x + 4 = 0$.<br><br><em>Step 1 — coefficients.</em> $a = 9, b = -12, c = 4$.<br><em>Step 2 — discriminant.</em> $\\Delta = (-12)^2 - 4(9)(4) = 144 - 144 = 0$. Since $\\Delta = 0$, one repeated root.<br><em>Step 3 — square root.</em> $\\sqrt{0} = 0$.<br><em>Step 4 — apply the formula.</em> $x = \\dfrac{12 \\pm 0}{18} = \\dfrac{12}{18} = \\dfrac{2}{3}$.<br><em>Step 5 — interpretation.</em> Both branches of the $\\pm$ give the same value: $x = 2/3$ with multiplicity 2.<br><em>Step 6 — verify.</em> $9(2/3)^2 - 12(2/3) + 4 = 9 \\cdot 4/9 - 8 + 4 = 4 - 8 + 4 = 0$ ✓.<br><em>Note:</em> $9x^2 - 12x + 4 = (3x - 2)^2$ — a perfect square. That is the algebraic signature of $\\Delta = 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE C — $\\Delta < 0$ (NO REAL ROOTS)</div><div class="example-body"><strong>Equation:</strong> $x^2 + 2x + 5 = 0$.<br><br><em>Step 1 — coefficients.</em> $a = 1, b = 2, c = 5$.<br><em>Step 2 — discriminant.</em> $\\Delta = 4 - 20 = -16$. Since $\\Delta < 0$, no real roots.<br><em>Step 3 — formal solution.</em> $x = \\dfrac{-2 \\pm \\sqrt{-16}}{2}$.<br><em>Step 4 — over the reals.</em> No real number solves this equation. Solution set in $\\mathbb{R}$: $\\emptyset$.<br><em>Step 5 — over the complex numbers (next section).</em> $\\sqrt{-16} = 4i$, so $x = -1 \\pm 2i$. Two complex conjugate roots.</div></div>

<h2 class="lesson-title">9. Complex Roots: When $\\Delta < 0$</h2>

<div class="calc-highlight"><strong>When the discriminant is negative, the formula asks us to take the square root of a negative number.</strong> Real numbers cannot do this. To get past the impasse, mathematicians invented a new number called the <em>imaginary unit</em>, written $i$, defined by $i^2 = -1$. With $i$ in hand, every quadratic equation has exactly two roots — they just live in the larger world of <em>complex numbers</em>.</div>

<div class="calc-formula"><div class="formula-label">THE IMAGINARY UNIT</div><div class="formula-main">$$i^2 = -1 \\qquad\\Longleftrightarrow\\qquad i = \\sqrt{-1}$$</div><div class="formula-sub">A number whose square is negative. Defined by decree, then used to extend the number system.</div></div>

<p class="l-text">A <strong>complex number</strong> is anything of the form $a + bi$ where $a$ and $b$ are real numbers. $a$ is the <em>real part</em>, $bi$ is the <em>imaginary part</em>. When $b = 0$ the number is real; when $a = 0$ and $b \\neq 0$ the number is pure imaginary; otherwise it is a general complex number.</p>

<p class="l-text">To take the square root of a negative number, factor out the negative sign:</p>

<div class="calc-formula"><div class="formula-label">SQUARE ROOT OF A NEGATIVE NUMBER</div><div class="formula-main">$$\\sqrt{-N} \\;=\\; \\sqrt{N} \\cdot \\sqrt{-1} \\;=\\; i\\sqrt{N}, \\qquad N > 0$$</div><div class="formula-sub">Examples: $\\sqrt{-9} = 3i$, $\\sqrt{-16} = 4i$, $\\sqrt{-7} = i\\sqrt{7}$.</div></div>

<div class="calc-example"><div class="example-label">FINISHING EXAMPLE C FROM SECTION 8</div><div class="example-body">$x^2 + 2x + 5 = 0$, $\\Delta = -16$.<br><br>$\\sqrt{-16} = 4i$.<br>$x = \\dfrac{-2 \\pm 4i}{2} = -1 \\pm 2i$.<br><br>Two complex roots: $x_1 = -1 + 2i$ and $x_2 = -1 - 2i$. They are <em>complex conjugates</em> of each other — same real part, opposite imaginary part.</div></div>

<div class="calc-example"><div class="example-label">ANOTHER COMPLEX ROOTS EXAMPLE</div><div class="example-body">Solve $2x^2 + x + 3 = 0$.<br><br>$a = 2, b = 1, c = 3$. $\\Delta = 1 - 24 = -23$.<br>$\\sqrt{-23} = i\\sqrt{23}$.<br>$x = \\dfrac{-1 \\pm i\\sqrt{23}}{4}$.<br><br>Real part: $-1/4$. Imaginary part: $\\pm \\sqrt{23}/4$.</div></div>

<div class="l-note"><strong>Why this matters:</strong> in physics (oscillating circuits, quantum mechanics), in engineering (control systems, signal processing), in pure mathematics (the fundamental theorem of algebra), and in geometry (rotations in the plane), complex numbers are not a curiosity — they are the right language. The quadratic formula was the doorway to them: mathematicians could not avoid $\\sqrt{-1}$ when solving cubic equations in the 16th century, and complex analysis grew from there.</div>

<div class="think-box"><div class="think-label">COMPLEX CONJUGATE PAIRING</div><div class="think-body">A real quadratic equation (one with real coefficients) whose discriminant is negative always produces a <em>pair</em> of complex roots that are conjugates of each other: $p + qi$ and $p - qi$. They are never separate; you cannot have one without the other. This is a consequence of the $\\pm$ in the formula and the fact that $\\sqrt{\\text{negative}}$ produces an imaginary number.</div></div>

<h2 class="lesson-title">10. Classic Exercises</h2>

<div class="calc-highlight"><strong>Eight problems covering every technique in this lesson.</strong> Try each on paper before reading the solution. Use the most efficient method (factoring first if obvious, otherwise quadratic formula).</div>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Solve $x^2 - 9x + 14 = 0$.<br><br><strong>Solution.</strong> Factor: two numbers with sum $9$, product $14$ &rarr; $2$ and $7$. So $(x - 2)(x - 7) = 0$, $x = 2$ or $x = 7$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">Solve $x^2 + 5x - 6 = 0$.<br><br><strong>Solution.</strong> Two numbers with sum $-5$, product $-6$ &rarr; $-6$ and $1$. So $(x + 6)(x - 1) = 0$, $x = -6$ or $x = 1$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body">Solve $4x^2 - 4x + 1 = 0$.<br><br><strong>Solution.</strong> $\\Delta = 16 - 16 = 0$, double root. $x = 4/8 = 1/2$. Notice $4x^2 - 4x + 1 = (2x - 1)^2$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">Solve $x^2 - 2x - 4 = 0$.<br><br><strong>Solution.</strong> $\\Delta = 4 + 16 = 20$. $\\sqrt{20} = 2\\sqrt{5}$. $x = \\dfrac{2 \\pm 2\\sqrt{5}}{2} = 1 \\pm \\sqrt{5}$. Decimal: $x \\approx 3.236$ or $x \\approx -1.236$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body">Solve $3x^2 + 2x + 1 = 0$.<br><br><strong>Solution.</strong> $\\Delta = 4 - 12 = -8 < 0$. No real roots. Complex: $x = \\dfrac{-2 \\pm i\\sqrt{8}}{6} = \\dfrac{-1 \\pm i\\sqrt{2}}{3}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — PARAMETER</div><div class="example-body">For what values of $m$ does $x^2 - (m + 2) x + m = 0$ have a double root?<br><br><strong>Solution.</strong> $\\Delta = (m + 2)^2 - 4m = m^2 + 4m + 4 - 4m = m^2 + 4 = 0$. But $m^2 + 4$ is always positive, so $\\Delta = 0$ is impossible. The equation always has two distinct real roots, never a double root.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 — WORD PROBLEM</div><div class="example-body">A rectangular garden has area $40$ m² and perimeter $26$ m. Find its dimensions.<br><br><strong>Solution.</strong> Let length $= L$, width $= W$. Then $2L + 2W = 26 \\Rightarrow L + W = 13$ and $LW = 40$.<br>So $L$ and $W$ are the two roots of $x^2 - 13x + 40 = 0$.<br>$\\Delta = 169 - 160 = 9$, $\\sqrt{9} = 3$. $x = \\dfrac{13 \\pm 3}{2}$. $x = 8$ or $x = 5$.<br>Dimensions: $\\mathbf{8 \\text{ m} \\times 5 \\text{ m}}$. Verify: $8 + 5 = 13$ ✓, $8 \\cdot 5 = 40$ ✓.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 — PROJECTILE</div><div class="example-body">A ball is thrown upward from a height of $1.5$ m with initial speed $14$ m/s. Its height in metres after $t$ seconds is $h(t) = -5 t^2 + 14 t + 1.5$. When does it hit the ground?<br><br><strong>Solution.</strong> Set $h(t) = 0$: $-5 t^2 + 14 t + 1.5 = 0$, or $5 t^2 - 14 t - 1.5 = 0$.<br>$a = 5, b = -14, c = -1.5$. $\\Delta = 196 + 30 = 226$. $\\sqrt{226} \\approx 15.033$.<br>$t = \\dfrac{14 \\pm 15.033}{10}$. The positive root: $t \\approx \\dfrac{29.033}{10} \\approx \\mathbf{2.90}$ seconds.<br>(The other root $t \\approx -0.10$ s is negative — before launch — so we discard it.)</div></div>

<div class="calc-graph"><div id="plot-l54-parabolas-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two parabolas demonstrating the effect of the sign of $a$. When $a > 0$ (blue), the parabola opens upward and has a minimum. When $a < 0$ (red), it opens downward and has a maximum. The discriminant tells you whether either of them crosses the x-axis.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xx=[];for(var i=-50;i<=50;i++)xx.push(i/10);
var yp=xx.map(function(x){return x*x-2*x-3;});
var yn=xx.map(function(x){return -1*x*x+2*x+3;});
var tp={x:xx,y:yp,mode:'lines',name:'a > 0: x² − 2x − 3',line:{color:'#3b82f6',width:2.5}};
var tn={x:xx,y:yn,mode:'lines',name:'a < 0: −x² + 2x + 3',line:{color:'#ef4444',width:2.5}};
var ax0={x:[-5,5],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l54-parabolas-en',[tp,tn,ax0],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SUMMARY</div><div class="think-body">A quadratic equation $ax^2 + bx + c = 0$ has roots $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. Compute the discriminant $\\Delta = b^2 - 4ac$ first: positive means two real roots, zero means one double root, negative means a pair of complex conjugate roots. Factoring is faster when it works; the quadratic formula always works.</div></div>

<p class="l-text">In the next lesson we will study the <em>graphs</em> of quadratic functions in more detail — vertex, axis of symmetry, transformations — and use what we have learned about the discriminant to read the geometry of any parabola at a glance.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İkinci derece denklem, gerçekten eğri olan en basit denklemdir.</strong> $3x + 5 = 0$ gibi birinci derece denklemler doğru parçalarını betimler ve her zaman tek bir çözüme sahiptir. Bilinmeyenin karesini aldığınız an — yani $x$ yerine $x^2$ yazdığınız an — geometri devreye girer, grafik bir parabole dönüşür ve çözüm sayısı eğrinin x-eksenine göre konumuna bağlı olarak sıfır, bir veya iki olabilir. Bu ders, her ikinci derece denklemi tek satırda çözen bir formülü öğretir.</p>

<p class="l-text">Söz konusu formül <em>karesel formül</em>dür ve matematikteki en sık kullanılan sonuçlardan biridir. Her standart sınavda karşınıza çıkar (YKS, ALES, GRE, SAT), neredeyse her parabolik hareket veya salınım fiziği probleminin içinde belirir ve onun küçük parçası olan <em>diskriminant</em>, daha hesaplamaya başlamadan denkleminizin reel çözümlere sahip olup olmadığını bir bakışta söyler. Bu dersin sonunda formülü sıfırdan türetecek, onlarca örnekte kullanacak ve diskriminantı akıcı bir okuyucu gibi okuyacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İkinci derece denklemi $ax^2 + bx + c = 0$ standart formunda ($a \\neq 0$) tanımak ve katsayıları doğru belirlemek</li>
<li>Dört çözüm yöntemi (çarpanlara ayırma, kare tamamlama, karesel formül, grafik) arasında seçim yapabilmek ve hangisinin ne zaman en hızlı olduğunu bilmek</li>
<li>Karesel formülü genel denklem üzerinde kare tamamlayarak kendiniz türetmek</li>
<li>$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ formülünü her ikinci derece denkleme doğru biçimde uygulamak</li>
<li>Diskriminant $\\Delta = b^2 - 4ac$ değerini hesaplayıp daha çözmeden önce köklerin sayısını ve türünü okumak</li>
<li>$\\Delta < 0$ durumunda sanal birim $i = \\sqrt{-1}$ kullanarak karmaşık kökleri lise düzeyinde ele almak</li>
</ul>
</div>

<h2 class="lesson-title">1. $ax^2 + bx + c = 0$ Standart Formu</h2>

<div class="calc-highlight"><strong>Her ikinci derece denklem evrensel bir düzene getirilebilir.</strong> Her terimi sol tarafa taşıyın, $x$'in kuvvetlerine göre en yüksekten en düşüğe sıralayın ve sağ tarafta sıfır bırakın. Sonuç <em>standart form</em>dur ve denklemi çözmek için tek ihtiyacınız olan üç sayı $a$, $b$, $c$'dir.</div>

<div class="calc-formula"><div class="formula-label">İKİNCİ DERECE DENKLEM — STANDART FORM</div><div class="formula-main">$$ax^2 + bx + c = 0, \\qquad a \\neq 0$$</div><div class="formula-sub">$a$ baş katsayı, $b$ birinci derece terimin katsayısı, $c$ sabit terimdir. $a \\neq 0$ koşulu zorunludur: eğer $a = 0$ ise denklem birinci dereceye iner ve bu dersin teknikleri uygulanmaz.</div></div>

<p class="l-text">"Kuadratik" (quadratic) sözcüğü Latince <em>quadratus</em> kelimesinden gelir ve "kare yapılmış" anlamına gelir. Adı $x^2$ terimine atıftır — bilinmeyenin en yüksek kuvveti ikidir. Demek ki ikinci derece denklem, bilinmeyenin karesinin (gerektiğinde birinci kuvvetinin ve sabit terimin) yer aldığı bir denklemdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Saf (yalın) ikinci derece</div><div class="card-body">$b = 0$ olduğunda denklem $ax^2 + c = 0$'a indirgenir. Örnek: $x^2 - 9 = 0$. $x^2$'yi yalnız bırakıp karekök alarak çözülür.</div></div>
<div class="calc-card"><div class="card-title">Eksik ikinci derece</div><div class="card-body">$c = 0$ olduğunda denklem $ax^2 + bx = 0$ olur. Örnek: $x^2 - 5x = 0$. $x$ parantezine alarak bir kökü $x = 0$ olarak buluruz.</div></div>
<div class="calc-card"><div class="card-title">Tam ikinci derece</div><div class="card-body">Üç katsayı da sıfırdan farklı: $ax^2 + bx + c = 0$. Örnek: $2x^2 - 7x + 3 = 0$. Genel durum; karesel formülle çözülür.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — $a$, $b$, $c$ BELİRLEME</div><div class="example-body">$3x^2 - 5 = 2x$ denklemini standart forma getirip katsayıları belirleyin.<br><br>Her terimi sol tarafa taşıyın: $3x^2 - 2x - 5 = 0$.<br>Şimdi $ax^2 + bx + c = 0$ ile karşılaştırın:<br>$a = 3, \\qquad b = -2, \\qquad c = -5$.<br><br>Dikkat: işaret önemlidir. $-2$, $b$'nin bir parçasıdır; ayrı düşünmeyin.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Her birini $ax^2 + bx + c = 0$ olarak yeniden yazın ve $a, b, c$'yi listeleyin:<br>(i) $x^2 = 16$ &rarr; $x^2 - 16 = 0$, yani $a = 1, b = 0, c = -16$.<br>(ii) $5x - x^2 = 6$ &rarr; $-x^2 + 5x - 6 = 0$ veya eşdeğer olarak $x^2 - 5x + 6 = 0$ (her iki tarafı $-1$ ile çarparak).<br>(iii) $(x - 3)^2 = 4$ &rarr; $x^2 - 6x + 9 = 4$ &rarr; $x^2 - 6x + 5 = 0$.</div></div>

<h2 class="lesson-title">2. Dört Çözüm Yöntemi Bir Arada</h2>

<div class="calc-highlight"><strong>İkinci derece denklemi çözmek için dört standart teknik vardır.</strong> Her biri denklemin belirli bir biçimi için en uygun olanıdır ve akıcı bir öğrenci, hesap makinesine uzanmadan önce en hızlı yöntemi gözle seçer.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YÖNTEM 1 — ÇARPANLARA AYIRMA</div><div class="compare-item">Fikir: $ax^2 + bx + c$ ifadesini iki doğrusal çarpan $(px + q)(rx + s)$ şeklinde yazmak.</div><div class="compare-item">Ne zaman en hızlı: $a, b, c$ küçük tamsayılar ve denklem temiz çarpanlanıyorsa.</div><div class="compare-item">Örnek: $x^2 - 5x + 6 = 0 \\Rightarrow (x - 2)(x - 3) = 0 \\Rightarrow x = 2, 3$.</div></div><div class="compare-col"><div class="compare-title">YÖNTEM 2 — KARE TAMAMLAMA</div><div class="compare-item">Fikir: sol tarafı $(x + h)^2 = k$ tam karesi haline getirip karekök almak.</div><div class="compare-item">Ne zaman en uygun: formülü türetmek veya parabolün tepe noktasını okumak istediğinizde.</div><div class="compare-item">Örnek: $x^2 + 6x - 7 = 0 \\Rightarrow (x + 3)^2 = 16 \\Rightarrow x = -3 \\pm 4$.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YÖNTEM 3 — KARESEL FORMÜL</div><div class="compare-item">Fikir: $a, b, c$ değerlerini $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ formülüne yerleştirmek.</div><div class="compare-item">Ne zaman: başka bir şey kolay görünmediğinde veya katsayılar karmaşık olduğunda.</div><div class="compare-item">Her zaman çalışır. Bu evrensel araçtır.</div></div><div class="compare-col"><div class="compare-title">YÖNTEM 4 — GRAFİK</div><div class="compare-item">Fikir: $y = ax^2 + bx + c$ grafiğini çizip x-eksenini kestiği noktaları okumak.</div><div class="compare-item">Ne zaman uygun: yaklaşık bir cevap yeterli veya durumu görselleştirmek istiyorsanız.</div><div class="compare-item">Sınırı: gözle okuma hassasiyeti en fazla 2 anlamlı rakamdır.</div></div></div>

<p class="l-text">Deneyimli bir öğrenci, seçim yapmadan önce denkleme iki saniye bakar. Katsayılar küçükse ve sabit terim kolay çarpanlanıyorsa, çarpanlarına ayır. Denklem zaten tam kareye yakınsa, kareyi tamamla. Aksi halde karesel formüle git — asla başarısız olmaz. Grafik çizimi anlamak içindir, yüksek hassasiyetli cevap için değil.</p>

<div class="l-note"><strong>Hesap makinesi notu:</strong> her modern bilimsel hesap makinesinin (Casio fx-991, TI-30 vb.) EQN/MODE menüsünde yerleşik bir ikinci derece çözücüsü vardır. $a$, $b$, $c$ girersiniz ve iki kökü döndürür. Bu, hesap makinesinin içinde çalışan karesel formülün ta kendisidir. Önce formülü elle öğrenin; hesap makinesi bir verimlilik aracıdır, anlamanın yerini almaz.</div>

<h2 class="lesson-title">3. Çarpanlara Ayırma Yöntemi</h2>

<div class="calc-highlight"><strong>Kısayol.</strong> Baş katsayısı 1 olan $x^2 + bx + c$ ikinci derece ifadesi, $r_1$ ve $r_2$ iki kök olmak üzere $(x - r_1)(x - r_2)$ şeklinde çarpanlanır. Vieta bağıntıları $r_1 + r_2 = -b$ ve $r_1 \\cdot r_2 = c$'yi söyler. Yani toplamı $-b$, çarpımı $c$ olan iki sayı ararsınız.</div>

<div class="calc-formula"><div class="formula-label">VIETA TOPLAM VE ÇARPIM (BAŞ KATSAYI 1)</div><div class="formula-main">$$x^2 + bx + c = (x - r_1)(x - r_2), \\quad r_1 + r_2 = -b, \\quad r_1 r_2 = c$$</div><div class="formula-sub">Sağ tarafı açıp katsayıları eşleştirerek doğrulayın. Bu, zihinden çarpanlara ayırmanın temelidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — POZİTİF KATSAYILAR</div><div class="example-body">$x^2 - 7x + 10 = 0$ denklemini çarpanlara ayırarak çözün.<br><br>Toplamı $7$, çarpımı $10$ olan iki sayı arıyoruz. $2$ ve $5$'i deneyelim: $2 + 5 = 7$ ✓, $2 \\times 5 = 10$ ✓.<br>O halde $x^2 - 7x + 10 = (x - 2)(x - 5)$.<br>Çarpım, çarpanlardan biri sıfır olduğunda sıfırdır:<br>$x - 2 = 0 \\Rightarrow x = 2$ ve $x - 5 = 0 \\Rightarrow x = 5$.<br><br>Çözüm kümesi: $\\{2, 5\\}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — KARIŞIK İŞARETLER</div><div class="example-body">$x^2 + 3x - 10 = 0$ denklemini çözün.<br><br>Toplamı $-3$, çarpımı $-10$ olan iki sayı. $5$ ve $-2$'yi deneyin: $5 + (-2) = 3$ ✗ (işaret yanlış). $-5$ ve $2$'yi deneyin: $-5 + 2 = -3$ ✓, $-5 \\cdot 2 = -10$ ✓.<br>O halde $x^2 + 3x - 10 = (x - 2)(x + 5)$.<br>$x = 2$ veya $x = -5$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — BAŞ KATSAYI 1 DEĞİL</div><div class="example-body">$2x^2 - 7x + 3 = 0$ denklemini çarpanlara ayırarak çözün.<br><br>$a \\cdot c = 2 \\cdot 3 = 6$ çarpımını alın. Çarpımı $6$, toplamı $-7$ olan iki sayı bulun. $-1$ ve $-6$'yı deneyin: $-1 + (-6) = -7$ ✓, $-1 \\cdot -6 = 6$ ✓.<br>Orta terimi parçalayın: $2x^2 - x - 6x + 3 = 0$.<br>Gruplayın: $x(2x - 1) - 3(2x - 1) = 0$, yani $(2x - 1)(x - 3) = 0$.<br>$x = 1/2$ veya $x = 3$.</div></div>

<div class="think-box"><div class="think-label">HIZLI PRATİK</div><div class="think-body">Her birini çarpanlarına ayırın, sonra kökleri yazın:<br>(i) $x^2 - 9x + 20 = 0$ &rarr; $(x - 4)(x - 5) = 0$, $x = 4, 5$.<br>(ii) $x^2 + x - 12 = 0$ &rarr; $(x + 4)(x - 3) = 0$, $x = -4, 3$.<br>(iii) $x^2 - 16 = 0$ &rarr; $(x - 4)(x + 4) = 0$, $x = \\pm 4$ (iki kare farkı).</div></div>

<div class="l-note"><strong>Çarpanlara ayırma başarısız olduğunda:</strong> hiçbir tamsayı çifti doğru toplam ve çarpıma sahip değilse, kökler tamsayı değildir ve gözle çarpanlara ayırma işe yaramaz. Karesel formüle geçin. $x^2 - 3x + 1 = 0$ gibi bir denklemin kökleri irrasyoneldir (kontrol edebilirsiniz) ve tamsayılar üzerinden asla çarpanlanmayacaktır.</div>

<h2 class="lesson-title">4. Tam Kareye Tamamlama — Geometrik Resim</h2>

<div class="calc-highlight"><strong>Kareyi tamamlama, cebirin kendisinden daha eskidir.</strong> Babilli ve Yunan matematikçiler bunu 3000 yıl önce, sembolik gösterimden çok önce biliyordu. Ad gerçek anlamda harfi harfine: "tamamlanmamış" bir kareyi (kare oluşturmaya az kalmış ama bir parçası eksik bir dikdörtgeni) alırsınız ve geometrik olarak kareyi tamamlamak için gereken parçayı tam olarak eklersiniz.</div>

<p class="l-text">$x^2 + 6x$ ifadesini ele alalım. Bunu bir L-şeklinin alanı olarak hayal edin: kenarı $x$ olan bir kare (alan $x^2$) artı sağ tarafta $6 \\times x$'lik bir dikdörtgen. Tüm şekli kare yapmak için dikdörtgeni uzunlamasına ikiye bölerek iki $3 \\times x$'lik şerit elde edin. Bir şeridi orijinal karenin üstüne, diğerini sağına yerleştirin. Şimdi kenarı $x + 3$ olan "neredeyse-kare" bir şekliniz var — küçük bir $3 \\times 3$ köşesi eksik. O köşeyi $9$ alanlı bir kareyle doldurun ve kenarı $x + 3$, alanı $(x + 3)^2$ olan tam bir kareyi tamamlamış olursunuz.</p>

<div class="calc-graph"><div id="plot-l54-square-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $x^2 + 6x$ ifadesinin orijinal $x \\times x$ karesi artı iki $3 \\times x$ dikdörtgeni biçimindeki geometrik ayrışımı; eksik $3 \\times 3$ köşesi kesik çizgili gösteriliyor. Kesik çizgili alanı (değeri 9) eklemek, kenarı $x + 3$ olan büyük kareyi <em>tamamlar</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xVal=4;var halfB=3;
var sq={x:[0,xVal,xVal,0,0],y:[0,0,xVal,xVal,0],mode:'lines',fill:'toself',name:'x · x',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.25)'};
var rectR={x:[xVal,xVal+halfB,xVal+halfB,xVal,xVal],y:[0,0,xVal,xVal,0],mode:'lines',fill:'toself',name:'3 · x (sağ)',line:{color:'#10b981',width:2},fillcolor:'rgba(16,185,129,0.25)'};
var rectT={x:[0,xVal,xVal,0,0],y:[xVal,xVal,xVal+halfB,xVal+halfB,xVal],mode:'lines',fill:'toself',name:'3 · x (üst)',line:{color:'#10b981',width:2},fillcolor:'rgba(16,185,129,0.25)',showlegend:false};
var corner={x:[xVal,xVal+halfB,xVal+halfB,xVal,xVal],y:[xVal,xVal,xVal+halfB,xVal+halfB,xVal],mode:'lines',fill:'toself',name:'3 · 3 eksik',line:{color:'#f59e0b',width:2,dash:'dash'},fillcolor:'rgba(245,158,11,0.18)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'',range:[-0.5,xVal+halfB+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,showticklabels:false},yaxis:{title:'',range:[-0.5,xVal+halfB+0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',showticklabels:false},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5},annotations:[{x:xVal/2,y:xVal/2,text:'x²',showarrow:false,font:{color:'#fff',size:18}},{x:xVal+halfB/2,y:xVal/2,text:'3x',showarrow:false,font:{color:'#fff',size:14}},{x:xVal/2,y:xVal+halfB/2,text:'3x',showarrow:false,font:{color:'#fff',size:14}},{x:xVal+halfB/2,y:xVal+halfB/2,text:'9',showarrow:false,font:{color:'#f59e0b',size:14}}]};
Plotly.newPlot('plot-l54-square-tr',[sq,rectR,rectT,corner],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">KARE TAMAMLAMA — ANAHTAR ÖZDEŞLİK</div><div class="formula-main">$$x^2 + bx \\;=\\; \\left( x + \\frac{b}{2} \\right)^2 - \\left( \\frac{b}{2} \\right)^2$$</div><div class="formula-sub">$b$'nin yarısı karenin içine girer. $b$'nin yarısının karesi düzeltme olarak çıkar. Bu, geometrik resmin cebirsel versiyonudur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — KAREYİ TAMAMLA</div><div class="example-body">$x^2 + 6x - 7 = 0$ denklemini kareyi tamamlayarak çözün.<br><br>Adım 1: Sabit terimi taşıyın. $x^2 + 6x = 7$.<br>Adım 2: $6$'nın yarısı $3$; karesi $9$. İki tarafa da $9$ ekleyin:<br>$x^2 + 6x + 9 = 7 + 9 = 16$.<br>Adım 3: Sol taraf artık tam karedir: $(x + 3)^2 = 16$.<br>Adım 4: İki tarafın da karekökünü alın: $x + 3 = \\pm 4$.<br>Adım 5: $x = -3 + 4 = 1$ veya $x = -3 - 4 = -7$.<br><br>Kökler: $\\{1, -7\\}$.</div></div>

<div class="think-box"><div class="think-label">KENDİNİZİ KONTROL EDİN</div><div class="think-body">$x^2 - 4x + 1 = 0$ deneyin. $-4$'ün yarısı $-2$, karesi $4$. Ekleyip çıkarın: $(x - 2)^2 - 4 + 1 = 0$, yani $(x - 2)^2 = 3$, sonuç $x = 2 \\pm \\sqrt{3}$.</div></div>

<h2 class="lesson-title">5. Karesel Formülün Türetilmesi</h2>

<div class="calc-highlight"><strong>Karesel formül sihir değildir.</strong> Belirli bir sayısal örnek yerine genel denklem $ax^2 + bx + c = 0$ üzerinde kareyi tamamladığınızda elde ettiğiniz şeydir. Cebiri dikkatle takip edin — her satır önceki bölümdeki hareketleri kullanır.</div>

<p class="l-text">Genel standart formla başlayın, $a \\neq 0$:</p>

<div class="calc-formula"><div class="formula-label">ADIM 1 — BAŞLANGIÇ</div><div class="formula-main">$$ax^2 + bx + c = 0$$</div></div>

<p class="l-text">Baş katsayıyı $1$ yapmak için her terimi $a$'ya bölün. Bu önemli ilk hamledir: kareyi tamamlama numarası bunu gerektirir.</p>

<div class="calc-formula"><div class="formula-label">ADIM 2 — $a$'YA BÖL</div><div class="formula-main">$$x^2 + \\frac{b}{a} x + \\frac{c}{a} = 0$$</div></div>

<p class="l-text">Sabit terimi sağ tarafa taşıyın:</p>

<div class="calc-formula"><div class="formula-label">ADIM 3 — SABİTİ TAŞI</div><div class="formula-main">$$x^2 + \\frac{b}{a} x = -\\frac{c}{a}$$</div></div>

<p class="l-text">Şimdi kareyi tamamlayın. $b/a$'nın yarısı $b/(2a)$; karesi $b^2/(4a^2)$. Bunu iki tarafa da ekleyin:</p>

<div class="calc-formula"><div class="formula-label">ADIM 4 — TAMAMLAMAYI EKLE</div><div class="formula-main">$$x^2 + \\frac{b}{a} x + \\frac{b^2}{4a^2} = \\frac{b^2}{4a^2} - \\frac{c}{a}$$</div></div>

<p class="l-text">Sol taraf artık tam karedir. Sağ tarafın ortak paydaya $4a^2$ ihtiyacı var:</p>

<div class="calc-formula"><div class="formula-label">ADIM 5 — SOL TARAFI ÇARPANLA, SAĞ TARAFI BİRLEŞTİR</div><div class="formula-main">$$\\left( x + \\frac{b}{2a} \\right)^2 = \\frac{b^2 - 4ac}{4a^2}$$</div></div>

<p class="l-text">İki tarafın da karekökünü alın. Hem pozitif hem negatif karekök aynı kareyi ürettiği için $\\pm$ ortaya çıkar:</p>

<div class="calc-formula"><div class="formula-label">ADIM 6 — KAREKÖK</div><div class="formula-main">$$x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$$</div></div>

<p class="l-text">$b/(2a)$'yı iki taraftan çıkararak $x$'i yalnız bırakın:</p>

<div class="calc-formula"><div class="formula-label">ADIM 7 — KARESEL FORMÜL</div><div class="formula-main">$$\\boxed{\\; x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\;}$$</div><div class="formula-sub">$ax^2 + bx + c = 0$ üzerinde kareyi tamamlayarak türetildi. Bu formülü ezberleyin. Her ikinci derece denklemi çözer.</div></div>

<div class="l-note"><strong>Belleğe yardım:</strong> "eksi $b$, artı veya eksi $b$ kare eksi dört-$a$-$c$'nin karekökü, hepsi iki-$a$ üzeri" diye okuyun. Birkaç kez sesli söyleyin. Sınavda ikinci derece denklemden puan kaybeden öğrencilerin çoğu bir işareti yanlış hatırlar veya $\\pm$'i unutur — asla formülün yapısını değil.</div>

<h2 class="lesson-title">6. Karesel Formülü Kullanma</h2>

<div class="calc-highlight"><strong>Tarif mekaniktir.</strong> Standart formdaki denklemden $a$, $b$, $c$ değerlerini belirleyin, formüle yerleştirin ve sadeleştirin. Hareketler otomatik olana kadar üç örnekte pratik yapın.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — İKİ RASYONEL KÖK</div><div class="example-body">$2x^2 - 7x + 3 = 0$ denklemini karesel formülle çözün.<br><br>$a = 2, \\, b = -7, \\, c = 3$.<br>Diskriminant: $b^2 - 4ac = 49 - 24 = 25$. Karekök: $\\sqrt{25} = 5$.<br>$x = \\dfrac{7 \\pm 5}{4}$.<br>$x_1 = \\dfrac{7 + 5}{4} = 3$, $\\quad x_2 = \\dfrac{7 - 5}{4} = \\dfrac{1}{2}$.<br><br>Kökler: $\\{3, 1/2\\}$. 3. bölümdeki çarpanlara ayırma sonucuyla eşleşiyor.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — İRRASYONEL KÖKLER</div><div class="example-body">$x^2 - 3x + 1 = 0$ denklemini çözün.<br><br>$a = 1, \\, b = -3, \\, c = 1$.<br>$\\Delta = 9 - 4 = 5$. $\\sqrt{5}$ sadeleşmiyor.<br>$x = \\dfrac{3 \\pm \\sqrt{5}}{2}$.<br><br>Ondalık: $x_1 \\approx \\dfrac{3 + 2.236}{2} \\approx 2.618$, $\\quad x_2 \\approx \\dfrac{3 - 2.236}{2} \\approx 0.382$.<br><br>Bunlar altın oran ve onun eşleniğidir — ünlü bir çift.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — NEGATİF BAŞ KATSAYI</div><div class="example-body">$-x^2 + 4x + 5 = 0$ denklemini çözün.<br><br>Ya önce her tarafı $-1$ ile çarpın ($x^2 - 4x - 5 = 0$) ya da formülü doğrudan $a = -1$ ile uygulayın. İkisi de aynı cevabı verir.<br><br>$a = -1, b = 4, c = 5$ ile: $\\Delta = 16 - 4(-1)(5) = 16 + 20 = 36$, $\\sqrt{36} = 6$.<br>$x = \\dfrac{-4 \\pm 6}{-2}$.<br>$x_1 = \\dfrac{-4 + 6}{-2} = -1$, $\\quad x_2 = \\dfrac{-4 - 6}{-2} = 5$.<br><br>Kökler: $\\{-1, 5\\}$.</div></div>

<div class="think-box"><div class="think-label">YAYGIN HATA</div><div class="think-body">Birçok öğrenci formülde paydanın sadece $2$ değil $2a$ olduğunu unutur. $a = 3$ ise payda $6$'dır, $2$ değil. Bu adımı her seferinde iki kez kontrol edin.</div></div>

<h2 class="lesson-title">7. Diskriminant $\\Delta = b^2 - 4ac$</h2>

<div class="calc-highlight"><strong>Karekökün altındaki ifadenin kendi adı vardır.</strong> $b^2 - 4ac$'ye ikinci derece denklemin <em>diskriminant</em>ı diyoruz ve büyük Yunan harfi delta ile yazıyoruz: $\\Delta = b^2 - 4ac$. İşareti, hesaplamadan önce kökler hakkında her şeyi söyler.</div>

<div class="calc-formula"><div class="formula-label">DİSKRİMİNANT — TANIM</div><div class="formula-main">$$\\Delta = b^2 - 4ac$$</div><div class="formula-sub">$ax^2 + bx + c = 0$ denkleminin köklerini sınıflandıran tek bir sayı.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\Delta > 0$ — iki farklı reel kök</div><div class="card-body">Formüldeki karekök pozitif bir reel sayıdır. $\\pm$ iki farklı değer üretir. Grafiksel olarak: parabol x-eksenini iki noktada keser.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta = 0$ — bir çift (katlı) reel kök</div><div class="card-body">Karekök sıfırdır, yani $\\pm$ aynı değeri iki kez verir. Tek kök $x = -b/(2a)$'dır. Grafiksel olarak: parabol x-eksenine tepe noktasında sadece dokunur.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta < 0$ — reel kök yok</div><div class="card-body">Negatif bir sayının karekökü reel değildir. Denklemin reel sayılarda çözümü yoktur. Grafiksel olarak: parabol tamamen x-ekseninin üstünde veya altındadır. (Karmaşık kökler vardır — 9. bölüme bakın.)</div></div>
</div>

<div class="calc-graph"><div id="plot-l54-discriminant-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> her diskriminant rejiminde bir tane olmak üzere yukarı açılan üç parabol. Mavi ($\\Delta > 0$) x-eksenini iki kez keser. Sarı ($\\Delta = 0$) tam olarak bir noktada dokunur. Kırmızı ($\\Delta < 0$) x-eksenine hiç değmez. $\\Delta$'nın işareti geometriyi önceden söyler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xx=[];for(var i=-50;i<=50;i++)xx.push(i/10);
var y1=xx.map(function(x){return x*x-4;});
var y2=xx.map(function(x){return x*x;});
var y3=xx.map(function(x){return x*x+2;});
var t1={x:xx,y:y1,mode:'lines',name:'Δ > 0: x² − 4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xx,y:y2,mode:'lines',name:'Δ = 0: x²',line:{color:'#f59e0b',width:2.5}};
var t3={x:xx,y:y3,mode:'lines',name:'Δ < 0: x² + 2',line:{color:'#ef4444',width:2.5}};
var ax0={x:[-5,5],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var roots={x:[-2,2,0],y:[0,0,0],mode:'markers',name:'kökler',marker:{color:'#e8e8e8',size:9,symbol:'circle'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-5,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l54-discriminant-tr',[t1,t2,t3,ax0,roots],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÖNCE DİSKRİMİNANT, SONRA KÖKLER</div><div class="example-body">Çözmeden, her denklemin köklerini sınıflandırın:<br><br>(i) $x^2 - 6x + 5 = 0$: $\\Delta = 36 - 20 = 16 > 0$. İki farklı reel kök.<br>(ii) $x^2 - 4x + 4 = 0$: $\\Delta = 16 - 16 = 0$. Bir çift reel kök.<br>(iii) $x^2 + x + 1 = 0$: $\\Delta = 1 - 4 = -3 < 0$. Reel kök yok.<br><br>Şimdi yalnızca reel kökü olanları çözün:<br>(i) $x = \\dfrac{6 \\pm 4}{2}$, yani $x = 5$ veya $x = 1$.<br>(ii) $x = \\dfrac{4 \\pm 0}{2} = 2$ (çift kök).<br>(iii) Sadece karmaşık kökler — 9. bölüme bakın.</div></div>

<div class="l-note"><strong>Sınav stratejisi:</strong> "denklem hangi $k$ değerleri için iki reel köke sahiptir?" diye soran çoktan seçmeli problemlerde neredeyse her zaman $\\Delta > 0$ kurar ve $k$ için bir eşitsizlik çözersiniz. Diskriminant, soruyu çözülebilir bir cebir problemine çevirir.</div>

<div class="calc-example"><div class="example-label">PARAMETRE PROBLEMİ</div><div class="example-body">$x^2 - 4x + k = 0$ denklemi hangi $k$ değerleri için iki farklı reel köke sahiptir?<br><br>$\\Delta = 16 - 4k > 0$, yani $k < 4$.<br><br>Çift kök için: $k = 4$. Reel kök olmaması için: $k > 4$.</div></div>

<h2 class="lesson-title">8. Çözümlü Örnekler — Her Diskriminant Türünden</h2>

<div class="calc-highlight"><strong>Üç tam çözümlü örnek, her diskriminant rejiminden biri.</strong> Adımları dikkatle izleyin — bu, her ikinci derece denklem probleminde yeniden üretmeniz gereken kalıptır.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK A — $\\Delta > 0$ (İKİ REEL KÖK)</div><div class="example-body"><strong>Denklem:</strong> $3x^2 - 5x - 2 = 0$.<br><br><em>Adım 1 — katsayılar.</em> $a = 3, b = -5, c = -2$.<br><em>Adım 2 — diskriminant.</em> $\\Delta = (-5)^2 - 4(3)(-2) = 25 + 24 = 49$. $\\Delta > 0$ olduğundan iki farklı reel kök.<br><em>Adım 3 — karekök.</em> $\\sqrt{49} = 7$.<br><em>Adım 4 — formülü uygula.</em> $x = \\dfrac{5 \\pm 7}{6}$.<br><em>Adım 5 — iki kök.</em> $x_1 = \\dfrac{12}{6} = 2$, $\\quad x_2 = \\dfrac{-2}{6} = -\\dfrac{1}{3}$.<br><em>Adım 6 — doğrulama.</em> $3(2)^2 - 5(2) - 2 = 12 - 10 - 2 = 0$ ✓ ve $3(-1/3)^2 - 5(-1/3) - 2 = 1/3 + 5/3 - 2 = 0$ ✓.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK B — $\\Delta = 0$ (BİR ÇİFT KÖK)</div><div class="example-body"><strong>Denklem:</strong> $9x^2 - 12x + 4 = 0$.<br><br><em>Adım 1 — katsayılar.</em> $a = 9, b = -12, c = 4$.<br><em>Adım 2 — diskriminant.</em> $\\Delta = (-12)^2 - 4(9)(4) = 144 - 144 = 0$. $\\Delta = 0$ olduğundan bir katlı kök.<br><em>Adım 3 — karekök.</em> $\\sqrt{0} = 0$.<br><em>Adım 4 — formülü uygula.</em> $x = \\dfrac{12 \\pm 0}{18} = \\dfrac{12}{18} = \\dfrac{2}{3}$.<br><em>Adım 5 — yorum.</em> $\\pm$'in iki dalı da aynı değeri verir: $x = 2/3$ katlılığı 2 olarak.<br><em>Adım 6 — doğrulama.</em> $9(2/3)^2 - 12(2/3) + 4 = 9 \\cdot 4/9 - 8 + 4 = 4 - 8 + 4 = 0$ ✓.<br><em>Not:</em> $9x^2 - 12x + 4 = (3x - 2)^2$ — tam kare. Bu, $\\Delta = 0$'ın cebirsel imzasıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK C — $\\Delta < 0$ (REEL KÖK YOK)</div><div class="example-body"><strong>Denklem:</strong> $x^2 + 2x + 5 = 0$.<br><br><em>Adım 1 — katsayılar.</em> $a = 1, b = 2, c = 5$.<br><em>Adım 2 — diskriminant.</em> $\\Delta = 4 - 20 = -16$. $\\Delta < 0$ olduğundan reel kök yok.<br><em>Adım 3 — biçimsel çözüm.</em> $x = \\dfrac{-2 \\pm \\sqrt{-16}}{2}$.<br><em>Adım 4 — reeller üzerinde.</em> Hiçbir reel sayı bu denklemi çözmez. $\\mathbb{R}$'deki çözüm kümesi: $\\emptyset$.<br><em>Adım 5 — karmaşık sayılar üzerinde (sonraki bölüm).</em> $\\sqrt{-16} = 4i$, yani $x = -1 \\pm 2i$. İki karmaşık eşlenik kök.</div></div>

<h2 class="lesson-title">9. Karmaşık Kökler: $\\Delta < 0$ Durumu</h2>

<div class="calc-highlight"><strong>Diskriminant negatif olduğunda formül bizden negatif bir sayının karekökünü almamızı ister.</strong> Reel sayılar bunu yapamaz. Bu çıkmazdan kurtulmak için matematikçiler $i$ ile gösterilen ve $i^2 = -1$ ile tanımlanan <em>sanal birim</em> adında yeni bir sayı icat ettiler. $i$ elimizdeyken her ikinci derece denklemin tam olarak iki kökü vardır — sadece <em>karmaşık sayıların</em> daha geniş dünyasında yaşarlar.</div>

<div class="calc-formula"><div class="formula-label">SANAL BİRİM</div><div class="formula-main">$$i^2 = -1 \\qquad\\Longleftrightarrow\\qquad i = \\sqrt{-1}$$</div><div class="formula-sub">Karesi negatif olan bir sayı. Tanım gereği belirlenmiş, sonra sayı sistemini genişletmek için kullanılır.</div></div>

<p class="l-text">Bir <strong>karmaşık sayı</strong>, $a$ ve $b$ reel sayılar olmak üzere $a + bi$ biçimindeki herhangi bir şeydir. $a$ <em>reel kısım</em>dır, $bi$ <em>sanal kısım</em>dır. $b = 0$ olduğunda sayı reeldir; $a = 0$ ve $b \\neq 0$ olduğunda saf sanaldır; aksi halde genel bir karmaşık sayıdır.</p>

<p class="l-text">Negatif bir sayının karekökünü almak için negatif işareti dışarı çıkarın:</p>

<div class="calc-formula"><div class="formula-label">NEGATİF BİR SAYININ KAREKÖKÜ</div><div class="formula-main">$$\\sqrt{-N} \\;=\\; \\sqrt{N} \\cdot \\sqrt{-1} \\;=\\; i\\sqrt{N}, \\qquad N > 0$$</div><div class="formula-sub">Örnekler: $\\sqrt{-9} = 3i$, $\\sqrt{-16} = 4i$, $\\sqrt{-7} = i\\sqrt{7}$.</div></div>

<div class="calc-example"><div class="example-label">8. BÖLÜMDEKİ ÖRNEK C'Yİ TAMAMLAMA</div><div class="example-body">$x^2 + 2x + 5 = 0$, $\\Delta = -16$.<br><br>$\\sqrt{-16} = 4i$.<br>$x = \\dfrac{-2 \\pm 4i}{2} = -1 \\pm 2i$.<br><br>İki karmaşık kök: $x_1 = -1 + 2i$ ve $x_2 = -1 - 2i$. Birbirlerinin <em>karmaşık eşlenikleri</em>dir — aynı reel kısım, zıt sanal kısım.</div></div>

<div class="calc-example"><div class="example-label">BİR BAŞKA KARMAŞIK KÖK ÖRNEĞİ</div><div class="example-body">$2x^2 + x + 3 = 0$ denklemini çözün.<br><br>$a = 2, b = 1, c = 3$. $\\Delta = 1 - 24 = -23$.<br>$\\sqrt{-23} = i\\sqrt{23}$.<br>$x = \\dfrac{-1 \\pm i\\sqrt{23}}{4}$.<br><br>Reel kısım: $-1/4$. Sanal kısım: $\\pm \\sqrt{23}/4$.</div></div>

<div class="l-note"><strong>Bu neden önemli:</strong> fizikte (salınımlı devreler, kuantum mekaniği), mühendislikte (kontrol sistemleri, sinyal işleme), saf matematikte (cebrin temel teoremi) ve geometride (düzlemde dönmeler), karmaşık sayılar bir merak konusu değil — doğru dildir. Karesel formül onlara açılan kapıydı: matematikçiler 16. yüzyılda üçüncü derece denklemleri çözerken $\\sqrt{-1}$'den kaçınamadılar ve karmaşık analiz oradan büyüdü.</div>

<div class="think-box"><div class="think-label">KARMAŞIK EŞLENİK EŞLEŞMESİ</div><div class="think-body">Reel katsayılı bir ikinci derece denklem (diskriminantı negatif olan), her zaman birbirinin eşleniği olan bir <em>çift</em> karmaşık kök üretir: $p + qi$ ve $p - qi$. Asla ayrı ayrı olmazlar; biri olmadan diğeri olamaz. Bu, formüldeki $\\pm$'ten ve $\\sqrt{\\text{negatif}}$'in sanal bir sayı üretmesinden kaynaklanan bir sonuçtur.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<div class="calc-highlight"><strong>Bu dersteki her tekniği kapsayan sekiz problem.</strong> Çözümü okumadan önce her birini kâğıt üzerinde deneyin. En verimli yöntemi kullanın (önce çarpanlara ayırma bariz ise, aksi halde karesel formül).</div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">$x^2 - 9x + 14 = 0$ denklemini çözün.<br><br><strong>Çözüm.</strong> Çarpanlara ayır: toplamı $9$, çarpımı $14$ olan iki sayı &rarr; $2$ ve $7$. O halde $(x - 2)(x - 7) = 0$, $x = 2$ veya $x = 7$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">$x^2 + 5x - 6 = 0$ denklemini çözün.<br><br><strong>Çözüm.</strong> Toplamı $-5$, çarpımı $-6$ olan iki sayı &rarr; $-6$ ve $1$. O halde $(x + 6)(x - 1) = 0$, $x = -6$ veya $x = 1$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body">$4x^2 - 4x + 1 = 0$ denklemini çözün.<br><br><strong>Çözüm.</strong> $\\Delta = 16 - 16 = 0$, çift kök. $x = 4/8 = 1/2$. Dikkat: $4x^2 - 4x + 1 = (2x - 1)^2$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">$x^2 - 2x - 4 = 0$ denklemini çözün.<br><br><strong>Çözüm.</strong> $\\Delta = 4 + 16 = 20$. $\\sqrt{20} = 2\\sqrt{5}$. $x = \\dfrac{2 \\pm 2\\sqrt{5}}{2} = 1 \\pm \\sqrt{5}$. Ondalık: $x \\approx 3.236$ veya $x \\approx -1.236$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body">$3x^2 + 2x + 1 = 0$ denklemini çözün.<br><br><strong>Çözüm.</strong> $\\Delta = 4 - 12 = -8 < 0$. Reel kök yok. Karmaşık: $x = \\dfrac{-2 \\pm i\\sqrt{8}}{6} = \\dfrac{-1 \\pm i\\sqrt{2}}{3}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — PARAMETRE</div><div class="example-body">$x^2 - (m + 2) x + m = 0$ denklemi hangi $m$ değerleri için bir çift köke sahip olur?<br><br><strong>Çözüm.</strong> $\\Delta = (m + 2)^2 - 4m = m^2 + 4m + 4 - 4m = m^2 + 4 = 0$. Ancak $m^2 + 4$ her zaman pozitiftir, yani $\\Delta = 0$ imkânsızdır. Denklem her zaman iki farklı reel köke sahiptir, asla çift köke değil.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — SÖZEL PROBLEM</div><div class="example-body">Dikdörtgen bir bahçenin alanı $40$ m² ve çevresi $26$ m'dir. Boyutlarını bulun.<br><br><strong>Çözüm.</strong> Uzunluk $= L$, genişlik $= W$ olsun. O halde $2L + 2W = 26 \\Rightarrow L + W = 13$ ve $LW = 40$.<br>Demek ki $L$ ve $W$, $x^2 - 13x + 40 = 0$ denkleminin iki köküdür.<br>$\\Delta = 169 - 160 = 9$, $\\sqrt{9} = 3$. $x = \\dfrac{13 \\pm 3}{2}$. $x = 8$ veya $x = 5$.<br>Boyutlar: $\\mathbf{8 \\text{ m} \\times 5 \\text{ m}}$. Doğrulama: $8 + 5 = 13$ ✓, $8 \\cdot 5 = 40$ ✓.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 — DİK ATIŞ</div><div class="example-body">Bir top, $1.5$ m yükseklikten $14$ m/s başlangıç hızıyla yukarı doğru atılıyor. $t$ saniye sonra metre cinsinden yüksekliği $h(t) = -5 t^2 + 14 t + 1.5$'tir. Yere ne zaman çarpar?<br><br><strong>Çözüm.</strong> $h(t) = 0$ koyun: $-5 t^2 + 14 t + 1.5 = 0$ ya da $5 t^2 - 14 t - 1.5 = 0$.<br>$a = 5, b = -14, c = -1.5$. $\\Delta = 196 + 30 = 226$. $\\sqrt{226} \\approx 15.033$.<br>$t = \\dfrac{14 \\pm 15.033}{10}$. Pozitif kök: $t \\approx \\dfrac{29.033}{10} \\approx \\mathbf{2.90}$ saniye.<br>(Diğer kök $t \\approx -0.10$ s negatiftir — atıştan önce — bu yüzden onu reddederiz.)</div></div>

<div class="calc-graph"><div id="plot-l54-parabolas-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $a$'nın işaretinin etkisini gösteren iki parabol. $a > 0$ olduğunda (mavi) parabol yukarı açılır ve minimumu vardır. $a < 0$ olduğunda (kırmızı) aşağı açılır ve maksimumu vardır. Diskriminant, herhangi birinin x-eksenini kesip kesmediğini söyler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xx=[];for(var i=-50;i<=50;i++)xx.push(i/10);
var yp=xx.map(function(x){return x*x-2*x-3;});
var yn=xx.map(function(x){return -1*x*x+2*x+3;});
var tp={x:xx,y:yp,mode:'lines',name:'a > 0: x² − 2x − 3',line:{color:'#3b82f6',width:2.5}};
var tn={x:xx,y:yn,mode:'lines',name:'a < 0: −x² + 2x + 3',line:{color:'#ef4444',width:2.5}};
var ax0={x:[-5,5],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l54-parabolas-tr',[tp,tn,ax0],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ÖZET</div><div class="think-body">Bir $ax^2 + bx + c = 0$ ikinci derece denkleminin kökleri $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$'dır. Önce diskriminantı $\\Delta = b^2 - 4ac$ hesaplayın: pozitif iki reel kök, sıfır bir çift kök, negatif bir çift karmaşık eşlenik kök anlamına gelir. Çarpanlara ayırma işe yaradığında daha hızlıdır; karesel formül her zaman çalışır.</div></div>

<p class="l-text">Sonraki derste, ikinci derece fonksiyonların <em>grafiklerini</em> daha ayrıntılı inceleyeceğiz — tepe noktası, simetri ekseni, dönüşümler — ve diskriminant hakkında öğrendiklerimizi kullanarak herhangi bir parabolün geometrisini bir bakışta okuyacağız.</p>`

};
