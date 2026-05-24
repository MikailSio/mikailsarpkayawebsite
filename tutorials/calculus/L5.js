window.CALCULUS_L5 = {

en: `
<p class="l-text"><strong>Integration</strong> is the second great pillar of calculus. Where the derivative takes a function apart to measure its instantaneous rate of change, the integral puts the pieces back together to measure total accumulation. The integral answers: "given the rate at which something is changing, how much of it has accumulated?" Equivalently, in geometry: "what is the area under the curve?"</p>

<p class="l-text">In this lesson we treat integration as a topic in pure mathematics. We start from the inverse problem of differentiation, build the definite integral as a limit of Riemann sums, prove the Fundamental Theorem of Calculus that joins the two ideas, and then learn the classical techniques (substitution, parts, partial fractions, trigonometric substitution) that turn integration into a craft. We finish with improper integrals and a set of classical exercises.</p>

<div class="calc-highlight"><strong>Why this matters:</strong> Every formula for length, area, volume, work, mass, displacement, charge, and probability is, at its heart, an integral. The same machinery that gives the area of an ellipse also gives the work done by a variable force and the centre of mass of a thin plate.</div>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the inverse problem of differentiation and define the antiderivative</li>
<li>Construct the definite integral as a limit of Riemann sums</li>
<li>Prove and apply both parts of the Fundamental Theorem of Calculus</li>
<li>Master the four classical techniques: substitution, parts, partial fractions, trigonometric substitution</li>
<li>Recognise and evaluate improper integrals on unbounded intervals</li>
<li>Solve a battery of classical exercises and physical-geometric applications</li>
</ul>
</div>

<h2 class="l-title">1. The Inverse Problem of Differentiation</h2>

<p class="l-text">Differential calculus gives us, for each well-behaved function $F$, a new function $F'$ called its derivative. A natural question is the converse:</p>

<div class="calc-formula"><span class="formula-label">The inverse problem</span><div class="formula-main">$$\\text{Given } f(x), \\text{ find } F(x) \\text{ such that } F'(x) = f(x).$$</div><div class="formula-sub">$F$ is called an <em>antiderivative</em> (or primitive) of $f$.</div></div>

<p class="l-text">The first observation is that antiderivatives are not unique. If $F'(x)=f(x)$ and $C$ is any constant, then $(F+C)'=F'=f$ as well. Conversely, if $G$ is another antiderivative on an interval, then $(G-F)'=0$, so by the Mean Value Theorem $G-F$ is constant. We collect this in one statement:</p>

<div class="calc-formula"><span class="formula-label">Theorem (family of antiderivatives)</span><div class="formula-main">$$\\int f(x)\\,dx = F(x) + C, \\qquad F'(x)=f(x).$$</div><div class="formula-sub">All antiderivatives of $f$ on an interval differ by a constant.</div></div>

<p class="l-text">The symbol $\\int f(x)\\,dx$ is called the <strong>indefinite integral</strong> of $f$. The notation $\\int \\cdots dx$ was introduced by Leibniz; the elongated S stands for a Latin "summa" (sum), foreshadowing the area interpretation we shall meet shortly. The differential $dx$ records that $x$ is the independent variable and behaves consistently under the change-of-variable formula.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Antiderivative</div><div class="card-body">A function $F$ with $F'=f$. Always exists for continuous $f$ on an interval; uniqueness fails by a constant.</div></div>
<div class="calc-card"><div class="card-title">Indefinite integral</div><div class="card-body">The family $\\{F+C : C\\in\\mathbb{R}\\}$, written $\\int f\\,dx$. A function plus a constant of integration.</div></div>
<div class="calc-card"><div class="card-title">Integrand</div><div class="card-body">The function $f$ inside the integral sign. The differential $dx$ marks the variable of integration.</div></div>
<div class="calc-card"><div class="card-title">Why $+C$?</div><div class="card-body">Because $\\dfrac{d}{dx}C=0$, the derivative cannot detect a constant; integration must reinstate it.</div></div>
</div>

<p class="l-text">By reading the derivative table in reverse we obtain a short table of antiderivatives. Each row is verified by differentiating the right-hand side.</p>

<div class="calc-formula"><span class="formula-label">Basic antiderivatives</span><div class="formula-main">$$\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1}+C\\ \\,(n\\neq-1),\\quad \\int \\frac{dx}{x}=\\ln|x|+C,\\quad \\int e^{x}\\,dx=e^{x}+C$$</div><div class="formula-sub">$$\\int \\cos x\\,dx=\\sin x+C,\\quad \\int \\sin x\\,dx=-\\cos x+C,\\quad \\int \\sec^{2}x\\,dx=\\tan x+C.$$</div></div>

<h2 class="l-title">2. Antiderivative and Indefinite Integral</h2>

<p class="l-text">Because differentiation is linear, so is its inverse: for constants $a,b$ and functions $f,g$,</p>

<div class="calc-formula"><span class="formula-label">Linearity of the integral</span><div class="formula-main">$$\\int \\bigl(a\\,f(x)+b\\,g(x)\\bigr)\\,dx = a\\int f(x)\\,dx + b\\int g(x)\\,dx.$$</div></div>

<p class="l-text">Two warnings: there is no product rule and no quotient rule for integrals; in general $\\int fg \\neq (\\int f)(\\int g)$. The techniques developed in Sections 5-8 will give us substitutes.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2.1 - Polynomial</div><div class="example-body">Evaluate $\\displaystyle\\int (3x^{2}-4x+7)\\,dx$.<br><br>By linearity and the power rule, $\\int 3x^{2}\\,dx = x^{3}$, $\\int (-4x)\\,dx = -2x^{2}$, $\\int 7\\,dx = 7x$. Summing, $$\\int(3x^{2}-4x+7)\\,dx = x^{3}-2x^{2}+7x + C.$$ Differentiate to verify: $3x^{2}-4x+7$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2.2 - Roots and reciprocals</div><div class="example-body">Compute $\\displaystyle\\int \\Bigl(\\sqrt{x}+\\tfrac{1}{x^{2}}\\Bigr)\\,dx$.<br><br>Rewrite as $\\int (x^{1/2}+x^{-2})\\,dx = \\tfrac{x^{3/2}}{3/2}+\\tfrac{x^{-1}}{-1}+C = \\tfrac{2}{3}x^{3/2}-\\tfrac{1}{x}+C$.</div></div>

<h2 class="l-title">3. The Definite Integral as Area</h2>

<p class="l-text">So far the integral has only been a symbolic inverse of differentiation. We now give it a geometric soul. Suppose $f$ is continuous and non-negative on $[a,b]$. Partition the interval into $n$ subintervals of equal width $\\Delta x=(b-a)/n$, choose any sample point $x_{i}^{*}\\in[x_{i-1},x_{i}]$, and form the <strong>Riemann sum</strong>:</p>

<div class="calc-formula"><span class="formula-label">Riemann sum</span><div class="formula-main">$$S_{n}\\;=\\;\\sum_{i=1}^{n} f(x_{i}^{*})\\,\\Delta x.$$</div><div class="formula-sub">A sum of areas of thin rectangles of height $f(x_{i}^{*})$ and width $\\Delta x$.</div></div>

<div class="calc-graph"><div class="graph-title">Riemann sum: rectangles approximating area</div>
<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg">
<line x1="60" y1="210" x2="460" y2="210" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
<line x1="60" y1="20" x2="60" y2="210" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
<rect x="80" y="155" width="40" height="55" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="120" y="120" width="40" height="90" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="160" y="85" width="40" height="125" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="200" y="55" width="40" height="155" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="240" y="40" width="40" height="170" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="280" y="55" width="40" height="155" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="320" y="90" width="40" height="120" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="360" y="140" width="40" height="70" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<path d="M80,160 Q120,125 160,88 Q200,55 260,38 Q320,55 360,95 Q400,145 420,180" fill="none" stroke="#c8a96e" stroke-width="2.5" stroke-linecap="round"/>
<text x="250" y="235" fill="rgba(255,255,255,.5)" font-family="monospace" font-size="10" text-anchor="middle">Δx = (b − a)/n   —   refine the partition, sharpen the approximation</text>
<text x="430" y="135" fill="#c8a96e" font-family="monospace" font-size="10">f(x)</text>
</svg>
<div class="graph-caption">Each rectangle has width $\\Delta x$ and height $f(x_{i}^{*})$. As $n\\to\\infty$ the rectangles flatten against the curve and the total area approaches the exact integral.</div>
</div>

<div class="calc-formula"><span class="formula-label">The definite integral</span><div class="formula-main">$$\\int_{a}^{b} f(x)\\,dx \\;=\\; \\lim_{n\\to\\infty} \\sum_{i=1}^{n} f(x_{i}^{*})\\,\\Delta x,$$</div><div class="formula-sub">provided the limit exists and is independent of the choice of sample points $x_{i}^{*}$. When it does, $f$ is said to be Riemann integrable on $[a,b]$.</div></div>

<p class="l-text"><strong>Existence theorem.</strong> If $f$ is continuous on $[a,b]$ (or merely bounded with finitely many discontinuities), then $f$ is Riemann integrable. The proof uses uniform continuity on a compact interval to control the gap between upper and lower Darboux sums.</p>

<p class="l-text">Three immediate properties follow from the definition by passing limits through sums:</p>

<div class="calc-formula"><span class="formula-label">Properties of the definite integral</span><div class="formula-main">$$\\int_{a}^{a} f = 0, \\qquad \\int_{a}^{b} f = -\\int_{b}^{a} f, \\qquad \\int_{a}^{c} f = \\int_{a}^{b} f + \\int_{b}^{c} f.$$</div><div class="formula-sub">Linearity, sign-flip on reversed limits, and additivity across a split point $b\\in[a,c]$.</div></div>

<p class="l-text"><strong>Signed area.</strong> If $f$ takes negative values, the rectangles below the axis contribute negative area. The definite integral is therefore <em>net signed area</em>: positive area above the $x$-axis minus positive area below.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3.1 - Riemann sum by hand</div><div class="example-body">Estimate $\\int_{0}^{1} x^{2}\\,dx$ with right endpoints and $n=4$: $\\Delta x=\\tfrac{1}{4}$, sample points $\\tfrac{1}{4},\\tfrac{2}{4},\\tfrac{3}{4},1$. $$S_{4} = \\tfrac{1}{4}\\Bigl(\\tfrac{1}{16}+\\tfrac{4}{16}+\\tfrac{9}{16}+\\tfrac{16}{16}\\Bigr) = \\tfrac{30}{64} = 0.46875.$$ The exact value (Section 4) is $\\tfrac{1}{3}\\approx 0.333$. With right endpoints we overestimate, since $x^{2}$ is increasing.</div></div>

<h2 class="l-title">4. The Fundamental Theorem of Calculus</h2>

<p class="l-text">A Riemann sum with $n=10^{6}$ rectangles is not a calculation a human carries out. The Fundamental Theorem of Calculus reveals that we do not have to: every definite integral of a continuous function can be computed from any antiderivative by a single subtraction. The theorem comes in two halves.</p>

<div class="calc-formula"><span class="formula-label">FTC Part I (antiderivative theorem)</span><div class="formula-main">$$\\text{If } f \\text{ is continuous on }[a,b]\\text{ and } G(x)=\\int_{a}^{x} f(t)\\,dt, \\text{ then } G'(x)=f(x).$$</div><div class="formula-sub">The function "accumulated area from $a$" is itself an antiderivative of $f$.</div></div>

<div class="calc-formula"><span class="formula-label">FTC Part II (evaluation theorem)</span><div class="formula-main">$$\\int_{a}^{b} f(x)\\,dx \\;=\\; F(b) - F(a) \\quad \\text{for any antiderivative } F.$$</div><div class="formula-sub">Often abbreviated $F(x)\\Big|_{a}^{b}$.</div></div>

<p class="l-text"><strong>Intuition for Part I.</strong> Fix $x\\in(a,b)$ and a small $h>0$. The increment $G(x+h)-G(x)$ is the area of a thin sliver of width $h$ under the graph near $x$; by continuity of $f$, the height of that sliver is approximately $f(x)$. Hence</p>

<div class="calc-formula"><span class="formula-label">Proof sketch of FTC I</span><div class="formula-main">$$\\frac{G(x+h)-G(x)}{h} = \\frac{1}{h}\\int_{x}^{x+h} f(t)\\,dt \\xrightarrow[h\\to 0]{} f(x),$$</div><div class="formula-sub">by the mean-value form: there exists $c_{h}\\in[x,x+h]$ with $\\int_{x}^{x+h}f = f(c_{h})\\,h$, and $f(c_{h})\\to f(x)$ as $h\\to 0$.</div></div>

<p class="l-text"><strong>Proof of Part II from Part I.</strong> Let $F$ be any antiderivative of $f$, and let $G$ be the accumulation function $G(x)=\\int_{a}^{x}f$. Both satisfy $F'=G'=f$ on $[a,b]$, so $F-G$ is constant. Therefore $$F(b)-F(a) = \\bigl(G(b)+C\\bigr) - \\bigl(G(a)+C\\bigr) = G(b)-G(a) = \\int_{a}^{b} f - 0 = \\int_{a}^{b} f.\\;\\square$$</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4.1 - FTC in action</div><div class="example-body">Evaluate $\\int_{0}^{1} x^{2}\\,dx$. An antiderivative is $F(x)=\\tfrac{x^{3}}{3}$, so $$\\int_{0}^{1} x^{2}\\,dx = \\tfrac{1^{3}}{3}-\\tfrac{0^{3}}{3} = \\tfrac{1}{3}.$$ This is the exact value the Riemann sums of Example 3.1 were approaching.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4.2 - Trigonometric</div><div class="example-body">Compute $\\int_{0}^{\\pi}\\sin x\\,dx$. Antiderivative $F(x)=-\\cos x$, hence $$-\\cos(\\pi)-(-\\cos 0) = 1+1 = 2.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4.3 - Derivative of an integral</div><div class="example-body">Use FTC I to differentiate $G(x)=\\int_{1}^{x^{2}} \\sin(t^{2})\\,dt$. Set $u=x^{2}$; by Part I and the chain rule, $G'(x) = \\sin(u^{2})\\cdot u' = \\sin(x^{4})\\cdot 2x.$</div></div>

<div class="calc-graph"><div class="graph-title">FTC: differentiation and integration are inverses</div>
<svg viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ftcA" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#c8a96e"/></marker>
<marker id="ftcB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#4ecdc4"/></marker></defs>
<rect x="30" y="40" width="160" height="50" rx="10" fill="rgba(200,169,110,.12)" stroke="#c8a96e" stroke-width="1.5"/>
<text x="110" y="70" fill="#c8a96e" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">f(x)</text>
<rect x="330" y="40" width="160" height="50" rx="10" fill="rgba(78,205,196,.12)" stroke="#4ecdc4" stroke-width="1.5"/>
<text x="410" y="70" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">F(x)</text>
<line x1="195" y1="55" x2="325" y2="55" stroke="#4ecdc4" stroke-width="2" marker-end="url(#ftcB)"/>
<text x="260" y="48" fill="#4ecdc4" font-family="monospace" font-size="10" text-anchor="middle">∫  integrate</text>
<line x1="325" y1="80" x2="195" y2="80" stroke="#c8a96e" stroke-width="2" marker-end="url(#ftcA)"/>
<text x="260" y="100" fill="#c8a96e" font-family="monospace" font-size="10" text-anchor="middle">d/dx  differentiate</text>
</svg>
<div class="graph-caption">Two operations, one round trip: $\\frac{d}{dx}\\!\\int f = f$ and $\\int F' = F+C$.</div>
</div>

<h2 class="l-title">5. The Substitution Rule</h2>

<p class="l-text">The substitution rule is the integral counterpart of the chain rule. If $u=g(x)$ is differentiable and $f$ is continuous on the range of $g$, then</p>

<div class="calc-formula"><span class="formula-label">Substitution (indefinite form)</span><div class="formula-main">$$\\int f\\bigl(g(x)\\bigr)\\,g'(x)\\,dx \\;=\\; \\int f(u)\\,du, \\qquad u=g(x).$$</div><div class="formula-sub">Verification: differentiate the right side using the chain rule and recover the left integrand.</div></div>

<p class="l-text">For definite integrals one must change the limits as well:</p>

<div class="calc-formula"><span class="formula-label">Substitution (definite form)</span><div class="formula-main">$$\\int_{a}^{b} f\\bigl(g(x)\\bigr)\\,g'(x)\\,dx \\;=\\; \\int_{g(a)}^{g(b)} f(u)\\,du.$$</div></div>

<p class="l-text"><strong>How to choose $u$.</strong> Look inside the integrand for a composition $f(g(x))$ where $g'(x)$ (up to a constant) is also present as a factor. The classical signal is a "function of something" multiplied by the derivative of that "something".</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5.1 - $\\int x\\,e^{x^{2}}\\,dx$</div><div class="example-body">Let $u=x^{2}$, then $du=2x\\,dx$, hence $x\\,dx = \\tfrac{1}{2}du$. The integral becomes $$\\int e^{u}\\cdot \\tfrac{1}{2}du = \\tfrac{1}{2}e^{u}+C = \\tfrac{1}{2}e^{x^{2}}+C.$$ Check: $\\frac{d}{dx}\\!\\left(\\tfrac{1}{2}e^{x^{2}}\\right) = \\tfrac{1}{2}e^{x^{2}}\\cdot 2x = x\\,e^{x^{2}}$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5.2 - $\\int \\tan x\\,dx$</div><div class="example-body">Write $\\tan x = \\dfrac{\\sin x}{\\cos x}$ and set $u=\\cos x$, $du=-\\sin x\\,dx$: $$\\int \\frac{\\sin x}{\\cos x}\\,dx = -\\int \\frac{du}{u} = -\\ln|u|+C = -\\ln|\\cos x|+C = \\ln|\\sec x|+C.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5.3 - Definite, with limit change</div><div class="example-body">$\\displaystyle\\int_{0}^{2} \\frac{x}{1+x^{2}}\\,dx$. Let $u=1+x^{2}$, $du=2x\\,dx$. When $x=0,u=1$; when $x=2,u=5$. $$\\int_{0}^{2}\\frac{x}{1+x^{2}}\\,dx = \\tfrac{1}{2}\\int_{1}^{5}\\frac{du}{u} = \\tfrac{1}{2}\\ln 5.$$</div></div>

<h2 class="l-title">6. Integration by Parts</h2>

<p class="l-text">Integration by parts is the integral counterpart of the <em>product rule</em>. Differentiate a product $u\\,v$:</p>

<div class="calc-formula"><span class="formula-label">Derivation from the product rule</span><div class="formula-main">$$\\frac{d}{dx}(uv) = u'v + uv' \\;\\Longrightarrow\\; uv = \\int u'v\\,dx + \\int uv'\\,dx,$$</div><div class="formula-sub">$$\\boxed{\\int u\\,dv \\;=\\; uv - \\int v\\,du.}$$</div></div>

<p class="l-text">A successful application of parts trades the original integral $\\int u\\,dv$ for an easier one, $\\int v\\,du$. The choice of $u$ and $dv$ is the entire art. The mnemonic <strong>LIATE</strong> — Logarithmic, Inverse-trig, Algebraic, Trigonometric, Exponential — orders candidates for $u$ from highest to lowest priority.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6.1 - $\\int x\\,\\ln x\\,dx$</div><div class="example-body">Choose $u=\\ln x$ (logarithmic; high LIATE priority), $dv=x\\,dx$. Then $du=\\tfrac{dx}{x}$ and $v=\\tfrac{x^{2}}{2}$. $$\\int x\\ln x\\,dx = \\frac{x^{2}}{2}\\ln x - \\int \\frac{x^{2}}{2}\\cdot \\frac{dx}{x} = \\frac{x^{2}}{2}\\ln x - \\frac{x^{2}}{4}+C.$$ Differentiating verifies the answer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6.2 - $\\int x\\,e^{x}\\,dx$</div><div class="example-body">Take $u=x$, $dv=e^{x}\\,dx$. Then $du=dx$, $v=e^{x}$. $$\\int x\\,e^{x}\\,dx = x\\,e^{x} - \\int e^{x}\\,dx = (x-1)e^{x}+C.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6.3 - $\\int \\ln x\\,dx$ (a clever trick)</div><div class="example-body">There is no obvious product, but write $\\ln x = (\\ln x)\\cdot 1$. Pick $u=\\ln x$, $dv=dx$, so $du=\\tfrac{dx}{x}$, $v=x$. $$\\int \\ln x\\,dx = x\\ln x - \\int x\\cdot \\tfrac{dx}{x} = x\\ln x - x + C.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6.4 - Parts twice (reduction)</div><div class="example-body">For $I=\\int e^{x}\\sin x\\,dx$, parts once gives $I = e^{x}\\sin x - \\int e^{x}\\cos x\\,dx$. Parts again on the new integral gives $\\int e^{x}\\cos x\\,dx = e^{x}\\cos x + I$. Substitute back: $I = e^{x}\\sin x - e^{x}\\cos x - I$, hence $2I=e^{x}(\\sin x-\\cos x)$ and $I=\\tfrac{1}{2}e^{x}(\\sin x-\\cos x)+C$.</div></div>

<h2 class="l-title">7. Partial Fractions</h2>

<p class="l-text">Rational functions $P(x)/Q(x)$ (with $\\deg P<\\deg Q$) can be integrated by first decomposing them into a sum of simpler fractions. The decomposition follows the factorization of $Q(x)$ over the reals.</p>

<div class="calc-formula"><span class="formula-label">Decomposition rules</span><div class="formula-main">$$\\frac{P(x)}{(x-r)^{k}} = \\frac{A_{1}}{x-r}+\\cdots+\\frac{A_{k}}{(x-r)^{k}}, \\quad \\frac{P(x)}{(x^{2}+bx+c)^{k}} = \\sum_{j=1}^{k}\\frac{B_{j}x+C_{j}}{(x^{2}+bx+c)^{j}}.$$</div><div class="formula-sub">Linear factors give constants on top; irreducible quadratics give linear numerators.</div></div>

<p class="l-text">Once decomposed, each piece integrates to either a logarithm ($\\int\\!dx/(x-r)$) or an arctangent ($\\int\\!dx/(x^{2}+a^{2})$), possibly after a small substitution.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7.1 - $\\displaystyle\\int \\frac{dx}{(x-1)(x+2)}$</div><div class="example-body">Seek $A,B$ with $\\dfrac{1}{(x-1)(x+2)} = \\dfrac{A}{x-1}+\\dfrac{B}{x+2}.$ Multiply through: $1 = A(x+2)+B(x-1)$. Setting $x=1$: $1=3A\\Rightarrow A=\\tfrac{1}{3}$. Setting $x=-2$: $1=-3B\\Rightarrow B=-\\tfrac{1}{3}$. Therefore $$\\int\\frac{dx}{(x-1)(x+2)} = \\tfrac{1}{3}\\ln|x-1|-\\tfrac{1}{3}\\ln|x+2|+C = \\tfrac{1}{3}\\ln\\!\\left|\\frac{x-1}{x+2}\\right|+C.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7.2 - Repeated linear factor</div><div class="example-body">$\\displaystyle\\int \\frac{x}{(x-1)^{2}}\\,dx$. Write $\\dfrac{x}{(x-1)^{2}} = \\dfrac{A}{x-1}+\\dfrac{B}{(x-1)^{2}}$. Multiplying: $x = A(x-1)+B$, so $A=1, B=1$. Hence $$\\int\\frac{x\\,dx}{(x-1)^{2}} = \\ln|x-1| - \\frac{1}{x-1}+C.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7.3 - Irreducible quadratic</div><div class="example-body">$\\displaystyle\\int \\frac{dx}{x^{2}+4}$. No real factorization. Write $x=2\\tan\\theta$ or directly recognise the arctangent template: $$\\int\\frac{dx}{x^{2}+a^{2}} = \\frac{1}{a}\\arctan\\!\\frac{x}{a}+C \\;\\Longrightarrow\\; \\tfrac{1}{2}\\arctan\\!\\tfrac{x}{2}+C.$$</div></div>

<h2 class="l-title">8. Trigonometric Substitutions</h2>

<p class="l-text">Integrals containing $\\sqrt{a^{2}-x^{2}}$, $\\sqrt{a^{2}+x^{2}}$, or $\\sqrt{x^{2}-a^{2}}$ can often be tamed by replacing $x$ with a trigonometric function tailored to remove the radical. The Pythagorean identities $\\sin^{2}+\\cos^{2}=1$ and $1+\\tan^{2}=\\sec^{2}$ do the heavy lifting.</p>

<div class="calc-formula"><span class="formula-label">Standard substitutions</span><div class="formula-main">$$\\sqrt{a^{2}-x^{2}}:\\ x=a\\sin\\theta,\\quad \\sqrt{a^{2}+x^{2}}:\\ x=a\\tan\\theta,\\quad \\sqrt{x^{2}-a^{2}}:\\ x=a\\sec\\theta.$$</div><div class="formula-sub">Choose the trigonometric function whose Pythagorean identity collapses the radicand.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8.1 - Area of a circle</div><div class="example-body">Compute $\\int \\sqrt{a^{2}-x^{2}}\\,dx$ on $[-a,a]$ to recover the area of a semicircle. Substitute $x=a\\sin\\theta$, $dx=a\\cos\\theta\\,d\\theta$, and $\\sqrt{a^{2}-x^{2}}=a\\cos\\theta$. The integral becomes $$\\int a^{2}\\cos^{2}\\theta\\,d\\theta = \\tfrac{a^{2}}{2}(\\theta+\\sin\\theta\\cos\\theta)+C.$$ Evaluating between $\\theta=-\\tfrac{\\pi}{2}$ and $\\tfrac{\\pi}{2}$ gives $\\tfrac{a^{2}\\pi}{2}$ — the area of the upper semicircle of radius $a$. Hence the area of the full circle is $\\pi a^{2}$, recovered analytically.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8.2 - $\\int \\dfrac{dx}{\\sqrt{x^{2}+1}}$</div><div class="example-body">Let $x=\\tan\\theta$, $dx=\\sec^{2}\\theta\\,d\\theta$, $\\sqrt{x^{2}+1}=\\sec\\theta$. The integral collapses to $$\\int \\sec\\theta\\,d\\theta = \\ln|\\sec\\theta+\\tan\\theta|+C = \\ln\\!\\bigl|\\sqrt{x^{2}+1}+x\\bigr|+C = \\operatorname{arsinh}x+C.$$</div></div>

<h2 class="l-title">9. Improper Integrals</h2>

<p class="l-text">The Riemann integral is defined on bounded intervals for bounded integrands. To extend it to unbounded intervals or to functions with vertical asymptotes we use limits.</p>

<div class="calc-formula"><span class="formula-label">Type I (unbounded interval)</span><div class="formula-main">$$\\int_{a}^{\\infty} f(x)\\,dx \\;=\\; \\lim_{R\\to\\infty}\\int_{a}^{R} f(x)\\,dx,$$</div><div class="formula-sub">and similarly for $\\int_{-\\infty}^{b}$; the doubly-infinite integral is split at any convenient point and treated as two separate limits.</div></div>

<div class="calc-formula"><span class="formula-label">Type II (integrand blows up)</span><div class="formula-main">$$\\int_{a}^{b} f(x)\\,dx \\;=\\; \\lim_{t\\to b^{-}}\\int_{a}^{t} f(x)\\,dx, \\quad \\text{if } f \\text{ is unbounded near } b.$$</div></div>

<p class="l-text">An improper integral <strong>converges</strong> if the relevant limit exists (finite) and <strong>diverges</strong> otherwise.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9.1 - Convergence on $[1,\\infty)$</div><div class="example-body">$\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{x^{p}}$. For $p\\neq 1$, $\\int_{1}^{R} x^{-p}\\,dx = \\frac{R^{1-p}-1}{1-p}$. As $R\\to\\infty$: converges iff $1-p<0$, i.e. $p>1$. For $p=1$, $\\int_{1}^{R}\\!dx/x=\\ln R\\to\\infty$. So $\\int_{1}^{\\infty}x^{-p}\\,dx$ converges iff $p>1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9.2 - A celebrated improper integral</div><div class="example-body">$\\displaystyle\\int_{0}^{\\infty} e^{-x}\\,dx$. The antiderivative is $-e^{-x}$, so $$\\int_{0}^{R} e^{-x}\\,dx = 1-e^{-R}\\xrightarrow[R\\to\\infty]{} 1.$$ The total area under $e^{-x}$ over the positive axis is exactly $1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9.3 - Vertical asymptote</div><div class="example-body">$\\displaystyle\\int_{0}^{1}\\frac{dx}{\\sqrt{x}}$. The integrand blows up at $0$. $\\int_{t}^{1}x^{-1/2}\\,dx = 2-2\\sqrt{t}\\to 2$ as $t\\to 0^{+}$. The integral converges to $2$.</div></div>

<h2 class="l-title">10. Applications: Physics and Geometry</h2>

<p class="l-text">Integration arose historically from geometric and physical problems. A small sample, kept brief because the techniques above are the main subject of this lesson:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Displacement from velocity</div><div class="card-body">If a particle has velocity $v(t)$, its net displacement from $t=a$ to $t=b$ is $\\int_{a}^{b} v(t)\\,dt$. Positive area = forward motion; negative = backward.</div></div>
<div class="calc-card"><div class="card-title">Work by a variable force</div><div class="card-body">A force $F(x)$ acting along the $x$-axis from $a$ to $b$ does work $W=\\int_{a}^{b} F(x)\\,dx$ (Hooke's law for a spring gives $W=\\tfrac{1}{2}kx^{2}$).</div></div>
<div class="calc-card"><div class="card-title">Volume of revolution</div><div class="card-body">Rotating $y=f(x)\\ge 0$ around the $x$-axis on $[a,b]$ yields a solid of volume $V=\\pi\\!\\int_{a}^{b} f(x)^{2}\\,dx$ (disk method).</div></div>
<div class="calc-card"><div class="card-title">Arc length</div><div class="card-body">The length of the curve $y=f(x)$ on $[a,b]$ is $L=\\int_{a}^{b}\\sqrt{1+f'(x)^{2}}\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">Average value</div><div class="card-body">The mean value of $f$ on $[a,b]$ is $\\bar f = \\dfrac{1}{b-a}\\int_{a}^{b} f(x)\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">Probability (brief note)</div><div class="card-body">For a probability density $f\\ge 0$ with $\\int_{-\\infty}^{\\infty}\\!f = 1$, the probability $P(a\\le X\\le b)=\\int_{a}^{b} f$. A direct application of definite integration; a full treatment belongs in a probability course.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 10.1 - Volume of a sphere by revolution</div><div class="example-body">Rotate $y=\\sqrt{R^{2}-x^{2}}$ on $[-R,R]$ around the $x$-axis: $$V=\\pi\\int_{-R}^{R}(R^{2}-x^{2})\\,dx = \\pi\\!\\left[R^{2}x-\\tfrac{x^{3}}{3}\\right]_{-R}^{R} = \\tfrac{4}{3}\\pi R^{3}.$$ The volume of a sphere of radius $R$, recovered by integration alone.</div></div>

<h2 class="l-title">11. Klasik Alıştırmalar (Classical Exercises)</h2>

<p class="l-text">A graded battery of exercises. Try each on paper before reading the solution.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 - Power rule</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int x^{2}\\,dx$. <br><br><strong>Solution.</strong> By the power rule with $n=2$: $$\\int x^{2}\\,dx = \\frac{x^{3}}{3}+C.$$ Verify: $\\frac{d}{dx}\\!\\left(\\tfrac{x^{3}}{3}\\right)=x^{2}$. ✓</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 - Trigonometric primitive</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int \\sin x\\,dx$. <br><br><strong>Solution.</strong> Since $\\frac{d}{dx}\\!\\left(-\\cos x\\right)=\\sin x$, $$\\int \\sin x\\,dx = -\\cos x+C.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 - Exponential primitive</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int e^{x}\\,dx$. <br><br><strong>Solution.</strong> The exponential is its own derivative, hence its own antiderivative up to a constant: $$\\int e^{x}\\,dx = e^{x}+C.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 - Substitution</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int x\\,e^{x^{2}}\\,dx$ by substitution.<br><br><strong>Solution.</strong> Let $u=x^{2}$, $du=2x\\,dx$, so $x\\,dx=\\tfrac{1}{2}du$. $$\\int x\\,e^{x^{2}}\\,dx = \\tfrac{1}{2}\\!\\int e^{u}\\,du = \\tfrac{1}{2}e^{u}+C = \\tfrac{1}{2}e^{x^{2}}+C.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 - Integration by parts</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int x\\,\\ln x\\,dx$ by parts.<br><br><strong>Solution.</strong> $u=\\ln x$, $dv=x\\,dx$ $\\Rightarrow$ $du=dx/x$, $v=x^{2}/2$. $$\\int x\\ln x\\,dx = \\frac{x^{2}}{2}\\ln x - \\int \\frac{x^{2}}{2}\\cdot\\frac{dx}{x} = \\frac{x^{2}}{2}\\ln x - \\frac{x^{2}}{4}+C.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 - Partial fractions</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\displaystyle\\int \\frac{dx}{(x-1)(x+2)}$.<br><br><strong>Solution.</strong> Decompose: $\\dfrac{1}{(x-1)(x+2)} = \\dfrac{1}{3}\\!\\left(\\dfrac{1}{x-1}-\\dfrac{1}{x+2}\\right)$. Therefore $$\\int\\frac{dx}{(x-1)(x+2)} = \\frac{1}{3}\\ln\\!\\left|\\frac{x-1}{x+2}\\right|+C.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 - Definite integral via FTC</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int_{0}^{2}(3x^{2}+2x)\\,dx$.<br><br><strong>Solution.</strong> Antiderivative $F(x)=x^{3}+x^{2}$. By FTC II, $$F(2)-F(0) = (8+4)-(0+0) = 12.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 - Trigonometric substitution</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int \\sqrt{1-x^{2}}\\,dx$.<br><br><strong>Solution.</strong> Set $x=\\sin\\theta$, $dx=\\cos\\theta\\,d\\theta$, $\\sqrt{1-x^{2}}=\\cos\\theta$. $$\\int \\cos^{2}\\theta\\,d\\theta = \\tfrac{1}{2}(\\theta+\\sin\\theta\\cos\\theta)+C = \\tfrac{1}{2}\\!\\left(\\arcsin x + x\\sqrt{1-x^{2}}\\right)+C.$$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 9 - Improper integral</div><div class="example-body"><strong>Problem.</strong> Determine whether $\\int_{1}^{\\infty}\\dfrac{dx}{x^{2}}$ converges; if so, find its value.<br><br><strong>Solution.</strong> $\\int_{1}^{R}x^{-2}\\,dx = 1-\\tfrac{1}{R}\\to 1$ as $R\\to\\infty$. Converges to $1$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 10 - Mixed technique</div><div class="example-body"><strong>Problem.</strong> Evaluate $\\int x\\cos(x^{2})\\,dx$.<br><br><strong>Solution.</strong> Substitute $u=x^{2}$, $du=2x\\,dx$: $\\int x\\cos(x^{2})\\,dx = \\tfrac{1}{2}\\!\\int\\cos u\\,du = \\tfrac{1}{2}\\sin(x^{2})+C$.</div></div>

<div class="calc-highlight"><strong>Summary.</strong> The integral is the inverse of the derivative, made concrete as the limit of Riemann sums and made computable by the Fundamental Theorem. Substitution undoes the chain rule, parts undoes the product rule, partial fractions handles rational functions, and trigonometric substitution removes radicals. Improper integrals extend the theory to unbounded intervals and singular integrands. Together, these techniques cover the bulk of integrals that admit a closed form.</div>

<div class="think-box"><div class="think-label">WHAT IS NEXT</div><div class="think-body">Lesson 6 treats <strong>multivariable integration</strong> (double, triple, and line integrals) and the change-of-variables theorem in higher dimensions. Lesson 7 introduces <strong>Lagrange multipliers</strong> and constrained optimisation, where derivatives and integrals work together.</div></div>
`,

tr: `
<p class="l-text"><strong>İntegral</strong>, kalkülüsün ikinci büyük direğidir. Türev bir fonksiyonu parçalara ayırarak anlık değişim hızını ölçerken, integral parçaları geri birleştirerek toplam birikimi ölçer. İntegralin yanıtladığı soru şudur: "Bir niceliğin değişim hızı bilindiğinde, o nicelikten ne kadar birikti?" Geometrik dilde aynı soru: "Eğri altındaki alan ne kadar?"</p>

<p class="l-text">Bu derste integrali saf bir matematik konusu olarak ele alıyoruz. Türev almanın tersi olan problemi tanımlayarak başlıyor, belirli integrali Riemann toplamlarının limiti olarak inşa ediyor, iki fikri birbirine bağlayan Kalkülüsün Temel Teoremi'ni ispatlıyor, ardından klasik integral alma tekniklerini (değişken değiştirme, kısmi integrasyon, kısmi kesirler, trigonometrik dönüşümler) öğreniyoruz. Sonunda has olmayan integraller ve bir dizi klasik alıştırma yer alıyor.</p>

<div class="calc-highlight"><strong>Bu konu neden önemli?</strong> Uzunluk, alan, hacim, iş, kütle, yer değişimi, yük ve olasılığın her formülü özünde bir integraldir. Bir elipsin alanını veren makine, değişken bir kuvvetin yaptığı işi de ince bir levhanın kütle merkezini de verir.</div>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Türevin ters problemini ifade etmek ve ilkel fonksiyon (antiderivative) kavramını tanımlamak</li>
<li>Belirli integrali Riemann toplamlarının limiti olarak inşa etmek</li>
<li>Kalkülüsün Temel Teoremi'nin her iki kısmını da ispatlamak ve uygulamak</li>
<li>Dört klasik tekniği ustalıkla kullanmak: değişken değiştirme, kısmi integrasyon, kısmi kesirler, trigonometrik dönüşüm</li>
<li>Has olmayan integralleri tanımak ve değerlendirmek</li>
<li>Klasik alıştırmaları ve fiziksel/geometrik uygulamaları çözmek</li>
</ul>
</div>

<h2 class="l-title">1. Türev Almanın Ters Problemi</h2>

<p class="l-text">Diferansiyel kalkülüs, her uygun fonksiyon $F$ için türevi $F'$ adı verilen yeni bir fonksiyon üretir. Doğal soru, bunun tersini sormaktır:</p>

<div class="calc-formula"><span class="formula-label">Ters problem</span><div class="formula-main">$$\\text{Verilen } f(x) \\text{ için, } F'(x)=f(x) \\text{ koşulunu sağlayan } F(x) \\text{ bul.}$$</div><div class="formula-sub">$F$'ye $f$'nin <em>ilkeli</em> (antiderivative) denir.</div></div>

<p class="l-text">İlk gözlem: ilkel fonksiyon tek değildir. $F'(x)=f(x)$ ise ve $C$ herhangi bir sabitse, $(F+C)'=F'=f$ olur. Tersine, $G$ bir aralıkta başka bir ilkel ise, $(G-F)'=0$ olduğundan Ortalama Değer Teoremi gereği $G-F$ sabittir. Bunu tek bir cümlede toplarız:</p>

<div class="calc-formula"><span class="formula-label">Teorem (ilkel fonksiyonlar ailesi)</span><div class="formula-main">$$\\int f(x)\\,dx = F(x) + C, \\qquad F'(x)=f(x).$$</div><div class="formula-sub">Bir aralık üzerindeki tüm ilkeller, bir sabit kadar fark eder.</div></div>

<p class="l-text">$\\int f(x)\\,dx$ sembolüne $f$'nin <strong>belirsiz integrali</strong> denir. Leibniz'in ortaya koyduğu uzatılmış S harfi Latince "summa" (toplam) anlamına gelir ve birazdan göreceğimiz alan yorumuna işaret eder. $dx$ diferansiyeli, integrasyon değişkeninin $x$ olduğunu belirtir ve değişken değiştirme kuralında tutarlı şekilde davranır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İlkel fonksiyon</div><div class="card-body">$F'=f$ koşulunu sağlayan $F$. Sürekli $f$ için bir aralıkta daima vardır; bir sabit kadar fark ile.</div></div>
<div class="calc-card"><div class="card-title">Belirsiz integral</div><div class="card-body">$\\{F+C : C\\in\\mathbb{R}\\}$ ailesi, $\\int f\\,dx$ olarak yazılır. Bir fonksiyon artı bir integrasyon sabiti.</div></div>
<div class="calc-card"><div class="card-title">İntegrand</div><div class="card-body">İntegral sembolü içindeki $f$ fonksiyonu. $dx$ diferansiyeli integrasyon değişkenini gösterir.</div></div>
<div class="calc-card"><div class="card-title">$+C$ neden?</div><div class="card-body">Çünkü $\\dfrac{d}{dx}C=0$; türev sabiti göremez, integral bunu tekrar yerine koymalıdır.</div></div>
</div>

<p class="l-text">Türev tablosunu tersten okuyarak kısa bir ilkel tablosu elde ederiz. Her satır, sağ tarafı türevleyerek doğrulanır.</p>

<div class="calc-formula"><span class="formula-label">Temel ilkeller</span><div class="formula-main">$$\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1}+C\\ \\,(n\\neq-1),\\quad \\int \\frac{dx}{x}=\\ln|x|+C,\\quad \\int e^{x}\\,dx=e^{x}+C$$</div><div class="formula-sub">$$\\int \\cos x\\,dx=\\sin x+C,\\quad \\int \\sin x\\,dx=-\\cos x+C,\\quad \\int \\sec^{2}x\\,dx=\\tan x+C.$$</div></div>

<h2 class="l-title">2. İlkel Fonksiyon ve Belirsiz İntegral</h2>

<p class="l-text">Türev doğrusal olduğundan tersi de doğrusaldır: $a,b$ sabitleri ve $f,g$ fonksiyonları için,</p>

<div class="calc-formula"><span class="formula-label">İntegralin doğrusallığı</span><div class="formula-main">$$\\int \\bigl(a\\,f(x)+b\\,g(x)\\bigr)\\,dx = a\\int f(x)\\,dx + b\\int g(x)\\,dx.$$</div></div>

<p class="l-text">İki uyarı: integraller için çarpım veya bölüm kuralı yoktur; genel olarak $\\int fg \\neq (\\int f)(\\int g)$. Bölüm 5-8'deki teknikler bu eksiklikleri telafi edecektir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2.1 — Polinom</div><div class="example-body">$\\displaystyle\\int (3x^{2}-4x+7)\\,dx$ hesaplayın.<br><br>Doğrusallık ve kuvvet kuralı ile: $\\int 3x^{2}\\,dx=x^{3}$, $\\int(-4x)\\,dx=-2x^{2}$, $\\int 7\\,dx=7x$. Toplam: $$\\int(3x^{2}-4x+7)\\,dx = x^{3}-2x^{2}+7x+C.$$ Türevini alarak doğrulayın: $3x^{2}-4x+7$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2.2 — Kökler ve ters kuvvetler</div><div class="example-body">$\\displaystyle\\int\\Bigl(\\sqrt{x}+\\tfrac{1}{x^{2}}\\Bigr)dx$ hesaplayın.<br><br>$\\int(x^{1/2}+x^{-2})\\,dx = \\tfrac{2}{3}x^{3/2}-\\tfrac{1}{x}+C$.</div></div>

<h2 class="l-title">3. Belirli İntegral: Alan Olarak</h2>

<p class="l-text">Şu ana kadar integral yalnızca türevin simgesel tersiydi. Şimdi ona geometrik bir anlam veriyoruz. $f$, $[a,b]$ üzerinde sürekli ve negatif olmasın. Aralığı $n$ eşit alt aralığa bölün, her birinin genişliği $\\Delta x=(b-a)/n$ olsun; her alt aralıktan bir örnek nokta $x_{i}^{*}\\in[x_{i-1},x_{i}]$ seçin ve <strong>Riemann toplamını</strong> oluşturun:</p>

<div class="calc-formula"><span class="formula-label">Riemann toplamı</span><div class="formula-main">$$S_{n}=\\sum_{i=1}^{n} f(x_{i}^{*})\\,\\Delta x.$$</div><div class="formula-sub">Yüksekliği $f(x_{i}^{*})$, genişliği $\\Delta x$ olan ince dikdörtgenlerin alanlarının toplamı.</div></div>

<div class="calc-graph"><div class="graph-title">Riemann toplamı: alanı dikdörtgenlerle yaklaştırma</div>
<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg">
<line x1="60" y1="210" x2="460" y2="210" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
<line x1="60" y1="20" x2="60" y2="210" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
<rect x="80" y="155" width="40" height="55" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="120" y="120" width="40" height="90" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="160" y="85" width="40" height="125" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="200" y="55" width="40" height="155" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="240" y="40" width="40" height="170" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="280" y="55" width="40" height="155" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="320" y="90" width="40" height="120" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<rect x="360" y="140" width="40" height="70" fill="rgba(78,205,196,.15)" stroke="#4ecdc4" stroke-width="1"/>
<path d="M80,160 Q120,125 160,88 Q200,55 260,38 Q320,55 360,95 Q400,145 420,180" fill="none" stroke="#c8a96e" stroke-width="2.5" stroke-linecap="round"/>
<text x="250" y="235" fill="rgba(255,255,255,.5)" font-family="monospace" font-size="10" text-anchor="middle">Δx = (b − a)/n   —   bölüntü inceldikçe yaklaşıklık keskinleşir</text>
<text x="430" y="135" fill="#c8a96e" font-family="monospace" font-size="10">f(x)</text>
</svg>
<div class="graph-caption">Her dikdörtgenin genişliği $\\Delta x$, yüksekliği $f(x_{i}^{*})$'dır. $n\\to\\infty$ iken dikdörtgenler eğriye yaslanır ve toplam alan tam integrale yaklaşır.</div>
</div>

<div class="calc-formula"><span class="formula-label">Belirli integral</span><div class="formula-main">$$\\int_{a}^{b} f(x)\\,dx \\;=\\; \\lim_{n\\to\\infty} \\sum_{i=1}^{n} f(x_{i}^{*})\\,\\Delta x,$$</div><div class="formula-sub">limit varsa ve örnek nokta $x_{i}^{*}$ seçiminden bağımsızsa. Bu durumda $f$, $[a,b]$ üzerinde Riemann integrallenebilirdir.</div></div>

<p class="l-text"><strong>Varlık teoremi.</strong> $f$, $[a,b]$ üzerinde sürekli ise (ya da sonlu sayıda süreksizliği olan sınırlı bir fonksiyon ise) Riemann integrallenebilirdir. İspat, kompakt aralık üzerinde düzgün sürekliliği kullanarak üst ve alt Darboux toplamları arasındaki farkı kontrol eder.</p>

<p class="l-text">Tanımdan, toplam-limit geçişi ile üç özellik hemen çıkar:</p>

<div class="calc-formula"><span class="formula-label">Belirli integralin özellikleri</span><div class="formula-main">$$\\int_{a}^{a} f = 0, \\qquad \\int_{a}^{b} f = -\\int_{b}^{a} f, \\qquad \\int_{a}^{c} f = \\int_{a}^{b} f + \\int_{b}^{c} f.$$</div><div class="formula-sub">Sıfır aralıkta sıfır, sınır ters çevrilince işaret değişir, bölüm noktası $b\\in[a,c]$'de toplam katılımcıdır.</div></div>

<p class="l-text"><strong>İşaretli alan.</strong> $f$ negatif değerler alıyorsa, eksen altındaki dikdörtgenler negatif alana katkıda bulunur. Belirli integral bu nedenle <em>net işaretli alandır</em>: $x$ ekseninin üstündeki alan eksi altındaki alan.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3.1 — Elle Riemann toplamı</div><div class="example-body">$\\int_{0}^{1} x^{2}\\,dx$ için $n=4$ ve sağ uçlarla yaklaşıklık: $\\Delta x=\\tfrac{1}{4}$, örnek noktalar $\\tfrac{1}{4},\\tfrac{2}{4},\\tfrac{3}{4},1$. $$S_{4}=\\tfrac{1}{4}\\!\\left(\\tfrac{1}{16}+\\tfrac{4}{16}+\\tfrac{9}{16}+\\tfrac{16}{16}\\right)=\\tfrac{30}{64}=0{,}46875.$$ Tam değer (Bölüm 4) $\\tfrac{1}{3}\\approx 0{,}333$'tür. Sağ uç seçimi $x^{2}$ artan olduğu için aşmaktadır.</div></div>

<h2 class="l-title">4. Kalkülüsün Temel Teoremi</h2>

<p class="l-text">$n=10^{6}$ dikdörtgenli bir Riemann toplamı insan eliyle hesaplanmaz. Kalkülüsün Temel Teoremi, bunu yapmamız gerekmediğini gösterir: sürekli bir fonksiyonun her belirli integrali, herhangi bir ilkel kullanılarak tek bir çıkarmayla hesaplanır. Teorem iki yarımdan oluşur.</p>

<div class="calc-formula"><span class="formula-label">KTT Kısım I (ilkel teoremi)</span><div class="formula-main">$$f \\text{, }[a,b]\\text{ üzerinde sürekliyse ve } G(x)=\\int_{a}^{x} f(t)\\,dt \\text{ ise, } G'(x)=f(x).$$</div><div class="formula-sub">"$a$'dan itibaren biriken alan" fonksiyonu, $f$'nin bir ilkelidir.</div></div>

<div class="calc-formula"><span class="formula-label">KTT Kısım II (değerlendirme teoremi)</span><div class="formula-main">$$\\int_{a}^{b} f(x)\\,dx \\;=\\; F(b) - F(a) \\quad \\text{(herhangi bir ilkel } F \\text{ için)}.$$</div><div class="formula-sub">Kısaca $F(x)\\Big|_{a}^{b}$ olarak yazılır.</div></div>

<p class="l-text"><strong>Kısım I için sezgi.</strong> $x\\in(a,b)$ ve küçük bir $h>0$ alın. $G(x+h)-G(x)$ farkı, $x$ civarında genişliği $h$ olan ince bir dilimin alanıdır; $f$ sürekli olduğundan, bu dilimin yüksekliği yaklaşık $f(x)$'tir. Yani</p>

<div class="calc-formula"><span class="formula-label">KTT I ispatının özü</span><div class="formula-main">$$\\frac{G(x+h)-G(x)}{h} = \\frac{1}{h}\\int_{x}^{x+h} f(t)\\,dt \\xrightarrow[h\\to 0]{} f(x),$$</div><div class="formula-sub">orta değer biçimi ile: $\\int_{x}^{x+h}f = f(c_{h})\\,h$ olacak şekilde $c_{h}\\in[x,x+h]$ vardır ve $h\\to 0$ iken $f(c_{h})\\to f(x)$.</div></div>

<p class="l-text"><strong>Kısım II'nin Kısım I'den ispatı.</strong> $F$, $f$'nin herhangi bir ilkeli olsun ve $G(x)=\\int_{a}^{x}f$ birikim fonksiyonu olsun. Her ikisi de $F'=G'=f$ koşulunu sağlar; dolayısıyla $F-G$ sabittir. O halde $$F(b)-F(a) = \\bigl(G(b)+C\\bigr) - \\bigl(G(a)+C\\bigr) = G(b)-G(a) = \\int_{a}^{b}f.\\;\\square$$</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4.1 — KTT uygulaması</div><div class="example-body">$\\int_{0}^{1} x^{2}\\,dx$ hesaplayın. Bir ilkel $F(x)=\\tfrac{x^{3}}{3}$, dolayısıyla $$\\int_{0}^{1} x^{2}\\,dx = \\tfrac{1}{3}-0 = \\tfrac{1}{3}.$$ Bu, Örnek 3.1'deki Riemann toplamlarının yaklaştığı tam değerdir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4.2 — Trigonometrik</div><div class="example-body">$\\int_{0}^{\\pi}\\sin x\\,dx$ hesaplayın. İlkel $F(x)=-\\cos x$; $$-\\cos\\pi-(-\\cos 0) = 1+1 = 2.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4.3 — Bir integralin türevi</div><div class="example-body">KTT I ve zincir kuralı ile $G(x)=\\int_{1}^{x^{2}}\\sin(t^{2})\\,dt$'nin türevi: $u=x^{2}$ alın; $G'(x) = \\sin(u^{2})\\cdot u' = \\sin(x^{4})\\cdot 2x.$</div></div>

<div class="calc-graph"><div class="graph-title">KTT: türev ve integral birbirinin tersi</div>
<svg viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ftcAtr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#c8a96e"/></marker>
<marker id="ftcBtr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#4ecdc4"/></marker></defs>
<rect x="30" y="40" width="160" height="50" rx="10" fill="rgba(200,169,110,.12)" stroke="#c8a96e" stroke-width="1.5"/>
<text x="110" y="70" fill="#c8a96e" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">f(x)</text>
<rect x="330" y="40" width="160" height="50" rx="10" fill="rgba(78,205,196,.12)" stroke="#4ecdc4" stroke-width="1.5"/>
<text x="410" y="70" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">F(x)</text>
<line x1="195" y1="55" x2="325" y2="55" stroke="#4ecdc4" stroke-width="2" marker-end="url(#ftcBtr)"/>
<text x="260" y="48" fill="#4ecdc4" font-family="monospace" font-size="10" text-anchor="middle">∫  integralle</text>
<line x1="325" y1="80" x2="195" y2="80" stroke="#c8a96e" stroke-width="2" marker-end="url(#ftcAtr)"/>
<text x="260" y="100" fill="#c8a96e" font-family="monospace" font-size="10" text-anchor="middle">d/dx  türev al</text>
</svg>
<div class="graph-caption">İki işlem, tek bir gidiş-dönüş: $\\frac{d}{dx}\\!\\int f = f$ ve $\\int F' = F+C$.</div>
</div>

<h2 class="l-title">5. Değişken Değiştirme Kuralı</h2>

<p class="l-text">Değişken değiştirme, zincir kuralının integral karşılığıdır. $u=g(x)$ türevlenebilir ve $f$ $g$'nin değer kümesi üzerinde sürekli ise,</p>

<div class="calc-formula"><span class="formula-label">Değişken değiştirme (belirsiz)</span><div class="formula-main">$$\\int f\\bigl(g(x)\\bigr)\\,g'(x)\\,dx \\;=\\; \\int f(u)\\,du, \\qquad u=g(x).$$</div><div class="formula-sub">Doğrulama: sağ tarafın türevini zincir kuralıyla alın ve sol taraftaki integrandı geri elde edin.</div></div>

<p class="l-text">Belirli integralde sınırlar da değişir:</p>

<div class="calc-formula"><span class="formula-label">Değişken değiştirme (belirli)</span><div class="formula-main">$$\\int_{a}^{b} f\\bigl(g(x)\\bigr)\\,g'(x)\\,dx \\;=\\; \\int_{g(a)}^{g(b)} f(u)\\,du.$$</div></div>

<p class="l-text"><strong>$u$ nasıl seçilir.</strong> İntegrandın içinde, türevi (sabit kat farkıyla) ayrıca çarpan olarak görünen bir $f(g(x))$ bileşkesi arayın. Klasik sinyal: "bir şeyin fonksiyonu" $\\times$ "o şeyin türevi".</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 5.1 — $\\int x\\,e^{x^{2}}\\,dx$</div><div class="example-body">$u=x^{2}$, $du=2x\\,dx$, dolayısıyla $x\\,dx=\\tfrac{1}{2}du$. İntegral $$\\int e^{u}\\cdot \\tfrac{1}{2}du = \\tfrac{1}{2}e^{u}+C = \\tfrac{1}{2}e^{x^{2}}+C.$$ Kontrol: $\\frac{d}{dx}\\!\\left(\\tfrac{1}{2}e^{x^{2}}\\right) = x\\,e^{x^{2}}$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 5.2 — $\\int \\tan x\\,dx$</div><div class="example-body">$\\tan x = \\dfrac{\\sin x}{\\cos x}$ olarak yazın; $u=\\cos x$, $du=-\\sin x\\,dx$: $$\\int \\frac{\\sin x}{\\cos x}\\,dx = -\\int \\frac{du}{u} = -\\ln|\\cos x|+C.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 5.3 — Sınır değişimli belirli integral</div><div class="example-body">$\\displaystyle\\int_{0}^{2}\\frac{x}{1+x^{2}}\\,dx$. $u=1+x^{2}$, $du=2x\\,dx$. $x=0\\Rightarrow u=1$, $x=2\\Rightarrow u=5$. $$\\tfrac{1}{2}\\int_{1}^{5}\\frac{du}{u} = \\tfrac{1}{2}\\ln 5.$$</div></div>

<h2 class="l-title">6. Kısmi İntegrasyon</h2>

<p class="l-text">Kısmi integrasyon, <em>çarpım kuralının</em> integral karşılığıdır. $u\\,v$ çarpımının türevini alın:</p>

<div class="calc-formula"><span class="formula-label">Çarpım kuralından türetme</span><div class="formula-main">$$\\frac{d}{dx}(uv) = u'v + uv' \\;\\Longrightarrow\\; uv = \\int u'v\\,dx + \\int uv'\\,dx,$$</div><div class="formula-sub">$$\\boxed{\\int u\\,dv \\;=\\; uv - \\int v\\,du.}$$</div></div>

<p class="l-text">Kısmi integrasyonun başarısı, $\\int u\\,dv$ integralini daha kolay bir $\\int v\\,du$ integraliyle takas etmektir. $u$ ve $dv$ seçimi tüm sanattır. <strong>LIATE</strong> hatırlatıcısı — Logaritmik, İnvers-trigonometrik, Cebirsel (Algebraic), Trigonometrik, Üstel — $u$ adaylarını öncelik sırasına dizer.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 6.1 — $\\int x\\,\\ln x\\,dx$</div><div class="example-body">$u=\\ln x$ (logaritmik; LIATE'de yüksek), $dv=x\\,dx$. $du=\\tfrac{dx}{x}$, $v=\\tfrac{x^{2}}{2}$. $$\\int x\\ln x\\,dx = \\frac{x^{2}}{2}\\ln x - \\int \\frac{x^{2}}{2}\\cdot \\frac{dx}{x} = \\frac{x^{2}}{2}\\ln x - \\frac{x^{2}}{4}+C.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 6.2 — $\\int x\\,e^{x}\\,dx$</div><div class="example-body">$u=x$, $dv=e^{x}\\,dx$ $\\Rightarrow$ $du=dx$, $v=e^{x}$. $$\\int x\\,e^{x}\\,dx = x\\,e^{x} - \\int e^{x}\\,dx = (x-1)e^{x}+C.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 6.3 — $\\int \\ln x\\,dx$ (klasik hile)</div><div class="example-body">Görünür bir çarpım yok; $\\ln x = (\\ln x)\\cdot 1$ yazın. $u=\\ln x$, $dv=dx$, $du=\\tfrac{dx}{x}$, $v=x$. $$\\int \\ln x\\,dx = x\\ln x - \\int x\\cdot \\tfrac{dx}{x} = x\\ln x - x + C.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 6.4 — Çift kısmi integrasyon (özyineleme)</div><div class="example-body">$I=\\int e^{x}\\sin x\\,dx$ için bir kez parts: $I = e^{x}\\sin x - \\int e^{x}\\cos x\\,dx$. Yeni integralde tekrar parts: $\\int e^{x}\\cos x\\,dx = e^{x}\\cos x + I$. Geri koyun: $I = e^{x}\\sin x - e^{x}\\cos x - I$, yani $I=\\tfrac{1}{2}e^{x}(\\sin x-\\cos x)+C$.</div></div>

<h2 class="l-title">7. Kısmi Kesirler</h2>

<p class="l-text">Rasyonel fonksiyonlar $P(x)/Q(x)$ (burada $\\deg P<\\deg Q$) önce daha basit kesirler toplamına ayrıştırılarak integrallenir. Ayrışım, $Q(x)$'in reel sayılar üzerinde çarpanlara ayrılışına bağlıdır.</p>

<div class="calc-formula"><span class="formula-label">Ayrışım kuralları</span><div class="formula-main">$$\\frac{P(x)}{(x-r)^{k}} = \\frac{A_{1}}{x-r}+\\cdots+\\frac{A_{k}}{(x-r)^{k}}, \\quad \\frac{P(x)}{(x^{2}+bx+c)^{k}} = \\sum_{j=1}^{k}\\frac{B_{j}x+C_{j}}{(x^{2}+bx+c)^{j}}.$$</div><div class="formula-sub">Doğrusal çarpan sabitleri, indirgenemez kuadratikler ise doğrusal payları verir.</div></div>

<p class="l-text">Ayrıştıktan sonra her parça ya bir logaritma ($\\int dx/(x-r)$) ya da bir arktanjant ($\\int dx/(x^{2}+a^{2})$) verir; küçük bir değişken değişimi gerekebilir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 7.1 — $\\displaystyle\\int \\frac{dx}{(x-1)(x+2)}$</div><div class="example-body">$\\dfrac{1}{(x-1)(x+2)} = \\dfrac{A}{x-1}+\\dfrac{B}{x+2}$ olsun; $1=A(x+2)+B(x-1)$. $x=1$: $A=\\tfrac{1}{3}$. $x=-2$: $B=-\\tfrac{1}{3}$. $$\\int\\frac{dx}{(x-1)(x+2)} = \\tfrac{1}{3}\\ln\\!\\left|\\frac{x-1}{x+2}\\right|+C.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 7.2 — Tekrarlı doğrusal çarpan</div><div class="example-body">$\\displaystyle\\int \\frac{x}{(x-1)^{2}}\\,dx$. $\\dfrac{x}{(x-1)^{2}} = \\dfrac{A}{x-1}+\\dfrac{B}{(x-1)^{2}}$; $x=A(x-1)+B$, dolayısıyla $A=1, B=1$. $$\\int\\frac{x\\,dx}{(x-1)^{2}} = \\ln|x-1| - \\frac{1}{x-1}+C.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 7.3 — İndirgenemez kuadratik</div><div class="example-body">$\\displaystyle\\int \\frac{dx}{x^{2}+4}$. Reel çarpan yok; klasik arktanjant şablonu: $$\\int\\frac{dx}{x^{2}+a^{2}} = \\frac{1}{a}\\arctan\\!\\frac{x}{a}+C \\;\\Longrightarrow\\; \\tfrac{1}{2}\\arctan\\!\\tfrac{x}{2}+C.$$</div></div>

<h2 class="l-title">8. Trigonometrik Dönüşümler</h2>

<p class="l-text">$\\sqrt{a^{2}-x^{2}}$, $\\sqrt{a^{2}+x^{2}}$, $\\sqrt{x^{2}-a^{2}}$ içeren integraller, $x$'i uygun bir trigonometrik fonksiyonla değiştirerek köklü ifadeden kurtulurlar. $\\sin^{2}+\\cos^{2}=1$ ve $1+\\tan^{2}=\\sec^{2}$ özdeşlikleri işin ağırlığını taşır.</p>

<div class="calc-formula"><span class="formula-label">Standart dönüşümler</span><div class="formula-main">$$\\sqrt{a^{2}-x^{2}}:\\ x=a\\sin\\theta,\\quad \\sqrt{a^{2}+x^{2}}:\\ x=a\\tan\\theta,\\quad \\sqrt{x^{2}-a^{2}}:\\ x=a\\sec\\theta.$$</div><div class="formula-sub">Pisagor özdeşliği kökün içini sadeleştiren trigonometrik fonksiyonu seçin.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 8.1 — Dairenin alanı</div><div class="example-body">$\\int_{-a}^{a}\\sqrt{a^{2}-x^{2}}\\,dx$ ile yarım dairenin alanını bulun. $x=a\\sin\\theta$, $dx=a\\cos\\theta\\,d\\theta$, $\\sqrt{a^{2}-x^{2}}=a\\cos\\theta$. İntegral: $$\\int a^{2}\\cos^{2}\\theta\\,d\\theta = \\tfrac{a^{2}}{2}(\\theta+\\sin\\theta\\cos\\theta)+C.$$ $\\theta=-\\tfrac{\\pi}{2}$ ile $\\tfrac{\\pi}{2}$ arasında: $\\tfrac{a^{2}\\pi}{2}$ — yarıçapı $a$ olan dairenin üst yarısının alanı. Tam alan: $\\pi a^{2}$, analitik olarak elde edildi.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 8.2 — $\\int \\dfrac{dx}{\\sqrt{x^{2}+1}}$</div><div class="example-body">$x=\\tan\\theta$, $dx=\\sec^{2}\\theta\\,d\\theta$, $\\sqrt{x^{2}+1}=\\sec\\theta$. İntegral $\\int \\sec\\theta\\,d\\theta = \\ln|\\sec\\theta+\\tan\\theta|+C = \\ln\\!\\bigl|\\sqrt{x^{2}+1}+x\\bigr|+C.$</div></div>

<h2 class="l-title">9. Has Olmayan İntegraller</h2>

<p class="l-text">Riemann integrali, sınırlı integrandlar için sınırlı aralıklarda tanımlanır. Sınırsız aralıklara veya dikey asimptotu olan fonksiyonlara genişletmek için limit kullanılır.</p>

<div class="calc-formula"><span class="formula-label">Tip I (sınırsız aralık)</span><div class="formula-main">$$\\int_{a}^{\\infty} f(x)\\,dx \\;=\\; \\lim_{R\\to\\infty}\\int_{a}^{R} f(x)\\,dx,$$</div><div class="formula-sub">$\\int_{-\\infty}^{b}$ de benzer; çift sonsuzlu integral uygun bir noktada bölünerek iki ayrı limit halinde ele alınır.</div></div>

<div class="calc-formula"><span class="formula-label">Tip II (integrand patlar)</span><div class="formula-main">$$\\int_{a}^{b} f(x)\\,dx \\;=\\; \\lim_{t\\to b^{-}}\\int_{a}^{t} f(x)\\,dx, \\quad f \\text{ } b \\text{ civarında sınırsızsa}.$$</div></div>

<p class="l-text">Has olmayan integral, ilgili limit sonlu olarak varsa <strong>yakınsar</strong>, aksi halde <strong>ıraksar</strong>.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 9.1 — $[1,\\infty)$ üzerinde yakınsama</div><div class="example-body">$\\int_{1}^{\\infty}\\dfrac{dx}{x^{p}}$. $p\\neq 1$ için $\\int_{1}^{R}x^{-p}\\,dx=\\dfrac{R^{1-p}-1}{1-p}$. $R\\to\\infty$: yakınsar ancak ve ancak $p>1$. $p=1$: $\\int_{1}^{R}dx/x=\\ln R\\to\\infty$. Sonuç: yakınsama $\\Leftrightarrow p>1$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 9.2 — Klasik bir has olmayan integral</div><div class="example-body">$\\int_{0}^{\\infty} e^{-x}\\,dx$. İlkel $-e^{-x}$: $$\\int_{0}^{R} e^{-x}\\,dx = 1-e^{-R}\\xrightarrow[R\\to\\infty]{} 1.$$ Pozitif eksen boyunca $e^{-x}$'in altındaki toplam alan tam olarak $1$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 9.3 — Dikey asimptot</div><div class="example-body">$\\int_{0}^{1}\\dfrac{dx}{\\sqrt{x}}$. $0$'da integrand patlar. $\\int_{t}^{1}x^{-1/2}\\,dx = 2-2\\sqrt{t}\\to 2$, $t\\to 0^{+}$. İntegral $2$'ye yakınsar.</div></div>

<h2 class="l-title">10. Uygulamalar: Fizik ve Geometri</h2>

<p class="l-text">İntegral, tarihsel olarak geometrik ve fiziksel problemlerden doğdu. Bu dersin asıl konusu yukarıdaki teknikler olduğundan, kısa bir örnek demeti veriyoruz:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hızdan yer değişimi</div><div class="card-body">Hızı $v(t)$ olan bir parçacığın $t=a$'dan $t=b$'ye net yer değişimi $\\int_{a}^{b}v(t)\\,dt$'dir. Pozitif alan ileri, negatif geri hareket.</div></div>
<div class="calc-card"><div class="card-title">Değişken kuvvetin işi</div><div class="card-body">$x$ ekseni boyunca $F(x)$ kuvvetinin $a$'dan $b$'ye yaptığı iş: $W=\\int_{a}^{b}F(x)\\,dx$ (yay için $W=\\tfrac{1}{2}kx^{2}$).</div></div>
<div class="calc-card"><div class="card-title">Dönel cisim hacmi</div><div class="card-body">$y=f(x)\\ge 0$'ı $x$ ekseni etrafında $[a,b]$ üzerinde döndürmek: $V=\\pi\\!\\int_{a}^{b}f(x)^{2}\\,dx$ (disk yöntemi).</div></div>
<div class="calc-card"><div class="card-title">Yay uzunluğu</div><div class="card-body">$y=f(x)$ eğrisinin $[a,b]$'deki uzunluğu: $L=\\int_{a}^{b}\\sqrt{1+f'(x)^{2}}\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">Ortalama değer</div><div class="card-body">$f$'nin $[a,b]$ üzerindeki ortalaması: $\\bar f=\\dfrac{1}{b-a}\\int_{a}^{b}f(x)\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">Olasılık (kısa not)</div><div class="card-body">Yoğunluk $f\\ge 0$ ve $\\int_{-\\infty}^{\\infty}\\!f=1$ ise $P(a\\le X\\le b)=\\int_{a}^{b}f$. Belirli integralin doğrudan uygulaması; tam ele alış olasılık derslerine aittir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 10.1 — Kürenin hacmi (döndürme ile)</div><div class="example-body">$y=\\sqrt{R^{2}-x^{2}}$'ı $[-R,R]$'de $x$ ekseni etrafında döndürün: $$V=\\pi\\int_{-R}^{R}(R^{2}-x^{2})\\,dx = \\pi\\!\\left[R^{2}x-\\tfrac{x^{3}}{3}\\right]_{-R}^{R} = \\tfrac{4}{3}\\pi R^{3}.$$ $R$ yarıçaplı kürenin hacmi, yalnız integralle elde edildi.</div></div>

<h2 class="l-title">11. Klasik Alıştırmalar</h2>

<p class="l-text">Aşamalı bir alıştırma demeti. Her birini önce kâğıt üzerinde deneyin, sonra çözüme bakın.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — Kuvvet kuralı</div><div class="example-body"><strong>Problem.</strong> $\\int x^{2}\\,dx$ hesaplayın.<br><br><strong>Çözüm.</strong> Kuvvet kuralı $n=2$ ile: $\\int x^{2}\\,dx = \\dfrac{x^{3}}{3}+C$. Doğrula: $\\frac{d}{dx}(x^{3}/3)=x^{2}$. ✓</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — Trigonometrik ilkel</div><div class="example-body"><strong>Problem.</strong> $\\int \\sin x\\,dx$.<br><br><strong>Çözüm.</strong> $\\frac{d}{dx}(-\\cos x)=\\sin x$ olduğundan $\\int \\sin x\\,dx = -\\cos x+C$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — Üstel ilkel</div><div class="example-body"><strong>Problem.</strong> $\\int e^{x}\\,dx$.<br><br><strong>Çözüm.</strong> Üstel kendi türevidir, dolayısıyla bir sabite kadar kendi ilkelidir: $\\int e^{x}\\,dx = e^{x}+C$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — Değişken değiştirme</div><div class="example-body"><strong>Problem.</strong> $\\int x\\,e^{x^{2}}\\,dx$.<br><br><strong>Çözüm.</strong> $u=x^{2}$, $du=2x\\,dx$, $x\\,dx=\\tfrac{1}{2}du$. $\\int x\\,e^{x^{2}}\\,dx = \\tfrac{1}{2}\\int e^{u}\\,du = \\tfrac{1}{2}e^{x^{2}}+C$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — Kısmi integrasyon</div><div class="example-body"><strong>Problem.</strong> $\\int x\\ln x\\,dx$.<br><br><strong>Çözüm.</strong> $u=\\ln x$, $dv=x\\,dx$ $\\Rightarrow$ $du=dx/x$, $v=x^{2}/2$. $\\int x\\ln x\\,dx = \\dfrac{x^{2}}{2}\\ln x - \\dfrac{x^{2}}{4}+C$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — Kısmi kesirler</div><div class="example-body"><strong>Problem.</strong> $\\displaystyle\\int\\frac{dx}{(x-1)(x+2)}$.<br><br><strong>Çözüm.</strong> $\\dfrac{1}{(x-1)(x+2)} = \\dfrac{1}{3}\\!\\left(\\dfrac{1}{x-1}-\\dfrac{1}{x+2}\\right)$. Sonuç: $\\dfrac{1}{3}\\ln\\!\\left|\\dfrac{x-1}{x+2}\\right|+C$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — KTT ile belirli integral</div><div class="example-body"><strong>Problem.</strong> $\\int_{0}^{2}(3x^{2}+2x)\\,dx$.<br><br><strong>Çözüm.</strong> $F(x)=x^{3}+x^{2}$. $F(2)-F(0) = 12-0 = 12$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 — Trigonometrik dönüşüm</div><div class="example-body"><strong>Problem.</strong> $\\int \\sqrt{1-x^{2}}\\,dx$.<br><br><strong>Çözüm.</strong> $x=\\sin\\theta$, $\\int\\cos^{2}\\theta\\,d\\theta = \\tfrac{1}{2}(\\theta+\\sin\\theta\\cos\\theta)+C = \\tfrac{1}{2}\\!\\left(\\arcsin x + x\\sqrt{1-x^{2}}\\right)+C$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 9 — Has olmayan integral</div><div class="example-body"><strong>Problem.</strong> $\\int_{1}^{\\infty}\\dfrac{dx}{x^{2}}$ yakınsar mı? Yakınsıyorsa değerini bulun.<br><br><strong>Çözüm.</strong> $\\int_{1}^{R}x^{-2}\\,dx = 1-\\tfrac{1}{R}\\to 1$, $R\\to\\infty$. Yakınsar, değeri $1$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 10 — Karma teknik</div><div class="example-body"><strong>Problem.</strong> $\\int x\\cos(x^{2})\\,dx$.<br><br><strong>Çözüm.</strong> $u=x^{2}$, $du=2x\\,dx$: $\\int x\\cos(x^{2})\\,dx = \\tfrac{1}{2}\\int\\cos u\\,du = \\tfrac{1}{2}\\sin(x^{2})+C$.</div></div>

<div class="calc-highlight"><strong>Özet.</strong> İntegral, türevin tersidir; Riemann toplamlarının limiti olarak somutlaşır ve Kalkülüsün Temel Teoremi sayesinde hesaplanabilir hale gelir. Değişken değiştirme zincir kuralını, kısmi integrasyon çarpım kuralını tersine çevirir; kısmi kesirler rasyonel fonksiyonları, trigonometrik dönüşümler köklü ifadeleri ele alır. Has olmayan integraller teoriyi sınırsız aralıklara ve tekil integrandlara taşır. Bu teknikler birlikte kapalı formda yazılabilen integrallerin büyük kısmını kapsar.</div>

<div class="think-box"><div class="think-label">SIRADAKİ DERS</div><div class="think-body">Ders 6 <strong>çok değişkenli integrasyonu</strong> (iki katlı, üç katlı ve eğri integralleri) ve yüksek boyutta değişken değiştirme teoremini ele alır. Ders 7 ise türevin ve integralin birlikte çalıştığı <strong>Lagrange çarpanları</strong> ve kısıtlı optimizasyona giriş yapar.</div></div>
`

};
