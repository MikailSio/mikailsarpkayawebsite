window.LISE_MAT_L9 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Every operation in mathematics has a reverse.</strong> Addition is undone by subtraction, multiplication by division, squaring by the square root. Sine, cosine, and tangent are no different: each one takes an <em>angle</em> as input and produces a <em>number</em> as output. The reverse operation must take a number as input and return an angle. Those reverse operations are the inverse trigonometric functions arcsin, arccos, and arctan — the subject of this lesson.</p>

<p class="l-text">The catch is that sine, cosine, and tangent are periodic: $\\sin x$ takes the value $0.5$ at $x = \\pi/6$, but also at $x = 5\\pi/6$, $x = 13\\pi/6$, and at infinitely many other angles. So "the angle whose sine is $0.5$" is ambiguous. To make a proper inverse we restrict the original function to a piece where it is one-to-one. That single design choice fixes the domain, the range, and the graph of each inverse — and explains every subtle identity you will see in section 7.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State why $\\sin$, $\\cos$, $\\tan$ have no global inverse and why a restricted domain is needed</li>
<li>Define $\\arcsin$, $\\arccos$, $\\arctan$ with their exact domain and range (principal values)</li>
<li>Read the graph of each inverse as the mirror reflection of the restricted forward graph across the line $y = x$</li>
<li>Evaluate exact values at the standard inputs: $\\arcsin(1/2)$, $\\arccos(-\\sqrt{3}/2)$, $\\arctan(1)$, etc.</li>
<li>Use the cancellation identities $\\sin(\\arcsin x) = x$ and $\\arcsin(\\sin x) = x$ — and recognise when the second fails</li>
<li>Simplify compositions such as $\\sin(\\arccos x)$ and $\\cos(\\arctan x)$ with a right-triangle picture</li>
</ul>
</div>

<h2 class="lesson-title">1. Why We Need an Inverse</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> A surveyor stands 100 m from a flagpole and the line from her eye to the top of the pole rises at some height $h$. She knows $h = 100 \\tan\\theta$. If she measures $\\theta$ with a protractor she can compute $h$. But what if she knows $h$ and wants $\\theta$? She has to <em>undo</em> the tangent — she needs an inverse.</div>

<p class="l-text">Forward trig answers the question <em>"what number does sine give me at this angle?"</em>. Inverse trig answers the reverse question <em>"what angle gives me this number?"</em>. In equation form:</p>

<div class="calc-formula"><div class="formula-label">THE INVERSE QUESTION</div><div class="formula-main">$$\\sin x = 0.5 \\quad\\Longrightarrow\\quad x \\;=\\; \\arcsin(0.5) \\;=\\; \\frac{\\pi}{6} \\;=\\; 30^\\circ$$</div><div class="formula-sub">Reading: "$x$ is the angle whose sine is $0.5$." The symbol $\\arcsin$ is sometimes written $\\sin^{-1}$, but be careful — the superscript $-1$ here means <em>inverse function</em>, not the reciprocal $1/\\sin$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward direction</div><div class="card-body">Angle goes in, number comes out: $\\sin(30^\\circ) = 0.5$. The input is geometric, the output is a ratio between $-1$ and $1$.</div></div>
<div class="calc-card"><div class="card-title">Inverse direction</div><div class="card-body">Number goes in, angle comes out: $\\arcsin(0.5) = 30^\\circ$. The input is a ratio, the output is geometric.</div></div>
<div class="calc-card"><div class="card-title">Notation warning</div><div class="card-body">$\\sin^{-1}(x)$ means the inverse, <strong>not</strong> $\\dfrac{1}{\\sin x}$. To write the reciprocal use $\\csc x$ or $(\\sin x)^{-1}$ with explicit parentheses.</div></div>
</div>

<p class="l-text">Calculators, physics formulas, engineering problems — everywhere we measure a height-to-distance ratio or a velocity-to-magnitude ratio, we eventually need to recover the underlying angle. That is the job description of the inverse trig functions.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Pick up a calculator and find the buttons labelled <strong>sin</strong>, <strong>cos</strong>, <strong>tan</strong> and <strong>sin&#8315;&sup1;</strong>, <strong>cos&#8315;&sup1;</strong>, <strong>tan&#8315;&sup1;</strong>. The second row is the inverse. Type $0.5$ then $\\sin^{-1}$ and you should see $30$ (in degree mode) or $0.5236$ (in radian mode, which is $\\pi/6$).</div></div>

<h2 class="lesson-title">2. The Problem: Sine Is Not One-to-One</h2>

<div class="calc-highlight"><strong>A function has an inverse only if it is one-to-one</strong> — each output must come from exactly one input. Sine fails this badly: $\\sin(\\pi/6) = 0.5$, but also $\\sin(5\\pi/6) = 0.5$, and $\\sin(13\\pi/6) = 0.5$, and so on. There are infinitely many angles with the same sine value, so the "inverse of sine" as written is not a function at all.</div>

<p class="l-text">Draw a horizontal line at height $y = 0.5$ across the sine graph. It hits the curve in infinitely many places. The horizontal-line test fails. Without a fix, asking "what angle has sine equal to $0.5$" has no unique answer.</p>

<div class="calc-formula"><div class="formula-label">SINE TAKES THE SAME VALUE INFINITELY OFTEN</div><div class="formula-main">$$\\sin x \\;=\\; \\sin\\!\\bigl(x + 2k\\pi\\bigr) \\;=\\; \\sin\\!\\bigl(\\pi - x\\bigr) \\quad \\text{for any integer } k$$</div><div class="formula-sub">Two sources of repetition: the $2\\pi$ period (full revolution returns to the same place), and the supplementary-angle identity $\\sin(\\pi - x) = \\sin x$ (reflection across $\\pi/2$).</div></div>

<p class="l-text"><strong>The fix.</strong> Restrict $\\sin$ to a piece of its domain where it <em>is</em> one-to-one. Many choices would work, but mathematicians agreed on a single convention: chop off everything outside the interval $\\left[-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right]$. On that interval, sine rises monotonically from $-1$ to $+1$ — each output corresponds to exactly one input. That restricted sine has a proper inverse, and we call it $\\arcsin$.</p>

<div class="l-note"><strong>Why this particular interval?</strong> It is symmetric about $0$, contains the steepest "rising" piece of the sine wave, and includes the small angles where sine is well-approximated by $x$ itself. The choice is conventional but excellent.</div>

<h2 class="lesson-title">3. arcsin: Definition, Domain, Range</h2>

<div class="calc-formula"><div class="formula-label">DEFINITION OF ARCSIN</div><div class="formula-main">$$y \\;=\\; \\arcsin x \\quad\\Longleftrightarrow\\quad \\sin y \\;=\\; x \\;\\;\\text{and}\\;\\; y \\in \\left[-\\frac{\\pi}{2},\\ \\frac{\\pi}{2}\\right]$$</div><div class="formula-sub">Read: "$y$ is the angle in $[-\\pi/2, \\pi/2]$ whose sine equals $x$." The bracketed restriction is the <em>principal value</em> agreement.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain</div><div class="card-body">$x \\in [-1,\\ 1]$. Outside this range $\\arcsin$ is undefined &mdash; sine never produces values bigger than $1$ or smaller than $-1$.</div></div>
<div class="calc-card"><div class="card-title">Range (principal)</div><div class="card-body">$y \\in \\left[-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right]$, i.e. $[-90^\\circ,\\ 90^\\circ]$. The answer is always in the right half of the unit circle.</div></div>
<div class="calc-card"><div class="card-title">Sign</div><div class="card-body">$\\arcsin x$ has the same sign as $x$: positive input gives positive angle, negative input gives negative angle, zero input gives zero.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK EVALUATIONS</div><div class="example-body">$\\arcsin(0) = 0$ &mdash; because $\\sin 0 = 0$ and $0$ is in the principal range.<br>$\\arcsin(1/2) = \\pi/6 = 30^\\circ$ &mdash; because $\\sin(\\pi/6) = 1/2$ and $\\pi/6$ lies in $[-\\pi/2, \\pi/2]$.<br>$\\arcsin(-1/2) = -\\pi/6 = -30^\\circ$ &mdash; the negative twin.<br>$\\arcsin(1) = \\pi/2 = 90^\\circ$ &mdash; the boundary.<br>$\\arcsin(-1) = -\\pi/2 = -90^\\circ$ &mdash; the other boundary.<br>$\\arcsin(\\sqrt{2}/2) = \\pi/4 = 45^\\circ$.<br>$\\arcsin(\\sqrt{3}/2) = \\pi/3 = 60^\\circ$.</div></div>

<div class="calc-graph"><div id="plot-l9-arcsin-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $y = \\arcsin x$ over its full domain $[-1, 1]$. The curve rises monotonically from the lower-left endpoint $(-1, -\\pi/2)$ through the origin to the upper-right endpoint $(1, \\pi/2)$. The dashed horizontal lines mark the principal-range boundaries.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=-1+2*i/200;xs.push(t);ys.push(Math.asin(t));}
var curve={x:xs,y:ys,mode:'lines',name:'y = arcsin x',line:{color:'#3b82f6',width:3}};
var topL={x:[-1.1,1.1],y:[Math.PI/2,Math.PI/2],mode:'lines',name:'y = π/2',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var botL={x:[-1.1,1.1],y:[-Math.PI/2,-Math.PI/2],mode:'lines',name:'y = -π/2',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var pts={x:[-1,-0.5,0,0.5,1],y:[-Math.PI/2,-Math.PI/6,0,Math.PI/6,Math.PI/2],mode:'markers+text',text:['(-1, -π/2)','(-1/2, -π/6)','(0,0)','(1/2, π/6)','(1, π/2)'],textposition:'top center',textfont:{color:'#ebe6dc',size:10},marker:{size:8,color:'#f59e0b'},name:'key points'};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y (radians)',range:[-1.9,1.9],tickvals:[-Math.PI/2,-Math.PI/4,0,Math.PI/4,Math.PI/2],ticktext:['-π/2','-π/4','0','π/4','π/2'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-arcsin-en',[curve,topL,botL,pts],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Mental model:</strong> reading the arcsin graph horizontally answers the inverse question. To find $\\arcsin(0.6)$, find $0.6$ on the $x$-axis, go up to the curve, then read the $y$-value &mdash; you will land near $0.644$ rad, or about $36.87^\\circ$.</div>

<h2 class="lesson-title">4. arccos: Definition, Domain, Range</h2>

<p class="l-text">For arccos we play the same game but choose a different restricted interval. Cosine has the same one-to-one problem, but the natural restriction is $[0, \\pi]$ instead of $[-\\pi/2, \\pi/2]$. Why? Because cosine is <em>decreasing</em> from $+1$ at $x=0$ to $-1$ at $x=\\pi$, and that piece covers the whole output range $[-1, 1]$ exactly once.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF ARCCOS</div><div class="formula-main">$$y \\;=\\; \\arccos x \\quad\\Longleftrightarrow\\quad \\cos y \\;=\\; x \\;\\;\\text{and}\\;\\; y \\in [0,\\ \\pi]$$</div><div class="formula-sub">Read: "$y$ is the angle in $[0, \\pi]$ whose cosine equals $x$." Notice the range is the <em>upper</em> half-circle, not symmetric about zero.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain</div><div class="card-body">$x \\in [-1, 1]$ &mdash; same as arcsin.</div></div>
<div class="calc-card"><div class="card-title">Range (principal)</div><div class="card-body">$y \\in [0,\\ \\pi]$, i.e. $[0^\\circ, 180^\\circ]$. The answer is always non-negative.</div></div>
<div class="calc-card"><div class="card-title">Behaviour</div><div class="card-body">arccos is <em>decreasing</em> &mdash; bigger input gives smaller output. As $x$ goes from $-1$ to $+1$, the angle $y$ falls from $\\pi$ to $0$.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK EVALUATIONS</div><div class="example-body">$\\arccos(1) = 0$ &mdash; cosine is $1$ at the angle $0$.<br>$\\arccos(0) = \\pi/2 = 90^\\circ$ &mdash; cosine vanishes at $\\pi/2$.<br>$\\arccos(-1) = \\pi = 180^\\circ$ &mdash; cosine equals $-1$ at $\\pi$.<br>$\\arccos(1/2) = \\pi/3 = 60^\\circ$.<br>$\\arccos(-1/2) = 2\\pi/3 = 120^\\circ$ &mdash; supplementary to $\\pi/3$.<br>$\\arccos(\\sqrt{2}/2) = \\pi/4 = 45^\\circ$.<br>$\\arccos(-\\sqrt{3}/2) = 5\\pi/6 = 150^\\circ$.</div></div>

<div class="calc-graph"><div id="plot-l9-arccos-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = \\arccos x$ over $[-1, 1]$. The curve <em>decreases</em> from $(-1, \\pi)$ through $(0, \\pi/2)$ to $(1, 0)$ &mdash; the mirror behaviour of arcsin: starts high, ends low. Dashed lines show the boundaries $y = 0$ and $y = \\pi$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=-1+2*i/200;xs.push(t);ys.push(Math.acos(t));}
var curve={x:xs,y:ys,mode:'lines',name:'y = arccos x',line:{color:'#3b82f6',width:3}};
var topL={x:[-1.1,1.1],y:[Math.PI,Math.PI],mode:'lines',name:'y = π',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var botL={x:[-1.1,1.1],y:[0,0],mode:'lines',name:'y = 0',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var pts={x:[-1,-0.5,0,0.5,1],y:[Math.PI,2*Math.PI/3,Math.PI/2,Math.PI/3,0],mode:'markers+text',text:['(-1, π)','(-1/2, 2π/3)','(0, π/2)','(1/2, π/3)','(1, 0)'],textposition:'top center',textfont:{color:'#ebe6dc',size:10},marker:{size:8,color:'#f59e0b'},name:'key points'};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y (radians)',range:[-0.3,Math.PI+0.3],tickvals:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI],ticktext:['0','π/4','π/2','3π/4','π'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-arccos-en',[curve,topL,botL,pts],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">USEFUL IDENTITY LINKING ARCSIN AND ARCCOS</div><div class="formula-main">$$\\arcsin x \\;+\\; \\arccos x \\;=\\; \\frac{\\pi}{2} \\quad \\text{for all } x \\in [-1, 1]$$</div><div class="formula-sub">The two angles are complementary. So if you know one, the other is $\\pi/2$ minus it.</div></div>

<h2 class="lesson-title">5. arctan: Definition, Domain, Range</h2>

<p class="l-text">Tangent has a different shape from sine and cosine. It is unbounded &mdash; it rises from $-\\infty$ at $x = -\\pi/2$ to $+\\infty$ at $x = \\pi/2$, with a vertical asymptote at each end. To make a one-to-one inverse we restrict tangent to the open interval $\\left(-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right)$, exactly the same range we used for arcsin.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF ARCTAN</div><div class="formula-main">$$y \\;=\\; \\arctan x \\quad\\Longleftrightarrow\\quad \\tan y \\;=\\; x \\;\\;\\text{and}\\;\\; y \\in \\left(-\\frac{\\pi}{2},\\ \\frac{\\pi}{2}\\right)$$</div><div class="formula-sub">Open interval: the endpoints are excluded because $\\tan$ is undefined at $\\pm\\pi/2$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain</div><div class="card-body">$x \\in \\mathbb{R}$ &mdash; <strong>all real numbers</strong>. Any input is allowed; tangent reaches every height.</div></div>
<div class="calc-card"><div class="card-title">Range (principal)</div><div class="card-body">$y \\in \\left(-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right)$, an <em>open</em> interval.</div></div>
<div class="calc-card"><div class="card-title">Horizontal asymptotes</div><div class="card-body">As $x \\to +\\infty$, $\\arctan x \\to \\pi/2$. As $x \\to -\\infty$, $\\arctan x \\to -\\pi/2$. The graph hugs two horizontal lines.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK EVALUATIONS</div><div class="example-body">$\\arctan(0) = 0$.<br>$\\arctan(1) = \\pi/4 = 45^\\circ$ &mdash; because $\\tan(\\pi/4) = 1$.<br>$\\arctan(-1) = -\\pi/4 = -45^\\circ$.<br>$\\arctan(\\sqrt{3}) = \\pi/3 = 60^\\circ$.<br>$\\arctan(\\sqrt{3}/3) = \\pi/6 = 30^\\circ$ &mdash; remember $\\tan(\\pi/6) = 1/\\sqrt{3} = \\sqrt{3}/3$.<br>$\\arctan(\\text{very large positive}) \\to \\pi/2$ but never reaches it.</div></div>

<div class="calc-graph"><div id="plot-l9-arctan-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = \\arctan x$ over a wide window from $-8$ to $+8$. The curve passes through the origin with slope $1$, then bends and approaches the horizontal asymptotes $y = \\pm\\pi/2$ (dashed lines). Notice the curve never touches either asymptote &mdash; even at $x = 100$ the value is only $1.5608$ rad, still below $\\pi/2 \\approx 1.5708$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var t=-8+16*i/300;xs.push(t);ys.push(Math.atan(t));}
var curve={x:xs,y:ys,mode:'lines',name:'y = arctan x',line:{color:'#3b82f6',width:3}};
var topL={x:[-8,8],y:[Math.PI/2,Math.PI/2],mode:'lines',name:'y = π/2 (asymptote)',line:{color:'rgba(239,68,68,0.6)',width:1.4,dash:'dash'}};
var botL={x:[-8,8],y:[-Math.PI/2,-Math.PI/2],mode:'lines',name:'y = -π/2 (asymptote)',line:{color:'rgba(239,68,68,0.6)',width:1.4,dash:'dash'}};
var pts={x:[-1,0,1,Math.sqrt(3)],y:[-Math.PI/4,0,Math.PI/4,Math.PI/3],mode:'markers+text',text:['(-1, -π/4)','(0,0)','(1, π/4)','(√3, π/3)'],textposition:'top center',textfont:{color:'#ebe6dc',size:10},marker:{size:8,color:'#f59e0b'},name:'key points'};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y (radians)',range:[-1.9,1.9],tickvals:[-Math.PI/2,-Math.PI/4,0,Math.PI/4,Math.PI/2],ticktext:['-π/2','-π/4','0','π/4','π/2'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-arctan-en',[curve,topL,botL,pts],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why arctan matters in physics:</strong> the angle of a vector is computed by $\\theta = \\arctan(y/x)$. In robotics, navigation, computer graphics, machine learning gradients &mdash; anywhere a slope is converted into an angle &mdash; arctan does the work. The variant $\\operatorname{atan2}(y, x)$ extends it to the full $(-\\pi, \\pi]$ range by also considering the sign of $x$.</div>

<h2 class="lesson-title">6. Graphs as Reflections Across y = x</h2>

<div class="calc-highlight"><strong>The general principle:</strong> the graph of any inverse function is the reflection of the original graph across the diagonal line $y = x$. Swap the roles of the input and the output, and the picture flips along that 45-degree line.</div>

<p class="l-text">This gives a beautiful visual way to remember each inverse:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">sin &rarr; arcsin</div><div class="card-body">Take the piece of $y = \\sin x$ from $x = -\\pi/2$ to $x = \\pi/2$. Reflect it across $y = x$. You get the arcsin graph. Domain and range swap roles.</div></div>
<div class="calc-card"><div class="card-title">cos &rarr; arccos</div><div class="card-body">Take the piece of $y = \\cos x$ from $x = 0$ to $x = \\pi$. Reflect across $y = x$. The result is the arccos graph.</div></div>
<div class="calc-card"><div class="card-title">tan &rarr; arctan</div><div class="card-body">Take the piece of $y = \\tan x$ between the two vertical asymptotes at $\\pm \\pi/2$. Reflect across $y = x$. The vertical asymptotes become horizontal asymptotes &mdash; that is why arctan flattens out.</div></div>
</div>

<div class="calc-graph"><div id="plot-l9-reflection-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the restricted sine curve (solid blue, from $-\\pi/2$ to $\\pi/2$) and its mirror image, the arcsin curve (solid orange), reflected across the dashed diagonal $y = x$. Pick any point on the sine curve, draw a perpendicular to the diagonal, and the same distance on the other side lands you on the arcsin curve. The two curves cross only on the line $y = x$ itself &mdash; at the origin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs1=[];var ys1=[];for(var i=0;i<=200;i++){var t=-Math.PI/2+Math.PI*i/200;xs1.push(t);ys1.push(Math.sin(t));}
var sinT={x:xs1,y:ys1,mode:'lines',name:'y = sin x (restricted)',line:{color:'#3b82f6',width:2.8}};
var xs2=[];var ys2=[];for(var i=0;i<=200;i++){var t=-1+2*i/200;xs2.push(t);ys2.push(Math.asin(t));}
var asinT={x:xs2,y:ys2,mode:'lines',name:'y = arcsin x',line:{color:'#f59e0b',width:2.8}};
var diag={x:[-Math.PI/2,Math.PI/2],y:[-Math.PI/2,Math.PI/2],mode:'lines',name:'y = x',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dash'}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.9,1.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.9,1.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-reflection-en',[sinT,asinT,diag],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">EXERCISE</div><div class="think-body">Sketch by hand the restricted cosine curve (from $0$ to $\\pi$) together with its arccos reflection. Verify visually that the points $(0, 1)$ and $(1, 0)$ swap, that $(\\pi/2, 0)$ and $(0, \\pi/2)$ swap, and that the curves meet on the diagonal somewhere near $(0.74, 0.74)$. (The exact fixed point of arccos is the unique solution of $\\cos x = x$, often called the Dottie number, $\\approx 0.7391$.)</div></div>

<h2 class="lesson-title">7. Cancellation Identities &mdash; And When They Fail</h2>

<div class="calc-highlight"><strong>The intuition:</strong> applying an inverse function should undo the original. For inverse trig this is true <em>inside</em> the principal range, but it fails outside &mdash; and that exception is the single most common student error in this topic.</div>

<div class="calc-formula"><div class="formula-label">CANCELLATION IDENTITIES (ALWAYS HOLD)</div><div class="formula-main">$$\\sin(\\arcsin x) = x \\quad (x \\in [-1,1])$$ $$\\cos(\\arccos x) = x \\quad (x \\in [-1,1])$$ $$\\tan(\\arctan x) = x \\quad (x \\in \\mathbb{R})$$</div><div class="formula-sub">"Forward of inverse" always cancels. Feed in a number, the inverse picks the right angle, the forward function returns the original number.</div></div>

<div class="calc-formula"><div class="formula-label">REVERSE CANCELLATIONS (HOLD ONLY IN PRINCIPAL RANGE)</div><div class="formula-main">$$\\arcsin(\\sin x) = x \\;\\;\\text{only if}\\;\\; x \\in [-\\pi/2, \\pi/2]$$ $$\\arccos(\\cos x) = x \\;\\;\\text{only if}\\;\\; x \\in [0, \\pi]$$ $$\\arctan(\\tan x) = x \\;\\;\\text{only if}\\;\\; x \\in (-\\pi/2, \\pi/2)$$</div><div class="formula-sub">"Inverse of forward" only cancels when the input is already in the right interval. Otherwise the result is the principal angle with the same sine/cosine/tangent.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; THE CLASSIC TRAP</div><div class="example-body">Compute $\\arcsin\\!\\bigl(\\sin\\bigl(\\tfrac{5\\pi}{6}\\bigr)\\bigr)$.<br><br>Naive answer: "the arcsin cancels the sin, so it equals $5\\pi/6$." <strong>Wrong.</strong><br><br>$5\\pi/6 = 150^\\circ$ is <em>not</em> in the principal range $[-\\pi/2, \\pi/2] = [-90^\\circ, 90^\\circ]$, so we cannot just cancel. We must evaluate the inner part first.<br><br>$\\sin(5\\pi/6) = \\sin(\\pi - \\pi/6) = \\sin(\\pi/6) = 1/2$.<br><br>Now $\\arcsin(1/2) = \\pi/6$ (the principal angle).<br><br>Final answer: <strong>$\\pi/6$</strong>, not $5\\pi/6$. The function returned the principal representative.</div></div>

<div class="calc-formula"><div class="formula-label">RIGHT-TRIANGLE IDENTITY: sin(arccos x)</div><div class="formula-main">$$\\sin(\\arccos x) \\;=\\; \\sqrt{1 - x^2} \\quad (x \\in [-1, 1])$$</div><div class="formula-sub">Why: let $\\theta = \\arccos x$, so $\\cos\\theta = x$ and $\\theta \\in [0, \\pi]$. Then $\\sin^2\\theta = 1 - x^2$. Because $\\theta \\in [0, \\pi]$, $\\sin\\theta \\geq 0$, so we take the positive root.</div></div>

<div class="calc-formula"><div class="formula-label">RIGHT-TRIANGLE IDENTITY: cos(arctan x)</div><div class="formula-main">$$\\cos(\\arctan x) \\;=\\; \\frac{1}{\\sqrt{1 + x^2}} \\quad (x \\in \\mathbb{R})$$</div><div class="formula-sub">Picture a right triangle with legs $1$ and $x$ &mdash; opposite leg $x$, adjacent leg $1$, hypotenuse $\\sqrt{1+x^2}$. The angle opposite to $x$ has tangent $x$, so it equals $\\arctan x$. Its cosine is adjacent over hypotenuse, namely $1/\\sqrt{1+x^2}$.</div></div>

<div class="l-note"><strong>A small calculus preview:</strong> the inverse trig functions are not just convenient symbols &mdash; they are smooth functions with simple derivatives that you will meet in calculus. Quick preview: $\\dfrac{d}{dx}\\arcsin x = \\dfrac{1}{\\sqrt{1-x^2}}$, $\\dfrac{d}{dx}\\arctan x = \\dfrac{1}{1+x^2}$. Both appear all over integration tables. We will derive them properly in calculus.</div>

<h2 class="lesson-title">8. Worked Problems</h2>

<p class="l-text">Six classic problems that fix the principal-value habit in your head. Try each one yourself first; only then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; THE FUNDAMENTAL ARCSIN</div><div class="example-body"><strong>Evaluate $\\arcsin(1/2)$.</strong><br><br>We need an angle $\\theta$ in $[-\\pi/2, \\pi/2]$ with $\\sin\\theta = 1/2$. From the unit-circle table, $\\sin(\\pi/6) = 1/2$, and $\\pi/6$ is in the principal range.<br><br>Answer: <strong>$\\arcsin(1/2) = \\pi/6 = 30^\\circ$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; NEGATIVE ARCCOS</div><div class="example-body"><strong>Evaluate $\\arccos(-\\sqrt{3}/2)$.</strong><br><br>We need $\\theta$ in $[0, \\pi]$ with $\\cos\\theta = -\\sqrt{3}/2$. The reference angle is $\\pi/6$ (since $\\cos(\\pi/6) = \\sqrt{3}/2$), and cosine is negative in the second quadrant, so $\\theta = \\pi - \\pi/6 = 5\\pi/6$.<br><br>Answer: <strong>$\\arccos(-\\sqrt{3}/2) = 5\\pi/6 = 150^\\circ$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; FUNDAMENTAL ARCTAN</div><div class="example-body"><strong>Evaluate $\\arctan(1)$.</strong><br><br>We need $\\theta$ in $(-\\pi/2, \\pi/2)$ with $\\tan\\theta = 1$. From $\\tan(\\pi/4) = 1$ and $\\pi/4$ is in the range, we have:<br><br>Answer: <strong>$\\arctan(1) = \\pi/4 = 45^\\circ$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; COMPOSITION WITH RIGHT TRIANGLE</div><div class="example-body"><strong>Evaluate $\\sin\\!\\bigl(\\arccos(1/3)\\bigr)$.</strong><br><br>Let $\\theta = \\arccos(1/3)$. Then $\\cos\\theta = 1/3$ and $\\theta \\in [0, \\pi]$, so $\\sin\\theta \\geq 0$.<br><br>From $\\sin^2\\theta + \\cos^2\\theta = 1$: $\\sin^2\\theta = 1 - 1/9 = 8/9$, so $\\sin\\theta = \\sqrt{8}/3 = 2\\sqrt{2}/3$.<br><br>Answer: <strong>$\\sin\\!\\bigl(\\arccos(1/3)\\bigr) = \\dfrac{2\\sqrt{2}}{3}$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SOLVING AN EQUATION</div><div class="example-body"><strong>Find all $x$ in $[0, 2\\pi]$ with $\\sin x = -\\dfrac{\\sqrt{2}}{2}$.</strong><br><br>Principal value: $\\arcsin(-\\sqrt{2}/2) = -\\pi/4$. This is outside $[0, 2\\pi]$, so we look for the corresponding angles in the requested interval.<br><br>Sine is negative in the third and fourth quadrants. Reference angle $\\pi/4$. So:<br>Third quadrant: $x = \\pi + \\pi/4 = 5\\pi/4$.<br>Fourth quadrant: $x = 2\\pi - \\pi/4 = 7\\pi/4$.<br><br>Answer: <strong>$x = 5\\pi/4$ or $x = 7\\pi/4$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; THE CANCELLATION TRAP</div><div class="example-body"><strong>Simplify $\\arcsin\\!\\bigl(\\sin(2\\pi/3)\\bigr)$.</strong><br><br>$2\\pi/3 = 120^\\circ$ is <em>not</em> in $[-\\pi/2, \\pi/2]$, so we cannot simply cancel.<br><br>Inner: $\\sin(2\\pi/3) = \\sin(\\pi - \\pi/3) = \\sin(\\pi/3) = \\sqrt{3}/2$.<br><br>Outer: $\\arcsin(\\sqrt{3}/2) = \\pi/3$ (the principal angle).<br><br>Answer: <strong>$\\pi/3$</strong>, not $2\\pi/3$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\arcsin x$: domain $[-1, 1]$, range $[-\\pi/2, \\pi/2]$, increasing</li>
<li>$\\arccos x$: domain $[-1, 1]$, range $[0, \\pi]$, decreasing</li>
<li>$\\arctan x$: domain $\\mathbb{R}$, range $(-\\pi/2, \\pi/2)$, increasing, horizontal asymptotes at $\\pm\\pi/2$</li>
<li>Each inverse is the reflection of the restricted forward graph across the line $y = x$</li>
<li>$\\arcsin x + \\arccos x = \\pi/2$ for all $x \\in [-1, 1]$</li>
<li>$\\sin(\\arcsin x) = x$ always; $\\arcsin(\\sin x) = x$ only if $x \\in [-\\pi/2, \\pi/2]$</li>
<li>Composition identities via right-triangle: $\\sin(\\arccos x) = \\sqrt{1-x^2}$, $\\cos(\\arctan x) = 1/\\sqrt{1+x^2}$</li>
<li>Derivatives (preview): $(\\arcsin)' = 1/\\sqrt{1-x^2}$, $(\\arctan)' = 1/(1+x^2)$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Matematikteki her işlemin bir tersi vardır.</strong> Toplamayı çıkarma, çarpmayı bölme, kare almayı karekök geri alır. Sinüs, kosinüs ve tanjant da farklı değildir: her biri girdi olarak bir <em>açı</em> alır, çıktı olarak bir <em>sayı</em> üretir. Ters işlem ise sayı alıp açı döndürmelidir. İşte bu ters işlemler ters trigonometrik fonksiyonlardır: arcsin, arccos ve arctan &mdash; bu dersin konusu.</p>

<p class="l-text">Sorun şu ki sin, cos ve tan periyodiktir: $\\sin x$ hem $x = \\pi/6$ değerinde $0.5$'tir, hem $x = 5\\pi/6$ değerinde, hem $x = 13\\pi/6$ değerinde ve sonsuz başka açıda. Yani "sinüsü $0.5$ olan açı" tek değildir. Düzgün bir ters tanımlamak için orijinal fonksiyonu birebir olduğu bir parçaya kısıtlarız. Bu tek tasarım kararı, her ters fonksiyonun tanım kümesini, değer kümesini ve grafiğini belirler &mdash; ve 7. bölümde göreceğin tüm ince özdeşlikleri açıklar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\sin$, $\\cos$, $\\tan$'ın neden global tersi olmadığını ve kısıtlı tanım kümesinin neden gerektiğini söylemeyi</li>
<li>$\\arcsin$, $\\arccos$, $\\arctan$'ı tam tanım kümesi ve değer kümesi (esas değerler) ile tanımlamayı</li>
<li>Her tersin grafiğini, kısıtlı düz fonksiyonun $y = x$ doğrusuna göre yansıması olarak okumayı</li>
<li>Standart girdilerde kesin değerleri hesaplamayı: $\\arcsin(1/2)$, $\\arccos(-\\sqrt{3}/2)$, $\\arctan(1)$ gibi</li>
<li>Sadeleşme özdeşliklerini kullanmayı: $\\sin(\\arcsin x) = x$ ve $\\arcsin(\\sin x) = x$ &mdash; ve ikincisinin ne zaman bozulduğunu fark etmeyi</li>
<li>$\\sin(\\arccos x)$ ve $\\cos(\\arctan x)$ gibi bileşkeleri dik üçgen resmiyle sadeleştirmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Ters Fonksiyona Neden İhtiyacımız Var?</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> Bir haritacı bayrak direğinden 100 m uzakta duruyor ve gözünden direğin tepesine giden doğru bir $h$ yüksekliğinde yükseliyor. $h = 100 \\tan\\theta$ olduğunu biliyor. Açı &theta;'yı açıölçerle ölçerse $h$'yi hesaplayabilir. Peki ya $h$'yi biliyor ve &theta;'yı bulmak istiyorsa? Tanjantı <em>geri almak</em> zorunda &mdash; bir ters fonksiyona ihtiyacı var.</div>

<p class="l-text">Düz trigonometri şu soruyu cevaplar: <em>"bu açıda sinüs bana hangi sayıyı verir?"</em>. Ters trigonometri ise tersini sorar: <em>"hangi açı bana bu sayıyı verir?"</em>. Denklem dilinde:</p>

<div class="calc-formula"><div class="formula-label">TERS SORU</div><div class="formula-main">$$\\sin x = 0.5 \\quad\\Longrightarrow\\quad x \\;=\\; \\arcsin(0.5) \\;=\\; \\frac{\\pi}{6} \\;=\\; 30^\\circ$$</div><div class="formula-sub">Okunuşu: "$x$, sinüsü $0.5$ olan açıdır." $\\arcsin$ sembolü bazen $\\sin^{-1}$ olarak yazılır, ama dikkat &mdash; buradaki $-1$ üst indeksi <em>ters fonksiyon</em> anlamındadır, $1/\\sin$ tersi (resiprokal) değildir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düz yön</div><div class="card-body">Açı girer, sayı çıkar: $\\sin(30^\\circ) = 0.5$. Girdi geometriktir, çıktı $-1$ ile $1$ arasındaki bir orandır.</div></div>
<div class="calc-card"><div class="card-title">Ters yön</div><div class="card-body">Sayı girer, açı çıkar: $\\arcsin(0.5) = 30^\\circ$. Girdi orandır, çıktı geometriktir.</div></div>
<div class="calc-card"><div class="card-title">Gösterim uyarısı</div><div class="card-body">$\\sin^{-1}(x)$ ters anlamındadır, <strong>$\\dfrac{1}{\\sin x}$ değil</strong>. Resiprokali yazmak için $\\csc x$ ya da $(\\sin x)^{-1}$ kullan &mdash; parantezlerle açıkça.</div></div>
</div>

<p class="l-text">Hesap makineleri, fizik formülleri, mühendislik problemleri &mdash; yükseklik-uzaklık oranı ya da hız-büyüklük oranı ölçtüğümüz her yerde, sonunda altta yatan açıyı geri kazanmamız gerekir. Ters trigonometrik fonksiyonların görev tanımı budur.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Eline bir hesap makinesi al ve <strong>sin</strong>, <strong>cos</strong>, <strong>tan</strong> ile <strong>sin&#8315;&sup1;</strong>, <strong>cos&#8315;&sup1;</strong>, <strong>tan&#8315;&sup1;</strong> tuşlarını bul. İkinci satır terslerdir. $0.5$ yaz, sonra $\\sin^{-1}$'e bas: derece modunda $30$ görmelisin, radyan modunda ise $0.5236$ (yani $\\pi/6$).</div></div>

<h2 class="lesson-title">2. Sorun: Sinüs Birebir Değildir</h2>

<div class="calc-highlight"><strong>Bir fonksiyonun tersi vardır ancak ve ancak birebirse</strong> &mdash; her çıktı tam olarak bir girdiden gelmelidir. Sinüs bu testte çuvallar: $\\sin(\\pi/6) = 0.5$, ama $\\sin(5\\pi/6) = 0.5$, ve $\\sin(13\\pi/6) = 0.5$, ve böyle devam. Aynı sinüs değerine sahip sonsuz açı vardır, dolayısıyla "sinüsün tersi" yazılı haliyle bir fonksiyon değildir.</div>

<p class="l-text">Sinüs grafiğinin üzerine $y = 0.5$ yüksekliğinde yatay bir doğru çiz. Eğriyi sonsuz yerde keser. Yatay doğru testi başarısız olur. Düzeltme yapmadan "sinüsü $0.5$ olan açı hangisi?" sorusunun tek cevabı yoktur.</p>

<div class="calc-formula"><div class="formula-label">SİNÜS AYNI DEĞERİ SONSUZ KEZ ALIR</div><div class="formula-main">$$\\sin x \\;=\\; \\sin\\!\\bigl(x + 2k\\pi\\bigr) \\;=\\; \\sin\\!\\bigl(\\pi - x\\bigr) \\quad \\text{her tamsayı } k \\text{ için}$$</div><div class="formula-sub">İki tekrar kaynağı: $2\\pi$ periyodu (tam tur aynı yere döner) ve tümler açı özdeşliği $\\sin(\\pi - x) = \\sin x$ ($\\pi/2$'ye göre yansıma).</div></div>

<p class="l-text"><strong>Düzeltme.</strong> $\\sin$'i tanım kümesinin birebir olduğu bir parçasına kısıtla. Birçok seçim işe yarar, ama matematikçiler tek bir geleneği kabul etti: $\\left[-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right]$ aralığının dışındaki her şeyi kes. Bu aralıkta sinüs $-1$'den $+1$'e tekdüze yükselir &mdash; her çıktı tam olarak bir girdiye karşılık gelir. Bu kısıtlanmış sinüsün gerçek bir tersi vardır ve ona $\\arcsin$ deriz.</p>

<div class="l-note"><strong>Neden bu aralık?</strong> Sıfıra göre simetriktir, sinüs dalgasının en dik "yükselen" parçasını içerir ve sinüsün $x$ ile iyi yaklaşıldığı küçük açıları kapsar. Seçim gelenekseldir ama mükemmeldir.</div>

<h2 class="lesson-title">3. arcsin: Tanım, Tanım Kümesi, Değer Kümesi</h2>

<div class="calc-formula"><div class="formula-label">ARCSIN TANIMI</div><div class="formula-main">$$y \\;=\\; \\arcsin x \\quad\\Longleftrightarrow\\quad \\sin y \\;=\\; x \\;\\;\\text{ve}\\;\\; y \\in \\left[-\\frac{\\pi}{2},\\ \\frac{\\pi}{2}\\right]$$</div><div class="formula-sub">Okunuşu: "$y$, $[-\\pi/2, \\pi/2]$ aralığındaki, sinüsü $x$'e eşit olan açıdır." Köşeli parantezli kısıtlama <em>esas değer</em> anlaşmasıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım kümesi</div><div class="card-body">$x \\in [-1,\\ 1]$. Bu aralığın dışında $\\arcsin$ tanımsızdır &mdash; sinüs asla $1$'den büyük ya da $-1$'den küçük değer üretmez.</div></div>
<div class="calc-card"><div class="card-title">Değer kümesi (esas)</div><div class="card-body">$y \\in \\left[-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right]$, yani $[-90^\\circ,\\ 90^\\circ]$. Cevap her zaman birim çemberin sağ yarısındadır.</div></div>
<div class="calc-card"><div class="card-title">İşaret</div><div class="card-body">$\\arcsin x$, $x$ ile aynı işaretlidir: pozitif girdi pozitif açı, negatif girdi negatif açı, sıfır girdi sıfır verir.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI HESAPLAR</div><div class="example-body">$\\arcsin(0) = 0$ &mdash; çünkü $\\sin 0 = 0$ ve $0$ esas aralıkta.<br>$\\arcsin(1/2) = \\pi/6 = 30^\\circ$ &mdash; çünkü $\\sin(\\pi/6) = 1/2$ ve $\\pi/6$, $[-\\pi/2, \\pi/2]$'de.<br>$\\arcsin(-1/2) = -\\pi/6 = -30^\\circ$ &mdash; negatif ikiz.<br>$\\arcsin(1) = \\pi/2 = 90^\\circ$ &mdash; sınır.<br>$\\arcsin(-1) = -\\pi/2 = -90^\\circ$ &mdash; öteki sınır.<br>$\\arcsin(\\sqrt{2}/2) = \\pi/4 = 45^\\circ$.<br>$\\arcsin(\\sqrt{3}/2) = \\pi/3 = 60^\\circ$.</div></div>

<div class="calc-graph"><div id="plot-l9-arcsin-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = \\arcsin x$'in tam tanım kümesi $[-1, 1]$ üzerindeki grafiği. Eğri sol alt uç $(-1, -\\pi/2)$'den orijinden geçerek sağ üst uç $(1, \\pi/2)$'ye tekdüze yükselir. Kesikli yatay çizgiler esas değer sınırlarını işaretler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=-1+2*i/200;xs.push(t);ys.push(Math.asin(t));}
var curve={x:xs,y:ys,mode:'lines',name:'y = arcsin x',line:{color:'#3b82f6',width:3}};
var topL={x:[-1.1,1.1],y:[Math.PI/2,Math.PI/2],mode:'lines',name:'y = π/2',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var botL={x:[-1.1,1.1],y:[-Math.PI/2,-Math.PI/2],mode:'lines',name:'y = -π/2',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var pts={x:[-1,-0.5,0,0.5,1],y:[-Math.PI/2,-Math.PI/6,0,Math.PI/6,Math.PI/2],mode:'markers+text',text:['(-1, -π/2)','(-1/2, -π/6)','(0,0)','(1/2, π/6)','(1, π/2)'],textposition:'top center',textfont:{color:'#ebe6dc',size:10},marker:{size:8,color:'#f59e0b'},name:'önemli noktalar'};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y (radyan)',range:[-1.9,1.9],tickvals:[-Math.PI/2,-Math.PI/4,0,Math.PI/4,Math.PI/2],ticktext:['-π/2','-π/4','0','π/4','π/2'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-arcsin-tr',[curve,topL,botL,pts],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Zihinsel model:</strong> arcsin grafiğini yatay okumak ters soruyu cevaplar. $\\arcsin(0.6)$'yı bulmak için $x$-ekseninde $0.6$'yı bul, eğriye dik çık, sonra $y$ değerini oku &mdash; yaklaşık $0.644$ rad, yani $36.87^\\circ$ civarında durursun.</div>

<h2 class="lesson-title">4. arccos: Tanım, Tanım Kümesi, Değer Kümesi</h2>

<p class="l-text">arccos için aynı oyunu oynuyoruz ama farklı bir kısıtlı aralık seçiyoruz. Kosinüs aynı birebirlik sorununa sahiptir, ama doğal kısıtlama $[-\\pi/2, \\pi/2]$ değil, $[0, \\pi]$'dir. Neden? Çünkü kosinüs, $x=0$'da $+1$'den $x=\\pi$'de $-1$'e <em>azalır</em> ve o parça tüm çıktı aralığı $[-1, 1]$'i tam bir kere tarar.</p>

<div class="calc-formula"><div class="formula-label">ARCCOS TANIMI</div><div class="formula-main">$$y \\;=\\; \\arccos x \\quad\\Longleftrightarrow\\quad \\cos y \\;=\\; x \\;\\;\\text{ve}\\;\\; y \\in [0,\\ \\pi]$$</div><div class="formula-sub">Okunuşu: "$y$, $[0, \\pi]$ aralığındaki, kosinüsü $x$'e eşit olan açıdır." Değer kümesinin <em>üst</em> yarım daire olduğuna dikkat &mdash; sıfıra göre simetrik değil.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım kümesi</div><div class="card-body">$x \\in [-1, 1]$ &mdash; arcsin ile aynı.</div></div>
<div class="calc-card"><div class="card-title">Değer kümesi (esas)</div><div class="card-body">$y \\in [0,\\ \\pi]$, yani $[0^\\circ, 180^\\circ]$. Cevap her zaman negatif değildir.</div></div>
<div class="calc-card"><div class="card-title">Davranış</div><div class="card-body">arccos <em>azalandır</em> &mdash; büyük girdi küçük açı verir. $x$, $-1$'den $+1$'e giderken açı $y$, $\\pi$'den $0$'a düşer.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI HESAPLAR</div><div class="example-body">$\\arccos(1) = 0$ &mdash; kosinüs $0$ açısında $1$'dir.<br>$\\arccos(0) = \\pi/2 = 90^\\circ$ &mdash; kosinüs $\\pi/2$'de sıfırlanır.<br>$\\arccos(-1) = \\pi = 180^\\circ$ &mdash; kosinüs $\\pi$'de $-1$'dir.<br>$\\arccos(1/2) = \\pi/3 = 60^\\circ$.<br>$\\arccos(-1/2) = 2\\pi/3 = 120^\\circ$ &mdash; $\\pi/3$'ün bütünleyeni.<br>$\\arccos(\\sqrt{2}/2) = \\pi/4 = 45^\\circ$.<br>$\\arccos(-\\sqrt{3}/2) = 5\\pi/6 = 150^\\circ$.</div></div>

<div class="calc-graph"><div id="plot-l9-arccos-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = \\arccos x$, $[-1, 1]$ üzerinde. Eğri $(-1, \\pi)$'den $(0, \\pi/2)$'den geçerek $(1, 0)$'a <em>azalır</em> &mdash; arcsin'in ayna davranışı: yukarıda başlar, aşağıda biter. Kesikli çizgiler $y = 0$ ve $y = \\pi$ sınırlarını gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=-1+2*i/200;xs.push(t);ys.push(Math.acos(t));}
var curve={x:xs,y:ys,mode:'lines',name:'y = arccos x',line:{color:'#3b82f6',width:3}};
var topL={x:[-1.1,1.1],y:[Math.PI,Math.PI],mode:'lines',name:'y = π',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var botL={x:[-1.1,1.1],y:[0,0],mode:'lines',name:'y = 0',line:{color:'rgba(255,255,255,0.35)',width:1.4,dash:'dash'}};
var pts={x:[-1,-0.5,0,0.5,1],y:[Math.PI,2*Math.PI/3,Math.PI/2,Math.PI/3,0],mode:'markers+text',text:['(-1, π)','(-1/2, 2π/3)','(0, π/2)','(1/2, π/3)','(1, 0)'],textposition:'top center',textfont:{color:'#ebe6dc',size:10},marker:{size:8,color:'#f59e0b'},name:'önemli noktalar'};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y (radyan)',range:[-0.3,Math.PI+0.3],tickvals:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI],ticktext:['0','π/4','π/2','3π/4','π'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-arccos-tr',[curve,topL,botL,pts],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">ARCSIN VE ARCCOS'U BAĞLAYAN YARARLI ÖZDEŞLİK</div><div class="formula-main">$$\\arcsin x \\;+\\; \\arccos x \\;=\\; \\frac{\\pi}{2} \\quad \\text{her } x \\in [-1, 1] \\text{ için}$$</div><div class="formula-sub">İki açı birbirinin tümleyenidir. Birini biliyorsan diğeri $\\pi/2$ eksiğidir.</div></div>

<h2 class="lesson-title">5. arctan: Tanım, Tanım Kümesi, Değer Kümesi</h2>

<p class="l-text">Tanjantın şekli sinüs ve kosinüsten farklıdır. Sınırsızdır &mdash; $x = -\\pi/2$'de $-\\infty$'dan $x = \\pi/2$'de $+\\infty$'a yükselir; her uçta bir dikey asimptot vardır. Birebir bir ters yapmak için tanjantı açık aralık $\\left(-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right)$'a kısıtlarız &mdash; arcsin için kullandığımız aralığın aynısı.</p>

<div class="calc-formula"><div class="formula-label">ARCTAN TANIMI</div><div class="formula-main">$$y \\;=\\; \\arctan x \\quad\\Longleftrightarrow\\quad \\tan y \\;=\\; x \\;\\;\\text{ve}\\;\\; y \\in \\left(-\\frac{\\pi}{2},\\ \\frac{\\pi}{2}\\right)$$</div><div class="formula-sub">Açık aralık: uç noktalar hariçtir çünkü $\\tan$, $\\pm\\pi/2$'de tanımsızdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım kümesi</div><div class="card-body">$x \\in \\mathbb{R}$ &mdash; <strong>tüm reel sayılar</strong>. Her girdi izinlidir; tanjant her yüksekliğe ulaşır.</div></div>
<div class="calc-card"><div class="card-title">Değer kümesi (esas)</div><div class="card-body">$y \\in \\left(-\\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{2}\\right)$, bir <em>açık</em> aralık.</div></div>
<div class="calc-card"><div class="card-title">Yatay asimptotlar</div><div class="card-body">$x \\to +\\infty$ iken $\\arctan x \\to \\pi/2$. $x \\to -\\infty$ iken $\\arctan x \\to -\\pi/2$. Grafik iki yatay doğruya sarılır.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI HESAPLAR</div><div class="example-body">$\\arctan(0) = 0$.<br>$\\arctan(1) = \\pi/4 = 45^\\circ$ &mdash; çünkü $\\tan(\\pi/4) = 1$.<br>$\\arctan(-1) = -\\pi/4 = -45^\\circ$.<br>$\\arctan(\\sqrt{3}) = \\pi/3 = 60^\\circ$.<br>$\\arctan(\\sqrt{3}/3) = \\pi/6 = 30^\\circ$ &mdash; $\\tan(\\pi/6) = 1/\\sqrt{3} = \\sqrt{3}/3$ olduğunu hatırla.<br>$\\arctan(\\text{çok büyük pozitif}) \\to \\pi/2$ ama asla ulaşmaz.</div></div>

<div class="calc-graph"><div id="plot-l9-arctan-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = \\arctan x$, $-8$'den $+8$'e geniş bir pencerede. Eğri orijinden eğim $1$ ile geçer, sonra bükülür ve yatay asimptotlara $y = \\pm\\pi/2$ (kesikli çizgiler) yaklaşır. Eğri her iki asimptota hiç değmez &mdash; $x = 100$'de bile değer yalnızca $1.5608$ rad, $\\pi/2 \\approx 1.5708$'in altında.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var t=-8+16*i/300;xs.push(t);ys.push(Math.atan(t));}
var curve={x:xs,y:ys,mode:'lines',name:'y = arctan x',line:{color:'#3b82f6',width:3}};
var topL={x:[-8,8],y:[Math.PI/2,Math.PI/2],mode:'lines',name:'y = π/2 (asimptot)',line:{color:'rgba(239,68,68,0.6)',width:1.4,dash:'dash'}};
var botL={x:[-8,8],y:[-Math.PI/2,-Math.PI/2],mode:'lines',name:'y = -π/2 (asimptot)',line:{color:'rgba(239,68,68,0.6)',width:1.4,dash:'dash'}};
var pts={x:[-1,0,1,Math.sqrt(3)],y:[-Math.PI/4,0,Math.PI/4,Math.PI/3],mode:'markers+text',text:['(-1, -π/4)','(0,0)','(1, π/4)','(√3, π/3)'],textposition:'top center',textfont:{color:'#ebe6dc',size:10},marker:{size:8,color:'#f59e0b'},name:'önemli noktalar'};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y (radyan)',range:[-1.9,1.9],tickvals:[-Math.PI/2,-Math.PI/4,0,Math.PI/4,Math.PI/2],ticktext:['-π/2','-π/4','0','π/4','π/2'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-arctan-tr',[curve,topL,botL,pts],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>arctan fizikte neden önemli:</strong> bir vektörün açısı $\\theta = \\arctan(y/x)$ ile hesaplanır. Robotikte, navigasyonda, bilgisayar grafiklerinde, makine öğrenmesi gradyanlarında &mdash; eğimin açıya çevrildiği her yerde &mdash; işi arctan yapar. $\\operatorname{atan2}(y, x)$ varyantı, $x$'in işaretini de dikkate alarak değer kümesini tam $(-\\pi, \\pi]$'ya genişletir.</div>

<h2 class="lesson-title">6. y = x Doğrusuna Göre Yansımalar</h2>

<div class="calc-highlight"><strong>Genel ilke:</strong> herhangi bir ters fonksiyonun grafiği, orijinal grafiğin $y = x$ köşegen doğrusuna göre yansımasıdır. Girdi ile çıktının rollerini değiştir, resim 45 derece doğru boyunca devrilir.</div>

<p class="l-text">Bu, her tersi hatırlamak için güzel bir görsel yol sağlar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">sin &rarr; arcsin</div><div class="card-body">$y = \\sin x$'in $x = -\\pi/2$'den $x = \\pi/2$'ye olan parçasını al. $y = x$'e göre yansıt. arcsin grafiğini elde edersin. Tanım ve değer kümeleri rolleri değişir.</div></div>
<div class="calc-card"><div class="card-title">cos &rarr; arccos</div><div class="card-body">$y = \\cos x$'in $x = 0$'dan $x = \\pi$'ye olan parçasını al. $y = x$'e göre yansıt. Sonuç arccos grafiğidir.</div></div>
<div class="calc-card"><div class="card-title">tan &rarr; arctan</div><div class="card-body">$y = \\tan x$'in $\\pm \\pi/2$'deki iki dikey asimptotu arasındaki parçasını al. $y = x$'e göre yansıt. Dikey asimptotlar yatay asimptotlara dönüşür &mdash; arctan'ın düzleşmesinin sebebi budur.</div></div>
</div>

<div class="calc-graph"><div id="plot-l9-reflection-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> kısıtlanmış sinüs eğrisi (düz mavi, $-\\pi/2$'den $\\pi/2$'ye) ve onun ayna görüntüsü olan arcsin eğrisi (düz turuncu), kesikli köşegen $y = x$'e göre yansıtılmış. Sinüs eğrisi üzerinde herhangi bir nokta al, köşegene dik bir doğru çiz ve diğer tarafta aynı uzaklığa düşen nokta arcsin eğrisinin üzerindedir. İki eğri yalnızca $y = x$ doğrusu üzerinde kesişir &mdash; orijinde.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs1=[];var ys1=[];for(var i=0;i<=200;i++){var t=-Math.PI/2+Math.PI*i/200;xs1.push(t);ys1.push(Math.sin(t));}
var sinT={x:xs1,y:ys1,mode:'lines',name:'y = sin x (kısıtlı)',line:{color:'#3b82f6',width:2.8}};
var xs2=[];var ys2=[];for(var i=0;i<=200;i++){var t=-1+2*i/200;xs2.push(t);ys2.push(Math.asin(t));}
var asinT={x:xs2,y:ys2,mode:'lines',name:'y = arcsin x',line:{color:'#f59e0b',width:2.8}};
var diag={x:[-Math.PI/2,Math.PI/2],y:[-Math.PI/2,Math.PI/2],mode:'lines',name:'y = x',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dash'}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.9,1.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.9,1.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:-0.15,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l9-reflection-tr',[sinT,asinT,diag],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ALIŞTIRMA</div><div class="think-body">El ile kısıtlanmış kosinüs eğrisini ($0$'dan $\\pi$'ye) ve arccos yansımasını birlikte çiz. $(0, 1)$ ile $(1, 0)$ noktalarının yer değiştirdiğini, $(\\pi/2, 0)$ ile $(0, \\pi/2)$'nin yer değiştirdiğini ve eğrilerin köşegen üzerinde $(0.74, 0.74)$ civarında bir yerde buluştuğunu görsel olarak doğrula. (arccos'un kesin sabit noktası $\\cos x = x$ denkleminin tek çözümüdür; Dottie sayısı diye geçer, $\\approx 0.7391$.)</div></div>

<h2 class="lesson-title">7. Sadeleşme Özdeşlikleri &mdash; Ve Ne Zaman Bozulur</h2>

<div class="calc-highlight"><strong>Sezgi:</strong> bir ters fonksiyon uygulamak orijinali geri almalıdır. Ters trigonometri için bu, esas değer aralığının <em>içinde</em> doğrudur, ama dışında bozulur &mdash; ve bu istisna, bu konudaki en yaygın öğrenci hatasıdır.</div>

<div class="calc-formula"><div class="formula-label">SADELEŞME ÖZDEŞLİKLERİ (DAİMA GEÇERLİ)</div><div class="formula-main">$$\\sin(\\arcsin x) = x \\quad (x \\in [-1,1])$$ $$\\cos(\\arccos x) = x \\quad (x \\in [-1,1])$$ $$\\tan(\\arctan x) = x \\quad (x \\in \\mathbb{R})$$</div><div class="formula-sub">"Tersin sonra düzü" daima sadeleşir. Bir sayı koy, ters doğru açıyı seçer, düz fonksiyon orijinal sayıyı geri verir.</div></div>

<div class="calc-formula"><div class="formula-label">TERS SADELEŞMELER (YALNIZ ESAS ARALIKTA GEÇERLİ)</div><div class="formula-main">$$\\arcsin(\\sin x) = x \\;\\;\\text{yalnız}\\;\\; x \\in [-\\pi/2, \\pi/2] \\text{ ise}$$ $$\\arccos(\\cos x) = x \\;\\;\\text{yalnız}\\;\\; x \\in [0, \\pi] \\text{ ise}$$ $$\\arctan(\\tan x) = x \\;\\;\\text{yalnız}\\;\\; x \\in (-\\pi/2, \\pi/2) \\text{ ise}$$</div><div class="formula-sub">"Düzün sonra tersi" yalnızca girdi zaten doğru aralıktaysa sadeleşir. Aksi halde sonuç, aynı sinüs/kosinüs/tanjant değerine sahip esas açı olur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; KLASİK TUZAK</div><div class="example-body">$\\arcsin\\!\\bigl(\\sin\\bigl(\\tfrac{5\\pi}{6}\\bigr)\\bigr)$ hesapla.<br><br>Saf cevap: "arcsin sin'i sadeleştirir, sonuç $5\\pi/6$." <strong>Yanlış.</strong><br><br>$5\\pi/6 = 150^\\circ$, $[-\\pi/2, \\pi/2] = [-90^\\circ, 90^\\circ]$ esas aralığında <em>değil</em>, dolayısıyla doğrudan sadeleştiremeyiz. Önce içteki kısmı hesaplamalıyız.<br><br>$\\sin(5\\pi/6) = \\sin(\\pi - \\pi/6) = \\sin(\\pi/6) = 1/2$.<br><br>Şimdi $\\arcsin(1/2) = \\pi/6$ (esas açı).<br><br>Son cevap: <strong>$\\pi/6$</strong>, $5\\pi/6$ değil. Fonksiyon esas temsilciyi döndürdü.</div></div>

<div class="calc-formula"><div class="formula-label">DİK ÜÇGEN ÖZDEŞLİĞİ: sin(arccos x)</div><div class="formula-main">$$\\sin(\\arccos x) \\;=\\; \\sqrt{1 - x^2} \\quad (x \\in [-1, 1])$$</div><div class="formula-sub">Sebep: $\\theta = \\arccos x$ olsun, yani $\\cos\\theta = x$ ve $\\theta \\in [0, \\pi]$. O zaman $\\sin^2\\theta = 1 - x^2$. $\\theta \\in [0, \\pi]$ olduğundan $\\sin\\theta \\geq 0$, dolayısıyla pozitif kökü alırız.</div></div>

<div class="calc-formula"><div class="formula-label">DİK ÜÇGEN ÖZDEŞLİĞİ: cos(arctan x)</div><div class="formula-main">$$\\cos(\\arctan x) \\;=\\; \\frac{1}{\\sqrt{1 + x^2}} \\quad (x \\in \\mathbb{R})$$</div><div class="formula-sub">Bacak uzunlukları $1$ ve $x$ olan bir dik üçgen düşün &mdash; karşı kenar $x$, komşu kenar $1$, hipotenüs $\\sqrt{1+x^2}$. $x$'in karşısındaki açının tanjantı $x$'tir, dolayısıyla bu açı $\\arctan x$'tir. Kosinüsü komşu/hipotenüs, yani $1/\\sqrt{1+x^2}$.</div></div>

<div class="l-note"><strong>Küçük bir kalkülüs ön izlemesi:</strong> ters trigonometrik fonksiyonlar sadece pratik semboller değildir &mdash; kalkülüste karşılaşacağın basit türevleri olan düzgün fonksiyonlardır. Hızlı önizleme: $\\dfrac{d}{dx}\\arcsin x = \\dfrac{1}{\\sqrt{1-x^2}}$, $\\dfrac{d}{dx}\\arctan x = \\dfrac{1}{1+x^2}$. İkisi de integral tablolarında her yerde karşına çıkar. Bunları kalkülüste düzgünce türeteceğiz.</div>

<h2 class="lesson-title">8. Çözümlü Problemler</h2>

<p class="l-text">Esas değer alışkanlığını kafana yerleştiren altı klasik problem. Önce her birini kendin dene; ancak ondan sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; TEMEL ARCSIN</div><div class="example-body"><strong>$\\arcsin(1/2)$ değerini hesapla.</strong><br><br>$\\sin\\theta = 1/2$ ve $\\theta \\in [-\\pi/2, \\pi/2]$ olan bir $\\theta$ açısı arıyoruz. Birim çember tablosundan, $\\sin(\\pi/6) = 1/2$ ve $\\pi/6$ esas aralıktadır.<br><br>Cevap: <strong>$\\arcsin(1/2) = \\pi/6 = 30^\\circ$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; NEGATİF ARCCOS</div><div class="example-body"><strong>$\\arccos(-\\sqrt{3}/2)$ değerini hesapla.</strong><br><br>$\\cos\\theta = -\\sqrt{3}/2$ ve $\\theta \\in [0, \\pi]$ olan bir $\\theta$ arıyoruz. Referans açı $\\pi/6$ ($\\cos(\\pi/6) = \\sqrt{3}/2$ olduğundan) ve kosinüs ikinci bölgede negatiftir, dolayısıyla $\\theta = \\pi - \\pi/6 = 5\\pi/6$.<br><br>Cevap: <strong>$\\arccos(-\\sqrt{3}/2) = 5\\pi/6 = 150^\\circ$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TEMEL ARCTAN</div><div class="example-body"><strong>$\\arctan(1)$ değerini hesapla.</strong><br><br>$\\tan\\theta = 1$ ve $\\theta \\in (-\\pi/2, \\pi/2)$ olan bir $\\theta$ arıyoruz. $\\tan(\\pi/4) = 1$ ve $\\pi/4$ aralıktadır:<br><br>Cevap: <strong>$\\arctan(1) = \\pi/4 = 45^\\circ$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; DİK ÜÇGEN İLE BİLEŞKE</div><div class="example-body"><strong>$\\sin\\!\\bigl(\\arccos(1/3)\\bigr)$ değerini hesapla.</strong><br><br>$\\theta = \\arccos(1/3)$ olsun. O zaman $\\cos\\theta = 1/3$ ve $\\theta \\in [0, \\pi]$, dolayısıyla $\\sin\\theta \\geq 0$.<br><br>$\\sin^2\\theta + \\cos^2\\theta = 1$'den: $\\sin^2\\theta = 1 - 1/9 = 8/9$, böylece $\\sin\\theta = \\sqrt{8}/3 = 2\\sqrt{2}/3$.<br><br>Cevap: <strong>$\\sin\\!\\bigl(\\arccos(1/3)\\bigr) = \\dfrac{2\\sqrt{2}}{3}$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DENKLEM ÇÖZME</div><div class="example-body"><strong>$[0, 2\\pi]$ aralığında $\\sin x = -\\dfrac{\\sqrt{2}}{2}$ olan tüm $x$ değerlerini bul.</strong><br><br>Esas değer: $\\arcsin(-\\sqrt{2}/2) = -\\pi/4$. Bu $[0, 2\\pi]$'nin dışındadır, dolayısıyla istenen aralıkta karşılık gelen açıları ararız.<br><br>Sinüs üçüncü ve dördüncü bölgede negatiftir. Referans açı $\\pi/4$. Böylece:<br>Üçüncü bölge: $x = \\pi + \\pi/4 = 5\\pi/4$.<br>Dördüncü bölge: $x = 2\\pi - \\pi/4 = 7\\pi/4$.<br><br>Cevap: <strong>$x = 5\\pi/4$ veya $x = 7\\pi/4$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; SADELEŞME TUZAĞI</div><div class="example-body"><strong>$\\arcsin\\!\\bigl(\\sin(2\\pi/3)\\bigr)$ ifadesini sadeleştir.</strong><br><br>$2\\pi/3 = 120^\\circ$, $[-\\pi/2, \\pi/2]$ aralığında <em>değildir</em>, dolayısıyla doğrudan sadeleştiremeyiz.<br><br>İç kısım: $\\sin(2\\pi/3) = \\sin(\\pi - \\pi/3) = \\sin(\\pi/3) = \\sqrt{3}/2$.<br><br>Dış kısım: $\\arcsin(\\sqrt{3}/2) = \\pi/3$ (esas açı).<br><br>Cevap: <strong>$\\pi/3$</strong>, $2\\pi/3$ değil.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$\\arcsin x$: tanım kümesi $[-1, 1]$, değer kümesi $[-\\pi/2, \\pi/2]$, artan</li>
<li>$\\arccos x$: tanım kümesi $[-1, 1]$, değer kümesi $[0, \\pi]$, azalan</li>
<li>$\\arctan x$: tanım kümesi $\\mathbb{R}$, değer kümesi $(-\\pi/2, \\pi/2)$, artan, $\\pm\\pi/2$'de yatay asimptotlar</li>
<li>Her ters, kısıtlı düz grafiğin $y = x$ doğrusuna göre yansımasıdır</li>
<li>$\\arcsin x + \\arccos x = \\pi/2$, her $x \\in [-1, 1]$ için</li>
<li>$\\sin(\\arcsin x) = x$ daima; $\\arcsin(\\sin x) = x$ yalnız $x \\in [-\\pi/2, \\pi/2]$ ise</li>
<li>Dik üçgenle bileşke özdeşlikleri: $\\sin(\\arccos x) = \\sqrt{1-x^2}$, $\\cos(\\arctan x) = 1/\\sqrt{1+x^2}$</li>
<li>Türevler (önizleme): $(\\arcsin)' = 1/\\sqrt{1-x^2}$, $(\\arctan)' = 1/(1+x^2)$</li>
</ul>
</div>`

};
