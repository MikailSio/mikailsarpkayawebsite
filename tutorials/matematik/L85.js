window.LISE_MAT_L85 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already know the Pythagorean theorem: in a right triangle, the square of the hypotenuse equals the sum of the squares of the two legs.</strong> But what if the triangle has no right angle? Most triangles in the real world — a roof gable, a sailboat under wind, the triangle made by three cities on a map — are not right triangles. We need a law that works for <em>every</em> triangle, and that reduces to Pythagoras when the angle happens to be a right one. That law is the <em>law of cosines</em>, sometimes called the generalised Pythagorean theorem.</p>

<p class="l-text">In this lesson we derive the law of cosines from first principles, see how it collapses back to Pythagoras when $C = 90^\\circ$, learn its sister identity — the law of sines — and practise on side-side-side, side-angle-side, and angle-side-side problems. By the end you will be able to solve any triangle given three of its six pieces of information (three sides, or two sides and an angle, or two angles and a side).</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State and use the law of cosines $c^2 = a^2 + b^2 - 2ab\\cos C$ in all three cyclic forms</li>
<li>Derive the law of cosines by dropping an altitude and applying the Pythagorean theorem twice</li>
<li>See why the law of cosines reduces to the Pythagorean theorem exactly when the angle is $90^\\circ$</li>
<li>State and use the law of sines $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$</li>
<li>Decide which law to use given SAS, SSS, AAS, ASA, or SSA triangle data</li>
<li>Solve concrete problems including ship-navigation and surveying tasks</li>
<li>Recognise the ambiguous case (SSA) where 0, 1, or 2 triangles fit the data</li>
</ul>
</div>

<h2 class="lesson-title">1. Recap: The Pythagorean Theorem</h2>

<div class="calc-highlight"><strong>The classical statement:</strong> in a right triangle with legs of length $a$ and $b$ and hypotenuse $c$, $a^2 + b^2 = c^2$. The square on the hypotenuse equals the sum of the squares on the two shorter sides. This holds <em>only</em> when one of the angles is exactly $90^\\circ$.</div>

<p class="l-text">The Pythagorean theorem is the most famous result in all of school mathematics. It has been proved hundreds of different ways — geometric dissection proofs, algebraic proofs, calculus proofs, even a proof attributed to U.S. President James Garfield. But every one of those proofs needs a right angle somewhere. Remove the right angle and the equation $a^2 + b^2 = c^2$ becomes false.</p>

<div class="calc-formula"><div class="formula-label">THE PYTHAGOREAN THEOREM</div><div class="formula-main">$$a^2 + b^2 \\;=\\; c^2 \\qquad \\text{(only when } C = 90^\\circ\\text{)}$$</div><div class="formula-sub">Here $c$ is the side opposite the right angle (the hypotenuse) and $a$, $b$ are the two legs.</div></div>

<p class="l-text">Try a quick experiment in your head. Take a triangle with sides $a = 3$, $b = 4$, $c = 5$. Check: $3^2 + 4^2 = 9 + 16 = 25 = 5^2$. Yes — this is a right triangle (the famous 3-4-5). Now imagine pulling one corner outward so that the angle at $C$ opens up beyond $90^\\circ$. The opposite side $c$ stretches, so $c$ becomes <em>longer</em> than 5 and $c^2$ becomes bigger than $a^2 + b^2$. Push the other way and the angle closes below $90^\\circ$; $c$ shrinks and $c^2$ becomes smaller than $a^2 + b^2$. The difference must depend on the angle $C$ — and the law of cosines tells us exactly how.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Which side in the equation $a^2 + b^2 = c^2$ is always the hypotenuse? (Answer: $c$, the side <em>opposite</em> the right angle. The two legs $a$ and $b$ are adjacent to the right angle.)</div></div>

<h2 class="lesson-title">2. The Law of Cosines (Cosine Rule)</h2>

<div class="calc-highlight"><strong>The law of cosines is the Pythagorean theorem with a correction term.</strong> For <em>any</em> triangle with sides $a$, $b$, $c$ and the angle $C$ opposite side $c$: $c^2 = a^2 + b^2 - 2ab\\cos C$. The extra piece $-2ab\\cos C$ is the correction that accounts for the angle not being $90^\\circ$.</div>

<div class="calc-formula"><div class="formula-label">LAW OF COSINES &mdash; THREE CYCLIC FORMS</div><div class="formula-main">$$c^2 \\;=\\; a^2 + b^2 - 2ab\\cos C$$$$a^2 \\;=\\; b^2 + c^2 - 2bc\\cos A$$$$b^2 \\;=\\; a^2 + c^2 - 2ac\\cos B$$</div><div class="formula-sub">All three are the same identity, rotated. In each line the angle on the right matches the side on the left. Memorise <em>one</em> and rotate the letters.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Side names</div><div class="card-body">Lowercase $a$, $b$, $c$ denote the lengths of the sides. Uppercase $A$, $B$, $C$ denote the angles. The convention: angle $A$ is opposite side $a$, angle $B$ opposite $b$, angle $C$ opposite $c$.</div></div>
<div class="calc-card"><div class="card-title">When $C$ is large</div><div class="card-body">If $C > 90^\\circ$, then $\\cos C < 0$, so $-2ab\\cos C > 0$. The opposite side $c$ is <em>longer</em> than $\\sqrt{a^2 + b^2}$. Bigger angle, bigger opposite side.</div></div>
<div class="calc-card"><div class="card-title">When $C$ is small</div><div class="card-body">If $C < 90^\\circ$, then $\\cos C > 0$, so $-2ab\\cos C < 0$. The opposite side $c$ is <em>shorter</em> than $\\sqrt{a^2 + b^2}$. Smaller angle, smaller opposite side.</div></div>
</div>

<div class="calc-graph"><div id="plot-l85-triangle-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a generic triangle with vertices labelled $A$, $B$, $C$, sides $a$ (opposite $A$), $b$ (opposite $B$), $c$ (opposite $C$), and the angle $C$ marked at the corner where sides $a$ and $b$ meet. The law of cosines relates these four pieces: the two sides adjacent to angle $C$, the angle itself, and the side opposite.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;
var Bx=6,By=0;
var Cx=2.4,Cy=3.6;
var triEN={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'triangle',line:{color:'#3b82f6',width:2.8},marker:{color:'#3b82f6',size:8}};
var labelsEN={x:[Ax-0.35,Bx+0.25,Cx,(Bx+Cx)/2+0.3,(Ax+Cx)/2-0.35,(Ax+Bx)/2,Cx-0.35,Ax+0.35,Bx-0.35],y:[Ay-0.25,By-0.25,Cy+0.3,(By+Cy)/2,(Ay+Cy)/2,(Ay+By)/2-0.3,Cy-0.3,Ay+0.3,By+0.3],mode:'text',name:'labels',text:['A','B','C','a','b','c','γ','α','β'],textfont:{color:['#e8e8e8','#e8e8e8','#e8e8e8','#f59e0b','#f59e0b','#f59e0b','#10b981','#10b981','#10b981'],size:[16,16,16,14,14,14,13,13,13]},showlegend:false};
var arcCx=[];var arcCy=[];
var v1={x:Ax-Cx,y:Ay-Cy};var v2={x:Bx-Cx,y:By-Cy};
var ang1=Math.atan2(v1.y,v1.x);var ang2=Math.atan2(v2.y,v2.x);
for(var i=0;i<=24;i++){var t=ang1+(ang2-ang1)*i/24;arcCx.push(Cx+0.5*Math.cos(t));arcCy.push(Cy+0.5*Math.sin(t));}
var arcENC={x:arcCx,y:arcCy,mode:'lines',name:'angle C',line:{color:'#10b981',width:2.2}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,7.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-0.8,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l85-triangle-en',[triEN,arcENC,labelsEN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>How to read the formula:</strong> the side you want sits squared on the left. On the right you take the squares of the <em>other two sides</em>, add them, and subtract $2$ times their product times the cosine of the <em>included</em> angle (the angle between those two sides). That is all.</div>

<h2 class="lesson-title">3. Derivation: Drop an Altitude</h2>

<div class="calc-highlight"><strong>The proof uses the Pythagorean theorem twice.</strong> Start with any triangle. Drop a perpendicular from one vertex to the opposite side. This splits the original triangle into two right triangles. Apply Pythagoras to each piece, do a little algebra, and the law of cosines drops out.</div>

<p class="l-text">Set up coordinates so that vertex $A$ sits at the origin, vertex $B$ sits on the positive $x$-axis at distance $c$ (so $B = (c, 0)$), and vertex $C$ is somewhere in the upper half plane. The angle at $A$ is then the angle between the positive $x$-axis and the segment $AC$, and the length $AC = b$. So vertex $C$ has coordinates $(b\\cos A, b\\sin A)$.</p>

<div class="calc-formula"><div class="formula-label">COORDINATES OF THE THREE VERTICES</div><div class="formula-main">$$A = (0, 0) \\qquad B = (c, 0) \\qquad C = (b\\cos A, \\, b\\sin A)$$</div><div class="formula-sub">$A$ and $B$ are easy. For $C$: walk distance $b$ from $A$ at angle $A$ above the positive x-axis.</div></div>

<p class="l-text">The side $a$ is the distance from $B$ to $C$. Using the distance formula:</p>

<div class="calc-formula"><div class="formula-label">COMPUTING SIDE a</div><div class="formula-main">$$a^2 \\;=\\; (b\\cos A - c)^2 + (b\\sin A - 0)^2$$</div></div>

<p class="l-text">Expand the squares:</p>

<div class="calc-formula"><div class="formula-label">EXPANDING</div><div class="formula-main">$$a^2 \\;=\\; b^2\\cos^2 A - 2bc\\cos A + c^2 + b^2\\sin^2 A$$</div></div>

<p class="l-text">Group the two $b^2$ terms and use the identity $\\sin^2 A + \\cos^2 A = 1$:</p>

<div class="calc-formula"><div class="formula-label">SIMPLIFYING WITH PYTHAGOREAN IDENTITY</div><div class="formula-main">$$a^2 \\;=\\; b^2(\\cos^2 A + \\sin^2 A) + c^2 - 2bc\\cos A \\;=\\; b^2 + c^2 - 2bc\\cos A$$</div><div class="formula-sub">This is exactly the law of cosines for side $a$. By symmetry (relabelling the vertices) we get the other two cyclic forms.</div></div>

<p class="l-text">That is the entire proof. Two ingredients: the distance formula in the plane, and the Pythagorean identity $\\sin^2 + \\cos^2 = 1$ (which itself is just the Pythagorean theorem applied on the unit circle). The law of cosines is the Pythagorean theorem applied <em>twice</em>: once to compute distances in coordinates, once to combine sine and cosine.</p>

<h2 class="lesson-title">4. Why It Reduces to Pythagoras</h2>

<div class="calc-highlight"><strong>Set $C = 90^\\circ$ in the law of cosines.</strong> Then $\\cos C = \\cos 90^\\circ = 0$, so the correction term $-2ab\\cos C$ vanishes and $c^2 = a^2 + b^2$. That is the Pythagorean theorem. The law of cosines is genuinely a generalisation — it contains Pythagoras as a special case.</div>

<div class="calc-formula"><div class="formula-label">SPECIAL CASE C = 90&deg;</div><div class="formula-main">$$c^2 \\;=\\; a^2 + b^2 - 2ab\\underbrace{\\cos 90^\\circ}_{=\\,0} \\;=\\; a^2 + b^2$$</div><div class="formula-sub">Plug in $\\cos 90^\\circ = 0$ and the law of cosines collapses to Pythagoras.</div></div>

<div class="calc-graph"><div id="plot-l85-pythag-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same triangle, but now with $C = 90^\\circ$. Sides $a$ and $b$ are perpendicular, side $c$ is the hypotenuse, and the law of cosines $c^2 = a^2 + b^2 - 2ab\\cos C$ becomes $c^2 = a^2 + b^2$ because $\\cos 90^\\circ = 0$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;var Bx=4,By=0;var Cx=0,Cy=3;
var triPEN={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'right triangle',line:{color:'#3b82f6',width:2.8},marker:{color:'#3b82f6',size:8}};
var rightAng={x:[0.3,0.3,0],y:[0,0.3,0.3],mode:'lines',name:'right angle',line:{color:'#10b981',width:2}};
var labPEN={x:[-0.3,Bx+0.25,-0.3,(Bx+Cx)/2+0.3,-0.4,(Ax+Bx)/2],y:[-0.25,-0.25,Cy+0.25,(By+Cy)/2,(Ay+Cy)/2,-0.3],mode:'text',name:'labels',text:['A','B','C','c (hypotenuse)','b','a'],textfont:{color:['#e8e8e8','#e8e8e8','#e8e8e8','#f59e0b','#f59e0b','#f59e0b'],size:[15,15,15,13,14,14]},showlegend:false};
var equation={x:[2],y:[1.6],mode:'text',name:'equation',text:['cos 90° = 0<br>⇒ c² = a² + b²'],textfont:{color:'#10b981',size:14},showlegend:false};
var layPEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,5.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-0.8,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l85-pythag-en',[triPEN,rightAng,labPEN,equation],layPEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">What does the correction term $-2ab\\cos C$ tell you when $C = 60^\\circ$ and when $C = 120^\\circ$? (At $60^\\circ$: $\\cos = +1/2$, so correction $= -ab$, making $c^2 = a^2 + b^2 - ab$ — smaller than Pythagoras. At $120^\\circ$: $\\cos = -1/2$, correction $= +ab$, so $c^2 = a^2 + b^2 + ab$ — bigger than Pythagoras.)</div></div>

<h2 class="lesson-title">5. The Law of Sines (Sine Rule)</h2>

<div class="calc-highlight"><strong>The law of sines is the cosine law's sister.</strong> In any triangle, the ratio of a side to the sine of its opposite angle is the same for all three sides — and that common ratio equals $2R$, where $R$ is the radius of the triangle's circumscribed circle.</div>

<div class="calc-formula"><div class="formula-label">LAW OF SINES</div><div class="formula-main">$$\\frac{a}{\\sin A} \\;=\\; \\frac{b}{\\sin B} \\;=\\; \\frac{c}{\\sin C} \\;=\\; 2R$$</div><div class="formula-sub">$R$ is the <em>circumradius</em> — the radius of the unique circle passing through all three vertices. The fact that this radius appears here ties the triangle to its enclosing circle.</div></div>

<p class="l-text"><strong>A quick derivation sketch.</strong> Drop an altitude $h$ from vertex $C$ to side $c$. The right triangle on the left gives $\\sin A = h/b$, so $h = b\\sin A$. The right triangle on the right gives $\\sin B = h/a$, so $h = a\\sin B$. Equate the two expressions for $h$: $b\\sin A = a\\sin B$, i.e. $a/\\sin A = b/\\sin B$. Rotate the labels to add the third ratio. The constant $2R$ comes from the inscribed-angle theorem.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Side opposite biggest angle</div><div class="card-body">Since $\\sin$ is increasing on $(0, 90^\\circ)$ and decreasing on $(90^\\circ, 180^\\circ)$, the largest side faces the largest angle and the smallest side faces the smallest angle. This is sometimes called the "longer side opposite larger angle" rule.</div></div>
<div class="calc-card"><div class="card-title">Solving for a side</div><div class="card-body">If you know an angle $A$, its opposite side $a$, and another angle $B$, then $b = a \\cdot \\sin B / \\sin A$. One identity, two cross-multiplications.</div></div>
<div class="calc-card"><div class="card-title">Circumradius formula</div><div class="card-body">From $a / \\sin A = 2R$ we get $R = a / (2 \\sin A)$. Knowing any side and its opposite angle gives the radius of the circumscribed circle for free.</div></div>
</div>

<h2 class="lesson-title">6. When to Use Which Law</h2>

<div class="calc-highlight"><strong>A triangle has six measurements (three sides, three angles).</strong> If you know three of them (and they include at least one side), the other three are usually determined. Which law you use depends on <em>which</em> three you know.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">What you know</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Abbreviation</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Which law</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Notes</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Two sides + included angle</td><td style="padding:0.5rem 0.8rem"><strong>SAS</strong></td><td style="padding:0.5rem 0.8rem;color:#3b82f6">Cosine</td><td style="padding:0.5rem 0.8rem">Plug straight in: $c^2 = a^2 + b^2 - 2ab\\cos C$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Three sides</td><td style="padding:0.5rem 0.8rem"><strong>SSS</strong></td><td style="padding:0.5rem 0.8rem;color:#3b82f6">Cosine</td><td style="padding:0.5rem 0.8rem">Solve for the angle: $\\cos C = (a^2 + b^2 - c^2)/(2ab)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Angle, angle, side</td><td style="padding:0.5rem 0.8rem"><strong>AAS</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">Sine</td><td style="padding:0.5rem 0.8rem">Third angle is $180^\\circ$ minus the other two, then sine ratio</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Angle, side, angle</td><td style="padding:0.5rem 0.8rem"><strong>ASA</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">Sine</td><td style="padding:0.5rem 0.8rem">Same as AAS once you find the third angle</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Side, side, non-included angle</td><td style="padding:0.5rem 0.8rem"><strong>SSA</strong></td><td style="padding:0.5rem 0.8rem;color:#f59e0b">Sine (ambiguous!)</td><td style="padding:0.5rem 0.8rem">May give 0, 1, or 2 triangles &mdash; section 9</td></tr>
</tbody></table>
</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">USE COSINE LAW WHEN</div><div class="compare-item">You know three sides (SSS)</div><div class="compare-item">You know two sides and the angle <em>between</em> them (SAS)</div><div class="compare-item">The unknown is a third side or any angle</div><div class="compare-item">The triangle has no obvious right angle</div></div><div class="compare-col"><div class="compare-title">USE SINE LAW WHEN</div><div class="compare-item">You know two angles and any side (AAS or ASA)</div><div class="compare-item">You know two sides and a <em>non-included</em> angle (SSA) — beware ambiguity</div><div class="compare-item">You need to find a side opposite a known angle</div><div class="compare-item">You need the circumradius $R$</div></div></div>

<h2 class="lesson-title">7. Worked Example 1 &mdash; SAS</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>Given $a = 5$, $b = 7$, $C = 60^\\circ$, find side $c$.</strong><br><br>This is SAS: two sides and the included angle. Use the law of cosines directly.<br><br>$c^2 = a^2 + b^2 - 2ab\\cos C = 25 + 49 - 2 \\cdot 5 \\cdot 7 \\cdot \\cos 60^\\circ$<br><br>$\\cos 60^\\circ = 1/2$, so $2ab\\cos C = 70 \\cdot 1/2 = 35$.<br><br>$c^2 = 74 - 35 = 39$.<br><br>$c = \\sqrt{39} \\approx \\mathbf{6.245}$.<br><br>Notice: $c$ sits between $7 - 5 = 2$ (triangle inequality lower bound) and $7 + 5 = 12$ (upper bound), and it sits a bit below $\\sqrt{a^2 + b^2} = \\sqrt{74} \\approx 8.6$ as expected since $C < 90^\\circ$.</div></div>

<h2 class="lesson-title">8. Worked Example 2 &mdash; SSS</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>Given $a = 8$, $b = 10$, $c = 12$, find angle $A$.</strong><br><br>This is SSS. Rearrange the law of cosines $a^2 = b^2 + c^2 - 2bc\\cos A$ to solve for $\\cos A$:<br><br>$\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc} = \\dfrac{100 + 144 - 64}{2 \\cdot 10 \\cdot 12} = \\dfrac{180}{240} = 0.75$.<br><br>$A = \\cos^{-1}(0.75) \\approx \\mathbf{41.41^\\circ}$.<br><br>Sanity check: $a = 8$ is the shortest side, so the opposite angle $A$ should be the smallest. We could similarly compute $B \\approx 55.77^\\circ$ and $C \\approx 82.82^\\circ$, which sum to $180^\\circ$ as required, and the largest angle $C$ sits opposite the longest side $c = 12$.</div></div>

<h2 class="lesson-title">9. Worked Example 3 &mdash; Sine Law (AAS)</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>Given $a = 10$, $A = 30^\\circ$, $B = 45^\\circ$, find side $b$.</strong><br><br>This is AAS. By the law of sines, $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}$, so $b = a \\cdot \\dfrac{\\sin B}{\\sin A}$.<br><br>$\\sin 30^\\circ = 0.5$ and $\\sin 45^\\circ = \\sqrt{2}/2 \\approx 0.7071$.<br><br>$b = 10 \\cdot \\dfrac{0.7071}{0.5} = 10 \\cdot 1.4142 = \\mathbf{14.14}$.<br><br>While we are here, the third angle is $C = 180^\\circ - 30^\\circ - 45^\\circ = 105^\\circ$, and the third side is $c = 10 \\cdot \\sin 105^\\circ / \\sin 30^\\circ \\approx 10 \\cdot 0.9659 / 0.5 = 19.32$. The circumradius is $R = a / (2\\sin A) = 10 / 1 = 10$.</div></div>

<h2 class="lesson-title">10. Worked Example 4 &mdash; Ship Navigation</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>Two ships leave the same port at the same time. Ship 1 sails on a bearing of $40^\\circ$ at $18$ km/h. Ship 2 sails on a bearing of $115^\\circ$ at $24$ km/h. How far apart are they after 2 hours?</strong><br><br>After 2 hours, Ship 1 has travelled $a = 36$ km and Ship 2 has travelled $b = 48$ km. The angle between their courses (at the port) is $115^\\circ - 40^\\circ = 75^\\circ$.<br><br>The triangle is SAS: sides 36 and 48 with included angle $75^\\circ$. The distance between the ships is the third side $c$:<br><br>$c^2 = 36^2 + 48^2 - 2 \\cdot 36 \\cdot 48 \\cdot \\cos 75^\\circ$<br><br>$= 1296 + 2304 - 3456 \\cdot 0.2588$<br><br>$= 3600 - 894.5$<br><br>$= 2705.5$<br><br>$c \\approx \\sqrt{2705.5} \\approx \\mathbf{52.0}$ km.<br><br>So after two hours the ships are about 52 km apart — bigger than either leg of the triangle alone, since the angle between their paths is wide.</div></div>

<div class="calc-graph"><div id="plot-l85-ships-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the port at the origin with two ship trajectories. Ship 1 (blue, bearing $40^\\circ$, $36$ km) and Ship 2 (orange, bearing $115^\\circ$, $48$ km) after two hours. The dashed segment between their endpoints is the distance we computed using the law of cosines.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function bearing(deg, dist){var rad=(90-deg)*Math.PI/180;return {x:dist*Math.cos(rad),y:dist*Math.sin(rad)};}
var s1=bearing(40,36);
var s2=bearing(115,48);
var port={x:[0],y:[0],mode:'markers+text',name:'Port',marker:{color:'#e8e8e8',size:12},text:['Port'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:12}};
var t1={x:[0,s1.x],y:[0,s1.y],mode:'lines+markers',name:'Ship 1 (40°, 36 km)',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:9}};
var t2={x:[0,s2.x],y:[0,s2.y],mode:'lines+markers',name:'Ship 2 (115°, 48 km)',line:{color:'#f59e0b',width:3},marker:{color:'#f59e0b',size:9}};
var connectS={x:[s1.x,s2.x],y:[s1.y,s2.y],mode:'lines+text',name:'distance (~52 km)',line:{color:'#10b981',width:2.4,dash:'dash'},text:['','c ≈ 52 km'],textposition:'middle right',textfont:{color:'#10b981',size:12}};
var northRef={x:[0,0],y:[0,55],mode:'lines',name:'North (reference)',line:{color:'rgba(255,255,255,0.25)',width:1,dash:'dot'}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'East (km)',range:[-10,55],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'North (km)',range:[-25,40],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l85-ships-en',[port,t1,t2,connectS,northRef],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. The Ambiguous Case (SSA)</h2>

<div class="calc-highlight"><strong>SSA is special.</strong> Given two sides and a non-included angle, there may be <em>two</em> different triangles that match the data, or <em>one</em>, or <em>none</em>. The sine law equation $\\sin B = b\\sin A / a$ either has two solutions in $(0^\\circ, 180^\\circ)$ — a small one and its supplement — or one solution, or none (if the right-hand side exceeds $1$).</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No triangle</div><div class="card-body">If $b\\sin A > a$, then $\\sin B > 1$ has no solution and no triangle fits. The given side is too short to reach the third vertex.</div></div>
<div class="calc-card"><div class="card-title">Exactly one triangle</div><div class="card-body">If $b\\sin A = a$, the triangle is right-angled at $B$ and unique. Or if $a \\geq b$, the supplement angle is too big to fit, leaving one solution.</div></div>
<div class="calc-card"><div class="card-title">Two triangles</div><div class="card-body">If $b\\sin A < a < b$ and $A$ is acute, both $B$ and $180^\\circ - B$ are valid — two distinct triangles share the same SSA data. Drawing helps.</div></div>
</div>

<div class="l-note"><strong>Tip:</strong> SAS and SSS via the cosine law are never ambiguous — they always determine a unique triangle (when one exists). Only SSA via the sine law has the ambiguity. If you have a choice (e.g. SAS data could in principle be attacked by either law), prefer the cosine law to avoid the trap.</div>

<h2 class="lesson-title">12. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WRONG &mdash; DON'T DO THIS</div><div class="compare-item">Writing $c^2 = a^2 + b^2 + 2ab\\cos C$ (sign error)</div><div class="compare-item">Using the angle <em>not</em> between the two given sides</div><div class="compare-item">Forgetting that $\\cos$ can be negative (so the "correction" can flip sign)</div><div class="compare-item">Taking $\\cos^{-1}$ of a number outside $[-1, 1]$</div><div class="compare-item">Ignoring the SSA ambiguity</div></div><div class="compare-col"><div class="compare-title">RIGHT &mdash; ALWAYS</div><div class="compare-item">Sign is <strong>minus</strong>: $c^2 = a^2 + b^2 - 2ab\\cos C$</div><div class="compare-item">The angle must be the one between the two given sides</div><div class="compare-item">Check that your $\\cos$ value lies in $[-1, 1]$ before taking inverse cosine</div><div class="compare-item">Sanity-check by the triangle inequality: each side less than the sum of the other two</div><div class="compare-item">In SSA, ask yourself whether two triangles could fit</div></div></div>

<h2 class="lesson-title">13. Practice Problems</h2>

<div class="calc-example"><div class="example-label">PRACTICE 1 &mdash; SAS</div><div class="example-body"><strong>Given $a = 4$, $b = 6$, $C = 120^\\circ$, find $c$.</strong><br><br>$\\cos 120^\\circ = -1/2$, so $-2ab\\cos C = -2 \\cdot 24 \\cdot (-1/2) = +24$.<br><br>$c^2 = 16 + 36 + 24 = 76$, so $c = \\sqrt{76} \\approx \\mathbf{8.72}$. Notice $c$ exceeds $\\sqrt{a^2 + b^2} = \\sqrt{52} \\approx 7.21$, as expected for an obtuse angle.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 2 &mdash; SSS</div><div class="example-body"><strong>Given $a = 7$, $b = 9$, $c = 10$, find angle $B$.</strong><br><br>$\\cos B = \\dfrac{a^2 + c^2 - b^2}{2ac} = \\dfrac{49 + 100 - 81}{140} = \\dfrac{68}{140} \\approx 0.4857$.<br><br>$B = \\cos^{-1}(0.4857) \\approx \\mathbf{60.95^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 3 &mdash; SAS</div><div class="example-body"><strong>Find the length of the diagonal of a parallelogram with sides $8$ and $11$ and one interior angle $80^\\circ$.</strong><br><br>The diagonal opposite the $80^\\circ$ angle satisfies $d^2 = 8^2 + 11^2 - 2 \\cdot 8 \\cdot 11 \\cdot \\cos 80^\\circ = 64 + 121 - 176 \\cdot 0.1736 \\approx 185 - 30.55 = 154.45$. So $d \\approx \\mathbf{12.43}$.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 4 &mdash; SSS</div><div class="example-body"><strong>Find the angles of a triangle with sides $5$, $12$, $13$.</strong><br><br>Try the angle opposite the longest side. $\\cos C = (25 + 144 - 169)/(2 \\cdot 5 \\cdot 12) = 0/120 = 0$, so $C = 90^\\circ$. This is the famous $5$-$12$-$13$ Pythagorean triple. The other angles: $\\cos A = (144 + 169 - 25)/(2 \\cdot 12 \\cdot 13) = 288/312 \\approx 0.923$, so $A \\approx \\mathbf{22.62^\\circ}$, and $B = 180 - 90 - 22.62 \\approx \\mathbf{67.38^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 5 &mdash; AAS</div><div class="example-body"><strong>Given $A = 50^\\circ$, $B = 70^\\circ$, $a = 12$, find $c$.</strong><br><br>$C = 180 - 50 - 70 = 60^\\circ$. By the sine law, $c = a\\sin C / \\sin A = 12 \\cdot \\sin 60^\\circ / \\sin 50^\\circ = 12 \\cdot 0.866 / 0.766 \\approx \\mathbf{13.57}$.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 6 &mdash; SAS, applied</div><div class="example-body"><strong>A surveyor needs to find the distance across a river. From a point $P$ on her bank, she sights a tree $T$ on the far bank and a landmark $L$ on her own bank, with $PL = 80$ m. She measures the angle at $P$ between $PT$ and $PL$ as $63^\\circ$, and walks to $L$ and measures the angle at $L$ between $LT$ and $LP$ as $54^\\circ$. Find the distance $PT$.</strong><br><br>The third angle is $T = 180 - 63 - 54 = 63^\\circ$. By the sine law, $PT / \\sin L = PL / \\sin T$, so $PT = 80 \\cdot \\sin 54^\\circ / \\sin 63^\\circ = 80 \\cdot 0.809 / 0.891 \\approx \\mathbf{72.6}$ m.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 7 &mdash; SSA ambiguous</div><div class="example-body"><strong>Given $a = 10$, $b = 14$, $A = 35^\\circ$, find all possible $B$.</strong><br><br>$\\sin B = b\\sin A / a = 14 \\cdot \\sin 35^\\circ / 10 = 14 \\cdot 0.5736 / 10 = 0.8030$. Two solutions in $(0^\\circ, 180^\\circ)$: $B_1 \\approx \\mathbf{53.4^\\circ}$ and $B_2 = 180 - 53.4 = \\mathbf{126.6^\\circ}$. Both produce valid triangles since $a < b$.</div></div>

<div class="calc-example"><div class="example-label">PRACTICE 8 &mdash; CIRCUMRADIUS</div><div class="example-body"><strong>Find the circumradius of a triangle with $a = 10$ and opposite angle $A = 30^\\circ$.</strong><br><br>$2R = a / \\sin A = 10 / 0.5 = 20$, so $R = \\mathbf{10}$. The triangle's vertices all lie on a circle of radius 10.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> The law of cosines and law of sines are the two pillars of triangle solving. Together they handle every congruence case (SAS, SSS, AAS, ASA, SSA) that uniquely or ambiguously specifies a triangle. In later lessons we apply them to surveying, navigation, vectors, and trigonometric identities.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Law of cosines: $c^2 = a^2 + b^2 - 2ab\\cos C$ (and two cyclic rotations)</li>
<li>Derivation: drop an altitude, apply Pythagoras twice, use $\\sin^2 + \\cos^2 = 1$</li>
<li>Reduces to Pythagoras when $C = 90^\\circ$ because $\\cos 90^\\circ = 0$</li>
<li>Law of sines: $a/\\sin A = b/\\sin B = c/\\sin C = 2R$</li>
<li>SAS, SSS &rarr; cosine law; AAS, ASA &rarr; sine law; SSA &rarr; sine law, but watch for ambiguity</li>
<li>Sign in cosine law is <strong>minus</strong>: $-2ab\\cos C$</li>
<li>Common errors: wrong sign, wrong included angle, $\\cos^{-1}$ outside $[-1, 1]$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Pisagor teoremini zaten biliyorsun: bir dik üçgende, hipotenüsün karesi iki dik kenarın karelerinin toplamına eşittir.</strong> Peki ya üçgenin dik açısı yoksa? Gerçek hayattaki üçgenlerin çoğu — bir çatı alınlığı, rüzgâr altındaki bir yelkenli, bir haritadaki üç şehrin oluşturduğu üçgen — dik üçgen değildir. Her üçgen için işleyen ve açı dik açı olduğunda Pisagor'a indirgenen bir yasaya ihtiyacımız var. Bu yasa <em>kosinüs teoremidir</em>, bazen genelleştirilmiş Pisagor teoremi de denir.</p>

<p class="l-text">Bu derste kosinüs teoremini temel ilkelerden türetiyoruz, $C = 90^\\circ$ olduğunda Pisagor'a nasıl çöktüğünü görüyoruz, kardeş özdeşliği olan sinüs teoremini öğreniyoruz ve kenar-kenar-kenar, kenar-açı-kenar, açı-kenar-açı problemleri üzerinde pratik yapıyoruz. Dersin sonunda altı bilgi parçasından (üç kenar veya iki kenar bir açı veya iki açı bir kenar) üçü verildiğinde herhangi bir üçgeni çözebileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kosinüs teoremini $c^2 = a^2 + b^2 - 2ab\\cos C$ ve üç döngüsel formunu ifade edip kullanmayı</li>
<li>Kosinüs teoremini bir yükseklik indirip Pisagor'u iki kez uygulayarak türetmeyi</li>
<li>Açı tam olarak $90^\\circ$ olduğunda kosinüs teoreminin neden Pisagor'a indirgendiğini görmeyi</li>
<li>Sinüs teoremini $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$ ifade edip kullanmayı</li>
<li>SAS, SSS, AAS, ASA, SSA verisi karşısında hangi yasayı kullanacağına karar vermeyi</li>
<li>Gemi navigasyonu ve arazi ölçümü gibi somut problemleri çözmeyi</li>
<li>SSA'nın 0, 1 veya 2 üçgen üretebildiği belirsiz durumu tanımayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Hatırlatma: Pisagor Teoremi</h2>

<div class="calc-highlight"><strong>Klasik ifade:</strong> dik kenarları $a$ ve $b$, hipotenüsü $c$ olan bir dik üçgende $a^2 + b^2 = c^2$. Hipotenüs üzerindeki kare, iki kısa kenar üzerindeki karelerin toplamına eşittir. Bu, <em>sadece</em> açılardan biri tam olarak $90^\\circ$ olduğunda geçerlidir.</div>

<p class="l-text">Pisagor teoremi, tüm okul matematiğindeki en ünlü sonuçtur. Yüzlerce farklı şekilde kanıtlanmıştır — geometrik bölünme kanıtları, cebirsel kanıtlar, kalkülüs kanıtları, hatta ABD Başkanı James Garfield'a atfedilen bir kanıt. Ama bu kanıtların her birinin bir yerde dik açıya ihtiyacı vardır. Dik açıyı kaldır, $a^2 + b^2 = c^2$ denklemi yanlış olur.</p>

<div class="calc-formula"><div class="formula-label">PİSAGOR TEOREMİ</div><div class="formula-main">$$a^2 + b^2 \\;=\\; c^2 \\qquad \\text{(sadece } C = 90^\\circ \\text{ iken)}$$</div><div class="formula-sub">Burada $c$ dik açının karşısındaki kenardır (hipotenüs), $a$ ve $b$ ise iki dik kenardır.</div></div>

<p class="l-text">Kafanda hızlı bir deney yap. Kenarları $a = 3$, $b = 4$, $c = 5$ olan bir üçgen al. Kontrol et: $3^2 + 4^2 = 9 + 16 = 25 = 5^2$. Evet — bu bir dik üçgendir (meşhur 3-4-5). Şimdi bir köşeyi dışarı doğru çektiğini hayal et, böylece $C$ köşesindeki açı $90^\\circ$'nin ötesine açılsın. Karşı kenar $c$ uzar, yani $c$ 5'ten <em>daha uzun</em>, $c^2$ ise $a^2 + b^2$'den daha büyük olur. Diğer tarafa it ve açı $90^\\circ$'nin altına kapansın; $c$ kısalır ve $c^2$ $a^2 + b^2$'den daha küçük olur. Fark $C$ açısına bağlı olmak zorunda — ve kosinüs teoremi bize tam olarak nasıl olduğunu söyler.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$a^2 + b^2 = c^2$ denkleminde hangi kenar her zaman hipotenüstür? (Cevap: $c$, dik açının <em>karşısındaki</em> kenar. $a$ ve $b$ dik kenarları dik açıya komşudur.)</div></div>

<h2 class="lesson-title">2. Kosinüs Teoremi</h2>

<div class="calc-highlight"><strong>Kosinüs teoremi, düzeltme terimli Pisagor teoremidir.</strong> Kenarları $a$, $b$, $c$ ve $c$ kenarının karşısındaki açısı $C$ olan <em>herhangi bir</em> üçgen için: $c^2 = a^2 + b^2 - 2ab\\cos C$. Ek parça $-2ab\\cos C$, açının $90^\\circ$ olmamasını hesaba katan düzeltmedir.</div>

<div class="calc-formula"><div class="formula-label">KOSİNÜS TEOREMİ &mdash; ÜÇ DÖNGÜSEL FORM</div><div class="formula-main">$$c^2 \\;=\\; a^2 + b^2 - 2ab\\cos C$$$$a^2 \\;=\\; b^2 + c^2 - 2bc\\cos A$$$$b^2 \\;=\\; a^2 + c^2 - 2ac\\cos B$$</div><div class="formula-sub">Üçü de aynı özdeşliğin döndürülmüş hâlidir. Her satırda sağdaki açı, soldaki kenarla eşleşir. <em>Birini</em> ezberle ve harfleri döndür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kenar adları</div><div class="card-body">Küçük harf $a$, $b$, $c$ kenarların uzunluklarını gösterir. Büyük harf $A$, $B$, $C$ açıları gösterir. Sözleşme: $A$ açısı $a$ kenarının karşısındadır, $B$ açısı $b$'nin karşısında, $C$ açısı $c$'nin karşısındadır.</div></div>
<div class="calc-card"><div class="card-title">$C$ büyük olduğunda</div><div class="card-body">$C > 90^\\circ$ ise $\\cos C < 0$ olur, yani $-2ab\\cos C > 0$. Karşı kenar $c$, $\\sqrt{a^2 + b^2}$'den <em>daha uzundur</em>. Daha büyük açı, daha büyük karşı kenar.</div></div>
<div class="calc-card"><div class="card-title">$C$ küçük olduğunda</div><div class="card-body">$C < 90^\\circ$ ise $\\cos C > 0$ olur, yani $-2ab\\cos C < 0$. Karşı kenar $c$, $\\sqrt{a^2 + b^2}$'den <em>daha kısadır</em>. Daha küçük açı, daha küçük karşı kenar.</div></div>
</div>

<div class="calc-graph"><div id="plot-l85-triangle-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> köşeleri $A$, $B$, $C$, kenarları $a$ ($A$'nın karşısı), $b$ ($B$'nin karşısı), $c$ ($C$'nin karşısı) olarak etiketlenmiş ve $a$ ile $b$ kenarlarının buluştuğu köşede $C$ açısının işaretlendiği genel bir üçgen. Kosinüs teoremi bu dört parçayı ilişkilendirir: $C$ açısına komşu iki kenar, açının kendisi ve karşı kenar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;
var Bx=6,By=0;
var Cx=2.4,Cy=3.6;
var triTR={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'üçgen',line:{color:'#3b82f6',width:2.8},marker:{color:'#3b82f6',size:8}};
var labelsTR={x:[Ax-0.35,Bx+0.25,Cx,(Bx+Cx)/2+0.3,(Ax+Cx)/2-0.35,(Ax+Bx)/2,Cx-0.35,Ax+0.35,Bx-0.35],y:[Ay-0.25,By-0.25,Cy+0.3,(By+Cy)/2,(Ay+Cy)/2,(Ay+By)/2-0.3,Cy-0.3,Ay+0.3,By+0.3],mode:'text',name:'etiketler',text:['A','B','C','a','b','c','γ','α','β'],textfont:{color:['#e8e8e8','#e8e8e8','#e8e8e8','#f59e0b','#f59e0b','#f59e0b','#10b981','#10b981','#10b981'],size:[16,16,16,14,14,14,13,13,13]},showlegend:false};
var arcCxT=[];var arcCyT=[];
var v1T={x:Ax-Cx,y:Ay-Cy};var v2T={x:Bx-Cx,y:By-Cy};
var ang1T=Math.atan2(v1T.y,v1T.x);var ang2T=Math.atan2(v2T.y,v2T.x);
for(var i=0;i<=24;i++){var t=ang1T+(ang2T-ang1T)*i/24;arcCxT.push(Cx+0.5*Math.cos(t));arcCyT.push(Cy+0.5*Math.sin(t));}
var arcTRC={x:arcCxT,y:arcCyT,mode:'lines',name:'C açısı',line:{color:'#10b981',width:2.2}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,7.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-0.8,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l85-triangle-tr',[triTR,arcTRC,labelsTR],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Formülü okuma yolu:</strong> istediğin kenar solda karesi alınmış olarak durur. Sağda <em>diğer iki kenarın</em> karelerini alır, toplar ve $2$ çarpı çarpımlarının çarpı <em>arada kalan</em> açının (o iki kenar arasındaki açı) kosinüsünü çıkarırsın. Bu kadar.</div>

<h2 class="lesson-title">3. Türetme: Bir Yükseklik İndir</h2>

<div class="calc-highlight"><strong>Kanıt, Pisagor teoremini iki kez kullanır.</strong> Herhangi bir üçgenle başla. Bir köşeden karşı kenara dik bir doğru indir. Bu, orijinal üçgeni iki dik üçgene böler. Her parçaya Pisagor'u uygula, biraz cebir yap ve kosinüs teoremi düşer.</div>

<p class="l-text">$A$ köşesi orijinde, $B$ köşesi pozitif $x$-ekseni üzerinde $c$ uzaklıkta (yani $B = (c, 0)$) ve $C$ köşesi üst yarı düzlemde bir yerde olacak şekilde koordinatlar kur. $A$'daki açı, pozitif $x$-ekseni ile $AC$ doğru parçası arasındaki açıdır ve $AC = b$. Yani $C$ köşesinin koordinatları $(b\\cos A, b\\sin A)$.</p>

<div class="calc-formula"><div class="formula-label">ÜÇ KÖŞENİN KOORDİNATLARI</div><div class="formula-main">$$A = (0, 0) \\qquad B = (c, 0) \\qquad C = (b\\cos A, \\, b\\sin A)$$</div><div class="formula-sub">$A$ ve $B$ kolay. $C$ için: $A$'dan pozitif x-ekseninin üzerinde $A$ açısıyla $b$ uzaklığında yürü.</div></div>

<p class="l-text">$a$ kenarı, $B$'den $C$'ye olan uzaklıktır. Uzaklık formülünü kullanarak:</p>

<div class="calc-formula"><div class="formula-label">a KENARININ HESAPLANMASI</div><div class="formula-main">$$a^2 \\;=\\; (b\\cos A - c)^2 + (b\\sin A - 0)^2$$</div></div>

<p class="l-text">Kareleri aç:</p>

<div class="calc-formula"><div class="formula-label">AÇILIM</div><div class="formula-main">$$a^2 \\;=\\; b^2\\cos^2 A - 2bc\\cos A + c^2 + b^2\\sin^2 A$$</div></div>

<p class="l-text">İki $b^2$ terimini grupla ve $\\sin^2 A + \\cos^2 A = 1$ özdeşliğini kullan:</p>

<div class="calc-formula"><div class="formula-label">PİSAGOR ÖZDEŞLİĞİYLE SADELEŞTİRME</div><div class="formula-main">$$a^2 \\;=\\; b^2(\\cos^2 A + \\sin^2 A) + c^2 - 2bc\\cos A \\;=\\; b^2 + c^2 - 2bc\\cos A$$</div><div class="formula-sub">Bu tam olarak $a$ kenarı için kosinüs teoremidir. Simetri (köşeleri yeniden adlandırma) ile diğer iki döngüsel formu elde ederiz.</div></div>

<p class="l-text">İşte kanıtın tamamı. İki bileşen: düzlemdeki uzaklık formülü ve Pisagor özdeşliği $\\sin^2 + \\cos^2 = 1$ (ki bu kendisi birim çember üzerinde uygulanan Pisagor teoremidir). Kosinüs teoremi gerçekten <em>iki kez</em> uygulanan Pisagor teoremidir: bir kez koordinatlarda uzaklıkları hesaplamak için, bir kez sinüs ve kosinüsü birleştirmek için.</p>

<h2 class="lesson-title">4. Neden Pisagor'a İndirgenir</h2>

<div class="calc-highlight"><strong>Kosinüs teoreminde $C = 90^\\circ$ koy.</strong> O zaman $\\cos C = \\cos 90^\\circ = 0$ olur, dolayısıyla düzeltme terimi $-2ab\\cos C$ kaybolur ve $c^2 = a^2 + b^2$ olur. Bu Pisagor teoremidir. Kosinüs teoremi gerçek bir genelleştirmedir — Pisagor'u özel bir durum olarak içerir.</div>

<div class="calc-formula"><div class="formula-label">ÖZEL DURUM C = 90&deg;</div><div class="formula-main">$$c^2 \\;=\\; a^2 + b^2 - 2ab\\underbrace{\\cos 90^\\circ}_{=\\,0} \\;=\\; a^2 + b^2$$</div><div class="formula-sub">$\\cos 90^\\circ = 0$ koy ve kosinüs teoremi Pisagor'a çöker.</div></div>

<div class="calc-graph"><div id="plot-l85-pythag-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı üçgen, ama bu kez $C = 90^\\circ$. $a$ ve $b$ kenarları birbirine dik, $c$ kenarı hipotenüs ve kosinüs teoremi $c^2 = a^2 + b^2 - 2ab\\cos C$, $\\cos 90^\\circ = 0$ olduğu için $c^2 = a^2 + b^2$ olur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;var Bx=4,By=0;var Cx=0,Cy=3;
var triPTR={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'dik üçgen',line:{color:'#3b82f6',width:2.8},marker:{color:'#3b82f6',size:8}};
var rightAngT={x:[0.3,0.3,0],y:[0,0.3,0.3],mode:'lines',name:'dik açı',line:{color:'#10b981',width:2}};
var labPTR={x:[-0.3,Bx+0.25,-0.3,(Bx+Cx)/2+0.3,-0.4,(Ax+Bx)/2],y:[-0.25,-0.25,Cy+0.25,(By+Cy)/2,(Ay+Cy)/2,-0.3],mode:'text',name:'etiketler',text:['A','B','C','c (hipotenüs)','b','a'],textfont:{color:['#e8e8e8','#e8e8e8','#e8e8e8','#f59e0b','#f59e0b','#f59e0b'],size:[15,15,15,13,14,14]},showlegend:false};
var equationT={x:[2],y:[1.6],mode:'text',name:'denklem',text:['cos 90° = 0<br>⇒ c² = a² + b²'],textfont:{color:'#10b981',size:14},showlegend:false};
var layPTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,5.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-0.8,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l85-pythag-tr',[triPTR,rightAngT,labPTR,equationT],layPTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$C = 60^\\circ$ ve $C = 120^\\circ$ olduğunda düzeltme terimi $-2ab\\cos C$ sana ne söyler? ($60^\\circ$'de: $\\cos = +1/2$, düzeltme $= -ab$, yani $c^2 = a^2 + b^2 - ab$ — Pisagor'dan küçük. $120^\\circ$'de: $\\cos = -1/2$, düzeltme $= +ab$, yani $c^2 = a^2 + b^2 + ab$ — Pisagor'dan büyük.)</div></div>

<h2 class="lesson-title">5. Sinüs Teoremi</h2>

<div class="calc-highlight"><strong>Sinüs teoremi, kosinüs teoreminin kardeşidir.</strong> Herhangi bir üçgende, bir kenarın karşı açısının sinüsüne oranı üç kenar için de aynıdır — ve bu ortak oran $2R$'ye eşittir, burada $R$ üçgenin çevrel çemberinin yarıçapıdır.</div>

<div class="calc-formula"><div class="formula-label">SİNÜS TEOREMİ</div><div class="formula-main">$$\\frac{a}{\\sin A} \\;=\\; \\frac{b}{\\sin B} \\;=\\; \\frac{c}{\\sin C} \\;=\\; 2R$$</div><div class="formula-sub">$R$ <em>çevrel yarıçaptır</em> — üç köşeden geçen biricik çemberin yarıçapı. Bu yarıçapın burada görünmesi, üçgeni çevreleyen çemberine bağlar.</div></div>

<p class="l-text"><strong>Hızlı bir türetme taslağı.</strong> $C$ köşesinden $c$ kenarına bir $h$ yüksekliği indir. Soldaki dik üçgen $\\sin A = h/b$ verir, yani $h = b\\sin A$. Sağdaki dik üçgen $\\sin B = h/a$ verir, yani $h = a\\sin B$. $h$ için iki ifadeyi eşitle: $b\\sin A = a\\sin B$, yani $a/\\sin A = b/\\sin B$. Üçüncü oranı eklemek için etiketleri döndür. $2R$ sabiti çevre açı teoreminden gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">En büyük açının karşısındaki kenar</div><div class="card-body">$\\sin$ $(0, 90^\\circ)$ üzerinde artan ve $(90^\\circ, 180^\\circ)$ üzerinde azalan olduğundan, en uzun kenar en büyük açının karşısındadır ve en kısa kenar en küçük açının karşısındadır. Buna bazen "büyük açının karşısındaki kenar daha uzun" kuralı denir.</div></div>
<div class="calc-card"><div class="card-title">Bir kenar için çözüm</div><div class="card-body">$A$ açısını, karşı kenarı $a$'yı ve başka bir $B$ açısını biliyorsan, $b = a \\cdot \\sin B / \\sin A$. Bir özdeşlik, iki çapraz çarpım.</div></div>
<div class="calc-card"><div class="card-title">Çevrel yarıçap formülü</div><div class="card-body">$a / \\sin A = 2R$'den $R = a / (2 \\sin A)$ çıkar. Herhangi bir kenarı ve karşı açısını bilmek, çevrel çemberin yarıçapını bedava verir.</div></div>
</div>

<h2 class="lesson-title">6. Hangi Yasayı Ne Zaman Kullanmalı</h2>

<div class="calc-highlight"><strong>Bir üçgenin altı ölçüsü vardır (üç kenar, üç açı).</strong> Üçünü biliyorsan (ve aralarında en az bir kenar varsa), diğer üçü genellikle belirlenir. Hangi yasayı kullanacağın, <em>hangi</em> üçü bildiğine bağlıdır.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Bildiğin</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Kısaltma</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Hangi yasa</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Notlar</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">İki kenar + aralarındaki açı</td><td style="padding:0.5rem 0.8rem"><strong>SAS</strong></td><td style="padding:0.5rem 0.8rem;color:#3b82f6">Kosinüs</td><td style="padding:0.5rem 0.8rem">Doğrudan yerine koy: $c^2 = a^2 + b^2 - 2ab\\cos C$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Üç kenar</td><td style="padding:0.5rem 0.8rem"><strong>SSS</strong></td><td style="padding:0.5rem 0.8rem;color:#3b82f6">Kosinüs</td><td style="padding:0.5rem 0.8rem">Açıyı çöz: $\\cos C = (a^2 + b^2 - c^2)/(2ab)$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Açı, açı, kenar</td><td style="padding:0.5rem 0.8rem"><strong>AAS</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">Sinüs</td><td style="padding:0.5rem 0.8rem">Üçüncü açı $180^\\circ$ eksi diğer iki açı, sonra sinüs oranı</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Açı, kenar, açı</td><td style="padding:0.5rem 0.8rem"><strong>ASA</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">Sinüs</td><td style="padding:0.5rem 0.8rem">Üçüncü açıyı bulunca AAS ile aynı</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Kenar, kenar, dışındaki açı</td><td style="padding:0.5rem 0.8rem"><strong>SSA</strong></td><td style="padding:0.5rem 0.8rem;color:#f59e0b">Sinüs (belirsiz!)</td><td style="padding:0.5rem 0.8rem">0, 1 veya 2 üçgen verebilir &mdash; 9. bölüm</td></tr>
</tbody></table>
</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">KOSİNÜS YASASINI KULLAN</div><div class="compare-item">Üç kenarı bildiğinde (SSS)</div><div class="compare-item">İki kenarı ve <em>aralarındaki</em> açıyı bildiğinde (SAS)</div><div class="compare-item">Bilinmeyen üçüncü kenar ya da herhangi bir açıysa</div><div class="compare-item">Üçgenin bariz bir dik açısı yoksa</div></div><div class="compare-col"><div class="compare-title">SİNÜS YASASINI KULLAN</div><div class="compare-item">İki açıyı ve herhangi bir kenarı bildiğinde (AAS veya ASA)</div><div class="compare-item">İki kenarı ve <em>dışında kalan</em> açıyı bildiğinde (SSA) — belirsizliğe dikkat</div><div class="compare-item">Bilinen bir açının karşısındaki kenarı bulman gerektiğinde</div><div class="compare-item">Çevrel yarıçap $R$'ye ihtiyacın olduğunda</div></div></div>

<h2 class="lesson-title">7. Çözümlü Örnek 1 &mdash; SAS</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>$a = 5$, $b = 7$, $C = 60^\\circ$ verildiğinde, $c$ kenarını bul.</strong><br><br>Bu SAS: iki kenar ve aralarındaki açı. Kosinüs teoremini doğrudan kullan.<br><br>$c^2 = a^2 + b^2 - 2ab\\cos C = 25 + 49 - 2 \\cdot 5 \\cdot 7 \\cdot \\cos 60^\\circ$<br><br>$\\cos 60^\\circ = 1/2$, yani $2ab\\cos C = 70 \\cdot 1/2 = 35$.<br><br>$c^2 = 74 - 35 = 39$.<br><br>$c = \\sqrt{39} \\approx \\mathbf{6.245}$.<br><br>Dikkat: $c$, $7 - 5 = 2$ (üçgen eşitsizliği alt sınırı) ile $7 + 5 = 12$ (üst sınır) arasında yer alıyor ve $\\sqrt{a^2 + b^2} = \\sqrt{74} \\approx 8.6$'nın biraz altında kalıyor — beklendiği gibi, çünkü $C < 90^\\circ$.</div></div>

<h2 class="lesson-title">8. Çözümlü Örnek 2 &mdash; SSS</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>$a = 8$, $b = 10$, $c = 12$ verildiğinde, $A$ açısını bul.</strong><br><br>Bu SSS. Kosinüs teoremi $a^2 = b^2 + c^2 - 2bc\\cos A$'yı $\\cos A$ için yeniden düzenle:<br><br>$\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc} = \\dfrac{100 + 144 - 64}{2 \\cdot 10 \\cdot 12} = \\dfrac{180}{240} = 0.75$.<br><br>$A = \\cos^{-1}(0.75) \\approx \\mathbf{41.41^\\circ}$.<br><br>Tutarlılık kontrolü: $a = 8$ en kısa kenar, dolayısıyla karşı açı $A$ en küçük olmalı. Benzer şekilde $B \\approx 55.77^\\circ$ ve $C \\approx 82.82^\\circ$ hesaplayabiliriz; toplamları gerektiği gibi $180^\\circ$, en büyük açı $C$ en uzun kenar $c = 12$'nin karşısında.</div></div>

<h2 class="lesson-title">9. Çözümlü Örnek 3 &mdash; Sinüs Teoremi (AAS)</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>$a = 10$, $A = 30^\\circ$, $B = 45^\\circ$ verildiğinde, $b$ kenarını bul.</strong><br><br>Bu AAS. Sinüs teoremiyle, $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}$, yani $b = a \\cdot \\dfrac{\\sin B}{\\sin A}$.<br><br>$\\sin 30^\\circ = 0.5$ ve $\\sin 45^\\circ = \\sqrt{2}/2 \\approx 0.7071$.<br><br>$b = 10 \\cdot \\dfrac{0.7071}{0.5} = 10 \\cdot 1.4142 = \\mathbf{14.14}$.<br><br>Hazır buradayken, üçüncü açı $C = 180^\\circ - 30^\\circ - 45^\\circ = 105^\\circ$ ve üçüncü kenar $c = 10 \\cdot \\sin 105^\\circ / \\sin 30^\\circ \\approx 10 \\cdot 0.9659 / 0.5 = 19.32$. Çevrel yarıçap $R = a / (2\\sin A) = 10 / 1 = 10$.</div></div>

<h2 class="lesson-title">10. Çözümlü Örnek 4 &mdash; Gemi Navigasyonu</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body"><strong>İki gemi aynı limandan aynı anda ayrılır. Gemi 1, $40^\\circ$ rotasında $18$ km/saat hızla gider. Gemi 2, $115^\\circ$ rotasında $24$ km/saat hızla gider. 2 saat sonra aralarındaki uzaklık nedir?</strong><br><br>2 saat sonra Gemi 1 $a = 36$ km, Gemi 2 $b = 48$ km yol almıştır. Rotaları arasındaki açı (limanda) $115^\\circ - 40^\\circ = 75^\\circ$.<br><br>Üçgen SAS'tır: kenarları 36 ve 48, aralarındaki açı $75^\\circ$. Gemiler arasındaki uzaklık üçüncü kenar $c$:<br><br>$c^2 = 36^2 + 48^2 - 2 \\cdot 36 \\cdot 48 \\cdot \\cos 75^\\circ$<br><br>$= 1296 + 2304 - 3456 \\cdot 0.2588$<br><br>$= 3600 - 894.5$<br><br>$= 2705.5$<br><br>$c \\approx \\sqrt{2705.5} \\approx \\mathbf{52.0}$ km.<br><br>Yani iki saat sonra gemiler yaklaşık 52 km uzakta — üçgenin her iki kenarından da daha büyük, çünkü rotaları arasındaki açı geniş.</div></div>

<div class="calc-graph"><div id="plot-l85-ships-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijinde liman ve iki gemi yörüngesi. Gemi 1 (mavi, rota $40^\\circ$, $36$ km) ve Gemi 2 (turuncu, rota $115^\\circ$, $48$ km) iki saat sonra. Uç noktaları arasındaki kesik çizgi, kosinüs teoremiyle hesapladığımız uzaklıktır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function bearingT(deg, dist){var rad=(90-deg)*Math.PI/180;return {x:dist*Math.cos(rad),y:dist*Math.sin(rad)};}
var s1T=bearingT(40,36);
var s2T=bearingT(115,48);
var portT={x:[0],y:[0],mode:'markers+text',name:'Liman',marker:{color:'#e8e8e8',size:12},text:['Liman'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:12}};
var t1T={x:[0,s1T.x],y:[0,s1T.y],mode:'lines+markers',name:'Gemi 1 (40°, 36 km)',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:9}};
var t2T={x:[0,s2T.x],y:[0,s2T.y],mode:'lines+markers',name:'Gemi 2 (115°, 48 km)',line:{color:'#f59e0b',width:3},marker:{color:'#f59e0b',size:9}};
var connectT={x:[s1T.x,s2T.x],y:[s1T.y,s2T.y],mode:'lines+text',name:'uzaklık (~52 km)',line:{color:'#10b981',width:2.4,dash:'dash'},text:['','c ≈ 52 km'],textposition:'middle right',textfont:{color:'#10b981',size:12}};
var northRefT={x:[0,0],y:[0,55],mode:'lines',name:'Kuzey (referans)',line:{color:'rgba(255,255,255,0.25)',width:1,dash:'dot'}};
var layoutShipsTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Doğu (km)',range:[-10,55],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Kuzey (km)',range:[-25,40],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l85-ships-tr',[portT,t1T,t2T,connectT,northRefT],layoutShipsTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Belirsiz Durum (SSA)</h2>

<div class="calc-highlight"><strong>SSA özeldir.</strong> İki kenar ve aralarında olmayan bir açı verildiğinde, veriye uyan <em>iki</em> farklı üçgen olabilir, ya da <em>bir</em> tane, ya da <em>hiç</em>. Sinüs teoremi denklemi $\\sin B = b\\sin A / a$ ya $(0^\\circ, 180^\\circ)$ aralığında iki çözüme sahiptir — küçük bir açı ve onun bütünleyeni — ya bir çözüme ya da hiç (eğer sağ taraf $1$'i aşıyorsa).</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hiç üçgen yok</div><div class="card-body">$b\\sin A > a$ ise $\\sin B > 1$ olur ve çözümü yoktur, hiçbir üçgen uymaz. Verilen kenar üçüncü köşeye erişmek için çok kısadır.</div></div>
<div class="calc-card"><div class="card-title">Tam olarak bir üçgen</div><div class="card-body">$b\\sin A = a$ ise üçgen $B$'de dik açılıdır ve biriciktir. Ya da $a \\geq b$ ise bütünleyen açı sığmayacak kadar büyüktür, tek çözüm kalır.</div></div>
<div class="calc-card"><div class="card-title">İki üçgen</div><div class="card-body">$b\\sin A < a < b$ ve $A$ dar açıysa, hem $B$ hem $180^\\circ - B$ geçerlidir — aynı SSA verisini iki farklı üçgen paylaşır. Çizim yardımcı olur.</div></div>
</div>

<div class="l-note"><strong>İpucu:</strong> SAS ve SSS kosinüs teoremiyle hiçbir zaman belirsiz değildir — biricik üçgen belirlerler (var olduğunda). Belirsizlik yalnızca sinüs teoremi ile SSA'da vardır. Seçeneğin varsa (örneğin SAS verisi prensipte her iki yasayla saldırılabilir), tuzaktan kaçınmak için kosinüs teoremini tercih et.</div>

<h2 class="lesson-title">12. Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YANLIŞ &mdash; YAPMA</div><div class="compare-item">$c^2 = a^2 + b^2 + 2ab\\cos C$ yazmak (işaret hatası)</div><div class="compare-item">Verilen iki kenar arasında <em>olmayan</em> açıyı kullanmak</div><div class="compare-item">$\\cos$'un negatif olabileceğini unutmak (yani "düzeltme" işaret değiştirebilir)</div><div class="compare-item">$[-1, 1]$ dışındaki bir sayının $\\cos^{-1}$'ini almak</div><div class="compare-item">SSA belirsizliğini görmezden gelmek</div></div><div class="compare-col"><div class="compare-title">DOĞRU &mdash; HER ZAMAN</div><div class="compare-item">İşaret <strong>eksi</strong>: $c^2 = a^2 + b^2 - 2ab\\cos C$</div><div class="compare-item">Açı, verilen iki kenarın arasındaki açı olmalı</div><div class="compare-item">Ters kosinüs almadan önce $\\cos$ değerinin $[-1, 1]$ aralığında olduğunu doğrula</div><div class="compare-item">Üçgen eşitsizliğiyle tutarlılık kontrolü yap: her kenar diğer ikisinin toplamından küçük</div><div class="compare-item">SSA'da iki üçgenin uyup uyamayacağını kendine sor</div></div></div>

<h2 class="lesson-title">13. Alıştırma Problemleri</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 &mdash; SAS</div><div class="example-body"><strong>$a = 4$, $b = 6$, $C = 120^\\circ$ verildiğinde, $c$'yi bul.</strong><br><br>$\\cos 120^\\circ = -1/2$, yani $-2ab\\cos C = -2 \\cdot 24 \\cdot (-1/2) = +24$.<br><br>$c^2 = 16 + 36 + 24 = 76$, yani $c = \\sqrt{76} \\approx \\mathbf{8.72}$. Dikkat et: $c$, $\\sqrt{a^2 + b^2} = \\sqrt{52} \\approx 7.21$'i aşıyor — geniş açı için beklendiği gibi.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 &mdash; SSS</div><div class="example-body"><strong>$a = 7$, $b = 9$, $c = 10$ verildiğinde, $B$ açısını bul.</strong><br><br>$\\cos B = \\dfrac{a^2 + c^2 - b^2}{2ac} = \\dfrac{49 + 100 - 81}{140} = \\dfrac{68}{140} \\approx 0.4857$.<br><br>$B = \\cos^{-1}(0.4857) \\approx \\mathbf{60.95^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 &mdash; SAS</div><div class="example-body"><strong>Kenarları $8$ ve $11$ olan, bir iç açısı $80^\\circ$ olan bir paralelkenarın köşegen uzunluğunu bul.</strong><br><br>$80^\\circ$'nin karşısındaki köşegen $d^2 = 8^2 + 11^2 - 2 \\cdot 8 \\cdot 11 \\cdot \\cos 80^\\circ = 64 + 121 - 176 \\cdot 0.1736 \\approx 185 - 30.55 = 154.45$. Yani $d \\approx \\mathbf{12.43}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 &mdash; SSS</div><div class="example-body"><strong>Kenarları $5$, $12$, $13$ olan üçgenin açılarını bul.</strong><br><br>En uzun kenarın karşısındaki açıyı dene. $\\cos C = (25 + 144 - 169)/(2 \\cdot 5 \\cdot 12) = 0/120 = 0$, yani $C = 90^\\circ$. Bu meşhur $5$-$12$-$13$ Pisagor üçlüsüdür. Diğer açılar: $\\cos A = (144 + 169 - 25)/(2 \\cdot 12 \\cdot 13) = 288/312 \\approx 0.923$, yani $A \\approx \\mathbf{22.62^\\circ}$ ve $B = 180 - 90 - 22.62 \\approx \\mathbf{67.38^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 &mdash; AAS</div><div class="example-body"><strong>$A = 50^\\circ$, $B = 70^\\circ$, $a = 12$ verildiğinde, $c$'yi bul.</strong><br><br>$C = 180 - 50 - 70 = 60^\\circ$. Sinüs teoremiyle, $c = a\\sin C / \\sin A = 12 \\cdot \\sin 60^\\circ / \\sin 50^\\circ = 12 \\cdot 0.866 / 0.766 \\approx \\mathbf{13.57}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 &mdash; SAS, uygulamalı</div><div class="example-body"><strong>Bir arazi ölçümcüsü nehrin karşı yakasına olan uzaklığı bulmak istiyor. Kendi yakasındaki bir $P$ noktasından, karşı yakadaki bir $T$ ağacını ve kendi yakasında bir $L$ işaret noktasını görüyor; $PL = 80$ m. $P$'de $PT$ ile $PL$ arasındaki açıyı $63^\\circ$ olarak ölçüyor; $L$'ye yürüyor ve oradaki $LT$ ile $LP$ arasındaki açıyı $54^\\circ$ olarak ölçüyor. $PT$ uzaklığını bul.</strong><br><br>Üçüncü açı $T = 180 - 63 - 54 = 63^\\circ$. Sinüs teoremiyle, $PT / \\sin L = PL / \\sin T$, yani $PT = 80 \\cdot \\sin 54^\\circ / \\sin 63^\\circ = 80 \\cdot 0.809 / 0.891 \\approx \\mathbf{72.6}$ m.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 &mdash; SSA belirsiz</div><div class="example-body"><strong>$a = 10$, $b = 14$, $A = 35^\\circ$ verildiğinde, tüm olası $B$ değerlerini bul.</strong><br><br>$\\sin B = b\\sin A / a = 14 \\cdot \\sin 35^\\circ / 10 = 14 \\cdot 0.5736 / 10 = 0.8030$. $(0^\\circ, 180^\\circ)$ aralığında iki çözüm: $B_1 \\approx \\mathbf{53.4^\\circ}$ ve $B_2 = 180 - 53.4 = \\mathbf{126.6^\\circ}$. $a < b$ olduğundan ikisi de geçerli üçgen üretir.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 &mdash; ÇEVREL YARIÇAP</div><div class="example-body"><strong>$a = 10$ ve karşı açı $A = 30^\\circ$ olan bir üçgenin çevrel yarıçapını bul.</strong><br><br>$2R = a / \\sin A = 10 / 0.5 = 20$, yani $R = \\mathbf{10}$. Üçgenin köşeleri 10 yarıçaplı bir çember üzerindedir.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Kosinüs teoremi ve sinüs teoremi, üçgen çözmenin iki sütunudur. Birlikte, bir üçgeni biricik ya da belirsiz biçimde belirleyen her eşlik durumunu (SAS, SSS, AAS, ASA, SSA) ele alırlar. İlerideki derslerde onları arazi ölçümü, navigasyon, vektörler ve trigonometrik özdeşliklere uygulayacağız.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kosinüs teoremi: $c^2 = a^2 + b^2 - 2ab\\cos C$ (ve iki döngüsel döndürmesi)</li>
<li>Türetme: yükseklik indir, Pisagor'u iki kez uygula, $\\sin^2 + \\cos^2 = 1$'i kullan</li>
<li>$C = 90^\\circ$ olduğunda Pisagor'a indirgenir, çünkü $\\cos 90^\\circ = 0$</li>
<li>Sinüs teoremi: $a/\\sin A = b/\\sin B = c/\\sin C = 2R$</li>
<li>SAS, SSS &rarr; kosinüs teoremi; AAS, ASA &rarr; sinüs teoremi; SSA &rarr; sinüs teoremi, ama belirsizliğe dikkat</li>
<li>Kosinüs teoreminde işaret <strong>eksidir</strong>: $-2ab\\cos C$</li>
<li>Yaygın hatalar: yanlış işaret, yanlış arada açı, $[-1, 1]$ dışında $\\cos^{-1}$</li>
</ul>
</div>`

};
