window.LISE_MAT_L31 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far you have computed antiderivatives</strong> — functions whose derivative returns a given expression. That activity sits on the abstract side of integration: a symbol game with no obvious geometric meaning. This lesson closes the loop. We will see that the very same antiderivative computes <em>areas</em> under curves, distances travelled by moving objects, and accumulated totals of every kind. The bridge between the two ideas is one of the most celebrated results in mathematics: <strong>the Fundamental Theorem of Calculus</strong>.</p>

<p class="l-text">We build the bridge in three steps. First we attack the area problem directly, approximating curved regions with rectangles and watching what happens as the rectangles get thinner — this leads to the <em>Riemann sum</em>. Next we take a limit and call the result the <em>definite integral</em>. Finally we prove that this geometric object equals $F(b) - F(a)$ for any antiderivative $F$ — turning a hard limit problem into a one-line subtraction. That is the FTC, and by the end of this lesson you will be using it to compute integrals as fast as you can find antiderivatives.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the area problem and approximate the area under a curve using left, right, and midpoint Riemann sums</li>
<li>Define the definite integral as the limit of Riemann sums as $\\Delta x \\to 0$ and read the notation $\\int_a^b f(x)\\,dx$</li>
<li>Apply the algebraic properties of definite integrals: linearity, sign reversal, and interval splitting</li>
<li>State and apply both parts of the Fundamental Theorem of Calculus</li>
<li>Reproduce the intuitive proof of the FTC using the Mean Value Theorem and a limit argument</li>
<li>Interpret negative values of a definite integral as signed area when the curve dips below the x-axis</li>
</ul>
</div>

<h2 class="lesson-title">1. The Area Problem</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine you want to varnish the curved top of a wooden table whose edge follows the graph of $y = x^2$ from $x = 0$ to $x = 1$. Knowing the cost per square metre of varnish is useless until you know the area. Rectangles, triangles, and circles have area formulas you memorised in primary school. A region bounded by a <em>curve</em> does not. Calculus invents an answer.</div>

<p class="l-text">Take a positive continuous function $f$ on a closed interval $[a, b]$. The graph of $f$ together with the x-axis and the two vertical lines $x = a$ and $x = b$ encloses a region. Call its area $A$. The whole point of this lesson is to compute $A$ exactly, for any reasonable $f$. The strategy is older than calculus itself and goes back to Archimedes (3rd century BC):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step A — Approximate</div><div class="card-body">Slice the interval $[a, b]$ into many thin vertical strips. Each strip is almost a rectangle if the curve does not bend too much across its width.</div></div>
<div class="calc-card"><div class="card-title">Step B — Sum</div><div class="card-body">Add up the rectangle areas. You get an approximation $S_n$ of the true area $A$, with $n$ counting the number of strips.</div></div>
<div class="calc-card"><div class="card-title">Step C — Refine</div><div class="card-body">Let $n \\to \\infty$ so the strips get arbitrarily thin. If $S_n$ approaches a single number $A$, declare that number to be the area.</div></div>
</div>

<p class="l-text"><strong>Why this should work.</strong> Each rectangle's area is an honest product width $\\times$ height. As the width shrinks, the small "extra" or "missing" pieces between the rectangle top and the curve get crushed. In the limit, the total error tends to zero and only the true area survives. The next two sections turn this picture into formulas.</p>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Could you instead use triangles, trapezoids, or even general polygons to approximate the area? Yes — and people do (the trapezoidal rule, Simpson's rule). Rectangles are the simplest shape, and they are good enough for the definition. Refinements come later.</div></div>

<h2 class="lesson-title">2. Riemann Sums</h2>

<p class="l-text">Cut $[a, b]$ into $n$ equal pieces, each of width</p>

<div class="calc-formula"><div class="formula-label">UNIFORM PARTITION</div><div class="formula-main">$$\\Delta x \\;=\\; \\frac{b - a}{n}$$</div><div class="formula-sub">The partition points are $x_0 = a,\\; x_1 = a + \\Delta x,\\; x_2 = a + 2\\Delta x,\\; \\dots,\\; x_n = b$.</div></div>

<p class="l-text">On each sub-interval $[x_{i-1}, x_i]$ we pick a <em>sample point</em> $x_i^*$ and build a rectangle of height $f(x_i^*)$. The total area of these rectangles is the <strong>Riemann sum</strong>:</p>

<div class="calc-formula"><div class="formula-label">RIEMANN SUM</div><div class="formula-main">$$S_n \\;=\\; \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x$$</div><div class="formula-sub">Each term $f(x_i^*)\\,\\Delta x$ is the area of one rectangle: height times width. Bernhard Riemann formalised this construction in 1854.</div></div>

<p class="l-text">Three natural choices of sample point give three named variants:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">LEFT SUM</div><div class="compare-item">Sample point: left endpoint $x_i^* = x_{i-1}$</div><div class="compare-item">$L_n = \\sum_{i=1}^{n} f(x_{i-1})\\,\\Delta x$</div><div class="compare-item">For increasing $f$ this is the <em>under-estimate</em>.</div></div><div class="compare-col"><div class="compare-title">RIGHT SUM</div><div class="compare-item">Sample point: right endpoint $x_i^* = x_i$</div><div class="compare-item">$R_n = \\sum_{i=1}^{n} f(x_i)\\,\\Delta x$</div><div class="compare-item">For increasing $f$ this is the <em>over-estimate</em>.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MIDPOINT SUM</div><div class="compare-item">Sample point: midpoint $x_i^* = (x_{i-1}+x_i)/2$</div><div class="compare-item">$M_n = \\sum_{i=1}^{n} f\\!\\left(\\tfrac{x_{i-1}+x_i}{2}\\right)\\Delta x$</div><div class="compare-item">Usually much more accurate than either endpoint rule.</div></div><div class="compare-col"><div class="compare-title">UPPER / LOWER SUM</div><div class="compare-item">Upper $U_n$: pick the sample where $f$ is largest on each strip.</div><div class="compare-item">Lower $L_n$: pick the sample where $f$ is smallest.</div><div class="compare-item">For monotone $f$ these reduce to the right and left sums (or vice versa).</div></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RIEMANN SUM</div><div class="example-body"><strong>Estimate</strong> the area under $f(x) = x^2$ on $[0, 1]$ using a left Riemann sum with $n = 4$.<br><br>$\\Delta x = 1/4 = 0.25$. Partition points: $0,\\, 0.25,\\, 0.50,\\, 0.75,\\, 1$.<br><br>Left endpoints and heights:<br>$f(0) = 0,\\quad f(0.25) = 0.0625,\\quad f(0.50) = 0.25,\\quad f(0.75) = 0.5625$.<br><br>$L_4 = (0 + 0.0625 + 0.25 + 0.5625) \\times 0.25 = 0.875 \\times 0.25 = \\mathbf{0.21875}$.<br><br>Compare with the exact area (computed below by FTC): $A = 1/3 \\approx 0.3333$. The left sum under-estimates because $x^2$ is increasing.</div></div>

<div class="calc-graph"><div id="plot-l31-riemann-en" class="plotly-graph" style="height:520px"></div><div class="graph-caption"><strong>What this graph shows:</strong> four panels approximate the area under $y = x^2$ on $[0,1]$ with $n = 4, 8, 16, 64$ left rectangles. As $n$ grows the staircase hugs the curve more tightly and the missing triangular slivers shrink. In the limit the total area approaches the exact value $1/3$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function build(n){var dx=1/n;var bx=[];var by=[];for(var i=0;i<n;i++){var x0=i*dx;var x1=(i+1)*dx;var h=x0*x0;bx.push(x0,x0,x1,x1,x0,null);by.push(0,h,h,0,0,null);}return{x:bx,y:by,mode:'lines',fill:'toself',line:{color:'#3b82f6',width:1},fillcolor:'rgba(59,130,246,0.25)',name:'n='+n,showlegend:false};}
function sumL(n){var dx=1/n;var s=0;for(var i=0;i<n;i++){var x=i*dx;s+=x*x*dx;}return s;}
var xc=[];var yc=[];for(var i=0;i<=200;i++){var x=i/200;xc.push(x);yc.push(x*x);}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:2.5},showlegend:false};
var ns=[4,8,16,64];
var fig={data:[],layout:{paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:2,columns:2,pattern:'independent'},margin:{t:50,r:20,b:40,l:40},annotations:[]}};
for(var k=0;k<4;k++){var n=ns[k];var ax='x'+(k+1);var ay='y'+(k+1);var rect=build(n);rect.xaxis=ax;rect.yaxis=ay;var cv={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:2.5},showlegend:false,xaxis:ax,yaxis:ay};fig.data.push(rect,cv);fig.layout[ax==='x1'?'xaxis':'xaxis'+(k+1)]={range:[0,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'};fig.layout[ay==='y1'?'yaxis':'yaxis'+(k+1)]={range:[0,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'};var s=sumL(n).toFixed(4);fig.layout.annotations.push({text:'n='+n+', L<sub>n</sub>='+s,showarrow:false,xref:ax+' domain',yref:ay+' domain',x:0.5,y:1.08,font:{color:'#c8a96e',size:13}});}
Plotly.newPlot('plot-l31-riemann-en',fig.data,fig.layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Convergence in practice.</strong> For our example: $L_4 \\approx 0.219,\\; L_8 \\approx 0.273,\\; L_{16} \\approx 0.302,\\; L_{64} \\approx 0.325,\\; L_{1000} \\approx 0.3328$. The sequence creeps toward $1/3 \\approx 0.3333$ from below, exactly as we would expect from an under-estimate.</div>

<h2 class="lesson-title">3. The Definite Integral as a Limit</h2>

<p class="l-text">If the sequence $S_n$ tends to a single number $A$ no matter how we pick the sample points, we say $f$ is <strong>Riemann integrable</strong> on $[a, b]$ and define</p>

<div class="calc-formula"><div class="formula-label">DEFINITE INTEGRAL — DEFINITION</div><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x$$</div><div class="formula-sub">Whenever this limit exists and gives the same value for every choice of sample points $x_i^*$, the function $f$ is integrable on $[a, b]$ and the limit is called the definite integral from $a$ to $b$.</div></div>

<p class="l-text"><strong>Which functions are integrable?</strong> The following sufficient conditions cover everything you will meet in this course:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Continuous on $[a, b]$</div><div class="card-body">If $f$ is continuous on a closed bounded interval, the limit exists. Polynomials, $\\sin, \\cos, e^x$, $\\ln$ on its domain — all integrable.</div></div>
<div class="calc-card"><div class="card-title">Monotone on $[a, b]$</div><div class="card-body">An increasing or decreasing function (no need for continuity) is also integrable. Step functions with finitely many jumps fall here too.</div></div>
<div class="calc-card"><div class="card-title">Bounded with finitely many discontinuities</div><div class="card-body">If $f$ is bounded and has only a finite number of jump or removable discontinuities on $[a, b]$, it remains integrable.</div></div>
</div>

<div class="think-box"><div class="think-label">WHY THE LIMIT IS A NUMBER</div><div class="think-body">Cutting strips into thinner and thinner pieces only makes the rectangles a better fit. The lower sums $L_n$ rise monotonically; the upper sums $U_n$ fall monotonically; their gap $U_n - L_n$ is bounded by $(M - m)(b-a)/n$ where $m \\leq f \\leq M$, and that gap shrinks to 0. The two sequences squeeze toward the same value — and that value is the integral.</div></div>

<h2 class="lesson-title">4. Notation: $\\int_a^b f(x)\\,dx$</h2>

<p class="l-text">Leibniz invented the integral sign in 1675 as a stretched-out letter "S" standing for <em>sum</em>. Every symbol in the notation carries information:</p>

<div class="calc-formula"><div class="formula-label">ANATOMY OF $\\int_a^b f(x)\\,dx$</div><div class="formula-main">$$\\underbrace{\\int}_{\\text{integral sign}}\\!\\!\\underbrace{_a^{\\,b}}_{\\text{limits}}\\;\\;\\underbrace{f(x)}_{\\text{integrand}}\\;\\underbrace{dx}_{\\substack{\\text{differential}\\\\\\text{(variable of}\\\\\\text{integration)}}}$$</div><div class="formula-sub">Read aloud as "the integral from $a$ to $b$ of $f$ of $x$ d-x."</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lower limit $a$</div><div class="card-body">Where the integration starts. Sits at the bottom of the integral sign.</div></div>
<div class="calc-card"><div class="card-title">Upper limit $b$</div><div class="card-body">Where the integration ends. Sits at the top. By convention $a \\leq b$, though we will relax this in the next section.</div></div>
<div class="calc-card"><div class="card-title">Integrand $f(x)$</div><div class="card-body">The function being integrated. Its values become the heights of the Riemann rectangles.</div></div>
<div class="calc-card"><div class="card-title">Differential $dx$</div><div class="card-body">A formal mark of the variable of integration. Think of it as the limiting form of $\\Delta x$ — an infinitesimal width.</div></div>
</div>

<p class="l-text"><strong>Dummy variable.</strong> The letter $x$ inside the integral is local. Renaming it changes nothing:</p>

<div class="calc-formula"><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\int_a^b f(t)\\,dt \\;=\\; \\int_a^b f(u)\\,du.$$</div><div class="formula-sub">The integration variable is a placeholder; only the function $f$ and the limits $a, b$ affect the value.</div></div>

<div class="l-note"><strong>Indefinite vs. definite.</strong> The notation $\\int f(x)\\,dx$ (no limits) refers to the <em>antiderivative family</em> — a function plus a constant. The notation $\\int_a^b f(x)\\,dx$ (with limits) refers to a single <em>number</em>. The two ideas look alike on paper because the FTC, coming in section 6, will link them tightly.</div>

<h2 class="lesson-title">5. Properties of the Definite Integral</h2>

<p class="l-text">Assuming the relevant integrals exist, the definite integral satisfies a short list of algebraic rules. These follow directly from the Riemann-sum definition (each rule is an obvious property of finite sums that survives passage to the limit):</p>

<div class="calc-formula"><div class="formula-label">LINEARITY</div><div class="formula-main">$$\\int_a^b [\\alpha f(x) + \\beta g(x)]\\,dx \\;=\\; \\alpha\\int_a^b f(x)\\,dx \\;+\\; \\beta\\int_a^b g(x)\\,dx$$</div><div class="formula-sub">Constants pull out and sums split. Direct consequence of the same rules for finite sums.</div></div>

<div class="calc-formula"><div class="formula-label">SIGN REVERSAL</div><div class="formula-main">$$\\int_b^a f(x)\\,dx \\;=\\; -\\int_a^b f(x)\\,dx$$</div><div class="formula-sub">Swapping the limits flips the sign. Geometric reason: when $a > b$ we are moving backwards, so $\\Delta x$ becomes negative.</div></div>

<div class="calc-formula"><div class="formula-label">EMPTY INTERVAL</div><div class="formula-main">$$\\int_a^a f(x)\\,dx \\;=\\; 0$$</div><div class="formula-sub">An interval of zero width contains no area — formally a degenerate Riemann sum with $\\Delta x = 0$.</div></div>

<div class="calc-formula"><div class="formula-label">INTERVAL ADDITIVITY (SPLITTING)</div><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\int_a^c f(x)\\,dx \\;+\\; \\int_c^b f(x)\\,dx$$</div><div class="formula-sub">Valid for any $c$, not necessarily between $a$ and $b$. The combined sum picks up the missing piece automatically thanks to sign reversal.</div></div>

<div class="calc-formula"><div class="formula-label">COMPARISON</div><div class="formula-main">$$f(x) \\leq g(x) \\text{ on } [a,b] \\implies \\int_a^b f(x)\\,dx \\;\\leq\\; \\int_a^b g(x)\\,dx$$</div><div class="formula-sub">If the integrand $g$ is bigger pointwise, the area under $g$ is bigger too. In particular, $|\\int_a^b f| \\leq \\int_a^b |f|$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — USING PROPERTIES</div><div class="example-body"><strong>Suppose</strong> $\\int_0^2 f(x)\\,dx = 5$ and $\\int_2^5 f(x)\\,dx = 4$. Compute:<br><br>(a) $\\int_0^5 f(x)\\,dx \\;=\\; 5 + 4 = \\mathbf{9}$ (interval splitting).<br><br>(b) $\\int_5^0 f(x)\\,dx \\;=\\; -9$ (sign reversal).<br><br>(c) $\\int_0^2 [3 f(x) - 1]\\,dx \\;=\\; 3 \\cdot 5 - \\int_0^2 1\\,dx \\;=\\; 15 - 2 = \\mathbf{13}$ (linearity; $\\int_0^2 1\\,dx$ is the area of a $2 \\times 1$ rectangle).</div></div>

<h2 class="lesson-title">6. The Fundamental Theorem of Calculus — Part 1</h2>

<div class="calc-highlight"><strong>The big payoff.</strong> The Riemann-sum definition is beautiful but computationally horrible. We never want to actually take that limit by hand. The Fundamental Theorem of Calculus replaces the limit with a one-line subtraction whenever we can find an antiderivative.</div>

<div class="calc-formula"><div class="formula-label">FTC — PART 1 (EVALUATION)</div><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; F(b) - F(a)$$</div><div class="formula-sub">where $F$ is <strong>any</strong> antiderivative of $f$ on $[a, b]$ — i.e. any function with $F'(x) = f(x)$.</div></div>

<p class="l-text">A common shorthand is</p>

<div class="calc-formula"><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\bigl[F(x)\\bigr]_a^b \\;=\\; F(b) - F(a).$$</div><div class="formula-sub">The bracket notation $[F(x)]_a^b$ is read "evaluate $F$ at $b$ then subtract $F$ at $a$."</div></div>

<p class="l-text"><strong>Why "any" antiderivative works.</strong> Two antiderivatives of the same $f$ differ by a constant: if $F$ and $G$ are both antiderivatives then $G(x) = F(x) + C$. So $G(b) - G(a) = [F(b)+C] - [F(a)+C] = F(b) - F(a)$. The constant cancels in the subtraction. You may freely set $C = 0$ when applying the FTC.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIRST USE OF FTC</div><div class="example-body"><strong>Recompute</strong> $\\int_0^1 x^2\\,dx$.<br><br>An antiderivative of $x^2$ is $F(x) = x^3/3$ (check: $F'(x) = 3x^2/3 = x^2$).<br><br>$\\int_0^1 x^2\\,dx \\;=\\; F(1) - F(0) \\;=\\; \\frac{1^3}{3} - \\frac{0^3}{3} \\;=\\; \\mathbf{\\frac{1}{3}}.$<br><br>This is the exact area the Riemann sums in section 2 were creeping toward. Two lines of work replace an infinite limit.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — POLYNOMIAL</div><div class="example-body"><strong>Evaluate</strong> $\\int_1^3 (4x^3 - 2x + 5)\\,dx$.<br><br>Antiderivative term by term: $F(x) = x^4 - x^2 + 5x$.<br><br>$F(3) = 81 - 9 + 15 = 87$. &nbsp;&nbsp; $F(1) = 1 - 1 + 5 = 5$.<br><br>$\\int_1^3 (4x^3 - 2x + 5)\\,dx \\;=\\; 87 - 5 = \\mathbf{82}.$</div></div>

<h2 class="lesson-title">7. The Fundamental Theorem of Calculus — Part 2</h2>

<p class="l-text">Part 1 turns derivatives into a tool for computing integrals. Part 2 reverses the relationship: if you start with a definite integral and let one of the limits vary, you build a brand-new function whose derivative is the original integrand.</p>

<div class="calc-formula"><div class="formula-label">FTC — PART 2 (DERIVATIVE OF AN INTEGRAL)</div><div class="formula-main">$$\\frac{d}{dx}\\int_a^x f(t)\\,dt \\;=\\; f(x)$$</div><div class="formula-sub">Provided $f$ is continuous on an interval containing $a$ and $x$. The left-hand object is sometimes called the <em>accumulation function</em> $A(x) = \\int_a^x f(t)\\,dt$.</div></div>

<p class="l-text">In words: <strong>differentiation undoes integration</strong>. Building an accumulation function and then differentiating it returns the function we accumulated. Together with Part 1 (which can be rephrased as "integration undoes differentiation"), the two halves of the FTC say that $\\dfrac{d}{dx}$ and $\\displaystyle\\int$ are <em>inverse operations</em> on the space of continuous functions.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Variable inside the integral</div><div class="card-body">Always use a different letter (here $t$) than the upper limit ($x$). Mixing them is a notation error and leads to confusion.</div></div>
<div class="calc-card"><div class="card-title">Variable in the limit</div><div class="card-body">The output depends on $x$ alone. As $x$ slides right, more area is swept out — exactly $f(x)\\,dx$ extra each step.</div></div>
<div class="calc-card"><div class="card-title">Chain rule extension</div><div class="card-body">If the upper limit is itself a function $u(x)$, the chain rule gives $\\dfrac{d}{dx}\\int_a^{u(x)} f(t)\\,dt = f(u(x))\\cdot u'(x).$</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FTC PART 2</div><div class="example-body"><strong>Compute</strong> $\\dfrac{d}{dx}\\int_2^x \\cos(t^2)\\,dt$.<br><br>By FTC Part 2, the answer is just the integrand evaluated at the upper limit: $\\mathbf{\\cos(x^2)}$.<br><br>Notice how this works <em>even though</em> $\\cos(t^2)$ has no elementary antiderivative. We are not finding the integral — we are differentiating it.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — WITH CHAIN RULE</div><div class="example-body"><strong>Compute</strong> $\\dfrac{d}{dx}\\int_0^{x^2} \\sin t\\,dt$.<br><br>The upper limit is $u(x) = x^2$. Apply the chain-rule version:<br><br>$\\dfrac{d}{dx}\\int_0^{x^2} \\sin t\\,dt = \\sin(x^2) \\cdot 2x = \\mathbf{2x\\sin(x^2)}.$</div></div>

<h2 class="lesson-title">8. Why the FTC Works — An Intuitive Proof</h2>

<p class="l-text">A full $\\varepsilon$-$\\delta$ proof of the FTC needs the Mean Value Theorem for integrals. The picture, however, is clean. Define the accumulation function</p>

<div class="calc-formula"><div class="formula-main">$$A(x) \\;=\\; \\int_a^x f(t)\\,dt.$$</div></div>

<p class="l-text">Consider the change in $A$ from $x$ to $x + h$, for small $h > 0$:</p>

<div class="calc-formula"><div class="formula-main">$$A(x + h) - A(x) \\;=\\; \\int_x^{x+h} f(t)\\,dt.$$</div></div>

<p class="l-text">This is the area under $f$ between $x$ and $x+h$. The strip is very thin (width $h$), so $f$ is almost constant across it. The strip's area is approximately a rectangle of width $h$ and height $f(x)$:</p>

<div class="calc-formula"><div class="formula-main">$$A(x + h) - A(x) \\;\\approx\\; f(x) \\cdot h.$$</div></div>

<p class="l-text">Divide by $h$ and let $h \\to 0$. The left side is the derivative of $A$, the right side is $f(x)$:</p>

<div class="calc-formula"><div class="formula-main">$$A'(x) \\;=\\; \\lim_{h \\to 0} \\frac{A(x+h) - A(x)}{h} \\;=\\; f(x).$$</div><div class="formula-sub">This is FTC Part 2. The Mean Value Theorem for integrals turns the "$\\approx$" into an "=" by picking an exact intermediate height $f(c_h)$ that, by continuity, tends to $f(x)$ as $h \\to 0$.</div></div>

<p class="l-text"><strong>From Part 2 to Part 1.</strong> Since $A$ is an antiderivative of $f$, and any other antiderivative $F$ differs from $A$ by a constant, we have $F(b) - F(a) = A(b) - A(a) = \\int_a^b f(t)\\,dt - 0 = \\int_a^b f(t)\\,dt$. That is Part 1.</p>

<div class="calc-graph"><div id="plot-l31-ftc-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this graph shows:</strong> in blue, the function $f(t) = t^2 + 0.5$. The shaded region is $A(x) = \\int_0^x f(t)\\,dt$ up to a moving right boundary $x$. The thin gold strip on the right has width $h$ and height $f(x)$; its area equals $A(x+h) - A(x)$, and dividing by $h$ recovers $f(x)$. The picture is the FTC made visible.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(t){return t*t+0.5;}
var xc=[];var yc=[];for(var i=0;i<=200;i++){var t=2*i/200;xc.push(t);yc.push(f(t));}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#3b82f6',width:3},name:'f(t) = t² + 0.5'};
var xv=1.3,h=0.25;
var aX=[];var aY=[];for(var i=0;i<=100;i++){var t=xv*i/100;aX.push(t);aY.push(f(t));}aX.push(xv,0,0);aY.push(0,0,f(0));
var area={x:aX,y:aY,mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(59,130,246,0.0)'},showlegend:false,name:'A(x)'};
var sX=[xv,xv,xv+h,xv+h,xv];var sY=[0,f(xv),f(xv),0,0];
var strip={x:sX,y:sY,mode:'lines',fill:'toself',fillcolor:'rgba(200,169,110,0.55)',line:{color:'#c8a96e',width:1.5},name:'strip ≈ f(x)·h'};
var marker={x:[xv],y:[f(xv)],mode:'markers+text',marker:{size:10,color:'#c8a96e'},text:['f(x)'],textposition:'top right',textfont:{color:'#c8a96e',size:13},showlegend:false};
var ann=[{x:xv*0.5,y:f(xv*0.5)*0.4,text:'A(x) = area so far',showarrow:false,font:{color:'#e8e8e8',size:13}},{x:xv+h*0.5,y:-0.25,text:'h',showarrow:false,font:{color:'#c8a96e',size:14}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t',range:[0,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(t)',range:[-0.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},annotations:ann,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l31-ftc-en',[area,strip,curve,marker],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Worked Examples</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 9.1 — POWER FUNCTION</div><div class="example-body"><strong>Evaluate</strong> $\\displaystyle\\int_0^1 x^2\\,dx$.<br><br>Antiderivative: $F(x) = x^3/3$.<br><br>$F(1) - F(0) = 1/3 - 0 = \\mathbf{1/3}.$<br><br>Geometric meaning: the area under the parabola $y = x^2$ from 0 to 1 equals exactly $1/3$ — a result Archimedes proved 2200 years before calculus existed, using a tour-de-force exhaustion argument. Calculus reduces it to three lines.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 9.2 — SINE FUNCTION</div><div class="example-body"><strong>Evaluate</strong> $\\displaystyle\\int_0^{\\pi} \\sin x\\,dx$.<br><br>Antiderivative: $F(x) = -\\cos x$ (check: $(-\\cos x)' = \\sin x$).<br><br>$F(\\pi) - F(0) = -\\cos\\pi - (-\\cos 0) = -(-1) - (-1) = 1 + 1 = \\mathbf{2}.$<br><br>The full bump of the sine curve over half a period encloses an area of exactly 2 square units. A surprising whole number from a transcendental function.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 9.3 — RECIPROCAL FUNCTION</div><div class="example-body"><strong>Evaluate</strong> $\\displaystyle\\int_1^{e} \\frac{1}{x}\\,dx$.<br><br>Antiderivative: $F(x) = \\ln x$ (defined for $x > 0$; check $(\\ln x)' = 1/x$).<br><br>$F(e) - F(1) = \\ln e - \\ln 1 = 1 - 0 = \\mathbf{1}.$<br><br>This is one of the cleanest connections in mathematics: the area under $y = 1/x$ from 1 to $e$ is exactly 1. The number $e$ is, in some sense, <em>defined</em> by this property.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 9.4 — POLYNOMIAL ON A NON-TRIVIAL INTERVAL</div><div class="example-body"><strong>Evaluate</strong> $\\displaystyle\\int_{-1}^{2} (3x^2 - 2x)\\,dx$.<br><br>Antiderivative: $F(x) = x^3 - x^2$.<br><br>$F(2) = 8 - 4 = 4$. &nbsp;&nbsp; $F(-1) = -1 - 1 = -2$.<br><br>$\\int_{-1}^{2}(3x^2 - 2x)\\,dx = 4 - (-2) = \\mathbf{6}.$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 9.5 — EXPONENTIAL</div><div class="example-body"><strong>Evaluate</strong> $\\displaystyle\\int_0^{\\ln 2} e^x\\,dx$.<br><br>Antiderivative: $F(x) = e^x$.<br><br>$F(\\ln 2) - F(0) = e^{\\ln 2} - e^0 = 2 - 1 = \\mathbf{1}.$</div></div>

<h2 class="lesson-title">10. Negative Areas (Signed Area)</h2>

<div class="calc-highlight"><strong>Sign matters.</strong> The Riemann rectangles have height $f(x_i^*)$. When the curve is below the x-axis the height is negative, so the rectangle contributes a <em>negative</em> term to the sum. The definite integral therefore measures <strong>signed area</strong>: positive above the axis, negative below.</div>

<p class="l-text">Concretely: if you want the <em>geometric area</em> (always non-negative) between the curve and the x-axis you must split the integral at every zero of $f$ and add the absolute values of the pieces. The definite integral by itself can hide cancellations.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SIGNED AREA</div><div class="example-body"><strong>Compute</strong> $\\displaystyle\\int_{-\\pi}^{\\pi} \\sin x\\,dx$.<br><br>Antiderivative: $F(x) = -\\cos x$.<br><br>$F(\\pi) - F(-\\pi) = -\\cos\\pi + \\cos(-\\pi) = -(-1) + (-1) = 1 - 1 = \\mathbf{0}.$<br><br>The negative half on $[-\\pi, 0]$ exactly cancels the positive half on $[0, \\pi]$. The signed area is 0, although the geometric area is $\\int_0^\\pi \\sin x\\,dx \\cdot 2 = 4$.</div></div>

<div class="calc-graph"><div id="plot-l31-signed-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this graph shows:</strong> the function $\\sin x$ on $[-\\pi, \\pi]$. The red region on the left has area 2 but contributes $-2$ to the integral; the blue region on the right contributes $+2$. They cancel exactly. The total signed area is 0; the total geometric area is 4.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xc=[];var yc=[];for(var i=0;i<=300;i++){var x=-Math.PI+2*Math.PI*i/300;xc.push(x);yc.push(Math.sin(x));}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:2.5},name:'sin x'};
var aXp=[];var aYp=[];for(var i=0;i<=150;i++){var x=Math.PI*i/150;aXp.push(x);aYp.push(Math.sin(x));}aXp.push(Math.PI,0);aYp.push(0,0);
var areaP={x:aXp,y:aYp,mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.30)',line:{color:'rgba(0,0,0,0)'},name:'+2 area'};
var aXn=[];var aYn=[];for(var i=0;i<=150;i++){var x=-Math.PI+Math.PI*i/150;aXn.push(x);aYn.push(Math.sin(x));}aXn.push(0,-Math.PI);aYn.push(0,0);
var areaN={x:aXn,y:aYn,mode:'lines',fill:'toself',fillcolor:'rgba(239,68,68,0.30)',line:{color:'rgba(0,0,0,0)'},name:'−2 area'};
var ann=[{x:Math.PI/2,y:0.55,text:'+2',showarrow:false,font:{color:'#3b82f6',size:18}},{x:-Math.PI/2,y:-0.55,text:'−2',showarrow:false,font:{color:'#ef4444',size:18}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-Math.PI-0.2,Math.PI+0.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.4)'},yaxis:{title:'sin x',range:[-1.2,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.4)'},annotations:ann,margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l31-signed-en',[areaN,areaP,curve],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Rule of thumb.</strong> If a question asks for the <em>integral</em>, the answer is signed and you compute $F(b) - F(a)$ directly. If a question asks for the <em>geometric area</em>, you must split at every root of $f$ in $[a, b]$, integrate each subinterval, and sum the absolute values.</div>

<h2 class="lesson-title">11. Classical Exercises</h2>

<p class="l-text">Try each problem on your own first, then check your work.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1</div><div class="card-body">Evaluate $\\displaystyle\\int_0^2 (x^3 + 1)\\,dx$.<br><br><em>Hint:</em> antiderivative $x^4/4 + x$.<br><strong>Answer:</strong> $4 + 2 - 0 = 6$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2</div><div class="card-body">Evaluate $\\displaystyle\\int_1^4 \\sqrt{x}\\,dx$.<br><br><em>Hint:</em> $\\sqrt{x} = x^{1/2}$; antiderivative $\\tfrac{2}{3}x^{3/2}$.<br><strong>Answer:</strong> $\\tfrac{2}{3}(8 - 1) = 14/3$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3</div><div class="card-body">Evaluate $\\displaystyle\\int_0^{\\pi/2} \\cos x\\,dx$.<br><br><em>Hint:</em> antiderivative $\\sin x$.<br><strong>Answer:</strong> $\\sin(\\pi/2) - \\sin 0 = 1$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4</div><div class="card-body">Approximate $\\displaystyle\\int_0^1 (1 - x^2)\\,dx$ with a left Riemann sum, $n = 4$.<br><br><em>Hint:</em> heights $1, 0.9375, 0.75, 0.4375$; width $0.25$.<br><strong>Answer:</strong> $L_4 = 0.78125$. (Exact: $2/3 \\approx 0.6667$.)</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 5</div><div class="card-body">Evaluate $\\displaystyle\\int_{-2}^{2} x^3\\,dx$.<br><br><em>Hint:</em> antiderivative $x^4/4$. Notice $x^3$ is an odd function.<br><strong>Answer:</strong> $4 - 4 = 0$ (signed area cancels).</div></div>
<div class="calc-card"><div class="card-title">Problem 6</div><div class="card-body">Compute $\\dfrac{d}{dx}\\displaystyle\\int_0^x \\sqrt{1 + t^4}\\,dt$.<br><br><em>Hint:</em> FTC Part 2 — just substitute $x$ for $t$.<br><strong>Answer:</strong> $\\sqrt{1 + x^4}$.</div></div>
<div class="calc-card"><div class="card-title">Problem 7</div><div class="card-body">Evaluate $\\displaystyle\\int_1^{e^2} \\frac{1}{x}\\,dx$.<br><br><em>Hint:</em> antiderivative $\\ln x$.<br><strong>Answer:</strong> $\\ln(e^2) - \\ln 1 = 2$.</div></div>
<div class="calc-card"><div class="card-title">Problem 8</div><div class="card-body">Compute the geometric area between $y = x^2 - 1$ and the x-axis on $[-2, 2]$.<br><br><em>Hint:</em> roots at $x = \\pm 1$. Split into three pieces.<br><strong>Answer:</strong> $\\int_{-2}^{-1}(x^2 - 1)\\,dx + \\bigl|\\int_{-1}^{1}(x^2 - 1)\\,dx\\bigr| + \\int_{1}^{2}(x^2 - 1)\\,dx = \\tfrac{4}{3} + \\tfrac{4}{3} + \\tfrac{4}{3} = 4$.</div></div>
</div>

<h2 class="lesson-title">12. Convergence of the Riemann Sum</h2>

<p class="l-text">Below we put four left-Riemann approximations to $\\displaystyle\\int_0^2 \\sin x\\,dx$ on the same axes: $n = 4, 8, 16, 32$ rectangles. The exact value is $-\\cos 2 + \\cos 0 = 1 - \\cos 2 \\approx 1.4161$. Watch the staircase squeeze toward the curve as $n$ doubles — every doubling roughly halves the error, exactly the linear convergence the left-rule guarantees.</p>

<div class="calc-graph"><div id="plot-l31-converge-en-extra" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this graph shows:</strong> the curve $y = \\sin x$ on $[0, 2]$ (white) with shaded exact area underneath. Four overlaid sets of rectangles — drawn from lightest to darkest blue as $n$ grows — approximate the area with $n = 4, 8, 16, 32$ left rectangles. The numerical sums shown in the legend converge to the exact value $1 - \\cos 2 \\approx 1.4161$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return Math.sin(x);}
var a=0,b=2;
var xc=[];var yc=[];for(var i=0;i<=300;i++){var x=a+(b-a)*i/300;xc.push(x);yc.push(f(x));}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:3},name:'y = sin x',showlegend:true};
var aX=xc.slice();var aY=yc.slice();aX.push(b,a);aY.push(0,0);
var area={x:aX,y:aY,mode:'lines',fill:'toself',fillcolor:'rgba(255,255,255,0.05)',line:{color:'rgba(0,0,0,0)'},name:'exact area ≈ 1.4161',showlegend:true};
function rects(n,color,opacity){var dx=(b-a)/n;var bx=[];var by=[];var s=0;for(var i=0;i<n;i++){var x0=a+i*dx;var x1=x0+dx;var h=f(x0);s+=h*dx;bx.push(x0,x0,x1,x1,x0,null);by.push(0,h,h,0,0,null);}return{trace:{x:bx,y:by,mode:'lines',fill:'toself',line:{color:color,width:1},fillcolor:'rgba('+opacity+')',name:'n='+n+', L<sub>n</sub>='+s.toFixed(4),showlegend:true},sum:s};}
var r4=rects(4,'#1e3a8a','30,58,138,0.22');
var r8=rects(8,'#1d4ed8','29,78,216,0.20');
var r16=rects(16,'#3b82f6','59,130,246,0.18');
var r32=rects(32,'#60a5fa','96,165,250,0.16');
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[a-0.05,b+0.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},yaxis:{title:'sin x',range:[0,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:-0.22,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l31-converge-en-extra',[area,r4.trace,r8.trace,r16.trace,r32.trace,curve],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">A short table tracks the convergence numerically. Notice how the absolute error roughly halves on each row — this $O(1/n)$ behaviour is characteristic of the left/right rule. The midpoint rule, by contrast, would deliver $O(1/n^2)$.</p>

<div style="overflow-x:auto;margin:1.5rem 0">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead><tr style="background:#3b82f6;color:#0a0a0a"><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">n</th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">L<sub>n</sub></th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">Error |L<sub>n</sub> − 1.4161|</th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">Ratio to previous</th></tr></thead>
<tbody>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">4</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.0682</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.3479</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">—</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">8</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.2461</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.1700</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.489</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">16</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.3322</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.0840</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.494</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">32</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.3743</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.0418</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.498</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1000</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.4148</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.0013</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">≈ 0.5 per doubling</td></tr>
<tr style="background:rgba(59,130,246,0.10)"><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">∞ (exact)</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">1 − cos 2 ≈ 1.4161</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">0</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">FTC</td></tr>
</tbody></table>
</div>

<h2 class="lesson-title">13. Properties of the Definite Integral — Summary Table</h2>

<p class="l-text">A consolidated reference card for the algebraic identities of the definite integral, together with both halves of the FTC and the average-value formula. Each row is a tool you should be able to apply without re-deriving.</p>

<div style="overflow-x:auto;margin:1.5rem 0">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead><tr style="background:#3b82f6;color:#0a0a0a"><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em;width:32%">Property</th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">Formula</th></tr></thead>
<tbody>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Empty interval</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^a f(x)\\,dx = 0$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Sign reversal</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Linearity</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b [c f(x) + g(x)]\\,dx = c\\int_a^b f(x)\\,dx + \\int_a^b g(x)\\,dx$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Interval additivity</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Comparison</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$f \\leq g$ on $[a,b]$ $\\implies$ $\\displaystyle\\int_a^b f \\leq \\int_a^b g$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">FTC Part 1 (evaluation)</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a),\\;\\; F'=f$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">FTC Part 2 (derivative of integral)</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Average value</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\bar{f} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx$</td></tr>
<tr style="background:rgba(59,130,246,0.10)"><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Constant integrand</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">$\\displaystyle\\int_a^b c\\,dx = c(b - a)$</td></tr>
</tbody></table>
</div>

<div class="think-box"><div class="think-label">LOOKING AHEAD</div><div class="think-body">Every definite integral you will meet in physics (work, displacement, mass, centre of mass), in economics (consumer surplus, total revenue), and in statistics (probability, expected value) is computed by exactly the same recipe: find an antiderivative, plug in the endpoints, subtract. The FTC is the engine of applied calculus.</div></div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şimdiye kadar ters türev (antiderivative) hesapladınız</strong> — yani türevi verilen ifadeyi veren fonksiyonlar. Bu, integralin soyut yüzüydü: belirgin bir geometrik anlamı olmayan bir sembol oyunu. Bu ders o boşluğu kapatır. Aynı ters türevin <em>eğri altındaki alanları</em>, hareketli cisimlerin aldığı yolu ve her türden birikmiş toplamı hesapladığını göreceğiz. İki fikri birbirine bağlayan köprü, matematiğin en ünlü sonuçlarından biridir: <strong>Analizin Temel Teoremi (FTC)</strong>.</p>

<p class="l-text">Köprüyü üç adımda kuruyoruz. Önce alan problemine doğrudan saldırırız: eğri bölgeleri dikdörtgenlerle yaklaştırır ve dikdörtgenler inceldikçe ne olduğuna bakarız — buradan <em>Riemann toplamı</em> çıkar. Sonra limit alıp sonuca <em>belirli integral</em> deriz. Son olarak bu geometrik nesnenin herhangi bir ters türev $F$ için $F(b) - F(a)$ değerine eşit olduğunu ispatlarız — böylece zor bir limit problemi tek satırlık bir çıkarmaya dönüşür. Bu FTC'dir; dersin sonunda integralleri ters türev bulabildiğiniz kadar hızlı hesaplıyor olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Alan problemini tanımlayıp bir eğri altındaki alanı sol, sağ ve orta nokta Riemann toplamlarıyla yaklaşık hesaplamak</li>
<li>Belirli integrali $\\Delta x \\to 0$ iken Riemann toplamlarının limiti olarak tanımlamak ve $\\int_a^b f(x)\\,dx$ notasyonunu okumak</li>
<li>Belirli integralin cebirsel özelliklerini uygulamak: doğrusallık, işaret değişimi ve aralık birleştirme</li>
<li>Analizin Temel Teoreminin her iki kısmını ifade etmek ve uygulamak</li>
<li>Ortalama Değer Teoremi ve limit argümanı ile FTC'nin sezgisel ispatını yeniden üretmek</li>
<li>Belirli integralin negatif değerlerini, eğri x-ekseninin altına indiğinde işaretli alan olarak yorumlamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Alan Hesabı Problemi</h2>

<div class="calc-highlight"><strong>Günlük örnek:</strong> $y = x^2$ eğrisinin $x = 0$ ile $x = 1$ arasında kenarını oluşturduğu, eğri yüzlü bir ahşap masanın üstünü cilalamak istiyorsunuz. Metrekare başına cila maliyetini bilmek, alanı bilmedikçe işe yaramaz. Dikdörtgen, üçgen ve daire için ilkokulda ezberlediğiniz alan formülleri vardır. <em>Eğri</em> ile sınırlı bir bölge için ise yok. Kalkülüs bir cevap icat eder.</div>

<p class="l-text">Kapalı bir $[a, b]$ aralığında pozitif sürekli bir $f$ fonksiyonu alın. $f$'nin grafiği, x-ekseni ve $x = a$ ile $x = b$ dikey doğruları bir bölgeyi çevreler. Bu bölgenin alanına $A$ diyelim. Bu dersin tüm amacı, makul her $f$ için $A$'yı tam olarak hesaplamaktır. Strateji kalkülüsten daha eskidir ve Arşimet'e (MÖ 3. yüzyıl) kadar uzanır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A — Yaklaşım</div><div class="card-body">$[a, b]$ aralığını çok sayıda ince dikey şeride bölün. Eğri şeridin genişliği boyunca fazla bükülmüyorsa, her şerit neredeyse bir dikdörtgendir.</div></div>
<div class="calc-card"><div class="card-title">B — Toplam</div><div class="card-body">Dikdörtgen alanlarını toplayın. Gerçek alan $A$ için bir $S_n$ yaklaşımı elde edersiniz; burada $n$ şerit sayısıdır.</div></div>
<div class="calc-card"><div class="card-title">C — İyileştirme</div><div class="card-body">$n \\to \\infty$ yapın, böylece şeritler keyfi olarak incelir. Eğer $S_n$ tek bir $A$ sayısına yaklaşırsa, o sayıyı alan olarak ilan edin.</div></div>
</div>

<p class="l-text"><strong>Bu neden çalışmalı?</strong> Her dikdörtgenin alanı, namuslu bir genişlik $\\times$ yükseklik çarpımıdır. Genişlik küçüldükçe, dikdörtgenin tepesi ile eğri arasındaki "fazlalık" ya da "eksiklik" parçaları ezilir. Limitte toplam hata sıfıra gider ve geriye sadece gerçek alan kalır. Sonraki iki bölüm bu resmi formüllere çevirir.</p>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Dikdörtgen yerine üçgen, yamuk ya da daha genel çokgenler de kullanabilir miydiniz? Evet — ve kullanılıyor (yamuk kuralı, Simpson kuralı). Dikdörtgen en basit şekildir ve tanım için yeterlidir. İyileştirmeler sonra gelir.</div></div>

<h2 class="lesson-title">2. Riemann Toplamı</h2>

<p class="l-text">$[a, b]$ aralığını her biri</p>

<div class="calc-formula"><div class="formula-label">DÜZGÜN BÖLÜNTÜ</div><div class="formula-main">$$\\Delta x \\;=\\; \\frac{b - a}{n}$$</div><div class="formula-sub">genişlikte $n$ eşit parçaya bölün. Bölüntü noktaları $x_0 = a,\\; x_1 = a + \\Delta x,\\; \\dots,\\; x_n = b$.</div></div>

<p class="l-text">Her $[x_{i-1}, x_i]$ alt aralığında bir <em>örnek nokta</em> $x_i^*$ seçer ve yüksekliği $f(x_i^*)$ olan bir dikdörtgen kurarız. Bu dikdörtgenlerin toplam alanı <strong>Riemann toplamı</strong>dır:</p>

<div class="calc-formula"><div class="formula-label">RIEMANN TOPLAMI</div><div class="formula-main">$$S_n \\;=\\; \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x$$</div><div class="formula-sub">Her $f(x_i^*)\\,\\Delta x$ terimi bir dikdörtgenin alanıdır: yükseklik çarpı genişlik. Bernhard Riemann bu yapıyı 1854'te biçimlendirdi.</div></div>

<p class="l-text">Üç doğal örnek noktası seçimi, adlandırılmış üç varyant verir:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SOL TOPLAM</div><div class="compare-item">Örnek nokta: sol uç $x_i^* = x_{i-1}$</div><div class="compare-item">$L_n = \\sum_{i=1}^{n} f(x_{i-1})\\,\\Delta x$</div><div class="compare-item">Artan $f$ için bu <em>eksik tahmin</em>dir.</div></div><div class="compare-col"><div class="compare-title">SAĞ TOPLAM</div><div class="compare-item">Örnek nokta: sağ uç $x_i^* = x_i$</div><div class="compare-item">$R_n = \\sum_{i=1}^{n} f(x_i)\\,\\Delta x$</div><div class="compare-item">Artan $f$ için bu <em>fazla tahmin</em>dir.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ORTA NOKTA TOPLAMI</div><div class="compare-item">Örnek nokta: orta nokta $x_i^* = (x_{i-1}+x_i)/2$</div><div class="compare-item">$M_n = \\sum_{i=1}^{n} f\\!\\left(\\tfrac{x_{i-1}+x_i}{2}\\right)\\Delta x$</div><div class="compare-item">Genelde uç kuralların ikisinden de çok daha doğrudur.</div></div><div class="compare-col"><div class="compare-title">ÜST / ALT TOPLAM</div><div class="compare-item">Üst $U_n$: her şeritte $f$'nin en büyük olduğu örneği seç.</div><div class="compare-item">Alt $L_n$: $f$'nin en küçük olduğu örneği seç.</div><div class="compare-item">Monoton $f$ için bunlar sağ/sol toplama indirgenir.</div></div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — RIEMANN TOPLAMI</div><div class="example-body"><strong>Tahmin edin:</strong> $f(x) = x^2$ fonksiyonunun $[0, 1]$ üzerindeki alanını $n = 4$ ile sol Riemann toplamı kullanarak.<br><br>$\\Delta x = 1/4 = 0.25$. Bölüntü noktaları: $0,\\, 0.25,\\, 0.50,\\, 0.75,\\, 1$.<br><br>Sol uçlar ve yükseklikler:<br>$f(0) = 0,\\quad f(0.25) = 0.0625,\\quad f(0.50) = 0.25,\\quad f(0.75) = 0.5625$.<br><br>$L_4 = (0 + 0.0625 + 0.25 + 0.5625) \\times 0.25 = 0.875 \\times 0.25 = \\mathbf{0.21875}$.<br><br>FTC ile aşağıda hesaplanan kesin alanla karşılaştırın: $A = 1/3 \\approx 0.3333$. $x^2$ artan olduğundan sol toplam eksik tahmin verir.</div></div>

<div class="calc-graph"><div id="plot-l31-riemann-tr" class="plotly-graph" style="height:520px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Dört panel, $y = x^2$ fonksiyonunun $[0,1]$ üzerindeki alanını $n = 4, 8, 16, 64$ sol dikdörtgenle yaklaştırır. $n$ büyüdükçe basamaklar eğriye daha sıkı sarılır ve eksik üçgen parçacıkları küçülür. Limitte toplam alan tam değer olan $1/3$'e yaklaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function build(n){var dx=1/n;var bx=[];var by=[];for(var i=0;i<n;i++){var x0=i*dx;var x1=(i+1)*dx;var h=x0*x0;bx.push(x0,x0,x1,x1,x0,null);by.push(0,h,h,0,0,null);}return{x:bx,y:by,mode:'lines',fill:'toself',line:{color:'#3b82f6',width:1},fillcolor:'rgba(59,130,246,0.25)',name:'n='+n,showlegend:false};}
function sumL(n){var dx=1/n;var s=0;for(var i=0;i<n;i++){var x=i*dx;s+=x*x*dx;}return s;}
var xc=[];var yc=[];for(var i=0;i<=200;i++){var x=i/200;xc.push(x);yc.push(x*x);}
var ns=[4,8,16,64];
var fig={data:[],layout:{paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:2,columns:2,pattern:'independent'},margin:{t:50,r:20,b:40,l:40},annotations:[]}};
for(var k=0;k<4;k++){var n=ns[k];var ax='x'+(k+1);var ay='y'+(k+1);var rect=build(n);rect.xaxis=ax;rect.yaxis=ay;var cv={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:2.5},showlegend:false,xaxis:ax,yaxis:ay};fig.data.push(rect,cv);fig.layout[ax==='x1'?'xaxis':'xaxis'+(k+1)]={range:[0,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'};fig.layout[ay==='y1'?'yaxis':'yaxis'+(k+1)]={range:[0,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'};var s=sumL(n).toFixed(4);fig.layout.annotations.push({text:'n='+n+', L<sub>n</sub>='+s,showarrow:false,xref:ax+' domain',yref:ay+' domain',x:0.5,y:1.08,font:{color:'#c8a96e',size:13}});}
Plotly.newPlot('plot-l31-riemann-tr',fig.data,fig.layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pratikte yakınsama.</strong> Bu örnek için: $L_4 \\approx 0.219,\\; L_8 \\approx 0.273,\\; L_{16} \\approx 0.302,\\; L_{64} \\approx 0.325,\\; L_{1000} \\approx 0.3328$. Dizi $1/3 \\approx 0.3333$ değerine alttan tırmanır — eksik tahminden tam olarak beklediğimiz davranış.</div>

<h2 class="lesson-title">3. Limit Olarak Belirli İntegral</h2>

<p class="l-text">$S_n$ dizisi, örnek noktaları nasıl seçersek seçelim tek bir $A$ sayısına gidiyorsa, $f$'ye $[a, b]$ üzerinde <strong>Riemann integrallenebilir</strong> der ve şu tanımı yaparız:</p>

<div class="calc-formula"><div class="formula-label">BELİRLİ İNTEGRAL — TANIM</div><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x$$</div><div class="formula-sub">Bu limit her örnek nokta seçimi için var ve aynı değeri veriyorsa, $f$ fonksiyonu $[a, b]$ üzerinde integrallenebilirdir ve limit $a$'dan $b$'ye belirli integral olarak adlandırılır.</div></div>

<p class="l-text"><strong>Hangi fonksiyonlar integrallenebilir?</strong> Aşağıdaki yeter koşullar bu derste karşılaşacağınız her şeyi kapsar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$[a, b]$ üzerinde sürekli</div><div class="card-body">Kapalı ve sınırlı bir aralık üzerinde sürekli $f$ için limit vardır. Polinomlar, $\\sin, \\cos, e^x$, tanım kümesinde $\\ln$ — hepsi integrallenebilir.</div></div>
<div class="calc-card"><div class="card-title">$[a, b]$ üzerinde monoton</div><div class="card-body">Artan ya da azalan bir fonksiyon (sürekliliğe gerek yok) da integrallenebilir. Sonlu sayıda sıçramalı basamak fonksiyonları da buraya girer.</div></div>
<div class="calc-card"><div class="card-title">Sonlu sayıda süreksizlikle sınırlı</div><div class="card-body">$f$ sınırlı ve $[a, b]$ üzerinde yalnızca sonlu sayıda sıçrama ya da kaldırılabilir süreksizliğe sahipse, yine integrallenebilirdir.</div></div>
</div>

<div class="think-box"><div class="think-label">LİMİT NEDEN BİR SAYIYA YAKINSAR</div><div class="think-body">Şeritleri daha da inceltmek sadece dikdörtgen uyumunu iyileştirir. Alt toplamlar $L_n$ monoton biçimde yükselir; üst toplamlar $U_n$ monoton biçimde düşer; aralarındaki fark $U_n - L_n$ ise $(M - m)(b-a)/n$ ile sınırlıdır ($m \\leq f \\leq M$) ve 0'a iner. İki dizi aynı değere doğru sıkışır — o değer integraldir.</div></div>

<h2 class="lesson-title">4. $\\int_a^b f(x)\\,dx$ Notasyonu</h2>

<p class="l-text">Leibniz integral işaretini 1675'te <em>toplam</em> anlamına gelen "S" harfinin uzatılmış hali olarak icat etti. Notasyonun her sembolü bilgi taşır:</p>

<div class="calc-formula"><div class="formula-label">$\\int_a^b f(x)\\,dx$ ANATOMİSİ</div><div class="formula-main">$$\\underbrace{\\int}_{\\text{integral işareti}}\\!\\!\\underbrace{_a^{\\,b}}_{\\text{sınırlar}}\\;\\;\\underbrace{f(x)}_{\\text{integrand}}\\;\\underbrace{dx}_{\\substack{\\text{diferansiyel}\\\\\\text{(integrasyon}\\\\\\text{değişkeni)}}}$$</div><div class="formula-sub">"$a$'dan $b$'ye $f$ of $x$ d-x integrali" diye okunur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Alt sınır $a$</div><div class="card-body">İntegrasyonun başladığı yer. İntegral işaretinin altında.</div></div>
<div class="calc-card"><div class="card-title">Üst sınır $b$</div><div class="card-body">İntegrasyonun bittiği yer. İntegral işaretinin üstünde. Genelde $a \\leq b$, ama sonraki bölümde bu koşulu gevşeteceğiz.</div></div>
<div class="calc-card"><div class="card-title">İntegrand $f(x)$</div><div class="card-body">İntegrali alınan fonksiyon. Değerleri Riemann dikdörtgenlerinin yüksekliklerini verir.</div></div>
<div class="calc-card"><div class="card-title">Diferansiyel $dx$</div><div class="card-body">İntegrasyon değişkeninin resmi işareti. $\\Delta x$'in limit hali — sonsuz küçük bir genişlik olarak düşünün.</div></div>
</div>

<p class="l-text"><strong>Sözde değişken (dummy variable).</strong> İntegralin içindeki $x$ harfi yereldir. Adını değiştirmek bir şey değiştirmez:</p>

<div class="calc-formula"><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\int_a^b f(t)\\,dt \\;=\\; \\int_a^b f(u)\\,du.$$</div><div class="formula-sub">İntegrasyon değişkeni bir tutucudur; değere yalnızca $f$ fonksiyonu ve $a, b$ sınırları etki eder.</div></div>

<div class="l-note"><strong>Belirsiz vs belirli.</strong> $\\int f(x)\\,dx$ notasyonu (sınırsız) <em>ters türev ailesi</em>ne — fonksiyon artı bir sabit — atıfta bulunur. $\\int_a^b f(x)\\,dx$ notasyonu (sınırlı) tek bir <em>sayı</em>ya atıfta bulunur. Kâğıt üstünde benzer görünmelerinin nedeni, bölüm 6'da gelecek FTC'nin bu iki fikri sıkıca birbirine bağlayacak olmasıdır.</div>

<h2 class="lesson-title">5. Belirli İntegralin Özellikleri</h2>

<p class="l-text">İlgili integrallerin var olduğunu varsayarak, belirli integral kısa bir cebirsel kurallar listesini sağlar. Bu kurallar Riemann-toplam tanımından doğrudan çıkar (her kural, sonlu toplamların aşikâr bir özelliğidir ve limite geçildiğinde korunur):</p>

<div class="calc-formula"><div class="formula-label">DOĞRUSALLIK</div><div class="formula-main">$$\\int_a^b [\\alpha f(x) + \\beta g(x)]\\,dx \\;=\\; \\alpha\\int_a^b f(x)\\,dx \\;+\\; \\beta\\int_a^b g(x)\\,dx$$</div><div class="formula-sub">Sabitler dışarı çıkar, toplamlar ayrılır. Aynı kuralların sonlu toplamlarda da geçerli olmasının doğrudan sonucu.</div></div>

<div class="calc-formula"><div class="formula-label">İŞARET DEĞİŞİMİ</div><div class="formula-main">$$\\int_b^a f(x)\\,dx \\;=\\; -\\int_a^b f(x)\\,dx$$</div><div class="formula-sub">Sınırların yer değiştirmesi işareti döndürür. Geometrik neden: $a > b$ iken geriye gidiyoruz, dolayısıyla $\\Delta x$ negatif olur.</div></div>

<div class="calc-formula"><div class="formula-label">BOŞ ARALIK</div><div class="formula-main">$$\\int_a^a f(x)\\,dx \\;=\\; 0$$</div><div class="formula-sub">Sıfır genişlikli bir aralık alan içermez — biçimsel olarak $\\Delta x = 0$ olan dejenere bir Riemann toplamı.</div></div>

<div class="calc-formula"><div class="formula-label">ARALIK TOPLAMSALLIĞI (BİRLEŞTİRME)</div><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\int_a^c f(x)\\,dx \\;+\\; \\int_c^b f(x)\\,dx$$</div><div class="formula-sub">$c$ herhangi bir noktada — $a$ ve $b$ arasında olmak zorunda değil. İşaret değişimi sayesinde eksik kalan parçayı kombine toplam otomatik olarak toparlar.</div></div>

<div class="calc-formula"><div class="formula-label">KARŞILAŞTIRMA</div><div class="formula-main">$$f(x) \\leq g(x) \\text{ ([a,b]'de) } \\implies \\int_a^b f(x)\\,dx \\;\\leq\\; \\int_a^b g(x)\\,dx$$</div><div class="formula-sub">İntegrand $g$ noktasal olarak büyükse, $g$ altındaki alan da büyüktür. Özellikle $|\\int_a^b f| \\leq \\int_a^b |f|$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÖZELLİKLERİ KULLANMA</div><div class="example-body"><strong>Varsayalım:</strong> $\\int_0^2 f(x)\\,dx = 5$ ve $\\int_2^5 f(x)\\,dx = 4$. Hesaplayın:<br><br>(a) $\\int_0^5 f(x)\\,dx \\;=\\; 5 + 4 = \\mathbf{9}$ (aralık birleştirme).<br><br>(b) $\\int_5^0 f(x)\\,dx \\;=\\; -9$ (işaret değişimi).<br><br>(c) $\\int_0^2 [3 f(x) - 1]\\,dx \\;=\\; 3 \\cdot 5 - \\int_0^2 1\\,dx \\;=\\; 15 - 2 = \\mathbf{13}$ (doğrusallık; $\\int_0^2 1\\,dx$ bir $2 \\times 1$ dikdörtgenin alanıdır).</div></div>

<h2 class="lesson-title">6. Analizin Temel Teoremi — Kısım 1</h2>

<div class="calc-highlight"><strong>Büyük ödül.</strong> Riemann-toplam tanımı güzeldir ama hesaplama açısından korkunçtur. O limiti elle almak hiç istemeyiz. Analizin Temel Teoremi, bir ters türev bulabildiğimiz her durumda limiti tek satırlık bir çıkarma ile değiştirir.</div>

<div class="calc-formula"><div class="formula-label">FTC — KISIM 1 (DEĞERLENDİRME)</div><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; F(b) - F(a)$$</div><div class="formula-sub">burada $F$, $[a, b]$ üzerinde $f$'nin <strong>herhangi</strong> bir ters türevidir — yani $F'(x) = f(x)$ sağlayan herhangi bir fonksiyon.</div></div>

<p class="l-text">Yaygın bir kısaltma şudur:</p>

<div class="calc-formula"><div class="formula-main">$$\\int_a^b f(x)\\,dx \\;=\\; \\bigl[F(x)\\bigr]_a^b \\;=\\; F(b) - F(a).$$</div><div class="formula-sub">$[F(x)]_a^b$ köşeli parantez notasyonu "$F$'yi $b$'de değerlendir, sonra $F$'yi $a$'da çıkar" diye okunur.</div></div>

<p class="l-text"><strong>"Herhangi" bir ters türev neden işe yarar?</strong> Aynı $f$'nin iki ters türevi bir sabit kadar farklıdır: $F$ ve $G$ ikisi de ters türev ise $G(x) = F(x) + C$. Dolayısıyla $G(b) - G(a) = [F(b)+C] - [F(a)+C] = F(b) - F(a)$. Çıkarmada sabit kaybolur. FTC uygulanırken serbestçe $C = 0$ alabilirsiniz.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — FTC'NİN İLK KULLANIMI</div><div class="example-body"><strong>Yeniden hesaplayın:</strong> $\\int_0^1 x^2\\,dx$.<br><br>$x^2$'nin bir ters türevi $F(x) = x^3/3$ (kontrol: $F'(x) = 3x^2/3 = x^2$).<br><br>$\\int_0^1 x^2\\,dx \\;=\\; F(1) - F(0) \\;=\\; \\frac{1^3}{3} - \\frac{0^3}{3} \\;=\\; \\mathbf{\\frac{1}{3}}.$<br><br>Bu, bölüm 2'deki Riemann toplamlarının yaklaştığı tam alandır. İki satırlık iş bir sonsuz limitin yerini alır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — POLİNOM</div><div class="example-body"><strong>Hesaplayın:</strong> $\\int_1^3 (4x^3 - 2x + 5)\\,dx$.<br><br>Terim terim ters türev: $F(x) = x^4 - x^2 + 5x$.<br><br>$F(3) = 81 - 9 + 15 = 87$. &nbsp;&nbsp; $F(1) = 1 - 1 + 5 = 5$.<br><br>$\\int_1^3 (4x^3 - 2x + 5)\\,dx \\;=\\; 87 - 5 = \\mathbf{82}.$</div></div>

<h2 class="lesson-title">7. Analizin Temel Teoremi — Kısım 2</h2>

<p class="l-text">Kısım 1, türevleri integral hesaplama aracına dönüştürür. Kısım 2 bu ilişkiyi tersine çevirir: belirli bir integrale başlar ve sınırlardan birini değişken hale getirirseniz, türevi orijinal integrand olan yepyeni bir fonksiyon inşa edersiniz.</p>

<div class="calc-formula"><div class="formula-label">FTC — KISIM 2 (İNTEGRALİN TÜREVİ)</div><div class="formula-main">$$\\frac{d}{dx}\\int_a^x f(t)\\,dt \\;=\\; f(x)$$</div><div class="formula-sub">$f$, $a$ ve $x$'i içeren bir aralıkta sürekli olmak koşuluyla. Sol taraftaki nesneye bazen <em>birikim fonksiyonu</em> $A(x) = \\int_a^x f(t)\\,dt$ denir.</div></div>

<p class="l-text">Sözle: <strong>türev integrali geri alır</strong>. Bir birikim fonksiyonu kurup sonra türev almak, biriktirdiğimiz fonksiyonu geri verir. "İntegral türevi geri alır" şeklinde yeniden ifade edilebilen Kısım 1 ile birlikte, FTC'nin iki yarısı $\\dfrac{d}{dx}$ ve $\\displaystyle\\int$ işlemlerinin sürekli fonksiyonlar uzayında <em>ters işlemler</em> olduğunu söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İntegralin içindeki değişken</div><div class="card-body">Üst sınırla (burada $x$) her zaman farklı bir harf (burada $t$) kullanın. Karıştırmak notasyon hatasıdır ve karışıklığa yol açar.</div></div>
<div class="calc-card"><div class="card-title">Sınırdaki değişken</div><div class="card-body">Çıktı yalnızca $x$'e bağlıdır. $x$ sağa kaydıkça daha çok alan süpürülür — her adımda tam olarak $f(x)\\,dx$ kadar fazla.</div></div>
<div class="calc-card"><div class="card-title">Zincir kuralı uzantısı</div><div class="card-body">Üst sınır kendisi bir $u(x)$ fonksiyonuysa, zincir kuralı şunu verir: $\\dfrac{d}{dx}\\int_a^{u(x)} f(t)\\,dt = f(u(x))\\cdot u'(x).$</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — FTC KISIM 2</div><div class="example-body"><strong>Hesaplayın:</strong> $\\dfrac{d}{dx}\\int_2^x \\cos(t^2)\\,dt$.<br><br>FTC Kısım 2'ye göre cevap, integrand'ın üst sınırda değerlendirilmiş hali: $\\mathbf{\\cos(x^2)}$.<br><br>$\\cos(t^2)$'nin elementer ters türevi <em>olmamasına rağmen</em> bunun nasıl çalıştığına dikkat edin. İntegrali bulmuyoruz — onu türetiyoruz.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ZİNCİR KURALI İLE</div><div class="example-body"><strong>Hesaplayın:</strong> $\\dfrac{d}{dx}\\int_0^{x^2} \\sin t\\,dt$.<br><br>Üst sınır $u(x) = x^2$. Zincir kuralı versiyonunu uygulayın:<br><br>$\\dfrac{d}{dx}\\int_0^{x^2} \\sin t\\,dt = \\sin(x^2) \\cdot 2x = \\mathbf{2x\\sin(x^2)}.$</div></div>

<h2 class="lesson-title">8. FTC Neden Çalışır — Sezgisel Bir İspat</h2>

<p class="l-text">FTC'nin tam $\\varepsilon$-$\\delta$ ispatı, integraller için Ortalama Değer Teoremini ister. Ancak resim temizdir. Birikim fonksiyonunu tanımlayın:</p>

<div class="calc-formula"><div class="formula-main">$$A(x) \\;=\\; \\int_a^x f(t)\\,dt.$$</div></div>

<p class="l-text">Küçük $h > 0$ için $A$'nın $x$'ten $x + h$'ye değişimini düşünün:</p>

<div class="calc-formula"><div class="formula-main">$$A(x + h) - A(x) \\;=\\; \\int_x^{x+h} f(t)\\,dt.$$</div></div>

<p class="l-text">Bu, $f$ altındaki $x$ ile $x+h$ arasındaki alandır. Şerit çok incedir (genişlik $h$), dolayısıyla $f$ neredeyse sabittir. Şeridin alanı yaklaşık olarak genişliği $h$ ve yüksekliği $f(x)$ olan bir dikdörtgendir:</p>

<div class="calc-formula"><div class="formula-main">$$A(x + h) - A(x) \\;\\approx\\; f(x) \\cdot h.$$</div></div>

<p class="l-text">$h$'ye bölün ve $h \\to 0$ alın. Sol taraf $A$'nın türevidir, sağ taraf $f(x)$:</p>

<div class="calc-formula"><div class="formula-main">$$A'(x) \\;=\\; \\lim_{h \\to 0} \\frac{A(x+h) - A(x)}{h} \\;=\\; f(x).$$</div><div class="formula-sub">Bu FTC Kısım 2'dir. İntegraller için Ortalama Değer Teoremi, süreklilik sayesinde $h \\to 0$ iken $f(x)$'e giden bir tam ara yükseklik $f(c_h)$ seçerek "$\\approx$" işaretini "=" yapar.</div></div>

<p class="l-text"><strong>Kısım 2'den Kısım 1'e.</strong> $A$, $f$'nin bir ters türevi olduğundan ve herhangi başka bir ters türev $F$, $A$'dan bir sabit kadar farklı olduğundan, $F(b) - F(a) = A(b) - A(a) = \\int_a^b f(t)\\,dt - 0 = \\int_a^b f(t)\\,dt$. Bu da Kısım 1'dir.</p>

<div class="calc-graph"><div id="plot-l31-ftc-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Mavi renkte, $f(t) = t^2 + 0.5$ fonksiyonu. Gölgeli bölge, hareketli bir sağ sınır $x$'e kadar olan $A(x) = \\int_0^x f(t)\\,dt$ değeridir. Sağdaki ince altın şerit, $h$ genişliğine ve $f(x)$ yüksekliğine sahiptir; alanı $A(x+h) - A(x)$ değerine eşittir ve $h$'ye bölünce $f(x)$ çıkar. Resim, FTC'yi görünür kılar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(t){return t*t+0.5;}
var xc=[];var yc=[];for(var i=0;i<=200;i++){var t=2*i/200;xc.push(t);yc.push(f(t));}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#3b82f6',width:3},name:'f(t) = t² + 0.5'};
var xv=1.3,h=0.25;
var aX=[];var aY=[];for(var i=0;i<=100;i++){var t=xv*i/100;aX.push(t);aY.push(f(t));}aX.push(xv,0,0);aY.push(0,0,f(0));
var area={x:aX,y:aY,mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'rgba(59,130,246,0.0)'},showlegend:false,name:'A(x)'};
var sX=[xv,xv,xv+h,xv+h,xv];var sY=[0,f(xv),f(xv),0,0];
var strip={x:sX,y:sY,mode:'lines',fill:'toself',fillcolor:'rgba(200,169,110,0.55)',line:{color:'#c8a96e',width:1.5},name:'şerit ≈ f(x)·h'};
var marker={x:[xv],y:[f(xv)],mode:'markers+text',marker:{size:10,color:'#c8a96e'},text:['f(x)'],textposition:'top right',textfont:{color:'#c8a96e',size:13},showlegend:false};
var ann=[{x:xv*0.5,y:f(xv*0.5)*0.4,text:'A(x) = şimdiye kadarki alan',showarrow:false,font:{color:'#e8e8e8',size:13}},{x:xv+h*0.5,y:-0.25,text:'h',showarrow:false,font:{color:'#c8a96e',size:14}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t',range:[0,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(t)',range:[-0.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},annotations:ann,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l31-ftc-tr',[area,strip,curve,marker],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Çözümlü Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 9.1 — KUVVET FONKSİYONU</div><div class="example-body"><strong>Hesaplayın:</strong> $\\displaystyle\\int_0^1 x^2\\,dx$.<br><br>Ters türev: $F(x) = x^3/3$.<br><br>$F(1) - F(0) = 1/3 - 0 = \\mathbf{1/3}.$<br><br>Geometrik anlam: $y = x^2$ parabolünün altındaki alan 0'dan 1'e tam olarak $1/3$'tür — Arşimet'in kalkülüsten 2200 yıl önce muhteşem bir tükenme argümanı ile ispatladığı sonuç. Kalkülüs bunu üç satıra indirir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9.2 — SİNÜS FONKSİYONU</div><div class="example-body"><strong>Hesaplayın:</strong> $\\displaystyle\\int_0^{\\pi} \\sin x\\,dx$.<br><br>Ters türev: $F(x) = -\\cos x$ (kontrol: $(-\\cos x)' = \\sin x$).<br><br>$F(\\pi) - F(0) = -\\cos\\pi - (-\\cos 0) = -(-1) - (-1) = 1 + 1 = \\mathbf{2}.$<br><br>Yarı periyot boyunca sinüs eğrisinin tüm tümseği tam olarak 2 birimkarelik bir alan kapsar. Transandantal bir fonksiyondan şaşırtıcı bir tam sayı.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9.3 — TERS FONKSİYON</div><div class="example-body"><strong>Hesaplayın:</strong> $\\displaystyle\\int_1^{e} \\frac{1}{x}\\,dx$.<br><br>Ters türev: $F(x) = \\ln x$ ($x > 0$ için tanımlı; kontrol $(\\ln x)' = 1/x$).<br><br>$F(e) - F(1) = \\ln e - \\ln 1 = 1 - 0 = \\mathbf{1}.$<br><br>Bu, matematikteki en temiz bağlantılardan biridir: $y = 1/x$ altındaki alan 1'den $e$'ye tam olarak 1'dir. $e$ sayısı, bir bakıma, bu özellikle <em>tanımlanır</em>.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9.4 — TRİVİAL OLMAYAN ARALIKTA POLİNOM</div><div class="example-body"><strong>Hesaplayın:</strong> $\\displaystyle\\int_{-1}^{2} (3x^2 - 2x)\\,dx$.<br><br>Ters türev: $F(x) = x^3 - x^2$.<br><br>$F(2) = 8 - 4 = 4$. &nbsp;&nbsp; $F(-1) = -1 - 1 = -2$.<br><br>$\\int_{-1}^{2}(3x^2 - 2x)\\,dx = 4 - (-2) = \\mathbf{6}.$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9.5 — ÜSTEL</div><div class="example-body"><strong>Hesaplayın:</strong> $\\displaystyle\\int_0^{\\ln 2} e^x\\,dx$.<br><br>Ters türev: $F(x) = e^x$.<br><br>$F(\\ln 2) - F(0) = e^{\\ln 2} - e^0 = 2 - 1 = \\mathbf{1}.$</div></div>

<h2 class="lesson-title">10. Negatif Alan (İşaretli Alan)</h2>

<div class="calc-highlight"><strong>İşaret önemli.</strong> Riemann dikdörtgenlerinin yüksekliği $f(x_i^*)$'dir. Eğri x-ekseninin altındayken yükseklik negatiftir, dolayısıyla dikdörtgen toplama <em>negatif</em> bir terim katkı yapar. Bu yüzden belirli integral <strong>işaretli alanı</strong> ölçer: eksen üstünde pozitif, altında negatif.</div>

<p class="l-text">Somut olarak: eğri ile x-ekseni arasındaki <em>geometrik alanı</em> (her zaman negatif olmayan) istiyorsanız, integrali $f$'nin her sıfırında bölmeli ve parçaların mutlak değerlerini toplamalısınız. Belirli integralin tek başına götürdüğü değer iptalleri gizleyebilir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İŞARETLİ ALAN</div><div class="example-body"><strong>Hesaplayın:</strong> $\\displaystyle\\int_{-\\pi}^{\\pi} \\sin x\\,dx$.<br><br>Ters türev: $F(x) = -\\cos x$.<br><br>$F(\\pi) - F(-\\pi) = -\\cos\\pi + \\cos(-\\pi) = -(-1) + (-1) = 1 - 1 = \\mathbf{0}.$<br><br>$[-\\pi, 0]$ üzerindeki negatif yarı, $[0, \\pi]$ üzerindeki pozitif yarıyı tam olarak iptal eder. İşaretli alan 0'dır, ancak geometrik alan $\\int_0^\\pi \\sin x\\,dx \\cdot 2 = 4$.</div></div>

<div class="calc-graph"><div id="plot-l31-signed-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $[-\\pi, \\pi]$ üzerinde $\\sin x$ fonksiyonu. Soldaki kırmızı bölgenin alanı 2'dir ama integrale $-2$ katkıda bulunur; sağdaki mavi bölge $+2$ katkıda bulunur. Tam olarak iptal ederler. Toplam işaretli alan 0'dır; toplam geometrik alan 4'tür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xc=[];var yc=[];for(var i=0;i<=300;i++){var x=-Math.PI+2*Math.PI*i/300;xc.push(x);yc.push(Math.sin(x));}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:2.5},name:'sin x'};
var aXp=[];var aYp=[];for(var i=0;i<=150;i++){var x=Math.PI*i/150;aXp.push(x);aYp.push(Math.sin(x));}aXp.push(Math.PI,0);aYp.push(0,0);
var areaP={x:aXp,y:aYp,mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.30)',line:{color:'rgba(0,0,0,0)'},name:'+2 alan'};
var aXn=[];var aYn=[];for(var i=0;i<=150;i++){var x=-Math.PI+Math.PI*i/150;aXn.push(x);aYn.push(Math.sin(x));}aXn.push(0,-Math.PI);aYn.push(0,0);
var areaN={x:aXn,y:aYn,mode:'lines',fill:'toself',fillcolor:'rgba(239,68,68,0.30)',line:{color:'rgba(0,0,0,0)'},name:'−2 alan'};
var ann=[{x:Math.PI/2,y:0.55,text:'+2',showarrow:false,font:{color:'#3b82f6',size:18}},{x:-Math.PI/2,y:-0.55,text:'−2',showarrow:false,font:{color:'#ef4444',size:18}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-Math.PI-0.2,Math.PI+0.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.4)'},yaxis:{title:'sin x',range:[-1.2,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.4)'},annotations:ann,margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l31-signed-tr',[areaN,areaP,curve],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pratik kural.</strong> Bir soru <em>integrali</em> istiyorsa cevap işaretlidir ve doğrudan $F(b) - F(a)$ hesaplarsınız. Bir soru <em>geometrik alanı</em> istiyorsa $[a, b]$ içindeki her $f$ kökünde bölmeli, her alt aralığı ayrı integrallemeli ve mutlak değerleri toplamalısınız.</div>

<h2 class="lesson-title">11. Klasik Alıştırmalar</h2>

<p class="l-text">Önce her problemi kendiniz deneyin, sonra cevabı kontrol edin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1</div><div class="card-body">Hesaplayın: $\\displaystyle\\int_0^2 (x^3 + 1)\\,dx$.<br><br><em>İpucu:</em> ters türev $x^4/4 + x$.<br><strong>Cevap:</strong> $4 + 2 - 0 = 6$.</div></div>
<div class="calc-card"><div class="card-title">Problem 2</div><div class="card-body">Hesaplayın: $\\displaystyle\\int_1^4 \\sqrt{x}\\,dx$.<br><br><em>İpucu:</em> $\\sqrt{x} = x^{1/2}$; ters türev $\\tfrac{2}{3}x^{3/2}$.<br><strong>Cevap:</strong> $\\tfrac{2}{3}(8 - 1) = 14/3$.</div></div>
<div class="calc-card"><div class="card-title">Problem 3</div><div class="card-body">Hesaplayın: $\\displaystyle\\int_0^{\\pi/2} \\cos x\\,dx$.<br><br><em>İpucu:</em> ters türev $\\sin x$.<br><strong>Cevap:</strong> $\\sin(\\pi/2) - \\sin 0 = 1$.</div></div>
<div class="calc-card"><div class="card-title">Problem 4</div><div class="card-body">Sol Riemann toplamı ile $n = 4$ alarak $\\displaystyle\\int_0^1 (1 - x^2)\\,dx$ değerini yaklaşık olarak hesaplayın.<br><br><em>İpucu:</em> yükseklikler $1, 0.9375, 0.75, 0.4375$; genişlik $0.25$.<br><strong>Cevap:</strong> $L_4 = 0.78125$. (Kesin: $2/3 \\approx 0.6667$.)</div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 5</div><div class="card-body">Hesaplayın: $\\displaystyle\\int_{-2}^{2} x^3\\,dx$.<br><br><em>İpucu:</em> ters türev $x^4/4$. $x^3$'ün tek fonksiyon olduğuna dikkat edin.<br><strong>Cevap:</strong> $4 - 4 = 0$ (işaretli alan iptal olur).</div></div>
<div class="calc-card"><div class="card-title">Problem 6</div><div class="card-body">Hesaplayın: $\\dfrac{d}{dx}\\displaystyle\\int_0^x \\sqrt{1 + t^4}\\,dt$.<br><br><em>İpucu:</em> FTC Kısım 2 — sadece $t$ yerine $x$ koyun.<br><strong>Cevap:</strong> $\\sqrt{1 + x^4}$.</div></div>
<div class="calc-card"><div class="card-title">Problem 7</div><div class="card-body">Hesaplayın: $\\displaystyle\\int_1^{e^2} \\frac{1}{x}\\,dx$.<br><br><em>İpucu:</em> ters türev $\\ln x$.<br><strong>Cevap:</strong> $\\ln(e^2) - \\ln 1 = 2$.</div></div>
<div class="calc-card"><div class="card-title">Problem 8</div><div class="card-body">$[-2, 2]$ üzerinde $y = x^2 - 1$ ile x-ekseni arasındaki geometrik alanı hesaplayın.<br><br><em>İpucu:</em> kökler $x = \\pm 1$. Üç parçaya bölün.<br><strong>Cevap:</strong> $\\int_{-2}^{-1}(x^2 - 1)\\,dx + \\bigl|\\int_{-1}^{1}(x^2 - 1)\\,dx\\bigr| + \\int_{1}^{2}(x^2 - 1)\\,dx = \\tfrac{4}{3} + \\tfrac{4}{3} + \\tfrac{4}{3} = 4$.</div></div>
</div>

<h2 class="lesson-title">12. Riemann Toplamının Yakınsaması</h2>

<p class="l-text">Aşağıda $\\displaystyle\\int_0^2 \\sin x\\,dx$ için dört farklı sol Riemann yaklaşımını aynı eksende çizdik: $n = 4, 8, 16, 32$ dikdörtgen. Kesin değer $-\\cos 2 + \\cos 0 = 1 - \\cos 2 \\approx 1.4161$. $n$ ikiye katlandıkça basamakların eğriye nasıl sıkıştığına bakın — her ikiye katlama hatayı kabaca yarıya indirir; sol kuralın garanti ettiği doğrusal yakınsama tam olarak budur.</p>

<div class="calc-graph"><div id="plot-l31-converge-tr-extra" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $[0, 2]$ üzerinde $y = \\sin x$ eğrisi (beyaz) ve altında gölgelenmiş kesin alan. $n$ büyüdükçe açık maviden koyu maviye sıralanmış dört üst üste dikdörtgen kümesi alanı $n = 4, 8, 16, 32$ sol dikdörtgenle yaklaştırır. Lejantta görülen sayısal toplamlar kesin değer $1 - \\cos 2 \\approx 1.4161$'e yakınsar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return Math.sin(x);}
var a=0,b=2;
var xc=[];var yc=[];for(var i=0;i<=300;i++){var x=a+(b-a)*i/300;xc.push(x);yc.push(f(x));}
var curve={x:xc,y:yc,mode:'lines',line:{color:'#e8e8e8',width:3},name:'y = sin x',showlegend:true};
var aX=xc.slice();var aY=yc.slice();aX.push(b,a);aY.push(0,0);
var area={x:aX,y:aY,mode:'lines',fill:'toself',fillcolor:'rgba(255,255,255,0.05)',line:{color:'rgba(0,0,0,0)'},name:'kesin alan ≈ 1.4161',showlegend:true};
function rects(n,color,opacity){var dx=(b-a)/n;var bx=[];var by=[];var s=0;for(var i=0;i<n;i++){var x0=a+i*dx;var x1=x0+dx;var h=f(x0);s+=h*dx;bx.push(x0,x0,x1,x1,x0,null);by.push(0,h,h,0,0,null);}return{trace:{x:bx,y:by,mode:'lines',fill:'toself',line:{color:color,width:1},fillcolor:'rgba('+opacity+')',name:'n='+n+', L<sub>n</sub>='+s.toFixed(4),showlegend:true},sum:s};}
var r4=rects(4,'#1e3a8a','30,58,138,0.22');
var r8=rects(8,'#1d4ed8','29,78,216,0.20');
var r16=rects(16,'#3b82f6','59,130,246,0.18');
var r32=rects(32,'#60a5fa','96,165,250,0.16');
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[a-0.05,b+0.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},yaxis:{title:'sin x',range:[0,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.3)'},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:-0.22,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l31-converge-tr-extra',[area,r4.trace,r8.trace,r16.trace,r32.trace,curve],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Yakınsama davranışını sayısal olarak izleyen kısa bir tablo. Her satırda mutlak hatanın kabaca yarıya inişine dikkat edin — bu $O(1/n)$ davranışı sol/sağ kuralın karakteristiğidir. Orta nokta kuralı ise $O(1/n^2)$ verir.</p>

<div style="overflow-x:auto;margin:1.5rem 0">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead><tr style="background:#3b82f6;color:#0a0a0a"><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">n</th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">L<sub>n</sub></th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">Hata |L<sub>n</sub> − 1.4161|</th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">Öncekine oran</th></tr></thead>
<tbody>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">4</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.0682</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.3479</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">—</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">8</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.2461</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.1700</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.489</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">16</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.3322</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.0840</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.494</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">32</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.3743</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.0418</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.498</td></tr>
<tr><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1000</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">1.4148</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">0.0013</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">≈ Her ikiye katlamada 0.5</td></tr>
<tr style="background:rgba(59,130,246,0.10)"><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">∞ (kesin)</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">1 − cos 2 ≈ 1.4161</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">0</td><td style="padding:0.55rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">FTC</td></tr>
</tbody></table>
</div>

<h2 class="lesson-title">13. Belirli İntegralin Özellikleri — Özet Tablosu</h2>

<p class="l-text">Belirli integralin cebirsel özdeşlikleri için derli toplu bir başvuru kartı; FTC'nin her iki yarısı ve ortalama değer formülü ile birlikte. Her satır, yeniden türetmeden uygulayabilmeniz gereken bir araçtır.</p>

<div style="overflow-x:auto;margin:1.5rem 0">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead><tr style="background:#3b82f6;color:#0a0a0a"><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em;width:32%">Özellik</th><th style="padding:0.7rem 1rem;text-align:left;font-weight:700;letter-spacing:0.04em">Formül</th></tr></thead>
<tbody>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Boş aralık</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^a f(x)\\,dx = 0$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">İşaret değişimi</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Doğrusallık</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b [c f(x) + g(x)]\\,dx = c\\int_a^b f(x)\\,dx + \\int_a^b g(x)\\,dx$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Aralık toplamsallığı</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Karşılaştırma</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$[a,b]$'de $f \\leq g$ $\\implies$ $\\displaystyle\\int_a^b f \\leq \\int_a^b g$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">FTC Kısım 1 (değerlendirme)</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a),\\;\\; F'=f$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">FTC Kısım 2 (integralin türevi)</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$</td></tr>
<tr><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Ortalama değer</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06)">$\\displaystyle\\bar{f} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx$</td></tr>
<tr style="background:rgba(59,130,246,0.10)"><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">Sabit integrand</td><td style="padding:0.6rem 1rem;border-top:1px solid rgba(255,255,255,0.06);font-weight:600">$\\displaystyle\\int_a^b c\\,dx = c(b - a)$</td></tr>
</tbody></table>
</div>

<div class="think-box"><div class="think-label">İLERİYE BAKIŞ</div><div class="think-body">Fizikte (iş, yer değiştirme, kütle, kütle merkezi), ekonomide (tüketici fazlası, toplam gelir) ve istatistikte (olasılık, beklenen değer) karşılaşacağınız her belirli integral tam olarak aynı tarifle hesaplanır: bir ters türev bulun, uçları yerleştirin, çıkarın. FTC, uygulamalı kalkülüsün motorudur.</div></div>
`
};
