window.LISE_MAT_L5 = {

en: `<p class="l-text"><strong>Lesson 5: Trigonometric Identities II.</strong> In Lesson 4 we met the Pythagorean identity and the sum/difference formulas. This lesson turns those four cornerstones into a powerful toolkit: <em>product-to-sum</em>, <em>sum-to-product</em>, and <em>power-reduction</em> formulas. They look frightening at first, but each one is just a consequence of expanding $\\sin(A+B)$ or $\\cos(A+B)$ and adding (or subtracting) the result with $\\sin(A-B)$ or $\\cos(A-B)$. Once you know one, you can re-derive any of the others on a single piece of paper.</p>`

+ `<p class="l-text">These formulas show up everywhere. Calculus integrals such as $\\int \\sin 5x \\cos 3x \\, dx$ require product-to-sum first. Physical interference of two sound waves of similar pitch produces "beats" — and the beat envelope is described by the sum-to-product formula. Solving an equation like $\\sin 3x + \\sin x = 0$ becomes a single-line factoring after a sum-to-product step. By the end of this lesson you will recognise every one of those situations and reach for the right identity automatically.</p>`

+ `<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">`
+ `<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>`
+ `<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">`
+ `<li>Rewrite a product of two trig functions as a sum or difference (product-to-sum)</li>`
+ `<li>Rewrite a sum or difference of two trig functions as a product (sum-to-product)</li>`
+ `<li>Reduce $\\sin^2\\theta$, $\\cos^2\\theta$ and $\\sin^3\\theta$ to first-power expressions</li>`
+ `<li>Derive every formula in this lesson from the sum/difference identities of Lesson 4</li>`
+ `<li>Evaluate awkward numerical expressions such as $\\sin 75^\\circ \\cdot \\sin 15^\\circ$ without a calculator</li>`
+ `<li>Use sum-to-product to factor and solve equations such as $\\cos 5x + \\cos x = 0$</li>`
+ `</ul>`
+ `</div>`

/* ============================================================
   SECTION 1: Product-to-Sum Formulas
   ============================================================ */
+ `<h2 class="l-title">1. Product-to-Sum Formulas</h2>`

+ `<div class="calc-highlight"><strong>The idea in one line:</strong> a product of two sines (or two cosines, or a sine and a cosine) can always be rewritten as a <em>sum</em> or <em>difference</em> of single trig functions. Products are hard to integrate and hard to compute by hand; sums are easy. So this is one of the most useful manoeuvres in all of trigonometry.</div>`

+ `<p class="l-text">There are three formulas in this family — one for sin times sin, one for cos times cos, one for sin times cos. We list them together, because in practice you should remember them as a group:</p>`

+ `<div class="calc-formula"><div class="formula-label">PRODUCT-TO-SUM (THE THREE FORMULAS)</div><div class="formula-main">$$\\begin{aligned} \\sin A \\sin B &= \\tfrac{1}{2}\\bigl[\\cos(A-B) - \\cos(A+B)\\bigr] \\\\ \\cos A \\cos B &= \\tfrac{1}{2}\\bigl[\\cos(A-B) + \\cos(A+B)\\bigr] \\\\ \\sin A \\cos B &= \\tfrac{1}{2}\\bigl[\\sin(A+B) + \\sin(A-B)\\bigr] \\end{aligned}$$</div><div class="formula-sub">Each product on the left becomes one-half of a sum or difference of single trig values on the right.</div></div>`

+ `<p class="l-text"><strong>Reading the formulas.</strong> Notice the pattern. The right-hand side always involves the two combinations $A+B$ and $A-B$. Whether the right-hand side uses sines or cosines is dictated by what is on the left:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">sin times sin</div><div class="card-body">Right side uses <strong>cosines</strong>. The minus sign sits in front of $\\cos(A+B)$: think "subtract the sum-angle cosine."</div></div>`
+ `<div class="calc-card"><div class="card-title">cos times cos</div><div class="card-body">Right side also uses <strong>cosines</strong>. Both terms have the plus sign — "add both cosines."</div></div>`
+ `<div class="calc-card"><div class="card-title">sin times cos</div><div class="card-body">Right side uses <strong>sines</strong>. The sum-angle sine comes first; the difference-angle sine is added.</div></div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE — sin*sin</div><div class="example-body"><strong>Rewrite as a difference of cosines:</strong> $\\sin 7x \\sin 3x$.<br><br>Apply $\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$ with $A = 7x$, $B = 3x$:<br><br>$\\sin 7x \\sin 3x = \\tfrac{1}{2}\\bigl[\\cos(7x - 3x) - \\cos(7x + 3x)\\bigr] = \\tfrac{1}{2}\\bigl[\\cos 4x - \\cos 10x\\bigr]$.<br><br>The product on the left is now a clean sum on the right — much easier to integrate, plot, or differentiate.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE — cos*cos</div><div class="example-body"><strong>Rewrite:</strong> $2\\cos 5x \\cos 2x$.<br><br>Apply $\\cos A \\cos B = \\tfrac{1}{2}[\\cos(A-B) + \\cos(A+B)]$ with $A = 5x$, $B = 2x$, and remember that the leading 2 will cancel the $\\tfrac{1}{2}$:<br><br>$2 \\cdot \\tfrac{1}{2}\\bigl[\\cos(5x - 2x) + \\cos(5x + 2x)\\bigr] = \\cos 3x + \\cos 7x$.<br><br>The factor of 2 is the reason this particular combination shows up so often in physics — it produces a clean sum with no fractional coefficient.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE — sin*cos</div><div class="example-body"><strong>Rewrite:</strong> $\\sin 4x \\cos x$.<br><br>Apply $\\sin A \\cos B = \\tfrac{1}{2}[\\sin(A+B) + \\sin(A-B)]$ with $A = 4x$, $B = x$:<br><br>$\\sin 4x \\cos x = \\tfrac{1}{2}\\bigl[\\sin 5x + \\sin 3x\\bigr]$.</div></div>`

+ `<div class="think-box"><div class="think-label">A QUICK TEST</div><div class="think-body">Use the cos*cos formula to compute $\\cos 75^\\circ \\cos 15^\\circ$. Setting $A = 75^\\circ$ and $B = 15^\\circ$ gives $\\tfrac{1}{2}[\\cos 60^\\circ + \\cos 90^\\circ] = \\tfrac{1}{2}[\\tfrac{1}{2} + 0] = \\tfrac{1}{4}$. Compare with the direct calculation $\\cos 75^\\circ \\approx 0.2588$ and $\\cos 15^\\circ \\approx 0.9659$: the product is $\\approx 0.2500 = \\tfrac{1}{4}$. The formula is exact.</div></div>`

/* ============================================================
   SECTION 2: Sum-to-Product Formulas
   ============================================================ */
+ `<h2 class="l-title">2. Sum-to-Product Formulas</h2>`

+ `<div class="calc-highlight"><strong>The reverse direction.</strong> The product-to-sum formulas converted multiplication into addition. The sum-to-product formulas do exactly the opposite: they turn a sum or difference of two sines (or two cosines) into a single product. This is the key tool for <em>factoring</em> trigonometric equations.</div>`

+ `<p class="l-text">There are four formulas — two for sums and two for differences:</p>`

+ `<div class="calc-formula"><div class="formula-label">SUM-TO-PRODUCT (THE FOUR FORMULAS)</div><div class="formula-main">$$\\begin{aligned} \\sin A + \\sin B &= 2 \\sin\\!\\left(\\tfrac{A+B}{2}\\right) \\cos\\!\\left(\\tfrac{A-B}{2}\\right) \\\\ \\sin A - \\sin B &= 2 \\cos\\!\\left(\\tfrac{A+B}{2}\\right) \\sin\\!\\left(\\tfrac{A-B}{2}\\right) \\\\ \\cos A + \\cos B &= 2 \\cos\\!\\left(\\tfrac{A+B}{2}\\right) \\cos\\!\\left(\\tfrac{A-B}{2}\\right) \\\\ \\cos A - \\cos B &= -2 \\sin\\!\\left(\\tfrac{A+B}{2}\\right) \\sin\\!\\left(\\tfrac{A-B}{2}\\right) \\end{aligned}$$</div><div class="formula-sub">Average $\\tfrac{A+B}{2}$ and half-difference $\\tfrac{A-B}{2}$ appear in every formula. Memorise the pattern, not eight independent equations.</div></div>`

+ `<p class="l-text"><strong>Pattern.</strong> Every right-hand side has the same skeleton: $2 \\cdot (\\text{a function of the average}) \\cdot (\\text{a function of the half-difference})$. Three details change from line to line:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Sin or cos?</div><div class="card-body">Sines on the left give sin*cos on the right. Cosines on the left give cos*cos (sum) or sin*sin (difference). Match the families.</div></div>`
+ `<div class="calc-card"><div class="card-title">Order of average vs. half-difference</div><div class="card-body">For $\\sin A + \\sin B$: average inside sin. For $\\sin A - \\sin B$: average inside cos. Sines and cosines swap roles when you change addition to subtraction.</div></div>`
+ `<div class="calc-card"><div class="card-title">The lonely minus sign</div><div class="card-body">$\\cos A - \\cos B$ has an extra <strong>minus</strong> in front. Don't forget it — it flips the sign of the whole answer.</div></div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE — sin+sin</div><div class="example-body"><strong>Rewrite as a product:</strong> $\\sin 5x + \\sin x$.<br><br>Average: $\\tfrac{5x + x}{2} = 3x$. Half-difference: $\\tfrac{5x - x}{2} = 2x$.<br><br>$\\sin 5x + \\sin x = 2 \\sin 3x \\cos 2x$.<br><br>One sum became one product — useful for finding roots, since a product equals zero exactly when one of its factors does.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE — cos+cos</div><div class="example-body"><strong>Rewrite:</strong> $\\cos 80^\\circ + \\cos 40^\\circ$.<br><br>Average: $\\tfrac{80 + 40}{2} = 60^\\circ$. Half-difference: $\\tfrac{80 - 40}{2} = 20^\\circ$.<br><br>$\\cos 80^\\circ + \\cos 40^\\circ = 2 \\cos 60^\\circ \\cos 20^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\cos 20^\\circ = \\cos 20^\\circ$.<br><br>A short numerical check: $\\cos 80^\\circ \\approx 0.1736$, $\\cos 40^\\circ \\approx 0.7660$, sum $\\approx 0.9397$. And $\\cos 20^\\circ \\approx 0.9397$. The identity is exact.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE — cos-cos (watch the sign)</div><div class="example-body"><strong>Rewrite:</strong> $\\cos 3x - \\cos 7x$.<br><br>Average: $\\tfrac{3x + 7x}{2} = 5x$. Half-difference: $\\tfrac{3x - 7x}{2} = -2x$.<br><br>$\\cos 3x - \\cos 7x = -2 \\sin 5x \\sin(-2x) = -2 \\sin 5x \\cdot (-\\sin 2x) = 2 \\sin 5x \\sin 2x$.<br><br>The minus-2 of the formula and the sign of $\\sin(-2x)$ combined to give a clean positive product.</div></div>`

+ `<div class="l-note"><strong>Algebraic note.</strong> If $A < B$ the half-difference $\\tfrac{A-B}{2}$ is negative. That is fine: $\\sin(-x) = -\\sin x$ and $\\cos(-x) = \\cos x$, so any negative angle inside a cosine simply disappears, and any negative angle inside a sine just flips the overall sign.</div>`

/* ============================================================
   SECTION 3: Power Reduction Formulas
   ============================================================ */
+ `<h2 class="l-title">3. Power-Reduction Formulas</h2>`

+ `<div class="calc-highlight"><strong>From squared (or cubed) trig functions to first-power ones.</strong> Anything raised to a power of 2, 3, 4, ... can be re-expressed using only first-power trig functions of multiple angles. Calculus textbooks call this the "power-reduction trick" because it makes integrals like $\\int \\sin^2 x \\, dx$ trivial.</div>`

+ `<p class="l-text">The two basic squared formulas come straight from the double-angle identity $\\cos 2\\theta = 1 - 2\\sin^2 \\theta = 2\\cos^2 \\theta - 1$, which you saw in Lesson 4. Solve for $\\sin^2$ and $\\cos^2$:</p>`

+ `<div class="calc-formula"><div class="formula-label">POWER REDUCTION — DEGREE 2</div><div class="formula-main">$$\\sin^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{2} \\qquad \\cos^2 \\theta = \\dfrac{1 + \\cos 2\\theta}{2}$$</div><div class="formula-sub">A squared function (with one angle) becomes a first-power function (with the doubled angle).</div></div>`

+ `<p class="l-text"><strong>Why this is so useful.</strong> The integrals $\\int \\sin^2 x \\, dx$ and $\\int \\cos^2 x \\, dx$ cannot be handled with elementary substitution as written, but after power reduction they become</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\int \\sin^2 x \\, dx = \\int \\frac{1 - \\cos 2x}{2} \\, dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C$$</div></div>`

+ `<p class="l-text">— an immediate evaluation. The same applies in physics: the <em>average power</em> of an alternating current $i(t) = I_0 \\sin \\omega t$ over one full cycle is $\\tfrac{1}{T}\\int_0^T I_0^2 \\sin^2 \\omega t \\, dt$, and the power-reduction formula is what makes that integral easy.</p>`

+ `<div class="calc-formula"><div class="formula-label">POWER REDUCTION — TAN-SQUARED</div><div class="formula-main">$$\\tan^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{1 + \\cos 2\\theta}$$</div><div class="formula-sub">Divide the two formulas above. Useful in calculus and in optics (Brewster angle).</div></div>`

+ `<p class="l-text"><strong>Reducing a cube.</strong> Cubic powers reduce to a combination of first-power terms of the angle and its triple:</p>`

+ `<div class="calc-formula"><div class="formula-label">POWER REDUCTION — DEGREE 3</div><div class="formula-main">$$\\sin^3 \\theta = \\dfrac{3 \\sin \\theta - \\sin 3\\theta}{4} \\qquad \\cos^3 \\theta = \\dfrac{3 \\cos \\theta + \\cos 3\\theta}{4}$$</div><div class="formula-sub">Derived from the triple-angle formulas $\\sin 3\\theta = 3 \\sin \\theta - 4 \\sin^3 \\theta$ and $\\cos 3\\theta = 4 \\cos^3 \\theta - 3 \\cos \\theta$.</div></div>`

+ `<div class="calc-example"><div class="example-label">DERIVING THE SIN-CUBED FORMULA</div><div class="example-body">Start from $\\sin 3\\theta = 3 \\sin \\theta - 4 \\sin^3 \\theta$. Solve for $\\sin^3 \\theta$:<br><br>$4 \\sin^3 \\theta = 3 \\sin \\theta - \\sin 3\\theta$<br>$\\sin^3 \\theta = \\dfrac{3 \\sin \\theta - \\sin 3\\theta}{4}$.<br><br>That is exactly the formula above. No memorisation required: if you remember the triple-angle identities, you can re-derive these in two lines.</div></div>`

+ `<div class="l-note"><strong>Higher powers.</strong> $\\sin^4 \\theta$ and $\\cos^4 \\theta$ can be reduced by applying the degree-2 formula twice (square the result of $\\sin^2 \\theta$). The general principle: every even power becomes a sum of cosines of even multiples of the angle; every odd power becomes a sum of sines (or cosines) of odd multiples.</div>`

/* ============================================================
   SECTION 4: What Are These Formulas For?
   ============================================================ */
+ `<h2 class="l-title">4. What Are These Formulas For?</h2>`

+ `<p class="l-text">Identities for their own sake are not particularly interesting. The reason these three families matter is that they appear in three concrete and very different situations:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Calculus — integration</div><div class="card-body">Integrals of products such as $\\int \\sin mx \\cos nx \\, dx$ require product-to-sum to become integrable. Integrals of even powers such as $\\int \\cos^2 x \\, dx$ require power reduction.</div></div>`
+ `<div class="calc-card"><div class="card-title">Equation solving</div><div class="card-body">An equation like $\\sin 5x + \\sin 3x = 0$ factors instantly after sum-to-product: $2 \\sin 4x \\cos x = 0$, so $\\sin 4x = 0$ or $\\cos x = 0$.</div></div>`
+ `<div class="calc-card"><div class="card-title">Sound and waves</div><div class="card-body">Two pure tones of nearby frequency added together produce <em>beats</em>. The audible "wobble" envelope is given by the sum-to-product formula.</div></div>`
+ `</div>`

+ `<p class="l-text"><strong>The beat phenomenon, in formulas.</strong> Two acoustic waves with frequencies $f_1$ and $f_2$ (close in value) have combined displacement</p>`

+ `<div class="calc-formula"><div class="formula-main">$$y(t) = \\sin(2\\pi f_1 t) + \\sin(2\\pi f_2 t) = 2 \\sin\\!\\left(2\\pi\\,\\tfrac{f_1+f_2}{2}\\, t\\right) \\cos\\!\\left(2\\pi\\,\\tfrac{f_1-f_2}{2}\\, t\\right).$$</div><div class="formula-sub">The fast-oscillating sine carries the "average pitch"; the slow-oscillating cosine modulates the volume — that is the beat.</div></div>`

+ `<p class="l-text">Two strings tuned to 440 Hz and 442 Hz produce a beat at $\\tfrac{|442 - 440|}{2} \\times 2 = 2$ Hz — two wobbles per second. Piano tuners listen for exactly these beats: when the wobble vanishes, the two strings are perfectly in tune. The whole craft rests on the sum-to-product formula.</p>`

/* ============================================================
   SECTION 5: Derivation from Sum/Difference Formulas
   ============================================================ */
+ `<h2 class="l-title">5. Derivation from Sum and Difference Formulas</h2>`

+ `<p class="l-text">Every product-to-sum formula falls out by adding or subtracting the sum and difference identities from Lesson 4. Let us derive one in detail so that you can do all the others on your own.</p>`

+ `<div class="calc-formula"><div class="formula-label">STARTING POINT (from Lesson 4)</div><div class="formula-main">$$\\cos(A - B) = \\cos A \\cos B + \\sin A \\sin B$$ $$\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B$$</div><div class="formula-sub">These two identities are the only ingredients we need.</div></div>`

+ `<p class="l-text"><strong>Subtract the second from the first:</strong></p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\cos(A - B) - \\cos(A + B) = (\\cos A \\cos B + \\sin A \\sin B) - (\\cos A \\cos B - \\sin A \\sin B) = 2 \\sin A \\sin B.$$</div></div>`

+ `<p class="l-text">Divide both sides by 2:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\sin A \\sin B = \\tfrac{1}{2}\\bigl[\\cos(A - B) - \\cos(A + B)\\bigr].$$</div><div class="formula-sub">That is the first product-to-sum formula, derived from scratch in three lines.</div></div>`

+ `<p class="l-text"><strong>Adding instead of subtracting</strong> gives the $\\cos A \\cos B$ formula:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\cos(A - B) + \\cos(A + B) = 2 \\cos A \\cos B \\implies \\cos A \\cos B = \\tfrac{1}{2}\\bigl[\\cos(A - B) + \\cos(A + B)\\bigr].$$</div></div>`

+ `<p class="l-text"><strong>The sin times cos formula</strong> comes from the sine sum and difference instead:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\sin(A + B) + \\sin(A - B) = 2 \\sin A \\cos B \\implies \\sin A \\cos B = \\tfrac{1}{2}\\bigl[\\sin(A + B) + \\sin(A - B)\\bigr].$$</div></div>`

+ `<p class="l-text"><strong>From product-to-sum to sum-to-product.</strong> Each sum-to-product formula is the same identity rewritten with a substitution. Set $u = A + B$ and $v = A - B$ so that $A = \\tfrac{u+v}{2}$ and $B = \\tfrac{u-v}{2}$. Substituting these into $\\sin A \\cos B = \\tfrac{1}{2}[\\sin(A+B) + \\sin(A-B)]$ produces</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\sin u + \\sin v = 2 \\sin\\!\\left(\\tfrac{u+v}{2}\\right) \\cos\\!\\left(\\tfrac{u-v}{2}\\right).$$</div><div class="formula-sub">After renaming $u$ back to $A$ and $v$ back to $B$, this is the first sum-to-product formula. The other three are obtained by analogous substitutions.</div></div>`

+ `<div class="think-box"><div class="think-label">TRY IT YOURSELF</div><div class="think-body">Take the $\\cos A \\cos B$ product-to-sum identity and perform the same substitution $u = A + B$, $v = A - B$. Confirm that you obtain $\\cos u + \\cos v = 2 \\cos\\!\\bigl(\\tfrac{u+v}{2}\\bigr) \\cos\\!\\bigl(\\tfrac{u-v}{2}\\bigr)$. This kind of direct derivation is far more reliable than memorising the formulas as eight isolated facts.</div></div>`

/* ============================================================
   SECTION 6: Practical Examples
   ============================================================ */
+ `<h2 class="l-title">6. Practical Examples</h2>`

+ `<p class="l-text">Let us put the formulas to work on two classic numerical problems and then on an equation.</p>`

+ `<div class="calc-example"><div class="example-label">EXAMPLE 1 — sin 75 deg * sin 15 deg</div><div class="example-body"><strong>Compute exactly:</strong> $\\sin 75^\\circ \\sin 15^\\circ$.<br><br>Use $\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$:<br><br>$\\sin 75^\\circ \\sin 15^\\circ = \\tfrac{1}{2}\\bigl[\\cos(75^\\circ - 15^\\circ) - \\cos(75^\\circ + 15^\\circ)\\bigr]$<br>$= \\tfrac{1}{2}\\bigl[\\cos 60^\\circ - \\cos 90^\\circ\\bigr]$<br>$= \\tfrac{1}{2}\\bigl[\\tfrac{1}{2} - 0\\bigr]$<br>$= \\tfrac{1}{4}$.<br><br>Direct calculator check: $\\sin 75^\\circ \\approx 0.9659$, $\\sin 15^\\circ \\approx 0.2588$, product $\\approx 0.2500$. Exact.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXAMPLE 2 — cos 80 deg + cos 40 deg</div><div class="example-body"><strong>Compute exactly:</strong> $\\cos 80^\\circ + \\cos 40^\\circ$.<br><br>Use $\\cos A + \\cos B = 2 \\cos\\!\\bigl(\\tfrac{A+B}{2}\\bigr)\\cos\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ with $A = 80^\\circ$, $B = 40^\\circ$:<br><br>$\\cos 80^\\circ + \\cos 40^\\circ = 2 \\cos 60^\\circ \\cos 20^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\cos 20^\\circ = \\cos 20^\\circ$.<br><br>So the awkward sum simplifies to a single cosine of a small angle.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXAMPLE 3 — solve the equation</div><div class="example-body"><strong>Solve on $[0, 2\\pi)$:</strong> $\\sin 5x - \\sin 3x = 0$.<br><br>Apply $\\sin A - \\sin B = 2 \\cos\\!\\bigl(\\tfrac{A+B}{2}\\bigr)\\sin\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ with $A = 5x$, $B = 3x$:<br><br>$\\sin 5x - \\sin 3x = 2 \\cos 4x \\sin x = 0$.<br><br>Either $\\cos 4x = 0$ or $\\sin x = 0$.<br><br>$\\sin x = 0 \\Rightarrow x = 0, \\pi$.<br>$\\cos 4x = 0 \\Rightarrow 4x = \\tfrac{\\pi}{2} + k\\pi \\Rightarrow x = \\tfrac{\\pi}{8} + \\tfrac{k\\pi}{4}$ for $k = 0, 1, \\dots, 7$.<br><br>Combining and discarding duplicates gives ten solutions in $[0, 2\\pi)$. A problem that looks hard becomes a one-line factoring.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXAMPLE 4 — integrate using power reduction</div><div class="example-body"><strong>Evaluate:</strong> $\\int_0^{\\pi/2} \\cos^2 x \\, dx$.<br><br>Use $\\cos^2 x = \\tfrac{1 + \\cos 2x}{2}$:<br><br>$\\int_0^{\\pi/2} \\cos^2 x \\, dx = \\int_0^{\\pi/2} \\tfrac{1 + \\cos 2x}{2}\\, dx = \\Bigl[\\tfrac{x}{2} + \\tfrac{\\sin 2x}{4}\\Bigr]_0^{\\pi/2}$<br><br>$= \\Bigl(\\tfrac{\\pi}{4} + \\tfrac{\\sin \\pi}{4}\\Bigr) - (0 + 0) = \\tfrac{\\pi}{4}$.<br><br>The integral of $\\cos^2 x$ from 0 to $\\tfrac{\\pi}{2}$ is exactly $\\tfrac{\\pi}{4}$. By the same trick $\\int_0^{\\pi/2} \\sin^2 x \\, dx = \\tfrac{\\pi}{4}$ as well — the two squared sinusoids "share" the constant 1 equally on average.</div></div>`

/* --- Plotly: Beats (sum-to-product visualisation) --- */
+ `<div id="plot-beats-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var xs=[];var ys=[];var env=[];`
+ `for(var i=0;i<800;i++){var t=i/40;xs.push(t);`
+ `var a=Math.sin(2*Math.PI*1.0*t);var b=Math.sin(2*Math.PI*1.1*t);`
+ `ys.push(a+b);env.push(2*Math.cos(2*Math.PI*0.05*t));}`
+ `var t1={x:xs,y:ys,mode:"lines",name:"sin(2pi*1*t) + sin(2pi*1.1*t)",line:{color:"#c8a96e",width:1.8}};`
+ `var t2={x:xs,y:env,mode:"lines",name:"envelope +/- 2 cos(2pi*0.05*t)",line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var envN=env.map(function(v){return -v;});`
+ `var t3={x:xs,y:envN,mode:"lines",showlegend:false,line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (seconds)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"amplitude",range:[-2.4,2.4]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};`
+ `Plotly.newPlot("plot-beats-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});`
+ `},100)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The sum of two close-frequency sine waves (1.0 Hz and 1.1 Hz) is itself a sinusoid at the average frequency (1.05 Hz) whose amplitude rises and falls slowly at the half-difference frequency (0.05 Hz). The dotted red curves are the slow-moving envelope $\\pm 2 \\cos(2\\pi \\cdot 0.05 \\cdot t)$ predicted by the sum-to-product formula. This "wobble" is what musicians hear as beats.</div></div>`

/* --- Plotly: product of two sines as a beat-like pattern --- */
+ `<div id="plot-product-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var xs=[];var prod=[];var ra=[];var rb=[];`
+ `for(var i=0;i<800;i++){var t=i/40;xs.push(t);`
+ `var p=Math.sin(2*Math.PI*1.05*t)*Math.cos(2*Math.PI*0.05*t);prod.push(2*p);`
+ `ra.push(2*Math.cos(2*Math.PI*0.05*t));rb.push(-2*Math.cos(2*Math.PI*0.05*t));}`
+ `var t1={x:xs,y:prod,mode:"lines",name:"2 sin(2pi*1.05*t) cos(2pi*0.05*t)",line:{color:"#86efac",width:1.8}};`
+ `var t2={x:xs,y:ra,mode:"lines",name:"envelope +/- 2 cos(2pi*0.05*t)",line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var t3={x:xs,y:rb,mode:"lines",showlegend:false,line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (seconds)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"amplitude",range:[-2.4,2.4]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};`
+ `Plotly.newPlot("plot-product-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});`
+ `},100)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The product form $2 \\sin(2\\pi \\cdot 1.05 \\cdot t) \\cos(2\\pi \\cdot 0.05 \\cdot t)$ is identical to the previous sum form. The sum-to-product formula is the algebraic translation between the two viewpoints. Compare with the graph above — the two curves are the same function, plotted from two different formulas.</div></div>`

/* --- Plotly: Double-angle as product-to-sum: 2 sin(x) cos(x) vs sin(2x) --- */
+ `<p class="l-text"><strong>A clean visual check of the double-angle identity.</strong> Apply the product-to-sum formula to $\\sin x \\cos x$ with $A = B = x$: $\\sin x \\cos x = \\tfrac{1}{2}[\\sin(2x) + \\sin(0)] = \\tfrac{1}{2}\\sin 2x$, so $2\\sin x \\cos x = \\sin 2x$. The graph below plots both sides on the same axes — they coincide everywhere, which is what an exact identity looks like.</p>`

+ `<div id="plot-doubleangle-en-extra" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var xs=[];var y1=[];var y2=[];`
+ `for(var i=0;i<=600;i++){var x=-2*Math.PI+(i/600)*4*Math.PI;xs.push(x);`
+ `y1.push(2*Math.sin(x)*Math.cos(x));y2.push(Math.sin(2*x));}`
+ `var t1={x:xs,y:y1,mode:"lines",name:"2 sin(x) cos(x)",line:{color:"#3b82f6",width:3}};`
+ `var t2={x:xs,y:y2,mode:"lines",name:"sin(2x)",line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radians)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"value",range:[-1.3,1.3]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};`
+ `Plotly.newPlot("plot-doubleangle-en-extra",[t1,t2],layout,{responsive:true,displayModeBar:false});`
+ `},100)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The solid blue curve is $2\\sin x \\cos x$ — a product of two first-power trig functions. The dotted red curve is $\\sin 2x$ — a single first-power sine of the doubled angle. The two curves sit exactly on top of each other across the entire range $[-2\\pi, 2\\pi]$: visual confirmation that $2 \\sin x \\cos x = \\sin 2x$. This is the double-angle formula seen from the product-to-sum perspective.</div></div>`

/* --- Identities summary table (EN) --- */
+ `<h3 class="l-title" style="font-size:1.05rem;margin-top:2rem">Identity reference table</h3>`

+ `<p class="l-text">Use this compact reference to recognise which family of identity applies in a problem at a glance:</p>`

+ `<div style="overflow-x:auto;margin:1.2rem 0">`
+ `<table style="width:100%;border-collapse:collapse;background:rgba(20,22,28,0.55);color:#ebe6dc;font-size:0.9rem;border:1px solid rgba(255,255,255,0.08);border-radius:6px;overflow:hidden">`
+ `<thead><tr style="background:#3b82f6;color:#0b1020">`
+ `<th style="padding:0.65rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.03em">Identity family</th>`
+ `<th style="padding:0.65rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.03em">Formula</th>`
+ `<th style="padding:0.65rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.03em">Quick example</th>`
+ `</tr></thead>`
+ `<tbody>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Product-to-sum</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 75^\\circ \\sin 15^\\circ = \\tfrac{1}{2}(\\cos 60^\\circ - \\cos 90^\\circ) = \\tfrac{1}{4}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Sum-to-product</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin A + \\sin B = 2 \\sin\\!\\bigl(\\tfrac{A+B}{2}\\bigr)\\cos\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 5x + \\sin x = 2 \\sin 3x \\cos 2x$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Power reduction (sin&sup2;)</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{2}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\int \\sin^2 x \\, dx = \\tfrac{x}{2} - \\tfrac{\\sin 2x}{4} + C$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Power reduction (cos&sup2;)</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\cos^2 \\theta = \\dfrac{1 + \\cos 2\\theta}{2}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\int_0^{\\pi/2} \\cos^2 x \\, dx = \\tfrac{\\pi}{4}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Power reduction (tan&sup2;)</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\tan^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{1 + \\cos 2\\theta}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\tan^2(\\pi/6) = \\tfrac{1 - \\cos(\\pi/3)}{1 + \\cos(\\pi/3)} = \\tfrac{1/2}{3/2} = \\tfrac{1}{3}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Double-angle</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$,&nbsp; $\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 60^\\circ = 2 \\sin 30^\\circ \\cos 30^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\tfrac{\\sqrt{3}}{2} = \\tfrac{\\sqrt{3}}{2}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Half-angle</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin\\!\\bigl(\\tfrac{\\theta}{2}\\bigr) = \\pm \\sqrt{\\dfrac{1 - \\cos \\theta}{2}}$,&nbsp; $\\cos\\!\\bigl(\\tfrac{\\theta}{2}\\bigr) = \\pm \\sqrt{\\dfrac{1 + \\cos \\theta}{2}}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 15^\\circ = \\sqrt{\\tfrac{1 - \\cos 30^\\circ}{2}} = \\tfrac{\\sqrt{2 - \\sqrt{3}}}{2}$</td></tr>`
+ `</tbody></table>`
+ `</div>`

/* ============================================================
   SECTION 7: Classical Exercises
   ============================================================ */
+ `<h2 class="l-title">7. Classical Exercises</h2>`

+ `<p class="l-text">Try each problem on paper before peeking at the solution. Aim to <em>recognise</em> which family of formulas applies, then apply it carefully.</p>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Simplify:</strong> $\\sin 50^\\circ + \\sin 10^\\circ$.<br><br><em>Solution.</em> Sum-to-product with $A = 50^\\circ$, $B = 10^\\circ$: average $30^\\circ$, half-difference $20^\\circ$.<br>$\\sin 50^\\circ + \\sin 10^\\circ = 2 \\sin 30^\\circ \\cos 20^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\cos 20^\\circ = \\cos 20^\\circ$.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Compute:</strong> $\\cos 105^\\circ - \\cos 15^\\circ$.<br><br><em>Solution.</em> $\\cos A - \\cos B = -2 \\sin\\!\\bigl(\\tfrac{A+B}{2}\\bigr) \\sin\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ with $A=105^\\circ$, $B=15^\\circ$. Average $60^\\circ$, half-difference $45^\\circ$.<br>$\\cos 105^\\circ - \\cos 15^\\circ = -2 \\sin 60^\\circ \\sin 45^\\circ = -2 \\cdot \\tfrac{\\sqrt{3}}{2} \\cdot \\tfrac{\\sqrt{2}}{2} = -\\tfrac{\\sqrt{6}}{2}$.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Rewrite:</strong> $\\sin^2 x - \\sin^2 y$.<br><br><em>Solution.</em> Power-reduce each term: $\\sin^2 x = \\tfrac{1 - \\cos 2x}{2}$ and $\\sin^2 y = \\tfrac{1 - \\cos 2y}{2}$. Subtract:<br>$\\sin^2 x - \\sin^2 y = \\tfrac{(1 - \\cos 2x) - (1 - \\cos 2y)}{2} = \\tfrac{\\cos 2y - \\cos 2x}{2}$.<br>Apply $\\cos A - \\cos B = -2 \\sin\\!\\bigl(\\tfrac{A+B}{2}\\bigr) \\sin\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ with $A = 2y$, $B = 2x$:<br>$= \\tfrac{1}{2}\\bigl[-2 \\sin(x + y) \\sin(y - x)\\bigr] = \\sin(x + y) \\sin(x - y)$. A famous identity: $\\sin^2 x - \\sin^2 y = \\sin(x+y) \\sin(x-y)$.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Evaluate exactly:</strong> $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ$.<br><br><em>Solution.</em> A classical telescoping product. Multiply by $\\sin 20^\\circ$ and use $\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$ repeatedly:<br>$\\sin 20^\\circ \\cdot \\cos 20^\\circ = \\tfrac{1}{2}\\sin 40^\\circ$.<br>$\\sin 40^\\circ \\cdot \\cos 40^\\circ = \\tfrac{1}{2}\\sin 80^\\circ$.<br>$\\sin 80^\\circ \\cdot \\cos 80^\\circ = \\tfrac{1}{2}\\sin 160^\\circ$.<br>Combining: $\\sin 20^\\circ \\cdot \\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ = \\tfrac{1}{8} \\sin 160^\\circ = \\tfrac{1}{8} \\sin 20^\\circ$.<br>Divide by $\\sin 20^\\circ$ (nonzero): $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ = \\tfrac{1}{8}$.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Solve on $[0, 2\\pi)$:</strong> $\\cos x + \\cos 3x + \\cos 5x = 0$.<br><br><em>Solution.</em> Group the outer two: $\\cos x + \\cos 5x = 2 \\cos 3x \\cos 2x$ (average $3x$, half-difference $-2x$, and $\\cos$ is even).<br>The equation becomes $2 \\cos 3x \\cos 2x + \\cos 3x = 0$, or $\\cos 3x (2 \\cos 2x + 1) = 0$.<br>Two cases: $\\cos 3x = 0$ gives $3x = \\tfrac{\\pi}{2} + k\\pi$, so $x = \\tfrac{\\pi}{6} + \\tfrac{k\\pi}{3}$. And $\\cos 2x = -\\tfrac{1}{2}$ gives $2x = \\tfrac{2\\pi}{3} + 2k\\pi$ or $2x = \\tfrac{4\\pi}{3} + 2k\\pi$, so $x = \\tfrac{\\pi}{3} + k\\pi$ or $x = \\tfrac{2\\pi}{3} + k\\pi$.<br>Listing all solutions in $[0, 2\\pi)$: many, of which the simplest are $\\tfrac{\\pi}{6}, \\tfrac{\\pi}{3}, \\tfrac{\\pi}{2}, \\tfrac{2\\pi}{3}, \\tfrac{5\\pi}{6}, \\tfrac{7\\pi}{6}, \\tfrac{4\\pi}{3}, \\tfrac{3\\pi}{2}, \\tfrac{5\\pi}{3}, \\tfrac{11\\pi}{6}$.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 6 — proof</div><div class="example-body"><strong>Prove:</strong> $\\sin 3\\theta = 3 \\sin \\theta - 4 \\sin^3 \\theta$.<br><br><em>Solution.</em> Write $\\sin 3\\theta = \\sin(2\\theta + \\theta)$ and use sum: $= \\sin 2\\theta \\cos \\theta + \\cos 2\\theta \\sin \\theta$.<br>Substitute $\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$ and $\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$:<br>$= 2 \\sin \\theta \\cos^2 \\theta + (1 - 2 \\sin^2 \\theta) \\sin \\theta$.<br>Use $\\cos^2 \\theta = 1 - \\sin^2 \\theta$:<br>$= 2 \\sin \\theta (1 - \\sin^2 \\theta) + \\sin \\theta - 2 \\sin^3 \\theta$<br>$= 2 \\sin \\theta - 2 \\sin^3 \\theta + \\sin \\theta - 2 \\sin^3 \\theta$<br>$= 3 \\sin \\theta - 4 \\sin^3 \\theta$. <span style="color:#86efac">QED</span></div></div>`

+ `<div class="l-note"><strong>Summary of the lesson.</strong> Products become sums (and vice versa) via the four-line identity family of Section 1-2. Squares and cubes of sines and cosines reduce to first-power expressions of multiple angles (Section 3). All formulas come from the Lesson 4 sum-and-difference identities by adding, subtracting, or substituting (Section 5). Use them to integrate, to solve equations, and to understand the physics of beats.</div>`,

tr: `<p class="l-text"><strong>Ders 5: Trigonometrik Ozdeslikler II.</strong> Ders 4'te Pisagor ozdesligi ve toplam/fark formulleri ile tanistik. Bu derste o dort kose tasi, guclu bir alet cantasina donusur: <em>carpim-toplam</em>, <em>toplam-carpim</em> ve <em>guc indirgeme</em> formulleri. Ilk bakista korkutucu gorunseler de, her biri $\\sin(A+B)$ veya $\\cos(A+B)$ aciliminin $\\sin(A-B)$ veya $\\cos(A-B)$ ile toplanmasi (ya da cikarilmasi) sonucudur. Birini ogrenirseniz, digerlerini tek bir kagit uzerinde yeniden turetebilirsiniz.</p>`

+ `<p class="l-text">Bu formuller her yerde karsimiza cikar. $\\int \\sin 5x \\cos 3x \\, dx$ gibi kalkulus integralleri once carpim-toplam donusumu gerektirir. Birbirine yakin frekansli iki ses dalgasinin fiziksel girisimi "vurum" uretir; vurum zarfi toplam-carpim formulu ile tarif edilir. $\\sin 3x + \\sin x = 0$ gibi bir denklemi cozmek, toplam-carpim adimindan sonra tek satirlik bir carpanlara ayirmaya donusur. Bu dersin sonunda her bir bu durumu taniyip dogru ozdeslige refleks gibi uzanacaksiniz.</p>`

+ `<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">`
+ `<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE OGRENECEKSINIZ</div>`
+ `<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">`
+ `<li>Iki trig fonksiyonunun carpimini toplam veya farka cevirme (carpim-toplam)</li>`
+ `<li>Iki trig fonksiyonunun toplam veya farkini carpima cevirme (toplam-carpim)</li>`
+ `<li>$\\sin^2\\theta$, $\\cos^2\\theta$ ve $\\sin^3\\theta$ ifadelerini birinci dereceye indirgeme</li>`
+ `<li>Bu dersteki her formulu, Ders 4'un toplam/fark ozdesliklerinden turetebilme</li>`
+ `<li>$\\sin 75^\\circ \\cdot \\sin 15^\\circ$ gibi zor gorunen sayisal ifadeleri hesap makinesi kullanmadan degerlendirme</li>`
+ `<li>$\\cos 5x + \\cos x = 0$ gibi denklemleri toplam-carpim ile carpanlara ayirarak cozme</li>`
+ `</ul>`
+ `</div>`

/* ============================================================
   BOLUM 1: Carpim-Toplam Formulleri
   ============================================================ */
+ `<h2 class="l-title">1. Carpim-Toplam Formulleri</h2>`

+ `<div class="calc-highlight"><strong>Tek cumleyle fikir:</strong> iki sinusun (ya da iki kosinusun, ya da bir sinus ile bir kosinusun) carpimi, daima tek basina trig fonksiyonlarinin <em>toplami</em> veya <em>farki</em> seklinde yeniden yazilabilir. Carpimlari integre etmek ve elle hesaplamak zordur; toplamlar kolaydir. Bu yuzden bu manevra tum trigonometrideki en yararli tekniklerden biridir.</div>`

+ `<p class="l-text">Bu ailede uc formul vardir: biri sin*sin icin, biri cos*cos icin, biri sin*cos icin. Pratikte grup halinde hatirlamalisiniz:</p>`

+ `<div class="calc-formula"><div class="formula-label">CARPIM-TOPLAM (UC FORMUL)</div><div class="formula-main">$$\\begin{aligned} \\sin A \\sin B &= \\tfrac{1}{2}\\bigl[\\cos(A-B) - \\cos(A+B)\\bigr] \\\\ \\cos A \\cos B &= \\tfrac{1}{2}\\bigl[\\cos(A-B) + \\cos(A+B)\\bigr] \\\\ \\sin A \\cos B &= \\tfrac{1}{2}\\bigl[\\sin(A+B) + \\sin(A-B)\\bigr] \\end{aligned}$$</div><div class="formula-sub">Soldaki her carpim, sagda tek trig degerlerinin toplaminin veya farkinin yarisi olur.</div></div>`

+ `<p class="l-text"><strong>Formulleri okumak.</strong> Oruntuye bakin. Sag taraf daima $A+B$ ve $A-B$ kombinasyonlarini icerir. Sag tarafta sinus mu kosinus mu olacagi, soldakine baglidir:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">sin*sin</div><div class="card-body">Sag taraf <strong>kosinusler</strong> kullanir. Eksi isareti $\\cos(A+B)$'nin onundedir: "toplam-aci kosinusunu cikar" diye dusunun.</div></div>`
+ `<div class="calc-card"><div class="card-title">cos*cos</div><div class="card-body">Sag taraf yine <strong>kosinusler</strong> kullanir. Iki terim de arti isaretlidir: "iki kosinusu topla."</div></div>`
+ `<div class="calc-card"><div class="card-title">sin*cos</div><div class="card-body">Sag taraf <strong>sinusler</strong> kullanir. Once toplam-aci sinusu, sonra fark-aci sinusu eklenir.</div></div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">COZUMLU ORNEK — sin*sin</div><div class="example-body"><strong>Kosinus farkina donusturun:</strong> $\\sin 7x \\sin 3x$.<br><br>$\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$ formulunu $A = 7x$, $B = 3x$ ile uygulayin:<br><br>$\\sin 7x \\sin 3x = \\tfrac{1}{2}\\bigl[\\cos(7x - 3x) - \\cos(7x + 3x)\\bigr] = \\tfrac{1}{2}\\bigl[\\cos 4x - \\cos 10x\\bigr]$.<br><br>Soldaki carpim, sagda temiz bir toplama donustu; integre etmek, cizmek ya da turev almak cok daha kolay.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZUMLU ORNEK — cos*cos</div><div class="example-body"><strong>Donusturun:</strong> $2\\cos 5x \\cos 2x$.<br><br>$\\cos A \\cos B = \\tfrac{1}{2}[\\cos(A-B) + \\cos(A+B)]$ formulunu $A = 5x$, $B = 2x$ ile uygulayin. Bastaki 2, formuldeki $\\tfrac{1}{2}$ ile sadelesir:<br><br>$2 \\cdot \\tfrac{1}{2}\\bigl[\\cos(5x - 2x) + \\cos(5x + 2x)\\bigr] = \\cos 3x + \\cos 7x$.<br><br>Bu ozel kombinasyonun fizikte sik cikmasinin nedeni budur; kesirsiz katsayili temiz bir toplam uretir.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZUMLU ORNEK — sin*cos</div><div class="example-body"><strong>Donusturun:</strong> $\\sin 4x \\cos x$.<br><br>$\\sin A \\cos B = \\tfrac{1}{2}[\\sin(A+B) + \\sin(A-B)]$ formulunu $A = 4x$, $B = x$ ile uygulayin:<br><br>$\\sin 4x \\cos x = \\tfrac{1}{2}\\bigl[\\sin 5x + \\sin 3x\\bigr]$.</div></div>`

+ `<div class="think-box"><div class="think-label">HIZLI BIR DENEME</div><div class="think-body">cos*cos formulunu kullanarak $\\cos 75^\\circ \\cos 15^\\circ$ hesaplayin. $A = 75^\\circ$ ve $B = 15^\\circ$ ile: $\\tfrac{1}{2}[\\cos 60^\\circ + \\cos 90^\\circ] = \\tfrac{1}{2}[\\tfrac{1}{2} + 0] = \\tfrac{1}{4}$. Dogrudan hesapla karsilastirin: $\\cos 75^\\circ \\approx 0{,}2588$ ve $\\cos 15^\\circ \\approx 0{,}9659$; carpim $\\approx 0{,}2500 = \\tfrac{1}{4}$. Formul tam.</div></div>`

/* ============================================================
   BOLUM 2: Toplam-Carpim Formulleri
   ============================================================ */
+ `<h2 class="l-title">2. Toplam-Carpim Formulleri</h2>`

+ `<div class="calc-highlight"><strong>Ters yon.</strong> Carpim-toplam formulleri carpmayi toplamaya donusturdu. Toplam-carpim formulleri tam tersini yapar: iki sinusun (veya iki kosinusun) toplam ya da farkini tek bir carpima donusturur. Bu, trigonometrik denklemleri <em>carpanlara ayirmanin</em> en onemli aracidir.</div>`

+ `<p class="l-text">Dort formul vardir; iki toplam, iki fark icin:</p>`

+ `<div class="calc-formula"><div class="formula-label">TOPLAM-CARPIM (DORT FORMUL)</div><div class="formula-main">$$\\begin{aligned} \\sin A + \\sin B &= 2 \\sin\\!\\left(\\tfrac{A+B}{2}\\right) \\cos\\!\\left(\\tfrac{A-B}{2}\\right) \\\\ \\sin A - \\sin B &= 2 \\cos\\!\\left(\\tfrac{A+B}{2}\\right) \\sin\\!\\left(\\tfrac{A-B}{2}\\right) \\\\ \\cos A + \\cos B &= 2 \\cos\\!\\left(\\tfrac{A+B}{2}\\right) \\cos\\!\\left(\\tfrac{A-B}{2}\\right) \\\\ \\cos A - \\cos B &= -2 \\sin\\!\\left(\\tfrac{A+B}{2}\\right) \\sin\\!\\left(\\tfrac{A-B}{2}\\right) \\end{aligned}$$</div><div class="formula-sub">Ortalama $\\tfrac{A+B}{2}$ ve yari-fark $\\tfrac{A-B}{2}$ her formulde gorunur. Sekiz bagimsiz denklem degil, oruntuyu ezberleyin.</div></div>`

+ `<p class="l-text"><strong>Oruntu.</strong> Her sag taraf ayni iskeleti tasir: $2 \\cdot (\\text{ortalamanin bir fonksiyonu}) \\cdot (\\text{yari-farkin bir fonksiyonu})$. Uc ayrinti satirdan satira degisir:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Sinus mu kosinus mu?</div><div class="card-body">Solda sinusler varsa sagda sin*cos olur. Solda kosinusler varsa sagda cos*cos (toplam) veya sin*sin (fark) olur. Aileleri eslestirin.</div></div>`
+ `<div class="calc-card"><div class="card-title">Ortalama-yari-fark sirasi</div><div class="card-body">$\\sin A + \\sin B$ icin: ortalama sin icinde. $\\sin A - \\sin B$ icin: ortalama cos icinde. Toplama cikarmaya donusunce sin ve cos rol degistirir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Yalniz eksi isareti</div><div class="card-body">$\\cos A - \\cos B$'nin onunde ekstra bir <strong>eksi</strong> vardir. Unutmayin; tum cevabin isaretini ters cevirir.</div></div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">COZUMLU ORNEK — sin+sin</div><div class="example-body"><strong>Carpim olarak yazin:</strong> $\\sin 5x + \\sin x$.<br><br>Ortalama: $\\tfrac{5x + x}{2} = 3x$. Yari-fark: $\\tfrac{5x - x}{2} = 2x$.<br><br>$\\sin 5x + \\sin x = 2 \\sin 3x \\cos 2x$.<br><br>Bir toplam tek bir carpima donustu; kokleri bulmak icin ideal, cunku bir carpim ancak carpanlarindan biri sifir oldugunda sifirdir.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZUMLU ORNEK — cos+cos</div><div class="example-body"><strong>Hesaplayin:</strong> $\\cos 80^\\circ + \\cos 40^\\circ$.<br><br>Ortalama: $\\tfrac{80 + 40}{2} = 60^\\circ$. Yari-fark: $\\tfrac{80 - 40}{2} = 20^\\circ$.<br><br>$\\cos 80^\\circ + \\cos 40^\\circ = 2 \\cos 60^\\circ \\cos 20^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\cos 20^\\circ = \\cos 20^\\circ$.<br><br>Kisa sayisal kontrol: $\\cos 80^\\circ \\approx 0{,}1736$, $\\cos 40^\\circ \\approx 0{,}7660$, toplam $\\approx 0{,}9397$. Ve $\\cos 20^\\circ \\approx 0{,}9397$. Ozdeslik tam.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZUMLU ORNEK — cos-cos (isarete dikkat)</div><div class="example-body"><strong>Donusturun:</strong> $\\cos 3x - \\cos 7x$.<br><br>Ortalama: $\\tfrac{3x + 7x}{2} = 5x$. Yari-fark: $\\tfrac{3x - 7x}{2} = -2x$.<br><br>$\\cos 3x - \\cos 7x = -2 \\sin 5x \\sin(-2x) = -2 \\sin 5x \\cdot (-\\sin 2x) = 2 \\sin 5x \\sin 2x$.<br><br>Formuldeki eksi-2 ile $\\sin(-2x)$'nin isareti birlesip temiz bir pozitif carpim verdi.</div></div>`

+ `<div class="l-note"><strong>Cebirsel not.</strong> $A < B$ ise yari-fark $\\tfrac{A-B}{2}$ negatiftir. Bu sorun degildir: $\\sin(-x) = -\\sin x$ ve $\\cos(-x) = \\cos x$, yani kosinus icindeki negatif aci kaybolur, sinus icindeki negatif aci sadece toplam isareti ters cevirir.</div>`

/* ============================================================
   BOLUM 3: Guc Indirgeme Formulleri
   ============================================================ */
+ `<h2 class="l-title">3. Guc Indirgeme Formulleri</h2>`

+ `<div class="calc-highlight"><strong>Kare (ya da kup) trig fonksiyonlarindan birinci dereceye.</strong> 2, 3, 4, ... gibi kuvvetlere yukseltilen her sey, sadece coklu acilarin birinci-dereceden trig fonksiyonlari cinsinden yeniden yazilabilir. Kalkulus kitaplari buna "guc indirgeme hilesi" der; cunku $\\int \\sin^2 x \\, dx$ gibi integralleri olaganustu kolaylastirir.</div>`

+ `<p class="l-text">Iki temel kare formulu, dogrudan Ders 4'teki cift-aci ozdesligi $\\cos 2\\theta = 1 - 2\\sin^2 \\theta = 2\\cos^2 \\theta - 1$'den gelir. $\\sin^2$ ve $\\cos^2$ icin cozun:</p>`

+ `<div class="calc-formula"><div class="formula-label">GUC INDIRGEME — 2. DERECE</div><div class="formula-main">$$\\sin^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{2} \\qquad \\cos^2 \\theta = \\dfrac{1 + \\cos 2\\theta}{2}$$</div><div class="formula-sub">Karesel bir fonksiyon (tek aci), birinci-dereceden bir fonksiyon (cift aci) haline gelir.</div></div>`

+ `<p class="l-text"><strong>Bu neden bu kadar yararli?</strong> Oldugu haliyle $\\int \\sin^2 x \\, dx$ ve $\\int \\cos^2 x \\, dx$ integralleri temel yer-degistirme ile cozulmez, ama guc indirgeme sonrasi:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\int \\sin^2 x \\, dx = \\int \\frac{1 - \\cos 2x}{2} \\, dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C$$</div></div>`

+ `<p class="l-text">anlik degerlendirme. Ayni sey fizikte de gecerlidir: bir alternatif akim $i(t) = I_0 \\sin \\omega t$'nin tam bir periyot uzerindeki <em>ortalama gucu</em> $\\tfrac{1}{T}\\int_0^T I_0^2 \\sin^2 \\omega t \\, dt$'dir; guc indirgeme formulu bu integrali basitlestirir.</p>`

+ `<div class="calc-formula"><div class="formula-label">GUC INDIRGEME — TAN-KARESEL</div><div class="formula-main">$$\\tan^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{1 + \\cos 2\\theta}$$</div><div class="formula-sub">Yukaridaki iki formulu birbirine bolun. Kalkuluste ve optikte (Brewster acisi) yararlidir.</div></div>`

+ `<p class="l-text"><strong>Kupu indirgeme.</strong> Kup kuvvetler, acinin kendisinin ve uclusunun birinci-dereceden terimleriyle ifade edilir:</p>`

+ `<div class="calc-formula"><div class="formula-label">GUC INDIRGEME — 3. DERECE</div><div class="formula-main">$$\\sin^3 \\theta = \\dfrac{3 \\sin \\theta - \\sin 3\\theta}{4} \\qquad \\cos^3 \\theta = \\dfrac{3 \\cos \\theta + \\cos 3\\theta}{4}$$</div><div class="formula-sub">$\\sin 3\\theta = 3 \\sin \\theta - 4 \\sin^3 \\theta$ ve $\\cos 3\\theta = 4 \\cos^3 \\theta - 3 \\cos \\theta$ uclu-aci formullerinden turetilir.</div></div>`

+ `<div class="calc-example"><div class="example-label">SIN-KUP FORMULUNUN TURETIMI</div><div class="example-body">$\\sin 3\\theta = 3 \\sin \\theta - 4 \\sin^3 \\theta$ ifadesinden baslayin. $\\sin^3 \\theta$ icin cozun:<br><br>$4 \\sin^3 \\theta = 3 \\sin \\theta - \\sin 3\\theta$<br>$\\sin^3 \\theta = \\dfrac{3 \\sin \\theta - \\sin 3\\theta}{4}$.<br><br>Iste tam olarak yukaridaki formul. Ezberlemeye gerek yok: uclu-aci ozdesliklerini hatirliyorsaniz bunlari iki satirda yeniden turetebilirsiniz.</div></div>`

+ `<div class="l-note"><strong>Daha yuksek kuvvetler.</strong> $\\sin^4 \\theta$ ve $\\cos^4 \\theta$, 2. derece formulunu iki kez uygulayarak indirgenebilir ($\\sin^2 \\theta$ sonucunu karesini alin). Genel ilke: her cift kuvvet, acinin cift katlarinin kosinuslerinin toplami olur; her tek kuvvet, tek katlarinin sinuslerinin (veya kosinuslerinin) toplami olur.</div>`

/* ============================================================
   BOLUM 4: Bu Formuller Ne Ise Yarar?
   ============================================================ */
+ `<h2 class="l-title">4. Bu Formuller Ne Ise Yarar?</h2>`

+ `<p class="l-text">Ozdeslikler kendi baslarina pek ilginc degildir. Bu uc ailenin onemli olmasinin nedeni, uc somut ve birbirinden farkli durumda karsimiza cikmalaridir:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Kalkulus — integral</div><div class="card-body">$\\int \\sin mx \\cos nx \\, dx$ gibi carpim integralleri integre edilebilir hale gelmek icin once carpim-toplam gerektirir. $\\int \\cos^2 x \\, dx$ gibi cift kuvvet integralleri guc indirgeme gerektirir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Denklem cozme</div><div class="card-body">$\\sin 5x + \\sin 3x = 0$ gibi bir denklem, toplam-carpim sonrasi aninda carpanlara ayrilir: $2 \\sin 4x \\cos x = 0$, yani $\\sin 4x = 0$ veya $\\cos x = 0$.</div></div>`
+ `<div class="calc-card"><div class="card-title">Ses ve dalgalar</div><div class="card-body">Yakin frekansli iki saf ton toplandiginda <em>vurum</em> uretir. Duyulan "titresim" zarfi toplam-carpim formulu ile verilir.</div></div>`
+ `</div>`

+ `<p class="l-text"><strong>Vurum olgusu, formullerle.</strong> $f_1$ ve $f_2$ frekansli (birbirine yakin) iki akustik dalganin birlesik yer degistirmesi:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$y(t) = \\sin(2\\pi f_1 t) + \\sin(2\\pi f_2 t) = 2 \\sin\\!\\left(2\\pi\\,\\tfrac{f_1+f_2}{2}\\, t\\right) \\cos\\!\\left(2\\pi\\,\\tfrac{f_1-f_2}{2}\\, t\\right).$$</div><div class="formula-sub">Hizli salinan sinus "ortalama tini"yi tasir; yavas salinan kosinus ses siddetini module eder; vurum budur.</div></div>`

+ `<p class="l-text">440 Hz ve 442 Hz'e akort edilmis iki tel, saniyede $\\tfrac{|442 - 440|}{2} \\times 2 = 2$ Hz vurum uretir; saniyede iki titresim. Piyano akortculari tam olarak bu vurumlari dinler: titresim kayboldugunda iki tel mukemmel uyumdadir. Butun sanat, toplam-carpim formulune dayanir.</p>`

/* ============================================================
   BOLUM 5: Toplam/Fark Formullerinden Turetim
   ============================================================ */
+ `<h2 class="l-title">5. Toplam ve Fark Formullerinden Turetim</h2>`

+ `<p class="l-text">Her carpim-toplam formulu, Ders 4'teki toplam ve fark ozdesliklerinin toplanmasi ya da cikarilmasiyla ortaya cikar. Bir tanesini ayrintili turetelim; gerisini kendiniz yapabilirsiniz.</p>`

+ `<div class="calc-formula"><div class="formula-label">BASLANGIC NOKTASI (Ders 4'ten)</div><div class="formula-main">$$\\cos(A - B) = \\cos A \\cos B + \\sin A \\sin B$$ $$\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B$$</div><div class="formula-sub">Ihtiyacimiz olan tek malzeme bu iki ozdesliktir.</div></div>`

+ `<p class="l-text"><strong>Ikinciyi birincisinden cikarin:</strong></p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\cos(A - B) - \\cos(A + B) = (\\cos A \\cos B + \\sin A \\sin B) - (\\cos A \\cos B - \\sin A \\sin B) = 2 \\sin A \\sin B.$$</div></div>`

+ `<p class="l-text">Iki tarafi 2'ye bolun:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\sin A \\sin B = \\tfrac{1}{2}\\bigl[\\cos(A - B) - \\cos(A + B)\\bigr].$$</div><div class="formula-sub">Ilk carpim-toplam formulu, sifirdan uc satirda turetildi.</div></div>`

+ `<p class="l-text"><strong>Cikarma yerine toplama,</strong> $\\cos A \\cos B$ formulunu verir:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\cos(A - B) + \\cos(A + B) = 2 \\cos A \\cos B \\implies \\cos A \\cos B = \\tfrac{1}{2}\\bigl[\\cos(A - B) + \\cos(A + B)\\bigr].$$</div></div>`

+ `<p class="l-text"><strong>sin*cos formulu,</strong> sinus toplam ve farkindan gelir:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\sin(A + B) + \\sin(A - B) = 2 \\sin A \\cos B \\implies \\sin A \\cos B = \\tfrac{1}{2}\\bigl[\\sin(A + B) + \\sin(A - B)\\bigr].$$</div></div>`

+ `<p class="l-text"><strong>Carpim-toplamdan toplam-carpima.</strong> Her toplam-carpim formulu, ayni ozdesligin yer degistirmeyle yeniden yazilisidir. $u = A + B$ ve $v = A - B$ koyun, boylece $A = \\tfrac{u+v}{2}$ ve $B = \\tfrac{u-v}{2}$. Bunlari $\\sin A \\cos B = \\tfrac{1}{2}[\\sin(A+B) + \\sin(A-B)]$'a yerlestirin:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\sin u + \\sin v = 2 \\sin\\!\\left(\\tfrac{u+v}{2}\\right) \\cos\\!\\left(\\tfrac{u-v}{2}\\right).$$</div><div class="formula-sub">$u$ ve $v$ tekrar $A$ ve $B$ olarak adlandirilinca bu, ilk toplam-carpim formuludur. Diger ucu benzer yer degistirmelerle elde edilir.</div></div>`

+ `<div class="think-box"><div class="think-label">KENDINIZ DENEYIN</div><div class="think-body">$\\cos A \\cos B$ carpim-toplam ozdesligini alin ve ayni $u = A + B$, $v = A - B$ yer degistirmesini uygulayin. $\\cos u + \\cos v = 2 \\cos\\!\\bigl(\\tfrac{u+v}{2}\\bigr) \\cos\\!\\bigl(\\tfrac{u-v}{2}\\bigr)$ elde ettiginizi dogrulayin. Bu tur dogrudan turetim, formulleri sekiz bagimsiz bilgi olarak ezberlemekten cok daha guvenilir.</div></div>`

/* ============================================================
   BOLUM 6: Pratik Ornekler
   ============================================================ */
+ `<h2 class="l-title">6. Pratik Ornekler</h2>`

+ `<p class="l-text">Formulleri iki klasik sayisal probleme ve bir denkleme uygulayalim.</p>`

+ `<div class="calc-example"><div class="example-label">ORNEK 1 — sin 75 derece * sin 15 derece</div><div class="example-body"><strong>Tam olarak hesaplayin:</strong> $\\sin 75^\\circ \\sin 15^\\circ$.<br><br>$\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$ kullanin:<br><br>$\\sin 75^\\circ \\sin 15^\\circ = \\tfrac{1}{2}\\bigl[\\cos(75^\\circ - 15^\\circ) - \\cos(75^\\circ + 15^\\circ)\\bigr]$<br>$= \\tfrac{1}{2}\\bigl[\\cos 60^\\circ - \\cos 90^\\circ\\bigr]$<br>$= \\tfrac{1}{2}\\bigl[\\tfrac{1}{2} - 0\\bigr]$<br>$= \\tfrac{1}{4}$.<br><br>Dogrudan kontrol: $\\sin 75^\\circ \\approx 0{,}9659$, $\\sin 15^\\circ \\approx 0{,}2588$, carpim $\\approx 0{,}2500$. Tam.</div></div>`

+ `<div class="calc-example"><div class="example-label">ORNEK 2 — cos 80 derece + cos 40 derece</div><div class="example-body"><strong>Tam olarak hesaplayin:</strong> $\\cos 80^\\circ + \\cos 40^\\circ$.<br><br>$\\cos A + \\cos B = 2 \\cos\\!\\bigl(\\tfrac{A+B}{2}\\bigr)\\cos\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ ile $A = 80^\\circ$, $B = 40^\\circ$:<br><br>$\\cos 80^\\circ + \\cos 40^\\circ = 2 \\cos 60^\\circ \\cos 20^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\cos 20^\\circ = \\cos 20^\\circ$.<br><br>Zor gorunen toplam, kucuk bir acinin tek bir kosinusune donustu.</div></div>`

+ `<div class="calc-example"><div class="example-label">ORNEK 3 — denklemi cozun</div><div class="example-body"><strong>$[0, 2\\pi)$ araliginda cozun:</strong> $\\sin 5x - \\sin 3x = 0$.<br><br>$\\sin A - \\sin B = 2 \\cos\\!\\bigl(\\tfrac{A+B}{2}\\bigr)\\sin\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ ile $A = 5x$, $B = 3x$:<br><br>$\\sin 5x - \\sin 3x = 2 \\cos 4x \\sin x = 0$.<br><br>Ya $\\cos 4x = 0$ ya da $\\sin x = 0$.<br><br>$\\sin x = 0 \\Rightarrow x = 0, \\pi$.<br>$\\cos 4x = 0 \\Rightarrow 4x = \\tfrac{\\pi}{2} + k\\pi \\Rightarrow x = \\tfrac{\\pi}{8} + \\tfrac{k\\pi}{4}$ icin $k = 0, 1, \\dots, 7$.<br><br>$[0, 2\\pi)$ araliginda birlestirip tekrarlari atinca on cozum kalir. Zor gorunen problem, tek satirlik carpanlara ayirma oldu.</div></div>`

+ `<div class="calc-example"><div class="example-label">ORNEK 4 — guc indirgeme ile integral</div><div class="example-body"><strong>Degerlendirin:</strong> $\\int_0^{\\pi/2} \\cos^2 x \\, dx$.<br><br>$\\cos^2 x = \\tfrac{1 + \\cos 2x}{2}$ kullanin:<br><br>$\\int_0^{\\pi/2} \\cos^2 x \\, dx = \\int_0^{\\pi/2} \\tfrac{1 + \\cos 2x}{2}\\, dx = \\Bigl[\\tfrac{x}{2} + \\tfrac{\\sin 2x}{4}\\Bigr]_0^{\\pi/2}$<br><br>$= \\Bigl(\\tfrac{\\pi}{4} + \\tfrac{\\sin \\pi}{4}\\Bigr) - (0 + 0) = \\tfrac{\\pi}{4}$.<br><br>$\\cos^2 x$'in 0 ile $\\tfrac{\\pi}{2}$ arasindaki integrali tam olarak $\\tfrac{\\pi}{4}$'tur. Ayni hile ile $\\int_0^{\\pi/2} \\sin^2 x \\, dx = \\tfrac{\\pi}{4}$. Iki karesel sinuzoid, ortalamada "1 sabitini" esit paylasir.</div></div>`

/* --- Plotly: Vurum --- */
+ `<div id="plot-beats-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var xs=[];var ys=[];var env=[];`
+ `for(var i=0;i<800;i++){var t=i/40;xs.push(t);`
+ `var a=Math.sin(2*Math.PI*1.0*t);var b=Math.sin(2*Math.PI*1.1*t);`
+ `ys.push(a+b);env.push(2*Math.cos(2*Math.PI*0.05*t));}`
+ `var t1={x:xs,y:ys,mode:"lines",name:"sin(2pi*1*t) + sin(2pi*1,1*t)",line:{color:"#c8a96e",width:1.8}};`
+ `var t2={x:xs,y:env,mode:"lines",name:"zarf +/- 2 cos(2pi*0,05*t)",line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var envN=env.map(function(v){return -v;});`
+ `var t3={x:xs,y:envN,mode:"lines",showlegend:false,line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (saniye)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"genlik",range:[-2.4,2.4]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};`
+ `Plotly.newPlot("plot-beats-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});`
+ `},100)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> yakin frekansli iki sinus dalgasinin (1,0 Hz ve 1,1 Hz) toplami, ortalama frekansta (1,05 Hz) salinan ve genligi yari-fark frekansinda (0,05 Hz) yavasca yukselip alcalan bir sinuzoiddir. Kesik kirmizi egriler, toplam-carpim formulunun ongordugu $\\pm 2 \\cos(2\\pi \\cdot 0{,}05 \\cdot t)$ yavas zarfidir. Muzisyenlerin "vurum" olarak duydugu titresim budur.</div></div>`

/* --- Plotly: iki sinus carpimi, vurum benzeri oruntu --- */
+ `<div id="plot-product-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var xs=[];var prod=[];var ra=[];var rb=[];`
+ `for(var i=0;i<800;i++){var t=i/40;xs.push(t);`
+ `var p=Math.sin(2*Math.PI*1.05*t)*Math.cos(2*Math.PI*0.05*t);prod.push(2*p);`
+ `ra.push(2*Math.cos(2*Math.PI*0.05*t));rb.push(-2*Math.cos(2*Math.PI*0.05*t));}`
+ `var t1={x:xs,y:prod,mode:"lines",name:"2 sin(2pi*1,05*t) cos(2pi*0,05*t)",line:{color:"#86efac",width:1.8}};`
+ `var t2={x:xs,y:ra,mode:"lines",name:"zarf +/- 2 cos(2pi*0,05*t)",line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var t3={x:xs,y:rb,mode:"lines",showlegend:false,line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t (saniye)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"genlik",range:[-2.4,2.4]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};`
+ `Plotly.newPlot("plot-product-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});`
+ `},100)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> Carpim hali $2 \\sin(2\\pi \\cdot 1{,}05 \\cdot t) \\cos(2\\pi \\cdot 0{,}05 \\cdot t)$, onceki grafikteki toplam ile birebir ayni fonksiyondur. Toplam-carpim formulu, iki gorus arasindaki cebirsel koprudur. Ustteki grafikle karsilastirin; iki egri, iki farkli formulden cizilmis ayni fonksiyondur.</div></div>`

/* --- Plotly: Cift-aci ozdesligi carpim-toplamdan: 2 sin(x) cos(x) vs sin(2x) --- */
+ `<p class="l-text"><strong>Cift-aci ozdesliginin gorsel kontrolu.</strong> Carpim-toplam formulunu $\\sin x \\cos x$'e $A = B = x$ ile uygulayin: $\\sin x \\cos x = \\tfrac{1}{2}[\\sin(2x) + \\sin(0)] = \\tfrac{1}{2}\\sin 2x$, yani $2\\sin x \\cos x = \\sin 2x$. Asagidaki grafik her iki tarafi ayni eksenlerde cizer; her yerde ust uste bindiklerini gorursunuz; bir ozdesligin gorsel anlami tam olarak budur.</p>`

+ `<div id="plot-doubleangle-tr-extra" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var xs=[];var y1=[];var y2=[];`
+ `for(var i=0;i<=600;i++){var x=-2*Math.PI+(i/600)*4*Math.PI;xs.push(x);`
+ `y1.push(2*Math.sin(x)*Math.cos(x));y2.push(Math.sin(2*x));}`
+ `var t1={x:xs,y:y1,mode:"lines",name:"2 sin(x) cos(x)",line:{color:"#3b82f6",width:3}};`
+ `var t2={x:xs,y:y2,mode:"lines",name:"sin(2x)",line:{color:"#f87171",width:1.6,dash:"dot"}};`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radyan)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"deger",range:[-1.3,1.3]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};`
+ `Plotly.newPlot("plot-doubleangle-tr-extra",[t1,t2],layout,{responsive:true,displayModeBar:false});`
+ `},100)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> Duz mavi egri $2\\sin x \\cos x$ — iki birinci-dereceden trig fonksiyonunun carpimi. Kesik kirmizi egri $\\sin 2x$ — cift acinin tek birinci-dereceden sinusu. Iki egri $[-2\\pi, 2\\pi]$ araliginin tamaminda birbirinin uzerinde durur; bu, $2 \\sin x \\cos x = \\sin 2x$ ozdesliginin gorsel kanitidir. Cift-aci formulunun carpim-toplam perspektifinden gorunumu.</div></div>`

/* --- Ozdeslik ozet tablosu (TR) --- */
+ `<h3 class="l-title" style="font-size:1.05rem;margin-top:2rem">Ozdeslik referans tablosu</h3>`

+ `<p class="l-text">Bir problemde hangi ozdeslik ailesinin gecerli oldugunu tek bakista anlamak icin bu kompakt referansi kullanin:</p>`

+ `<div style="overflow-x:auto;margin:1.2rem 0">`
+ `<table style="width:100%;border-collapse:collapse;background:rgba(20,22,28,0.55);color:#ebe6dc;font-size:0.9rem;border:1px solid rgba(255,255,255,0.08);border-radius:6px;overflow:hidden">`
+ `<thead><tr style="background:#3b82f6;color:#0b1020">`
+ `<th style="padding:0.65rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.03em">Ozdeslik ailesi</th>`
+ `<th style="padding:0.65rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.03em">Formul</th>`
+ `<th style="padding:0.65rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.03em">Hizli ornek</th>`
+ `</tr></thead>`
+ `<tbody>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Carpim-toplam</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 75^\\circ \\sin 15^\\circ = \\tfrac{1}{2}(\\cos 60^\\circ - \\cos 90^\\circ) = \\tfrac{1}{4}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Toplam-carpim</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin A + \\sin B = 2 \\sin\\!\\bigl(\\tfrac{A+B}{2}\\bigr)\\cos\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 5x + \\sin x = 2 \\sin 3x \\cos 2x$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Guc indirgeme (sin&sup2;)</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{2}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\int \\sin^2 x \\, dx = \\tfrac{x}{2} - \\tfrac{\\sin 2x}{4} + C$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Guc indirgeme (cos&sup2;)</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\cos^2 \\theta = \\dfrac{1 + \\cos 2\\theta}{2}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\int_0^{\\pi/2} \\cos^2 x \\, dx = \\tfrac{\\pi}{4}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Guc indirgeme (tan&sup2;)</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\tan^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{1 + \\cos 2\\theta}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\tan^2(\\pi/6) = \\tfrac{1 - \\cos(\\pi/3)}{1 + \\cos(\\pi/3)} = \\tfrac{1/2}{3/2} = \\tfrac{1}{3}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Cift-aci</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$,&nbsp; $\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 60^\\circ = 2 \\sin 30^\\circ \\cos 30^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\tfrac{\\sqrt{3}}{2} = \\tfrac{\\sqrt{3}}{2}$</td></tr>`
+ `<tr style="border-top:1px solid rgba(255,255,255,0.06)"><td style="padding:0.6rem 0.9rem;vertical-align:top"><strong>Yari-aci</strong></td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin\\!\\bigl(\\tfrac{\\theta}{2}\\bigr) = \\pm \\sqrt{\\dfrac{1 - \\cos \\theta}{2}}$,&nbsp; $\\cos\\!\\bigl(\\tfrac{\\theta}{2}\\bigr) = \\pm \\sqrt{\\dfrac{1 + \\cos \\theta}{2}}$</td><td style="padding:0.6rem 0.9rem;vertical-align:top">$\\sin 15^\\circ = \\sqrt{\\tfrac{1 - \\cos 30^\\circ}{2}} = \\tfrac{\\sqrt{2 - \\sqrt{3}}}{2}$</td></tr>`
+ `</tbody></table>`
+ `</div>`

/* ============================================================
   BOLUM 7: Klasik Alistirmalar
   ============================================================ */
+ `<h2 class="l-title">7. Klasik Alistirmalar</h2>`

+ `<p class="l-text">Her problemi cozume bakmadan once kagit uzerinde deneyin. Once hangi formul ailesinin gecerli oldugunu <em>taniyin</em>, sonra dikkatlice uygulayin.</p>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 1</div><div class="example-body"><strong>Sadelestirin:</strong> $\\sin 50^\\circ + \\sin 10^\\circ$.<br><br><em>Cozum.</em> $A = 50^\\circ$, $B = 10^\\circ$ ile toplam-carpim: ortalama $30^\\circ$, yari-fark $20^\\circ$.<br>$\\sin 50^\\circ + \\sin 10^\\circ = 2 \\sin 30^\\circ \\cos 20^\\circ = 2 \\cdot \\tfrac{1}{2} \\cdot \\cos 20^\\circ = \\cos 20^\\circ$.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 2</div><div class="example-body"><strong>Hesaplayin:</strong> $\\cos 105^\\circ - \\cos 15^\\circ$.<br><br><em>Cozum.</em> $A=105^\\circ$, $B=15^\\circ$ icin $\\cos A - \\cos B = -2 \\sin\\!\\bigl(\\tfrac{A+B}{2}\\bigr) \\sin\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$. Ortalama $60^\\circ$, yari-fark $45^\\circ$.<br>$\\cos 105^\\circ - \\cos 15^\\circ = -2 \\sin 60^\\circ \\sin 45^\\circ = -2 \\cdot \\tfrac{\\sqrt{3}}{2} \\cdot \\tfrac{\\sqrt{2}}{2} = -\\tfrac{\\sqrt{6}}{2}$.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 3</div><div class="example-body"><strong>Donusturun:</strong> $\\sin^2 x - \\sin^2 y$.<br><br><em>Cozum.</em> Her terimi guc-indirgeyin: $\\sin^2 x = \\tfrac{1 - \\cos 2x}{2}$ ve $\\sin^2 y = \\tfrac{1 - \\cos 2y}{2}$. Cikarin:<br>$\\sin^2 x - \\sin^2 y = \\tfrac{(1 - \\cos 2x) - (1 - \\cos 2y)}{2} = \\tfrac{\\cos 2y - \\cos 2x}{2}$.<br>$A = 2y$, $B = 2x$ ile $\\cos A - \\cos B = -2 \\sin\\!\\bigl(\\tfrac{A+B}{2}\\bigr) \\sin\\!\\bigl(\\tfrac{A-B}{2}\\bigr)$ uygulayin:<br>$= \\tfrac{1}{2}\\bigl[-2 \\sin(x + y) \\sin(y - x)\\bigr] = \\sin(x + y) \\sin(x - y)$. Unlu ozdeslik: $\\sin^2 x - \\sin^2 y = \\sin(x+y) \\sin(x-y)$.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 4</div><div class="example-body"><strong>Tam olarak hesaplayin:</strong> $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ$.<br><br><em>Cozum.</em> Klasik bir teleskopik carpim. $\\sin 20^\\circ$ ile carpin ve $\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$ ozdesligini ardisik kullanin:<br>$\\sin 20^\\circ \\cdot \\cos 20^\\circ = \\tfrac{1}{2}\\sin 40^\\circ$.<br>$\\sin 40^\\circ \\cdot \\cos 40^\\circ = \\tfrac{1}{2}\\sin 80^\\circ$.<br>$\\sin 80^\\circ \\cdot \\cos 80^\\circ = \\tfrac{1}{2}\\sin 160^\\circ$.<br>Birlestirince: $\\sin 20^\\circ \\cdot \\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ = \\tfrac{1}{8} \\sin 160^\\circ = \\tfrac{1}{8} \\sin 20^\\circ$.<br>$\\sin 20^\\circ$'ye (sifirdan farkli) bolun: $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ = \\tfrac{1}{8}$.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 5</div><div class="example-body"><strong>$[0, 2\\pi)$ araliginda cozun:</strong> $\\cos x + \\cos 3x + \\cos 5x = 0$.<br><br><em>Cozum.</em> Uctaki ikiyi gruplayin: $\\cos x + \\cos 5x = 2 \\cos 3x \\cos 2x$ (ortalama $3x$, yari-fark $-2x$ ve $\\cos$ cifttir).<br>Denklem $2 \\cos 3x \\cos 2x + \\cos 3x = 0$, yani $\\cos 3x (2 \\cos 2x + 1) = 0$ olur.<br>Iki durum: $\\cos 3x = 0$ verir $3x = \\tfrac{\\pi}{2} + k\\pi$, yani $x = \\tfrac{\\pi}{6} + \\tfrac{k\\pi}{3}$. Ve $\\cos 2x = -\\tfrac{1}{2}$ verir $2x = \\tfrac{2\\pi}{3} + 2k\\pi$ veya $2x = \\tfrac{4\\pi}{3} + 2k\\pi$, yani $x = \\tfrac{\\pi}{3} + k\\pi$ veya $x = \\tfrac{2\\pi}{3} + k\\pi$.<br>$[0, 2\\pi)$ araligindaki tum cozumler: cok sayida, en basitleri $\\tfrac{\\pi}{6}, \\tfrac{\\pi}{3}, \\tfrac{\\pi}{2}, \\tfrac{2\\pi}{3}, \\tfrac{5\\pi}{6}, \\tfrac{7\\pi}{6}, \\tfrac{4\\pi}{3}, \\tfrac{3\\pi}{2}, \\tfrac{5\\pi}{3}, \\tfrac{11\\pi}{6}$.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 6 — ispat</div><div class="example-body"><strong>Ispatlayin:</strong> $\\sin 3\\theta = 3 \\sin \\theta - 4 \\sin^3 \\theta$.<br><br><em>Cozum.</em> $\\sin 3\\theta = \\sin(2\\theta + \\theta)$ yazin ve toplam formulunu uygulayin: $= \\sin 2\\theta \\cos \\theta + \\cos 2\\theta \\sin \\theta$.<br>$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$ ve $\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$ yerlestirin:<br>$= 2 \\sin \\theta \\cos^2 \\theta + (1 - 2 \\sin^2 \\theta) \\sin \\theta$.<br>$\\cos^2 \\theta = 1 - \\sin^2 \\theta$ kullanin:<br>$= 2 \\sin \\theta (1 - \\sin^2 \\theta) + \\sin \\theta - 2 \\sin^3 \\theta$<br>$= 2 \\sin \\theta - 2 \\sin^3 \\theta + \\sin \\theta - 2 \\sin^3 \\theta$<br>$= 3 \\sin \\theta - 4 \\sin^3 \\theta$. <span style="color:#86efac">QED</span></div></div>`

+ `<div class="l-note"><strong>Dersin ozeti.</strong> Carpimlar toplamlara (ve tersi) Bolum 1-2'deki dort-satirlik ozdeslik ailesi ile donusur. Sinus ve kosinusun kareleri ve kupleri, coklu acilarin birinci-dereceden ifadelerine indirgenir (Bolum 3). Tum formuller, Ders 4'un toplam-ve-fark ozdesliklerinden toplama, cikarma veya yer degistirme ile gelir (Bolum 5). Bunlari integre etmek, denklem cozmek ve vurum fizigini anlamak icin kullanin.</div>`
};
