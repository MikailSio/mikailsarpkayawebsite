window.LISE_MAT_L76 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Geometry on a piece of paper began with rulers, compasses, and figures drawn by hand.</strong> Then in the 17th century René Descartes had a quiet revolution: take a flat sheet, draw two perpendicular number lines on it, and now every point has an <em>address</em> — a pair of numbers. Suddenly geometry could be done with algebra. Triangles became equations, lines became formulas, circles became simple expressions like $x^2 + y^2 = r^2$. This lesson is your first formal walk through that landscape: the coordinate plane, how distances work in it, where midpoints sit, and how a single equation can describe a curve.</p>

<p class="l-text">By the end of this lesson you will be able to plot any point, compute the exact distance between any two points, find the midpoint of a segment, divide a segment in a given ratio, decide whether a triangle is right-angled just from its vertex coordinates, and write down equations of simple geometric loci such as circles and perpendicular bisectors. These are the tools you will use in every analytic-geometry chapter from this point on.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Set up the Cartesian coordinate plane with its axes, origin, and four quadrants</li>
<li>Read and plot an ordered pair $(x, y)$, identifying abscissa and ordinate</li>
<li>Derive and apply the distance formula $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ from the Pythagorean theorem</li>
<li>Compute midpoints and points that divide a segment in a given ratio $m:n$</li>
<li>Use coordinate distances to classify triangles (right-angled, isosceles, equilateral)</li>
<li>Define a locus as the set of points satisfying a geometric condition, and identify circles and perpendicular bisectors as the two simplest loci</li>
</ul>
</div>

<h2 class="lesson-title">1. The Cartesian Coordinate Plane</h2>

<div class="calc-highlight"><strong>One sheet of paper, two number lines, infinite addresses.</strong> Take the familiar real number line (the one you used for inequalities and intervals), make a copy, rotate it 90 degrees, and lay it on top of the first one so the two zeros coincide. You now have a <em>coordinate plane</em>. Every point on the paper has a unique pair of numbers attached to it — its address. This simple construction turns geometry into algebra.</div>

<p class="l-text">The horizontal number line is called the <strong>x-axis</strong>. The vertical one is the <strong>y-axis</strong>. Their intersection point — the place where both readings are zero — is the <strong>origin</strong>, labelled O. To the right of O, x is positive. To the left, x is negative. Above O, y is positive. Below O, y is negative. That convention is universal and not optional.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x-axis</div><div class="card-body">Horizontal number line. Positive direction to the right. Sometimes called the "axis of abscissae".</div></div>
<div class="calc-card"><div class="card-title">y-axis</div><div class="card-body">Vertical number line. Positive direction upward. Sometimes called the "axis of ordinates".</div></div>
<div class="calc-card"><div class="card-title">Origin O</div><div class="card-body">The point $(0, 0)$. Both axes meet here. Every coordinate is measured from this point outward.</div></div>
</div>

<p class="l-text"><strong>The four quadrants.</strong> The two axes split the plane into four open regions called <em>quadrants</em>. They are numbered I, II, III, IV starting from the upper right and going counter-clockwise — the same direction we use for positive angles in trigonometry. The sign pattern of the coordinates in each quadrant follows directly:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Quadrant</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sign of x</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sign of y</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Example point</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>I</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem">$(3, 2)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>II</strong></td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem">$(-3, 2)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>III</strong></td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem">$(-3, -2)$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>IV</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem">$(3, -2)$</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>A subtle case:</strong> points lying exactly on an axis (like $(5, 0)$ or $(0, -2)$) are <em>not</em> in any quadrant. They sit on the boundary. The origin $(0,0)$ is on both axes at once.</div>

<h2 class="lesson-title">2. Ordered Pairs: How a Point Gets Its Address</h2>

<div class="calc-highlight"><strong>"Ordered" is the key word.</strong> The pair $(3, 2)$ is not the same as $(2, 3)$. The first slot is always x, the second slot is always y. Swap them and you get a different point in a different location. This convention — x first, then y — is universal.</div>

<p class="l-text">Given a point $P$ in the plane, we drop a perpendicular from $P$ down to the x-axis. The number we land on is called the <strong>abscissa</strong> (the x-coordinate). Then we drop a perpendicular from $P$ across to the y-axis. The number we land on is the <strong>ordinate</strong> (the y-coordinate). The pair of numbers, written in parentheses with a comma between them, is the point's <em>coordinates</em>:</p>

<div class="calc-formula"><div class="formula-label">ORDERED PAIR &mdash; THE ADDRESS OF A POINT</div><div class="formula-main">$$P \\;=\\; (x, \\, y)$$</div><div class="formula-sub">x is the abscissa (horizontal distance from the y-axis). y is the ordinate (vertical distance from the x-axis). Both have signs.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Abscissa</div><div class="card-body">The x-coordinate. Tells you how far left ($-$) or right ($+$) the point sits from the y-axis.</div></div>
<div class="calc-card"><div class="card-title">Ordinate</div><div class="card-body">The y-coordinate. Tells you how far below ($-$) or above ($+$) the point sits from the x-axis.</div></div>
<div class="calc-card"><div class="card-title">Order matters</div><div class="card-body">$(3, 2) \\neq (2, 3)$. The first slot is always x. This is why we call it an "ordered" pair.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Plot the points $A = (4, 3)$, $B = (-2, 1)$, $C = (-3, -4)$, $D = (5, -2)$ and identify the quadrant of each.<br><br>$A$ has both coordinates positive &rarr; <strong>quadrant I</strong>.<br>$B$ has $x < 0$, $y > 0$ &rarr; <strong>quadrant II</strong>.<br>$C$ has both coordinates negative &rarr; <strong>quadrant III</strong>.<br>$D$ has $x > 0$, $y < 0$ &rarr; <strong>quadrant IV</strong>.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Where does the point $(0, -7)$ live? Not in any quadrant — it sits on the negative y-axis. And $(3, 0)$? On the positive x-axis. Points with at least one zero coordinate are always on an axis.</div></div>

<h2 class="lesson-title">3. The Distance Formula</h2>

<div class="calc-highlight"><strong>The single most important formula in all of analytic geometry.</strong> Given two points $A = (x_1, y_1)$ and $B = (x_2, y_2)$, the distance between them is the length of the straight line segment $AB$. The formula comes straight out of the Pythagorean theorem — no calculus, no advanced tools, just the right triangle.</div>

<p class="l-text"><strong>The picture.</strong> Drop a horizontal line from $A$ and a vertical line from $B$ until they meet at a third point $C$. The triangle $ABC$ has a right angle at $C$ (because horizontal and vertical lines are perpendicular). The two legs measure $|x_2 - x_1|$ (horizontal) and $|y_2 - y_1|$ (vertical). The segment $AB$ is the hypotenuse. By Pythagoras:</p>

<div class="calc-formula"><div class="formula-label">PYTHAGOREAN DERIVATION</div><div class="formula-main">$$AB^2 \\;=\\; (x_2 - x_1)^2 + (y_2 - y_1)^2$$</div><div class="formula-sub">Squaring removes the absolute value signs — $|x_2-x_1|^2 = (x_2-x_1)^2$ either way. Take the positive square root for the length.</div></div>

<div class="calc-formula"><div class="formula-label">DISTANCE FORMULA &mdash; THE MAIN RESULT</div><div class="formula-main">$$d(A, B) \\;=\\; \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$</div><div class="formula-sub">Memorise this. It is the analytic-geometry equivalent of "$a^2 + b^2 = c^2$".</div></div>

<p class="l-text"><strong>It does not matter which point you call "1" and which you call "2".</strong> The differences get squared, so signs disappear: $(x_2 - x_1)^2 = (x_1 - x_2)^2$. The distance from $A$ to $B$ equals the distance from $B$ to $A$, as common sense demands.</p>

<div class="calc-graph"><div id="plot-l76-distance-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two points $A=(1, 1)$ and $B=(5, 4)$ joined by a blue segment. The dashed grey lines form the legs of the right triangle — horizontal leg of length $|5-1|=4$, vertical leg of length $|4-1|=3$. The hypotenuse $AB$ has length $\\sqrt{4^2+3^2}=\\sqrt{25}=5$, which is exactly the distance formula in action.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[1,5],y:[1,4],mode:'lines+markers+text',name:'AB (hypotenuse)',line:{color:'#3b82f6',width:3.2},marker:{color:'#3b82f6',size:9},text:['A(1,1)','B(5,4)'],textposition:'top center',textfont:{color:'#e8e8e8',size:12}};
var legH={x:[1,5],y:[1,1],mode:'lines',name:'horizontal leg = 4',line:{color:'rgba(245,158,11,0.85)',width:2.2,dash:'dash'}};
var legV={x:[5,5],y:[1,4],mode:'lines',name:'vertical leg = 3',line:{color:'rgba(16,185,129,0.85)',width:2.2,dash:'dash'}};
var corner={x:[5],y:[1],mode:'markers+text',name:'right angle C(5,1)',marker:{color:'#e8e8e8',size:8,symbol:'square-open'},text:['C(5,1)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:11}};
var lbl={x:[3,5.25,3],y:[0.55,2.5,2.9],mode:'text',name:'lengths',text:['Δx = 4','Δy = 3','d = √(16+9) = 5'],textfont:{color:['#f59e0b','#10b981','#3b82f6'],size:13},showlegend:false};
var axX={x:[-0.5,6.5],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,5.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l76-distance-en',[axX,axY,legH,legV,seg,corner,lbl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the distance from $P = (3, 4)$ to the origin $O = (0, 0)$.<br><br>$d(P, O) = \\sqrt{(3-0)^2 + (4-0)^2} = \\sqrt{9 + 16} = \\sqrt{25} = \\mathbf{5}$.<br><br>This is the classic 3-4-5 right triangle. The distance from any point $(x, y)$ to the origin is $\\sqrt{x^2 + y^2}$ — a special case worth memorising.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Find the distance between $A = (-2, 3)$ and $B = (4, -5)$.<br><br>$d(A, B) = \\sqrt{(4 - (-2))^2 + (-5 - 3)^2} = \\sqrt{6^2 + (-8)^2} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$.<br><br>Notice how the negative signs all squared away cleanly.</div></div>

<div class="l-note"><strong>The distance from a point to the origin.</strong> Setting $(x_1, y_1) = (0,0)$ in the distance formula gives the simpler form $d = \\sqrt{x^2 + y^2}$. The pair $(x, y)$ is then a point whose distance from the origin equals $\\sqrt{x^2+y^2}$ — a fact we will use over and over in the unit-circle, vectors, and complex-number chapters.</div>

<h2 class="lesson-title">4. The Midpoint Formula</h2>

<div class="calc-highlight"><strong>The midpoint of a segment is exactly what it sounds like: the point halfway along it.</strong> Computing it requires no Pythagoras, just an average. The midpoint of two numbers $a$ and $b$ on a number line is $(a+b)/2$ — and the same idea applied to each coordinate gives the midpoint of a segment in the plane.</div>

<div class="calc-formula"><div class="formula-label">MIDPOINT FORMULA</div><div class="formula-main">$$M \\;=\\; \\left( \\frac{x_1 + x_2}{2}, \\; \\frac{y_1 + y_2}{2} \\right)$$</div><div class="formula-sub">Add the x's and halve. Add the y's and halve. That is the midpoint of the segment joining $(x_1, y_1)$ to $(x_2, y_2)$.</div></div>

<p class="l-text"><strong>Why averaging works.</strong> Imagine walking from $A$ to $B$ along the segment. At the halfway mark you have covered half the horizontal distance ($\\Delta x / 2$) and half the vertical distance ($\\Delta y / 2$). Adding those increments to $A$'s coordinates gives exactly $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the midpoint of the segment joining $A = (1, 2)$ and $B = (5, 8)$.<br><br>$M = \\left(\\dfrac{1 + 5}{2}, \\dfrac{2 + 8}{2}\\right) = \\left(\\dfrac{6}{2}, \\dfrac{10}{2}\\right) = \\mathbf{(3, 5)}$.<br><br>Check: from $A=(1,2)$ to $M=(3,5)$ is $\\Delta=(2,3)$. From $M=(3,5)$ to $B=(5,8)$ is also $\\Delta=(2,3)$. Equal increments confirm the midpoint is correct.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">A circle has a diameter with endpoints $(-3, 4)$ and $(7, -2)$. Find the centre of the circle.<br><br>The centre of a circle is the midpoint of any diameter, so:<br><br>$\\text{centre} = \\left(\\dfrac{-3 + 7}{2}, \\dfrac{4 + (-2)}{2}\\right) = \\left(\\dfrac{4}{2}, \\dfrac{2}{2}\\right) = \\mathbf{(2, 1)}$.</div></div>

<div class="calc-graph"><div id="plot-l76-midpoint-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the segment from $A=(1,2)$ to $B=(5,8)$ with the midpoint $M=(3,5)$ highlighted. The dashed grey segments $AM$ and $MB$ are visibly equal in length — exactly what the midpoint formula guarantees.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[1,5],y:[2,8],mode:'lines',name:'segment AB',line:{color:'rgba(255,255,255,0.25)',width:1.6,dash:'dot'}};
var aPt={x:[1],y:[2],mode:'markers+text',name:'A(1,2)',marker:{color:'#3b82f6',size:10},text:['A(1,2)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var bPt={x:[5],y:[8],mode:'markers+text',name:'B(5,8)',marker:{color:'#3b82f6',size:10},text:['B(5,8)'],textposition:'top left',textfont:{color:'#e8e8e8',size:12}};
var mPt={x:[3],y:[5],mode:'markers+text',name:'midpoint M(3,5)',marker:{color:'#f59e0b',size:13,symbol:'diamond'},text:['M(3,5)'],textposition:'middle right',textfont:{color:'#f59e0b',size:13}};
var halfA={x:[1,3],y:[2,5],mode:'lines',name:'AM',line:{color:'#10b981',width:2.6}};
var halfB={x:[3,5],y:[5,8],mode:'lines',name:'MB',line:{color:'#ef4444',width:2.6}};
var axX={x:[-0.5,6.5],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,9.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-0.5,9.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l76-midpoint-en',[axX,axY,seg,halfA,halfB,aPt,bPt,mPt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The midpoint never depends on the order of the endpoints.</strong> Swap $A$ and $B$ and the formula gives the same point. This is because addition is commutative: $x_1 + x_2 = x_2 + x_1$.</div>

<h2 class="lesson-title">5. The Section (Division) Formula</h2>

<div class="calc-highlight"><strong>Sometimes you want a point that is not at the halfway mark — say, one-third of the way from $A$ to $B$, or splitting the segment in a 2:3 ratio.</strong> The midpoint formula handles only the 1:1 case. The <em>section formula</em> generalises it: given any ratio $m:n$, it gives the exact coordinates of the dividing point.</div>

<p class="l-text">Suppose $P$ divides the segment $AB$ internally in the ratio $AP : PB = m : n$. Then:</p>

<div class="calc-formula"><div class="formula-label">INTERNAL DIVISION (SECTION) FORMULA</div><div class="formula-main">$$P \\;=\\; \\left( \\frac{m \\, x_2 + n \\, x_1}{m + n}, \\; \\frac{m \\, y_2 + n \\, y_1}{m + n} \\right)$$</div><div class="formula-sub">Each coordinate is a <em>weighted average</em>. The weight on point $B$ is $m$ (the part of the ratio closer to $B$); the weight on $A$ is $n$. Notice how this reduces to the midpoint when $m = n$.</div></div>

<p class="l-text"><strong>Sanity check.</strong> Plug $m = n = 1$: numerator becomes $x_2 + x_1$, denominator is $2$. That gives the ordinary midpoint formula. Good — the section formula is a strict generalisation.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">$P$ divides the segment from $A = (1, 2)$ to $B = (6, 12)$ in the ratio $2 : 3$. Find $P$.<br><br>Here $m = 2$, $n = 3$, $m + n = 5$.<br><br>$P_x = \\dfrac{2 \\cdot 6 + 3 \\cdot 1}{5} = \\dfrac{12 + 3}{5} = \\dfrac{15}{5} = 3$.<br>$P_y = \\dfrac{2 \\cdot 12 + 3 \\cdot 2}{5} = \\dfrac{24 + 6}{5} = \\dfrac{30}{5} = 6$.<br><br>$\\mathbf{P = (3, 6)}$. Check: $|AP| = \\sqrt{2^2 + 4^2} = \\sqrt{20}$, $|PB| = \\sqrt{3^2 + 6^2} = \\sqrt{45}$. Ratio $\\sqrt{20} : \\sqrt{45} = 2 : 3$ &check;.</div></div>

<div class="l-note"><strong>Common mistake.</strong> Students sometimes write $\\dfrac{m x_1 + n x_2}{m+n}$ instead of $\\dfrac{m x_2 + n x_1}{m+n}$. The weights are crossed: the weight closer to $B$ (which is $m$, the first part of the ratio $AP:PB = m:n$) multiplies $B$'s coordinates. Memorise this once and you will never get the order wrong.</div>

<h2 class="lesson-title">6. Triangle Vertices: Side Lengths from Coordinates</h2>

<div class="calc-highlight"><strong>Give me the three vertices of a triangle as coordinates, and I can tell you whether it is scalene, isosceles, equilateral, right-angled, or none of the above — all by applying the distance formula three times and checking the results against known triangle types.</strong></div>

<p class="l-text">The recipe:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: Compute three side lengths</div><div class="card-body">Use the distance formula to find $|AB|$, $|BC|$, $|CA|$.</div></div>
<div class="calc-card"><div class="card-title">Step 2: Compare lengths</div><div class="card-body">All three equal &rarr; equilateral. Exactly two equal &rarr; isosceles. All different &rarr; scalene.</div></div>
<div class="calc-card"><div class="card-title">Step 3: Test for right angle</div><div class="card-body">Check whether the longest side squared equals the sum of the other two sides squared. If so, the triangle is right-angled (Pythagoras).</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; THE RIGHT TRIANGLE TEST</div><div class="example-body">Triangle has vertices $A = (0, 0)$, $B = (4, 0)$, $C = (0, 3)$. Show that it is a right triangle and find its side lengths.<br><br>$|AB| = \\sqrt{(4-0)^2 + (0-0)^2} = \\sqrt{16} = 4$.<br>$|AC| = \\sqrt{(0-0)^2 + (3-0)^2} = \\sqrt{9} = 3$.<br>$|BC| = \\sqrt{(0-4)^2 + (3-0)^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$.<br><br>Pythagorean test on the longest side: $|BC|^2 = 25$, and $|AB|^2 + |AC|^2 = 16 + 9 = 25$.<br><br>$|BC|^2 = |AB|^2 + |AC|^2 \\Rightarrow$ <strong>right angle at $A$</strong>. This is the famous 3-4-5 right triangle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ISOSCELES?</div><div class="example-body">Triangle $A = (1, 1)$, $B = (5, 1)$, $C = (3, 4)$. Classify it.<br><br>$|AB| = \\sqrt{16 + 0} = 4$.<br>$|AC| = \\sqrt{4 + 9} = \\sqrt{13}$.<br>$|BC| = \\sqrt{4 + 9} = \\sqrt{13}$.<br><br>$|AC| = |BC| \\Rightarrow$ <strong>isosceles</strong>. (Not equilateral: $|AB| \\neq |AC|$.) Not right-angled either: $|AB|^2 = 16$, $|AC|^2 + |BC|^2 = 26$ — no match.</div></div>

<h2 class="lesson-title">7. Introducing Loci: Geometry as Equation</h2>

<div class="calc-highlight"><strong>A locus (plural: loci) is the set of all points that satisfy a given geometric condition.</strong> The Greek root literally means "place" — and in the coordinate plane a locus is usually a curve, sometimes a line, occasionally a single point or even empty. The big idea is that a verbal condition ("the distance from the origin equals 5") translates directly into an algebraic equation ("$x^2 + y^2 = 25$").</div>

<p class="l-text">This translation — from <em>geometric description</em> to <em>algebraic equation</em> — is the engine of analytic geometry. Once a curve has an equation, you can compute intersections, derive properties, and solve geometric problems with algebraic manipulation. Conversely, once an equation is plotted, you have a visual picture of the algebra.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Verbal condition</div><div class="card-body">"Distance from origin equals 5." A purely geometric statement, no coordinates yet.</div></div>
<div class="calc-card"><div class="card-title">Algebraic translation</div><div class="card-body">$\\sqrt{x^2 + y^2} = 5 \\;\\Leftrightarrow\\; x^2 + y^2 = 25$. Use the distance formula to convert the condition.</div></div>
<div class="calc-card"><div class="card-title">Geometric shape</div><div class="card-body">A circle of radius 5 centred at the origin. The equation and the picture describe the same set of points.</div></div>
</div>

<h2 class="lesson-title">8. The Two Most Important Loci</h2>

<p class="l-text">Two simple geometric conditions produce two of the most common curves in mathematics. You will see them again and again, so it is worth deriving each from scratch.</p>

<h3 style="margin-top:1.4rem;color:#3b82f6">8.1 Locus #1 &mdash; Circle: equidistant from a fixed point</h3>

<p class="l-text"><strong>Condition.</strong> "All points $(x, y)$ whose distance from a fixed point $C = (a, b)$ equals a constant $r > 0$."</p>

<p class="l-text">Translate using the distance formula:</p>

<div class="calc-formula"><div class="formula-label">EQUATION OF A CIRCLE &mdash; CENTRE $(a, b)$, RADIUS $r$</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 \\;=\\; r^2$$</div><div class="formula-sub">Squaring removes the square root. The set of solutions is exactly the circle of radius $r$ centred at $(a, b)$.</div></div>

<p class="l-text">Special case: centre at the origin ($a = b = 0$) gives the simpler $x^2 + y^2 = r^2$, the equation we already met for the unit circle ($r = 1$).</p>

<div class="calc-graph"><div id="plot-l76-locus-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the locus of points equidistant from the origin at distance 3 — a circle of radius 3. The orange sample points all lie on this circle, each at distance exactly 3 from the centre. The dashed radii illustrate the defining condition: every point on the curve is the same distance from $O$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(3*Math.cos(a));yc.push(3*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'locus: x² + y² = 9',line:{color:'#3b82f6',width:3}};
var samp=[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,5*Math.PI/4,3*Math.PI/2,7*Math.PI/4];
var spX=[];var spY=[];for(var k=0;k<samp.length;k++){spX.push(3*Math.cos(samp[k]));spY.push(3*Math.sin(samp[k]));}
var pts={x:spX,y:spY,mode:'markers',name:'sample points (distance = 3)',marker:{color:'#f59e0b',size:11}};
var rays={x:[],y:[],mode:'lines',name:'radii',line:{color:'rgba(245,158,11,0.4)',width:1,dash:'dot'}};
for(var m=0;m<samp.length;m++){rays.x.push(0,3*Math.cos(samp[m]),null);rays.y.push(0,3*Math.sin(samp[m]),null);}
var orig={x:[0],y:[0],mode:'markers+text',name:'centre O(0,0)',marker:{color:'#e8e8e8',size:9,symbol:'cross'},text:['O'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:13}};
var axX={x:[-4.2,4.2],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-4.2,4.2],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-4.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l76-locus-en',[axX,axY,ring,rays,pts,orig],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="margin-top:1.4rem;color:#3b82f6">8.2 Locus #2 &mdash; Perpendicular bisector: equidistant from two fixed points</h3>

<p class="l-text"><strong>Condition.</strong> "All points $(x, y)$ that are the same distance from $A$ as from $B$."</p>

<p class="l-text">This is famous from classical geometry: the set of points equidistant from $A$ and $B$ is the line that passes through the midpoint of $AB$ at a right angle to $AB$ — the <em>perpendicular bisector</em>. Let us derive it algebraically.</p>

<p class="l-text">Take $A = (x_1, y_1)$ and $B = (x_2, y_2)$. The condition $d(P, A) = d(P, B)$ becomes:</p>

<div class="calc-formula"><div class="formula-label">PERPENDICULAR BISECTOR &mdash; THE DERIVATION</div><div class="formula-main">$$(x - x_1)^2 + (y - y_1)^2 \\;=\\; (x - x_2)^2 + (y - y_2)^2$$</div><div class="formula-sub">Square the distances on both sides to remove the radicals.</div></div>

<p class="l-text">Expand both sides. The $x^2$ and $y^2$ terms cancel cleanly between the two sides:</p>

<div class="calc-formula"><div class="formula-label">AFTER SIMPLIFICATION</div><div class="formula-main">$$2(x_2 - x_1) x + 2(y_2 - y_1) y \\;=\\; (x_2^2 - x_1^2) + (y_2^2 - y_1^2)$$</div><div class="formula-sub">A <em>linear</em> equation in $x$ and $y$ — confirming that the locus is a straight line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the equation of the perpendicular bisector of the segment joining $A = (1, 3)$ and $B = (5, 7)$.<br><br>$d(P, A)^2 = (x - 1)^2 + (y - 3)^2$<br>$d(P, B)^2 = (x - 5)^2 + (y - 7)^2$<br><br>Setting them equal and expanding:<br>$x^2 - 2x + 1 + y^2 - 6y + 9 = x^2 - 10x + 25 + y^2 - 14y + 49$.<br><br>Cancel $x^2$ and $y^2$: $-2x + 1 - 6y + 9 = -10x + 25 - 14y + 49$, that is $-2x - 6y + 10 = -10x - 14y + 74$.<br><br>Rearrange: $8x + 8y = 64$, or $\\mathbf{x + y = 8}$.<br><br>Quick check: the midpoint of $AB$ is $(3, 5)$, which satisfies $3 + 5 = 8$ &check;. And the slope of $AB$ is $(7-3)/(5-1) = 1$, so the perpendicular bisector should have slope $-1$ — and rearranging $x + y = 8$ to $y = -x + 8$ confirms slope $-1$ &check;.</div></div>

<h2 class="lesson-title">9. Common Errors and How to Avoid Them</h2>

<p class="l-text">A short catalogue of the mistakes that cost students the most marks in exam questions of this lesson. Read carefully — each one happens because of a subtle slip in setup, not because of a deep conceptual error.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Error 1: subtracting in the wrong order</div><div class="card-body">Students write $(x_1 - x_2)$ instead of $(x_2 - x_1)$ and worry that they got the wrong sign. <strong>Both work</strong>: the square removes signs. $(x_1 - x_2)^2 = (x_2 - x_1)^2$. Sign of the difference does not matter for distance.</div></div>
<div class="calc-card"><div class="card-title">Error 2: forgetting the square root</div><div class="card-body">After computing $(x_2-x_1)^2 + (y_2-y_1)^2$ you have $d^2$, not $d$. Take the square root. Common in time-pressed exams; students report $d^2$ as the answer.</div></div>
<div class="calc-card"><div class="card-title">Error 3: confusing midpoint with distance</div><div class="card-body">Midpoint is a <em>point</em>: a pair of coordinates. Distance is a <em>number</em>: a positive real value. Different operations: average for midpoint, Pythagoras for distance.</div></div>
<div class="calc-card"><div class="card-title">Error 4: averaging the wrong things in the section formula</div><div class="card-body">In $P = \\big(\\frac{m x_2 + n x_1}{m+n}, ...\\big)$ the weight $m$ multiplies $B$'s coordinate (the far endpoint), not $A$'s. Mnemonic: "ratio $m:n$ from $A$ to $B$" &rarr; "$m$ goes with $B$".</div></div>
<div class="calc-card"><div class="card-title">Error 5: assuming axes are points</div><div class="card-body">Points on the x-axis or y-axis are <em>not in any quadrant</em>. Mark them on the boundary, not inside a quadrant.</div></div>
<div class="calc-card"><div class="card-title">Error 6: dropping the absolute value when it matters</div><div class="card-body">For a vertical segment between $(a, y_1)$ and $(a, y_2)$ the length is $|y_2 - y_1|$, not just $y_2 - y_1$. The square in the full distance formula hides this, but you must keep it explicit when working with one coordinate at a time.</div></div>
</div>

<h2 class="lesson-title">10. Worked Problems</h2>

<p class="l-text">A set of practice problems pulling together everything in the lesson. Try each one yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; QUADRANTS</div><div class="example-body"><strong>Determine the quadrant (or axis) for each: $P_1 = (-4, 7)$, $P_2 = (3, -1)$, $P_3 = (0, 5)$, $P_4 = (-2, -8)$.</strong><br><br>$P_1$: $x < 0$, $y > 0$ &rarr; <strong>quadrant II</strong>.<br>$P_2$: $x > 0$, $y < 0$ &rarr; <strong>quadrant IV</strong>.<br>$P_3$: $x = 0$ &rarr; <strong>on the positive y-axis</strong>, not in any quadrant.<br>$P_4$: $x < 0$, $y < 0$ &rarr; <strong>quadrant III</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; DISTANCE</div><div class="example-body"><strong>Find the distance between $A = (-1, 4)$ and $B = (3, -2)$.</strong><br><br>$d(A, B) = \\sqrt{(3 - (-1))^2 + (-2 - 4)^2} = \\sqrt{4^2 + (-6)^2} = \\sqrt{16 + 36} = \\sqrt{52} = 2\\sqrt{13}$.<br><br>Answer: $\\mathbf{2\\sqrt{13}}$ (about 7.21).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; MIDPOINT</div><div class="example-body"><strong>$M$ is the midpoint of the segment $AB$. If $A = (-3, 5)$ and $M = (1, 2)$, find $B$.</strong><br><br>Use $M = \\big(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\big)$ and solve for $B$:<br>$1 = \\dfrac{-3 + x_B}{2} \\Rightarrow x_B = 5$.<br>$2 = \\dfrac{5 + y_B}{2} \\Rightarrow y_B = -1$.<br><br>Answer: $\\mathbf{B = (5, -1)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SECTION FORMULA</div><div class="example-body"><strong>$P$ divides the segment from $A = (-2, 1)$ to $B = (8, 6)$ in the ratio $3 : 2$. Find $P$.</strong><br><br>$m = 3$, $n = 2$, $m + n = 5$.<br><br>$P_x = \\dfrac{3 \\cdot 8 + 2 \\cdot (-2)}{5} = \\dfrac{24 - 4}{5} = \\dfrac{20}{5} = 4$.<br>$P_y = \\dfrac{3 \\cdot 6 + 2 \\cdot 1}{5} = \\dfrac{18 + 2}{5} = \\dfrac{20}{5} = 4$.<br><br>Answer: $\\mathbf{P = (4, 4)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; TRIANGLE CLASSIFICATION</div><div class="example-body"><strong>Show that the triangle with vertices $A = (0, 0)$, $B = (4, 0)$, $C = (0, 3)$ is a right triangle. State the legs and the hypotenuse.</strong><br><br>$|AB| = \\sqrt{16} = 4$, $|AC| = \\sqrt{9} = 3$, $|BC| = \\sqrt{16 + 9} = 5$.<br><br>Pythagorean test: $|BC|^2 = 25 = 16 + 9 = |AB|^2 + |AC|^2$ &check;.<br><br>Conclusion: right angle at $\\mathbf{A}$. Legs: $\\mathbf{AB = 4}$, $\\mathbf{AC = 3}$. Hypotenuse: $\\mathbf{BC = 5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; LOCUS (CIRCLE)</div><div class="example-body"><strong>Write the equation of the circle with centre $(2, -3)$ and radius 4.</strong><br><br>Apply $(x-a)^2 + (y-b)^2 = r^2$ with $a = 2$, $b = -3$, $r = 4$:<br><br>$\\mathbf{(x - 2)^2 + (y + 3)^2 = 16}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; PERPENDICULAR BISECTOR</div><div class="example-body"><strong>Find the equation of the set of all points equidistant from $A = (0, 0)$ and $B = (6, 4)$.</strong><br><br>$x^2 + y^2 = (x-6)^2 + (y-4)^2 = x^2 - 12x + 36 + y^2 - 8y + 16$.<br><br>Cancel $x^2, y^2$: $0 = -12x + 36 - 8y + 16$, that is $12x + 8y = 52$, or $\\mathbf{3x + 2y = 13}$.<br><br>Check: midpoint of $AB$ is $(3, 2)$ and $3 \\cdot 3 + 2 \\cdot 2 = 13$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; COLLINEAR POINTS</div><div class="example-body"><strong>Are the points $P = (1, 2)$, $Q = (3, 6)$, $R = (4, 8)$ collinear?</strong><br><br>Three points are collinear iff one of the distances equals the sum of the other two.<br>$|PQ| = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$.<br>$|QR| = \\sqrt{1 + 4} = \\sqrt{5}$.<br>$|PR| = \\sqrt{9 + 36} = \\sqrt{45} = 3\\sqrt{5}$.<br><br>Check: $|PQ| + |QR| = 2\\sqrt{5} + \\sqrt{5} = 3\\sqrt{5} = |PR|$ &check;.<br><br>Yes — $P$, $Q$, $R$ are collinear, with $Q$ between $P$ and $R$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A point in the plane has an ordered-pair address $(x, y)$: abscissa first, then ordinate</li>
<li>Two perpendicular number lines and an origin define the Cartesian plane; the four quadrants are numbered CCW I to IV</li>
<li>Distance: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$, derived from Pythagoras</li>
<li>Midpoint: $M = \\big(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\big)$ &mdash; just averages</li>
<li>Section formula: $P = \\big(\\frac{m x_2 + n x_1}{m+n}, \\frac{m y_2 + n y_1}{m+n}\\big)$ generalises to any ratio $m:n$</li>
<li>Side lengths from coordinates classify a triangle and detect right angles via Pythagoras</li>
<li>A locus is the set of points satisfying a condition: circle is $(x-a)^2 + (y-b)^2 = r^2$; perpendicular bisector follows from $d(P,A) = d(P,B)$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir kâğıt parçası üzerindeki geometri, cetveller, pergeller ve elle çizilmiş şekillerle başladı.</strong> Sonra 17. yüzyılda René Descartes sessiz bir devrim yaptı: düz bir sayfayı al, üzerine iki dik sayı doğrusu çiz ve artık her noktanın bir <em>adresi</em> var — bir sayı çifti. Geometri birden cebirle yapılabilir hale geldi. Üçgenler denklemlere, doğrular formüllere, çemberler $x^2 + y^2 = r^2$ gibi basit ifadelere dönüştü. Bu ders, o manzaranın içindeki ilk resmi yürüyüşün: koordinat düzlemi, içinde uzaklıkların nasıl çalıştığı, orta noktaların nerede oturduğu ve tek bir denklemin bir eğriyi nasıl betimleyebildiği.</p>

<p class="l-text">Bu dersin sonunda, herhangi bir noktayı çizebileceksin, herhangi iki nokta arasındaki tam uzaklığı hesaplayabileceksin, bir doğru parçasının orta noktasını bulabileceksin, bir parçayı verilen bir oranda bölebileceksin, sadece köşe koordinatlarına bakarak bir üçgenin dik açılı olup olmadığına karar verebileceksin ve çember ile orta dikme gibi basit geometrik yer-locus denklemlerini yazabileceksin. Bunlar, bu noktadan sonra analitik geometrinin her bölümünde kullanacağın araçlardır.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Eksenleri, orijini ve dört bölgesiyle birlikte Kartezyen koordinat düzlemini kurmayı</li>
<li>Sıralı bir $(x, y)$ ikilisini okumayı ve çizmeyi, apsis ile ordinatı ayırt etmeyi</li>
<li>Pisagor teoreminden $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ uzaklık formülünü türetmeyi ve uygulamayı</li>
<li>Orta nokta hesaplamayı ve bir doğru parçasını verilen $m:n$ oranında bölen noktayı bulmayı</li>
<li>Koordinatlardan elde edilen uzaklıkları kullanarak üçgenleri sınıflandırmayı (dik, ikizkenar, eşkenar)</li>
<li>Bir geometrik koşulu sağlayan noktaların kümesi olarak yer-locus kavramını tanımlamayı ve en basit iki yer olarak çemberi ve orta dikmeyi tanımayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Kartezyen Koordinat Düzlemi</h2>

<div class="calc-highlight"><strong>Bir sayfa kâğıt, iki sayı doğrusu, sonsuz adres.</strong> Tanıdık reel sayı doğrusunu al (eşitsizlikler ve aralıklar için kullandığın doğrudur), bir kopyasını çıkar, 90 derece döndür ve iki sıfır çakışacak şekilde ilkinin üstüne yerleştir. Şimdi bir <em>koordinat düzlemin</em> var. Kâğıt üzerindeki her noktanın eşsiz bir sayı çifti var — adresi. Bu basit yapı, geometriyi cebire dönüştürür.</div>

<p class="l-text">Yatay sayı doğrusuna <strong>x-ekseni</strong> denir. Dikey olana <strong>y-ekseni</strong>. Kesişim noktaları — iki okumanın da sıfır olduğu yer — <strong>orijindir</strong>, O ile gösterilir. O'nun sağında x pozitiftir. Solunda negatiftir. O'nun üstünde y pozitiftir. Altında negatiftir. Bu sözleşme evrenseldir ve isteğe bağlı değildir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x-ekseni</div><div class="card-body">Yatay sayı doğrusu. Pozitif yön sağa. Bazen "apsis ekseni" de denir.</div></div>
<div class="calc-card"><div class="card-title">y-ekseni</div><div class="card-body">Dikey sayı doğrusu. Pozitif yön yukarı. Bazen "ordinat ekseni" de denir.</div></div>
<div class="calc-card"><div class="card-title">Orijin O</div><div class="card-body">$(0, 0)$ noktası. İki eksen burada buluşur. Her koordinat bu noktadan dışarı ölçülür.</div></div>
</div>

<p class="l-text"><strong>Dört bölge.</strong> İki eksen, düzlemi <em>bölge</em> denen dört açık alana ayırır. Sağ üstten başlayarak saat yönünün tersine I, II, III, IV olarak numaralandırılırlar — trigonometride pozitif açılar için kullandığımız yönle aynı. Her bölgedeki koordinatların işaret örüntüsü doğrudan çıkar:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Bölge</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">x'in işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">y'nin işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Örnek nokta</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>I</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem">$(3, 2)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>II</strong></td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem">$(-3, 2)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>III</strong></td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem">$(-3, -2)$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>IV</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem">$(3, -2)$</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>İnce bir durum:</strong> tam bir eksen üzerinde duran noktalar (örneğin $(5, 0)$ ya da $(0, -2)$) <em>hiçbir bölgede değildir</em>. Sınırda otururlar. Orijin $(0,0)$ ise aynı anda iki eksen üzerindedir.</div>

<h2 class="lesson-title">2. Sıralı İkililer: Bir Nokta Adresini Nasıl Alır</h2>

<div class="calc-highlight"><strong>"Sıralı" anahtar kelimedir.</strong> $(3, 2)$ çifti, $(2, 3)$ ile aynı değildir. Birinci slot her zaman x, ikinci slot her zaman y'dir. Yer değiştirirsen başka bir yerde başka bir nokta elde edersin. Bu sözleşme — önce x, sonra y — evrenseldir.</div>

<p class="l-text">Düzlemde bir $P$ noktası verildiğinde, $P$'den x-eksenine bir dikme indirelim. İndiğimiz sayı <strong>apsis</strong> (x-koordinatı) olarak adlandırılır. Sonra $P$'den y-eksenine bir dikme indirelim. İndiğimiz sayı <strong>ordinat</strong>tır (y-koordinatı). İki sayı, aralarına virgül konarak parantez içinde yazılır ve noktanın <em>koordinatlarıdır</em>:</p>

<div class="calc-formula"><div class="formula-label">SIRALI İKİLİ &mdash; BİR NOKTANIN ADRESİ</div><div class="formula-main">$$P \\;=\\; (x, \\, y)$$</div><div class="formula-sub">x apsistir (y-ekseninden yatay uzaklık). y ordinattır (x-ekseninden dikey uzaklık). İkisinin de işareti vardır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Apsis</div><div class="card-body">x-koordinatı. Noktanın y-ekseninden ne kadar solda ($-$) ya da sağda ($+$) durduğunu söyler.</div></div>
<div class="calc-card"><div class="card-title">Ordinat</div><div class="card-body">y-koordinatı. Noktanın x-ekseninden ne kadar altta ($-$) ya da üstte ($+$) durduğunu söyler.</div></div>
<div class="calc-card"><div class="card-title">Sıra önemli</div><div class="card-body">$(3, 2) \\neq (2, 3)$. Birinci slot her zaman x. Bu yüzden adına "sıralı" ikili denir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A = (4, 3)$, $B = (-2, 1)$, $C = (-3, -4)$, $D = (5, -2)$ noktalarını çiz ve her birinin bölgesini belirt.<br><br>$A$ için iki koordinat da pozitif &rarr; <strong>bölge I</strong>.<br>$B$ için $x < 0$, $y > 0$ &rarr; <strong>bölge II</strong>.<br>$C$ için iki koordinat da negatif &rarr; <strong>bölge III</strong>.<br>$D$ için $x > 0$, $y < 0$ &rarr; <strong>bölge IV</strong>.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$(0, -7)$ noktası nerede yaşar? Hiçbir bölgede değil — negatif y-ekseni üzerindedir. Peki $(3, 0)$? Pozitif x-ekseni üzerinde. En az bir koordinatı sıfır olan noktalar her zaman bir eksen üzerindedir.</div></div>

<h2 class="lesson-title">3. Uzaklık Formülü</h2>

<div class="calc-highlight"><strong>Tüm analitik geometride en önemli tek formül.</strong> İki nokta $A = (x_1, y_1)$ ve $B = (x_2, y_2)$ verildiğinde, aralarındaki uzaklık $AB$ doğru parçasının uzunluğudur. Formül doğrudan Pisagor teoreminden çıkar — kalkülüs yok, ileri araçlar yok, sadece dik üçgen.</div>

<p class="l-text"><strong>Resim.</strong> $A$'dan yatay bir doğru ve $B$'den dikey bir doğru çiz, üçüncü bir $C$ noktasında buluşana kadar. $ABC$ üçgeninin $C$'de dik açısı vardır (çünkü yatay ve dikey doğrular birbirine diktir). İki kenar $|x_2 - x_1|$ (yatay) ve $|y_2 - y_1|$ (dikey) uzunluğundadır. $AB$ parçası ise hipotenüstür. Pisagor'a göre:</p>

<div class="calc-formula"><div class="formula-label">PİSAGOR TÜRETMESİ</div><div class="formula-main">$$AB^2 \\;=\\; (x_2 - x_1)^2 + (y_2 - y_1)^2$$</div><div class="formula-sub">Karelemek mutlak değer işaretlerini kaldırır — $|x_2-x_1|^2 = (x_2-x_1)^2$ her durumda. Uzunluk için pozitif karekökü al.</div></div>

<div class="calc-formula"><div class="formula-label">UZAKLIK FORMÜLÜ &mdash; ANA SONUÇ</div><div class="formula-main">$$d(A, B) \\;=\\; \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$</div><div class="formula-sub">Bunu ezberle. Analitik geometrinin "$a^2 + b^2 = c^2$" karşılığıdır.</div></div>

<p class="l-text"><strong>Hangi noktayı "1", hangisini "2" diye adlandırdığın önemli değil.</strong> Farklar karelendiği için işaretler kaybolur: $(x_2 - x_1)^2 = (x_1 - x_2)^2$. $A$'dan $B$'ye uzaklık, $B$'den $A$'ya uzaklığa eşittir, sezgisel olarak da öyle olmalı.</p>

<div class="calc-graph"><div id="plot-l76-distance-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki nokta $A=(1, 1)$ ve $B=(5, 4)$ mavi bir parçayla bağlanmış. Kesik gri çizgiler dik üçgenin kenarlarını oluşturuyor — $|5-1|=4$ uzunluğunda yatay kenar, $|4-1|=3$ uzunluğunda dikey kenar. Hipotenüs $AB$ ise $\\sqrt{4^2+3^2}=\\sqrt{25}=5$ uzunluğunda; tam olarak uzaklık formülünün eylem halindeki hali.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[1,5],y:[1,4],mode:'lines+markers+text',name:'AB (hipotenüs)',line:{color:'#3b82f6',width:3.2},marker:{color:'#3b82f6',size:9},text:['A(1,1)','B(5,4)'],textposition:'top center',textfont:{color:'#e8e8e8',size:12}};
var legH={x:[1,5],y:[1,1],mode:'lines',name:'yatay kenar = 4',line:{color:'rgba(245,158,11,0.85)',width:2.2,dash:'dash'}};
var legV={x:[5,5],y:[1,4],mode:'lines',name:'dikey kenar = 3',line:{color:'rgba(16,185,129,0.85)',width:2.2,dash:'dash'}};
var corner={x:[5],y:[1],mode:'markers+text',name:'dik açı C(5,1)',marker:{color:'#e8e8e8',size:8,symbol:'square-open'},text:['C(5,1)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:11}};
var lbl={x:[3,5.25,3],y:[0.55,2.5,2.9],mode:'text',name:'uzunluklar',text:['Δx = 4','Δy = 3','d = √(16+9) = 5'],textfont:{color:['#f59e0b','#10b981','#3b82f6'],size:13},showlegend:false};
var axX={x:[-0.5,6.5],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,5.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l76-distance-tr',[axX,axY,legH,legV,seg,corner,lbl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$P = (3, 4)$ ile orijin $O = (0, 0)$ arasındaki uzaklığı bul.<br><br>$d(P, O) = \\sqrt{(3-0)^2 + (4-0)^2} = \\sqrt{9 + 16} = \\sqrt{25} = \\mathbf{5}$.<br><br>Bu, klasik 3-4-5 dik üçgenidir. Herhangi bir $(x, y)$ noktasının orijine uzaklığı $\\sqrt{x^2 + y^2}$ olur — ezberlenmeye değer özel bir durum.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$A = (-2, 3)$ ile $B = (4, -5)$ arasındaki uzaklığı bul.<br><br>$d(A, B) = \\sqrt{(4 - (-2))^2 + (-5 - 3)^2} = \\sqrt{6^2 + (-8)^2} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$.<br><br>Negatif işaretlerin karelenirken nasıl temizce yok olduğuna dikkat et.</div></div>

<div class="l-note"><strong>Bir noktanın orijine uzaklığı.</strong> Uzaklık formülünde $(x_1, y_1) = (0,0)$ alırsak daha basit form çıkar: $d = \\sqrt{x^2 + y^2}$. $(x, y)$ ikilisi artık orijine uzaklığı $\\sqrt{x^2+y^2}$ olan bir noktadır — birim çember, vektörler ve karmaşık sayılar bölümlerinde tekrar tekrar kullanacağımız bir gerçek.</div>

<h2 class="lesson-title">4. Orta Nokta Formülü</h2>

<div class="calc-highlight"><strong>Bir doğru parçasının orta noktası tam kulağa geldiği gibi: yolun yarısındaki nokta.</strong> Hesaplamak Pisagor istemez, sadece ortalama. Bir sayı doğrusu üzerindeki $a$ ve $b$ sayılarının ortalaması $(a+b)/2$'dir — ve aynı fikri her iki koordinata uygulamak düzlemdeki bir doğru parçasının orta noktasını verir.</div>

<div class="calc-formula"><div class="formula-label">ORTA NOKTA FORMÜLÜ</div><div class="formula-main">$$M \\;=\\; \\left( \\frac{x_1 + x_2}{2}, \\; \\frac{y_1 + y_2}{2} \\right)$$</div><div class="formula-sub">x'leri topla ve ikiye böl. y'leri topla ve ikiye böl. İşte $(x_1, y_1)$ ile $(x_2, y_2)$'yi birleştiren parçanın orta noktası.</div></div>

<p class="l-text"><strong>Ortalamanın neden işe yaradığı.</strong> $A$'dan $B$'ye parça boyunca yürüdüğünü hayal et. Yolun yarısında yatay uzaklığın yarısını ($\\Delta x / 2$) ve dikey uzaklığın yarısını ($\\Delta y / 2$) kat etmiş olursun. Bu artımları $A$'nın koordinatlarına eklemek tam olarak $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$ verir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$A = (1, 2)$ ile $B = (5, 8)$ noktalarını birleştiren doğru parçasının orta noktasını bul.<br><br>$M = \\left(\\dfrac{1 + 5}{2}, \\dfrac{2 + 8}{2}\\right) = \\left(\\dfrac{6}{2}, \\dfrac{10}{2}\\right) = \\mathbf{(3, 5)}$.<br><br>Doğrulama: $A=(1,2)$'den $M=(3,5)$'e artım $\\Delta=(2,3)$. $M=(3,5)$'ten $B=(5,8)$'e artım yine $\\Delta=(2,3)$. Eşit artımlar orta noktanın doğru olduğunu onaylıyor.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Bir çemberin çapının uç noktaları $(-3, 4)$ ve $(7, -2)$. Çemberin merkezini bul.<br><br>Bir çemberin merkezi, herhangi bir çapının orta noktasıdır, dolayısıyla:<br><br>$\\text{merkez} = \\left(\\dfrac{-3 + 7}{2}, \\dfrac{4 + (-2)}{2}\\right) = \\left(\\dfrac{4}{2}, \\dfrac{2}{2}\\right) = \\mathbf{(2, 1)}$.</div></div>

<div class="calc-graph"><div id="plot-l76-midpoint-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $A=(1,2)$'den $B=(5,8)$'e uzanan doğru parçası ve üzerinde vurgulanmış orta nokta $M=(3,5)$. Kesik gri parçalar $AM$ ve $MB$ gözle görülür şekilde eşit uzunlukta — tam olarak orta nokta formülünün garanti ettiği şey.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seg={x:[1,5],y:[2,8],mode:'lines',name:'AB parçası',line:{color:'rgba(255,255,255,0.25)',width:1.6,dash:'dot'}};
var aPt={x:[1],y:[2],mode:'markers+text',name:'A(1,2)',marker:{color:'#3b82f6',size:10},text:['A(1,2)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var bPt={x:[5],y:[8],mode:'markers+text',name:'B(5,8)',marker:{color:'#3b82f6',size:10},text:['B(5,8)'],textposition:'top left',textfont:{color:'#e8e8e8',size:12}};
var mPt={x:[3],y:[5],mode:'markers+text',name:'orta nokta M(3,5)',marker:{color:'#f59e0b',size:13,symbol:'diamond'},text:['M(3,5)'],textposition:'middle right',textfont:{color:'#f59e0b',size:13}};
var halfA={x:[1,3],y:[2,5],mode:'lines',name:'AM',line:{color:'#10b981',width:2.6}};
var halfB={x:[3,5],y:[5,8],mode:'lines',name:'MB',line:{color:'#ef4444',width:2.6}};
var axX={x:[-0.5,6.5],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,9.5],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-0.5,9.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l76-midpoint-tr',[axX,axY,seg,halfA,halfB,aPt,bPt,mPt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Orta nokta uç noktaların sırasına bağlı değildir.</strong> $A$ ile $B$'yi yer değiştir, formül aynı noktayı verir. Sebebi toplamanın değişme özelliğidir: $x_1 + x_2 = x_2 + x_1$.</div>

<h2 class="lesson-title">5. Bölme (Kısım) Formülü</h2>

<div class="calc-highlight"><strong>Bazen yarı yoldaki nokta değil, başka bir noktada bölmek istersin — diyelim ki $A$'dan $B$'ye yolun üçte birinde ya da parçayı 2:3 oranında ayırarak.</strong> Orta nokta formülü yalnızca 1:1 durumunu çözer. <em>Bölme formülü</em> bunu genelleştirir: herhangi bir $m:n$ oranı verildiğinde, bölme noktasının tam koordinatlarını verir.</div>

<p class="l-text">$P$ noktasının $AB$ doğru parçasını içeriden $AP : PB = m : n$ oranında böldüğünü varsayalım. O zaman:</p>

<div class="calc-formula"><div class="formula-label">İÇTEN BÖLME (KISIM) FORMÜLÜ</div><div class="formula-main">$$P \\;=\\; \\left( \\frac{m \\, x_2 + n \\, x_1}{m + n}, \\; \\frac{m \\, y_2 + n \\, y_1}{m + n} \\right)$$</div><div class="formula-sub">Her koordinat bir <em>ağırlıklı ortalamadır</em>. $B$ noktasının ağırlığı $m$ ($B$'ye daha yakın olan oranın kısmı); $A$'nın ağırlığı $n$. $m = n$ olduğunda formül orta nokta formülüne nasıl indiğine dikkat et.</div></div>

<p class="l-text"><strong>Mantık kontrolü.</strong> $m = n = 1$ koy: pay $x_2 + x_1$ olur, payda $2$'dir. Bu sıradan orta nokta formülünü verir. İyi — bölme formülü orta nokta formülünün katı bir genellemesidir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$P$ noktası, $A = (1, 2)$'den $B = (6, 12)$'ye uzanan parçayı $2 : 3$ oranında bölüyor. $P$'yi bul.<br><br>Burada $m = 2$, $n = 3$, $m + n = 5$.<br><br>$P_x = \\dfrac{2 \\cdot 6 + 3 \\cdot 1}{5} = \\dfrac{12 + 3}{5} = \\dfrac{15}{5} = 3$.<br>$P_y = \\dfrac{2 \\cdot 12 + 3 \\cdot 2}{5} = \\dfrac{24 + 6}{5} = \\dfrac{30}{5} = 6$.<br><br>$\\mathbf{P = (3, 6)}$. Doğrulama: $|AP| = \\sqrt{2^2 + 4^2} = \\sqrt{20}$, $|PB| = \\sqrt{3^2 + 6^2} = \\sqrt{45}$. Oran $\\sqrt{20} : \\sqrt{45} = 2 : 3$ &check;.</div></div>

<div class="l-note"><strong>Yaygın hata.</strong> Öğrenciler bazen $\\dfrac{m x_2 + n x_1}{m+n}$ yerine $\\dfrac{m x_1 + n x_2}{m+n}$ yazar. Ağırlıklar çapraz olur: $B$'ye daha yakın olan ağırlık (ki bu $m$'dir, $AP:PB = m:n$ oranının ilk kısmı) $B$'nin koordinatlarıyla çarpılır. Bunu bir kere ezberle, sıralamayı bir daha şaşırmazsın.</div>

<h2 class="lesson-title">6. Üçgen Köşeleri: Koordinatlardan Kenar Uzunlukları</h2>

<div class="calc-highlight"><strong>Bana bir üçgenin üç köşesini koordinat olarak ver, sana çeşitkenar mı, ikizkenar mı, eşkenar mı, dik açılı mı, yoksa bunlardan hiçbiri mi olduğunu söyleyeyim — sadece uzaklık formülünü üç kez uygulayıp sonuçları bilinen üçgen türlerine karşılaştırarak.</strong></div>

<p class="l-text">Tarif:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1: Üç kenar uzunluğunu hesapla</div><div class="card-body">Uzaklık formülünü kullanarak $|AB|$, $|BC|$, $|CA|$ değerlerini bul.</div></div>
<div class="calc-card"><div class="card-title">Adım 2: Uzunlukları karşılaştır</div><div class="card-body">Üçü de eşit &rarr; eşkenar. Sadece ikisi eşit &rarr; ikizkenar. Üçü de farklı &rarr; çeşitkenar.</div></div>
<div class="calc-card"><div class="card-title">Adım 3: Dik açı testi</div><div class="card-body">En uzun kenarın karesinin, diğer iki kenarın karelerinin toplamına eşit olup olmadığını kontrol et. Eşitse üçgen dik açılıdır (Pisagor).</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; DİK ÜÇGEN TESTİ</div><div class="example-body">Üçgenin köşeleri $A = (0, 0)$, $B = (4, 0)$, $C = (0, 3)$. Bunun dik üçgen olduğunu göster ve kenar uzunluklarını bul.<br><br>$|AB| = \\sqrt{(4-0)^2 + (0-0)^2} = \\sqrt{16} = 4$.<br>$|AC| = \\sqrt{(0-0)^2 + (3-0)^2} = \\sqrt{9} = 3$.<br>$|BC| = \\sqrt{(0-4)^2 + (3-0)^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$.<br><br>En uzun kenarda Pisagor testi: $|BC|^2 = 25$ ve $|AB|^2 + |AC|^2 = 16 + 9 = 25$.<br><br>$|BC|^2 = |AB|^2 + |AC|^2 \\Rightarrow$ <strong>$A$ köşesinde dik açı</strong>. Bu, ünlü 3-4-5 dik üçgenidir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; İKİZKENAR MI?</div><div class="example-body">Üçgen $A = (1, 1)$, $B = (5, 1)$, $C = (3, 4)$. Sınıflandır.<br><br>$|AB| = \\sqrt{16 + 0} = 4$.<br>$|AC| = \\sqrt{4 + 9} = \\sqrt{13}$.<br>$|BC| = \\sqrt{4 + 9} = \\sqrt{13}$.<br><br>$|AC| = |BC| \\Rightarrow$ <strong>ikizkenar</strong>. (Eşkenar değil: $|AB| \\neq |AC|$.) Dik açılı da değil: $|AB|^2 = 16$, $|AC|^2 + |BC|^2 = 26$ — eşleşme yok.</div></div>

<h2 class="lesson-title">7. Yer (Locus) Kavramı: Geometri Denklem Olarak</h2>

<div class="calc-highlight"><strong>Bir yer (locus, çoğulu loci), verilen bir geometrik koşulu sağlayan tüm noktaların kümesidir.</strong> Yunanca kökü kelimenin tam anlamıyla "yer" demektir — ve koordinat düzleminde bir yer genellikle bir eğridir, bazen bir doğru, ara sıra tek bir nokta hatta boş küme. Büyük fikir şu: sözel bir koşul ("orijine uzaklık 5'tir") doğrudan cebirsel bir denkleme çevrilir ("$x^2 + y^2 = 25$").</div>

<p class="l-text">Bu çeviri — <em>geometrik betimden cebirsel denkleme</em> — analitik geometrinin motorudur. Bir eğrinin denklemi bir kez yazıldığında, kesişimleri hesaplayabilir, özellikleri türetebilir ve geometrik problemleri cebirsel işlemle çözebilirsin. Tersine, bir denklem bir kez çizildiğinde cebirin görsel resmine sahip olursun.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sözel koşul</div><div class="card-body">"Orijine uzaklık 5'tir." Tamamen geometrik ifade, henüz koordinat yok.</div></div>
<div class="calc-card"><div class="card-title">Cebirsel çeviri</div><div class="card-body">$\\sqrt{x^2 + y^2} = 5 \\;\\Leftrightarrow\\; x^2 + y^2 = 25$. Koşulu çevirmek için uzaklık formülünü kullan.</div></div>
<div class="calc-card"><div class="card-title">Geometrik şekil</div><div class="card-body">Orijin merkezli yarıçapı 5 olan çember. Denklem ve resim aynı nokta kümesini betimler.</div></div>
</div>

<h2 class="lesson-title">8. En Önemli İki Yer</h2>

<p class="l-text">İki basit geometrik koşul matematiğin en yaygın iki eğrisini üretir. Onları tekrar tekrar göreceksin, dolayısıyla her birini sıfırdan türetmeye değer.</p>

<h3 style="margin-top:1.4rem;color:#3b82f6">8.1 Yer #1 &mdash; Çember: sabit bir noktaya eşit uzaklık</h3>

<p class="l-text"><strong>Koşul.</strong> "Sabit bir $C = (a, b)$ noktasına uzaklığı sabit bir $r > 0$ değerine eşit olan tüm $(x, y)$ noktaları."</p>

<p class="l-text">Uzaklık formülünü kullanarak çevir:</p>

<div class="calc-formula"><div class="formula-label">ÇEMBERİN DENKLEMİ &mdash; MERKEZ $(a, b)$, YARIÇAP $r$</div><div class="formula-main">$$(x - a)^2 + (y - b)^2 \\;=\\; r^2$$</div><div class="formula-sub">Karelemek karekökü kaldırır. Çözüm kümesi tam olarak $(a, b)$ merkezli yarıçapı $r$ olan çemberdir.</div></div>

<p class="l-text">Özel durum: merkez orijinde ($a = b = 0$) ise daha basit $x^2 + y^2 = r^2$ formu çıkar — birim çember için zaten karşılaştığımız denklem ($r = 1$).</p>

<div class="calc-graph"><div id="plot-l76-locus-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijine 3 uzaklıkta olan noktaların yeri — yarıçapı 3 olan bir çember. Turuncu örnek noktaların hepsi bu çember üzerindedir, her biri merkeze tam olarak 3 uzaklıkta. Kesik yarıçaplar tanımlayıcı koşulu gösterir: eğri üzerindeki her nokta $O$'ya aynı uzaklıktadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;th.push(a);xc.push(3*Math.cos(a));yc.push(3*Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'yer: x² + y² = 9',line:{color:'#3b82f6',width:3}};
var samp=[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,5*Math.PI/4,3*Math.PI/2,7*Math.PI/4];
var spX=[];var spY=[];for(var k=0;k<samp.length;k++){spX.push(3*Math.cos(samp[k]));spY.push(3*Math.sin(samp[k]));}
var pts={x:spX,y:spY,mode:'markers',name:'örnek noktalar (uzaklık = 3)',marker:{color:'#f59e0b',size:11}};
var rays={x:[],y:[],mode:'lines',name:'yarıçaplar',line:{color:'rgba(245,158,11,0.4)',width:1,dash:'dot'}};
for(var m=0;m<samp.length;m++){rays.x.push(0,3*Math.cos(samp[m]),null);rays.y.push(0,3*Math.sin(samp[m]),null);}
var orig={x:[0],y:[0],mode:'markers+text',name:'merkez O(0,0)',marker:{color:'#e8e8e8',size:9,symbol:'cross'},text:['O'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:13}};
var axX={x:[-4.2,4.2],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-4.2,4.2],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,dtick:1},yaxis:{title:'y',range:[-4.2,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l76-locus-tr',[axX,axY,ring,rays,pts,orig],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="margin-top:1.4rem;color:#3b82f6">8.2 Yer #2 &mdash; Orta dikme: iki sabit noktaya eşit uzaklık</h3>

<p class="l-text"><strong>Koşul.</strong> "$A$'ya olduğu kadar $B$'ye de aynı uzaklıkta olan tüm $(x, y)$ noktaları."</p>

<p class="l-text">Bu klasik geometriden ünlüdür: $A$ ile $B$'ye eşit uzaklıkta olan noktaların kümesi, $AB$ parçasının orta noktasından $AB$'ye dik geçen doğrudur — yani <em>orta dikme</em>. Bunu cebirsel olarak türetelim.</p>

<p class="l-text">$A = (x_1, y_1)$ ve $B = (x_2, y_2)$ olsun. $d(P, A) = d(P, B)$ koşulu şuna dönüşür:</p>

<div class="calc-formula"><div class="formula-label">ORTA DİKME &mdash; TÜRETME</div><div class="formula-main">$$(x - x_1)^2 + (y - y_1)^2 \\;=\\; (x - x_2)^2 + (y - y_2)^2$$</div><div class="formula-sub">Kareköklü ifadeleri kaldırmak için iki tarafın da uzaklıklarını karele.</div></div>

<p class="l-text">İki tarafı da aç. $x^2$ ve $y^2$ terimleri iki taraf arasında temizce sadeleşir:</p>

<div class="calc-formula"><div class="formula-label">SADELEŞTİRMEDEN SONRA</div><div class="formula-main">$$2(x_2 - x_1) x + 2(y_2 - y_1) y \\;=\\; (x_2^2 - x_1^2) + (y_2^2 - y_1^2)$$</div><div class="formula-sub">$x$ ve $y$ cinsinden <em>doğrusal</em> bir denklem — bu da yerin bir doğru olduğunu doğrular.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A = (1, 3)$ ile $B = (5, 7)$ noktalarını birleştiren parçanın orta dikmesinin denklemini bul.<br><br>$d(P, A)^2 = (x - 1)^2 + (y - 3)^2$<br>$d(P, B)^2 = (x - 5)^2 + (y - 7)^2$<br><br>Eşitleyip açarsak:<br>$x^2 - 2x + 1 + y^2 - 6y + 9 = x^2 - 10x + 25 + y^2 - 14y + 49$.<br><br>$x^2$ ve $y^2$ sadeleşir: $-2x + 1 - 6y + 9 = -10x + 25 - 14y + 49$, yani $-2x - 6y + 10 = -10x - 14y + 74$.<br><br>Düzenle: $8x + 8y = 64$, ya da $\\mathbf{x + y = 8}$.<br><br>Hızlı doğrulama: $AB$'nin orta noktası $(3, 5)$, $3 + 5 = 8$ &check;. Ve $AB$'nin eğimi $(7-3)/(5-1) = 1$, dolayısıyla orta dikmenin eğimi $-1$ olmalı — $x + y = 8$ ifadesini $y = -x + 8$ olarak yeniden yazmak eğimin $-1$ olduğunu onaylıyor &check;.</div></div>

<h2 class="lesson-title">9. Yaygın Hatalar ve Onlardan Nasıl Kaçınılır</h2>

<p class="l-text">Bu dersin sınav sorularında öğrencilere en fazla puan kaybettiren hataların kısa bir kataloğu. Dikkatlice oku — her biri kurulumda yapılan ince bir kaymadan kaynaklanır, derin bir kavram hatasından değil.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hata 1: yanlış sırada çıkarma</div><div class="card-body">Öğrenciler $(x_2 - x_1)$ yerine $(x_1 - x_2)$ yazıp yanlış işaret çıkardık endişesi yaşar. <strong>İkisi de işe yarar</strong>: kare işareti kaldırır. $(x_1 - x_2)^2 = (x_2 - x_1)^2$. Farkın işareti uzaklık için önemli değildir.</div></div>
<div class="calc-card"><div class="card-title">Hata 2: karekökü unutmak</div><div class="card-body">$(x_2-x_1)^2 + (y_2-y_1)^2$ hesapladıktan sonra elinde $d$ değil $d^2$ vardır. Karekökünü al. Zaman baskısı altındaki sınavlarda yaygındır; öğrenciler cevap olarak $d^2$'yi yazar.</div></div>
<div class="calc-card"><div class="card-title">Hata 3: orta noktayı uzaklıkla karıştırmak</div><div class="card-body">Orta nokta bir <em>noktadır</em>: bir koordinat çifti. Uzaklık bir <em>sayıdır</em>: pozitif bir reel değer. Farklı işlemler: orta nokta için ortalama, uzaklık için Pisagor.</div></div>
<div class="calc-card"><div class="card-title">Hata 4: bölme formülünde yanlış şeyleri ortalamak</div><div class="card-body">$P = \\big(\\frac{m x_2 + n x_1}{m+n}, ...\\big)$ ifadesinde $m$ ağırlığı $B$'nin koordinatıyla (uzak uç) çarpılır, $A$'nın değil. Mnemonik: "$A$'dan $B$'ye $m:n$ oranı" &rarr; "$m$ $B$ ile gider".</div></div>
<div class="calc-card"><div class="card-title">Hata 5: eksenleri nokta sanmak</div><div class="card-body">x-ekseni ya da y-ekseni üzerindeki noktalar <em>hiçbir bölgede değildir</em>. Onları bir bölgenin içinde değil, sınırda işaretle.</div></div>
<div class="calc-card"><div class="card-title">Hata 6: önemli olduğunda mutlak değeri düşürmek</div><div class="card-body">$(a, y_1)$ ile $(a, y_2)$ arasındaki dikey bir parçanın uzunluğu $|y_2 - y_1|$'dir, sadece $y_2 - y_1$ değil. Tam uzaklık formülündeki kare bunu gizler, ama tek bir koordinatla çalışırken bunu açıkça tut.</div></div>
</div>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>

<p class="l-text">Dersteki her şeyi bir araya getiren bir alıştırma seti. Önce her birini kendin çözmeyi dene, sonra çözüm açıklamasını oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; BÖLGELER</div><div class="example-body"><strong>Her biri için bölgeyi (ya da ekseni) belirle: $P_1 = (-4, 7)$, $P_2 = (3, -1)$, $P_3 = (0, 5)$, $P_4 = (-2, -8)$.</strong><br><br>$P_1$: $x < 0$, $y > 0$ &rarr; <strong>bölge II</strong>.<br>$P_2$: $x > 0$, $y < 0$ &rarr; <strong>bölge IV</strong>.<br>$P_3$: $x = 0$ &rarr; <strong>pozitif y-ekseni üzerinde</strong>, hiçbir bölgede değil.<br>$P_4$: $x < 0$, $y < 0$ &rarr; <strong>bölge III</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; UZAKLIK</div><div class="example-body"><strong>$A = (-1, 4)$ ile $B = (3, -2)$ arasındaki uzaklığı bul.</strong><br><br>$d(A, B) = \\sqrt{(3 - (-1))^2 + (-2 - 4)^2} = \\sqrt{4^2 + (-6)^2} = \\sqrt{16 + 36} = \\sqrt{52} = 2\\sqrt{13}$.<br><br>Cevap: $\\mathbf{2\\sqrt{13}}$ (yaklaşık 7.21).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; ORTA NOKTA</div><div class="example-body"><strong>$M$ noktası $AB$ parçasının orta noktasıdır. $A = (-3, 5)$ ve $M = (1, 2)$ ise $B$'yi bul.</strong><br><br>$M = \\big(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\big)$ formülünü kullanıp $B$ için çöz:<br>$1 = \\dfrac{-3 + x_B}{2} \\Rightarrow x_B = 5$.<br>$2 = \\dfrac{5 + y_B}{2} \\Rightarrow y_B = -1$.<br><br>Cevap: $\\mathbf{B = (5, -1)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; BÖLME FORMÜLÜ</div><div class="example-body"><strong>$P$ noktası, $A = (-2, 1)$'den $B = (8, 6)$'ya uzanan parçayı $3 : 2$ oranında bölüyor. $P$'yi bul.</strong><br><br>$m = 3$, $n = 2$, $m + n = 5$.<br><br>$P_x = \\dfrac{3 \\cdot 8 + 2 \\cdot (-2)}{5} = \\dfrac{24 - 4}{5} = \\dfrac{20}{5} = 4$.<br>$P_y = \\dfrac{3 \\cdot 6 + 2 \\cdot 1}{5} = \\dfrac{18 + 2}{5} = \\dfrac{20}{5} = 4$.<br><br>Cevap: $\\mathbf{P = (4, 4)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; ÜÇGEN SINIFLANDIRMA</div><div class="example-body"><strong>Köşeleri $A = (0, 0)$, $B = (4, 0)$, $C = (0, 3)$ olan üçgenin dik üçgen olduğunu göster. Dik kenarları ve hipotenüsü belirt.</strong><br><br>$|AB| = \\sqrt{16} = 4$, $|AC| = \\sqrt{9} = 3$, $|BC| = \\sqrt{16 + 9} = 5$.<br><br>Pisagor testi: $|BC|^2 = 25 = 16 + 9 = |AB|^2 + |AC|^2$ &check;.<br><br>Sonuç: $\\mathbf{A}$ köşesinde dik açı. Dik kenarlar: $\\mathbf{AB = 4}$, $\\mathbf{AC = 3}$. Hipotenüs: $\\mathbf{BC = 5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; YER (ÇEMBER)</div><div class="example-body"><strong>Merkezi $(2, -3)$ ve yarıçapı 4 olan çemberin denklemini yaz.</strong><br><br>$(x-a)^2 + (y-b)^2 = r^2$ formülünü $a = 2$, $b = -3$, $r = 4$ ile uygula:<br><br>$\\mathbf{(x - 2)^2 + (y + 3)^2 = 16}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; ORTA DİKME</div><div class="example-body"><strong>$A = (0, 0)$ ile $B = (6, 4)$'ye eşit uzaklıktaki noktaların kümesinin denklemini bul.</strong><br><br>$x^2 + y^2 = (x-6)^2 + (y-4)^2 = x^2 - 12x + 36 + y^2 - 8y + 16$.<br><br>$x^2, y^2$ sadeleşir: $0 = -12x + 36 - 8y + 16$, yani $12x + 8y = 52$, ya da $\\mathbf{3x + 2y = 13}$.<br><br>Doğrulama: $AB$'nin orta noktası $(3, 2)$ ve $3 \\cdot 3 + 2 \\cdot 2 = 13$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; DOĞRUSAL NOKTALAR</div><div class="example-body"><strong>$P = (1, 2)$, $Q = (3, 6)$, $R = (4, 8)$ noktaları doğrusal mıdır?</strong><br><br>Üç nokta ancak ve ancak uzaklıklardan biri diğer ikisinin toplamına eşitse doğrusaldır.<br>$|PQ| = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$.<br>$|QR| = \\sqrt{1 + 4} = \\sqrt{5}$.<br>$|PR| = \\sqrt{9 + 36} = \\sqrt{45} = 3\\sqrt{5}$.<br><br>Doğrulama: $|PQ| + |QR| = 2\\sqrt{5} + \\sqrt{5} = 3\\sqrt{5} = |PR|$ &check;.<br><br>Evet — $P$, $Q$, $R$ doğrusaldır, $Q$ noktası $P$ ile $R$ arasındadır.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Düzlemdeki bir noktanın sıralı ikili adresi $(x, y)$'dir: önce apsis, sonra ordinat</li>
<li>İki dik sayı doğrusu ve bir orijin Kartezyen düzlemi tanımlar; dört bölge saat yönünün tersine I'den IV'e numaralanır</li>
<li>Uzaklık: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$, Pisagor'dan türetilir</li>
<li>Orta nokta: $M = \\big(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\big)$ &mdash; sadece ortalama</li>
<li>Bölme formülü: $P = \\big(\\frac{m x_2 + n x_1}{m+n}, \\frac{m y_2 + n y_1}{m+n}\\big)$ herhangi bir $m:n$ oranına genelleştirir</li>
<li>Koordinatlardan kenar uzunlukları üçgeni sınıflandırır ve Pisagor ile dik açıyı tespit eder</li>
<li>Yer (locus), bir koşulu sağlayan noktaların kümesidir: çember $(x-a)^2 + (y-b)^2 = r^2$; orta dikme $d(P,A) = d(P,B)$ koşulundan çıkar</li>
</ul>
</div>`

};
