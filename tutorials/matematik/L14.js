window.LISE_MAT_L14 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far in this curriculum we asked what happens to a function near a fixed point.</strong> In this lesson we change the question. We ask what happens <em>far away</em> — when x grows without bound, or shrinks toward minus infinity. The answers are not always finite numbers; sometimes the graph drifts up to a horizontal line, sometimes it shoots off to infinity along a vertical wall, and sometimes it tracks a tilted ruler called an oblique asymptote. Asymptotes are the long-range skeleton of a graph: once you know them, sketching the curve becomes mechanical.</p>

<p class="l-text">Rational functions, exponentials, logarithms, and many engineering models all live with asymptotes. The reactance of a capacitor blows up at zero frequency. The voltage across a charging capacitor approaches its source value but never quite reaches it. The Bode plot of a low-pass filter slides down a straight oblique line. Each of these is an asymptote in disguise. By the end of this lesson you will be able to find every horizontal, vertical, and oblique asymptote of any rational function in front of you and to sketch its full long-range behaviour by hand.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Evaluate limits at infinity for polynomial, rational, exponential and logarithmic functions</li>
<li>Read the dominant term of a polynomial and use it to predict end behaviour</li>
<li>Compare numerator and denominator degrees to find horizontal asymptotes of rational functions</li>
<li>Detect vertical asymptotes by locating points where the function blows up</li>
<li>Use polynomial long division to find oblique (slant) asymptotes</li>
<li>Sketch a rational function from its asymptotes, intercepts, and sign chart in four ordered steps</li>
</ul>
</div>

<h2 class="lesson-title">1. Limits at Infinity: What Does $x \\to \\infty$ Mean?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> stand on a long, straight road and start walking. The town behind you shrinks, and any tree along the way passes by at a fixed instant. But how high a hill is on the horizon — what altitude it eventually settles at — that is a question about the <em>long-run behaviour</em> of the road. Limits at infinity ask the same thing about a function. Where does the graph go when x marches off the right edge of the paper? Where does it go when x marches off the left edge?</div>

<p class="l-text">The symbol $\\lim_{x \\to \\infty} f(x) = L$ means: as x becomes arbitrarily large and positive, the value of f(x) becomes arbitrarily close to L. There is no specific large number we plug in; we just track the trend. Three outcomes are possible:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Finite limit</div><div class="card-body">f(x) settles toward a fixed number L. The graph flattens out toward the horizontal line y = L. Example: $\\lim_{x \\to \\infty} \\frac{1}{x} = 0$.</div></div>
<div class="calc-card"><div class="card-title">Infinite limit</div><div class="card-body">f(x) grows without bound. We write $\\lim f(x) = +\\infty$ or $-\\infty$. Example: $\\lim_{x \\to \\infty} x^{2} = +\\infty$.</div></div>
<div class="calc-card"><div class="card-title">No limit</div><div class="card-body">f(x) oscillates forever without settling. Example: $\\lim_{x \\to \\infty} \\sin x$ does not exist — the value bounces between $-1$ and $+1$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">FORMAL DEFINITION (read once, intuit forever)</div><div class="formula-main">$$\\lim_{x \\to \\infty} f(x) = L \\iff \\forall \\varepsilon > 0 \\;\\; \\exists M > 0 : x > M \\implies |f(x) - L| < \\varepsilon$$</div><div class="formula-sub">No matter how small a tolerance $\\varepsilon$ you demand around L, there is a cut-off M such that beyond x = M the graph never strays farther than $\\varepsilon$ from L.</div></div>

<p class="l-text">The same applies to $x \\to -\\infty$ — march to the left instead of the right. Some functions behave the same on both ends (even polynomials), some behave oppositely (odd polynomials), and some behave very differently on the two sides (exponentials).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Evaluate:</strong> $\\lim_{x \\to \\infty} \\dfrac{1}{x}$.<br><br>As x climbs to 10, 100, 1000, 10000, the reciprocal becomes 0.1, 0.01, 0.001, 0.0001. The values shrink and approach 0 from above. So $\\lim_{x \\to \\infty} \\dfrac{1}{x} = 0$.<br><br>The same reasoning gives $\\lim_{x \\to -\\infty} \\dfrac{1}{x} = 0$ — but now from below, with negative values.</div></div>

<h2 class="lesson-title">2. End Behaviour of Polynomials: The Dominant Term Wins</h2>

<div class="calc-highlight"><strong>For a polynomial $p(x) = a_{n} x^{n} + a_{n-1} x^{n-1} + \\dots + a_{0}$ the end behaviour is decided entirely by the leading term $a_{n} x^{n}$.</strong> As $|x|$ becomes huge, every lower power $x^{n-1}, x^{n-2}, \\dots$ is negligible compared to $x^{n}$, so $p(x)$ behaves like $a_{n} x^{n}$. This is the single most useful shortcut in the entire lesson.</div>

<p class="l-text">Two ingredients determine the end behaviour: the <strong>degree n</strong> (even or odd?) and the <strong>leading coefficient $a_{n}$</strong> (positive or negative?). The four possibilities are summarised in the table below.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Degree</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Leading coef.</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x \\to +\\infty$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x \\to -\\infty$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Picture</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">even</td><td style="padding:0.5rem 0.8rem">$a_{n} > 0$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">U-shape, both arms up</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">even</td><td style="padding:0.5rem 0.8rem">$a_{n} < 0$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">$\\cap$-shape, both arms down</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">odd</td><td style="padding:0.5rem 0.8rem">$a_{n} > 0$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">left-down, right-up (like $x^{3}$)</td></tr>
<tr><td style="padding:0.5rem 0.8rem">odd</td><td style="padding:0.5rem 0.8rem">$a_{n} < 0$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">left-up, right-down (like $-x^{3}$)</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to \\infty} (2x^{3} - 100x^{2} + 500x - 7)$.<br><br>The leading term is $2x^{3}$. For very large x, $100x^{2}$ is a million times smaller than $2x^{3}$, and the linear and constant terms are utterly invisible. So the polynomial behaves like $2x^{3}$, which goes to $+\\infty$ as $x \\to \\infty$.<br><br>Even though $-100x^{2}$ initially pulls the curve down (you can see a dip around $x \\approx 30$), the cubic eventually dominates and lifts the curve to $+\\infty$.</div></div>

<h2 class="lesson-title">3. Rational Functions at Infinity: Compare Degrees</h2>

<div class="calc-highlight"><strong>For a rational function $f(x) = \\dfrac{p(x)}{q(x)}$ the limit as $x \\to \\pm\\infty$ depends only on the degrees of p and q and on their leading coefficients.</strong> Divide every term in numerator and denominator by the highest power of x in the denominator. After that, every leftover term except the leading pair vanishes, and the limit drops out instantly.</div>

<p class="l-text">There are three cases. Let $n = \\deg p$ and $m = \\deg q$, with leading coefficients $a$ and $b$.</p>

<div class="calc-formula"><div class="formula-label">RATIONAL LIMIT AT INFINITY — THREE CASES</div><div class="formula-main">$$\\lim_{x \\to \\pm\\infty} \\frac{p(x)}{q(x)} = \\begin{cases} 0 & \\text{if } n < m \\\\[4pt] \\dfrac{a}{b} & \\text{if } n = m \\\\[4pt] \\pm\\infty & \\text{if } n > m \\end{cases}$$</div><div class="formula-sub">Lower degree on top → limit zero; equal degree → ratio of leading coefficients; higher degree on top → unbounded.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — top degree less than bottom</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to \\infty} \\dfrac{3x + 5}{x^{2} - 4}$.<br><br>Divide numerator and denominator by $x^{2}$ (the higher power):<br><br>$\\dfrac{\\dfrac{3}{x} + \\dfrac{5}{x^{2}}}{1 - \\dfrac{4}{x^{2}}} \\;\\xrightarrow{x \\to \\infty}\\; \\dfrac{0 + 0}{1 - 0} = 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — equal degrees</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to \\infty} \\dfrac{2x^{2} + 7x - 1}{x^{2} - 4}$.<br><br>Divide top and bottom by $x^{2}$:<br><br>$\\dfrac{2 + \\dfrac{7}{x} - \\dfrac{1}{x^{2}}}{1 - \\dfrac{4}{x^{2}}} \\;\\xrightarrow{x \\to \\infty}\\; \\dfrac{2 + 0 - 0}{1 - 0} = 2$.<br><br>The horizontal asymptote is $y = 2$, as the next plot will confirm.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — top degree greater</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to \\infty} \\dfrac{x^{3} - x}{2x + 1}$.<br><br>Divide top and bottom by $x$ (the lower power, just to see the trend):<br><br>$\\dfrac{x^{2} - 1}{2 + \\dfrac{1}{x}} \\;\\xrightarrow{x \\to \\infty}\\; \\dfrac{+\\infty}{2} = +\\infty$.<br><br>No horizontal asymptote; the function escapes to infinity.</div></div>

<h2 class="lesson-title">4. Exponentials and Logarithms: The Growth Hierarchy</h2>

<div class="calc-highlight"><strong>One inequality you must memorise:</strong> $\\ln x \\;\\ll\\; x^{p} \\;\\ll\\; a^{x}$ for $p > 0$ and $a > 1$, as $x \\to \\infty$. In words: <em>logarithms grow slower than any positive power, and exponentials beat every polynomial</em>. The symbol $\\ll$ means "is eventually much smaller than".</div>

<p class="l-text">This hierarchy is the foundation of how computer scientists rank algorithms (logarithmic time is faster than polynomial time, which is faster than exponential time) and how engineers know that exponential decay always eventually beats power-law decay. For limit problems it gives a quick reflex: when an exponential and a polynomial fight, the exponential always wins on the $+\\infty$ side.</p>

<div class="calc-formula"><div class="formula-label">KEY EXPONENTIAL AND LOGARITHMIC LIMITS</div><div class="formula-main">$$\\lim_{x \\to \\infty} e^{x} = +\\infty \\qquad \\lim_{x \\to -\\infty} e^{x} = 0 \\qquad \\lim_{x \\to \\infty} \\ln x = +\\infty \\qquad \\lim_{x \\to 0^{+}} \\ln x = -\\infty$$</div><div class="formula-sub">$e^{x}$ blows up to the right and vanishes to the left; $\\ln x$ slowly blows up to the right and shoots to $-\\infty$ as x approaches 0.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lim e^{x}/x^{n}$</div><div class="card-body">Equals $+\\infty$ for any fixed n. Exponential beats every polynomial.</div></div>
<div class="calc-card"><div class="card-title">$\\lim \\ln x / x^{p}$</div><div class="card-body">Equals 0 for any $p > 0$. The polynomial denominator outpaces the logarithm.</div></div>
<div class="calc-card"><div class="card-title">$\\lim (1 + 1/x)^{x}$</div><div class="card-body">Equals $e \\approx 2.71828$. This is the original definition of Euler's number due to Bernoulli.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Find</strong> $\\lim_{x \\to \\infty} \\dfrac{x^{10}}{e^{x}}$.<br><br>The numerator grows polynomially; the denominator grows exponentially. By the hierarchy $x^{10} \\ll e^{x}$ as $x \\to \\infty$. So the ratio shrinks toward zero. Answer: <strong>0</strong>.<br><br>Even with the polynomial cranked up to degree 10, exponential growth still wins. The plot below makes the rate difference visible.</div></div>

<h2 class="lesson-title">5. Horizontal Asymptotes</h2>

<div class="calc-highlight"><strong>Definition.</strong> A line $y = L$ is a <em>horizontal asymptote</em> of $f(x)$ if at least one of the following limits is the number L:<br>$\\lim_{x \\to +\\infty} f(x) = L$ &nbsp;or&nbsp; $\\lim_{x \\to -\\infty} f(x) = L$.<br>A function can have at most <strong>two</strong> horizontal asymptotes — one for each direction.</div>

<p class="l-text">In practice the two limits are usually equal (rational functions, even functions) so most graphs have a single horizontal line they hug on both ends. Exponentials are the standard exception: $e^{x}$ has horizontal asymptote $y = 0$ on the <em>left</em> side, but no horizontal asymptote on the right (it blows up).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rational, $n < m$</div><div class="card-body">Horizontal asymptote $y = 0$. The graph squashes onto the x-axis at both ends.</div></div>
<div class="calc-card"><div class="card-title">Rational, $n = m$</div><div class="card-body">Horizontal asymptote $y = a/b$, where a and b are the leading coefficients. The graph levels at that height.</div></div>
<div class="calc-card"><div class="card-title">Exponential $a e^{kx} + c$</div><div class="card-body">If $k > 0$: horizontal asymptote $y = c$ only on the left. If $k < 0$: horizontal asymptote $y = c$ only on the right.</div></div>
</div>

<div class="calc-graph"><div id="plot-l14-horizontal-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = (2x^{2}+1)/(x^{2}-4)$ together with its horizontal asymptote $y = 2$ (dashed) and its two vertical asymptotes $x = \\pm 2$ (vertical dashed lines). The graph hugs $y = 2$ on the left and the right, and shoots off to $\\pm\\infty$ near $x = \\pm 2$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fEN(x){return (2*x*x+1)/(x*x-4);}
function build(){
var seg=[];var step=0.02;
var ranges=[[-8,-2.05],[-1.95,1.95],[2.05,8]];
for(var r=0;r<ranges.length;r++){var xs=[];var ys=[];for(var x=ranges[r][0];x<=ranges[r][1];x+=step){xs.push(x);ys.push(fEN(x));}seg.push({x:xs,y:ys,mode:'lines',line:{color:'#3b82f6',width:2.5},showlegend:r===0,name:'f(x)'});}
return seg;
}
var traces=build();
traces.push({x:[-8,8],y:[2,2],mode:'lines',name:'y = 2 (horizontal)',line:{color:'#f59e0b',width:2,dash:'dash'}});
traces.push({x:[-2,-2],y:[-15,15],mode:'lines',name:'x = -2 (vertical)',line:{color:'#ef4444',width:1.5,dash:'dot'}});
traces.push({x:[2,2],y:[-15,15],mode:'lines',name:'x = +2 (vertical)',line:{color:'#ef4444',width:1.5,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-10,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-horizontal-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Notice:</strong> the graph of a function is allowed to <em>cross</em> a horizontal asymptote. The asymptote is about long-range behaviour, not a barrier the function may not touch. For instance $f(x) = \\sin(x)/x$ crosses $y = 0$ infinitely many times yet still has horizontal asymptote $y = 0$.</div>

<h2 class="lesson-title">6. Vertical Asymptotes</h2>

<div class="calc-highlight"><strong>Definition.</strong> A vertical line $x = a$ is a <em>vertical asymptote</em> of $f(x)$ if at least one of the one-sided limits as $x \\to a$ is $\\pm\\infty$. Vertical asymptotes typically occur where a denominator becomes zero but the numerator does not.</div>

<p class="l-text">Concretely, to find vertical asymptotes of a rational function $f = p/q$:</p>

<ol class="l-text" style="padding-left:1.4rem;line-height:1.7">
<li>Set the denominator equal to zero and solve: $q(x) = 0$.</li>
<li>For each root $a$, check whether $p(a) \\neq 0$. If yes, $x = a$ is a vertical asymptote.</li>
<li>If $p(a) = 0$ too, factor and cancel the common factor — this is a <em>hole</em>, not an asymptote.</li>
<li>Determine the sign of the limit on each side by testing values close to $a$.</li>
</ol>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body"><strong>Find</strong> the vertical asymptotes of $f(x) = \\dfrac{1}{x - 1}$.<br><br>Denominator zero: $x = 1$. Numerator at $x = 1$: 1 (non-zero). So $x = 1$ is a vertical asymptote.<br><br>Approach from the right ($x = 1.01$): $\\frac{1}{0.01} = +100$. So $\\lim_{x \\to 1^{+}} f = +\\infty$.<br>Approach from the left ($x = 0.99$): $\\frac{1}{-0.01} = -100$. So $\\lim_{x \\to 1^{-}} f = -\\infty$.<br><br>The two-sided limit does not exist; the function "tears" at $x = 1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — hole instead of asymptote</div><div class="example-body"><strong>Find</strong> the asymptotes of $f(x) = \\dfrac{x^{2} - 4}{x - 2}$.<br><br>Denominator zero at $x = 2$. But $p(2) = 4 - 4 = 0$ too, so we factor:<br><br>$f(x) = \\dfrac{(x-2)(x+2)}{x - 2} = x + 2$ &nbsp;(for $x \\neq 2$).<br><br>There is a <em>hole</em> at $(2, 4)$, not a vertical asymptote. The simplified function $x + 2$ is a straight line.</div></div>

<div class="calc-graph"><div id="plot-l14-vertical-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = 1/(x-1)$ with horizontal asymptote $y = 0$ (dashed gold) and vertical asymptote $x = 1$ (dashed red). On the left side of $x=1$ the curve plunges to $-\\infty$; on the right side it shoots up to $+\\infty$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fEN(x){return 1/(x-1);}
var xL=[];var yL=[];for(var i=-50;i<=80;i++){var x=i/10;if(x>=0.95)break;xL.push(x);yL.push(fEN(x));}
var xR=[];var yR=[];for(var i=11;i<=70;i++){var x=i/10;if(x<=1.05)continue;xR.push(x);yR.push(fEN(x));}
var t1={x:xL,y:yL,mode:'lines',name:'f(x) for x < 1',line:{color:'#3b82f6',width:2.5}};
var t2={x:xR,y:yR,mode:'lines',name:'f(x) for x > 1',line:{color:'#3b82f6',width:2.5},showlegend:false};
var hAsymp={x:[-5,8],y:[0,0],mode:'lines',name:'y = 0 (horizontal)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var vAsymp={x:[1,1],y:[-10,10],mode:'lines',name:'x = 1 (vertical)',line:{color:'#ef4444',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-10,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-vertical-en',[t1,t2,hAsymp,vAsymp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Oblique (Slant) Asymptotes</h2>

<div class="calc-highlight"><strong>When the numerator's degree is exactly one more than the denominator's degree</strong> ($\\deg p = \\deg q + 1$), there is no horizontal asymptote — but there is a tilted straight line the graph follows out at infinity. That line is the <em>oblique asymptote</em>. Find it by polynomial long division of $p$ by $q$.</div>

<p class="l-text">If $f(x) = \\dfrac{p(x)}{q(x)}$ with $\\deg p = \\deg q + 1$, write the division as</p>

<div class="calc-formula"><div class="formula-label">POLYNOMIAL DIVISION FORM</div><div class="formula-main">$$\\frac{p(x)}{q(x)} \\;=\\; (m x + n) \\;+\\; \\frac{r(x)}{q(x)}$$</div><div class="formula-sub">The "quotient" $m x + n$ is a linear function. The remainder $r(x)/q(x)$ has lower degree on top, so it vanishes as $x \\to \\pm\\infty$. The oblique asymptote is $y = m x + n$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — oblique asymptote</div><div class="example-body"><strong>Find</strong> all asymptotes of $f(x) = \\dfrac{x^{2} + 1}{x}$.<br><br><em>Vertical:</em> denominator zero at $x = 0$, numerator $1 \\neq 0$, so $x = 0$ is a vertical asymptote.<br><br><em>Horizontal:</em> numerator has degree 2, denominator degree 1. Higher on top, so no horizontal asymptote.<br><br><em>Oblique:</em> degrees differ by exactly one. Divide:<br>$\\dfrac{x^{2} + 1}{x} = x + \\dfrac{1}{x}$.<br><br>The quotient is $x$; the remainder $1/x \\to 0$ as $x \\to \\pm\\infty$. So the oblique asymptote is $\\mathbf{y = x}$. The graph hugs the line $y = x$ at infinity and is split by a vertical asymptote at $x = 0$.</div></div>

<div class="calc-graph"><div id="plot-l14-oblique-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = (x^{2}+1)/x = x + 1/x$ in blue, the oblique asymptote $y = x$ in dashed gold, and the vertical asymptote $x = 0$ in dashed red. Notice how the curve clings to the gold line at the far ends but plunges to $\\pm\\infty$ on either side of zero.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fEN(x){return x + 1/x;}
var xL=[];var yL=[];for(var i=-80;i<=-1;i++){var x=i/10;xL.push(x);yL.push(fEN(x));}
var xR=[];var yR=[];for(var i=1;i<=80;i++){var x=i/10;xR.push(x);yR.push(fEN(x));}
var t1={x:xL,y:yL,mode:'lines',name:'f(x) for x < 0',line:{color:'#3b82f6',width:2.5}};
var t2={x:xR,y:yR,mode:'lines',name:'f(x) for x > 0',line:{color:'#3b82f6',width:2.5},showlegend:false};
var oblique={x:[-8,8],y:[-8,8],mode:'lines',name:'y = x (oblique)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var vert={x:[0,0],y:[-12,12],mode:'lines',name:'x = 0 (vertical)',line:{color:'#ef4444',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-oblique-en',[t1,t2,oblique,vert],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HORIZONTAL ASYMPTOTE</div><div class="compare-item">Degrees: $n \\le m$</div><div class="compare-item">Long-range slope: 0</div><div class="compare-item">Form: $y = L$ (a constant)</div></div><div class="compare-col"><div class="compare-title">OBLIQUE ASYMPTOTE</div><div class="compare-item">Degrees: $n = m + 1$</div><div class="compare-item">Long-range slope: non-zero</div><div class="compare-item">Form: $y = m x + n$ (a line)</div></div></div>

<div class="l-note"><strong>Important:</strong> a function never has both a horizontal and an oblique asymptote on the same side. The two are mutually exclusive — the long-range slope is either zero (horizontal) or non-zero (oblique), not both.</div>

<h2 class="lesson-title">8. Sketching a Rational Function — The Four-Step Method</h2>

<div class="calc-highlight"><strong>Sketching a curve by hand looks daunting at first, but with the right checklist it becomes mechanical.</strong> The four steps below produce a faithful sketch for any rational function. Practise them on three or four examples and you will recognise the long-range shape of a rational graph at a glance.</div>

<ol class="l-text" style="padding-left:1.4rem;line-height:1.8">
<li><strong>Step 1 — Find the horizontal asymptote.</strong> Compare numerator and denominator degrees. Equal → $y = a/b$. Smaller top → $y = 0$. Bigger top by one → look for an oblique asymptote instead.</li>
<li><strong>Step 2 — Find the vertical asymptotes.</strong> Set $q(x) = 0$ and solve. For each root $a$, check that $p(a) \\neq 0$ (otherwise it's a hole). Determine $\\pm\\infty$ sign on each side.</li>
<li><strong>Step 3 — Find the oblique asymptote (if degree of $p$ exceeds degree of $q$ by exactly one).</strong> Use polynomial long division and read off the linear quotient.</li>
<li><strong>Step 4 — Find the intercepts.</strong> y-intercept: evaluate $f(0)$ (if defined). x-intercepts: solve $p(x) = 0$ (numerator zero, denominator non-zero). These two anchor points pin the graph down.</li>
</ol>

<div class="calc-example"><div class="example-label">FULL WORKED SKETCH</div><div class="example-body"><strong>Sketch</strong> $f(x) = \\dfrac{x^{2} - 1}{x - 2}$.<br><br><strong>Step 1.</strong> Degrees 2 and 1; top exceeds by one, so no horizontal asymptote.<br><br><strong>Step 2.</strong> Denominator zero at $x = 2$; numerator at $x = 2$: $4 - 1 = 3 \\neq 0$. So $x = 2$ is a vertical asymptote. Left side ($x = 1.99$): $\\frac{2.96}{-0.01} \\approx -296$. Right side ($x = 2.01$): $\\frac{3.04}{0.01} \\approx +304$. So $f \\to -\\infty$ on the left of 2 and $+\\infty$ on the right.<br><br><strong>Step 3.</strong> Divide $x^{2} - 1$ by $x - 2$: quotient $x + 2$, remainder 3. So $f(x) = x + 2 + \\dfrac{3}{x - 2}$. The oblique asymptote is $\\mathbf{y = x + 2}$.<br><br><strong>Step 4.</strong> y-intercept: $f(0) = \\dfrac{-1}{-2} = 0.5$. x-intercepts: $x^{2} - 1 = 0 \\Rightarrow x = \\pm 1$. So the curve crosses the x-axis at $(-1, 0)$ and $(1, 0)$ and passes through $(0, 0.5)$.<br><br>With those facts you can plot the curve confidently in two pieces (left and right of the vertical asymptote), each piece converging to the oblique line $y = x + 2$ far from the centre.</div></div>

<h2 class="lesson-title">9. Classical Exercises</h2>

<p class="l-text">For each of the following, find <em>all</em> horizontal, vertical, and oblique asymptotes. Sketch the result on paper.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1</div><div class="card-body">$f(x) = \\dfrac{3x - 5}{x + 2}$. Identify all asymptotes.<br><br><strong>Hint:</strong> degrees are equal.</div></div>
<div class="calc-card"><div class="card-title">Problem 2</div><div class="card-body">$f(x) = \\dfrac{x^{2}}{x^{2} - 9}$. Identify horizontal and vertical asymptotes.</div></div>
<div class="calc-card"><div class="card-title">Problem 3</div><div class="card-body">$f(x) = \\dfrac{x^{2} - 2x + 1}{x - 1}$. Beware: factor first.</div></div>
<div class="calc-card"><div class="card-title">Problem 4</div><div class="card-body">$f(x) = \\dfrac{2x^{2} + 3}{x + 1}$. Find the oblique asymptote.</div></div>
<div class="calc-card"><div class="card-title">Problem 5</div><div class="card-body">$f(x) = \\dfrac{e^{x}}{1 + e^{x}}$ (the logistic function). Find both horizontal asymptotes.</div></div>
<div class="calc-card"><div class="card-title">Problem 6</div><div class="card-body">$f(x) = \\ln(x - 3)$. Find the vertical asymptote and the end behaviour as $x \\to \\infty$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ANSWERS</div><div class="example-body">
1) Horizontal $y = 3$ (ratio of leading coefficients), vertical $x = -2$.<br>
2) Horizontal $y = 1$, vertical $x = \\pm 3$.<br>
3) $f = (x - 1)$ after cancellation — a hole at $(1, 0)$, no asymptotes (it is a straight line for $x \\neq 1$).<br>
4) Divide: $\\frac{2x^{2}+3}{x+1} = 2x - 2 + \\frac{5}{x+1}$. Oblique $y = 2x - 2$, vertical $x = -1$.<br>
5) $\\lim_{x \\to \\infty} = 1$, $\\lim_{x \\to -\\infty} = 0$. Two horizontal asymptotes, $y = 1$ and $y = 0$.<br>
6) Vertical asymptote $x = 3$ (where $\\ln$ argument hits 0); as $x \\to \\infty$, $\\ln(x - 3) \\to +\\infty$, no horizontal asymptote.
</div></div>

<h2 class="lesson-title">10. Exponential vs Polynomial — A Visual</h2>

<p class="l-text">The growth hierarchy of section 4 is easy to state but hard to believe at first. The plot below makes it visual: a polynomial $x^{3}$ and the exponential $e^{x}$ start neck-and-neck near zero, but by $x = 10$ the exponential is nearly 100 times bigger, and by $x = 20$ the gap is astronomical.</p>

<div class="calc-graph"><div id="plot-l14-growth-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = x^{3}$ (blue) and $y = e^{x}$ (orange) on the same axes for $x$ in $[0, 8]$. The exponential overtakes the cubic around $x \\approx 4.5$ and grows without bound thereafter. The logarithm $\\ln x$ (green) is shown for contrast — it crawls.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var poly=[];var exp=[];var log=[];
for(var i=1;i<=80;i++){var x=i/10;xs.push(x);poly.push(x*x*x);exp.push(Math.exp(x));log.push(Math.log(x));}
var t1={x:xs,y:poly,mode:'lines',name:'x^3 (polynomial)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:exp,mode:'lines',name:'e^x (exponential)',line:{color:'#f59e0b',width:2.5}};
var t3={x:xs,y:log,mode:'lines',name:'ln(x) (logarithm)',line:{color:'#10b981',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',type:'log',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-growth-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SUMMARY</div><div class="think-body">Three asymptote types — horizontal, vertical, oblique — cover every rational function. Compare degrees for the horizontal case, factor the denominator for the vertical case, and do polynomial division for the oblique case. Add the y-intercept, the x-intercepts, and a sign check between asymptotes, and the full sketch falls out of the algebra.</div></div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şimdiye kadar bu derste bir fonksiyonun sabit bir noktanın yakınında nasıl davrandığını sorduk.</strong> Bu derste soruyu değiştiriyoruz. <em>Uzakta</em> ne olduğunu soruyoruz — $x$ sınırsız büyüdüğünde veya eksi sonsuza doğru gittiğinde. Cevaplar her zaman sonlu sayılar değildir; bazen grafik yatay bir doğruya yaklaşır, bazen dikey bir duvara çarparak sonsuza fırlar, bazen de eğik bir cetveli izler. Asimptotlar bir grafiğin uzun-menzilli iskeletidir: onları bildiğinizde eğriyi çizmek mekanik bir işe dönüşür.</p>

<p class="l-text">Rasyonel fonksiyonlar, üstel fonksiyonlar, logaritmalar ve birçok mühendislik modeli asimptotlarla iç içe yaşar. Bir kondansatörün reaktansı sıfır frekansta patlar. Şarj olmakta olan kondansatör üzerindeki gerilim kaynak değerine asla tam ulaşmadan yaklaşır. Alçak-geçiren filtrenin Bode grafiği eğik bir doğru boyunca aşağı kayar. Hepsi gizlenmiş birer asimptottur. Bu dersin sonunda elinizin altındaki herhangi bir rasyonel fonksiyonun bütün yatay, dikey ve eğik asimptotlarını bulup uzun-menzilli davranışını elle çizebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Polinom, rasyonel, üstel ve logaritmik fonksiyonlar için sonsuzdaki limitleri hesaplamak</li>
<li>Polinomun baskın terimini okuyarak uç davranışı önceden kestirmek</li>
<li>Rasyonel fonksiyonda pay-payda derecelerini karşılaştırarak yatay asimptotları bulmak</li>
<li>Fonksiyonun patladığı noktaları tespit ederek dikey asimptotları belirlemek</li>
<li>Polinom bölmesiyle eğik asimptotları çıkarmak</li>
<li>Asimptotlar, kesişimler ve işaret tablosu üzerinden rasyonel fonksiyonu dört adımda çizmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Sonsuzda Limit: $x \\to \\infty$ Ne Demek?</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> upuzun düz bir yola çıkın ve yürümeye başlayın. Arkadaki kasaba küçülür, yol kenarındaki ağaçlar belirli bir anda yanınızdan geçer. Ama ufukta görünen tepenin yüksekliği, yolun en sonunda yerleştiği rakım — bu yolun <em>uzun-vadeli davranışıyla</em> ilgili bir sorudur. Sonsuzda limit, aynı soruyu fonksiyon için sorar. $x$ kâğıdın sağ kenarından çıktığında grafik nereye gider? Sol kenardan çıktığında nereye gider?</div>

<p class="l-text">$\\lim_{x \\to \\infty} f(x) = L$ sembolü şu anlama gelir: $x$ keyfi büyük ve pozitif olduğunda, $f(x)$ değeri istenildiği kadar $L$'ye yaklaşır. Belirli büyük bir sayı yerine koymayız; sadece eğilimi izleriz. Üç olası sonuç vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonlu limit</div><div class="card-body">$f(x)$ sabit bir $L$ sayısına yerleşir. Grafik yatay $y = L$ doğrusuna doğru düzleşir. Örnek: $\\lim_{x \\to \\infty} \\frac{1}{x} = 0$.</div></div>
<div class="calc-card"><div class="card-title">Sonsuz limit</div><div class="card-body">$f(x)$ sınırsız büyür. $\\lim f(x) = +\\infty$ veya $-\\infty$ yazarız. Örnek: $\\lim_{x \\to \\infty} x^{2} = +\\infty$.</div></div>
<div class="calc-card"><div class="card-title">Limit yok</div><div class="card-body">$f(x)$ sonsuza dek salınır, yerleşmez. Örnek: $\\lim_{x \\to \\infty} \\sin x$ yoktur — değer $-1$ ile $+1$ arasında zıplar durur.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">RESMİ TANIM (bir kez oku, sonsuza dek sezgisel kalır)</div><div class="formula-main">$$\\lim_{x \\to \\infty} f(x) = L \\iff \\forall \\varepsilon > 0 \\;\\; \\exists M > 0 : x > M \\implies |f(x) - L| < \\varepsilon$$</div><div class="formula-sub">$L$ etrafında ne kadar küçük bir $\\varepsilon$ toleransı talep ederseniz edin, öyle bir $M$ kesim noktası bulunabilir ki $x = M$'in ötesinde grafik $L$'den $\\varepsilon$ kadar bile uzaklaşmaz.</div></div>

<p class="l-text">Aynı şey $x \\to -\\infty$ için de geçerlidir — sağa yerine sola doğru yürürsünüz. Bazı fonksiyonlar iki uçta da aynı davranır (çift dereceli polinomlar), bazıları zıt davranır (tek dereceli polinomlar), bazıları ise iki uçta tamamen farklı davranır (üsteller).</p>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>Hesaplayın:</strong> $\\lim_{x \\to \\infty} \\dfrac{1}{x}$.<br><br>$x$ 10, 100, 1000, 10000'e tırmanırken karşılıklı değerler 0.1, 0.01, 0.001, 0.0001 olur. Değerler küçülür ve üstten 0'a yaklaşır. Yani $\\lim_{x \\to \\infty} \\dfrac{1}{x} = 0$.<br><br>Aynı mantık $\\lim_{x \\to -\\infty} \\dfrac{1}{x} = 0$ verir — ama bu sefer alttan, negatif değerlerle.</div></div>

<h2 class="lesson-title">2. Polinomda Uç Davranış: Baskın Terim Kazanır</h2>

<div class="calc-highlight"><strong>$p(x) = a_{n} x^{n} + a_{n-1} x^{n-1} + \\dots + a_{0}$ polinomunda uç davranışı tamamen baskın terim $a_{n} x^{n}$ belirler.</strong> $|x|$ devasa olduğunda $x^{n-1}, x^{n-2}, \\dots$ alt güçleri $x^{n}$'in yanında ihmal edilebilir kalır; yani $p(x)$ aynı $a_{n} x^{n}$ gibi davranır. Bu dersin en yararlı tek kestirmesidir.</div>

<p class="l-text">Uç davranışı iki bileşen belirler: <strong>derece $n$</strong> (çift mi tek mi?) ve <strong>baş katsayı $a_{n}$</strong> (pozitif mi negatif mi?). Dört olası kombinasyon aşağıdaki tabloda özetlenmiştir.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Derece</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Baş katsayı</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x \\to +\\infty$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x \\to -\\infty$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Görüntü</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">çift</td><td style="padding:0.5rem 0.8rem">$a_{n} > 0$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">U biçimi, iki kol yukarı</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">çift</td><td style="padding:0.5rem 0.8rem">$a_{n} < 0$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">$\\cap$ biçimi, iki kol aşağı</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">tek</td><td style="padding:0.5rem 0.8rem">$a_{n} > 0$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">sol aşağı, sağ yukarı ($x^{3}$ gibi)</td></tr>
<tr><td style="padding:0.5rem 0.8rem">tek</td><td style="padding:0.5rem 0.8rem">$a_{n} < 0$</td><td style="padding:0.5rem 0.8rem">$-\\infty$</td><td style="padding:0.5rem 0.8rem">$+\\infty$</td><td style="padding:0.5rem 0.8rem">sol yukarı, sağ aşağı ($-x^{3}$ gibi)</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>Bulun:</strong> $\\lim_{x \\to \\infty} (2x^{3} - 100x^{2} + 500x - 7)$.<br><br>Baskın terim $2x^{3}$. Çok büyük $x$ için $100x^{2}$ terimi $2x^{3}$'ün milyonda biri kadar küçüktür; doğrusal ve sabit terimler ise tamamen görünmez kalır. Polinom $2x^{3}$ gibi davranır, $x \\to \\infty$ iken $+\\infty$'a gider.<br><br>$-100x^{2}$ başlangıçta eğriyi aşağı çekse de ($x \\approx 30$ civarında bir çukur görürsünüz), kübik terim eninde sonunda baskın çıkar ve grafiği $+\\infty$'a taşır.</div></div>

<h2 class="lesson-title">3. Rasyonel Fonksiyonda Sonsuzda Limit: Dereceleri Karşılaştır</h2>

<div class="calc-highlight"><strong>$f(x) = \\dfrac{p(x)}{q(x)}$ rasyonel fonksiyonunda $x \\to \\pm\\infty$ limiti yalnızca $p$ ve $q$'nun derecelerine ve baş katsayılarına bağlıdır.</strong> Pay ve paydadaki her terimi paydaki en yüksek $x$ kuvvetine bölün. Sonra baş çiftin dışındaki her şey kaybolur ve limit bir adımda çıkar.</div>

<p class="l-text">Üç durum vardır. $n = \\deg p$ ve $m = \\deg q$, baş katsayılar $a$ ve $b$ olsun.</p>

<div class="calc-formula"><div class="formula-label">SONSUZDA RASYONEL LIMIT — ÜÇ DURUM</div><div class="formula-main">$$\\lim_{x \\to \\pm\\infty} \\frac{p(x)}{q(x)} = \\begin{cases} 0 & n < m \\text{ ise} \\\\[4pt] \\dfrac{a}{b} & n = m \\text{ ise} \\\\[4pt] \\pm\\infty & n > m \\text{ ise} \\end{cases}$$</div><div class="formula-sub">Pay derecesi daha küçükse → limit sıfır; eşit derecelerse → baş katsayıların oranı; pay derecesi daha büyükse → sınırsız.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — pay derecesi paydadan küçük</div><div class="example-body"><strong>Bulun:</strong> $\\lim_{x \\to \\infty} \\dfrac{3x + 5}{x^{2} - 4}$.<br><br>Pay ve paydayı $x^{2}$'ye (en yüksek kuvvet) bölün:<br><br>$\\dfrac{\\dfrac{3}{x} + \\dfrac{5}{x^{2}}}{1 - \\dfrac{4}{x^{2}}} \\;\\xrightarrow{x \\to \\infty}\\; \\dfrac{0 + 0}{1 - 0} = 0$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — eşit dereceler</div><div class="example-body"><strong>Bulun:</strong> $\\lim_{x \\to \\infty} \\dfrac{2x^{2} + 7x - 1}{x^{2} - 4}$.<br><br>Pay ve paydayı $x^{2}$'ye bölün:<br><br>$\\dfrac{2 + \\dfrac{7}{x} - \\dfrac{1}{x^{2}}}{1 - \\dfrac{4}{x^{2}}} \\;\\xrightarrow{x \\to \\infty}\\; \\dfrac{2 + 0 - 0}{1 - 0} = 2$.<br><br>Yatay asimptot $y = 2$'dir; bir sonraki grafik bunu doğrulayacak.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — pay derecesi büyük</div><div class="example-body"><strong>Bulun:</strong> $\\lim_{x \\to \\infty} \\dfrac{x^{3} - x}{2x + 1}$.<br><br>Pay ve paydayı $x$'e (alt kuvvet, eğilimi görmek için) bölün:<br><br>$\\dfrac{x^{2} - 1}{2 + \\dfrac{1}{x}} \\;\\xrightarrow{x \\to \\infty}\\; \\dfrac{+\\infty}{2} = +\\infty$.<br><br>Yatay asimptot yok; fonksiyon sonsuza kaçar.</div></div>

<h2 class="lesson-title">4. Üstel ve Logaritmik Fonksiyonlar: Büyüme Hiyerarşisi</h2>

<div class="calc-highlight"><strong>Ezberlenmesi gereken tek eşitsizlik:</strong> $x \\to \\infty$ iken $\\ln x \\;\\ll\\; x^{p} \\;\\ll\\; a^{x}$ (burada $p > 0$ ve $a > 1$). Sözlü: <em>logaritma her pozitif kuvvetten daha yavaş büyür, üstel her polinomu yener</em>. $\\ll$ sembolü "eninde sonunda çok daha küçük" anlamına gelir.</div>

<p class="l-text">Bu hiyerarşi, bilgisayar bilimcilerin algoritmaları sıralamasının (logaritmik zaman polinomdan, polinom üstelden hızlıdır) ve mühendislerin üstel sönümün her zaman güç-yasası sönüme galip geleceğini bilmesinin temelidir. Limit problemleri için hızlı refleks verir: bir üstel ile bir polinom yarışırsa $+\\infty$ tarafında daima üstel kazanır.</p>

<div class="calc-formula"><div class="formula-label">ÖNEMLİ ÜSTEL VE LOGARİTMİK LIMİTLER</div><div class="formula-main">$$\\lim_{x \\to \\infty} e^{x} = +\\infty \\qquad \\lim_{x \\to -\\infty} e^{x} = 0 \\qquad \\lim_{x \\to \\infty} \\ln x = +\\infty \\qquad \\lim_{x \\to 0^{+}} \\ln x = -\\infty$$</div><div class="formula-sub">$e^{x}$ sağa patlar, sola sıfırlanır; $\\ln x$ sağa yavaşça patlar, $x$ sıfıra giderken $-\\infty$'a fırlar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lim e^{x}/x^{n}$</div><div class="card-body">Sabit her $n$ için $+\\infty$. Üstel her polinomu yener.</div></div>
<div class="calc-card"><div class="card-title">$\\lim \\ln x / x^{p}$</div><div class="card-body">Her $p > 0$ için 0. Paydadaki polinom logaritmayı geçer.</div></div>
<div class="calc-card"><div class="card-title">$\\lim (1 + 1/x)^{x}$</div><div class="card-body">$e \\approx 2.71828$'e eşittir. Bu, Bernoulli'nin Euler sayısının orijinal tanımıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body"><strong>Bulun:</strong> $\\lim_{x \\to \\infty} \\dfrac{x^{10}}{e^{x}}$.<br><br>Pay polinomik, payda üstel olarak büyür. Hiyerarşiye göre $x \\to \\infty$ iken $x^{10} \\ll e^{x}$. Oran sıfıra küçülür. Cevap: <strong>0</strong>.<br><br>Polinom derecesi 10'a çıkarılsa bile üstel büyüme yine kazanır. Aşağıdaki grafik hız farkını görselleştirir.</div></div>

<h2 class="lesson-title">5. Yatay Asimptotlar</h2>

<div class="calc-highlight"><strong>Tanım.</strong> $y = L$ doğrusu $f(x)$'in <em>yatay asimptotudur</em>, eğer aşağıdaki limitlerden en az biri $L$ sayısıysa:<br>$\\lim_{x \\to +\\infty} f(x) = L$ ya da $\\lim_{x \\to -\\infty} f(x) = L$.<br>Bir fonksiyonun en fazla <strong>iki</strong> yatay asimptotu olabilir — her yön için bir tane.</div>

<p class="l-text">Pratikte iki limit genelde eşittir (rasyonel fonksiyonlar, çift fonksiyonlar), bu yüzden çoğu grafik iki uçta da aynı yatay çizgiye yapışır. Üsteller bu kuralın standart istisnasıdır: $e^{x}$'in <em>solunda</em> $y = 0$ yatay asimptotu vardır, ama sağında yoktur (patlar).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rasyonel, $n < m$</div><div class="card-body">Yatay asimptot $y = 0$. Grafik iki uçta da $x$ eksenine bastırır.</div></div>
<div class="calc-card"><div class="card-title">Rasyonel, $n = m$</div><div class="card-body">Yatay asimptot $y = a/b$, $a$ ve $b$ baş katsayılar. Grafik bu yüksekliğe yerleşir.</div></div>
<div class="calc-card"><div class="card-title">Üstel $a e^{kx} + c$</div><div class="card-body">$k > 0$ ise: solda $y = c$ yatay asimptotu. $k < 0$ ise: sağda $y = c$ yatay asimptotu.</div></div>
</div>

<div class="calc-graph"><div id="plot-l14-horizontal-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $f(x) = (2x^{2}+1)/(x^{2}-4)$ fonksiyonu, yatay asimptotu $y = 2$ (kesik altın) ve dikey asimptotları $x = \\pm 2$ (kesik kırmızı). Grafik solda ve sağda $y = 2$'ye yapışır, $x = \\pm 2$ yakınında $\\pm\\infty$'a fırlar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fTR(x){return (2*x*x+1)/(x*x-4);}
function build(){
var seg=[];var step=0.02;
var ranges=[[-8,-2.05],[-1.95,1.95],[2.05,8]];
for(var r=0;r<ranges.length;r++){var xs=[];var ys=[];for(var x=ranges[r][0];x<=ranges[r][1];x+=step){xs.push(x);ys.push(fTR(x));}seg.push({x:xs,y:ys,mode:'lines',line:{color:'#3b82f6',width:2.5},showlegend:r===0,name:'f(x)'});}
return seg;
}
var traces=build();
traces.push({x:[-8,8],y:[2,2],mode:'lines',name:'y = 2 (yatay)',line:{color:'#f59e0b',width:2,dash:'dash'}});
traces.push({x:[-2,-2],y:[-15,15],mode:'lines',name:'x = -2 (dikey)',line:{color:'#ef4444',width:1.5,dash:'dot'}});
traces.push({x:[2,2],y:[-15,15],mode:'lines',name:'x = +2 (dikey)',line:{color:'#ef4444',width:1.5,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-10,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-horizontal-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Dikkat:</strong> bir fonksiyonun grafiği yatay asimptotunu <em>kesebilir</em>. Asimptot, fonksiyonun dokunamayacağı bir engel değil; uzun-menzilli davranıştır. Örneğin $f(x) = \\sin(x)/x$ fonksiyonu $y = 0$'ı sonsuz kez keser, yine de yatay asimptotu $y = 0$'dır.</div>

<h2 class="lesson-title">6. Dikey Asimptotlar</h2>

<div class="calc-highlight"><strong>Tanım.</strong> $x = a$ dikey doğrusu $f(x)$'in <em>dikey asimptotudur</em>, eğer $x \\to a$ giderken tek taraflı limitlerden en az biri $\\pm\\infty$ ise. Dikey asimptotlar genellikle paydanın sıfırlandığı ama payın sıfırlanmadığı noktalarda oluşur.</div>

<p class="l-text">$f = p/q$ rasyonel fonksiyonunun dikey asimptotlarını bulmak için:</p>

<ol class="l-text" style="padding-left:1.4rem;line-height:1.7">
<li>Paydayı sıfıra eşitleyip çözün: $q(x) = 0$.</li>
<li>Her kök $a$ için $p(a) \\neq 0$ olduğunu kontrol edin. Sıfır değilse $x = a$ dikey asimptottur.</li>
<li>Eğer $p(a) = 0$ ise ortak çarpanı sadeleştirin — bu bir <em>delik</em>tir, asimptot değil.</li>
<li>$a$'ya yakın değerler deneyerek her iki taraftaki limitin işaretini belirleyin.</li>
</ol>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body"><strong>Bulun:</strong> $f(x) = \\dfrac{1}{x - 1}$ fonksiyonunun dikey asimptotları.<br><br>Payda sıfır: $x = 1$. $x = 1$'de pay 1 (sıfır değil). Yani $x = 1$ dikey asimptot.<br><br>Sağdan yaklaşım ($x = 1.01$): $\\frac{1}{0.01} = +100$. Yani $\\lim_{x \\to 1^{+}} f = +\\infty$.<br>Soldan yaklaşım ($x = 0.99$): $\\frac{1}{-0.01} = -100$. Yani $\\lim_{x \\to 1^{-}} f = -\\infty$.<br><br>İki taraflı limit yoktur; fonksiyon $x = 1$'de "yırtılır".</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — asimptot yerine delik</div><div class="example-body"><strong>Bulun:</strong> $f(x) = \\dfrac{x^{2} - 4}{x - 2}$ fonksiyonunun asimptotları.<br><br>Payda $x = 2$'de sıfır. Ama $p(2) = 4 - 4 = 0$ olduğundan çarpanlara ayırın:<br><br>$f(x) = \\dfrac{(x-2)(x+2)}{x - 2} = x + 2$ &nbsp;($x \\neq 2$ için).<br><br>$(2, 4)$ noktasında <em>delik</em> vardır, dikey asimptot değil. Sadeleşmiş fonksiyon düz bir doğrudur.</div></div>

<div class="calc-graph"><div id="plot-l14-vertical-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $f(x) = 1/(x-1)$ fonksiyonu, yatay asimptotu $y = 0$ (kesik altın) ve dikey asimptotu $x = 1$ (kesik kırmızı) ile. $x = 1$'in solunda eğri $-\\infty$'a dalar; sağında $+\\infty$'a fırlar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fTR(x){return 1/(x-1);}
var xL=[];var yL=[];for(var i=-50;i<=80;i++){var x=i/10;if(x>=0.95)break;xL.push(x);yL.push(fTR(x));}
var xR=[];var yR=[];for(var i=11;i<=70;i++){var x=i/10;if(x<=1.05)continue;xR.push(x);yR.push(fTR(x));}
var t1={x:xL,y:yL,mode:'lines',name:'f(x), x < 1',line:{color:'#3b82f6',width:2.5}};
var t2={x:xR,y:yR,mode:'lines',name:'f(x), x > 1',line:{color:'#3b82f6',width:2.5},showlegend:false};
var hAsymp={x:[-5,8],y:[0,0],mode:'lines',name:'y = 0 (yatay)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var vAsymp={x:[1,1],y:[-10,10],mode:'lines',name:'x = 1 (dikey)',line:{color:'#ef4444',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-10,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-vertical-tr',[t1,t2,hAsymp,vAsymp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Eğik (Oblique) Asimptotlar</h2>

<div class="calc-highlight"><strong>Pay derecesi paydadan tam olarak bir fazlaysa</strong> ($\\deg p = \\deg q + 1$), yatay asimptot yoktur — ama sonsuzda grafiğin izlediği eğik bir doğru vardır. Bu doğruya <em>eğik asimptot</em> denir. $p$ polinomunu $q$ polinomuna bölerek bulunur.</div>

<p class="l-text">$f(x) = \\dfrac{p(x)}{q(x)}$, $\\deg p = \\deg q + 1$ olsun. Bölmeyi şöyle yazın:</p>

<div class="calc-formula"><div class="formula-label">POLİNOM BÖLME FORMU</div><div class="formula-main">$$\\frac{p(x)}{q(x)} \\;=\\; (m x + n) \\;+\\; \\frac{r(x)}{q(x)}$$</div><div class="formula-sub">"Bölüm" $m x + n$ doğrusal bir fonksiyondur. Kalan $r(x)/q(x)$ payda derecesi paya göre düşük olduğundan $x \\to \\pm\\infty$ iken sıfırlanır. Eğik asimptot $y = m x + n$'dir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — eğik asimptot</div><div class="example-body"><strong>Bulun:</strong> $f(x) = \\dfrac{x^{2} + 1}{x}$ fonksiyonunun bütün asimptotları.<br><br><em>Dikey:</em> payda $x = 0$'da sıfır, pay 1 (sıfır değil), yani $x = 0$ dikey asimptot.<br><br><em>Yatay:</em> pay derecesi 2, payda derecesi 1. Pay büyük, yatay asimptot yok.<br><br><em>Eğik:</em> dereceler tam bir farkla. Bölün:<br>$\\dfrac{x^{2} + 1}{x} = x + \\dfrac{1}{x}$.<br><br>Bölüm $x$, kalan $1/x \\to 0$ ($x \\to \\pm\\infty$ iken). Eğik asimptot $\\mathbf{y = x}$. Grafik sonsuzda $y = x$ doğrusuna yapışır, $x = 0$'da dikey asimptotla ikiye bölünür.</div></div>

<div class="calc-graph"><div id="plot-l14-oblique-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $f(x) = (x^{2}+1)/x = x + 1/x$ mavi, eğik asimptot $y = x$ kesik altın, dikey asimptot $x = 0$ kesik kırmızı. Eğri uzakta altın çizgiye nasıl yapıştığına ve sıfırın yakınında $\\pm\\infty$'a nasıl daldığına dikkat edin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function fTR(x){return x + 1/x;}
var xL=[];var yL=[];for(var i=-80;i<=-1;i++){var x=i/10;xL.push(x);yL.push(fTR(x));}
var xR=[];var yR=[];for(var i=1;i<=80;i++){var x=i/10;xR.push(x);yR.push(fTR(x));}
var t1={x:xL,y:yL,mode:'lines',name:'f(x), x < 0',line:{color:'#3b82f6',width:2.5}};
var t2={x:xR,y:yR,mode:'lines',name:'f(x), x > 0',line:{color:'#3b82f6',width:2.5},showlegend:false};
var oblique={x:[-8,8],y:[-8,8],mode:'lines',name:'y = x (eğik)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var vert={x:[0,0],y:[-12,12],mode:'lines',name:'x = 0 (dikey)',line:{color:'#ef4444',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-oblique-tr',[t1,t2,oblique,vert],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YATAY ASİMPTOT</div><div class="compare-item">Dereceler: $n \\le m$</div><div class="compare-item">Uzun-menzilli eğim: 0</div><div class="compare-item">Şekil: $y = L$ (bir sabit)</div></div><div class="compare-col"><div class="compare-title">EĞİK ASİMPTOT</div><div class="compare-item">Dereceler: $n = m + 1$</div><div class="compare-item">Uzun-menzilli eğim: sıfırdan farklı</div><div class="compare-item">Şekil: $y = m x + n$ (bir doğru)</div></div></div>

<div class="l-note"><strong>Önemli:</strong> aynı tarafta hem yatay hem eğik asimptot olamaz. İkisi karşılıklı dışlayıcıdır — uzun-menzilli eğim ya sıfırdır (yatay) ya sıfırdan farklıdır (eğik), ikisi birden değil.</div>

<h2 class="lesson-title">8. Rasyonel Fonksiyon Çizimi — Dört Adım</h2>

<div class="calc-highlight"><strong>Eğri çizimi ilk bakışta korkutucu görünür, ama doğru kontrol listesi ile mekanik bir işe dönüşür.</strong> Aşağıdaki dört adım, herhangi bir rasyonel fonksiyon için sadık bir taslak üretir. Üç dört örnek üzerinde pratik yaptıktan sonra rasyonel grafiğin uzun-menzilli şeklini bir bakışta tanıyabilirsiniz.</div>

<ol class="l-text" style="padding-left:1.4rem;line-height:1.8">
<li><strong>Adım 1 — Yatay asimptotu bul.</strong> Pay ve payda derecelerini karşılaştır. Eşitse → $y = a/b$. Pay küçükse → $y = 0$. Pay tam bir fazlaysa → yatay yerine eğik asimptot ara.</li>
<li><strong>Adım 2 — Dikey asimptotları bul.</strong> $q(x) = 0$ yaz ve çöz. Her kök $a$ için $p(a) \\neq 0$ olduğunu doğrula (aksi halde delik). Her tarafta $\\pm\\infty$ işaretini belirle.</li>
<li><strong>Adım 3 — Eğik asimptotu bul (pay derecesi paydadan tam bir fazlaysa).</strong> Polinom bölmesi yap, doğrusal bölümü oku.</li>
<li><strong>Adım 4 — Kesişimleri bul.</strong> $y$-kesişimi: $f(0)$'ı hesapla (tanımlıysa). $x$-kesişimi: $p(x) = 0$'ı çöz (pay sıfır, payda sıfırdan farklı). Bu iki çapa noktası grafiği yerine sabitler.</li>
</ol>

<div class="calc-example"><div class="example-label">TAM ÇİZİM ÖRNEĞİ</div><div class="example-body"><strong>Çizin:</strong> $f(x) = \\dfrac{x^{2} - 1}{x - 2}$.<br><br><strong>Adım 1.</strong> Dereceler 2 ve 1; pay bir fazla, yatay asimptot yok.<br><br><strong>Adım 2.</strong> Payda $x = 2$'de sıfır; $x = 2$'de pay: $4 - 1 = 3 \\neq 0$. Yani $x = 2$ dikey asimptot. Sol taraf ($x = 1.99$): $\\frac{2.96}{-0.01} \\approx -296$. Sağ taraf ($x = 2.01$): $\\frac{3.04}{0.01} \\approx +304$. Yani 2'nin solunda $f \\to -\\infty$, sağında $+\\infty$.<br><br><strong>Adım 3.</strong> $x^{2} - 1$'i $x - 2$'ye böl: bölüm $x + 2$, kalan 3. Yani $f(x) = x + 2 + \\dfrac{3}{x - 2}$. Eğik asimptot $\\mathbf{y = x + 2}$.<br><br><strong>Adım 4.</strong> $y$-kesişimi: $f(0) = \\dfrac{-1}{-2} = 0.5$. $x$-kesişimleri: $x^{2} - 1 = 0 \\Rightarrow x = \\pm 1$. Eğri $x$ eksenini $(-1, 0)$ ve $(1, 0)$'da keser, $(0, 0.5)$'ten geçer.<br><br>Bu bilgilerle eğriyi dikey asimptotun iki yanında, uzakta $y = x + 2$ doğrusuna yaklaşan iki parça olarak güvenle çizebilirsiniz.</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">Aşağıdaki her fonksiyon için <em>tüm</em> yatay, dikey ve eğik asimptotları bulun. Sonucu kağıda çizin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Problem 1</div><div class="card-body">$f(x) = \\dfrac{3x - 5}{x + 2}$. Tüm asimptotları belirleyin.<br><br><strong>İpucu:</strong> dereceler eşit.</div></div>
<div class="calc-card"><div class="card-title">Problem 2</div><div class="card-body">$f(x) = \\dfrac{x^{2}}{x^{2} - 9}$. Yatay ve dikey asimptotları belirleyin.</div></div>
<div class="calc-card"><div class="card-title">Problem 3</div><div class="card-body">$f(x) = \\dfrac{x^{2} - 2x + 1}{x - 1}$. Dikkat: önce çarpanlara ayırın.</div></div>
<div class="calc-card"><div class="card-title">Problem 4</div><div class="card-body">$f(x) = \\dfrac{2x^{2} + 3}{x + 1}$. Eğik asimptotu bulun.</div></div>
<div class="calc-card"><div class="card-title">Problem 5</div><div class="card-body">$f(x) = \\dfrac{e^{x}}{1 + e^{x}}$ (lojistik fonksiyon). Her iki yatay asimptotu bulun.</div></div>
<div class="calc-card"><div class="card-title">Problem 6</div><div class="card-body">$f(x) = \\ln(x - 3)$. Dikey asimptotu ve $x \\to \\infty$ davranışını bulun.</div></div>
</div>

<div class="calc-example"><div class="example-label">CEVAPLAR</div><div class="example-body">
1) Yatay $y = 3$ (baş katsayı oranı), dikey $x = -2$.<br>
2) Yatay $y = 1$, dikey $x = \\pm 3$.<br>
3) Sadeleşme sonrası $f = (x - 1)$ — $(1, 0)$'da delik, asimptot yok (eğri $x \\neq 1$ için bir doğrudur).<br>
4) Bölme: $\\frac{2x^{2}+3}{x+1} = 2x - 2 + \\frac{5}{x+1}$. Eğik $y = 2x - 2$, dikey $x = -1$.<br>
5) $\\lim_{x \\to \\infty} = 1$, $\\lim_{x \\to -\\infty} = 0$. İki yatay asimptot: $y = 1$ ve $y = 0$.<br>
6) Dikey asimptot $x = 3$ ($\\ln$ argümanı sıfırlandığında); $x \\to \\infty$ iken $\\ln(x - 3) \\to +\\infty$, yatay asimptot yok.
</div></div>

<h2 class="lesson-title">10. Üstel ile Polinomun Karşılaştırması — Görsel</h2>

<p class="l-text">4. bölümün büyüme hiyerarşisi söylemesi kolay, ilk başta inanılması zor bir gerçektir. Aşağıdaki grafik bunu görselleştirir: $x^{3}$ polinomu ve $e^{x}$ üsteli sıfırın yakınında başa baş başlar, ama $x = 10$'da üstel polinomun yaklaşık 100 katıdır, $x = 20$'de fark astronomik boyuttadır.</p>

<div class="calc-graph"><div id="plot-l14-growth-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $y = x^{3}$ (mavi) ve $y = e^{x}$ (turuncu) $x \\in [0, 8]$ aralığında. Üstel, $x \\approx 4.5$ civarında kübiği geçer ve sonsuza dek sınırsız büyür. Karşılaştırma için $\\ln x$ (yeşil) de gösterilmiştir — sürünür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var poly=[];var exp=[];var log=[];
for(var i=1;i<=80;i++){var x=i/10;xs.push(x);poly.push(x*x*x);exp.push(Math.exp(x));log.push(Math.log(x));}
var t1={x:xs,y:poly,mode:'lines',name:'x^3 (polinom)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:exp,mode:'lines',name:'e^x (üstel)',line:{color:'#f59e0b',width:2.5}};
var t3={x:xs,y:log,mode:'lines',name:'ln(x) (logaritma)',line:{color:'#10b981',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',type:'log',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l14-growth-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ÖZET</div><div class="think-body">Üç asimptot türü — yatay, dikey, eğik — her rasyonel fonksiyonu kapsar. Yatay için dereceleri karşılaştır, dikey için paydayı çarpanlarına ayır, eğik için polinom bölmesi yap. $y$-kesişimi, $x$-kesişimleri ve asimptotlar arası işaret tablosunu da ekle; tam taslak cebirden kendiliğinden çıkar.</div></div>`
};
