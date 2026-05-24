window.LISE_MAT_L93 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A locus is a set of points that share a common rule.</strong> Instead of describing a shape with a formula handed to you, you describe a rule that a point must obey, and then ask: which points obey it? That set of points <em>is</em> the shape. This is one of the oldest moves in geometry — the Greeks treated a circle not as the graph of $x^2 + y^2 = r^2$, but as "the set of all points the same distance from a fixed centre." Every conic section in this course, every classical construction in the next, comes from this single way of thinking.</p>

<p class="l-text">The companion idea is <em>compass-and-straightedge construction</em>. Given only an unmarked straightedge (to draw lines through two points) and a compass (to draw a circle through one point centred at another), what shapes can you build? It sounds limiting — and it is — but inside those limits lies almost all of classical Euclidean geometry. By the end of this lesson you will be able to write the equation of a locus from its defining condition, recognise the six classical loci by sight, and walk through the construction of perpendicular bisectors, angle bisectors, and parallels step by step.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a locus as the set of all points satisfying a given geometric condition</li>
<li>Recognise the six classical loci: circle, perpendicular bisector, angle bisector, parabola, ellipse, hyperbola</li>
<li>Convert a geometric locus condition into an algebraic equation by writing the rule with coordinates</li>
<li>Perform the four foundational compass-and-straightedge constructions (perpendicular bisector, angle bisector, copy, parallel)</li>
<li>Recognise the three classical impossibilities (trisecting a general angle, squaring the circle, doubling the cube)</li>
<li>Derive the Apollonius circle as the locus where the ratio of distances to two points is a fixed constant</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Locus?</h2>

<div class="calc-highlight"><strong>The word "locus" is Latin for "place".</strong> In geometry, a locus is the <em>place</em> — meaning the full collection of locations — where a moving point can sit while obeying a fixed rule. The rule is geometric; the locus is the shape that emerges.</div>

<p class="l-text">Take a simple example. The rule says: <em>be exactly 3 units away from the point $(0, 0)$</em>. Which points obey this? Every point at distance 3 from the origin. Geometrically, that is a circle of radius 3 centred at the origin. The locus <em>is</em> the circle. The rule defined it.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF A LOCUS</div><div class="formula-main">$$L \\;=\\; \\{\\, P \\in \\mathbb{R}^2 \\;:\\; P \\text{ satisfies condition } \\mathcal{C} \\,\\}$$</div><div class="formula-sub">A locus L is the set of all points P in the plane such that P satisfies a given geometric condition C. The condition is the rule; the locus is the shape.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Condition</div><div class="card-body">A geometric rule that any candidate point must obey. Often phrased "equidistant from...", "at distance r from...", "on the bisector of...".</div></div>
<div class="calc-card"><div class="card-title">Locus</div><div class="card-body">The set of all points obeying the condition. Usually a familiar shape (line, circle, conic) or a union of such shapes.</div></div>
<div class="calc-card"><div class="card-title">Verification</div><div class="card-body">A complete locus argument has two directions: every point on the locus obeys the rule, and every point obeying the rule lies on the locus.</div></div>
</div>

<p class="l-text">The two-direction check matters. If you describe a locus and only show one direction (every point on your shape obeys the rule), you have missed the possibility that the locus might be bigger. If you only show the other direction (every point obeying the rule lies on your shape), you have not ruled out extra points on your shape that fail the rule. A complete description requires both.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Describe in words the locus of all points equidistant from the two parallel lines $y = 1$ and $y = 5$. (Answer: the single horizontal line $y = 3$, halfway between them. Every point on $y = 3$ is exactly 2 units from each parallel line; conversely, any point with $y \\neq 3$ is closer to one than the other.)</div></div>

<h2 class="lesson-title">2. The Six Classical Loci</h2>

<div class="calc-highlight"><strong>Almost every locus problem in high-school geometry reduces to one of six shapes.</strong> Learn the defining condition for each and you can name them on sight. The rest of this lesson and many later ones will be variations on these themes.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Locus</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Defining condition</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Equation form</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Circle</strong></td><td style="padding:0.5rem 0.8rem">Distance from a fixed point is constant r</td><td style="padding:0.5rem 0.8rem">$(x-a)^2 + (y-b)^2 = r^2$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Perpendicular bisector</strong></td><td style="padding:0.5rem 0.8rem">Equidistant from two fixed points</td><td style="padding:0.5rem 0.8rem">Linear in x and y</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Angle bisector</strong></td><td style="padding:0.5rem 0.8rem">Equidistant from two intersecting lines</td><td style="padding:0.5rem 0.8rem">A pair of lines through the intersection</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Parabola</strong></td><td style="padding:0.5rem 0.8rem">Equidistant from a point (focus) and a line (directrix)</td><td style="padding:0.5rem 0.8rem">$y = ax^2 + bx + c$ form</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Ellipse</strong></td><td style="padding:0.5rem 0.8rem">Sum of distances to two foci is constant</td><td style="padding:0.5rem 0.8rem">$\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Hyperbola</strong></td><td style="padding:0.5rem 0.8rem">Absolute difference of distances to two foci is constant</td><td style="padding:0.5rem 0.8rem">$\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The pattern.</strong> Read the second column carefully. Every classical locus is built from the same two primitive measurements: <em>distance from a point</em> and <em>distance from a line</em>. Once you accept that any locus is a relationship between such distances, the catalogue above stops looking like six unrelated shapes and starts looking like six combinations of one idea.</p>

<div class="l-note"><strong>Coming up.</strong> The conic sections (parabola, ellipse, hyperbola) get full dedicated lessons later in the curriculum. Here we only meet their locus definitions; the algebraic machinery comes later.</div>

<h2 class="lesson-title">3. The Algebraic Approach: From Condition to Equation</h2>

<div class="calc-highlight"><strong>The trick is to write the condition with coordinates.</strong> Pick a generic point $P = (x, y)$, translate the geometric rule into an algebraic equation in x and y, and simplify. The resulting equation is the locus.</div>

<p class="l-text">The basic toolkit is short:</p>

<div class="calc-formula"><div class="formula-label">TWO INDISPENSABLE FORMULAS</div><div class="formula-main">$$d(P, Q) \\;=\\; \\sqrt{(x_P - x_Q)^2 + (y_P - y_Q)^2}$$<br>$$d(P, \\ell) \\;=\\; \\frac{|Ax + By + C|}{\\sqrt{A^2 + B^2}} \\quad\\text{where } \\ell: Ax + By + C = 0$$</div><div class="formula-sub">Distance between two points; distance from a point to a line. Almost every locus equation is built from these.</div></div>

<p class="l-text"><strong>A four-step procedure</strong> you can apply to any locus problem:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Setup</div><div class="card-body">Let $P = (x, y)$ be a generic point on the locus. Identify the fixed points, lines, or other geometric data in the problem.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Translate</div><div class="card-body">Write the geometric condition as an equation. Use the distance formulas above where needed.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Simplify</div><div class="card-body">Square both sides to remove radicals, expand, collect terms. Aim for a clean equation in x and y.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Identify</div><div class="card-body">Read the resulting equation and recognise the shape (line, circle, conic).</div></div>
</div>

<h2 class="lesson-title">4. Worked Example: Perpendicular Bisector by Algebra</h2>

<div class="calc-highlight"><strong>The cleanest way to see the algebraic method work is on the simplest locus — the perpendicular bisector.</strong> Two fixed points, one equation, a satisfying line.</div>

<p class="l-text"><strong>Problem.</strong> Find the locus of all points $P = (x, y)$ equidistant from $A = (0, 0)$ and $B = (4, 0)$.</p>

<div class="calc-example"><div class="example-label">FULL SOLUTION</div><div class="example-body"><strong>Step 1.</strong> Let $P = (x, y)$ be a generic point on the locus. The condition is $d(P, A) = d(P, B)$.<br><br><strong>Step 2.</strong> Translate using the distance formula:<br>$\\sqrt{x^2 + y^2} = \\sqrt{(x-4)^2 + y^2}$.<br><br><strong>Step 3.</strong> Square both sides:<br>$x^2 + y^2 = (x-4)^2 + y^2$.<br>Expand the right side: $x^2 + y^2 = x^2 - 8x + 16 + y^2$.<br>Cancel: $0 = -8x + 16$, so $\\boxed{\\,x = 2\\,}$.<br><br><strong>Step 4.</strong> The locus is the vertical line $x = 2$ — the perpendicular bisector of segment AB. As predicted: equidistant from two points = perpendicular bisector.</div></div>

<div class="calc-graph"><div id="plot-l93-perpbisect-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two points A and B, and the vertical line $x = 2$ — the locus of all points equidistant from A and B. A few sample points on the line are marked with dashed lines to A and B; the two dashed lines for each sample point have equal length, confirming the locus.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Aen={x:[0],y:[0],mode:'markers+text',name:'A(0,0)',marker:{color:'#f59e0b',size:12},text:['A'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:13}};
var Ben={x:[4],y:[0],mode:'markers+text',name:'B(4,0)',marker:{color:'#f59e0b',size:12},text:['B'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:13}};
var bisEn={x:[2,2],y:[-3,3],mode:'lines',name:'locus x=2',line:{color:'#3b82f6',width:3}};
var sx=[2,2,2],sy=[1.5,0,-1.5];
var spt={x:sx,y:sy,mode:'markers',name:'sample points',marker:{color:'#10b981',size:8}};
var conn={x:[],y:[],mode:'lines',name:'distances',line:{color:'rgba(16,185,129,0.45)',width:1.4,dash:'dot'},showlegend:false};
for(var i=0;i<sx.length;i++){conn.x.push(0,sx[i],null,4,sx[i],null);conn.y.push(0,sy[i],null,0,sy[i],null);}
var layEn={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l93-perpbisect-en',[bisEn,conn,Aen,Ben,spt],layEn,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">QUICK CHECK</div><div class="example-body">Try a generic point on the line, say $(2, 1)$. Distance to A: $\\sqrt{4 + 1} = \\sqrt{5}$. Distance to B: $\\sqrt{4 + 1} = \\sqrt{5}$. Equal. The rule holds. Now try an off-line point, say $(3, 0)$. Distance to A: 3. Distance to B: 1. Not equal — and $(3, 0)$ is indeed off the locus.</div></div>

<h2 class="lesson-title">5. Worked Example: A Circle as Locus</h2>

<p class="l-text"><strong>Problem.</strong> Find the locus of all points at distance 5 from the origin.</p>

<div class="calc-example"><div class="example-label">SOLUTION</div><div class="example-body">Let $P = (x, y)$. The condition is $d(P, O) = 5$ where $O = (0, 0)$.<br><br>$\\sqrt{x^2 + y^2} = 5$.<br>Square both sides:<br>$\\boxed{\\,x^2 + y^2 = 25\\,}$.<br><br>The locus is the circle of radius 5 centred at the origin. Verification: any point on this circle has distance exactly 5 from O; any point at distance exactly 5 from O lies on this circle.</div></div>

<div class="calc-graph"><div id="plot-l93-circle-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the circle $x^2 + y^2 = 25$ as the locus of points at distance 5 from the origin. Four sample points on the circle (at angles 0, 90, 180, 270 degrees) are marked with dashed radii — every radius has the same length, by construction.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var cx=[],cy=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;cx.push(5*Math.cos(a));cy.push(5*Math.sin(a));}
var circ={x:cx,y:cy,mode:'lines',name:'x²+y²=25',line:{color:'#3b82f6',width:3}};
var orig={x:[0],y:[0],mode:'markers+text',name:'O(0,0)',marker:{color:'#f59e0b',size:11},text:['O'],textposition:'top right',textfont:{color:'#e8e8e8',size:13}};
var sx=[5,0,-5,0],sy=[0,5,0,-5];
var spt={x:sx,y:sy,mode:'markers',name:'sample points',marker:{color:'#10b981',size:9}};
var conn={x:[],y:[],mode:'lines',name:'radii (all =5)',line:{color:'rgba(16,185,129,0.45)',width:1.4,dash:'dot'}};
for(var i=0;i<4;i++){conn.x.push(0,sx[i],null);conn.y.push(0,sy[i],null);}
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l93-circle-en',[circ,conn,orig,spt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Compass and Straightedge: The Rules of the Game</h2>

<div class="calc-highlight"><strong>Classical construction allows only two tools.</strong> A <em>straightedge</em> — like a ruler with no markings — which can draw the unique line through any two given points. A <em>compass</em> — which can draw the circle centred at one given point passing through another given point. Nothing else: no measuring, no copying lengths with marks, no protractor.</div>

<p class="l-text">The discipline is austere by design. Inside it, the Greeks worked out almost all of plane geometry: bisecting segments and angles, constructing perpendiculars and parallels, building regular polygons, even solving certain quadratic equations geometrically. Outside it, they discovered three famous problems that no construction can solve — but more on those in section 9.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">What a straightedge does</div><div class="card-body">Given two distinct points P and Q, draw the unique line through them. That is the only operation.</div></div>
<div class="calc-card"><div class="card-title">What a compass does</div><div class="card-body">Given two distinct points P and Q (with P as centre), draw the circle through Q centred at P. The compass is "collapsing" — it forgets its radius when lifted from the paper. (Though one can prove an equivalent power for non-collapsing compasses.)</div></div>
<div class="calc-card"><div class="card-title">What you can construct</div><div class="card-body">New points wherever your drawn lines and circles intersect each other. The set of constructible points grows step by step from your starting points.</div></div>
</div>

<h2 class="lesson-title">7. Construction 1: Perpendicular Bisector of a Segment</h2>

<div class="calc-highlight"><strong>This is the most useful construction in classical geometry.</strong> Given two points A and B, build the line that is equidistant from both. You get the perpendicular bisector of segment AB, plus its midpoint, plus a perpendicular direction — three results from one short procedure.</div>

<p class="l-text"><strong>Procedure.</strong> Given segment AB.</p>

<ol style="margin:1rem 0;padding-left:1.5rem;line-height:1.8;color:rgba(235,230,220,0.92)">
<li>Place the compass point at A. Open it to <em>any</em> radius r larger than half the length of AB.</li>
<li>Draw a circle (or arc) of radius r centred at A.</li>
<li>Without changing the radius, place the compass point at B and draw a second circle (or arc) of radius r centred at B.</li>
<li>The two arcs intersect at two points — call them P (above AB) and Q (below AB).</li>
<li>Use the straightedge to draw the line PQ. This line is the perpendicular bisector of segment AB. The point where PQ crosses AB is the midpoint M of AB.</li>
</ol>

<div class="calc-example"><div class="example-label">WHY IT WORKS</div><div class="example-body">By construction, $d(P, A) = d(P, B) = r$ (both arcs had radius r). So P is equidistant from A and B — i.e. P lies on the perpendicular bisector of AB. The same argument gives Q on the bisector. Two points determine a line, so the line PQ is the perpendicular bisector. (We also get the midpoint for free, at the intersection of PQ with AB.)</div></div>

<div class="calc-graph"><div id="plot-l93-construct-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the perpendicular-bisector construction of segment AB. The two arcs of radius r centred at A and B intersect at P and Q. The line PQ is the perpendicular bisector, crossing AB at the midpoint M.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0,Bx=4,By=0,r=2.8;
var arcAx=[],arcAy=[];for(var i=0;i<=180;i++){var a=Math.PI*i/180-Math.PI/2;arcAx.push(Ax+r*Math.cos(a));arcAy.push(Ay+r*Math.sin(a));}
var arcBx=[],arcBy=[];for(var i=0;i<=180;i++){var a=Math.PI*i/180+Math.PI/2;arcBx.push(Bx+r*Math.cos(a));arcBy.push(By+r*Math.sin(a));}
var pX=(Ax+Bx)/2, pYpos=Math.sqrt(r*r-Math.pow((Bx-Ax)/2,2));
var arA={x:arcAx,y:arcAy,mode:'lines',name:'arc at A',line:{color:'#f59e0b',width:1.8,dash:'dot'}};
var arB={x:arcBx,y:arcBy,mode:'lines',name:'arc at B',line:{color:'#10b981',width:1.8,dash:'dot'}};
var seg={x:[Ax,Bx],y:[Ay,By],mode:'lines+markers+text',name:'AB',line:{color:'#e8e8e8',width:2.5},marker:{color:'#e8e8e8',size:10},text:['A','B'],textposition:'bottom center',textfont:{color:'#e8e8e8',size:13}};
var bis={x:[pX,pX],y:[-pYpos*1.1,pYpos*1.1],mode:'lines',name:'bisector PQ',line:{color:'#3b82f6',width:3}};
var pts={x:[pX,pX,pX],y:[pYpos,-pYpos,0],mode:'markers+text',name:'P, Q, M',marker:{color:'#ec4899',size:10},text:['P','Q','M'],textposition:['top right','bottom right','top right'],textfont:{color:'#e8e8e8',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l93-construct-en',[arA,arB,seg,bis,pts],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Constructions 2-6: The Standard Repertoire</h2>

<p class="l-text">The remaining classical constructions follow the same pattern: equal arcs to fix equidistant points, then a straightedge to connect them. Below is the standard repertoire in compressed form. Each one rewards a few minutes of paper-and-compass practice.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bisect an angle &angle;AOB</div><div class="card-body">(1) Draw an arc centred at O cutting OA at P and OB at Q. (2) Draw equal-radius arcs centred at P and at Q; let them meet at R. (3) Line OR bisects the angle.</div></div>
<div class="calc-card"><div class="card-title">Copy a segment</div><div class="card-body">To copy segment AB onto a new ray from point C: draw arc of radius AB centred at C; it meets the ray at a point D with CD = AB.</div></div>
<div class="calc-card"><div class="card-title">Copy an angle</div><div class="card-body">Use an arc centred at the original angle's vertex to mark two points; copy the chord between them onto an arc of the same radius at the new vertex.</div></div>
<div class="calc-card"><div class="card-title">Perpendicular through point on a line</div><div class="card-body">From the point P on line $\\ell$, mark two equidistant points on $\\ell$ with arcs. Then construct the perpendicular bisector of those two points — it passes through P.</div></div>
<div class="calc-card"><div class="card-title">Parallel through external point</div><div class="card-body">Through external point P parallel to line $\\ell$: construct any transversal through P meeting $\\ell$ at Q; then copy the angle &angle;PQR on the other side of P. The new ray is parallel to $\\ell$.</div></div>
<div class="calc-card"><div class="card-title">Equilateral triangle on AB</div><div class="card-body">Draw arc of radius AB centred at A. Draw arc of radius AB centred at B. The two arcs intersect at C — and triangle ABC is equilateral.</div></div>
</div>

<div class="l-note"><strong>The equilateral triangle construction is Euclid's <em>Proposition 1</em></strong> — the very first construction in the <em>Elements</em>. Three centuries before the Common Era, Euclid built a 13-book chain of constructions and theorems, each step justified by what came before, starting from this single picture.</div>

<h2 class="lesson-title">9. The Three Classical Impossibilities</h2>

<div class="calc-highlight"><strong>Compass-and-straightedge is powerful but not all-powerful.</strong> Three famous problems resisted every Greek attempt and were eventually proved <em>impossible</em> in the 19th century, using algebraic ideas the Greeks did not have access to.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trisecting a general angle</div><div class="card-body">Given any angle &theta;, construct an angle of measure &theta;/3 using only compass and straightedge. Some special angles (e.g. 90&deg;, since 90/3 = 30 is constructible) <em>can</em> be trisected, but the general case cannot. Proved impossible by Pierre Wantzel (1837).</div></div>
<div class="calc-card"><div class="card-title">Squaring the circle</div><div class="card-body">Given a circle of radius 1, construct a square of equal area — i.e. a square of side $\\sqrt{\\pi}$. Impossible because $\\pi$ is transcendental (Lindemann, 1882) and only algebraic numbers of degree a power of 2 are constructible.</div></div>
<div class="calc-card"><div class="card-title">Doubling the cube</div><div class="card-body">Given a cube of side 1, construct the side of a cube of double the volume — i.e. construct $\\sqrt[3]{2}$. Impossible because constructible lengths satisfy a polynomial of degree $2^k$ over the rationals; $\\sqrt[3]{2}$ does not. Also proved by Wantzel (1837).</div></div>
</div>

<p class="l-text"><strong>What "impossible" really means.</strong> Not "hard". Not "nobody has found a way yet". A mathematical proof exists showing that <em>no possible sequence</em> of straightedge and compass moves can produce the construction, ever. The proofs use field theory — every length constructible from a unit segment lies in a tower of quadratic extensions of the rationals, and the three targets above provably lie outside that tower.</p>

<h2 class="lesson-title">10. The Apollonius Circle</h2>

<div class="calc-highlight"><strong>A surprising locus: fix two points A and B, fix a positive constant k different from 1, and ask for all points P with PA / PB = k.</strong> Most students guess "some line", but it turns out to be a circle — the <em>Apollonius circle</em>, named after the Greek geometer Apollonius of Perga.</div>

<p class="l-text">Place A = (0, 0) and B = (d, 0) on the x-axis. Let $P = (x, y)$ and set up the ratio:</p>

<div class="calc-formula"><div class="formula-label">SETTING UP THE LOCUS</div><div class="formula-main">$$\\frac{\\sqrt{x^2 + y^2}}{\\sqrt{(x-d)^2 + y^2}} \\;=\\; k$$</div></div>

<p class="l-text">Square both sides and rearrange:</p>

<div class="calc-formula"><div class="formula-label">AFTER SIMPLIFICATION</div><div class="formula-main">$$x^2 + y^2 \\;=\\; k^2 \\bigl[(x-d)^2 + y^2\\bigr]$$<br>$$(1 - k^2)(x^2 + y^2) + 2 k^2 d \\, x - k^2 d^2 \\;=\\; 0$$</div><div class="formula-sub">When $k \\neq 1$, the leading coefficient $1 - k^2$ is nonzero and the equation describes a circle. When $k = 1$, it collapses to the perpendicular bisector — a circle of "infinite radius" if you like.</div></div>

<div class="calc-example"><div class="example-label">SPECIAL CASE</div><div class="example-body">Take A = (0, 0), B = (6, 0), and k = 2 (so the locus is points twice as far from A as from B). The equation becomes:<br><br>$x^2 + y^2 = 4[(x-6)^2 + y^2]$<br>$x^2 + y^2 = 4x^2 - 48x + 144 + 4y^2$<br>$-3x^2 - 3y^2 + 48x - 144 = 0$<br>$x^2 + y^2 - 16x + 48 = 0$<br>$(x - 8)^2 + y^2 = 64 - 48 = 16$.<br><br>The locus is a circle of radius 4 centred at $(8, 0)$. Note: A and B are <em>not</em> on the locus, but they are on the line through the centre — this is a general property of Apollonius circles.</div></div>

<div class="l-note"><strong>Why this matters.</strong> The Apollonius circle shows up in inversion geometry, in pursuit problems (two ships moving with different speeds), in network localisation algorithms, and in the geometry of complex Möbius transformations. A locus that looks artificial in high school turns out to be everywhere in advanced mathematics.</div>

<h2 class="lesson-title">11. Worked Problems</h2>

<p class="l-text">Eight exercises blending locus reasoning with construction. Try each one, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — PERPENDICULAR BISECTOR</div><div class="example-body"><strong>Find the equation of the locus of points equidistant from $A = (0, 0)$ and $B = (6, 0)$.</strong><br><br>Set $d(P, A) = d(P, B)$ with $P = (x, y)$:<br>$\\sqrt{x^2 + y^2} = \\sqrt{(x-6)^2 + y^2}$.<br>Square: $x^2 = (x-6)^2 = x^2 - 12x + 36$.<br>Solve: $12x = 36$, so $\\boxed{\\,x = 3\\,}$. The locus is the vertical line $x = 3$, the perpendicular bisector of AB.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — CIRCLE LOCUS</div><div class="example-body"><strong>Find the locus of points at distance 7 from $C = (2, -1)$.</strong><br><br>Set $d(P, C) = 7$:<br>$\\sqrt{(x-2)^2 + (y+1)^2} = 7$.<br>Square: $\\boxed{\\,(x-2)^2 + (y+1)^2 = 49\\,}$. This is a circle of radius 7 centred at $(2, -1)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — EQUIDISTANT FROM TWO LINES</div><div class="example-body"><strong>Find the locus of points equidistant from the x-axis and the y-axis.</strong><br><br>Distance from $P = (x, y)$ to the x-axis is $|y|$; to the y-axis is $|x|$.<br>Set $|x| = |y|$, which means $y = x$ or $y = -x$.<br><br>Answer: <strong>the two lines $y = x$ and $y = -x$</strong> (the angle bisectors of the four quadrants). <strong>Don't forget the second branch:</strong> a common mistake is to write only $y = x$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — CONSTRUCT AN ANGLE BISECTOR</div><div class="example-body"><strong>Describe step-by-step the compass-and-straightedge construction of the bisector of an angle &angle;AOB.</strong><br><br>Step 1: Place the compass at O. Draw any arc; it meets ray OA at P and ray OB at Q. (So OP = OQ.)<br>Step 2: Place the compass at P. Open it to any convenient radius r. Draw an arc inside the angle.<br>Step 3: Without changing the radius, place the compass at Q. Draw a second arc inside the angle.<br>Step 4: The two arcs meet at a point R. Use the straightedge to draw the ray OR. <strong>Ray OR is the angle bisector.</strong><br><br>Why: triangles OPR and OQR are congruent (SSS: OP = OQ, PR = QR by construction, OR shared), so the angles at O are equal.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — APOLLONIUS CIRCLE</div><div class="example-body"><strong>Find the locus of points P with $PA / PB = 3$ where $A = (0, 0)$, $B = (8, 0)$.</strong><br><br>$\\sqrt{x^2 + y^2} = 3 \\sqrt{(x-8)^2 + y^2}$.<br>Square: $x^2 + y^2 = 9[(x-8)^2 + y^2]$<br>$x^2 + y^2 = 9x^2 - 144x + 576 + 9y^2$<br>$-8x^2 - 8y^2 + 144x - 576 = 0$<br>$x^2 + y^2 - 18x + 72 = 0$<br>$(x-9)^2 + y^2 = 9$.<br><br>Answer: circle of radius 3 centred at $(9, 0)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — EQUIDISTANT FROM POINT AND LINE</div><div class="example-body"><strong>Find the locus of points equidistant from the point $F = (0, 1)$ and the line $y = -1$.</strong><br><br>Set $d(P, F) = d(P, \\text{line})$:<br>$\\sqrt{x^2 + (y-1)^2} = |y + 1|$.<br>Square: $x^2 + (y-1)^2 = (y+1)^2$<br>$x^2 + y^2 - 2y + 1 = y^2 + 2y + 1$<br>$x^2 = 4y$, i.e. $\\boxed{\\,y = x^2 / 4\\,}$.<br><br>Answer: a <strong>parabola</strong> opening upward with vertex at the origin. This is the classical focus-directrix construction of a parabola: focus $F = (0, 1)$, directrix $y = -1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — DOUBLE-BRANCH WARNING</div><div class="example-body"><strong>Find the locus of points whose distance from the x-axis equals 4.</strong><br><br>Distance from $P = (x, y)$ to the x-axis is $|y|$. Setting $|y| = 4$ gives $y = 4$ <em>or</em> $y = -4$.<br><br>Answer: <strong>the two horizontal lines $y = 4$ and $y = -4$</strong>. The most common mistake on this kind of problem is writing only one of the two lines and missing the symmetry across the axis.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — VERIFY A LOCUS POINT</div><div class="example-body"><strong>Is the point $(5, 2)$ on the locus of points equidistant from $A = (1, 0)$ and $B = (9, 4)$?</strong><br><br>$d(P, A) = \\sqrt{(5-1)^2 + 2^2} = \\sqrt{16+4} = \\sqrt{20}$.<br>$d(P, B) = \\sqrt{(5-9)^2 + (2-4)^2} = \\sqrt{16+4} = \\sqrt{20}$.<br>Equal — so <strong>yes</strong>, $(5, 2)$ is on the locus. (In fact, $(5, 2)$ is the midpoint of AB, which always lies on the perpendicular bisector.)</div></div>

<h2 class="lesson-title">12. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">FREQUENT MISTAKE</div><div class="compare-item"><strong>Missing one branch:</strong> writing $y = x$ when the locus is $y = \\pm x$.</div><div class="compare-item"><strong>Skipping verification:</strong> giving a shape without checking that every point on it obeys the rule and every point obeying the rule lies on it.</div><div class="compare-item"><strong>Forgetting symmetry:</strong> "equidistant from the two axes" is two lines, not one.</div><div class="compare-item"><strong>Dropping absolute values:</strong> distance is always non-negative; $\\sqrt{(y+1)^2} = |y+1|$, not $y+1$.</div></div><div class="compare-col"><div class="compare-title">FIX</div><div class="compare-item">Square the equation only after handling all sign cases; check whether both signs produce valid points.</div><div class="compare-item">Pick three test points: one you expect to be on the locus, one you expect to be off, one on the boundary. Verify each.</div><div class="compare-item">Sketch the configuration first. If two regions look symmetric, both contain locus points.</div><div class="compare-item">Carry $|\\cdot|$ until the very last step, or split into cases.</div></div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A locus is the set of all points satisfying a given geometric rule</li>
<li>Six classical loci: circle, perpendicular bisector, angle bisector, parabola, ellipse, hyperbola</li>
<li>Algebraic method: let $P = (x, y)$, translate the condition into an equation, simplify, identify the shape</li>
<li>Two distance tools: point-to-point and point-to-line</li>
<li>Compass-and-straightedge constructions: bisect segment/angle, copy length/angle, build perpendiculars and parallels</li>
<li>Three classical impossibilities: trisect general angle, square the circle, double the cube (all 19th-century proofs)</li>
<li>Apollonius circle: locus where $PA / PB = k$ is a constant; a circle for $k \\neq 1$, a line (perpendicular bisector) for $k = 1$</li>
<li>Always verify both directions and watch for missing branches and symmetry</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Geometrik yer, ortak bir kurala uyan noktaların kümesidir.</strong> Bir şekli sana verilen bir formülle tanımlamak yerine, bir noktanın uyması gereken bir kural yazıyorsun ve soruyorsun: hangi noktalar bu kurala uyuyor? Bu noktalar kümesi <em>tam olarak</em> şeklin kendisidir. Bu, geometrinin en eski hamlelerinden biridir — Yunanlılar çemberi $x^2 + y^2 = r^2$ denkleminin grafiği olarak değil, "sabit bir merkeze aynı uzaklıktaki tüm noktaların kümesi" olarak ele aldılar. Bu derste tanıştığın her klasik konik, sonraki derslerdeki her klasik inşa, bu tek düşünce tarzından doğar.</p>

<p class="l-text">Kardeş fikir <em>pergel-cetvel inşasıdır</em>. Sadece işaretsiz bir cetvel (iki noktadan geçen doğruyu çizmek için) ve bir pergel (bir nokta etrafında, başka bir noktadan geçen çemberi çizmek için) ile hangi şekilleri inşa edebilirsin? Kulağa kısıtlayıcı geliyor — öyledir — ama bu kısıtlamaların içinde neredeyse tüm klasik Öklid geometrisi yatar. Bu dersin sonunda bir geometrik yerin tanım koşulundan denklemini yazabileceksin, altı klasik geometrik yeri görür görmez tanıyabileceksin ve dik açıortay, açıortay ve paralel doğru inşalarını adım adım yapabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Geometrik yeri, verilen bir geometrik koşulu sağlayan tüm noktaların kümesi olarak tanımlamayı</li>
<li>Altı klasik geometrik yeri tanımayı: çember, dik açıortay, açıortay, parabol, elips, hiperbol</li>
<li>Geometrik bir koşulu, kuralı koordinatlarla yazarak cebirsel bir denkleme dönüştürmeyi</li>
<li>Dört temel pergel-cetvel inşasını yapmayı (dik açıortay, açıortay, kopyalama, paralel)</li>
<li>Üç klasik imkânsızlığı tanımayı (genel bir açının üç eşit parçaya bölünmesi, çemberin karelenmesi, küpün ikiye katlanması)</li>
<li>Apollonius çemberini, iki noktaya olan uzaklıkların oranının sabit olduğu geometrik yer olarak türetmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Geometrik Yer Nedir?</h2>

<div class="calc-highlight"><strong>"Locus" sözcüğü Latince'de "yer" anlamına gelir.</strong> Geometride bir geometrik yer, hareketli bir noktanın sabit bir kurala uyarken bulunabileceği <em>yerlerin tümüdür</em>. Kural geometrik, geometrik yer ise ortaya çıkan şekildir.</div>

<p class="l-text">Basit bir örnek al. Kural şu: <em>$(0, 0)$ noktasından tam olarak 3 birim uzakta ol</em>. Hangi noktalar bu kurala uyar? Başlangıç noktasından 3 birim uzaktaki her nokta. Geometrik olarak bu, başlangıç noktasında merkezli 3 yarıçaplı bir çemberdir. Geometrik yer, <em>çemberin kendisidir</em>. Kural onu tanımladı.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRİK YERİN TANIMI</div><div class="formula-main">$$L \\;=\\; \\{\\, P \\in \\mathbb{R}^2 \\;:\\; P \\text{ koşul } \\mathcal{C} \\text{'yi saglar} \\,\\}$$</div><div class="formula-sub">L geometrik yeri, düzlemdeki, verilen geometrik C koşulunu sağlayan tüm P noktalarının kümesidir. Koşul kuraldır; geometrik yer şekildir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Koşul</div><div class="card-body">Aday her noktanın uyması gereken geometrik kural. Genellikle "şuna eşit uzaklıkta", "şundan r uzaklıkta", "şu açıortay üzerinde" gibi ifade edilir.</div></div>
<div class="calc-card"><div class="card-title">Geometrik yer</div><div class="card-body">Koşula uyan tüm noktalar kümesi. Genellikle tanıdık bir şekildir (doğru, çember, konik) veya bunların birleşimidir.</div></div>
<div class="calc-card"><div class="card-title">Doğrulama</div><div class="card-body">Tam bir geometrik yer kanıtının iki yönü vardır: geometrik yerdeki her nokta kurala uyar ve kurala uyan her nokta geometrik yere aittir.</div></div>
</div>

<p class="l-text">İki yönlü kontrol önemlidir. Bir geometrik yeri tanımlayıp yalnızca bir yönü gösterirsen (sendeki şeklin her noktası kurala uyuyor), geometrik yerin daha büyük olma olasılığını gözden kaçırırsın. Yalnızca diğer yönü gösterirsen (kurala uyan her nokta sendeki şekildedir), şekilde olup kurala uymayan ekstra noktaları dışlamamış olursun. Tam bir tanım her iki yönü de gerektirir.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$y = 1$ ve $y = 5$ paralel doğrularına eşit uzaklıktaki tüm noktaların geometrik yerini sözcüklerle tanımla. (Cevap: aralarındaki tek yatay doğru olan $y = 3$. $y = 3$ üzerindeki her nokta her iki paralelden tam olarak 2 birim uzaktadır; tersine $y \\neq 3$ olan bir nokta birine diğerinden daha yakındır.)</div></div>

<h2 class="lesson-title">2. Altı Klasik Geometrik Yer</h2>

<div class="calc-highlight"><strong>Lise geometrisindeki neredeyse her geometrik yer problemi altı şekilden birine indirgenir.</strong> Her birinin tanım koşulunu öğren, görür görmez tanıyabilirsin. Bu dersin geri kalanı ve sonraki birçok ders bu temaların varyasyonları olacak.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Geometrik yer</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tanım koşulu</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Denklem biçimi</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Çember</strong></td><td style="padding:0.5rem 0.8rem">Sabit bir noktaya uzaklık sabit r</td><td style="padding:0.5rem 0.8rem">$(x-a)^2 + (y-b)^2 = r^2$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Dik açıortay</strong></td><td style="padding:0.5rem 0.8rem">İki sabit noktaya eşit uzaklık</td><td style="padding:0.5rem 0.8rem">x ve y'de doğrusal</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Açıortay</strong></td><td style="padding:0.5rem 0.8rem">Kesişen iki doğruya eşit uzaklık</td><td style="padding:0.5rem 0.8rem">Kesişimden geçen bir çift doğru</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Parabol</strong></td><td style="padding:0.5rem 0.8rem">Bir noktaya (odak) ve bir doğruya (doğrultman) eşit uzaklık</td><td style="padding:0.5rem 0.8rem">$y = ax^2 + bx + c$ biçimi</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Elips</strong></td><td style="padding:0.5rem 0.8rem">İki odağa uzaklıkların toplamı sabit</td><td style="padding:0.5rem 0.8rem">$\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Hiperbol</strong></td><td style="padding:0.5rem 0.8rem">İki odağa uzaklıkların mutlak farkı sabit</td><td style="padding:0.5rem 0.8rem">$\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Örüntü.</strong> İkinci sütunu dikkatle oku. Her klasik geometrik yer aynı iki temel ölçümden inşa edilir: <em>bir noktaya uzaklık</em> ve <em>bir doğruya uzaklık</em>. Herhangi bir geometrik yerin bu uzaklıklar arasındaki bir ilişki olduğunu kabul ettiğinde, yukarıdaki katalog altı ilgisiz şekil olmaktan çıkar ve tek bir fikrin altı kombinasyonu olarak görünmeye başlar.</p>

<div class="l-note"><strong>İlerideki dersler.</strong> Konik kesitler (parabol, elips, hiperbol) müfredatın ilerleyen kısımlarında kendi başına dersler alır. Burada yalnızca geometrik yer tanımlarıyla tanışıyoruz; cebirsel makine sonra gelecek.</div>

<h2 class="lesson-title">3. Cebirsel Yaklaşım: Koşuldan Denkleme</h2>

<div class="calc-highlight"><strong>Püf nokta, koşulu koordinatlarla yazmaktır.</strong> Genel bir nokta $P = (x, y)$ seç, geometrik kuralı x ve y cinsinden cebirsel bir denkleme çevir ve sadeleştir. Ortaya çıkan denklem geometrik yerdir.</div>

<p class="l-text">Temel araç seti kısadır:</p>

<div class="calc-formula"><div class="formula-label">VAZGECILMEZ IKI FORMUL</div><div class="formula-main">$$d(P, Q) \\;=\\; \\sqrt{(x_P - x_Q)^2 + (y_P - y_Q)^2}$$<br>$$d(P, \\ell) \\;=\\; \\frac{|Ax + By + C|}{\\sqrt{A^2 + B^2}} \\quad\\text{burada } \\ell: Ax + By + C = 0$$</div><div class="formula-sub">İki nokta arası uzaklık; bir noktadan bir doğruya uzaklık. Neredeyse her geometrik yer denklemi bunlardan kurulur.</div></div>

<p class="l-text"><strong>Herhangi bir geometrik yer problemine uygulayabileceğin dört adımlı bir prosedür:</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Kurulum</div><div class="card-body">$P = (x, y)$ geometrik yer üzerindeki genel bir nokta olsun. Problemdeki sabit noktaları, doğruları veya diğer geometrik verileri belirle.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Çeviri</div><div class="card-body">Geometrik koşulu bir denklem olarak yaz. Gerektiğinde yukarıdaki uzaklık formüllerini kullan.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Sadeleştir</div><div class="card-body">Köklerden kurtulmak için her iki tarafın karesini al, dağıt, terimleri topla. x ve y'de temiz bir denklem hedefle.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — Tanımla</div><div class="card-body">Ortaya çıkan denklemi oku ve şekli tanı (doğru, çember, konik).</div></div>
</div>

<h2 class="lesson-title">4. Çözümlü Örnek: Cebirsel Olarak Dik Açıortay</h2>

<div class="calc-highlight"><strong>Cebirsel yöntemin işlediğini görmenin en temiz yolu en basit geometrik yerde — dik açıortayda — denemektir.</strong> İki sabit nokta, bir denklem, tatmin edici bir doğru.</div>

<p class="l-text"><strong>Problem.</strong> $A = (0, 0)$ ve $B = (4, 0)$ noktalarına eşit uzaklıktaki tüm $P = (x, y)$ noktalarının geometrik yerini bul.</p>

<div class="calc-example"><div class="example-label">TAM ÇÖZÜM</div><div class="example-body"><strong>Adım 1.</strong> $P = (x, y)$ geometrik yer üzerinde genel bir nokta olsun. Koşul $d(P, A) = d(P, B)$.<br><br><strong>Adım 2.</strong> Uzaklık formülünü kullanarak çevir:<br>$\\sqrt{x^2 + y^2} = \\sqrt{(x-4)^2 + y^2}$.<br><br><strong>Adım 3.</strong> Her iki tarafın karesini al:<br>$x^2 + y^2 = (x-4)^2 + y^2$.<br>Sağ tarafı dağıt: $x^2 + y^2 = x^2 - 8x + 16 + y^2$.<br>Sadeleştir: $0 = -8x + 16$, yani $\\boxed{\\,x = 2\\,}$.<br><br><strong>Adım 4.</strong> Geometrik yer, $x = 2$ dikey doğrusudur — AB doğru parçasının dik açıortayı. Tahmin edildiği gibi: iki noktaya eşit uzaklık = dik açıortay.</div></div>

<div class="calc-graph"><div id="plot-l93-perpbisect-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> A ve B noktaları ile $x = 2$ dikey doğrusu — A ve B'ye eşit uzaklıktaki tüm noktaların geometrik yeri. Doğru üzerindeki birkaç örnek nokta A ve B'ye kesik çizgilerle bağlanmıştır; her örnek nokta için iki kesik çizgi eşit uzunluktadır, geometrik yeri doğrular.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Atr={x:[0],y:[0],mode:'markers+text',name:'A(0,0)',marker:{color:'#f59e0b',size:12},text:['A'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:13}};
var Btr={x:[4],y:[0],mode:'markers+text',name:'B(4,0)',marker:{color:'#f59e0b',size:12},text:['B'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:13}};
var bisTr={x:[2,2],y:[-3,3],mode:'lines',name:'geometrik yer x=2',line:{color:'#3b82f6',width:3}};
var sxT=[2,2,2],syT=[1.5,0,-1.5];
var sptT={x:sxT,y:syT,mode:'markers',name:'örnek noktalar',marker:{color:'#10b981',size:8}};
var connT={x:[],y:[],mode:'lines',name:'uzaklıklar',line:{color:'rgba(16,185,129,0.45)',width:1.4,dash:'dot'},showlegend:false};
for(var i=0;i<sxT.length;i++){connT.x.push(0,sxT[i],null,4,sxT[i],null);connT.y.push(0,syT[i],null,0,syT[i],null);}
var layTr={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l93-perpbisect-tr',[bisTr,connT,Atr,Btr,sptT],layTr,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">HIZLI KONTROL</div><div class="example-body">Doğru üzerinde genel bir nokta dene, örneğin $(2, 1)$. A'ya uzaklık: $\\sqrt{4 + 1} = \\sqrt{5}$. B'ye uzaklık: $\\sqrt{4 + 1} = \\sqrt{5}$. Eşit. Kural sağlanıyor. Şimdi doğru dışı bir nokta dene, örneğin $(3, 0)$. A'ya uzaklık: 3. B'ye uzaklık: 1. Eşit değil — ve $(3, 0)$ gerçekten geometrik yerin dışında.</div></div>

<h2 class="lesson-title">5. Çözümlü Örnek: Çember Geometrik Yer Olarak</h2>

<p class="l-text"><strong>Problem.</strong> Başlangıç noktasından 5 birim uzaklıktaki tüm noktaların geometrik yerini bul.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜM</div><div class="example-body">$P = (x, y)$ olsun. Koşul $d(P, O) = 5$, burada $O = (0, 0)$.<br><br>$\\sqrt{x^2 + y^2} = 5$.<br>Her iki tarafın karesini al:<br>$\\boxed{\\,x^2 + y^2 = 25\\,}$.<br><br>Geometrik yer, başlangıç noktasında merkezli 5 yarıçaplı çemberdir. Doğrulama: bu çember üzerindeki herhangi bir noktanın O'ya uzaklığı tam olarak 5'tir; O'ya tam olarak 5 uzaklıktaki herhangi bir nokta bu çember üzerindedir.</div></div>

<div class="calc-graph"><div id="plot-l93-circle-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> başlangıç noktasından 5 birim uzaklıktaki noktaların geometrik yeri olarak $x^2 + y^2 = 25$ çemberi. Çember üzerindeki dört örnek nokta (0, 90, 180, 270 derecelerde) kesik yarıçaplarla işaretlenmiştir — her yarıçap, inşa gereği aynı uzunluktadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var cxT=[],cyT=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;cxT.push(5*Math.cos(a));cyT.push(5*Math.sin(a));}
var circT={x:cxT,y:cyT,mode:'lines',name:'x²+y²=25',line:{color:'#3b82f6',width:3}};
var origT={x:[0],y:[0],mode:'markers+text',name:'O(0,0)',marker:{color:'#f59e0b',size:11},text:['O'],textposition:'top right',textfont:{color:'#e8e8e8',size:13}};
var sxT2=[5,0,-5,0],syT2=[0,5,0,-5];
var sptT2={x:sxT2,y:syT2,mode:'markers',name:'örnek noktalar',marker:{color:'#10b981',size:9}};
var connT2={x:[],y:[],mode:'lines',name:'yarıçaplar (tümü =5)',line:{color:'rgba(16,185,129,0.45)',width:1.4,dash:'dot'}};
for(var i=0;i<4;i++){connT2.x.push(0,sxT2[i],null);connT2.y.push(0,syT2[i],null);}
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l93-circle-tr',[circT,connT2,origT,sptT2],layT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Pergel ve Cetvel: Oyunun Kuralları</h2>

<div class="calc-highlight"><strong>Klasik inşa yalnızca iki alete izin verir.</strong> Bir <em>cetvel</em> — işaretsiz bir cetvel gibi — verilen iki noktadan geçen tek doğruyu çizebilen. Bir <em>pergel</em> — verilen bir noktada merkezli, başka verilen bir noktadan geçen çemberi çizebilen. Başka hiçbir şey yok: ölçüm yok, uzunlukları işaretle kopyalama yok, açıölçer yok.</div>

<p class="l-text">Disiplin, tasarım gereği zorludur. Bu sınırlar içinde Yunanlılar düzlem geometrisinin neredeyse tamamını çözdüler: doğru parçalarını ve açıları ortaladılar, dikmeler ve paraleller inşa ettiler, düzgün çokgenler oluşturdular, hatta belirli ikinci dereceden denklemleri geometrik olarak çözdüler. Bu sınırların dışında, hiçbir inşanın çözemediği üç meşhur problem keşfettiler — ama onlardan 9. bölümde söz edeceğiz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cetvelin yaptığı</div><div class="card-body">Verilen iki farklı P ve Q noktasından geçen tek doğruyu çizmek. Tek işlem budur.</div></div>
<div class="calc-card"><div class="card-title">Pergelin yaptığı</div><div class="card-body">Verilen iki farklı P ve Q noktasıyla (P merkez), P'de merkezli Q'dan geçen çemberi çizmek. Pergel "kapanır" — kâğıttan kaldırıldığında yarıçapını unutur. (Yine de kapanmayan pergel için eşdeğer güç kanıtlanabilir.)</div></div>
<div class="calc-card"><div class="card-title">İnşa edebildiklerin</div><div class="card-body">Çizdiğin doğrular ve çemberlerin birbirleriyle kesiştiği her yerde yeni noktalar. İnşa edilebilir noktalar kümesi başlangıç noktalarından adım adım büyür.</div></div>
</div>

<h2 class="lesson-title">7. İnşa 1: Bir Doğru Parçasının Dik Açıortayı</h2>

<div class="calc-highlight"><strong>Bu, klasik geometrideki en kullanışlı inşadır.</strong> İki A ve B noktası verildiğinde, ikisine de eşit uzaklıkta olan doğruyu inşa edersin. AB doğru parçasının dik açıortayını, ayrıca orta noktasını ve bir dik yönü elde edersin — kısa bir prosedürden üç sonuç.</div>

<p class="l-text"><strong>Prosedür.</strong> AB doğru parçası verilmiş olsun.</p>

<ol style="margin:1rem 0;padding-left:1.5rem;line-height:1.8;color:rgba(235,230,220,0.92)">
<li>Pergelin ucunu A'ya koy. AB uzunluğunun yarısından büyük <em>herhangi</em> bir r yarıçapına aç.</li>
<li>A merkezli r yarıçaplı bir çember (veya yay) çiz.</li>
<li>Yarıçapı değiştirmeden pergeli B'ye koy ve B merkezli r yarıçaplı ikinci bir çember (veya yay) çiz.</li>
<li>İki yay iki noktada kesişir — onlara P (AB üstünde) ve Q (AB altında) de.</li>
<li>Cetvelle PQ doğrusunu çiz. Bu doğru, AB doğru parçasının dik açıortayıdır. PQ'nun AB'yi kestiği nokta AB'nin orta noktası M'dir.</li>
</ol>

<div class="calc-example"><div class="example-label">NEDEN İŞLER</div><div class="example-body">İnşa gereği $d(P, A) = d(P, B) = r$ (her iki yayın da yarıçapı r idi). Yani P, A ve B'ye eşit uzaklıktadır — yani P, AB'nin dik açıortayı üzerindedir. Aynı argüman Q'yu da açıortay üzerine koyar. İki nokta bir doğruyu belirler, yani PQ doğrusu dik açıortaydır. (Bonus olarak orta noktayı da bedavaya alırız, PQ'nun AB ile kesişiminde.)</div></div>

<div class="calc-graph"><div id="plot-l93-construct-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> AB doğru parçasının dik açıortay inşası. A ve B'de merkezli r yarıçaplı iki yay P ve Q'da kesişir. PQ doğrusu dik açıortaydır ve AB'yi orta nokta M'de keser.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0,Bx=4,By=0,r=2.8;
var arcAxT=[],arcAyT=[];for(var i=0;i<=180;i++){var a=Math.PI*i/180-Math.PI/2;arcAxT.push(Ax+r*Math.cos(a));arcAyT.push(Ay+r*Math.sin(a));}
var arcBxT=[],arcByT=[];for(var i=0;i<=180;i++){var a=Math.PI*i/180+Math.PI/2;arcBxT.push(Bx+r*Math.cos(a));arcByT.push(By+r*Math.sin(a));}
var pXT=(Ax+Bx)/2, pYposT=Math.sqrt(r*r-Math.pow((Bx-Ax)/2,2));
var arAT={x:arcAxT,y:arcAyT,mode:'lines',name:'A merkezli yay',line:{color:'#f59e0b',width:1.8,dash:'dot'}};
var arBT={x:arcBxT,y:arcByT,mode:'lines',name:'B merkezli yay',line:{color:'#10b981',width:1.8,dash:'dot'}};
var segT={x:[Ax,Bx],y:[Ay,By],mode:'lines+markers+text',name:'AB',line:{color:'#e8e8e8',width:2.5},marker:{color:'#e8e8e8',size:10},text:['A','B'],textposition:'bottom center',textfont:{color:'#e8e8e8',size:13}};
var bisT={x:[pXT,pXT],y:[-pYposT*1.1,pYposT*1.1],mode:'lines',name:'açıortay PQ',line:{color:'#3b82f6',width:3}};
var ptsT={x:[pXT,pXT,pXT],y:[pYposT,-pYposT,0],mode:'markers+text',name:'P, Q, M',marker:{color:'#ec4899',size:10},text:['P','Q','M'],textposition:['top right','bottom right','top right'],textfont:{color:'#e8e8e8',size:12}};
var layCT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l93-construct-tr',[arAT,arBT,segT,bisT,ptsT],layCT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. İnşalar 2-6: Standart Repertuar</h2>

<p class="l-text">Geri kalan klasik inşalar aynı örüntüyü izler: eşit uzaklıktaki noktaları belirlemek için eşit yaylar, sonra onları birleştirmek için cetvel. Aşağıda standart repertuar sıkıştırılmış biçimde verilmiştir. Her biri birkaç dakikalık kâğıt-pergel pratiğini hak ediyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">&angle;AOB açısını ortala</div><div class="card-body">(1) O merkezli bir yay çiz; OA'yı P'de, OB'yi Q'da kessin. (2) P ve Q merkezli eşit yarıçaplı yaylar çiz; R'de buluşsunlar. (3) OR doğrusu açıyı ortalar.</div></div>
<div class="calc-card"><div class="card-title">Bir doğru parçasını kopyala</div><div class="card-body">AB'yi C noktasından çıkan yeni bir ışına kopyalamak için: C merkezli AB yarıçaplı yay çiz; ışını CD = AB olan D noktasında keser.</div></div>
<div class="calc-card"><div class="card-title">Bir açıyı kopyala</div><div class="card-body">Orijinal açının köşesinde merkezli bir yayla iki nokta işaretle; aralarındaki kirişi yeni köşede aynı yarıçaplı bir yaya kopyala.</div></div>
<div class="calc-card"><div class="card-title">Bir doğru üzerindeki noktadan dik</div><div class="card-body">$\\ell$ doğrusu üzerindeki P noktasından, $\\ell$ üzerinde yaylarla iki eşit uzaklıktaki nokta işaretle. Sonra bu iki noktanın dik açıortayını inşa et — P'den geçer.</div></div>
<div class="calc-card"><div class="card-title">Dış noktadan paralel</div><div class="card-body">P dış noktasından $\\ell$ doğrusuna paralel: P'den geçen herhangi bir kesen çiz, $\\ell$'yi Q'da kessin; sonra &angle;PQR açısını P'nin diğer tarafına kopyala. Yeni ışın $\\ell$'ye paraleldir.</div></div>
<div class="calc-card"><div class="card-title">AB üzerine eşkenar üçgen</div><div class="card-body">A merkezli AB yarıçaplı yay çiz. B merkezli AB yarıçaplı yay çiz. İki yay C'de kesişir — ve ABC üçgeni eşkenardır.</div></div>
</div>

<div class="l-note"><strong>Eşkenar üçgen inşası Öklid'in <em>Önerme 1</em></strong>'idir — <em>Elementler</em>'deki en ilk inşa. Yeni çağdan üç yüzyıl önce Öklid, her adımı öncesine dayanan 13 kitaplık bir inşa ve teorem zinciri kurdu — tam olarak bu tek resimden başlayarak.</div>

<h2 class="lesson-title">9. Üç Klasik İmkânsızlık</h2>

<div class="calc-highlight"><strong>Pergel-cetvel güçlüdür ama her şeye gücü yetmez.</strong> Üç meşhur problem her Yunan girişimine direndi ve sonunda 19. yüzyılda, Yunanlıların erişiminde olmayan cebirsel fikirler kullanılarak <em>imkânsız</em> olduğu kanıtlandı.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genel bir açının üç eşit parçaya bölünmesi</div><div class="card-body">Herhangi &theta; açısı verildiğinde, yalnızca pergel ve cetvelle &theta;/3 ölçüsünde bir açı inşa et. Bazı özel açılar (örn. 90&deg;, çünkü 90/3 = 30 inşa edilebilir) üç eşit parçaya bölünebilir, ama genel durum bölünemez. Pierre Wantzel (1837) tarafından imkânsız olduğu kanıtlandı.</div></div>
<div class="calc-card"><div class="card-title">Çemberin karelenmesi</div><div class="card-body">1 yarıçaplı bir çember verildiğinde, eşit alanlı bir kare inşa et — yani $\\sqrt{\\pi}$ kenarlı bir kare. $\\pi$ aşkın olduğundan (Lindemann, 1882) imkânsızdır ve yalnızca 2'nin kuvveti dereceli cebirsel sayılar inşa edilebilir.</div></div>
<div class="calc-card"><div class="card-title">Küpün ikiye katlanması</div><div class="card-body">1 kenarlı bir küp verildiğinde, hacmin iki katı olan küpün kenarını inşa et — yani $\\sqrt[3]{2}$ inşa et. Birim doğru parçasından inşa edilebilen uzunluklar rasyoneller üzerinde $2^k$ dereceli bir polinomu sağladığından imkânsızdır; $\\sqrt[3]{2}$ bunu sağlamaz. Yine Wantzel tarafından (1837) kanıtlandı.</div></div>
</div>

<p class="l-text"><strong>"İmkânsız" ne demek?</strong> "Zor" değil. "Henüz kimse bulamadı" değil. Hiçbir cetvel ve pergel hareketi <em>dizisinin</em> inşayı asla üretemeyeceğini gösteren matematiksel bir kanıt vardır. Kanıtlar cisim teorisi kullanır — birim doğru parçasından inşa edilebilen her uzunluk, rasyonellerin ikinci dereceden genişlemelerinin bir kulesinde yatar ve yukarıdaki üç hedef bu kulenin dışında olduğu kanıtlanabilir.</p>

<h2 class="lesson-title">10. Apollonius Çemberi</h2>

<div class="calc-highlight"><strong>Şaşırtıcı bir geometrik yer: A ve B iki noktayı sabitle, 1'den farklı pozitif bir k sabiti seç ve PA / PB = k olan tüm P noktalarını sor.</strong> Çoğu öğrenci "bir doğru" tahmin eder, ama ortaya çıkan şey bir çemberdir — <em>Apollonius çemberi</em>, Pergeli Yunan geometri ustası Apollonius'un adıyla anılan.</div>

<p class="l-text">A = (0, 0) ve B = (d, 0) noktalarını x-ekseninde yerleştir. $P = (x, y)$ olsun ve oranı kur:</p>

<div class="calc-formula"><div class="formula-label">GEOMETRIK YERIN KURULUSU</div><div class="formula-main">$$\\frac{\\sqrt{x^2 + y^2}}{\\sqrt{(x-d)^2 + y^2}} \\;=\\; k$$</div></div>

<p class="l-text">Her iki tarafın karesini al ve yeniden düzenle:</p>

<div class="calc-formula"><div class="formula-label">SADELESTIRMEDEN SONRA</div><div class="formula-main">$$x^2 + y^2 \\;=\\; k^2 \\bigl[(x-d)^2 + y^2\\bigr]$$<br>$$(1 - k^2)(x^2 + y^2) + 2 k^2 d \\, x - k^2 d^2 \\;=\\; 0$$</div><div class="formula-sub">$k \\neq 1$ olduğunda, baş katsayı $1 - k^2$ sıfırdan farklıdır ve denklem bir çemberi tanımlar. $k = 1$ olduğunda dik açıortaya çöker — istersen "sonsuz yarıçaplı bir çember".</div></div>

<div class="calc-example"><div class="example-label">ÖZEL DURUM</div><div class="example-body">A = (0, 0), B = (6, 0) ve k = 2 al (yani geometrik yer, A'dan B'ye olduğundan iki kat uzaktaki noktalardır). Denklem:<br><br>$x^2 + y^2 = 4[(x-6)^2 + y^2]$<br>$x^2 + y^2 = 4x^2 - 48x + 144 + 4y^2$<br>$-3x^2 - 3y^2 + 48x - 144 = 0$<br>$x^2 + y^2 - 16x + 48 = 0$<br>$(x - 8)^2 + y^2 = 64 - 48 = 16$.<br><br>Geometrik yer, $(8, 0)$'da merkezli 4 yarıçaplı bir çemberdir. Not: A ve B geometrik yer üzerinde <em>değildir</em>, ama merkez doğrultusundadırlar — bu Apollonius çemberlerinin genel bir özelliğidir.</div></div>

<div class="l-note"><strong>Neden önemli.</strong> Apollonius çemberi inversiyon geometrisinde, takip problemlerinde (farklı hızlardaki iki gemi), ağ konumlandırma algoritmalarında ve karmaşık Möbius dönüşümleri geometrisinde karşımıza çıkar. Lisede yapay görünen bir geometrik yer, ileri matematikte her yerde olduğu ortaya çıkar.</div>

<h2 class="lesson-title">11. Çözümlü Problemler</h2>

<p class="l-text">Geometrik yer akıl yürütmesiyle inşayı harmanlayan sekiz alıştırma. Her birini önce kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — DİK AÇIORTAY</div><div class="example-body"><strong>$A = (0, 0)$ ve $B = (6, 0)$ noktalarına eşit uzaklıktaki noktaların geometrik yerinin denklemini bul.</strong><br><br>$P = (x, y)$ ile $d(P, A) = d(P, B)$ yaz:<br>$\\sqrt{x^2 + y^2} = \\sqrt{(x-6)^2 + y^2}$.<br>Karesini al: $x^2 = (x-6)^2 = x^2 - 12x + 36$.<br>Çöz: $12x = 36$, yani $\\boxed{\\,x = 3\\,}$. Geometrik yer, AB'nin dik açıortayı olan $x = 3$ dikey doğrusudur.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — ÇEMBER GEOMETRİK YERİ</div><div class="example-body"><strong>$C = (2, -1)$'den 7 uzaklıktaki noktaların geometrik yerini bul.</strong><br><br>$d(P, C) = 7$ yaz:<br>$\\sqrt{(x-2)^2 + (y+1)^2} = 7$.<br>Karesini al: $\\boxed{\\,(x-2)^2 + (y+1)^2 = 49\\,}$. Bu, $(2, -1)$'de merkezli 7 yarıçaplı bir çemberdir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — İKİ EKSENE EŞİT UZAKLIK</div><div class="example-body"><strong>x-eksenine ve y-eksenine eşit uzaklıktaki noktaların geometrik yerini bul.</strong><br><br>$P = (x, y)$'nin x-eksenine uzaklığı $|y|$; y-eksenine uzaklığı $|x|$.<br>$|x| = |y|$ koy, bu da $y = x$ veya $y = -x$ demektir.<br><br>Cevap: <strong>$y = x$ ve $y = -x$ iki doğrusu</strong> (dört bölgenin açıortayları). <strong>İkinci kolu unutma:</strong> sık yapılan bir hata yalnızca $y = x$ yazmaktır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — AÇIORTAY İNŞA ET</div><div class="example-body"><strong>&angle;AOB açısının açıortayının pergel-cetvel inşasını adım adım anlat.</strong><br><br>Adım 1: Pergeli O'ya koy. Herhangi bir yay çiz; OA ışınını P'de, OB ışınını Q'da keser. (Yani OP = OQ.)<br>Adım 2: Pergeli P'ye koy. Uygun bir r yarıçapına aç. Açının içine bir yay çiz.<br>Adım 3: Yarıçapı değiştirmeden pergeli Q'ya koy. Açının içine ikinci bir yay çiz.<br>Adım 4: İki yay R noktasında buluşur. Cetvelle OR ışınını çiz. <strong>OR ışını açıortaydır.</strong><br><br>Neden: OPR ve OQR üçgenleri eştir (KKK: OP = OQ, PR = QR inşa gereği, OR ortak), yani O'daki açılar eşittir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — APOLLONIUS ÇEMBERİ</div><div class="example-body"><strong>$A = (0, 0)$, $B = (8, 0)$ ile $PA / PB = 3$ olan P noktalarının geometrik yerini bul.</strong><br><br>$\\sqrt{x^2 + y^2} = 3 \\sqrt{(x-8)^2 + y^2}$.<br>Karesini al: $x^2 + y^2 = 9[(x-8)^2 + y^2]$<br>$x^2 + y^2 = 9x^2 - 144x + 576 + 9y^2$<br>$-8x^2 - 8y^2 + 144x - 576 = 0$<br>$x^2 + y^2 - 18x + 72 = 0$<br>$(x-9)^2 + y^2 = 9$.<br><br>Cevap: $(9, 0)$'da merkezli 3 yarıçaplı çember.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — NOKTA VE DOĞRUYA EŞİT UZAKLIK</div><div class="example-body"><strong>$F = (0, 1)$ noktasına ve $y = -1$ doğrusuna eşit uzaklıktaki noktaların geometrik yerini bul.</strong><br><br>$d(P, F) = d(P, \\text{dogru})$ yaz:<br>$\\sqrt{x^2 + (y-1)^2} = |y + 1|$.<br>Karesini al: $x^2 + (y-1)^2 = (y+1)^2$<br>$x^2 + y^2 - 2y + 1 = y^2 + 2y + 1$<br>$x^2 = 4y$, yani $\\boxed{\\,y = x^2 / 4\\,}$.<br><br>Cevap: tepe noktası başlangıçta olan, yukarı açılan bir <strong>parabol</strong>. Bu, parabolün klasik odak-doğrultman inşasıdır: odak $F = (0, 1)$, doğrultman $y = -1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — ÇİFT KOL UYARISI</div><div class="example-body"><strong>x-eksenine uzaklığı 4'e eşit olan noktaların geometrik yerini bul.</strong><br><br>$P = (x, y)$'nin x-eksenine uzaklığı $|y|$. $|y| = 4$ koymak $y = 4$ <em>veya</em> $y = -4$ verir.<br><br>Cevap: <strong>$y = 4$ ve $y = -4$ iki yatay doğrusu</strong>. Bu tür problemlerde en sık yapılan hata iki doğrudan yalnızca birini yazıp eksene göre simetriyi gözden kaçırmaktır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — BİR GEOMETRİK YER NOKTASINI DOĞRULA</div><div class="example-body"><strong>$(5, 2)$ noktası, $A = (1, 0)$ ve $B = (9, 4)$ noktalarına eşit uzaklıktaki noktaların geometrik yerinde midir?</strong><br><br>$d(P, A) = \\sqrt{(5-1)^2 + 2^2} = \\sqrt{16+4} = \\sqrt{20}$.<br>$d(P, B) = \\sqrt{(5-9)^2 + (2-4)^2} = \\sqrt{16+4} = \\sqrt{20}$.<br>Eşit — yani <strong>evet</strong>, $(5, 2)$ geometrik yer üzerindedir. (Aslında $(5, 2)$ AB'nin orta noktasıdır ve dik açıortay her zaman orta noktadan geçer.)</div></div>

<h2 class="lesson-title">12. Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIK YAPILAN HATA</div><div class="compare-item"><strong>Bir kolu unutmak:</strong> geometrik yer $y = \\pm x$ iken yalnızca $y = x$ yazmak.</div><div class="compare-item"><strong>Doğrulamayı atlamak:</strong> bir şekil verip, üzerindeki her noktanın kurala uyduğunu ve kurala uyan her noktanın o şekilde olduğunu kontrol etmemek.</div><div class="compare-item"><strong>Simetriyi unutmak:</strong> "iki eksene eşit uzaklık" bir doğru değil, iki doğrudur.</div><div class="compare-item"><strong>Mutlak değerleri düşürmek:</strong> uzaklık her zaman negatif değildir; $\\sqrt{(y+1)^2} = |y+1|$, $y+1$ değil.</div></div><div class="compare-col"><div class="compare-title">DÜZELTME</div><div class="compare-item">Tüm işaret durumlarını ele aldıktan sonra denklemin karesini al; her iki işaretin de geçerli noktalar üretip üretmediğini kontrol et.</div><div class="compare-item">Üç test noktası seç: birinin geometrik yerde olmasını, birinin dışında olmasını, birinin sınırda olmasını beklediğin. Her birini doğrula.</div><div class="compare-item">Önce konfigürasyonu çiz. İki bölge simetrik görünüyorsa, her ikisi de geometrik yer noktası içerir.</div><div class="compare-item">$|\\cdot|$'yi son adıma kadar taşı veya durumlara böl.</div></div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir geometrik yer, verilen bir geometrik kurala uyan tüm noktaların kümesidir</li>
<li>Altı klasik geometrik yer: çember, dik açıortay, açıortay, parabol, elips, hiperbol</li>
<li>Cebirsel yöntem: $P = (x, y)$ koy, koşulu denkleme çevir, sadeleştir, şekli tanı</li>
<li>İki uzaklık aracı: noktadan noktaya ve noktadan doğruya</li>
<li>Pergel-cetvel inşaları: doğru parçası/açı ortala, uzunluk/açı kopyala, dik ve paralel kur</li>
<li>Üç klasik imkânsızlık: genel açıyı üç eşit parçaya böl, çemberi karele, küpü ikiye katla (hepsi 19. yüzyıl kanıtları)</li>
<li>Apollonius çemberi: $PA / PB = k$ sabit olduğu geometrik yer; $k \\neq 1$ için çember, $k = 1$ için doğru (dik açıortay)</li>
<li>Her zaman iki yönü de doğrula ve unutulan kollar ile simetriye dikkat et</li>
</ul>
</div>`
};
