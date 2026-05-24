window.LISE_MAT_L90 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This lesson finishes solid geometry by collecting the three "round" solids the high-school curriculum cares about most:</strong> the right circular <em>cylinder</em>, the right circular <em>cone</em>, and the <em>sphere</em>. Each one has a tidy volume formula and a tidy surface-area formula, and every one of those formulas hides a short geometric argument you should be able to reconstruct from a picture. Memorise the formulas, but spend an extra minute making sense of <em>why</em> the cone has the factor of one-third and why the sphere's surface area is exactly four times its great-circle area.</p>

<p class="l-text">Cans, ice-cream cones, water tanks, planets, balloons, fuel tanks, light bulbs, sports balls, silos, and the dome of Hagia Sophia — almost every "round" object in the physical world is one of these three shapes, or a combination of them. The exam questions will be about cans, cones, and balls, but the same ideas describe the world outside the classroom too.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute volume and surface area of a right circular cylinder with radius r and height h</li>
<li>Compute volume, lateral surface, and total surface of a right circular cone using its slant height l = √(r²+h²)</li>
<li>Apply the Pythagorean theorem to recover the slant height of a cone from r and h</li>
<li>Compute the volume and surface area of a sphere, and of a hemisphere (open or closed)</li>
<li>Compute the volume of a frustum (truncated cone) from its two radii and height</li>
<li>Recognise common errors: missing the 1/3 in cone volume, forgetting the two disc caps for a closed cylinder</li>
<li>Apply these formulas to word problems about cans, tanks, ice-cream cones, and water displacement</li>
</ul>
</div>

<h2 class="lesson-title">1. The Right Circular Cylinder</h2>

<div class="calc-highlight"><strong>A cylinder is a "stretched circle".</strong> Start with a flat circular disc of radius r. Lift it straight up by a vertical distance h, and trace out the volume your disc sweeps through. That is the right circular cylinder: two parallel circular caps of radius r connected by a curved side wall of height h.</div>

<p class="l-text">A soup can, a water tank, a glass, a tin of paint, a roll of toilet paper — all right circular cylinders. The word "right" means the side wall is perpendicular to the caps (no leaning). The word "circular" means the cross-section is a circle, not an ellipse or polygon. In this course "cylinder" always means "right circular cylinder" unless we say otherwise.</p>

<div class="calc-formula"><div class="formula-label">CYLINDER &mdash; VOLUME</div><div class="formula-main">$$V \\;=\\; \\pi r^{2} h$$</div><div class="formula-sub">Area of one circular cap times the height. Because the cylinder is a prism with a circular base, the volume formula is (base area) &times; (height) — exactly the same rule as a rectangular prism.</div></div>

<p class="l-text">The two flat caps each have area $\\pi r^{2}$. The curved side wall is harder, but there is a one-line trick: imagine the cylinder is made of paper. Slit the side wall along a single vertical line and unroll it flat. What you get is a rectangle. Its height is the cylinder's height h. Its width is the circumference of the cap, $2 \\pi r$. So the lateral area is just the rectangle's area:</p>

<div class="calc-formula"><div class="formula-label">CYLINDER &mdash; LATERAL SURFACE AREA</div><div class="formula-main">$$S_{\\text{lat}} \\;=\\; 2 \\pi r \\, h$$</div><div class="formula-sub">Circumference of the cap multiplied by the height. "Lateral" means only the curved side; the two flat caps are not included.</div></div>

<div class="calc-formula"><div class="formula-label">CYLINDER &mdash; TOTAL SURFACE AREA</div><div class="formula-main">$$S_{\\text{total}} \\;=\\; 2 \\pi r^{2} + 2 \\pi r h \\;=\\; 2 \\pi r \\, (r + h)$$</div><div class="formula-sub">Two caps plus the lateral wall. Factor out $2 \\pi r$ and you get a memorable single product.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Open-top can</div><div class="card-body">A can with no lid (a cup, a beaker): one cap is missing. $S = \\pi r^{2} + 2 \\pi r h$.</div></div>
<div class="calc-card"><div class="card-title">Pipe (no caps)</div><div class="card-body">A length of pipe is just the curved wall, no caps: $S = 2 \\pi r h$.</div></div>
<div class="calc-card"><div class="card-title">Closed can</div><div class="card-body">Both caps present (a tinned-tomato can): $S = 2 \\pi r^{2} + 2 \\pi r h$. This is the default.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A tin can has radius $r = 3$ cm and height $h = 10$ cm. Find the volume and the total surface area (closed can).<br><br>$V = \\pi r^{2} h = \\pi \\cdot 9 \\cdot 10 = \\mathbf{90 \\pi}$ cm³ $\\approx 282.7$ cm³.<br><br>$S = 2 \\pi r (r + h) = 2 \\pi \\cdot 3 \\cdot 13 = \\mathbf{78 \\pi}$ cm² $\\approx 245.0$ cm².</div></div>

<div class="calc-graph"><div id="plot-l90-cyl-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a right circular cylinder of radius r and height h. The two parallel discs at top and bottom are the caps (each area $\\pi r^{2}$). The curved blue surface is the lateral wall — if you slit it and unroll it, it becomes a rectangle of width $2 \\pi r$ and height h. The arrows label the two parameters you need to compute volume and surface area.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=1.2,h=2.5;
var th=[];var xc=[];var yt=[];var yb=[];var zc=[];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;th.push(a);xc.push(r*Math.cos(a));yt.push(r*Math.sin(a));zc.push(0);}
var side={type:'surface',x:[],y:[],z:[],colorscale:[[0,'#1e3a8a'],[1,'#3b82f6']],showscale:false,opacity:0.85,name:'side wall'};
var xs=[];var ys=[];var zs=[];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;xs.push([r*Math.cos(a),r*Math.cos(a)]);ys.push([r*Math.sin(a),r*Math.sin(a)]);zs.push([0,h]);}
side.x=xs;side.y=ys;side.z=zs;
var capTop={x:[],y:[],z:[],type:'mesh3d',color:'#60a5fa',opacity:0.7,showscale:false,name:'top cap'};
var capBot={x:[],y:[],z:[],type:'mesh3d',color:'#60a5fa',opacity:0.7,showscale:false,name:'bottom cap'};
var cx=[0],cy=[0],cz=[h];var cxb=[0],cyb=[0],czb=[0];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;cx.push(r*Math.cos(a));cy.push(r*Math.sin(a));cz.push(h);cxb.push(r*Math.cos(a));cyb.push(r*Math.sin(a));czb.push(0);}
capTop.x=cx;capTop.y=cy;capTop.z=cz;
capBot.x=cxb;capBot.y=cyb;capBot.z=czb;
var rayR={x:[0,r],y:[0,0],z:[0,0],mode:'lines+text',type:'scatter3d',line:{color:'#f59e0b',width:5},text:['','r'],textposition:'top center',textfont:{color:'#f59e0b',size:14},showlegend:false};
var rayH={x:[r,r],y:[0,0],z:[0,h],mode:'lines+text',type:'scatter3d',line:{color:'#10b981',width:5},text:['','h'],textposition:'middle right',textfont:{color:'#10b981',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},aspectmode:'data',camera:{eye:{x:1.7,y:1.7,z:1.0}}},margin:{t:20,r:10,b:10,l:10},showlegend:false};
Plotly.newPlot('plot-l90-cyl-en',[side,capTop,capBot,rayR,rayH],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A cylinder has its radius doubled but its height left unchanged. By what factor does the volume change? (Answer: $V = \\pi r^{2} h$ is quadratic in r, so doubling r multiplies V by $2^{2} = 4$.) What if the height also doubled? (Then V multiplies by $4 \\times 2 = 8$.)</div></div>

<h2 class="lesson-title">2. The Right Circular Cone</h2>

<div class="calc-highlight"><strong>A cone is a "pointed cylinder".</strong> Take the same circular disc of radius r. Now instead of lifting it straight up, lift only its centre by a height h while pinching the rim down to that single raised point. What you sweep out is a right circular cone: one flat circular base of radius r, one apex point directly above the centre at height h, and a curved sloped wall connecting them.</div>

<p class="l-text">An ice-cream cone, a party hat, the tip of a pencil, a traffic cone, a paper drinking cup, the funnel of a kitchen — all right circular cones (or pieces of them). Again "right" means the apex sits directly above the centre of the base, not off to one side. The line from the apex perpendicular to the base is the cone's <strong>axis</strong>, and its length is the <strong>height</strong> h.</p>

<div class="calc-formula"><div class="formula-label">CONE &mdash; VOLUME</div><div class="formula-main">$$V \\;=\\; \\frac{1}{3} \\, \\pi r^{2} h$$</div><div class="formula-sub">Exactly one-third the volume of the cylinder with the same radius and height. The factor of 1/3 is not arbitrary — Cavalieri's principle and calculus both confirm it. We will preview the argument in section 9.</div></div>

<p class="l-text"><strong>Slant height.</strong> Before we can write down the surface formulas, we need one more length: the distance from the apex straight down the curved wall to a point on the rim. This is the <strong>slant height</strong>, written $\\ell$ (script l). Crucially, $\\ell$ is <em>not</em> the height h. The height runs straight up through the middle; the slant runs along the outside surface.</p>

<div class="calc-formula"><div class="formula-label">CONE &mdash; SLANT HEIGHT (PYTHAGORAS)</div><div class="formula-main">$$\\ell \\;=\\; \\sqrt{r^{2} + h^{2}}$$</div><div class="formula-sub">The apex, the centre of the base, and a point on the rim form a right triangle with legs r and h and hypotenuse $\\ell$. Apply Pythagoras to the right-angled triangle and you read off the slant height.</div></div>

<div class="calc-formula"><div class="formula-label">CONE &mdash; LATERAL SURFACE AREA</div><div class="formula-main">$$S_{\\text{lat}} \\;=\\; \\pi r \\ell$$</div><div class="formula-sub">If you slit the curved wall along one slant line and unroll it, you get a circular sector of radius $\\ell$ whose arc length is $2 \\pi r$ (the original rim). The area of that sector is $\\pi r \\ell$.</div></div>

<div class="calc-formula"><div class="formula-label">CONE &mdash; TOTAL SURFACE AREA</div><div class="formula-main">$$S_{\\text{total}} \\;=\\; \\pi r^{2} + \\pi r \\ell \\;=\\; \\pi r \\, (r + \\ell)$$</div><div class="formula-sub">One flat base disc plus the lateral wall. For an open ice-cream cone the $\\pi r^{2}$ disappears.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A cone has base radius $r = 4$ cm and height $h = 3$ cm. Find the slant height, the volume, and the total surface area.<br><br><strong>Slant height:</strong> $\\ell = \\sqrt{r^{2} + h^{2}} = \\sqrt{16 + 9} = \\sqrt{25} = 5$ cm.<br><br><strong>Volume:</strong> $V = \\tfrac{1}{3} \\pi r^{2} h = \\tfrac{1}{3} \\pi \\cdot 16 \\cdot 3 = \\mathbf{16 \\pi}$ cm³.<br><br><strong>Total surface area:</strong> $S = \\pi r (r + \\ell) = \\pi \\cdot 4 \\cdot (4 + 5) = \\mathbf{36 \\pi}$ cm².<br><br>That breakdown: base $\\pi r^{2} = 16 \\pi$ plus lateral $\\pi r \\ell = 20 \\pi$, total $36 \\pi$. The (3, 4, 5) right triangle makes this the canonical textbook example — keep it in your head as a sanity check.</div></div>

<div class="calc-graph"><div id="plot-l90-cone-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a right circular cone with radius r at the base and apex at height h. Three labelled segments: r runs from the centre of the base to the rim (orange), h runs straight up the axis from the centre to the apex (green), and $\\ell$ runs along the slanted side from the rim to the apex (red). The three segments form a right triangle in the vertical plane: $\\ell^{2} = r^{2} + h^{2}$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=1.4,h=2.6;
var ell=Math.sqrt(r*r+h*h);
var side={type:'surface',x:[],y:[],z:[],colorscale:[[0,'#1e3a8a'],[1,'#3b82f6']],showscale:false,opacity:0.85};
var xs=[];var ys=[];var zs=[];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;xs.push([r*Math.cos(a),0]);ys.push([r*Math.sin(a),0]);zs.push([0,h]);}
side.x=xs;side.y=ys;side.z=zs;
var base={x:[0],y:[0],z:[0],type:'mesh3d',color:'#60a5fa',opacity:0.6,showscale:false};
var bx=[0],by=[0],bz=[0];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;bx.push(r*Math.cos(a));by.push(r*Math.sin(a));bz.push(0);}
base.x=bx;base.y=by;base.z=bz;
var rayR={x:[0,r],y:[0,0],z:[0,0],mode:'lines+text',type:'scatter3d',line:{color:'#f59e0b',width:5},text:['','r'],textposition:'top center',textfont:{color:'#f59e0b',size:14},showlegend:false};
var rayH={x:[0,0],y:[0,0],z:[0,h],mode:'lines+text',type:'scatter3d',line:{color:'#10b981',width:5},text:['','h'],textposition:'middle right',textfont:{color:'#10b981',size:14},showlegend:false};
var rayL={x:[r,0],y:[0,0],z:[0,h],mode:'lines+text',type:'scatter3d',line:{color:'#ef4444',width:5},text:['','ℓ'],textposition:'middle right',textfont:{color:'#ef4444',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},aspectmode:'data',camera:{eye:{x:1.7,y:1.7,z:1.0}}},margin:{t:20,r:10,b:10,l:10},showlegend:false};
Plotly.newPlot('plot-l90-cone-en',[side,base,rayR,rayH,rayL],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Common mistake:</strong> students plug the height h into the lateral surface formula $\\pi r \\ell$ instead of the slant height $\\ell$. Always compute $\\ell$ first from $\\sqrt{r^{2} + h^{2}}$, then plug into the surface formula. The two are only equal for the degenerate "cone" with $r = 0$, which is just a vertical line.</div>

<h2 class="lesson-title">3. The Frustum (Truncated Cone)</h2>

<div class="calc-highlight"><strong>A frustum is what you get when you slice off the tip of a cone with a plane parallel to its base.</strong> Bucket, flower pot, lampshade, paper coffee cup — all frustums. Two parallel circular caps of different radii (call them R for the bigger and r for the smaller) separated by a height h.</div>

<div class="calc-formula"><div class="formula-label">FRUSTUM &mdash; VOLUME</div><div class="formula-main">$$V \\;=\\; \\frac{1}{3} \\, \\pi h \\, (R^{2} + R r + r^{2})$$</div><div class="formula-sub">Symmetric in R and r. Plug $r = 0$ and you recover the cone formula $\\tfrac{1}{3} \\pi R^{2} h$; plug $R = r$ and you recover the cylinder formula $\\pi r^{2} h$. Two sanity checks in one.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A flower pot is a frustum with bottom radius $r = 6$ cm, top radius $R = 10$ cm, and height $h = 12$ cm. Find its volume.<br><br>$V = \\tfrac{1}{3} \\pi \\cdot 12 \\cdot (100 + 60 + 36) = 4 \\pi \\cdot 196 = \\mathbf{784 \\pi}$ cm³ $\\approx 2463$ cm³ $\\approx 2.46$ litres.<br><br>That is enough volume for a healthy-sized basil plant.</div></div>

<h2 class="lesson-title">4. The Sphere</h2>

<div class="calc-highlight"><strong>A sphere is the set of all points in 3D space at a fixed distance r from a centre point.</strong> The third dimensional analogue of a circle. Footballs, basketballs, the Earth, oranges, ball bearings — all spheres (or close approximations).</div>

<p class="l-text">Unlike the cylinder and cone, the sphere has no flat parts at all. The whole surface is curved. The whole interior is uniform. Just one parameter — the radius r — determines everything about it.</p>

<div class="calc-formula"><div class="formula-label">SPHERE &mdash; VOLUME</div><div class="formula-main">$$V \\;=\\; \\frac{4}{3} \\, \\pi r^{3}$$</div><div class="formula-sub">Cubic in r. Doubling the radius multiplies the volume by 8.</div></div>

<div class="calc-formula"><div class="formula-label">SPHERE &mdash; SURFACE AREA</div><div class="formula-main">$$S \\;=\\; 4 \\, \\pi r^{2}$$</div><div class="formula-sub">Exactly four times the area $\\pi r^{2}$ of the great circle (the largest cross-section). Archimedes proved this by an extraordinary geometric argument over 2200 years ago.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why "4/3"?</div><div class="card-body">Archimedes' theorem: the volume of a sphere is exactly two-thirds the volume of the smallest cylinder that contains it. Cylinder volume = $\\pi r^{2} \\cdot 2 r = 2 \\pi r^{3}$. Two-thirds of that is $\\tfrac{4}{3} \\pi r^{3}$.</div></div>
<div class="calc-card"><div class="card-title">Why "4"?</div><div class="card-body">Archimedes also showed the surface area of a sphere equals the lateral area of the same circumscribing cylinder. Lateral area = $2 \\pi r \\cdot 2r = 4 \\pi r^{2}$. Asked at his death which result he wanted on his tomb, he chose this one.</div></div>
<div class="calc-card"><div class="card-title">Earth check</div><div class="card-body">Earth's radius is about 6371 km. Surface area $4 \\pi r^{2} \\approx 5.1 \\times 10^{8}$ km² — three-quarters of which is ocean. Plug in and verify.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">A sphere has radius $r = 6$ cm. Find its volume and surface area.<br><br>$V = \\tfrac{4}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi \\cdot 216 = \\mathbf{288 \\pi}$ cm³ $\\approx 904.8$ cm³.<br><br>$S = 4 \\pi r^{2} = 4 \\pi \\cdot 36 = \\mathbf{144 \\pi}$ cm² $\\approx 452.4$ cm².</div></div>

<div class="calc-graph"><div id="plot-l90-sphere-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a sphere of radius r with its <em>great circle</em> (the largest cross-section through the centre, the dashed yellow ring). The orange segment from centre to rim marks r. Every plane through the centre cuts the sphere in a great circle of radius r; every other plane cuts it in a smaller circle.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=1.5;
var u=[];var v=[];
for(var i=0;i<=30;i++)u.push(Math.PI*i/30);
for(var j=0;j<=60;j++)v.push(2*Math.PI*j/60);
var xs=[];var ys=[];var zs=[];
for(var i=0;i<u.length;i++){var rowx=[];var rowy=[];var rowz=[];for(var j=0;j<v.length;j++){rowx.push(r*Math.sin(u[i])*Math.cos(v[j]));rowy.push(r*Math.sin(u[i])*Math.sin(v[j]));rowz.push(r*Math.cos(u[i]));}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var sph={type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'#1e3a8a'],[1,'#3b82f6']],showscale:false,opacity:0.65};
var cx=[];var cy=[];var cz=[];for(var k=0;k<=60;k++){var a=2*Math.PI*k/60;cx.push(r*Math.cos(a));cy.push(r*Math.sin(a));cz.push(0);}
var great={x:cx,y:cy,z:cz,type:'scatter3d',mode:'lines',line:{color:'#facc15',width:5,dash:'dash'},name:'great circle',showlegend:false};
var rayR={x:[0,r],y:[0,0],z:[0,0],mode:'lines+text',type:'scatter3d',line:{color:'#f59e0b',width:5},text:['','r'],textposition:'top center',textfont:{color:'#f59e0b',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},aspectmode:'data',camera:{eye:{x:1.6,y:1.6,z:1.0}}},margin:{t:20,r:10,b:10,l:10},showlegend:false};
Plotly.newPlot('plot-l90-sphere-en',[sph,great,rayR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. The Hemisphere</h2>

<div class="calc-highlight"><strong>Slice a sphere in half through its centre.</strong> Each piece is a <em>hemisphere</em>. A hemisphere has a curved spherical part and a single flat circular cap (the great circle exposed by the slice). Examples: a dome, a half-orange, a salad bowl, a planetarium roof.</div>

<div class="calc-formula"><div class="formula-label">HEMISPHERE &mdash; VOLUME</div><div class="formula-main">$$V \\;=\\; \\frac{2}{3} \\, \\pi r^{3}$$</div><div class="formula-sub">Exactly half of the full sphere's volume $\\tfrac{4}{3} \\pi r^{3}$.</div></div>

<div class="calc-formula"><div class="formula-label">HEMISPHERE &mdash; SURFACE AREA (CLOSED, WITH FLAT CAP)</div><div class="formula-main">$$S \\;=\\; 2 \\pi r^{2} + \\pi r^{2} \\;=\\; 3 \\pi r^{2}$$</div><div class="formula-sub">Half the sphere's curved surface ($\\tfrac{1}{2} \\cdot 4 \\pi r^{2} = 2 \\pi r^{2}$) plus the disc covering the cut ($\\pi r^{2}$). For an open hemisphere (no flat cap, e.g. an upturned salad bowl viewed from outside) it is just $2 \\pi r^{2}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; HEMISPHERE BOWL</div><div class="example-body">A hemispherical salad bowl has inner radius $r = 12$ cm. How much salad can it hold (in litres)?<br><br>$V = \\tfrac{2}{3} \\pi r^{3} = \\tfrac{2}{3} \\pi \\cdot 1728 = \\mathbf{1152 \\pi}$ cm³ $\\approx 3619$ cm³ $\\approx 3.62$ litres.<br><br>Plenty for a family of four. The same bowl filled with water weighs about 3.6 kg.</div></div>

<h2 class="lesson-title">6. Spherical Cap and Spherical Sector (Quick Preview)</h2>

<p class="l-text">A <strong>spherical cap</strong> is what you get by slicing a sphere with a plane that does <em>not</em> pass through the centre — a single rounded "lid" of height h above (or below) the cut. A <strong>spherical sector</strong> is the ice-cream-cone-shaped solid formed by a spherical cap plus the cone joining its base to the centre of the sphere. These show up in physics (dome cross-sections, satellite footprints) and engineering (lens design), but the high-school curriculum rarely requires their formulas. For reference:</p>

<div class="calc-formula"><div class="formula-label">SPHERICAL CAP &mdash; VOLUME AND SURFACE</div><div class="formula-main">$$V_{\\text{cap}} \\;=\\; \\frac{\\pi h^{2}}{3} \\, (3r - h), \\qquad S_{\\text{curved}} \\;=\\; 2 \\pi r h$$</div><div class="formula-sub">r is the sphere's radius, h is the cap's height (perpendicular distance from cut plane to top of cap). The curved-area formula $2 \\pi r h$ is the same as a cylinder's lateral area for the equivalent slice — a deep result.</div></div>

<div class="l-note"><strong>Optional aside.</strong> The surprising identity $S_{\\text{cap}} = 2 \\pi r h$ says that the area of a horizontal slice of the sphere depends only on the slice's height, not on where the slice sits. That is why orange slices of equal height have equal peel area, even though they look so different near the equator versus the pole. It is a special case of Archimedes' "hat box" theorem.</div>

<h2 class="lesson-title">7. Summary Table of Volume and Surface Formulas</h2>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Solid</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Volume V</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Lateral surface</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Total surface</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Cylinder</td><td style="padding:0.5rem 0.8rem">$\\pi r^{2} h$</td><td style="padding:0.5rem 0.8rem">$2 \\pi r h$</td><td style="padding:0.5rem 0.8rem">$2 \\pi r (r + h)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Cone</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{3} \\pi r^{2} h$</td><td style="padding:0.5rem 0.8rem">$\\pi r \\ell$ &nbsp; ($\\ell = \\sqrt{r^{2}+h^{2}}$)</td><td style="padding:0.5rem 0.8rem">$\\pi r (r + \\ell)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Frustum (cone)</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{3} \\pi h (R^{2}+Rr+r^{2})$</td><td style="padding:0.5rem 0.8rem">$\\pi (R+r) \\ell$</td><td style="padding:0.5rem 0.8rem">$\\pi (R+r) \\ell + \\pi R^{2} + \\pi r^{2}$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Sphere</td><td style="padding:0.5rem 0.8rem">$\\tfrac{4}{3} \\pi r^{3}$</td><td style="padding:0.5rem 0.8rem">&mdash;</td><td style="padding:0.5rem 0.8rem">$4 \\pi r^{2}$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Hemisphere (closed)</td><td style="padding:0.5rem 0.8rem">$\\tfrac{2}{3} \\pi r^{3}$</td><td style="padding:0.5rem 0.8rem">$2 \\pi r^{2}$ (curved)</td><td style="padding:0.5rem 0.8rem">$3 \\pi r^{2}$</td></tr>
</tbody></table>
</div>

<h2 class="lesson-title">8. Common Mistakes &mdash; Read Before the Exam</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting the 1/3 in cone volume</div><div class="card-body">Cone volume is one-third the cylinder volume. Writing $V = \\pi r^{2} h$ for a cone is the single most common mistake in this topic. Always: $V_{\\text{cone}} = \\tfrac{1}{3} \\pi r^{2} h$.</div></div>
<div class="calc-card"><div class="card-title">Using h instead of $\\ell$ in cone surface</div><div class="card-body">Lateral area is $\\pi r \\ell$, <em>not</em> $\\pi r h$. Compute $\\ell = \\sqrt{r^{2} + h^{2}}$ first; only then plug in.</div></div>
<div class="calc-card"><div class="card-title">Forgetting both cylinder caps</div><div class="card-body">Total surface area of a closed cylinder is $2 \\pi r^{2} + 2 \\pi r h$ — <em>two</em> caps, not one. Even when the problem says "closed can" some students still forget one.</div></div>
<div class="calc-card"><div class="card-title">Mixing diameter with radius</div><div class="card-body">If the problem gives the diameter d, the radius is r = d/2. A "12 cm diameter ball" has r = 6, not r = 12. Read carefully and halve before plugging in.</div></div>
<div class="calc-card"><div class="card-title">Wrong units for volume vs surface</div><div class="card-body">Volume comes out in length cubed (cm³, m³); surface in length squared (cm², m²). Always write the units; an answer of "$90 \\pi$ cm²" for a volume is a red flag.</div></div>
<div class="calc-card"><div class="card-title">Hemisphere surface confusion</div><div class="card-body">A closed hemisphere (curved + flat) has $S = 3 \\pi r^{2}$. An open hemisphere (curved only) has $S = 2 \\pi r^{2}$. The problem statement usually tells you which.</div></div>
</div>

<h2 class="lesson-title">9. Cavalieri's Principle Preview</h2>

<div class="calc-highlight"><strong>Why does the cone have the factor 1/3? Why does the sphere have 4/3?</strong> Both follow from a single beautiful idea due to the 17th-century geometer Bonaventura Cavalieri: <em>two solids with the same height, whose horizontal cross-sections at every height have equal area, have equal volume</em>.</div>

<p class="l-text">Apply this to a cone and a pyramid with the same base area and the same height — equal cross-sections at every level, hence equal volumes. Compare a pyramid to a third of its bounding box and you read off the 1/3. The same argument shows that two cones with different shapes but matching slices have the same volume.</p>

<p class="l-text">For the sphere, place it inside the smallest cylinder that contains it (height $2r$, radius r). Subtract from the cylinder two cones with apex meeting at the centre and bases on the top and bottom caps. The remaining "ring slices" at each height match the area of the sphere's horizontal slice at the same height — both equal $\\pi (r^{2} - h^{2})$. By Cavalieri, sphere = cylinder &minus; 2&middot;cone. Compute: $V_{\\text{sphere}} = 2 \\pi r^{3} - 2 \\cdot \\tfrac{1}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi r^{3}$. Done.</p>

<div class="l-note"><strong>Looking ahead:</strong> in calculus you will replace Cavalieri's heuristic with a rigorous integral. The volume of a sphere appears as $\\int_{-r}^{r} \\pi (r^{2} - x^{2}) \\, dx$, which evaluates to exactly $\\tfrac{4}{3} \\pi r^{3}$. The high-school formulas are the answer; calculus is the proof. Same thing, two languages.</div>

<h2 class="lesson-title">10. Worked Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; CYLINDER VOLUME AND SURFACE</div><div class="example-body">A closed cylindrical can has $r = 5$ cm and $h = 12$ cm. Find V and S.<br><br>$V = \\pi r^{2} h = \\pi \\cdot 25 \\cdot 12 = \\mathbf{300 \\pi}$ cm³ $\\approx 942.5$ cm³.<br><br>$S = 2 \\pi r (r + h) = 2 \\pi \\cdot 5 \\cdot 17 = \\mathbf{170 \\pi}$ cm² $\\approx 534.1$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; CONE (3-4-5 RECAP)</div><div class="example-body">An ice-cream cone has base radius 4 cm and slant height 5 cm. Find h, V, and lateral surface.<br><br>$h = \\sqrt{\\ell^{2} - r^{2}} = \\sqrt{25 - 16} = 3$ cm.<br><br>$V = \\tfrac{1}{3} \\pi r^{2} h = \\tfrac{1}{3} \\pi \\cdot 16 \\cdot 3 = \\mathbf{16 \\pi}$ cm³.<br><br>$S_{\\text{lat}} = \\pi r \\ell = \\pi \\cdot 4 \\cdot 5 = \\mathbf{20 \\pi}$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; SPHERE BASICS</div><div class="example-body">A football has diameter 22 cm. Find its volume and surface.<br><br>$r = 22/2 = 11$ cm.<br><br>$V = \\tfrac{4}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi \\cdot 1331 \\approx \\mathbf{1774.7 \\pi}$ cm³ $\\approx 5575$ cm³ $\\approx 5.58$ litres.<br><br>$S = 4 \\pi r^{2} = 4 \\pi \\cdot 121 = \\mathbf{484 \\pi}$ cm² $\\approx 1520.5$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; HEMISPHERE BOWL FOOTPRINT</div><div class="example-body">A hemispherical bowl is to be coated outside (curved part only) with paint. Its inner radius is 10 cm and the bowl is 0.5 cm thick. What area of paint is required, in cm²?<br><br>The outer radius is $r_{\\text{out}} = 10 + 0.5 = 10.5$ cm.<br><br>Curved surface of the outer hemisphere: $S = 2 \\pi r_{\\text{out}}^{2} = 2 \\pi \\cdot 110.25 = \\mathbf{220.5 \\pi}$ cm² $\\approx 692.7$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; WATER DISPLACEMENT</div><div class="example-body">A cylindrical glass with internal radius 4 cm is half-full with water. A solid metal sphere of radius 3 cm is dropped in and fully submerged. By how many cm does the water level rise?<br><br>The sphere displaces a volume of water equal to its own: $V_{\\text{sph}} = \\tfrac{4}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi \\cdot 27 = 36 \\pi$ cm³.<br><br>That extra volume sits as a cylindrical column above the original water line, with the same base area $\\pi R^{2} = 16 \\pi$.<br><br>Rise: $\\Delta h = \\dfrac{V_{\\text{sph}}}{\\pi R^{2}} = \\dfrac{36 \\pi}{16 \\pi} = \\mathbf{2.25}$ cm.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; FRUSTUM (FLOWER POT)</div><div class="example-body">A flower pot is a frustum: bottom radius 5 cm, top radius 8 cm, height 9 cm. Find its capacity in cm³ (and millilitres).<br><br>$V = \\tfrac{1}{3} \\pi h (R^{2} + Rr + r^{2}) = \\tfrac{1}{3} \\pi \\cdot 9 \\cdot (64 + 40 + 25) = 3 \\pi \\cdot 129 = \\mathbf{387 \\pi}$ cm³ $\\approx 1216$ cm³ $\\approx 1.22$ litres.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; CONE WORD PROBLEM</div><div class="example-body">A grain hopper is a cone with base diameter 4 m and slant height 5 m. How many cubic metres of grain can it hold?<br><br>$r = 2$ m, $\\ell = 5$ m, so $h = \\sqrt{\\ell^{2} - r^{2}} = \\sqrt{25 - 4} = \\sqrt{21} \\approx 4.583$ m.<br><br>$V = \\tfrac{1}{3} \\pi r^{2} h = \\tfrac{1}{3} \\pi \\cdot 4 \\cdot \\sqrt{21} = \\dfrac{4 \\sqrt{21}}{3} \\pi \\approx \\mathbf{19.19}$ m³.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SPHERE AND CYLINDER (ARCHIMEDES)</div><div class="example-body">A sphere of radius r is inscribed in a cylinder of radius r and height $2r$. Find the ratio of the sphere's volume to the cylinder's volume, and the ratio of the sphere's surface to the cylinder's <em>lateral</em> surface.<br><br>Volume ratio: $\\dfrac{V_{\\text{sph}}}{V_{\\text{cyl}}} = \\dfrac{\\tfrac{4}{3} \\pi r^{3}}{\\pi r^{2} \\cdot 2 r} = \\dfrac{\\tfrac{4}{3}}{2} = \\mathbf{\\dfrac{2}{3}}$.<br><br>Surface ratio: $\\dfrac{S_{\\text{sph}}}{S_{\\text{cyl, lat}}} = \\dfrac{4 \\pi r^{2}}{2 \\pi r \\cdot 2 r} = \\dfrac{4 \\pi r^{2}}{4 \\pi r^{2}} = \\mathbf{1}$.<br><br>Both ratios are exactly the result Archimedes proved and asked to be engraved on his tombstone.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cylinder: $V = \\pi r^{2} h$, $S_{\\text{lat}} = 2 \\pi r h$, $S_{\\text{tot}} = 2 \\pi r (r + h)$</li>
<li>Cone: $V = \\tfrac{1}{3} \\pi r^{2} h$, slant $\\ell = \\sqrt{r^{2} + h^{2}}$, $S_{\\text{lat}} = \\pi r \\ell$, $S_{\\text{tot}} = \\pi r (r + \\ell)$</li>
<li>Frustum: $V = \\tfrac{1}{3} \\pi h (R^{2} + Rr + r^{2})$ &mdash; reduces to cone ($r = 0$) or cylinder ($R = r$)</li>
<li>Sphere: $V = \\tfrac{4}{3} \\pi r^{3}$, $S = 4 \\pi r^{2}$</li>
<li>Hemisphere (closed): $V = \\tfrac{2}{3} \\pi r^{3}$, $S = 3 \\pi r^{2}$ (curved + flat cap)</li>
<li>Slant height $\\ell$ is found from Pythagoras: $\\ell^{2} = r^{2} + h^{2}$. Never use h in place of $\\ell$.</li>
<li>Common errors: missing 1/3 for cone, missing a cap for closed cylinder, mixing diameter with radius</li>
<li>Cavalieri's principle and Archimedes' theorems supply the deep reasons behind the 1/3 and 4/3 factors</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu ders, lise müfredatının en çok önem verdiği üç "yuvarlak" katı cismi bir araya getirerek katı cisimler geometrisini tamamlıyor:</strong> dik dairesel <em>silindir</em>, dik dairesel <em>koni</em> ve <em>küre</em>. Her birinin temiz bir hacim formülü ve temiz bir yüzey alanı formülü vardır; ve bu formüllerin her biri, bir resimden yeniden kurabilmen gereken kısa bir geometrik tartışmayı gizler. Formülleri ezberle, ama biraz fazladan dakika ayır ve <em>neden</em> koninin üçte bir çarpanına sahip olduğunu ve neden kürenin yüzey alanının onun büyük çember alanının tam dört katı olduğunu anlamaya çalış.</p>

<p class="l-text">Kutular, dondurma külahları, su depoları, gezegenler, balonlar, yakıt tankları, ampuller, spor topları, silolar ve Ayasofya'nın kubbesi — fiziksel dünyadaki neredeyse her "yuvarlak" nesne bu üç şekilden biridir ya da onların bir kombinasyonudur. Sınav soruları kutular, koniler ve toplar hakkında olacak ama aynı fikirler sınıf dışındaki dünyayı da tanımlar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yarıçapı r ve yüksekliği h olan dik dairesel silindirin hacmini ve yüzey alanını hesaplamayı</li>
<li>Yan yüksekliği $\\ell = \\sqrt{r^{2}+h^{2}}$ olan dik dairesel koninin hacim, yan ve toplam yüzey alanını bulmayı</li>
<li>r ve h'den koninin yan yüksekliğini bulmak için Pisagor teoremini uygulamayı</li>
<li>Küre ve yarımküre (açık veya kapalı) için hacim ve yüzey alanı hesaplamayı</li>
<li>Kesik koninin (frustum) iki yarıçapı ve yüksekliği yardımıyla hacmini bulmayı</li>
<li>Yaygın hataları fark etmeyi: koni hacminde 1/3'ün unutulması, kapalı silindirde iki disk başlığın unutulması</li>
<li>Bu formülleri kutular, depolar, dondurma külahları ve su yer değiştirmesi gibi sözel problemlere uygulamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Dik Dairesel Silindir</h2>

<div class="calc-highlight"><strong>Silindir, "uzatılmış bir çemberdir".</strong> r yarıçaplı düz bir dairesel diskle başla. Onu dikey olarak h kadar yukarı kaldır ve diskin süpürdüğü hacmi takip et. İşte dik dairesel silindir: r yarıçaplı iki paralel dairesel başlık ve onları birleştiren h yüksekliğinde eğri bir yan duvar.</div>

<p class="l-text">Bir çorba kutusu, bir su deposu, bir bardak, bir boya kutusu, bir tuvalet kağıdı rulosu — hepsi dik dairesel silindirdir. "Dik" kelimesi yan duvarın başlıklara dik olduğu (eğilmediği) anlamına gelir. "Dairesel" kelimesi kesitin elips veya çokgen değil daire olduğu anlamına gelir. Bu derste aksi belirtilmedikçe "silindir" her zaman "dik dairesel silindir" demektir.</p>

<div class="calc-formula"><div class="formula-label">SİLİNDİR &mdash; HACİM</div><div class="formula-main">$$V \\;=\\; \\pi r^{2} h$$</div><div class="formula-sub">Bir dairesel başlığın alanı çarpı yükseklik. Silindir, dairesel taban alanlı bir prizma olduğundan hacim formülü (taban alanı) &times; (yükseklik) — dikdörtgen prizmadakiyle tam olarak aynı kural.</div></div>

<p class="l-text">İki düz başlığın her birinin alanı $\\pi r^{2}$'dir. Eğri yan duvar daha zorludur ama tek satırlık bir hile vardır: silindirin kağıttan yapıldığını düşün. Yan duvarı tek bir dikey çizgi boyunca yırt ve düz aç. Elinde bir dikdörtgen kalır. Yüksekliği silindirin h yüksekliğidir. Genişliği ise başlığın çevresi, $2 \\pi r$'dir. Yani yan alan basitçe dikdörtgenin alanıdır:</p>

<div class="calc-formula"><div class="formula-label">SİLİNDİR &mdash; YAN YÜZEY ALANI</div><div class="formula-main">$$S_{\\text{yan}} \\;=\\; 2 \\pi r \\, h$$</div><div class="formula-sub">Başlığın çevresi çarpı yükseklik. "Yan" yalnızca eğri tarafı kastediyor; iki düz başlık dahil değil.</div></div>

<div class="calc-formula"><div class="formula-label">SİLİNDİR &mdash; TOPLAM YÜZEY ALANI</div><div class="formula-main">$$S_{\\text{toplam}} \\;=\\; 2 \\pi r^{2} + 2 \\pi r h \\;=\\; 2 \\pi r \\, (r + h)$$</div><div class="formula-sub">İki başlık artı yan duvar. $2 \\pi r$ ortak çarpan olarak alınınca akılda kalıcı tek bir çarpım çıkar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Üstü açık kutu</div><div class="card-body">Kapaksız kutu (bardak, beher): bir başlık eksik. $S = \\pi r^{2} + 2 \\pi r h$.</div></div>
<div class="calc-card"><div class="card-title">Boru (başlıksız)</div><div class="card-body">Bir boru parçası sadece eğri duvardır, başlığı yoktur: $S = 2 \\pi r h$.</div></div>
<div class="calc-card"><div class="card-title">Kapalı kutu</div><div class="card-body">Her iki başlık da var (konserve domates kutusu): $S = 2 \\pi r^{2} + 2 \\pi r h$. Varsayılan budur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir teneke kutunun yarıçapı $r = 3$ cm ve yüksekliği $h = 10$ cm. Hacmini ve toplam yüzey alanını bul (kapalı kutu).<br><br>$V = \\pi r^{2} h = \\pi \\cdot 9 \\cdot 10 = \\mathbf{90 \\pi}$ cm³ $\\approx 282.7$ cm³.<br><br>$S = 2 \\pi r (r + h) = 2 \\pi \\cdot 3 \\cdot 13 = \\mathbf{78 \\pi}$ cm² $\\approx 245.0$ cm².</div></div>

<div class="calc-graph"><div id="plot-l90-cyl-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> r yarıçaplı ve h yükseklikli bir dik dairesel silindir. Üst ve alttaki iki paralel disk başlıklardır (her biri $\\pi r^{2}$ alanlı). Eğri mavi yüzey yan duvardır — onu yırtıp düz açarsan $2 \\pi r$ genişliğinde ve h yüksekliğinde bir dikdörtgen olur. Oklar hacim ve yüzey alanını hesaplamak için ihtiyaç duyduğun iki parametreyi etiketler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=1.2,h=2.5;
var th=[];var xc=[];var yt=[];var yb=[];var zc=[];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;th.push(a);xc.push(r*Math.cos(a));yt.push(r*Math.sin(a));zc.push(0);}
var side={type:'surface',x:[],y:[],z:[],colorscale:[[0,'#1e3a8a'],[1,'#3b82f6']],showscale:false,opacity:0.85,name:'yan duvar'};
var xs=[];var ys=[];var zs=[];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;xs.push([r*Math.cos(a),r*Math.cos(a)]);ys.push([r*Math.sin(a),r*Math.sin(a)]);zs.push([0,h]);}
side.x=xs;side.y=ys;side.z=zs;
var capTop={x:[],y:[],z:[],type:'mesh3d',color:'#60a5fa',opacity:0.7,showscale:false,name:'üst başlık'};
var capBot={x:[],y:[],z:[],type:'mesh3d',color:'#60a5fa',opacity:0.7,showscale:false,name:'alt başlık'};
var cx=[0],cy=[0],cz=[h];var cxb=[0],cyb=[0],czb=[0];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;cx.push(r*Math.cos(a));cy.push(r*Math.sin(a));cz.push(h);cxb.push(r*Math.cos(a));cyb.push(r*Math.sin(a));czb.push(0);}
capTop.x=cx;capTop.y=cy;capTop.z=cz;
capBot.x=cxb;capBot.y=cyb;capBot.z=czb;
var rayR={x:[0,r],y:[0,0],z:[0,0],mode:'lines+text',type:'scatter3d',line:{color:'#f59e0b',width:5},text:['','r'],textposition:'top center',textfont:{color:'#f59e0b',size:14},showlegend:false};
var rayH={x:[r,r],y:[0,0],z:[0,h],mode:'lines+text',type:'scatter3d',line:{color:'#10b981',width:5},text:['','h'],textposition:'middle right',textfont:{color:'#10b981',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},aspectmode:'data',camera:{eye:{x:1.7,y:1.7,z:1.0}}},margin:{t:20,r:10,b:10,l:10},showlegend:false};
Plotly.newPlot('plot-l90-cyl-tr',[side,capTop,capBot,rayR,rayH],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir silindirin yarıçapı iki katına çıkarılır ama yüksekliği aynı kalır. Hacim kaç katına çıkar? (Cevap: $V = \\pi r^{2} h$ r'de ikinci derecedir, yani r'yi iki katına çıkarmak V'yi $2^{2} = 4$ ile çarpar.) Ya yükseklik de iki katına çıksaydı? (O zaman V $4 \\times 2 = 8$ ile çarpılır.)</div></div>

<h2 class="lesson-title">2. Dik Dairesel Koni</h2>

<div class="calc-highlight"><strong>Koni, "uçlu bir silindirdir".</strong> Aynı r yarıçaplı dairesel diski al. Bu sefer onu düz yukarı kaldırmak yerine, sadece merkezini h yüksekliğine kaldır ve aynı zamanda kenarını o tek yükseltilmiş noktaya doğru çek. Süpürdüğün şey bir dik dairesel konidir: r yarıçaplı bir düz dairesel taban, tabanın merkezinin tam üstünde h yüksekliğinde bir tepe noktası ve ikisini bağlayan eğik eğri bir duvar.</div>

<p class="l-text">Bir dondurma külahı, bir parti şapkası, bir kurşunkalemin ucu, trafik konisi, kağıt su bardağı, mutfak hunisi — hepsi dik dairesel konidir (ya da onların parçası). Yine "dik" tepe noktasının tabanın merkezi tam üstünde olduğu, yana kaymadığı anlamına gelir. Tepe noktasından tabana dik olan doğru parçası koninin <strong>eksenidir</strong> ve uzunluğu <strong>yüksekliktir</strong> (h).</p>

<div class="calc-formula"><div class="formula-label">KONİ &mdash; HACİM</div><div class="formula-main">$$V \\;=\\; \\frac{1}{3} \\, \\pi r^{2} h$$</div><div class="formula-sub">Aynı yarıçap ve yükseklikteki silindirin hacminin tam üçte biri. 1/3 çarpanı keyfî değil — Cavalieri ilkesi ve kalkülüs ikisi de bunu onaylar. Argümanı 9. bölümde önizleyeceğiz.</div></div>

<p class="l-text"><strong>Yan yükseklik.</strong> Yüzey formüllerini yazmadan önce bir uzunluğa daha ihtiyacımız var: tepe noktasından eğri duvar boyunca tabanın kenarındaki bir noktaya olan uzaklık. Buna <strong>yan yükseklik</strong> denir ve $\\ell$ (italik l) ile gösterilir. Önemli bir nokta: $\\ell$, h yüksekliği <em>değildir</em>. Yükseklik tam ortadan dikine yukarı çıkar; yan ise dış yüzey boyunca uzanır.</p>

<div class="calc-formula"><div class="formula-label">KONİ &mdash; YAN YÜKSEKLİK (PİSAGOR)</div><div class="formula-main">$$\\ell \\;=\\; \\sqrt{r^{2} + h^{2}}$$</div><div class="formula-sub">Tepe noktası, tabanın merkezi ve kenardaki bir nokta, dik kenarları r ve h, hipotenüsü $\\ell$ olan bir dik üçgen oluşturur. Bu dik üçgene Pisagor'u uygula ve yan yüksekliği oku.</div></div>

<div class="calc-formula"><div class="formula-label">KONİ &mdash; YAN YÜZEY ALANI</div><div class="formula-main">$$S_{\\text{yan}} \\;=\\; \\pi r \\ell$$</div><div class="formula-sub">Eğri duvarı bir yan çizgi boyunca yırt ve düz aç. Sonuç, yarıçapı $\\ell$ ve yay uzunluğu $2 \\pi r$ (orijinal kenar) olan bir dairesel daire dilimidir. Bu dilimin alanı $\\pi r \\ell$'dir.</div></div>

<div class="calc-formula"><div class="formula-label">KONİ &mdash; TOPLAM YÜZEY ALANI</div><div class="formula-main">$$S_{\\text{toplam}} \\;=\\; \\pi r^{2} + \\pi r \\ell \\;=\\; \\pi r \\, (r + \\ell)$$</div><div class="formula-sub">Bir düz taban diski artı yan duvar. Açık bir dondurma külahı için $\\pi r^{2}$ kısmı yok olur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir koninin taban yarıçapı $r = 4$ cm ve yüksekliği $h = 3$ cm. Yan yüksekliği, hacmi ve toplam yüzey alanını bul.<br><br><strong>Yan yükseklik:</strong> $\\ell = \\sqrt{r^{2} + h^{2}} = \\sqrt{16 + 9} = \\sqrt{25} = 5$ cm.<br><br><strong>Hacim:</strong> $V = \\tfrac{1}{3} \\pi r^{2} h = \\tfrac{1}{3} \\pi \\cdot 16 \\cdot 3 = \\mathbf{16 \\pi}$ cm³.<br><br><strong>Toplam yüzey alanı:</strong> $S = \\pi r (r + \\ell) = \\pi \\cdot 4 \\cdot (4 + 5) = \\mathbf{36 \\pi}$ cm².<br><br>Detaylı dökümü: taban $\\pi r^{2} = 16 \\pi$ artı yan $\\pi r \\ell = 20 \\pi$, toplam $36 \\pi$. (3, 4, 5) dik üçgeni bunu klasik ders kitabı örneği yapar — bir sağlama yöntemi olarak aklında tut.</div></div>

<div class="calc-graph"><div id="plot-l90-cone-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> tabanda r yarıçaplı ve h yüksekliğinde tepe noktası olan bir dik dairesel koni. Üç etiketli doğru parçası: r, tabanın merkezinden kenara uzanır (turuncu); h, merkezden tepe noktasına eksen boyunca dikine çıkar (yeşil); $\\ell$ ise kenardan tepe noktasına eğik yan yüzey boyunca uzanır (kırmızı). Üçü dikey düzlemde bir dik üçgen oluşturur: $\\ell^{2} = r^{2} + h^{2}$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=1.4,h=2.6;
var ell=Math.sqrt(r*r+h*h);
var side={type:'surface',x:[],y:[],z:[],colorscale:[[0,'#1e3a8a'],[1,'#3b82f6']],showscale:false,opacity:0.85};
var xs=[];var ys=[];var zs=[];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;xs.push([r*Math.cos(a),0]);ys.push([r*Math.sin(a),0]);zs.push([0,h]);}
side.x=xs;side.y=ys;side.z=zs;
var base={x:[0],y:[0],z:[0],type:'mesh3d',color:'#60a5fa',opacity:0.6,showscale:false};
var bx=[0],by=[0],bz=[0];
for(var i=0;i<=60;i++){var a=2*Math.PI*i/60;bx.push(r*Math.cos(a));by.push(r*Math.sin(a));bz.push(0);}
base.x=bx;base.y=by;base.z=bz;
var rayR={x:[0,r],y:[0,0],z:[0,0],mode:'lines+text',type:'scatter3d',line:{color:'#f59e0b',width:5},text:['','r'],textposition:'top center',textfont:{color:'#f59e0b',size:14},showlegend:false};
var rayH={x:[0,0],y:[0,0],z:[0,h],mode:'lines+text',type:'scatter3d',line:{color:'#10b981',width:5},text:['','h'],textposition:'middle right',textfont:{color:'#10b981',size:14},showlegend:false};
var rayL={x:[r,0],y:[0,0],z:[0,h],mode:'lines+text',type:'scatter3d',line:{color:'#ef4444',width:5},text:['','ℓ'],textposition:'middle right',textfont:{color:'#ef4444',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},aspectmode:'data',camera:{eye:{x:1.7,y:1.7,z:1.0}}},margin:{t:20,r:10,b:10,l:10},showlegend:false};
Plotly.newPlot('plot-l90-cone-tr',[side,base,rayR,rayH,rayL],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yaygın hata:</strong> öğrenciler yan yüzey formülü $\\pi r \\ell$'de yan yükseklik $\\ell$ yerine yükseklik h'yi yerleştirir. Önce $\\sqrt{r^{2} + h^{2}}$ ile $\\ell$'yi hesapla, sonra yüzey formülüne koy. İkisi yalnızca $r = 0$ olan dejenere "koni" durumunda (ki o da sadece bir dikey doğrudur) eşittir.</div>

<h2 class="lesson-title">3. Kesik Koni (Frustum)</h2>

<div class="calc-highlight"><strong>Bir kesik koni, tabanına paralel bir düzlemle bir koninin ucunu kestiğinde ortaya çıkan şeydir.</strong> Kova, çiçek saksısı, abajur, kağıt kahve bardağı — hepsi kesik konidir. Farklı yarıçaplara sahip iki paralel dairesel başlık (büyüğüne R, küçüğüne r diyelim), aralarında h yüksekliği.</div>

<div class="calc-formula"><div class="formula-label">KESİK KONİ &mdash; HACİM</div><div class="formula-main">$$V \\;=\\; \\frac{1}{3} \\, \\pi h \\, (R^{2} + R r + r^{2})$$</div><div class="formula-sub">R ve r'ye göre simetrik. $r = 0$ koy, koni formülü $\\tfrac{1}{3} \\pi R^{2} h$'ye geri dönersin; $R = r$ koy, silindir formülü $\\pi r^{2} h$'ye geri dönersin. Tek formülde iki sağlama.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir çiçek saksısı kesik konidir; alt yarıçapı $r = 6$ cm, üst yarıçapı $R = 10$ cm ve yüksekliği $h = 12$ cm. Hacmini bul.<br><br>$V = \\tfrac{1}{3} \\pi \\cdot 12 \\cdot (100 + 60 + 36) = 4 \\pi \\cdot 196 = \\mathbf{784 \\pi}$ cm³ $\\approx 2463$ cm³ $\\approx 2.46$ litre.<br><br>Bu, sağlıklı boyutta bir fesleğen bitkisi için yeterli hacim.</div></div>

<h2 class="lesson-title">4. Küre</h2>

<div class="calc-highlight"><strong>Küre, 3B uzayda bir merkez noktadan sabit r uzaklıktaki tüm noktaların kümesidir.</strong> Çemberin üçüncü boyuttaki karşılığı. Futbol topları, basketbol topları, Dünya, portakallar, bilye yatakları — hepsi küre (ya da yakın bir yaklaşıklık).</div>

<p class="l-text">Silindir ve koninin aksine kürenin hiç düz parçası yoktur. Tüm yüzey eğridir. Tüm iç eşittir. Yalnız bir parametre — yarıçap r — onun hakkındaki her şeyi belirler.</p>

<div class="calc-formula"><div class="formula-label">KÜRE &mdash; HACİM</div><div class="formula-main">$$V \\;=\\; \\frac{4}{3} \\, \\pi r^{3}$$</div><div class="formula-sub">r'de kübik. Yarıçapı iki katına çıkarmak hacmi 8 katına çıkarır.</div></div>

<div class="calc-formula"><div class="formula-label">KÜRE &mdash; YÜZEY ALANI</div><div class="formula-main">$$S \\;=\\; 4 \\, \\pi r^{2}$$</div><div class="formula-sub">Büyük çemberin (en geniş kesit) $\\pi r^{2}$ alanının tam dört katı. Arşimet bunu 2200 yıldan fazla önce olağanüstü bir geometrik argümanla kanıtladı.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden "4/3"?</div><div class="card-body">Arşimet teoremi: bir kürenin hacmi, onu içine alan en küçük silindirin hacminin tam olarak üçte ikisidir. Silindir hacmi = $\\pi r^{2} \\cdot 2 r = 2 \\pi r^{3}$. Bunun üçte ikisi $\\tfrac{4}{3} \\pi r^{3}$.</div></div>
<div class="calc-card"><div class="card-title">Neden "4"?</div><div class="card-body">Arşimet ayrıca bir kürenin yüzey alanının aynı kuşatan silindirin yan alanına eşit olduğunu gösterdi. Yan alan = $2 \\pi r \\cdot 2r = 4 \\pi r^{2}$. Ölümünde mezar taşına hangi sonucu istediğini sorduklarında bunu seçti.</div></div>
<div class="calc-card"><div class="card-title">Dünya sağlaması</div><div class="card-body">Dünya'nın yarıçapı yaklaşık 6371 km. Yüzey alanı $4 \\pi r^{2} \\approx 5.1 \\times 10^{8}$ km² — bunun dörtte üçü okyanus. Yerine koy ve doğrula.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir kürenin yarıçapı $r = 6$ cm. Hacmini ve yüzey alanını bul.<br><br>$V = \\tfrac{4}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi \\cdot 216 = \\mathbf{288 \\pi}$ cm³ $\\approx 904.8$ cm³.<br><br>$S = 4 \\pi r^{2} = 4 \\pi \\cdot 36 = \\mathbf{144 \\pi}$ cm² $\\approx 452.4$ cm².</div></div>

<div class="calc-graph"><div id="plot-l90-sphere-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> r yarıçaplı bir küre ve onun <em>büyük çemberi</em> (merkezden geçen en geniş kesit, kesik sarı halka). Merkezden kenara giden turuncu doğru parçası r'yi işaretler. Merkezden geçen her düzlem küreyi r yarıçaplı bir büyük çemberde keser; başka her düzlem onu daha küçük bir çemberde keser.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=1.5;
var u=[];var v=[];
for(var i=0;i<=30;i++)u.push(Math.PI*i/30);
for(var j=0;j<=60;j++)v.push(2*Math.PI*j/60);
var xs=[];var ys=[];var zs=[];
for(var i=0;i<u.length;i++){var rowx=[];var rowy=[];var rowz=[];for(var j=0;j<v.length;j++){rowx.push(r*Math.sin(u[i])*Math.cos(v[j]));rowy.push(r*Math.sin(u[i])*Math.sin(v[j]));rowz.push(r*Math.cos(u[i]));}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var sph={type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'#1e3a8a'],[1,'#3b82f6']],showscale:false,opacity:0.65};
var cx=[];var cy=[];var cz=[];for(var k=0;k<=60;k++){var a=2*Math.PI*k/60;cx.push(r*Math.cos(a));cy.push(r*Math.sin(a));cz.push(0);}
var great={x:cx,y:cy,z:cz,type:'scatter3d',mode:'lines',line:{color:'#facc15',width:5,dash:'dash'},name:'büyük çember',showlegend:false};
var rayR={x:[0,r],y:[0,0],z:[0,0],mode:'lines+text',type:'scatter3d',line:{color:'#f59e0b',width:5},text:['','r'],textposition:'top center',textfont:{color:'#f59e0b',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},yaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},zaxis:{title:'',gridcolor:'rgba(255,255,255,0.08)',zerolinecolor:'rgba(255,255,255,0.2)',backgroundcolor:'#0a0a0a',showbackground:true},aspectmode:'data',camera:{eye:{x:1.6,y:1.6,z:1.0}}},margin:{t:20,r:10,b:10,l:10},showlegend:false};
Plotly.newPlot('plot-l90-sphere-tr',[sph,great,rayR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Yarımküre</h2>

<div class="calc-highlight"><strong>Bir küreyi merkezden geçen bir düzlemle ikiye böl.</strong> Her parça bir <em>yarımküredir</em>. Bir yarımkürenin eğri bir küresel parçası ve tek bir düz dairesel başlığı (kesimin açığa çıkardığı büyük çember) vardır. Örnekler: bir kubbe, bir yarım portakal, bir salata kasesi, bir gezegen evi çatısı.</div>

<div class="calc-formula"><div class="formula-label">YARIMKÜRE &mdash; HACİM</div><div class="formula-main">$$V \\;=\\; \\frac{2}{3} \\, \\pi r^{3}$$</div><div class="formula-sub">Tam kürenin $\\tfrac{4}{3} \\pi r^{3}$ hacminin tam yarısı.</div></div>

<div class="calc-formula"><div class="formula-label">YARIMKÜRE &mdash; YÜZEY ALANI (KAPALI, DÜZ BAŞLIKLI)</div><div class="formula-main">$$S \\;=\\; 2 \\pi r^{2} + \\pi r^{2} \\;=\\; 3 \\pi r^{2}$$</div><div class="formula-sub">Kürenin eğri yüzeyinin yarısı ($\\tfrac{1}{2} \\cdot 4 \\pi r^{2} = 2 \\pi r^{2}$) artı kesimi kapatan disk ($\\pi r^{2}$). Açık bir yarımküre (düz başlıksız, örneğin dışarıdan görülen ters çevrilmiş bir salata kasesi) için yalnızca $2 \\pi r^{2}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; YARIMKÜRE KASE</div><div class="example-body">Bir yarımküre salata kasesinin iç yarıçapı $r = 12$ cm. Ne kadar salata alır (litre cinsinden)?<br><br>$V = \\tfrac{2}{3} \\pi r^{3} = \\tfrac{2}{3} \\pi \\cdot 1728 = \\mathbf{1152 \\pi}$ cm³ $\\approx 3619$ cm³ $\\approx 3.62$ litre.<br><br>Dört kişilik bir aile için fazlasıyla yeter. Aynı kasenin suyla dolu hali yaklaşık 3.6 kg ağırlığındadır.</div></div>

<h2 class="lesson-title">6. Küresel Kalot ve Küresel Sektör (Hızlı Önizleme)</h2>

<p class="l-text">Bir <strong>küresel kalot</strong>, bir küreyi merkezinden <em>geçmeyen</em> bir düzlemle kestiğinde elde ettiğin şeydir — kesimin üstünde (veya altında) h yüksekliğinde tek bir yuvarlak "kapak". Bir <strong>küresel sektör</strong>, küresel kalot artı tabanını kürenin merkezine bağlayan koniden oluşan dondurma külahı şeklindeki katı cisimdir. Bunlar fizikte (kubbe kesitleri, uydu izi) ve mühendislikte (mercek tasarımı) karşımıza çıkar ama lise müfredatı formüllerini nadiren ister. Referans için:</p>

<div class="calc-formula"><div class="formula-label">KÜRESEL KALOT &mdash; HACİM VE YÜZEY</div><div class="formula-main">$$V_{\\text{kalot}} \\;=\\; \\frac{\\pi h^{2}}{3} \\, (3r - h), \\qquad S_{\\text{eğri}} \\;=\\; 2 \\pi r h$$</div><div class="formula-sub">r kürenin yarıçapı, h kalotun yüksekliği (kesim düzleminden kalotun tepesine olan dik uzaklık). Eğri alan formülü $2 \\pi r h$, eşdeğer dilim için bir silindirin yan alanıyla aynıdır — derin bir sonuç.</div></div>

<div class="l-note"><strong>İsteğe bağlı bir not.</strong> Şaşırtıcı $S_{\\text{kalot}} = 2 \\pi r h$ özdeşliği şunu söyler: kürenin yatay bir diliminin alanı yalnızca dilimin yüksekliğine bağlıdır, dilimin nereye oturduğuna değil. Bu yüzden eşit yükseklikli portakal dilimleri ekvator ile kutup yakınında çok farklı görünseler de eşit kabuk alanına sahiptirler. Bu, Arşimet'in "şapka kutusu" teoreminin özel bir durumudur.</div>

<h2 class="lesson-title">7. Hacim ve Yüzey Formüllerinin Özet Tablosu</h2>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Cisim</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Hacim V</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Yan yüzey</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Toplam yüzey</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Silindir</td><td style="padding:0.5rem 0.8rem">$\\pi r^{2} h$</td><td style="padding:0.5rem 0.8rem">$2 \\pi r h$</td><td style="padding:0.5rem 0.8rem">$2 \\pi r (r + h)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Koni</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{3} \\pi r^{2} h$</td><td style="padding:0.5rem 0.8rem">$\\pi r \\ell$ &nbsp; ($\\ell = \\sqrt{r^{2}+h^{2}}$)</td><td style="padding:0.5rem 0.8rem">$\\pi r (r + \\ell)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Kesik koni</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{3} \\pi h (R^{2}+Rr+r^{2})$</td><td style="padding:0.5rem 0.8rem">$\\pi (R+r) \\ell$</td><td style="padding:0.5rem 0.8rem">$\\pi (R+r) \\ell + \\pi R^{2} + \\pi r^{2}$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Küre</td><td style="padding:0.5rem 0.8rem">$\\tfrac{4}{3} \\pi r^{3}$</td><td style="padding:0.5rem 0.8rem">&mdash;</td><td style="padding:0.5rem 0.8rem">$4 \\pi r^{2}$</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Yarımküre (kapalı)</td><td style="padding:0.5rem 0.8rem">$\\tfrac{2}{3} \\pi r^{3}$</td><td style="padding:0.5rem 0.8rem">$2 \\pi r^{2}$ (eğri)</td><td style="padding:0.5rem 0.8rem">$3 \\pi r^{2}$</td></tr>
</tbody></table>
</div>

<h2 class="lesson-title">8. Yaygın Hatalar &mdash; Sınavdan Önce Oku</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Koni hacminde 1/3'ü unutmak</div><div class="card-body">Koni hacmi silindir hacminin üçte biridir. Koni için $V = \\pi r^{2} h$ yazmak bu konudaki tek en yaygın hatadır. Her zaman: $V_{\\text{koni}} = \\tfrac{1}{3} \\pi r^{2} h$.</div></div>
<div class="calc-card"><div class="card-title">Koni yüzeyinde $\\ell$ yerine h kullanmak</div><div class="card-body">Yan alan $\\pi r \\ell$'dir, $\\pi r h$ <em>değil</em>. Önce $\\ell = \\sqrt{r^{2} + h^{2}}$'yi hesapla; ancak ondan sonra yerine koy.</div></div>
<div class="calc-card"><div class="card-title">Silindirin iki başlığını unutmak</div><div class="card-body">Kapalı bir silindirin toplam yüzey alanı $2 \\pi r^{2} + 2 \\pi r h$'dir — bir değil <em>iki</em> başlık. Problem "kapalı kutu" dese bile bazı öğrenciler birini unutuyor.</div></div>
<div class="calc-card"><div class="card-title">Çapı yarıçapla karıştırmak</div><div class="card-body">Problem d çapını veriyorsa, yarıçap r = d/2. "12 cm çaplı bir top" r = 6'dır, r = 12 değil. Dikkatlice oku ve yerine koymadan önce yarıya böl.</div></div>
<div class="calc-card"><div class="card-title">Hacim ile yüzeyin yanlış birimleri</div><div class="card-body">Hacim küp birimde çıkar (cm³, m³); yüzey ise kare birimde (cm², m²). Birimleri her zaman yaz; hacim için "$90 \\pi$ cm²" cevabı uyarı işaretidir.</div></div>
<div class="calc-card"><div class="card-title">Yarımküre yüzey karışıklığı</div><div class="card-body">Kapalı bir yarımkürenin (eğri + düz) yüzeyi $S = 3 \\pi r^{2}$'dir. Açık bir yarımkürenin (yalnız eğri) yüzeyi $S = 2 \\pi r^{2}$'dir. Problem ifadesi genellikle hangisi olduğunu söyler.</div></div>
</div>

<h2 class="lesson-title">9. Cavalieri İlkesi Önizleme</h2>

<div class="calc-highlight"><strong>Koni neden 1/3 çarpanına sahip? Küre neden 4/3?</strong> İkisi de 17. yüzyıl geometricisi Bonaventura Cavalieri'ye atfedilen tek güzel bir fikirden çıkar: <em>aynı yüksekliğe sahip ve her yükseklikteki yatay kesitlerinin alanları eşit olan iki cismin hacimleri eşittir</em>.</div>

<p class="l-text">Bunu aynı taban alanı ve aynı yüksekliğe sahip bir koni ile bir piramide uygula — her seviyede eşit kesitler, dolayısıyla eşit hacimler. Bir piramidi onu kuşatan kutunun üçte biriyle karşılaştır ve 1/3'ü oku. Aynı tartışma, farklı şekillerde ama eşleşen dilimlere sahip iki koninin aynı hacme sahip olduğunu da gösterir.</p>

<p class="l-text">Küre için, küreyi onu içine alan en küçük silindirin (yüksekliği $2r$, yarıçapı r) içine yerleştir. Silindirden, tepe noktaları merkezde buluşan ve tabanları üst ve alt başlıklarda olan iki koniyi çıkar. Her yükseklikteki kalan "halka dilimleri", kürenin aynı yükseklikteki yatay diliminin alanına eşittir — her ikisi de $\\pi (r^{2} - h^{2})$'ye eşittir. Cavalieri uyarınca küre = silindir &minus; 2&middot;koni. Hesapla: $V_{\\text{küre}} = 2 \\pi r^{3} - 2 \\cdot \\tfrac{1}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi r^{3}$. Tamamdır.</p>

<div class="l-note"><strong>İleriye bakış:</strong> kalkülüste Cavalieri'nin sezgisel argümanını sıkı bir integralle değiştireceksin. Kürenin hacmi $\\int_{-r}^{r} \\pi (r^{2} - x^{2}) \\, dx$ olarak ortaya çıkar ve tam olarak $\\tfrac{4}{3} \\pi r^{3}$'e eşittir. Lise formülleri cevaptır; kalkülüs kanıttır. Aynı şey, iki farklı dil.</div>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SİLİNDİR HACİM VE YÜZEY</div><div class="example-body">Kapalı bir silindirik kutunun $r = 5$ cm ve $h = 12$ cm'dir. V ve S'yi bul.<br><br>$V = \\pi r^{2} h = \\pi \\cdot 25 \\cdot 12 = \\mathbf{300 \\pi}$ cm³ $\\approx 942.5$ cm³.<br><br>$S = 2 \\pi r (r + h) = 2 \\pi \\cdot 5 \\cdot 17 = \\mathbf{170 \\pi}$ cm² $\\approx 534.1$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; KONİ (3-4-5 TEKRARI)</div><div class="example-body">Bir dondurma külahının taban yarıçapı 4 cm ve yan yüksekliği 5 cm. h, V ve yan yüzeyi bul.<br><br>$h = \\sqrt{\\ell^{2} - r^{2}} = \\sqrt{25 - 16} = 3$ cm.<br><br>$V = \\tfrac{1}{3} \\pi r^{2} h = \\tfrac{1}{3} \\pi \\cdot 16 \\cdot 3 = \\mathbf{16 \\pi}$ cm³.<br><br>$S_{\\text{yan}} = \\pi r \\ell = \\pi \\cdot 4 \\cdot 5 = \\mathbf{20 \\pi}$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; KÜRE TEMELLERİ</div><div class="example-body">Bir futbol topunun çapı 22 cm. Hacmini ve yüzeyini bul.<br><br>$r = 22/2 = 11$ cm.<br><br>$V = \\tfrac{4}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi \\cdot 1331 \\approx \\mathbf{1774.7 \\pi}$ cm³ $\\approx 5575$ cm³ $\\approx 5.58$ litre.<br><br>$S = 4 \\pi r^{2} = 4 \\pi \\cdot 121 = \\mathbf{484 \\pi}$ cm² $\\approx 1520.5$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; YARIMKÜRE KASE KAPLAMASI</div><div class="example-body">Bir yarımküre kase dış kısmından (yalnız eğri kısmı) boya ile kaplanacak. İç yarıçapı 10 cm ve kase 0.5 cm kalınlığında. Kaç cm² boyaya ihtiyaç var?<br><br>Dış yarıçap $r_{\\text{dış}} = 10 + 0.5 = 10.5$ cm.<br><br>Dış yarımkürenin eğri yüzeyi: $S = 2 \\pi r_{\\text{dış}}^{2} = 2 \\pi \\cdot 110.25 = \\mathbf{220.5 \\pi}$ cm² $\\approx 692.7$ cm².</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; SU YER DEĞİŞTİRMESİ</div><div class="example-body">İç yarıçapı 4 cm olan silindirik bir bardak su ile yarıya kadar dolu. Yarıçapı 3 cm olan katı bir metal küre içeri bırakılıyor ve tamamen batıyor. Su seviyesi kaç cm yükselir?<br><br>Küre, kendi hacmine eşit su yer değiştirir: $V_{\\text{küre}} = \\tfrac{4}{3} \\pi r^{3} = \\tfrac{4}{3} \\pi \\cdot 27 = 36 \\pi$ cm³.<br><br>Bu ek hacim, orijinal su çizgisinin üstünde aynı $\\pi R^{2} = 16 \\pi$ taban alanlı silindirik bir sütun olarak oturur.<br><br>Yükselme: $\\Delta h = \\dfrac{V_{\\text{küre}}}{\\pi R^{2}} = \\dfrac{36 \\pi}{16 \\pi} = \\mathbf{2.25}$ cm.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; KESİK KONİ (ÇİÇEK SAKSISI)</div><div class="example-body">Bir çiçek saksısı kesik konidir: alt yarıçap 5 cm, üst yarıçap 8 cm, yükseklik 9 cm. cm³ (ve mililitre) cinsinden kapasitesini bul.<br><br>$V = \\tfrac{1}{3} \\pi h (R^{2} + Rr + r^{2}) = \\tfrac{1}{3} \\pi \\cdot 9 \\cdot (64 + 40 + 25) = 3 \\pi \\cdot 129 = \\mathbf{387 \\pi}$ cm³ $\\approx 1216$ cm³ $\\approx 1.22$ litre.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; KONİ SÖZEL PROBLEM</div><div class="example-body">Bir tahıl hunisi koni şeklindedir; taban çapı 4 m ve yan yüksekliği 5 m. Kaç metreküp tahıl alır?<br><br>$r = 2$ m, $\\ell = 5$ m, yani $h = \\sqrt{\\ell^{2} - r^{2}} = \\sqrt{25 - 4} = \\sqrt{21} \\approx 4.583$ m.<br><br>$V = \\tfrac{1}{3} \\pi r^{2} h = \\tfrac{1}{3} \\pi \\cdot 4 \\cdot \\sqrt{21} = \\dfrac{4 \\sqrt{21}}{3} \\pi \\approx \\mathbf{19.19}$ m³.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; KÜRE VE SİLİNDİR (ARŞİMET)</div><div class="example-body">Yarıçapı r olan bir küre, yarıçapı r ve yüksekliği $2r$ olan bir silindirin içine yerleştirilmiştir. Kürenin hacminin silindirin hacmine oranını ve kürenin yüzeyinin silindirin <em>yan</em> yüzeyine oranını bul.<br><br>Hacim oranı: $\\dfrac{V_{\\text{küre}}}{V_{\\text{sil}}} = \\dfrac{\\tfrac{4}{3} \\pi r^{3}}{\\pi r^{2} \\cdot 2 r} = \\dfrac{\\tfrac{4}{3}}{2} = \\mathbf{\\dfrac{2}{3}}$.<br><br>Yüzey oranı: $\\dfrac{S_{\\text{küre}}}{S_{\\text{sil, yan}}} = \\dfrac{4 \\pi r^{2}}{2 \\pi r \\cdot 2 r} = \\dfrac{4 \\pi r^{2}}{4 \\pi r^{2}} = \\mathbf{1}$.<br><br>Her iki oran da tam olarak Arşimet'in kanıtladığı ve mezar taşına kazınmasını istediği sonuçtur.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Silindir: $V = \\pi r^{2} h$, $S_{\\text{yan}} = 2 \\pi r h$, $S_{\\text{top}} = 2 \\pi r (r + h)$</li>
<li>Koni: $V = \\tfrac{1}{3} \\pi r^{2} h$, yan $\\ell = \\sqrt{r^{2} + h^{2}}$, $S_{\\text{yan}} = \\pi r \\ell$, $S_{\\text{top}} = \\pi r (r + \\ell)$</li>
<li>Kesik koni: $V = \\tfrac{1}{3} \\pi h (R^{2} + Rr + r^{2})$ &mdash; koniye ($r = 0$) veya silindire ($R = r$) indirgenir</li>
<li>Küre: $V = \\tfrac{4}{3} \\pi r^{3}$, $S = 4 \\pi r^{2}$</li>
<li>Yarımküre (kapalı): $V = \\tfrac{2}{3} \\pi r^{3}$, $S = 3 \\pi r^{2}$ (eğri + düz başlık)</li>
<li>Yan yükseklik $\\ell$ Pisagor'dan bulunur: $\\ell^{2} = r^{2} + h^{2}$. Asla h'yi $\\ell$ yerine kullanma.</li>
<li>Yaygın hatalar: koni için 1/3'ü unutmak, kapalı silindir için bir başlığı unutmak, çap ile yarıçapı karıştırmak</li>
<li>Cavalieri ilkesi ve Arşimet teoremleri 1/3 ve 4/3 çarpanlarının ardındaki derin sebepleri verir</li>
</ul>
</div>`
};
