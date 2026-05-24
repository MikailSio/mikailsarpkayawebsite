window.LISE_MAT_L91 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A vector is the mathematical object you reach for whenever a single number is not enough.</strong> The temperature on a winter morning is a number — &minus;3 degrees — and that is the whole story. The wind on the same morning is a different kind of beast: 25 km/h <em>from the north-west</em>. The speed alone (25 km/h) does not tell you which way to lean as you walk; you need a direction. Quantities with both a size and a direction are everywhere in physics, geometry, and engineering, and the tool that handles them is the <em>vector</em>.</p>

<p class="l-text">In this lesson we build vectors from scratch using arrows in the plane, then translate the geometric picture into pairs of numbers (vₓ, vᵧ) so that we can compute. By the end you should be able to add vectors graphically with the head-to-tail rule, multiply them by scalars, and combine two vectors using the dot product to read off both their angle and their length.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a vector as a directed segment with magnitude and direction; write components $\\vec{v} = (v_x, v_y)$</li>
<li>Compute the magnitude $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$ and the unit vector $\\hat{v} = \\vec{v}/|\\vec{v}|$</li>
<li>Add vectors using the head-to-tail rule and the parallelogram law; multiply a vector by a scalar</li>
<li>Compute the dot product $\\vec{v} \\cdot \\vec{w} = v_x w_x + v_y w_y$ and use it to read off the angle between two vectors</li>
<li>Identify perpendicular vectors by the test $\\vec{v} \\cdot \\vec{w} = 0$ and read the signed area of a parallelogram via the 2D cross product</li>
<li>Apply vectors to model forces, displacements, and work in real problems</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Vector?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine walking 3 metres east, then 4 metres north. Where do you end up? Not 7 metres from where you started — you end up 5 metres from the starting point, in a north-easterly direction. The displacement that took you there is a single vector with magnitude 5 and a definite direction. That arrow, not the bare number 7, is what mathematics calls a <em>vector</em>.</div>

<p class="l-text">A <strong>vector</strong> is a directed segment: it has a tail (where it starts) and a head (where it ends, drawn with an arrow). Two pieces of information define it completely — its <em>magnitude</em> (how long the arrow is) and its <em>direction</em> (where the arrow points). The location of the tail does not matter: a vector that goes 2 to the right and 1 up is the same vector whether you draw it from the origin, from (5, 5), or from anywhere else. Only the displacement counts.</p>

<div class="calc-formula"><div class="formula-label">VECTOR &mdash; INFORMAL DEFINITION</div><div class="formula-main">$$\\vec{v} \\;=\\; (\\text{magnitude},\\, \\text{direction})$$</div><div class="formula-sub">The arrow notation $\\vec{v}$ is universal. Some textbooks write the same thing in bold (v) or with a bar on top. We will stick with the arrow.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scalar</div><div class="card-body">A pure number with no direction. Examples: mass (5 kg), temperature (20 deg C), price (10 lira). Written without an arrow: $m$, $T$, $p$.</div></div>
<div class="calc-card"><div class="card-title">Vector</div><div class="card-body">A directed segment carrying both size and direction. Examples: velocity (10 m/s north), force (3 N downward), displacement (5 m to the door).</div></div>
<div class="calc-card"><div class="card-title">Zero vector</div><div class="card-body">$\\vec{0} = (0, 0)$. The only vector with no direction — its head and tail are the same point.</div></div>
</div>

<h2 class="lesson-title">2. Components and Notation</h2>

<div class="calc-highlight"><strong>Drop the arrow into the coordinate plane and the geometry becomes arithmetic.</strong> Place the tail at the origin and read off where the head lands. The pair of coordinates is the <em>component representation</em> of the vector — the form we will use for every calculation from now on.</div>

<div class="calc-formula"><div class="formula-label">COMPONENT FORM</div><div class="formula-main">$$\\vec{v} \\;=\\; (v_x,\\, v_y) \\quad\\text{in 2D}, \\qquad \\vec{v} \\;=\\; (v_x,\\, v_y,\\, v_z) \\quad\\text{in 3D}$$</div><div class="formula-sub">$v_x$ is the horizontal component (how far the arrow goes right), $v_y$ is the vertical component (how far up). In 3D we add a third component $v_z$ for depth.</div></div>

<p class="l-text"><strong>Reading components from an arrow.</strong> Given a vector drawn from point $A = (a_x, a_y)$ to point $B = (b_x, b_y)$, the components are simply the differences:</p>

<div class="calc-formula"><div class="formula-label">VECTOR FROM TWO POINTS</div><div class="formula-main">$$\\overrightarrow{AB} \\;=\\; (b_x - a_x,\\; b_y - a_y)$$</div><div class="formula-sub">Tail subtracted from head. The order matters: $\\overrightarrow{AB} = -\\overrightarrow{BA}$, so reversing the arrow flips every component sign.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">The arrow from $A = (1, 2)$ to $B = (4, 6)$ has components<br><br>$\\overrightarrow{AB} = (4 - 1,\\, 6 - 2) = (3,\\, 4)$.<br><br>Tail at $A$, head at $B$. If we translate the same arrow so its tail sits at the origin, the head lands at $(3, 4)$. The two pictures represent the <em>same</em> vector.</div></div>

<h2 class="lesson-title">3. Magnitude: How Long Is the Arrow?</h2>

<div class="calc-highlight"><strong>The magnitude of a vector is the length of its arrow.</strong> Find it with the Pythagorean theorem: square each component, add, take the square root. In 2D the components $v_x$ and $v_y$ are the two legs of a right triangle; the vector itself is the hypotenuse.</div>

<div class="calc-formula"><div class="formula-label">MAGNITUDE (2D)</div><div class="formula-main">$$|\\vec{v}| \\;=\\; \\sqrt{v_x^2 + v_y^2}$$</div><div class="formula-sub">The vertical bars mean "magnitude of". In 3D the formula extends to $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the magnitude of $\\vec{v} = (3, 4)$.<br><br>$|\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = \\mathbf{5}$.<br><br>This is the famous 3-4-5 right triangle. The vector that goes 3 right and 4 up has length exactly 5.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Find the magnitude of $\\vec{u} = (-6, 8)$.<br><br>$|\\vec{u}| = \\sqrt{(-6)^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$.<br><br>Magnitude is always non-negative — squaring kills the sign. A vector pointing left is just as long as the same vector pointing right.</div></div>

<div class="l-note"><strong>Magnitude vs. component.</strong> Be careful not to confuse the magnitude $|\\vec{v}|$ (a positive number) with the components $v_x$, $v_y$ (signed numbers). $\\vec{v} = (-3, -4)$ has components both negative but magnitude $|\\vec{v}| = 5 > 0$.</div>

<h2 class="lesson-title">4. Unit Vectors and the Standard Basis</h2>

<div class="calc-highlight"><strong>A unit vector is a vector of length exactly 1.</strong> Every non-zero vector $\\vec{v}$ has a unique unit vector pointing the same way: divide $\\vec{v}$ by its magnitude. This is the standard trick for "extracting the direction" of a vector while throwing away its size.</div>

<div class="calc-formula"><div class="formula-label">UNIT VECTOR IN THE DIRECTION OF $\\vec{v}$</div><div class="formula-main">$$\\hat{v} \\;=\\; \\frac{\\vec{v}}{|\\vec{v}|} \\;=\\; \\left(\\frac{v_x}{|\\vec{v}|},\\; \\frac{v_y}{|\\vec{v}|}\\right)$$</div><div class="formula-sub">The hat $\\hat{v}$ (read "v-hat") tells the reader that this vector has length 1. By construction $|\\hat{v}| = 1$ always.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the unit vector in the direction of $\\vec{v} = (3, 4)$.<br><br>From the previous section $|\\vec{v}| = 5$. Hence<br><br>$\\hat{v} = \\dfrac{(3, 4)}{5} = \\left(\\dfrac{3}{5},\\, \\dfrac{4}{5}\\right) = (0.6,\\, 0.8)$.<br><br>Check: $\\sqrt{0.6^2 + 0.8^2} = \\sqrt{0.36 + 0.64} = \\sqrt{1} = 1$. Length one, same direction as $\\vec{v}$.</div></div>

<p class="l-text"><strong>The standard basis.</strong> Two unit vectors are so important that they get their own names. In 2D:</p>

<div class="calc-formula"><div class="formula-label">STANDARD BASIS VECTORS</div><div class="formula-main">$$\\vec{i} \\;=\\; (1, 0), \\qquad \\vec{j} \\;=\\; (0, 1)$$</div><div class="formula-sub">$\\vec{i}$ is the unit vector along the positive x-axis; $\\vec{j}$ is the unit vector along the positive y-axis. In 3D we add $\\vec{k} = (0, 0, 1)$.</div></div>

<p class="l-text">Every vector can be written as a combination of $\\vec{i}$ and $\\vec{j}$:</p>

<div class="calc-formula"><div class="formula-label">BASIS DECOMPOSITION</div><div class="formula-main">$$\\vec{v} \\;=\\; v_x \\, \\vec{i} \\;+\\; v_y \\, \\vec{j}$$</div><div class="formula-sub">Same information as $(v_x, v_y)$. The basis notation makes algebra cleaner when you mix vectors and scalars in physics formulas.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Write $\\vec{v} = (3, -2)$ in $\\vec{i}, \\vec{j}$ notation.<br><br>$\\vec{v} = 3\\vec{i} - 2\\vec{j}$.<br><br>Two forms, identical meaning.</div></div>

<h2 class="lesson-title">5. Addition: Head-to-Tail and Parallelogram</h2>

<div class="calc-highlight"><strong>To add two vectors graphically, slide the tail of the second onto the head of the first. The sum is the arrow from the original tail to the final head.</strong> This is the <em>head-to-tail rule</em>, and it captures the physical intuition perfectly: walk from A to B, then from B to C, and the net displacement is from A to C.</div>

<p class="l-text">The same operation in components is even simpler — add coordinate by coordinate:</p>

<div class="calc-formula"><div class="formula-label">VECTOR ADDITION</div><div class="formula-main">$$\\vec{v} + \\vec{w} \\;=\\; (v_x + w_x,\\; v_y + w_y)$$</div><div class="formula-sub">Both pieces match: the geometric sum (head-to-tail) and the algebraic sum (component-wise) give the same vector.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Head-to-tail</div><div class="card-body">Slide $\\vec{w}$ so its tail sits on the head of $\\vec{v}$. The sum $\\vec{v} + \\vec{w}$ is the arrow from $\\vec{v}$'s tail to $\\vec{w}$'s head.</div></div>
<div class="calc-card"><div class="card-title">Parallelogram</div><div class="card-body">Place both vectors at the same tail point. They form two sides of a parallelogram; the sum is the diagonal from the shared tail.</div></div>
<div class="calc-card"><div class="card-title">Commutative</div><div class="card-body">$\\vec{v} + \\vec{w} = \\vec{w} + \\vec{v}$. The order does not matter — the parallelogram picture makes this obvious.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Add $\\vec{v} = (2, 1)$ and $\\vec{w} = (1, 3)$.<br><br>$\\vec{v} + \\vec{w} = (2 + 1,\\; 1 + 3) = \\mathbf{(3, 4)}$.<br><br>Magnitude of the sum: $|\\vec{v} + \\vec{w}| = \\sqrt{9 + 16} = 5$. Notice $|\\vec{v}| + |\\vec{w}| = \\sqrt{5} + \\sqrt{10} \\approx 5.40$, which is larger than $|\\vec{v} + \\vec{w}|$. In general magnitudes do not add — only equal-direction vectors do.</div></div>

<div class="calc-graph"><div id="plot-l91-add-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the head-to-tail addition of $\\vec{v} = (2, 1)$ (blue) and $\\vec{w} = (1, 3)$ (green) drawn from the origin. The sum $\\vec{v} + \\vec{w} = (3, 4)$ (orange) is the diagonal of the parallelogram and also the closing arrow of the two-step walk.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var vArr={x:[0,2],y:[0,1],mode:'lines+markers',name:'v = (2,1)',line:{color:'#3b82f6',width:3.4},marker:{color:'#3b82f6',size:[6,10]}};
var wAtV={x:[2,3],y:[1,4],mode:'lines+markers',name:'w slid onto v',line:{color:'#10b981',width:3.4,dash:'dot'},marker:{color:'#10b981',size:[6,10]}};
var sumArr={x:[0,3],y:[0,4],mode:'lines+markers',name:'v + w = (3,4)',line:{color:'#f59e0b',width:3.6},marker:{color:'#f59e0b',size:[6,12]}};
var wOrig={x:[0,1],y:[0,3],mode:'lines+markers',name:'w = (1,3)',line:{color:'#10b981',width:2.2,dash:'dash'},marker:{color:'#10b981',size:[6,8]}};
var paraSide={x:[2,3,1,0],y:[1,4,3,0],mode:'lines',name:'parallelogram',line:{color:'rgba(245,158,11,0.25)',width:1.6}};
var labelsEN={x:[1.0,2.4,1.5,0.4],y:[0.35,2.4,3.4,1.6],mode:'text',name:'labels',text:['v','w','v+w','w (at O)'],textfont:{color:['#3b82f6','#10b981','#f59e0b','rgba(16,185,129,0.8)'],size:13},showlegend:false};
var layEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.5,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-add-en',[paraSide,wOrig,vArr,wAtV,sumArr,labelsEN],layEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Subtraction.</strong> The difference $\\vec{v} - \\vec{w}$ is just $\\vec{v} + (-\\vec{w})$: flip $\\vec{w}$ (which negates every component) and add. In coordinates $\\vec{v} - \\vec{w} = (v_x - w_x, v_y - w_y)$. Geometrically it is the arrow that goes from the head of $\\vec{w}$ to the head of $\\vec{v}$.</div>

<h2 class="lesson-title">6. Scalar Multiplication</h2>

<div class="calc-highlight"><strong>Multiplying a vector by a number stretches or shrinks it without changing its direction (unless the number is negative, in which case the direction flips).</strong> If you double a force, the new force points the same way but is twice as long.</div>

<div class="calc-formula"><div class="formula-label">SCALAR MULTIPLICATION</div><div class="formula-main">$$k \\cdot \\vec{v} \\;=\\; (k \\, v_x,\\; k \\, v_y)$$</div><div class="formula-sub">$k$ is any real number. The new magnitude is $|k \\vec{v}| = |k| \\cdot |\\vec{v}|$. The direction is the same as $\\vec{v}$ if $k > 0$, opposite if $k < 0$, and undefined if $k = 0$ (the result is the zero vector).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$k > 1$</div><div class="card-body">Stretches the vector (makes it longer) in the same direction.</div></div>
<div class="calc-card"><div class="card-title">$0 < k < 1$</div><div class="card-body">Shrinks the vector (makes it shorter) in the same direction.</div></div>
<div class="calc-card"><div class="card-title">$k < 0$</div><div class="card-body">Flips the vector to point the opposite way, and scales by $|k|$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">If $\\vec{v} = (2, -3)$, compute $3\\vec{v}$ and $-\\tfrac{1}{2}\\vec{v}$.<br><br>$3\\vec{v} = (6, -9)$ — three times as long, same direction.<br><br>$-\\tfrac{1}{2}\\vec{v} = (-1, 1.5)$ — half as long, flipped direction.</div></div>

<h2 class="lesson-title">7. The Dot Product</h2>

<div class="calc-highlight"><strong>The dot product is a way of multiplying two vectors that returns a single number (a scalar).</strong> It is the most useful operation on vectors after addition: it tells you the angle between them, whether they are perpendicular, and how much of one vector "projects onto" the other. Two lines, one number.</div>

<div class="calc-formula"><div class="formula-label">DOT PRODUCT &mdash; ALGEBRAIC FORMULA</div><div class="formula-main">$$\\vec{v} \\cdot \\vec{w} \\;=\\; v_x w_x \\;+\\; v_y w_y$$</div><div class="formula-sub">Multiply matching components, then add. The result is a real number, not a vector.</div></div>

<p class="l-text">The dot product also has a beautiful geometric face. If $\\theta$ is the angle between $\\vec{v}$ and $\\vec{w}$ when their tails are placed at the same point, then:</p>

<div class="calc-formula"><div class="formula-label">DOT PRODUCT &mdash; GEOMETRIC FORMULA</div><div class="formula-main">$$\\vec{v} \\cdot \\vec{w} \\;=\\; |\\vec{v}| \\, |\\vec{w}| \\, \\cos\\theta$$</div><div class="formula-sub">Two equivalent formulas, one operation. Setting them equal gives the standard way to compute the angle between two vectors.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Compute the dot product of $\\vec{v} = (1, 2)$ and $\\vec{w} = (3, 4)$.<br><br>$\\vec{v} \\cdot \\vec{w} = 1 \\cdot 3 + 2 \\cdot 4 = 3 + 8 = \\mathbf{11}$.<br><br>Positive, so the two vectors point into the same half-plane (the angle between them is less than 90 degrees).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute the dot product of $\\vec{a} = (4, -1)$ and $\\vec{b} = (-2, 3)$.<br><br>$\\vec{a} \\cdot \\vec{b} = 4 \\cdot (-2) + (-1) \\cdot 3 = -8 - 3 = \\mathbf{-11}$.<br><br>Negative, so the angle is more than 90 degrees — the vectors point into opposite half-planes.</div></div>

<h2 class="lesson-title">8. Geometric Meaning: Projection</h2>

<div class="calc-highlight"><strong>The dot product measures how much of one vector points along the other.</strong> Geometrically, $\\vec{v} \\cdot \\vec{w}$ is the magnitude of $\\vec{w}$ multiplied by the signed length of the shadow that $\\vec{v}$ casts on $\\vec{w}$ (or vice-versa).</div>

<p class="l-text">Imagine the sun directly above the line of $\\vec{w}$. The shadow that $\\vec{v}$ casts on that line is the <em>projection</em> of $\\vec{v}$ onto $\\vec{w}$. Its signed length is:</p>

<div class="calc-formula"><div class="formula-label">SCALAR PROJECTION</div><div class="formula-main">$$\\text{proj-length} \\;=\\; \\frac{\\vec{v} \\cdot \\vec{w}}{|\\vec{w}|} \\;=\\; |\\vec{v}| \\cos\\theta$$</div><div class="formula-sub">Positive if $\\vec{v}$ leans in the same direction as $\\vec{w}$, negative if it leans opposite, zero if it is perpendicular.</div></div>

<div class="calc-graph"><div id="plot-l91-proj-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the projection of $\\vec{v} = (3, 4)$ (orange) onto $\\vec{w} = (5, 0)$ (blue). The dashed line is perpendicular to $\\vec{w}$ and drops the head of $\\vec{v}$ down onto it. The shadow on $\\vec{w}$ has length 3 — exactly $\\vec{v} \\cdot \\vec{w} / |\\vec{w}| = 15/5$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var wB={x:[0,5],y:[0,0],mode:'lines+markers',name:'w = (5,0)',line:{color:'#3b82f6',width:3.4},marker:{color:'#3b82f6',size:[6,11]}};
var vB={x:[0,3],y:[0,4],mode:'lines+markers',name:'v = (3,4)',line:{color:'#f59e0b',width:3.4},marker:{color:'#f59e0b',size:[6,11]}};
var perpB={x:[3,3],y:[4,0],mode:'lines',name:'perpendicular drop',line:{color:'rgba(255,255,255,0.45)',width:1.6,dash:'dot'},showlegend:true};
var shadowB={x:[0,3],y:[0,0],mode:'lines',name:'projection (length 3)',line:{color:'#10b981',width:5}};
var labelsP={x:[2.5,1.4,3.15,1.5],y:[-0.25,2.2,2.0,0.25],mode:'text',name:'labels',text:['w','v','perp','projection'],textfont:{color:['#3b82f6','#f59e0b','rgba(255,255,255,0.6)','#10b981'],size:13},showlegend:false};
var layPE={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,5.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.8,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-proj-en',[wB,vB,shadowB,perpB,labelsP],layPE,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Perpendicular Vectors</h2>

<div class="calc-highlight"><strong>Two vectors are perpendicular if and only if their dot product is zero.</strong> This is the single most-used consequence of the dot product, because it converts "find a vector at right angles to..." into a one-line algebraic check.</div>

<div class="calc-formula"><div class="formula-label">PERPENDICULARITY TEST</div><div class="formula-main">$$\\vec{v} \\perp \\vec{w} \\;\\iff\\; \\vec{v} \\cdot \\vec{w} \\;=\\; 0$$</div><div class="formula-sub">Why? From the geometric formula, $\\cos\\theta = 0$ exactly when $\\theta = 90^\\circ$. So a zero dot product (and non-zero vectors) forces a right angle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Are $\\vec{v} = (2, 3)$ and $\\vec{w} = (3, -2)$ perpendicular?<br><br>$\\vec{v} \\cdot \\vec{w} = 2 \\cdot 3 + 3 \\cdot (-2) = 6 - 6 = \\mathbf{0}$.<br><br>Yes, perpendicular. Notice the structure: to get a vector at right angles to $(a, b)$, you can always take $(b, -a)$ or $(-b, a)$. Swap the components and flip one sign.</div></div>

<h2 class="lesson-title">10. The Angle Between Two Vectors</h2>

<div class="calc-highlight"><strong>Rearrange the geometric dot-product formula and you get the angle directly.</strong> This is the workhorse formula whenever a problem asks "what angle does one vector make with another?"</div>

<div class="calc-formula"><div class="formula-label">ANGLE BETWEEN VECTORS</div><div class="formula-main">$$\\cos\\theta \\;=\\; \\frac{\\vec{v} \\cdot \\vec{w}}{|\\vec{v}| \\, |\\vec{w}|}$$</div><div class="formula-sub">Both vectors must be non-zero. The angle $\\theta$ is taken in $[0^\\circ, 180^\\circ]$ — the "smaller" of the two angles between the two lines.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the angle between $\\vec{v} = (1, 0)$ and $\\vec{w} = (1, 1)$.<br><br>$\\vec{v} \\cdot \\vec{w} = 1 \\cdot 1 + 0 \\cdot 1 = 1$. $|\\vec{v}| = 1$, $|\\vec{w}| = \\sqrt{2}$.<br><br>$\\cos\\theta = \\dfrac{1}{1 \\cdot \\sqrt{2}} = \\dfrac{1}{\\sqrt{2}} \\implies \\theta = \\mathbf{45^\\circ}$.<br><br>Makes sense: $(1, 1)$ lies on the line $y = x$, which makes a 45-degree angle with the x-axis.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Find the angle between $\\vec{a} = (2, 0)$ and $\\vec{b} = (0, 3)$.<br><br>$\\vec{a} \\cdot \\vec{b} = 0$, so $\\cos\\theta = 0$, meaning $\\theta = \\mathbf{90^\\circ}$.<br><br>Confirms what we already knew: the x-axis and the y-axis are perpendicular.</div></div>

<div class="l-note"><strong>A common mistake:</strong> students compute $\\vec{v} \\cdot \\vec{w}$ and forget to divide by the product of the magnitudes. The bare dot product is <em>not</em> the cosine — only the dot product <em>divided by</em> $|\\vec{v}||\\vec{w}|$ gives $\\cos\\theta$. Always carry through both magnitudes.</div>

<div class="calc-graph"><div id="plot-l91-angle-en-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the angle $\\theta$ between $\\vec{u} = (3, 1)$ (blue) and $\\vec{v} = (1, 2)$ (orange) drawn from the origin, together with the projection of $\\vec{v}$ onto $\\vec{u}$ (dashed segment). Computation: $\\vec{u} \\cdot \\vec{v} = 3 + 2 = 5$, $|\\vec{u}| = \\sqrt{10}$, $|\\vec{v}| = \\sqrt{5}$, so $\\cos\\theta = 5/\\sqrt{50} = 1/\\sqrt{2}$ and $\\theta = 45^\\circ$. The shaded wedge is the angle itself; the orange dot shows where $\\vec{v}$ projects onto the line of $\\vec{u}$ at the point $(1.5, 0.5)$, giving the geometric identity $\\vec{u} \\cdot \\vec{v} = |\\vec{u}|\\,|\\vec{v}|\\,\\cos\\theta$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var uVec={x:[0,3],y:[0,1],mode:'lines+markers',name:'u = (3,1)',line:{color:'#3b82f6',width:3.6},marker:{color:'#3b82f6',size:[6,11]}};
var vVec={x:[0,1],y:[0,2],mode:'lines+markers',name:'v = (1,2)',line:{color:'#f59e0b',width:3.6},marker:{color:'#f59e0b',size:[6,11]}};
var projDrop={x:[1,1.5],y:[2,0.5],mode:'lines',name:'perpendicular drop',line:{color:'rgba(255,255,255,0.5)',width:1.7,dash:'dot'}};
var projPt={x:[1.5],y:[0.5],mode:'markers',name:'proj_u(v) = (1.5, 0.5)',marker:{color:'#10b981',size:11,symbol:'circle',line:{color:'#0a0a0a',width:1.5}}};
var projSeg={x:[0,1.5],y:[0,0.5],mode:'lines',name:'projection on u',line:{color:'#10b981',width:5}};
var wedgeT=[];var wedgeX=[0];var wedgeY=[0];
var aU=Math.atan2(1,3);var aV=Math.atan2(2,1);var r=0.6;
for(var i=0;i<=24;i++){var a=aU+(aV-aU)*(i/24);wedgeX.push(r*Math.cos(a));wedgeY.push(r*Math.sin(a));}
wedgeX.push(0);wedgeY.push(0);
var wedge={x:wedgeX,y:wedgeY,mode:'lines',fill:'toself',name:'angle theta = 45 deg',line:{color:'rgba(59,130,246,0.55)',width:1.4},fillcolor:'rgba(59,130,246,0.18)'};
var labelsA={x:[2.45,0.7,0.95,1.8,1.55],y:[0.65,1.55,0.32,0.18,0.7],mode:'text',name:'lab',text:['u','v','theta','|u||v|cos theta','proj'],textfont:{color:['#3b82f6','#f59e0b','rgba(59,130,246,0.95)','#10b981','#10b981'],size:13},showlegend:false};
var layAE={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,3.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-angle-en-extra',[wedge,projSeg,uVec,vVec,projDrop,projPt,labelsA],layAE,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. The 2D Cross Product (Scalar)</h2>

<div class="calc-highlight"><strong>In 3D, the cross product of two vectors is itself a vector. In 2D, we use a stripped-down "scalar cross product" that returns a single signed number — the area of the parallelogram spanned by the two vectors, with a sign that records orientation.</strong></div>

<div class="calc-formula"><div class="formula-label">2D CROSS PRODUCT (SCALAR)</div><div class="formula-main">$$\\vec{v} \\times \\vec{w} \\;=\\; v_x w_y \\;-\\; v_y w_x$$</div><div class="formula-sub">Positive if $\\vec{w}$ is reached from $\\vec{v}$ by a counter-clockwise rotation (less than 180 deg). Negative if clockwise. Zero exactly when the two vectors are parallel.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute the 2D cross product of $\\vec{v} = (2, 1)$ and $\\vec{w} = (1, 3)$.<br><br>$\\vec{v} \\times \\vec{w} = 2 \\cdot 3 - 1 \\cdot 1 = 6 - 1 = \\mathbf{5}$.<br><br>So the parallelogram with sides $\\vec{v}$ and $\\vec{w}$ has area 5. The sign is positive, meaning $\\vec{w}$ sits CCW from $\\vec{v}$.</div></div>

<div class="l-note"><strong>Dot vs. cross.</strong> The dot product measures alignment (cosine, projection). The cross product measures the perpendicular component (sine, signed area). Together they unlock most of vector geometry.</div>

<h2 class="lesson-title">12. Applications</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forces on an object</div><div class="card-body">A box pulled by two ropes feels a single <em>resultant force</em> equal to the vector sum of the two rope tensions. Compute components, add, find the magnitude — done.</div></div>
<div class="calc-card"><div class="card-title">Displacement and velocity</div><div class="card-body">"Walk 3 km east then 4 km north" gives a net displacement vector $(3, 4)$ of magnitude 5 km. Velocity (m/s with direction) and acceleration (m/s squared with direction) follow the same rules.</div></div>
<div class="calc-card"><div class="card-title">Work done by a force</div><div class="card-body">If a constant force $\\vec{F}$ moves an object through a displacement $\\vec{d}$, the work done is $W = \\vec{F} \\cdot \\vec{d} = |\\vec{F}| |\\vec{d}| \\cos\\theta$. Force perpendicular to motion does <em>zero</em> work.</div></div>
</div>

<div class="calc-example"><div class="example-label">PHYSICS WORKED EXAMPLE</div><div class="example-body">A horizontal force of magnitude 10 N drags a sled 5 m to the east. Find the work done.<br><br>$\\vec{F} = (10, 0)$ N. $\\vec{d} = (5, 0)$ m. Both point east, so the angle between them is 0 deg and $\\cos 0 = 1$.<br><br>$W = \\vec{F} \\cdot \\vec{d} = 10 \\cdot 5 + 0 \\cdot 0 = \\mathbf{50 \\text{ J}}$.<br><br>If instead the force were vertical, say $\\vec{F} = (0, 10)$ N, the dot product would be zero and the work would also be zero — pushing straight up while the sled moves horizontally accomplishes nothing.</div></div>

<div style="margin:1.6rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.9rem;border:1px solid rgba(255,255,255,0.08)">
<thead><tr style="background:#3b82f6;color:#0a0a0a"><th style="padding:0.6rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.08)">Operation</th><th style="padding:0.6rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.08)">Formula (2D)</th><th style="padding:0.6rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.08)">Geometric meaning</th></tr></thead>
<tbody>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Magnitude $|\\vec{v}|$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\sqrt{v_x^2 + v_y^2}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Length of the arrow (hypotenuse of the component right triangle).</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Addition $\\vec{v} + \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$(v_x + w_x,\\; v_y + w_y)$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Head-to-tail walk or parallelogram diagonal — the net displacement.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Subtraction $\\vec{v} - \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$(v_x - w_x,\\; v_y - w_y)$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Arrow from the head of $\\vec{w}$ to the head of $\\vec{v}$ (both tails at the origin).</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Scalar multiplication $k\\vec{v}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$(k v_x,\\; k v_y)$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Stretch by $|k|$; flip direction if $k < 0$. Same line, new length.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Dot product $\\vec{v} \\cdot \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$v_x w_x + v_y w_y = |\\vec{v}||\\vec{w}|\\cos\\theta$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Alignment of two vectors. Positive = same side, zero = perpendicular, negative = opposite.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">2D cross product $\\vec{v} \\times \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$v_x w_y - v_y w_x$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Signed area of the parallelogram spanned by $\\vec{v}, \\vec{w}$ (positive = CCW orientation).</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Angle between vectors</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\cos\\theta = \\dfrac{\\vec{v} \\cdot \\vec{w}}{|\\vec{v}|\\,|\\vec{w}|}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Smaller of the two angles at the shared tail, taken in $[0^\\circ, 180^\\circ]$.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Projection $\\text{proj}_{\\vec{u}}(\\vec{v})$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}|^2}\\,\\vec{u}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">The shadow of $\\vec{v}$ on the line of $\\vec{u}$ — the part of $\\vec{v}$ along $\\vec{u}$.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Unit vector $\\hat{v}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\dfrac{\\vec{v}}{|\\vec{v}|}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Same direction as $\\vec{v}$, length exactly 1 — pure direction information.</td></tr>
</tbody></table></div>

<h2 class="lesson-title">13. A Gallery of Vectors</h2>

<div class="calc-graph"><div id="plot-l91-gallery-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three example vectors drawn from the origin — $\\vec{a} = (4, 0)$ along the positive x-axis (length 4), $\\vec{b} = (3, 4)$ with the classic 3-4-5 magnitude (length 5), and $\\vec{c} = (-2, 3)$ leaning into the second quadrant (length $\\sqrt{13} \\approx 3.6$). Reading direction and magnitude from a picture trains the geometric intuition you need.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aV={x:[0,4],y:[0,0],mode:'lines+markers',name:'a = (4,0), |a|=4',line:{color:'#3b82f6',width:3.4},marker:{color:'#3b82f6',size:[6,11]}};
var bV={x:[0,3],y:[0,4],mode:'lines+markers',name:'b = (3,4), |b|=5',line:{color:'#10b981',width:3.4},marker:{color:'#10b981',size:[6,11]}};
var cV={x:[0,-2],y:[0,3],mode:'lines+markers',name:'c = (-2,3), |c|≈3.6',line:{color:'#f59e0b',width:3.4},marker:{color:'#f59e0b',size:[6,11]}};
var labelsG={x:[3.3,1.7,-1.4],y:[-0.4,2.3,1.7],mode:'text',name:'labels',text:['a','b','c'],textfont:{color:['#3b82f6','#10b981','#f59e0b'],size:14},showlegend:false};
var layG={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,5.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.2,4.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-gallery-en',[aV,bV,cV,labelsG],layG,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">14. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WRONG</div><div class="compare-item">"$\\vec{v} \\cdot \\vec{w}$ is a vector" (it is a number)</div><div class="compare-item">"$\\vec{v} \\times \\vec{w}$ is the same as $\\vec{v} \\cdot \\vec{w}$" (totally different)</div><div class="compare-item">"$\\cos\\theta = \\vec{v} \\cdot \\vec{w}$" (forgot to divide by magnitudes)</div><div class="compare-item">"$|\\vec{v} + \\vec{w}| = |\\vec{v}| + |\\vec{w}|$" (true only if same direction)</div><div class="compare-item">"Vectors have to start at the origin" (no — only their components are fixed)</div></div><div class="compare-col"><div class="compare-title">RIGHT</div><div class="compare-item">Dot product returns a scalar (a real number)</div><div class="compare-item">Dot = alignment, cross = perpendicular area; different beasts</div><div class="compare-item">$\\cos\\theta = (\\vec{v} \\cdot \\vec{w}) / (|\\vec{v}| |\\vec{w}|)$, always</div><div class="compare-item">Triangle inequality: $|\\vec{v} + \\vec{w}| \\le |\\vec{v}| + |\\vec{w}|$</div><div class="compare-item">The location of the tail is irrelevant; the same components define the same vector anywhere</div></div></div>

<h2 class="lesson-title">15. Practice Problems</h2>

<p class="l-text">Try each problem yourself before reading the worked answer.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; MAGNITUDE</div><div class="example-body"><strong>Find $|\\vec{v}|$ for $\\vec{v} = (5, 12)$.</strong><br><br>$|\\vec{v}| = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = \\mathbf{13}$.<br><br>Another classic Pythagorean triple: 5-12-13.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; UNIT VECTOR</div><div class="example-body"><strong>Find the unit vector in the direction of $\\vec{v} = (8, -6)$.</strong><br><br>$|\\vec{v}| = \\sqrt{64 + 36} = \\sqrt{100} = 10$.<br><br>$\\hat{v} = \\dfrac{(8, -6)}{10} = \\left(\\dfrac{4}{5},\\, -\\dfrac{3}{5}\\right) = (0.8,\\, -0.6)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; SUM AND DIFFERENCE</div><div class="example-body"><strong>For $\\vec{v} = (3, -1)$ and $\\vec{w} = (-2, 4)$, find $\\vec{v} + \\vec{w}$ and $\\vec{v} - \\vec{w}$.</strong><br><br>$\\vec{v} + \\vec{w} = (3 + (-2),\\, -1 + 4) = (1,\\, 3)$.<br><br>$\\vec{v} - \\vec{w} = (3 - (-2),\\, -1 - 4) = \\mathbf{(5,\\, -5)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SCALAR MULTIPLE</div><div class="example-body"><strong>Find $-2\\vec{v} + 3\\vec{w}$ for $\\vec{v} = (1, 2)$, $\\vec{w} = (4, -1)$.</strong><br><br>$-2\\vec{v} = (-2,\\, -4)$.<br>$3\\vec{w} = (12,\\, -3)$.<br>Sum: $(-2 + 12,\\, -4 + (-3)) = \\mathbf{(10,\\, -7)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DOT PRODUCT</div><div class="example-body"><strong>Compute $\\vec{v} \\cdot \\vec{w}$ for $\\vec{v} = (6, -2)$ and $\\vec{w} = (1, 3)$.</strong><br><br>$\\vec{v} \\cdot \\vec{w} = 6 \\cdot 1 + (-2) \\cdot 3 = 6 - 6 = \\mathbf{0}$.<br><br>Zero — so $\\vec{v}$ and $\\vec{w}$ are <em>perpendicular</em>. Bonus discovery from the practice problem.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; ANGLE</div><div class="example-body"><strong>Find the angle between $\\vec{a} = (1, 1)$ and $\\vec{b} = (\\sqrt{3}, 1)$.</strong><br><br>$\\vec{a} \\cdot \\vec{b} = \\sqrt{3} + 1$. $|\\vec{a}| = \\sqrt{2}$, $|\\vec{b}| = \\sqrt{3 + 1} = 2$.<br><br>$\\cos\\theta = \\dfrac{\\sqrt{3} + 1}{2\\sqrt{2}} \\approx \\dfrac{2.732}{2.828} \\approx 0.966 \\implies \\theta \\approx \\mathbf{15^\\circ}$.<br><br>(Exact value: $\\theta = 15^\\circ$, since $\\vec{a}$ makes 45 deg with the x-axis and $\\vec{b}$ makes 30 deg, with difference 15 deg.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; PARALLELOGRAM AREA</div><div class="example-body"><strong>Find the area of the parallelogram spanned by $\\vec{v} = (3, 1)$ and $\\vec{w} = (1, 4)$.</strong><br><br>Area $= |\\vec{v} \\times \\vec{w}| = |3 \\cdot 4 - 1 \\cdot 1| = |12 - 1| = \\mathbf{11}$ square units.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; WORK</div><div class="example-body"><strong>A force $\\vec{F} = (4, 3)$ N drags an object through displacement $\\vec{d} = (2, 0)$ m. Find the work done.</strong><br><br>$W = \\vec{F} \\cdot \\vec{d} = 4 \\cdot 2 + 3 \\cdot 0 = \\mathbf{8 \\text{ J}}$.<br><br>Only the horizontal component of the force contributes — the vertical part does no work because the displacement has no vertical component.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A vector has magnitude and direction; component form $\\vec{v} = (v_x, v_y)$</li>
<li>Magnitude $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$; unit vector $\\hat{v} = \\vec{v}/|\\vec{v}|$</li>
<li>Addition: head-to-tail and parallelogram rules; in coordinates add component-wise</li>
<li>Scalar multiplication: $k\\vec{v}$ stretches/shrinks, flips if $k < 0$</li>
<li>Dot product: $\\vec{v} \\cdot \\vec{w} = v_x w_x + v_y w_y = |\\vec{v}||\\vec{w}|\\cos\\theta$</li>
<li>Perpendicular iff dot product is zero; angle from $\\cos\\theta = (\\vec{v}\\cdot\\vec{w})/(|\\vec{v}||\\vec{w}|)$</li>
<li>2D cross product $v_x w_y - v_y w_x$ gives signed parallelogram area</li>
<li>Applications: force resultants, displacement, work $W = \\vec{F} \\cdot \\vec{d}$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Vektör, tek bir sayının yetmediği her durumda başvurduğun matematiksel nesnedir.</strong> Kış sabahında sıcaklık bir sayıdır — &minus;3 derece — ve hikâye bundan ibarettir. Ama aynı sabahki rüzgâr farklı bir canavardır: 25 km/sa, <em>kuzey-batıdan</em>. Sadece hız (25 km/sa) yürürken hangi tarafa eğileceğini söylemez; bir yöne ihtiyacın var. Hem büyüklüğü hem de yönü olan nicelikler fizikte, geometride ve mühendislikte her yerdedir ve bunları işleyen araç <em>vektördür</em>.</p>

<p class="l-text">Bu derste vektörleri düzlemdeki oklardan başlayarak sıfırdan inşa edeceğiz, sonra geometrik resmi (vₓ, vᵧ) sayı çiftlerine çevirip hesap yapabilmek için cebire taşıyacağız. Dersin sonunda vektörleri grafik olarak baş-kuyruk kuralıyla toplayabilmen, skaler ile çarpabilmen ve iki vektörü nokta (skaler) çarpımla birleştirerek hem aralarındaki açıyı hem de uzunluklarını okuyabilmen gerekir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir vektörü büyüklüğü ve yönü olan yönlü bir doğru parçası olarak tanımlamayı; bileşenleri $\\vec{v} = (v_x, v_y)$ biçiminde yazmayı</li>
<li>Büyüklüğü $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$ ve birim vektörü $\\hat{v} = \\vec{v}/|\\vec{v}|$ hesaplamayı</li>
<li>Vektörleri baş-kuyruk kuralı ve paralelkenar yasasıyla toplamayı; bir vektörü bir skalerle çarpmayı</li>
<li>Nokta çarpımı $\\vec{v} \\cdot \\vec{w} = v_x w_x + v_y w_y$ ile hesaplamayı ve iki vektör arasındaki açıyı okumakta kullanmayı</li>
<li>Dik vektörleri $\\vec{v} \\cdot \\vec{w} = 0$ testiyle tanımayı ve 2B çapraz çarpımla paralelkenarın işaretli alanını bulmayı</li>
<li>Vektörleri kuvvet, yer değiştirme ve iş gibi gerçek problemlerin modellenmesinde kullanmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Vektör Nedir?</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> 3 metre doğuya, sonra 4 metre kuzeye yürüdüğünü düşün. Nerede sonlandın? Başladığın yerden 7 metre uzakta değil — sonlandığın nokta başlangıçtan 5 metre uzakta, kuzey-doğu yönündedir. Seni oraya götüren yer değiştirme tek bir vektördür: büyüklüğü 5 ve net bir yönü var. Çıplak 7 sayısı değil, o ok matematikte <em>vektör</em> dediğimiz şeydir.</div>

<p class="l-text">Bir <strong>vektör</strong> yönlü bir doğru parçasıdır: bir kuyruğu (başladığı yer) ve bir başı (bittiği yer, ok ucuyla çizilen) vardır. İki bilgi parçası onu tamamen tanımlar — <em>büyüklüğü</em> (okun uzunluğu) ve <em>yönü</em> (okun hangi tarafa baktığı). Kuyruğun konumu önemli değildir: 2 birim sağa ve 1 birim yukarı giden vektör, ister orijinden çizsen, ister (5, 5) noktasından, ister başka bir yerden, aynı vektördür. Sadece yer değiştirme sayılır.</p>

<div class="calc-formula"><div class="formula-label">VEKTÖR &mdash; GAYRİRESMİ TANIM</div><div class="formula-main">$$\\vec{v} \\;=\\; (\\text{büyüklük},\\, \\text{yön})$$</div><div class="formula-sub">$\\vec{v}$ ok gösterimi evrenseldir. Bazı kitaplar aynı şeyi kalın harfle (v) ya da üstünde bir çubukla yazar. Biz okta kalacağız.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Skaler</div><div class="card-body">Yönü olmayan saf sayı. Örnekler: kütle (5 kg), sıcaklık (20 derece C), fiyat (10 lira). Oksuz yazılır: $m$, $T$, $p$.</div></div>
<div class="calc-card"><div class="card-title">Vektör</div><div class="card-body">Hem boyut hem de yön taşıyan yönlü doğru parçası. Örnekler: hız (10 m/s kuzey), kuvvet (3 N aşağı), yer değiştirme (5 m kapıya).</div></div>
<div class="calc-card"><div class="card-title">Sıfır vektörü</div><div class="card-body">$\\vec{0} = (0, 0)$. Yönsüz tek vektör — başı ve kuyruğu aynı nokta.</div></div>
</div>

<h2 class="lesson-title">2. Bileşenler ve Gösterim</h2>

<div class="calc-highlight"><strong>Oku koordinat düzlemine yerleştirince geometri aritmetiğe dönüşür.</strong> Kuyruğu orijine koy ve başın nereye düştüğünü oku. Bu koordinat çifti vektörün <em>bileşen gösterimidir</em> — buradan sonraki tüm hesaplarda kullanacağımız form.</div>

<div class="calc-formula"><div class="formula-label">BİLEŞEN GÖSTERİMİ</div><div class="formula-main">$$\\vec{v} \\;=\\; (v_x,\\, v_y) \\quad\\text{2B'de}, \\qquad \\vec{v} \\;=\\; (v_x,\\, v_y,\\, v_z) \\quad\\text{3B'de}$$</div><div class="formula-sub">$v_x$ yatay bileşendir (ok ne kadar sağa gider), $v_y$ ise dikey bileşen (ne kadar yukarı). 3B'de derinlik için üçüncü bileşen $v_z$'yi ekleriz.</div></div>

<p class="l-text"><strong>Oktan bileşen okumak.</strong> $A = (a_x, a_y)$ noktasından $B = (b_x, b_y)$ noktasına çizilmiş bir vektörün bileşenleri farklardan ibarettir:</p>

<div class="calc-formula"><div class="formula-label">İKİ NOKTADAN VEKTÖR</div><div class="formula-main">$$\\overrightarrow{AB} \\;=\\; (b_x - a_x,\\; b_y - a_y)$$</div><div class="formula-sub">Baştan kuyruk çıkarılır. Sıra önemli: $\\overrightarrow{AB} = -\\overrightarrow{BA}$, ok yönünü tersine çevirmek tüm bileşen işaretlerini değiştirir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A = (1, 2)$'den $B = (4, 6)$'ya çizilen okun bileşenleri:<br><br>$\\overrightarrow{AB} = (4 - 1,\\, 6 - 2) = (3,\\, 4)$.<br><br>Kuyruk $A$'da, baş $B$'de. Aynı oku kuyruğu orijinde olacak şekilde ötelersek, baş $(3, 4)$'e düşer. İki resim <em>aynı</em> vektörü gösterir.</div></div>

<h2 class="lesson-title">3. Büyüklük: Ok Ne Kadar Uzun?</h2>

<div class="calc-highlight"><strong>Bir vektörün büyüklüğü okunun uzunluğudur.</strong> Pisagor teoremiyle bul: her bileşeni kareye al, topla, karekök al. 2B'de $v_x$ ve $v_y$ bileşenleri bir dik üçgenin iki dik kenarıdır; vektörün kendisi ise hipotenüs.</div>

<div class="calc-formula"><div class="formula-label">BÜYÜKLÜK (2B)</div><div class="formula-main">$$|\\vec{v}| \\;=\\; \\sqrt{v_x^2 + v_y^2}$$</div><div class="formula-sub">Dikey çubuklar "büyüklüğü" anlamına gelir. 3B'de formül $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$'ye genişler.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$\\vec{v} = (3, 4)$'ün büyüklüğünü bul.<br><br>$|\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = \\mathbf{5}$.<br><br>Bu meşhur 3-4-5 dik üçgenidir. 3 sağa, 4 yukarı giden vektörün uzunluğu tam olarak 5.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$\\vec{u} = (-6, 8)$'in büyüklüğünü bul.<br><br>$|\\vec{u}| = \\sqrt{(-6)^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = \\mathbf{10}$.<br><br>Büyüklük her zaman negatif değildir — kareye almak işareti yok eder. Sola bakan bir vektör, aynı vektörün sağa bakanı kadar uzundur.</div></div>

<div class="l-note"><strong>Büyüklük vs. bileşen.</strong> $|\\vec{v}|$ büyüklüğü (pozitif sayı) ile $v_x$, $v_y$ bileşenlerini (işaretli sayılar) karıştırma. $\\vec{v} = (-3, -4)$'ün bileşenleri ikisi de negatiftir ama büyüklüğü $|\\vec{v}| = 5 > 0$.</div>

<h2 class="lesson-title">4. Birim Vektörler ve Standart Taban</h2>

<div class="calc-highlight"><strong>Birim vektör uzunluğu tam olarak 1 olan vektördür.</strong> Sıfır olmayan her vektörün $\\vec{v}$ aynı yöne bakan tek bir birim vektörü vardır: $\\vec{v}$'yi büyüklüğüne böl. Bu, vektörün boyutunu atıp "yönünü çıkarmak" için standart numaradır.</div>

<div class="calc-formula"><div class="formula-label">$\\vec{v}$ YÖNÜNDEKİ BİRİM VEKTÖR</div><div class="formula-main">$$\\hat{v} \\;=\\; \\frac{\\vec{v}}{|\\vec{v}|} \\;=\\; \\left(\\frac{v_x}{|\\vec{v}|},\\; \\frac{v_y}{|\\vec{v}|}\\right)$$</div><div class="formula-sub">Şapka $\\hat{v}$ ("v-şapka" okunur) bu vektörün uzunluğunun 1 olduğunu söyler. İnşaa gereği daima $|\\hat{v}| = 1$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\vec{v} = (3, 4)$ yönündeki birim vektörü bul.<br><br>Önceki bölümden $|\\vec{v}| = 5$. Dolayısıyla<br><br>$\\hat{v} = \\dfrac{(3, 4)}{5} = \\left(\\dfrac{3}{5},\\, \\dfrac{4}{5}\\right) = (0.6,\\, 0.8)$.<br><br>Kontrol: $\\sqrt{0.6^2 + 0.8^2} = \\sqrt{0.36 + 0.64} = \\sqrt{1} = 1$. Uzunluk bir, $\\vec{v}$ ile aynı yön.</div></div>

<p class="l-text"><strong>Standart taban.</strong> İki birim vektör o kadar önemlidir ki kendi adlarını alır. 2B'de:</p>

<div class="calc-formula"><div class="formula-label">STANDART TABAN VEKTÖRLERİ</div><div class="formula-main">$$\\vec{i} \\;=\\; (1, 0), \\qquad \\vec{j} \\;=\\; (0, 1)$$</div><div class="formula-sub">$\\vec{i}$ pozitif x-ekseni boyunca birim vektör; $\\vec{j}$ pozitif y-ekseni boyunca birim vektör. 3B'de $\\vec{k} = (0, 0, 1)$ eklenir.</div></div>

<p class="l-text">Her vektör $\\vec{i}$ ve $\\vec{j}$ kombinasyonu olarak yazılabilir:</p>

<div class="calc-formula"><div class="formula-label">TABAN AYRIŞIMI</div><div class="formula-main">$$\\vec{v} \\;=\\; v_x \\, \\vec{i} \\;+\\; v_y \\, \\vec{j}$$</div><div class="formula-sub">$(v_x, v_y)$ ile aynı bilgi. Taban gösterimi, fizik formüllerinde vektör ve skaleri karıştırdığında cebiri temizler.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\vec{v} = (3, -2)$'yi $\\vec{i}, \\vec{j}$ gösteriminde yaz.<br><br>$\\vec{v} = 3\\vec{i} - 2\\vec{j}$.<br><br>İki form, aynı anlam.</div></div>

<h2 class="lesson-title">5. Toplama: Baş-Kuyruk ve Paralelkenar</h2>

<div class="calc-highlight"><strong>İki vektörü grafik olarak toplamak için ikincinin kuyruğunu birincinin başına kaydır. Toplam, ilk kuyruktan son başa giden oktur.</strong> Bu <em>baş-kuyruk kuralıdır</em> ve fiziksel sezgiyi mükemmel yakalar: A'dan B'ye yürü, sonra B'den C'ye, net yer değiştirme A'dan C'yedir.</div>

<p class="l-text">Aynı işlem bileşenlerle çok daha basittir — koordinat koordinat topla:</p>

<div class="calc-formula"><div class="formula-label">VEKTÖR TOPLAMA</div><div class="formula-main">$$\\vec{v} + \\vec{w} \\;=\\; (v_x + w_x,\\; v_y + w_y)$$</div><div class="formula-sub">İki parça uyuşur: geometrik toplam (baş-kuyruk) ile cebirsel toplam (bileşen bileşen) aynı vektörü verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Baş-kuyruk</div><div class="card-body">$\\vec{w}$'yi kuyruğu $\\vec{v}$'nin başında olacak şekilde kaydır. $\\vec{v} + \\vec{w}$ toplamı, $\\vec{v}$'nin kuyruğundan $\\vec{w}$'nin başına giden oktur.</div></div>
<div class="calc-card"><div class="card-title">Paralelkenar</div><div class="card-body">Her iki vektörü aynı kuyruk noktasına yerleştir. Bir paralelkenarın iki kenarını oluştururlar; toplam, ortak kuyruktan giden köşegendir.</div></div>
<div class="calc-card"><div class="card-title">Değişme</div><div class="card-body">$\\vec{v} + \\vec{w} = \\vec{w} + \\vec{v}$. Sıra önemli değil — paralelkenar resmi bunu açıkça gösterir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\vec{v} = (2, 1)$ ve $\\vec{w} = (1, 3)$'ü topla.<br><br>$\\vec{v} + \\vec{w} = (2 + 1,\\; 1 + 3) = \\mathbf{(3, 4)}$.<br><br>Toplamın büyüklüğü: $|\\vec{v} + \\vec{w}| = \\sqrt{9 + 16} = 5$. Dikkat: $|\\vec{v}| + |\\vec{w}| = \\sqrt{5} + \\sqrt{10} \\approx 5.40$, bu $|\\vec{v} + \\vec{w}|$'den büyüktür. Genel olarak büyüklükler toplanmaz — sadece aynı yöne bakan vektörlerin büyüklükleri toplanır.</div></div>

<div class="calc-graph"><div id="plot-l91-add-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\vec{v} = (2, 1)$ (mavi) ile $\\vec{w} = (1, 3)$ (yeşil) vektörlerinin orijinden başlayan baş-kuyruk toplamı. Toplam $\\vec{v} + \\vec{w} = (3, 4)$ (turuncu) hem paralelkenarın köşegeni hem de iki adımlı yürüyüşün kapanış okudur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var vAT={x:[0,2],y:[0,1],mode:'lines+markers',name:'v = (2,1)',line:{color:'#3b82f6',width:3.4},marker:{color:'#3b82f6',size:[6,10]}};
var wAtVT={x:[2,3],y:[1,4],mode:'lines+markers',name:'w (v üstüne)',line:{color:'#10b981',width:3.4,dash:'dot'},marker:{color:'#10b981',size:[6,10]}};
var sumAT={x:[0,3],y:[0,4],mode:'lines+markers',name:'v + w = (3,4)',line:{color:'#f59e0b',width:3.6},marker:{color:'#f59e0b',size:[6,12]}};
var wOT={x:[0,1],y:[0,3],mode:'lines+markers',name:'w = (1,3)',line:{color:'#10b981',width:2.2,dash:'dash'},marker:{color:'#10b981',size:[6,8]}};
var paraT={x:[2,3,1,0],y:[1,4,3,0],mode:'lines',name:'paralelkenar',line:{color:'rgba(245,158,11,0.25)',width:1.6}};
var labelsTR={x:[1.0,2.4,1.5,0.4],y:[0.35,2.4,3.4,1.6],mode:'text',name:'etiketler',text:['v','w','v+w','w (O\\'da)'],textfont:{color:['#3b82f6','#10b981','#f59e0b','rgba(16,185,129,0.8)'],size:13},showlegend:false};
var layTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.5,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-add-tr',[paraT,wOT,vAT,wAtVT,sumAT,labelsTR],layTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Çıkarma.</strong> $\\vec{v} - \\vec{w}$ farkı, $\\vec{v} + (-\\vec{w})$'dir: $\\vec{w}$'yi ters çevir (her bileşenin işaretini değiştir) ve topla. Koordinatlarda $\\vec{v} - \\vec{w} = (v_x - w_x, v_y - w_y)$. Geometrik olarak $\\vec{w}$'nin başından $\\vec{v}$'nin başına giden oktur.</div>

<h2 class="lesson-title">6. Skalerle Çarpma</h2>

<div class="calc-highlight"><strong>Bir vektörü bir sayıyla çarpmak onu yönünü değiştirmeden uzatır veya kısaltır (sayı negatifse yön ters döner).</strong> Bir kuvveti ikiye katlarsan, yeni kuvvet aynı yöne bakar ama iki kat uzundur.</div>

<div class="calc-formula"><div class="formula-label">SKALERLE ÇARPMA</div><div class="formula-main">$$k \\cdot \\vec{v} \\;=\\; (k \\, v_x,\\; k \\, v_y)$$</div><div class="formula-sub">$k$ herhangi bir gerçek sayı. Yeni büyüklük $|k \\vec{v}| = |k| \\cdot |\\vec{v}|$. Yön $k > 0$ ise $\\vec{v}$ ile aynı, $k < 0$ ise tersi, $k = 0$ ise tanımsızdır (sonuç sıfır vektörüdür).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$k > 1$</div><div class="card-body">Vektörü uzatır (daha uzun yapar), aynı yönde.</div></div>
<div class="calc-card"><div class="card-title">$0 < k < 1$</div><div class="card-body">Vektörü kısaltır (daha kısa yapar), aynı yönde.</div></div>
<div class="calc-card"><div class="card-title">$k < 0$</div><div class="card-body">Vektörü ters yöne çevirir ve $|k|$ kadar ölçekler.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\vec{v} = (2, -3)$ ise, $3\\vec{v}$ ve $-\\tfrac{1}{2}\\vec{v}$ değerlerini hesapla.<br><br>$3\\vec{v} = (6, -9)$ — üç kat uzun, aynı yön.<br><br>$-\\tfrac{1}{2}\\vec{v} = (-1, 1.5)$ — yarı uzunluk, ters yön.</div></div>

<h2 class="lesson-title">7. Nokta (Skaler) Çarpım</h2>

<div class="calc-highlight"><strong>Nokta çarpım, iki vektörü tek bir sayı (skaler) döndürerek çarpmanın bir yoludur.</strong> Toplamadan sonra vektörler üzerindeki en kullanışlı işlemdir: aralarındaki açıyı, dik olup olmadıklarını ve birinin diğerine ne kadar "izdüşüm yaptığını" söyler. İki çizgi, bir sayı.</div>

<div class="calc-formula"><div class="formula-label">NOKTA ÇARPIM &mdash; CEBİRSEL FORMÜL</div><div class="formula-main">$$\\vec{v} \\cdot \\vec{w} \\;=\\; v_x w_x \\;+\\; v_y w_y$$</div><div class="formula-sub">Eşleşen bileşenleri çarp, sonra topla. Sonuç bir gerçek sayıdır, vektör değil.</div></div>

<p class="l-text">Nokta çarpımın güzel bir geometrik yüzü de var. Kuyrukları aynı noktaya konulduğunda $\\vec{v}$ ile $\\vec{w}$ arasındaki açı $\\theta$ ise:</p>

<div class="calc-formula"><div class="formula-label">NOKTA ÇARPIM &mdash; GEOMETRİK FORMÜL</div><div class="formula-main">$$\\vec{v} \\cdot \\vec{w} \\;=\\; |\\vec{v}| \\, |\\vec{w}| \\, \\cos\\theta$$</div><div class="formula-sub">Aynı işlemin iki eşdeğer formülü. Bunları birbirine eşitlemek, iki vektör arasındaki açıyı bulmanın standart yoludur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$\\vec{v} = (1, 2)$ ve $\\vec{w} = (3, 4)$'ün nokta çarpımını hesapla.<br><br>$\\vec{v} \\cdot \\vec{w} = 1 \\cdot 3 + 2 \\cdot 4 = 3 + 8 = \\mathbf{11}$.<br><br>Pozitif, dolayısıyla iki vektör aynı yarı düzleme bakar (aralarındaki açı 90 dereceden küçüktür).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$\\vec{a} = (4, -1)$ ve $\\vec{b} = (-2, 3)$'ün nokta çarpımını hesapla.<br><br>$\\vec{a} \\cdot \\vec{b} = 4 \\cdot (-2) + (-1) \\cdot 3 = -8 - 3 = \\mathbf{-11}$.<br><br>Negatif, dolayısıyla açı 90 dereceden büyüktür — vektörler zıt yarı düzlemlere bakar.</div></div>

<h2 class="lesson-title">8. Geometrik Anlam: İzdüşüm</h2>

<div class="calc-highlight"><strong>Nokta çarpım, bir vektörün diğeri boyunca ne kadarının uzandığını ölçer.</strong> Geometrik olarak $\\vec{v} \\cdot \\vec{w}$, $\\vec{w}$'nin büyüklüğü ile $\\vec{v}$'nin $\\vec{w}$ üzerine düşürdüğü gölgenin işaretli uzunluğunun çarpımıdır (ya da tersi).</div>

<p class="l-text">Güneşin $\\vec{w}$'nin çizgisi üzerinde tam tepede olduğunu hayal et. $\\vec{v}$'nin o çizgi üzerine düşürdüğü gölge, $\\vec{v}$'nin $\\vec{w}$ üzerine <em>izdüşümüdür</em>. İşaretli uzunluğu:</p>

<div class="calc-formula"><div class="formula-label">SKALER İZDÜŞÜM</div><div class="formula-main">$$\\text{izd-uzunluk} \\;=\\; \\frac{\\vec{v} \\cdot \\vec{w}}{|\\vec{w}|} \\;=\\; |\\vec{v}| \\cos\\theta$$</div><div class="formula-sub">$\\vec{v}$ ile $\\vec{w}$ aynı yöne meylederse pozitif, ters yöne meylederse negatif, dik durumda sıfırdır.</div></div>

<div class="calc-graph"><div id="plot-l91-proj-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\vec{v} = (3, 4)$ (turuncu) vektörünün $\\vec{w} = (5, 0)$ (mavi) üzerine izdüşümü. Kesik çizgi $\\vec{w}$'ye diktir ve $\\vec{v}$'nin başını üzerine indirir. $\\vec{w}$ üzerindeki gölge uzunluğu 3'tür — tam olarak $\\vec{v} \\cdot \\vec{w} / |\\vec{w}| = 15/5$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var wBT={x:[0,5],y:[0,0],mode:'lines+markers',name:'w = (5,0)',line:{color:'#3b82f6',width:3.4},marker:{color:'#3b82f6',size:[6,11]}};
var vBT={x:[0,3],y:[0,4],mode:'lines+markers',name:'v = (3,4)',line:{color:'#f59e0b',width:3.4},marker:{color:'#f59e0b',size:[6,11]}};
var perpBT={x:[3,3],y:[4,0],mode:'lines',name:'dik düşüş',line:{color:'rgba(255,255,255,0.45)',width:1.6,dash:'dot'},showlegend:true};
var shadowBT={x:[0,3],y:[0,0],mode:'lines',name:'izdüşüm (uzunluk 3)',line:{color:'#10b981',width:5}};
var labelsPT={x:[2.5,1.4,3.15,1.5],y:[-0.25,2.2,2.0,0.25],mode:'text',name:'etiketler',text:['w','v','dik','izdüşüm'],textfont:{color:['#3b82f6','#f59e0b','rgba(255,255,255,0.6)','#10b981'],size:13},showlegend:false};
var layPT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,5.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.8,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-proj-tr',[wBT,vBT,shadowBT,perpBT,labelsPT],layPT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Dik Vektörler</h2>

<div class="calc-highlight"><strong>İki vektör ancak ve ancak nokta çarpımları sıfır olduğunda diktir.</strong> Bu, nokta çarpımın en çok kullanılan sonucudur, çünkü "şuna dik bir vektör bul..." problemini tek satırlık bir cebir kontrolüne çevirir.</div>

<div class="calc-formula"><div class="formula-label">DİKLİK TESTİ</div><div class="formula-main">$$\\vec{v} \\perp \\vec{w} \\;\\iff\\; \\vec{v} \\cdot \\vec{w} \\;=\\; 0$$</div><div class="formula-sub">Neden? Geometrik formülden, $\\cos\\theta = 0$ tam olarak $\\theta = 90^\\circ$ olduğunda. Yani sıfır nokta çarpım (ve sıfır olmayan vektörler) dik açıya zorlar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\vec{v} = (2, 3)$ ve $\\vec{w} = (3, -2)$ dik midir?<br><br>$\\vec{v} \\cdot \\vec{w} = 2 \\cdot 3 + 3 \\cdot (-2) = 6 - 6 = \\mathbf{0}$.<br><br>Evet, dik. Yapıya dikkat et: $(a, b)$'ye dik bir vektör elde etmek için her zaman $(b, -a)$ ya da $(-b, a)$ alabilirsin. Bileşenleri yer değiştir ve bir işareti tersine çevir.</div></div>

<h2 class="lesson-title">10. İki Vektör Arasındaki Açı</h2>

<div class="calc-highlight"><strong>Geometrik nokta çarpım formülünü yeniden düzenleyince açıyı doğrudan elde edersin.</strong> "Bir vektör diğeriyle ne açı yapar?" sorulduğunda kullandığın asıl formül budur.</div>

<div class="calc-formula"><div class="formula-label">VEKTÖRLER ARASI AÇI</div><div class="formula-main">$$\\cos\\theta \\;=\\; \\frac{\\vec{v} \\cdot \\vec{w}}{|\\vec{v}| \\, |\\vec{w}|}$$</div><div class="formula-sub">Her iki vektör de sıfır olmamalı. $\\theta$ açısı $[0^\\circ, 180^\\circ]$ aralığında alınır — iki çizgi arasındaki iki açıdan "küçük olanı".</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$\\vec{v} = (1, 0)$ ile $\\vec{w} = (1, 1)$ arasındaki açıyı bul.<br><br>$\\vec{v} \\cdot \\vec{w} = 1 \\cdot 1 + 0 \\cdot 1 = 1$. $|\\vec{v}| = 1$, $|\\vec{w}| = \\sqrt{2}$.<br><br>$\\cos\\theta = \\dfrac{1}{1 \\cdot \\sqrt{2}} = \\dfrac{1}{\\sqrt{2}} \\implies \\theta = \\mathbf{45^\\circ}$.<br><br>Mantıklı: $(1, 1)$ $y = x$ doğrusu üzerindedir, bu da x-ekseniyle 45 derece açı yapar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$\\vec{a} = (2, 0)$ ile $\\vec{b} = (0, 3)$ arasındaki açıyı bul.<br><br>$\\vec{a} \\cdot \\vec{b} = 0$, dolayısıyla $\\cos\\theta = 0$, yani $\\theta = \\mathbf{90^\\circ}$.<br><br>Zaten bildiğimizi doğrular: x-ekseni ve y-ekseni dik.</div></div>

<div class="l-note"><strong>Yaygın bir hata:</strong> öğrenciler $\\vec{v} \\cdot \\vec{w}$ değerini hesaplayıp büyüklüklerin çarpımına bölmeyi unutur. Çıplak nokta çarpım <em>kosinüs değildir</em> — yalnızca $|\\vec{v}||\\vec{w}|$'ye <em>bölünmüş</em> nokta çarpım $\\cos\\theta$'yı verir. Her iki büyüklüğü de hep yanında taşı.</div>

<div class="calc-graph"><div id="plot-l91-angle-tr-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijinden çizilen $\\vec{u} = (3, 1)$ (mavi) ile $\\vec{v} = (1, 2)$ (turuncu) arasındaki $\\theta$ açısı ve $\\vec{v}$'nin $\\vec{u}$ üzerine izdüşümü (kesik çizgi). Hesap: $\\vec{u} \\cdot \\vec{v} = 3 + 2 = 5$, $|\\vec{u}| = \\sqrt{10}$, $|\\vec{v}| = \\sqrt{5}$, dolayısıyla $\\cos\\theta = 5/\\sqrt{50} = 1/\\sqrt{2}$ ve $\\theta = 45^\\circ$. Taralı dilim açının kendisidir; yeşil nokta $\\vec{v}$'nin $\\vec{u}$ doğrusuna düştüğü $(1.5, 0.5)$ noktasını gösterir ve geometrik özdeşliği $\\vec{u} \\cdot \\vec{v} = |\\vec{u}|\\,|\\vec{v}|\\,\\cos\\theta$ görselleştirir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var uVecT={x:[0,3],y:[0,1],mode:'lines+markers',name:'u = (3,1)',line:{color:'#3b82f6',width:3.6},marker:{color:'#3b82f6',size:[6,11]}};
var vVecT={x:[0,1],y:[0,2],mode:'lines+markers',name:'v = (1,2)',line:{color:'#f59e0b',width:3.6},marker:{color:'#f59e0b',size:[6,11]}};
var projDropT={x:[1,1.5],y:[2,0.5],mode:'lines',name:'dik düşüş',line:{color:'rgba(255,255,255,0.5)',width:1.7,dash:'dot'}};
var projPtT={x:[1.5],y:[0.5],mode:'markers',name:'proj_u(v) = (1.5, 0.5)',marker:{color:'#10b981',size:11,symbol:'circle',line:{color:'#0a0a0a',width:1.5}}};
var projSegT={x:[0,1.5],y:[0,0.5],mode:'lines',name:'u üzerine izdüşüm',line:{color:'#10b981',width:5}};
var wedgeXT=[0];var wedgeYT=[0];
var aUT=Math.atan2(1,3);var aVT2=Math.atan2(2,1);var rT=0.6;
for(var iT=0;iT<=24;iT++){var aT=aUT+(aVT2-aUT)*(iT/24);wedgeXT.push(rT*Math.cos(aT));wedgeYT.push(rT*Math.sin(aT));}
wedgeXT.push(0);wedgeYT.push(0);
var wedgeT2={x:wedgeXT,y:wedgeYT,mode:'lines',fill:'toself',name:'theta = 45 derece',line:{color:'rgba(59,130,246,0.55)',width:1.4},fillcolor:'rgba(59,130,246,0.18)'};
var labelsAT={x:[2.45,0.7,0.95,1.8,1.55],y:[0.65,1.55,0.32,0.18,0.7],mode:'text',name:'lab',text:['u','v','theta','|u||v|cos theta','izdüşüm'],textfont:{color:['#3b82f6','#f59e0b','rgba(59,130,246,0.95)','#10b981','#10b981'],size:13},showlegend:false};
var layAT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,3.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-angle-tr-extra',[wedgeT2,projSegT,uVecT,vVecT,projDropT,projPtT,labelsAT],layAT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. 2B Çapraz Çarpım (Skaler)</h2>

<div class="calc-highlight"><strong>3B'de iki vektörün çapraz çarpımı kendisi bir vektördür. 2B'de tek bir işaretli sayı döndüren sade bir "skaler çapraz çarpım" kullanırız — iki vektörün gerdiği paralelkenarın alanı, yönü kaydeden bir işaretle birlikte.</strong></div>

<div class="calc-formula"><div class="formula-label">2B ÇAPRAZ ÇARPIM (SKALER)</div><div class="formula-main">$$\\vec{v} \\times \\vec{w} \\;=\\; v_x w_y \\;-\\; v_y w_x$$</div><div class="formula-sub">$\\vec{v}$'den $\\vec{w}$'ye saat yönünün tersine bir dönüşle (180 dereceden az) ulaşılıyorsa pozitif. Saat yönündeyse negatif. İki vektör paralelse tam olarak sıfır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\vec{v} = (2, 1)$ ve $\\vec{w} = (1, 3)$ vektörlerinin 2B çapraz çarpımını hesapla.<br><br>$\\vec{v} \\times \\vec{w} = 2 \\cdot 3 - 1 \\cdot 1 = 6 - 1 = \\mathbf{5}$.<br><br>Demek ki $\\vec{v}$ ve $\\vec{w}$ kenarlı paralelkenarın alanı 5. İşaret pozitif, yani $\\vec{w}$, $\\vec{v}$'den CCW (saat yönünün tersine) yönde duruyor.</div></div>

<div class="l-note"><strong>Nokta vs. çapraz.</strong> Nokta çarpım hizalanmayı (kosinüs, izdüşüm) ölçer. Çapraz çarpım dik bileşeni (sinüs, işaretli alan) ölçer. Birlikte vektör geometrisinin çoğunu açarlar.</div>

<h2 class="lesson-title">12. Uygulamalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cisme etkiyen kuvvetler</div><div class="card-body">İki iple çekilen bir kutu, iki ip gerginliğinin vektörel toplamına eşit tek bir <em>bileşke kuvvet</em> hisseder. Bileşenleri hesapla, topla, büyüklüğü bul — tamam.</div></div>
<div class="calc-card"><div class="card-title">Yer değiştirme ve hız</div><div class="card-body">"3 km doğuya, sonra 4 km kuzeye yürü" net yer değiştirme vektörü $(3, 4)$, büyüklüğü 5 km. Hız (yönlü m/s) ve ivme (yönlü m/s kare) aynı kurallara uyar.</div></div>
<div class="calc-card"><div class="card-title">Bir kuvvetin yaptığı iş</div><div class="card-body">Sabit bir kuvvet $\\vec{F}$ bir cismi $\\vec{d}$ yer değiştirmesi boyunca hareket ettirirse, yapılan iş $W = \\vec{F} \\cdot \\vec{d} = |\\vec{F}| |\\vec{d}| \\cos\\theta$. Harekete dik kuvvet <em>sıfır</em> iş yapar.</div></div>
</div>

<div class="calc-example"><div class="example-label">FİZİK ÇÖZÜMLÜ ÖRNEĞİ</div><div class="example-body">Büyüklüğü 10 N olan yatay bir kuvvet bir kızağı 5 m doğuya çeker. Yapılan işi bul.<br><br>$\\vec{F} = (10, 0)$ N. $\\vec{d} = (5, 0)$ m. Her ikisi de doğuya bakar, dolayısıyla aralarındaki açı 0 derece ve $\\cos 0 = 1$.<br><br>$W = \\vec{F} \\cdot \\vec{d} = 10 \\cdot 5 + 0 \\cdot 0 = \\mathbf{50 \\text{ J}}$.<br><br>Eğer kuvvet dikey olsaydı, örneğin $\\vec{F} = (0, 10)$ N, nokta çarpım sıfır olur ve iş de sıfır olurdu — kızak yatay hareket ederken doğrudan yukarı itmek hiçbir şey başarmaz.</div></div>

<div style="margin:1.6rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:rgba(235,230,220,0.92);font-size:0.9rem;border:1px solid rgba(255,255,255,0.08)">
<thead><tr style="background:#3b82f6;color:#0a0a0a"><th style="padding:0.6rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.08)">İşlem</th><th style="padding:0.6rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.08)">Formül (2B)</th><th style="padding:0.6rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.08)">Geometrik anlam</th></tr></thead>
<tbody>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Büyüklük $|\\vec{v}|$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\sqrt{v_x^2 + v_y^2}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Okun uzunluğu (bileşenlerin oluşturduğu dik üçgenin hipotenüsü).</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Toplama $\\vec{v} + \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$(v_x + w_x,\\; v_y + w_y)$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Baş-kuyruk yürüyüşü veya paralelkenarın köşegeni — net yer değiştirme.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Çıkarma $\\vec{v} - \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$(v_x - w_x,\\; v_y - w_y)$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Kuyruklar orijindeyken $\\vec{w}$'nin başından $\\vec{v}$'nin başına giden ok.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Skalerle çarpma $k\\vec{v}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$(k v_x,\\; k v_y)$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$|k|$ kadar uzar; $k < 0$ ise yön tersine döner. Aynı doğru, yeni uzunluk.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Nokta çarpım $\\vec{v} \\cdot \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$v_x w_x + v_y w_y = |\\vec{v}||\\vec{w}|\\cos\\theta$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">İki vektörün hizalanması. Pozitif = aynı yan, sıfır = dik, negatif = ters.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">2B çapraz çarpım $\\vec{v} \\times \\vec{w}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$v_x w_y - v_y w_x$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\vec{v}, \\vec{w}$ ile gerilen paralelkenarın işaretli alanı (pozitif = CCW yön).</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Vektörler arası açı</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\cos\\theta = \\dfrac{\\vec{v} \\cdot \\vec{w}}{|\\vec{v}|\\,|\\vec{w}|}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Ortak kuyrukta iki açıdan küçüğü, $[0^\\circ, 180^\\circ]$ aralığında.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">İzdüşüm $\\text{proj}_{\\vec{u}}(\\vec{v})$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}|^2}\\,\\vec{u}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\vec{v}$'nin $\\vec{u}$ doğrusuna düşen gölgesi — $\\vec{v}$'nin $\\vec{u}$ boyunca uzanan kısmı.</td></tr>
<tr><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Birim vektör $\\hat{v}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\dfrac{\\vec{v}}{|\\vec{v}|}$</td><td style="padding:0.55rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\vec{v}$ ile aynı yön, uzunluk tam olarak 1 — saf yön bilgisi.</td></tr>
</tbody></table></div>

<h2 class="lesson-title">13. Vektör Galerisi</h2>

<div class="calc-graph"><div id="plot-l91-gallery-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> orijinden çizilmiş üç örnek vektör — $\\vec{a} = (4, 0)$ pozitif x-ekseni boyunca (uzunluk 4), $\\vec{b} = (3, 4)$ klasik 3-4-5 büyüklüğüyle (uzunluk 5) ve ikinci bölgeye meyleden $\\vec{c} = (-2, 3)$ (uzunluk $\\sqrt{13} \\approx 3.6$). Resimden yön ve büyüklük okumak, ihtiyacın olan geometrik sezgiyi eğitir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var aVT={x:[0,4],y:[0,0],mode:'lines+markers',name:'a = (4,0), |a|=4',line:{color:'#3b82f6',width:3.4},marker:{color:'#3b82f6',size:[6,11]}};
var bVT={x:[0,3],y:[0,4],mode:'lines+markers',name:'b = (3,4), |b|=5',line:{color:'#10b981',width:3.4},marker:{color:'#10b981',size:[6,11]}};
var cVT={x:[0,-2],y:[0,3],mode:'lines+markers',name:'c = (-2,3), |c|≈3.6',line:{color:'#f59e0b',width:3.4},marker:{color:'#f59e0b',size:[6,11]}};
var labelsGT={x:[3.3,1.7,-1.4],y:[-0.4,2.3,1.7],mode:'text',name:'etiketler',text:['a','b','c'],textfont:{color:['#3b82f6','#10b981','#f59e0b'],size:14},showlegend:false};
var layGT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3.2,5.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.2,4.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l91-gallery-tr',[aVT,bVT,cVT,labelsGT],layGT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">14. Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">YANLIŞ</div><div class="compare-item">"$\\vec{v} \\cdot \\vec{w}$ bir vektördür" (bir sayıdır)</div><div class="compare-item">"$\\vec{v} \\times \\vec{w}$ ile $\\vec{v} \\cdot \\vec{w}$ aynıdır" (tamamen farklı)</div><div class="compare-item">"$\\cos\\theta = \\vec{v} \\cdot \\vec{w}$" (büyüklüklere bölmeyi unutmuş)</div><div class="compare-item">"$|\\vec{v} + \\vec{w}| = |\\vec{v}| + |\\vec{w}|$" (sadece aynı yön için doğrudur)</div><div class="compare-item">"Vektörler orijinde başlamak zorundadır" (hayır — sadece bileşenleri sabittir)</div></div><div class="compare-col"><div class="compare-title">DOĞRU</div><div class="compare-item">Nokta çarpım bir skaler (gerçek sayı) döndürür</div><div class="compare-item">Nokta = hizalanma, çapraz = dik alan; farklı şeyler</div><div class="compare-item">$\\cos\\theta = (\\vec{v} \\cdot \\vec{w}) / (|\\vec{v}| |\\vec{w}|)$, daima</div><div class="compare-item">Üçgen eşitsizliği: $|\\vec{v} + \\vec{w}| \\le |\\vec{v}| + |\\vec{w}|$</div><div class="compare-item">Kuyruğun konumu önemsiz; aynı bileşenler her yerde aynı vektörü tanımlar</div></div></div>

<h2 class="lesson-title">15. Alıştırma Problemleri</h2>

<p class="l-text">Çözümü okumadan önce her problemi kendin dene.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; BÜYÜKLÜK</div><div class="example-body"><strong>$\\vec{v} = (5, 12)$ için $|\\vec{v}|$'yi bul.</strong><br><br>$|\\vec{v}| = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = \\mathbf{13}$.<br><br>Bir başka klasik Pisagor üçlüsü: 5-12-13.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; BİRİM VEKTÖR</div><div class="example-body"><strong>$\\vec{v} = (8, -6)$ yönündeki birim vektörü bul.</strong><br><br>$|\\vec{v}| = \\sqrt{64 + 36} = \\sqrt{100} = 10$.<br><br>$\\hat{v} = \\dfrac{(8, -6)}{10} = \\left(\\dfrac{4}{5},\\, -\\dfrac{3}{5}\\right) = (0.8,\\, -0.6)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TOPLAM VE FARK</div><div class="example-body"><strong>$\\vec{v} = (3, -1)$ ve $\\vec{w} = (-2, 4)$ için $\\vec{v} + \\vec{w}$ ile $\\vec{v} - \\vec{w}$'yi bul.</strong><br><br>$\\vec{v} + \\vec{w} = (3 + (-2),\\, -1 + 4) = (1,\\, 3)$.<br><br>$\\vec{v} - \\vec{w} = (3 - (-2),\\, -1 - 4) = \\mathbf{(5,\\, -5)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SKALER KATSAYI</div><div class="example-body"><strong>$\\vec{v} = (1, 2)$, $\\vec{w} = (4, -1)$ için $-2\\vec{v} + 3\\vec{w}$'yi bul.</strong><br><br>$-2\\vec{v} = (-2,\\, -4)$.<br>$3\\vec{w} = (12,\\, -3)$.<br>Toplam: $(-2 + 12,\\, -4 + (-3)) = \\mathbf{(10,\\, -7)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; NOKTA ÇARPIM</div><div class="example-body"><strong>$\\vec{v} = (6, -2)$ ile $\\vec{w} = (1, 3)$ için $\\vec{v} \\cdot \\vec{w}$'yi hesapla.</strong><br><br>$\\vec{v} \\cdot \\vec{w} = 6 \\cdot 1 + (-2) \\cdot 3 = 6 - 6 = \\mathbf{0}$.<br><br>Sıfır — yani $\\vec{v}$ ile $\\vec{w}$ <em>diktir</em>. Alıştırma probleminin bonus keşfi.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; AÇI</div><div class="example-body"><strong>$\\vec{a} = (1, 1)$ ile $\\vec{b} = (\\sqrt{3}, 1)$ arasındaki açıyı bul.</strong><br><br>$\\vec{a} \\cdot \\vec{b} = \\sqrt{3} + 1$. $|\\vec{a}| = \\sqrt{2}$, $|\\vec{b}| = \\sqrt{3 + 1} = 2$.<br><br>$\\cos\\theta = \\dfrac{\\sqrt{3} + 1}{2\\sqrt{2}} \\approx \\dfrac{2.732}{2.828} \\approx 0.966 \\implies \\theta \\approx \\mathbf{15^\\circ}$.<br><br>(Kesin değer: $\\theta = 15^\\circ$, çünkü $\\vec{a}$ x-ekseniyle 45 derece, $\\vec{b}$ ise 30 derece açı yapar; fark 15 derece.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; PARALELKENAR ALANI</div><div class="example-body"><strong>$\\vec{v} = (3, 1)$ ve $\\vec{w} = (1, 4)$ ile gerilen paralelkenarın alanını bul.</strong><br><br>Alan $= |\\vec{v} \\times \\vec{w}| = |3 \\cdot 4 - 1 \\cdot 1| = |12 - 1| = \\mathbf{11}$ birim kare.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; İŞ</div><div class="example-body"><strong>$\\vec{F} = (4, 3)$ N kuvveti bir cismi $\\vec{d} = (2, 0)$ m yer değiştirmesiyle çekiyor. Yapılan işi bul.</strong><br><br>$W = \\vec{F} \\cdot \\vec{d} = 4 \\cdot 2 + 3 \\cdot 0 = \\mathbf{8 \\text{ J}}$.<br><br>Yalnızca kuvvetin yatay bileşeni katkı yapar — dikey parça iş yapmaz çünkü yer değiştirmenin dikey bileşeni yoktur.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir vektör büyüklük ve yöne sahiptir; bileşen biçimi $\\vec{v} = (v_x, v_y)$</li>
<li>Büyüklük $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$; birim vektör $\\hat{v} = \\vec{v}/|\\vec{v}|$</li>
<li>Toplama: baş-kuyruk ve paralelkenar kuralları; koordinatlarda bileşen bileşen topla</li>
<li>Skalerle çarpma: $k\\vec{v}$ uzatır/kısaltır, $k < 0$ ise tersine çevirir</li>
<li>Nokta çarpım: $\\vec{v} \\cdot \\vec{w} = v_x w_x + v_y w_y = |\\vec{v}||\\vec{w}|\\cos\\theta$</li>
<li>Nokta çarpım sıfırsa dik; açı için $\\cos\\theta = (\\vec{v}\\cdot\\vec{w})/(|\\vec{v}||\\vec{w}|)$</li>
<li>2B çapraz çarpım $v_x w_y - v_y w_x$ işaretli paralelkenar alanını verir</li>
<li>Uygulamalar: kuvvet bileşkesi, yer değiştirme, iş $W = \\vec{F} \\cdot \\vec{d}$</li>
</ul>
</div>`

};
