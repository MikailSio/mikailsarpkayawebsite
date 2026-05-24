window.LISE_MAT_L78 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Two lines on the same plane can do exactly three things:</strong> they can coincide (and become a single line), they can be parallel (and never meet, no matter how far you extend them), or they can cross at a single point and form four angles. Lesson 77 taught you how to write the equation of a single line. This lesson teaches you how a <em>pair</em> of lines talks to each other — when their slopes force them to march together, when their slopes force them to cross at right angles, and what number controls the angle between them when neither extreme applies.</p>

<p class="l-text">The whole machinery rests on the slope <em>m</em> from the previous lesson. Two slopes are equal — the lines are parallel. Two slopes multiply to give &minus;1 — the lines are perpendicular. Two slopes are different but neither of those — the lines meet at some intermediate angle, and a single tangent formula tells you exactly what that angle is. Once you can read those three patterns off the equations, half of analytic geometry becomes routine.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise parallel lines from their slopes: $m_1 = m_2$</li>
<li>Recognise perpendicular lines from their slopes: $m_1 \\cdot m_2 = -1$, including the vertical-horizontal special case</li>
<li>Compute the acute angle between two intersecting lines using $\\tan\\alpha = \\left| \\dfrac{m_1 - m_2}{1 + m_1 m_2} \\right|$</li>
<li>Write the equation of a line through a given point that is parallel or perpendicular to a given line</li>
<li>Test whether three points are collinear using slope or area</li>
<li>Apply the rules to light reflection, navigation, construction</li>
</ul>
</div>

<h2 class="lesson-title">1. Three Configurations of Two Lines</h2>

<div class="calc-highlight"><strong>Take two distinct lines in the plane.</strong> They either never meet (parallel), or they meet at exactly one point. There is no third option — two distinct straight lines in a flat plane cannot meet at two points (that would force them to be the same line). The question is: which case are we in, and if they do meet, at what angle?</div>

<p class="l-text">From lesson 77 you can write any non-vertical line as $y = mx + n$, where $m$ is the slope and $n$ is the y-intercept. A vertical line has no slope (an undefined slope, $m = \\infty$) and is written $x = c$. Given two lines, the relationship between their slopes determines everything.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Parallel</div><div class="card-body">Same slope, different intercept. $m_1 = m_2$ and $n_1 \\neq n_2$. The lines march in lockstep and never cross.</div></div>
<div class="calc-card"><div class="card-title">Coincident</div><div class="card-body">Same slope, same intercept. $m_1 = m_2$ and $n_1 = n_2$. They are actually the same line.</div></div>
<div class="calc-card"><div class="card-title">Intersecting</div><div class="card-body">Different slopes. $m_1 \\neq m_2$. They meet at exactly one point and create four angles (two pairs of vertical angles).</div></div>
</div>

<div class="l-note"><strong>Vertical lines are the trap.</strong> A line $x = 3$ has no defined slope. The rules "slopes equal" and "slopes multiply to &minus;1" do not apply directly — you have to handle vertical lines as special cases. Two vertical lines are always parallel; a vertical line and a horizontal line are always perpendicular. We will note these cases each time they appear.</div>

<h2 class="lesson-title">2. Parallel Lines: Same Slope</h2>

<div class="calc-highlight"><strong>Two non-vertical lines are parallel if and only if their slopes are equal.</strong> This is the cleanest result in analytic geometry. Steepness is the only thing that matters for direction; the y-intercept just slides the line up or down, but does not tilt it.</div>

<div class="calc-formula"><div class="formula-label">PARALLEL CONDITION</div><div class="formula-main">$$\\ell_1 \\parallel \\ell_2 \\;\\Longleftrightarrow\\; m_1 = m_2 \\;\\text{ and }\\; n_1 \\neq n_2$$</div><div class="formula-sub">If the slopes also have the same intercept, the lines are not parallel but identical (one line).</div></div>

<p class="l-text"><strong>Why this is true geometrically.</strong> The slope is the tangent of the angle the line makes with the positive x-axis. Two lines with the same slope make the same angle with the x-axis, so they point in the same direction. Two lines pointing in the same direction can never converge — they stay the same perpendicular distance apart forever.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Are the lines $y = 3x + 1$ and $y = 3x - 4$ parallel?<br><br>Slopes: $m_1 = 3$, $m_2 = 3$. <strong>Equal.</strong><br>Intercepts: $n_1 = 1$, $n_2 = -4$. <strong>Different.</strong><br><br>Both conditions hold, so the lines are <strong>parallel</strong>. They never intersect; they sit 5 units apart vertically (the difference in intercepts).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — GENERAL FORM</div><div class="example-body">Are $2x - y + 3 = 0$ and $4x - 2y + 11 = 0$ parallel?<br><br>Solve for $y$ in each:<br>Line 1: $y = 2x + 3$ &rarr; $m_1 = 2$, $n_1 = 3$.<br>Line 2: $2y = 4x + 11$ &rarr; $y = 2x + 11/2$ &rarr; $m_2 = 2$, $n_2 = 11/2$.<br><br>Slopes equal, intercepts differ &rarr; <strong>parallel</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — VERTICAL LINES</div><div class="example-body">Are $x = 5$ and $x = -2$ parallel?<br><br>Both are vertical lines. They have no defined slope, but they both run straight up-and-down, so they are <strong>parallel</strong>. (Two vertical lines are always parallel to each other.)</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Write three lines all parallel to $y = -\\dfrac{1}{2}x + 7$. (Any line with slope $-1/2$ works, for example $y = -x/2$, $y = -x/2 + 100$, $y = -x/2 - 3$. Same slope, any intercept other than 7.)</div></div>

<h2 class="lesson-title">3. Perpendicular Lines: Negative Reciprocal Slopes</h2>

<div class="calc-highlight"><strong>Two non-vertical lines are perpendicular if and only if their slopes multiply to give &minus;1.</strong> Equivalently, each slope is the negative reciprocal of the other: $m_2 = -1/m_1$. This is the second great pattern of analytic geometry, just as important as the parallel rule.</div>

<div class="calc-formula"><div class="formula-label">PERPENDICULAR CONDITION</div><div class="formula-main">$$\\ell_1 \\perp \\ell_2 \\;\\Longleftrightarrow\\; m_1 \\cdot m_2 \\;=\\; -1 \\quad\\Longleftrightarrow\\quad m_2 \\;=\\; -\\dfrac{1}{m_1}$$</div><div class="formula-sub">Steep lines pair with shallow lines; positive slope pairs with negative slope. The product is always &minus;1.</div></div>

<p class="l-text"><strong>Why &minus;1?</strong> Here is the geometric reason in one paragraph. Take a line with slope $m_1 = \\tan\\theta$ (so it makes angle $\\theta$ with the positive x-axis). A line perpendicular to it makes angle $\\theta + 90^\\circ$ with the same axis. So its slope is $\\tan(\\theta + 90^\\circ) = -\\cot\\theta = -1/\\tan\\theta = -1/m_1$. Multiply both slopes and you get $m_1 \\cdot (-1/m_1) = -1$. The rule falls out of the rotation formula for tangent.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Slope examples</div><div class="card-body">$m_1 = 2$ &rarr; perpendicular slope is $-1/2$. $m_1 = -3/4$ &rarr; perpendicular slope is $4/3$. $m_1 = 1$ &rarr; perpendicular slope is $-1$.</div></div>
<div class="calc-card"><div class="card-title">Sign flip</div><div class="card-body">If $m_1$ is positive, the perpendicular slope is negative, and vice versa. Always opposite signs (except both zero or undefined, which is the special case below).</div></div>
<div class="calc-card"><div class="card-title">Special case</div><div class="card-body">A horizontal line ($m = 0$) is perpendicular to a vertical line (no slope). The product rule does not apply — but the geometry is clear: they meet at $90^\\circ$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Are the lines $y = 2x + 1$ and $y = -\\dfrac{1}{2}x + 5$ perpendicular?<br><br>Slopes: $m_1 = 2$, $m_2 = -1/2$.<br>Product: $m_1 \\cdot m_2 = 2 \\cdot (-1/2) = -1$. <strong>Yes</strong>, the lines are perpendicular.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — FIND THE PERPENDICULAR SLOPE</div><div class="example-body">What slope is perpendicular to a line with slope $m = 3/5$?<br><br>The negative reciprocal of $3/5$ is $-5/3$. Check: $(3/5)(-5/3) = -15/15 = -1$. <strong>Correct.</strong></div></div>

<div class="l-note"><strong>A pitfall to avoid.</strong> Students often invert without changing the sign, getting $5/3$ instead of $-5/3$. Then $(3/5)(5/3) = +1$, not &minus;1. The sign flip is essential. Always check: the product should equal &minus;1, never +1.</div>

<h2 class="lesson-title">4. The Angle Between Two Lines</h2>

<div class="calc-highlight"><strong>When two lines cross at a point that is neither a parallel nor a right-angle meeting, they form a definite angle.</strong> A single formula — using only the two slopes — gives you the tangent of that angle. This is the master formula of the lesson.</div>

<div class="calc-formula"><div class="formula-label">ANGLE BETWEEN TWO LINES</div><div class="formula-main">$$\\tan\\alpha \\;=\\; \\left|\\, \\dfrac{m_1 - m_2}{1 + m_1 m_2} \\,\\right|$$</div><div class="formula-sub">$\\alpha$ is the acute angle between the lines (the smaller of the two pairs of vertical angles they form). The absolute value forces an acute answer (between 0 and 90&deg;).</div></div>

<p class="l-text"><strong>Sketch of the derivation.</strong> Let the two lines make angles $\\theta_1$ and $\\theta_2$ with the positive x-axis, so $m_1 = \\tan\\theta_1$ and $m_2 = \\tan\\theta_2$. The angle between them is $\\alpha = \\theta_1 - \\theta_2$ (up to sign). The tangent subtraction identity from trigonometry gives</p>

<div class="calc-formula"><div class="formula-label">DERIVATION VIA TANGENT SUBTRACTION</div><div class="formula-main">$$\\tan(\\theta_1 - \\theta_2) \\;=\\; \\dfrac{\\tan\\theta_1 - \\tan\\theta_2}{1 + \\tan\\theta_1 \\tan\\theta_2} \\;=\\; \\dfrac{m_1 - m_2}{1 + m_1 m_2}$$</div><div class="formula-sub">Taking the absolute value selects the acute angle. The obtuse angle is $180^\\circ - \\alpha$.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ACUTE ANGLE (0 to 90&deg;)</div><div class="compare-item">Use the formula with absolute value</div><div class="compare-item">$\\tan\\alpha \\geq 0$ always</div><div class="compare-item">Standard answer to "the angle between two lines"</div><div class="compare-item">Example: $\\tan\\alpha = 1 \\Rightarrow \\alpha = 45^\\circ$</div></div><div class="compare-col"><div class="compare-title">OBTUSE ANGLE (90 to 180&deg;)</div><div class="compare-item">Drop the absolute value to track sign</div><div class="compare-item">$\\tan\\alpha < 0$ if the obtuse pair is required</div><div class="compare-item">Equals $180^\\circ - $ acute angle</div><div class="compare-item">Together they sum to $180^\\circ$ (supplementary)</div></div></div>

<p class="l-text"><strong>Two special cases swallowed by this formula.</strong> When $m_1 = m_2$ (parallel), the numerator is 0, so $\\tan\\alpha = 0$ and $\\alpha = 0$. When $1 + m_1 m_2 = 0$ (i.e. $m_1 m_2 = -1$, perpendicular), the denominator is 0, so $\\tan\\alpha$ is undefined — which is exactly what happens at $\\alpha = 90^\\circ$ (the tangent has a vertical asymptote there). The formula is consistent with the parallel and perpendicular rules.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the acute angle between $y = 2x + 1$ and $y = -x + 3$.<br><br>$m_1 = 2$, $m_2 = -1$.<br><br>$\\tan\\alpha = \\left| \\dfrac{2 - (-1)}{1 + (2)(-1)} \\right| = \\left| \\dfrac{3}{1 - 2} \\right| = \\left| \\dfrac{3}{-1} \\right| = 3$.<br><br>So $\\alpha = \\arctan(3) \\approx \\mathbf{71.57^\\circ}$. The obtuse angle between the lines is $180^\\circ - 71.57^\\circ \\approx 108.43^\\circ$.</div></div>

<div class="calc-graph"><div id="plot-l78-angle-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two lines from the worked example ($y = 2x + 1$ in blue, $y = -x + 3$ in red) crossing at the point $(2/3, 7/3)$. The acute angle $\\alpha \\approx 71.57^\\circ$ between them is marked at the intersection. Use this picture to check the answer visually — the acute angle is clearly between 60&deg; and 90&deg;.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y1=[];var y2=[];for(var i=-30;i<=50;i++){var xv=i/10;xs.push(xv);y1.push(2*xv+1);y2.push(-xv+3);}
var l1={x:xs,y:y1,mode:'lines',name:'y = 2x + 1',line:{color:'#3b82f6',width:3}};
var l2={x:xs,y:y2,mode:'lines',name:'y = -x + 3',line:{color:'#ef4444',width:3}};
var ix=2/3,iy=7/3;
var pt={x:[ix],y:[iy],mode:'markers+text',name:'intersection',marker:{color:'#f59e0b',size:10},text:['(2/3, 7/3)'],textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var arcX=[];var arcY=[];var aStart=Math.atan2(-1,1);var aEnd=Math.atan2(2,1);for(var j=0;j<=40;j++){var a=aStart+(aEnd-aStart)*j/40;arcX.push(ix+0.55*Math.cos(a));arcY.push(iy+0.55*Math.sin(a));}
var arc={x:arcX,y:arcY,mode:'lines',name:'α ≈ 71.57°',line:{color:'#10b981',width:2.5,dash:'dot'}};
var lab={x:[ix+0.85],y:[iy+0.45],mode:'text',name:'angle label',text:['α'],textfont:{color:'#10b981',size:18},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l78-angle-en',[l1,l2,arc,pt,lab],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Special Angles and Symmetries</h2>

<div class="calc-highlight"><strong>Three patterns occur over and over.</strong> Parallel lines ($\\alpha = 0$). Perpendicular lines ($\\alpha = 90^\\circ$). And the symmetric case: two lines with slopes equal in magnitude but opposite in sign, e.g. $m_1 = m$ and $m_2 = -m$. These appear in optics (reflection), in geometry (angle bisectors), and in many olympiad problems.</div>

<p class="l-text">Let us examine the symmetric case. If $m_1 = m$ and $m_2 = -m$, then</p>

<div class="calc-formula"><div class="formula-label">SYMMETRIC SLOPES</div><div class="formula-main">$$\\tan\\alpha \\;=\\; \\left| \\dfrac{m - (-m)}{1 + m \\cdot (-m)} \\right| \\;=\\; \\left| \\dfrac{2m}{1 - m^2} \\right|$$</div><div class="formula-sub">This is the double-angle formula for tangent. If $m = \\tan\\theta$, then $\\alpha = 2\\theta$ — the lines make equal angles on either side of the x-axis.</div></div>

<p class="l-text">Geometric meaning: the x-axis is the angle bisector of the two lines. Light bouncing off a horizontal mirror, the two diagonals of a kite, the two sides of an isoceles triangle around its altitude — all are instances of this symmetric configuration.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SYMMETRIC LINES</div><div class="example-body">Find the angle between $y = x$ and $y = -x$.<br><br>Symmetric case with $m = 1$. So $\\tan\\alpha = |2(1)/(1 - 1^2)| = |2/0| =$ undefined, which signals $\\alpha = 90^\\circ$.<br><br>The lines $y = x$ and $y = -x$ are perpendicular. This is also clear from $m_1 m_2 = (1)(-1) = -1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SHALLOW SYMMETRIC LINES</div><div class="example-body">Find the angle between $y = x/2$ and $y = -x/2$.<br><br>$m = 1/2$. $\\tan\\alpha = |2 \\cdot (1/2) / (1 - 1/4)| = |1 / (3/4)| = 4/3$.<br><br>So $\\alpha = \\arctan(4/3) \\approx \\mathbf{53.13^\\circ}$. The two lines make an acute angle of about 53&deg; with each other (and equal 26.57&deg; angles with the x-axis individually).</div></div>

<h2 class="lesson-title">6. Worked Example: Parallel Line Through a Point</h2>

<div class="calc-highlight"><strong>Standard problem.</strong> Given a line $\\ell$ and a point $P$ not on $\\ell$, write the equation of the line through $P$ that is parallel to $\\ell$. There is exactly one such line.</div>

<p class="l-text"><strong>Method.</strong> Take the slope $m$ of $\\ell$ from its equation. The new line has the same slope $m$. Use the point-slope form $y - y_0 = m(x - x_0)$ with $P = (x_0, y_0)$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Write the equation of the line through $(1, 2)$ parallel to $y = 3x + 1$.</strong><br><br><strong>Step 1.</strong> Slope of the given line: $m = 3$.<br><strong>Step 2.</strong> Parallel line shares the slope: $m = 3$.<br><strong>Step 3.</strong> Point-slope form through $(1, 2)$:<br>$y - 2 = 3(x - 1)$<br>$y = 3x - 3 + 2 = 3x - 1$<br><br>Answer: <strong>$y = 3x - 1$</strong>. Check: at $x = 1$, $y = 3 - 1 = 2$. The line passes through $(1, 2)$. Slope is 3, same as the original. <strong>Correct.</strong></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — GENERAL FORM INPUT</div><div class="example-body"><strong>Write the equation of the line through $(0, -4)$ parallel to $2x + 3y - 12 = 0$.</strong><br><br><strong>Step 1.</strong> Solve for $y$: $3y = -2x + 12 \\Rightarrow y = -\\dfrac{2}{3}x + 4$. So $m = -2/3$.<br><strong>Step 2.</strong> New line: $m = -2/3$, through $(0, -4)$.<br><strong>Step 3.</strong> $y - (-4) = -\\dfrac{2}{3}(x - 0)$<br>$y = -\\dfrac{2}{3}x - 4$<br><br>Answer: <strong>$y = -\\dfrac{2}{3}x - 4$</strong>, or equivalently $2x + 3y + 12 = 0$.</div></div>

<h2 class="lesson-title">7. Worked Example: Perpendicular Line Through a Point</h2>

<div class="calc-highlight"><strong>Standard problem, twin of the previous one.</strong> Given a line $\\ell$ and a point $P$, write the equation of the line through $P$ that is perpendicular to $\\ell$. There is exactly one such line.</div>

<p class="l-text"><strong>Method.</strong> Take the slope $m$ of $\\ell$. The new line has slope $-1/m$ (negative reciprocal). Use point-slope form through $P$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Write the equation of the line through $(3, -1)$ perpendicular to $2x - y + 4 = 0$.</strong><br><br><strong>Step 1.</strong> Solve for $y$: $-y = -2x - 4 \\Rightarrow y = 2x + 4$. Slope: $m = 2$.<br><strong>Step 2.</strong> Perpendicular slope: $-1/2$.<br><strong>Step 3.</strong> Point-slope through $(3, -1)$:<br>$y - (-1) = -\\dfrac{1}{2}(x - 3)$<br>$y + 1 = -\\dfrac{1}{2}x + \\dfrac{3}{2}$<br>$y = -\\dfrac{1}{2}x + \\dfrac{3}{2} - 1 = -\\dfrac{1}{2}x + \\dfrac{1}{2}$<br><br>Answer: <strong>$y = -\\dfrac{1}{2}x + \\dfrac{1}{2}$</strong>, or equivalently $x + 2y - 1 = 0$.<br><br>Check: at $x = 3$, $y = -3/2 + 1/2 = -1$. <strong>Passes through $(3, -1)$.</strong> Slope $-1/2$ &times; original slope $2 = -1$. <strong>Perpendicular.</strong></div></div>

<div class="calc-graph"><div id="plot-l78-parperp-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two parallel lines (slope $+2$, blue) and two perpendicular lines (the same blue line and a green line with slope $-1/2$). The parallel pair never crosses; the perpendicular pair meets at a clean right angle. Both relations come from a single number — the slope.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var p1=[];var p2=[];var per=[];for(var i=-40;i<=40;i++){var xv=i/10;xs.push(xv);p1.push(2*xv+1);p2.push(2*xv-3);per.push(-0.5*xv+1);}
var l1={x:xs,y:p1,mode:'lines',name:'y = 2x + 1',line:{color:'#3b82f6',width:3}};
var l2={x:xs,y:p2,mode:'lines',name:'y = 2x - 3 (parallel)',line:{color:'#60a5fa',width:3,dash:'dash'}};
var l3={x:xs,y:per,mode:'lines',name:'y = -x/2 + 1 (perp.)',line:{color:'#10b981',width:3}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l78-parperp-en',[l1,l2,l3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Reflection of a Line Through Another Line</h2>

<div class="calc-highlight"><strong>If you reflect a line $\\ell_1$ in a mirror line $\\ell_m$, you get a new line $\\ell_1'$.</strong> The mirror line bisects the angle between $\\ell_1$ and $\\ell_1'$ — that is the defining property of reflection. Geometrically: each point on $\\ell_1$ maps to its mirror image across $\\ell_m$, and the image points form $\\ell_1'$.</div>

<p class="l-text">If $\\ell_1$ makes angle $\\theta$ with $\\ell_m$ on one side, then $\\ell_1'$ makes angle $\\theta$ on the other side. So the angle between $\\ell_1$ and $\\ell_1'$ is $2\\theta$. This is exactly the symmetric-slopes case from section 5.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — REFLECTION IN THE X-AXIS</div><div class="example-body">Reflect the line $y = 2x + 3$ in the x-axis. What is the new line?<br><br>Reflecting in the x-axis sends $(x, y)$ to $(x, -y)$. Substitute $-y$ for $y$:<br>$-y = 2x + 3 \\Rightarrow y = -2x - 3$.<br><br>Answer: $y = -2x - 3$. Slope flipped from $+2$ to $-2$ (symmetric), intercept flipped from $+3$ to $-3$.</div></div>

<div class="calc-graph"><div id="plot-l78-reflect-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the line $y = 2x + 3$ (blue) and its reflection $y = -2x - 3$ (red) in the x-axis (dashed white). The two lines have slopes that are negatives of each other, and the x-axis bisects the angle between them. The intersection point lies on the mirror line itself, at $x = -3/2$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ya=[];var yb=[];for(var i=-40;i<=20;i++){var xv=i/10;xs.push(xv);ya.push(2*xv+3);yb.push(-2*xv-3);}
var orig={x:xs,y:ya,mode:'lines',name:'y = 2x + 3',line:{color:'#3b82f6',width:3}};
var refl={x:xs,y:yb,mode:'lines',name:"y = -2x - 3 (reflected)",line:{color:'#ef4444',width:3}};
var mir={x:[-5,5],y:[0,0],mode:'lines',name:'x-axis (mirror)',line:{color:'rgba(255,255,255,0.55)',width:2,dash:'dash'}};
var ip={x:[-1.5],y:[0],mode:'markers+text',name:'cross',marker:{color:'#f59e0b',size:10},text:['(-3/2, 0)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l78-reflect-en',[orig,refl,mir,ip],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Collinearity: Three Points on a Line</h2>

<div class="calc-highlight"><strong>Three points are collinear if they all lie on a single straight line.</strong> Two simple tests: either compute the slopes between pairs and check they are equal, or compute the signed area of the triangle they would form and check it is zero. Both methods are reliable; pick whichever feels faster.</div>

<div class="calc-formula"><div class="formula-label">COLLINEARITY VIA SLOPES</div><div class="formula-main">$$\\text{Slope}(A,B) \\;=\\; \\text{Slope}(B,C) \\;\\Longleftrightarrow\\; A,B,C \\text{ collinear}$$</div><div class="formula-sub">Computing $m_{AB}$ and $m_{BC}$ and checking equality is enough. (The third pair $m_{AC}$ would then also match automatically.)</div></div>

<div class="calc-formula"><div class="formula-label">COLLINEARITY VIA AREA</div><div class="formula-main">$$\\text{Area} \\;=\\; \\dfrac{1}{2} \\left| x_A(y_B - y_C) + x_B(y_C - y_A) + x_C(y_A - y_B) \\right| \\;=\\; 0$$</div><div class="formula-sub">If the three points form a degenerate triangle of zero area, they lie on the same line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Are $A(1, 2)$, $B(3, 6)$, $C(5, 10)$ collinear?<br><br>$m_{AB} = (6 - 2)/(3 - 1) = 4/2 = 2$.<br>$m_{BC} = (10 - 6)/(5 - 3) = 4/2 = 2$.<br><br>Slopes equal &rarr; <strong>collinear</strong>. (The common line is $y = 2x$.)</div></div>

<h2 class="lesson-title">10. Applications</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Light reflection</div><div class="card-body">A light ray hits a mirror and bounces off at an equal angle on the other side. The incident and reflected rays are symmetric in the normal to the mirror — exactly the symmetric-slope case from section 5.</div></div>
<div class="calc-card"><div class="card-title">Navigation</div><div class="card-body">A ship sailing east along a parallel of latitude and a ship sailing north along a meridian travel along perpendicular routes. Course corrections often reduce to finding lines parallel or perpendicular to a reference bearing.</div></div>
<div class="calc-card"><div class="card-title">Construction</div><div class="card-body">Walls of a building meet at right angles, floor beams run parallel to each other, roof rafters intersect at calculated angles. Architects use perpendicular and parallel-line equations on every blueprint.</div></div>
</div>

<p class="l-text"><strong>One more example: angle of incidence equals angle of reflection.</strong> A ball thrown at a flat wall bounces off so that its incoming path and outgoing path make equal angles with the wall. If the wall has slope $m_w$ and the incoming path has slope $m_i$, the outgoing path has slope $m_o$ chosen so that the wall bisects the angle between the two paths. This is the geometric foundation of billiards, optics, and acoustics.</p>

<h2 class="lesson-title">11. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sign of slope</div><div class="card-body">Forgetting the minus sign on the perpendicular slope. $m = 2/3$ gives perpendicular slope $-3/2$, not $3/2$. The product must equal &minus;1.</div></div>
<div class="calc-card"><div class="card-title">Vertical lines</div><div class="card-body">Trying to apply $m_1 m_2 = -1$ to a vertical line. Vertical lines have no slope — handle them as a special case. A vertical and a horizontal line are perpendicular even though the product rule does not formally apply.</div></div>
<div class="calc-card"><div class="card-title">Acute vs obtuse</div><div class="card-body">Reading the angle formula without absolute value and reporting a negative tangent as "the angle". The formula with absolute value always gives the acute angle. The obtuse partner is $180^\\circ - \\alpha$.</div></div>
<div class="calc-card"><div class="card-title">Same slope, same line</div><div class="card-body">Saying two lines are parallel when they are actually the same line. Check both the slope <em>and</em> the intercept. Equal slopes plus equal intercepts means one single line, not a parallel pair.</div></div>
</div>

<h2 class="lesson-title">12. Practice Problems</h2>

<p class="l-text">Eight problems building up from basic recognition to multi-step constructions. Try each one yourself first, then read the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — IDENTIFY THE RELATIONSHIP</div><div class="example-body"><strong>Are the lines $y = 4x - 2$ and $y = -\\dfrac{1}{4}x + 5$ parallel, perpendicular, or neither?</strong><br><br>$m_1 = 4$, $m_2 = -1/4$. Product: $4 \\cdot (-1/4) = -1$. <strong>Perpendicular.</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — PARALLEL LINE THROUGH POINT</div><div class="example-body"><strong>Write the equation of the line through $(2, -3)$ parallel to $y = -\\dfrac{1}{2}x + 7$.</strong><br><br>Slope $m = -1/2$.<br>$y - (-3) = -\\dfrac{1}{2}(x - 2)$<br>$y + 3 = -\\dfrac{1}{2}x + 1$<br>$y = -\\dfrac{1}{2}x - 2$.<br><br>Answer: <strong>$y = -\\dfrac{1}{2}x - 2$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — PERPENDICULAR LINE THROUGH POINT</div><div class="example-body"><strong>Write the equation of the line through $(-2, 4)$ perpendicular to $y = \\dfrac{3}{4}x - 1$.</strong><br><br>Original slope $3/4$. Perpendicular slope: $-4/3$.<br>$y - 4 = -\\dfrac{4}{3}(x - (-2)) = -\\dfrac{4}{3}(x + 2)$<br>$y = -\\dfrac{4}{3}x - \\dfrac{8}{3} + 4 = -\\dfrac{4}{3}x + \\dfrac{4}{3}$.<br><br>Answer: <strong>$y = -\\dfrac{4}{3}x + \\dfrac{4}{3}$</strong>, or $4x + 3y - 4 = 0$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — ANGLE BETWEEN TWO LINES</div><div class="example-body"><strong>Find the acute angle between $y = x + 2$ and $y = 3x - 1$.</strong><br><br>$m_1 = 1$, $m_2 = 3$. $\\tan\\alpha = |(1 - 3)/(1 + 3)| = |-2/4| = 1/2$.<br><br>$\\alpha = \\arctan(1/2) \\approx \\mathbf{26.57^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — COLLINEARITY</div><div class="example-body"><strong>Are the points $A(0, 1)$, $B(2, 5)$, $C(5, 11)$ collinear?</strong><br><br>$m_{AB} = (5-1)/(2-0) = 2$.<br>$m_{BC} = (11-5)/(5-2) = 6/3 = 2$.<br><br>Slopes equal &rarr; <strong>yes, collinear</strong>. The common line is $y = 2x + 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — FIND THE MISSING COORDINATE</div><div class="example-body"><strong>For what value of $k$ are the points $A(1, 2)$, $B(3, k)$, $C(7, 14)$ collinear?</strong><br><br>$m_{AC} = (14 - 2)/(7 - 1) = 12/6 = 2$.<br>$B$ must lie on this line: $k = 2 \\cdot 3 + n$ where $n$ comes from $A$: $2 = 2 \\cdot 1 + n \\Rightarrow n = 0$.<br>So $k = 2 \\cdot 3 + 0 = 6$.<br><br>Answer: <strong>$k = 6$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — PERPENDICULAR BISECTOR</div><div class="example-body"><strong>Write the equation of the perpendicular bisector of the segment from $A(1, 1)$ to $B(5, 9)$.</strong><br><br>Midpoint: $M = ((1+5)/2, (1+9)/2) = (3, 5)$.<br>Slope of $AB$: $(9-1)/(5-1) = 2$.<br>Perpendicular slope: $-1/2$.<br>Through $M(3, 5)$: $y - 5 = -(1/2)(x - 3) \\Rightarrow y = -(1/2)x + 3/2 + 5 = -(1/2)x + 13/2$.<br><br>Answer: <strong>$y = -\\dfrac{1}{2}x + \\dfrac{13}{2}$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — APPLICATION: REFLECTION</div><div class="example-body"><strong>A laser beam follows the line $y = 2x + 1$ until it hits a horizontal mirror placed on the x-axis. Find the equation of the reflected beam.</strong><br><br>Reflection in the x-axis sends $y \\to -y$. The reflected line is $-y = 2x + 1 \\Rightarrow y = -2x - 1$.<br><br>Slope flipped from $+2$ to $-2$. The incident and reflected beams meet on the mirror at $(-1/2, 0)$. The mirror bisects the angle between them.<br><br>Answer: <strong>$y = -2x - 1$</strong>.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Lesson 79 will combine these ideas with the distance formula to compute the distance from a point to a line, and the distance between two parallel lines. The slope-based machinery you just learned underlies most of analytic geometry from here on.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Parallel: $m_1 = m_2$ (and intercepts differ)</li>
<li>Perpendicular: $m_1 \\cdot m_2 = -1$, or equivalently $m_2 = -1/m_1$</li>
<li>Angle: $\\tan\\alpha = \\left| \\dfrac{m_1 - m_2}{1 + m_1 m_2} \\right|$, gives the acute angle</li>
<li>Vertical lines: handle as special cases (two verticals parallel; vertical and horizontal perpendicular)</li>
<li>Symmetric slopes $\\pm m$: x-axis bisects the angle; tangent of angle $= 2m/(1 - m^2)$</li>
<li>Reflection in x-axis flips the slope sign; reflection in y-axis flips it too</li>
<li>Three points collinear iff their pairwise slopes match, or signed area is zero</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Aynı düzlemdeki iki doğru tam olarak üç şey yapabilir:</strong> üst üste binebilirler (ve tek bir doğru hâline gelirler), paralel olabilirler (ne kadar uzatırsan uzat hiç buluşmazlar) ya da tek bir noktada kesişerek dört açı oluşturabilirler. 77. ders tek bir doğrunun denklemini nasıl yazacağını öğretti. Bu ders, doğru <em>çiftlerinin</em> birbiriyle nasıl konuştuğunu öğretiyor — eğimleri ne zaman birlikte yürümelerini, ne zaman dik açıyla kesişmelerini zorlar ve hiçbir uç durum geçerli değilken aralarındaki açıyı hangi sayı kontrol eder.</p>

<p class="l-text">Tüm mekanizma, önceki dersten gelen <em>m</em> eğimine dayanır. İki eğim eşit — doğrular paraleldir. İki eğimin çarpımı &minus;1 — doğrular diktir. İki eğim farklı ama ikisi de değil — doğrular ara bir açıda buluşur ve tek bir tanjant formülü o açının ne olduğunu tam olarak söyler. Bu üç örüntüyü denklemlerden okuyabildiğinde analitik geometrinin yarısı rutin hâle gelir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Paralel doğruları eğimlerinden tanımayı: $m_1 = m_2$</li>
<li>Dik doğruları eğimlerinden tanımayı: $m_1 \\cdot m_2 = -1$, dikey-yatay özel durumu da dahil</li>
<li>Kesişen iki doğru arasındaki dar açıyı $\\tan\\alpha = \\left| \\dfrac{m_1 - m_2}{1 + m_1 m_2} \\right|$ ile hesaplamayı</li>
<li>Verilen bir noktadan geçen ve verilen bir doğruya paralel veya dik olan doğrunun denklemini yazmayı</li>
<li>Üç noktanın doğrusal olup olmadığını eğim ya da alan testiyle sınamayı</li>
<li>Kuralları ışık yansıması, navigasyon ve inşaata uygulamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. İki Doğrunun Üç Konfigürasyonu</h2>

<div class="calc-highlight"><strong>Düzlemde iki farklı doğru al.</strong> Ya hiç buluşmazlar (paralel) ya da tam olarak bir noktada buluşurlar. Üçüncü bir seçenek yok — düz bir düzlemde iki farklı doğru iki ayrı noktada buluşamaz (bu onları aynı doğru yapardı). Soru şu: hangi durumdayız ve buluşuyorlarsa hangi açıyla?</div>

<p class="l-text">77. dersten her dikey olmayan doğruyu $y = mx + n$ olarak yazabiliyorsun; burada $m$ eğim, $n$ y-kesme noktası. Dikey doğrunun eğimi yoktur (tanımsız eğim, $m = \\infty$) ve $x = c$ olarak yazılır. İki doğru verildiğinde, eğimleri arasındaki ilişki her şeyi belirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Paralel</div><div class="card-body">Aynı eğim, farklı kesme noktası. $m_1 = m_2$ ve $n_1 \\neq n_2$. Doğrular aynı adımda yürür ve hiç kesişmez.</div></div>
<div class="calc-card"><div class="card-title">Çakışık</div><div class="card-body">Aynı eğim, aynı kesme noktası. $m_1 = m_2$ ve $n_1 = n_2$. Aslında tek ve aynı doğru.</div></div>
<div class="calc-card"><div class="card-title">Kesişen</div><div class="card-body">Farklı eğimler. $m_1 \\neq m_2$. Tam olarak tek noktada buluşurlar ve dört açı (iki ters açı çifti) oluştururlar.</div></div>
</div>

<div class="l-note"><strong>Dikey doğrular tuzaktır.</strong> $x = 3$ doğrusunun tanımlı bir eğimi yok. "Eğimler eşit" ve "eğimler çarpımı &minus;1" kuralları doğrudan uygulanamaz — dikey doğruları özel durum olarak ele almak gerekir. İki dikey doğru her zaman paraleldir; bir dikey ve bir yatay doğru her zaman diktir. Bu durumları karşımıza çıktıkça not edeceğiz.</div>

<h2 class="lesson-title">2. Paralel Doğrular: Aynı Eğim</h2>

<div class="calc-highlight"><strong>İki dikey olmayan doğru paraleldir ancak ve ancak eğimleri eşitse.</strong> Bu, analitik geometrinin en temiz sonucudur. Yön için tek belirleyici eğimdir; y-kesme noktası doğruyu sadece yukarı veya aşağı kaydırır ama eğmez.</div>

<div class="calc-formula"><div class="formula-label">PARALELLİK KOŞULU</div><div class="formula-main">$$\\ell_1 \\parallel \\ell_2 \\;\\Longleftrightarrow\\; m_1 = m_2 \\;\\text{ ve }\\; n_1 \\neq n_2$$</div><div class="formula-sub">Eğimler aynı olur ve kesme noktaları da aynı olursa, doğrular paralel değil özdeştir (tek bir doğru).</div></div>

<p class="l-text"><strong>Bu neden geometrik olarak doğru?</strong> Eğim, doğrunun pozitif x-ekseni ile yaptığı açının tanjantıdır. Aynı eğimli iki doğru x-ekseni ile aynı açıyı yapar, yani aynı yöne bakar. Aynı yöne bakan iki doğru asla yakınlaşamaz — sonsuza dek aynı dik uzaklıkta kalır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$y = 3x + 1$ ve $y = 3x - 4$ doğruları paralel mi?<br><br>Eğimler: $m_1 = 3$, $m_2 = 3$. <strong>Eşit.</strong><br>Kesmeler: $n_1 = 1$, $n_2 = -4$. <strong>Farklı.</strong><br><br>Her iki koşul da sağlanıyor, doğrular <strong>paraleldir</strong>. Hiç kesişmezler; dikey olarak 5 birim aralıkla dururlar (kesme noktalarının farkı).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GENEL FORM</div><div class="example-body">$2x - y + 3 = 0$ ve $4x - 2y + 11 = 0$ paralel mi?<br><br>Her birinde $y$'yi çek:<br>Doğru 1: $y = 2x + 3$ &rarr; $m_1 = 2$, $n_1 = 3$.<br>Doğru 2: $2y = 4x + 11$ &rarr; $y = 2x + 11/2$ &rarr; $m_2 = 2$, $n_2 = 11/2$.<br><br>Eğimler eşit, kesmeler farklı &rarr; <strong>paralel</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DİKEY DOĞRULAR</div><div class="example-body">$x = 5$ ve $x = -2$ paralel mi?<br><br>İkisi de dikey doğru. Tanımlı eğimleri yok ama ikisi de dosdoğru yukarı-aşağı uzanıyor, yani <strong>paralel</strong>. (İki dikey doğru daima birbirine paraleldir.)</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$y = -\\dfrac{1}{2}x + 7$ doğrusuna paralel üç doğru yaz. (Eğimi $-1/2$ olan herhangi bir doğru olur, örneğin $y = -x/2$, $y = -x/2 + 100$, $y = -x/2 - 3$. Eğim aynı, kesme 7 dışında herhangi bir şey.)</div></div>

<h2 class="lesson-title">3. Dik Doğrular: Eğimlerin Negatif Tersi</h2>

<div class="calc-highlight"><strong>İki dikey olmayan doğru diktir ancak ve ancak eğimlerinin çarpımı &minus;1 ise.</strong> Eşdeğer olarak, her bir eğim diğerinin negatif tersidir: $m_2 = -1/m_1$. Bu, analitik geometrinin paralel kuralı kadar önemli ikinci büyük örüntüsüdür.</div>

<div class="calc-formula"><div class="formula-label">DİKLİK KOŞULU</div><div class="formula-main">$$\\ell_1 \\perp \\ell_2 \\;\\Longleftrightarrow\\; m_1 \\cdot m_2 \\;=\\; -1 \\quad\\Longleftrightarrow\\quad m_2 \\;=\\; -\\dfrac{1}{m_1}$$</div><div class="formula-sub">Dik doğrular sığ doğrularla eşleşir; pozitif eğim negatif eğimle eşleşir. Çarpım her zaman &minus;1'dir.</div></div>

<p class="l-text"><strong>Neden &minus;1?</strong> İşte tek paragrafta geometrik açıklaması. Eğimi $m_1 = \\tan\\theta$ olan bir doğru al (yani pozitif x-ekseni ile $\\theta$ açısı yapar). Buna dik bir doğru aynı eksenle $\\theta + 90^\\circ$ açısı yapar. Yani eğimi $\\tan(\\theta + 90^\\circ) = -\\cot\\theta = -1/\\tan\\theta = -1/m_1$ olur. İki eğimi çarp: $m_1 \\cdot (-1/m_1) = -1$. Kural tanjant için dönüş formülünden doğal olarak çıkar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğim örnekleri</div><div class="card-body">$m_1 = 2$ &rarr; dik eğim $-1/2$. $m_1 = -3/4$ &rarr; dik eğim $4/3$. $m_1 = 1$ &rarr; dik eğim $-1$.</div></div>
<div class="calc-card"><div class="card-title">İşaret değişimi</div><div class="card-body">$m_1$ pozitifse dik eğim negatif, ve tersi. Her zaman zıt işaretler (ikisi de sıfır veya tanımsız olduğu özel durum hariç, aşağıdaki).</div></div>
<div class="calc-card"><div class="card-title">Özel durum</div><div class="card-body">Yatay bir doğru ($m = 0$) dikey bir doğruya (eğimsiz) diktir. Çarpım kuralı uygulanmaz — ama geometri açık: $90^\\circ$'de buluşurlar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$y = 2x + 1$ ve $y = -\\dfrac{1}{2}x + 5$ doğruları dik mi?<br><br>Eğimler: $m_1 = 2$, $m_2 = -1/2$.<br>Çarpım: $m_1 \\cdot m_2 = 2 \\cdot (-1/2) = -1$. <strong>Evet</strong>, doğrular diktir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DİK EĞİMİ BUL</div><div class="example-body">Eğimi $m = 3/5$ olan bir doğruya dik olan doğrunun eğimi nedir?<br><br>$3/5$'in negatif tersi $-5/3$. Kontrol: $(3/5)(-5/3) = -15/15 = -1$. <strong>Doğru.</strong></div></div>

<div class="l-note"><strong>Kaçınılması gereken bir tuzak.</strong> Öğrenciler genellikle işareti değiştirmeden ters çevirir ve $-5/3$ yerine $5/3$ bulur. O zaman $(3/5)(5/3) = +1$ olur, &minus;1 değil. İşaret değişimi şarttır. Her zaman kontrol et: çarpım &minus;1'e eşit olmalı, asla +1'e değil.</div>

<h2 class="lesson-title">4. İki Doğru Arasındaki Açı</h2>

<div class="calc-highlight"><strong>İki doğru ne paralel ne de dik açıyla buluşmuyorsa, belirli bir açı oluştururlar.</strong> Yalnızca iki eğimi kullanan tek bir formül o açının tanjantını verir. Bu dersin ana formülüdür.</div>

<div class="calc-formula"><div class="formula-label">İKİ DOĞRU ARASINDAKİ AÇI</div><div class="formula-main">$$\\tan\\alpha \\;=\\; \\left|\\, \\dfrac{m_1 - m_2}{1 + m_1 m_2} \\,\\right|$$</div><div class="formula-sub">$\\alpha$ doğrular arasındaki dar açıdır (oluşturdukları iki ters açı çiftinden küçük olanı). Mutlak değer, cevabı dar açı (0 ile 90&deg; arası) olmaya zorlar.</div></div>

<p class="l-text"><strong>Türetilişin kısa özeti.</strong> İki doğru pozitif x-ekseni ile $\\theta_1$ ve $\\theta_2$ açılarını yapsın, yani $m_1 = \\tan\\theta_1$ ve $m_2 = \\tan\\theta_2$. Aralarındaki açı $\\alpha = \\theta_1 - \\theta_2$'dir (işarete kadar). Trigonometriden tanjantın çıkarma özdeşliği şu sonucu verir:</p>

<div class="calc-formula"><div class="formula-label">TANJANT ÇIKARMA İLE TÜRETME</div><div class="formula-main">$$\\tan(\\theta_1 - \\theta_2) \\;=\\; \\dfrac{\\tan\\theta_1 - \\tan\\theta_2}{1 + \\tan\\theta_1 \\tan\\theta_2} \\;=\\; \\dfrac{m_1 - m_2}{1 + m_1 m_2}$$</div><div class="formula-sub">Mutlak değer almak dar açıyı seçer. Geniş açı $180^\\circ - \\alpha$'dır.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DAR AÇI (0 ile 90&deg;)</div><div class="compare-item">Formülü mutlak değerle kullan</div><div class="compare-item">$\\tan\\alpha \\geq 0$ her zaman</div><div class="compare-item">"İki doğru arasındaki açı" sorusunun standart cevabı</div><div class="compare-item">Örnek: $\\tan\\alpha = 1 \\Rightarrow \\alpha = 45^\\circ$</div></div><div class="compare-col"><div class="compare-title">GENİŞ AÇI (90 ile 180&deg;)</div><div class="compare-item">İşareti takip etmek için mutlak değeri kaldır</div><div class="compare-item">Geniş çift istenirse $\\tan\\alpha < 0$</div><div class="compare-item">Dar açı + $180^\\circ$</div><div class="compare-item">Toplamları $180^\\circ$'dir (bütünler)</div></div></div>

<p class="l-text"><strong>Bu formülün yuttuğu iki özel durum.</strong> $m_1 = m_2$ olduğunda (paralel) pay 0 olur, yani $\\tan\\alpha = 0$ ve $\\alpha = 0$. $1 + m_1 m_2 = 0$ olduğunda (yani $m_1 m_2 = -1$, dik) payda 0 olur, yani $\\tan\\alpha$ tanımsızdır — bu da tam olarak $\\alpha = 90^\\circ$'de olur (tanjantın orada dikey asimptotu vardır). Formül paralel ve dik kuralları ile tutarlıdır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$y = 2x + 1$ ve $y = -x + 3$ arasındaki dar açıyı bul.<br><br>$m_1 = 2$, $m_2 = -1$.<br><br>$\\tan\\alpha = \\left| \\dfrac{2 - (-1)}{1 + (2)(-1)} \\right| = \\left| \\dfrac{3}{1 - 2} \\right| = \\left| \\dfrac{3}{-1} \\right| = 3$.<br><br>Yani $\\alpha = \\arctan(3) \\approx \\mathbf{71.57^\\circ}$. Doğrular arasındaki geniş açı $180^\\circ - 71.57^\\circ \\approx 108.43^\\circ$'dir.</div></div>

<div class="calc-graph"><div id="plot-l78-angle-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> çözümlü örnekten iki doğru ($y = 2x + 1$ mavi, $y = -x + 3$ kırmızı) $(2/3, 7/3)$ noktasında kesişiyor. Aralarındaki dar açı $\\alpha \\approx 71.57^\\circ$ kesişimde işaretlenmiş. Bu resmi cevabı görsel olarak doğrulamak için kullan — dar açı net olarak 60&deg; ile 90&deg; arasında.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y1=[];var y2=[];for(var i=-30;i<=50;i++){var xv=i/10;xs.push(xv);y1.push(2*xv+1);y2.push(-xv+3);}
var l1={x:xs,y:y1,mode:'lines',name:'y = 2x + 1',line:{color:'#3b82f6',width:3}};
var l2={x:xs,y:y2,mode:'lines',name:'y = -x + 3',line:{color:'#ef4444',width:3}};
var ix=2/3,iy=7/3;
var pt={x:[ix],y:[iy],mode:'markers+text',name:'kesişim',marker:{color:'#f59e0b',size:10},text:['(2/3, 7/3)'],textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var arcX=[];var arcY=[];var aStart=Math.atan2(-1,1);var aEnd=Math.atan2(2,1);for(var j=0;j<=40;j++){var a=aStart+(aEnd-aStart)*j/40;arcX.push(ix+0.55*Math.cos(a));arcY.push(iy+0.55*Math.sin(a));}
var arc={x:arcX,y:arcY,mode:'lines',name:'α ≈ 71.57°',line:{color:'#10b981',width:2.5,dash:'dot'}};
var lab={x:[ix+0.85],y:[iy+0.45],mode:'text',name:'açı etiketi',text:['α'],textfont:{color:'#10b981',size:18},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l78-angle-tr',[l1,l2,arc,pt,lab],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Özel Açılar ve Simetriler</h2>

<div class="calc-highlight"><strong>Üç örüntü tekrar tekrar karşına çıkar.</strong> Paralel doğrular ($\\alpha = 0$). Dik doğrular ($\\alpha = 90^\\circ$). Ve simetrik durum: eğimleri büyüklük olarak eşit ama işaretçe zıt olan iki doğru, yani $m_1 = m$ ve $m_2 = -m$. Bunlar optikte (yansıma), geometride (açıortay) ve birçok olimpiyat probleminde belirir.</div>

<p class="l-text">Simetrik durumu inceleyelim. $m_1 = m$ ve $m_2 = -m$ ise</p>

<div class="calc-formula"><div class="formula-label">SİMETRİK EĞİMLER</div><div class="formula-main">$$\\tan\\alpha \\;=\\; \\left| \\dfrac{m - (-m)}{1 + m \\cdot (-m)} \\right| \\;=\\; \\left| \\dfrac{2m}{1 - m^2} \\right|$$</div><div class="formula-sub">Bu, tanjant için çift-açı formülüdür. $m = \\tan\\theta$ ise $\\alpha = 2\\theta$ olur — doğrular x-ekseninin iki yanında eşit açılar yapar.</div></div>

<p class="l-text">Geometrik anlam: x-ekseni iki doğrunun açıortayıdır. Yatay aynadan yansıyan ışık, uçurtmanın iki köşegeni, ikizkenar üçgenin yüksekliğinin iki yanındaki kenarlar — hepsi bu simetrik konfigürasyonun örnekleridir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SİMETRİK DOĞRULAR</div><div class="example-body">$y = x$ ve $y = -x$ arasındaki açıyı bul.<br><br>$m = 1$ ile simetrik durum. Yani $\\tan\\alpha = |2(1)/(1 - 1^2)| = |2/0| =$ tanımsız, bu da $\\alpha = 90^\\circ$ olduğunun işaretidir.<br><br>$y = x$ ve $y = -x$ doğruları diktir. Bu, $m_1 m_2 = (1)(-1) = -1$ olduğundan da nettir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SIĞ SİMETRİK DOĞRULAR</div><div class="example-body">$y = x/2$ ve $y = -x/2$ arasındaki açıyı bul.<br><br>$m = 1/2$. $\\tan\\alpha = |2 \\cdot (1/2) / (1 - 1/4)| = |1 / (3/4)| = 4/3$.<br><br>Yani $\\alpha = \\arctan(4/3) \\approx \\mathbf{53.13^\\circ}$. İki doğru birbirleriyle yaklaşık 53&deg;'lik bir dar açı yapar (ve x-ekseni ile tek tek 26.57&deg; açı yapar).</div></div>

<h2 class="lesson-title">6. Çözümlü Örnek: Bir Noktadan Geçen Paralel Doğru</h2>

<div class="calc-highlight"><strong>Standart problem.</strong> Bir $\\ell$ doğrusu ve onun üzerinde olmayan bir $P$ noktası verilsin. $P$'den geçen ve $\\ell$'ye paralel olan doğrunun denklemini yaz. Tam olarak böyle tek bir doğru vardır.</div>

<p class="l-text"><strong>Yöntem.</strong> $\\ell$'nin eğimi $m$'yi denkleminden al. Yeni doğrunun eğimi de $m$ olur. $P = (x_0, y_0)$ ile noktasal-eğim formu $y - y_0 = m(x - x_0)$'ı kullan.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>$(1, 2)$'den geçen ve $y = 3x + 1$'e paralel olan doğrunun denklemini yaz.</strong><br><br><strong>Adım 1.</strong> Verilen doğrunun eğimi: $m = 3$.<br><strong>Adım 2.</strong> Paralel doğru aynı eğimi paylaşır: $m = 3$.<br><strong>Adım 3.</strong> $(1, 2)$'den noktasal-eğim formu:<br>$y - 2 = 3(x - 1)$<br>$y = 3x - 3 + 2 = 3x - 1$<br><br>Cevap: <strong>$y = 3x - 1$</strong>. Kontrol: $x = 1$ için $y = 3 - 1 = 2$. Doğru $(1, 2)$'den geçiyor. Eğim 3, orijinaliyle aynı. <strong>Doğru.</strong></div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GENEL FORM GİRDİSİ</div><div class="example-body"><strong>$(0, -4)$'ten geçen ve $2x + 3y - 12 = 0$'a paralel olan doğrunun denklemini yaz.</strong><br><br><strong>Adım 1.</strong> $y$'yi çek: $3y = -2x + 12 \\Rightarrow y = -\\dfrac{2}{3}x + 4$. Yani $m = -2/3$.<br><strong>Adım 2.</strong> Yeni doğru: $m = -2/3$, $(0, -4)$'ten geçiyor.<br><strong>Adım 3.</strong> $y - (-4) = -\\dfrac{2}{3}(x - 0)$<br>$y = -\\dfrac{2}{3}x - 4$<br><br>Cevap: <strong>$y = -\\dfrac{2}{3}x - 4$</strong>, ya da eşdeğer olarak $2x + 3y + 12 = 0$.</div></div>

<h2 class="lesson-title">7. Çözümlü Örnek: Bir Noktadan Geçen Dik Doğru</h2>

<div class="calc-highlight"><strong>Standart problem, öncekinin ikizi.</strong> Bir $\\ell$ doğrusu ve bir $P$ noktası verilsin. $P$'den geçen ve $\\ell$'ye dik olan doğrunun denklemini yaz. Tam olarak böyle tek bir doğru vardır.</div>

<p class="l-text"><strong>Yöntem.</strong> $\\ell$'nin eğimi $m$'yi al. Yeni doğrunun eğimi $-1/m$ (negatif ters). $P$'den noktasal-eğim formunu kullan.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>$(3, -1)$'den geçen ve $2x - y + 4 = 0$'a dik olan doğrunun denklemini yaz.</strong><br><br><strong>Adım 1.</strong> $y$'yi çek: $-y = -2x - 4 \\Rightarrow y = 2x + 4$. Eğim: $m = 2$.<br><strong>Adım 2.</strong> Dik eğim: $-1/2$.<br><strong>Adım 3.</strong> $(3, -1)$'den noktasal-eğim formu:<br>$y - (-1) = -\\dfrac{1}{2}(x - 3)$<br>$y + 1 = -\\dfrac{1}{2}x + \\dfrac{3}{2}$<br>$y = -\\dfrac{1}{2}x + \\dfrac{3}{2} - 1 = -\\dfrac{1}{2}x + \\dfrac{1}{2}$<br><br>Cevap: <strong>$y = -\\dfrac{1}{2}x + \\dfrac{1}{2}$</strong>, ya da eşdeğer olarak $x + 2y - 1 = 0$.<br><br>Kontrol: $x = 3$ için $y = -3/2 + 1/2 = -1$. <strong>$(3, -1)$'den geçiyor.</strong> Eğim $-1/2$ &times; orijinal eğim $2 = -1$. <strong>Dik.</strong></div></div>

<div class="calc-graph"><div id="plot-l78-parperp-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki paralel doğru (eğim $+2$, mavi) ve iki dik doğru (aynı mavi doğru ve eğimi $-1/2$ olan yeşil bir doğru). Paralel çift hiç kesişmez; dik çift temiz bir dik açıyla buluşur. Her iki ilişki de tek bir sayıdan gelir — eğim.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var p1=[];var p2=[];var per=[];for(var i=-40;i<=40;i++){var xv=i/10;xs.push(xv);p1.push(2*xv+1);p2.push(2*xv-3);per.push(-0.5*xv+1);}
var l1={x:xs,y:p1,mode:'lines',name:'y = 2x + 1',line:{color:'#3b82f6',width:3}};
var l2={x:xs,y:p2,mode:'lines',name:'y = 2x - 3 (paralel)',line:{color:'#60a5fa',width:3,dash:'dash'}};
var l3={x:xs,y:per,mode:'lines',name:'y = -x/2 + 1 (dik)',line:{color:'#10b981',width:3}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l78-parperp-tr',[l1,l2,l3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Bir Doğrunun Başka Bir Doğruya Göre Yansıması</h2>

<div class="calc-highlight"><strong>Bir $\\ell_1$ doğrusunu bir $\\ell_m$ ayna-doğrusuna göre yansıtırsan, yeni bir $\\ell_1'$ doğrusu elde edersin.</strong> Ayna doğrusu $\\ell_1$ ile $\\ell_1'$ arasındaki açıyı ortadan ikiye böler — bu yansımanın tanımıdır. Geometrik olarak: $\\ell_1$ üzerindeki her nokta $\\ell_m$'ye göre ayna görüntüsüne gider ve görüntü noktaları $\\ell_1'$'yü oluşturur.</div>

<p class="l-text">$\\ell_1$, $\\ell_m$ ile bir yanda $\\theta$ açısı yapıyorsa, $\\ell_1'$ diğer yanda $\\theta$ açısı yapar. Yani $\\ell_1$ ile $\\ell_1'$ arasındaki açı $2\\theta$ olur. Bu tam olarak 5. bölümdeki simetrik eğim durumudur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — X-EKSENİNDE YANSIMA</div><div class="example-body">$y = 2x + 3$ doğrusunu x-eksenine göre yansıt. Yeni doğru nedir?<br><br>X-ekseninde yansıma $(x, y)$'yi $(x, -y)$'ye gönderir. $y$ yerine $-y$ koy:<br>$-y = 2x + 3 \\Rightarrow y = -2x - 3$.<br><br>Cevap: $y = -2x - 3$. Eğim $+2$'den $-2$'ye döndü (simetrik), kesme $+3$'ten $-3$'e döndü.</div></div>

<div class="calc-graph"><div id="plot-l78-reflect-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = 2x + 3$ doğrusu (mavi) ve x-eksenine göre yansıması $y = -2x - 3$ (kırmızı). İki doğrunun eğimleri birbirinin negatifi ve x-ekseni (kesik beyaz) aralarındaki açıyı ortadan ikiye böler. Kesişim noktası ayna doğrusunun üstünde, $x = -3/2$'de.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ya=[];var yb=[];for(var i=-40;i<=20;i++){var xv=i/10;xs.push(xv);ya.push(2*xv+3);yb.push(-2*xv-3);}
var orig={x:xs,y:ya,mode:'lines',name:'y = 2x + 3',line:{color:'#3b82f6',width:3}};
var refl={x:xs,y:yb,mode:'lines',name:"y = -2x - 3 (yansıma)",line:{color:'#ef4444',width:3}};
var mir={x:[-5,5],y:[0,0],mode:'lines',name:'x-ekseni (ayna)',line:{color:'rgba(255,255,255,0.55)',width:2,dash:'dash'}};
var ip={x:[-1.5],y:[0],mode:'markers+text',name:'kesişim',marker:{color:'#f59e0b',size:10},text:['(-3/2, 0)'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-4,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l78-reflect-tr',[orig,refl,mir,ip],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Doğrusallık: Üç Nokta Bir Doğrunun Üstünde mi?</h2>

<div class="calc-highlight"><strong>Üç nokta tek bir doğru üzerindeyse <em>doğrusaldır</em>.</strong> İki basit test: ya çiftler arasındaki eğimleri hesaplayıp eşit olup olmadıklarını kontrol et ya da oluşturacakları üçgenin işaretli alanını hesaplayıp sıfıra eşit olup olmadığını kontrol et. Her iki yöntem güvenilirdir; hangisi daha hızlı geliyorsa onu seç.</div>

<div class="calc-formula"><div class="formula-label">EĞİMLERLE DOĞRUSALLIK</div><div class="formula-main">$$\\text{Eğim}(A,B) \\;=\\; \\text{Eğim}(B,C) \\;\\Longleftrightarrow\\; A,B,C \\text{ doğrusaldır}$$</div><div class="formula-sub">$m_{AB}$ ve $m_{BC}$'yi hesaplayıp eşitliği kontrol etmek yeterlidir. (Üçüncü çift $m_{AC}$ de otomatik olarak uyar.)</div></div>

<div class="calc-formula"><div class="formula-label">ALAN İLE DOĞRUSALLIK</div><div class="formula-main">$$\\text{Alan} \\;=\\; \\dfrac{1}{2} \\left| x_A(y_B - y_C) + x_B(y_C - y_A) + x_C(y_A - y_B) \\right| \\;=\\; 0$$</div><div class="formula-sub">Üç nokta sıfır alanlı dejenere bir üçgen oluşturuyorsa, aynı doğru üzerindedirler.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A(1, 2)$, $B(3, 6)$, $C(5, 10)$ doğrusal mı?<br><br>$m_{AB} = (6 - 2)/(3 - 1) = 4/2 = 2$.<br>$m_{BC} = (10 - 6)/(5 - 3) = 4/2 = 2$.<br><br>Eğimler eşit &rarr; <strong>doğrusal</strong>. (Ortak doğru $y = 2x$.)</div></div>

<h2 class="lesson-title">10. Uygulamalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Işık yansıması</div><div class="card-body">Bir ışık ışını aynaya çarpar ve diğer tarafta eşit açıyla seker. Gelen ve yansıyan ışınlar aynanın normaline göre simetriktir — tam olarak 5. bölümdeki simetrik-eğim durumudur.</div></div>
<div class="calc-card"><div class="card-title">Navigasyon</div><div class="card-body">Bir enlem paralelinde doğuya giden bir gemi ile bir boylam meridyeninde kuzeye giden bir gemi birbirine dik rotalarda ilerler. Rota düzeltmeleri çoğu zaman bir referans yöne paralel veya dik doğrular bulmaya indirgenir.</div></div>
<div class="calc-card"><div class="card-title">İnşaat</div><div class="card-body">Bir binanın duvarları dik açıyla buluşur, döşeme kirişleri birbirine paralel uzanır, çatı mertekleri hesaplanmış açılarda kesişir. Mimarlar her projede dik ve paralel doğru denklemleri kullanır.</div></div>
</div>

<p class="l-text"><strong>Bir örnek daha: geliş açısı yansıma açısına eşittir.</strong> Düz bir duvara fırlatılan top, gelen yolu ile giden yolu duvarla eşit açılar yapacak şekilde seker. Duvarın eğimi $m_w$ ve gelen yolun eğimi $m_i$ ise, giden yolun eğimi $m_o$ duvarın iki yol arasındaki açıyı ortalayacak şekilde seçilir. Bilardonun, optiğin ve akustiğin geometrik temeli budur.</p>

<h2 class="lesson-title">11. Sık Yapılan Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğim işareti</div><div class="card-body">Dik eğimde eksi işaretini unutmak. $m = 2/3$ için dik eğim $-3/2$'dir, $3/2$ değil. Çarpım &minus;1'e eşit olmalı.</div></div>
<div class="calc-card"><div class="card-title">Dikey doğrular</div><div class="card-body">Dikey bir doğruya $m_1 m_2 = -1$ uygulamaya çalışmak. Dikey doğrunun eğimi yok — özel durum olarak ele al. Bir dikey ve bir yatay doğru dik olsa da çarpım kuralı resmî olarak geçerli değildir.</div></div>
<div class="calc-card"><div class="card-title">Dar veya geniş</div><div class="card-body">Açı formülünü mutlak değersiz okuyup negatif tanjantı "açı" olarak rapor etmek. Mutlak değerli formül her zaman dar açıyı verir. Geniş eşi $180^\\circ - \\alpha$'dır.</div></div>
<div class="calc-card"><div class="card-title">Aynı eğim, aynı doğru</div><div class="card-body">Aslında aynı doğru olan iki ifadeye paralel demek. Hem eğimi <em>hem de</em> kesmeyi kontrol et. Eşit eğim + eşit kesme tek bir doğru demektir, paralel çift değil.</div></div>
</div>

<h2 class="lesson-title">12. Pratik Problemleri</h2>

<p class="l-text">Temel tanımadan çok adımlı kuruluma uzanan sekiz problem. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — İLİŞKİYİ BELİRLE</div><div class="example-body"><strong>$y = 4x - 2$ ve $y = -\\dfrac{1}{4}x + 5$ doğruları paralel mi, dik mi, hiçbiri mi?</strong><br><br>$m_1 = 4$, $m_2 = -1/4$. Çarpım: $4 \\cdot (-1/4) = -1$. <strong>Dik.</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — NOKTADAN GEÇEN PARALEL</div><div class="example-body"><strong>$(2, -3)$'ten geçen ve $y = -\\dfrac{1}{2}x + 7$'ye paralel olan doğrunun denklemini yaz.</strong><br><br>Eğim $m = -1/2$.<br>$y - (-3) = -\\dfrac{1}{2}(x - 2)$<br>$y + 3 = -\\dfrac{1}{2}x + 1$<br>$y = -\\dfrac{1}{2}x - 2$.<br><br>Cevap: <strong>$y = -\\dfrac{1}{2}x - 2$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — NOKTADAN GEÇEN DİK</div><div class="example-body"><strong>$(-2, 4)$'ten geçen ve $y = \\dfrac{3}{4}x - 1$'e dik olan doğrunun denklemini yaz.</strong><br><br>Orijinal eğim $3/4$. Dik eğim: $-4/3$.<br>$y - 4 = -\\dfrac{4}{3}(x - (-2)) = -\\dfrac{4}{3}(x + 2)$<br>$y = -\\dfrac{4}{3}x - \\dfrac{8}{3} + 4 = -\\dfrac{4}{3}x + \\dfrac{4}{3}$.<br><br>Cevap: <strong>$y = -\\dfrac{4}{3}x + \\dfrac{4}{3}$</strong>, ya da $4x + 3y - 4 = 0$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — İKİ DOĞRU ARASINDAKİ AÇI</div><div class="example-body"><strong>$y = x + 2$ ve $y = 3x - 1$ arasındaki dar açıyı bul.</strong><br><br>$m_1 = 1$, $m_2 = 3$. $\\tan\\alpha = |(1 - 3)/(1 + 3)| = |-2/4| = 1/2$.<br><br>$\\alpha = \\arctan(1/2) \\approx \\mathbf{26.57^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — DOĞRUSALLIK</div><div class="example-body"><strong>$A(0, 1)$, $B(2, 5)$, $C(5, 11)$ noktaları doğrusal mı?</strong><br><br>$m_{AB} = (5-1)/(2-0) = 2$.<br>$m_{BC} = (11-5)/(5-2) = 6/3 = 2$.<br><br>Eğimler eşit &rarr; <strong>evet, doğrusal</strong>. Ortak doğru $y = 2x + 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — EKSİK KOORDİNAT</div><div class="example-body"><strong>$A(1, 2)$, $B(3, k)$, $C(7, 14)$ noktalarının doğrusal olması için $k$ kaç olmalı?</strong><br><br>$m_{AC} = (14 - 2)/(7 - 1) = 12/6 = 2$.<br>$B$ bu doğru üzerinde olmalı: $A$'dan gelen $n$ ile $k = 2 \\cdot 3 + n$: $2 = 2 \\cdot 1 + n \\Rightarrow n = 0$.<br>Yani $k = 2 \\cdot 3 + 0 = 6$.<br><br>Cevap: <strong>$k = 6$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — DİK ORTA DOĞRU</div><div class="example-body"><strong>$A(1, 1)$'den $B(5, 9)$'a olan parça için dik orta doğrunun denklemini yaz.</strong><br><br>Orta nokta: $M = ((1+5)/2, (1+9)/2) = (3, 5)$.<br>$AB$'nin eğimi: $(9-1)/(5-1) = 2$.<br>Dik eğim: $-1/2$.<br>$M(3, 5)$'ten: $y - 5 = -(1/2)(x - 3) \\Rightarrow y = -(1/2)x + 3/2 + 5 = -(1/2)x + 13/2$.<br><br>Cevap: <strong>$y = -\\dfrac{1}{2}x + \\dfrac{13}{2}$</strong>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — UYGULAMA: YANSIMA</div><div class="example-body"><strong>Bir lazer ışını x-ekseni üzerine yerleştirilmiş yatay bir aynaya çarpana kadar $y = 2x + 1$ doğrusunu izler. Yansıyan ışının denklemini bul.</strong><br><br>X-eksenindeki yansıma $y \\to -y$'ye yollar. Yansıyan doğru $-y = 2x + 1 \\Rightarrow y = -2x - 1$.<br><br>Eğim $+2$'den $-2$'ye döner. Gelen ve yansıyan ışınlar aynanın üstünde $(-1/2, 0)$'da buluşur. Ayna aralarındaki açıyı ikiye böler.<br><br>Cevap: <strong>$y = -2x - 1$</strong>.</div></div>

<div class="l-note"><strong>İleride.</strong> 79. ders bu fikirleri uzaklık formülüyle birleştirip bir noktadan bir doğruya olan uzaklığı ve iki paralel doğru arasındaki uzaklığı hesaplayacak. Az önce öğrendiğin eğim-temelli mekanizma buradan itibaren analitik geometrinin büyük kısmının altında yatar.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Paralel: $m_1 = m_2$ (ve kesmeler farklı)</li>
<li>Dik: $m_1 \\cdot m_2 = -1$, ya da eşdeğer olarak $m_2 = -1/m_1$</li>
<li>Açı: $\\tan\\alpha = \\left| \\dfrac{m_1 - m_2}{1 + m_1 m_2} \\right|$, dar açıyı verir</li>
<li>Dikey doğrular: özel durum olarak ele al (iki dikey paralel; dikey ve yatay dik)</li>
<li>Simetrik eğimler $\\pm m$: x-ekseni açıortaydır; açının tanjantı $= 2m/(1 - m^2)$</li>
<li>X-eksenine göre yansıma eğimin işaretini çevirir; y-eksenine göre yansıma da öyle</li>
<li>Üç nokta ancak ve ancak ikili eğimleri eşitse ya da işaretli alan sıfırsa doğrusaldır</li>
</ul>
</div>`
};
