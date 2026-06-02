window.CALCULUS_L2 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text">Computing derivatives directly from the limit definition works for any function, but it is painfully slow. Expanding <em>(x+h)<sup>7</sup></em>, simplifying, and pushing <em>h</em> to zero takes a page of algebra. The classical answer is a small toolbox of <strong>differentiation rules</strong> — power, sum, product, quotient, chain — each proved once and used forever. Together with the derivatives of the elementary functions, they let you differentiate any expression built from the standard building blocks of analysis.</p>

<p class="l-text">This lesson is a careful tour of that toolbox. We prove every rule from the limit definition, explain the geometric meaning where it exists, and finish with five worked exercises in the spirit of a classical analysis textbook.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Prove the power rule <em>(x<sup>n</sup>)' = n x<sup>n-1</sup></em> from the limit definition for integer <em>n</em></li>
<li>Derive and apply the sum, difference, and constant-multiple rules</li>
<li>Prove the product rule and read its geometric meaning as the growth of a rectangle</li>
<li>Derive the quotient rule directly from the product rule</li>
<li>Differentiate the elementary functions: sin, cos, exp, ln, and rational powers</li>
<li>State and prove the chain rule, then apply it to nested expressions</li>
<li>Carry out implicit differentiation on equations such as <em>x<sup>2</sup>+y<sup>2</sup>=r<sup>2</sup></em></li>
<li>Differentiate an inverse function using the formula <em>(f<sup>-1</sup>)'(y) = 1 / f'(x)</em></li>
<li>Compute higher-order derivatives and identify the position-velocity-acceleration chain</li>
</ul>
</div>

<h2 class="l-title">1. The Building Block: Constants and Powers of x</h2>

<p class="l-text">Two derivatives form the foundation of everything that follows. The first is the derivative of a constant — geometrically, the graph of <em>f(x)=c</em> is a horizontal line of slope zero. The second is the derivative of <em>x<sup>n</sup></em>, the <strong>power rule</strong>, which we will prove from the limit definition.</p>

<div class="calc-formula"><span class="formula-label">Derivative of a constant</span><div class="formula-main">$$\\frac{d}{dx}[c] = 0$$</div><div class="formula-sub">A constant function has no rate of change.</div></div>

<div class="calc-formula"><span class="formula-label">Power Rule</span><div class="formula-main">$$\\frac{d}{dx}\\left[x^{n}\\right] = n\\,x^{n-1}, \\qquad n \\in \\mathbb{R}$$</div><div class="formula-sub">Bring the exponent down as a coefficient, then subtract one from the exponent.</div></div>

<h3 class="l-subtitle">Proof for positive integer n</h3>

<p class="l-text">Start from the limit definition and use the binomial theorem:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^{n} - x^{n}}{h}$$</div></div>

<p class="l-text">Expand <em>(x+h)<sup>n</sup></em>:</p>

<div class="calc-formula"><div class="formula-main">$$(x+h)^{n} = x^{n} + n\\,x^{n-1} h + \\binom{n}{2} x^{n-2} h^{2} + \\cdots + h^{n}$$</div></div>

<p class="l-text">Subtract <em>x<sup>n</sup></em> and divide by <em>h</em>:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x+h)^{n}-x^{n}}{h} = n\\,x^{n-1} + \\binom{n}{2} x^{n-2} h + \\cdots + h^{n-1}$$</div></div>

<p class="l-text">Every term after the first carries a factor of <em>h</em>. Sending <em>h</em> to zero kills them all and leaves <em>n x<sup>n-1</sup></em>. The same identity extends to negative integers (using the reciprocal trick) and to rational exponents (via implicit differentiation, which we cover in section 7).</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">f(x) = x<sup>4</sup></div><div class="step-detail">$$f'(x) = 4 x^{3}$$</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">f(x) = x</div><div class="step-detail">$$f'(x) = 1 \\cdot x^{0} = 1$$ — the slope of the line y=x.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">f(x) = &radic;x = x<sup>1/2</sup></div><div class="step-detail">$$f'(x) = \\tfrac{1}{2} x^{-1/2} = \\frac{1}{2\\sqrt{x}}$$</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">f(x) = 1/x = x<sup>-1</sup></div><div class="step-detail">$$f'(x) = -x^{-2} = -\\frac{1}{x^{2}}$$</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">f(x) = 1/x<sup>3</sup> = x<sup>-3</sup></div><div class="step-detail">$$f'(x) = -3 x^{-4} = -\\frac{3}{x^{4}}$$</div></div></div>
</div>

<div class="calc-graph"><div class="graph-title">Power Functions and Their Tangent Slopes</div>
<div id="plot-l2-power-en" style="width:100%;min-height:380px"></div>
</div>

<h2 class="l-title">2. Sum, Difference, and Constant Multiple Rules</h2>

<p class="l-text">The derivative respects addition and scalar multiplication. These rules turn long polynomials into routine work.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sum Rule</div><div class="card-body">$$(f+g)'(x) = f'(x) + g'(x)$$</div></div>
<div class="calc-card"><div class="card-title">Difference Rule</div><div class="card-body">$$(f-g)'(x) = f'(x) - g'(x)$$</div></div>
<div class="calc-card"><div class="card-title">Constant Multiple</div><div class="card-body">$$(c \\cdot f)'(x) = c \\cdot f'(x)$$</div></div>
</div>

<h3 class="l-subtitle">Proof of the sum rule</h3>

<p class="l-text">Let <em>F(x) = f(x) + g(x)</em>. From the limit definition:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} \\frac{[f(x+h)+g(x+h)] - [f(x)+g(x)]}{h}$$</div></div>

<p class="l-text">Group the <em>f</em> terms together and the <em>g</em> terms together:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h} + \\lim_{h \\to 0} \\frac{g(x+h)-g(x)}{h} = f'(x) + g'(x)$$</div></div>

<p class="l-text">The same argument with a minus sign gives the difference rule; pulling a constant out of the limit gives the constant-multiple rule.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">
<strong>Differentiate</strong> <em>f(x) = 5x<sup>3</sup> + 3x<sup>2</sup> - 7x + 12</em>.<br><br>
Apply the sum and constant-multiple rules term by term, then the power rule:<br>
<ul style="margin:0.6rem 0 0.6rem 1.2rem;line-height:1.7">
<li>$$\\frac{d}{dx}[5x^{3}] = 5 \\cdot 3 x^{2} = 15 x^{2}$$</li>
<li>$$\\frac{d}{dx}[3x^{2}] = 3 \\cdot 2 x = 6x$$</li>
<li>$$\\frac{d}{dx}[-7x] = -7$$</li>
<li>$$\\frac{d}{dx}[12] = 0$$</li>
</ul>
<strong>$$f'(x) = 15 x^{2} + 6x - 7$$</strong>
</div></div>

<h2 class="l-title">3. The Product Rule</h2>

<p class="l-text">The derivative of a product is <strong>not</strong> the product of the derivatives. The correct formula carries two terms and was first written down by Leibniz himself.</p>

<div class="calc-formula"><span class="formula-label">Product Rule</span><div class="formula-main">$$\\frac{d}{dx}\\bigl[f(x)\\,g(x)\\bigr] = f'(x)\\,g(x) + f(x)\\,g'(x)$$</div><div class="formula-sub">"Derivative of the first times the second, plus the first times the derivative of the second."</div></div>

<h3 class="l-subtitle">Proof from the limit definition</h3>

<p class="l-text">Let <em>F(x) = f(x) g(x)</em>. Add and subtract <em>f(x+h) g(x)</em> in the numerator — the classical "telescoping" trick:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} \\frac{f(x+h)g(x+h) - f(x+h)g(x) + f(x+h)g(x) - f(x)g(x)}{h}$$</div></div>

<p class="l-text">Factor each pair:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} f(x+h) \\cdot \\frac{g(x+h)-g(x)}{h} + \\lim_{h \\to 0} g(x) \\cdot \\frac{f(x+h)-f(x)}{h}$$</div></div>

<p class="l-text">As <em>h &rarr; 0</em>, <em>f(x+h) &rarr; f(x)</em> (by continuity, which differentiability implies). The two limits become <em>g'(x)</em> and <em>f'(x)</em>, giving the formula.</p>

<h3 class="l-subtitle">Geometric meaning: the growing rectangle</h3>

<p class="l-text">Imagine a rectangle with side lengths <em>f(x)</em> and <em>g(x)</em>. Its area is <em>A(x) = f(x) g(x)</em>. When <em>x</em> changes by a small amount <em>dx</em>, both sides grow: the bottom edge sweeps out a thin strip of area <em>g(x) f'(x) dx</em>, the right edge sweeps out <em>f(x) g'(x) dx</em>, and a tiny corner of order <em>dx<sup>2</sup></em> is negligible in the limit. The two strips sum to the product rule.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">
<strong>Differentiate</strong> <em>f(x) = x<sup>2</sup> sin(x)</em>.<br><br>
Take <em>u = x<sup>2</sup></em> and <em>v = sin(x)</em>, so <em>u' = 2x</em> and <em>v' = cos(x)</em>:
$$f'(x) = (2x)\\sin(x) + x^{2}\\cos(x) = 2x\\sin(x) + x^{2}\\cos(x).$$
</div></div>

<h2 class="l-title">4. The Quotient Rule</h2>

<p class="l-text">The quotient rule handles ratios. It can be derived in one line from the product rule, which is exactly how it was historically obtained.</p>

<div class="calc-formula"><span class="formula-label">Quotient Rule</span><div class="formula-main">$$\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^{2}}$$</div><div class="formula-sub">Valid wherever g(x) is non-zero.</div></div>

<h3 class="l-subtitle">Derivation from the product rule</h3>

<p class="l-text">Write the quotient as <em>Q(x) = f(x) [g(x)]<sup>-1</sup></em> and apply the product rule together with the chain rule on <em>[g(x)]<sup>-1</sup></em> (we will prove the chain rule in section 6, but the algebra is identical):</p>

<div class="calc-formula"><div class="formula-main">$$Q'(x) = f'(x) \\cdot \\frac{1}{g(x)} + f(x) \\cdot \\left(-\\frac{g'(x)}{[g(x)]^{2}}\\right)$$</div></div>

<p class="l-text">Bring the two terms over the common denominator <em>[g(x)]<sup>2</sup></em> to obtain the quotient rule above.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">
<strong>Differentiate</strong> $$f(x) = \\frac{x^{2}+1}{x-1}.$$<br>
Take <em>u = x<sup>2</sup>+1</em> and <em>v = x-1</em>, so <em>u' = 2x</em> and <em>v' = 1</em>:
$$f'(x) = \\frac{(2x)(x-1) - (x^{2}+1)(1)}{(x-1)^{2}} = \\frac{x^{2} - 2x - 1}{(x-1)^{2}}.$$
</div></div>

<h2 class="l-title">5. Derivatives of the Elementary Functions</h2>

<p class="l-text">Calculus operates on a small list of building-block functions. Memorizing their derivatives is the price of admission; everything else follows by combining them with the rules above.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\sin x] = \\cos x$$</div><div class="card-body">Proved from the addition formula and the limits $$\\lim_{h \\to 0} \\frac{\\sin h}{h}=1, \\quad \\lim_{h \\to 0}\\frac{\\cos h - 1}{h}=0.$$</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\cos x] = -\\sin x$$</div><div class="card-body">Same derivation; the leading sign flips because cosine decreases on (0, &pi;).</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[e^{x}] = e^{x}$$</div><div class="card-body">The exponential is the unique function (up to scaling) that is its own derivative. This is what defines the constant <em>e</em>.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\ln x] = \\frac{1}{x}$$</div><div class="card-body">Obtained by implicit differentiation of <em>e<sup>ln x</sup> = x</em>. Valid for <em>x &gt; 0</em>.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\tan x] = \\sec^{2} x$$</div><div class="card-body">From the quotient rule applied to <em>sin/cos</em>.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[a^{x}] = a^{x}\\ln a$$</div><div class="card-body">Write <em>a<sup>x</sup> = e<sup>x ln a</sup></em> and use the chain rule.</div></div>
</div>

<h3 class="l-subtitle">Proof that (sin x)' = cos x</h3>

<p class="l-text">Apply the limit definition and the angle-addition formula <em>sin(x+h) = sin x cos h + cos x sin h</em>:</p>

<div class="calc-formula"><div class="formula-main">$$(\\sin x)' = \\lim_{h \\to 0} \\frac{\\sin x \\cos h + \\cos x \\sin h - \\sin x}{h}$$</div></div>

<div class="calc-formula"><div class="formula-main">$$= \\sin x \\cdot \\lim_{h \\to 0}\\frac{\\cos h - 1}{h} + \\cos x \\cdot \\lim_{h \\to 0}\\frac{\\sin h}{h} = \\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x.$$</div></div>

<div class="calc-graph"><div class="graph-title">sin(x) and Its Derivative cos(x)</div>
<div id="plot-l2-trig-en" style="width:100%;min-height:380px"></div>
</div>

<h2 class="l-title">6. The Chain Rule</h2>

<p class="l-text">The chain rule differentiates a <em>composition</em> of functions, where the output of one feeds into the input of another. It is the most powerful rule in the toolbox — without it, calculus would only handle short expressions.</p>

<div class="calc-formula"><span class="formula-label">Chain Rule</span><div class="formula-main">$$\\frac{d}{dx}\\bigl[f(g(x))\\bigr] = f'(g(x)) \\cdot g'(x)$$</div><div class="formula-sub">"Outer derivative evaluated at the inner function, times the inner derivative."</div></div>

<p class="l-text">A useful Leibniz-style rewriting: if <em>y = f(u)</em> and <em>u = g(x)</em>, then</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}.$$</div></div>

<p class="l-text">The notation hints at why the rule is true: small changes multiply along the chain.</p>

<h3 class="l-subtitle">Geometric intuition</h3>

<p class="l-text">If <em>g</em> stretches its input by a factor of <em>g'(x)</em>, and <em>f</em> then stretches by a factor of <em>f'(g(x))</em>, the total stretch is the product. The chain rule is the calculus of cascading rates.</p>

<h3 class="l-subtitle">Sketch of the proof</h3>

<p class="l-text">When <em>g</em> is differentiable, write <em>g(x+h) = g(x) + k</em> where <em>k &rarr; 0</em> as <em>h &rarr; 0</em>. Then</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{f(g(x+h))-f(g(x))}{h} = \\frac{f(g(x)+k)-f(g(x))}{k} \\cdot \\frac{k}{h}.$$</div></div>

<p class="l-text">The first factor tends to <em>f'(g(x))</em>; the second is the difference quotient for <em>g</em> and tends to <em>g'(x)</em>. (A small technical detail handles the case <em>k = 0</em>; standard analysis texts cover it.)</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">
<strong>Differentiate</strong> <em>y = sin(x<sup>2</sup>+1)</em>.<br><br>
Identify the outer function <em>f(u) = sin u</em> and the inner function <em>u = x<sup>2</sup>+1</em>:
$$\\frac{dy}{dx} = \\cos(x^{2}+1) \\cdot 2x.$$
</div></div>

<div class="calc-example"><div class="example-label">A LONGER CHAIN</div><div class="example-body">
<strong>Differentiate</strong> <em>y = e<sup>cos(3x)</sup></em>.<br><br>
This is a chain of three functions: <em>e<sup>(&middot;)</sup> &SmallCircle; cos(&middot;) &SmallCircle; (3x)</em>. Multiply the three derivatives:
$$\\frac{dy}{dx} = e^{\\cos(3x)} \\cdot \\bigl(-\\sin(3x)\\bigr) \\cdot 3 = -3 \\sin(3x)\\,e^{\\cos(3x)}.$$
</div></div>

<div class="calc-graph"><div class="graph-title">A Composite Function and Its Derivative</div>
<div id="plot-l2-chain-en" style="width:100%;min-height:380px"></div>
</div>

<h2 class="l-title">7. Implicit Differentiation</h2>

<p class="l-text">Not every curve is the graph of a function <em>y = f(x)</em>. Consider the unit circle <em>x<sup>2</sup>+y<sup>2</sup>=1</em>: for a given <em>x</em>, two values of <em>y</em> satisfy the equation. The curve still has a well-defined tangent at almost every point, and we can find its slope <em>without first solving for y</em>.</p>

<p class="l-text"><strong>The method:</strong> differentiate both sides of the equation with respect to <em>x</em>, treating <em>y</em> as a differentiable function of <em>x</em> and using the chain rule on every <em>y</em>-term. Then solve for <em>dy/dx</em>.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Unit Circle</div><div class="example-body">
Start from <em>x<sup>2</sup>+y<sup>2</sup>=1</em> and differentiate term by term:
$$\\frac{d}{dx}[x^{2}] + \\frac{d}{dx}[y^{2}] = \\frac{d}{dx}[1].$$
The chain rule turns the <em>y<sup>2</sup></em> term into <em>2y &middot; (dy/dx)</em>:
$$2x + 2y\\,\\frac{dy}{dx} = 0 \\quad\\Longrightarrow\\quad \\frac{dy}{dx} = -\\frac{x}{y}.$$
This is the slope of the tangent line to the unit circle at any point <em>(x, y)</em>. It is undefined at <em>y = 0</em> (the leftmost and rightmost points), where the tangent is vertical — exactly what geometry tells us.
</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Folium of Descartes</div><div class="example-body">
The classical curve <em>x<sup>3</sup>+y<sup>3</sup>=3xy</em> has a loop in the first quadrant. To find its slope, differentiate implicitly:
$$3x^{2} + 3y^{2}\\frac{dy}{dx} = 3y + 3x\\frac{dy}{dx}.$$
Collect the <em>dy/dx</em> terms:
$$\\frac{dy}{dx}(3y^{2} - 3x) = 3y - 3x^{2} \\quad\\Longrightarrow\\quad \\frac{dy}{dx} = \\frac{y - x^{2}}{y^{2} - x}.$$
At the loop's top point (where <em>x = y</em>), this simplifies to a vertical tangent — again something we can confirm geometrically.
</div></div>

<h3 class="l-subtitle">Why this works</h3>

<p class="l-text">Implicit differentiation is really the chain rule wearing a different hat. We are saying: <em>"along this curve, y depends on x, so any function of y is also a function of x, and its derivative carries a factor of dy/dx."</em> The technique extends to higher-dimensional surfaces and to inverse functions, the subject of the next section.</p>

<h2 class="l-title">8. Derivative of an Inverse Function</h2>

<p class="l-text">If <em>f</em> is differentiable and one-to-one near a point, it has a local inverse <em>f<sup>-1</sup></em> that is also differentiable, and the two derivatives are reciprocals of each other.</p>

<div class="calc-formula"><span class="formula-label">Inverse Function Rule</span><div class="formula-main">$$\\bigl(f^{-1}\\bigr)'(y) = \\frac{1}{f'(x)}, \\qquad \\text{where } y = f(x).$$</div></div>

<h3 class="l-subtitle">Derivation by implicit differentiation</h3>

<p class="l-text">Start from the defining identity <em>f(f<sup>-1</sup>(y)) = y</em>. Differentiate both sides with respect to <em>y</em> using the chain rule on the left:</p>

<div class="calc-formula"><div class="formula-main">$$f'\\!\\bigl(f^{-1}(y)\\bigr) \\cdot \\bigl(f^{-1}\\bigr)'(y) = 1.$$</div></div>

<p class="l-text">Solving for the inverse derivative gives the formula above.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Natural Logarithm</div><div class="example-body">
Take <em>f(x) = e<sup>x</sup></em>, so <em>f<sup>-1</sup>(y) = ln y</em>. Then <em>f'(x) = e<sup>x</sup> = y</em>, and
$$\\bigl(\\ln\\bigr)'(y) = \\frac{1}{e^{x}} = \\frac{1}{y}.$$
This is the derivative of the natural logarithm, derived purely from the inverse-function rule.
</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Arctangent</div><div class="example-body">
Take <em>f(x) = tan x</em>, so <em>f<sup>-1</sup>(y) = arctan y</em>. Then <em>f'(x) = sec<sup>2</sup> x = 1 + tan<sup>2</sup> x = 1 + y<sup>2</sup></em>, and
$$\\bigl(\\arctan\\bigr)'(y) = \\frac{1}{1+y^{2}}.$$
A formula that no one would guess from first principles, but the inverse rule hands it to us in two lines.
</div></div>

<h2 class="l-title">9. Higher-Order Derivatives</h2>

<p class="l-text">The derivative <em>f'(x)</em> is itself a function. Differentiating it gives the <strong>second derivative</strong> <em>f''(x)</em>; differentiating again gives <em>f'''(x)</em>, and so on. These higher derivatives carry rich geometric and physical meaning.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">First derivative <em>f'</em></div><div class="card-body">Slope of the tangent line. In physics, velocity if <em>f</em> is position.</div></div>
<div class="calc-card"><div class="card-title">Second derivative <em>f''</em></div><div class="card-body">Rate of change of the slope. Concavity of the graph: <em>f'' &gt; 0</em> means concave up, <em>f'' &lt; 0</em> concave down. In physics, acceleration.</div></div>
<div class="calc-card"><div class="card-title">Third derivative <em>f'''</em></div><div class="card-body">In physics this is the <em>jerk</em> — the rate at which acceleration changes. It is what you feel when a car suddenly brakes.</div></div>
</div>

<div class="calc-example"><div class="example-label">CLASSICAL EXAMPLE — Motion of a Falling Body</div><div class="example-body">
A stone dropped from rest at height <em>h<sub>0</sub></em> satisfies <em>s(t) = h<sub>0</sub> - &frac12; g t<sup>2</sup></em>, where <em>g &asymp; 9.81 m/s<sup>2</sup></em>.
<ul style="margin:0.6rem 0 0.6rem 1.2rem;line-height:1.7">
<li>Velocity: $$s'(t) = -g\\,t$$ (negative because the stone falls)</li>
<li>Acceleration: $$s''(t) = -g$$ (constant, as Galileo discovered)</li>
<li>Jerk: $$s'''(t) = 0$$ (no jerk in idealized free fall)</li>
</ul>
This three-step chain — position, velocity, acceleration — is the classical reason the second derivative matters.
</div></div>

<h3 class="l-subtitle">Notation</h3>

<p class="l-text">Higher derivatives are written in several ways. Lagrange notation: <em>f'(x), f''(x), f'''(x), f<sup>(4)</sup>(x), &hellip;</em>. Leibniz notation:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{df}{dx}, \\quad \\frac{d^{2}f}{dx^{2}}, \\quad \\frac{d^{3}f}{dx^{3}}, \\quad \\ldots$$</div></div>

<p class="l-text">Newton's dot notation <em>&xdot;, &xddot;</em> is reserved for time derivatives in classical mechanics.</p>

<h2 class="l-title">10. Classical Exercises</h2>

<p class="l-text">Five worked problems in the style of a traditional analysis course. Cover the solutions and try each yourself before reading on.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — Polynomial (Power Rule)</div><div class="example-body">
<strong>Problem.</strong> Differentiate <em>f(x) = 4x<sup>5</sup> - 2x<sup>3</sup> + 7x - 9</em>.<br><br>
<strong>Solution.</strong> Apply the sum rule and the power rule term by term:
$$f'(x) = 4 \\cdot 5 x^{4} - 2 \\cdot 3 x^{2} + 7 \\cdot 1 - 0 = 20 x^{4} - 6 x^{2} + 7.$$
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — Product Rule</div><div class="example-body">
<strong>Problem.</strong> Differentiate <em>g(x) = (3x<sup>2</sup> + 1) ln(x)</em>.<br><br>
<strong>Solution.</strong> Take <em>u = 3x<sup>2</sup>+1</em> and <em>v = ln x</em>, so <em>u' = 6x</em> and <em>v' = 1/x</em>:
$$g'(x) = (6x)\\ln(x) + (3x^{2}+1) \\cdot \\frac{1}{x} = 6x\\ln(x) + 3x + \\frac{1}{x}.$$
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — Quotient Rule</div><div class="example-body">
<strong>Problem.</strong> Differentiate $$h(x) = \\frac{\\sin x}{x^{2}+1}.$$<br>
<strong>Solution.</strong> Take <em>u = sin x</em> and <em>v = x<sup>2</sup>+1</em>, so <em>u' = cos x</em> and <em>v' = 2x</em>:
$$h'(x) = \\frac{\\cos(x)(x^{2}+1) - \\sin(x)(2x)}{(x^{2}+1)^{2}}.$$
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — Chain Rule (Composite Function)</div><div class="example-body">
<strong>Problem.</strong> Differentiate <em>p(x) = (2x<sup>3</sup> - 5x + 1)<sup>7</sup></em>.<br><br>
<strong>Solution.</strong> Let <em>u = 2x<sup>3</sup> - 5x + 1</em>, so <em>p = u<sup>7</sup></em>. By the chain rule, <em>dp/dx = 7 u<sup>6</sup> &middot; (du/dx)</em>. Since <em>du/dx = 6x<sup>2</sup> - 5</em>:
$$p'(x) = 7 (2x^{3} - 5x + 1)^{6} \\cdot (6x^{2} - 5).$$
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — Implicit Differentiation</div><div class="example-body">
<strong>Problem.</strong> Find <em>dy/dx</em> on the ellipse <em>9 x<sup>2</sup> + 4 y<sup>2</sup> = 36</em>.<br><br>
<strong>Solution.</strong> Differentiate both sides with respect to <em>x</em>, applying the chain rule to <em>y<sup>2</sup></em>:
$$18 x + 8 y \\frac{dy}{dx} = 0.$$
Solve for <em>dy/dx</em>:
$$\\frac{dy}{dx} = -\\frac{18 x}{8 y} = -\\frac{9 x}{4 y}.$$
At the point <em>(0, 3)</em> on the ellipse, the slope is zero (horizontal tangent at the top); at <em>(2, 0)</em> the slope is undefined (vertical tangent on the right). Both match the geometry of the ellipse.
</div></div>

<h2 class="l-title">11. Summary</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Power Rule</div><div class="card-body">$$\\frac{d}{dx}[x^{n}] = n x^{n-1}$$</div></div>
<div class="calc-card"><div class="card-title">Sum Rule</div><div class="card-body">$$(f+g)' = f' + g'$$</div></div>
<div class="calc-card"><div class="card-title">Product Rule</div><div class="card-body">$$(fg)' = f'g + fg'$$</div></div>
<div class="calc-card"><div class="card-title">Quotient Rule</div><div class="card-body">$$(f/g)' = (f'g - fg')/g^{2}$$</div></div>
<div class="calc-card"><div class="card-title">Chain Rule</div><div class="card-body">$$[f(g(x))]' = f'(g(x)) g'(x)$$</div></div>
<div class="calc-card"><div class="card-title">Inverse</div><div class="card-body">$$(f^{-1})'(y) = 1/f'(x)$$</div></div>
</div>

<div class="calc-highlight"><strong>What you have learned:</strong> Every differentiable elementary function can be handled by a combination of the rules above and the derivatives of <em>sin, cos, exp, ln</em>. The next lesson introduces <strong>applications of the derivative</strong> — tangent lines, linear approximation, monotonicity, concavity, and the classical curve-sketching procedure.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text">Türevi doğrudan limit tanımından hesaplamak her fonksiyon için işe yarar ama acı verecek kadar yavaştır. <em>(x+h)<sup>7</sup></em>'yi açmak, sadeleştirmek ve <em>h</em>'yi sıfıra götürmek bir sayfa cebir gerektirir. Klasik cevap, küçük bir <strong>türev alma kuralları</strong> kutusudur — kuvvet, toplam, çarpım, bölüm, zincir — her biri bir kez kanıtlanır ve sonsuza dek kullanılır. Bunlar temel fonksiyonların türevleriyle birleştiğinde, analizin standart yapı taşlarından kurulu her ifadeyi türetebilirsiniz.</p>

<p class="l-text">Bu ders, bu kutunun dikkatli bir turudur. Her kuralı limit tanımından kanıtlıyoruz, varsa geometrik anlamını açıklıyoruz ve klasik bir analiz kitabının ruhuna uygun beş çözümlü alıştırmayla bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tamsayı <em>n</em> için kuvvet kuralı <em>(x<sup>n</sup>)' = n x<sup>n-1</sup></em>'i limit tanımından kanıtlamak</li>
<li>Toplam, fark ve sabit-katsayı kurallarını türetmek ve uygulamak</li>
<li>Çarpım kuralını kanıtlamak ve dikdörtgenin büyümesi olarak geometrik anlamını okumak</li>
<li>Bölüm kuralını doğrudan çarpım kuralından türetmek</li>
<li>Temel fonksiyonların türevlerini almak: sin, cos, exp, ln ve rasyonel kuvvetler</li>
<li>Zincir kuralını ifade edip kanıtlamak, ardından iç içe geçmiş ifadelere uygulamak</li>
<li><em>x<sup>2</sup>+y<sup>2</sup>=r<sup>2</sup></em> gibi denklemlerde örtük türev almak</li>
<li>Ters fonksiyonun türevini <em>(f<sup>-1</sup>)'(y) = 1 / f'(x)</em> formülüyle hesaplamak</li>
<li>Yüksek mertebeden türevleri hesaplamak ve konum-hız-ivme zincirini tanımak</li>
</ul>
</div>

<h2 class="l-title">1. Yapı Taşı: Sabitler ve x'in Kuvvetleri</h2>

<p class="l-text">İki türev sonraki her şeyin temelini oluşturur. Birincisi sabitin türevidir — geometrik olarak <em>f(x)=c</em>'nin grafiği eğimi sıfır olan yatay bir doğrudur. İkincisi <em>x<sup>n</sup></em>'nin türevi, yani <strong>kuvvet kuralıdır</strong> ve onu limit tanımından kanıtlayacağız.</p>

<div class="calc-formula"><span class="formula-label">Sabitin türevi</span><div class="formula-main">$$\\frac{d}{dx}[c] = 0$$</div><div class="formula-sub">Sabit bir fonksiyonun değişim hızı yoktur.</div></div>

<div class="calc-formula"><span class="formula-label">Kuvvet Kuralı</span><div class="formula-main">$$\\frac{d}{dx}\\left[x^{n}\\right] = n\\,x^{n-1}, \\qquad n \\in \\mathbb{R}$$</div><div class="formula-sub">Üssü katsayı olarak indir, sonra üsten bir çıkar.</div></div>

<h3 class="l-subtitle">Pozitif tamsayı n için ispat</h3>

<p class="l-text">Limit tanımından başlayıp binom teoremini kullanın:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^{n} - x^{n}}{h}$$</div></div>

<p class="l-text"><em>(x+h)<sup>n</sup></em>'yi açın:</p>

<div class="calc-formula"><div class="formula-main">$$(x+h)^{n} = x^{n} + n\\,x^{n-1} h + \\binom{n}{2} x^{n-2} h^{2} + \\cdots + h^{n}$$</div></div>

<p class="l-text"><em>x<sup>n</sup></em>'yi çıkarın ve <em>h</em>'ye bölün:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x+h)^{n}-x^{n}}{h} = n\\,x^{n-1} + \\binom{n}{2} x^{n-2} h + \\cdots + h^{n-1}$$</div></div>

<p class="l-text">İlkinden sonraki her terim bir <em>h</em> çarpanı taşır. <em>h</em>'yi sıfıra göndermek hepsini öldürür ve <em>n x<sup>n-1</sup></em> kalır. Aynı özdeşlik negatif tamsayılara (ters çevirme hilesiyle) ve rasyonel üslere (bölüm 7'de göreceğimiz örtük türevle) de uzanır.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">f(x) = x<sup>4</sup></div><div class="step-detail">$$f'(x) = 4 x^{3}$$</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">f(x) = x</div><div class="step-detail">$$f'(x) = 1 \\cdot x^{0} = 1$$ — y=x doğrusunun eğimi.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">f(x) = &radic;x = x<sup>1/2</sup></div><div class="step-detail">$$f'(x) = \\tfrac{1}{2} x^{-1/2} = \\frac{1}{2\\sqrt{x}}$$</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">f(x) = 1/x = x<sup>-1</sup></div><div class="step-detail">$$f'(x) = -x^{-2} = -\\frac{1}{x^{2}}$$</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">f(x) = 1/x<sup>3</sup> = x<sup>-3</sup></div><div class="step-detail">$$f'(x) = -3 x^{-4} = -\\frac{3}{x^{4}}$$</div></div></div>
</div>

<div class="calc-graph"><div class="graph-title">Kuvvet Fonksiyonları ve Teğet Eğimleri</div>
<div id="plot-l2-power-tr" style="width:100%;min-height:380px"></div>
</div>

<h2 class="l-title">2. Toplam, Fark ve Sabit Katsayı Kuralları</h2>

<p class="l-text">Türev toplamaya ve skalerle çarpmaya saygı duyar. Bu kurallar uzun polinomları rutin işe çevirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplam Kuralı</div><div class="card-body">$$(f+g)'(x) = f'(x) + g'(x)$$</div></div>
<div class="calc-card"><div class="card-title">Fark Kuralı</div><div class="card-body">$$(f-g)'(x) = f'(x) - g'(x)$$</div></div>
<div class="calc-card"><div class="card-title">Sabit Katsayı</div><div class="card-body">$$(c \\cdot f)'(x) = c \\cdot f'(x)$$</div></div>
</div>

<h3 class="l-subtitle">Toplam kuralının kanıtı</h3>

<p class="l-text"><em>F(x) = f(x) + g(x)</em> olsun. Limit tanımından:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} \\frac{[f(x+h)+g(x+h)] - [f(x)+g(x)]}{h}$$</div></div>

<p class="l-text"><em>f</em> terimlerini ve <em>g</em> terimlerini ayrı ayrı toplayın:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h} + \\lim_{h \\to 0} \\frac{g(x+h)-g(x)}{h} = f'(x) + g'(x)$$</div></div>

<p class="l-text">Aynı argüman eksi işaretiyle fark kuralını verir; sabiti limit dışına çıkarmak sabit-katsayı kuralını verir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">
<strong>Türetin:</strong> <em>f(x) = 5x<sup>3</sup> + 3x<sup>2</sup> - 7x + 12</em>.<br><br>
Toplam ve sabit-katsayı kurallarını terim terim, sonra kuvvet kuralını uygulayın:<br>
<ul style="margin:0.6rem 0 0.6rem 1.2rem;line-height:1.7">
<li>$$\\frac{d}{dx}[5x^{3}] = 5 \\cdot 3 x^{2} = 15 x^{2}$$</li>
<li>$$\\frac{d}{dx}[3x^{2}] = 3 \\cdot 2 x = 6x$$</li>
<li>$$\\frac{d}{dx}[-7x] = -7$$</li>
<li>$$\\frac{d}{dx}[12] = 0$$</li>
</ul>
<strong>$$f'(x) = 15 x^{2} + 6x - 7$$</strong>
</div></div>

<h2 class="l-title">3. Çarpım Kuralı</h2>

<p class="l-text">Bir çarpımın türevi <strong>türevlerin çarpımı değildir</strong>. Doğru formül iki terim taşır ve ilk olarak Leibniz tarafından yazılmıştır.</p>

<div class="calc-formula"><span class="formula-label">Çarpım Kuralı</span><div class="formula-main">$$\\frac{d}{dx}\\bigl[f(x)\\,g(x)\\bigr] = f'(x)\\,g(x) + f(x)\\,g'(x)$$</div><div class="formula-sub">"Birincinin türevi çarpı ikinci, artı birinci çarpı ikincinin türevi."</div></div>

<h3 class="l-subtitle">Limit tanımından kanıt</h3>

<p class="l-text"><em>F(x) = f(x) g(x)</em> olsun. Paya <em>f(x+h) g(x)</em> ekleyip çıkarın — klasik "teleskopik" hile:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} \\frac{f(x+h)g(x+h) - f(x+h)g(x) + f(x+h)g(x) - f(x)g(x)}{h}$$</div></div>

<p class="l-text">Her çifti çarpanlarına ayırın:</p>

<div class="calc-formula"><div class="formula-main">$$F'(x) = \\lim_{h \\to 0} f(x+h) \\cdot \\frac{g(x+h)-g(x)}{h} + \\lim_{h \\to 0} g(x) \\cdot \\frac{f(x+h)-f(x)}{h}$$</div></div>

<p class="l-text"><em>h &rarr; 0</em> iken <em>f(x+h) &rarr; f(x)</em> (türetilebilirlik süreklilik gerektirir). İki limit <em>g'(x)</em> ve <em>f'(x)</em>'e dönüşür ve formül çıkar.</p>

<h3 class="l-subtitle">Geometrik anlam: büyüyen dikdörtgen</h3>

<p class="l-text">Kenarları <em>f(x)</em> ve <em>g(x)</em> olan bir dikdörtgen düşünün. Alanı <em>A(x) = f(x) g(x)</em>'dir. <em>x</em> küçük bir <em>dx</em> kadar değiştiğinde her iki kenar büyür: alt kenar <em>g(x) f'(x) dx</em> alanlı ince bir şerit, sağ kenar <em>f(x) g'(x) dx</em> alanlı bir şerit süpürür; köşedeki <em>dx<sup>2</sup></em> mertebesindeki küçük kare limitte ihmal edilir. İki şerit toplandığında çarpım kuralı çıkar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">
<strong>Türetin:</strong> <em>f(x) = x<sup>2</sup> sin(x)</em>.<br><br>
<em>u = x<sup>2</sup></em>, <em>v = sin(x)</em> alın; <em>u' = 2x</em>, <em>v' = cos(x)</em>:
$$f'(x) = (2x)\\sin(x) + x^{2}\\cos(x) = 2x\\sin(x) + x^{2}\\cos(x).$$
</div></div>

<h2 class="l-title">4. Bölüm Kuralı</h2>

<p class="l-text">Bölüm kuralı oranları ele alır. Tarihsel olarak da çarpım kuralından tek satırda türetildiği gibi türetilebilir.</p>

<div class="calc-formula"><span class="formula-label">Bölüm Kuralı</span><div class="formula-main">$$\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^{2}}$$</div><div class="formula-sub">g(x) sıfırdan farklı olduğu her yerde geçerlidir.</div></div>

<h3 class="l-subtitle">Çarpım kuralından türetme</h3>

<p class="l-text">Bölümü <em>Q(x) = f(x) [g(x)]<sup>-1</sup></em> olarak yazın ve çarpım kuralını <em>[g(x)]<sup>-1</sup></em> üzerinde zincir kuralıyla birlikte uygulayın (zincir kuralını bölüm 6'da kanıtlayacağız, cebir aynıdır):</p>

<div class="calc-formula"><div class="formula-main">$$Q'(x) = f'(x) \\cdot \\frac{1}{g(x)} + f(x) \\cdot \\left(-\\frac{g'(x)}{[g(x)]^{2}}\\right)$$</div></div>

<p class="l-text">İki terimi ortak payda <em>[g(x)]<sup>2</sup></em> üzerine getirin; yukarıdaki bölüm kuralı ortaya çıkar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">
<strong>Türetin:</strong> $$f(x) = \\frac{x^{2}+1}{x-1}.$$<br>
<em>u = x<sup>2</sup>+1</em>, <em>v = x-1</em> alın; <em>u' = 2x</em>, <em>v' = 1</em>:
$$f'(x) = \\frac{(2x)(x-1) - (x^{2}+1)(1)}{(x-1)^{2}} = \\frac{x^{2} - 2x - 1}{(x-1)^{2}}.$$
</div></div>

<h2 class="l-title">5. Temel Fonksiyonların Türevleri</h2>

<p class="l-text">Analiz, küçük bir yapı taşı fonksiyonları listesi üzerinde çalışır. Bunların türevlerini ezberlemek girişin bedelidir; geri kalan her şey yukarıdaki kurallarla birleştirilince çıkar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\sin x] = \\cos x$$</div><div class="card-body">Toplama formülünden ve $$\\lim_{h \\to 0} \\frac{\\sin h}{h}=1, \\quad \\lim_{h \\to 0}\\frac{\\cos h - 1}{h}=0$$ limitlerinden kanıtlanır.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\cos x] = -\\sin x$$</div><div class="card-body">Aynı türetme; baştaki işaret değişir çünkü kosinüs (0, &pi;) aralığında azalır.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[e^{x}] = e^{x}$$</div><div class="card-body">Üstel fonksiyon kendi türevine eşit olan tek fonksiyondur (ölçekleme dışında). <em>e</em> sabitini bu özellik tanımlar.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\ln x] = \\frac{1}{x}$$</div><div class="card-body"><em>e<sup>ln x</sup> = x</em>'in örtük türevinden elde edilir. <em>x &gt; 0</em> için geçerlidir.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[\\tan x] = \\sec^{2} x$$</div><div class="card-body"><em>sin/cos</em>'a uygulanan bölüm kuralından çıkar.</div></div>
<div class="calc-card"><div class="card-title">$$\\frac{d}{dx}[a^{x}] = a^{x}\\ln a$$</div><div class="card-body"><em>a<sup>x</sup> = e<sup>x ln a</sup></em> yazıp zincir kuralını kullanın.</div></div>
</div>

<h3 class="l-subtitle">(sin x)' = cos x kanıtı</h3>

<p class="l-text">Limit tanımını ve açı toplama formülü <em>sin(x+h) = sin x cos h + cos x sin h</em>'yi uygulayın:</p>

<div class="calc-formula"><div class="formula-main">$$(\\sin x)' = \\lim_{h \\to 0} \\frac{\\sin x \\cos h + \\cos x \\sin h - \\sin x}{h}$$</div></div>

<div class="calc-formula"><div class="formula-main">$$= \\sin x \\cdot \\lim_{h \\to 0}\\frac{\\cos h - 1}{h} + \\cos x \\cdot \\lim_{h \\to 0}\\frac{\\sin h}{h} = \\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x.$$</div></div>

<div class="calc-graph"><div class="graph-title">sin(x) ve Türevi cos(x)</div>
<div id="plot-l2-trig-tr" style="width:100%;min-height:380px"></div>
</div>

<h2 class="l-title">6. Zincir Kuralı</h2>

<p class="l-text">Zincir kuralı, birinin çıkışı diğerinin girişine beslenen fonksiyonların <em>bileşkesini</em> türetir. Kutudaki en güçlü kuraldır — onsuz analiz yalnızca kısa ifadelerle baş edebilirdi.</p>

<div class="calc-formula"><span class="formula-label">Zincir Kuralı</span><div class="formula-main">$$\\frac{d}{dx}\\bigl[f(g(x))\\bigr] = f'(g(x)) \\cdot g'(x)$$</div><div class="formula-sub">"İç fonksiyonda değerlendirilen dış türev çarpı iç türev."</div></div>

<p class="l-text">Faydalı bir Leibniz-tarzı yazım: <em>y = f(u)</em> ve <em>u = g(x)</em> ise</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}.$$</div></div>

<p class="l-text">Gösterim kuralın neden doğru olduğunu sezdirir: küçük değişimler zincir boyunca çarpılır.</p>

<h3 class="l-subtitle">Geometrik sezgi</h3>

<p class="l-text"><em>g</em> girdisini <em>g'(x)</em> kadar geriyorsa ve <em>f</em> sonra <em>f'(g(x))</em> kadar geriyorsa, toplam gerilme çarpımdır. Zincir kuralı kademeli oranların analizidir.</p>

<h3 class="l-subtitle">Kanıt taslağı</h3>

<p class="l-text"><em>g</em> türevlenebilir olduğunda <em>g(x+h) = g(x) + k</em> yazın; <em>h &rarr; 0</em> iken <em>k &rarr; 0</em>. O zaman</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{f(g(x+h))-f(g(x))}{h} = \\frac{f(g(x)+k)-f(g(x))}{k} \\cdot \\frac{k}{h}.$$</div></div>

<p class="l-text">İlk çarpan <em>f'(g(x))</em>'e, ikincisi <em>g</em>'nin fark oranıdır ve <em>g'(x)</em>'e gider. (<em>k = 0</em> özel durumu küçük bir teknik ayrıntıdır; standart analiz kitapları kapsar.)</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">
<strong>Türetin:</strong> <em>y = sin(x<sup>2</sup>+1)</em>.<br><br>
Dış fonksiyonu <em>f(u) = sin u</em>, iç fonksiyonu <em>u = x<sup>2</sup>+1</em> olarak belirleyin:
$$\\frac{dy}{dx} = \\cos(x^{2}+1) \\cdot 2x.$$
</div></div>

<div class="calc-example"><div class="example-label">DAHA UZUN BİR ZİNCİR</div><div class="example-body">
<strong>Türetin:</strong> <em>y = e<sup>cos(3x)</sup></em>.<br><br>
Bu üç fonksiyonun zinciridir: <em>e<sup>(&middot;)</sup> &SmallCircle; cos(&middot;) &SmallCircle; (3x)</em>. Üç türevi çarpın:
$$\\frac{dy}{dx} = e^{\\cos(3x)} \\cdot \\bigl(-\\sin(3x)\\bigr) \\cdot 3 = -3 \\sin(3x)\\,e^{\\cos(3x)}.$$
</div></div>

<div class="calc-graph"><div class="graph-title">Bir Bileşke Fonksiyon ve Türevi</div>
<div id="plot-l2-chain-tr" style="width:100%;min-height:380px"></div>
</div>

<h2 class="l-title">7. Örtük Türev</h2>

<p class="l-text">Her eğri <em>y = f(x)</em> şeklinde bir fonksiyonun grafiği değildir. Birim çemberi düşünün, <em>x<sup>2</sup>+y<sup>2</sup>=1</em>: verilen bir <em>x</em> için iki <em>y</em> değeri denklemi sağlar. Eğrinin neredeyse her noktada hâlâ iyi tanımlı bir teğeti vardır ve eğimi <em>y için çözmeden önce</em> bulabiliriz.</p>

<p class="l-text"><strong>Yöntem:</strong> denklemin her iki tarafını <em>x</em>'e göre türetin; <em>y</em>'yi <em>x</em>'in türevlenebilir bir fonksiyonu olarak ele alın ve her <em>y</em>-terimine zincir kuralını uygulayın. Sonra <em>dy/dx</em> için çözün.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Birim Çember</div><div class="example-body">
<em>x<sup>2</sup>+y<sup>2</sup>=1</em>'den başlayın ve terim terim türetin:
$$\\frac{d}{dx}[x^{2}] + \\frac{d}{dx}[y^{2}] = \\frac{d}{dx}[1].$$
Zincir kuralı <em>y<sup>2</sup></em> terimini <em>2y &middot; (dy/dx)</em>'e çevirir:
$$2x + 2y\\,\\frac{dy}{dx} = 0 \\quad\\Longrightarrow\\quad \\frac{dy}{dx} = -\\frac{x}{y}.$$
Bu, birim çemberin herhangi bir <em>(x, y)</em> noktasındaki teğet doğrusunun eğimidir. <em>y = 0</em> olan noktalarda (en sol ve en sağ noktalar) tanımsızdır; tam da geometrinin söylediği gibi orada teğet diktir.
</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Descartes'in Yaprağı</div><div class="example-body">
Klasik eğri <em>x<sup>3</sup>+y<sup>3</sup>=3xy</em>'nin birinci dörtte birde bir lup'u vardır. Eğimini bulmak için örtük türev alın:
$$3x^{2} + 3y^{2}\\frac{dy}{dx} = 3y + 3x\\frac{dy}{dx}.$$
<em>dy/dx</em> terimlerini topla:
$$\\frac{dy}{dx}(3y^{2} - 3x) = 3y - 3x^{2} \\quad\\Longrightarrow\\quad \\frac{dy}{dx} = \\frac{y - x^{2}}{y^{2} - x}.$$
Lup'un üst noktasında (<em>x = y</em> olduğunda) bu bir dik teğete sadeleşir — yine geometrik olarak doğrulanabilen bir şey.
</div></div>

<h3 class="l-subtitle">Neden işe yarar?</h3>

<p class="l-text">Örtük türev gerçekte zincir kuralının farklı bir kıyafetidir. Dediğimiz şu: <em>"bu eğri boyunca y, x'e bağlıdır; o halde y'nin herhangi bir fonksiyonu aynı zamanda x'in fonksiyonudur ve türevi bir dy/dx çarpanı taşır."</em> Teknik, yüksek boyutlu yüzeylere ve bir sonraki bölümün konusu olan ters fonksiyonlara uzanır.</p>

<h2 class="l-title">8. Ters Fonksiyonun Türevi</h2>

<p class="l-text"><em>f</em> bir nokta yakınında türetilebilir ve birebir ise, kendisinin de türevlenebilir yerel bir tersi <em>f<sup>-1</sup></em> vardır ve iki türev birbirinin tersi olur.</p>

<div class="calc-formula"><span class="formula-label">Ters Fonksiyon Kuralı</span><div class="formula-main">$$\\bigl(f^{-1}\\bigr)'(y) = \\frac{1}{f'(x)}, \\qquad y = f(x) \\text{ olduğunda.}$$</div></div>

<h3 class="l-subtitle">Örtük türevle türetme</h3>

<p class="l-text">Tanım özdeşliği <em>f(f<sup>-1</sup>(y)) = y</em>'den başlayın. Her iki tarafı <em>y</em>'ye göre türetin ve solda zincir kuralını uygulayın:</p>

<div class="calc-formula"><div class="formula-main">$$f'\\!\\bigl(f^{-1}(y)\\bigr) \\cdot \\bigl(f^{-1}\\bigr)'(y) = 1.$$</div></div>

<p class="l-text">Ters türev için çözmek yukarıdaki formülü verir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Doğal Logaritma</div><div class="example-body">
<em>f(x) = e<sup>x</sup></em> alın, böylece <em>f<sup>-1</sup>(y) = ln y</em>. O zaman <em>f'(x) = e<sup>x</sup> = y</em> ve
$$\\bigl(\\ln\\bigr)'(y) = \\frac{1}{e^{x}} = \\frac{1}{y}.$$
Bu, doğal logaritmanın türevidir; yalnızca ters-fonksiyon kuralından türetildi.
</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Arktanjant</div><div class="example-body">
<em>f(x) = tan x</em> alın, böylece <em>f<sup>-1</sup>(y) = arctan y</em>. O zaman <em>f'(x) = sec<sup>2</sup> x = 1 + tan<sup>2</sup> x = 1 + y<sup>2</sup></em> ve
$$\\bigl(\\arctan\\bigr)'(y) = \\frac{1}{1+y^{2}}.$$
İlk ilkelerden tahmin edilmesi zor bir formül; ama ters kural onu bize iki satırda verir.
</div></div>

<h2 class="l-title">9. Yüksek Mertebeden Türevler</h2>

<p class="l-text">Türev <em>f'(x)</em> kendisi bir fonksiyondur. Onu türetmek <strong>ikinci türevi</strong> <em>f''(x)</em>'i verir; bir kez daha türetmek <em>f'''(x)</em>'i ve bu böyle devam eder. Bu yüksek türevler zengin geometrik ve fiziksel anlam taşır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birinci türev <em>f'</em></div><div class="card-body">Teğet doğrunun eğimi. Fizikte, eğer <em>f</em> konumsa, hız.</div></div>
<div class="calc-card"><div class="card-title">İkinci türev <em>f''</em></div><div class="card-body">Eğimin değişim hızı. Grafiğin içbükeyliği: <em>f'' &gt; 0</em> içbükey yukarı, <em>f'' &lt; 0</em> içbükey aşağı. Fizikte ivme.</div></div>
<div class="calc-card"><div class="card-title">Üçüncü türev <em>f'''</em></div><div class="card-body">Fizikte <em>jerk</em> — ivmenin değişim hızı. Bir araba aniden frenlediğinde hissettiğiniz şey budur.</div></div>
</div>

<div class="calc-example"><div class="example-label">KLASİK ÖRNEK — Düşen Cismin Hareketi</div><div class="example-body">
<em>h<sub>0</sub></em> yüksekliğinden serbest bırakılan bir taş <em>s(t) = h<sub>0</sub> - &frac12; g t<sup>2</sup></em>'yi sağlar; burada <em>g &asymp; 9.81 m/s<sup>2</sup></em>.
<ul style="margin:0.6rem 0 0.6rem 1.2rem;line-height:1.7">
<li>Hız: $$s'(t) = -g\\,t$$ (taş düştüğü için negatif)</li>
<li>İvme: $$s''(t) = -g$$ (sabit, Galileo'nun keşfettiği gibi)</li>
<li>Jerk: $$s'''(t) = 0$$ (idealize serbest düşmede jerk yok)</li>
</ul>
Bu üç adımlı zincir — konum, hız, ivme — ikinci türevin neden önemli olduğunun klasik nedenidir.
</div></div>

<h3 class="l-subtitle">Gösterim</h3>

<p class="l-text">Yüksek türevler birkaç şekilde yazılır. Lagrange notasyonu: <em>f'(x), f''(x), f'''(x), f<sup>(4)</sup>(x), &hellip;</em>. Leibniz notasyonu:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{df}{dx}, \\quad \\frac{d^{2}f}{dx^{2}}, \\quad \\frac{d^{3}f}{dx^{3}}, \\quad \\ldots$$</div></div>

<p class="l-text">Newton'un noktalı gösterimi <em>&xdot;, &xddot;</em> klasik mekanikteki zaman türevleri için saklıdır.</p>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Geleneksel analiz dersinin tarzında beş çözümlü problem. Çözümleri örtüp her birini önce kendiniz deneyin.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — Polinom (Kuvvet Kuralı)</div><div class="example-body">
<strong>Problem.</strong> <em>f(x) = 4x<sup>5</sup> - 2x<sup>3</sup> + 7x - 9</em>'u türetin.<br><br>
<strong>Çözüm.</strong> Toplam kuralını ve kuvvet kuralını terim terim uygulayın:
$$f'(x) = 4 \\cdot 5 x^{4} - 2 \\cdot 3 x^{2} + 7 \\cdot 1 - 0 = 20 x^{4} - 6 x^{2} + 7.$$
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — Çarpım Kuralı</div><div class="example-body">
<strong>Problem.</strong> <em>g(x) = (3x<sup>2</sup> + 1) ln(x)</em>'i türetin.<br><br>
<strong>Çözüm.</strong> <em>u = 3x<sup>2</sup>+1</em> ve <em>v = ln x</em> alın; <em>u' = 6x</em>, <em>v' = 1/x</em>:
$$g'(x) = (6x)\\ln(x) + (3x^{2}+1) \\cdot \\frac{1}{x} = 6x\\ln(x) + 3x + \\frac{1}{x}.$$
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — Bölüm Kuralı</div><div class="example-body">
<strong>Problem.</strong> $$h(x) = \\frac{\\sin x}{x^{2}+1}$$'i türetin.<br>
<strong>Çözüm.</strong> <em>u = sin x</em> ve <em>v = x<sup>2</sup>+1</em> alın; <em>u' = cos x</em>, <em>v' = 2x</em>:
$$h'(x) = \\frac{\\cos(x)(x^{2}+1) - \\sin(x)(2x)}{(x^{2}+1)^{2}}.$$
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — Zincir Kuralı (Bileşke Fonksiyon)</div><div class="example-body">
<strong>Problem.</strong> <em>p(x) = (2x<sup>3</sup> - 5x + 1)<sup>7</sup></em>'yi türetin.<br><br>
<strong>Çözüm.</strong> <em>u = 2x<sup>3</sup> - 5x + 1</em> olsun, böylece <em>p = u<sup>7</sup></em>. Zincir kuralından <em>dp/dx = 7 u<sup>6</sup> &middot; (du/dx)</em>. <em>du/dx = 6x<sup>2</sup> - 5</em> olduğundan:
$$p'(x) = 7 (2x^{3} - 5x + 1)^{6} \\cdot (6x^{2} - 5).$$
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — Örtük Türev</div><div class="example-body">
<strong>Problem.</strong> <em>9 x<sup>2</sup> + 4 y<sup>2</sup> = 36</em> elipsi üzerinde <em>dy/dx</em>'i bulun.<br><br>
<strong>Çözüm.</strong> Her iki tarafı <em>x</em>'e göre türetin; <em>y<sup>2</sup></em>'ye zincir kuralı uygulayın:
$$18 x + 8 y \\frac{dy}{dx} = 0.$$
<em>dy/dx</em> için çözün:
$$\\frac{dy}{dx} = -\\frac{18 x}{8 y} = -\\frac{9 x}{4 y}.$$
Elips üzerindeki <em>(0, 3)</em> noktasında eğim sıfırdır (üstte yatay teğet); <em>(2, 0)</em> noktasında tanımsızdır (sağda dik teğet). İkisi de elipsin geometrisiyle uyuşur.
</div></div>

<h2 class="l-title">11. Özet</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kuvvet Kuralı</div><div class="card-body">$$\\frac{d}{dx}[x^{n}] = n x^{n-1}$$</div></div>
<div class="calc-card"><div class="card-title">Toplam Kuralı</div><div class="card-body">$$(f+g)' = f' + g'$$</div></div>
<div class="calc-card"><div class="card-title">Çarpım Kuralı</div><div class="card-body">$$(fg)' = f'g + fg'$$</div></div>
<div class="calc-card"><div class="card-title">Bölüm Kuralı</div><div class="card-body">$$(f/g)' = (f'g - fg')/g^{2}$$</div></div>
<div class="calc-card"><div class="card-title">Zincir Kuralı</div><div class="card-body">$$[f(g(x))]' = f'(g(x)) g'(x)$$</div></div>
<div class="calc-card"><div class="card-title">Ters</div><div class="card-body">$$(f^{-1})'(y) = 1/f'(x)$$</div></div>
</div>

<div class="calc-highlight"><strong>Ne öğrendiniz:</strong> Türevlenebilir her temel fonksiyon, yukarıdaki kuralların ve <em>sin, cos, exp, ln</em>'in türevlerinin bir bileşimiyle ele alınabilir. Bir sonraki ders <strong>türev uygulamalarını</strong> tanıtır — teğet doğrular, doğrusal yaklaşım, monotonluk, içbükeylik ve klasik eğri çizim yordamı.</div>`,

/* ============================================================
   PLOTLY FIGURES
   ============================================================ */
plots: function() {
  if (typeof Plotly === 'undefined') return;

  var commonLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'monospace', color: 'rgba(235,230,220,0.85)', size: 11 },
    margin: { l: 50, r: 30, t: 50, b: 50 },
    xaxis: { gridcolor: 'rgba(200,169,110,0.08)', zerolinecolor: 'rgba(200,169,110,0.25)' },
    yaxis: { gridcolor: 'rgba(200,169,110,0.08)', zerolinecolor: 'rgba(200,169,110,0.25)' },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 }
  };

  // ---- Plot 1: Power functions and their tangent slopes ----
  function powerPlot(divId) {
    var el = document.getElementById(divId);
    if (!el) return;
    var xs = [];
    for (var i = -200; i <= 200; i++) xs.push(i / 100);
    var x2  = xs.map(function (x) { return x * x; });
    var x3  = xs.map(function (x) { return x * x * x; });
    var dx2 = xs.map(function (x) { return 2 * x; });
    var dx3 = xs.map(function (x) { return 3 * x * x; });
    Plotly.newPlot(divId, [
      { x: xs, y: x2,  name: 'x^2',       line: { color: '#c8a96e', width: 2 } },
      { x: xs, y: dx2, name: "d/dx x^2 = 2x",  line: { color: '#c8a96e', dash: 'dot', width: 1.5 } },
      { x: xs, y: x3,  name: 'x^3',       line: { color: '#4ecdc4', width: 2 } },
      { x: xs, y: dx3, name: "d/dx x^3 = 3x^2", line: { color: '#4ecdc4', dash: 'dot', width: 1.5 } }
    ], Object.assign({}, commonLayout, {
      xaxis: Object.assign({}, commonLayout.xaxis, { title: 'x', range: [-2, 2] }),
      yaxis: Object.assign({}, commonLayout.yaxis, { title: "f(x), f'(x)", range: [-8, 8] })
    }), { displayModeBar: false, responsive: true });
  }

  // ---- Plot 2: sin(x) and cos(x) = (sin)' ----
  function trigPlot(divId) {
    var el = document.getElementById(divId);
    if (!el) return;
    var xs = [];
    for (var i = 0; i <= 400; i++) xs.push(-2 * Math.PI + (4 * Math.PI) * (i / 400));
    var ys  = xs.map(function (x) { return Math.sin(x); });
    var dys = xs.map(function (x) { return Math.cos(x); });
    Plotly.newPlot(divId, [
      { x: xs, y: ys,  name: 'sin(x)',  line: { color: '#c8a96e', width: 2 } },
      { x: xs, y: dys, name: "(sin)' = cos(x)", line: { color: '#4ecdc4', width: 2, dash: 'dot' } }
    ], Object.assign({}, commonLayout, {
      xaxis: Object.assign({}, commonLayout.xaxis, { title: 'x' }),
      yaxis: Object.assign({}, commonLayout.yaxis, { title: 'value' })
    }), { displayModeBar: false, responsive: true });
  }

  // ---- Plot 3: Chain rule applied to sin(x^2) ----
  function chainPlot(divId) {
    var el = document.getElementById(divId);
    if (!el) return;
    var xs = [];
    for (var i = 0; i <= 600; i++) xs.push(-3 + 6 * (i / 600));
    var f  = xs.map(function (x) { return Math.sin(x * x); });
    var df = xs.map(function (x) { return Math.cos(x * x) * 2 * x; });
    Plotly.newPlot(divId, [
      { x: xs, y: f,  name: 'f(x) = sin(x^2)',                       line: { color: '#c8a96e', width: 2 } },
      { x: xs, y: df, name: "f'(x) = cos(x^2) * 2x  (chain rule)",  line: { color: '#4ecdc4', width: 2, dash: 'dot' } }
    ], Object.assign({}, commonLayout, {
      xaxis: Object.assign({}, commonLayout.xaxis, { title: 'x' }),
      yaxis: Object.assign({}, commonLayout.yaxis, { title: 'value', range: [-7, 7] })
    }), { displayModeBar: false, responsive: true });
  }

  setTimeout(function () {
    powerPlot('plot-l2-power-en');
    powerPlot('plot-l2-power-tr');
    trigPlot('plot-l2-trig-en');
    trigPlot('plot-l2-trig-tr');
    chainPlot('plot-l2-chain-en');
    chainPlot('plot-l2-chain-tr');
  }, 250);
}

};
