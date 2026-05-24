window.LISE_MAT_L92 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Geometry is not just about static shapes — it is about how shapes <em>move</em>.</strong> Slide a triangle across the page, spin it around a pin, hold it up to a mirror: each of these is a <em>transformation</em>, a rule that takes every point of a figure and produces a new point. The triangle still has the same three sides and the same three angles, but it sits in a different place. This lesson is about the three transformations that preserve all distances — translation, rotation and reflection — together with their non-isometric cousin, scaling.</p>

<p class="l-text">By the end of this lesson you will be able to write down the coordinate formulas for every basic transformation, compose transformations and predict the result, recognise that two reflections through intersecting lines is a rotation, and read off the symmetry group of a regular polygon. These ideas are the entry point to linear algebra, computer graphics, robotics and crystallography — and they will be everywhere in the rest of high-school geometry.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define an <em>isometry</em> as a transformation that preserves all distances</li>
<li>Apply the coordinate formulas for translation, rotation about the origin, rotation about an arbitrary point, and reflection across any straight line</li>
<li>Distinguish scaling (dilation) from isometries and explain why it changes lengths</li>
<li>Compose two or more transformations and use the rule that <em>order matters</em></li>
<li>Recognise the theorem: two reflections through intersecting lines compose to a rotation whose angle is twice the angle between the lines</li>
<li>Read off the symmetry group of an equilateral triangle, a square, and a regular n-gon</li>
</ul>
</div>

<h2 class="lesson-title">1. Isometries: Motions That Preserve Distance</h2>

<div class="calc-highlight"><strong>An isometry is a rule that moves every point of the plane to a new point without stretching or squashing any distance.</strong> If two points are 5 cm apart before the motion, they are still exactly 5 cm apart afterwards. The English word comes from Greek: <em>iso</em> (same) + <em>metron</em> (measure). The four rigid motions of the plane — translation, rotation, reflection and glide reflection — are the only isometries that exist. Every other transformation either changes lengths (scaling), angles (shear), or both.</div>

<p class="l-text">Because distances are preserved, every isometry also preserves <strong>angles</strong>, <strong>areas</strong> and <strong>shapes</strong>. A triangle stays a triangle of the same area; a circle stays a circle of the same radius. The figure looks exactly the same — only its location and orientation have changed. This is why pushing a piece of paper across a desk does not deform whatever is drawn on it, no matter how complicated the drawing is.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION &mdash; ISOMETRY</div><div class="formula-main">$$T : \\mathbb{R}^2 \\to \\mathbb{R}^2 \\quad\\text{is an isometry if}\\quad |T(P) - T(Q)| = |P - Q| \\;\\; \\text{for all } P, Q.$$</div><div class="formula-sub">Distance between any two image points equals the distance between the original points. Lengths, angles, areas all preserved.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Translation</div><div class="card-body">Slide every point by the same vector. No rotation, no flipping. Direction and orientation stay the same.</div></div>
<div class="calc-card"><div class="card-title">Rotation</div><div class="card-body">Spin every point around a fixed centre by a fixed angle. Orientation preserved (left hands stay left hands).</div></div>
<div class="calc-card"><div class="card-title">Reflection</div><div class="card-body">Flip every point across a fixed line (the mirror). Orientation <em>reversed</em> — left becomes right.</div></div>
</div>

<div class="l-note"><strong>Direct vs indirect isometries.</strong> Translations and rotations preserve orientation: a clockwise label stays clockwise. Reflections reverse it. This is why your reflection in a bathroom mirror has its hair parted on the opposite side. Two reflections, however, restore orientation — which is the secret behind a famous theorem we will prove in section 9.</div>

<h2 class="lesson-title">2. Translation (Öteleme)</h2>

<div class="calc-highlight"><strong>A translation slides every point by the same vector.</strong> If the vector is $\\vec{v} = (a, b)$, then any point $(x, y)$ goes to $(x+a, y+b)$. There is no centre and no axis — just a single offset that applies uniformly. The figure as a whole moves; its shape, size and orientation do not change at all.</div>

<div class="calc-formula"><div class="formula-label">TRANSLATION FORMULA</div><div class="formula-main">$$T_{(a,b)}(x, y) \\;=\\; (x + a, \\, y + b)$$</div><div class="formula-sub">Add a to every x-coordinate, add b to every y-coordinate. The translation vector $(a,b)$ tells you where the origin would go.</div></div>

<p class="l-text">Geometrically, every point follows the same arrow. If you draw a faint copy of the translation vector at three different vertices of a triangle, you get three parallel arrows of equal length. That is the visual fingerprint of a translation.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Translate the triangle with vertices A(1, 1), B(4, 1), C(2, 3) by the vector (2, 3).</strong><br><br>$A(1, 1) \\to A'(1+2, 1+3) = (3, 4)$.<br>$B(4, 1) \\to B'(4+2, 1+3) = (6, 4)$.<br>$C(2, 3) \\to C'(2+2, 3+3) = (4, 6)$.<br><br>Check: $|AB| = 3$ originally; $|A'B'| = |6-3| = 3$. Distance preserved, so the motion is indeed an isometry.</div></div>

<div class="calc-graph"><div id="plot-l92-trans-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the original triangle (blue) and its translated copy (orange) after applying the translation vector $(2, 3)$. Notice every vertex has moved by the same arrow — that uniform parallel shift is the hallmark of a translation.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var triX=[1,4,2,1];var triY=[1,1,3,1];
var triX2=[3,6,4,3];var triY2=[4,4,6,4];
var orig={x:triX,y:triY,mode:'lines+markers',name:'original',line:{color:'#3b82f6',width:3},marker:{size:8,color:'#3b82f6'}};
var moved={x:triX2,y:triY2,mode:'lines+markers',name:'translated',line:{color:'#f59e0b',width:3},marker:{size:8,color:'#f59e0b'}};
var arrowsX=[];var arrowsY=[];
for(var i=0;i<3;i++){arrowsX.push(triX[i],triX2[i],null);arrowsY.push(triY[i],triY2[i],null);}
var arrows={x:arrowsX,y:arrowsY,mode:'lines',name:'translation vectors',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dot'}};
var labels={x:[1,4,2,3,6,4],y:[0.5,0.5,3.5,4.5,4.5,6.5],mode:'text',name:'',text:['A','B','C',"A'","B'","C'"],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l92-trans-en',[orig,moved,arrows,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Identity translation.</strong> The translation by the zero vector $(0, 0)$ leaves every point exactly where it was. This is called the <em>identity transformation</em> $I$, and it is the "do nothing" element of the group of isometries. Every translation has an inverse: the translation by $(-a, -b)$ undoes the translation by $(a, b)$.</div>

<h2 class="lesson-title">3. Rotation About the Origin</h2>

<div class="calc-highlight"><strong>A rotation spins every point around a fixed centre by a fixed angle.</strong> When the centre is the origin and the angle is $\\theta$ (measured counter-clockwise from the positive x-axis), the coordinate formula uses sine and cosine. This is where trigonometry meets geometry — the unit-circle identities you learned in lesson 1 are exactly the numbers you need now.</div>

<div class="calc-formula"><div class="formula-label">ROTATION ABOUT THE ORIGIN BY ANGLE &theta;</div><div class="formula-main">$$R_\\theta(x, y) \\;=\\; (x\\cos\\theta - y\\sin\\theta, \\;\\; x\\sin\\theta + y\\cos\\theta)$$</div><div class="formula-sub">CCW for positive &theta;, CW for negative &theta;. The centre of rotation is fixed; everything else moves on a circle.</div></div>

<p class="l-text"><strong>Where does this formula come from?</strong> Write the point $(x, y)$ in polar form: $x = r\\cos\\alpha$, $y = r\\sin\\alpha$. Rotating by $\\theta$ adds $\\theta$ to the polar angle, so the new point sits at angle $\\alpha + \\theta$ at the same distance $r$. The angle-sum identities (lesson 1 carries them over) then give the cartesian formula directly.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rotation by 90&deg; CCW</div><div class="card-body">$\\cos 90^\\circ = 0$, $\\sin 90^\\circ = 1$, so $(x, y) \\to (-y, x)$. Memorise this — it is the most common rotation in graphics and physics.</div></div>
<div class="calc-card"><div class="card-title">Rotation by 180&deg;</div><div class="card-body">$\\cos 180^\\circ = -1$, $\\sin 180^\\circ = 0$, so $(x, y) \\to (-x, -y)$. Same as point reflection through the origin.</div></div>
<div class="calc-card"><div class="card-title">Rotation by 270&deg; CCW (= 90&deg; CW)</div><div class="card-body">$\\cos 270^\\circ = 0$, $\\sin 270^\\circ = -1$, so $(x, y) \\to (y, -x)$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body"><strong>Rotate the point $(1, 0)$ by 90&deg; CCW about the origin.</strong><br><br>Plug in $\\theta = 90^\\circ$: $x' = 1 \\cdot 0 - 0 \\cdot 1 = 0$, $y' = 1 \\cdot 1 + 0 \\cdot 0 = 1$. Result: <strong>$(0, 1)$</strong>.<br><br>Geometric check: the point on the unit circle at angle 0&deg; rotates to the point at angle 90&deg;, which is at the top of the circle. Matches.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body"><strong>Rotate the point $(3, 2)$ by 60&deg; CCW about the origin.</strong><br><br>$\\cos 60^\\circ = 1/2$, $\\sin 60^\\circ = \\sqrt{3}/2$.<br>$x' = 3 \\cdot \\dfrac{1}{2} - 2 \\cdot \\dfrac{\\sqrt{3}}{2} = \\dfrac{3 - 2\\sqrt{3}}{2} \\approx -0.232$.<br>$y' = 3 \\cdot \\dfrac{\\sqrt{3}}{2} + 2 \\cdot \\dfrac{1}{2} = \\dfrac{3\\sqrt{3} + 2}{2} \\approx 3.598$.<br><br>Distance check: $\\sqrt{3^2 + 2^2} = \\sqrt{13}$. Image: $\\sqrt{0.232^2 + 3.598^2} \\approx \\sqrt{13}$. Distance preserved.</div></div>

<div class="calc-graph"><div id="plot-l92-rot-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same triangle rotated by 90&deg; CCW about the origin. Vertex A at $(2, 1)$ maps to $(-1, 2)$, and so on. Every point moves on a circular arc centred at the origin; the radius of each arc is the distance from the original vertex to the origin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var triX=[2,4,3,2];var triY=[1,1,3,1];
var theta=Math.PI/2;
var rX=[];var rY=[];
for(var i=0;i<triX.length;i++){var nx=triX[i]*Math.cos(theta)-triY[i]*Math.sin(theta);var ny=triX[i]*Math.sin(theta)+triY[i]*Math.cos(theta);rX.push(nx);rY.push(ny);}
var orig={x:triX,y:triY,mode:'lines+markers',name:'original',line:{color:'#3b82f6',width:3},marker:{size:8,color:'#3b82f6'}};
var rotated={x:rX,y:rY,mode:'lines+markers',name:'rotated 90° CCW',line:{color:'#f59e0b',width:3},marker:{size:8,color:'#f59e0b'}};
var arcs={x:[],y:[],mode:'lines',name:'rotation arcs',line:{color:'rgba(255,255,255,0.35)',width:1.2,dash:'dot'}};
for(var k=0;k<3;k++){var r=Math.sqrt(triX[k]*triX[k]+triY[k]*triY[k]);var a0=Math.atan2(triY[k],triX[k]);for(var j=0;j<=30;j++){var a=a0+theta*j/30;arcs.x.push(r*Math.cos(a));arcs.y.push(r*Math.sin(a));}arcs.x.push(null);arcs.y.push(null);}
var origin={x:[0],y:[0],mode:'markers+text',name:'centre',marker:{color:'#ef4444',size:9},text:['O'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var labels={x:[2,4,3,rX[0],rX[1],rX[2]],y:[0.5,0.5,3.4,rY[0]+0.4,rY[1]+0.4,rY[2]+0.4],mode:'text',name:'',text:['A','B','C',"A'","B'","C'"],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l92-rot-en',[orig,rotated,arcs,origin,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Rotation About an Arbitrary Point</h2>

<div class="calc-highlight"><strong>If the centre of rotation is not the origin, use a three-step trick:</strong> shift so the centre lands at the origin, rotate, shift back. Concretely, to rotate by $\\theta$ about $(c_x, c_y)$: subtract $(c_x, c_y)$ from your point, apply the origin-rotation formula, then add $(c_x, c_y)$ back.</div>

<div class="calc-formula"><div class="formula-label">ROTATION ABOUT (c_x, c_y) BY ANGLE &theta;</div><div class="formula-main">$$x' = c_x + (x - c_x)\\cos\\theta - (y - c_y)\\sin\\theta$$ $$y' = c_y + (x - c_x)\\sin\\theta + (y - c_y)\\cos\\theta$$</div><div class="formula-sub">Same formula as before, but applied to the offset $(x - c_x, y - c_y)$, then the centre is added back.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Rotate $(5, 3)$ by 90&deg; CCW about the point $(2, 1)$.</strong><br><br>Step 1 (shift): $(5-2, 3-1) = (3, 2)$.<br>Step 2 (rotate by 90&deg;: $(x, y) \\to (-y, x)$): $(3, 2) \\to (-2, 3)$.<br>Step 3 (shift back): $(-2+2, 3+1) = (0, 4)$.<br><br>Answer: <strong>$(0, 4)$</strong>.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Why does the shift-rotate-shift trick work? Because the rotation formula about the origin only knows how to spin around $(0,0)$. By shifting first, we put the centre <em>at</em> the origin so the formula can do its job; then we slide everything back. This "conjugation by translation" trick reappears in linear algebra (similar matrices) and in physics (changing reference frames).</div></div>

<h2 class="lesson-title">5. Reflection (Yansıma)</h2>

<div class="calc-highlight"><strong>A reflection flips every point across a fixed line, the <em>mirror line</em>.</strong> The image lies on the opposite side of the line, at the same perpendicular distance. Reflections are isometries — distances are preserved — but they are <em>indirect</em>: they reverse orientation, so a clockwise label becomes a counter-clockwise label.</div>

<p class="l-text">Three reflections appear so often that you should memorise their formulas:</p>

<div class="calc-formula"><div class="formula-label">THREE STANDARD REFLECTIONS</div><div class="formula-main">$$\\text{across the x-axis:} \\quad (x, y) \\to (x, -y)$$ $$\\text{across the y-axis:} \\quad (x, y) \\to (-x, y)$$ $$\\text{across the line } y = x: \\quad (x, y) \\to (y, x)$$</div><div class="formula-sub">The x-axis flips the sign of y; the y-axis flips the sign of x; the line $y = x$ swaps the two coordinates.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Across the x-axis</div><div class="card-body">$(3, 4) \\to (3, -4)$. Points above the x-axis land below it at the same distance.</div></div>
<div class="calc-card"><div class="card-title">Across the y-axis</div><div class="card-body">$(3, 4) \\to (-3, 4)$. Points right of the y-axis land left of it at the same distance.</div></div>
<div class="calc-card"><div class="card-title">Across $y = x$</div><div class="card-body">$(3, 4) \\to (4, 3)$. Inverse functions in algebra are exactly this reflection.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Reflect the point $(3, 4)$ across the y-axis.</strong><br><br>Apply $(x, y) \\to (-x, y)$: $(3, 4) \\to (-3, 4)$. The point has hopped to the mirror-image position across the vertical axis. Distance to the y-axis was 3 before and is 3 after — the mirror line is the perpendicular bisector of the segment joining a point to its image.</div></div>

<div class="calc-graph"><div id="plot-l92-refl-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the original triangle (blue) reflected across the y-axis (the vertical dashed mirror line). The image (orange) lies on the opposite side; corresponding vertices are at equal perpendicular distance from the mirror. The orientation has flipped — if you read A, B, C clockwise originally, you now read them counter-clockwise in the image.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var triX=[2,5,3,2];var triY=[1,2,4,1];
var refX=[];var refY=[];
for(var i=0;i<triX.length;i++){refX.push(-triX[i]);refY.push(triY[i]);}
var orig={x:triX,y:triY,mode:'lines+markers',name:'original',line:{color:'#3b82f6',width:3},marker:{size:8,color:'#3b82f6'}};
var reflected={x:refX,y:refY,mode:'lines+markers',name:'reflected across y-axis',line:{color:'#f59e0b',width:3},marker:{size:8,color:'#f59e0b'}};
var mirror={x:[0,0],y:[-1,5],mode:'lines',name:'mirror (y-axis)',line:{color:'#ef4444',width:2,dash:'dash'}};
var connectors={x:[],y:[],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dot'},showlegend:false};
for(var k=0;k<3;k++){connectors.x.push(triX[k],refX[k],null);connectors.y.push(triY[k],refY[k],null);}
var labels={x:[2,5,3,-2,-5,-3],y:[0.5,1.5,4.4,0.5,1.5,4.4],mode:'text',name:'',text:['A','B','C',"A'","B'","C'"],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l92-refl-en',[orig,reflected,mirror,connectors,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Reflection across a general line $y = mx + c$.</strong> Write the mirror in normalised form and project: if the line is $ax + by + c = 0$ with $a^2 + b^2 = 1$, the image of $(x_0, y_0)$ is</p>

<div class="calc-formula"><div class="formula-label">REFLECTION ACROSS ax + by + c = 0  (a&sup2; + b&sup2; = 1)</div><div class="formula-main">$$(x_0, y_0) \\to (x_0 - 2a(ax_0 + by_0 + c), \\;\\; y_0 - 2b(ax_0 + by_0 + c))$$</div><div class="formula-sub">Subtract twice the signed perpendicular distance times the unit normal $(a, b)$. The formula reduces to the three standard cases when the line is an axis or $y = x$.</div></div>

<h2 class="lesson-title">6. Scaling (Dilation) — Not an Isometry</h2>

<div class="calc-highlight"><strong>Scaling multiplies every coordinate by a constant factor $k$:</strong> $(x, y) \\to (kx, ky)$. If $k > 1$ the figure gets bigger; if $0 < k < 1$ it shrinks; if $k < 0$ it both shrinks/grows <em>and</em> reflects through the origin. Scaling is <em>not</em> an isometry: distances change by a factor of $|k|$, so a triangle with side 1 becomes a similar triangle with side $|k|$.</div>

<div class="calc-formula"><div class="formula-label">DILATION (SCALING) BY FACTOR k ABOUT THE ORIGIN</div><div class="formula-main">$$D_k(x, y) \\;=\\; (k x, \\, k y)$$</div><div class="formula-sub">Lengths scale by $|k|$. Areas scale by $k^2$. Angles are preserved (it is a <em>similarity</em>, not an isometry).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Apply $D_2$ to the triangle with vertices $(1, 1)$, $(3, 1)$, $(2, 2)$.</strong><br><br>Each coordinate doubles: $(2, 2)$, $(6, 2)$, $(4, 4)$. The new triangle is similar to the old one, twice as long on every side, with the same shape but four times the area.</div></div>

<div class="l-note"><strong>Why not an isometry?</strong> Pick two points at distance $d$ apart. After scaling by $k$ they are $|k| \\cdot d$ apart — unless $|k| = 1$ (which gives either the identity or a point reflection). Distance is preserved only in those two degenerate cases.</div>

<h2 class="lesson-title">7. Composition of Transformations</h2>

<div class="calc-highlight"><strong>You can apply one transformation after another.</strong> Write $T_2 \\circ T_1$ for "apply $T_1$ first, then $T_2$". The result is itself a transformation, and we can ask what kind it is. Often the composition turns out to be one of the basic transformations in disguise — for example, two translations always compose to a single translation.</div>

<p class="l-text"><strong>Order matters.</strong> In general $T_2 \\circ T_1 \\neq T_1 \\circ T_2$. Translations <em>do</em> commute (slide right then up = slide up then right), but rotations and reflections usually do not. The following example is worth doing carefully because the wrong order gives the wrong answer.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ORDER MATTERS</div><div class="example-body"><strong>Start at the point $(1, 0)$. Apply (a) rotate by 90&deg; then translate by (0, 1); (b) translate by (0, 1) then rotate by 90&deg;.</strong><br><br>(a) $R_{90}(1, 0) = (0, 1)$. Then translate: $(0, 1) + (0, 1) = (0, 2)$.<br>(b) Translate first: $(1, 0) + (0, 1) = (1, 1)$. Then rotate: $R_{90}(1, 1) = (-1, 1)$.<br><br>$(0, 2) \\neq (-1, 1)$. Different orders, different answers.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Translation &compfn; Translation</div><div class="card-body">Vectors add: $T_{(a_1, b_1)} \\circ T_{(a_2, b_2)} = T_{(a_1+a_2,\\, b_1+b_2)}$. Always commutes.</div></div>
<div class="calc-card"><div class="card-title">Rotation &compfn; Rotation (same centre)</div><div class="card-body">Angles add: $R_{\\theta_1} \\circ R_{\\theta_2} = R_{\\theta_1 + \\theta_2}$. Commutes for rotations about the same point.</div></div>
<div class="calc-card"><div class="card-title">Reflection &compfn; Reflection</div><div class="card-body">Two reflections with parallel mirror lines compose to a translation; with intersecting lines they compose to a rotation. Never commutes in general.</div></div>
</div>

<h2 class="lesson-title">8. Two Reflections = A Rotation (Famous Theorem)</h2>

<div class="calc-highlight"><strong>If you reflect across two lines that meet at a point, the composition is a rotation about that point.</strong> The rotation angle is exactly <em>twice</em> the angle between the two mirror lines, measured in the order of the reflections. This is one of the most useful facts in plane geometry: every rotation can be decomposed into two reflections, and conversely every two intersecting reflections give a rotation.</div>

<div class="calc-formula"><div class="formula-label">REFLECTION COMPOSITION THEOREM</div><div class="formula-main">$$\\text{Refl}_{\\ell_2} \\circ \\text{Refl}_{\\ell_1} \\;=\\; R_{2\\alpha}^{\\,P}$$</div><div class="formula-sub">where the mirror lines $\\ell_1$ and $\\ell_2$ meet at $P$ with the directed angle from $\\ell_1$ to $\\ell_2$ equal to $\\alpha$. The composition is a rotation by $2\\alpha$ about $P$.</div></div>

<p class="l-text"><strong>What if the two mirror lines are parallel?</strong> Then they do not meet at any single point, so the composition cannot be a rotation. Instead, it turns out to be a <em>translation</em> by twice the perpendicular distance between the lines, in the direction perpendicular to both lines. Parallel-mirror composition is how an old-fashioned periscope works — two parallel angled mirrors shift the line of sight while keeping the image upright.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Reflect across the x-axis, then across the y-axis.</strong><br><br>Step 1: $(x, y) \\to (x, -y)$.<br>Step 2: $(x, -y) \\to (-x, -y)$.<br>Net effect: $(x, y) \\to (-x, -y)$.<br><br>This is rotation by 180&deg; about the origin (point reflection). The angle between the x-axis and y-axis is 90&deg;; the rotation angle is $2 \\times 90^\\circ = 180^\\circ$. Theorem confirmed.</div></div>

<h2 class="lesson-title">9. Symmetry Groups of Regular Polygons</h2>

<div class="calc-highlight"><strong>A symmetry of a figure is an isometry that maps the figure exactly onto itself.</strong> The set of all symmetries forms a <em>group</em>: you can compose two symmetries to get another symmetry, every symmetry has an inverse, and there is always the identity (do nothing). For regular polygons these groups are called <em>dihedral groups</em>, denoted $D_n$.</div>

<div class="calc-formula"><div class="formula-label">DIHEDRAL GROUP D&#8345;</div><div class="formula-main">$$|D_n| \\;=\\; 2n \\quad\\text{(n rotations + n reflections)}$$</div><div class="formula-sub">A regular n-gon has n rotational symmetries (by $0, 2\\pi/n, 4\\pi/n, \\ldots, 2(n-1)\\pi/n$) and n reflection symmetries (each through an axis of symmetry). Total: $2n$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Equilateral triangle &mdash; $D_3$</div><div class="card-body">6 symmetries: identity, rotation by 120&deg;, rotation by 240&deg;, three reflections (through each vertex and the midpoint of the opposite side).</div></div>
<div class="calc-card"><div class="card-title">Square &mdash; $D_4$</div><div class="card-body">8 symmetries: identity, rotation by 90&deg;, 180&deg;, 270&deg;, four reflections (two through midpoints of opposite sides, two through opposite vertices).</div></div>
<div class="calc-card"><div class="card-title">Regular pentagon &mdash; $D_5$</div><div class="card-body">10 symmetries: 5 rotations and 5 reflections.</div></div>
</div>

<div class="l-note"><strong>Why does the count work?</strong> Pick a vertex. After any symmetry, it must map to one of the n vertices (n choices). At each landing position, the polygon can be either "right-side-up" or "flipped" (2 choices). So $n \\times 2 = 2n$ total symmetries.</div>

<h2 class="lesson-title">10. Composition Worked Through On A Triangle</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ROTATION THEN REFLECTION</div><div class="example-body"><strong>Triangle vertices: $A(1, 0)$, $B(3, 0)$, $C(2, 2)$. First rotate by 90&deg; CCW about the origin, then reflect across the x-axis.</strong><br><br>Step 1 (rotate 90&deg;: $(x, y) \\to (-y, x)$):<br>$A(1, 0) \\to (0, 1)$<br>$B(3, 0) \\to (0, 3)$<br>$C(2, 2) \\to (-2, 2)$<br><br>Step 2 (reflect across x-axis: $(x, y) \\to (x, -y)$):<br>$(0, 1) \\to (0, -1)$<br>$(0, 3) \\to (0, -3)$<br>$(-2, 2) \\to (-2, -2)$<br><br>Final triangle: $(0, -1)$, $(0, -3)$, $(-2, -2)$. Notice the orientation has flipped (reflection reverses it), and a single reflection-across-the-line-$y=-x$ would have produced exactly the same result — this composition is itself an isometry of indirect type.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Try the same composition in the reverse order — reflect first, then rotate. Do you get the same final triangle? (No, you should not. The order of an isometry matters except in special cases.)</div></div>

<h2 class="lesson-title">11. Common Errors and How to Avoid Them</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WRONG</div><div class="compare-item"><strong>Forgetting CCW vs CW.</strong> Writing the rotation formula $(x\\cos\\theta + y\\sin\\theta, \\,-x\\sin\\theta + y\\cos\\theta)$ — this is CW, not CCW.</div><div class="compare-item"><strong>Wrong order.</strong> Computing "rotation then translation" when the problem asks for "translation then rotation".</div><div class="compare-item"><strong>Treating scaling as isometric.</strong> Saying a triangle with side 5 maps to a triangle with side 5 under $D_2$.</div><div class="compare-item"><strong>Reflecting across "the diagonal" without specifying $y = x$ or $y = -x$.</strong></div></div><div class="compare-col"><div class="compare-title">RIGHT</div><div class="compare-item">CCW: $(x\\cos\\theta - y\\sin\\theta, \\, x\\sin\\theta + y\\cos\\theta)$. The minus sign goes in front of the $y\\sin\\theta$ in the x-component.</div><div class="compare-item">Read the problem twice; write $T_2 \\circ T_1$ to mean "$T_1$ first". Apply in that order.</div><div class="compare-item">Under $D_2$ the side becomes $2 \\times 5 = 10$, and the area becomes $4 \\times$ original.</div><div class="compare-item">$y = x$ gives $(x, y) \\to (y, x)$. $y = -x$ gives $(x, y) \\to (-y, -x)$. They are different reflections.</div></div></div>

<h2 class="lesson-title">12. Practice Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; TRANSLATION</div><div class="example-body"><strong>Translate the point $(-2, 5)$ by the vector $(4, -3)$.</strong><br><br>$(-2 + 4, \\, 5 + (-3)) = (2, 2)$.<br><br>Answer: <strong>$(2, 2)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ROTATION 90&deg; CCW</div><div class="example-body"><strong>Rotate $(2, -1)$ by 90&deg; CCW about the origin.</strong><br><br>Use the shortcut $(x, y) \\to (-y, x)$: $(2, -1) \\to (1, 2)$.<br><br>Answer: <strong>$(1, 2)$</strong>. Distance check: $\\sqrt{4+1} = \\sqrt{5}$ before and $\\sqrt{1+4} = \\sqrt{5}$ after.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; REFLECTION ACROSS y = x</div><div class="example-body"><strong>Reflect $(3, -7)$ across the line $y = x$.</strong><br><br>Swap the coordinates: $(3, -7) \\to (-7, 3)$.<br><br>Answer: <strong>$(-7, 3)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; ROTATION ABOUT ARBITRARY POINT</div><div class="example-body"><strong>Rotate $(4, 5)$ by 180&deg; about the point $(1, 2)$.</strong><br><br>Shift: $(4-1, 5-2) = (3, 3)$. Rotate 180&deg;: $(3, 3) \\to (-3, -3)$. Shift back: $(-3+1, -3+2) = (-2, -1)$.<br><br>Answer: <strong>$(-2, -1)$</strong>. A 180&deg; rotation about $(1, 2)$ swaps each point with the one diametrically opposite across $(1, 2)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; COMPOSITION</div><div class="example-body"><strong>Apply to $(2, 3)$ first the translation by $(1, 1)$, then the rotation by 90&deg; CCW about the origin.</strong><br><br>Translate first: $(2+1, 3+1) = (3, 4)$. Rotate 90&deg;: $(3, 4) \\to (-4, 3)$.<br><br>Answer: <strong>$(-4, 3)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TWO REFLECTIONS</div><div class="example-body"><strong>Reflect $(3, 2)$ first across the x-axis, then across $y = x$.</strong><br><br>Across x-axis: $(3, 2) \\to (3, -2)$. Across $y = x$ (swap): $(3, -2) \\to (-2, 3)$.<br><br>Answer: <strong>$(-2, 3)$</strong>. The angle from the x-axis to $y = x$ is 45&deg;, so the composition is a rotation by $2 \\times 45^\\circ = 90^\\circ$ about the origin. Verify: starting from $(3, 2)$, a 90&deg; CCW rotation gives $(-2, 3)$. Matches.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; SCALING + AREA</div><div class="example-body"><strong>A triangle has area 6. Apply $D_3$ (scaling by 3). What is the new area?</strong><br><br>Areas scale by $k^2$, so $6 \\times 9 = 54$.<br><br>Answer: <strong>54</strong>. Lengths tripled, area multiplied by 9.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SYMMETRY COUNT</div><div class="example-body"><strong>How many symmetries does a regular hexagon have? List them in words.</strong><br><br>$D_6$ has $2 \\times 6 = 12$ elements: identity, rotations by 60&deg;, 120&deg;, 180&deg;, 240&deg;, 300&deg; (six rotations counting the identity); plus six reflections (three through pairs of opposite vertices, three through midpoints of opposite sides).<br><br>Answer: <strong>12 symmetries</strong>.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Transformations of the plane can all be written as matrices acting on coordinate vectors. In linear algebra (university level) you will see that translation is the only one of the four basic isometries that is not a linear map — to make it linear, mathematicians use a trick called <em>homogeneous coordinates</em>, the foundation of computer graphics. Every rotation, reflection and projection on every screen you have ever looked at is doing exactly the calculation in this lesson, millions of times a second.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>An <em>isometry</em> preserves all distances. The four kinds: translation, rotation, reflection, glide reflection</li>
<li>Translation $(x, y) \\to (x+a, y+b)$ — slide by a vector</li>
<li>Rotation by &theta; about origin: $(x, y) \\to (x\\cos\\theta - y\\sin\\theta, \\; x\\sin\\theta + y\\cos\\theta)$</li>
<li>Rotation about $(c_x, c_y)$: shift to origin, rotate, shift back</li>
<li>Three quick reflections: across x-axis swaps sign of y, y-axis swaps sign of x, $y = x$ swaps the coordinates</li>
<li>Scaling $(x, y) \\to (kx, ky)$ is <em>not</em> an isometry — lengths scale by $|k|$, areas by $k^2$</li>
<li>Composition: order matters. Two reflections through intersecting lines = a rotation by twice the angle between them</li>
<li>Regular n-gons have $2n$ symmetries: the dihedral group $D_n$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Geometri sadece sabit şekillerle ilgili değildir — şekillerin nasıl <em>hareket ettiği</em> ile ilgilidir.</strong> Bir üçgeni sayfa üzerinde kaydır, bir iğnenin etrafında döndür, aynaya tut: bunların her biri bir <em>dönüşümdür</em>, yani bir şeklin her noktasını alıp yeni bir nokta üreten bir kuraldır. Üçgenin yine aynı üç kenarı ve aynı üç açısı vardır, ama farklı bir yerde durur. Bu ders, tüm uzaklıkları koruyan üç dönüşüm — öteleme, döndürme ve yansıma — ile birlikte bunların izometri olmayan kuzeni olan ölçeklemeyi anlatıyor.</p>

<p class="l-text">Bu dersin sonunda, her temel dönüşüm için koordinat formüllerini yazabilecek, dönüşümleri bileşke alıp sonucu öngörebilecek, kesişen iki doğru boyunca yapılan iki yansımanın bir döndürme olduğunu fark edebilecek ve bir düzgün çokgenin simetri grubunu okuyabileceksin. Bu fikirler lineer cebire, bilgisayar grafiklerine, robotik bilimine ve kristalografiye giriş kapısıdır — ve lise geometrisinin geri kalanında her yerde karşılaşacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir <em>izometriyi</em> tüm uzaklıkları koruyan bir dönüşüm olarak tanımlamayı</li>
<li>Öteleme, başlangıç noktası etrafında döndürme, herhangi bir nokta etrafında döndürme ve herhangi bir doğru üzerinde yansıma için koordinat formüllerini uygulamayı</li>
<li>Ölçeklemeyi (dilation) izometrilerden ayırt etmeyi ve neden uzunlukları değiştirdiğini açıklamayı</li>
<li>İki veya daha fazla dönüşümün bileşkesini hesaplamayı ve <em>sıranın önemli olduğu</em> kuralını kullanmayı</li>
<li>Teoremi tanımayı: kesişen iki doğru üzerinde yapılan iki yansıma, doğrular arasındaki açının iki katı kadar bir döndürmeye eşittir</li>
<li>Eşkenar üçgenin, karenin ve düzgün n-genin simetri grubunu okumayı</li>
</ul>
</div>

<h2 class="lesson-title">1. İzometriler: Uzaklığı Koruyan Hareketler</h2>

<div class="calc-highlight"><strong>İzometri, düzlemdeki her noktayı, hiçbir uzaklığı germeden veya sıkıştırmadan yeni bir noktaya götüren bir kuraldır.</strong> Hareketten önce iki nokta 5 cm uzakta ise, hareketten sonra da tam olarak 5 cm uzaktadır. Kelime Yunancadan gelir: <em>iso</em> (aynı) + <em>metron</em> (ölçü). Düzlemin dört katı hareketi — öteleme, döndürme, yansıma ve kayma yansıması — var olan tüm izometrilerdir. Diğer her dönüşüm ya uzunlukları (ölçekleme) ya açıları (kayma) ya da her ikisini değiştirir.</div>

<p class="l-text">Uzaklıklar korunduğu için her izometri ayrıca <strong>açıları</strong>, <strong>alanları</strong> ve <strong>şekilleri</strong> de korur. Üçgen aynı alana sahip bir üçgen olarak kalır; çember aynı yarıçapa sahip bir çember olarak kalır. Şekil tamamen aynı görünür — sadece konumu ve yönelimi değişmiştir. Bu yüzden bir kağıdı masanın üzerinde itip kaydırmak, üzerine çizilen şeyi ne kadar karmaşık olursa olsun deforme etmez.</p>

<div class="calc-formula"><div class="formula-label">TANIM &mdash; İZOMETRİ</div><div class="formula-main">$$T : \\mathbb{R}^2 \\to \\mathbb{R}^2 \\quad\\text{izometridir, eger}\\quad |T(P) - T(Q)| = |P - Q| \\;\\; \\text{her } P, Q \\text{ icin.}$$</div><div class="formula-sub">Görüntü noktaları arasındaki uzaklık, orijinal noktalar arasındaki uzaklığa eşittir. Uzunluklar, açılar, alanlar — hepsi korunur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öteleme</div><div class="card-body">Her noktayı aynı vektörle kaydır. Döndürme yok, çevirme yok. Yön ve yönelim aynı kalır.</div></div>
<div class="calc-card"><div class="card-title">Döndürme</div><div class="card-body">Her noktayı sabit bir merkez etrafında sabit bir açıyla döndür. Yönelim korunur (sol eller sol kalır).</div></div>
<div class="calc-card"><div class="card-title">Yansıma</div><div class="card-body">Her noktayı sabit bir doğru (ayna) boyunca çevir. Yönelim <em>tersine döner</em> — sol sağa dönüşür.</div></div>
</div>

<div class="l-note"><strong>Doğrudan ve dolaylı izometriler.</strong> Ötelemeler ve döndürmeler yönelimi korur: saat yönündeki bir etiket saat yönünde kalır. Yansımalar bunu tersine çevirir. Banyodaki aynada saçınızın ayrımının ters tarafta görünmesinin sebebi budur. Ancak iki yansıma yönelimi geri yükler — bu, 9. bölümdeki ünlü teoremin arkasındaki sırdır.</div>

<h2 class="lesson-title">2. Öteleme</h2>

<div class="calc-highlight"><strong>Öteleme, her noktayı aynı vektörle kaydırır.</strong> Vektör $\\vec{v} = (a, b)$ ise, $(x, y)$ noktası $(x+a, y+b)$ noktasına gider. Merkez yok, eksen yok — sadece tek bir kaydırma her yere düzgün uygulanır. Bir bütün olarak şekil hareket eder; biçimi, boyutu ve yönelimi hiç değişmez.</div>

<div class="calc-formula"><div class="formula-label">ÖTELEME FORMÜLÜ</div><div class="formula-main">$$T_{(a,b)}(x, y) \\;=\\; (x + a, \\, y + b)$$</div><div class="formula-sub">Her x-koordinatına a ekle, her y-koordinatına b ekle. Öteleme vektörü $(a,b)$ başlangıç noktasının nereye gideceğini söyler.</div></div>

<p class="l-text">Geometrik olarak, her nokta aynı oku izler. Bir üçgenin üç köşesine de öteleme vektörünün soluk bir kopyasını çizersen, eşit uzunlukta üç paralel ok elde edersin. Bu, bir ötelemenin görsel parmak izidir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Köşeleri A(1, 1), B(4, 1), C(2, 3) olan üçgeni (2, 3) vektörü ile ötele.</strong><br><br>$A(1, 1) \\to A'(1+2, 1+3) = (3, 4)$.<br>$B(4, 1) \\to B'(4+2, 1+3) = (6, 4)$.<br>$C(2, 3) \\to C'(2+2, 3+3) = (4, 6)$.<br><br>Doğrulama: $|AB| = 3$ idi; $|A'B'| = |6-3| = 3$. Uzaklık korunmuş, dolayısıyla hareket gerçekten bir izometri.</div></div>

<div class="calc-graph"><div id="plot-l92-trans-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijinal üçgen (mavi) ve $(2, 3)$ öteleme vektörü uygulandıktan sonra ötelenmiş kopya (turuncu). Her köşenin aynı okla hareket ettiğine dikkat et — bu düzgün paralel kayma, bir ötelemenin imzasıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var triX=[1,4,2,1];var triY=[1,1,3,1];
var triX2=[3,6,4,3];var triY2=[4,4,6,4];
var orig={x:triX,y:triY,mode:'lines+markers',name:'orijinal',line:{color:'#3b82f6',width:3},marker:{size:8,color:'#3b82f6'}};
var moved={x:triX2,y:triY2,mode:'lines+markers',name:'ötelenmiş',line:{color:'#f59e0b',width:3},marker:{size:8,color:'#f59e0b'}};
var arrowsX=[];var arrowsY=[];
for(var i=0;i<3;i++){arrowsX.push(triX[i],triX2[i],null);arrowsY.push(triY[i],triY2[i],null);}
var arrows={x:arrowsX,y:arrowsY,mode:'lines',name:'öteleme vektörleri',line:{color:'rgba(255,255,255,0.45)',width:1.4,dash:'dot'}};
var labels={x:[1,4,2,3,6,4],y:[0.5,0.5,3.5,4.5,4.5,6.5],mode:'text',name:'',text:['A','B','C',"A'","B'","C'"],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.5,7.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l92-trans-tr',[orig,moved,arrows,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Birim öteleme.</strong> Sıfır vektörü $(0, 0)$ ile yapılan öteleme her noktayı yerinde bırakır. Buna <em>birim dönüşüm</em> $I$ denir ve izometriler grubunun "hiçbir şey yapma" elemanıdır. Her ötelemenin bir tersi vardır: $(-a, -b)$ ile yapılan öteleme, $(a, b)$ ile yapılan ötelemeyi geri alır.</div>

<h2 class="lesson-title">3. Başlangıç Noktası Etrafında Döndürme</h2>

<div class="calc-highlight"><strong>Döndürme, her noktayı sabit bir merkez etrafında sabit bir açıyla döndürür.</strong> Merkez başlangıç noktası ve açı $\\theta$ (pozitif x-ekseninden saat yönünün tersine ölçülen) olduğunda, koordinat formülü sinüs ve kosinüs kullanır. İşte burada trigonometri geometri ile buluşuyor — 1. derste öğrendiğin birim çember özdeşlikleri, şu anda ihtiyacın olan sayılardır.</div>

<div class="calc-formula"><div class="formula-label">BAŞLANGIÇ NOKTASI ETRAFINDA &theta; KADAR DÖNDÜRME</div><div class="formula-main">$$R_\\theta(x, y) \\;=\\; (x\\cos\\theta - y\\sin\\theta, \\;\\; x\\sin\\theta + y\\cos\\theta)$$</div><div class="formula-sub">Pozitif &theta; için CCW, negatif &theta; için CW. Döndürme merkezi sabit; geri kalan her şey bir çember üzerinde hareket eder.</div></div>

<p class="l-text"><strong>Bu formül nereden geliyor?</strong> $(x, y)$ noktasını kutupsal biçimde yaz: $x = r\\cos\\alpha$, $y = r\\sin\\alpha$. $\\theta$ kadar döndürmek, kutupsal açıya $\\theta$ ekler, dolayısıyla yeni nokta aynı $r$ uzaklığında $\\alpha + \\theta$ açısında durur. Açı toplama özdeşlikleri (1. dersteki) ardından kartezyen formülü doğrudan verir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">90&deg; CCW döndürme</div><div class="card-body">$\\cos 90^\\circ = 0$, $\\sin 90^\\circ = 1$, böylece $(x, y) \\to (-y, x)$. Ezberle — bu, grafikte ve fizikte en sık karşılaşılan döndürmedir.</div></div>
<div class="calc-card"><div class="card-title">180&deg; döndürme</div><div class="card-body">$\\cos 180^\\circ = -1$, $\\sin 180^\\circ = 0$, böylece $(x, y) \\to (-x, -y)$. Başlangıç noktasından nokta yansıması ile aynı.</div></div>
<div class="calc-card"><div class="card-title">270&deg; CCW döndürme (= 90&deg; CW)</div><div class="card-body">$\\cos 270^\\circ = 0$, $\\sin 270^\\circ = -1$, böylece $(x, y) \\to (y, -x)$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body"><strong>$(1, 0)$ noktasını başlangıç noktası etrafında 90&deg; CCW döndür.</strong><br><br>$\\theta = 90^\\circ$ yerleştir: $x' = 1 \\cdot 0 - 0 \\cdot 1 = 0$, $y' = 1 \\cdot 1 + 0 \\cdot 0 = 1$. Sonuç: <strong>$(0, 1)$</strong>.<br><br>Geometrik kontrol: birim çemberin 0&deg; açısındaki noktası, 90&deg; açısındaki noktaya döner, yani çemberin en üstüne. Uyuyor.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body"><strong>$(3, 2)$ noktasını başlangıç noktası etrafında 60&deg; CCW döndür.</strong><br><br>$\\cos 60^\\circ = 1/2$, $\\sin 60^\\circ = \\sqrt{3}/2$.<br>$x' = 3 \\cdot \\dfrac{1}{2} - 2 \\cdot \\dfrac{\\sqrt{3}}{2} = \\dfrac{3 - 2\\sqrt{3}}{2} \\approx -0.232$.<br>$y' = 3 \\cdot \\dfrac{\\sqrt{3}}{2} + 2 \\cdot \\dfrac{1}{2} = \\dfrac{3\\sqrt{3} + 2}{2} \\approx 3.598$.<br><br>Uzaklık kontrolü: $\\sqrt{3^2 + 2^2} = \\sqrt{13}$. Görüntü: $\\sqrt{0.232^2 + 3.598^2} \\approx \\sqrt{13}$. Uzaklık korundu.</div></div>

<div class="calc-graph"><div id="plot-l92-rot-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı üçgen başlangıç noktası etrafında 90&deg; CCW döndürülmüş. $(2, 1)$ köşesi A, $(-1, 2)$'ye gider ve bu böyle devam eder. Her nokta başlangıç noktası merkezli bir yay üzerinde hareket eder; her yayın yarıçapı, orijinal köşeden başlangıç noktasına olan uzaklıktır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var triX=[2,4,3,2];var triY=[1,1,3,1];
var theta=Math.PI/2;
var rX=[];var rY=[];
for(var i=0;i<triX.length;i++){var nx=triX[i]*Math.cos(theta)-triY[i]*Math.sin(theta);var ny=triX[i]*Math.sin(theta)+triY[i]*Math.cos(theta);rX.push(nx);rY.push(ny);}
var orig={x:triX,y:triY,mode:'lines+markers',name:'orijinal',line:{color:'#3b82f6',width:3},marker:{size:8,color:'#3b82f6'}};
var rotated={x:rX,y:rY,mode:'lines+markers',name:'90° CCW döndürülmüş',line:{color:'#f59e0b',width:3},marker:{size:8,color:'#f59e0b'}};
var arcs={x:[],y:[],mode:'lines',name:'döndürme yayları',line:{color:'rgba(255,255,255,0.35)',width:1.2,dash:'dot'}};
for(var k=0;k<3;k++){var r=Math.sqrt(triX[k]*triX[k]+triY[k]*triY[k]);var a0=Math.atan2(triY[k],triX[k]);for(var j=0;j<=30;j++){var a=a0+theta*j/30;arcs.x.push(r*Math.cos(a));arcs.y.push(r*Math.sin(a));}arcs.x.push(null);arcs.y.push(null);}
var origin={x:[0],y:[0],mode:'markers+text',name:'merkez',marker:{color:'#ef4444',size:9},text:['O'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:12}};
var labels={x:[2,4,3,rX[0],rX[1],rX[2]],y:[0.5,0.5,3.4,rY[0]+0.4,rY[1]+0.4,rY[2]+0.4],mode:'text',name:'',text:['A','B','C',"A'","B'","C'"],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l92-rot-tr',[orig,rotated,arcs,origin,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Herhangi Bir Nokta Etrafında Döndürme</h2>

<div class="calc-highlight"><strong>Döndürme merkezi başlangıç noktası değilse, üç adımlı bir hile kullan:</strong> merkezi başlangıç noktasına kaydır, döndür, geri kaydır. Açıkça, $\\theta$ kadar $(c_x, c_y)$ etrafında döndürmek için: noktandan $(c_x, c_y)$'yi çıkar, başlangıç-noktası döndürme formülünü uygula, sonra $(c_x, c_y)$'yi geri ekle.</div>

<div class="calc-formula"><div class="formula-label">$(c_x, c_y)$ ETRAFINDA &theta; KADAR DÖNDÜRME</div><div class="formula-main">$$x' = c_x + (x - c_x)\\cos\\theta - (y - c_y)\\sin\\theta$$ $$y' = c_y + (x - c_x)\\sin\\theta + (y - c_y)\\cos\\theta$$</div><div class="formula-sub">Eskisiyle aynı formül, ama $(x - c_x, y - c_y)$ farkına uygulanır, sonra merkez geri eklenir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>$(5, 3)$ noktasını $(2, 1)$ etrafında 90&deg; CCW döndür.</strong><br><br>Adım 1 (kaydır): $(5-2, 3-1) = (3, 2)$.<br>Adım 2 (90&deg; döndür: $(x, y) \\to (-y, x)$): $(3, 2) \\to (-2, 3)$.<br>Adım 3 (geri kaydır): $(-2+2, 3+1) = (0, 4)$.<br><br>Cevap: <strong>$(0, 4)$</strong>.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Kaydır-döndür-geri kaydır hilesi neden işe yarıyor? Çünkü başlangıç-noktası döndürme formülü sadece $(0,0)$ etrafında nasıl döneceğini bilir. Önce kaydırarak merkezi başlangıç noktasına <em>koyarız</em> ki formül işini yapsın; sonra her şeyi geri kaydırırız. Bu "öteleme ile eşleniklik" hilesi lineer cebirde (benzer matrisler) ve fizikte (referans çerçevesi değiştirme) yeniden ortaya çıkar.</div></div>

<h2 class="lesson-title">5. Yansıma</h2>

<div class="calc-highlight"><strong>Yansıma, her noktayı sabit bir doğru olan <em>ayna doğrusu</em> boyunca çevirir.</strong> Görüntü, doğrunun karşı tarafında, aynı dikey uzaklıkta durur. Yansımalar izometridir — uzaklıklar korunur — ama <em>dolaylıdır</em>: yönelimi tersine çevirirler, dolayısıyla saat yönündeki bir etiket saat yönünün tersine bir etikete dönüşür.</div>

<p class="l-text">Üç yansıma o kadar sık karşımıza çıkar ki, formüllerini ezberlemelisin:</p>

<div class="calc-formula"><div class="formula-label">ÜÇ STANDART YANSIMA</div><div class="formula-main">$$\\text{x-ekseni boyunca:} \\quad (x, y) \\to (x, -y)$$ $$\\text{y-ekseni boyunca:} \\quad (x, y) \\to (-x, y)$$ $$y = x \\text{ doğrusu boyunca:} \\quad (x, y) \\to (y, x)$$</div><div class="formula-sub">x-ekseni y'nin işaretini ters çevirir; y-ekseni x'in işaretini ters çevirir; $y = x$ doğrusu iki koordinatı değiş tokuş eder.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x-ekseni boyunca</div><div class="card-body">$(3, 4) \\to (3, -4)$. x-ekseninin üstündeki noktalar aynı uzaklıkta altına gider.</div></div>
<div class="calc-card"><div class="card-title">y-ekseni boyunca</div><div class="card-body">$(3, 4) \\to (-3, 4)$. y-ekseninin sağındaki noktalar aynı uzaklıkta soluna gider.</div></div>
<div class="calc-card"><div class="card-title">$y = x$ boyunca</div><div class="card-body">$(3, 4) \\to (4, 3)$. Cebirdeki ters fonksiyonlar tam olarak bu yansımadır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>$(3, 4)$ noktasını y-ekseni boyunca yansıt.</strong><br><br>$(x, y) \\to (-x, y)$ uygula: $(3, 4) \\to (-3, 4)$. Nokta düşey eksenin ayna görüntüsü konumuna sıçradı. y-eksenine uzaklık önceden 3 idi, sonra da 3'tür — ayna doğrusu, bir noktayı görüntüsüne bağlayan parçanın dik açıortayıdır.</div></div>

<div class="calc-graph"><div id="plot-l92-refl-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijinal üçgen (mavi) y-ekseni (düşey kesik ayna doğrusu) boyunca yansıtılmış. Görüntü (turuncu) karşı tarafta; karşılık gelen köşeler aynaya eşit dikey uzaklıktadır. Yönelim ters dönmüş — başlangıçta A, B, C'yi saat yönünde okuyorsan, görüntüde şimdi saat yönünün tersine okursun.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var triX=[2,5,3,2];var triY=[1,2,4,1];
var refX=[];var refY=[];
for(var i=0;i<triX.length;i++){refX.push(-triX[i]);refY.push(triY[i]);}
var orig={x:triX,y:triY,mode:'lines+markers',name:'orijinal',line:{color:'#3b82f6',width:3},marker:{size:8,color:'#3b82f6'}};
var reflected={x:refX,y:refY,mode:'lines+markers',name:'y-ekseni boyunca yansıma',line:{color:'#f59e0b',width:3},marker:{size:8,color:'#f59e0b'}};
var mirror={x:[0,0],y:[-1,5],mode:'lines',name:'ayna (y-ekseni)',line:{color:'#ef4444',width:2,dash:'dash'}};
var connectors={x:[],y:[],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dot'},showlegend:false};
for(var k=0;k<3;k++){connectors.x.push(triX[k],refX[k],null);connectors.y.push(triY[k],refY[k],null);}
var labels={x:[2,5,3,-2,-5,-3],y:[0.5,1.5,4.4,0.5,1.5,4.4],mode:'text',name:'',text:['A','B','C',"A'","B'","C'"],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l92-refl-tr',[orig,reflected,mirror,connectors,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Genel bir doğru $y = mx + c$ boyunca yansıma.</strong> Aynayı normalize edilmiş biçimde yaz ve projeksiyonla: doğru $ax + by + c = 0$ ise ve $a^2 + b^2 = 1$ ise, $(x_0, y_0)$'nin görüntüsü</p>

<div class="calc-formula"><div class="formula-label">ax + by + c = 0 BOYUNCA YANSIMA (a&sup2; + b&sup2; = 1)</div><div class="formula-main">$$(x_0, y_0) \\to (x_0 - 2a(ax_0 + by_0 + c), \\;\\; y_0 - 2b(ax_0 + by_0 + c))$$</div><div class="formula-sub">İşaretli dikey uzaklığın iki katını birim normal $(a, b)$ ile çarp ve çıkar. Doğru bir eksen ya da $y = x$ olduğunda formül üç standart durumu verir.</div></div>

<h2 class="lesson-title">6. Ölçekleme (Dilation) &mdash; İzometri Değil</h2>

<div class="calc-highlight"><strong>Ölçekleme her koordinatı bir sabit $k$ faktörü ile çarpar:</strong> $(x, y) \\to (kx, ky)$. $k > 1$ ise şekil büyür; $0 < k < 1$ ise küçülür; $k < 0$ ise hem küçülür/büyür <em>hem de</em> başlangıç noktası boyunca yansır. Ölçekleme bir izometri <em>değildir</em>: uzaklıklar $|k|$ faktörü ile değişir, dolayısıyla 1 birim kenarlı üçgen $|k|$ birim kenarlı benzer üçgene dönüşür.</div>

<div class="calc-formula"><div class="formula-label">BAŞLANGIÇ NOKTASI ETRAFINDA k FAKTÖRÜ İLE DİLATASYON</div><div class="formula-main">$$D_k(x, y) \\;=\\; (k x, \\, k y)$$</div><div class="formula-sub">Uzunluklar $|k|$ ile ölçeklenir. Alanlar $k^2$ ile ölçeklenir. Açılar korunur (izometri değil, bir <em>benzerliktir</em>).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>$(1, 1)$, $(3, 1)$, $(2, 2)$ köşelerinden oluşan üçgene $D_2$ uygula.</strong><br><br>Her koordinat iki katına çıkar: $(2, 2)$, $(6, 2)$, $(4, 4)$. Yeni üçgen eskisine benzer, her kenarda iki kat daha uzun, aynı şekilli ama dört katı alana sahip.</div></div>

<div class="l-note"><strong>Neden izometri değil?</strong> Birbirinden $d$ uzaklığında iki nokta seç. $k$ ile ölçekledikten sonra $|k| \\cdot d$ uzaklığındadırlar — $|k| = 1$ olmadığı sürece (ki bu da ya birim ya da nokta yansıması verir). Uzaklık sadece bu iki yoz durumda korunur.</div>

<h2 class="lesson-title">7. Dönüşümlerin Bileşkesi</h2>

<div class="calc-highlight"><strong>Bir dönüşümü diğerinden sonra uygulayabilirsin.</strong> "$T_1$'i önce, sonra $T_2$'yi uygula" demek için $T_2 \\circ T_1$ yazılır. Sonuç da bir dönüşümdür ve hangi tür olduğunu sorabiliriz. Genellikle bileşke, temel dönüşümlerden birinin gizlenmiş hali olarak çıkar — örneğin iki öteleme her zaman tek bir ötelemeye eşittir.</div>

<p class="l-text"><strong>Sıra önemlidir.</strong> Genellikle $T_2 \\circ T_1 \\neq T_1 \\circ T_2$. Ötelemeler <em>yer değiştirir</em> (önce sağa kaydır sonra yukarı = önce yukarı sonra sağa), ama döndürmeler ve yansımalar genellikle yer değiştirmez. Aşağıdaki örneği dikkatle yapmak gerekir çünkü yanlış sıra yanlış cevap verir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; SIRA ÖNEMLİDİR</div><div class="example-body"><strong>$(1, 0)$ noktasında başla. (a) 90&deg; döndür sonra (0, 1) ile ötele; (b) (0, 1) ile ötele sonra 90&deg; döndür.</strong><br><br>(a) $R_{90}(1, 0) = (0, 1)$. Sonra ötele: $(0, 1) + (0, 1) = (0, 2)$.<br>(b) Önce ötele: $(1, 0) + (0, 1) = (1, 1)$. Sonra döndür: $R_{90}(1, 1) = (-1, 1)$.<br><br>$(0, 2) \\neq (-1, 1)$. Farklı sıralar, farklı cevaplar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öteleme &compfn; Öteleme</div><div class="card-body">Vektörler toplanır: $T_{(a_1, b_1)} \\circ T_{(a_2, b_2)} = T_{(a_1+a_2,\\, b_1+b_2)}$. Her zaman yer değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Döndürme &compfn; Döndürme (aynı merkez)</div><div class="card-body">Açılar toplanır: $R_{\\theta_1} \\circ R_{\\theta_2} = R_{\\theta_1 + \\theta_2}$. Aynı nokta etrafındaki döndürmeler için yer değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Yansıma &compfn; Yansıma</div><div class="card-body">Paralel ayna doğrularıyla iki yansıma bir ötelemeye, kesişen doğrularla iki yansıma bir döndürmeye eşittir. Genellikle yer değiştirmez.</div></div>
</div>

<h2 class="lesson-title">8. İki Yansıma = Bir Döndürme (Ünlü Teorem)</h2>

<div class="calc-highlight"><strong>Bir noktada kesişen iki doğru boyunca yansıma yaparsan, bileşke o nokta etrafında bir döndürmedir.</strong> Döndürme açısı, iki ayna doğrusu arasındaki açının tam olarak <em>iki katıdır</em>, yansımaların sırası yönünde ölçülür. Bu, düzlem geometrisinin en yararlı gerçeklerinden biridir: her döndürme iki yansımaya ayrıştırılabilir ve tersine her kesişen iki yansıma bir döndürme verir.</div>

<div class="calc-formula"><div class="formula-label">YANSIMA BİLEŞKESİ TEOREMİ</div><div class="formula-main">$$\\text{Refl}_{\\ell_2} \\circ \\text{Refl}_{\\ell_1} \\;=\\; R_{2\\alpha}^{\\,P}$$</div><div class="formula-sub">$\\ell_1$ ve $\\ell_2$ ayna doğruları P'de kesişir; $\\ell_1$'den $\\ell_2$'ye yönlü açı $\\alpha$ ise, bileşke P etrafında $2\\alpha$ kadar bir döndürmedir.</div></div>

<p class="l-text"><strong>İki ayna doğrusu paralel ise ne olur?</strong> O zaman tek bir noktada kesişmezler, dolayısıyla bileşke bir döndürme olamaz. Yerine, doğrular arasındaki dikey uzaklığın iki katı kadar bir <em>öteleme</em> olduğu ortaya çıkar — her iki doğruya dik yönde. Paralel ayna bileşkesi eski tip bir periskobun çalıştığı yöntemdir — iki paralel açılı ayna görüş hattını kaydırırken görüntüyü dik tutar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Önce x-ekseni boyunca, sonra y-ekseni boyunca yansıma yap.</strong><br><br>Adım 1: $(x, y) \\to (x, -y)$.<br>Adım 2: $(x, -y) \\to (-x, -y)$.<br>Net etki: $(x, y) \\to (-x, -y)$.<br><br>Bu, başlangıç noktası etrafında 180&deg; döndürmedir (nokta yansıması). x-ekseni ile y-ekseni arasındaki açı 90&deg;'dir; döndürme açısı $2 \\times 90^\\circ = 180^\\circ$. Teorem doğrulandı.</div></div>

<h2 class="lesson-title">9. Düzgün Çokgenlerin Simetri Grupları</h2>

<div class="calc-highlight"><strong>Bir şeklin simetrisi, o şekli tam olarak kendisine eşleyen bir izometridir.</strong> Tüm simetrilerin kümesi bir <em>grup</em> oluşturur: iki simetriyi bileşke aldığında başka bir simetri elde edersin, her simetrinin tersi vardır ve her zaman birim (hiçbir şey yapma) elemanı bulunur. Düzgün çokgenler için bu gruplara <em>dihedral gruplar</em> denir ve $D_n$ ile gösterilir.</div>

<div class="calc-formula"><div class="formula-label">DİHEDRAL GRUP D&#8345;</div><div class="formula-main">$$|D_n| \\;=\\; 2n \\quad\\text{(n döndürme + n yansıma)}$$</div><div class="formula-sub">Düzgün n-genin n tane döndürme simetrisi (açılar $0, 2\\pi/n, 4\\pi/n, \\ldots, 2(n-1)\\pi/n$) ve n tane yansıma simetrisi (her biri bir simetri ekseni boyunca) vardır. Toplam: $2n$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eşkenar üçgen &mdash; $D_3$</div><div class="card-body">6 simetri: birim, 120&deg; döndürme, 240&deg; döndürme, üç yansıma (her bir köşeden ve karşı kenarın orta noktasından geçen).</div></div>
<div class="calc-card"><div class="card-title">Kare &mdash; $D_4$</div><div class="card-body">8 simetri: birim, 90&deg;, 180&deg;, 270&deg; döndürme, dört yansıma (ikisi karşı kenarların orta noktasından, ikisi karşı köşelerden).</div></div>
<div class="calc-card"><div class="card-title">Düzgün beşgen &mdash; $D_5$</div><div class="card-body">10 simetri: 5 döndürme ve 5 yansıma.</div></div>
</div>

<div class="l-note"><strong>Sayım neden işe yarıyor?</strong> Bir köşe seç. Herhangi bir simetriden sonra n köşeden birine eşlenmelidir (n seçenek). Her iniş konumunda çokgen "düz" ya da "ters çevrilmiş" olabilir (2 seçenek). Yani $n \\times 2 = 2n$ toplam simetri.</div>

<h2 class="lesson-title">10. Üçgen Üzerinde Bileşke Adım Adım</h2>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; DÖNDÜRME SONRA YANSIMA</div><div class="example-body"><strong>Üçgen köşeleri: $A(1, 0)$, $B(3, 0)$, $C(2, 2)$. Önce başlangıç noktası etrafında 90&deg; CCW döndür, sonra x-ekseni boyunca yansıt.</strong><br><br>Adım 1 (90&deg; döndürme: $(x, y) \\to (-y, x)$):<br>$A(1, 0) \\to (0, 1)$<br>$B(3, 0) \\to (0, 3)$<br>$C(2, 2) \\to (-2, 2)$<br><br>Adım 2 (x-ekseni boyunca yansıma: $(x, y) \\to (x, -y)$):<br>$(0, 1) \\to (0, -1)$<br>$(0, 3) \\to (0, -3)$<br>$(-2, 2) \\to (-2, -2)$<br><br>Son üçgen: $(0, -1)$, $(0, -3)$, $(-2, -2)$. Yönelimin ters döndüğüne dikkat et (yansıma onu tersine çevirir), ve $y = -x$ doğrusu boyunca tek bir yansıma tam olarak aynı sonucu verirdi — bu bileşke kendisi dolaylı tipteki bir izometridir.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Aynı bileşkeyi ters sırada dene — önce yansıt, sonra döndür. Aynı son üçgeni elde eder misin? (Hayır, etmemelisin. Bir izometrinin sırası özel durumlar hariç önemlidir.)</div></div>

<h2 class="lesson-title">11. Yaygın Hatalar ve Bunlardan Nasıl Kaçınılır</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YANLIŞ</div><div class="compare-item"><strong>CCW ile CW karıştırmak.</strong> Döndürme formülünü $(x\\cos\\theta + y\\sin\\theta, \\,-x\\sin\\theta + y\\cos\\theta)$ olarak yazmak — bu CW, CCW değil.</div><div class="compare-item"><strong>Yanlış sıra.</strong> "Önce ötele sonra döndür" istendiğinde "önce döndür sonra ötele" hesaplamak.</div><div class="compare-item"><strong>Ölçeklemeyi izometri olarak görmek.</strong> 5 birim kenarlı üçgenin $D_2$ altında yine 5 birim kenarlı üçgene eşlendiğini söylemek.</div><div class="compare-item"><strong>"Köşegen" boyunca yansıma derken $y = x$ veya $y = -x$ belirtmemek.</strong></div></div><div class="compare-col"><div class="compare-title">DOĞRU</div><div class="compare-item">CCW: $(x\\cos\\theta - y\\sin\\theta, \\, x\\sin\\theta + y\\cos\\theta)$. Eksi işareti, x-bileşeninde $y\\sin\\theta$'nın önüne gelir.</div><div class="compare-item">Problemi iki kez oku; $T_2 \\circ T_1$ yazıp "$T_1$ önce" anla. Bu sırayla uygula.</div><div class="compare-item">$D_2$ altında kenar $2 \\times 5 = 10$ olur, alan ise $4 \\times$ orijinal olur.</div><div class="compare-item">$y = x$ verir $(x, y) \\to (y, x)$. $y = -x$ verir $(x, y) \\to (-y, -x)$. Farklı yansımalar.</div></div></div>

<h2 class="lesson-title">12. Alıştırma Problemleri</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ÖTELEME</div><div class="example-body"><strong>$(-2, 5)$ noktasını $(4, -3)$ vektörü ile ötele.</strong><br><br>$(-2 + 4, \\, 5 + (-3)) = (2, 2)$.<br><br>Cevap: <strong>$(2, 2)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; 90&deg; CCW DÖNDÜRME</div><div class="example-body"><strong>$(2, -1)$ noktasını başlangıç noktası etrafında 90&deg; CCW döndür.</strong><br><br>Kısayolu kullan $(x, y) \\to (-y, x)$: $(2, -1) \\to (1, 2)$.<br><br>Cevap: <strong>$(1, 2)$</strong>. Uzaklık kontrolü: önceden $\\sqrt{4+1} = \\sqrt{5}$, sonradan $\\sqrt{1+4} = \\sqrt{5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; y = x BOYUNCA YANSIMA</div><div class="example-body"><strong>$(3, -7)$ noktasını $y = x$ doğrusu boyunca yansıt.</strong><br><br>Koordinatları değiş tokuş et: $(3, -7) \\to (-7, 3)$.<br><br>Cevap: <strong>$(-7, 3)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; KEYFİ NOKTA ETRAFINDA DÖNDÜRME</div><div class="example-body"><strong>$(4, 5)$ noktasını $(1, 2)$ etrafında 180&deg; döndür.</strong><br><br>Kaydır: $(4-1, 5-2) = (3, 3)$. 180&deg; döndür: $(3, 3) \\to (-3, -3)$. Geri kaydır: $(-3+1, -3+2) = (-2, -1)$.<br><br>Cevap: <strong>$(-2, -1)$</strong>. $(1, 2)$ etrafında 180&deg; döndürme, her noktayı $(1, 2)$ boyunca çapraz karşıdaki nokta ile değiş tokuş eder.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; BİLEŞKE</div><div class="example-body"><strong>$(2, 3)$ noktasına önce $(1, 1)$ ile öteleme, sonra başlangıç noktası etrafında 90&deg; CCW döndürme uygula.</strong><br><br>Önce ötele: $(2+1, 3+1) = (3, 4)$. 90&deg; döndür: $(3, 4) \\to (-4, 3)$.<br><br>Cevap: <strong>$(-4, 3)$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; İKİ YANSIMA</div><div class="example-body"><strong>$(3, 2)$ noktasını önce x-ekseni boyunca, sonra $y = x$ boyunca yansıt.</strong><br><br>x-ekseni boyunca: $(3, 2) \\to (3, -2)$. $y = x$ boyunca (değiş tokuş): $(3, -2) \\to (-2, 3)$.<br><br>Cevap: <strong>$(-2, 3)$</strong>. x-ekseninden $y = x$'e açı 45&deg;, dolayısıyla bileşke başlangıç noktası etrafında $2 \\times 45^\\circ = 90^\\circ$ kadar bir döndürmedir. Doğrula: $(3, 2)$'den başlayarak 90&deg; CCW döndürme $(-2, 3)$ verir. Uyuyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; ÖLÇEKLEME + ALAN</div><div class="example-body"><strong>Bir üçgenin alanı 6'dır. $D_3$ uygulanır (3 ile ölçekleme). Yeni alan nedir?</strong><br><br>Alanlar $k^2$ ile ölçeklenir, dolayısıyla $6 \\times 9 = 54$.<br><br>Cevap: <strong>54</strong>. Uzunluklar üç katına çıktı, alan 9 ile çarpıldı.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SİMETRİ SAYISI</div><div class="example-body"><strong>Düzgün altıgenin kaç simetrisi vardır? Sözlü olarak listele.</strong><br><br>$D_6$'nın $2 \\times 6 = 12$ elemanı vardır: birim, 60&deg;, 120&deg;, 180&deg;, 240&deg;, 300&deg; döndürmeler (birim dahil altı döndürme); artı altı yansıma (üçü karşı köşelerden geçen, üçü karşı kenarların orta noktasından geçen).<br><br>Cevap: <strong>12 simetri</strong>.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Düzlemin dönüşümlerinin tümü, koordinat vektörlerine etkiyen matrisler olarak yazılabilir. Lineer cebirde (üniversite seviyesinde) öteleme dışındaki dört temel izometriden hiçbirinin lineer dönüşüm olmadığını göreceksin — onları lineer yapmak için matematikçiler bilgisayar grafiklerinin temeli olan <em>homojen koordinatlar</em> denen bir hile kullanır. Şimdiye kadar baktığın her ekrandaki her döndürme, yansıma ve projeksiyon, tam olarak bu derste yapılan hesaplamayı saniyede milyonlarca kez yapıyor.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir <em>izometri</em> tüm uzaklıkları korur. Dört türü vardır: öteleme, döndürme, yansıma, kayma yansıması</li>
<li>Öteleme $(x, y) \\to (x+a, y+b)$ — bir vektörle kaydır</li>
<li>Başlangıç noktası etrafında &theta; kadar döndürme: $(x, y) \\to (x\\cos\\theta - y\\sin\\theta, \\; x\\sin\\theta + y\\cos\\theta)$</li>
<li>$(c_x, c_y)$ etrafında döndürme: başlangıç noktasına kaydır, döndür, geri kaydır</li>
<li>Üç hızlı yansıma: x-ekseni y'nin işaretini, y-ekseni x'in işaretini değiştirir, $y = x$ koordinatları değiş tokuş eder</li>
<li>Ölçekleme $(x, y) \\to (kx, ky)$ izometri <em>değildir</em> — uzunluklar $|k|$, alanlar $k^2$ ile ölçeklenir</li>
<li>Bileşke: sıra önemlidir. Kesişen iki doğru boyunca iki yansıma = aralarındaki açının iki katı kadar döndürme</li>
<li>Düzgün n-genin $2n$ simetrisi vardır: dihedral grup $D_n$</li>
</ul>
</div>`
};
