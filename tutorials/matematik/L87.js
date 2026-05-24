window.LISE_MAT_L87 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A circle is, in some sense, the simplest closed curve in the plane.</strong> Every point on it is the same distance from the centre. Yet the moment you start drawing chords, tangents, and quadrilaterals inscribed in it, a surprisingly rich web of angle relations emerges — relations that geometers have used for over two thousand years to solve problems that would otherwise need full coordinate algebra. This lesson collects the core inscribed-angle results in one place.</p>

<p class="l-text">The single piece of magic you will keep coming back to is the <em>Inscribed Angle Theorem</em>: an angle whose vertex lies on the circle is always exactly half the central angle that subtends the same arc. From that one fact flow Thales' theorem, the tangent-chord rule, the cyclic-quadrilateral property, and the intersecting-chords theorem. Master the picture once and the whole chapter falls into place.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish a <em>central angle</em> (vertex at centre) from an <em>inscribed angle</em> (vertex on the circle) and write down the arc each one subtends</li>
<li>State and apply the <strong>Inscribed Angle Theorem</strong>: inscribed angle = half of the central angle on the same arc</li>
<li>Recognise <strong>Thales' theorem</strong> as the special case where the chord is a diameter — the inscribed angle is exactly a right angle</li>
<li>Use the <em>tangent-chord angle rule</em> and the <em>tangent-tangent angle rule</em> from an external point</li>
<li>Identify a <strong>cyclic quadrilateral</strong> and use the fact that opposite angles sum to 180&deg;</li>
<li>Apply the <strong>intersecting-chords theorem</strong> (power of a point): PA &middot; PB = PC &middot; PD</li>
<li>Avoid the most common mistakes when mixing central and inscribed angles, or when forgetting which arc an angle subtends</li>
</ul>
</div>

<h2 class="lesson-title">1. Central Angle: The Reference Angle of a Circle</h2>

<div class="calc-highlight"><strong>A central angle is the simplest angle a circle can carry.</strong> Place the vertex at the centre of the circle and draw two radii out to two points on the circle. The angle between those radii is a central angle, and its measure is exactly equal to the measure of the arc it cuts off on the rim.</div>

<p class="l-text">Why is the measure of a central angle equal to the arc it subtends? Because that is how arc measure is <em>defined</em>. The whole circle is 360&deg;; a half-circle arc is 180&deg;; a quarter-circle arc is 90&deg;. The central angle is the natural ruler. Every other angle in this lesson will be compared back to a central angle.</p>

<div class="calc-formula"><div class="formula-label">CENTRAL ANGLE &mdash; DEFINITION</div><div class="formula-main">$$\\angle AOB \\;=\\; m(\\overset{\\frown}{AB})$$</div><div class="formula-sub">O is the centre; A and B sit on the circle. The central angle AOB has the same numerical measure as the arc AB that it intercepts.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertex</div><div class="card-body">At the centre O of the circle. Always.</div></div>
<div class="calc-card"><div class="card-title">Sides</div><div class="card-body">Two radii OA and OB drawn to two points on the circle.</div></div>
<div class="calc-card"><div class="card-title">Intercepted arc</div><div class="card-body">The piece of the rim between A and B, on the side <em>inside</em> the angle.</div></div>
</div>

<p class="l-text"><strong>Two arcs for every chord.</strong> Pick any chord AB. It splits the circle into two arcs: a shorter one (the <em>minor arc</em>) and a longer one (the <em>major arc</em>), unless the chord happens to be a diameter, in which case both arcs are 180&deg; semicircles. When we write the angle AOB we usually mean the central angle that opens towards the minor arc, but you must always check which arc is being referred to.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A pizza is cut into 8 equal slices. What is the central angle of one slice? (Answer: 360&deg; / 8 = 45&deg;.) What is the arc length of one slice's crust if the pizza has radius 14 cm? (Answer: 14 &times; 45&deg; &times; &pi;/180 = 14 &times; &pi;/4 = 7&pi;/2 &asymp; 11 cm.)</div></div>

<h2 class="lesson-title">2. Inscribed Angle: Vertex on the Circle</h2>

<div class="calc-highlight"><strong>Now move the vertex from the centre out to a point on the circle itself.</strong> Draw two chords from that point to two other points on the circle. The angle between the chords is called an <em>inscribed angle</em>. It looks a lot like a central angle, but the geometry is profoundly different — the inscribed angle is always <strong>half</strong> the size of the central angle that cuts off the same arc.</div>

<p class="l-text">This factor of 1/2 is the heart of the whole lesson. Once you internalise it, you can read a diagram with one chord and one arc and instantly compute every related angle. The result is so useful that it has a name:</p>

<div class="calc-formula"><div class="formula-label">INSCRIBED ANGLE THEOREM</div><div class="formula-main">$$\\angle ACB \\;=\\; \\tfrac{1}{2}\\, m(\\overset{\\frown}{AB})$$</div><div class="formula-sub">Here C is any point on the major arc (i.e. on the opposite side of chord AB from where the arc AB lies). The inscribed angle ACB is exactly half the central angle AOB, equivalently half the arc AB.</div></div>

<p class="l-text"><strong>How to read the formula.</strong> Pick the chord AB. The arc AB has some measure, say 80&deg;. Then the central angle AOB is also 80&deg;. Any inscribed angle with vertex on the circle and chord endpoints A and B is 40&deg; — half of 80. It does not matter where on the (other) arc the vertex C sits; the inscribed angle stays 40&deg;.</p>

<div class="calc-graph"><div id="plot-l87-central-inscribed-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a circle with chord AB. The central angle AOB (vertex at the centre, blue) and the inscribed angle ACB (vertex C on the rim, orange) both subtend the same arc AB. The diagram is drawn so that AOB = 80&deg; and ACB = 40&deg; — exactly the 2:1 ratio guaranteed by the Inscribed Angle Theorem.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;th.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'circle',line:{color:'rgba(255,255,255,0.35)',width:1.6}};
var Ax=Math.cos(50*Math.PI/180),Ay=Math.sin(50*Math.PI/180);
var Bx=Math.cos(-30*Math.PI/180),By=Math.sin(-30*Math.PI/180);
var Cx=Math.cos(170*Math.PI/180),Cy=Math.sin(170*Math.PI/180);
var radii={x:[Ax,0,Bx],y:[Ay,0,By],mode:'lines+markers',name:'radii OA, OB',line:{color:'#3b82f6',width:2.6},marker:{color:'#3b82f6',size:7}};
var chords={x:[Ax,Cx,Bx],y:[Ay,Cy,By],mode:'lines+markers',name:'chords CA, CB',line:{color:'#f59e0b',width:2.6},marker:{color:'#f59e0b',size:7}};
var chordAB={x:[Ax,Bx],y:[Ay,By],mode:'lines',name:'chord AB',line:{color:'rgba(255,255,255,0.45)',width:1.6,dash:'dot'}};
var labs={x:[Ax+0.08,Bx+0.08,Cx-0.12,0,0.18,-0.55],y:[Ay+0.06,By-0.08,Cy+0.06,-0.1,0.28,0.2],mode:'text',name:'labels',text:['A','B','C','O','&#8736;AOB = 80&deg;','&#8736;ACB = 40&deg;'],textfont:{color:['#3b82f6','#3b82f6','#f59e0b','#e8e8e8','#3b82f6','#f59e0b'],size:13},showlegend:false};
var arcX=[];var arcY=[];for(var j=0;j<=40;j++){var b=(-30+(50-(-30))*j/40)*Math.PI/180;arcX.push(0.27*Math.cos(b));arcY.push(0.27*Math.sin(b));}
var arcAOB={x:arcX,y:arcY,mode:'lines',name:'central arc',line:{color:'#3b82f6',width:2,dash:'dot'}};
var arcCX=[];var arcCY=[];for(var j=0;j<=30;j++){var b1=Math.atan2(Ay-Cy,Ax-Cx);var b2=Math.atan2(By-Cy,Bx-Cx);var bb=b1+(b2-b1)*j/30;arcCX.push(Cx+0.24*Math.cos(bb));arcCY.push(Cy+0.24*Math.sin(bb));}
var arcACB={x:arcCX,y:arcCY,mode:'lines',name:'inscribed arc',line:{color:'#f59e0b',width:2,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l87-central-inscribed-en',[ring,chordAB,radii,chords,arcAOB,arcACB,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">A chord AB cuts off an arc of measure <strong>120&deg;</strong>. Point P sits on the major arc opposite. Find the inscribed angle APB.<br><br>By the Inscribed Angle Theorem:<br>$\\angle APB = \\tfrac{1}{2} \\cdot 120^\\circ = \\mathbf{60^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">An inscribed angle ACB measures <strong>35&deg;</strong>. What is the central angle AOB on the same arc?<br><br>Reverse the formula: $\\angle AOB = 2 \\cdot \\angle ACB = 2 \\cdot 35^\\circ = \\mathbf{70^\\circ}$.<br><br>And the arc AB has the same measure as the central angle: $m(\\overset{\\frown}{AB}) = 70^\\circ$.</div></div>

<h2 class="lesson-title">3. The Inscribed-Angle Corollary: Same Arc, Same Angle</h2>

<div class="calc-highlight"><strong>Move the vertex C anywhere along the same arc — the inscribed angle does not change.</strong> All inscribed angles that subtend the same chord (from the same side of it) are equal. This is the immediate corollary of the Inscribed Angle Theorem: they are all equal to half of the same arc, so they must be equal to each other.</div>

<p class="l-text">This is a remarkably powerful fact in problem solving. If you can prove that two angles in a figure subtend the same chord of the same circle and sit on the same side of that chord, you can conclude immediately that they are equal — no further computation needed. Conversely, if you have two equal angles subtending the same segment, the four points (the two endpoints of the segment plus the two vertices) lie on a common circle. That last observation underlies the entire theory of <em>cyclic quadrilaterals</em>, coming in section 7.</p>

<div class="calc-formula"><div class="formula-label">SAME-ARC COROLLARY</div><div class="formula-main">$$\\angle ACB \\;=\\; \\angle ADB \\;=\\; \\angle AEB \\;=\\; \\dots$$</div><div class="formula-sub">If C, D, E, ... are all points on the major arc with chord endpoints A, B, then all the inscribed angles are equal.</div></div>

<div class="l-note"><strong>Why does it not matter where C sits?</strong> Try it for yourself. Pick a chord AB. Slide a point C along the rim of the major arc. Watch the angle ACB. It stays fixed even though the triangle ABC changes shape. Geometrically, you are seeing the Inscribed Angle Theorem applied to the same arc with the same chord — the half-arc value never changes.</div>

<h2 class="lesson-title">4. Thales' Theorem: The Angle Inscribed in a Semicircle Is 90&deg;</h2>

<div class="calc-highlight"><strong>The most famous special case of the Inscribed Angle Theorem.</strong> When the chord is a <em>diameter</em>, the arc it subtends is half the circle, i.e. 180&deg;. Plug into the formula: the inscribed angle is half of 180&deg;, which is exactly 90&deg;. Therefore every triangle whose hypotenuse is a diameter of its circumscribed circle is a right triangle.</div>

<p class="l-text">This result is attributed to Thales of Miletus (~600 BCE), centuries before the full inscribed-angle theorem was written down. It is the original "non-trivial" theorem of Greek geometry. We restate it in the modern language:</p>

<div class="calc-formula"><div class="formula-label">THALES' THEOREM</div><div class="formula-main">$$AB \\text{ is a diameter} \\quad\\Longrightarrow\\quad \\angle ACB = 90^\\circ \\;\\;\\text{for every } C \\text{ on the circle}$$</div><div class="formula-sub">And conversely: if angle ACB is a right angle and the three points lie on a circle, then AB is a diameter of that circle.</div></div>

<div class="calc-graph"><div id="plot-l87-thales-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a circle with horizontal diameter AB. Three different points C, D, E on the rim are joined to A and B. Each of the three triangles ABC, ABD, ABE is a right triangle, with the right angle at the vertex on the rim. The hypotenuse is always the diameter AB.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;th.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'circle',line:{color:'rgba(255,255,255,0.35)',width:1.6}};
var diam={x:[-1,1],y:[0,0],mode:'lines+markers',name:'diameter AB',line:{color:'#3b82f6',width:2.6},marker:{color:'#3b82f6',size:7}};
var Cx=Math.cos(60*Math.PI/180),Cy=Math.sin(60*Math.PI/180);
var Dx=Math.cos(120*Math.PI/180),Dy=Math.sin(120*Math.PI/180);
var Ex=Math.cos(150*Math.PI/180),Ey=Math.sin(150*Math.PI/180);
var t1={x:[-1,Cx,1],y:[0,Cy,0],mode:'lines+markers',name:'triangle ABC',line:{color:'#f59e0b',width:2.2},marker:{color:'#f59e0b',size:6}};
var t2={x:[-1,Dx,1],y:[0,Dy,0],mode:'lines+markers',name:'triangle ABD',line:{color:'#10b981',width:2.2},marker:{color:'#10b981',size:6}};
var t3={x:[-1,Ex,1],y:[0,Ey,0],mode:'lines+markers',name:'triangle ABE',line:{color:'#ec4899',width:2.2},marker:{color:'#ec4899',size:6}};
function rightMark(px,py,ax,ay,bx,by,sz){var dx1=(ax-px),dy1=(ay-py);var L1=Math.hypot(dx1,dy1);var ux1=dx1/L1,uy1=dy1/L1;var dx2=(bx-px),dy2=(by-py);var L2=Math.hypot(dx2,dy2);var ux2=dx2/L2,uy2=dy2/L2;var p1x=px+sz*ux1,p1y=py+sz*uy1;var p3x=px+sz*ux2,p3y=py+sz*uy2;var p2x=px+sz*(ux1+ux2),p2y=py+sz*(uy1+uy2);return{x:[p1x,p2x,p3x],y:[p1y,p2y,p3y]};}
var rmC=rightMark(Cx,Cy,-1,0,1,0,0.09);
var rmD=rightMark(Dx,Dy,-1,0,1,0,0.09);
var rmE=rightMark(Ex,Ey,-1,0,1,0,0.09);
var rmCt={x:rmC.x,y:rmC.y,mode:'lines',name:'right angle C',line:{color:'#f59e0b',width:1.6},showlegend:false};
var rmDt={x:rmD.x,y:rmD.y,mode:'lines',name:'right angle D',line:{color:'#10b981',width:1.6},showlegend:false};
var rmEt={x:rmE.x,y:rmE.y,mode:'lines',name:'right angle E',line:{color:'#ec4899',width:1.6},showlegend:false};
var labs={x:[-1.08,1.08,Cx+0.06,Dx-0.05,Ex-0.08],y:[-0.08,-0.08,Cy+0.08,Dy+0.08,Ey+0.06],mode:'text',name:'labels',text:['A','B','C (90&deg;)','D (90&deg;)','E (90&deg;)'],textfont:{color:['#3b82f6','#3b82f6','#f59e0b','#10b981','#ec4899'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{range:[-0.4,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l87-thales-en',[ring,diam,t1,t2,t3,rmCt,rmDt,rmEt,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; PROOF OF THALES</div><div class="example-body">Show directly that if AB is a diameter and C is on the circle, then angle ACB is 90&deg;.<br><br>Let O be the centre. Then OA = OB = OC = r (all radii). Triangle OAC is isosceles, so $\\angle OAC = \\angle OCA = \\alpha$. Triangle OBC is isosceles, so $\\angle OBC = \\angle OCB = \\beta$.<br><br>The three angles of triangle ABC sum to 180&deg;:<br>$\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$<br>$2(\\alpha + \\beta) = 180^\\circ$<br>$\\alpha + \\beta = 90^\\circ = \\angle ACB$. <strong>QED.</strong></div></div>

<div class="think-box"><div class="think-label">APPLICATION</div><div class="think-body">You are given a segment AB and asked to find <em>all</em> points P such that angle APB = 90&deg;. Thales gives the answer instantly: P must lie on the circle that has AB as its diameter. That circle is the locus of right angles on AB — a single, clean answer.</div></div>

<h2 class="lesson-title">5. Tangent-Chord Angle</h2>

<div class="calc-highlight"><strong>What if one of the two sides of the angle is a tangent line instead of a chord?</strong> The Inscribed Angle Theorem extends seamlessly: the angle between a tangent and a chord drawn from the point of tangency equals half the arc cut off by the chord on the tangent side.</div>

<p class="l-text">This is the natural limit of the inscribed-angle picture. Imagine sliding the vertex C of an inscribed angle along the rim until it almost merges with one of the chord endpoints. The chord BC shrinks to a single point and the side CB rotates into the tangent line at B. The "inscribed angle" you are measuring becomes the angle between that tangent and the remaining chord BA — and the half-arc formula still holds.</p>

<div class="calc-formula"><div class="formula-label">TANGENT-CHORD ANGLE</div><div class="formula-main">$$\\angle(\\text{tangent at } B,\\, BA) \\;=\\; \\tfrac{1}{2}\\, m(\\overset{\\frown}{BA})$$</div><div class="formula-sub">The arc BA in question is the one on the same side of the chord as the angle you are measuring.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A tangent at point B meets a chord BA. The arc BA on the angle side measures <strong>140&deg;</strong>. Find the tangent-chord angle.<br><br>By the rule: angle = (1/2) &middot; 140&deg; = <strong>70&deg;</strong>.<br><br>Check: the other tangent-chord angle on the opposite side of the chord must subtend the remaining arc 360&deg; &minus; 140&deg; = 220&deg;, giving (1/2) &middot; 220&deg; = 110&deg;. And 70&deg; + 110&deg; = 180&deg;, which is correct because the two tangent-chord angles on opposite sides form a straight line at B (the tangent itself).</div></div>

<h2 class="lesson-title">6. Tangent-Tangent Angle from an External Point</h2>

<div class="calc-highlight"><strong>From a point P outside a circle, draw two tangent lines to the circle.</strong> They touch the circle at two points, call them T<sub>1</sub> and T<sub>2</sub>. The arc T<sub>1</sub>T<sub>2</sub> closer to P is the <em>minor arc</em> (often called the "near" arc), and the longer arc on the far side is the <em>major arc</em>. The angle between the two tangents at P is half the difference of the two arcs.</div>

<div class="calc-formula"><div class="formula-label">TANGENT-TANGENT ANGLE</div><div class="formula-main">$$\\angle T_1 P T_2 \\;=\\; \\tfrac{1}{2}\\, \\big| m(\\overset{\\frown}{T_1 T_2})_{\\text{major}} \\;-\\; m(\\overset{\\frown}{T_1 T_2})_{\\text{minor}} \\big|$$</div><div class="formula-sub">Half the absolute difference of the major and minor arcs cut off by the tangent points.</div></div>

<p class="l-text"><strong>Why a difference?</strong> The general rule, which we just used for inscribed and tangent-chord angles, is: any angle formed inside or on the circle equals half the <em>sum</em> of the intercepted arcs, while any angle formed outside the circle equals half the <em>difference</em>. The tangent-tangent case is just the external-angle pattern with the two intercepted arcs being the two arcs cut off by the chord T<sub>1</sub>T<sub>2</sub>.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">From an external point P, two tangents touch the circle at T<sub>1</sub> and T<sub>2</sub>. The minor arc T<sub>1</sub>T<sub>2</sub> measures <strong>120&deg;</strong>. Find the angle at P.<br><br>Major arc = 360&deg; &minus; 120&deg; = 240&deg;.<br>Difference = 240&deg; &minus; 120&deg; = 120&deg;.<br>Angle at P = (1/2) &middot; 120&deg; = <strong>60&deg;</strong>.</div></div>

<div class="l-note"><strong>Sanity check.</strong> If the two tangent points are diametrically opposite (both arcs = 180&deg;), the formula gives an angle of 0&deg; at P — which is correct, because in that case the two tangent lines are parallel and never meet at any finite P. As soon as the arcs become unequal, P becomes a finite point and the angle grows.</div>

<h2 class="lesson-title">7. Cyclic Quadrilaterals: Opposite Angles Sum to 180&deg;</h2>

<div class="calc-highlight"><strong>A cyclic quadrilateral is one whose four vertices all lie on a single circle.</strong> The defining property: opposite angles add to 180&deg;. This is a direct consequence of the Inscribed Angle Theorem applied twice — once to each diagonal arc.</div>

<p class="l-text"><strong>Why it works.</strong> Label the quadrilateral ABCD inscribed in a circle, with vertices in order around the rim. Angle A (i.e. angle DAB) is an inscribed angle subtending the arc BCD (the arc <em>not</em> containing A). Angle C (i.e. angle BCD) is an inscribed angle subtending the arc BAD. The two arcs together make up the entire circle, so their measures sum to 360&deg;. Halving each gives the two inscribed angles, and their sum is 180&deg;.</p>

<div class="calc-formula"><div class="formula-label">CYCLIC QUADRILATERAL PROPERTY</div><div class="formula-main">$$\\angle A + \\angle C \\;=\\; 180^\\circ \\qquad\\text{and}\\qquad \\angle B + \\angle D \\;=\\; 180^\\circ$$</div><div class="formula-sub">Each pair of opposite angles of a cyclic quadrilateral is supplementary. Conversely, if opposite angles of a quadrilateral are supplementary, the quadrilateral is cyclic.</div></div>

<div class="calc-graph"><div id="plot-l87-cyclic-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a cyclic quadrilateral ABCD inscribed in a circle, with sample angle values that satisfy the supplementary property. Angle A is 70&deg; and angle C is 110&deg;, giving a sum of 180&deg;. Angle B is 95&deg; and angle D is 85&deg;, also summing to 180&deg;.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;th.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'circle',line:{color:'rgba(255,255,255,0.35)',width:1.6}};
var Ax=Math.cos(140*Math.PI/180),Ay=Math.sin(140*Math.PI/180);
var Bx=Math.cos(55*Math.PI/180),By=Math.sin(55*Math.PI/180);
var Cx=Math.cos(-25*Math.PI/180),Cy=Math.sin(-25*Math.PI/180);
var Dx=Math.cos(-130*Math.PI/180),Dy=Math.sin(-130*Math.PI/180);
var quad={x:[Ax,Bx,Cx,Dx,Ax],y:[Ay,By,Cy,Dy,Ay],mode:'lines+markers',name:'quadrilateral ABCD',line:{color:'#3b82f6',width:2.6},marker:{color:'#3b82f6',size:8}};
var diag1={x:[Ax,Cx],y:[Ay,Cy],mode:'lines',name:'diagonal AC',line:{color:'rgba(245,158,11,0.55)',width:1.6,dash:'dot'}};
var diag2={x:[Bx,Dx],y:[By,Dy],mode:'lines',name:'diagonal BD',line:{color:'rgba(16,185,129,0.55)',width:1.6,dash:'dot'}};
var labs={x:[Ax-0.12,Bx+0.08,Cx+0.12,Dx-0.1,Ax-0.05,Bx-0.02,Cx+0.02,Dx-0.02],y:[Ay+0.06,By+0.08,Cy-0.02,Dy-0.1,Ay-0.18,By-0.18,Cy+0.16,Dy+0.18],mode:'text',name:'labels',text:['A','B','C','D','70&deg;','95&deg;','110&deg;','85&deg;'],textfont:{color:['#3b82f6','#3b82f6','#3b82f6','#3b82f6','#f59e0b','#10b981','#f59e0b','#10b981'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l87-cyclic-en',[ring,quad,diag1,diag2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">A cyclic quadrilateral ABCD has angle A = 65&deg;, angle B = 120&deg;. Find angles C and D.<br><br>Opposite to A is C: $\\angle C = 180^\\circ - \\angle A = 180^\\circ - 65^\\circ = \\mathbf{115^\\circ}$.<br>Opposite to B is D: $\\angle D = 180^\\circ - \\angle B = 180^\\circ - 120^\\circ = \\mathbf{60^\\circ}$.<br><br>Check: angle sum 65 + 120 + 115 + 60 = 360&deg; &check; (every quadrilateral's interior angles sum to 360&deg;).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; PTOLEMY'S THEOREM (brief)</div><div class="example-body">For a cyclic quadrilateral ABCD with sides $a = AB$, $b = BC$, $c = CD$, $d = DA$ and diagonals $p = AC$, $q = BD$, Ptolemy's theorem states:<br><br>$$ac + bd \\;=\\; pq$$<br>"The product of the diagonals equals the sum of the products of opposite sides." This holds <em>only</em> for cyclic quadrilaterals; for any other quadrilateral $ac + bd \\geq pq$ (Ptolemy's inequality).<br><br>The full proof uses similar triangles and is a classic exercise. Just remember the formula and the fact that it characterises cyclic quadrilaterals.</div></div>

<h2 class="lesson-title">8. The Intersecting Chords Theorem (Power of a Point)</h2>

<div class="calc-highlight"><strong>Draw two chords that cross inside a circle.</strong> Let them meet at a point P, with the first chord splitting into segments PA and PB, and the second into PC and PD. Then the products are equal: <strong>PA &middot; PB = PC &middot; PD</strong>. This invariant is called the <em>power of the point P</em>.</div>

<p class="l-text">The intersecting-chords theorem is a direct consequence of the inscribed-angle corollary. Triangles APC and DPB are similar (they share the vertical angles at P, and the inscribed angles at A and D both subtend the same arc BC). From the similarity, PA/PD = PC/PB, which cross-multiplies into PA &middot; PB = PC &middot; PD. The shared value PA &middot; PB does not depend on which chord through P you choose; it depends only on the point P and the circle.</p>

<div class="calc-formula"><div class="formula-label">INTERSECTING CHORDS THEOREM</div><div class="formula-main">$$PA \\cdot PB \\;=\\; PC \\cdot PD$$</div><div class="formula-sub">When two chords AB and CD of a circle intersect at P inside the circle. Same constant value for every chord through P; call it the power of P.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Two chords AB and CD intersect inside a circle at point P. You measure PA = 4 cm, PB = 6 cm, PC = 3 cm. Find PD.<br><br>By the theorem: $PA \\cdot PB = PC \\cdot PD$.<br>$4 \\cdot 6 = 3 \\cdot PD$<br>$24 = 3 \\cdot PD$<br>$PD = \\mathbf{8\\text{ cm}}$.</div></div>

<div class="l-note"><strong>Variants for external point.</strong> If P is <em>outside</em> the circle and you draw a secant line cutting the circle at A and B (with PA shorter), the same product PA &middot; PB is constant for every secant through P. If you draw a tangent from P touching at T, the power equals $PT^2$. So for an external P: $PA \\cdot PB = PT^2$. The unified statement is the <em>Power of a Point Theorem</em>.</div>

<h2 class="lesson-title">9. Common Mistakes and How to Avoid Them</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doubling vs halving</div><div class="card-body">Inscribed angle = (1/2) &middot; central angle, never the other way around. When the inscribed angle is given, you <em>double</em> to find the central one; when the central is given, you <em>halve</em>.</div></div>
<div class="calc-card"><div class="card-title">Which arc?</div><div class="card-body">Every chord has two arcs. The inscribed-angle formula uses the arc that is on the opposite side from the vertex. Mis-reading which side you are on flips minor and major.</div></div>
<div class="calc-card"><div class="card-title">Cyclic check</div><div class="card-body">Before invoking the supplementary-opposite-angle rule, verify the quadrilateral is actually cyclic. Not every quadrilateral inscribes in a circle.</div></div>
<div class="calc-card"><div class="card-title">Tangent vs secant</div><div class="card-body">The tangent-chord rule uses one arc; the tangent-tangent rule from outside uses a difference of two arcs. Mixing them up is the most common slip in mock exams.</div></div>
</div>

<div class="think-box"><div class="think-label">SELF TEST</div><div class="think-body">Without looking back: state in one sentence each (a) the Inscribed Angle Theorem, (b) Thales' theorem, (c) the cyclic-quadrilateral property, (d) the intersecting-chords theorem. If you can do all four, you are ready for the practice set.</div></div>

<h2 class="lesson-title">10. Practice Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; CENTRAL FROM INSCRIBED</div><div class="example-body"><strong>An inscribed angle in a circle measures 28&deg;. Find the central angle on the same arc and the arc measure.</strong><br><br>Central = 2 &middot; 28&deg; = <strong>56&deg;</strong>. Arc measure = central = <strong>56&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; INSCRIBED FROM ARC</div><div class="example-body"><strong>An arc of a circle measures 130&deg;. Find the inscribed angle subtended by that arc from the opposite side.</strong><br><br>Inscribed = (1/2) &middot; 130&deg; = <strong>65&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; THALES IN PRACTICE</div><div class="example-body"><strong>A triangle inscribed in a circle has one side equal to the diameter. The other two sides have lengths 6 and 8. Find the diameter.</strong><br><br>By Thales the triangle is right-angled at the vertex opposite the diameter. The diameter is the hypotenuse. By Pythagoras: $d^2 = 6^2 + 8^2 = 36 + 64 = 100$, so $d = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; CYCLIC QUADRILATERAL</div><div class="example-body"><strong>A cyclic quadrilateral has angles A, B, C, D in order around the circle. Given A = 72&deg; and B = 95&deg;, find C and D.</strong><br><br>C is opposite A: $C = 180^\\circ - 72^\\circ = \\mathbf{108^\\circ}$.<br>D is opposite B: $D = 180^\\circ - 95^\\circ = \\mathbf{85^\\circ}$.<br>Check sum: 72 + 95 + 108 + 85 = 360&deg; &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; INTERSECTING CHORDS</div><div class="example-body"><strong>Two chords AB and CD intersect at point P inside a circle. PA = 5, PB = 12, and PC = 6. Find PD.</strong><br><br>By the intersecting-chords theorem: $PA \\cdot PB = PC \\cdot PD$.<br>$5 \\cdot 12 = 6 \\cdot PD$<br>$60 = 6 \\cdot PD$<br>$PD = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TANGENT-CHORD</div><div class="example-body"><strong>A tangent to a circle at point T meets a chord TA. The arc TA on the tangent-side measures 110&deg;. What is the tangent-chord angle?</strong><br><br>Angle = (1/2) &middot; 110&deg; = <strong>55&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; TANGENT-TANGENT FROM EXTERNAL POINT</div><div class="example-body"><strong>From a point P outside a circle, two tangents touch the circle at T<sub>1</sub> and T<sub>2</sub>. The minor arc T<sub>1</sub>T<sub>2</sub> is 80&deg;. Find the angle T<sub>1</sub>PT<sub>2</sub>.</strong><br><br>Major arc = 360&deg; &minus; 80&deg; = 280&deg;.<br>Difference = 280&deg; &minus; 80&deg; = 200&deg;.<br>Angle at P = (1/2) &middot; 200&deg; = <strong>100&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; COMBINED</div><div class="example-body"><strong>Triangle ABC is inscribed in a circle with AB as diameter. Angle BAC measures 35&deg;. Find angle ABC and the arc BC.</strong><br><br>By Thales: $\\angle ACB = 90^\\circ$.<br>Angle sum: $\\angle ABC = 180^\\circ - 35^\\circ - 90^\\circ = \\mathbf{55^\\circ}$.<br><br>Now, angle BAC is an inscribed angle subtending arc BC. So $m(\\overset{\\frown}{BC}) = 2 \\cdot 35^\\circ = \\mathbf{70^\\circ}$.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> The next lessons turn these angle relations into co-ordinate problems: writing the equation of a circle, finding tangent lines from an external point algebraically, and using the power of a point to compute lengths without measuring. The geometric pictures you built here will be the silent skeleton beneath every algebraic computation.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Central angle (vertex at centre) = the arc it subtends</li>
<li>Inscribed angle (vertex on the circle) = (1/2) &middot; central angle on the same arc</li>
<li>All inscribed angles on the same arc are equal</li>
<li>Thales: angle inscribed in a semicircle is 90&deg;</li>
<li>Tangent-chord angle = (1/2) &middot; intercepted arc</li>
<li>Tangent-tangent angle from external P = (1/2) &middot; |major arc &minus; minor arc|</li>
<li>Cyclic quadrilateral: opposite angles sum to 180&deg;</li>
<li>Ptolemy: $ac + bd = pq$ for sides and diagonals of a cyclic quadrilateral</li>
<li>Intersecting chords: PA &middot; PB = PC &middot; PD (power of a point)</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Çember, bir bakıma düzlemdeki en basit kapalı eğridir.</strong> Üzerindeki her nokta merkezden aynı uzaklıktadır. Yine de içine kirişler, teğetler ve dörtgenler çizmeye başladığın anda, şaşırtıcı derecede zengin bir açı ilişkileri ağı ortaya çıkar — geometricilerin iki bin yılı aşkın süredir, başka türlü tam koordinat cebiri gerektirecek problemleri çözmek için kullandığı ilişkiler. Bu ders, temel çember içi açı sonuçlarını tek bir yerde toplar.</p>

<p class="l-text">Sürekli geri döneceğin tek sihir parçası şudur: <em>Çevre Açı Teoremi</em>. Köşesi çember üzerinde olan bir açı, her zaman aynı yayı gören merkez açının tam olarak yarısı kadardır. Bu tek olgudan Thales teoremi, teğet-kiriş kuralı, kirişler dörtgeni özelliği ve kesişen kirişler teoremi akıp gelir. Resmi bir kez kavra; bütün bölüm yerine oturur.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir <em>merkez açıyı</em> (köşe merkezde) bir <em>çevre açıdan</em> (köşe çember üzerinde) ayırt etmeyi ve her birinin gördüğü yayı yazmayı</li>
<li><strong>Çevre Açı Teoremini</strong> ifade etmeyi ve uygulamayı: çevre açı = aynı yay üzerindeki merkez açının yarısı</li>
<li><strong>Thales teoremini</strong> kirişin çap olduğu özel durum olarak tanımayı — çevre açı tam olarak bir dik açıdır</li>
<li><em>Teğet-kiriş açı kuralını</em> ve dış noktadan çekilen <em>teğet-teğet açı kuralını</em> kullanmayı</li>
<li>Bir <strong>kirişler dörtgenini</strong> tanımayı ve karşılıklı açıların toplamının 180&deg; olduğunu kullanmayı</li>
<li><strong>Kesişen kirişler teoremini</strong> (nokta kuvveti) uygulamayı: PA &middot; PB = PC &middot; PD</li>
<li>Merkez ve çevre açıları karıştırmaktan ya da bir açının hangi yayı gördüğünü unutmaktan kaynaklanan en yaygın hatalardan kaçınmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Merkez Açı: Çemberin Referans Açısı</h2>

<div class="calc-highlight"><strong>Merkez açı, çemberin taşıyabileceği en basit açıdır.</strong> Köşeyi çemberin merkezine yerleştir ve çember üzerindeki iki noktaya iki yarıçap çiz. Bu yarıçaplar arasındaki açı merkez açıdır ve ölçüsü, çemberin kenarında kestiği yayın ölçüsüne tam olarak eşittir.</div>

<p class="l-text">Merkez açının ölçüsü neden gördüğü yaya eşittir? Çünkü yay ölçüsü zaten böyle <em>tanımlanır</em>. Tüm çember 360&deg;'dir; yarım çember yayı 180&deg;'dir; çeyrek çember yayı 90&deg;'dir. Merkez açı doğal cetveldir. Bu dersteki diğer her açı, geri dönüp bir merkez açıya kıyaslanacak.</p>

<div class="calc-formula"><div class="formula-label">MERKEZ AÇI &mdash; TANIM</div><div class="formula-main">$$\\angle AOB \\;=\\; m(\\overset{\\frown}{AB})$$</div><div class="formula-sub">O merkezdir; A ve B çember üzerindedir. AOB merkez açısı, kestiği AB yayı ile aynı sayısal ölçüye sahiptir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Köşe</div><div class="card-body">Her zaman çemberin merkezi O'da.</div></div>
<div class="calc-card"><div class="card-title">Kenarlar</div><div class="card-body">Çember üzerindeki iki noktaya çizilmiş OA ve OB yarıçapları.</div></div>
<div class="calc-card"><div class="card-title">Kesilen yay</div><div class="card-body">A ile B arasında, açının <em>içinde</em> kalan kenar parçası.</div></div>
</div>

<p class="l-text"><strong>Her kiriş için iki yay.</strong> Herhangi bir AB kirişi seç. Kiriş çemberi iki yaya böler: biri kısa olanı (<em>küçük yay</em>) ve biri uzun olanı (<em>büyük yay</em>). Tabii kiriş bir çap ise iki yay da 180&deg;'lik yarıçemberlerdir. AOB açısını yazarken genellikle küçük yaya doğru açılan merkez açıyı kastederiz, ama her zaman hangi yaya göndermede bulunulduğunu kontrol etmen gerekir.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir pizza 8 eşit dilime kesilmiş. Bir dilimin merkez açısı kaç derecedir? (Cevap: 360&deg; / 8 = 45&deg;.) Pizzanın yarıçapı 14 cm ise bir dilimin kabuk yayının uzunluğu kaçtır? (Cevap: 14 &times; 45&deg; &times; &pi;/180 = 14 &times; &pi;/4 = 7&pi;/2 &asymp; 11 cm.)</div></div>

<h2 class="lesson-title">2. Çevre Açı: Köşe Çember Üzerinde</h2>

<div class="calc-highlight"><strong>Şimdi köşeyi merkezden çemberin üzerindeki bir noktaya taşı.</strong> O noktadan çember üzerindeki iki başka noktaya iki kiriş çiz. Kirişler arasındaki açıya <em>çevre açı</em> denir. Merkez açıya çok benzer görünür ama geometrisi tamamen farklıdır — çevre açı, aynı yayı kesen merkez açının her zaman <strong>yarısı</strong> kadardır.</div>

<p class="l-text">Bu 1/2 çarpanı bütün dersin kalbidir. Bunu içselleştirdiğinde, bir kiriş ve bir yay içeren bir diyagramı okuyup ilgili her açıyı anında hesaplayabilirsin. Sonuç o kadar kullanışlıdır ki bir adı vardır:</p>

<div class="calc-formula"><div class="formula-label">ÇEVRE AÇI TEOREMİ</div><div class="formula-main">$$\\angle ACB \\;=\\; \\tfrac{1}{2}\\, m(\\overset{\\frown}{AB})$$</div><div class="formula-sub">Burada C, büyük yay üzerindeki herhangi bir noktadır (yani AB yayının olduğu tarafın aksinde, AB kirişinin diğer yanında). ACB çevre açısı, AOB merkez açısının tam yarısıdır, eşdeğer biçimde AB yayının yarısıdır.</div></div>

<p class="l-text"><strong>Formülü nasıl okumalı.</strong> AB kirişini seç. AB yayı bir ölçüye sahip, diyelim 80&deg;. O zaman AOB merkez açısı da 80&deg;'dir. Köşesi çember üzerinde, kiriş uç noktaları A ve B olan herhangi bir çevre açı 40&deg;'dir — 80'in yarısı. C köşesinin (diğer) yayın neresinde olduğu fark etmez; çevre açı 40&deg; olarak kalır.</p>

<div class="calc-graph"><div id="plot-l87-central-inscribed-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> AB kirişi olan bir çember. Hem AOB merkez açısı (köşe merkezde, mavi) hem de ACB çevre açısı (C köşesi çember kenarında, turuncu) aynı AB yayını görür. Diyagram AOB = 80&deg; ve ACB = 40&deg; olacak şekilde çizilmiştir — Çevre Açı Teoreminin garanti ettiği 2:1 oranı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;th.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'çember',line:{color:'rgba(255,255,255,0.35)',width:1.6}};
var Ax=Math.cos(50*Math.PI/180),Ay=Math.sin(50*Math.PI/180);
var Bx=Math.cos(-30*Math.PI/180),By=Math.sin(-30*Math.PI/180);
var Cx=Math.cos(170*Math.PI/180),Cy=Math.sin(170*Math.PI/180);
var radii={x:[Ax,0,Bx],y:[Ay,0,By],mode:'lines+markers',name:'OA, OB yarıçapları',line:{color:'#3b82f6',width:2.6},marker:{color:'#3b82f6',size:7}};
var chords={x:[Ax,Cx,Bx],y:[Ay,Cy,By],mode:'lines+markers',name:'CA, CB kirişleri',line:{color:'#f59e0b',width:2.6},marker:{color:'#f59e0b',size:7}};
var chordAB={x:[Ax,Bx],y:[Ay,By],mode:'lines',name:'AB kirişi',line:{color:'rgba(255,255,255,0.45)',width:1.6,dash:'dot'}};
var labs={x:[Ax+0.08,Bx+0.08,Cx-0.12,0,0.18,-0.55],y:[Ay+0.06,By-0.08,Cy+0.06,-0.1,0.28,0.2],mode:'text',name:'etiketler',text:['A','B','C','O','&#8736;AOB = 80&deg;','&#8736;ACB = 40&deg;'],textfont:{color:['#3b82f6','#3b82f6','#f59e0b','#e8e8e8','#3b82f6','#f59e0b'],size:13},showlegend:false};
var arcX=[];var arcY=[];for(var j=0;j<=40;j++){var b=(-30+(50-(-30))*j/40)*Math.PI/180;arcX.push(0.27*Math.cos(b));arcY.push(0.27*Math.sin(b));}
var arcAOB={x:arcX,y:arcY,mode:'lines',name:'merkez yay',line:{color:'#3b82f6',width:2,dash:'dot'}};
var arcCX=[];var arcCY=[];for(var j=0;j<=30;j++){var b1=Math.atan2(Ay-Cy,Ax-Cx);var b2=Math.atan2(By-Cy,Bx-Cx);var bb=b1+(b2-b1)*j/30;arcCX.push(Cx+0.24*Math.cos(bb));arcCY.push(Cy+0.24*Math.sin(bb));}
var arcACB={x:arcCX,y:arcCY,mode:'lines',name:'çevre yay',line:{color:'#f59e0b',width:2,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l87-central-inscribed-tr',[ring,chordAB,radii,chords,arcAOB,arcACB,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Bir AB kirişi <strong>120&deg;</strong> ölçüsünde bir yay keser. P noktası karşıdaki büyük yayın üzerinde bulunur. APB çevre açısını bul.<br><br>Çevre Açı Teoremine göre:<br>$\\angle APB = \\tfrac{1}{2} \\cdot 120^\\circ = \\mathbf{60^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">ACB çevre açısı <strong>35&deg;</strong> ölçüsündedir. Aynı yayda AOB merkez açısı kaç derecedir?<br><br>Formülü tersine çevir: $\\angle AOB = 2 \\cdot \\angle ACB = 2 \\cdot 35^\\circ = \\mathbf{70^\\circ}$.<br><br>AB yayı da merkez açı ile aynı ölçüye sahiptir: $m(\\overset{\\frown}{AB}) = 70^\\circ$.</div></div>

<h2 class="lesson-title">3. Çevre Açı Doğal Sonucu: Aynı Yay, Aynı Açı</h2>

<div class="calc-highlight"><strong>C köşesini aynı yayın herhangi bir yerine taşı — çevre açı değişmez.</strong> Aynı kirişi (aynı tarafından) gören tüm çevre açılar eşittir. Bu, Çevre Açı Teoreminin doğrudan sonucudur: hepsi aynı yayın yarısına eşittir, dolayısıyla birbirlerine de eşit olmalıdırlar.</div>

<p class="l-text">Bu, problem çözmede son derece güçlü bir olgudur. Bir şekildeki iki açının aynı çemberin aynı kirişini gördüğünü ve o kirişin aynı tarafında olduğunu kanıtlayabilirsen, hemen eşit olduklarını söyleyebilirsin — daha fazla hesap yok. Tersine, aynı segmenti gören iki açın eşitse, dört nokta (segmentin iki uç noktası artı iki köşe) ortak bir çember üzerinde yer alır. Bu son gözlem, 7. bölümde gelecek olan tüm <em>kirişler dörtgeni</em> teorisinin temelidir.</p>

<div class="calc-formula"><div class="formula-label">AYNI YAY DOĞAL SONUCU</div><div class="formula-main">$$\\angle ACB \\;=\\; \\angle ADB \\;=\\; \\angle AEB \\;=\\; \\dots$$</div><div class="formula-sub">Eğer C, D, E, ... noktaları büyük yayda ve kiriş uç noktaları A, B ise, tüm çevre açılar eşittir.</div></div>

<div class="l-note"><strong>C'nin yeri neden fark etmez?</strong> Kendin dene. Bir AB kirişi seç. C noktasını büyük yayın kenarında kaydır. ACB açısını izle. ABC üçgeni şekil değiştirmesine rağmen açı sabit kalır. Geometrik olarak, aynı kirişle aynı yaya uygulanan Çevre Açı Teoremini görüyorsun — yayın yarısı değeri hiç değişmez.</div>

<h2 class="lesson-title">4. Thales Teoremi: Yarıçembere Çizilen Çevre Açı 90&deg;'dir</h2>

<div class="calc-highlight"><strong>Çevre Açı Teoreminin en ünlü özel hali.</strong> Kiriş bir <em>çap</em> olduğunda, gördüğü yay çemberin yarısıdır, yani 180&deg;. Formüle yerleştir: çevre açı 180&deg;'nin yarısı, tam olarak 90&deg;'dir. Dolayısıyla hipotenüsü çevrel çemberinin çapı olan her üçgen bir dik üçgendir.</div>

<p class="l-text">Bu sonuç Miletoslu Thales'e (~MÖ 600) atfedilir, tam çevre açı teoremi yazılmadan yüzyıllar önce. Yunan geometrisinin ilk "önemsiz olmayan" teoremidir. Modern dilde yeniden ifade ederiz:</p>

<div class="calc-formula"><div class="formula-label">THALES TEOREMİ</div><div class="formula-main">$$AB \\text{ bir çaptır} \\quad\\Longrightarrow\\quad \\angle ACB = 90^\\circ \\;\\;\\text{çember üzerindeki her } C \\text{ için}$$</div><div class="formula-sub">Ve karşıt yön: ACB açısı dik ve üç nokta bir çember üzerindeyse, AB o çemberin bir çapıdır.</div></div>

<div class="calc-graph"><div id="plot-l87-thales-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yatay AB çapı olan bir çember. Çemberin kenarında üç farklı C, D, E noktası A ve B'ye bağlanmış. ABC, ABD, ABE üçgenlerinin üçü de dik üçgendir; dik açı çember kenarındaki köşededir. Hipotenüs her zaman AB çapıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;th.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'çember',line:{color:'rgba(255,255,255,0.35)',width:1.6}};
var diam={x:[-1,1],y:[0,0],mode:'lines+markers',name:'AB çapı',line:{color:'#3b82f6',width:2.6},marker:{color:'#3b82f6',size:7}};
var Cx=Math.cos(60*Math.PI/180),Cy=Math.sin(60*Math.PI/180);
var Dx=Math.cos(120*Math.PI/180),Dy=Math.sin(120*Math.PI/180);
var Ex=Math.cos(150*Math.PI/180),Ey=Math.sin(150*Math.PI/180);
var t1={x:[-1,Cx,1],y:[0,Cy,0],mode:'lines+markers',name:'üçgen ABC',line:{color:'#f59e0b',width:2.2},marker:{color:'#f59e0b',size:6}};
var t2={x:[-1,Dx,1],y:[0,Dy,0],mode:'lines+markers',name:'üçgen ABD',line:{color:'#10b981',width:2.2},marker:{color:'#10b981',size:6}};
var t3={x:[-1,Ex,1],y:[0,Ey,0],mode:'lines+markers',name:'üçgen ABE',line:{color:'#ec4899',width:2.2},marker:{color:'#ec4899',size:6}};
function rightMark(px,py,ax,ay,bx,by,sz){var dx1=(ax-px),dy1=(ay-py);var L1=Math.hypot(dx1,dy1);var ux1=dx1/L1,uy1=dy1/L1;var dx2=(bx-px),dy2=(by-py);var L2=Math.hypot(dx2,dy2);var ux2=dx2/L2,uy2=dy2/L2;var p1x=px+sz*ux1,p1y=py+sz*uy1;var p3x=px+sz*ux2,p3y=py+sz*uy2;var p2x=px+sz*(ux1+ux2),p2y=py+sz*(uy1+uy2);return{x:[p1x,p2x,p3x],y:[p1y,p2y,p3y]};}
var rmC=rightMark(Cx,Cy,-1,0,1,0,0.09);
var rmD=rightMark(Dx,Dy,-1,0,1,0,0.09);
var rmE=rightMark(Ex,Ey,-1,0,1,0,0.09);
var rmCt={x:rmC.x,y:rmC.y,mode:'lines',name:'dik açı C',line:{color:'#f59e0b',width:1.6},showlegend:false};
var rmDt={x:rmD.x,y:rmD.y,mode:'lines',name:'dik açı D',line:{color:'#10b981',width:1.6},showlegend:false};
var rmEt={x:rmE.x,y:rmE.y,mode:'lines',name:'dik açı E',line:{color:'#ec4899',width:1.6},showlegend:false};
var labs={x:[-1.08,1.08,Cx+0.06,Dx-0.05,Ex-0.08],y:[-0.08,-0.08,Cy+0.08,Dy+0.08,Ey+0.06],mode:'text',name:'etiketler',text:['A','B','C (90&deg;)','D (90&deg;)','E (90&deg;)'],textfont:{color:['#3b82f6','#3b82f6','#f59e0b','#10b981','#ec4899'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{range:[-0.4,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l87-thales-tr',[ring,diam,t1,t2,t3,rmCt,rmDt,rmEt,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; THALES'İN İSPATI</div><div class="example-body">AB bir çap ve C çember üzerinde ise, ACB açısının 90&deg; olduğunu doğrudan göster.<br><br>O merkez olsun. O zaman OA = OB = OC = r (hepsi yarıçap). OAC üçgeni ikizkenardır, yani $\\angle OAC = \\angle OCA = \\alpha$. OBC üçgeni ikizkenardır, yani $\\angle OBC = \\angle OCB = \\beta$.<br><br>ABC üçgeninin üç iç açısı toplamı 180&deg;:<br>$\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$<br>$2(\\alpha + \\beta) = 180^\\circ$<br>$\\alpha + \\beta = 90^\\circ = \\angle ACB$. <strong>QED.</strong></div></div>

<div class="think-box"><div class="think-label">UYGULAMA</div><div class="think-body">Sana bir AB doğru parçası verilmiş ve APB = 90&deg; olan <em>tüm</em> P noktalarını bulman isteniyor. Thales anında cevabı verir: P, AB'yi çap kabul eden çemberin üzerinde olmalıdır. O çember, AB üzerindeki dik açıların yer eğrisidir — tek, temiz bir cevap.</div></div>

<h2 class="lesson-title">5. Teğet-Kiriş Açısı</h2>

<div class="calc-highlight"><strong>Peki açının iki kenarından biri kiriş yerine teğet olursa?</strong> Çevre Açı Teoremi sorunsuzca genişler: değme noktasından çizilen bir kirişle teğet arasındaki açı, kirişin teğet tarafında kestiği yayın yarısına eşittir.</div>

<p class="l-text">Bu, çevre açı resminin doğal limitidir. Bir çevre açının C köşesini, kirişin uç noktalarından biriyle neredeyse birleşene kadar çember kenarında kaydırdığını düşün. BC kirişi tek bir noktaya büzülür ve CB kenarı, B noktasındaki teğet doğruya döner. Ölçtüğün "çevre açı", bu teğet ile kalan BA kirişi arasındaki açı haline gelir — yarı yay formülü yine geçerlidir.</p>

<div class="calc-formula"><div class="formula-label">TEĞET-KİRİŞ AÇISI</div><div class="formula-main">$$\\angle(\\text{B'deki teğet},\\, BA) \\;=\\; \\tfrac{1}{2}\\, m(\\overset{\\frown}{BA})$$</div><div class="formula-sub">Söz konusu BA yayı, ölçtüğün açıyla aynı tarafta olan yaydır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">B noktasında bir teğet BA kirişiyle buluşuyor. Açı tarafındaki BA yayı <strong>140&deg;</strong>'dir. Teğet-kiriş açısını bul.<br><br>Kurala göre: açı = (1/2) &middot; 140&deg; = <strong>70&deg;</strong>.<br><br>Kontrol: kirişin diğer tarafındaki teğet-kiriş açısı, kalan 360&deg; &minus; 140&deg; = 220&deg; yayını görmelidir; bu da (1/2) &middot; 220&deg; = 110&deg; verir. Ve 70&deg; + 110&deg; = 180&deg; doğru bir sonuçtur çünkü kirişin iki tarafındaki teğet-kiriş açıları B'de düz bir doğru oluşturur (teğetin kendisi).</div></div>

<h2 class="lesson-title">6. Dış Noktadan Teğet-Teğet Açısı</h2>

<div class="calc-highlight"><strong>Çemberin dışındaki bir P noktasından çembere iki teğet çiz.</strong> Çembere T<sub>1</sub> ve T<sub>2</sub> noktalarında değerler. T<sub>1</sub>T<sub>2</sub> yayının P'ye yakın olanı <em>küçük yaydır</em> (genellikle "yakın yay" denir), uzak taraftaki uzun yay ise <em>büyük yaydır</em>. P'deki iki teğet arasındaki açı, iki yayın farkının yarısına eşittir.</div>

<div class="calc-formula"><div class="formula-label">TEĞET-TEĞET AÇISI</div><div class="formula-main">$$\\angle T_1 P T_2 \\;=\\; \\tfrac{1}{2}\\, \\big| m(\\overset{\\frown}{T_1 T_2})_{\\text{büyük}} \\;-\\; m(\\overset{\\frown}{T_1 T_2})_{\\text{küçük}} \\big|$$</div><div class="formula-sub">Değme noktalarının kestiği büyük ve küçük yayların farkının mutlak değerinin yarısı.</div></div>

<p class="l-text"><strong>Neden fark?</strong> Çevre ve teğet-kiriş açılar için kullandığımız genel kural şudur: çemberin içinde ya da üzerinde oluşan herhangi bir açı, gördüğü yayların <em>toplamının</em> yarısına eşittir; çemberin dışında oluşan herhangi bir açı ise <em>farkın</em> yarısına eşittir. Teğet-teğet durum, T<sub>1</sub>T<sub>2</sub> kirişinin kestiği iki yayla birlikte dış açı örüntüsüdür.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Dış bir P noktasından iki teğet çembere T<sub>1</sub> ve T<sub>2</sub>'de değiyor. Küçük T<sub>1</sub>T<sub>2</sub> yayı <strong>120&deg;</strong> ölçüsündedir. P'deki açıyı bul.<br><br>Büyük yay = 360&deg; &minus; 120&deg; = 240&deg;.<br>Fark = 240&deg; &minus; 120&deg; = 120&deg;.<br>P'deki açı = (1/2) &middot; 120&deg; = <strong>60&deg;</strong>.</div></div>

<div class="l-note"><strong>Mantık kontrolü.</strong> İki değme noktası çapsal olarak karşıt ise (iki yay da = 180&deg;), formül P'de 0&deg;'lik bir açı verir — bu doğrudur çünkü o durumda iki teğet doğru paraleldir ve sonlu hiçbir P'de buluşmaz. Yaylar eşitsiz olur olmaz, P sonlu bir nokta haline gelir ve açı büyür.</div>

<h2 class="lesson-title">7. Kirişler Dörtgeni: Karşılıklı Açıların Toplamı 180&deg;</h2>

<div class="calc-highlight"><strong>Kirişler dörtgeni, dört köşesi tek bir çember üzerinde yer alan dörtgendir.</strong> Tanımlayıcı özellik: karşılıklı açılar toplamı 180&deg;'dir. Bu, Çevre Açı Teoreminin iki kez uygulanmasının doğrudan sonucudur — köşegen yaylarının her biri için.</div>

<p class="l-text"><strong>Neden işliyor.</strong> Dörtgeni bir çembere yerleştirilmiş ABCD olarak etiketle; köşeler çember kenarında sırayla. A açısı (yani DAB), A'yı <em>içermeyen</em> BCD yayını gören bir çevre açıdır. C açısı (yani BCD), BAD yayını gören bir çevre açıdır. İki yay birlikte tüm çemberi oluşturur, yani ölçüleri 360&deg;'dir. Her birinin yarısı, iki çevre açıyı verir ve toplamları 180&deg;'dir.</p>

<div class="calc-formula"><div class="formula-label">KİRİŞLER DÖRTGENİ ÖZELLİĞİ</div><div class="formula-main">$$\\angle A + \\angle C \\;=\\; 180^\\circ \\qquad\\text{ve}\\qquad \\angle B + \\angle D \\;=\\; 180^\\circ$$</div><div class="formula-sub">Bir kirişler dörtgeninin her karşılıklı açı çifti birbirinin bütünleridir. Karşıt yönden: bir dörtgenin karşılıklı açıları bütünler ise, dörtgen kirişlerdir.</div></div>

<div class="calc-graph"><div id="plot-l87-cyclic-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> bir çembere yerleştirilmiş ABCD kirişler dörtgeni; bütünleyici özelliği sağlayan örnek açı değerleriyle. A açısı 70&deg;, C açısı 110&deg; — toplamları 180&deg;. B açısı 95&deg;, D açısı 85&deg; — onlar da 180&deg;'ye toplar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;th.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ring={x:xc,y:yc,mode:'lines',name:'çember',line:{color:'rgba(255,255,255,0.35)',width:1.6}};
var Ax=Math.cos(140*Math.PI/180),Ay=Math.sin(140*Math.PI/180);
var Bx=Math.cos(55*Math.PI/180),By=Math.sin(55*Math.PI/180);
var Cx=Math.cos(-25*Math.PI/180),Cy=Math.sin(-25*Math.PI/180);
var Dx=Math.cos(-130*Math.PI/180),Dy=Math.sin(-130*Math.PI/180);
var quad={x:[Ax,Bx,Cx,Dx,Ax],y:[Ay,By,Cy,Dy,Ay],mode:'lines+markers',name:'dörtgen ABCD',line:{color:'#3b82f6',width:2.6},marker:{color:'#3b82f6',size:8}};
var diag1={x:[Ax,Cx],y:[Ay,Cy],mode:'lines',name:'AC köşegeni',line:{color:'rgba(245,158,11,0.55)',width:1.6,dash:'dot'}};
var diag2={x:[Bx,Dx],y:[By,Dy],mode:'lines',name:'BD köşegeni',line:{color:'rgba(16,185,129,0.55)',width:1.6,dash:'dot'}};
var labs={x:[Ax-0.12,Bx+0.08,Cx+0.12,Dx-0.1,Ax-0.05,Bx-0.02,Cx+0.02,Dx-0.02],y:[Ay+0.06,By+0.08,Cy-0.02,Dy-0.1,Ay-0.18,By-0.18,Cy+0.16,Dy+0.18],mode:'text',name:'etiketler',text:['A','B','C','D','70&deg;','95&deg;','110&deg;','85&deg;'],textfont:{color:['#3b82f6','#3b82f6','#3b82f6','#3b82f6','#f59e0b','#10b981','#f59e0b','#10b981'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l87-cyclic-tr',[ring,quad,diag1,diag2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Bir ABCD kirişler dörtgeninde A açısı 65&deg;, B açısı 120&deg;'dir. C ve D açılarını bul.<br><br>A'nın karşısı C: $\\angle C = 180^\\circ - \\angle A = 180^\\circ - 65^\\circ = \\mathbf{115^\\circ}$.<br>B'nin karşısı D: $\\angle D = 180^\\circ - \\angle B = 180^\\circ - 120^\\circ = \\mathbf{60^\\circ}$.<br><br>Kontrol: açılar toplamı 65 + 120 + 115 + 60 = 360&deg; &check; (her dörtgenin iç açıları toplamı 360&deg;).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; PTOLEMY TEOREMİ (kısa)</div><div class="example-body">Kenarları $a = AB$, $b = BC$, $c = CD$, $d = DA$ ve köşegenleri $p = AC$, $q = BD$ olan bir ABCD kirişler dörtgeni için Ptolemy teoremi şöyledir:<br><br>$$ac + bd \\;=\\; pq$$<br>"Köşegenlerin çarpımı, karşılıklı kenar çarpımlarının toplamına eşittir." Bu yalnızca kirişler dörtgenleri için geçerlidir; diğer her dörtgen için $ac + bd \\geq pq$ (Ptolemy eşitsizliği).<br><br>Tam ispat benzer üçgenler kullanır ve klasik bir alıştırmadır. Formülü ve kirişler dörtgenini karakterize ettiği gerçeğini hatırla.</div></div>

<h2 class="lesson-title">8. Kesişen Kirişler Teoremi (Nokta Kuvveti)</h2>

<div class="calc-highlight"><strong>Çemberin içinde kesişen iki kiriş çiz.</strong> Bir P noktasında buluşsunlar; birinci kiriş PA ve PB parçalarına, ikincisi PC ve PD parçalarına ayrılsın. Çarpımlar eşittir: <strong>PA &middot; PB = PC &middot; PD</strong>. Bu değişmeze P noktasının <em>kuvveti</em> denir.</div>

<p class="l-text">Kesişen kirişler teoremi, çevre açı doğal sonucunun doğrudan bir sonucudur. APC ve DPB üçgenleri benzerdir (P'deki ters açıları ortaktır ve A ile D'deki çevre açılar aynı BC yayını görür). Benzerlikten PA/PD = PC/PB elde edilir, çapraz çarpımı da PA &middot; PB = PC &middot; PD'yi verir. Ortak PA &middot; PB değeri, P'den geçen hangi kirişi seçtiğine bağlı değildir; yalnızca P noktasına ve çembere bağlıdır.</p>

<div class="calc-formula"><div class="formula-label">KESİŞEN KİRİŞLER TEOREMİ</div><div class="formula-main">$$PA \\cdot PB \\;=\\; PC \\cdot PD$$</div><div class="formula-sub">Çemberin AB ve CD kirişleri çemberin içinde P noktasında kesiştiğinde. P'den geçen her kiriş için aynı sabit değer; bu değere P'nin kuvveti diyelim.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">İki kiriş AB ve CD çemberin içinde P noktasında kesişiyor. Ölçümler: PA = 4 cm, PB = 6 cm, PC = 3 cm. PD'yi bul.<br><br>Teoreme göre: $PA \\cdot PB = PC \\cdot PD$.<br>$4 \\cdot 6 = 3 \\cdot PD$<br>$24 = 3 \\cdot PD$<br>$PD = \\mathbf{8\\text{ cm}}$.</div></div>

<div class="l-note"><strong>Dış nokta için varyantlar.</strong> Eğer P çemberin <em>dışında</em> ise ve çemberi A ve B'de kesen bir kesen doğru çizersen (PA daha kısa olmak üzere), aynı PA &middot; PB çarpımı P'den geçen her kesen için sabittir. P'den bir teğet çekersen ve T'de değerse, kuvvet $PT^2$'ye eşittir. Yani dış P için: $PA \\cdot PB = PT^2$. Birleşik ifade <em>Nokta Kuvveti Teoremidir</em>.</div>

<h2 class="lesson-title">9. Yaygın Hatalar ve Onlardan Kaçınma Yolları</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki katı mı, yarısı mı?</div><div class="card-body">Çevre açı = (1/2) &middot; merkez açı, asla ters yönde değil. Çevre açı verildiğinde, merkez açıyı bulmak için <em>iki katını</em> al; merkez verildiğinde <em>yarısını</em> al.</div></div>
<div class="calc-card"><div class="card-title">Hangi yay?</div><div class="card-body">Her kirişin iki yayı vardır. Çevre açı formülü, köşeden zıt tarafta olan yayı kullanır. Hangi tarafta olduğunu yanlış okumak küçük ve büyük yayı yer değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Kirişler dörtgeni kontrolü</div><div class="card-body">Karşılıklı açıların bütünler olma kuralını çağırmadan önce, dörtgenin gerçekten kirişler olduğunu doğrula. Her dörtgen bir çembere yerleşmez.</div></div>
<div class="calc-card"><div class="card-title">Teğet vs kesen</div><div class="card-body">Teğet-kiriş kuralı tek bir yay kullanır; dışarıdan teğet-teğet kuralı iki yayın farkını kullanır. Bunları karıştırmak, deneme sınavlarındaki en yaygın hatadır.</div></div>
</div>

<div class="think-box"><div class="think-label">KENDİ KENDİNE TEST</div><div class="think-body">Geri bakmadan: birer cümleyle ifade et — (a) Çevre Açı Teoremi, (b) Thales teoremi, (c) kirişler dörtgeni özelliği, (d) kesişen kirişler teoremi. Dördünü de yapabiliyorsan, alıştırma kümesine hazırsın.</div></div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; ÇEVREDEN MERKEZE</div><div class="example-body"><strong>Çember içinde bir çevre açı 28&deg; ölçüsündedir. Aynı yaydaki merkez açıyı ve yay ölçüsünü bul.</strong><br><br>Merkez = 2 &middot; 28&deg; = <strong>56&deg;</strong>. Yay ölçüsü = merkez = <strong>56&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; YAYDAN ÇEVREYE</div><div class="example-body"><strong>Çemberin bir yayı 130&deg; ölçüsündedir. Karşı taraftan bu yayı gören çevre açıyı bul.</strong><br><br>Çevre = (1/2) &middot; 130&deg; = <strong>65&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; THALES'İ UYGULAMA</div><div class="example-body"><strong>Bir çembere yerleştirilmiş bir üçgenin bir kenarı çapa eşittir. Diğer iki kenarın uzunlukları 6 ve 8'dir. Çapı bul.</strong><br><br>Thales'e göre üçgen, çapa karşı köşede dik açılıdır. Çap hipotenüstür. Pisagor'a göre: $d^2 = 6^2 + 8^2 = 36 + 64 = 100$, yani $d = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; KİRİŞLER DÖRTGENİ</div><div class="example-body"><strong>Bir kirişler dörtgeninin sırayla çember etrafındaki açıları A, B, C, D'dir. A = 72&deg; ve B = 95&deg; verildiğine göre, C ve D'yi bul.</strong><br><br>C, A'nın karşısıdır: $C = 180^\\circ - 72^\\circ = \\mathbf{108^\\circ}$.<br>D, B'nin karşısıdır: $D = 180^\\circ - 95^\\circ = \\mathbf{85^\\circ}$.<br>Toplamı kontrol et: 72 + 95 + 108 + 85 = 360&deg; &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; KESİŞEN KİRİŞLER</div><div class="example-body"><strong>İki kiriş AB ve CD bir çemberin içinde P noktasında kesişiyor. PA = 5, PB = 12 ve PC = 6. PD'yi bul.</strong><br><br>Kesişen kirişler teoremine göre: $PA \\cdot PB = PC \\cdot PD$.<br>$5 \\cdot 12 = 6 \\cdot PD$<br>$60 = 6 \\cdot PD$<br>$PD = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; TEĞET-KİRİŞ</div><div class="example-body"><strong>T noktasındaki bir teğet bir TA kirişiyle buluşuyor. Teğet tarafındaki TA yayı 110&deg; ölçüsündedir. Teğet-kiriş açısı nedir?</strong><br><br>Açı = (1/2) &middot; 110&deg; = <strong>55&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; DIŞ NOKTADAN TEĞET-TEĞET</div><div class="example-body"><strong>Dış bir P noktasından iki teğet çembere T<sub>1</sub> ve T<sub>2</sub>'de değiyor. Küçük T<sub>1</sub>T<sub>2</sub> yayı 80&deg;'dir. T<sub>1</sub>PT<sub>2</sub> açısını bul.</strong><br><br>Büyük yay = 360&deg; &minus; 80&deg; = 280&deg;.<br>Fark = 280&deg; &minus; 80&deg; = 200&deg;.<br>P'deki açı = (1/2) &middot; 200&deg; = <strong>100&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; BİRLEŞİK</div><div class="example-body"><strong>ABC üçgeni AB çap olmak üzere bir çembere yerleştirilmiştir. BAC açısı 35&deg; ölçüsündedir. ABC açısını ve BC yayını bul.</strong><br><br>Thales'e göre: $\\angle ACB = 90^\\circ$.<br>Açı toplamı: $\\angle ABC = 180^\\circ - 35^\\circ - 90^\\circ = \\mathbf{55^\\circ}$.<br><br>Şimdi, BAC açısı BC yayını gören bir çevre açıdır. Yani $m(\\overset{\\frown}{BC}) = 2 \\cdot 35^\\circ = \\mathbf{70^\\circ}$.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Sonraki dersler bu açı ilişkilerini koordinat problemlerine dönüştürür: çemberin denklemini yazmak, dış bir noktadan teğet doğruları cebirsel olarak bulmak ve uzunlukları ölçmeden hesaplamak için nokta kuvvetini kullanmak. Burada inşa ettiğin geometrik resimler, her cebirsel hesabın altındaki sessiz iskelet olacak.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Merkez açı (köşe merkezde) = gördüğü yay</li>
<li>Çevre açı (köşe çember üzerinde) = aynı yaydaki merkez açının (1/2) katı</li>
<li>Aynı yaydaki tüm çevre açılar birbirine eşittir</li>
<li>Thales: yarıçembere çizilen çevre açı 90&deg;'dir</li>
<li>Teğet-kiriş açısı = (1/2) &middot; kesilen yay</li>
<li>Dış P'den teğet-teğet açısı = (1/2) &middot; |büyük yay &minus; küçük yay|</li>
<li>Kirişler dörtgeni: karşılıklı açılar toplamı 180&deg;'dir</li>
<li>Ptolemy: kirişler dörtgeninin kenarları ve köşegenleri için $ac + bd = pq$</li>
<li>Kesişen kirişler: PA &middot; PB = PC &middot; PD (nokta kuvveti)</li>
</ul>
</div>`

};
