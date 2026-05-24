window.LISE_MAT_L28 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Integration is the reverse of differentiation.</strong> In the previous lesson we defined the antiderivative and the indefinite integral symbol $\\int f(x)\\,dx$. We learned a single fact: if $F'(x) = f(x)$ then $\\int f(x)\\,dx = F(x) + C$. That fact alone is not enough to integrate anything beyond a handful of textbook examples. To actually compute integrals in homework, exam, and university entrance problems, you need a small library of <em>standard formulas</em> plus a handful of <em>algebraic tricks</em> that turn an unfamiliar integrand into something already on the list.</p>

<p class="l-text">This lesson builds that library and that toolbox. We will memorise twelve fundamental integrals — power, exponential, logarithmic, six trigonometric — and prove each one by differentiating the answer. Then we will practise the four most common <em>manipulation techniques</em>: term-by-term polynomial integration, splitting fractions by long-dividing the numerator, rewriting trigonometric squares using the double-angle identity, and converting $\\tan^2 x$ into $\\sec^2 x - 1$. Ten worked exercises at the end glue everything together.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recall the twelve fundamental integration formulas and justify each by differentiation</li>
<li>Integrate any polynomial term-by-term using the power rule</li>
<li>Handle simple rational integrands such as $\\int \\frac{1}{x-a}\\,dx$ and $\\int \\frac{1}{x^2}\\,dx$</li>
<li>Integrate radical expressions $\\sqrt{x}$ and $\\frac{1}{\\sqrt{x}}$ by rewriting as powers</li>
<li>Split a fraction with polynomial numerator over a monomial denominator into separate integrable pieces</li>
<li>Use the identities $\\sin^2 x = \\frac{1-\\cos 2x}{2}$, $\\cos^2 x = \\frac{1+\\cos 2x}{2}$, $\\tan^2 x = \\sec^2 x - 1$</li>
<li>Compute $\\int a^x\\,dx = \\frac{a^x}{\\ln a} + C$ for any base $a > 0,\\, a \\neq 1$</li>
</ul>
</div>

<h2 class="lesson-title">1. The Standard Integral Table</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a chef does not invent every sauce from scratch — there is a small set of mother sauces (béchamel, velouté, espagnole, ...) and every fancy dish is a variation of one of them. Integration is the same. There are twelve mother formulas. Master them and almost every Turkish high school exam integral is just a disguised version of one of those twelve.</div>

<p class="l-text">The formulas below come from <em>reading the derivative table backwards</em>. If we know that $\\frac{d}{dx}[\\sin x] = \\cos x$, then by definition of the antiderivative $\\int \\cos x\\,dx = \\sin x + C$. Every formula in this table is justified the same way: differentiate the right-hand side and check that you recover the integrand. That short check is shown in the third column of every entry and is the only "proof" you need.</p>

<div class="calc-formula"><div class="formula-label">TWELVE FUNDAMENTAL INTEGRALS</div><div class="formula-main">
<div style="text-align:left;font-size:0.95em;line-height:1.85">
<strong>1.</strong> $\\;\\int k\\,dx = kx + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[kx] = k$ ✓)</em><br>
<strong>2.</strong> $\\;\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C,\\;\\; n \\neq -1$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}\\!\\left[\\frac{x^{n+1}}{n+1}\\right] = \\frac{(n+1)x^n}{n+1} = x^n$ ✓)</em><br>
<strong>3.</strong> $\\;\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[\\ln|x|] = \\frac{1}{x}$ ✓)</em><br>
<strong>4.</strong> $\\;\\int e^x\\,dx = e^x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[e^x] = e^x$ ✓)</em><br>
<strong>5.</strong> $\\;\\int a^x\\,dx = \\dfrac{a^x}{\\ln a} + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}\\!\\left[\\frac{a^x}{\\ln a}\\right] = \\frac{a^x \\ln a}{\\ln a} = a^x$ ✓)</em><br>
<strong>6.</strong> $\\;\\int \\cos x\\,dx = \\sin x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[\\sin x] = \\cos x$ ✓)</em><br>
<strong>7.</strong> $\\;\\int \\sin x\\,dx = -\\cos x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[-\\cos x] = \\sin x$ ✓)</em><br>
<strong>8.</strong> $\\;\\int \\sec^2 x\\,dx = \\tan x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[\\tan x] = \\sec^2 x$ ✓)</em><br>
<strong>9.</strong> $\\;\\int \\csc^2 x\\,dx = -\\cot x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[-\\cot x] = \\csc^2 x$ ✓)</em><br>
<strong>10.</strong> $\\;\\int \\sec x \\tan x\\,dx = \\sec x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[\\sec x] = \\sec x \\tan x$ ✓)</em><br>
<strong>11.</strong> $\\;\\int \\csc x \\cot x\\,dx = -\\csc x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[-\\csc x] = \\csc x \\cot x$ ✓)</em><br>
<strong>12.</strong> $\\;\\int \\dfrac{1}{1+x^2}\\,dx = \\arctan x + C$ &nbsp;&nbsp;<em>(check: $\\frac{d}{dx}[\\arctan x] = \\frac{1}{1+x^2}$ ✓)</em>
</div>
</div><div class="formula-sub">Every formula adds $+ C$ because the derivative kills the constant. Memorise the left column; the right column you can always rebuild by differentiating.</div></div>

<p class="l-text"><strong>Two indispensable linearity rules</strong> sit beneath every example in this lesson:</p>

<div class="calc-formula"><div class="formula-label">LINEARITY OF THE INTEGRAL</div><div class="formula-main">$$\\int \\bigl[f(x) + g(x)\\bigr]\\,dx = \\int f(x)\\,dx + \\int g(x)\\,dx, \\qquad \\int k\\,f(x)\\,dx = k\\int f(x)\\,dx$$</div><div class="formula-sub">A sum integrates term-by-term. A constant factor pulls out of the integral. These two rules are why the rest of the lesson is just "rewrite the integrand as a sum of table entries."</div></div>

<div class="think-box"><div class="think-label">WHY $n \\neq -1$ IN FORMULA 2</div><div class="think-body">Apply the power rule with $n = -1$: you would get $\\frac{x^{-1+1}}{-1+1} = \\frac{x^0}{0} = \\frac{1}{0}$, which is undefined. That is exactly the case formula 3 rescues — when $n = -1$ the answer is $\\ln|x|$, not a power.</div></div>

<div style="margin:1.5rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;background:rgba(15,18,25,0.55);color:#ebe6dc;font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead>
<tr style="background:#3b82f6;color:#ffffff;text-align:left">
<th style="padding:0.7rem 1rem;font-weight:700;letter-spacing:0.04em">Integrand $f(x)$</th>
<th style="padding:0.7rem 1rem;font-weight:700;letter-spacing:0.04em">Antiderivative $\\int f(x)\\,dx$</th>
<th style="padding:0.7rem 1rem;font-weight:700;letter-spacing:0.04em">Condition</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$x^n$</td><td style="padding:0.55rem 1rem">$\\dfrac{x^{n+1}}{n+1} + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$n \\neq -1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$\\dfrac{1}{x}$</td><td style="padding:0.55rem 1rem">$\\ln|x| + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$x \\neq 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$\\sin x$</td><td style="padding:0.55rem 1rem">$-\\cos x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">all $x$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$\\cos x$</td><td style="padding:0.55rem 1rem">$\\sin x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">all $x$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$e^x$</td><td style="padding:0.55rem 1rem">$e^x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">all $x$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$a^x$</td><td style="padding:0.55rem 1rem">$\\dfrac{a^x}{\\ln a} + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$a > 0,\\, a \\neq 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$\\sec^2 x$</td><td style="padding:0.55rem 1rem">$\\tan x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$x \\neq \\frac{\\pi}{2} + k\\pi$</td></tr>
<tr style="background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$\\dfrac{1}{1+x^2}$</td><td style="padding:0.55rem 1rem">$\\arctan x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">all $x$</td></tr>
</tbody>
</table>
<div style="font-size:0.82rem;color:rgba(235,230,220,0.6);margin-top:0.5rem;text-align:center"><em>Quick reference: the eight integration formulas that cover ~90% of high-school exam problems. Always add $+ C$.</em></div>
</div>

<h2 class="lesson-title">2. Polynomial Integration</h2>

<p class="l-text">A polynomial is a finite sum of terms of the form $a_k x^k$. By linearity, integrating a polynomial reduces to integrating each term separately using formula 2, then summing the results. You will do this on autopilot once you have integrated a dozen examples.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — A QUADRATIC</div><div class="example-body"><strong>Compute</strong> $\\int (3x^2 - 4x + 7)\\,dx$.<br><br>
By linearity split into three pieces:<br><br>
$\\int 3x^2\\,dx - \\int 4x\\,dx + \\int 7\\,dx$<br><br>
Apply formula 2 to each: $\\frac{3x^3}{3} - \\frac{4x^2}{2} + 7x = x^3 - 2x^2 + 7x$.<br><br>
<strong>Answer:</strong> $\\int (3x^2 - 4x + 7)\\,dx = x^3 - 2x^2 + 7x + C$.<br><br>
<em>Check:</em> $\\frac{d}{dx}[x^3 - 2x^2 + 7x + C] = 3x^2 - 4x + 7$ ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — A LONGER POLYNOMIAL</div><div class="example-body"><strong>Compute</strong> $\\int (5x^4 - 6x^3 + 2x^2 - x + 9)\\,dx$.<br><br>
Term-by-term: $\\frac{5x^5}{5} - \\frac{6x^4}{4} + \\frac{2x^3}{3} - \\frac{x^2}{2} + 9x$.<br><br>
Simplify: $x^5 - \\dfrac{3x^4}{2} + \\dfrac{2x^3}{3} - \\dfrac{x^2}{2} + 9x + C$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — EXPAND FIRST</div><div class="example-body"><strong>Compute</strong> $\\int (2x + 1)(x - 3)\\,dx$.<br><br>
The integrand is a product — but it is just an ordinary polynomial in disguise. Expand: $(2x+1)(x-3) = 2x^2 - 6x + x - 3 = 2x^2 - 5x - 3$.<br><br>
Now integrate term-by-term: $\\dfrac{2x^3}{3} - \\dfrac{5x^2}{2} - 3x + C$.<br><br>
<em>Rule of thumb:</em> if you see a product of polynomials inside an integral, <strong>expand before integrating</strong>. There is no "product rule for integrals" at this level.</div></div>

<!-- Plot: polynomial and its antiderivative -->
<div id="plot-poly-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var f=[];var F=[];
for(var i=-200;i<=200;i++){var x=i/50;xs.push(x);f.push(3*x*x-4*x+7);F.push(x*x*x-2*x*x+7*x);}
var t1={x:xs,y:f,mode:"lines",name:"f(x) = 3x² − 4x + 7",line:{color:"#c8a96e",width:2.5}};
var t2={x:xs,y:F,mode:"lines",name:"F(x) = x³ − 2x² + 7x",line:{color:"#60a5fa",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-poly-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the quadratic $f(x) = 3x^2 - 4x + 7$ (gold) is the slope of its antiderivative $F(x) = x^3 - 2x^2 + 7x$ (blue). Where $f$ sits high, $F$ rises steeply; where $f$ is small, $F$ rises gently. Integrating a degree-$n$ polynomial always produces a polynomial of degree $n+1$.</div></div>

<!-- Plot: family of antiderivatives x^3/3 + C for different C -->
<div id="plot-family-en-extra1" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];for(var i=-200;i<=200;i++){xs.push(i/80);}
var traces=[];
var Cs=[-2,-1,0,1,2];
var palette=["#3b82f6","#60a5fa","#93c5fd","#bfdbfe","#dbeafe"];
for(var k=0;k<Cs.length;k++){
  var ys=xs.map(function(x){return x*x*x/3+Cs[k];});
  traces.push({x:xs,y:ys,mode:"lines",name:"F(x) = x³/3 + ("+Cs[k]+")",line:{color:palette[k],width:2.3}});
}
var fx=xs.map(function(x){return x*x;});
traces.push({x:xs,y:fx,mode:"lines",name:"f(x) = x²  (slope of every F)",line:{color:"#c8a96e",width:2.8,dash:"dot"}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-4,4]},margin:{t:30,r:30,b:60,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-family-en-extra1",traces,layout,{responsive:true,displayModeBar:false});
},150)</script>

<div class="calc-graph"><div class="graph-caption"><strong>The "$+ C$" picture:</strong> every blue curve above has the same derivative $f(x) = x^2$ (gold dashed). They differ only by a vertical shift — the constant $C$. This is why the indefinite integral $\\int x^2\\,dx = \\dfrac{x^3}{3} + C$ is a <em>whole family</em> of curves, not one. Choosing a value of $C$ is the same as choosing which curve in this family passes through your initial condition.</div></div>

<!-- Plot: x^2 with shaded area = antiderivative grows -->
<div id="plot-area-en-extra2" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];for(var i=0;i<=200;i++){xs.push(i/100);}
var fx=xs.map(function(x){return x*x;});
var Fx=xs.map(function(x){return x*x*x/3;});
// Shaded area trace (fill under f from 0 to x)
var shadeX=xs.slice();shadeX.push(2,0);
var shadeY=fx.slice();shadeY.push(0,0);
var tShade={x:shadeX,y:shadeY,fill:"toself",fillcolor:"rgba(59,130,246,0.18)",line:{color:"rgba(0,0,0,0)"},mode:"lines",name:"Area under f(x)=x² from 0 to x",hoverinfo:"skip",showlegend:true};
var tf={x:xs,y:fx,mode:"lines",name:"f(x) = x²",line:{color:"#c8a96e",width:2.8}};
var tF={x:xs,y:Fx,mode:"lines",name:"F(x) = x³/3  (accumulated area)",line:{color:"#3b82f6",width:2.8}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[0,2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[0,4.5]},margin:{t:30,r:30,b:60,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-area-en-extra2",[tShade,tf,tF],layout,{responsive:true,displayModeBar:false});
},200)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Antiderivative as accumulated area:</strong> the shaded region is the area under $f(x) = x^2$ from $0$ to the current $x$. As $x$ grows, that area grows — and its value at any $x$ is exactly $F(x) = \\dfrac{x^3}{3}$, the blue curve. This is the geometric reason behind the formula $\\int x^2\\,dx = \\dfrac{x^3}{3} + C$: integration <em>measures</em> accumulated area, and the constant $C$ just picks the starting baseline.</div></div>

<h2 class="lesson-title">3. Simple Rational Functions</h2>

<p class="l-text">A <strong>rational function</strong> is a quotient of two polynomials. Full partial-fraction decomposition is a university topic, but Turkish high school covers two very common simple cases. Both come straight from formulas 2 and 3 of the table.</p>

<div class="calc-formula"><div class="formula-label">TWO RATIONAL TEMPLATES</div><div class="formula-main">$$\\int \\dfrac{1}{x - a}\\,dx \\;=\\; \\ln|x - a| + C, \\qquad \\int \\dfrac{1}{x^n}\\,dx \\;=\\; \\dfrac{x^{1-n}}{1-n} + C \\quad (n \\neq 1)$$</div><div class="formula-sub">The first is a horizontal shift of formula 3 (use $u = x - a$, $du = dx$). The second is formula 2 applied with a negative exponent.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — RECIPROCAL OF A LINEAR FACTOR</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{1}{x - 5}\\,dx$.<br><br>
Direct application of the first template: $\\ln|x - 5| + C$.<br><br>
<em>Check:</em> $\\frac{d}{dx}[\\ln|x - 5|] = \\frac{1}{x - 5}$ ✓ (chain rule with inner derivative $1$.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 — A NEGATIVE-EXPONENT POWER</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{1}{x^2}\\,dx$.<br><br>
Rewrite the integrand as a power: $\\frac{1}{x^2} = x^{-2}$.<br><br>
Apply formula 2 with $n = -2$: $\\dfrac{x^{-2+1}}{-2+1} = \\dfrac{x^{-1}}{-1} = -\\dfrac{1}{x}$.<br><br>
<strong>Answer:</strong> $\\int \\dfrac{1}{x^2}\\,dx = -\\dfrac{1}{x} + C$.<br><br>
<em>Check:</em> $\\frac{d}{dx}\\!\\left[-\\frac{1}{x}\\right] = \\frac{d}{dx}[-x^{-1}] = x^{-2} = \\frac{1}{x^2}$ ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6 — HIGHER NEGATIVE POWER</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{1}{x^3}\\,dx$.<br><br>
Rewrite as $x^{-3}$ and apply formula 2: $\\dfrac{x^{-2}}{-2} = -\\dfrac{1}{2x^2}$.<br><br>
<strong>Answer:</strong> $-\\dfrac{1}{2x^2} + C$.</div></div>

<div class="think-box"><div class="think-label">SIGN PITFALL</div><div class="think-body">A common mistake on $\\int x^{-2}\\,dx$ is to "forget the minus sign" from dividing by $n+1 = -1$. Always write the steps: $\\frac{x^{n+1}}{n+1}$ with $n = -2$ gives $\\frac{x^{-1}}{-1}$, then read off $-x^{-1} = -\\frac{1}{x}$. Skipping a step loses the sign.</div></div>

<h2 class="lesson-title">4. Radical (Root) Functions</h2>

<p class="l-text">There is no separate formula for $\\sqrt{x}$ — it is just $x^{1/2}$, which is a power, which falls under formula 2. The whole strategy is: <strong>rewrite every root as a fractional power</strong>, then apply the power rule.</p>

<div class="calc-formula"><div class="formula-label">ROOTS ARE FRACTIONAL POWERS</div><div class="formula-main">$$\\sqrt{x} = x^{1/2}, \\quad \\sqrt[n]{x} = x^{1/n}, \\quad \\dfrac{1}{\\sqrt{x}} = x^{-1/2}, \\quad \\sqrt{x^3} = x^{3/2}$$</div><div class="formula-sub">Once you have a power, formula 2 finishes the job.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7 — SQUARE ROOT</div><div class="example-body"><strong>Compute</strong> $\\int \\sqrt{x}\\,dx$.<br><br>
Rewrite: $\\sqrt{x} = x^{1/2}$. Apply formula 2 with $n = 1/2$:<br><br>
$\\dfrac{x^{1/2 + 1}}{1/2 + 1} = \\dfrac{x^{3/2}}{3/2} = \\dfrac{2}{3}\\,x^{3/2} = \\dfrac{2}{3}\\sqrt{x^3} = \\dfrac{2x\\sqrt{x}}{3}$.<br><br>
<strong>Answer:</strong> $\\int \\sqrt{x}\\,dx = \\dfrac{2x\\sqrt{x}}{3} + C$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8 — RECIPROCAL ROOT</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{1}{\\sqrt{x}}\\,dx$.<br><br>
Rewrite: $\\frac{1}{\\sqrt{x}} = x^{-1/2}$. Apply formula 2:<br><br>
$\\dfrac{x^{-1/2 + 1}}{-1/2 + 1} = \\dfrac{x^{1/2}}{1/2} = 2x^{1/2} = 2\\sqrt{x}$.<br><br>
<strong>Answer:</strong> $\\int \\dfrac{1}{\\sqrt{x}}\\,dx = 2\\sqrt{x} + C$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9 — CUBE ROOT</div><div class="example-body"><strong>Compute</strong> $\\int \\sqrt[3]{x^2}\\,dx$.<br><br>
Rewrite: $\\sqrt[3]{x^2} = x^{2/3}$. Apply formula 2:<br><br>
$\\dfrac{x^{2/3 + 1}}{2/3 + 1} = \\dfrac{x^{5/3}}{5/3} = \\dfrac{3}{5}\\,x^{5/3}$.<br><br>
<strong>Answer:</strong> $\\dfrac{3}{5}\\,x^{5/3} + C = \\dfrac{3\\sqrt[3]{x^5}}{5} + C$.</div></div>

<h2 class="lesson-title">5. Splitting Fractions Before Integrating</h2>

<div class="calc-highlight"><strong>The trick:</strong> if the numerator is a polynomial of degree at least equal to the denominator, <em>divide it out</em> before integrating. The integral of a sum of simple terms is easy; the integral of a quotient as written is usually not.</div>

<p class="l-text">There is no quotient rule for integrals — and that is what makes a quotient like $\\int \\frac{x^2 + 3x + 2}{x}\\,dx$ awkward at first sight. The fix is purely algebraic: split the single fraction with denominator $x$ into three fractions and simplify each.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 10 — SPLIT BY MONOMIAL</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{x^2 + 3x + 2}{x}\\,dx$.<br><br>
Split term by term: $\\dfrac{x^2 + 3x + 2}{x} = \\dfrac{x^2}{x} + \\dfrac{3x}{x} + \\dfrac{2}{x} = x + 3 + \\dfrac{2}{x}$.<br><br>
Now integrate the sum:<br><br>
$\\int x\\,dx + \\int 3\\,dx + \\int \\dfrac{2}{x}\\,dx = \\dfrac{x^2}{2} + 3x + 2\\ln|x|$.<br><br>
<strong>Answer:</strong> $\\int \\dfrac{x^2 + 3x + 2}{x}\\,dx = \\dfrac{x^2}{2} + 3x + 2\\ln|x| + C$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 11 — HIGHER DEGREE NUMERATOR</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{x^3 - 2x^2 + 5}{x^2}\\,dx$.<br><br>
Split: $\\dfrac{x^3 - 2x^2 + 5}{x^2} = \\dfrac{x^3}{x^2} - \\dfrac{2x^2}{x^2} + \\dfrac{5}{x^2} = x - 2 + 5x^{-2}$.<br><br>
Integrate term by term:<br><br>
$\\dfrac{x^2}{2} - 2x + 5 \\cdot \\dfrac{x^{-1}}{-1} = \\dfrac{x^2}{2} - 2x - \\dfrac{5}{x}$.<br><br>
<strong>Answer:</strong> $\\dfrac{x^2}{2} - 2x - \\dfrac{5}{x} + C$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 12 — ROOT IN THE NUMERATOR</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{\\sqrt{x} + 1}{x}\\,dx$.<br><br>
Split: $\\dfrac{\\sqrt{x} + 1}{x} = \\dfrac{\\sqrt{x}}{x} + \\dfrac{1}{x} = x^{-1/2} + \\dfrac{1}{x}$.<br><br>
Integrate: $\\dfrac{x^{1/2}}{1/2} + \\ln|x| = 2\\sqrt{x} + \\ln|x|$.<br><br>
<strong>Answer:</strong> $2\\sqrt{x} + \\ln|x| + C$.</div></div>

<div class="think-box"><div class="think-label">THE GOLDEN RULE</div><div class="think-body">When you see a fraction inside an integral, <strong>first</strong> ask: "Can I split this into a sum of simpler pieces?" If the denominator is a single monomial $x^n$, the answer is always yes. Only after splitting do you reach for the integration formulas.</div></div>

<h2 class="lesson-title">6. Trigonometric Manipulation: Squares of Sine and Cosine</h2>

<p class="l-text">The integrals $\\int \\sin^2 x\\,dx$ and $\\int \\cos^2 x\\,dx$ are <em>not</em> on the standard table. Why? Because $\\sin^2 x$ is not the derivative of any familiar trig function. The trick is to use the <strong>double-angle identities</strong> from lesson 14 to rewrite the square as a linear function of $\\cos 2x$, which <em>is</em> on the table.</p>

<div class="calc-formula"><div class="formula-label">POWER-REDUCTION IDENTITIES</div><div class="formula-main">$$\\sin^2 x = \\dfrac{1 - \\cos 2x}{2}, \\qquad \\cos^2 x = \\dfrac{1 + \\cos 2x}{2}$$</div><div class="formula-sub">Derived by solving $\\cos 2x = 1 - 2\\sin^2 x$ for $\\sin^2 x$, and $\\cos 2x = 2\\cos^2 x - 1$ for $\\cos^2 x$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 13 — INTEGRATE $\\sin^2 x$</div><div class="example-body"><strong>Compute</strong> $\\int \\sin^2 x\\,dx$.<br><br>
Apply the identity: $\\sin^2 x = \\dfrac{1 - \\cos 2x}{2} = \\dfrac{1}{2} - \\dfrac{1}{2}\\cos 2x$.<br><br>
Integrate term by term:<br><br>
$\\int \\dfrac{1}{2}\\,dx - \\int \\dfrac{1}{2}\\cos 2x\\,dx = \\dfrac{x}{2} - \\dfrac{1}{2} \\cdot \\dfrac{\\sin 2x}{2} = \\dfrac{x}{2} - \\dfrac{\\sin 2x}{4}$.<br><br>
<strong>Answer:</strong> $\\int \\sin^2 x\\,dx = \\dfrac{x}{2} - \\dfrac{\\sin 2x}{4} + C$.<br><br>
<em>Note:</em> $\\int \\cos 2x\\,dx = \\frac{\\sin 2x}{2}$ because the inner derivative of $2x$ is $2$, which must be divided out.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 14 — INTEGRATE $\\cos^2 x$</div><div class="example-body"><strong>Compute</strong> $\\int \\cos^2 x\\,dx$.<br><br>
Identity: $\\cos^2 x = \\dfrac{1 + \\cos 2x}{2} = \\dfrac{1}{2} + \\dfrac{1}{2}\\cos 2x$.<br><br>
Integrate: $\\dfrac{x}{2} + \\dfrac{\\sin 2x}{4} + C$.<br><br>
<em>Sanity check:</em> adding $\\sin^2 x + \\cos^2 x = 1$, so their integrals must add to $x + C$:<br>
$\\bigl(\\frac{x}{2} - \\frac{\\sin 2x}{4}\\bigr) + \\bigl(\\frac{x}{2} + \\frac{\\sin 2x}{4}\\bigr) = x$ ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 15 — DIFFERENCE OF SQUARES</div><div class="example-body"><strong>Compute</strong> $\\int (\\cos^2 x - \\sin^2 x)\\,dx$.<br><br>
Recognise the double-angle identity in reverse: $\\cos^2 x - \\sin^2 x = \\cos 2x$.<br><br>
So $\\int (\\cos^2 x - \\sin^2 x)\\,dx = \\int \\cos 2x\\,dx = \\dfrac{\\sin 2x}{2} + C$.<br><br>
<em>Lesson:</em> always look for an identity that <strong>collapses</strong> the integrand before computing anything.</div></div>

<h2 class="lesson-title">7. The $\\tan^2 x$ and $\\sec^2 x$ Trick</h2>

<p class="l-text">There is no direct integration formula for $\\tan^2 x$. There <em>is</em> a direct formula for $\\sec^2 x$ — it is entry 8 of the standard table. So we convert one to the other using the Pythagorean identity.</p>

<div class="calc-formula"><div class="formula-label">PYTHAGOREAN CONSEQUENCE</div><div class="formula-main">$$1 + \\tan^2 x = \\sec^2 x \\;\\;\\implies\\;\\; \\tan^2 x = \\sec^2 x - 1$$</div><div class="formula-sub">Divide both sides of $\\sin^2 x + \\cos^2 x = 1$ by $\\cos^2 x$ to derive this. Useful precisely because $\\sec^2 x$ integrates to $\\tan x$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 16 — INTEGRATE $\\tan^2 x$</div><div class="example-body"><strong>Compute</strong> $\\int \\tan^2 x\\,dx$.<br><br>
Rewrite: $\\tan^2 x = \\sec^2 x - 1$.<br><br>
Integrate term by term:<br><br>
$\\int \\sec^2 x\\,dx - \\int 1\\,dx = \\tan x - x$.<br><br>
<strong>Answer:</strong> $\\int \\tan^2 x\\,dx = \\tan x - x + C$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 17 — INTEGRATE $\\cot^2 x$</div><div class="example-body"><strong>Compute</strong> $\\int \\cot^2 x\\,dx$.<br><br>
Companion identity (divide $\\sin^2 + \\cos^2 = 1$ by $\\sin^2 x$): $1 + \\cot^2 x = \\csc^2 x$, so $\\cot^2 x = \\csc^2 x - 1$.<br><br>
Integrate: $-\\cot x - x + C$.</div></div>

<div class="think-box"><div class="think-label">PATTERN</div><div class="think-body">When you see a squared trigonometric function inside an integral, you almost always need an identity to escape. The recipe is:<br>
&bull; $\\sin^2$ or $\\cos^2$ &rarr; use $\\sin^2 = \\frac{1 - \\cos 2x}{2}$ or $\\cos^2 = \\frac{1 + \\cos 2x}{2}$.<br>
&bull; $\\tan^2$ or $\\cot^2$ &rarr; use $\\tan^2 = \\sec^2 - 1$ or $\\cot^2 = \\csc^2 - 1$.<br>
&bull; Mixed products like $\\sin x \\cos x$ &rarr; use $\\sin 2x = 2 \\sin x \\cos x$.</div></div>

<h2 class="lesson-title">8. Exponential Bases Other Than $e$</h2>

<p class="l-text">The natural exponential $e^x$ integrates back to itself — formula 4. For any other positive base $a$, the answer carries an extra factor of $\\frac{1}{\\ln a}$. This is formula 5 of the table.</p>

<div class="calc-formula"><div class="formula-label">GENERAL EXPONENTIAL INTEGRAL</div><div class="formula-main">$$\\int a^x\\,dx = \\dfrac{a^x}{\\ln a} + C, \\qquad a > 0,\\; a \\neq 1$$</div><div class="formula-sub">Special case: $a = e$ gives $\\ln a = 1$, recovering $\\int e^x\\,dx = e^x + C$.</div></div>

<p class="l-text"><strong>Where does $\\ln a$ come from?</strong> Rewrite $a^x$ using the identity $a^x = e^{x \\ln a}$. Then by the chain rule, $\\frac{d}{dx}[e^{x \\ln a}] = (\\ln a)\\, e^{x \\ln a} = (\\ln a)\\, a^x$. Reverse this: to get $a^x$ back you must divide by $\\ln a$. That is exactly the $\\frac{1}{\\ln a}$ in the integral.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 18 — BASE 2</div><div class="example-body"><strong>Compute</strong> $\\int 2^x\\,dx$.<br><br>
Apply formula 5 with $a = 2$: $\\dfrac{2^x}{\\ln 2} + C$.<br><br>
<em>Numerical sanity:</em> $\\ln 2 \\approx 0.693$, so the answer is roughly $1.44 \\cdot 2^x + C$. Differentiating recovers $\\frac{(\\ln 2)\\, 2^x}{\\ln 2} = 2^x$ ✓.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 19 — BASE 10</div><div class="example-body"><strong>Compute</strong> $\\int 10^x\\,dx$.<br><br>
$\\dfrac{10^x}{\\ln 10} + C$, with $\\ln 10 \\approx 2.303$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 20 — MIXED EXPONENTIAL</div><div class="example-body"><strong>Compute</strong> $\\int (e^x + 3^x)\\,dx$.<br><br>
Linearity: $\\int e^x\\,dx + \\int 3^x\\,dx = e^x + \\dfrac{3^x}{\\ln 3} + C$.</div></div>

<h2 class="lesson-title">9. Ten Classical Practice Problems</h2>

<p class="l-text">Each problem below uses exactly one of the techniques from sections 2&ndash;8. Try every one with pen and paper before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POLYNOMIAL</div><div class="example-body"><strong>Compute</strong> $\\int (4x^3 - 3x^2 + 2x - 5)\\,dx$.<br><br>
<em>Solution:</em> term-by-term, $x^4 - x^3 + x^2 - 5x + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — SIMPLE RATIONAL</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{1}{x - 7}\\,dx$.<br><br>
<em>Solution:</em> $\\ln|x - 7| + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — NEGATIVE POWER</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{3}{x^4}\\,dx$.<br><br>
<em>Solution:</em> rewrite as $3x^{-4}$, then $\\frac{3x^{-3}}{-3} = -\\frac{1}{x^3} + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — RADICAL</div><div class="example-body"><strong>Compute</strong> $\\int \\sqrt[4]{x^3}\\,dx$.<br><br>
<em>Solution:</em> $\\sqrt[4]{x^3} = x^{3/4}$, so $\\frac{x^{7/4}}{7/4} = \\frac{4}{7}x^{7/4} + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — SPLIT A FRACTION</div><div class="example-body"><strong>Compute</strong> $\\int \\dfrac{x^3 + 2x}{x}\\,dx$.<br><br>
<em>Solution:</em> split into $x^2 + 2$; integrate to $\\frac{x^3}{3} + 2x + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — DOUBLE ANGLE</div><div class="example-body"><strong>Compute</strong> $\\int 2\\sin^2 x\\,dx$.<br><br>
<em>Solution:</em> $2\\sin^2 x = 1 - \\cos 2x$. Integrate: $x - \\frac{\\sin 2x}{2} + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — TANGENT SQUARED</div><div class="example-body"><strong>Compute</strong> $\\int (1 + \\tan^2 x)\\,dx$.<br><br>
<em>Solution:</em> recognise $1 + \\tan^2 x = \\sec^2 x$; integrate to $\\tan x + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — BASE EXPONENTIAL</div><div class="example-body"><strong>Compute</strong> $\\int 5^x\\,dx$.<br><br>
<em>Solution:</em> $\\frac{5^x}{\\ln 5} + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 9 — EXPAND THEN INTEGRATE</div><div class="example-body"><strong>Compute</strong> $\\int (x + 1)^2\\,dx$.<br><br>
<em>Solution:</em> expand to $x^2 + 2x + 1$. Integrate: $\\frac{x^3}{3} + x^2 + x + C$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 10 — MIXED</div><div class="example-body"><strong>Compute</strong> $\\int \\!\\left(e^x + \\dfrac{1}{x} + \\sin x\\right)\\,dx$.<br><br>
<em>Solution:</em> three table entries, one each: $e^x + \\ln|x| - \\cos x + C$.</div></div>

<div class="think-box"><div class="think-label">CLOSING REVIEW</div><div class="think-body">Every problem in this lesson reduces to "rewrite the integrand until you can read off the answer from the standard table." The four manipulation moves you must own are: <strong>expand products</strong>, <strong>split fractions by monomial denominators</strong>, <strong>rewrite roots as fractional powers</strong>, and <strong>replace squared trig functions using identities</strong>. Add the constant $+ C$ on every indefinite integral. The next lesson upgrades these techniques with $u$-substitution.</div></div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İntegrasyon, türevin tersidir.</strong> Bir önceki derste ters türevi ve belirsiz integral sembolü $\\int f(x)\\,dx$'i tanımladık. Tek bir gerçek öğrendik: eğer $F'(x) = f(x)$ ise $\\int f(x)\\,dx = F(x) + C$. Bu tek başına ders kitabındaki birkaç örneğin ötesinde bir şey integre etmeye yetmiyor. Ödevde, sınavda ve üniversiteye giriş sorularında gerçek integral hesaplamak için küçük bir <em>standart formül</em> kütüphanesine ve tanıdık olmayan integrandı listede zaten bulunan bir şeye çeviren bir avuç <em>cebirsel hileye</em> ihtiyacın var.</p>

<p class="l-text">Bu ders işte o kütüphaneyi ve o alet kutusunu kuruyor. On iki temel integrali ezberleyeceğiz — kuvvet, üstel, logaritmik, altı trigonometrik — ve her birini cevabın türevini alarak kanıtlayacağız. Sonra en yaygın dört <em>manipülasyon tekniğini</em> uygulayacağız: polinomu terim terim integre etme, payı uzun bölme yaparak kesir ayırma, trigonometrik kareleri çift-açı özdeşliği ile yeniden yazma ve $\\tan^2 x$'i $\\sec^2 x - 1$'e çevirme. Sondaki on alıştırma her şeyi birbirine bağlayacak.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>On iki temel integral formülünü hatırlamak ve her birini türev alarak doğrulamak</li>
<li>Herhangi bir polinomu kuvvet kuralı ile terim terim integre etmek</li>
<li>$\\int \\frac{1}{x-a}\\,dx$ ve $\\int \\frac{1}{x^2}\\,dx$ gibi basit rasyonel integrandları hesaplamak</li>
<li>$\\sqrt{x}$ ve $\\frac{1}{\\sqrt{x}}$ köklü ifadeleri kuvvet olarak yeniden yazarak integre etmek</li>
<li>Polinom payı monomial paydaya bölünmüş kesri ayrı integre edilebilir parçalara ayırmak</li>
<li>$\\sin^2 x = \\frac{1-\\cos 2x}{2}$, $\\cos^2 x = \\frac{1+\\cos 2x}{2}$, $\\tan^2 x = \\sec^2 x - 1$ özdeşliklerini kullanmak</li>
<li>$a > 0,\\, a \\neq 1$ için $\\int a^x\\,dx = \\frac{a^x}{\\ln a} + C$ hesaplamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Standart İntegral Tablosu</h2>

<div class="calc-highlight"><strong>Günlük benzetme:</strong> bir aşçı her sosu sıfırdan icat etmez — küçük bir temel sos seti vardır (béchamel, velouté, espagnole, ...) ve her gösterişli yemek bunlardan birinin varyasyonudur. İntegrasyon da öyle. On iki ana formül var. Onlara hâkim ol, Türk lise sınavındaki neredeyse her integral o on ikiden birinin kılık değiştirmiş hâlidir.</div>

<p class="l-text">Aşağıdaki formüller <em>türev tablosunu tersten okumaktan</em> doğar. Eğer $\\frac{d}{dx}[\\sin x] = \\cos x$ olduğunu biliyorsak, ters türev tanımı gereği $\\int \\cos x\\,dx = \\sin x + C$ olur. Tablodaki her formül aynı şekilde doğrulanır: sağ tarafın türevini al ve integrandı geri elde ettiğini kontrol et. O kısa kontrol her satırın üçüncü sütununda gösterilmiştir ve ihtiyacın olan tek "ispat" odur.</p>

<div class="calc-formula"><div class="formula-label">ON İKİ TEMEL İNTEGRAL</div><div class="formula-main">
<div style="text-align:left;font-size:0.95em;line-height:1.85">
<strong>1.</strong> $\\;\\int k\\,dx = kx + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[kx] = k$ ✓)</em><br>
<strong>2.</strong> $\\;\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C,\\;\\; n \\neq -1$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}\\!\\left[\\frac{x^{n+1}}{n+1}\\right] = \\frac{(n+1)x^n}{n+1} = x^n$ ✓)</em><br>
<strong>3.</strong> $\\;\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[\\ln|x|] = \\frac{1}{x}$ ✓)</em><br>
<strong>4.</strong> $\\;\\int e^x\\,dx = e^x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[e^x] = e^x$ ✓)</em><br>
<strong>5.</strong> $\\;\\int a^x\\,dx = \\dfrac{a^x}{\\ln a} + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}\\!\\left[\\frac{a^x}{\\ln a}\\right] = \\frac{a^x \\ln a}{\\ln a} = a^x$ ✓)</em><br>
<strong>6.</strong> $\\;\\int \\cos x\\,dx = \\sin x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[\\sin x] = \\cos x$ ✓)</em><br>
<strong>7.</strong> $\\;\\int \\sin x\\,dx = -\\cos x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[-\\cos x] = \\sin x$ ✓)</em><br>
<strong>8.</strong> $\\;\\int \\sec^2 x\\,dx = \\tan x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[\\tan x] = \\sec^2 x$ ✓)</em><br>
<strong>9.</strong> $\\;\\int \\csc^2 x\\,dx = -\\cot x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[-\\cot x] = \\csc^2 x$ ✓)</em><br>
<strong>10.</strong> $\\;\\int \\sec x \\tan x\\,dx = \\sec x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[\\sec x] = \\sec x \\tan x$ ✓)</em><br>
<strong>11.</strong> $\\;\\int \\csc x \\cot x\\,dx = -\\csc x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[-\\csc x] = \\csc x \\cot x$ ✓)</em><br>
<strong>12.</strong> $\\;\\int \\dfrac{1}{1+x^2}\\,dx = \\arctan x + C$ &nbsp;&nbsp;<em>(kontrol: $\\frac{d}{dx}[\\arctan x] = \\frac{1}{1+x^2}$ ✓)</em>
</div>
</div><div class="formula-sub">Her formülün sonunda $+ C$ var çünkü türev sabiti yok ediyor. Sol sütunu ezberle; sağ sütunu istediğin zaman türev alarak yeniden kurabilirsin.</div></div>

<p class="l-text"><strong>Bu dersteki her örneğin altında iki vazgeçilmez doğrusallık kuralı</strong> yatıyor:</p>

<div class="calc-formula"><div class="formula-label">İNTEGRALİN DOĞRUSALLIĞI</div><div class="formula-main">$$\\int \\bigl[f(x) + g(x)\\bigr]\\,dx = \\int f(x)\\,dx + \\int g(x)\\,dx, \\qquad \\int k\\,f(x)\\,dx = k\\int f(x)\\,dx$$</div><div class="formula-sub">Toplam, terim terim integre edilir. Sabit çarpan integralin dışına çıkarılır. Dersin geri kalanı esasen "integrandı tablo girdilerinin toplamı olarak yeniden yaz" işidir.</div></div>

<div class="think-box"><div class="think-label">FORMÜL 2'DE NEDEN $n \\neq -1$?</div><div class="think-body">Kuvvet kuralını $n = -1$ ile uygula: $\\frac{x^{-1+1}}{-1+1} = \\frac{x^0}{0} = \\frac{1}{0}$ çıkar, tanımsız. Formül 3 tam bu durumu kurtarır — $n = -1$ olduğunda cevap bir kuvvet değil, $\\ln|x|$ olur.</div></div>

<div style="margin:1.5rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;background:rgba(15,18,25,0.55);color:#ebe6dc;font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead>
<tr style="background:#3b82f6;color:#ffffff;text-align:left">
<th style="padding:0.7rem 1rem;font-weight:700;letter-spacing:0.04em">İntegrand $f(x)$</th>
<th style="padding:0.7rem 1rem;font-weight:700;letter-spacing:0.04em">Ters türev $\\int f(x)\\,dx$</th>
<th style="padding:0.7rem 1rem;font-weight:700;letter-spacing:0.04em">Koşul</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$x^n$</td><td style="padding:0.55rem 1rem">$\\dfrac{x^{n+1}}{n+1} + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$n \\neq -1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$\\dfrac{1}{x}$</td><td style="padding:0.55rem 1rem">$\\ln|x| + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$x \\neq 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$\\sin x$</td><td style="padding:0.55rem 1rem">$-\\cos x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">tüm $x$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$\\cos x$</td><td style="padding:0.55rem 1rem">$\\sin x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">tüm $x$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$e^x$</td><td style="padding:0.55rem 1rem">$e^x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">tüm $x$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$a^x$</td><td style="padding:0.55rem 1rem">$\\dfrac{a^x}{\\ln a} + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$a > 0,\\, a \\neq 1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.07)"><td style="padding:0.55rem 1rem">$\\sec^2 x$</td><td style="padding:0.55rem 1rem">$\\tan x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">$x \\neq \\frac{\\pi}{2} + k\\pi$</td></tr>
<tr style="background:rgba(255,255,255,0.02)"><td style="padding:0.55rem 1rem">$\\dfrac{1}{1+x^2}$</td><td style="padding:0.55rem 1rem">$\\arctan x + C$</td><td style="padding:0.55rem 1rem;color:rgba(235,230,220,0.7)">tüm $x$</td></tr>
</tbody>
</table>
<div style="font-size:0.82rem;color:rgba(235,230,220,0.6);margin-top:0.5rem;text-align:center"><em>Hızlı başvuru: lise sınavlarındaki integrallerin ~%90'ını kapsayan sekiz formül. Sona her zaman $+ C$ ekle.</em></div>
</div>

<h2 class="lesson-title">2. Polinom İntegrasyonu</h2>

<p class="l-text">Polinom, $a_k x^k$ biçimindeki terimlerin sonlu toplamıdır. Doğrusallık sayesinde polinomu integre etmek, her terimi formül 2 ile ayrı integre edip toplamak demektir. On iki örnek yaptıktan sonra bunu otomatik yapacaksın.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — İKİNCİ DERECEDEN</div><div class="example-body"><strong>Hesapla:</strong> $\\int (3x^2 - 4x + 7)\\,dx$.<br><br>
Doğrusallıkla üç parçaya ayır:<br><br>
$\\int 3x^2\\,dx - \\int 4x\\,dx + \\int 7\\,dx$<br><br>
Her birine formül 2'yi uygula: $\\frac{3x^3}{3} - \\frac{4x^2}{2} + 7x = x^3 - 2x^2 + 7x$.<br><br>
<strong>Cevap:</strong> $\\int (3x^2 - 4x + 7)\\,dx = x^3 - 2x^2 + 7x + C$.<br><br>
<em>Kontrol:</em> $\\frac{d}{dx}[x^3 - 2x^2 + 7x + C] = 3x^2 - 4x + 7$ ✓</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — DAHA UZUN POLİNOM</div><div class="example-body"><strong>Hesapla:</strong> $\\int (5x^4 - 6x^3 + 2x^2 - x + 9)\\,dx$.<br><br>
Terim terim: $\\frac{5x^5}{5} - \\frac{6x^4}{4} + \\frac{2x^3}{3} - \\frac{x^2}{2} + 9x$.<br><br>
Sadeleştir: $x^5 - \\dfrac{3x^4}{2} + \\dfrac{2x^3}{3} - \\dfrac{x^2}{2} + 9x + C$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — ÖNCE AÇ</div><div class="example-body"><strong>Hesapla:</strong> $\\int (2x + 1)(x - 3)\\,dx$.<br><br>
İntegrand bir çarpım — ama aslında kılık değiştirmiş sıradan bir polinom. Aç: $(2x+1)(x-3) = 2x^2 - 6x + x - 3 = 2x^2 - 5x - 3$.<br><br>
Şimdi terim terim integre et: $\\dfrac{2x^3}{3} - \\dfrac{5x^2}{2} - 3x + C$.<br><br>
<em>Kural:</em> integralin içinde polinom çarpımı görürsen, <strong>integre etmeden önce aç</strong>. Bu seviyede "integral için çarpım kuralı" diye bir şey yoktur.</div></div>

<!-- Grafik: polinom ve onun ters türevi -->
<div id="plot-poly-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var f=[];var F=[];
for(var i=-200;i<=200;i++){var x=i/50;xs.push(x);f.push(3*x*x-4*x+7);F.push(x*x*x-2*x*x+7*x);}
var t1={x:xs,y:f,mode:"lines",name:"f(x) = 3x² − 4x + 7",line:{color:"#c8a96e",width:2.5}};
var t2={x:xs,y:F,mode:"lines",name:"F(x) = x³ − 2x² + 7x",line:{color:"#60a5fa",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-poly-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},100)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlamı:</strong> ikinci dereceden $f(x) = 3x^2 - 4x + 7$ (altın) eğrisi, ters türevi $F(x) = x^3 - 2x^2 + 7x$ (mavi) eğrisinin eğimidir. $f$ yüksek olduğu yerde $F$ dik yükselir; $f$ küçük olduğu yerde $F$ yavaş yükselir. $n$. dereceden bir polinomun integrali her zaman $n+1$. dereceden bir polinom verir.</div></div>

<!-- Grafik: farklı C değerleri için ters türev ailesi -->
<div id="plot-family-tr-extra1" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];for(var i=-200;i<=200;i++){xs.push(i/80);}
var traces=[];
var Cs=[-2,-1,0,1,2];
var palette=["#3b82f6","#60a5fa","#93c5fd","#bfdbfe","#dbeafe"];
for(var k=0;k<Cs.length;k++){
  var ys=xs.map(function(x){return x*x*x/3+Cs[k];});
  traces.push({x:xs,y:ys,mode:"lines",name:"F(x) = x³/3 + ("+Cs[k]+")",line:{color:palette[k],width:2.3}});
}
var fx=xs.map(function(x){return x*x;});
traces.push({x:xs,y:fx,mode:"lines",name:"f(x) = x²  (her F'nin eğimi)",line:{color:"#c8a96e",width:2.8,dash:"dot"}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[-4,4]},margin:{t:30,r:30,b:60,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-family-tr-extra1",traces,layout,{responsive:true,displayModeBar:false});
},150)</script>

<div class="calc-graph"><div class="graph-caption"><strong>"$+ C$" görüntüsü:</strong> yukarıdaki her mavi eğrinin türevi aynıdır: $f(x) = x^2$ (altın kesik çizgi). Aralarındaki tek fark dikey kaymadır — yani sabit $C$. İşte bu yüzden belirsiz integral $\\int x^2\\,dx = \\dfrac{x^3}{3} + C$ tek bir eğri değil, eğri <em>ailesidir</em>. $C$ değerini seçmek, ailedeki hangi eğrinin başlangıç koşulunuzdan geçtiğini seçmek demektir.</div></div>

<!-- Grafik: x^2 ve altındaki taranmış alan = ters türev birikiyor -->
<div id="plot-area-tr-extra2" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];for(var i=0;i<=200;i++){xs.push(i/100);}
var fx=xs.map(function(x){return x*x;});
var Fx=xs.map(function(x){return x*x*x/3;});
var shadeX=xs.slice();shadeX.push(2,0);
var shadeY=fx.slice();shadeY.push(0,0);
var tShade={x:shadeX,y:shadeY,fill:"toself",fillcolor:"rgba(59,130,246,0.18)",line:{color:"rgba(0,0,0,0)"},mode:"lines",name:"f(x)=x² altındaki alan (0'dan x'e)",hoverinfo:"skip",showlegend:true};
var tf={x:xs,y:fx,mode:"lines",name:"f(x) = x²",line:{color:"#c8a96e",width:2.8}};
var tF={x:xs,y:Fx,mode:"lines",name:"F(x) = x³/3  (biriken alan)",line:{color:"#3b82f6",width:2.8}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[0,2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y",range:[0,4.5]},margin:{t:30,r:30,b:60,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
Plotly.newPlot("plot-area-tr-extra2",[tShade,tf,tF],layout,{responsive:true,displayModeBar:false});
},200)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Biriken alan olarak ters türev:</strong> taranmış bölge, $f(x) = x^2$ altında $0$'dan o anki $x$'e kadar olan alandır. $x$ büyüdükçe bu alan da büyür — ve her $x$'teki değeri tam olarak $F(x) = \\dfrac{x^3}{3}$, yani mavi eğridir. $\\int x^2\\,dx = \\dfrac{x^3}{3} + C$ formülünün ardındaki geometrik neden budur: integrasyon biriken alanı <em>ölçer</em>, sabit $C$ ise sadece başlangıç hizasını seçer.</div></div>

<h2 class="lesson-title">3. Basit Rasyonel Fonksiyonlar</h2>

<p class="l-text"><strong>Rasyonel fonksiyon</strong>, iki polinomun bölümüdür. Tam basit kesirlere ayırma bir üniversite konusudur ama Türk lisesi iki çok yaygın basit durumu kapsar. İkisi de tablonun 2 ve 3 numaralı formüllerinden doğrudan gelir.</p>

<div class="calc-formula"><div class="formula-label">İKİ RASYONEL ŞABLON</div><div class="formula-main">$$\\int \\dfrac{1}{x - a}\\,dx \\;=\\; \\ln|x - a| + C, \\qquad \\int \\dfrac{1}{x^n}\\,dx \\;=\\; \\dfrac{x^{1-n}}{1-n} + C \\quad (n \\neq 1)$$</div><div class="formula-sub">Birincisi formül 3'ün yatay ötelemesidir ($u = x - a$, $du = dx$). İkincisi formül 2'nin negatif üs ile uygulanmış hâlidir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — DOĞRUSAL ÇARPANIN TERSİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{1}{x - 5}\\,dx$.<br><br>
Birinci şablonu doğrudan uygula: $\\ln|x - 5| + C$.<br><br>
<em>Kontrol:</em> $\\frac{d}{dx}[\\ln|x - 5|] = \\frac{1}{x - 5}$ ✓ (iç türev $1$ olduğu için zincir kuralı sade çalışır.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — NEGATİF ÜSLÜ KUVVET</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{1}{x^2}\\,dx$.<br><br>
İntegrandı kuvvet olarak yaz: $\\frac{1}{x^2} = x^{-2}$.<br><br>
Formül 2'yi $n = -2$ ile uygula: $\\dfrac{x^{-2+1}}{-2+1} = \\dfrac{x^{-1}}{-1} = -\\dfrac{1}{x}$.<br><br>
<strong>Cevap:</strong> $\\int \\dfrac{1}{x^2}\\,dx = -\\dfrac{1}{x} + C$.<br><br>
<em>Kontrol:</em> $\\frac{d}{dx}\\!\\left[-\\frac{1}{x}\\right] = \\frac{d}{dx}[-x^{-1}] = x^{-2} = \\frac{1}{x^2}$ ✓</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 6 — DAHA YÜKSEK NEGATİF KUVVET</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{1}{x^3}\\,dx$.<br><br>
$x^{-3}$ olarak yaz ve formül 2'yi uygula: $\\dfrac{x^{-2}}{-2} = -\\dfrac{1}{2x^2}$.<br><br>
<strong>Cevap:</strong> $-\\dfrac{1}{2x^2} + C$.</div></div>

<div class="think-box"><div class="think-label">İŞARET TUZAĞI</div><div class="think-body">$\\int x^{-2}\\,dx$ hesabında sık yapılan hata $n+1 = -1$'e bölmekten gelen "eksi işaretini unutmak"tır. Adımları her zaman yaz: $\\frac{x^{n+1}}{n+1}$ ifadesine $n = -2$ koy, $\\frac{x^{-1}}{-1}$ çıkar, sonra $-x^{-1} = -\\frac{1}{x}$ olarak oku. Adım atlamak işareti kaybettirir.</div></div>

<h2 class="lesson-title">4. Köklü Fonksiyonlar</h2>

<p class="l-text">$\\sqrt{x}$ için ayrı bir formül yoktur — o sadece $x^{1/2}$, yani bir kuvvettir, yani formül 2'ye girer. Bütün strateji şudur: <strong>her kökü kesirli üs olarak yeniden yaz</strong>, sonra kuvvet kuralını uygula.</p>

<div class="calc-formula"><div class="formula-label">KÖKLER KESİRLİ ÜSLERDİR</div><div class="formula-main">$$\\sqrt{x} = x^{1/2}, \\quad \\sqrt[n]{x} = x^{1/n}, \\quad \\dfrac{1}{\\sqrt{x}} = x^{-1/2}, \\quad \\sqrt{x^3} = x^{3/2}$$</div><div class="formula-sub">Bir kez kuvvet hâline gelince formül 2 işi bitirir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 7 — KAREKÖK</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\sqrt{x}\\,dx$.<br><br>
Yeniden yaz: $\\sqrt{x} = x^{1/2}$. Formül 2'yi $n = 1/2$ ile uygula:<br><br>
$\\dfrac{x^{1/2 + 1}}{1/2 + 1} = \\dfrac{x^{3/2}}{3/2} = \\dfrac{2}{3}\\,x^{3/2} = \\dfrac{2}{3}\\sqrt{x^3} = \\dfrac{2x\\sqrt{x}}{3}$.<br><br>
<strong>Cevap:</strong> $\\int \\sqrt{x}\\,dx = \\dfrac{2x\\sqrt{x}}{3} + C$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 8 — KÖKÜN TERSİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{1}{\\sqrt{x}}\\,dx$.<br><br>
Yeniden yaz: $\\frac{1}{\\sqrt{x}} = x^{-1/2}$. Formül 2'yi uygula:<br><br>
$\\dfrac{x^{-1/2 + 1}}{-1/2 + 1} = \\dfrac{x^{1/2}}{1/2} = 2x^{1/2} = 2\\sqrt{x}$.<br><br>
<strong>Cevap:</strong> $\\int \\dfrac{1}{\\sqrt{x}}\\,dx = 2\\sqrt{x} + C$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 9 — KÜP KÖK</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\sqrt[3]{x^2}\\,dx$.<br><br>
Yeniden yaz: $\\sqrt[3]{x^2} = x^{2/3}$. Formül 2'yi uygula:<br><br>
$\\dfrac{x^{2/3 + 1}}{2/3 + 1} = \\dfrac{x^{5/3}}{5/3} = \\dfrac{3}{5}\\,x^{5/3}$.<br><br>
<strong>Cevap:</strong> $\\dfrac{3}{5}\\,x^{5/3} + C = \\dfrac{3\\sqrt[3]{x^5}}{5} + C$.</div></div>

<h2 class="lesson-title">5. İntegre Etmeden Önce Kesir Ayırma</h2>

<div class="calc-highlight"><strong>Hile:</strong> eğer pay, paydanın derecesine en az eşit dereceli bir polinom ise, integre etmeden önce <em>bölmeyi yap</em>. Basit terimlerin toplamının integralı kolaydır; yazıldığı hâliyle bir bölümün integralı genelde değildir.</div>

<p class="l-text">İntegral için bölüm kuralı yoktur — bu yüzden $\\int \\frac{x^2 + 3x + 2}{x}\\,dx$ gibi bir bölüm ilk bakışta sıkıntılı görünür. Çözüm tamamen cebirseldir: paydası $x$ olan tek kesri üç kesre ayır ve her birini sadeleştir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 10 — MONOMİAL PAYDA İLE AYIRMA</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{x^2 + 3x + 2}{x}\\,dx$.<br><br>
Terim terim ayır: $\\dfrac{x^2 + 3x + 2}{x} = \\dfrac{x^2}{x} + \\dfrac{3x}{x} + \\dfrac{2}{x} = x + 3 + \\dfrac{2}{x}$.<br><br>
Şimdi toplamı integre et:<br><br>
$\\int x\\,dx + \\int 3\\,dx + \\int \\dfrac{2}{x}\\,dx = \\dfrac{x^2}{2} + 3x + 2\\ln|x|$.<br><br>
<strong>Cevap:</strong> $\\int \\dfrac{x^2 + 3x + 2}{x}\\,dx = \\dfrac{x^2}{2} + 3x + 2\\ln|x| + C$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 11 — DAHA YÜKSEK DERECELİ PAY</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{x^3 - 2x^2 + 5}{x^2}\\,dx$.<br><br>
Ayır: $\\dfrac{x^3 - 2x^2 + 5}{x^2} = \\dfrac{x^3}{x^2} - \\dfrac{2x^2}{x^2} + \\dfrac{5}{x^2} = x - 2 + 5x^{-2}$.<br><br>
Terim terim integre et:<br><br>
$\\dfrac{x^2}{2} - 2x + 5 \\cdot \\dfrac{x^{-1}}{-1} = \\dfrac{x^2}{2} - 2x - \\dfrac{5}{x}$.<br><br>
<strong>Cevap:</strong> $\\dfrac{x^2}{2} - 2x - \\dfrac{5}{x} + C$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 12 — PAYDA KÖK</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{\\sqrt{x} + 1}{x}\\,dx$.<br><br>
Ayır: $\\dfrac{\\sqrt{x} + 1}{x} = \\dfrac{\\sqrt{x}}{x} + \\dfrac{1}{x} = x^{-1/2} + \\dfrac{1}{x}$.<br><br>
İntegre et: $\\dfrac{x^{1/2}}{1/2} + \\ln|x| = 2\\sqrt{x} + \\ln|x|$.<br><br>
<strong>Cevap:</strong> $2\\sqrt{x} + \\ln|x| + C$.</div></div>

<div class="think-box"><div class="think-label">ALTIN KURAL</div><div class="think-body">İntegralin içinde bir kesir görünce <strong>önce</strong> şunu sor: "Bunu basit parçaların toplamına ayırabilir miyim?" Eğer payda tek monomial $x^n$ ise cevap her zaman evettir. Ancak ayırdıktan sonra integral formüllerine uzanırsın.</div></div>

<h2 class="lesson-title">6. Trigonometrik Manipülasyon: Sinüs ve Kosinüs Kareleri</h2>

<p class="l-text">$\\int \\sin^2 x\\,dx$ ve $\\int \\cos^2 x\\,dx$ integralleri standart tabloda <em>yok</em>. Neden? Çünkü $\\sin^2 x$ tanıdık herhangi bir trigonometrik fonksiyonun türevi değil. Hile, 14. dersteki <strong>çift-açı özdeşliklerini</strong> kullanarak kareyi $\\cos 2x$'in doğrusal bir fonksiyonu olarak yeniden yazmaktır; $\\cos 2x$ ise tabloda <em>var</em>.</p>

<div class="calc-formula"><div class="formula-label">KUVVET DÜŞÜRME ÖZDEŞLİKLERİ</div><div class="formula-main">$$\\sin^2 x = \\dfrac{1 - \\cos 2x}{2}, \\qquad \\cos^2 x = \\dfrac{1 + \\cos 2x}{2}$$</div><div class="formula-sub">$\\cos 2x = 1 - 2\\sin^2 x$'i $\\sin^2 x$ için çözerek ve $\\cos 2x = 2\\cos^2 x - 1$'i $\\cos^2 x$ için çözerek bulunur.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 13 — $\\sin^2 x$ İNTEGRALİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\sin^2 x\\,dx$.<br><br>
Özdeşliği uygula: $\\sin^2 x = \\dfrac{1 - \\cos 2x}{2} = \\dfrac{1}{2} - \\dfrac{1}{2}\\cos 2x$.<br><br>
Terim terim integre et:<br><br>
$\\int \\dfrac{1}{2}\\,dx - \\int \\dfrac{1}{2}\\cos 2x\\,dx = \\dfrac{x}{2} - \\dfrac{1}{2} \\cdot \\dfrac{\\sin 2x}{2} = \\dfrac{x}{2} - \\dfrac{\\sin 2x}{4}$.<br><br>
<strong>Cevap:</strong> $\\int \\sin^2 x\\,dx = \\dfrac{x}{2} - \\dfrac{\\sin 2x}{4} + C$.<br><br>
<em>Not:</em> $\\int \\cos 2x\\,dx = \\frac{\\sin 2x}{2}$ çünkü $2x$'in iç türevi $2$'dir ve bölünmesi gerekir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 14 — $\\cos^2 x$ İNTEGRALİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\cos^2 x\\,dx$.<br><br>
Özdeşlik: $\\cos^2 x = \\dfrac{1 + \\cos 2x}{2} = \\dfrac{1}{2} + \\dfrac{1}{2}\\cos 2x$.<br><br>
İntegre et: $\\dfrac{x}{2} + \\dfrac{\\sin 2x}{4} + C$.<br><br>
<em>Tutarlılık kontrolü:</em> $\\sin^2 x + \\cos^2 x = 1$ olduğundan integrallerinin toplamı $x + C$ olmalı:<br>
$\\bigl(\\frac{x}{2} - \\frac{\\sin 2x}{4}\\bigr) + \\bigl(\\frac{x}{2} + \\frac{\\sin 2x}{4}\\bigr) = x$ ✓</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 15 — KARELER FARKI</div><div class="example-body"><strong>Hesapla:</strong> $\\int (\\cos^2 x - \\sin^2 x)\\,dx$.<br><br>
Çift-açı özdeşliğini tersten tanı: $\\cos^2 x - \\sin^2 x = \\cos 2x$.<br><br>
Yani $\\int (\\cos^2 x - \\sin^2 x)\\,dx = \\int \\cos 2x\\,dx = \\dfrac{\\sin 2x}{2} + C$.<br><br>
<em>Ders:</em> hesap yapmadan önce her zaman integrandı <strong>basitleştiren</strong> bir özdeşlik ara.</div></div>

<h2 class="lesson-title">7. $\\tan^2 x$ ve $\\sec^2 x$ Hilesi</h2>

<p class="l-text">$\\tan^2 x$ için doğrudan integral formülü yoktur. $\\sec^2 x$ için <em>vardır</em> — standart tablonun 8. girdisidir. O yüzden Pisagor özdeşliğini kullanarak birini diğerine çeviririz.</p>

<div class="calc-formula"><div class="formula-label">PİSAGOR SONUCU</div><div class="formula-main">$$1 + \\tan^2 x = \\sec^2 x \\;\\;\\implies\\;\\; \\tan^2 x = \\sec^2 x - 1$$</div><div class="formula-sub">$\\sin^2 x + \\cos^2 x = 1$'in iki tarafını $\\cos^2 x$'e bölerek elde edilir. Tam olarak $\\sec^2 x$'in $\\tan x$'e integre olduğu için işe yarar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 16 — $\\tan^2 x$ İNTEGRALİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\tan^2 x\\,dx$.<br><br>
Yeniden yaz: $\\tan^2 x = \\sec^2 x - 1$.<br><br>
Terim terim integre et:<br><br>
$\\int \\sec^2 x\\,dx - \\int 1\\,dx = \\tan x - x$.<br><br>
<strong>Cevap:</strong> $\\int \\tan^2 x\\,dx = \\tan x - x + C$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 17 — $\\cot^2 x$ İNTEGRALİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\cot^2 x\\,dx$.<br><br>
Eş özdeşlik ($\\sin^2 + \\cos^2 = 1$'i $\\sin^2 x$'e böl): $1 + \\cot^2 x = \\csc^2 x$, dolayısıyla $\\cot^2 x = \\csc^2 x - 1$.<br><br>
İntegre et: $-\\cot x - x + C$.</div></div>

<div class="think-box"><div class="think-label">DESEN</div><div class="think-body">İntegralin içinde karesi alınmış bir trigonometrik fonksiyon görürsen, kaçmak için neredeyse her zaman bir özdeşliğe ihtiyaç duyarsın. Tarif:<br>
&bull; $\\sin^2$ veya $\\cos^2$ &rarr; $\\sin^2 = \\frac{1 - \\cos 2x}{2}$ veya $\\cos^2 = \\frac{1 + \\cos 2x}{2}$ kullan.<br>
&bull; $\\tan^2$ veya $\\cot^2$ &rarr; $\\tan^2 = \\sec^2 - 1$ veya $\\cot^2 = \\csc^2 - 1$ kullan.<br>
&bull; $\\sin x \\cos x$ gibi karışık çarpımlar &rarr; $\\sin 2x = 2 \\sin x \\cos x$ kullan.</div></div>

<h2 class="lesson-title">8. $e$ Dışındaki Üstel Tabanlar</h2>

<p class="l-text">Doğal üstel $e^x$ kendisine integre olur — formül 4. Diğer her pozitif $a$ tabanı için cevap ek bir $\\frac{1}{\\ln a}$ çarpanı taşır. Bu, tablonun 5. formülüdür.</p>

<div class="calc-formula"><div class="formula-label">GENEL ÜSTEL İNTEGRAL</div><div class="formula-main">$$\\int a^x\\,dx = \\dfrac{a^x}{\\ln a} + C, \\qquad a > 0,\\; a \\neq 1$$</div><div class="formula-sub">Özel durum: $a = e$ için $\\ln a = 1$ olduğundan $\\int e^x\\,dx = e^x + C$ tekrar elde edilir.</div></div>

<p class="l-text"><strong>$\\ln a$ nereden geliyor?</strong> $a^x = e^{x \\ln a}$ özdeşliğini kullanarak $a^x$'i yeniden yaz. Zincir kuralıyla $\\frac{d}{dx}[e^{x \\ln a}] = (\\ln a)\\, e^{x \\ln a} = (\\ln a)\\, a^x$. Bunu tersine çevir: $a^x$'i geri elde etmek için $\\ln a$'ya bölmelisin. İntegraldeki $\\frac{1}{\\ln a}$ tam olarak budur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 18 — 2 TABANI</div><div class="example-body"><strong>Hesapla:</strong> $\\int 2^x\\,dx$.<br><br>
Formül 5'i $a = 2$ ile uygula: $\\dfrac{2^x}{\\ln 2} + C$.<br><br>
<em>Sayısal kontrol:</em> $\\ln 2 \\approx 0.693$, yani cevap kabaca $1.44 \\cdot 2^x + C$. Türev alınınca $\\frac{(\\ln 2)\\, 2^x}{\\ln 2} = 2^x$ ✓.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 19 — 10 TABANI</div><div class="example-body"><strong>Hesapla:</strong> $\\int 10^x\\,dx$.<br><br>
$\\dfrac{10^x}{\\ln 10} + C$, burada $\\ln 10 \\approx 2.303$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 20 — KARIŞIK ÜSTEL</div><div class="example-body"><strong>Hesapla:</strong> $\\int (e^x + 3^x)\\,dx$.<br><br>
Doğrusallık: $\\int e^x\\,dx + \\int 3^x\\,dx = e^x + \\dfrac{3^x}{\\ln 3} + C$.</div></div>

<h2 class="lesson-title">9. On Klasik Alıştırma</h2>

<p class="l-text">Aşağıdaki her soru 2&ndash;8. bölümlerin tekniklerinden tam olarak birini kullanır. Çözümü okumadan önce her birini kâğıt-kalemle dene.</p>

<div class="calc-example"><div class="example-label">SORU 1 — POLİNOM</div><div class="example-body"><strong>Hesapla:</strong> $\\int (4x^3 - 3x^2 + 2x - 5)\\,dx$.<br><br>
<em>Çözüm:</em> terim terim, $x^4 - x^3 + x^2 - 5x + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 2 — BASİT RASYONEL</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{1}{x - 7}\\,dx$.<br><br>
<em>Çözüm:</em> $\\ln|x - 7| + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 3 — NEGATİF KUVVET</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{3}{x^4}\\,dx$.<br><br>
<em>Çözüm:</em> $3x^{-4}$ olarak yaz, sonra $\\frac{3x^{-3}}{-3} = -\\frac{1}{x^3} + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 4 — KÖKLÜ</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\sqrt[4]{x^3}\\,dx$.<br><br>
<em>Çözüm:</em> $\\sqrt[4]{x^3} = x^{3/4}$, yani $\\frac{x^{7/4}}{7/4} = \\frac{4}{7}x^{7/4} + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 5 — KESİR AYIR</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\dfrac{x^3 + 2x}{x}\\,dx$.<br><br>
<em>Çözüm:</em> $x^2 + 2$'ye ayır; integre et: $\\frac{x^3}{3} + 2x + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 6 — ÇİFT AÇI</div><div class="example-body"><strong>Hesapla:</strong> $\\int 2\\sin^2 x\\,dx$.<br><br>
<em>Çözüm:</em> $2\\sin^2 x = 1 - \\cos 2x$. İntegre et: $x - \\frac{\\sin 2x}{2} + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 7 — TANJANT KARESİ</div><div class="example-body"><strong>Hesapla:</strong> $\\int (1 + \\tan^2 x)\\,dx$.<br><br>
<em>Çözüm:</em> $1 + \\tan^2 x = \\sec^2 x$ olduğunu tanı; integre et: $\\tan x + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 8 — TABAN ÜSTEL</div><div class="example-body"><strong>Hesapla:</strong> $\\int 5^x\\,dx$.<br><br>
<em>Çözüm:</em> $\\frac{5^x}{\\ln 5} + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 9 — AÇ SONRA İNTEGRE ET</div><div class="example-body"><strong>Hesapla:</strong> $\\int (x + 1)^2\\,dx$.<br><br>
<em>Çözüm:</em> $x^2 + 2x + 1$'e aç. İntegre et: $\\frac{x^3}{3} + x^2 + x + C$.</div></div>

<div class="calc-example"><div class="example-label">SORU 10 — KARIŞIK</div><div class="example-body"><strong>Hesapla:</strong> $\\int \\!\\left(e^x + \\dfrac{1}{x} + \\sin x\\right)\\,dx$.<br><br>
<em>Çözüm:</em> her biri ayrı tablo girdisi: $e^x + \\ln|x| - \\cos x + C$.</div></div>

<div class="think-box"><div class="think-label">KAPANIŞ ÖZETİ</div><div class="think-body">Bu dersteki her problem "integrandı standart tablodan okuyabileceğin hâle gelene kadar yeniden yaz" işlemine indirgenir. Sahip olman gereken dört manipülasyon hamlesi: <strong>çarpımları aç</strong>, <strong>kesirleri monomial paydaya göre ayır</strong>, <strong>kökleri kesirli üs olarak yaz</strong> ve <strong>kareli trigonometrik fonksiyonları özdeşliklerle değiştir</strong>. Belirsiz integralin sonuna her zaman $+ C$ ekle. Bir sonraki ders bu teknikleri $u$-yerine koyma ile bir üst seviyeye taşır.</div></div>`
};
