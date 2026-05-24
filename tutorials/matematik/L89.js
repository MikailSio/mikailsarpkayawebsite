window.LISE_MAT_L89 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Solid geometry is the bridge between the flat figures of plane geometry and the three-dimensional world you actually live in.</strong> Every box you have ever wrapped, every aquarium you have ever filled, and every brick wall you have ever counted is an exercise in solid geometry. The volumes and surface areas you compute on paper are the same numbers a builder uses to order concrete or a packager uses to size a carton.</p>

<p class="l-text">This lesson focuses on a single family of solids: the <em>prisms</em>. A prism is the simplest three-dimensional shape that still has interesting structure — two parallel copies of a flat polygon (the bases) connected by rectangular sides. By the end you will move freely between the cube, the cuboid (rectangular prism), and the triangular prism, you will know exactly how the volume and the surface area depend on the dimensions, and you will be able to spot diagonals, cross-sections, and unfolded nets at a glance.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a polyhedron and verify Euler's formula $V - E + F = 2$ on small examples</li>
<li>Compute the volume and surface area of a cube from its edge length, and find face and space diagonals using the Pythagorean theorem</li>
<li>Compute the volume and surface area of a rectangular prism (cuboid) from its three side lengths</li>
<li>Apply the general prism formulas $V = B \\cdot h$ and $S = 2B + P \\cdot h$ to triangular and other prisms</li>
<li>Recognise the 11 distinct nets of a cube and describe possible cross-sections (triangle, rectangle, hexagon)</li>
<li>Translate everyday word problems (pools, paint, packaging) into prism calculations and keep units consistent</li>
</ul>
</div>

<h2 class="lesson-title">1. Polyhedra and Euler's Formula</h2>

<div class="calc-highlight"><strong>A polyhedron is a solid built from flat polygonal faces meeting along straight edges and corners (vertices).</strong> Prisms, cubes, pyramids, and the famous Platonic solids are all polyhedra. The word literally means "many-faced", from Greek <em>poly</em> + <em>hedron</em>.</div>

<p class="l-text">Every closed convex polyhedron satisfies a simple counting law discovered by Leonhard Euler in the 18th century. Count the vertices $V$, the edges $E$, and the faces $F$. Then:</p>

<div class="calc-formula"><div class="formula-label">EULER'S POLYHEDRON FORMULA</div><div class="formula-main">$$V \\;-\\; E \\;+\\; F \\;=\\; 2$$</div><div class="formula-sub">Holds for every closed convex polyhedron — cube, tetrahedron, triangular prism, pyramid, soccer ball, anything you can build out of flat faces without holes.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertex (V)</div><div class="card-body">A corner where edges meet. A cube has 8 corners.</div></div>
<div class="calc-card"><div class="card-title">Edge (E)</div><div class="card-body">A straight line segment where two faces meet. A cube has 12 edges.</div></div>
<div class="calc-card"><div class="card-title">Face (F)</div><div class="card-body">A flat polygon bounding the solid. A cube has 6 faces.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Verify Euler's formula for a <strong>cube</strong>.<br><br>$V = 8$, $E = 12$, $F = 6$. Then $V - E + F = 8 - 12 + 6 = \\mathbf{2}$. The formula holds.<br><br>Now try a <strong>triangular prism</strong>: $V = 6$, $E = 9$, $F = 5$. $6 - 9 + 5 = \\mathbf{2}$. Again the formula holds.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A square pyramid has a square base and four triangular faces meeting at a single apex. Count $V$, $E$, $F$ and check Euler's formula. (Answer: $V = 5$, $E = 8$, $F = 5$, so $5 - 8 + 5 = 2$.)</div></div>

<h2 class="lesson-title">2. The Cube</h2>

<div class="calc-highlight"><strong>The cube is the perfectly symmetric prism.</strong> All twelve edges have the same length $a$, all six faces are congruent squares, and every vertex looks exactly the same as every other. If you understand the cube, half of solid geometry follows.</div>

<p class="l-text">Let $a$ denote the edge length. The cube has three fundamental quantities you must be able to write down without thinking:</p>

<div class="calc-formula"><div class="formula-label">CUBE — VOLUME AND SURFACE AREA</div><div class="formula-main">$$V \\;=\\; a^{3} \\qquad\\qquad S \\;=\\; 6 a^{2}$$</div><div class="formula-sub">Volume is "edge cubed" because the cube fills a region of length $a$, width $a$, height $a$. Surface area is "6 times one face" because there are six identical square faces.</div></div>

<p class="l-text"><strong>Why $V = a^3$?</strong> Slice the cube into $a \\times a \\times a$ tiny unit cubes of side 1. There are $a^3$ of them, and each has volume 1. Total volume is $a^3$. The same argument works for any positive real edge length once you replace "tiny unit cubes" with the abstract definition of volume.</p>

<p class="l-text"><strong>Why $S = 6 a^2$?</strong> A cube has 6 faces. Each face is a square of side $a$, so its area is $a^2$. Six faces $\\times$ one face area $a^2$ = $6a^2$. Forgetting the factor 6 is the most common surface-area error students make.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Face diagonal</div><div class="card-body">The diagonal of one square face. Using 2D Pythagoras: $d_{\\text{face}} = a\\sqrt{2}$.</div></div>
<div class="calc-card"><div class="card-title">Space diagonal</div><div class="card-body">The diagonal from one corner to the opposite corner, passing through the cube. Using 3D Pythagoras: $d_{\\text{space}} = a\\sqrt{3}$.</div></div>
<div class="calc-card"><div class="card-title">Symmetry</div><div class="card-body">A cube has 48 symmetries: 24 rotations plus 24 reflections. The most symmetric prism.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">CUBE DIAGONALS</div><div class="formula-main">$$d_{\\text{face}} \\;=\\; a\\sqrt{2} \\qquad\\qquad d_{\\text{space}} \\;=\\; a\\sqrt{3}$$</div><div class="formula-sub">Face diagonal = edge $\\times \\sqrt{2}$. Space diagonal = edge $\\times \\sqrt{3}$. Both follow from applying the Pythagorean theorem once and twice respectively.</div></div>

<p class="l-text"><strong>Deriving the space diagonal.</strong> Pick a corner of the cube and walk to the opposite corner. First go along one edge of length $a$, then perpendicular along another edge of length $a$ — you have traced a face diagonal of length $a\\sqrt{2}$. Now go straight up by $a$ more. The total straight-line distance from start to end is $\\sqrt{(a\\sqrt{2})^2 + a^2} = \\sqrt{2a^2 + a^2} = \\sqrt{3a^2} = a\\sqrt{3}$.</p>

<div class="calc-graph"><div id="plot-l89-cube-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a cube with edge length 1 in 3D. The 12 edges are drawn in light grey. A red dashed line shows a face diagonal (length $\\sqrt{2}$). A blue solid line shows the space diagonal from $(0,0,0)$ to $(1,1,1)$ (length $\\sqrt{3}$). Rotate the figure with your mouse to see all three diagonals clearly.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var vx=[0,1,1,0,0,0,1,1,0,0,1,1,1,1,0,0];
var vy=[0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,1];
var vz=[0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0];
var edgesEN={x:vx,y:vy,z:vz,mode:'lines',type:'scatter3d',name:'cube edges',line:{color:'rgba(232,232,232,0.7)',width:5}};
var faceDiagEN={x:[0,1],y:[0,1],z:[0,0],mode:'lines',type:'scatter3d',name:'face diagonal a√2',line:{color:'#ef4444',width:6,dash:'dash'}};
var spaceDiagEN={x:[0,1],y:[0,1],z:[0,1],mode:'lines',type:'scatter3d',name:'space diagonal a√3',line:{color:'#3b82f6',width:7}};
var cornersEN={x:[0,1,1,0,0,1,1,0],y:[0,0,1,1,0,0,1,1],z:[0,0,0,0,1,1,1,1],mode:'markers',type:'scatter3d',name:'vertices',marker:{color:'#f59e0b',size:4}};
var layCubeEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},aspectmode:'cube'},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l89-cube-en',[edgesEN,faceDiagEN,spaceDiagEN,cornersEN],layCubeEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Quick mental check:</strong> for a unit cube ($a = 1$), face diagonal is $\\sqrt{2} \\approx 1.414$ and space diagonal is $\\sqrt{3} \\approx 1.732$. The space diagonal is always the longest straight line that fits inside a cube — useful when asking whether a thin object will fit inside a box.</div>

<h2 class="lesson-title">3. The Rectangular Prism (Cuboid)</h2>

<div class="calc-highlight"><strong>The rectangular prism — also called a cuboid or a box — is what a cube becomes when its three side lengths are allowed to be different.</strong> Three edge lengths $l$ (length), $w$ (width), $h$ (height). Six faces, but now they come in three matching pairs: two of size $l \\times w$, two of size $l \\times h$, two of size $w \\times h$.</div>

<div class="calc-formula"><div class="formula-label">CUBOID — VOLUME AND SURFACE AREA</div><div class="formula-main">$$V \\;=\\; l \\cdot w \\cdot h \\qquad\\qquad S \\;=\\; 2(lw + lh + wh)$$</div><div class="formula-sub">Volume multiplies all three edges. Surface area sums the areas of three different face pairs and doubles the total (because each face appears twice, once on each side of the box).</div></div>

<p class="l-text"><strong>Sanity check with the cube.</strong> If $l = w = h = a$, then $V = a \\cdot a \\cdot a = a^3$ and $S = 2(a^2 + a^2 + a^2) = 6a^2$. The cube formulas come out as a special case. This is exactly what we want: a more general formula should agree with the simpler one whenever the simpler one applies.</p>

<p class="l-text"><strong>Space diagonal of a cuboid.</strong> The same Pythagorean argument as before, applied twice:</p>

<div class="calc-formula"><div class="formula-label">CUBOID SPACE DIAGONAL</div><div class="formula-main">$$d \\;=\\; \\sqrt{l^{2} + w^{2} + h^{2}}$$</div><div class="formula-sub">The straight-line distance from one corner to the opposite corner of a box. Reduces to $a\\sqrt{3}$ when $l = w = h = a$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A rectangular box has dimensions $l = 6$ cm, $w = 4$ cm, $h = 3$ cm.<br><br>Volume: $V = 6 \\cdot 4 \\cdot 3 = \\mathbf{72 \\text{ cm}^{3}}$.<br>Surface area: $S = 2(6 \\cdot 4 + 6 \\cdot 3 + 4 \\cdot 3) = 2(24 + 18 + 12) = 2 \\cdot 54 = \\mathbf{108 \\text{ cm}^{2}}$.<br>Space diagonal: $d = \\sqrt{36 + 16 + 9} = \\sqrt{61} \\approx \\mathbf{7.81 \\text{ cm}}$.</div></div>

<div class="calc-graph"><div id="plot-l89-cuboid-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a cuboid with $l = 3$, $w = 2$, $h = 1$. The three side lengths are labelled along three different edges, so you can see at a glance how each dimension contributes to volume and surface area. Drag to rotate.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var L=3,W=2,H=1;
var bx=[0,L,L,0,0,0,L,L,0,0,L,L,L,L,0,0];
var by=[0,0,W,W,0,0,0,W,W,0,0,0,W,W,W,W];
var bz=[0,0,0,0,0,H,H,H,H,H,H,0,0,H,H,0];
var edgesC={x:bx,y:by,z:bz,mode:'lines',type:'scatter3d',name:'cuboid edges',line:{color:'rgba(232,232,232,0.75)',width:5}};
var labelsC={x:[L/2,L,0],y:[0,W/2,W],z:[0,0,H/2],mode:'text',type:'scatter3d',name:'dimensions',text:['l = 3','w = 2','h = 1'],textfont:{color:'#3b82f6',size:14}};
var cornersC={x:[0,L,L,0,0,L,L,0],y:[0,0,W,W,0,0,W,W],z:[0,0,0,0,H,H,H,H],mode:'markers',type:'scatter3d',name:'vertices',marker:{color:'#f59e0b',size:4},showlegend:false};
var layC={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},aspectmode:'data'},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l89-cuboid-en',[edgesC,labelsC,cornersC],layC,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. The General Prism</h2>

<div class="calc-highlight"><strong>A prism is any solid with two parallel congruent polygonal bases connected by rectangular lateral faces.</strong> The bases can be triangles, pentagons, hexagons — any polygon you can draw flat. The two bases are translated copies of each other, and the rectangles fill in the sides.</div>

<p class="l-text">Let $B$ denote the <em>area</em> of one base and $h$ denote the <em>height</em> (the perpendicular distance between the two bases). Then the volume and lateral surface follow a single clean pattern:</p>

<div class="calc-formula"><div class="formula-label">GENERAL PRISM FORMULAS</div><div class="formula-main">$$V \\;=\\; B \\cdot h \\qquad\\qquad S \\;=\\; 2B \\;+\\; P \\cdot h$$</div><div class="formula-sub">$B$ = area of one base, $h$ = perpendicular height between the two bases, $P$ = perimeter of the base. Surface area = two bases + the strip of rectangles wrapping around the side.</div></div>

<p class="l-text"><strong>Interpretation.</strong> Volume of a prism is "area of base times height" — exactly the same idea as a stack of identical pancakes, each of area $B$ and infinitesimal thickness, piled $h$ high. Surface area is "two bases plus the lateral surface", and the lateral surface is one big rectangle of width $P$ (the perimeter of the base) and height $h$ — which is what you get if you unroll the side walls.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cube</div><div class="card-body">Base is a square of area $a^2$, perimeter $4a$, height $a$. $V = a^2 \\cdot a = a^3$. $S = 2 a^2 + 4a \\cdot a = 6 a^2$.</div></div>
<div class="calc-card"><div class="card-title">Cuboid</div><div class="card-body">Base is a rectangle of area $lw$, perimeter $2(l+w)$, height $h$. $V = lwh$. $S = 2lw + 2(l+w) \\cdot h = 2(lw + lh + wh)$.</div></div>
<div class="calc-card"><div class="card-title">Triangular prism</div><div class="card-body">Base is a triangle of area $B$, perimeter equal to the sum of its three sides. Plug into the general formulas — no new ideas needed.</div></div>
</div>

<div class="l-note"><strong>The pattern keeps working.</strong> A regular hexagonal prism, a five-sided "pentagonal" prism, even a "prism" whose base is an irregular L-shape — all of them obey $V = B h$ and $S = 2B + P h$. Once you have the area $B$ and the perimeter $P$ of the base, the prism is solved.</div>

<h2 class="lesson-title">5. The Triangular Prism</h2>

<div class="calc-highlight"><strong>A triangular prism has two triangular bases connected by three rectangular lateral faces.</strong> Think of a Toblerone bar lying on its side, or the cross-section of a typical roof. Five faces in total (2 triangles + 3 rectangles), 6 vertices, 9 edges. Euler: $6 - 9 + 5 = 2$. Checks out.</div>

<p class="l-text">For a triangular base with sides $a$, $b$, $c$ and area $B$, and prism height $h$ (perpendicular distance between the two triangles):</p>

<div class="calc-formula"><div class="formula-label">TRIANGULAR PRISM</div><div class="formula-main">$$V \\;=\\; B \\cdot h \\qquad\\qquad S \\;=\\; 2 B \\;+\\; (a + b + c) \\cdot h$$</div><div class="formula-sub">The perimeter of the triangular base is just the sum of its three sides.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A triangular prism has a <em>right triangular</em> base with legs 3 cm and 4 cm (and therefore hypotenuse 5 cm by the Pythagorean theorem). The prism height is 10 cm.<br><br>Base area: $B = \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 6 \\text{ cm}^2$.<br>Base perimeter: $P = 3 + 4 + 5 = 12$ cm.<br><br>Volume: $V = 6 \\cdot 10 = \\mathbf{60 \\text{ cm}^{3}}$.<br>Surface area: $S = 2 \\cdot 6 + 12 \\cdot 10 = 12 + 120 = \\mathbf{132 \\text{ cm}^{2}}$.</div></div>

<div class="calc-graph"><div id="plot-l89-tri-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a triangular prism with a right-triangular base (legs 3 and 4) and prism length 6. The two parallel triangular bases sit at the front and back; the three rectangular lateral faces connect them. Rotate to compare the bases with the side rectangles.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var TL=6;
var ax=[0,3,0,0,0,3,0,0,3,3,0,0];
var ay=[0,0,0,4,0,0,4,0,0,4,4,0];
var az=[0,0,0,0,TL,TL,TL,TL,0,0,0,TL];
var triEdges={x:ax,y:ay,z:az,mode:'lines',type:'scatter3d',name:'prism edges',line:{color:'rgba(232,232,232,0.75)',width:5}};
var hypEdges={x:[3,0,3,0],y:[0,4,0,4],z:[0,0,TL,TL],mode:'lines',type:'scatter3d',name:'hypotenuse edges',line:{color:'#3b82f6',width:5}};
var hypLat={x:[3,0],y:[0,4],z:[TL,TL],mode:'lines',type:'scatter3d',line:{color:'#3b82f6',width:5},showlegend:false};
var labelsT={x:[1.5,0,0],y:[0,2,0],z:[0,0,TL/2],mode:'text',type:'scatter3d',name:'labels',text:['leg = 3','leg = 4','length = 6'],textfont:{color:'#3b82f6',size:13}};
var cornersT={x:[0,3,0,0,3,0],y:[0,0,4,0,0,4],z:[0,0,0,TL,TL,TL],mode:'markers',type:'scatter3d',marker:{color:'#f59e0b',size:4},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},aspectmode:'data'},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l89-tri-en',[triEdges,hypEdges,hypLat,labelsT,cornersT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Nets of a Cube</h2>

<div class="calc-highlight"><strong>If you cut a cube along some of its edges and unfold it flat, you get a "net".</strong> A net is the 2D pattern you would print on paper, cut out, and fold back into the solid. The cube has exactly <strong>11 distinct nets</strong> — a small number, but each one corresponds to a different way of unfolding the six faces.</div>

<p class="l-text">Why 11? Six squares can be glued edge-to-edge into countless patterns, but only some of them fold back without overlap into a cube. Mathematicians enumerated all of them and proved that, up to rotation and reflection, exactly 11 patterns work.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The "T" pattern</div><div class="card-body">A row of 4 squares with one square attached on top of the second and one on top of the third. Classic primary-school net.</div></div>
<div class="calc-card"><div class="card-title">The "cross" pattern</div><div class="card-body">A row of 4 squares with the second from the left having one square above and one below. Looks like a plus sign.</div></div>
<div class="calc-card"><div class="card-title">Other 9 patterns</div><div class="card-body">Various L-shapes, S-shapes, and staircase arrangements. All have the same total area $6a^2$ (six unit faces).</div></div>
</div>

<div class="l-note"><strong>Why nets matter.</strong> When you compute the surface area of a prism, you are really computing the total area of its net. Unfold the prism into a flat figure; add up the rectangle and polygon areas; you have the surface area. For a cube the net always has area $6a^2$ no matter which of the 11 patterns you choose.</div>

<h2 class="lesson-title">7. Cross-Sections of a Cube</h2>

<div class="calc-highlight"><strong>A cross-section is the flat 2D shape you get when you slice a 3D solid with a plane.</strong> Imagine taking a butter knife and cutting straight through a cube — the shape exposed on the cut is the cross-section, and it depends entirely on the angle of the cut.</div>

<p class="l-text">A cube can produce cross-sections of strikingly different shapes:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Square</div><div class="card-body">Cut parallel to any face. The cross-section is a square congruent to the face.</div></div>
<div class="calc-card"><div class="card-title">Rectangle</div><div class="card-body">Cut perpendicular to one face but at an angle along another. The cross-section is a rectangle (not square in general).</div></div>
<div class="calc-card"><div class="card-title">Triangle</div><div class="card-body">Slice off a corner of the cube. The cross-section is a triangle. If the slice is symmetric, the triangle is equilateral.</div></div>
<div class="calc-card"><div class="card-title">Hexagon</div><div class="card-body">Cut perpendicular to a space diagonal through the centre. The cross-section is a regular hexagon — surprising but true.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Hold an imaginary cube in your hand. Tilt it 45 degrees. Imagine the shadow cast by a light source directly above. The outline of the shadow can be a square, a rectangle, or a hexagon depending on orientation. This is essentially the same question as the cross-section question.</div></div>

<h2 class="lesson-title">8. Diagonals via the Pythagorean Theorem</h2>

<div class="calc-highlight"><strong>Diagonals are the secret weapon of solid geometry.</strong> Whenever a problem asks "how far is corner A from corner B?" or "will a stick of length L fit inside a box?", a diagonal is hiding in the answer. The key tool is the Pythagorean theorem applied once in 2D for face diagonals and twice for space diagonals.</div>

<div class="calc-formula"><div class="formula-label">FACE DIAGONAL (2D PYTHAGORAS)</div><div class="formula-main">$$d_{\\text{face}} \\;=\\; \\sqrt{a^{2} + b^{2}}$$</div><div class="formula-sub">For a rectangular face with sides $a$ and $b$, the diagonal goes from one corner of that face to the opposite corner along the face.</div></div>

<div class="calc-formula"><div class="formula-label">SPACE DIAGONAL (3D PYTHAGORAS)</div><div class="formula-main">$$d_{\\text{space}} \\;=\\; \\sqrt{l^{2} + w^{2} + h^{2}}$$</div><div class="formula-sub">For a cuboid, the space diagonal is the longest straight line that fits inside. Apply Pythagoras once to get the face diagonal, then once more to combine with the third dimension.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Will a fishing rod of length 2 metres fit inside a box of dimensions 1.5 m $\\times$ 1.2 m $\\times$ 0.8 m?<br><br>Space diagonal: $d = \\sqrt{1.5^2 + 1.2^2 + 0.8^2} = \\sqrt{2.25 + 1.44 + 0.64} = \\sqrt{4.33} \\approx \\mathbf{2.08 \\text{ m}}$.<br><br>Since 2 m $<$ 2.08 m, the rod <strong>does</strong> fit (with a small margin). It must be placed along the space diagonal.</div></div>

<h2 class="lesson-title">9. Worked Examples</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — CUBE OF EDGE 5</div><div class="example-body">A cube has edge length 5 cm. Compute its volume, surface area, and space diagonal.<br><br>$V = 5^3 = \\mathbf{125 \\text{ cm}^{3}}$.<br>$S = 6 \\cdot 5^2 = 6 \\cdot 25 = \\mathbf{150 \\text{ cm}^{2}}$.<br>$d_{\\text{space}} = 5 \\sqrt{3} \\approx \\mathbf{8.66 \\text{ cm}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — CUBOID $3 \\times 4 \\times 5$</div><div class="example-body">A rectangular box measures 3 m by 4 m by 5 m. Compute its volume and surface area.<br><br>$V = 3 \\cdot 4 \\cdot 5 = \\mathbf{60 \\text{ m}^{3}}$.<br>$S = 2(3 \\cdot 4 + 3 \\cdot 5 + 4 \\cdot 5) = 2(12 + 15 + 20) = 2 \\cdot 47 = \\mathbf{94 \\text{ m}^{2}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — SWIMMING POOL</div><div class="example-body">A rectangular swimming pool is 25 m long, 12 m wide, and a uniform 1.8 m deep. How many cubic metres of water does it hold? How many litres?<br><br>$V = 25 \\cdot 12 \\cdot 1.8 = \\mathbf{540 \\text{ m}^{3}}$.<br><br>One cubic metre is 1000 litres, so the pool holds $540 \\cdot 1000 = \\mathbf{540{,}000}$ litres.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — PAINTING A ROOM</div><div class="example-body">A room is 5 m long, 4 m wide, and 3 m high. The cost of paint is 12 lira per square metre, and you paint only the four walls (not floor or ceiling). What is the total paint cost?<br><br>Lateral surface (the four walls only): $P \\cdot h = 2(5 + 4) \\cdot 3 = 18 \\cdot 3 = 54 \\text{ m}^2$.<br>Cost: $54 \\cdot 12 = \\mathbf{648}$ lira.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — TRIANGULAR PRISM ROOF</div><div class="example-body">A triangular prism is used as a shed roof. The triangular cross-section is equilateral with side 4 m. The shed is 10 m long. Find the volume of air enclosed under the roof.<br><br>Area of equilateral triangle: $B = \\dfrac{\\sqrt{3}}{4} \\cdot 4^2 = 4\\sqrt{3} \\text{ m}^2 \\approx 6.93 \\text{ m}^2$.<br>Volume: $V = B \\cdot h = 4\\sqrt{3} \\cdot 10 = 40\\sqrt{3} \\approx \\mathbf{69.28 \\text{ m}^{3}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — DOUBLING THE EDGE</div><div class="example-body">If the edge of a cube is doubled, what happens to its volume and to its surface area?<br><br>New edge: $2a$.<br>New volume: $(2a)^3 = 8 a^3 \\implies$ volume becomes <strong>8 times</strong> larger.<br>New surface: $6(2a)^2 = 24 a^2 \\implies$ surface becomes <strong>4 times</strong> larger.<br><br>Lesson: in 3D, doubling lengths multiplies volume by 8 and surface by 4. The volume grows much faster than the surface — this is the famous "square–cube law".</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — FITTING A STICK IN A BOX</div><div class="example-body">A wooden stick is 90 cm long. Can it fit inside a box with internal dimensions 60 cm $\\times$ 40 cm $\\times$ 50 cm?<br><br>$d = \\sqrt{60^2 + 40^2 + 50^2} = \\sqrt{3600 + 1600 + 2500} = \\sqrt{7700} \\approx \\mathbf{87.75 \\text{ cm}}$.<br><br>Since 90 cm $>$ 87.75 cm, the stick does <strong>not</strong> fit, even along the space diagonal.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — WRAPPING A GIFT</div><div class="example-body">A gift box is a cuboid of $20 \\text{ cm} \\times 15 \\text{ cm} \\times 10 \\text{ cm}$. Wrapping paper costs 0.05 lira per square centimetre. Ignoring overlap, what is the minimum wrapping-paper cost?<br><br>$S = 2(20 \\cdot 15 + 20 \\cdot 10 + 15 \\cdot 10) = 2(300 + 200 + 150) = 2 \\cdot 650 = 1300 \\text{ cm}^2$.<br>Cost: $1300 \\cdot 0.05 = \\mathbf{65}$ lira.</div></div>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WRONG</div><div class="compare-item">Surface area of cube = $a^2$ (forgetting the factor 6 because there are 6 faces)</div><div class="compare-item">Volume in cm but surface in m (mixing units)</div><div class="compare-item">Space diagonal $= l + w + h$ (adding instead of using Pythagoras)</div><div class="compare-item">Treating volume and surface as interchangeable in word problems</div></div><div class="compare-col"><div class="compare-title">RIGHT</div><div class="compare-item">Surface area of cube = $6 a^2$ (six identical faces, each of area $a^2$)</div><div class="compare-item">Stick to one unit system throughout, convert at the end if needed</div><div class="compare-item">Space diagonal $= \\sqrt{l^2 + w^2 + h^2}$ (Pythagoras applied twice)</div><div class="compare-item">Volume measures "how much space inside" (units of length$^3$). Surface measures "how much skin outside" (units of length$^2$). Different physical quantities.</div></div></div>

<div class="l-note"><strong>Always check units.</strong> Volume answers must end in cm³, m³, or some other length-cubed unit. Surface-area answers must end in cm², m², or some other length-squared unit. If your answer has the wrong exponent on the unit, you have made an error somewhere — often forgetting a factor or multiplying when you should have added.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Polyhedra obey Euler's formula $V - E + F = 2$ (any closed convex polyhedron)</li>
<li>Cube: $V = a^3$, $S = 6 a^2$, face diagonal $a\\sqrt{2}$, space diagonal $a\\sqrt{3}$</li>
<li>Cuboid: $V = lwh$, $S = 2(lw + lh + wh)$, space diagonal $\\sqrt{l^2 + w^2 + h^2}$</li>
<li>General prism: $V = B \\cdot h$ and $S = 2B + P \\cdot h$ (base area $B$, base perimeter $P$, height $h$)</li>
<li>The cube has 11 distinct nets and cross-sections that can be triangles, rectangles, or hexagons</li>
<li>Doubling an edge multiplies volume by 8 and surface by 4 (the square-cube law)</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Katı cisimler geometrisi, düzlem geometrinin düz şekilleriyle gerçekten içinde yaşadığın üç boyutlu dünya arasındaki köprüdür.</strong> Şimdiye kadar paketlediğin her kutu, doldurduğun her akvaryum, saydığın her tuğla duvar bir katı cisim geometrisi alıştırmasıdır. Kâğıt üzerinde hesapladığın hacim ve yüzey alanı, bir ustabaşının beton siparişinde veya bir paketleyicinin koli ölçüsünde kullandığı sayıların aynısıdır.</p>

<p class="l-text">Bu ders tek bir katı cisim ailesine odaklanır: <em>prizmalar</em>. Prizma, hâlâ ilginç bir yapıya sahip olan en basit üç boyutlu şekildir — bir düzlem çokgenin (taban) iki paralel kopyası, dikdörtgen yan yüzlerle birbirine bağlanır. Dersin sonunda küp, dikdörtgenler prizması ve üçgen prizma arasında rahatça geçiş yapacaksın, hacim ve yüzey alanının boyutlara nasıl bağlı olduğunu kesin bir şekilde bileceksin ve köşegenleri, kesitleri ve açılımları (net) bir bakışta tanıyabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çok yüzlü (polyhedron) cismi tanımlamayı ve küçük örneklerde Euler bağıntısı $V - E + F = 2$'yi doğrulamayı</li>
<li>Bir küpün hacmini ve yüzey alanını ayrıt uzunluğundan hesaplamayı, Pisagor teoremi ile yüz ve uzay köşegenlerini bulmayı</li>
<li>Bir dikdörtgenler prizmasının (kuboid) hacmini ve yüzey alanını üç kenarından hesaplamayı</li>
<li>Genel prizma formülleri $V = B \\cdot h$ ve $S = 2B + P \\cdot h$'yi üçgen ve diğer prizmalara uygulamayı</li>
<li>Küpün 11 farklı açılımını tanımayı ve olası kesitleri (üçgen, dikdörtgen, altıgen) tarif etmeyi</li>
<li>Gündelik problemleri (havuz, boya, paketleme) prizma hesaplarına çevirmeyi ve birim tutarlılığını korumayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Çok Yüzlüler ve Euler Bağıntısı</h2>

<div class="calc-highlight"><strong>Çok yüzlü (polyhedron), düz çokgen yüzlerden, bunların doğru ayrıtlarda ve köşelerde birleşmesiyle oluşan bir katı cisimdir.</strong> Prizmalar, küpler, piramitler ve ünlü Platonik katılar hep birer çok yüzlüdür. Kelime kelimesi kelimesine "çok yüzlü" anlamına gelir, Yunanca <em>poly</em> + <em>hedron</em>.</div>

<p class="l-text">Her kapalı dışbükey çok yüzlü, 18. yüzyılda Leonhard Euler tarafından keşfedilen basit bir sayım yasasına uyar. Köşeleri $V$, ayrıtları $E$, yüzleri $F$ ile sayalım. O zaman:</p>

<div class="calc-formula"><div class="formula-label">EULER ÇOK YÜZLÜ BAĞINTISI</div><div class="formula-main">$$V \\;-\\; E \\;+\\; F \\;=\\; 2$$</div><div class="formula-sub">Her kapalı dışbükey çok yüzlü için geçerlidir — küp, dörtyüzlü, üçgen prizma, piramit, futbol topu... düz yüzlerden delik olmadan kurulan her şey.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Köşe (V)</div><div class="card-body">Ayrıtların birleştiği nokta. Bir küpün 8 köşesi vardır.</div></div>
<div class="calc-card"><div class="card-title">Ayrıt (E)</div><div class="card-body">İki yüzün birleştiği doğru parçası. Bir küpün 12 ayrıtı vardır.</div></div>
<div class="calc-card"><div class="card-title">Yüz (F)</div><div class="card-body">Katı cismin sınırını oluşturan düz çokgen. Bir küpün 6 yüzü vardır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir <strong>küp</strong> için Euler bağıntısını doğrula.<br><br>$V = 8$, $E = 12$, $F = 6$. Bu durumda $V - E + F = 8 - 12 + 6 = \\mathbf{2}$. Bağıntı sağlanır.<br><br>Şimdi bir <strong>üçgen prizma</strong> dene: $V = 6$, $E = 9$, $F = 5$. $6 - 9 + 5 = \\mathbf{2}$. Yine doğru.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir kare piramidin kare bir tabanı ve tepede tek bir noktada birleşen dört üçgen yüzü vardır. $V$, $E$, $F$ değerlerini say ve Euler bağıntısını kontrol et. (Cevap: $V = 5$, $E = 8$, $F = 5$, yani $5 - 8 + 5 = 2$.)</div></div>

<h2 class="lesson-title">2. Küp</h2>

<div class="calc-highlight"><strong>Küp, kusursuz simetrik bir prizmadır.</strong> Bütün on iki ayrıtı aynı uzunlukta $a$'dır, altı yüzü eş karelerdir ve her köşesi diğeriyle aynı görünür. Küpü anlarsan, katı cisim geometrisinin yarısı arkasından gelir.</div>

<p class="l-text">$a$ ayrıt uzunluğunu göstersin. Küpün üç temel niceliği vardır ve bunları düşünmeden yazabilmelisin:</p>

<div class="calc-formula"><div class="formula-label">KÜP — HACİM VE YÜZEY ALANI</div><div class="formula-main">$$V \\;=\\; a^{3} \\qquad\\qquad S \\;=\\; 6 a^{2}$$</div><div class="formula-sub">Hacim "ayrıtın küpü"dür çünkü küp $a$ uzunluk, $a$ genişlik, $a$ yükseklikte bir bölgeyi doldurur. Yüzey alanı "6 çarpı bir yüz"dür çünkü altı özdeş kare yüz vardır.</div></div>

<p class="l-text"><strong>Neden $V = a^3$?</strong> Küpü $1$ birim ayrıtlı küçük küplere böl: $a \\times a \\times a$ tane küçük küp oluşur. Her birinin hacmi 1'dir. Toplam hacim $a^3$'tür. Aynı muhakeme, "küçük birim küpler"in yerine soyut hacim tanımı geçtiğinde her pozitif reel ayrıt uzunluğu için işler.</p>

<p class="l-text"><strong>Neden $S = 6 a^2$?</strong> Küpün 6 yüzü vardır. Her yüz $a$ kenarlı bir karedir, alanı $a^2$'dir. 6 yüz $\\times$ bir yüz alanı $a^2$ = $6a^2$. 6 katsayısını unutmak, öğrencilerin yaptığı en yaygın yüzey alanı hatasıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yüz köşegeni</div><div class="card-body">Bir kare yüzün köşegeni. 2B Pisagor kullanılarak: $d_{\\text{yuz}} = a\\sqrt{2}$.</div></div>
<div class="calc-card"><div class="card-title">Uzay köşegeni</div><div class="card-body">Bir köşeden karşı köşeye, küpün içinden geçen köşegen. 3B Pisagor kullanılarak: $d_{\\text{uzay}} = a\\sqrt{3}$.</div></div>
<div class="calc-card"><div class="card-title">Simetri</div><div class="card-body">Bir küpün 48 simetrisi vardır: 24 dönme artı 24 yansıma. En simetrik prizma.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">KÜP KÖŞEGENLERİ</div><div class="formula-main">$$d_{\\text{yuz}} \\;=\\; a\\sqrt{2} \\qquad\\qquad d_{\\text{uzay}} \\;=\\; a\\sqrt{3}$$</div><div class="formula-sub">Yüz köşegeni = ayrıt $\\times \\sqrt{2}$. Uzay köşegeni = ayrıt $\\times \\sqrt{3}$. Her ikisi de Pisagor teoreminin sırayla bir ve iki kez uygulanmasından gelir.</div></div>

<p class="l-text"><strong>Uzay köşegeninin türetilmesi.</strong> Küpün bir köşesini seç ve karşı köşeye yürü. Önce uzunluğu $a$ olan bir ayrıt boyunca git, sonra dik açıyla başka bir $a$ uzunluğunda ayrıt boyunca git — bir yüz köşegeni izledin, uzunluğu $a\\sqrt{2}$. Şimdi düşey olarak $a$ kadar daha çık. Başlangıç ile bitiş arasındaki düz çizgi mesafesi $\\sqrt{(a\\sqrt{2})^2 + a^2} = \\sqrt{2a^2 + a^2} = \\sqrt{3a^2} = a\\sqrt{3}$.</p>

<div class="calc-graph"><div id="plot-l89-cube-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 3B'de ayrıt uzunluğu 1 olan bir küp. 12 ayrıt açık gri renkte çizilmiş. Kırmızı kesik çizgi bir yüz köşegenini gösteriyor (uzunluk $\\sqrt{2}$). Mavi düz çizgi $(0,0,0)$'dan $(1,1,1)$'e uzay köşegenini gösteriyor (uzunluk $\\sqrt{3}$). Üç köşegeni de net görmek için fareyle döndür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var vx=[0,1,1,0,0,0,1,1,0,0,1,1,1,1,0,0];
var vy=[0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,1];
var vz=[0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0];
var edgesTR={x:vx,y:vy,z:vz,mode:'lines',type:'scatter3d',name:'küp ayrıtları',line:{color:'rgba(232,232,232,0.7)',width:5}};
var faceDiagTR={x:[0,1],y:[0,1],z:[0,0],mode:'lines',type:'scatter3d',name:'yüz köşegeni a√2',line:{color:'#ef4444',width:6,dash:'dash'}};
var spaceDiagTR={x:[0,1],y:[0,1],z:[0,1],mode:'lines',type:'scatter3d',name:'uzay köşegeni a√3',line:{color:'#3b82f6',width:7}};
var cornersTR={x:[0,1,1,0,0,1,1,0],y:[0,0,1,1,0,0,1,1],z:[0,0,0,0,1,1,1,1],mode:'markers',type:'scatter3d',name:'köşeler',marker:{color:'#f59e0b',size:4}};
var layCubeTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},aspectmode:'cube'},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l89-cube-tr',[edgesTR,faceDiagTR,spaceDiagTR,cornersTR],layCubeTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Hızlı zihinsel kontrol:</strong> birim küp için ($a = 1$) yüz köşegeni $\\sqrt{2} \\approx 1.414$, uzay köşegeni $\\sqrt{3} \\approx 1.732$. Uzay köşegeni her zaman bir küpün içine sığan en uzun doğrudur — ince bir cismin bir kutunun içine sığıp sığmayacağı sorulduğunda işe yarar.</div>

<h2 class="lesson-title">3. Dikdörtgenler Prizması (Kuboid)</h2>

<div class="calc-highlight"><strong>Dikdörtgenler prizması — kuboid veya kutu olarak da bilinir — üç kenar uzunluğunun farklı olmasına izin verilirse küpün dönüştüğü şekildir.</strong> Üç ayrıt uzunluğu: $l$ (uzunluk), $w$ (genişlik), $h$ (yükseklik). Altı yüz var, ama şimdi üç eş çift hâlinde: ikişer adet $l \\times w$, $l \\times h$ ve $w \\times h$ büyüklüğünde.</div>

<div class="calc-formula"><div class="formula-label">KUBOİD — HACİM VE YÜZEY ALANI</div><div class="formula-main">$$V \\;=\\; l \\cdot w \\cdot h \\qquad\\qquad S \\;=\\; 2(lw + lh + wh)$$</div><div class="formula-sub">Hacim üç ayrıtın çarpımıdır. Yüzey alanı üç farklı yüz çiftinin alanlarını toplar ve sonucu ikiyle çarpar (her yüz iki kez geçer, kutunun her iki yanında).</div></div>

<p class="l-text"><strong>Küple tutarlılık kontrolü.</strong> $l = w = h = a$ olsun. O zaman $V = a \\cdot a \\cdot a = a^3$ ve $S = 2(a^2 + a^2 + a^2) = 6a^2$. Küp formülleri özel durum olarak ortaya çıkar. Tam istediğimiz şey: daha genel bir formül, daha basit formülün uygulandığı her durumda onunla uyumlu olmalıdır.</p>

<p class="l-text"><strong>Kuboidin uzay köşegeni.</strong> Daha önceki Pisagor argümanı, iki kez uygulanarak:</p>

<div class="calc-formula"><div class="formula-label">KUBOİD UZAY KÖŞEGENİ</div><div class="formula-main">$$d \\;=\\; \\sqrt{l^{2} + w^{2} + h^{2}}$$</div><div class="formula-sub">Bir kutunun bir köşesinden karşı köşesine olan düz çizgi mesafesi. $l = w = h = a$ olduğunda $a\\sqrt{3}$'e indirgenir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir dikdörtgen kutunun boyutları $l = 6$ cm, $w = 4$ cm, $h = 3$ cm.<br><br>Hacim: $V = 6 \\cdot 4 \\cdot 3 = \\mathbf{72 \\text{ cm}^{3}}$.<br>Yüzey alanı: $S = 2(6 \\cdot 4 + 6 \\cdot 3 + 4 \\cdot 3) = 2(24 + 18 + 12) = 2 \\cdot 54 = \\mathbf{108 \\text{ cm}^{2}}$.<br>Uzay köşegeni: $d = \\sqrt{36 + 16 + 9} = \\sqrt{61} \\approx \\mathbf{7.81 \\text{ cm}}$.</div></div>

<div class="calc-graph"><div id="plot-l89-cuboid-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $l = 3$, $w = 2$, $h = 1$ boyutlarında bir kuboid. Üç kenar uzunluğu üç farklı ayrıt boyunca etiketlenmiş — böylece her boyutun hacme ve yüzey alanına nasıl katkıda bulunduğunu bir bakışta görebilirsin. Döndürmek için fareyle sürükle.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var L=3,W=2,H=1;
var bx=[0,L,L,0,0,0,L,L,0,0,L,L,L,L,0,0];
var by=[0,0,W,W,0,0,0,W,W,0,0,0,W,W,W,W];
var bz=[0,0,0,0,0,H,H,H,H,H,H,0,0,H,H,0];
var edgesCT={x:bx,y:by,z:bz,mode:'lines',type:'scatter3d',name:'kuboid ayrıtları',line:{color:'rgba(232,232,232,0.75)',width:5}};
var labelsCT={x:[L/2,L,0],y:[0,W/2,W],z:[0,0,H/2],mode:'text',type:'scatter3d',name:'boyutlar',text:['l = 3','w = 2','h = 1'],textfont:{color:'#3b82f6',size:14}};
var cornersCT={x:[0,L,L,0,0,L,L,0],y:[0,0,W,W,0,0,W,W],z:[0,0,0,0,H,H,H,H],mode:'markers',type:'scatter3d',name:'köşeler',marker:{color:'#f59e0b',size:4},showlegend:false};
var layCT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},aspectmode:'data'},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l89-cuboid-tr',[edgesCT,labelsCT,cornersCT],layCT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Genel Prizma</h2>

<div class="calc-highlight"><strong>Prizma, iki paralel eş çokgen tabanı dikdörtgen yan yüzlerle birbirine bağlanan herhangi bir katı cisimdir.</strong> Tabanlar üçgen, beşgen, altıgen — düzlemde çizebileceğin herhangi bir çokgen olabilir. İki taban birbirinin ötelenmiş kopyasıdır ve dikdörtgenler kenarları doldurur.</div>

<p class="l-text">$B$ bir tabanın <em>alanını</em>, $h$ ise <em>yüksekliği</em> (iki taban arasındaki dik mesafe) göstersin. O zaman hacim ve yan yüzey alanı, tek ve temiz bir örüntüye uyar:</p>

<div class="calc-formula"><div class="formula-label">GENEL PRİZMA FORMÜLLERİ</div><div class="formula-main">$$V \\;=\\; B \\cdot h \\qquad\\qquad S \\;=\\; 2B \\;+\\; P \\cdot h$$</div><div class="formula-sub">$B$ = bir tabanın alanı, $h$ = iki taban arasındaki dik yükseklik, $P$ = tabanın çevresi. Yüzey alanı = iki taban + yan dikdörtgenlerden oluşan şerit.</div></div>

<p class="l-text"><strong>Yorum.</strong> Bir prizmanın hacmi "taban alanı çarpı yükseklik"tir — her biri $B$ alanlı ve sonsuz küçük kalınlıkta, $h$ kadar yığılmış eş pancake yığını fikriyle aynı. Yüzey alanı "iki taban artı yan yüzey"dir; yan yüzey ise genişliği $P$ (tabanın çevresi), yüksekliği $h$ olan büyük bir dikdörtgendir — yani yan duvarları açarsan onu elde edersin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Küp</div><div class="card-body">Taban $a^2$ alanlı kare, çevre $4a$, yükseklik $a$. $V = a^2 \\cdot a = a^3$. $S = 2 a^2 + 4a \\cdot a = 6 a^2$.</div></div>
<div class="calc-card"><div class="card-title">Kuboid</div><div class="card-body">Taban $lw$ alanlı dikdörtgen, çevre $2(l+w)$, yükseklik $h$. $V = lwh$. $S = 2lw + 2(l+w) \\cdot h = 2(lw + lh + wh)$.</div></div>
<div class="calc-card"><div class="card-title">Üçgen prizma</div><div class="card-body">Taban $B$ alanlı bir üçgen, çevre üç kenarın toplamı. Genel formüllere yerleştir — yeni bir fikre gerek yok.</div></div>
</div>

<div class="l-note"><strong>Örüntü işlemeye devam ediyor.</strong> Düzgün altıgen prizma, beş kenarlı "beşgen" prizma, hatta tabanı düzensiz bir L-şekli olan bir "prizma" bile — hepsi $V = B h$ ve $S = 2B + P h$ formüllerine uyar. Tabanın $B$ alanı ve $P$ çevresi bilindikten sonra prizma çözülmüştür.</div>

<h2 class="lesson-title">5. Üçgen Prizma</h2>

<div class="calc-highlight"><strong>Üçgen prizmanın iki üçgen tabanı vardır ve bunlar üç dikdörtgen yan yüzle birbirine bağlanır.</strong> Yan yatırılmış bir Toblerone çikolatasını ya da tipik bir çatının kesitini düşün. Toplam beş yüz (2 üçgen + 3 dikdörtgen), 6 köşe, 9 ayrıt. Euler: $6 - 9 + 5 = 2$. Tamam.</div>

<p class="l-text">Tabanı kenarları $a$, $b$, $c$ ve alanı $B$ olan üçgen, prizma yüksekliği $h$ (iki üçgen arasındaki dik mesafe) için:</p>

<div class="calc-formula"><div class="formula-label">ÜÇGEN PRİZMA</div><div class="formula-main">$$V \\;=\\; B \\cdot h \\qquad\\qquad S \\;=\\; 2 B \\;+\\; (a + b + c) \\cdot h$$</div><div class="formula-sub">Üçgen tabanın çevresi üç kenarın toplamından ibarettir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir üçgen prizmanın tabanı <em>dik üçgen</em>: dik kenarları 3 cm ve 4 cm (dolayısıyla Pisagor teoremine göre hipotenüsü 5 cm). Prizma yüksekliği 10 cm.<br><br>Taban alanı: $B = \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 6 \\text{ cm}^2$.<br>Taban çevresi: $P = 3 + 4 + 5 = 12$ cm.<br><br>Hacim: $V = 6 \\cdot 10 = \\mathbf{60 \\text{ cm}^{3}}$.<br>Yüzey alanı: $S = 2 \\cdot 6 + 12 \\cdot 10 = 12 + 120 = \\mathbf{132 \\text{ cm}^{2}}$.</div></div>

<div class="calc-graph"><div id="plot-l89-tri-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dik üçgen tabanlı (dik kenarlar 3 ve 4) ve prizma uzunluğu 6 olan bir üçgen prizma. İki paralel üçgen taban ön ve arkada duruyor; üç dikdörtgen yan yüz onları birleştiriyor. Tabanları yan dikdörtgenlerle karşılaştırmak için döndür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var TL=6;
var ax=[0,3,0,0,0,3,0,0,3,3,0,0];
var ay=[0,0,0,4,0,0,4,0,0,4,4,0];
var az=[0,0,0,0,TL,TL,TL,TL,0,0,0,TL];
var triEdgesT={x:ax,y:ay,z:az,mode:'lines',type:'scatter3d',name:'prizma ayrıtları',line:{color:'rgba(232,232,232,0.75)',width:5}};
var hypEdgesT={x:[3,0,3,0],y:[0,4,0,4],z:[0,0,TL,TL],mode:'lines',type:'scatter3d',name:'hipotenüs ayrıtları',line:{color:'#3b82f6',width:5}};
var hypLatT={x:[3,0],y:[0,4],z:[TL,TL],mode:'lines',type:'scatter3d',line:{color:'#3b82f6',width:5},showlegend:false};
var labelsTT={x:[1.5,0,0],y:[0,2,0],z:[0,0,TL/2],mode:'text',type:'scatter3d',name:'etiketler',text:['dik kenar = 3','dik kenar = 4','uzunluk = 6'],textfont:{color:'#3b82f6',size:13}};
var cornersTT={x:[0,3,0,0,3,0],y:[0,0,4,0,0,4],z:[0,0,0,TL,TL,TL],mode:'markers',type:'scatter3d',marker:{color:'#f59e0b',size:4},showlegend:false};
var layTT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a'},aspectmode:'data'},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l89-tri-tr',[triEdgesT,hypEdgesT,hypLatT,labelsTT,cornersTT],layTT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Küpün Açılımları</h2>

<div class="calc-highlight"><strong>Bir küpü bazı ayrıtları boyunca kesip düz yatırırsan bir "açılım" (net) elde edersin.</strong> Açılım, kâğıda basıp keserek katlayarak katı cisme geri çevirebileceğin 2B desendir. Küpün tam olarak <strong>11 farklı açılımı</strong> vardır — küçük bir sayı, ama her biri altı yüzü açmanın farklı bir yoluna karşılık gelir.</div>

<p class="l-text">Neden 11? Altı kare ayrıttan ayrıta sayısız desende yapıştırılabilir, ama bunların sadece bir kısmı katlandığında üst üste binmeden bir küpe geri döner. Matematikçiler bunların hepsini saymış ve dönme ile yansıma farklarını saymadan tam 11 desenin işe yaradığını ispatlamıştır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"T" deseni</div><div class="card-body">4 kareden oluşan bir sıra, ikinci ile üçüncü karenin üstünde birer kare. Klasik ilkokul açılımı.</div></div>
<div class="calc-card"><div class="card-title">"Artı" deseni</div><div class="card-body">4 kareden oluşan bir sıra, soldan ikinci karenin üstünde bir, altında bir kare. Artı işaretine benzer.</div></div>
<div class="calc-card"><div class="card-title">Diğer 9 desen</div><div class="card-body">Çeşitli L-şekilleri, S-şekilleri ve merdiven düzenlemeleri. Hepsinin toplam alanı $6a^2$'dir (altı birim yüz).</div></div>
</div>

<div class="l-note"><strong>Açılımlar neden önemli?</strong> Bir prizmanın yüzey alanını hesaplarken aslında onun açılımının toplam alanını hesaplıyorsun. Prizmayı düz bir şekle aç; dikdörtgen ve çokgen alanlarını topla; yüzey alanını elde edersin. Küpün açılımı, hangi 11 deseni seçersen seç, her zaman $6a^2$ alana sahiptir.</div>

<h2 class="lesson-title">7. Küpün Kesitleri</h2>

<div class="calc-highlight"><strong>Kesit, üç boyutlu bir katıyı bir düzlemle dilimlediğinde elde ettiğin düz 2B şekildir.</strong> Bir tereyağ bıçağı alıp bir küpten düz keçtiğini hayal et — kesim üzerinde açığa çıkan şekil kesittir ve tamamen kesme açısına bağlıdır.</div>

<p class="l-text">Bir küp şaşırtıcı biçimde farklı şekillerde kesitler üretebilir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kare</div><div class="card-body">Herhangi bir yüze paralel kes. Kesit, yüze eş bir karedir.</div></div>
<div class="calc-card"><div class="card-title">Dikdörtgen</div><div class="card-body">Bir yüze dik ama başka bir yüze açılı kes. Kesit bir dikdörtgendir (genel olarak kare değil).</div></div>
<div class="calc-card"><div class="card-title">Üçgen</div><div class="card-body">Küpün bir köşesini kes. Kesit bir üçgendir. Kesim simetrikse üçgen eşkenardır.</div></div>
<div class="calc-card"><div class="card-title">Altıgen</div><div class="card-body">Bir uzay köşegenine dik, merkezden geçecek şekilde kes. Kesit bir düzgün altıgendir — şaşırtıcı ama doğru.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Hayalî bir küpü elinde tut. 45 derece eğ. Tam yukarıdan gelen bir ışık kaynağının düşürdüğü gölgeyi hayal et. Gölgenin sınırı, yönelime bağlı olarak bir kare, dikdörtgen veya altıgen olabilir. Bu, kesit sorusuyla aslında aynı sorudur.</div></div>

<h2 class="lesson-title">8. Pisagor Teoremi ile Köşegenler</h2>

<div class="calc-highlight"><strong>Köşegenler katı cisim geometrisinin gizli silahıdır.</strong> Bir soru "A köşesi B köşesine ne kadar uzak?" veya "L uzunluğunda bir çubuk bir kutuya sığar mı?" diye sorduğunda cevapta mutlaka bir köşegen saklıdır. Kilit araç, yüz köşegenleri için 2B'de bir kez ve uzay köşegenleri için iki kez uygulanan Pisagor teoremidir.</div>

<div class="calc-formula"><div class="formula-label">YÜZ KÖŞEGENİ (2B PİSAGOR)</div><div class="formula-main">$$d_{\\text{yuz}} \\;=\\; \\sqrt{a^{2} + b^{2}}$$</div><div class="formula-sub">Kenarları $a$ ve $b$ olan bir dikdörtgen yüz için köşegen, o yüzün bir köşesinden karşı köşesine yüz boyunca gider.</div></div>

<div class="calc-formula"><div class="formula-label">UZAY KÖŞEGENİ (3B PİSAGOR)</div><div class="formula-main">$$d_{\\text{uzay}} \\;=\\; \\sqrt{l^{2} + w^{2} + h^{2}}$$</div><div class="formula-sub">Bir kuboid için uzay köşegeni içine sığan en uzun düz çizgidir. Önce yüz köşegenini elde etmek için Pisagor'u bir kez uygula, sonra üçüncü boyutla birleştirmek için bir kez daha.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">2 metre uzunluğunda bir olta, boyutları 1.5 m $\\times$ 1.2 m $\\times$ 0.8 m olan bir kutuya sığar mı?<br><br>Uzay köşegeni: $d = \\sqrt{1.5^2 + 1.2^2 + 0.8^2} = \\sqrt{2.25 + 1.44 + 0.64} = \\sqrt{4.33} \\approx \\mathbf{2.08 \\text{ m}}$.<br><br>2 m $<$ 2.08 m olduğundan olta <strong>sığar</strong> (küçük bir paylar). Uzay köşegeni boyunca yerleştirilmelidir.</div></div>

<h2 class="lesson-title">9. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — AYRITI 5 OLAN KÜP</div><div class="example-body">Bir küpün ayrıt uzunluğu 5 cm. Hacmini, yüzey alanını ve uzay köşegenini hesapla.<br><br>$V = 5^3 = \\mathbf{125 \\text{ cm}^{3}}$.<br>$S = 6 \\cdot 5^2 = 6 \\cdot 25 = \\mathbf{150 \\text{ cm}^{2}}$.<br>$d_{\\text{uzay}} = 5 \\sqrt{3} \\approx \\mathbf{8.66 \\text{ cm}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — $3 \\times 4 \\times 5$ KUBOİD</div><div class="example-body">Bir dikdörtgen kutu 3 m $\\times$ 4 m $\\times$ 5 m boyutlarındadır. Hacmini ve yüzey alanını hesapla.<br><br>$V = 3 \\cdot 4 \\cdot 5 = \\mathbf{60 \\text{ m}^{3}}$.<br>$S = 2(3 \\cdot 4 + 3 \\cdot 5 + 4 \\cdot 5) = 2(12 + 15 + 20) = 2 \\cdot 47 = \\mathbf{94 \\text{ m}^{2}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — YÜZME HAVUZU</div><div class="example-body">Dikdörtgen bir yüzme havuzu 25 m uzunluğunda, 12 m genişliğinde ve düzenli olarak 1.8 m derinliğindedir. Kaç metreküp su alır? Kaç litre?<br><br>$V = 25 \\cdot 12 \\cdot 1.8 = \\mathbf{540 \\text{ m}^{3}}$.<br><br>Bir metreküp 1000 litredir, bu yüzden havuz $540 \\cdot 1000 = \\mathbf{540{,}000}$ litre su alır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — ODAYI BOYAMA</div><div class="example-body">Bir oda 5 m uzunluğunda, 4 m genişliğinde ve 3 m yüksekliğindedir. Boyanın maliyeti metrekare başına 12 liradır ve sadece dört duvarı boyuyorsun (taban ve tavanı boyamıyorsun). Toplam boya maliyeti nedir?<br><br>Yan yüzey (sadece dört duvar): $P \\cdot h = 2(5 + 4) \\cdot 3 = 18 \\cdot 3 = 54 \\text{ m}^2$.<br>Maliyet: $54 \\cdot 12 = \\mathbf{648}$ lira.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — ÜÇGEN PRİZMA ÇATI</div><div class="example-body">Bir üçgen prizma kulübe çatısı olarak kullanılıyor. Üçgen kesit eşkenardır ve kenarı 4 m. Kulübe 10 m uzunluğunda. Çatı altında çevrelenen havanın hacmini bul.<br><br>Eşkenar üçgenin alanı: $B = \\dfrac{\\sqrt{3}}{4} \\cdot 4^2 = 4\\sqrt{3} \\text{ m}^2 \\approx 6.93 \\text{ m}^2$.<br>Hacim: $V = B \\cdot h = 4\\sqrt{3} \\cdot 10 = 40\\sqrt{3} \\approx \\mathbf{69.28 \\text{ m}^{3}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — AYRITI İKİYE KATLAMA</div><div class="example-body">Bir küpün ayrıtı ikiye katlanırsa hacmi ve yüzey alanı nasıl değişir?<br><br>Yeni ayrıt: $2a$.<br>Yeni hacim: $(2a)^3 = 8 a^3 \\implies$ hacim <strong>8 kat</strong> büyür.<br>Yeni yüzey: $6(2a)^2 = 24 a^2 \\implies$ yüzey <strong>4 kat</strong> büyür.<br><br>Ders: 3B'de uzunlukları ikiye katlamak hacmi 8, yüzeyi 4 ile çarpar. Hacim yüzeyden çok daha hızlı büyür — ünlü "kare-küp yasası".</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — KUTUYA ÇUBUK SIĞDIRMA</div><div class="example-body">Tahta bir çubuk 90 cm uzunluğundadır. İç boyutları 60 cm $\\times$ 40 cm $\\times$ 50 cm olan bir kutuya sığar mı?<br><br>$d = \\sqrt{60^2 + 40^2 + 50^2} = \\sqrt{3600 + 1600 + 2500} = \\sqrt{7700} \\approx \\mathbf{87.75 \\text{ cm}}$.<br><br>90 cm $>$ 87.75 cm olduğundan çubuk uzay köşegeni boyunca bile <strong>sığmaz</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — HEDİYE PAKETLEME</div><div class="example-body">Bir hediye kutusu $20 \\text{ cm} \\times 15 \\text{ cm} \\times 10 \\text{ cm}$ boyutlarında bir kuboiddir. Ambalaj kâğıdı santimetrekare başına 0.05 lira. Üst üste binmeleri yok sayarsak minimum ambalaj maliyeti nedir?<br><br>$S = 2(20 \\cdot 15 + 20 \\cdot 10 + 15 \\cdot 10) = 2(300 + 200 + 150) = 2 \\cdot 650 = 1300 \\text{ cm}^2$.<br>Maliyet: $1300 \\cdot 0.05 = \\mathbf{65}$ lira.</div></div>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YANLIŞ</div><div class="compare-item">Küpün yüzey alanı = $a^2$ (6 yüz olduğu için 6 katsayısını unutmak)</div><div class="compare-item">Hacim cm'de ama yüzey m'de (birimleri karıştırmak)</div><div class="compare-item">Uzay köşegeni $= l + w + h$ (Pisagor yerine toplama)</div><div class="compare-item">Hacim ile yüzeyi problemde birbirinin yerine kullanmak</div></div><div class="compare-col"><div class="compare-title">DOĞRU</div><div class="compare-item">Küpün yüzey alanı = $6 a^2$ (her biri $a^2$ alanlı altı eş yüz)</div><div class="compare-item">Tek bir birim sistemine bağlı kal, gerekirse en sonda dönüştür</div><div class="compare-item">Uzay köşegeni $= \\sqrt{l^2 + w^2 + h^2}$ (Pisagor iki kez uygulanır)</div><div class="compare-item">Hacim "içerideki yer"i ölçer (uzunluk$^3$ birimi). Yüzey "dışarıdaki kabuğu" ölçer (uzunluk$^2$ birimi). Farklı fiziksel niceliklerdir.</div></div></div>

<div class="l-note"><strong>Birimleri her zaman kontrol et.</strong> Hacim cevapları cm³, m³ veya başka bir uzunluk-küp birimiyle bitmelidir. Yüzey alanı cevapları cm², m² veya başka bir uzunluk-kare birimiyle bitmelidir. Cevabının birim üssü yanlışsa bir yerde hata yapmışsındır — genellikle bir katsayıyı unutarak veya toplamak gereken yerde çarparak.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çok yüzlüler Euler bağıntısı $V - E + F = 2$'ye uyar (kapalı dışbükey her çok yüzlü için)</li>
<li>Küp: $V = a^3$, $S = 6 a^2$, yüz köşegeni $a\\sqrt{2}$, uzay köşegeni $a\\sqrt{3}$</li>
<li>Kuboid: $V = lwh$, $S = 2(lw + lh + wh)$, uzay köşegeni $\\sqrt{l^2 + w^2 + h^2}$</li>
<li>Genel prizma: $V = B \\cdot h$ ve $S = 2B + P \\cdot h$ (taban alanı $B$, taban çevresi $P$, yükseklik $h$)</li>
<li>Küpün 11 farklı açılımı ve üçgen, dikdörtgen veya altıgen olabilen kesitleri vardır</li>
<li>Ayrıtı ikiye katlamak hacmi 8, yüzeyi 4 ile çarpar (kare-küp yasası)</li>
</ul>
</div>`
};
