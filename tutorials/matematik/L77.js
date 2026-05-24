window.LISE_MAT_L77 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A straight line is the simplest curve in mathematics, and the equation of a line is the simplest equation in coordinate geometry.</strong> Every road on a map, every ramp in a building, every trend line in a graph of data — all of them are pieces of straight lines, and all of them can be captured by a single linear equation in two variables. The job of this lesson is to give you fluency with the four standard forms of that equation, the geometric meaning of each piece, and the routine procedures for switching between them.</p>

<p class="l-text">By the end of the lesson you will be able to read a line off a graph and write its equation, read an equation and sketch the corresponding line, convert between the slope-intercept, point-slope, two-point, general, and intercept forms without hesitation, and compute the perpendicular distance from any point to any line. These are the bread-and-butter techniques of analytic geometry — they show up again in calculus (tangent lines), in linear algebra (lines as one-dimensional subspaces), and in every applied science where one quantity depends linearly on another.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the slope (gradient) of a line as rise over run and read its sign from the picture</li>
<li>Write the equation of a line in slope-intercept form $y = mx + b$ and identify $m$ and $b$ geometrically</li>
<li>Derive and use the point-slope form $y - y_1 = m(x - x_1)$ when a single point and the slope are given</li>
<li>Find the equation of the unique line through two given points using the two-point form</li>
<li>Convert between the slope-intercept, general $Ax + By + C = 0$, and intercept $x/a + y/b = 1$ forms</li>
<li>Handle vertical and horizontal lines as the two exceptional cases ($x = c$ and $y = c$)</li>
<li>Apply the distance formula $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$ from a point to a line</li>
</ul>
</div>

<h2 class="lesson-title">1. The Slope of a Line</h2>
<div class="calc-highlight"><strong>Everyday picture:</strong> a ramp. If the ramp climbs 1 metre for every 4 metres you walk forward, you would call it a "1 in 4" slope. Mathematicians write that as the fraction $1/4$, and they call that fraction the <em>slope</em> or <em>gradient</em> of the ramp. A steeper ramp has a bigger fraction; a downhill ramp gets a negative sign; a perfectly flat floor has slope zero.</div>

<p class="l-text">Take any two distinct points $A(x_1, y_1)$ and $B(x_2, y_2)$ on a line. As you walk from $A$ to $B$, the horizontal change is $x_2 - x_1$ (the "run") and the vertical change is $y_2 - y_1$ (the "rise"). The <strong>slope</strong> $m$ is the ratio:</p>

<div class="calc-formula"><div class="formula-label">SLOPE &mdash; DEFINITION</div><div class="formula-main">$$m \\;=\\; \\frac{\\text{rise}}{\\text{run}} \\;=\\; \\frac{y_2 - y_1}{x_2 - x_1}$$</div><div class="formula-sub">Two points determine the slope. It does not matter which one you call $A$ and which $B$, as long as you subtract in the same order in both numerator and denominator.</div></div>

<p class="l-text"><strong>Why is the slope a property of the whole line, not just the pair of points?</strong> Because of similar triangles. Drop a right triangle off any two points of the line and the ratio rise/run is the same — it is determined by the angle the line makes with the x-axis. In fact, if $\\alpha$ is that angle, then $m = \\tan\\alpha$, which is why slope is sometimes called the <em>angular coefficient</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Positive slope ($m > 0$)</div><div class="card-body">The line rises as you walk to the right. Example: $m = 2$ means the line goes up 2 units for every 1 unit right.</div></div>
<div class="calc-card"><div class="card-title">Negative slope ($m < 0$)</div><div class="card-body">The line falls as you walk to the right. Example: $m = -1/2$ means the line drops half a unit for every 1 unit right.</div></div>
<div class="calc-card"><div class="card-title">Zero slope ($m = 0$)</div><div class="card-body">The line is perfectly horizontal. Same y-value everywhere. Equation form: $y = c$.</div></div>
<div class="calc-card"><div class="card-title">Undefined slope</div><div class="card-body">The line is perfectly vertical. The denominator $x_2 - x_1$ is zero, so the fraction is undefined. Equation form: $x = c$.</div></div>
</div>

<div class="calc-graph"><div id="plot-l77-slopes-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> four lines through the origin with different slopes. The blue $m = 2$ climbs steeply; the green $m = 1/2$ climbs gently; the orange $m = 0$ is the horizontal x-axis itself; the red $m = -1$ goes downhill. The vertical line at $x = 2$ (dashed) has undefined slope. Compare the angle each line makes with the x-axis to its slope value.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-3;i<=3.01;i+=0.1)xs.push(i);
var line1={x:xs,y:xs.map(function(x){return 2*x;}),mode:'lines',name:'m = 2',line:{color:'#3b82f6',width:3}};
var line2={x:xs,y:xs.map(function(x){return 0.5*x;}),mode:'lines',name:'m = 1/2',line:{color:'#10b981',width:3}};
var line3={x:xs,y:xs.map(function(x){return 0;}),mode:'lines',name:'m = 0',line:{color:'#f59e0b',width:3}};
var line4={x:xs,y:xs.map(function(x){return -x;}),mode:'lines',name:'m = −1',line:{color:'#ef4444',width:3}};
var vert={x:[2,2],y:[-3,3],mode:'lines',name:'m undefined',line:{color:'#a78bfa',width:3,dash:'dash'}};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l77-slopes-en',[line1,line2,line3,line4,vert],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the slope of the line through $A(1, 2)$ and $B(4, 11)$.<br><br>$m = \\dfrac{11 - 2}{4 - 1} = \\dfrac{9}{3} = \\mathbf{3}$.<br><br>Interpretation: the line rises 3 units for every 1 unit to the right. Check by swapping the points: $m = (2 - 11)/(1 - 4) = (-9)/(-3) = 3$. Same answer — the order of the points does not matter.</div></div>

<div class="l-note"><strong>Geometric meaning of the rise/run picture:</strong> draw the line, then draw a small right-angled triangle whose hypotenuse lies on the line. The horizontal leg is the run, the vertical leg is the rise, and the slope is the (signed) ratio. Make the triangle bigger or smaller — the ratio stays the same. This is the geometric content of the formula.</div>

<div class="calc-graph"><div id="plot-l77-riserun-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the line $y = (3/4)x + 1$ with two rise-over-run triangles drawn off it. The small triangle has run $= 4$ and rise $= 3$; the big triangle has run $= 8$ and rise $= 6$. Both give the same slope $m = 3/4$. Slope is a property of the line, not the triangle.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];for(var i=-1;i<=8.01;i+=0.1)xL.push(i);
var lineMain={x:xL,y:xL.map(function(x){return 0.75*x+1;}),mode:'lines',name:'y = (3/4)x + 1',line:{color:'#3b82f6',width:3}};
var tri1={x:[0,4,4,0],y:[1,1,4,1],mode:'lines',name:'small: run 4, rise 3',line:{color:'#10b981',width:2.5},fill:'toself',fillcolor:'rgba(16,185,129,0.12)'};
var tri2={x:[0,8,8,0],y:[1,1,7,1],mode:'lines',name:'big: run 8, rise 6',line:{color:'#f59e0b',width:2,dash:'dot'}};
var ann={x:[2,4.4,4,8.4,8],y:[0.5,2.4,3.6,3.5,6.4],mode:'text',name:'labels',text:['run = 4','rise = 3','','run = 8','rise = 6'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-0.5,8.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l77-riserun-en',[lineMain,tri1,tri2,ann],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Slope-Intercept Form</h2>
<div class="calc-highlight"><strong>The slope-intercept form is the workhorse of high-school algebra.</strong> Every non-vertical line can be written in the shape $y = mx + b$ where $m$ is the slope and $b$ is the y-intercept (the value of $y$ where the line crosses the y-axis). Two numbers, one equation, one picture.</div>

<div class="calc-formula"><div class="formula-label">SLOPE-INTERCEPT FORM</div><div class="formula-main">$$y \\;=\\; m\\,x \\;+\\; b$$</div><div class="formula-sub">$m$ is the slope, $b$ is the y-intercept. The line passes through the point $(0, b)$ and rises by $m$ for every 1-unit step to the right.</div></div>

<p class="l-text"><strong>How to read the equation off a graph.</strong> Look for two pieces: (1) where does the line cross the y-axis? That y-value is $b$. (2) From that crossing, walk one unit to the right; how far up (or down) does the line go? That number is $m$.</p>

<p class="l-text"><strong>How to sketch the line from the equation.</strong> Same two pieces in reverse. Plot the point $(0, b)$ on the y-axis. From there, use the slope as a "step instruction": rise $m$ for every run 1. Mark a second point and draw the line through them.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Sketch the line $y = -2x + 3$.<br><br>Identify $m = -2$ and $b = 3$. Start at the y-intercept $(0, 3)$. Slope $-2$ means: walk 1 right, drop 2 down. So a second point is $(1, 1)$. A third: walk another 1 right, drop another 2 — $(2, -1)$. Connect with a straight line.</div></div>

<div class="l-note"><strong>What makes this form special:</strong> the two numbers $m$ and $b$ are <em>geometrically meaningful</em>. $m$ is the steepness, $b$ is the height above (or below) the origin. You read both off the picture without doing any algebra.</div>

<h2 class="lesson-title">3. Point-Slope Form</h2>
<div class="calc-highlight"><strong>When the problem hands you the slope and a single point, the point-slope form is the fastest route to the equation.</strong> No algebra to solve, no system to set up — just plug the two pieces in.</div>

<p class="l-text">Start with the definition of slope between a known point $(x_1, y_1)$ and a generic point $(x, y)$ on the line:</p>

<div class="calc-formula"><div class="formula-label">DERIVATION FROM THE SLOPE DEFINITION</div><div class="formula-main">$$m \\;=\\; \\frac{y - y_1}{x - x_1} \\quad\\Longrightarrow\\quad y - y_1 \\;=\\; m(x - x_1)$$</div><div class="formula-sub">Multiply both sides by $x - x_1$. The result is the point-slope form. The known point $(x_1, y_1)$ is anchored on the line; the slope $m$ tells you the direction.</div></div>

<div class="calc-formula"><div class="formula-label">POINT-SLOPE FORM</div><div class="formula-main">$$y - y_1 \\;=\\; m\\,(x - x_1)$$</div><div class="formula-sub">Best used when you know one point on the line and the slope. To convert to slope-intercept form, just distribute and rearrange.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the equation of the line with slope $m = -3$ passing through the point $(2, 5)$.<br><br>Plug into point-slope: $y - 5 = -3(x - 2)$.<br><br>Convert to slope-intercept: $y - 5 = -3x + 6 \\implies \\mathbf{y = -3x + 11}$.<br><br>Verification: substitute $(2, 5)$: $y = -3(2) + 11 = 5$. Correct.</div></div>

<h2 class="lesson-title">4. Two-Point Form</h2>
<div class="calc-highlight"><strong>Through any two distinct points there is exactly one line.</strong> Given the points, we first compute the slope, then plug into point-slope. Combining these two steps gives the two-point form directly.</div>

<div class="calc-formula"><div class="formula-label">TWO-POINT FORM</div><div class="formula-main">$$\\frac{y - y_1}{x - x_1} \\;=\\; \\frac{y_2 - y_1}{x_2 - x_1}$$</div><div class="formula-sub">Left side: slope from $(x_1, y_1)$ to $(x, y)$. Right side: slope from $(x_1, y_1)$ to $(x_2, y_2)$. Both equal $m$, so they equal each other.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the equation of the line through $A(1, 2)$ and $B(3, 8)$.<br><br>Slope: $m = (8 - 2)/(3 - 1) = 6/2 = 3$.<br><br>Point-slope using $A$: $y - 2 = 3(x - 1)$.<br><br>Slope-intercept: $y - 2 = 3x - 3 \\implies \\mathbf{y = 3x - 1}$.<br><br>Check with $B$: $y = 3(3) - 1 = 8$. Correct.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Does it matter which of the two points you call $(x_1, y_1)$ when you apply the formula? (No — both orderings give the same final line. Try it with $B$ first.)</div></div>

<h2 class="lesson-title">5. General Form</h2>
<div class="calc-highlight"><strong>The general form is the most universal one: it works for every line, including vertical lines.</strong> The slope-intercept form $y = mx + b$ cannot express $x = 3$ (because vertical lines have no slope), but the general form handles it without a hiccup.</div>

<div class="calc-formula"><div class="formula-label">GENERAL FORM</div><div class="formula-main">$$A\\,x \\;+\\; B\\,y \\;+\\; C \\;=\\; 0$$</div><div class="formula-sub">$A$, $B$, $C$ are constants with $A$ and $B$ not both zero. Multiplying through by a nonzero number gives the same line, so $(A, B, C)$ is unique only up to a common scalar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$B \\neq 0$ case</div><div class="card-body">Divide through by $-B$: $y = -\\dfrac{A}{B}x - \\dfrac{C}{B}$. So $m = -A/B$ and $b = -C/B$.</div></div>
<div class="calc-card"><div class="card-title">$B = 0$ case</div><div class="card-body">The equation becomes $Ax + C = 0$, i.e. $x = -C/A$. This is a vertical line with undefined slope.</div></div>
<div class="calc-card"><div class="card-title">$A = 0$ case</div><div class="card-body">The equation becomes $By + C = 0$, i.e. $y = -C/B$. This is a horizontal line with slope $0$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Convert $2x - 3y + 6 = 0$ to slope-intercept form.<br><br>Solve for $y$: $-3y = -2x - 6 \\implies y = \\dfrac{2}{3}x + 2$.<br><br>So $m = \\mathbf{2/3}$, $b = \\mathbf{2}$. The line crosses the y-axis at $(0, 2)$ and climbs at slope $2/3$.</div></div>

<h2 class="lesson-title">6. Intercept Form</h2>
<div class="calc-highlight"><strong>If a line crosses both axes at non-zero points, the intercept form gives the cleanest picture.</strong> The line crosses the x-axis at $(a, 0)$ and the y-axis at $(0, b)$, and its equation is the symmetric expression below.</div>

<div class="calc-formula"><div class="formula-label">INTERCEPT FORM</div><div class="formula-main">$$\\frac{x}{a} \\;+\\; \\frac{y}{b} \\;=\\; 1$$</div><div class="formula-sub">$a$ is the x-intercept (where $y = 0$); $b$ is the y-intercept (where $x = 0$). Both must be non-zero, so this form excludes lines through the origin and lines parallel to either axis.</div></div>

<p class="l-text"><strong>Verification.</strong> Set $y = 0$: $x/a = 1 \\implies x = a$. Good — the line crosses the x-axis at $(a, 0)$. Set $x = 0$: $y/b = 1 \\implies y = b$. Good — the line crosses the y-axis at $(0, b)$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A line crosses the x-axis at $(4, 0)$ and the y-axis at $(0, -3)$. Find its equation in intercept form, then convert to general form.<br><br>Intercept form: $\\dfrac{x}{4} + \\dfrac{y}{-3} = 1$, i.e. $\\dfrac{x}{4} - \\dfrac{y}{3} = 1$.<br><br>Multiply through by 12: $3x - 4y = 12 \\implies \\mathbf{3x - 4y - 12 = 0}$.</div></div>

<h2 class="lesson-title">7. Vertical and Horizontal Lines</h2>
<div class="calc-highlight"><strong>Vertical and horizontal lines are the two exceptional cases.</strong> They cannot be written in the slope-intercept form $y = mx + b$ (vertical) or have the slope $m = 0$ (horizontal), but both fit naturally into the general form $Ax + By + C = 0$.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertical line: $x = c$</div><div class="card-body">All points have the same x-coordinate. Slope is undefined (the denominator $x_2 - x_1$ is zero). General form: $x - c = 0$ (so $A = 1$, $B = 0$, $C = -c$).</div></div>
<div class="calc-card"><div class="card-title">Horizontal line: $y = c$</div><div class="card-body">All points have the same y-coordinate. Slope is $0$. General form: $y - c = 0$ (so $A = 0$, $B = 1$, $C = -c$). Slope-intercept: $y = 0 \\cdot x + c$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the equation of (a) the vertical line through $(5, -2)$ and (b) the horizontal line through $(5, -2)$.<br><br>(a) Vertical line: x-coordinate is constant. Equation: $\\mathbf{x = 5}$.<br>(b) Horizontal line: y-coordinate is constant. Equation: $\\mathbf{y = -2}$.</div></div>

<h2 class="lesson-title">8. Converting Between Forms</h2>
<p class="l-text">Each form is convenient for a different purpose:</p>
<ul style="margin:0.5rem 0 1rem 1.3rem;line-height:1.7;color:rgba(235,230,220,0.92)">
<li><strong>Slope-intercept</strong> ($y = mx + b$) — best for sketching and reading off slope/intercept.</li>
<li><strong>Point-slope</strong> ($y - y_1 = m(x - x_1)$) — best when slope and one point are given.</li>
<li><strong>Two-point</strong> — best when two points are given.</li>
<li><strong>General</strong> ($Ax + By + C = 0$) — best for vertical lines, distance formulas, and parallel/perpendicular tests.</li>
<li><strong>Intercept</strong> ($x/a + y/b = 1$) — best when the two axis crossings are given.</li>
</ul>

<p class="l-text"><strong>The conversion algorithm is always the same:</strong> get the line into one form, then algebraically rearrange. Below is a small chain example showing all five forms for one line.</p>

<div class="calc-example"><div class="example-label">CHAIN EXAMPLE</div><div class="example-body">Consider the line through $(2, 0)$ and $(0, 4)$.<br><br><strong>Two-point</strong>: $\\dfrac{y - 0}{x - 2} = \\dfrac{4 - 0}{0 - 2} = -2$.<br><br><strong>Point-slope</strong>: $y - 0 = -2(x - 2)$.<br><br><strong>Slope-intercept</strong>: $y = -2x + 4$. (So $m = -2$, $b = 4$.)<br><br><strong>General</strong>: $2x + y - 4 = 0$.<br><br><strong>Intercept</strong>: $\\dfrac{x}{2} + \\dfrac{y}{4} = 1$.<br><br>All five describe the same line.</div></div>

<h2 class="lesson-title">9. Distance from a Point to a Line</h2>
<div class="calc-highlight"><strong>How far is a given point from a given line?</strong> The shortest distance is along the perpendicular from the point to the line. There is a clean closed-form formula in terms of the line's general-form coefficients.</div>

<div class="calc-formula"><div class="formula-label">DISTANCE FORMULA</div><div class="formula-main">$$d \\;=\\; \\frac{|A\\,x_0 + B\\,y_0 + C|}{\\sqrt{A^2 + B^2}}$$</div><div class="formula-sub">Line: $Ax + By + C = 0$. Point: $(x_0, y_0)$. The numerator is the line equation evaluated at the point (taken as an absolute value to give a non-negative distance). The denominator normalises the coefficients.</div></div>

<p class="l-text"><strong>Sanity check.</strong> If the point $(x_0, y_0)$ lies <em>on</em> the line, then $Ax_0 + By_0 + C = 0$ and the distance is zero — exactly as it should be. If you double all three coefficients $A$, $B$, $C$, the line is the same but the numerator doubles and the denominator also doubles, so $d$ does not change. The formula is invariant under scaling, which it must be.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the distance from the point $(0, 0)$ to the line $3x + 4y - 12 = 0$.<br><br>Here $A = 3$, $B = 4$, $C = -12$, $(x_0, y_0) = (0, 0)$.<br><br>$d = \\dfrac{|3(0) + 4(0) - 12|}{\\sqrt{3^2 + 4^2}} = \\dfrac{|-12|}{\\sqrt{25}} = \\dfrac{12}{5} = \\mathbf{2.4}$.</div></div>

<div class="calc-graph"><div id="plot-l77-dist-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the line $3x + 4y - 12 = 0$ (blue) crossing the axes at $(4, 0)$ and $(0, 3)$, the origin (orange point), and the perpendicular segment dropped from the origin to the line (red dashed). The length of that segment is $12/5 = 2.4$, which the distance formula gives in one step.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xD=[];for(var i=-1;i<=5.01;i+=0.1)xD.push(i);
var lineD={x:xD,y:xD.map(function(x){return (12-3*x)/4;}),mode:'lines',name:'3x + 4y − 12 = 0',line:{color:'#3b82f6',width:3}};
var orig={x:[0],y:[0],mode:'markers',name:'P(0, 0)',marker:{color:'#f59e0b',size:11}};
var fx=(3*12)/(3*3+4*4),fy=(4*12)/(3*3+4*4);
var foot={x:[fx],y:[fy],mode:'markers',name:'foot of perpendicular',marker:{color:'#10b981',size:9}};
var perp={x:[0,fx],y:[0,fy],mode:'lines',name:'distance = 12/5',line:{color:'#ef4444',width:2.5,dash:'dash'}};
var lab={x:[fx/2-0.3],y:[fy/2+0.25],mode:'text',name:'distance label',text:['d = 2.4'],textfont:{color:'#ef4444',size:13},showlegend:false};
var layD={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l77-dist-en',[lineD,orig,foot,perp,lab],layD,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Worked Problems</h2>
<p class="l-text">A short set of practice problems covering the whole lesson. Try each one yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; LINE THROUGH TWO POINTS</div><div class="example-body"><strong>Find the equation of the line through $(1, 2)$ and $(3, 8)$ in slope-intercept form.</strong><br><br>Slope: $m = (8-2)/(3-1) = 6/2 = 3$.<br>Point-slope using $(1, 2)$: $y - 2 = 3(x - 1) \\implies y = 3x - 1$.<br>Answer: $\\mathbf{y = 3x - 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; GENERAL TO SLOPE-INTERCEPT</div><div class="example-body"><strong>Convert $2x - 3y + 6 = 0$ to slope-intercept form.</strong><br><br>$-3y = -2x - 6 \\implies y = \\dfrac{2}{3}x + 2$.<br>Slope $m = 2/3$, y-intercept $b = 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; POINT TO LINE DISTANCE</div><div class="example-body"><strong>Find the distance from $(0, 0)$ to $3x + 4y - 12 = 0$.</strong><br><br>$d = \\dfrac{|3(0)+4(0)-12|}{\\sqrt{9+16}} = \\dfrac{12}{5} = \\mathbf{2.4}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; INTERCEPT FORM</div><div class="example-body"><strong>A line has x-intercept 5 and y-intercept $-2$. Write its equation in intercept form, then general form.</strong><br><br>Intercept: $\\dfrac{x}{5} + \\dfrac{y}{-2} = 1$.<br>Multiply by 10: $2x - 5y = 10 \\implies \\mathbf{2x - 5y - 10 = 0}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; VERTICAL LINE</div><div class="example-body"><strong>Find the equation of the vertical line through $(7, -3)$.</strong><br><br>Vertical means x is constant. The point has $x = 7$, so the line is $\\mathbf{x = 7}$. Slope is undefined; it cannot be put in slope-intercept form.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; POINT-SLOPE WITH NEGATIVE SLOPE</div><div class="example-body"><strong>Find the equation of the line with slope $m = -1/2$ passing through $(4, 3)$.</strong><br><br>Point-slope: $y - 3 = -\\dfrac{1}{2}(x - 4)$.<br>Distribute: $y - 3 = -\\dfrac{1}{2}x + 2 \\implies \\mathbf{y = -\\dfrac{1}{2}x + 5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; READ A LINE OFF A GRAPH</div><div class="example-body"><strong>A line crosses the y-axis at $(0, -1)$ and passes through $(3, 5)$. Find its equation.</strong><br><br>The y-intercept is $b = -1$. Slope from $(0, -1)$ to $(3, 5)$: $m = (5 - (-1))/(3 - 0) = 6/3 = 2$.<br>Answer: $\\mathbf{y = 2x - 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; DISTANCE FROM A NON-ORIGIN POINT</div><div class="example-body"><strong>Find the distance from $(2, 1)$ to the line $5x - 12y + 10 = 0$.</strong><br><br>$d = \\dfrac{|5(2) - 12(1) + 10|}{\\sqrt{25 + 144}} = \\dfrac{|10 - 12 + 10|}{\\sqrt{169}} = \\dfrac{8}{13} \\approx \\mathbf{0.615}$.</div></div>

<h2 class="lesson-title">11. Common Errors</h2>
<div class="calc-compare">
<div class="compare-col"><div class="compare-title">DIVIDE BY ZERO ON A VERTICAL LINE</div><div class="compare-item">Wrong: trying to compute slope between $(3, 1)$ and $(3, 5)$ as $(5-1)/(3-3) = 4/0$ and writing "slope = infinity".</div><div class="compare-item">Right: the slope is <em>undefined</em>. The line is vertical and its equation is $x = 3$.</div></div>
<div class="compare-col"><div class="compare-title">SIGN ERROR REARRANGING</div><div class="compare-item">Wrong: from $2x - 3y + 6 = 0$, writing $3y = -2x + 6$ instead of $3y = 2x + 6$ (forgot to flip the sign of $2x$ when moving across).</div><div class="compare-item">Right: $-3y = -2x - 6 \\implies 3y = 2x + 6 \\implies y = (2/3)x + 2$.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">SWAPPING NUMERATOR AND DENOMINATOR OF SLOPE</div><div class="compare-item">Wrong: $m = (x_2 - x_1)/(y_2 - y_1)$ — run over rise. This computes $\\cot$ instead of $\\tan$ of the angle.</div><div class="compare-item">Right: $m = (y_2 - y_1)/(x_2 - x_1)$ — rise over run.</div></div>
<div class="compare-col"><div class="compare-title">FORGETTING THE ABSOLUTE VALUE IN DISTANCE</div><div class="compare-item">Wrong: writing $d = (Ax_0 + By_0 + C)/\\sqrt{A^2 + B^2}$ without bars. This can give a negative answer, which is impossible for a distance.</div><div class="compare-item">Right: $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$. The bars guarantee $d \\geq 0$.</div></div>
</div>

<div class="l-note"><strong>Looking ahead.</strong> The next lesson tackles two lines together: when are they parallel, when are they perpendicular, and at what point do they intersect? Every one of those questions reduces to comparing the slopes you computed here. Make sure the five forms in this lesson feel automatic before moving on.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Slope: $m = (y_2 - y_1)/(x_2 - x_1)$ &mdash; rise over run, equal to $\\tan\\alpha$ where $\\alpha$ is the angle with the x-axis</li>
<li>Slope-intercept: $y = mx + b$ &mdash; $m$ steepness, $b$ y-intercept</li>
<li>Point-slope: $y - y_1 = m(x - x_1)$ &mdash; needs one point and slope</li>
<li>Two-point: equates the slope to a known $(x_1, y_1), (x_2, y_2)$ pair</li>
<li>General: $Ax + By + C = 0$ &mdash; works for vertical lines too</li>
<li>Intercept: $x/a + y/b = 1$ &mdash; needs both axis crossings non-zero</li>
<li>Vertical line: $x = c$ (undefined slope); horizontal line: $y = c$ (zero slope)</li>
<li>Distance from $(x_0, y_0)$ to $Ax + By + C = 0$: $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Doğru, matematikteki en basit eğridir ve doğrunun denklemi, koordinat geometrisinin en basit denklemidir.</strong> Haritadaki her yol, binadaki her rampa, bir veri grafiğindeki her eğilim çizgisi — hepsi düz doğruların parçalarıdır ve hepsi iki değişkende tek bir doğrusal denklemle ifade edilebilir. Bu dersin işi, sana o denklemin dört standart biçimi, her parçanın geometrik anlamı ve biçimler arası geçiş prosedürleri konusunda akıcılık kazandırmaktır.</p>

<p class="l-text">Dersin sonunda bir grafikten doğruyu okuyup denklemini yazabileceksin, bir denklemi okuyup karşılık gelen doğruyu çizebileceksin, eğim-kesim, nokta-eğim, iki-nokta, genel ve eksen-kesim biçimleri arasında tereddütsüz geçiş yapabileceksin ve herhangi bir noktadan herhangi bir doğruya olan dik uzaklığı hesaplayabileceksin. Bunlar analitik geometrinin temel teknikleridir — kalkülüste (teğet doğrular), lineer cebirde (tek boyutlu altuzaylar olarak doğrular) ve bir niceliğin diğerine doğrusal bağlı olduğu her uygulamalı bilimde tekrar karşına çıkarlar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir doğrunun eğimini düşey değişim bölü yatay değişim olarak tanımlamayı ve resimden işaretini okumayı</li>
<li>Bir doğru denklemini eğim-kesim biçiminde $y = mx + b$ olarak yazmayı ve $m$ ile $b$'yi geometrik olarak yorumlamayı</li>
<li>Tek bir nokta ve eğim verildiğinde nokta-eğim biçimini $y - y_1 = m(x - x_1)$ türetmeyi ve kullanmayı</li>
<li>Verilen iki noktadan geçen tek doğrunun denklemini iki-nokta biçimiyle bulmayı</li>
<li>Eğim-kesim, genel $Ax + By + C = 0$ ve eksen-kesim $x/a + y/b = 1$ biçimleri arasında dönüşüm yapmayı</li>
<li>Düşey ve yatay doğruları iki istisnai durum olarak ($x = c$ ve $y = c$) ele almayı</li>
<li>Bir noktadan bir doğruya uzaklık formülünü $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$ uygulamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Doğrunun Eğimi</h2>
<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir rampa. Rampa, ileri yürüdüğün her 4 metrede 1 metre yükseliyorsa, ona "4'te 1" eğimli dersin. Matematikçiler bunu $1/4$ kesri olarak yazar ve bu kesre rampanın <em>eğimi</em> derler. Daha dik bir rampanın kesri daha büyüktür; iniş rampası negatif işaret alır; tamamen düz bir zemin sıfır eğime sahiptir.</div>

<p class="l-text">Bir doğru üzerinde herhangi iki farklı nokta $A(x_1, y_1)$ ve $B(x_2, y_2)$ al. $A$'dan $B$'ye yürürken yatay değişim $x_2 - x_1$ (yatay yol) ve düşey değişim $y_2 - y_1$ (yükseklik) olur. <strong>Eğim</strong> $m$ bu oranın değeridir:</p>

<div class="calc-formula"><div class="formula-label">EĞİM &mdash; TANIM</div><div class="formula-main">$$m \\;=\\; \\frac{\\text{düşey değişim}}{\\text{yatay değişim}} \\;=\\; \\frac{y_2 - y_1}{x_2 - x_1}$$</div><div class="formula-sub">İki nokta eğimi belirler. Pay ve paydada aynı sırayla çıkardığın sürece, hangisine $A$ hangisine $B$ dediğin önemli değil.</div></div>

<p class="l-text"><strong>Eğim neden tüm doğrunun bir özelliğidir, sadece nokta çiftinin değil?</strong> Benzer üçgenler yüzünden. Doğrunun herhangi iki noktasından bir dik üçgen düşür ve oran düşey/yatay aynıdır — bu oran, doğrunun x-ekseni ile yaptığı açı tarafından belirlenir. Aslında, $\\alpha$ o açıysa, $m = \\tan\\alpha$ olur; bu yüzden eğime bazen <em>açı katsayısı</em> da denir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pozitif eğim ($m > 0$)</div><div class="card-body">Sağa yürüdükçe doğru yükselir. Örnek: $m = 2$, her 1 birim sağa karşılık 2 birim yukarı anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Negatif eğim ($m < 0$)</div><div class="card-body">Sağa yürüdükçe doğru alçalır. Örnek: $m = -1/2$, her 1 birim sağa karşılık yarım birim aşağı anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Sıfır eğim ($m = 0$)</div><div class="card-body">Doğru tamamen yataydır. Her yerde aynı y-değeri. Denklem biçimi: $y = c$.</div></div>
<div class="calc-card"><div class="card-title">Tanımsız eğim</div><div class="card-body">Doğru tamamen düşeydir. $x_2 - x_1$ paydası sıfır olduğu için kesir tanımsızdır. Denklem biçimi: $x = c$.</div></div>
</div>

<div class="calc-graph"><div id="plot-l77-slopes-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijinden geçen farklı eğimli dört doğru. Mavi $m = 2$ dik bir şekilde tırmanır; yeşil $m = 1/2$ yumuşakça tırmanır; turuncu $m = 0$ x-ekseninin kendisidir; kırmızı $m = -1$ aşağı iner. $x = 2$'deki düşey doğru (kesik çizgili) tanımsız eğime sahiptir. Her doğrunun x-ekseni ile yaptığı açıyı eğim değeriyle karşılaştır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-3;i<=3.01;i+=0.1)xs.push(i);
var line1={x:xs,y:xs.map(function(x){return 2*x;}),mode:'lines',name:'m = 2',line:{color:'#3b82f6',width:3}};
var line2={x:xs,y:xs.map(function(x){return 0.5*x;}),mode:'lines',name:'m = 1/2',line:{color:'#10b981',width:3}};
var line3={x:xs,y:xs.map(function(x){return 0;}),mode:'lines',name:'m = 0',line:{color:'#f59e0b',width:3}};
var line4={x:xs,y:xs.map(function(x){return -x;}),mode:'lines',name:'m = −1',line:{color:'#ef4444',width:3}};
var vert={x:[2,2],y:[-3,3],mode:'lines',name:'m tanımsız',line:{color:'#a78bfa',width:3,dash:'dash'}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l77-slopes-tr',[line1,line2,line3,line4,vert],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A(1, 2)$ ve $B(4, 11)$ noktalarından geçen doğrunun eğimini bul.<br><br>$m = \\dfrac{11 - 2}{4 - 1} = \\dfrac{9}{3} = \\mathbf{3}$.<br><br>Yorum: doğru, her 1 birim sağa karşılık 3 birim yükselir. Noktaların sırasını değiştirerek kontrol et: $m = (2 - 11)/(1 - 4) = (-9)/(-3) = 3$. Aynı sonuç — noktaların sırası fark etmez.</div></div>

<div class="l-note"><strong>Düşey/yatay resmin geometrik anlamı:</strong> doğruyu çiz, sonra hipotenüsü doğru üzerinde olan küçük bir dik üçgen çiz. Yatay kenar yatay yol, düşey kenar yüksekliktir; eğim de (işaretli) orandır. Üçgeni büyüt veya küçült — oran değişmez. Formülün geometrik içeriği budur.</div>

<div class="calc-graph"><div id="plot-l77-riserun-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = (3/4)x + 1$ doğrusu ve onun üzerinde iki düşey/yatay üçgen. Küçük üçgenin yatay kenarı 4, düşey kenarı 3'tür; büyük üçgenin yatay kenarı 8, düşey kenarı 6'dır. İkisi de aynı eğimi verir: $m = 3/4$. Eğim doğrunun bir özelliğidir, üçgenin değil.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];for(var i=-1;i<=8.01;i+=0.1)xL.push(i);
var lineMain={x:xL,y:xL.map(function(x){return 0.75*x+1;}),mode:'lines',name:'y = (3/4)x + 1',line:{color:'#3b82f6',width:3}};
var tri1={x:[0,4,4,0],y:[1,1,4,1],mode:'lines',name:'küçük: yatay 4, düşey 3',line:{color:'#10b981',width:2.5},fill:'toself',fillcolor:'rgba(16,185,129,0.12)'};
var tri2={x:[0,8,8,0],y:[1,1,7,1],mode:'lines',name:'büyük: yatay 8, düşey 6',line:{color:'#f59e0b',width:2,dash:'dot'}};
var ann={x:[2,4.4,4,8.4,8],y:[0.5,2.4,3.6,3.5,6.4],mode:'text',name:'etiketler',text:['yatay = 4','düşey = 3','','yatay = 8','düşey = 6'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-0.5,8.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l77-riserun-tr',[lineMain,tri1,tri2,ann],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Eğim-Kesim Biçimi</h2>
<div class="calc-highlight"><strong>Eğim-kesim biçimi, lise cebrinin en çok kullanılan biçimidir.</strong> Düşey olmayan her doğru $y = mx + b$ biçiminde yazılabilir; burada $m$ eğim, $b$ ise y-kesimidir (doğrunun y-eksenini kestiği noktadaki $y$ değeri). İki sayı, bir denklem, bir resim.</div>

<div class="calc-formula"><div class="formula-label">EĞİM-KESİM BİÇİMİ</div><div class="formula-main">$$y \\;=\\; m\\,x \\;+\\; b$$</div><div class="formula-sub">$m$ eğim, $b$ ise y-kesimidir. Doğru $(0, b)$ noktasından geçer ve sağa atılan her 1 birim için $m$ kadar yükselir.</div></div>

<p class="l-text"><strong>Grafikten denklemi nasıl okursun.</strong> İki parçaya bak: (1) doğru y-eksenini nerede kesiyor? O y-değeri $b$'dir. (2) O kesim noktasından bir birim sağa yürü; doğru ne kadar yukarı (veya aşağı) gider? O sayı $m$'dir.</p>

<p class="l-text"><strong>Denklemden doğruyu nasıl çizersin.</strong> Aynı iki parça, ters yönde. y-kesim noktası $(0, b)$'yi y-eksenine işaretle. Oradan eğimi bir "adım talimatı" olarak kullan: yatay 1'e karşılık düşey $m$. İkinci bir nokta işaretle ve aralarından bir doğru çiz.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$y = -2x + 3$ doğrusunu çiz.<br><br>$m = -2$ ve $b = 3$ olarak belirle. y-kesim noktası $(0, 3)$'ten başla. Eğim $-2$: 1 birim sağa, 2 birim aşağı. Yani ikinci nokta $(1, 1)$. Üçüncüsü: bir 1 birim daha sağa, 2 birim daha aşağı — $(2, -1)$. Düz bir doğruyla birleştir.</div></div>

<div class="l-note"><strong>Bu biçimi özel kılan şey:</strong> $m$ ve $b$ sayıları <em>geometrik olarak anlamlıdır</em>. $m$ dikliktir, $b$ ise orijinin üstündeki (veya altındaki) yüksekliktir. Her ikisini de cebirsel işlem yapmadan resimden okursun.</div>

<h2 class="lesson-title">3. Nokta-Eğim Biçimi</h2>
<div class="calc-highlight"><strong>Problem sana eğimi ve tek bir noktayı verdiğinde, nokta-eğim biçimi denkleme en kısa yoldur.</strong> Çözecek cebir yok, kurulacak sistem yok — sadece iki parçayı yerine koy.</div>

<p class="l-text">Bilinen bir nokta $(x_1, y_1)$ ile doğru üzerindeki genel bir nokta $(x, y)$ arasındaki eğimin tanımıyla başla:</p>

<div class="calc-formula"><div class="formula-label">EĞİM TANIMINDAN TÜRETİM</div><div class="formula-main">$$m \\;=\\; \\frac{y - y_1}{x - x_1} \\quad\\Longrightarrow\\quad y - y_1 \\;=\\; m(x - x_1)$$</div><div class="formula-sub">Her iki tarafı $x - x_1$ ile çarp. Sonuç nokta-eğim biçimidir. Bilinen nokta $(x_1, y_1)$ doğru üzerinde sabittir; eğim $m$ sana yönü söyler.</div></div>

<div class="calc-formula"><div class="formula-label">NOKTA-EĞİM BİÇİMİ</div><div class="formula-main">$$y - y_1 \\;=\\; m\\,(x - x_1)$$</div><div class="formula-sub">Doğru üzerinde bir nokta ve eğim bilindiğinde en iyi seçim. Eğim-kesim biçimine dönüştürmek için sadece dağıt ve yeniden düzenle.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Eğimi $m = -3$ ve $(2, 5)$ noktasından geçen doğrunun denklemini bul.<br><br>Nokta-eğime yerleştir: $y - 5 = -3(x - 2)$.<br><br>Eğim-kesime dönüştür: $y - 5 = -3x + 6 \\implies \\mathbf{y = -3x + 11}$.<br><br>Doğrulama: $(2, 5)$'i yerine koy: $y = -3(2) + 11 = 5$. Doğru.</div></div>

<h2 class="lesson-title">4. İki-Nokta Biçimi</h2>
<div class="calc-highlight"><strong>Birbirinden farklı iki noktadan geçen tam olarak bir doğru vardır.</strong> Noktalar verilince önce eğimi hesaplarız, sonra nokta-eğime koyarız. Bu iki adımı birleştirmek doğrudan iki-nokta biçimini verir.</div>

<div class="calc-formula"><div class="formula-label">İKİ-NOKTA BİÇİMİ</div><div class="formula-main">$$\\frac{y - y_1}{x - x_1} \\;=\\; \\frac{y_2 - y_1}{x_2 - x_1}$$</div><div class="formula-sub">Sol taraf: $(x_1, y_1)$'den $(x, y)$'ye eğim. Sağ taraf: $(x_1, y_1)$'den $(x_2, y_2)$'ye eğim. İkisi de $m$'ye eşit, dolayısıyla birbirine eşit.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A(1, 2)$ ve $B(3, 8)$ noktalarından geçen doğrunun denklemini bul.<br><br>Eğim: $m = (8 - 2)/(3 - 1) = 6/2 = 3$.<br><br>$A$'yı kullanan nokta-eğim: $y - 2 = 3(x - 1)$.<br><br>Eğim-kesim: $y - 2 = 3x - 3 \\implies \\mathbf{y = 3x - 1}$.<br><br>$B$ ile kontrol: $y = 3(3) - 1 = 8$. Doğru.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Formülü uygularken iki noktadan hangisine $(x_1, y_1)$ dediğin önemli mi? (Hayır — her iki sıralama da aynı doğruyu verir. Önce $B$ ile dene.)</div></div>

<h2 class="lesson-title">5. Genel Biçim</h2>
<div class="calc-highlight"><strong>Genel biçim, en evrensel olanıdır: düşey doğrular dahil her doğru için işler.</strong> Eğim-kesim biçimi $y = mx + b$ ile $x = 3$ doğrusu ifade edilemez (çünkü düşey doğruların eğimi yoktur), ama genel biçim bunu kolayca halleder.</div>

<div class="calc-formula"><div class="formula-label">GENEL BİÇİM</div><div class="formula-main">$$A\\,x \\;+\\; B\\,y \\;+\\; C \\;=\\; 0$$</div><div class="formula-sub">$A$, $B$, $C$ sabittir ve $A$ ile $B$ aynı anda sıfır olamaz. Sıfırdan farklı bir sayıyla çarpmak aynı doğruyu verir, dolayısıyla $(A, B, C)$ ortak bir skaler çarpana göre tektir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$B \\neq 0$ durumu</div><div class="card-body">$-B$'ye böl: $y = -\\dfrac{A}{B}x - \\dfrac{C}{B}$. Yani $m = -A/B$ ve $b = -C/B$.</div></div>
<div class="calc-card"><div class="card-title">$B = 0$ durumu</div><div class="card-body">Denklem $Ax + C = 0$ olur, yani $x = -C/A$. Bu, eğimi tanımsız düşey bir doğrudur.</div></div>
<div class="calc-card"><div class="card-title">$A = 0$ durumu</div><div class="card-body">Denklem $By + C = 0$ olur, yani $y = -C/B$. Bu, eğimi $0$ olan yatay bir doğrudur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$2x - 3y + 6 = 0$ denklemini eğim-kesim biçimine dönüştür.<br><br>$y$ için çöz: $-3y = -2x - 6 \\implies y = \\dfrac{2}{3}x + 2$.<br><br>Yani $m = \\mathbf{2/3}$, $b = \\mathbf{2}$. Doğru y-eksenini $(0, 2)$'de keser ve $2/3$ eğimle tırmanır.</div></div>

<h2 class="lesson-title">6. Eksen-Kesim Biçimi</h2>
<div class="calc-highlight"><strong>Bir doğru her iki ekseni de sıfırdan farklı noktalarda kesiyorsa, eksen-kesim biçimi en temiz resmi verir.</strong> Doğru x-eksenini $(a, 0)$ noktasında, y-eksenini $(0, b)$ noktasında keser ve denklemi aşağıdaki simetrik ifadedir.</div>

<div class="calc-formula"><div class="formula-label">EKSEN-KESİM BİÇİMİ</div><div class="formula-main">$$\\frac{x}{a} \\;+\\; \\frac{y}{b} \\;=\\; 1$$</div><div class="formula-sub">$a$ x-kesimi ($y = 0$ olduğu yer); $b$ y-kesimi ($x = 0$ olduğu yer). İkisi de sıfırdan farklı olmalı, dolayısıyla bu biçim orijinden geçen doğruları ve eksene paralel doğruları dışarıda bırakır.</div></div>

<p class="l-text"><strong>Doğrulama.</strong> $y = 0$ koy: $x/a = 1 \\implies x = a$. Güzel — doğru x-eksenini $(a, 0)$'da kesiyor. $x = 0$ koy: $y/b = 1 \\implies y = b$. Güzel — doğru y-eksenini $(0, b)$'de kesiyor.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir doğru x-eksenini $(4, 0)$, y-eksenini $(0, -3)$ noktasında kesiyor. Denklemini eksen-kesim biçiminde yaz, sonra genel biçime dönüştür.<br><br>Eksen-kesim: $\\dfrac{x}{4} + \\dfrac{y}{-3} = 1$, yani $\\dfrac{x}{4} - \\dfrac{y}{3} = 1$.<br><br>12 ile çarp: $3x - 4y = 12 \\implies \\mathbf{3x - 4y - 12 = 0}$.</div></div>

<h2 class="lesson-title">7. Düşey ve Yatay Doğrular</h2>
<div class="calc-highlight"><strong>Düşey ve yatay doğrular iki istisnai durumdur.</strong> Eğim-kesim biçiminde $y = mx + b$ olarak yazılamazlar (düşey) veya eğim $m = 0$ olur (yatay), ama her ikisi de genel biçim $Ax + By + C = 0$'a doğal olarak uyar.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düşey doğru: $x = c$</div><div class="card-body">Tüm noktalar aynı x-koordinatına sahip. Eğim tanımsız ($x_2 - x_1$ paydası sıfır). Genel biçim: $x - c = 0$ (yani $A = 1$, $B = 0$, $C = -c$).</div></div>
<div class="calc-card"><div class="card-title">Yatay doğru: $y = c$</div><div class="card-body">Tüm noktalar aynı y-koordinatına sahip. Eğim $0$. Genel biçim: $y - c = 0$ (yani $A = 0$, $B = 1$, $C = -c$). Eğim-kesim: $y = 0 \\cdot x + c$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">(a) $(5, -2)$ noktasından geçen düşey doğrunun ve (b) $(5, -2)$ noktasından geçen yatay doğrunun denklemlerini bul.<br><br>(a) Düşey doğru: x-koordinatı sabittir. Denklem: $\\mathbf{x = 5}$.<br>(b) Yatay doğru: y-koordinatı sabittir. Denklem: $\\mathbf{y = -2}$.</div></div>

<h2 class="lesson-title">8. Biçimler Arası Dönüşüm</h2>
<p class="l-text">Her biçim farklı bir amaç için uygundur:</p>
<ul style="margin:0.5rem 0 1rem 1.3rem;line-height:1.7;color:rgba(235,230,220,0.92)">
<li><strong>Eğim-kesim</strong> ($y = mx + b$) &mdash; çizmek ve eğim/kesim okumak için en iyisi.</li>
<li><strong>Nokta-eğim</strong> ($y - y_1 = m(x - x_1)$) &mdash; eğim ve bir nokta verildiğinde en iyisi.</li>
<li><strong>İki-nokta</strong> &mdash; iki nokta verildiğinde en iyisi.</li>
<li><strong>Genel</strong> ($Ax + By + C = 0$) &mdash; düşey doğrular, uzaklık formülleri ve paralel/dik testleri için en iyisi.</li>
<li><strong>Eksen-kesim</strong> ($x/a + y/b = 1$) &mdash; iki eksen kesimi verildiğinde en iyisi.</li>
</ul>

<p class="l-text"><strong>Dönüşüm algoritması her zaman aynıdır:</strong> doğruyu bir biçime sok, sonra cebirsel olarak yeniden düzenle. Aşağıda tek bir doğrunun beş biçiminin tümünü gösteren küçük bir zincir örnek var.</p>

<div class="calc-example"><div class="example-label">ZİNCİR ÖRNEK</div><div class="example-body">$(2, 0)$ ve $(0, 4)$ noktalarından geçen doğruyu düşün.<br><br><strong>İki-nokta</strong>: $\\dfrac{y - 0}{x - 2} = \\dfrac{4 - 0}{0 - 2} = -2$.<br><br><strong>Nokta-eğim</strong>: $y - 0 = -2(x - 2)$.<br><br><strong>Eğim-kesim</strong>: $y = -2x + 4$. (Yani $m = -2$, $b = 4$.)<br><br><strong>Genel</strong>: $2x + y - 4 = 0$.<br><br><strong>Eksen-kesim</strong>: $\\dfrac{x}{2} + \\dfrac{y}{4} = 1$.<br><br>Beşi de aynı doğruyu tanımlar.</div></div>

<h2 class="lesson-title">9. Bir Noktadan Bir Doğruya Uzaklık</h2>
<div class="calc-highlight"><strong>Verilen bir nokta, verilen bir doğruya ne kadar uzaktadır?</strong> En kısa uzaklık, noktadan doğruya inilen dikme boyuncadır. Doğrunun genel-biçim katsayıları cinsinden temiz bir kapalı formül var.</div>

<div class="calc-formula"><div class="formula-label">UZAKLIK FORMÜLÜ</div><div class="formula-main">$$d \\;=\\; \\frac{|A\\,x_0 + B\\,y_0 + C|}{\\sqrt{A^2 + B^2}}$$</div><div class="formula-sub">Doğru: $Ax + By + C = 0$. Nokta: $(x_0, y_0)$. Pay, noktada hesaplanan doğru ifadesidir (negatif olmayan bir uzaklık vermesi için mutlak değer alınır). Payda katsayıları normalleştirir.</div></div>

<p class="l-text"><strong>Mantık kontrolü.</strong> Eğer nokta $(x_0, y_0)$ doğru <em>üzerindeyse</em>, $Ax_0 + By_0 + C = 0$ olur ve uzaklık sıfır çıkar — tam da olması gerektiği gibi. $A$, $B$, $C$ katsayılarının üçünü de iki katına çıkarırsan doğru aynıdır ama pay iki katına çıkar ve payda da iki katına çıkar, böylece $d$ değişmez. Formül ölçeklendirme altında değişmezdir, ki olması gereken de budur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$(0, 0)$ noktasından $3x + 4y - 12 = 0$ doğrusuna uzaklığı bul.<br><br>Burada $A = 3$, $B = 4$, $C = -12$, $(x_0, y_0) = (0, 0)$.<br><br>$d = \\dfrac{|3(0) + 4(0) - 12|}{\\sqrt{3^2 + 4^2}} = \\dfrac{|-12|}{\\sqrt{25}} = \\dfrac{12}{5} = \\mathbf{2.4}$.</div></div>

<div class="calc-graph"><div id="plot-l77-dist-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $3x + 4y - 12 = 0$ doğrusu (mavi) eksenleri $(4, 0)$ ve $(0, 3)$ noktalarında kesiyor; orijin (turuncu nokta) ve orijinden doğruya indirilen dik parça (kırmızı kesik). O parçanın uzunluğu $12/5 = 2.4$'tür ve uzaklık formülü bunu tek adımda verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xD=[];for(var i=-1;i<=5.01;i+=0.1)xD.push(i);
var lineD={x:xD,y:xD.map(function(x){return (12-3*x)/4;}),mode:'lines',name:'3x + 4y − 12 = 0',line:{color:'#3b82f6',width:3}};
var orig={x:[0],y:[0],mode:'markers',name:'P(0, 0)',marker:{color:'#f59e0b',size:11}};
var fx=(3*12)/(3*3+4*4),fy=(4*12)/(3*3+4*4);
var foot={x:[fx],y:[fy],mode:'markers',name:'dikmenin ayağı',marker:{color:'#10b981',size:9}};
var perp={x:[0,fx],y:[0,fy],mode:'lines',name:'uzaklık = 12/5',line:{color:'#ef4444',width:2.5,dash:'dash'}};
var lab={x:[fx/2-0.3],y:[fy/2+0.25],mode:'text',name:'uzaklık etiketi',text:['d = 2.4'],textfont:{color:'#ef4444',size:13},showlegend:false};
var layD={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l77-dist-tr',[lineD,orig,foot,perp,lab],layD,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>
<p class="l-text">Tüm dersi kapsayan kısa bir alıştırma seti. Önce her birini kendin dene, sonra çözümlü cevabı oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; İKİ NOKTADAN GEÇEN DOĞRU</div><div class="example-body"><strong>$(1, 2)$ ve $(3, 8)$ noktalarından geçen doğrunun denklemini eğim-kesim biçiminde bul.</strong><br><br>Eğim: $m = (8-2)/(3-1) = 6/2 = 3$.<br>$(1, 2)$ ile nokta-eğim: $y - 2 = 3(x - 1) \\implies y = 3x - 1$.<br>Cevap: $\\mathbf{y = 3x - 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; GENELDEN EĞİM-KESİME</div><div class="example-body"><strong>$2x - 3y + 6 = 0$ denklemini eğim-kesim biçimine dönüştür.</strong><br><br>$-3y = -2x - 6 \\implies y = \\dfrac{2}{3}x + 2$.<br>Eğim $m = 2/3$, y-kesim $b = 2$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; NOKTADAN DOĞRUYA UZAKLIK</div><div class="example-body"><strong>$(0, 0)$'dan $3x + 4y - 12 = 0$ doğrusuna olan uzaklığı bul.</strong><br><br>$d = \\dfrac{|3(0)+4(0)-12|}{\\sqrt{9+16}} = \\dfrac{12}{5} = \\mathbf{2.4}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; EKSEN-KESİM BİÇİMİ</div><div class="example-body"><strong>Bir doğrunun x-kesimi 5 ve y-kesimi $-2$. Denklemini eksen-kesim biçiminde, sonra genel biçimde yaz.</strong><br><br>Eksen-kesim: $\\dfrac{x}{5} + \\dfrac{y}{-2} = 1$.<br>10 ile çarp: $2x - 5y = 10 \\implies \\mathbf{2x - 5y - 10 = 0}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DÜŞEY DOĞRU</div><div class="example-body"><strong>$(7, -3)$ noktasından geçen düşey doğrunun denklemini bul.</strong><br><br>Düşey demek x sabit demek. Noktanın $x = 7$ olduğundan doğru $\\mathbf{x = 7}$'dir. Eğim tanımsız; eğim-kesim biçiminde yazılamaz.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; NEGATİF EĞİMLİ NOKTA-EĞİM</div><div class="example-body"><strong>$m = -1/2$ eğimli ve $(4, 3)$'ten geçen doğrunun denklemini bul.</strong><br><br>Nokta-eğim: $y - 3 = -\\dfrac{1}{2}(x - 4)$.<br>Dağıt: $y - 3 = -\\dfrac{1}{2}x + 2 \\implies \\mathbf{y = -\\dfrac{1}{2}x + 5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; GRAFİKTEN DOĞRU OKUMA</div><div class="example-body"><strong>Bir doğru y-eksenini $(0, -1)$'de kesiyor ve $(3, 5)$ noktasından geçiyor. Denklemini bul.</strong><br><br>y-kesim $b = -1$. $(0, -1)$'den $(3, 5)$'e eğim: $m = (5 - (-1))/(3 - 0) = 6/3 = 2$.<br>Cevap: $\\mathbf{y = 2x - 1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; ORİJİN DIŞINDA NOKTADAN UZAKLIK</div><div class="example-body"><strong>$(2, 1)$'den $5x - 12y + 10 = 0$ doğrusuna uzaklığı bul.</strong><br><br>$d = \\dfrac{|5(2) - 12(1) + 10|}{\\sqrt{25 + 144}} = \\dfrac{|10 - 12 + 10|}{\\sqrt{169}} = \\dfrac{8}{13} \\approx \\mathbf{0.615}$.</div></div>

<h2 class="lesson-title">11. Yaygın Hatalar</h2>
<div class="calc-compare">
<div class="compare-col"><div class="compare-title">DÜŞEY DOĞRUDA SIFIRA BÖLME</div><div class="compare-item">Yanlış: $(3, 1)$ ile $(3, 5)$ arasındaki eğimi $(5-1)/(3-3) = 4/0$ olarak hesaplayıp "eğim sonsuzdur" yazmak.</div><div class="compare-item">Doğru: eğim <em>tanımsızdır</em>. Doğru düşeydir ve denklemi $x = 3$'tür.</div></div>
<div class="compare-col"><div class="compare-title">YENİDEN DÜZENLEMEDE İŞARET HATASI</div><div class="compare-item">Yanlış: $2x - 3y + 6 = 0$'dan $3y = -2x + 6$ yazmak ($2x$'i karşıya geçirirken işaretini değiştirmeyi unutmak) yerine $3y = 2x + 6$ olmalıydı.</div><div class="compare-item">Doğru: $-3y = -2x - 6 \\implies 3y = 2x + 6 \\implies y = (2/3)x + 2$.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">EĞİMİN PAY VE PAYDASINI KARIŞTIRMA</div><div class="compare-item">Yanlış: $m = (x_2 - x_1)/(y_2 - y_1)$ &mdash; yatay yol bölü düşey değişim. Bu, açının $\\tan$'ı yerine $\\cot$'unu hesaplar.</div><div class="compare-item">Doğru: $m = (y_2 - y_1)/(x_2 - x_1)$ &mdash; düşey değişim bölü yatay yol.</div></div>
<div class="compare-col"><div class="compare-title">UZAKLIKTA MUTLAK DEĞERİ UNUTMA</div><div class="compare-item">Yanlış: $d = (Ax_0 + By_0 + C)/\\sqrt{A^2 + B^2}$ — mutlak değer çubukları olmadan. Bu negatif cevap verebilir, ki bir uzaklık için imkânsızdır.</div><div class="compare-item">Doğru: $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$. Çubuklar $d \\geq 0$ olmasını garanti eder.</div></div>
</div>

<div class="l-note"><strong>İleri bakış.</strong> Sonraki ders iki doğruyu birlikte ele alıyor: ne zaman paralel, ne zaman dik, hangi noktada kesişiyorlar? Bu soruların hepsi burada hesapladığın eğimleri karşılaştırmaya indirgenir. Devam etmeden önce bu derste gördüğün beş biçimin otomatik hissetmesini sağla.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Eğim: $m = (y_2 - y_1)/(x_2 - x_1)$ &mdash; düşey değişim bölü yatay yol, x-ekseniyle yapılan açı $\\alpha$ için $\\tan\\alpha$'ya eşit</li>
<li>Eğim-kesim: $y = mx + b$ &mdash; $m$ diklik, $b$ y-kesim</li>
<li>Nokta-eğim: $y - y_1 = m(x - x_1)$ &mdash; bir nokta ve eğim gerekir</li>
<li>İki-nokta: bilinen $(x_1, y_1), (x_2, y_2)$ çiftiyle eğimi eşitler</li>
<li>Genel: $Ax + By + C = 0$ &mdash; düşey doğrular için de geçerli</li>
<li>Eksen-kesim: $x/a + y/b = 1$ &mdash; iki eksen kesimi de sıfırdan farklı olmalı</li>
<li>Düşey doğru: $x = c$ (tanımsız eğim); yatay doğru: $y = c$ (sıfır eğim)</li>
<li>$(x_0, y_0)$'dan $Ax + By + C = 0$'a uzaklık: $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$</li>
</ul>
</div>`
};
