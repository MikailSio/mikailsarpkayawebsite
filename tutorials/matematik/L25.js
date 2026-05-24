window.LISE_MAT_L25 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Curve sketching is the moment in calculus where every tool you have learned comes together at once.</strong> Limits told you what happens far away; derivatives told you where the curve climbs, descends, and bends; asymptotes drew the long-range skeleton; the second derivative test pinned down the extrema. By itself each tool is just a fact. Stitched together in the right order, they are a complete recipe that turns any formula $y = f(x)$ into a faithful pencil-drawn graph, without ever plotting a hundred points by brute force.</p>

<p class="l-text">This lesson teaches the classical <strong>six-step procedure</strong> used in every Turkish high-school calculus book and on every YKS-AYT exam. Follow the steps in order, never skip one, and the curve essentially draws itself. We will work three full examples from start to finish — a rational function, an exponential, and a cubic — and then leave five problems for practice. By the end you will be able to look at a strange-looking formula and produce its qualitative graph in three or four minutes by hand.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Memorise and apply the six-step recipe: domain, intercepts, symmetry, asymptotes, extrema, concavity</li>
<li>Find a function's domain by eliminating zero denominators, negative square roots, and non-positive logarithm arguments</li>
<li>Locate $x$- and $y$-intercepts and use them as anchor points on the graph</li>
<li>Detect even, odd, and periodic symmetry to halve the sketching work</li>
<li>Identify horizontal, vertical, and oblique asymptotes from limits</li>
<li>Combine $f'$ and $f''$ information into a single sketch with extrema and inflection points clearly marked</li>
</ul>
</div>

<h2 class="l-title">1. The Six-Step Recipe</h2>

<div class="calc-highlight"><strong>Every full curve-sketching problem is solved in exactly six steps, in this order.</strong> Each step uses one of the tools you already mastered in earlier lessons. The order matters: domain comes first because no other step makes sense outside it, and concavity comes last because it is the finishing detail that turns a rough sketch into an accurate one.</div>

<div class="calc-formula"><div class="formula-label">THE SIX STEPS</div><div class="formula-main">$$\\textbf{1. Domain:} \\text{ where is } f(x) \\text{ defined?}$$<br>$$\\textbf{2. Intercepts:} \\text{ solve } f(x)=0 \\text{ and compute } f(0).$$<br>$$\\textbf{3. Symmetry:} \\text{ is } f \\text{ even, odd, or periodic?}$$<br>$$\\textbf{4. Asymptotes:} \\text{ horizontal, vertical, oblique.}$$<br>$$\\textbf{5. Extrema:} \\text{ sign chart of } f' \\Rightarrow \\text{ monotonicity, local max/min.}$$<br>$$\\textbf{6. Concavity:} \\text{ sign chart of } f'' \\Rightarrow \\text{ bending, inflection points.}$$</div><div class="formula-sub">Combine the results into one picture: plot intercepts, asymptotes, extrema, and inflections, then connect them honouring the increasing/decreasing and concave-up/concave-down information.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why six steps?</div><div class="card-body">Each step contributes a different geometric feature: the canvas (domain), anchor points (intercepts), shortcuts (symmetry), long-range skeleton (asymptotes), where the curve turns (extrema), and how it bends (concavity).</div></div>
<div class="calc-card"><div class="card-title">Order matters</div><div class="card-body">Always start with the domain. Without it you might compute an "asymptote" inside a region where the function does not even exist, or look for a maximum in a forbidden interval.</div></div>
<div class="calc-card"><div class="card-title">Don't skip the symmetry step</div><div class="card-body">Recognising even or odd symmetry literally halves your work: sketch one side, then reflect.</div></div>
</div>

<h2 class="l-title">2. Step 1 — Finding the Domain</h2>

<div class="calc-highlight"><strong>The domain of $f$ is the set of all real numbers $x$ for which $f(x)$ produces a finite real value.</strong> Three classical forbidden situations exclude points from the domain: a zero in a denominator, a negative number under an even-index root, and a non-positive argument inside a logarithm.</div>

<div class="calc-formula"><div class="formula-label">THE THREE DOMAIN RESTRICTIONS</div><div class="formula-main">$$\\text{Denominator: } \\frac{g(x)}{h(x)} \\text{ requires } h(x) \\neq 0$$<br>$$\\text{Even root: } \\sqrt[2k]{g(x)} \\text{ requires } g(x) \\geq 0$$<br>$$\\text{Logarithm: } \\ln g(x) \\text{ requires } g(x) > 0$$</div><div class="formula-sub">For any formula, identify which of these structures appear and intersect all the constraints — the result is the domain.</div></div>

<div class="calc-example"><div class="example-label">QUICK CHECK — DOMAIN OF $\\dfrac{\\sqrt{x-1}}{x-3}$</div><div class="example-body">Two restrictions: the square root needs $x - 1 \\geq 0 \\Rightarrow x \\geq 1$; the denominator needs $x - 3 \\neq 0 \\Rightarrow x \\neq 3$.<br><br>Intersect: $x \\in [1, 3) \\cup (3, \\infty)$. That is the domain.</div></div>

<div class="calc-example"><div class="example-label">QUICK CHECK — DOMAIN OF $\\ln(4 - x^2)$</div><div class="example-body">The logarithm argument must be strictly positive: $4 - x^2 > 0 \\Rightarrow x^2 < 4 \\Rightarrow -2 < x < 2$.<br><br>Domain: $(-2, 2)$. The endpoints $\\pm 2$ are excluded because $\\ln 0$ is undefined.</div></div>

<div class="l-note"><strong>Tip.</strong> Polynomials have domain $\\mathbb{R}$ — no restrictions. Trig functions $\\sin x$, $\\cos x$ also have domain $\\mathbb{R}$, but $\\tan x$ excludes $x = \\pi/2 + k\\pi$ because of its cosine denominator.</div>

<h2 class="l-title">3. Step 2 — Intercepts</h2>

<div class="calc-highlight"><strong>Intercepts are the points where the curve crosses the coordinate axes.</strong> The $y$-intercept is the single value $f(0)$ (if $0$ is in the domain); the $x$-intercepts are the solutions of $f(x) = 0$. They are the cheapest anchor points to plot, so they should always go on the sketch first.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$y$-intercept</div><div class="card-body">Plug $x = 0$ into the formula. There is at most one such point. If $0$ is not in the domain, the curve has no $y$-intercept.</div></div>
<div class="calc-card"><div class="card-title">$x$-intercepts</div><div class="card-body">Solve $f(x) = 0$. There may be zero, one, finitely many, or infinitely many. These are the function's <em>zeros</em> or <em>roots</em>.</div></div>
<div class="calc-card"><div class="card-title">Sign between roots</div><div class="card-body">Between two consecutive $x$-intercepts the function keeps one sign. Pick any test value to decide whether it is above or below the axis.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK CHECK — INTERCEPTS OF $f(x) = x^3 - 4x$</div><div class="example-body">$y$-intercept: $f(0) = 0$. The curve passes through the origin.<br><br>$x$-intercepts: $x^3 - 4x = x(x^2 - 4) = x(x-2)(x+2) = 0 \\Rightarrow x \\in \\{-2, 0, 2\\}$.<br><br>Three $x$-intercepts. Sign of $f$ between them: $f(-3) = -27 + 12 = -15 < 0$, $f(-1) = -1 + 4 = 3 > 0$, $f(1) = 1 - 4 = -3 < 0$, $f(3) = 27 - 12 = 15 > 0$. The curve alternates sign — typical for an odd cubic with three real roots.</div></div>

<h2 class="l-title">4. Step 3 — Symmetry</h2>

<div class="calc-highlight"><strong>If a function has symmetry, you only have to sketch half of it.</strong> The two most common kinds are <em>even</em> symmetry (mirror across the $y$-axis) and <em>odd</em> symmetry (point symmetry about the origin). Periodic functions like $\\sin x$ repeat after every period $T$, so a single period is enough.</div>

<div class="calc-formula"><div class="formula-label">SYMMETRY TESTS</div><div class="formula-main">$$f \\text{ is } \\textbf{even} \\iff f(-x) = f(x) \\text{ for every } x \\text{ in the domain}$$<br>$$f \\text{ is } \\textbf{odd} \\iff f(-x) = -f(x) \\text{ for every } x \\text{ in the domain}$$<br>$$f \\text{ is } \\textbf{periodic} \\text{ with period } T \\iff f(x + T) = f(x) \\text{ for every } x$$</div><div class="formula-sub">Plug $-x$ into the formula and simplify. If you get the same expression back, the function is even; if you get its negative, it is odd; otherwise it has no axis or origin symmetry.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">Even functions</div><div class="compare-item">Graph is symmetric across the $y$-axis</div><div class="compare-item">Examples: $x^2$, $x^4$, $\\cos x$, $|x|$</div><div class="compare-item">Only even powers appear (in a polynomial)</div><div class="compare-item">Sketch for $x \\geq 0$, then mirror</div></div><div class="compare-col"><div class="compare-title">Odd functions</div><div class="compare-item">Graph is symmetric about the origin</div><div class="compare-item">Examples: $x$, $x^3$, $\\sin x$, $\\tan x$</div><div class="compare-item">Only odd powers appear (in a polynomial)</div><div class="compare-item">Sketch for $x \\geq 0$, then rotate $180°$</div></div></div>

<div class="calc-example"><div class="example-label">QUICK CHECK — IS $f(x) = \\dfrac{x^2 - 1}{x^2 + 1}$ EVEN, ODD, OR NEITHER?</div><div class="example-body">$f(-x) = \\dfrac{(-x)^2 - 1}{(-x)^2 + 1} = \\dfrac{x^2 - 1}{x^2 + 1} = f(x)$.<br><br>The function is <strong>even</strong>. Its graph mirrors across the $y$-axis — we only need to study $x \\geq 0$ and reflect.</div></div>

<h2 class="l-title">5. Step 4 — Asymptotes (Recap from L14)</h2>

<div class="calc-highlight"><strong>Asymptotes are the long-range skeleton of the graph.</strong> They tell you where the curve goes when $x$ marches to infinity or approaches a "forbidden" point. Three flavours appear: horizontal (limit as $x \\to \\pm\\infty$), vertical (limit blows up at a finite $x$), and oblique (slanted line approached at infinity).</div>

<div class="calc-formula"><div class="formula-label">ASYMPTOTE TESTS</div><div class="formula-main">$$\\textbf{Horizontal: } y = L \\text{ if } \\lim_{x \\to \\pm\\infty} f(x) = L$$<br>$$\\textbf{Vertical: } x = a \\text{ if } \\lim_{x \\to a} |f(x)| = \\infty$$<br>$$\\textbf{Oblique: } y = mx + n \\text{ if } f(x) - (mx+n) \\to 0 \\text{ as } x \\to \\pm\\infty$$</div><div class="formula-sub">A rational function $p(x)/q(x)$ has an oblique asymptote exactly when $\\deg p = \\deg q + 1$; use polynomial long division to find $m$ and $n$.</div></div>

<div class="calc-example"><div class="example-label">QUICK RECALL — ASYMPTOTES OF $f(x) = \\dfrac{x^2}{x-1}$</div><div class="example-body"><strong>Vertical:</strong> denominator zero at $x = 1$; numerator nonzero there → vertical asymptote $x = 1$.<br><br><strong>Horizontal:</strong> $\\deg(\\text{num}) = 2 > 1 = \\deg(\\text{den})$ → none.<br><br><strong>Oblique:</strong> degrees differ by exactly one → divide. $x^2 = (x-1)(x+1) + 1$, so $f(x) = x + 1 + \\dfrac{1}{x-1}$. As $|x| \\to \\infty$ the remainder vanishes → oblique asymptote $y = x + 1$.</div></div>

<h2 class="l-title">6. Step 5 — Extrema and Monotonicity (Recap from L23)</h2>

<div class="calc-highlight"><strong>The sign of $f'$ controls where the function rises and where it falls.</strong> Critical numbers $f'(c) = 0$ (or $f'$ undefined) are the only candidates for local extrema. Build a sign chart for $f'$ and read off the intervals of increase, decrease, and the location of each local max and min.</div>

<div class="calc-formula"><div class="formula-label">FIRST DERIVATIVE TEST</div><div class="formula-main">$$f'(x) > 0 \\text{ on } (a, b) \\Rightarrow f \\text{ is increasing on } (a, b)$$<br>$$f'(x) < 0 \\text{ on } (a, b) \\Rightarrow f \\text{ is decreasing on } (a, b)$$<br>$$f' \\text{ changes } + \\to - \\text{ at } c \\Rightarrow \\text{ local max at } c$$<br>$$f' \\text{ changes } - \\to + \\text{ at } c \\Rightarrow \\text{ local min at } c$$</div><div class="formula-sub">No sign change means $c$ is neither — the curve has a horizontal tangent but keeps moving the same way.</div></div>

<div class="think-box"><div class="think-label">REMEMBER</div><div class="think-body">When you place a local max or min on your sketch, also compute its $y$-coordinate $f(c)$. The pair $(c, f(c))$ is what you actually plot — not just the $x$-value.</div></div>

<h2 class="l-title">7. Step 6 — Concavity and Inflection Points (Recap from L24)</h2>

<div class="calc-highlight"><strong>The sign of $f''$ controls the bending direction.</strong> Positive $f''$ means concave-up (bowl shape); negative $f''$ means concave-down (hill shape); a sign change of $f''$ produces an inflection point. Concavity is the finishing touch — it decides whether the curve between two extrema bulges upward or downward.</div>

<div class="calc-formula"><div class="formula-label">CONCAVITY TEST</div><div class="formula-main">$$f''(x) > 0 \\text{ on } (a, b) \\Rightarrow f \\text{ is concave-up on } (a, b)$$<br>$$f''(x) < 0 \\text{ on } (a, b) \\Rightarrow f \\text{ is concave-down on } (a, b)$$<br>$$f'' \\text{ changes sign at } c \\Rightarrow \\text{ inflection point at } (c, f(c))$$</div><div class="formula-sub">A candidate for inflection is any $c$ where $f''(c) = 0$ or $f''$ is undefined — confirm by checking the sign on each side.</div></div>

<h2 class="l-title">8. Worked Example 1: $f(x) = \\dfrac{x^2 - 1}{x^2 + 1}$</h2>

<p class="l-text">We now execute the full six-step procedure on a classical rational function. Take your time — this is the template for every sketching problem you will ever meet.</p>

<p class="l-text"><strong>Step 1 — Domain.</strong> The denominator $x^2 + 1 \\geq 1 > 0$ for every real $x$, so it never vanishes. Domain: $\\mathbb{R}$.</p>

<p class="l-text"><strong>Step 2 — Intercepts.</strong> $y$-intercept: $f(0) = \\dfrac{0 - 1}{0 + 1} = -1$, point $(0, -1)$. $x$-intercepts: $f(x) = 0 \\iff x^2 - 1 = 0 \\iff x = \\pm 1$, points $(\\pm 1, 0)$.</p>

<p class="l-text"><strong>Step 3 — Symmetry.</strong> $f(-x) = \\dfrac{(-x)^2 - 1}{(-x)^2 + 1} = \\dfrac{x^2 - 1}{x^2 + 1} = f(x)$ → $f$ is <strong>even</strong>. The graph is symmetric about the $y$-axis.</p>

<p class="l-text"><strong>Step 4 — Asymptotes.</strong> No vertical asymptote (denominator never zero). Horizontal: $\\lim_{x \\to \\pm\\infty} \\dfrac{x^2 - 1}{x^2 + 1} = 1$ (equal degrees, ratio of leading coefficients) → horizontal asymptote $y = 1$. No oblique asymptote (degrees equal).</p>

<p class="l-text"><strong>Step 5 — Extrema.</strong> Rewrite $f(x) = 1 - \\dfrac{2}{x^2 + 1}$. Then $f'(x) = -2 \\cdot \\dfrac{-2x}{(x^2+1)^2} = \\dfrac{4x}{(x^2+1)^2}$. The denominator is always positive, so $f'(x) = 0 \\iff x = 0$. Sign of $f'$: negative for $x < 0$, positive for $x > 0$. So $f$ is decreasing on $(-\\infty, 0)$ and increasing on $(0, \\infty)$ → <strong>local (and global) minimum</strong> at $(0, -1)$.</p>

<p class="l-text"><strong>Step 6 — Concavity.</strong> Differentiate $f'(x) = \\dfrac{4x}{(x^2+1)^2}$ using the quotient rule: $f''(x) = \\dfrac{4(x^2+1)^2 - 4x \\cdot 2(x^2+1) \\cdot 2x}{(x^2+1)^4} = \\dfrac{4(x^2+1) - 16x^2}{(x^2+1)^3} = \\dfrac{4 - 12x^2}{(x^2+1)^3} = \\dfrac{-4(3x^2 - 1)}{(x^2+1)^3}$.</p>

<p class="l-text">Denominator positive, so sign of $f''$ equals sign of $-(3x^2 - 1) = 1 - 3x^2$. This is positive when $x^2 < 1/3 \\iff |x| < 1/\\sqrt{3}$, negative when $|x| > 1/\\sqrt{3}$. So $f$ is concave-up on $(-1/\\sqrt{3}, 1/\\sqrt{3})$ and concave-down outside. <strong>Inflection points</strong> at $x = \\pm 1/\\sqrt{3}$, with $f(\\pm 1/\\sqrt{3}) = \\dfrac{1/3 - 1}{1/3 + 1} = \\dfrac{-2/3}{4/3} = -\\dfrac{1}{2}$. Points: $(\\pm 1/\\sqrt{3}, -1/2)$.</p>

<div class="calc-example"><div class="example-label">SUMMARY TABLE</div><div class="example-body"><strong>Domain:</strong> $\\mathbb{R}$.<br><strong>Intercepts:</strong> $(0, -1)$, $(\\pm 1, 0)$.<br><strong>Symmetry:</strong> even (mirror across $y$-axis).<br><strong>Asymptote:</strong> horizontal $y = 1$.<br><strong>Local min:</strong> $(0, -1)$.<br><strong>Inflection:</strong> $(\\pm 1/\\sqrt{3}, -1/2)$.<br><strong>Increasing:</strong> $(0, \\infty)$. <strong>Decreasing:</strong> $(-\\infty, 0)$.<br><strong>Concave-up:</strong> $(-1/\\sqrt{3}, 1/\\sqrt{3})$. <strong>Concave-down:</strong> elsewhere.</div></div>

<div class="calc-graph"><div id="plot-l25-ex1-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = (x^2-1)/(x^2+1)$ with all critical features marked. The horizontal asymptote $y = 1$ is the dashed gold line; the curve approaches it but never reaches it. The local minimum sits at $(0, -1)$, and the two inflection points (gold diamonds) are at $x = \\pm 1/\\sqrt{3} \\approx \\pm 0.577$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-50;i<=50;i++){var x=i/10;xs.push(x);ys.push((x*x-1)/(x*x+1));}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = (x²-1)/(x²+1)',line:{color:'#3b82f6',width:3}};
var asy={x:[-5,5],y:[1,1],mode:'lines',name:'asymptote y = 1',line:{color:'#c8a96e',width:2,dash:'dash'}};
var inter={x:[-1,1,0],y:[0,0,-1],mode:'markers+text',name:'intercepts',marker:{color:'#ef4444',size:11},text:['  (-1,0)','  (1,0)','  (0,-1) min'],textposition:'top right',textfont:{color:'#ef4444',size:11}};
var s=1/Math.sqrt(3);
var infl={x:[-s,s],y:[-0.5,-0.5],mode:'markers+text',name:'inflection',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  infl','  infl'],textposition:'bottom right',textfont:{color:'#fbbf24',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1.3,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-ex1-en',[curve,asy,inter,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">9. Worked Example 2: $f(x) = x \\, e^{-x}$</h2>

<p class="l-text">An exponential factor adds new behaviour — rapid growth on one side, rapid decay on the other.</p>

<p class="l-text"><strong>Step 1 — Domain.</strong> Both $x$ and $e^{-x}$ are defined for every real $x$. Domain: $\\mathbb{R}$.</p>

<p class="l-text"><strong>Step 2 — Intercepts.</strong> $f(0) = 0 \\cdot 1 = 0$, point $(0, 0)$. $f(x) = 0 \\iff x \\cdot e^{-x} = 0$, and since $e^{-x} > 0$ never vanishes, the only solution is $x = 0$. Single intercept at the origin.</p>

<p class="l-text"><strong>Step 3 — Symmetry.</strong> $f(-x) = -x \\cdot e^{x}$ — neither $f(x)$ nor $-f(x)$. <strong>No symmetry.</strong></p>

<p class="l-text"><strong>Step 4 — Asymptotes.</strong> $\\lim_{x \\to \\infty} x e^{-x} = \\lim_{x \\to \\infty} \\dfrac{x}{e^x} = 0$ (exponential beats polynomial) → horizontal asymptote $y = 0$ on the right. As $x \\to -\\infty$: $e^{-x} = e^{|x|} \\to \\infty$, and $x \\to -\\infty$, so $f(x) \\to -\\infty$. No horizontal asymptote on the left, no vertical asymptote (function defined everywhere), no oblique asymptote.</p>

<p class="l-text"><strong>Step 5 — Extrema.</strong> $f'(x) = e^{-x} + x(-e^{-x}) = e^{-x}(1 - x)$. Since $e^{-x} > 0$, $f'(x) = 0 \\iff 1 - x = 0 \\iff x = 1$. Sign of $f'$: $1 - x > 0$ for $x < 1$ (positive), $1 - x < 0$ for $x > 1$ (negative). So $f$ is increasing on $(-\\infty, 1)$ and decreasing on $(1, \\infty)$ → <strong>local (and global) maximum</strong> at $x = 1$. Value: $f(1) = 1 \\cdot e^{-1} = 1/e \\approx 0.368$.</p>

<p class="l-text"><strong>Step 6 — Concavity.</strong> $f''(x) = -e^{-x}(1-x) + e^{-x}(-1) = e^{-x}(-(1-x) - 1) = e^{-x}(x - 2)$. Sign of $f''$ matches sign of $x - 2$ (since $e^{-x} > 0$): negative for $x < 2$, positive for $x > 2$. So $f$ is concave-down on $(-\\infty, 2)$ and concave-up on $(2, \\infty)$ → <strong>inflection point</strong> at $x = 2$, $f(2) = 2 e^{-2} \\approx 0.271$. Point: $(2, 2/e^2)$.</p>

<div class="calc-example"><div class="example-label">SUMMARY TABLE</div><div class="example-body"><strong>Domain:</strong> $\\mathbb{R}$.<br><strong>Intercept:</strong> $(0, 0)$ only.<br><strong>Symmetry:</strong> none.<br><strong>Asymptote:</strong> horizontal $y = 0$ as $x \\to \\infty$ only.<br><strong>Local max:</strong> $(1, 1/e)$.<br><strong>Inflection:</strong> $(2, 2/e^2)$.<br><strong>Increasing:</strong> $(-\\infty, 1)$. <strong>Decreasing:</strong> $(1, \\infty)$.<br><strong>Concave-down:</strong> $(-\\infty, 2)$. <strong>Concave-up:</strong> $(2, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l25-ex2-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = x e^{-x}$. The curve climbs from $-\\infty$, crosses the origin, peaks at $(1, 1/e)$ (red dot), bends through the inflection point $(2, 2/e^2)$ (gold diamond), and then settles asymptotically to $y = 0$ (dashed gold) on the right.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-15;i<=60;i++){var x=i/10;xs.push(x);ys.push(x*Math.exp(-x));}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = x e^(-x)',line:{color:'#3b82f6',width:3}};
var asy={x:[-1.5,6],y:[0,0],mode:'lines',name:'asymptote y = 0',line:{color:'#c8a96e',width:2,dash:'dash'},showlegend:false};
var mx={x:[1],y:[1/Math.E],mode:'markers+text',name:'max (1, 1/e)',marker:{color:'#ef4444',size:12},text:['  max (1, 1/e)'],textposition:'top right',textfont:{color:'#ef4444',size:11}};
var infl={x:[2],y:[2/Math.exp(2)],mode:'markers+text',name:'inflection (2, 2/e²)',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  infl'],textposition:'top right',textfont:{color:'#fbbf24',size:11}};
var orig={x:[0],y:[0],mode:'markers',marker:{color:'#22d3ee',size:9},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-1.5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1.5,0.55],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-ex2-en',[curve,asy,mx,infl,orig],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">10. Worked Example 3: $f(x) = x^3 - 3x^2 + 4$</h2>

<p class="l-text">A polynomial — the simplest setting, with no asymptote issues. The whole work is in steps 5 and 6.</p>

<p class="l-text"><strong>Step 1 — Domain.</strong> Polynomial, so domain is $\\mathbb{R}$.</p>

<p class="l-text"><strong>Step 2 — Intercepts.</strong> $y$-intercept: $f(0) = 4$. For $x$-intercepts, try integer roots of $x^3 - 3x^2 + 4 = 0$: $f(-1) = -1 - 3 + 4 = 0$, so $x = -1$ is a root. Factor: $x^3 - 3x^2 + 4 = (x+1)(x^2 - 4x + 4) = (x+1)(x-2)^2$. So zeros are $x = -1$ (simple) and $x = 2$ (double). At $x = 2$ the curve <em>touches</em> the axis but does not cross — typical for a double root.</p>

<p class="l-text"><strong>Step 3 — Symmetry.</strong> $f(-x) = -x^3 - 3x^2 + 4$ — neither $f(x)$ nor $-f(x)$. <strong>No symmetry.</strong></p>

<p class="l-text"><strong>Step 4 — Asymptotes.</strong> Polynomials never have asymptotes. End behaviour: leading term $x^3$, so $f(x) \\to +\\infty$ as $x \\to +\\infty$ and $f(x) \\to -\\infty$ as $x \\to -\\infty$.</p>

<p class="l-text"><strong>Step 5 — Extrema.</strong> $f'(x) = 3x^2 - 6x = 3x(x - 2)$. Critical numbers: $x = 0$ and $x = 2$. Sign chart for $f'$: positive on $(-\\infty, 0)$, negative on $(0, 2)$, positive on $(2, \\infty)$. So $f$ increases, then decreases, then increases again. Local <strong>max</strong> at $(0, 4)$, local <strong>min</strong> at $(2, 0)$.</p>

<p class="l-text"><strong>Step 6 — Concavity.</strong> $f''(x) = 6x - 6 = 6(x - 1)$. Sign of $f''$: negative for $x < 1$, positive for $x > 1$. So $f$ is concave-down on $(-\\infty, 1)$ and concave-up on $(1, \\infty)$ → <strong>inflection point</strong> at $x = 1$, $f(1) = 1 - 3 + 4 = 2$. Point: $(1, 2)$.</p>

<div class="calc-example"><div class="example-label">SUMMARY TABLE</div><div class="example-body"><strong>Domain:</strong> $\\mathbb{R}$.<br><strong>Intercepts:</strong> $(0, 4)$, $(-1, 0)$, $(2, 0)$ (tangent — double root).<br><strong>Symmetry:</strong> none.<br><strong>Asymptotes:</strong> none. End behaviour $-\\infty \\to +\\infty$.<br><strong>Local max:</strong> $(0, 4)$. <strong>Local min:</strong> $(2, 0)$.<br><strong>Inflection:</strong> $(1, 2)$.<br><strong>Increasing:</strong> $(-\\infty, 0) \\cup (2, \\infty)$. <strong>Decreasing:</strong> $(0, 2)$.<br><strong>Concave-down:</strong> $(-\\infty, 1)$. <strong>Concave-up:</strong> $(1, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l25-ex3-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = x^3 - 3x^2 + 4$. The curve rises into a local max at $(0, 4)$, dips to a local min at $(2, 0)$ where it touches the $x$-axis tangentially (double root), then rises again. The inflection point $(1, 2)$ is the midpoint of the two extrema — a property shared by every cubic.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-20;i<=40;i++){var x=i/10;xs.push(x);ys.push(x*x*x-3*x*x+4);}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = x³-3x²+4',line:{color:'#3b82f6',width:3}};
var inter={x:[-1,2,0],y:[0,0,4],mode:'markers+text',name:'intercepts',marker:{color:'#22d3ee',size:10},text:['  (-1,0)','  (2,0)','  (0,4)'],textposition:'top right',textfont:{color:'#22d3ee',size:11},showlegend:false};
var ex={x:[0,2],y:[4,0],mode:'markers+text',name:'extrema',marker:{color:'#ef4444',size:13},text:['  max','  min'],textposition:'bottom right',textfont:{color:'#ef4444',size:12}};
var infl={x:[1],y:[2],mode:'markers+text',name:'inflection (1, 2)',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  infl'],textposition:'top right',textfont:{color:'#fbbf24',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-ex3-en',[curve,inter,ex,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">11. Bonus: $f$, $f'$, $f''$ Together for $f(x) = x^3 - 3x$</h2>

<p class="l-text">A final visual that ties everything together. Plotting $f$, $f'$, and $f''$ on the same axes shows the alignments: $f'$ crosses zero exactly where $f$ has horizontal tangents, and $f''$ crosses zero exactly where $f$ has its inflection point.</p>

<div class="calc-graph"><div id="plot-l25-bonus-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = x^3 - 3x$ (blue), $f'(x) = 3x^2 - 3$ (red, dotted), $f''(x) = 6x$ (gold, dash-dot). The two zeros of $f'$ at $x = \\pm 1$ correspond to the local max and min of $f$. The single zero of $f''$ at $x = 0$ corresponds to the inflection point. Reading these alignments is the essence of curve sketching.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];var fpp=[];for(var i=-25;i<=25;i++){var x=i/10;xs.push(x);f.push(x*x*x-3*x);fp.push(3*x*x-3);fpp.push(6*x);}
var c1={x:xs,y:f,mode:'lines',name:'f(x) = x³ - 3x',line:{color:'#3b82f6',width:3}};
var c2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3x² - 3",line:{color:'#ef4444',width:2.5,dash:'dot'}};
var c3={x:xs,y:fpp,mode:'lines',name:'f″(x) = 6x',line:{color:'#fbbf24',width:2.5,dash:'dashdot'}};
var pts={x:[-1,1,0],y:[2,-2,0],mode:'markers+text',name:'features',marker:{color:'#22d3ee',size:12},text:['  max','  min','  infl'],textposition:'top right',textfont:{color:'#22d3ee',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'value',range:[-13,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-bonus-en',[c1,c2,c3,pts],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">12. Classical Exercises</h2>

<p class="l-text">Carry out the full six-step analysis for each function. Solutions immediately follow each problem so that you can self-check.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Problem.</strong> Sketch $f(x) = x^3 - 3x + 2$.<br><br><strong>Solution.</strong> Domain $\\mathbb{R}$. $f(0) = 2$. $f(x) = (x-1)^2(x+2)$ → roots $x = 1$ (double, tangent) and $x = -2$ (simple, crossing). No symmetry. No asymptotes; end behaviour $-\\infty \\to +\\infty$. $f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$ → critical numbers $\\pm 1$. Sign of $f'$: $+, -, +$. Local max at $(-1, 4)$, local min at $(1, 0)$. $f''(x) = 6x$ → inflection at $(0, 2)$. Concave-down on $(-\\infty, 0)$, concave-up on $(0, \\infty)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Problem.</strong> Sketch $f(x) = \\dfrac{x}{x^2 + 1}$.<br><br><strong>Solution.</strong> Domain $\\mathbb{R}$. $f(0) = 0$; $f(x) = 0 \\iff x = 0$. $f(-x) = -f(x)$ → <strong>odd</strong> (symmetric about origin). $\\lim_{x \\to \\pm\\infty} f(x) = 0$ → horizontal asymptote $y = 0$. $f'(x) = \\dfrac{(x^2+1) - x \\cdot 2x}{(x^2+1)^2} = \\dfrac{1 - x^2}{(x^2+1)^2}$ → critical numbers $x = \\pm 1$. Local max at $(1, 1/2)$, local min at $(-1, -1/2)$. $f''$ analysis (omitted) gives inflection points at $x = 0, \\pm\\sqrt{3}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Problem.</strong> Sketch $f(x) = \\dfrac{1}{x^2 - 4}$.<br><br><strong>Solution.</strong> Domain $\\mathbb{R} \\setminus \\{-2, 2\\}$. $f(0) = -1/4$. No $x$-intercept (numerator is the constant 1). Even ($f(-x) = f(x)$). Vertical asymptotes $x = \\pm 2$; horizontal asymptote $y = 0$. $f'(x) = -\\dfrac{2x}{(x^2-4)^2}$ → critical number $x = 0$. Local max at $(0, -1/4)$. The graph has three branches: two going to $\\pm\\infty$ near the verticals plus a finite hump centred at the origin.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Problem.</strong> Sketch $f(x) = x + \\dfrac{1}{x}$ for $x \\neq 0$.<br><br><strong>Solution.</strong> Domain $\\mathbb{R} \\setminus \\{0\\}$. No $y$-intercept. $f(x) = 0 \\iff x + 1/x = 0 \\iff x^2 + 1 = 0$ — no real solution, no $x$-intercept. $f(-x) = -f(x)$ → <strong>odd</strong>. Vertical asymptote $x = 0$; oblique asymptote $y = x$ (since $1/x \\to 0$). $f'(x) = 1 - 1/x^2$ → critical numbers $x = \\pm 1$. Local max at $(-1, -2)$, local min at $(1, 2)$. $f''(x) = 2/x^3$ → concave-down on $(-\\infty, 0)$, concave-up on $(0, \\infty)$. No inflection in the domain.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Problem.</strong> Sketch $f(x) = \\ln(x^2 + 1)$.<br><br><strong>Solution.</strong> Domain $\\mathbb{R}$ (argument always positive). $f(0) = \\ln 1 = 0$; that is also the only $x$-intercept (since $\\ln u = 0 \\iff u = 1 \\iff x = 0$). Even ($f(-x) = f(x)$). $\\lim_{x \\to \\pm\\infty} \\ln(x^2+1) = +\\infty$ → no horizontal asymptote. $f'(x) = \\dfrac{2x}{x^2+1}$ → critical number $x = 0$. Local (and global) min at $(0, 0)$. $f''(x) = \\dfrac{2(1 - x^2)}{(x^2+1)^2}$ → inflection at $x = \\pm 1$, $f(\\pm 1) = \\ln 2 \\approx 0.693$. Concave-up on $(-1, 1)$, concave-down outside.</div></div>

<h2 class="l-title">13. Bonus Application: The Classical Optimization Problem</h2>

<p class="l-text">Curve sketching and optimization are two faces of the same coin — both rely on the first derivative test to find extrema. The following <strong>classical fence problem</strong> shows the recipe in action: inscribe the largest possible rectangle inside a unit half-circle, with one side lying on the diameter. Let the rectangle stretch from $-x$ to $x$ on the diameter (so its width is $2x$); its height is then $\\sqrt{1 - x^2}$. The area function is $A(x) = 2x\\sqrt{1 - x^2}$ on $x \\in [0, 1]$. We seek the value of $x$ that maximises $A$.</p>

<p class="l-text"><strong>Critical point.</strong> Differentiate: $A'(x) = 2\\sqrt{1-x^2} + 2x \\cdot \\dfrac{-x}{\\sqrt{1-x^2}} = \\dfrac{2(1-x^2) - 2x^2}{\\sqrt{1-x^2}} = \\dfrac{2 - 4x^2}{\\sqrt{1-x^2}}$. Set numerator $= 0$: $4x^2 = 2 \\Rightarrow x = 1/\\sqrt{2}$. Endpoints $A(0) = A(1) = 0$, so the interior critical point is the unique <strong>global maximum</strong>: $A_{\\max} = 2 \\cdot \\dfrac{1}{\\sqrt{2}} \\cdot \\dfrac{1}{\\sqrt{2}} = 1$.</p>

<div class="calc-graph"><div id="plot-l25-opt-en-extra" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this graph shows:</strong> the area $A(x) = 2x\\sqrt{1-x^2}$ of the inscribed rectangle as a function of the half-width $x$. The curve starts at $0$, climbs to its peak $A = 1$ at $x = 1/\\sqrt{2} \\approx 0.707$ (red dot), then drops back to $0$ at $x = 1$ where the rectangle collapses to zero height. The endpoint values are zero, confirming the interior critical point is the global maximum.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=100;i++){var x=i/100;xs.push(x);ys.push(2*x*Math.sqrt(Math.max(0,1-x*x)));}
var curve={x:xs,y:ys,mode:'lines',name:'A(x) = 2x√(1-x²)',line:{color:'#3b82f6',width:3},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.12)'};
var peak={x:[1/Math.sqrt(2)],y:[1],mode:'markers+text',name:'max at x = 1/√2',marker:{color:'#ef4444',size:13},text:['  peak A = 1'],textposition:'top right',textfont:{color:'#ef4444',size:12}};
var drop={x:[1/Math.sqrt(2),1/Math.sqrt(2)],y:[0,1],mode:'lines',name:'optimum x',line:{color:'#c8a96e',width:2,dash:'dash'},showlegend:false};
var ends={x:[0,1],y:[0,0],mode:'markers+text',marker:{color:'#22d3ee',size:9},text:['  A(0)=0','  A(1)=0'],textposition:'top right',textfont:{color:'#22d3ee',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'half-width x (rectangle from -x to x)',range:[-0.05,1.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'area A(x)',range:[-0.05,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:55,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-opt-en-extra',[curve,drop,peak,ends],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">THE OPTIMIZATION RECIPE — SIX STEPS</div><div class="example-body"><table style="width:100%;border-collapse:collapse;font-size:0.92rem;color:rgba(235,230,220,0.92)"><thead><tr style="border-bottom:2px solid #3b82f6"><th style="text-align:left;padding:0.55rem 0.7rem;color:#3b82f6;letter-spacing:0.05em">STEP</th><th style="text-align:left;padding:0.55rem 0.7rem;color:#3b82f6;letter-spacing:0.05em">WHAT TO DO</th></tr></thead><tbody><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">1. Read the problem</td><td style="padding:0.5rem 0.7rem">Identify the quantity to maximise or minimise (area, volume, cost, distance) and the geometric or physical setting. Draw a labelled sketch.</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">2. Identify variables</td><td style="padding:0.5rem 0.7rem">Name every unknown length, angle, or quantity with a symbol. Distinguish independent variables (which you can choose) from dependent ones (which follow).</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">3. Write the constraint</td><td style="padding:0.5rem 0.7rem">Translate every condition of the problem into an equation, e.g. "fence is 100 m long" $\\Rightarrow 2x + y = 100$. Use it to eliminate one variable.</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">4. Write the objective</td><td style="padding:0.5rem 0.7rem">Express the quantity to be optimised as a function of a <em>single</em> variable. Note the natural domain (lengths $\\geq 0$, $x \\leq$ available material, etc.).</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">5. Find critical points</td><td style="padding:0.5rem 0.7rem">Compute the derivative, solve $f'(x) = 0$, and list also any point where $f'$ is undefined. These are the only interior candidates for extrema.</td></tr><tr><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">6. Check boundary / 2nd derivative</td><td style="padding:0.5rem 0.7rem">Compare the objective's value at each critical point with its values at the endpoints of the domain. Confirm max vs. min using $f''(c)$ or the sign change of $f'$.</td></tr></tbody></table></div></div>

<div class="l-note"><strong>Closing thought.</strong> Once the six steps are internalised, curve sketching becomes one of the most satisfying applications of calculus — the formula on the page literally becomes a picture in your head. Every exam problem reduces to executing the same algorithm: domain, intercepts, symmetry, asymptotes, extrema, concavity. Practise the recipe until the order is automatic, and no rational function or transcendental curve will ever again look intimidating.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Eğri çizimi, türevde öğrendiğin her aracın aynı anda bir araya geldiği andır.</strong> Limitler sana uzaktaki davranışı söylemişti; türevler eğrinin nerede çıktığını, indiğini ve büküldüğünü; asimptotlar uzun erimli iskeleti çizmişti; ikinci türev testi ekstremumları kesinleştirmişti. Her araç tek başına sadece bir bilgi parçasıdır. Doğru sırayla bir araya getirildiğinde ise, herhangi bir $y = f(x)$ formülünü, yüz nokta hesaplamadan, sadık bir kalem çizimine dönüştüren tam bir tariftir.</p>

<p class="l-text">Bu derste her Türk lise türev kitabında ve her YKS-AYT sınavında karşına çıkan klasik <strong>altı adımlı yöntemi</strong> öğreneceğiz. Adımları sırayla takip et, hiçbirini atlama; eğri kendiliğinden çizilecek. Üç tam örnek baştan sona işleyeceğiz — bir rasyonel fonksiyon, bir üstel ve bir kübik — ve sonra beş alıştırma bırakacağız. Dersin sonunda, garip görünen bir formüle üç-dört dakikada elle nitel grafiğini çıkarabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Altı adımlı tarifi ezberlemek ve uygulamak: tanım, kesişim, simetri, asimptot, ekstremum, bükülme</li>
<li>Fonksiyonun tanım bölgesini paydanın sıfırı, köklü ifadenin negatifi ve logaritma argümanının pozitif olmayan değerleri elenerek bulmak</li>
<li>$x$ ve $y$ kesişimlerini bulmak ve onları grafiğin sabit noktaları olarak kullanmak</li>
<li>Çift, tek ve periyodik simetriyi tespit ederek çizim işini yarıya indirmek</li>
<li>Yatay, dikey ve eğik asimptotları limitlerden tanımak</li>
<li>$f'$ ve $f''$ bilgilerini, ekstremum ve bükülme noktaları açık biçimde işaretli tek bir çizimde birleştirmek</li>
</ul>
</div>

<h2 class="l-title">1. Altı Adımlı Tarif</h2>

<div class="calc-highlight"><strong>Her tam eğri çizimi problemi tam olarak şu sırayla altı adımda çözülür.</strong> Her adım önceki derslerde uzmanlaştığın araçlardan birini kullanır. Sıra önemlidir: tanım önce gelir çünkü onun dışında hiçbir adımın anlamı yoktur; bükülme en sona kalır çünkü kaba bir çizimi doğru bir çizime dönüştüren son detaydır.</div>

<div class="calc-formula"><div class="formula-label">ALTI ADIM</div><div class="formula-main">$$\\textbf{1. Tanım:} \\; f(x) \\text{ nerede tanımlı?}$$<br>$$\\textbf{2. Kesişimler:} \\; f(x)=0 \\text{ çöz ve } f(0) \\text{ hesapla.}$$<br>$$\\textbf{3. Simetri:} \\; f \\text{ çift, tek veya periyodik mi?}$$<br>$$\\textbf{4. Asimptotlar:} \\; \\text{yatay, dikey, eğik.}$$<br>$$\\textbf{5. Ekstremum:} \\; f' \\text{ işaret tablosu} \\Rightarrow \\text{monotonluk, yerel max/min.}$$<br>$$\\textbf{6. Bükülme:} \\; f'' \\text{ işaret tablosu} \\Rightarrow \\text{bükülme, dönüm noktaları.}$$</div><div class="formula-sub">Sonuçları tek bir resimde birleştir: kesişimleri, asimptotları, ekstremumları ve bükülme noktalarını çiz; sonra artma/azalma ve konkavlık bilgilerine uyarak bağla.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden altı adım?</div><div class="card-body">Her adım farklı bir geometrik özellik katar: tuval (tanım), sabit noktalar (kesişimler), kısayollar (simetri), uzun erim iskeleti (asimptotlar), eğrinin döndüğü yerler (ekstremum) ve nasıl büküldüğü (konkavlık).</div></div>
<div class="calc-card"><div class="card-title">Sıra önemli</div><div class="card-body">Her zaman tanımla başla. Onsuz, fonksiyonun var olmadığı bir bölgede "asimptot" hesaplayabilir, ya da yasak bir aralıkta maksimum arayabilirsin.</div></div>
<div class="calc-card"><div class="card-title">Simetri adımını atlama</div><div class="card-body">Çift veya tek simetriyi fark etmek işini tam anlamıyla yarıya indirir: bir tarafı çiz, sonra yansıt.</div></div>
</div>

<h2 class="l-title">2. Adım 1 — Tanım Bölgesini Bulma</h2>

<div class="calc-highlight"><strong>$f$'nin tanım bölgesi, $f(x)$'in sonlu reel bir değer ürettiği tüm reel sayıların kümesidir.</strong> Üç klasik yasak durum bir noktayı tanım bölgesinden çıkarır: paydada sıfır, çift dereceli kökün altında negatif sayı, ve logaritma argümanının pozitif olmaması.</div>

<div class="calc-formula"><div class="formula-label">ÜÇ TANIM KISITI</div><div class="formula-main">$$\\text{Payda: } \\frac{g(x)}{h(x)} \\text{ için } h(x) \\neq 0$$<br>$$\\text{Çift kök: } \\sqrt[2k]{g(x)} \\text{ için } g(x) \\geq 0$$<br>$$\\text{Logaritma: } \\ln g(x) \\text{ için } g(x) > 0$$</div><div class="formula-sub">Herhangi bir formül için, bu yapılardan hangileri varsa belirle ve tüm kısıtların kesişimini al — sonuç tanım bölgesidir.</div></div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL — $\\dfrac{\\sqrt{x-1}}{x-3}$'in TANIM BÖLGESİ</div><div class="example-body">İki kısıt: kök $x - 1 \\geq 0 \\Rightarrow x \\geq 1$; payda $x - 3 \\neq 0 \\Rightarrow x \\neq 3$.<br><br>Kesişim: $x \\in [1, 3) \\cup (3, \\infty)$. Bu, tanım bölgesidir.</div></div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL — $\\ln(4 - x^2)$'in TANIM BÖLGESİ</div><div class="example-body">Logaritma argümanı kesinlikle pozitif olmalı: $4 - x^2 > 0 \\Rightarrow x^2 < 4 \\Rightarrow -2 < x < 2$.<br><br>Tanım: $(-2, 2)$. $\\pm 2$ uç noktaları dışlanır çünkü $\\ln 0$ tanımsızdır.</div></div>

<div class="l-note"><strong>İpucu.</strong> Polinomların tanım bölgesi $\\mathbb{R}$'dir — kısıt yok. Trig fonksiyonları $\\sin x$, $\\cos x$ de $\\mathbb{R}$'dir; ama $\\tan x$ kosinüs paydasının sıfırı nedeniyle $x = \\pi/2 + k\\pi$ noktalarını dışlar.</div>

<h2 class="l-title">3. Adım 2 — Kesişimler</h2>

<div class="calc-highlight"><strong>Kesişimler eğrinin koordinat eksenlerini geçtiği noktalardır.</strong> $y$-kesişimi tek bir değerdir: $f(0)$ (eğer $0$ tanım bölgesindeyse); $x$-kesişimleri ise $f(x) = 0$'ın çözümleridir. Bunlar çizilebilecek en ucuz sabit noktalardır, bu yüzden çizime ilk önce konmalıdır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$y$-kesişimi</div><div class="card-body">Formülde $x = 0$ yerine koy. En fazla tek bir nokta olabilir. $0$ tanım bölgesinde değilse, eğrinin $y$-kesişimi yoktur.</div></div>
<div class="calc-card"><div class="card-title">$x$-kesişimleri</div><div class="card-body">$f(x) = 0$'ı çöz. Sıfır, bir, sonlu veya sonsuz tane olabilir. Bunlara fonksiyonun <em>sıfırları</em> veya <em>kökleri</em> denir.</div></div>
<div class="calc-card"><div class="card-title">Kökler arası işaret</div><div class="card-body">Ardışık iki $x$-kesişimi arasında fonksiyon tek bir işaret korur. Eksenin üstünde mi altında mı olduğunu görmek için herhangi bir test değeri seç.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL — $f(x) = x^3 - 4x$'in KESİŞİMLERİ</div><div class="example-body">$y$-kesişimi: $f(0) = 0$. Eğri orijinden geçer.<br><br>$x$-kesişimleri: $x^3 - 4x = x(x^2 - 4) = x(x-2)(x+2) = 0 \\Rightarrow x \\in \\{-2, 0, 2\\}$.<br><br>Üç $x$-kesişimi. Aralardaki işaret: $f(-3) = -27 + 12 = -15 < 0$, $f(-1) = -1 + 4 = 3 > 0$, $f(1) = 1 - 4 = -3 < 0$, $f(3) = 27 - 12 = 15 > 0$. Eğri işaret değiştirir — üç gerçek köklü tek dereceli kübikler için tipik.</div></div>

<h2 class="l-title">4. Adım 3 — Simetri</h2>

<div class="calc-highlight"><strong>Bir fonksiyonun simetrisi varsa, sadece yarısını çizmen yeterlidir.</strong> En sık karşılaşılan iki tür: <em>çift</em> simetri ($y$-ekseni boyunca yansıma) ve <em>tek</em> simetri (orijin etrafında nokta simetrisi). $\\sin x$ gibi periyodik fonksiyonlar her $T$ periyodu sonrasında tekrar eder, dolayısıyla tek bir periyot yeterlidir.</div>

<div class="calc-formula"><div class="formula-label">SİMETRİ TESTLERİ</div><div class="formula-main">$$f \\text{ } \\textbf{çift} \\iff f(-x) = f(x) \\text{ tanım bölgesindeki her } x \\text{ için}$$<br>$$f \\text{ } \\textbf{tek} \\iff f(-x) = -f(x) \\text{ tanım bölgesindeki her } x \\text{ için}$$<br>$$f \\text{ } T \\text{ periyotlu } \\textbf{periyodik} \\iff f(x + T) = f(x) \\text{ her } x \\text{ için}$$</div><div class="formula-sub">Formüle $-x$ koy ve sadeleştir. Aynı ifadeyi elde edersen çifttir; tersini elde edersen tektir; aksi halde eksen veya orijin simetrisi yoktur.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">Çift fonksiyonlar</div><div class="compare-item">Grafik $y$-ekseni etrafında simetriktir</div><div class="compare-item">Örnekler: $x^2$, $x^4$, $\\cos x$, $|x|$</div><div class="compare-item">Sadece çift kuvvetler bulunur (polinomda)</div><div class="compare-item">$x \\geq 0$ için çiz, sonra yansıt</div></div><div class="compare-col"><div class="compare-title">Tek fonksiyonlar</div><div class="compare-item">Grafik orijin etrafında simetriktir</div><div class="compare-item">Örnekler: $x$, $x^3$, $\\sin x$, $\\tan x$</div><div class="compare-item">Sadece tek kuvvetler bulunur (polinomda)</div><div class="compare-item">$x \\geq 0$ için çiz, sonra $180°$ döndür</div></div></div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL — $f(x) = \\dfrac{x^2 - 1}{x^2 + 1}$ ÇİFT Mİ TEK Mİ?</div><div class="example-body">$f(-x) = \\dfrac{(-x)^2 - 1}{(-x)^2 + 1} = \\dfrac{x^2 - 1}{x^2 + 1} = f(x)$.<br><br>Fonksiyon <strong>çift</strong>tir. Grafik $y$-ekseni etrafında simetrik — sadece $x \\geq 0$'ı incelememiz ve yansıtmamız yeterlidir.</div></div>

<h2 class="l-title">5. Adım 4 — Asimptotlar (L14'ten Hatırlatma)</h2>

<div class="calc-highlight"><strong>Asimptotlar grafiğin uzun erimli iskeletidir.</strong> $x$ sonsuza giderken veya bir "yasak" noktaya yaklaşırken eğrinin nereye gittiğini söyler. Üç çeşit vardır: yatay ($x \\to \\pm\\infty$'da limit), dikey (sonlu bir $x$'te limit patlar) ve eğik (sonsuzda yaklaşılan eğik doğru).</div>

<div class="calc-formula"><div class="formula-label">ASİMPTOT TESTLERİ</div><div class="formula-main">$$\\textbf{Yatay: } y = L \\iff \\lim_{x \\to \\pm\\infty} f(x) = L$$<br>$$\\textbf{Dikey: } x = a \\iff \\lim_{x \\to a} |f(x)| = \\infty$$<br>$$\\textbf{Eğik: } y = mx + n \\iff f(x) - (mx+n) \\to 0 \\text{ olur } x \\to \\pm\\infty$$</div><div class="formula-sub">Bir $p(x)/q(x)$ rasyonel fonksiyonu, ancak $\\deg p = \\deg q + 1$ ise eğik asimptot içerir; $m$ ve $n$'i bulmak için polinom bölmesi kullan.</div></div>

<div class="calc-example"><div class="example-label">HIZLI HATIRLATMA — $f(x) = \\dfrac{x^2}{x-1}$'in ASİMPTOTLARI</div><div class="example-body"><strong>Dikey:</strong> payda $x = 1$'de sıfır; pay orada sıfır değil → dikey asimptot $x = 1$.<br><br><strong>Yatay:</strong> $\\deg(\\text{pay}) = 2 > 1 = \\deg(\\text{payda})$ → yok.<br><br><strong>Eğik:</strong> dereceler tam bir fark → böl. $x^2 = (x-1)(x+1) + 1$, yani $f(x) = x + 1 + \\dfrac{1}{x-1}$. $|x| \\to \\infty$ iken kalan sıfırlanır → eğik asimptot $y = x + 1$.</div></div>

<h2 class="l-title">6. Adım 5 — Ekstremum ve Monotonluk (L23'ten Hatırlatma)</h2>

<div class="calc-highlight"><strong>$f'$ işareti, fonksiyonun nerede yükseldiğini ve nerede düştüğünü kontrol eder.</strong> Kritik sayılar $f'(c) = 0$ (veya $f'$ tanımsız) yerel ekstremum için tek adaylardır. $f'$ için bir işaret tablosu kur ve artma/azalma aralıklarını, her yerel max ve min'in yerini oku.</div>

<div class="calc-formula"><div class="formula-label">BİRİNCİ TÜREV TESTİ</div><div class="formula-main">$$f'(x) > 0 \\text{ ise } (a, b)\\text{'de} \\Rightarrow f \\text{ artan} (a, b)\\text{'de}$$<br>$$f'(x) < 0 \\text{ ise } (a, b)\\text{'de} \\Rightarrow f \\text{ azalan} (a, b)\\text{'de}$$<br>$$f' \\text{ değişir } + \\to - \\text{ noktasında } c \\Rightarrow \\text{ yerel max } c\\text{'de}$$<br>$$f' \\text{ değişir } - \\to + \\text{ noktasında } c \\Rightarrow \\text{ yerel min } c\\text{'de}$$</div><div class="formula-sub">İşaret değişmiyorsa $c$ ne max ne min — eğri yatay teğete sahip ama aynı yönde hareketine devam eder.</div></div>

<div class="think-box"><div class="think-label">UNUTMA</div><div class="think-body">Çizimine bir yerel max veya min koyarken, $y$ koordinatı $f(c)$'yi de hesapla. Asıl koyman gereken çift $(c, f(c))$'dir — sadece $x$ değeri değil.</div></div>

<h2 class="l-title">7. Adım 6 — Konkavlık ve Bükülme Noktaları (L24'ten Hatırlatma)</h2>

<div class="calc-highlight"><strong>$f''$ işareti bükülme yönünü kontrol eder.</strong> Pozitif $f''$ konkav-yukarı (kase şekli) demektir; negatif $f''$ konkav-aşağı (tepe şekli) demektir; $f''$'nün işaret değiştirmesi bir bükülme noktası üretir. Konkavlık son rötuştur — iki ekstremum arasında eğrinin yukarı mı yoksa aşağı mı şişeceğine karar verir.</div>

<div class="calc-formula"><div class="formula-label">KONKAVLIK TESTİ</div><div class="formula-main">$$f''(x) > 0 \\text{ } (a, b)\\text{'de} \\Rightarrow f \\text{ konkav-yukarı } (a, b)\\text{'de}$$<br>$$f''(x) < 0 \\text{ } (a, b)\\text{'de} \\Rightarrow f \\text{ konkav-aşağı } (a, b)\\text{'de}$$<br>$$f'' \\text{ işaret değiştirir } c\\text{'de} \\Rightarrow \\text{ bükülme noktası } (c, f(c))$$</div><div class="formula-sub">Bükülme adayı, $f''(c) = 0$ veya $f''$ tanımsız olan herhangi bir $c$'dir — her iki tarafta işareti kontrol ederek doğrula.</div></div>

<h2 class="l-title">8. İşlenmiş Örnek 1: $f(x) = \\dfrac{x^2 - 1}{x^2 + 1}$</h2>

<p class="l-text">Şimdi klasik bir rasyonel fonksiyon üzerinde altı adımlı yöntemi tamamen uygulayacağız. Acele etme — bu, karşına çıkacak her çizim probleminin şablonudur.</p>

<p class="l-text"><strong>Adım 1 — Tanım.</strong> Payda $x^2 + 1 \\geq 1 > 0$ her reel $x$ için, asla sıfır olmaz. Tanım: $\\mathbb{R}$.</p>

<p class="l-text"><strong>Adım 2 — Kesişimler.</strong> $y$-kesişimi: $f(0) = \\dfrac{0 - 1}{0 + 1} = -1$, nokta $(0, -1)$. $x$-kesişimleri: $f(x) = 0 \\iff x^2 - 1 = 0 \\iff x = \\pm 1$, noktalar $(\\pm 1, 0)$.</p>

<p class="l-text"><strong>Adım 3 — Simetri.</strong> $f(-x) = \\dfrac{(-x)^2 - 1}{(-x)^2 + 1} = \\dfrac{x^2 - 1}{x^2 + 1} = f(x)$ → $f$ <strong>çift</strong>tir. Grafik $y$-ekseni etrafında simetrik.</p>

<p class="l-text"><strong>Adım 4 — Asimptotlar.</strong> Dikey asimptot yok (payda hiç sıfır olmaz). Yatay: $\\lim_{x \\to \\pm\\infty} \\dfrac{x^2 - 1}{x^2 + 1} = 1$ (eşit dereceli, başkat sayıların oranı) → yatay asimptot $y = 1$. Eğik asimptot yok (dereceler eşit).</p>

<p class="l-text"><strong>Adım 5 — Ekstremum.</strong> $f(x) = 1 - \\dfrac{2}{x^2 + 1}$ olarak yaz. O zaman $f'(x) = -2 \\cdot \\dfrac{-2x}{(x^2+1)^2} = \\dfrac{4x}{(x^2+1)^2}$. Payda her zaman pozitif, dolayısıyla $f'(x) = 0 \\iff x = 0$. $f'$ işareti: $x < 0$ için negatif, $x > 0$ için pozitif. Yani $f$, $(-\\infty, 0)$'da azalıyor, $(0, \\infty)$'da artıyor → <strong>yerel (ve mutlak) minimum</strong> $(0, -1)$'de.</p>

<p class="l-text"><strong>Adım 6 — Konkavlık.</strong> $f'(x) = \\dfrac{4x}{(x^2+1)^2}$'yi bölüm kuralıyla türevle: $f''(x) = \\dfrac{4(x^2+1)^2 - 4x \\cdot 2(x^2+1) \\cdot 2x}{(x^2+1)^4} = \\dfrac{4(x^2+1) - 16x^2}{(x^2+1)^3} = \\dfrac{4 - 12x^2}{(x^2+1)^3} = \\dfrac{-4(3x^2 - 1)}{(x^2+1)^3}$.</p>

<p class="l-text">Payda pozitif, yani $f''$ işareti $-(3x^2 - 1) = 1 - 3x^2$ işaretine eşit. Bu pozitif olur $x^2 < 1/3 \\iff |x| < 1/\\sqrt{3}$ iken; negatif olur $|x| > 1/\\sqrt{3}$ iken. Yani $f$, $(-1/\\sqrt{3}, 1/\\sqrt{3})$ aralığında konkav-yukarı, dışarıda konkav-aşağı. <strong>Bükülme noktaları</strong> $x = \\pm 1/\\sqrt{3}$'de, $f(\\pm 1/\\sqrt{3}) = \\dfrac{1/3 - 1}{1/3 + 1} = \\dfrac{-2/3}{4/3} = -\\dfrac{1}{2}$. Noktalar: $(\\pm 1/\\sqrt{3}, -1/2)$.</p>

<div class="calc-example"><div class="example-label">ÖZET TABLOSU</div><div class="example-body"><strong>Tanım:</strong> $\\mathbb{R}$.<br><strong>Kesişimler:</strong> $(0, -1)$, $(\\pm 1, 0)$.<br><strong>Simetri:</strong> çift ($y$-eksenine göre yansıma).<br><strong>Asimptot:</strong> yatay $y = 1$.<br><strong>Yerel min:</strong> $(0, -1)$.<br><strong>Bükülme:</strong> $(\\pm 1/\\sqrt{3}, -1/2)$.<br><strong>Artan:</strong> $(0, \\infty)$. <strong>Azalan:</strong> $(-\\infty, 0)$.<br><strong>Konkav-yukarı:</strong> $(-1/\\sqrt{3}, 1/\\sqrt{3})$. <strong>Konkav-aşağı:</strong> diğer yerler.</div></div>

<div class="calc-graph"><div id="plot-l25-ex1-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $f(x) = (x^2-1)/(x^2+1)$ tüm kritik özellikleri işaretli. Yatay asimptot $y = 1$ kesik altın çizgi; eğri ona yaklaşır ama hiç değmez. Yerel minimum $(0, -1)$'de, iki bükülme noktası (altın baklava) ise $x = \\pm 1/\\sqrt{3} \\approx \\pm 0.577$ noktalarındadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-50;i<=50;i++){var x=i/10;xs.push(x);ys.push((x*x-1)/(x*x+1));}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = (x²-1)/(x²+1)',line:{color:'#3b82f6',width:3}};
var asy={x:[-5,5],y:[1,1],mode:'lines',name:'asimptot y = 1',line:{color:'#c8a96e',width:2,dash:'dash'}};
var inter={x:[-1,1,0],y:[0,0,-1],mode:'markers+text',name:'kesişim',marker:{color:'#ef4444',size:11},text:['  (-1,0)','  (1,0)','  (0,-1) min'],textposition:'top right',textfont:{color:'#ef4444',size:11}};
var s=1/Math.sqrt(3);
var infl={x:[-s,s],y:[-0.5,-0.5],mode:'markers+text',name:'bükülme',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  bük','  bük'],textposition:'bottom right',textfont:{color:'#fbbf24',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1.3,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-ex1-tr',[curve,asy,inter,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">9. İşlenmiş Örnek 2: $f(x) = x \\, e^{-x}$</h2>

<p class="l-text">Bir üstel çarpan yeni davranış katar — bir tarafta hızlı büyüme, diğerinde hızlı azalma.</p>

<p class="l-text"><strong>Adım 1 — Tanım.</strong> Hem $x$ hem $e^{-x}$ her reel $x$ için tanımlı. Tanım: $\\mathbb{R}$.</p>

<p class="l-text"><strong>Adım 2 — Kesişimler.</strong> $f(0) = 0 \\cdot 1 = 0$, nokta $(0, 0)$. $f(x) = 0 \\iff x \\cdot e^{-x} = 0$; $e^{-x} > 0$ hiç sıfır olmadığı için tek çözüm $x = 0$. Tek kesişim orijinde.</p>

<p class="l-text"><strong>Adım 3 — Simetri.</strong> $f(-x) = -x \\cdot e^{x}$ — ne $f(x)$ ne de $-f(x)$. <strong>Simetri yok.</strong></p>

<p class="l-text"><strong>Adım 4 — Asimptotlar.</strong> $\\lim_{x \\to \\infty} x e^{-x} = \\lim_{x \\to \\infty} \\dfrac{x}{e^x} = 0$ (üstel polinomu yener) → sağ tarafta yatay asimptot $y = 0$. $x \\to -\\infty$ iken: $e^{-x} = e^{|x|} \\to \\infty$ ve $x \\to -\\infty$, dolayısıyla $f(x) \\to -\\infty$. Solda yatay asimptot yok, dikey asimptot yok (her yerde tanımlı), eğik asimptot yok.</p>

<p class="l-text"><strong>Adım 5 — Ekstremum.</strong> $f'(x) = e^{-x} + x(-e^{-x}) = e^{-x}(1 - x)$. $e^{-x} > 0$ olduğu için $f'(x) = 0 \\iff 1 - x = 0 \\iff x = 1$. $f'$ işareti: $x < 1$ için $1 - x > 0$ (pozitif), $x > 1$ için $1 - x < 0$ (negatif). Yani $f$, $(-\\infty, 1)$'de artıyor, $(1, \\infty)$'da azalıyor → <strong>yerel (ve mutlak) maksimum</strong> $x = 1$'de. Değer: $f(1) = 1 \\cdot e^{-1} = 1/e \\approx 0.368$.</p>

<p class="l-text"><strong>Adım 6 — Konkavlık.</strong> $f''(x) = -e^{-x}(1-x) + e^{-x}(-1) = e^{-x}(-(1-x) - 1) = e^{-x}(x - 2)$. $f''$ işareti $x - 2$ işaretine eşit ($e^{-x} > 0$): $x < 2$ için negatif, $x > 2$ için pozitif. Yani $f$, $(-\\infty, 2)$'de konkav-aşağı, $(2, \\infty)$'da konkav-yukarı → <strong>bükülme noktası</strong> $x = 2$'de, $f(2) = 2 e^{-2} \\approx 0.271$. Nokta: $(2, 2/e^2)$.</p>

<div class="calc-example"><div class="example-label">ÖZET TABLOSU</div><div class="example-body"><strong>Tanım:</strong> $\\mathbb{R}$.<br><strong>Kesişim:</strong> sadece $(0, 0)$.<br><strong>Simetri:</strong> yok.<br><strong>Asimptot:</strong> yatay $y = 0$ sadece $x \\to \\infty$ iken.<br><strong>Yerel max:</strong> $(1, 1/e)$.<br><strong>Bükülme:</strong> $(2, 2/e^2)$.<br><strong>Artan:</strong> $(-\\infty, 1)$. <strong>Azalan:</strong> $(1, \\infty)$.<br><strong>Konkav-aşağı:</strong> $(-\\infty, 2)$. <strong>Konkav-yukarı:</strong> $(2, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l25-ex2-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $f(x) = x e^{-x}$. Eğri $-\\infty$'dan tırmanır, orijinden geçer, $(1, 1/e)$'de tepe yapar (kırmızı nokta), bükülme noktası $(2, 2/e^2)$'den (altın baklava) geçer ve sağda $y = 0$ (kesik altın) asimptotuna asimptotik olarak yerleşir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-15;i<=60;i++){var x=i/10;xs.push(x);ys.push(x*Math.exp(-x));}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = x e^(-x)',line:{color:'#3b82f6',width:3}};
var asy={x:[-1.5,6],y:[0,0],mode:'lines',name:'asimptot y = 0',line:{color:'#c8a96e',width:2,dash:'dash'},showlegend:false};
var mx={x:[1],y:[1/Math.E],mode:'markers+text',name:'max (1, 1/e)',marker:{color:'#ef4444',size:12},text:['  max (1, 1/e)'],textposition:'top right',textfont:{color:'#ef4444',size:11}};
var infl={x:[2],y:[2/Math.exp(2)],mode:'markers+text',name:'bükülme (2, 2/e²)',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  bük'],textposition:'top right',textfont:{color:'#fbbf24',size:11}};
var orig={x:[0],y:[0],mode:'markers',marker:{color:'#22d3ee',size:9},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-1.5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1.5,0.55],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-ex2-tr',[curve,asy,mx,infl,orig],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">10. İşlenmiş Örnek 3: $f(x) = x^3 - 3x^2 + 4$</h2>

<p class="l-text">Bir polinom — en basit durum, asimptot sorunu yok. Tüm iş 5. ve 6. adımlarda.</p>

<p class="l-text"><strong>Adım 1 — Tanım.</strong> Polinom, tanım $\\mathbb{R}$.</p>

<p class="l-text"><strong>Adım 2 — Kesişimler.</strong> $y$-kesişimi: $f(0) = 4$. $x$-kesişimleri için $x^3 - 3x^2 + 4 = 0$'ın tam sayı köklerini dene: $f(-1) = -1 - 3 + 4 = 0$, yani $x = -1$ bir kök. Çarpanla: $x^3 - 3x^2 + 4 = (x+1)(x^2 - 4x + 4) = (x+1)(x-2)^2$. Yani sıfırlar $x = -1$ (basit) ve $x = 2$ (çift). $x = 2$'de eğri eksene <em>değer</em> ama geçmez — çift kök için tipik.</p>

<p class="l-text"><strong>Adım 3 — Simetri.</strong> $f(-x) = -x^3 - 3x^2 + 4$ — ne $f(x)$ ne $-f(x)$. <strong>Simetri yok.</strong></p>

<p class="l-text"><strong>Adım 4 — Asimptotlar.</strong> Polinomlarda asimptot olmaz. Uç davranış: başkat terim $x^3$, dolayısıyla $x \\to +\\infty$ iken $f(x) \\to +\\infty$, $x \\to -\\infty$ iken $f(x) \\to -\\infty$.</p>

<p class="l-text"><strong>Adım 5 — Ekstremum.</strong> $f'(x) = 3x^2 - 6x = 3x(x - 2)$. Kritik sayılar: $x = 0$ ve $x = 2$. $f'$ işaret tablosu: $(-\\infty, 0)$'da pozitif, $(0, 2)$'de negatif, $(2, \\infty)$'da pozitif. Yani $f$ artar, sonra azalır, sonra tekrar artar. Yerel <strong>max</strong> $(0, 4)$'te, yerel <strong>min</strong> $(2, 0)$'da.</p>

<p class="l-text"><strong>Adım 6 — Konkavlık.</strong> $f''(x) = 6x - 6 = 6(x - 1)$. $f''$ işareti: $x < 1$ için negatif, $x > 1$ için pozitif. Yani $f$, $(-\\infty, 1)$'de konkav-aşağı, $(1, \\infty)$'da konkav-yukarı → <strong>bükülme noktası</strong> $x = 1$'de, $f(1) = 1 - 3 + 4 = 2$. Nokta: $(1, 2)$.</p>

<div class="calc-example"><div class="example-label">ÖZET TABLOSU</div><div class="example-body"><strong>Tanım:</strong> $\\mathbb{R}$.<br><strong>Kesişimler:</strong> $(0, 4)$, $(-1, 0)$, $(2, 0)$ (teğet — çift kök).<br><strong>Simetri:</strong> yok.<br><strong>Asimptotlar:</strong> yok. Uç davranış $-\\infty \\to +\\infty$.<br><strong>Yerel max:</strong> $(0, 4)$. <strong>Yerel min:</strong> $(2, 0)$.<br><strong>Bükülme:</strong> $(1, 2)$.<br><strong>Artan:</strong> $(-\\infty, 0) \\cup (2, \\infty)$. <strong>Azalan:</strong> $(0, 2)$.<br><strong>Konkav-aşağı:</strong> $(-\\infty, 1)$. <strong>Konkav-yukarı:</strong> $(1, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l25-ex3-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $f(x) = x^3 - 3x^2 + 4$. Eğri yerel max $(0, 4)$'e yükselir, yerel min $(2, 0)$'a iner ve burada $x$-eksenine teğet olarak değer (çift kök), sonra yeniden yükselir. Bükülme noktası $(1, 2)$, iki ekstremumun tam orta noktasıdır — her kübikte paylaşılan bir özellik.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-20;i<=40;i++){var x=i/10;xs.push(x);ys.push(x*x*x-3*x*x+4);}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = x³-3x²+4',line:{color:'#3b82f6',width:3}};
var inter={x:[-1,2,0],y:[0,0,4],mode:'markers+text',name:'kesişim',marker:{color:'#22d3ee',size:10},text:['  (-1,0)','  (2,0)','  (0,4)'],textposition:'top right',textfont:{color:'#22d3ee',size:11},showlegend:false};
var ex={x:[0,2],y:[4,0],mode:'markers+text',name:'ekstremum',marker:{color:'#ef4444',size:13},text:['  max','  min'],textposition:'bottom right',textfont:{color:'#ef4444',size:12}};
var infl={x:[1],y:[2],mode:'markers+text',name:'bükülme (1, 2)',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  bük'],textposition:'top right',textfont:{color:'#fbbf24',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-ex3-tr',[curve,inter,ex,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">11. Bonus: $f(x) = x^3 - 3x$ için $f$, $f'$, $f''$ Birlikte</h2>

<p class="l-text">Her şeyi birbirine bağlayan son bir görsel. $f$, $f'$ ve $f''$'yi aynı eksende çizmek hizalamaları gösterir: $f'$, $f$'nin yatay teğete sahip olduğu noktalarda sıfırı keser; $f''$ ise $f$'nin bükülme noktasında sıfırı keser.</p>

<div class="calc-graph"><div id="plot-l25-bonus-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $f(x) = x^3 - 3x$ (mavi), $f'(x) = 3x^2 - 3$ (kırmızı, noktalı), $f''(x) = 6x$ (altın, çizgi-nokta). $f'$'nün $x = \\pm 1$'deki iki sıfırı, $f$'nin yerel max ve min'ine karşılık gelir. $f''$'nün $x = 0$'daki tek sıfırı bükülme noktasına karşılık gelir. Bu hizalamaları okumak eğri çiziminin özüdür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];var fpp=[];for(var i=-25;i<=25;i++){var x=i/10;xs.push(x);f.push(x*x*x-3*x);fp.push(3*x*x-3);fpp.push(6*x);}
var c1={x:xs,y:f,mode:'lines',name:'f(x) = x³ - 3x',line:{color:'#3b82f6',width:3}};
var c2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3x² - 3",line:{color:'#ef4444',width:2.5,dash:'dot'}};
var c3={x:xs,y:fpp,mode:'lines',name:'f″(x) = 6x',line:{color:'#fbbf24',width:2.5,dash:'dashdot'}};
var pts={x:[-1,1,0],y:[2,-2,0],mode:'markers+text',name:'özellikler',marker:{color:'#22d3ee',size:12},text:['  max','  min','  bük'],textposition:'top right',textfont:{color:'#22d3ee',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'değer',range:[-13,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-bonus-tr',[c1,c2,c3,pts],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">12. Klasik Alıştırmalar</h2>

<p class="l-text">Her fonksiyon için altı adımlı tam analizi yap. Çözümler her problemin hemen ardından, kendi kontrolünü yapabilesin diye verilmiştir.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Problem.</strong> $f(x) = x^3 - 3x + 2$ fonksiyonunu çiz.<br><br><strong>Çözüm.</strong> Tanım $\\mathbb{R}$. $f(0) = 2$. $f(x) = (x-1)^2(x+2)$ → kökler $x = 1$ (çift, teğet) ve $x = -2$ (basit, geçişli). Simetri yok. Asimptot yok; uç davranış $-\\infty \\to +\\infty$. $f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$ → kritik sayılar $\\pm 1$. $f'$ işareti: $+, -, +$. Yerel max $(-1, 4)$'te, yerel min $(1, 0)$'da. $f''(x) = 6x$ → bükülme $(0, 2)$'de. Konkav-aşağı $(-\\infty, 0)$'da, konkav-yukarı $(0, \\infty)$'da.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Problem.</strong> $f(x) = \\dfrac{x}{x^2 + 1}$ fonksiyonunu çiz.<br><br><strong>Çözüm.</strong> Tanım $\\mathbb{R}$. $f(0) = 0$; $f(x) = 0 \\iff x = 0$. $f(-x) = -f(x)$ → <strong>tek</strong> (orijin etrafında simetrik). $\\lim_{x \\to \\pm\\infty} f(x) = 0$ → yatay asimptot $y = 0$. $f'(x) = \\dfrac{(x^2+1) - x \\cdot 2x}{(x^2+1)^2} = \\dfrac{1 - x^2}{(x^2+1)^2}$ → kritik sayılar $x = \\pm 1$. Yerel max $(1, 1/2)$'de, yerel min $(-1, -1/2)$'de. $f''$ analizi (atlandı) $x = 0, \\pm\\sqrt{3}$'te bükülme noktaları verir.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Problem.</strong> $f(x) = \\dfrac{1}{x^2 - 4}$ fonksiyonunu çiz.<br><br><strong>Çözüm.</strong> Tanım $\\mathbb{R} \\setminus \\{-2, 2\\}$. $f(0) = -1/4$. $x$-kesişimi yok (pay 1 sabiti). Çift ($f(-x) = f(x)$). Dikey asimptotlar $x = \\pm 2$; yatay asimptot $y = 0$. $f'(x) = -\\dfrac{2x}{(x^2-4)^2}$ → kritik sayı $x = 0$. Yerel max $(0, -1/4)$'te. Grafiğin üç dalı vardır: dikeylere yakın $\\pm\\infty$'a giden ikisi artı orijinde sonlu bir tepe.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Problem.</strong> $f(x) = x + \\dfrac{1}{x}$ fonksiyonunu $x \\neq 0$ için çiz.<br><br><strong>Çözüm.</strong> Tanım $\\mathbb{R} \\setminus \\{0\\}$. $y$-kesişimi yok. $f(x) = 0 \\iff x + 1/x = 0 \\iff x^2 + 1 = 0$ — reel çözüm yok, $x$-kesişimi yok. $f(-x) = -f(x)$ → <strong>tek</strong>. Dikey asimptot $x = 0$; eğik asimptot $y = x$ (çünkü $1/x \\to 0$). $f'(x) = 1 - 1/x^2$ → kritik sayılar $x = \\pm 1$. Yerel max $(-1, -2)$'de, yerel min $(1, 2)$'de. $f''(x) = 2/x^3$ → $(-\\infty, 0)$'da konkav-aşağı, $(0, \\infty)$'da konkav-yukarı. Tanım bölgesinde bükülme yok.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Problem.</strong> $f(x) = \\ln(x^2 + 1)$ fonksiyonunu çiz.<br><br><strong>Çözüm.</strong> Tanım $\\mathbb{R}$ (argüman her zaman pozitif). $f(0) = \\ln 1 = 0$; bu tek $x$-kesişimi (çünkü $\\ln u = 0 \\iff u = 1 \\iff x = 0$). Çift ($f(-x) = f(x)$). $\\lim_{x \\to \\pm\\infty} \\ln(x^2+1) = +\\infty$ → yatay asimptot yok. $f'(x) = \\dfrac{2x}{x^2+1}$ → kritik sayı $x = 0$. Yerel (ve mutlak) min $(0, 0)$'da. $f''(x) = \\dfrac{2(1 - x^2)}{(x^2+1)^2}$ → bükülme $x = \\pm 1$'de, $f(\\pm 1) = \\ln 2 \\approx 0.693$. Konkav-yukarı $(-1, 1)$'de, konkav-aşağı dışarıda.</div></div>

<h2 class="l-title">13. Bonus Uygulama: Klasik Optimizasyon Problemi</h2>

<p class="l-text">Eğri çizimi ve optimizasyon aslında aynı madalyonun iki yüzüdür — her ikisi de ekstremum bulmak için birinci türev testine dayanır. Aşağıdaki <strong>klasik tel/kutu problemi</strong> tarifi pratiğe döker: birim yarım daireye bir kenarı çapın üzerinde duracak şekilde sığabilecek en büyük dikdörtgeni çiz. Dikdörtgenin çap üzerinde $-x$'ten $x$'e uzandığını varsayalım (genişlik $2x$); yüksekliği o zaman $\\sqrt{1 - x^2}$ olur. Alan fonksiyonu $A(x) = 2x\\sqrt{1 - x^2}$, $x \\in [0, 1]$. Amacımız $A$'yı maksimize eden $x$ değerini bulmak.</p>

<p class="l-text"><strong>Kritik nokta.</strong> Türevle: $A'(x) = 2\\sqrt{1-x^2} + 2x \\cdot \\dfrac{-x}{\\sqrt{1-x^2}} = \\dfrac{2(1-x^2) - 2x^2}{\\sqrt{1-x^2}} = \\dfrac{2 - 4x^2}{\\sqrt{1-x^2}}$. Payı sıfıra eşitle: $4x^2 = 2 \\Rightarrow x = 1/\\sqrt{2}$. Uç noktalar $A(0) = A(1) = 0$, dolayısıyla iç kritik nokta tek <strong>global maksimum</strong>: $A_{\\max} = 2 \\cdot \\dfrac{1}{\\sqrt{2}} \\cdot \\dfrac{1}{\\sqrt{2}} = 1$.</p>

<div class="calc-graph"><div id="plot-l25-opt-tr-extra" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> içerideki dikdörtgenin alanı $A(x) = 2x\\sqrt{1-x^2}$ yarı genişlik $x$'in fonksiyonu olarak. Eğri $0$'dan başlar, $x = 1/\\sqrt{2} \\approx 0.707$ noktasında tepe $A = 1$'e tırmanır (kırmızı nokta), sonra dikdörtgenin yüksekliğinin sıfıra çöktüğü $x = 1$'de tekrar $0$'a düşer. Uç noktalardaki sıfır değerler, iç kritik noktanın global maksimum olduğunu doğrular.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=100;i++){var x=i/100;xs.push(x);ys.push(2*x*Math.sqrt(Math.max(0,1-x*x)));}
var curve={x:xs,y:ys,mode:'lines',name:'A(x) = 2x√(1-x²)',line:{color:'#3b82f6',width:3},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.12)'};
var peak={x:[1/Math.sqrt(2)],y:[1],mode:'markers+text',name:'max x = 1/√2',marker:{color:'#ef4444',size:13},text:['  tepe A = 1'],textposition:'top right',textfont:{color:'#ef4444',size:12}};
var drop={x:[1/Math.sqrt(2),1/Math.sqrt(2)],y:[0,1],mode:'lines',name:'optimum x',line:{color:'#c8a96e',width:2,dash:'dash'},showlegend:false};
var ends={x:[0,1],y:[0,0],mode:'markers+text',marker:{color:'#22d3ee',size:9},text:['  A(0)=0','  A(1)=0'],textposition:'top right',textfont:{color:'#22d3ee',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'yarı genişlik x (dikdörtgen -x → x)',range:[-0.05,1.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'alan A(x)',range:[-0.05,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:55,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l25-opt-tr-extra',[curve,drop,peak,ends],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">OPTİMİZASYON TARİFİ — ALTI ADIM</div><div class="example-body"><table style="width:100%;border-collapse:collapse;font-size:0.92rem;color:rgba(235,230,220,0.92)"><thead><tr style="border-bottom:2px solid #3b82f6"><th style="text-align:left;padding:0.55rem 0.7rem;color:#3b82f6;letter-spacing:0.05em">ADIM</th><th style="text-align:left;padding:0.55rem 0.7rem;color:#3b82f6;letter-spacing:0.05em">NE YAPILIR</th></tr></thead><tbody><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">1. Problemi oku</td><td style="padding:0.5rem 0.7rem">Maksimize veya minimize edilecek niceliği (alan, hacim, maliyet, uzaklık) ve geometrik/fiziksel ortamı belirle. Etiketli bir kroki çiz.</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">2. Değişkenleri tanı</td><td style="padding:0.5rem 0.7rem">Her bilinmeyen uzunluk, açı veya niceliği bir sembolle adlandır. Bağımsız (seçebileceğin) ile bağımlı (otomatik gelen) değişkenleri ayırt et.</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">3. Kısıtı yaz</td><td style="padding:0.5rem 0.7rem">Problemdeki her koşulu bir denkleme çevir, örn. "tel 100 m" $\\Rightarrow 2x + y = 100$. Bir değişkeni elemek için kullan.</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">4. Amaç fonksiyonunu yaz</td><td style="padding:0.5rem 0.7rem">Optimize edilecek niceliği <em>tek bir</em> değişkenin fonksiyonu olarak ifade et. Doğal tanım bölgesini not et (uzunluklar $\\geq 0$, $x \\leq$ malzeme, vs.).</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">5. Kritik noktaları bul</td><td style="padding:0.5rem 0.7rem">Türevi hesapla, $f'(x) = 0$'ı çöz, ayrıca $f'$'nin tanımsız olduğu noktaları listele. Bunlar ekstremum için tek iç adaylardır.</td></tr><tr><td style="padding:0.5rem 0.7rem;font-weight:600;color:#22d3ee">6. Sınır / 2. türev kontrolü</td><td style="padding:0.5rem 0.7rem">Amaç fonksiyonunun her kritik noktadaki değerini tanım bölgesinin uç noktalarındaki değerleriyle karşılaştır. $f''(c)$ veya $f'$'nin işaret değişimi ile max/min doğrula.</td></tr></tbody></table></div></div>

<div class="l-note"><strong>Kapanış düşüncesi.</strong> Altı adım içselleştirildiğinde, eğri çizimi türev hesabının en tatmin edici uygulamalarından biri olur — sayfadaki formül kafanda gerçekten bir resme dönüşür. Her sınav problemi aynı algoritmayı yürütmeye indirgenir: tanım, kesişim, simetri, asimptot, ekstremum, bükülme. Sıra otomatikleşene kadar tarifi pratik et; hiçbir rasyonel fonksiyon ya da transandantal eğri bir daha asla göz korkutucu görünmeyecek.</div>`
};
