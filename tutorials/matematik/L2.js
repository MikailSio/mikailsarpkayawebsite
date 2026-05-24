window.LISE_MAT_L2 = {

en: `<p class="l-text"><strong>Trigonometric ratios are the bridge between angles and side lengths.</strong> In Lesson 1 you learned how to measure angles using degrees and radians and how to place them on the unit circle. In this lesson you learn how each angle gives rise to <em>six numerical ratios</em>: sine, cosine, tangent, cotangent, secant, and cosecant. These six numbers carry all of the geometric information of the angle.</p>`

+ `<p class="l-text">We will define the ratios in two equivalent ways: first using a right triangle (the classical SOH-CAH-TOA approach you will have seen briefly in middle school), then using the unit circle (the modern definition, which works for any angle — positive, negative, or larger than 360 degrees). We will see why the two definitions agree, how the six ratios are related, and how to use them to solve practical right-triangle problems.</p>`

+ `<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">`
+ `<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>`
+ `<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">`
+ `<li>Define sin, cos, tan in a right triangle using the SOH-CAH-TOA mnemonic</li>`
+ `<li>Restate sin and cos as coordinates of a point on the unit circle, valid for any angle</li>`
+ `<li>Define the reciprocal ratios cot, sec, csc and connect them to sin and cos</li>`
+ `<li>Prove and use the Pythagorean identities $\\sin^2\\theta + \\cos^2\\theta = 1$ and its two cousins</li>`
+ `<li>Determine the signs of the six ratios in each of the four quadrants (ASTC rule)</li>`
+ `<li>Use the complementary-angle identities $\\sin(90^\\circ - \\theta) = \\cos\\theta$ to switch between ratios</li>`
+ `</ul>`
+ `</div>`

/* ============================================================
   SECTION 1: Ratios in a Right Triangle
   ============================================================ */
+ `<h2 class="lesson-title">1. Ratios in a Right Triangle</h2>`

+ `<div class="calc-highlight"><strong>Everyday picture:</strong> A ladder leaning against a wall makes some angle with the ground. If we know that angle and the length of the ladder, we can compute how high it reaches and how far the foot of the ladder sits from the wall — without ever measuring those distances directly. That is what trigonometric ratios let us do.</div>`

+ `<p class="l-text">Take a right triangle with one acute angle $\\theta$. Standing at that angle and looking across, the three sides have three distinct roles:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card">`
+ `<div class="card-title">Hypotenuse</div>`
+ `<div class="card-body">The longest side, always opposite the right angle. Its length is denoted $c$ in most textbooks. The hypotenuse never touches the angle $\\theta$ except at one endpoint.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Opposite side (karşı)</div>`
+ `<div class="card-body">The side across from the angle $\\theta$. It is the side you do <em>not</em> touch when standing at vertex $\\theta$. Often denoted $a$.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Adjacent side (komşu)</div>`
+ `<div class="card-body">The side that <em>touches</em> the angle $\\theta$ (and is not the hypotenuse). Often denoted $b$.</div>`
+ `</div>`
+ `</div>`

+ `<p class="l-text">The three primary trigonometric ratios are defined as quotients of these sides. The classical mnemonic is <strong>SOH-CAH-TOA</strong>:</p>`

+ `<div class="calc-formula"><div class="formula-label">PRIMARY TRIGONOMETRIC RATIOS (RIGHT TRIANGLE)</div><div class="formula-main">$$\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{a}{c} \\qquad \\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}} = \\frac{b}{c} \\qquad \\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{a}{b}$$</div><div class="formula-sub">SOH = Sine Opposite Hypotenuse. CAH = Cosine Adjacent Hypotenuse. TOA = Tangent Opposite Adjacent.</div></div>`

+ `<p class="l-text"><strong>Why these ratios?</strong> They depend only on the angle, not on how large the triangle is. Two triangles with the same acute angle $\\theta$ are similar (their angles match), so corresponding sides are in the same proportion. Whether your triangle is 3-4-5 or 6-8-10, the angle opposite the side of length 3 (or 6) gives $\\sin\\theta = 3/5 = 6/10 = 0.6$. The ratio is a property of the angle alone.</p>`

/* --- Plotly: right triangle with labels --- */
+ `<div id="plot-righttri-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var tri={x:[0,4,0,0],y:[0,0,3,0],mode:"lines+markers",name:"triangle",line:{color:"#3b82f6",width:3},marker:{size:8,color:"#3b82f6"},fill:"toself",fillcolor:"rgba(59,130,246,0.08)",showlegend:false};`
+ `var rt={x:[0,0.35,0.35],y:[0.35,0.35,0],mode:"lines",line:{color:"#ebe6dc",width:1.5},showlegend:false};`
+ `var ann=[{x:2,y:-0.35,text:"adjacent (b = 4)",showarrow:false,font:{color:"#ebe6dc",size:13}},{x:2.4,y:1.5,text:"hypotenuse (c = 5)",showarrow:false,font:{color:"#f87171",size:13}},{x:-0.55,y:1.5,text:"opposite (a = 3)",showarrow:false,textangle:-90,font:{color:"#4ecdc4",size:13}},{x:0.85,y:0.18,text:"θ",showarrow:false,font:{color:"#3b82f6",size:18}}];`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-1.2,4.8],scaleanchor:"y",title:""},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.8,3.6],title:""},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:false};`
+ `Plotly.newPlot("plot-righttri-en",[tri,rt],layout,{responsive:true,displayModeBar:false});`
+ `},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this figure shows:</strong> A 3-4-5 right triangle with the acute angle $\\theta$ at the origin. The side opposite $\\theta$ has length 3, the side adjacent to $\\theta$ has length 4, and the hypotenuse has length 5. From SOH-CAH-TOA: $\\sin\\theta = 3/5 = 0.6$, $\\cos\\theta = 4/5 = 0.8$, $\\tan\\theta = 3/4 = 0.75$.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (3-4-5 TRIANGLE)</div><div class="example-body"><strong>For the triangle above, compute sin, cos and tan of the angle $\\theta$.</strong><br><br>The opposite side has length 3, the adjacent side has length 4, the hypotenuse has length 5.<br><br>$\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}} = \\dfrac{3}{5} = 0.6$<br>$\\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}} = \\dfrac{4}{5} = 0.8$<br>$\\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}} = \\dfrac{3}{4} = 0.75$<br><br>From a calculator, the angle whose sine is 0.6 is approximately $\\theta \\approx 36.87^\\circ$.</div></div>`

+ `<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If we labelled the <em>other</em> acute angle in the same 3-4-5 triangle (call it $\\varphi$, at the top vertex), the roles of opposite and adjacent would swap: the side of length 4 would become opposite and the side of length 3 would become adjacent. So $\\sin\\varphi = 4/5$, $\\cos\\varphi = 3/5$. Notice that $\\sin\\varphi = \\cos\\theta$. This is no accident — it is the complementary-angle identity we will meet in Section 8.</div></div>`

/* ============================================================
   SECTION 2: Definition via the Unit Circle
   ============================================================ */
+ `<h2 class="lesson-title">2. Definition via the Unit Circle</h2>`

+ `<div class="calc-highlight"><strong>Everyday picture:</strong> The right-triangle definition only works for acute angles ($0^\\circ < \\theta < 90^\\circ$). But we often need to take sine and cosine of $150^\\circ$, $-30^\\circ$, or $720^\\circ$. The unit circle solves this: every angle, no matter how large or how negative, corresponds to a single point on the circle, and the coordinates of that point are sine and cosine.</div>`

+ `<p class="l-text">Draw the <strong>unit circle</strong>: a circle of radius 1 centred at the origin. Starting from the positive $x$-axis, rotate counter-clockwise by an angle $\\theta$. You land on a unique point $P$ on the circle. Let its coordinates be $(x, y)$.</p>`

+ `<div class="calc-formula"><div class="formula-label">UNIT-CIRCLE DEFINITION</div><div class="formula-main">$$\\cos\\theta = x, \\qquad \\sin\\theta = y, \\qquad \\tan\\theta = \\frac{y}{x} \\;\\; (x \\neq 0)$$</div><div class="formula-sub">The point on the unit circle at angle $\\theta$ is $P = (\\cos\\theta,\\, \\sin\\theta)$.</div></div>`

+ `<p class="l-text"><strong>Why this agrees with the right-triangle definition.</strong> Drop a perpendicular from $P = (x, y)$ to the $x$-axis. You now have a right triangle with hypotenuse 1 (the radius), opposite side $y$ and adjacent side $x$. Plugging into SOH-CAH-TOA: $\\sin\\theta = y/1 = y$ and $\\cos\\theta = x/1 = x$. Identical.</p>`

+ `<p class="l-text">But the unit-circle definition keeps working when $\\theta$ is outside the range $(0^\\circ, 90^\\circ)$. For $\\theta = 150^\\circ$, the point $P$ sits in the second quadrant with $x < 0$ and $y > 0$, giving $\\cos 150^\\circ < 0$ and $\\sin 150^\\circ > 0$. For $\\theta = -30^\\circ$, we rotate clockwise instead, landing in the fourth quadrant.</p>`

/* --- Plotly: unit circle with sin/cos visualization --- */
+ `<div id="plot-unitcircle-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var th=[];var cx=[];var cy=[];for(var i=0;i<=360;i++){var r=i*Math.PI/180;th.push(r);cx.push(Math.cos(r));cy.push(Math.sin(r));}`
+ `var circle={x:cx,y:cy,mode:"lines",name:"unit circle",line:{color:"#3b82f6",width:2.5}};`
+ `var ang=50*Math.PI/180;var px=Math.cos(ang);var py=Math.sin(ang);`
+ `var radius={x:[0,px],y:[0,py],mode:"lines+markers",name:"radius (length 1)",line:{color:"#f87171",width:2},marker:{size:[0,9],color:"#f87171"}};`
+ `var dropX={x:[px,px],y:[0,py],mode:"lines",name:"sin θ = y",line:{color:"#4ecdc4",width:2.5,dash:"dash"}};`
+ `var dropY={x:[0,px],y:[0,0],mode:"lines",name:"cos θ = x",line:{color:"#facc15",width:2.5,dash:"dash"}};`
+ `var ann=[{x:px+0.12,y:py+0.06,text:"P=(cos θ, sin θ)",showarrow:false,font:{color:"#f87171",size:12}},{x:0.18,y:0.07,text:"θ",showarrow:false,font:{color:"#3b82f6",size:16}}];`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.4,1.4],scaleanchor:"y",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.4,1.4],title:"y"},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};`
+ `Plotly.newPlot("plot-unitcircle-en",[circle,radius,dropX,dropY],layout,{responsive:true,displayModeBar:false});`
+ `},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this figure shows:</strong> The unit circle (blue). A radius is drawn to the point $P$ at angle $\\theta = 50^\\circ$. The horizontal yellow segment from $(0,0)$ to $(x,0)$ has length $\\cos\\theta$. The vertical teal segment from $(x,0)$ to $(x,y)$ has length $\\sin\\theta$. As $\\theta$ changes, $P$ slides around the circle and its coordinates trace out $\\cos$ and $\\sin$.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (FOUR SPECIAL ANGLES)</div><div class="example-body"><strong>Use the unit circle to read off cos and sin of $0^\\circ$, $90^\\circ$, $180^\\circ$, $270^\\circ$.</strong><br><br>At $0^\\circ$: $P = (1, 0)$, so $\\cos 0^\\circ = 1$, $\\sin 0^\\circ = 0$.<br>At $90^\\circ$: $P = (0, 1)$, so $\\cos 90^\\circ = 0$, $\\sin 90^\\circ = 1$.<br>At $180^\\circ$: $P = (-1, 0)$, so $\\cos 180^\\circ = -1$, $\\sin 180^\\circ = 0$.<br>At $270^\\circ$: $P = (0, -1)$, so $\\cos 270^\\circ = 0$, $\\sin 270^\\circ = -1$.<br><br>These are the "quadrantal" angles. Memorise the picture, not the table.</div></div>`

+ `<div class="l-note"><strong>Interactive demo (optional).</strong> Open a GeoGebra applet such as <code>geogebra.org/m/unit-circle</code> or build your own with a slider for $\\theta$. As you drag the slider, watch the point $P$ move around the circle and the horizontal and vertical projections shrink and grow. This is the single best way to internalise the unit-circle definition.</div>`

/* ============================================================
   SECTION 3: The Other Three Ratios
   ============================================================ */
+ `<h2 class="lesson-title">3. The Other Three Ratios</h2>`

+ `<p class="l-text">Besides sine, cosine and tangent, there are three more trigonometric ratios. Each is the reciprocal (multiplicative inverse) of one of the first three.</p>`

+ `<div class="calc-formula"><div class="formula-label">RECIPROCAL TRIGONOMETRIC RATIOS</div><div class="formula-main">$$\\cot\\theta = \\frac{1}{\\tan\\theta} = \\frac{\\cos\\theta}{\\sin\\theta} \\qquad \\sec\\theta = \\frac{1}{\\cos\\theta} \\qquad \\csc\\theta = \\frac{1}{\\sin\\theta}$$</div><div class="formula-sub">Cotangent = reciprocal of tangent. Secant = reciprocal of cosine. Cosecant = reciprocal of sine.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card">`
+ `<div class="card-title">Cotangent (cot)</div>`
+ `<div class="card-body">$\\cot\\theta = \\cos\\theta / \\sin\\theta$. Undefined where $\\sin\\theta = 0$, i.e. at $\\theta = 0^\\circ, 180^\\circ, 360^\\circ, \\dots$. In a right triangle: $\\cot\\theta = \\text{adjacent} / \\text{opposite}$.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Secant (sec)</div>`
+ `<div class="card-body">$\\sec\\theta = 1 / \\cos\\theta$. Undefined where $\\cos\\theta = 0$, i.e. at $\\theta = 90^\\circ, 270^\\circ, \\dots$. In a right triangle: $\\sec\\theta = \\text{hypotenuse} / \\text{adjacent}$.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Cosecant (csc)</div>`
+ `<div class="card-body">$\\csc\\theta = 1 / \\sin\\theta$. Undefined where $\\sin\\theta = 0$. In a right triangle: $\\csc\\theta = \\text{hypotenuse} / \\text{opposite}$.</div>`
+ `</div>`
+ `</div>`

+ `<p class="l-text"><strong>Naming logic.</strong> The "co-" prefix (cosine, cotangent, cosecant) means "complement of". Each "co-" ratio is the ordinary ratio of the <em>complementary</em> angle (the angle that adds to $\\theta$ to make $90^\\circ$). For example $\\cos\\theta = \\sin(90^\\circ - \\theta)$. We will return to this in Section 8.</p>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (ALL SIX RATIOS)</div><div class="example-body"><strong>For the 3-4-5 triangle, compute all six ratios of the angle $\\theta$ where the opposite side has length 3.</strong><br><br>From Section 1 we already have $\\sin\\theta = 3/5$, $\\cos\\theta = 4/5$, $\\tan\\theta = 3/4$.<br><br>Reciprocals:<br>$\\csc\\theta = 5/3 \\approx 1.667$<br>$\\sec\\theta = 5/4 = 1.25$<br>$\\cot\\theta = 4/3 \\approx 1.333$<br><br>Sanity check: $\\tan\\theta \\cdot \\cot\\theta = (3/4)(4/3) = 1$. Good.</div></div>`

+ `<div class="l-warn"><strong>Notation pitfall.</strong> Many calculators have buttons labelled $\\sin^{-1}$, $\\cos^{-1}$, $\\tan^{-1}$ — these are the <em>inverse</em> functions (which take a ratio and return an angle), <em>not</em> the reciprocal $1/\\sin$. So $\\sin^{-1}(0.5) = 30^\\circ$ but $1/\\sin(30^\\circ) = \\csc(30^\\circ) = 2$. Be careful — the two operations are completely different.</div>`

/* ============================================================
   SECTION 4: Geometric Picture of the Six Ratios
   ============================================================ */
+ `<h2 class="lesson-title">4. Geometric Picture of the Six Ratios</h2>`

+ `<p class="l-text">On the unit circle the three "main" ratios have an elegant geometric reading. For an acute angle $\\theta$:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card">`
+ `<div class="card-title">Cosine = horizontal projection</div>`
+ `<div class="card-body">$\\cos\\theta$ is the $x$-coordinate of $P$: the signed length of the projection of the radius onto the $x$-axis.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Sine = vertical projection</div>`
+ `<div class="card-body">$\\sin\\theta$ is the $y$-coordinate of $P$: the signed length of the projection of the radius onto the $y$-axis.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Tangent = length on the tangent line</div>`
+ `<div class="card-body">Extend the radius to meet the vertical line $x = 1$. The signed $y$-coordinate of the intersection is $\\tan\\theta$. (That is why the function is called <em>tangent</em>: it lives on the tangent line to the circle.)</div>`
+ `</div>`
+ `</div>`

+ `<p class="l-text"><strong>Why tangent is read on the vertical tangent line $x = 1$.</strong> The radius through $P = (\\cos\\theta, \\sin\\theta)$ has slope $\\sin\\theta / \\cos\\theta = \\tan\\theta$. Extending the radius until $x = 1$ multiplies both coordinates by $1/\\cos\\theta$, so $y$ becomes $\\sin\\theta / \\cos\\theta = \\tan\\theta$. Thus the $y$-coordinate of that intersection is literally the tangent of the angle.</p>`

+ `<p class="l-text"><strong>Secant and cosecant.</strong> The secant line from the origin that passes through $P$ and continues to meet the vertical tangent at $x=1$ has length $\\sec\\theta$ from origin to the intersection (when $\\theta$ is acute). That is the geometric origin of the name <em>secant</em> ("cutting" line). Similarly $\\csc\\theta$ corresponds to the secant cut by the horizontal tangent line $y = 1$.</p>`

+ `<div class="think-box"><div class="think-label">A USEFUL VISUAL HABIT</div><div class="think-body">Every time you see $\\sin\\theta$ or $\\cos\\theta$ in a problem, mentally picture the radius of the unit circle at angle $\\theta$ and its $y$- or $x$-projection. The sign of the answer (positive or negative) and roughly its magnitude (close to 0, close to 1) become visible at a glance. This trick saves enormous time in exam questions.</div></div>`

/* ============================================================
   SECTION 5: Pythagorean Identities
   ============================================================ */
+ `<h2 class="lesson-title">5. Pythagorean Identities</h2>`

+ `<div class="calc-highlight"><strong>The most important identity in trigonometry.</strong> The point $P = (\\cos\\theta, \\sin\\theta)$ lives on the unit circle, whose equation is $x^2 + y^2 = 1$. Substituting $x = \\cos\\theta$ and $y = \\sin\\theta$ gives the famous identity below — true for <em>every</em> angle $\\theta$, no matter how large, small, or negative.</div>`

+ `<div class="calc-formula"><div class="formula-label">FUNDAMENTAL PYTHAGOREAN IDENTITY</div><div class="formula-main">$$\\sin^2\\theta + \\cos^2\\theta = 1$$</div><div class="formula-sub">Read $\\sin^2\\theta$ as $(\\sin\\theta)^2$ — the square of the sine, not the sine of the square.</div></div>`

+ `<p class="l-text"><strong>Two cousin identities.</strong> Divide both sides of $\\sin^2\\theta + \\cos^2\\theta = 1$ by $\\cos^2\\theta$ (allowed where $\\cos\\theta \\neq 0$):</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin^2\\theta}{\\cos^2\\theta} + 1 = \\frac{1}{\\cos^2\\theta} \\;\\;\\Longrightarrow\\;\\; \\tan^2\\theta + 1 = \\sec^2\\theta$$</div></div>`

+ `<p class="l-text">And dividing the original by $\\sin^2\\theta$ instead (where $\\sin\\theta \\neq 0$) gives the third member of the family:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$1 + \\cot^2\\theta = \\csc^2\\theta$$</div><div class="formula-sub">The three Pythagorean identities. Together they let you express any one trigonometric ratio in terms of any other (up to sign).</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (FIND cos GIVEN sin)</div><div class="example-body"><strong>Given that $\\sin\\theta = 0.6$ and $\\theta$ is an acute angle, find $\\cos\\theta$ and $\\tan\\theta$.</strong><br><br>Use the Pythagorean identity: $\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - 0.36 = 0.64$.<br><br>Take the positive square root (because $\\theta$ is acute, so $\\cos\\theta > 0$): $\\cos\\theta = 0.8$.<br><br>Then $\\tan\\theta = \\sin\\theta / \\cos\\theta = 0.6 / 0.8 = 0.75$.<br><br>Notice this is exactly the 3-4-5 triangle of Section 1 — we have recovered the same ratios from a single given quantity.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (PROOF USING IDENTITIES)</div><div class="example-body"><strong>Prove the identity $\\sec^2\\theta - \\tan^2\\theta = 1$.</strong><br><br><em>Approach 1.</em> Direct from the cousin identity: $\\tan^2\\theta + 1 = \\sec^2\\theta$ rearranges to $\\sec^2\\theta - \\tan^2\\theta = 1$. Done.<br><br><em>Approach 2 (from scratch).</em> Convert both sides to sines and cosines:<br>$\\sec^2\\theta - \\tan^2\\theta = \\dfrac{1}{\\cos^2\\theta} - \\dfrac{\\sin^2\\theta}{\\cos^2\\theta} = \\dfrac{1 - \\sin^2\\theta}{\\cos^2\\theta} = \\dfrac{\\cos^2\\theta}{\\cos^2\\theta} = 1$, using the fundamental identity in the second-to-last step.</div></div>`

/* ============================================================
   SECTION 6: Right-Triangle Applications
   ============================================================ */
+ `<h2 class="lesson-title">6. Right-Triangle Applications</h2>`

+ `<p class="l-text">In practical problems we are usually given one angle (other than the right angle) plus one side, and asked to find the other two sides. The strategy is always the same:</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step">`
+ `<div class="step-num">1</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Label the triangle</div>`
+ `<div class="step-detail">Identify the hypotenuse, the side opposite the given angle, and the side adjacent to it.</div>`
+ `</div>`
+ `</div>`
+ `<div class="calc-step">`
+ `<div class="step-num">2</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Choose the right ratio</div>`
+ `<div class="step-detail">Pick the ratio that connects the side you <em>know</em> with the side you <em>want</em>. For example, opposite + hypotenuse $\\to$ sine. Adjacent + opposite $\\to$ tangent.</div>`
+ `</div>`
+ `</div>`
+ `<div class="calc-step">`
+ `<div class="step-num">3</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Set up the equation</div>`
+ `<div class="step-detail">Write $\\sin\\theta = \\text{opp}/\\text{hyp}$ (or similar) with the known quantities filled in. Solve algebraically.</div>`
+ `</div>`
+ `</div>`
+ `<div class="calc-step">`
+ `<div class="step-num">4</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Evaluate with a calculator</div>`
+ `<div class="step-detail">Compute trigonometric values in degree mode if the angle is given in degrees, radian mode if in radians.</div>`
+ `</div>`
+ `</div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — LADDER AGAINST A WALL</div><div class="example-body"><strong>A 5 m ladder is leaning against a vertical wall. The ladder makes an angle of $70^\\circ$ with the ground. How high up the wall does the top of the ladder reach?</strong><br><br>The hypotenuse is the ladder itself (length 5). The "height up the wall" is the side opposite the $70^\\circ$ angle. Use sine:<br>$\\sin 70^\\circ = \\dfrac{\\text{height}}{5}$, so $\\text{height} = 5 \\sin 70^\\circ$.<br><br>Using $\\sin 70^\\circ \\approx 0.9397$: $\\text{height} \\approx 5 \\cdot 0.9397 \\approx 4.70$ m.<br><br>So the top of the ladder reaches about <strong>4.7 metres</strong> up the wall.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — HEIGHT OF A FLAGPOLE</div><div class="example-body"><strong>From a point 20 m from the foot of a flagpole, the angle of elevation to the top is $35^\\circ$. How tall is the flagpole?</strong><br><br>The adjacent side (along the ground) has length 20. The height is opposite to $35^\\circ$. Use tangent:<br>$\\tan 35^\\circ = \\dfrac{\\text{height}}{20}$, so $\\text{height} = 20 \\tan 35^\\circ$.<br><br>Using $\\tan 35^\\circ \\approx 0.7002$: $\\text{height} \\approx 20 \\cdot 0.7002 \\approx 14.00$ m.<br><br>The flagpole is roughly <strong>14 m tall</strong>.</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — RIVER WIDTH</div><div class="example-body"><strong>You stand on one bank of a river. Directly across, you see a tree. You walk 50 m along the bank and now the line of sight to the tree makes a $40^\\circ$ angle with the bank. How wide is the river?</strong><br><br>The river width is the side opposite the $40^\\circ$ angle. The 50 m walked along the bank is adjacent. Use tangent again:<br>$\\tan 40^\\circ = \\dfrac{\\text{width}}{50}$, so $\\text{width} = 50 \\tan 40^\\circ$.<br><br>Using $\\tan 40^\\circ \\approx 0.8391$: $\\text{width} \\approx 50 \\cdot 0.8391 \\approx 41.95$ m. So the river is about <strong>42 m wide</strong>.</div></div>`

+ `<div class="l-note"><strong>When to use which ratio.</strong> Build the habit of asking "what do I have, what do I want?" Then read off SOH-CAH-TOA. If you have two sides and want an angle, use the inverse function on a calculator: $\\theta = \\sin^{-1}(\\text{opp}/\\text{hyp})$, etc.</div>`

/* ============================================================
   SECTION 7: Signs in the Four Quadrants (ASTC)
   ============================================================ */
+ `<h2 class="lesson-title">7. Signs in the Four Quadrants (ASTC)</h2>`

+ `<div class="calc-highlight"><strong>Everyday picture:</strong> The unit-circle picture also tells us instantly whether a trigonometric ratio is positive or negative, depending on which quadrant the angle lands in. The mnemonic <strong>ASTC</strong> ("All Students Take Calculus", or in Turkish "Hep-Sin-Tan-Cos") summarises which ratios are positive in which quadrant.</div>`

+ `<p class="l-text">Recall that on the unit circle $\\cos\\theta$ is the $x$-coordinate and $\\sin\\theta$ is the $y$-coordinate. Whether these are positive or negative depends on the quadrant:</p>`

+ `<div class="calc-compare"><div class="compare-col"><div class="compare-title">QUADRANT I  (0° – 90°)</div><div class="compare-item">$x > 0$, $y > 0$</div><div class="compare-item"><strong>All</strong> six ratios positive</div><div class="compare-item">sin +, cos +, tan +</div></div><div class="compare-col"><div class="compare-title">QUADRANT II  (90° – 180°)</div><div class="compare-item">$x < 0$, $y > 0$</div><div class="compare-item">Only <strong>Sine</strong> (and csc) positive</div><div class="compare-item">sin +, cos −, tan −</div></div></div>`

+ `<div class="calc-compare"><div class="compare-col"><div class="compare-title">QUADRANT III  (180° – 270°)</div><div class="compare-item">$x < 0$, $y < 0$</div><div class="compare-item">Only <strong>Tangent</strong> (and cot) positive</div><div class="compare-item">sin −, cos −, tan +</div></div><div class="compare-col"><div class="compare-title">QUADRANT IV  (270° – 360°)</div><div class="compare-item">$x > 0$, $y < 0$</div><div class="compare-item">Only <strong>Cosine</strong> (and sec) positive</div><div class="compare-item">sin −, cos +, tan −</div></div></div>`

+ `<div class="calc-formula"><div class="formula-label">THE ASTC MNEMONIC</div><div class="formula-main">$$\\text{I: All} \\;\\;|\\;\\; \\text{II: Sine} \\;\\;|\\;\\; \\text{III: Tangent} \\;\\;|\\;\\; \\text{IV: Cosine}$$</div><div class="formula-sub">Read counter-clockwise from quadrant I: A-S-T-C. These are the ratios that are <em>positive</em> in each quadrant. Reciprocal ratios (csc, cot, sec) follow the same sign as their parent (sin, tan, cos).</div></div>`

/* --- Plotly: ASTC sign diagram --- */
+ `<div id="plot-astc-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var th=[];var cx=[];var cy=[];for(var i=0;i<=360;i++){var r=i*Math.PI/180;th.push(r);cx.push(Math.cos(r));cy.push(Math.sin(r));}`
+ `var circle={x:cx,y:cy,mode:"lines",name:"unit circle",line:{color:"#3b82f6",width:2.5},showlegend:false};`
+ `var ann=[{x:0.55,y:0.55,text:"I: All +",showarrow:false,font:{color:"#4ecdc4",size:14}},{x:-0.55,y:0.55,text:"II: Sine +",showarrow:false,font:{color:"#facc15",size:14}},{x:-0.55,y:-0.55,text:"III: Tan +",showarrow:false,font:{color:"#f87171",size:14}},{x:0.55,y:-0.55,text:"IV: Cos +",showarrow:false,font:{color:"#a78bfa",size:14}}];`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.4)",range:[-1.4,1.4],scaleanchor:"y",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.4)",range:[-1.4,1.4],title:"y"},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:false};`
+ `Plotly.newPlot("plot-astc-en",[circle],layout,{responsive:true,displayModeBar:false});`
+ `},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this figure shows:</strong> The four quadrants of the coordinate plane with the unit circle. Each label names which trigonometric ratio (besides its reciprocal) is positive in that quadrant. In quadrant I all are positive; in quadrant II only sine (and csc); in quadrant III only tangent (and cot); in quadrant IV only cosine (and sec).</div></div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (SIGN FROM QUADRANT)</div><div class="example-body"><strong>Without using a calculator, determine the sign of (a) $\\sin 200^\\circ$, (b) $\\cos 310^\\circ$, (c) $\\tan 135^\\circ$.</strong><br><br>(a) $200^\\circ$ sits in quadrant III ($180^\\circ < 200^\\circ < 270^\\circ$). In Q-III only tangent is positive, so $\\sin 200^\\circ$ is <strong>negative</strong>.<br><br>(b) $310^\\circ$ sits in quadrant IV ($270^\\circ < 310^\\circ < 360^\\circ$). In Q-IV cosine is positive, so $\\cos 310^\\circ$ is <strong>positive</strong>.<br><br>(c) $135^\\circ$ sits in quadrant II. In Q-II only sine is positive, so $\\tan 135^\\circ$ is <strong>negative</strong>.</div></div>`

/* ============================================================
   SECTION 8: Complementary Angles
   ============================================================ */
+ `<h2 class="lesson-title">8. Complementary Angles</h2>`

+ `<div class="calc-highlight"><strong>Two acute angles are complementary if they add to $90^\\circ$.</strong> In any right triangle the two acute angles are automatically complementary, since the three angles total $180^\\circ$ and one of them is the right angle. This forces a beautiful symmetry between the six ratios.</div>`

+ `<p class="l-text">Look back at the 3-4-5 triangle. The angle $\\theta$ at the bottom-left has $\\sin\\theta = 3/5$ and $\\cos\\theta = 4/5$. The angle $\\varphi$ at the top has $\\sin\\varphi = 4/5$ and $\\cos\\varphi = 3/5$. Because $\\theta + \\varphi = 90^\\circ$, the sine of one is the cosine of the other, and vice versa. This is general:</p>`

+ `<div class="calc-formula"><div class="formula-label">COMPLEMENTARY-ANGLE IDENTITIES</div><div class="formula-main">$$\\sin(90^\\circ - \\theta) = \\cos\\theta \\qquad \\cos(90^\\circ - \\theta) = \\sin\\theta$$</div><div class="formula-sub">The "co-" in cosine, cotangent, cosecant literally stands for "complement of": $\\cos\\theta$ is the sine of the complementary angle.</div></div>`

+ `<p class="l-text">The same swap works for the other pairs:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\tan(90^\\circ - \\theta) = \\cot\\theta \\qquad \\cot(90^\\circ - \\theta) = \\tan\\theta$$</div><div class="formula-main">$$\\sec(90^\\circ - \\theta) = \\csc\\theta \\qquad \\csc(90^\\circ - \\theta) = \\sec\\theta$$</div></div>`

+ `<p class="l-text"><strong>Why this is true (right-triangle proof).</strong> Take a right triangle with acute angles $\\theta$ and $90^\\circ - \\theta$. The side opposite $\\theta$ is adjacent to $90^\\circ - \\theta$, and vice versa. So $\\sin\\theta = \\text{opp}_\\theta / \\text{hyp} = \\text{adj}_{90 - \\theta} / \\text{hyp} = \\cos(90^\\circ - \\theta)$. Geometric inevitability.</p>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE (USING THE IDENTITY)</div><div class="example-body"><strong>Without a calculator, compute $\\sin 60^\\circ$ given that $\\cos 30^\\circ = \\sqrt{3}/2$.</strong><br><br>$60^\\circ$ and $30^\\circ$ are complementary ($60 + 30 = 90$). So<br>$\\sin 60^\\circ = \\sin(90^\\circ - 30^\\circ) = \\cos 30^\\circ = \\dfrac{\\sqrt{3}}{2}$.<br><br>Similarly $\\cos 60^\\circ = \\sin 30^\\circ = 1/2$. This is why the angles $30^\\circ, 45^\\circ, 60^\\circ$ come in such tidy paired values — they are linked by the complementary-angle identity.</div></div>`

+ `<div class="l-note"><strong>Special angles to memorise.</strong> The values $\\sin 30^\\circ = 1/2$, $\\sin 45^\\circ = \\sqrt{2}/2$, $\\sin 60^\\circ = \\sqrt{3}/2$ and their cosine complements are used in countless exercises. Memorise them or derive them from the 30-60-90 and 45-45-90 reference triangles you saw in Lesson 1.</div>`

+ `<p class="l-text"><strong>The reference table.</strong> Combining everything from this lesson, the most-used values fit into one small table. Memorise the first three rows (the acute angles); the rest follow from the unit-circle picture and ASTC signs.</p>`

+ `<div class="calc-formula">`
+ `<div class="formula-label">EXACT VALUES AT THE SPECIAL ANGLES</div>`
+ `<div class="formula-main">$$\\begin{array}{c|cccc} \\theta & 0^\\circ & 30^\\circ & 45^\\circ & 60^\\circ \\\\ \\hline \\sin\\theta & 0 & 1/2 & \\sqrt{2}/2 & \\sqrt{3}/2 \\\\ \\cos\\theta & 1 & \\sqrt{3}/2 & \\sqrt{2}/2 & 1/2 \\\\ \\tan\\theta & 0 & \\sqrt{3}/3 & 1 & \\sqrt{3} \\end{array}$$</div>`
+ `<div class="formula-sub">Read off the values you need. Notice how $\\sin$ rises from 0 to $\\sqrt{3}/2$ as the angle grows, while $\\cos$ falls in the opposite direction — they swap exactly at $45^\\circ$ where both equal $\\sqrt{2}/2$.</div>`
+ `</div>`

+ `<p class="l-text"><strong>A simple memory trick.</strong> Write the sequence $0, 1, 2, 3, 4$ underneath the angles $0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$. Take square roots and divide each by 2: you get $0, 1/2, \\sqrt{2}/2, \\sqrt{3}/2, 1$ — the sine values. Read the same sequence in reverse and you get cosine. This is one of those "looks like a coincidence, isn't really" patterns trigonometers love.</p>`

/* ============================================================
   SECTION 9: Classical Exercises
   ============================================================ */
+ `<h2 class="lesson-title">9. Classical Exercises</h2>`

+ `<p class="l-text">Six hand-worked problems combining everything from the lesson. Try each yourself first, then check the solution.</p>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 1 — RATIOS FROM SIDE LENGTHS</div><div class="example-body"><strong>In a right triangle the legs (the sides that meet at the right angle) have lengths 5 and 12. Find $\\sin\\theta$, $\\cos\\theta$, $\\tan\\theta$ where $\\theta$ is the angle opposite the leg of length 5.</strong><br><br><em>Solution.</em> First find the hypotenuse using the Pythagorean theorem: $c = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$.<br><br>The opposite side is 5, the adjacent side is 12, the hypotenuse is 13. So<br>$\\sin\\theta = 5/13$,&nbsp;&nbsp;$\\cos\\theta = 12/13$,&nbsp;&nbsp;$\\tan\\theta = 5/12$.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 2 — USE THE PYTHAGOREAN IDENTITY</div><div class="example-body"><strong>Given $\\cos\\theta = -3/5$ with $\\theta$ in quadrant III, find $\\sin\\theta$ and $\\tan\\theta$.</strong><br><br><em>Solution.</em> From the fundamental identity, $\\sin^2\\theta = 1 - \\cos^2\\theta = 1 - 9/25 = 16/25$, so $\\sin\\theta = \\pm 4/5$.<br><br>In quadrant III sine is negative (ASTC), so $\\sin\\theta = -4/5$.<br><br>Then $\\tan\\theta = \\sin\\theta / \\cos\\theta = (-4/5)/(-3/5) = 4/3$. (And in Q-III tangent is positive — consistent.)</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 3 — UNKNOWN SIDE</div><div class="example-body"><strong>In a right triangle one acute angle is $25^\\circ$ and the hypotenuse is 10 cm. Find the lengths of the other two sides.</strong><br><br><em>Solution.</em> The side opposite $25^\\circ$ is $10 \\sin 25^\\circ$. Using $\\sin 25^\\circ \\approx 0.4226$:<br>$\\text{opp} \\approx 10 \\cdot 0.4226 \\approx 4.23$ cm.<br><br>The adjacent side is $10 \\cos 25^\\circ$. Using $\\cos 25^\\circ \\approx 0.9063$:<br>$\\text{adj} \\approx 10 \\cdot 0.9063 \\approx 9.06$ cm.<br><br>Sanity check (Pythagoras): $4.23^2 + 9.06^2 \\approx 17.89 + 82.08 \\approx 99.97 \\approx 100 = 10^2$. Excellent.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 4 — UNKNOWN ANGLE</div><div class="example-body"><strong>A ramp 8 m long rises a vertical height of 2 m. What angle does the ramp make with the horizontal ground?</strong><br><br><em>Solution.</em> The "rise" of 2 m is opposite the unknown angle, and the ramp length of 8 m is the hypotenuse. Use sine:<br>$\\sin\\theta = 2/8 = 0.25$.<br><br>Take the inverse sine: $\\theta = \\sin^{-1}(0.25) \\approx 14.48^\\circ$. So the ramp makes an angle of about <strong>14.5°</strong> with the ground.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 5 — PROVE AN IDENTITY</div><div class="example-body"><strong>Prove the identity $\\dfrac{1 - \\cos^2\\theta}{\\sin\\theta} = \\sin\\theta$ wherever $\\sin\\theta \\neq 0$.</strong><br><br><em>Solution.</em> Use the Pythagorean identity to rewrite the numerator: $1 - \\cos^2\\theta = \\sin^2\\theta$. So<br>$\\dfrac{1 - \\cos^2\\theta}{\\sin\\theta} = \\dfrac{\\sin^2\\theta}{\\sin\\theta} = \\sin\\theta$, valid where $\\sin\\theta \\neq 0$. QED.</div></div>`

+ `<div class="calc-example"><div class="example-label">EXERCISE 6 — COMPLEMENTARY ANGLE USE</div><div class="example-body"><strong>Simplify the expression $\\sin 50^\\circ \\cos 40^\\circ + \\cos 50^\\circ \\sin 40^\\circ$ without using a calculator. (Hint: $50^\\circ$ and $40^\\circ$ are complementary.)</strong><br><br><em>Solution.</em> Because $50^\\circ + 40^\\circ = 90^\\circ$, the complementary-angle identities give us $\\cos 40^\\circ = \\sin 50^\\circ$ and $\\sin 40^\\circ = \\cos 50^\\circ$. Substituting:<br>$\\sin 50^\\circ \\cos 40^\\circ + \\cos 50^\\circ \\sin 40^\\circ = \\sin 50^\\circ \\cdot \\sin 50^\\circ + \\cos 50^\\circ \\cdot \\cos 50^\\circ = \\sin^2 50^\\circ + \\cos^2 50^\\circ = 1$.<br><br>The expression evaluates to <strong>1</strong>.<br><br><em>(This is also a special case of the sine-of-a-sum identity $\\sin(A+B) = \\sin A \\cos B + \\cos A \\sin B$, which you will meet in a later lesson: it says the expression equals $\\sin(50^\\circ + 40^\\circ) = \\sin 90^\\circ = 1$. Same answer, two different routes.)</em></div></div>`

+ `<div class="l-warn"><strong>Looking ahead.</strong> In the next lesson we will see how the six ratios behave as $\\theta$ <em>varies</em> — that is, the graphs of $\\sin x$, $\\cos x$, $\\tan x$ and their reciprocals. Properties like periodicity, amplitude, and asymptotes emerge naturally from the unit-circle picture we built here.</div>`

/* ============================================================
   TURKISH VERSION
   ============================================================ */
,tr: `<p class="l-text"><strong>Trigonometrik oranlar, açılar ile kenar uzunlukları arasındaki köprüdür.</strong> Ders 1'de açıları derece ve radyan ile ölçmeyi, bunları birim çember üzerine yerleştirmeyi öğrenmiştiniz. Bu derste her açının <em>altı sayısal orana</em> nasıl yol açtığını göreceksiniz: sinüs, kosinüs, tanjant, kotanjant, sekant ve kosekant. Bu altı sayı, açının tüm geometrik bilgisini taşır.</p>`

+ `<p class="l-text">Oranları iki eşdeğer biçimde tanımlayacağız: önce dik üçgen kullanarak (ortaokulda kısaca gördüğünüz klasik SOH-CAH-TOA yaklaşımı), sonra birim çember kullanarak (modern tanım — her açı için geçerli: pozitif, negatif veya 360 dereceden büyük). İki tanımın neden uyuştuğunu, altı oranın nasıl ilişkilendirildiğini ve bunları pratik dik üçgen problemlerinde nasıl kullanacağımızı göreceğiz.</p>`

+ `<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">`
+ `<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>`
+ `<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">`
+ `<li>SOH-CAH-TOA kuralı ile dik üçgende sin, cos, tan oranlarını tanımlamayı</li>`
+ `<li>sin ve cos'u birim çember üzerindeki bir noktanın koordinatları olarak yeniden ifade etmeyi (her açı için geçerli)</li>`
+ `<li>cot, sec, csc karşıt oranlarını tanımlamayı ve bunları sin ile cos'a bağlamayı</li>`
+ `<li>$\\sin^2\\theta + \\cos^2\\theta = 1$ Pisagor özdeşliğini ve iki kuzenini ispatlayıp kullanmayı</li>`
+ `<li>Dört bölgenin her birinde altı oranın işaretlerini belirlemeyi (ASTC kuralı)</li>`
+ `<li>$\\sin(90^\\circ - \\theta) = \\cos\\theta$ tamamlayıcı açı özdeşlikleriyle oranlar arasında geçiş yapmayı</li>`
+ `</ul>`
+ `</div>`

/* ============================================================
   BOLUM 1: Dik Ucgende Oranlar
   ============================================================ */
+ `<h2 class="lesson-title">1. Dik Üçgende Oranlar</h2>`

+ `<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Bir duvara dayalı merdiven, yerle bir açı yapar. Bu açıyı ve merdiven uzunluğunu biliyorsak; merdivenin ne kadar yükseğe çıktığını ve ayağının duvardan ne kadar uzakta durduğunu, bu mesafeleri doğrudan ölçmeden hesaplayabiliriz. İşte trigonometrik oranlar bunu yapmamıza olanak verir.</div>`

+ `<p class="l-text">Bir akut açısı $\\theta$ olan bir dik üçgen düşünün. O açının köşesinde durup karşıya baktığınızda üç kenarın üç farklı rolü vardır:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card">`
+ `<div class="card-title">Hipotenüs</div>`
+ `<div class="card-body">En uzun kenar; her zaman dik açının karşısındadır. Çoğu kitapta $c$ ile gösterilir. Hipotenüs $\\theta$ açısına yalnızca bir uçta dokunur.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Karşı kenar</div>`
+ `<div class="card-body">$\\theta$ açısının tam karşısındaki kenar. $\\theta$ köşesinde dururken <em>dokunmadığınız</em> kenardır. Genellikle $a$ ile gösterilir.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Komşu kenar</div>`
+ `<div class="card-body">$\\theta$ açısına <em>değen</em> kenar (hipotenüs olmayan). Genellikle $b$ ile gösterilir.</div>`
+ `</div>`
+ `</div>`

+ `<p class="l-text">Üç temel trigonometrik oran bu kenarların bölümleri olarak tanımlanır. Klasik kural <strong>SOH-CAH-TOA</strong>'dır:</p>`

+ `<div class="calc-formula"><div class="formula-label">TEMEL TRIGONOMETRIK ORANLAR (DIK UCGEN)</div><div class="formula-main">$$\\sin\\theta = \\frac{\\text{karsi}}{\\text{hipotenus}} = \\frac{a}{c} \\qquad \\cos\\theta = \\frac{\\text{komsu}}{\\text{hipotenus}} = \\frac{b}{c} \\qquad \\tan\\theta = \\frac{\\text{karsi}}{\\text{komsu}} = \\frac{a}{b}$$</div><div class="formula-sub">SOH = Sine (sin) = Opp (karşı) / Hyp (hipotenüs). CAH = Cosine (cos) = Adj (komşu) / Hyp. TOA = Tangent (tan) = Opp / Adj.</div></div>`

+ `<p class="l-text"><strong>Bu oranlar niye böyle tanımlanır?</strong> Çünkü oranlar yalnızca açıya bağlıdır; üçgenin büyüklüğüne değil. Aynı $\\theta$ açısına sahip iki üçgen benzerdir (açıları eşittir), dolayısıyla karşılıklı kenarlar aynı oranlardadır. Üçgeniniz 3-4-5 de olsa 6-8-10 da olsa, uzunluğu 3 (veya 6) olan kenarın karşısındaki açı $\\sin\\theta = 3/5 = 6/10 = 0.6$ verir. Oran, yalnız başına açıya ait bir özelliktir.</p>`

/* --- Plotly: dik üçgen TR --- */
+ `<div id="plot-righttri-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var tri={x:[0,4,0,0],y:[0,0,3,0],mode:"lines+markers",name:"ucgen",line:{color:"#3b82f6",width:3},marker:{size:8,color:"#3b82f6"},fill:"toself",fillcolor:"rgba(59,130,246,0.08)",showlegend:false};`
+ `var rt={x:[0,0.35,0.35],y:[0.35,0.35,0],mode:"lines",line:{color:"#ebe6dc",width:1.5},showlegend:false};`
+ `var ann=[{x:2,y:-0.35,text:"komsu (b = 4)",showarrow:false,font:{color:"#ebe6dc",size:13}},{x:2.4,y:1.5,text:"hipotenus (c = 5)",showarrow:false,font:{color:"#f87171",size:13}},{x:-0.55,y:1.5,text:"karsi (a = 3)",showarrow:false,textangle:-90,font:{color:"#4ecdc4",size:13}},{x:0.85,y:0.18,text:"θ",showarrow:false,font:{color:"#3b82f6",size:18}}];`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-1.2,4.8],scaleanchor:"y",title:""},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.8,3.6],title:""},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:false};`
+ `Plotly.newPlot("plot-righttri-tr",[tri,rt],layout,{responsive:true,displayModeBar:false});`
+ `},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu şekil neyi gösteriyor:</strong> Orijinde $\\theta$ akut açısı bulunan 3-4-5 dik üçgeni. $\\theta$'nın karşı kenarı 3, komşu kenarı 4, hipotenüs 5. SOH-CAH-TOA'dan: $\\sin\\theta = 3/5 = 0.6$, $\\cos\\theta = 4/5 = 0.8$, $\\tan\\theta = 3/4 = 0.75$.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (3-4-5 UCGENI)</div><div class="example-body"><strong>Yukarıdaki üçgen için $\\theta$ açısının sin, cos ve tan değerlerini hesaplayınız.</strong><br><br>Karşı kenar 3, komşu kenar 4, hipotenüs 5'tir.<br><br>$\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}} = \\dfrac{3}{5} = 0.6$<br>$\\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}} = \\dfrac{4}{5} = 0.8$<br>$\\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}} = \\dfrac{3}{4} = 0.75$<br><br>Hesap makinesinde sinüsü 0.6 olan açı yaklaşık $\\theta \\approx 36.87^\\circ$ olarak çıkar.</div></div>`

+ `<div class="think-box"><div class="think-label">DUSUN BAKALIM</div><div class="think-body">Aynı 3-4-5 üçgeninde <em>diğer</em> akut açıyı (yukarıdaki köşedeki $\\varphi$ açısı) işaretleseydik, karşı ve komşu rolleri yer değiştirirdi: uzunluğu 4 olan kenar karşı, uzunluğu 3 olan kenar komşu olurdu. O hâlde $\\sin\\varphi = 4/5$, $\\cos\\varphi = 3/5$. Dikkat: $\\sin\\varphi = \\cos\\theta$. Bu bir tesadüf değildir — Bölüm 8'de göreceğiniz tamamlayıcı açı özdeşliğidir.</div></div>`

/* ============================================================
   BOLUM 2: Birim Cember Tanimi
   ============================================================ */
+ `<h2 class="lesson-title">2. Tanım: Birim Çember</h2>`

+ `<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Dik üçgen tanımı yalnız akut açılar ($0^\\circ < \\theta < 90^\\circ$) için işler. Ama $150^\\circ$, $-30^\\circ$ veya $720^\\circ$ açılarının sinüs ve kosinüsünü almamız gerekebilir. Birim çember bunu çözer: her açı, ne kadar büyük ya da negatif olursa olsun, çember üzerindeki tek bir noktaya karşılık gelir ve o noktanın koordinatları kosinüs ile sinüsü verir.</div>`

+ `<p class="l-text">Yarıçapı 1 olup orijinde merkezlenen <strong>birim çemberi</strong> çizin. Pozitif $x$ ekseninden başlayarak saat ibresinin tersi yönde $\\theta$ açısı kadar dönün. Çember üzerinde tek bir $P$ noktasına ulaşırsınız. Bu noktanın koordinatlarını $(x, y)$ olarak adlandıralım.</p>`

+ `<div class="calc-formula"><div class="formula-label">BIRIM CEMBER TANIMI</div><div class="formula-main">$$\\cos\\theta = x, \\qquad \\sin\\theta = y, \\qquad \\tan\\theta = \\frac{y}{x} \\;\\; (x \\neq 0)$$</div><div class="formula-sub">Birim cember uzerinde theta acisindaki nokta P = (cos theta, sin theta).</div></div>`

+ `<p class="l-text"><strong>Dik üçgen tanımıyla niçin uyuşur.</strong> $P = (x, y)$ noktasından $x$ eksenine dik bir doğru indirin. Şimdi hipotenüsü 1 (yarıçap), karşı kenarı $y$ ve komşu kenarı $x$ olan bir dik üçgeniniz var. SOH-CAH-TOA'yı uyguladığınızda: $\\sin\\theta = y/1 = y$ ve $\\cos\\theta = x/1 = x$. Aynı sonuç.</p>`

+ `<p class="l-text">Fakat birim çember tanımı $\\theta$ açısı $(0^\\circ, 90^\\circ)$ aralığının dışında olduğunda da işlemeye devam eder. $\\theta = 150^\\circ$ için $P$ noktası ikinci bölgede $x < 0$, $y > 0$ ile yer alır; dolayısıyla $\\cos 150^\\circ < 0$ ve $\\sin 150^\\circ > 0$'dır. $\\theta = -30^\\circ$ için ise saat yönünde döneriz ve dördüncü bölgeye ineriz.</p>`

/* --- Plotly: birim çember TR --- */
+ `<div id="plot-unitcircle-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var th=[];var cx=[];var cy=[];for(var i=0;i<=360;i++){var r=i*Math.PI/180;th.push(r);cx.push(Math.cos(r));cy.push(Math.sin(r));}`
+ `var circle={x:cx,y:cy,mode:"lines",name:"birim cember",line:{color:"#3b82f6",width:2.5}};`
+ `var ang=50*Math.PI/180;var px=Math.cos(ang);var py=Math.sin(ang);`
+ `var radius={x:[0,px],y:[0,py],mode:"lines+markers",name:"yaricap (uzunluk 1)",line:{color:"#f87171",width:2},marker:{size:[0,9],color:"#f87171"}};`
+ `var dropX={x:[px,px],y:[0,py],mode:"lines",name:"sin θ = y",line:{color:"#4ecdc4",width:2.5,dash:"dash"}};`
+ `var dropY={x:[0,px],y:[0,0],mode:"lines",name:"cos θ = x",line:{color:"#facc15",width:2.5,dash:"dash"}};`
+ `var ann=[{x:px+0.12,y:py+0.06,text:"P=(cos θ, sin θ)",showarrow:false,font:{color:"#f87171",size:12}},{x:0.18,y:0.07,text:"θ",showarrow:false,font:{color:"#3b82f6",size:16}}];`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.4,1.4],scaleanchor:"y",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.4,1.4],title:"y"},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};`
+ `Plotly.newPlot("plot-unitcircle-tr",[circle,radius,dropX,dropY],layout,{responsive:true,displayModeBar:false});`
+ `},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu şekil neyi gösteriyor:</strong> Birim çember (mavi). $\\theta = 50^\\circ$ açısındaki $P$ noktasına bir yarıçap çizilmiş. $(0,0)$'dan $(x,0)$'a giden yatay sarı parça $\\cos\\theta$ uzunluğundadır. $(x,0)$'dan $(x,y)$'ye giden dikey turkuaz parça $\\sin\\theta$ uzunluğundadır. $\\theta$ değiştikçe $P$ çember boyunca kayar; koordinatları $\\cos$ ve $\\sin$ değerlerini izler.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (DORT OZEL ACI)</div><div class="example-body"><strong>Birim çemberi kullanarak $0^\\circ$, $90^\\circ$, $180^\\circ$, $270^\\circ$ için cos ve sin değerlerini okuyunuz.</strong><br><br>$0^\\circ$'de: $P = (1, 0)$, dolayısıyla $\\cos 0^\\circ = 1$, $\\sin 0^\\circ = 0$.<br>$90^\\circ$'de: $P = (0, 1)$, dolayısıyla $\\cos 90^\\circ = 0$, $\\sin 90^\\circ = 1$.<br>$180^\\circ$'de: $P = (-1, 0)$, dolayısıyla $\\cos 180^\\circ = -1$, $\\sin 180^\\circ = 0$.<br>$270^\\circ$'de: $P = (0, -1)$, dolayısıyla $\\cos 270^\\circ = 0$, $\\sin 270^\\circ = -1$.<br><br>Bunlar "eksen açıları"dır. Tabloyu ezberlemekten çok resmi gözünüze yerleştirin.</div></div>`

+ `<div class="l-note"><strong>Etkileşimli gösterim (opsiyonel).</strong> <code>geogebra.org/m/unit-circle</code> gibi bir GeoGebra ekranı açın veya $\\theta$ için bir slider ile kendiniz kurun. Slider'ı sürükledikçe $P$ noktasının çember etrafında nasıl döndüğünü ve yatay ile dikey izdüşümlerinin nasıl küçülüp büyüdüğünü izleyin. Birim çember tanımını içselleştirmenin en iyi yolu budur.</div>`

/* ============================================================
   BOLUM 3: Diger Uc Oran
   ============================================================ */
+ `<h2 class="lesson-title">3. Diğer 3 Trigonometrik Oran</h2>`

+ `<p class="l-text">Sinüs, kosinüs ve tanjant dışında üç trigonometrik oran daha vardır. Her biri ilk üçten birinin karşılığı (çarpımsal tersi)'dır.</p>`

+ `<div class="calc-formula"><div class="formula-label">KARSILIK ORANLARI</div><div class="formula-main">$$\\cot\\theta = \\frac{1}{\\tan\\theta} = \\frac{\\cos\\theta}{\\sin\\theta} \\qquad \\sec\\theta = \\frac{1}{\\cos\\theta} \\qquad \\csc\\theta = \\frac{1}{\\sin\\theta}$$</div><div class="formula-sub">Kotanjant = tanjantın karşılığı. Sekant = kosinüsün karşılığı. Kosekant = sinüsün karşılığı.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card">`
+ `<div class="card-title">Kotanjant (cot)</div>`
+ `<div class="card-body">$\\cot\\theta = \\cos\\theta / \\sin\\theta$. $\\sin\\theta = 0$ olduğu yerlerde tanımsız, yani $\\theta = 0^\\circ, 180^\\circ, 360^\\circ, \\dots$ değerlerinde. Dik üçgende: $\\cot\\theta = \\text{komsu} / \\text{karsi}$.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Sekant (sec)</div>`
+ `<div class="card-body">$\\sec\\theta = 1 / \\cos\\theta$. $\\cos\\theta = 0$ olduğu yerlerde tanımsız, yani $\\theta = 90^\\circ, 270^\\circ, \\dots$'de. Dik üçgende: $\\sec\\theta = \\text{hipotenus} / \\text{komsu}$.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Kosekant (csc)</div>`
+ `<div class="card-body">$\\csc\\theta = 1 / \\sin\\theta$. $\\sin\\theta = 0$ olduğu yerlerde tanımsız. Dik üçgende: $\\csc\\theta = \\text{hipotenus} / \\text{karsi}$.</div>`
+ `</div>`
+ `</div>`

+ `<p class="l-text"><strong>İsimlendirmedeki mantık.</strong> "Ko-" öneki (kosinüs, kotanjant, kosekant) "tamamlayıcısı" anlamına gelir. Her "ko-" oran, <em>tamamlayıcı</em> açının (yani $\\theta$ ile toplandığında $90^\\circ$ yapan açının) sıradan oranına eşittir. Örneğin $\\cos\\theta = \\sin(90^\\circ - \\theta)$. Bölüm 8'de buraya geri döneceğiz.</p>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (ALTI ORANIN HEPSI)</div><div class="example-body"><strong>3-4-5 üçgeni için, karşı kenarı 3 olan $\\theta$ açısının altı oranını hesaplayınız.</strong><br><br>Bölüm 1'den $\\sin\\theta = 3/5$, $\\cos\\theta = 4/5$, $\\tan\\theta = 3/4$ idi.<br><br>Karşılıkları:<br>$\\csc\\theta = 5/3 \\approx 1.667$<br>$\\sec\\theta = 5/4 = 1.25$<br>$\\cot\\theta = 4/3 \\approx 1.333$<br><br>Kontrol: $\\tan\\theta \\cdot \\cot\\theta = (3/4)(4/3) = 1$. Tamam.</div></div>`

+ `<div class="l-warn"><strong>Notasyon tuzağı.</strong> Birçok hesap makinesinde $\\sin^{-1}$, $\\cos^{-1}$, $\\tan^{-1}$ tuşları bulunur — bunlar <em>ters</em> fonksiyonlardır (bir oran alır ve bir açı verir), <em>karşılık</em> $1/\\sin$ <em>değildir</em>. Yani $\\sin^{-1}(0.5) = 30^\\circ$ olur ama $1/\\sin(30^\\circ) = \\csc(30^\\circ) = 2$'dir. Dikkat: iki işlem birbirinden tamamen farklıdır.</div>`

/* ============================================================
   BOLUM 4: Geometrik Iliskiler
   ============================================================ */
+ `<h2 class="lesson-title">4. Trigonometrik Oranların Geometrik İlişkileri</h2>`

+ `<p class="l-text">Birim çember üzerinde üç "ana" oran zarif bir geometrik okumaya sahiptir. Akut bir $\\theta$ açısı için:</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card">`
+ `<div class="card-title">Kosinüs = yatay izdüşüm</div>`
+ `<div class="card-body">$\\cos\\theta$, $P$ noktasının $x$-koordinatıdır: yarıçapın $x$ ekseni üzerine izdüşümünün işaretli uzunluğu.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Sinüs = dikey izdüşüm</div>`
+ `<div class="card-body">$\\sin\\theta$, $P$ noktasının $y$-koordinatıdır: yarıçapın $y$ ekseni üzerine izdüşümünün işaretli uzunluğu.</div>`
+ `</div>`
+ `<div class="calc-card">`
+ `<div class="card-title">Tanjant = teğet doğru üzerindeki uzunluk</div>`
+ `<div class="card-body">Yarıçapı uzatın, $x = 1$ dikey doğrusuyla kesişene kadar. Kesişimin işaretli $y$-koordinatı $\\tan\\theta$'dır. (Fonksiyonun adı bundan dolayı <em>tanjant</em>'tır: çembere teğet doğru üzerinde yaşar.)</div>`
+ `</div>`
+ `</div>`

+ `<p class="l-text"><strong>Tanjant $x = 1$ dikey teğet doğrusu üzerinden niçin okunur.</strong> $P = (\\cos\\theta, \\sin\\theta)$ noktasından geçen yarıçapın eğimi $\\sin\\theta / \\cos\\theta = \\tan\\theta$'dır. Yarıçapı $x = 1$'e kadar uzatmak her iki koordinatı $1/\\cos\\theta$ ile çarpar; $y$ koordinatı $\\sin\\theta / \\cos\\theta = \\tan\\theta$ olur. Demek ki o kesişimin $y$-koordinatı tam olarak açının tanjantıdır.</p>`

+ `<p class="l-text"><strong>Sekant ve kosekant.</strong> Orijinden $P$'den geçip $x=1$ dikey teğeti kesen sekant doğrusunun orijinden kesişime kadarki uzunluğu $\\sec\\theta$'dır ($\\theta$ akut olduğunda). <em>Sekant</em> ("kesen" doğru) adı buradan gelir. Benzer biçimde $\\csc\\theta$, $y = 1$ yatay teğeti tarafından kesilen sekanta karşılık gelir.</p>`

+ `<div class="think-box"><div class="think-label">YARARLI BIR GORSEL ALISKANLIK</div><div class="think-body">Problemde her $\\sin\\theta$ veya $\\cos\\theta$ gördüğünüzde, zihinden $\\theta$ açısında birim çember yarıçapını ve onun $y$- veya $x$-izdüşümünü canlandırın. Cevabın işareti (artı/eksi) ve büyüklüğü (0'a mı yakın, 1'e mi yakın) bir bakışta görünür. Bu numara sınav sorularında çok zaman kazandırır.</div></div>`

/* ============================================================
   BOLUM 5: Pisagor Ozdesliklerii
   ============================================================ */
+ `<h2 class="lesson-title">5. Pisagor Özdeşlikleri</h2>`

+ `<div class="calc-highlight"><strong>Trigonometrideki en önemli özdeşlik.</strong> $P = (\\cos\\theta, \\sin\\theta)$ noktası, denklemi $x^2 + y^2 = 1$ olan birim çember üzerinde yaşar. $x = \\cos\\theta$ ve $y = \\sin\\theta$ koymak aşağıdaki ünlü özdeşliği verir — <em>her</em> $\\theta$ açısı için doğrudur: ne kadar büyük, küçük ya da negatif olursa olsun.</div>`

+ `<div class="calc-formula"><div class="formula-label">TEMEL PISAGOR OZDESLIGI</div><div class="formula-main">$$\\sin^2\\theta + \\cos^2\\theta = 1$$</div><div class="formula-sub">$\\sin^2\\theta$ ifadesini $(\\sin\\theta)^2$ olarak okuyun — sinüsün karesi, karenin sinüsü değil.</div></div>`

+ `<p class="l-text"><strong>İki kuzen özdeşlik.</strong> $\\sin^2\\theta + \\cos^2\\theta = 1$'in iki tarafını $\\cos^2\\theta$'ya bölelim ($\\cos\\theta \\neq 0$ olduğu sürece):</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\frac{\\sin^2\\theta}{\\cos^2\\theta} + 1 = \\frac{1}{\\cos^2\\theta} \\;\\;\\Longrightarrow\\;\\; \\tan^2\\theta + 1 = \\sec^2\\theta$$</div></div>`

+ `<p class="l-text">Aynı özdeşliği $\\sin^2\\theta$'ya bölmek ($\\sin\\theta \\neq 0$) üçüncü üyeyi verir:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$1 + \\cot^2\\theta = \\csc^2\\theta$$</div><div class="formula-sub">Üç Pisagor özdeşliği. Birlikte ele alındığında herhangi bir trigonometrik oranı (işaret farkıyla) bir diğeri cinsinden ifade etmeye yararlar.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (sin VERILINCE cos)</div><div class="example-body"><strong>$\\sin\\theta = 0.6$ ve $\\theta$ akut bir açı verilsin. $\\cos\\theta$ ve $\\tan\\theta$'yı bulunuz.</strong><br><br>Pisagor özdeşliğini kullanın: $\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - 0.36 = 0.64$.<br><br>Pozitif karekökü alın (akut açı, dolayısıyla $\\cos\\theta > 0$): $\\cos\\theta = 0.8$.<br><br>Sonra $\\tan\\theta = \\sin\\theta / \\cos\\theta = 0.6 / 0.8 = 0.75$.<br><br>Bunun tam olarak Bölüm 1'deki 3-4-5 üçgeni olduğunu fark edin — tek bir veri ile tüm oranları yeniden elde ettik.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (OZDESLIK ILE ISPAT)</div><div class="example-body"><strong>$\\sec^2\\theta - \\tan^2\\theta = 1$ özdeşliğini ispatlayınız.</strong><br><br><em>Yol 1.</em> Doğrudan kuzen özdeşlikten: $\\tan^2\\theta + 1 = \\sec^2\\theta$ yeniden düzenlenerek $\\sec^2\\theta - \\tan^2\\theta = 1$ elde edilir. Bitti.<br><br><em>Yol 2 (sıfırdan).</em> Her iki tarafı sin ve cos'a çevirin:<br>$\\sec^2\\theta - \\tan^2\\theta = \\dfrac{1}{\\cos^2\\theta} - \\dfrac{\\sin^2\\theta}{\\cos^2\\theta} = \\dfrac{1 - \\sin^2\\theta}{\\cos^2\\theta} = \\dfrac{\\cos^2\\theta}{\\cos^2\\theta} = 1$. Sondan bir önceki adımda temel özdeşliği kullandık.</div></div>`

/* ============================================================
   BOLUM 6: Dik Ucgen Uygulamalari
   ============================================================ */
+ `<h2 class="lesson-title">6. Dik Üçgen Uygulamaları</h2>`

+ `<p class="l-text">Pratik problemlerde genellikle bir açı (dik açı dışında) ile bir kenar verilir; diğer iki kenarı bulmamız istenir. Strateji her zaman aynıdır:</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step">`
+ `<div class="step-num">1</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Üçgeni etiketle</div>`
+ `<div class="step-detail">Hipotenüsü, verilen açının karşı kenarını ve komşu kenarını belirle.</div>`
+ `</div>`
+ `</div>`
+ `<div class="calc-step">`
+ `<div class="step-num">2</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Doğru oranı seç</div>`
+ `<div class="step-detail"><em>Bildiğin</em> kenarı <em>istediğin</em> kenarla bağlayan oranı seç. Örneğin karşı + hipotenüs $\\to$ sinüs. Komşu + karşı $\\to$ tanjant.</div>`
+ `</div>`
+ `</div>`
+ `<div class="calc-step">`
+ `<div class="step-num">3</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Denklemi kur</div>`
+ `<div class="step-detail">$\\sin\\theta = \\text{opp}/\\text{hyp}$ (veya benzeri) yaz; bilinen değerleri yerine koy. Cebirsel olarak çöz.</div>`
+ `</div>`
+ `</div>`
+ `<div class="calc-step">`
+ `<div class="step-num">4</div>`
+ `<div class="step-content">`
+ `<div class="step-title">Hesap makinesi ile değerlendir</div>`
+ `<div class="step-detail">Açı derece cinsinden ise derece modunda, radyan cinsinden ise radyan modunda çalıştır.</div>`
+ `</div>`
+ `</div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK 1 — DUVARA DAYALI MERDIVEN</div><div class="example-body"><strong>5 m uzunluğundaki bir merdiven düz bir duvara dayanmıştır. Merdiven yerle $70^\\circ$'lik açı yapmaktadır. Merdivenin üst ucu duvarın ne kadar yükseğine ulaşır?</strong><br><br>Hipotenüs merdivenin kendisidir (uzunluk 5). "Duvardaki yükseklik" $70^\\circ$ açısının karşısındaki kenardır. Sinüsü kullan:<br>$\\sin 70^\\circ = \\dfrac{\\text{yukseklik}}{5}$, yani $\\text{yukseklik} = 5 \\sin 70^\\circ$.<br><br>$\\sin 70^\\circ \\approx 0.9397$ kullanılınca: $\\text{yukseklik} \\approx 5 \\cdot 0.9397 \\approx 4.70$ m.<br><br>Demek ki merdivenin üst ucu duvarın yaklaşık <strong>4.7 metre</strong> yukarısına ulaşır.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK 2 — BAYRAK DIREGI</div><div class="example-body"><strong>Bayrak direğinin dibinden 20 m uzaktaki bir noktadan, direğin tepesine bakış açısı $35^\\circ$'dir. Direk ne kadar yüksektir?</strong><br><br>Komşu kenar (yer boyunca) 20'dir. Yükseklik $35^\\circ$'nin karşısındadır. Tanjantı kullan:<br>$\\tan 35^\\circ = \\dfrac{\\text{yukseklik}}{20}$, yani $\\text{yukseklik} = 20 \\tan 35^\\circ$.<br><br>$\\tan 35^\\circ \\approx 0.7002$ kullanılınca: $\\text{yukseklik} \\approx 20 \\cdot 0.7002 \\approx 14.00$ m.<br><br>Bayrak direği yaklaşık <strong>14 m</strong> yüksekliktedir.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK 3 — IRMAGIN GENISLIGI</div><div class="example-body"><strong>Bir ırmağın bir kıyısında duruyorsunuz. Tam karşıda bir ağaç görüyorsunuz. Kıyı boyunca 50 m yürüyorsunuz ve ağaca bakış doğrusu artık kıyı ile $40^\\circ$ açı yapıyor. Irmak ne kadar geniştir?</strong><br><br>Irmak genişliği $40^\\circ$'nin karşısındaki kenardır. Kıyı boyunca yürüdüğünüz 50 m komşudur. Tekrar tanjantı kullan:<br>$\\tan 40^\\circ = \\dfrac{\\text{genislik}}{50}$, yani $\\text{genislik} = 50 \\tan 40^\\circ$.<br><br>$\\tan 40^\\circ \\approx 0.8391$ kullanılınca: $\\text{genislik} \\approx 50 \\cdot 0.8391 \\approx 41.95$ m. Yani ırmak yaklaşık <strong>42 m</strong> geniştir.</div></div>`

+ `<div class="l-note"><strong>Hangi oranı ne zaman kullanmalı.</strong> "Elimde ne var, ne istiyorum?" sorusunu sormayı alışkanlık edinin. Sonra SOH-CAH-TOA'dan okuyun. Eğer iki kenar elinizde ve bir açı arıyorsanız, hesap makinesinde ters fonksiyonu kullanın: $\\theta = \\sin^{-1}(\\text{opp}/\\text{hyp})$, vb.</div>`

/* ============================================================
   BOLUM 7: Dort Bolgede Isaretler (ASTC)
   ============================================================ */
+ `<h2 class="lesson-title">7. Trigonometrik Oranların İşaretleri</h2>`

+ `<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Birim çember resmi bize bir trigonometrik oranın pozitif mi negatif mi olduğunu da, açının hangi bölgeye düştüğüne bakarak hemen söyler. <strong>ASTC</strong> kuralı ("All Students Take Calculus", Türkçe karşılığı "Hep-Sin-Tan-Cos") hangi bölgede hangi oranların pozitif olduğunu özetler.</div>`

+ `<p class="l-text">Birim çemberde $\\cos\\theta$ $x$-koordinatı, $\\sin\\theta$ ise $y$-koordinatıdır. Bunların pozitif veya negatif olması bölgeye göre değişir:</p>`

+ `<div class="calc-compare"><div class="compare-col"><div class="compare-title">I. BOLGE  (0 - 90)</div><div class="compare-item">$x > 0$, $y > 0$</div><div class="compare-item"><strong>Hep</strong>si — altı oran da pozitif</div><div class="compare-item">sin +, cos +, tan +</div></div><div class="compare-col"><div class="compare-title">II. BOLGE  (90 - 180)</div><div class="compare-item">$x < 0$, $y > 0$</div><div class="compare-item">Yalnız <strong>Sin</strong>üs (ve csc) pozitif</div><div class="compare-item">sin +, cos -, tan -</div></div></div>`

+ `<div class="calc-compare"><div class="compare-col"><div class="compare-title">III. BOLGE  (180 - 270)</div><div class="compare-item">$x < 0$, $y < 0$</div><div class="compare-item">Yalnız <strong>Tan</strong>jant (ve cot) pozitif</div><div class="compare-item">sin -, cos -, tan +</div></div><div class="compare-col"><div class="compare-title">IV. BOLGE  (270 - 360)</div><div class="compare-item">$x > 0$, $y < 0$</div><div class="compare-item">Yalnız <strong>Cos</strong>inüs (ve sec) pozitif</div><div class="compare-item">sin -, cos +, tan -</div></div></div>`

+ `<div class="calc-formula"><div class="formula-label">ASTC (HEP-SIN-TAN-COS) KURALI</div><div class="formula-main">$$\\text{I: Hep} \\;\\;|\\;\\; \\text{II: Sin} \\;\\;|\\;\\; \\text{III: Tan} \\;\\;|\\;\\; \\text{IV: Cos}$$</div><div class="formula-sub">I. bölgeden başlayıp saat ibresinin tersi yönde oku: H-S-T-C. Her bölgede <em>pozitif</em> olan oranlar bunlardır. Karşılık oranları (csc, cot, sec) ana oranıyla (sin, tan, cos) aynı işareti taşır.</div></div>`

/* --- Plotly: ASTC TR --- */
+ `<div id="plot-astc-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){`
+ `var th=[];var cx=[];var cy=[];for(var i=0;i<=360;i++){var r=i*Math.PI/180;th.push(r);cx.push(Math.cos(r));cy.push(Math.sin(r));}`
+ `var circle={x:cx,y:cy,mode:"lines",name:"birim cember",line:{color:"#3b82f6",width:2.5},showlegend:false};`
+ `var ann=[{x:0.55,y:0.55,text:"I: Hep +",showarrow:false,font:{color:"#4ecdc4",size:14}},{x:-0.55,y:0.55,text:"II: Sin +",showarrow:false,font:{color:"#facc15",size:14}},{x:-0.55,y:-0.55,text:"III: Tan +",showarrow:false,font:{color:"#f87171",size:14}},{x:0.55,y:-0.55,text:"IV: Cos +",showarrow:false,font:{color:"#a78bfa",size:14}}];`
+ `var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.4)",range:[-1.4,1.4],scaleanchor:"y",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.4)",range:[-1.4,1.4],title:"y"},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:false};`
+ `Plotly.newPlot("plot-astc-tr",[circle],layout,{responsive:true,displayModeBar:false});`
+ `},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu şekil neyi gösteriyor:</strong> Koordinat düzleminin dört bölgesi ve birim çember. Her etiket, o bölgede pozitif olan trigonometrik oranı belirtir (karşılığı dışında). I. bölgede hepsi pozitif; II.'de yalnız sinüs (ve csc); III.'de yalnız tanjant (ve cot); IV.'de yalnız kosinüs (ve sec) pozitiftir.</div></div>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (BOLGEDEN ISARETE)</div><div class="example-body"><strong>Hesap makinesi kullanmadan (a) $\\sin 200^\\circ$, (b) $\\cos 310^\\circ$, (c) $\\tan 135^\\circ$ değerlerinin işaretini bulunuz.</strong><br><br>(a) $200^\\circ$ III. bölgededir ($180^\\circ < 200^\\circ < 270^\\circ$). III. bölgede yalnız tanjant pozitiftir; o hâlde $\\sin 200^\\circ$ <strong>negatif</strong>tir.<br><br>(b) $310^\\circ$ IV. bölgededir. IV.'de kosinüs pozitiftir; o hâlde $\\cos 310^\\circ$ <strong>pozitif</strong>tir.<br><br>(c) $135^\\circ$ II. bölgededir. II.'de yalnız sinüs pozitiftir; o hâlde $\\tan 135^\\circ$ <strong>negatif</strong>tir.</div></div>`

/* ============================================================
   BOLUM 8: Tamamlayici Acilar
   ============================================================ */
+ `<h2 class="lesson-title">8. Tamamlayıcı Açılar</h2>`

+ `<div class="calc-highlight"><strong>İki akut açı toplandığında $90^\\circ$ veriyorsa tamamlayıcıdır.</strong> Her dik üçgende iki akut açı otomatik olarak tamamlayıcıdır; çünkü üç açının toplamı $180^\\circ$ ve bunlardan biri dik açıdır. Bu durum altı oran arasında güzel bir simetriye yol açar.</div>`

+ `<p class="l-text">3-4-5 üçgenine geri dönün. Sol-alttaki $\\theta$ açısı için $\\sin\\theta = 3/5$ ve $\\cos\\theta = 4/5$. Üstteki $\\varphi$ açısı için ise $\\sin\\varphi = 4/5$ ve $\\cos\\varphi = 3/5$. $\\theta + \\varphi = 90^\\circ$ olduğu için birinin sinüsü diğerinin kosinüsüne, tersi de doğru, eşittir. Bu genel bir kuraldır:</p>`

+ `<div class="calc-formula"><div class="formula-label">TAMAMLAYICI ACI OZDESLIKLERI</div><div class="formula-main">$$\\sin(90^\\circ - \\theta) = \\cos\\theta \\qquad \\cos(90^\\circ - \\theta) = \\sin\\theta$$</div><div class="formula-sub">Kosinüs, kotanjant, kosekant'taki "ko-" öneki gerçekten "tamamlayıcısı" demektir: $\\cos\\theta$, tamamlayıcı açının sinüsüdür.</div></div>`

+ `<p class="l-text">Aynı değişim diğer çiftler için de işler:</p>`

+ `<div class="calc-formula"><div class="formula-main">$$\\tan(90^\\circ - \\theta) = \\cot\\theta \\qquad \\cot(90^\\circ - \\theta) = \\tan\\theta$$</div><div class="formula-main">$$\\sec(90^\\circ - \\theta) = \\csc\\theta \\qquad \\csc(90^\\circ - \\theta) = \\sec\\theta$$</div></div>`

+ `<p class="l-text"><strong>Niye böyle (dik üçgen ispatı).</strong> Akut açıları $\\theta$ ve $90^\\circ - \\theta$ olan bir dik üçgen alın. $\\theta$'nın karşı kenarı $90^\\circ - \\theta$'nın komşusudur, tersi de doğru. O hâlde $\\sin\\theta = \\text{opp}_\\theta / \\text{hyp} = \\text{adj}_{90 - \\theta} / \\text{hyp} = \\cos(90^\\circ - \\theta)$. Geometrik bir zorunluluk.</p>`

+ `<div class="calc-example"><div class="example-label">COZULMUS ORNEK (OZDESLIGI KULLANMAK)</div><div class="example-body"><strong>$\\cos 30^\\circ = \\sqrt{3}/2$ verildiğine göre, hesap makinesi kullanmadan $\\sin 60^\\circ$ değerini bulunuz.</strong><br><br>$60^\\circ$ ile $30^\\circ$ tamamlayıcıdır ($60 + 30 = 90$). O hâlde<br>$\\sin 60^\\circ = \\sin(90^\\circ - 30^\\circ) = \\cos 30^\\circ = \\dfrac{\\sqrt{3}}{2}$.<br><br>Benzer biçimde $\\cos 60^\\circ = \\sin 30^\\circ = 1/2$. $30^\\circ, 45^\\circ, 60^\\circ$ açılarının böyle düzgün eşli değerlerle gelmesinin nedeni budur — onlar tamamlayıcı açı özdeşliği ile bağlıdır.</div></div>`

+ `<div class="l-note"><strong>Ezberlenmesi gereken özel açılar.</strong> $\\sin 30^\\circ = 1/2$, $\\sin 45^\\circ = \\sqrt{2}/2$, $\\sin 60^\\circ = \\sqrt{3}/2$ ve bunların kosinüs eşleri sayısız soruda kullanılır. Bunları ya ezberleyin ya da Ders 1'de gördüğünüz 30-60-90 ve 45-45-90 referans üçgenlerinden türetin.</div>`

+ `<p class="l-text"><strong>Referans tablosu.</strong> Bu dersteki her şeyi birleştirince en çok kullanılan değerler küçük bir tabloya sığar. İlk üç satırı (akut açıları) ezberleyin; geri kalan değerler birim çember resmi ve ASTC işaretlerinden çıkar.</p>`

+ `<div class="calc-formula">`
+ `<div class="formula-label">OZEL ACILARDA KESIN DEGERLER</div>`
+ `<div class="formula-main">$$\\begin{array}{c|cccc} \\theta & 0^\\circ & 30^\\circ & 45^\\circ & 60^\\circ \\\\ \\hline \\sin\\theta & 0 & 1/2 & \\sqrt{2}/2 & \\sqrt{3}/2 \\\\ \\cos\\theta & 1 & \\sqrt{3}/2 & \\sqrt{2}/2 & 1/2 \\\\ \\tan\\theta & 0 & \\sqrt{3}/3 & 1 & \\sqrt{3} \\end{array}$$</div>`
+ `<div class="formula-sub">İhtiyacınız olan değerleri buradan okuyun. Açı büyüdükçe $\\sin$'in 0'dan $\\sqrt{3}/2$'ye yükseldiğine, $\\cos$'un ise ters yönde düştüğüne dikkat edin — ikisi tam $45^\\circ$'de ve $\\sqrt{2}/2$ değerinde kesişir.</div>`
+ `</div>`

+ `<p class="l-text"><strong>Basit bir hatırlama hilesi.</strong> $0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$ açılarının altına $0, 1, 2, 3, 4$ dizisini yazın. Her birinin karekökünü alıp 2'ye bölün: $0, 1/2, \\sqrt{2}/2, \\sqrt{3}/2, 1$ — sinüs değerleri. Aynı diziyi tersten okursanız kosinüsü elde edersiniz. Trigonometricilerin sevdiği "rastlantı sanılan ama aslında rastlantı olmayan" örüntülerden biridir.</p>`

/* ============================================================
   BOLUM 9: Klasik Alistirmalar
   ============================================================ */
+ `<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>`

+ `<p class="l-text">Dersin tümünü birleştiren altı el ile çözülmüş problem. Önce kendiniz deneyin, sonra çözümü kontrol edin.</p>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 1 — KENARLARDAN ORANLAR</div><div class="example-body"><strong>Bir dik üçgenin iki dik kenarının uzunlukları 5 ve 12'dir. Karşı kenarı 5 olan $\\theta$ açısının $\\sin\\theta$, $\\cos\\theta$, $\\tan\\theta$ değerlerini bulunuz.</strong><br><br><em>Çözüm.</em> Önce hipotenüsü Pisagor teoremiyle bul: $c = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$.<br><br>Karşı 5, komşu 12, hipotenüs 13. O hâlde<br>$\\sin\\theta = 5/13$,&nbsp;&nbsp;$\\cos\\theta = 12/13$,&nbsp;&nbsp;$\\tan\\theta = 5/12$.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 2 — PISAGOR OZDESLIGINI KULLAN</div><div class="example-body"><strong>$\\cos\\theta = -3/5$ ve $\\theta$ III. bölgede olduğuna göre $\\sin\\theta$ ile $\\tan\\theta$'yı bulunuz.</strong><br><br><em>Çözüm.</em> Temel özdeşlikten $\\sin^2\\theta = 1 - \\cos^2\\theta = 1 - 9/25 = 16/25$, dolayısıyla $\\sin\\theta = \\pm 4/5$.<br><br>III. bölgede sinüs negatiftir (ASTC), o hâlde $\\sin\\theta = -4/5$.<br><br>Sonra $\\tan\\theta = \\sin\\theta / \\cos\\theta = (-4/5)/(-3/5) = 4/3$. (Ve III.'de tanjant pozitiftir — tutarlı.)</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 3 — BILINMEYEN KENAR</div><div class="example-body"><strong>Bir dik üçgende akut açılardan biri $25^\\circ$ ve hipotenüs 10 cm'dir. Diğer iki kenarın uzunluklarını bulunuz.</strong><br><br><em>Çözüm.</em> $25^\\circ$'nin karşı kenarı $10 \\sin 25^\\circ$'dir. $\\sin 25^\\circ \\approx 0.4226$ ile:<br>$\\text{opp} \\approx 10 \\cdot 0.4226 \\approx 4.23$ cm.<br><br>Komşu kenar $10 \\cos 25^\\circ$'dir. $\\cos 25^\\circ \\approx 0.9063$ ile:<br>$\\text{adj} \\approx 10 \\cdot 0.9063 \\approx 9.06$ cm.<br><br>Kontrol (Pisagor): $4.23^2 + 9.06^2 \\approx 17.89 + 82.08 \\approx 99.97 \\approx 100 = 10^2$. Mükemmel.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 4 — BILINMEYEN ACI</div><div class="example-body"><strong>8 m uzunluğundaki bir rampa 2 m'lik bir yükseklik kazandırıyor. Rampa yatay zeminle hangi açıyı yapar?</strong><br><br><em>Çözüm.</em> 2 m'lik "yükselme" bilinmeyen açının karşısındadır; 8 m'lik rampa hipotenüstür. Sinüsü kullan:<br>$\\sin\\theta = 2/8 = 0.25$.<br><br>Ters sinüsü al: $\\theta = \\sin^{-1}(0.25) \\approx 14.48^\\circ$. Rampa yer ile yaklaşık <strong>14.5°</strong>'lik açı yapar.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 5 — OZDESLIK ISPATI</div><div class="example-body"><strong>$\\sin\\theta \\neq 0$ olduğu her yerde $\\dfrac{1 - \\cos^2\\theta}{\\sin\\theta} = \\sin\\theta$ özdeşliğini ispatlayınız.</strong><br><br><em>Çözüm.</em> Pisagor özdeşliğini kullanarak payı yeniden yazın: $1 - \\cos^2\\theta = \\sin^2\\theta$. O hâlde<br>$\\dfrac{1 - \\cos^2\\theta}{\\sin\\theta} = \\dfrac{\\sin^2\\theta}{\\sin\\theta} = \\sin\\theta$, $\\sin\\theta \\neq 0$ olduğu sürece geçerli. İspat tamam.</div></div>`

+ `<div class="calc-example"><div class="example-label">ALISTIRMA 6 — TAMAMLAYICI ACI KULLANIMI</div><div class="example-body"><strong>Hesap makinesi kullanmadan $\\sin 50^\\circ \\cos 40^\\circ + \\cos 50^\\circ \\sin 40^\\circ$ ifadesini sadeleştiriniz. (İpucu: $50^\\circ$ ve $40^\\circ$ tamamlayıcıdır.)</strong><br><br><em>Çözüm.</em> $50^\\circ + 40^\\circ = 90^\\circ$ olduğu için tamamlayıcı açı özdeşlikleri $\\cos 40^\\circ = \\sin 50^\\circ$ ve $\\sin 40^\\circ = \\cos 50^\\circ$ verir. Yerine koyalım:<br>$\\sin 50^\\circ \\cos 40^\\circ + \\cos 50^\\circ \\sin 40^\\circ = \\sin 50^\\circ \\cdot \\sin 50^\\circ + \\cos 50^\\circ \\cdot \\cos 50^\\circ = \\sin^2 50^\\circ + \\cos^2 50^\\circ = 1$.<br><br>İfade <strong>1</strong>'e eşittir.<br><br><em>(Bu aynı zamanda ileride göreceğiniz toplam-sinüs özdeşliği $\\sin(A+B) = \\sin A \\cos B + \\cos A \\sin B$'nin özel hâlidir: ifadeyi $\\sin(50^\\circ + 40^\\circ) = \\sin 90^\\circ = 1$ olarak verir. Aynı cevap, iki farklı yol.)</em></div></div>`

+ `<div class="l-warn"><strong>İleri bakış.</strong> Bir sonraki derste altı oranın $\\theta$ <em>değiştiğinde</em> nasıl davrandığını göreceğiz — yani $\\sin x$, $\\cos x$, $\\tan x$ ve karşılıklarının grafikleri. Periyodiklik, genlik ve asimptot gibi özellikler buradaki birim çember resminden doğal olarak çıkacak.</div>`

};
