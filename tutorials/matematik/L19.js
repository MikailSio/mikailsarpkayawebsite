window.LISE_MAT_L19 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far you have learned to differentiate sums, differences, constants, powers, and constant multiples of functions.</strong> That toolbox is enough to handle any polynomial — but the real world rarely hands us polynomials. Real functions are often <em>products</em> of two things multiplied together, <em>quotients</em> of one thing divided by another, or one function <em>composed</em> inside another. To attack those forms we need three new rules: the <strong>product rule</strong>, the <strong>quotient rule</strong>, and the <strong>chain rule</strong>. Together they unlock the derivative of practically every function you will meet in high school and beyond.</p>

<p class="l-text">Each rule has a clean algebraic statement, a short proof from the limit definition, and a steady recipe for using it. We will go slowly. Every step will be shown. After this lesson you will be able to differentiate $x^2 \\sin x$, $\\dfrac{x+1}{x^2-3}$, or $\\sqrt{x^3+1}$ without hesitation.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State and prove the product rule $(fg)' = f'g + fg'$ from the limit definition</li>
<li>State and derive the quotient rule $(f/g)' = (f'g - fg')/g^2$ as a consequence of the product rule</li>
<li>Recognize a composition $(f \\circ g)(x) = f(g(x))$ and identify its outer and inner parts</li>
<li>Apply the chain rule $(f \\circ g)' = f'(g(x)) \\cdot g'(x)$ to nested expressions</li>
<li>Handle multi-layer compositions by applying the chain rule repeatedly</li>
<li>Combine all three rules in a single problem and solve cleanly</li>
</ul>
</div>

<h2 class="l-title">1. The Product Rule: Statement, Intuition, Proof</h2>

<div class="calc-highlight"><strong>One-line statement:</strong> if $f$ and $g$ are differentiable at $x$, then the derivative of their product is <em>not</em> $f'g'$. The correct formula has two terms: $(fg)' = f'g + fg'$. Remembering "derivative of the first times the second, plus the first times the derivative of the second" is the standard mnemonic.</div>

<p class="l-text">A common beginner mistake is to assume $(fg)' = f' g'$ by analogy with $(f+g)' = f' + g'$. This is wrong. Sums behave linearly under differentiation, but products do not. The product rule patches the defect with an elegant two-term formula.</p>

<div class="calc-formula"><div class="formula-label">THE PRODUCT RULE</div><div class="formula-main">$$\\frac{d}{dx}\\bigl[ f(x) \\cdot g(x) \\bigr] \\;=\\; f'(x) \\, g(x) \\;+\\; f(x) \\, g'(x)$$</div><div class="formula-sub">Read aloud: "derivative of the first times the second, plus the first times the derivative of the second."</div></div>

<p class="l-text"><strong>Geometric intuition (rectangle argument).</strong> Imagine a rectangle whose width is $f(x)$ and whose height is $g(x)$. Its area is $A(x) = f(x) \\, g(x)$. When $x$ increases by a small amount $h$, the width grows by $\\Delta f = f(x+h) - f(x)$ and the height grows by $\\Delta g = g(x+h) - g(x)$. The new area is split into four pieces:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Original rectangle</div><div class="card-body">Area $f(x) \\cdot g(x)$ — the part that does not change.</div></div>
<div class="calc-card"><div class="card-title">Right strip</div><div class="card-body">Area $\\Delta f \\cdot g(x)$ — comes from widening the rectangle to the right.</div></div>
<div class="calc-card"><div class="card-title">Top strip</div><div class="card-body">Area $f(x) \\cdot \\Delta g$ — comes from raising the top of the rectangle.</div></div>
<div class="calc-card"><div class="card-title">Tiny corner</div><div class="card-body">Area $\\Delta f \\cdot \\Delta g$ — a small square in the corner; this vanishes in the limit.</div></div>
</div>

<p class="l-text">Dividing the increase in area by $h$ and letting $h \\to 0$, the tiny corner $\\Delta f \\cdot \\Delta g / h$ goes to zero (it carries two factors of $h$), and the two strips give the product rule's two terms. This rectangle picture is the same one Leibniz himself used in 1684 when he first published the rule.</p>

<div class="calc-graph"><div id="plot-l19-rect-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a rectangle with width $f$ and height $g$ (blue), and the two added strips $\\Delta f \\cdot g$ (gold) and $f \\cdot \\Delta g$ (red) when $f$ and $g$ both grow slightly. The small corner piece $\\Delta f \\cdot \\Delta g$ (dashed) is the part that vanishes in the limit.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var f=3, g=2, df=0.6, dg=0.5;
var t1={x:[0,f,f,0,0],y:[0,0,g,g,0],fill:'toself',mode:'lines',name:'fg (original)',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.2)'};
var t2={x:[f,f+df,f+df,f,f],y:[0,0,g,g,0],fill:'toself',mode:'lines',name:'Δf · g (right)',line:{color:'#c8a96e',width:2},fillcolor:'rgba(200,169,110,0.3)'};
var t3={x:[0,f,f,0,0],y:[g,g,g+dg,g+dg,g],fill:'toself',mode:'lines',name:'f · Δg (top)',line:{color:'#ef4444',width:2},fillcolor:'rgba(239,68,68,0.25)'};
var t4={x:[f,f+df,f+df,f,f],y:[g,g,g+dg,g+dg,g],fill:'toself',mode:'lines',name:'Δf · Δg (corner)',line:{color:'rgba(235,230,220,0.6)',width:1.5,dash:'dot'},fillcolor:'rgba(235,230,220,0.1)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc'},xaxis:{title:'width',range:[-0.3,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'height',range:[-0.3,3.0],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l19-rect-en',[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Proof from the limit definition.</strong> Let $P(x) = f(x) \\, g(x)$. By the definition of the derivative,</p>

<div class="calc-formula"><div class="formula-main">$$P'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) \\, g(x+h) \\;-\\; f(x) \\, g(x)}{h}.$$</div></div>

<p class="l-text">The clever trick is to add and subtract the cross-term $f(x+h) \\, g(x)$ in the numerator:</p>

<div class="calc-formula"><div class="formula-main">$$P'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) \\, g(x+h) \\;-\\; f(x+h) \\, g(x) \\;+\\; f(x+h) \\, g(x) \\;-\\; f(x) \\, g(x)}{h}.$$</div></div>

<p class="l-text">Group the four terms in pairs and factor:</p>

<div class="calc-formula"><div class="formula-main">$$P'(x) \\;=\\; \\lim_{h \\to 0} \\left[ f(x+h) \\cdot \\frac{g(x+h) - g(x)}{h} \\;+\\; \\frac{f(x+h) - f(x)}{h} \\cdot g(x) \\right].$$</div></div>

<p class="l-text">Now apply standard limit laws. As $h \\to 0$, $f(x+h) \\to f(x)$ (continuity, which follows from differentiability), $\\dfrac{g(x+h)-g(x)}{h} \\to g'(x)$, and $\\dfrac{f(x+h)-f(x)}{h} \\to f'(x)$. The result is exactly $f(x) \\, g'(x) + f'(x) \\, g(x)$, completing the proof.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Why do we add and subtract $f(x+h) \\, g(x)$ rather than $f(x) \\, g(x+h)$? Both work — they lead to the same final formula. The choice is a matter of taste. The key idea is to introduce a hybrid term so that we can factor out a difference quotient.</div></div>

<h2 class="l-title">2. Product Rule: Worked Examples</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — POLYNOMIAL TIMES POLYNOMIAL</div><div class="example-body"><strong>Differentiate</strong> $y = (x^2 + 1)(x^3 - 2x)$.<br><br>Identify $f(x) = x^2 + 1$ and $g(x) = x^3 - 2x$. Then $f'(x) = 2x$ and $g'(x) = 3x^2 - 2$. Apply the product rule:<br><br>$y' = f'g + fg' = (2x)(x^3 - 2x) + (x^2 + 1)(3x^2 - 2)$.<br><br>Expand: $y' = 2x^4 - 4x^2 + 3x^4 - 2x^2 + 3x^2 - 2 = \\mathbf{5x^4 - 3x^2 - 2}$.<br><br><strong>Sanity check:</strong> expand the original first to get $y = x^5 - 2x^3 + x^3 - 2x = x^5 - x^3 - 2x$, then $y' = 5x^4 - 3x^2 - 2$. Agreement.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — POLYNOMIAL TIMES TRIG</div><div class="example-body"><strong>Differentiate</strong> $y = x^2 \\sin x$.<br><br>Take $f(x) = x^2$ and $g(x) = \\sin x$. Then $f'(x) = 2x$ and $g'(x) = \\cos x$.<br><br>$y' = (2x)(\\sin x) + (x^2)(\\cos x) = \\mathbf{2x \\sin x + x^2 \\cos x}$.<br><br><em>Note:</em> there is no way to "expand" this and avoid the product rule, so the product rule is genuinely needed here.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — EXPONENTIAL TIMES TRIG</div><div class="example-body"><strong>Differentiate</strong> $y = e^x \\cos x$.<br><br>$f(x) = e^x$ with $f'(x) = e^x$, and $g(x) = \\cos x$ with $g'(x) = -\\sin x$.<br><br>$y' = e^x \\cos x + e^x \\, (-\\sin x) = \\mathbf{e^x (\\cos x - \\sin x)}$.<br><br>Factoring out the common $e^x$ keeps the answer compact.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — THREE-FACTOR PRODUCT</div><div class="example-body"><strong>Differentiate</strong> $y = x \\cdot \\sin x \\cdot \\cos x$.<br><br>The product rule extends to three (or more) factors: $(fgh)' = f'gh + fg'h + fgh'$. The pattern is "differentiate one factor at a time, leave the others alone, then add the results."<br><br>$y' = (1)(\\sin x)(\\cos x) + (x)(\\cos x)(\\cos x) + (x)(\\sin x)(-\\sin x)$<br><br>$\\phantom{y'} = \\mathbf{\\sin x \\cos x + x \\cos^2 x - x \\sin^2 x}$.<br><br>Optional simplification using $\\sin 2x = 2 \\sin x \\cos x$ and $\\cos 2x = \\cos^2 x - \\sin^2 x$: $y' = \\dfrac{1}{2} \\sin 2x + x \\cos 2x$.</div></div>

<div class="l-note"><strong>Common pitfall:</strong> writing $(fg)' = f' g'$. This is the most frequent mistake in introductory calculus. Always count the terms: the correct formula has <em>two</em> terms and they are <em>added</em>.</div>

<h2 class="l-title">3. The Quotient Rule: Statement and Derivation</h2>

<div class="calc-highlight"><strong>One-line statement:</strong> the derivative of a quotient is "low d-high minus high d-low, all over low squared" — a classical mnemonic. In symbols, $(f/g)' = (f'g - fg')/g^2$, valid wherever $g(x) \\ne 0$.</div>

<div class="calc-formula"><div class="formula-label">THE QUOTIENT RULE</div><div class="formula-main">$$\\frac{d}{dx}\\left[ \\frac{f(x)}{g(x)} \\right] \\;=\\; \\frac{f'(x) \\, g(x) \\;-\\; f(x) \\, g'(x)}{\\bigl[g(x)\\bigr]^{2}}, \\qquad g(x) \\ne 0$$</div><div class="formula-sub">Order matters in the numerator: it is $f'g$ first, then $-fg'$. Swapping the sign is the most common mistake.</div></div>

<p class="l-text"><strong>Derivation from the product rule.</strong> Let $Q(x) = f(x)/g(x)$. Multiplying both sides by $g(x)$ gives $f(x) = Q(x) \\, g(x)$. Differentiate both sides using the product rule:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) \\;=\\; Q'(x) \\, g(x) \\;+\\; Q(x) \\, g'(x).$$</div></div>

<p class="l-text">Solve for $Q'(x)$:</p>

<div class="calc-formula"><div class="formula-main">$$Q'(x) \\;=\\; \\frac{f'(x) - Q(x) \\, g'(x)}{g(x)} \\;=\\; \\frac{f'(x) - \\dfrac{f(x)}{g(x)} \\, g'(x)}{g(x)} \\;=\\; \\frac{f'(x) \\, g(x) - f(x) \\, g'(x)}{\\bigl[g(x)\\bigr]^{2}}.$$</div></div>

<p class="l-text">That is the quotient rule. Notice that we never needed a separate proof from the limit definition — the product rule plus a little algebra is enough.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mnemonic: "lo d-hi minus hi d-lo"</div><div class="card-body">Some students remember the formula as: <em>low</em> ($g$) times <em>derivative of high</em> ($f'$) minus <em>high</em> ($f$) times <em>derivative of low</em> ($g'$), all over <em>low squared</em> ($g^2$). The order convention is: differentiate the numerator first.</div></div>
<div class="calc-card"><div class="card-title">Why $g^2$ in the denominator?</div><div class="card-body">It is the natural consequence of solving for $Q'$ from $f = Qg$: dividing by $g$ once turns $Q$ into $f/g$, dividing again is what creates the $g^2$.</div></div>
<div class="calc-card"><div class="card-title">When can we use the power rule instead?</div><div class="card-body">If the quotient simplifies to a single power of $x$ — for instance $x^5 / x^2 = x^3$ — the power rule is faster. The quotient rule earns its keep when no such simplification exists.</div></div>
</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">The quotient rule and the product rule have one key sign difference: products add, quotients subtract. The mnemonic "lo d-hi <em>minus</em> hi d-lo" reminds you of this. Forgetting the minus sign or swapping the order of the two terms is the most common quotient-rule mistake.</div></div>

<h2 class="l-title">4. Quotient Rule: Worked Examples</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — RATIONAL FUNCTION</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{x + 1}{x^2 - 3}$.<br><br>Set $f = x + 1$ and $g = x^2 - 3$. Then $f' = 1$ and $g' = 2x$.<br><br>$y' = \\dfrac{f' g - f g'}{g^2} = \\dfrac{(1)(x^2 - 3) - (x + 1)(2x)}{(x^2 - 3)^2}$.<br><br>Simplify the numerator: $x^2 - 3 - 2x^2 - 2x = -x^2 - 2x - 3 = -(x^2 + 2x + 3)$.<br><br>$y' = \\mathbf{\\dfrac{-(x^2 + 2x + 3)}{(x^2 - 3)^2}}$. The numerator never factors over the reals, so this is the simplest form.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — TANGENT FROM SINE OVER COSINE</div><div class="example-body"><strong>Derive</strong> $\\dfrac{d}{dx} \\tan x = \\sec^2 x$ <strong>using the quotient rule.</strong><br><br>By definition $\\tan x = \\dfrac{\\sin x}{\\cos x}$. Take $f = \\sin x$ and $g = \\cos x$. Then $f' = \\cos x$ and $g' = -\\sin x$.<br><br>$(\\tan x)' = \\dfrac{(\\cos x)(\\cos x) - (\\sin x)(-\\sin x)}{\\cos^2 x} = \\dfrac{\\cos^2 x + \\sin^2 x}{\\cos^2 x}$.<br><br>Use the Pythagorean identity $\\sin^2 x + \\cos^2 x = 1$: $(\\tan x)' = \\dfrac{1}{\\cos^2 x} = \\mathbf{\\sec^2 x}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — EXPONENTIAL OVER POLYNOMIAL</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{e^x}{x}$.<br><br>$f = e^x$, $f' = e^x$. $g = x$, $g' = 1$.<br><br>$y' = \\dfrac{e^x \\cdot x - e^x \\cdot 1}{x^2} = \\dfrac{e^x (x - 1)}{x^2}$.<br><br><strong>Where is $y'$ zero?</strong> When $x - 1 = 0$, i.e. at $x = 1$. (The factor $e^x$ is never zero.) So $y$ has a critical point at $x = 1$ — useful for later optimization problems.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — RECIPROCAL VIA QUOTIENT RULE</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{1}{x^2 + 1}$.<br><br>Take $f = 1$ (constant, $f' = 0$) and $g = x^2 + 1$ ($g' = 2x$).<br><br>$y' = \\dfrac{0 \\cdot (x^2 + 1) - 1 \\cdot (2x)}{(x^2 + 1)^2} = \\mathbf{\\dfrac{-2x}{(x^2 + 1)^2}}$.<br><br>In section 7 we will redo this same problem with the chain rule and get the same answer with less work.</div></div>

<div class="l-note"><strong>Reminder about the domain:</strong> the quotient rule is valid wherever $g(x) \\ne 0$. At points where $g$ vanishes, $f/g$ is undefined and so is its derivative.</div>

<h2 class="l-title">5. Composite Functions: A Refresher</h2>

<div class="calc-highlight"><strong>A composite function is a function inside a function.</strong> If $g$ takes $x$ to $g(x)$, and $f$ takes that output and produces $f(g(x))$, the combined operation is the composition, written $(f \\circ g)(x) = f(g(x))$. Reading right to left: first $g$, then $f$.</div>

<p class="l-text">Examples of composite functions:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$y = \\sqrt{x^2 + 1}$</div><div class="card-body">Inner $g(x) = x^2 + 1$, outer $f(u) = \\sqrt{u}$. The output of $g$ becomes the input of $f$.</div></div>
<div class="calc-card"><div class="card-title">$y = \\sin(3x)$</div><div class="card-body">Inner $g(x) = 3x$, outer $f(u) = \\sin u$. Multiplication by $3$ happens first, then the sine.</div></div>
<div class="calc-card"><div class="card-title">$y = (x^2 - 7)^{10}$</div><div class="card-body">Inner $g(x) = x^2 - 7$, outer $f(u) = u^{10}$. Without the chain rule we would have to expand a tenth-power binomial.</div></div>
<div class="calc-card"><div class="card-title">$y = e^{\\cos x}$</div><div class="card-body">Inner $g(x) = \\cos x$, outer $f(u) = e^u$. Two layers of "stuff inside stuff."</div></div>
</div>

<p class="l-text"><strong>How to identify the inner function.</strong> Ask yourself: "If I asked someone to compute this expression in their head, what would they do <em>first</em>?" The first operation is the inner function $g$; everything wrapped around it is the outer function $f$. For $\\sin(3x)$: first multiply by 3 (inner), then take sine (outer). For $\\sqrt{x^2 + 1}$: first square and add 1 (inner), then take the square root (outer).</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">For $y = \\cos^3 x$ (read: cosine of $x$, cubed), what is inner and what is outer? Inner is $g(x) = \\cos x$, outer is $f(u) = u^3$. The "cube it" happens last, so the cube is the outer function.</div></div>

<h2 class="l-title">6. The Chain Rule: Statement, Intuition, Outline of Proof</h2>

<div class="calc-highlight"><strong>One-line statement:</strong> to differentiate a composition, take the derivative of the outer function evaluated at the inner function, and multiply by the derivative of the inner function. In symbols: $(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$. The mantra "outer derivative times inner derivative" is enough to remember once you understand which is which.</div>

<div class="calc-formula"><div class="formula-label">THE CHAIN RULE</div><div class="formula-main">$$\\frac{d}{dx} \\bigl[ f(g(x)) \\bigr] \\;=\\; f'\\bigl(g(x)\\bigr) \\cdot g'(x)$$</div><div class="formula-sub">Or in Leibniz notation, with $u = g(x)$ and $y = f(u)$: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$.</div></div>

<p class="l-text"><strong>Leibniz form and why it is helpful.</strong> Set $u = g(x)$ and $y = f(u)$. The chain rule says $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$. Read this as a cancellation: "the $du$ on top cancels the $du$ on the bottom." This is purely a mnemonic — $\\dfrac{dy}{du}$ is a single symbol, not a fraction — but the cancellation pattern is exactly right and very convenient.</p>

<p class="l-text"><strong>Intuitive picture (gears).</strong> Suppose $u$ depends on $x$ at rate $\\dfrac{du}{dx} = 3$ (when $x$ moves 1 unit, $u$ moves 3 units), and $y$ depends on $u$ at rate $\\dfrac{dy}{du} = 5$ (when $u$ moves 1 unit, $y$ moves 5 units). Then when $x$ moves 1 unit, $u$ moves 3 units, which makes $y$ move $3 \\times 5 = 15$ units. So $\\dfrac{dy}{dx} = 15 = 3 \\times 5$. The chain rule is multiplication of rates — exactly like two meshed gears.</p>

<div class="calc-graph"><div id="plot-l19-chain-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a flow diagram for the chain rule. Input $x$ enters the inner function $g$ (rate $g'(x)$), producing $u = g(x)$. That $u$ enters the outer function $f$ (rate $f'(u)$), producing $y$. The overall rate is the product of the two stage rates.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var boxes=[
  {x0:0.05,x1:0.22,y0:0.35,y1:0.65,label:'x',color:'rgba(59,130,246,0.18)',line:'#3b82f6'},
  {x0:0.36,x1:0.58,y0:0.30,y1:0.70,label:'g (inner)',color:'rgba(200,169,110,0.18)',line:'#c8a96e'},
  {x0:0.72,x1:0.94,y0:0.30,y1:0.70,label:'f (outer)',color:'rgba(239,68,68,0.18)',line:'#ef4444'}
];
var shapes=boxes.map(function(b){return {type:'rect',x0:b.x0,x1:b.x1,y0:b.y0,y1:b.y1,line:{color:b.line,width:2.5},fillcolor:b.color};});
shapes.push({type:'path',path:'M 0.22 0.50 L 0.36 0.50',line:{color:'#ebe6dc',width:2}});
shapes.push({type:'path',path:'M 0.58 0.50 L 0.72 0.50',line:{color:'#ebe6dc',width:2}});
shapes.push({type:'path',path:'M 0.94 0.50 L 0.99 0.50',line:{color:'#ebe6dc',width:2}});
var anns=[
  {x:0.135,y:0.50,text:'<b>x</b>',showarrow:false,font:{color:'#ebe6dc',size:18}},
  {x:0.47,y:0.50,text:'<b>g</b>',showarrow:false,font:{color:'#ebe6dc',size:18}},
  {x:0.47,y:0.22,text:'rate g′(x)',showarrow:false,font:{color:'#c8a96e',size:12}},
  {x:0.83,y:0.50,text:'<b>f</b>',showarrow:false,font:{color:'#ebe6dc',size:18}},
  {x:0.83,y:0.22,text:'rate f′(g(x))',showarrow:false,font:{color:'#ef4444',size:12}},
  {x:0.29,y:0.58,text:'g(x)',showarrow:false,font:{color:'#ebe6dc',size:12}},
  {x:0.65,y:0.58,text:'u=g(x)',showarrow:false,font:{color:'#ebe6dc',size:12}},
  {x:0.97,y:0.58,text:'y',showarrow:false,font:{color:'#ebe6dc',size:14}},
  {x:0.5,y:0.05,text:'overall rate dy/dx = f′(g(x)) · g′(x)',showarrow:false,font:{color:'#ebe6dc',size:13}}
];
var trace={x:[0],y:[0],mode:'markers',marker:{size:0.1,color:'rgba(0,0,0,0)'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc'},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[0,1]},shapes:shapes,annotations:anns,margin:{t:20,r:10,b:20,l:10},showlegend:false};
Plotly.newPlot('plot-l19-chain-en',[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Outline of the proof.</strong> Let $y = f(u)$ with $u = g(x)$. By the limit definition,</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{dy}{dx} \\;=\\; \\lim_{h \\to 0} \\frac{f(g(x+h)) - f(g(x))}{h}.$$</div></div>

<p class="l-text">Let $\\Delta u = g(x+h) - g(x)$. Multiply and divide by $\\Delta u$ (assuming $\\Delta u \\ne 0$ for small $h$; this technical case can be patched with a more careful argument):</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{dy}{dx} \\;=\\; \\lim_{h \\to 0} \\left[ \\frac{f(g(x) + \\Delta u) - f(g(x))}{\\Delta u} \\cdot \\frac{g(x+h) - g(x)}{h} \\right].$$</div></div>

<p class="l-text">As $h \\to 0$ we also have $\\Delta u \\to 0$ (because $g$ is continuous). The first factor approaches $f'(g(x))$ and the second approaches $g'(x)$. The product is $f'(g(x)) \\cdot g'(x)$. Done.</p>

<div class="l-note"><strong>Honesty note:</strong> a fully rigorous proof must handle the case where $\\Delta u = 0$ for arbitrarily small $h \\ne 0$ (i.e. $g$ is locally constant). This is treated in any university analysis textbook. For high school we accept the result as stated.</div>

<h2 class="l-title">7. Chain Rule: Step-by-Step Recipe</h2>

<p class="l-text">Here is a reliable five-step recipe for applying the chain rule. Use it on every chain-rule problem until the motions become automatic.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — identify inner and outer</div><div class="card-body">Write the expression as $f(g(x))$. The inner $g$ is whatever you would compute first; the outer $f$ is the operation wrapped around it.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — differentiate the outer</div><div class="card-body">Treat the inner expression as a single symbol $u$ and write down $f'(u)$. Do <em>not</em> simplify $u$ back to $g(x)$ yet.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — substitute back</div><div class="card-body">Replace $u$ with $g(x)$ inside $f'$ to get $f'(g(x))$. This is what the outer derivative looks like "in terms of $x$."</div></div>
<div class="calc-card"><div class="card-title">Step 4 — differentiate the inner</div><div class="card-body">Compute $g'(x)$ separately. This is typically a one-line calculation using the power rule, trig derivatives, or another chain rule if $g$ itself is a composition.</div></div>
<div class="calc-card"><div class="card-title">Step 5 — multiply</div><div class="card-body">The final answer is $f'(g(x)) \\cdot g'(x)$. Simplify if useful.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = \\sin(3x)$</div><div class="example-body"><strong>Step 1.</strong> Inner $g(x) = 3x$, outer $f(u) = \\sin u$.<br><strong>Step 2.</strong> $f'(u) = \\cos u$.<br><strong>Step 3.</strong> $f'(g(x)) = \\cos(3x)$.<br><strong>Step 4.</strong> $g'(x) = 3$.<br><strong>Step 5.</strong> $y' = \\cos(3x) \\cdot 3 = \\mathbf{3 \\cos(3x)}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = (x^2 - 7)^{10}$</div><div class="example-body"><strong>Step 1.</strong> Inner $g(x) = x^2 - 7$, outer $f(u) = u^{10}$.<br><strong>Step 2.</strong> $f'(u) = 10 u^9$.<br><strong>Step 3.</strong> $f'(g(x)) = 10 (x^2 - 7)^9$.<br><strong>Step 4.</strong> $g'(x) = 2x$.<br><strong>Step 5.</strong> $y' = 10 (x^2 - 7)^9 \\cdot 2x = \\mathbf{20 x (x^2 - 7)^9}$.<br><br><em>Without the chain rule</em> we would have to expand the tenth power of a binomial and then differentiate term by term — many hundreds of operations. The chain rule does it in one line.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = \\sqrt{x^2 + 1}$</div><div class="example-body">Rewrite as $y = (x^2 + 1)^{1/2}$. Inner $g(x) = x^2 + 1$, outer $f(u) = u^{1/2}$. Then $f'(u) = \\dfrac{1}{2} u^{-1/2} = \\dfrac{1}{2 \\sqrt{u}}$, and $g'(x) = 2x$.<br><br>$y' = \\dfrac{1}{2 \\sqrt{x^2 + 1}} \\cdot 2x = \\mathbf{\\dfrac{x}{\\sqrt{x^2 + 1}}}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = \\dfrac{1}{x^2 + 1}$ (REDO USING CHAIN RULE)</div><div class="example-body">Rewrite as $y = (x^2 + 1)^{-1}$. Inner $g(x) = x^2 + 1$, outer $f(u) = u^{-1}$. Then $f'(u) = -u^{-2} = -\\dfrac{1}{u^2}$ and $g'(x) = 2x$.<br><br>$y' = -\\dfrac{1}{(x^2 + 1)^2} \\cdot 2x = \\mathbf{-\\dfrac{2x}{(x^2 + 1)^2}}$. Same answer as the quotient-rule version in section 4, but reached with less algebra.</div></div>

<div class="think-box"><div class="think-label">PATTERN TO MEMORIZE</div><div class="think-body">For any power $(\\text{stuff})^n$ the chain rule gives $n \\cdot (\\text{stuff})^{n-1} \\cdot (\\text{stuff})'$. For $\\sin(\\text{stuff})$ it gives $\\cos(\\text{stuff}) \\cdot (\\text{stuff})'$. For $e^{\\text{stuff}}$ it gives $e^{\\text{stuff}} \\cdot (\\text{stuff})'$. The pattern is always "outer derivative evaluated at the stuff, times the derivative of the stuff."</div></div>

<h2 class="l-title">8. Multiple Compositions (Chain Inside Chain)</h2>

<div class="calc-highlight"><strong>Sometimes the inner function is itself a composition.</strong> Then the chain rule has to be applied twice: outermost first, then middle, then innermost. The pattern is $(f \\circ g \\circ h)'(x) = f'(g(h(x))) \\cdot g'(h(x)) \\cdot h'(x)$ — a product of three derivatives, each evaluated at the appropriate layer.</div>

<div class="calc-formula"><div class="formula-label">CHAIN RULE FOR THREE LAYERS</div><div class="formula-main">$$\\frac{d}{dx} \\bigl[ f(g(h(x))) \\bigr] \\;=\\; f'\\bigl(g(h(x))\\bigr) \\cdot g'\\bigl(h(x)\\bigr) \\cdot h'(x)$$</div><div class="formula-sub">Or in Leibniz form: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dv} \\cdot \\dfrac{dv}{dx}$, where $v = h(x)$, $u = g(v)$, $y = f(u)$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = \\sin(\\cos(x^2))$</div><div class="example-body">Three layers: innermost $h(x) = x^2$, middle $g(v) = \\cos v$, outermost $f(u) = \\sin u$.<br><br>$h'(x) = 2x$, $g'(v) = -\\sin v$, $f'(u) = \\cos u$.<br><br>$y' = f'(g(h(x))) \\cdot g'(h(x)) \\cdot h'(x) = \\cos(\\cos(x^2)) \\cdot (-\\sin(x^2)) \\cdot 2x$<br><br>$\\phantom{y'} = \\mathbf{-2x \\sin(x^2) \\cos(\\cos(x^2))}$.<br><br>Notice: each derivative factor is evaluated at the appropriate "inside" — $f'$ at $\\cos(x^2)$, $g'$ at $x^2$, $h'$ at $x$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = \\sqrt{\\sin(3x)}$</div><div class="example-body">Three layers: $h(x) = 3x$, $g(v) = \\sin v$, $f(u) = \\sqrt{u} = u^{1/2}$.<br><br>$h' = 3$, $g'(v) = \\cos v$, $f'(u) = \\dfrac{1}{2 \\sqrt{u}}$.<br><br>$y' = \\dfrac{1}{2 \\sqrt{\\sin(3x)}} \\cdot \\cos(3x) \\cdot 3 = \\mathbf{\\dfrac{3 \\cos(3x)}{2 \\sqrt{\\sin(3x)}}}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $y = (1 + (2x + 1)^3)^{5}$</div><div class="example-body">Three layers from outside in: outer $u^5$, middle $1 + v^3$, inner $2x + 1$.<br><br>$y' = 5 \\cdot (1 + (2x+1)^3)^4 \\cdot 3(2x+1)^2 \\cdot 2$<br><br>$\\phantom{y'} = \\mathbf{30 \\, (2x+1)^2 \\, (1 + (2x+1)^3)^4}$.</div></div>

<div class="think-box"><div class="think-label">A USEFUL ORDER</div><div class="think-body">When peeling a multilayer composition, work from the <em>outside in</em>. Differentiate the outermost first, then the next layer, then the next. At each step the "everything inside" remains untouched until it is its turn. This produces a clean chain of factors you can multiply together at the end.</div></div>

<h2 class="l-title">9. Mixed Problems: All Three Rules in One</h2>

<p class="l-text">Real exam problems often combine the product, quotient, and chain rules in a single expression. The strategy is always the same: first identify the <em>outermost</em> structure (is the expression a product? a quotient? a composition?), apply the appropriate rule, then handle each piece in turn — using more product, quotient, or chain rules as required.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — PRODUCT + CHAIN</div><div class="example-body"><strong>Differentiate</strong> $y = x^2 \\sin(3x)$.<br><br>Outermost structure: a product of $x^2$ and $\\sin(3x)$. Use the product rule.<br><br>Let $u = x^2$ and $v = \\sin(3x)$. Then $u' = 2x$. For $v'$ we need the chain rule: $v' = \\cos(3x) \\cdot 3 = 3 \\cos(3x)$.<br><br>$y' = u' v + u v' = 2x \\sin(3x) + x^2 \\cdot 3 \\cos(3x) = \\mathbf{2x \\sin(3x) + 3 x^2 \\cos(3x)}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — QUOTIENT + CHAIN</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{e^{2x}}{x + 1}$.<br><br>Outermost: a quotient. Use the quotient rule.<br><br>$f = e^{2x}$, with $f' = e^{2x} \\cdot 2 = 2 e^{2x}$ (chain rule on the inner $2x$). $g = x + 1$, with $g' = 1$.<br><br>$y' = \\dfrac{2 e^{2x} (x + 1) - e^{2x} \\cdot 1}{(x + 1)^2} = \\dfrac{e^{2x} \\bigl[ 2(x + 1) - 1 \\bigr]}{(x + 1)^2} = \\mathbf{\\dfrac{e^{2x} (2x + 1)}{(x + 1)^2}}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — PRODUCT INSIDE A CHAIN</div><div class="example-body"><strong>Differentiate</strong> $y = \\sin(x \\cos x)$.<br><br>Outermost: a composition. Inner $g(x) = x \\cos x$, outer $f(u) = \\sin u$.<br><br>$f'(u) = \\cos u$, so $f'(g(x)) = \\cos(x \\cos x)$.<br><br>For $g'(x)$ we need the product rule: $g'(x) = (1)(\\cos x) + (x)(-\\sin x) = \\cos x - x \\sin x$.<br><br>$y' = \\cos(x \\cos x) \\cdot (\\cos x - x \\sin x) = \\mathbf{(\\cos x - x \\sin x) \\cos(x \\cos x)}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — ALL THREE RULES</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{x \\sin(2x)}{x^2 + 1}$.<br><br>Outermost: a quotient. Let $f = x \\sin(2x)$ (a product, needing the product rule, with one factor needing the chain rule) and $g = x^2 + 1$ ($g' = 2x$).<br><br>For $f'$: product rule on $x$ and $\\sin(2x)$. The derivative of $x$ is $1$. The derivative of $\\sin(2x)$ by the chain rule is $\\cos(2x) \\cdot 2 = 2 \\cos(2x)$. So $f' = 1 \\cdot \\sin(2x) + x \\cdot 2 \\cos(2x) = \\sin(2x) + 2x \\cos(2x)$.<br><br>Now the quotient rule:<br><br>$y' = \\dfrac{f' g - f g'}{g^2} = \\dfrac{[\\sin(2x) + 2x \\cos(2x)](x^2 + 1) - x \\sin(2x) \\cdot 2x}{(x^2 + 1)^2}$.<br><br>Expand and collect: $y' = \\mathbf{\\dfrac{(x^2 + 1)[\\sin(2x) + 2x \\cos(2x)] - 2 x^2 \\sin(2x)}{(x^2 + 1)^2}}$. (Leaving it factored is often cleaner than fully expanding.)</div></div>

<h2 class="l-title">10. Practice Problems</h2>

<p class="l-text">Try each problem on paper before reading the worked solution. The goal is to build automatic recognition: which rule first, which rule second, what is inner and what is outer.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body"><strong>Differentiate</strong> $y = (3x + 1)(x^2 - 4)$. <em>(Product rule.)</em><br><br><strong>Solution.</strong> $f = 3x + 1$, $f' = 3$. $g = x^2 - 4$, $g' = 2x$. $y' = 3(x^2 - 4) + (3x + 1)(2x) = 3x^2 - 12 + 6x^2 + 2x = \\mathbf{9 x^2 + 2x - 12}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body"><strong>Differentiate</strong> $y = x^3 \\cos x$. <em>(Product rule.)</em><br><br><strong>Solution.</strong> $f = x^3$, $f' = 3 x^2$. $g = \\cos x$, $g' = -\\sin x$. $y' = 3 x^2 \\cos x + x^3 (-\\sin x) = \\mathbf{3 x^2 \\cos x - x^3 \\sin x}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{2x + 1}{x - 3}$. <em>(Quotient rule.)</em><br><br><strong>Solution.</strong> $f = 2x + 1$, $f' = 2$. $g = x - 3$, $g' = 1$. $y' = \\dfrac{2(x - 3) - (2x + 1)(1)}{(x - 3)^2} = \\dfrac{2x - 6 - 2x - 1}{(x - 3)^2} = \\mathbf{\\dfrac{-7}{(x - 3)^2}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{\\sin x}{x^2}$. <em>(Quotient rule.)</em><br><br><strong>Solution.</strong> $f = \\sin x$, $f' = \\cos x$. $g = x^2$, $g' = 2x$. $y' = \\dfrac{(\\cos x)(x^2) - (\\sin x)(2x)}{x^4} = \\mathbf{\\dfrac{x \\cos x - 2 \\sin x}{x^3}}$ (after dividing numerator and denominator by $x$).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body"><strong>Differentiate</strong> $y = (4x - 7)^9$. <em>(Chain rule.)</em><br><br><strong>Solution.</strong> Outer $u^9$, inner $4x - 7$. $y' = 9 (4x - 7)^8 \\cdot 4 = \\mathbf{36 (4x - 7)^8}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body"><strong>Differentiate</strong> $y = \\cos(5x^2 + 1)$. <em>(Chain rule.)</em><br><br><strong>Solution.</strong> Outer $\\cos u$, inner $5 x^2 + 1$. $y' = -\\sin(5 x^2 + 1) \\cdot 10 x = \\mathbf{-10 x \\sin(5 x^2 + 1)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7</div><div class="example-body"><strong>Differentiate</strong> $y = e^{x^2 - 3x}$. <em>(Chain rule.)</em><br><br><strong>Solution.</strong> Outer $e^u$, inner $x^2 - 3x$. $y' = e^{x^2 - 3x} \\cdot (2x - 3) = \\mathbf{(2x - 3) e^{x^2 - 3x}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8</div><div class="example-body"><strong>Differentiate</strong> $y = \\sqrt{1 - x^2}$. <em>(Chain rule.)</em><br><br><strong>Solution.</strong> $y = (1 - x^2)^{1/2}$. $y' = \\dfrac{1}{2} (1 - x^2)^{-1/2} \\cdot (-2x) = \\mathbf{\\dfrac{-x}{\\sqrt{1 - x^2}}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9</div><div class="example-body"><strong>Differentiate</strong> $y = x \\sqrt{x^2 + 1}$. <em>(Product + chain.)</em><br><br><strong>Solution.</strong> Product of $x$ and $(x^2 + 1)^{1/2}$. Derivative of $x$ is $1$. Derivative of $(x^2 + 1)^{1/2}$ by chain rule is $\\dfrac{x}{\\sqrt{x^2 + 1}}$ (see problem 8 style).<br><br>$y' = 1 \\cdot \\sqrt{x^2 + 1} + x \\cdot \\dfrac{x}{\\sqrt{x^2 + 1}} = \\dfrac{(x^2 + 1) + x^2}{\\sqrt{x^2 + 1}} = \\mathbf{\\dfrac{2 x^2 + 1}{\\sqrt{x^2 + 1}}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10</div><div class="example-body"><strong>Differentiate</strong> $y = \\dfrac{\\sin(2x)}{1 + \\cos x}$. <em>(Quotient + chain.)</em><br><br><strong>Solution.</strong> $f = \\sin(2x)$, $f' = 2 \\cos(2x)$. $g = 1 + \\cos x$, $g' = -\\sin x$.<br><br>$y' = \\dfrac{2 \\cos(2x) (1 + \\cos x) - \\sin(2x)(-\\sin x)}{(1 + \\cos x)^2} = \\mathbf{\\dfrac{2 \\cos(2x)(1 + \\cos x) + \\sin x \\sin(2x)}{(1 + \\cos x)^2}}$.</div></div>

<h2 class="l-title">11. Visualizing the Chain Rule: $\\sin(x^2)$ and Its Derivative</h2>

<p class="l-text">The chain rule is easier to trust once you have seen it draw a picture. Let $y = \\sin(x^2)$. The inner is $g(x) = x^2$ (rate $g'(x) = 2x$) and the outer is $f(u) = \\sin u$ (rate $f'(u) = \\cos u$). By the chain rule, $y' = \\cos(x^2) \\cdot 2x$. Notice that the $2x$ factor stretches the oscillation: as $x$ grows, the derivative swings wider and faster, because the inner function $x^2$ is accelerating.</p>

<div class="calc-graph"><div id="plot-l19-sinx2-en-extra" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(g(x)) = \\sin(x^2)$ (blue) and its derivative $\\cos(x^2) \\cdot 2x$ (gold) over $x \\in [0, 3]$. Markers highlight a few zeros of the derivative — these are exactly the local extrema of $\\sin(x^2)$, where the chain-rule factor $\\cos(x^2)$ vanishes. The visible "outer × inner" structure: the oscillation of $\\cos(x^2)$ multiplied by the linearly growing factor $2x$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var dys=[];
for(var i=0;i<=600;i++){var x=i*3/600;xs.push(x);ys.push(Math.sin(x*x));dys.push(Math.cos(x*x)*2*x);}
var extremaX=[Math.sqrt(Math.PI/2),Math.sqrt(3*Math.PI/2),Math.sqrt(5*Math.PI/2),Math.sqrt(7*Math.PI/2)];
var extremaY=extremaX.map(function(x){return Math.sin(x*x);});
var extremaDy=extremaX.map(function(x){return 0;});
var t1={x:xs,y:ys,mode:'lines',name:'f(g(x)) = sin(x²)',line:{color:'#3b82f6',width:2.2}};
var t2={x:xs,y:dys,mode:'lines',name:"y' = cos(x²)·2x",line:{color:'#c8a96e',width:2.2}};
var t3={x:extremaX,y:extremaY,mode:'markers',name:'local extrema of sin(x²)',marker:{color:'#3b82f6',size:9,symbol:'circle',line:{color:'#ebe6dc',width:1.5}}};
var t4={x:extremaX,y:extremaDy,mode:'markers',name:"zeros of y'",marker:{color:'#c8a96e',size:9,symbol:'diamond',line:{color:'#ebe6dc',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc'},xaxis:{title:'x',range:[0,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'value',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l19-sinx2-en-extra',[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">12. Summary Table of Derivative Rules</h2>

<p class="l-text">The five rules of this lesson and the two basic rules from earlier, gathered side by side. Every problem you meet is a combination of these.</p>

<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem;margin:1.4rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;line-height:1.55">
<thead>
<tr style="border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="text-align:left;padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Rule</th>
<th style="text-align:left;padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Formula</th>
<th style="text-align:left;padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Example</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Sum</strong></td>
<td style="padding:0.6rem 0.9rem">$(f + g)' = f' + g'$</td>
<td style="padding:0.6rem 0.9rem">$(x^3 + \\sin x)' = 3x^2 + \\cos x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Constant multiple</strong></td>
<td style="padding:0.6rem 0.9rem">$(c \\cdot f)' = c \\cdot f'$</td>
<td style="padding:0.6rem 0.9rem">$(5 x^2)' = 10 x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Product</strong></td>
<td style="padding:0.6rem 0.9rem">$(f g)' = f' g + f g'$</td>
<td style="padding:0.6rem 0.9rem">$(x^2 \\sin x)' = 2x \\sin x + x^2 \\cos x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Quotient</strong></td>
<td style="padding:0.6rem 0.9rem">$\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f' g - f g'}{g^2}$</td>
<td style="padding:0.6rem 0.9rem">$\\left(\\dfrac{e^x}{x}\\right)' = \\dfrac{e^x (x - 1)}{x^2}$</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Chain</strong></td>
<td style="padding:0.6rem 0.9rem">$(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$</td>
<td style="padding:0.6rem 0.9rem">$\\bigl(\\sin(x^2)\\bigr)' = \\cos(x^2) \\cdot 2x$</td>
</tr>
</tbody>
</table>
</div>

<p class="l-text"><strong>How to use the table.</strong> Look at the outermost structure of your expression. If it is a sum, the answer is the sum of the derivatives. If it is a product, two terms with a plus. A quotient — two terms with a minus and a $g^2$ on the bottom. A composition — outer derivative at the inner, times the derivative of the inner. Most exam problems are nested combinations of these five lines.</p>

<div class="l-note"><strong>Summary of this lesson.</strong> Three rules, used everywhere: <strong>(fg)' = f'g + fg'</strong>, <strong>(f/g)' = (f'g - fg')/g²</strong>, <strong>(f∘g)' = f'(g(x)) · g'(x)</strong>. Recognize which one you need by looking at the outermost structure. Then apply more rules inside as needed. In the next lesson we will use these tools on logarithm and exponential derivatives, and start the optimization problems that motivated the whole subject.</div>`,

/* ============================================================
   TÜRKÇE VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şimdiye kadar toplamların, farkların, sabitlerin, kuvvetlerin ve sabit çarpanlı fonksiyonların türevini almayı öğrendiniz.</strong> Bu araç kutusu her polinomu işlemek için yeterli — fakat gerçek hayat bize nadiren polinom verir. Gerçek fonksiyonlar çoğu zaman iki şeyin <em>çarpımı</em>, birinin diğerine <em>bölümü</em> veya bir fonksiyonun başka bir fonksiyonun içine <em>yerleştirilmiş</em> hali olarak karşımıza çıkar. Bu biçimleri çözmek için üç yeni kurala ihtiyacımız var: <strong>çarpım kuralı</strong>, <strong>bölüm kuralı</strong> ve <strong>zincir kuralı</strong>. Bu üçü birlikte, lise ve sonrasında karşılaşacağınız hemen hemen her fonksiyonun türevini almanın kapısını açar.</p>

<p class="l-text">Her kuralın temiz bir cebirsel ifadesi, limit tanımından türetilmiş kısa bir kanıtı ve kullanım için tutarlı bir tarifi vardır. Yavaş ilerleyeceğiz. Her adım gösterilecek. Bu dersten sonra $x^2 \\sin x$, $\\dfrac{x+1}{x^2-3}$ veya $\\sqrt{x^3+1}$ türevlerini tereddütsüz alabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çarpım kuralı $(fg)' = f'g + fg'$ ifadesini limit tanımından kanıtlamak</li>
<li>Bölüm kuralı $(f/g)' = (f'g - fg')/g^2$ formülünü çarpım kuralının bir sonucu olarak türetmek</li>
<li>Bir bileşke $(f \\circ g)(x) = f(g(x))$ tanımak ve dış/iç parçalarını ayırt etmek</li>
<li>Zincir kuralı $(f \\circ g)' = f'(g(x)) \\cdot g'(x)$ ifadesini iç içe yapılara uygulamak</li>
<li>Çok katmanlı bileşkeleri zincir kuralını ardarda uygulayarak çözmek</li>
<li>Üç kuralı tek bir problemde birleştirip temiz şekilde sonuç almak</li>
</ul>
</div>

<h2 class="l-title">1. Çarpım Kuralı: İfade, Sezgi, Kanıt</h2>

<div class="calc-highlight"><strong>Tek satırlık ifade:</strong> $f$ ve $g$ fonksiyonları $x$ noktasında türevlenebiliyorsa, çarpımlarının türevi $f'g'$ <em>değildir</em>. Doğru formül iki terimlidir: $(fg)' = f'g + fg'$. Aklınızda kalması için "birincinin türevi çarpı ikinci, artı birinci çarpı ikincinin türevi" cümlesi standart yardımcıdır.</div>

<p class="l-text">Yeni başlayanların en sık yaptığı hata, $(f+g)' = f' + g'$ ile analoji kurarak $(fg)' = f' g'$ yazmaktır. Bu yanlıştır. Toplamlar türev altında doğrusal davranırlar, fakat çarpımlar davranmaz. Çarpım kuralı bu eksikliği zarif bir iki terimli formülle kapatır.</p>

<div class="calc-formula"><div class="formula-label">ÇARPIM KURALI</div><div class="formula-main">$$\\frac{d}{dx}\\bigl[ f(x) \\cdot g(x) \\bigr] \\;=\\; f'(x) \\, g(x) \\;+\\; f(x) \\, g'(x)$$</div><div class="formula-sub">Sesli okuyun: "birincinin türevi çarpı ikinci, artı birinci çarpı ikincinin türevi."</div></div>

<p class="l-text"><strong>Geometrik sezgi (dikdörtgen argümanı).</strong> Genişliği $f(x)$ ve yüksekliği $g(x)$ olan bir dikdörtgen düşünün. Alanı $A(x) = f(x) \\, g(x)$. $x$ küçük bir $h$ kadar arttığında, genişlik $\\Delta f = f(x+h) - f(x)$ kadar, yükseklik ise $\\Delta g = g(x+h) - g(x)$ kadar büyür. Yeni alan dört parçaya ayrılır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Orijinal dikdörtgen</div><div class="card-body">Alan $f(x) \\cdot g(x)$ — değişmeyen kısım.</div></div>
<div class="calc-card"><div class="card-title">Sağ şerit</div><div class="card-body">Alan $\\Delta f \\cdot g(x)$ — dikdörtgenin sağa doğru genişlemesinden gelir.</div></div>
<div class="calc-card"><div class="card-title">Üst şerit</div><div class="card-body">Alan $f(x) \\cdot \\Delta g$ — dikdörtgenin tavanının yukarı kaldırılmasından gelir.</div></div>
<div class="calc-card"><div class="card-title">Küçük köşe</div><div class="card-body">Alan $\\Delta f \\cdot \\Delta g$ — köşede küçük bir kare; limitte yok olur.</div></div>
</div>

<p class="l-text">Alan artışını $h$'ye bölüp $h \\to 0$ limitini alırsak, küçük köşe $\\Delta f \\cdot \\Delta g / h$ sıfıra gider (içinde iki $h$ çarpanı taşır), ve iki şerit çarpım kuralının iki terimini verir. Bu dikdörtgen resmi, Leibniz'in 1684'te kuralı ilk yayımladığında kullandığı resmin aynısıdır.</p>

<div class="calc-graph"><div id="plot-l19-rect-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> genişliği $f$ ve yüksekliği $g$ olan dikdörtgen (mavi); $f$ ve $g$ az miktarda büyüdüğünde eklenen iki şerit $\\Delta f \\cdot g$ (altın) ve $f \\cdot \\Delta g$ (kırmızı). Küçük köşe parçası $\\Delta f \\cdot \\Delta g$ (kesik çizgi) limitte yok olan kısımdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var f=3, g=2, df=0.6, dg=0.5;
var t1={x:[0,f,f,0,0],y:[0,0,g,g,0],fill:'toself',mode:'lines',name:'fg (orijinal)',line:{color:'#3b82f6',width:2},fillcolor:'rgba(59,130,246,0.2)'};
var t2={x:[f,f+df,f+df,f,f],y:[0,0,g,g,0],fill:'toself',mode:'lines',name:'Δf · g (sağ)',line:{color:'#c8a96e',width:2},fillcolor:'rgba(200,169,110,0.3)'};
var t3={x:[0,f,f,0,0],y:[g,g,g+dg,g+dg,g],fill:'toself',mode:'lines',name:'f · Δg (üst)',line:{color:'#ef4444',width:2},fillcolor:'rgba(239,68,68,0.25)'};
var t4={x:[f,f+df,f+df,f,f],y:[g,g,g+dg,g+dg,g],fill:'toself',mode:'lines',name:'Δf · Δg (köşe)',line:{color:'rgba(235,230,220,0.6)',width:1.5,dash:'dot'},fillcolor:'rgba(235,230,220,0.1)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc'},xaxis:{title:'genişlik',range:[-0.3,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'yükseklik',range:[-0.3,3.0],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l19-rect-tr',[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Limit tanımından kanıt.</strong> $P(x) = f(x) \\, g(x)$ olsun. Türev tanımından,</p>

<div class="calc-formula"><div class="formula-main">$$P'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) \\, g(x+h) \\;-\\; f(x) \\, g(x)}{h}.$$</div></div>

<p class="l-text">Hünerli adım, paya $f(x+h) \\, g(x)$ çapraz terimini ekleyip çıkartmaktır:</p>

<div class="calc-formula"><div class="formula-main">$$P'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) \\, g(x+h) \\;-\\; f(x+h) \\, g(x) \\;+\\; f(x+h) \\, g(x) \\;-\\; f(x) \\, g(x)}{h}.$$</div></div>

<p class="l-text">Dört terimi ikişerli grupla ve ortak çarpan kullan:</p>

<div class="calc-formula"><div class="formula-main">$$P'(x) \\;=\\; \\lim_{h \\to 0} \\left[ f(x+h) \\cdot \\frac{g(x+h) - g(x)}{h} \\;+\\; \\frac{f(x+h) - f(x)}{h} \\cdot g(x) \\right].$$</div></div>

<p class="l-text">Şimdi standart limit kurallarını uygula. $h \\to 0$ iken, $f(x+h) \\to f(x)$ (süreklilik — türevlenebilirlikten gelir), $\\dfrac{g(x+h)-g(x)}{h} \\to g'(x)$ ve $\\dfrac{f(x+h)-f(x)}{h} \\to f'(x)$. Sonuç tam olarak $f(x) \\, g'(x) + f'(x) \\, g(x)$, kanıt tamamlanmış olur.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Neden $f(x) \\, g(x+h)$ yerine $f(x+h) \\, g(x)$ ekleyip çıkartıyoruz? Her ikisi de işe yarar — ikisi de aynı son formüle götürür. Tercih bir zevk meselesidir. Asıl fikir, bir fark oranı çıkartabilmek için karma bir terim sokmaktır.</div></div>

<h2 class="l-title">2. Çarpım Kuralı: İşlenmiş Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — POLİNOM ÇARPI POLİNOM</div><div class="example-body"><strong>Türevini al:</strong> $y = (x^2 + 1)(x^3 - 2x)$.<br><br>$f(x) = x^2 + 1$ ve $g(x) = x^3 - 2x$ tanımlayalım. O zaman $f'(x) = 2x$ ve $g'(x) = 3x^2 - 2$. Çarpım kuralını uygula:<br><br>$y' = f'g + fg' = (2x)(x^3 - 2x) + (x^2 + 1)(3x^2 - 2)$.<br><br>Aç: $y' = 2x^4 - 4x^2 + 3x^4 - 2x^2 + 3x^2 - 2 = \\mathbf{5x^4 - 3x^2 - 2}$.<br><br><strong>Sağlama:</strong> önce orijinal ifadeyi açarsak $y = x^5 - 2x^3 + x^3 - 2x = x^5 - x^3 - 2x$, ardından $y' = 5x^4 - 3x^2 - 2$. Uyuşma.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — POLİNOM ÇARPI TRİG</div><div class="example-body"><strong>Türevini al:</strong> $y = x^2 \\sin x$.<br><br>$f(x) = x^2$ ve $g(x) = \\sin x$. O zaman $f'(x) = 2x$ ve $g'(x) = \\cos x$.<br><br>$y' = (2x)(\\sin x) + (x^2)(\\cos x) = \\mathbf{2x \\sin x + x^2 \\cos x}$.<br><br><em>Not:</em> bu ifadeyi "açarak" çarpım kuralından kaçmak mümkün değildir; dolayısıyla çarpım kuralı burada gerçekten gereklidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — ÜSTEL ÇARPI TRİG</div><div class="example-body"><strong>Türevini al:</strong> $y = e^x \\cos x$.<br><br>$f(x) = e^x$ ile $f'(x) = e^x$, ve $g(x) = \\cos x$ ile $g'(x) = -\\sin x$.<br><br>$y' = e^x \\cos x + e^x \\, (-\\sin x) = \\mathbf{e^x (\\cos x - \\sin x)}$.<br><br>Ortak $e^x$ çarpanını paranteze almak cevabı derli toplu tutar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — ÜÇ ÇARPANLI ÇARPIM</div><div class="example-body"><strong>Türevini al:</strong> $y = x \\cdot \\sin x \\cdot \\cos x$.<br><br>Çarpım kuralı üç (ya da daha fazla) çarpana genişler: $(fgh)' = f'gh + fg'h + fgh'$. Örüntü "bir çarpanın türevini al, diğerlerini olduğu gibi bırak, sonuçları topla."<br><br>$y' = (1)(\\sin x)(\\cos x) + (x)(\\cos x)(\\cos x) + (x)(\\sin x)(-\\sin x)$<br><br>$\\phantom{y'} = \\mathbf{\\sin x \\cos x + x \\cos^2 x - x \\sin^2 x}$.<br><br>$\\sin 2x = 2 \\sin x \\cos x$ ve $\\cos 2x = \\cos^2 x - \\sin^2 x$ özdeşlikleriyle isteğe bağlı sadeleştirme: $y' = \\dfrac{1}{2} \\sin 2x + x \\cos 2x$.</div></div>

<div class="l-note"><strong>Sık yapılan hata:</strong> $(fg)' = f' g'$ yazmak. Bu, başlangıç kalkülüsünde en sık karşılaşılan hatadır. Daima terim sayısını sayın: doğru formülde <em>iki</em> terim vardır ve <em>toplanırlar</em>.</div>

<h2 class="l-title">3. Bölüm Kuralı: İfade ve Türetme</h2>

<div class="calc-highlight"><strong>Tek satırlık ifade:</strong> bir bölümün türevi "düşük d-yüksek eksi yüksek d-düşük, hepsi düşüğün karesi üzerinde" — klasik bir yardımcı. Sembollerle, $(f/g)' = (f'g - fg')/g^2$, $g(x) \\ne 0$ olduğu her noktada geçerli.</div>

<div class="calc-formula"><div class="formula-label">BÖLÜM KURALI</div><div class="formula-main">$$\\frac{d}{dx}\\left[ \\frac{f(x)}{g(x)} \\right] \\;=\\; \\frac{f'(x) \\, g(x) \\;-\\; f(x) \\, g'(x)}{\\bigl[g(x)\\bigr]^{2}}, \\qquad g(x) \\ne 0$$</div><div class="formula-sub">Paydaki sıra önemlidir: önce $f'g$, sonra $-fg'$. İşareti değiştirmek en sık yapılan hatadır.</div></div>

<p class="l-text"><strong>Çarpım kuralından türetme.</strong> $Q(x) = f(x)/g(x)$ olsun. Her iki tarafı $g(x)$ ile çarparsak $f(x) = Q(x) \\, g(x)$. Bu eşitliğin türevini çarpım kuralıyla alalım:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) \\;=\\; Q'(x) \\, g(x) \\;+\\; Q(x) \\, g'(x).$$</div></div>

<p class="l-text">$Q'(x)$ için çöz:</p>

<div class="calc-formula"><div class="formula-main">$$Q'(x) \\;=\\; \\frac{f'(x) - Q(x) \\, g'(x)}{g(x)} \\;=\\; \\frac{f'(x) - \\dfrac{f(x)}{g(x)} \\, g'(x)}{g(x)} \\;=\\; \\frac{f'(x) \\, g(x) - f(x) \\, g'(x)}{\\bigl[g(x)\\bigr]^{2}}.$$</div></div>

<p class="l-text">İşte bölüm kuralı. Limit tanımından ayrı bir kanıta hiç ihtiyaç duymadığımıza dikkat edin — çarpım kuralı ve biraz cebir yeterlidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hatırlatıcı: "düşük d-yüksek eksi yüksek d-düşük"</div><div class="card-body">Bazı öğrenciler formülü şöyle hatırlar: <em>düşük</em> ($g$) çarpı <em>yüksekin türevi</em> ($f'$) eksi <em>yüksek</em> ($f$) çarpı <em>düşüğün türevi</em> ($g'$), hepsi <em>düşük kare</em> ($g^2$) üzerinde. Sıralama kuralı: önce payın türevi.</div></div>
<div class="calc-card"><div class="card-title">Neden paydada $g^2$?</div><div class="card-body">Bu, $f = Qg$ ifadesinden $Q'$ için çözmenin doğal sonucudur: bir kez $g$'ye bölmek $Q$'yu $f/g$'ye çevirir, ikinci bölme $g^2$'yi oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Kuvvet kuralı ne zaman daha hızlı?</div><div class="card-body">Bölüm $x$'in tek bir kuvvetine sadeleşebiliyorsa — örneğin $x^5 / x^2 = x^3$ — kuvvet kuralı daha hızlıdır. Bölüm kuralı, böyle bir sadeleştirme olmadığında değerini kanıtlar.</div></div>
</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Bölüm kuralının ve çarpım kuralının önemli bir işaret farkı vardır: çarpımlar eklenir, bölümler çıkarılır. "Düşük d-yüksek <em>eksi</em> yüksek d-düşük" hatırlatıcısı size bunu hatırlatır. Eksi işaretini unutmak veya iki terimin sırasını ters çevirmek en sık görülen bölüm-kuralı hatasıdır.</div></div>

<h2 class="l-title">4. Bölüm Kuralı: İşlenmiş Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — RASYONEL FONKSİYON</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{x + 1}{x^2 - 3}$.<br><br>$f = x + 1$ ve $g = x^2 - 3$ alalım. O zaman $f' = 1$ ve $g' = 2x$.<br><br>$y' = \\dfrac{f' g - f g'}{g^2} = \\dfrac{(1)(x^2 - 3) - (x + 1)(2x)}{(x^2 - 3)^2}$.<br><br>Payı sadeleştir: $x^2 - 3 - 2x^2 - 2x = -x^2 - 2x - 3 = -(x^2 + 2x + 3)$.<br><br>$y' = \\mathbf{\\dfrac{-(x^2 + 2x + 3)}{(x^2 - 3)^2}}$. Pay reeller üzerinde çarpanlarına ayrılamadığından, bu en sade hâlidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — SİNÜS BÖLÜ KOSİNÜSTEN TANJANT</div><div class="example-body"><strong>Bölüm kuralıyla türet:</strong> $\\dfrac{d}{dx} \\tan x = \\sec^2 x$.<br><br>Tanım gereği $\\tan x = \\dfrac{\\sin x}{\\cos x}$. $f = \\sin x$ ve $g = \\cos x$ alalım. O zaman $f' = \\cos x$ ve $g' = -\\sin x$.<br><br>$(\\tan x)' = \\dfrac{(\\cos x)(\\cos x) - (\\sin x)(-\\sin x)}{\\cos^2 x} = \\dfrac{\\cos^2 x + \\sin^2 x}{\\cos^2 x}$.<br><br>Pisagor özdeşliği $\\sin^2 x + \\cos^2 x = 1$ kullan: $(\\tan x)' = \\dfrac{1}{\\cos^2 x} = \\mathbf{\\sec^2 x}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — ÜSTEL BÖLÜ POLİNOM</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{e^x}{x}$.<br><br>$f = e^x$, $f' = e^x$. $g = x$, $g' = 1$.<br><br>$y' = \\dfrac{e^x \\cdot x - e^x \\cdot 1}{x^2} = \\dfrac{e^x (x - 1)}{x^2}$.<br><br><strong>$y'$ nerede sıfırdır?</strong> $x - 1 = 0$ olduğunda, yani $x = 1$ noktasında. ($e^x$ çarpanı asla sıfır olmaz.) Yani $y$ fonksiyonunun $x = 1$ noktasında bir kritik noktası vardır — ileri optimizasyon problemleri için faydalı.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — BÖLÜM KURALI İLE TERSİNİ ALMA</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{1}{x^2 + 1}$.<br><br>$f = 1$ (sabit, $f' = 0$) ve $g = x^2 + 1$ ($g' = 2x$).<br><br>$y' = \\dfrac{0 \\cdot (x^2 + 1) - 1 \\cdot (2x)}{(x^2 + 1)^2} = \\mathbf{\\dfrac{-2x}{(x^2 + 1)^2}}$.<br><br>Bölüm 7'de bu aynı problemi zincir kuralıyla yeniden çözüp daha az emekle aynı cevabı alacağız.</div></div>

<div class="l-note"><strong>Tanım kümesi hatırlatması:</strong> bölüm kuralı $g(x) \\ne 0$ olduğu her noktada geçerlidir. $g$'nin sıfır olduğu noktalarda $f/g$ tanımsızdır ve türevi de tanımsızdır.</div>

<h2 class="l-title">5. Bileşke Fonksiyonlar: Hatırlatma</h2>

<div class="calc-highlight"><strong>Bir bileşke fonksiyon, fonksiyon içindeki fonksiyondur.</strong> $g$ fonksiyonu $x$'i $g(x)$'e götürüyorsa ve $f$ bu çıktıyı alıp $f(g(x))$ üretiyorsa, birleşik işleme bileşke denir ve $(f \\circ g)(x) = f(g(x))$ şeklinde yazılır. Sağdan sola okunur: önce $g$, sonra $f$.</div>

<p class="l-text">Bileşke fonksiyon örnekleri:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$y = \\sqrt{x^2 + 1}$</div><div class="card-body">İç $g(x) = x^2 + 1$, dış $f(u) = \\sqrt{u}$. $g$'nin çıktısı $f$'nin girdisi olur.</div></div>
<div class="calc-card"><div class="card-title">$y = \\sin(3x)$</div><div class="card-body">İç $g(x) = 3x$, dış $f(u) = \\sin u$. Önce $3$ ile çarpma, sonra sinüs.</div></div>
<div class="calc-card"><div class="card-title">$y = (x^2 - 7)^{10}$</div><div class="card-body">İç $g(x) = x^2 - 7$, dış $f(u) = u^{10}$. Zincir kuralı olmasa onuncu kuvvet binomunu açmamız gerekirdi.</div></div>
<div class="calc-card"><div class="card-title">$y = e^{\\cos x}$</div><div class="card-body">İç $g(x) = \\cos x$, dış $f(u) = e^u$. İki katmanlı "iç içe geçmiş şey."</div></div>
</div>

<p class="l-text"><strong>İç fonksiyon nasıl belirlenir.</strong> Kendinize sorun: "Birinden bu ifadeyi zihninden hesaplamasını istesem, <em>önce</em> hangi işlemi yapardı?" İlk işlem iç fonksiyon $g$; etrafına sarılan her şey dış fonksiyon $f$'dir. $\\sin(3x)$ için: önce $3$ ile çarp (iç), sonra sinüs (dış). $\\sqrt{x^2 + 1}$ için: önce karesini al ve $1$ ekle (iç), sonra karekök al (dış).</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$y = \\cos^3 x$ (oku: $x$'in kosinüsünün küpü) için iç ve dış nedir? İç $g(x) = \\cos x$, dış $f(u) = u^3$. "Küpünü al" en sonda gerçekleşir, dolayısıyla küp dış fonksiyondur.</div></div>

<h2 class="l-title">6. Zincir Kuralı: İfade, Sezgi, Kanıt Çerçevesi</h2>

<div class="calc-highlight"><strong>Tek satırlık ifade:</strong> bir bileşkenin türevini almak için, dış fonksiyonun türevini iç fonksiyon konumunda al ve iç fonksiyonun türevi ile çarp. Sembollerle: $(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$. "Dış türev çarpı iç türev" mantrası, hangisinin hangisi olduğunu anladıktan sonra hatırlamak için yeterlidir.</div>

<div class="calc-formula"><div class="formula-label">ZİNCİR KURALI</div><div class="formula-main">$$\\frac{d}{dx} \\bigl[ f(g(x)) \\bigr] \\;=\\; f'\\bigl(g(x)\\bigr) \\cdot g'(x)$$</div><div class="formula-sub">Veya Leibniz notasyonunda, $u = g(x)$ ve $y = f(u)$ ile: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$.</div></div>

<p class="l-text"><strong>Leibniz biçimi ve neden faydalı.</strong> $u = g(x)$ ve $y = f(u)$ olsun. Zincir kuralı $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$ der. Bunu bir sadeleştirme gibi okuyun: "üstteki $du$, alttaki $du$ ile sadeleşir." Bu sadece bir hatırlatıcıdır — $\\dfrac{dy}{du}$ tek bir semboldür, bir kesir değil — ama sadeleşme örüntüsü tam yerindedir ve çok kullanışlıdır.</p>

<p class="l-text"><strong>Sezgisel resim (dişliler).</strong> Diyelim ki $u$, $x$'e $\\dfrac{du}{dx} = 3$ oranında bağlı ($x$ 1 birim hareket ettiğinde $u$ 3 birim hareket eder) ve $y$, $u$'ya $\\dfrac{dy}{du} = 5$ oranında bağlı ($u$ 1 birim hareket ettiğinde $y$ 5 birim hareket eder). O zaman $x$ 1 birim hareket ettiğinde $u$ 3 birim hareket eder, bu da $y$'yi $3 \\times 5 = 15$ birim hareket ettirir. Yani $\\dfrac{dy}{dx} = 15 = 3 \\times 5$. Zincir kuralı, oranların çarpımıdır — tıpkı iki birbirine geçmiş dişli gibi.</p>

<div class="calc-graph"><div id="plot-l19-chain-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> zincir kuralı için bir akış diyagramı. Girdi $x$ iç fonksiyon $g$'ye girer (oran $g'(x)$), $u = g(x)$ çıktısını üretir. Bu $u$ dış fonksiyon $f$'ye girer (oran $f'(u)$), $y$ çıktısını üretir. Genel oran, iki aşama oranının çarpımıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var boxes=[
  {x0:0.05,x1:0.22,y0:0.35,y1:0.65,label:'x',color:'rgba(59,130,246,0.18)',line:'#3b82f6'},
  {x0:0.36,x1:0.58,y0:0.30,y1:0.70,label:'g (iç)',color:'rgba(200,169,110,0.18)',line:'#c8a96e'},
  {x0:0.72,x1:0.94,y0:0.30,y1:0.70,label:'f (dış)',color:'rgba(239,68,68,0.18)',line:'#ef4444'}
];
var shapes=boxes.map(function(b){return {type:'rect',x0:b.x0,x1:b.x1,y0:b.y0,y1:b.y1,line:{color:b.line,width:2.5},fillcolor:b.color};});
shapes.push({type:'path',path:'M 0.22 0.50 L 0.36 0.50',line:{color:'#ebe6dc',width:2}});
shapes.push({type:'path',path:'M 0.58 0.50 L 0.72 0.50',line:{color:'#ebe6dc',width:2}});
shapes.push({type:'path',path:'M 0.94 0.50 L 0.99 0.50',line:{color:'#ebe6dc',width:2}});
var anns=[
  {x:0.135,y:0.50,text:'<b>x</b>',showarrow:false,font:{color:'#ebe6dc',size:18}},
  {x:0.47,y:0.50,text:'<b>g</b>',showarrow:false,font:{color:'#ebe6dc',size:18}},
  {x:0.47,y:0.22,text:'oran g′(x)',showarrow:false,font:{color:'#c8a96e',size:12}},
  {x:0.83,y:0.50,text:'<b>f</b>',showarrow:false,font:{color:'#ebe6dc',size:18}},
  {x:0.83,y:0.22,text:'oran f′(g(x))',showarrow:false,font:{color:'#ef4444',size:12}},
  {x:0.29,y:0.58,text:'g(x)',showarrow:false,font:{color:'#ebe6dc',size:12}},
  {x:0.65,y:0.58,text:'u=g(x)',showarrow:false,font:{color:'#ebe6dc',size:12}},
  {x:0.97,y:0.58,text:'y',showarrow:false,font:{color:'#ebe6dc',size:14}},
  {x:0.5,y:0.05,text:'genel oran dy/dx = f′(g(x)) · g′(x)',showarrow:false,font:{color:'#ebe6dc',size:13}}
];
var trace={x:[0],y:[0],mode:'markers',marker:{size:0.1,color:'rgba(0,0,0,0)'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc'},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[0,1]},shapes:shapes,annotations:anns,margin:{t:20,r:10,b:20,l:10},showlegend:false};
Plotly.newPlot('plot-l19-chain-tr',[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Kanıt çerçevesi.</strong> $y = f(u)$ ve $u = g(x)$ olsun. Limit tanımından,</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{dy}{dx} \\;=\\; \\lim_{h \\to 0} \\frac{f(g(x+h)) - f(g(x))}{h}.$$</div></div>

<p class="l-text">$\\Delta u = g(x+h) - g(x)$ olsun. Küçük $h$ için $\\Delta u \\ne 0$ varsayımıyla (bu teknik durum daha dikkatli bir argümanla giderilir) $\\Delta u$ ile çarpıp bölelim:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{dy}{dx} \\;=\\; \\lim_{h \\to 0} \\left[ \\frac{f(g(x) + \\Delta u) - f(g(x))}{\\Delta u} \\cdot \\frac{g(x+h) - g(x)}{h} \\right].$$</div></div>

<p class="l-text">$h \\to 0$ iken $\\Delta u \\to 0$ olur ($g$ sürekli olduğundan). İlk çarpan $f'(g(x))$'e, ikinci çarpan $g'(x)$'e yaklaşır. Çarpım $f'(g(x)) \\cdot g'(x)$'tir. Bitti.</p>

<div class="l-note"><strong>Dürüstlük notu:</strong> tam katı bir kanıt, $h \\ne 0$ keyfi küçük değerleri için $\\Delta u = 0$ olduğu durumu da ele almak zorundadır (yani $g$ yerel olarak sabit). Bu, herhangi bir üniversite analiz kitabında işlenir. Lise için sonucu olduğu gibi kabul ediyoruz.</div>

<h2 class="l-title">7. Zincir Kuralı: Adım Adım Tarif</h2>

<p class="l-text">İşte zincir kuralını uygulamak için güvenilir bir beş adımlı tarif. Hareketler otomatikleşene kadar her zincir-kuralı probleminde kullanın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — iç ve dışı belirle</div><div class="card-body">İfadeyi $f(g(x))$ olarak yaz. İç $g$ ilk hesaplayacağın şeydir; dış $f$ etrafına sarılan işlemdir.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — dışın türevini al</div><div class="card-body">İç ifadeyi tek bir sembol $u$ gibi düşün ve $f'(u)$'yu yaz. Henüz $u$'yu $g(x)$ olarak geri sadeleştirme.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — geri yerleştir</div><div class="card-body">$f'$ içindeki $u$'yu $g(x)$ ile değiştir ve $f'(g(x))$ elde et. Bu, dış türevin "$x$ cinsinden" hâlidir.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — için türevini al</div><div class="card-body">$g'(x)$'i ayrıca hesapla. Bu genellikle kuvvet kuralı, trig türevleri veya başka bir zincir kuralı kullanan tek satırlık bir hesaptır.</div></div>
<div class="calc-card"><div class="card-title">Adım 5 — çarp</div><div class="card-body">Nihai cevap $f'(g(x)) \\cdot g'(x)$. Faydalıysa sadeleştir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = \\sin(3x)$</div><div class="example-body"><strong>Adım 1.</strong> İç $g(x) = 3x$, dış $f(u) = \\sin u$.<br><strong>Adım 2.</strong> $f'(u) = \\cos u$.<br><strong>Adım 3.</strong> $f'(g(x)) = \\cos(3x)$.<br><strong>Adım 4.</strong> $g'(x) = 3$.<br><strong>Adım 5.</strong> $y' = \\cos(3x) \\cdot 3 = \\mathbf{3 \\cos(3x)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = (x^2 - 7)^{10}$</div><div class="example-body"><strong>Adım 1.</strong> İç $g(x) = x^2 - 7$, dış $f(u) = u^{10}$.<br><strong>Adım 2.</strong> $f'(u) = 10 u^9$.<br><strong>Adım 3.</strong> $f'(g(x)) = 10 (x^2 - 7)^9$.<br><strong>Adım 4.</strong> $g'(x) = 2x$.<br><strong>Adım 5.</strong> $y' = 10 (x^2 - 7)^9 \\cdot 2x = \\mathbf{20 x (x^2 - 7)^9}$.<br><br><em>Zincir kuralı olmadan</em> bir binomun onuncu kuvvetini açıp terim terim türevini almak zorunda kalırdık — yüzlerce işlem. Zincir kuralı bunu tek satırda yapar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = \\sqrt{x^2 + 1}$</div><div class="example-body">$y = (x^2 + 1)^{1/2}$ olarak yeniden yaz. İç $g(x) = x^2 + 1$, dış $f(u) = u^{1/2}$. O zaman $f'(u) = \\dfrac{1}{2} u^{-1/2} = \\dfrac{1}{2 \\sqrt{u}}$ ve $g'(x) = 2x$.<br><br>$y' = \\dfrac{1}{2 \\sqrt{x^2 + 1}} \\cdot 2x = \\mathbf{\\dfrac{x}{\\sqrt{x^2 + 1}}}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = \\dfrac{1}{x^2 + 1}$ (ZİNCİR KURALIYLA TEKRAR)</div><div class="example-body">$y = (x^2 + 1)^{-1}$ olarak yeniden yaz. İç $g(x) = x^2 + 1$, dış $f(u) = u^{-1}$. O zaman $f'(u) = -u^{-2} = -\\dfrac{1}{u^2}$ ve $g'(x) = 2x$.<br><br>$y' = -\\dfrac{1}{(x^2 + 1)^2} \\cdot 2x = \\mathbf{-\\dfrac{2x}{(x^2 + 1)^2}}$. Bölüm 4'teki bölüm-kuralı sürümüyle aynı cevap, ama daha az cebir ile.</div></div>

<div class="think-box"><div class="think-label">EZBERLENECEK ÖRÜNTÜ</div><div class="think-body">Herhangi $n$ kuvveti $(\\text{şey})^n$ için zincir kuralı $n \\cdot (\\text{şey})^{n-1} \\cdot (\\text{şey})'$ verir. $\\sin(\\text{şey})$ için $\\cos(\\text{şey}) \\cdot (\\text{şey})'$ verir. $e^{\\text{şey}}$ için $e^{\\text{şey}} \\cdot (\\text{şey})'$ verir. Örüntü daima "şeyde değerlendirilen dış türev, çarpı şeyin türevi."</div></div>

<h2 class="l-title">8. Çoklu Bileşkeler (İç İçe Zincirler)</h2>

<div class="calc-highlight"><strong>Bazen iç fonksiyon kendisi bir bileşkedir.</strong> O zaman zincir kuralı iki kez uygulanmalıdır: önce en dış, sonra ortadaki, sonra en içteki. Örüntü $(f \\circ g \\circ h)'(x) = f'(g(h(x))) \\cdot g'(h(x)) \\cdot h'(x)$ — her biri uygun katmanda değerlendirilen üç türevin çarpımı.</div>

<div class="calc-formula"><div class="formula-label">ÜÇ KATMAN İÇİN ZİNCİR KURALI</div><div class="formula-main">$$\\frac{d}{dx} \\bigl[ f(g(h(x))) \\bigr] \\;=\\; f'\\bigl(g(h(x))\\bigr) \\cdot g'\\bigl(h(x)\\bigr) \\cdot h'(x)$$</div><div class="formula-sub">Veya Leibniz biçiminde: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dv} \\cdot \\dfrac{dv}{dx}$, $v = h(x)$, $u = g(v)$, $y = f(u)$ ile.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = \\sin(\\cos(x^2))$</div><div class="example-body">Üç katman: en iç $h(x) = x^2$, orta $g(v) = \\cos v$, en dış $f(u) = \\sin u$.<br><br>$h'(x) = 2x$, $g'(v) = -\\sin v$, $f'(u) = \\cos u$.<br><br>$y' = f'(g(h(x))) \\cdot g'(h(x)) \\cdot h'(x) = \\cos(\\cos(x^2)) \\cdot (-\\sin(x^2)) \\cdot 2x$<br><br>$\\phantom{y'} = \\mathbf{-2x \\sin(x^2) \\cos(\\cos(x^2))}$.<br><br>Dikkat: her türev çarpanı uygun "iç"te değerlendirilir — $f'$, $\\cos(x^2)$'de; $g'$, $x^2$'de; $h'$, $x$'te.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = \\sqrt{\\sin(3x)}$</div><div class="example-body">Üç katman: $h(x) = 3x$, $g(v) = \\sin v$, $f(u) = \\sqrt{u} = u^{1/2}$.<br><br>$h' = 3$, $g'(v) = \\cos v$, $f'(u) = \\dfrac{1}{2 \\sqrt{u}}$.<br><br>$y' = \\dfrac{1}{2 \\sqrt{\\sin(3x)}} \\cdot \\cos(3x) \\cdot 3 = \\mathbf{\\dfrac{3 \\cos(3x)}{2 \\sqrt{\\sin(3x)}}}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $y = (1 + (2x + 1)^3)^{5}$</div><div class="example-body">Dıştan içe üç katman: dış $u^5$, orta $1 + v^3$, iç $2x + 1$.<br><br>$y' = 5 \\cdot (1 + (2x+1)^3)^4 \\cdot 3(2x+1)^2 \\cdot 2$<br><br>$\\phantom{y'} = \\mathbf{30 \\, (2x+1)^2 \\, (1 + (2x+1)^3)^4}$.</div></div>

<div class="think-box"><div class="think-label">FAYDALI BİR SIRA</div><div class="think-body">Çok katmanlı bir bileşkeyi soyarken <em>dıştan içe</em> çalışın. Önce en dışı türevleyin, sonra bir sonraki katmanı, sonra bir sonrakini. Her adımda "içerideki her şey" sırası gelene dek dokunulmadan kalır. Bu, sonunda çarpacağınız temiz bir çarpan zinciri üretir.</div></div>

<h2 class="l-title">9. Karışık Problemler: Üç Kural Bir Arada</h2>

<p class="l-text">Gerçek sınav soruları sıklıkla çarpım, bölüm ve zincir kuralını tek bir ifadede birleştirir. Strateji daima aynıdır: önce <em>en dış</em> yapıyı belirleyin (ifade bir çarpım mı? bölüm mü? bileşke mi?), uygun kuralı uygulayın, sonra her parçayı sırayla ele alın — gerektiğinde daha fazla çarpım, bölüm veya zincir kuralı kullanarak.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — ÇARPIM + ZİNCİR</div><div class="example-body"><strong>Türevini al:</strong> $y = x^2 \\sin(3x)$.<br><br>En dış yapı: $x^2$ ile $\\sin(3x)$'in çarpımı. Çarpım kuralını kullan.<br><br>$u = x^2$ ve $v = \\sin(3x)$ olsun. O zaman $u' = 2x$. $v'$ için zincir kuralına ihtiyacımız var: $v' = \\cos(3x) \\cdot 3 = 3 \\cos(3x)$.<br><br>$y' = u' v + u v' = 2x \\sin(3x) + x^2 \\cdot 3 \\cos(3x) = \\mathbf{2x \\sin(3x) + 3 x^2 \\cos(3x)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — BÖLÜM + ZİNCİR</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{e^{2x}}{x + 1}$.<br><br>En dış: bir bölüm. Bölüm kuralını kullan.<br><br>$f = e^{2x}$, $f' = e^{2x} \\cdot 2 = 2 e^{2x}$ (iç $2x$ için zincir kuralı). $g = x + 1$, $g' = 1$.<br><br>$y' = \\dfrac{2 e^{2x} (x + 1) - e^{2x} \\cdot 1}{(x + 1)^2} = \\dfrac{e^{2x} \\bigl[ 2(x + 1) - 1 \\bigr]}{(x + 1)^2} = \\mathbf{\\dfrac{e^{2x} (2x + 1)}{(x + 1)^2}}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — ZİNCİR İÇİNDE ÇARPIM</div><div class="example-body"><strong>Türevini al:</strong> $y = \\sin(x \\cos x)$.<br><br>En dış: bir bileşke. İç $g(x) = x \\cos x$, dış $f(u) = \\sin u$.<br><br>$f'(u) = \\cos u$, dolayısıyla $f'(g(x)) = \\cos(x \\cos x)$.<br><br>$g'(x)$ için çarpım kuralı: $g'(x) = (1)(\\cos x) + (x)(-\\sin x) = \\cos x - x \\sin x$.<br><br>$y' = \\cos(x \\cos x) \\cdot (\\cos x - x \\sin x) = \\mathbf{(\\cos x - x \\sin x) \\cos(x \\cos x)}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — ÜÇ KURAL BİRDEN</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{x \\sin(2x)}{x^2 + 1}$.<br><br>En dış: bir bölüm. $f = x \\sin(2x)$ (zincir kuralı gerektiren bir çarpım) ve $g = x^2 + 1$ ($g' = 2x$).<br><br>$f'$ için: $x$ ve $\\sin(2x)$ üzerinde çarpım kuralı. $x$'in türevi $1$. $\\sin(2x)$'in zincir kuralıyla türevi $\\cos(2x) \\cdot 2 = 2 \\cos(2x)$. Yani $f' = 1 \\cdot \\sin(2x) + x \\cdot 2 \\cos(2x) = \\sin(2x) + 2x \\cos(2x)$.<br><br>Şimdi bölüm kuralı:<br><br>$y' = \\dfrac{f' g - f g'}{g^2} = \\dfrac{[\\sin(2x) + 2x \\cos(2x)](x^2 + 1) - x \\sin(2x) \\cdot 2x}{(x^2 + 1)^2}$.<br><br>Aç ve topla: $y' = \\mathbf{\\dfrac{(x^2 + 1)[\\sin(2x) + 2x \\cos(2x)] - 2 x^2 \\sin(2x)}{(x^2 + 1)^2}}$. (Çarpanlı bırakmak çoğu zaman tamamen açmaktan daha temiz olur.)</div></div>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Her problemi çözümü okumadan önce kağıtta deneyin. Amaç otomatik tanıma geliştirmek: önce hangi kural, sonra hangi kural, iç nedir ve dış nedir.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body"><strong>Türevini al:</strong> $y = (3x + 1)(x^2 - 4)$. <em>(Çarpım kuralı.)</em><br><br><strong>Çözüm.</strong> $f = 3x + 1$, $f' = 3$. $g = x^2 - 4$, $g' = 2x$. $y' = 3(x^2 - 4) + (3x + 1)(2x) = 3x^2 - 12 + 6x^2 + 2x = \\mathbf{9 x^2 + 2x - 12}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body"><strong>Türevini al:</strong> $y = x^3 \\cos x$. <em>(Çarpım kuralı.)</em><br><br><strong>Çözüm.</strong> $f = x^3$, $f' = 3 x^2$. $g = \\cos x$, $g' = -\\sin x$. $y' = 3 x^2 \\cos x + x^3 (-\\sin x) = \\mathbf{3 x^2 \\cos x - x^3 \\sin x}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{2x + 1}{x - 3}$. <em>(Bölüm kuralı.)</em><br><br><strong>Çözüm.</strong> $f = 2x + 1$, $f' = 2$. $g = x - 3$, $g' = 1$. $y' = \\dfrac{2(x - 3) - (2x + 1)(1)}{(x - 3)^2} = \\dfrac{2x - 6 - 2x - 1}{(x - 3)^2} = \\mathbf{\\dfrac{-7}{(x - 3)^2}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{\\sin x}{x^2}$. <em>(Bölüm kuralı.)</em><br><br><strong>Çözüm.</strong> $f = \\sin x$, $f' = \\cos x$. $g = x^2$, $g' = 2x$. $y' = \\dfrac{(\\cos x)(x^2) - (\\sin x)(2x)}{x^4} = \\mathbf{\\dfrac{x \\cos x - 2 \\sin x}{x^3}}$ (pay ve paydayı $x$'e böldükten sonra).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body"><strong>Türevini al:</strong> $y = (4x - 7)^9$. <em>(Zincir kuralı.)</em><br><br><strong>Çözüm.</strong> Dış $u^9$, iç $4x - 7$. $y' = 9 (4x - 7)^8 \\cdot 4 = \\mathbf{36 (4x - 7)^8}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6</div><div class="example-body"><strong>Türevini al:</strong> $y = \\cos(5x^2 + 1)$. <em>(Zincir kuralı.)</em><br><br><strong>Çözüm.</strong> Dış $\\cos u$, iç $5 x^2 + 1$. $y' = -\\sin(5 x^2 + 1) \\cdot 10 x = \\mathbf{-10 x \\sin(5 x^2 + 1)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7</div><div class="example-body"><strong>Türevini al:</strong> $y = e^{x^2 - 3x}$. <em>(Zincir kuralı.)</em><br><br><strong>Çözüm.</strong> Dış $e^u$, iç $x^2 - 3x$. $y' = e^{x^2 - 3x} \\cdot (2x - 3) = \\mathbf{(2x - 3) e^{x^2 - 3x}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8</div><div class="example-body"><strong>Türevini al:</strong> $y = \\sqrt{1 - x^2}$. <em>(Zincir kuralı.)</em><br><br><strong>Çözüm.</strong> $y = (1 - x^2)^{1/2}$. $y' = \\dfrac{1}{2} (1 - x^2)^{-1/2} \\cdot (-2x) = \\mathbf{\\dfrac{-x}{\\sqrt{1 - x^2}}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9</div><div class="example-body"><strong>Türevini al:</strong> $y = x \\sqrt{x^2 + 1}$. <em>(Çarpım + zincir.)</em><br><br><strong>Çözüm.</strong> $x$ ile $(x^2 + 1)^{1/2}$'in çarpımı. $x$'in türevi $1$. $(x^2 + 1)^{1/2}$'in zincir kuralıyla türevi $\\dfrac{x}{\\sqrt{x^2 + 1}}$ (problem 8 tarzı).<br><br>$y' = 1 \\cdot \\sqrt{x^2 + 1} + x \\cdot \\dfrac{x}{\\sqrt{x^2 + 1}} = \\dfrac{(x^2 + 1) + x^2}{\\sqrt{x^2 + 1}} = \\mathbf{\\dfrac{2 x^2 + 1}{\\sqrt{x^2 + 1}}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10</div><div class="example-body"><strong>Türevini al:</strong> $y = \\dfrac{\\sin(2x)}{1 + \\cos x}$. <em>(Bölüm + zincir.)</em><br><br><strong>Çözüm.</strong> $f = \\sin(2x)$, $f' = 2 \\cos(2x)$. $g = 1 + \\cos x$, $g' = -\\sin x$.<br><br>$y' = \\dfrac{2 \\cos(2x) (1 + \\cos x) - \\sin(2x)(-\\sin x)}{(1 + \\cos x)^2} = \\mathbf{\\dfrac{2 \\cos(2x)(1 + \\cos x) + \\sin x \\sin(2x)}{(1 + \\cos x)^2}}$.</div></div>

<h2 class="l-title">11. Zincir Kuralını Görselleştirme: $\\sin(x^2)$ ve Türevi</h2>

<p class="l-text">Zincir kuralı bir kez resim çizdiğini görünce daha kolay güvenilir olur. $y = \\sin(x^2)$ olsun. İç $g(x) = x^2$ (oran $g'(x) = 2x$) ve dış $f(u) = \\sin u$ (oran $f'(u) = \\cos u$). Zincir kuralıyla $y' = \\cos(x^2) \\cdot 2x$. Dikkat: $2x$ çarpanı salınımı gerer — $x$ büyüdükçe türev daha geniş ve daha hızlı salınır, çünkü iç fonksiyon $x^2$ ivmelenmektedir.</p>

<div class="calc-graph"><div id="plot-l19-sinx2-tr-extra" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $f(g(x)) = \\sin(x^2)$ fonksiyonu (mavi) ve türevi $\\cos(x^2) \\cdot 2x$ (altın), $x \\in [0, 3]$ aralığında. İşaretçiler türevin birkaç sıfırını vurgular — bunlar tam olarak $\\sin(x^2)$ fonksiyonunun yerel uç noktalarıdır; burada zincir-kuralı çarpanı $\\cos(x^2)$ yok olur. Görünür "dış × iç" yapısı: $\\cos(x^2)$ salınımı, doğrusal olarak büyüyen $2x$ çarpanıyla çarpılıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var dys=[];
for(var i=0;i<=600;i++){var x=i*3/600;xs.push(x);ys.push(Math.sin(x*x));dys.push(Math.cos(x*x)*2*x);}
var extremaX=[Math.sqrt(Math.PI/2),Math.sqrt(3*Math.PI/2),Math.sqrt(5*Math.PI/2),Math.sqrt(7*Math.PI/2)];
var extremaY=extremaX.map(function(x){return Math.sin(x*x);});
var extremaDy=extremaX.map(function(x){return 0;});
var t1={x:xs,y:ys,mode:'lines',name:'f(g(x)) = sin(x²)',line:{color:'#3b82f6',width:2.2}};
var t2={x:xs,y:dys,mode:'lines',name:"y' = cos(x²)·2x",line:{color:'#c8a96e',width:2.2}};
var t3={x:extremaX,y:extremaY,mode:'markers',name:'sin(x²) yerel uç noktaları',marker:{color:'#3b82f6',size:9,symbol:'circle',line:{color:'#ebe6dc',width:1.5}}};
var t4={x:extremaX,y:extremaDy,mode:'markers',name:"y' sıfırları",marker:{color:'#c8a96e',size:9,symbol:'diamond',line:{color:'#ebe6dc',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#ebe6dc'},xaxis:{title:'x',range:[0,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'değer',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l19-sinx2-tr-extra',[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">12. Türev Kuralları Özet Tablosu</h2>

<p class="l-text">Bu dersin beş kuralı ve daha öncesinden iki temel kural, yan yana toplandı. Karşılaşacağınız her problem bunların bir bileşimidir.</p>

<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem;margin:1.4rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;line-height:1.55">
<thead>
<tr style="border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="text-align:left;padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Kural</th>
<th style="text-align:left;padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Formül</th>
<th style="text-align:left;padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Örnek</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Toplam</strong></td>
<td style="padding:0.6rem 0.9rem">$(f + g)' = f' + g'$</td>
<td style="padding:0.6rem 0.9rem">$(x^3 + \\sin x)' = 3x^2 + \\cos x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Sabit çarpan</strong></td>
<td style="padding:0.6rem 0.9rem">$(c \\cdot f)' = c \\cdot f'$</td>
<td style="padding:0.6rem 0.9rem">$(5 x^2)' = 10 x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Çarpım</strong></td>
<td style="padding:0.6rem 0.9rem">$(f g)' = f' g + f g'$</td>
<td style="padding:0.6rem 0.9rem">$(x^2 \\sin x)' = 2x \\sin x + x^2 \\cos x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Bölüm</strong></td>
<td style="padding:0.6rem 0.9rem">$\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f' g - f g'}{g^2}$</td>
<td style="padding:0.6rem 0.9rem">$\\left(\\dfrac{e^x}{x}\\right)' = \\dfrac{e^x (x - 1)}{x^2}$</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)"><strong>Zincir</strong></td>
<td style="padding:0.6rem 0.9rem">$(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$</td>
<td style="padding:0.6rem 0.9rem">$\\bigl(\\sin(x^2)\\bigr)' = \\cos(x^2) \\cdot 2x$</td>
</tr>
</tbody>
</table>
</div>

<p class="l-text"><strong>Tabloyu nasıl kullanmalı.</strong> İfadenin en dış yapısına bakın. Toplama ise cevap türevlerin toplamıdır. Çarpım ise artı ile iki terim. Bölüm ise eksi ile iki terim ve altta $g^2$. Bileşke ise içte değerlendirilmiş dış türev çarpı içerideki fonksiyonun türevi. Sınav sorularının çoğu bu beş satırın iç içe geçmiş kombinasyonlarıdır.</p>

<div class="l-note"><strong>Dersin özeti.</strong> Her yerde kullanılan üç kural: <strong>(fg)' = f'g + fg'</strong>, <strong>(f/g)' = (f'g - fg')/g²</strong>, <strong>(f∘g)' = f'(g(x)) · g'(x)</strong>. En dış yapıya bakarak hangisine ihtiyacın olduğunu tanı. Sonra içeride gerektikçe daha fazla kural uygula. Bir sonraki derste bu araçları logaritma ve üstel türevlerine uygulayacak ve tüm konuyu motive eden optimizasyon problemlerine başlayacağız.</div>`
};
