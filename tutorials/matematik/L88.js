window.LISE_MAT_L88 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Every plane figure has two basic measurements:</strong> how far it reaches around its boundary, and how much space it occupies inside. The first is the <em>perimeter</em>, the second is the <em>area</em>. A rectangular garden has both: the perimeter tells you how much fence to buy, the area tells you how much grass seed you need. The two numbers measure completely different things — perimeter is a length, area is a length squared — and confusing them is one of the most common errors a high-school student makes.</p>

<p class="l-text">This lesson collects every standard perimeter and area formula you are expected to know: triangles (three ways), squares, rectangles, parallelograms, rhombuses, kites, trapezoids, regular polygons, circles, sectors. We will work through composite figures (subtracting one piece from another), the shoelace formula for a triangle given its vertices, and a careful list of the units, missing factors, and degree-versus-radian traps that ruin homework. Spend an extra hour here and you save dozens later.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish perimeter (a length, units like cm) from area (a length squared, units like cm&sup2;) and never mix them up</li>
<li>Compute the perimeter and area of every standard polygon: triangle, square, rectangle, parallelogram, rhombus, kite, trapezoid, regular n-gon</li>
<li>Use three different area formulas for a triangle &mdash; base times height, SAS, and Heron &mdash; and pick the right one for the data you have</li>
<li>Apply the formulas C = 2&pi;r and A = &pi;r&sup2; for a circle, and r&theta; and (1/2)r&sup2;&theta; for a sector</li>
<li>Decompose composite figures by adding rectangles and circles or by subtracting cut-outs</li>
<li>Apply the shoelace formula to find the area of a triangle from its three vertex coordinates</li>
</ul>
</div>

<h2 class="lesson-title">1. Perimeter: The Length Around the Boundary</h2>

<div class="calc-highlight"><strong>The perimeter is the total length of the boundary.</strong> For any polygon, it is just the sum of the side lengths: P = a + b + c + .... For a curved figure like a circle, we use a formula (the circumference). The unit of perimeter is a unit of length: cm, m, km. Never cm&sup2;.</div>

<p class="l-text">Imagine an ant walking once around the edge of a figure and never lifting its feet. The total distance it travels is the perimeter. For a polygon with n sides of lengths $s_1, s_2, ..., s_n$, the formula is just:</p>

<div class="calc-formula"><div class="formula-label">PERIMETER OF A POLYGON</div><div class="formula-main">$$P \\;=\\; s_1 + s_2 + s_3 + \\cdots + s_n$$</div><div class="formula-sub">Add up every side. The unit is the same as the unit of the sides (cm, m, km, ...).</div></div>

<div class="l-note"><strong>Units, please.</strong> If side lengths are in metres, the perimeter is in metres. If sides are mixed (some in cm, some in m), <em>convert first</em>, then add. Mixing units inside the same sum is the fastest way to a wrong answer.</div>

<h2 class="lesson-title">2. Area: The Space Enclosed Inside</h2>

<div class="calc-highlight"><strong>The area is the amount of 2D space enclosed by the boundary.</strong> Its unit is always a length-squared: cm&sup2;, m&sup2;, km&sup2;, hectare. You count the figure in squares of side 1 unit each. A rectangle of side 3 by 4 contains $3 \\times 4 = 12$ unit squares, so its area is 12.</div>

<p class="l-text">Every area formula in this lesson is ultimately a way of counting unit squares, although for triangles and circles we cleverly slice or rearrange. Keep the unit-square picture in your head: it explains why $A = bh$ for a rectangle, why a triangle gets a factor of $1/2$, and why a circle picks up a $\\pi$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Perimeter unit</div><div class="card-body">A length: cm, m, km, inch. If you write cm&sup2; for a perimeter, the answer is wrong by definition.</div></div>
<div class="calc-card"><div class="card-title">Area unit</div><div class="card-body">A length squared: cm&sup2;, m&sup2;, km&sup2;. If you write cm for an area, it is wrong.</div></div>
<div class="calc-card"><div class="card-title">Why the difference</div><div class="card-body">Perimeter measures a 1D curve. Area measures a 2D region. Different dimensions, different units.</div></div>
</div>

<h2 class="lesson-title">3. Triangle: Three Sides, Three Area Formulas</h2>

<div class="calc-highlight"><strong>The triangle is the most important shape in geometry because every polygon can be cut into triangles.</strong> Master its three area formulas and you can find the area of any polygon. The perimeter is easy: just add the sides.</div>

<div class="calc-formula"><div class="formula-label">PERIMETER OF A TRIANGLE</div><div class="formula-main">$$P \\;=\\; a + b + c$$</div><div class="formula-sub">Where a, b, c are the three side lengths.</div></div>

<p class="l-text"><strong>Area formula 1: base times height.</strong> Pick any side as the base (call it b). Drop a perpendicular from the opposite vertex to that base (or its extension). Call the perpendicular distance h, the <em>height</em>. Then:</p>

<div class="calc-formula"><div class="formula-label">AREA &mdash; BASE TIMES HEIGHT</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,b\\,h$$</div><div class="formula-sub">The factor 1/2 is essential. A triangle is exactly half of the parallelogram you would build by reflecting it across its longest side.</div></div>

<p class="l-text"><strong>Area formula 2: SAS (side-angle-side).</strong> If you know two sides and the angle between them (instead of a height), use:</p>

<div class="calc-formula"><div class="formula-label">AREA &mdash; SAS FORMULA</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,a\\,b\\,\\sin C$$</div><div class="formula-sub">a and b are two sides; C is the angle between them. This recovers (1/2)bh because the height from the vertex of C onto side b is $a \\sin C$.</div></div>

<p class="l-text"><strong>Area formula 3: Heron (three sides only).</strong> If you only know the three side lengths and no angles or heights, Heron's formula is the tool:</p>

<div class="calc-formula"><div class="formula-label">HERON'S FORMULA</div><div class="formula-main">$$s = \\tfrac{a+b+c}{2}, \\qquad A \\;=\\; \\sqrt{\\,s\\,(s-a)(s-b)(s-c)\\,}$$</div><div class="formula-sub">s is the semi-perimeter (half of the perimeter). Heron lets you compute the area from three sides without ever finding an angle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; HERON</div><div class="example-body">Find the area of a triangle with sides 5, 6, 7.<br><br>$s = (5+6+7)/2 = 9$.<br><br>$A = \\sqrt{9(9-5)(9-6)(9-7)} = \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = 6\\sqrt{6}$.<br><br>So $A = 6\\sqrt{6} \\approx 14.70$ square units. The perimeter is $5+6+7 = 18$.</div></div>

<div class="l-note"><strong>Pick the right formula.</strong> Given base and height &rarr; use $\\tfrac{1}{2}bh$. Given two sides and the included angle &rarr; use SAS. Given three sides &rarr; use Heron. The same triangle has the same area no matter which you use; choosing the easiest one saves time.</div>

<h2 class="lesson-title">4. Square and Rectangle</h2>

<div class="calc-highlight"><strong>The two simplest cases.</strong> A square has four equal sides of length s. A rectangle has length $\\ell$ and width w. Both have right angles at every corner, which makes the area trivial: it is just length times width.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Square</div><div class="card-body">Side s. Perimeter $P = 4s$. Area $A = s^2$.</div></div>
<div class="calc-card"><div class="card-title">Rectangle</div><div class="card-body">Length $\\ell$, width $w$. Perimeter $P = 2(\\ell + w)$. Area $A = \\ell w$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; RECTANGLE</div><div class="example-body">A rectangle has length 8 cm and width 6 cm. Find its perimeter and area.<br><br>$P = 2(8 + 6) = 2 \\cdot 14 = \\mathbf{28 \\text{ cm}}$.<br><br>$A = 8 \\cdot 6 = \\mathbf{48 \\text{ cm}^2}$.<br><br>Note the units: perimeter in cm, area in cm&sup2;.</div></div>

<h2 class="lesson-title">5. Parallelogram</h2>

<div class="calc-highlight"><strong>A parallelogram has two pairs of parallel sides.</strong> The opposite sides are equal, but the corners are not necessarily right angles. The area formula has the same shape as a rectangle's, but the "height" is the perpendicular height between the two parallel sides, <em>not</em> the slanted side.</div>

<div class="calc-formula"><div class="formula-label">PARALLELOGRAM</div><div class="formula-main">$$P \\;=\\; 2(a + b), \\qquad A \\;=\\; b \\cdot h$$</div><div class="formula-sub">a and b are the two pairs of equal sides; h is the perpendicular height onto side b.</div></div>

<p class="l-text">Why $A = bh$? Slice off a right triangle from one end of the parallelogram and slide it to the other end &mdash; you get a rectangle of the same base b and the same height h, with the same area. So a parallelogram is just a "tilted rectangle" with the same area.</p>

<div class="l-note"><strong>Common error:</strong> using the slanted side a instead of the perpendicular height h. The slanted side is too long; you would overestimate the area. Always use the perpendicular drop from a vertex to the opposite parallel side.</div>

<h2 class="lesson-title">6. Rhombus and Kite</h2>

<div class="calc-highlight"><strong>A rhombus is a parallelogram with all four sides equal.</strong> A kite has two pairs of adjacent equal sides. In both shapes the diagonals meet at right angles, and that fact gives a beautiful area formula in terms of the diagonals.</div>

<div class="calc-formula"><div class="formula-label">RHOMBUS / KITE &mdash; DIAGONAL FORMULA</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\, d_1 \\, d_2$$</div><div class="formula-sub">$d_1$ and $d_2$ are the lengths of the two diagonals. Works for any rhombus or kite because the diagonals are perpendicular.</div></div>

<p class="l-text">For a rhombus with side s, the perimeter is $P = 4s$. For a kite with two pairs of adjacent equal sides $a$ and $b$, the perimeter is $P = 2(a + b)$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A rhombus has diagonals of length 8 and 6. Find its area.<br><br>$A = \\tfrac{1}{2} \\cdot 8 \\cdot 6 = \\mathbf{24}$ square units.<br><br>The side length (by Pythagoras on the four right triangles inside): $s = \\sqrt{4^2 + 3^2} = 5$. So the perimeter is $P = 4 \\cdot 5 = 20$.</div></div>

<h2 class="lesson-title">7. Trapezoid</h2>

<div class="calc-highlight"><strong>A trapezoid (or trapezium) has exactly one pair of parallel sides.</strong> Call them $a$ and $c$. The other two sides connect the parallel sides at an angle. The perpendicular distance between the two parallel sides is the height h.</div>

<div class="calc-formula"><div class="formula-label">TRAPEZOID AREA</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,(a + c)\\,h$$</div><div class="formula-sub">Average the two parallel sides, multiply by the height. The intuition: the trapezoid is "in between" a rectangle of width $a$ and one of width $c$.</div></div>

<p class="l-text">The perimeter is just the sum of all four sides; the formula depends on whether the other two sides are equal (isosceles trapezoid) or not. In general $P = a + b + c + d$ where b and d are the two non-parallel sides.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A trapezoid has parallel sides 10 and 6, height 4. Find its area.<br><br>$A = \\tfrac{1}{2}(10 + 6) \\cdot 4 = \\tfrac{1}{2} \\cdot 16 \\cdot 4 = \\mathbf{32}$ square units.</div></div>

<h2 class="lesson-title">8. Regular Polygons</h2>

<div class="calc-highlight"><strong>A regular polygon has n equal sides and n equal interior angles.</strong> An equilateral triangle is n=3, a square is n=4, a regular pentagon is n=5, and so on. The perimeter is trivial: $P = n \\cdot s$. The area uses the apothem &mdash; the perpendicular distance from the centre to the midpoint of a side.</div>

<div class="calc-formula"><div class="formula-label">REGULAR n-GON</div><div class="formula-main">$$P \\;=\\; n\\,s, \\qquad A \\;=\\; \\tfrac{1}{2}\\,a\\,P \\;=\\; \\tfrac{1}{2}\\,a\\,(n\\,s)$$</div><div class="formula-sub">s = side length, n = number of sides, a = apothem (perpendicular distance from centre to a side).</div></div>

<p class="l-text">Why does this work? Split the regular n-gon into n identical isosceles triangles, each with base s and height a. Each triangle has area $\\tfrac{1}{2}sa$. Sum over n: total area is $\\tfrac{1}{2} n s a = \\tfrac{1}{2} a P$. The "(1/2) &times; apothem &times; perimeter" rule is the regular-polygon version of "(1/2) &times; base &times; height" for a triangle.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A regular hexagon has side 4 and apothem $2\\sqrt{3}$. Find its perimeter and area.<br><br>Perimeter: $P = 6 \\cdot 4 = 24$.<br><br>Area: $A = \\tfrac{1}{2} \\cdot 2\\sqrt{3} \\cdot 24 = 24\\sqrt{3} \\approx 41.57$ square units.</div></div>

<h2 class="lesson-title">9. Circle: Circumference and Area</h2>

<div class="calc-highlight"><strong>A circle is the set of all points at a fixed distance r (the radius) from a centre.</strong> The perimeter of a circle has its own name: the <em>circumference</em>. Both the circumference and the area involve the constant &pi; &approx; 3.14159, which is the ratio of any circle's circumference to its diameter.</div>

<div class="calc-formula"><div class="formula-label">CIRCLE</div><div class="formula-main">$$C \\;=\\; 2\\pi r \\;=\\; \\pi d, \\qquad A \\;=\\; \\pi r^2$$</div><div class="formula-sub">r = radius, d = 2r = diameter. The first formula is a length (units of r). The second is an area (units of $r^2$).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A circle has radius 3. Find its circumference and area.<br><br>$C = 2\\pi \\cdot 3 = \\mathbf{6\\pi}$ (about 18.85).<br><br>$A = \\pi \\cdot 3^2 = \\mathbf{9\\pi}$ (about 28.27).<br><br>Notice $A/C = (9\\pi)/(6\\pi) = 3/2 = r/2$ &mdash; not a coincidence: $A/C = r/2$ for every circle.</div></div>

<div class="calc-graph"><div id="plot-l88-shapes-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the six most common 2D shapes drawn side by side with their perimeter and area formulas annotated. A handy reference card: glance at this picture, find your shape, read off the formula.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var sqX=[0,1.8,1.8,0,0];var sqY=[3,3,4.8,4.8,3];
var rcX=[2.6,5,5,2.6,2.6];var rcY=[3,3,4.8,4.8,3];
var trX=[6,7.5,9,6];var trY=[3,4.8,3,3];
var paX=[0,1.8,2.6,0.8,0];var paY=[0,0,1.5,1.5,0];
var rhX=[3.6,4.6,5.6,4.6,3.6];var rhY=[0.75,0,0.75,1.5,0.75];
var trapX=[6.2,9.2,8.6,6.8,6.2];var trapY=[0,0,1.5,1.5,0];
var sq={x:sqX,y:sqY,mode:'lines',name:'Square: P=4s, A=s²',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var rc={x:rcX,y:rcY,mode:'lines',name:'Rectangle: P=2(l+w), A=lw',line:{color:'#10b981',width:2.5},fill:'toself',fillcolor:'rgba(16,185,129,0.15)'};
var tr={x:trX,y:trY,mode:'lines',name:'Triangle: A=½bh',line:{color:'#f59e0b',width:2.5},fill:'toself',fillcolor:'rgba(245,158,11,0.15)'};
var pa={x:paX,y:paY,mode:'lines',name:'Parallelogram: A=bh',line:{color:'#ec4899',width:2.5},fill:'toself',fillcolor:'rgba(236,72,153,0.15)'};
var rh={x:rhX,y:rhY,mode:'lines',name:'Rhombus: A=½d₁d₂',line:{color:'#a78bfa',width:2.5},fill:'toself',fillcolor:'rgba(167,139,250,0.15)'};
var trap={x:trapX,y:trapY,mode:'lines',name:'Trapezoid: A=½(a+c)h',line:{color:'#ef4444',width:2.5},fill:'toself',fillcolor:'rgba(239,68,68,0.15)'};
var labels={x:[0.9,3.8,7.5,1.3,4.6,7.6],y:[5.1,5.1,5.1,1.85,1.85,1.85],mode:'text',name:'labels',text:['SQUARE','RECTANGLE','TRIANGLE','PARALLELOGRAM','RHOMBUS','TRAPEZOID'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,9.8],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.1)',visible:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.1)',visible:false},margin:{t:20,r:20,b:20,l:20},legend:{orientation:'h',y:-0.05,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l88-shapes-en',[sq,rc,tr,pa,rh,trap,labels],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Sectors and Arcs</h2>

<div class="calc-highlight"><strong>A sector is a "pie slice" cut from a circle.</strong> It is bounded by two radii and an arc of the circle. If the central angle is $\\theta$ (<em>in radians</em>), then the arc length and the sector area have remarkably simple formulas.</div>

<div class="calc-formula"><div class="formula-label">ARC LENGTH AND SECTOR AREA</div><div class="formula-main">$$\\text{arc length} \\;=\\; r\\,\\theta, \\qquad \\text{sector area} \\;=\\; \\tfrac{1}{2}\\,r^2\\,\\theta$$</div><div class="formula-sub"><strong>&theta; must be in radians.</strong> If you have a degree measure, convert first: $\\theta_{\\text{rad}} = \\theta_{\\text{deg}} \\cdot \\pi/180$.</div></div>

<p class="l-text">Why these formulas? The full circle has angle $2\\pi$, circumference $2\\pi r$, area $\\pi r^2$. A sector with angle $\\theta$ is the fraction $\\theta/(2\\pi)$ of the whole. So its arc length is $(\\theta/(2\\pi)) \\cdot 2\\pi r = r\\theta$, and its area is $(\\theta/(2\\pi)) \\cdot \\pi r^2 = \\tfrac{1}{2} r^2 \\theta$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; SECTOR</div><div class="example-body">A sector has radius 5 and central angle 60&deg;. Find its arc length and area.<br><br>First convert: $\\theta = 60^\\circ \\cdot \\pi/180 = \\pi/3$ rad.<br><br>Arc length: $r\\theta = 5 \\cdot \\pi/3 = 5\\pi/3 \\approx 5.24$.<br><br>Sector area: $\\tfrac{1}{2} r^2 \\theta = \\tfrac{1}{2} \\cdot 25 \\cdot \\pi/3 = 25\\pi/6 \\approx 13.09$.</div></div>

<div class="calc-graph"><div id="plot-l88-sector-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a sector of radius 5 and central angle 60&deg; (&pi;/3 rad). The shaded region is the sector, the thick curve is the arc, and the two thin radii form the straight edges. Use this picture to keep "arc" (a length) and "sector area" (an area) mentally separate.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=5;var thMax=Math.PI/3;
var arcX=[0];var arcY=[0];
for(var i=0;i<=60;i++){var a=thMax*i/60;arcX.push(r*Math.cos(a));arcY.push(r*Math.sin(a));}
arcX.push(0);arcY.push(0);
var sector={x:arcX,y:arcY,mode:'lines',name:'sector (shaded)',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.2)'};
var arcOnlyX=[];var arcOnlyY=[];
for(var j=0;j<=60;j++){var b=thMax*j/60;arcOnlyX.push(r*Math.cos(b));arcOnlyY.push(r*Math.sin(b));}
var arcLine={x:arcOnlyX,y:arcOnlyY,mode:'lines',name:'arc (length = rθ)',line:{color:'#f59e0b',width:4}};
var rad1={x:[0,r],y:[0,0],mode:'lines',name:'radius',line:{color:'#10b981',width:2}};
var rad2={x:[0,r*Math.cos(thMax)],y:[0,r*Math.sin(thMax)],mode:'lines',name:'radius',line:{color:'#10b981',width:2},showlegend:false};
var fullX=[];var fullY=[];
for(var k=0;k<=360;k++){var c=2*Math.PI*k/360;fullX.push(r*Math.cos(c));fullY.push(r*Math.sin(c));}
var fullRing={x:fullX,y:fullY,mode:'lines',name:'circle r=5',line:{color:'rgba(255,255,255,0.18)',width:1,dash:'dot'}};
var ann={x:[3.5,4],y:[0.6,1.5],mode:'text',name:'labels',text:['θ = 60° = π/3','arc'],textfont:{color:'#e8e8e8',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l88-sector-en',[fullRing,sector,arcLine,rad1,rad2,ann],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Most common error in this section:</strong> plugging in $\\theta$ in degrees instead of radians. The formulas $r\\theta$ and $\\tfrac{1}{2}r^2\\theta$ <em>only</em> work in radians. If your answer is off by a factor of about 57 (which is $180/\\pi$), you forgot to convert.</div>

<h2 class="lesson-title">11. Composite Figures</h2>

<div class="calc-highlight"><strong>Real shapes are rarely a single textbook polygon.</strong> An "L-shaped" floor plan, a window made of a rectangle with a half-circle on top, a garden path that is a rectangle with a quarter-circle corner &mdash; these are all <em>composite figures</em>. The strategy is always the same: split the shape into pieces you know, find each piece's area, then add or subtract.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 &mdash; Decompose</div><div class="card-body">Cut the shape into rectangles, triangles, circles, sectors. Sketch each piece separately.</div></div>
<div class="calc-card"><div class="card-title">Step 2 &mdash; Compute</div><div class="card-body">Apply the standard formula to each piece. Be careful with units.</div></div>
<div class="calc-card"><div class="card-title">Step 3 &mdash; Combine</div><div class="card-body">Add areas of pieces that are inside the figure. Subtract areas of holes or cut-outs.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; L-SHAPE</div><div class="example-body">An L-shaped floor is made by taking a 10 m by 8 m rectangle and cutting a 4 m by 3 m rectangle out of one corner. Find the area.<br><br>Big rectangle: $10 \\cdot 8 = 80 \\text{ m}^2$.<br><br>Cut-out: $4 \\cdot 3 = 12 \\text{ m}^2$.<br><br>L-shape area: $80 - 12 = \\mathbf{68 \\text{ m}^2}$.<br><br>You could also decompose the L into two rectangles ($10 \\cdot 5 + 6 \\cdot 3 = 50 + 18 = 68$) &mdash; same answer.</div></div>

<div class="calc-graph"><div id="plot-l88-composite-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the L-shape (solid blue outline) drawn as a 10&times;8 rectangle minus a 4&times;3 cut-out (dashed). The dashed rectangle shows the corner that was removed. Same composite area, two different decompositions: minus the cut-out, or add the two solid sub-rectangles.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var lShapeX=[0,10,10,4,4,0,0];var lShapeY=[0,0,5,5,8,8,0];
var bigX=[0,10,10,0,0];var bigY=[0,0,8,8,0];
var cutX=[4,10,10,4,4];var cutY=[5,5,8,8,5];
var lFill={x:lShapeX,y:lShapeY,mode:'lines',name:'L-shape (area 68)',line:{color:'#3b82f6',width:3},fill:'toself',fillcolor:'rgba(59,130,246,0.18)'};
var bigOut={x:bigX,y:bigY,mode:'lines',name:'big rectangle 10×8 = 80',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dot'}};
var cutOut={x:cutX,y:cutY,mode:'lines',name:'cut-out 4×3 = 12',line:{color:'#ef4444',width:2,dash:'dash'},fill:'toself',fillcolor:'rgba(239,68,68,0.08)'};
var split={x:[0,10,null,4,4],y:[5,5,null,0,8],mode:'lines',name:'alternative split',line:{color:'#f59e0b',width:1,dash:'dashdot'}};
var anns={x:[5,7,2,7],y:[2.5,6.5,6.5,9.2],mode:'text',name:'labels',text:['10×5 = 50','&nbsp;','6×3 = 18','minus the dashed cut-out: 80 − 12 = 68'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'metres',range:[-1,11.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'metres',range:[-1,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:-0.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l88-composite-en',[lFill,bigOut,cutOut,split,anns],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Coordinate Area: The Shoelace Formula for a Triangle</h2>

<div class="calc-highlight"><strong>If you know the three vertex coordinates of a triangle but no sides or angles, the shoelace formula computes the area directly.</strong> No need to find side lengths first.</div>

<div class="calc-formula"><div class="formula-label">SHOELACE &mdash; TRIANGLE</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,\\big|\\, x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2) \\,\\big|$$</div><div class="formula-sub">The vertices are $(x_1,y_1), (x_2,y_2), (x_3,y_3)$. The absolute value is there because the same formula gives a signed area (positive if the vertices are CCW, negative if CW).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; SHOELACE</div><div class="example-body">Find the area of the triangle with vertices $A(0,0), B(4,0), C(1,3)$.<br><br>Plug in: $x_1=0, y_1=0, x_2=4, y_2=0, x_3=1, y_3=3$.<br><br>$A = \\tfrac{1}{2}|0 \\cdot (0-3) + 4 \\cdot (3-0) + 1 \\cdot (0-0)| = \\tfrac{1}{2}|0 + 12 + 0| = \\mathbf{6}$.<br><br>Check by $\\tfrac{1}{2}bh$: base AB has length 4 along the x-axis; the perpendicular height from C(1,3) to the x-axis is 3. So $A = \\tfrac{1}{2} \\cdot 4 \\cdot 3 = 6$. Same answer.</div></div>

<h2 class="lesson-title">13. Common Errors and Pitfalls</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mixing perimeter and area units</div><div class="card-body">Perimeter is in cm, m, km. Area is in cm&sup2;, m&sup2;, km&sup2;. Never give a perimeter in cm&sup2; or an area in cm.</div></div>
<div class="calc-card"><div class="card-title">Forgetting the 1/2 for triangles</div><div class="card-body">Triangle area is $\\tfrac{1}{2}bh$, not $bh$. The factor 1/2 is the most-forgotten constant in geometry.</div></div>
<div class="calc-card"><div class="card-title">Using degrees in arc formulas</div><div class="card-body">$r\\theta$ and $\\tfrac{1}{2}r^2\\theta$ only work in radians. Convert degrees with $\\times \\pi/180$ first.</div></div>
<div class="calc-card"><div class="card-title">Using the slant side as height</div><div class="card-body">For parallelograms, trapezoids, and triangles, the "height" is the <em>perpendicular</em> distance, not the slanted side.</div></div>
<div class="calc-card"><div class="card-title">Forgetting absolute value in shoelace</div><div class="card-body">The shoelace formula gives a signed area. Wrap it in $|\\cdot|$ to get the (positive) geometric area.</div></div>
<div class="calc-card"><div class="card-title">Mixing units inside one figure</div><div class="card-body">If one side is in cm and another in mm, convert before adding. The unit must be uniform across the whole calculation.</div></div>
</div>

<h2 class="lesson-title">14. Worked Problems</h2>

<p class="l-text">A short set of practice problems pulling together everything in the lesson. Try each one yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; RECTANGLE</div><div class="example-body"><strong>A rectangle is 6 by 8. Find its perimeter and area.</strong><br><br>$P = 2(6 + 8) = 2 \\cdot 14 = \\mathbf{28}$. $A = 6 \\cdot 8 = \\mathbf{48}$. Units: P in length, A in length squared.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; TRIANGLE (HERON)</div><div class="example-body"><strong>A triangle has sides 5, 6, 7. Find its area.</strong><br><br>$s = (5+6+7)/2 = 9$. $A = \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = \\mathbf{6\\sqrt{6}} \\approx 14.70$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; CIRCLE</div><div class="example-body"><strong>A circle has radius 3. Find C and A.</strong><br><br>$C = 2\\pi \\cdot 3 = \\mathbf{6\\pi} \\approx 18.85$. $A = \\pi \\cdot 9 = \\mathbf{9\\pi} \\approx 28.27$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SECTOR</div><div class="example-body"><strong>A sector has radius 5 and central angle 60&deg;. Find arc length and sector area.</strong><br><br>Convert: $\\theta = \\pi/3$. Arc: $5 \\cdot \\pi/3 = \\mathbf{5\\pi/3}$. Area: $\\tfrac{1}{2} \\cdot 25 \\cdot \\pi/3 = \\mathbf{25\\pi/6}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; TRAPEZOID</div><div class="example-body"><strong>A trapezoid has parallel sides 12 and 8 and height 5. Find its area.</strong><br><br>$A = \\tfrac{1}{2}(12 + 8) \\cdot 5 = \\tfrac{1}{2} \\cdot 20 \\cdot 5 = \\mathbf{50}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; SAS TRIANGLE</div><div class="example-body"><strong>A triangle has two sides 6 and 10 with a 30&deg; angle between them. Find its area.</strong><br><br>$A = \\tfrac{1}{2} \\cdot 6 \\cdot 10 \\cdot \\sin 30^\\circ = \\tfrac{1}{2} \\cdot 60 \\cdot \\tfrac{1}{2} = \\mathbf{15}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; RHOMBUS</div><div class="example-body"><strong>A rhombus has diagonals 10 and 24. Find its area and side length.</strong><br><br>$A = \\tfrac{1}{2} \\cdot 10 \\cdot 24 = \\mathbf{120}$. The diagonals bisect at right angles, so each side is $\\sqrt{5^2 + 12^2} = 13$. Perimeter $P = 4 \\cdot 13 = 52$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SHOELACE</div><div class="example-body"><strong>Find the area of a triangle with vertices (1,1), (5,2), (3,6).</strong><br><br>$A = \\tfrac{1}{2}|1(2-6) + 5(6-1) + 3(1-2)| = \\tfrac{1}{2}|-4 + 25 - 3| = \\tfrac{1}{2} \\cdot 18 = \\mathbf{9}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Perimeter is a length (cm, m, ...); area is a length squared (cm&sup2;, m&sup2;, ...)</li>
<li>Triangle: $P = a+b+c$; $A = \\tfrac{1}{2}bh = \\tfrac{1}{2}ab\\sin C = \\sqrt{s(s-a)(s-b)(s-c)}$</li>
<li>Square / rectangle: $P = 4s$ or $2(\\ell+w)$; $A = s^2$ or $\\ell w$</li>
<li>Parallelogram: $A = bh$ (perpendicular height, not slanted side)</li>
<li>Rhombus / kite: $A = \\tfrac{1}{2}d_1 d_2$ (diagonals are perpendicular)</li>
<li>Trapezoid: $A = \\tfrac{1}{2}(a+c)h$ (average the parallel sides)</li>
<li>Regular n-gon: $P = ns$; $A = \\tfrac{1}{2}\\,a\\,P$ where $a$ is the apothem</li>
<li>Circle: $C = 2\\pi r$; $A = \\pi r^2$</li>
<li>Sector with central angle $\\theta$ in radians: arc $= r\\theta$, area $= \\tfrac{1}{2}r^2\\theta$</li>
<li>Composite figures: split into known pieces, then add or subtract</li>
<li>Triangle from vertices: shoelace formula $A = \\tfrac{1}{2}|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Her düzlem şeklin iki temel ölçüsü vardır:</strong> sınırı boyunca ne kadar uzandığı ve içinde ne kadar yer kapladığı. Birincisi <em>çevre</em>, ikincisi <em>alandır</em>. Dikdörtgen bir bahçenin her ikisi de var: çevre kaç metre tel çit alacağını, alan ise ne kadar çim tohumu gerektiğini söyler. Bu iki sayı tamamen farklı şeyler ölçer — çevre bir uzunluk, alan bir uzunluk karesidir — ve bunları karıştırmak liseli bir öğrencinin yaptığı en yaygın hatalardan biridir.</p>

<p class="l-text">Bu ders, bilmen beklenen tüm standart çevre ve alan formüllerini bir araya getiriyor: üçgenler (üç yoldan), kareler, dikdörtgenler, paralelkenarlar, eşkenar dörtgenler, deltoidler, yamuklar, düzgün çokgenler, çemberler, daire dilimleri. Bileşik şekilleri (bir parçayı diğerinden çıkararak), köşeleri verilen bir üçgen için ayakkabı bağı formülünü ve ödevini bozan birimler, eksik çarpanlar ile derece-radyan tuzaklarının dikkatli bir listesini işleyeceğiz. Burada fazladan bir saat harca, sonra onlarca saat tasarruf et.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çevreyi (uzunluk, cm gibi birim) alandan (uzunluk karesi, cm&sup2; gibi birim) ayırmayı ve asla karıştırmamayı</li>
<li>Her standart çokgenin çevre ve alanını hesaplamayı: üçgen, kare, dikdörtgen, paralelkenar, eşkenar dörtgen, deltoid, yamuk, düzgün n-gen</li>
<li>Bir üçgen için üç farklı alan formülünü kullanmayı &mdash; taban &times; yükseklik, KAK, Heron &mdash; ve elindeki veriye göre doğru olanı seçmeyi</li>
<li>Çember için $C = 2\\pi r$ ve $A = \\pi r^2$, daire dilimi için $r\\theta$ ve $(1/2)r^2\\theta$ formüllerini uygulamayı</li>
<li>Bileşik şekilleri dikdörtgenler ve çemberler ekleyerek ya da çıkarılan parçaları düşerek ayrıştırmayı</li>
<li>Üç köşe koordinatından bir üçgenin alanını ayakkabı bağı (shoelace) formülüyle bulmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Çevre: Sınırı Dolaşan Uzunluk</h2>

<div class="calc-highlight"><strong>Çevre, sınırın toplam uzunluğudur.</strong> Herhangi bir çokgen için bu, kenar uzunluklarının toplamıdır: P = a + b + c + .... Çember gibi eğri bir şekil için bir formül (çember uzunluğu) kullanırız. Çevrenin birimi bir uzunluk birimidir: cm, m, km. Asla cm&sup2; değil.</div>

<p class="l-text">Bir karıncanın ayağını yere bırakmadan bir şeklin kenarı boyunca bir kez dolaştığını düşün. Kat ettiği toplam mesafe çevredir. Uzunlukları $s_1, s_2, ..., s_n$ olan n kenarlı bir çokgen için formül basitçe:</p>

<div class="calc-formula"><div class="formula-label">BİR ÇOKGENİN ÇEVRESİ</div><div class="formula-main">$$P \\;=\\; s_1 + s_2 + s_3 + \\cdots + s_n$$</div><div class="formula-sub">Her kenarı topla. Birim, kenarların birimiyle aynıdır (cm, m, km, ...).</div></div>

<div class="l-note"><strong>Birim, lütfen.</strong> Kenar uzunlukları metre cinsinden ise, çevre de metre cinsindedir. Kenarlar karışıksa (bazıları cm, bazıları m), önce <em>dönüştür</em>, sonra topla. Aynı toplam içinde birimleri karıştırmak en hızlı yanlış cevap yoludur.</div>

<h2 class="lesson-title">2. Alan: İçeride Kalan Boşluk</h2>

<div class="calc-highlight"><strong>Alan, sınır tarafından kapatılan 2 boyutlu boşluk miktarıdır.</strong> Birimi her zaman bir uzunluk-karesidir: cm&sup2;, m&sup2;, km&sup2;, hektar. Şekli her biri 1 birim kenarlı karelerle saydığını düşün. 3'e 4 bir dikdörtgen $3 \\times 4 = 12$ birim kare içerir, yani alanı 12'dir.</div>

<p class="l-text">Bu dersteki her alan formülü, sonuçta birim kareleri saymanın akıllıca bir yoludur — gerçi üçgenler ve çemberler için akıllıca dilimleriz ya da yeniden düzenleriz. Birim kare resmini aklında tut: bir dikdörtgen için neden $A = bh$, üçgen için neden $1/2$ çarpanı geldiği ve çemberin neden $\\pi$ kaptığı bu sayede anlam kazanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çevre birimi</div><div class="card-body">Bir uzunluk: cm, m, km, inç. Çevre için cm&sup2; yazarsan, cevap tanımı gereği yanlıştır.</div></div>
<div class="calc-card"><div class="card-title">Alan birimi</div><div class="card-body">Bir uzunluk karesi: cm&sup2;, m&sup2;, km&sup2;. Alan için cm yazarsan, yanlıştır.</div></div>
<div class="calc-card"><div class="card-title">Aradaki fark neden</div><div class="card-body">Çevre 1 boyutlu bir eğriyi ölçer. Alan 2 boyutlu bir bölgeyi ölçer. Farklı boyutlar, farklı birimler.</div></div>
</div>

<h2 class="lesson-title">3. Üçgen: Üç Kenar, Üç Alan Formülü</h2>

<div class="calc-highlight"><strong>Üçgen, geometrideki en önemli şekildir çünkü her çokgen üçgenlere bölünebilir.</strong> Üç alan formülüne hâkim ol, her çokgenin alanını bulabilirsin. Çevresi kolay: kenarları topla.</div>

<div class="calc-formula"><div class="formula-label">ÜÇGENİN ÇEVRESİ</div><div class="formula-main">$$P \\;=\\; a + b + c$$</div><div class="formula-sub">a, b, c üç kenar uzunluğudur.</div></div>

<p class="l-text"><strong>Alan formülü 1: taban &times; yükseklik.</strong> Herhangi bir kenarı taban seç (b diyelim). Karşı köşeden o tabana (veya onun uzantısına) bir dikme indir. Bu dik uzaklığa h, <em>yükseklik</em> de. O zaman:</p>

<div class="calc-formula"><div class="formula-label">ALAN &mdash; TABAN &times; YÜKSEKLİK</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,b\\,h$$</div><div class="formula-sub">1/2 çarpanı zorunludur. Bir üçgen, en uzun kenarı boyunca yansıtarak inşa edeceğin paralelkenarın tam yarısıdır.</div></div>

<p class="l-text"><strong>Alan formülü 2: KAK (kenar-açı-kenar).</strong> Bir yükseklik yerine iki kenarı ve aralarındaki açıyı biliyorsan, şunu kullan:</p>

<div class="calc-formula"><div class="formula-label">ALAN &mdash; KAK FORMÜLÜ</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,a\\,b\\,\\sin C$$</div><div class="formula-sub">a ve b iki kenar; C aralarındaki açıdır. Bu, (1/2)bh formülünü geri verir çünkü C köşesinden b kenarına inen yükseklik $a \\sin C$'dir.</div></div>

<p class="l-text"><strong>Alan formülü 3: Heron (sadece üç kenar).</strong> Sadece üç kenar uzunluğunu biliyorsan ve açı ya da yükseklik yoksa, Heron formülü tam aradığın şeydir:</p>

<div class="calc-formula"><div class="formula-label">HERON FORMÜLÜ</div><div class="formula-main">$$s = \\tfrac{a+b+c}{2}, \\qquad A \\;=\\; \\sqrt{\\,s\\,(s-a)(s-b)(s-c)\\,}$$</div><div class="formula-sub">s yarı-çevredir (çevrenin yarısı). Heron, açı bulmadan üç kenardan alanı hesaplamana izin verir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; HERON</div><div class="example-body">Kenarları 5, 6, 7 olan bir üçgenin alanını bul.<br><br>$s = (5+6+7)/2 = 9$.<br><br>$A = \\sqrt{9(9-5)(9-6)(9-7)} = \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = 6\\sqrt{6}$.<br><br>Yani $A = 6\\sqrt{6} \\approx 14.70$ birim kare. Çevre $5+6+7 = 18$.</div></div>

<div class="l-note"><strong>Doğru formülü seç.</strong> Taban ve yükseklik verildi &rarr; $\\tfrac{1}{2}bh$ kullan. İki kenar ve aralarındaki açı verildi &rarr; KAK kullan. Üç kenar verildi &rarr; Heron kullan. Aynı üçgenin alanı hangisini kullanırsan kullan aynıdır; en kolay olanı seçmek zaman kazandırır.</div>

<h2 class="lesson-title">4. Kare ve Dikdörtgen</h2>

<div class="calc-highlight"><strong>En basit iki durum.</strong> Kare, dört eşit kenarı s uzunluğunda olan şekildir. Dikdörtgen, $\\ell$ uzunluğunda ve w genişliğindedir. Her ikisinin de tüm köşelerinde dik açı vardır, bu da alanı önemsiz kılar: sadece uzunluk &times; genişlik.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kare</div><div class="card-body">Kenar s. Çevre $P = 4s$. Alan $A = s^2$.</div></div>
<div class="calc-card"><div class="card-title">Dikdörtgen</div><div class="card-body">Uzunluk $\\ell$, genişlik $w$. Çevre $P = 2(\\ell + w)$. Alan $A = \\ell w$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; DİKDÖRTGEN</div><div class="example-body">Uzunluğu 8 cm ve genişliği 6 cm olan bir dikdörtgenin çevresini ve alanını bul.<br><br>$P = 2(8 + 6) = 2 \\cdot 14 = \\mathbf{28 \\text{ cm}}$.<br><br>$A = 8 \\cdot 6 = \\mathbf{48 \\text{ cm}^2}$.<br><br>Birimlere dikkat: çevre cm cinsinden, alan cm&sup2; cinsinden.</div></div>

<h2 class="lesson-title">5. Paralelkenar</h2>

<div class="calc-highlight"><strong>Paralelkenarın iki çift paralel kenarı vardır.</strong> Karşılıklı kenarlar eşittir ama köşeler dik olmak zorunda değildir. Alan formülü dikdörtgeninkine benzer; ama "yükseklik" iki paralel kenar arasındaki dik yüksekliktir, <em>eğik</em> kenar değil.</div>

<div class="calc-formula"><div class="formula-label">PARALELKENAR</div><div class="formula-main">$$P \\;=\\; 2(a + b), \\qquad A \\;=\\; b \\cdot h$$</div><div class="formula-sub">a ve b iki eşit kenar çifti; h, b kenarına olan dik yüksekliktir.</div></div>

<p class="l-text">Neden $A = bh$? Paralelkenarın bir ucundan bir dik üçgen kes ve diğer ucuna kaydır &mdash; aynı taban b ve aynı yükseklik h ile aynı alana sahip bir dikdörtgen elde edersin. Yani paralelkenar, aynı alanlı bir "eğik dikdörtgen"den başka bir şey değildir.</p>

<div class="l-note"><strong>Yaygın hata:</strong> dik yükseklik h yerine eğik kenar a'yı kullanmak. Eğik kenar daha uzundur; alanı olduğundan fazla bulursun. Her zaman bir köşeden karşı paralel kenara inilen dikmeyi kullan.</div>

<h2 class="lesson-title">6. Eşkenar Dörtgen ve Deltoid</h2>

<div class="calc-highlight"><strong>Eşkenar dörtgen, dört kenarı eşit olan bir paralelkenardır.</strong> Deltoidin (uçurtma) iki çift komşu kenarı eşittir. Her iki şekilde de köşegenler dik açıyla kesişir ve bu, köşegenler cinsinden güzel bir alan formülü verir.</div>

<div class="calc-formula"><div class="formula-label">EŞKENAR DÖRTGEN / DELTOID &mdash; KÖŞEGEN FORMÜLÜ</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\, d_1 \\, d_2$$</div><div class="formula-sub">$d_1$ ve $d_2$ iki köşegenin uzunluklarıdır. Köşegenler dik olduğu için her eşkenar dörtgen veya deltoid için geçerlidir.</div></div>

<p class="l-text">Kenarı s olan bir eşkenar dörtgen için çevre $P = 4s$. İki çift komşu kenarı $a$ ve $b$ olan bir deltoid için çevre $P = 2(a + b)$.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Köşegenleri 8 ve 6 olan bir eşkenar dörtgenin alanını bul.<br><br>$A = \\tfrac{1}{2} \\cdot 8 \\cdot 6 = \\mathbf{24}$ birim kare.<br><br>Kenar uzunluğu (içerideki dört dik üçgene Pisagor uygulayarak): $s = \\sqrt{4^2 + 3^2} = 5$. Yani çevre $P = 4 \\cdot 5 = 20$.</div></div>

<h2 class="lesson-title">7. Yamuk</h2>

<div class="calc-highlight"><strong>Yamuğun (trapezoid) yalnızca bir çift paralel kenarı vardır.</strong> Bunlara $a$ ve $c$ diyelim. Diğer iki kenar, paralel kenarları belli bir açıyla birbirine bağlar. İki paralel kenar arasındaki dik uzaklık yükseklik h'dir.</div>

<div class="calc-formula"><div class="formula-label">YAMUK ALANI</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,(a + c)\\,h$$</div><div class="formula-sub">İki paralel kenarın ortalamasını al, yüksekliğe çarp. Sezgi: yamuk, genişliği $a$ olan bir dikdörtgen ile genişliği $c$ olan bir dikdörtgen "arasında" durur.</div></div>

<p class="l-text">Çevre yalnızca dört kenarın toplamıdır; formül diğer iki kenarın eşit olup olmadığına (ikizkenar yamuk) bağlıdır. Genel olarak, b ve d paralel olmayan iki kenar olmak üzere $P = a + b + c + d$.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Paralel kenarları 10 ve 6, yüksekliği 4 olan bir yamuğun alanını bul.<br><br>$A = \\tfrac{1}{2}(10 + 6) \\cdot 4 = \\tfrac{1}{2} \\cdot 16 \\cdot 4 = \\mathbf{32}$ birim kare.</div></div>

<h2 class="lesson-title">8. Düzgün Çokgenler</h2>

<div class="calc-highlight"><strong>Düzgün bir çokgenin n eşit kenarı ve n eşit iç açısı vardır.</strong> Eşkenar üçgen n=3, kare n=4, düzgün beşgen n=5 vb. Çevre önemsiz: $P = n \\cdot s$. Alan ise apothem'i kullanır &mdash; merkezden bir kenarın orta noktasına olan dik uzaklık.</div>

<div class="calc-formula"><div class="formula-label">DÜZGÜN n-GEN</div><div class="formula-main">$$P \\;=\\; n\\,s, \\qquad A \\;=\\; \\tfrac{1}{2}\\,a\\,P \\;=\\; \\tfrac{1}{2}\\,a\\,(n\\,s)$$</div><div class="formula-sub">s = kenar uzunluğu, n = kenar sayısı, a = apothem (merkezden bir kenara dik uzaklık).</div></div>

<p class="l-text">Bu neden işe yarıyor? Düzgün n-geni n tane özdeş ikizkenar üçgene böl; her birinin tabanı s ve yüksekliği a. Her üçgenin alanı $\\tfrac{1}{2}sa$. n üzerinden topla: toplam alan $\\tfrac{1}{2} n s a = \\tfrac{1}{2} a P$. "(1/2) &times; apothem &times; çevre" kuralı, üçgendeki "(1/2) &times; taban &times; yükseklik" kuralının düzgün çokgen versiyonudur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Kenarı 4 ve apothem'i $2\\sqrt{3}$ olan düzgün altıgenin çevresini ve alanını bul.<br><br>Çevre: $P = 6 \\cdot 4 = 24$.<br><br>Alan: $A = \\tfrac{1}{2} \\cdot 2\\sqrt{3} \\cdot 24 = 24\\sqrt{3} \\approx 41.57$ birim kare.</div></div>

<h2 class="lesson-title">9. Çember: Çevre ve Alan</h2>

<div class="calc-highlight"><strong>Çember, bir merkezden sabit r uzaklıkta (yarıçap) olan tüm noktaların kümesidir.</strong> Çemberin çevresinin kendine özel bir adı vardır: <em>çember uzunluğu</em>. Hem çember uzunluğu hem alan, herhangi bir çemberin çevresinin çapına oranı olan &pi; &approx; 3.14159 sabitini içerir.</div>

<div class="calc-formula"><div class="formula-label">ÇEMBER</div><div class="formula-main">$$C \\;=\\; 2\\pi r \\;=\\; \\pi d, \\qquad A \\;=\\; \\pi r^2$$</div><div class="formula-sub">r = yarıçap, d = 2r = çap. İlk formül bir uzunluktur (r'nin birimi). İkincisi bir alandır ($r^2$'nin birimi).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Yarıçapı 3 olan bir çemberin çevre uzunluğunu ve alanını bul.<br><br>$C = 2\\pi \\cdot 3 = \\mathbf{6\\pi}$ (yaklaşık 18.85).<br><br>$A = \\pi \\cdot 3^2 = \\mathbf{9\\pi}$ (yaklaşık 28.27).<br><br>$A/C = (9\\pi)/(6\\pi) = 3/2 = r/2$ olduğuna dikkat &mdash; tesadüf değil: $A/C = r/2$ her çember için doğrudur.</div></div>

<div class="calc-graph"><div id="plot-l88-shapes-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> en yaygın altı 2 boyutlu şekil yan yana çizilmiş, çevre ve alan formülleri etiketlenmiş. Kullanışlı bir referans kartı: bu resme bak, şeklini bul, formülü oku.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var sqXt=[0,1.8,1.8,0,0];var sqYt=[3,3,4.8,4.8,3];
var rcXt=[2.6,5,5,2.6,2.6];var rcYt=[3,3,4.8,4.8,3];
var trXt=[6,7.5,9,6];var trYt=[3,4.8,3,3];
var paXt=[0,1.8,2.6,0.8,0];var paYt=[0,0,1.5,1.5,0];
var rhXt=[3.6,4.6,5.6,4.6,3.6];var rhYt=[0.75,0,0.75,1.5,0.75];
var trapXt=[6.2,9.2,8.6,6.8,6.2];var trapYt=[0,0,1.5,1.5,0];
var sqT={x:sqXt,y:sqYt,mode:'lines',name:'Kare: P=4s, A=s²',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var rcT={x:rcXt,y:rcYt,mode:'lines',name:'Dikdörtgen: P=2(l+w), A=lw',line:{color:'#10b981',width:2.5},fill:'toself',fillcolor:'rgba(16,185,129,0.15)'};
var trT={x:trXt,y:trYt,mode:'lines',name:'Üçgen: A=½bh',line:{color:'#f59e0b',width:2.5},fill:'toself',fillcolor:'rgba(245,158,11,0.15)'};
var paT={x:paXt,y:paYt,mode:'lines',name:'Paralelkenar: A=bh',line:{color:'#ec4899',width:2.5},fill:'toself',fillcolor:'rgba(236,72,153,0.15)'};
var rhT={x:rhXt,y:rhYt,mode:'lines',name:'Eşkenar dörtgen: A=½d₁d₂',line:{color:'#a78bfa',width:2.5},fill:'toself',fillcolor:'rgba(167,139,250,0.15)'};
var trapT={x:trapXt,y:trapYt,mode:'lines',name:'Yamuk: A=½(a+c)h',line:{color:'#ef4444',width:2.5},fill:'toself',fillcolor:'rgba(239,68,68,0.15)'};
var labelsT={x:[0.9,3.8,7.5,1.3,4.6,7.6],y:[5.1,5.1,5.1,1.85,1.85,1.85],mode:'text',name:'etiketler',text:['KARE','DİKDÖRTGEN','ÜÇGEN','PARALELKENAR','EŞKENAR DÖRTGEN','YAMUK'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.5,9.8],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.1)',visible:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.1)',visible:false},margin:{t:20,r:20,b:20,l:20},legend:{orientation:'h',y:-0.05,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l88-shapes-tr',[sqT,rcT,trT,paT,rhT,trapT,labelsT],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Daire Dilimleri ve Yaylar</h2>

<div class="calc-highlight"><strong>Daire dilimi, bir çemberden kesilmiş bir "pasta dilimi"dir.</strong> İki yarıçap ve çemberin bir yayı tarafından çevrelenir. Merkez açısı $\\theta$ ise (<em>radyan cinsinden</em>), yay uzunluğu ve daire dilimi alanının dikkat çekici biçimde basit formülleri vardır.</div>

<div class="calc-formula"><div class="formula-label">YAY UZUNLUĞU VE DİLİM ALANI</div><div class="formula-main">$$\\text{yay uzunluğu} \\;=\\; r\\,\\theta, \\qquad \\text{dilim alanı} \\;=\\; \\tfrac{1}{2}\\,r^2\\,\\theta$$</div><div class="formula-sub"><strong>&theta; radyan olmak zorunda.</strong> Derece cinsinden bir değerin varsa önce dönüştür: $\\theta_{\\text{rad}} = \\theta_{\\text{der}} \\cdot \\pi/180$.</div></div>

<p class="l-text">Bu formüller neden böyle? Tam çemberin açısı $2\\pi$, çevre uzunluğu $2\\pi r$, alanı $\\pi r^2$. $\\theta$ açılı bir dilim, bütünün $\\theta/(2\\pi)$ kesridir. Yani yay uzunluğu $(\\theta/(2\\pi)) \\cdot 2\\pi r = r\\theta$ ve alanı $(\\theta/(2\\pi)) \\cdot \\pi r^2 = \\tfrac{1}{2} r^2 \\theta$ olur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; DİLİM</div><div class="example-body">Yarıçapı 5 ve merkez açısı 60&deg; olan bir daire diliminin yay uzunluğunu ve alanını bul.<br><br>Önce dönüştür: $\\theta = 60^\\circ \\cdot \\pi/180 = \\pi/3$ rad.<br><br>Yay uzunluğu: $r\\theta = 5 \\cdot \\pi/3 = 5\\pi/3 \\approx 5.24$.<br><br>Dilim alanı: $\\tfrac{1}{2} r^2 \\theta = \\tfrac{1}{2} \\cdot 25 \\cdot \\pi/3 = 25\\pi/6 \\approx 13.09$.</div></div>

<div class="calc-graph"><div id="plot-l88-sector-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yarıçapı 5 ve merkez açısı 60&deg; (&pi;/3 rad) olan bir daire dilimi. Boyalı bölge dilim, kalın eğri yay, iki ince yarıçap ise düz kenarlardır. Bu resmi kullanarak "yay"ı (uzunluk) ve "dilim alanı"nı (alan) zihninde ayrı tut.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rT=5;var thMT=Math.PI/3;
var arcXt=[0];var arcYt=[0];
for(var i=0;i<=60;i++){var a=thMT*i/60;arcXt.push(rT*Math.cos(a));arcYt.push(rT*Math.sin(a));}
arcXt.push(0);arcYt.push(0);
var sectorT={x:arcXt,y:arcYt,mode:'lines',name:'dilim (boyalı)',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.2)'};
var arcOXt=[];var arcOYt=[];
for(var j=0;j<=60;j++){var b=thMT*j/60;arcOXt.push(rT*Math.cos(b));arcOYt.push(rT*Math.sin(b));}
var arcLT={x:arcOXt,y:arcOYt,mode:'lines',name:'yay (uzunluk = rθ)',line:{color:'#f59e0b',width:4}};
var radT1={x:[0,rT],y:[0,0],mode:'lines',name:'yarıçap',line:{color:'#10b981',width:2}};
var radT2={x:[0,rT*Math.cos(thMT)],y:[0,rT*Math.sin(thMT)],mode:'lines',name:'yarıçap',line:{color:'#10b981',width:2},showlegend:false};
var fXt=[];var fYt=[];
for(var k=0;k<=360;k++){var c=2*Math.PI*k/360;fXt.push(rT*Math.cos(c));fYt.push(rT*Math.sin(c));}
var fullRT={x:fXt,y:fYt,mode:'lines',name:'çember r=5',line:{color:'rgba(255,255,255,0.18)',width:1,dash:'dot'}};
var annT={x:[3.5,4],y:[0.6,1.5],mode:'text',name:'etiketler',text:['θ = 60° = π/3','yay'],textfont:{color:'#e8e8e8',size:12},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l88-sector-tr',[fullRT,sectorT,arcLT,radT1,radT2,annT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Bu bölümdeki en yaygın hata:</strong> $\\theta$'yı radyan yerine derece koymak. $r\\theta$ ve $\\tfrac{1}{2}r^2\\theta$ formülleri <em>yalnızca</em> radyan ile çalışır. Cevabın yaklaşık 57 (yani $180/\\pi$) çarpan kadar sapmışsa, dönüşümü unutmuşsundur.</div>

<h2 class="lesson-title">11. Bileşik Şekiller</h2>

<div class="calc-highlight"><strong>Gerçek şekiller nadiren tek bir ders kitabı çokgenidir.</strong> "L şeklinde" bir kat planı, üzerinde yarım çember bulunan bir pencere, köşesinde çeyrek çember olan bir bahçe yolu &mdash; bunların hepsi <em>bileşik şekillerdir</em>. Strateji her zaman aynıdır: şekli bildiğin parçalara böl, her parçanın alanını bul, sonra topla ya da çıkar.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 &mdash; Ayrıştır</div><div class="card-body">Şekli dikdörtgenlere, üçgenlere, çemberlere, dilimlere böl. Her parçayı ayrıca eskiz et.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 &mdash; Hesapla</div><div class="card-body">Her parçaya standart formülü uygula. Birimlere dikkat et.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 &mdash; Birleştir</div><div class="card-body">Şeklin içinde kalan parçaların alanlarını topla. Çıkarılan parçaları (delik / kesim) çıkar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; L ŞEKLİ</div><div class="example-body">L şeklinde bir zemin, 10 m &times; 8 m bir dikdörtgenin bir köşesinden 4 m &times; 3 m bir dikdörtgen kesilerek elde ediliyor. Alanı bul.<br><br>Büyük dikdörtgen: $10 \\cdot 8 = 80 \\text{ m}^2$.<br><br>Kesilen kısım: $4 \\cdot 3 = 12 \\text{ m}^2$.<br><br>L şeklinin alanı: $80 - 12 = \\mathbf{68 \\text{ m}^2}$.<br><br>L'yi iki dikdörtgene de ayırabilirsin ($10 \\cdot 5 + 6 \\cdot 3 = 50 + 18 = 68$) &mdash; aynı cevap.</div></div>

<div class="calc-graph"><div id="plot-l88-composite-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> L şekli (solid mavi sınır), 10&times;8 bir dikdörtgenden 4&times;3 bir kesim (kesik çizgili) çıkarılmış olarak çizilmiş. Kesik çizgili dikdörtgen, çıkarılan köşeyi gösterir. Aynı bileşik alan, iki farklı ayrıştırma: ya kesilen kısmı çıkar, ya da iki dolu alt-dikdörtgeni topla.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var lShapeXt=[0,10,10,4,4,0,0];var lShapeYt=[0,0,5,5,8,8,0];
var bigXt=[0,10,10,0,0];var bigYt=[0,0,8,8,0];
var cutXt=[4,10,10,4,4];var cutYt=[5,5,8,8,5];
var lFillT={x:lShapeXt,y:lShapeYt,mode:'lines',name:'L şekli (alan 68)',line:{color:'#3b82f6',width:3},fill:'toself',fillcolor:'rgba(59,130,246,0.18)'};
var bigOutT={x:bigXt,y:bigYt,mode:'lines',name:'büyük dikdörtgen 10×8 = 80',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dot'}};
var cutOutT={x:cutXt,y:cutYt,mode:'lines',name:'kesilen kısım 4×3 = 12',line:{color:'#ef4444',width:2,dash:'dash'},fill:'toself',fillcolor:'rgba(239,68,68,0.08)'};
var splitT={x:[0,10,null,4,4],y:[5,5,null,0,8],mode:'lines',name:'alternatif ayrıştırma',line:{color:'#f59e0b',width:1,dash:'dashdot'}};
var annsT={x:[5,7,2,7],y:[2.5,6.5,6.5,9.2],mode:'text',name:'etiketler',text:['10×5 = 50','&nbsp;','6×3 = 18','kesik çizgili alanı çıkar: 80 − 12 = 68'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var layCt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'metre',range:[-1,11.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'metre',range:[-1,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:-0.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l88-composite-tr',[lFillT,bigOutT,cutOutT,splitT,annsT],layCt,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Koordinat Alanı: Üçgen için Ayakkabı Bağı Formülü</h2>

<div class="calc-highlight"><strong>Bir üçgenin üç köşe koordinatını biliyorsan ama kenarları ya da açıları bilmiyorsan, ayakkabı bağı (shoelace) formülü alanı doğrudan hesaplar.</strong> Önce kenar uzunluğu bulmana gerek yok.</div>

<div class="calc-formula"><div class="formula-label">SHOELACE &mdash; ÜÇGEN</div><div class="formula-main">$$A \\;=\\; \\tfrac{1}{2}\\,\\big|\\, x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2) \\,\\big|$$</div><div class="formula-sub">Köşeler $(x_1,y_1), (x_2,y_2), (x_3,y_3)$. Mutlak değer var çünkü aynı formül işaretli bir alan verir (köşeler CCW ise pozitif, CW ise negatif).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; SHOELACE</div><div class="example-body">Köşeleri $A(0,0), B(4,0), C(1,3)$ olan üçgenin alanını bul.<br><br>Yerleştir: $x_1=0, y_1=0, x_2=4, y_2=0, x_3=1, y_3=3$.<br><br>$A = \\tfrac{1}{2}|0 \\cdot (0-3) + 4 \\cdot (3-0) + 1 \\cdot (0-0)| = \\tfrac{1}{2}|0 + 12 + 0| = \\mathbf{6}$.<br><br>$\\tfrac{1}{2}bh$ ile kontrol et: AB tabanının uzunluğu x-ekseni boyunca 4; C(1,3) noktasından x-eksenine olan dik yükseklik 3. Yani $A = \\tfrac{1}{2} \\cdot 4 \\cdot 3 = 6$. Aynı cevap.</div></div>

<h2 class="lesson-title">13. Yaygın Hatalar ve Tuzaklar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çevre ve alan birimlerini karıştırma</div><div class="card-body">Çevre cm, m, km cinsindedir. Alan cm&sup2;, m&sup2;, km&sup2; cinsindedir. Asla çevreyi cm&sup2; ya da alanı cm olarak verme.</div></div>
<div class="calc-card"><div class="card-title">Üçgen için 1/2'yi unutma</div><div class="card-body">Üçgen alanı $\\tfrac{1}{2}bh$'dir, $bh$ değil. 1/2 çarpanı geometrideki en çok unutulan sabittir.</div></div>
<div class="calc-card"><div class="card-title">Yay formüllerinde derece kullanma</div><div class="card-body">$r\\theta$ ve $\\tfrac{1}{2}r^2\\theta$ yalnızca radyanla çalışır. Önce dereceyi $\\times \\pi/180$ ile dönüştür.</div></div>
<div class="calc-card"><div class="card-title">Eğik kenarı yükseklik sanmak</div><div class="card-body">Paralelkenarlar, yamuklar ve üçgenler için "yükseklik" <em>dik</em> uzaklıktır, eğik kenar değil.</div></div>
<div class="calc-card"><div class="card-title">Shoelace'te mutlak değeri unutmak</div><div class="card-body">Shoelace formülü işaretli alan verir. Pozitif geometrik alanı almak için $|\\cdot|$ ile sar.</div></div>
<div class="calc-card"><div class="card-title">Aynı şekilde birim karıştırmak</div><div class="card-body">Bir kenar cm cinsinden, diğeri mm cinsindense, eklemeden önce dönüştür. Birim tüm hesaplama boyunca tek olmalı.</div></div>
</div>

<h2 class="lesson-title">14. Çözümlü Problemler</h2>

<p class="l-text">Derste işlenen her şeyi bir araya getiren kısa bir alıştırma seti. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; DİKDÖRTGEN</div><div class="example-body"><strong>Bir dikdörtgen 6 &times; 8 boyutlarındadır. Çevresini ve alanını bul.</strong><br><br>$P = 2(6 + 8) = 2 \\cdot 14 = \\mathbf{28}$. $A = 6 \\cdot 8 = \\mathbf{48}$. Birim: P uzunluk, A uzunluk karesi.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ÜÇGEN (HERON)</div><div class="example-body"><strong>Bir üçgenin kenarları 5, 6, 7. Alanını bul.</strong><br><br>$s = (5+6+7)/2 = 9$. $A = \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = \\mathbf{6\\sqrt{6}} \\approx 14.70$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; ÇEMBER</div><div class="example-body"><strong>Yarıçapı 3 olan bir çemberin C ve A değerlerini bul.</strong><br><br>$C = 2\\pi \\cdot 3 = \\mathbf{6\\pi} \\approx 18.85$. $A = \\pi \\cdot 9 = \\mathbf{9\\pi} \\approx 28.27$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; DİLİM</div><div class="example-body"><strong>Bir daire diliminin yarıçapı 5 ve merkez açısı 60&deg;. Yay uzunluğunu ve dilim alanını bul.</strong><br><br>Dönüştür: $\\theta = \\pi/3$. Yay: $5 \\cdot \\pi/3 = \\mathbf{5\\pi/3}$. Alan: $\\tfrac{1}{2} \\cdot 25 \\cdot \\pi/3 = \\mathbf{25\\pi/6}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; YAMUK</div><div class="example-body"><strong>Bir yamuğun paralel kenarları 12 ve 8, yüksekliği 5. Alanını bul.</strong><br><br>$A = \\tfrac{1}{2}(12 + 8) \\cdot 5 = \\tfrac{1}{2} \\cdot 20 \\cdot 5 = \\mathbf{50}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; KAK ÜÇGEN</div><div class="example-body"><strong>Bir üçgenin iki kenarı 6 ve 10, aralarındaki açı 30&deg;. Alanını bul.</strong><br><br>$A = \\tfrac{1}{2} \\cdot 6 \\cdot 10 \\cdot \\sin 30^\\circ = \\tfrac{1}{2} \\cdot 60 \\cdot \\tfrac{1}{2} = \\mathbf{15}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; EŞKENAR DÖRTGEN</div><div class="example-body"><strong>Bir eşkenar dörtgenin köşegenleri 10 ve 24. Alanını ve kenar uzunluğunu bul.</strong><br><br>$A = \\tfrac{1}{2} \\cdot 10 \\cdot 24 = \\mathbf{120}$. Köşegenler dik açıyla kesişir, yani her kenar $\\sqrt{5^2 + 12^2} = 13$'tür. Çevre $P = 4 \\cdot 13 = 52$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SHOELACE</div><div class="example-body"><strong>Köşeleri (1,1), (5,2), (3,6) olan üçgenin alanını bul.</strong><br><br>$A = \\tfrac{1}{2}|1(2-6) + 5(6-1) + 3(1-2)| = \\tfrac{1}{2}|-4 + 25 - 3| = \\tfrac{1}{2} \\cdot 18 = \\mathbf{9}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çevre bir uzunluktur (cm, m, ...); alan bir uzunluk karesidir (cm&sup2;, m&sup2;, ...)</li>
<li>Üçgen: $P = a+b+c$; $A = \\tfrac{1}{2}bh = \\tfrac{1}{2}ab\\sin C = \\sqrt{s(s-a)(s-b)(s-c)}$</li>
<li>Kare / dikdörtgen: $P = 4s$ ya da $2(\\ell+w)$; $A = s^2$ ya da $\\ell w$</li>
<li>Paralelkenar: $A = bh$ (dik yükseklik, eğik kenar değil)</li>
<li>Eşkenar dörtgen / deltoid: $A = \\tfrac{1}{2}d_1 d_2$ (köşegenler dik)</li>
<li>Yamuk: $A = \\tfrac{1}{2}(a+c)h$ (paralel kenarların ortalaması)</li>
<li>Düzgün n-gen: $P = ns$; $A = \\tfrac{1}{2}\\,a\\,P$, burada $a$ apothem</li>
<li>Çember: $C = 2\\pi r$; $A = \\pi r^2$</li>
<li>Merkez açısı $\\theta$ radyan olan dilim: yay $= r\\theta$, alan $= \\tfrac{1}{2}r^2\\theta$</li>
<li>Bileşik şekiller: bilinen parçalara ayır, sonra topla ya da çıkar</li>
<li>Köşelerden üçgen: shoelace formülü $A = \\tfrac{1}{2}|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|$</li>
</ul>
</div>`
};
