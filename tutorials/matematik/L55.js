window.LISE_MAT_L55 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Lesson 55: Vieta's Formulas and the Structure of Quadratic Roots.</strong> In Lesson 54 we used the quadratic formula to <em>compute</em> the two roots of $ax^2 + bx + c = 0$. That formula is the workhorse, but it is not the whole story. There is a much deeper observation hiding in the equation: even <em>without solving</em>, we can read off the sum of the roots and the product of the roots straight from the coefficients $a$, $b$, $c$. This is Vieta's discovery, and it turns the relationship between an equation and its solutions into a two-way street.</p>

<p class="l-text">Once you internalise Vieta's two short identities, a long list of problems becomes nearly instant: "find an equation whose roots are 3 and &minus;5," "compute $x_1^2 + x_2^2$ without solving," "determine for which $m$ both roots are positive," "given that the roots differ by 4, find the missing coefficient." All of these collapse to plugging numbers into $-b/a$ and $c/a$. This lesson teaches the formulas, proves them, then applies them across seven sections and a closing exercise set.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State Vieta's formulas for a quadratic: $x_1 + x_2 = -b/a$ and $x_1 \\cdot x_2 = c/a$</li>
<li>Derive Vieta's formulas from the quadratic formula in one line of algebra</li>
<li>Construct the quadratic equation whose roots are two given numbers using $x^2 - sx + p = 0$</li>
<li>Compute symmetric expressions in the roots ($x_1^2 + x_2^2$, $1/x_1 + 1/x_2$, $x_1^3 + x_2^3$, $|x_1 - x_2|$) without solving the equation</li>
<li>Determine the <em>sign structure</em> of the two roots (both positive, both negative, opposite signs) from the signs of $-b/a$ and $c/a$ together with the discriminant</li>
<li>Apply Vieta-style relations to a cubic $a_3 x^3 + a_2 x^2 + a_1 x + a_0 = 0$ for problems where all three roots appear symmetrically</li>
</ul>
</div>

<h2 class="lesson-title">1. Vieta's Formulas: The Statement</h2>

<div class="calc-highlight"><strong>The result in one line:</strong> if $x_1$ and $x_2$ are the two roots of $ax^2 + bx + c = 0$ (with $a \\neq 0$), then their <em>sum</em> equals $-b/a$ and their <em>product</em> equals $c/a$. No square roots, no discriminant, no case analysis &mdash; just a ratio of the coefficients you can already see.</div>

<p class="l-text">This is the centrepiece of the lesson. Every later section will be an application of these two short identities. Memorise them now, before the proof:</p>

<div class="calc-formula"><div class="formula-label">VIETA'S FORMULAS &mdash; QUADRATIC CASE</div><div class="formula-main">$$x_1 + x_2 \\;=\\; -\\frac{b}{a} \\qquad\\qquad x_1 \\cdot x_2 \\;=\\; \\frac{c}{a}$$</div><div class="formula-sub">For the equation $ax^2 + bx + c = 0$ with roots $x_1$ and $x_2$. The two real roots may coincide ($x_1 = x_2$) or be a pair of complex conjugates &mdash; the identities hold in every case.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sum of roots</div><div class="card-body">$S = x_1 + x_2 = -b/a$. The leading coefficient $a$ goes in the denominator; the linear coefficient $b$ goes in the numerator with a <em>minus sign</em>. The minus is the part beginners forget most often.</div></div>
<div class="calc-card"><div class="card-title">Product of roots</div><div class="card-body">$P = x_1 \\cdot x_2 = c/a$. The constant term $c$ on top, the leading coefficient $a$ on the bottom. No sign flip here.</div></div>
<div class="calc-card"><div class="card-title">Special case $a = 1$</div><div class="card-body">When the leading coefficient is 1 (a <em>monic</em> quadratic), the formulas simplify to $S = -b$ and $P = c$. Most textbook problems use this form.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK NUMERICAL CHECK</div><div class="example-body">Take $x^2 - 5x + 6 = 0$. The roots factor as $(x-2)(x-3) = 0$, so $x_1 = 2$ and $x_2 = 3$.<br><br>Sum: $2 + 3 = 5$ and $-b/a = -(-5)/1 = 5$. <strong>Match.</strong><br>Product: $2 \\cdot 3 = 6$ and $c/a = 6/1 = 6$. <strong>Match.</strong><br><br>Both Vieta formulas verified without using the quadratic formula at all.</div></div>

<div class="l-note"><strong>Why this is powerful:</strong> the quadratic formula gives you the two roots <em>individually</em>. Vieta gives you two <em>combinations</em> of the roots. Many problems in trigonometry, geometry, and physics depend only on the sum or the product of the roots, not on the roots separately &mdash; and in those cases Vieta saves a great deal of work.</div>

<h2 class="lesson-title">2. Proof of Vieta's Formulas</h2>

<div class="calc-highlight"><strong>The proof takes three lines.</strong> Write down the two roots from the quadratic formula, add them, multiply them, and simplify. The square-root terms cancel beautifully.</div>

<p class="l-text">Recall the quadratic formula from Lesson 54:</p>

<div class="calc-formula"><div class="formula-label">THE TWO ROOTS</div><div class="formula-main">$$x_1 \\;=\\; \\frac{-b + \\sqrt{\\Delta}}{2a} \\qquad x_2 \\;=\\; \\frac{-b - \\sqrt{\\Delta}}{2a} \\qquad\\text{where}\\qquad \\Delta = b^2 - 4ac$$</div></div>

<p class="l-text"><strong>Step 1 &mdash; add them.</strong> The square roots have opposite signs, so they cancel:</p>

<div class="calc-formula"><div class="formula-label">SUM</div><div class="formula-main">$$x_1 + x_2 \\;=\\; \\frac{(-b + \\sqrt{\\Delta}) + (-b - \\sqrt{\\Delta})}{2a} \\;=\\; \\frac{-2b}{2a} \\;=\\; -\\frac{b}{a}$$</div></div>

<p class="l-text"><strong>Step 2 &mdash; multiply them.</strong> Use the difference-of-squares identity $(u + v)(u - v) = u^2 - v^2$:</p>

<div class="calc-formula"><div class="formula-label">PRODUCT</div><div class="formula-main">$$x_1 \\cdot x_2 \\;=\\; \\frac{(-b + \\sqrt{\\Delta})(-b - \\sqrt{\\Delta})}{(2a)(2a)} \\;=\\; \\frac{(-b)^2 - (\\sqrt{\\Delta})^2}{4a^2} \\;=\\; \\frac{b^2 - \\Delta}{4a^2}$$</div></div>

<p class="l-text"><strong>Step 3 &mdash; simplify.</strong> Substitute $\\Delta = b^2 - 4ac$, so the numerator becomes $b^2 - (b^2 - 4ac) = 4ac$:</p>

<div class="calc-formula"><div class="formula-label">PRODUCT (FINISHED)</div><div class="formula-main">$$x_1 \\cdot x_2 \\;=\\; \\frac{4ac}{4a^2} \\;=\\; \\frac{c}{a}$$</div></div>

<p class="l-text">Both identities proved. The argument never depended on whether $\\Delta$ was positive, zero, or negative, so Vieta's formulas hold for real <em>and</em> complex roots without any change.</p>

<div class="calc-highlight"><strong>An alternative proof &mdash; factoring.</strong> If $x_1$ and $x_2$ are the roots, then the quadratic factors as $a(x - x_1)(x - x_2) = 0$. Expand the right side: $a(x^2 - (x_1 + x_2)x + x_1 x_2) = ax^2 - a(x_1+x_2)x + a \\, x_1 x_2$. Match this term-by-term against $ax^2 + bx + c$:</div>

<div class="calc-formula"><div class="formula-label">MATCHING COEFFICIENTS</div><div class="formula-main">$$-a(x_1 + x_2) = b \\;\\;\\Rightarrow\\;\\; x_1 + x_2 = -\\frac{b}{a} \\qquad a \\, x_1 x_2 = c \\;\\;\\Rightarrow\\;\\; x_1 x_2 = \\frac{c}{a}$$</div><div class="formula-sub">This second proof is the one to remember &mdash; it generalises cleanly to cubics, quartics, and any higher degree (we will use it in Section 8).</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">For $2x^2 - 7x + 3 = 0$, compute $S$ and $P$ from Vieta. Then solve with the quadratic formula and check directly. Answer: $S = 7/2$, $P = 3/2$. Roots: $x = (7 \\pm 5)/4$, i.e. 3 and $1/2$. Indeed $3 + 1/2 = 7/2$ and $3 \\cdot 1/2 = 3/2$. Confirmed.</div></div>

<h2 class="lesson-title">3. Constructing a Quadratic from Its Roots</h2>

<div class="calc-highlight"><strong>Vieta in reverse.</strong> If someone hands you the two roots and asks for a quadratic equation that has them, you do not need to multiply $(x - x_1)(x - x_2)$ out by hand &mdash; just plug into Vieta and write down a single line.</div>

<p class="l-text">Take any two numbers $x_1$ and $x_2$. The monic quadratic whose roots are exactly those two numbers is:</p>

<div class="calc-formula"><div class="formula-label">QUADRATIC FROM ROOTS &mdash; THE GOLDEN FORMULA</div><div class="formula-main">$$x^2 - (x_1 + x_2)\\,x + (x_1 \\cdot x_2) \\;=\\; 0 \\qquad\\Longleftrightarrow\\qquad x^2 - S\\,x + P \\;=\\; 0$$</div><div class="formula-sub">where $S = x_1 + x_2$ is the sum and $P = x_1 \\cdot x_2$ is the product. Sign of $S$: <em>minus</em>. Sign of $P$: <em>plus</em>. Almost the entire lesson reduces to this one identity.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; from the roots themselves</div><div class="example-body">Construct the quadratic equation whose roots are $x_1 = 4$ and $x_2 = -7$.<br><br>$S = 4 + (-7) = -3$.<br>$P = 4 \\cdot (-7) = -28$.<br><br>Plug into $x^2 - Sx + P = 0$: <strong>$x^2 - (-3)x + (-28) = x^2 + 3x - 28 = 0$.</strong><br><br>Verification: factor as $(x + 7)(x - 4) = 0$, which gives $x = -7$ and $x = 4$. Correct.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; from sum and product</div><div class="example-body">A quadratic has root-sum 5 and root-product 6. Write the equation.<br><br>Direct substitution: <strong>$x^2 - 5x + 6 = 0$.</strong><br><br>(The roots, if you want them, are 2 and 3 &mdash; but the problem asked only for the equation.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; irrational roots</div><div class="example-body">Construct the quadratic whose roots are $x_1 = 2 + \\sqrt{3}$ and $x_2 = 2 - \\sqrt{3}$.<br><br>$S = (2 + \\sqrt{3}) + (2 - \\sqrt{3}) = 4$ &mdash; the irrational parts cancel.<br>$P = (2 + \\sqrt{3})(2 - \\sqrt{3}) = 4 - 3 = 1$ &mdash; using difference of squares.<br><br>Equation: <strong>$x^2 - 4x + 1 = 0$.</strong> All coefficients rational, even though the roots are irrational. This is a feature, not a coincidence: conjugate surd roots always produce integer (or rational) coefficients.</div></div>

<div class="l-note"><strong>Non-monic version.</strong> If the leading coefficient $a$ matters (for example you want integer coefficients without a leading 1), multiply through: $a\\bigl(x^2 - Sx + P\\bigr) = ax^2 - aSx + aP = 0$. For instance, roots $1/2$ and $3$ give $S = 7/2$, $P = 3/2$; the monic form $x^2 - \\tfrac{7}{2}x + \\tfrac{3}{2} = 0$ multiplied by 2 yields the cleaner $2x^2 - 7x + 3 = 0$.</div>

<h2 class="lesson-title">4. Simplifying Expressions in the Roots</h2>

<div class="calc-highlight"><strong>The trick is to write the expression in terms of $S$ and $P$ only.</strong> Anything <em>symmetric</em> in the two roots (i.e. it does not change when you swap $x_1 \\leftrightarrow x_2$) can be rewritten using $S$ and $P$, and then read off directly from the coefficients.</div>

<p class="l-text">The most important example is the sum of squares:</p>

<div class="calc-formula"><div class="formula-label">SUM OF SQUARES OF THE ROOTS</div><div class="formula-main">$$x_1^2 + x_2^2 \\;=\\; (x_1 + x_2)^2 - 2 x_1 x_2 \\;=\\; S^2 - 2P$$</div><div class="formula-sub">Derivation: $(x_1 + x_2)^2 = x_1^2 + 2 x_1 x_2 + x_2^2$, so $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2 x_1 x_2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">For $x^2 - 6x + 4 = 0$, find $x_1^2 + x_2^2$ <em>without solving the equation</em>.<br><br>From Vieta: $S = -(-6)/1 = 6$ and $P = 4/1 = 4$.<br><br>$x_1^2 + x_2^2 = S^2 - 2P = 36 - 8 = \\mathbf{28}$.<br><br>(Verification: roots are $3 \\pm \\sqrt{5}$. Squares: $14 + 6\\sqrt{5}$ and $14 - 6\\sqrt{5}$. Sum: 28. Match.)</div></div>

<p class="l-text"><strong>Why this matters.</strong> The expression $x_1^2 + x_2^2$ is everywhere: it appears in physics (energy of two oscillators), in geometry (sum of squared distances), in optimisation (variance). With Vieta, it costs one subtraction. Without Vieta, you would have to solve the quadratic, square each root, and add &mdash; far more work, and the algebra fails when the roots are irrational.</p>

<div class="think-box"><div class="think-label">QUICK PATTERN</div><div class="think-body">Whenever an expression contains $x_1$ and $x_2$ and stays the same when you swap them, you can write it in terms of $S$ and $P$. Try it on these: (a) $x_1^2 \\cdot x_2 + x_1 \\cdot x_2^2$. (b) $(x_1 + 1)(x_2 + 1)$. (c) $x_1^2 \\cdot x_2^2$.<br><br>Answers: (a) $x_1 x_2 (x_1 + x_2) = P \\cdot S$. (b) $x_1 x_2 + x_1 + x_2 + 1 = P + S + 1$. (c) $(x_1 x_2)^2 = P^2$.</div></div>

<h2 class="lesson-title">5. The Other Important Symmetric Expressions</h2>

<div class="calc-highlight">Beyond the sum of squares, four more combinations appear constantly in exam problems: the sum of reciprocals, the sum of cubes, the absolute difference of the roots, and the squared difference. Each one rewrites cleanly in terms of $S$ and $P$.</div>

<div class="calc-formula"><div class="formula-label">FIVE STANDARD SYMMETRIC IDENTITIES</div><div class="formula-main">$$\\begin{aligned} x_1^2 + x_2^2 &= S^2 - 2P \\\\ \\frac{1}{x_1} + \\frac{1}{x_2} &= \\frac{x_1 + x_2}{x_1 x_2} = \\frac{S}{P} \\\\ \\frac{1}{x_1^2} + \\frac{1}{x_2^2} &= \\frac{x_1^2 + x_2^2}{(x_1 x_2)^2} = \\frac{S^2 - 2P}{P^2} \\\\ x_1^3 + x_2^3 &= (x_1 + x_2)^3 - 3 x_1 x_2 (x_1 + x_2) = S^3 - 3PS \\\\ (x_1 - x_2)^2 &= (x_1 + x_2)^2 - 4 x_1 x_2 = S^2 - 4P \\;=\\; \\Delta / a^2 \\end{aligned}$$</div><div class="formula-sub">The last line connects Vieta back to the discriminant: the squared gap between the roots is exactly $\\Delta / a^2$. So $|x_1 - x_2| = \\sqrt{\\Delta}\\,/\\,|a|$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reciprocal sum</div><div class="card-body">$1/x_1 + 1/x_2 = S/P$. Direct from common-denominator arithmetic. Requires $P \\neq 0$ (no zero root).</div></div>
<div class="calc-card"><div class="card-title">Sum of cubes</div><div class="card-body">$x_1^3 + x_2^3 = S^3 - 3PS$. Derived from the algebraic identity $u^3 + v^3 = (u+v)^3 - 3uv(u+v)$.</div></div>
<div class="calc-card"><div class="card-title">Difference of roots</div><div class="card-body">$|x_1 - x_2| = \\sqrt{S^2 - 4P}$. The quantity under the square root is exactly $\\Delta/a^2$; this is why the discriminant measures "how far apart" the two roots sit.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; sum of cubes</div><div class="example-body">For $x^2 - 3x + 1 = 0$, compute $x_1^3 + x_2^3$ without solving.<br><br>$S = 3$, $P = 1$.<br>$x_1^3 + x_2^3 = S^3 - 3PS = 27 - 9 = \\mathbf{18}$.<br><br>(Check: roots are $(3 \\pm \\sqrt{5})/2$. Cubing each and summing gives 18. The Vieta route is dramatically shorter.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; absolute difference</div><div class="example-body">For $x^2 - 8x + 7 = 0$, find $|x_1 - x_2|$.<br><br>$S = 8$, $P = 7$, so $\\Delta = S^2 - 4P = 64 - 28 = 36$ (here $a = 1$, so $\\Delta/a^2 = \\Delta$).<br>$|x_1 - x_2| = \\sqrt{36} = \\mathbf{6}$.<br><br>(Verification: factor as $(x-1)(x-7)$, so roots are 1 and 7, difference 6. Correct.)</div></div>

<div class="l-note"><strong>The general principle:</strong> any rational function of the roots that is <em>symmetric</em> can be expressed in $S$ and $P$. This is a theorem from elementary algebra (the "fundamental theorem of symmetric polynomials"). For the purposes of a high-school exam, the five identities above cover virtually every problem you will meet.</div>

<h2 class="lesson-title">6. The Sign Structure of the Two Roots</h2>

<div class="calc-highlight"><strong>One of the most useful applications of Vieta:</strong> determining whether the two roots are positive, negative, of opposite signs, or zero &mdash; <em>without computing them</em>. The recipe uses three pieces of information: the sign of $S = -b/a$, the sign of $P = c/a$, and the sign of the discriminant $\\Delta = b^2 - 4ac$.</div>

<p class="l-text">Assume $\\Delta \\geq 0$, so the two roots are real. Then the cases are:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sign of $P = c/a$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sign of $S = -b/a$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Conclusion about the roots</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P > 0$</td><td style="padding:0.5rem 0.8rem">$S > 0$</td><td style="padding:0.5rem 0.8rem"><strong>Both roots positive</strong></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P > 0$</td><td style="padding:0.5rem 0.8rem">$S < 0$</td><td style="padding:0.5rem 0.8rem"><strong>Both roots negative</strong></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P < 0$</td><td style="padding:0.5rem 0.8rem">$S > 0$ or $S < 0$</td><td style="padding:0.5rem 0.8rem"><strong>Roots have opposite signs</strong> (one + and one &minus;), the larger in magnitude has the same sign as $S$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P = 0$</td><td style="padding:0.5rem 0.8rem">any</td><td style="padding:0.5rem 0.8rem"><strong>One root is zero;</strong> the other equals $S$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$P > 0$</td><td style="padding:0.5rem 0.8rem">$S = 0$</td><td style="padding:0.5rem 0.8rem"><strong>Complex conjugate pair</strong> (would require $\\Delta < 0$, since two real numbers with positive product and zero sum cannot exist)</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Why the table works.</strong> The product of two real numbers is positive only when they have the same sign and negative only when they have opposite signs. The sum is positive when the positive contributions dominate, negative when the negative ones do. Cross these two facts and you get every row of the table.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; classifying without solving</div><div class="example-body">Describe the roots of $x^2 - 7x + 10 = 0$ without solving.<br><br>$a = 1$, $b = -7$, $c = 10$.<br>$\\Delta = 49 - 40 = 9 > 0$ &mdash; two distinct real roots.<br>$S = -b/a = 7 > 0$ and $P = c/a = 10 > 0$.<br><br>Both signs positive &rArr; <strong>both roots are positive</strong>. (They are in fact 2 and 5, as factoring $(x-2)(x-5)$ confirms.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; opposite signs</div><div class="example-body">Describe the roots of $x^2 + 3x - 10 = 0$.<br><br>$\\Delta = 9 + 40 = 49 > 0$.<br>$S = -3$, $P = -10$.<br><br>$P < 0$ &rArr; <strong>roots have opposite signs.</strong> $S < 0$ &rArr; <strong>the negative root is larger in magnitude.</strong> (Roots: 2 and &minus;5. Indeed $|-5| > |2|$. Confirmed.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; parameter problem</div><div class="example-body">For which values of $m$ does $x^2 - 4x + (m - 3) = 0$ have <strong>two distinct positive real roots</strong>?<br><br>Three conditions must hold simultaneously:<br>(i) $\\Delta > 0$: $16 - 4(m-3) > 0 \\Rightarrow 16 - 4m + 12 > 0 \\Rightarrow m < 7$.<br>(ii) $S > 0$: $-(-4)/1 = 4 > 0$. <strong>Always true.</strong><br>(iii) $P > 0$: $(m-3)/1 > 0 \\Rightarrow m > 3$.<br><br>Combining: $\\mathbf{3 < m < 7}$.</div></div>

<div class="calc-graph"><div id="plot-l55-roots-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three parabolas illustrating the three main root-sign regimes. Blue ($x^2 - 5x + 6$): two positive roots (2, 3) &mdash; parabola crosses the x-axis to the right of the origin. Red ($x^2 + 5x + 6$): two negative roots (&minus;2, &minus;3) &mdash; both crossings to the left. Green ($x^2 - x - 6$): opposite signs (&minus;2, +3) &mdash; one crossing on each side of the origin. You can read the root structure from the geometry alone.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-60;i<=60;i++){xs.push(i/10);}
var y1=xs.map(function(x){return x*x-5*x+6;});
var y2=xs.map(function(x){return x*x+5*x+6;});
var y3=xs.map(function(x){return x*x-x-6;});
var tr1={x:xs,y:y1,mode:'lines',name:'x²−5x+6 (both +)',line:{color:'#3b82f6',width:2.4}};
var tr2={x:xs,y:y2,mode:'lines',name:'x²+5x+6 (both −)',line:{color:'#ef4444',width:2.4}};
var tr3={x:xs,y:y3,mode:'lines',name:'x²−x−6 (opp)',line:{color:'#10b981',width:2.4}};
var zero={x:[-6,6],y:[0,0],mode:'lines',name:'y=0',line:{color:'rgba(255,255,255,0.3)',width:1,dash:'dot'},showlegend:false};
var roots={x:[2,3,-2,-3,-2,3],y:[0,0,0,0,0,0],mode:'markers',name:'roots',marker:{color:['#3b82f6','#3b82f6','#ef4444','#ef4444','#10b981','#10b981'],size:10,symbol:'circle-open',line:{width:2}}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-8,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l55-roots-en',[tr1,tr2,tr3,zero,roots],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Worked Examples &mdash; Putting Vieta to Work</h2>

<div class="calc-highlight">A consolidated tour of five problems &mdash; one from each of the categories above &mdash; solved purely through Vieta's formulas with no recourse to the quadratic formula.</div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 &mdash; pure substitution</div><div class="example-body">If $x_1$ and $x_2$ are the roots of $3x^2 - 12x + 5 = 0$, compute $x_1 + x_2$ and $x_1 x_2$.<br><br>$S = -b/a = -(-12)/3 = \\mathbf{4}$.<br>$P = c/a = 5/3 = \\mathbf{5/3}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 &mdash; sum of squares</div><div class="example-body">For the equation $2x^2 - 6x + 1 = 0$, find $x_1^2 + x_2^2$.<br><br>$S = 6/2 = 3$, $P = 1/2$.<br>$x_1^2 + x_2^2 = S^2 - 2P = 9 - 1 = \\mathbf{8}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 &mdash; build an equation</div><div class="example-body">Construct the quadratic equation whose roots are the squares of the roots of $x^2 - 4x + 2 = 0$.<br><br>Let $u_1 = x_1^2$, $u_2 = x_2^2$. From Vieta on the original: $S_x = 4$, $P_x = 2$.<br><br>New sum: $u_1 + u_2 = x_1^2 + x_2^2 = S_x^2 - 2P_x = 16 - 4 = 12$.<br>New product: $u_1 u_2 = x_1^2 \\cdot x_2^2 = (x_1 x_2)^2 = P_x^2 = 4$.<br><br>Apply the golden formula $u^2 - Su + P = 0$: <strong>$u^2 - 12u + 4 = 0$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 &mdash; missing coefficient</div><div class="example-body">For the equation $x^2 + kx + 8 = 0$, the roots satisfy $x_1 - x_2 = 2$. Find $k$.<br><br>$P = 8$, $S = -k$.<br>$(x_1 - x_2)^2 = S^2 - 4P \\Rightarrow 4 = k^2 - 32 \\Rightarrow k^2 = 36 \\Rightarrow \\mathbf{k = \\pm 6}$.<br><br>(Check: $k = -6$ gives $x^2 - 6x + 8 = 0$, roots 2 and 4, difference 2. Match. $k = 6$ gives roots $-2$ and $-4$, difference $|-2 - (-4)| = 2$. Match.)</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 5 &mdash; classification</div><div class="example-body">For which $m$ are both roots of $x^2 - 2mx + (m^2 - 1) = 0$ greater than 1?<br><br>Substitute $y = x - 1$ to shift the threshold to 0. Then "both roots of the original $> 1$" becomes "both roots of the shifted equation positive." Expanding $(y+1)^2 - 2m(y+1) + (m^2 - 1) = y^2 + 2y + 1 - 2my - 2m + m^2 - 1 = y^2 + (2 - 2m)y + (m^2 - 2m) = 0$.<br><br>Now apply Vieta-positivity from Section 6:<br>(i) $\\Delta_y > 0$: $(2 - 2m)^2 - 4(m^2 - 2m) = 4 - 8m + 4m^2 - 4m^2 + 8m = 4 > 0$. Always true.<br>(ii) Sum of $y$-roots $> 0$: $-(2 - 2m) > 0 \\Rightarrow m > 1$.<br>(iii) Product of $y$-roots $> 0$: $m^2 - 2m > 0 \\Rightarrow m(m - 2) > 0 \\Rightarrow m < 0$ or $m > 2$.<br><br>Intersecting with $m > 1$ gives <strong>$m > 2$.</strong></div></div>

<h2 class="lesson-title">8. Vieta for a Cubic Equation (Brief Look)</h2>

<div class="calc-highlight"><strong>The same proof idea extends to any degree.</strong> Factor the polynomial as $a(x - x_1)(x - x_2)(x - x_3) \\cdots = 0$, expand, and match coefficients. For a cubic, three short identities fall out.</div>

<p class="l-text">Consider the cubic $a_3 x^3 + a_2 x^2 + a_1 x + a_0 = 0$ with three roots $x_1$, $x_2$, $x_3$. Expanding $a_3(x - x_1)(x - x_2)(x - x_3)$ and matching coefficients gives:</p>

<div class="calc-formula"><div class="formula-label">VIETA'S FORMULAS &mdash; CUBIC CASE</div><div class="formula-main">$$\\begin{aligned} x_1 + x_2 + x_3 &= -\\frac{a_2}{a_3} \\\\ x_1 x_2 + x_1 x_3 + x_2 x_3 &= \\frac{a_1}{a_3} \\\\ x_1 \\, x_2 \\, x_3 &= -\\frac{a_0}{a_3} \\end{aligned}$$</div><div class="formula-sub">The pattern: alternating signs (minus, plus, minus) and a "ladder" of symmetric sums &mdash; sum of single roots, sum of pairwise products, product of all three. This generalises to any degree (the signs continue to alternate).</div></div>

<div class="calc-example"><div class="example-label">QUICK CHECK ON A CUBIC</div><div class="example-body">Take $x^3 - 6x^2 + 11x - 6 = 0$. The roots factor as $(x-1)(x-2)(x-3) = 0$, so $x_1 = 1$, $x_2 = 2$, $x_3 = 3$.<br><br>Sum: $1 + 2 + 3 = 6$ and $-a_2/a_3 = -(-6)/1 = 6$. Match.<br>Pairwise sum: $1 \\cdot 2 + 1 \\cdot 3 + 2 \\cdot 3 = 11$ and $a_1/a_3 = 11/1 = 11$. Match.<br>Product: $1 \\cdot 2 \\cdot 3 = 6$ and $-a_0/a_3 = -(-6)/1 = 6$. Match.<br><br>All three Vieta identities verified.</div></div>

<div class="l-note"><strong>Why this is in a high-school lesson:</strong> very few high-school exams ask you to <em>solve</em> a cubic by hand &mdash; the formula is too painful. But they sometimes ask "the roots of this cubic are $a$, $b$, $c$; find $a + b + c$ or $abc$" &mdash; and that you can answer instantly from Vieta. So this section is short on purpose. Memorise the three identities; you will not need to derive them under time pressure.</div>

<div class="calc-graph"><div id="plot-l55-vieta-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three monic quadratics $f_k(x) = x^2 - 4x + k$ for $k \\in \\{1, 3, 4\\}$. All three share the same root-sum $S = 4$ (the parabolas are translations of each other vertically), but the root-product $P = k$ controls how far apart the two roots sit. As $k$ increases towards $S^2/4 = 4$, the roots move together; at $k = 4$ they coincide (tangent to the x-axis); beyond $k = 4$ they become complex. This is the discriminant boundary $S^2 - 4P = 0$ visualised.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=80;i++){xs.push(i/10);}
var ya=xs.map(function(x){return x*x-4*x+1;});
var yb=xs.map(function(x){return x*x-4*x+3;});
var yc=xs.map(function(x){return x*x-4*x+4;});
var t1={x:xs,y:ya,mode:'lines',name:'k=1 (roots far apart)',line:{color:'#3b82f6',width:2.4}};
var t2={x:xs,y:yb,mode:'lines',name:'k=3 (roots closer)',line:{color:'#f59e0b',width:2.4}};
var t3={x:xs,y:yc,mode:'lines',name:'k=4 (double root)',line:{color:'#ef4444',width:2.4}};
var zeroL={x:[-3,8],y:[0,0],mode:'lines',name:'y=0',line:{color:'rgba(255,255,255,0.3)',width:1,dash:'dot'},showlegend:false};
var midV={x:[2,2],y:[-2,8],mode:'lines',name:'x = S/2 = 2',line:{color:'rgba(255,255,255,0.4)',width:1,dash:'dash'}};
var layVE={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l55-vieta-en',[t1,t2,t3,zeroL,midV],layVE,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Practice Problems</h2>

<div class="calc-highlight">Eight problems, increasing in difficulty. Answers and short solutions at the end of the lesson on the teacher's reference page &mdash; try each problem first using only Vieta's formulas, without the quadratic formula.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1</div><div class="card-body">Find $S$ and $P$ for the equation $5x^2 - 15x + 4 = 0$.<br><br><em>Answer:</em> $S = 3$, $P = 4/5$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2</div><div class="card-body">Construct the monic quadratic whose roots are 7 and &minus;2.<br><br><em>Answer:</em> $x^2 - 5x - 14 = 0$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3</div><div class="card-body">For $x^2 - 9x + 14 = 0$, compute $x_1^2 + x_2^2$.<br><br><em>Answer:</em> $81 - 28 = 53$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4</div><div class="card-body">For $2x^2 + 5x - 3 = 0$, compute $\\dfrac{1}{x_1} + \\dfrac{1}{x_2}$.<br><br><em>Answer:</em> $S/P = (-5/2)/(-3/2) = 5/3$.</div></div>
<div class="calc-card"><div class="card-title">Problem 5</div><div class="card-body">For $x^2 - 4x + 1 = 0$, find $x_1^3 + x_2^3$.<br><br><em>Answer:</em> $S^3 - 3PS = 64 - 12 = 52$.</div></div>
<div class="calc-card"><div class="card-title">Problem 6</div><div class="card-body">For which $m$ does $x^2 - 6x + m = 0$ have two distinct positive real roots?<br><br><em>Answer:</em> Need $\\Delta > 0$ ($m < 9$), $S > 0$ ($6 > 0$ &mdash; always), $P > 0$ ($m > 0$). So $0 < m < 9$.</div></div>
<div class="calc-card"><div class="card-title">Problem 7</div><div class="card-body">The roots of $x^2 + bx + 12 = 0$ differ by 1. Find all possible values of $b$.<br><br><em>Answer:</em> $(x_1 - x_2)^2 = b^2 - 48 = 1 \\Rightarrow b^2 = 49 \\Rightarrow b = \\pm 7$.</div></div>
<div class="calc-card"><div class="card-title">Problem 8</div><div class="card-body">The roots of the cubic $x^3 - 4x^2 + x + 6 = 0$ are $\\alpha$, $\\beta$, $\\gamma$. Find $\\alpha^2 + \\beta^2 + \\gamma^2$.<br><br><em>Answer:</em> Use $(\\alpha + \\beta + \\gamma)^2 = \\alpha^2 + \\beta^2 + \\gamma^2 + 2(\\alpha\\beta + \\alpha\\gamma + \\beta\\gamma)$. From cubic Vieta: $\\alpha + \\beta + \\gamma = 4$ and $\\alpha\\beta + \\alpha\\gamma + \\beta\\gamma = 1$. So $\\alpha^2 + \\beta^2 + \\gamma^2 = 16 - 2 = 14$.</div></div>
</div>

<h2 class="lesson-title">10. Discriminant Visualised &mdash; Three Root Regimes</h2>

<div class="calc-highlight"><strong>One picture, three discriminant cases.</strong> The next graph shows three parabolas that all share the same axis of symmetry $x = 2$ but differ only in their constant term, so they slide vertically and cross (or fail to cross) the x-axis differently. Reading the picture left-to-right tells you everything the discriminant says algebraically.</div>

<div class="calc-graph"><div id="plot-l55-discriminant-en-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = (x - 2)^2 + c$ for three values of $c$. Blue ($c = -4$, i.e. $x^2 - 4x$): $\\Delta > 0$, two distinct real roots at $x = 0$ and $x = 4$. Amber ($c = 0$, i.e. $x^2 - 4x + 4$): $\\Delta = 0$, one repeated real root at $x = 2$ (parabola is tangent to the x-axis). Red ($c = +2$, i.e. $x^2 - 4x + 6$): $\\Delta < 0$, no real roots &mdash; the parabola sits entirely above the x-axis, so the two roots are complex conjugates $2 \\pm i\\sqrt{2}$. Same Vieta sum ($S = 4$) in all three cases; only $P$ changes, and $P$ crosses the discriminant boundary $S^2/4 = 4$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-20;i<=60;i++){xs.push(i/10);}
var yA=xs.map(function(x){return (x-2)*(x-2)-4;});
var yB=xs.map(function(x){return (x-2)*(x-2);});
var yC=xs.map(function(x){return (x-2)*(x-2)+2;});
var trA={x:xs,y:yA,mode:'lines',name:'Δ>0: two real roots (0, 4)',line:{color:'#3b82f6',width:2.6}};
var trB={x:xs,y:yB,mode:'lines',name:'Δ=0: double root (2)',line:{color:'#f59e0b',width:2.6}};
var trC={x:xs,y:yC,mode:'lines',name:'Δ<0: complex roots (no x-cut)',line:{color:'#ef4444',width:2.6}};
var zline={x:[-2,6],y:[0,0],mode:'lines',name:'y=0',line:{color:'rgba(255,255,255,0.3)',width:1,dash:'dot'},showlegend:false};
var axisSym={x:[2,2],y:[-5,8],mode:'lines',name:'axis x=2',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dash'}};
var rootMarks={x:[0,4,2],y:[0,0,0],mode:'markers',name:'real roots',marker:{color:['#3b82f6','#3b82f6','#f59e0b'],size:11,symbol:'circle-open',line:{width:2.4}}};
var layDE={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l55-discriminant-en-extra',[trA,trB,trC,zline,axisSym,rootMarks],layDE,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Vieta Reference Table &mdash; All Relations at a Glance</h2>

<div class="calc-highlight">A consolidated cheat sheet. The first six rows are the symmetric expressions you need for the quadratic; the bottom three rows extend the same idea to the cubic. Memorise the right column and most exam-style Vieta problems become one-step substitutions.</div>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.93rem;background:#0a0a0a;color:rgba(235,230,220,0.92)">
<thead><tr style="background:rgba(59,130,246,0.16);border-bottom:2px solid rgba(59,130,246,0.45)">
<th style="padding:0.7rem 0.9rem;text-align:left;color:#3b82f6;width:34%">Relation in the roots</th>
<th style="padding:0.7rem 0.9rem;text-align:left;color:#3b82f6">Closed form in $S$, $P$ (and coefficients)</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem"><strong>Quadratic</strong> $ax^2 + bx + c = 0$ &mdash; roots $x_1$, $x_2$</td><td style="padding:0.55rem 0.9rem;color:rgba(235,230,220,0.65)"><em>let $S = x_1 + x_2$, $\\;P = x_1 x_2$</em></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 + x_2$ &nbsp; (sum)</td><td style="padding:0.55rem 0.9rem">$S \\;=\\; -\\,b/a$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 \\cdot x_2$ &nbsp; (product)</td><td style="padding:0.55rem 0.9rem">$P \\;=\\; c/a$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1^2 + x_2^2$ &nbsp; (sum of squares)</td><td style="padding:0.55rem 0.9rem">$S^2 - 2P$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1^3 + x_2^3$ &nbsp; (sum of cubes)</td><td style="padding:0.55rem 0.9rem">$S^3 - 3PS$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x_1} + \\dfrac{1}{x_2}$ &nbsp; (sum of reciprocals)</td><td style="padding:0.55rem 0.9rem">$S/P \\;=\\; -\\,b/c$ &nbsp; (requires $P \\neq 0$)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x_1^2} + \\dfrac{1}{x_2^2}$</td><td style="padding:0.55rem 0.9rem">$(S^2 - 2P)/P^2$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$(x_1 - x_2)^2$ &nbsp; (squared difference)</td><td style="padding:0.55rem 0.9rem">$S^2 - 4P \\;=\\; \\Delta / a^2$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$|x_1 - x_2|$ &nbsp; (absolute difference)</td><td style="padding:0.55rem 0.9rem">$\\sqrt{S^2 - 4P} \\;=\\; \\sqrt{\\Delta}\\,/\\,|a|$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$(x_1 + k)(x_2 + k)$ &nbsp; (shifted product)</td><td style="padding:0.55rem 0.9rem">$P + kS + k^2$</td></tr>
<tr style="border-bottom:2px solid rgba(59,130,246,0.35)"><td style="padding:0.55rem 0.9rem"><strong>Cubic</strong> $a_3 x^3 + a_2 x^2 + a_1 x + a_0 = 0$ &mdash; roots $x_1$, $x_2$, $x_3$</td><td style="padding:0.55rem 0.9rem;color:rgba(235,230,220,0.65)"><em>alternating-sign pattern</em></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 + x_2 + x_3$</td><td style="padding:0.55rem 0.9rem">$-\\,a_2 / a_3$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 x_2 + x_1 x_3 + x_2 x_3$ &nbsp; (pairwise sum)</td><td style="padding:0.55rem 0.9rem">$a_1 / a_3$</td></tr>
<tr><td style="padding:0.55rem 0.9rem">$x_1 \\cdot x_2 \\cdot x_3$ &nbsp; (full product)</td><td style="padding:0.55rem 0.9rem">$-\\,a_0 / a_3$</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>Closing thought.</strong> Vieta's formulas are 400 years old (François Viète, 1591), yet they remain one of the most efficient algebraic tools available. Every time a problem mentions "sum of roots," "product of roots," or "roots satisfy X," your first instinct should be Vieta &mdash; not the quadratic formula. Lesson 56 (Inequalities involving Quadratics) and Lesson 57 (Graphs of Parabolas) will both lean heavily on what you have just learned.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Ders 55: Vieta Formülleri ve Karesel Denklemde Köklerin Yapısı.</strong> Ders 54'te $ax^2 + bx + c = 0$ denkleminin iki kökünü <em>hesaplamak</em> için karesel formülü kullandık. Bu formül en temel iş aracıdır, ama bütün hikâye değildir. Denklemin içinde çok daha derin bir gözlem saklıdır: <em>kökleri çözmeden bile</em>, doğrudan $a$, $b$, $c$ katsayılarından köklerin toplamını ve çarpımını okuyabiliriz. İşte Vieta'nın keşfi budur; denklemle çözümleri arasındaki ilişkiyi çift yönlü hâle getirir.</p>

<p class="l-text">Vieta'nın iki kısa özdeşliğini içselleştirdikten sonra uzun bir problem listesi neredeyse anında çözülür: "kökleri 3 ve &minus;5 olan denklemi yaz," "denklemi çözmeden $x_1^2 + x_2^2$'yi hesapla," "hangi $m$ için her iki kök pozitif olur," "köklerin farkı 4 olduğuna göre eksik katsayıyı bul." Bunların hepsi $-b/a$ ve $c/a$ ifadelerine sayı yerleştirmeye indirgenir. Bu ders formülleri öğretir, ispatlar ve yedi bölüm ile bir kapanış alıştırma seti boyunca uygular.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Karesel denklem için Vieta formüllerini ifade etmek: $x_1 + x_2 = -b/a$ ve $x_1 \\cdot x_2 = c/a$</li>
<li>Vieta formüllerini karesel formülden tek satır cebirle türetmek</li>
<li>Verilen iki kök için $x^2 - sx + p = 0$ formuyla karesel denklemi kurmak</li>
<li>Köklerdeki simetrik ifadeleri ($x_1^2 + x_2^2$, $1/x_1 + 1/x_2$, $x_1^3 + x_2^3$, $|x_1 - x_2|$) denklemi çözmeden hesaplamak</li>
<li>$-b/a$ ve $c/a$ işaretleri ile diskriminant kullanarak köklerin <em>işaret yapısını</em> (her ikisi pozitif, her ikisi negatif, ters işaretli) belirlemek</li>
<li>Üç kökün de simetrik göründüğü problemlerde $a_3 x^3 + a_2 x^2 + a_1 x + a_0 = 0$ üçüncü derece denklemine Vieta tarzı bağıntıları uygulamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Vieta Formülleri: İfade</h2>

<div class="calc-highlight"><strong>Sonuç tek cümleyle:</strong> Eğer $x_1$ ve $x_2$, $ax^2 + bx + c = 0$ denkleminin iki kökü ise ($a \\neq 0$), bu köklerin <em>toplamı</em> $-b/a$, <em>çarpımı</em> ise $c/a$'ya eşittir. Karekök yok, diskriminant yok, durum ayrımı yok &mdash; sadece zaten gördüğün katsayıların oranı.</div>

<p class="l-text">Dersin merkez fikri budur. Sonraki her bölüm bu iki kısa özdeşliğin bir uygulamasıdır. Önce ezberle, ispat sonra:</p>

<div class="calc-formula"><div class="formula-label">VIETA FORMÜLLERİ &mdash; KARESEL DURUM</div><div class="formula-main">$$x_1 + x_2 \\;=\\; -\\frac{b}{a} \\qquad\\qquad x_1 \\cdot x_2 \\;=\\; \\frac{c}{a}$$</div><div class="formula-sub">$ax^2 + bx + c = 0$ denkleminin kökleri $x_1$ ve $x_2$ içindir. İki reel kök çakışık olabilir ($x_1 = x_2$) veya karmaşık eşlenik bir çift olabilir &mdash; özdeşlikler her durumda geçerlidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Köklerin toplamı</div><div class="card-body">$S = x_1 + x_2 = -b/a$. Baş katsayı $a$ paydaya, doğrusal terimin katsayısı $b$ ise <em>eksi işaretiyle</em> paya gelir. Yeni başlayanların en sık unuttuğu kısım bu eksi işaretidir.</div></div>
<div class="calc-card"><div class="card-title">Köklerin çarpımı</div><div class="card-body">$P = x_1 \\cdot x_2 = c/a$. Sabit terim $c$ üstte, baş katsayı $a$ altta. Burada işaret değişimi yok.</div></div>
<div class="calc-card"><div class="card-title">$a = 1$ özel durumu</div><div class="card-body">Baş katsayı 1 olduğunda (<em>monik</em> karesel) formüller sadeleşir: $S = -b$, $P = c$. Ders kitabı problemlerinin çoğu bu formdadır.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI SAYISAL DOĞRULAMA</div><div class="example-body">$x^2 - 5x + 6 = 0$ alalım. Kökler $(x-2)(x-3) = 0$ şeklinde çarpanlara ayrılır; yani $x_1 = 2$, $x_2 = 3$.<br><br>Toplam: $2 + 3 = 5$ ve $-b/a = -(-5)/1 = 5$. <strong>Tutuyor.</strong><br>Çarpım: $2 \\cdot 3 = 6$ ve $c/a = 6/1 = 6$. <strong>Tutuyor.</strong><br><br>Her iki Vieta formülü de karesel formüle hiç başvurmadan doğrulandı.</div></div>

<div class="l-note"><strong>Bunun gücü neden böyle önemli:</strong> karesel formül sana iki kökü <em>tek tek</em> verir. Vieta ise köklerin iki <em>kombinasyonunu</em> verir. Trigonometri, geometri ve fizikteki birçok problem yalnızca köklerin toplamına ya da çarpımına bağlıdır, köklere ayrı ayrı değil &mdash; ve bu durumlarda Vieta epey iş kazandırır.</div>

<h2 class="lesson-title">2. Vieta Formüllerinin İspatı</h2>

<div class="calc-highlight"><strong>İspat üç satırlık.</strong> Karesel formülden iki kökü yaz, topla, çarp ve sadeleştir. Karekök terimleri tatlı bir şekilde sadeleşir.</div>

<p class="l-text">Ders 54'teki karesel formülü hatırla:</p>

<div class="calc-formula"><div class="formula-label">İKİ KÖK</div><div class="formula-main">$$x_1 \\;=\\; \\frac{-b + \\sqrt{\\Delta}}{2a} \\qquad x_2 \\;=\\; \\frac{-b - \\sqrt{\\Delta}}{2a} \\qquad\\text{burada}\\qquad \\Delta = b^2 - 4ac$$</div></div>

<p class="l-text"><strong>Adım 1 &mdash; topla.</strong> Karekökler zıt işaretli olduğu için birbirini götürür:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM</div><div class="formula-main">$$x_1 + x_2 \\;=\\; \\frac{(-b + \\sqrt{\\Delta}) + (-b - \\sqrt{\\Delta})}{2a} \\;=\\; \\frac{-2b}{2a} \\;=\\; -\\frac{b}{a}$$</div></div>

<p class="l-text"><strong>Adım 2 &mdash; çarp.</strong> İki kare farkı özdeşliğini kullan: $(u + v)(u - v) = u^2 - v^2$:</p>

<div class="calc-formula"><div class="formula-label">ÇARPIM</div><div class="formula-main">$$x_1 \\cdot x_2 \\;=\\; \\frac{(-b + \\sqrt{\\Delta})(-b - \\sqrt{\\Delta})}{(2a)(2a)} \\;=\\; \\frac{(-b)^2 - (\\sqrt{\\Delta})^2}{4a^2} \\;=\\; \\frac{b^2 - \\Delta}{4a^2}$$</div></div>

<p class="l-text"><strong>Adım 3 &mdash; sadeleştir.</strong> $\\Delta = b^2 - 4ac$'yi yerine koy; pay $b^2 - (b^2 - 4ac) = 4ac$ olur:</p>

<div class="calc-formula"><div class="formula-label">ÇARPIM (BİTMİŞ HÂLİ)</div><div class="formula-main">$$x_1 \\cdot x_2 \\;=\\; \\frac{4ac}{4a^2} \\;=\\; \\frac{c}{a}$$</div></div>

<p class="l-text">Her iki özdeşlik de ispatlandı. Argüman $\\Delta$'nın pozitif, sıfır ya da negatif olmasına dayanmıyor; o yüzden Vieta formülleri reel <em>ve</em> karmaşık kökler için aynen geçerli.</p>

<div class="calc-highlight"><strong>Alternatif bir ispat &mdash; çarpanlara ayırma.</strong> Eğer $x_1$ ve $x_2$ köklerse, karesel denklem $a(x - x_1)(x - x_2) = 0$ şeklinde çarpanlanır. Sağ tarafı aç: $a(x^2 - (x_1 + x_2)x + x_1 x_2) = ax^2 - a(x_1+x_2)x + a \\, x_1 x_2$. Bunu $ax^2 + bx + c$ ile terim terim eşleştir:</div>

<div class="calc-formula"><div class="formula-label">KATSAYI EŞLEŞTİRME</div><div class="formula-main">$$-a(x_1 + x_2) = b \\;\\;\\Rightarrow\\;\\; x_1 + x_2 = -\\frac{b}{a} \\qquad a \\, x_1 x_2 = c \\;\\;\\Rightarrow\\;\\; x_1 x_2 = \\frac{c}{a}$$</div><div class="formula-sub">Akılda tutulması gereken ikinci ispat budur &mdash; üçüncü, dördüncü ve her dereceden polinoma temiz bir şekilde genelleşir (Bölüm 8'de uygulayacağız).</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$2x^2 - 7x + 3 = 0$ için $S$ ve $P$'yi Vieta'dan hesapla. Sonra karesel formülle çöz ve doğrudan kontrol et. Cevap: $S = 7/2$, $P = 3/2$. Kökler: $x = (7 \\pm 5)/4$, yani 3 ve $1/2$. Gerçekten $3 + 1/2 = 7/2$ ve $3 \\cdot 1/2 = 3/2$. Doğrulandı.</div></div>

<h2 class="lesson-title">3. Köklerden Karesel Denklem Kurma</h2>

<div class="calc-highlight"><strong>Vieta'nın tersi.</strong> Biri sana iki kökü verip onları sağlayan bir karesel denklem yazmanı isterse $(x - x_1)(x - x_2)$'yi elle çarpmana gerek yok &mdash; Vieta'ya yerleştir ve tek satırı yaz.</div>

<p class="l-text">Herhangi iki $x_1$ ve $x_2$ sayısını al. Kökleri tam olarak bunlar olan monik karesel denklem:</p>

<div class="calc-formula"><div class="formula-label">KÖKLERDEN KARESEL DENKLEM &mdash; ALTIN FORMÜL</div><div class="formula-main">$$x^2 - (x_1 + x_2)\\,x + (x_1 \\cdot x_2) \\;=\\; 0 \\qquad\\Longleftrightarrow\\qquad x^2 - S\\,x + P \\;=\\; 0$$</div><div class="formula-sub">burada $S = x_1 + x_2$ toplam, $P = x_1 \\cdot x_2$ ise çarpımdır. $S$'nin işareti: <em>eksi</em>. $P$'nin işareti: <em>artı</em>. Dersin neredeyse tamamı bu tek özdeşliğe indirgenir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; köklerin kendisinden</div><div class="example-body">Kökleri $x_1 = 4$ ve $x_2 = -7$ olan karesel denklemi kur.<br><br>$S = 4 + (-7) = -3$.<br>$P = 4 \\cdot (-7) = -28$.<br><br>$x^2 - Sx + P = 0$ formülüne yerleştir: <strong>$x^2 - (-3)x + (-28) = x^2 + 3x - 28 = 0$.</strong><br><br>Doğrulama: $(x + 7)(x - 4) = 0$ çarpanlara ayrılır, $x = -7$ ve $x = 4$ verir. Doğru.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; toplam ve çarpımdan</div><div class="example-body">Bir karesel denklemin kök-toplamı 5, kök-çarpımı 6. Denklemi yaz.<br><br>Doğrudan yerleştirme: <strong>$x^2 - 5x + 6 = 0$.</strong><br><br>(Kökler, eğer istersen, 2 ve 3'tür &mdash; ama problem sadece denklemi sormuş.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; irrasyonel kökler</div><div class="example-body">Kökleri $x_1 = 2 + \\sqrt{3}$ ve $x_2 = 2 - \\sqrt{3}$ olan karesel denklemi kur.<br><br>$S = (2 + \\sqrt{3}) + (2 - \\sqrt{3}) = 4$ &mdash; irrasyonel kısımlar birbirini götürür.<br>$P = (2 + \\sqrt{3})(2 - \\sqrt{3}) = 4 - 3 = 1$ &mdash; iki kare farkı kullanılarak.<br><br>Denklem: <strong>$x^2 - 4x + 1 = 0$.</strong> Kökler irrasyonel olsa da tüm katsayılar rasyonel. Bu bir tesadüf değil bir özellik: eşlenik radikal kökler her zaman tam (ya da rasyonel) katsayı üretir.</div></div>

<div class="l-note"><strong>Monik olmayan hâli.</strong> Eğer baş katsayı $a$ önemliyse (örneğin başta 1 olmadan tam katsayılar istiyorsan), her tarafı $a$ ile çarp: $a\\bigl(x^2 - Sx + P\\bigr) = ax^2 - aSx + aP = 0$. Mesela kökler $1/2$ ve $3$ ise $S = 7/2$, $P = 3/2$; monik form $x^2 - \\tfrac{7}{2}x + \\tfrac{3}{2} = 0$, 2 ile çarpılırsa daha temiz olan $2x^2 - 7x + 3 = 0$ elde edilir.</div>

<h2 class="lesson-title">4. Köklerdeki İfadeleri Sadeleştirme</h2>

<div class="calc-highlight"><strong>Püf nokta, ifadeyi yalnızca $S$ ve $P$ cinsinden yazmaktır.</strong> İki kökte <em>simetrik</em> olan herhangi bir şey (yani $x_1 \\leftrightarrow x_2$ takasında değişmeyen) $S$ ve $P$ kullanılarak yeniden yazılabilir ve doğrudan katsayılardan okunabilir.</div>

<p class="l-text">En önemli örnek köklerin kareleri toplamıdır:</p>

<div class="calc-formula"><div class="formula-label">KÖKLERİN KARELERİ TOPLAMI</div><div class="formula-main">$$x_1^2 + x_2^2 \\;=\\; (x_1 + x_2)^2 - 2 x_1 x_2 \\;=\\; S^2 - 2P$$</div><div class="formula-sub">Türetme: $(x_1 + x_2)^2 = x_1^2 + 2 x_1 x_2 + x_2^2$ olduğundan $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2 x_1 x_2$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">$x^2 - 6x + 4 = 0$ için <em>denklemi çözmeden</em> $x_1^2 + x_2^2$'yi bul.<br><br>Vieta'dan: $S = -(-6)/1 = 6$ ve $P = 4/1 = 4$.<br><br>$x_1^2 + x_2^2 = S^2 - 2P = 36 - 8 = \\mathbf{28}$.<br><br>(Doğrulama: kökler $3 \\pm \\sqrt{5}$. Kareleri: $14 + 6\\sqrt{5}$ ve $14 - 6\\sqrt{5}$. Toplam: 28. Tutuyor.)</div></div>

<p class="l-text"><strong>Bunun önemi neden büyük.</strong> $x_1^2 + x_2^2$ ifadesi her yerde karşına çıkar: fizikte (iki salınıcının enerjisi), geometride (kare uzaklıkların toplamı), optimizasyonda (varyans). Vieta ile bir çıkarmaya mal olur. Vieta olmadan, karesel denklemi çözmen, her kökü karelemen ve toplaman gerekirdi &mdash; çok daha fazla iş ve kökler irrasyonelse cebir tıkanır.</p>

<div class="think-box"><div class="think-label">HIZLI ÖRÜNTÜ</div><div class="think-body">Bir ifade $x_1$ ve $x_2$ içeriyor ve onları takas ettiğinde değişmiyorsa, onu $S$ ve $P$ cinsinden yazabilirsin. Şunlarda dene: (a) $x_1^2 \\cdot x_2 + x_1 \\cdot x_2^2$. (b) $(x_1 + 1)(x_2 + 1)$. (c) $x_1^2 \\cdot x_2^2$.<br><br>Cevaplar: (a) $x_1 x_2 (x_1 + x_2) = P \\cdot S$. (b) $x_1 x_2 + x_1 + x_2 + 1 = P + S + 1$. (c) $(x_1 x_2)^2 = P^2$.</div></div>

<h2 class="lesson-title">5. Diğer Önemli Simetrik İfadeler</h2>

<div class="calc-highlight">Kareler toplamının ötesinde, sınav problemlerinde sürekli karşına çıkacak dört kombinasyon daha var: terslerin toplamı, küplerin toplamı, köklerin mutlak farkı ve karesel farkı. Her biri $S$ ve $P$ cinsinden temiz şekilde yazılır.</div>

<div class="calc-formula"><div class="formula-label">BEŞ STANDART SİMETRİK ÖZDEŞLİK</div><div class="formula-main">$$\\begin{aligned} x_1^2 + x_2^2 &= S^2 - 2P \\\\ \\frac{1}{x_1} + \\frac{1}{x_2} &= \\frac{x_1 + x_2}{x_1 x_2} = \\frac{S}{P} \\\\ \\frac{1}{x_1^2} + \\frac{1}{x_2^2} &= \\frac{x_1^2 + x_2^2}{(x_1 x_2)^2} = \\frac{S^2 - 2P}{P^2} \\\\ x_1^3 + x_2^3 &= (x_1 + x_2)^3 - 3 x_1 x_2 (x_1 + x_2) = S^3 - 3PS \\\\ (x_1 - x_2)^2 &= (x_1 + x_2)^2 - 4 x_1 x_2 = S^2 - 4P \\;=\\; \\Delta / a^2 \\end{aligned}$$</div><div class="formula-sub">Son satır Vieta'yı diskriminanta bağlar: kökler arasındaki karesel mesafe tam olarak $\\Delta / a^2$'dir. Yani $|x_1 - x_2| = \\sqrt{\\Delta}\\,/\\,|a|$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Terslerin toplamı</div><div class="card-body">$1/x_1 + 1/x_2 = S/P$. Ortak paydadan doğrudan gelir. $P \\neq 0$ gerekir (sıfır kök olmamalı).</div></div>
<div class="calc-card"><div class="card-title">Küplerin toplamı</div><div class="card-body">$x_1^3 + x_2^3 = S^3 - 3PS$. $u^3 + v^3 = (u+v)^3 - 3uv(u+v)$ cebirsel özdeşliğinden türetilir.</div></div>
<div class="calc-card"><div class="card-title">Köklerin farkı</div><div class="card-body">$|x_1 - x_2| = \\sqrt{S^2 - 4P}$. Karekök altındaki ifade tam olarak $\\Delta/a^2$'dir; diskriminantın iki kökün "ne kadar uzakta" olduğunu ölçmesinin sebebi budur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; küpler toplamı</div><div class="example-body">$x^2 - 3x + 1 = 0$ için denklemi çözmeden $x_1^3 + x_2^3$'ü hesapla.<br><br>$S = 3$, $P = 1$.<br>$x_1^3 + x_2^3 = S^3 - 3PS = 27 - 9 = \\mathbf{18}$.<br><br>(Kontrol: kökler $(3 \\pm \\sqrt{5})/2$. Her birini küpleyip topladığında 18 çıkar. Vieta yolu dramatik biçimde daha kısa.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; mutlak fark</div><div class="example-body">$x^2 - 8x + 7 = 0$ için $|x_1 - x_2|$'yi bul.<br><br>$S = 8$, $P = 7$, dolayısıyla $\\Delta = S^2 - 4P = 64 - 28 = 36$ (burada $a = 1$, yani $\\Delta/a^2 = \\Delta$).<br>$|x_1 - x_2| = \\sqrt{36} = \\mathbf{6}$.<br><br>(Doğrulama: $(x-1)(x-7)$ çarpanlarına ayrıl, kökler 1 ve 7, fark 6. Doğru.)</div></div>

<div class="l-note"><strong>Genel ilke:</strong> köklerin <em>simetrik</em> herhangi bir rasyonel fonksiyonu $S$ ve $P$ cinsinden ifade edilebilir. Bu temel cebirden bir teoremdir ("simetrik polinomların temel teoremi"). Lise sınavı için yukarıdaki beş özdeşlik karşılaşacağın hemen her problemi kapsar.</div>

<h2 class="lesson-title">6. İki Kökün İşaret Yapısı</h2>

<div class="calc-highlight"><strong>Vieta'nın en yararlı uygulamalarından biri:</strong> köklerin pozitif mi, negatif mi, ters işaretli mi yoksa sıfır mı olduğunu &mdash; <em>onları hesaplamadan</em> &mdash; belirlemek. Tarif üç bilgiyi kullanır: $S = -b/a$'nın işareti, $P = c/a$'nın işareti ve diskriminant $\\Delta = b^2 - 4ac$'nin işareti.</div>

<p class="l-text">$\\Delta \\geq 0$ olduğunu varsayalım; bu durumda iki kök de reeldir. Durumlar şunlar:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$P = c/a$ işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$S = -b/a$ işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Kökler hakkında sonuç</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P > 0$</td><td style="padding:0.5rem 0.8rem">$S > 0$</td><td style="padding:0.5rem 0.8rem"><strong>Her iki kök pozitif</strong></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P > 0$</td><td style="padding:0.5rem 0.8rem">$S < 0$</td><td style="padding:0.5rem 0.8rem"><strong>Her iki kök negatif</strong></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P < 0$</td><td style="padding:0.5rem 0.8rem">$S > 0$ veya $S < 0$</td><td style="padding:0.5rem 0.8rem"><strong>Kökler zıt işaretli</strong> (biri +, biri &minus;), mutlak değerce büyük olan $S$ ile aynı işarete sahiptir</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$P = 0$</td><td style="padding:0.5rem 0.8rem">herhangi</td><td style="padding:0.5rem 0.8rem"><strong>Bir kök sıfır;</strong> diğeri $S$'ye eşit</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$P > 0$</td><td style="padding:0.5rem 0.8rem">$S = 0$</td><td style="padding:0.5rem 0.8rem"><strong>Karmaşık eşlenik çift</strong> ($\\Delta < 0$ gerektirir; pozitif çarpım ve sıfır toplama sahip iki reel sayı bir arada olamaz)</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Tablo neden böyle çalışır.</strong> İki reel sayının çarpımı, yalnızca işaretleri aynıysa pozitif; sadece zıt işaretliyse negatiftir. Toplam, pozitif katkılar baskın olduğunda pozitif, negatifler baskın olduğunda negatiftir. Bu iki olguyu kesiştirince tablonun her satırı çıkar.</p>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; çözmeden sınıflandırma</div><div class="example-body">$x^2 - 7x + 10 = 0$'ın köklerini çözmeden tanımla.<br><br>$a = 1$, $b = -7$, $c = 10$.<br>$\\Delta = 49 - 40 = 9 > 0$ &mdash; iki farklı reel kök.<br>$S = -b/a = 7 > 0$ ve $P = c/a = 10 > 0$.<br><br>Her iki işaret pozitif &rArr; <strong>her iki kök pozitif</strong>. (Aslında 2 ve 5, $(x-2)(x-5)$ ayrımının gösterdiği gibi.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; zıt işaretli</div><div class="example-body">$x^2 + 3x - 10 = 0$'ın köklerini tanımla.<br><br>$\\Delta = 9 + 40 = 49 > 0$.<br>$S = -3$, $P = -10$.<br><br>$P < 0$ &rArr; <strong>kökler zıt işaretli.</strong> $S < 0$ &rArr; <strong>negatif kökün mutlak değeri daha büyük.</strong> (Kökler: 2 ve &minus;5. Gerçekten $|-5| > |2|$. Doğrulandı.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK &mdash; parametre problemi</div><div class="example-body">$x^2 - 4x + (m - 3) = 0$ hangi $m$ değerleri için <strong>iki farklı pozitif reel kök</strong>e sahiptir?<br><br>Üç koşul aynı anda sağlanmalı:<br>(i) $\\Delta > 0$: $16 - 4(m-3) > 0 \\Rightarrow 16 - 4m + 12 > 0 \\Rightarrow m < 7$.<br>(ii) $S > 0$: $-(-4)/1 = 4 > 0$. <strong>Her zaman doğru.</strong><br>(iii) $P > 0$: $(m-3)/1 > 0 \\Rightarrow m > 3$.<br><br>Bileşim: $\\mathbf{3 < m < 7}$.</div></div>

<div class="calc-graph"><div id="plot-l55-roots-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Üç ana kök-işaret rejimini gösteren üç parabol. Mavi ($x^2 - 5x + 6$): iki pozitif kök (2, 3) &mdash; parabol x-eksenini orijinin sağında keser. Kırmızı ($x^2 + 5x + 6$): iki negatif kök (&minus;2, &minus;3) &mdash; iki kesişim de solda. Yeşil ($x^2 - x - 6$): zıt işaretli (&minus;2, +3) &mdash; orijinin her iki yanında birer kesişim. Kök yapısını sadece geometriden okuyabilirsin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-60;i<=60;i++){xs.push(i/10);}
var y1=xs.map(function(x){return x*x-5*x+6;});
var y2=xs.map(function(x){return x*x+5*x+6;});
var y3=xs.map(function(x){return x*x-x-6;});
var tr1={x:xs,y:y1,mode:'lines',name:'x²−5x+6 (her ikisi +)',line:{color:'#3b82f6',width:2.4}};
var tr2={x:xs,y:y2,mode:'lines',name:'x²+5x+6 (her ikisi −)',line:{color:'#ef4444',width:2.4}};
var tr3={x:xs,y:y3,mode:'lines',name:'x²−x−6 (zıt)',line:{color:'#10b981',width:2.4}};
var zero={x:[-6,6],y:[0,0],mode:'lines',name:'y=0',line:{color:'rgba(255,255,255,0.3)',width:1,dash:'dot'},showlegend:false};
var roots={x:[2,3,-2,-3,-2,3],y:[0,0,0,0,0,0],mode:'markers',name:'kökler',marker:{color:['#3b82f6','#3b82f6','#ef4444','#ef4444','#10b981','#10b981'],size:10,symbol:'circle-open',line:{width:2}}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-8,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l55-roots-tr',[tr1,tr2,tr3,zero,roots],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Çözümlü Örnekler &mdash; Vieta'yı Sahaya İndirelim</h2>

<div class="calc-highlight">Yukarıdaki kategorilerin her birinden &mdash; karesel formüle hiç başvurmadan, yalnızca Vieta ile çözülmüş &mdash; toplam beş problemden oluşan derli toplu bir tur.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; düz yerleştirme</div><div class="example-body">$x_1$ ve $x_2$, $3x^2 - 12x + 5 = 0$ denkleminin kökleri ise $x_1 + x_2$ ve $x_1 x_2$'yi hesapla.<br><br>$S = -b/a = -(-12)/3 = \\mathbf{4}$.<br>$P = c/a = 5/3 = \\mathbf{5/3}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; kareler toplamı</div><div class="example-body">$2x^2 - 6x + 1 = 0$ denklemi için $x_1^2 + x_2^2$'yi bul.<br><br>$S = 6/2 = 3$, $P = 1/2$.<br>$x_1^2 + x_2^2 = S^2 - 2P = 9 - 1 = \\mathbf{8}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; denklem inşası</div><div class="example-body">Kökleri $x^2 - 4x + 2 = 0$ denkleminin köklerinin kareleri olan karesel denklemi kur.<br><br>$u_1 = x_1^2$, $u_2 = x_2^2$ olsun. Orijinal denklemden Vieta: $S_x = 4$, $P_x = 2$.<br><br>Yeni toplam: $u_1 + u_2 = x_1^2 + x_2^2 = S_x^2 - 2P_x = 16 - 4 = 12$.<br>Yeni çarpım: $u_1 u_2 = x_1^2 \\cdot x_2^2 = (x_1 x_2)^2 = P_x^2 = 4$.<br><br>Altın formül $u^2 - Su + P = 0$'ı uygula: <strong>$u^2 - 12u + 4 = 0$.</strong></div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 &mdash; eksik katsayı</div><div class="example-body">$x^2 + kx + 8 = 0$ denkleminin kökleri $x_1 - x_2 = 2$ koşulunu sağlıyor. $k$'yı bul.<br><br>$P = 8$, $S = -k$.<br>$(x_1 - x_2)^2 = S^2 - 4P \\Rightarrow 4 = k^2 - 32 \\Rightarrow k^2 = 36 \\Rightarrow \\mathbf{k = \\pm 6}$.<br><br>(Kontrol: $k = -6$ verir $x^2 - 6x + 8 = 0$, kökler 2 ve 4, fark 2. Tutuyor. $k = 6$ verir kökler $-2$ ve $-4$, fark $|-2 - (-4)| = 2$. Tutuyor.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 &mdash; sınıflandırma</div><div class="example-body">$x^2 - 2mx + (m^2 - 1) = 0$ denkleminin her iki kökünün 1'den büyük olduğu $m$ değerleri nelerdir?<br><br>$y = x - 1$ koy ki eşik 0'a kaysın. Bu durumda "orijinalin her iki kökü $> 1$" ifadesi "kaydırılmış denklemin her iki kökü pozitif" hâline gelir. $(y+1)^2 - 2m(y+1) + (m^2 - 1) = y^2 + 2y + 1 - 2my - 2m + m^2 - 1 = y^2 + (2 - 2m)y + (m^2 - 2m) = 0$.<br><br>Şimdi Bölüm 6'daki Vieta pozitiflik koşullarını uygula:<br>(i) $\\Delta_y > 0$: $(2 - 2m)^2 - 4(m^2 - 2m) = 4 - 8m + 4m^2 - 4m^2 + 8m = 4 > 0$. Her zaman doğru.<br>(ii) $y$-köklerinin toplamı $> 0$: $-(2 - 2m) > 0 \\Rightarrow m > 1$.<br>(iii) $y$-köklerinin çarpımı $> 0$: $m^2 - 2m > 0 \\Rightarrow m(m - 2) > 0 \\Rightarrow m < 0$ veya $m > 2$.<br><br>$m > 1$ ile kesiştir: <strong>$m > 2$.</strong></div></div>

<h2 class="lesson-title">8. Üçüncü Derece Denklemler için Vieta (Kısa Bakış)</h2>

<div class="calc-highlight"><strong>Aynı ispat fikri her dereceye genelleşir.</strong> Polinomu $a(x - x_1)(x - x_2)(x - x_3) \\cdots = 0$ şeklinde çarpanlarına ayır, aç ve katsayıları eşleştir. Üçüncü derece için üç kısa özdeşlik düşer.</div>

<p class="l-text">$a_3 x^3 + a_2 x^2 + a_1 x + a_0 = 0$ üçüncü derece denklemini, üç kökü $x_1$, $x_2$, $x_3$ ile düşün. $a_3(x - x_1)(x - x_2)(x - x_3)$'ü açıp katsayıları eşleştirince:</p>

<div class="calc-formula"><div class="formula-label">VIETA FORMÜLLERİ &mdash; ÜÇÜNCÜ DERECE</div><div class="formula-main">$$\\begin{aligned} x_1 + x_2 + x_3 &= -\\frac{a_2}{a_3} \\\\ x_1 x_2 + x_1 x_3 + x_2 x_3 &= \\frac{a_1}{a_3} \\\\ x_1 \\, x_2 \\, x_3 &= -\\frac{a_0}{a_3} \\end{aligned}$$</div><div class="formula-sub">Örüntü: alternatifli işaretler (eksi, artı, eksi) ve simetrik toplamların bir "merdiveni" &mdash; tek köklerin toplamı, ikili çarpımların toplamı, üçünün de çarpımı. Bu her dereceye genelleşir (işaretler alternatifli devam eder).</div></div>

<div class="calc-example"><div class="example-label">ÜÇÜNCÜ DERECEDE HIZLI KONTROL</div><div class="example-body">$x^3 - 6x^2 + 11x - 6 = 0$ alalım. Kökler $(x-1)(x-2)(x-3) = 0$ şeklinde çarpanlanır; $x_1 = 1$, $x_2 = 2$, $x_3 = 3$.<br><br>Toplam: $1 + 2 + 3 = 6$ ve $-a_2/a_3 = -(-6)/1 = 6$. Tutuyor.<br>İkili toplam: $1 \\cdot 2 + 1 \\cdot 3 + 2 \\cdot 3 = 11$ ve $a_1/a_3 = 11/1 = 11$. Tutuyor.<br>Çarpım: $1 \\cdot 2 \\cdot 3 = 6$ ve $-a_0/a_3 = -(-6)/1 = 6$. Tutuyor.<br><br>Üçüncü derece Vieta özdeşliklerinin üçü de doğrulandı.</div></div>

<div class="l-note"><strong>Bu neden lise dersinin içinde:</strong> Çok az lise sınavı senden üçüncü derece denklemi elle <em>çözmeni</em> ister &mdash; formülü çok zahmetli. Ama bazen şunu sorarlar: "bu üçüncü derecenin kökleri $a$, $b$, $c$; $a + b + c$ veya $abc$'yi bul" &mdash; ve bunu Vieta'dan anında yanıtlayabilirsin. Bu bölüm o yüzden kasıtlı olarak kısa. Üç özdeşliği ezberle; zaman baskısı altında türetmen gerekmesin.</div>

<div class="calc-graph"><div id="plot-l55-vieta-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $f_k(x) = x^2 - 4x + k$ olmak üzere $k \\in \\{1, 3, 4\\}$ için üç monik karesel. Üçü de aynı kök-toplamına sahip ($S = 4$; paraboller birbirinin dikey ötelenmesidir), ancak kök-çarpımı $P = k$ iki kökün ne kadar uzakta olduğunu kontrol eder. $k$ arttıkça (sınır değeri $S^2/4 = 4$'e doğru), kökler birbirine yaklaşır; $k = 4$'te çakışır (x-eksenine teğet); $k = 4$'ün ötesinde karmaşık olurlar. Bu, diskriminant sınırı $S^2 - 4P = 0$'ın görselidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=80;i++){xs.push(i/10);}
var ya=xs.map(function(x){return x*x-4*x+1;});
var yb=xs.map(function(x){return x*x-4*x+3;});
var yc=xs.map(function(x){return x*x-4*x+4;});
var t1={x:xs,y:ya,mode:'lines',name:'k=1 (kökler uzak)',line:{color:'#3b82f6',width:2.4}};
var t2={x:xs,y:yb,mode:'lines',name:'k=3 (kökler yakın)',line:{color:'#f59e0b',width:2.4}};
var t3={x:xs,y:yc,mode:'lines',name:'k=4 (çift kök)',line:{color:'#ef4444',width:2.4}};
var zeroL={x:[-3,8],y:[0,0],mode:'lines',name:'y=0',line:{color:'rgba(255,255,255,0.3)',width:1,dash:'dot'},showlegend:false};
var midV={x:[2,2],y:[-2,8],mode:'lines',name:'x = S/2 = 2',line:{color:'rgba(255,255,255,0.4)',width:1,dash:'dash'}};
var layVT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l55-vieta-tr',[t1,t2,t3,zeroL,midV],layVT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Alıştırmalar</h2>

<div class="calc-highlight">Zorluğu kademeli artan sekiz problem. Karesel formüle başvurmadan, yalnızca Vieta formüllerini kullanarak her birini çözmeyi dene.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1</div><div class="card-body">$5x^2 - 15x + 4 = 0$ denkleminin $S$ ve $P$ değerlerini bul.<br><br><em>Cevap:</em> $S = 3$, $P = 4/5$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2</div><div class="card-body">Kökleri 7 ve &minus;2 olan monik karesel denklemi kur.<br><br><em>Cevap:</em> $x^2 - 5x - 14 = 0$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3</div><div class="card-body">$x^2 - 9x + 14 = 0$ için $x_1^2 + x_2^2$'yi hesapla.<br><br><em>Cevap:</em> $81 - 28 = 53$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4</div><div class="card-body">$2x^2 + 5x - 3 = 0$ için $\\dfrac{1}{x_1} + \\dfrac{1}{x_2}$'yi hesapla.<br><br><em>Cevap:</em> $S/P = (-5/2)/(-3/2) = 5/3$.</div></div>
<div class="calc-card"><div class="card-title">Problem 5</div><div class="card-body">$x^2 - 4x + 1 = 0$ için $x_1^3 + x_2^3$'ü bul.<br><br><em>Cevap:</em> $S^3 - 3PS = 64 - 12 = 52$.</div></div>
<div class="calc-card"><div class="card-title">Problem 6</div><div class="card-body">$x^2 - 6x + m = 0$ hangi $m$ için iki farklı pozitif reel köke sahiptir?<br><br><em>Cevap:</em> $\\Delta > 0$ ($m < 9$), $S > 0$ ($6 > 0$ &mdash; her zaman), $P > 0$ ($m > 0$). Yani $0 < m < 9$.</div></div>
<div class="calc-card"><div class="card-title">Problem 7</div><div class="card-body">$x^2 + bx + 12 = 0$ denkleminin köklerinin farkı 1 ise $b$'nin tüm olası değerleri nelerdir?<br><br><em>Cevap:</em> $(x_1 - x_2)^2 = b^2 - 48 = 1 \\Rightarrow b^2 = 49 \\Rightarrow b = \\pm 7$.</div></div>
<div class="calc-card"><div class="card-title">Problem 8</div><div class="card-body">$x^3 - 4x^2 + x + 6 = 0$ üçüncü derece denkleminin kökleri $\\alpha$, $\\beta$, $\\gamma$. $\\alpha^2 + \\beta^2 + \\gamma^2$'yi bul.<br><br><em>Cevap:</em> $(\\alpha + \\beta + \\gamma)^2 = \\alpha^2 + \\beta^2 + \\gamma^2 + 2(\\alpha\\beta + \\alpha\\gamma + \\beta\\gamma)$ kullan. Üçüncü derece Vieta'dan: $\\alpha + \\beta + \\gamma = 4$ ve $\\alpha\\beta + \\alpha\\gamma + \\beta\\gamma = 1$. Yani $\\alpha^2 + \\beta^2 + \\gamma^2 = 16 - 2 = 14$.</div></div>
</div>

<h2 class="lesson-title">10. Diskriminantın Görselleşmesi &mdash; Üç Kök Rejimi</h2>

<div class="calc-highlight"><strong>Tek bir resim, üç diskriminant durumu.</strong> Aşağıdaki grafik aynı simetri eksenini ($x = 2$) paylaşan üç paraboldü gösterir; yalnızca sabit terimde farklılaşırlar, bu yüzden yalnızca düşey olarak kayarlar ve x-eksenini farklı şekilde keserler (veya hiç kesmezler). Resmi soldan sağa okumak, diskriminantın cebirsel olarak söylediği her şeyi anlatır.</div>

<div class="calc-graph"><div id="plot-l55-discriminant-tr-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç $c$ değeri için $f(x) = (x - 2)^2 + c$. Mavi ($c = -4$, yani $x^2 - 4x$): $\\Delta > 0$, $x = 0$ ve $x = 4$'te iki farklı reel kök. Amber ($c = 0$, yani $x^2 - 4x + 4$): $\\Delta = 0$, $x = 2$'de tek katlı reel kök (parabol x-eksenine teğet). Kırmızı ($c = +2$, yani $x^2 - 4x + 6$): $\\Delta < 0$, reel kök yok &mdash; parabol tamamen x-ekseninin üstünde, dolayısıyla iki kök karmaşık eşlenikler $2 \\pm i\\sqrt{2}$. Üç durumda da Vieta toplamı aynı ($S = 4$); yalnızca $P$ değişir ve $P$, diskriminant sınırı $S^2/4 = 4$'ü geçer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-20;i<=60;i++){xs.push(i/10);}
var yA=xs.map(function(x){return (x-2)*(x-2)-4;});
var yB=xs.map(function(x){return (x-2)*(x-2);});
var yC=xs.map(function(x){return (x-2)*(x-2)+2;});
var trA={x:xs,y:yA,mode:'lines',name:'Δ>0: iki reel kök (0, 4)',line:{color:'#3b82f6',width:2.6}};
var trB={x:xs,y:yB,mode:'lines',name:'Δ=0: çift kök (2)',line:{color:'#f59e0b',width:2.6}};
var trC={x:xs,y:yC,mode:'lines',name:'Δ<0: karmaşık kök (x-kesişimi yok)',line:{color:'#ef4444',width:2.6}};
var zline={x:[-2,6],y:[0,0],mode:'lines',name:'y=0',line:{color:'rgba(255,255,255,0.3)',width:1,dash:'dot'},showlegend:false};
var axisSym={x:[2,2],y:[-5,8],mode:'lines',name:'eksen x=2',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dash'}};
var rootMarks={x:[0,4,2],y:[0,0,0],mode:'markers',name:'reel kökler',marker:{color:['#3b82f6','#3b82f6','#f59e0b'],size:11,symbol:'circle-open',line:{width:2.4}}};
var layDT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l55-discriminant-tr-extra',[trA,trB,trC,zline,axisSym,rootMarks],layDT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Vieta Başvuru Tablosu &mdash; Tüm Bağıntılar Tek Bakışta</h2>

<div class="calc-highlight">Derli toplu bir kopya kâğıdı. İlk altı satır karesel için ihtiyacın olan simetrik ifadeler; alttaki üç satır aynı fikri üçüncü dereceye taşır. Sağ sütunu ezberlersen sınav tipi Vieta problemlerinin çoğu tek adımlık yerleştirmeye iner.</div>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.93rem;background:#0a0a0a;color:rgba(235,230,220,0.92)">
<thead><tr style="background:rgba(59,130,246,0.16);border-bottom:2px solid rgba(59,130,246,0.45)">
<th style="padding:0.7rem 0.9rem;text-align:left;color:#3b82f6;width:34%">Köklerdeki bağıntı</th>
<th style="padding:0.7rem 0.9rem;text-align:left;color:#3b82f6">$S$, $P$ (ve katsayılar) cinsinden kapalı form</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem"><strong>Karesel</strong> $ax^2 + bx + c = 0$ &mdash; kökler $x_1$, $x_2$</td><td style="padding:0.55rem 0.9rem;color:rgba(235,230,220,0.65)"><em>$S = x_1 + x_2$, $\\;P = x_1 x_2$ olsun</em></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 + x_2$ &nbsp; (toplam)</td><td style="padding:0.55rem 0.9rem">$S \\;=\\; -\\,b/a$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 \\cdot x_2$ &nbsp; (çarpım)</td><td style="padding:0.55rem 0.9rem">$P \\;=\\; c/a$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1^2 + x_2^2$ &nbsp; (kareler toplamı)</td><td style="padding:0.55rem 0.9rem">$S^2 - 2P$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1^3 + x_2^3$ &nbsp; (küpler toplamı)</td><td style="padding:0.55rem 0.9rem">$S^3 - 3PS$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x_1} + \\dfrac{1}{x_2}$ &nbsp; (terslerin toplamı)</td><td style="padding:0.55rem 0.9rem">$S/P \\;=\\; -\\,b/c$ &nbsp; ($P \\neq 0$ gerekir)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x_1^2} + \\dfrac{1}{x_2^2}$</td><td style="padding:0.55rem 0.9rem">$(S^2 - 2P)/P^2$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$(x_1 - x_2)^2$ &nbsp; (karesel fark)</td><td style="padding:0.55rem 0.9rem">$S^2 - 4P \\;=\\; \\Delta / a^2$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$|x_1 - x_2|$ &nbsp; (mutlak fark)</td><td style="padding:0.55rem 0.9rem">$\\sqrt{S^2 - 4P} \\;=\\; \\sqrt{\\Delta}\\,/\\,|a|$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$(x_1 + k)(x_2 + k)$ &nbsp; (kaydırılmış çarpım)</td><td style="padding:0.55rem 0.9rem">$P + kS + k^2$</td></tr>
<tr style="border-bottom:2px solid rgba(59,130,246,0.35)"><td style="padding:0.55rem 0.9rem"><strong>Üçüncü derece</strong> $a_3 x^3 + a_2 x^2 + a_1 x + a_0 = 0$ &mdash; kökler $x_1$, $x_2$, $x_3$</td><td style="padding:0.55rem 0.9rem;color:rgba(235,230,220,0.65)"><em>alternatifli işaret örüntüsü</em></td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 + x_2 + x_3$</td><td style="padding:0.55rem 0.9rem">$-\\,a_2 / a_3$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)"><td style="padding:0.55rem 0.9rem">$x_1 x_2 + x_1 x_3 + x_2 x_3$ &nbsp; (ikili toplam)</td><td style="padding:0.55rem 0.9rem">$a_1 / a_3$</td></tr>
<tr><td style="padding:0.55rem 0.9rem">$x_1 \\cdot x_2 \\cdot x_3$ &nbsp; (tam çarpım)</td><td style="padding:0.55rem 0.9rem">$-\\,a_0 / a_3$</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>Kapanış düşüncesi.</strong> Vieta formülleri 400 yıllık (François Viète, 1591), ama hâlâ mevcut en verimli cebirsel araçlardan biri. "Köklerin toplamı," "köklerin çarpımı" ya da "kökler X koşulunu sağlıyor" ifadesini gördüğünde ilk içgüdün Vieta olmalı &mdash; karesel formül değil. Ders 56 (Karesel İçeren Eşitsizlikler) ve Ders 57 (Parabol Grafikleri), şimdi öğrendiğin şeye yoğun şekilde dayanacak.</div>
`
};
