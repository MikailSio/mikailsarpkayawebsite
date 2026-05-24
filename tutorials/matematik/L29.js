/* ============================================================
   tutorials/matematik/L29.js
   Lise Matematik · Ders 29: Değişken Değiştirme (u-Substitution)
   Bilingual EN + TR · KaTeX + Plotly · NO Python, NO ML
   ============================================================ */
window.LISE_MAT_L29 = {

/* ========================================================================
   ENGLISH VERSION
   ======================================================================== */
en: `
<p class="l-text"><strong>The substitution method</strong> — also called <em>u-substitution</em> — is the single most important technique in introductory integration. It is the integral-calculus counterpart of the chain rule: where differentiation lets us peel layers <em>outward</em> through the chain rule, integration lets us push them <em>inward</em> through substitution. Almost every integral you cannot solve "by inspection" in high school will yield to a well-chosen substitution.</p>

<p class="l-text">In this lesson we make the technique concrete. We will look at the chain rule from the other direction, derive the four-step recipe, work four detailed examples, and then handle the subtle issue of changing the limits in a definite integral. By the end you should be able to spot a substitution at a glance and execute it cleanly.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the chain rule and recognise its "reverse" form as the substitution rule.</li>
<li>Pick an inner function $u = g(x)$ and compute its differential $du = g'(x)\\,dx$.</li>
<li>Execute the four-step recipe: choose $u$, compute $du$, replace, integrate, back-substitute.</li>
<li>Apply substitution to four classic patterns: $x\\,e^{x^2}$, $\\sin(3x)$, $x/\\sqrt{x^2+1}$, $\\ln x / x$.</li>
<li>Adjust the limits of a definite integral when changing variables.</li>
<li>Read a brief preview of trigonometric substitution ($x = a\\sin\\theta$).</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1
     ============================================================ -->
<h2 class="l-title">1. A Reminder: The Chain Rule</h2>

<p class="l-text">Before we reverse anything, let us recall the rule we will reverse. The <strong>chain rule</strong> tells us how to differentiate a composition of two functions:</p>

<div class="calc-formula">
<div class="formula-label">CHAIN RULE (DIFFERENTIATION)</div>
<div class="formula-main">$$\\frac{d}{dx}\\,f(g(x)) \\;=\\; f'(g(x)) \\cdot g'(x)$$</div>
<div class="formula-sub">Differentiate the outer function $f$ at the inner $g(x)$, then multiply by the derivative of the inner $g'(x)$.</div>
</div>

<p class="l-text">In one quick example, $\\dfrac{d}{dx}\\sin(x^2) = \\cos(x^2)\\cdot 2x$. The outer function is $\\sin$, the inner is $x^2$. We took $\\cos$ of the inner and multiplied by the inner's derivative $2x$.</p>

<p class="l-text">Now read that equation <em>from right to left</em>. The right side $f'(g(x))\\cdot g'(x)$ is a product of an "outer derivative evaluated at an inner function" and "the derivative of that inner function". If we ever meet such a product inside an integral, we can recognise it as the derivative of $f(g(x))$ and antidifferentiate immediately back to $f(g(x))$. That is the entire idea of substitution.</p>

<div class="calc-highlight"><strong>One-sentence summary:</strong> the substitution rule is just the chain rule written backwards. The inner function $g(x)$ gets renamed $u$ to make the bookkeeping painless.</div>

<!-- ============================================================
     SECTION 2
     ============================================================ -->
<h2 class="l-title">2. Reversing It: The Logic of Substitution</h2>

<p class="l-text">Integrating both sides of the chain rule gives the substitution rule directly:</p>

<div class="calc-formula">
<div class="formula-label">SUBSTITUTION RULE (INDEFINITE FORM)</div>
<div class="formula-main">$$\\int f'(g(x)) \\cdot g'(x)\\,dx \\;=\\; f(g(x)) + C$$</div>
<div class="formula-sub">Equivalently, after writing $u = g(x)$ and $du = g'(x)\\,dx$: $\\displaystyle\\int f'(u)\\,du = f(u) + C$.</div>
</div>

<p class="l-text">The substitution is the formal change of variable</p>

<div class="calc-formula">
<div class="formula-label">THE CHANGE OF VARIABLE</div>
<div class="formula-main">$$u = g(x), \\qquad du = g'(x)\\,dx$$</div>
<div class="formula-sub">$du$ is called the <em>differential</em> of $u$. Treat it as a piece of notation that tracks how $u$ responds to a tiny change in $x$.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$u$</div><div class="card-body">A new variable that <em>names</em> the inner function. Choosing $u$ well is the entire art of the method.</div></div>
<div class="calc-card"><div class="card-title">$du = g'(x)\\,dx$</div><div class="card-body">The differential of $u$. We compute it by differentiating $u$ with respect to $x$ and multiplying by $dx$.</div></div>
<div class="calc-card"><div class="card-title">Why it works</div><div class="card-body">Because $du$ already carries the factor $g'(x)$ that the chain rule produces. So $g'(x)\\,dx$ in the integrand becomes $du$ exactly.</div></div>
<div class="calc-card"><div class="card-title">When it fails</div><div class="card-body">If the integrand does not contain $g'(x)$ as a factor (up to a constant), the substitution will leave behind stray $x$'s that cannot be removed. That is a sign to try a different $u$.</div></div>
</div>

<div class="think-box"><div class="think-label">A SMALL MENTAL PICTURE</div><div class="think-body">Imagine the integrand as a layer cake. Substitution renames the bottom layer $u$ and immediately consumes its "frosting" $g'(x)\\,dx$ to form $du$. What remains on the plate is a much simpler dessert involving only $u$.</div></div>

<!-- ============================================================
     SECTION 3
     ============================================================ -->
<h2 class="l-title">3. The Four-Step Recipe</h2>

<p class="l-text">Every substitution problem you will ever solve in high school follows the same four-step skeleton. Write it on a notecard:</p>

<div class="calc-formula">
<div class="formula-label">SUBSTITUTION RECIPE</div>
<div class="formula-main">$$\\text{1. Pick } u \\;\\to\\; \\text{2. Compute } du \\;\\to\\; \\text{3. Rewrite the integral in } u \\;\\to\\; \\text{4. Integrate and back-substitute.}$$</div>
<div class="formula-sub">Step 1 is the only creative step. Steps 2, 3, 4 are mechanical bookkeeping.</div>
</div>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">STEP 1 — CHOOSE $u$</div>
<div class="compare-item">Identify an "inner" function whose derivative is also visible (up to a constant) in the integrand.</div>
<div class="compare-item">Good first guesses: anything inside parentheses, anything under a root, anything in an exponent, anything inside a $\\ln$ or trig function.</div>
</div>
<div class="compare-col">
<div class="compare-title">STEP 2 — COMPUTE $du$</div>
<div class="compare-item">Differentiate: $du = u'\\,dx$.</div>
<div class="compare-item">Solve for $dx$ if needed: $dx = du / u'$.</div>
</div>
<div class="compare-col">
<div class="compare-title">STEP 3 — REWRITE</div>
<div class="compare-item">Replace every $g(x)$ with $u$.</div>
<div class="compare-item">Replace $g'(x)\\,dx$ with $du$.</div>
<div class="compare-item">No $x$'s should remain. If any survive, the substitution is wrong.</div>
</div>
<div class="compare-col">
<div class="compare-title">STEP 4 — INTEGRATE & RETURN</div>
<div class="compare-item">Integrate the simpler $u$-integral.</div>
<div class="compare-item">Back-substitute $u = g(x)$ to express the answer in the original variable.</div>
<div class="compare-item">Add $+ C$ if indefinite.</div>
</div>
</div>

<!-- ============================================================
     SECTION 4 — Worked Example 1
     ============================================================ -->
<h2 class="l-title">4. Worked Example 1: $\\displaystyle\\int x\\,e^{x^2}\\,dx$</h2>

<p class="l-text">The integrand has the inner function $x^2$ tucked inside an exponential, multiplied by an $x$ outside. The derivative of $x^2$ is $2x$ — which is almost the outside factor $x$. That is exactly the signal that substitution will work.</p>

<div class="calc-example"><div class="example-label">FULL SOLUTION</div><div class="example-body">
<strong>Step 1.</strong> Let $u = x^2$.<br>
<strong>Step 2.</strong> Differentiate: $du = 2x\\,dx$, hence $x\\,dx = \\tfrac{1}{2}\\,du$.<br>
<strong>Step 3.</strong> Rewrite the integral. The $e^{x^2}$ becomes $e^u$ and the $x\\,dx$ becomes $\\tfrac{1}{2}\\,du$:<br>
$$\\int x\\,e^{x^2}\\,dx \\;=\\; \\int e^u \\cdot \\tfrac{1}{2}\\,du \\;=\\; \\tfrac{1}{2}\\int e^u\\,du.$$
<strong>Step 4.</strong> Integrate: $\\tfrac{1}{2}\\int e^u\\,du = \\tfrac{1}{2}e^u + C$. Back-substitute $u = x^2$:<br>
$$\\int x\\,e^{x^2}\\,dx \\;=\\; \\tfrac{1}{2}e^{x^2} + C.$$
<strong>Check.</strong> Differentiate the answer: $\\tfrac{d}{dx}\\left[\\tfrac{1}{2}e^{x^2}\\right] = \\tfrac{1}{2}e^{x^2}\\cdot 2x = x\\,e^{x^2}.$ ✓
</div></div>

<div class="think-box"><div class="think-label">WHY THE $\\tfrac{1}{2}$ APPEARED</div><div class="think-body">The chain rule of the answer would produce $e^{x^2}\\cdot 2x$, but our integrand only had $e^{x^2}\\cdot x$ — half as much. So the antiderivative needs a compensating $\\tfrac{1}{2}$ in front. Substitution does this bookkeeping for you automatically.</div></div>

<!-- ============================================================
     SECTION 5 — Worked Example 2
     ============================================================ -->
<h2 class="l-title">5. Worked Example 2: $\\displaystyle\\int \\sin(3x)\\,dx$</h2>

<p class="l-text">The simplest possible substitution: a linear inner function. Whenever an integrand contains $f(ax + b)$ for some constants $a, b$, the substitution $u = ax + b$ peels the constant off.</p>

<div class="calc-example"><div class="example-label">FULL SOLUTION</div><div class="example-body">
<strong>Step 1.</strong> Let $u = 3x$.<br>
<strong>Step 2.</strong> $du = 3\\,dx$, hence $dx = \\tfrac{1}{3}\\,du$.<br>
<strong>Step 3.</strong> Rewrite:<br>
$$\\int \\sin(3x)\\,dx \\;=\\; \\int \\sin u \\cdot \\tfrac{1}{3}\\,du \\;=\\; \\tfrac{1}{3}\\int \\sin u\\,du.$$
<strong>Step 4.</strong> Integrate: $\\tfrac{1}{3}\\int \\sin u\\,du = -\\tfrac{1}{3}\\cos u + C$. Back-substitute:<br>
$$\\int \\sin(3x)\\,dx \\;=\\; -\\tfrac{1}{3}\\cos(3x) + C.$$
<strong>Check.</strong> $\\tfrac{d}{dx}\\left[-\\tfrac{1}{3}\\cos(3x)\\right] = -\\tfrac{1}{3}\\cdot(-\\sin(3x))\\cdot 3 = \\sin(3x)$. ✓
</div></div>

<div class="calc-formula">
<div class="formula-label">A SHORTCUT WORTH MEMORISING</div>
<div class="formula-main">$$\\int f(ax + b)\\,dx \\;=\\; \\tfrac{1}{a}\\,F(ax + b) + C, \\quad \\text{where } F'=f.$$</div>
<div class="formula-sub">Linear-inner substitutions always pull out a factor of $1/a$. Practice until it is automatic.</div>
</div>

<!-- ============================================================
     SECTION 6 — Worked Example 3
     ============================================================ -->
<h2 class="l-title">6. Worked Example 3: $\\displaystyle\\int \\frac{x}{\\sqrt{x^2+1}}\\,dx$</h2>

<p class="l-text">A square root is begging to be substituted away. Whatever sits under the root is a natural candidate for $u$.</p>

<div class="calc-example"><div class="example-label">FULL SOLUTION</div><div class="example-body">
<strong>Step 1.</strong> Let $u = x^2 + 1$.<br>
<strong>Step 2.</strong> $du = 2x\\,dx$, hence $x\\,dx = \\tfrac{1}{2}\\,du$.<br>
<strong>Step 3.</strong> Rewrite. The $\\sqrt{x^2+1}$ becomes $\\sqrt{u}$ and the $x\\,dx$ becomes $\\tfrac{1}{2}\\,du$:<br>
$$\\int \\frac{x}{\\sqrt{x^2+1}}\\,dx \\;=\\; \\int \\frac{1}{\\sqrt{u}}\\cdot \\tfrac{1}{2}\\,du \\;=\\; \\tfrac{1}{2}\\int u^{-1/2}\\,du.$$
<strong>Step 4.</strong> Integrate using the power rule: $\\int u^{-1/2}\\,du = 2u^{1/2}$. So<br>
$$\\tfrac{1}{2}\\cdot 2u^{1/2} + C \\;=\\; u^{1/2} + C \\;=\\; \\sqrt{x^2+1} + C.$$
<strong>Check.</strong> $\\tfrac{d}{dx}\\sqrt{x^2+1} = \\dfrac{1}{2\\sqrt{x^2+1}}\\cdot 2x = \\dfrac{x}{\\sqrt{x^2+1}}$. ✓
</div></div>

<!-- ============================================================
     SECTION 7 — Worked Example 4
     ============================================================ -->
<h2 class="l-title">7. Worked Example 4: $\\displaystyle\\int \\frac{\\ln x}{x}\\,dx$</h2>

<p class="l-text">Here the inner function $\\ln x$ has derivative $\\tfrac{1}{x}$ — exactly the factor sitting beside it in the integrand. The substitution is almost too clean.</p>

<div class="calc-example"><div class="example-label">FULL SOLUTION</div><div class="example-body">
<strong>Step 1.</strong> Let $u = \\ln x$.<br>
<strong>Step 2.</strong> $du = \\tfrac{1}{x}\\,dx$, hence $\\tfrac{dx}{x} = du$.<br>
<strong>Step 3.</strong> Rewrite:<br>
$$\\int \\frac{\\ln x}{x}\\,dx \\;=\\; \\int u\\,du.$$
<strong>Step 4.</strong> Integrate: $\\int u\\,du = \\tfrac{1}{2}u^2 + C$. Back-substitute:<br>
$$\\int \\frac{\\ln x}{x}\\,dx \\;=\\; \\tfrac{1}{2}(\\ln x)^2 + C.$$
<strong>Check.</strong> $\\tfrac{d}{dx}\\left[\\tfrac{1}{2}(\\ln x)^2\\right] = \\tfrac{1}{2}\\cdot 2(\\ln x)\\cdot \\tfrac{1}{x} = \\dfrac{\\ln x}{x}$. ✓
</div></div>

<div class="think-box"><div class="think-label">PATTERN TO STORE</div><div class="think-body">Whenever you see "$\\ln x$ together with $\\tfrac{1}{x}$" or "an inner function together with its derivative", reach for substitution before anything else.</div></div>

<!-- ============================================================
     SECTION 8 — Choosing u
     ============================================================ -->
<h2 class="l-title">8. How to Choose $u$ — A LIATE-Style Heuristic</h2>

<p class="l-text">For integration <em>by parts</em>, students learn the LIATE mnemonic: pick the first available among Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. A similar but distinct heuristic helps with substitution. The guiding principle is always:</p>

<div class="calc-highlight"><strong>Rule of thumb:</strong> let $u$ be the <em>inner</em> function — the part whose derivative is also visible in the integrand (perhaps up to a constant multiple).</div>

<p class="l-text">A useful priority order when several candidates compete:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Argument of a transcendental</div><div class="card-body">Anything inside a $\\sin$, $\\cos$, $e^{\\cdot}$, or $\\ln$ wrapper. Example: $u = x^2$ in $\\int x\\sin(x^2)\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">2. Expression under a root</div><div class="card-body">Anything sitting under $\\sqrt{\\cdot}$ or $(\\cdot)^{1/n}$. Example: $u = 1 - x^2$ in $\\int x\\sqrt{1 - x^2}\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">3. Denominator inner expression</div><div class="card-body">A function whose derivative appears in the numerator. Example: $u = x^2 + 1$ in $\\int \\dfrac{x}{x^2+1}\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">4. The "ugly" piece</div><div class="card-body">If part of the integrand looks complicated and the rest is its derivative (or a constant multiple), name the complicated piece $u$.</div></div>
</div>

<p class="l-text"><strong>Verification.</strong> After choosing $u$ and computing $du$, check that the remaining $dx$-piece can be expressed entirely in $du$ form. If a stray $x$ refuses to leave, your $u$ is wrong; choose a different inner function.</p>

<div class="calc-example"><div class="example-label">QUICK CHOICES</div><div class="example-body">
$\\displaystyle\\int x^2 \\cos(x^3 + 1)\\,dx$: choose $u = x^3 + 1$, since $du = 3x^2\\,dx$ matches the $x^2$.<br><br>
$\\displaystyle\\int \\dfrac{e^x}{1 + e^x}\\,dx$: choose $u = 1 + e^x$, since $du = e^x\\,dx$ is the numerator.<br><br>
$\\displaystyle\\int \\dfrac{1}{x\\ln x}\\,dx$: choose $u = \\ln x$, since $du = \\dfrac{dx}{x}$.
</div></div>

<!-- ============================================================
     EXTRA — Chain-rule reversal visualization + pattern table
     ============================================================ -->

<p class="l-text">Before we tackle definite integrals, two extra pieces of reference material consolidate everything above. The first is a picture of the chain rule running backwards, using the integrand $\\sin(x^2)\\cdot 2x$. The second is a one-glance catalogue of the six or seven substitution patterns that cover almost every high-school exercise.</p>

<div class="calc-graph"><div id="plot-l29-chainrev-en-extra" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the original integrand $y = \\sin(x^2)\\cdot 2x$ (blue, solid) on $[0, \\sqrt{2\\pi}]$ and the substituted form $y = \\sin(u)$ (light blue, dashed) on $u \\in [0, 2\\pi]$. Substitution $u = x^2$, $du = 2x\\,dx$ converts the wildly compressed sine on the left — whose oscillations bunch up as $x$ grows — into the calm, regular $\\sin u$ on the right. The chain rule, run backwards: $\\int \\sin(x^2)\\cdot 2x\\,dx = -\\cos(x^2) + C$, exactly because $\\tfrac{d}{dx}[-\\cos(x^2)] = \\sin(x^2)\\cdot 2x$ via the chain rule.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=240;
var xs=[],y1=[];
for(var i=0;i<=N;i++){var x=i*Math.sqrt(2*Math.PI)/N;xs.push(x);y1.push(Math.sin(x*x)*2*x);}
var us=[],y2=[];
for(var j=0;j<=N;j++){var u=j*2*Math.PI/N;us.push(u);y2.push(Math.sin(u));}
var t1={x:xs,y:y1,mode:"lines",name:"y = sin(x²)·2x  (original)",line:{color:"#3b82f6",width:2.6},xaxis:"x",yaxis:"y"};
var t2={x:us,y:y2,mode:"lines",name:"y = sin(u)  (after u = x²)",line:{color:"#93c5fd",width:2.4,dash:"dash"},xaxis:"x2",yaxis:"y2"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},
grid:{rows:1,columns:2,pattern:"independent"},
xaxis:{domain:[0,0.46],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},
yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"integrand"},
xaxis2:{domain:[0.54,1.0],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"u = x²"},
yaxis2:{anchor:"x2",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"sin(u)"},
margin:{t:30,r:30,b:60,l:55},showlegend:true,
legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.28},
annotations:[
  {x:0.23,y:1.06,xref:"paper",yref:"paper",text:"original: sin(x²)·2x",showarrow:false,font:{color:"#3b82f6",size:11}},
  {x:0.77,y:1.06,xref:"paper",yref:"paper",text:"after u = x²: sin(u)",showarrow:false,font:{color:"#93c5fd",size:11}}
]};
Plotly.newPlot("plot-l29-chainrev-en-extra",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Summary table — common substitution patterns.</strong> When you can spot the left column inside an integral, the middle column tells you what to call $u$, and the right column shows what is left to integrate.</div>

<div style="margin:1.2rem 0;overflow-x:auto;border-radius:8px;border:1px solid rgba(59,130,246,0.25)">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem">
<thead>
<tr style="background:#3b82f6;color:#0a0a0a">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">Pattern (integrand shape)</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">$u$-choice</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em">Resulting integral</th>
</tr>
</thead>
<tbody>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Generic chain reversal</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int f(g(x))\\,g'(x)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = g(x)$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = g'(x)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int f(u)\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Polynomial inside power</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int (ax+b)^n\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = ax+b$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = a\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{a}\\int u^n\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Quadratic argument of $\\sin/\\cos/e$</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int x\\,e^{x^2}\\,dx$ or $\\int x\\sin(x^2)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = x^2$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = 2x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{2}\\int e^u\\,du,\\;\\;\\tfrac{1}{2}\\int \\sin u\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Under a square root</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int x\\sqrt{x^2+c}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = x^2+c$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = 2x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{2}\\int \\sqrt{u}\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Derivative of denominator on top</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int \\frac{g'(x)}{g(x)}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = g(x)$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = g'(x)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int \\frac{du}{u} = \\ln|u| + C$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Trig power × its derivative</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int \\sin^n x\\,\\cos x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = \\sin x$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = \\cos x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int u^n\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Logarithm with its $1/x$</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int \\frac{(\\ln x)^n}{x}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = \\ln x$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = \\tfrac{dx}{x}$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int u^n\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Linear inside exponential</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int e^{ax+b}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = ax+b$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = a\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{a}\\int e^u\\,du$</td>
</tr>
</tbody>
</table>
</div>

<p class="l-text"><strong>How to read the table.</strong> Spot the integrand's shape in the left column, then the middle column tells you what to set $u$ equal to. The right column is what you actually have to compute — almost always a one-line antiderivative. Memorise these eight rows and you will solve perhaps 90% of high-school substitution problems by sight.</p>

<!-- ============================================================
     SECTION 9 — Definite integrals
     ============================================================ -->
<h2 class="l-title">9. Substitution in a Definite Integral: Change the Limits</h2>

<p class="l-text">For an <strong>indefinite</strong> integral, you always back-substitute at the end. For a <strong>definite</strong> integral $\\int_a^b f(x)\\,dx$ you have a faster option: change the limits along with the integrand, then evaluate directly in $u$.</p>

<div class="calc-formula">
<div class="formula-label">SUBSTITUTION IN A DEFINITE INTEGRAL</div>
<div class="formula-main">$$\\int_{x=a}^{x=b} f(g(x))\\,g'(x)\\,dx \\;=\\; \\int_{u=g(a)}^{u=g(b)} f(u)\\,du$$</div>
<div class="formula-sub">When the variable changes from $x$ to $u$, the limits change with it: lower limit becomes $g(a)$, upper limit becomes $g(b)$.</div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">
<strong>Evaluate</strong> $\\displaystyle\\int_0^1 2x\\,e^{x^2}\\,dx$.<br><br>
Let $u = x^2$, so $du = 2x\\,dx$. New limits: when $x = 0$, $u = 0$; when $x = 1$, $u = 1$.<br><br>
$$\\int_0^1 2x\\,e^{x^2}\\,dx \\;=\\; \\int_0^1 e^u\\,du \\;=\\; \\big[\\,e^u\\,\\big]_0^1 \\;=\\; e - 1 \\approx 1.718.$$
No back-substitution needed — the answer is already a number.
</div></div>

<div class="calc-graph"><div id="plot-l29-defint-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the integrand $y = 2x\\,e^{x^2}$ on $[0,1]$ (gold). The shaded area equals $e - 1$. After the substitution $u = x^2$, this same region transforms into the area under $y = e^u$ on $[0,1]$ (cyan, shown for comparison). Substitution rescales the horizontal axis so the difficult curve becomes the standard exponential.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=0;i<=100;i++){xs.push(i/100);}
var y1=xs.map(function(x){return 2*x*Math.exp(x*x);});
var y2=xs.map(function(x){return Math.exp(x);});
var trace1={x:xs,y:y1,mode:"lines",name:"y = 2x·e^(x²)",line:{color:"#c8a96e",width:2.6},fill:"tozeroy",fillcolor:"rgba(200,169,110,0.22)"};
var trace2={x:xs,y:y2,mode:"lines",name:"y = e^u (after sub)",line:{color:"#06b6d4",width:2.4,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x  (or u after substitution)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"integrand"},margin:{t:30,r:30,b:50,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-l29-defint-en",[trace1,trace2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">A COMMON MISTAKE</div><div class="think-body">After substituting, students sometimes change the integrand to $u$ but <em>forget</em> to change the limits — and then evaluate using the original $x$-limits. The result is wrong by an enormous margin. Either change both (integrand and limits) and stay in $u$, or change neither (do the indefinite integral, back-substitute, then evaluate using the original limits).</div></div>

<!-- ============================================================
     SECTION 10 — Flow diagram
     ============================================================ -->
<h2 class="l-title">10. The Substitution Flow Diagram</h2>

<p class="l-text">Visually, every substitution problem traces the same path. The diagram below sketches it: the original integrand enters on the left, is mapped through the four-step recipe, and exits on the right as a clean answer in $x$.</p>

<div class="calc-graph"><div id="plot-l29-flow-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this diagram shows:</strong> an integral in $x$ (left) is converted by the choice $u = g(x)$, $du = g'(x)\\,dx$ into a simpler integral in $u$ (middle), evaluated, and finally returned to the original variable through back-substitution (right). The shape of the curve never changes — only the coordinate system does.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var node1={x:[0.07],y:[0.5],mode:"markers+text",text:["∫ f(g(x))·g'(x) dx"],textposition:"middle right",marker:{size:60,color:"rgba(200,169,110,0.20)",line:{color:"#c8a96e",width:2}},textfont:{color:"#ebe6dc",size:13},name:"Input"};
var node2={x:[0.50],y:[0.5],mode:"markers+text",text:["∫ f(u) du"],textposition:"middle right",marker:{size:60,color:"rgba(6,182,212,0.20)",line:{color:"#06b6d4",width:2}},textfont:{color:"#ebe6dc",size:13},name:"After substitution",showlegend:false};
var node3={x:[0.88],y:[0.5],mode:"markers+text",text:["F(g(x)) + C"],textposition:"middle left",marker:{size:60,color:"rgba(168,85,247,0.20)",line:{color:"#a855f7",width:2}},textfont:{color:"#ebe6dc",size:13},name:"Final answer",showlegend:false};
var arrow1={x:[0.18,0.40],y:[0.5,0.5],mode:"lines",line:{color:"#c8a96e",width:2},name:"u = g(x)",hoverinfo:"name"};
var arrow2={x:[0.60,0.78],y:[0.5,0.5],mode:"lines",line:{color:"#a855f7",width:2},name:"back-substitute",hoverinfo:"name"};
var ann=[
  {x:0.29,y:0.6,text:"choose u, compute du",showarrow:false,font:{color:"#c8a96e",size:11}},
  {x:0.69,y:0.6,text:"integrate, then return",showarrow:false,font:{color:"#a855f7",size:11}}
];
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[0.3,0.75]},margin:{t:20,r:20,b:20,l:20},showlegend:false,annotations:ann};
Plotly.newPlot("plot-l29-flow-en",[arrow1,arrow2,node1,node2,node3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<!-- ============================================================
     SECTION 11 — Trig substitution preview
     ============================================================ -->
<h2 class="l-title">11. A Glimpse Ahead: Trigonometric Substitution</h2>

<p class="l-text">Substitution does not have to make $u$ a simple algebraic expression in $x$. Sometimes the cleanest move is to set $x$ equal to a <em>trigonometric</em> function of a new angle $\\theta$. This <strong>trigonometric substitution</strong> is studied properly in calculus, but a short look here previews the idea.</p>

<div class="calc-formula">
<div class="formula-label">CLASSIC TRIG SUBSTITUTIONS</div>
<div class="formula-main">$$\\sqrt{a^2 - x^2}:\\;\\; x = a\\sin\\theta, \\qquad \\sqrt{a^2 + x^2}:\\;\\; x = a\\tan\\theta, \\qquad \\sqrt{x^2 - a^2}:\\;\\; x = a\\sec\\theta$$</div>
<div class="formula-sub">Each substitution turns the square root into a clean trig identity, often $a\\cos\\theta$ or $a\\sec\\theta$.</div>
</div>

<div class="calc-example"><div class="example-label">A SHORT PREVIEW</div><div class="example-body">
<strong>Evaluate</strong> $\\displaystyle\\int \\dfrac{dx}{\\sqrt{1 - x^2}}$.<br><br>
Let $x = \\sin\\theta$, so $dx = \\cos\\theta\\,d\\theta$ and $\\sqrt{1 - x^2} = \\sqrt{1 - \\sin^2\\theta} = \\cos\\theta$.<br>
$$\\int \\dfrac{dx}{\\sqrt{1 - x^2}} \\;=\\; \\int \\dfrac{\\cos\\theta\\,d\\theta}{\\cos\\theta} \\;=\\; \\int d\\theta \\;=\\; \\theta + C \\;=\\; \\arcsin x + C.$$
This is one classical way to derive the antiderivative of $1/\\sqrt{1 - x^2}$.
</div></div>

<p class="l-text">You do not need to master trig substitution for the high-school exam. The point of this section is that the substitution idea is far more general than $u = g(x)$ for some polynomial $g$. Any clever change of variable that simplifies the integrand counts.</p>

<!-- ============================================================
     SECTION 12 — Classic exercises
     ============================================================ -->
<h2 class="l-title">12. Classic Exercises</h2>

<p class="l-text">Solve each on paper before reading the solution. All eight integrals submit cleanly to substitution.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">
Compute $\\displaystyle\\int (2x + 3)^5\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = 2x + 3$, $du = 2\\,dx$, $dx = \\tfrac{1}{2}\\,du$. Then $\\int u^5 \\cdot \\tfrac{1}{2}\\,du = \\tfrac{1}{12}u^6 + C = \\tfrac{1}{12}(2x+3)^6 + C$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">
Compute $\\displaystyle\\int x\\sqrt{1 - x^2}\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = 1 - x^2$, $du = -2x\\,dx$, so $x\\,dx = -\\tfrac{1}{2}\\,du$. Then $\\int \\sqrt{u}\\cdot(-\\tfrac{1}{2})\\,du = -\\tfrac{1}{2}\\cdot \\tfrac{2}{3}u^{3/2} = -\\tfrac{1}{3}(1 - x^2)^{3/2} + C$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body">
Compute $\\displaystyle\\int \\dfrac{x}{x^2 + 4}\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = x^2 + 4$, $du = 2x\\,dx$, $x\\,dx = \\tfrac{1}{2}\\,du$. Then $\\int \\dfrac{1}{u}\\cdot \\tfrac{1}{2}\\,du = \\tfrac{1}{2}\\ln|u| + C = \\tfrac{1}{2}\\ln(x^2 + 4) + C$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">
Compute $\\displaystyle\\int \\cos x\\,\\sin^3 x\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = \\sin x$, $du = \\cos x\\,dx$. Then $\\int u^3\\,du = \\tfrac{1}{4}u^4 + C = \\tfrac{1}{4}\\sin^4 x + C$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body">
Compute $\\displaystyle\\int e^{\\,3x + 1}\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = 3x + 1$, $du = 3\\,dx$, $dx = \\tfrac{1}{3}\\,du$. Then $\\int e^u \\cdot \\tfrac{1}{3}\\,du = \\tfrac{1}{3}e^u + C = \\tfrac{1}{3}e^{3x+1} + C$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 (DEFINITE)</div><div class="example-body">
Compute $\\displaystyle\\int_0^{\\pi/2} \\sin x\\,\\cos x\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = \\sin x$, $du = \\cos x\\,dx$. New limits: $x = 0 \\Rightarrow u = 0$; $x = \\pi/2 \\Rightarrow u = 1$. Then $\\int_0^1 u\\,du = \\tfrac{1}{2}u^2\\big|_0^1 = \\tfrac{1}{2}$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 (DEFINITE)</div><div class="example-body">
Compute $\\displaystyle\\int_1^{e} \\dfrac{\\ln x}{x}\\,dx$.<br><br>
<strong>Solution.</strong> Let $u = \\ln x$, $du = \\tfrac{dx}{x}$. New limits: $x = 1 \\Rightarrow u = 0$; $x = e \\Rightarrow u = 1$. Then $\\int_0^1 u\\,du = \\tfrac{1}{2}$.
</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body">
Compute $\\displaystyle\\int \\dfrac{1}{x\\,\\ln x}\\,dx$ for $x > 1$.<br><br>
<strong>Solution.</strong> Let $u = \\ln x$, $du = \\tfrac{dx}{x}$. Then $\\int \\dfrac{du}{u} = \\ln|u| + C = \\ln|\\ln x| + C$.
</div></div>

<div class="think-box"><div class="think-label">CLOSING THOUGHT</div><div class="think-body">Substitution rewards practice more than insight. After ten or so worked problems, the choice of $u$ becomes automatic — you will see "the inner function and its derivative" inside any integrand within seconds. Keep a notebook of patterns you have already met; almost every new integral on an exam is a small twist on one of them.</div></div>

<p class="l-text"><em>End of Lesson 29.</em> Next lesson moves to <em>integration by parts</em>, the integral counterpart of the product rule — the other workhorse technique for high-school integrals.</p>
`,

/* ========================================================================
   TURKISH VERSION
   ======================================================================== */
tr: `
<p class="l-text"><strong>Değişken değiştirme yöntemi</strong> — diğer adıyla <em>u-substitution</em> — başlangıç düzeyinde integralin en önemli tekniğidir. Bu yöntem zincir kuralının integraldeki karşılığıdır: türev alırken katmanları <em>dışa doğru</em> soyduğumuz zincir kuralını, integral alırken <em>içe doğru</em> ekleyerek tersine çeviririz. Lise düzeyinde "gözle çözülemeyen" hemen her integral, doğru seçilmiş bir değişken değiştirmeyle çözülür.</p>

<p class="l-text">Bu derste tekniği somutlaştıracağız. Önce zincir kuralına ters yönden bakacağız, dört adımlı tarifi türeteceğiz, dört detaylı örnek çözeceğiz ve sonra belirli integralde sınırların nasıl değiştirildiğini ele alacağız. Ders sonunda bir bakışta bir değişken değiştirmeyi seçip temiz biçimde uygulayabilmelisin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Zincir kuralını ifade etmek ve "tersini" değişken değiştirme kuralı olarak tanımak.</li>
<li>İç fonksiyonu $u = g(x)$ seçip diferansiyelini $du = g'(x)\\,dx$ hesaplamak.</li>
<li>Dört adımlı tarifi uygulamak: $u$ seç, $du$ hesapla, yerine koy, integralle, geri dön.</li>
<li>Değişken değiştirmeyi dört klasik kalıba uygulamak: $x\\,e^{x^2}$, $\\sin(3x)$, $x/\\sqrt{x^2+1}$, $\\ln x / x$.</li>
<li>Belirli bir integralde değişken değişirken sınırları da değiştirmek.</li>
<li>Trigonometrik substitution ($x = a\\sin\\theta$) için kısa bir önsöz okumak.</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1
     ============================================================ -->
<h2 class="l-title">1. Hatırlatma: Zincir Kuralı</h2>

<p class="l-text">Bir şeyi tersine çevirmeden önce, tersine çevireceğimiz kuralı hatırlayalım. <strong>Zincir kuralı</strong> iki fonksiyonun bileşkesini nasıl türevleyeceğimizi söyler:</p>

<div class="calc-formula">
<div class="formula-label">ZİNCİR KURALI (TÜREV)</div>
<div class="formula-main">$$\\frac{d}{dx}\\,f(g(x)) \\;=\\; f'(g(x)) \\cdot g'(x)$$</div>
<div class="formula-sub">Dış fonksiyon $f$'i iç fonksiyon $g(x)$'te türevle, sonra iç fonksiyonun türevi $g'(x)$ ile çarp.</div>
</div>

<p class="l-text">Hızlı bir örnek: $\\dfrac{d}{dx}\\sin(x^2) = \\cos(x^2)\\cdot 2x$. Dış fonksiyon $\\sin$, iç fonksiyon $x^2$. İçin $\\cos$'unu aldık ve içerinin türevi $2x$ ile çarptık.</p>

<p class="l-text">Şimdi bu eşitliği <em>sağdan sola</em> oku. Sağ taraftaki $f'(g(x))\\cdot g'(x)$, "iç fonksiyonda hesaplanmış bir dış türev" ile "iç fonksiyonun türevi"nin çarpımıdır. Bir integralin içinde böyle bir çarpımla karşılaşırsak, onu $f(g(x))$'in türevi olarak tanıyıp doğrudan $f(g(x))$'e geri integralleyebiliriz. Değişken değiştirmenin tüm fikri budur.</p>

<div class="calc-highlight"><strong>Tek cümleyle:</strong> değişken değiştirme kuralı, zincir kuralının ters yönde yazılmış halidir. Defter tutmayı kolaylaştırmak için iç fonksiyon $g(x)$ yeniden $u$ olarak adlandırılır.</div>

<!-- ============================================================
     BÖLÜM 2
     ============================================================ -->
<h2 class="l-title">2. Tersini Yapmak: Değişken Değiştirme Mantığı</h2>

<p class="l-text">Zincir kuralının iki tarafının integralini almak, değişken değiştirme kuralını doğrudan verir:</p>

<div class="calc-formula">
<div class="formula-label">DEĞİŞKEN DEĞİŞTİRME KURALI (BELİRSİZ İNTEGRAL)</div>
<div class="formula-main">$$\\int f'(g(x)) \\cdot g'(x)\\,dx \\;=\\; f(g(x)) + C$$</div>
<div class="formula-sub">Eşdeğer olarak, $u = g(x)$ ve $du = g'(x)\\,dx$ yazdıktan sonra: $\\displaystyle\\int f'(u)\\,du = f(u) + C$.</div>
</div>

<p class="l-text">Burada formal değişken değiştirme şudur:</p>

<div class="calc-formula">
<div class="formula-label">DEĞİŞKEN DEĞİŞİMİ</div>
<div class="formula-main">$$u = g(x), \\qquad du = g'(x)\\,dx$$</div>
<div class="formula-sub">$du$ ifadesine $u$'nun <em>diferansiyeli</em> denir. $u$'nun $x$'teki küçük bir değişime nasıl tepki verdiğini izleyen bir notasyon parçası olarak düşün.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$u$</div><div class="card-body">İç fonksiyonu <em>adlandıran</em> yeni bir değişken. $u$'yu iyi seçmek yöntemin tüm sanatıdır.</div></div>
<div class="calc-card"><div class="card-title">$du = g'(x)\\,dx$</div><div class="card-body">$u$'nun diferansiyeli. $u$'yu $x$'e göre türevleyip $dx$ ile çarparak hesaplarız.</div></div>
<div class="calc-card"><div class="card-title">Neden çalışıyor</div><div class="card-body">Çünkü $du$ zaten zincir kuralının ürettiği $g'(x)$ çarpanını taşır. Yani integraldeki $g'(x)\\,dx$ tam olarak $du$'ya dönüşür.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman başarısız olur</div><div class="card-body">İntegrand $g'(x)$'i çarpan olarak (sabit kat hatasıyla bile) içermiyorsa, değişken değiştirme arkasında atılamayan $x$'ler bırakır. Bu, farklı bir $u$ denemen gerektiğinin sinyalidir.</div></div>
</div>

<div class="think-box"><div class="think-label">KÜÇÜK BİR ZİHİN RESMİ</div><div class="think-body">İntegrandı katmanlı bir pasta gibi düşün. Değişken değiştirme alt katmanı $u$ olarak yeniden adlandırır ve onun "kreması" $g'(x)\\,dx$'i hemen $du$'ya çevirir. Tabakta kalan, yalnızca $u$ içeren çok daha sade bir tatlıdır.</div></div>

<!-- ============================================================
     BÖLÜM 3
     ============================================================ -->
<h2 class="l-title">3. Dört Adımlı Tarif</h2>

<p class="l-text">Lisede çözeceğin her değişken değiştirme problemi aynı dört adımlı iskeleti izler. Bir not kartına yaz:</p>

<div class="calc-formula">
<div class="formula-label">DEĞİŞKEN DEĞİŞTİRME TARİFİ</div>
<div class="formula-main">$$\\text{1. } u \\text{ seç} \\;\\to\\; \\text{2. } du \\text{ hesapla} \\;\\to\\; \\text{3. İntegrali } u \\text{ cinsinden yaz} \\;\\to\\; \\text{4. İntegralle ve geri koy.}$$</div>
<div class="formula-sub">1. adım tek yaratıcı adımdır. 2, 3, 4 mekanik defter tutmasıdır.</div>
</div>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">1. ADIM — $u$ SEÇ</div>
<div class="compare-item">İntegrandın içinde, türevi de görünen (sabit katsayıya kadar) bir "iç" fonksiyon belirle.</div>
<div class="compare-item">İyi ilk tahminler: parantez içindekiler, kök altındakiler, üs içindekiler, $\\ln$ veya trig fonksiyon içindekiler.</div>
</div>
<div class="compare-col">
<div class="compare-title">2. ADIM — $du$ HESAPLA</div>
<div class="compare-item">Türev al: $du = u'\\,dx$.</div>
<div class="compare-item">Gerekirse $dx$'i çek: $dx = du / u'$.</div>
</div>
<div class="compare-col">
<div class="compare-title">3. ADIM — YENİDEN YAZ</div>
<div class="compare-item">Her $g(x)$'i $u$ ile değiştir.</div>
<div class="compare-item">$g'(x)\\,dx$'i $du$ ile değiştir.</div>
<div class="compare-item">Geride hiçbir $x$ kalmamalı. Kalıyorsa değişken değiştirme yanlıştır.</div>
</div>
<div class="compare-col">
<div class="compare-title">4. ADIM — İNTEGRALLE & GERİ DÖN</div>
<div class="compare-item">Daha sade olan $u$-integralini al.</div>
<div class="compare-item">$u = g(x)$ yerine koyarak cevabı orijinal değişkene döndür.</div>
<div class="compare-item">Belirsizse $+ C$ eklemeyi unutma.</div>
</div>
</div>

<!-- ============================================================
     BÖLÜM 4 — Örnek 1
     ============================================================ -->
<h2 class="l-title">4. Çözümlü Örnek 1: $\\displaystyle\\int x\\,e^{x^2}\\,dx$</h2>

<p class="l-text">İntegrand bir üstel fonksiyonun içinde $x^2$ iç fonksiyonunu, dışında bir $x$ çarpanını taşıyor. $x^2$'nin türevi $2x$ — yani dışarıdaki $x$ çarpanına neredeyse eşit. Bu, değişken değiştirmenin işe yarayacağının net işaretidir.</p>

<div class="calc-example"><div class="example-label">TAM ÇÖZÜM</div><div class="example-body">
<strong>1. Adım.</strong> $u = x^2$ olsun.<br>
<strong>2. Adım.</strong> Türevle: $du = 2x\\,dx$, dolayısıyla $x\\,dx = \\tfrac{1}{2}\\,du$.<br>
<strong>3. Adım.</strong> İntegrali yeniden yaz. $e^{x^2}$ ifadesi $e^u$ olur, $x\\,dx$ ise $\\tfrac{1}{2}\\,du$:<br>
$$\\int x\\,e^{x^2}\\,dx \\;=\\; \\int e^u \\cdot \\tfrac{1}{2}\\,du \\;=\\; \\tfrac{1}{2}\\int e^u\\,du.$$
<strong>4. Adım.</strong> İntegralle: $\\tfrac{1}{2}\\int e^u\\,du = \\tfrac{1}{2}e^u + C$. $u = x^2$'yi geri koy:<br>
$$\\int x\\,e^{x^2}\\,dx \\;=\\; \\tfrac{1}{2}e^{x^2} + C.$$
<strong>Kontrol.</strong> Cevabın türevi: $\\tfrac{d}{dx}\\left[\\tfrac{1}{2}e^{x^2}\\right] = \\tfrac{1}{2}e^{x^2}\\cdot 2x = x\\,e^{x^2}.$ ✓
</div></div>

<div class="think-box"><div class="think-label">$\\tfrac{1}{2}$ NEDEN ÇIKTI</div><div class="think-body">Cevabın zincir kuralı bize $e^{x^2}\\cdot 2x$ verirdi, ama integralimizde yalnızca $e^{x^2}\\cdot x$ vardı — yarısı kadar. Bu yüzden ters türevin başına dengeleyici bir $\\tfrac{1}{2}$ gerekir. Değişken değiştirme bu defter tutmasını senin yerine otomatik yapar.</div></div>

<!-- ============================================================
     BÖLÜM 5 — Örnek 2
     ============================================================ -->
<h2 class="l-title">5. Çözümlü Örnek 2: $\\displaystyle\\int \\sin(3x)\\,dx$</h2>

<p class="l-text">Olabilecek en sade değişken değiştirme: doğrusal bir iç fonksiyon. Bir integrand bazı sabitler $a, b$ için $f(ax + b)$ içeriyorsa, $u = ax + b$ değişimi sabiti dışarı soyar.</p>

<div class="calc-example"><div class="example-label">TAM ÇÖZÜM</div><div class="example-body">
<strong>1. Adım.</strong> $u = 3x$ olsun.<br>
<strong>2. Adım.</strong> $du = 3\\,dx$, dolayısıyla $dx = \\tfrac{1}{3}\\,du$.<br>
<strong>3. Adım.</strong> Yeniden yaz:<br>
$$\\int \\sin(3x)\\,dx \\;=\\; \\int \\sin u \\cdot \\tfrac{1}{3}\\,du \\;=\\; \\tfrac{1}{3}\\int \\sin u\\,du.$$
<strong>4. Adım.</strong> İntegralle: $\\tfrac{1}{3}\\int \\sin u\\,du = -\\tfrac{1}{3}\\cos u + C$. Geri koy:<br>
$$\\int \\sin(3x)\\,dx \\;=\\; -\\tfrac{1}{3}\\cos(3x) + C.$$
<strong>Kontrol.</strong> $\\tfrac{d}{dx}\\left[-\\tfrac{1}{3}\\cos(3x)\\right] = -\\tfrac{1}{3}\\cdot(-\\sin(3x))\\cdot 3 = \\sin(3x)$. ✓
</div></div>

<div class="calc-formula">
<div class="formula-label">EZBERLENMESİ GEREKEN BİR KISA YOL</div>
<div class="formula-main">$$\\int f(ax + b)\\,dx \\;=\\; \\tfrac{1}{a}\\,F(ax + b) + C, \\quad F'=f.$$</div>
<div class="formula-sub">Doğrusal iç fonksiyonlu değişimler hep bir $1/a$ çarpanı çıkarır. Refleks haline gelene kadar pratik yap.</div>
</div>

<!-- ============================================================
     BÖLÜM 6 — Örnek 3
     ============================================================ -->
<h2 class="l-title">6. Çözümlü Örnek 3: $\\displaystyle\\int \\frac{x}{\\sqrt{x^2+1}}\\,dx$</h2>

<p class="l-text">Bir karekök, değiştirilmek için adeta yalvarır. Kökün altında oturan ne varsa, $u$ için doğal adaydır.</p>

<div class="calc-example"><div class="example-label">TAM ÇÖZÜM</div><div class="example-body">
<strong>1. Adım.</strong> $u = x^2 + 1$ olsun.<br>
<strong>2. Adım.</strong> $du = 2x\\,dx$, dolayısıyla $x\\,dx = \\tfrac{1}{2}\\,du$.<br>
<strong>3. Adım.</strong> Yeniden yaz. $\\sqrt{x^2+1}$, $\\sqrt{u}$ olur ve $x\\,dx$, $\\tfrac{1}{2}\\,du$:<br>
$$\\int \\frac{x}{\\sqrt{x^2+1}}\\,dx \\;=\\; \\int \\frac{1}{\\sqrt{u}}\\cdot \\tfrac{1}{2}\\,du \\;=\\; \\tfrac{1}{2}\\int u^{-1/2}\\,du.$$
<strong>4. Adım.</strong> Üs kuralıyla integralle: $\\int u^{-1/2}\\,du = 2u^{1/2}$. Dolayısıyla<br>
$$\\tfrac{1}{2}\\cdot 2u^{1/2} + C \\;=\\; u^{1/2} + C \\;=\\; \\sqrt{x^2+1} + C.$$
<strong>Kontrol.</strong> $\\tfrac{d}{dx}\\sqrt{x^2+1} = \\dfrac{1}{2\\sqrt{x^2+1}}\\cdot 2x = \\dfrac{x}{\\sqrt{x^2+1}}$. ✓
</div></div>

<!-- ============================================================
     BÖLÜM 7 — Örnek 4
     ============================================================ -->
<h2 class="l-title">7. Çözümlü Örnek 4: $\\displaystyle\\int \\frac{\\ln x}{x}\\,dx$</h2>

<p class="l-text">Burada $\\ln x$ iç fonksiyonunun türevi $\\tfrac{1}{x}$ — tam olarak integrandda onun yanında duran çarpan. Değişken değiştirme adeta hediye gibi.</p>

<div class="calc-example"><div class="example-label">TAM ÇÖZÜM</div><div class="example-body">
<strong>1. Adım.</strong> $u = \\ln x$ olsun.<br>
<strong>2. Adım.</strong> $du = \\tfrac{1}{x}\\,dx$, dolayısıyla $\\tfrac{dx}{x} = du$.<br>
<strong>3. Adım.</strong> Yeniden yaz:<br>
$$\\int \\frac{\\ln x}{x}\\,dx \\;=\\; \\int u\\,du.$$
<strong>4. Adım.</strong> İntegralle: $\\int u\\,du = \\tfrac{1}{2}u^2 + C$. Geri koy:<br>
$$\\int \\frac{\\ln x}{x}\\,dx \\;=\\; \\tfrac{1}{2}(\\ln x)^2 + C.$$
<strong>Kontrol.</strong> $\\tfrac{d}{dx}\\left[\\tfrac{1}{2}(\\ln x)^2\\right] = \\tfrac{1}{2}\\cdot 2(\\ln x)\\cdot \\tfrac{1}{x} = \\dfrac{\\ln x}{x}$. ✓
</div></div>

<div class="think-box"><div class="think-label">EZBERLENECEK KALIP</div><div class="think-body">Ne zaman "$\\ln x$ ile birlikte $\\tfrac{1}{x}$" ya da "bir iç fonksiyonla birlikte türevi" görürsen, başka her şeyden önce değişken değiştirmeye uzan.</div></div>

<!-- ============================================================
     BÖLÜM 8 — u seçimi
     ============================================================ -->
<h2 class="l-title">8. $u$ Seçimi — LIATE Tarzı Sezgi</h2>

<p class="l-text">Kısmî integrasyonda öğrenciler LIATE mnemoniğini öğrenir: Logaritmik, Ters trigonometrik, Cebirsel (Algebraic), Trigonometrik, Üstel (Exponential) sırasıyla ilkini seç. Değişken değiştirmede benzer ama farklı bir sezgi vardır. Yol gösterici ilke daima şudur:</p>

<div class="calc-highlight"><strong>Pratik kural:</strong> $u$, türevi de integrandda görünen <em>iç</em> fonksiyon olsun (belki sabit bir çarpan farkıyla).</div>

<p class="l-text">Birden fazla aday yarıştığında işe yarayan bir öncelik sıralaması:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Bir transandant'in argümanı</div><div class="card-body">$\\sin$, $\\cos$, $e^{\\cdot}$ veya $\\ln$ sarmalayıcısının içindeki her şey. Örnek: $\\int x\\sin(x^2)\\,dx$'te $u = x^2$.</div></div>
<div class="calc-card"><div class="card-title">2. Kök altındaki ifade</div><div class="card-body">$\\sqrt{\\cdot}$ veya $(\\cdot)^{1/n}$ altında oturan her şey. Örnek: $\\int x\\sqrt{1 - x^2}\\,dx$'te $u = 1 - x^2$.</div></div>
<div class="calc-card"><div class="card-title">3. Paydadaki iç ifade</div><div class="card-body">Türevi paydada görünen bir fonksiyon. Örnek: $\\int \\dfrac{x}{x^2+1}\\,dx$'te $u = x^2 + 1$.</div></div>
<div class="calc-card"><div class="card-title">4. "Çirkin" parça</div><div class="card-body">İntegrandın bir kısmı karmaşık görünüyor ve geri kalanı onun türevi (veya bir sabit katı) ise, karmaşık parçaya $u$ adını ver.</div></div>
</div>

<p class="l-text"><strong>Doğrulama.</strong> $u$'yu seçip $du$'yu hesapladıktan sonra, kalan $dx$-parçasının tamamen $du$ formunda yazılabildiğini kontrol et. İnatla kalan bir $x$ varsa, $u$ seçimi yanlıştır; başka bir iç fonksiyon seç.</p>

<div class="calc-example"><div class="example-label">HIZLI SEÇİMLER</div><div class="example-body">
$\\displaystyle\\int x^2 \\cos(x^3 + 1)\\,dx$: $u = x^3 + 1$ seç, çünkü $du = 3x^2\\,dx$ tam $x^2$'ye uyar.<br><br>
$\\displaystyle\\int \\dfrac{e^x}{1 + e^x}\\,dx$: $u = 1 + e^x$ seç, çünkü $du = e^x\\,dx$ paydır.<br><br>
$\\displaystyle\\int \\dfrac{1}{x\\ln x}\\,dx$: $u = \\ln x$ seç, çünkü $du = \\dfrac{dx}{x}$.
</div></div>

<!-- ============================================================
     EK BÖLÜM — Zincir kuralı tersine + kalıp tablosu
     ============================================================ -->

<p class="l-text">Belirli integrale geçmeden önce, yukarıdakini pekiştiren iki ek referans parçası. İlki, $\\sin(x^2)\\cdot 2x$ integrandı üzerinden zincir kuralının ters çalıştığını gösteren bir resim. İkincisi, lise düzeyindeki hemen her alıştırmayı kapsayan altı yedi temel değişken değiştirme kalıbının tek bakışta okunan kataloğu.</p>

<div class="calc-graph"><div id="plot-l29-chainrev-tr-extra" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> solda $[0, \\sqrt{2\\pi}]$ üzerinde orijinal integrand $y = \\sin(x^2)\\cdot 2x$ (mavi, düz), sağda $u \\in [0, 2\\pi]$ üzerinde değişim sonrası form $y = \\sin(u)$ (açık mavi, kesik). $u = x^2$, $du = 2x\\,dx$ değişimi, $x$ büyüdükçe salınımları sıkışan soldaki çılgın eğriyi, sağdaki sakin ve düzenli $\\sin u$'ya dönüştürür. Zincir kuralı ters yönde çalışır: $\\int \\sin(x^2)\\cdot 2x\\,dx = -\\cos(x^2) + C$, çünkü $\\tfrac{d}{dx}[-\\cos(x^2)] = \\sin(x^2)\\cdot 2x$ tam olarak zincir kuralıyla.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=240;
var xs=[],y1=[];
for(var i=0;i<=N;i++){var x=i*Math.sqrt(2*Math.PI)/N;xs.push(x);y1.push(Math.sin(x*x)*2*x);}
var us=[],y2=[];
for(var j=0;j<=N;j++){var u=j*2*Math.PI/N;us.push(u);y2.push(Math.sin(u));}
var t1={x:xs,y:y1,mode:"lines",name:"y = sin(x²)·2x  (orijinal)",line:{color:"#3b82f6",width:2.6},xaxis:"x",yaxis:"y"};
var t2={x:us,y:y2,mode:"lines",name:"y = sin(u)  (u = x² sonrası)",line:{color:"#93c5fd",width:2.4,dash:"dash"},xaxis:"x2",yaxis:"y2"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},
grid:{rows:1,columns:2,pattern:"independent"},
xaxis:{domain:[0,0.46],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},
yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"integrand"},
xaxis2:{domain:[0.54,1.0],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"u = x²"},
yaxis2:{anchor:"x2",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"sin(u)"},
margin:{t:30,r:30,b:60,l:55},showlegend:true,
legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.28},
annotations:[
  {x:0.23,y:1.06,xref:"paper",yref:"paper",text:"orijinal: sin(x²)·2x",showarrow:false,font:{color:"#3b82f6",size:11}},
  {x:0.77,y:1.06,xref:"paper",yref:"paper",text:"u = x² sonrası: sin(u)",showarrow:false,font:{color:"#93c5fd",size:11}}
]};
Plotly.newPlot("plot-l29-chainrev-tr-extra",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Özet tablo — yaygın değişken değiştirme kalıpları.</strong> Sol sütundaki şekli bir integralin içinde gördüğünde, orta sütun sana $u$'nun ne olacağını söyler; sağ sütun ise geriye integrallenecek şeyi gösterir.</div>

<div style="margin:1.2rem 0;overflow-x:auto;border-radius:8px;border:1px solid rgba(59,130,246,0.25)">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.92rem">
<thead>
<tr style="background:#3b82f6;color:#0a0a0a">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">Kalıp (integrand şekli)</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-right:1px solid rgba(10,10,10,0.2)">$u$-seçimi</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em">Ortaya çıkan integral</th>
</tr>
</thead>
<tbody>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Genel zincir tersinmesi</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int f(g(x))\\,g'(x)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = g(x)$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = g'(x)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int f(u)\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Üs içinde polinom</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int (ax+b)^n\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = ax+b$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = a\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{a}\\int u^n\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">$\\sin/\\cos/e$ içinde kareli argüman</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int x\\,e^{x^2}\\,dx$ veya $\\int x\\sin(x^2)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = x^2$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = 2x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{2}\\int e^u\\,du,\\;\\;\\tfrac{1}{2}\\int \\sin u\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Karekök altında</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int x\\sqrt{x^2+c}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = x^2+c$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = 2x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{2}\\int \\sqrt{u}\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Paydanın türevi payda</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int \\frac{g'(x)}{g(x)}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = g(x)$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = g'(x)\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int \\frac{du}{u} = \\ln|u| + C$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Trig kuvveti × türevi</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int \\sin^n x\\,\\cos x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = \\sin x$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = \\cos x\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int u^n\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Logaritma ile $1/x$'i birlikte</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int \\frac{(\\ln x)^n}{x}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = \\ln x$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = \\tfrac{dx}{x}$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\int u^n\\,du$</td>
</tr>
<tr style="border-top:1px solid rgba(59,130,246,0.18)">
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)"><strong style="color:#3b82f6">Üstelin içinde doğrusal</strong><br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$\\displaystyle\\int e^{ax+b}\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem;border-right:1px solid rgba(59,130,246,0.12)">$u = ax+b$<br><span style="font-size:0.85rem;color:rgba(235,230,220,0.7)">$du = a\\,dx$</span></td>
<td style="padding:0.65rem 0.9rem">$\\displaystyle\\tfrac{1}{a}\\int e^u\\,du$</td>
</tr>
</tbody>
</table>
</div>

<p class="l-text"><strong>Tabloyu nasıl okuyacağın.</strong> İntegrandın şeklini sol sütundan tanı, orta sütun sana $u$'yu nereye koyacağını söyler. Sağ sütun, gerçekten hesaplaman gereken şeydir — neredeyse her zaman tek satırlık bir ters türev. Bu sekiz satırı ezberlersen, lise düzeyindeki değişken değiştirme problemlerinin belki %90'ını görür görmez çözersin.</p>

<!-- ============================================================
     BÖLÜM 9 — Belirli integralde
     ============================================================ -->
<h2 class="l-title">9. Belirli İntegralde Değişken Değiştirme: Sınırları Da Değiştir</h2>

<p class="l-text"><strong>Belirsiz</strong> bir integralde her zaman sona geri koyarak orijinal değişkene dönersin. <strong>Belirli</strong> bir integral $\\int_a^b f(x)\\,dx$ için ise daha hızlı bir yol var: integrandla birlikte sınırları da değiştir, sonra doğrudan $u$ üzerinden hesapla.</p>

<div class="calc-formula">
<div class="formula-label">BELİRLİ İNTEGRALDE DEĞİŞKEN DEĞİŞTİRME</div>
<div class="formula-main">$$\\int_{x=a}^{x=b} f(g(x))\\,g'(x)\\,dx \\;=\\; \\int_{u=g(a)}^{u=g(b)} f(u)\\,du$$</div>
<div class="formula-sub">Değişken $x$'ten $u$'ya geçtiğinde sınırlar da onunla birlikte değişir: alt sınır $g(a)$, üst sınır $g(b)$ olur.</div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">
<strong>Hesapla:</strong> $\\displaystyle\\int_0^1 2x\\,e^{x^2}\\,dx$.<br><br>
$u = x^2$ olsun, dolayısıyla $du = 2x\\,dx$. Yeni sınırlar: $x = 0 \\Rightarrow u = 0$; $x = 1 \\Rightarrow u = 1$.<br><br>
$$\\int_0^1 2x\\,e^{x^2}\\,dx \\;=\\; \\int_0^1 e^u\\,du \\;=\\; \\big[\\,e^u\\,\\big]_0^1 \\;=\\; e - 1 \\approx 1{,}718.$$
Geri koymak gerekmedi — cevap zaten bir sayı.
</div></div>

<div class="calc-graph"><div id="plot-l29-defint-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $[0,1]$ üzerinde $y = 2x\\,e^{x^2}$ integrandı (altın). Taralı alan $e - 1$'e eşittir. $u = x^2$ değişken değişiminden sonra bu bölge $[0,1]$ üzerindeki $y = e^u$ alanına dönüşür (karşılaştırma için camgöbeği gösterildi). Değişken değiştirme, zor eğriyi standart üstele dönüşecek şekilde yatay ekseni yeniden ölçeklendirir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=0;i<=100;i++){xs.push(i/100);}
var y1=xs.map(function(x){return 2*x*Math.exp(x*x);});
var y2=xs.map(function(x){return Math.exp(x);});
var trace1={x:xs,y:y1,mode:"lines",name:"y = 2x·e^(x²)",line:{color:"#c8a96e",width:2.6},fill:"tozeroy",fillcolor:"rgba(200,169,110,0.22)"};
var trace2={x:xs,y:y2,mode:"lines",name:"y = e^u (değişim sonrası)",line:{color:"#06b6d4",width:2.4,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x  (değişim sonrası u)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"integrand"},margin:{t:30,r:30,b:50,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-l29-defint-tr",[trace1,trace2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SIK YAPILAN HATA</div><div class="think-body">Değişim sonrası öğrenciler bazen integrandı $u$'ya çevirir ama sınırları değiştirmeyi <em>unutur</em> — sonra orijinal $x$-sınırlarıyla hesaplar. Sonuç dev bir hata payıyla yanlış çıkar. Ya ikisini birden (integrand ve sınırlar) değiştir ve $u$'da kal, ya da hiçbirini değiştirme (belirsiz integrali al, geri koy, sonra orijinal sınırlarda hesapla).</div></div>

<!-- ============================================================
     BÖLÜM 10 — Akış diyagramı
     ============================================================ -->
<h2 class="l-title">10. Değişken Değiştirme Akış Diyagramı</h2>

<p class="l-text">Görsel olarak her değişken değiştirme problemi aynı yolu izler. Aşağıdaki diyagram bu yolu çiziyor: orijinal integrand soldan girer, dört adımlı tarifle işlenir ve sağdan temiz bir $x$ cevabı olarak çıkar.</p>

<div class="calc-graph"><div id="plot-l29-flow-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu diyagram ne gösteriyor:</strong> $x$ cinsindeki bir integral (solda) $u = g(x)$, $du = g'(x)\\,dx$ seçimiyle $u$ cinsinden daha sade bir integrale (ortada) dönüşür, hesaplanır ve geri koyma ile orijinal değişkene döner (sağda). Eğrinin şekli değişmez — yalnızca koordinat sistemi değişir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var node1={x:[0.07],y:[0.5],mode:"markers+text",text:["∫ f(g(x))·g'(x) dx"],textposition:"middle right",marker:{size:60,color:"rgba(200,169,110,0.20)",line:{color:"#c8a96e",width:2}},textfont:{color:"#ebe6dc",size:13},name:"Girdi"};
var node2={x:[0.50],y:[0.5],mode:"markers+text",text:["∫ f(u) du"],textposition:"middle right",marker:{size:60,color:"rgba(6,182,212,0.20)",line:{color:"#06b6d4",width:2}},textfont:{color:"#ebe6dc",size:13},name:"Değişim sonrası",showlegend:false};
var node3={x:[0.88],y:[0.5],mode:"markers+text",text:["F(g(x)) + C"],textposition:"middle left",marker:{size:60,color:"rgba(168,85,247,0.20)",line:{color:"#a855f7",width:2}},textfont:{color:"#ebe6dc",size:13},name:"Son cevap",showlegend:false};
var arrow1={x:[0.18,0.40],y:[0.5,0.5],mode:"lines",line:{color:"#c8a96e",width:2},name:"u = g(x)",hoverinfo:"name"};
var arrow2={x:[0.60,0.78],y:[0.5,0.5],mode:"lines",line:{color:"#a855f7",width:2},name:"geri koy",hoverinfo:"name"};
var ann=[
  {x:0.29,y:0.6,text:"u seç, du hesapla",showarrow:false,font:{color:"#c8a96e",size:11}},
  {x:0.69,y:0.6,text:"integralle, sonra geri dön",showarrow:false,font:{color:"#a855f7",size:11}}
];
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[0.3,0.75]},margin:{t:20,r:20,b:20,l:20},showlegend:false,annotations:ann};
Plotly.newPlot("plot-l29-flow-tr",[arrow1,arrow2,node1,node2,node3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<!-- ============================================================
     BÖLÜM 11 — Trig substitution
     ============================================================ -->
<h2 class="l-title">11. İleriye Bir Göz: Trigonometrik Substitution</h2>

<p class="l-text">Değişken değiştirmenin $u$'yu $x$'in basit cebirsel bir ifadesi yapmaya mecbur değiliz. Bazen en temiz hamle $x$'i yeni bir $\\theta$ açısının bir <em>trigonometrik</em> fonksiyonu olarak almaktır. Bu <strong>trigonometrik substitution</strong> kalkülüste ayrıntılı incelenir; burada kısa bir önsöz veriyoruz.</p>

<div class="calc-formula">
<div class="formula-label">KLASİK TRİG SUBSTİTUSYONLAR</div>
<div class="formula-main">$$\\sqrt{a^2 - x^2}:\\;\\; x = a\\sin\\theta, \\qquad \\sqrt{a^2 + x^2}:\\;\\; x = a\\tan\\theta, \\qquad \\sqrt{x^2 - a^2}:\\;\\; x = a\\sec\\theta$$</div>
<div class="formula-sub">Her substitution kareköğü temiz bir trig özdeşliğine dönüştürür — sıkça $a\\cos\\theta$ ya da $a\\sec\\theta$ olur.</div>
</div>

<div class="calc-example"><div class="example-label">KISA ÖNSÖZ</div><div class="example-body">
<strong>Hesapla:</strong> $\\displaystyle\\int \\dfrac{dx}{\\sqrt{1 - x^2}}$.<br><br>
$x = \\sin\\theta$ olsun. O zaman $dx = \\cos\\theta\\,d\\theta$ ve $\\sqrt{1 - x^2} = \\sqrt{1 - \\sin^2\\theta} = \\cos\\theta$.<br>
$$\\int \\dfrac{dx}{\\sqrt{1 - x^2}} \\;=\\; \\int \\dfrac{\\cos\\theta\\,d\\theta}{\\cos\\theta} \\;=\\; \\int d\\theta \\;=\\; \\theta + C \\;=\\; \\arcsin x + C.$$
Bu, $1/\\sqrt{1 - x^2}$ fonksiyonunun ters türevini elde etmenin klasik yollarından biridir.
</div></div>

<p class="l-text">Lise sınavı için trig substitution'ı tam ustalıkla bilmek zorunda değilsin. Bu bölümün asıl noktası şudur: değişken değiştirme fikri, bir polinom $g$ için $u = g(x)$ olmaktan çok daha geneldir. İntegrandı sadeleştiren her zekice değişim sayılır.</p>

<!-- ============================================================
     BÖLÜM 12 — Klasik alıştırmalar
     ============================================================ -->
<h2 class="l-title">12. Klasik Alıştırmalar</h2>

<p class="l-text">Her birini önce kağıt üzerinde çözüp sonra çözümünü oku. Sekiz integralin sekizi de değişken değiştirmeyle temiz biçimde çıkar.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">
$\\displaystyle\\int (2x + 3)^5\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = 2x + 3$, $du = 2\\,dx$, $dx = \\tfrac{1}{2}\\,du$. O zaman $\\int u^5 \\cdot \\tfrac{1}{2}\\,du = \\tfrac{1}{12}u^6 + C = \\tfrac{1}{12}(2x+3)^6 + C$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">
$\\displaystyle\\int x\\sqrt{1 - x^2}\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = 1 - x^2$, $du = -2x\\,dx$, dolayısıyla $x\\,dx = -\\tfrac{1}{2}\\,du$. O zaman $\\int \\sqrt{u}\\cdot(-\\tfrac{1}{2})\\,du = -\\tfrac{1}{2}\\cdot \\tfrac{2}{3}u^{3/2} = -\\tfrac{1}{3}(1 - x^2)^{3/2} + C$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body">
$\\displaystyle\\int \\dfrac{x}{x^2 + 4}\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = x^2 + 4$, $du = 2x\\,dx$, $x\\,dx = \\tfrac{1}{2}\\,du$. O zaman $\\int \\dfrac{1}{u}\\cdot \\tfrac{1}{2}\\,du = \\tfrac{1}{2}\\ln|u| + C = \\tfrac{1}{2}\\ln(x^2 + 4) + C$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">
$\\displaystyle\\int \\cos x\\,\\sin^3 x\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = \\sin x$, $du = \\cos x\\,dx$. O zaman $\\int u^3\\,du = \\tfrac{1}{4}u^4 + C = \\tfrac{1}{4}\\sin^4 x + C$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body">
$\\displaystyle\\int e^{\\,3x + 1}\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = 3x + 1$, $du = 3\\,dx$, $dx = \\tfrac{1}{3}\\,du$. O zaman $\\int e^u \\cdot \\tfrac{1}{3}\\,du = \\tfrac{1}{3}e^u + C = \\tfrac{1}{3}e^{3x+1} + C$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 (BELİRLİ)</div><div class="example-body">
$\\displaystyle\\int_0^{\\pi/2} \\sin x\\,\\cos x\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = \\sin x$, $du = \\cos x\\,dx$. Yeni sınırlar: $x = 0 \\Rightarrow u = 0$; $x = \\pi/2 \\Rightarrow u = 1$. O zaman $\\int_0^1 u\\,du = \\tfrac{1}{2}u^2\\big|_0^1 = \\tfrac{1}{2}$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 (BELİRLİ)</div><div class="example-body">
$\\displaystyle\\int_1^{e} \\dfrac{\\ln x}{x}\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = \\ln x$, $du = \\tfrac{dx}{x}$. Yeni sınırlar: $x = 1 \\Rightarrow u = 0$; $x = e \\Rightarrow u = 1$. O zaman $\\int_0^1 u\\,du = \\tfrac{1}{2}$.
</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body">
$x > 1$ için $\\displaystyle\\int \\dfrac{1}{x\\,\\ln x}\\,dx$'i hesapla.<br><br>
<strong>Çözüm.</strong> $u = \\ln x$, $du = \\tfrac{dx}{x}$. O zaman $\\int \\dfrac{du}{u} = \\ln|u| + C = \\ln|\\ln x| + C$.
</div></div>

<div class="think-box"><div class="think-label">KAPANIŞ DÜŞÜNCESİ</div><div class="think-body">Değişken değiştirme, içgörüden çok pratiği ödüllendirir. On kadar çözümlü problemden sonra $u$ seçimi otomatik hale gelir — herhangi bir integrandda "iç fonksiyon ve türevini" saniyeler içinde görürsün. Şimdiye kadar gördüğün kalıpların bir defterini tut; sınavdaki hemen her yeni integral, onlardan birinin küçük bir varyasyonudur.</div></div>

<p class="l-text"><em>Ders 29 sonu.</em> Bir sonraki ders <em>kısmî integrasyona</em> geçer — çarpım kuralının integraldeki karşılığı ve lise integralleri için diğer iş gücü teknik.</p>
`

};
