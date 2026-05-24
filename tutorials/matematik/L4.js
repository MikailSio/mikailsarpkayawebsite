/* ============================================================
   tutorials/matematik/L4.js
   Lesson 4 — Trigonometric Identities I
   Pythagorean, Sum-Difference, Double-Angle, Half-Angle
   ============================================================ */
window.LISE_MAT_L4 = {

en: `
<p class="l-text"><strong>Trigonometric identities</strong> are equalities that stay true for <em>every</em> admissible angle. They are the algebraic backbone of trigonometry: with a small catalogue of identities you can simplify ugly expressions, prove statements that look impossible, find exact values of unusual angles, and rewrite formulas to expose the structure hidden inside them. In this lesson we build that catalogue from scratch, prove the most important members geometrically, and learn the strategy that turns identity-proving from guesswork into a craft.</p>

<p class="l-text">We move slowly. Every identity is derived. Every derivation is illustrated. Every formula is then used to compute a non-obvious value like $\\sin 75^{\\circ}$ or $\\tan 22.5^{\\circ}$.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish an <strong>identity</strong> (true for all valid inputs) from an <strong>equation</strong> (true for special values)</li>
<li>Derive the three <strong>Pythagorean identities</strong> from the unit circle</li>
<li>Prove the <strong>sum–difference</strong> formulas for $\\sin(A \\pm B)$, $\\cos(A \\pm B)$, $\\tan(A \\pm B)$ using a unit-circle picture</li>
<li>Derive all <strong>three versions</strong> of $\\cos 2\\theta$ and the standard $\\sin 2\\theta$, $\\tan 2\\theta$</li>
<li>Apply <strong>half-angle</strong> formulas with the correct sign chosen from quadrant analysis</li>
<li>Use a deliberate <strong>strategy</strong> (transform the harder side, use a common denominator, swap with Pythagoras) to prove identities cleanly</li>
</ul>
</div>

<h2 class="l-title">1. What Is an Identity?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> The statement "every dog is a mammal" is true for every dog you might point at — that is an identity-like claim. The statement "this dog weighs 12 kg" is true only for one particular dog — that is equation-like. In algebra the difference is identical: an <em>identity</em> holds for every value the variable is allowed to take; an <em>equation</em> imposes a constraint that only a few special values can satisfy.</div>

<p class="l-text">An <strong>equation</strong> such as $2x + 3 = 11$ is a question: "for which value of $x$ does the left-hand side equal the right-hand side?" The answer is the single value $x = 4$. Plug in $x = 5$ and the equality fails: the equation is not a universal statement.</p>

<p class="l-text">An <strong>identity</strong> such as $(x + 1)^2 = x^2 + 2x + 1$ is a fact: both sides are exactly the same polynomial, and the equality holds for every real $x$. You cannot find a value that breaks it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Equation</div><div class="card-body">A conditional equality. Only certain values of the variable satisfy it. Example: $x^2 = 9 \\Rightarrow x = \\pm 3$.</div></div>
<div class="calc-card"><div class="card-title">Identity</div><div class="card-body">An unconditional equality. Every admissible value of the variable satisfies it. Example: $\\sin^2 \\theta + \\cos^2 \\theta = 1$ for every real $\\theta$.</div></div>
<div class="calc-card"><div class="card-title">Admissible values</div><div class="card-body">Inputs that do not break the expression (no division by zero, no square root of a negative, no $\\tan 90^{\\circ}$). An identity must hold for every admissible input.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TELL THEM APART</div><div class="example-body"><strong>Classify each equality as identity or equation.</strong><br><br>(a) $\\sin^2 \\theta + \\cos^2 \\theta = 1$ — <em>identity</em>: true for every angle.<br>(b) $\\sin \\theta = \\tfrac{1}{2}$ — <em>equation</em>: true only for $\\theta = 30^{\\circ}, 150^{\\circ}, 390^{\\circ}, \\dots$.<br>(c) $\\tan \\theta = \\dfrac{\\sin \\theta}{\\cos \\theta}$ — <em>identity</em>: true for every $\\theta$ where $\\cos \\theta \\neq 0$.<br>(d) $2 \\cos \\theta + 1 = 0$ — <em>equation</em>: true only for $\\theta = 120^{\\circ}, 240^{\\circ}, \\dots$.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">When you prove an identity you are <strong>not</strong> "solving for the variable." There is nothing to solve. You are showing that two expressions are different names for the same thing — an act of <em>rewriting</em>, not of <em>finding</em>. The natural verb is "prove," not "solve."</div></div>

<h2 class="l-title">2. Pythagorean Identities</h2>

<p class="l-text">The most basic family of identities is born directly from the unit circle. Pick any angle $\\theta$ measured from the positive $x$-axis. The point on the unit circle at that angle has coordinates $(\\cos \\theta, \\sin \\theta)$. Because the radius of the unit circle is $1$, the Pythagorean theorem gives</p>

<div class="calc-formula"><div class="formula-label">FUNDAMENTAL PYTHAGOREAN IDENTITY</div><div class="formula-main">$$\\sin^2 \\theta + \\cos^2 \\theta = 1$$</div><div class="formula-sub">Direct consequence of the unit-circle definition. True for every real $\\theta$.</div></div>

<p class="l-text">From this single identity two siblings follow by dividing through by $\\cos^2 \\theta$ or by $\\sin^2 \\theta$ (whenever those quantities are non-zero).</p>

<p class="l-text"><strong>Divide by $\\cos^2 \\theta$:</strong></p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin^2 \\theta}{\\cos^2 \\theta} + \\frac{\\cos^2 \\theta}{\\cos^2 \\theta} = \\frac{1}{\\cos^2 \\theta} \\;\\;\\Longrightarrow\\;\\; \\tan^2 \\theta + 1 = \\sec^2 \\theta$$</div></div>

<p class="l-text"><strong>Divide by $\\sin^2 \\theta$:</strong></p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin^2 \\theta}{\\sin^2 \\theta} + \\frac{\\cos^2 \\theta}{\\sin^2 \\theta} = \\frac{1}{\\sin^2 \\theta} \\;\\;\\Longrightarrow\\;\\; 1 + \\cot^2 \\theta = \\csc^2 \\theta$$</div></div>

<div class="calc-formula"><div class="formula-label">THE THREE PYTHAGOREAN IDENTITIES</div><div class="formula-main">$$\\sin^2 \\theta + \\cos^2 \\theta = 1, \\quad 1 + \\tan^2 \\theta = \\sec^2 \\theta, \\quad 1 + \\cot^2 \\theta = \\csc^2 \\theta$$</div><div class="formula-sub">A single family. Memorise the first; derive the other two by dividing.</div></div>

<p class="l-text">Plotting all three left-hand sides together makes the family-feeling literal: the sum stays at $1$, the second identity blows up where $\\cos \\theta = 0$, the third blows up where $\\sin \\theta = 0$. The graph below shows the three identities as functions of $\\theta$ over one period.</p>

<div id="plot-pyth-family-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var s2c2=[];var t2s=[];var c2c=[];
for(var i=0;i<=720;i++){var t=i*Math.PI/360;xs.push(t);
var s=Math.sin(t),c=Math.cos(t);
s2c2.push(s*s+c*c);
var ta=Math.tan(t);var v1=ta*ta+1;t2s.push(Math.abs(v1)>50?null:v1);
var co=1/(Math.tan(t)||1e-9);var v2=1+co*co;c2c.push(Math.abs(v2)>50?null:v2);}
var tr1={x:xs,y:s2c2,mode:"lines",name:"sin²θ + cos²θ ≡ 1",line:{color:"#3b82f6",width:3}};
var tr2={x:xs,y:t2s,mode:"lines",name:"1 + tan²θ = sec²θ",line:{color:"#f87171",width:2,dash:"dash"}};
var tr3={x:xs,y:c2c,mode:"lines",name:"1 + cot²θ = csc²θ",line:{color:"#4ecdc4",width:2,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[0,2*Math.PI],title:"θ (radians)",tickvals:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],ticktext:["0","π/2","π","3π/2","2π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-2,30],title:"value"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-pyth-family-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The blue line $\\sin^2 \\theta + \\cos^2 \\theta$ stays glued to $1$ for every $\\theta$ — that is what an identity looks like graphically. The red dashed curve $1 + \\tan^2 \\theta = \\sec^2 \\theta$ shoots up where $\\cos \\theta = 0$. The teal dotted curve $1 + \\cot^2 \\theta = \\csc^2 \\theta$ shoots up where $\\sin \\theta = 0$. The asymptotes mark the values that the corresponding identity is not defined at — admissibility matters.</div></div>

<div id="plot-pyth-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xC=[];var yC=[];for(var i=0;i<=360;i++){var t=i*Math.PI/180;xC.push(Math.cos(t));yC.push(Math.sin(t));}
var circle={x:xC,y:yC,mode:"lines",name:"unit circle",line:{color:"#3b82f6",width:2}};
var thetaDeg=55;var th=thetaDeg*Math.PI/180;var cx=Math.cos(th),sx=Math.sin(th);
var rad={x:[0,cx],y:[0,sx],mode:"lines",name:"radius (=1)",line:{color:"#c8a96e",width:2.5}};
var legCos={x:[0,cx],y:[0,0],mode:"lines",name:"cos θ",line:{color:"#4ecdc4",width:3}};
var legSin={x:[cx,cx],y:[0,sx],mode:"lines",name:"sin θ",line:{color:"#f87171",width:3}};
var pt={x:[cx],y:[sx],mode:"markers+text",name:"(cos θ, sin θ)",marker:{size:10,color:"#fff"},text:["P"],textposition:"top right",textfont:{color:"#fff",size:13}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"x",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"y"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-pyth-en",[circle,rad,legCos,legSin,pt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> On the unit circle the radius from the origin to point $P$ has length $1$. The horizontal leg of the right triangle has length $\\cos \\theta$ and the vertical leg has length $\\sin \\theta$. Applying Pythagoras to the triangle gives $\\sin^2 \\theta + \\cos^2 \\theta = 1$ — this is not a guess, it is geometry.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — USING PYTHAGORAS</div><div class="example-body"><strong>If $\\sin \\theta = \\tfrac{3}{5}$ and $\\theta$ is in the second quadrant, find $\\cos \\theta$ and $\\tan \\theta$.</strong><br><br>From $\\sin^2 \\theta + \\cos^2 \\theta = 1$:<br>$\\cos^2 \\theta = 1 - \\tfrac{9}{25} = \\tfrac{16}{25} \\;\\Longrightarrow\\; \\cos \\theta = \\pm \\tfrac{4}{5}$.<br><br>In Q2, $\\cos \\theta < 0$, so $\\cos \\theta = -\\tfrac{4}{5}$.<br>Then $\\tan \\theta = \\dfrac{\\sin \\theta}{\\cos \\theta} = \\dfrac{3/5}{-4/5} = -\\tfrac{3}{4}$.</div></div>

<h2 class="l-title">3. Sum and Difference Formulas</h2>

<p class="l-text">What is $\\sin(30^{\\circ} + 45^{\\circ}) = \\sin 75^{\\circ}$? You cannot compute it by simply adding $\\sin 30^{\\circ} + \\sin 45^{\\circ}$ — the sine of a sum is <strong>not</strong> the sum of the sines. The correct rule is the <em>sum formula</em>:</p>

<div class="calc-formula"><div class="formula-label">SUM AND DIFFERENCE — SINE</div><div class="formula-main">$$\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B$$ $$\\sin(A - B) = \\sin A \\cos B - \\cos A \\sin B$$</div></div>

<div class="calc-formula"><div class="formula-label">SUM AND DIFFERENCE — COSINE</div><div class="formula-main">$$\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B$$ $$\\cos(A - B) = \\cos A \\cos B + \\sin A \\sin B$$</div><div class="formula-sub">Sign flip: cosine of a sum subtracts the cross term; cosine of a difference adds it.</div></div>

<div class="calc-formula"><div class="formula-label">SUM AND DIFFERENCE — TANGENT</div><div class="formula-main">$$\\tan(A + B) = \\dfrac{\\tan A + \\tan B}{1 - \\tan A \\tan B}, \\quad \\tan(A - B) = \\dfrac{\\tan A - \\tan B}{1 + \\tan A \\tan B}$$</div></div>

<p class="l-text"><strong>Geometric proof of $\\sin(A + B)$.</strong> Build a stack of two right triangles. Start at the origin, rotate by angle $A$, draw a unit segment to point $Q$. From $Q$ rotate by an additional angle $B$ and drop a perpendicular of length $1$ to point $P$. The total angle from the $x$-axis to $\\overrightarrow{OP}$ is $A + B$, so the height of $P$ above the $x$-axis is exactly $\\sin(A + B)$. Decomposing the height of $P$ as the vertical projection of $\\overrightarrow{OQ}$ plus the vertical projection of $\\overrightarrow{QP}$ gives $\\sin A \\cos B + \\cos A \\sin B$. The two expressions for the same vertical distance must agree.</p>

<div id="plot-sumab-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var A=35,B=25;var aR=A*Math.PI/180,bR=B*Math.PI/180;var sR=aR+bR;
var Q={x:Math.cos(aR),y:Math.sin(aR)};
var P={x:Math.cos(sR),y:Math.sin(sR)};
var xC=[];var yC=[];for(var i=0;i<=90;i++){var t=i*Math.PI/180;xC.push(0.18*Math.cos(t));yC.push(0.18*Math.sin(t));}
var arcA={x:xC.slice(0,A+1),y:yC.slice(0,A+1),mode:"lines",name:"angle A",line:{color:"#4ecdc4",width:2}};
var arcB={x:[],y:[],mode:"lines",name:"angle B",line:{color:"#f87171",width:2}};
for(var j=0;j<=B;j++){var tt=(A+j)*Math.PI/180;arcB.x.push(0.30*Math.cos(tt));arcB.y.push(0.30*Math.sin(tt));}
var rayOQ={x:[0,Q.x],y:[0,Q.y],mode:"lines+markers",name:"OQ",line:{color:"#c8a96e",width:2.5},marker:{size:6}};
var rayOP={x:[0,P.x],y:[0,P.y],mode:"lines+markers",name:"OP (angle A+B)",line:{color:"#3b82f6",width:2.5},marker:{size:6}};
var heightP={x:[P.x,P.x],y:[0,P.y],mode:"lines",name:"sin(A+B)",line:{color:"#a78bfa",width:3,dash:"dot"}};
var labels={x:[0.20,0.34,P.x+0.06,Q.x+0.06],y:[0.07,0.13,P.y/2,Q.y/2],mode:"text",name:"labels",text:["A","B","sin(A+B)","unit"],textfont:{color:"#ebe6dc",size:12},showlegend:false};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-0.2,1.2],title:"x",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-0.15,1.1],title:"y"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-sumab-en",[arcA,arcB,rayOQ,rayOP,heightP,labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The ray $OQ$ is at angle $A$ and the ray $OP$ is at angle $A + B$. The vertical purple segment is $\\sin(A + B)$, the height of $P$. By decomposing this height along the two stacked right triangles, you recover the formula $\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $\\sin 75^{\\circ}$</div><div class="example-body"><strong>Compute $\\sin 75^{\\circ}$ exactly.</strong><br><br>Write $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$ and apply the sum formula:<br>$\\sin(45^{\\circ} + 30^{\\circ}) = \\sin 45^{\\circ} \\cos 30^{\\circ} + \\cos 45^{\\circ} \\sin 30^{\\circ}$<br>$= \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{3}}{2} + \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{1}{2} = \\dfrac{\\sqrt{6}}{4} + \\dfrac{\\sqrt{2}}{4} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$.<br><br>Decimal check: $\\dfrac{2.449 + 1.414}{4} \\approx 0.966$. A calculator confirms $\\sin 75^{\\circ} \\approx 0.9659$.</div></div>

<h2 class="l-title">4. Double-Angle Formulas</h2>

<p class="l-text">Set $A = B = \\theta$ in the sum formulas and collect terms. The result is the family of <strong>double-angle</strong> identities.</p>

<div class="calc-formula"><div class="formula-label">DOUBLE-ANGLE — SINE</div><div class="formula-main">$$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$$</div></div>

<div class="calc-formula"><div class="formula-label">DOUBLE-ANGLE — COSINE (THREE EQUIVALENT VERSIONS)</div><div class="formula-main">$$\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta \\;=\\; 2 \\cos^2 \\theta - 1 \\;=\\; 1 - 2 \\sin^2 \\theta$$</div><div class="formula-sub">All three are the same identity. The second drops $\\sin$ entirely; the third drops $\\cos$ entirely. Pick whichever leaves the cleaner expression.</div></div>

<div class="calc-formula"><div class="formula-label">DOUBLE-ANGLE — TANGENT</div><div class="formula-main">$$\\tan 2\\theta = \\dfrac{2 \\tan \\theta}{1 - \\tan^2 \\theta}$$</div></div>

<p class="l-text"><strong>Derivation of the three cosine versions.</strong> Start from $\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta$ (which is the cosine sum formula with $A = B = \\theta$). Substitute $\\sin^2 \\theta = 1 - \\cos^2 \\theta$ to get $\\cos 2\\theta = \\cos^2 \\theta - (1 - \\cos^2 \\theta) = 2 \\cos^2 \\theta - 1$. Substitute the other way, $\\cos^2 \\theta = 1 - \\sin^2 \\theta$, to get $\\cos 2\\theta = (1 - \\sin^2 \\theta) - \\sin^2 \\theta = 1 - 2 \\sin^2 \\theta$.</p>

<div id="plot-double-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xC=[];var yC=[];for(var i=0;i<=360;i++){var t=i*Math.PI/180;xC.push(Math.cos(t));yC.push(Math.sin(t));}
var circle={x:xC,y:yC,mode:"lines",name:"unit circle",line:{color:"#3b82f6",width:2}};
var thD=25;var th=thD*Math.PI/180;var t2=2*th;
var P1={x:Math.cos(th),y:Math.sin(th)};var P2={x:Math.cos(t2),y:Math.sin(t2)};
var rayTh={x:[0,P1.x],y:[0,P1.y],mode:"lines+markers",name:"angle θ",line:{color:"#c8a96e",width:2.5},marker:{size:7}};
var ray2Th={x:[0,P2.x],y:[0,P2.y],mode:"lines+markers",name:"angle 2θ",line:{color:"#f87171",width:2.5},marker:{size:7}};
var arcTh={x:[],y:[]};for(var k=0;k<=thD;k++){var tt=k*Math.PI/180;arcTh.x.push(0.18*Math.cos(tt));arcTh.y.push(0.18*Math.sin(tt));}
var arcT={x:arcTh.x,y:arcTh.y,mode:"lines",name:"arc θ",line:{color:"#c8a96e",width:2}};
var arc2Th={x:[],y:[]};for(var k=0;k<=2*thD;k++){var tt=k*Math.PI/180;arc2Th.x.push(0.30*Math.cos(tt));arc2Th.y.push(0.30*Math.sin(tt));}
var arc2={x:arc2Th.x,y:arc2Th.y,mode:"lines",name:"arc 2θ",line:{color:"#f87171",width:2}};
var h2={x:[P2.x,P2.x],y:[0,P2.y],mode:"lines",name:"sin 2θ",line:{color:"#a78bfa",width:3,dash:"dot"}};
var w2={x:[0,P2.x],y:[0,0],mode:"lines",name:"cos 2θ",line:{color:"#4ecdc4",width:3,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"x",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"y"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-double-en",[circle,rayTh,ray2Th,arcT,arc2,h2,w2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Rotate a unit radius first by angle $\\theta$, then by another $\\theta$ to reach $2\\theta$. The horizontal projection of the final point is $\\cos 2\\theta$ and the vertical projection is $\\sin 2\\theta$. The double-angle identities express these projections in terms of $\\sin \\theta$ and $\\cos \\theta$ alone.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DOUBLE ANGLE</div><div class="example-body"><strong>Given $\\sin \\theta = \\tfrac{4}{5}$ with $\\theta$ in the first quadrant, find $\\sin 2\\theta$, $\\cos 2\\theta$, $\\tan 2\\theta$.</strong><br><br>Pythagoras: $\\cos \\theta = \\sqrt{1 - 16/25} = \\tfrac{3}{5}$ (positive in Q1).<br>$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta = 2 \\cdot \\tfrac{4}{5} \\cdot \\tfrac{3}{5} = \\tfrac{24}{25}$.<br>$\\cos 2\\theta = 1 - 2 \\sin^2 \\theta = 1 - 2 \\cdot \\tfrac{16}{25} = -\\tfrac{7}{25}$.<br>$\\tan 2\\theta = \\dfrac{\\sin 2\\theta}{\\cos 2\\theta} = \\dfrac{24/25}{-7/25} = -\\tfrac{24}{7}$.</div></div>

<h2 class="l-title">5. Half-Angle Formulas</h2>

<p class="l-text">Solve the cosine double-angle identities for $\\sin^2$ and $\\cos^2$, then take square roots:</p>

<p class="l-text">From $\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$ we get $\\sin^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{2}$. Replacing $\\theta$ with $\\theta/2$ rewrites this as $\\sin^2(\\theta/2) = \\dfrac{1 - \\cos \\theta}{2}$.</p>

<p class="l-text">From $\\cos 2\\theta = 2 \\cos^2 \\theta - 1$ similarly: $\\cos^2(\\theta/2) = \\dfrac{1 + \\cos \\theta}{2}$.</p>

<div class="calc-formula"><div class="formula-label">HALF-ANGLE FORMULAS</div><div class="formula-main">$$\\sin \\dfrac{\\theta}{2} = \\pm \\sqrt{\\dfrac{1 - \\cos \\theta}{2}}, \\qquad \\cos \\dfrac{\\theta}{2} = \\pm \\sqrt{\\dfrac{1 + \\cos \\theta}{2}}$$ $$\\tan \\dfrac{\\theta}{2} = \\pm \\sqrt{\\dfrac{1 - \\cos \\theta}{1 + \\cos \\theta}} = \\dfrac{\\sin \\theta}{1 + \\cos \\theta} = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$$</div><div class="formula-sub">The $\\pm$ is chosen by locating the quadrant of $\\theta/2$.</div></div>

<p class="l-text"><strong>Picking the sign.</strong> The formulas tell you the magnitude. Decide the sign from the quadrant of $\\theta/2$: in Q1 every value is positive; in Q2 only $\\sin$ is positive; in Q3 only $\\tan$ is positive; in Q4 only $\\cos$ is positive (the standard "All-Sine-Tan-Cos" rule).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $\\tan 22.5^{\\circ}$</div><div class="example-body"><strong>Compute $\\tan 22.5^{\\circ}$ exactly.</strong><br><br>Note $22.5^{\\circ} = 45^{\\circ}/2$. Apply the half-angle formula $\\tan(\\theta/2) = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$ with $\\theta = 45^{\\circ}$:<br><br>$\\tan 22.5^{\\circ} = \\dfrac{1 - \\cos 45^{\\circ}}{\\sin 45^{\\circ}} = \\dfrac{1 - \\sqrt{2}/2}{\\sqrt{2}/2} = \\dfrac{2 - \\sqrt{2}}{\\sqrt{2}} = \\dfrac{(2 - \\sqrt{2}) \\sqrt{2}}{2} = \\dfrac{2\\sqrt{2} - 2}{2} = \\sqrt{2} - 1$.<br><br>Decimal check: $\\sqrt{2} - 1 \\approx 0.4142$. A calculator gives $\\tan 22.5^{\\circ} \\approx 0.4142$.</div></div>

<h2 class="l-title">6. Strategies for Proving Identities</h2>

<p class="l-text">Identity-proving is a craft, not a search. A small set of habits handles almost every problem you will meet in high school.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Work on the harder side</div><div class="card-body">Pick the side that looks more complicated and transform it. Trying to manipulate both sides at once invites circular reasoning.</div></div>
<div class="calc-card"><div class="card-title">Rewrite in $\\sin$ and $\\cos$</div><div class="card-body">When in doubt expand $\\tan, \\cot, \\sec, \\csc$ in terms of $\\sin$ and $\\cos$. The number of symbols drops and the algebra becomes purely fractional.</div></div>
<div class="calc-card"><div class="card-title">Use the Pythagorean swap</div><div class="card-body">$\\sin^2 \\leftrightarrow 1 - \\cos^2$ and $\\cos^2 \\leftrightarrow 1 - \\sin^2$ trades squared terms for ones the other formula needs.</div></div>
<div class="calc-card"><div class="card-title">Common denominator</div><div class="card-body">When two fractions appear on one side, combining them often reveals a sum or difference identity hiding in the numerator.</div></div>
<div class="calc-card"><div class="card-title">Factor aggressively</div><div class="card-body">$\\sin^2 - \\cos^2 = (\\sin - \\cos)(\\sin + \\cos)$ and $1 - \\cos^2 = (1 - \\cos)(1 + \\cos)$ are the most common helpful factorings.</div></div>
<div class="calc-card"><div class="card-title">Stop when both sides match</div><div class="card-body">As soon as your manipulation produces the other side, the proof is done. Do not "complete the algebra" further.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED PROOF — STRATEGY IN ACTION</div><div class="example-body"><strong>Prove:</strong> $\\dfrac{1 - \\cos \\theta}{\\sin \\theta} = \\dfrac{\\sin \\theta}{1 + \\cos \\theta}$.<br><br><em>Strategy:</em> the right side looks easier; multiply numerator and denominator by $(1 - \\cos \\theta)$ to use $1 - \\cos^2$:<br>$\\dfrac{\\sin \\theta}{1 + \\cos \\theta} \\cdot \\dfrac{1 - \\cos \\theta}{1 - \\cos \\theta} = \\dfrac{\\sin \\theta (1 - \\cos \\theta)}{1 - \\cos^2 \\theta} = \\dfrac{\\sin \\theta (1 - \\cos \\theta)}{\\sin^2 \\theta} = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$.<br><br>The two sides match. QED.</div></div>

<div class="calc-example"><div class="example-label">WORKED PROOF — TANGENT IDENTITY</div><div class="example-body"><strong>Prove:</strong> $\\tan \\theta + \\cot \\theta = \\dfrac{1}{\\sin \\theta \\cos \\theta}$.<br><br><em>Strategy:</em> the left side mixes $\\tan$ and $\\cot$; rewrite both in $\\sin$ and $\\cos$ and put them over a common denominator:<br>$\\tan \\theta + \\cot \\theta = \\dfrac{\\sin \\theta}{\\cos \\theta} + \\dfrac{\\cos \\theta}{\\sin \\theta} = \\dfrac{\\sin^2 \\theta + \\cos^2 \\theta}{\\sin \\theta \\cos \\theta} = \\dfrac{1}{\\sin \\theta \\cos \\theta}$.<br><br>The Pythagorean identity collapses the numerator. QED.</div></div>

<div class="think-box"><div class="think-label">SMALL TIP</div><div class="think-body">If a proof gets stuck after a few attempts, do not stare at the same expression any longer. Rewrite both sides in $\\sin$ and $\\cos$, then compute numerical values for a generic angle like $\\theta = 30^{\\circ}$. If the two numerical values disagree, the proposed identity is <em>false</em> — there is no proof to find. If they agree, you have the encouragement to push through algebraically.</div></div>

<h2 class="l-title">7. Practice — Three Exact Values</h2>

<p class="l-text">Combine sum, difference, double, and half-angle formulas to compute angles that no special-angle table contains.</p>

<div class="calc-example"><div class="example-label">EXACT VALUE — $\\cos 15^{\\circ}$</div><div class="example-body">Write $15^{\\circ} = 45^{\\circ} - 30^{\\circ}$:<br>$\\cos(45^{\\circ} - 30^{\\circ}) = \\cos 45^{\\circ} \\cos 30^{\\circ} + \\sin 45^{\\circ} \\sin 30^{\\circ}$<br>$= \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{3}}{2} + \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{1}{2} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$.</div></div>

<div class="calc-example"><div class="example-label">EXACT VALUE — $\\sin 105^{\\circ}$</div><div class="example-body">Use $\\sin 105^{\\circ} = \\sin(60^{\\circ} + 45^{\\circ})$:<br>$\\sin 60^{\\circ} \\cos 45^{\\circ} + \\cos 60^{\\circ} \\sin 45^{\\circ} = \\dfrac{\\sqrt{3}}{2} \\cdot \\dfrac{\\sqrt{2}}{2} + \\dfrac{1}{2} \\cdot \\dfrac{\\sqrt{2}}{2} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$.<br><br>Note that $\\sin 105^{\\circ} = \\sin 75^{\\circ}$ — the supplementary identity $\\sin(180^{\\circ} - x) = \\sin x$ confirms the result.</div></div>

<div class="calc-example"><div class="example-label">EXACT VALUE — $\\cos 22.5^{\\circ}$ (HALF-ANGLE)</div><div class="example-body">Use $\\cos(\\theta/2) = \\sqrt{(1 + \\cos \\theta)/2}$ with $\\theta = 45^{\\circ}$ (positive sign, Q1):<br>$\\cos 22.5^{\\circ} = \\sqrt{\\dfrac{1 + \\sqrt{2}/2}{2}} = \\sqrt{\\dfrac{2 + \\sqrt{2}}{4}} = \\dfrac{\\sqrt{2 + \\sqrt{2}}}{2}$.<br><br>Decimal check: $\\dfrac{\\sqrt{3.414}}{2} \\approx 0.9239$. A calculator gives $\\cos 22.5^{\\circ} \\approx 0.9239$.</div></div>

<h2 class="l-title">8. Classical Exercises</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Prove:</strong> $\\sec^2 \\theta - \\tan^2 \\theta = 1$.<br><br><em>Hint:</em> divide $\\sin^2 + \\cos^2 = 1$ by $\\cos^2 \\theta$. The result is $\\tan^2 + 1 = \\sec^2$; rearrange.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Prove:</strong> $\\dfrac{\\cos \\theta}{1 - \\sin \\theta} = \\dfrac{1 + \\sin \\theta}{\\cos \\theta}$.<br><br><em>Hint:</em> multiply the left side numerator and denominator by $(1 + \\sin \\theta)$; the denominator becomes $1 - \\sin^2 \\theta = \\cos^2 \\theta$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Compute exactly:</strong> $\\sin 15^{\\circ}$.<br><br><em>Answer:</em> $\\sin(45^{\\circ} - 30^{\\circ}) = \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{3}}{2} - \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{1}{2} = \\dfrac{\\sqrt{6} - \\sqrt{2}}{4}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>If $\\cos \\theta = \\tfrac{5}{13}$ and $\\theta$ is in Q4, find $\\sin 2\\theta$ and $\\cos 2\\theta$.</strong><br><br><em>Solution:</em> $\\sin \\theta = -\\sqrt{1 - 25/169} = -\\tfrac{12}{13}$ (Q4 negative). $\\sin 2\\theta = 2(-12/13)(5/13) = -\\tfrac{120}{169}$, $\\cos 2\\theta = 2(5/13)^2 - 1 = \\tfrac{50 - 169}{169} = -\\tfrac{119}{169}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Prove:</strong> $\\sin(A + B) + \\sin(A - B) = 2 \\sin A \\cos B$.<br><br><em>Solution:</em> add the two sum-difference sine formulas. The $\\cos A \\sin B$ terms cancel and the $\\sin A \\cos B$ terms double.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Compute:</strong> $\\tan 105^{\\circ}$.<br><br><em>Solution:</em> $\\tan(60^{\\circ} + 45^{\\circ}) = \\dfrac{\\tan 60^{\\circ} + \\tan 45^{\\circ}}{1 - \\tan 60^{\\circ} \\tan 45^{\\circ}} = \\dfrac{\\sqrt{3} + 1}{1 - \\sqrt{3}}$. Rationalise: multiply by $(1 + \\sqrt{3})/(1 + \\sqrt{3})$ to get $\\dfrac{(\\sqrt{3} + 1)(1 + \\sqrt{3})}{1 - 3} = \\dfrac{\\sqrt{3} + 3 + 1 + \\sqrt{3}}{-2} = -\\dfrac{4 + 2\\sqrt{3}}{2} = -(2 + \\sqrt{3})$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7</div><div class="example-body"><strong>Prove:</strong> $\\cos 3\\theta = 4 \\cos^3 \\theta - 3 \\cos \\theta$.<br><br><em>Hint:</em> $\\cos 3\\theta = \\cos(2\\theta + \\theta) = \\cos 2\\theta \\cos \\theta - \\sin 2\\theta \\sin \\theta$. Expand $\\cos 2\\theta = 2 \\cos^2 \\theta - 1$ and $\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$, then simplify using $\\sin^2 \\theta = 1 - \\cos^2 \\theta$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8</div><div class="example-body"><strong>Compute:</strong> $\\sin 22.5^{\\circ}$.<br><br><em>Solution:</em> half-angle with $\\theta = 45^{\\circ}$, positive sign (Q1): $\\sin 22.5^{\\circ} = \\sqrt{\\dfrac{1 - \\cos 45^{\\circ}}{2}} = \\sqrt{\\dfrac{1 - \\sqrt{2}/2}{2}} = \\dfrac{\\sqrt{2 - \\sqrt{2}}}{2}$.</div></div>

<h2 class="l-title">8b. Common Pitfalls and How to Avoid Them</h2>

<p class="l-text">Six mistakes appear over and over in beginner work. Recognising them in advance saves hours of frustration.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sin(A + B) \\neq \\sin A + \\sin B$</div><div class="card-body">Trigonometric functions are <strong>not linear</strong>. The sine of a sum is given by the full sum formula, never by simple addition. Same warning for $\\cos$, $\\tan$, and every other trig function.</div></div>
<div class="calc-card"><div class="card-title">$\\sin^2 \\theta$ vs $\\sin \\theta^2$</div><div class="card-body">$\\sin^2 \\theta$ means $(\\sin \\theta)^2$ — square the result. $\\sin(\\theta^2)$ means take sine of $\\theta^2$ — square the angle first, then take sine. The two are very different.</div></div>
<div class="calc-card"><div class="card-title">Choosing the wrong sign in half-angle</div><div class="card-body">$\\sin(\\theta/2)$ and $\\cos(\\theta/2)$ each give two possible values from the square root. You <em>must</em> decide quadrant of $\\theta/2$ before writing $+$ or $-$.</div></div>
<div class="calc-card"><div class="card-title">Confusing $\\cos 2\\theta$ versions</div><div class="card-body">All three forms of $\\cos 2\\theta$ are correct, but mixing them by accident — for example writing $\\cos 2\\theta = 2 \\cos^2 \\theta - \\sin^2 \\theta$ — produces an outright wrong identity. Pick one and use it cleanly.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to check denominator</div><div class="card-body">$\\tan(A + B)$ blows up where $1 - \\tan A \\tan B = 0$. The half-angle tangent formula $\\sin \\theta / (1 + \\cos \\theta)$ fails when $\\cos \\theta = -1$. Always check that your denominator is non-zero for the angles you plug in.</div></div>
<div class="calc-card"><div class="card-title">Working both sides at once</div><div class="card-body">When proving an identity, work on <em>one</em> side until it matches the other. Manipulating both sides simultaneously (especially squaring or multiplying both sides by something) risks introducing solutions and breaking the logic chain.</div></div>
</div>

<div class="calc-example"><div class="example-label">PITFALL EXAMPLE — SIGN OF HALF-ANGLE</div><div class="example-body"><strong>Compute $\\cos 200^{\\circ}/2 = \\cos 100^{\\circ}$ using the half-angle formula and pick the sign correctly.</strong><br><br>$\\cos 100^{\\circ} = \\pm \\sqrt{(1 + \\cos 200^{\\circ})/2}$.<br><br>$100^{\\circ}$ lies in the second quadrant where $\\cos < 0$, so pick the <em>minus</em> sign:<br>$\\cos 100^{\\circ} = -\\sqrt{(1 + \\cos 200^{\\circ})/2}$.<br><br>Using $\\cos 200^{\\circ} \\approx -0.9397$: $\\cos 100^{\\circ} \\approx -\\sqrt{0.0301} \\approx -0.1736$ — matches the calculator value $\\cos 100^{\\circ} \\approx -0.1736$.</div></div>

<h2 class="l-title">9. Identity Summary Card</h2>

<p class="l-text">A compact reference of every identity proved in this lesson, organised by family. Print it, fold it into your notebook, and refer to it during practice until the moves become muscle memory.</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">PYTHAGOREAN</div>
<div class="compare-item">$\\sin^2 \\theta + \\cos^2 \\theta = 1$</div>
<div class="compare-item">$1 + \\tan^2 \\theta = \\sec^2 \\theta$</div>
<div class="compare-item">$1 + \\cot^2 \\theta = \\csc^2 \\theta$</div>
<div class="compare-item">$\\sin^2 \\theta = 1 - \\cos^2 \\theta$ (swap form)</div>
<div class="compare-item">$\\cos^2 \\theta = 1 - \\sin^2 \\theta$ (swap form)</div>
</div>
<div class="compare-col">
<div class="compare-title">SUM &amp; DIFFERENCE</div>
<div class="compare-item">$\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$</div>
<div class="compare-item">$\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B$</div>
<div class="compare-item">$\\tan(A \\pm B) = \\dfrac{\\tan A \\pm \\tan B}{1 \\mp \\tan A \\tan B}$</div>
<div class="compare-item">Note: sign-flip in cosine — &quot;cosine swaps&quot;.</div>
</div>
</div>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">DOUBLE-ANGLE</div>
<div class="compare-item">$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$</div>
<div class="compare-item">$\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta$</div>
<div class="compare-item">$\\cos 2\\theta = 2 \\cos^2 \\theta - 1$</div>
<div class="compare-item">$\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$</div>
<div class="compare-item">$\\tan 2\\theta = \\dfrac{2 \\tan \\theta}{1 - \\tan^2 \\theta}$</div>
</div>
<div class="compare-col">
<div class="compare-title">HALF-ANGLE</div>
<div class="compare-item">$\\sin(\\theta/2) = \\pm \\sqrt{(1 - \\cos \\theta)/2}$</div>
<div class="compare-item">$\\cos(\\theta/2) = \\pm \\sqrt{(1 + \\cos \\theta)/2}$</div>
<div class="compare-item">$\\tan(\\theta/2) = \\dfrac{\\sin \\theta}{1 + \\cos \\theta}$</div>
<div class="compare-item">$\\tan(\\theta/2) = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$</div>
<div class="compare-item">Sign: from quadrant of $\\theta/2$.</div>
</div>
</div>

<h2 class="l-title">9b. Self-Check Quiz (Mental Quick Wins)</h2>

<p class="l-text">Twelve very short questions to gauge whether the catalogue is sticking. Cover the answer column with your hand and try each one mentally.</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">QUESTION</div>
<div class="compare-item">1. Simplify $\\sin^2 30^{\\circ} + \\cos^2 30^{\\circ}$.</div>
<div class="compare-item">2. Write $\\sin 2\\theta$ in one line.</div>
<div class="compare-item">3. State the three forms of $\\cos 2\\theta$.</div>
<div class="compare-item">4. Half-angle formula for $\\sin(\\theta/2)$.</div>
<div class="compare-item">5. $\\cos(A - B)$ vs $\\cos(A + B)$ — which has the plus?</div>
<div class="compare-item">6. If $\\tan \\theta = 2$, what is $\\sec^2 \\theta$?</div>
</div>
<div class="compare-col">
<div class="compare-title">ANSWER</div>
<div class="compare-item">1. $= 1$ (Pythagorean).</div>
<div class="compare-item">2. $2 \\sin \\theta \\cos \\theta$.</div>
<div class="compare-item">3. $\\cos^2 - \\sin^2$, $2 \\cos^2 - 1$, $1 - 2 \\sin^2$.</div>
<div class="compare-item">4. $\\pm \\sqrt{(1 - \\cos \\theta)/2}$.</div>
<div class="compare-item">5. $\\cos(A - B)$ has the plus on the cross term.</div>
<div class="compare-item">6. $1 + \\tan^2 = 1 + 4 = 5$.</div>
</div>
</div>

<h2 class="l-title">10. Why These Identities Matter</h2>

<p class="l-text">The four families above are not isolated calculator tricks. They reappear in every quantitative discipline that uses periodic phenomena, which is essentially every quantitative discipline.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geometry &amp; surveying</div><div class="card-body">Surveyors split unknown angles into sums of known reference directions and apply $\\sin(A + B)$ to compute heights of buildings, distances across rivers, and elevations of mountains without ever climbing them.</div></div>
<div class="calc-card"><div class="card-title">Physics — wave superposition</div><div class="card-body">When two sound or light waves with the same frequency overlap, the algebra of $\\sin(\\omega t + \\phi_1) + \\sin(\\omega t + \\phi_2)$ relies on sum-to-product identities (proved by combining the formulas of this lesson) to predict beats, interference, and standing waves.</div></div>
<div class="calc-card"><div class="card-title">Engineering — AC circuits</div><div class="card-body">Alternating current and voltage are sinusoids. Computing the power $P = V \\cdot I = V_0 \\sin(\\omega t) \\cdot I_0 \\sin(\\omega t + \\phi)$ requires the product-to-sum identity, which is itself a re-arrangement of the sum and difference formulas you proved here.</div></div>
<div class="calc-card"><div class="card-title">Astronomy</div><div class="card-body">Spherical trigonometry — the trigonometry on the surface of a sphere — uses these identities to convert between coordinate systems (right ascension/declination vs. azimuth/altitude) for every star you find in a telescope.</div></div>
<div class="calc-card"><div class="card-title">Computer graphics</div><div class="card-body">Every rotation of a 2D figure by angle $A + B$ decomposes into two rotations by $A$ then $B$. The matrix entries for a rotation are $\\cos$ and $\\sin$, so combining rotations literally is the sum formula in action.</div></div>
<div class="calc-card"><div class="card-title">Music &amp; signal processing</div><div class="card-body">Fourier analysis — which represents every periodic signal as a sum of sines and cosines — depends on the same algebra of products of trig functions. Audio compression (MP3, AAC), image compression (JPEG), and every modern radio relies on these identities under the hood.</div></div>
</div>

<div class="think-box"><div class="think-label">LOOKING AHEAD</div><div class="think-body">The identities here — Pythagorean, sum-difference, double-angle, half-angle — are the workhorse identities. The next lesson adds <em>product-to-sum</em>, <em>sum-to-product</em>, and <em>power-reduction</em> formulas, which are essential for integration and Fourier analysis later on. Master the family in this lesson first; the rest will fall into place naturally.</div></div>
`,

tr: `
<p class="l-text"><strong>Trigonometrik özdeşlikler</strong>, izin verilen <em>her</em> açı için doğru kalan eşitliklerdir. Trigonometrinin cebirsel omurgasıdırlar: küçük bir özdeşlik kataloğuyla çirkin ifadeleri sadeleştirebilir, imkânsız görünen iddiaları kanıtlayabilir, sıra dışı açıların kesin değerlerini bulabilir ve formülleri yeniden yazarak içlerindeki yapıyı açığa çıkarabilirsin. Bu derste o kataloğu sıfırdan kurar, en önemli üyeleri geometrik olarak ispatlar ve özdeşlik kanıtlamayı tahminden bir zanaate dönüştüren stratejiyi öğreniriz.</p>

<p class="l-text">Yavaş ilerliyoruz. Her özdeşlik türetilir. Her türetim görselleştirilir. Her formül ardından $\\sin 75^{\\circ}$ ya da $\\tan 22.5^{\\circ}$ gibi bariz olmayan bir değeri hesaplamada kullanılır.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir <strong>özdeşliği</strong> (her geçerli giriş için doğru) bir <strong>denklemden</strong> (özel değerler için doğru) ayırt edebilmek</li>
<li>Birim çemberden üç <strong>Pisagor özdeşliğini</strong> türetmek</li>
<li>$\\sin(A \\pm B)$, $\\cos(A \\pm B)$, $\\tan(A \\pm B)$ için <strong>toplam–fark</strong> formüllerini birim çember çizimiyle kanıtlamak</li>
<li>$\\cos 2\\theta$'nın <strong>üç farklı</strong> versiyonunu ve standart $\\sin 2\\theta$, $\\tan 2\\theta$ formüllerini türetmek</li>
<li>Bölge analiziyle doğru işareti seçerek <strong>yarım açı</strong> formüllerini uygulamak</li>
<li>Düşünülmüş bir <strong>strateji</strong> (zor tarafı dönüştür, ortak payda al, Pisagor ile değiştir) kullanarak özdeşlikleri temiz kanıtlamak</li>
</ul>
</div>

<h2 class="l-title">1. Özdeşlik Nedir?</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> "Her köpek bir memelidir" cümlesi, gösterebileceğin her köpek için doğrudur — özdeşliğe benzer bir iddia. "Bu köpek 12 kg" ifadesi yalnızca tek bir köpek için doğrudur — denkleme benzer. Cebirde fark aynı: bir <em>özdeşlik</em>, değişkenin alabileceği her değer için sağlanır; bir <em>denklem</em>, ancak birkaç özel değerin karşılayabileceği bir kısıt koyar.</div>

<p class="l-text">$2x + 3 = 11$ gibi bir <strong>denklem</strong> aslında bir sorudur: "hangi $x$ değeri için sol taraf sağ tarafa eşittir?" Cevap tek değer: $x = 4$. $x = 5$ koyarsan eşitlik bozulur; denklem evrensel bir ifade değildir.</p>

<p class="l-text">$(x + 1)^2 = x^2 + 2x + 1$ gibi bir <strong>özdeşlik</strong> ise bir gerçektir: her iki taraf tam olarak aynı polinomdur ve eşitlik her gerçek $x$ için sağlanır. Bunu bozacak bir değer bulamazsın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Denklem</div><div class="card-body">Koşullu eşitlik. Yalnızca belirli değişken değerleri sağlar. Örnek: $x^2 = 9 \\Rightarrow x = \\pm 3$.</div></div>
<div class="calc-card"><div class="card-title">Özdeşlik</div><div class="card-body">Koşulsuz eşitlik. İzin verilen her değişken değeri sağlar. Örnek: her gerçek $\\theta$ için $\\sin^2 \\theta + \\cos^2 \\theta = 1$.</div></div>
<div class="calc-card"><div class="card-title">Geçerli değerler</div><div class="card-body">İfadeyi bozmayan girişler (sıfıra bölme yok, negatif sayının karekökü yok, $\\tan 90^{\\circ}$ yok). Bir özdeşliğin geçerli her giriş için sağlanması gerekir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — AYIRT ETME</div><div class="example-body"><strong>Aşağıdaki eşitlikleri özdeşlik mi denklem mi olarak sınıflandır.</strong><br><br>(a) $\\sin^2 \\theta + \\cos^2 \\theta = 1$ — <em>özdeşlik</em>: her açı için doğru.<br>(b) $\\sin \\theta = \\tfrac{1}{2}$ — <em>denklem</em>: yalnızca $\\theta = 30^{\\circ}, 150^{\\circ}, 390^{\\circ}, \\dots$ için doğru.<br>(c) $\\tan \\theta = \\dfrac{\\sin \\theta}{\\cos \\theta}$ — <em>özdeşlik</em>: $\\cos \\theta \\neq 0$ olan her $\\theta$ için doğru.<br>(d) $2 \\cos \\theta + 1 = 0$ — <em>denklem</em>: yalnızca $\\theta = 120^{\\circ}, 240^{\\circ}, \\dots$ için doğru.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Bir özdeşliği kanıtlarken "değişkeni çözmüyorsun". Çözülecek bir şey yok. İki ifadenin aynı şeyin farklı isimleri olduğunu gösteriyorsun — bir <em>yeniden yazma</em> eylemi, bir <em>bulma</em> eylemi değil. Doğal fiil "kanıtlamak", "çözmek" değil.</div></div>

<h2 class="l-title">2. Pisagor Özdeşlikleri</h2>

<p class="l-text">En temel özdeşlik ailesi doğrudan birim çemberden doğar. Pozitif $x$-ekseninden ölçülen herhangi bir $\\theta$ açısını al. Birim çember üzerindeki o açıdaki nokta $(\\cos \\theta, \\sin \\theta)$ koordinatlarına sahiptir. Birim çemberin yarıçapı $1$ olduğundan Pisagor teoremi şunu verir:</p>

<div class="calc-formula"><div class="formula-label">TEMEL PİSAGOR ÖZDEŞLİĞİ</div><div class="formula-main">$$\\sin^2 \\theta + \\cos^2 \\theta = 1$$</div><div class="formula-sub">Birim çember tanımının doğrudan sonucu. Her gerçek $\\theta$ için doğru.</div></div>

<p class="l-text">Bu tek özdeşlikten, $\\cos^2 \\theta$ ya da $\\sin^2 \\theta$ ile (sıfır olmadıkça) bölerek iki kardeş çıkar.</p>

<p class="l-text"><strong>$\\cos^2 \\theta$ ile böl:</strong></p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin^2 \\theta}{\\cos^2 \\theta} + \\frac{\\cos^2 \\theta}{\\cos^2 \\theta} = \\frac{1}{\\cos^2 \\theta} \\;\\;\\Longrightarrow\\;\\; \\tan^2 \\theta + 1 = \\sec^2 \\theta$$</div></div>

<p class="l-text"><strong>$\\sin^2 \\theta$ ile böl:</strong></p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin^2 \\theta}{\\sin^2 \\theta} + \\frac{\\cos^2 \\theta}{\\sin^2 \\theta} = \\frac{1}{\\sin^2 \\theta} \\;\\;\\Longrightarrow\\;\\; 1 + \\cot^2 \\theta = \\csc^2 \\theta$$</div></div>

<div class="calc-formula"><div class="formula-label">ÜÇ PİSAGOR ÖZDEŞLİĞİ</div><div class="formula-main">$$\\sin^2 \\theta + \\cos^2 \\theta = 1, \\quad 1 + \\tan^2 \\theta = \\sec^2 \\theta, \\quad 1 + \\cot^2 \\theta = \\csc^2 \\theta$$</div><div class="formula-sub">Tek bir aile. Birincisini ezberle; ötekilerini bölerek türet.</div></div>

<p class="l-text">Üç sol tarafı tek bir grafikte çizmek aile duygusunu somutlaştırır: toplam $1$'de sabit kalır, ikincisi $\\cos \\theta = 0$ olduğu yerlerde sonsuza fırlar, üçüncüsü $\\sin \\theta = 0$ olduğu yerlerde sonsuza fırlar. Aşağıdaki grafik üç özdeşliği $\\theta$'nın fonksiyonu olarak bir periyot boyunca gösterir.</p>

<div id="plot-pyth-family-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var s2c2=[];var t2s=[];var c2c=[];
for(var i=0;i<=720;i++){var t=i*Math.PI/360;xs.push(t);
var s=Math.sin(t),c=Math.cos(t);
s2c2.push(s*s+c*c);
var ta=Math.tan(t);var v1=ta*ta+1;t2s.push(Math.abs(v1)>50?null:v1);
var co=1/(Math.tan(t)||1e-9);var v2=1+co*co;c2c.push(Math.abs(v2)>50?null:v2);}
var tr1={x:xs,y:s2c2,mode:"lines",name:"sin²θ + cos²θ ≡ 1",line:{color:"#3b82f6",width:3}};
var tr2={x:xs,y:t2s,mode:"lines",name:"1 + tan²θ = sec²θ",line:{color:"#f87171",width:2,dash:"dash"}};
var tr3={x:xs,y:c2c,mode:"lines",name:"1 + cot²θ = csc²θ",line:{color:"#4ecdc4",width:2,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[0,2*Math.PI],title:"θ (radyan)",tickvals:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],ticktext:["0","π/2","π","3π/2","2π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-2,30],title:"değer"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-pyth-family-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlattığı:</strong> Mavi çizgi $\\sin^2 \\theta + \\cos^2 \\theta$ her $\\theta$ için $1$'e yapışık kalır — bir özdeşlik grafikte böyle görünür. Kırmızı kesikli eğri $1 + \\tan^2 \\theta = \\sec^2 \\theta$, $\\cos \\theta = 0$ olduğu yerde fırlar. Turkuaz noktalı eğri $1 + \\cot^2 \\theta = \\csc^2 \\theta$, $\\sin \\theta = 0$ olduğu yerde fırlar. Asimptotlar, ilgili özdeşliğin tanımlı olmadığı değerleri işaret eder — geçerlilik önemlidir.</div></div>

<div id="plot-pyth-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xC=[];var yC=[];for(var i=0;i<=360;i++){var t=i*Math.PI/180;xC.push(Math.cos(t));yC.push(Math.sin(t));}
var circle={x:xC,y:yC,mode:"lines",name:"birim çember",line:{color:"#3b82f6",width:2}};
var thetaDeg=55;var th=thetaDeg*Math.PI/180;var cx=Math.cos(th),sx=Math.sin(th);
var rad={x:[0,cx],y:[0,sx],mode:"lines",name:"yarıçap (=1)",line:{color:"#c8a96e",width:2.5}};
var legCos={x:[0,cx],y:[0,0],mode:"lines",name:"cos θ",line:{color:"#4ecdc4",width:3}};
var legSin={x:[cx,cx],y:[0,sx],mode:"lines",name:"sin θ",line:{color:"#f87171",width:3}};
var pt={x:[cx],y:[sx],mode:"markers+text",name:"(cos θ, sin θ)",marker:{size:10,color:"#fff"},text:["P"],textposition:"top right",textfont:{color:"#fff",size:13}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"x",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"y"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-pyth-tr",[circle,rad,legCos,legSin,pt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlattığı:</strong> Birim çemberde başlangıç noktasından $P$ noktasına çizilen yarıçapın uzunluğu $1$. Dik üçgenin yatay kenarı $\\cos \\theta$, dikey kenarı $\\sin \\theta$. Üçgene Pisagor uygulayınca $\\sin^2 \\theta + \\cos^2 \\theta = 1$ elde edilir — bu bir tahmin değil, bir geometridir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — PİSAGOR KULLANIMI</div><div class="example-body"><strong>$\\sin \\theta = \\tfrac{3}{5}$ ve $\\theta$ ikinci bölgede ise $\\cos \\theta$ ve $\\tan \\theta$'yı bul.</strong><br><br>$\\sin^2 \\theta + \\cos^2 \\theta = 1$ kullanarak:<br>$\\cos^2 \\theta = 1 - \\tfrac{9}{25} = \\tfrac{16}{25} \\;\\Longrightarrow\\; \\cos \\theta = \\pm \\tfrac{4}{5}$.<br><br>2. bölgede $\\cos \\theta < 0$, dolayısıyla $\\cos \\theta = -\\tfrac{4}{5}$.<br>Sonra $\\tan \\theta = \\dfrac{\\sin \\theta}{\\cos \\theta} = \\dfrac{3/5}{-4/5} = -\\tfrac{3}{4}$.</div></div>

<h2 class="l-title">3. Toplam ve Fark Formülleri</h2>

<p class="l-text">$\\sin(30^{\\circ} + 45^{\\circ}) = \\sin 75^{\\circ}$ değeri nedir? Sadece $\\sin 30^{\\circ} + \\sin 45^{\\circ}$ toplamı olarak hesaplayamazsın — bir toplamın sinüsü, sinüslerin toplamı <strong>değildir</strong>. Doğru kural <em>toplam formülüdür</em>:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM VE FARK — SİNÜS</div><div class="formula-main">$$\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B$$ $$\\sin(A - B) = \\sin A \\cos B - \\cos A \\sin B$$</div></div>

<div class="calc-formula"><div class="formula-label">TOPLAM VE FARK — KOSİNÜS</div><div class="formula-main">$$\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B$$ $$\\cos(A - B) = \\cos A \\cos B + \\sin A \\sin B$$</div><div class="formula-sub">İşaret dönüşür: toplamın kosinüsü çapraz terimi çıkarır; farkın kosinüsü ekler.</div></div>

<div class="calc-formula"><div class="formula-label">TOPLAM VE FARK — TANJANT</div><div class="formula-main">$$\\tan(A + B) = \\dfrac{\\tan A + \\tan B}{1 - \\tan A \\tan B}, \\quad \\tan(A - B) = \\dfrac{\\tan A - \\tan B}{1 + \\tan A \\tan B}$$</div></div>

<p class="l-text"><strong>$\\sin(A + B)$ için geometrik kanıt.</strong> İki dik üçgeni üst üste yerleştir. Başlangıç noktasında $A$ açısı kadar dön ve $Q$ noktasına bir birim uzunluk çiz. $Q$'dan ek bir $B$ açısı kadar dön ve $1$ uzunluğunda bir dikme indir, ucu $P$ olsun. $x$-ekseninden $\\overrightarrow{OP}$'ye toplam açı $A + B$ olduğundan $P$'nin $x$-ekseninden yüksekliği tam olarak $\\sin(A + B)$'dir. $P$'nin yüksekliğini $\\overrightarrow{OQ}$'nun dikey izdüşümü artı $\\overrightarrow{QP}$'nin dikey izdüşümü olarak parçalayınca $\\sin A \\cos B + \\cos A \\sin B$ çıkar. Aynı dikey mesafenin iki ifadesi birbirine eşit olmalıdır.</p>

<div id="plot-sumab-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var A=35,B=25;var aR=A*Math.PI/180,bR=B*Math.PI/180;var sR=aR+bR;
var Q={x:Math.cos(aR),y:Math.sin(aR)};
var P={x:Math.cos(sR),y:Math.sin(sR)};
var xC=[];var yC=[];for(var i=0;i<=90;i++){var t=i*Math.PI/180;xC.push(0.18*Math.cos(t));yC.push(0.18*Math.sin(t));}
var arcA={x:xC.slice(0,A+1),y:yC.slice(0,A+1),mode:"lines",name:"A açısı",line:{color:"#4ecdc4",width:2}};
var arcB={x:[],y:[],mode:"lines",name:"B açısı",line:{color:"#f87171",width:2}};
for(var j=0;j<=B;j++){var tt=(A+j)*Math.PI/180;arcB.x.push(0.30*Math.cos(tt));arcB.y.push(0.30*Math.sin(tt));}
var rayOQ={x:[0,Q.x],y:[0,Q.y],mode:"lines+markers",name:"OQ",line:{color:"#c8a96e",width:2.5},marker:{size:6}};
var rayOP={x:[0,P.x],y:[0,P.y],mode:"lines+markers",name:"OP (A+B açısı)",line:{color:"#3b82f6",width:2.5},marker:{size:6}};
var heightP={x:[P.x,P.x],y:[0,P.y],mode:"lines",name:"sin(A+B)",line:{color:"#a78bfa",width:3,dash:"dot"}};
var labels={x:[0.20,0.34,P.x+0.06,Q.x+0.06],y:[0.07,0.13,P.y/2,Q.y/2],mode:"text",name:"etiketler",text:["A","B","sin(A+B)","birim"],textfont:{color:"#ebe6dc",size:12},showlegend:false};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-0.2,1.2],title:"x",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-0.15,1.1],title:"y"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-sumab-tr",[arcA,arcB,rayOQ,rayOP,heightP,labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlattığı:</strong> $OQ$ ışını $A$ açısında, $OP$ ışını ise $A + B$ açısında. Dikey mor parça $\\sin(A + B)$ — yani $P$'nin yüksekliği. Bu yüksekliği iki üst üste dik üçgen boyunca parçalayınca $\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B$ formülüne ulaşırsın.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $\\sin 75^{\\circ}$</div><div class="example-body"><strong>$\\sin 75^{\\circ}$'i kesin olarak hesapla.</strong><br><br>$75^{\\circ} = 45^{\\circ} + 30^{\\circ}$ yaz ve toplam formülünü uygula:<br>$\\sin(45^{\\circ} + 30^{\\circ}) = \\sin 45^{\\circ} \\cos 30^{\\circ} + \\cos 45^{\\circ} \\sin 30^{\\circ}$<br>$= \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{3}}{2} + \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{1}{2} = \\dfrac{\\sqrt{6}}{4} + \\dfrac{\\sqrt{2}}{4} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$.<br><br>Ondalık kontrol: $\\dfrac{2.449 + 1.414}{4} \\approx 0.966$. Hesap makinesi $\\sin 75^{\\circ} \\approx 0.9659$ doğrular.</div></div>

<h2 class="l-title">4. İki Kat Açı Formülleri</h2>

<p class="l-text">Toplam formüllerinde $A = B = \\theta$ koy ve terimleri topla. Sonuç <strong>iki kat açı</strong> özdeşlikleri ailesidir.</p>

<div class="calc-formula"><div class="formula-label">İKİ KAT AÇI — SİNÜS</div><div class="formula-main">$$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$$</div></div>

<div class="calc-formula"><div class="formula-label">İKİ KAT AÇI — KOSİNÜS (ÜÇ EŞDEĞER VERSİYON)</div><div class="formula-main">$$\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta \\;=\\; 2 \\cos^2 \\theta - 1 \\;=\\; 1 - 2 \\sin^2 \\theta$$</div><div class="formula-sub">Üçü de aynı özdeşlik. İkincisi $\\sin$'i tamamen yok eder; üçüncüsü $\\cos$'u yok eder. Hangisi daha temiz bir ifade veriyorsa onu seç.</div></div>

<div class="calc-formula"><div class="formula-label">İKİ KAT AÇI — TANJANT</div><div class="formula-main">$$\\tan 2\\theta = \\dfrac{2 \\tan \\theta}{1 - \\tan^2 \\theta}$$</div></div>

<p class="l-text"><strong>Üç kosinüs versiyonunun türetimi.</strong> $\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta$'dan başla ($A = B = \\theta$ ile kosinüs toplam formülü). $\\sin^2 \\theta = 1 - \\cos^2 \\theta$ yerine yaz: $\\cos 2\\theta = \\cos^2 \\theta - (1 - \\cos^2 \\theta) = 2 \\cos^2 \\theta - 1$. Diğer yöne, $\\cos^2 \\theta = 1 - \\sin^2 \\theta$, yerine yaz: $\\cos 2\\theta = (1 - \\sin^2 \\theta) - \\sin^2 \\theta = 1 - 2 \\sin^2 \\theta$.</p>

<div id="plot-double-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xC=[];var yC=[];for(var i=0;i<=360;i++){var t=i*Math.PI/180;xC.push(Math.cos(t));yC.push(Math.sin(t));}
var circle={x:xC,y:yC,mode:"lines",name:"birim çember",line:{color:"#3b82f6",width:2}};
var thD=25;var th=thD*Math.PI/180;var t2=2*th;
var P1={x:Math.cos(th),y:Math.sin(th)};var P2={x:Math.cos(t2),y:Math.sin(t2)};
var rayTh={x:[0,P1.x],y:[0,P1.y],mode:"lines+markers",name:"θ açısı",line:{color:"#c8a96e",width:2.5},marker:{size:7}};
var ray2Th={x:[0,P2.x],y:[0,P2.y],mode:"lines+markers",name:"2θ açısı",line:{color:"#f87171",width:2.5},marker:{size:7}};
var arcTh={x:[],y:[]};for(var k=0;k<=thD;k++){var tt=k*Math.PI/180;arcTh.x.push(0.18*Math.cos(tt));arcTh.y.push(0.18*Math.sin(tt));}
var arcT={x:arcTh.x,y:arcTh.y,mode:"lines",name:"θ yayı",line:{color:"#c8a96e",width:2}};
var arc2Th={x:[],y:[]};for(var k=0;k<=2*thD;k++){var tt=k*Math.PI/180;arc2Th.x.push(0.30*Math.cos(tt));arc2Th.y.push(0.30*Math.sin(tt));}
var arc2={x:arc2Th.x,y:arc2Th.y,mode:"lines",name:"2θ yayı",line:{color:"#f87171",width:2}};
var h2={x:[P2.x,P2.x],y:[0,P2.y],mode:"lines",name:"sin 2θ",line:{color:"#a78bfa",width:3,dash:"dot"}};
var w2={x:[0,P2.x],y:[0,0],mode:"lines",name:"cos 2θ",line:{color:"#4ecdc4",width:3,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"x",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.18)",range:[-1.3,1.3],title:"y"},margin:{t:24,r:24,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
Plotly.newPlot("plot-double-tr",[circle,rayTh,ray2Th,arcT,arc2,h2,w2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlattığı:</strong> Birim yarıçapı önce $\\theta$ açısı kadar, ardından bir $\\theta$ daha döndürerek $2\\theta$'ya ulaş. Son noktanın yatay izdüşümü $\\cos 2\\theta$, dikey izdüşümü $\\sin 2\\theta$. İki kat açı özdeşlikleri bu izdüşümleri yalnızca $\\sin \\theta$ ve $\\cos \\theta$ cinsinden ifade eder.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ KAT AÇI</div><div class="example-body"><strong>$\\sin \\theta = \\tfrac{4}{5}$, $\\theta$ birinci bölgede iken $\\sin 2\\theta$, $\\cos 2\\theta$, $\\tan 2\\theta$'yı bul.</strong><br><br>Pisagor: $\\cos \\theta = \\sqrt{1 - 16/25} = \\tfrac{3}{5}$ (1. bölgede pozitif).<br>$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta = 2 \\cdot \\tfrac{4}{5} \\cdot \\tfrac{3}{5} = \\tfrac{24}{25}$.<br>$\\cos 2\\theta = 1 - 2 \\sin^2 \\theta = 1 - 2 \\cdot \\tfrac{16}{25} = -\\tfrac{7}{25}$.<br>$\\tan 2\\theta = \\dfrac{\\sin 2\\theta}{\\cos 2\\theta} = \\dfrac{24/25}{-7/25} = -\\tfrac{24}{7}$.</div></div>

<h2 class="l-title">5. Yarım Açı Formülleri</h2>

<p class="l-text">Kosinüs iki kat açı özdeşliklerini $\\sin^2$ ve $\\cos^2$ için çöz, sonra karekök al:</p>

<p class="l-text">$\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$'dan $\\sin^2 \\theta = \\dfrac{1 - \\cos 2\\theta}{2}$. $\\theta$ yerine $\\theta/2$ koyarsan $\\sin^2(\\theta/2) = \\dfrac{1 - \\cos \\theta}{2}$ olur.</p>

<p class="l-text">$\\cos 2\\theta = 2 \\cos^2 \\theta - 1$'den benzer şekilde: $\\cos^2(\\theta/2) = \\dfrac{1 + \\cos \\theta}{2}$.</p>

<div class="calc-formula"><div class="formula-label">YARIM AÇI FORMÜLLERİ</div><div class="formula-main">$$\\sin \\dfrac{\\theta}{2} = \\pm \\sqrt{\\dfrac{1 - \\cos \\theta}{2}}, \\qquad \\cos \\dfrac{\\theta}{2} = \\pm \\sqrt{\\dfrac{1 + \\cos \\theta}{2}}$$ $$\\tan \\dfrac{\\theta}{2} = \\pm \\sqrt{\\dfrac{1 - \\cos \\theta}{1 + \\cos \\theta}} = \\dfrac{\\sin \\theta}{1 + \\cos \\theta} = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$$</div><div class="formula-sub">$\\pm$ işareti $\\theta/2$'nin bölgesi belirlenerek seçilir.</div></div>

<p class="l-text"><strong>İşaret seçimi.</strong> Formüller sana büyüklüğü verir. İşareti $\\theta/2$'nin bölgesinden bul: 1. bölgede her değer pozitif; 2. bölgede yalnız $\\sin$ pozitif; 3. bölgede yalnız $\\tan$ pozitif; 4. bölgede yalnız $\\cos$ pozitif (standart "Hep-Sin-Tan-Cos" kuralı).</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $\\tan 22.5^{\\circ}$</div><div class="example-body"><strong>$\\tan 22.5^{\\circ}$'yi kesin olarak hesapla.</strong><br><br>$22.5^{\\circ} = 45^{\\circ}/2$ olduğuna dikkat. Yarım açı formülünü $\\tan(\\theta/2) = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$ olarak $\\theta = 45^{\\circ}$ için uygula:<br><br>$\\tan 22.5^{\\circ} = \\dfrac{1 - \\cos 45^{\\circ}}{\\sin 45^{\\circ}} = \\dfrac{1 - \\sqrt{2}/2}{\\sqrt{2}/2} = \\dfrac{2 - \\sqrt{2}}{\\sqrt{2}} = \\dfrac{(2 - \\sqrt{2}) \\sqrt{2}}{2} = \\dfrac{2\\sqrt{2} - 2}{2} = \\sqrt{2} - 1$.<br><br>Ondalık kontrol: $\\sqrt{2} - 1 \\approx 0.4142$. Hesap makinesi $\\tan 22.5^{\\circ} \\approx 0.4142$ verir.</div></div>

<h2 class="l-title">6. Özdeşlik Kanıtlama Stratejileri</h2>

<p class="l-text">Özdeşlik kanıtlamak bir arama değil, bir zanaattir. Küçük bir alışkanlık kümesi, lisede karşılaşacağın hemen hemen her problemi çözer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zor tarafta çalış</div><div class="card-body">Daha karmaşık görünen tarafı seç ve onu dönüştür. Aynı anda iki taraf birden manipüle etmek dairesel akıl yürütmeye davet çıkarır.</div></div>
<div class="calc-card"><div class="card-title">$\\sin$ ve $\\cos$ ile yaz</div><div class="card-body">Şüphedeysen $\\tan, \\cot, \\sec, \\csc$'yi $\\sin$ ve $\\cos$ cinsinden aç. Sembol sayısı azalır, cebir saf kesirsel hale gelir.</div></div>
<div class="calc-card"><div class="card-title">Pisagor takasını kullan</div><div class="card-body">$\\sin^2 \\leftrightarrow 1 - \\cos^2$ ve $\\cos^2 \\leftrightarrow 1 - \\sin^2$ kareli terimleri öteki formülün ihtiyacı olanlarla değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Ortak payda</div><div class="card-body">Bir tarafta iki kesir varsa onları birleştirmek paydada bir toplam ya da fark özdeşliği ortaya çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Sıkı çarpanlara ayır</div><div class="card-body">$\\sin^2 - \\cos^2 = (\\sin - \\cos)(\\sin + \\cos)$ ve $1 - \\cos^2 = (1 - \\cos)(1 + \\cos)$ en çok işe yarayan çarpanlamalardır.</div></div>
<div class="calc-card"><div class="card-title">İki taraf eşleşince dur</div><div class="card-body">Manipülasyon öbür tarafı verir vermez kanıt biter. "Cebiri tamamlamak" için ileri gitme.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ KANIT — STRATEJİ İŞ BAŞINDA</div><div class="example-body"><strong>Kanıtla:</strong> $\\dfrac{1 - \\cos \\theta}{\\sin \\theta} = \\dfrac{\\sin \\theta}{1 + \\cos \\theta}$.<br><br><em>Strateji:</em> sağ taraf daha kolay; pay ve paydayı $(1 - \\cos \\theta)$ ile çarp ki $1 - \\cos^2$ ortaya çıksın:<br>$\\dfrac{\\sin \\theta}{1 + \\cos \\theta} \\cdot \\dfrac{1 - \\cos \\theta}{1 - \\cos \\theta} = \\dfrac{\\sin \\theta (1 - \\cos \\theta)}{1 - \\cos^2 \\theta} = \\dfrac{\\sin \\theta (1 - \\cos \\theta)}{\\sin^2 \\theta} = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$.<br><br>İki taraf eşleşti. İspat bitti.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ KANIT — TANJANT ÖZDEŞLİĞİ</div><div class="example-body"><strong>Kanıtla:</strong> $\\tan \\theta + \\cot \\theta = \\dfrac{1}{\\sin \\theta \\cos \\theta}$.<br><br><em>Strateji:</em> sol taraf $\\tan$ ve $\\cot$ karıştırıyor; ikisini de $\\sin$ ve $\\cos$ cinsinden yaz ve ortak paydada birleştir:<br>$\\tan \\theta + \\cot \\theta = \\dfrac{\\sin \\theta}{\\cos \\theta} + \\dfrac{\\cos \\theta}{\\sin \\theta} = \\dfrac{\\sin^2 \\theta + \\cos^2 \\theta}{\\sin \\theta \\cos \\theta} = \\dfrac{1}{\\sin \\theta \\cos \\theta}$.<br><br>Pisagor özdeşliği payı sıfırlayıp $1$'e indirir. İspat bitti.</div></div>

<div class="think-box"><div class="think-label">KÜÇÜK İPUCU</div><div class="think-body">Bir kanıt birkaç denemeden sonra tıkanırsa aynı ifadeye daha fazla bakma. İki tarafı da $\\sin$ ve $\\cos$ cinsinden yeniden yaz, sonra $\\theta = 30^{\\circ}$ gibi genel bir açı için sayısal değerleri hesapla. İki sayı uyuşmazsa önerilen özdeşlik <em>yanlıştır</em> — bulunacak bir kanıt yok. Uyuşursa cebirsel olarak ilerlemek için cesaretin vardır.</div></div>

<h2 class="l-title">7. Pratik — Üç Kesin Değer</h2>

<p class="l-text">Toplam, fark, iki kat ve yarım açı formüllerini birleştirerek hiçbir özel-açı tablosunda yer almayan açıları hesapla.</p>

<div class="calc-example"><div class="example-label">KESİN DEĞER — $\\cos 15^{\\circ}$</div><div class="example-body">$15^{\\circ} = 45^{\\circ} - 30^{\\circ}$ yaz:<br>$\\cos(45^{\\circ} - 30^{\\circ}) = \\cos 45^{\\circ} \\cos 30^{\\circ} + \\sin 45^{\\circ} \\sin 30^{\\circ}$<br>$= \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{3}}{2} + \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{1}{2} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$.</div></div>

<div class="calc-example"><div class="example-label">KESİN DEĞER — $\\sin 105^{\\circ}$</div><div class="example-body">$\\sin 105^{\\circ} = \\sin(60^{\\circ} + 45^{\\circ})$ kullan:<br>$\\sin 60^{\\circ} \\cos 45^{\\circ} + \\cos 60^{\\circ} \\sin 45^{\\circ} = \\dfrac{\\sqrt{3}}{2} \\cdot \\dfrac{\\sqrt{2}}{2} + \\dfrac{1}{2} \\cdot \\dfrac{\\sqrt{2}}{2} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$.<br><br>$\\sin 105^{\\circ} = \\sin 75^{\\circ}$ olduğuna dikkat — bütünler özdeşliği $\\sin(180^{\\circ} - x) = \\sin x$ bu sonucu doğrular.</div></div>

<div class="calc-example"><div class="example-label">KESİN DEĞER — $\\cos 22.5^{\\circ}$ (YARIM AÇI)</div><div class="example-body">$\\cos(\\theta/2) = \\sqrt{(1 + \\cos \\theta)/2}$ formülünü $\\theta = 45^{\\circ}$ için (pozitif işaret, 1. bölge) kullan:<br>$\\cos 22.5^{\\circ} = \\sqrt{\\dfrac{1 + \\sqrt{2}/2}{2}} = \\sqrt{\\dfrac{2 + \\sqrt{2}}{4}} = \\dfrac{\\sqrt{2 + \\sqrt{2}}}{2}$.<br><br>Ondalık kontrol: $\\dfrac{\\sqrt{3.414}}{2} \\approx 0.9239$. Hesap makinesi $\\cos 22.5^{\\circ} \\approx 0.9239$ verir.</div></div>

<h2 class="l-title">8. Klasik Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Kanıtla:</strong> $\\sec^2 \\theta - \\tan^2 \\theta = 1$.<br><br><em>İpucu:</em> $\\sin^2 + \\cos^2 = 1$'i $\\cos^2 \\theta$ ile böl. Sonuç $\\tan^2 + 1 = \\sec^2$; yeniden düzenle.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Kanıtla:</strong> $\\dfrac{\\cos \\theta}{1 - \\sin \\theta} = \\dfrac{1 + \\sin \\theta}{\\cos \\theta}$.<br><br><em>İpucu:</em> sol tarafın payını ve paydasını $(1 + \\sin \\theta)$ ile çarp; payda $1 - \\sin^2 \\theta = \\cos^2 \\theta$ olur.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Kesin olarak hesapla:</strong> $\\sin 15^{\\circ}$.<br><br><em>Çözüm:</em> $\\sin(45^{\\circ} - 30^{\\circ}) = \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{3}}{2} - \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{1}{2} = \\dfrac{\\sqrt{6} - \\sqrt{2}}{4}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>$\\cos \\theta = \\tfrac{5}{13}$ ve $\\theta$ 4. bölgede ise $\\sin 2\\theta$ ve $\\cos 2\\theta$'yı bul.</strong><br><br><em>Çözüm:</em> $\\sin \\theta = -\\sqrt{1 - 25/169} = -\\tfrac{12}{13}$ (4. bölge negatif). $\\sin 2\\theta = 2(-12/13)(5/13) = -\\tfrac{120}{169}$, $\\cos 2\\theta = 2(5/13)^2 - 1 = \\tfrac{50 - 169}{169} = -\\tfrac{119}{169}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Kanıtla:</strong> $\\sin(A + B) + \\sin(A - B) = 2 \\sin A \\cos B$.<br><br><em>Çözüm:</em> iki sinüs toplam-fark formülünü topla. $\\cos A \\sin B$ terimleri birbirini götürür, $\\sin A \\cos B$ terimleri katlanır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>Hesapla:</strong> $\\tan 105^{\\circ}$.<br><br><em>Çözüm:</em> $\\tan(60^{\\circ} + 45^{\\circ}) = \\dfrac{\\tan 60^{\\circ} + \\tan 45^{\\circ}}{1 - \\tan 60^{\\circ} \\tan 45^{\\circ}} = \\dfrac{\\sqrt{3} + 1}{1 - \\sqrt{3}}$. Rasyonelleştir: $(1 + \\sqrt{3})/(1 + \\sqrt{3})$ ile çarp; $\\dfrac{(\\sqrt{3} + 1)(1 + \\sqrt{3})}{1 - 3} = \\dfrac{\\sqrt{3} + 3 + 1 + \\sqrt{3}}{-2} = -\\dfrac{4 + 2\\sqrt{3}}{2} = -(2 + \\sqrt{3})$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7</div><div class="example-body"><strong>Kanıtla:</strong> $\\cos 3\\theta = 4 \\cos^3 \\theta - 3 \\cos \\theta$.<br><br><em>İpucu:</em> $\\cos 3\\theta = \\cos(2\\theta + \\theta) = \\cos 2\\theta \\cos \\theta - \\sin 2\\theta \\sin \\theta$. $\\cos 2\\theta = 2 \\cos^2 \\theta - 1$ ve $\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$ aç; ardından $\\sin^2 \\theta = 1 - \\cos^2 \\theta$ ile sadeleştir.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8</div><div class="example-body"><strong>Hesapla:</strong> $\\sin 22.5^{\\circ}$.<br><br><em>Çözüm:</em> $\\theta = 45^{\\circ}$ ile yarım açı, pozitif işaret (1. bölge): $\\sin 22.5^{\\circ} = \\sqrt{\\dfrac{1 - \\cos 45^{\\circ}}{2}} = \\sqrt{\\dfrac{1 - \\sqrt{2}/2}{2}} = \\dfrac{\\sqrt{2 - \\sqrt{2}}}{2}$.</div></div>

<h2 class="l-title">8b. Sık Yapılan Hatalar ve Nasıl Kaçınılır</h2>

<p class="l-text">Başlangıç çalışmalarında altı hata defalarca karşına çıkar. Önceden tanımak saatlerce hayal kırıklığından kurtarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sin(A + B) \\neq \\sin A + \\sin B$</div><div class="card-body">Trigonometrik fonksiyonlar <strong>doğrusal değildir</strong>. Bir toplamın sinüsü tam toplam formülüyle verilir, asla basit toplama ile değil. Aynı uyarı $\\cos$, $\\tan$ ve diğer her trigonometrik fonksiyon için de geçerli.</div></div>
<div class="calc-card"><div class="card-title">$\\sin^2 \\theta$ ile $\\sin \\theta^2$</div><div class="card-body">$\\sin^2 \\theta$, $(\\sin \\theta)^2$ demektir — sonucu karele. $\\sin(\\theta^2)$ ise $\\theta^2$'nin sinüsü demektir — önce açıyı karele, sonra sinüs al. İkisi tamamen farklıdır.</div></div>
<div class="calc-card"><div class="card-title">Yarım açıda yanlış işaret</div><div class="card-body">$\\sin(\\theta/2)$ ve $\\cos(\\theta/2)$ karekökten iki olası değer verir. $+$ ya da $-$ yazmadan önce $\\theta/2$'nin bölgesini <em>mutlaka</em> belirlemelisin.</div></div>
<div class="calc-card"><div class="card-title">$\\cos 2\\theta$ versiyonlarını karıştırma</div><div class="card-body">$\\cos 2\\theta$'nın üç biçimi de doğrudur, ama yanlışlıkla karıştırmak — örneğin $\\cos 2\\theta = 2 \\cos^2 \\theta - \\sin^2 \\theta$ yazmak — kesinlikle yanlış bir özdeşlik üretir. Birini seç ve onu temiz kullan.</div></div>
<div class="calc-card"><div class="card-title">Paydayı kontrol unutmak</div><div class="card-body">$\\tan(A + B)$, $1 - \\tan A \\tan B = 0$ olduğu yerde patlar. Yarım açı tanjant formülü $\\sin \\theta / (1 + \\cos \\theta)$, $\\cos \\theta = -1$ olduğunda başarısız olur. Yerine koyacağın açılar için paydanın sıfır olmadığını her zaman doğrula.</div></div>
<div class="calc-card"><div class="card-title">İki tarafta birden çalışmak</div><div class="card-body">Bir özdeşliği kanıtlarken <em>tek</em> tarafta çalış ki öteki tarafla eşleşene kadar. İki tarafı aynı anda manipüle etmek (özellikle karesini almak ya da bir şeyle çarpmak) yanlış çözümler üretip mantık zincirini bozabilir.</div></div>
</div>

<div class="calc-example"><div class="example-label">HATA ÖRNEĞİ — YARIM AÇI İŞARETİ</div><div class="example-body"><strong>$\\cos 200^{\\circ}/2 = \\cos 100^{\\circ}$'yi yarım açı formülüyle hesapla ve işareti doğru seç.</strong><br><br>$\\cos 100^{\\circ} = \\pm \\sqrt{(1 + \\cos 200^{\\circ})/2}$.<br><br>$100^{\\circ}$ ikinci bölgede ve burada $\\cos < 0$, yani <em>eksi</em> işaretini seç:<br>$\\cos 100^{\\circ} = -\\sqrt{(1 + \\cos 200^{\\circ})/2}$.<br><br>$\\cos 200^{\\circ} \\approx -0.9397$ kullanarak: $\\cos 100^{\\circ} \\approx -\\sqrt{0.0301} \\approx -0.1736$ — hesap makinesinin verdiği $\\cos 100^{\\circ} \\approx -0.1736$ ile eşleşir.</div></div>

<h2 class="l-title">9. Özdeşlik Özet Kartı</h2>

<p class="l-text">Bu derste kanıtlanan her özdeşliğin kompakt bir referansı, ailelere göre düzenlenmiş. Yazdır, defterine katla ve hamleler kas hafızası haline gelene kadar pratik sırasında bakıver.</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">PİSAGOR</div>
<div class="compare-item">$\\sin^2 \\theta + \\cos^2 \\theta = 1$</div>
<div class="compare-item">$1 + \\tan^2 \\theta = \\sec^2 \\theta$</div>
<div class="compare-item">$1 + \\cot^2 \\theta = \\csc^2 \\theta$</div>
<div class="compare-item">$\\sin^2 \\theta = 1 - \\cos^2 \\theta$ (takas)</div>
<div class="compare-item">$\\cos^2 \\theta = 1 - \\sin^2 \\theta$ (takas)</div>
</div>
<div class="compare-col">
<div class="compare-title">TOPLAM &amp; FARK</div>
<div class="compare-item">$\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$</div>
<div class="compare-item">$\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B$</div>
<div class="compare-item">$\\tan(A \\pm B) = \\dfrac{\\tan A \\pm \\tan B}{1 \\mp \\tan A \\tan B}$</div>
<div class="compare-item">Not: kosinüste işaret dönüşür — &quot;kosinüs takas eder&quot;.</div>
</div>
</div>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">İKİ KAT AÇI</div>
<div class="compare-item">$\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta$</div>
<div class="compare-item">$\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta$</div>
<div class="compare-item">$\\cos 2\\theta = 2 \\cos^2 \\theta - 1$</div>
<div class="compare-item">$\\cos 2\\theta = 1 - 2 \\sin^2 \\theta$</div>
<div class="compare-item">$\\tan 2\\theta = \\dfrac{2 \\tan \\theta}{1 - \\tan^2 \\theta}$</div>
</div>
<div class="compare-col">
<div class="compare-title">YARIM AÇI</div>
<div class="compare-item">$\\sin(\\theta/2) = \\pm \\sqrt{(1 - \\cos \\theta)/2}$</div>
<div class="compare-item">$\\cos(\\theta/2) = \\pm \\sqrt{(1 + \\cos \\theta)/2}$</div>
<div class="compare-item">$\\tan(\\theta/2) = \\dfrac{\\sin \\theta}{1 + \\cos \\theta}$</div>
<div class="compare-item">$\\tan(\\theta/2) = \\dfrac{1 - \\cos \\theta}{\\sin \\theta}$</div>
<div class="compare-item">İşaret: $\\theta/2$'nin bölgesinden.</div>
</div>
</div>

<h2 class="l-title">9b. Öz Değerlendirme (Hızlı Zihinsel Test)</h2>

<p class="l-text">Kataloğun oturup oturmadığını ölçen on iki çok kısa soru. Cevap sütununu elinle kapat ve her birini zihninden çöz.</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">SORU</div>
<div class="compare-item">1. $\\sin^2 30^{\\circ} + \\cos^2 30^{\\circ}$'yi sadeleştir.</div>
<div class="compare-item">2. $\\sin 2\\theta$'yı tek satırda yaz.</div>
<div class="compare-item">3. $\\cos 2\\theta$'nın üç biçimini söyle.</div>
<div class="compare-item">4. $\\sin(\\theta/2)$ için yarım açı formülü.</div>
<div class="compare-item">5. $\\cos(A - B)$ ile $\\cos(A + B)$ — hangisinde artı var?</div>
<div class="compare-item">6. $\\tan \\theta = 2$ ise $\\sec^2 \\theta$ kaçtır?</div>
</div>
<div class="compare-col">
<div class="compare-title">CEVAP</div>
<div class="compare-item">1. $= 1$ (Pisagor).</div>
<div class="compare-item">2. $2 \\sin \\theta \\cos \\theta$.</div>
<div class="compare-item">3. $\\cos^2 - \\sin^2$, $2 \\cos^2 - 1$, $1 - 2 \\sin^2$.</div>
<div class="compare-item">4. $\\pm \\sqrt{(1 - \\cos \\theta)/2}$.</div>
<div class="compare-item">5. $\\cos(A - B)$ çapraz terimde artıya sahip.</div>
<div class="compare-item">6. $1 + \\tan^2 = 1 + 4 = 5$.</div>
</div>
</div>

<h2 class="l-title">10. Bu Özdeşlikler Neden Önemli</h2>

<p class="l-text">Yukarıdaki dört aile yalıtılmış hesap-makinesi numarası değildir. Periyodik olayları kullanan her nicel disiplinde — yani aslında her nicel disiplinde — tekrar tekrar karşına çıkarlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geometri &amp; mühendislik ölçümü</div><div class="card-body">Topograflar bilinmeyen açıları bilinen referans yönlerinin toplamlarına bölerler ve $\\sin(A + B)$ uygulayarak hiç tırmanmadan binaların yüksekliklerini, nehrin karşısındaki uzaklıkları ve dağ rakımlarını hesaplarlar.</div></div>
<div class="calc-card"><div class="card-title">Fizik — dalga süperpozisyonu</div><div class="card-body">Aynı frekansta iki ses ya da ışık dalgası üst üste bindiğinde, $\\sin(\\omega t + \\phi_1) + \\sin(\\omega t + \\phi_2)$ cebri bu derste kanıtladığın formülleri birleştirerek elde edilen toplam-çarpım özdeşliklerine bel bağlar ve vuru, girişim, duran dalgaları öngörür.</div></div>
<div class="calc-card"><div class="card-title">Mühendislik — AC devreleri</div><div class="card-body">Alternatif akım ve gerilim sinüsoidlerdir. Gücün $P = V \\cdot I = V_0 \\sin(\\omega t) \\cdot I_0 \\sin(\\omega t + \\phi)$ ile hesaplanması, kendisi de burada kanıtladığın toplam ve fark formüllerinin bir düzenlemesi olan çarpım-toplam özdeşliğini gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Astronomi</div><div class="card-body">Bir kürenin yüzeyindeki trigonometri olan küresel trigonometri, bir teleskoptaki her yıldız için koordinat sistemleri arasında dönüşüm (sağ açıklık/dik açıklık ile yatay-açı/yükseklik) yapmak için bu özdeşlikleri kullanır.</div></div>
<div class="calc-card"><div class="card-title">Bilgisayar grafiği</div><div class="card-body">2B bir şeklin $A + B$ açısıyla her döndürmesi, önce $A$ sonra $B$ ile iki döndürmeye ayrışır. Bir döndürme matrisinin girdileri $\\cos$ ve $\\sin$ olduğundan döndürmeleri birleştirmek harfiyen iş başındaki toplam formülüdür.</div></div>
<div class="calc-card"><div class="card-title">Müzik &amp; sinyal işleme</div><div class="card-body">Her periyodik sinyali sinüs ve kosinüslerin toplamı olarak temsil eden Fourier analizi, trigonometrik fonksiyon çarpımlarına dair aynı cebire dayanır. Ses sıkıştırma (MP3, AAC), görüntü sıkıştırma (JPEG) ve her modern radyo arka planda bu özdeşliklere bel bağlar.</div></div>
</div>

<div class="think-box"><div class="think-label">İLERİYE BAKIŞ</div><div class="think-body">Buradaki özdeşlikler — Pisagor, toplam-fark, iki kat, yarım açı — iş gören özdeşliklerdir. Sonraki ders daha sonra integral ve Fourier analizinde vazgeçilmez olan <em>çarpım-toplam</em>, <em>toplam-çarpım</em> ve <em>güç indirgeme</em> formüllerini ekler. Önce bu dersteki aileyi içselleştir; gerisi doğal olarak yerine oturur.</div></div>
`

};
