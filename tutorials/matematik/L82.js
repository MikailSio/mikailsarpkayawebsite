window.LISE_MAT_L82 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Geometry, in its high-school sense, begins with two shapes: the angle and the triangle.</strong> Everything else — circles, polygons, area formulas, trigonometry, even the Pythagorean theorem you are about to revisit — is built on top of these two ideas. An angle measures the amount of opening between two rays meeting at a point; a triangle is the simplest closed shape one can draw with straight edges. Once we understand how angles add up and how the three sides of a triangle constrain each other, we have the vocabulary to attack almost any plane-geometry problem in your textbook.</p>

<p class="l-text">This lesson does not introduce trigonometric functions. Those wait for the trigonometry sequence (L1 and onwards). What we do here is collect the angle and triangle facts that you will use as <em>given</em> in later problems: complementary and supplementary angles, vertical angles, the corresponding-angle rule for parallel lines and a transversal, the interior-angle sum of a triangle, the triangle inequality, the standard classifications of triangles by side and angle, the Pythagorean theorem in its plain geometric form, and the four classical "centres" of a triangle. Get fluent with these and the next 30 lessons of geometry feel like applications rather than fresh material.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Name the six angle types (acute, right, obtuse, straight, reflex, full) and read their degree ranges off a diagram</li>
<li>Use complementary, supplementary, and vertical-angle relations to find unknown angles in mixed figures</li>
<li>Apply the parallel-lines + transversal rules: corresponding, alternate interior, and co-interior angles</li>
<li>Use the 180&deg; interior-angle sum of a triangle and the exterior-angle theorem to solve for unknown angles</li>
<li>Test the triangle inequality $a + b > c$ to decide whether three lengths can form a triangle</li>
<li>Classify triangles by side (scalene / isosceles / equilateral) and by angle (acute / right / obtuse)</li>
<li>State the Pythagorean theorem and locate the centroid, incenter, circumcenter, and orthocenter</li>
</ul>
</div>

<h2 class="lesson-title">1. The Six Types of Angles</h2>

<div class="calc-highlight"><strong>The first thing you do with an angle is name it.</strong> Geometry gives every degree range its own label so that proofs and problem statements can be unambiguous. Six labels cover every angle between 0&deg; and 360&deg;.</div>

<p class="l-text">An <strong>angle</strong> is formed by two rays sharing a common endpoint, the <em>vertex</em>. Its measure is the amount of rotation taking one ray onto the other, expressed in degrees (for high-school work) or radians (later, in trigonometry). The six standard types are defined entirely by where the measure falls in the interval $[0^\\circ, 360^\\circ]$.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Name</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Measure</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Picture cue</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Acute</strong></td><td style="padding:0.5rem 0.8rem">$0^\\circ < \\theta < 90^\\circ$</td><td style="padding:0.5rem 0.8rem">Sharper than a corner — like the tip of a pencil</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Right</strong></td><td style="padding:0.5rem 0.8rem">$\\theta = 90^\\circ$</td><td style="padding:0.5rem 0.8rem">Corner of a book or sheet of paper. Marked with a small square</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Obtuse</strong></td><td style="padding:0.5rem 0.8rem">$90^\\circ < \\theta < 180^\\circ$</td><td style="padding:0.5rem 0.8rem">Wider than a corner but still bent — like a half-open door</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Straight</strong></td><td style="padding:0.5rem 0.8rem">$\\theta = 180^\\circ$</td><td style="padding:0.5rem 0.8rem">A straight line; the two rays point in opposite directions</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Reflex</strong></td><td style="padding:0.5rem 0.8rem">$180^\\circ < \\theta < 360^\\circ$</td><td style="padding:0.5rem 0.8rem">More than a straight line, less than a full turn</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Full</strong></td><td style="padding:0.5rem 0.8rem">$\\theta = 360^\\circ$</td><td style="padding:0.5rem 0.8rem">A complete revolution — back to start</td></tr>
</tbody></table>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Acute vs obtuse</div><div class="card-body">The dividing line is exactly 90&deg;. Anything below is acute, anything above (up to 180&deg;) is obtuse. The right angle is the boundary case — neither acute nor obtuse.</div></div>
<div class="calc-card"><div class="card-title">Reflex angles in real life</div><div class="card-body">When you open a folder more than half-way, the gap behind the spine is a reflex angle. Inside a star polygon, the "inward" angles are reflex.</div></div>
<div class="calc-card"><div class="card-title">Why 180&deg; and 360&deg; matter</div><div class="card-body">180&deg; is the angle sum inside any triangle (Section 6) and the total along a straight line. 360&deg; is the angle sum around any point and a full rotation.</div></div>
</div>

<div class="l-note"><strong>Notation tip.</strong> A right angle is marked with a tiny square in the corner, never an arc. All other angles are marked with one or more arcs. Two equal angles in the same figure are usually marked with the <em>same</em> number of arcs so the reader knows they are equal.</div>

<h2 class="lesson-title">2. Complementary and Supplementary Angles</h2>

<div class="calc-highlight"><strong>Two angles can be related by adding up to a specific total.</strong> The two relations that come up constantly are complementary (sum to 90&deg;) and supplementary (sum to 180&deg;). If you know one of the two, you instantly know the other by subtraction.</div>

<div class="calc-formula"><div class="formula-label">COMPLEMENTARY AND SUPPLEMENTARY</div><div class="formula-main">$$\\alpha + \\beta = 90^\\circ \\;\\Longleftrightarrow\\; \\text{complementary} \\qquad\\qquad \\alpha + \\beta = 180^\\circ \\;\\Longleftrightarrow\\; \\text{supplementary}$$</div><div class="formula-sub">Memory hook: <em>C</em>omplement matches the <em>C</em>orner (90&deg;); <em>S</em>upplement matches the <em>S</em>traight line (180&deg;).</div></div>

<p class="l-text">Complementary angles often appear together inside a right angle: split the right angle with one extra ray and you get two complementary pieces. Supplementary angles appear along a straight line: pick any point on a line, draw a ray from it, and you get two supplementary angles on opposite sides of that ray.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">An angle measures 37&deg;. Find its complement and its supplement.<br><br>Complement: $90^\\circ - 37^\\circ = \\mathbf{53^\\circ}$.<br>Supplement: $180^\\circ - 37^\\circ = \\mathbf{143^\\circ}$.<br><br>Check: a 37&deg; angle is acute, its complement (53&deg;) is also acute, and its supplement (143&deg;) is obtuse. That pattern always holds: the supplement of any acute angle is obtuse and vice versa.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Two angles are complementary. One is twice the other. Find both.<br><br>Let the smaller angle be $x$. Then the larger is $2x$ and $x + 2x = 90^\\circ$, so $3x = 90^\\circ$, $x = 30^\\circ$.<br><br>The angles are <strong>30&deg; and 60&deg;</strong>. (Notice these are exactly the two non-right angles of a 30-60-90 triangle.)</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">An angle is its own complement. What is its measure? (Set $x + x = 90^\\circ$ so $x = 45^\\circ$. The 45&deg; angle is the unique self-complementary one.) Similarly, the self-supplementary angle is 90&deg;.</div></div>

<h2 class="lesson-title">3. Vertical Angles</h2>

<div class="calc-highlight"><strong>When two straight lines cross, they form four angles around the crossing point.</strong> The two angles opposite each other across the crossing are always equal. They are called <em>vertical angles</em> (or "opposite angles"). The other pair are also vertical angles and equal to each other.</div>

<p class="l-text">Two lines crossing at a point produce four angles, which we can label 1, 2, 3, 4 going around the crossing. Angle 1 and angle 3 are opposite — that is one pair of vertical angles. Angle 2 and angle 4 are the other pair. Because each pair of adjacent angles (1 and 2, or 2 and 3) sit on a straight line and must sum to 180&deg;, a quick algebraic argument forces opposite angles to be equal:</p>

<div class="calc-formula"><div class="formula-label">VERTICAL ANGLE THEOREM</div><div class="formula-main">$$\\angle 1 = \\angle 3 \\qquad\\text{and}\\qquad \\angle 2 = \\angle 4$$</div><div class="formula-sub">Proof sketch: $\\angle 1 + \\angle 2 = 180^\\circ$ (straight line) and $\\angle 2 + \\angle 3 = 180^\\circ$ (another straight line). Subtract: $\\angle 1 - \\angle 3 = 0$, so $\\angle 1 = \\angle 3$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Two lines cross. One of the four angles measures 110&deg;. Find the other three.<br><br>The angle opposite to 110&deg; is its vertical pair, also <strong>110&deg;</strong>.<br>The two adjacent angles each share a straight line with the 110&deg; one, so each is $180^\\circ - 110^\\circ = \\mathbf{70^\\circ}$.<br>Verify: $110 + 110 + 70 + 70 = 360^\\circ$, which is the angle sum around any point.</div></div>

<div class="l-note"><strong>Why this is so useful.</strong> Most geometry problems give you only one or two angle measures and expect you to chase the rest through the figure. Vertical angles are usually the first move: <em>any time two lines cross, draw an arc on each angle and copy the known value across to its opposite</em>.</div>

<h2 class="lesson-title">4. Parallel Lines Cut by a Transversal</h2>

<div class="calc-highlight"><strong>This is the most-tested topic in high-school angle geometry.</strong> Take two parallel lines and a third line cutting across both. The third line is called a <em>transversal</em>. The eight angles it creates fall into three named relationships, each one telling you that certain pairs are equal or supplementary.</div>

<p class="l-text">Draw two horizontal parallel lines $\\ell_1$ and $\\ell_2$ and a transversal $t$ crossing both at an angle. The transversal makes four angles with each line, eight in total. Number them 1, 2, 3, 4 at the upper crossing and 5, 6, 7, 8 at the lower crossing, going CCW from the upper-right at each point.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Corresponding angles</div><div class="card-body">Same position relative to each crossing (e.g. both upper-right). Equal in pairs: $\\angle 1 = \\angle 5$, $\\angle 2 = \\angle 6$, $\\angle 3 = \\angle 7$, $\\angle 4 = \\angle 8$.</div></div>
<div class="calc-card"><div class="card-title">Alternate interior angles</div><div class="card-body">Between the two parallel lines, on opposite sides of the transversal. Equal: $\\angle 3 = \\angle 5$ and $\\angle 4 = \\angle 6$.</div></div>
<div class="calc-card"><div class="card-title">Co-interior (consecutive interior) angles</div><div class="card-body">Between the two parallel lines, on the <em>same</em> side of the transversal. Supplementary: $\\angle 3 + \\angle 6 = 180^\\circ$ and $\\angle 4 + \\angle 5 = 180^\\circ$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PARALLEL-TRANSVERSAL RULES</div><div class="formula-main">$$\\text{Corresponding: equal} \\quad|\\quad \\text{Alternate interior: equal} \\quad|\\quad \\text{Co-interior: sum} = 180^\\circ$$</div><div class="formula-sub">All three rules require the two lines to be parallel. If they are not parallel, none of the equalities hold.</div></div>

<div class="calc-graph"><div id="plot-l82-parallel-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two parallel horizontal lines crossed by a transversal at 60&deg;. The eight angles are numbered 1&ndash;8. Pairs of the same colour are equal (corresponding or alternate interior). The 60&deg; and 120&deg; values are marked at every angle so you can verify all three rules at once.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var L1up={x:[-3,3],y:[1.2,1.2],mode:'lines',name:'parallel ℓ₁',line:{color:'rgba(255,255,255,0.55)',width:2}};
var L1lo={x:[-3,3],y:[-1.2,-1.2],mode:'lines',name:'parallel ℓ₂',line:{color:'rgba(255,255,255,0.55)',width:2}};
var slope=Math.tan(Math.PI/3);
var xTop=1.2/slope,xBot=-1.2/slope;
var transEN={x:[xBot-1.0,xTop+1.0],y:[-1.2-slope*1.0,1.2+slope*1.0],mode:'lines',name:'transversal t',line:{color:'#3b82f6',width:2.5}};
var labels={x:[xTop+0.3,xTop-0.3,xTop-0.3,xTop+0.3,xBot+0.3,xBot-0.3,xBot-0.3,xBot+0.3],y:[1.5,1.5,0.9,0.9,-0.9,-0.9,-1.5,-1.5],mode:'text',name:'angle labels',text:['1:120°','2:60°','3:120°','4:60°','5:120°','6:60°','7:120°','8:60°'],textfont:{color:['#f59e0b','#10b981','#f59e0b','#10b981','#f59e0b','#10b981','#f59e0b','#10b981'],size:11}};
var ptsEN={x:[xTop,xBot],y:[1.2,-1.2],mode:'markers',name:'crossings',marker:{color:'#3b82f6',size:8}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-2.2,2.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l82-parallel-en',[L1up,L1lo,transEN,ptsEN,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Two parallel lines are cut by a transversal. One of the eight angles measures 65&deg;. Find the size of every other angle.<br><br>The angle vertical to the 65&deg; one is also 65&deg;.<br>The two angles on the same straight line as the 65&deg; one are $180 - 65 = 115^\\circ$ each (supplementary).<br>The same pattern repeats at the lower crossing because of the corresponding-angle rule: four of the eight angles are 65&deg; and the other four are 115&deg;.<br><br>Pattern: <strong>only two distinct angle measures appear, and they are supplementary</strong>.</div></div>

<div class="l-note"><strong>Working backwards.</strong> The three rules are also tests for parallelism: if you can find a pair of corresponding angles that are equal, the two lines <em>must</em> be parallel. This is how proofs in plane geometry often establish that two lines do not meet.</div>

<h2 class="lesson-title">5. The Triangle: Sides, Angles, and the 180&deg; Rule</h2>

<div class="calc-highlight"><strong>A triangle is the simplest closed figure with straight sides.</strong> Three vertices, three sides, three interior angles. The single most useful fact about triangles is that their interior angles always add to 180&deg; — no matter the shape, no matter the size.</div>

<p class="l-text">Label the vertices $A$, $B$, $C$ and the sides opposite to them $a$, $b$, $c$ (so side $a$ is opposite vertex $A$, and so on). The three interior angles are $\\angle A$, $\\angle B$, $\\angle C$. The fundamental relation is:</p>

<div class="calc-formula"><div class="formula-label">INTERIOR-ANGLE SUM OF A TRIANGLE</div><div class="formula-main">$$\\angle A + \\angle B + \\angle C \\;=\\; 180^\\circ$$</div><div class="formula-sub">A direct consequence of the parallel-lines rules from Section 4: draw a line through one vertex parallel to the opposite side, and the three angles at that vertex (interior plus two alternate-interior copies) form a straight line.</div></div>

<p class="l-text"><strong>Proof sketch.</strong> Through vertex $A$, draw a line parallel to side $BC$. The three angles at $A$ (the two "leaked" alternate-interior copies of $\\angle B$ and $\\angle C$ plus the original $\\angle A$) sit along a straight line, so they sum to 180&deg;. But each leaked copy equals its original interior angle by the alternate-interior rule. Hence $\\angle A + \\angle B + \\angle C = 180^\\circ$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Two angles of a triangle are 42&deg; and 73&deg;. Find the third.<br><br>$\\angle C = 180^\\circ - 42^\\circ - 73^\\circ = \\mathbf{65^\\circ}$.<br><br>Sanity check: 65&deg; is acute, and so are the other two, so the triangle is an acute triangle (Section 8).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">A triangle's angles are in the ratio 2:3:5. Find each one.<br><br>Let the angles be $2k$, $3k$, $5k$. Then $2k + 3k + 5k = 180^\\circ$, so $10k = 180^\\circ$ and $k = 18^\\circ$.<br><br>Angles: <strong>36&deg;, 54&deg;, 90&deg;</strong>. The 90&deg; makes this a right triangle.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Can a triangle have two right angles? (No: two right angles already sum to 180&deg;, leaving 0&deg; for the third — impossible.) Can it have two obtuse angles? (No: two angles greater than 90&deg; already sum to more than 180&deg;.) Therefore every triangle has at most one right angle and at most one obtuse angle.</div></div>

<h2 class="lesson-title">6. Exterior Angle of a Triangle</h2>

<div class="calc-highlight"><strong>Extend one side of a triangle past a vertex.</strong> The angle between the extension and the adjacent side is called the <em>exterior angle</em> at that vertex. It equals the sum of the two non-adjacent (remote) interior angles. This is one of the handiest shortcuts in plane geometry.</div>

<div class="calc-formula"><div class="formula-label">EXTERIOR-ANGLE THEOREM</div><div class="formula-main">$$\\text{exterior angle at } C \\;=\\; \\angle A + \\angle B$$</div><div class="formula-sub">The exterior angle equals the sum of the two interior angles at the other two vertices. Direct corollary of the 180&deg; sum: interior angle at $C$ + exterior angle at $C$ = 180&deg;, and interior angle at $C$ = 180&deg; &minus; $\\angle A$ &minus; $\\angle B$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">In a triangle, $\\angle A = 50^\\circ$ and $\\angle B = 70^\\circ$. Find the exterior angle at vertex $C$.<br><br>By the theorem: exterior angle at $C = 50^\\circ + 70^\\circ = \\mathbf{120^\\circ}$.<br><br>Verify: interior angle at $C$ is $180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$, and $60^\\circ + 120^\\circ = 180^\\circ$ as the two angles share a straight line.</div></div>

<div class="l-note"><strong>Common mistake.</strong> Students sometimes confuse the exterior angle with the vertical angle on the other side of the vertex. The exterior angle is the one <em>supplementary</em> to the interior angle, not vertical to it. A clean picture with the extended side drawn makes this unambiguous.</div>

<h2 class="lesson-title">7. The Triangle Inequality</h2>

<div class="calc-highlight"><strong>Not every triple of positive numbers forms a triangle.</strong> The three lengths must satisfy the triangle inequality: the sum of any two sides exceeds the third. If the inequality fails (or only ties), the three segments either lie flat on a line or can't close up at all.</div>

<div class="calc-formula"><div class="formula-label">TRIANGLE INEQUALITY</div><div class="formula-main">$$a + b > c, \\qquad b + c > a, \\qquad a + c > b$$</div><div class="formula-sub">All three inequalities must hold strictly. If one of them becomes an equality, the three points are collinear (a degenerate triangle of zero area).</div></div>

<p class="l-text"><strong>Geometric meaning.</strong> A triangle has to "close up": starting at $A$, walk along side $c$ to $B$, then along side $a$ to $C$, then back along side $b$ to $A$. If $b$ is shorter than the straight-line distance from $C$ to $A$ (which is at most $a + c$), the triangle is impossible. The inequality enforces exactly this geometric closure condition.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Can a triangle have sides 3, 4, 5?<br><br>Check all three inequalities: $3 + 4 = 7 > 5$ ✓, $4 + 5 = 9 > 3$ ✓, $3 + 5 = 8 > 4$ ✓.<br><br>Yes — and not only that, $3^2 + 4^2 = 9 + 16 = 25 = 5^2$, so it is a right triangle (the famous 3-4-5 triple from Section 9).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Can a triangle have sides 1, 1, 3?<br><br>Check: $1 + 1 = 2 < 3$. The inequality fails on the first try.<br><br>No — the two unit segments together are shorter than the segment of length 3, so they cannot bridge from one end to the other.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Two sides of a triangle are 7 and 10. What are the possible values of the third side?<br><br>Let the third side be $x$. The three inequalities are $7 + 10 > x$, $7 + x > 10$, $10 + x > 7$. The third is automatic for any positive $x$. The first two give $x < 17$ and $x > 3$.<br><br>Allowed range: <strong>$3 < x < 17$</strong>.</div></div>

<div class="think-box"><div class="think-label">QUICK RULE</div><div class="think-body">For a triangle with two known sides $a, b$ (say $a \\geq b$), the third side $c$ must satisfy $a - b < c < a + b$. Memorise this two-inequality form — it is faster than checking all three triangle inequalities separately.</div></div>

<h2 class="lesson-title">8. Classifying Triangles</h2>

<div class="calc-highlight"><strong>Triangles get two independent labels: one based on sides, one based on angles.</strong> Together they pin down the "type" of a triangle precisely. Many later theorems (like the isosceles triangle theorem, or the Pythagorean theorem) only apply to a specific type.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BY SIDES</div><div class="compare-item"><strong>Scalene</strong>: all three sides different lengths</div><div class="compare-item"><strong>Isosceles</strong>: at least two sides equal (the base angles opposite the equal sides are equal too)</div><div class="compare-item"><strong>Equilateral</strong>: all three sides equal (and consequently all three angles equal to 60&deg;)</div></div><div class="compare-col"><div class="compare-title">BY ANGLES</div><div class="compare-item"><strong>Acute</strong>: all three angles less than 90&deg;</div><div class="compare-item"><strong>Right</strong>: exactly one angle equals 90&deg; (and the other two are complementary)</div><div class="compare-item"><strong>Obtuse</strong>: exactly one angle greater than 90&deg;</div></div></div>

<p class="l-text">Combinations are possible. An <em>isosceles right triangle</em> has two legs of equal length and a 90&deg; angle between them — its three angles are 45-45-90. An <em>equilateral triangle</em> is automatically acute (all three angles are 60&deg;). A <em>scalene obtuse</em> triangle has three distinct sides and one angle greater than 90&deg;.</p>

<div class="calc-graph"><div id="plot-l82-classify-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> six triangles in a 2&times;3 grid. Top row: scalene, isosceles, equilateral (classified by sides). Bottom row: acute, right, obtuse (classified by angles). The right triangle's 90&deg; corner is marked with a small square; the equilateral triangle has all three sides drawn equal.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function tri(cx,cy,pts,color,name){var xs=[],ys=[];for(var i=0;i<pts.length;i++){xs.push(cx+pts[i][0]);ys.push(cy+pts[i][1]);}xs.push(cx+pts[0][0]);ys.push(cy+pts[0][1]);return{x:xs,y:ys,mode:'lines',name:name,line:{color:color,width:2.5},fill:'toself',fillcolor:color.replace('rgb','rgba').replace(')',',0.12)')};}
var dx=3.6,dy=3.2;
var scalene=tri(-dx,dy,[[0,1.2],[1.3,-0.6],[-1.0,-0.6]],'rgb(59,130,246)','scalene');
var isos=tri(0,dy,[[0,1.2],[1.0,-0.6],[-1.0,-0.6]],'rgb(16,185,129)','isosceles');
var equil=tri(dx,dy,[[0,1.15],[1.0,-0.575],[-1.0,-0.575]],'rgb(245,158,11)','equilateral');
var acute=tri(-dx,-dy,[[0,1.1],[0.9,-0.6],[-1.05,-0.6]],'rgb(139,92,246)','acute');
var rightT=tri(0,-dy,[[-0.8,-0.6],[0.9,-0.6],[-0.8,1.0]],'rgb(236,72,153)','right');
var obtuse=tri(dx,-dy,[[-1.3,-0.5],[1.3,-0.5],[0.6,0.5]],'rgb(239,68,68)','obtuse');
var rmark={x:[-0.8+0.2,-0.65+0.2,-0.65+0.2,-0.65,-0.65],y:[-0.6-dy,-0.6-dy,-0.45-dy,-0.45-dy,-0.6-dy],mode:'lines',line:{color:'rgba(236,72,153,0.9)',width:1.5},showlegend:false};
var labs={x:[-dx,0,dx,-dx,0,dx],y:[dy+1.7,dy+1.7,dy+1.7,-dy+1.6,-dy+1.6,-dy+1.6],mode:'text',text:['Scalene','Isosceles','Equilateral','Acute','Right (90°)','Obtuse'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-5.5,5.5],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.05)',scaleanchor:'y',scaleratio:1,visible:false},yaxis:{range:[-5,5.5],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.05)',visible:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l82-classify-en',[scalene,isos,equil,acute,rightT,obtuse,rmark,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Isosceles theorem.</strong> If two sides of a triangle are equal, the two angles opposite those sides are also equal (the base angles). The converse is also true. This is the workhorse fact behind almost every "find the angle" problem involving an isosceles triangle.</div>

<h2 class="lesson-title">9. The Pythagorean Theorem</h2>

<div class="calc-highlight"><strong>For a right triangle</strong> with legs $a$ and $b$ (the two sides adjacent to the right angle) and hypotenuse $c$ (the side opposite the right angle, always the longest), the squares of the leg lengths add to the square of the hypotenuse. This is the Pythagorean theorem, the most famous identity in school geometry.</div>

<div class="calc-formula"><div class="formula-label">PYTHAGOREAN THEOREM</div><div class="formula-main">$$a^2 + b^2 \\;=\\; c^2 \\quad\\text{(right triangle, } c \\text{ = hypotenuse)}$$</div><div class="formula-sub">The converse also holds: if the three sides of a triangle satisfy $a^2 + b^2 = c^2$, then the angle opposite $c$ is a right angle.</div></div>

<p class="l-text"><strong>Pythagorean triples.</strong> Three integers $(a, b, c)$ with $a^2 + b^2 = c^2$ are called a Pythagorean triple. The most famous are $(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$, and $(7, 24, 25)$. All scaled copies — $(6, 8, 10)$, $(9, 12, 15)$, ... — work too. These triples come up so often that having a few memorised saves time in exams.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">A right triangle has legs 6 and 8. Find the hypotenuse.<br><br>$c^2 = 6^2 + 8^2 = 36 + 64 = 100$, so $c = 10$. (Recognise $(6, 8, 10) = 2 \\times (3, 4, 5)$.)<br><br>Hypotenuse: <strong>10</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">A right triangle has hypotenuse 13 and one leg 5. Find the other leg.<br><br>Let the unknown leg be $b$. Then $5^2 + b^2 = 13^2$, so $b^2 = 169 - 25 = 144$, $b = 12$. (Triple $(5, 12, 13)$.)<br><br>Other leg: <strong>12</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Is the triangle with sides $(8, 15, 17)$ a right triangle?<br><br>Check $8^2 + 15^2 = 64 + 225 = 289 = 17^2$. Yes ✓ — and the right angle is opposite the longest side (17).</div></div>

<div class="l-note"><strong>Looking ahead.</strong> The Pythagorean theorem will be your gateway into trigonometry. Once you place a right triangle in a coordinate system with the right angle at the origin, the legs become $x$ and $y$ coordinates and the hypotenuse becomes the distance $\\sqrt{x^2+y^2}$. From there the sine, cosine, and tangent fall out naturally (Lesson 1 of the trigonometry sequence).</div>

<h2 class="lesson-title">10. The Four Centres of a Triangle</h2>

<div class="calc-highlight"><strong>Every triangle has four classical "centres",</strong> each defined by intersecting a specific kind of line. They all sit somewhere inside (or just outside) the triangle and each has its own geometric meaning. You should at least recognise the names and constructions.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Centroid</div><div class="card-body">Intersection of the three <em>medians</em> (each median connects a vertex to the midpoint of the opposite side). The centroid is the centre of mass of the triangle — balance the triangle on a pin here and it stays level. Divides each median in a 2:1 ratio (vertex side longer).</div></div>
<div class="calc-card"><div class="card-title">Incenter</div><div class="card-body">Intersection of the three <em>angle bisectors</em>. The incenter is equidistant from all three sides and is the centre of the inscribed circle (the largest circle that fits inside).</div></div>
<div class="calc-card"><div class="card-title">Circumcenter</div><div class="card-body">Intersection of the three <em>perpendicular bisectors</em> of the sides. The circumcenter is equidistant from all three vertices and is the centre of the circumscribed circle (the smallest circle containing the triangle).</div></div>
<div class="calc-card"><div class="card-title">Orthocenter</div><div class="card-body">Intersection of the three <em>altitudes</em> (each altitude is a perpendicular from a vertex to the line containing the opposite side). Inside acute triangles, at the right-angle vertex of right triangles, outside obtuse triangles.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EULER LINE</div><div class="formula-main">$$\\text{centroid, circumcenter, orthocenter are collinear}$$</div><div class="formula-sub">In any non-equilateral triangle, three of the four centres (centroid $G$, circumcenter $O$, orthocenter $H$) all lie on a single line called the Euler line, and $OG : GH = 1 : 2$. The incenter is generally <em>not</em> on this line.</div></div>

<div class="calc-graph"><div id="plot-l82-centers-en" class="plotly-graph" style="height:500px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a sample acute triangle with all four classical centres marked: centroid (blue), incenter (green), circumcenter (orange), and orthocenter (red). The three medians, three angle bisectors, perpendicular bisectors of sides, and altitudes are drawn faintly for reference.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var A=[-2,-1],B=[3,-0.5],C=[0.5,2.5];
function mid(P,Q){return[(P[0]+Q[0])/2,(P[1]+Q[1])/2];}
var M_a=mid(B,C),M_b=mid(A,C),M_c=mid(A,B);
var triEN={x:[A[0],B[0],C[0],A[0]],y:[A[1],B[1],C[1],A[1]],mode:'lines',name:'triangle ABC',line:{color:'rgba(255,255,255,0.65)',width:2.5}};
var medA={x:[A[0],M_a[0]],y:[A[1],M_a[1]],mode:'lines',name:'medians',line:{color:'rgba(59,130,246,0.4)',width:1.2,dash:'dot'}};
var medB={x:[B[0],M_b[0]],y:[B[1],M_b[1]],mode:'lines',line:{color:'rgba(59,130,246,0.4)',width:1.2,dash:'dot'},showlegend:false};
var medC_={x:[C[0],M_c[0]],y:[C[1],M_c[1]],mode:'lines',line:{color:'rgba(59,130,246,0.4)',width:1.2,dash:'dot'},showlegend:false};
var Gx=(A[0]+B[0]+C[0])/3,Gy=(A[1]+B[1]+C[1])/3;
var centroidEN={x:[Gx],y:[Gy],mode:'markers+text',name:'Centroid G',marker:{color:'#3b82f6',size:12},text:['G'],textposition:'top right',textfont:{color:'#3b82f6',size:13}};
function dist(P,Q){return Math.sqrt((P[0]-Q[0])*(P[0]-Q[0])+(P[1]-Q[1])*(P[1]-Q[1]));}
var a=dist(B,C),b=dist(A,C),c=dist(A,B);
var Ix=(a*A[0]+b*B[0]+c*C[0])/(a+b+c);
var Iy=(a*A[1]+b*B[1]+c*C[1])/(a+b+c);
var incenterEN={x:[Ix],y:[Iy],mode:'markers+text',name:'Incenter I',marker:{color:'#10b981',size:12},text:['I'],textposition:'bottom right',textfont:{color:'#10b981',size:13}};
function perpBisect(P,Q){var m=mid(P,Q);var dx=Q[0]-P[0],dy=Q[1]-P[1];var L=2.0;var nx=-dy,ny=dx;var nl=Math.sqrt(nx*nx+ny*ny);nx/=nl;ny/=nl;return{x:[m[0]-L*nx,m[0]+L*nx],y:[m[1]-L*ny,m[1]+L*ny]};}
var pb_a=perpBisect(B,C),pb_b=perpBisect(A,C),pb_c=perpBisect(A,B);
var pba={x:pb_a.x,y:pb_a.y,mode:'lines',name:'perp bisectors',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dash'}};
var pbb={x:pb_b.x,y:pb_b.y,mode:'lines',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dash'},showlegend:false};
var pbc={x:pb_c.x,y:pb_c.y,mode:'lines',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dash'},showlegend:false};
function circ(A,B,C){var ax=A[0],ay=A[1],bx=B[0],by=B[1],cx=C[0],cy=C[1];var d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));var ux=((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d;var uy=((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d;return[ux,uy];}
var Ocirc=circ(A,B,C);
var circumcenterEN={x:[Ocirc[0]],y:[Ocirc[1]],mode:'markers+text',name:'Circumcenter O',marker:{color:'#f59e0b',size:12},text:['O'],textposition:'top left',textfont:{color:'#f59e0b',size:13}};
var Hx=A[0]+B[0]+C[0]-2*Ocirc[0],Hy=A[1]+B[1]+C[1]-2*Ocirc[1];
var orthEN={x:[Hx],y:[Hy],mode:'markers+text',name:'Orthocenter H',marker:{color:'#ef4444',size:12},text:['H'],textposition:'bottom left',textfont:{color:'#ef4444',size:13}};
var vlabels={x:[A[0]-0.25,B[0]+0.25,C[0]+0.1],y:[A[1]-0.25,B[1]-0.25,C[1]+0.25],mode:'text',text:['A','B','C'],textfont:{color:'rgba(255,255,255,0.8)',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-3.5,4.5],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.1)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-2.5,3.5],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.1)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l82-centers-en',[triEN,medA,medB,medC_,pba,pbb,pbc,centroidEN,incenterEN,circumcenterEN,orthEN,vlabels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Special case.</strong> In an equilateral triangle, all four centres coincide at a single point. As the triangle becomes more scalene, the centres separate from each other, and in degenerate (very flat) triangles they can drift far apart.</div>

<h2 class="lesson-title">11. Worked Problems</h2>

<p class="l-text">A mixed set of practice problems pulling together the ideas from Sections 1&ndash;10. Try each one yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SUPPLEMENT</div><div class="example-body"><strong>Find the supplement of 73&deg;.</strong><br><br>Supplement = $180^\\circ - 73^\\circ = \\mathbf{107^\\circ}$. It is obtuse, as expected (the supplement of any acute angle is obtuse).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; MISSING ANGLE OF A TRIANGLE</div><div class="example-body"><strong>A triangle has angles 48&deg; and 67&deg;. Find the third.</strong><br><br>$\\angle C = 180^\\circ - 48^\\circ - 67^\\circ = \\mathbf{65^\\circ}$. All three are acute, so the triangle is acute.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TRIANGLE INEQUALITY CHECK</div><div class="example-body"><strong>Decide whether the lengths $(3, 4, 5)$ and $(1, 1, 3)$ each form a triangle.</strong><br><br>$(3, 4, 5)$: $3 + 4 = 7 > 5$, $4 + 5 = 9 > 3$, $3 + 5 = 8 > 4$. All three inequalities hold strictly. <strong>Yes</strong> (and it is right-angled).<br><br>$(1, 1, 3)$: $1 + 1 = 2 < 3$. Fails immediately. <strong>No.</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; PARALLEL LINES</div><div class="example-body"><strong>Two parallel lines are cut by a transversal. One co-interior angle measures 110&deg;. Find the other co-interior angle.</strong><br><br>Co-interior angles are supplementary, so the other one is $180^\\circ - 110^\\circ = \\mathbf{70^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; EXTERIOR ANGLE</div><div class="example-body"><strong>In a triangle, two interior angles are 38&deg; and 71&deg;. Find the exterior angle at the third vertex.</strong><br><br>By the exterior-angle theorem: exterior angle = $38^\\circ + 71^\\circ = \\mathbf{109^\\circ}$.<br>Cross-check: third interior angle = $180^\\circ - 38^\\circ - 71^\\circ = 71^\\circ$. Interior + exterior = $71^\\circ + 109^\\circ = 180^\\circ$ ✓.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; PYTHAGORAS</div><div class="example-body"><strong>A right triangle has legs 9 and 12. Find the hypotenuse.</strong><br><br>$c^2 = 9^2 + 12^2 = 81 + 144 = 225$, so $c = 15$.<br>Notice this is $3 \\times (3, 4, 5) = (9, 12, 15)$ — a multiple of the most famous triple. <strong>Hypotenuse = 15</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; ISOSCELES TRIANGLE</div><div class="example-body"><strong>An isosceles triangle has an apex angle of 40&deg;. Find the two base angles.</strong><br><br>The base angles are equal (isosceles theorem). Let each base angle be $x$. Then $40^\\circ + 2x = 180^\\circ$, so $2x = 140^\\circ$ and $x = 70^\\circ$.<br>Base angles: <strong>70&deg; each</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; THIRD SIDE RANGE</div><div class="example-body"><strong>Two sides of a triangle measure 6 and 11. What are the integer values the third side can take?</strong><br><br>Need $|11 - 6| < x < 11 + 6$, i.e. $5 < x < 17$. Integer values: $\\mathbf{6, 7, 8, \\ldots, 16}$ — eleven values in total.</div></div>

<h2 class="lesson-title">12. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WHAT GOES WRONG</div><div class="compare-item"><strong>Forgetting the 180&deg; rule.</strong> Students sometimes guess the third angle of a triangle instead of subtracting from 180&deg;.</div><div class="compare-item"><strong>Mixing up vertex angle and exterior angle.</strong> The exterior angle is the supplement of the interior angle at the same vertex, not the vertical angle.</div><div class="compare-item"><strong>Forgetting to check all three triangle inequalities.</strong> A triple can pass two and fail the third.</div><div class="compare-item"><strong>Calling a triangle "right" without checking which side is the hypotenuse.</strong> The hypotenuse must be the longest side — always opposite the right angle.</div><div class="compare-item"><strong>Assuming parallel lines without justification.</strong> The corresponding-angle rule only holds if you have already shown the lines are parallel.</div></div><div class="compare-col"><div class="compare-title">HOW TO AVOID IT</div><div class="compare-item">Whenever you see a triangle, immediately write down $\\angle A + \\angle B + \\angle C = 180^\\circ$ before doing anything else.</div><div class="compare-item">Draw the extended side past the vertex when you are asked for an exterior angle. The picture removes the ambiguity.</div><div class="compare-item">Use the shortcut $|a - b| < c < a + b$ — checks all three inequalities at once.</div><div class="compare-item">Identify the hypotenuse <em>before</em> applying $a^2 + b^2 = c^2$. The hypotenuse is always opposite the 90&deg; angle.</div><div class="compare-item">Look for the "marker" — small arrows or "‖" symbols on the two lines that signal parallelism.</div></div></div>

<div class="l-note"><strong>Looking ahead.</strong> Lessons 83&ndash;86 build on these foundations: 83 covers triangle similarity (which uses the 180&deg; rule and the isosceles theorem repeatedly), 84 covers circles and inscribed angles (which uses the central-angle / inscribed-angle relationship), and 85&ndash;86 introduce special quadrilaterals and area formulas (which lean on the right-triangle Pythagoras setup).</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Six angle types: acute, right, obtuse, straight, reflex, full — sorted by their degree measure</li>
<li>Complementary pairs sum to 90&deg;; supplementary pairs sum to 180&deg;</li>
<li>Two crossing lines give two pairs of equal vertical (opposite) angles</li>
<li>Parallel + transversal: corresponding equal, alternate interior equal, co-interior supplementary</li>
<li>Triangle: three sides, three angles, interior angles sum to 180&deg;</li>
<li>Exterior angle of a triangle = sum of the two non-adjacent interior angles</li>
<li>Triangle inequality: $|a-b| < c < a+b$; check before assuming three lengths form a triangle</li>
<li>Classifications: by side (scalene / isosceles / equilateral) and by angle (acute / right / obtuse)</li>
<li>Right triangle: $a^2 + b^2 = c^2$ with $c$ the hypotenuse (longest side, opposite the right angle)</li>
<li>Four classical centres: centroid (medians), incenter (angle bisectors), circumcenter (perpendicular bisectors), orthocenter (altitudes)</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Lise düzeyinde geometri iki şekilden başlar: açı ve üçgen.</strong> Diğer her şey — çemberler, çokgenler, alan formülleri, trigonometri, hatta birazdan tekrar göreceğin Pisagor teoremi — bu iki fikrin üzerine kuruludur. Açı, bir noktada birleşen iki ışın arasındaki açıklık miktarını ölçer; üçgen ise düz kenarlarla çizilebilen en basit kapalı şekildir. Açıların nasıl toplandığını ve bir üçgenin üç kenarının birbirini nasıl kısıtladığını anladığımız anda, ders kitabındaki neredeyse her düzlem geometri problemine saldıracak söz dağarcığına sahip oluruz.</p>

<p class="l-text">Bu ders trigonometrik fonksiyonları tanıtmıyor. Onlar trigonometri serisini (L1 ve sonrası) bekliyor. Burada yaptığımız şey, sonraki problemlerde <em>verili</em> olarak kullanacağın açı ve üçgen olgularını toplamaktır: tümler ve bütünler açılar, ters açılar, paralel iki doğru ve bir keseni için karşılık gelen açı kuralı, bir üçgenin iç açıları toplamı, üçgen eşitsizliği, kenarlara ve açılara göre üçgenlerin standart sınıflamaları, sade geometrik biçimiyle Pisagor teoremi ve bir üçgenin dört klasik "merkezi". Bunlarda akıcı hale gel ve sonraki 30 geometri dersi yeni malzeme yerine uygulama gibi gelsin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Altı açı türünü (dar, dik, geniş, doğru, geniş-tam, tam) adlandırmayı ve derece aralıklarını şekilden okumayı</li>
<li>Tümler, bütünler ve ters açı ilişkilerini kullanarak karışık şekillerde bilinmeyen açıları bulmayı</li>
<li>Paralel doğrular + kesen kurallarını uygulamayı: karşılık gelen, ters iç ve aynı taraftaki iç açılar</li>
<li>Bir üçgenin 180&deg;'lik iç açı toplamını ve dış açı teoremini kullanarak bilinmeyen açıları çözmeyi</li>
<li>Üç uzunluğun bir üçgen oluşturup oluşturmadığını anlamak için üçgen eşitsizliği $a + b > c$'yi sınamayı</li>
<li>Üçgenleri kenarlarına (çeşitkenar / ikizkenar / eşkenar) ve açılarına (dar açılı / dik açılı / geniş açılı) göre sınıflandırmayı</li>
<li>Pisagor teoremini ifade etmeyi ve ağırlık merkezini, iç teğet, çevrel ve diklik merkezini yerleştirmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Altı Açı Türü</h2>

<div class="calc-highlight"><strong>Bir açıyla ilk yapacağın şey ona isim vermektir.</strong> Geometri her derece aralığına kendi etiketini verir, böylece ispatlar ve problem ifadeleri belirsizlikten arınır. Altı etiket, 0&deg; ile 360&deg; arasındaki tüm açıları kapsar.</div>

<p class="l-text">Bir <strong>açı</strong>, ortak bir uç noktayı (köşeyi) paylaşan iki ışından oluşur. Ölçüsü, bir ışını diğerine taşıyan dönme miktarıdır; lise düzeyi için derece, ileride trigonometride radyan cinsinden yazılır. Altı standart tür, ölçünün $[0^\\circ, 360^\\circ]$ aralığında nereye düştüğüne göre tamamen tanımlanır.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ad</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ölçü</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Görsel ipucu</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Dar (acute)</strong></td><td style="padding:0.5rem 0.8rem">$0^\\circ < \\theta < 90^\\circ$</td><td style="padding:0.5rem 0.8rem">Bir köşeden daha keskin — bir kalem ucu gibi</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Dik (right)</strong></td><td style="padding:0.5rem 0.8rem">$\\theta = 90^\\circ$</td><td style="padding:0.5rem 0.8rem">Bir kitabın veya kağıt sayfanın köşesi. Küçük bir kare ile işaretlenir</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Geniş (obtuse)</strong></td><td style="padding:0.5rem 0.8rem">$90^\\circ < \\theta < 180^\\circ$</td><td style="padding:0.5rem 0.8rem">Köşeden geniş ama hâlâ kıvrık — yarı açık bir kapı gibi</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Doğru (straight)</strong></td><td style="padding:0.5rem 0.8rem">$\\theta = 180^\\circ$</td><td style="padding:0.5rem 0.8rem">Düz bir doğru; iki ışın zıt yönlere bakar</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Geniş-tam (reflex)</strong></td><td style="padding:0.5rem 0.8rem">$180^\\circ < \\theta < 360^\\circ$</td><td style="padding:0.5rem 0.8rem">Düz bir doğrudan büyük, tam turdan küçük</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Tam (full)</strong></td><td style="padding:0.5rem 0.8rem">$\\theta = 360^\\circ$</td><td style="padding:0.5rem 0.8rem">Tam bir devir — başlangıca dönüş</td></tr>
</tbody></table>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dar açıya karşı geniş açı</div><div class="card-body">Ayrım çizgisi tam olarak 90&deg;'dir. Altındaki her şey dardır, üstündeki (180&deg;'ye kadar) geniştir. Dik açı sınır durumdur — ne dar ne de geniştir.</div></div>
<div class="calc-card"><div class="card-title">Günlük hayatta geniş-tam açı</div><div class="card-body">Bir dosya kapağını yarıdan fazla açtığında, sırtın arkasındaki boşluk geniş-tam açıdır. Bir yıldız çokgeninin içinde, "içeri dönük" açılar geniş-tamdır.</div></div>
<div class="calc-card"><div class="card-title">180&deg; ve 360&deg; neden önemli</div><div class="card-body">180&deg; herhangi bir üçgenin iç açı toplamı (Bölüm 6) ve bir doğru üzerinde toplam açıdır. 360&deg; ise bir nokta etrafındaki toplam açıdır ve tam bir dönüştür.</div></div>
</div>

<div class="l-note"><strong>Gösterim notu.</strong> Dik açı, köşesinde ufak bir kare ile işaretlenir, asla bir yay ile değil. Diğer tüm açılar bir ya da daha fazla yay ile işaretlenir. Bir şekilde eşit olan iki açı genellikle <em>aynı</em> sayıda yay ile işaretlenir, böylece okuyucu eşit olduklarını bilir.</div>

<h2 class="lesson-title">2. Tümler ve Bütünler Açılar</h2>

<div class="calc-highlight"><strong>İki açı, belirli bir toplama kadar eklenerek birbirine bağlı olabilir.</strong> Sürekli karşımıza çıkan iki ilişki tümler (toplamları 90&deg;) ve bütünler (toplamları 180&deg;)'dir. İkisinden birini bilirsen, diğerini hemen çıkarma ile bulursun.</div>

<div class="calc-formula"><div class="formula-label">TÜMLER VE BÜTÜNLER</div><div class="formula-main">$$\\alpha + \\beta = 90^\\circ \\;\\Longleftrightarrow\\; \\text{tümler} \\qquad\\qquad \\alpha + \\beta = 180^\\circ \\;\\Longleftrightarrow\\; \\text{bütünler}$$</div><div class="formula-sub">Hafıza kancası: <em>Tüm</em>ler <em>tam</em> köşeyle (90&deg;) eşleşir; <em>büt</em>ünler ise <em>düz</em> doğru ile (180&deg;) eşleşir.</div></div>

<p class="l-text">Tümler açılar genellikle bir dik açının içinde birlikte görünür: dik açıyı fazladan bir ışınla bölersen iki tümler parça elde edersin. Bütünler açılar bir doğru üzerinde görünür: bir doğruda herhangi bir nokta seç, oradan bir ışın çiz; bu ışının iki tarafında iki bütünler açı oluşur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Bir açının ölçüsü 37&deg;'dir. Tümlerini ve bütünlerini bul.<br><br>Tümler: $90^\\circ - 37^\\circ = \\mathbf{53^\\circ}$.<br>Bütünler: $180^\\circ - 37^\\circ = \\mathbf{143^\\circ}$.<br><br>Kontrol: 37&deg; dar bir açıdır; tümleri (53&deg;) de dar açıdır; bütünleri (143&deg;) geniş açıdır. Bu örüntü her zaman doğrudur: herhangi bir dar açının bütünleri geniştir, geniş açının bütünleri dardır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">İki açı tümlerdir. Biri diğerinin iki katıdır. İkisini de bul.<br><br>Küçük açıya $x$ diyelim. O zaman büyük açı $2x$ olur ve $x + 2x = 90^\\circ$, yani $3x = 90^\\circ$, $x = 30^\\circ$.<br><br>Açılar <strong>30&deg; ve 60&deg;</strong>'dir. (Bunların 30-60-90 üçgeninin dik olmayan iki açısı olduğuna dikkat et.)</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir açı kendi tümleriyle eşittir. Ölçüsü nedir? ($x + x = 90^\\circ$ kur, $x = 45^\\circ$. 45&deg; açısı kendi-tümleri olan tek açıdır.) Benzer şekilde, kendi-bütünleri olan açı 90&deg;'dir.</div></div>

<h2 class="lesson-title">3. Ters Açılar</h2>

<div class="calc-highlight"><strong>İki doğru kesiştiğinde, kesişim noktası etrafında dört açı oluştururlar.</strong> Kesişim üzerinden birbirine karşı duran iki açı her zaman eşittir. Bunlara <em>ters açılar</em> denir. Diğer çift de ters açılardır ve birbirine eşittir.</div>

<p class="l-text">Bir noktada kesişen iki doğru dört açı üretir; bu açıları kesişim etrafında dolaşarak 1, 2, 3, 4 diye etiketleyelim. 1. açı ve 3. açı karşılıklıdır — bu bir ters açı çiftidir. 2. açı ve 4. açı diğer çifttir. Komşu açı çiftlerinin her biri (1 ve 2 ya da 2 ve 3) bir doğru üzerinde bulunup 180&deg;'ye toplandığı için, basit bir cebirsel argüman karşılıklı açıları eşit olmaya zorlar:</p>

<div class="calc-formula"><div class="formula-label">TERS AÇI TEOREMİ</div><div class="formula-main">$$\\angle 1 = \\angle 3 \\qquad\\text{ve}\\qquad \\angle 2 = \\angle 4$$</div><div class="formula-sub">İspat fikri: $\\angle 1 + \\angle 2 = 180^\\circ$ (bir doğru) ve $\\angle 2 + \\angle 3 = 180^\\circ$ (başka bir doğru). Çıkart: $\\angle 1 - \\angle 3 = 0$, yani $\\angle 1 = \\angle 3$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">İki doğru kesişiyor. Oluşan dört açıdan birinin ölçüsü 110&deg;'dir. Diğer üçünü bul.<br><br>110&deg;'nin karşısındaki açı, ters açı çifti, yine <strong>110&deg;</strong>'dir.<br>Komşu iki açının her biri 110&deg;'lik açıyla bir doğruyu paylaşır, yani her biri $180^\\circ - 110^\\circ = \\mathbf{70^\\circ}$'dir.<br>Doğrula: $110 + 110 + 70 + 70 = 360^\\circ$, herhangi bir nokta etrafındaki toplam açıdır.</div></div>

<div class="l-note"><strong>Bunun neden çok yararlı olduğu.</strong> Çoğu geometri probleminde sana yalnızca bir-iki açı ölçüsü verilir ve geri kalanını şekilden takip etmen beklenir. Ters açılar genellikle ilk hamledir: <em>iki doğrunun her kesişiminde, her açıyı yay ile işaretle ve bilinen değeri karşısındaki açıya kopyala</em>.</div>

<h2 class="lesson-title">4. Paralel Doğrular ve Kesen</h2>

<div class="calc-highlight"><strong>Lise açı geometrisinin en çok sınanan konusudur.</strong> İki paralel doğru ve onları kesen üçüncü bir doğru al. Üçüncü doğruya <em>kesen</em> denir. Kesenin oluşturduğu sekiz açı, üç isimli ilişkiye ayrılır; her biri belirli çiftlerin eşit ya da bütünler olduğunu söyler.</div>

<p class="l-text">İki yatay paralel doğru $\\ell_1$ ve $\\ell_2$ çiz; bir kesen $t$ her ikisini de bir açıyla kessin. Kesen, her doğru ile dört açı oluşturur; toplam sekiz. Üst kesişimde 1, 2, 3, 4 ve alt kesişimde 5, 6, 7, 8 olarak numaralandır (her kesişimde sağ üstten CCW gidiyor).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karşılık gelen açılar</div><div class="card-body">Her kesişime göre aynı konumda (örneğin ikisi de sağ üst). Çiftler hâlinde eşit: $\\angle 1 = \\angle 5$, $\\angle 2 = \\angle 6$, $\\angle 3 = \\angle 7$, $\\angle 4 = \\angle 8$.</div></div>
<div class="calc-card"><div class="card-title">Ters iç açılar</div><div class="card-body">İki paralel doğrunun arasında, kesenin zıt taraflarında. Eşit: $\\angle 3 = \\angle 5$ ve $\\angle 4 = \\angle 6$.</div></div>
<div class="calc-card"><div class="card-title">Aynı taraftaki iç açılar</div><div class="card-body">İki paralel doğrunun arasında, kesenin <em>aynı</em> tarafında. Bütünler: $\\angle 3 + \\angle 6 = 180^\\circ$ ve $\\angle 4 + \\angle 5 = 180^\\circ$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PARALEL-KESEN KURALLARI</div><div class="formula-main">$$\\text{Karşılık gelen: eşit} \\quad|\\quad \\text{Ters iç: eşit} \\quad|\\quad \\text{Aynı taraftaki iç: toplam} = 180^\\circ$$</div><div class="formula-sub">Üç kuralın da iki doğrunun paralel olmasını gerektirdiğini unutma. Paralel değillerse, eşitliklerin hiçbiri geçerli değildir.</div></div>

<div class="calc-graph"><div id="plot-l82-parallel-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 60&deg;'lik bir kesen tarafından kesilen iki yatay paralel doğru. Sekiz açı 1&ndash;8 olarak numaralandırılmış. Aynı renkteki çiftler eşittir (karşılık gelen ya da ters iç). 60&deg; ve 120&deg; değerleri her açıya yazılmıştır, böylece üç kuralı da aynı anda doğrulayabilirsin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var L1up={x:[-3,3],y:[1.2,1.2],mode:'lines',name:'paralel ℓ₁',line:{color:'rgba(255,255,255,0.55)',width:2}};
var L1lo={x:[-3,3],y:[-1.2,-1.2],mode:'lines',name:'paralel ℓ₂',line:{color:'rgba(255,255,255,0.55)',width:2}};
var slope=Math.tan(Math.PI/3);
var xTop=1.2/slope,xBot=-1.2/slope;
var transTR={x:[xBot-1.0,xTop+1.0],y:[-1.2-slope*1.0,1.2+slope*1.0],mode:'lines',name:'kesen t',line:{color:'#3b82f6',width:2.5}};
var labelsTR={x:[xTop+0.3,xTop-0.3,xTop-0.3,xTop+0.3,xBot+0.3,xBot-0.3,xBot-0.3,xBot+0.3],y:[1.5,1.5,0.9,0.9,-0.9,-0.9,-1.5,-1.5],mode:'text',name:'açı etiketleri',text:['1:120°','2:60°','3:120°','4:60°','5:120°','6:60°','7:120°','8:60°'],textfont:{color:['#f59e0b','#10b981','#f59e0b','#10b981','#f59e0b','#10b981','#f59e0b','#10b981'],size:11}};
var ptsTR={x:[xTop,xBot],y:[1.2,-1.2],mode:'markers',name:'kesişimler',marker:{color:'#3b82f6',size:8}};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-3.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-2.2,2.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l82-parallel-tr',[L1up,L1lo,transTR,ptsTR,labelsTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">İki paralel doğru bir kesenle kesiliyor. Sekiz açıdan biri 65&deg;'dir. Diğer her açının büyüklüğünü bul.<br><br>65&deg;'lik açının tersi de 65&deg;'dir.<br>65&deg;'lik açıyla aynı doğru üzerindeki iki açının her biri $180 - 65 = 115^\\circ$'dir (bütünler).<br>Alt kesişimde aynı örüntü tekrarlanır çünkü karşılık-gelen kuralı: sekiz açının dördü 65&deg;, diğer dördü 115&deg;'dir.<br><br>Örüntü: <strong>yalnızca iki farklı açı değeri çıkar ve bunlar bütünlerdir</strong>.</div></div>

<div class="l-note"><strong>Tersten çalışma.</strong> Üç kural aynı zamanda paralellik testidir: eşit olan bir karşılık-gelen açı çifti bulabilirsen, iki doğru <em>kesinlikle</em> paraleldir. Düzlem geometri ispatlarında iki doğrunun kesişmediğini bu şekilde gösteririz.</div>

<h2 class="lesson-title">5. Üçgen: Kenarlar, Açılar ve 180&deg; Kuralı</h2>

<div class="calc-highlight"><strong>Üçgen, düz kenarlı en basit kapalı şekildir.</strong> Üç köşe, üç kenar, üç iç açı. Üçgenler hakkındaki en yararlı tek olgu, iç açılarının her zaman 180&deg;'ye toplanmasıdır — şekli ne olursa olsun, boyutu ne olursa olsun.</div>

<p class="l-text">Köşeleri $A$, $B$, $C$, karşılarındaki kenarları ise $a$, $b$, $c$ olarak etiketle (yani $a$ kenarı $A$ köşesinin karşısındadır, vb.). Üç iç açı $\\angle A$, $\\angle B$, $\\angle C$'dir. Temel ilişki:</p>

<div class="calc-formula"><div class="formula-label">BİR ÜÇGENİN İÇ AÇILAR TOPLAMI</div><div class="formula-main">$$\\angle A + \\angle B + \\angle C \\;=\\; 180^\\circ$$</div><div class="formula-sub">Bölüm 4'teki paralel-doğru kurallarının doğrudan sonucudur: bir köşeden karşısındaki kenara paralel bir doğru çiz; o köşedeki üç açı (iç açı ile iki ters-iç-açı kopyası) bir doğru oluşturur.</div></div>

<p class="l-text"><strong>İspat fikri.</strong> $A$ köşesinden $BC$ kenarına paralel bir doğru çiz. $A$'daki üç açı ($\\angle B$ ile $\\angle C$'nin "sızan" iki ters-iç-kopyası artı orijinal $\\angle A$) bir doğru boyunca otururlar, yani toplamları 180&deg;'dir. Ama her sızan kopya, ters-iç kuralına göre kendi iç açısına eşittir. Dolayısıyla $\\angle A + \\angle B + \\angle C = 180^\\circ$.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Bir üçgenin iki açısı 42&deg; ve 73&deg;'dir. Üçüncüsünü bul.<br><br>$\\angle C = 180^\\circ - 42^\\circ - 73^\\circ = \\mathbf{65^\\circ}$.<br><br>Akıl kontrolü: 65&deg; dardır ve diğer ikisi de dardır, yani üçgen dar açılı bir üçgendir (Bölüm 8).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Bir üçgenin açıları 2:3:5 oranındadır. Her birini bul.<br><br>Açılar $2k$, $3k$, $5k$ olsun. O zaman $2k + 3k + 5k = 180^\\circ$, yani $10k = 180^\\circ$ ve $k = 18^\\circ$.<br><br>Açılar: <strong>36&deg;, 54&deg;, 90&deg;</strong>. 90&deg; bunu bir dik üçgen yapar.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir üçgenin iki dik açısı olabilir mi? (Hayır: iki dik açı zaten 180&deg;'ye toplanır, üçüncüye 0&deg; kalır — imkânsız.) İki geniş açısı olabilir mi? (Hayır: 90&deg;'den büyük iki açı zaten 180&deg;'den fazla toplanır.) Bu nedenle her üçgenin en fazla bir dik ve en fazla bir geniş açısı vardır.</div></div>

<h2 class="lesson-title">6. Bir Üçgenin Dış Açısı</h2>

<div class="calc-highlight"><strong>Bir üçgenin bir kenarını köşenin ötesine doğru uzat.</strong> Uzantı ile bitişik kenar arasındaki açıya o köşedeki <em>dış açı</em> denir. İki uzak (komşu olmayan) iç açının toplamına eşittir. Düzlem geometride en kullanışlı kısayollardan biridir.</div>

<div class="calc-formula"><div class="formula-label">DIŞ AÇI TEOREMİ</div><div class="formula-main">$$C \\text{'deki dış açı} \\;=\\; \\angle A + \\angle B$$</div><div class="formula-sub">Dış açı, diğer iki köşedeki iki iç açının toplamına eşittir. 180&deg;'lik toplamın doğrudan sonucu: $C$'deki iç açı + $C$'deki dış açı = 180&deg; ve $C$'deki iç açı = 180&deg; &minus; $\\angle A$ &minus; $\\angle B$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir üçgende $\\angle A = 50^\\circ$ ve $\\angle B = 70^\\circ$. $C$ köşesindeki dış açıyı bul.<br><br>Teorem ile: $C$'deki dış açı $= 50^\\circ + 70^\\circ = \\mathbf{120^\\circ}$.<br><br>Doğrula: $C$'deki iç açı $= 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$ ve $60^\\circ + 120^\\circ = 180^\\circ$ — iki açı bir doğru oluşturur.</div></div>

<div class="l-note"><strong>Yaygın hata.</strong> Öğrenciler bazen dış açıyı, köşenin diğer tarafındaki ters açı ile karıştırır. Dış açı, iç açıya <em>bütünler</em> olandır, ters açısı değil. Uzatılmış kenar çizilen temiz bir resim, bu belirsizliği kaldırır.</div>

<h2 class="lesson-title">7. Üçgen Eşitsizliği</h2>

<div class="calc-highlight"><strong>Her pozitif sayı üçlüsü üçgen oluşturmaz.</strong> Üç uzunluk, üçgen eşitsizliğini sağlamalıdır: herhangi iki kenarın toplamı üçüncüden büyük olmalıdır. Eşitsizlik bozulursa (veya yalnızca eşitse), üç parça ya bir doğru üzerinde düz uzanır ya da kapanamaz.</div>

<div class="calc-formula"><div class="formula-label">ÜÇGEN EŞİTSİZLİĞİ</div><div class="formula-main">$$a + b > c, \\qquad b + c > a, \\qquad a + c > b$$</div><div class="formula-sub">Üç eşitsizlik de kesinlikle geçerli olmalıdır. Biri eşitlik hâline gelirse, üç nokta doğrusaldır (alanı sıfır olan dejenere bir üçgen).</div></div>

<p class="l-text"><strong>Geometrik anlam.</strong> Bir üçgenin "kapanması" gerekir: $A$'dan başla, $c$ kenarı boyunca $B$'ye yürü, sonra $a$ kenarı boyunca $C$'ye, sonra $b$ kenarı boyunca tekrar $A$'ya. $b$ uzunluğu, $C$'den $A$'ya doğrudan mesafeden (en fazla $a + c$) kısa ise, üçgen imkânsızdır. Eşitsizlik tam olarak bu geometrik kapanma koşulunu zorlar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Kenarları 3, 4, 5 olan bir üçgen olabilir mi?<br><br>Üç eşitsizliği de kontrol et: $3 + 4 = 7 > 5$ ✓, $4 + 5 = 9 > 3$ ✓, $3 + 5 = 8 > 4$ ✓.<br><br>Evet — üstelik $3^2 + 4^2 = 9 + 16 = 25 = 5^2$, yani bu bir dik üçgendir (Bölüm 9'daki meşhur 3-4-5 üçlüsü).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Kenarları 1, 1, 3 olan bir üçgen olabilir mi?<br><br>Kontrol: $1 + 1 = 2 < 3$. Eşitsizlik daha ilk denemede bozulur.<br><br>Hayır — iki birim parça birlikte 3 uzunluklu parçadan kısadır, yani bir uçtan diğerine köprü kuramazlar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">Bir üçgenin iki kenarı 7 ve 10'dur. Üçüncü kenarın olası değerleri nelerdir?<br><br>Üçüncü kenara $x$ diyelim. Üç eşitsizlik: $7 + 10 > x$, $7 + x > 10$, $10 + x > 7$. Üçüncüsü herhangi bir pozitif $x$ için otomatiktir. İlk ikisi $x < 17$ ve $x > 3$ verir.<br><br>İzin verilen aralık: <strong>$3 < x < 17$</strong>.</div></div>

<div class="think-box"><div class="think-label">HIZLI KURAL</div><div class="think-body">İki kenarı bilinen ($a \\geq b$ ile $a, b$) bir üçgen için üçüncü kenar $c$, $a - b < c < a + b$ koşulunu sağlamalıdır. Bu iki-eşitsizlik biçimini ezberle — üç üçgen eşitsizliğini ayrı ayrı kontrol etmekten daha hızlıdır.</div></div>

<h2 class="lesson-title">8. Üçgenleri Sınıflandırma</h2>

<div class="calc-highlight"><strong>Üçgenler iki bağımsız etiket alır: biri kenarlara, diğeri açılara dayanır.</strong> Birlikte bir üçgenin "türünü" tam olarak belirlerler. Sonraki birçok teorem (örneğin ikizkenar üçgen teoremi ya da Pisagor teoremi) yalnızca belirli bir türe uygulanır.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">KENARLARA GÖRE</div><div class="compare-item"><strong>Çeşitkenar</strong>: üç kenar da farklı uzunlukta</div><div class="compare-item"><strong>İkizkenar</strong>: en az iki kenar eşit (eşit kenarların karşısındaki taban açıları da eşittir)</div><div class="compare-item"><strong>Eşkenar</strong>: üç kenar da eşit (ve sonuç olarak üç açının her biri 60&deg;'dir)</div></div><div class="compare-col"><div class="compare-title">AÇILARA GÖRE</div><div class="compare-item"><strong>Dar açılı</strong>: üç açı da 90&deg;'den küçük</div><div class="compare-item"><strong>Dik açılı</strong>: tam olarak bir açı 90&deg; (ve diğer ikisi tümlerdir)</div><div class="compare-item"><strong>Geniş açılı</strong>: tam olarak bir açı 90&deg;'den büyük</div></div></div>

<p class="l-text">Bileşimler mümkündür. Bir <em>ikizkenar dik üçgen</em>, eşit uzunlukta iki dik kenarı ve aralarında 90&deg;'lik açıya sahiptir — üç açısı 45-45-90'dır. Bir <em>eşkenar üçgen</em> kendiliğinden dar açılıdır (üç açı da 60&deg;'dir). Bir <em>çeşitkenar geniş açılı</em> üçgenin üç farklı kenarı ve 90&deg;'den büyük bir açısı vardır.</p>

<div class="calc-graph"><div id="plot-l82-classify-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 2&times;3'lük bir ızgarada altı üçgen. Üst sıra: çeşitkenar, ikizkenar, eşkenar (kenarlara göre sınıflandırma). Alt sıra: dar açılı, dik açılı, geniş açılı (açılara göre sınıflandırma). Dik üçgenin 90&deg;'lik köşesi küçük bir kare ile işaretlenmiştir; eşkenar üçgenin üç kenarı da eşit çizilmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function tri(cx,cy,pts,color,name){var xs=[],ys=[];for(var i=0;i<pts.length;i++){xs.push(cx+pts[i][0]);ys.push(cy+pts[i][1]);}xs.push(cx+pts[0][0]);ys.push(cy+pts[0][1]);return{x:xs,y:ys,mode:'lines',name:name,line:{color:color,width:2.5},fill:'toself',fillcolor:color.replace('rgb','rgba').replace(')',',0.12)')};}
var dx=3.6,dy=3.2;
var scaleneTR=tri(-dx,dy,[[0,1.2],[1.3,-0.6],[-1.0,-0.6]],'rgb(59,130,246)','çeşitkenar');
var isosTR=tri(0,dy,[[0,1.2],[1.0,-0.6],[-1.0,-0.6]],'rgb(16,185,129)','ikizkenar');
var equilTR=tri(dx,dy,[[0,1.15],[1.0,-0.575],[-1.0,-0.575]],'rgb(245,158,11)','eşkenar');
var acuteTR=tri(-dx,-dy,[[0,1.1],[0.9,-0.6],[-1.05,-0.6]],'rgb(139,92,246)','dar');
var rightTR=tri(0,-dy,[[-0.8,-0.6],[0.9,-0.6],[-0.8,1.0]],'rgb(236,72,153)','dik');
var obtuseTR=tri(dx,-dy,[[-1.3,-0.5],[1.3,-0.5],[0.6,0.5]],'rgb(239,68,68)','geniş');
var rmarkTR={x:[-0.8+0.2,-0.65+0.2,-0.65+0.2,-0.65,-0.65],y:[-0.6-dy,-0.6-dy,-0.45-dy,-0.45-dy,-0.6-dy],mode:'lines',line:{color:'rgba(236,72,153,0.9)',width:1.5},showlegend:false};
var labsTR={x:[-dx,0,dx,-dx,0,dx],y:[dy+1.7,dy+1.7,dy+1.7,-dy+1.6,-dy+1.6,-dy+1.6],mode:'text',text:['Çeşitkenar','İkizkenar','Eşkenar','Dar açılı','Dik açılı (90°)','Geniş açılı'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-5.5,5.5],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.05)',scaleanchor:'y',scaleratio:1,visible:false},yaxis:{range:[-5,5.5],gridcolor:'rgba(255,255,255,0.04)',zerolinecolor:'rgba(255,255,255,0.05)',visible:false},margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l82-classify-tr',[scaleneTR,isosTR,equilTR,acuteTR,rightTR,obtuseTR,rmarkTR,labsTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>İkizkenar teoremi.</strong> Bir üçgenin iki kenarı eşitse, bu kenarların karşısındaki iki açı da eşittir (taban açıları). Karşıtı da doğrudur. Bu, ikizkenar üçgen içeren neredeyse her "açıyı bul" probleminin arkasındaki temel olgudur.</div>

<h2 class="lesson-title">9. Pisagor Teoremi</h2>

<div class="calc-highlight"><strong>Bir dik üçgen için</strong> dik kenarlar (dik açıya komşu iki kenar) $a$ ve $b$ ile hipotenüs (dik açının karşısındaki kenar — her zaman en uzun olanı) $c$ olmak üzere, dik kenarların karelerinin toplamı hipotenüsün karesine eşittir. Bu, lise geometrisinin en ünlü özdeşliği olan Pisagor teoremidir.</div>

<div class="calc-formula"><div class="formula-label">PİSAGOR TEOREMİ</div><div class="formula-main">$$a^2 + b^2 \\;=\\; c^2 \\quad\\text{(dik üçgen, } c \\text{ = hipotenüs)}$$</div><div class="formula-sub">Karşıtı da geçerlidir: bir üçgenin üç kenarı $a^2 + b^2 = c^2$ koşulunu sağlıyorsa, $c$'nin karşısındaki açı dik açıdır.</div></div>

<p class="l-text"><strong>Pisagor üçlüleri.</strong> $a^2 + b^2 = c^2$ koşulunu sağlayan üç tam sayıya $(a, b, c)$ Pisagor üçlüsü denir. En ünlüleri $(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$ ve $(7, 24, 25)$'tir. Ölçeklenmiş kopyaları — $(6, 8, 10)$, $(9, 12, 15)$, ... — da çalışır. Bu üçlüler o kadar sık görünür ki, birkaçını ezberlemek sınavlarda zaman kazandırır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">Bir dik üçgenin dik kenarları 6 ve 8'dir. Hipotenüsü bul.<br><br>$c^2 = 6^2 + 8^2 = 36 + 64 = 100$, yani $c = 10$. ($(6, 8, 10) = 2 \\times (3, 4, 5)$ olduğunu fark et.)<br><br>Hipotenüs: <strong>10</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">Bir dik üçgenin hipotenüsü 13 ve bir dik kenarı 5'tir. Diğer dik kenarı bul.<br><br>Bilinmeyen dik kenar $b$ olsun. O zaman $5^2 + b^2 = 13^2$, yani $b^2 = 169 - 25 = 144$, $b = 12$. (Üçlü $(5, 12, 13)$.)<br><br>Diğer dik kenar: <strong>12</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">Kenarları $(8, 15, 17)$ olan üçgen dik üçgen midir?<br><br>Kontrol: $8^2 + 15^2 = 64 + 225 = 289 = 17^2$. Evet ✓ — ve dik açı en uzun kenarın (17) karşısındadır.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Pisagor teoremi, trigonometriye giriş kapındır. Bir dik üçgeni dik açısı orijinde olacak şekilde koordinat sistemine yerleştirdiğinde, dik kenarlar $x$ ve $y$ koordinatları olur, hipotenüs ise $\\sqrt{x^2+y^2}$ mesafesi olur. Buradan sinüs, kosinüs ve tanjant doğal olarak ortaya çıkar (trigonometri serisinin 1. dersi).</div>

<h2 class="lesson-title">10. Bir Üçgenin Dört Merkezi</h2>

<div class="calc-highlight"><strong>Her üçgenin dört klasik "merkezi" vardır,</strong> her biri belirli bir tür doğruyu kesiştirerek tanımlanır. Hepsi üçgenin içinde (ya da hemen dışında) bir yerde oturur ve her birinin kendi geometrik anlamı vardır. En azından isimleri ve yapımlarını tanıman gerekir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ağırlık merkezi (centroid)</div><div class="card-body">Üç <em>kenarortayın</em> kesişimi (her kenarortay bir köşeyi karşısındaki kenarın orta noktasına bağlar). Ağırlık merkezi, üçgenin kütle merkezidir — üçgeni burada bir iğne üzerinde dengelersen düz kalır. Her kenarortayı 2:1 oranında böler (köşe tarafı daha uzun).</div></div>
<div class="calc-card"><div class="card-title">İç teğet merkez (incenter)</div><div class="card-body">Üç <em>açıortayın</em> kesişimi. İç teğet merkez üç kenara eşit uzaklıktadır ve iç teğet çemberin (içine sığan en büyük çemberin) merkezidir.</div></div>
<div class="calc-card"><div class="card-title">Çevrel merkez (circumcenter)</div><div class="card-body">Üç kenarın <em>dik orta dikme</em>lerinin kesişimi. Çevrel merkez üç köşeye eşit uzaklıktadır ve çevrel çemberin (üçgeni içeren en küçük çemberin) merkezidir.</div></div>
<div class="calc-card"><div class="card-title">Diklik merkezi (orthocenter)</div><div class="card-body">Üç <em>yüksekliğin</em> kesişimi (her yükseklik bir köşeden karşı kenarı içeren doğruya dik inendir). Dar açılı üçgenin içinde, dik üçgenin dik köşesinde, geniş açılı üçgenin dışındadır.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EULER DOĞRUSU</div><div class="formula-main">$$\\text{ağırlık merkezi, çevrel merkez, diklik merkezi doğrusaldır}$$</div><div class="formula-sub">Eşkenar olmayan herhangi bir üçgende, dört merkezden üçü (ağırlık merkezi $G$, çevrel merkez $O$, diklik merkezi $H$) Euler doğrusu adı verilen tek bir doğru üzerinde bulunur ve $OG : GH = 1 : 2$'dir. İç teğet merkez genellikle bu doğru üzerinde <em>değildir</em>.</div></div>

<div class="calc-graph"><div id="plot-l82-centers-tr" class="plotly-graph" style="height:500px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dört klasik merkezi de işaretlenmiş örnek bir dar açılı üçgen: ağırlık merkezi (mavi), iç teğet merkez (yeşil), çevrel merkez (turuncu) ve diklik merkezi (kırmızı). Üç kenarortay, üç açıortay, kenarların dik orta dikmeleri ve yükseklikler referans için soluk çizilmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var A=[-2,-1],B=[3,-0.5],C=[0.5,2.5];
function mid(P,Q){return[(P[0]+Q[0])/2,(P[1]+Q[1])/2];}
var M_a=mid(B,C),M_b=mid(A,C),M_c=mid(A,B);
var triTR={x:[A[0],B[0],C[0],A[0]],y:[A[1],B[1],C[1],A[1]],mode:'lines',name:'üçgen ABC',line:{color:'rgba(255,255,255,0.65)',width:2.5}};
var medATR={x:[A[0],M_a[0]],y:[A[1],M_a[1]],mode:'lines',name:'kenarortaylar',line:{color:'rgba(59,130,246,0.4)',width:1.2,dash:'dot'}};
var medBTR={x:[B[0],M_b[0]],y:[B[1],M_b[1]],mode:'lines',line:{color:'rgba(59,130,246,0.4)',width:1.2,dash:'dot'},showlegend:false};
var medCTR={x:[C[0],M_c[0]],y:[C[1],M_c[1]],mode:'lines',line:{color:'rgba(59,130,246,0.4)',width:1.2,dash:'dot'},showlegend:false};
var Gx=(A[0]+B[0]+C[0])/3,Gy=(A[1]+B[1]+C[1])/3;
var centroidTR={x:[Gx],y:[Gy],mode:'markers+text',name:'Ağırlık merkezi G',marker:{color:'#3b82f6',size:12},text:['G'],textposition:'top right',textfont:{color:'#3b82f6',size:13}};
function dist(P,Q){return Math.sqrt((P[0]-Q[0])*(P[0]-Q[0])+(P[1]-Q[1])*(P[1]-Q[1]));}
var a=dist(B,C),b=dist(A,C),c=dist(A,B);
var Ix=(a*A[0]+b*B[0]+c*C[0])/(a+b+c);
var Iy=(a*A[1]+b*B[1]+c*C[1])/(a+b+c);
var incenterTR={x:[Ix],y:[Iy],mode:'markers+text',name:'İç teğet merkez I',marker:{color:'#10b981',size:12},text:['I'],textposition:'bottom right',textfont:{color:'#10b981',size:13}};
function perpBisect(P,Q){var m=mid(P,Q);var dx=Q[0]-P[0],dy=Q[1]-P[1];var L=2.0;var nx=-dy,ny=dx;var nl=Math.sqrt(nx*nx+ny*ny);nx/=nl;ny/=nl;return{x:[m[0]-L*nx,m[0]+L*nx],y:[m[1]-L*ny,m[1]+L*ny]};}
var pb_a=perpBisect(B,C),pb_b=perpBisect(A,C),pb_c=perpBisect(A,B);
var pbaTR={x:pb_a.x,y:pb_a.y,mode:'lines',name:'dik orta dikmeler',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dash'}};
var pbbTR={x:pb_b.x,y:pb_b.y,mode:'lines',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dash'},showlegend:false};
var pbcTR={x:pb_c.x,y:pb_c.y,mode:'lines',line:{color:'rgba(245,158,11,0.4)',width:1.2,dash:'dash'},showlegend:false};
function circ(A,B,C){var ax=A[0],ay=A[1],bx=B[0],by=B[1],cx=C[0],cy=C[1];var d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));var ux=((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d;var uy=((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d;return[ux,uy];}
var Ocirc=circ(A,B,C);
var circumcenterTR={x:[Ocirc[0]],y:[Ocirc[1]],mode:'markers+text',name:'Çevrel merkez O',marker:{color:'#f59e0b',size:12},text:['O'],textposition:'top left',textfont:{color:'#f59e0b',size:13}};
var Hx=A[0]+B[0]+C[0]-2*Ocirc[0],Hy=A[1]+B[1]+C[1]-2*Ocirc[1];
var orthTR={x:[Hx],y:[Hy],mode:'markers+text',name:'Diklik merkezi H',marker:{color:'#ef4444',size:12},text:['H'],textposition:'bottom left',textfont:{color:'#ef4444',size:13}};
var vlabelsTR={x:[A[0]-0.25,B[0]+0.25,C[0]+0.1],y:[A[1]-0.25,B[1]-0.25,C[1]+0.25],mode:'text',text:['A','B','C'],textfont:{color:'rgba(255,255,255,0.8)',size:14},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-3.5,4.5],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.1)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-2.5,3.5],gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.1)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l82-centers-tr',[triTR,medATR,medBTR,medCTR,pbaTR,pbbTR,pbcTR,centroidTR,incenterTR,circumcenterTR,orthTR,vlabelsTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Özel durum.</strong> Bir eşkenar üçgende dört merkez de tek bir noktada çakışır. Üçgen daha çeşitkenar oldukça merkezler birbirinden ayrılır ve dejenere (çok yassı) üçgenlerde merkezler birbirinden çok uzaklaşabilir.</div>

<h2 class="lesson-title">11. Çözümlü Problemler</h2>

<p class="l-text">Bölüm 1&ndash;10'daki fikirleri bir araya getiren karışık bir alıştırma seti. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; BÜTÜNLER</div><div class="example-body"><strong>73&deg;'nin bütünlerini bul.</strong><br><br>Bütünler = $180^\\circ - 73^\\circ = \\mathbf{107^\\circ}$. Geniş açıdır, beklenildiği gibi (herhangi bir dar açının bütünleri geniştir).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ÜÇGENİN EKSİK AÇISI</div><div class="example-body"><strong>Bir üçgenin iki açısı 48&deg; ve 67&deg;'dir. Üçüncüsünü bul.</strong><br><br>$\\angle C = 180^\\circ - 48^\\circ - 67^\\circ = \\mathbf{65^\\circ}$. Üçü de dardır, yani üçgen dar açılıdır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; ÜÇGEN EŞİTSİZLİĞİ KONTROLÜ</div><div class="example-body"><strong>$(3, 4, 5)$ ve $(1, 1, 3)$ uzunluklarının her birinin bir üçgen oluşturup oluşturmadığını karar ver.</strong><br><br>$(3, 4, 5)$: $3 + 4 = 7 > 5$, $4 + 5 = 9 > 3$, $3 + 5 = 8 > 4$. Üç eşitsizlik de kesinlikle geçerli. <strong>Evet</strong> (üstelik dik açılı).<br><br>$(1, 1, 3)$: $1 + 1 = 2 < 3$. Hemen bozulur. <strong>Hayır.</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; PARALEL DOĞRULAR</div><div class="example-body"><strong>İki paralel doğru bir kesenle kesiliyor. Aynı taraftaki bir iç açı 110&deg;'dir. Diğer aynı taraftaki iç açıyı bul.</strong><br><br>Aynı taraftaki iç açılar bütünlerdir, yani diğeri $180^\\circ - 110^\\circ = \\mathbf{70^\\circ}$'dir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DIŞ AÇI</div><div class="example-body"><strong>Bir üçgende iki iç açı 38&deg; ve 71&deg;'dir. Üçüncü köşedeki dış açıyı bul.</strong><br><br>Dış açı teoremi ile: dış açı = $38^\\circ + 71^\\circ = \\mathbf{109^\\circ}$.<br>Çapraz kontrol: üçüncü iç açı = $180^\\circ - 38^\\circ - 71^\\circ = 71^\\circ$. İç + dış = $71^\\circ + 109^\\circ = 180^\\circ$ ✓.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; PİSAGOR</div><div class="example-body"><strong>Bir dik üçgenin dik kenarları 9 ve 12'dir. Hipotenüsü bul.</strong><br><br>$c^2 = 9^2 + 12^2 = 81 + 144 = 225$, yani $c = 15$.<br>Bunun $3 \\times (3, 4, 5) = (9, 12, 15)$ olduğunu fark et — en ünlü üçlünün bir katı. <strong>Hipotenüs = 15</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; İKİZKENAR ÜÇGEN</div><div class="example-body"><strong>Bir ikizkenar üçgenin tepe açısı 40&deg;'dir. İki taban açısını bul.</strong><br><br>Taban açıları eşittir (ikizkenar teoremi). Her taban açısına $x$ diyelim. O zaman $40^\\circ + 2x = 180^\\circ$, yani $2x = 140^\\circ$ ve $x = 70^\\circ$.<br>Taban açıları: her biri <strong>70&deg;</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; ÜÇÜNCÜ KENAR ARALIĞI</div><div class="example-body"><strong>Bir üçgenin iki kenarı 6 ve 11'dir. Üçüncü kenarın alabileceği tam sayı değerleri nelerdir?</strong><br><br>$|11 - 6| < x < 11 + 6$, yani $5 < x < 17$ gerekir. Tam sayı değerleri: $\\mathbf{6, 7, 8, \\ldots, 16}$ — toplamda on bir değer.</div></div>

<h2 class="lesson-title">12. Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">NE TERS GİDİYOR</div><div class="compare-item"><strong>180&deg; kuralını unutmak.</strong> Öğrenciler bazen 180&deg;'den çıkartmak yerine bir üçgenin üçüncü açısını tahmin eder.</div><div class="compare-item"><strong>Köşe açısı ile dış açıyı karıştırmak.</strong> Dış açı aynı köşedeki iç açının bütünleridir, ters açısı değildir.</div><div class="compare-item"><strong>Üç üçgen eşitsizliğini kontrol etmeyi unutmak.</strong> Bir üçlü ikisini geçip üçüncüyü bozabilir.</div><div class="compare-item"><strong>Hipotenüsü belirlemeden bir üçgene "dik" demek.</strong> Hipotenüs en uzun kenar olmalıdır — her zaman dik açının karşısında.</div><div class="compare-item"><strong>Doğruları gerekçesiz paralel saymak.</strong> Karşılık-gelen kuralı yalnızca doğruların paralel olduğunu zaten gösterdiysen geçerlidir.</div></div><div class="compare-col"><div class="compare-title">NASIL KAÇINILIR</div><div class="compare-item">Bir üçgen gördüğünde, hemen başka bir şey yapmadan $\\angle A + \\angle B + \\angle C = 180^\\circ$ yaz.</div><div class="compare-item">Dış açı sorulduğunda uzatılmış kenarı köşenin ötesine çiz. Resim belirsizliği kaldırır.</div><div class="compare-item">Kısayolu kullan: $|a - b| < c < a + b$ — üç eşitsizliği aynı anda kontrol eder.</div><div class="compare-item">$a^2 + b^2 = c^2$'yi uygulamadan <em>önce</em> hipotenüsü belirle. Hipotenüs her zaman 90&deg;'nin karşısındadır.</div><div class="compare-item">"İşaretçiyi" ara — paralelliği gösteren ufak oklar ya da iki doğru üzerindeki "‖" sembolleri.</div></div></div>

<div class="l-note"><strong>İleriye bakış.</strong> 83&ndash;86. dersler bu temellerin üzerine inşa edilir: 83 üçgen benzerliğini (180&deg; kuralı ve ikizkenar teoremini tekrar tekrar kullanır), 84 çemberler ve çevre açıları (merkez açı / çevre açı ilişkisini kullanır) konusunu kapsar; 85&ndash;86 özel dörtgenleri ve alan formüllerini tanıtır (dik üçgen Pisagor kurulumuna dayanır).</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Altı açı türü: dar, dik, geniş, doğru, geniş-tam, tam — derece ölçülerine göre sıralanır</li>
<li>Tümler çiftler 90&deg;'ye, bütünler çiftler 180&deg;'ye toplanır</li>
<li>Kesişen iki doğru iki çift eşit ters (karşılıklı) açı verir</li>
<li>Paralel + kesen: karşılık gelen eşit, ters iç eşit, aynı taraftaki iç bütünler</li>
<li>Üçgen: üç kenar, üç açı, iç açılar 180&deg;'ye toplanır</li>
<li>Bir üçgenin dış açısı = uzak iki iç açının toplamı</li>
<li>Üçgen eşitsizliği: $|a-b| < c < a+b$; üç uzunluğun üçgen oluşturduğunu varsaymadan önce kontrol et</li>
<li>Sınıflandırmalar: kenara göre (çeşitkenar / ikizkenar / eşkenar) ve açıya göre (dar / dik / geniş)</li>
<li>Dik üçgen: $a^2 + b^2 = c^2$, $c$ hipotenüs (en uzun kenar, dik açının karşısında)</li>
<li>Dört klasik merkez: ağırlık merkezi (kenarortaylar), iç teğet merkez (açıortaylar), çevrel merkez (dik orta dikmeler), diklik merkezi (yükseklikler)</li>
</ul>
</div>`

};
