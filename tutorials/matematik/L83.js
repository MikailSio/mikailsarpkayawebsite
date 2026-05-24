window.LISE_MAT_L83 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Two triangles are <em>similar</em> when they share the same shape, even if one is bigger or smaller than the other.</strong> Think of a photograph and its enlargement: every angle is preserved, every length is multiplied by the same factor. Similarity is the geometric language behind scale models, maps, blueprints, shadows, and the proportions of the human body in classical art. It is also the single most useful tool in plane geometry — wherever you see ratios of lengths, similarity is probably hiding behind the scene.</p>

<p class="l-text">In this lesson you will learn the three classical tests for similarity (AA, SAS, SSS), understand how a linear ratio of k turns into an area ratio of k² and a volume ratio of k³, and apply Thales' intercept theorem and the angle bisector theorem to chase missing lengths. We close with the most famous outdoor application: measuring the height of a tree (or a building, or a pyramid) using only its shadow and a meter stick.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define triangle similarity precisely: equal corresponding angles and proportional corresponding sides</li>
<li>Apply the three similarity tests AA, SAS, SSS to prove that two triangles are similar</li>
<li>Use the similarity ratio k to find missing side lengths in a pair of similar triangles</li>
<li>Convert between linear ratio (k), area ratio (k²), and volume ratio (k³) for scaled figures</li>
<li>State and use Thales' intercept theorem (parallel lines cutting a triangle into proportional segments)</li>
<li>Apply the angle bisector theorem (interior bisector divides opposite side in ratio of adjacent sides)</li>
<li>Solve real-world problems involving shadows, scale models, and indirect measurement</li>
</ul>
</div>

<h2 class="lesson-title">1. What Does It Mean for Two Triangles to Be Similar?</h2>

<div class="calc-highlight"><strong>Same shape, possibly different size.</strong> Two triangles are similar if you can take one, enlarge or shrink it uniformly (without bending or stretching unevenly), and slide it on top of the other so they match perfectly. Every angle of the first triangle has a twin in the second, and every side has a proportional partner.</div>

<p class="l-text">Geometrically: similarity preserves <em>shape</em>. Congruence preserves <em>shape AND size</em>. So congruence is the special case of similarity where the scale factor is exactly 1. Two congruent triangles are always similar; two similar triangles are usually not congruent (unless k = 1).</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF SIMILAR TRIANGLES</div><div class="formula-main">$$\\triangle ABC \\sim \\triangle DEF \\iff \\angle A = \\angle D,\\; \\angle B = \\angle E,\\; \\angle C = \\angle F \\;\\text{ and }\\; \\frac{|AB|}{|DE|} = \\frac{|BC|}{|EF|} = \\frac{|CA|}{|FD|}$$</div><div class="formula-sub">Three angle equalities AND three side proportions, with vertices matched in order: A with D, B with E, C with F.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symbol</div><div class="card-body">"~" means "is similar to". So $\\triangle ABC \\sim \\triangle DEF$ reads "triangle ABC is similar to triangle DEF".</div></div>
<div class="calc-card"><div class="card-title">Order matters</div><div class="card-body">The order of letters tells you which vertex pairs with which. ABC ~ DEF means A↔D, B↔E, C↔F — NOT some other combination.</div></div>
<div class="calc-card"><div class="card-title">Ratio of similarity</div><div class="card-body">The common value of the three side ratios is called the similarity ratio (or scale factor), often written k.</div></div>
</div>

<div class="l-note"><strong>Why "corresponding" matters.</strong> If you write $\\triangle ABC \\sim \\triangle DEF$ when it should really be $\\triangle ABC \\sim \\triangle FED$, every ratio you set up will be wrong. Always check angle by angle before writing the correspondence: equal angles must be paired with equal angles.</div>

<h2 class="lesson-title">2. The Three Similarity Tests</h2>

<div class="calc-highlight"><strong>You do not need to verify all six conditions (three angles + three side ratios) to conclude that two triangles are similar.</strong> Just like in congruence, geometry gives us shortcut criteria. There are three of them: AA, SAS, and SSS — each requires checking only two or three pieces of information.</div>

<h3 style="color:#3b82f6;font-size:1.05rem;margin-top:1.4rem">2a. AA (Angle-Angle)</h3>

<div class="calc-formula"><div class="formula-label">AA TEST</div><div class="formula-main">$$\\angle A = \\angle D \\;\\text{ and }\\; \\angle B = \\angle E \\;\\;\\implies\\;\\; \\triangle ABC \\sim \\triangle DEF$$</div><div class="formula-sub">If two angles of one triangle equal two angles of another, the triangles are similar. (The third angle is forced because angles sum to 180&deg;.)</div></div>

<p class="l-text">AA is by far the most commonly used test in problems. Whenever you see parallel lines or right angles, AA usually pops out for free. It only needs <em>two</em> matching angles — the third follows automatically since the three angles of any triangle add to 180&deg;.</p>

<h3 style="color:#3b82f6;font-size:1.05rem;margin-top:1.4rem">2b. SAS (Side-Angle-Side)</h3>

<div class="calc-formula"><div class="formula-label">SAS TEST</div><div class="formula-main">$$\\frac{|AB|}{|DE|} = \\frac{|AC|}{|DF|} \\;\\text{ and }\\; \\angle A = \\angle D \\;\\;\\implies\\;\\; \\triangle ABC \\sim \\triangle DEF$$</div><div class="formula-sub">Two pairs of sides in the same ratio, with the angle BETWEEN those sides equal in both triangles.</div></div>

<p class="l-text">The angle in SAS must be the <em>included</em> angle — the one trapped between the two sides whose ratios you compared. If the equal angle is somewhere else, SAS does not apply.</p>

<h3 style="color:#3b82f6;font-size:1.05rem;margin-top:1.4rem">2c. SSS (Side-Side-Side)</h3>

<div class="calc-formula"><div class="formula-label">SSS TEST</div><div class="formula-main">$$\\frac{|AB|}{|DE|} = \\frac{|BC|}{|EF|} = \\frac{|CA|}{|FD|} \\;\\;\\implies\\;\\; \\triangle ABC \\sim \\triangle DEF$$</div><div class="formula-sub">All three pairs of corresponding sides are in the same ratio. No angle check is needed.</div></div>

<p class="l-text">SSS is the brute-force test: compute three ratios, check they are all equal. If yes, the triangles are similar and the common value is k.</p>

<div class="calc-graph"><div id="plot-l83-similar-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two similar triangles drawn together, △ABC (blue, smaller) and △DEF (orange, larger). Corresponding angles A&harr;D, B&harr;E, C&harr;F are equal, and the side ratios are all k = 1.5. Notice the shapes are identical — only the size has changed.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0,Bx=4,By=0,Cx=1.4,Cy=2.6;
var k=1.5;var Dx=6,Dy=-0.3;var Ex=Dx+k*(Bx-Ax),Ey=Dy+k*(By-Ay);var Fx=Dx+k*(Cx-Ax),Fy=Dy+k*(Cy-Ay);
var t1={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'△ABC',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var t2={x:[Dx,Ex,Fx,Dx],y:[Dy,Ey,Fy,Dy],mode:'lines+markers',name:'△DEF',line:{color:'#f59e0b',width:3},marker:{color:'#f59e0b',size:8}};
var labs={x:[Ax-0.25,Bx+0.2,Cx,Dx-0.3,Ex+0.25,Fx+0.1],y:[Ay-0.2,By-0.25,Cy+0.25,Dy-0.25,Ey-0.3,Fy+0.3],mode:'text',name:'labels',text:['A','B','C','D','E','F'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l83-similar-en',[t1,t2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AA</div><div class="example-body">In $\\triangle ABC$, $\\angle A = 70^\\circ$ and $\\angle B = 60^\\circ$. In $\\triangle DEF$, $\\angle D = 70^\\circ$ and $\\angle E = 60^\\circ$. Are the triangles similar?<br><br>Two angles match: $\\angle A = \\angle D$ and $\\angle B = \\angle E$. By the <strong>AA test</strong>, $\\triangle ABC \\sim \\triangle DEF$.<br><br>The third angle is forced: $\\angle C = 180^\\circ - 70^\\circ - 60^\\circ = 50^\\circ$, and similarly $\\angle F = 50^\\circ$. All angles match — no surprise.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SAS</div><div class="example-body">$\\triangle ABC$ has $|AB| = 4$, $|AC| = 6$, $\\angle A = 50^\\circ$.<br>$\\triangle DEF$ has $|DE| = 6$, $|DF| = 9$, $\\angle D = 50^\\circ$.<br><br>Compute the ratios of the two pairs of sides around the equal angle:<br>$\\dfrac{|AB|}{|DE|} = \\dfrac{4}{6} = \\dfrac{2}{3}$ and $\\dfrac{|AC|}{|DF|} = \\dfrac{6}{9} = \\dfrac{2}{3}$. Equal.<br><br>Included angles also equal: $\\angle A = \\angle D = 50^\\circ$. By the <strong>SAS test</strong>, $\\triangle ABC \\sim \\triangle DEF$ with $k = 2/3$.</div></div>

<h2 class="lesson-title">3. The Similarity Ratio k</h2>

<div class="calc-highlight"><strong>k is the single number that describes the size relationship between two similar triangles.</strong> If $\\triangle ABC \\sim \\triangle DEF$ with $k = |AB|/|DE| = 2/3$, then every length in △ABC is 2/3 of the corresponding length in △DEF.</div>

<div class="calc-formula"><div class="formula-label">SIMILARITY RATIO</div><div class="formula-main">$$k \\;=\\; \\frac{|AB|}{|DE|} \\;=\\; \\frac{|BC|}{|EF|} \\;=\\; \\frac{|CA|}{|FD|}$$</div><div class="formula-sub">k applies not just to the three sides but to ALL corresponding lengths: medians, heights, angle bisectors, perimeters, radii of inscribed and circumscribed circles. Everything that is a length scales by k.</div></div>

<p class="l-text"><strong>What does k tell us geometrically?</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">k = 1</div><div class="card-body">Triangles are congruent (same size). Similarity reduces to congruence.</div></div>
<div class="calc-card"><div class="card-title">k > 1</div><div class="card-body">The first triangle is larger than the second by a factor of k.</div></div>
<div class="calc-card"><div class="card-title">0 < k < 1</div><div class="card-body">The first triangle is smaller than the second. Scale factor is a proper fraction.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Find a missing side</div><div class="example-body">$\\triangle ABC \\sim \\triangle DEF$. We know $|AB| = 6$, $|DE| = 9$, $|BC| = 8$. Find $|EF|$.<br><br>Compute the ratio: $k = \\dfrac{|AB|}{|DE|} = \\dfrac{6}{9} = \\dfrac{2}{3}$.<br><br>Now apply k to the BC/EF pair: $\\dfrac{|BC|}{|EF|} = \\dfrac{2}{3} \\implies \\dfrac{8}{|EF|} = \\dfrac{2}{3} \\implies |EF| = 8 \\cdot \\dfrac{3}{2} = \\mathbf{12}$.</div></div>

<h2 class="lesson-title">4. Ratio of Areas: k Squared</h2>

<div class="calc-highlight"><strong>If the linear ratio is k, the area ratio is k². This is the most important consequence of similarity — and the one students forget most often.</strong></div>

<div class="calc-formula"><div class="formula-label">AREA RATIO OF SIMILAR FIGURES</div><div class="formula-main">$$\\triangle ABC \\sim \\triangle DEF,\\;\\; \\text{ratio } k \\;\\;\\implies\\;\\; \\frac{\\text{Area}(ABC)}{\\text{Area}(DEF)} \\;=\\; k^2$$</div><div class="formula-sub">Doubling the linear size multiplies the area by 4. Tripling it multiplies the area by 9. The rule applies to ANY similar figures, not just triangles.</div></div>

<p class="l-text"><strong>Why k², intuitively?</strong> Area is "length times length" — two perpendicular lengths multiplied. If you scale both lengths by k, the product scales by $k \\cdot k = k^2$. For triangles: base scales by k, height scales by k, area = (1/2)·base·height scales by $k^2$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Area ratio</div><div class="example-body">Two similar triangles have linear ratio $k = 2/3$. The smaller triangle has area $20\\,\\text{cm}^2$. What is the area of the larger triangle?<br><br>$\\dfrac{\\text{Area}_{\\text{small}}}{\\text{Area}_{\\text{large}}} = k^2 = \\left(\\dfrac{2}{3}\\right)^2 = \\dfrac{4}{9}$.<br><br>So $\\dfrac{20}{\\text{Area}_{\\text{large}}} = \\dfrac{4}{9} \\implies \\text{Area}_{\\text{large}} = 20 \\cdot \\dfrac{9}{4} = \\mathbf{45\\,\\text{cm}^2}$.</div></div>

<div class="l-note"><strong>Common error:</strong> students sometimes write area ratio = k instead of k². If the sides triple, the area becomes nine times larger, not three times. Always square the linear ratio when comparing areas.</div>

<h2 class="lesson-title">5. Ratio of Volumes: k Cubed</h2>

<div class="calc-highlight"><strong>For three-dimensional similar solids, the volume ratio is k³.</strong> Two similar cubes, pyramids, cones, or any other 3D shapes scale their volumes by the cube of the linear ratio.</div>

<div class="calc-formula"><div class="formula-label">VOLUME RATIO OF SIMILAR SOLIDS</div><div class="formula-main">$$\\text{linear ratio } k \\;\\;\\implies\\;\\; \\frac{V_1}{V_2} \\;=\\; k^3$$</div><div class="formula-sub">Volume is length × length × length, so scaling each by k multiplies the result by k³.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lengths</div><div class="card-body">Scale by k</div></div>
<div class="calc-card"><div class="card-title">Areas</div><div class="card-body">Scale by k²</div></div>
<div class="calc-card"><div class="card-title">Volumes</div><div class="card-body">Scale by k³</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Volume scaling</div><div class="example-body">A scale model of a building has linear ratio $1:50$ (the model is 1 unit for every 50 units of the real building). If the model holds $0.5\\,\\text{L}$ of water, how much would the real building hold?<br><br>Volume ratio is $50^3 = 125\\,000$.<br><br>Real volume $= 0.5 \\times 125\\,000 = \\mathbf{62\\,500\\,\\text{L}}$ (or 62.5 m³).</div></div>

<h2 class="lesson-title">6. Thales' Theorem (The Intercept Theorem)</h2>

<div class="calc-highlight"><strong>If you draw a line parallel to one side of a triangle, it cuts the other two sides in proportional segments — and creates a smaller triangle similar to the original.</strong> This is the geometric soul of all similarity problems.</div>

<div class="calc-formula"><div class="formula-label">THALES' THEOREM</div><div class="formula-main">$$DE \\parallel BC \\;\\;\\implies\\;\\; \\frac{|AD|}{|DB|} = \\frac{|AE|}{|EC|} \\;\\;\\text{ and }\\;\\; \\triangle ADE \\sim \\triangle ABC$$</div><div class="formula-sub">D lies on AB, E lies on AC, and DE is parallel to BC. The small triangle ADE is similar to the big triangle ABC.</div></div>

<p class="l-text">Why does this work? When DE is parallel to BC, the line DE makes the same angle with AB as BC does (corresponding angles), and similarly with AC. So $\\triangle ADE$ and $\\triangle ABC$ share angle A and have two pairs of equal angles. By AA, they are similar. The proportional sides follow immediately.</p>

<div class="calc-graph"><div id="plot-l83-thales-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> triangle ABC with a parallel segment DE inside it (DE &parallel; BC). The small triangle ADE is similar to ABC — same shape, smaller size. Visualize the dilation: imagine zooming out from vertex A, and ADE expands until it becomes ABC.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=4;var Bx=-3,By=0;var Cx=4,Cy=0;
var t=0.6;var Dx=Ax+t*(Bx-Ax),Dy=Ay+t*(By-Ay);var Ex=Ax+t*(Cx-Ax),Ey=Ay+t*(Cy-Ay);
var big={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'△ABC',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var small={x:[Dx,Ex],y:[Dy,Ey],mode:'lines+markers',name:'DE ∥ BC',line:{color:'#f59e0b',width:3,dash:'dash'},marker:{color:'#f59e0b',size:8}};
var labs={x:[Ax,Bx-0.3,Cx+0.3,Dx-0.3,Ex+0.3],y:[Ay+0.3,By-0.25,Cy-0.25,Dy,Ey],mode:'text',name:'labels',text:['A','B','C','D','E'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l83-thales-en',[big,small,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Thales</div><div class="example-body">In $\\triangle ABC$, $D$ lies on $AB$ and $E$ lies on $AC$ with $DE \\parallel BC$. Given $|AD| = 4$, $|DB| = 6$, $|AE| = 5$. Find $|EC|$.<br><br>By Thales: $\\dfrac{|AD|}{|DB|} = \\dfrac{|AE|}{|EC|}$.<br><br>$\\dfrac{4}{6} = \\dfrac{5}{|EC|} \\implies |EC| = \\dfrac{5 \\cdot 6}{4} = \\mathbf{7.5}$.</div></div>

<h2 class="lesson-title">7. The Angle Bisector Theorem</h2>

<div class="calc-highlight"><strong>An angle bisector inside a triangle divides the opposite side in the ratio of the two adjacent sides.</strong> Another classical similarity-driven result that lets you chase lengths without computing any angles.</div>

<div class="calc-formula"><div class="formula-label">INTERIOR ANGLE BISECTOR THEOREM</div><div class="formula-main">$$AD \\;\\text{ bisects }\\; \\angle A \\;\\;\\implies\\;\\; \\frac{|BD|}{|DC|} = \\frac{|AB|}{|AC|}$$</div><div class="formula-sub">D is the point where the bisector from A meets BC. The bisector splits BC into pieces proportional to the two sides at A.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Angle bisector</div><div class="example-body">In $\\triangle ABC$, $|AB| = 8$, $|AC| = 12$. The interior bisector of $\\angle A$ meets $BC$ at $D$. If $|BC| = 15$, find $|BD|$ and $|DC|$.<br><br>By the bisector theorem: $\\dfrac{|BD|}{|DC|} = \\dfrac{|AB|}{|AC|} = \\dfrac{8}{12} = \\dfrac{2}{3}$.<br><br>So $|BD| = \\dfrac{2}{5} \\cdot 15 = \\mathbf{6}$ and $|DC| = \\dfrac{3}{5} \\cdot 15 = \\mathbf{9}$. (Note: $6 + 9 = 15$ ✓ and $6/9 = 2/3$ ✓.)</div></div>

<div class="l-note"><strong>Why does the bisector theorem work?</strong> Draw a line through C parallel to AD. It hits the extension of AB at a point P. By a quick parallel-lines argument, $|CP| = |AC|$ and triangles $\\triangle BAD \\sim \\triangle BPC$, giving the desired ratio. The full proof uses Thales — similarity is the engine behind every step.</div>

<h2 class="lesson-title">8. The Shadow Problem (Indirect Measurement)</h2>

<div class="calc-highlight"><strong>How tall is that tree?</strong> You cannot climb it, you cannot use a tape measure on it — but the Sun is shining, and the tree casts a shadow on the ground. Stand next to the tree with a meter stick, measure your shadow, measure the tree's shadow, and similarity does the rest.</div>

<p class="l-text">The Sun is so far away that its rays arrive nearly parallel. So the angle the rays make with the ground is the same for you and for the tree. You form a right triangle with the ground (your height vs your shadow); the tree forms a similar right triangle (tree height vs tree shadow). Both triangles share the angle of the Sun and both have a right angle at the base — by <strong>AA</strong>, they are similar.</p>

<div class="calc-formula"><div class="formula-label">SHADOW FORMULA</div><div class="formula-main">$$\\frac{\\text{tree height}}{\\text{tree shadow}} \\;=\\; \\frac{\\text{your height}}{\\text{your shadow}}$$</div><div class="formula-sub">Same Sun, same angle, similar triangles — proportions of "vertical : shadow" are identical.</div></div>

<div class="calc-graph"><div id="plot-l83-shadow-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a tall tree casting a long shadow on the ground (blue), and a shorter meter stick casting a shorter shadow (orange). Same Sun angle, similar right triangles. Measure the three known lengths (your height, your shadow, tree's shadow) and the fourth (tree's height) drops out.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var treeH=6,treeS=8;
var meH=1.6,meS=treeS*meH/treeH;
var meX=treeS+1;
var ground={x:[-0.5,treeS+meS+1.5],y:[0,0],mode:'lines',name:'ground',line:{color:'rgba(255,255,255,0.4)',width:2}};
var tree={x:[0,0,treeS,0],y:[0,treeH,0,0],mode:'lines+markers',name:'tree + shadow',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:6}};
var me={x:[meX,meX,meX+meS,meX],y:[0,meH,0,0],mode:'lines+markers',name:'meter stick + shadow',line:{color:'#f59e0b',width:3},marker:{color:'#f59e0b',size:6}};
var sunRay1={x:[0,treeS],y:[treeH,0],mode:'lines',name:'sun ray',line:{color:'#fde68a',width:1.5,dash:'dot'},showlegend:false};
var sunRay2={x:[meX,meX+meS],y:[meH,0],mode:'lines',name:'sun ray',line:{color:'#fde68a',width:1.5,dash:'dot'},showlegend:false};
var labs={x:[-0.4,treeS/2,meX-0.5,meX+meS/2,0,meX],y:[treeH/2,-0.4,meH/2,-0.4,treeH+0.3,meH+0.3],mode:'text',name:'labels',text:['tree h','tree shadow','you h','your shadow','top','top'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (m)',range:[-1,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y (m)',range:[-1,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l83-shadow-en',[ground,tree,me,sunRay1,sunRay2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Tree height</div><div class="example-body">You are 1.6 m tall and your shadow at noon is 2 m long. At the same moment, a nearby tree casts a 10 m shadow. How tall is the tree?<br><br>Set up the proportion:<br>$\\dfrac{\\text{tree h}}{\\text{tree shadow}} = \\dfrac{\\text{you h}}{\\text{your shadow}}$<br>$\\dfrac{\\text{tree h}}{10} = \\dfrac{1.6}{2}$<br>$\\text{tree h} = 10 \\cdot \\dfrac{1.6}{2} = \\mathbf{8\\,\\text{m}}$.<br><br>This is the same trick Thales of Miletus is said to have used to measure the Great Pyramid of Giza around 600 BCE.</div></div>

<h2 class="lesson-title">9. Common Mistakes</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIMILARITY ≠ CONGRUENCE</div><div class="compare-item">Similar: same shape, possibly different size (k can be any positive number)</div><div class="compare-item">Congruent: same shape AND same size (k = 1 exactly)</div><div class="compare-item">All congruent triangles are similar; not all similar triangles are congruent</div></div><div class="compare-col"><div class="compare-title">ORDER OF VERTICES MATTERS</div><div class="compare-item">Writing $\\triangle ABC \\sim \\triangle DEF$ asserts A↔D, B↔E, C↔F</div><div class="compare-item">If you write the wrong order, every ratio you build is wrong</div><div class="compare-item">Always identify which angle matches which BEFORE writing the correspondence</div></div></div>

<div class="l-note"><strong>Three classic traps:</strong><br>(1) <strong>Forgetting the square for area.</strong> If sides double, area quadruples — not doubles.<br>(2) <strong>SSA is not a similarity test.</strong> Two sides proportional plus a non-included angle equal is NOT enough to conclude similarity (just as SSA is not a congruence test).<br>(3) <strong>The "included" angle in SAS must really be between the two compared sides.</strong> If the equal angle is somewhere else, the test fails.</div>

<h2 class="lesson-title">10. Worked Problems</h2>

<p class="l-text">A short set of problems pulling together everything in this lesson. Try each one yourself first, then check the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — Prove similarity from two angles</div><div class="example-body"><strong>In $\\triangle ABC$, $\\angle A = 40^\\circ$ and $\\angle B = 80^\\circ$. In $\\triangle PQR$, $\\angle P = 40^\\circ$ and $\\angle R = 60^\\circ$. Are the triangles similar?</strong><br><br>$\\triangle ABC$: third angle $\\angle C = 180 - 40 - 80 = 60^\\circ$.<br>$\\triangle PQR$: third angle $\\angle Q = 180 - 40 - 60 = 80^\\circ$.<br><br>So $\\angle A = \\angle P = 40^\\circ$, $\\angle B = \\angle Q = 80^\\circ$, $\\angle C = \\angle R = 60^\\circ$. By AA, $\\triangle ABC \\sim \\triangle PQR$. <strong>(Correspondence A↔P, B↔Q, C↔R.)</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — Missing side using similarity ratio</div><div class="example-body"><strong>$\\triangle ABC \\sim \\triangle DEF$ with $|AB| = 9$, $|DE| = 6$, $|AC| = 12$. Find $|DF|$.</strong><br><br>Ratio: $k = \\dfrac{|AB|}{|DE|} = \\dfrac{9}{6} = \\dfrac{3}{2}$.<br><br>Apply to AC/DF: $\\dfrac{|AC|}{|DF|} = \\dfrac{3}{2} \\implies \\dfrac{12}{|DF|} = \\dfrac{3}{2} \\implies |DF| = 12 \\cdot \\dfrac{2}{3} = \\mathbf{8}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — Area ratio</div><div class="example-body"><strong>Two similar triangles have linear ratio $2:5$. The larger triangle has area $75\\,\\text{cm}^2$. Find the area of the smaller one.</strong><br><br>Area ratio: $\\left(\\dfrac{2}{5}\\right)^2 = \\dfrac{4}{25}$.<br><br>Small area $= 75 \\cdot \\dfrac{4}{25} = \\mathbf{12\\,\\text{cm}^2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — Thales' theorem</div><div class="example-body"><strong>In $\\triangle ABC$, $DE \\parallel BC$ with $D \\in AB$, $E \\in AC$. Given $|AD| = 3$, $|AB| = 9$, $|AC| = 12$. Find $|AE|$.</strong><br><br>By Thales, $\\triangle ADE \\sim \\triangle ABC$ with $k = \\dfrac{|AD|}{|AB|} = \\dfrac{3}{9} = \\dfrac{1}{3}$.<br><br>So $|AE| = k \\cdot |AC| = \\dfrac{1}{3} \\cdot 12 = \\mathbf{4}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — Angle bisector theorem</div><div class="example-body"><strong>In $\\triangle ABC$, $|AB| = 10$, $|AC| = 14$, $|BC| = 18$. The bisector of $\\angle A$ meets $BC$ at $D$. Find $|BD|$.</strong><br><br>By the bisector theorem: $\\dfrac{|BD|}{|DC|} = \\dfrac{|AB|}{|AC|} = \\dfrac{10}{14} = \\dfrac{5}{7}$.<br><br>So $|BD| = \\dfrac{5}{12} \\cdot 18 = \\mathbf{7.5}$ (and $|DC| = 10.5$).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — Shadow problem</div><div class="example-body"><strong>A 2 m pole casts a 3 m shadow. At the same time of day, a building casts a 45 m shadow. How tall is the building?</strong><br><br>By similarity of the two right triangles: $\\dfrac{\\text{building h}}{45} = \\dfrac{2}{3} \\implies \\text{building h} = 45 \\cdot \\dfrac{2}{3} = \\mathbf{30\\,\\text{m}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — Volume scaling</div><div class="example-body"><strong>A miniature toy car is built at 1:18 scale of the real car. If the real car has a fuel tank of 50 L, what is the corresponding volume in the toy?</strong><br><br>Volume ratio: $\\left(\\dfrac{1}{18}\\right)^3 = \\dfrac{1}{5832}$.<br><br>Toy volume $= \\dfrac{50}{5832} \\approx \\mathbf{0.0086\\,\\text{L}} \\approx 8.6\\,\\text{mL}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — Combined similarity and Thales</div><div class="example-body"><strong>In $\\triangle ABC$, a segment $DE$ parallel to $BC$ divides the triangle into two regions: a small triangle $ADE$ and a trapezoid $DBCE$. If $|AD|/|AB| = 2/3$, find the ratio of the trapezoid's area to the area of $\\triangle ABC$.</strong><br><br>By Thales, $\\triangle ADE \\sim \\triangle ABC$ with $k = 2/3$.<br><br>Area ratio: $\\dfrac{\\text{Area}(ADE)}{\\text{Area}(ABC)} = k^2 = \\dfrac{4}{9}$.<br><br>Trapezoid area $=$ big area $-$ small area $\\implies$ ratio $= 1 - \\dfrac{4}{9} = \\mathbf{\\dfrac{5}{9}}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Two triangles are similar (~) when corresponding angles are equal AND corresponding sides are proportional</li>
<li>Order of vertices matters: $\\triangle ABC \\sim \\triangle DEF$ means A↔D, B↔E, C↔F</li>
<li>Three similarity tests: AA (two angles), SAS (two sides + included angle), SSS (three side ratios equal)</li>
<li>Similarity ratio k applies to all corresponding lengths (sides, heights, medians, perimeters)</li>
<li>Area ratio of similar figures is $k^2$; volume ratio of similar solids is $k^3$</li>
<li>Thales' theorem: a line parallel to one side cuts the other two sides in proportional segments</li>
<li>Angle bisector theorem: interior bisector divides the opposite side in the ratio of the adjacent sides</li>
<li>Indirect measurement (shadow problem) works because parallel sun rays create similar right triangles</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İki üçgen, boyutları farklı olsa bile aynı şekle sahipse <em>benzerdir</em>.</strong> Bir fotoğraf ile büyütülmüş halini düşün: her açı korunur, her uzunluk aynı oranla çarpılır. Benzerlik; ölçekli modellerin, haritaların, yapı planlarının, gölgelerin ve klasik sanattaki insan vücudu oranlarının ardındaki geometrik dildir. Aynı zamanda düzlem geometrisinde sahip olduğumuz en güçlü araçtır — uzunluk oranlarının olduğu her yerde, büyük olasılıkla sahnenin arkasında benzerlik gizlidir.</p>

<p class="l-text">Bu derste benzerliğin üç klasik testini (AA, SAS, SSS) öğreneceksin, doğrusal oran k'nın nasıl alan oranı k²'ye ve hacim oranı k³'e dönüştüğünü kavrayacaksın, Thales'in kesişen doğrular teoremini ve açıortay teoremini eksik uzunlukları bulmak için uygulayacaksın. Dersi en ünlü açık hava uygulamasıyla kapatıyoruz: bir ağacın (ya da binanın veya piramidin) yüksekliğini sadece gölgesini ve bir metre çubuğunu kullanarak ölçmek.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üçgende benzerliği kesin olarak tanımlamayı: karşılıklı açılar eşit ve karşılıklı kenarlar orantılı</li>
<li>İki üçgenin benzer olduğunu kanıtlamak için üç benzerlik testini (AA, SAS, SSS) uygulamayı</li>
<li>Benzer üçgen çiftinde eksik kenar uzunluklarını bulmak için benzerlik oranı k'yı kullanmayı</li>
<li>Ölçeklenmiş figürlerde doğrusal oran (k), alan oranı (k²) ve hacim oranı (k³) arasında geçiş yapmayı</li>
<li>Thales'in kesişen doğrular teoremini (üçgeni kesen paralel doğrular, kenarları orantılı parçalara böler) ifade etmeyi ve kullanmayı</li>
<li>Açıortay teoremini (iç açıortay, karşı kenarı komşu kenarların oranında böler) uygulamayı</li>
<li>Gölgeler, ölçekli modeller ve dolaylı ölçüm içeren gerçek problemleri çözmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. İki Üçgenin Benzer Olması Ne Demektir?</h2>

<div class="calc-highlight"><strong>Aynı şekil, muhtemelen farklı boyut.</strong> İki üçgen, birini alıp düzgünce büyütüp ya da küçültüp (hiçbir tarafından farklı oranda gerip uzatmadan) diğerinin üzerine kaydırdığında tam olarak çakışacak şekilde örtüşüyorsa benzerdir. Birinci üçgenin her açısının ikincide bir eşi vardır ve her kenarın orantılı bir partneri vardır.</div>

<p class="l-text">Geometrik olarak: benzerlik <em>şekli</em> korur. Eşlik (eşit üçgenler) ise <em>şekil VE boyut</em>'u korur. Yani eşlik, ölçek faktörünün tam olarak 1 olduğu özel bir benzerlik durumudur. İki eş üçgen her zaman benzerdir; iki benzer üçgen genellikle eş değildir (k = 1 olmadıkça).</p>

<div class="calc-formula"><div class="formula-label">BENZER ÜÇGEN TANIMI</div><div class="formula-main">$$\\triangle ABC \\sim \\triangle DEF \\iff \\angle A = \\angle D,\\; \\angle B = \\angle E,\\; \\angle C = \\angle F \\;\\text{ ve }\\; \\frac{|AB|}{|DE|} = \\frac{|BC|}{|EF|} = \\frac{|CA|}{|FD|}$$</div><div class="formula-sub">Üç açı eşitliği VE üç kenar orantısı — köşeler sırayla eşleştirilir: A ile D, B ile E, C ile F.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sembol</div><div class="card-body">"~" "benzerdir" demektir. Yani $\\triangle ABC \\sim \\triangle DEF$ "ABC üçgeni DEF üçgenine benzerdir" olarak okunur.</div></div>
<div class="calc-card"><div class="card-title">Sıra önemlidir</div><div class="card-body">Harflerin sırası, hangi köşenin hangi köşeyle eşleştiğini söyler. ABC ~ DEF ifadesi A↔D, B↔E, C↔F demektir — başka bir kombinasyon DEĞİL.</div></div>
<div class="calc-card"><div class="card-title">Benzerlik oranı</div><div class="card-body">Üç kenar oranının ortak değerine benzerlik oranı (veya ölçek faktörü) denir, genellikle k ile gösterilir.</div></div>
</div>

<div class="l-note"><strong>"Karşılıklı" sözcüğü neden önemli.</strong> Aslında $\\triangle ABC \\sim \\triangle FED$ olması gerekirken $\\triangle ABC \\sim \\triangle DEF$ yazarsan, kurduğun her oran yanlış çıkar. Karşılığı yazmadan önce her zaman açıları teker teker kontrol et: eşit açılar eşit açılarla eşleşmelidir.</div>

<h2 class="lesson-title">2. Üç Benzerlik Testi</h2>

<div class="calc-highlight"><strong>İki üçgenin benzer olduğunu sonuçlandırmak için altı koşulun (üç açı + üç kenar oranı) hepsini doğrulamana gerek yok.</strong> Tıpkı eşlikte olduğu gibi, geometri bize kısayol ölçütleri sunar. Bunlardan üç tane var: AA, SAS ve SSS — her biri yalnızca iki ya da üç parça bilgi gerektirir.</div>

<h3 style="color:#3b82f6;font-size:1.05rem;margin-top:1.4rem">2a. AA (Açı-Açı)</h3>

<div class="calc-formula"><div class="formula-label">AA TESTİ</div><div class="formula-main">$$\\angle A = \\angle D \\;\\text{ ve }\\; \\angle B = \\angle E \\;\\;\\implies\\;\\; \\triangle ABC \\sim \\triangle DEF$$</div><div class="formula-sub">Bir üçgenin iki açısı diğerinin iki açısına eşitse üçgenler benzerdir. (Üçüncü açı zorunludur çünkü açıların toplamı 180&deg;'dir.)</div></div>

<p class="l-text">AA, problemlerde açık ara en sık kullanılan testtir. Paralel doğrular veya dik açılar gördüğün her yerde AA genellikle bedava çıkar. Sadece <em>iki</em> eşleşen açıya ihtiyacı vardır — üçüncüsü, herhangi bir üçgenin üç açısının toplamının 180&deg; olduğunu kullanarak kendiliğinden gelir.</p>

<h3 style="color:#3b82f6;font-size:1.05rem;margin-top:1.4rem">2b. SAS (Kenar-Açı-Kenar)</h3>

<div class="calc-formula"><div class="formula-label">SAS TESTİ</div><div class="formula-main">$$\\frac{|AB|}{|DE|} = \\frac{|AC|}{|DF|} \\;\\text{ ve }\\; \\angle A = \\angle D \\;\\;\\implies\\;\\; \\triangle ABC \\sim \\triangle DEF$$</div><div class="formula-sub">İki kenar çifti aynı oranda ve bu kenarların ARASINDAKİ açı her iki üçgende de eşit.</div></div>

<p class="l-text">SAS'taki açı mutlaka <em>kapsanan</em> açı olmalıdır — yani oranlarını karşılaştırdığın iki kenarın arasında sıkışmış olan açı. Eşit açı başka bir yerdeyse SAS uygulanmaz.</p>

<h3 style="color:#3b82f6;font-size:1.05rem;margin-top:1.4rem">2c. SSS (Kenar-Kenar-Kenar)</h3>

<div class="calc-formula"><div class="formula-label">SSS TESTİ</div><div class="formula-main">$$\\frac{|AB|}{|DE|} = \\frac{|BC|}{|EF|} = \\frac{|CA|}{|FD|} \\;\\;\\implies\\;\\; \\triangle ABC \\sim \\triangle DEF$$</div><div class="formula-sub">Üç karşılıklı kenar çiftinin tümü aynı orandadır. Açı kontrolü gerekmez.</div></div>

<p class="l-text">SSS, kaba kuvvet testidir: üç oranı hesapla, hepsinin eşit olup olmadığını kontrol et. Evetse üçgenler benzerdir ve ortak değer k'dır.</p>

<div class="calc-graph"><div id="plot-l83-similar-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> birlikte çizilmiş iki benzer üçgen, △ABC (mavi, küçük) ve △DEF (turuncu, büyük). Karşılıklı açılar A&harr;D, B&harr;E, C&harr;F eşittir ve kenar oranları hepsi k = 1.5. Şekillerin özdeş olduğuna dikkat et — sadece boyut değişmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0,Bx=4,By=0,Cx=1.4,Cy=2.6;
var k=1.5;var Dx=6,Dy=-0.3;var Ex=Dx+k*(Bx-Ax),Ey=Dy+k*(By-Ay);var Fx=Dx+k*(Cx-Ax),Fy=Dy+k*(Cy-Ay);
var t1={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'△ABC',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var t2={x:[Dx,Ex,Fx,Dx],y:[Dy,Ey,Fy,Dy],mode:'lines+markers',name:'△DEF',line:{color:'#f59e0b',width:3},marker:{color:'#f59e0b',size:8}};
var labs={x:[Ax-0.25,Bx+0.2,Cx,Dx-0.3,Ex+0.25,Fx+0.1],y:[Ay-0.2,By-0.25,Cy+0.25,Dy-0.25,Ey-0.3,Fy+0.3],mode:'text',name:'etiketler',text:['A','B','C','D','E','F'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l83-similar-tr',[t1,t2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — AA</div><div class="example-body">$\\triangle ABC$'de $\\angle A = 70^\\circ$ ve $\\angle B = 60^\\circ$. $\\triangle DEF$'de $\\angle D = 70^\\circ$ ve $\\angle E = 60^\\circ$. Üçgenler benzer mi?<br><br>İki açı eşleşiyor: $\\angle A = \\angle D$ ve $\\angle B = \\angle E$. <strong>AA testine</strong> göre $\\triangle ABC \\sim \\triangle DEF$.<br><br>Üçüncü açı kendiliğinden gelir: $\\angle C = 180^\\circ - 70^\\circ - 60^\\circ = 50^\\circ$ ve benzer şekilde $\\angle F = 50^\\circ$. Tüm açılar eşleşiyor — sürpriz değil.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SAS</div><div class="example-body">$\\triangle ABC$'de $|AB| = 4$, $|AC| = 6$, $\\angle A = 50^\\circ$.<br>$\\triangle DEF$'de $|DE| = 6$, $|DF| = 9$, $\\angle D = 50^\\circ$.<br><br>Eşit açının çevresindeki iki kenar çiftinin oranlarını hesapla:<br>$\\dfrac{|AB|}{|DE|} = \\dfrac{4}{6} = \\dfrac{2}{3}$ ve $\\dfrac{|AC|}{|DF|} = \\dfrac{6}{9} = \\dfrac{2}{3}$. Eşit.<br><br>Kapsanan açılar da eşit: $\\angle A = \\angle D = 50^\\circ$. <strong>SAS testine</strong> göre $\\triangle ABC \\sim \\triangle DEF$ ve $k = 2/3$.</div></div>

<h2 class="lesson-title">3. Benzerlik Oranı k</h2>

<div class="calc-highlight"><strong>k, iki benzer üçgen arasındaki boyut ilişkisini tanımlayan tek sayıdır.</strong> $\\triangle ABC \\sim \\triangle DEF$ ve $k = |AB|/|DE| = 2/3$ ise △ABC'deki her uzunluk, △DEF'deki karşılığının 2/3'üdür.</div>

<div class="calc-formula"><div class="formula-label">BENZERLİK ORANI</div><div class="formula-main">$$k \\;=\\; \\frac{|AB|}{|DE|} \\;=\\; \\frac{|BC|}{|EF|} \\;=\\; \\frac{|CA|}{|FD|}$$</div><div class="formula-sub">k sadece üç kenara değil, TÜM karşılıklı uzunluklara uygulanır: kenarortaylar, yükseklikler, açıortaylar, çevreler, iç-teğet ve çevrel çemberlerin yarıçapları. Uzunluk olan her şey k ile ölçeklenir.</div></div>

<p class="l-text"><strong>k geometrik olarak bize ne anlatır?</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">k = 1</div><div class="card-body">Üçgenler eştir (aynı boyut). Benzerlik eşliğe indirgenir.</div></div>
<div class="calc-card"><div class="card-title">k > 1</div><div class="card-body">Birinci üçgen, ikinciden k katı daha büyüktür.</div></div>
<div class="calc-card"><div class="card-title">0 < k < 1</div><div class="card-body">Birinci üçgen, ikinciden daha küçüktür. Ölçek faktörü öz kesirdir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Eksik kenarı bul</div><div class="example-body">$\\triangle ABC \\sim \\triangle DEF$. $|AB| = 6$, $|DE| = 9$, $|BC| = 8$ olduğunu biliyoruz. $|EF|$'yi bul.<br><br>Oranı hesapla: $k = \\dfrac{|AB|}{|DE|} = \\dfrac{6}{9} = \\dfrac{2}{3}$.<br><br>Şimdi k'yi BC/EF çiftine uygula: $\\dfrac{|BC|}{|EF|} = \\dfrac{2}{3} \\implies \\dfrac{8}{|EF|} = \\dfrac{2}{3} \\implies |EF| = 8 \\cdot \\dfrac{3}{2} = \\mathbf{12}$.</div></div>

<h2 class="lesson-title">4. Alan Oranı: k Karesi</h2>

<div class="calc-highlight"><strong>Doğrusal oran k ise alan oranı k²'dir. Bu, benzerliğin en önemli sonucudur — ve öğrencilerin en sık unuttuğu kuraldır.</strong></div>

<div class="calc-formula"><div class="formula-label">BENZER FİGÜRLERİN ALAN ORANI</div><div class="formula-main">$$\\triangle ABC \\sim \\triangle DEF,\\;\\; \\text{oran } k \\;\\;\\implies\\;\\; \\frac{\\text{Alan}(ABC)}{\\text{Alan}(DEF)} \\;=\\; k^2$$</div><div class="formula-sub">Doğrusal boyutu iki katına çıkarmak alanı 4 katına çıkarır. Üç katına çıkarmak alanı 9 katına çıkarır. Kural sadece üçgenlere değil, HERHANGİ benzer figürlere uygulanır.</div></div>

<p class="l-text"><strong>Sezgisel olarak neden k²?</strong> Alan "uzunluk çarpı uzunluk" — birbirine dik iki uzunluğun çarpımı. Her iki uzunluğu k ile ölçeklersen, çarpım $k \\cdot k = k^2$ ile ölçeklenir. Üçgenler için: taban k ile ölçeklenir, yükseklik k ile ölçeklenir, alan = (1/2)·taban·yükseklik $k^2$ ile ölçeklenir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Alan oranı</div><div class="example-body">İki benzer üçgenin doğrusal oranı $k = 2/3$. Küçük üçgenin alanı $20\\,\\text{cm}^2$. Büyük üçgenin alanı kaçtır?<br><br>$\\dfrac{\\text{Alan}_{\\text{küçük}}}{\\text{Alan}_{\\text{büyük}}} = k^2 = \\left(\\dfrac{2}{3}\\right)^2 = \\dfrac{4}{9}$.<br><br>Yani $\\dfrac{20}{\\text{Alan}_{\\text{büyük}}} = \\dfrac{4}{9} \\implies \\text{Alan}_{\\text{büyük}} = 20 \\cdot \\dfrac{9}{4} = \\mathbf{45\\,\\text{cm}^2}$.</div></div>

<div class="l-note"><strong>Sık hata:</strong> öğrenciler bazen alan oranını k² yerine k yazar. Kenarlar üçe katlanırsa alan dokuz kat büyür, üç kat değil. Alanları karşılaştırırken her zaman doğrusal oranın karesini al.</div>

<h2 class="lesson-title">5. Hacim Oranı: k Küpü</h2>

<div class="calc-highlight"><strong>Üç boyutlu benzer cisimler için hacim oranı k³'tür.</strong> İki benzer küp, piramit, koni veya başka bir 3B şekil, doğrusal oranın küpüyle hacimlerini ölçekler.</div>

<div class="calc-formula"><div class="formula-label">BENZER CİSİMLERİN HACİM ORANI</div><div class="formula-main">$$\\text{doğrusal oran } k \\;\\;\\implies\\;\\; \\frac{V_1}{V_2} \\;=\\; k^3$$</div><div class="formula-sub">Hacim uzunluk × uzunluk × uzunluk olduğu için, her birini k ile ölçeklemek sonucu k³ ile çarpar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uzunluklar</div><div class="card-body">k ile ölçeklenir</div></div>
<div class="calc-card"><div class="card-title">Alanlar</div><div class="card-body">k² ile ölçeklenir</div></div>
<div class="calc-card"><div class="card-title">Hacimler</div><div class="card-body">k³ ile ölçeklenir</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Hacim ölçeklemesi</div><div class="example-body">Bir binanın ölçekli modelinin doğrusal oranı $1:50$ (model gerçek binanın her 50 biriminde 1 birim). Model $0.5\\,\\text{L}$ su tutuyorsa, gerçek bina ne kadar tutar?<br><br>Hacim oranı $50^3 = 125\\,000$.<br><br>Gerçek hacim $= 0.5 \\times 125\\,000 = \\mathbf{62\\,500\\,\\text{L}}$ (yani 62.5 m³).</div></div>

<h2 class="lesson-title">6. Thales Teoremi (Kesişen Doğrular)</h2>

<div class="calc-highlight"><strong>Bir üçgenin bir kenarına paralel bir doğru çizersen, diğer iki kenarı orantılı parçalara böler — ve orijinaline benzer küçük bir üçgen oluşturur.</strong> Tüm benzerlik problemlerinin geometrik ruhu budur.</div>

<div class="calc-formula"><div class="formula-label">THALES TEOREMİ</div><div class="formula-main">$$DE \\parallel BC \\;\\;\\implies\\;\\; \\frac{|AD|}{|DB|} = \\frac{|AE|}{|EC|} \\;\\;\\text{ ve }\\;\\; \\triangle ADE \\sim \\triangle ABC$$</div><div class="formula-sub">D, AB üzerinde, E, AC üzerinde ve DE, BC'ye paralel. Küçük üçgen ADE, büyük üçgen ABC'ye benzerdir.</div></div>

<p class="l-text">Bu neden işliyor? DE, BC'ye paralel olduğunda, DE doğrusu AB ile BC'nin yaptığı açının aynısını yapar (yöndeş açılar) ve aynı şey AC için de geçerlidir. Yani $\\triangle ADE$ ve $\\triangle ABC$ A açısını paylaşır ve iki çift eşit açıya sahip olur. AA'ya göre benzerler. Orantılı kenarlar hemen takip eder.</p>

<div class="calc-graph"><div id="plot-l83-thales-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> içinde paralel bir DE doğru parçası bulunan üçgen ABC (DE &parallel; BC). Küçük üçgen ADE, ABC'ye benzerdir — aynı şekil, daha küçük boyut. Genişlemeyi görselleştir: A köşesinden uzaklaştığını hayal et, ADE büyür ve ABC'ye dönüşür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=4;var Bx=-3,By=0;var Cx=4,Cy=0;
var t=0.6;var Dx=Ax+t*(Bx-Ax),Dy=Ay+t*(By-Ay);var Ex=Ax+t*(Cx-Ax),Ey=Ay+t*(Cy-Ay);
var big={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'△ABC',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var small={x:[Dx,Ex],y:[Dy,Ey],mode:'lines+markers',name:'DE ∥ BC',line:{color:'#f59e0b',width:3,dash:'dash'},marker:{color:'#f59e0b',size:8}};
var labs={x:[Ax,Bx-0.3,Cx+0.3,Dx-0.3,Ex+0.3],y:[Ay+0.3,By-0.25,Cy-0.25,Dy,Ey],mode:'text',name:'etiketler',text:['A','B','C','D','E'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l83-thales-tr',[big,small,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Thales</div><div class="example-body">$\\triangle ABC$'de, $D$ AB üzerinde, $E$ AC üzerinde ve $DE \\parallel BC$. $|AD| = 4$, $|DB| = 6$, $|AE| = 5$ veriliyor. $|EC|$'yi bul.<br><br>Thales'e göre: $\\dfrac{|AD|}{|DB|} = \\dfrac{|AE|}{|EC|}$.<br><br>$\\dfrac{4}{6} = \\dfrac{5}{|EC|} \\implies |EC| = \\dfrac{5 \\cdot 6}{4} = \\mathbf{7.5}$.</div></div>

<h2 class="lesson-title">7. Açıortay Teoremi</h2>

<div class="calc-highlight"><strong>Bir üçgenin iç açıortayı, karşı kenarı komşu iki kenarın oranında böler.</strong> Açı hesaplamadan uzunlukları takip etmeni sağlayan, benzerlikten gelen bir başka klasik sonuç.</div>

<div class="calc-formula"><div class="formula-label">İÇ AÇIORTAY TEOREMİ</div><div class="formula-main">$$AD \\;\\text{ } \\angle A\\text{'yı ortalar} \\;\\;\\implies\\;\\; \\frac{|BD|}{|DC|} = \\frac{|AB|}{|AC|}$$</div><div class="formula-sub">D, A'dan çıkan açıortayın BC ile kesiştiği noktadır. Açıortay BC'yi A'daki iki kenarla orantılı parçalara böler.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Açıortay</div><div class="example-body">$\\triangle ABC$'de $|AB| = 8$, $|AC| = 12$. $\\angle A$'nın iç açıortayı $BC$'yi $D$'de keser. $|BC| = 15$ ise $|BD|$ ve $|DC|$'yi bul.<br><br>Açıortay teoremine göre: $\\dfrac{|BD|}{|DC|} = \\dfrac{|AB|}{|AC|} = \\dfrac{8}{12} = \\dfrac{2}{3}$.<br><br>Yani $|BD| = \\dfrac{2}{5} \\cdot 15 = \\mathbf{6}$ ve $|DC| = \\dfrac{3}{5} \\cdot 15 = \\mathbf{9}$. (Kontrol: $6 + 9 = 15$ ✓ ve $6/9 = 2/3$ ✓.)</div></div>

<div class="l-note"><strong>Açıortay teoremi neden işliyor?</strong> C'den AD'ye paralel bir doğru çiz. Bu doğru AB'nin uzantısını P noktasında keser. Hızlı bir paralel-doğrular argümanıyla $|CP| = |AC|$ ve $\\triangle BAD \\sim \\triangle BPC$, bu da istenen oranı verir. Tam ispat Thales'i kullanır — benzerlik her adımın motorudur.</div>

<h2 class="lesson-title">8. Gölge Problemi (Dolaylı Ölçüm)</h2>

<div class="calc-highlight"><strong>Şu ağaç ne kadar uzun?</strong> Tırmanamazsın, ona şerit metre uygulayamazsın — ama güneş parlıyor ve ağaç yere bir gölge düşürüyor. Ağacın yanına bir metre çubuğuyla dur, kendi gölgeni ölç, ağacın gölgesini ölç ve benzerlik gerisini halleder.</div>

<p class="l-text">Güneş o kadar uzak ki ışınları neredeyse paralel gelir. Bu yüzden ışınların yerle yaptığı açı senin için de, ağaç için de aynıdır. Sen yerle birlikte bir dik üçgen oluşturursun (boyun ile gölgen); ağaç da benzer bir dik üçgen oluşturur (ağacın boyu ile ağacın gölgesi). Her iki üçgen güneşin açısını paylaşır ve her ikisinin de tabanında dik açı vardır — <strong>AA</strong>'ya göre benzerler.</p>

<div class="calc-formula"><div class="formula-label">GÖLGE FORMÜLÜ</div><div class="formula-main">$$\\frac{\\text{ağaç boyu}}{\\text{ağaç gölgesi}} \\;=\\; \\frac{\\text{senin boyun}}{\\text{senin gölgen}}$$</div><div class="formula-sub">Aynı güneş, aynı açı, benzer üçgenler — "dikey : gölge" oranları özdeştir.</div></div>

<div class="calc-graph"><div id="plot-l83-shadow-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yere uzun bir gölge düşüren uzun bir ağaç (mavi) ve daha kısa bir gölge düşüren daha kısa bir metre çubuğu (turuncu). Aynı güneş açısı, benzer dik üçgenler. Bilinen üç uzunluğu ölç (boyun, gölgen, ağacın gölgesi) ve dördüncü (ağacın boyu) hesap ile çıkar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var treeH=6,treeS=8;
var meH=1.6,meS=treeS*meH/treeH;
var meX=treeS+1;
var ground={x:[-0.5,treeS+meS+1.5],y:[0,0],mode:'lines',name:'yer',line:{color:'rgba(255,255,255,0.4)',width:2}};
var tree={x:[0,0,treeS,0],y:[0,treeH,0,0],mode:'lines+markers',name:'ağaç + gölge',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:6}};
var me={x:[meX,meX,meX+meS,meX],y:[0,meH,0,0],mode:'lines+markers',name:'metre çubuğu + gölge',line:{color:'#f59e0b',width:3},marker:{color:'#f59e0b',size:6}};
var sunRay1={x:[0,treeS],y:[treeH,0],mode:'lines',name:'güneş ışını',line:{color:'#fde68a',width:1.5,dash:'dot'},showlegend:false};
var sunRay2={x:[meX,meX+meS],y:[meH,0],mode:'lines',name:'güneş ışını',line:{color:'#fde68a',width:1.5,dash:'dot'},showlegend:false};
var labs={x:[-0.4,treeS/2,meX-0.5,meX+meS/2,0,meX],y:[treeH/2,-0.4,meH/2,-0.4,treeH+0.3,meH+0.3],mode:'text',name:'etiketler',text:['ağaç b','ağaç gölgesi','sen b','senin gölgen','tepe','tepe'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (m)',range:[-1,13],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y (m)',range:[-1,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l83-shadow-tr',[ground,tree,me,sunRay1,sunRay2,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Ağaç boyu</div><div class="example-body">Boyun 1.6 m ve öğle vakti gölgen 2 m uzunluğunda. Aynı anda yakındaki bir ağaç 10 m gölge düşürüyor. Ağaç ne kadar uzun?<br><br>Orantıyı kur:<br>$\\dfrac{\\text{ağaç b}}{\\text{ağaç gölgesi}} = \\dfrac{\\text{senin b}}{\\text{senin gölgen}}$<br>$\\dfrac{\\text{ağaç b}}{10} = \\dfrac{1.6}{2}$<br>$\\text{ağaç b} = 10 \\cdot \\dfrac{1.6}{2} = \\mathbf{8\\,\\text{m}}$.<br><br>Bu, Miletli Thales'in MÖ 600 civarında Giza'nın Büyük Piramidini ölçmek için kullandığı söylenen aynı numaradır.</div></div>

<h2 class="lesson-title">9. Sık Yapılan Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BENZERLİK ≠ EŞLİK</div><div class="compare-item">Benzer: aynı şekil, muhtemelen farklı boyut (k herhangi bir pozitif sayı olabilir)</div><div class="compare-item">Eş: aynı şekil VE aynı boyut (tam olarak k = 1)</div><div class="compare-item">Tüm eş üçgenler benzerdir; tüm benzer üçgenler eş değildir</div></div><div class="compare-col"><div class="compare-title">KÖŞELERİN SIRASI ÖNEMLİDİR</div><div class="compare-item">$\\triangle ABC \\sim \\triangle DEF$ yazmak A↔D, B↔E, C↔F'yi iddia eder</div><div class="compare-item">Yanlış sıra yazarsan, kurduğun her oran yanlış çıkar</div><div class="compare-item">Karşılığı yazmadan ÖNCE her zaman hangi açının hangisiyle eşleştiğini belirle</div></div></div>

<div class="l-note"><strong>Üç klasik tuzak:</strong><br>(1) <strong>Alan için kareyi unutmak.</strong> Kenarlar iki katına çıkarsa alan dört katına çıkar — iki katına değil.<br>(2) <strong>SSA bir benzerlik testi değildir.</strong> İki kenarın orantılı olması artı kapsanmayan bir açının eşit olması benzerliği sonuçlandırmak için YETERSİZ (tıpkı SSA'nın bir eşlik testi olmaması gibi).<br>(3) <strong>SAS'taki "kapsanan" açı gerçekten karşılaştırılan iki kenarın arasında olmalıdır.</strong> Eşit açı başka bir yerdeyse test başarısız olur.</div>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>

<p class="l-text">Bu dersteki her şeyi bir araya getiren kısa bir problem seti. Önce her birini kendin çözmeyi dene, sonra çözüme bak.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — İki açıdan benzerliği kanıtla</div><div class="example-body"><strong>$\\triangle ABC$'de $\\angle A = 40^\\circ$ ve $\\angle B = 80^\\circ$. $\\triangle PQR$'de $\\angle P = 40^\\circ$ ve $\\angle R = 60^\\circ$. Üçgenler benzer mi?</strong><br><br>$\\triangle ABC$: üçüncü açı $\\angle C = 180 - 40 - 80 = 60^\\circ$.<br>$\\triangle PQR$: üçüncü açı $\\angle Q = 180 - 40 - 60 = 80^\\circ$.<br><br>Yani $\\angle A = \\angle P = 40^\\circ$, $\\angle B = \\angle Q = 80^\\circ$, $\\angle C = \\angle R = 60^\\circ$. AA ile $\\triangle ABC \\sim \\triangle PQR$. <strong>(Karşılık A↔P, B↔Q, C↔R.)</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — Benzerlik oranıyla eksik kenar</div><div class="example-body"><strong>$\\triangle ABC \\sim \\triangle DEF$ ve $|AB| = 9$, $|DE| = 6$, $|AC| = 12$. $|DF|$'yi bul.</strong><br><br>Oran: $k = \\dfrac{|AB|}{|DE|} = \\dfrac{9}{6} = \\dfrac{3}{2}$.<br><br>AC/DF'ye uygula: $\\dfrac{|AC|}{|DF|} = \\dfrac{3}{2} \\implies \\dfrac{12}{|DF|} = \\dfrac{3}{2} \\implies |DF| = 12 \\cdot \\dfrac{2}{3} = \\mathbf{8}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — Alan oranı</div><div class="example-body"><strong>İki benzer üçgenin doğrusal oranı $2:5$. Büyük üçgenin alanı $75\\,\\text{cm}^2$. Küçük üçgenin alanını bul.</strong><br><br>Alan oranı: $\\left(\\dfrac{2}{5}\\right)^2 = \\dfrac{4}{25}$.<br><br>Küçük alan $= 75 \\cdot \\dfrac{4}{25} = \\mathbf{12\\,\\text{cm}^2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — Thales teoremi</div><div class="example-body"><strong>$\\triangle ABC$'de $D \\in AB$, $E \\in AC$ ve $DE \\parallel BC$. $|AD| = 3$, $|AB| = 9$, $|AC| = 12$ veriliyor. $|AE|$'yi bul.</strong><br><br>Thales'e göre, $\\triangle ADE \\sim \\triangle ABC$ ve $k = \\dfrac{|AD|}{|AB|} = \\dfrac{3}{9} = \\dfrac{1}{3}$.<br><br>Yani $|AE| = k \\cdot |AC| = \\dfrac{1}{3} \\cdot 12 = \\mathbf{4}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — Açıortay teoremi</div><div class="example-body"><strong>$\\triangle ABC$'de $|AB| = 10$, $|AC| = 14$, $|BC| = 18$. $\\angle A$'nın açıortayı $BC$'yi $D$'de keser. $|BD|$'yi bul.</strong><br><br>Açıortay teoremine göre: $\\dfrac{|BD|}{|DC|} = \\dfrac{|AB|}{|AC|} = \\dfrac{10}{14} = \\dfrac{5}{7}$.<br><br>Yani $|BD| = \\dfrac{5}{12} \\cdot 18 = \\mathbf{7.5}$ (ve $|DC| = 10.5$).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — Gölge problemi</div><div class="example-body"><strong>2 m'lik bir direk 3 m gölge düşürüyor. Günün aynı anında bir bina 45 m gölge düşürüyor. Bina ne kadar uzun?</strong><br><br>İki dik üçgenin benzerliğiyle: $\\dfrac{\\text{bina b}}{45} = \\dfrac{2}{3} \\implies \\text{bina b} = 45 \\cdot \\dfrac{2}{3} = \\mathbf{30\\,\\text{m}}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — Hacim ölçeklemesi</div><div class="example-body"><strong>Bir oyuncak araba, gerçek arabanın 1:18 ölçeğinde yapılmış. Gerçek arabanın 50 L'lik yakıt deposu varsa, oyuncaktaki karşılık gelen hacim nedir?</strong><br><br>Hacim oranı: $\\left(\\dfrac{1}{18}\\right)^3 = \\dfrac{1}{5832}$.<br><br>Oyuncak hacmi $= \\dfrac{50}{5832} \\approx \\mathbf{0.0086\\,\\text{L}} \\approx 8.6\\,\\text{mL}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — Benzerlik ve Thales birleşimi</div><div class="example-body"><strong>$\\triangle ABC$'de, $BC$'ye paralel bir $DE$ doğru parçası üçgeni iki bölgeye ayırır: küçük bir üçgen $ADE$ ve bir yamuk $DBCE$. $|AD|/|AB| = 2/3$ ise, yamuğun alanının $\\triangle ABC$'nin alanına oranını bul.</strong><br><br>Thales'e göre, $\\triangle ADE \\sim \\triangle ABC$ ve $k = 2/3$.<br><br>Alan oranı: $\\dfrac{\\text{Alan}(ADE)}{\\text{Alan}(ABC)} = k^2 = \\dfrac{4}{9}$.<br><br>Yamuk alanı $=$ büyük alan $-$ küçük alan $\\implies$ oran $= 1 - \\dfrac{4}{9} = \\mathbf{\\dfrac{5}{9}}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İki üçgen, karşılıklı açılar eşit VE karşılıklı kenarlar orantılı olduğunda benzerdir (~)</li>
<li>Köşelerin sırası önemlidir: $\\triangle ABC \\sim \\triangle DEF$, A↔D, B↔E, C↔F anlamına gelir</li>
<li>Üç benzerlik testi: AA (iki açı), SAS (iki kenar + kapsanan açı), SSS (üç kenar oranı eşit)</li>
<li>Benzerlik oranı k, tüm karşılıklı uzunluklara uygulanır (kenarlar, yükseklikler, kenarortaylar, çevreler)</li>
<li>Benzer figürlerin alan oranı $k^2$; benzer cisimlerin hacim oranı $k^3$</li>
<li>Thales teoremi: bir kenara paralel bir doğru, diğer iki kenarı orantılı parçalara böler</li>
<li>Açıortay teoremi: iç açıortay, karşı kenarı komşu kenarların oranında böler</li>
<li>Dolaylı ölçüm (gölge problemi), paralel güneş ışınları benzer dik üçgenler oluşturduğu için işler</li>
</ul>
</div>`
};
