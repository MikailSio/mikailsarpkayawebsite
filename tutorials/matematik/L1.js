window.LISE_MAT_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Trigonometry begins with a question so simple a child can ask it:</strong> how do we measure an angle? You already know intuitively that some angles are "small" and some are "big" — the corner of this page is one kind of angle, the half-turn of a steering wheel is another. But to do mathematics with angles, we need numbers we can add, subtract, multiply, and plug into formulas. This first lesson builds those numbers from scratch and introduces the single most important picture in all of trigonometry: the <em>unit circle</em>.</p>

<p class="l-text">By the end of this lesson, you will be able to switch between degrees and radians without thinking, draw any angle in standard position, identify which quadrant its terminal side lands in, and find all angles coterminal with a given one. These skills sound mechanical — they are. But they are the bedrock on which sine, cosine, tangent, and every trigonometric identity in the next 38 lessons will sit. Spend an extra ten minutes here and you save an hour later.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define an angle geometrically as two rays sharing a common vertex (initial side, terminal side)</li>
<li>Distinguish positive (counter-clockwise) and negative (clockwise) angles and read off their sign</li>
<li>Work fluently with degree, minute, second notation and convert decimal degrees back and forth</li>
<li>Define a radian and convert between degrees and radians using the identity <em>180&deg; = &pi; rad</em></li>
<li>Place an angle in <em>standard position</em> on the unit circle and identify which of the four quadrants the terminal side falls into</li>
<li>Find all coterminal angles by adding or subtracting whole multiples of 360&deg; (or 2&pi;)</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is an Angle? The Geometric Definition</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> open a pair of scissors. The two blades start touching (zero angle). As you open them, the gap between the blades grows wider and wider. That gap is the angle. Close the scissors again and the angle shrinks back to zero. An angle is nothing more than the <em>amount of opening</em> between two straight edges that meet at a single point.</div>

<p class="l-text">Geometrically, an <strong>angle</strong> is formed by two <em>rays</em> (half-lines) that share a common endpoint. That shared endpoint is called the <strong>vertex</strong>. The two rays are called the <strong>sides</strong> of the angle. In trigonometry we go one step further and distinguish the two sides: one is the <em>initial side</em> (where the angle starts) and the other is the <em>terminal side</em> (where the angle ends). The angle itself is the amount of rotation that takes the initial side onto the terminal side.</p>

<div class="calc-formula"><div class="formula-label">ANGLE — DEFINITION</div><div class="formula-main">$$\\angle AOB \\;=\\; \\text{rotation from ray } \\overrightarrow{OA} \\text{ to ray } \\overrightarrow{OB}$$</div><div class="formula-sub">O is the vertex. OA is the initial side, OB is the terminal side. The angle is named with three letters: the middle one is always the vertex.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertex</div><div class="card-body">The point where the two rays meet. Often labelled O (origin) or the middle letter when the angle is named with three letters.</div></div>
<div class="calc-card"><div class="card-title">Initial side</div><div class="card-body">The ray we start from. By convention in trigonometry this is fixed along the positive x-axis.</div></div>
<div class="calc-card"><div class="card-title">Terminal side</div><div class="card-body">The ray we finish on. Its position relative to the initial side determines the size and sign of the angle.</div></div>
</div>

<p class="l-text"><strong>Measuring tools.</strong> In primary school you met the <em>protractor</em> — a half-disk marked from 0 to 180 degrees. You line up the straight edge with one ray, place the centre on the vertex, and read the number under the other ray. The number you read is the angle's <em>measure</em> in degrees. Trigonometry takes the same idea but allows angles bigger than 180&deg;, smaller than 0&deg;, and even bigger than a full turn of 360&deg;. To get there, we need a second tool: the unit circle. We will meet it in section 6.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Pick up a clock. The angle between the 12 and the 3 (measured at the centre) is a quarter-turn, which is 90&deg;. The angle between the 12 and the 6 is a half-turn, 180&deg;. The angle between the 12 and the 9, going clockwise the short way, is also a quarter-turn — but is it +90&deg; or &minus;90&deg;? The next section answers this.</div></div>

<h2 class="lesson-title">2. Positive and Negative Angles: The Sign Convention</h2>

<div class="calc-highlight"><strong>The rule, in one line:</strong> rotating <em>counter-clockwise</em> gives a <strong>positive</strong> angle. Rotating <em>clockwise</em> gives a <strong>negative</strong> angle. That is the entire convention. Memorise it now.</div>

<p class="l-text">Why this choice? It is a historical convention, but it agrees with the mathematics: the unit circle is traversed counter-clockwise as the angle grows, sine and cosine are defined by that motion, and every formula in the rest of the lesson sequence quietly assumes the same sense of rotation. Going the other way is fine; we just put a minus sign on the measure.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POSITIVE ANGLE</div><div class="compare-item">Rotation direction: <strong>counter-clockwise</strong> (CCW)</div><div class="compare-item">Sign: + (often omitted)</div><div class="compare-item">Example: +60&deg; opens upward from the positive x-axis</div><div class="compare-item">Think: the way the hands of a clock <em>do not</em> move</div></div><div class="compare-col"><div class="compare-title">NEGATIVE ANGLE</div><div class="compare-item">Rotation direction: <strong>clockwise</strong> (CW)</div><div class="compare-item">Sign: &minus;</div><div class="compare-item">Example: &minus;60&deg; opens downward from the positive x-axis</div><div class="compare-item">Think: the way the hands of a clock <em>do</em> move</div></div></div>

<p class="l-text">An important consequence: the angles +60&deg; and &minus;300&deg; finish in exactly the same place. The terminal side is identical. They are called <em>coterminal</em>, and we will study them carefully in section 9. For now just notice that this is possible because, geometrically, +60&deg; is "go CCW until you have swept 60 degrees" and &minus;300&deg; is "go CW until you have swept 300 degrees" — both paths end at the same ray.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Sketch</strong> the following three angles in standard position on the same diagram: +45&deg;, &minus;45&deg;, +315&deg;.<br><br>+45&deg; opens upward into the first quadrant (CCW, one-eighth of a full turn).<br>&minus;45&deg; opens downward into the fourth quadrant (CW, one-eighth of a full turn going the other way).<br>+315&deg; opens almost all the way around CCW and lands in the fourth quadrant — at the <em>same</em> ray as &minus;45&deg;.<br><br>Conclusion: <strong>&minus;45&deg; and +315&deg; are coterminal</strong>. The pair (+45&deg;, &minus;45&deg;) is a mirror reflection across the x-axis.</div></div>

<div class="calc-graph"><div id="plot-l1-signs-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same starting ray (positive x-axis) with three terminal sides drawn: +60&deg; (CCW, blue), &minus;60&deg; (CW, red), and the unit circle in the background as a reference. The arcs trace the rotation path so you can see the direction of motion, not just the final position.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var theta=[];var xc=[];var yc=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;theta.push(a);xc.push(Math.cos(a));yc.push(Math.sin(a));}
var ringEN={x:xc,y:yc,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.25)',width:1.4}};
var iniEN={x:[0,1],y:[0,0],mode:'lines',name:'initial side',line:{color:'#e8e8e8',width:3}};
var posRayX=Math.cos(Math.PI/3),posRayY=Math.sin(Math.PI/3);
var posEN={x:[0,posRayX],y:[0,posRayY],mode:'lines',name:'+60° terminal',line:{color:'#3b82f6',width:3}};
var negRayX=Math.cos(-Math.PI/3),negRayY=Math.sin(-Math.PI/3);
var negEN={x:[0,negRayX],y:[0,negRayY],mode:'lines',name:'−60° terminal',line:{color:'#ef4444',width:3}};
var arcPosX=[];var arcPosY=[];for(var j=0;j<=40;j++){var b=Math.PI/3*j/40;arcPosX.push(0.4*Math.cos(b));arcPosY.push(0.4*Math.sin(b));}
var arcNegX=[];var arcNegY=[];for(var j=0;j<=40;j++){var b=-Math.PI/3*j/40;arcNegX.push(0.55*Math.cos(b));arcNegY.push(0.55*Math.sin(b));}
var arcP={x:arcPosX,y:arcPosY,mode:'lines',name:'CCW (+)',line:{color:'#3b82f6',width:2,dash:'dot'}};
var arcN={x:arcNegX,y:arcNegY,mode:'lines',name:'CW (−)',line:{color:'#ef4444',width:2,dash:'dot'}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-signs-en',[ringEN,iniEN,posEN,negEN,arcP,arcN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>A common mistake:</strong> students write &minus;60&deg; as 60&deg; in some contexts (because "the angle between two rays is 60 degrees either way you look at it"). In trigonometry the sign carries information about <em>direction of rotation</em>, and dropping it gives wrong answers for sine, cosine, and tangent in the next lesson. Always keep the sign.</div>

<h2 class="lesson-title">3. Degree, Minute, Second: The Sexagesimal System</h2>

<div class="calc-highlight"><strong>The degree is the old unit, inherited from the Babylonians (~2000 BCE).</strong> They divided a full circle into 360 equal parts. Why 360? Because 360 is divisible by 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, and 180 — far more divisors than 100 or 1000, which makes it easy to split a circle into halves, thirds, quarters, sixths, eighths, etc. without fractions. We are still using their system 4000 years later.</div>

<p class="l-text">One full turn around a circle is exactly <strong>360&deg;</strong>. A half turn is 180&deg;. A quarter turn (a right angle, like the corner of a book) is 90&deg;. These three numbers — 360, 180, 90 — should be on the tip of your tongue immediately when you read an angle.</p>

<div class="calc-formula"><div class="formula-label">SUBDIVIDING A DEGREE</div><div class="formula-main">$$1^\\circ \\;=\\; 60' \\quad\\text{(minutes)} \\qquad 1' \\;=\\; 60'' \\quad\\text{(seconds)}$$</div><div class="formula-sub">A degree splits into 60 minutes, a minute splits into 60 seconds. Same system as time on a clock.</div></div>

<p class="l-text"><strong>Decimal conversion.</strong> To go from degrees-minutes-seconds (DMS) to a plain decimal degree, divide minutes by 60 and seconds by 3600, then add:</p>

<div class="calc-formula"><div class="formula-label">DMS &rarr; DECIMAL DEGREE</div><div class="formula-main">$$D^\\circ \\, M' \\, S'' \\;=\\; D + \\frac{M}{60} + \\frac{S}{3600} \\;\\;\\text{degrees}$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Convert <strong>32&deg; 15' 36''</strong> into a decimal degree.<br><br>$32 + \\dfrac{15}{60} + \\dfrac{36}{3600} = 32 + 0.25 + 0.01 = \\mathbf{32.26^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Convert <strong>47.4825&deg;</strong> back to DMS.<br><br>Whole part: <strong>47&deg;</strong>.<br>Fractional part: 0.4825&deg; &times; 60 = 28.95 &rarr; <strong>28'</strong>.<br>Remaining fractional minutes: 0.95' &times; 60 = 57 &rarr; <strong>57''</strong>.<br>Answer: <strong>47&deg; 28' 57''</strong>.</div></div>

<div class="l-note"><strong>Where DMS still matters:</strong> latitude and longitude on maps. Istanbul lies near 41&deg; 0' 49'' N, 28&deg; 58' 47'' E. A GPS reading you might see as 41.0136&deg;, 28.9797&deg; — the same coordinates in decimal form.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Without a calculator: is 12&deg; 30' the same as 12.5&deg;? (Yes: 30 minutes is half a degree, so the decimal is 12.5.) Is 12&deg; 5' the same as 12.5&deg;? (No: 5 minutes is only 5/60 = 0.083&deg;, so 12&deg; 5' = 12.083&deg;.)</div></div>

<h2 class="lesson-title">4. Radians: The Natural Angle Measure</h2>

<div class="calc-highlight"><strong>Degrees are convenient but arbitrary — there is nothing special about 360.</strong> The mathematician's preferred unit is the <em>radian</em>, defined purely from the geometry of a circle with no historical accidents. Once you switch to radians, every calculus formula involving angles becomes one symbol shorter, and every relation between arc length and angle becomes trivially simple.</div>

<p class="l-text">Here is the definition. Take any circle and pick its centre as the vertex of an angle. The angle <em>cuts out</em> an arc on the circle (a curved piece of the boundary). The <strong>radian measure</strong> of the angle is the ratio of the arc length to the radius:</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF A RADIAN</div><div class="formula-main">$$\\theta_{\\text{rad}} \\;=\\; \\frac{\\text{arc length}}{\\text{radius}} \\;=\\; \\frac{s}{r}$$</div><div class="formula-sub">A radian is a pure ratio (length divided by length), so it carries no units. We write "rad" only to remind ourselves what kind of quantity we are talking about.</div></div>

<p class="l-text">In words: <strong>one radian is the angle that cuts out an arc equal in length to the radius.</strong> Wrap a piece of string of length r around the rim of a circle of radius r — the angle the string subtends at the centre is exactly 1 radian.</p>

<p class="l-text">How big is a full turn in radians? A full turn cuts out the entire circumference, which has length $2\\pi r$. Divide by r and the radian measure is $2\\pi$. So:</p>

<div class="calc-formula"><div class="formula-label">THE BRIDGE BETWEEN DEGREES AND RADIANS</div><div class="formula-main">$$2\\pi \\text{ rad} \\;=\\; 360^\\circ \\qquad\\Longleftrightarrow\\qquad \\pi \\text{ rad} \\;=\\; 180^\\circ$$</div><div class="formula-sub">This is the single identity you must never forget. Every conversion in the lesson follows from it.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1 rad in degrees</div><div class="card-body">$1 \\text{ rad} = \\dfrac{180^\\circ}{\\pi} \\approx 57.2958^\\circ$. So one radian is "a little less than 60 degrees." Useful mental anchor.</div></div>
<div class="calc-card"><div class="card-title">1&deg; in radians</div><div class="card-body">$1^\\circ = \\dfrac{\\pi}{180} \\approx 0.01745 \\text{ rad}$. A degree is a small fraction of a radian.</div></div>
<div class="calc-card"><div class="card-title">Why mathematicians prefer radians</div><div class="card-body">All calculus formulas (derivative of sin, Taylor series, complex exponential) hold only if angles are in radians. Use degrees and they pick up ugly factors of &pi;/180.</div></div>
</div>

<div class="l-note"><strong>Subtle point on units:</strong> a radian is technically dimensionless. That is why $\\sin(\\theta)$ is a pure number when $\\theta$ is in radians, but you have to think of $\\sin(30^\\circ)$ as shorthand for $\\sin(\\pi/6)$. Inside trig functions, the natural unit is always the radian.</div>

<h2 class="lesson-title">5. Converting Between Degrees and Radians</h2>

<div class="calc-highlight"><strong>One identity, two directions.</strong> From $\\pi \\text{ rad} = 180^\\circ$ we get two conversion rules. To go from degrees to radians, multiply by $\\pi/180$. To go from radians to degrees, multiply by $180/\\pi$. Pick whichever direction you need; the formula does the rest.</div>

<div class="calc-formula"><div class="formula-label">CONVERSION RULES</div><div class="formula-main">$$\\theta_{\\text{rad}} \\;=\\; \\theta_{\\text{deg}} \\times \\frac{\\pi}{180} \\qquad\\qquad \\theta_{\\text{deg}} \\;=\\; \\theta_{\\text{rad}} \\times \\frac{180}{\\pi}$$</div><div class="formula-sub">Memorise both. They are the same identity rearranged.</div></div>

<p class="l-text"><strong>The seven angles every student must know by heart.</strong> These appear in virtually every trigonometry problem you will ever see:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Degrees</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Radians (exact)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Radians (decimal)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Geometry</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0&deg;</td><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">0.000</td><td style="padding:0.5rem 0.8rem">No rotation</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">30&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/6</td><td style="padding:0.5rem 0.8rem">0.524</td><td style="padding:0.5rem 0.8rem">One-twelfth of a turn</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">45&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/4</td><td style="padding:0.5rem 0.8rem">0.785</td><td style="padding:0.5rem 0.8rem">One-eighth of a turn</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">60&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/3</td><td style="padding:0.5rem 0.8rem">1.047</td><td style="padding:0.5rem 0.8rem">One-sixth of a turn</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">90&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/2</td><td style="padding:0.5rem 0.8rem">1.571</td><td style="padding:0.5rem 0.8rem">Quarter turn (right angle)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">180&deg;</td><td style="padding:0.5rem 0.8rem">&pi;</td><td style="padding:0.5rem 0.8rem">3.142</td><td style="padding:0.5rem 0.8rem">Half turn (straight line)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">270&deg;</td><td style="padding:0.5rem 0.8rem">3&pi;/2</td><td style="padding:0.5rem 0.8rem">4.712</td><td style="padding:0.5rem 0.8rem">Three-quarter turn</td></tr>
<tr><td style="padding:0.5rem 0.8rem">360&deg;</td><td style="padding:0.5rem 0.8rem">2&pi;</td><td style="padding:0.5rem 0.8rem">6.283</td><td style="padding:0.5rem 0.8rem">Full turn</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Convert <strong>120&deg;</strong> to radians.<br><br>$\\theta_{\\text{rad}} = 120 \\times \\dfrac{\\pi}{180} = \\dfrac{120\\pi}{180} = \\dfrac{2\\pi}{3}$.<br><br>So $120^\\circ = \\mathbf{\\dfrac{2\\pi}{3} \\text{ rad}} \\approx 2.094$ rad.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Convert <strong>$\\dfrac{5\\pi}{4}$ rad</strong> to degrees.<br><br>$\\theta_{\\text{deg}} = \\dfrac{5\\pi}{4} \\times \\dfrac{180}{\\pi} = \\dfrac{5 \\times 180}{4} = \\dfrac{900}{4} = \\mathbf{225^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Convert <strong>1 radian</strong> to degrees, accurate to two decimals.<br><br>$1 \\text{ rad} \\times \\dfrac{180}{\\pi} = \\dfrac{180}{3.14159...} \\approx \\mathbf{57.30^\\circ}$.<br><br>Hence "1 rad" sits a touch below 60&deg; — somewhere between the 45&deg; (&pi;/4) and 60&deg; (&pi;/3) lines.</div></div>

<div class="think-box"><div class="think-label">PATTERN TO MEMORISE</div><div class="think-body">Look at the table: all the "nice" angles (30, 45, 60, 90, 180, 270, 360) have radian forms that are <em>simple fractions of &pi;</em>. That is not a coincidence — these are exactly the angles that divide a circle into 12, 8, 6, 4, 2, 4/3, 1 parts. Whenever you see &pi;/6, &pi;/4, &pi;/3, &pi;/2, &pi;, 3&pi;/2, 2&pi; in a problem, instantly translate to 30, 45, 60, 90, 180, 270, 360.</div></div>

<h2 class="lesson-title">6. The Unit Circle</h2>

<div class="calc-highlight"><strong>The unit circle is the most useful diagram in trigonometry.</strong> It is a circle of radius 1 centred at the origin (0, 0). That is all. But every trig function, every identity, every angle, and every formula in the next 38 lessons sits on top of this one picture.</div>

<div class="calc-formula"><div class="formula-label">EQUATION OF THE UNIT CIRCLE</div><div class="formula-main">$$x^2 + y^2 \\;=\\; 1$$</div><div class="formula-sub">The set of all points (x, y) in the plane whose distance from the origin is exactly 1.</div></div>

<p class="l-text"><strong>Why radius 1?</strong> Two reasons. First, distances on the circle equal angle measures: the arc length from the positive x-axis to a point at angle $\\theta$ is exactly $\\theta$ (in radians). Second, every trig function becomes the coordinate of a point. If we walk counter-clockwise from the point (1, 0) along the rim of the unit circle by an arc length of $\\theta$, we land on a point whose coordinates are:</p>

<div class="calc-formula"><div class="formula-label">SINE AND COSINE FROM THE UNIT CIRCLE</div><div class="formula-main">$$P(\\theta) \\;=\\; (\\cos\\theta, \\, \\sin\\theta)$$</div><div class="formula-sub">The x-coordinate of a point on the unit circle is the cosine of the angle. The y-coordinate is the sine. This is the most important picture you will see all year.</div></div>

<p class="l-text">We will <em>derive</em> the trig functions properly in lesson 2. For now just absorb the picture: as $\\theta$ grows from 0 to $2\\pi$, the point $P$ moves once around the rim of the unit circle, and the pair $(\\cos\\theta, \\sin\\theta)$ is just its address.</p>

<div class="calc-graph"><div id="plot-l1-unit-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the unit circle with seven sample angles marked. The label at each tick is both the radian (top) and the degree (bottom) value, so you can train the conversion by eye. Notice the orientation: 0 (or 0&deg;) is to the right, &pi;/2 (90&deg;) is at the top, &pi; (180&deg;) is to the left, 3&pi;/2 (270&deg;) is at the bottom.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thA=[];var xA=[];var yA=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;thA.push(a);xA.push(Math.cos(a));yA.push(Math.sin(a));}
var ring={x:xA,y:yA,mode:'lines',name:'unit circle',line:{color:'#3b82f6',width:2.5}};
var axX={x:[-1.25,1.25],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1}};
var axY={x:[0,0],y:[-1.25,1.25],mode:'lines',name:'y-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var sampleAngs=[0,Math.PI/6,Math.PI/4,Math.PI/3,Math.PI/2,Math.PI,3*Math.PI/2];
var sampleLabs=['0','π/6','π/4','π/3','π/2','π','3π/2'];
var sampleDeg=['0°','30°','45°','60°','90°','180°','270°'];
var px=[];var py=[];var pt=[];for(var k=0;k<sampleAngs.length;k++){px.push(Math.cos(sampleAngs[k]));py.push(Math.sin(sampleAngs[k]));pt.push(sampleLabs[k]+'<br>'+sampleDeg[k]);}
var pts={x:px,y:py,mode:'markers+text',name:'sample angles',marker:{color:'#f59e0b',size:10},text:pt,textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var spokes={x:[],y:[],mode:'lines',name:'rays',line:{color:'rgba(245,158,11,0.3)',width:1,dash:'dot'}};
for(var m=0;m<sampleAngs.length;m++){spokes.x.push(0,Math.cos(sampleAngs[m]),null);spokes.y.push(0,Math.sin(sampleAngs[m]),null);}
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x = cos θ',range:[-1.4,1.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y = sin θ',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-unit-en',[ring,axX,axY,spokes,pts],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="geogebra-wrap" style="margin:1.5rem 0">
<iframe src="https://www.geogebra.org/material/iframe/id/qf8pjdpb/width/720/height/440/border/3b82f6/sfsb/false/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false" width="100%" height="440" frameborder="0" style="border-radius:8px;border:1px solid rgba(59,130,246,0.25)"></iframe>
<p class="caption" style="font-size:0.82rem;color:rgba(235,230,220,0.6);margin-top:0.5rem;text-align:center"><strong>Interactive:</strong> drag the slider in GeoGebra to change the angle. Watch the point (cos&theta;, sin&theta;) move around the unit circle, and see the radian-degree pair update live.</p>
</div>

<h2 class="lesson-title">7. Angles in Standard Position</h2>

<div class="calc-highlight"><strong>Standard position is a fixed reference frame.</strong> Once we agree on it, every angle has a unique unambiguous picture, and we can read off everything we need (which quadrant, sign of sine, sign of cosine) at a glance.</div>

<p class="l-text">An angle is in <strong>standard position</strong> if:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertex at the origin</div><div class="card-body">The point where the two rays meet sits exactly at (0, 0).</div></div>
<div class="calc-card"><div class="card-title">Initial side on the positive x-axis</div><div class="card-body">One ray points to the right along the line $y = 0$, $x \\geq 0$.</div></div>
<div class="calc-card"><div class="card-title">Terminal side determined by the angle</div><div class="card-body">The other ray is wherever the angle sends it, measured CCW for positive angles and CW for negative.</div></div>
</div>

<p class="l-text">Every angle you meet in a trigonometry problem from now on can be — and should be — drawn in standard position. The diagram tells you immediately what quadrant the terminal side lands in, which in turn tells you the signs of the trig functions of that angle.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Place $\\theta = 150^\\circ$ in standard position.<br><br>Start with the ray along the positive x-axis. Rotate CCW. 90&deg; brings you to the positive y-axis. Another 60&deg; (so you have swept 150&deg; total) puts the terminal side in the upper-left, in the second quadrant, leaning 30&deg; above the negative x-axis.<br><br>Convert to radians for practice: $150^\\circ = 150 \\cdot \\pi/180 = 5\\pi/6 \\text{ rad}$.</div></div>

<h2 class="lesson-title">8. The Four Quadrants and the Sign Rules</h2>

<div class="calc-highlight"><strong>The x- and y-axes split the plane into four quadrants.</strong> Numbered I, II, III, IV — counter-clockwise starting from the upper-right, following the same CCW convention as positive angles. Memorise the order: it is the only one that matches the angle sweep.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Quadrant</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Degree range</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Radian range</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">sign of cos &theta;</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">sign of sin &theta;</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">sign of tan &theta;</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>I</strong></td><td style="padding:0.5rem 0.8rem">0&deg; &ndash; 90&deg;</td><td style="padding:0.5rem 0.8rem">0 &ndash; &pi;/2</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>II</strong></td><td style="padding:0.5rem 0.8rem">90&deg; &ndash; 180&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/2 &ndash; &pi;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>III</strong></td><td style="padding:0.5rem 0.8rem">180&deg; &ndash; 270&deg;</td><td style="padding:0.5rem 0.8rem">&pi; &ndash; 3&pi;/2</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>IV</strong></td><td style="padding:0.5rem 0.8rem">270&deg; &ndash; 360&deg;</td><td style="padding:0.5rem 0.8rem">3&pi;/2 &ndash; 2&pi;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The "ASTC" mnemonic.</strong> Reading the table by which function is positive in each quadrant: <em>All</em> in I, <em>Sine</em> in II, <em>Tangent</em> in III, <em>Cosine</em> in IV. A common rhyme to remember the order CCW from quadrant I: <em>All Students Take Calculus</em>.</p>

<div class="calc-graph"><div id="plot-l1-quadrants-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the four quadrants with the ASTC labels in their canonical positions. Use this picture every time you need to remember which trig functions are positive where — far faster than memorising the table.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thQ=[];var xQ=[];var yQ=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;thQ.push(a);xQ.push(Math.cos(a));yQ.push(Math.sin(a));}
var ringQ={x:xQ,y:yQ,mode:'lines',name:'unit circle',line:{color:'rgba(59,130,246,0.6)',width:2}};
var ax={x:[-1.3,1.3],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ay={x:[0,0],y:[-1.3,1.3],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var labels={x:[0.65,-0.65,-0.65,0.65],y:[0.65,0.65,-0.65,-0.65],mode:'text',name:'ASTC',text:['<b>A</b>ll<br>(I)','<b>S</b>ine<br>(II)','<b>T</b>angent<br>(III)','<b>C</b>osine<br>(IV)'],textfont:{color:['#10b981','#3b82f6','#f59e0b','#ec4899'],size:14}};
var qLabels={x:[1.15,-1.15,-1.15,1.15],y:[1.15,1.15,-1.15,-1.15],mode:'text',name:'quadrant numbers',text:['I','II','III','IV'],textfont:{color:'rgba(255,255,255,0.6)',size:18},showlegend:false};
var layQ={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',title:'y'},margin:{t:30,r:30,b:50,l:50},showlegend:false};
Plotly.newPlot('plot-l1-quadrants-en',[ringQ,ax,ay,labels,qLabels],layQ,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">In which quadrant does the terminal side of $\\theta = 220^\\circ$ lie?<br><br>220&deg; is greater than 180&deg; (which is on the negative x-axis) and less than 270&deg; (which is on the negative y-axis). Therefore the terminal side is in <strong>quadrant III</strong>. By the table, $\\cos 220^\\circ < 0$, $\\sin 220^\\circ < 0$, $\\tan 220^\\circ > 0$.</div></div>

<h2 class="lesson-title">9. Coterminal Angles</h2>

<div class="calc-highlight"><strong>Two angles are coterminal if their terminal sides land on exactly the same ray.</strong> Equivalently: they differ by an integer multiple of a full turn (360&deg; or 2&pi; rad). One angle has infinitely many coterminal partners — just add or subtract any whole number of full turns.</div>

<div class="calc-formula"><div class="formula-label">COTERMINAL FORMULA</div><div class="formula-main">$$\\theta \\;\\text{ and }\\; \\theta + 360^\\circ \\cdot k \\quad (k \\in \\mathbb{Z}) \\;\\;\\text{are coterminal}$$</div><div class="formula-sub">In radians: $\\theta$ and $\\theta + 2\\pi k$ are coterminal. k can be any integer — positive, negative, or zero.</div></div>

<p class="l-text"><strong>The standard task:</strong> given some weird angle (say, 750&deg;), find the unique coterminal angle in the range $[0^\\circ, 360^\\circ)$. The method is to take the remainder when divided by 360.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find the angle in $[0^\\circ, 360^\\circ)$ coterminal with <strong>750&deg;</strong>.<br><br>750&deg; &divide; 360&deg; = 2 with remainder 30. So 750&deg; is two full turns plus 30&deg;.<br><br>$750^\\circ = 2 \\cdot 360^\\circ + 30^\\circ \\implies 750^\\circ$ is coterminal with $\\mathbf{30^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Find the positive coterminal angle of <strong>&minus;45&deg;</strong> in the range $[0^\\circ, 360^\\circ)$.<br><br>$-45^\\circ + 360^\\circ = \\mathbf{315^\\circ}$.<br><br>Check: 315&deg; sits 45&deg; below the positive x-axis in quadrant IV, exactly where the terminal side of &minus;45&deg; lands.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Find the angle in $[0, 2\\pi)$ coterminal with $\\dfrac{17\\pi}{4}$.<br><br>$\\dfrac{17\\pi}{4} = \\dfrac{16\\pi}{4} + \\dfrac{\\pi}{4} = 4\\pi + \\dfrac{\\pi}{4} = 2 \\cdot 2\\pi + \\dfrac{\\pi}{4}$.<br><br>So $\\dfrac{17\\pi}{4}$ is two full turns plus $\\pi/4$. The coterminal partner in $[0, 2\\pi)$ is $\\mathbf{\\dfrac{\\pi}{4}}$ (i.e. 45&deg;).</div></div>

<div class="calc-graph"><div id="plot-l1-coterm-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three coterminal angles drawn on top of each other: 30&deg; (one-twelfth turn CCW), 390&deg; (one full turn plus 30&deg;), and &minus;330&deg; (almost a full turn CW). All three end on the same terminal ray. The arcs trace each rotation path — same destination, different journeys.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thC=[];var xC=[];var yC=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;thC.push(a);xC.push(Math.cos(a));yC.push(Math.sin(a));}
var ringC={x:xC,y:yC,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.25)',width:1.4}};
var termRay={x:[0,Math.cos(Math.PI/6)],y:[0,Math.sin(Math.PI/6)],mode:'lines',name:'shared terminal ray',line:{color:'#f59e0b',width:3.2}};
var iniC={x:[0,1],y:[0,0],mode:'lines',name:'initial side',line:{color:'#e8e8e8',width:2.5}};
var arc1X=[];var arc1Y=[];for(var j=0;j<=30;j++){var b=Math.PI/6*j/30;arc1X.push(0.35*Math.cos(b));arc1Y.push(0.35*Math.sin(b));}
var arc2X=[];var arc2Y=[];for(var j=0;j<=130;j++){var b=(2*Math.PI+Math.PI/6)*j/130;arc2X.push(0.55*Math.cos(b));arc2Y.push(0.55*Math.sin(b));}
var arc3X=[];var arc3Y=[];for(var j=0;j<=110;j++){var b=-(2*Math.PI-Math.PI/6)*j/110;arc3X.push(0.75*Math.cos(b));arc3Y.push(0.75*Math.sin(b));}
var a1={x:arc1X,y:arc1Y,mode:'lines',name:'+30°',line:{color:'#3b82f6',width:2.2}};
var a2={x:arc2X,y:arc2Y,mode:'lines',name:'+390°',line:{color:'#10b981',width:2.2,dash:'dot'}};
var a3={x:arc3X,y:arc3Y,mode:'lines',name:'−330°',line:{color:'#ef4444',width:2.2,dash:'dash'}};
var layC={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-coterm-en',[ringC,iniC,termRay,a1,a2,a3],layC,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Write down five different angles that are coterminal with 60&deg;. (Sample answers: 420&deg;, 780&deg;, &minus;300&deg;, &minus;660&deg;, 1140&deg;. Each one differs from 60&deg; by a multiple of 360&deg;.)</div></div>

<h2 class="lesson-title">10. Worked Problems</h2>

<p class="l-text">A short set of practice problems pulling together everything in the lesson. Try each one yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — DEGREE TO RADIAN</div><div class="example-body"><strong>Convert 270&deg; to radians.</strong><br><br>Use $\\theta_{\\text{rad}} = \\theta_{\\text{deg}} \\cdot \\pi/180$.<br><br>$270 \\cdot \\dfrac{\\pi}{180} = \\dfrac{270\\pi}{180} = \\dfrac{3\\pi}{2}$.<br><br>Answer: <strong>$\\dfrac{3\\pi}{2}$ rad</strong> (about 4.712 rad). This is three-quarters of a full turn, pointing straight down.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — RADIAN TO DEGREE</div><div class="example-body"><strong>Convert $\\dfrac{5\\pi}{6}$ rad to degrees.</strong><br><br>Use $\\theta_{\\text{deg}} = \\theta_{\\text{rad}} \\cdot 180/\\pi$.<br><br>$\\dfrac{5\\pi}{6} \\cdot \\dfrac{180}{\\pi} = \\dfrac{5 \\cdot 180}{6} = \\dfrac{900}{6} = 150^\\circ$.<br><br>Answer: <strong>150&deg;</strong>. Lies in quadrant II, 30&deg; above the negative x-axis.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — QUADRANT IDENTIFICATION</div><div class="example-body"><strong>In which quadrant does the terminal side of $\\theta = 1000^\\circ$ lie?</strong><br><br>First, reduce: $1000 \\div 360 = 2$ remainder $280$. So 1000&deg; is coterminal with 280&deg;.<br><br>280&deg; sits between 270&deg; and 360&deg;, which is quadrant IV.<br><br>Answer: <strong>quadrant IV</strong>. By ASTC, only cosine is positive at this angle.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — POSITIVE COTERMINAL OF NEGATIVE ANGLE</div><div class="example-body"><strong>Find a positive angle coterminal with &minus;45&deg;.</strong><br><br>Add 360&deg;: $-45^\\circ + 360^\\circ = 315^\\circ$.<br><br>Answer: <strong>315&deg;</strong>. (You can find others: 675&deg;, 1035&deg;, .... All differ from &minus;45&deg; by a multiple of 360&deg;.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — ONE RADIAN IN DEGREES</div><div class="example-body"><strong>Approximately how many degrees is 1 radian?</strong><br><br>$1 \\text{ rad} \\cdot \\dfrac{180}{\\pi} = \\dfrac{180}{\\pi}$.<br><br>Take $\\pi \\approx 3.14159$. Then $180 / 3.14159 \\approx 57.296$.<br><br>Answer: <strong>1 rad &approx; 57.30&deg;</strong>. Mental anchor: a radian is "a touch less than 60 degrees", so &pi;/3 rad (= 60&deg;) is "a touch more than 1 rad".</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — DMS CONVERSION</div><div class="example-body"><strong>Convert 23&deg; 45' 18'' to a decimal degree.</strong><br><br>$23 + \\dfrac{45}{60} + \\dfrac{18}{3600} = 23 + 0.75 + 0.005 = \\mathbf{23.755^\\circ}$.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In lesson 2 we will use this lesson's unit-circle picture to define the six trigonometric functions (sin, cos, tan, cot, sec, csc) properly, compute their exact values at 30&deg;, 45&deg;, 60&deg;, and build the first table of standard values. Make sure the unit circle, the four quadrants, and the radian-degree conversion feel automatic before moving on.</div>

<div class="geogebra-wrap" style="margin:1.8rem 0">
<iframe src="https://www.geogebra.org/material/iframe/id/yfqsamzr/width/720/height/440/border/3b82f6/sfsb/false/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false" width="100%" height="440" frameborder="0" style="border-radius:8px;border:1px solid rgba(59,130,246,0.25)"></iframe>
<p class="caption" style="font-size:0.82rem;color:rgba(235,230,220,0.6);margin-top:0.5rem;text-align:center"><strong>Interactive practice:</strong> use this GeoGebra applet to drag any angle, see its coterminal partners highlighted, and read off the degree and radian values together.</p>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>An angle is two rays sharing a vertex — initial side, terminal side, amount of rotation</li>
<li>Counter-clockwise = positive sign; clockwise = negative sign</li>
<li>Two units: degrees (360 per full turn) and radians (2&pi; per full turn)</li>
<li>Conversion: multiply by &pi;/180 to go deg &rarr; rad; multiply by 180/&pi; for the reverse</li>
<li>Unit circle: $x^2 + y^2 = 1$, with point $(\\cos\\theta, \\sin\\theta)$ at angle &theta;</li>
<li>Standard position: vertex at origin, initial side on the positive x-axis</li>
<li>Four quadrants I &ndash; IV (CCW); ASTC mnemonic for trig sign rules</li>
<li>Coterminal angles differ by a whole multiple of 360&deg; (or 2&pi;); reduce mod 360 to find the canonical one in $[0^\\circ, 360^\\circ)$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Trigonometri o kadar basit bir soruyla başlar ki, bir çocuk bile sorabilir:</strong> bir açıyı nasıl ölçeriz? Bazı açıların "küçük", bazılarının "büyük" olduğunu zaten sezgisel olarak biliyorsun — bu sayfanın köşesi bir tür açıdır, direksiyonun yarım tur çevrilmesi bir başkasıdır. Ama açılarla matematik yapmak için, toplayabileceğimiz, çıkarabileceğimiz, çarpabileceğimiz ve formüllere yerleştirebileceğimiz sayılara ihtiyacımız var. Bu ilk ders, o sayıları sıfırdan inşa ediyor ve tüm trigonometrinin en önemli resmini tanıtıyor: <em>birim çember</em>.</p>

<p class="l-text">Bu dersin sonunda, derece ile radyan arasında düşünmeden geçebileceksin, herhangi bir açıyı standart konumda çizebileceksin, bitiş kenarının hangi bölgede kaldığını anlayabileceksin ve verilen bir açıyla koterminal olan tüm açıları bulabileceksin. Bu beceriler mekanik geliyor — öyledir. Ama önümüzdeki 38 derste karşılaşacağın sinüs, kosinüs, tanjant ve her trigonometrik özdeşliğin oturacağı temeli oluştururlar. Burada fazladan on dakika harca, sonra bir saat tasarruf et.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir açıyı geometrik olarak ortak bir köşe paylaşan iki ışın olarak tanımlamayı (başlangıç kenarı, bitiş kenarı)</li>
<li>Pozitif (saat yönünün tersi) ve negatif (saat yönünde) açıları ayırt etmeyi ve işaretlerini okumayı</li>
<li>Derece, dakika, saniye gösterimi ile akıcı çalışmayı ve ondalıklı dereceye dönüştürmeyi</li>
<li>Bir radyanı tanımlamayı ve <em>180&deg; = &pi; rad</em> özdeşliği yardımıyla derece-radyan dönüşümü yapmayı</li>
<li>Bir açıyı birim çember üzerinde <em>standart konuma</em> yerleştirmeyi ve bitiş kenarının hangi bölgeye düştüğünü belirlemeyi</li>
<li>360&deg; (veya 2&pi;) katlarını ekleyip çıkararak tüm koterminal açıları bulmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Açı Nedir? Geometrik Tanım</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> bir makası aç. İki bıçak başlangıçta birbirine değer (sıfır açı). Açtıkça, bıçaklar arasındaki boşluk gittikçe genişler. İşte o boşluk açıdır. Makası tekrar kapat, açı sıfıra döner. Bir açı, tek bir noktada birleşen iki düz kenar arasındaki <em>açıklık miktarından</em> başka bir şey değildir.</div>

<p class="l-text">Geometrik olarak <strong>açı</strong>, ortak bir uç noktayı paylaşan iki <em>ışından</em> (yarım doğrudan) oluşur. Bu ortak uç noktaya <strong>köşe</strong> denir. İki ışın açının <strong>kenarları</strong> olarak adlandırılır. Trigonometride bir adım ileri giderek iki kenarı birbirinden ayırırız: biri <em>başlangıç kenarı</em> (açının başladığı yer), diğeri <em>bitiş kenarı</em> (açının bittiği yer). Açının kendisi, başlangıç kenarını bitiş kenarına götüren dönme miktarıdır.</p>

<div class="calc-formula"><div class="formula-label">AÇI &mdash; TANIM</div><div class="formula-main">$$\\angle AOB \\;=\\; \\overrightarrow{OA} \\text{ ışınından } \\overrightarrow{OB} \\text{ ışınına dönme}$$</div><div class="formula-sub">O köşedir. OA başlangıç kenarı, OB bitiş kenarıdır. Açı üç harfle adlandırılır: ortadaki harf her zaman köşedir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Köşe</div><div class="card-body">İki ışının buluştuğu nokta. Genellikle O (origin / başlangıç noktası) ya da üç harfli isimlendirmenin ortadaki harfi.</div></div>
<div class="calc-card"><div class="card-title">Başlangıç kenarı</div><div class="card-body">Başladığımız ışın. Trigonometride sözleşme gereği bu kenar pozitif x-ekseni boyuncadır.</div></div>
<div class="calc-card"><div class="card-title">Bitiş kenarı</div><div class="card-body">Bittiğimiz ışın. Başlangıç kenarına göre konumu, açının büyüklüğünü ve işaretini belirler.</div></div>
</div>

<p class="l-text"><strong>Ölçme aletleri.</strong> İlkokulda <em>açıölçer</em> ile tanışmıştın — 0'dan 180 dereceye kadar işaretlenmiş yarım disk. Düz kenarı bir ışına hizalar, merkezi köşeye koyar ve diğer ışının altındaki sayıyı okursun. Okuduğun sayı, açının derece cinsinden <em>ölçüsüdür</em>. Trigonometri aynı fikri alır ama 180&deg;'den büyük, 0&deg;'den küçük ve hatta tam bir tur olan 360&deg;'den büyük açılara izin verir. Bunu yapabilmek için ikinci bir alete ihtiyacımız var: birim çember. Onunla 6. bölümde tanışacağız.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Eline bir saat al. 12 ile 3 arasındaki açı (merkezden ölçülen) çeyrek bir turdur — yani 90&deg;. 12 ile 6 arasındaki açı yarım turdur, 180&deg;. 12 ile 9 arasındaki açı (saat yönünde, kısa yoldan giderek) yine çeyrek bir turdur — ama bu +90&deg; midir, yoksa &minus;90&deg; midir? Sonraki bölüm cevaplıyor.</div></div>

<h2 class="lesson-title">2. Pozitif ve Negatif Açılar: İşaret Kuralı</h2>

<div class="calc-highlight"><strong>Kural tek satırda:</strong> <em>saat yönünün tersine</em> dönmek <strong>pozitif</strong> bir açı verir. <em>Saat yönünde</em> dönmek <strong>negatif</strong> bir açı verir. Bu, tüm sözleşmenin tamamı. Şimdi ezberle.</div>

<p class="l-text">Neden bu seçim? Tarihsel bir sözleşmedir ama matematikle uyumludur: açı büyüdükçe birim çember saat yönünün tersine gezilir, sinüs ve kosinüs bu hareketle tanımlanır ve önümüzdeki tüm ders dizisindeki her formül aynı dönme yönünü sessizce varsayar. Diğer yöne gitmek de sorun değil; sadece ölçüye bir eksi işareti koyarız.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POZİTİF AÇI</div><div class="compare-item">Dönme yönü: <strong>saat yönünün tersi</strong> (CCW)</div><div class="compare-item">İşaret: + (çoğu zaman yazılmaz)</div><div class="compare-item">Örnek: +60&deg; pozitif x-ekseninden yukarı doğru açılır</div><div class="compare-item">Akıl yürütme: saat akreplerinin <em>hareket etmediği</em> yön</div></div><div class="compare-col"><div class="compare-title">NEGATİF AÇI</div><div class="compare-item">Dönme yönü: <strong>saat yönünde</strong> (CW)</div><div class="compare-item">İşaret: &minus;</div><div class="compare-item">Örnek: &minus;60&deg; pozitif x-ekseninden aşağı doğru açılır</div><div class="compare-item">Akıl yürütme: saat akreplerinin <em>hareket ettiği</em> yön</div></div></div>

<p class="l-text">Önemli bir sonuç: +60&deg; ve &minus;300&deg; açıları tam olarak aynı yerde biter. Bitiş kenarları özdeştir. Bunlara <em>koterminal</em> açılar denir ve 9. bölümde dikkatle inceleyeceğiz. Şimdilik şunu fark et: geometrik olarak +60&deg; "saat yönünün tersine 60 derece tarayana kadar git" demektir, &minus;300&deg; ise "saat yönünde 300 derece tarayana kadar git" demektir — her iki yol da aynı ışında biter.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Aşağıdaki üç açıyı</strong> standart konumda aynı diyagram üzerine çiz: +45&deg;, &minus;45&deg;, +315&deg;.<br><br>+45&deg; birinci bölgeye yukarı doğru açılır (CCW, tam turun sekizde biri).<br>&minus;45&deg; dördüncü bölgeye aşağı doğru açılır (CW, ters yönde tam turun sekizde biri).<br>+315&deg; neredeyse tam turu tamamlayarak CCW gider ve dördüncü bölgede biter — &minus;45&deg; ile <em>aynı</em> ışında.<br><br>Sonuç: <strong>&minus;45&deg; ve +315&deg; koterminaldir</strong>. (+45&deg;, &minus;45&deg;) çifti ise x-eksenine göre simetrik ayna görüntüsüdür.</div></div>

<div class="calc-graph"><div id="plot-l1-signs-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı başlangıç ışını (pozitif x-ekseni) üzerinde üç bitiş kenarı çizilmiş: +60&deg; (CCW, mavi), &minus;60&deg; (CW, kırmızı) ve arka planda referans olarak birim çember. Yaylar dönüş yolunu izler — böylece sadece son konumu değil, hareket yönünü de görürsün.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thT=[];var xcT=[];var ycT=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;thT.push(a);xcT.push(Math.cos(a));ycT.push(Math.sin(a));}
var ringTR={x:xcT,y:ycT,mode:'lines',name:'birim çember',line:{color:'rgba(255,255,255,0.25)',width:1.4}};
var iniTR={x:[0,1],y:[0,0],mode:'lines',name:'başlangıç kenarı',line:{color:'#e8e8e8',width:3}};
var posRX=Math.cos(Math.PI/3),posRY=Math.sin(Math.PI/3);
var posTR={x:[0,posRX],y:[0,posRY],mode:'lines',name:'+60° bitiş',line:{color:'#3b82f6',width:3}};
var negRX=Math.cos(-Math.PI/3),negRY=Math.sin(-Math.PI/3);
var negTR={x:[0,negRX],y:[0,negRY],mode:'lines',name:'−60° bitiş',line:{color:'#ef4444',width:3}};
var apxT=[];var apyT=[];for(var j=0;j<=40;j++){var b=Math.PI/3*j/40;apxT.push(0.4*Math.cos(b));apyT.push(0.4*Math.sin(b));}
var anxT=[];var anyT=[];for(var j=0;j<=40;j++){var b=-Math.PI/3*j/40;anxT.push(0.55*Math.cos(b));anyT.push(0.55*Math.sin(b));}
var apT={x:apxT,y:apyT,mode:'lines',name:'CCW (+)',line:{color:'#3b82f6',width:2,dash:'dot'}};
var anT={x:anxT,y:anyT,mode:'lines',name:'CW (−)',line:{color:'#ef4444',width:2,dash:'dot'}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-signs-tr',[ringTR,iniTR,posTR,negTR,apT,anT],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yaygın bir hata:</strong> öğrenciler bazen &minus;60&deg;'yi 60&deg; olarak yazar ("iki ışın arasındaki açı zaten 60 derecedir, hangi taraftan baksan"). Trigonometride işaret <em>dönme yönü</em> hakkında bilgi taşır ve onu düşürmek sonraki derste sinüs, kosinüs ve tanjant için yanlış cevaplara yol açar. İşareti her zaman koru.</div>

<h2 class="lesson-title">3. Derece, Dakika, Saniye: Altmışlık Sistem</h2>

<div class="calc-highlight"><strong>Derece, eski birimdir, Babillilerden (~MÖ 2000) miras kalmıştır.</strong> Tam bir çemberi 360 eşit parçaya böldüler. Neden 360? Çünkü 360, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120 ve 180'e bölünür — 100 ya da 1000'den çok daha fazla bölen, bu da bir çemberi kesirsiz olarak yarımlara, üçtebirlere, çeyreklere, altıdabirlere, sekizdebirlere vs. ayırmayı kolaylaştırır. 4000 yıl sonra hâlâ onların sistemini kullanıyoruz.</div>

<p class="l-text">Bir çember etrafında tam bir tur tam olarak <strong>360&deg;</strong>'dir. Yarım tur 180&deg;. Çeyrek tur (dik açı, bir kitabın köşesi gibi) 90&deg;. Bu üç sayı — 360, 180, 90 — bir açı okuduğunda dilinin ucunda olmalı.</p>

<div class="calc-formula"><div class="formula-label">BİR DERECEYİ BÖLMEK</div><div class="formula-main">$$1^\\circ \\;=\\; 60' \\quad\\text{(dakika)} \\qquad 1' \\;=\\; 60'' \\quad\\text{(saniye)}$$</div><div class="formula-sub">Bir derece 60 dakikaya, bir dakika 60 saniyeye ayrılır. Saatteki zaman gibi aynı sistem.</div></div>

<p class="l-text"><strong>Ondalıklı dönüşüm.</strong> Derece-dakika-saniye (DMS) gösteriminden ondalıklı dereceye geçmek için dakikayı 60'a, saniyeyi 3600'e böl ve topla:</p>

<div class="calc-formula"><div class="formula-label">DMS &rarr; ONDALIKLI DERECE</div><div class="formula-main">$$D^\\circ \\, M' \\, S'' \\;=\\; D + \\frac{M}{60} + \\frac{S}{3600} \\;\\;\\text{derece}$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>32&deg; 15' 36''</strong> değerini ondalıklı dereceye dönüştür.<br><br>$32 + \\dfrac{15}{60} + \\dfrac{36}{3600} = 32 + 0.25 + 0.01 = \\mathbf{32.26^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>47.4825&deg;</strong> değerini DMS gösterimine dönüştür.<br><br>Tam kısım: <strong>47&deg;</strong>.<br>Ondalık kısım: 0.4825&deg; &times; 60 = 28.95 &rarr; <strong>28'</strong>.<br>Kalan dakikanın ondalık kısmı: 0.95' &times; 60 = 57 &rarr; <strong>57''</strong>.<br>Cevap: <strong>47&deg; 28' 57''</strong>.</div></div>

<div class="l-note"><strong>DMS hâlâ nerede önemli:</strong> haritalardaki enlem ve boylam. İstanbul 41&deg; 0' 49'' K, 28&deg; 58' 47'' D civarındadır. Aynı koordinatları ondalıklı olarak görebilirsin: 41.0136&deg;, 28.9797&deg;.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Hesap makinesi olmadan: 12&deg; 30' ile 12.5&deg; aynı mıdır? (Evet: 30 dakika yarım derecedir, yani ondalıklı olarak 12.5'tir.) 12&deg; 5' ile 12.5&deg; aynı mıdır? (Hayır: 5 dakika sadece 5/60 = 0.083&deg;'dir, yani 12&deg; 5' = 12.083&deg;.)</div></div>

<h2 class="lesson-title">4. Radyan: Doğal Açı Ölçüsü</h2>

<div class="calc-highlight"><strong>Derece kullanışlıdır ama keyfîdir — 360 sayısında özel bir şey yok.</strong> Matematikçinin tercih ettiği birim, çemberin geometrisinden saf biçimde tanımlanan ve tarihsel kazalardan azade olan <em>radyandır</em>. Radyana geçtiğinde, açı içeren her kalkülüs formülü bir sembol kısalır ve yay uzunluğu ile açı arasındaki her ilişki sıradanca basit hale gelir.</div>

<p class="l-text">İşte tanım. Herhangi bir çember al ve merkezini bir açının köşesi olarak seç. Açı, çember üzerinde bir <em>yay</em> keser (sınırın eğri bir parçası). Açının <strong>radyan ölçüsü</strong>, yay uzunluğunun yarıçapa oranıdır:</p>

<div class="calc-formula"><div class="formula-label">RADYANIN TANIMI</div><div class="formula-main">$$\\theta_{\\text{rad}} \\;=\\; \\frac{\\text{yay uzunluğu}}{\\text{yarıçap}} \\;=\\; \\frac{s}{r}$$</div><div class="formula-sub">Radyan saf bir orandır (uzunluk bölü uzunluk), yani birim taşımaz. "rad" yazmamızın tek nedeni ne tür bir nicelikten söz ettiğimizi hatırlamak.</div></div>

<p class="l-text">Sözcüklerle: <strong>bir radyan, yarıçapa eşit uzunlukta bir yay kesen açıdır.</strong> r uzunluğunda bir ipi r yarıçaplı bir çemberin kenarına sar — ipin merkezde gerdiği açı tam olarak 1 radyandır.</p>

<p class="l-text">Tam bir tur radyan cinsinden ne kadardır? Tam bir tur, $2\\pi r$ uzunluğundaki tüm çevreyi keser. r'ye bölersek radyan ölçüsü $2\\pi$ olur. Yani:</p>

<div class="calc-formula"><div class="formula-label">DERECE İLE RADYAN ARASINDAKİ KÖPRÜ</div><div class="formula-main">$$2\\pi \\text{ rad} \\;=\\; 360^\\circ \\qquad\\Longleftrightarrow\\qquad \\pi \\text{ rad} \\;=\\; 180^\\circ$$</div><div class="formula-sub">Asla unutmaman gereken tek özdeşlik bu. Dersteki her dönüşüm buradan çıkar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1 rad kaç derece?</div><div class="card-body">$1 \\text{ rad} = \\dfrac{180^\\circ}{\\pi} \\approx 57.2958^\\circ$. Yani bir radyan "60 dereceden biraz az". Kullanışlı bir zihinsel referans.</div></div>
<div class="calc-card"><div class="card-title">1&deg; kaç radyan?</div><div class="card-body">$1^\\circ = \\dfrac{\\pi}{180} \\approx 0.01745 \\text{ rad}$. Bir derece, radyanın küçük bir kesridir.</div></div>
<div class="calc-card"><div class="card-title">Matematikçiler neden radyanı sever</div><div class="card-body">Tüm kalkülüs formülleri (sin'in türevi, Taylor serisi, kompleks üstel) yalnızca açılar radyan ise geçerlidir. Derece kullanırsan formüllere &pi;/180 gibi çirkin çarpanlar girer.</div></div>
</div>

<div class="l-note"><strong>Birimler hakkında ince bir nokta:</strong> radyan teknik olarak boyutsuzdur. Bu yüzden $\\sin(\\theta)$, $\\theta$ radyan iken saf bir sayıdır, ama $\\sin(30^\\circ)$'ı $\\sin(\\pi/6)$'nın kısaltması olarak düşünmen gerekir. Trigonometrik fonksiyonların içinde doğal birim her zaman radyandır.</div>

<h2 class="lesson-title">5. Derece &harr; Radyan Dönüşümü</h2>

<div class="calc-highlight"><strong>Bir özdeşlik, iki yön.</strong> $\\pi \\text{ rad} = 180^\\circ$ özdeşliğinden iki dönüşüm kuralı çıkar. Dereceden radyana geçmek için $\\pi/180$ ile çarp. Radyandan dereceye geçmek için $180/\\pi$ ile çarp. Hangi yöne ihtiyacın varsa onu seç; formül gerisini halleder.</div>

<div class="calc-formula"><div class="formula-label">DÖNÜŞÜM KURALLARI</div><div class="formula-main">$$\\theta_{\\text{rad}} \\;=\\; \\theta_{\\text{der}} \\times \\frac{\\pi}{180} \\qquad\\qquad \\theta_{\\text{der}} \\;=\\; \\theta_{\\text{rad}} \\times \\frac{180}{\\pi}$$</div><div class="formula-sub">İkisini de ezberle. Aynı özdeşliğin yeniden düzenlenmiş halleri.</div></div>

<p class="l-text"><strong>Her öğrencinin ezbere bilmesi gereken yedi açı.</strong> Bunlar göreceğin neredeyse her trigonometri probleminde karşına çıkar:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Derece</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Radyan (tam)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Radyan (ondalık)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Geometri</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0&deg;</td><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">0.000</td><td style="padding:0.5rem 0.8rem">Dönme yok</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">30&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/6</td><td style="padding:0.5rem 0.8rem">0.524</td><td style="padding:0.5rem 0.8rem">Bir turun onikide biri</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">45&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/4</td><td style="padding:0.5rem 0.8rem">0.785</td><td style="padding:0.5rem 0.8rem">Bir turun sekizde biri</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">60&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/3</td><td style="padding:0.5rem 0.8rem">1.047</td><td style="padding:0.5rem 0.8rem">Bir turun altıda biri</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">90&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/2</td><td style="padding:0.5rem 0.8rem">1.571</td><td style="padding:0.5rem 0.8rem">Çeyrek tur (dik açı)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">180&deg;</td><td style="padding:0.5rem 0.8rem">&pi;</td><td style="padding:0.5rem 0.8rem">3.142</td><td style="padding:0.5rem 0.8rem">Yarım tur (doğrultu)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">270&deg;</td><td style="padding:0.5rem 0.8rem">3&pi;/2</td><td style="padding:0.5rem 0.8rem">4.712</td><td style="padding:0.5rem 0.8rem">Üç çeyrek tur</td></tr>
<tr><td style="padding:0.5rem 0.8rem">360&deg;</td><td style="padding:0.5rem 0.8rem">2&pi;</td><td style="padding:0.5rem 0.8rem">6.283</td><td style="padding:0.5rem 0.8rem">Tam tur</td></tr>
</tbody></table>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body"><strong>120&deg;</strong> değerini radyana dönüştür.<br><br>$\\theta_{\\text{rad}} = 120 \\times \\dfrac{\\pi}{180} = \\dfrac{120\\pi}{180} = \\dfrac{2\\pi}{3}$.<br><br>Yani $120^\\circ = \\mathbf{\\dfrac{2\\pi}{3} \\text{ rad}} \\approx 2.094$ rad.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body"><strong>$\\dfrac{5\\pi}{4}$ rad</strong> değerini dereceye dönüştür.<br><br>$\\theta_{\\text{der}} = \\dfrac{5\\pi}{4} \\times \\dfrac{180}{\\pi} = \\dfrac{5 \\times 180}{4} = \\dfrac{900}{4} = \\mathbf{225^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body"><strong>1 radyanın</strong> derece karşılığını iki ondalık basamağa kadar bul.<br><br>$1 \\text{ rad} \\times \\dfrac{180}{\\pi} = \\dfrac{180}{3.14159...} \\approx \\mathbf{57.30^\\circ}$.<br><br>Demek ki "1 rad", 60&deg;'nin biraz altında oturuyor — yaklaşık olarak 45&deg; (&pi;/4) ile 60&deg; (&pi;/3) çizgileri arasında.</div></div>

<div class="think-box"><div class="think-label">EZBERLENECEK ÖRÜNTÜ</div><div class="think-body">Tabloya bak: tüm "güzel" açıların (30, 45, 60, 90, 180, 270, 360) radyan biçimleri <em>&pi;'nin basit kesirleridir</em>. Bu tesadüf değil — bunlar tam olarak bir çemberi 12, 8, 6, 4, 2, 4/3, 1 parçaya bölen açılardır. Bir problemde &pi;/6, &pi;/4, &pi;/3, &pi;/2, &pi;, 3&pi;/2, 2&pi; gördüğünde, anında 30, 45, 60, 90, 180, 270, 360'a çevir.</div></div>

<h2 class="lesson-title">6. Birim Çember</h2>

<div class="calc-highlight"><strong>Birim çember, trigonometrideki en kullanışlı diyagramdır.</strong> Merkezi orijinde (0, 0) ve yarıçapı 1 olan bir çemberdir. Hepsi bu. Ama önümüzdeki 38 dersteki her trig fonksiyonu, her özdeşlik, her açı ve her formül bu tek resmin üzerinde duruyor.</div>

<div class="calc-formula"><div class="formula-label">BİRİM ÇEMBERİN DENKLEMİ</div><div class="formula-main">$$x^2 + y^2 \\;=\\; 1$$</div><div class="formula-sub">Düzlemdeki orijine uzaklığı tam olarak 1 olan tüm (x, y) noktalarının kümesi.</div></div>

<p class="l-text"><strong>Neden yarıçap 1?</strong> İki nedeni var. Birincisi, çember üzerindeki uzaklıklar açı ölçülerine eşittir: pozitif x-ekseninden $\\theta$ açısındaki bir noktaya olan yay uzunluğu tam olarak $\\theta$'dır (radyan cinsinden). İkincisi, her trig fonksiyonu bir noktanın koordinatına dönüşür. Birim çemberin kenarı boyunca (1, 0) noktasından saat yönünün tersine $\\theta$ yay uzunluğu kadar yürürsek, koordinatları şu olan bir noktaya varırız:</p>

<div class="calc-formula"><div class="formula-label">BİRİM ÇEMBERDEN SİNÜS VE KOSİNÜS</div><div class="formula-main">$$P(\\theta) \\;=\\; (\\cos\\theta, \\, \\sin\\theta)$$</div><div class="formula-sub">Birim çember üzerindeki bir noktanın x-koordinatı, açının kosinüsüdür. y-koordinatı sinüstür. Bu, bu yıl göreceğin en önemli resimdir.</div></div>

<p class="l-text">Trig fonksiyonlarını <em>tam anlamıyla</em> 2. derste tanımlayacağız. Şimdilik resmi içine sindir: $\\theta$ 0'dan $2\\pi$'ye büyürken, $P$ noktası birim çemberin kenarı etrafında bir kez döner ve $(\\cos\\theta, \\sin\\theta)$ çifti onun adresinden başka bir şey değildir.</p>

<div class="calc-graph"><div id="plot-l1-unit-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yedi örnek açıyla işaretlenmiş birim çember. Her işarette etiket hem radyan (üst) hem derece (alt) değeridir, böylece gözünle dönüşümü çalıştırabilirsin. Yönelime dikkat et: 0 (veya 0&deg;) sağda, &pi;/2 (90&deg;) üstte, &pi; (180&deg;) solda, 3&pi;/2 (270&deg;) altta.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thAt=[];var xAt=[];var yAt=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;thAt.push(a);xAt.push(Math.cos(a));yAt.push(Math.sin(a));}
var ringT={x:xAt,y:yAt,mode:'lines',name:'birim çember',line:{color:'#3b82f6',width:2.5}};
var axXt={x:[-1.25,1.25],y:[0,0],mode:'lines',name:'x ekseni',line:{color:'rgba(255,255,255,0.3)',width:1}};
var axYt={x:[0,0],y:[-1.25,1.25],mode:'lines',name:'y ekseni',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var sAng=[0,Math.PI/6,Math.PI/4,Math.PI/3,Math.PI/2,Math.PI,3*Math.PI/2];
var sLab=['0','π/6','π/4','π/3','π/2','π','3π/2'];
var sDer=['0°','30°','45°','60°','90°','180°','270°'];
var pxT=[];var pyT=[];var ptT=[];for(var k=0;k<sAng.length;k++){pxT.push(Math.cos(sAng[k]));pyT.push(Math.sin(sAng[k]));ptT.push(sLab[k]+'<br>'+sDer[k]);}
var ptsT={x:pxT,y:pyT,mode:'markers+text',name:'örnek açılar',marker:{color:'#f59e0b',size:10},text:ptT,textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var spkT={x:[],y:[],mode:'lines',name:'ışınlar',line:{color:'rgba(245,158,11,0.3)',width:1,dash:'dot'}};
for(var m=0;m<sAng.length;m++){spkT.x.push(0,Math.cos(sAng[m]),null);spkT.y.push(0,Math.sin(sAng[m]),null);}
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x = cos θ',range:[-1.4,1.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y = sin θ',range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-unit-tr',[ringT,axXt,axYt,spkT,ptsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="geogebra-wrap" style="margin:1.5rem 0">
<iframe src="https://www.geogebra.org/material/iframe/id/qf8pjdpb/width/720/height/440/border/3b82f6/sfsb/false/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false" width="100%" height="440" frameborder="0" style="border-radius:8px;border:1px solid rgba(59,130,246,0.25)"></iframe>
<p class="caption" style="font-size:0.82rem;color:rgba(235,230,220,0.6);margin-top:0.5rem;text-align:center"><strong>İnteraktif:</strong> GeoGebra'daki kaydırma çubuğunu sürükleyerek açıyı değiştir. (cos&theta;, sin&theta;) noktasının birim çember etrafında hareket ettiğini izle ve radyan-derece eşleşmesinin canlı güncellendiğini gör.</p>
</div>

<h2 class="lesson-title">7. Standart Konumda Açılar</h2>

<div class="calc-highlight"><strong>Standart konum, sabit bir referans çerçevesidir.</strong> Üzerinde anlaştığımızda her açının benzersiz ve net bir resmi olur, ihtiyacımız olan her şeyi (hangi bölge, sinüsün işareti, kosinüsün işareti) tek bakışta okuyabiliriz.</div>

<p class="l-text">Bir açı <strong>standart konumda</strong>dır eğer:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Köşesi orijinde</div><div class="card-body">İki ışının buluştuğu nokta tam olarak (0, 0)'da oturur.</div></div>
<div class="calc-card"><div class="card-title">Başlangıç kenarı pozitif x-ekseninde</div><div class="card-body">Bir ışın sağa, $y = 0$, $x \\geq 0$ doğrusu boyunca uzanır.</div></div>
<div class="calc-card"><div class="card-title">Bitiş kenarı açıyla belirlenir</div><div class="card-body">Diğer ışın, açının onu götürdüğü yerdir — pozitif açılar için CCW, negatifler için CW ölçülür.</div></div>
</div>

<p class="l-text">Bundan sonra bir trigonometri probleminde karşılaştığın her açı standart konumda çizilebilir — ve çizilmelidir. Diyagram sana bitiş kenarının hangi bölgeye düştüğünü anında söyler, bu da o açının trig fonksiyonlarının işaretlerini söyler.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\theta = 150^\\circ$ açısını standart konuma yerleştir.<br><br>Pozitif x-ekseni boyunca uzanan ışınla başla. CCW dön. 90&deg; seni pozitif y-eksenine getirir. Bir 60&deg; daha (toplamda 150&deg; taradın) bitiş kenarını sol üste, ikinci bölgeye, negatif x-ekseninin 30&deg; üstüne yerleştirir.<br><br>Pratik olarak radyana çevir: $150^\\circ = 150 \\cdot \\pi/180 = 5\\pi/6 \\text{ rad}$.</div></div>

<h2 class="lesson-title">8. Dört Bölge ve İşaret Kuralları</h2>

<div class="calc-highlight"><strong>x- ve y- eksenleri düzlemi dört bölgeye böler.</strong> I, II, III, IV olarak numaralandırılır — sağ üstten başlayıp saat yönünün tersine, pozitif açılarla aynı CCW sözleşmesini takip eder. Sırayı ezberle: açı taramasıyla eşleşen tek sıralama budur.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Bölge</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Derece aralığı</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Radyan aralığı</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">cos &theta; işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">sin &theta; işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">tan &theta; işareti</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>I</strong></td><td style="padding:0.5rem 0.8rem">0&deg; &ndash; 90&deg;</td><td style="padding:0.5rem 0.8rem">0 &ndash; &pi;/2</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>II</strong></td><td style="padding:0.5rem 0.8rem">90&deg; &ndash; 180&deg;</td><td style="padding:0.5rem 0.8rem">&pi;/2 &ndash; &pi;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>III</strong></td><td style="padding:0.5rem 0.8rem">180&deg; &ndash; 270&deg;</td><td style="padding:0.5rem 0.8rem">&pi; &ndash; 3&pi;/2</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>IV</strong></td><td style="padding:0.5rem 0.8rem">270&deg; &ndash; 360&deg;</td><td style="padding:0.5rem 0.8rem">3&pi;/2 &ndash; 2&pi;</td><td style="padding:0.5rem 0.8rem;color:#10b981">+</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td><td style="padding:0.5rem 0.8rem;color:#ef4444">&minus;</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>"ASTC" akronimi (İngilizce kökenli ama Türkçe'de de yaygın).</strong> Her bölgede hangi fonksiyonun pozitif olduğunu okursak: I'de <em>All / Hepsi</em>, II'de <em>Sin / Sinüs</em>, III'te <em>Tan / Tanjant</em>, IV'te <em>Cos / Kosinüs</em>. Sırayı I'den CCW olarak hatırlamak için bir İngilizce tekerleme: <em>All Students Take Calculus</em> ("Tüm Öğrenciler Kalkülüs Alır"). Türkçe alternatif: <em>Hepsi Sinüs Tanjant Kosinüs</em>.</p>

<div class="calc-graph"><div id="plot-l1-quadrants-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ASTC etiketleri kanonik konumlarında olmak üzere dört bölge. Hangi trig fonksiyonlarının nerede pozitif olduğunu hatırlaman gerektiğinde bu resmi kullan — tabloyu ezberlemekten çok daha hızlı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thQt=[];var xQt=[];var yQt=[];for(var i=0;i<=360;i++){var a=2*Math.PI*i/360;thQt.push(a);xQt.push(Math.cos(a));yQt.push(Math.sin(a));}
var ringQt={x:xQt,y:yQt,mode:'lines',name:'birim çember',line:{color:'rgba(59,130,246,0.6)',width:2}};
var axt={x:[-1.3,1.3],y:[0,0],mode:'lines',name:'x',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ayt={x:[0,0],y:[-1.3,1.3],mode:'lines',name:'y',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var labelsT={x:[0.65,-0.65,-0.65,0.65],y:[0.65,0.65,-0.65,-0.65],mode:'text',name:'ASTC',text:['<b>H</b>epsi<br>(I)','<b>S</b>inüs<br>(II)','<b>T</b>anjant<br>(III)','<b>K</b>osinüs<br>(IV)'],textfont:{color:['#10b981','#3b82f6','#f59e0b','#ec4899'],size:14}};
var qLabT={x:[1.15,-1.15,-1.15,1.15],y:[1.15,1.15,-1.15,-1.15],mode:'text',name:'bölge numaraları',text:['I','II','III','IV'],textfont:{color:'rgba(255,255,255,0.6)',size:18},showlegend:false};
var layQt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'y',scaleratio:1,title:'x'},yaxis:{range:[-1.4,1.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',title:'y'},margin:{t:30,r:30,b:50,l:50},showlegend:false};
Plotly.newPlot('plot-l1-quadrants-tr',[ringQt,axt,ayt,labelsT,qLabT],layQt,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\theta = 220^\\circ$ açısının bitiş kenarı hangi bölgededir?<br><br>220&deg; değeri 180&deg;'den (negatif x-ekseni) büyük ve 270&deg;'den (negatif y-ekseni) küçüktür. Bu nedenle bitiş kenarı <strong>III. bölgededir</strong>. ASTC kuralına göre, $\\cos 220^\\circ < 0$, $\\sin 220^\\circ < 0$, $\\tan 220^\\circ > 0$.</div></div>

<h2 class="lesson-title">9. Koterminal Açılar</h2>

<div class="calc-highlight"><strong>İki açı, bitiş kenarları tam olarak aynı ışına düşüyorsa koterminaldir.</strong> Eşdeğer biçimde: tam tur (360&deg; ya da 2&pi; rad) sayısının tam katı kadar farklılık gösterirler. Bir açının sonsuz sayıda koterminal eşi vardır — herhangi bir tam sayı kadar tam tur ekle ya da çıkar.</div>

<div class="calc-formula"><div class="formula-label">KOTERMİNAL FORMÜLÜ</div><div class="formula-main">$$\\theta \\;\\text{ ve }\\; \\theta + 360^\\circ \\cdot k \\quad (k \\in \\mathbb{Z}) \\;\\;\\text{koterminaldir}$$</div><div class="formula-sub">Radyan cinsinden: $\\theta$ ve $\\theta + 2\\pi k$ koterminaldir. k herhangi bir tam sayı olabilir — pozitif, negatif veya sıfır.</div></div>

<p class="l-text"><strong>Tipik soru:</strong> garip bir açı verildiğinde (mesela 750&deg;), $[0^\\circ, 360^\\circ)$ aralığındaki tek koterminal açıyı bul. Yöntem 360'a böldüğünde elde edilen kalanı almaktır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body"><strong>750&deg;</strong> ile koterminal olan, $[0^\\circ, 360^\\circ)$ aralığındaki açıyı bul.<br><br>750&deg; &divide; 360&deg; = 2, kalan 30. Yani 750&deg; iki tam tur artı 30&deg;'dir.<br><br>$750^\\circ = 2 \\cdot 360^\\circ + 30^\\circ \\implies 750^\\circ$ açısı $\\mathbf{30^\\circ}$ ile koterminaldir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body"><strong>&minus;45&deg;</strong> ile koterminal olan, $[0^\\circ, 360^\\circ)$ aralığındaki pozitif açıyı bul.<br><br>$-45^\\circ + 360^\\circ = \\mathbf{315^\\circ}$.<br><br>Kontrol: 315&deg; pozitif x-ekseninin 45&deg; altında IV. bölgede oturur — tam olarak &minus;45&deg;'nin bitiş kenarının düştüğü yer.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$\\dfrac{17\\pi}{4}$ açısı ile $[0, 2\\pi)$ aralığında koterminal olan açıyı bul.<br><br>$\\dfrac{17\\pi}{4} = \\dfrac{16\\pi}{4} + \\dfrac{\\pi}{4} = 4\\pi + \\dfrac{\\pi}{4} = 2 \\cdot 2\\pi + \\dfrac{\\pi}{4}$.<br><br>Yani $\\dfrac{17\\pi}{4}$ iki tam tur artı $\\pi/4$'tür. $[0, 2\\pi)$ aralığındaki koterminal eşi $\\mathbf{\\dfrac{\\pi}{4}}$'tür (yani 45&deg;).</div></div>

<div class="calc-graph"><div id="plot-l1-coterm-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç koterminal açı üst üste çizilmiş: 30&deg; (CCW, on ikide bir tur), 390&deg; (bir tam tur artı 30&deg;) ve &minus;330&deg; (neredeyse tam tur CW). Üçü de aynı bitiş ışınında biter. Yaylar her dönüşün yolunu izler — aynı varış, farklı yolculuk.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thCt=[];var xCt=[];var yCt=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;thCt.push(a);xCt.push(Math.cos(a));yCt.push(Math.sin(a));}
var ringCt={x:xCt,y:yCt,mode:'lines',name:'birim çember',line:{color:'rgba(255,255,255,0.25)',width:1.4}};
var termT={x:[0,Math.cos(Math.PI/6)],y:[0,Math.sin(Math.PI/6)],mode:'lines',name:'ortak bitiş ışını',line:{color:'#f59e0b',width:3.2}};
var iniCt={x:[0,1],y:[0,0],mode:'lines',name:'başlangıç kenarı',line:{color:'#e8e8e8',width:2.5}};
var ax1X=[];var ax1Y=[];for(var j=0;j<=30;j++){var b=Math.PI/6*j/30;ax1X.push(0.35*Math.cos(b));ax1Y.push(0.35*Math.sin(b));}
var ax2X=[];var ax2Y=[];for(var j=0;j<=130;j++){var b=(2*Math.PI+Math.PI/6)*j/130;ax2X.push(0.55*Math.cos(b));ax2Y.push(0.55*Math.sin(b));}
var ax3X=[];var ax3Y=[];for(var j=0;j<=110;j++){var b=-(2*Math.PI-Math.PI/6)*j/110;ax3X.push(0.75*Math.cos(b));ax3Y.push(0.75*Math.sin(b));}
var aT1={x:ax1X,y:ax1Y,mode:'lines',name:'+30°',line:{color:'#3b82f6',width:2.2}};
var aT2={x:ax2X,y:ax2Y,mode:'lines',name:'+390°',line:{color:'#10b981',width:2.2,dash:'dot'}};
var aT3={x:ax3X,y:ax3Y,mode:'lines',name:'−330°',line:{color:'#ef4444',width:2.2,dash:'dash'}};
var layCt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-coterm-tr',[ringCt,iniCt,termT,aT1,aT2,aT3],layCt,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">60&deg; ile koterminal olan beş farklı açı yaz. (Örnek cevaplar: 420&deg;, 780&deg;, &minus;300&deg;, &minus;660&deg;, 1140&deg;. Her biri 60&deg;'den 360&deg;'nin bir katı kadar farklıdır.)</div></div>

<h2 class="lesson-title">10. Çözümlü Problemler</h2>

<p class="l-text">Derste işlenen her şeyi bir araya getiren kısa bir alıştırma seti. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; DERECEDEN RADYANA</div><div class="example-body"><strong>270&deg; değerini radyana çevir.</strong><br><br>$\\theta_{\\text{rad}} = \\theta_{\\text{der}} \\cdot \\pi/180$ kuralını kullan.<br><br>$270 \\cdot \\dfrac{\\pi}{180} = \\dfrac{270\\pi}{180} = \\dfrac{3\\pi}{2}$.<br><br>Cevap: <strong>$\\dfrac{3\\pi}{2}$ rad</strong> (yaklaşık 4.712 rad). Bu, tam turun dörtte üçüdür ve aşağı yönü gösterir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; RADYANDAN DERECEYE</div><div class="example-body"><strong>$\\dfrac{5\\pi}{6}$ rad değerini dereceye çevir.</strong><br><br>$\\theta_{\\text{der}} = \\theta_{\\text{rad}} \\cdot 180/\\pi$ kuralını kullan.<br><br>$\\dfrac{5\\pi}{6} \\cdot \\dfrac{180}{\\pi} = \\dfrac{5 \\cdot 180}{6} = \\dfrac{900}{6} = 150^\\circ$.<br><br>Cevap: <strong>150&deg;</strong>. II. bölgede yatar, negatif x-ekseninin 30&deg; üstünde.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; BÖLGE BELİRLEME</div><div class="example-body"><strong>$\\theta = 1000^\\circ$ açısının bitiş kenarı hangi bölgededir?</strong><br><br>Önce indirgeyelim: $1000 \\div 360 = 2$, kalan $280$. Yani 1000&deg;, 280&deg; ile koterminaldir.<br><br>280&deg; değeri 270&deg; ile 360&deg; arasında yer alır; bu IV. bölgedir.<br><br>Cevap: <strong>IV. bölge</strong>. ASTC kuralına göre bu açıda sadece kosinüs pozitiftir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; NEGATİF AÇININ POZİTİF KOTERMİNALİ</div><div class="example-body"><strong>&minus;45&deg; ile koterminal olan bir pozitif açı bul.</strong><br><br>360&deg; ekle: $-45^\\circ + 360^\\circ = 315^\\circ$.<br><br>Cevap: <strong>315&deg;</strong>. (Başkalarını da bulabilirsin: 675&deg;, 1035&deg;, .... Hepsi &minus;45&deg;'den 360&deg;'nin bir katı kadar farklıdır.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; BİR RADYANIN DERECE KARŞILIĞI</div><div class="example-body"><strong>1 radyan yaklaşık kaç derecedir?</strong><br><br>$1 \\text{ rad} \\cdot \\dfrac{180}{\\pi} = \\dfrac{180}{\\pi}$.<br><br>$\\pi \\approx 3.14159$ alalım. O zaman $180 / 3.14159 \\approx 57.296$.<br><br>Cevap: <strong>1 rad &approx; 57.30&deg;</strong>. Zihinsel referans: bir radyan "60 dereceden biraz az", yani &pi;/3 rad (= 60&deg;) "1 rad'dan biraz fazla".</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; DMS DÖNÜŞÜMÜ</div><div class="example-body"><strong>23&deg; 45' 18'' değerini ondalıklı dereceye çevir.</strong><br><br>$23 + \\dfrac{45}{60} + \\dfrac{18}{3600} = 23 + 0.75 + 0.005 = \\mathbf{23.755^\\circ}$.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> 2. derste bu dersin birim çember resmini kullanarak altı trigonometrik fonksiyonu (sin, cos, tan, cot, sec, csc) düzgün biçimde tanımlayacak, 30&deg;, 45&deg;, 60&deg; için kesin değerlerini hesaplayacak ve standart değerlerin ilk tablosunu kuracağız. Devam etmeden önce birim çember, dört bölge ve derece-radyan dönüşümünün otomatik hale geldiğinden emin ol.</div>

<div class="geogebra-wrap" style="margin:1.8rem 0">
<iframe src="https://www.geogebra.org/material/iframe/id/yfqsamzr/width/720/height/440/border/3b82f6/sfsb/false/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false" width="100%" height="440" frameborder="0" style="border-radius:8px;border:1px solid rgba(59,130,246,0.25)"></iframe>
<p class="caption" style="font-size:0.82rem;color:rgba(235,230,220,0.6);margin-top:0.5rem;text-align:center"><strong>İnteraktif alıştırma:</strong> bu GeoGebra appletini kullanarak herhangi bir açıyı sürükle, koterminal eşlerini vurgulanmış olarak gör, derece ve radyan değerlerini birlikte oku.</p>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Açı, ortak köşeyi paylaşan iki ışındır — başlangıç kenarı, bitiş kenarı ve dönme miktarı</li>
<li>Saat yönünün tersi = pozitif işaret; saat yönünde = negatif işaret</li>
<li>İki birim: derece (tam tur 360) ve radyan (tam tur 2&pi;)</li>
<li>Dönüşüm: der &rarr; rad için &pi;/180 ile çarp; ters yön için 180/&pi; ile çarp</li>
<li>Birim çember: $x^2 + y^2 = 1$, &theta; açısında $(\\cos\\theta, \\sin\\theta)$ noktası</li>
<li>Standart konum: köşe orijinde, başlangıç kenarı pozitif x-ekseninde</li>
<li>Dört bölge I &ndash; IV (CCW); trig işaret kuralları için ASTC akronimi</li>
<li>Koterminal açılar 360&deg; (veya 2&pi;)'nin bir tam katı kadar farklılık gösterir; mod 360 işlemiyle $[0^\\circ, 360^\\circ)$ aralığındaki tek temsilciyi bul</li>
</ul>
</div>`

};
