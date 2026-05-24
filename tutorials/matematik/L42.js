window.LISE_MAT_L42 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Once you have met a function — its definition, its domain, its graph — the next powerful idea is that you can <em>move it around</em>.</strong> Slide it left or right, push it up or down, flip it across an axis, stretch it taller or squash it sideways. Each of these moves is achieved by a tiny change to the formula. Once you learn the dictionary that translates between "what I do to the formula" and "what happens to the graph," you can sketch dozens of functions without ever plotting a single point by hand.</p>

<p class="l-text">This lesson builds that dictionary. We start from a base graph $y = f(x)$ and watch how the graph reacts when we replace $x$ with $x-h$, replace $y$ with $-y$, multiply the input or the output by a constant. The two parts of the formula behave very differently — changes inside the parentheses affect the graph <em>horizontally</em> and in the opposite direction you expect, while changes outside affect the graph <em>vertically</em> in the natural direction. Get that asymmetry straight, and the rest is mechanical.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read off a horizontal shift $y = f(x-h)$ as "graph moves $h$ units to the right" (positive $h$) or to the left (negative $h$)</li>
<li>Read off a vertical shift $y = f(x) + k$ as "graph moves $k$ units up" (positive $k$) or down (negative $k$)</li>
<li>Distinguish reflections across the x-axis ($y = -f(x)$) from reflections across the y-axis ($y = f(-x)$)</li>
<li>Apply vertical stretches and compressions $y = a \\cdot f(x)$ and read $|a| > 1$ as stretch, $0 < |a| < 1$ as compression</li>
<li>Apply horizontal stretches and compressions $y = f(bx)$ — opposite convention to the vertical case</li>
<li>Combine all five operations $y = a \\cdot f\\big(b(x-h)\\big) + k$ correctly by applying them in the right order: horizontal stretch &rarr; horizontal shift &rarr; vertical stretch &rarr; vertical shift</li>
</ul>
</div>

<h2 class="lesson-title">1. The Base Function and the Logic of Transformations</h2>

<div class="calc-highlight"><strong>The core idea:</strong> we pick one function — call it $f(x)$ — and treat it as a <em>parent</em> shape. Every other function we are interested in will be built by applying a handful of standard moves to $f$. The moves are: shift, reflect, stretch. Each move corresponds to a specific change in the formula.</div>

<p class="l-text">A few base functions appear over and over and are worth memorising at sight: $f(x) = x$ (the line $y=x$), $f(x) = x^2$ (the parabola), $f(x) = |x|$ (the V-shape), $f(x) = \\sqrt{x}$ (the half-parabola on its side), $f(x) = \\sin x$ (the sine wave). Once you can draw these five shapes from memory, the rest of this lesson is about translating, reflecting, and rescaling them.</p>

<div class="calc-formula"><div class="formula-label">THE GENERAL TRANSFORMED FUNCTION</div><div class="formula-main">$$y \\;=\\; a \\cdot f\\big(b\\,(x - h)\\big) + k$$</div><div class="formula-sub">Five parameters: $a$ (vertical stretch / x-axis reflection), $b$ (horizontal stretch / y-axis reflection), $h$ (horizontal shift), $k$ (vertical shift). The rest of this lesson takes them one at a time, then puts them all together.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inside vs outside</div><div class="card-body">Operations done to $x$ <em>inside</em> the function affect the graph <strong>horizontally</strong> and in the <em>opposite</em> direction you might guess. Operations done to the output <em>outside</em> the function affect the graph <strong>vertically</strong> in the natural direction.</div></div>
<div class="calc-card"><div class="card-title">Addition vs multiplication</div><div class="card-body"><strong>Adding</strong> a constant moves the graph (translation). <strong>Multiplying</strong> by a constant rescales the graph (stretch or compression). A negative multiplier additionally reflects across an axis.</div></div>
<div class="calc-card"><div class="card-title">Order matters</div><div class="card-body">When several operations are combined, they must be applied in a specific order to get the right picture. Section 8 spells out the order.</div></div>
</div>

<div class="think-box"><div class="think-label">THE BIG IDEA</div><div class="think-body">Why does an operation <em>inside</em> the parentheses act backwards? Because you are not changing $x$ itself — you are changing the <em>question</em>. "What does $f$ do at the point $x - 2$?" That is, you are <em>asking $f$ a question two units to the left of where you are standing</em>. So to see the answer at your current x, the original graph must scoot two units to the right. Hold this picture; it explains every horizontal transformation.</div></div>

<h2 class="lesson-title">2. Horizontal Shift — y = f(x &minus; h)</h2>

<div class="calc-highlight"><strong>Rule:</strong> $y = f(x - h)$ shifts the graph of $y = f(x)$ horizontally by $h$ units. If $h > 0$, the graph moves to the <em>right</em>. If $h < 0$, the graph moves to the <em>left</em>. The direction is the <strong>opposite</strong> of the sign you see inside the parentheses.</div>

<p class="l-text">Why opposite? Replace $x$ by $x - h$ everywhere $x$ appeared. The new graph passes through the point $(x_0 + h,\\, y_0)$ wherever the old one passed through $(x_0, y_0)$ — because $f(x_0+h - h) = f(x_0) = y_0$. So every point on the old graph travels $h$ units to the right. Negative $h$ travels left.</p>

<div class="calc-formula"><div class="formula-label">HORIZONTAL SHIFT — SUMMARY</div><div class="formula-main">$$y = f(x - h) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0 + h,\\, y_0)$$</div><div class="formula-sub">Every point keeps the same y-value but moves $h$ units to the right (positive $h$) or left (negative $h$).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Starting from $f(x) = x^2$ (a parabola with vertex at the origin), describe and sketch:<br><br>(a) $g(x) = (x - 3)^2$<br>Inside the parentheses we see $x - 3$, so $h = +3$. The parabola moves <strong>3 units to the right</strong>. New vertex: $(3,\\, 0)$.<br><br>(b) $g(x) = (x + 4)^2$<br>Rewrite as $g(x) = (x - (-4))^2$, so $h = -4$. The parabola moves <strong>4 units to the left</strong>. New vertex: $(-4,\\, 0)$.</div></div>

<div class="calc-graph"><div id="plot-l42-hshift-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parent parabola $y = x^2$ in white and two shifted copies. $y = (x-3)^2$ is the same shape moved 3 units right. $y = (x+2)^2$ is the same shape moved 2 units left. The shape itself never changes.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=-60;i<=60;i++){var x=i/10;xs.push(x);y0.push(x*x);y1.push((x-3)*(x-3));y2.push((x+2)*(x+2));}
var t0={x:xs,y:y0,mode:'lines',name:'y = x²',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = (x−3)²',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = (x+2)²',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-hshift-en',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The sign trap:</strong> students see $(x + 4)^2$ and reflexively shift right because of the plus sign. Rewrite mentally as $(x - (-4))^2$ every time: only then is $h = -4$ obvious and the shift is correctly to the left.</div>

<h2 class="lesson-title">3. Vertical Shift — y = f(x) + k</h2>

<div class="calc-highlight"><strong>Rule:</strong> $y = f(x) + k$ shifts the graph of $y = f(x)$ vertically by $k$ units. If $k > 0$, the graph moves <em>up</em>. If $k < 0$, the graph moves <em>down</em>. The direction is the <strong>same</strong> as the sign of $k$ (intuitive case).</div>

<p class="l-text">Why same? Adding $k$ to the output literally raises every y-value by $k$. The point $(x_0, y_0)$ on the original graph becomes $(x_0,\\, y_0 + k)$ on the new graph. No reversal here, because nothing is happening inside the parentheses.</p>

<div class="calc-formula"><div class="formula-label">VERTICAL SHIFT — SUMMARY</div><div class="formula-main">$$y = f(x) + k \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0,\\, y_0 + k)$$</div><div class="formula-sub">Every point keeps the same x-value but moves $k$ units up (positive $k$) or down (negative $k$).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Starting from $f(x) = |x|$ (the V-shape with vertex at the origin), describe and sketch:<br><br>(a) $g(x) = |x| + 2$<br>Outside the absolute value we add $+2$, so $k = +2$. The V moves <strong>2 units up</strong>. New vertex: $(0,\\, 2)$.<br><br>(b) $g(x) = |x| - 3$<br>Here $k = -3$. The V moves <strong>3 units down</strong>. New vertex: $(0,\\, -3)$.</div></div>

<div class="calc-graph"><div id="plot-l42-vshift-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parent absolute-value graph $y = |x|$ in white, and two vertically shifted copies. $y = |x| + 2$ slides up by 2; $y = |x| - 3$ slides down by 3. The shape and orientation are unchanged.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=-50;i<=50;i++){var x=i/10;xs.push(x);y0.push(Math.abs(x));y1.push(Math.abs(x)+2);y2.push(Math.abs(x)-3);}
var t0={x:xs,y:y0,mode:'lines',name:'y = |x|',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = |x| + 2',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = |x| − 3',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-4,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-vshift-en',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Compare $y = (x - 3)^2$ with $y = x^2 - 3$. The first slides the parabola <em>right</em> by 3 units (vertex at $(3,0)$). The second slides it <em>down</em> by 3 units (vertex at $(0,-3)$). Same numeral, completely different transformations — the location of the constant (inside vs outside) is everything.</div></div>

<h2 class="lesson-title">4. Reflection Across the x-Axis — y = &minus;f(x)</h2>

<div class="calc-highlight"><strong>Rule:</strong> $y = -f(x)$ flips the graph upside down across the <em>x-axis</em>. Every y-value reverses sign; points above the x-axis move below it and vice versa. x-values are unchanged.</div>

<p class="l-text">This is the simplest reflection. Multiplying the output by $-1$ negates every y-coordinate. The point $(x_0, y_0)$ becomes $(x_0, -y_0)$. Anything that was a maximum becomes a minimum; anything that was opening upward now opens downward.</p>

<div class="calc-formula"><div class="formula-label">X-AXIS REFLECTION</div><div class="formula-main">$$y = -f(x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0,\\, -y_0)$$</div><div class="formula-sub">Mirror image across the horizontal line $y = 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Starting from $f(x) = x^2$ (upward parabola with vertex at the origin), what is $g(x) = -x^2$?<br><br>Every y-value flips sign. The parabola is now <strong>downward-opening</strong>, vertex still at $(0,\\, 0)$, but the rest of the curve now lives in the lower half-plane. The point $(2,\\, 4)$ becomes $(2,\\, -4)$.</div></div>

<div class="calc-graph"><div id="plot-l42-xrefl-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = x^2$ opening upward in blue, and its x-axis reflection $y = -x^2$ in red opening downward. They share the same vertex but are mirror images across the horizontal axis.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];
for(var i=-50;i<=50;i++){var x=i/10;xs.push(x);y0.push(x*x);y1.push(-x*x);}
var t0={x:xs,y:y0,mode:'lines',name:'y = x²',line:{color:'#3b82f6',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = −x²',line:{color:'#ef4444',width:2.5}};
var ax={x:[-5,5],y:[0,0],mode:'lines',name:'x-axis (mirror)',line:{color:'rgba(255,255,255,0.4)',width:1,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-xrefl-en',[t0,t1,ax],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Reflection Across the y-Axis — y = f(&minus;x)</h2>

<div class="calc-highlight"><strong>Rule:</strong> $y = f(-x)$ flips the graph left-to-right across the <em>y-axis</em>. Every x-value reverses sign; points to the right of the y-axis move to the left and vice versa. y-values are unchanged.</div>

<p class="l-text">The negative sign sits inside the function, so it acts on the input. Replacing $x$ by $-x$ means: at the new x-coordinate $x_0$, look up what $f$ does at $-x_0$. The result is a horizontal mirror image across the y-axis.</p>

<div class="calc-formula"><div class="formula-label">Y-AXIS REFLECTION</div><div class="formula-main">$$y = f(-x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (-x_0,\\, y_0)$$</div><div class="formula-sub">Mirror image across the vertical line $x = 0$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Starting from $f(x) = \\sqrt{x}$ (defined for $x \\geq 0$, half-parabola on its side, starting at the origin and curving up and to the right), what is $g(x) = \\sqrt{-x}$?<br><br>The domain flips: $-x \\geq 0$ means $x \\leq 0$. So the graph now lives in the left half-plane. It starts at the origin and curves up and to the <strong>left</strong>. The point $(4,\\, 2)$ on the original graph becomes $(-4,\\, 2)$ on the reflected graph.</div></div>

<div class="calc-graph"><div id="plot-l42-yrefl-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = \\sqrt{x}$ in blue (defined for $x \\geq 0$) and its y-axis reflection $y = \\sqrt{-x}$ in red (defined for $x \\leq 0$). The two curves meet at the origin and mirror each other across the vertical axis.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs1=[];var y1=[];var xs2=[];var y2=[];
for(var i=0;i<=50;i++){var x=i/10;xs1.push(x);y1.push(Math.sqrt(x));xs2.push(-x);y2.push(Math.sqrt(x));}
var t1={x:xs1,y:y1,mode:'lines',name:'y = √x',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs2,y:y2,mode:'lines',name:'y = √(−x)',line:{color:'#ef4444',width:2.5}};
var ay={x:[0,0],y:[-1,4],mode:'lines',name:'y-axis (mirror)',line:{color:'rgba(255,255,255,0.4)',width:1,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.5,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-yrefl-en',[t1,t2,ay],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Symmetry shortcut:</strong> if a function happens to satisfy $f(-x) = f(x)$ for every $x$ (an <em>even</em> function, like $x^2$ or $\\cos x$), then its y-axis reflection is identical to itself — the picture does not change. If instead $f(-x) = -f(x)$ (an <em>odd</em> function, like $x^3$ or $\\sin x$), then the y-axis reflection equals the x-axis reflection.</div>

<h2 class="lesson-title">6. Vertical Stretch / Compression — y = a &middot; f(x)</h2>

<div class="calc-highlight"><strong>Rule:</strong> $y = a \\cdot f(x)$ multiplies every y-value by $a$. If $|a| > 1$, the graph is <em>stretched</em> vertically (taller and skinnier). If $0 < |a| < 1$, the graph is <em>compressed</em> vertically (shorter and flatter). If $a < 0$, an x-axis reflection is also applied.</div>

<p class="l-text">The constant $a$ outside the function rescales the output. Heights become $a$ times bigger. x-intercepts (places where $f(x) = 0$) stay put because $a \\cdot 0 = 0$. Maximums become $a$ times higher; minimums become $a$ times lower. This is a <em>vertical</em> scaling about the x-axis.</p>

<div class="calc-formula"><div class="formula-label">VERTICAL SCALING — SUMMARY</div><div class="formula-main">$$y = a \\cdot f(x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0,\\, a\\,y_0)$$</div><div class="formula-sub">x-coordinates unchanged. y-coordinates multiplied by $a$. If $a$ is negative the graph also flips across the x-axis.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a = 2$</div><div class="card-body">Vertical stretch by a factor of 2. Heights doubled. Graph looks "taller and skinnier."</div></div>
<div class="calc-card"><div class="card-title">$a = 1/2$</div><div class="card-body">Vertical compression by a factor of 2. Heights halved. Graph looks "shorter and flatter."</div></div>
<div class="calc-card"><div class="card-title">$a = -1$</div><div class="card-body">Pure x-axis reflection. Heights keep their magnitude but flip sign. Special case of section 4.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Starting from $f(x) = x^2$, sketch $g(x) = 3x^2$ and $h(x) = 0.5\\,x^2$.<br><br>$g(x) = 3x^2$: each y-value is tripled. At $x = 1$, the original gives $1$; the new gives $3$. At $x = 2$, the original gives $4$; the new gives $12$. The parabola is <strong>narrower and steeper</strong>.<br><br>$h(x) = 0.5\\,x^2$: each y-value is halved. At $x = 2$, the original gives $4$; the new gives $2$. The parabola is <strong>wider and flatter</strong>.<br><br>In both cases the vertex stays at the origin.</div></div>

<div class="calc-graph"><div id="plot-l42-vstretch-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parent parabola $y = x^2$ in white, the vertically stretched $y = 3x^2$ in blue (narrower, steeper), and the vertically compressed $y = 0.5\\,x^2$ in red (wider, flatter). All three share the vertex $(0, 0)$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);y0.push(x*x);y1.push(3*x*x);y2.push(0.5*x*x);}
var t0={x:xs,y:y0,mode:'lines',name:'y = x²',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = 3x² (stretch)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = 0.5 x² (compress)',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-vstretch-en',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Horizontal Stretch / Compression — y = f(bx)</h2>

<div class="calc-highlight"><strong>Rule:</strong> $y = f(bx)$ rescales x. If $|b| > 1$, the graph is <em>compressed</em> horizontally (narrower). If $0 < |b| < 1$, the graph is <em>stretched</em> horizontally (wider). If $b < 0$, a y-axis reflection is also applied. <strong>Direction is opposite to what you might guess</strong>, just like horizontal shifts.</div>

<p class="l-text">The constant $b$ acts on the input, so it works the "wrong" way around. To see what $f(bx)$ does at the point $x_0$, we look up $f$ at the input $b\\,x_0$. If $b = 2$, we are looking up $f$ at twice the distance from the origin — so the original graph has to <em>scrunch in</em> by a factor of 2 to land at the new x. The width shrinks. If $b = 1/2$, we look up $f$ at half the distance — so the graph stretches out by a factor of 2.</p>

<div class="calc-formula"><div class="formula-label">HORIZONTAL SCALING — SUMMARY</div><div class="formula-main">$$y = f(b\\,x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; \\Big(\\tfrac{x_0}{b},\\, y_0\\Big)$$</div><div class="formula-sub">y-coordinates unchanged. x-coordinates divided by $b$. Note the division — that is why the convention reverses.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$b = 2$</div><div class="card-body">Horizontal <strong>compression</strong> by a factor of 2. The graph gets squashed toward the y-axis.</div></div>
<div class="calc-card"><div class="card-title">$b = 1/2$</div><div class="card-body">Horizontal <strong>stretch</strong> by a factor of 2. The graph spreads out away from the y-axis.</div></div>
<div class="calc-card"><div class="card-title">$b = -1$</div><div class="card-body">Pure y-axis reflection. Special case of section 5.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Starting from $f(x) = \\sin x$ (one full wave between $x = 0$ and $x = 2\\pi$), describe $g(x) = \\sin(2x)$ and $h(x) = \\sin(x/2)$.<br><br>$g(x) = \\sin(2x)$: $b = 2$, so the wave is <strong>compressed horizontally</strong> by a factor of 2. One full wave now fits between $0$ and $\\pi$ instead of $0$ and $2\\pi$. The period halves.<br><br>$h(x) = \\sin(x/2)$: $b = 1/2$, so the wave is <strong>stretched horizontally</strong> by a factor of 2. One full wave now needs from $0$ to $4\\pi$. The period doubles.<br><br>The heights of the waves (amplitude) are <em>unchanged</em>.</div></div>

<div class="calc-graph"><div id="plot-l42-hstretch-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $\\sin x$ in white (period $2\\pi$), $\\sin 2x$ in blue (period $\\pi$ — twice as fast), and $\\sin(x/2)$ in red (period $4\\pi$ — twice as slow). The amplitude of each wave is the same (1); only the horizontal scale changes.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=0;i<=400;i++){var x=i*4*Math.PI/400;xs.push(x);y0.push(Math.sin(x));y1.push(Math.sin(2*x));y2.push(Math.sin(x/2));}
var t0={x:xs,y:y0,mode:'lines',name:'y = sin x',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = sin 2x',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = sin(x/2)',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (radians)',range:[0,4*Math.PI],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-hstretch-en',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SIDE-BY-SIDE COMPARISON</div><div class="think-body">Vertical: $a = 2$ <strong>stretches</strong> the graph. Horizontal: $b = 2$ <strong>compresses</strong> the graph. Same numeral, opposite effect — because "outside the function" multiplies the answer directly, while "inside the function" reaches the answer by feeding in a bigger input, which in effect shrinks the x-axis.</div></div>

<h2 class="lesson-title">8. Combined Transformation — y = a &middot; f(b(x &minus; h)) + k</h2>

<div class="calc-highlight"><strong>The order matters.</strong> Five operations applied in the wrong order give the wrong picture. The safe, always-correct order is: <strong>(1) horizontal stretch, (2) horizontal shift, (3) vertical stretch, (4) vertical shift.</strong> Reflections (negative $a$ or $b$) happen inside steps (1) and (3) automatically.</div>

<p class="l-text">Why this order? Because of how the formula is built up. Read the expression $y = a \\cdot f\\big(b(x - h)\\big) + k$ from the inside out. Innermost is the input transformation $b(x - h)$ — that has two steps: shift first (subtract $h$), then scale (multiply by $b$). But because of the asymmetry of horizontal transformations, when you re-read this as a sequence of moves applied to the <em>graph</em>, the effective order is: horizontal stretch by $1/b$, then horizontal shift by $h$. After that comes the outer multiplication by $a$ (vertical stretch / reflection) and finally the addition of $k$ (vertical shift).</p>

<div class="calc-formula"><div class="formula-label">FOUR-STEP RECIPE</div><div class="formula-main">$$y = f(x) \\;\\;\\xrightarrow{\\text{1. scale x by } 1/b}\\;\\; y = f(bx) \\;\\;\\xrightarrow{\\text{2. shift right by } h}\\;\\; y = f(b(x-h))$$ $$\\xrightarrow{\\text{3. scale y by } a}\\;\\; y = a\\,f(b(x-h)) \\;\\;\\xrightarrow{\\text{4. shift up by } k}\\;\\; y = a\\,f(b(x-h)) + k$$</div><div class="formula-sub">Follow these four steps in this exact order. Skip any step where the parameter is at its identity value ($a = 1$, $b = 1$, $h = 0$, $k = 0$).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A FULL TRANSFORMATION</div><div class="example-body">Sketch $y = 2(x - 1)^2 + 3$.<br><br>Here $a = 2$, $b = 1$, $h = 1$, $k = 3$. Start from $f(x) = x^2$:<br><br>Step 1: Horizontal scale — $b = 1$, so no horizontal stretch.<br>Step 2: Horizontal shift right by $1$. Vertex moves to $(1, 0)$.<br>Step 3: Vertical stretch by $2$. Parabola becomes narrower. Vertex still at $(1, 0)$.<br>Step 4: Vertical shift up by $3$. Vertex moves to $(1, 3)$.<br><br>Final: a parabola opening upward with vertex $(1,\\, 3)$, narrower than the parent by a factor of 2.</div></div>

<div class="calc-graph"><div id="plot-l42-combined-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parent $y = x^2$ in white, and the step-by-step transformation to $y = 2(x-1)^2 + 3$. Each colour traces one step of the recipe so you can see the vertex slide right, then the curve narrow, then the whole thing rise.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y2=[];var y3=[];var y4=[];
for(var i=-30;i<=50;i++){var x=i/10;xs.push(x);y0.push(x*x);y2.push((x-1)*(x-1));y3.push(2*(x-1)*(x-1));y4.push(2*(x-1)*(x-1)+3);}
var t0={x:xs,y:y0,mode:'lines',name:'parent y = x²',line:{color:'rgba(255,255,255,0.5)',width:2,dash:'dot'}};
var t2={x:xs,y:y2,mode:'lines',name:'step 2: shift right',line:{color:'#10b981',width:2}};
var t3={x:xs,y:y3,mode:'lines',name:'step 3: stretch by 2',line:{color:'#3b82f6',width:2}};
var t4={x:xs,y:y4,mode:'lines',name:'step 4: shift up by 3',line:{color:'#ef4444',width:3}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,14],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-combined-en',[t0,t2,t3,t4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Watch the parentheses:</strong> $2(x - 1)^2 + 3$ has the constant $3$ outside — it shifts the graph up. But $2(x - 1)^2 + 3$ vs $(2x - 1)^2 + 3$ are very different beasts. In the second one, the inner expression is $2x - 1 = 2(x - 1/2)$, so the horizontal shift is only $1/2$, not $1$, and there is a horizontal compression by 2. Always factor the inner expression first.</div>

<h2 class="lesson-title">9. Worked Examples — Three Parent Functions</h2>

<p class="l-text">Three short cases to drill the dictionary. In each one, identify the parent function, list the parameters, then sketch.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — PARABOLA</div><div class="example-body">$y = -(x + 2)^2 + 4$.<br><br>Parent: $f(x) = x^2$. Rewrite as $y = -1 \\cdot (x - (-2))^2 + 4$, so $a = -1$, $h = -2$, $k = 4$.<br><br>Steps: shift left by 2 &rarr; vertex at $(-2, 0)$. Reflect across x-axis (because $a = -1$) &rarr; parabola opens downward, vertex still at $(-2, 0)$. Shift up by 4 &rarr; vertex at $(-2, 4)$.<br><br>Final picture: <strong>downward-opening parabola with vertex $(-2,\\, 4)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — ABSOLUTE VALUE</div><div class="example-body">$y = 3 |x - 1| - 2$.<br><br>Parent: $f(x) = |x|$. Here $a = 3$, $h = 1$, $k = -2$.<br><br>Steps: shift right by 1 &rarr; vertex at $(1, 0)$. Vertical stretch by 3 &rarr; V becomes narrower, slopes $\\pm 3$ instead of $\\pm 1$. Shift down by 2 &rarr; vertex at $(1, -2)$.<br><br>Final picture: <strong>narrow V-shape with vertex $(1,\\, -2)$ and arms of slope $\\pm 3$</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — SINUSOID</div><div class="example-body">$y = 2\\sin\\!\\Big(\\dfrac{x}{2}\\Big) + 1$.<br><br>Parent: $f(x) = \\sin x$. Here $a = 2$, $b = 1/2$, $h = 0$, $k = 1$.<br><br>Steps: horizontal stretch by 2 (because $b = 1/2$) &rarr; period becomes $4\\pi$. Vertical stretch by 2 &rarr; amplitude becomes 2 (wave goes from $-2$ to $+2$). Shift up by 1 &rarr; wave now oscillates between $-1$ and $+3$ around the midline $y = 1$.<br><br>Final picture: <strong>a slow, tall sine wave with period $4\\pi$, amplitude 2, centred on $y = 1$</strong>.</div></div>

<div class="calc-graph"><div id="plot-l42-examples-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the three worked examples plotted on the same axes so you can read off vertex / centre / orientation directly. Notice that in each case the parent shape is preserved — only the position, orientation, and scale change.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y1=[];var y2=[];var y3=[];
for(var i=-60;i<=60;i++){var x=i/10;xs.push(x);y1.push(-(x+2)*(x+2)+4);y2.push(3*Math.abs(x-1)-2);y3.push(2*Math.sin(x/2)+1);}
var t1={x:xs,y:y1,mode:'lines',name:'Ex 1: −(x+2)² + 4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'Ex 2: 3|x−1| − 2',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:y3,mode:'lines',name:'Ex 3: 2 sin(x/2) + 1',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-6,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-examples-en',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Exercises</h2>

<p class="l-text">Eight problems mixing forward (find the graph from the formula) and backward (find the formula from the graph) reasoning. Try each on paper before checking the answer.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Question.</strong> Describe in words how the graph of $y = (x - 5)^2$ relates to the graph of $y = x^2$.<br><br><strong>Answer.</strong> The graph is shifted 5 units to the right. New vertex: $(5, 0)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Question.</strong> Describe in words how the graph of $y = x^2 + 7$ relates to the graph of $y = x^2$.<br><br><strong>Answer.</strong> The graph is shifted 7 units up. New vertex: $(0, 7)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Question.</strong> What is the vertex of the parabola $y = -(x + 3)^2 + 5$?<br><br><strong>Answer.</strong> $h = -3$ and $k = 5$, so the vertex is $(-3, 5)$. Because $a = -1$, the parabola opens downward.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Question.</strong> A function $f$ has $f(2) = 7$. What is the value of $g(5)$ if $g(x) = f(x - 3) + 4$?<br><br><strong>Answer.</strong> $g(5) = f(5 - 3) + 4 = f(2) + 4 = 7 + 4 = 11$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Question.</strong> The graph of $y = |x|$ is shifted 4 units to the left, reflected across the x-axis, and shifted 2 units down. Write the equation of the new graph.<br><br><strong>Answer.</strong> Shift left: $|x + 4|$. Reflect across x: $-|x + 4|$. Shift down 2: $\\boxed{y = -|x + 4| - 2}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Question.</strong> A sine wave has been stretched vertically by a factor of 3, compressed horizontally by a factor of 2, and shifted up by 1. Write its equation.<br><br><strong>Answer.</strong> Horizontal compression by 2 means $b = 2$. Vertical stretch by 3 means $a = 3$. Vertical shift up by 1 means $k = 1$. Result: $\\boxed{y = 3\\sin(2x) + 1}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body"><strong>Question.</strong> The parabola $y = x^2$ is reflected across the y-axis. Does the graph change?<br><br><strong>Answer.</strong> No. The function $y = (-x)^2 = x^2$ is identical to the original because $x^2$ is an <em>even</em> function. The graph is symmetric about the y-axis, so reflecting it across the y-axis produces the same picture.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body"><strong>Question.</strong> Sketch (in words) the difference between $y = 2(x - 1)^2$ and $y = (2x - 1)^2$.<br><br><strong>Answer.</strong> The first has $a = 2$, $h = 1$ — a parabola shifted right by 1 and stretched vertically by 2. The second factors as $(2(x - 1/2))^2$, so it is a parabola shifted right by $1/2$ <em>and</em> compressed horizontally by 2. Same family, different vertex (one at $x = 1$, the other at $x = 1/2$) and different shape.</div></div>

<h2 class="lesson-title">11. One Parent, Five Transformations — Side by Side</h2>

<p class="l-text">To consolidate, here is a single panel that shows the parent $f(x) = x^2$ together with five of the standard moves applied to it. Each colour corresponds to one transformation type, so the visual effect of each move on the same starting shape can be compared at a glance.</p>

<div class="calc-graph"><div id="plot-l42-five-en-extra" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parent $f(x) = x^2$ in white together with five transformations overlaid. Blue: $f(x-2)$ (right shift). Green: $f(x)+3$ (up shift). Red: $-f(x)$ (x-axis reflection). Amber: $f(-x)$ (y-axis reflection — identical to parent because $x^2$ is even). Magenta: $2f(x)$ (vertical stretch by 2).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var yp=[];var yhs=[];var yvs=[];var yxr=[];var yyr=[];var yvst=[];
for(var i=-60;i<=60;i++){var x=i/10;xs.push(x);yp.push(x*x);yhs.push((x-2)*(x-2));yvs.push(x*x+3);yxr.push(-x*x);yyr.push((-x)*(-x));yvst.push(2*x*x);}
var tp={x:xs,y:yp,mode:'lines',name:'parent f(x) = x²',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:yhs,mode:'lines',name:'f(x−2) — right shift',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:yvs,mode:'lines',name:'f(x) + 3 — up shift',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:yxr,mode:'lines',name:'−f(x) — reflect x-axis',line:{color:'#ef4444',width:2.5}};
var t4={x:xs,y:yyr,mode:'lines',name:'f(−x) — reflect y-axis',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var t5={x:xs,y:yvst,mode:'lines',name:'2 f(x) — vertical stretch',line:{color:'#ec4899',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-14,16],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-five-en-extra',[tp,t1,t2,t3,t4,t5],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">The summary table below collects all six transformation families into one place so you can scan the dictionary entries side by side.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.9rem;color:rgba(235,230,220,0.92);background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.12);color:#3b82f6;text-align:left">
<th style="padding:0.7rem 0.9rem;font-weight:700;letter-spacing:0.04em;font-size:0.78rem;border-bottom:1px solid rgba(59,130,246,0.25)">TRANSFORMATION</th>
<th style="padding:0.7rem 0.9rem;font-weight:700;letter-spacing:0.04em;font-size:0.78rem;border-bottom:1px solid rgba(59,130,246,0.25)">RULE</th>
<th style="padding:0.7rem 0.9rem;font-weight:700;letter-spacing:0.04em;font-size:0.78rem;border-bottom:1px solid rgba(59,130,246,0.25)">EFFECT ON THE GRAPH</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Vertical shift</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = f(x) + k$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Moves up by $k$ ($k>0$) or down ($k<0$). Same sign as you see.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Horizontal shift</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = f(x - h)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Moves right by $h$ ($h>0$) or left ($h<0$). <strong>Opposite</strong> of the sign you see.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Vertical reflection</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = -f(x)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Flips across the x-axis. Every $y_0 \\mapsto -y_0$.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Horizontal reflection</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = f(-x)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Flips across the y-axis. Every $x_0 \\mapsto -x_0$.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Vertical stretch / compress</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = a \\cdot f(x)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$|a|>1$ stretches (taller). $0<|a|<1$ compresses (flatter). $a<0$ also reflects across x-axis.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;font-weight:600">Horizontal stretch / compress</td><td style="padding:0.65rem 0.9rem">$y = f(b\\,x)$</td><td style="padding:0.65rem 0.9rem">$|b|>1$ <strong>compresses</strong> (narrower). $0<|b|<1$ <strong>stretches</strong> (wider). $b<0$ also reflects across y-axis. <strong>Opposite</strong> convention to the vertical case.</td></tr>
</tbody>
</table>
</div>

<div class="lesson-outcomes" style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$y = f(x - h)$ shifts right by $h$ (left if $h < 0$). <strong>Direction is opposite</strong> to the sign you see.</li>
<li>$y = f(x) + k$ shifts up by $k$ (down if $k < 0$). Direction is the same as the sign of $k$.</li>
<li>$y = -f(x)$ reflects across the x-axis. $y = f(-x)$ reflects across the y-axis.</li>
<li>$y = a\\,f(x)$ scales vertically by $|a|$ (stretch if $|a|>1$, compress if $|a|<1$).</li>
<li>$y = f(bx)$ scales horizontally by $1/|b|$ — <strong>opposite convention</strong>: $b > 1$ compresses, $b < 1$ stretches.</li>
<li>Combine in the order: horizontal stretch &rarr; horizontal shift &rarr; vertical stretch &rarr; vertical shift.</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir fonksiyonu — tanımıyla, tanım kümesiyle, grafiğiyle — bir kez tanıdıktan sonraki güçlü fikir, onu <em>hareket ettirebilmektir</em>.</strong> Sağa ya da sola kaydır, yukarı ya da aşağı it, bir eksene göre yansıt, uzat ya da yana sıkıştır. Bu hareketlerin her biri formüldeki küçük bir değişiklikle yapılır. "Formüle ne yapıyorum" ile "grafikte ne oluyor" arasındaki sözlüğü bir kez öğrenirsen, elle tek bir nokta çizmeden onlarca fonksiyonun grafiğini çıkarabilirsin.</p>

<p class="l-text">Bu ders o sözlüğü kurar. Bir temel grafik $y = f(x)$'ten başlar ve $x$ yerine $x - h$ koyduğumuzda, $y$ yerine $-y$ koyduğumuzda, girdiyi ya da çıktıyı bir sabitle çarptığımızda grafiğin nasıl tepki verdiğini izleriz. Formülün iki kısmı çok farklı davranır: parantez <em>içindeki</em> değişiklikler grafiği <em>yatay</em> olarak ve beklediğinin tersi yönde etkiler, parantez <em>dışındaki</em> değişiklikler ise grafiği <em>dikey</em> olarak doğal yönde etkiler. Bu asimetriyi yerine oturt, gerisi mekanik.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yatay kaymayı $y = f(x - h)$ "grafik $h$ birim sağa kayar" (pozitif $h$) ya da sola (negatif $h$) olarak okumayı</li>
<li>Dikey kaymayı $y = f(x) + k$ "grafik $k$ birim yukarı kayar" (pozitif $k$) ya da aşağı (negatif $k$) olarak okumayı</li>
<li>x-eksenine göre yansımayı ($y = -f(x)$) y-eksenine göre yansımadan ($y = f(-x)$) ayırt etmeyi</li>
<li>Dikey genişletme/sıkıştırmayı $y = a \\cdot f(x)$ uygulamayı ve $|a| > 1$ &rarr; genişletme, $0 < |a| < 1$ &rarr; sıkıştırma olarak okumayı</li>
<li>Yatay genişletme/sıkıştırmayı $y = f(bx)$ uygulamayı — dikey duruma göre <em>ters</em> sözleşme</li>
<li>Beş işlemin tümünü $y = a \\cdot f\\big(b(x-h)\\big) + k$ doğru sırayla birleştirmeyi: yatay genişletme &rarr; yatay kaydırma &rarr; dikey genişletme &rarr; dikey kaydırma</li>
</ul>
</div>

<h2 class="lesson-title">1. Temel Fonksiyon ve Dönüşüm Mantığı</h2>

<div class="calc-highlight"><strong>Ana fikir:</strong> bir fonksiyon seçiyoruz — adına $f(x)$ diyelim — ve onu bir <em>ana</em> şekil olarak görüyoruz. İlgilendiğimiz diğer her fonksiyon, $f$'ye birkaç standart hareket uygulanarak inşa edilecek. Hareketler şunlar: kaydırma, yansıtma, genişletme/sıkıştırma. Her hareket formülde belirli bir değişikliğe karşılık gelir.</div>

<p class="l-text">Sık karşılaşılan ve görür görmez tanımanız gereken birkaç temel fonksiyon var: $f(x) = x$ ($y = x$ doğrusu), $f(x) = x^2$ (parabol), $f(x) = |x|$ (V şekli), $f(x) = \\sqrt{x}$ (yan yatmış yarım parabol), $f(x) = \\sin x$ (sinüs dalgası). Bu beş şekli ezberden çizebildiğin an, dersin geri kalanı onları öteleme, yansıtma ve yeniden ölçeklendirme üzerinedir.</p>

<div class="calc-formula"><div class="formula-label">GENEL DÖNÜŞTÜRÜLMÜŞ FONKSİYON</div><div class="formula-main">$$y \\;=\\; a \\cdot f\\big(b\\,(x - h)\\big) + k$$</div><div class="formula-sub">Beş parametre: $a$ (dikey genişletme / x-ekseni yansıma), $b$ (yatay genişletme / y-ekseni yansıma), $h$ (yatay kaydırma), $k$ (dikey kaydırma). Dersin geri kalanı önce bunları tek tek ele alır, sonra hepsini bir araya getirir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İçeri ve dışarı</div><div class="card-body">Fonksiyon <em>içinde</em> $x$'e yapılan işlemler grafiği <strong>yatay</strong> olarak ve beklediğinin <em>tersi</em> yönde etkiler. Fonksiyonun <em>dışında</em> çıktıya yapılan işlemler grafiği <strong>dikey</strong> olarak doğal yönde etkiler.</div></div>
<div class="calc-card"><div class="card-title">Toplama ve çarpma</div><div class="card-body">Bir sabit <strong>eklemek</strong> grafiği öteler (kaydırma). Bir sabitle <strong>çarpmak</strong> grafiği yeniden ölçeklendirir (genişletme veya sıkıştırma). Negatif bir çarpan ayrıca bir eksene göre yansıtır.</div></div>
<div class="calc-card"><div class="card-title">Sıra önemlidir</div><div class="card-body">Birkaç işlem birleştirildiğinde, doğru resmi elde etmek için belirli bir sırayla uygulanmalılar. 8. bölüm sırayı açıkça veriyor.</div></div>
</div>

<div class="think-box"><div class="think-label">BÜYÜK FİKİR</div><div class="think-body">Neden parantez <em>içindeki</em> bir işlem ters yönde davranır? Çünkü $x$'in kendisini değil, <em>soruyu</em> değiştiriyorsun. "$f$, $x - 2$ noktasında ne yapıyor?" Yani $f$'ye <em>durduğun yerden iki birim solda bir soru soruyorsun</em>. O zaman cevabı şimdiki x'inde görmek için orijinal grafiğin iki birim sağa kayması gerekir. Bu resmi aklında tut; her yatay dönüşümü açıklar.</div></div>

<h2 class="lesson-title">2. Yatay Kaydırma — y = f(x &minus; h)</h2>

<div class="calc-highlight"><strong>Kural:</strong> $y = f(x - h)$, $y = f(x)$ grafiğini yatayda $h$ birim kaydırır. $h > 0$ ise grafik <em>sağa</em> kayar. $h < 0$ ise grafik <em>sola</em> kayar. Yön, parantez içinde gördüğün işaretin <strong>tersidir</strong>.</div>

<p class="l-text">Neden tersi? $x$ yerine $x - h$ koy. Yeni grafik, eski grafiğin $(x_0, y_0)$'dan geçtiği her yerde $(x_0 + h,\\, y_0)$'dan geçer — çünkü $f(x_0 + h - h) = f(x_0) = y_0$. Yani eski grafiğin her noktası $h$ birim sağa gider. Negatif $h$ ise sola gider.</p>

<div class="calc-formula"><div class="formula-label">YATAY KAYDIRMA — ÖZET</div><div class="formula-main">$$y = f(x - h) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0 + h,\\, y_0)$$</div><div class="formula-sub">Her nokta aynı y-değerini korur ama $h$ birim sağa (pozitif $h$) ya da sola (negatif $h$) hareket eder.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = x^2$'den (tepesi orijinde olan bir parabol) başlayarak şunları tarif et ve çiz:<br><br>(a) $g(x) = (x - 3)^2$<br>Parantez içinde $x - 3$ görüyoruz, yani $h = +3$. Parabol <strong>3 birim sağa</strong> kayar. Yeni tepe: $(3,\\, 0)$.<br><br>(b) $g(x) = (x + 4)^2$<br>$g(x) = (x - (-4))^2$ olarak yeniden yaz, yani $h = -4$. Parabol <strong>4 birim sola</strong> kayar. Yeni tepe: $(-4,\\, 0)$.</div></div>

<div class="calc-graph"><div id="plot-l42-hshift-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ana parabol $y = x^2$ beyazda ve iki kaymış kopyası. $y = (x-3)^2$, aynı şekil 3 birim sağa kaymış. $y = (x+2)^2$, aynı şekil 2 birim sola kaymış. Şeklin kendisi hiç değişmiyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=-60;i<=60;i++){var x=i/10;xs.push(x);y0.push(x*x);y1.push((x-3)*(x-3));y2.push((x+2)*(x+2));}
var t0={x:xs,y:y0,mode:'lines',name:'y = x²',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = (x−3)²',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = (x+2)²',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-hshift-tr',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>İşaret tuzağı:</strong> öğrenciler $(x + 4)^2$ görüp artı işaretinden dolayı refleks olarak sağa kaydırır. Her seferinde zihninde $(x - (-4))^2$ olarak yeniden yaz: ancak o zaman $h = -4$ aşikar olur ve kayma doğru yönde — sola — olur.</div>

<h2 class="lesson-title">3. Dikey Kaydırma — y = f(x) + k</h2>

<div class="calc-highlight"><strong>Kural:</strong> $y = f(x) + k$, $y = f(x)$ grafiğini dikeyde $k$ birim kaydırır. $k > 0$ ise grafik <em>yukarı</em> kayar. $k < 0$ ise grafik <em>aşağı</em> kayar. Yön $k$'nın işaretiyle <strong>aynıdır</strong> (sezgisel durum).</div>

<p class="l-text">Neden aynı? Çıktıya $k$ eklemek her y-değerini tam olarak $k$ kadar yukarı çıkarır. Orijinal grafikteki $(x_0, y_0)$ noktası, yeni grafikte $(x_0,\\, y_0 + k)$ olur. Burada ters çevirme yok, çünkü parantez içinde hiçbir şey olmuyor.</p>

<div class="calc-formula"><div class="formula-label">DİKEY KAYDIRMA — ÖZET</div><div class="formula-main">$$y = f(x) + k \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0,\\, y_0 + k)$$</div><div class="formula-sub">Her nokta aynı x-değerini korur ama $k$ birim yukarı (pozitif $k$) ya da aşağı (negatif $k$) hareket eder.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = |x|$'ten (tepesi orijinde olan V şekli) başlayarak şunları tarif et ve çiz:<br><br>(a) $g(x) = |x| + 2$<br>Mutlak değerin dışında $+2$ ekliyoruz, yani $k = +2$. V <strong>2 birim yukarı</strong> kayar. Yeni tepe: $(0,\\, 2)$.<br><br>(b) $g(x) = |x| - 3$<br>Burada $k = -3$. V <strong>3 birim aşağı</strong> kayar. Yeni tepe: $(0,\\, -3)$.</div></div>

<div class="calc-graph"><div id="plot-l42-vshift-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ana mutlak değer grafiği $y = |x|$ beyazda ve iki dikey kaymış kopyası. $y = |x| + 2$ 2 birim yukarı, $y = |x| - 3$ ise 3 birim aşağı kayar. Şekil ve yön değişmez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=-50;i<=50;i++){var x=i/10;xs.push(x);y0.push(Math.abs(x));y1.push(Math.abs(x)+2);y2.push(Math.abs(x)-3);}
var t0={x:xs,y:y0,mode:'lines',name:'y = |x|',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = |x| + 2',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = |x| − 3',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-4,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-vshift-tr',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$y = (x - 3)^2$ ile $y = x^2 - 3$'ü karşılaştır. Birincisi parabolü 3 birim <em>sağa</em> kaydırır (tepe $(3,0)$). İkincisi 3 birim <em>aşağı</em> kaydırır (tepe $(0,-3)$). Aynı sayı, tamamen farklı dönüşümler — sabitin konumu (içeride mi dışarıda mı) her şey.</div></div>

<h2 class="lesson-title">4. x-Ekseni Yansıma — y = &minus;f(x)</h2>

<div class="calc-highlight"><strong>Kural:</strong> $y = -f(x)$ grafiği <em>x-eksenine</em> göre baş aşağı çevirir. Her y-değeri işaret değiştirir; x-ekseninin üstündeki noktalar altına geçer, alttakiler üste. x-değerleri değişmez.</div>

<p class="l-text">Bu en basit yansımadır. Çıktıyı $-1$ ile çarpmak her y-koordinatını negatife dönüştürür. $(x_0, y_0)$ noktası $(x_0, -y_0)$ olur. Maksimum olan minimum olur; yukarı açılan şimdi aşağı açılır.</p>

<div class="calc-formula"><div class="formula-label">X-EKSENİ YANSIMASI</div><div class="formula-main">$$y = -f(x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0,\\, -y_0)$$</div><div class="formula-sub">$y = 0$ yatay doğrusuna göre ayna görüntüsü.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = x^2$'den (tepesi orijinde yukarı açılan parabol) başlayarak $g(x) = -x^2$ nedir?<br><br>Her y-değeri işaret değiştirir. Parabol şimdi <strong>aşağı açılır</strong>, tepesi hâlâ $(0,\\, 0)$, ama eğrinin geri kalanı şimdi alt yarı düzlemde yaşar. $(2,\\, 4)$ noktası $(2,\\, -4)$ olur.</div></div>

<div class="calc-graph"><div id="plot-l42-xrefl-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x^2$ yukarı açılarak mavide ve x-ekseni yansıması $y = -x^2$ aşağı açılarak kırmızıda. Aynı tepeyi paylaşırlar ama yatay eksen boyunca birbirlerinin ayna görüntüleridir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];
for(var i=-50;i<=50;i++){var x=i/10;xs.push(x);y0.push(x*x);y1.push(-x*x);}
var t0={x:xs,y:y0,mode:'lines',name:'y = x²',line:{color:'#3b82f6',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = −x²',line:{color:'#ef4444',width:2.5}};
var ax={x:[-5,5],y:[0,0],mode:'lines',name:'x-ekseni (ayna)',line:{color:'rgba(255,255,255,0.4)',width:1,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-12,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-xrefl-tr',[t0,t1,ax],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. y-Ekseni Yansıma — y = f(&minus;x)</h2>

<div class="calc-highlight"><strong>Kural:</strong> $y = f(-x)$ grafiği <em>y-eksenine</em> göre soldan sağa çevirir. Her x-değeri işaret değiştirir; y-ekseninin sağındaki noktalar soluna geçer, soldakiler sağa. y-değerleri değişmez.</div>

<p class="l-text">Eksi işareti fonksiyonun içindedir, dolayısıyla girdiye etki eder. $x$ yerine $-x$ koymak şu demektir: yeni $x_0$ koordinatında, $f$'nin $-x_0$'da ne yaptığına bak. Sonuç, y-eksenine göre yatay ayna görüntüsüdür.</p>

<div class="calc-formula"><div class="formula-label">Y-EKSENİ YANSIMASI</div><div class="formula-main">$$y = f(-x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (-x_0,\\, y_0)$$</div><div class="formula-sub">$x = 0$ dikey doğrusuna göre ayna görüntüsü.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = \\sqrt{x}$'ten ($x \\geq 0$ için tanımlı, yan yatmış yarım parabol, orijinden başlar sağa-yukarı kıvrılır) başlayarak $g(x) = \\sqrt{-x}$ nedir?<br><br>Tanım kümesi terslenir: $-x \\geq 0$ yani $x \\leq 0$. Yani grafik şimdi sol yarı düzlemde yaşar. Orijinden başlar ve sola-yukarı kıvrılır. Orijinal grafikteki $(4,\\, 2)$ noktası, yansımış grafikte $(-4,\\, 2)$ olur.</div></div>

<div class="calc-graph"><div id="plot-l42-yrefl-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = \\sqrt{x}$ mavide ($x \\geq 0$ için tanımlı) ve y-ekseni yansıması $y = \\sqrt{-x}$ kırmızıda ($x \\leq 0$ için tanımlı). İki eğri orijinde buluşur ve dikey eksene göre birbirini yansıtır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs1=[];var y1=[];var xs2=[];var y2=[];
for(var i=0;i<=50;i++){var x=i/10;xs1.push(x);y1.push(Math.sqrt(x));xs2.push(-x);y2.push(Math.sqrt(x));}
var t1={x:xs1,y:y1,mode:'lines',name:'y = √x',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs2,y:y2,mode:'lines',name:'y = √(−x)',line:{color:'#ef4444',width:2.5}};
var ay={x:[0,0],y:[-1,4],mode:'lines',name:'y-ekseni (ayna)',line:{color:'rgba(255,255,255,0.4)',width:1,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.5,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-yrefl-tr',[t1,t2,ay],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Simetri kısa yolu:</strong> bir fonksiyon her $x$ için $f(-x) = f(x)$ koşulunu sağlıyorsa (<em>çift</em> fonksiyon — $x^2$ veya $\\cos x$ gibi), y-ekseni yansıması kendisiyle aynıdır — resim değişmez. Eğer $f(-x) = -f(x)$ ise (<em>tek</em> fonksiyon — $x^3$ veya $\\sin x$ gibi), y-ekseni yansıması x-ekseni yansımasına eşittir.</div>

<h2 class="lesson-title">6. Dikey Genişletme / Sıkıştırma — y = a &middot; f(x)</h2>

<div class="calc-highlight"><strong>Kural:</strong> $y = a \\cdot f(x)$ her y-değerini $a$ ile çarpar. $|a| > 1$ ise grafik dikey olarak <em>genişler</em> (daha uzun ve dar). $0 < |a| < 1$ ise grafik dikey olarak <em>sıkışır</em> (daha kısa ve geniş). $a < 0$ ise ek olarak x-ekseni yansıması da uygulanır.</div>

<p class="l-text">Fonksiyonun dışındaki $a$ sabiti çıktıyı yeniden ölçeklendirir. Yükseklikler $a$ kat büyür. x-kesişimleri ($f(x) = 0$ olan yerler) sabit kalır çünkü $a \\cdot 0 = 0$. Maksimumlar $a$ kat yükselir, minimumlar $a$ kat düşer. Bu, x-eksenine göre <em>dikey</em> bir ölçeklendirmedir.</p>

<div class="calc-formula"><div class="formula-label">DİKEY ÖLÇEKLEME — ÖZET</div><div class="formula-main">$$y = a \\cdot f(x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; (x_0,\\, a\\,y_0)$$</div><div class="formula-sub">x-koordinatları değişmez. y-koordinatları $a$ ile çarpılır. $a$ negatifse grafik ayrıca x-eksenine göre yansır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a = 2$</div><div class="card-body">Dikey genişletme, 2 katı. Yükseklikler iki katına çıkar. Grafik "daha uzun ve dar" görünür.</div></div>
<div class="calc-card"><div class="card-title">$a = 1/2$</div><div class="card-body">Dikey sıkıştırma, 2 katı. Yükseklikler yarıya iner. Grafik "daha kısa ve düz" görünür.</div></div>
<div class="calc-card"><div class="card-title">$a = -1$</div><div class="card-body">Saf x-ekseni yansıması. Yüksekliklerin büyüklüğü korunur ama işaret değişir. 4. bölümün özel hali.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = x^2$'den başlayarak $g(x) = 3x^2$ ve $h(x) = 0.5\\,x^2$ grafiklerini çiz.<br><br>$g(x) = 3x^2$: her y-değeri üçe katlanır. $x = 1$'de orijinal $1$, yeni $3$. $x = 2$'de orijinal $4$, yeni $12$. Parabol <strong>daha dar ve dik</strong>.<br><br>$h(x) = 0.5\\,x^2$: her y-değeri yarıya iner. $x = 2$'de orijinal $4$, yeni $2$. Parabol <strong>daha geniş ve yatık</strong>.<br><br>Her iki durumda da tepe orijinde kalır.</div></div>

<div class="calc-graph"><div id="plot-l42-vstretch-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ana parabol $y = x^2$ beyazda, dikey genişlemiş $y = 3x^2$ mavide (daha dar, dik) ve dikey sıkışmış $y = 0.5\\,x^2$ kırmızıda (daha geniş, yatık). Üçü de $(0, 0)$ tepesini paylaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);y0.push(x*x);y1.push(3*x*x);y2.push(0.5*x*x);}
var t0={x:xs,y:y0,mode:'lines',name:'y = x²',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = 3x² (genişleme)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = 0.5 x² (sıkışma)',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-vstretch-tr',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Yatay Genişletme / Sıkıştırma — y = f(bx)</h2>

<div class="calc-highlight"><strong>Kural:</strong> $y = f(bx)$ x'i yeniden ölçeklendirir. $|b| > 1$ ise grafik yatayda <em>sıkışır</em> (daha dar). $0 < |b| < 1$ ise grafik yatayda <em>genişler</em> (daha geniş). $b < 0$ ise ek olarak y-ekseni yansıması da uygulanır. <strong>Yön, beklenenin tersidir</strong>, tıpkı yatay kaydırmada olduğu gibi.</div>

<p class="l-text">$b$ sabiti girdiye etki eder, dolayısıyla "ters" çalışır. $f(bx)$'in $x_0$ noktasında ne yaptığını görmek için $f$'ye $b\\,x_0$ girdisinde bakarız. $b = 2$ ise $f$'ye orijine olan uzaklığın iki katında bakıyoruz — yani orijinal grafiğin yeni x'e gelmek için 2 kat <em>içeri büzülmesi</em> gerekir. Genişlik daralır. $b = 1/2$ ise yarı uzaklıkta bakıyoruz — yani grafik 2 kat dışarı yayılır.</p>

<div class="calc-formula"><div class="formula-label">YATAY ÖLÇEKLEME — ÖZET</div><div class="formula-main">$$y = f(b\\,x) \\quad\\Longrightarrow\\quad (x_0,\\, y_0) \\;\\mapsto\\; \\Big(\\tfrac{x_0}{b},\\, y_0\\Big)$$</div><div class="formula-sub">y-koordinatları değişmez. x-koordinatları $b$'ye bölünür. Bölme işlemine dikkat — sözleşmenin tersine işlemesinin sebebi budur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$b = 2$</div><div class="card-body">Yatay <strong>sıkışma</strong>, 2 katı. Grafik y-eksenine doğru ezilir.</div></div>
<div class="calc-card"><div class="card-title">$b = 1/2$</div><div class="card-body">Yatay <strong>genişleme</strong>, 2 katı. Grafik y-ekseninden uzağa yayılır.</div></div>
<div class="calc-card"><div class="card-title">$b = -1$</div><div class="card-body">Saf y-ekseni yansıması. 5. bölümün özel hali.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = \\sin x$'ten ($x = 0$ ile $x = 2\\pi$ arasında bir tam dalga) başlayarak $g(x) = \\sin(2x)$ ve $h(x) = \\sin(x/2)$'yi tarif et.<br><br>$g(x) = \\sin(2x)$: $b = 2$, yani dalga yatayda 2 kat <strong>sıkışır</strong>. Bir tam dalga şimdi $0$ ile $2\\pi$ yerine $0$ ile $\\pi$ arasına sığar. Periyot yarıya iner.<br><br>$h(x) = \\sin(x/2)$: $b = 1/2$, yani dalga yatayda 2 kat <strong>genişler</strong>. Bir tam dalga şimdi $0$'dan $4\\pi$'ye kadar yer ister. Periyot iki katına çıkar.<br><br>Dalganın yükseklikleri (genlik) <em>değişmez</em>.</div></div>

<div class="calc-graph"><div id="plot-l42-hstretch-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\sin x$ beyazda (periyot $2\\pi$), $\\sin 2x$ mavide (periyot $\\pi$ — iki kat hızlı) ve $\\sin(x/2)$ kırmızıda (periyot $4\\pi$ — iki kat yavaş). Her dalganın genliği aynı (1); yalnızca yatay ölçek değişir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y1=[];var y2=[];
for(var i=0;i<=400;i++){var x=i*4*Math.PI/400;xs.push(x);y0.push(Math.sin(x));y1.push(Math.sin(2*x));y2.push(Math.sin(x/2));}
var t0={x:xs,y:y0,mode:'lines',name:'y = sin x',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:y1,mode:'lines',name:'y = sin 2x',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'y = sin(x/2)',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (radyan)',range:[0,4*Math.PI],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-hstretch-tr',[t0,t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">YAN YANA KARŞILAŞTIRMA</div><div class="think-body">Dikey: $a = 2$ grafiği <strong>genişletir</strong>. Yatay: $b = 2$ grafiği <strong>sıkıştırır</strong>. Aynı sayı, zıt etki — çünkü "fonksiyonun dışı" cevabı doğrudan çarparken, "fonksiyonun içi" cevaba daha büyük bir girdi besleyerek ulaşır, bu da fiili olarak x-eksenini büzüştürür.</div></div>

<h2 class="lesson-title">8. Birleşik Dönüşüm — y = a &middot; f(b(x &minus; h)) + k</h2>

<div class="calc-highlight"><strong>Sıra önemlidir.</strong> Yanlış sırada uygulanan beş işlem yanlış resmi verir. Güvenli, daima-doğru sıra şudur: <strong>(1) yatay genişletme, (2) yatay kaydırma, (3) dikey genişletme, (4) dikey kaydırma.</strong> Yansımalar (negatif $a$ veya $b$) (1) ve (3) adımlarının içinde otomatik olarak gerçekleşir.</div>

<p class="l-text">Neden bu sıra? Formülün nasıl kurulduğu yüzünden. $y = a \\cdot f\\big(b(x - h)\\big) + k$ ifadesini içten dışa oku. En içte girdi dönüşümü $b(x - h)$ var — bunun iki adımı var: önce kaydır ($h$ çıkar), sonra ölçeklendir ($b$ ile çarp). Ancak yatay dönüşümlerin asimetrisi yüzünden, bunu <em>grafiğe</em> uygulanan bir hareket dizisi olarak yeniden okuduğunda fiili sıra şu olur: önce $1/b$ ile yatay genişletme, sonra $h$ ile yatay kaydırma. Ondan sonra dış çarpım $a$ (dikey genişletme / yansıma) ve en son $k$'nın eklenmesi (dikey kaydırma) gelir.</p>

<div class="calc-formula"><div class="formula-label">DÖRT ADIMLI TARİF</div><div class="formula-main">$$y = f(x) \\;\\;\\xrightarrow{\\text{1. x'i } 1/b \\text{ ile ölçeklendir}}\\;\\; y = f(bx) \\;\\;\\xrightarrow{\\text{2. sağa } h \\text{ kaydır}}\\;\\; y = f(b(x-h))$$ $$\\xrightarrow{\\text{3. y'yi } a \\text{ ile ölçeklendir}}\\;\\; y = a\\,f(b(x-h)) \\;\\;\\xrightarrow{\\text{4. yukarı } k \\text{ kaydır}}\\;\\; y = a\\,f(b(x-h)) + k$$</div><div class="formula-sub">Bu dört adımı tam olarak bu sırayla izle. Parametresi özdeşlik değerinde olan adımları ($a = 1$, $b = 1$, $h = 0$, $k = 0$) atla.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TAM BİR DÖNÜŞÜM</div><div class="example-body">$y = 2(x - 1)^2 + 3$ grafiğini çiz.<br><br>Burada $a = 2$, $b = 1$, $h = 1$, $k = 3$. $f(x) = x^2$'den başla:<br><br>Adım 1: Yatay ölçekleme — $b = 1$, yatay genişletme yok.<br>Adım 2: Sağa $1$ birim kaydır. Tepe $(1, 0)$'a gelir.<br>Adım 3: Dikey olarak $2$ ile genişlet. Parabol daha dar olur. Tepe hâlâ $(1, 0)$.<br>Adım 4: Yukarı $3$ birim kaydır. Tepe $(1, 3)$'e gelir.<br><br>Sonuç: tepesi $(1,\\, 3)$'de yukarı açılan, ana paraboldan 2 kat dar bir parabol.</div></div>

<div class="calc-graph"><div id="plot-l42-combined-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ana $y = x^2$ beyazda ve $y = 2(x-1)^2 + 3$'e adım adım dönüşüm. Her renk tarifin bir adımını izler — böylece tepenin sağa kaymasını, sonra eğrinin daralmasını, sonra her şeyin yükselmesini görebilirsin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y0=[];var y2=[];var y3=[];var y4=[];
for(var i=-30;i<=50;i++){var x=i/10;xs.push(x);y0.push(x*x);y2.push((x-1)*(x-1));y3.push(2*(x-1)*(x-1));y4.push(2*(x-1)*(x-1)+3);}
var t0={x:xs,y:y0,mode:'lines',name:'ana y = x²',line:{color:'rgba(255,255,255,0.5)',width:2,dash:'dot'}};
var t2={x:xs,y:y2,mode:'lines',name:'adım 2: sağa kayma',line:{color:'#10b981',width:2}};
var t3={x:xs,y:y3,mode:'lines',name:'adım 3: 2 ile genişleme',line:{color:'#3b82f6',width:2}};
var t4={x:xs,y:y4,mode:'lines',name:'adım 4: 3 yukarı kayma',line:{color:'#ef4444',width:3}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-1,14],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-combined-tr',[t0,t2,t3,t4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Parantezlere dikkat:</strong> $2(x - 1)^2 + 3$ ifadesinde $3$ sabiti dışarıdadır — grafiği yukarı kaydırır. Ama $2(x - 1)^2 + 3$ ile $(2x - 1)^2 + 3$ çok farklı şeylerdir. İkincide iç ifade $2x - 1 = 2(x - 1/2)$'dir, yani yatay kayma $1/2$ kadardır, $1$ değil, ve 2 katı yatay sıkışma vardır. Her zaman önce iç ifadeyi çarpan parantezine al.</div>

<h2 class="lesson-title">9. Çözümlü Örnekler — Üç Ana Fonksiyon</h2>

<p class="l-text">Sözlüğü pekiştirmek için üç kısa örnek. Her birinde ana fonksiyonu belirle, parametreleri listele, sonra çiz.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — PARABOL</div><div class="example-body">$y = -(x + 2)^2 + 4$.<br><br>Ana: $f(x) = x^2$. $y = -1 \\cdot (x - (-2))^2 + 4$ olarak yeniden yaz, yani $a = -1$, $h = -2$, $k = 4$.<br><br>Adımlar: sola 2 kaydır &rarr; tepe $(-2, 0)$. x-eksenine göre yansıt ($a = -1$ olduğundan) &rarr; parabol aşağı açılır, tepe hâlâ $(-2, 0)$. Yukarı 4 kaydır &rarr; tepe $(-2, 4)$.<br><br>Son resim: <strong>tepesi $(-2,\\, 4)$ olan aşağı açılan parabol</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — MUTLAK DEĞER</div><div class="example-body">$y = 3 |x - 1| - 2$.<br><br>Ana: $f(x) = |x|$. Burada $a = 3$, $h = 1$, $k = -2$.<br><br>Adımlar: sağa 1 kaydır &rarr; tepe $(1, 0)$. Dikey 3 ile genişlet &rarr; V daha dar, eğimler $\\pm 1$ yerine $\\pm 3$. Aşağı 2 kaydır &rarr; tepe $(1, -2)$.<br><br>Son resim: <strong>tepesi $(1,\\, -2)$ olan, kolları $\\pm 3$ eğimli dar V şekli</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — SİNÜZOİD</div><div class="example-body">$y = 2\\sin\\!\\Big(\\dfrac{x}{2}\\Big) + 1$.<br><br>Ana: $f(x) = \\sin x$. Burada $a = 2$, $b = 1/2$, $h = 0$, $k = 1$.<br><br>Adımlar: yatay 2 ile genişlet ($b = 1/2$ olduğundan) &rarr; periyot $4\\pi$ olur. Dikey 2 ile genişlet &rarr; genlik 2 olur (dalga $-2$ ile $+2$ arasında salınır). Yukarı 1 kaydır &rarr; dalga şimdi $y = 1$ orta çizgisi etrafında $-1$ ile $+3$ arasında salınır.<br><br>Son resim: <strong>periyodu $4\\pi$, genliği 2, $y = 1$'e ortalanmış yavaş ve uzun bir sinüs dalgası</strong>.</div></div>

<div class="calc-graph"><div id="plot-l42-examples-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç çözümlü örnek aynı eksende çiziliyor — böylece tepe / orta çizgi / yönü doğrudan okuyabilirsin. Her durumda ana şeklin korunduğuna dikkat et — yalnızca konum, yön ve ölçek değişir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y1=[];var y2=[];var y3=[];
for(var i=-60;i<=60;i++){var x=i/10;xs.push(x);y1.push(-(x+2)*(x+2)+4);y2.push(3*Math.abs(x-1)-2);y3.push(2*Math.sin(x/2)+1);}
var t1={x:xs,y:y1,mode:'lines',name:'Ör 1: −(x+2)² + 4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'Ör 2: 3|x−1| − 2',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:y3,mode:'lines',name:'Ör 3: 2 sin(x/2) + 1',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-6,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-examples-tr',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Alıştırmalar</h2>

<p class="l-text">İleri (formülden grafik bul) ve geri (grafikten formül bul) akıl yürütmeyi birleştiren sekiz problem. Cevaba bakmadan önce her birini kağıt üzerinde dene.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Soru.</strong> $y = (x - 5)^2$ grafiğinin $y = x^2$ grafiğiyle ilişkisini sözcüklerle anlat.<br><br><strong>Cevap.</strong> Grafik 5 birim sağa kaymıştır. Yeni tepe: $(5, 0)$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Soru.</strong> $y = x^2 + 7$ grafiğinin $y = x^2$ grafiğiyle ilişkisini sözcüklerle anlat.<br><br><strong>Cevap.</strong> Grafik 7 birim yukarı kaymıştır. Yeni tepe: $(0, 7)$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Soru.</strong> $y = -(x + 3)^2 + 5$ parabolünün tepesi nedir?<br><br><strong>Cevap.</strong> $h = -3$ ve $k = 5$, yani tepe $(-3, 5)$'tir. $a = -1$ olduğundan parabol aşağı açılır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Soru.</strong> Bir $f$ fonksiyonu için $f(2) = 7$. $g(x) = f(x - 3) + 4$ ise $g(5)$ nedir?<br><br><strong>Cevap.</strong> $g(5) = f(5 - 3) + 4 = f(2) + 4 = 7 + 4 = 11$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Soru.</strong> $y = |x|$ grafiği sola 4 birim kaydırılır, x-eksenine göre yansıtılır ve aşağı 2 birim kaydırılır. Yeni grafiğin denklemini yaz.<br><br><strong>Cevap.</strong> Sola kayma: $|x + 4|$. x-eksenine yansıt: $-|x + 4|$. Aşağı 2 kaydır: $\\boxed{y = -|x + 4| - 2}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>Soru.</strong> Bir sinüs dalgası dikeyde 3 kat genişletildi, yatayda 2 kat sıkıştırıldı ve yukarı 1 birim kaydırıldı. Denklemini yaz.<br><br><strong>Cevap.</strong> Yatay 2 kat sıkışma $b = 2$ demek. Dikey 3 kat genişleme $a = 3$. Yukarı 1 kayma $k = 1$. Sonuç: $\\boxed{y = 3\\sin(2x) + 1}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body"><strong>Soru.</strong> $y = x^2$ parabolü y-eksenine göre yansıtılırsa grafik değişir mi?<br><br><strong>Cevap.</strong> Hayır. $y = (-x)^2 = x^2$ fonksiyonu orijinaliyle aynıdır çünkü $x^2$ <em>çift</em> bir fonksiyondur. Grafik y-eksenine göre simetriktir, dolayısıyla y-eksenine göre yansıtmak aynı resmi üretir.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body"><strong>Soru.</strong> $y = 2(x - 1)^2$ ile $y = (2x - 1)^2$ arasındaki farkı (sözlü olarak) tarif et.<br><br><strong>Cevap.</strong> Birincide $a = 2$, $h = 1$ — sağa 1 birim kaymış ve dikeyde 2 kat genişlemiş bir parabol. İkincisi $(2(x - 1/2))^2$ olarak çarpana ayrılır, yani sağa $1/2$ birim kaymış <em>ve</em> yatayda 2 kat sıkışmış bir parabol. Aynı aile, farklı tepe (biri $x = 1$'de, diğeri $x = 1/2$'de) ve farklı şekil.</div></div>

<h2 class="lesson-title">11. Bir Ana Fonksiyon, Beş Dönüşüm — Yan Yana</h2>

<p class="l-text">Pekiştirmek için, ana fonksiyon $f(x) = x^2$ ile birlikte üzerine uygulanmış beş standart hareketi tek bir panelde gösteren bir grafik. Her renk bir dönüşüm türüne karşılık geliyor; böylece aynı başlangıç şekline uygulanan her hareketin görsel etkisini bir bakışta karşılaştırabilirsin.</p>

<div class="calc-graph"><div id="plot-l42-five-tr-extra" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ana fonksiyon $f(x) = x^2$ beyaz renkte, üzerine bindirilmiş beş dönüşümle birlikte. Mavi: $f(x-2)$ (sağa kayma). Yeşil: $f(x)+3$ (yukarı kayma). Kırmızı: $-f(x)$ (x-eksenine göre yansıma). Sarı: $f(-x)$ (y-eksenine göre yansıma — $x^2$ çift fonksiyon olduğu için ana grafikle örtüşür). Macenta: $2f(x)$ (2 katı dikey genişletme).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var yp=[];var yhs=[];var yvs=[];var yxr=[];var yyr=[];var yvst=[];
for(var i=-60;i<=60;i++){var x=i/10;xs.push(x);yp.push(x*x);yhs.push((x-2)*(x-2));yvs.push(x*x+3);yxr.push(-x*x);yyr.push((-x)*(-x));yvst.push(2*x*x);}
var tp={x:xs,y:yp,mode:'lines',name:'ana f(x) = x²',line:{color:'#e8e8e8',width:2.5}};
var t1={x:xs,y:yhs,mode:'lines',name:'f(x−2) — sağa kayma',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:yvs,mode:'lines',name:'f(x) + 3 — yukarı kayma',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:yxr,mode:'lines',name:'−f(x) — x-ekseni yansıması',line:{color:'#ef4444',width:2.5}};
var t4={x:xs,y:yyr,mode:'lines',name:'f(−x) — y-ekseni yansıması',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var t5={x:xs,y:yvst,mode:'lines',name:'2 f(x) — dikey genişletme',line:{color:'#ec4899',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-14,16],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l42-five-tr-extra',[tp,t1,t2,t3,t4,t5],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Aşağıdaki özet tablo altı dönüşüm ailesinin tümünü tek yerde toplar — sözlüğün maddelerini yan yana taramak için.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.9rem;color:rgba(235,230,220,0.92);background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.12);color:#3b82f6;text-align:left">
<th style="padding:0.7rem 0.9rem;font-weight:700;letter-spacing:0.04em;font-size:0.78rem;border-bottom:1px solid rgba(59,130,246,0.25)">DÖNÜŞÜM</th>
<th style="padding:0.7rem 0.9rem;font-weight:700;letter-spacing:0.04em;font-size:0.78rem;border-bottom:1px solid rgba(59,130,246,0.25)">KURAL</th>
<th style="padding:0.7rem 0.9rem;font-weight:700;letter-spacing:0.04em;font-size:0.78rem;border-bottom:1px solid rgba(59,130,246,0.25)">GRAFİK ÜZERİNDEKİ ETKİ</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Dikey kayma</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = f(x) + k$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$k$ kadar yukarı ($k>0$) ya da aşağı ($k<0$) kayar. Gördüğün işaretle aynı yön.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Yatay kayma</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = f(x - h)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$h$ kadar sağa ($h>0$) ya da sola ($h<0$) kayar. Gördüğün işaretin <strong>tersi</strong>.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Dikey yansıma</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = -f(x)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">x-eksenine göre yansır. Her $y_0 \\mapsto -y_0$.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Yatay yansıma</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = f(-x)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">y-eksenine göre yansır. Her $x_0 \\mapsto -x_0$.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Dikey genişletme / sıkıştırma</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$y = a \\cdot f(x)$</td><td style="padding:0.65rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$|a|>1$ genişletir (daha uzun). $0<|a|<1$ sıkıştırır (daha basık). $a<0$ ayrıca x-eksenine göre yansıtır.</td></tr>
<tr><td style="padding:0.65rem 0.9rem;font-weight:600">Yatay genişletme / sıkıştırma</td><td style="padding:0.65rem 0.9rem">$y = f(b\\,x)$</td><td style="padding:0.65rem 0.9rem">$|b|>1$ <strong>sıkıştırır</strong> (daha dar). $0<|b|<1$ <strong>genişletir</strong> (daha geniş). $b<0$ ayrıca y-eksenine göre yansıtır. Dikey duruma göre <strong>ters sözleşme</strong>.</td></tr>
</tbody>
</table>
</div>

<div class="lesson-outcomes" style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$y = f(x - h)$ sağa $h$ kadar kayar ($h < 0$ ise sola). <strong>Yön gördüğün işaretin tersidir</strong>.</li>
<li>$y = f(x) + k$ yukarı $k$ kadar kayar ($k < 0$ ise aşağı). Yön $k$'nın işaretiyle aynıdır.</li>
<li>$y = -f(x)$ x-eksenine göre yansıtır. $y = f(-x)$ y-eksenine göre yansıtır.</li>
<li>$y = a\\,f(x)$ dikeyde $|a|$ ile ölçeklendirir ($|a|>1$ genişletir, $|a|<1$ sıkıştırır).</li>
<li>$y = f(bx)$ yatayda $1/|b|$ ile ölçeklendirir — <strong>ters sözleşme</strong>: $b > 1$ sıkıştırır, $b < 1$ genişletir.</li>
<li>Sıra: yatay genişletme &rarr; yatay kaydırma &rarr; dikey genişletme &rarr; dikey kaydırma.</li>
</ul>
</div>`

};
