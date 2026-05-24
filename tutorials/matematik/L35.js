window.LISE_MAT_L35 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far every function you have met grows in a fairly tame way.</strong> Linear functions add a fixed amount with each step. Quadratic functions speed up, but only quadratically — double the input, quadruple the output. Even the cubic $x^3$ feels manageable. The function we meet in this lesson breaks out of that polynomial world entirely. It is the function whose <em>output</em> multiplies by a fixed factor each time the input increases by one. We call it the <strong>exponential function</strong>, and once you understand it you will see it everywhere — bank accounts that compound, populations of bacteria, the cooling of a cup of coffee, the decay of a radioactive sample, and, perhaps surprisingly, the way calculus itself prefers to express change.</p>

<p class="l-text">In this lesson we build the function $y = a^x$ from scratch. We sketch its graph for many values of the base $a$, derive its algebraic properties, meet the special number $e \\approx 2.71828$, learn to solve exponential equations and inequalities, and finally apply the function to the two flagship physical models: compound interest and radioactive decay. By the end you will read an exponential model on sight and reach for the right tool — log, ratio, half-life formula — without hesitation.</p>

<div class="lesson-outcomes" style="background:rgba(192,132,252,0.06);border-left:3px solid #c084fc;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c084fc;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the exponential function $y = a^x$ with base $a > 0$, $a \\neq 1$, and read its domain and range</li>
<li>Sketch the graph for $a > 1$ (increasing) and $0 < a < 1$ (decreasing) and recognise the horizontal asymptote $y = 0$</li>
<li>Apply the three master identities: $a^x \\cdot a^y = a^{x+y}$, $(a^x)^y = a^{xy}$, $a^0 = 1$</li>
<li>Understand why the number $e$ is special — it is the unique base whose tangent slope at $x = 0$ equals $1$</li>
<li>Solve exponential equations by matching bases or by taking logarithms</li>
<li>Apply the growth law $P(t) = P_0 \\, e^{rt}$ to compound interest, population growth, and radioactive decay (half-life)</li>
</ul>
</div>

<h2 class="lesson-title">1. Definition of the Exponential Function</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> place a single grain of rice on the first square of a chessboard, two grains on the second, four on the third, eight on the fourth — each square doubles the previous. By the 64th square you owe more rice than has ever been grown on Earth. That is exponential growth: the <em>same multiplier</em> at every step turns an absurdly small starting point into an astronomical total.</div>

<p class="l-text">Formally, an <strong>exponential function</strong> has the form</p>

<div class="calc-formula"><div class="formula-label">EXPONENTIAL FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f(x) \\;=\\; a^x, \\qquad a > 0, \\; a \\neq 1, \\; x \\in \\mathbb{R}.$$</div><div class="formula-sub">The constant $a$ is called the <em>base</em>. The variable $x$ sits in the exponent — this is what makes the function exponential rather than polynomial.</div></div>

<p class="l-text">Three remarks on the conditions in the definition. First, we require $a > 0$ because a negative base makes $a^x$ undefined for non-integer exponents (try $(-1)^{1/2}$ — it has no real value). Second, we exclude $a = 1$ because $1^x = 1$ for every $x$, which is just the constant function and carries no interesting behaviour. Third, $a \\neq 0$ is built in by $a > 0$, and $0^0$ is contested anyway. Everything else — any positive base different from $1$ — gives a genuine exponential function.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Base $a$</div><div class="card-body">The fixed positive number we raise to the variable power. Typical choices in problems: $2, 3, 10, e$. Each base gives a differently-shaped curve.</div></div>
<div class="calc-card"><div class="card-title">Exponent $x$</div><div class="card-body">The variable. It may be any real number — positive, negative, zero, integer, fraction, irrational. The exponential function is defined on all of $\\mathbb{R}$.</div></div>
<div class="calc-card"><div class="card-title">Output $a^x$</div><div class="card-body">Always strictly positive. The function never reaches zero and never goes below it. The range is $(0, \\infty)$.</div></div>
</div>

<p class="l-text"><strong>Polynomial vs exponential — a tiny comparison.</strong> The function $g(x) = x^{10}$ is a polynomial: the variable is in the base, the exponent is fixed. The function $f(x) = 10^x$ is exponential: the base is fixed, the variable is in the exponent. The two look superficially similar, but $f$ eventually overtakes $g$ no matter how high the polynomial degree is. Exponential growth always wins in the long run.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Decide whether each is exponential: (a) $y = x^3$, (b) $y = 3^x$, (c) $y = x^x$, (d) $y = 5 \\cdot 2^x$. Answers: (a) polynomial, not exponential; (b) exponential with base $3$; (c) neither — both the base and exponent vary; (d) exponential with a multiplicative constant (we will allow these in section 7).</div></div>

<h2 class="lesson-title">2. The Graph of $y = a^x$</h2>

<div class="calc-highlight">There are two cases, and they look like mirror reflections of each other across the $y$-axis. When $a > 1$ the function <strong>increases</strong>. When $0 < a < 1$ the function <strong>decreases</strong>. In both cases the graph passes through $(0, 1)$ (because $a^0 = 1$) and hugs the $x$-axis as a horizontal asymptote on one side.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">CASE $a > 1$ — GROWTH</div><div class="compare-item">Monotonically <strong>increasing</strong></div><div class="compare-item">$\\lim_{x \\to -\\infty} a^x = 0$ (left asymptote $y = 0$)</div><div class="compare-item">$\\lim_{x \\to +\\infty} a^x = +\\infty$</div><div class="compare-item">Examples: $2^x$, $e^x$, $10^x$</div></div><div class="compare-col"><div class="compare-title">CASE $0 < a < 1$ — DECAY</div><div class="compare-item">Monotonically <strong>decreasing</strong></div><div class="compare-item">$\\lim_{x \\to -\\infty} a^x = +\\infty$</div><div class="compare-item">$\\lim_{x \\to +\\infty} a^x = 0$ (right asymptote $y = 0$)</div><div class="compare-item">Examples: $(1/2)^x$, $(1/e)^x$, $(0.9)^x$</div></div></div>

<p class="l-text">A few features hold for <em>every</em> exponential function regardless of which side of $1$ the base sits on:</p>

<ul class="l-text" style="line-height:1.7">
<li><strong>Always positive.</strong> $a^x > 0$ for every real $x$. The graph never touches or crosses the $x$-axis.</li>
<li><strong>Passes through $(0, 1)$.</strong> Because $a^0 = 1$, every exponential curve hits the $y$-axis at height $1$.</li>
<li><strong>Passes through $(1, a)$.</strong> A useful second anchor — substitute $x = 1$ to read off the base directly from the graph.</li>
<li><strong>Horizontal asymptote $y = 0$.</strong> One side of the curve flattens toward zero without ever reaching it.</li>
<li><strong>Domain $\\mathbb{R}$, range $(0, \\infty)$.</strong> Input can be any real number; output is strictly positive.</li>
<li><strong>One-to-one (injective).</strong> Different inputs give different outputs, so the function has an inverse — the <em>logarithm</em>, which we meet in the next lesson.</li>
</ul>

<div class="calc-graph"><div id="plot-l35-bases-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three exponential curves $y = 2^x$, $y = e^x$, and $y = 10^x$ on the same axes. All three pass through $(0, 1)$, all three are increasing, but they grow at very different rates — $10^x$ leaves the visible window quickly while $2^x$ rises more gently. The base controls the steepness.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-30;i<=20;i++)x.push(i/10);
var y2=x.map(function(v){return Math.pow(2,v);});
var ye=x.map(function(v){return Math.exp(v);});
var y10=x.map(function(v){return Math.pow(10,v);});
var t2={x:x,y:y2,mode:'lines',name:'y = 2^x',line:{color:'#3b82f6',width:2.5}};
var te={x:x,y:ye,mode:'lines',name:'y = e^x',line:{color:'#c084fc',width:2.5}};
var t10={x:x,y:y10,mode:'lines',name:'y = 10^x',line:{color:'#f87171',width:2.5}};
var anchor={x:[0],y:[1],mode:'markers',name:'(0,1) common point',marker:{size:9,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,2]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-1,12]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-bases-en',[t2,te,t10,anchor],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l35-decay-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the decreasing exponential $y = (1/2)^x$ alongside its mirror twin $y = 2^x$. The two are reflections of each other across the $y$-axis. Both pass through $(0, 1)$, but the decay curve heads to infinity on the left and to zero on the right — the opposite of the growth curve.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-30;i<=30;i++)x.push(i/10);
var ygrow=x.map(function(v){return Math.pow(2,v);});
var ydecay=x.map(function(v){return Math.pow(0.5,v);});
var tg={x:x,y:ygrow,mode:'lines',name:'y = 2^x (growth)',line:{color:'#3b82f6',width:2.5}};
var td={x:x,y:ydecay,mode:'lines',name:'y = (1/2)^x (decay)',line:{color:'#f87171',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.5,8]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-decay-en',[tg,td],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why the mirror?</strong> Because $(1/a)^x = a^{-x}$. Replacing $x$ by $-x$ in any function reflects its graph across the $y$-axis. So the decay curve is precisely the growth curve flipped left-to-right.</div>

<h2 class="lesson-title">3. The Three Master Identities</h2>

<p class="l-text">Every algebraic manipulation of exponentials reduces to combining three identities you already know from working with integer powers. The remarkable fact is that these identities <em>still hold</em> when the exponent is any real number — not just integer or fraction.</p>

<div class="calc-formula"><div class="formula-label">PRODUCT, POWER, ZERO</div><div class="formula-main">$$a^x \\cdot a^y = a^{x+y}, \\qquad (a^x)^y = a^{xy}, \\qquad a^0 = 1.$$</div><div class="formula-sub">Multiplication of two powers with the same base adds the exponents. A power raised to another power multiplies the exponents. Any base to the zero is $1$.</div></div>

<p class="l-text">From these three we derive everything else. The <em>quotient</em> rule comes from the product rule with a negative exponent:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{a^x}{a^y} = a^x \\cdot a^{-y} = a^{x-y}, \\qquad a^{-x} = \\frac{1}{a^x}.$$</div></div>

<p class="l-text">The <em>different-base product</em> rule:</p>

<div class="calc-formula"><div class="formula-main">$$a^x \\cdot b^x = (ab)^x, \\qquad \\frac{a^x}{b^x} = \\left(\\frac{a}{b}\\right)^x.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Simplify</strong> $\\dfrac{2^{x+3} \\cdot 4^x}{8^{x-1}}$.<br><br>Rewrite every base as a power of $2$: $4 = 2^2$ and $8 = 2^3$. Then<br>$$\\frac{2^{x+3} \\cdot (2^2)^x}{(2^3)^{x-1}} \\;=\\; \\frac{2^{x+3} \\cdot 2^{2x}}{2^{3x-3}} \\;=\\; \\frac{2^{3x+3}}{2^{3x-3}} \\;=\\; 2^{(3x+3) - (3x-3)} \\;=\\; 2^6 \\;=\\; 64.$$<br>The variable $x$ disappears entirely — the expression simplifies to the constant $64$.</div></div>

<div class="think-box"><div class="think-label">QUICK PRACTICE</div><div class="think-body">Compute without a calculator: (a) $9^{1/2}$, (b) $2^{-3}$, (c) $27^{2/3}$, (d) $5^{0}$. Answers: (a) $3$, (b) $1/8$, (c) $9$, (d) $1$.</div></div>

<h2 class="lesson-title">4. The Natural Base $e$</h2>

<div class="calc-highlight"><strong>Among all possible bases, one is mathematically special:</strong> the number $e \\approx 2.71828\\,18284\\,59045\\ldots$, named after the Swiss mathematician <em>Leonhard Euler</em>. It is irrational (its decimal never repeats) and transcendental (it is not the root of any polynomial with integer coefficients). And yet it is the most natural choice of base for calculus — every exponential growth law in physics, biology, and finance prefers to be written with $e$.</div>

<p class="l-text">Why is $e$ so special? The cleanest way to see it is geometric. For each base $a$, the curve $y = a^x$ has a tangent line at $x = 0$ with some slope. Try a few values: the slope at $x = 0$ for $a = 2$ is about $0.693$; for $a = 3$ it is about $1.099$. Somewhere between $a = 2$ and $a = 3$ there is a base whose tangent slope at $x = 0$ is exactly $1$. That base is $e$.</p>

<div class="calc-formula"><div class="formula-label">DEFINING PROPERTY OF $e$</div><div class="formula-main">$$\\frac{d}{dx} e^x \\Big|_{x=0} \\;=\\; 1, \\qquad \\text{equivalently} \\qquad \\frac{d}{dx} e^x \\;=\\; e^x.$$</div><div class="formula-sub">$e^x$ is the unique exponential function that is its own derivative. This single property makes $e$ the natural choice for calculus.</div></div>

<p class="l-text">A second, equally famous way to define $e$ — through compound interest, which we will meet in detail in section 8:</p>

<div class="calc-formula"><div class="formula-main">$$e \\;=\\; \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\;=\\; 1 + \\frac{1}{1!} + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!} + \\cdots$$</div></div>

<p class="l-text">Both formulas converge to the same number, $e \\approx 2.71828$. The first arises from continuous compounding of a 100% annual interest rate; the second is the Taylor series of $e^x$ evaluated at $x = 1$. They give two complementary intuitions for the same constant.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$e \\approx 2.71828$</div><div class="card-body">Irrational, transcendental. Five-decimal value to memorise for any exam where calculators are forbidden.</div></div>
<div class="calc-card"><div class="card-title">$(e^x)' = e^x$</div><div class="card-body">The function is its own derivative. This is why $e$ is the calculus-friendly base and why every growth law uses it.</div></div>
<div class="calc-card"><div class="card-title">$\\ln$ = inverse of $e^x$</div><div class="card-body">The natural logarithm, written $\\ln x$, is the logarithm with base $e$. We meet it in the next lesson.</div></div>
</div>

<h2 class="lesson-title">5. Exponential Equations</h2>

<p class="l-text">An <strong>exponential equation</strong> is one in which the unknown sits in the exponent. There are two master strategies for solving them.</p>

<div class="calc-formula"><div class="formula-label">STRATEGY 1 — MATCH THE BASES</div><div class="formula-main">$$a^{f(x)} = a^{g(x)} \\quad \\iff \\quad f(x) = g(x), \\qquad (a > 0, \\; a \\neq 1).$$</div><div class="formula-sub">If you can rewrite both sides as a power of the same base, the exponents must be equal. Use this whenever the numbers are clean powers of a small base like $2$, $3$, $5$, or $10$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (matching bases)</div><div class="example-body"><strong>Solve</strong> $2^{x+1} = 16$.<br><br>Recognise $16 = 2^4$, so the equation becomes $2^{x+1} = 2^4$. By the matching-bases rule, $x + 1 = 4$, giving $\\boxed{x = 3}$.<br><br>Check: $2^{3+1} = 2^4 = 16$. ✓</div></div>

<div class="calc-formula"><div class="formula-label">STRATEGY 2 — TAKE LOGARITHMS</div><div class="formula-main">$$a^{f(x)} = b \\quad \\iff \\quad f(x) \\;=\\; \\log_a b \\;=\\; \\frac{\\ln b}{\\ln a}.$$</div><div class="formula-sub">If matching bases is not clean, apply $\\log$ (or $\\ln$) to both sides. This brings the exponent down as a multiplier and the equation becomes linear (or polynomial) in $x$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (taking logs)</div><div class="example-body"><strong>Solve</strong> $3^x = 20$.<br><br>$20$ is not a clean power of $3$, so take $\\ln$ of both sides:<br>$$\\ln(3^x) = \\ln 20 \\quad \\Longrightarrow \\quad x \\ln 3 = \\ln 20 \\quad \\Longrightarrow \\quad x = \\frac{\\ln 20}{\\ln 3} \\approx \\frac{2.996}{1.099} \\approx 2.727.$$<br>Check: $3^{2.727} \\approx 20.0$. ✓</div></div>

<p class="l-text"><strong>A common subtype — substitution.</strong> Equations like $2^{2x} - 5 \\cdot 2^x + 4 = 0$ look frightening at first, but the substitution $u = 2^x$ turns them into ordinary quadratics:</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (substitution)</div><div class="example-body"><strong>Solve</strong> $2^{2x} - 5 \\cdot 2^x + 4 = 0$.<br><br>Let $u = 2^x$. Note $2^{2x} = (2^x)^2 = u^2$. The equation becomes $u^2 - 5u + 4 = 0$, factoring as $(u - 1)(u - 4) = 0$, so $u = 1$ or $u = 4$.<br><br>Back-substitute. $u = 1$ gives $2^x = 1 \\Rightarrow x = 0$. $u = 4$ gives $2^x = 4 \\Rightarrow x = 2$.<br><br>$\\boxed{x = 0 \\text{ or } x = 2}$.</div></div>

<h2 class="lesson-title">6. Exponential Inequalities</h2>

<p class="l-text">An exponential <em>inequality</em> looks like $a^{f(x)} \\leq a^{g(x)}$. The technique is the same as for equations — match the bases — but with one critical twist concerning the direction of the inequality.</p>

<div class="calc-formula"><div class="formula-label">MONOTONICITY RULE</div><div class="formula-main">$$a^{f(x)} \\;\\leq\\; a^{g(x)} \\quad \\iff \\quad \\begin{cases} f(x) \\leq g(x), & a > 1, \\\\[4pt] f(x) \\geq g(x), & 0 < a < 1. \\end{cases}$$</div><div class="formula-sub">When $a > 1$ the function is increasing, so the inequality between exponents goes the same way. When $0 < a < 1$ the function is decreasing, so the inequality <em>flips</em>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (base &gt; 1)</div><div class="example-body"><strong>Solve</strong> $3^{x+1} > 81$.<br><br>$81 = 3^4$, so $3^{x+1} > 3^4$. Base $3 > 1$, so the inequality stays the same direction: $x + 1 > 4$, i.e. $\\boxed{x > 3}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (base &lt; 1)</div><div class="example-body"><strong>Solve</strong> $\\left(\\dfrac{1}{2}\\right)^x \\geq 8$.<br><br>$8 = 2^3 = (1/2)^{-3}$, so $(1/2)^x \\geq (1/2)^{-3}$. Base $1/2 < 1$, so the inequality <em>flips</em>: $x \\leq -3$. $\\boxed{x \\leq -3}$.<br><br>Sanity check: at $x = -3$, $(1/2)^{-3} = 2^3 = 8$. At $x = -4$, $(1/2)^{-4} = 16 > 8$. ✓</div></div>

<div class="l-note"><strong>Common mistake.</strong> Forgetting to flip the inequality when the base is between $0$ and $1$. Always identify the base first, then decide whether the inequality is preserved or reversed.</div>

<h2 class="lesson-title">7. Growth and Decay Models</h2>

<div class="calc-highlight"><strong>The same formula governs three very different physical situations:</strong> a bank account compounding continuously, a population of bacteria doubling every hour, and a radioactive sample whose nuclei decay at a fixed rate. In every case the rate of change is proportional to the current amount, and the solution is an exponential.</div>

<div class="calc-formula"><div class="formula-label">CONTINUOUS EXPONENTIAL GROWTH / DECAY</div><div class="formula-main">$$P(t) \\;=\\; P_0 \\, e^{r t},$$</div><div class="formula-sub">$P(t)$ is the amount at time $t$; $P_0 = P(0)$ is the initial amount; $r$ is the continuous rate. $r > 0$ gives growth; $r < 0$ gives decay.</div></div>

<p class="l-text">The constant $r$ is the <strong>continuous (instantaneous) rate</strong>. It is the answer to the question "what fraction of the current amount is added (or lost) per unit time?". For populations $r$ might be $0.02$ per year (2% growth); for an interest-bearing account at 5% nominal compounded continuously, $r = 0.05$; for a radioactive isotope with a 1000-year half-life, $r$ is a specific small negative number derived in section 9.</p>

<p class="l-text">The model is equivalent to the differential equation $\\dfrac{dP}{dt} = r \\, P(t)$ — the rate of change is proportional to the amount. We will not solve that equation here, but we record the consequence: doubling time and half-life are constants, independent of the starting amount.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doubling time (growth, $r > 0$)</div><div class="card-body">$T_2 = \\dfrac{\\ln 2}{r}$. The time it takes the population to double. Solves $e^{r T_2} = 2$.</div></div>
<div class="calc-card"><div class="card-title">Half-life (decay, $r < 0$)</div><div class="card-body">$T_{1/2} = \\dfrac{\\ln 2}{|r|}$. The time it takes the sample to fall to half. Solves $e^{r T_{1/2}} = 1/2$.</div></div>
<div class="calc-card"><div class="card-title">"Rule of 70"</div><div class="card-body">For small $r$ (a few percent), $T_2 \\approx 70 / (100 r)$ years — a handy mental shortcut bankers use.</div></div>
</div>

<div class="calc-graph"><div id="plot-l35-popgrowth-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a bacteria population starting at $P_0 = 100$ growing at rate $r = 0.5$ per hour, $P(t) = 100 \\, e^{0.5 t}$. The vertical dashed line marks the doubling time $T_2 = \\ln 2 / 0.5 \\approx 1.39$ hours, at which the population has reached exactly $200$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];var P=[];for(var i=0;i<=100;i++){var ti=i*0.1;t.push(ti);P.push(100*Math.exp(0.5*ti));}
var curve={x:t,y:P,mode:'lines',name:'P(t) = 100·e^(0.5t)',line:{color:'#22c55e',width:2.5}};
var T2=Math.log(2)/0.5;
var vline={x:[T2,T2],y:[0,200],mode:'lines',name:'doubling time T₂',line:{color:'#fbbf24',width:2,dash:'dash'}};
var hline={x:[0,T2],y:[200,200],mode:'lines',name:'P = 200',line:{color:'#fbbf24',width:1.5,dash:'dot'},showlegend:false};
var dot={x:[T2],y:[200],mode:'markers',name:'(T₂, 200)',marker:{size:10,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (hours)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'population P(t)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-popgrowth-en',[curve,vline,hline,dot],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Worked Example — Compound Interest</h2>

<p class="l-text">A bank quotes an annual interest rate $r$. If the interest is paid <em>once a year</em>, the balance after $t$ years is $A = P_0 (1 + r)^t$. If the bank compounds $n$ times per year — quarterly $(n=4)$, monthly $(n=12)$, daily $(n=365)$ — the formula becomes</p>

<div class="calc-formula"><div class="formula-main">$$A(t) \\;=\\; P_0 \\left(1 + \\frac{r}{n}\\right)^{n t}.$$</div></div>

<p class="l-text">Pushing $n \\to \\infty$ gives <strong>continuous compounding</strong>, and the formula simplifies dramatically using the limit definition of $e$:</p>

<div class="calc-formula"><div class="formula-label">CONTINUOUS COMPOUNDING</div><div class="formula-main">$$A(t) \\;=\\; \\lim_{n \\to \\infty} P_0 \\left(1 + \\frac{r}{n}\\right)^{n t} \\;=\\; P_0 \\, e^{r t}.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>You deposit 10,000 TL at 8% annual interest.</strong> Compare the balance after 5 years under three compounding schemes: annual, monthly, continuous.<br><br><strong>Annual</strong> ($n = 1$): $A = 10000 \\cdot 1.08^5 \\approx 10000 \\cdot 1.4693 = \\mathbf{14{,}693}$ TL.<br><br><strong>Monthly</strong> ($n = 12$): $A = 10000 \\cdot \\left(1 + 0.08/12\\right)^{60} \\approx 10000 \\cdot 1.4898 = \\mathbf{14{,}898}$ TL.<br><br><strong>Continuous</strong> ($n \\to \\infty$): $A = 10000 \\cdot e^{0.08 \\cdot 5} = 10000 \\cdot e^{0.4} \\approx 10000 \\cdot 1.4918 = \\mathbf{14{,}918}$ TL.<br><br>The difference between monthly and continuous compounding is only about 20 TL out of nearly 15,000 — for most practical purposes monthly is already indistinguishable from continuous.</div></div>

<div class="calc-graph"><div id="plot-l35-compound-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same 10,000 TL deposit at 8% annual rate under three compounding schemes — annual (stepped), monthly (slightly smoother), and continuous (smooth). All three end very close to one another after 20 years; continuous compounding is the upper envelope.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=200;i++)t.push(i*0.1);
var annual=t.map(function(v){return 10000*Math.pow(1.08,Math.floor(v));});
var monthly=t.map(function(v){return 10000*Math.pow(1+0.08/12,12*v);});
var cont=t.map(function(v){return 10000*Math.exp(0.08*v);});
var ta={x:t,y:annual,mode:'lines',name:'annual (n=1)',line:{color:'#3b82f6',width:2,shape:'hv'}};
var tm={x:t,y:monthly,mode:'lines',name:'monthly (n=12)',line:{color:'#22c55e',width:2}};
var tc={x:t,y:cont,mode:'lines',name:'continuous (n→∞)',line:{color:'#c084fc',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (years)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'balance (TL)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:70},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-compound-en',[ta,tm,tc],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Worked Example — Radioactive Decay and Half-Life</h2>

<p class="l-text">A radioactive isotope decays according to $N(t) = N_0 \\, e^{-\\lambda t}$, where $\\lambda > 0$ is the <em>decay constant</em> and $N_0$ is the number of nuclei at $t = 0$. The <strong>half-life</strong> $T_{1/2}$ is the time at which exactly half the original nuclei remain:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{N_0}{2} \\;=\\; N_0 \\, e^{-\\lambda T_{1/2}} \\quad \\Longrightarrow \\quad e^{-\\lambda T_{1/2}} = \\frac{1}{2} \\quad \\Longrightarrow \\quad T_{1/2} = \\frac{\\ln 2}{\\lambda}.$$</div></div>

<p class="l-text">Half-life is a characteristic of the isotope, not the sample size: a gram of Carbon-14 and a tonne of Carbon-14 both halve in the same 5730 years. This is the key fact behind <em>radiocarbon dating</em>.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Carbon-14 has a half-life of $T_{1/2} = 5730$ years.</strong> A fossil bone is found to contain 30% of the Carbon-14 that a living organism would have. How old is the fossil?<br><br><strong>Step 1.</strong> Find the decay constant: $\\lambda = \\dfrac{\\ln 2}{5730} \\approx 1.21 \\times 10^{-4}$ per year.<br><br><strong>Step 2.</strong> Solve $0.30 \\, N_0 = N_0 \\, e^{-\\lambda t}$ for $t$:<br>$$0.30 = e^{-\\lambda t} \\;\\Longrightarrow\\; -\\lambda t = \\ln 0.30 \\;\\Longrightarrow\\; t = \\frac{-\\ln 0.30}{\\lambda} = \\frac{1.204}{1.21 \\times 10^{-4}} \\approx \\mathbf{9{,}950 \\text{ years}}.$$<br><br>The fossil is approximately 9,950 years old. Sanity check: 30% remaining is between half (one half-life, 5,730 yr) and a quarter (two half-lives, 11,460 yr), so the age should lie between those two — and $9{,}950$ does.</div></div>

<h2 class="lesson-title">10. Classical Exercises</h2>

<div class="calc-example"><div class="example-label">EXERCISES — try, then check below</div><div class="example-body">
<strong>E1.</strong> Sketch $y = 2^x$ and $y = 2^{-x}$ on the same axes. Mark the points $(0,1)$, $(1,2)$, $(-1,1/2)$.<br><br>
<strong>E2.</strong> Simplify $\\dfrac{9^x \\cdot 3^{x+1}}{27^{x-1}}$.<br><br>
<strong>E3.</strong> Solve $5^{2x-1} = 125$.<br><br>
<strong>E4.</strong> Solve $4^x - 6 \\cdot 2^x + 8 = 0$.<br><br>
<strong>E5.</strong> Solve the inequality $\\left(\\dfrac{1}{3}\\right)^x < 27$.<br><br>
<strong>E6.</strong> A population of bacteria triples every 4 hours, starting from $P_0 = 500$. (a) Write $P(t)$ as $P_0 \\, e^{r t}$ for the appropriate $r$. (b) Find $P(10)$. (c) How long until the population reaches one million?
</div></div>

<div class="think-box"><div class="think-label">ANSWERS</div><div class="think-body">
<strong>E1.</strong> Mirror reflections across the $y$-axis. Both pass through $(0,1)$; $2^x$ also through $(1,2)$, $2^{-x}$ through $(-1,2)$.<br><br>
<strong>E2.</strong> Bases all powers of $3$: $9 = 3^2$, $27 = 3^3$. Expression $= \\dfrac{3^{2x} \\cdot 3^{x+1}}{3^{3x-3}} = \\dfrac{3^{3x+1}}{3^{3x-3}} = 3^{4} = 81$.<br><br>
<strong>E3.</strong> $125 = 5^3$, so $5^{2x-1} = 5^3 \\Rightarrow 2x - 1 = 3 \\Rightarrow x = 2$.<br><br>
<strong>E4.</strong> Let $u = 2^x$. Then $u^2 - 6u + 8 = 0$, factoring as $(u-2)(u-4) = 0$, so $u = 2$ or $u = 4$. Back-substitute: $2^x = 2 \\Rightarrow x = 1$; $2^x = 4 \\Rightarrow x = 2$. Answer: $x = 1$ or $x = 2$.<br><br>
<strong>E5.</strong> Rewrite $27 = 3^3 = (1/3)^{-3}$. Inequality $(1/3)^x < (1/3)^{-3}$. Base $< 1$, so flip: $x > -3$.<br><br>
<strong>E6.</strong> (a) Tripling every 4 hours: $3 = e^{4r} \\Rightarrow r = \\ln 3 / 4 \\approx 0.2747$ per hour. So $P(t) = 500 \\, e^{0.2747\\,t}$. (b) $P(10) = 500 \\, e^{2.747} \\approx 500 \\cdot 15.59 \\approx 7{,}794$. (c) Solve $500 \\, e^{0.2747\\,t} = 10^6$: $e^{0.2747\\,t} = 2000$, so $t = \\ln 2000 / 0.2747 \\approx 7.601 / 0.2747 \\approx 27.7$ hours.
</div></div>

<div class="lesson-outcomes" style="background:rgba(192,132,252,0.06);border-left:3px solid #c084fc;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c084fc;margin-bottom:0.6rem">LESSON RECAP</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$y = a^x$ with $a > 0$, $a \\neq 1$ is the exponential function. Domain $\\mathbb{R}$, range $(0, \\infty)$, passes through $(0, 1)$.</li>
<li>Increasing for $a > 1$, decreasing for $0 < a < 1$. The graph hugs $y = 0$ as a horizontal asymptote.</li>
<li>Three identities power everything: $a^x a^y = a^{x+y}$, $(a^x)^y = a^{xy}$, $a^0 = 1$.</li>
<li>The natural base $e \\approx 2.71828$ is the unique base whose derivative at $x = 0$ is $1$; equivalently, $(e^x)' = e^x$.</li>
<li>Exponential equations: match bases or take logs. For exponential inequalities, flip the direction when $0 < a < 1$.</li>
<li>The growth/decay law $P(t) = P_0 \\, e^{rt}$ governs population, compound interest, and radioactive decay; half-life and doubling time both equal $\\ln 2 / |r|$.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şimdiye kadar tanıştığın her fonksiyon, oldukça uysal biçimde büyüyordu.</strong> Doğrusal fonksiyonlar her adımda sabit bir miktar ekler. İkinci dereceden fonksiyonlar hızlanır, ama yalnızca kare olarak — girdiyi iki katına çıkar, çıktı dört katına çıkar. Üçüncü dereceden $x^3$ bile yönetilebilir görünür. Bu derste tanışacağımız fonksiyon ise polinom dünyasından tamamen çıkar. <em>Çıktısı</em>, her bir birimlik girdi artışında sabit bir çarpanla büyüyen fonksiyondur. Adı <strong>üstel fonksiyon</strong>dur, ve onu anladığında her yerde göreceksin — bileşik faiz işleten banka hesapları, bakteri popülasyonları, bir fincan kahvenin soğuması, radyoaktif numune bozunması, hatta türev hesabının kendisinin tercih ettiği değişim ifadesi.</p>

<p class="l-text">Bu derste $y = a^x$ fonksiyonunu sıfırdan inşa edeceğiz. Farklı $a$ taban değerleri için grafiğini çizeceğiz, cebirsel özelliklerini türeteceğiz, özel sayı $e \\approx 2.71828$ ile tanışacağız, üstel denklem ve eşitsizlik çözmeyi öğreneceğiz ve son olarak fonksiyonu iki amiral fiziksel modele uygulayacağız: bileşik faiz ve radyoaktif bozunma. Ders sonunda bir üstel modeli ilk bakışta okuyabilecek ve doğru aracı — logaritma, oran, yarı-ömür formülü — tereddütsüz seçebileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(192,132,252,0.06);border-left:3px solid #c084fc;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c084fc;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üstel fonksiyon $y = a^x$'i $a > 0$, $a \\neq 1$ koşuluyla tanımlamayı; tanım kümesi ve görüntü kümesini söylemeyi</li>
<li>$a > 1$ (artan) ve $0 < a < 1$ (azalan) durumlarında grafiği çizmeyi ve $y = 0$ yatay asimptotunu tanımayı</li>
<li>Üç temel özdeşliği uygulamayı: $a^x \\cdot a^y = a^{x+y}$, $(a^x)^y = a^{xy}$, $a^0 = 1$</li>
<li>$e$ sayısının neden özel olduğunu — $x = 0$ noktasındaki teğet eğimi tam olarak $1$ olan tek taban olmasını — anlamayı</li>
<li>Üstel denklemleri taban eşitleyerek veya logaritma alarak çözmeyi</li>
<li>Büyüme yasası $P(t) = P_0 \\, e^{rt}$'yi bileşik faize, nüfus büyümesine ve radyoaktif bozunmaya (yarı-ömür) uygulamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Üstel Fonksiyon Tanımı</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir satranç tahtasının ilk karesine tek bir pirinç tanesi koy, ikinciye iki tane, üçüncüye dört, dördüncüye sekiz — her kare öncekini ikiye katlasın. 64. kareye geldiğinde, Dünya'da şimdiye kadar yetiştirilmiş tüm pirinçten daha fazlasını borçlanmış olursun. İşte üstel büyüme bu: her adımda <em>aynı çarpan</em>, saçma kadar küçük bir başlangıcı astronomik bir toplama dönüştürür.</div>

<p class="l-text">Resmi olarak bir <strong>üstel fonksiyon</strong> şu biçimdedir:</p>

<div class="calc-formula"><div class="formula-label">ÜSTEL FONKSİYON &mdash; TANIM</div><div class="formula-main">$$f(x) \\;=\\; a^x, \\qquad a > 0, \\; a \\neq 1, \\; x \\in \\mathbb{R}.$$</div><div class="formula-sub">$a$ sabitine <em>taban</em> denir. Değişken $x$ üstte (üs konumunda) durur — fonksiyonu polinom değil üstel yapan budur.</div></div>

<p class="l-text">Tanımdaki üç koşula dair üç not. İlk olarak $a > 0$ şart, çünkü negatif taban tamsayı olmayan üsler için $a^x$'i tanımsız kılar (örneğin $(-1)^{1/2}$ — gerçek değeri yok). İkinci olarak $a = 1$'i dışlıyoruz, çünkü $1^x = 1$ her $x$ için doğrudur, bu da sadece sabit fonksiyondur ve ilginç bir davranış taşımaz. Üçüncü olarak $a \\neq 0$ zaten $a > 0$'a dahildir; $0^0$ ise tartışmalıdır. Bunun dışında — $1$'den farklı her pozitif taban — gerçek bir üstel fonksiyon verir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Taban $a$</div><div class="card-body">Üzerine değişken üs yazdığımız sabit pozitif sayı. Problemlerde tipik seçimler: $2, 3, 10, e$. Her taban farklı şekilli bir eğri verir.</div></div>
<div class="calc-card"><div class="card-title">Üs $x$</div><div class="card-body">Değişken. Herhangi bir gerçek sayı olabilir — pozitif, negatif, sıfır, tamsayı, kesirli, irrasyonel. Üstel fonksiyon $\\mathbb{R}$ üzerinde tanımlıdır.</div></div>
<div class="calc-card"><div class="card-title">Çıktı $a^x$</div><div class="card-body">Her zaman kesinlikle pozitiftir. Sıfıra ulaşmaz, altına inmez. Görüntü kümesi $(0, \\infty)$'dir.</div></div>
</div>

<p class="l-text"><strong>Polinom vs üstel — küçük bir karşılaştırma.</strong> $g(x) = x^{10}$ fonksiyonu polinomdur: değişken tabanda, üs sabittir. $f(x) = 10^x$ fonksiyonu üsteldir: taban sabit, değişken üstedir. Yüzeyde benzer görünürler ama polinom derecesi ne kadar yüksek olursa olsun, $f$ uzun vadede $g$'yi geçer. Üstel büyüme uzun vadede her zaman kazanır.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Her birinin üstel olup olmadığına karar ver: (a) $y = x^3$, (b) $y = 3^x$, (c) $y = x^x$, (d) $y = 5 \\cdot 2^x$. Cevaplar: (a) polinom, üstel değil; (b) tabanı $3$ olan üstel; (c) hiçbiri — hem taban hem üs değişiyor; (d) çarpımsal sabitli üstel (bunlara 7. bölümde izin vereceğiz).</div></div>

<h2 class="lesson-title">2. $y = a^x$ Grafiği</h2>

<div class="calc-highlight">İki durum vardır ve birbirinin $y$-eksenine göre ayna yansımasıdır. $a > 1$ iken fonksiyon <strong>artar</strong>. $0 < a < 1$ iken fonksiyon <strong>azalır</strong>. Her iki durumda da grafik $(0, 1)$ noktasından geçer (çünkü $a^0 = 1$) ve bir tarafta $x$-eksenini yatay asimptot olarak takip eder.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DURUM $a > 1$ — BÜYÜME</div><div class="compare-item">Monoton <strong>artan</strong></div><div class="compare-item">$\\lim_{x \\to -\\infty} a^x = 0$ (solda $y = 0$ asimptotu)</div><div class="compare-item">$\\lim_{x \\to +\\infty} a^x = +\\infty$</div><div class="compare-item">Örnekler: $2^x$, $e^x$, $10^x$</div></div><div class="compare-col"><div class="compare-title">DURUM $0 < a < 1$ — AZALMA</div><div class="compare-item">Monoton <strong>azalan</strong></div><div class="compare-item">$\\lim_{x \\to -\\infty} a^x = +\\infty$</div><div class="compare-item">$\\lim_{x \\to +\\infty} a^x = 0$ (sağda $y = 0$ asimptotu)</div><div class="compare-item">Örnekler: $(1/2)^x$, $(1/e)^x$, $(0.9)^x$</div></div></div>

<p class="l-text">Bazı özellikler, taban $1$'in hangi tarafında olursa olsun, <em>her</em> üstel fonksiyon için geçerlidir:</p>

<ul class="l-text" style="line-height:1.7">
<li><strong>Her zaman pozitif.</strong> $a^x > 0$ her gerçek $x$ için. Grafik $x$-eksenine değmez veya geçmez.</li>
<li><strong>$(0, 1)$ noktasından geçer.</strong> $a^0 = 1$ olduğu için her üstel eğri $y$-eksenine $1$ yüksekliğinden çarpar.</li>
<li><strong>$(1, a)$ noktasından geçer.</strong> Faydalı bir ikinci sabit nokta — $x = 1$ koyarak grafikten doğrudan tabanı okuyabilirsin.</li>
<li><strong>Yatay asimptot $y = 0$.</strong> Eğrinin bir tarafı sıfıra hiç değmeden yaklaşarak düzleşir.</li>
<li><strong>Tanım kümesi $\\mathbb{R}$, görüntü kümesi $(0, \\infty)$.</strong> Girdi herhangi bir gerçek sayı; çıktı kesinlikle pozitif.</li>
<li><strong>Bire-bir (injektif).</strong> Farklı girdiler farklı çıktılar verir, dolayısıyla fonksiyonun tersi vardır — bir sonraki derste tanışacağımız <em>logaritma</em>.</li>
</ul>

<div class="calc-graph"><div id="plot-l35-bases-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aynı eksen üzerinde üç üstel eğri $y = 2^x$, $y = e^x$ ve $y = 10^x$. Üçü de $(0, 1)$'den geçiyor, üçü de artıyor, ama büyüme hızları çok farklı — $10^x$ görünür pencereyi hızla terk ediyor, $2^x$ ise daha yumuşak yükseliyor. Taban dikliği kontrol eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-30;i<=20;i++)x.push(i/10);
var y2=x.map(function(v){return Math.pow(2,v);});
var ye=x.map(function(v){return Math.exp(v);});
var y10=x.map(function(v){return Math.pow(10,v);});
var t2={x:x,y:y2,mode:'lines',name:'y = 2^x',line:{color:'#3b82f6',width:2.5}};
var te={x:x,y:ye,mode:'lines',name:'y = e^x',line:{color:'#c084fc',width:2.5}};
var t10={x:x,y:y10,mode:'lines',name:'y = 10^x',line:{color:'#f87171',width:2.5}};
var anchor={x:[0],y:[1],mode:'markers',name:'(0,1) ortak nokta',marker:{size:9,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,2]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-1,12]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-bases-tr',[t2,te,t10,anchor],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l35-decay-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> azalan üstel $y = (1/2)^x$ ile onun ayna ikizi $y = 2^x$. İkisi $y$-eksenine göre birbirinin yansımasıdır. İkisi de $(0, 1)$'den geçer, ama azalan eğri solda sonsuza, sağda sıfıra gider — büyüyen eğrinin tam tersi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-30;i<=30;i++)x.push(i/10);
var ygrow=x.map(function(v){return Math.pow(2,v);});
var ydecay=x.map(function(v){return Math.pow(0.5,v);});
var tg={x:x,y:ygrow,mode:'lines',name:'y = 2^x (büyüme)',line:{color:'#3b82f6',width:2.5}};
var td={x:x,y:ydecay,mode:'lines',name:'y = (1/2)^x (azalma)',line:{color:'#f87171',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.5,8]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-decay-tr',[tg,td],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden ayna?</strong> Çünkü $(1/a)^x = a^{-x}$. Herhangi bir fonksiyonda $x$ yerine $-x$ koymak grafiği $y$-eksenine göre yansıtır. Yani azalma eğrisi tam olarak büyüme eğrisinin soldan sağa çevrilmiş halidir.</div>

<h2 class="lesson-title">3. Üç Temel Özdeşlik</h2>

<p class="l-text">Üstellerin her cebirsel manipülasyonu, tamsayı üslerle çalışırken zaten bildiğin üç özdeşliğin birleştirilmesine indirgenir. Şaşırtıcı olan şu: bu özdeşlikler üs herhangi bir gerçek sayı olduğunda da — sadece tamsayı veya kesir değil — <em>hâlâ geçerlidir</em>.</p>

<div class="calc-formula"><div class="formula-label">ÇARPIM, ÜSSÜN ÜSSÜ, SIFIR</div><div class="formula-main">$$a^x \\cdot a^y = a^{x+y}, \\qquad (a^x)^y = a^{xy}, \\qquad a^0 = 1.$$</div><div class="formula-sub">Aynı tabanlı iki üssün çarpımı üsleri toplar. Üssün üssü üsleri çarpar. Herhangi bir tabanın sıfırıncı kuvveti $1$'dir.</div></div>

<p class="l-text">Bu üçünden gerisini türetiriz. <em>Bölüm</em> kuralı, negatif üslü çarpım kuralından gelir:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{a^x}{a^y} = a^x \\cdot a^{-y} = a^{x-y}, \\qquad a^{-x} = \\frac{1}{a^x}.$$</div></div>

<p class="l-text"><em>Farklı taban çarpım</em> kuralı:</p>

<div class="calc-formula"><div class="formula-main">$$a^x \\cdot b^x = (ab)^x, \\qquad \\frac{a^x}{b^x} = \\left(\\frac{a}{b}\\right)^x.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Sadeleştir:</strong> $\\dfrac{2^{x+3} \\cdot 4^x}{8^{x-1}}$.<br><br>Her tabanı $2$'nin kuvveti olarak yaz: $4 = 2^2$ ve $8 = 2^3$. O zaman<br>$$\\frac{2^{x+3} \\cdot (2^2)^x}{(2^3)^{x-1}} \\;=\\; \\frac{2^{x+3} \\cdot 2^{2x}}{2^{3x-3}} \\;=\\; \\frac{2^{3x+3}}{2^{3x-3}} \\;=\\; 2^{(3x+3) - (3x-3)} \\;=\\; 2^6 \\;=\\; 64.$$<br>$x$ değişkeni tamamen kaybolur — ifade sabit $64$'e sadeleşir.</div></div>

<div class="think-box"><div class="think-label">HIZLI ALIŞTIRMA</div><div class="think-body">Hesap makinesi kullanmadan hesapla: (a) $9^{1/2}$, (b) $2^{-3}$, (c) $27^{2/3}$, (d) $5^{0}$. Cevaplar: (a) $3$, (b) $1/8$, (c) $9$, (d) $1$.</div></div>

<h2 class="lesson-title">4. Doğal Taban $e$</h2>

<div class="calc-highlight"><strong>Tüm olası tabanlar arasında bir tanesi matematiksel olarak özeldir:</strong> İsviçreli matematikçi <em>Leonhard Euler</em>'in adıyla anılan $e \\approx 2.71828\\,18284\\,59045\\ldots$ sayısı. İrrasyoneldir (ondalığı tekrar etmez) ve aşkındır (tam sayı katsayılı hiçbir polinomun kökü değildir). Buna rağmen türev hesabının en doğal taban seçimidir — fizikte, biyolojide ve finansta her üstel büyüme yasası $e$ ile yazılmayı tercih eder.</div>

<p class="l-text">$e$ neden özel? En temiz görme yolu geometriktir. Her $a$ tabanı için, $y = a^x$ eğrisinin $x = 0$ noktasında bir eğimi olan teğet doğrusu vardır. Birkaç değer dene: $a = 2$ için $x = 0$ noktasındaki eğim yaklaşık $0.693$; $a = 3$ için yaklaşık $1.099$. $a = 2$ ile $a = 3$ arasında bir yerde, $x = 0$'daki teğet eğimi tam olarak $1$ olan bir taban vardır. O taban $e$'dir.</p>

<div class="calc-formula"><div class="formula-label">$e$'NİN TANIMLAYICI ÖZELLİĞİ</div><div class="formula-main">$$\\frac{d}{dx} e^x \\Big|_{x=0} \\;=\\; 1, \\qquad \\text{eşdeğer olarak} \\qquad \\frac{d}{dx} e^x \\;=\\; e^x.$$</div><div class="formula-sub">$e^x$, kendi türevine eşit olan tek üstel fonksiyondur. Bu tek özellik $e$'yi türev hesabının doğal tabanı yapar.</div></div>

<p class="l-text">$e$'yi tanımlamanın ikinci, eşit derecede ünlü bir yolu — 8. bölümde ayrıntılı tanışacağımız bileşik faiz aracılığıyla:</p>

<div class="calc-formula"><div class="formula-main">$$e \\;=\\; \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\;=\\; 1 + \\frac{1}{1!} + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!} + \\cdots$$</div></div>

<p class="l-text">İki formül de aynı sayıya yakınsar: $e \\approx 2.71828$. Birincisi %100 yıllık faizin sürekli bileşiklenmesinden doğar; ikincisi $x = 1$ noktasında $e^x$'in Taylor serisidir. Aynı sabit için iki tamamlayıcı sezgi verirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$e \\approx 2.71828$</div><div class="card-body">İrrasyonel, aşkın. Hesap makinesi yasak olan her sınav için ezberlenmesi gereken beş ondalıklı değer.</div></div>
<div class="calc-card"><div class="card-title">$(e^x)' = e^x$</div><div class="card-body">Fonksiyon kendi türevine eşittir. Bu yüzden $e$ türev-dostu tabandır ve her büyüme yasası onu kullanır.</div></div>
<div class="calc-card"><div class="card-title">$\\ln$ = $e^x$'in tersi</div><div class="card-body">$\\ln x$ olarak yazılan doğal logaritma, tabanı $e$ olan logaritmadır. Bir sonraki derste tanışacağız.</div></div>
</div>

<h2 class="lesson-title">5. Üstel Denklemler</h2>

<p class="l-text">Bir <strong>üstel denklem</strong>, bilinmeyenin üs konumunda bulunduğu denklemdir. Çözüm için iki temel strateji vardır.</p>

<div class="calc-formula"><div class="formula-label">STRATEJİ 1 — TABANLARI EŞİTLE</div><div class="formula-main">$$a^{f(x)} = a^{g(x)} \\quad \\iff \\quad f(x) = g(x), \\qquad (a > 0, \\; a \\neq 1).$$</div><div class="formula-sub">İki tarafı aynı tabanın kuvveti olarak yazabilirsen, üsler eşit olmalıdır. $2$, $3$, $5$, $10$ gibi küçük bir tabanın temiz kuvvetleri olduğunda bunu kullan.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK (taban eşitleme)</div><div class="example-body"><strong>Çöz:</strong> $2^{x+1} = 16$.<br><br>$16 = 2^4$ olduğunu fark et. Denklem $2^{x+1} = 2^4$ olur. Taban eşitleme kuralıyla $x + 1 = 4$, yani $\\boxed{x = 3}$.<br><br>Kontrol: $2^{3+1} = 2^4 = 16$. ✓</div></div>

<div class="calc-formula"><div class="formula-label">STRATEJİ 2 — LOGARİTMA AL</div><div class="formula-main">$$a^{f(x)} = b \\quad \\iff \\quad f(x) \\;=\\; \\log_a b \\;=\\; \\frac{\\ln b}{\\ln a}.$$</div><div class="formula-sub">Taban eşitleme temiz değilse, iki tarafa $\\log$ (veya $\\ln$) uygula. Bu, üssü çarpan olarak aşağı indirir ve denklem $x$'te doğrusal (veya polinom) olur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK (logaritma alma)</div><div class="example-body"><strong>Çöz:</strong> $3^x = 20$.<br><br>$20$, $3$'ün temiz bir kuvveti değil, iki tarafın $\\ln$'ini al:<br>$$\\ln(3^x) = \\ln 20 \\quad \\Longrightarrow \\quad x \\ln 3 = \\ln 20 \\quad \\Longrightarrow \\quad x = \\frac{\\ln 20}{\\ln 3} \\approx \\frac{2.996}{1.099} \\approx 2.727.$$<br>Kontrol: $3^{2.727} \\approx 20.0$. ✓</div></div>

<p class="l-text"><strong>Yaygın bir alt tür — yerine koyma.</strong> $2^{2x} - 5 \\cdot 2^x + 4 = 0$ gibi denklemler ilk bakışta korkutucu görünse de, $u = 2^x$ yerine koymasıyla sıradan ikinci dereceden denkleme dönüşür:</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK (yerine koyma)</div><div class="example-body"><strong>Çöz:</strong> $2^{2x} - 5 \\cdot 2^x + 4 = 0$.<br><br>$u = 2^x$ koyalım. Dikkat: $2^{2x} = (2^x)^2 = u^2$. Denklem $u^2 - 5u + 4 = 0$ olur ve $(u - 1)(u - 4) = 0$ olarak çarpanlara ayrılır, böylece $u = 1$ veya $u = 4$.<br><br>Geri yerleştir. $u = 1$ verir $2^x = 1 \\Rightarrow x = 0$. $u = 4$ verir $2^x = 4 \\Rightarrow x = 2$.<br><br>$\\boxed{x = 0 \\text{ ya da } x = 2}$.</div></div>

<h2 class="lesson-title">6. Üstel Eşitsizlikler</h2>

<p class="l-text">Üstel <em>eşitsizlik</em> $a^{f(x)} \\leq a^{g(x)}$ biçimindedir. Teknik denklemlerle aynıdır — tabanları eşitle — ama eşitsizliğin yönüne dair kritik bir incelik vardır.</p>

<div class="calc-formula"><div class="formula-label">MONOTONLUK KURALI</div><div class="formula-main">$$a^{f(x)} \\;\\leq\\; a^{g(x)} \\quad \\iff \\quad \\begin{cases} f(x) \\leq g(x), & a > 1, \\\\[4pt] f(x) \\geq g(x), & 0 < a < 1. \\end{cases}$$</div><div class="formula-sub">$a > 1$ olduğunda fonksiyon artandır, üsler arasındaki eşitsizlik aynı yönde gider. $0 < a < 1$ olduğunda fonksiyon azalandır, eşitsizlik <em>yön değiştirir</em>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK (taban &gt; 1)</div><div class="example-body"><strong>Çöz:</strong> $3^{x+1} > 81$.<br><br>$81 = 3^4$, yani $3^{x+1} > 3^4$. Taban $3 > 1$, eşitsizlik aynı yönde kalır: $x + 1 > 4$, yani $\\boxed{x > 3}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK (taban &lt; 1)</div><div class="example-body"><strong>Çöz:</strong> $\\left(\\dfrac{1}{2}\\right)^x \\geq 8$.<br><br>$8 = 2^3 = (1/2)^{-3}$, yani $(1/2)^x \\geq (1/2)^{-3}$. Taban $1/2 < 1$, eşitsizlik <em>yön değiştirir</em>: $x \\leq -3$. $\\boxed{x \\leq -3}$.<br><br>Mantık kontrolü: $x = -3$'te $(1/2)^{-3} = 2^3 = 8$. $x = -4$'te $(1/2)^{-4} = 16 > 8$. ✓</div></div>

<div class="l-note"><strong>Yaygın hata.</strong> Taban $0$ ile $1$ arasındayken eşitsizliği çevirmeyi unutmak. Önce tabanı belirle, sonra eşitsizliğin korunup korunmadığına karar ver.</div>

<h2 class="lesson-title">7. Büyüme ve Azalma Modelleri</h2>

<div class="calc-highlight"><strong>Aynı formül üç çok farklı fiziksel durumu yönetir:</strong> sürekli bileşiklenen bir banka hesabı, her saat ikiye katlanan bir bakteri popülasyonu, ve çekirdekleri sabit oranda bozunan bir radyoaktif numune. Her durumda değişim hızı mevcut miktarla orantılıdır ve çözüm bir üsteldir.</div>

<div class="calc-formula"><div class="formula-label">SÜREKLİ ÜSTEL BÜYÜME / AZALMA</div><div class="formula-main">$$P(t) \\;=\\; P_0 \\, e^{r t},$$</div><div class="formula-sub">$P(t)$ $t$ anındaki miktar; $P_0 = P(0)$ başlangıç miktarı; $r$ sürekli orandır. $r > 0$ büyüme, $r < 0$ azalma verir.</div></div>

<p class="l-text">$r$ sabiti <strong>sürekli (anlık) oran</strong>dır. "Birim zamanda mevcut miktarın hangi oranı eklenir (veya kaybedilir)?" sorusunun cevabıdır. Nüfuslar için $r$ yıllık $0.02$ olabilir (%2 büyüme); sürekli bileşik olarak %5 nominal faiz veren bir hesap için $r = 0.05$; 1000 yıl yarı-ömürlü bir radyoaktif izotop için $r$, 9. bölümde türeteceğimiz belirli küçük negatif bir sayıdır.</p>

<p class="l-text">Model aslında $\\dfrac{dP}{dt} = r \\, P(t)$ diferansiyel denklemine eşdeğerdir — değişim hızı miktarla orantılıdır. Burada o denklemi çözmeyeceğiz, ama sonucu kaydediyoruz: ikiye katlanma süresi ve yarı-ömür sabittir, başlangıç miktarından bağımsızdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İkiye katlanma süresi (büyüme, $r > 0$)</div><div class="card-body">$T_2 = \\dfrac{\\ln 2}{r}$. Popülasyonun iki katına çıkma süresi. $e^{r T_2} = 2$ denkleminin çözümü.</div></div>
<div class="calc-card"><div class="card-title">Yarı-ömür (azalma, $r < 0$)</div><div class="card-body">$T_{1/2} = \\dfrac{\\ln 2}{|r|}$. Numunenin yarıya düşme süresi. $e^{r T_{1/2}} = 1/2$ denkleminin çözümü.</div></div>
<div class="calc-card"><div class="card-title">"70 Kuralı"</div><div class="card-body">Küçük $r$ için (yüzde birkaç), $T_2 \\approx 70 / (100 r)$ yıl — bankacıların kullandığı kullanışlı zihinsel kestirme.</div></div>
</div>

<div class="calc-graph"><div id="plot-l35-popgrowth-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $P_0 = 100$ ile başlayan bir bakteri popülasyonu, saatte $r = 0.5$ oranıyla büyüyor: $P(t) = 100 \\, e^{0.5 t}$. Dikey kesik çizgi $T_2 = \\ln 2 / 0.5 \\approx 1.39$ saat olan ikiye katlanma süresini gösterir; bu noktada popülasyon tam olarak $200$'e ulaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];var P=[];for(var i=0;i<=100;i++){var ti=i*0.1;t.push(ti);P.push(100*Math.exp(0.5*ti));}
var curve={x:t,y:P,mode:'lines',name:'P(t) = 100·e^(0.5t)',line:{color:'#22c55e',width:2.5}};
var T2=Math.log(2)/0.5;
var vline={x:[T2,T2],y:[0,200],mode:'lines',name:'ikiye katlanma süresi T₂',line:{color:'#fbbf24',width:2,dash:'dash'}};
var hline={x:[0,T2],y:[200,200],mode:'lines',name:'P = 200',line:{color:'#fbbf24',width:1.5,dash:'dot'},showlegend:false};
var dot={x:[T2],y:[200],mode:'markers',name:'(T₂, 200)',marker:{size:10,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (saat)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'popülasyon P(t)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-popgrowth-tr',[curve,vline,hline,dot],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Çözümlü Örnek — Bileşik Faiz</h2>

<p class="l-text">Bir banka yıllık $r$ faiz oranı duyurur. Faiz <em>yılda bir kez</em> ödenirse, $t$ yıl sonraki bakiye $A = P_0 (1 + r)^t$ olur. Banka yılda $n$ kez bileşiklerse — üç ayda bir $(n=4)$, ayda bir $(n=12)$, günlük $(n=365)$ — formül şu olur:</p>

<div class="calc-formula"><div class="formula-main">$$A(t) \\;=\\; P_0 \\left(1 + \\frac{r}{n}\\right)^{n t}.$$</div></div>

<p class="l-text">$n \\to \\infty$ limiti almak <strong>sürekli bileşiklemeyi</strong> verir ve formül $e$'nin limit tanımı kullanılarak dramatik biçimde sadeleşir:</p>

<div class="calc-formula"><div class="formula-label">SÜREKLİ BİLEŞİKLEME</div><div class="formula-main">$$A(t) \\;=\\; \\lim_{n \\to \\infty} P_0 \\left(1 + \\frac{r}{n}\\right)^{n t} \\;=\\; P_0 \\, e^{r t}.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>10.000 TL'yi %8 yıllık faizle yatırıyorsun.</strong> 5 yıl sonraki bakiyeyi üç bileşikleme şemasında karşılaştır: yıllık, aylık, sürekli.<br><br><strong>Yıllık</strong> ($n = 1$): $A = 10000 \\cdot 1.08^5 \\approx 10000 \\cdot 1.4693 = \\mathbf{14{.}693}$ TL.<br><br><strong>Aylık</strong> ($n = 12$): $A = 10000 \\cdot \\left(1 + 0.08/12\\right)^{60} \\approx 10000 \\cdot 1.4898 = \\mathbf{14{.}898}$ TL.<br><br><strong>Sürekli</strong> ($n \\to \\infty$): $A = 10000 \\cdot e^{0.08 \\cdot 5} = 10000 \\cdot e^{0.4} \\approx 10000 \\cdot 1.4918 = \\mathbf{14{.}918}$ TL.<br><br>Aylık ile sürekli arasındaki fark yaklaşık 15.000 TL'nin sadece 20 TL'si — pratikte aylık bileşikleme zaten sürekliye eştir.</div></div>

<div class="calc-graph"><div id="plot-l35-compound-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aynı 10.000 TL'lik %8 yıllık faizli yatırım üç bileşikleme şemasında — yıllık (basamaklı), aylık (daha pürüzsüz), sürekli (pürüzsüz). 20 yıl sonra üçü birbirine çok yakın biter; sürekli bileşikleme üst zarftır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=200;i++)t.push(i*0.1);
var annual=t.map(function(v){return 10000*Math.pow(1.08,Math.floor(v));});
var monthly=t.map(function(v){return 10000*Math.pow(1+0.08/12,12*v);});
var cont=t.map(function(v){return 10000*Math.exp(0.08*v);});
var ta={x:t,y:annual,mode:'lines',name:'yıllık (n=1)',line:{color:'#3b82f6',width:2,shape:'hv'}};
var tm={x:t,y:monthly,mode:'lines',name:'aylık (n=12)',line:{color:'#22c55e',width:2}};
var tc={x:t,y:cont,mode:'lines',name:'sürekli (n→∞)',line:{color:'#c084fc',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (yıl)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'bakiye (TL)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:70},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l35-compound-tr',[ta,tm,tc],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Çözümlü Örnek — Radyoaktif Bozunma ve Yarı-Ömür</h2>

<p class="l-text">Bir radyoaktif izotop $N(t) = N_0 \\, e^{-\\lambda t}$ kuralına göre bozunur; burada $\\lambda > 0$ <em>bozunma sabiti</em>, $N_0$ ise $t = 0$ anındaki çekirdek sayısıdır. <strong>Yarı-ömür</strong> $T_{1/2}$, başlangıçtaki çekirdeklerin tam yarısının kaldığı zamandır:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{N_0}{2} \\;=\\; N_0 \\, e^{-\\lambda T_{1/2}} \\quad \\Longrightarrow \\quad e^{-\\lambda T_{1/2}} = \\frac{1}{2} \\quad \\Longrightarrow \\quad T_{1/2} = \\frac{\\ln 2}{\\lambda}.$$</div></div>

<p class="l-text">Yarı-ömür izotopun karakteristiğidir, numune büyüklüğüne bağlı değildir: bir gram Karbon-14 ve bir ton Karbon-14 ikisi de aynı 5730 yılda yarıya iner. Bu, <em>radyokarbon tarihleme</em> yönteminin arkasındaki temel gerçektir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Karbon-14'ün yarı-ömrü $T_{1/2} = 5730$ yıldır.</strong> Bir fosil kemikte canlı bir organizmadakinin %30'u kadar Karbon-14 bulunuyor. Fosil kaç yaşında?<br><br><strong>1. Adım.</strong> Bozunma sabitini bul: $\\lambda = \\dfrac{\\ln 2}{5730} \\approx 1.21 \\times 10^{-4}$ yıl başına.<br><br><strong>2. Adım.</strong> $0.30 \\, N_0 = N_0 \\, e^{-\\lambda t}$ denklemini $t$ için çöz:<br>$$0.30 = e^{-\\lambda t} \\;\\Longrightarrow\\; -\\lambda t = \\ln 0.30 \\;\\Longrightarrow\\; t = \\frac{-\\ln 0.30}{\\lambda} = \\frac{1.204}{1.21 \\times 10^{-4}} \\approx \\mathbf{9{.}950 \\text{ yıl}}.$$<br><br>Fosil yaklaşık 9.950 yaşındadır. Mantık kontrolü: %30 kalan, yarısı (bir yarı-ömür, 5.730 yıl) ile çeyreği (iki yarı-ömür, 11.460 yıl) arasındadır, bu yüzden yaş bu ikisinin arasında olmalı — ve $9.950$ tam orada.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMALAR — önce dene, sonra aşağıdan kontrol et</div><div class="example-body">
<strong>A1.</strong> $y = 2^x$ ve $y = 2^{-x}$ grafiklerini aynı eksende çiz. $(0,1)$, $(1,2)$, $(-1,1/2)$ noktalarını işaretle.<br><br>
<strong>A2.</strong> Sadeleştir: $\\dfrac{9^x \\cdot 3^{x+1}}{27^{x-1}}$.<br><br>
<strong>A3.</strong> Çöz: $5^{2x-1} = 125$.<br><br>
<strong>A4.</strong> Çöz: $4^x - 6 \\cdot 2^x + 8 = 0$.<br><br>
<strong>A5.</strong> Eşitsizliği çöz: $\\left(\\dfrac{1}{3}\\right)^x < 27$.<br><br>
<strong>A6.</strong> Bir bakteri popülasyonu her 4 saatte üçe katlanıyor, başlangıçta $P_0 = 500$. (a) Uygun $r$ için $P(t)$'yi $P_0 \\, e^{r t}$ olarak yaz. (b) $P(10)$'u bul. (c) Popülasyonun bir milyona ulaşması ne kadar sürer?
</div></div>

<div class="think-box"><div class="think-label">CEVAPLAR</div><div class="think-body">
<strong>A1.</strong> $y$-eksenine göre ayna yansımalar. İkisi de $(0,1)$'den geçer; $2^x$ ayrıca $(1,2)$'den, $2^{-x}$ ise $(-1,2)$'den geçer.<br><br>
<strong>A2.</strong> Tüm tabanlar $3$'ün kuvvetleri: $9 = 3^2$, $27 = 3^3$. İfade $= \\dfrac{3^{2x} \\cdot 3^{x+1}}{3^{3x-3}} = \\dfrac{3^{3x+1}}{3^{3x-3}} = 3^{4} = 81$.<br><br>
<strong>A3.</strong> $125 = 5^3$, yani $5^{2x-1} = 5^3 \\Rightarrow 2x - 1 = 3 \\Rightarrow x = 2$.<br><br>
<strong>A4.</strong> $u = 2^x$ koy. Sonra $u^2 - 6u + 8 = 0$, $(u-2)(u-4) = 0$, böylece $u = 2$ veya $u = 4$. Geri yerleştir: $2^x = 2 \\Rightarrow x = 1$; $2^x = 4 \\Rightarrow x = 2$. Cevap: $x = 1$ ya da $x = 2$.<br><br>
<strong>A5.</strong> $27 = 3^3 = (1/3)^{-3}$ olarak yeniden yaz. Eşitsizlik $(1/3)^x < (1/3)^{-3}$ olur. Taban $< 1$ olduğundan ters çevir: $x > -3$.<br><br>
<strong>A6.</strong> (a) Her 4 saatte üçe katlanıyor: $3 = e^{4r} \\Rightarrow r = \\ln 3 / 4 \\approx 0.2747$ saat başına. Yani $P(t) = 500 \\, e^{0.2747\\,t}$. (b) $P(10) = 500 \\, e^{2.747} \\approx 500 \\cdot 15.59 \\approx 7.794$. (c) $500 \\, e^{0.2747\\,t} = 10^6$'yı çöz: $e^{0.2747\\,t} = 2000$, yani $t = \\ln 2000 / 0.2747 \\approx 7.601 / 0.2747 \\approx 27.7$ saat.
</div></div>

<div class="lesson-outcomes" style="background:rgba(192,132,252,0.06);border-left:3px solid #c084fc;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c084fc;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$y = a^x$, $a > 0$, $a \\neq 1$ koşuluyla üstel fonksiyondur. Tanım kümesi $\\mathbb{R}$, görüntü kümesi $(0, \\infty)$, $(0, 1)$'den geçer.</li>
<li>$a > 1$ için artan, $0 < a < 1$ için azalan. Grafik $y = 0$ yatay asimptotunu takip eder.</li>
<li>Üç özdeşlik her şeye güç verir: $a^x a^y = a^{x+y}$, $(a^x)^y = a^{xy}$, $a^0 = 1$.</li>
<li>Doğal taban $e \\approx 2.71828$, $x = 0$'daki türevi $1$ olan tek tabandır; eşdeğer olarak $(e^x)' = e^x$.</li>
<li>Üstel denklemler: tabanları eşitle veya logaritma al. Üstel eşitsizliklerde $0 < a < 1$ iken yönü çevir.</li>
<li>Büyüme/azalma yasası $P(t) = P_0 \\, e^{rt}$ nüfusu, bileşik faizi ve radyoaktif bozunmayı yönetir; yarı-ömür ve ikiye katlanma süresi her ikisi de $\\ln 2 / |r|$'ye eşittir.</li>
</ul>
</div>`
};
