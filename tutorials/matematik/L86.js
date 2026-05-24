window.LISE_MAT_L86 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A quadrilateral is the simplest closed polygon after the triangle.</strong> Four sides, four vertices, four interior angles — and an extraordinary amount of structure hiding inside that small description. Tables, picture frames, windows, kites, road signs, the screens you read this on: nearly every flat shape in the human-made world is a quadrilateral or built from quadrilaterals. Once you can name the five major types and recall their properties on demand, a huge portion of plane geometry becomes routine.</p>

<p class="l-text">This lesson builds a small family tree of quadrilaterals (trapezoid, parallelogram, rectangle, rhombus, square), states each member's defining property, derives the area formulas geometrically, and gives you enough worked examples to recognise any quadrilateral at sight. By the end you should be able to look at a four-sided figure with one pair of right angles and say within a second whether it is forced to be a rectangle, and look at one with perpendicular diagonals and decide whether it must be a rhombus or merely a kite.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a quadrilateral and prove that the interior angles of any quadrilateral sum to 360&deg;</li>
<li>Recognise the five major types (trapezoid, parallelogram, rectangle, rhombus, square) and the special case of a kite</li>
<li>State the side, angle, and diagonal properties of each type and use them in proofs</li>
<li>Apply the area formulas: <em>A = base &times; height</em> for parallelograms, <em>A = (d&#8321; &middot; d&#8322;)/2</em> for rhombi and kites, and the midsegment formula for trapezoids</li>
<li>Place quadrilaterals in their correct hierarchy (every square is a rectangle, every rectangle is a parallelogram, etc.) and explain why the converse fails</li>
<li>Solve numerical problems involving sides, angles, diagonals, and areas</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Quadrilateral?</h2>

<div class="calc-highlight"><strong>A quadrilateral is a closed plane figure bounded by four straight line segments.</strong> The segments are the <em>sides</em>, the endpoints where two sides meet are the <em>vertices</em>, and the inside corners are the <em>interior angles</em>. No more, no less.</div>

<p class="l-text">Label the vertices in order around the figure as $A, B, C, D$. Then $AB, BC, CD, DA$ are the four sides. Two sides are <strong>adjacent</strong> if they share a vertex (for example, $AB$ and $BC$), and <strong>opposite</strong> if they do not (for example, $AB$ and $CD$). The same words apply to angles: $\\angle A$ and $\\angle B$ are adjacent; $\\angle A$ and $\\angle C$ are opposite.</p>

<div class="calc-formula"><div class="formula-label">SUM OF INTERIOR ANGLES</div><div class="formula-main">$$\\angle A + \\angle B + \\angle C + \\angle D \\;=\\; 360^\\circ$$</div><div class="formula-sub">This holds for every simple (non-self-intersecting) quadrilateral, convex or not.</div></div>

<p class="l-text"><strong>Why 360&deg;?</strong> Draw the diagonal $AC$. The quadrilateral splits into two triangles, $ABC$ and $ACD$. Each triangle's interior angles sum to 180&deg;, so together $2 \\times 180^\\circ = 360^\\circ$. Every interior angle of the quadrilateral is built from pieces of these two triangle-angle totals, and the pieces add up exactly to 360&deg;. That argument generalises: the interior-angle sum of an $n$-gon is $(n-2) \\times 180^\\circ$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sides</div><div class="card-body">Four straight segments. We write side lengths as $|AB|, |BC|, |CD|, |DA|$ or simply $a, b, c, d$.</div></div>
<div class="calc-card"><div class="card-title">Diagonals</div><div class="card-body">The two segments joining opposite vertices: $AC$ and $BD$. Their length, intersection point, and angle of crossing carry a huge amount of information about the type.</div></div>
<div class="calc-card"><div class="card-title">Angles</div><div class="card-body">Four interior angles, always summing to 360&deg;. In a <em>convex</em> quadrilateral each is less than 180&deg;.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A quadrilateral has three of its angles measuring 80&deg;, 95&deg;, and 110&deg;. What must the fourth angle be? (Answer: $360 - 80 - 95 - 110 = 75^\\circ$.)</div></div>

<h2 class="lesson-title">2. The Family Tree: Five Major Types</h2>

<div class="calc-highlight"><strong>The quadrilateral family is a strict hierarchy.</strong> A trapezoid is the most general (only one pair of parallel sides required); a parallelogram is a special trapezoid (both pairs parallel); a rectangle is a special parallelogram (all four angles right); a rhombus is a different special parallelogram (all four sides equal); and a square sits at the very bottom as the intersection of rectangle and rhombus.</div>

<p class="l-text">It is essential to learn the hierarchy in this order, because every property that holds for a parent class automatically holds for its descendants. Whatever is true of every parallelogram is true of every rectangle, rhombus, and square. Whatever is true of every rectangle is true of every square. The converse fails: not every parallelogram is a rectangle. Knowing the direction of inheritance saves you from re-proving the same fact again and again.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trapezoid</div><div class="card-body"><em>At least one pair</em> of opposite sides parallel. (Turkish/UK: this is the inclusive definition; some US textbooks insist on exactly one pair.)</div></div>
<div class="calc-card"><div class="card-title">Parallelogram</div><div class="card-body"><em>Both pairs</em> of opposite sides parallel. Equivalent: opposite sides equal in length; or opposite angles equal; or diagonals bisect each other.</div></div>
<div class="calc-card"><div class="card-title">Rectangle</div><div class="card-body">A parallelogram with one (hence all four) right angles. Equivalently: a parallelogram with equal diagonals.</div></div>
<div class="calc-card"><div class="card-title">Rhombus</div><div class="card-body">A parallelogram with all four sides equal. Equivalently: a parallelogram with perpendicular diagonals.</div></div>
<div class="calc-card"><div class="card-title">Square</div><div class="card-body">A quadrilateral that is both a rectangle and a rhombus. Four equal sides <em>and</em> four right angles.</div></div>
</div>

<div class="calc-graph"><div id="plot-l86-tree-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the inheritance tree of quadrilateral types. Each box is a class; arrows point from a special case to the more general parent. A square inherits everything from both rectangle and rhombus, which both inherit from parallelogram, which inherits from trapezoid, which inherits from the generic quadrilateral at the top.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodesX=[3,3,3,2,4,3];
var nodesY=[5,4,3,2,2,1];
var nodesT=['Quadrilateral','Trapezoid','Parallelogram','Rectangle','Rhombus','Square'];
var nodes={x:nodesX,y:nodesY,mode:'markers+text',name:'classes',marker:{color:'#3b82f6',size:42,line:{color:'#0a0a0a',width:2}},text:nodesT,textfont:{color:'#e8e8e8',size:11},textposition:'middle center'};
var edges={x:[3,3,null,3,3,null,3,2,null,3,4,null,2,3,null,4,3,null],y:[5,4,null,4,3,null,3,2,null,3,2,null,2,1,null,2,1,null],mode:'lines',name:'is-a',line:{color:'rgba(245,158,11,0.55)',width:2}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[0.5,5.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[0.4,5.6],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l86-tree-en',[edges,nodes],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Visual mnemonic:</strong> picture the hierarchy as a pyramid with the quadrilateral at the apex (most general) and the square at the base (most specialised). Each step down adds a new condition — "now both pairs parallel," "now all angles right," "now all sides equal."</div>

<h2 class="lesson-title">3. The Trapezoid (Yamuk)</h2>

<div class="calc-highlight"><strong>A trapezoid has one pair of parallel sides.</strong> The two parallel sides are called the <em>bases</em>; the other two are the <em>legs</em>. If the legs are equal in length the trapezoid is <em>isosceles</em>, and the two angles at each base are equal.</div>

<p class="l-text">Label the bases $a$ (longer) and $c$ (shorter), and the perpendicular distance between them $h$. The <strong>midsegment</strong> (the segment joining the midpoints of the two legs) is parallel to both bases and its length is the average of the bases:</p>

<div class="calc-formula"><div class="formula-label">MIDSEGMENT OF A TRAPEZOID</div><div class="formula-main">$$m \\;=\\; \\frac{a + c}{2}$$</div><div class="formula-sub">The midsegment lies exactly halfway between the bases and is parallel to both.</div></div>

<div class="calc-formula"><div class="formula-label">AREA OF A TRAPEZOID</div><div class="formula-main">$$A \\;=\\; \\frac{a + c}{2} \\cdot h \\;=\\; m \\cdot h$$</div><div class="formula-sub">Average base length times the height between the bases. Equivalently, the midsegment times the height.</div></div>

<p class="l-text"><strong>Why this formula?</strong> Take two identical copies of the trapezoid. Flip one upside down and glue it to the other along a leg. The result is a parallelogram with base $a + c$ and height $h$, so its area is $(a+c) \\cdot h$. Half of that is the area of one trapezoid: $\\frac{(a+c)\\,h}{2}$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A trapezoid has parallel sides of length 5 and 9 and the perpendicular distance between them is 4. Find its area.<br><br>$A = \\dfrac{5+9}{2} \\cdot 4 = 7 \\cdot 4 = \\mathbf{28}$ square units. The midsegment has length 7.</div></div>

<h2 class="lesson-title">4. The Parallelogram (Paralelkenar)</h2>

<div class="calc-highlight"><strong>A parallelogram has both pairs of opposite sides parallel.</strong> That single condition forces a long list of consequences, all of which are equivalent to the definition.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Opposite sides equal</div><div class="card-body">$|AB| = |CD|$ and $|BC| = |DA|$.</div></div>
<div class="calc-card"><div class="card-title">Opposite angles equal</div><div class="card-body">$\\angle A = \\angle C$ and $\\angle B = \\angle D$.</div></div>
<div class="calc-card"><div class="card-title">Consecutive angles supplementary</div><div class="card-body">$\\angle A + \\angle B = 180^\\circ$ (and similarly for the other adjacent pairs).</div></div>
<div class="calc-card"><div class="card-title">Diagonals bisect each other</div><div class="card-body">The two diagonals $AC$ and $BD$ meet at a single point that divides each one into two equal halves.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">AREA OF A PARALLELOGRAM</div><div class="formula-main">$$A \\;=\\; b \\cdot h$$</div><div class="formula-sub">Base times perpendicular height. The height is measured perpendicular to the chosen base, not along the slanted side.</div></div>

<p class="l-text"><strong>Why this formula?</strong> Slide a right triangle off one end of the parallelogram and onto the other. You get a rectangle with the same base $b$ and the same height $h$. Rectangles have area $b \\cdot h$, so the parallelogram does too.</p>

<div class="l-note"><strong>Watch out:</strong> the slanted side is <em>not</em> the height. If a parallelogram has base 10 and slanted side 6 at an angle of 30&deg; to the base, the height is $6 \\sin 30^\\circ = 3$, not 6. Area is $10 \\cdot 3 = 30$, not $10 \\cdot 6 = 60$.</div>

<h2 class="lesson-title">5. The Rectangle (Dikdörtgen)</h2>

<div class="calc-highlight"><strong>A rectangle is a parallelogram with one right angle.</strong> Once one angle is 90&deg;, the parallelogram property forces all four to be 90&deg;. So "rectangle" and "parallelogram with all right angles" are the same class.</div>

<p class="l-text">A rectangle inherits every parallelogram property and adds two of its own:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">All four angles right</div><div class="card-body">$\\angle A = \\angle B = \\angle C = \\angle D = 90^\\circ$.</div></div>
<div class="calc-card"><div class="card-title">Diagonals equal in length</div><div class="card-body">$|AC| = |BD|$. (In a generic parallelogram the diagonals are not equal.) This is what most quickly distinguishes a rectangle from a non-rectangular parallelogram.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">AREA AND DIAGONAL OF A RECTANGLE</div><div class="formula-main">$$A \\;=\\; \\ell \\cdot w \\qquad d \\;=\\; \\sqrt{\\ell^{2} + w^{2}}$$</div><div class="formula-sub">Length times width. The diagonal comes from the Pythagorean theorem applied to a right triangle formed by two sides and the diagonal.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A rectangle has sides 6 and 8. Find its diagonal.<br><br>$d = \\sqrt{6^{2} + 8^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$.<br><br>This is the famous 6-8-10 right triangle (twice a 3-4-5).</div></div>

<h2 class="lesson-title">6. The Rhombus (Eşkenar Dörtgen) and the Square (Kare)</h2>

<div class="calc-highlight"><strong>A rhombus is a parallelogram with all four sides equal.</strong> Equivalently, a parallelogram whose diagonals are perpendicular. A square is what you get when those two conditions both hold together with right angles — a rhombus and a rectangle at the same time.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rhombus — all sides equal</div><div class="card-body">$|AB| = |BC| = |CD| = |DA|$. The four sides have a common length, often called $s$.</div></div>
<div class="calc-card"><div class="card-title">Rhombus — perpendicular diagonals</div><div class="card-body">$AC \\perp BD$. They cross at right angles and bisect each other.</div></div>
<div class="calc-card"><div class="card-title">Rhombus — diagonals bisect angles</div><div class="card-body">Each diagonal cuts the two opposite vertex angles into equal halves.</div></div>
<div class="calc-card"><div class="card-title">Square — all of the above</div><div class="card-body">Sides equal, angles right, diagonals equal <em>and</em> perpendicular.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">AREA OF A RHOMBUS (TWO FORMULAS)</div><div class="formula-main">$$A \\;=\\; \\frac{d_{1} \\cdot d_{2}}{2} \\qquad\\text{or}\\qquad A \\;=\\; s \\cdot h$$</div><div class="formula-sub">Half the product of the diagonals, or side times perpendicular height (since a rhombus is a parallelogram).</div></div>

<div class="calc-formula"><div class="formula-label">AREA AND DIAGONAL OF A SQUARE</div><div class="formula-main">$$A \\;=\\; s^{2} \\qquad d \\;=\\; s\\sqrt{2}$$</div><div class="formula-sub">Side squared. The diagonal comes from Pythagoras with both legs equal to $s$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A rhombus has diagonals of length 10 and 24. Find its area and its side length.<br><br>Area: $A = \\dfrac{10 \\cdot 24}{2} = \\mathbf{120}$.<br><br>Side: the diagonals bisect each other at right angles, so each side is the hypotenuse of a right triangle with legs 5 and 12. Therefore $s = \\sqrt{5^{2} + 12^{2}} = \\sqrt{169} = \\mathbf{13}$.</div></div>

<h2 class="lesson-title">7. The Kite (Deltoid)</h2>

<div class="calc-highlight"><strong>A kite is a quadrilateral with two pairs of adjacent equal sides</strong> — not opposite, but next to each other. The diagonals are perpendicular, and one of them is the perpendicular bisector of the other.</div>

<p class="l-text">A kite is not a parallelogram (its opposite sides are not parallel in general), but it shares with the rhombus the property that its diagonals cross at right angles. That gives it the same area formula:</p>

<div class="calc-formula"><div class="formula-label">AREA OF A KITE</div><div class="formula-main">$$A \\;=\\; \\frac{d_{1} \\cdot d_{2}}{2}$$</div><div class="formula-sub">Half the product of the diagonals — the same formula as for a rhombus, because both are special cases of "quadrilateral with perpendicular diagonals."</div></div>

<div class="calc-graph"><div id="plot-l86-types-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the five most important quadrilateral types drawn side by side at the same scale — a trapezoid, a parallelogram, a rectangle, a rhombus, and a square. Compare the side lengths, angles, and diagonals at a glance.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var trX=[0.2,1.8,1.5,0.5,0.2],trY=[0.2,0.2,1.2,1.2,0.2];
var paX=[2.4,4.0,4.4,2.8,2.4],paY=[0.2,0.2,1.2,1.2,0.2];
var rcX=[4.8,6.4,6.4,4.8,4.8],rcY=[0.2,0.2,1.2,1.2,0.2];
var rhX=[7.4,8.0,7.4,6.8,7.4],rhY=[0.2,0.7,1.2,0.7,0.2];
var sqX=[8.6,9.6,9.6,8.6,8.6],sqY=[0.2,0.2,1.2,1.2,0.2];
var labels={x:[1.0,3.4,5.6,7.4,9.1],y:[1.55,1.55,1.55,1.55,1.55],mode:'text',text:['Trapezoid','Parallelogram','Rectangle','Rhombus','Square'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var tr={x:trX,y:trY,mode:'lines',name:'trapezoid',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var pa={x:paX,y:paY,mode:'lines',name:'parallelogram',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var rc={x:rcX,y:rcY,mode:'lines',name:'rectangle',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var rh={x:rhX,y:rhY,mode:'lines',name:'rhombus',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var sq={x:sqX,y:sqY,mode:'lines',name:'square',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.2,10.0],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[0,1.8],showgrid:false,zeroline:false,showticklabels:false},margin:{t:20,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l86-types-en',[tr,pa,rc,rh,sq,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Diagonals: A Quick Comparison</h2>

<div class="calc-highlight"><strong>The diagonals tell you the type at a glance.</strong> Equal length signals a rectangle; perpendicular signals a rhombus or kite; both equal and perpendicular signals a square. Knowing this saves a lot of work in geometry problems.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Type</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Bisect?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Equal?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Perpendicular?</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Parallelogram</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">no</td><td style="padding:0.5rem 0.8rem">no</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Rectangle</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">no</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Rhombus</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">no</td><td style="padding:0.5rem 0.8rem">yes</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Square</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">yes</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Trapezoid (isosceles)</td><td style="padding:0.5rem 0.8rem">no</td><td style="padding:0.5rem 0.8rem">yes</td><td style="padding:0.5rem 0.8rem">no</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Kite</td><td style="padding:0.5rem 0.8rem">one bisects the other</td><td style="padding:0.5rem 0.8rem">no</td><td style="padding:0.5rem 0.8rem">yes</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l86-diag-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three contrasting diagonal arrangements. The rectangle on the left has equal diagonals that bisect but are not perpendicular. The rhombus in the middle has perpendicular bisecting diagonals of unequal length. The kite on the right has perpendicular diagonals, but only one of them is bisected by the other.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rcX=[0.2,2.6,2.6,0.2,0.2],rcY=[0.3,0.3,1.5,1.5,0.3];
var rcD1={x:[0.2,2.6],y:[0.3,1.5],mode:'lines',name:'rc d1',line:{color:'#f59e0b',width:2.2}};
var rcD2={x:[0.2,2.6],y:[1.5,0.3],mode:'lines',name:'rc d2',line:{color:'#f59e0b',width:2.2}};
var rcShape={x:rcX,y:rcY,mode:'lines',name:'rectangle',line:{color:'#3b82f6',width:2.5}};
var rhCX=4.5,rhCY=0.9;
var rhX=[rhCX-1.2,rhCX,rhCX+1.2,rhCX,rhCX-1.2],rhY=[rhCY,rhCY+0.6,rhCY,rhCY-0.6,rhCY];
var rhD1={x:[rhCX-1.2,rhCX+1.2],y:[rhCY,rhCY],mode:'lines',name:'rh d1',line:{color:'#f59e0b',width:2.2}};
var rhD2={x:[rhCX,rhCX],y:[rhCY-0.6,rhCY+0.6],mode:'lines',name:'rh d2',line:{color:'#f59e0b',width:2.2}};
var rhShape={x:rhX,y:rhY,mode:'lines',name:'rhombus',line:{color:'#3b82f6',width:2.5}};
var ktCX=8.0;
var ktX=[ktCX,ktCX+0.8,ktCX,ktCX-0.8,ktCX],ktY=[1.6,0.9,0.1,0.9,1.6];
var ktD1={x:[ktCX,ktCX],y:[0.1,1.6],mode:'lines',name:'kt d1',line:{color:'#f59e0b',width:2.2}};
var ktD2={x:[ktCX-0.8,ktCX+0.8],y:[0.9,0.9],mode:'lines',name:'kt d2',line:{color:'#f59e0b',width:2.2}};
var ktShape={x:ktX,y:ktY,mode:'lines',name:'kite',line:{color:'#3b82f6',width:2.5}};
var labs={x:[1.4,4.5,8.0],y:[-0.05,-0.05,-0.05],mode:'text',text:['Rectangle: equal, bisect','Rhombus: perp, bisect','Kite: perp, one bisects'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.3,9.5],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-0.4,2.0],showgrid:false,zeroline:false,showticklabels:false},margin:{t:20,r:20,b:30,l:20},showlegend:false};
Plotly.newPlot('plot-l86-diag-en',[rcShape,rcD1,rcD2,rhShape,rhD1,rhD2,ktShape,ktD1,ktD2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Worked Examples</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — TRAPEZOID AREA</div><div class="example-body">A trapezoid has parallel sides of length 5 and 9, and the distance between them is 4. Find the area and the midsegment.<br><br>Midsegment: $m = \\dfrac{5+9}{2} = 7$.<br><br>Area: $A = m \\cdot h = 7 \\cdot 4 = \\mathbf{28}$ square units.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — RECTANGLE DIAGONAL</div><div class="example-body">Find the diagonal of a rectangle with sides 6 and 8.<br><br>$d = \\sqrt{6^{2} + 8^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$. (Classic 6-8-10 triangle.)</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — RHOMBUS SIDE FROM DIAGONALS</div><div class="example-body">A rhombus has diagonals 10 and 24. Find its side.<br><br>The diagonals bisect each other at right angles, so each side is the hypotenuse of a right triangle with legs 5 and 12. $s = \\sqrt{5^{2}+12^{2}} = \\sqrt{169} = \\mathbf{13}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — PROOF</div><div class="example-body"><strong>Prove that a parallelogram with one right angle is a rectangle.</strong><br><br>Let the parallelogram be $ABCD$ with $\\angle A = 90^\\circ$. In any parallelogram $\\angle A + \\angle B = 180^\\circ$ (consecutive angles supplementary), so $\\angle B = 90^\\circ$. Also $\\angle A = \\angle C$ (opposite angles equal), so $\\angle C = 90^\\circ$. Finally $\\angle B = \\angle D = 90^\\circ$. All four angles are right, so $ABCD$ is a rectangle. <strong>QED</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 — SQUARE DIAGONAL</div><div class="example-body">A square has side length 7. Find its diagonal.<br><br>$d = s\\sqrt{2} = 7\\sqrt{2} \\approx \\mathbf{9.90}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6 — MISSING ANGLE</div><div class="example-body">In quadrilateral $ABCD$, $\\angle A = 70^\\circ$, $\\angle B = 110^\\circ$, $\\angle C = 80^\\circ$. Find $\\angle D$ and identify the type if $AB \\parallel CD$.<br><br>$\\angle D = 360 - 70 - 110 - 80 = \\mathbf{100^\\circ}$.<br><br>Since $\\angle A + \\angle B = 180^\\circ$ and $AB \\parallel CD$, the figure has at least one pair of parallel sides &mdash; it is a trapezoid. The other pair is not forced to be parallel, so we cannot upgrade it to a parallelogram from the given data.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7 — KITE AREA</div><div class="example-body">A kite has diagonals 12 and 16. Find the area.<br><br>$A = \\dfrac{d_{1} d_{2}}{2} = \\dfrac{12 \\cdot 16}{2} = \\mathbf{96}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8 — PARALLELOGRAM AREA</div><div class="example-body">A parallelogram has base 10 and slanted side 6 making an angle of 30&deg; with the base. Find its area.<br><br>Height: $h = 6 \\sin 30^\\circ = 6 \\cdot 0.5 = 3$.<br><br>Area: $A = b \\cdot h = 10 \\cdot 3 = \\mathbf{30}$.</div></div>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">CORRECT</div><div class="compare-item">Every square is a rectangle (and a rhombus, and a parallelogram, and a trapezoid).</div><div class="compare-item">For parallelogram area, use the perpendicular height, not the slanted side.</div><div class="compare-item">Trapezoid area = (sum of parallel sides) &divide; 2 &times; height.</div><div class="compare-item">Rhombus diagonals bisect each other <em>and</em> are perpendicular.</div></div><div class="compare-col"><div class="compare-title">WRONG</div><div class="compare-item">Saying "a rhombus is not a parallelogram" &mdash; every rhombus is a parallelogram.</div><div class="compare-item">Using the slanted side as height in a parallelogram. That overcounts the area.</div><div class="compare-item">Writing trapezoid area as $a \\cdot c \\cdot h$ or $(a+c)\\cdot h$ (forgetting the divide-by-2).</div><div class="compare-item">Calling a parallelogram a rhombus just because its sides "look equal" &mdash; check the lengths.</div></div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Quadrilateral = closed 4-sided polygon; interior angles sum to 360&deg;</li>
<li>Hierarchy: quadrilateral &supe; trapezoid &supe; parallelogram &supe; {rectangle, rhombus} &supe; square</li>
<li>Parallelogram: opposite sides equal, opposite angles equal, diagonals bisect each other</li>
<li>Rectangle: parallelogram + right angles &rArr; equal diagonals</li>
<li>Rhombus: parallelogram + equal sides &rArr; perpendicular diagonals that bisect angles</li>
<li>Square: rectangle &cap; rhombus</li>
<li>Areas: parallelogram $b\\,h$; rectangle $\\ell\\,w$; rhombus and kite $\\tfrac{d_{1}d_{2}}{2}$; square $s^{2}$; trapezoid $\\tfrac{(a+c)}{2}\\,h$</li>
<li>Key diagnostic: equal diagonals &rArr; rectangle; perpendicular diagonals &rArr; rhombus (or kite)</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Dörtgen, üçgenden sonraki en basit kapalı çokgendir.</strong> Dört kenar, dört köşe, dört iç açı &mdash; ve bu küçük tanımın içinde gizlenmiş olağanüstü miktarda yapı. Masalar, resim çerçeveleri, pencereler, uçurtmalar, yol işaretleri, bu yazıyı okuduğunuz ekran: insan yapımı dünyadaki neredeyse her düz şekil bir dörtgendir ya da dörtgenlerden inşa edilmiştir. Beş ana türü adlandırıp özelliklerini istek üzerine hatırlayabildiğinde, düzlem geometrisinin büyük bir kısmı rutin hale gelir.</p>

<p class="l-text">Bu ders küçük bir dörtgen soyağacı kuruyor (yamuk, paralelkenar, dikdörtgen, eşkenar dörtgen, kare), her üyenin tanımlayıcı özelliğini ifade ediyor, alan formüllerini geometrik olarak türetiyor ve herhangi bir dört kenarlı şekli ilk bakışta tanımana yetecek kadar çözümlü örnek veriyor. Sonunda, bir çift dik açısı olan bir dörtgene bakıp bir saniye içinde "bu dikdörtgen olmak zorunda mı?" sorusunu cevaplayabilmeli, köşegenleri dik olan bir dörtgene bakıp "eşkenar dörtgen mi yoksa sadece deltoid mi?" diyebilmelisin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dörtgeni tanımla ve herhangi bir dörtgenin iç açılarının 360&deg; topladığını kanıtla</li>
<li>Beş ana türü (yamuk, paralelkenar, dikdörtgen, eşkenar dörtgen, kare) ve özel deltoid (uçurtma) durumunu tanı</li>
<li>Her türün kenar, açı ve köşegen özelliklerini ifade et ve kanıtlarda kullan</li>
<li>Alan formüllerini uygula: paralelkenar için <em>A = taban &times; yükseklik</em>, eşkenar dörtgen ve deltoid için <em>A = (d&#8321; &middot; d&#8322;)/2</em>, yamuk için orta taban formülü</li>
<li>Dörtgenleri doğru hiyerarşiye yerleştir (her kare bir dikdörtgendir, her dikdörtgen bir paralelkenardır) ve tersinin neden tutmadığını açıkla</li>
<li>Kenar, açı, köşegen ve alanları içeren sayısal problemleri çöz</li>
</ul>
</div>

<h2 class="lesson-title">1. Dörtgen Nedir?</h2>

<div class="calc-highlight"><strong>Dörtgen, dört doğru parçası ile sınırlanmış kapalı bir düzlem şeklidir.</strong> Parçalar <em>kenarlar</em>, iki kenarın buluştuğu uç noktalar <em>köşeler</em>, içte oluşan köşeler ise <em>iç açılardır</em>. Daha fazlası ya da azı yok.</div>

<p class="l-text">Köşeleri şekil etrafında sırayla $A, B, C, D$ olarak etiketle. O zaman $AB, BC, CD, DA$ dört kenardır. İki kenar bir köşeyi paylaşıyorsa <strong>komşu</strong>dur (örneğin $AB$ ve $BC$); paylaşmıyorsa <strong>karşıt</strong>tır (örneğin $AB$ ve $CD$). Aynı kelimeler açılar için de geçerlidir: $\\angle A$ ile $\\angle B$ komşudur; $\\angle A$ ile $\\angle C$ karşıttır.</p>

<div class="calc-formula"><div class="formula-label">İÇ AÇILAR TOPLAMI</div><div class="formula-main">$$\\angle A + \\angle B + \\angle C + \\angle D \\;=\\; 360^\\circ$$</div><div class="formula-sub">Her basit (kendi kendiyle kesişmeyen) dörtgen için geçerlidir, dışbükey olsun ya da olmasın.</div></div>

<p class="l-text"><strong>Neden 360&deg;?</strong> $AC$ köşegenini çiz. Dörtgen iki üçgene ayrılır: $ABC$ ve $ACD$. Her üçgenin iç açıları 180&deg; topladığı için, ikisi birlikte $2 \\times 180^\\circ = 360^\\circ$ verir. Dörtgenin her iç açısı bu iki üçgenin açı toplamlarının parçalarından oluşur ve parçalar tam 360&deg;'ye toplanır. Bu kanıt genelleşir: bir $n$-genin iç açıları toplamı $(n-2) \\times 180^\\circ$'dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kenarlar</div><div class="card-body">Dört doğru parçası. Kenar uzunluklarını $|AB|, |BC|, |CD|, |DA|$ ya da kısaca $a, b, c, d$ olarak yazarız.</div></div>
<div class="calc-card"><div class="card-title">Köşegenler</div><div class="card-body">Karşıt köşeleri birleştiren iki parça: $AC$ ve $BD$. Uzunlukları, kesişim noktaları ve kesişim açıları, türü hakkında çok büyük bilgi taşır.</div></div>
<div class="calc-card"><div class="card-title">Açılar</div><div class="card-body">Dört iç açı, daima 360&deg; toplar. <em>Dışbükey</em> bir dörtgende her biri 180&deg;'den küçüktür.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir dörtgenin üç açısı 80&deg;, 95&deg; ve 110&deg; ölçülerinde. Dördüncü açı ne olmalı? (Cevap: $360 - 80 - 95 - 110 = 75^\\circ$.)</div></div>

<h2 class="lesson-title">2. Soyağacı: Beş Ana Tür</h2>

<div class="calc-highlight"><strong>Dörtgen ailesi katı bir hiyerarşidir.</strong> Yamuk en geneldir (yalnızca bir çift paralel kenar gerekir); paralelkenar özel bir yamuktur (her iki çift de paralel); dikdörtgen özel bir paralelkenardır (dört açı da dik); eşkenar dörtgen farklı bir özel paralelkenardır (dört kenar da eşit); kare ise en altta, dikdörtgen ve eşkenar dörtgenin kesişimi olarak durur.</div>

<p class="l-text">Bu sırada hiyerarşiyi öğrenmek şarttır, çünkü bir üst sınıf için geçerli olan her özellik otomatik olarak alt sınıfları için de geçerlidir. Her paralelkenar için doğru olan, her dikdörtgen, eşkenar dörtgen ve kare için de doğrudur. Her dikdörtgen için doğru olan, her kare için de doğrudur. Tersi tutmaz: her paralelkenar dikdörtgen değildir. Kalıtım yönünü bilmek seni aynı gerçeği tekrar tekrar kanıtlamaktan kurtarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yamuk</div><div class="card-body"><em>En az bir çift</em> karşıt kenar paraleldir. (Türkiye/Birleşik Krallık: kapsayıcı tanım; bazı ABD ders kitapları "tam olarak bir çift" der.)</div></div>
<div class="calc-card"><div class="card-title">Paralelkenar</div><div class="card-body"><em>Her iki çift</em> karşıt kenar da paraleldir. Eşdeğer: karşıt kenarlar eşit; ya da karşıt açılar eşit; ya da köşegenler birbirini ortalar.</div></div>
<div class="calc-card"><div class="card-title">Dikdörtgen</div><div class="card-body">Bir (dolayısıyla dört) dik açıya sahip paralelkenar. Eşdeğer: köşegenleri eşit olan paralelkenar.</div></div>
<div class="calc-card"><div class="card-title">Eşkenar dörtgen</div><div class="card-body">Dört kenarı da eşit olan paralelkenar. Eşdeğer: köşegenleri dik olan paralelkenar.</div></div>
<div class="calc-card"><div class="card-title">Kare</div><div class="card-body">Hem dikdörtgen hem eşkenar dörtgen olan dörtgen. Dört eşit kenar <em>ve</em> dört dik açı.</div></div>
</div>

<div class="calc-graph"><div id="plot-l86-tree-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> dörtgen türlerinin kalıtım ağacı. Her kutu bir sınıftır; oklar özel durumdan daha genel ebeveyne doğru gider. Kare hem dikdörtgen hem eşkenar dörtgenden her şeyi miras alır; bu ikisi de paralelkenardan, paralelkenar yamuktan, yamuk ise üstteki genel dörtgenden miras alır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodesX=[3,3,3,2,4,3];
var nodesY=[5,4,3,2,2,1];
var nodesT=['Dörtgen','Yamuk','Paralelkenar','Dikdörtgen','Eşkenar D.','Kare'];
var nodes={x:nodesX,y:nodesY,mode:'markers+text',name:'sınıflar',marker:{color:'#3b82f6',size:46,line:{color:'#0a0a0a',width:2}},text:nodesT,textfont:{color:'#e8e8e8',size:11},textposition:'middle center'};
var edges={x:[3,3,null,3,3,null,3,2,null,3,4,null,2,3,null,4,3,null],y:[5,4,null,4,3,null,3,2,null,3,2,null,2,1,null,2,1,null],mode:'lines',name:'-dir',line:{color:'rgba(245,158,11,0.55)',width:2}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[0.5,5.5],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[0.4,5.6],showgrid:false,zeroline:false,showticklabels:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l86-tree-tr',[edges,nodes],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Görsel anımsatma:</strong> hiyerarşiyi tepesinde dörtgen (en genel), tabanında kare (en özel) olan bir piramit gibi düşün. Aşağı her adımda yeni bir koşul eklenir &mdash; "şimdi iki çift de paralel," "şimdi tüm açılar dik," "şimdi tüm kenarlar eşit."</div>

<h2 class="lesson-title">3. Yamuk</h2>

<div class="calc-highlight"><strong>Yamuğun bir çift paralel kenarı vardır.</strong> Paralel olan iki kenara <em>tabanlar</em>, diğer ikisine <em>bacaklar</em> denir. Bacaklar eşitse yamuk <em>ikizkenar</em>dır ve her tabandaki iki açı eşit olur.</div>

<p class="l-text">Tabanları $a$ (uzun) ve $c$ (kısa), aralarındaki dik uzaklığı $h$ olarak adlandır. <strong>Orta taban</strong> (iki bacağın orta noktalarını birleştiren parça) her iki tabana paraleldir ve uzunluğu tabanların ortalamasına eşittir:</p>

<div class="calc-formula"><div class="formula-label">YAMUĞUN ORTA TABANI</div><div class="formula-main">$$m \\;=\\; \\frac{a + c}{2}$$</div><div class="formula-sub">Orta taban iki tabanın tam ortasında uzanır ve her ikisine paraleldir.</div></div>

<div class="calc-formula"><div class="formula-label">YAMUĞUN ALANI</div><div class="formula-main">$$A \\;=\\; \\frac{a + c}{2} \\cdot h \\;=\\; m \\cdot h$$</div><div class="formula-sub">Taban uzunluklarının ortalaması çarpı tabanlar arası yükseklik. Eşdeğer olarak: orta taban çarpı yükseklik.</div></div>

<p class="l-text"><strong>Neden bu formül?</strong> Yamuğun iki özdeş kopyasını al. Birini ters çevir ve diğerine bir bacak boyunca yapıştır. Sonuç, tabanı $a + c$ ve yüksekliği $h$ olan bir paralelkenardır; alanı $(a+c) \\cdot h$. Bunun yarısı bir yamuğun alanıdır: $\\frac{(a+c)\\,h}{2}$.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir yamuğun paralel kenarları 5 ve 9 birim, aralarındaki dik uzaklık 4 birim. Alanı bul.<br><br>$A = \\dfrac{5+9}{2} \\cdot 4 = 7 \\cdot 4 = \\mathbf{28}$ birim&sup2;. Orta taban 7 birim uzunluğundadır.</div></div>

<h2 class="lesson-title">4. Paralelkenar</h2>

<div class="calc-highlight"><strong>Paralelkenarda her iki çift karşıt kenar da paraleldir.</strong> Bu tek koşul, tanıma eşdeğer uzun bir sonuçlar listesini zorlar.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karşıt kenarlar eşit</div><div class="card-body">$|AB| = |CD|$ ve $|BC| = |DA|$.</div></div>
<div class="calc-card"><div class="card-title">Karşıt açılar eşit</div><div class="card-body">$\\angle A = \\angle C$ ve $\\angle B = \\angle D$.</div></div>
<div class="calc-card"><div class="card-title">Ardışık açılar bütünler</div><div class="card-body">$\\angle A + \\angle B = 180^\\circ$ (ve diğer komşu çiftler için de aynısı).</div></div>
<div class="calc-card"><div class="card-title">Köşegenler birbirini ortalar</div><div class="card-body">İki köşegen $AC$ ve $BD$ tek bir noktada kesişir ve her birini iki eşit parçaya böler.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PARALELKENARIN ALANI</div><div class="formula-main">$$A \\;=\\; b \\cdot h$$</div><div class="formula-sub">Taban çarpı dik yükseklik. Yükseklik seçilen tabana dik olarak ölçülür, eğik kenar boyunca değil.</div></div>

<p class="l-text"><strong>Neden bu formül?</strong> Paralelkenarın bir ucundaki dik üçgeni kaydırıp diğer uca getir. Aynı $b$ tabanı ve aynı $h$ yüksekliği olan bir dikdörtgen elde edersin. Dikdörtgenlerin alanı $b \\cdot h$ olduğundan, paralelkenarın alanı da öyledir.</p>

<div class="l-note"><strong>Dikkat:</strong> eğik kenar <em>yükseklik değildir</em>. Tabanı 10, eğik kenarı 6 olan ve eğik kenarı tabana 30&deg; açı yapan bir paralelkenarın yüksekliği $6 \\sin 30^\\circ = 3$'tür, 6 değil. Alan $10 \\cdot 3 = 30$, $10 \\cdot 6 = 60$ değil.</div>

<h2 class="lesson-title">5. Dikdörtgen</h2>

<div class="calc-highlight"><strong>Dikdörtgen, bir dik açısı olan paralelkenardır.</strong> Bir açı 90&deg; olunca, paralelkenar özelliği dört açıyı da 90&deg; olmaya zorlar. Yani "dikdörtgen" ile "tüm açıları dik olan paralelkenar" aynı sınıftır.</div>

<p class="l-text">Dikdörtgen, her paralelkenar özelliğini miras alır ve kendine iki tane daha ekler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dört açı da dik</div><div class="card-body">$\\angle A = \\angle B = \\angle C = \\angle D = 90^\\circ$.</div></div>
<div class="calc-card"><div class="card-title">Köşegenler eşit uzunlukta</div><div class="card-body">$|AC| = |BD|$. (Genel bir paralelkenarda köşegenler eşit değildir.) Bu, bir dikdörtgeni dikdörtgen olmayan bir paralelkenardan en hızlı ayıran özelliktir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">DİKDÖRTGENİN ALANI VE KÖŞEGENİ</div><div class="formula-main">$$A \\;=\\; \\ell \\cdot w \\qquad d \\;=\\; \\sqrt{\\ell^{2} + w^{2}}$$</div><div class="formula-sub">Uzun kenar çarpı kısa kenar. Köşegen, iki kenar ve köşegenin oluşturduğu dik üçgene Pisagor teoremi uygulanarak bulunur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Kenarları 6 ve 8 olan bir dikdörtgenin köşegenini bul.<br><br>$d = \\sqrt{6^{2} + 8^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$.<br><br>Klasik 6-8-10 dik üçgeni (3-4-5'in iki katı).</div></div>

<h2 class="lesson-title">6. Eşkenar Dörtgen ve Kare</h2>

<div class="calc-highlight"><strong>Eşkenar dörtgen, dört kenarı da eşit olan paralelkenardır.</strong> Eşdeğer olarak: köşegenleri dik olan paralelkenar. Kare ise bu iki koşul ile dik açıların birlikte tutmasıyla elde edilenidir &mdash; aynı anda hem eşkenar dörtgen hem dikdörtgen.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eşkenar dörtgen &mdash; tüm kenarlar eşit</div><div class="card-body">$|AB| = |BC| = |CD| = |DA|$. Dört kenarın ortak uzunluğu vardır, genellikle $s$ ile gösterilir.</div></div>
<div class="calc-card"><div class="card-title">Eşkenar dörtgen &mdash; köşegenler dik</div><div class="card-body">$AC \\perp BD$. Dik açıyla kesişirler ve birbirlerini ortalarlar.</div></div>
<div class="calc-card"><div class="card-title">Eşkenar dörtgen &mdash; köşegenler açıortay</div><div class="card-body">Her köşegen, karşılıklı köşelerdeki iki açıyı eşit parçalara böler.</div></div>
<div class="calc-card"><div class="card-title">Kare &mdash; yukarıdaki her şey</div><div class="card-body">Kenarlar eşit, açılar dik, köşegenler hem eşit <em>hem</em> dik.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EŞKENAR DÖRTGENİN ALANI (İKİ FORMÜL)</div><div class="formula-main">$$A \\;=\\; \\frac{d_{1} \\cdot d_{2}}{2} \\qquad\\text{ya da}\\qquad A \\;=\\; s \\cdot h$$</div><div class="formula-sub">Köşegenlerin çarpımının yarısı; ya da kenar çarpı dik yükseklik (çünkü eşkenar dörtgen bir paralelkenardır).</div></div>

<div class="calc-formula"><div class="formula-label">KARENİN ALANI VE KÖŞEGENİ</div><div class="formula-main">$$A \\;=\\; s^{2} \\qquad d \\;=\\; s\\sqrt{2}$$</div><div class="formula-sub">Kenarın karesi. Köşegen, iki bacağı da $s$ olan dik üçgenden Pisagor ile bulunur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Köşegenleri 10 ve 24 olan eşkenar dörtgenin alanını ve kenarını bul.<br><br>Alan: $A = \\dfrac{10 \\cdot 24}{2} = \\mathbf{120}$.<br><br>Kenar: köşegenler birbirini dik kesip ortaladığı için her kenar, bacakları 5 ve 12 olan dik üçgenin hipotenüsüdür. Dolayısıyla $s = \\sqrt{5^{2} + 12^{2}} = \\sqrt{169} = \\mathbf{13}$.</div></div>

<h2 class="lesson-title">7. Deltoid (Uçurtma)</h2>

<div class="calc-highlight"><strong>Deltoid, iki çift komşu eşit kenara sahip dörtgendir</strong> &mdash; karşıt değil, yan yana. Köşegenler diktir ve biri diğerinin orta dikmesidir.</div>

<p class="l-text">Deltoid bir paralelkenar değildir (karşıt kenarları genelde paralel olmaz), ama eşkenar dörtgenle köşegenlerin dik kesişimi özelliğini paylaşır. Bu, aynı alan formülünü verir:</p>

<div class="calc-formula"><div class="formula-label">DELTOİDİN ALANI</div><div class="formula-main">$$A \\;=\\; \\frac{d_{1} \\cdot d_{2}}{2}$$</div><div class="formula-sub">Köşegenlerin çarpımının yarısı &mdash; eşkenar dörtgenle aynı formül, çünkü ikisi de "köşegenleri dik olan dörtgen" sınıfının özel durumlarıdır.</div></div>

<div class="calc-graph"><div id="plot-l86-types-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> beş en önemli dörtgen türünün aynı ölçekte yan yana çizimi &mdash; yamuk, paralelkenar, dikdörtgen, eşkenar dörtgen ve kare. Kenar uzunluklarını, açıları ve köşegenleri tek bakışta karşılaştır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var trX=[0.2,1.8,1.5,0.5,0.2],trY=[0.2,0.2,1.2,1.2,0.2];
var paX=[2.4,4.0,4.4,2.8,2.4],paY=[0.2,0.2,1.2,1.2,0.2];
var rcX=[4.8,6.4,6.4,4.8,4.8],rcY=[0.2,0.2,1.2,1.2,0.2];
var rhX=[7.4,8.0,7.4,6.8,7.4],rhY=[0.2,0.7,1.2,0.7,0.2];
var sqX=[8.6,9.6,9.6,8.6,8.6],sqY=[0.2,0.2,1.2,1.2,0.2];
var labels={x:[1.0,3.4,5.6,7.4,9.1],y:[1.55,1.55,1.55,1.55,1.55],mode:'text',text:['Yamuk','Paralelkenar','Dikdörtgen','Eşkenar D.','Kare'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var tr={x:trX,y:trY,mode:'lines',name:'yamuk',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var pa={x:paX,y:paY,mode:'lines',name:'paralelkenar',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var rc={x:rcX,y:rcY,mode:'lines',name:'dikdörtgen',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var rh={x:rhX,y:rhY,mode:'lines',name:'eşkenar',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var sq={x:sqX,y:sqY,mode:'lines',name:'kare',line:{color:'#3b82f6',width:2.5},fill:'toself',fillcolor:'rgba(59,130,246,0.15)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.2,10.0],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[0,1.8],showgrid:false,zeroline:false,showticklabels:false},margin:{t:20,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l86-types-tr',[tr,pa,rc,rh,sq,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Köşegenler: Hızlı Karşılaştırma</h2>

<div class="calc-highlight"><strong>Köşegenler türü ilk bakışta söyler.</strong> Eşit uzunluk dikdörtgenin işaretidir; diklik eşkenar dörtgen ya da deltoidin işaretidir; ikisi birden karenin işaretidir. Bunu bilmek geometri problemlerinde çok iş tasarrufu sağlar.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tür</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ortalıyor mu?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Eşit mi?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Dik mi?</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Paralelkenar</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">hayır</td><td style="padding:0.5rem 0.8rem">hayır</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Dikdörtgen</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">hayır</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Eşkenar dörtgen</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">hayır</td><td style="padding:0.5rem 0.8rem">evet</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Kare</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">evet</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Yamuk (ikizkenar)</td><td style="padding:0.5rem 0.8rem">hayır</td><td style="padding:0.5rem 0.8rem">evet</td><td style="padding:0.5rem 0.8rem">hayır</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Deltoid</td><td style="padding:0.5rem 0.8rem">biri diğerini ortalar</td><td style="padding:0.5rem 0.8rem">hayır</td><td style="padding:0.5rem 0.8rem">evet</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l86-diag-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç farklı köşegen düzenlemesi. Soldaki dikdörtgenin köşegenleri eşittir, birbirini ortalar ama dik değildir. Ortadaki eşkenar dörtgenin köşegenleri farklı uzunlukta, dik ve birbirini ortalayan biçimdedir. Sağdaki deltoidin köşegenleri diktir, ama yalnızca biri diğeri tarafından ortalanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rcX=[0.2,2.6,2.6,0.2,0.2],rcY=[0.3,0.3,1.5,1.5,0.3];
var rcD1={x:[0.2,2.6],y:[0.3,1.5],mode:'lines',name:'rc d1',line:{color:'#f59e0b',width:2.2}};
var rcD2={x:[0.2,2.6],y:[1.5,0.3],mode:'lines',name:'rc d2',line:{color:'#f59e0b',width:2.2}};
var rcShape={x:rcX,y:rcY,mode:'lines',name:'dikdörtgen',line:{color:'#3b82f6',width:2.5}};
var rhCX=4.5,rhCY=0.9;
var rhX=[rhCX-1.2,rhCX,rhCX+1.2,rhCX,rhCX-1.2],rhY=[rhCY,rhCY+0.6,rhCY,rhCY-0.6,rhCY];
var rhD1={x:[rhCX-1.2,rhCX+1.2],y:[rhCY,rhCY],mode:'lines',name:'rh d1',line:{color:'#f59e0b',width:2.2}};
var rhD2={x:[rhCX,rhCX],y:[rhCY-0.6,rhCY+0.6],mode:'lines',name:'rh d2',line:{color:'#f59e0b',width:2.2}};
var rhShape={x:rhX,y:rhY,mode:'lines',name:'eşkenar',line:{color:'#3b82f6',width:2.5}};
var ktCX=8.0;
var ktX=[ktCX,ktCX+0.8,ktCX,ktCX-0.8,ktCX],ktY=[1.6,0.9,0.1,0.9,1.6];
var ktD1={x:[ktCX,ktCX],y:[0.1,1.6],mode:'lines',name:'kt d1',line:{color:'#f59e0b',width:2.2}};
var ktD2={x:[ktCX-0.8,ktCX+0.8],y:[0.9,0.9],mode:'lines',name:'kt d2',line:{color:'#f59e0b',width:2.2}};
var ktShape={x:ktX,y:ktY,mode:'lines',name:'deltoid',line:{color:'#3b82f6',width:2.5}};
var labs={x:[1.4,4.5,8.0],y:[-0.05,-0.05,-0.05],mode:'text',text:['Dikdörtgen: eşit, ortalar','Eşkenar: dik, ortalar','Deltoid: dik, biri ortalar'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.3,9.5],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'y',scaleratio:1},yaxis:{range:[-0.4,2.0],showgrid:false,zeroline:false,showticklabels:false},margin:{t:20,r:20,b:30,l:20},showlegend:false};
Plotly.newPlot('plot-l86-diag-tr',[rcShape,rcD1,rcD2,rhShape,rhD1,rhD2,ktShape,ktD1,ktD2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Çözümlü Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; YAMUK ALANI</div><div class="example-body">Bir yamuğun paralel kenarları 5 ve 9 birim, aralarındaki uzaklık 4 birim. Alanı ve orta tabanı bul.<br><br>Orta taban: $m = \\dfrac{5+9}{2} = 7$.<br><br>Alan: $A = m \\cdot h = 7 \\cdot 4 = \\mathbf{28}$ birim&sup2;.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; DİKDÖRTGEN KÖŞEGENİ</div><div class="example-body">Kenarları 6 ve 8 olan dikdörtgenin köşegenini bul.<br><br>$d = \\sqrt{6^{2} + 8^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$. (Klasik 6-8-10 üçgeni.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; KÖŞEGENLERDEN KENAR</div><div class="example-body">Köşegenleri 10 ve 24 olan eşkenar dörtgenin kenarını bul.<br><br>Köşegenler birbirini dik ortaladığı için her kenar, bacakları 5 ve 12 olan dik üçgenin hipotenüsüdür. $s = \\sqrt{5^{2}+12^{2}} = \\sqrt{169} = \\mathbf{13}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 &mdash; KANIT</div><div class="example-body"><strong>Bir paralelkenarın bir dik açısı varsa, dikdörtgen olduğunu kanıtla.</strong><br><br>Paralelkenar $ABCD$ olsun ve $\\angle A = 90^\\circ$. Her paralelkenarda $\\angle A + \\angle B = 180^\\circ$ (ardışık açılar bütünler) olduğundan $\\angle B = 90^\\circ$. Ayrıca $\\angle A = \\angle C$ (karşıt açılar eşit), dolayısıyla $\\angle C = 90^\\circ$. Son olarak $\\angle B = \\angle D = 90^\\circ$. Dört açı da dik olduğundan $ABCD$ dikdörtgendir. <strong>İspatlandı</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 &mdash; KARE KÖŞEGENİ</div><div class="example-body">Kenarı 7 birim olan karenin köşegenini bul.<br><br>$d = s\\sqrt{2} = 7\\sqrt{2} \\approx \\mathbf{9{,}90}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 6 &mdash; EKSİK AÇI</div><div class="example-body">$ABCD$ dörtgeninde $\\angle A = 70^\\circ$, $\\angle B = 110^\\circ$, $\\angle C = 80^\\circ$. $AB \\parallel CD$ ise $\\angle D$ değerini bul ve türü tanımla.<br><br>$\\angle D = 360 - 70 - 110 - 80 = \\mathbf{100^\\circ}$.<br><br>$\\angle A + \\angle B = 180^\\circ$ ve $AB \\parallel CD$ olduğu için şekilde en az bir çift paralel kenar vardır &mdash; yani yamuktur. Diğer kenar çiftinin paralel olması verilen bilgiden zorunlu değildir, dolayısıyla yalnız bu bilgiyle paralelkenar diyemeyiz.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 7 &mdash; DELTOİD ALANI</div><div class="example-body">Köşegenleri 12 ve 16 olan bir deltoidin alanını bul.<br><br>$A = \\dfrac{d_{1} d_{2}}{2} = \\dfrac{12 \\cdot 16}{2} = \\mathbf{96}$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 8 &mdash; PARALELKENAR ALANI</div><div class="example-body">Tabanı 10, eğik kenarı 6 olan ve eğik kenarı tabanla 30&deg; açı yapan bir paralelkenarın alanını bul.<br><br>Yükseklik: $h = 6 \\sin 30^\\circ = 6 \\cdot 0{,}5 = 3$.<br><br>Alan: $A = b \\cdot h = 10 \\cdot 3 = \\mathbf{30}$.</div></div>

<h2 class="lesson-title">10. Sık Yapılan Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DOĞRU</div><div class="compare-item">Her kare bir dikdörtgendir (aynı zamanda eşkenar dörtgen, paralelkenar, yamuktur).</div><div class="compare-item">Paralelkenar alanında dik yüksekliği kullan, eğik kenarı değil.</div><div class="compare-item">Yamuk alanı = (paralel kenarların toplamı) &divide; 2 &times; yükseklik.</div><div class="compare-item">Eşkenar dörtgenin köşegenleri birbirini ortalar <em>ve</em> diktir.</div></div><div class="compare-col"><div class="compare-title">YANLIŞ</div><div class="compare-item">"Eşkenar dörtgen paralelkenar değildir" demek &mdash; her eşkenar dörtgen bir paralelkenardır.</div><div class="compare-item">Paralelkenarın eğik kenarını yükseklik olarak kullanmak. Bu alanı büyük gösterir.</div><div class="compare-item">Yamuk alanını $a \\cdot c \\cdot h$ ya da $(a+c)\\cdot h$ yazmak (ikiye bölmeyi unutmak).</div><div class="compare-item">"Kenarları eşit görünüyor" diye paralelkenara eşkenar dörtgen demek &mdash; uzunlukları ölç.</div></div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dörtgen = 4 kenarlı kapalı çokgen; iç açılar toplamı 360&deg;</li>
<li>Hiyerarşi: dörtgen &supe; yamuk &supe; paralelkenar &supe; {dikdörtgen, eşkenar dörtgen} &supe; kare</li>
<li>Paralelkenar: karşıt kenarlar eşit, karşıt açılar eşit, köşegenler birbirini ortalar</li>
<li>Dikdörtgen: paralelkenar + dik açılar &rArr; köşegenler eşit</li>
<li>Eşkenar dörtgen: paralelkenar + eşit kenarlar &rArr; köşegenler dik, açıortay</li>
<li>Kare: dikdörtgen &cap; eşkenar dörtgen</li>
<li>Alanlar: paralelkenar $b\\,h$; dikdörtgen $\\ell\\,w$; eşkenar dörtgen ve deltoid $\\tfrac{d_{1}d_{2}}{2}$; kare $s^{2}$; yamuk $\\tfrac{(a+c)}{2}\\,h$</li>
<li>Hızlı tanı: eşit köşegen &rArr; dikdörtgen; dik köşegen &rArr; eşkenar dörtgen (ya da deltoid)</li>
</ul>
</div>`
};
