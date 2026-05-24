window.LISE_MAT_L23 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The derivative is more than the slope of a tangent line — it is a detector of motion.</strong> When $f'(x)$ is positive, the function is climbing; when it is negative, the function is falling; when it is exactly zero, the function is, at that instant, neither rising nor falling. In this lesson we turn this single observation into a complete strategy for understanding the shape of a curve: where it rises, where it falls, where it changes direction, and how to find every local maximum and local minimum without ever looking at a graph.</p>

<p class="l-text">This lesson is the workshop of differential calculus. You will learn to take a function, compute one derivative, build a small table of signs, and read off the entire monotonic behaviour. The technique is mechanical once you have practised it, but the underlying idea — that the sign of the derivative controls the direction of the function — is one of the deepest ideas in mathematics. It will reappear in every optimisation problem you solve, from the simplest box-with-maximum-volume question to advanced extremum problems on the university exam.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the formal definition of an <em>increasing</em> and <em>decreasing</em> function on an interval</li>
<li>Use the Mean Value Theorem to justify the monotonicity test: $f' > 0 \\Rightarrow f$ is increasing</li>
<li>Identify <em>critical points</em> — the places where $f'(x) = 0$ or $f'(x)$ fails to exist</li>
<li>Apply the <strong>First-Derivative Test</strong> to classify each critical point as a local maximum, local minimum, or neither</li>
<li>Build a <em>sign chart</em> for $f'$ in four clean steps and read the monotonic intervals straight off it</li>
<li>Locate the <em>absolute</em> maximum and minimum of a continuous function on a closed interval $[a, b]$</li>
</ul>
</div>

<h2 class="lesson-title">1. Increasing and Decreasing Functions — Intuition and Formal Definition</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine the elevation profile of a hike. When the trail goes uphill, your altitude is <em>increasing</em>. When it goes downhill, your altitude is <em>decreasing</em>. The peaks of the hike are where uphill turns to downhill (a local maximum); the valley floors are where downhill turns to uphill (a local minimum). The derivative does for any function what your altimeter does for a hiker — it measures the rate at which the value goes up or down.</div>

<p class="l-text">Before we link the idea to derivatives, we must say precisely what it means for a function to be increasing. Here is the formal definition that every Turkish high-school textbook agrees on:</p>

<div class="calc-formula"><div class="formula-label">INCREASING / DECREASING ON AN INTERVAL</div><div class="formula-main">$$f \\text{ is increasing on } I \\;\\;\\iff\\;\\; \\forall x_1, x_2 \\in I,\\;\\; x_1 < x_2 \\;\\Rightarrow\\; f(x_1) < f(x_2)$$ $$f \\text{ is decreasing on } I \\;\\;\\iff\\;\\; \\forall x_1, x_2 \\in I,\\;\\; x_1 < x_2 \\;\\Rightarrow\\; f(x_1) > f(x_2)$$</div><div class="formula-sub">Pick any two inputs from the interval. The one further to the right must produce a larger output (increasing) or a smaller output (decreasing).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Strictly increasing</div><div class="card-body">$x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$. No flat patches allowed — every step to the right is a strict step up.</div></div>
<div class="calc-card"><div class="card-title">Strictly decreasing</div><div class="card-body">$x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$. Every step to the right is a strict step down.</div></div>
<div class="calc-card"><div class="card-title">Non-decreasing (weakly increasing)</div><div class="card-body">$x_1 < x_2 \\Rightarrow f(x_1) \\le f(x_2)$. Flat plateaus are allowed; the function never goes down.</div></div>
<div class="calc-card"><div class="card-title">Monotonic</div><div class="card-body">A function that is either increasing throughout $I$ or decreasing throughout $I$. The opposite case (alternating ups and downs) is called <em>non-monotonic</em>.</div></div>
</div>

<p class="l-text"><strong>A crucial subtlety.</strong> Whether a function is increasing depends on the interval you ask about. The parabola $f(x) = x^2$ is <em>decreasing</em> on $(-\\infty, 0]$ and <em>increasing</em> on $[0, \\infty)$. Saying "$f(x) = x^2$ is increasing" with no interval attached is meaningless. Every monotonicity statement must come with the interval on which it holds.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is $f(x) = 1/x$ a decreasing function on $\\mathbb{R} \\setminus \\{0\\}$? Many students answer "yes" instantly. The careful answer is: $f$ is decreasing on $(-\\infty, 0)$ and decreasing on $(0, \\infty)$, but it is <em>not</em> decreasing on the union of the two intervals — because $f(-1) = -1$ and $f(1) = 1$, so passing across $x = 0$ the function jumps from $-\\infty$ to $+\\infty$. Monotonicity is a per-interval property.</div></div>

<h2 class="lesson-title">2. The Derivative Controls Monotonicity</h2>

<div class="calc-highlight"><strong>The central theorem of this lesson:</strong> if $f$ is differentiable on an open interval $I$ and $f'(x) > 0$ throughout $I$, then $f$ is strictly increasing on $I$. If $f'(x) < 0$ throughout $I$, then $f$ is strictly decreasing on $I$. The sign of the derivative <em>is</em> the direction of the function.</div>

<p class="l-text">This is the bridge that connects two languages: the language of <em>derivatives</em> (a local, instantaneous notion: how fast is the function changing right now?) and the language of <em>monotonicity</em> (a global, comparative notion: which of two outputs is bigger?). The tool that builds the bridge is the <strong>Mean Value Theorem</strong>.</p>

<div class="calc-formula"><div class="formula-label">MEAN VALUE THEOREM (MVT)</div><div class="formula-main">$$\\text{If } f \\text{ is continuous on } [a, b] \\text{ and differentiable on } (a, b),$$ $$\\text{then } \\exists\\, c \\in (a, b) \\text{ such that } f'(c) = \\frac{f(b) - f(a)}{b - a}.$$</div><div class="formula-sub">Somewhere in the open interval, the instantaneous slope equals the average slope between the endpoints.</div></div>

<p class="l-text"><strong>How the MVT proves the monotonicity test.</strong> Suppose $f'(x) > 0$ everywhere on $(a, b)$. Pick any two points $x_1 < x_2$ in $(a, b)$. By the MVT applied to the sub-interval $[x_1, x_2]$, there is some $c$ between them with $f'(c) = (f(x_2) - f(x_1)) / (x_2 - x_1)$. The right-hand side has a positive numerator iff $f(x_2) > f(x_1)$. Since $f'(c) > 0$ and $x_2 - x_1 > 0$, the numerator must be positive. Therefore $f(x_2) > f(x_1)$, exactly the definition of strictly increasing. The same argument with the inequality reversed shows $f' < 0 \\Rightarrow f$ strictly decreasing.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$f'(x) > 0$ on $I$</div><div class="compare-item">Slope is positive everywhere</div><div class="compare-item">$f$ is <strong>strictly increasing</strong> on $I$</div><div class="compare-item">Graph climbs from left to right</div><div class="compare-item">Tangent lines lean upward</div></div><div class="compare-col"><div class="compare-title">$f'(x) < 0$ on $I$</div><div class="compare-item">Slope is negative everywhere</div><div class="compare-item">$f$ is <strong>strictly decreasing</strong> on $I$</div><div class="compare-item">Graph drops from left to right</div><div class="compare-item">Tangent lines lean downward</div></div></div>

<p class="l-text"><strong>What about $f'(x) = 0$?</strong> A derivative that vanishes at isolated points is harmless. The function $f(x) = x^3$ has $f'(x) = 3x^2$, which is $0$ only at $x = 0$ — yet $f$ is strictly increasing on the whole real line. The rule we use in practice is: if $f'(x) \\ge 0$ on $I$ and $f'(x) = 0$ at only finitely many points, then $f$ is still strictly increasing on $I$.</p>

<div class="l-note"><strong>A common mistake:</strong> students sometimes write "$f'(x) = 0 \\Rightarrow f$ is constant." That is only true if the derivative is zero on a whole interval, not at isolated points. A single point where the derivative vanishes does not flatten the function.</div>

<div class="calc-graph"><div id="plot-l23-monotonic-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = x^3/3 - x$ on top, its derivative $f'(x) = x^2 - 1$ underneath. Where $f'$ is above the $x$-axis (positive), $f$ climbs. Where $f'$ is below the $x$-axis (negative), $f$ falls. The two zero-crossings of $f'$ (at $x = \\pm 1$) mark exactly the places where $f$ stops climbing and starts falling, or vice versa.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fs=[];var dfs=[];for(var i=-200;i<=200;i++){var x=i/80;xs.push(x);fs.push(x*x*x/3 - x);dfs.push(x*x - 1);}
var fLine={x:xs,y:fs,mode:'lines',name:'f(x) = x³/3 − x',line:{color:'#3b82f6',width:2.6},xaxis:'x',yaxis:'y'};
var dfLineNeg={x:[],y:[],mode:'lines',name:"f'(x) < 0",line:{color:'#ef4444',width:2.6},xaxis:'x2',yaxis:'y2'};
var dfLinePos={x:[],y:[],mode:'lines',name:"f'(x) > 0",line:{color:'#22c55e',width:2.6},xaxis:'x2',yaxis:'y2'};
for(var j=0;j<xs.length;j++){if(dfs[j]<0){dfLineNeg.x.push(xs[j]);dfLineNeg.y.push(dfs[j]);}else{dfLinePos.x.push(xs[j]);dfLinePos.y.push(dfs[j]);}}
var critsTop={x:[-1,1],y:[2/3,-2/3],mode:'markers',name:'critical pts',marker:{size:10,color:'#c8a96e',line:{color:'#0a0a0a',width:1.5}},xaxis:'x',yaxis:'y',showlegend:false};
var critsBot={x:[-1,1],y:[0,0],mode:'markers',marker:{size:10,color:'#c8a96e',line:{color:'#0a0a0a',width:1.5}},xaxis:'x2',yaxis:'y2',showlegend:false};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:2,columns:1,pattern:'independent',roworder:'top to bottom'},xaxis:{anchor:'y',domain:[0,1],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{anchor:'x',domain:[0.55,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'f(x)'},xaxis2:{anchor:'y2',domain:[0,1],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis2:{anchor:'x2',domain:[0,0.42],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:"f'(x)"},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-monotonic-en',[fLine,dfLineNeg,dfLinePos,critsTop,critsBot],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Critical Points — Where the Action Happens</h2>

<div class="calc-highlight"><strong>The places where $f$ might change direction are exactly the places where $f'(x) = 0$ or $f'(x)$ does not exist.</strong> These are called <em>critical points</em> (sometimes <em>stationary points</em>, although mathematicians reserve "stationary" for the $f' = 0$ subcase). They are the only candidates for local maxima and local minima.</div>

<p class="l-text">Why must extrema sit at critical points? Suppose $f$ has a local maximum at $x_0$ and $f'(x_0)$ exists. Then immediately to the left of $x_0$, $f$ must be rising (so $f' \\ge 0$); immediately to the right, $f$ must be falling (so $f' \\le 0$). The only value that fits both inequalities is $f'(x_0) = 0$. The same argument, with the inequalities reversed, handles local minima. So <em>wherever a smooth function has a local extremum, the derivative vanishes</em>. This is Fermat's theorem.</p>

<div class="calc-formula"><div class="formula-label">CRITICAL POINT — DEFINITION</div><div class="formula-main">$$x_0 \\text{ is a critical point of } f \\;\\;\\iff\\;\\; f'(x_0) = 0 \\;\\text{ or }\\; f'(x_0) \\text{ does not exist}$$</div><div class="formula-sub">Critical points are candidates only — not every critical point is a local extremum. The First-Derivative Test in section 4 decides.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Type 1: $f'(x_0) = 0$</div><div class="card-body">Smooth horizontal tangent. Example: $f(x) = x^2$ at $x_0 = 0$. The derivative $f'(x) = 2x$ vanishes at $0$.</div></div>
<div class="calc-card"><div class="card-title">Type 2: $f'(x_0)$ DNE — corner</div><div class="card-body">A sharp corner. Example: $f(x) = |x|$ at $x_0 = 0$. Left slope is $-1$, right slope is $+1$ — no single value.</div></div>
<div class="calc-card"><div class="card-title">Type 3: $f'(x_0)$ DNE — vertical tangent</div><div class="card-body">Slope blows up. Example: $f(x) = \\sqrt[3]{x}$ at $x_0 = 0$. The derivative $f'(x) = 1/(3 x^{2/3}) \\to \\infty$.</div></div>
<div class="calc-card"><div class="card-title">Type 4: $f'(x_0)$ DNE — endpoint</div><div class="card-body">If $f$ is only defined for $x \\ge 0$, then $x = 0$ is on the boundary of the domain. One-sided derivative may exist, but two-sided does not.</div></div>
</div>

<p class="l-text"><strong>Hunting for critical points in practice.</strong> Given $f$, you do two things:</p>

<ol class="l-list" style="margin-left:1.5rem">
<li>Compute $f'(x)$ using the differentiation rules from lessons 19–22.</li>
<li>Identify all values of $x$ in the domain of $f$ where $f'(x) = 0$ <em>and</em> all values where $f'(x)$ is undefined (typically: division by zero in $f'$, square roots of negatives, corners visible from the formula).</li>
</ol>

<p class="l-text">The complete list — solutions of $f'(x) = 0$ <em>plus</em> places where $f'$ is undefined but $f$ itself is defined — is the set of critical points.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Find all critical points</strong> of $f(x) = x^4 - 4x^3 + 4x^2 + 1$.<br><br>Compute the derivative: $f'(x) = 4x^3 - 12x^2 + 8x = 4x(x^2 - 3x + 2) = 4x(x-1)(x-2)$.<br><br>Setting $f'(x) = 0$ gives $x = 0$, $x = 1$, $x = 2$. The derivative is a polynomial, so it is defined everywhere — no Type-2/3/4 critical points.<br><br><strong>Critical points: $x = 0, 1, 2$.</strong></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Find all critical points</strong> of $g(x) = x^{2/3}$.<br><br>Domain: all real $x$ (cube root is defined for negatives).<br><br>Derivative: $g'(x) = \\dfrac{2}{3} x^{-1/3} = \\dfrac{2}{3 \\sqrt[3]{x}}$. This is zero <em>nowhere</em>, but it is undefined at $x = 0$ (division by $0$).<br><br>Since $g(0) = 0$ exists, $x = 0$ is in the domain. <strong>Critical point: $x = 0$</strong> (Type 3, vertical tangent — the graph forms a cusp there).</div></div>

<h2 class="lesson-title">4. The First-Derivative Test</h2>

<div class="calc-highlight"><strong>The First-Derivative Test classifies each critical point by examining the sign of $f'$ on the two sides.</strong> If $f'$ flips from $+$ to $-$, you have a local maximum. If it flips from $-$ to $+$, you have a local minimum. If the sign does not change, you have neither — only a horizontal-tangent inflection or a similar degenerate case.</div>

<p class="l-text">This test is a direct consequence of the monotonicity theorem of section 2. Just before a local maximum the function is going up ($f' > 0$); just after, the function is going down ($f' < 0$). The critical point sits at the top of a hump. Local minima are humps turned upside down.</p>

<div class="calc-formula"><div class="formula-label">FIRST-DERIVATIVE TEST</div><div class="formula-main">Let $x_0$ be a critical point of a continuous $f$. Look at the sign of $f'$ on small intervals $(x_0 - \\delta,\\, x_0)$ and $(x_0,\\, x_0 + \\delta)$.</div><div class="formula-sub"><strong>Sign change $+ \\to -$:</strong> $x_0$ is a <em>local maximum</em>. &nbsp;&nbsp; <strong>Sign change $- \\to +$:</strong> $x_0$ is a <em>local minimum</em>. &nbsp;&nbsp; <strong>No sign change:</strong> $x_0$ is neither (a possible inflection).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Local Maximum</div><div class="card-body">$f'$ goes from $+$ to $-$. The function rises up to $x_0$, peaks, then falls. The point $(x_0, f(x_0))$ is the top of a local hump.</div></div>
<div class="calc-card"><div class="card-title">Local Minimum</div><div class="card-body">$f'$ goes from $-$ to $+$. The function falls down to $x_0$, bottoms out, then rises. The point $(x_0, f(x_0))$ is the bottom of a local valley.</div></div>
<div class="calc-card"><div class="card-title">Neither</div><div class="card-body">$f'$ has the same sign on both sides (both $+$ or both $-$). The function passes through the critical point without changing direction. Classic example: $f(x) = x^3$ at $x_0 = 0$.</div></div>
</div>

<div class="l-note"><strong>Word of warning.</strong> The First-Derivative Test only works if $f$ is continuous at $x_0$. If $f$ has a jump at the critical point, you must analyse the function value directly, not just the sign of $f'$.</div>

<h2 class="lesson-title">5. The Sign Chart — A 4-Step Recipe</h2>

<p class="l-text">In practice, classifying critical points is almost always done with a <strong>sign chart</strong> (Turkish: <em>işaret tablosu</em>). The recipe takes four steps and works for any reasonable function:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Compute $f'(x)$</div><div class="card-body">Apply the differentiation rules. Try to factor the result completely; a factored derivative makes sign analysis trivial.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Find all critical points</div><div class="card-body">Solve $f'(x) = 0$ and identify all $x$ where $f'(x)$ does not exist. Mark them on a number line.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Test the sign on each sub-interval</div><div class="card-body">The critical points divide the real line (or the domain of $f$) into open intervals. Pick a convenient test point inside each interval and evaluate $f'$ there; the sign of $f'$ at that point is the sign throughout the interval (since $f'$ is continuous between critical points).</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Read off the conclusions</div><div class="card-body">Intervals with $+$ sign: $f$ is increasing there. Intervals with $-$ sign: $f$ is decreasing there. Each critical point is classified by the $\\pm$ pattern around it (see the First-Derivative Test).</div></div>
</div>

<p class="l-text"><strong>How to draw it.</strong> A sign chart for $f'$ is usually written like this:</p>

<pre class="calc-code" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.9rem 1.1rem;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.55;color:#ebe6dc">
x       |  -∞  ...  c₁  ...  c₂  ...  +∞
--------+----------------------------------
f'(x)   |       +     0    -    0     +
--------+----------------------------------
f(x)    |        ↗   max   ↘   min    ↗
</pre>

<p class="l-text">Read the bottom row from left to right and you have the complete monotonic behaviour of $f$: it rises, peaks at $c_1$, falls, bottoms out at $c_2$, then rises again.</p>

<h2 class="lesson-title">6. Worked Example 1 — $f(x) = x^3 - 3x$</h2>

<div class="calc-example"><div class="example-label">CLASSIC CUBIC</div><div class="example-body">Analyse $f(x) = x^3 - 3x$: find the intervals where it is increasing or decreasing, and classify every critical point.<br><br><strong>Step 1.</strong> $f'(x) = 3x^2 - 3 = 3(x^2 - 1) = 3(x - 1)(x + 1)$.<br><br><strong>Step 2.</strong> $f'(x) = 0$ when $x = -1$ or $x = 1$. The derivative is a polynomial, defined everywhere. So the critical points are $x = -1$ and $x = 1$.<br><br><strong>Step 3.</strong> Test points: take $x = -2$, $x = 0$, $x = 2$ — one inside each sub-interval.<br><br>$f'(-2) = 3 \\cdot 3 = 9 > 0$. &nbsp;&nbsp; $f'(0) = -3 < 0$. &nbsp;&nbsp; $f'(2) = 3 \\cdot 3 = 9 > 0$.<br><br><strong>Step 4.</strong> Sign chart:<br><br><span style="font-family:'Geist Mono',monospace">x &nbsp;&nbsp; | -∞ ........... -1 ........... 1 ........... +∞<br>f'(x) | &nbsp; + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;+<br>f(x) &nbsp;| &nbsp; ↗ &nbsp;&nbsp;&nbsp;max&nbsp;&nbsp; ↘ &nbsp;&nbsp;min&nbsp;&nbsp; ↗</span><br><br>Increasing on $(-\\infty, -1) \\cup (1, \\infty)$, decreasing on $(-1, 1)$.<br>Local maximum at $x = -1$, with value $f(-1) = -1 + 3 = \\mathbf{2}$.<br>Local minimum at $x = 1$, with value $f(1) = 1 - 3 = \\mathbf{-2}$.</div></div>

<div class="calc-graph"><div id="plot-l23-cubic-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the cubic $f(x) = x^3 - 3x$ with its two critical points highlighted: a local maximum at $(-1, 2)$ and a local minimum at $(1, -2)$. The function rises on $(-\\infty, -1)$, falls on $(-1, 1)$, and rises again on $(1, \\infty)$ — exactly what the sign chart predicted.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fs=[];for(var i=-220;i<=220;i++){var x=i/80;xs.push(x);fs.push(x*x*x - 3*x);}
var fLine={x:xs,y:fs,mode:'lines',name:'f(x) = x³ − 3x',line:{color:'#3b82f6',width:2.6}};
var maxPt={x:[-1],y:[2],mode:'markers+text',name:'local max (−1, 2)',marker:{size:14,color:'#22c55e',line:{color:'#0a0a0a',width:1.5}},text:['max'],textposition:'top center',textfont:{color:'#22c55e',size:12}};
var minPt={x:[1],y:[-2],mode:'markers+text',name:'local min (1, −2)',marker:{size:14,color:'#ef4444',line:{color:'#0a0a0a',width:1.5}},text:['min'],textposition:'bottom center',textfont:{color:'#ef4444',size:12}};
var tanMax={x:[-1.6,-0.4],y:[2,2],mode:'lines',name:'tangent at max',line:{color:'rgba(34,197,94,0.55)',width:2,dash:'dash'},showlegend:false};
var tanMin={x:[0.4,1.6],y:[-2,-2],mode:'lines',name:'tangent at min',line:{color:'rgba(239,68,68,0.55)',width:2,dash:'dash'},showlegend:false};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.8,2.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-cubic-en',[fLine,tanMax,tanMin,maxPt,minPt],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Worked Example 2 — $f(x) = \\dfrac{x^2}{x - 1}$</h2>

<div class="calc-example"><div class="example-label">RATIONAL FUNCTION</div><div class="example-body">Analyse $f(x) = \\dfrac{x^2}{x - 1}$ on its natural domain.<br><br><strong>Domain.</strong> All $x$ except $x = 1$ (denominator zero).<br><br><strong>Step 1 (derivative).</strong> Quotient rule:<br>$f'(x) = \\dfrac{2x(x - 1) - x^2 \\cdot 1}{(x - 1)^2} = \\dfrac{2x^2 - 2x - x^2}{(x - 1)^2} = \\dfrac{x^2 - 2x}{(x - 1)^2} = \\dfrac{x(x - 2)}{(x - 1)^2}.$<br><br><strong>Step 2 (critical points).</strong> $f'(x) = 0$ when the numerator $x(x - 2) = 0$, that is $x = 0$ or $x = 2$. The point $x = 1$ is not a critical point — it is <em>outside the domain of $f$</em>, so we just remove it from the number line.<br><br><strong>Step 3 (sign test).</strong> The denominator $(x - 1)^2$ is always positive (where defined), so the sign of $f'$ is the sign of $x(x - 2)$.<br><br>$f'(-1) = (-1)(-3) > 0$. &nbsp; $f'(0.5) = (0.5)(-1.5) < 0$. &nbsp; $f'(1.5) = (1.5)(-0.5) < 0$. &nbsp; $f'(3) = (3)(1) > 0$.<br><br><strong>Step 4 (sign chart).</strong><br><br><span style="font-family:'Geist Mono',monospace">x &nbsp;&nbsp; | -∞ ... 0 ... 1 ... 2 ... +∞<br>f'(x) | + &nbsp;&nbsp; 0 &nbsp;&nbsp; − &nbsp; ∥ &nbsp; − &nbsp;&nbsp; 0 &nbsp; +<br>f(x) &nbsp;| ↗ &nbsp;&nbsp;max&nbsp; ↘ &nbsp; ∥ &nbsp; ↘ &nbsp;&nbsp;min&nbsp; ↗</span><br><br>($\\parallel$ marks the vertical asymptote at $x = 1$.)<br><br>Increasing on $(-\\infty, 0) \\cup (2, \\infty)$. Decreasing on $(0, 1) \\cup (1, 2)$.<br>Local maximum at $x = 0$, value $f(0) = \\mathbf{0}$.<br>Local minimum at $x = 2$, value $f(2) = 4/1 = \\mathbf{4}$.<br><br>Notice the counter-intuitive feature: the local <em>minimum</em> value $4$ is <em>larger</em> than the local <em>maximum</em> value $0$. This is possible because the function blows up to $\\pm \\infty$ between them — local extrema are only local.</div></div>

<h2 class="lesson-title">8. Worked Example 3 — $f(x) = \\sin x + \\cos x$ on $[0, 2\\pi]$</h2>

<div class="calc-example"><div class="example-label">TRIGONOMETRIC FUNCTION ON A CLOSED INTERVAL</div><div class="example-body">Find all critical points of $f(x) = \\sin x + \\cos x$ in $[0, 2\\pi]$ and classify them.<br><br><strong>Step 1.</strong> $f'(x) = \\cos x - \\sin x$.<br><br><strong>Step 2.</strong> $f'(x) = 0 \\;\\Leftrightarrow\\; \\cos x = \\sin x \\;\\Leftrightarrow\\; \\tan x = 1 \\;\\Leftrightarrow\\; x = \\dfrac{\\pi}{4} + k\\pi$.<br><br>In $[0, 2\\pi]$ this gives $x = \\dfrac{\\pi}{4}$ and $x = \\dfrac{5\\pi}{4}$.<br><br><strong>Step 3.</strong> Test:<br>$f'(0) = 1 - 0 = 1 > 0$.<br>$f'(\\pi/2) = 0 - 1 = -1 < 0$.<br>$f'(3\\pi/2) = 0 - (-1) = 1 > 0$.<br><br><strong>Step 4.</strong> Sign chart on $[0, 2\\pi]$:<br><br><span style="font-family:'Geist Mono',monospace">x &nbsp;&nbsp; | 0 ... π/4 ... 5π/4 ... 2π<br>f'(x) | + &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;−&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;+<br>f(x) &nbsp;| ↗ &nbsp;max&nbsp; ↘ &nbsp;&nbsp;min&nbsp; ↗</span><br><br>Local maximum at $x = \\pi/4$: $f(\\pi/4) = \\sin(\\pi/4) + \\cos(\\pi/4) = \\dfrac{\\sqrt 2}{2} + \\dfrac{\\sqrt 2}{2} = \\boldsymbol{\\sqrt 2}$.<br>Local minimum at $x = 5\\pi/4$: $f(5\\pi/4) = -\\dfrac{\\sqrt 2}{2} - \\dfrac{\\sqrt 2}{2} = \\boldsymbol{-\\sqrt 2}$.<br><br>These are also the absolute maximum and absolute minimum on $[0, 2\\pi]$, since the endpoint values $f(0) = 1$ and $f(2\\pi) = 1$ both lie strictly between $-\\sqrt 2$ and $\\sqrt 2$.</div></div>

<h2 class="lesson-title">9. Absolute Extrema on a Closed Interval</h2>

<div class="calc-highlight"><strong>The Extreme Value Theorem:</strong> a function that is continuous on a closed bounded interval $[a, b]$ attains its maximum and its minimum value somewhere in the interval. Both are guaranteed to exist. The question becomes: where?</div>

<p class="l-text">The complete recipe for finding absolute extrema on $[a, b]$ has just three steps:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Find critical points in $(a, b)$</div><div class="card-body">Solve $f'(x) = 0$ and identify where $f'$ is undefined, but only count those critical points that lie strictly inside the interval.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Evaluate $f$ at each candidate</div><div class="card-body">Compute the function value at every critical point from Step 1 <em>and</em> at both endpoints $a$ and $b$.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Pick the largest and smallest</div><div class="card-body">The biggest of all those numbers is the absolute maximum; the smallest is the absolute minimum. The First-Derivative Test is not even needed — you just compare values.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the absolute max and min of $f(x) = x^3 - 3x + 2$ on $[-2, 2]$.<br><br><strong>Step 1.</strong> $f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$. Both lie inside $(-2, 2)$.<br><br><strong>Step 2.</strong> Candidates and their values:<br>$f(-2) = -8 + 6 + 2 = 0$.<br>$f(-1) = -1 + 3 + 2 = 4$.<br>$f(1) = 1 - 3 + 2 = 0$.<br>$f(2) = 8 - 6 + 2 = 4$.<br><br><strong>Step 3.</strong> Maximum value: $\\mathbf{4}$, attained at $x = -1$ and $x = 2$.<br>Minimum value: $\\mathbf{0}$, attained at $x = -2$ and $x = 1$.<br><br>Notice that two different $x$-values produce the same extremum value in this problem — that is perfectly allowed.</div></div>

<h2 class="lesson-title">10. Classical Exercises</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body">Find the intervals where $f(x) = 2x^3 - 9x^2 + 12x - 4$ is increasing and decreasing. Classify the critical points.<br><br><em>Answer.</em> $f'(x) = 6x^2 - 18x + 12 = 6(x - 1)(x - 2)$. Critical points $x = 1, 2$. Increasing on $(-\\infty, 1) \\cup (2, \\infty)$, decreasing on $(1, 2)$. Local max at $(1, 1)$, local min at $(2, 0)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body">Show that $f(x) = x^3 + x$ is strictly increasing on $\\mathbb{R}$ and has no local extremum.<br><br><em>Answer.</em> $f'(x) = 3x^2 + 1 > 0$ for every real $x$. By the monotonicity theorem $f$ is strictly increasing on $\\mathbb{R}$. Since $f'$ never equals zero and never fails to exist, there are no critical points and therefore no local extrema.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body">Determine the absolute extrema of $f(x) = x^4 - 8x^2 + 16$ on $[-3, 3]$.<br><br><em>Answer.</em> $f'(x) = 4x^3 - 16x = 4x(x^2 - 4) = 4x(x-2)(x+2)$. Critical points: $x = -2, 0, 2$, all inside $(-3, 3)$. Values: $f(-3) = 81 - 72 + 16 = 25$; $f(-2) = 0$; $f(0) = 16$; $f(2) = 0$; $f(3) = 25$. Absolute max $= 25$ at $x = \\pm 3$; absolute min $= 0$ at $x = \\pm 2$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body">For $f(x) = (x - 2)^{2/3}$, find every critical point and classify it.<br><br><em>Answer.</em> $f'(x) = \\dfrac{2}{3} (x - 2)^{-1/3} = \\dfrac{2}{3 \\sqrt[3]{x - 2}}$. Never zero, but undefined at $x = 2$, and $f(2) = 0$ is defined. So $x = 2$ is a (Type 3) critical point. On $x < 2$, $f' < 0$; on $x > 2$, $f' > 0$. Sign change $- \\to +$: <strong>local minimum at $x = 2$</strong> with value $f(2) = 0$ (cusp).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body">Find the absolute extrema of $g(x) = x + \\dfrac{4}{x}$ on $[1, 4]$.<br><br><em>Answer.</em> $g'(x) = 1 - \\dfrac{4}{x^2} = \\dfrac{x^2 - 4}{x^2}$. $g'(x) = 0 \\Rightarrow x = \\pm 2$. Only $x = 2$ lies in $[1, 4]$. Values: $g(1) = 1 + 4 = 5$; $g(2) = 2 + 2 = 4$; $g(4) = 4 + 1 = 5$. Absolute min $= 4$ at $x = 2$; absolute max $= 5$ at $x = 1$ and $x = 4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body">Find all $a \\in \\mathbb{R}$ for which $f(x) = x^3 + ax^2 + 3x + 1$ is strictly increasing on all of $\\mathbb{R}$.<br><br><em>Answer.</em> $f'(x) = 3x^2 + 2ax + 3$. For $f$ to be strictly increasing on $\\mathbb{R}$ we need $f'(x) \\ge 0$ everywhere. The discriminant of this quadratic in $x$ must be $\\le 0$: $\\Delta = (2a)^2 - 4 \\cdot 3 \\cdot 3 = 4a^2 - 36 \\le 0 \\Rightarrow a^2 \\le 9 \\Rightarrow -3 \\le a \\le 3$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body">Determine the local extrema of $f(x) = x \\, e^{-x}$ for $x \\ge 0$.<br><br><em>Answer.</em> $f'(x) = e^{-x} - x e^{-x} = e^{-x}(1 - x)$. Critical point at $x = 1$ ($e^{-x}$ is always positive). Sign: $f'(0) > 0$, $f'(2) < 0$. Pattern $+ \\to -$: <strong>local maximum at $x = 1$</strong> with value $f(1) = 1/e \\approx 0.3679$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body">A rectangle has perimeter $20$ cm. Find the dimensions that maximise its area.<br><br><em>Answer.</em> Let the sides be $x$ and $10 - x$, both positive. Area $A(x) = x(10 - x) = 10x - x^2$, for $x \\in (0, 10)$. $A'(x) = 10 - 2x = 0 \\Rightarrow x = 5$. $A'$ changes from $+$ to $-$ at $x = 5$, so it is a maximum. Dimensions $5 \\times 5$ cm — the rectangle is a square. Maximum area: $25$ cm². (Among rectangles of fixed perimeter, the square is always the area-maximiser.)</div></div>

<div class="calc-graph"><div id="plot-l23-signchart-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a schematic sign chart for $f'(x) = (x + 1)(x - 1)(x - 3)$. Above the axis the cubic is positive ($f$ increasing); below the axis it is negative ($f$ decreasing). The three zero crossings are the critical points of the original $f$, and the alternating $+/-$ pattern translates into the alternating $\\nearrow / \\searrow$ pattern of $f$ itself.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-200;i<=400;i++){var x=i/80;xs.push(x);ys.push((x+1)*(x-1)*(x-3));}
var pos={x:[],y:[]};var neg={x:[],y:[]};for(var j=0;j<xs.length;j++){if(ys[j]>=0){pos.x.push(xs[j]);pos.y.push(ys[j]);}else{neg.x.push(xs[j]);neg.y.push(ys[j]);}}
var posLine={x:pos.x,y:pos.y,mode:'lines',name:"f'(x) > 0  →  f ↗",line:{color:'#22c55e',width:3},fill:'tozeroy',fillcolor:'rgba(34,197,94,0.15)'};
var negLine={x:neg.x,y:neg.y,mode:'lines',name:"f'(x) < 0  →  f ↘",line:{color:'#ef4444',width:3},fill:'tozeroy',fillcolor:'rgba(239,68,68,0.15)'};
var crits={x:[-1,1,3],y:[0,0,0],mode:'markers+text',name:'critical points',marker:{size:14,color:'#c8a96e',line:{color:'#0a0a0a',width:1.5}},text:['x=−1','x=1','x=3'],textposition:'top center',textfont:{color:'#c8a96e',size:12}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.35)'},yaxis:{title:"f'(x)",range:[-7,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.35)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-signchart-en',[posLine,negLine,crits],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Concavity and the Second-Derivative Test</h2>

<div class="calc-highlight"><strong>The second derivative $f''(x)$ tells you the curvature of the graph.</strong> Where $f'' > 0$ the curve is <em>concave up</em> (cup-shaped, $\\smile$); where $f'' < 0$ the curve is <em>concave down</em> (cap-shaped, $\\frown$). The point where concavity flips is called an <em>inflection point</em>. Together, the signs of $f'$ and $f''$ classify every local behaviour into one of four cases.</div>

<p class="l-text">Consider $f(x) = x^3 - 3x^2 + 2$. Differentiating twice gives $f'(x) = 3x^2 - 6x$ and $f''(x) = 6x - 6$. The second derivative vanishes at $x = 1$, switching from negative (concave down) on $(-\\infty, 1)$ to positive (concave up) on $(1, \\infty)$. So $x = 1$ is an inflection point, with $f(1) = 1 - 3 + 2 = 0$.</p>

<div class="calc-graph"><div id="plot-l23-concavity-en-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f(x) = x^3 - 3x^2 + 2$ in blue with its second derivative $f''(x) = 6x - 6$ in gold. The shaded background marks the concavity regions: green for concave down ($f'' < 0$, left of $x = 1$) and red for concave up ($f'' > 0$, right of $x = 1$). The orange marker is the inflection point at $(1, 0)$ where curvature flips.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fs=[];var ddfs=[];for(var i=-100;i<=300;i++){var x=i/80;xs.push(x);fs.push(x*x*x - 3*x*x + 2);ddfs.push(6*x - 6);}
var concDown={x:[-1.25,-1.25,1,1],y:[-12,12,12,-12],fill:'toself',mode:'lines',line:{width:0},fillcolor:'rgba(34,197,94,0.12)',name:"concave down (f'' < 0)",hoverinfo:'skip'};
var concUp={x:[1,1,3.75,3.75],y:[-12,12,12,-12],fill:'toself',mode:'lines',line:{width:0},fillcolor:'rgba(239,68,68,0.12)',name:"concave up (f'' > 0)",hoverinfo:'skip'};
var fLine={x:xs,y:fs,mode:'lines',name:'f(x) = x³ − 3x² + 2',line:{color:'#3b82f6',width:2.8}};
var ddLine={x:xs,y:ddfs,mode:'lines',name:"f''(x) = 6x − 6",line:{color:'#c8a96e',width:2.2,dash:'dot'}};
var inflPt={x:[1],y:[0],mode:'markers+text',name:'inflection (1, 0)',marker:{size:14,color:'#f59e0b',line:{color:'#0a0a0a',width:1.5}},text:['inflection'],textposition:'top right',textfont:{color:'#f59e0b',size:12}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.25,3.75],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'value',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-concavity-en-extra',[concDown,concUp,fLine,ddLine,inflPt],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">The four combinations of $\\operatorname{sign}(f')$ and $\\operatorname{sign}(f'')$ classify every local shape. The table below summarises which shape arises in each case:</p>

<div style="margin:1.2rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.10);color:#3b82f6;text-align:left">
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">$f'$ sign</th>
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">$f''$ sign</th>
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">Shape</th>
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">Meaning</th>
</tr>
</thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Rising &amp; concave up ($\\smile$)</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Climbing and accelerating — slope grows steeper</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Rising &amp; concave down ($\\frown$)</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Climbing but decelerating — approaching a local max</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Falling &amp; concave up ($\\smile$)</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Falling but decelerating — approaching a local min</td></tr>
<tr><td style="padding:0.65rem 0.9rem;font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem;font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem">Falling &amp; concave down ($\\frown$)</td><td style="padding:0.65rem 0.9rem">Falling and accelerating — slope grows steeper downward</td></tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>Second-Derivative Test for critical points.</strong> If $f'(x_0) = 0$ and $f''(x_0) > 0$, then $x_0$ is a local minimum (concave up at the critical point — a valley). If $f'(x_0) = 0$ and $f''(x_0) < 0$, then $x_0$ is a local maximum (concave down — a peak). If $f''(x_0) = 0$, the test is inconclusive and you fall back to the First-Derivative Test.</div>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">SUMMARY — IF YOU REMEMBER ONLY ONE THING</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Sign of $f'$ tells direction of $f$.</strong> $f' > 0 \\Rightarrow$ increasing, $f' < 0 \\Rightarrow$ decreasing.</li>
<li><strong>Critical points</strong> are solutions of $f'(x) = 0$ together with points where $f'$ is undefined (but $f$ exists).</li>
<li><strong>First-Derivative Test:</strong> $+ \\to -$ at a critical point gives a local maximum; $- \\to +$ gives a local minimum; no sign change gives neither.</li>
<li><strong>Absolute extrema on $[a, b]$:</strong> compare the values of $f$ at the interior critical points and at the two endpoints — biggest wins, smallest loses.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Türev sadece teğet doğrusunun eğimi değildir — hareketin dedektörüdür.</strong> $f'(x)$ pozitif olduğunda fonksiyon tırmanıyordur; negatif olduğunda iniyordur; tam sıfır olduğunda fonksiyon o anda ne yükseliyor ne de alçalıyordur. Bu derste tek bir gözlemi bir eğrinin şeklini anlamak için eksiksiz bir stratejiye dönüştüreceğiz: nerede yükseldiğini, nerede alçaldığını, nerede yön değiştirdiğini ve grafiğine hiç bakmadan her yerel maksimumu ve yerel minimumu nasıl bulacağımızı öğreneceğiz.</p>

<p class="l-text">Bu ders, diferansiyel hesabın atölyesidir. Bir fonksiyon alıp bir türev hesaplamayı, küçük bir işaret tablosu kurmayı ve tüm monoton davranışını okumayı öğreneceksin. Teknik yeterince pratik yaptıktan sonra mekaniktir, ama altında yatan fikir — türevin işaretinin fonksiyonun yönünü kontrol ettiği — matematiğin en derin fikirlerinden biridir. En basit "maksimum hacimli kutu" sorusundan üniversite sınavındaki ileri ekstremum problemlerine kadar çözdüğün her optimizasyon probleminde karşına çıkacak.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir aralıkta <em>artan</em> ve <em>azalan</em> fonksiyonun resmi tanımını ifade etmeyi</li>
<li>Ortalama Değer Teoremi'ni kullanarak monotonluk testini gerekçelendirmeyi: $f' > 0 \\Rightarrow f$ artandır</li>
<li><em>Kritik noktaları</em> belirlemeyi — $f'(x) = 0$ olan veya $f'(x)$ tanımsız olan yerleri</li>
<li><strong>İlk Türev Testi</strong>'ni uygulayarak her kritik noktayı yerel maksimum, yerel minimum veya hiçbiri olarak sınıflandırmayı</li>
<li>$f'$ için <em>işaret tablosunu</em> dört temiz adımda kurmayı ve monoton aralıkları doğrudan oradan okumayı</li>
<li>Kapalı bir $[a, b]$ aralığında sürekli bir fonksiyonun <em>mutlak</em> maksimum ve minimumunu bulmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Artan ve Azalan Fonksiyon — Sezgi ve Resmi Tanım</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir yürüyüşün yükseklik profilini düşün. Patika yukarı çıkarken, yüksekliğin <em>artıyor</em>. Aşağı inerken, <em>azalıyor</em>. Yürüyüşün zirveleri yukarının aşağıya dönüştüğü yerlerdir (yerel maksimum); vadi dipleri aşağının yukarıya dönüştüğü yerlerdir (yerel minimum). Türev, herhangi bir fonksiyon için ne yapıyorsa, bir yürüyüşçü için altimetre onu yapar — değerin ne hızla yükselip alçaldığını ölçer.</div>

<p class="l-text">Fikri türevle bağlamadan önce, bir fonksiyonun artan olmasının ne demek olduğunu kesin olarak söylememiz lazım. İşte her Türk lise ders kitabının üzerinde anlaştığı resmi tanım:</p>

<div class="calc-formula"><div class="formula-label">BİR ARALIKTA ARTAN / AZALAN</div><div class="formula-main">$$f,\\, I \\text{ aralığında artandır} \\;\\;\\iff\\;\\; \\forall x_1, x_2 \\in I,\\;\\; x_1 < x_2 \\;\\Rightarrow\\; f(x_1) < f(x_2)$$ $$f,\\, I \\text{ aralığında azalandır} \\;\\;\\iff\\;\\; \\forall x_1, x_2 \\in I,\\;\\; x_1 < x_2 \\;\\Rightarrow\\; f(x_1) > f(x_2)$$</div><div class="formula-sub">Aralıktan herhangi iki girdi seç. Sağda olan, daha büyük çıktı üretmelidir (artan) ya da daha küçük çıktı (azalan).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kesin artan</div><div class="card-body">$x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$. Düz parçalara izin yok — sağa doğru her adım kesin bir yukarı adım.</div></div>
<div class="calc-card"><div class="card-title">Kesin azalan</div><div class="card-body">$x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$. Sağa doğru her adım kesin bir aşağı adım.</div></div>
<div class="calc-card"><div class="card-title">Azalmayan (geniş anlamda artan)</div><div class="card-body">$x_1 < x_2 \\Rightarrow f(x_1) \\le f(x_2)$. Düz platolar serbesttir; fonksiyon hiçbir zaman aşağı inmez.</div></div>
<div class="calc-card"><div class="card-title">Monoton</div><div class="card-body">$I$ boyunca ya hep artan ya hep azalan bir fonksiyon. Tam tersi durum (iniş çıkışlar) <em>monoton olmayan</em> olarak adlandırılır.</div></div>
</div>

<p class="l-text"><strong>Önemli bir incelik.</strong> Bir fonksiyonun artan olup olmadığı, sorduğun aralığa bağlıdır. $f(x) = x^2$ parabolü, $(-\\infty, 0]$ üzerinde <em>azalan</em>, $[0, \\infty)$ üzerinde <em>artandır</em>. "$f(x) = x^2$ artandır" demek, hiçbir aralık belirtilmeden anlamsızdır. Her monotonluk ifadesi, geçerli olduğu aralıkla birlikte söylenmelidir.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$f(x) = 1/x$ fonksiyonu $\\mathbb{R} \\setminus \\{0\\}$ üzerinde azalan mıdır? Birçok öğrenci hemen "evet" der. Dikkatli cevap: $f$ hem $(-\\infty, 0)$'da hem de $(0, \\infty)$'da azalandır, ama bu iki aralığın birleşiminde azalan <em>değildir</em> — çünkü $f(-1) = -1$ ve $f(1) = 1$, yani $x = 0$ noktasından geçince fonksiyon $-\\infty$'dan $+\\infty$'a sıçrar. Monotonluk aralık-başına bir özelliktir.</div></div>

<h2 class="lesson-title">2. Türev Monotonluğu Kontrol Eder</h2>

<div class="calc-highlight"><strong>Bu dersin merkez teoremi:</strong> $f$, $I$ açık aralığında türevlenebilirse ve $f'(x) > 0$ tüm $I$ boyunca geçerliyse, $f$ üzerinde $I$ kesin artandır. Eğer $f'(x) < 0$ tüm $I$ üzerindeyse, $f$ kesin azalandır. Türevin işareti, fonksiyonun yönünün ta kendisidir.</div>

<p class="l-text">Bu, iki dili birbirine bağlayan köprüdür: <em>türev</em>in dili (yerel, anlık bir kavram: fonksiyon şu anda ne kadar hızlı değişiyor?) ve <em>monotonluk</em>un dili (küresel, karşılaştırmalı bir kavram: iki çıktıdan hangisi daha büyük?). Köprüyü kuran araç <strong>Ortalama Değer Teoremi</strong>'dir.</p>

<div class="calc-formula"><div class="formula-label">ORTALAMA DEĞER TEOREMİ (ODT)</div><div class="formula-main">$$f,\\, [a, b] \\text{ üzerinde sürekli ve } (a, b) \\text{ üzerinde türevlenebilir ise,}$$ $$\\exists\\, c \\in (a, b),\\;\\; f'(c) = \\frac{f(b) - f(a)}{b - a}.$$</div><div class="formula-sub">Açık aralığın bir yerinde, anlık eğim uç noktalar arasındaki ortalama eğime eşittir.</div></div>

<p class="l-text"><strong>ODT monotonluk testini nasıl ispatlar.</strong> Diyelim ki $(a, b)$ üzerinde her yerde $f'(x) > 0$. $(a, b)$ içinden herhangi iki $x_1 < x_2$ noktası seç. ODT'yi $[x_1, x_2]$ alt aralığına uygulayınca, aralarında öyle bir $c$ vardır ki $f'(c) = (f(x_2) - f(x_1)) / (x_2 - x_1)$. Sağ tarafın payı, ancak ve ancak $f(x_2) > f(x_1)$ ise pozitif olur. $f'(c) > 0$ ve $x_2 - x_1 > 0$ olduğundan, pay pozitif olmalıdır. O halde $f(x_2) > f(x_1)$, tam olarak kesin artanlığın tanımı. Eşitsizliği ters çevirince aynı argüman $f' < 0 \\Rightarrow f$ kesin azalandır gösterir.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$f'(x) > 0,\\; I$ üzerinde</div><div class="compare-item">Eğim her yerde pozitif</div><div class="compare-item">$f$, $I$ üzerinde <strong>kesin artandır</strong></div><div class="compare-item">Grafik soldan sağa tırmanır</div><div class="compare-item">Teğet doğruları yukarı meyilli</div></div><div class="compare-col"><div class="compare-title">$f'(x) < 0,\\; I$ üzerinde</div><div class="compare-item">Eğim her yerde negatif</div><div class="compare-item">$f$, $I$ üzerinde <strong>kesin azalandır</strong></div><div class="compare-item">Grafik soldan sağa düşer</div><div class="compare-item">Teğet doğruları aşağı meyilli</div></div></div>

<p class="l-text"><strong>$f'(x) = 0$ olunca ne olur?</strong> Yalnızca yalıtık noktalarda sıfırlanan bir türev zararsızdır. $f(x) = x^3$ fonksiyonunun türevi $f'(x) = 3x^2$, yalnızca $x = 0$'da sıfırdır — ama $f$ tüm reel doğru üzerinde kesin artandır. Pratikte kullandığımız kural şudur: eğer $f'(x) \\ge 0$ ise $I$ üzerinde ve $f'(x) = 0$ yalnızca sonlu sayıda noktada ise, $f$ hâlâ kesin artandır $I$'da.</p>

<div class="l-note"><strong>Sık karşılaşılan bir hata:</strong> öğrenciler bazen "$f'(x) = 0 \\Rightarrow f$ sabittir" yazar. Bu yalnızca türev tüm bir aralıkta sıfırsa doğrudur, yalıtık noktalarda değil. Türevin tek bir noktada kaybolması fonksiyonu düzleştirmez.</div>

<div class="calc-graph"><div id="plot-l23-monotonic-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik şunu gösterir:</strong> üstte $f(x) = x^3/3 - x$ fonksiyonu, altta türevi $f'(x) = x^2 - 1$. $f'$, $x$-ekseninin üstünde (pozitif) olduğu yerde $f$ tırmanır. $f'$, $x$-ekseninin altında (negatif) olduğu yerde $f$ düşer. $f'$'nin iki sıfır noktası ($x = \\pm 1$), $f$'nin tırmanmayı durdurup düşmeye başladığı (ya da tersi) yerleri tam olarak işaretler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fs=[];var dfs=[];for(var i=-200;i<=200;i++){var x=i/80;xs.push(x);fs.push(x*x*x/3 - x);dfs.push(x*x - 1);}
var fLine={x:xs,y:fs,mode:'lines',name:'f(x) = x³/3 − x',line:{color:'#3b82f6',width:2.6},xaxis:'x',yaxis:'y'};
var dfLineNeg={x:[],y:[],mode:'lines',name:"f'(x) < 0",line:{color:'#ef4444',width:2.6},xaxis:'x2',yaxis:'y2'};
var dfLinePos={x:[],y:[],mode:'lines',name:"f'(x) > 0",line:{color:'#22c55e',width:2.6},xaxis:'x2',yaxis:'y2'};
for(var j=0;j<xs.length;j++){if(dfs[j]<0){dfLineNeg.x.push(xs[j]);dfLineNeg.y.push(dfs[j]);}else{dfLinePos.x.push(xs[j]);dfLinePos.y.push(dfs[j]);}}
var critsTop={x:[-1,1],y:[2/3,-2/3],mode:'markers',name:'kritik nokta',marker:{size:10,color:'#c8a96e',line:{color:'#0a0a0a',width:1.5}},xaxis:'x',yaxis:'y',showlegend:false};
var critsBot={x:[-1,1],y:[0,0],mode:'markers',marker:{size:10,color:'#c8a96e',line:{color:'#0a0a0a',width:1.5}},xaxis:'x2',yaxis:'y2',showlegend:false};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:2,columns:1,pattern:'independent',roworder:'top to bottom'},xaxis:{anchor:'y',domain:[0,1],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis:{anchor:'x',domain:[0.55,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'f(x)'},xaxis2:{anchor:'y2',domain:[0,1],range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},yaxis2:{anchor:'x2',domain:[0,0.42],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:"f'(x)"},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-monotonic-tr',[fLine,dfLineNeg,dfLinePos,critsTop,critsBot],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Kritik Noktalar — Aksiyonun Olduğu Yerler</h2>

<div class="calc-highlight"><strong>$f$'nin yön değiştirebileceği yerler tam olarak $f'(x) = 0$ olan veya $f'(x)$'in tanımsız olduğu yerlerdir.</strong> Bunlara <em>kritik noktalar</em> denir (bazen <em>durağan noktalar</em>, ama matematikçiler "durağan"ı yalnızca $f' = 0$ alt durumu için ayırır). Yerel maksimum ve yerel minimum için tek adaylardır.</div>

<p class="l-text">Ekstremumlar neden kritik noktalarda olmak zorunda? Diyelim ki $f$, $x_0$'da yerel bir maksimuma sahiptir ve $f'(x_0)$ vardır. O zaman $x_0$'ın hemen solunda $f$ yükseliyor olmalıdır (yani $f' \\ge 0$); hemen sağında $f$ alçalıyor olmalıdır (yani $f' \\le 0$). Her iki eşitsizliği de sağlayan tek değer $f'(x_0) = 0$'dır. Aynı argüman, eşitsizlikler ters çevrilince, yerel minimumları halleder. Yani <em>düzgün bir fonksiyon yerel bir ekstremuma sahip olduğu her yerde türev sıfırlanır</em>. Bu Fermat'nın teoremidir.</p>

<div class="calc-formula"><div class="formula-label">KRİTİK NOKTA — TANIM</div><div class="formula-main">$$x_0,\\, f \\text{'nin kritik noktasıdır} \\;\\;\\iff\\;\\; f'(x_0) = 0 \\;\\text{ veya }\\; f'(x_0) \\text{ tanımsızdır}$$</div><div class="formula-sub">Kritik noktalar yalnızca adaylardır — her kritik nokta yerel bir ekstremum değildir. 4. bölümdeki İlk Türev Testi karar verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tip 1: $f'(x_0) = 0$</div><div class="card-body">Düzgün yatay teğet. Örnek: $f(x) = x^2$, $x_0 = 0$'da. Türev $f'(x) = 2x$, $0$'da sıfırdır.</div></div>
<div class="calc-card"><div class="card-title">Tip 2: $f'(x_0)$ yok — köşe</div><div class="card-body">Sivri bir köşe. Örnek: $f(x) = |x|$, $x_0 = 0$'da. Sol eğim $-1$, sağ eğim $+1$ — tek bir değer yok.</div></div>
<div class="calc-card"><div class="card-title">Tip 3: $f'(x_0)$ yok — dikey teğet</div><div class="card-body">Eğim patlar. Örnek: $f(x) = \\sqrt[3]{x}$, $x_0 = 0$'da. Türev $f'(x) = 1/(3 x^{2/3}) \\to \\infty$.</div></div>
<div class="calc-card"><div class="card-title">Tip 4: $f'(x_0)$ yok — uç nokta</div><div class="card-body">Eğer $f$ yalnızca $x \\ge 0$ için tanımlıysa, $x = 0$ tanım kümesinin sınırındadır. Tek-yanlı türev olabilir, ama iki-yanlı yoktur.</div></div>
</div>

<p class="l-text"><strong>Pratikte kritik nokta avı.</strong> Verilen $f$ için iki şey yaparsın:</p>

<ol class="l-list" style="margin-left:1.5rem">
<li>19–22. derslerin türev kurallarını kullanarak $f'(x)$'i hesapla.</li>
<li>$f$'nin tanım kümesinde $f'(x) = 0$ olan tüm $x$ değerlerini <em>ve</em> $f'(x)$'in tanımsız olduğu tüm değerleri belirle (genellikle: $f'$'de sıfıra bölme, negatif sayının karekökü, formülden görülen köşeler).</li>
</ol>

<p class="l-text">Tam liste — $f'(x) = 0$'ın çözümleri <em>artı</em> $f'$'nin tanımsız ama $f$'nin tanımlı olduğu yerler — kritik noktalar kümesidir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Tüm kritik noktaları bul</strong>: $f(x) = x^4 - 4x^3 + 4x^2 + 1$.<br><br>Türevi hesapla: $f'(x) = 4x^3 - 12x^2 + 8x = 4x(x^2 - 3x + 2) = 4x(x-1)(x-2)$.<br><br>$f'(x) = 0$ olunca $x = 0$, $x = 1$, $x = 2$. Türev bir polinom, her yerde tanımlı — Tip-2/3/4 kritik noktası yok.<br><br><strong>Kritik noktalar: $x = 0, 1, 2$.</strong></div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Tüm kritik noktaları bul</strong>: $g(x) = x^{2/3}$.<br><br>Tanım kümesi: tüm reel $x$ (küp kökü negatifler için de tanımlıdır).<br><br>Türev: $g'(x) = \\dfrac{2}{3} x^{-1/3} = \\dfrac{2}{3 \\sqrt[3]{x}}$. Bu <em>hiçbir yerde</em> sıfır değildir, ama $x = 0$'da tanımsızdır ($0$'a bölme).<br><br>$g(0) = 0$ tanımlı olduğundan, $x = 0$ tanım kümesindedir. <strong>Kritik nokta: $x = 0$</strong> (Tip 3, dikey teğet — grafik orada bir sivri uç oluşturur).</div></div>

<h2 class="lesson-title">4. İlk Türev Testi</h2>

<div class="calc-highlight"><strong>İlk Türev Testi her kritik noktayı $f'$'nin iki taraftaki işaretini inceleyerek sınıflandırır.</strong> Eğer $f'$ işareti $+$'dan $-$'ye değişirse, yerel bir maksimumun vardır. $-$'den $+$'ya değişirse, yerel bir minimumun. İşaret değişmezse, hiçbiri yoktur — yalnızca yatay teğetli bir büküm noktası veya benzeri bir dejenere durum.</div>

<p class="l-text">Bu test, 2. bölümdeki monotonluk teoreminin doğrudan bir sonucudur. Yerel bir maksimumun hemen öncesinde fonksiyon yükseliyor ($f' > 0$); hemen sonrasında düşüyor ($f' < 0$). Kritik nokta bir tümseğin tepesinde oturur. Yerel minimumlar baş aşağı çevrilmiş tümseklerdir.</p>

<div class="calc-formula"><div class="formula-label">İLK TÜREV TESTİ</div><div class="formula-main">$x_0$, sürekli bir $f$'nin kritik noktası olsun. $(x_0 - \\delta,\\, x_0)$ ve $(x_0,\\, x_0 + \\delta)$ küçük aralıklarında $f'$'nin işaretine bak.</div><div class="formula-sub"><strong>$+ \\to -$ değişim:</strong> $x_0$ bir <em>yerel maksimumdur</em>. &nbsp;&nbsp; <strong>$- \\to +$ değişim:</strong> $x_0$ bir <em>yerel minimumdur</em>. &nbsp;&nbsp; <strong>İşaret değişimi yok:</strong> $x_0$ hiçbiri değildir (muhtemel bir büküm).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerel Maksimum</div><div class="card-body">$f'$, $+$'dan $-$'ye geçer. Fonksiyon $x_0$'a kadar yükselir, tepe yapar, sonra düşer. $(x_0, f(x_0))$ noktası yerel bir tümseğin tepesidir.</div></div>
<div class="calc-card"><div class="card-title">Yerel Minimum</div><div class="card-body">$f'$, $-$'den $+$'ya geçer. Fonksiyon $x_0$'a kadar düşer, dibe vurur, sonra yükselir. $(x_0, f(x_0))$ noktası yerel bir vadinin tabanıdır.</div></div>
<div class="calc-card"><div class="card-title">Hiçbiri</div><div class="card-body">$f'$'nin işareti iki tarafta da aynıdır (ikisi de $+$ veya ikisi de $-$). Fonksiyon yön değiştirmeden kritik noktadan geçer. Klasik örnek: $f(x) = x^3$, $x_0 = 0$'da.</div></div>
</div>

<div class="l-note"><strong>Uyarı.</strong> İlk Türev Testi yalnızca $f$, $x_0$'da sürekli ise işe yarar. Eğer $f$ kritik noktada bir sıçramaya sahipse, sadece $f'$'nin işaretine değil, fonksiyon değerine doğrudan bakman gerekir.</div>

<h2 class="lesson-title">5. İşaret Tablosu — 4 Adımlı Tarif</h2>

<p class="l-text">Pratikte kritik noktaları sınıflandırmak neredeyse her zaman bir <strong>işaret tablosu</strong> ile yapılır. Tarif dört adım alır ve makul her fonksiyon için işe yarar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — $f'(x)$'i hesapla</div><div class="card-body">Türev kurallarını uygula. Sonucu tamamen çarpanlara ayırmaya çalış; çarpanlara ayrılmış bir türev, işaret analizini basit kılar.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Tüm kritik noktaları bul</div><div class="card-body">$f'(x) = 0$ denklemini çöz ve $f'(x)$'in tanımsız olduğu tüm $x$ değerlerini belirle. Bunları bir sayı doğrusunda işaretle.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Her alt aralıkta işareti test et</div><div class="card-body">Kritik noktalar reel doğruyu (veya $f$'nin tanım kümesini) açık aralıklara böler. Her aralığın içinden uygun bir test noktası seç ve orada $f'$'yi hesapla; o noktadaki $f'$'nin işareti tüm aralığın işaretidir (kritik noktalar arasında $f'$ süreklidir).</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — Sonuçları oku</div><div class="card-body">$+$ işaretli aralıklar: $f$ orada artandır. $-$ işaretli aralıklar: $f$ orada azalandır. Her kritik nokta, etrafındaki $\\pm$ örüntüsüne göre sınıflandırılır (İlk Türev Testi'ne bak).</div></div>
</div>

<p class="l-text"><strong>Nasıl çizilir.</strong> $f'$ için bir işaret tablosu genellikle şöyle yazılır:</p>

<pre class="calc-code" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.9rem 1.1rem;font-family:'Geist Mono',monospace;font-size:0.88rem;line-height:1.55;color:#ebe6dc">
x       |  -∞  ...  c₁  ...  c₂  ...  +∞
--------+----------------------------------
f'(x)   |       +     0    -    0     +
--------+----------------------------------
f(x)    |        ↗   maks  ↘   min   ↗
</pre>

<p class="l-text">En alt satırı soldan sağa oku ve $f$'nin tüm monoton davranışını alırsın: yükselir, $c_1$'de tepe yapar, düşer, $c_2$'de dibe vurur, sonra tekrar yükselir.</p>

<h2 class="lesson-title">6. Çözümlü Örnek 1 — $f(x) = x^3 - 3x$</h2>

<div class="calc-example"><div class="example-label">KLASİK KÜBİK</div><div class="example-body">$f(x) = x^3 - 3x$ fonksiyonunu incele: artan ve azalan olduğu aralıkları bul, her kritik noktayı sınıflandır.<br><br><strong>Adım 1.</strong> $f'(x) = 3x^2 - 3 = 3(x^2 - 1) = 3(x - 1)(x + 1)$.<br><br><strong>Adım 2.</strong> $f'(x) = 0$ olunca $x = -1$ veya $x = 1$. Türev polinom, her yerde tanımlı. Kritik noktalar $x = -1$ ve $x = 1$.<br><br><strong>Adım 3.</strong> Test noktaları: $x = -2$, $x = 0$, $x = 2$ — her alt aralığın içinden.<br><br>$f'(-2) = 3 \\cdot 3 = 9 > 0$. &nbsp;&nbsp; $f'(0) = -3 < 0$. &nbsp;&nbsp; $f'(2) = 3 \\cdot 3 = 9 > 0$.<br><br><strong>Adım 4.</strong> İşaret tablosu:<br><br><span style="font-family:'Geist Mono',monospace">x &nbsp;&nbsp; | -∞ ........... -1 ........... 1 ........... +∞<br>f'(x) | &nbsp; + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;+<br>f(x) &nbsp;| &nbsp; ↗ &nbsp;&nbsp;&nbsp;maks ↘ &nbsp;&nbsp;min&nbsp;&nbsp; ↗</span><br><br>$(-\\infty, -1) \\cup (1, \\infty)$ üzerinde artan, $(-1, 1)$ üzerinde azalan.<br>Yerel maksimum $x = -1$'de, değeri $f(-1) = -1 + 3 = \\mathbf{2}$.<br>Yerel minimum $x = 1$'de, değeri $f(1) = 1 - 3 = \\mathbf{-2}$.</div></div>

<div class="calc-graph"><div id="plot-l23-cubic-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik şunu gösterir:</strong> $f(x) = x^3 - 3x$ kübiği, iki kritik noktası vurgulanmış: $(-1, 2)$'de yerel maksimum ve $(1, -2)$'de yerel minimum. Fonksiyon $(-\\infty, -1)$ üzerinde yükselir, $(-1, 1)$ üzerinde düşer, $(1, \\infty)$ üzerinde tekrar yükselir — tam olarak işaret tablosunun öngördüğü gibi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fs=[];for(var i=-220;i<=220;i++){var x=i/80;xs.push(x);fs.push(x*x*x - 3*x);}
var fLine={x:xs,y:fs,mode:'lines',name:'f(x) = x³ − 3x',line:{color:'#3b82f6',width:2.6}};
var maxPt={x:[-1],y:[2],mode:'markers+text',name:'yerel maks (−1, 2)',marker:{size:14,color:'#22c55e',line:{color:'#0a0a0a',width:1.5}},text:['maks'],textposition:'top center',textfont:{color:'#22c55e',size:12}};
var minPt={x:[1],y:[-2],mode:'markers+text',name:'yerel min (1, −2)',marker:{size:14,color:'#ef4444',line:{color:'#0a0a0a',width:1.5}},text:['min'],textposition:'bottom center',textfont:{color:'#ef4444',size:12}};
var tanMax={x:[-1.6,-0.4],y:[2,2],mode:'lines',name:'maks teğet',line:{color:'rgba(34,197,94,0.55)',width:2,dash:'dash'},showlegend:false};
var tanMin={x:[0.4,1.6],y:[-2,-2],mode:'lines',name:'min teğet',line:{color:'rgba(239,68,68,0.55)',width:2,dash:'dash'},showlegend:false};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.8,2.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-cubic-tr',[fLine,tanMax,tanMin,maxPt,minPt],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Çözümlü Örnek 2 — $f(x) = \\dfrac{x^2}{x - 1}$</h2>

<div class="calc-example"><div class="example-label">RASYONEL FONKSİYON</div><div class="example-body">$f(x) = \\dfrac{x^2}{x - 1}$ fonksiyonunu doğal tanım kümesinde incele.<br><br><strong>Tanım kümesi.</strong> $x = 1$ hariç tüm $x$ (payda sıfır).<br><br><strong>Adım 1 (türev).</strong> Bölüm kuralı:<br>$f'(x) = \\dfrac{2x(x - 1) - x^2 \\cdot 1}{(x - 1)^2} = \\dfrac{2x^2 - 2x - x^2}{(x - 1)^2} = \\dfrac{x^2 - 2x}{(x - 1)^2} = \\dfrac{x(x - 2)}{(x - 1)^2}.$<br><br><strong>Adım 2 (kritik noktalar).</strong> $f'(x) = 0$ olunca pay $x(x - 2) = 0$, yani $x = 0$ veya $x = 2$. $x = 1$ noktası kritik nokta <em>değildir</em> — <em>$f$'nin tanım kümesi dışındadır</em>, bu yüzden onu sayı doğrusundan çıkarırız.<br><br><strong>Adım 3 (işaret testi).</strong> Payda $(x - 1)^2$ her zaman pozitiftir (tanımlı olduğu yerde), yani $f'$'nin işareti $x(x - 2)$'nin işaretidir.<br><br>$f'(-1) = (-1)(-3) > 0$. &nbsp; $f'(0.5) = (0.5)(-1.5) < 0$. &nbsp; $f'(1.5) = (1.5)(-0.5) < 0$. &nbsp; $f'(3) = (3)(1) > 0$.<br><br><strong>Adım 4 (işaret tablosu).</strong><br><br><span style="font-family:'Geist Mono',monospace">x &nbsp;&nbsp; | -∞ ... 0 ... 1 ... 2 ... +∞<br>f'(x) | + &nbsp;&nbsp; 0 &nbsp;&nbsp; − &nbsp; ∥ &nbsp; − &nbsp;&nbsp; 0 &nbsp; +<br>f(x) &nbsp;| ↗ &nbsp;&nbsp;maks ↘ &nbsp; ∥ &nbsp; ↘ &nbsp;&nbsp;min&nbsp; ↗</span><br><br>($\\parallel$ işareti $x = 1$'deki dikey asimptotu gösterir.)<br><br>$(-\\infty, 0) \\cup (2, \\infty)$ üzerinde artan. $(0, 1) \\cup (1, 2)$ üzerinde azalan.<br>Yerel maksimum $x = 0$'da, değeri $f(0) = \\mathbf{0}$.<br>Yerel minimum $x = 2$'de, değeri $f(2) = 4/1 = \\mathbf{4}$.<br><br>Dikkat çekici sezgi-karşıtı bir özellik: yerel <em>minimum</em> değeri $4$, yerel <em>maksimum</em> değeri $0$'dan <em>büyüktür</em>. Bu mümkündür çünkü aralarında fonksiyon $\\pm \\infty$'a patlar — yerel ekstremumlar yalnızca yerel'dir.</div></div>

<h2 class="lesson-title">8. Çözümlü Örnek 3 — $[0, 2\\pi]$ üzerinde $f(x) = \\sin x + \\cos x$</h2>

<div class="calc-example"><div class="example-label">KAPALI ARALIK ÜZERİNDE TRİGONOMETRİK FONKSİYON</div><div class="example-body">$[0, 2\\pi]$ aralığında $f(x) = \\sin x + \\cos x$ fonksiyonunun tüm kritik noktalarını bul ve sınıflandır.<br><br><strong>Adım 1.</strong> $f'(x) = \\cos x - \\sin x$.<br><br><strong>Adım 2.</strong> $f'(x) = 0 \\;\\Leftrightarrow\\; \\cos x = \\sin x \\;\\Leftrightarrow\\; \\tan x = 1 \\;\\Leftrightarrow\\; x = \\dfrac{\\pi}{4} + k\\pi$.<br><br>$[0, 2\\pi]$ aralığında bu $x = \\dfrac{\\pi}{4}$ ve $x = \\dfrac{5\\pi}{4}$ verir.<br><br><strong>Adım 3.</strong> Test:<br>$f'(0) = 1 - 0 = 1 > 0$.<br>$f'(\\pi/2) = 0 - 1 = -1 < 0$.<br>$f'(3\\pi/2) = 0 - (-1) = 1 > 0$.<br><br><strong>Adım 4.</strong> $[0, 2\\pi]$ üzerinde işaret tablosu:<br><br><span style="font-family:'Geist Mono',monospace">x &nbsp;&nbsp; | 0 ... π/4 ... 5π/4 ... 2π<br>f'(x) | + &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;−&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;+<br>f(x) &nbsp;| ↗ &nbsp;maks ↘ &nbsp;&nbsp;min&nbsp; ↗</span><br><br>$x = \\pi/4$'te yerel maksimum: $f(\\pi/4) = \\sin(\\pi/4) + \\cos(\\pi/4) = \\dfrac{\\sqrt 2}{2} + \\dfrac{\\sqrt 2}{2} = \\boldsymbol{\\sqrt 2}$.<br>$x = 5\\pi/4$'te yerel minimum: $f(5\\pi/4) = -\\dfrac{\\sqrt 2}{2} - \\dfrac{\\sqrt 2}{2} = \\boldsymbol{-\\sqrt 2}$.<br><br>Bunlar aynı zamanda $[0, 2\\pi]$ üzerindeki mutlak maksimum ve mutlak minimumdur, çünkü uç nokta değerleri $f(0) = 1$ ve $f(2\\pi) = 1$, $-\\sqrt 2$ ile $\\sqrt 2$ arasında kalır.</div></div>

<h2 class="lesson-title">9. Kapalı Aralıkta Mutlak Ekstremum</h2>

<div class="calc-highlight"><strong>Uç Değer Teoremi:</strong> kapalı ve sınırlı bir $[a, b]$ aralığında sürekli olan bir fonksiyon, maksimum ve minimum değerine aralık içinde bir yerde ulaşır. İkisinin de var olması garantidir. Sorun şuna döner: nerede?</div>

<p class="l-text">$[a, b]$ üzerinde mutlak ekstremumları bulmak için tam tarif yalnızca üç adımdan oluşur:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — $(a, b)$'de kritik noktaları bul</div><div class="card-body">$f'(x) = 0$ denklemini çöz ve $f'$'nin tanımsız olduğu yerleri belirle, ama yalnızca aralığın <em>iç</em> kısmındakileri say.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Her adayda $f$'yi hesapla</div><div class="card-body">Adım 1'deki her kritik noktada <em>ve</em> her iki uç nokta $a$ ile $b$'de fonksiyon değerini hesapla.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — En büyük ve en küçüğü seç</div><div class="card-body">Tüm bu sayıların en büyüğü mutlak maksimum; en küçüğü mutlak minimumdur. İlk Türev Testi'ne bile gerek yok — sadece değerleri karşılaştır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$[-2, 2]$ üzerinde $f(x) = x^3 - 3x + 2$ fonksiyonunun mutlak maks ve minini bul.<br><br><strong>Adım 1.</strong> $f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$. İkisi de $(-2, 2)$ içinde.<br><br><strong>Adım 2.</strong> Adaylar ve değerleri:<br>$f(-2) = -8 + 6 + 2 = 0$.<br>$f(-1) = -1 + 3 + 2 = 4$.<br>$f(1) = 1 - 3 + 2 = 0$.<br>$f(2) = 8 - 6 + 2 = 4$.<br><br><strong>Adım 3.</strong> Maksimum değer: $\\mathbf{4}$, $x = -1$ ve $x = 2$'de elde edilir.<br>Minimum değer: $\\mathbf{0}$, $x = -2$ ve $x = 1$'de elde edilir.<br><br>Bu problemde iki farklı $x$ değerinin aynı ekstremum değerini üretmesi mümkündür — buna tamamen izin verilir.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body">$f(x) = 2x^3 - 9x^2 + 12x - 4$ fonksiyonunun artan ve azalan olduğu aralıkları bul. Kritik noktaları sınıflandır.<br><br><em>Cevap.</em> $f'(x) = 6x^2 - 18x + 12 = 6(x - 1)(x - 2)$. Kritik noktalar $x = 1, 2$. $(-\\infty, 1) \\cup (2, \\infty)$ üzerinde artan, $(1, 2)$ üzerinde azalan. $(1, 1)$'de yerel maks, $(2, 0)$'da yerel min.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body">$f(x) = x^3 + x$ fonksiyonunun $\\mathbb{R}$ üzerinde kesin artan olduğunu ve yerel ekstremumu olmadığını göster.<br><br><em>Cevap.</em> Her reel $x$ için $f'(x) = 3x^2 + 1 > 0$. Monotonluk teoremine göre $f$, $\\mathbb{R}$ üzerinde kesin artandır. $f'$ asla sıfır olmadığından ve asla tanımsız olmadığından, kritik nokta yoktur ve dolayısıyla yerel ekstremum yoktur.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body">$[-3, 3]$ üzerinde $f(x) = x^4 - 8x^2 + 16$ fonksiyonunun mutlak ekstremumlarını belirle.<br><br><em>Cevap.</em> $f'(x) = 4x^3 - 16x = 4x(x^2 - 4) = 4x(x-2)(x+2)$. Kritik noktalar: $x = -2, 0, 2$, tümü $(-3, 3)$ içinde. Değerler: $f(-3) = 81 - 72 + 16 = 25$; $f(-2) = 0$; $f(0) = 16$; $f(2) = 0$; $f(3) = 25$. Mutlak maks $= 25$, $x = \\pm 3$'te; mutlak min $= 0$, $x = \\pm 2$'de.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body">$f(x) = (x - 2)^{2/3}$ için her kritik noktayı bul ve sınıflandır.<br><br><em>Cevap.</em> $f'(x) = \\dfrac{2}{3} (x - 2)^{-1/3} = \\dfrac{2}{3 \\sqrt[3]{x - 2}}$. Asla sıfır değil, ama $x = 2$'de tanımsız ve $f(2) = 0$ tanımlı. Yani $x = 2$ bir (Tip 3) kritik noktadır. $x < 2$ için $f' < 0$; $x > 2$ için $f' > 0$. İşaret değişimi $- \\to +$: <strong>$x = 2$'de yerel minimum</strong>, $f(2) = 0$ değeriyle (sivri uç).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body">$[1, 4]$ üzerinde $g(x) = x + \\dfrac{4}{x}$ fonksiyonunun mutlak ekstremumlarını bul.<br><br><em>Cevap.</em> $g'(x) = 1 - \\dfrac{4}{x^2} = \\dfrac{x^2 - 4}{x^2}$. $g'(x) = 0 \\Rightarrow x = \\pm 2$. Yalnızca $x = 2$ $[1, 4]$ aralığındadır. Değerler: $g(1) = 1 + 4 = 5$; $g(2) = 2 + 2 = 4$; $g(4) = 4 + 1 = 5$. Mutlak min $= 4$, $x = 2$'de; mutlak maks $= 5$, $x = 1$ ve $x = 4$'te.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body">$f(x) = x^3 + ax^2 + 3x + 1$ fonksiyonunun tüm $\\mathbb{R}$ üzerinde kesin artan olmasını sağlayan $a \\in \\mathbb{R}$ değerlerini bul.<br><br><em>Cevap.</em> $f'(x) = 3x^2 + 2ax + 3$. $f$'nin $\\mathbb{R}$ üzerinde kesin artan olması için her yerde $f'(x) \\ge 0$ olmalıdır. Bu $x$ cinsinden ikinci dereceden ifadenin diskriminantı $\\le 0$ olmalıdır: $\\Delta = (2a)^2 - 4 \\cdot 3 \\cdot 3 = 4a^2 - 36 \\le 0 \\Rightarrow a^2 \\le 9 \\Rightarrow -3 \\le a \\le 3$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body">$x \\ge 0$ için $f(x) = x \\, e^{-x}$ fonksiyonunun yerel ekstremumlarını belirle.<br><br><em>Cevap.</em> $f'(x) = e^{-x} - x e^{-x} = e^{-x}(1 - x)$. $x = 1$'de kritik nokta ($e^{-x}$ her zaman pozitiftir). İşaret: $f'(0) > 0$, $f'(2) < 0$. Örüntü $+ \\to -$: <strong>$x = 1$'de yerel maksimum</strong>, $f(1) = 1/e \\approx 0.3679$ değeriyle.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body">Bir dikdörtgenin çevresi $20$ cm'dir. Alanını maksimize eden boyutları bul.<br><br><em>Cevap.</em> Kenarları $x$ ve $10 - x$ olsun, ikisi de pozitif. Alan $A(x) = x(10 - x) = 10x - x^2$, $x \\in (0, 10)$ için. $A'(x) = 10 - 2x = 0 \\Rightarrow x = 5$. $A'$, $x = 5$'te $+$'dan $-$'ye değişir, yani bir maksimum. Boyutlar $5 \\times 5$ cm — dikdörtgen bir karedir. Maksimum alan: $25$ cm². (Sabit çevreli dikdörtgenler arasında, kare her zaman alanı maksimize edendir.)</div></div>

<div class="calc-graph"><div id="plot-l23-signchart-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik şunu gösterir:</strong> $f'(x) = (x + 1)(x - 1)(x - 3)$ için şematik bir işaret tablosu. Eksenin üstünde kübik pozitif ($f$ artıyor); altında negatif ($f$ azalıyor). Üç sıfır noktası, orijinal $f$'nin kritik noktalarıdır ve $+/-$ değişen örüntüsü, $f$'nin kendisinin $\\nearrow / \\searrow$ değişen örüntüsüne dönüşür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-200;i<=400;i++){var x=i/80;xs.push(x);ys.push((x+1)*(x-1)*(x-3));}
var pos={x:[],y:[]};var neg={x:[],y:[]};for(var j=0;j<xs.length;j++){if(ys[j]>=0){pos.x.push(xs[j]);pos.y.push(ys[j]);}else{neg.x.push(xs[j]);neg.y.push(ys[j]);}}
var posLine={x:pos.x,y:pos.y,mode:'lines',name:"f'(x) > 0  →  f ↗",line:{color:'#22c55e',width:3},fill:'tozeroy',fillcolor:'rgba(34,197,94,0.15)'};
var negLine={x:neg.x,y:neg.y,mode:'lines',name:"f'(x) < 0  →  f ↘",line:{color:'#ef4444',width:3},fill:'tozeroy',fillcolor:'rgba(239,68,68,0.15)'};
var crits={x:[-1,1,3],y:[0,0,0],mode:'markers+text',name:'kritik noktalar',marker:{size:14,color:'#c8a96e',line:{color:'#0a0a0a',width:1.5}},text:['x=−1','x=1','x=3'],textposition:'top center',textfont:{color:'#c8a96e',size:12}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.35)'},yaxis:{title:"f'(x)",range:[-7,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.35)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-signchart-tr',[posLine,negLine,crits],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. İçbükeylik ve İkinci Türev Testi</h2>

<div class="calc-highlight"><strong>İkinci türev $f''(x)$ sana grafiğin eğriliğini söyler.</strong> $f'' > 0$ olduğu yerde eğri <em>yukarı içbükeydir</em> (kâse şeklinde, $\\smile$); $f'' < 0$ olduğu yerde <em>aşağı içbükeydir</em> (kubbe şeklinde, $\\frown$). İçbükeyliğin yön değiştirdiği noktaya <em>büküm noktası</em> denir. Birlikte ele alındığında, $f'$ ve $f''$'nün işaretleri her yerel davranışı dört durumdan birine sınıflandırır.</div>

<p class="l-text">$f(x) = x^3 - 3x^2 + 2$ fonksiyonunu düşün. İki kez türevini alınca $f'(x) = 3x^2 - 6x$ ve $f''(x) = 6x - 6$ elde ederiz. İkinci türev $x = 1$'de sıfırlanır, $(-\\infty, 1)$ üzerinde negatiften (aşağı içbükey) $(1, \\infty)$ üzerinde pozitife (yukarı içbükey) geçer. Yani $x = 1$ bir büküm noktasıdır, değeri $f(1) = 1 - 3 + 2 = 0$.</p>

<div class="calc-graph"><div id="plot-l23-concavity-tr-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik şunu gösterir:</strong> mavi renkte $f(x) = x^3 - 3x^2 + 2$ ve altın renkte ikinci türevi $f''(x) = 6x - 6$. Arka plandaki renkli bölgeler içbükeylik bölgelerini işaretler: aşağı içbükey için yeşil ($f'' < 0$, $x = 1$'in solunda) ve yukarı içbükey için kırmızı ($f'' > 0$, $x = 1$'in sağında). Turuncu işaretçi $(1, 0)$'daki büküm noktasıdır — eğriliğin yön değiştirdiği yer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var fs=[];var ddfs=[];for(var i=-100;i<=300;i++){var x=i/80;xs.push(x);fs.push(x*x*x - 3*x*x + 2);ddfs.push(6*x - 6);}
var concDown={x:[-1.25,-1.25,1,1],y:[-12,12,12,-12],fill:'toself',mode:'lines',line:{width:0},fillcolor:'rgba(34,197,94,0.12)',name:"aşağı içbükey (f'' < 0)",hoverinfo:'skip'};
var concUp={x:[1,1,3.75,3.75],y:[-12,12,12,-12],fill:'toself',mode:'lines',line:{width:0},fillcolor:'rgba(239,68,68,0.12)',name:"yukarı içbükey (f'' > 0)",hoverinfo:'skip'};
var fLine={x:xs,y:fs,mode:'lines',name:'f(x) = x³ − 3x² + 2',line:{color:'#3b82f6',width:2.8}};
var ddLine={x:xs,y:ddfs,mode:'lines',name:"f''(x) = 6x − 6",line:{color:'#c8a96e',width:2.2,dash:'dot'}};
var inflPt={x:[1],y:[0],mode:'markers+text',name:'büküm noktası (1, 0)',marker:{size:14,color:'#f59e0b',line:{color:'#0a0a0a',width:1.5}},text:['büküm'],textposition:'top right',textfont:{color:'#f59e0b',size:12}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.25,3.75],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'değer',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l23-concavity-tr-extra',[concDown,concUp,fLine,ddLine,inflPt],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">$\\operatorname{işaret}(f')$ ve $\\operatorname{işaret}(f'')$ kombinasyonlarının dördü, tüm yerel şekilleri sınıflandırır. Aşağıdaki tablo her durumda hangi şeklin ortaya çıktığını özetler:</p>

<div style="margin:1.2rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.10);color:#3b82f6;text-align:left">
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">$f'$ işareti</th>
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">$f''$ işareti</th>
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">Şekil</th>
<th style="padding:0.7rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;letter-spacing:0.04em">Anlamı</th>
</tr>
</thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Artan &amp; yukarı içbükey ($\\smile$)</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Yükseliyor ve hızlanıyor — eğim giderek dikleşiyor</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Artan &amp; aşağı içbükey ($\\frown$)</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Yükseliyor ama yavaşlıyor — yerel maksimuma yaklaşıyor</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Geist Mono',monospace;color:#22c55e">+</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Azalan &amp; yukarı içbükey ($\\smile$)</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.05)">Düşüyor ama yavaşlıyor — yerel minimuma yaklaşıyor</td></tr>
<tr><td style="padding:0.65rem 0.9rem;font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem;font-family:'Geist Mono',monospace;color:#ef4444">−</td><td style="padding:0.65rem 0.9rem">Azalan &amp; aşağı içbükey ($\\frown$)</td><td style="padding:0.65rem 0.9rem">Düşüyor ve hızlanıyor — eğim aşağı yönde giderek dikleşiyor</td></tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>Kritik noktalar için İkinci Türev Testi.</strong> $f'(x_0) = 0$ ve $f''(x_0) > 0$ ise $x_0$ bir yerel minimumdur (kritik noktada yukarı içbükey — bir vadi). $f'(x_0) = 0$ ve $f''(x_0) < 0$ ise $x_0$ bir yerel maksimumdur (aşağı içbükey — bir tepe). $f''(x_0) = 0$ olursa test sonuçsuzdur ve İlk Türev Testi'ne geri dönülür.</div>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">ÖZET — YALNIZCA BİR ŞEY HATIRLAYACAKSAN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>$f'$'nin işareti $f$'nin yönünü söyler.</strong> $f' > 0 \\Rightarrow$ artan, $f' < 0 \\Rightarrow$ azalan.</li>
<li><strong>Kritik noktalar</strong>, $f'(x) = 0$ çözümleri ile $f'$'nin tanımsız (ama $f$'nin var olduğu) noktaların birleşimidir.</li>
<li><strong>İlk Türev Testi:</strong> kritik noktada $+ \\to -$ yerel maksimum verir; $- \\to +$ yerel minimum verir; işaret değişmezse hiçbiri.</li>
<li><strong>$[a, b]$'de mutlak ekstremum:</strong> iç kritik noktalardaki ve iki uç noktadaki $f$ değerlerini karşılaştır — en büyük kazanır, en küçük kaybeder.</li>
</ul>
</div>`
};
