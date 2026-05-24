window.LISE_MAT_L10 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Trigonometry stopped being abstract the moment surveyors used it to measure a mountain they could not climb.</strong> The same six ratios you have studied — sine, cosine, tangent and their reciprocals — answer real questions: how tall is the minaret across the square, how far is the ship from the lighthouse, in which direction will an aeroplane drift if the wind blows from the north-west at 40 km/h? This lesson collects the most common application patterns in one place and shows you the standard diagrams Turkish high-school and YKS questions reuse over and over.</p>

<p class="l-text">By the end you will recognise an "angle of elevation" / "angle of depression" diagram on sight, decompose any vector into two perpendicular components without hesitation, and model periodic phenomena — sound, tide, daily temperature, a rotating shaft — with a single sinusoid of the form $A\\sin(\\omega t + \\varphi) + C$. These are the techniques engineers, surveyors, navigators, and physicists use every working day. There is no Python in this lesson; you only need a calculator that knows sin, cos, tan and their inverses.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Solve height &amp; distance problems using the angle of elevation and the angle of depression (shadows, towers, trees)</li>
<li>Read a navigation diagram given as a bearing from north and convert it into standard-position angles</li>
<li>Decompose a vector (force, velocity, displacement) into perpendicular components using $F_x = F\\cos\\theta$, $F_y = F\\sin\\theta$</li>
<li>Model periodic phenomena (sound, tide, temperature) with the canonical sinusoid $y = A\\sin(\\omega t + \\varphi) + C$ and read off period, amplitude, phase</li>
<li>Recognise simple harmonic motion in a rotating shaft or pendulum and write its position equation</li>
<li>Solve 3 YKS / AYT-style applied questions and 5 classical exercises using only the tools above</li>
</ul>
</div>

<h2 class="lesson-title">1. Height &amp; Distance: The Angle of Elevation</h2>

<div class="calc-highlight"><strong>The single most common applied trig diagram.</strong> An observer stands on flat ground and looks <em>up</em> at the top of a tall object — a tree, a flagpole, a minaret, a tower. The angle between the horizontal line of sight and the upward line of sight to the top is called the <strong>angle of elevation</strong>. If you know this angle and the horizontal distance from the observer to the foot of the object, the height drops out of a single tangent.</div>

<p class="l-text">Set up the picture as a right triangle. The horizontal ground is the bottom side, of known length $d$. The vertical object is the side opposite the observer, of unknown height $h$. The line of sight is the hypotenuse. The angle of elevation $\\alpha$ sits at the observer's eye. By the very definition of tangent in lesson 2, the side <em>opposite</em> $\\alpha$ over the side <em>adjacent</em> to $\\alpha$ equals $\\tan\\alpha$:</p>

<div class="calc-formula"><div class="formula-label">HEIGHT FROM ANGLE OF ELEVATION</div><div class="formula-main">$$\\tan\\alpha \\;=\\; \\frac{h}{d} \\qquad\\Longrightarrow\\qquad h \\;=\\; d\\,\\tan\\alpha$$</div><div class="formula-sub">$d$: horizontal distance from observer to foot of object. $\\alpha$: angle of elevation, measured from the horizontal. $h$: height of the object above the observer's eye.</div></div>

<p class="l-text"><strong>Watch the eye-height.</strong> The formula gives the height of the top of the object <em>above the observer's eye</em>. If the observer is 1.70 m tall, the true height from the ground is $h + 1.70$. Examination questions sometimes specify "the observer's eye is at ground level" to skip this step; sometimes they do not. Read carefully.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TREE HEIGHT FROM SHADOW</div><div class="example-body">A vertical tree casts a shadow of length <strong>$d = 18$ m</strong> on flat ground at the moment the sun is at an angle of elevation $\\alpha = 42^\\circ$ above the horizon. How tall is the tree?<br><br>$h = d\\tan\\alpha = 18 \\cdot \\tan 42^\\circ \\approx 18 \\cdot 0.9004 \\approx \\mathbf{16.21\\text{ m}}$.<br><br>Notice we did not need to know how far the sun is — only the angle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TOWER FROM A DISTANCE</div><div class="example-body">A surveyor stands 60 m from the foot of a TV tower and measures the angle of elevation to the antenna tip as $58^\\circ$. The instrument is 1.5 m above the ground. Find the height of the tip above the ground.<br><br>Height above instrument: $h = 60 \\tan 58^\\circ \\approx 60 \\cdot 1.6003 \\approx 96.02$ m.<br>Add instrument height: total $\\approx \\mathbf{97.52\\text{ m}}$.</div></div>

<div class="calc-graph"><div id="plot-l10-elevation-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this diagram shows:</strong> the right triangle formed by the observer (left), the foot of the object (right), and the top (upper right). The angle of elevation $\\alpha$ is at the observer; the horizontal distance $d$ is the lower side; the height $h$ is the vertical side.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var d=4,h=3;
var triEN={x:[0,d,d,0],y:[0,0,h,0],mode:'lines',name:'right triangle',line:{color:'#3b82f6',width:3},fill:'toself',fillcolor:'rgba(59,130,246,0.08)'};
var horizEN={x:[0,d+0.6],y:[0,0],mode:'lines',name:'horizontal (ground)',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dot'}};
var sightEN={x:[0,d],y:[0,h],mode:'lines',name:'line of sight',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var observerEN={x:[0],y:[0],mode:'markers+text',name:'observer',marker:{size:12,color:'#10b981'},text:['observer'],textposition:'bottom right',textfont:{color:'#10b981'}};
var topEN={x:[d],y:[h],mode:'markers+text',name:'top',marker:{size:12,color:'#ef4444'},text:['top'],textposition:'top center',textfont:{color:'#ef4444'}};
var arcAng=[];var arcAngY=[];for(var k=0;k<=24;k++){var t=Math.atan(h/d)*k/24;arcAng.push(0.7*Math.cos(t));arcAngY.push(0.7*Math.sin(t));}
var arcEN={x:arcAng,y:arcAngY,mode:'lines',name:'α',line:{color:'#f59e0b',width:2}};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'horizontal distance d',range:[-0.4,d+1.0],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'height h',range:[-0.4,h+0.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5},annotations:[{x:1.0,y:0.25,text:'α',showarrow:false,font:{color:'#f59e0b',size:18}},{x:d/2,y:-0.25,text:'d',showarrow:false,font:{color:'#9ca3af',size:14}},{x:d+0.25,y:h/2,text:'h',showarrow:false,font:{color:'#9ca3af',size:14}}]};
Plotly.newPlot('plot-l10-elevation-en',[triEN,horizEN,sightEN,arcEN,observerEN,topEN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Angle of Depression: Looking Down From a Height</h2>

<div class="calc-highlight"><strong>The mirror image of elevation.</strong> Now the observer is up on a cliff, a bridge, or an aeroplane window, and the target is below. The angle between the <em>horizontal line of sight</em> and the <em>downward line of sight</em> to the target is the <strong>angle of depression</strong>. Crucially, by alternate interior angles between parallel horizontals, the angle of depression at the observer <em>equals</em> the angle of elevation at the target. So the same tangent formula applies, with $h$ now being the observer's height above the target.</div>

<p class="l-text">Set the picture up. The observer is at height $h$ above the ground; the target is at horizontal distance $d$ from the foot of the observer's tower; the angle of depression $\\beta$ is measured down from the horizontal at the eye. Then exactly as before</p>

<div class="calc-formula"><div class="formula-label">DISTANCE FROM ANGLE OF DEPRESSION</div><div class="formula-main">$$\\tan\\beta \\;=\\; \\frac{h}{d} \\qquad\\Longrightarrow\\qquad d \\;=\\; \\frac{h}{\\tan\\beta}$$</div><div class="formula-sub">When you know your altitude $h$ and the angle $\\beta$ at which you sight a ship below, the horizontal distance to the ship is $h/\\tan\\beta$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SHIP FROM A LIGHTHOUSE</div><div class="example-body">A lighthouse keeper stands 35 m above sea level and sees a fishing boat at an angle of depression of $14^\\circ$. How far is the boat from the foot of the lighthouse?<br><br>$d = h/\\tan\\beta = 35/\\tan 14^\\circ \\approx 35/0.2493 \\approx \\mathbf{140.4\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AIRCRAFT ON APPROACH</div><div class="example-body">A commercial jet at altitude 1200 m sees the runway threshold at an angle of depression of $3^\\circ$. How much horizontal distance remains before touchdown?<br><br>$d = 1200/\\tan 3^\\circ \\approx 1200/0.0524 \\approx \\mathbf{22{,}900\\text{ m}} \\approx 22.9\\text{ km}$. (A standard ILS glide-slope is about $3^\\circ$ — this is why airliners begin their descent so far out.)</div></div>

<div class="l-note"><strong>The classic mistake:</strong> drawing the angle of depression <em>between the vertical and the line of sight</em> instead of between the <em>horizontal</em> and the line of sight. Always start your diagram by drawing the horizontal dashed line through the eye. The depression angle is measured downward from <em>that</em> line.</div>

<h2 class="lesson-title">3. Two-Step Problems: Two Angles, One Object</h2>

<div class="calc-highlight"><strong>The two-station trick.</strong> Sometimes you cannot measure the distance to the foot of an object (a mountain on the other side of a river, an island offshore). The cure: take <em>two</em> angle readings from <em>two</em> known positions on a straight line, and the height pops out of two simultaneous tangent equations.</div>

<p class="l-text">Say you walk along a straight horizontal road and measure the angle of elevation to the summit of a hill: $\\alpha_1$ at the first stop, then walk a measured distance $\\ell$ further along the road (closer to the hill) and read $\\alpha_2 > \\alpha_1$. Let $h$ be the unknown height and $d$ the horizontal distance from the <em>second</em> stop to the foot of the hill. Then:</p>

<div class="calc-formula"><div class="formula-label">TWO-STATION HEIGHT FORMULA</div><div class="formula-main">$$h \\;=\\; d\\tan\\alpha_2 \\;=\\; (d + \\ell)\\tan\\alpha_1$$</div><div class="formula-sub">Solve the two equations simultaneously for $d$ and $h$. Result: $\\displaystyle h = \\frac{\\ell\\,\\tan\\alpha_1 \\tan\\alpha_2}{\\tan\\alpha_2 - \\tan\\alpha_1}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — MOUNTAIN ACROSS A RIVER</div><div class="example-body">From the near bank of a river the angle of elevation to a peak is $\\alpha_1 = 22^\\circ$. After walking $\\ell = 150$ m straight toward the river, the angle is now $\\alpha_2 = 31^\\circ$. The river is in the way so we cannot pace off $d$. What is the height of the peak above the road?<br><br>Plug into the formula:<br><br>$h = \\dfrac{150 \\cdot \\tan 22^\\circ \\cdot \\tan 31^\\circ}{\\tan 31^\\circ - \\tan 22^\\circ} = \\dfrac{150 \\cdot 0.4040 \\cdot 0.6009}{0.6009 - 0.4040} = \\dfrac{36.42}{0.1969} \\approx \\mathbf{185.0\\text{ m}}$.</div></div>

<h2 class="lesson-title">4. Navigation: Bearings From North</h2>

<div class="calc-highlight"><strong>Sailors and aviators do not use standard-position angles.</strong> A <em>bearing</em> is measured <strong>clockwise from north</strong>, between 0&deg; and 360&deg;. North itself is 000&deg; or 360&deg;; east is 090&deg;; south is 180&deg;; west is 270&deg;. So "the ship is on a bearing of 120&deg;" means: start facing north, rotate clockwise by 120&deg;, and that is the direction to the ship.</div>

<p class="l-text">Beware: this is the <em>opposite</em> rotation sense from the unit-circle convention. To convert a bearing $B$ into the standard mathematical angle $\\theta$ (measured CCW from the positive x-axis, where east is 0&deg; and north is 90&deg;) use:</p>

<div class="calc-formula"><div class="formula-label">BEARING ↔ STANDARD ANGLE</div><div class="formula-main">$$\\theta \\;=\\; 90^\\circ - B \\pmod{360^\\circ}$$</div><div class="formula-sub">Equivalent: x-component (east) is $r\\sin B$, y-component (north) is $r\\cos B$. The sine and cosine swap places compared to the standard convention.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SHIP'S DISPLACEMENT</div><div class="example-body">A ship sails 30 km on a bearing of 060&deg; (east-north-east), then 50 km on a bearing of 150&deg; (south-east). How far is it from its starting point, and on what bearing?<br><br>Leg 1: east-component $30\\sin 60^\\circ = 25.98$, north-component $30\\cos 60^\\circ = 15.00$.<br>Leg 2: east-component $50\\sin 150^\\circ = 25.00$, north-component $50\\cos 150^\\circ = -43.30$.<br>Total east: $51.0$ km. Total north: $-28.3$ km (i.e. 28.3 km south).<br>Distance: $\\sqrt{51^2 + 28.3^2} \\approx 58.3$ km.<br>Bearing back: $\\arctan(51/(-28.3))$ in the south-east quadrant gives $B \\approx \\mathbf{119^\\circ}$. So the ship is 58.3 km from start, on a bearing of about 119&deg; from origin.</div></div>

<h2 class="lesson-title">5. Vector Components: Force, Velocity, Displacement</h2>

<div class="calc-highlight"><strong>Every vector in a 2-D plane is the sum of a horizontal vector and a vertical vector.</strong> If a vector has magnitude $F$ and makes an angle $\\theta$ with the positive x-axis (CCW), then by the very definition of cosine and sine its horizontal and vertical components are:</div>

<div class="calc-formula"><div class="formula-label">CARTESIAN DECOMPOSITION</div><div class="formula-main">$$F_x \\;=\\; F\\cos\\theta, \\qquad F_y \\;=\\; F\\sin\\theta$$</div><div class="formula-sub">Reverse direction: given $F_x$ and $F_y$, recover magnitude $F = \\sqrt{F_x^2 + F_y^2}$ and direction $\\theta = \\arctan(F_y/F_x)$ (with quadrant care).</div></div>

<p class="l-text"><strong>Why this is so powerful.</strong> The hard rule for adding vectors becomes the easy rule for adding numbers: $(F_1 + F_2)_x = F_{1x} + F_{2x}$ and similarly for the y-component. So an entire collection of pushes, pulls, winds, and currents can be collapsed into a single resultant vector by adding their x-components and adding their y-components separately.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ROPE PULLED AT AN ANGLE</div><div class="example-body">A worker pulls a sled with a rope of tension $F = 200$ N at an angle of $\\theta = 35^\\circ$ above the horizontal. What part of the force moves the sled forward, and what part lifts it?<br><br>Horizontal (useful) component: $F_x = 200\\cos 35^\\circ \\approx 163.8$ N.<br>Vertical (lifting) component: $F_y = 200\\sin 35^\\circ \\approx 114.7$ N.<br>If a 20-kg sled has weight $20 \\cdot 9.8 = 196$ N, the rope lifts $114.7$ N of that — the sled is much easier to drag because the effective ground pressure is only $196 - 114.7 = 81.3$ N.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AEROPLANE IN A CROSSWIND</div><div class="example-body">A small plane flies at airspeed 180 km/h on a heading of due east. A north wind blows at 40 km/h (i.e. from north toward south, southward, in the negative-y direction). Find the plane's ground speed and its actual track.<br><br>Plane velocity: $(180, 0)$ km/h (east is +x).<br>Wind velocity: $(0, -40)$ km/h (toward south is &minus;y).<br>Ground velocity: $(180, -40)$ km/h.<br>Ground speed: $\\sqrt{180^2 + 40^2} = \\sqrt{32400 + 1600} = \\sqrt{34000} \\approx 184.4$ km/h.<br>Track angle below east: $\\arctan(40/180) \\approx 12.5^\\circ$.<br>The plane moves at <strong>184.4 km/h, on a heading $12.5^\\circ$ south of east</strong>.</div></div>

<div class="calc-graph"><div id="plot-l10-vector-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this diagram shows:</strong> a force vector $\\vec{F}$ of magnitude 200 N at $35^\\circ$ above the horizontal (orange arrow), with its horizontal component $F_x$ (blue, ground-level) and vertical component $F_y$ (red, side). The rectangle of dotted lines shows the parallelogram construction.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var F=200,th=35*Math.PI/180;
var Fx=F*Math.cos(th),Fy=F*Math.sin(th);
var vecEN={x:[0,Fx],y:[0,Fy],mode:'lines+markers',name:'F (200 N)',line:{color:'#f59e0b',width:3.5},marker:{size:[4,12],symbol:['circle','triangle-right'],color:'#f59e0b'}};
var fxEN={x:[0,Fx],y:[0,0],mode:'lines+markers',name:'Fₓ (163.8 N)',line:{color:'#3b82f6',width:3},marker:{size:[4,10],symbol:['circle','triangle-right'],color:'#3b82f6'}};
var fyEN={x:[Fx,Fx],y:[0,Fy],mode:'lines+markers',name:'Fy (114.7 N)',line:{color:'#ef4444',width:3},marker:{size:[4,10],symbol:['circle','triangle-up'],color:'#ef4444'}};
var rectEN={x:[0,Fx,Fx,0,0],y:[0,0,Fy,Fy,0],mode:'lines',name:'parallelogram',line:{color:'rgba(255,255,255,0.15)',width:1,dash:'dot'},showlegend:false};
var arcVX=[];var arcVY=[];for(var k=0;k<=24;k++){var t=th*k/24;arcVX.push(40*Math.cos(t));arcVY.push(40*Math.sin(t));}
var arcVEN={x:arcVX,y:arcVY,mode:'lines',name:'θ = 35°',line:{color:'#f59e0b',width:2}};
var layoutVEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'horizontal (N)',range:[-20,Fx+30],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'vertical (N)',range:[-20,Fy+30],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l10-vector-en',[rectEN,fxEN,fyEN,arcVEN,vecEN],layoutVEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Periodic Phenomena: The Canonical Sinusoid</h2>

<div class="calc-highlight"><strong>Anything that repeats can be modelled by a sinusoid.</strong> A pure musical tone, the height of the tide at a harbour, the daily average temperature in Istanbul over a year, the position of a point on a rotating fan blade — each is captured by the four-parameter family $y(t) = A\\sin(\\omega t + \\varphi) + C$.</div>

<div class="calc-formula"><div class="formula-label">CANONICAL SINUSOID</div><div class="formula-main">$$y(t) \\;=\\; A\\sin(\\omega t + \\varphi) + C$$</div><div class="formula-sub">$A$ — amplitude (half the peak-to-trough range). $\\omega$ — angular frequency (rad/s). $\\varphi$ — phase shift. $C$ — vertical offset (mean value). Period: $T = 2\\pi/\\omega$. Frequency: $f = 1/T = \\omega/(2\\pi)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Amplitude $A$</div><div class="card-body">Tells you how big the swing is. Doubling $A$ doubles the peak height and the trough depth, with no change in timing.</div></div>
<div class="calc-card"><div class="card-title">Angular frequency $\\omega$</div><div class="card-body">Tells you how fast the cycle repeats. Doubling $\\omega$ halves the period — the wave runs twice as fast.</div></div>
<div class="calc-card"><div class="card-title">Phase $\\varphi$</div><div class="card-body">Shifts the curve left or right in time. A phase of $\\varphi = \\pi/2$ converts $\\sin$ into $\\cos$.</div></div>
<div class="calc-card"><div class="card-title">Offset $C$</div><div class="card-body">Slides the whole curve up or down. The mean of the wave equals $C$ exactly.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A 440 Hz CONCERT-A TONE</div><div class="example-body">Standard musical A is 440 oscillations per second. Model the air-pressure deviation $p(t)$ (in pascals) at a microphone $d = 1$ m from a small loudspeaker producing a peak excursion of $\\pm 0.05$ Pa, with no offset, starting at $t = 0$ with zero pressure rising.<br><br>Amplitude $A = 0.05$. Frequency $f = 440$ Hz, so $\\omega = 2\\pi f = 2\\pi \\cdot 440 \\approx 2765$ rad/s. Phase $\\varphi = 0$. Offset $C = 0$.<br><br>$p(t) = 0.05 \\sin(2765\\,t)$ Pa. Period: $T = 1/440 \\approx 2.27$ ms.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TIDE AT A HARBOUR</div><div class="example-body">A simplified tide model: water level at the harbour mouth rises and falls between 1.2 m and 4.8 m every 12.4 hours. Write $y(t)$ in metres with $t$ in hours, with the peak (high tide) at $t = 3$ h.<br><br>Mean: $C = (4.8 + 1.2)/2 = 3.0$. Amplitude: $A = (4.8 - 1.2)/2 = 1.8$.<br>Period $T = 12.4$ h, so $\\omega = 2\\pi/12.4 \\approx 0.5067$ rad/h.<br>To put the peak at $t = 3$: we need $\\omega \\cdot 3 + \\varphi = \\pi/2$, so $\\varphi = \\pi/2 - 3 \\cdot 0.5067 \\approx 0.0508$ rad.<br><br>$y(t) = 1.8 \\sin(0.5067\\,t + 0.0508) + 3.0$ m.</div></div>

<div class="calc-graph"><div id="plot-l10-wave-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a sinusoid $y = 1.8\\sin(0.5067\\,t + 0.0508) + 3.0$ over two periods, modelling the tide. The horizontal dashed line is the mean ($C = 3.0$ m), the vertical dashed segments mark consecutive high tides separated by one period of 12.4 h, and the amplitude $A = 1.8$ m is the half-swing.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var T=12.4,om=2*Math.PI/T,A=1.8,C=3.0,ph=Math.PI/2-3*om;
var tt=[];var yy=[];for(var i=0;i<=300;i++){var t=i*2*T/300;tt.push(t);yy.push(A*Math.sin(om*t+ph)+C);}
var wEN={x:tt,y:yy,mode:'lines',name:'tide y(t)',line:{color:'#10b981',width:2.5}};
var meanEN={x:[0,2*T],y:[C,C],mode:'lines',name:'mean (C=3 m)',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dash'}};
var peaksEN={x:[3,3+T],y:[A+C,A+C],mode:'markers+text',name:'high tides',marker:{size:10,color:'#f59e0b'},text:['high','high'],textposition:'top center',textfont:{color:'#f59e0b'}};
var ampLineEN={x:[T/4+3,T/4+3],y:[C,C+A],mode:'lines',name:'A = 1.8 m',line:{color:'#ef4444',width:2,dash:'dot'}};
var layoutWEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'time t (hours)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'water level y (m)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l10-wave-en',[wEN,meanEN,ampLineEN,peaksEN],layoutWEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Engineering: Rotating Shafts &amp; Simple Harmonic Motion</h2>

<div class="calc-highlight"><strong>A point fixed on the rim of a uniformly rotating wheel</strong> traces a circle in 2-D, but its <em>shadow</em> on a vertical wall — its projection onto one axis — moves up and down sinusoidally. This is why every constant-rotation mechanical system (engine crankshaft, motor rotor, vibrating spring) ends up obeying the same sinusoidal equation.</div>

<p class="l-text">Let a point lie at radius $r$ on a wheel rotating with constant angular velocity $\\omega$ rad/s. At time $t$ the point sits at $(r\\cos\\omega t,\\,r\\sin\\omega t)$. Its <em>vertical</em> position alone is $y(t) = r\\sin\\omega t$ — a pure sine wave. This is the simplest model of <strong>simple harmonic motion (SHM)</strong>.</p>

<div class="calc-formula"><div class="formula-label">SIMPLE HARMONIC MOTION</div><div class="formula-main">$$y(t) \\;=\\; A\\cos(\\omega t + \\varphi), \\qquad \\omega \\;=\\; 2\\pi f \\;=\\; \\frac{2\\pi}{T}$$</div><div class="formula-sub">Equivalent forms: $A\\sin(\\omega t + \\varphi')$ with $\\varphi' = \\varphi + \\pi/2$. Velocity: $-A\\omega\\sin(\\omega t + \\varphi)$. Acceleration: $-A\\omega^2\\cos(\\omega t + \\varphi) = -\\omega^2 y$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — PISTON IN AN ENGINE</div><div class="example-body">A car engine runs at 3000 rpm (revolutions per minute). The piston has a stroke of 8 cm (so it moves between &minus;4 cm and +4 cm of its mid-position). Write the position of the piston as a function of time, assuming it starts at $y = 0$ moving upward.<br><br>$3000$ rpm $= 50$ rev/s $\\Rightarrow f = 50$ Hz $\\Rightarrow \\omega = 2\\pi \\cdot 50 = 100\\pi \\approx 314$ rad/s. Amplitude $A = 4$ cm. Start at zero moving up means $\\sin$ form with no phase:<br><br>$y(t) = 4\\sin(100\\pi\\, t)$ cm, with $t$ in seconds. Period $T = 1/50 = 20$ ms.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — PENDULUM</div><div class="example-body">A pendulum of length $L = 1$ m swings under gravity with a small-angle period of $T = 2\\pi\\sqrt{L/g} \\approx 2.01$ s. If we release it from $\\theta_0 = 0.1$ rad with zero velocity, the angular position is $\\theta(t) = 0.1\\cos(\\omega t)$ with $\\omega = 2\\pi/T \\approx 3.13$ rad/s.</div></div>

<h2 class="lesson-title">8. Three AYT-Style Applied Problems</h2>

<div class="calc-example"><div class="example-label">AYT-STYLE PROBLEM 1</div><div class="example-body"><strong>Question.</strong> A flagpole 12 m tall stands on a horizontal field. From a point on the field, the angle of elevation of the top of the flagpole is $30^\\circ$. The observer walks $x$ metres directly toward the pole and the angle of elevation becomes $60^\\circ$. Find $x$.<br><br><strong>Solution.</strong> Let $d$ be the distance from the second position to the foot of the pole. Then $12 = d\\tan 60^\\circ = d\\sqrt{3}$, so $d = 12/\\sqrt{3} = 4\\sqrt{3}$.<br>Also $12 = (d+x)\\tan 30^\\circ = (d+x)/\\sqrt{3}$, so $d + x = 12\\sqrt{3}$.<br>Therefore $x = 12\\sqrt{3} - 4\\sqrt{3} = \\mathbf{8\\sqrt{3}\\text{ m} \\approx 13.86\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">AYT-STYLE PROBLEM 2</div><div class="example-body"><strong>Question.</strong> A drone hovers at an altitude of 100 m. From the drone, two trees on the ground are sighted on opposite sides of the drone in the same vertical plane: the first at an angle of depression $\\alpha = 45^\\circ$, the second at $\\beta = 60^\\circ$. What is the distance between the trees?<br><br><strong>Solution.</strong> The horizontal distance from the drone's vertical foot to the first tree is $100/\\tan 45^\\circ = 100$ m. To the second tree it is $100/\\tan 60^\\circ = 100/\\sqrt{3} \\approx 57.74$ m. The trees are on opposite sides, so the total separation is $100 + 100/\\sqrt{3} \\approx \\mathbf{157.74\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">AYT-STYLE PROBLEM 3</div><div class="example-body"><strong>Question.</strong> A ship sails on a bearing of 030&deg; at a constant speed of 20 km/h for 2 hours. Then it changes course to a bearing of 120&deg; for another 1.5 hours, same speed. How far is the ship from its starting position?<br><br><strong>Solution.</strong> Leg 1: 40 km on bearing 030&deg;. East-component $= 40\\sin 30^\\circ = 20$ km. North-component $= 40\\cos 30^\\circ = 20\\sqrt{3} \\approx 34.64$ km.<br>Leg 2: 30 km on bearing 120&deg;. East-component $= 30\\sin 120^\\circ = 15\\sqrt{3} \\approx 25.98$ km. North-component $= 30\\cos 120^\\circ = -15$ km.<br>Total east: $20 + 15\\sqrt{3} \\approx 45.98$ km. Total north: $20\\sqrt{3} - 15 \\approx 19.64$ km.<br>Distance: $\\sqrt{45.98^2 + 19.64^2} \\approx \\sqrt{2114.1 + 385.7} \\approx \\sqrt{2499.8} \\approx \\mathbf{50.0\\text{ km}}$.</div></div>

<h2 class="lesson-title">9. Classical Exercises (Solutions Sketched)</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1 — A BUILDING'S HEIGHT</div><div class="example-body">From a point 25 m from the base of a building, the angle of elevation to the top of the building is $52^\\circ$. The eye of the observer is 1.6 m above the ground. Find the total height.<br><br>$h = 25\\tan 52^\\circ \\approx 25 \\cdot 1.2799 \\approx 32.00$ m above eye. Total: $\\mathbf{32.00 + 1.6 = 33.6\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — MOUNTAIN ELEVATION FROM TWO POSITIONS</div><div class="example-body">Walking along a level road, a hiker measures the angle of elevation to a mountain peak as $20^\\circ$. After walking 500 m closer (still on the same straight road), the angle is $35^\\circ$. Find the height of the peak above the road.<br><br>$h = \\dfrac{500 \\tan 20^\\circ \\tan 35^\\circ}{\\tan 35^\\circ - \\tan 20^\\circ} = \\dfrac{500 \\cdot 0.3640 \\cdot 0.7002}{0.7002 - 0.3640} \\approx \\dfrac{127.4}{0.3362} \\approx \\mathbf{379\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — SATELLITE GROUND TRACK</div><div class="example-body">A low-Earth-orbit satellite passes directly overhead, then 60 seconds later an observer measures its angle of elevation as $40^\\circ$. The satellite travels parallel to the ground at altitude 400 km. What is its horizontal speed?<br><br>When at elevation $40^\\circ$, the horizontal distance from the observer to the point on the ground below the satellite is $400 / \\tan 40^\\circ \\approx 476.7$ km. In 60 s the satellite moved this far horizontally. Speed: $476.7 / 60 \\approx \\mathbf{7.95\\text{ km/s}}$ (matches LEO speeds).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — SOUND WAVE ANALYSIS</div><div class="example-body">A sound wave is modelled by $p(t) = 0.03 \\sin(880\\pi t + \\pi/3)$ Pa, with $t$ in seconds. Find: (a) amplitude, (b) frequency, (c) period, (d) value at $t = 0$.<br><br>(a) Amplitude $A = 0.03$ Pa. (b) $\\omega = 880\\pi$, so $f = \\omega/(2\\pi) = 440$ Hz. (c) $T = 1/f \\approx 2.27$ ms. (d) $p(0) = 0.03\\sin(\\pi/3) = 0.03 \\cdot (\\sqrt{3}/2) \\approx \\mathbf{0.026\\text{ Pa}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — FORCE ON A RAMP</div><div class="example-body">A 50 kg crate sits on a ramp inclined at $25^\\circ$ to the horizontal. Gravity acts straight down with force $W = 50 \\cdot 9.8 = 490$ N. Decompose the weight into a component along the ramp (which pulls the crate down the slope) and a component perpendicular to the ramp (which presses it into the ramp surface).<br><br>Along the ramp: $W \\sin 25^\\circ = 490 \\cdot 0.4226 \\approx \\mathbf{207\\text{ N}}$ (this is the friction-fighting force).<br>Perpendicular: $W \\cos 25^\\circ = 490 \\cdot 0.9063 \\approx \\mathbf{444\\text{ N}}$ (this is the normal force).</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Pick one exercise above and redo it from a clean sheet of paper without looking at the solution. The discipline of <em>drawing the diagram first</em>, labelling every length and angle, and only then writing the trig equation, is the entire skill of applied trigonometry. Every wrong answer to one of these questions in YKS comes from skipping the diagram.</div></div>

<div class="lesson-recap" style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">LESSON RECAP</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Angle of elevation &amp; depression problems reduce to a single tangent: $h = d\\tan\\alpha$ or $d = h/\\tan\\beta$</li>
<li>Two-station problem (target on the far side of an obstacle): $h = \\ell\\tan\\alpha_1\\tan\\alpha_2/(\\tan\\alpha_2 - \\tan\\alpha_1)$</li>
<li>Bearings measured CW from north; convert to standard with $\\theta = 90^\\circ - B \\pmod{360^\\circ}$, components $(r\\sin B,\\,r\\cos B)$</li>
<li>Vector $\\vec{F}$ at angle $\\theta$ decomposes as $F_x = F\\cos\\theta$, $F_y = F\\sin\\theta$; resultants add component-wise</li>
<li>Periodic phenomena fit $y(t) = A\\sin(\\omega t + \\varphi) + C$; period $T = 2\\pi/\\omega$, frequency $f = 1/T$</li>
<li>Simple harmonic motion of any rotating shaft or oscillator obeys $y(t) = A\\cos(\\omega t + \\varphi)$ with $a = -\\omega^2 y$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Trigonometri, harita mühendisleri tırmanamadıkları bir dağı ölçmek için onu kullandıkları an soyut olmaktan çıktı.</strong> Çalıştığın o altı oran — sinüs, kosinüs, tanjant ve karşılıkları — gerçek soruları yanıtlıyor: meydanın karşısındaki minare ne kadar yüksek, gemi deniz fenerinden ne kadar uzakta, kuzeybatıdan saatte 40 km esen rüzgârda uçak hangi yöne sürüklenir? Bu ders en yaygın uygulama kalıplarını tek yerde topluyor ve Türk lisesi ile YKS sınavlarının tekrar tekrar kullandığı standart diyagramları gösteriyor.</p>

<p class="l-text">Bu dersin sonunda bir "yükseklik açısı" / "alçalış açısı" diyagramını ilk bakışta tanıyacak, herhangi bir vektörü tereddütsüz iki dik bileşene ayıracak ve periyodik olayları — ses, gel-git, günlük sıcaklık, dönen bir mil — $A\\sin(\\omega t + \\varphi) + C$ biçiminde tek bir sinüs eğrisiyle modelleyeceksin. Bunlar mühendislerin, harita uzmanlarının, denizcilerin ve fizikçilerin her çalışma gününde kullandığı tekniklerdir. Bu derste Python yok; sadece sin, cos, tan ve terslerini bilen bir hesap makinesi yeterli.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yükseklik açısı ve alçalış açısını kullanarak yükseklik &amp; uzaklık problemleri çözmek (gölge, kule, ağaç)</li>
<li>Kuzeyden ölçülen pusula açısı verildiğinde bir seyrüsefer diyagramını okumak ve standart-konum açılarına çevirmek</li>
<li>Bir vektörü (kuvvet, hız, yer değiştirme) $F_x = F\\cos\\theta$, $F_y = F\\sin\\theta$ ile iki dik bileşene ayırmak</li>
<li>Periyodik olayları (ses, gel-git, sıcaklık) kanonik $y = A\\sin(\\omega t + \\varphi) + C$ sinüsüyle modellemek; periyot, genlik, faz okumak</li>
<li>Dönen bir milde veya sarkaçta basit harmonik hareketi tanımak ve konum denklemini yazmak</li>
<li>Sadece yukarıdaki araçları kullanarak 3 YKS/AYT tarzı uygulama sorusu ve 5 klasik alıştırma çözmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Yükseklik &amp; Uzaklık: Yükseklik Açısı</h2>

<div class="calc-highlight"><strong>Uygulamalı trigonometrinin en yaygın diyagramı.</strong> Bir gözlemci düz zeminde durur ve uzun bir cismin tepesine — bir ağaç, bayrak direği, minare, kule — <em>yukarı</em> bakar. Yatay görüş çizgisi ile cismin tepesine giden yukarı görüş çizgisi arasındaki açıya <strong>yükseklik açısı</strong> denir. Bu açıyı ve gözlemciden cismin dibine olan yatay uzaklığı bilirsen, yükseklik tek bir tanjanttan çıkar.</div>

<p class="l-text">Resmi bir dik üçgen olarak kur. Yatay zemin alt kenar olup uzunluğu $d$ olarak bilinir. Dikey cisim gözlemcinin karşısındaki kenardır, yüksekliği bilinmeyen $h$. Görüş çizgisi hipotenüstür. Yükseklik açısı $\\alpha$ gözlemcinin gözündedir. 2. dersteki tanjant tanımı gereği, $\\alpha$'nın <em>karşısındaki</em> kenar bölü <em>komşusundaki</em> kenar $\\tan\\alpha$'ya eşittir:</p>

<div class="calc-formula"><div class="formula-label">YÜKSEKLİK AÇISINDAN YÜKSEKLİK</div><div class="formula-main">$$\\tan\\alpha \\;=\\; \\frac{h}{d} \\qquad\\Longrightarrow\\qquad h \\;=\\; d\\,\\tan\\alpha$$</div><div class="formula-sub">$d$: gözlemciden cismin dibine yatay uzaklık. $\\alpha$: yatayla yapılan yükseklik açısı. $h$: cismin gözlemcinin gözü üzerindeki yüksekliği.</div></div>

<p class="l-text"><strong>Göz yüksekliğine dikkat.</strong> Formül cismin tepesinin <em>gözlemcinin gözü</em> üzerindeki yüksekliğini verir. Gözlemci 1,70 m boyundaysa, zeminden gerçek yükseklik $h + 1{,}70$ olur. Sınav soruları bazen "gözlemcinin gözü yer hizasında" diyerek bu adımı atlatır; bazen atlatmaz. Dikkatli oku.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GÖLGEDEN AĞAÇ YÜKSEKLİĞİ</div><div class="example-body">Dik bir ağaç, güneş ufuktan $\\alpha = 42^\\circ$ yükseklik açısındayken düz zeminde uzunluğu <strong>$d = 18$ m</strong> olan bir gölge düşürüyor. Ağaç ne kadar yüksek?<br><br>$h = d\\tan\\alpha = 18 \\cdot \\tan 42^\\circ \\approx 18 \\cdot 0{,}9004 \\approx \\mathbf{16{,}21\\text{ m}}$.<br><br>Güneşin ne kadar uzakta olduğunu bilmemize gerek olmadığını fark et — yalnızca açı yeterli.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — UZAKTAN KULE</div><div class="example-body">Bir harita mühendisi bir TV kulesinin dibinden 60 m uzakta durur ve antenin ucuna olan yükseklik açısını $58^\\circ$ olarak ölçer. Aletin yüksekliği yerden 1,5 m'dir. Antenin ucunun yerden yüksekliğini bul.<br><br>Aletin üzerindeki yükseklik: $h = 60 \\tan 58^\\circ \\approx 60 \\cdot 1{,}6003 \\approx 96{,}02$ m.<br>Alet yüksekliğini ekle: toplam $\\approx \\mathbf{97{,}52\\text{ m}}$.</div></div>

<div class="calc-graph"><div id="plot-l10-elevation-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu diyagram neyi gösteriyor:</strong> gözlemci (sol), cismin dibi (sağ) ve tepesi (sağ üst) tarafından oluşturulan dik üçgen. Yükseklik açısı $\\alpha$ gözlemcide; yatay uzaklık $d$ alt kenarda; yükseklik $h$ dikey kenarda yer alır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var d=4,h=3;
var triTR={x:[0,d,d,0],y:[0,0,h,0],mode:'lines',name:'dik üçgen',line:{color:'#3b82f6',width:3},fill:'toself',fillcolor:'rgba(59,130,246,0.08)'};
var horizTR={x:[0,d+0.6],y:[0,0],mode:'lines',name:'yatay (zemin)',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dot'}};
var sightTR={x:[0,d],y:[0,h],mode:'lines',name:'görüş çizgisi',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var observerTR={x:[0],y:[0],mode:'markers+text',name:'gözlemci',marker:{size:12,color:'#10b981'},text:['gözlemci'],textposition:'bottom right',textfont:{color:'#10b981'}};
var topTR={x:[d],y:[h],mode:'markers+text',name:'tepe',marker:{size:12,color:'#ef4444'},text:['tepe'],textposition:'top center',textfont:{color:'#ef4444'}};
var arcAngTR=[];var arcAngYTR=[];for(var k=0;k<=24;k++){var t=Math.atan(h/d)*k/24;arcAngTR.push(0.7*Math.cos(t));arcAngYTR.push(0.7*Math.sin(t));}
var arcTR={x:arcAngTR,y:arcAngYTR,mode:'lines',name:'α',line:{color:'#f59e0b',width:2}};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'yatay uzaklık d',range:[-0.4,d+1.0],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'yükseklik h',range:[-0.4,h+0.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5},annotations:[{x:1.0,y:0.25,text:'α',showarrow:false,font:{color:'#f59e0b',size:18}},{x:d/2,y:-0.25,text:'d',showarrow:false,font:{color:'#9ca3af',size:14}},{x:d+0.25,y:h/2,text:'h',showarrow:false,font:{color:'#9ca3af',size:14}}]};
Plotly.newPlot('plot-l10-elevation-tr',[triTR,horizTR,sightTR,arcTR,observerTR,topTR],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Alçalış Açısı: Yükseklikten Aşağı Bakmak</h2>

<div class="calc-highlight"><strong>Yükseklik açısının ayna görüntüsü.</strong> Şimdi gözlemci bir uçurumda, köprüde veya uçak penceresindedir; hedef aşağıdadır. <em>Yatay görüş çizgisi</em> ile hedefe giden <em>aşağı görüş çizgisi</em> arasındaki açıya <strong>alçalış açısı</strong> denir. Önemli bir nokta: paralel yataylar arasındaki iç-ters açılar gereği, gözlemcideki alçalış açısı hedefteki yükseklik açısına <em>eşittir</em>. Yani aynı tanjant formülü geçerlidir, $h$ artık gözlemcinin hedef üzerindeki yüksekliğidir.</div>

<p class="l-text">Resmi kuralım. Gözlemci zeminden $h$ yüksekliğindedir; hedef gözlemcinin kulesinin dibinden $d$ yatay uzaklıktadır; alçalış açısı $\\beta$ gözdeki yataydan aşağı doğru ölçülür. Aynen önceki gibi:</p>

<div class="calc-formula"><div class="formula-label">ALÇALIŞ AÇISINDAN UZAKLIK</div><div class="formula-main">$$\\tan\\beta \\;=\\; \\frac{h}{d} \\qquad\\Longrightarrow\\qquad d \\;=\\; \\frac{h}{\\tan\\beta}$$</div><div class="formula-sub">Yüksekliğini $h$ ve aşağıdaki bir gemiye olan alçalış açını $\\beta$ bildiğinde, gemiye yatay uzaklığın $h/\\tan\\beta$ olur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DENİZ FENERİNDEN GEMİ</div><div class="example-body">Bir deniz feneri bekçisi deniz seviyesinin 35 m üzerinde durur ve bir balıkçı teknesini $14^\\circ$ alçalış açısıyla görür. Tekne fenerin dibinden ne kadar uzakta?<br><br>$d = h/\\tan\\beta = 35/\\tan 14^\\circ \\approx 35/0{,}2493 \\approx \\mathbf{140{,}4\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İNİŞTEKİ UÇAK</div><div class="example-body">1200 m irtifadaki ticari bir jet, pist eşiğini $3^\\circ$ alçalış açısıyla görür. İnişe kadar daha ne kadar yatay yol kalmıştır?<br><br>$d = 1200/\\tan 3^\\circ \\approx 1200/0{,}0524 \\approx \\mathbf{22{.}900\\text{ m}} \\approx 22{,}9\\text{ km}$. (Standart ILS yaklaşma eğimi yaklaşık $3^\\circ$'dir — bu yüzden yolcu uçakları inişe bu kadar uzaktan başlar.)</div></div>

<div class="l-note"><strong>Klasik hata:</strong> alçalış açısını <em>dikey ile görüş çizgisi arasında</em> çizmek; doğru olan <em>yatay ile görüş çizgisi</em> arasıdır. Diyagrama her zaman gözden geçen yatay kesik çizgiyi çizerek başla. Alçalış açısı bu yataydan aşağı doğru ölçülür.</div>

<h2 class="lesson-title">3. İki Adımlı Problemler: İki Açı, Tek Cisim</h2>

<div class="calc-highlight"><strong>İki istasyon hilesi.</strong> Bazen bir cismin dibine olan uzaklığı ölçemezsin (nehrin karşısındaki dağ, açıktaki ada). Çözüm: <em>iki</em> açıyı <em>iki</em> bilinen konumdan, aynı düz hat üzerinde ölç; yükseklik iki tanjant denkleminden çıkar.</div>

<p class="l-text">Diyelim ki düz yatay bir yolda yürüyorsun ve bir tepenin zirvesine olan yükseklik açısını ölçüyorsun: ilk durakta $\\alpha_1$, ölçülen $\\ell$ kadar yola devam et (tepeye doğru) ve ikinci durakta $\\alpha_2 > \\alpha_1$ okunur. $h$ bilinmeyen yükseklik, $d$ <em>ikinci</em> duraktan tepe dibine yatay uzaklık olsun. O zaman:</p>

<div class="calc-formula"><div class="formula-label">İKİ İSTASYON YÜKSEKLİK FORMÜLÜ</div><div class="formula-main">$$h \\;=\\; d\\tan\\alpha_2 \\;=\\; (d + \\ell)\\tan\\alpha_1$$</div><div class="formula-sub">İki denklemi $d$ ve $h$ için birlikte çöz. Sonuç: $\\displaystyle h = \\frac{\\ell\\,\\tan\\alpha_1 \\tan\\alpha_2}{\\tan\\alpha_2 - \\tan\\alpha_1}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — NEHRİN KARŞISINDAKİ DAĞ</div><div class="example-body">Bir nehrin yakın kıyısından bir zirveye yükseklik açısı $\\alpha_1 = 22^\\circ$. Nehre doğru düz olarak $\\ell = 150$ m yürüdükten sonra açı $\\alpha_2 = 31^\\circ$ olur. Nehir engelinden dolayı $d$ ölçülemiyor. Zirvenin yoldan yüksekliği nedir?<br><br>Formüle yerleştir:<br><br>$h = \\dfrac{150 \\cdot \\tan 22^\\circ \\cdot \\tan 31^\\circ}{\\tan 31^\\circ - \\tan 22^\\circ} = \\dfrac{150 \\cdot 0{,}4040 \\cdot 0{,}6009}{0{,}6009 - 0{,}4040} = \\dfrac{36{,}42}{0{,}1969} \\approx \\mathbf{185{,}0\\text{ m}}$.</div></div>

<h2 class="lesson-title">4. Seyrüsefer: Kuzeyden Pusula Açıları</h2>

<div class="calc-highlight"><strong>Denizciler ve havacılar standart-konum açılarını kullanmaz.</strong> Bir <em>pusula açısı</em> (bearing) <strong>kuzeyden saat yönünde</strong> 0&deg; ile 360&deg; arasında ölçülür. Kuzeyin kendisi 000&deg; veya 360&deg;; doğu 090&deg;; güney 180&deg;; batı 270&deg;. Yani "geminin pusula açısı 120&deg;" demek: kuzeye dön, saat yönünde 120&deg; çevir, gemi o yöndedir.</div>

<p class="l-text">Dikkat: bu dönüş yönü birim çember kuralının <em>tersi</em>dir. Bir pusula açısı $B$'yi standart matematiksel açıya $\\theta$ (pozitif x-ekseninden CCW, doğu 0&deg;, kuzey 90&deg;) çevirmek için:</p>

<div class="calc-formula"><div class="formula-label">PUSULA ↔ STANDART AÇI</div><div class="formula-main">$$\\theta \\;=\\; 90^\\circ - B \\pmod{360^\\circ}$$</div><div class="formula-sub">Eşdeğer: doğu bileşeni (x) $r\\sin B$, kuzey bileşeni (y) $r\\cos B$. Standart kurala göre sinüs ve kosinüs yer değiştirir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GEMİNİN YER DEĞİŞTİRMESİ</div><div class="example-body">Bir gemi önce 060&deg; pusula açısıyla 30 km, sonra 150&deg; pusula açısıyla 50 km yol alır. Başlangıç noktasından ne kadar uzakta ve hangi pusula açısındadır?<br><br>1. ayak: doğu-bileşeni $30\\sin 60^\\circ = 25{,}98$, kuzey-bileşeni $30\\cos 60^\\circ = 15{,}00$.<br>2. ayak: doğu-bileşeni $50\\sin 150^\\circ = 25{,}00$, kuzey-bileşeni $50\\cos 150^\\circ = -43{,}30$.<br>Toplam doğu: $51{,}0$ km. Toplam kuzey: $-28{,}3$ km (yani 28,3 km güney).<br>Uzaklık: $\\sqrt{51^2 + 28{,}3^2} \\approx 58{,}3$ km.<br>Geri dönüş pusulası: güney-doğu bölgesinde $\\arctan(51/(-28{,}3))$ verir $B \\approx \\mathbf{119^\\circ}$. Yani gemi başlangıçtan 58,3 km uzakta, yaklaşık 119&deg; pusula açısındadır.</div></div>

<h2 class="lesson-title">5. Vektör Bileşenleri: Kuvvet, Hız, Yer Değiştirme</h2>

<div class="calc-highlight"><strong>2-B düzlemdeki her vektör bir yatay vektör ile bir dikey vektörün toplamıdır.</strong> Bir vektörün büyüklüğü $F$ ve pozitif x-ekseni ile CCW yönünde $\\theta$ açısı yapıyorsa, kosinüs ve sinüsün tanımı gereği yatay ve dikey bileşenleri şöyledir:</div>

<div class="calc-formula"><div class="formula-label">KARTEZYEN AYRIŞIM</div><div class="formula-main">$$F_x \\;=\\; F\\cos\\theta, \\qquad F_y \\;=\\; F\\sin\\theta$$</div><div class="formula-sub">Ters yön: $F_x$ ve $F_y$ verildiğinde büyüklük $F = \\sqrt{F_x^2 + F_y^2}$ ve yön $\\theta = \\arctan(F_y/F_x)$ (bölgeye dikkat).</div></div>

<p class="l-text"><strong>Bu neden çok güçlü.</strong> Vektör toplamanın zor kuralı sayı toplamanın kolay kuralına döner: $(F_1 + F_2)_x = F_{1x} + F_{2x}$ ve dikey için aynı. Yani itme, çekme, rüzgâr ve akıntıların tüm koleksiyonu, x-bileşenleri ayrı, y-bileşenleri ayrı toplanarak tek bir bileşke vektöre indirgenir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — AÇILI ÇEKİLEN İP</div><div class="example-body">Bir işçi yatayla $\\theta = 35^\\circ$ açı yapan ve gerilimi $F = 200$ N olan bir iple bir kızağı çekiyor. Kuvvetin hangi kısmı kızağı ileri taşıyor, hangi kısmı kaldırıyor?<br><br>Yatay (faydalı) bileşen: $F_x = 200\\cos 35^\\circ \\approx 163{,}8$ N.<br>Dikey (kaldırıcı) bileşen: $F_y = 200\\sin 35^\\circ \\approx 114{,}7$ N.<br>20 kg'lık kızağın ağırlığı $20 \\cdot 9{,}8 = 196$ N ise, ip bunun $114{,}7$ N'unu kaldırır — etkili yer basıncı yalnızca $196 - 114{,}7 = 81{,}3$ N olduğundan kızak çok daha kolay çekilir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — YAN RÜZGÂRDA UÇAK</div><div class="example-body">Küçük bir uçak doğuya doğru 180 km/h hava hızıyla uçuyor. Kuzeyden 40 km/h rüzgâr esiyor (yani kuzeyden güneye, &minus;y yönünde). Uçağın yer hızını ve gerçek izini bul.<br><br>Uçak hızı: $(180, 0)$ km/h (doğu +x).<br>Rüzgâr hızı: $(0, -40)$ km/h (güneye doğru &minus;y).<br>Yer hızı: $(180, -40)$ km/h.<br>Yer hızı büyüklüğü: $\\sqrt{180^2 + 40^2} = \\sqrt{32400 + 1600} = \\sqrt{34000} \\approx 184{,}4$ km/h.<br>Doğunun altındaki iz açısı: $\\arctan(40/180) \\approx 12{,}5^\\circ$.<br>Uçak <strong>184,4 km/h hızla, doğunun $12{,}5^\\circ$ güneyine</strong> doğru hareket eder.</div></div>

<div class="calc-graph"><div id="plot-l10-vector-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu diyagram neyi gösteriyor:</strong> yatayla $35^\\circ$ açıdaki 200 N büyüklüğünde bir $\\vec{F}$ kuvvet vektörü (turuncu ok), yatay bileşeni $F_x$ (mavi, zemin) ve dikey bileşeni $F_y$ (kırmızı, yan). Noktalı çizgilerle paralelkenar inşası gösteriliyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var F=200,th=35*Math.PI/180;
var Fx=F*Math.cos(th),Fy=F*Math.sin(th);
var vecTR={x:[0,Fx],y:[0,Fy],mode:'lines+markers',name:'F (200 N)',line:{color:'#f59e0b',width:3.5},marker:{size:[4,12],symbol:['circle','triangle-right'],color:'#f59e0b'}};
var fxTR={x:[0,Fx],y:[0,0],mode:'lines+markers',name:'Fₓ (163,8 N)',line:{color:'#3b82f6',width:3},marker:{size:[4,10],symbol:['circle','triangle-right'],color:'#3b82f6'}};
var fyTR={x:[Fx,Fx],y:[0,Fy],mode:'lines+markers',name:'Fy (114,7 N)',line:{color:'#ef4444',width:3},marker:{size:[4,10],symbol:['circle','triangle-up'],color:'#ef4444'}};
var rectTR={x:[0,Fx,Fx,0,0],y:[0,0,Fy,Fy,0],mode:'lines',name:'paralelkenar',line:{color:'rgba(255,255,255,0.15)',width:1,dash:'dot'},showlegend:false};
var arcVXTR=[];var arcVYTR=[];for(var k=0;k<=24;k++){var t=th*k/24;arcVXTR.push(40*Math.cos(t));arcVYTR.push(40*Math.sin(t));}
var arcVTR={x:arcVXTR,y:arcVYTR,mode:'lines',name:'θ = 35°',line:{color:'#f59e0b',width:2}};
var layoutVTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'yatay (N)',range:[-20,Fx+30],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'dikey (N)',range:[-20,Fy+30],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l10-vector-tr',[rectTR,fxTR,fyTR,arcVTR,vecTR],layoutVTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Periyodik Olaylar: Kanonik Sinüs Eğrisi</h2>

<div class="calc-highlight"><strong>Tekrar eden her şey bir sinüs eğrisiyle modellenebilir.</strong> Saf bir müzik tonu, bir limandaki gel-git yüksekliği, bir yıl boyunca İstanbul'un günlük ortalama sıcaklığı, dönen bir vantilatör kanadındaki bir noktanın konumu — her biri dört parametreli $y(t) = A\\sin(\\omega t + \\varphi) + C$ ailesiyle yakalanır.</div>

<div class="calc-formula"><div class="formula-label">KANONİK SİNÜS EĞRİSİ</div><div class="formula-main">$$y(t) \\;=\\; A\\sin(\\omega t + \\varphi) + C$$</div><div class="formula-sub">$A$ — genlik (tepe-çukur aralığının yarısı). $\\omega$ — açısal frekans (rad/s). $\\varphi$ — faz kayması. $C$ — dikey ofset (ortalama). Periyot: $T = 2\\pi/\\omega$. Frekans: $f = 1/T = \\omega/(2\\pi)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genlik $A$</div><div class="card-body">Salınımın büyüklüğünü söyler. $A$'yı iki katına çıkarmak tepe ile çukurun yüksekliğini iki katına çıkarır, zamanlamayı değiştirmez.</div></div>
<div class="calc-card"><div class="card-title">Açısal frekans $\\omega$</div><div class="card-body">Döngünün ne kadar hızlı tekrarladığını söyler. $\\omega$'yı iki katına çıkarmak periyodu yarıya indirir — dalga iki kat hızlı koşar.</div></div>
<div class="calc-card"><div class="card-title">Faz $\\varphi$</div><div class="card-body">Eğriyi zamanda sağa veya sola kaydırır. $\\varphi = \\pi/2$ fazı $\\sin$'i $\\cos$'a çevirir.</div></div>
<div class="calc-card"><div class="card-title">Ofset $C$</div><div class="card-body">Tüm eğriyi yukarı/aşağı kaydırır. Dalganın ortalaması tam olarak $C$'ye eşittir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 440 Hz LA TONU</div><div class="example-body">Standart müzik La'sı saniyede 440 salınımdır. Küçük bir hoparlörden $d = 1$ m uzaktaki bir mikrofonda hava-basıncı sapması $p(t)$'yi (paskal cinsinden) modelle; tepe genlik $\\pm 0{,}05$ Pa, ofset yok, $t = 0$'da basınç sıfır ve yükseliyor.<br><br>Genlik $A = 0{,}05$. Frekans $f = 440$ Hz, yani $\\omega = 2\\pi f = 2\\pi \\cdot 440 \\approx 2765$ rad/s. Faz $\\varphi = 0$. Ofset $C = 0$.<br><br>$p(t) = 0{,}05 \\sin(2765\\,t)$ Pa. Periyot: $T = 1/440 \\approx 2{,}27$ ms.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — LİMANDA GEL-GİT</div><div class="example-body">Basitleştirilmiş gel-git modeli: liman ağzındaki su seviyesi her 12,4 saatte bir 1,2 m ile 4,8 m arasında yükselip alçalır. $y(t)$'yi metre cinsinden yaz, $t$ saat olsun, tepe (kabarma) $t = 3$ saatte olsun.<br><br>Ortalama: $C = (4{,}8 + 1{,}2)/2 = 3{,}0$. Genlik: $A = (4{,}8 - 1{,}2)/2 = 1{,}8$.<br>Periyot $T = 12{,}4$ saat, yani $\\omega = 2\\pi/12{,}4 \\approx 0{,}5067$ rad/saat.<br>Tepeyi $t = 3$'e koymak için: $\\omega \\cdot 3 + \\varphi = \\pi/2$ olmalı, yani $\\varphi = \\pi/2 - 3 \\cdot 0{,}5067 \\approx 0{,}0508$ rad.<br><br>$y(t) = 1{,}8 \\sin(0{,}5067\\,t + 0{,}0508) + 3{,}0$ m.</div></div>

<div class="calc-graph"><div id="plot-l10-wave-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> gel-giti modelleyen $y = 1{,}8\\sin(0{,}5067\\,t + 0{,}0508) + 3{,}0$ sinüs eğrisi iki periyot boyunca. Yatay kesik çizgi ortalama ($C = 3{,}0$ m), dikey kesik parçalar 12,4 saatlik bir periyotla ayrılmış ardışık kabarma tepelerini, $A = 1{,}8$ m yarı-salınımı işaret eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var T=12.4,om=2*Math.PI/T,A=1.8,C=3.0,ph=Math.PI/2-3*om;
var tt=[];var yy=[];for(var i=0;i<=300;i++){var t=i*2*T/300;tt.push(t);yy.push(A*Math.sin(om*t+ph)+C);}
var wTR={x:tt,y:yy,mode:'lines',name:'gel-git y(t)',line:{color:'#10b981',width:2.5}};
var meanTR={x:[0,2*T],y:[C,C],mode:'lines',name:'ortalama (C=3 m)',line:{color:'rgba(255,255,255,0.4)',width:1.5,dash:'dash'}};
var peaksTR={x:[3,3+T],y:[A+C,A+C],mode:'markers+text',name:'kabarmalar',marker:{size:10,color:'#f59e0b'},text:['kabarma','kabarma'],textposition:'top center',textfont:{color:'#f59e0b'}};
var ampLineTR={x:[T/4+3,T/4+3],y:[C,C+A],mode:'lines',name:'A = 1,8 m',line:{color:'#ef4444',width:2,dash:'dot'}};
var layoutWTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'zaman t (saat)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'su seviyesi y (m)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l10-wave-tr',[wTR,meanTR,ampLineTR,peaksTR],layoutWTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Mühendislik: Dönen Miller &amp; Basit Harmonik Hareket</h2>

<div class="calc-highlight"><strong>Düzgün dönen bir tekerleğin çevresine sabitlenmiş bir nokta</strong> 2-B'de bir çember çizer, ama dikey duvardaki <em>gölgesi</em> — bir eksene izdüşümü — sinüsoidal olarak yukarı aşağı hareket eder. Bu yüzden her sabit-dönüşlü mekanik sistem (motor krank mili, motor rotoru, titreşen yay) aynı sinüs denklemine uyar.</div>

<p class="l-text">Sabit açısal hız $\\omega$ rad/s ile dönen bir tekerleğin çevresinde $r$ yarıçapında bir nokta olsun. $t$ anında nokta $(r\\cos\\omega t,\\,r\\sin\\omega t)$ konumundadır. Tek başına <em>dikey</em> konumu $y(t) = r\\sin\\omega t$ — saf bir sinüs dalgasıdır. Bu <strong>basit harmonik hareketin (BHH)</strong> en basit modelidir.</p>

<div class="calc-formula"><div class="formula-label">BASİT HARMONİK HAREKET</div><div class="formula-main">$$y(t) \\;=\\; A\\cos(\\omega t + \\varphi), \\qquad \\omega \\;=\\; 2\\pi f \\;=\\; \\frac{2\\pi}{T}$$</div><div class="formula-sub">Eşdeğer biçimler: $A\\sin(\\omega t + \\varphi')$ ile $\\varphi' = \\varphi + \\pi/2$. Hız: $-A\\omega\\sin(\\omega t + \\varphi)$. İvme: $-A\\omega^2\\cos(\\omega t + \\varphi) = -\\omega^2 y$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — MOTOR PİSTONU</div><div class="example-body">Bir araba motoru 3000 rpm (dakikada devir) hızında çalışıyor. Pistonun stroku 8 cm (yani orta-konumunun &minus;4 cm ile +4 cm arasında hareket eder). Pistonun konumunu zamanın fonksiyonu olarak yaz; başlangıçta $y = 0$ ve yukarı hareket ediyor.<br><br>$3000$ rpm $= 50$ devir/s $\\Rightarrow f = 50$ Hz $\\Rightarrow \\omega = 2\\pi \\cdot 50 = 100\\pi \\approx 314$ rad/s. Genlik $A = 4$ cm. Sıfırdan yukarı başlamak fazsız sinüs biçimi demek:<br><br>$y(t) = 4\\sin(100\\pi\\, t)$ cm, $t$ saniye. Periyot $T = 1/50 = 20$ ms.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SARKAÇ</div><div class="example-body">$L = 1$ m uzunluğundaki bir sarkaç yerçekimi etkisinde küçük-açı periyodu $T = 2\\pi\\sqrt{L/g} \\approx 2{,}01$ s ile salınır. $\\theta_0 = 0{,}1$ rad'dan sıfır hızla bırakırsak, açısal konum $\\theta(t) = 0{,}1\\cos(\\omega t)$ olur, $\\omega = 2\\pi/T \\approx 3{,}13$ rad/s.</div></div>

<h2 class="lesson-title">8. Üç AYT Tarzı Uygulama Problemi</h2>

<div class="calc-example"><div class="example-label">AYT TARZI PROBLEM 1</div><div class="example-body"><strong>Soru.</strong> 12 m yüksekliğindeki bir bayrak direği yatay bir tarlada duruyor. Tarladaki bir noktadan direğin tepesinin yükseklik açısı $30^\\circ$. Gözlemci direğe doğru $x$ metre yürüyor ve yükseklik açısı $60^\\circ$ oluyor. $x$'i bul.<br><br><strong>Çözüm.</strong> $d$ ikinci konumdan direğin dibine uzaklık olsun. O zaman $12 = d\\tan 60^\\circ = d\\sqrt{3}$, yani $d = 12/\\sqrt{3} = 4\\sqrt{3}$.<br>Ayrıca $12 = (d+x)\\tan 30^\\circ = (d+x)/\\sqrt{3}$, yani $d + x = 12\\sqrt{3}$.<br>Buradan $x = 12\\sqrt{3} - 4\\sqrt{3} = \\mathbf{8\\sqrt{3}\\text{ m} \\approx 13{,}86\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">AYT TARZI PROBLEM 2</div><div class="example-body"><strong>Soru.</strong> Bir drone 100 m irtifada havalanıyor. Drone'dan iki ağaç, aynı düşey düzlemde drone'un iki yanında görülüyor: ilki $\\alpha = 45^\\circ$ alçalış açısında, ikincisi $\\beta = 60^\\circ$ alçalış açısında. Ağaçlar arasındaki uzaklık nedir?<br><br><strong>Çözüm.</strong> Drone'un dikey ayağından ilk ağaca yatay uzaklık $100/\\tan 45^\\circ = 100$ m. İkinci ağaca $100/\\tan 60^\\circ = 100/\\sqrt{3} \\approx 57{,}74$ m. Ağaçlar zıt taraflarda olduğundan toplam ayrım $100 + 100/\\sqrt{3} \\approx \\mathbf{157{,}74\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">AYT TARZI PROBLEM 3</div><div class="example-body"><strong>Soru.</strong> Bir gemi 030&deg; pusula açısıyla saatte 20 km sabit hızla 2 saat ilerliyor. Ardından 120&deg; pusula açısına dönüp 1,5 saat aynı hızla devam ediyor. Gemi başlangıç noktasından ne kadar uzaktadır?<br><br><strong>Çözüm.</strong> 1. ayak: 030&deg; pusula ile 40 km. Doğu-bileşeni $= 40\\sin 30^\\circ = 20$ km. Kuzey-bileşeni $= 40\\cos 30^\\circ = 20\\sqrt{3} \\approx 34{,}64$ km.<br>2. ayak: 120&deg; pusula ile 30 km. Doğu-bileşeni $= 30\\sin 120^\\circ = 15\\sqrt{3} \\approx 25{,}98$ km. Kuzey-bileşeni $= 30\\cos 120^\\circ = -15$ km.<br>Toplam doğu: $20 + 15\\sqrt{3} \\approx 45{,}98$ km. Toplam kuzey: $20\\sqrt{3} - 15 \\approx 19{,}64$ km.<br>Uzaklık: $\\sqrt{45{,}98^2 + 19{,}64^2} \\approx \\sqrt{2114{,}1 + 385{,}7} \\approx \\sqrt{2499{,}8} \\approx \\mathbf{50{,}0\\text{ km}}$.</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar (Çözüm Taslakları)</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — BİR BİNANIN YÜKSEKLİĞİ</div><div class="example-body">Bir binanın dibinden 25 m uzaktaki bir noktadan binanın tepesinin yükseklik açısı $52^\\circ$. Gözlemcinin gözü yerden 1,6 m yukarıda. Toplam yüksekliği bul.<br><br>$h = 25\\tan 52^\\circ \\approx 25 \\cdot 1{,}2799 \\approx 32{,}00$ m gözün üzerinde. Toplam: $\\mathbf{32{,}00 + 1{,}6 = 33{,}6\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — İKİ KONUMDAN DAĞ ÖLÇÜMÜ</div><div class="example-body">Düz bir yolda yürüyen bir dağcı bir dağ zirvesine yükseklik açısını $20^\\circ$ olarak ölçer. 500 m daha yakına yürüdükten sonra (aynı düz yolda) açı $35^\\circ$ olur. Zirvenin yoldan yüksekliğini bul.<br><br>$h = \\dfrac{500 \\tan 20^\\circ \\tan 35^\\circ}{\\tan 35^\\circ - \\tan 20^\\circ} = \\dfrac{500 \\cdot 0{,}3640 \\cdot 0{,}7002}{0{,}7002 - 0{,}3640} \\approx \\dfrac{127{,}4}{0{,}3362} \\approx \\mathbf{379\\text{ m}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — UYDU YER İZİ</div><div class="example-body">Alçak yörüngedeki bir uydu doğrudan tepeden geçtikten 60 saniye sonra gözlemci yükseklik açısını $40^\\circ$ ölçer. Uydu zemine paralel 400 km irtifada gider. Yatay hızını bul.<br><br>$40^\\circ$ yükseklikteyken gözlemciden uydunun altındaki yer noktasına yatay uzaklık $400 / \\tan 40^\\circ \\approx 476{,}7$ km. 60 saniyede uydu bu kadar yatay yol aldı. Hız: $476{,}7 / 60 \\approx \\mathbf{7{,}95\\text{ km/s}}$ (alçak yörünge hızlarıyla uyumlu).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — SES DALGASI ANALİZİ</div><div class="example-body">Bir ses dalgası $p(t) = 0{,}03 \\sin(880\\pi t + \\pi/3)$ Pa ile modellenmiş, $t$ saniye. Bul: (a) genlik, (b) frekans, (c) periyot, (d) $t = 0$'daki değer.<br><br>(a) Genlik $A = 0{,}03$ Pa. (b) $\\omega = 880\\pi$, yani $f = \\omega/(2\\pi) = 440$ Hz. (c) $T = 1/f \\approx 2{,}27$ ms. (d) $p(0) = 0{,}03\\sin(\\pi/3) = 0{,}03 \\cdot (\\sqrt{3}/2) \\approx \\mathbf{0{,}026\\text{ Pa}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — EĞİK DÜZLEMDE KUVVET</div><div class="example-body">50 kg'lık bir sandık yatayla $25^\\circ$ açı yapan bir rampada duruyor. Yerçekimi $W = 50 \\cdot 9{,}8 = 490$ N kuvvetle dosdoğru aşağı etki ediyor. Ağırlığı rampa boyunca (sandığı eğimden aşağı çekecek) ve rampaya dik (sandığı rampa yüzeyine bastıracak) iki bileşene ayır.<br><br>Rampa boyunca: $W \\sin 25^\\circ = 490 \\cdot 0{,}4226 \\approx \\mathbf{207\\text{ N}}$ (sürtünmeyle savaşan kuvvet).<br>Dik: $W \\cos 25^\\circ = 490 \\cdot 0{,}9063 \\approx \\mathbf{444\\text{ N}}$ (normal kuvvet).</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Yukarıdaki alıştırmalardan birini seç ve çözüme bakmadan temiz bir kağıttan baştan yap. Diyagramı <em>önce çizme</em>, her uzunluğu ve açıyı etiketleme, ancak ondan sonra trig denklemini yazma disiplini — uygulamalı trigonometrinin tüm becerisidir. YKS'de bu soruların her yanlış yanıtı diyagramı atlamaktan gelir.</div></div>

<div class="lesson-recap" style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yükseklik &amp; alçalış açısı problemleri tek bir tanjanta indirgenir: $h = d\\tan\\alpha$ veya $d = h/\\tan\\beta$</li>
<li>İki istasyon problemi (engelin ardındaki hedef): $h = \\ell\\tan\\alpha_1\\tan\\alpha_2/(\\tan\\alpha_2 - \\tan\\alpha_1)$</li>
<li>Pusula açıları kuzeyden CW; standarda çevirmek için $\\theta = 90^\\circ - B \\pmod{360^\\circ}$, bileşenler $(r\\sin B,\\,r\\cos B)$</li>
<li>$\\theta$ açısındaki $\\vec{F}$ vektörü $F_x = F\\cos\\theta$, $F_y = F\\sin\\theta$'ya ayrışır; bileşkeler bileşenlerin toplamıdır</li>
<li>Periyodik olaylar $y(t) = A\\sin(\\omega t + \\varphi) + C$'ye oturur; periyot $T = 2\\pi/\\omega$, frekans $f = 1/T$</li>
<li>Dönen mil veya osilatörün basit harmonik hareketi $y(t) = A\\cos(\\omega t + \\varphi)$'ye uyar; $a = -\\omega^2 y$</li>
</ul>
</div>`

};
