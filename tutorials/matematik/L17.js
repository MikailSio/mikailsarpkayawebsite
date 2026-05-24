/* ============================================================
   tutorials/matematik/L17.js
   Lise Matematik · Ders 17: Türev Tanımı (Limit Tabanlı)
   Bilingual EN + TR · KaTeX + Plotly · NO Python, NO ML
   ============================================================ */
window.LISE_MAT_L17 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The derivative is the single most powerful idea in mathematics after the limit itself.</strong> Once you can compute how fast a quantity is changing at a precise instant — not over an interval, but at a single point — you unlock all of differential calculus, classical mechanics, optimisation, geometric tangent problems, and the rate language used by every quantitative science. This lesson builds the derivative from the limit definition you mastered in lessons 13 to 16. We move deliberately. Every step is justified, every formula is derived, every worked example is computed in full.</p>

<p class="l-text">In Turkish high school the derivative appears at the start of 12th grade. The Ministry of National Education curriculum opens by demanding that you can state the limit definition of $f'(x)$, derive the derivative of $x^2$, $1/x$ and $\\sqrt{x}$ from that definition, and read $f'(x_0)$ as the slope of the tangent line at $x = x_0$. Everything in this lesson is examinable on the AYT (and again on KPSS for those of you heading to graduate work). The next lesson will move on to differentiation <em>rules</em>; here we lay the foundation by working only from the definition.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read the average rate of change $\\Delta f / \\Delta x$ as the slope of a secant line and the instantaneous rate as its limit</li>
<li>State the limit definition $f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$ precisely and explain why both numerator and denominator must approach 0 together</li>
<li>Switch fluently between the two equivalent forms $\\lim_{h\\to 0}$ and $\\lim_{x \\to a}$ of the derivative</li>
<li>Compute the derivatives of $f(x) = x^2$, $f(x) = 1/x$ and $f(x) = \\sqrt{x}$ directly from the limit definition</li>
<li>Interpret $f'(x_0)$ geometrically as the slope of the tangent line at the point $(x_0, f(x_0))$</li>
<li>Interpret $f'(t_0)$ physically as instantaneous velocity, and the derivative of velocity as instantaneous acceleration</li>
<li>Write the equation of the tangent line to a curve at a given point</li>
</ul>
</div>

<h2 class="lesson-title">1. The Instantaneous Velocity Problem</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a car drives from Ankara to Istanbul. The trip covers 450 km in 5 hours, so its <em>average</em> speed is 90 km/h. But the speedometer never sits still — it climbs above 120 on the highway, drops to 0 at the toll booth, hovers near 60 inside the city. The number on the speedometer at any single moment is the <em>instantaneous</em> speed. The derivative is the mathematical tool that turns a record of position-over-time into a record of speed-at-each-instant.</div>

<p class="l-text">Suppose a body moves along a straight line and we know its position $s(t)$ at every time $t$. The average velocity between time $t_1$ and time $t_2$ is the change in position divided by the change in time:</p>

<div class="calc-formula"><div class="formula-label">AVERAGE VELOCITY</div><div class="formula-main">$$v_{\\text{avg}} = \\frac{s(t_2) - s(t_1)}{t_2 - t_1} = \\frac{\\Delta s}{\\Delta t}$$</div><div class="formula-sub">The Greek letter $\\Delta$ (delta) is read "change in." It is shorthand for "final value minus initial value."</div></div>

<p class="l-text"><strong>The puzzle.</strong> What does the speedometer mean by "speed at this very instant"? If we shrink the interval, $\\Delta t$ becomes smaller and smaller, and the average velocity becomes a better and better approximation of the speed at the starting instant $t_1$. In the limit $\\Delta t \\to 0$ the numerator and the denominator both vanish — a 0/0 expression — but the ratio approaches a definite number. That number is the <em>instantaneous</em> velocity.</p>

<div class="calc-graph"><div id="plot-l17-position-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a position-time graph $s(t) = 5t^2$ for a body undergoing constant acceleration. The orange chord connects $(t_1, s(t_1))$ to $(t_2, s(t_2))$; its slope is the <em>average</em> velocity over $[t_1, t_2]$. The red line is the tangent at $(t_1, s(t_1))$; its slope is the <em>instantaneous</em> velocity at $t = t_1$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=i/100;xs.push(t);ys.push(5*t*t);}
var curve={x:xs,y:ys,mode:'lines',name:'s(t) = 5 t^2',line:{color:'#3b82f6',width:3}};
var t1=0.6, t2=1.6;
var chord={x:[t1,t2],y:[5*t1*t1,5*t2*t2],mode:'lines+markers',name:'secant: average velocity',line:{color:'#f59e0b',width:2.5,dash:'dash'},marker:{color:'#f59e0b',size:8}};
var slope=10*t1;
var tx=[t1-0.4,t1+0.6];var ty=[5*t1*t1+slope*(tx[0]-t1),5*t1*t1+slope*(tx[1]-t1)];
var tangent={x:tx,y:ty,mode:'lines',name:'tangent: instantaneous velocity',line:{color:'#ef4444',width:2.5}};
var ptA={x:[t1],y:[5*t1*t1],mode:'markers+text',name:'(t_1, s(t_1))',marker:{color:'#22c55e',size:11},text:['t_1'],textposition:'top left',textfont:{color:'#e8e8e8',size:11}};
var ptB={x:[t2],y:[5*t2*t2],mode:'markers+text',name:'(t_2, s(t_2))',marker:{color:'#22c55e',size:11},text:['t_2'],textposition:'top left',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'time t (s)',range:[-0.05,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'position s (m)',range:[-1,22],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-position-en',[curve,chord,tangent,ptA,ptB],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>A numerical experiment.</strong> Take $s(t) = 5t^2$ (a body that has been falling for $t$ seconds, in units where $g/2 = 5$). What is the instantaneous velocity at $t_1 = 1$ s?</p>

<div class="calc-example"><div class="example-label">SHRINKING THE INTERVAL</div><div class="example-body">Compute $\\dfrac{s(1 + h) - s(1)}{h}$ for shrinking $h$:<br><br>$h = 0.5$: $\\dfrac{5(1.5)^2 - 5}{0.5} = \\dfrac{11.25 - 5}{0.5} = \\dfrac{6.25}{0.5} = 12.5$ m/s.<br>$h = 0.1$: $\\dfrac{5(1.1)^2 - 5}{0.1} = \\dfrac{6.05 - 5}{0.1} = \\dfrac{1.05}{0.1} = 10.5$ m/s.<br>$h = 0.01$: $\\dfrac{5(1.01)^2 - 5}{0.01} = \\dfrac{5.1005 - 5}{0.01} = 10.05$ m/s.<br>$h = 0.001$: $\\dfrac{5(1.001)^2 - 5}{0.001} = 10.005$ m/s.<br><br>The averages are approaching <strong>10 m/s</strong>. That is the instantaneous velocity at $t = 1$.</div></div>

<div class="think-box"><div class="think-label">A QUICK MENTAL EXPERIMENT</div><div class="think-body">If you drove a car at 90 km/h average over a long trip, would your speedometer have read 90 the entire time? Almost certainly not. The speedometer measures the <em>instantaneous</em> speed; the trip computer measures the <em>average</em>. The first is a derivative, the second is a ratio of total quantities. The whole point of calculus is to bridge these two.</div></div>

<h2 class="lesson-title">2. From Secant Lines to Tangent Lines</h2>

<div class="calc-highlight"><strong>The geometric picture:</strong> on the graph of $y = f(x)$, pick the point $P = (x, f(x))$ and a nearby point $Q = (x+h, f(x+h))$. The straight line through $P$ and $Q$ is called the <em>secant</em>. Its slope is $\\dfrac{f(x+h) - f(x)}{h}$. As $h \\to 0$ the point $Q$ slides toward $P$, the secant rotates, and in the limit it becomes the <em>tangent line</em> at $P$.</div>

<p class="l-text">A <strong>secant line</strong> is any line that meets the curve at two points. A <strong>tangent line</strong> is a line that "just touches" the curve at a single point and matches the direction of the curve there. The miracle is that the slope of the tangent is the limit of the slopes of the secants — even though "two points sliding into one" sounds paradoxical.</p>

<div class="calc-formula"><div class="formula-label">SLOPE OF THE SECANT THROUGH $P$ AND $Q$</div><div class="formula-main">$$m_{\\text{sec}} = \\frac{f(x+h) - f(x)}{h}$$</div><div class="formula-sub">This is a difference quotient: a ratio of the vertical change to the horizontal change between the two points on the graph.</div></div>

<div class="calc-graph"><div id="plot-l17-secants-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parabola $y = x^2$ with the fixed point $P = (1, 1)$ in green. Three secant lines (orange, gold, yellow) join $P$ to nearby points with $h = 1$, $h = 0.5$, $h = 0.25$. Their slopes are $3$, $2.5$, $2.25$. The red line is the tangent at $P$ with slope $2$. As $h \\to 0$ the secants rotate into the tangent.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-50;i<=250;i++){var x=i/100;xs.push(x);ys.push(x*x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = x^2',line:{color:'#3b82f6',width:3}};
var hs=[1,0.5,0.25];var cols=['#f59e0b','#fbbf24','#fde047'];var traces=[curve];
var x0=1, y0=1;
for(var i=0;i<hs.length;i++){
  var h=hs[i];var x1=x0+h;var y1=x1*x1;var m=(y1-y0)/h;
  var tx0=x0-0.4;var tx1=x1+0.3;
  traces.push({x:[tx0,tx1],y:[y0+m*(tx0-x0),y0+m*(tx1-x0)],mode:'lines',name:'h='+h+', slope='+m,line:{color:cols[i],width:2,dash:'dot'}});
  traces.push({x:[x1],y:[y1],mode:'markers',name:'',marker:{color:cols[i],size:9},showlegend:false});
}
var slope=2;var ttx=[x0-0.7,x0+1.3];var tty=[y0+slope*(ttx[0]-x0),y0+slope*(ttx[1]-x0)];
traces.push({x:ttx,y:tty,mode:'lines',name:'tangent, slope=2',line:{color:'#ef4444',width:3}});
traces.push({x:[x0],y:[y0],mode:'markers+text',name:'P=(1,1)',marker:{color:'#22c55e',size:12},text:['P'],textposition:'bottom right',textfont:{color:'#22c55e',size:13}});
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-secants-en',traces,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l17-limit-process-en-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the limit process made visual. On the parabola $y = x^2$ the fixed point $P = (1, 1)$ is green. Four secant lines drawn from $P$ to $(1+h, (1+h)^2)$ for $h = 1, 0.5, 0.25, 0.1$ have slopes $3, 2.5, 2.25, 2.1$. Each new secant rotates closer to the dashed red <em>tangent</em> line of slope $2$. As $h \\to 0$ the slopes form the sequence $3 \\to 2.5 \\to 2.25 \\to 2.1 \\to \\cdots \\to 2$. That limit $2$ is the value of $f'(1)$ for $f(x) = x^2$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-30;i<=250;i++){var x=i/100;xs.push(x);ys.push(x*x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = x^2',line:{color:'#3b82f6',width:3}};
var hs=[1,0.5,0.25,0.1];var cols=['#f59e0b','#fb923c','#fbbf24','#fde047'];var traces=[curve];
var x0=1, y0=1;
for(var i=0;i<hs.length;i++){
  var h=hs[i];var x1=x0+h;var y1=x1*x1;var m=(y1-y0)/h;
  var tx0=x0-0.35;var tx1=x1+0.25;
  traces.push({x:[tx0,tx1],y:[y0+m*(tx0-x0),y0+m*(tx1-x0)],mode:'lines',name:'h='+h+', slope='+m.toFixed(2),line:{color:cols[i],width:2,dash:'dot'}});
  traces.push({x:[x1],y:[y1],mode:'markers',name:'',marker:{color:cols[i],size:9},showlegend:false});
}
var slope=2;var ttx=[x0-0.65,x0+1.4];var tty=[y0+slope*(ttx[0]-x0),y0+slope*(ttx[1]-x0)];
traces.push({x:ttx,y:tty,mode:'lines',name:'tangent (limit), slope=2',line:{color:'#ef4444',width:3,dash:'dash'}});
traces.push({x:[x0],y:[y0],mode:'markers+text',name:'P=(1,1)',marker:{color:'#22c55e',size:13},text:['P'],textposition:'bottom right',textfont:{color:'#22c55e',size:13}});
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-limit-process-en-extra',traces,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Reading the table.</strong> The derivative carries several names and several physical interpretations. The list below is your reference card: same number, different costume. Memorise it — every notation appears in textbooks, exam questions and scientific papers.</div>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(255,255,255,0.02);font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead><tr style="border-bottom:2px solid rgba(59,130,246,0.45);text-align:left;background:rgba(59,130,246,0.05)">
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Notation / Reading</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Meaning</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Concrete example</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$f'(x)$ &nbsp; <em>(Lagrange, "f prime")</em></td>
<td style="padding:0.55rem 0.9rem">Derivative function of $f$ — a new function of $x$.</td>
<td style="padding:0.55rem 0.9rem">$f(x) = x^2 \\Rightarrow f'(x) = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\dfrac{df}{dx}$ &nbsp; <em>(Leibniz)</em></td>
<td style="padding:0.55rem 0.9rem">"The change in $f$ per unit change in $x$." Best for change of variable.</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{d}{dx}(x^2) = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\dfrac{dy}{dx}$</td>
<td style="padding:0.55rem 0.9rem">Same as $df/dx$ when $y = f(x)$. Common in implicit-function problems.</td>
<td style="padding:0.55rem 0.9rem">$y = x^2 \\Rightarrow \\dfrac{dy}{dx} = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$y'$ &nbsp; <em>(prime on the dependent variable)</em></td>
<td style="padding:0.55rem 0.9rem">Shorthand for $dy/dx$. Used heavily in Turkish textbooks.</td>
<td style="padding:0.55rem 0.9rem">$y = x^2 \\Rightarrow y' = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\dfrac{d}{dx}[f(x)]$ &nbsp; <em>(operator form)</em></td>
<td style="padding:0.55rem 0.9rem">Treats $\\tfrac{d}{dx}$ as an operator that acts on whatever expression follows.</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{d}{dx}[x^2 + 3x] = 2x + 3$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\lim_{\\Delta x \\to 0} \\dfrac{\\Delta y}{\\Delta x}$</td>
<td style="padding:0.55rem 0.9rem">The defining limit. All other notations collapse to this expression.</td>
<td style="padding:0.55rem 0.9rem">$\\Delta y / \\Delta x \\to 2$ at $x = 1$ for $y = x^2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Slope</strong> reading</td>
<td style="padding:0.55rem 0.9rem">Geometric: $f'(x_0)$ is the slope of the tangent at $(x_0, f(x_0))$.</td>
<td style="padding:0.55rem 0.9rem">Tangent to $y = x^2$ at $x = 1$ has slope $2$.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Velocity</strong> reading</td>
<td style="padding:0.55rem 0.9rem">Physical: if $s(t)$ is position, $s'(t)$ is instantaneous velocity.</td>
<td style="padding:0.55rem 0.9rem">$s(t) = 5t^2 \\Rightarrow v(1) = s'(1) = 10$ m/s</td>
</tr>
<tr>
<td style="padding:0.55rem 0.9rem"><strong>Rate-of-change</strong> reading</td>
<td style="padding:0.55rem 0.9rem">General: $f'(x)$ tells you how fast $f$ changes per unit change in $x$.</td>
<td style="padding:0.55rem 0.9rem">$V(t) = 4t^3 \\Rightarrow V'(2) = 48$ cm$^3$/s</td>
</tr>
</tbody>
</table>

<p class="l-text"><strong>Why does the limit exist?</strong> Because the curve, near $P$, looks more and more like a straight line when you zoom in. If you zoom enough on a smooth curve, the curve becomes indistinguishable from its tangent. That is the geometric content of "the derivative exists": the curve has a well-defined direction at $P$.</p>

<div class="l-note"><strong>Smooth versus sharp.</strong> Not every curve has a tangent everywhere. A corner — like the graph of $|x|$ at $x = 0$ — has two different one-sided slopes and no single tangent direction. We will study these "non-differentiable points" in detail in the next lesson. For this lesson all our examples are smooth.</div>

<h2 class="lesson-title">3. The Definition of the Derivative</h2>

<div class="calc-highlight"><strong>Definition.</strong> Let $f$ be a function defined on an open interval containing $x$. The <em>derivative</em> of $f$ at the point $x$, denoted $f'(x)$, is the limit of the difference quotient as $h \\to 0$:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h},$$
provided this limit exists. When it does, we say $f$ is <em>differentiable</em> at $x$.</div>

<p class="l-text">Let us unpack each ingredient slowly.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f(x+h) - f(x)$</div><div class="card-body">The change in the output. As $h \\to 0$ this becomes the difference of two arbitrarily close output values, hence approaches 0.</div></div>
<div class="calc-card"><div class="card-title">$h$ in the denominator</div><div class="card-body">The change in the input. Also approaches 0. So the expression is a 0/0 indeterminate form — exactly the kind of limit you learned to handle in lessons 13 and 14.</div></div>
<div class="calc-card"><div class="card-title">The limit</div><div class="card-body">The number the ratio approaches. If the limit is a finite number $L$, we write $f'(x) = L$. If the limit fails to exist (one-sided values differ, or the ratio blows up), then $f$ is not differentiable at $x$.</div></div>
<div class="calc-card"><div class="card-title">Independence from sign of $h$</div><div class="card-body">$h$ must be allowed to approach 0 from <em>both</em> sides. The left and right limits of the difference quotient must agree. Otherwise we have a corner, not a smooth point.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">DERIVATIVE — STANDARD FORM</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$</div><div class="formula-sub">Read: "$f$ prime of $x$ equals the limit, as $h$ approaches $0$, of the quantity $f$ of $x+h$ minus $f$ of $x$, all over $h$."</div></div>

<p class="l-text"><strong>Notation.</strong> Several symbols mean exactly the same thing. Mathematicians, physicists and engineers all have their favourites:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">LAGRANGE</div><div class="compare-item">$f'(x)$, $f''(x)$, $f^{(n)}(x)$</div><div class="compare-item">The "prime" notation. Compact for general analysis.</div></div><div class="compare-col"><div class="compare-title">LEIBNIZ</div><div class="compare-item">$\\dfrac{df}{dx}$, $\\dfrac{d^2 f}{dx^2}$</div><div class="compare-item">Suggests the ratio of "infinitesimals." Best for change-of-variable.</div></div><div class="compare-col"><div class="compare-title">NEWTON / DOT</div><div class="compare-item">$\\dot x$, $\\ddot x$</div><div class="compare-item">Reserved for derivatives with respect to time in physics.</div></div></div>

<div class="l-note"><strong>Why "prime"?</strong> Joseph-Louis Lagrange introduced the apostrophe-like prime mark in his 1797 treatise <em>Theorie des fonctions analytiques</em>. The aim was to remove any reference to "infinitely small" quantities and treat the derivative as a pure function of $x$. That convention is the one Turkish high-school textbooks follow.</div>

<h2 class="lesson-title">4. The Equivalent $x \\to a$ Form</h2>

<div class="calc-highlight"><strong>A second formula that gives exactly the same number:</strong> the derivative at a specific point $x = a$ can also be written as
$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}.$$
Here $x$ approaches $a$ from any side; we no longer use the helper variable $h$. The two formulas are connected by the substitution $h = x - a$.</div>

<p class="l-text"><strong>Why two forms?</strong> The $h$-form is convenient when you want to compute $f'(x)$ as a function of $x$ — for instance, "find $f'(x)$ for all $x$." The $x \\to a$ form is convenient when you only need the derivative at one specific point $a$ — for instance, "find $f'(3)$." Either is correct; choose whichever makes the algebra cleaner.</p>

<div class="calc-formula"><div class="formula-label">DERIVATIVE AT $x = a$ — POINT FORM</div><div class="formula-main">$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$</div><div class="formula-sub">Substitute $h = x - a$. When $x \\to a$, $h \\to 0$, and the two formulas coincide.</div></div>

<div class="calc-example"><div class="example-label">CHECKING EQUIVALENCE</div><div class="example-body">Both forms applied to $f(x) = x^2$ at $a = 3$:<br><br><strong>$h$-form:</strong> $f'(3) = \\lim_{h \\to 0} \\dfrac{(3+h)^2 - 9}{h} = \\lim_{h \\to 0} \\dfrac{9 + 6h + h^2 - 9}{h} = \\lim_{h \\to 0} (6 + h) = 6$.<br><br><strong>$x \\to a$ form:</strong> $f'(3) = \\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\dfrac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x + 3) = 6$.<br><br>Same answer, slightly different algebra.</div></div>

<h2 class="lesson-title">5. Worked Example 1 — Derivative of $f(x) = x^2$</h2>

<div class="calc-highlight"><strong>Goal:</strong> compute $f'(x)$ for $f(x) = x^2$ at a general point $x$, using only the limit definition. This is the most important warm-up in differential calculus — every textbook starts here.</div>

<p class="l-text"><strong>Set up the difference quotient.</strong> Substitute $f(x+h) = (x+h)^2$ and $f(x) = x^2$ into the definition:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}.$$</div></div>

<p class="l-text"><strong>Expand the numerator.</strong> Use the binomial identity $(x+h)^2 = x^2 + 2xh + h^2$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x+h)^2 - x^2}{h} = \\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h}.$$</div></div>

<p class="l-text"><strong>Factor and cancel.</strong> The numerator has $h$ as a common factor:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{2xh + h^2}{h} = \\frac{h(2x + h)}{h} = 2x + h \\quad (h \\neq 0).$$</div></div>

<p class="l-text"><strong>Take the limit.</strong> Now $h$ can safely approach 0:</p>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} (2x + h) = 2x.$$</div><div class="formula-sub">The derivative of $x^2$ is $2x$. Examples: $f'(0) = 0$, $f'(1) = 2$, $f'(2) = 4$, $f'(-3) = -6$.</div></div>

<div class="calc-graph"><div id="plot-l17-x2tangent-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parabola $y = x^2$ in blue and the tangent line at $x = 2$ in red. The slope of the tangent is $f'(2) = 4$, so the tangent passes through $(2, 4)$ with slope $4$. Its equation is $y = 4(x - 2) + 4 = 4x - 4$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);ys.push(x*x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = x^2',line:{color:'#3b82f6',width:3}};
var x0=2;var y0=4;var m=4;
var tx=[x0-2.2,x0+1.2];var ty=[y0+m*(tx[0]-x0),y0+m*(tx[1]-x0)];
var tangent={x:tx,y:ty,mode:'lines',name:"tangent at x=2, slope=4",line:{color:'#ef4444',width:3}};
var pt={x:[x0],y:[y0],mode:'markers+text',name:'(2, 4)',marker:{color:'#22c55e',size:12},text:['(2, 4)'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2.5,9.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-x2tangent-en',[curve,tangent,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Worked Example 2 — Derivative of $f(x) = 1/x$</h2>

<div class="calc-highlight"><strong>Goal:</strong> compute $f'(x)$ for $f(x) = 1/x$ at any point $x \\neq 0$, using only the limit definition. This example shows the typical algebra needed when fractions appear: combine into a single fraction, then cancel.</div>

<p class="l-text"><strong>Set up:</strong></p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{\\tfrac{1}{x+h} - \\tfrac{1}{x}}{h}.$$</div></div>

<p class="l-text"><strong>Combine the fractions</strong> in the numerator over the common denominator $x(x+h)$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{1}{x+h} - \\frac{1}{x} = \\frac{x - (x+h)}{x(x+h)} = \\frac{-h}{x(x+h)}.$$</div></div>

<p class="l-text"><strong>Divide by $h$.</strong> Dividing by $h$ is the same as multiplying by $1/h$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{-h}{x(x+h)} \\cdot \\frac{1}{h} = \\frac{-1}{x(x+h)} \\quad (h \\neq 0).$$</div></div>

<p class="l-text"><strong>Take the limit.</strong> As $h \\to 0$ the factor $(x+h) \\to x$:</p>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{-1}{x(x+h)} = \\frac{-1}{x \\cdot x} = -\\frac{1}{x^2}.$$</div><div class="formula-sub">The derivative of $1/x$ is $-1/x^2$. Examples: $f'(1) = -1$, $f'(2) = -1/4$, $f'(-1) = -1$. Note: $f$ is not defined at $x = 0$, so the formula has no meaning there.</div></div>

<div class="l-note"><strong>Sign check.</strong> The function $1/x$ is decreasing on $(0, \\infty)$, so the slope should be negative there. And indeed $-1/x^2 < 0$ for every $x \\neq 0$. The function is also decreasing on $(-\\infty, 0)$, and again $-1/x^2 < 0$. Consistent.</div>

<h2 class="lesson-title">7. Worked Example 3 — Derivative of $f(x) = \\sqrt{x}$</h2>

<div class="calc-highlight"><strong>Goal:</strong> compute $f'(x)$ for $f(x) = \\sqrt{x}$ at any point $x > 0$. The trick is the same one you used for rationalising limits: multiply numerator and denominator by the <em>conjugate</em> of the numerator.</div>

<p class="l-text"><strong>Set up:</strong></p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{\\sqrt{x+h} - \\sqrt{x}}{h}.$$</div></div>

<p class="l-text"><strong>Multiply top and bottom by the conjugate</strong> $\\sqrt{x+h} + \\sqrt{x}$:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sqrt{x+h} - \\sqrt{x}}{h} \\cdot \\frac{\\sqrt{x+h} + \\sqrt{x}}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{(x+h) - x}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\frac{h}{h\\,(\\sqrt{x+h} + \\sqrt{x})}.$$</div></div>

<p class="l-text"><strong>Cancel $h$</strong> (legal because $h \\neq 0$ during the limit):</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{h}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\frac{1}{\\sqrt{x+h} + \\sqrt{x}}.$$</div></div>

<p class="l-text"><strong>Take the limit.</strong> As $h \\to 0$ the square root $\\sqrt{x+h} \\to \\sqrt{x}$:</p>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{1}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{1}{2\\sqrt{x}}.$$</div><div class="formula-sub">The derivative of $\\sqrt{x}$ is $1/(2\\sqrt{x})$. Defined for $x > 0$ only.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">What happens at $x = 0$? The denominator $2\\sqrt{x}$ vanishes, and $f'(0)$ does not exist in the usual sense — the tangent line at $(0,0)$ is vertical (slope $+\\infty$). Vertical tangents are a kind of non-differentiability we will discuss in the next lesson.</div></div>

<h2 class="lesson-title">8. Geometric Meaning — Slope of the Tangent</h2>

<div class="calc-highlight"><strong>The geometric statement.</strong> The number $f'(x_0)$ is the <em>slope</em> of the tangent line to the graph $y = f(x)$ at the point $(x_0, f(x_0))$. Knowing the slope and a point on the line, you can write the equation of the tangent in point-slope form:
$$y - f(x_0) = f'(x_0) \\cdot (x - x_0).$$</div>

<p class="l-text">This formula appears constantly in 12th-grade Turkish high school and on AYT. Whenever a problem says "find the tangent to the curve at the given point," you do three things: (1) compute $f(x_0)$ to get the $y$-coordinate of the contact point; (2) compute $f'(x_0)$ to get the slope; (3) plug everything into the point-slope formula.</p>

<div class="calc-formula"><div class="formula-label">TANGENT LINE AT $(x_0, f(x_0))$</div><div class="formula-main">$$y = f(x_0) + f'(x_0) \\cdot (x - x_0)$$</div><div class="formula-sub">Geometry: line passing through $(x_0, f(x_0))$ with slope $f'(x_0)$.</div></div>

<div class="calc-example"><div class="example-label">TANGENT TO $y = x^2$ AT $x = 3$</div><div class="example-body">Contact point: $f(3) = 9$, so $(x_0, y_0) = (3, 9)$.<br>Slope: $f'(3) = 2 \\cdot 3 = 6$.<br>Tangent equation: $y - 9 = 6(x - 3) \\;\\Rightarrow\\; y = 6x - 9$.<br><br>Sanity check: at $x = 3$ the line gives $y = 18 - 9 = 9$ — agrees with the contact point. The line is steeper than at $x = 2$, where the slope was 4 — agrees with the visual fact that the parabola gets steeper as $|x|$ grows.</div></div>

<div class="calc-example"><div class="example-label">TANGENT TO $y = 1/x$ AT $x = 2$</div><div class="example-body">Contact point: $f(2) = 1/2$, so $(2, 0.5)$.<br>Slope: $f'(2) = -1/4$.<br>Tangent: $y - 0.5 = -\\dfrac{1}{4}(x - 2) \\;\\Rightarrow\\; y = -\\dfrac{x}{4} + 1$.<br><br>Slope is negative, matching the decreasing curve.</div></div>

<div class="l-note"><strong>Normal line.</strong> The <em>normal</em> to the curve at $(x_0, y_0)$ is the line through that point <em>perpendicular</em> to the tangent. Its slope is $-1/f'(x_0)$ (negative reciprocal). At $x = 3$ on $y = x^2$, the tangent slope is $6$, so the normal slope is $-1/6$, and the normal equation is $y - 9 = -\\tfrac{1}{6}(x - 3)$.</div>

<h2 class="lesson-title">9. Physical Meaning — Velocity, Acceleration, Rate of Change</h2>

<div class="calc-highlight"><strong>Physical reading.</strong> If $s(t)$ is the position of a particle at time $t$, then $s'(t)$ is its <em>instantaneous velocity</em>. If $v(t) = s'(t)$ is the velocity, then $v'(t) = s''(t)$ is the <em>instantaneous acceleration</em>. The derivative converts a quantity-versus-time graph into a rate-of-change-versus-time graph, and this is the language all of mechanics uses.</div>

<p class="l-text">The same principle works for any pair of quantities, not just position and time. If $V(t)$ is the volume of water in a tank as a function of time, then $V'(t)$ is the rate at which water flows in or out. If $C(q)$ is the total cost of producing $q$ items, then $C'(q)$ is the <em>marginal cost</em> — the cost of producing one additional item. Wherever one quantity depends on another, the derivative measures the local rate of dependence.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POSITION → VELOCITY</div><div class="compare-item">$s(t)$ in metres, $t$ in seconds</div><div class="compare-item">$v(t) = s'(t)$ in m/s</div><div class="compare-item">Sign: $v > 0$ moving forward, $v < 0$ moving back</div></div><div class="compare-col"><div class="compare-title">VELOCITY → ACCELERATION</div><div class="compare-item">$v(t)$ in m/s, $t$ in seconds</div><div class="compare-item">$a(t) = v'(t) = s''(t)$ in m/s$^2$</div><div class="compare-item">Sign: $a > 0$ speeding up if $v > 0$, slowing down if $v < 0$</div></div></div>

<div class="calc-example"><div class="example-label">FREELY FALLING BODY</div><div class="example-body">A ball is dropped from rest. Its position from the start (in metres downward) at time $t$ seconds is $s(t) = 5 t^2$.<br><br>Velocity: $v(t) = s'(t) = 10 t$ m/s.<br>At $t = 0$: $v = 0$ (it starts from rest).<br>At $t = 1$: $v = 10$ m/s.<br>At $t = 2$: $v = 20$ m/s.<br><br>Acceleration: $a(t) = v'(t) = 10$ m/s$^2$ — constant. (This is the standard textbook value $g \\approx 10$ m/s$^2$ for gravity.) The ball speeds up linearly with time, exactly as Galileo discovered.</div></div>

<div class="calc-example"><div class="example-label">RATE LANGUAGE EVERYWHERE</div><div class="example-body">A spherical balloon is being inflated. Its volume at time $t$ seconds is $V(t)$ cubic centimetres. Then $V'(t)$ is the rate at which gas enters the balloon, measured in cm$^3$/s.<br><br>If $V(t) = 4 t^3$, then $V'(t) = 12 t^2$. At $t = 2$, gas enters at rate $48$ cm$^3$/s. At $t = 3$, the rate is $108$ cm$^3$/s — the inflation accelerates as the balloon gets bigger.</div></div>

<div class="think-box"><div class="think-label">DERIVATIVE AS A UNIT-CONVERTER</div><div class="think-body">Notice how the derivative changes the units: if $s$ is in metres and $t$ is in seconds, then $ds/dt$ is in metres per second. The Leibniz notation $\\dfrac{ds}{dt}$ wears this on its sleeve. The derivative is always the rate of change of the numerator quantity per unit of the denominator quantity.</div></div>

<h2 class="lesson-title">10. Classical Exercises</h2>

<div class="calc-highlight"><strong>Work each problem entirely from the limit definition</strong> — do not use any shortcut rule (we will introduce those next lesson). Show the difference quotient, simplify with the appropriate algebraic trick (expand, factor, conjugate, common denominator), then take the limit.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 — LINEAR FUNCTION</div><div class="example-body">Find $f'(x)$ for $f(x) = 5x - 7$ from the definition.<br><br><em>Solution.</em> $f(x+h) = 5(x+h) - 7 = 5x + 5h - 7$. So $f(x+h) - f(x) = 5h$. Divide by $h$: $\\tfrac{5h}{h} = 5$. Take the limit: $\\lim_{h \\to 0} 5 = 5$.<br>$\\boxed{f'(x) = 5}$. The derivative of any linear function $ax + b$ is the slope $a$ — geometrically obvious. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — QUADRATIC</div><div class="example-body">Find $f'(x)$ for $f(x) = 3x^2 + 2x - 1$.<br><br><em>Solution.</em> $f(x+h) = 3(x+h)^2 + 2(x+h) - 1 = 3x^2 + 6xh + 3h^2 + 2x + 2h - 1$. Subtract $f(x)$: $f(x+h) - f(x) = 6xh + 3h^2 + 2h$. Divide by $h$: $6x + 3h + 2$. Take the limit: $6x + 2$.<br>$\\boxed{f'(x) = 6x + 2}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — CUBIC</div><div class="example-body">Find $f'(x)$ for $f(x) = x^3$.<br><br><em>Solution.</em> $(x+h)^3 = x^3 + 3x^2 h + 3x h^2 + h^3$. So $f(x+h) - f(x) = 3x^2 h + 3x h^2 + h^3$. Divide by $h$: $3x^2 + 3xh + h^2$. Take the limit: $3x^2$.<br>$\\boxed{f'(x) = 3x^2}$. (Compare with $f'(x) = 2x$ for $x^2$ — a pattern is emerging.) $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — RECIPROCAL OF $x^2$</div><div class="example-body">Find $f'(x)$ for $f(x) = 1/x^2$ at any $x \\neq 0$.<br><br><em>Solution.</em> $\\dfrac{1}{(x+h)^2} - \\dfrac{1}{x^2} = \\dfrac{x^2 - (x+h)^2}{x^2(x+h)^2} = \\dfrac{-2xh - h^2}{x^2(x+h)^2}$. Divide by $h$: $\\dfrac{-2x - h}{x^2(x+h)^2}$. Take the limit ($h \\to 0$): $\\dfrac{-2x}{x^2 \\cdot x^2} = \\dfrac{-2}{x^3}$.<br>$\\boxed{f'(x) = -\\dfrac{2}{x^3}}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — TANGENT LINE TO $y = \\sqrt{x}$ AT $x = 4$</div><div class="example-body">From Section 7 we know $f'(x) = 1/(2\\sqrt{x})$. So $f'(4) = 1/(2 \\cdot 2) = 1/4$. Contact point $(4, 2)$.<br>Tangent line: $y - 2 = \\tfrac{1}{4}(x - 4) \\;\\Rightarrow\\; y = \\tfrac{x}{4} + 1$.<br>Check: at $x = 4$ the line gives $y = 1 + 1 = 2$ — correct. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — INSTANTANEOUS VELOCITY</div><div class="example-body">A particle moves along a line with position $s(t) = t^2 - 4t + 5$ (metres, with $t$ in seconds). Find the instantaneous velocity at $t = 3$ from the definition.<br><br><em>Solution.</em> $s(3+h) = (3+h)^2 - 4(3+h) + 5 = 9 + 6h + h^2 - 12 - 4h + 5 = 2 + 2h + h^2$. $s(3) = 9 - 12 + 5 = 2$. So $s(3+h) - s(3) = 2h + h^2$. Divide by $h$: $2 + h$. Take the limit: $2$.<br>$\\boxed{v(3) = s'(3) = 2 \\text{ m/s}}$.<br><br>Bonus: at what time $t$ is the particle momentarily at rest? From the general formula $s'(t) = 2t - 4$ (compute as in Problem 2), set $2t - 4 = 0$ to get $t = 2$ s. $\\blacksquare$</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Derivative definition:</strong> $f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$, also written $f'(a) = \\lim_{x \\to a} \\dfrac{f(x) - f(a)}{x - a}$.</li>
<li>Geometrically: $f'(x_0)$ is the <strong>slope of the tangent line</strong> at $(x_0, f(x_0))$.</li>
<li>Physically: if $s(t)$ is position, $s'(t)$ is <strong>instantaneous velocity</strong>; $s''(t)$ is <strong>acceleration</strong>.</li>
<li>Three core derivatives from the definition: $(x^2)' = 2x$, $(1/x)' = -1/x^2$, $(\\sqrt{x})' = 1/(2\\sqrt{x})$.</li>
<li>Algebraic tricks: <em>expand</em> binomials for polynomials, <em>common denominator</em> for fractions, <em>conjugate</em> for square roots.</li>
<li>Tangent equation at $(x_0, f(x_0))$: $y = f(x_0) + f'(x_0)(x - x_0)$.</li>
<li>Next lesson: <strong>differentiation rules</strong> (sum, product, quotient, chain) — shortcuts that bypass the limit definition.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Türev, limitten sonra matematiğin en güçlü tek fikridir.</strong> Bir niceliğin <em>belirli bir an</em>da — bir aralık üzerinde değil, tek bir noktada — ne kadar hızlı değiştiğini hesaplayabildiğin anda, diferansiyel hesabın tümünü, klasik mekaniği, optimizasyonu, geometrik teğet problemlerini ve tüm nicel bilimlerin kullandığı hız dilini açmış olursun. Bu ders, 13-16. derslerde ustalaştığın limit tanımından türevi inşa ediyor. Yavaş ilerliyoruz. Her adım gerekçelendiriliyor, her formül türetiliyor, her çözümlü örnek baştan sona hesaplanıyor.</p>

<p class="l-text">Türk lisesinde türev 12. sınıfın başında karşına çıkar. MEB müfredatı, $f'(x)$'in limit tanımını ifade edebilmeni, $x^2$, $1/x$ ve $\\sqrt{x}$'in türevini bu tanımdan elde edebilmeni ve $f'(x_0)$'ı $x = x_0$ noktasındaki teğet doğrunun eğimi olarak okuyabilmeni şart koşar. Bu derste işlenen her şey AYT'de sorulabilir (ve lisansüstüne yönelenler için yine KPSS'de). Bir sonraki ders türev <em>kurallarına</em> geçecek; burada yalnızca tanımdan çalışarak temeli atıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ortalama değişim oranını $\\Delta f / \\Delta x$ kesen (sekant) doğrunun eğimi, anlık oranı ise bu eğimin limiti olarak okumayı</li>
<li>Limit tanımı $f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$ ifadesini tam olarak söylemeyi ve hem pay hem paydanın neden birlikte 0'a gitmek zorunda olduğunu açıklamayı</li>
<li>Türevin iki eşdeğer formu $\\lim_{h \\to 0}$ ile $\\lim_{x \\to a}$ arasında akıcı geçiş yapmayı</li>
<li>$f(x) = x^2$, $f(x) = 1/x$ ve $f(x) = \\sqrt{x}$ fonksiyonlarının türevini doğrudan limit tanımından hesaplamayı</li>
<li>$f'(x_0)$'ı geometrik olarak $(x_0, f(x_0))$ noktasındaki teğet doğrunun eğimi şeklinde yorumlamayı</li>
<li>$f'(t_0)$'ı fiziksel olarak anlık hız, hızın türevini ise anlık ivme olarak yorumlamayı</li>
<li>Bir eğriye verilen noktada teğet doğrunun denklemini yazmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Anlık Hız Problemi</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir otomobil Ankara'dan İstanbul'a gidiyor. Yolculuk 5 saatte 450 km yapıyor, dolayısıyla <em>ortalama</em> hız 90 km/saat. Ama hız göstergesi hiç sabit durmuyor — otoyolda 120'nin üstüne çıkıyor, gişede 0'a iniyor, şehir içinde 60 civarında dolaşıyor. Hız göstergesinin herhangi bir andaki değeri <em>anlık</em> hızdır. Türev, zamana göre konum kaydını her andaki hız kaydına dönüştüren matematiksel araçtır.</div>

<p class="l-text">Bir cismin doğru bir çizgi boyunca hareket ettiğini ve $t$ zamanındaki konumunu $s(t)$ ile bildiğimizi varsayalım. $t_1$ ile $t_2$ zamanları arasındaki ortalama hız, konumdaki değişimin zamandaki değişime bölümüdür:</p>

<div class="calc-formula"><div class="formula-label">ORTALAMA HIZ</div><div class="formula-main">$$v_{\\text{ort}} = \\frac{s(t_2) - s(t_1)}{t_2 - t_1} = \\frac{\\Delta s}{\\Delta t}$$</div><div class="formula-sub">Yunan harfi $\\Delta$ (delta), "...'deki değişim" olarak okunur. "Son değer eksi ilk değer" demektir.</div></div>

<p class="l-text"><strong>Bilmece.</strong> Hız göstergesi "şu anki hız" derken neyi kastediyor? Aralığı küçültürsek $\\Delta t$ giderek küçülür ve ortalama hız $t_1$ başlangıç anındaki gerçek hıza giderek daha iyi bir yaklaşım olur. $\\Delta t \\to 0$ limitinde pay da payda da sıfıra gider — 0/0 ifadesi — ama oran belirli bir sayıya yaklaşır. O sayı <em>anlık</em> hızdır.</p>

<div class="calc-graph"><div id="plot-l17-position-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> sabit ivmeyle hareket eden bir cisim için $s(t) = 5t^2$ konum-zaman grafiği. Turuncu kiriş $(t_1, s(t_1))$ ile $(t_2, s(t_2))$'yi birleştirir; eğimi $[t_1, t_2]$ aralığındaki <em>ortalama</em> hızdır. Kırmızı doğru $(t_1, s(t_1))$ noktasındaki teğettir; eğimi $t = t_1$ anındaki <em>anlık</em> hızdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=i/100;xs.push(t);ys.push(5*t*t);}
var curve={x:xs,y:ys,mode:'lines',name:'s(t) = 5 t^2',line:{color:'#3b82f6',width:3}};
var t1=0.6, t2=1.6;
var chord={x:[t1,t2],y:[5*t1*t1,5*t2*t2],mode:'lines+markers',name:'kesen: ortalama hız',line:{color:'#f59e0b',width:2.5,dash:'dash'},marker:{color:'#f59e0b',size:8}};
var slope=10*t1;
var tx=[t1-0.4,t1+0.6];var ty=[5*t1*t1+slope*(tx[0]-t1),5*t1*t1+slope*(tx[1]-t1)];
var tangent={x:tx,y:ty,mode:'lines',name:'teğet: anlık hız',line:{color:'#ef4444',width:2.5}};
var ptA={x:[t1],y:[5*t1*t1],mode:'markers+text',name:'(t_1, s(t_1))',marker:{color:'#22c55e',size:11},text:['t_1'],textposition:'top left',textfont:{color:'#e8e8e8',size:11}};
var ptB={x:[t2],y:[5*t2*t2],mode:'markers+text',name:'(t_2, s(t_2))',marker:{color:'#22c55e',size:11},text:['t_2'],textposition:'top left',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'zaman t (s)',range:[-0.05,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'konum s (m)',range:[-1,22],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-position-tr',[curve,chord,tangent,ptA,ptB],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Sayısal bir deney.</strong> $s(t) = 5t^2$ alalım ($t$ saniyedir düşen bir cisim, $g/2 = 5$ olan birimlerde). $t_1 = 1$ s anındaki anlık hız nedir?</p>

<div class="calc-example"><div class="example-label">ARALIĞI DARALTMAK</div><div class="example-body">Daralan $h$ değerleri için $\\dfrac{s(1 + h) - s(1)}{h}$ hesapla:<br><br>$h = 0.5$: $\\dfrac{5(1.5)^2 - 5}{0.5} = \\dfrac{11.25 - 5}{0.5} = \\dfrac{6.25}{0.5} = 12.5$ m/s.<br>$h = 0.1$: $\\dfrac{5(1.1)^2 - 5}{0.1} = \\dfrac{6.05 - 5}{0.1} = \\dfrac{1.05}{0.1} = 10.5$ m/s.<br>$h = 0.01$: $\\dfrac{5(1.01)^2 - 5}{0.01} = \\dfrac{5.1005 - 5}{0.01} = 10.05$ m/s.<br>$h = 0.001$: $\\dfrac{5(1.001)^2 - 5}{0.001} = 10.005$ m/s.<br><br>Ortalamalar <strong>10 m/s</strong>'ye yaklaşıyor. Bu, $t = 1$ anındaki anlık hızdır.</div></div>

<div class="think-box"><div class="think-label">KISA BİR ZİHİNSEL DENEY</div><div class="think-body">Uzun bir yolculukta ortalama 90 km/saat hızla otomobil sürersen, hız göstergen tüm yolculuk boyunca 90'ı mı gösterirdi? Neredeyse kesinlikle hayır. Hız göstergesi <em>anlık</em> hızı ölçer; yolculuk hesaplayıcısı <em>ortalamayı</em> ölçer. Birincisi türev, ikincisi toplam niceliklerin oranıdır. Hesabın tüm amacı bu ikisini birbirine bağlamaktır.</div></div>

<h2 class="lesson-title">2. Kesen Doğrulardan Teğet Doğruya</h2>

<div class="calc-highlight"><strong>Geometrik resim:</strong> $y = f(x)$ grafiğinde $P = (x, f(x))$ noktasını ve yakın bir $Q = (x+h, f(x+h))$ noktasını seç. $P$ ile $Q$'dan geçen doğru <em>kesen</em> (sekant) doğru olarak adlandırılır. Eğimi $\\dfrac{f(x+h) - f(x)}{h}$'dir. $h \\to 0$ iken $Q$ noktası $P$'ye doğru kayar, kesen doğru döner ve limitte $P$ noktasındaki <em>teğet doğru</em> olur.</div>

<p class="l-text"><strong>Kesen doğru</strong>, eğriyle iki noktada buluşan herhangi bir doğrudur. <strong>Teğet doğru</strong>, eğriye tek bir noktada "değen" ve o noktadaki eğrinin yönüne uyan doğrudur. Mucize şudur: teğetin eğimi, kesenlerin eğimlerinin limitidir — "iki noktanın bir noktaya kayması" paradoksal görünse de.</p>

<div class="calc-formula"><div class="formula-label">$P$ İLE $Q$'DAN GEÇEN KESENİN EĞİMİ</div><div class="formula-main">$$m_{\\text{kes}} = \\frac{f(x+h) - f(x)}{h}$$</div><div class="formula-sub">Bu bir fark bölümüdür: grafikteki iki nokta arasında dikey değişimin yatay değişime oranıdır.</div></div>

<div class="calc-graph"><div id="plot-l17-secants-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x^2$ parabolü ve yeşildeki sabit $P = (1, 1)$ noktası. Üç kesen doğru (turuncu, altın sarısı, sarı) $P$'yi $h = 1$, $h = 0.5$, $h = 0.25$ olan yakın noktalara bağlıyor. Eğimleri sırasıyla $3$, $2.5$, $2.25$. Kırmızı doğru, $P$'deki teğet ve eğimi $2$. $h \\to 0$ iken kesenler teğete doğru döner.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-50;i<=250;i++){var x=i/100;xs.push(x);ys.push(x*x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = x^2',line:{color:'#3b82f6',width:3}};
var hs=[1,0.5,0.25];var cols=['#f59e0b','#fbbf24','#fde047'];var traces=[curve];
var x0=1, y0=1;
for(var i=0;i<hs.length;i++){
  var h=hs[i];var x1=x0+h;var y1=x1*x1;var m=(y1-y0)/h;
  var tx0=x0-0.4;var tx1=x1+0.3;
  traces.push({x:[tx0,tx1],y:[y0+m*(tx0-x0),y0+m*(tx1-x0)],mode:'lines',name:'h='+h+', eğim='+m,line:{color:cols[i],width:2,dash:'dot'}});
  traces.push({x:[x1],y:[y1],mode:'markers',name:'',marker:{color:cols[i],size:9},showlegend:false});
}
var slope=2;var ttx=[x0-0.7,x0+1.3];var tty=[y0+slope*(ttx[0]-x0),y0+slope*(ttx[1]-x0)];
traces.push({x:ttx,y:tty,mode:'lines',name:'teğet, eğim=2',line:{color:'#ef4444',width:3}});
traces.push({x:[x0],y:[y0],mode:'markers+text',name:'P=(1,1)',marker:{color:'#22c55e',size:12},text:['P'],textposition:'bottom right',textfont:{color:'#22c55e',size:13}});
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-secants-tr',traces,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l17-limit-process-tr-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> limit süreci görselleştirilmiş hâli. $y = x^2$ parabolünde sabit $P = (1, 1)$ noktası yeşil. $P$'den $(1+h, (1+h)^2)$'ye çizilen dört kesen doğrunun (her biri $h = 1, 0.5, 0.25, 0.1$ için) eğimleri sırasıyla $3, 2.5, 2.25, 2.1$'dir. Her yeni kesen, eğimi $2$ olan kesik kırmızı <em>teğet</em> doğruya biraz daha yakın döner. $h \\to 0$ iken eğimler $3 \\to 2.5 \\to 2.25 \\to 2.1 \\to \\cdots \\to 2$ dizisini oluşturur. Bu $2$ limiti, $f(x) = x^2$ için $f'(1)$ değeridir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-30;i<=250;i++){var x=i/100;xs.push(x);ys.push(x*x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = x^2',line:{color:'#3b82f6',width:3}};
var hs=[1,0.5,0.25,0.1];var cols=['#f59e0b','#fb923c','#fbbf24','#fde047'];var traces=[curve];
var x0=1, y0=1;
for(var i=0;i<hs.length;i++){
  var h=hs[i];var x1=x0+h;var y1=x1*x1;var m=(y1-y0)/h;
  var tx0=x0-0.35;var tx1=x1+0.25;
  traces.push({x:[tx0,tx1],y:[y0+m*(tx0-x0),y0+m*(tx1-x0)],mode:'lines',name:'h='+h+', eğim='+m.toFixed(2),line:{color:cols[i],width:2,dash:'dot'}});
  traces.push({x:[x1],y:[y1],mode:'markers',name:'',marker:{color:cols[i],size:9},showlegend:false});
}
var slope=2;var ttx=[x0-0.65,x0+1.4];var tty=[y0+slope*(ttx[0]-x0),y0+slope*(ttx[1]-x0)];
traces.push({x:ttx,y:tty,mode:'lines',name:'teğet (limit), eğim=2',line:{color:'#ef4444',width:3,dash:'dash'}});
traces.push({x:[x0],y:[y0],mode:'markers+text',name:'P=(1,1)',marker:{color:'#22c55e',size:13},text:['P'],textposition:'bottom right',textfont:{color:'#22c55e',size:13}});
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-limit-process-tr-extra',traces,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Tabloyu oku.</strong> Türev birden çok isim ve birden çok fiziksel yorum taşır. Aşağıdaki liste başvuru kartındır: aynı sayı, farklı kostüm. Ezberle — her notasyon ders kitaplarında, sınav sorularında ve bilimsel makalelerde karşına çıkar.</div>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(255,255,255,0.02);font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead><tr style="border-bottom:2px solid rgba(59,130,246,0.45);text-align:left;background:rgba(59,130,246,0.05)">
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Notasyon / Okunuş</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Anlam</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Somut örnek</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$f'(x)$ &nbsp; <em>(Lagrange, "f üs")</em></td>
<td style="padding:0.55rem 0.9rem">$f$'nin türev fonksiyonu — $x$'in yeni bir fonksiyonu.</td>
<td style="padding:0.55rem 0.9rem">$f(x) = x^2 \\Rightarrow f'(x) = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\dfrac{df}{dx}$ &nbsp; <em>(Leibniz)</em></td>
<td style="padding:0.55rem 0.9rem">"$x$'teki birim değişime karşılık $f$'deki değişim." Değişken değişimi için en iyisi.</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{d}{dx}(x^2) = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\dfrac{dy}{dx}$</td>
<td style="padding:0.55rem 0.9rem">$y = f(x)$ iken $df/dx$ ile aynı. Kapalı fonksiyon problemlerinde yaygın.</td>
<td style="padding:0.55rem 0.9rem">$y = x^2 \\Rightarrow \\dfrac{dy}{dx} = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$y'$ &nbsp; <em>(bağımlı değişken üzerinde üs)</em></td>
<td style="padding:0.55rem 0.9rem">$dy/dx$ için kısayazım. Türk ders kitaplarında çok kullanılır.</td>
<td style="padding:0.55rem 0.9rem">$y = x^2 \\Rightarrow y' = 2x$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\dfrac{d}{dx}[f(x)]$ &nbsp; <em>(operatör formu)</em></td>
<td style="padding:0.55rem 0.9rem">$\\tfrac{d}{dx}$'i, ardından gelen ifadeye etki eden bir operatör olarak ele alır.</td>
<td style="padding:0.55rem 0.9rem">$\\dfrac{d}{dx}[x^2 + 3x] = 2x + 3$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem">$\\lim_{\\Delta x \\to 0} \\dfrac{\\Delta y}{\\Delta x}$</td>
<td style="padding:0.55rem 0.9rem">Tanımlayıcı limit. Tüm diğer notasyonlar bu ifadeye indirgenir.</td>
<td style="padding:0.55rem 0.9rem">$y = x^2$ için $x = 1$'de $\\Delta y / \\Delta x \\to 2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Eğim</strong> okuması</td>
<td style="padding:0.55rem 0.9rem">Geometrik: $f'(x_0)$, $(x_0, f(x_0))$ noktasındaki teğetin eğimidir.</td>
<td style="padding:0.55rem 0.9rem">$y = x^2$'ye $x = 1$'deki teğetin eğimi $2$'dir.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Hız</strong> okuması</td>
<td style="padding:0.55rem 0.9rem">Fiziksel: $s(t)$ konum ise, $s'(t)$ anlık hızdır.</td>
<td style="padding:0.55rem 0.9rem">$s(t) = 5t^2 \\Rightarrow v(1) = s'(1) = 10$ m/s</td>
</tr>
<tr>
<td style="padding:0.55rem 0.9rem"><strong>Değişim oranı</strong> okuması</td>
<td style="padding:0.55rem 0.9rem">Genel: $f'(x)$, $x$'teki birim değişime karşılık $f$'nin ne kadar hızlı değiştiğini söyler.</td>
<td style="padding:0.55rem 0.9rem">$V(t) = 4t^3 \\Rightarrow V'(2) = 48$ cm$^3$/s</td>
</tr>
</tbody>
</table>

<p class="l-text"><strong>Limit neden var?</strong> Çünkü eğri, $P$'nin yakınında, yakınlaştıkça giderek bir doğruya benzer. Düzgün bir eğri üzerinde yeterince yakınlaşırsan, eğri teğetinden ayırt edilemez hale gelir. "Türev vardır" demenin geometrik içeriği budur: eğrinin $P$ noktasında iyi tanımlı bir yönü vardır.</p>

<div class="l-note"><strong>Düzgün karşı keskin.</strong> Her eğrinin her yerde teğeti yoktur. $x = 0$ noktasındaki $|x|$ grafiği gibi bir köşede, iki farklı tek taraflı eğim vardır ve tek bir teğet yönü yoktur. Bu "türevlenemeyen noktaları" bir sonraki derste ayrıntılı inceleyeceğiz. Bu derste tüm örneklerimiz düzgündür.</div>

<h2 class="lesson-title">3. Türevin Tanımı</h2>

<div class="calc-highlight"><strong>Tanım.</strong> $f$, $x$'i içeren bir açık aralıkta tanımlı bir fonksiyon olsun. $f$'nin $x$ noktasındaki <em>türevi</em>, $f'(x)$ ile gösterilir ve $h \\to 0$ iken fark bölümünün limitidir:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h},$$
yeter ki bu limit var olsun. Var olduğunda, $f$ fonksiyonunun $x$ noktasında <em>türevlenebilir</em> olduğunu söyleriz.</div>

<p class="l-text">Her bileşeni yavaş yavaş açalım.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f(x+h) - f(x)$</div><div class="card-body">Çıktıdaki değişim. $h \\to 0$ iken bu, keyfi ölçüde yakın iki çıktı değerinin farkı olur, dolayısıyla 0'a yaklaşır.</div></div>
<div class="calc-card"><div class="card-title">Paydadaki $h$</div><div class="card-body">Girdideki değişim. O da 0'a yaklaşır. Dolayısıyla ifade 0/0 belirsizliğidir — tam olarak 13 ve 14. derslerde nasıl ele alacağını öğrendiğin türden bir limit.</div></div>
<div class="calc-card"><div class="card-title">Limit</div><div class="card-body">Oranın yaklaştığı sayı. Limit sonlu bir $L$ sayısı ise $f'(x) = L$ yazarız. Limit yoksa (tek taraflı değerler farklıysa veya oran patlıyorsa), $f$ fonksiyonu $x$'te türevlenebilir değildir.</div></div>
<div class="calc-card"><div class="card-title">$h$'nin işaretinden bağımsızlık</div><div class="card-body">$h$, 0'a <em>her iki yandan</em> da yaklaşabilmelidir. Fark bölümünün sol ve sağ limitleri aynı olmalıdır. Aksi takdirde düzgün bir nokta değil, bir köşe olur.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TÜREV — STANDART FORM</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$</div><div class="formula-sub">Okunuş: "$f$ üssü $x$, $h$ sıfıra yaklaşırken $f$ ($x$ artı $h$) eksi $f$ ($x$) tümünün $h$'ye bölümünün limitidir."</div></div>

<p class="l-text"><strong>Notasyon.</strong> Aşağıdaki sembollerin tamamı tam olarak aynı şeyi ifade eder. Matematikçilerin, fizikçilerin ve mühendislerin tercihleri farklıdır:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">LAGRANGE</div><div class="compare-item">$f'(x)$, $f''(x)$, $f^{(n)}(x)$</div><div class="compare-item">"Üs" işareti. Genel analiz için kompakt.</div></div><div class="compare-col"><div class="compare-title">LEIBNIZ</div><div class="compare-item">$\\dfrac{df}{dx}$, $\\dfrac{d^2 f}{dx^2}$</div><div class="compare-item">"Sonsuz küçüklerin" oranını çağrıştırır. Değişken değişimi için en iyisi.</div></div><div class="compare-col"><div class="compare-title">NEWTON / NOKTA</div><div class="compare-item">$\\dot x$, $\\ddot x$</div><div class="compare-item">Fizikte zamana göre türevler için ayrılmıştır.</div></div></div>

<div class="l-note"><strong>Neden "üs"?</strong> Joseph-Louis Lagrange, 1797 tarihli <em>Theorie des fonctions analytiques</em> adlı eserinde apostrof benzeri üs işaretini ortaya attı. Amaç, "sonsuz küçük" niceliklere yapılan tüm göndermeleri kaldırmak ve türevi $x$'in saf bir fonksiyonu olarak ele almaktı. Türk lise ders kitapları bu yaklaşımı izler.</div>

<h2 class="lesson-title">4. Eşdeğer $x \\to a$ Formu</h2>

<div class="calc-highlight"><strong>Aynı sayıyı veren ikinci bir formül:</strong> $x = a$ özel noktasındaki türev şu şekilde de yazılabilir:
$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}.$$
Burada $x$, $a$'ya her yandan yaklaşır; artık yardımcı $h$ değişkenini kullanmıyoruz. İki formül $h = x - a$ değişken değişimi ile birbirine bağlıdır.</div>

<p class="l-text"><strong>Neden iki form var?</strong> $h$-formu, $f'(x)$'i $x$'in bir fonksiyonu olarak hesaplamak istediğinde elverişlidir — örneğin "tüm $x$'ler için $f'(x)$'i bul." $x \\to a$ formu, türevi yalnızca tek bir $a$ noktasında istediğinde elverişlidir — örneğin "$f'(3)$'ü bul." Her ikisi de doğrudur; cebirin hangisinde temiz çıktığını seç.</p>

<div class="calc-formula"><div class="formula-label">$x = a$ NOKTASINDA TÜREV — NOKTA FORMU</div><div class="formula-main">$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$</div><div class="formula-sub">$h = x - a$ değişken değişimi yap. $x \\to a$ iken $h \\to 0$ ve iki formül çakışır.</div></div>

<div class="calc-example"><div class="example-label">EŞDEĞERLİK KONTROLÜ</div><div class="example-body">Her iki form $f(x) = x^2$ fonksiyonuna $a = 3$ noktasında uygulanırsa:<br><br><strong>$h$-formu:</strong> $f'(3) = \\lim_{h \\to 0} \\dfrac{(3+h)^2 - 9}{h} = \\lim_{h \\to 0} \\dfrac{9 + 6h + h^2 - 9}{h} = \\lim_{h \\to 0} (6 + h) = 6$.<br><br><strong>$x \\to a$ formu:</strong> $f'(3) = \\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\dfrac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x + 3) = 6$.<br><br>Aynı cevap, biraz farklı cebir.</div></div>

<h2 class="lesson-title">5. Çözümlü Örnek 1 — $f(x) = x^2$'nin Türevi</h2>

<div class="calc-highlight"><strong>Hedef:</strong> $f(x) = x^2$ fonksiyonu için genel bir $x$ noktasındaki $f'(x)$'i yalnızca limit tanımını kullanarak hesapla. Diferansiyel hesabın en önemli ısınma alıştırmasıdır — her ders kitabı buradan başlar.</div>

<p class="l-text"><strong>Fark bölümünü kur.</strong> $f(x+h) = (x+h)^2$ ve $f(x) = x^2$'yi tanıma yerleştir:</p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}.$$</div></div>

<p class="l-text"><strong>Payı aç.</strong> Binom özdeşliği $(x+h)^2 = x^2 + 2xh + h^2$'yi kullan:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{(x+h)^2 - x^2}{h} = \\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h}.$$</div></div>

<p class="l-text"><strong>Çarpan ayır ve sadeleştir.</strong> Payda ortak çarpan $h$ vardır:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{2xh + h^2}{h} = \\frac{h(2x + h)}{h} = 2x + h \\quad (h \\neq 0).$$</div></div>

<p class="l-text"><strong>Limiti al.</strong> Artık $h$ güvenle 0'a yaklaşabilir:</p>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} (2x + h) = 2x.$$</div><div class="formula-sub">$x^2$'nin türevi $2x$'tir. Örnekler: $f'(0) = 0$, $f'(1) = 2$, $f'(2) = 4$, $f'(-3) = -6$.</div></div>

<div class="calc-graph"><div id="plot-l17-x2tangent-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x^2$ parabolü mavide ve $x = 2$ noktasındaki teğet doğru kırmızıda. Teğetin eğimi $f'(2) = 4$'tür, yani teğet $(2, 4)$ noktasından geçer ve eğimi $4$'tür. Denklemi $y = 4(x - 2) + 4 = 4x - 4$'tür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);ys.push(x*x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = x^2',line:{color:'#3b82f6',width:3}};
var x0=2;var y0=4;var m=4;
var tx=[x0-2.2,x0+1.2];var ty=[y0+m*(tx[0]-x0),y0+m*(tx[1]-x0)];
var tangent={x:tx,y:ty,mode:'lines',name:"x=2'de teğet, eğim=4",line:{color:'#ef4444',width:3}};
var pt={x:[x0],y:[y0],mode:'markers+text',name:'(2, 4)',marker:{color:'#22c55e',size:12},text:['(2, 4)'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2.5,9.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l17-x2tangent-tr',[curve,tangent,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Çözümlü Örnek 2 — $f(x) = 1/x$'in Türevi</h2>

<div class="calc-highlight"><strong>Hedef:</strong> $f(x) = 1/x$ fonksiyonu için herhangi bir $x \\neq 0$ noktasındaki $f'(x)$'i yalnızca limit tanımını kullanarak hesapla. Bu örnek, kesirler ortaya çıktığında gereken tipik cebiri gösterir: tek bir kesirde birleştir, sonra sadeleştir.</div>

<p class="l-text"><strong>Kur:</strong></p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{\\tfrac{1}{x+h} - \\tfrac{1}{x}}{h}.$$</div></div>

<p class="l-text"><strong>Paydaki kesirleri</strong> ortak payda $x(x+h)$'de birleştir:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{1}{x+h} - \\frac{1}{x} = \\frac{x - (x+h)}{x(x+h)} = \\frac{-h}{x(x+h)}.$$</div></div>

<p class="l-text"><strong>$h$'ye böl.</strong> $h$'ye bölmek $1/h$ ile çarpmakla aynıdır:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{-h}{x(x+h)} \\cdot \\frac{1}{h} = \\frac{-1}{x(x+h)} \\quad (h \\neq 0).$$</div></div>

<p class="l-text"><strong>Limiti al.</strong> $h \\to 0$ iken $(x+h) \\to x$ olur:</p>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{-1}{x(x+h)} = \\frac{-1}{x \\cdot x} = -\\frac{1}{x^2}.$$</div><div class="formula-sub">$1/x$'in türevi $-1/x^2$'dir. Örnekler: $f'(1) = -1$, $f'(2) = -1/4$, $f'(-1) = -1$. Not: $f$ fonksiyonu $x = 0$'da tanımlı değildir, dolayısıyla formülün orada anlamı yoktur.</div></div>

<div class="l-note"><strong>İşaret kontrolü.</strong> $1/x$ fonksiyonu $(0, \\infty)$'da azalandır, dolayısıyla eğim orada negatif olmalı. Gerçekten de her $x \\neq 0$ için $-1/x^2 < 0$'dır. Fonksiyon $(-\\infty, 0)$'da da azalandır ve yine $-1/x^2 < 0$. Tutarlı.</div>

<h2 class="lesson-title">7. Çözümlü Örnek 3 — $f(x) = \\sqrt{x}$'in Türevi</h2>

<div class="calc-highlight"><strong>Hedef:</strong> $f(x) = \\sqrt{x}$ fonksiyonu için herhangi bir $x > 0$ noktasındaki $f'(x)$'i hesapla. Hile, limitleri rasyonalleştirirken kullandığının aynısıdır: pay ve paydayı payın <em>eşleniğiyle</em> çarp.</div>

<p class="l-text"><strong>Kur:</strong></p>

<div class="calc-formula"><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{\\sqrt{x+h} - \\sqrt{x}}{h}.$$</div></div>

<p class="l-text"><strong>Pay ve paydayı eşlenik</strong> $\\sqrt{x+h} + \\sqrt{x}$ ile çarp:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sqrt{x+h} - \\sqrt{x}}{h} \\cdot \\frac{\\sqrt{x+h} + \\sqrt{x}}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{(x+h) - x}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\frac{h}{h\\,(\\sqrt{x+h} + \\sqrt{x})}.$$</div></div>

<p class="l-text"><strong>$h$'yi sadeleştir</strong> (limit boyunca $h \\neq 0$ olduğu için meşru):</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{h}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\frac{1}{\\sqrt{x+h} + \\sqrt{x}}.$$</div></div>

<p class="l-text"><strong>Limiti al.</strong> $h \\to 0$ iken karekök $\\sqrt{x+h} \\to \\sqrt{x}$ olur:</p>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$f'(x) = \\lim_{h \\to 0} \\frac{1}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{1}{2\\sqrt{x}}.$$</div><div class="formula-sub">$\\sqrt{x}$'in türevi $1/(2\\sqrt{x})$'tir. Yalnızca $x > 0$ için tanımlıdır.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">$x = 0$'da ne olur? Payda $2\\sqrt{x}$ kaybolur ve $f'(0)$ olağan anlamda tanımlı değildir — $(0,0)$'daki teğet doğru dikeydir (eğim $+\\infty$). Dikey teğetler bir sonraki derste tartışacağımız bir tür türevlenememe durumudur.</div></div>

<h2 class="lesson-title">8. Geometrik Anlam — Teğetin Eğimi</h2>

<div class="calc-highlight"><strong>Geometrik ifade.</strong> $f'(x_0)$ sayısı, $y = f(x)$ grafiğinin $(x_0, f(x_0))$ noktasındaki teğet doğrusunun <em>eğimidir</em>. Eğimi ve doğru üzerindeki bir noktayı bildiğinde, teğetin denklemini nokta-eğim formunda yazabilirsin:
$$y - f(x_0) = f'(x_0) \\cdot (x - x_0).$$</div>

<p class="l-text">Bu formül, 12. sınıf Türk lise programında ve AYT'de sürekli karşına çıkar. Bir problem "verilen noktada eğriye teğeti bul" derse üç şey yaparsın: (1) $f(x_0)$'ı hesapla, böylece değme noktasının $y$-koordinatını bulursun; (2) $f'(x_0)$'ı hesapla, eğimi bulursun; (3) her şeyi nokta-eğim formülüne yerleştir.</p>

<div class="calc-formula"><div class="formula-label">$(x_0, f(x_0))$ NOKTASINDA TEĞET DOĞRU</div><div class="formula-main">$$y = f(x_0) + f'(x_0) \\cdot (x - x_0)$$</div><div class="formula-sub">Geometri: $(x_0, f(x_0))$ noktasından $f'(x_0)$ eğimiyle geçen doğru.</div></div>

<div class="calc-example"><div class="example-label">$y = x^2$ EĞRİSİNE $x = 3$'TE TEĞET</div><div class="example-body">Değme noktası: $f(3) = 9$, yani $(x_0, y_0) = (3, 9)$.<br>Eğim: $f'(3) = 2 \\cdot 3 = 6$.<br>Teğet denklemi: $y - 9 = 6(x - 3) \\;\\Rightarrow\\; y = 6x - 9$.<br><br>Sağlama: $x = 3$'te doğru $y = 18 - 9 = 9$ verir — değme noktasıyla uyumlu. Doğru $x = 2$'dekinden daha diktir; orada eğim 4'tü — parabolün $|x|$ büyüdükçe dikleşmesi görsel gerçeğiyle uyumlu.</div></div>

<div class="calc-example"><div class="example-label">$y = 1/x$ EĞRİSİNE $x = 2$'DE TEĞET</div><div class="example-body">Değme noktası: $f(2) = 1/2$, yani $(2, 0.5)$.<br>Eğim: $f'(2) = -1/4$.<br>Teğet: $y - 0.5 = -\\dfrac{1}{4}(x - 2) \\;\\Rightarrow\\; y = -\\dfrac{x}{4} + 1$.<br><br>Eğim negatif, azalan eğriyle uyumlu.</div></div>

<div class="l-note"><strong>Normal doğru.</strong> Eğrinin $(x_0, y_0)$ noktasındaki <em>normali</em>, o noktadan geçen ve teğete <em>dik</em> doğrudur. Eğimi $-1/f'(x_0)$'dır (negatif ters). $y = x^2$ eğrisinde $x = 3$'te teğet eğimi $6$'dır, dolayısıyla normal eğimi $-1/6$ ve normal denklemi $y - 9 = -\\tfrac{1}{6}(x - 3)$'tür.</div>

<h2 class="lesson-title">9. Fiziksel Anlam — Hız, İvme, Değişim Oranı</h2>

<div class="calc-highlight"><strong>Fiziksel okuma.</strong> $s(t)$ bir parçacığın $t$ anındaki konumu ise, $s'(t)$ onun <em>anlık hızıdır</em>. $v(t) = s'(t)$ hız ise, $v'(t) = s''(t)$ <em>anlık ivmedir</em>. Türev, nicelik-zaman grafiğini değişim-oranı-zaman grafiğine dönüştürür ve bu mekaniğin tamamının kullandığı dildir.</div>

<p class="l-text">Aynı ilke yalnızca konum ve zaman için değil, herhangi bir nicelik çifti için işler. $V(t)$ bir tanktaki su hacmi ise, $V'(t)$ suyun içeri veya dışarı akış oranıdır. $C(q)$ $q$ adet üretmenin toplam maliyeti ise, $C'(q)$ <em>marjinal maliyettir</em> — bir adet daha üretmenin maliyeti. Bir nicelik diğerine bağlı olduğu her yerde, türev yerel bağımlılık oranını ölçer.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">KONUM → HIZ</div><div class="compare-item">$s(t)$ metre, $t$ saniye</div><div class="compare-item">$v(t) = s'(t)$, m/s</div><div class="compare-item">İşaret: $v > 0$ ileri gidiyor, $v < 0$ geriye</div></div><div class="compare-col"><div class="compare-title">HIZ → İVME</div><div class="compare-item">$v(t)$ m/s, $t$ saniye</div><div class="compare-item">$a(t) = v'(t) = s''(t)$, m/s$^2$</div><div class="compare-item">İşaret: $a > 0$ ve $v > 0$ ise hızlanıyor, $v < 0$ ise yavaşlıyor</div></div></div>

<div class="calc-example"><div class="example-label">SERBEST DÜŞEN CİSİM</div><div class="example-body">Bir top durgun halden bırakılıyor. $t$ saniye sonra başlangıçtan (metre cinsinden aşağı doğru) konumu $s(t) = 5 t^2$.<br><br>Hız: $v(t) = s'(t) = 10 t$ m/s.<br>$t = 0$ anında: $v = 0$ (durgun halden başlar).<br>$t = 1$ anında: $v = 10$ m/s.<br>$t = 2$ anında: $v = 20$ m/s.<br><br>İvme: $a(t) = v'(t) = 10$ m/s$^2$ — sabit. (Bu yerçekimi için standart ders kitabı değeri $g \\approx 10$ m/s$^2$'dir.) Top zamanla doğrusal olarak hızlanır, Galileo'nun keşfettiği şekilde.</div></div>

<div class="calc-example"><div class="example-label">HER YERDE ORAN DİLİ</div><div class="example-body">Küre şeklinde bir balon şişiriliyor. $t$ saniye anındaki hacmi $V(t)$ santimetreküptür. O zaman $V'(t)$, gazın balona giriş oranıdır, cm$^3$/s cinsinden ölçülür.<br><br>$V(t) = 4 t^3$ ise, $V'(t) = 12 t^2$. $t = 2$'de gaz $48$ cm$^3$/s oranında girer. $t = 3$'te oran $108$ cm$^3$/s olur — balon büyüdükçe şişirme hızlanır.</div></div>

<div class="think-box"><div class="think-label">BİRİM DÖNÜŞTÜRÜCÜ OLARAK TÜREV</div><div class="think-body">Türevin birimleri nasıl değiştirdiğine dikkat et: $s$ metre ve $t$ saniye ise, $ds/dt$ metre bölü saniyedir. Leibniz notasyonu $\\dfrac{ds}{dt}$ bunu açıkça gösterir. Türev her zaman payı niceliğin değişim oranıdır, payda niceliği birim başına.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<div class="calc-highlight"><strong>Her problemi tamamen limit tanımından çöz</strong> — herhangi bir kestirme kural kullanma (bunları bir sonraki derste tanıtacağız). Fark bölümünü göster, uygun cebir hilesiyle sadeleştir (aç, çarpan ayır, eşlenik, ortak payda) ve limiti al.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 — DOĞRUSAL FONKSİYON</div><div class="example-body">$f(x) = 5x - 7$ için tanımdan $f'(x)$'i bul.<br><br><em>Çözüm.</em> $f(x+h) = 5(x+h) - 7 = 5x + 5h - 7$. Dolayısıyla $f(x+h) - f(x) = 5h$. $h$'ye böl: $\\tfrac{5h}{h} = 5$. Limiti al: $\\lim_{h \\to 0} 5 = 5$.<br>$\\boxed{f'(x) = 5}$. $ax + b$ doğrusal fonksiyonunun türevi $a$ eğimidir — geometrik olarak apaçık. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — İKİNCİ DERECE</div><div class="example-body">$f(x) = 3x^2 + 2x - 1$ için $f'(x)$'i bul.<br><br><em>Çözüm.</em> $f(x+h) = 3(x+h)^2 + 2(x+h) - 1 = 3x^2 + 6xh + 3h^2 + 2x + 2h - 1$. $f(x)$'i çıkar: $f(x+h) - f(x) = 6xh + 3h^2 + 2h$. $h$'ye böl: $6x + 3h + 2$. Limiti al: $6x + 2$.<br>$\\boxed{f'(x) = 6x + 2}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — ÜÇÜNCÜ DERECE</div><div class="example-body">$f(x) = x^3$ için $f'(x)$'i bul.<br><br><em>Çözüm.</em> $(x+h)^3 = x^3 + 3x^2 h + 3x h^2 + h^3$. Dolayısıyla $f(x+h) - f(x) = 3x^2 h + 3x h^2 + h^3$. $h$'ye böl: $3x^2 + 3xh + h^2$. Limiti al: $3x^2$.<br>$\\boxed{f'(x) = 3x^2}$. ($x^2$ için $f'(x) = 2x$ ile karşılaştır — bir desen ortaya çıkıyor.) $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — $x^2$'NİN TERSİ</div><div class="example-body">$f(x) = 1/x^2$ için herhangi bir $x \\neq 0$'da $f'(x)$'i bul.<br><br><em>Çözüm.</em> $\\dfrac{1}{(x+h)^2} - \\dfrac{1}{x^2} = \\dfrac{x^2 - (x+h)^2}{x^2(x+h)^2} = \\dfrac{-2xh - h^2}{x^2(x+h)^2}$. $h$'ye böl: $\\dfrac{-2x - h}{x^2(x+h)^2}$. Limiti al ($h \\to 0$): $\\dfrac{-2x}{x^2 \\cdot x^2} = \\dfrac{-2}{x^3}$.<br>$\\boxed{f'(x) = -\\dfrac{2}{x^3}}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — $y = \\sqrt{x}$ EĞRİSİNE $x = 4$'TE TEĞET</div><div class="example-body">7. bölümden $f'(x) = 1/(2\\sqrt{x})$ olduğunu biliyoruz. Dolayısıyla $f'(4) = 1/(2 \\cdot 2) = 1/4$. Değme noktası $(4, 2)$.<br>Teğet doğru: $y - 2 = \\tfrac{1}{4}(x - 4) \\;\\Rightarrow\\; y = \\tfrac{x}{4} + 1$.<br>Kontrol: $x = 4$'te doğru $y = 1 + 1 = 2$ verir — doğru. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — ANLIK HIZ</div><div class="example-body">Bir parçacık doğru bir çizgi boyunca konumu $s(t) = t^2 - 4t + 5$ ile hareket ediyor (metre, $t$ saniye). Tanımdan $t = 3$'teki anlık hızı bul.<br><br><em>Çözüm.</em> $s(3+h) = (3+h)^2 - 4(3+h) + 5 = 9 + 6h + h^2 - 12 - 4h + 5 = 2 + 2h + h^2$. $s(3) = 9 - 12 + 5 = 2$. Dolayısıyla $s(3+h) - s(3) = 2h + h^2$. $h$'ye böl: $2 + h$. Limiti al: $2$.<br>$\\boxed{v(3) = s'(3) = 2 \\text{ m/s}}$.<br><br>Bonus: parçacık hangi $t$ anında anlık olarak duruyor? Genel formülden $s'(t) = 2t - 4$ (Problem 2'deki gibi hesapla), $2t - 4 = 0$'ı çöz: $t = 2$ s. $\\blacksquare$</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Türev tanımı:</strong> $f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$, eşdeğer olarak $f'(a) = \\lim_{x \\to a} \\dfrac{f(x) - f(a)}{x - a}$.</li>
<li>Geometrik olarak: $f'(x_0)$, $(x_0, f(x_0))$ noktasındaki <strong>teğet doğrusunun eğimi</strong>dir.</li>
<li>Fiziksel olarak: $s(t)$ konum ise, $s'(t)$ <strong>anlık hız</strong>; $s''(t)$ <strong>ivme</strong>dir.</li>
<li>Tanımdan elde edilen üç temel türev: $(x^2)' = 2x$, $(1/x)' = -1/x^2$, $(\\sqrt{x})' = 1/(2\\sqrt{x})$.</li>
<li>Cebir hileleri: polinomlar için binomları <em>aç</em>, kesirler için <em>ortak payda</em>, karekökler için <em>eşlenik</em>.</li>
<li>$(x_0, f(x_0))$ noktasındaki teğet denklemi: $y = f(x_0) + f'(x_0)(x - x_0)$.</li>
<li>Bir sonraki ders: <strong>türev kuralları</strong> (toplam, çarpım, bölüm, zincir) — limit tanımını atlayan kestirmeler.</li>
</ul>
</div>`
};
