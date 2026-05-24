/* ============================================================
   tutorials/matematik/L7.js
   Lesson 7 — Sinüs ve Kosinüs Teoremleri
   Pure educational content for Turkish high school students.
   No Python, no ML. Bilingual EN/TR with KaTeX + Plotly.
   ============================================================ */

window.LISE_MAT_L7 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `
<p class="l-text"><strong>The Law of Sines and the Law of Cosines are the two great theorems that let us solve <em>any</em> triangle</strong> — not just right triangles. In Lessons 4-5 we built the foundations of right-triangle trigonometry. But most triangles in the real world are not right-angled: a triangular plot of land, the path of a hiker who turns at an arbitrary angle, the geometry of a bridge truss. To handle these, we need two general identities that work in every triangle.</p>

<p class="l-text">In this lesson we derive both theorems, see how they cover all the standard "solve the triangle" cases (SSS, SAS, ASA, SSA), explore the famous <em>ambiguous case</em>, and finish with two beautiful area formulas. By the end you will be able to find every missing side and angle of any triangle given enough data.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State and prove the Law of Sines $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$</li>
<li>State and prove the Law of Cosines $c^2 = a^2 + b^2 - 2ab\\cos C$ and see Pythagoras as its special case</li>
<li>Diagnose a "solve the triangle" problem (SSS, SAS, ASA, AAS, SSA) and pick the correct theorem</li>
<li>Handle the SSA <em>ambiguous case</em>: when there are two triangles, one, or none</li>
<li>Compute the area of any triangle from $S = \\tfrac{1}{2}ab\\sin C$ or Heron's formula</li>
<li>Apply the theorems to real-life problems in surveying, navigation, and geometry</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1: The Triangle-Solving Problem
     ============================================================ -->
<h2 class="l-title">1. The Triangle-Solving Problem</h2>

<div class="l-highlight"><strong>What does "solve a triangle" mean?</strong> A triangle has six elements: three sides $a, b, c$ and three angles $A, B, C$. If we know <em>three</em> of them (with at least one being a side), the other three are usually determined. Finding them is called <strong>solving the triangle</strong>.</div>

<p class="l-text">In right-triangle trigonometry we always assumed one angle was 90°, so SOH-CAH-TOA was enough. But what if no angle is 90°? Consider a surveyor measuring a triangular field: she walks the three sides with a measuring tape and gets $a = 50$ m, $b = 70$ m, $c = 90$ m. None of the angles are right angles. SOH-CAH-TOA fails. We need a more powerful tool.</p>

<p class="l-text">There are five standard data configurations:</p>

<ul class="l-list">
<li><strong>SSS</strong> — three sides given. Find all three angles.</li>
<li><strong>SAS</strong> — two sides and the angle <em>between</em> them. Find the third side and the other two angles.</li>
<li><strong>ASA</strong> — two angles and the side <em>between</em> them. Find the third angle and the other two sides.</li>
<li><strong>AAS</strong> — two angles and a side <em>not</em> between them. (Equivalent to ASA once you compute the third angle.)</li>
<li><strong>SSA</strong> — two sides and an angle opposite one of them. <em>The ambiguous case</em>: 0, 1, or 2 triangles possible.</li>
</ul>

<p class="l-text">A configuration that does <em>not</em> determine a triangle is <strong>AAA</strong> — three angles alone. Infinitely many similar triangles share the same angles (scaled up or down), so we cannot find absolute side lengths.</p>

<div class="l-highlight"><strong>Naming convention.</strong> Throughout this lesson, side $a$ is opposite angle $A$, side $b$ opposite $B$, side $c$ opposite $C$. This is the universal convention; memorising it once saves confusion later.</div>

<!-- ============================================================
     SECTION 2: Law of Sines — Derivation
     ============================================================ -->
<h2 class="l-title">2. Law of Sines: Derivation</h2>

<p class="l-text">Take any triangle $ABC$ and drop the altitude $h$ from vertex $C$ to side $AB$. This splits the original triangle into two right triangles, both sharing the same height $h$.</p>

<p class="l-text">In the right triangle on the left:</p>

$$\\sin A = \\frac{h}{b} \\quad\\Longrightarrow\\quad h = b \\sin A.$$

<p class="l-text">In the right triangle on the right:</p>

$$\\sin B = \\frac{h}{a} \\quad\\Longrightarrow\\quad h = a \\sin B.$$

<p class="l-text">Setting these two expressions for $h$ equal:</p>

$$b \\sin A = a \\sin B \\quad\\Longleftrightarrow\\quad \\frac{a}{\\sin A} = \\frac{b}{\\sin B}.$$

<p class="l-text">If we instead drop the altitude from vertex $A$ onto side $BC$, the same argument with sides $b, c$ and angles $B, C$ gives</p>

$$\\frac{b}{\\sin B} = \\frac{c}{\\sin C}.$$

<p class="l-text">Combining both,</p>

<div class="l-highlight" style="text-align:center"><strong>LAW OF SINES</strong><br>
$$\\boxed{\\;\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}\\;}$$</div>

<p class="l-text"><strong>What the proof needed.</strong> Only the right-triangle definition of $\\sin$ and the fact that an altitude exists in every triangle. The proof works whether the triangle is acute, right, or obtuse — in the obtuse case the foot of the altitude lies outside the opposite side, but the same equality between two heights still holds (with an angle replaced by its supplement, whose sine is the same).</p>

<div class="l-note"><strong>Why is this useful?</strong> Given any one ratio $\\frac{a}{\\sin A}$, you immediately know the common value of all three ratios. So if you know one side and its opposite angle, you can find any other side from its opposite angle and vice versa.</div>

<!-- ============================================================
     SECTION 3: The Circumradius Connection (2R)
     ============================================================ -->
<h2 class="l-title">3. The Circumradius — $2R$ Equality</h2>

<p class="l-text">There is a beautiful geometric meaning hiding in the common ratio $\\frac{a}{\\sin A}$: <strong>it equals the diameter of the circumscribed circle</strong>.</p>

<p class="l-text">Every triangle has a unique <em>circumscribed circle</em> (or <strong>circumcircle</strong>) — the circle passing through all three vertices. Let $R$ denote its radius. Then</p>

$$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R.$$

<p class="l-text"><strong>Sketch of proof.</strong> Draw the diameter through vertex $B$; call its other end $B'$. The inscribed angle $\\angle BAB' = 90°$ (Thales' theorem). In the right triangle $ABB'$, side $a = BC$ is opposite the inscribed angle $\\angle BAC = A$; sides of the same chord subtend the same inscribed angle, so $\\sin A = \\frac{a}{2R}$, giving $\\frac{a}{\\sin A} = 2R$.</p>

<div id="plot-sine-law-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
  var R=1, n=120;
  var cx=[], cy=[];
  for(var i=0;i<=n;i++){ var t=2*Math.PI*i/n; cx.push(R*Math.cos(t)); cy.push(R*Math.sin(t)); }
  var A={x:R*Math.cos(110*Math.PI/180), y:R*Math.sin(110*Math.PI/180)};
  var B={x:R*Math.cos(-30*Math.PI/180), y:R*Math.sin(-30*Math.PI/180)};
  var C={x:R*Math.cos(200*Math.PI/180), y:R*Math.sin(200*Math.PI/180)};
  var tri={x:[A.x,B.x,C.x,A.x], y:[A.y,B.y,C.y,A.y], mode:"lines+markers", name:"Triangle ABC", line:{color:"#c8a96e",width:2.5}, marker:{size:8,color:"#c8a96e"}};
  var circ={x:cx, y:cy, mode:"lines", name:"Circumcircle (radius R)", line:{color:"#06b6d4",width:1.5,dash:"dot"}};
  var ctr={x:[0], y:[0], mode:"markers+text", text:["O"], textposition:"top right", marker:{size:6,color:"#f87171"}, showlegend:false};
  var labels={x:[A.x*1.12,B.x*1.12,C.x*1.12], y:[A.y*1.12,B.y*1.12,C.y*1.12], mode:"text", text:["A","B","C"], textfont:{color:"#ebe6dc",size:16}, showlegend:false};
  var diam={x:[A.x,-A.x], y:[A.y,-A.y], mode:"lines", name:"Diameter through A (2R)", line:{color:"#a855f7",width:1.5,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{range:[-1.4,1.4],zeroline:false,showgrid:false,visible:false,scaleanchor:"y"},yaxis:{range:[-1.4,1.4],zeroline:false,showgrid:false,visible:false},margin:{t:30,r:20,b:50,l:20},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.05}};
  Plotly.newPlot("plot-sine-law-en",[circ,tri,diam,ctr,labels],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">The triangle inscribed in its circumcircle. The diameter $2R$ relates every side to the sine of its opposite angle: $\\frac{a}{\\sin A} = 2R$.</p>

<div class="l-note"><strong>Quick check.</strong> In an equilateral triangle with side $a$ and angle $60°$ at every vertex, $\\frac{a}{\\sin 60°} = \\frac{a}{\\sqrt{3}/2} = \\frac{2a}{\\sqrt{3}}$. So the circumradius is $R = \\frac{a}{\\sqrt{3}}$ — a result you may also remember from geometry.</div>

<!-- ============================================================
     SECTION 4: Law of Cosines — Derivation
     ============================================================ -->
<h2 class="l-title">4. Law of Cosines: Derivation</h2>

<p class="l-text">The Law of Sines pairs a side with its <em>opposite</em> angle. But what if we know two sides and the angle <em>between</em> them (SAS), and we want the third side? Then no opposite angle is available, and the Law of Sines is not directly usable. We need a different identity.</p>

<p class="l-text">Place the triangle in a coordinate system: put vertex $C$ at the origin, side $a$ (opposite $A$) along the positive $x$-axis, so vertex $B$ is at $(a, 0)$. The angle at $C$ is $C$, so vertex $A$ is at $(b\\cos C, b\\sin C)$.</p>

<p class="l-text">By the distance formula, the length of side $c$ (from $A$ to $B$) is</p>

$$c^2 = (a - b\\cos C)^2 + (0 - b\\sin C)^2.$$

<p class="l-text">Expand:</p>

$$c^2 = a^2 - 2ab\\cos C + b^2\\cos^2 C + b^2\\sin^2 C.$$

<p class="l-text">Group the last two terms and apply the Pythagorean identity $\\sin^2 C + \\cos^2 C = 1$:</p>

$$c^2 = a^2 + b^2(\\cos^2 C + \\sin^2 C) - 2ab\\cos C = a^2 + b^2 - 2ab\\cos C.$$

<div class="l-highlight" style="text-align:center"><strong>LAW OF COSINES</strong><br>
$$\\boxed{\\;c^2 = a^2 + b^2 - 2ab\\cos C\\;}$$<br>
and by symmetry<br>
$$a^2 = b^2 + c^2 - 2bc\\cos A,\\qquad b^2 = a^2 + c^2 - 2ac\\cos B.$$</div>

<p class="l-text"><strong>How to read this.</strong> The unknown side squared equals the sum of the squares of the other two sides, minus twice their product times the cosine of the angle between them. The "minus" is critical — it is the <em>correction</em> to Pythagoras when the included angle is not 90°.</p>

<!-- ============================================================
     SECTION 5: The Law of Cosines as Generalised Pythagoras
     ============================================================ -->
<h2 class="l-title">5. The Law of Cosines as Generalised Pythagoras</h2>

<p class="l-text">Set $C = 90°$ in the Law of Cosines. Then $\\cos 90° = 0$, and the equation collapses to</p>

$$c^2 = a^2 + b^2 - 2ab \\cdot 0 = a^2 + b^2.$$

<p class="l-text">That is the Pythagorean Theorem. The Law of Cosines is its <strong>generalisation to non-right triangles</strong>. The extra term $-2ab\\cos C$ measures how far the included angle deviates from $90°$:</p>

<ul class="l-list">
<li>If $C < 90°$ (acute), then $\\cos C > 0$, so $-2ab\\cos C < 0$. We <em>subtract</em> something from $a^2 + b^2$, making $c$ <strong>shorter</strong> than the Pythagorean prediction.</li>
<li>If $C = 90°$ (right), the correction vanishes and Pythagoras applies exactly.</li>
<li>If $C > 90°$ (obtuse), then $\\cos C < 0$, so $-2ab\\cos C > 0$. We <em>add</em> something, making $c$ <strong>longer</strong> than $\\sqrt{a^2 + b^2}$.</li>
</ul>

<div id="plot-cosine-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var a=3, b=4;
  var angles=[];
  var cs=[];
  var pyth=Math.sqrt(a*a+b*b);
  var pyL=[];
  for(var deg=10; deg<=170; deg+=2){
    var C=deg*Math.PI/180;
    var c=Math.sqrt(a*a+b*b-2*a*b*Math.cos(C));
    angles.push(deg); cs.push(c); pyL.push(pyth);
  }
  var t1={x:angles, y:cs, mode:"lines", name:"c (Law of Cosines)", line:{color:"#c8a96e",width:3}};
  var t2={x:angles, y:pyL, mode:"lines", name:"Pythagoras (a²+b²)^(1/2)", line:{color:"#06b6d4",width:2,dash:"dash"}};
  var t3={x:[90], y:[pyth], mode:"markers+text", text:["C=90° → c=√(9+16)=5"], textposition:"top center", marker:{size:10,color:"#f87171"}, showlegend:false, textfont:{color:"#f87171",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"Included angle C (degrees)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"Third side c",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:30,r:30,b:60,l:55},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-cosine-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">With $a=3$, $b=4$ fixed: as the included angle $C$ sweeps from $10°$ to $170°$, the third side $c$ grows from short (small $C$) through $5$ (Pythagoras at $C=90°$) to nearly $a+b=7$ as $C$ approaches $180°$.</p>

<!-- ============================================================
     SECTION 6: The Five Solving Cases (SSS, SAS, ASA, AAS, SSA)
     ============================================================ -->
<h2 class="l-title">6. The Solving Cases — Which Theorem Goes Where?</h2>

<p class="l-text">A reliable mental checklist:</p>

<table class="l-table" style="width:100%;border-collapse:collapse;margin:1rem 0">
<thead><tr style="background:rgba(200,169,110,0.10);border-bottom:2px solid #c8a96e">
<th style="text-align:left;padding:0.55rem">Given</th><th style="text-align:left;padding:0.55rem">First step</th><th style="text-align:left;padding:0.55rem">Then</th><th style="text-align:left;padding:0.55rem">Comment</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>SSS</strong> (a, b, c)</td><td style="padding:0.5rem">Law of Cosines for one angle</td><td style="padding:0.5rem">Law of Sines for the second</td><td style="padding:0.5rem">Third angle from $A+B+C=180°$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>SAS</strong> (b, c, A)</td><td style="padding:0.5rem">Law of Cosines for $a$</td><td style="padding:0.5rem">Law of Sines for an angle</td><td style="padding:0.5rem">Always unique</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>ASA</strong> (A, B, c)</td><td style="padding:0.5rem">$C=180°-A-B$</td><td style="padding:0.5rem">Law of Sines for $a, b$</td><td style="padding:0.5rem">Always unique</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>AAS</strong> (A, B, a)</td><td style="padding:0.5rem">$C=180°-A-B$</td><td style="padding:0.5rem">Law of Sines for $b, c$</td><td style="padding:0.5rem">Always unique</td></tr>
<tr><td style="padding:0.5rem"><strong>SSA</strong> (a, b, A)</td><td style="padding:0.5rem">Law of Sines for $B$</td><td style="padding:0.5rem">Check the count of solutions</td><td style="padding:0.5rem"><strong>Ambiguous</strong> — may be 0, 1, or 2 triangles</td></tr>
</tbody></table>

<div class="l-note"><strong>Rule of thumb.</strong> When you can pair a side with its opposite angle, use the <em>Law of Sines</em>. When the only given angle sits between two given sides, or you only have three sides, use the <em>Law of Cosines</em>.</div>

<!-- ============================================================
     SECTION 7: The Ambiguous Case (SSA)
     ============================================================ -->
<h2 class="l-title">7. The Ambiguous Case (SSA)</h2>

<p class="l-text">SSA is special: knowing two sides and an angle <em>not</em> between them sometimes leaves the third side undetermined. Geometrically, suppose we know $a$ (opposite the given angle $A$) and $b$ (an adjacent side). We have to draw a circular arc of radius $a$ centred at vertex $C$ and see where it crosses the ray from $A$ at angle $A$. That arc may miss the ray, touch it once, or cross it twice.</p>

<p class="l-text">Apply the Law of Sines to look for $B$:</p>

$$\\sin B = \\frac{b \\sin A}{a}.$$

<p class="l-text">Now read off three cases (assume $A$ is acute):</p>

<ul class="l-list">
<li><strong>No solution</strong>: if $\\frac{b \\sin A}{a} > 1$, there is no angle $B$ with that sine — the arc is too short to reach the ray. The given data is inconsistent: <em>no triangle exists</em>.</li>
<li><strong>One solution</strong>: if $\\frac{b \\sin A}{a} = 1$, then $B = 90°$ — the arc is tangent to the ray. Or if $a \\ge b$, the supplementary angle would exceed $180°-A$, leaving only the acute $B$. <em>Exactly one triangle</em>.</li>
<li><strong>Two solutions</strong>: if $\\frac{b \\sin A}{a} < 1$ <em>and</em> $a < b$, both an acute $B_1$ and an obtuse $B_2 = 180° - B_1$ produce valid triangles, because $B_2 + A < 180°$. <em>Two triangles</em>.</li>
</ul>

<p class="l-text">If $A$ is obtuse or a right angle, the analysis simplifies: in those cases there can be at most one triangle (a second obtuse angle would push the sum over $180°$).</p>

<div class="l-note"><strong>Memorise this picture.</strong> Imagine fixing angle $A$ at vertex $A$ and side $b$ going up to a movable vertex $C$. From $C$ swing a compass of radius $a$. Two crossings = two triangles. One crossing = one. Zero crossings = none.</div>

<!-- ============================================================
     SECTION 8: Area of a Triangle
     ============================================================ -->
<h2 class="l-title">8. Area of a Triangle</h2>

<p class="l-text">Two general-purpose formulas:</p>

<h3 class="l-subtitle">(a) Two sides and the included angle</h3>

<p class="l-text">In a triangle with sides $a, b$ and included angle $C$, drop the altitude from the vertex opposite to $a$. Its length is $h = b \\sin C$. The base is $a$, so</p>

$$\\boxed{\\;S = \\tfrac{1}{2} a b \\sin C\\;}$$

<p class="l-text">By symmetry, $S = \\tfrac{1}{2}bc\\sin A = \\tfrac{1}{2}ac\\sin B$. This is by far the most useful area formula in trigonometry: any two sides and the included angle give the area directly, with no need to find the height.</p>

<h3 class="l-subtitle">(b) Heron's formula (three sides)</h3>

<p class="l-text">When only the three sides $a, b, c$ are known, compute the <em>semi-perimeter</em></p>

$$s = \\frac{a + b + c}{2}.$$

<p class="l-text">Then</p>

$$\\boxed{\\;S = \\sqrt{s(s-a)(s-b)(s-c)}\\;}$$

<p class="l-text">This famous result is attributed to Heron of Alexandria (1st century AD). It can be derived from the Law of Cosines combined with $S = \\tfrac{1}{2}ab\\sin C$ and $\\sin^2 C = 1 - \\cos^2 C$.</p>

<div id="plot-area-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var a=5, b=7;
  var angles=[];
  var areas=[];
  for(var deg=5; deg<=175; deg+=2){
    var C=deg*Math.PI/180;
    var S=0.5*a*b*Math.sin(C);
    angles.push(deg); areas.push(S);
  }
  var t1={x:angles, y:areas, mode:"lines", name:"S = ½·a·b·sin(C)", line:{color:"#4de87a",width:3}};
  var t2={x:[90], y:[17.5], mode:"markers+text", text:["Max area at C=90°: S=½·5·7=17.5"], textposition:"top center", marker:{size:10,color:"#f87171"}, textfont:{color:"#f87171",size:11}, showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"Included angle C (degrees)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"Area S",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:30,r:30,b:60,l:55},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-area-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">With $a=5$, $b=7$ fixed: the area $S = \\tfrac{1}{2}ab\\sin C$ peaks at $C = 90°$ (right triangle) and tends to zero at both $C \\to 0°$ and $C \\to 180°$ (degenerate triangle).</p>

<!-- ============================================================
     SECTION 9: Worked Exercises
     ============================================================ -->
<h2 class="l-title">9. Classical Exercises</h2>

<h3 class="l-subtitle">Problem 1 — SAS, find a side</h3>
<p class="l-text">A triangle has $b = 10$, $c = 14$, $A = 60°$. Find $a$.</p>
<p class="l-text"><em>Solution.</em> Law of Cosines:</p>

$$a^2 = b^2 + c^2 - 2bc\\cos A = 100 + 196 - 280 \\cdot \\tfrac{1}{2} = 296 - 140 = 156.$$

<p class="l-text">So $a = \\sqrt{156} \\approx 12.49$.</p>

<h3 class="l-subtitle">Problem 2 — SSS, find an angle</h3>
<p class="l-text">A triangular plot has sides $a = 7, b = 8, c = 9$ metres. Find angle $C$.</p>
<p class="l-text"><em>Solution.</em> Rearrange the Law of Cosines:</p>

$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab} = \\frac{49 + 64 - 81}{2 \\cdot 7 \\cdot 8} = \\frac{32}{112} = \\frac{2}{7}.$$

<p class="l-text">$C = \\arccos(2/7) \\approx 73.4°$.</p>

<h3 class="l-subtitle">Problem 3 — ASA, find a side</h3>
<p class="l-text">$A = 40°$, $B = 65°$, $c = 12$. Find $a$.</p>
<p class="l-text"><em>Solution.</em> $C = 180° - 40° - 65° = 75°$. By the Law of Sines,</p>

$$a = \\frac{c \\sin A}{\\sin C} = \\frac{12 \\sin 40°}{\\sin 75°} \\approx \\frac{12 \\cdot 0.6428}{0.9659} \\approx 7.99.$$

<h3 class="l-subtitle">Problem 4 — SSA, ambiguous</h3>
<p class="l-text">$a = 5$, $b = 7$, $A = 35°$. Find $B$.</p>
<p class="l-text"><em>Solution.</em> $\\sin B = \\frac{b \\sin A}{a} = \\frac{7 \\sin 35°}{5} \\approx \\frac{4.015}{5} \\approx 0.803.$</p>
<p class="l-text">Since $\\sin B < 1$ and $a < b$, both an acute solution $B_1 \\approx 53.4°$ and an obtuse $B_2 = 180° - 53.4° = 126.6°$ give valid triangles (both satisfy $A + B < 180°$). <strong>Two triangles exist.</strong></p>

<h3 class="l-subtitle">Problem 5 — Surveying</h3>
<p class="l-text">Two surveyors stand $200$ m apart on level ground. They both sight a distant flagpole, and measure the angles between the line joining them and the line to the flagpole: $52°$ from one position, $68°$ from the other. How far is the flagpole from each surveyor?</p>
<p class="l-text"><em>Solution.</em> The flagpole and the two surveyors form a triangle. The angle at the flagpole is $180° - 52° - 68° = 60°$. By the Law of Sines:</p>

$$\\frac{200}{\\sin 60°} = \\frac{d_1}{\\sin 68°} = \\frac{d_2}{\\sin 52°}.$$

<p class="l-text">$d_1 = \\frac{200 \\sin 68°}{\\sin 60°} \\approx \\frac{200 \\cdot 0.9272}{0.8660} \\approx 214.1$ m, and $d_2 \\approx 182.0$ m.</p>

<h3 class="l-subtitle">Problem 6 — Area, mixed data</h3>
<p class="l-text">Find the area of a triangle with $a = 6$, $b = 9$, $C = 30°$.</p>
<p class="l-text"><em>Solution.</em> Two sides and included angle — use $S = \\tfrac{1}{2}ab\\sin C$.</p>

$$S = \\tfrac{1}{2} \\cdot 6 \\cdot 9 \\cdot \\sin 30° = 27 \\cdot \\tfrac{1}{2} = 13.5.$$

<div class="l-highlight"><strong>Take-away.</strong> Always identify the data configuration first (SSS / SAS / ASA / AAS / SSA). Then pick: <em>included angle or three sides</em> → Law of Cosines; <em>side paired with its opposite angle</em> → Law of Sines. The Law of Cosines reduces to Pythagoras when the angle is $90°$. The area formula $\\tfrac{1}{2}ab\\sin C$ is the trigonometric workhorse; Heron's formula handles the SSS case directly from the sides.</div>

<p class="l-text">In the next lesson we move from triangle geometry to <strong>trigonometric identities</strong> — algebraic equalities that hold for every angle, used to simplify expressions and solve equations far beyond the scope of triangle solving.</p>
`,

/* ============================================================
   TURKISH VERSION (TR)
   ============================================================ */
tr: `
<p class="l-text"><strong>Sinüs ve Kosinüs Teoremleri, <em>herhangi bir</em> üçgeni — yalnızca dik üçgenleri değil — çözmemizi sağlayan iki büyük teoremdir.</strong> Ders 4-5'te dik üçgen trigonometrisinin temellerini kurduk. Ama gerçek dünyadaki üçgenlerin çoğu dik açılı değildir: üçgen bir arazi, herhangi bir açıyla dönen bir yürüyüşçünün izlediği yol, bir köprü makasının geometrisi… Bunlarla başa çıkmak için her üçgende geçerli iki genel özdeşliğe ihtiyacımız var.</p>

<p class="l-text">Bu derste iki teoremi de türeteceğiz, standart "üçgeni çöz" durumlarının (KKK, KAK, AKA, AAK, KKA) hepsini nasıl kapsadıklarını göreceğiz, ünlü <em>belirsiz durumu</em> inceleyeceğiz ve iki güzel alan formülüyle bitireceğiz. Dersin sonunda yeterli veri verildiğinde herhangi bir üçgenin tüm eksik kenar ve açılarını bulabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sinüs Teoremini ifade etmek ve ispatlamak: $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$</li>
<li>Kosinüs Teoremini ifade etmek ve ispatlamak: $c^2 = a^2 + b^2 - 2ab\\cos C$; Pisagor'u onun özel hali olarak görmek</li>
<li>Bir "üçgeni çöz" sorusunu tanımak (KKK, KAK, AKA, AAK, KKA) ve doğru teoremi seçmek</li>
<li>KKA <em>belirsiz durumunu</em> ele almak: iki üçgen, bir üçgen veya hiç üçgen yok</li>
<li>Herhangi bir üçgenin alanını $S = \\tfrac{1}{2}ab\\sin C$ ya da Heron formülüyle hesaplamak</li>
<li>Teoremleri arazi ölçümü, denizcilik/havacılık ve geometriden gerçek hayat problemlerine uygulamak</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1: Üçgen Çözme Problemi
     ============================================================ -->
<h2 class="l-title">1. Üçgen Çözme Problemi</h2>

<div class="l-highlight"><strong>"Üçgeni çözmek" ne demek?</strong> Bir üçgenin altı öğesi vardır: üç kenar $a, b, c$ ve üç açı $A, B, C$. Bunlardan <em>üçünü</em> bilirsek (en az biri kenar olmak üzere) diğer üçü genellikle tek biçimde belirlenir. Bunları bulma işlemine <strong>üçgeni çözmek</strong> denir.</div>

<p class="l-text">Dik üçgen trigonometrisinde bir açının her zaman 90° olduğunu varsaydık; SOH-CAH-TOA (yani $\\sin = \\frac{\\text{karşı}}{\\text{hipotenüs}}$ vb.) yeterliydi. Peki hiçbir açı 90° değilse? Bir mühendisin üçgen bir tarlayı ölçtüğünü düşünün: kenarları şeritle ölçüyor ve $a = 50$ m, $b = 70$ m, $c = 90$ m buluyor. Açıların hiçbiri dik değil. SOH-CAH-TOA çalışmaz. Daha güçlü bir araca ihtiyacımız var.</p>

<p class="l-text">Beş standart veri yapısı vardır:</p>

<ul class="l-list">
<li><strong>KKK</strong> — üç kenar verilmiş. Üç açıyı bul.</li>
<li><strong>KAK</strong> — iki kenar ve <em>aralarındaki</em> açı. Üçüncü kenarı ve diğer iki açıyı bul.</li>
<li><strong>AKA</strong> — iki açı ve <em>aralarındaki</em> kenar. Üçüncü açıyı ve diğer iki kenarı bul.</li>
<li><strong>AAK</strong> — iki açı ve aralarında <em>olmayan</em> bir kenar. (Üçüncü açıyı hesaplayınca AKA'ya dönüşür.)</li>
<li><strong>KKA</strong> — iki kenar ve bunlardan birinin karşısındaki açı. <em>Belirsiz durum</em>: 0, 1 veya 2 üçgen mümkün olabilir.</li>
</ul>

<p class="l-text">Üçgeni belirlemeyen bir yapı da vardır: <strong>AAA</strong> — yalnız üç açı. Aynı açılara sahip sonsuz sayıda benzer üçgen olduğundan (ölçek değişebilir) mutlak kenar uzunluklarını bulamayız.</p>

<div class="l-highlight"><strong>İsimlendirme kuralı.</strong> Bu ders boyunca $a$ kenarı $A$ açısının karşısındadır, $b$ kenarı $B$ açısının, $c$ kenarı $C$ açısının. Bu evrensel bir kuraldır; bir kez ezberleyince ileride karışıklık çıkmaz.</div>

<!-- ============================================================
     BÖLÜM 2: Sinüs Teoremi — Türetim
     ============================================================ -->
<h2 class="l-title">2. Sinüs Teoremi: Türetim</h2>

<p class="l-text">Herhangi bir $ABC$ üçgeni alın ve $C$ köşesinden $AB$ kenarına yükseklik $h$ indirin. Bu, asıl üçgeni iki dik üçgene böler; ikisi de aynı $h$ yüksekliğini paylaşır.</p>

<p class="l-text">Soldaki dik üçgende:</p>

$$\\sin A = \\frac{h}{b} \\quad\\Longrightarrow\\quad h = b \\sin A.$$

<p class="l-text">Sağdaki dik üçgende:</p>

$$\\sin B = \\frac{h}{a} \\quad\\Longrightarrow\\quad h = a \\sin B.$$

<p class="l-text">$h$ için bulduğumuz iki ifadeyi eşitleyelim:</p>

$$b \\sin A = a \\sin B \\quad\\Longleftrightarrow\\quad \\frac{a}{\\sin A} = \\frac{b}{\\sin B}.$$

<p class="l-text">Bunun yerine $A$ köşesinden $BC$ kenarına yükseklik indirsek, aynı argüman $b, c$ kenarları ve $B, C$ açıları için</p>

$$\\frac{b}{\\sin B} = \\frac{c}{\\sin C}$$

<p class="l-text">verir. İkisini birlikte yazarsak:</p>

<div class="l-highlight" style="text-align:center"><strong>SİNÜS TEOREMİ</strong><br>
$$\\boxed{\\;\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}\\;}$$</div>

<p class="l-text"><strong>İspat ne kullandı?</strong> Yalnızca $\\sin$'in dik üçgendeki tanımı ve her üçgende bir yükseklik çizilebileceği gerçeği. İspat üçgen dar, dik ya da geniş açılı olsa da çalışır — geniş açılı durumda yüksekliğin ayağı karşı kenarın dışına düşer, fakat aynı eşitlik (bir açı bütünlük açısıyla yer değiştirir, ki sinüsleri aynıdır) korunur.</p>

<div class="l-note"><strong>Bu neden işe yarar?</strong> $\\frac{a}{\\sin A}$ oranlarından herhangi birini bilirseniz, üçünün ortak değerini de bilirsiniz. Yani bir kenarı ve karşısındaki açıyı biliyorsanız, başka bir kenarın değerini onun karşısındaki açıdan kolayca bulabilirsiniz (ya da tersi).</div>

<!-- ============================================================
     BÖLÜM 3: Çevrel Çember (2R) Bağlantısı
     ============================================================ -->
<h2 class="l-title">3. Çevrel Çember — $2R$ Eşitliği</h2>

<p class="l-text">Ortak oranın $\\frac{a}{\\sin A}$ değerinin gizli bir geometrik anlamı vardır: <strong>çevrel çemberin çapına eşittir</strong>.</p>

<p class="l-text">Her üçgenin tek bir <em>çevrel çemberi</em> vardır — üç köşeden de geçen çember. Yarıçapına $R$ diyelim. O zaman</p>

$$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R.$$

<p class="l-text"><strong>İspatın taslağı.</strong> $B$ köşesinden geçen çapı çizin; diğer ucuna $B'$ deyin. Çevre açısı $\\angle BAB' = 90°$'dir (Thales teoremi). $ABB'$ dik üçgeninde $a = BC$ kenarı çevre açısı $\\angle BAC = A$'nın karşısındadır; aynı kirişe karşılık gelen çevre açıları eşittir, dolayısıyla $\\sin A = \\frac{a}{2R}$, yani $\\frac{a}{\\sin A} = 2R$.</p>

<div id="plot-sine-law-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
  var R=1, n=120;
  var cx=[], cy=[];
  for(var i=0;i<=n;i++){ var t=2*Math.PI*i/n; cx.push(R*Math.cos(t)); cy.push(R*Math.sin(t)); }
  var A={x:R*Math.cos(110*Math.PI/180), y:R*Math.sin(110*Math.PI/180)};
  var B={x:R*Math.cos(-30*Math.PI/180), y:R*Math.sin(-30*Math.PI/180)};
  var C={x:R*Math.cos(200*Math.PI/180), y:R*Math.sin(200*Math.PI/180)};
  var tri={x:[A.x,B.x,C.x,A.x], y:[A.y,B.y,C.y,A.y], mode:"lines+markers", name:"ABC üçgeni", line:{color:"#c8a96e",width:2.5}, marker:{size:8,color:"#c8a96e"}};
  var circ={x:cx, y:cy, mode:"lines", name:"Çevrel çember (yarıçap R)", line:{color:"#06b6d4",width:1.5,dash:"dot"}};
  var ctr={x:[0], y:[0], mode:"markers+text", text:["O"], textposition:"top right", marker:{size:6,color:"#f87171"}, showlegend:false};
  var labels={x:[A.x*1.12,B.x*1.12,C.x*1.12], y:[A.y*1.12,B.y*1.12,C.y*1.12], mode:"text", text:["A","B","C"], textfont:{color:"#ebe6dc",size:16}, showlegend:false};
  var diam={x:[A.x,-A.x], y:[A.y,-A.y], mode:"lines", name:"A'dan geçen çap (2R)", line:{color:"#a855f7",width:1.5,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{range:[-1.4,1.4],zeroline:false,showgrid:false,visible:false,scaleanchor:"y"},yaxis:{range:[-1.4,1.4],zeroline:false,showgrid:false,visible:false},margin:{t:30,r:20,b:50,l:20},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.05}};
  Plotly.newPlot("plot-sine-law-tr",[circ,tri,diam,ctr,labels],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Çevrel çemberinin içine yerleştirilmiş üçgen. $2R$ çapı, her kenarı karşısındaki açının sinüsüne bağlar: $\\frac{a}{\\sin A} = 2R$.</p>

<div class="l-note"><strong>Hızlı kontrol.</strong> Kenarı $a$ ve her köşesinde $60°$ olan eşkenar üçgende $\\frac{a}{\\sin 60°} = \\frac{a}{\\sqrt{3}/2} = \\frac{2a}{\\sqrt{3}}$. Yani çevrel yarıçap $R = \\frac{a}{\\sqrt{3}}$ — geometride de görmüş olabileceğiniz bir sonuç.</div>

<!-- ============================================================
     BÖLÜM 4: Kosinüs Teoremi — Türetim
     ============================================================ -->
<h2 class="l-title">4. Kosinüs Teoremi: Türetim</h2>

<p class="l-text">Sinüs Teoremi bir kenarı <em>karşısındaki</em> açıyla eşleştirir. Peki iki kenarı ve <em>aralarındaki</em> açıyı biliyorsak (KAK) ve üçüncü kenarı arıyorsak? O zaman ortada hiçbir karşı açı yoktur ve Sinüs Teoremi doğrudan uygulanamaz. Farklı bir özdeşliğe ihtiyacımız var.</p>

<p class="l-text">Üçgeni bir koordinat sistemine yerleştirelim: $C$ köşesini başlangıç noktasına, $a$ kenarını ($A$'nın karşısı) pozitif $x$ eksenine koyalım; o zaman $B$ köşesi $(a, 0)$ olur. $C$'deki açı $C$ olduğundan $A$ köşesi $(b\\cos C, b\\sin C)$ konumundadır.</p>

<p class="l-text">Uzaklık formülüyle $c$ kenarının uzunluğu (yani $A$'dan $B$'ye):</p>

$$c^2 = (a - b\\cos C)^2 + (0 - b\\sin C)^2.$$

<p class="l-text">Açarsak:</p>

$$c^2 = a^2 - 2ab\\cos C + b^2\\cos^2 C + b^2\\sin^2 C.$$

<p class="l-text">Son iki terimi gruplayıp Pisagor özdeşliği $\\sin^2 C + \\cos^2 C = 1$'i uygulayalım:</p>

$$c^2 = a^2 + b^2(\\cos^2 C + \\sin^2 C) - 2ab\\cos C = a^2 + b^2 - 2ab\\cos C.$$

<div class="l-highlight" style="text-align:center"><strong>KOSİNÜS TEOREMİ</strong><br>
$$\\boxed{\\;c^2 = a^2 + b^2 - 2ab\\cos C\\;}$$<br>
ve simetri gereği<br>
$$a^2 = b^2 + c^2 - 2bc\\cos A,\\qquad b^2 = a^2 + c^2 - 2ac\\cos B.$$</div>

<p class="l-text"><strong>Nasıl okunur?</strong> Bilinmeyen kenarın karesi, diğer iki kenarın kareleri toplamı eksi bunların çarpımının iki katı çarpı aralarındaki açının kosinüsü kadardır. "Eksi" terimi kritiktir — bu, içerideki açı $90°$ olmadığında Pisagor'a yapılan <em>düzeltme</em>dir.</p>

<!-- ============================================================
     BÖLÜM 5: Kosinüs Teoremi — Pisagor'un Genelleştirmesi
     ============================================================ -->
<h2 class="l-title">5. Kosinüs Teoremi: Pisagor'un Genelleştirmesi</h2>

<p class="l-text">Kosinüs Teoreminde $C = 90°$ koyalım. $\\cos 90° = 0$ olduğundan denklem şuna düşer:</p>

$$c^2 = a^2 + b^2 - 2ab \\cdot 0 = a^2 + b^2.$$

<p class="l-text">Bu, Pisagor Teoremidir. Kosinüs Teoremi, <strong>Pisagor'un dik olmayan üçgenlere genelleştirilmiş halidir</strong>. Fazladan gelen $-2ab\\cos C$ terimi, içerideki açının $90°$'den ne kadar saptığını ölçer:</p>

<ul class="l-list">
<li>$C < 90°$ (dar) ise $\\cos C > 0$, dolayısıyla $-2ab\\cos C < 0$. $a^2 + b^2$'den bir şey <em>çıkarırız</em>, böylece $c$ Pisagor'un öngörmesinden <strong>daha kısa</strong> olur.</li>
<li>$C = 90°$ (dik) ise düzeltme kaybolur ve Pisagor tam olarak uygulanır.</li>
<li>$C > 90°$ (geniş) ise $\\cos C < 0$, dolayısıyla $-2ab\\cos C > 0$. Bir şey <em>ekleriz</em>, böylece $c$ $\\sqrt{a^2 + b^2}$'den <strong>daha uzun</strong> olur.</li>
</ul>

<div id="plot-cosine-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var a=3, b=4;
  var angles=[];
  var cs=[];
  var pyth=Math.sqrt(a*a+b*b);
  var pyL=[];
  for(var deg=10; deg<=170; deg+=2){
    var C=deg*Math.PI/180;
    var c=Math.sqrt(a*a+b*b-2*a*b*Math.cos(C));
    angles.push(deg); cs.push(c); pyL.push(pyth);
  }
  var t1={x:angles, y:cs, mode:"lines", name:"c (Kosinüs Teoremi)", line:{color:"#c8a96e",width:3}};
  var t2={x:angles, y:pyL, mode:"lines", name:"Pisagor (a²+b²)^(1/2)", line:{color:"#06b6d4",width:2,dash:"dash"}};
  var t3={x:[90], y:[pyth], mode:"markers+text", text:["C=90° → c=√(9+16)=5"], textposition:"top center", marker:{size:10,color:"#f87171"}, showlegend:false, textfont:{color:"#f87171",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"İçerideki açı C (derece)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"Üçüncü kenar c",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:30,r:30,b:60,l:55},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-cosine-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$a=3$, $b=4$ sabitken: içerideki açı $C$, $10°$'den $170°$'ye taradıkça üçüncü kenar $c$ küçük $C$'lerde kısayken Pisagor'un öngördüğü $5$'e ($C=90°$'de) ulaşır ve $C \\to 180°$'ye yaklaştıkça neredeyse $a+b=7$'ye çıkar.</p>

<!-- ============================================================
     BÖLÜM 6: Beş Çözme Durumu (KKK, KAK, AKA, AAK, KKA)
     ============================================================ -->
<h2 class="l-title">6. Çözme Durumları — Hangi Teoremi Kullanmalı?</h2>

<p class="l-text">Güvenilir bir zihinsel kontrol listesi:</p>

<table class="l-table" style="width:100%;border-collapse:collapse;margin:1rem 0">
<thead><tr style="background:rgba(200,169,110,0.10);border-bottom:2px solid #c8a96e">
<th style="text-align:left;padding:0.55rem">Verilenler</th><th style="text-align:left;padding:0.55rem">İlk adım</th><th style="text-align:left;padding:0.55rem">Sonra</th><th style="text-align:left;padding:0.55rem">Açıklama</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>KKK</strong> (a, b, c)</td><td style="padding:0.5rem">Kosinüs Teoremi (bir açı için)</td><td style="padding:0.5rem">Sinüs Teoremi (ikinci açı için)</td><td style="padding:0.5rem">Üçüncü açı $A+B+C=180°$'den</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>KAK</strong> (b, c, A)</td><td style="padding:0.5rem">Kosinüs Teoremi (a için)</td><td style="padding:0.5rem">Sinüs Teoremi (bir açı için)</td><td style="padding:0.5rem">Daima tek çözüm</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>AKA</strong> (A, B, c)</td><td style="padding:0.5rem">$C=180°-A-B$</td><td style="padding:0.5rem">Sinüs Teoremi (a, b için)</td><td style="padding:0.5rem">Daima tek çözüm</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.08)"><td style="padding:0.5rem"><strong>AAK</strong> (A, B, a)</td><td style="padding:0.5rem">$C=180°-A-B$</td><td style="padding:0.5rem">Sinüs Teoremi (b, c için)</td><td style="padding:0.5rem">Daima tek çözüm</td></tr>
<tr><td style="padding:0.5rem"><strong>KKA</strong> (a, b, A)</td><td style="padding:0.5rem">Sinüs Teoremi (B için)</td><td style="padding:0.5rem">Çözüm sayısını kontrol et</td><td style="padding:0.5rem"><strong>Belirsiz</strong> — 0, 1 ya da 2 üçgen</td></tr>
</tbody></table>

<div class="l-note"><strong>Pratik kural.</strong> Bir kenarı karşısındaki açıyla eşleyebiliyorsan <em>Sinüs Teoremini</em> kullan. Verilen tek açı iki verilen kenarın arasındaysa veya yalnızca üç kenarın varsa <em>Kosinüs Teoremini</em> kullan.</div>

<!-- ============================================================
     BÖLÜM 7: Belirsiz Durum (KKA)
     ============================================================ -->
<h2 class="l-title">7. Belirsiz Durum (KKA)</h2>

<p class="l-text">KKA özeldir: iki kenarı ve aralarında <em>olmayan</em> bir açıyı bilmek bazen üçüncü kenarı tek bir biçimde belirlemez. Geometrik olarak, verilen açı $A$'nın karşısındaki $a$ kenarını ve komşu kenar $b$'yi bildiğimizi varsayalım. $C$ köşesi etrafında $a$ yarıçaplı bir yay çizip $A$ açısıyla çıkan ışınla nerede kesiştiğine bakmak zorundayız. Bu yay ışını <em>kaçırabilir</em>, ona <em>teğet</em> olabilir veya iki noktadan <em>kesebilir</em>.</p>

<p class="l-text">$B$'yi bulmak için Sinüs Teoremini uygulayın:</p>

$$\\sin B = \\frac{b \\sin A}{a}.$$

<p class="l-text">Üç durum çıkar (önce $A$ dar olsun):</p>

<ul class="l-list">
<li><strong>Çözüm yok</strong>: $\\frac{b \\sin A}{a} > 1$ ise hiçbir $B$ açısı için $\\sin B$ bu değere ulaşamaz — yay ışına ulaşamayacak kadar kısadır. Verilen veriler tutarsız: <em>üçgen yok</em>.</li>
<li><strong>Tek çözüm</strong>: $\\frac{b \\sin A}{a} = 1$ ise $B = 90°$ — yay ışına tam teğettir. Ya da $a \\ge b$ ise tümler açının $180°-A$'yı aşması nedeniyle yalnızca dar olan $B$ geçerli kalır. <em>Tam olarak bir üçgen</em>.</li>
<li><strong>İki çözüm</strong>: $\\frac{b \\sin A}{a} < 1$ <em>ve</em> $a < b$ ise hem dar $B_1$ hem de geniş $B_2 = 180° - B_1$ geçerli üçgenler üretir (çünkü $B_2 + A < 180°$). <em>İki üçgen</em>.</li>
</ul>

<p class="l-text">$A$ geniş veya dik açıysa analiz kolaylaşır: bu durumlarda en fazla bir üçgen olabilir (ikinci geniş açı toplamı $180°$'nin üzerine çıkarırdı).</p>

<div class="l-note"><strong>Bu resmi ezberleyin.</strong> $A$ köşesindeki $A$ açısını ve oradan çıkan $b$ kenarını sabit hayal edin; ucundaki $C$ noktası hareket eder. $C$'den $a$ yarıçaplı bir pergel çevirin. İki kesişim = iki üçgen. Bir kesişim = bir üçgen. Sıfır kesişim = sıfır üçgen.</div>

<!-- ============================================================
     BÖLÜM 8: Üçgenin Alanı
     ============================================================ -->
<h2 class="l-title">8. Üçgenin Alanı</h2>

<p class="l-text">İki genel amaçlı formül:</p>

<h3 class="l-subtitle">(a) İki kenar ve aralarındaki açı</h3>

<p class="l-text">Kenarları $a, b$ ve aralarındaki açısı $C$ olan bir üçgende, $a$ kenarına karşılık köşeden yükseklik indirin. Uzunluğu $h = b \\sin C$'dir. Taban $a$ olduğundan</p>

$$\\boxed{\\;S = \\tfrac{1}{2} a b \\sin C\\;}$$

<p class="l-text">Simetri gereği $S = \\tfrac{1}{2}bc\\sin A = \\tfrac{1}{2}ac\\sin B$. Bu, trigonometride en kullanışlı alan formülüdür: herhangi iki kenar ve aralarındaki açı, yüksekliği bulmadan doğrudan alanı verir.</p>

<h3 class="l-subtitle">(b) Heron formülü (üç kenar)</h3>

<p class="l-text">Yalnız üç kenar $a, b, c$ biliniyorsa, <em>yarı çevre</em>yi hesaplayın:</p>

$$s = \\frac{a + b + c}{2}.$$

<p class="l-text">Sonra</p>

$$\\boxed{\\;S = \\sqrt{s(s-a)(s-b)(s-c)}\\;}$$

<p class="l-text">Bu ünlü sonuç İskenderiyeli Heron'a (MS 1. yüzyıl) atfedilir. Kosinüs Teoremi, $S = \\tfrac{1}{2}ab\\sin C$ ve $\\sin^2 C = 1 - \\cos^2 C$ birleştirilerek türetilebilir.</p>

<div id="plot-area-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var a=5, b=7;
  var angles=[];
  var areas=[];
  for(var deg=5; deg<=175; deg+=2){
    var C=deg*Math.PI/180;
    var S=0.5*a*b*Math.sin(C);
    angles.push(deg); areas.push(S);
  }
  var t1={x:angles, y:areas, mode:"lines", name:"S = ½·a·b·sin(C)", line:{color:"#4de87a",width:3}};
  var t2={x:[90], y:[17.5], mode:"markers+text", text:["Maks alan C=90°: S=½·5·7=17.5"], textposition:"top center", marker:{size:10,color:"#f87171"}, textfont:{color:"#f87171",size:11}, showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"İçerideki açı C (derece)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"Alan S",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:30,r:30,b:60,l:55},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};
  Plotly.newPlot("plot-area-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$a=5$, $b=7$ sabitken: alan $S = \\tfrac{1}{2}ab\\sin C$, $C = 90°$'de (dik üçgen) maksimuma ulaşır ve hem $C \\to 0°$ hem de $C \\to 180°$'de sıfıra (yozlaşmış üçgen) iner.</p>

<!-- ============================================================
     BÖLÜM 9: Klasik Alıştırmalar
     ============================================================ -->
<h2 class="l-title">9. Klasik Alıştırmalar</h2>

<h3 class="l-subtitle">Problem 1 — KAK, kenar bulma</h3>
<p class="l-text">Bir üçgende $b = 10$, $c = 14$, $A = 60°$. $a$'yı bul.</p>
<p class="l-text"><em>Çözüm.</em> Kosinüs Teoremi:</p>

$$a^2 = b^2 + c^2 - 2bc\\cos A = 100 + 196 - 280 \\cdot \\tfrac{1}{2} = 296 - 140 = 156.$$

<p class="l-text">Buradan $a = \\sqrt{156} \\approx 12{,}49$.</p>

<h3 class="l-subtitle">Problem 2 — KKK, açı bulma</h3>
<p class="l-text">Üçgen bir arazinin kenarları $a = 7, b = 8, c = 9$ metre. $C$ açısını bul.</p>
<p class="l-text"><em>Çözüm.</em> Kosinüs Teoremini düzenleyelim:</p>

$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab} = \\frac{49 + 64 - 81}{2 \\cdot 7 \\cdot 8} = \\frac{32}{112} = \\frac{2}{7}.$$

<p class="l-text">$C = \\arccos(2/7) \\approx 73{,}4°$.</p>

<h3 class="l-subtitle">Problem 3 — AKA, kenar bulma</h3>
<p class="l-text">$A = 40°$, $B = 65°$, $c = 12$. $a$'yı bul.</p>
<p class="l-text"><em>Çözüm.</em> $C = 180° - 40° - 65° = 75°$. Sinüs Teoreminden,</p>

$$a = \\frac{c \\sin A}{\\sin C} = \\frac{12 \\sin 40°}{\\sin 75°} \\approx \\frac{12 \\cdot 0{,}6428}{0{,}9659} \\approx 7{,}99.$$

<h3 class="l-subtitle">Problem 4 — KKA, belirsiz</h3>
<p class="l-text">$a = 5$, $b = 7$, $A = 35°$. $B$'yi bul.</p>
<p class="l-text"><em>Çözüm.</em> $\\sin B = \\frac{b \\sin A}{a} = \\frac{7 \\sin 35°}{5} \\approx \\frac{4{,}015}{5} \\approx 0{,}803.$</p>
<p class="l-text">$\\sin B < 1$ ve $a < b$ olduğundan hem dar olan $B_1 \\approx 53{,}4°$ hem de geniş $B_2 = 180° - 53{,}4° = 126{,}6°$ geçerli üçgenler üretir (ikisi de $A + B < 180°$ koşulunu sağlar). <strong>İki farklı üçgen mevcuttur.</strong></p>

<h3 class="l-subtitle">Problem 5 — Arazi Ölçümü</h3>
<p class="l-text">İki ölçümcü düz bir arazide $200$ m arayla duruyor. İkisi de uzaktaki bir bayrak direğini görüyor ve aralarındaki doğru ile direğe giden doğru arasındaki açıyı ölçüyor: bir noktadan $52°$, diğerinden $68°$. Bayrak direği her bir ölçümciden ne kadar uzakta?</p>
<p class="l-text"><em>Çözüm.</em> Bayrak ve iki ölçümcü bir üçgen oluşturur. Bayraktaki açı $180° - 52° - 68° = 60°$. Sinüs Teoremiyle:</p>

$$\\frac{200}{\\sin 60°} = \\frac{d_1}{\\sin 68°} = \\frac{d_2}{\\sin 52°}.$$

<p class="l-text">$d_1 = \\frac{200 \\sin 68°}{\\sin 60°} \\approx \\frac{200 \\cdot 0{,}9272}{0{,}8660} \\approx 214{,}1$ m ve $d_2 \\approx 182{,}0$ m.</p>

<h3 class="l-subtitle">Problem 6 — Alan, karışık veri</h3>
<p class="l-text">$a = 6$, $b = 9$, $C = 30°$ olan üçgenin alanını bul.</p>
<p class="l-text"><em>Çözüm.</em> İki kenar ve aralarındaki açı — $S = \\tfrac{1}{2}ab\\sin C$ kullanılır.</p>

$$S = \\tfrac{1}{2} \\cdot 6 \\cdot 9 \\cdot \\sin 30° = 27 \\cdot \\tfrac{1}{2} = 13{,}5.$$

<div class="l-highlight"><strong>Çıkarım.</strong> Önce veri yapısını tanımla (KKK / KAK / AKA / AAK / KKA). Sonra seç: <em>aralarındaki açı veya üç kenar</em> → Kosinüs Teoremi; <em>karşısındaki açıyla eşleşen kenar</em> → Sinüs Teoremi. Kosinüs Teoremi, açı $90°$ olduğunda Pisagor'a indirgenir. Alan formülü $\\tfrac{1}{2}ab\\sin C$ trigonometrinin iş atıdır; KKK durumunu kenarlardan doğrudan Heron formülü çözer.</div>

<p class="l-text">Bir sonraki derste üçgen geometrisinden <strong>trigonometrik özdeşliklere</strong> geçeceğiz — her açıda geçerli olan ve üçgen çözmenin çok ötesinde ifadeleri sadeleştirip denklem çözmekte kullanılan cebirsel eşitlikler.</p>
`

};
