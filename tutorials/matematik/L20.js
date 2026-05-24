window.LISE_MAT_L20 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far you have built derivatives only for power functions.</strong> The rule $(x^n)' = n x^{n-1}$ handles polynomials, but the world around you runs on three other families: <em>trigonometric</em> functions (anything that oscillates — a swing, a tide, an alternating current), <em>exponential</em> functions (anything that grows by a constant percentage — interest, populations, radioactive decay) and <em>logarithmic</em> functions (their inverses — pH, decibels, Richter scale). This lesson teaches you to differentiate every member of these three families.</p>

<p class="l-text">All the formulas in this lesson follow from one fundamental fact about $e$, one limit identity about $\\sin$, and the quotient rule from Lesson 19. We will derive each rule slowly, then collect everything in a single table you can keep next to you. By the end you will be able to differentiate $\\sin(\\ln(2x))$ without looking anything up.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive $(\\sin x)' = \\cos x$ from the limit definition using the angle-sum formula and the limit $\\lim_{h \\to 0} \\sin h / h = 1$</li>
<li>State and prove $(\\cos x)' = -\\sin x$ and $(\\tan x)' = \\sec^2 x$</li>
<li>Write down derivatives of $\\cot x$, $\\sec x$, $\\csc x$ at sight</li>
<li>Recognise $e$ as the unique base for which $(a^x)' = a^x$ and use this to prove $(e^x)' = e^x$</li>
<li>Derive $(\\ln x)' = 1/x$ via implicit differentiation of $e^{y} = x$</li>
<li>Differentiate general exponentials $a^x$ and general logarithms $\\log_a x$ using $\\ln a$</li>
<li>Use the chain rule to combine these building blocks into composite functions such as $\\sin(2x)$, $e^{x^2}$, and $\\ln(\\cos x)$</li>
</ul>
</div>

<h2 class="lesson-title">1. Derivative of $\\sin x$ — A Detailed Proof</h2>

<div class="calc-highlight"><strong>The result.</strong> $(\\sin x)' = \\cos x$. The slope of the sine curve at every $x$ is the height of the cosine curve at the same $x$. Below we prove this carefully starting only from the limit definition.</div>

<p class="l-text">We compute the derivative from first principles. By definition,</p>

<div class="calc-formula"><div class="formula-main">$$(\\sin x)' = \\lim_{h \\to 0} \\frac{\\sin(x+h) - \\sin x}{h}.$$</div></div>

<p class="l-text">Apply the angle-sum formula $\\sin(x+h) = \\sin x \\cos h + \\cos x \\sin h$. The numerator becomes</p>

<div class="calc-formula"><div class="formula-main">$$\\sin x \\cos h + \\cos x \\sin h - \\sin x = \\sin x (\\cos h - 1) + \\cos x \\sin h.$$</div></div>

<p class="l-text">Divide by $h$ and split the fraction:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin(x+h) - \\sin x}{h} \\;=\\; \\sin x \\cdot \\frac{\\cos h - 1}{h} \\;+\\; \\cos x \\cdot \\frac{\\sin h}{h}.$$</div></div>

<p class="l-text">Now we use <strong>two famous trigonometric limits</strong> (which you can take on faith for now — they are proved with the squeeze theorem from a geometric picture of a circular sector):</p>

<div class="calc-formula"><div class="formula-label">TWO FUNDAMENTAL LIMITS</div><div class="formula-main">$$\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1 \\qquad \\text{and} \\qquad \\lim_{h \\to 0} \\frac{\\cos h - 1}{h} = 0.$$</div><div class="formula-sub">Both require $h$ to be in <em>radians</em>. If you used degrees, $\\sin h / h$ would tend to $\\pi/180$ instead of $1$ — and every formula in this lesson would be ugly. This is why calculus always uses radians.</div></div>

<p class="l-text">Plugging these in, the first term vanishes ($\\sin x \\cdot 0 = 0$) and the second survives ($\\cos x \\cdot 1 = \\cos x$). Therefore</p>

<div class="calc-formula"><div class="formula-label">FIRST KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(\\sin x)' \\;=\\; \\cos x\\;}$$</div><div class="formula-sub">The derivative of sine is cosine — provided angles are measured in radians.</div></div>

<div class="think-box"><div class="think-label">WHY THE TWO LIMITS?</div><div class="think-body">Draw a unit circle and a small sector of central angle $h$. Compare three areas: the inner triangle (area $\\tfrac{1}{2}\\sin h$), the sector ($\\tfrac{1}{2} h$), and the outer right triangle ($\\tfrac{1}{2}\\tan h$). For $0 < h < \\pi/2$ the chain $\\sin h \\leq h \\leq \\tan h$ holds. Divide everywhere by $\\sin h$ and squeeze, and out pops $\\sin h / h \\to 1$. The second limit follows by multiplying $(\\cos h - 1)/h$ by the conjugate $(\\cos h + 1)/(\\cos h + 1)$ and using the first limit.</div></div>

<div id="plot-sincos-slopes-en-extra" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var s=[];var c=[];
for(var i=0;i<=400;i++){var x=i*2*Math.PI/400;xs.push(x);s.push(Math.sin(x));c.push(Math.cos(x));}
var marks=[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI];
var mx=[];var my=[];var slopes=[];var labels=[];
for(var k=0;k<marks.length;k++){var xm=marks[k];mx.push(xm);my.push(Math.sin(xm));slopes.push(Math.cos(xm));labels.push("x="+(k===0?"0":k===1?"π/2":k===2?"π":k===3?"3π/2":"2π")+"<br>slope="+Math.cos(xm).toFixed(2));}
var t1={x:xs,y:s,mode:"lines",name:"sin x",line:{color:"#3b82f6",width:2.8}};
var t2={x:xs,y:c,mode:"lines",name:"(sin x)' = cos x",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var t3={x:mx,y:my,mode:"markers+text",name:"slope of sin x at marked points",text:labels,textposition:"top center",textfont:{color:"#ebe6dc",size:10},marker:{color:"#ef4444",size:10,line:{color:"#0a0a0a",width:1.5}}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radians)",range:[-0.2,2*Math.PI+0.2],tickvals:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],ticktext:["0","π/2","π","3π/2","2π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-1.6,1.8]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-sincos-slopes-en-extra",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Phase-shift visualisation.</strong> Over $[0, 2\\pi]$ the derivative $\\cos x$ (gold dotted) is exactly $\\sin x$ (blue) shifted left by $\\pi/2$. The red dots mark five key positions on $\\sin x$; the number printed next to each dot is the <em>slope</em> there, which you can read off directly from the value of the gold curve at the same $x$. At $x=0$ the slope is $+1$ (sine is rising fastest); at $x=\\pi/2$ the slope is $0$ (peak, flat); at $x=\\pi$ the slope is $-1$ (falling fastest); at $x=3\\pi/2$ the slope is $0$ (trough, flat); at $x=2\\pi$ the slope is back to $+1$. Reading slope from the value of the gold curve is the meaning of $(\\sin x)' = \\cos x$.</div></div>

<h2 class="lesson-title">2. Derivative of $\\cos x$</h2>

<p class="l-text">We can repeat the same argument with the angle-sum formula $\\cos(x+h) = \\cos x \\cos h - \\sin x \\sin h$, but a cleaner approach uses the identity $\\cos x = \\sin\\!\\left(\\tfrac{\\pi}{2} - x\\right)$ together with the chain rule. Let us do it directly from the definition for symmetry.</p>

<p class="l-text">From the definition,</p>

<div class="calc-formula"><div class="formula-main">$$(\\cos x)' = \\lim_{h \\to 0} \\frac{\\cos(x+h) - \\cos x}{h}.$$</div></div>

<p class="l-text">Expand the numerator: $\\cos(x+h) - \\cos x = \\cos x \\cos h - \\sin x \\sin h - \\cos x = \\cos x (\\cos h - 1) - \\sin x \\sin h$. Divide by $h$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\cos(x+h) - \\cos x}{h} = \\cos x \\cdot \\frac{\\cos h - 1}{h} \\;-\\; \\sin x \\cdot \\frac{\\sin h}{h}.$$</div></div>

<p class="l-text">Using the same two fundamental limits ($\\to 0$ and $\\to 1$), the first term vanishes and the second contributes $-\\sin x$. Therefore</p>

<div class="calc-formula"><div class="formula-label">SECOND KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(\\cos x)' \\;=\\; -\\sin x\\;}$$</div><div class="formula-sub">The minus sign comes from the second term: $-\\sin x \\cdot (\\sin h / h) \\to -\\sin x \\cdot 1$.</div></div>

<div class="calc-example"><div class="example-label">VISUAL SANITY CHECK</div><div class="example-body">At $x = 0$: $\\sin 0 = 0$, so $(\\cos x)'\\big|_{x=0} = 0$. Look at the cosine graph at $x = 0$: it is exactly at its peak, slope flat. Tick.<br><br>At $x = \\pi/2$: $\\sin(\\pi/2) = 1$, so $(\\cos x)'\\big|_{x=\\pi/2} = -1$. Look at $\\cos(\\pi/2) = 0$, dropping steeply through the axis. Tick.</div></div>

<h2 class="lesson-title">3. Derivative of $\\tan x$ — Use the Quotient Rule</h2>

<p class="l-text">By definition $\\tan x = \\dfrac{\\sin x}{\\cos x}$. Apply the quotient rule with $u = \\sin x$, $v = \\cos x$, $u' = \\cos x$, $v' = -\\sin x$:</p>

<div class="calc-formula"><div class="formula-main">$$(\\tan x)' = \\frac{u'v - uv'}{v^2} = \\frac{\\cos x \\cdot \\cos x - \\sin x \\cdot (-\\sin x)}{\\cos^2 x} = \\frac{\\cos^2 x + \\sin^2 x}{\\cos^2 x}.$$</div></div>

<p class="l-text">The numerator is the Pythagorean identity $\\cos^2 x + \\sin^2 x = 1$. So</p>

<div class="calc-formula"><div class="formula-label">THIRD KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(\\tan x)' \\;=\\; \\frac{1}{\\cos^2 x} \\;=\\; \\sec^2 x\\;}$$</div><div class="formula-sub">Notice $\\sec^2 x \\geq 1$ always — so the tangent function is <em>always</em> increasing on each of its branches, growing fastest near the vertical asymptotes $x = \\pm \\pi/2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Find</strong> the slope of $y = \\tan x$ at $x = \\pi/4$.<br><br>$\\cos(\\pi/4) = \\sqrt{2}/2$, so $\\cos^2(\\pi/4) = 1/2$. Therefore $\\sec^2(\\pi/4) = 2$. The slope at this point is <strong>$2$</strong>.</div></div>

<h2 class="lesson-title">4. Derivatives of $\\cot x$, $\\sec x$, $\\csc x$</h2>

<p class="l-text">These three derivatives follow the same recipe: write each function in terms of $\\sin x$ and $\\cos x$ and apply the quotient (or reciprocal) rule. We summarise the results; you should reproduce at least one of them with paper and pencil.</p>

<div class="calc-formula"><div class="formula-label">DERIVATIVES OF THE REMAINING TRIG FUNCTIONS</div><div class="formula-main">$$\\begin{aligned} (\\cot x)' &= -\\csc^2 x \\\\ (\\sec x)' &= \\sec x \\tan x \\\\ (\\csc x)' &= -\\csc x \\cot x \\end{aligned}$$</div><div class="formula-sub">Mnemonic: the three "co-" functions (cos, cot, csc) all pick up a minus sign in their derivative. The three "non-co-" functions (sin, tan, sec) do not.</div></div>

<p class="l-text"><strong>Short proof for $\\sec x$.</strong> Write $\\sec x = (\\cos x)^{-1}$. Using the chain rule with outer power $-1$ and inner $\\cos x$,</p>

<div class="calc-formula"><div class="formula-main">$$(\\sec x)' = -1 \\cdot (\\cos x)^{-2} \\cdot (-\\sin x) = \\frac{\\sin x}{\\cos^2 x} = \\frac{1}{\\cos x} \\cdot \\frac{\\sin x}{\\cos x} = \\sec x \\tan x.$$</div></div>

<p class="l-text">The other two follow the same pattern. Try $\\csc x = (\\sin x)^{-1}$ yourself.</p>

<h2 class="lesson-title">5. Derivative of $e^x$ — The Function That Is Its Own Derivative</h2>

<div class="calc-highlight"><strong>The headline.</strong> $(e^x)' = e^x$. The exponential function $e^x$ is the only (non-zero) function whose derivative equals itself. This is exactly the property that <em>defines</em> the number $e \\approx 2.71828\\dots$</div>

<p class="l-text">Try to differentiate $a^x$ from the definition for a general base $a > 0$:</p>

<div class="calc-formula"><div class="formula-main">$$(a^x)' = \\lim_{h \\to 0} \\frac{a^{x+h} - a^x}{h} = a^x \\cdot \\lim_{h \\to 0} \\frac{a^h - 1}{h}.$$</div></div>

<p class="l-text">The limit on the right is a number that depends only on $a$. Call it $C(a)$. So</p>

<div class="calc-formula"><div class="formula-main">$$(a^x)' = C(a) \\cdot a^x, \\qquad C(a) = \\lim_{h \\to 0} \\frac{a^h - 1}{h}.$$</div></div>

<p class="l-text">A bit of numerical experimenting (or some careful analysis) shows that $C(2) \\approx 0.693$, $C(3) \\approx 1.099$, and there is a special value of $a$ — sitting between $2$ and $3$ — for which $C(a) = 1$ exactly. That special base is defined to be $e$:</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF $e$</div><div class="formula-main">$$e = \\text{the unique } a > 0 \\text{ such that } \\lim_{h \\to 0} \\frac{a^h - 1}{h} = 1.$$</div><div class="formula-sub">Equivalently, $e$ is the unique base for which the tangent to $y = a^x$ at $x = 0$ has slope exactly $1$.</div></div>

<p class="l-text">With this definition, plugging $a = e$ into the boxed formula immediately gives</p>

<div class="calc-formula"><div class="formula-label">FOURTH KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(e^x)' \\;=\\; e^x\\;}$$</div><div class="formula-sub">The exponential function $e^x$ equals its own derivative. The slope at $x$ is the value at $x$. This single property is what makes $e^x$ the natural building block of growth, decay, oscillation (via complex exponentials), and probability.</div></div>

<div class="think-box"><div class="think-label">A REMARKABLE CONSEQUENCE</div><div class="think-body">If $y = e^x$, then $y' = y$, $y'' = y$, $y''' = y$, and so on for every derivative. The exponential is a "fixed point" of the differentiation operator — derivatives leave it unchanged. This is why every linear differential equation of constant coefficients has a solution made from $e^{rx}$ terms.</div></div>

<h2 class="lesson-title">6. Derivative of $\\ln x$ — Use Implicit Differentiation</h2>

<p class="l-text">Recall that $\\ln x$ is the inverse of $e^x$, meaning</p>

<div class="calc-formula"><div class="formula-main">$$y = \\ln x \\iff e^y = x \\quad (x > 0).$$</div></div>

<p class="l-text">Differentiate both sides of $e^y = x$ with respect to $x$. The right side is just $1$. The left side requires the chain rule: $\\frac{d}{dx}(e^y) = e^y \\cdot y'$. So</p>

<div class="calc-formula"><div class="formula-main">$$e^y \\cdot y' = 1 \\implies y' = \\frac{1}{e^y}.$$</div></div>

<p class="l-text">But $e^y = x$ by assumption, so $y' = 1/x$. Therefore</p>

<div class="calc-formula"><div class="formula-label">FIFTH KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(\\ln x)' \\;=\\; \\frac{1}{x}\\;} \\qquad (x > 0)$$</div><div class="formula-sub">The natural logarithm has the simplest possible derivative — a rational function. This unexpectedly simple slope is the deep reason $\\ln$ is the "natural" logarithm.</div></div>

<div class="calc-example"><div class="example-label">QUICK SANITY CHECK</div><div class="example-body">At $x = 1$ the slope of $\\ln x$ is $1/1 = 1$. So the tangent to $y = \\ln x$ at $(1, 0)$ has slope $1$, equation $y = x - 1$. Sketch it: $\\ln x$ passes through $(1, 0)$ heading up at $45^\\circ$, then curls slowly to the right. Matches.<br><br>At $x = e \\approx 2.718$ the slope is $1/e \\approx 0.368$. At $x = 10$ the slope is $0.1$. The logarithm grows ever more slowly.</div></div>

<h2 class="lesson-title">7. Derivative of $a^x$ for General Base $a$</h2>

<p class="l-text">For any base $a > 0$, we can rewrite $a^x$ in terms of $e$ using the identity $a = e^{\\ln a}$:</p>

<div class="calc-formula"><div class="formula-main">$$a^x = \\left(e^{\\ln a}\\right)^x = e^{x \\ln a}.$$</div></div>

<p class="l-text">Now differentiate using the chain rule. The outer function is $e^{(\\cdot)}$, whose derivative is itself; the inner function is $x \\ln a$, whose derivative is the constant $\\ln a$. So</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{d}{dx}\\bigl(e^{x \\ln a}\\bigr) = e^{x \\ln a} \\cdot \\ln a = a^x \\cdot \\ln a.$$</div></div>

<div class="calc-formula"><div class="formula-label">SIXTH KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(a^x)' \\;=\\; a^x \\ln a\\;} \\qquad (a > 0)$$</div><div class="formula-sub">Setting $a = e$ recovers $(e^x)' = e^x$ because $\\ln e = 1$. Setting $a = 1$ gives $1^x \\cdot 0 = 0$, also correct since $1^x \\equiv 1$ is constant.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Differentiate:</strong> $f(x) = 2^x$.<br><br>By the formula, $f'(x) = 2^x \\ln 2$. Numerically $\\ln 2 \\approx 0.693$, so $2^x$ grows about 30% more slowly than $e^x$ relative to its own size. At $x = 0$, slope $= 1 \\cdot \\ln 2 \\approx 0.693$. At $x = 10$, slope $= 1024 \\cdot \\ln 2 \\approx 709.8$.</div></div>

<h2 class="lesson-title">8. Derivative of $\\log_a x$</h2>

<p class="l-text">Using the change-of-base formula $\\log_a x = \\dfrac{\\ln x}{\\ln a}$, where $\\ln a$ is a constant, we get</p>

<div class="calc-formula"><div class="formula-main">$$(\\log_a x)' = \\frac{1}{\\ln a} \\cdot (\\ln x)' = \\frac{1}{\\ln a} \\cdot \\frac{1}{x} = \\frac{1}{x \\ln a}.$$</div></div>

<div class="calc-formula"><div class="formula-label">SEVENTH KEY RESULT</div><div class="formula-main">$$\\boxed{\\;(\\log_a x)' \\;=\\; \\frac{1}{x \\ln a}\\;}$$</div><div class="formula-sub">Setting $a = e$ recovers $(\\ln x)' = 1/x$ because $\\ln e = 1$. For the common log $\\log_{10} x$, the derivative is $1/(x \\ln 10) \\approx 1/(2.303\\, x)$.</div></div>

<div class="think-box"><div class="think-label">WHY $\\ln$ IS "NATURAL"</div><div class="think-body">Compare $(\\ln x)' = 1/x$ with $(\\log_{10} x)' = 1/(x \\ln 10)$. The natural logarithm gives the cleaner derivative — no extra constant lying around. Every logarithm formula in calculus is simplest when written in terms of $\\ln$. That is the meaning of the word "natural."</div></div>

<h2 class="lesson-title">9. The Master Derivative Table</h2>

<p class="l-text">All the basic derivatives gathered in one place. Memorise this table; every harder differentiation is just one or two applications of the chain or product rule on top of these entries.</p>

<div class="calc-formula"><div class="formula-label">BASIC DERIVATIVES — TABLE</div><div class="formula-main">$$\\begin{aligned} (c)' &= 0 & (x^n)' &= n x^{n-1} \\\\ (\\sin x)' &= \\cos x & (\\cos x)' &= -\\sin x \\\\ (\\tan x)' &= \\sec^2 x & (\\cot x)' &= -\\csc^2 x \\\\ (\\sec x)' &= \\sec x \\tan x & (\\csc x)' &= -\\csc x \\cot x \\\\ (e^x)' &= e^x & (\\ln x)' &= \\tfrac{1}{x} \\\\ (a^x)' &= a^x \\ln a & (\\log_a x)' &= \\tfrac{1}{x \\ln a} \\end{aligned}$$</div><div class="formula-sub">Every formula in this table assumes the argument is the variable $x$ itself. If the argument is a more complicated expression $u(x)$, apply the chain rule and multiply by $u'(x)$. Section 10 shows you how.</div></div>

<div style="margin:1.5rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;background:rgba(255,255,255,0.02);font-size:0.92rem;color:rgba(235,230,220,0.92)"><thead><tr style="background:rgba(59,130,246,0.08);border-bottom:2px solid #3b82f6"><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Family</th><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Function $f(x)$</th><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Derivative $f'(x)$</th><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Domain note</th></tr></thead><tbody><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem" rowspan="6"><strong>Trig</strong></td><td style="padding:0.55rem 0.9rem">$\\sin x$</td><td style="padding:0.55rem 0.9rem">$\\cos x$</td><td style="padding:0.55rem 0.9rem">all $x$ (radians)</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\cos x$</td><td style="padding:0.55rem 0.9rem">$-\\sin x$</td><td style="padding:0.55rem 0.9rem">all $x$ (radians)</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\tan x$</td><td style="padding:0.55rem 0.9rem">$\\sec^2 x$</td><td style="padding:0.55rem 0.9rem">$x \\neq \\pi/2 + k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\cot x$</td><td style="padding:0.55rem 0.9rem">$-\\csc^2 x$</td><td style="padding:0.55rem 0.9rem">$x \\neq k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\sec x$</td><td style="padding:0.55rem 0.9rem">$\\sec x \\tan x$</td><td style="padding:0.55rem 0.9rem">$x \\neq \\pi/2 + k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\csc x$</td><td style="padding:0.55rem 0.9rem">$-\\csc x \\cot x$</td><td style="padding:0.55rem 0.9rem">$x \\neq k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem" rowspan="2"><strong>Exponential</strong></td><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">all $x$ — fixed point of $d/dx$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$a^x \\;\\; (a>0)$</td><td style="padding:0.55rem 0.9rem">$a^x \\ln a$</td><td style="padding:0.55rem 0.9rem">all $x$; $\\ln a$ is constant</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem" rowspan="2"><strong>Logarithmic</strong></td><td style="padding:0.55rem 0.9rem">$\\ln x$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x}$</td><td style="padding:0.55rem 0.9rem">$x > 0$</td></tr><tr><td style="padding:0.55rem 0.9rem">$\\log_a x \\;\\; (a>0,\\,a\\neq 1)$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x \\ln a}$</td><td style="padding:0.55rem 0.9rem">$x > 0$</td></tr></tbody></table><div style="font-size:0.82rem;color:rgba(235,230,220,0.65);margin-top:0.5rem;font-style:italic">Quick reference — print this and keep it nearby until the formulas become automatic. The "co-" trig functions (cos, cot, csc) always pick up a minus sign; the others do not.</div></div>

<h2 class="lesson-title">10. Combined Examples Using the Chain Rule</h2>

<p class="l-text">The chain rule (Lesson 19) says that if $y = f(g(x))$ then $y' = f'(g(x)) \\cdot g'(x)$. Combined with the table above, this handles virtually every elementary function you will ever meet.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — $\\sin(2x)$</div><div class="example-body">Outer: $\\sin u$, derivative $\\cos u$. Inner: $u = 2x$, derivative $2$. So<br><br>$\\dfrac{d}{dx}\\sin(2x) = \\cos(2x) \\cdot 2 = 2\\cos(2x)$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — $e^{x^2}$</div><div class="example-body">Outer: $e^u$, derivative $e^u$. Inner: $u = x^2$, derivative $2x$. So<br><br>$\\dfrac{d}{dx}\\, e^{x^2} = e^{x^2} \\cdot 2x = 2x\\, e^{x^2}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — $\\ln(\\cos x)$</div><div class="example-body">Outer: $\\ln u$, derivative $1/u$. Inner: $u = \\cos x$, derivative $-\\sin x$. So<br><br>$\\dfrac{d}{dx}\\,\\ln(\\cos x) = \\dfrac{1}{\\cos x} \\cdot (-\\sin x) = -\\tan x$.<br><br>A surprisingly clean answer — this fact will reappear when you integrate $\\tan x$ in calculus.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — $\\sin^2 x$</div><div class="example-body">Write $\\sin^2 x = (\\sin x)^2$. Outer: $u^2$, derivative $2u$. Inner: $\\sin x$, derivative $\\cos x$. So<br><br>$\\dfrac{d}{dx}\\sin^2 x = 2\\sin x \\cdot \\cos x = \\sin(2x)$ &nbsp;(using the double-angle identity).</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 5 — $\\ln(\\ln x)$</div><div class="example-body">Outer: $\\ln u$, derivative $1/u$. Inner: $\\ln x$, derivative $1/x$. So<br><br>$\\dfrac{d}{dx}\\,\\ln(\\ln x) = \\dfrac{1}{\\ln x} \\cdot \\dfrac{1}{x} = \\dfrac{1}{x \\ln x}$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 6 — $e^{\\sin x}$</div><div class="example-body">Outer: $e^u$, derivative $e^u$. Inner: $\\sin x$, derivative $\\cos x$. So<br><br>$\\dfrac{d}{dx}\\,e^{\\sin x} = e^{\\sin x} \\cdot \\cos x = \\cos x \\cdot e^{\\sin x}$.</div></div>

<h2 class="lesson-title">11. Classical Exercises</h2>

<p class="l-text">Try each of these on paper, then check your answer against the worked solution. All eight problems use only the table from section 9 plus the chain, product or quotient rule.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Differentiate $f(x) = \\sin x + \\cos x$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = \\cos x - \\sin x$. (Sum rule plus the table.)</div></div></div>

<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Differentiate $f(x) = x \\sin x$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = \\sin x + x \\cos x$. (Product rule with $u = x$, $v = \\sin x$.)</div></div></div>

<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Differentiate $f(x) = e^{3x}$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = 3 e^{3x}$. (Chain rule: outer $e^u$, inner $3x$ with derivative $3$.)</div></div></div>

<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Differentiate $f(x) = \\ln(x^2 + 1)$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = \\dfrac{2x}{x^2 + 1}$. (Chain rule: outer $\\ln u$, inner $x^2 + 1$ with derivative $2x$.)</div></div></div>

<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Differentiate $f(x) = \\tan(3x)$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = 3 \\sec^2(3x)$. (Chain rule: outer $\\tan u$ with derivative $\\sec^2 u$, inner $3x$.)</div></div></div>

<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Differentiate $f(x) = e^x \\cos x$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = e^x \\cos x - e^x \\sin x = e^x(\\cos x - \\sin x)$. (Product rule.)</div></div></div>

<div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">Differentiate $f(x) = \\dfrac{\\ln x}{x}$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = \\dfrac{(1/x) \\cdot x - \\ln x \\cdot 1}{x^2} = \\dfrac{1 - \\ln x}{x^2}$. (Quotient rule. Note: $f'(x) = 0$ when $\\ln x = 1$, i.e. at $x = e$ — this is the maximum of $(\\ln x)/x$.)</div></div></div>

<div class="calc-step"><div class="step-num">8</div><div class="step-content"><div class="step-title">Differentiate $f(x) = 5^x + \\log_5 x$</div><div class="step-detail"><strong>Answer:</strong> $f'(x) = 5^x \\ln 5 + \\dfrac{1}{x \\ln 5}$. (Sum rule plus formulas for $a^x$ and $\\log_a x$ with $a = 5$.)</div></div></div>
</div>

<h2 class="lesson-title">Plots</h2>

<div id="plot-sin-cos-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var s=[];var c=[];
for(var i=-200;i<=200;i++){var x=i*Math.PI/100;xs.push(x);s.push(Math.sin(x));c.push(Math.cos(x));}
var t1={x:xs,y:s,mode:"lines",name:"sin x",line:{color:"#3b82f6",width:2.5}};
var t2={x:xs,y:c,mode:"lines",name:"cos x = (sin x)'",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radians)",range:[-2*Math.PI,2*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-1.5,1.5]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-sin-cos-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> sine (solid blue) and its derivative cosine (dotted gold). Wherever $\\sin x$ peaks, $\\cos x$ crosses zero — the slope of a peak is zero. Wherever $\\sin x$ crosses zero going up, $\\cos x$ reaches its maximum $+1$ — the slope is steepest. Cosine is sine shifted left by $\\pi/2$, which is exactly what differentiation does to a sinusoid.</div></div>

<div id="plot-exp-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];
for(var i=-200;i<=200;i++){var x=i/50;xs.push(x);ys.push(Math.exp(x));}
var t1={x:xs,y:ys,mode:"lines",name:"e^x",line:{color:"#3b82f6",width:2.5}};
var t2={x:xs,y:ys,mode:"lines",name:"(e^x)' = e^x (same curve)",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-4,4]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[0,55]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-exp-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> $e^x$ (blue solid) and its derivative $(e^x)' = e^x$ (gold dotted) overlap perfectly — they are literally the same curve. This is the defining property of $e^x$: the function equals its own slope at every $x$.</div></div>

<div id="plot-ln-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ln=[];var inv=[];
for(var i=1;i<=600;i++){var x=i/50;xs.push(x);ln.push(Math.log(x));inv.push(1/x);}
var t1={x:xs,y:ln,mode:"lines",name:"ln x",line:{color:"#3b82f6",width:2.5}};
var t2={x:xs,y:inv,mode:"lines",name:"(ln x)' = 1/x",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (>0)",range:[0,12]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-1.5,4]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-ln-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> $\\ln x$ (blue) climbs slowly and concavely; its slope $1/x$ (gold) starts very large near $x = 0$ and falls toward zero as $x \\to \\infty$. At $x = 1$ the slope is exactly $1$, marking where $\\ln$ crosses the axis.</div></div>

<div class="l-note"><strong>What you learned.</strong> Seven boxed formulas plus a master table now cover every elementary function. With this table and the three rules from Lesson 19 (sum, product/quotient, chain), you can differentiate anything you will meet in school. The next lesson moves to applications: max/min problems, related rates, and curve sketching.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şu ana kadar yalnızca kuvvet fonksiyonlarının türevini aldınız.</strong> $(x^n)' = n x^{n-1}$ kuralı polinomları idare eder, ama etrafınızdaki dünya üç farklı fonksiyon ailesi üzerinden çalışır: <em>trigonometrik</em> fonksiyonlar (salınım yapan her şey — salıncak, gelgit, alternatif akım), <em>üstel</em> fonksiyonlar (sabit yüzdeyle büyüyen her şey — faiz, nüfus, radyoaktif bozunma) ve <em>logaritmik</em> fonksiyonlar (üstellerin tersi — pH, desibel, Richter). Bu ders, bu üç ailenin her üyesini türevlemeyi öğretir.</p>

<p class="l-text">Buradaki tüm formüller $e$ sayısına dair tek bir temel olgudan, $\\sin$ için bir tane limit özdeşliğinden ve Ders 19'daki bölüm kuralından gelir. Her kuralı önce yavaşça türetip sonra her şeyi tek bir tabloda toplayacağız. Dersin sonunda $\\sin(\\ln(2x))$ türevini hiçbir yere bakmadan yazabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$(\\sin x)' = \\cos x$ formülünü limit tanımı, açı toplam formülü ve $\\lim_{h \\to 0} \\sin h / h = 1$ limiti yardımıyla türetmek</li>
<li>$(\\cos x)' = -\\sin x$ ve $(\\tan x)' = \\sec^2 x$ formüllerini söyleyip kanıtlamak</li>
<li>$\\cot x$, $\\sec x$, $\\csc x$ türevlerini anında yazabilmek</li>
<li>$(a^x)' = a^x$ eşitliğini sağlayan tek tabanın $e$ olduğunu görüp $(e^x)' = e^x$ sonucunu çıkarmak</li>
<li>$e^{y} = x$ üzerinde örtük türev alarak $(\\ln x)' = 1/x$ sonucunu kanıtlamak</li>
<li>$\\ln a$ kullanarak genel üstel $a^x$ ve genel logaritma $\\log_a x$ türevlerini bulmak</li>
<li>Zincir kuralıyla bu temel taşları birleştirerek $\\sin(2x)$, $e^{x^2}$, $\\ln(\\cos x)$ gibi bileşik fonksiyonları türevlemek</li>
</ul>
</div>

<h2 class="lesson-title">1. $\\sin x$ Türevi — Ayrıntılı Kanıt</h2>

<div class="calc-highlight"><strong>Sonuç.</strong> $(\\sin x)' = \\cos x$. Sinüs eğrisinin herhangi bir $x$'teki eğimi, kosinüs eğrisinin aynı $x$'teki yüksekliğine eşittir. Aşağıda bunu sadece limit tanımından dikkatle kanıtlıyoruz.</div>

<p class="l-text">Türevi sıfırdan hesaplayalım. Tanım gereği,</p>

<div class="calc-formula"><div class="formula-main">$$(\\sin x)' = \\lim_{h \\to 0} \\frac{\\sin(x+h) - \\sin x}{h}.$$</div></div>

<p class="l-text">Açı toplam formülünü uygulayalım: $\\sin(x+h) = \\sin x \\cos h + \\cos x \\sin h$. Pay şu olur:</p>

<div class="calc-formula"><div class="formula-main">$$\\sin x \\cos h + \\cos x \\sin h - \\sin x = \\sin x (\\cos h - 1) + \\cos x \\sin h.$$</div></div>

<p class="l-text">Şimdi $h$'a bölüp kesri ikiye ayıralım:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin(x+h) - \\sin x}{h} \\;=\\; \\sin x \\cdot \\frac{\\cos h - 1}{h} \\;+\\; \\cos x \\cdot \\frac{\\sin h}{h}.$$</div></div>

<p class="l-text">Burada <strong>iki ünlü trigonometrik limit</strong> devreye girer (şimdilik kabul edebilirsiniz; her ikisi de bir dairesel sektörün geometrik resmiyle sıkıştırma teoremi kullanılarak kanıtlanır):</p>

<div class="calc-formula"><div class="formula-label">İKİ TEMEL LİMİT</div><div class="formula-main">$$\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1 \\qquad \\text{ve} \\qquad \\lim_{h \\to 0} \\frac{\\cos h - 1}{h} = 0.$$</div><div class="formula-sub">Her ikisi de $h$'ın <em>radyan</em> olmasını ister. Derece kullansaydık $\\sin h / h$ limiti $1$ yerine $\\pi/180$ olurdu — ve bu dersteki tüm formüller çirkinleşirdi. Kalkülüsün her zaman radyan kullanmasının sebebi tam olarak budur.</div></div>

<p class="l-text">Bu limitleri yerine yazınca ilk terim sıfırlanır ($\\sin x \\cdot 0 = 0$) ve ikincisi sağ kalır ($\\cos x \\cdot 1 = \\cos x$). Sonuçta</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(\\sin x)' \\;=\\; \\cos x\\;}$$</div><div class="formula-sub">Sinüsün türevi kosinüstür — açıların radyan cinsinden ölçülmesi şartıyla.</div></div>

<div class="think-box"><div class="think-label">İKİ LİMİT NEDEN?</div><div class="think-body">Birim çember üzerinde merkez açısı $h$ olan küçük bir sektör çizin. Üç alanı karşılaştırın: içteki üçgen ($\\tfrac{1}{2}\\sin h$), sektör ($\\tfrac{1}{2} h$) ve dıştaki dik üçgen ($\\tfrac{1}{2}\\tan h$). $0 < h < \\pi/2$ için $\\sin h \\leq h \\leq \\tan h$ zinciri kurulur. Her tarafı $\\sin h$ ile bölüp sıkıştırınca $\\sin h / h \\to 1$ doğrudan çıkar. İkinci limit ise $(\\cos h - 1)/h$ ifadesini $(\\cos h + 1)/(\\cos h + 1)$ eşleniğiyle çarpıp birinci limiti kullanarak elde edilir.</div></div>

<div id="plot-sincos-slopes-tr-extra" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var s=[];var c=[];
for(var i=0;i<=400;i++){var x=i*2*Math.PI/400;xs.push(x);s.push(Math.sin(x));c.push(Math.cos(x));}
var marks=[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI];
var mx=[];var my=[];var slopes=[];var labels=[];
for(var k=0;k<marks.length;k++){var xm=marks[k];mx.push(xm);my.push(Math.sin(xm));slopes.push(Math.cos(xm));labels.push("x="+(k===0?"0":k===1?"π/2":k===2?"π":k===3?"3π/2":"2π")+"<br>eğim="+Math.cos(xm).toFixed(2));}
var t1={x:xs,y:s,mode:"lines",name:"sin x",line:{color:"#3b82f6",width:2.8}};
var t2={x:xs,y:c,mode:"lines",name:"(sin x)' = cos x",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var t3={x:mx,y:my,mode:"markers+text",name:"işaretli noktalarda sin x eğimi",text:labels,textposition:"top center",textfont:{color:"#ebe6dc",size:10},marker:{color:"#ef4444",size:10,line:{color:"#0a0a0a",width:1.5}}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radyan)",range:[-0.2,2*Math.PI+0.2],tickvals:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],ticktext:["0","π/2","π","3π/2","2π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-1.6,1.8]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-sincos-slopes-tr-extra",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Faz kayması görselleştirmesi.</strong> $[0, 2\\pi]$ aralığında türev $\\cos x$ (altın noktalı), $\\sin x$'in (mavi) $\\pi/2$ kadar sola kaydırılmış hâline tıpatıp eşittir. Kırmızı noktalar $\\sin x$ üzerindeki beş kritik konumu işaretler; her noktanın yanındaki sayı, o $x$ değerindeki <em>eğimdir</em> ve aynı $x$'te altın eğrinin değerinden doğrudan okunabilir. $x=0$'da eğim $+1$ (sinüs en hızlı yükseliyor); $x=\\pi/2$'de eğim $0$ (tepe, düz); $x=\\pi$'de eğim $-1$ (en hızlı düşüş); $x=3\\pi/2$'de eğim $0$ (çukur, düz); $x=2\\pi$'de eğim tekrar $+1$. Altın eğrinin değerinden eğim okumak, $(\\sin x)' = \\cos x$ eşitliğinin tam anlamıdır.</div></div>

<h2 class="lesson-title">2. $\\cos x$ Türevi</h2>

<p class="l-text">Aynı argümanı $\\cos(x+h) = \\cos x \\cos h - \\sin x \\sin h$ açı toplam formülüyle tekrarlayabiliriz; ya da $\\cos x = \\sin\\!\\left(\\tfrac{\\pi}{2} - x\\right)$ özdeşliği ile zincir kuralı kullanmak daha temizdir. Simetri için doğrudan tanımdan gidelim.</p>

<p class="l-text">Tanım gereği,</p>

<div class="calc-formula"><div class="formula-main">$$(\\cos x)' = \\lim_{h \\to 0} \\frac{\\cos(x+h) - \\cos x}{h}.$$</div></div>

<p class="l-text">Payı açalım: $\\cos(x+h) - \\cos x = \\cos x \\cos h - \\sin x \\sin h - \\cos x = \\cos x (\\cos h - 1) - \\sin x \\sin h$. $h$'a bölelim:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\cos(x+h) - \\cos x}{h} = \\cos x \\cdot \\frac{\\cos h - 1}{h} \\;-\\; \\sin x \\cdot \\frac{\\sin h}{h}.$$</div></div>

<p class="l-text">Yine aynı iki temel limiti kullanarak ($\\to 0$ ve $\\to 1$), ilk terim sıfırlanır ve ikincisi $-\\sin x$ katkısı verir. Bu nedenle</p>

<div class="calc-formula"><div class="formula-label">İKİNCİ TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(\\cos x)' \\;=\\; -\\sin x\\;}$$</div><div class="formula-sub">Eksi işareti ikinci terimden gelir: $-\\sin x \\cdot (\\sin h / h) \\to -\\sin x \\cdot 1$.</div></div>

<div class="calc-example"><div class="example-label">GÖRSEL DOĞRULAMA</div><div class="example-body">$x = 0$ noktasında: $\\sin 0 = 0$, dolayısıyla $(\\cos x)'\\big|_{x=0} = 0$. Kosinüs grafiğine $x = 0$'da bakın: tam tepedeyiz, eğim sıfır. Tamam.<br><br>$x = \\pi/2$ noktasında: $\\sin(\\pi/2) = 1$, yani $(\\cos x)'\\big|_{x=\\pi/2} = -1$. $\\cos(\\pi/2) = 0$, eksene dik gibi inerek geçiyor. Tamam.</div></div>

<h2 class="lesson-title">3. $\\tan x$ Türevi — Bölüm Kuralını Kullanın</h2>

<p class="l-text">Tanım gereği $\\tan x = \\dfrac{\\sin x}{\\cos x}$. Bölüm kuralını $u = \\sin x$, $v = \\cos x$, $u' = \\cos x$, $v' = -\\sin x$ ile uygulayalım:</p>

<div class="calc-formula"><div class="formula-main">$$(\\tan x)' = \\frac{u'v - uv'}{v^2} = \\frac{\\cos x \\cdot \\cos x - \\sin x \\cdot (-\\sin x)}{\\cos^2 x} = \\frac{\\cos^2 x + \\sin^2 x}{\\cos^2 x}.$$</div></div>

<p class="l-text">Pay, Pisagor özdeşliği $\\cos^2 x + \\sin^2 x = 1$ değerini verir. Böylece</p>

<div class="calc-formula"><div class="formula-label">ÜÇÜNCÜ TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(\\tan x)' \\;=\\; \\frac{1}{\\cos^2 x} \\;=\\; \\sec^2 x\\;}$$</div><div class="formula-sub">$\\sec^2 x \\geq 1$ her zaman doğrudur — yani tanjant her dalında <em>daima</em> artar; $x = \\pm \\pi/2$ düşey asimptotlarına yaklaştıkça da en hızlı büyür.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>Bulun:</strong> $y = \\tan x$ eğrisinin $x = \\pi/4$ noktasındaki eğimi.<br><br>$\\cos(\\pi/4) = \\sqrt{2}/2$, dolayısıyla $\\cos^2(\\pi/4) = 1/2$. O hâlde $\\sec^2(\\pi/4) = 2$. Bu noktadaki eğim <strong>$2$</strong>'dir.</div></div>

<h2 class="lesson-title">4. $\\cot x$, $\\sec x$, $\\csc x$ Türevleri</h2>

<p class="l-text">Bu üç türev aynı reçeteyi izler: her fonksiyonu $\\sin x$ ve $\\cos x$ cinsinden yazın, bölüm (ya da ters) kuralını uygulayın. Sonuçları topluyoruz; en azından birini kâğıt-kalemle siz türetin.</p>

<div class="calc-formula"><div class="formula-label">KALAN TRİG FONKSİYONLARIN TÜREVLERİ</div><div class="formula-main">$$\\begin{aligned} (\\cot x)' &= -\\csc^2 x \\\\ (\\sec x)' &= \\sec x \\tan x \\\\ (\\csc x)' &= -\\csc x \\cot x \\end{aligned}$$</div><div class="formula-sub">Hatırlatıcı: "ko-" ile başlayan üç fonksiyon (cos, cot, csc) türevde eksi işareti alır. "Ko-suzlar" (sin, tan, sec) almaz.</div></div>

<p class="l-text"><strong>$\\sec x$ için kısa kanıt.</strong> $\\sec x = (\\cos x)^{-1}$ olarak yazın. Dış kuvvet $-1$, iç fonksiyon $\\cos x$ ile zincir kuralı:</p>

<div class="calc-formula"><div class="formula-main">$$(\\sec x)' = -1 \\cdot (\\cos x)^{-2} \\cdot (-\\sin x) = \\frac{\\sin x}{\\cos^2 x} = \\frac{1}{\\cos x} \\cdot \\frac{\\sin x}{\\cos x} = \\sec x \\tan x.$$</div></div>

<p class="l-text">Diğer ikisi de aynı yolu izler. $\\csc x = (\\sin x)^{-1}$ üzerinden siz deneyin.</p>

<h2 class="lesson-title">5. $e^x$ Türevi — Kendi Türevine Eşit Olan Fonksiyon</h2>

<div class="calc-highlight"><strong>Manşet.</strong> $(e^x)' = e^x$. Üstel fonksiyon $e^x$, türevi kendisine eşit olan (sıfırdan farklı) tek fonksiyondur. $e \\approx 2.71828\\dots$ sayısını <em>tanımlayan</em> özellik tam olarak budur.</div>

<p class="l-text">Genel $a > 0$ tabanı için $a^x$ türevini tanımdan denersek:</p>

<div class="calc-formula"><div class="formula-main">$$(a^x)' = \\lim_{h \\to 0} \\frac{a^{x+h} - a^x}{h} = a^x \\cdot \\lim_{h \\to 0} \\frac{a^h - 1}{h}.$$</div></div>

<p class="l-text">Sağdaki limit yalnızca $a$'ya bağlı bir sayıdır. Buna $C(a)$ diyelim. Böylece</p>

<div class="calc-formula"><div class="formula-main">$$(a^x)' = C(a) \\cdot a^x, \\qquad C(a) = \\lim_{h \\to 0} \\frac{a^h - 1}{h}.$$</div></div>

<p class="l-text">Biraz sayısal deneme (ya da titiz bir analiz) gösterir ki $C(2) \\approx 0.693$, $C(3) \\approx 1.099$ ve $2$ ile $3$ arasında bir özel $a$ değeri vardır; o değerde tam olarak $C(a) = 1$ olur. O özel taban $e$ olarak tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">$e$ TANIMI</div><div class="formula-main">$$e = \\lim_{h \\to 0} \\frac{a^h - 1}{h} = 1 \\text{ koşulunu sağlayan tek } a > 0.$$</div><div class="formula-sub">Eşdeğer şekilde, $e$ tabanı $y = a^x$ eğrisinin $x = 0$'daki teğetinin tam olarak $1$ eğime sahip olduğu tek tabandır.</div></div>

<p class="l-text">Bu tanımla, üstteki kutulu formülde $a = e$ yerine yazınca</p>

<div class="calc-formula"><div class="formula-label">DÖRDÜNCÜ TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(e^x)' \\;=\\; e^x\\;}$$</div><div class="formula-sub">$e^x$ üstel fonksiyonu kendi türevine eşittir. Her $x$ noktasındaki eğim, o noktadaki değerin kendisidir. $e^x$'i büyüme, bozunma, salınım (karmaşık üstellerle) ve olasılığın doğal yapı taşı yapan tek özellik budur.</div></div>

<div class="think-box"><div class="think-label">ŞAŞIRTICI BİR SONUÇ</div><div class="think-body">Eğer $y = e^x$ ise $y' = y$, $y'' = y$, $y''' = y$ ve her mertebeden türev için aynı şey doğrudur. Üstel, türev operatörünün bir "sabit noktası"dır — türevler onu değiştirmez. Sabit katsayılı her lineer diferansiyel denklemin çözümünün $e^{rx}$ terimlerinden oluşmasının sebebi tam olarak budur.</div></div>

<h2 class="lesson-title">6. $\\ln x$ Türevi — Örtük Türev Kullanın</h2>

<p class="l-text">$\\ln x$ fonksiyonunun $e^x$'in tersi olduğunu hatırlayın; yani</p>

<div class="calc-formula"><div class="formula-main">$$y = \\ln x \\iff e^y = x \\quad (x > 0).$$</div></div>

<p class="l-text">$e^y = x$ eşitliğinin her iki yanını $x$'e göre türevleyelim. Sağ taraf yalnızca $1$. Sol taraf için zincir kuralı: $\\frac{d}{dx}(e^y) = e^y \\cdot y'$. Yani</p>

<div class="calc-formula"><div class="formula-main">$$e^y \\cdot y' = 1 \\implies y' = \\frac{1}{e^y}.$$</div></div>

<p class="l-text">Ama varsayım gereği $e^y = x$, dolayısıyla $y' = 1/x$. Sonuçta</p>

<div class="calc-formula"><div class="formula-label">BEŞİNCİ TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(\\ln x)' \\;=\\; \\frac{1}{x}\\;} \\qquad (x > 0)$$</div><div class="formula-sub">Doğal logaritmanın türevi olabilecek en sade ifadedir — bir rasyonel fonksiyon. Bu beklenmedik sadelik, $\\ln$'ye "doğal" denmesinin asıl sebebidir.</div></div>

<div class="calc-example"><div class="example-label">KISA DOĞRULAMA</div><div class="example-body">$x = 1$ noktasında $\\ln x$ eğimi $1/1 = 1$. Yani $y = \\ln x$ eğrisinin $(1, 0)$ noktasındaki teğetinin eğimi $1$, denklemi $y = x - 1$. Çizin: $\\ln x$ eğrisi $(1, 0)$ noktasından $45^\\circ$ ile yukarı çıkıp sağa doğru yavaşça kıvrılır. Uyuyor.<br><br>$x = e \\approx 2.718$ noktasında eğim $1/e \\approx 0.368$. $x = 10$'da eğim $0.1$. Logaritma giderek daha yavaş büyür.</div></div>

<h2 class="lesson-title">7. Genel $a$ Tabanı için $a^x$ Türevi</h2>

<p class="l-text">Her $a > 0$ tabanı için $a^x$ ifadesini $a = e^{\\ln a}$ özdeşliğini kullanarak $e$ cinsinden yazabiliriz:</p>

<div class="calc-formula"><div class="formula-main">$$a^x = \\left(e^{\\ln a}\\right)^x = e^{x \\ln a}.$$</div></div>

<p class="l-text">Şimdi zincir kuralıyla türevleyelim. Dış fonksiyon $e^{(\\cdot)}$, türevi kendisidir; iç fonksiyon $x \\ln a$, türevi $\\ln a$ sabitidir. Böylece</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{d}{dx}\\bigl(e^{x \\ln a}\\bigr) = e^{x \\ln a} \\cdot \\ln a = a^x \\cdot \\ln a.$$</div></div>

<div class="calc-formula"><div class="formula-label">ALTINCI TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(a^x)' \\;=\\; a^x \\ln a\\;} \\qquad (a > 0)$$</div><div class="formula-sub">$a = e$ alırsak $\\ln e = 1$ olduğundan $(e^x)' = e^x$ formülüne döneriz. $a = 1$ alırsak $1^x \\cdot 0 = 0$ elde edilir; $1^x \\equiv 1$ sabit olduğu için bu da doğrudur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>Türevleyin:</strong> $f(x) = 2^x$.<br><br>Formülden $f'(x) = 2^x \\ln 2$. Sayısal olarak $\\ln 2 \\approx 0.693$; yani $2^x$, kendi büyüklüğüne kıyasla $e^x$'ten yaklaşık %30 daha yavaş büyür. $x = 0$ için eğim $1 \\cdot \\ln 2 \\approx 0.693$. $x = 10$ için eğim $1024 \\cdot \\ln 2 \\approx 709.8$.</div></div>

<h2 class="lesson-title">8. $\\log_a x$ Türevi</h2>

<p class="l-text">Taban değiştirme formülü $\\log_a x = \\dfrac{\\ln x}{\\ln a}$ (paydadaki $\\ln a$ bir sabittir) kullanarak</p>

<div class="calc-formula"><div class="formula-main">$$(\\log_a x)' = \\frac{1}{\\ln a} \\cdot (\\ln x)' = \\frac{1}{\\ln a} \\cdot \\frac{1}{x} = \\frac{1}{x \\ln a}.$$</div></div>

<div class="calc-formula"><div class="formula-label">YEDİNCİ TEMEL SONUÇ</div><div class="formula-main">$$\\boxed{\\;(\\log_a x)' \\;=\\; \\frac{1}{x \\ln a}\\;}$$</div><div class="formula-sub">$a = e$ alırsak $\\ln e = 1$ olduğundan $(\\ln x)' = 1/x$ formülüne döneriz. Onluk logaritma $\\log_{10} x$ için türev $1/(x \\ln 10) \\approx 1/(2.303\\, x)$ olur.</div></div>

<div class="think-box"><div class="think-label">$\\ln$ NEDEN "DOĞAL"?</div><div class="think-body">$(\\ln x)' = 1/x$ ile $(\\log_{10} x)' = 1/(x \\ln 10)$ ifadelerini karşılaştırın. Doğal logaritma daha temiz türev verir — fazladan dolaşan bir sabit yok. Kalkülüsteki her logaritma formülü, $\\ln$ ile yazıldığında en sade hâline gelir. "Doğal" sıfatının anlamı budur.</div></div>

<h2 class="lesson-title">9. Türev Ana Tablosu</h2>

<p class="l-text">Tüm temel türevler tek bir yerde. Bu tabloyu ezberleyin; daha zor her türev, bu girdiler üzerine bir-iki zincir veya çarpım kuralı uygulamasından ibarettir.</p>

<div class="calc-formula"><div class="formula-label">TEMEL TÜREVLER — TABLO</div><div class="formula-main">$$\\begin{aligned} (c)' &= 0 & (x^n)' &= n x^{n-1} \\\\ (\\sin x)' &= \\cos x & (\\cos x)' &= -\\sin x \\\\ (\\tan x)' &= \\sec^2 x & (\\cot x)' &= -\\csc^2 x \\\\ (\\sec x)' &= \\sec x \\tan x & (\\csc x)' &= -\\csc x \\cot x \\\\ (e^x)' &= e^x & (\\ln x)' &= \\tfrac{1}{x} \\\\ (a^x)' &= a^x \\ln a & (\\log_a x)' &= \\tfrac{1}{x \\ln a} \\end{aligned}$$</div><div class="formula-sub">Tablodaki her formül, argümanın doğrudan $x$ değişkeni olduğunu varsayar. Argüman daha karmaşık bir $u(x)$ ifadesiyse zincir kuralını uygulayın ve $u'(x)$ ile çarpın. 10. bölüm bunu nasıl yapacağınızı gösterir.</div></div>

<div style="margin:1.5rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;background:rgba(255,255,255,0.02);font-size:0.92rem;color:rgba(235,230,220,0.92)"><thead><tr style="background:rgba(59,130,246,0.08);border-bottom:2px solid #3b82f6"><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Aile</th><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Fonksiyon $f(x)$</th><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Türev $f'(x)$</th><th style="padding:0.65rem 0.9rem;text-align:left;color:#3b82f6;font-weight:700;letter-spacing:0.04em">Tanım bölgesi notu</th></tr></thead><tbody><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem" rowspan="6"><strong>Trigonometrik</strong></td><td style="padding:0.55rem 0.9rem">$\\sin x$</td><td style="padding:0.55rem 0.9rem">$\\cos x$</td><td style="padding:0.55rem 0.9rem">tüm $x$ (radyan)</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\cos x$</td><td style="padding:0.55rem 0.9rem">$-\\sin x$</td><td style="padding:0.55rem 0.9rem">tüm $x$ (radyan)</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\tan x$</td><td style="padding:0.55rem 0.9rem">$\\sec^2 x$</td><td style="padding:0.55rem 0.9rem">$x \\neq \\pi/2 + k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\cot x$</td><td style="padding:0.55rem 0.9rem">$-\\csc^2 x$</td><td style="padding:0.55rem 0.9rem">$x \\neq k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\sec x$</td><td style="padding:0.55rem 0.9rem">$\\sec x \\tan x$</td><td style="padding:0.55rem 0.9rem">$x \\neq \\pi/2 + k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$\\csc x$</td><td style="padding:0.55rem 0.9rem">$-\\csc x \\cot x$</td><td style="padding:0.55rem 0.9rem">$x \\neq k\\pi$</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem" rowspan="2"><strong>Üstel</strong></td><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">$e^x$</td><td style="padding:0.55rem 0.9rem">tüm $x$ — $d/dx$'in sabit noktası</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem">$a^x \\;\\; (a>0)$</td><td style="padding:0.55rem 0.9rem">$a^x \\ln a$</td><td style="padding:0.55rem 0.9rem">tüm $x$; $\\ln a$ sabittir</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.55rem 0.9rem" rowspan="2"><strong>Logaritmik</strong></td><td style="padding:0.55rem 0.9rem">$\\ln x$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x}$</td><td style="padding:0.55rem 0.9rem">$x > 0$</td></tr><tr><td style="padding:0.55rem 0.9rem">$\\log_a x \\;\\; (a>0,\\,a\\neq 1)$</td><td style="padding:0.55rem 0.9rem">$\\dfrac{1}{x \\ln a}$</td><td style="padding:0.55rem 0.9rem">$x > 0$</td></tr></tbody></table><div style="font-size:0.82rem;color:rgba(235,230,220,0.65);margin-top:0.5rem;font-style:italic">Hızlı başvuru tablosu — bu formüller otomatikleşene kadar yazdırıp yanınızda bulundurun. "Ko-" ile başlayan trig fonksiyonlar (cos, cot, csc) türevde her zaman eksi işareti alır; diğerleri almaz.</div></div>

<h2 class="lesson-title">10. Zincir Kuralı ile Birleşik Örnekler</h2>

<p class="l-text">Zincir kuralı (Ders 19), $y = f(g(x))$ ise $y' = f'(g(x)) \\cdot g'(x)$ olduğunu söyler. Yukarıdaki tabloyla birleşince, okul boyunca karşınıza çıkacak hemen her temel fonksiyonu çözer.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — $\\sin(2x)$</div><div class="example-body">Dış: $\\sin u$, türevi $\\cos u$. İç: $u = 2x$, türevi $2$. Böylece<br><br>$\\dfrac{d}{dx}\\sin(2x) = \\cos(2x) \\cdot 2 = 2\\cos(2x)$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — $e^{x^2}$</div><div class="example-body">Dış: $e^u$, türevi $e^u$. İç: $u = x^2$, türevi $2x$. Böylece<br><br>$\\dfrac{d}{dx}\\, e^{x^2} = e^{x^2} \\cdot 2x = 2x\\, e^{x^2}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — $\\ln(\\cos x)$</div><div class="example-body">Dış: $\\ln u$, türevi $1/u$. İç: $u = \\cos x$, türevi $-\\sin x$. Böylece<br><br>$\\dfrac{d}{dx}\\,\\ln(\\cos x) = \\dfrac{1}{\\cos x} \\cdot (-\\sin x) = -\\tan x$.<br><br>Beklenmedik kadar temiz bir cevap — bu özdeşlik, kalkülüste $\\tan x$ integrali alırken yeniden karşınıza çıkacak.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — $\\sin^2 x$</div><div class="example-body">$\\sin^2 x = (\\sin x)^2$ olarak yazın. Dış: $u^2$, türevi $2u$. İç: $\\sin x$, türevi $\\cos x$. Böylece<br><br>$\\dfrac{d}{dx}\\sin^2 x = 2\\sin x \\cdot \\cos x = \\sin(2x)$ &nbsp;(çift açı formülü kullanılarak).</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — $\\ln(\\ln x)$</div><div class="example-body">Dış: $\\ln u$, türevi $1/u$. İç: $\\ln x$, türevi $1/x$. Böylece<br><br>$\\dfrac{d}{dx}\\,\\ln(\\ln x) = \\dfrac{1}{\\ln x} \\cdot \\dfrac{1}{x} = \\dfrac{1}{x \\ln x}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 6 — $e^{\\sin x}$</div><div class="example-body">Dış: $e^u$, türevi $e^u$. İç: $\\sin x$, türevi $\\cos x$. Böylece<br><br>$\\dfrac{d}{dx}\\,e^{\\sin x} = e^{\\sin x} \\cdot \\cos x = \\cos x \\cdot e^{\\sin x}$.</div></div>

<h2 class="lesson-title">11. Klasik Alıştırmalar</h2>

<p class="l-text">Aşağıdakileri önce kâğıt üzerinde deneyin, sonra cevabınızı çözümle karşılaştırın. Sekiz sorunun hepsi 9. bölümdeki tablo artı toplam, çarpım/bölüm ve zincir kuralından başka bir şey kullanmaz.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$f(x) = \\sin x + \\cos x$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = \\cos x - \\sin x$. (Toplam kuralı artı tablo.)</div></div></div>

<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$f(x) = x \\sin x$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = \\sin x + x \\cos x$. ($u = x$, $v = \\sin x$ ile çarpım kuralı.)</div></div></div>

<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$f(x) = e^{3x}$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = 3 e^{3x}$. (Zincir kuralı: dış $e^u$, iç $3x$, iç türevi $3$.)</div></div></div>

<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$f(x) = \\ln(x^2 + 1)$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = \\dfrac{2x}{x^2 + 1}$. (Zincir kuralı: dış $\\ln u$, iç $x^2 + 1$, iç türevi $2x$.)</div></div></div>

<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">$f(x) = \\tan(3x)$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = 3 \\sec^2(3x)$. (Zincir kuralı: dış $\\tan u$, türevi $\\sec^2 u$; iç $3x$.)</div></div></div>

<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">$f(x) = e^x \\cos x$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = e^x \\cos x - e^x \\sin x = e^x(\\cos x - \\sin x)$. (Çarpım kuralı.)</div></div></div>

<div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">$f(x) = \\dfrac{\\ln x}{x}$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = \\dfrac{(1/x) \\cdot x - \\ln x \\cdot 1}{x^2} = \\dfrac{1 - \\ln x}{x^2}$. (Bölüm kuralı. Not: $\\ln x = 1$ olduğunda, yani $x = e$ noktasında $f'(x) = 0$ olur — bu $(\\ln x)/x$ ifadesinin maksimumudur.)</div></div></div>

<div class="calc-step"><div class="step-num">8</div><div class="step-content"><div class="step-title">$f(x) = 5^x + \\log_5 x$ türevini alın</div><div class="step-detail"><strong>Cevap:</strong> $f'(x) = 5^x \\ln 5 + \\dfrac{1}{x \\ln 5}$. (Toplam kuralı artı $a^x$ ve $\\log_a x$ formülleri, $a = 5$ ile.)</div></div></div>
</div>

<h2 class="lesson-title">Grafikler</h2>

<div id="plot-sin-cos-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var s=[];var c=[];
for(var i=-200;i<=200;i++){var x=i*Math.PI/100;xs.push(x);s.push(Math.sin(x));c.push(Math.cos(x));}
var t1={x:xs,y:s,mode:"lines",name:"sin x",line:{color:"#3b82f6",width:2.5}};
var t2={x:xs,y:c,mode:"lines",name:"cos x = (sin x)'",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (radyan)",range:[-2*Math.PI,2*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-1.5,1.5]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-sin-cos-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Sinüs (mavi düz) ve türevi kosinüs (altın noktalı). $\\sin x$ tepe yaptığı her yerde $\\cos x$ sıfırı keser — tepedeki eğim sıfırdır. $\\sin x$'in artarak sıfırı kestiği her yerde $\\cos x$ maksimumu $+1$'e ulaşır — eğim en diktir. Kosinüs, sinüsün $\\pi/2$ kadar sola kaymış hâlidir; türev almak da sinüse aynen bunu yapar.</div></div>

<div id="plot-exp-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];
for(var i=-200;i<=200;i++){var x=i/50;xs.push(x);ys.push(Math.exp(x));}
var t1={x:xs,y:ys,mode:"lines",name:"e^x",line:{color:"#3b82f6",width:2.5}};
var t2={x:xs,y:ys,mode:"lines",name:"(e^x)' = e^x (ayni egri)",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-4,4]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[0,55]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-exp-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $e^x$ (mavi düz) ve onun türevi $(e^x)' = e^x$ (altın noktalı) tıpatıp üst üste oturur — gerçekten aynı eğridirler. $e^x$'i tanımlayan özellik tam olarak budur: fonksiyon, her $x$ noktasındaki kendi eğimine eşittir.</div></div>

<div id="plot-ln-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ln=[];var inv=[];
for(var i=1;i<=600;i++){var x=i/50;xs.push(x);ln.push(Math.log(x));inv.push(1/x);}
var t1={x:xs,y:ln,mode:"lines",name:"ln x",line:{color:"#3b82f6",width:2.5}};
var t2={x:xs,y:inv,mode:"lines",name:"(ln x)' = 1/x",line:{color:"#c8a96e",width:2.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (>0)",range:[0,12]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-1.5,4]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-ln-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\ln x$ (mavi) yavaşça ve içbükey olarak tırmanır; eğimi $1/x$ (altın) ise $x \\to 0$ yakınında çok büyük başlar ve $x \\to \\infty$ giderken sıfıra düşer. $x = 1$ noktasında eğim tam olarak $1$'dir; bu da $\\ln$'nin ekseni kestiği yerdir.</div></div>

<div class="l-note"><strong>Bu derste öğrendikleriniz.</strong> Yedi kutulu formül ve ana tablo, artık her temel fonksiyonu kapsıyor. Bu tablo ve Ders 19'daki üç kuralla (toplam, çarpım/bölüm, zincir) okulda karşınıza çıkacak her ifadeyi türevleyebilirsiniz. Sonraki ders uygulamalara geçer: maksimum-minimum problemleri, ilişkili oranlar ve eğri çizimi.</div>`
};
