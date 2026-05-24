window.LISE_MAT_L8 = {

en: `
<p class="l-text"><strong>Trigonometric functions are the mathematics of waves.</strong> Sound, light, vibrations, alternating current, the swing of a pendulum, the orbit of a planet — every phenomenon that returns to the same state at regular intervals is described by some combination of sines and cosines. In this lesson we draw the three core graphs $y = \\sin x$, $y = \\cos x$, $y = \\tan x$, and then learn to bend them at will using four transformations: amplitude $A$, period factor $B$, phase shift $C$, and vertical shift $D$.</p>

<p class="l-text">By the end you will be able to look at any equation of the form $y = A\\sin\\bigl(B(x - C)\\bigr) + D$ and immediately picture its graph — height, width, position, and centreline. You will also be able to do the reverse: read a graph off the page and write down its equation.</p>

<div class="lesson-outcomes" style="background:rgba(184,169,212,0.06);border-left:3px solid #b8a9d4;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#b8a9d4;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read the graphs of $y = \\sin x$, $y = \\cos x$, and $y = \\tan x$ directly from the unit circle</li>
<li>Identify period, amplitude, range, domain, and intercepts for each base graph</li>
<li>Predict how the coefficients $A$, $B$, $C$, $D$ transform a base trig graph</li>
<li>Sketch any graph of the form $y = A\\sin\\bigl(B(x - C)\\bigr) + D$ from its equation</li>
<li>Recover the equation from a labelled graph (reverse problem)</li>
<li>Sketch the reciprocal graphs $y = \\csc x$, $y = \\sec x$, and $y = \\cot x$ with their asymptotes</li>
</ul>
</div>

<h2 class="l-title">1. The Graph of y = sin x</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> Imagine a point spinning around the unit circle at constant speed. As it spins, its <em>height</em> above the horizontal axis rises and falls. If you plot that height against the angle of rotation, you get the sine curve — a smooth, endlessly repeating wave.</div>

<p class="l-text">Recall from Lesson 1 (unit circle): if $P$ is the point on the unit circle at angle $x$, then $P = (\\cos x,\\ \\sin x)$. So $\\sin x$ is the <strong>$y$-coordinate</strong> of $P$. As $x$ increases from $0$ to $2\\pi$, $P$ travels once around the circle, and its $y$-coordinate traces out one complete cycle: up to $1$, back through $0$, down to $-1$, back through $0$ — and the pattern repeats forever.</p>

<div class="calc-formula"><div class="formula-label">KEY PROPERTIES OF y = sin x</div><div class="formula-main">$$\\text{Domain: } \\mathbb{R}, \\quad \\text{Range: } [-1, 1], \\quad \\text{Period: } 2\\pi$$</div><div class="formula-sub">Zeros at $x = k\\pi$; maxima at $x = \\pi/2 + 2k\\pi$ (value $+1$); minima at $x = -\\pi/2 + 2k\\pi$ (value $-1$). Odd function: $\\sin(-x) = -\\sin x$.</div></div>

<div id="plot-l8-sin-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];var y=[];for(var i=-720;i<=720;i++){var t=i*Math.PI/180;x.push(t);y.push(Math.sin(t));}
var tr={x:x,y:y,mode:"lines",name:"y = sin x",line:{color:"#3b82f6",width:2.6}};
var pts={x:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],y:[0,1,0,-1,0],mode:"markers+text",text:["(0,0)","(π/2,1)","(π,0)","(3π/2,-1)","(2π,0)"],textposition:"top center",textfont:{color:"#ebe6dc",size:10},marker:{size:8,color:"#f59e0b"},name:"key points"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x (radians)",tickvals:[-2*Math.PI,-Math.PI,0,Math.PI,2*Math.PI,4*Math.PI],ticktext:["-2π","-π","0","π","2π","4π"],range:[-2*Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-l8-sin-en",[tr,pts],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> One full wave of $y = \\sin x$ from $0$ to $2\\pi$, extended to several cycles. The curve starts at the origin, rises to a maximum of $+1$ at $\\pi/2$, returns to $0$ at $\\pi$, falls to a minimum of $-1$ at $3\\pi/2$, and returns to $0$ at $2\\pi$. The same pattern repeats every $2\\pi$ units to the left and right.</div></div>

<p class="l-text"><strong>Why sine is "odd":</strong> reflecting the unit circle across the $x$-axis sends the point at angle $x$ to the point at angle $-x$, and flips the $y$-coordinate sign. So $\\sin(-x) = -\\sin x$, which means the graph has a point-symmetry through the origin.</p>

<h2 class="l-title">2. The Graph of y = cos x</h2>

<p class="l-text">Cosine is the <strong>$x$-coordinate</strong> of the unit-circle point. As the point sweeps around, the $x$-coordinate starts at $+1$ (when $x=0$), drops to $0$ at $\\pi/2$, reaches $-1$ at $\\pi$, returns to $0$ at $3\\pi/2$, and is back to $+1$ at $2\\pi$. So $\\cos x$ traces exactly the same wave shape as $\\sin x$ — only it starts at the top instead of at zero.</p>

<div class="calc-formula"><div class="formula-label">SINE AND COSINE ARE SHIFTED VERSIONS OF EACH OTHER</div><div class="formula-main">$$\\cos x = \\sin\\!\\left(x + \\dfrac{\\pi}{2}\\right)$$</div><div class="formula-sub">The cosine curve is the sine curve translated $\\pi/2$ units to the <strong>left</strong>. Equivalently, $\\sin x = \\cos\\!\\left(x - \\pi/2\\right)$.</div></div>

<div class="calc-formula"><div class="formula-label">KEY PROPERTIES OF y = cos x</div><div class="formula-main">$$\\text{Domain: } \\mathbb{R}, \\quad \\text{Range: } [-1, 1], \\quad \\text{Period: } 2\\pi$$</div><div class="formula-sub">Zeros at $x = \\pi/2 + k\\pi$; maxima at $x = 2k\\pi$; minima at $x = \\pi + 2k\\pi$. Even function: $\\cos(-x) = \\cos x$ (graph is symmetric about the $y$-axis).</div></div>

<div id="plot-l8-cos-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];var ys=[];var yc=[];for(var i=-720;i<=720;i++){var t=i*Math.PI/180;x.push(t);ys.push(Math.sin(t));yc.push(Math.cos(t));}
var trS={x:x,y:ys,mode:"lines",name:"y = sin x",line:{color:"#94a3b8",width:1.8,dash:"dot"}};
var trC={x:x,y:yc,mode:"lines",name:"y = cos x",line:{color:"#3b82f6",width:2.6}};
var pts={x:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],y:[1,0,-1,0,1],mode:"markers+text",text:["(0,1)","(π/2,0)","(π,-1)","(3π/2,0)","(2π,1)"],textposition:"top center",textfont:{color:"#ebe6dc",size:10},marker:{size:8,color:"#f59e0b"},name:"cos key points"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x (radians)",tickvals:[-2*Math.PI,-Math.PI,0,Math.PI,2*Math.PI,4*Math.PI],ticktext:["-2π","-π","0","π","2π","4π"],range:[-2*Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-l8-cos-en",[trS,trC,pts],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> $y = \\cos x$ in solid blue with the same wave shape as $y = \\sin x$ (dotted grey), translated $\\pi/2$ to the left. The cosine curve has a maximum at the $y$-axis and is symmetric about it (even function).</div></div>

<h2 class="l-title">3. The Graph of y = tan x</h2>

<p class="l-text">By definition $\\tan x = \\dfrac{\\sin x}{\\cos x}$. Wherever $\\cos x = 0$ the tangent is <strong>undefined</strong> — the graph has a <em>vertical asymptote</em>. This happens at $x = \\pi/2 + k\\pi$ for every integer $k$.</p>

<p class="l-text">Between consecutive asymptotes the tangent climbs continuously from $-\\infty$ to $+\\infty$, passing through zero where $\\sin x = 0$. So the graph of $y = \\tan x$ is an endless succession of identical "S-shaped" branches, each one squeezed between two vertical asymptotes.</p>

<div class="calc-formula"><div class="formula-label">KEY PROPERTIES OF y = tan x</div><div class="formula-main">$$\\text{Domain: } x \\neq \\dfrac{\\pi}{2} + k\\pi, \\quad \\text{Range: } \\mathbb{R}, \\quad \\text{Period: } \\pi$$</div><div class="formula-sub">Note: the period is $\\pi$ (not $2\\pi$). Zeros at $x = k\\pi$; vertical asymptotes at $x = \\pi/2 + k\\pi$. Odd function: $\\tan(-x) = -\\tan x$.</div></div>

<div id="plot-l8-tan-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];var asy=[];
for(var seg=-3;seg<=3;seg++){
  var x=[];var y=[];
  for(var i=-44;i<=44;i++){
    var t=seg*Math.PI+i*(Math.PI/2-0.05)/45;
    x.push(t);y.push(Math.tan(t));
  }
  traces.push({x:x,y:y,mode:"lines",name:seg===0?"y = tan x":"",showlegend:seg===0,line:{color:"#3b82f6",width:2.6}});
  asy.push({x:[seg*Math.PI+Math.PI/2,seg*Math.PI+Math.PI/2],y:[-6,6],mode:"lines",showlegend:seg===0,name:"asymptotes",line:{color:"#ef4444",width:1.2,dash:"dash"}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x (radians)",tickvals:[-2*Math.PI,-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI],ticktext:["-2π","-π","0","π","2π","3π"],range:[-2*Math.PI,3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-6,6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-l8-tan-en",traces.concat(asy),layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Five branches of $y = \\tan x$ (blue) separated by vertical asymptotes (red dashed) at $x = -\\frac{3\\pi}{2}, -\\frac{\\pi}{2}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}$. Each branch rises from $-\\infty$ to $+\\infty$ across one period of length $\\pi$.</div></div>

<div class="l-note"><strong>Why is the period of tan only $\\pi$ instead of $2\\pi$?</strong> Because flipping the unit-circle point through the origin (adding $\\pi$ to the angle) flips <em>both</em> coordinates: $\\sin(x+\\pi) = -\\sin x$ and $\\cos(x+\\pi) = -\\cos x$. So $\\tan(x+\\pi) = \\dfrac{-\\sin x}{-\\cos x} = \\tan x$ — the function returns to the same value after only half a circle.</div>

<h2 class="l-title">4. Amplitude — y = A sin x</h2>

<p class="l-text">The first transformation is a vertical stretch. Multiplying the function by a constant $A$ stretches the wave vertically by factor $|A|$:</p>

<div class="calc-formula"><div class="formula-label">AMPLITUDE</div><div class="formula-main">$$y = A \\sin x \\quad\\implies\\quad \\text{Amplitude} = |A|, \\quad \\text{Range} = [-|A|,\\ +|A|]$$</div><div class="formula-sub">Amplitude is always non-negative. The period stays $2\\pi$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A &gt; 1</div><div class="card-body">Vertical stretch. The wave reaches higher and dips lower. Example: $y = 3\\sin x$ ranges over $[-3, 3]$.</div></div>
<div class="calc-card"><div class="card-title">0 &lt; A &lt; 1</div><div class="card-body">Vertical compression. The wave is flattened. Example: $y = 0.5\\sin x$ ranges over $[-0.5, 0.5]$.</div></div>
<div class="calc-card"><div class="card-title">A &lt; 0</div><div class="card-body">Vertical stretch <em>and</em> reflection across the $x$-axis. The wave is flipped upside down. Example: $y = -2\\sin x$ starts going downward.</div></div>
</div>

<div id="plot-l8-amp-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return 2*Math.sin(t);});
var y3=x.map(function(t){return 0.5*Math.sin(t);});
var y4=x.map(function(t){return -1.5*Math.sin(t);});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (A=1)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = 2 sin x  (A=2)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = 0.5 sin x  (A=0.5)",line:{color:"#f59e0b",width:2}};
var t4={x:x,y:y4,mode:"lines",name:"y = -1.5 sin x  (A=-1.5)",line:{color:"#ef4444",width:2,dash:"dash"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-2.5,2.5]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-amp-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Four sine waves with amplitudes $A = 1, 2, 0.5, -1.5$. Notice that $A = -1.5$ is a mirror image (red dashed) of $1.5\\sin x$. The <em>shape</em> is the same in all four cases; only the vertical scale changes.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body"><strong>Find the amplitude and range of</strong> $y = -4\\sin x$.<br><br>Amplitude $= |-4| = \\mathbf{4}$. Range $= [-4,\\ 4]$. The negative sign reflects the graph across the $x$-axis but does not change the amplitude. At $x = \\pi/2$ the value is $-4$ (instead of $+4$); at $x = 3\\pi/2$ the value is $+4$.</div></div>

<h2 class="l-title">5. Period Change — y = sin(Bx)</h2>

<p class="l-text">The second transformation is a horizontal stretch. Multiplying the input $x$ by $B$ compresses the wave horizontally by factor $|B|$:</p>

<div class="calc-formula"><div class="formula-label">PERIOD FORMULA</div><div class="formula-main">$$y = \\sin(Bx) \\quad\\implies\\quad \\text{Period} = \\dfrac{2\\pi}{|B|}$$</div><div class="formula-sub">For $y = \\cos(Bx)$ the period is also $2\\pi/|B|$. For $y = \\tan(Bx)$ the period is $\\pi/|B|$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">B &gt; 1</div><div class="card-body">Horizontal compression. More cycles fit in the same interval. Example: $y = \\sin 2x$ has period $\\pi$ — two cycles in $[0, 2\\pi]$.</div></div>
<div class="calc-card"><div class="card-title">0 &lt; B &lt; 1</div><div class="card-body">Horizontal stretch. The wave is longer. Example: $y = \\sin(x/2)$ has period $4\\pi$ — half a cycle in $[0, 2\\pi]$.</div></div>
<div class="calc-card"><div class="card-title">B &lt; 0</div><div class="card-body">Reflection across the $y$-axis. Since sine is odd, $\\sin(-Bx) = -\\sin(Bx)$, so a negative $B$ is equivalent to flipping the sign of $A$.</div></div>
</div>

<div id="plot-l8-period-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return Math.sin(2*t);});
var y3=x.map(function(t){return Math.sin(0.5*t);});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (B=1, period 2π)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = sin 2x  (B=2, period π)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = sin(x/2)  (B=0.5, period 4π)",line:{color:"#f59e0b",width:2}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-period-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Three sine waves with $B = 1, 2, 0.5$. The blue base curve has period $2\\pi$. Green doubles the frequency (period halved to $\\pi$). Orange halves the frequency (period doubled to $4\\pi$). All three reach the same maximum height of $1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body"><strong>Find the period of</strong> $y = \\cos(3x)$ and $y = \\tan(\\pi x)$.<br><br>For $y = \\cos(3x)$: Period $= \\dfrac{2\\pi}{3}$ — about $2.09$. The graph completes three full cycles in the space the base cosine completes one.<br><br>For $y = \\tan(\\pi x)$: Tangent has base period $\\pi$, so the new period is $\\dfrac{\\pi}{\\pi} = \\mathbf{1}$. Asymptotes occur at $x = \\tfrac{1}{2} + k$ for every integer $k$.</div></div>

<h2 class="l-title">6. Phase Shift — y = sin(B(x − C))</h2>

<p class="l-text">Replacing $x$ with $x - C$ slides the graph horizontally by $C$ units. <strong>Positive $C$ shifts right, negative $C$ shifts left.</strong> The number $C$ is called the <em>phase shift</em>.</p>

<div class="calc-formula"><div class="formula-label">PHASE SHIFT</div><div class="formula-main">$$y = \\sin\\bigl(B(x - C)\\bigr) \\quad\\implies\\quad \\text{Phase shift} = C \\text{ (to the right)}$$</div><div class="formula-sub">Common pitfall: the factor inside the bracket must be $B(x - C)$, <em>not</em> $Bx - C$. If you see $\\sin(2x - \\pi)$, factor out the $2$ first: $\\sin\\!\\bigl(2(x - \\pi/2)\\bigr)$ — phase shift is $\\pi/2$, not $\\pi$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Factor B out of the bracket</div><div class="step-detail">Rewrite the input as $B(x - C)$. The number subtracted from $x$ (after factoring) is the phase shift $C$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Read off the direction</div><div class="step-detail">$x - C$ with $C > 0$ shifts right by $C$. $x + C$ (which is $x - (-C)$) shifts left by $C$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Combine with the period</div><div class="step-detail">After the shift, one cycle of the wave starts at $x = C$ and ends at $x = C + \\dfrac{2\\pi}{B}$.</div></div></div>
</div>

<div id="plot-l8-phase-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return Math.sin(t-Math.PI/2);});
var y3=x.map(function(t){return Math.sin(t+Math.PI/4);});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (C=0)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = sin(x - π/2)  (right π/2)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = sin(x + π/4)  (left π/4)",line:{color:"#f59e0b",width:2}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI/2,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π/2","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-phase-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The base sine (blue), the sine shifted $\\pi/2$ to the <em>right</em> (green — which looks identical to $-\\cos x$), and the sine shifted $\\pi/4$ to the <em>left</em> (orange). The shape is the same; only the starting position changes.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — FACTORING TRAP</div><div class="example-body"><strong>Find the phase shift of</strong> $y = \\sin(2x - \\pi)$.<br><br>The expression inside is $2x - \\pi$. Do <strong>not</strong> read $\\pi$ as the phase shift. First factor out the $2$:<br><br>$2x - \\pi = 2\\!\\left(x - \\dfrac{\\pi}{2}\\right)$<br><br>So $y = \\sin\\!\\bigl(2(x - \\pi/2)\\bigr)$. Phase shift $= \\pi/2$ (right). Period $= 2\\pi/2 = \\pi$.</div></div>

<h2 class="l-title">7. Vertical Shift — y = sin x + D</h2>

<p class="l-text">Adding a constant $D$ to the entire function slides the graph vertically. The wave shape is unchanged, but the centreline moves from $y = 0$ to $y = D$.</p>

<div class="calc-formula"><div class="formula-label">VERTICAL SHIFT</div><div class="formula-main">$$y = \\sin x + D \\quad\\implies\\quad \\text{Centreline: } y = D, \\quad \\text{Range: } [D - 1,\\ D + 1]$$</div><div class="formula-sub">$D > 0$ shifts up; $D < 0$ shifts down. The midline (the line halfway between max and min) is exactly $y = D$.</div></div>

<div id="plot-l8-vert-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return Math.sin(t)+2;});
var y3=x.map(function(t){return Math.sin(t)-1;});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (D=0)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = sin x + 2  (D=+2)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = sin x - 1  (D=-1)",line:{color:"#f59e0b",width:2}};
var midlines=[{x:[-Math.PI,4*Math.PI],y:[0,0],mode:"lines",showlegend:false,line:{color:"#3b82f6",width:0.8,dash:"dot"}},{x:[-Math.PI,4*Math.PI],y:[2,2],mode:"lines",showlegend:false,line:{color:"#10b981",width:0.8,dash:"dot"}},{x:[-Math.PI,4*Math.PI],y:[-1,-1],mode:"lines",showlegend:false,line:{color:"#f59e0b",width:0.8,dash:"dot"}}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-2.5,3.5]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-vert-en",[t1,t2,t3].concat(midlines),layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Three sine waves with vertical shifts $D = 0, +2, -1$. The dotted lines mark each wave's centreline. The wave shape is identical in all three; only the up/down position changes.</div></div>

<h2 class="l-title">8. The General Form: y = A sin(B(x − C)) + D</h2>

<p class="l-text">Combining all four transformations, every sinusoidal graph can be written</p>

<div class="calc-formula"><div class="formula-label">THE GENERAL SINUSOID</div><div class="formula-main">$$y = A\\,\\sin\\bigl(B(x - C)\\bigr) + D$$</div><div class="formula-sub">$|A|$ = amplitude, $\\dfrac{2\\pi}{|B|}$ = period, $C$ = phase shift (right), $D$ = vertical shift (centreline). The same formula with $\\cos$ in place of $\\sin$ works for cosinusoidal graphs.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Max value</div><div class="card-body">$D + |A|$. Reached when the sine inside equals $+1$, i.e. at $x = C + \\dfrac{\\pi}{2B}, C + \\dfrac{5\\pi}{2B}, \\ldots$</div></div>
<div class="calc-card"><div class="card-title">Min value</div><div class="card-body">$D - |A|$. Reached when the sine inside equals $-1$, i.e. at $x = C + \\dfrac{3\\pi}{2B}, C + \\dfrac{7\\pi}{2B}, \\ldots$</div></div>
<div class="calc-card"><div class="card-title">Midline crossings</div><div class="card-body">Where $y = D$. The first such crossing (going upward) is at $x = C$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — FULL TRANSFORMATION</div><div class="example-body"><strong>Sketch</strong> $y = 3\\sin\\!\\bigl(2(x - \\pi/4)\\bigr) + 1$.<br><br>Read off the four parameters: $A = 3$, $B = 2$, $C = \\pi/4$, $D = 1$.<br><br>• Amplitude $= 3$ → wave goes $3$ up and $3$ down from the centreline.<br>• Period $= 2\\pi / 2 = \\pi$ → one full cycle every $\\pi$ units.<br>• Phase shift $= \\pi/4$ right → the upward midline crossing is at $x = \\pi/4$.<br>• Vertical shift $= 1$ → centreline at $y = 1$.<br><br>So the wave oscillates between $1 - 3 = -2$ and $1 + 3 = 4$, with one cycle starting at $x = \\pi/4$ and ending at $x = \\pi/4 + \\pi = 5\\pi/4$.</div></div>

<div id="plot-l8-full-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y0=x.map(function(t){return Math.sin(t);});
var yf=x.map(function(t){return 3*Math.sin(2*(t-Math.PI/4))+1;});
var t1={x:x,y:y0,mode:"lines",name:"y = sin x  (base)",line:{color:"#94a3b8",width:1.6,dash:"dot"}};
var t2={x:x,y:yf,mode:"lines",name:"y = 3 sin(2(x - π/4)) + 1",line:{color:"#3b82f6",width:2.6}};
var mid={x:[-Math.PI,4*Math.PI],y:[1,1],mode:"lines",showlegend:false,line:{color:"#10b981",width:1,dash:"dash"}};
var ann=[{x:Math.PI/4,y:1,text:"start of cycle (x = π/4)",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#f59e0b",size:11}},{x:Math.PI/4+Math.PI/4,y:4,text:"max = 4",showarrow:true,arrowhead:2,ax:20,ay:-25,font:{color:"#10b981",size:11}},{x:Math.PI/4+3*Math.PI/4,y:-2,text:"min = -2",showarrow:true,arrowhead:2,ax:20,ay:25,font:{color:"#ef4444",size:11}}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI/4,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π/4","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-3.5,5]},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-full-en",[t1,t2,mid],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> $y = 3\\sin\\!\\bigl(2(x - \\pi/4)\\bigr) + 1$ with all four transformations applied. The grey dotted base $y = \\sin x$ has been (1) stretched vertically by $3$, (2) compressed horizontally by $2$, (3) shifted right by $\\pi/4$, and (4) lifted up by $1$. Centreline at $y = 1$ (green dashed); max $= 4$; min $= -2$; period $= \\pi$.</div></div>

<h2 class="l-title">9. Reciprocal Graphs — csc, sec, cot</h2>

<p class="l-text">The three reciprocal trig functions are</p>

<div class="calc-formula"><div class="formula-main">$$\\csc x = \\dfrac{1}{\\sin x}, \\qquad \\sec x = \\dfrac{1}{\\cos x}, \\qquad \\cot x = \\dfrac{1}{\\tan x} = \\dfrac{\\cos x}{\\sin x}$$</div></div>

<p class="l-text">Each of them has a <strong>vertical asymptote at every zero of its "parent" function</strong>: $\\csc x$ blows up wherever $\\sin x = 0$ (i.e. $x = k\\pi$), $\\sec x$ blows up wherever $\\cos x = 0$ (i.e. $x = \\pi/2 + k\\pi$), and $\\cot x$ blows up wherever $\\sin x = 0$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">y = csc x</div><div class="card-body">Asymptotes at $x = k\\pi$. Range $(-\\infty,-1] \\cup [1,\\infty)$. Period $2\\pi$. Each branch is a U or inverted-U sitting on top of (or hanging below) a $\\sin$ peak.</div></div>
<div class="calc-card"><div class="card-title">y = sec x</div><div class="card-body">Asymptotes at $x = \\pi/2 + k\\pi$. Range $(-\\infty,-1] \\cup [1,\\infty)$. Period $2\\pi$. Same Us, just shifted $\\pi/2$ — sec is to cos what csc is to sin.</div></div>
<div class="calc-card"><div class="card-title">y = cot x</div><div class="card-body">Asymptotes at $x = k\\pi$. Range $\\mathbb{R}$. Period $\\pi$. Decreasing on each branch (opposite of tan's increasing branches).</div></div>
</div>

<div id="plot-l8-csc-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var ys=x.map(function(t){return Math.sin(t);});
var traces=[{x:x,y:ys,mode:"lines",name:"y = sin x",line:{color:"#94a3b8",width:1.6,dash:"dot"}}];
for(var seg=-1;seg<=3;seg++){
  var xc=[];var yc=[];
  for(var i=2;i<=178;i++){
    var t=seg*Math.PI+i*Math.PI/180;
    var s=Math.sin(t);
    if(Math.abs(s)>0.05){xc.push(t);yc.push(1/s);}
  }
  traces.push({x:xc,y:yc,mode:"lines",name:seg===0?"y = csc x":"",showlegend:seg===0,line:{color:"#3b82f6",width:2.4}});
}
var asy=[];for(var k=-1;k<=4;k++){asy.push({x:[k*Math.PI,k*Math.PI],y:[-6,6],mode:"lines",showlegend:k===0,name:"asymptotes",line:{color:"#ef4444",width:1,dash:"dash"}});}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI],ticktext:["-π","0","π","2π","3π"],range:[-Math.PI,3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-6,6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-csc-en",traces.concat(asy),layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> $y = \\csc x$ (blue) with the parent $\\sin x$ shown dotted in grey. Wherever $\\sin x = 0$ the cosecant has a vertical asymptote (red dashed). The branches of csc cup the peaks and troughs of sin: a U sits on top of every sine maximum, an inverted-U hangs below every sine minimum.</div></div>

<div class="l-note"><strong>Drawing trick.</strong> To sketch $\\csc x$ quickly: first draw $\\sin x$ lightly; then put a vertical dashed asymptote through every zero; finally draw U-shapes sitting on the maxima ($\\sin = +1$) and hanging from the minima ($\\sin = -1$). The same trick works for $\\sec$ (using $\\cos$ as the guide).</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 — RECIPROCAL VALUES</div><div class="example-body"><strong>Evaluate</strong> $\\csc(\\pi/6)$, $\\sec(\\pi/3)$, and $\\cot(\\pi/4)$.<br><br>$\\csc(\\pi/6) = \\dfrac{1}{\\sin(\\pi/6)} = \\dfrac{1}{1/2} = \\mathbf{2}$.<br><br>$\\sec(\\pi/3) = \\dfrac{1}{\\cos(\\pi/3)} = \\dfrac{1}{1/2} = \\mathbf{2}$.<br><br>$\\cot(\\pi/4) = \\dfrac{\\cos(\\pi/4)}{\\sin(\\pi/4)} = \\dfrac{\\sqrt{2}/2}{\\sqrt{2}/2} = \\mathbf{1}$.<br><br>Reciprocals only exist where the denominator is non-zero. For example $\\csc(0)$ does <em>not</em> exist because $\\sin 0 = 0$; the graph has an asymptote there.</div></div>

<p class="l-text"><strong>Comparing the three pairs.</strong> Sine and cosecant share the same set of zeros for the parent, so they touch only at the points where $\\sin x = \\pm 1$ (the cosecant U-shapes just kiss the sine curve there). Cosine and secant behave the same way. Tangent and cotangent are reciprocals of each other, so $\\cot x = 1/\\tan x$ — wherever tangent passes through zero, cotangent has an asymptote, and vice versa.</p>

<h2 class="l-title">10. Practice Problems</h2>

<p class="l-text">Try each problem before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — READ THE EQUATION</div><div class="example-body">A sine graph has amplitude $2$, period $\\pi$, no phase shift, and centreline $y = -1$. Write its equation.<br><br><strong>Solution.</strong> $A = 2$, $B = 2\\pi/\\pi = 2$, $C = 0$, $D = -1$. So $y = 2\\sin(2x) - 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — PERIOD AND RANGE</div><div class="example-body">State the period, amplitude, and range of $y = -3\\cos\\!\\bigl(\\tfrac{x}{2}\\bigr) + 4$.<br><br><strong>Solution.</strong> Amplitude $= |-3| = 3$. Period $= 2\\pi / (1/2) = 4\\pi$. Centreline $y = 4$. Range $[4 - 3,\\ 4 + 3] = [1,\\ 7]$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — FACTOR FIRST</div><div class="example-body">Find the amplitude, period, and phase shift of $y = 4\\sin(3x + \\pi) - 2$.<br><br><strong>Solution.</strong> Inside the bracket: $3x + \\pi = 3(x + \\pi/3) = 3\\bigl(x - (-\\pi/3)\\bigr)$. So $A = 4$, $B = 3$, $C = -\\pi/3$ (shift <em>left</em> by $\\pi/3$), $D = -2$. Period $= 2\\pi/3$. Range $[-6,\\ 2]$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — TANGENT ASYMPTOTES</div><div class="example-body">Where are the vertical asymptotes of $y = \\tan\\!\\bigl(\\pi(x - 1)\\bigr)$?<br><br><strong>Solution.</strong> Asymptotes occur where the argument equals $\\pi/2 + k\\pi$: $\\pi(x - 1) = \\pi/2 + k\\pi$, so $x - 1 = 1/2 + k$, giving $x = 3/2 + k$ for every integer $k$. Period is $\\pi/\\pi = 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — GRAPH TO EQUATION</div><div class="example-body">A cosine wave starts at maximum $y = 5$ when $x = 0$, oscillates down to a minimum of $y = -1$, has period $6$, and no horizontal shift. Write its equation.<br><br><strong>Solution.</strong> Centreline midway between $5$ and $-1$: $D = (5 + (-1))/2 = 2$. Amplitude is the distance from centreline to max: $A = 5 - 2 = 3$. From period $= 2\\pi/B = 6$ we get $B = \\pi/3$. $C = 0$. So $y = 3\\cos\\!\\bigl((\\pi/3)x\\bigr) + 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — WHICH IS WHICH</div><div class="example-body">Without graphing, decide which has the larger amplitude and which has the longer period: $f(x) = 2\\sin(4x)$ versus $g(x) = 5\\sin(x/2)$.<br><br><strong>Solution.</strong> Amplitudes: $|f|=2$, $|g|=5$ → $g$ has the larger amplitude. Periods: $T_f = 2\\pi/4 = \\pi/2$, $T_g = 2\\pi/(1/2) = 4\\pi$ → $g$ also has the longer period (eight times longer than $f$).</div></div>

<div class="l-note"><strong>Summary.</strong> For any sinusoid $y = A\\sin\\bigl(B(x - C)\\bigr) + D$: identify $A, B, C, D$, then read off amplitude $|A|$, period $2\\pi/|B|$, phase shift $C$ (right if positive), and centreline $y = D$. For tangents, replace "period $2\\pi/|B|$" with "$\\pi/|B|$" and add asymptotes wherever the argument equals $\\pi/2 + k\\pi$.</div>
`,

tr: `
<p class="l-text"><strong>Trigonometrik fonksiyonlar dalgaların matematiğidir.</strong> Ses, ışık, titreşim, alternatif akım, sarkacın salınımı, gezegenlerin yörüngesi — düzenli aralıklarla aynı duruma dönen her olay sinüs ve kosinüslerin bir bileşkesiyle anlatılır. Bu derste üç temel grafiği — $y = \\sin x$, $y = \\cos x$, $y = \\tan x$ — çizeceğiz ve sonra dört dönüşümle bu grafikleri istediğimiz şekle sokmayı öğreneceğiz: genlik $A$, periyot katsayısı $B$, faz kaydırma $C$ ve dikey kaydırma $D$.</p>

<p class="l-text">Ders sonunda $y = A\\sin\\bigl(B(x - C)\\bigr) + D$ biçiminde verilen herhangi bir denklemin grafiğini gözünde canlandırabileceksin — yüksekliği, genişliği, konumu ve orta çizgisini. Tersini de yapabileceksin: bir grafiğe bakıp denklemini yazabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(184,169,212,0.06);border-left:3px solid #b8a9d4;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#b8a9d4;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$y = \\sin x$, $y = \\cos x$ ve $y = \\tan x$ grafiklerini birim çemberden doğrudan okumak</li>
<li>Her temel grafiğin periyot, genlik, görüntü kümesi, tanım kümesi ve sıfırlarını tanımak</li>
<li>$A$, $B$, $C$, $D$ katsayılarının grafiği nasıl dönüştürdüğünü önceden kestirmek</li>
<li>$y = A\\sin\\bigl(B(x - C)\\bigr) + D$ biçimindeki denklemden grafiği çizebilmek</li>
<li>Etiketli bir grafikten denklemi geri okuyabilmek (ters problem)</li>
<li>$y = \\csc x$, $y = \\sec x$ ve $y = \\cot x$ resiprokal grafiklerini asimptotlarıyla birlikte çizmek</li>
</ul>
</div>

<h2 class="l-title">1. y = sin x Grafiği</h2>

<div class="calc-highlight"><strong>Günlük bir görüntü:</strong> Birim çemberin etrafında sabit hızla dönen bir nokta hayal et. Dönerken bu noktanın yatay eksene göre <em>yüksekliği</em> önce yükselir, sonra düşer. Bu yüksekliği dönme açısına karşı çizersen sinüs eğrisini elde edersin — yumuşak, sonsuza dek tekrarlanan bir dalga.</div>

<p class="l-text">1. Dersten hatırla: birim çember üzerinde $x$ açısındaki nokta $P$ ise, $P = (\\cos x,\\ \\sin x)$. Yani $\\sin x$ noktanın <strong>$y$-koordinatıdır</strong>. $x$ değeri $0$'dan $2\\pi$'ye giderken $P$ çemberin etrafında bir tur atar; $y$-koordinatı bir tam çevrim çizer: $1$'e kadar yükselir, $0$'a iner, $-1$'e düşer, tekrar $0$'a çıkar — ve bu örüntü sonsuza dek tekrar eder.</p>

<div class="calc-formula"><div class="formula-label">y = sin x'in TEMEL ÖZELLİKLERİ</div><div class="formula-main">$$\\text{Tanım kümesi: } \\mathbb{R}, \\quad \\text{Görüntü: } [-1, 1], \\quad \\text{Periyot: } 2\\pi$$</div><div class="formula-sub">Sıfırlar: $x = k\\pi$; maksimumlar: $x = \\pi/2 + 2k\\pi$ (değer $+1$); minimumlar: $x = -\\pi/2 + 2k\\pi$ (değer $-1$). Tek fonksiyon: $\\sin(-x) = -\\sin x$.</div></div>

<div id="plot-l8-sin-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];var y=[];for(var i=-720;i<=720;i++){var t=i*Math.PI/180;x.push(t);y.push(Math.sin(t));}
var tr={x:x,y:y,mode:"lines",name:"y = sin x",line:{color:"#3b82f6",width:2.6}};
var pts={x:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],y:[0,1,0,-1,0],mode:"markers+text",text:["(0,0)","(π/2,1)","(π,0)","(3π/2,-1)","(2π,0)"],textposition:"top center",textfont:{color:"#ebe6dc",size:10},marker:{size:8,color:"#f59e0b"},name:"kilit noktalar"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x (radyan)",tickvals:[-2*Math.PI,-Math.PI,0,Math.PI,2*Math.PI,4*Math.PI],ticktext:["-2π","-π","0","π","2π","4π"],range:[-2*Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-l8-sin-tr",[tr,pts],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $y = \\sin x$'in $0$'dan $2\\pi$'ye bir tam dalgası, birkaç çevrim boyunca uzatılmış. Eğri orijinden başlar, $\\pi/2$'de $+1$ maksimumuna çıkar, $\\pi$'de tekrar $0$'a iner, $3\\pi/2$'de $-1$ minimumuna düşer ve $2\\pi$'de tekrar $0$'a döner. Aynı örüntü sağa ve sola her $2\\pi$ birimde tekrar eder.</div></div>

<p class="l-text"><strong>Sinüs neden "tek" fonksiyondur:</strong> birim çemberi $x$-ekseninden yansıttığında $x$ açısındaki nokta $-x$ açısına gider ve $y$-koordinatı işaret değiştirir. Bu yüzden $\\sin(-x) = -\\sin x$ olur — grafik orijine göre nokta simetriktir.</p>

<h2 class="l-title">2. y = cos x Grafiği</h2>

<p class="l-text">Kosinüs birim çember noktasının <strong>$x$-koordinatıdır</strong>. Nokta çember etrafında dönerken $x$-koordinatı $+1$'den ($x=0$ iken) başlar, $\\pi/2$'de $0$'a düşer, $\\pi$'de $-1$'e iner, $3\\pi/2$'de tekrar $0$'a yükselir ve $2\\pi$'de yeniden $+1$ olur. Yani $\\cos x$ tam olarak $\\sin x$ ile aynı dalga şeklini çizer — sadece tepeden başlar, sıfırdan değil.</p>

<div class="calc-formula"><div class="formula-label">SİNÜS VE KOSİNÜS BİRBİRİNİN KAYDIRILMIŞ HALİDİR</div><div class="formula-main">$$\\cos x = \\sin\\!\\left(x + \\dfrac{\\pi}{2}\\right)$$</div><div class="formula-sub">Kosinüs eğrisi, sinüs eğrisinin $\\pi/2$ birim <strong>sola</strong> ötelenmiş halidir. Eşdeğer olarak $\\sin x = \\cos\\!\\left(x - \\pi/2\\right)$.</div></div>

<div class="calc-formula"><div class="formula-label">y = cos x'in TEMEL ÖZELLİKLERİ</div><div class="formula-main">$$\\text{Tanım kümesi: } \\mathbb{R}, \\quad \\text{Görüntü: } [-1, 1], \\quad \\text{Periyot: } 2\\pi$$</div><div class="formula-sub">Sıfırlar: $x = \\pi/2 + k\\pi$; maksimumlar: $x = 2k\\pi$; minimumlar: $x = \\pi + 2k\\pi$. Çift fonksiyon: $\\cos(-x) = \\cos x$ (grafik $y$-eksenine göre simetriktir).</div></div>

<div id="plot-l8-cos-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];var ys=[];var yc=[];for(var i=-720;i<=720;i++){var t=i*Math.PI/180;x.push(t);ys.push(Math.sin(t));yc.push(Math.cos(t));}
var trS={x:x,y:ys,mode:"lines",name:"y = sin x",line:{color:"#94a3b8",width:1.8,dash:"dot"}};
var trC={x:x,y:yc,mode:"lines",name:"y = cos x",line:{color:"#3b82f6",width:2.6}};
var pts={x:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],y:[1,0,-1,0,1],mode:"markers+text",text:["(0,1)","(π/2,0)","(π,-1)","(3π/2,0)","(2π,1)"],textposition:"top center",textfont:{color:"#ebe6dc",size:10},marker:{size:8,color:"#f59e0b"},name:"cos kilit noktaları"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x (radyan)",tickvals:[-2*Math.PI,-Math.PI,0,Math.PI,2*Math.PI,4*Math.PI],ticktext:["-2π","-π","0","π","2π","4π"],range:[-2*Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-l8-cos-tr",[trS,trC,pts],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $y = \\cos x$ düz mavi, aynı dalga şekline sahip $y = \\sin x$ ise noktalı gri — $\\pi/2$ kadar sola ötelenmiş. Kosinüs $y$-ekseninde maksimuma sahip ve o eksene göre simetriktir (çift fonksiyon).</div></div>

<h2 class="l-title">3. y = tan x Grafiği</h2>

<p class="l-text">Tanım gereği $\\tan x = \\dfrac{\\sin x}{\\cos x}$. $\\cos x = 0$ olduğu her yerde tanjant <strong>tanımsızdır</strong> — grafik orada <em>düşey asimptota</em> sahiptir. Bu, her $k$ tam sayısı için $x = \\pi/2 + k\\pi$ noktalarında gerçekleşir.</p>

<p class="l-text">İki ardışık asimptot arasında tanjant $-\\infty$'dan $+\\infty$'a sürekli tırmanır ve $\\sin x = 0$ olduğu yerden geçer. Yani $y = \\tan x$ grafiği, her biri iki düşey asimptot arasına sıkışmış sonsuz sayıda aynı "S biçimli" daldan oluşur.</p>

<div class="calc-formula"><div class="formula-label">y = tan x'in TEMEL ÖZELLİKLERİ</div><div class="formula-main">$$\\text{Tanım kümesi: } x \\neq \\dfrac{\\pi}{2} + k\\pi, \\quad \\text{Görüntü: } \\mathbb{R}, \\quad \\text{Periyot: } \\pi$$</div><div class="formula-sub">Dikkat: periyot $\\pi$'dir ($2\\pi$ değil). Sıfırlar: $x = k\\pi$; düşey asimptotlar: $x = \\pi/2 + k\\pi$. Tek fonksiyon: $\\tan(-x) = -\\tan x$.</div></div>

<div id="plot-l8-tan-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];var asy=[];
for(var seg=-3;seg<=3;seg++){
  var x=[];var y=[];
  for(var i=-44;i<=44;i++){
    var t=seg*Math.PI+i*(Math.PI/2-0.05)/45;
    x.push(t);y.push(Math.tan(t));
  }
  traces.push({x:x,y:y,mode:"lines",name:seg===0?"y = tan x":"",showlegend:seg===0,line:{color:"#3b82f6",width:2.6}});
  asy.push({x:[seg*Math.PI+Math.PI/2,seg*Math.PI+Math.PI/2],y:[-6,6],mode:"lines",showlegend:seg===0,name:"asimptotlar",line:{color:"#ef4444",width:1.2,dash:"dash"}});
}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x (radyan)",tickvals:[-2*Math.PI,-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI],ticktext:["-2π","-π","0","π","2π","3π"],range:[-2*Math.PI,3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-6,6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-l8-tan-tr",traces.concat(asy),layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $y = \\tan x$'in mavi beş dalı, kırmızı kesik çizgilerle çizilmiş düşey asimptotlarla ayrılmış: $x = -\\frac{3\\pi}{2}, -\\frac{\\pi}{2}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}$. Her dal $\\pi$ uzunluğundaki bir periyot boyunca $-\\infty$'dan $+\\infty$'a yükselir.</div></div>

<div class="l-note"><strong>Neden tanjantın periyodu $2\\pi$ değil de $\\pi$?</strong> Çünkü birim çember noktasını orijinden geçirip çevirmek (açıya $\\pi$ eklemek) <em>iki</em> koordinatın da işaretini değiştirir: $\\sin(x+\\pi) = -\\sin x$ ve $\\cos(x+\\pi) = -\\cos x$. Böylece $\\tan(x+\\pi) = \\dfrac{-\\sin x}{-\\cos x} = \\tan x$ — fonksiyon sadece yarım çember sonrasında aynı değere döner.</div>

<h2 class="l-title">4. Genlik — y = A sin x</h2>

<p class="l-text">İlk dönüşüm bir dikey germe. Fonksiyonu sabit bir $A$ ile çarpmak dalgayı dikey olarak $|A|$ katı genişletir:</p>

<div class="calc-formula"><div class="formula-label">GENLİK</div><div class="formula-main">$$y = A \\sin x \\quad\\implies\\quad \\text{Genlik} = |A|, \\quad \\text{Görüntü} = [-|A|,\\ +|A|]$$</div><div class="formula-sub">Genlik her zaman negatif olmayan bir sayıdır. Periyot $2\\pi$ olarak kalır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A &gt; 1</div><div class="card-body">Dikey gerilme. Dalga daha yüksek çıkar ve daha derin iner. Örnek: $y = 3\\sin x$ görüntüsü $[-3, 3]$.</div></div>
<div class="calc-card"><div class="card-title">0 &lt; A &lt; 1</div><div class="card-body">Dikey sıkışma. Dalga düzleşir. Örnek: $y = 0.5\\sin x$ görüntüsü $[-0.5, 0.5]$.</div></div>
<div class="calc-card"><div class="card-title">A &lt; 0</div><div class="card-body">Dikey gerilme <em>ve</em> $x$-eksenine göre yansıma. Dalga ters çevrilir. Örnek: $y = -2\\sin x$ önce aşağı doğru iner.</div></div>
</div>

<div id="plot-l8-amp-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return 2*Math.sin(t);});
var y3=x.map(function(t){return 0.5*Math.sin(t);});
var y4=x.map(function(t){return -1.5*Math.sin(t);});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (A=1)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = 2 sin x  (A=2)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = 0.5 sin x  (A=0.5)",line:{color:"#f59e0b",width:2}};
var t4={x:x,y:y4,mode:"lines",name:"y = -1.5 sin x  (A=-1.5)",line:{color:"#ef4444",width:2,dash:"dash"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-2.5,2.5]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-amp-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $A = 1, 2, 0.5, -1.5$ genlikli dört sinüs dalgası. $A = -1.5$ olanın (kırmızı kesikli) $1.5\\sin x$'in aynalanmış hali olduğuna dikkat et. <em>Şekil</em> dört durumda da aynıdır; sadece dikey ölçek değişir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 1</div><div class="example-body"><strong>$y = -4\\sin x$ fonksiyonunun genliği ve görüntü kümesi nedir?</strong><br><br>Genlik $= |-4| = \\mathbf{4}$. Görüntü $= [-4,\\ 4]$. Negatif işaret grafiği $x$-eksenine göre yansıtır ama genliği değiştirmez. $x = \\pi/2$'de değer $-4$ olur ($+4$ değil); $x = 3\\pi/2$'de değer $+4$ olur.</div></div>

<h2 class="l-title">5. Periyot Değişimi — y = sin(Bx)</h2>

<p class="l-text">İkinci dönüşüm bir yatay sıkıştırma. Girdiyi $B$ ile çarpmak dalgayı yatay olarak $|B|$ katı sıkıştırır:</p>

<div class="calc-formula"><div class="formula-label">PERİYOT FORMÜLÜ</div><div class="formula-main">$$y = \\sin(Bx) \\quad\\implies\\quad \\text{Periyot} = \\dfrac{2\\pi}{|B|}$$</div><div class="formula-sub">$y = \\cos(Bx)$'in periyodu da $2\\pi/|B|$'dir. $y = \\tan(Bx)$'in periyodu ise $\\pi/|B|$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">B &gt; 1</div><div class="card-body">Yatay sıkışma. Aynı aralığa daha fazla çevrim sığar. Örnek: $y = \\sin 2x$'in periyodu $\\pi$ — $[0, 2\\pi]$'de iki çevrim.</div></div>
<div class="calc-card"><div class="card-title">0 &lt; B &lt; 1</div><div class="card-body">Yatay gerilme. Dalga uzar. Örnek: $y = \\sin(x/2)$'nin periyodu $4\\pi$ — $[0, 2\\pi]$'de yarım çevrim.</div></div>
<div class="calc-card"><div class="card-title">B &lt; 0</div><div class="card-body">$y$-eksenine göre yansıma. Sinüs tek olduğu için $\\sin(-Bx) = -\\sin(Bx)$, yani negatif $B$ ile $A$ işaretini değiştirmek aynı etkiyi yapar.</div></div>
</div>

<div id="plot-l8-period-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return Math.sin(2*t);});
var y3=x.map(function(t){return Math.sin(0.5*t);});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (B=1, periyot 2π)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = sin 2x  (B=2, periyot π)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = sin(x/2)  (B=0.5, periyot 4π)",line:{color:"#f59e0b",width:2}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-period-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $B = 1, 2, 0.5$ değerleriyle üç sinüs dalgası. Mavi temel eğrinin periyodu $2\\pi$. Yeşil frekansı ikiye katlar (periyot $\\pi$'ye iner). Turuncu frekansı yarıya indirir (periyot $4\\pi$'ye çıkar). Üçü de aynı $1$ maksimum yüksekliğine ulaşır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2</div><div class="example-body"><strong>$y = \\cos(3x)$ ve $y = \\tan(\\pi x)$ fonksiyonlarının periyotları nedir?</strong><br><br>$y = \\cos(3x)$ için: Periyot $= \\dfrac{2\\pi}{3} \\approx 2.09$. Temel kosinüsün bir çevrim yaptığı sürede grafik üç tam çevrim tamamlar.<br><br>$y = \\tan(\\pi x)$ için: Tanjantın temel periyodu $\\pi$, dolayısıyla yeni periyot $\\dfrac{\\pi}{\\pi} = \\mathbf{1}$. Asimptotlar $x = \\tfrac{1}{2} + k$ noktalarında.</div></div>

<h2 class="l-title">6. Faz Kaydırma — y = sin(B(x − C))</h2>

<p class="l-text">$x$ yerine $x - C$ koymak grafiği yatay olarak $C$ birim kaydırır. <strong>Pozitif $C$ sağa, negatif $C$ sola.</strong> $C$ sayısına <em>faz kaydırması</em> denir.</p>

<div class="calc-formula"><div class="formula-label">FAZ KAYDIRMASI</div><div class="formula-main">$$y = \\sin\\bigl(B(x - C)\\bigr) \\quad\\implies\\quad \\text{Faz kaydırma} = C \\text{ (sağa)}$$</div><div class="formula-sub">Sık yapılan hata: parantezin içi $B(x - C)$ olmalıdır, $Bx - C$ değil. $\\sin(2x - \\pi)$ görürsen önce $2$'yi dışarı al: $\\sin\\!\\bigl(2(x - \\pi/2)\\bigr)$ — faz kaydırma $\\pi/2$, $\\pi$ değil.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">B'yi parantezden çık</div><div class="step-detail">Girdiyi $B(x - C)$ biçiminde yaz. $x$'ten çıkarılan sayı (çıkardıktan sonra) faz kaydırma $C$'dir.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Yönü oku</div><div class="step-detail">$x - C$ ile $C > 0$ ise grafik $C$ kadar sağa kayar. $x + C$ (yani $x - (-C)$) $C$ kadar sola kayar.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Periyotla birleştir</div><div class="step-detail">Kayma sonrası dalganın bir çevrimi $x = C$'de başlar ve $x = C + \\dfrac{2\\pi}{B}$'de biter.</div></div></div>
</div>

<div id="plot-l8-phase-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return Math.sin(t-Math.PI/2);});
var y3=x.map(function(t){return Math.sin(t+Math.PI/4);});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (C=0)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = sin(x - π/2)  (sağa π/2)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = sin(x + π/4)  (sola π/4)",line:{color:"#f59e0b",width:2}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI/2,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π/2","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-phase-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> Temel sinüs (mavi), $\\pi/2$ kadar <em>sağa</em> kaydırılmış sinüs (yeşil — bu $-\\cos x$'e özdeş görünür) ve $\\pi/4$ kadar <em>sola</em> kaydırılmış sinüs (turuncu). Şekil aynı; sadece başlangıç konumu değişir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — DIŞARI ALMA TUZAĞI</div><div class="example-body"><strong>$y = \\sin(2x - \\pi)$'nin faz kaydırmasını bul.</strong><br><br>Parantez içi $2x - \\pi$. $\\pi$'yi <strong>doğrudan</strong> faz kaydırması olarak okumak yanlış. Önce $2$'yi dışarı al:<br><br>$2x - \\pi = 2\\!\\left(x - \\dfrac{\\pi}{2}\\right)$<br><br>Yani $y = \\sin\\!\\bigl(2(x - \\pi/2)\\bigr)$. Faz kaydırma $= \\pi/2$ (sağa). Periyot $= 2\\pi/2 = \\pi$.</div></div>

<h2 class="l-title">7. Dikey Kaydırma — y = sin x + D</h2>

<p class="l-text">Tüm fonksiyona bir $D$ sabiti eklemek grafiği dikey olarak kaydırır. Dalga şekli değişmez ama orta çizgi $y = 0$'dan $y = D$'ye taşınır.</p>

<div class="calc-formula"><div class="formula-label">DİKEY KAYDIRMA</div><div class="formula-main">$$y = \\sin x + D \\quad\\implies\\quad \\text{Orta çizgi: } y = D, \\quad \\text{Görüntü: } [D - 1,\\ D + 1]$$</div><div class="formula-sub">$D > 0$ yukarı, $D < 0$ aşağı kaydırır. Orta çizgi (max ile min arasındaki tam orta) tam olarak $y = D$'dir.</div></div>

<div id="plot-l8-vert-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y1=x.map(function(t){return Math.sin(t);});
var y2=x.map(function(t){return Math.sin(t)+2;});
var y3=x.map(function(t){return Math.sin(t)-1;});
var t1={x:x,y:y1,mode:"lines",name:"y = sin x  (D=0)",line:{color:"#3b82f6",width:2}};
var t2={x:x,y:y2,mode:"lines",name:"y = sin x + 2  (D=+2)",line:{color:"#10b981",width:2}};
var t3={x:x,y:y3,mode:"lines",name:"y = sin x - 1  (D=-1)",line:{color:"#f59e0b",width:2}};
var midlines=[{x:[-Math.PI,4*Math.PI],y:[0,0],mode:"lines",showlegend:false,line:{color:"#3b82f6",width:0.8,dash:"dot"}},{x:[-Math.PI,4*Math.PI],y:[2,2],mode:"lines",showlegend:false,line:{color:"#10b981",width:0.8,dash:"dot"}},{x:[-Math.PI,4*Math.PI],y:[-1,-1],mode:"lines",showlegend:false,line:{color:"#f59e0b",width:0.8,dash:"dot"}}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-2.5,3.5]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-vert-tr",[t1,t2,t3].concat(midlines),layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $D = 0, +2, -1$ dikey kaydırmalarıyla üç sinüs dalgası. Noktalı çizgiler her dalganın orta çizgisini işaretler. Şekil hepsinde aynıdır; sadece yukarı/aşağı konumu değişir.</div></div>

<h2 class="l-title">8. Genel Form: y = A sin(B(x − C)) + D</h2>

<p class="l-text">Dört dönüşümün tümünü birleştirince her sinüsoidal grafik şöyle yazılabilir:</p>

<div class="calc-formula"><div class="formula-label">GENEL SİNÜSOİD</div><div class="formula-main">$$y = A\\,\\sin\\bigl(B(x - C)\\bigr) + D$$</div><div class="formula-sub">$|A|$ = genlik, $\\dfrac{2\\pi}{|B|}$ = periyot, $C$ = faz kaydırma (sağa), $D$ = dikey kaydırma (orta çizgi). Aynı formül $\\sin$ yerine $\\cos$ konunca kosinüsoidal grafikler için de geçerlidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maksimum değer</div><div class="card-body">$D + |A|$. Parantez içindeki sinüs $+1$ olduğunda yakalanır, yani $x = C + \\dfrac{\\pi}{2B}, C + \\dfrac{5\\pi}{2B}, \\ldots$</div></div>
<div class="calc-card"><div class="card-title">Minimum değer</div><div class="card-body">$D - |A|$. Parantez içindeki sinüs $-1$ olduğunda yakalanır, yani $x = C + \\dfrac{3\\pi}{2B}, C + \\dfrac{7\\pi}{2B}, \\ldots$</div></div>
<div class="calc-card"><div class="card-title">Orta çizgi kesişimleri</div><div class="card-body">$y = D$ olduğu yerler. İlk yukarı doğru kesişim $x = C$'dedir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — TAM DÖNÜŞÜM</div><div class="example-body"><strong>$y = 3\\sin\\!\\bigl(2(x - \\pi/4)\\bigr) + 1$ grafiğini çiz.</strong><br><br>Dört parametreyi oku: $A = 3$, $B = 2$, $C = \\pi/4$, $D = 1$.<br><br>• Genlik $= 3$ → orta çizgiden $3$ yukarı ve $3$ aşağı.<br>• Periyot $= 2\\pi / 2 = \\pi$ → her $\\pi$ birimde bir tam çevrim.<br>• Faz kaydırma $= \\pi/4$ sağa → ilk yukarı orta-çizgi kesişimi $x = \\pi/4$'te.<br>• Dikey kaydırma $= 1$ → orta çizgi $y = 1$'de.<br><br>Yani dalga $1 - 3 = -2$ ile $1 + 3 = 4$ arasında salınır; bir çevrim $x = \\pi/4$'te başlar ve $x = \\pi/4 + \\pi = 5\\pi/4$'te biter.</div></div>

<div id="plot-l8-full-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var y0=x.map(function(t){return Math.sin(t);});
var yf=x.map(function(t){return 3*Math.sin(2*(t-Math.PI/4))+1;});
var t1={x:x,y:y0,mode:"lines",name:"y = sin x  (temel)",line:{color:"#94a3b8",width:1.6,dash:"dot"}};
var t2={x:x,y:yf,mode:"lines",name:"y = 3 sin(2(x - π/4)) + 1",line:{color:"#3b82f6",width:2.6}};
var mid={x:[-Math.PI,4*Math.PI],y:[1,1],mode:"lines",showlegend:false,line:{color:"#10b981",width:1,dash:"dash"}};
var ann=[{x:Math.PI/4,y:1,text:"çevrim başlangıcı (x = π/4)",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#f59e0b",size:11}},{x:Math.PI/4+Math.PI/4,y:4,text:"maks = 4",showarrow:true,arrowhead:2,ax:20,ay:-25,font:{color:"#10b981",size:11}},{x:Math.PI/4+3*Math.PI/4,y:-2,text:"min = -2",showarrow:true,arrowhead:2,ax:20,ay:25,font:{color:"#ef4444",size:11}}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI/4,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI],ticktext:["-π","0","π/4","π","2π","3π","4π"],range:[-Math.PI,4*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-3.5,5]},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-full-tr",[t1,t2,mid],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $y = 3\\sin\\!\\bigl(2(x - \\pi/4)\\bigr) + 1$ — dört dönüşüm birlikte uygulanmış. Gri noktalı temel $y = \\sin x$ (1) dikey olarak $3$ kat gerilmiş, (2) yatay olarak $2$ kat sıkıştırılmış, (3) sağa $\\pi/4$ kaydırılmış ve (4) yukarı $1$ taşınmış. Orta çizgi $y = 1$ (yeşil kesikli); maks $= 4$; min $= -2$; periyot $= \\pi$.</div></div>

<h2 class="l-title">9. Resiprokal Grafikler — csc, sec, cot</h2>

<p class="l-text">Üç resiprokal trig fonksiyonu şöyle:</p>

<div class="calc-formula"><div class="formula-main">$$\\csc x = \\dfrac{1}{\\sin x}, \\qquad \\sec x = \\dfrac{1}{\\cos x}, \\qquad \\cot x = \\dfrac{1}{\\tan x} = \\dfrac{\\cos x}{\\sin x}$$</div></div>

<p class="l-text">Her birinin "ana" fonksiyonunun <strong>her sıfırında bir düşey asimptotu</strong> vardır: $\\csc x$, $\\sin x = 0$ olan her yerde patlar ($x = k\\pi$); $\\sec x$, $\\cos x = 0$ olan her yerde patlar ($x = \\pi/2 + k\\pi$); $\\cot x$ ise $\\sin x = 0$ olan her yerde patlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">y = csc x</div><div class="card-body">Asimptotlar: $x = k\\pi$. Görüntü $(-\\infty,-1] \\cup [1,\\infty)$. Periyot $2\\pi$. Her dal bir U veya ters U; sinüs tepesinin üstüne oturur veya çukurunun altına sarkar.</div></div>
<div class="calc-card"><div class="card-title">y = sec x</div><div class="card-body">Asimptotlar: $x = \\pi/2 + k\\pi$. Görüntü $(-\\infty,-1] \\cup [1,\\infty)$. Periyot $2\\pi$. Aynı U'lar, sadece $\\pi/2$ kaydırılmış — sec, kosinüse csc'nin sinüse olduğu şeydir.</div></div>
<div class="calc-card"><div class="card-title">y = cot x</div><div class="card-body">Asimptotlar: $x = k\\pi$. Görüntü $\\mathbb{R}$. Periyot $\\pi$. Her dalda azalandır (tanjantın artan dallarının tersi).</div></div>
</div>

<div id="plot-l8-csc-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];for(var i=-360;i<=720;i++)x.push(i*Math.PI/180);
var ys=x.map(function(t){return Math.sin(t);});
var traces=[{x:x,y:ys,mode:"lines",name:"y = sin x",line:{color:"#94a3b8",width:1.6,dash:"dot"}}];
for(var seg=-1;seg<=3;seg++){
  var xc=[];var yc=[];
  for(var i=2;i<=178;i++){
    var t=seg*Math.PI+i*Math.PI/180;
    var s=Math.sin(t);
    if(Math.abs(s)>0.05){xc.push(t);yc.push(1/s);}
  }
  traces.push({x:xc,y:yc,mode:"lines",name:seg===0?"y = csc x":"",showlegend:seg===0,line:{color:"#3b82f6",width:2.4}});
}
var asy=[];for(var k=-1;k<=4;k++){asy.push({x:[k*Math.PI,k*Math.PI],y:[-6,6],mode:"lines",showlegend:k===0,name:"asimptotlar",line:{color:"#ef4444",width:1,dash:"dash"}});}
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"x",tickvals:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI],ticktext:["-π","0","π","2π","3π"],range:[-Math.PI,3*Math.PI]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"y",range:[-6,6]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.20}};
Plotly.newPlot("plot-l8-csc-tr",traces.concat(asy),layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> $y = \\csc x$ (mavi), ana fonksiyon $\\sin x$ ise noktalı gri olarak gösterilmiş. $\\sin x = 0$ olan her yerde kosekantın bir düşey asimptotu var (kırmızı kesikli). csc'nin dalları sinüs tepe ve çukurlarını sarar: her sinüs maksimumunun üstüne bir U oturur, her sinüs minimumundan ters U sarkar.</div></div>

<div class="l-note"><strong>Çizim püf noktası.</strong> $\\csc x$'i hızla çizmek için: önce $\\sin x$'i hafifçe çiz; sonra her sıfırından geçen düşey kesik asimptot çiz; en son maksimumlara ($\\sin = +1$) oturan ve minimumlara ($\\sin = -1$) sarkan U'ları çiz. Aynı yöntem $\\sec$ için de geçerli ($\\cos$ rehberliğinde).</div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — RESİPROKAL DEĞERLER</div><div class="example-body"><strong>$\\csc(\\pi/6)$, $\\sec(\\pi/3)$ ve $\\cot(\\pi/4)$ değerlerini hesapla.</strong><br><br>$\\csc(\\pi/6) = \\dfrac{1}{\\sin(\\pi/6)} = \\dfrac{1}{1/2} = \\mathbf{2}$.<br><br>$\\sec(\\pi/3) = \\dfrac{1}{\\cos(\\pi/3)} = \\dfrac{1}{1/2} = \\mathbf{2}$.<br><br>$\\cot(\\pi/4) = \\dfrac{\\cos(\\pi/4)}{\\sin(\\pi/4)} = \\dfrac{\\sqrt{2}/2}{\\sqrt{2}/2} = \\mathbf{1}$.<br><br>Resiprokaller yalnızca payda sıfır olmadığı yerde tanımlıdır. Örnek: $\\csc(0)$ tanımsızdır çünkü $\\sin 0 = 0$ — grafik orada asimptota sahiptir.</div></div>

<p class="l-text"><strong>Üç çiftin karşılaştırılması.</strong> Sinüs ve kosekant aynı sıfır kümesine sahiptir, bu yüzden yalnızca $\\sin x = \\pm 1$ noktalarında (kosekant U'larının sinüs eğrisine değdiği yerlerde) buluşurlar. Kosinüs ve sekant da aynı şekildedir. Tanjant ve kotanjant birbirinin resiprokalı olduğu için $\\cot x = 1/\\tan x$ — tanjantın sıfırdan geçtiği her yerde kotanjantın asimptotu, tersi de geçerlidir.</p>

<h2 class="l-title">10. Alıştırmalar</h2>

<p class="l-text">Her problemi çözümü okumadan önce kendin yapmaya çalış.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — DENKLEMİ OKU</div><div class="example-body">Bir sinüs grafiğinin genliği $2$, periyodu $\\pi$, faz kaydırması yok ve orta çizgisi $y = -1$. Denklemini yaz.<br><br><strong>Çözüm.</strong> $A = 2$, $B = 2\\pi/\\pi = 2$, $C = 0$, $D = -1$. Yani $y = 2\\sin(2x) - 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — PERİYOT VE GÖRÜNTÜ</div><div class="example-body">$y = -3\\cos\\!\\bigl(\\tfrac{x}{2}\\bigr) + 4$ fonksiyonunun periyodunu, genliğini ve görüntü kümesini söyle.<br><br><strong>Çözüm.</strong> Genlik $= |-3| = 3$. Periyot $= 2\\pi / (1/2) = 4\\pi$. Orta çizgi $y = 4$. Görüntü $[4 - 3,\\ 4 + 3] = [1,\\ 7]$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — ÖNCE PARANTEZE AL</div><div class="example-body">$y = 4\\sin(3x + \\pi) - 2$ fonksiyonunun genlik, periyot ve faz kaydırmasını bul.<br><br><strong>Çözüm.</strong> Parantez içi: $3x + \\pi = 3(x + \\pi/3) = 3\\bigl(x - (-\\pi/3)\\bigr)$. Yani $A = 4$, $B = 3$, $C = -\\pi/3$ (sola $\\pi/3$ kayma), $D = -2$. Periyot $= 2\\pi/3$. Görüntü $[-6,\\ 2]$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — TANJANT ASİMPTOTLARI</div><div class="example-body">$y = \\tan\\!\\bigl(\\pi(x - 1)\\bigr)$ fonksiyonunun düşey asimptotları nerede?<br><br><strong>Çözüm.</strong> Asimptotlar argümanın $\\pi/2 + k\\pi$ olduğu yerlerde: $\\pi(x - 1) = \\pi/2 + k\\pi$, yani $x - 1 = 1/2 + k$, sonuçta $x = 3/2 + k$ her $k$ tam sayısı için. Periyot $\\pi/\\pi = 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — GRAFİKTEN DENKLEM</div><div class="example-body">Bir kosinüs dalgası $x = 0$'da $y = 5$ maksimumundan başlar, $y = -1$ minimumuna iner, periyodu $6$ ve yatay kayma yok. Denklemini yaz.<br><br><strong>Çözüm.</strong> Orta çizgi $5$ ile $-1$'in tam ortası: $D = (5 + (-1))/2 = 2$. Genlik orta çizgi ile maksimum arası: $A = 5 - 2 = 3$. Periyot $= 2\\pi/B = 6$'dan $B = \\pi/3$. $C = 0$. Yani $y = 3\\cos\\!\\bigl((\\pi/3)x\\bigr) + 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — HANGİSİ HANGİSİ</div><div class="example-body">Çizmeden, hangisinin genliği daha büyük ve hangisinin periyodu daha uzun: $f(x) = 2\\sin(4x)$ ve $g(x) = 5\\sin(x/2)$?<br><br><strong>Çözüm.</strong> Genlikler: $|f|=2$, $|g|=5$ → $g$'nin genliği daha büyük. Periyotlar: $T_f = 2\\pi/4 = \\pi/2$, $T_g = 2\\pi/(1/2) = 4\\pi$ → $g$'nin periyodu da daha uzun ($f$'ninkinin sekiz katı).</div></div>

<div class="l-note"><strong>Özet.</strong> Her $y = A\\sin\\bigl(B(x - C)\\bigr) + D$ sinüsoidi için: $A, B, C, D$'yi tanımla, sonra genlik $|A|$, periyot $2\\pi/|B|$, faz kaydırma $C$ (pozitifse sağa) ve orta çizgi $y = D$ olarak oku. Tanjantlar için "periyot $2\\pi/|B|$" yerine "$\\pi/|B|$" koy ve argümanın $\\pi/2 + k\\pi$ olduğu her yere asimptot ekle.</div>
`

};
