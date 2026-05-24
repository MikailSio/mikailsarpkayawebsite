window.LISE_MAT_L33 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The integral computes more than flat area.</strong> If you take a curve in the plane and spin it around an axis, you sweep out a three-dimensional body — a wine glass, a vase, a lampshade, a turbine blade — whose <em>volume</em> is not given by any school-formula. Cones, spheres, paraboloids and toruses all arise this way. This lesson shows how the same Riemann-sum trick that gave us area gives us the volume of any such body. We slice the solid into thin pieces, recognise each piece as a disk, a washer, or a cylindrical shell, sum up the elementary volumes, and pass to the limit. The result is a single integral.</p>

<p class="l-text">You will see three methods. The <strong>disk method</strong> slices perpendicular to the rotation axis when the region touches the axis. The <strong>washer method</strong> handles the case where two curves bound the region and the inner one leaves an empty cylindrical core. The <strong>shell method</strong> takes vertical strips parallel to the axis and rolls each strip into a cylindrical sleeve. Choosing the right method up front cuts the work dramatically. By the end of the lesson you will recognise on sight which method belongs to which problem.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Picture a solid of revolution as the body swept out by rotating a plane region around an axis</li>
<li>Apply the disk method $V = \\pi\\int_a^b [f(x)]^2\\,dx$ when the region touches the rotation axis</li>
<li>Apply the washer method $V = \\pi\\int_a^b \\bigl[R(x)^2 - r(x)^2\\bigr]\\,dx$ for regions with an inner hole</li>
<li>Apply the shell method $V = 2\\pi\\int_a^b x\\,f(x)\\,dx$ when strips run parallel to the axis</li>
<li>Choose between disk and shell based on the geometry: perpendicular vs parallel strips</li>
<li>Handle rotation around the y-axis by integrating with respect to $y$ or by switching to shells</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Solid of Revolution?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine a potter at the wheel. A lump of clay sits on the wheel and spins around the vertical spindle. As the potter shapes the clay with their fingers, every point at radius $r$ traces out a full circle. The final pot is a <em>solid of revolution</em>: a body with rotational symmetry around the spindle axis, whose entire shape is captured by a single profile curve seen from the side.</div>

<p class="l-text">Formally: take a plane region $R$ that lies on one side of a line $L$. Rotate $R$ a full $360°$ around $L$. The set of points swept out is a three-dimensional <strong>solid of revolution</strong>. The line $L$ is the <em>axis of revolution</em> and the boundary curve of $R$ is the <em>profile</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Profile $\\to$ solid</div><div class="card-body">A horizontal line segment becomes a cylinder. A slanted line becomes a cone. A semicircle becomes a sphere. A parabola $y = \\sqrt{x}$ becomes a paraboloid.</div></div>
<div class="calc-card"><div class="card-title">Symmetry</div><div class="card-body">Every cross-section perpendicular to the axis is a circle. This circular symmetry is the reason a one-dimensional integral can capture a three-dimensional volume.</div></div>
<div class="calc-card"><div class="card-title">Cross-section radius</div><div class="card-body">At position $x$ along the axis, the cross-section is a disk of radius equal to the distance from the axis to the profile curve — for the standard setup, simply $f(x)$.</div></div>
<div class="calc-card"><div class="card-title">Why integrals?</div><div class="card-body">Stack many thin disks (or washers, or shells), add their volumes, refine the slicing until each piece is infinitesimal. The limit is the volume.</div></div>
</div>

<div class="think-box"><div class="think-label">VOLUME OF A KNOWN SHAPE</div><div class="think-body">Spinning the line segment $y = R$ from $x = 0$ to $x = h$ around the x-axis gives a cylinder of radius $R$ and height $h$. Its volume should be $\\pi R^2 h$. We will recover this in section 2 as the simplest case of the disk method.</div></div>

<div class="calc-graph"><div id="plot-l33-intro-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the profile curve $y = \\sqrt{x}$ on the left, and the paraboloid swept out when that profile is rotated a full turn around the x-axis. Every cross-section perpendicular to the axis is a circle whose radius equals the height $\\sqrt{x}$ of the profile at that location.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];for(var i=0;i<=80;i++){var x=4*i/80;xs.push(x);ys.push(Math.sqrt(x));}
var profile={x:xs,y:ys,mode:'lines',line:{color:'#3b82f6',width:3},name:'y = √x',xaxis:'x1',yaxis:'y1'};
var axisLine={x:[0,4],y:[0,0],mode:'lines',line:{color:'#c8a96e',width:2,dash:'dash'},name:'rotation axis',xaxis:'x1',yaxis:'y1'};
var ths=[];for(var k=0;k<=40;k++)ths.push(2*Math.PI*k/40);
var mx=[],my=[],mz=[];
for(var i=0;i<=30;i++){var xv=4*i/30;var rv=Math.sqrt(xv);var row1=[],row2=[],row3=[];for(var k=0;k<=40;k++){var t=ths[k];row1.push(xv);row2.push(rv*Math.cos(t));row3.push(rv*Math.sin(t));}mx.push(row1);my.push(row2);mz.push(row3);}
var solid={type:'surface',x:mx,y:my,z:mz,colorscale:[[0,'#3b82f6'],[1,'#c8a96e']],opacity:0.85,showscale:false,name:'paraboloid',scene:'scene2'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},grid:{rows:1,columns:2,pattern:'independent'},margin:{t:30,r:10,b:30,l:10},showlegend:false,xaxis:{domain:[0,0.42],gridcolor:'rgba(255,255,255,0.08)',title:'x',range:[-0.2,4.3]},yaxis:{domain:[0,1],gridcolor:'rgba(255,255,255,0.08)',title:'y',range:[-0.5,2.4],scaleanchor:'x',scaleratio:1},scene2:{domain:{x:[0.5,1],y:[0,1]},xaxis:{title:'x',color:'#ebe6dc',gridcolor:'rgba(255,255,255,0.08)'},yaxis:{title:'y',color:'#ebe6dc',gridcolor:'rgba(255,255,255,0.08)'},zaxis:{title:'z',color:'#ebe6dc',gridcolor:'rgba(255,255,255,0.08)'},bgcolor:'rgba(0,0,0,0)',camera:{eye:{x:1.6,y:1.4,z:0.8}}},annotations:[{x:0.21,y:1.04,xref:'paper',yref:'paper',text:'profile',showarrow:false,font:{color:'#3b82f6',size:13}},{x:0.75,y:1.04,xref:'paper',yref:'paper',text:'solid of revolution',showarrow:false,font:{color:'#c8a96e',size:13}}]};
Plotly.newPlot('plot-l33-intro-en',[profile,axisLine,solid],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. The Disk Method</h2>

<p class="l-text">Suppose $f(x) \\geq 0$ on $[a, b]$ and we rotate the region between $y = f(x)$ and the x-axis around the x-axis. Slice the solid perpendicular to the axis at position $x$. The cross-section is a <em>disk</em> of radius $f(x)$ and area $\\pi[f(x)]^2$. Give it a thickness $dx$ and the volume of one infinitesimal disk is</p>

<div class="calc-formula"><div class="formula-main">$$dV \\;=\\; \\pi\\,[f(x)]^2\\,dx.$$</div></div>

<p class="l-text">Stack and integrate from $x = a$ to $x = b$:</p>

<div class="calc-formula"><div class="formula-label">DISK METHOD (ROTATION AROUND x-AXIS)</div><div class="formula-main">$$V \\;=\\; \\pi\\int_a^b [\\,f(x)\\,]^2\\,dx$$</div><div class="formula-sub">Each cross-section is a full disk because the region touches the axis (no inner hole). The radius equals the height of the profile, $f(x)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to use it</div><div class="card-body">The region's boundary touches the rotation axis, so no central hole is left in the solid.</div></div>
<div class="calc-card"><div class="card-title">Strip direction</div><div class="card-body">Vertical strips of width $dx$ stand perpendicular to the rotation axis (the x-axis).</div></div>
<div class="calc-card"><div class="card-title">Radius</div><div class="card-body">$f(x)$ — the distance from the axis to the top of the strip.</div></div>
<div class="calc-card"><div class="card-title">Integrand</div><div class="card-body">$\\pi[f(x)]^2$ — the area of a circular cross-section.</div></div>
</div>

<div class="calc-example"><div class="example-label">SANITY CHECK — CYLINDER</div><div class="example-body">Rotate the constant function $f(x) = R$ on $[0, h]$ around the x-axis. The disk-method integral gives<br><br>$V = \\pi\\int_0^h R^2\\,dx = \\pi R^2 [x]_0^h = \\pi R^2 h$,<br><br>recovering the elementary cylinder formula. Good — the method passes the basic test.</div></div>

<div class="l-note"><strong>Why $\\pi r^2$ for the cross-section.</strong> A disk of radius $r$ has area $\\pi r^2$. That is the only fact about elementary geometry the disk method needs.</div>

<h2 class="lesson-title">3. Worked Example — $y = \\sqrt{x}$ on $[0, 4]$</h2>

<p class="l-text">Rotate the region under $y = \\sqrt{x}$ from $x = 0$ to $x = 4$ around the x-axis. The radius at position $x$ is $f(x) = \\sqrt{x}$, so $[f(x)]^2 = x$.</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\int_0^4 (\\sqrt{x})^2\\,dx \\;=\\; \\pi\\int_0^4 x\\,dx.$$</div></div>

<p class="l-text">The antiderivative of $x$ is $x^2/2$. Evaluate at the endpoints:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\left[\\frac{x^2}{2}\\right]_0^4 \\;=\\; \\pi\\left(\\frac{16}{2} - 0\\right) \\;=\\; 8\\pi.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;V \\;=\\; 8\\pi \\;\\approx\\; 25.13 \\text{ cubic units}\\;}$$</div><div class="formula-sub">A paraboloid that opens to the right with base radius $2$ and length $4$ has volume $8\\pi$. Compare with the right circular cone of the same dimensions ($V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\cdot 4 \\cdot 4 = \\frac{16\\pi}{3} \\approx 16.76$): the paraboloid is fatter near its apex.</div></div>

<div class="think-box"><div class="think-label">CONE BY DISK METHOD</div><div class="think-body">If instead you rotate the line $y = x/2$ on $[0, 4]$ around the x-axis you get a cone of base radius $2$ and height $4$. Disk method: $V = \\pi\\int_0^4 (x/2)^2\\,dx = \\pi\\int_0^4 x^2/4\\,dx = (\\pi/4)\\cdot 64/3 = 16\\pi/3$ — agreeing with the elementary cone formula $\\pi r^2 h/3$.</div></div>

<h2 class="lesson-title">4. The Washer Method</h2>

<p class="l-text">Now suppose two curves $y = R(x)$ (outer) and $y = r(x)$ (inner) bound the region, with $R(x) \\geq r(x) \\geq 0$ on $[a, b]$. Rotating around the x-axis, each cross-section is no longer a full disk — it is a <strong>washer</strong> (a ring): an outer disk of radius $R(x)$ with a smaller inner disk of radius $r(x)$ punched out. Its area is</p>

<div class="calc-formula"><div class="formula-main">$$A_{\\text{washer}} \\;=\\; \\pi R(x)^2 - \\pi r(x)^2 \\;=\\; \\pi\\bigl[R(x)^2 - r(x)^2\\bigr].$$</div></div>

<p class="l-text">Multiply by the thickness $dx$ and integrate.</p>

<div class="calc-formula"><div class="formula-label">WASHER METHOD</div><div class="formula-main">$$V \\;=\\; \\pi\\int_a^b \\bigl[\\,R(x)^2 - r(x)^2\\,\\bigr]\\,dx$$</div><div class="formula-sub">Outer radius $R(x)$ is the distance from the axis to the upper curve; inner radius $r(x)$ is the distance from the axis to the lower curve. The integrand $R^2 - r^2$ is always non-negative.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Disk = washer with $r = 0$</div><div class="card-body">If the inner curve coincides with the axis, $r(x) = 0$ and the formula collapses to the disk method.</div></div>
<div class="calc-card"><div class="card-title">Common error</div><div class="card-body">Do <em>not</em> write $\\pi(R - r)^2$. The cross-section is a difference of <em>areas</em>, not the area of a circle with radius $R - r$.</div></div>
<div class="calc-card"><div class="card-title">Sign</div><div class="card-body">Always pick $R$ to be the curve farther from the axis. Geometric area cannot be negative.</div></div>
<div class="calc-card"><div class="card-title">Limits</div><div class="card-body">Use the x-coordinates of the two intersection points found by solving $R(x) = r(x)$.</div></div>
</div>

<h2 class="lesson-title">5. Worked Example — Region Between $y = x$ and $y = x^2$</h2>

<p class="l-text">In the previous lesson we found that $y = x$ and $y = x^2$ meet at $(0, 0)$ and $(1, 1)$, and on $[0, 1]$ the line is above the parabola. Rotate the enclosed leaf around the x-axis. The outer radius is $R(x) = x$, the inner radius is $r(x) = x^2$.</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\int_0^1 \\bigl[\\,x^2 - x^4\\,\\bigr]\\,dx.$$</div></div>

<p class="l-text">Antiderivatives are $x^3/3$ and $x^5/5$:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\left[\\frac{x^3}{3} - \\frac{x^5}{5}\\right]_0^1 \\;=\\; \\pi\\left(\\frac{1}{3} - \\frac{1}{5}\\right) \\;=\\; \\pi \\cdot \\frac{5 - 3}{15} \\;=\\; \\frac{2\\pi}{15}.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;V \\;=\\; \\frac{2\\pi}{15} \\;\\approx\\; 0.419\\;}$$</div><div class="formula-sub">A small, hollow lentil-shape with a parabolic indent. The integral $\\int_0^1 x^4\\,dx = 1/5$ corresponds to a paraboloid being subtracted from the cone $\\int_0^1 x^2\\,dx = 1/3$.</div></div>

<div class="calc-graph"><div id="plot-l33-washer-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the washer cross-section at $x = 0.7$. The big disk of radius $R = 0.7$ minus the small disk of radius $r = 0.49 = 0.7^2$ gives the washer area, which we integrate from $x = 0$ to $x = 1$ to obtain $2\\pi/15$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];for(var k=0;k<=100;k++)th.push(2*Math.PI*k/100);
var R=0.7,r=0.49;
var outerX=th.map(function(t){return R*Math.cos(t);}),outerY=th.map(function(t){return R*Math.sin(t);});
var innerX=th.map(function(t){return r*Math.cos(t);}),innerY=th.map(function(t){return r*Math.sin(t);});
var fillX=outerX.concat(innerX.slice().reverse());
var fillY=outerY.concat(innerY.slice().reverse());
var washer={x:fillX,y:fillY,mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.35)',line:{color:'#3b82f6',width:2},name:'washer area'};
var inner={x:innerX,y:innerY,mode:'lines',line:{color:'#c8a96e',width:2,dash:'dash'},name:'inner radius r = 0.49'};
var arrowR={x:[0,R],y:[0,0],mode:'lines+markers',line:{color:'#f87171',width:2},marker:{size:6},name:'R = 0.7'};
var arrowr={x:[0,-r],y:[0,0],mode:'lines+markers',line:{color:'#c8a96e',width:2},marker:{size:6},name:'r = 0.49'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.05,1.05]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.05,1.05],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.18},annotations:[{x:0.35,y:0.03,text:'R',showarrow:false,font:{color:'#f87171',size:14}},{x:-0.24,y:0.03,text:'r',showarrow:false,font:{color:'#c8a96e',size:14}}]};
Plotly.newPlot('plot-l33-washer-en',[washer,inner,arrowR,arrowr],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. The Shell Method</h2>

<p class="l-text">Sometimes the geometry is awkward for disks and natural for shells. Take a region under $y = f(x)$ on $[a, b]$ with $a \\geq 0$, and rotate it around the <strong>y-axis</strong>. Instead of slicing perpendicular to the axis (which would force us to invert $f$), slice the region into vertical strips of width $dx$ at position $x$ and rotate each strip.</p>

<p class="l-text">A vertical strip at $x$ has width $dx$ and height $f(x)$. When rotated around the y-axis, it sweeps out a thin <em>cylindrical shell</em> (a sleeve): radius $x$, height $f(x)$, thickness $dx$. Unroll the sleeve into a flat rectangle: its area is circumference $\\times$ height $= 2\\pi x \\cdot f(x)$, and its volume is</p>

<div class="calc-formula"><div class="formula-main">$$dV \\;=\\; 2\\pi\\,x\\,f(x)\\,dx.$$</div></div>

<p class="l-text">Integrate to combine all the shells:</p>

<div class="calc-formula"><div class="formula-label">SHELL METHOD (ROTATION AROUND y-AXIS)</div><div class="formula-main">$$V \\;=\\; 2\\pi\\int_a^b x\\,f(x)\\,dx$$</div><div class="formula-sub">Strips are parallel to the rotation axis. Each becomes a cylindrical sleeve of radius $x$, height $f(x)$, and thickness $dx$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to use it</div><div class="card-body">Rotation around an axis that does <em>not</em> lie along the strip direction, especially when inverting $y = f(x)$ to $x = g(y)$ is messy or impossible.</div></div>
<div class="calc-card"><div class="card-title">Strip direction</div><div class="card-body">Strips are <em>parallel</em> to the rotation axis (vertical strips for rotation around y-axis).</div></div>
<div class="calc-card"><div class="card-title">Radius</div><div class="card-body">$x$ — the distance from the y-axis to the strip.</div></div>
<div class="calc-card"><div class="card-title">Integrand</div><div class="card-body">$2\\pi x\\,f(x)$ — circumference $\\times$ height of the sleeve.</div></div>
</div>

<div class="calc-graph"><div id="plot-l33-shell-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a single cylindrical shell. The thin sleeve at radius $x$ with height $f(x)$ and thickness $dx$ unrolls into a flat rectangle of width $2\\pi x$ and height $f(x)$. Stacking shells with $x$ running from $a$ to $b$ fills the entire solid.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];for(var k=0;k<=80;k++)th.push(2*Math.PI*k/80);
var x0=1.0,dx=0.12,h=1.5;
var outerX=th.map(function(t){return (x0+dx)*Math.cos(t);}),outerY=th.map(function(t){return (x0+dx)*Math.sin(t);});
var innerX=th.map(function(t){return x0*Math.cos(t);}),innerY=th.map(function(t){return x0*Math.sin(t);});
var topX=outerX.concat(innerX.slice().reverse());
var topY=outerY.concat(innerY.slice().reverse());
var topRing={x:topX,y:topY,fill:'toself',fillcolor:'rgba(59,130,246,0.45)',line:{color:'#3b82f6',width:1.5},mode:'lines',name:'shell ring (top view)'};
var unrollW=2*Math.PI*x0;
var rectX=[2.5,2.5+unrollW,2.5+unrollW,2.5,2.5];
var rectY=[-0.05,-0.05,h-0.05,h-0.05,-0.05];
var rect={x:rectX,y:rectY,fill:'toself',fillcolor:'rgba(200,169,110,0.35)',line:{color:'#c8a96e',width:2},mode:'lines',name:'unrolled rectangle'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.4,10]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.4,2.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.18},annotations:[{x:0,y:1.4,text:'shell from above',showarrow:false,font:{color:'#3b82f6',size:13}},{x:5.5,y:1.85,text:'unrolled: 2πx × f(x)',showarrow:false,font:{color:'#c8a96e',size:13}},{x:5.6,y:-0.45,text:'width = 2πx',showarrow:false,font:{color:'rgba(235,230,220,0.7)',size:11}}]};
Plotly.newPlot('plot-l33-shell-en',[topRing,rect],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Disk vs Shell — Which Method When?</h2>

<p class="l-text">Both methods always give the same answer, but the algebra can be much easier with one than the other. The deciding question is: <em>which way do the natural strips run relative to the rotation axis?</em></p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">USE DISKS / WASHERS</div><div class="compare-item">Strips run <strong>perpendicular</strong> to the rotation axis.</div><div class="compare-item">Cross-sections are circles or rings.</div><div class="compare-item">Radius = distance from axis to curve.</div><div class="compare-item">Integrand: $\\pi r^2$ or $\\pi(R^2 - r^2)$.</div><div class="compare-item">Variable of integration matches the axis direction.</div></div><div class="compare-col"><div class="compare-title">USE SHELLS</div><div class="compare-item">Strips run <strong>parallel</strong> to the rotation axis.</div><div class="compare-item">Cross-sections are cylindrical sleeves.</div><div class="compare-item">Radius = distance from axis to strip.</div><div class="compare-item">Integrand: $2\\pi r \\cdot h$.</div><div class="compare-item">Useful when inverting $y = f(x)$ would be messy.</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rotation around x-axis, $y = f(x)$ given</div><div class="card-body">Disk/washer is usually most natural — strips perpendicular to the axis are vertical, integration in $x$ matches the function form.</div></div>
<div class="calc-card"><div class="card-title">Rotation around y-axis, $y = f(x)$ given</div><div class="card-body">Shells are usually most natural — vertical strips are parallel to the axis, no need to invert $f$. Disk would require $x = g(y)$.</div></div>
<div class="calc-card"><div class="card-title">Rotation around y-axis, $x = g(y)$ given</div><div class="card-body">Disks in $y$ work directly: $V = \\pi\\int_c^d [g(y)]^2\\,dy$.</div></div>
<div class="calc-card"><div class="card-title">Tip</div><div class="card-body">When in doubt, set up both. If one integral is far easier to compute, choose that one.</div></div>
</div>

<div class="think-box"><div class="think-label">SAME ANSWER, DIFFERENT PATHS</div><div class="think-body">For $y = x^2$ on $[0, 2]$ rotated around the y-axis: shell gives $V = 2\\pi\\int_0^2 x \\cdot x^2\\,dx = 2\\pi \\cdot 4 = 8\\pi$. Disk in $y$ gives $V = \\pi\\int_0^4 (\\sqrt{y})^2 \\cdot 1\\,dy - (\\text{outer cylinder correction})$ — more work. The shell answer is reached in two lines.</div></div>

<h2 class="lesson-title">8. Rotation Around the y-Axis with Disks</h2>

<p class="l-text">If the profile is naturally given as $x = g(y)$ for $y \\in [c, d]$, slicing the solid perpendicular to the y-axis produces disks of radius $g(y)$. The disk-method formula adapts simply:</p>

<div class="calc-formula"><div class="formula-label">DISK METHOD (ROTATION AROUND y-AXIS)</div><div class="formula-main">$$V \\;=\\; \\pi\\int_c^d [\\,g(y)\\,]^2\\,dy$$</div><div class="formula-sub">Cross-sections are now horizontal disks of radius $g(y)$. Limits $c$ and $d$ are y-coordinates.</div></div>

<p class="l-text">Often the original function is given as $y = f(x)$ and inversion is required: $x = f^{-1}(y) = g(y)$. For $y = x^2$ on $[0, 2]$ we have $x = \\sqrt{y}$ for $y \\in [0, 4]$, so the disk integral would read $\\pi\\int_0^4 y\\,dy = \\pi[y^2/2]_0^4 = 8\\pi$. The bookkeeping is straightforward once you remember to update both the integrand and the limits.</p>

<div class="l-note"><strong>Washer version.</strong> If the region between two curves is rotated around the y-axis, the washer formula with $R(y)$ outer and $r(y)$ inner becomes $V = \\pi\\int_c^d \\bigl[R(y)^2 - r(y)^2\\bigr]\\,dy$. Same idea, different axis.</div>

<h2 class="lesson-title">9. Worked Example — $y = x^2$ on $[0, 2]$ Around the y-Axis (Shell Method)</h2>

<p class="l-text">Rotate the region under $y = x^2$ from $x = 0$ to $x = 2$ around the y-axis. Vertical strips parallel to the rotation axis, radius $x$, height $f(x) = x^2$, thickness $dx$:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; 2\\pi\\int_0^2 x \\cdot x^2\\,dx \\;=\\; 2\\pi\\int_0^2 x^3\\,dx.$$</div></div>

<p class="l-text">The antiderivative of $x^3$ is $x^4/4$:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; 2\\pi\\left[\\frac{x^4}{4}\\right]_0^2 \\;=\\; 2\\pi\\left(\\frac{16}{4} - 0\\right) \\;=\\; 2\\pi \\cdot 4 \\;=\\; 8\\pi.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;V \\;=\\; 8\\pi \\;\\approx\\; 25.13\\;}$$</div><div class="formula-sub">The shell method gives a clean answer in two lines. The disk method (inverting $y = x^2$) reaches the same number with a little extra bookkeeping — see the LOOK-AHEAD below.</div></div>

<div class="think-box"><div class="think-label">DISK METHOD CROSS-CHECK</div><div class="think-body">The region is bounded by $y = x^2$ on the left and the vertical line $x = 2$ on the right, from $y = 0$ to $y = 4$. Rotating around the y-axis produces a solid that is the cylinder of radius $2$ and height $4$ minus the paraboloid swept by $x = \\sqrt{y}$. Cylinder volume: $\\pi \\cdot 4 \\cdot 4 = 16\\pi$. Inner paraboloid: $\\pi\\int_0^4 y\\,dy = 8\\pi$. Difference: $16\\pi - 8\\pi = 8\\pi$. Same answer.</div></div>

<h2 class="lesson-title">10. Classical Exercises</h2>

<p class="l-text">Try each problem on paper first; the methods chosen below are the shortest path, but every problem has at least two valid setups.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — DISK</div><div class="example-body"><strong>Find</strong> the volume swept when $y = x$ on $[0, 3]$ rotates around the x-axis.<br><br><em>Setup.</em> Disk method, radius $x$: $V = \\pi\\int_0^3 x^2\\,dx$.<br><em>Compute.</em> $V = \\pi[x^3/3]_0^3 = \\pi \\cdot 27/3 = 9\\pi$.<br><em>Check.</em> Cone formula: $\\pi r^2 h/3 = \\pi \\cdot 9 \\cdot 3/3 = 9\\pi$. ✓</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — DISK</div><div class="example-body"><strong>Find</strong> the volume of the sphere of radius $R$ by rotating the upper semicircle $y = \\sqrt{R^2 - x^2}$ on $[-R, R]$ around the x-axis.<br><br><em>Setup.</em> $V = \\pi\\int_{-R}^{R} (R^2 - x^2)\\,dx$.<br><em>Compute.</em> $V = \\pi[R^2 x - x^3/3]_{-R}^{R} = \\pi(2R^3 - 2R^3/3) = \\pi \\cdot 4R^3/3$.<br><em>Result.</em> $V = \\frac{4}{3}\\pi R^3$ — the classical sphere formula.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — WASHER</div><div class="example-body"><strong>Find</strong> the volume when the region between $y = \\sqrt{x}$ and $y = x^2$ on $[0, 1]$ rotates around the x-axis.<br><br><em>Setup.</em> Upper: $R(x) = \\sqrt{x}$ so $R^2 = x$. Lower: $r(x) = x^2$ so $r^2 = x^4$.<br><em>Integral.</em> $V = \\pi\\int_0^1 (x - x^4)\\,dx = \\pi[x^2/2 - x^5/5]_0^1 = \\pi(1/2 - 1/5) = \\pi \\cdot 3/10$.<br><em>Result.</em> $V = 3\\pi/10$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — SHELL</div><div class="example-body"><strong>Find</strong> the volume when the region under $y = x^2$ on $[1, 3]$ rotates around the y-axis.<br><br><em>Setup.</em> Shell: $V = 2\\pi\\int_1^3 x \\cdot x^2\\,dx = 2\\pi\\int_1^3 x^3\\,dx$.<br><em>Compute.</em> $V = 2\\pi[x^4/4]_1^3 = 2\\pi(81/4 - 1/4) = 2\\pi \\cdot 80/4 = 40\\pi$.<br><em>Result.</em> $V = 40\\pi$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — SHELL</div><div class="example-body"><strong>Find</strong> the volume when the region bounded by $y = 2x - x^2$ and the x-axis rotates around the y-axis.<br><br><em>Setup.</em> The parabola meets the axis at $x = 0$ and $x = 2$. Shell: $V = 2\\pi\\int_0^2 x(2x - x^2)\\,dx = 2\\pi\\int_0^2 (2x^2 - x^3)\\,dx$.<br><em>Compute.</em> $V = 2\\pi[2x^3/3 - x^4/4]_0^2 = 2\\pi(16/3 - 4) = 2\\pi(16/3 - 12/3) = 2\\pi \\cdot 4/3 = 8\\pi/3$.<br><em>Result.</em> $V = 8\\pi/3$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — DISK IN y</div><div class="example-body"><strong>Find</strong> the volume of the cone formed by rotating the region bounded by $y = 2x$, $y = 4$, and the y-axis around the y-axis.<br><br><em>Setup.</em> Solve $y = 2x$ for $x = y/2$ on $y \\in [0, 4]$. Disk in $y$: $V = \\pi\\int_0^4 (y/2)^2\\,dy = (\\pi/4)\\int_0^4 y^2\\,dy$.<br><em>Compute.</em> $V = (\\pi/4)[y^3/3]_0^4 = (\\pi/4)(64/3) = 16\\pi/3$.<br><em>Check.</em> Elementary cone of base radius $2$ and height $4$: $\\pi r^2 h/3 = 16\\pi/3$. ✓</div></div>

<div class="think-box"><div class="think-label">LOOK AHEAD</div><div class="think-body">The same Riemann-slicing argument computes <em>any</em> physical quantity that accumulates: arc length, surface area of revolution, work done by a variable force, hydrostatic pressure, centre of mass, moments of inertia. In every case the recipe is identical: identify the differential element, write its contribution as a tiny product, integrate over the parameter. Solids of revolution are the friendliest gateway to that whole industry.</div></div>

<h2 class="lesson-title">11. Visual — A Disk-Method Strip and Its Cross-Section</h2>

<p class="l-text">The picture below makes the disk-method bookkeeping concrete. The profile $y = \\sqrt{x}$ runs along the top; a single thin vertical strip sits at $x = 2.25$ with height $f(x) = 1.5$. When the strip spins around the dashed x-axis, it sweeps out a flat disk of radius $1.5$ (drawn on the right). Multiplying this disk's area $\\pi(1.5)^2$ by the strip thickness $dx$ gives the elementary volume $dV$; summing over all such strips from $x = 0$ to $x = 4$ produces the $8\\pi$ paraboloid volume we computed in section 3.</p>

<div class="calc-graph"><div id="plot-l33-en-extra" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the profile $y = \\sqrt{x}$ (left panel, blue), the rotation axis (dashed gold), a single strip at $x = 2.25$ of height $\\sqrt{2.25} = 1.5$ (red), and the resulting cross-section disk of radius $1.5$ (right panel). Each strip contributes the volume of one such disk times its thickness $dx$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];for(var i=0;i<=80;i++){var x=4*i/80;xs.push(x);ys.push(Math.sqrt(x));}
var profile={x:xs,y:ys,mode:'lines',line:{color:'#3b82f6',width:3},name:'y = √x',xaxis:'x1',yaxis:'y1'};
var fillX=xs.concat([4,0]);var fillY=ys.concat([0,0]);
var region={x:fillX,y:fillY,fill:'toself',fillcolor:'rgba(59,130,246,0.12)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'region',xaxis:'x1',yaxis:'y1',showlegend:false};
var axisLine={x:[0,4.3],y:[0,0],mode:'lines',line:{color:'#c8a96e',width:2,dash:'dash'},name:'rotation axis',xaxis:'x1',yaxis:'y1'};
var xStrip=2.25,fStrip=1.5,stripW=0.10;
var stripX=[xStrip-stripW/2,xStrip+stripW/2,xStrip+stripW/2,xStrip-stripW/2,xStrip-stripW/2];
var stripY=[0,0,fStrip,fStrip,0];
var strip={x:stripX,y:stripY,fill:'toself',fillcolor:'rgba(248,113,113,0.55)',line:{color:'#f87171',width:2},mode:'lines',name:'strip at x = 2.25',xaxis:'x1',yaxis:'y1'};
var radArrow={x:[xStrip,xStrip],y:[0,fStrip],mode:'lines+markers',line:{color:'#f87171',width:1.5,dash:'dot'},marker:{size:5,color:'#f87171'},name:'radius f(x) = 1.5',xaxis:'x1',yaxis:'y1',showlegend:false};
var th=[];for(var k=0;k<=100;k++)th.push(2*Math.PI*k/100);
var diskX=th.map(function(t){return fStrip*Math.cos(t);});
var diskY=th.map(function(t){return fStrip*Math.sin(t);});
var disk={x:diskX,y:diskY,fill:'toself',fillcolor:'rgba(59,130,246,0.35)',line:{color:'#3b82f6',width:2},mode:'lines',name:'cross-section disk',xaxis:'x2',yaxis:'y2'};
var rad={x:[0,fStrip],y:[0,0],mode:'lines+markers',line:{color:'#f87171',width:2},marker:{size:6,color:'#f87171'},name:'radius = 1.5',xaxis:'x2',yaxis:'y2',showlegend:false};
var center={x:[0],y:[0],mode:'markers',marker:{size:7,color:'#c8a96e',symbol:'x'},name:'axis pierces here',xaxis:'x2',yaxis:'y2',showlegend:false};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},grid:{rows:1,columns:2,pattern:'independent'},margin:{t:40,r:30,b:60,l:50},showlegend:true,legend:{font:{color:'#ebe6dc',size:11},orientation:'h',x:0.5,xanchor:'center',y:-0.16},xaxis:{domain:[0,0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x',range:[-0.2,4.4]},yaxis:{domain:[0,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',range:[-0.4,2.5],scaleanchor:'x',scaleratio:1},xaxis2:{domain:[0.58,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.9,1.9],anchor:'y2'},yaxis2:{domain:[0,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.9,1.9],scaleanchor:'x2',scaleratio:1,anchor:'x2'},annotations:[{x:0.22,y:1.06,xref:'paper',yref:'paper',text:'profile + strip at x = 2.25',showarrow:false,font:{color:'#3b82f6',size:12}},{x:0.79,y:1.06,xref:'paper',yref:'paper',text:'rotate around x-axis → disk of radius f(x)',showarrow:false,font:{color:'#3b82f6',size:12}},{x:xStrip+0.18,y:fStrip*0.55,xref:'x1',yref:'y1',text:'f(x)=1.5',showarrow:false,font:{color:'#f87171',size:11}},{x:2.1,y:-0.25,xref:'x1',yref:'y1',text:'rotation axis (dashed)',showarrow:false,font:{color:'#c8a96e',size:11}},{x:0.85,y:0.18,xref:'x2',yref:'y2',text:'r = 1.5',showarrow:false,font:{color:'#f87171',size:12}},{x:0,y:-1.55,xref:'x2',yref:'y2',text:'area = π·(1.5)² ≈ 7.07',showarrow:false,font:{color:'rgba(235,230,220,0.85)',size:11}}]};
Plotly.newPlot('plot-l33-en-extra',[region,profile,axisLine,strip,radArrow,disk,rad,center],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Summary Table — Which Method for Which Set-up</h2>

<p class="l-text">One reference card. Match the rotation axis to the form in which the region is described, and the table tells you which formula to apply, along with a sample integrand.</p>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(20,20,24,0.55);color:rgba(235,230,220,0.92);font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead>
<tr style="background:#3b82f6;color:#ffffff">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Method</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Formula</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">When to use</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Sample integrand & limits</th>
</tr>
</thead>
<tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.08)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Disk (about x-axis)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_a^b [f(x)]^2\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Region touches the x-axis; rotate around x-axis; strips perpendicular to axis.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = \\sqrt{x}$ on $[0, 4]$: $\\pi\\int_0^4 x\\,dx = 8\\pi$</td>
</tr>
<tr style="border-top:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Washer (about x-axis)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_a^b [R(x)^2 - r(x)^2]\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Region between two curves with the inner one above the axis; rotation leaves a hole.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Between $y=x$ and $y=x^2$ on $[0,1]$: $\\pi\\int_0^1 (x^2 - x^4)\\,dx = 2\\pi/15$</td>
</tr>
<tr style="border-top:1px solid rgba(255,255,255,0.08)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Shell (about y-axis)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = 2\\pi\\int_a^b x\\,f(x)\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = f(x)$ given, rotation around y-axis, $a \\geq 0$; inverting $f$ would be messy.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = x^2$ on $[0, 2]$: $2\\pi\\int_0^2 x^3\\,dx = 8\\pi$</td>
</tr>
<tr style="border-top:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Disk (about y-axis)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_c^d [g(y)]^2\\,dy$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Profile naturally given as $x = g(y)$; rotation around y-axis; horizontal disks.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$x = y/2$ on $[0, 4]$: $\\pi\\int_0^4 y^2/4\\,dy = 16\\pi/3$</td>
</tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>How to read this card.</strong> Look first at the rotation axis. Then check whether strips perpendicular to that axis (disk / washer) or parallel to it (shell) match the function form better. The right column shows a sample we worked through earlier in this lesson — use it to double-check your set-up before integrating.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İntegral düz alandan fazlasını hesaplar.</strong> Düzlemdeki bir eğriyi alıp bir eksen etrafında döndürdüğünüzde, üç boyutlu bir cisim — bir şarap kadehi, bir vazo, bir abajur, bir türbin kanadı — taranır; bu cismin <em>hacmi</em> hiçbir okul formülüyle verilmez. Koniler, küreler, paraboloidler ve simitler hep bu yolla doğar. Bu ders, bize alanı veren aynı Riemann-toplamı hilesinin böyle herhangi bir cismin hacmini de verdiğini gösterir. Cismi ince parçalara dilimleriz, her parçayı disk, halka (washer) ya da silindirik kabuk olarak tanırız, ilkel hacimleri toplarız ve limite geçeriz. Sonuç tek bir integraldir.</p>

<p class="l-text">Üç yöntem göreceksiniz. <strong>Disk yöntemi</strong>, bölge eksene değdiğinde dönme eksenine dik olarak dilimler. <strong>Halka (washer) yöntemi</strong>, iki eğrinin bölgeyi sınırladığı ve içteki eğrinin boş bir silindirik çekirdek bıraktığı durumu ele alır. <strong>Kabuk yöntemi</strong> ise eksene paralel dikey şeritler alıp her şeridi silindirik bir kılıfa çevirir. Doğru yöntemi baştan seçmek işi büyük ölçüde kısaltır. Dersin sonunda hangi yöntemin hangi probleme yakıştığını ilk bakışta tanıyacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir dönme cismini, düzlemsel bir bölgeyi eksen etrafında döndürerek elde edilen cisim olarak hayal etmek</li>
<li>Bölge dönme eksenine değdiğinde disk yöntemini $V = \\pi\\int_a^b [f(x)]^2\\,dx$ uygulamak</li>
<li>İç boşluğu olan bölgelerde halka yöntemini $V = \\pi\\int_a^b \\bigl[R(x)^2 - r(x)^2\\bigr]\\,dx$ uygulamak</li>
<li>Şeritler eksene paralel olduğunda kabuk yöntemini $V = 2\\pi\\int_a^b x\\,f(x)\\,dx$ uygulamak</li>
<li>Geometriye bakarak disk ile kabuk arasında seçim yapmak: dik ya da paralel şeritler</li>
<li>y-ekseni etrafında dönmeyi ya $y$ değişkeniyle integral alarak ya da kabuğa geçerek ele almak</li>
</ul>
</div>

<h2 class="lesson-title">1. Dönme Cismi Nedir?</h2>

<div class="calc-highlight"><strong>Günlük örnek:</strong> tezgâhtaki bir çömlekçi düşünün. Bir parça kil tekerlek üzerinde durur ve dikey mil etrafında döner. Çömlekçi parmaklarıyla kile şekil verirken, $r$ yarıçapındaki her nokta tam bir çember çizer. Sonuçta ortaya çıkan çömlek bir <em>dönme cismi</em>dir: dönme ekseni etrafında dönüşümsel simetrisi olan, tüm şekli yandan görülen tek bir profil eğrisiyle yakalanan bir cisim.</div>

<p class="l-text">Biçimsel olarak: bir $L$ doğrusunun bir yanında duran bir $R$ düzlem bölgesi alın. $R$'yi $L$ etrafında tam $360°$ döndürün. Taranan noktalar kümesi üç boyutlu bir <strong>dönme cismi</strong>dir. $L$ doğrusu <em>dönme ekseni</em>, $R$'nin sınır eğrisi de <em>profil</em>dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Profil $\\to$ cisim</div><div class="card-body">Yatay bir doğru parçası silindir olur. Eğik bir doğru koni olur. Yarım çember küre olur. $y = \\sqrt{x}$ parabolü ise paraboloit olur.</div></div>
<div class="calc-card"><div class="card-title">Simetri</div><div class="card-body">Eksene dik her kesit bir çemberdir. Tek boyutlu bir integralin üç boyutlu bir hacmi yakalamasının nedeni bu çembersel simetridir.</div></div>
<div class="calc-card"><div class="card-title">Kesit yarıçapı</div><div class="card-body">Eksen boyunca $x$ konumunda kesit, eksenden profil eğrisine olan uzaklığa eşit yarıçapta bir disktir — standart kurulumda yalnızca $f(x)$.</div></div>
<div class="calc-card"><div class="card-title">Neden integral?</div><div class="card-body">Çok sayıda ince diski (ya da halkayı, ya da kabuğu) üst üste koyun, hacimlerini toplayın, her parça sonsuz küçük olana kadar dilimi inceltin. Limit hacimdir.</div></div>
</div>

<div class="think-box"><div class="think-label">BİLİNEN BİR ŞEKLİN HACMİ</div><div class="think-body">$y = R$ doğru parçasını $x = 0$ ile $x = h$ arasında x-ekseni etrafında döndürmek, $R$ yarıçaplı ve $h$ yükseklikli bir silindir verir. Hacmi $\\pi R^2 h$ olmalı. Bunu Bölüm 2'de disk yönteminin en basit hali olarak yeniden bulacağız.</div></div>

<div class="calc-graph"><div id="plot-l33-intro-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> solda $y = \\sqrt{x}$ profil eğrisi; o profil x-ekseni etrafında tam bir tur döndürüldüğünde sağda elde edilen paraboloit. Eksene dik her kesit, profilin o konumdaki $\\sqrt{x}$ yüksekliğine eşit yarıçaplı bir çemberdir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];for(var i=0;i<=80;i++){var x=4*i/80;xs.push(x);ys.push(Math.sqrt(x));}
var profile={x:xs,y:ys,mode:'lines',line:{color:'#3b82f6',width:3},name:'y = √x',xaxis:'x1',yaxis:'y1'};
var axisLine={x:[0,4],y:[0,0],mode:'lines',line:{color:'#c8a96e',width:2,dash:'dash'},name:'dönme ekseni',xaxis:'x1',yaxis:'y1'};
var ths=[];for(var k=0;k<=40;k++)ths.push(2*Math.PI*k/40);
var mx=[],my=[],mz=[];
for(var i=0;i<=30;i++){var xv=4*i/30;var rv=Math.sqrt(xv);var row1=[],row2=[],row3=[];for(var k=0;k<=40;k++){var t=ths[k];row1.push(xv);row2.push(rv*Math.cos(t));row3.push(rv*Math.sin(t));}mx.push(row1);my.push(row2);mz.push(row3);}
var solid={type:'surface',x:mx,y:my,z:mz,colorscale:[[0,'#3b82f6'],[1,'#c8a96e']],opacity:0.85,showscale:false,name:'paraboloit',scene:'scene2'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},grid:{rows:1,columns:2,pattern:'independent'},margin:{t:30,r:10,b:30,l:10},showlegend:false,xaxis:{domain:[0,0.42],gridcolor:'rgba(255,255,255,0.08)',title:'x',range:[-0.2,4.3]},yaxis:{domain:[0,1],gridcolor:'rgba(255,255,255,0.08)',title:'y',range:[-0.5,2.4],scaleanchor:'x',scaleratio:1},scene2:{domain:{x:[0.5,1],y:[0,1]},xaxis:{title:'x',color:'#ebe6dc',gridcolor:'rgba(255,255,255,0.08)'},yaxis:{title:'y',color:'#ebe6dc',gridcolor:'rgba(255,255,255,0.08)'},zaxis:{title:'z',color:'#ebe6dc',gridcolor:'rgba(255,255,255,0.08)'},bgcolor:'rgba(0,0,0,0)',camera:{eye:{x:1.6,y:1.4,z:0.8}}},annotations:[{x:0.21,y:1.04,xref:'paper',yref:'paper',text:'profil',showarrow:false,font:{color:'#3b82f6',size:13}},{x:0.75,y:1.04,xref:'paper',yref:'paper',text:'dönme cismi',showarrow:false,font:{color:'#c8a96e',size:13}}]};
Plotly.newPlot('plot-l33-intro-tr',[profile,axisLine,solid],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Disk Yöntemi</h2>

<p class="l-text">$[a, b]$ üzerinde $f(x) \\geq 0$ olsun ve $y = f(x)$ ile x-ekseni arasındaki bölgeyi x-ekseni etrafında döndürelim. $x$ konumunda cismi eksene dik olarak dilimleyin. Kesit, yarıçapı $f(x)$ ve alanı $\\pi[f(x)]^2$ olan bir <em>disk</em>tir. $dx$ kalınlığını verin; bir sonsuz küçük diskin hacmi</p>

<div class="calc-formula"><div class="formula-main">$$dV \\;=\\; \\pi\\,[f(x)]^2\\,dx.$$</div></div>

<p class="l-text">Üst üste yığıp $x = a$'dan $x = b$'ye integral alın:</p>

<div class="calc-formula"><div class="formula-label">DİSK YÖNTEMİ (x-EKSENİ ETRAFINDA DÖNME)</div><div class="formula-main">$$V \\;=\\; \\pi\\int_a^b [\\,f(x)\\,]^2\\,dx$$</div><div class="formula-sub">Bölge eksene değdiği için her kesit tam bir disktir (iç boşluk yok). Yarıçap, profilin yüksekliğine eşittir: $f(x)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman kullanılır</div><div class="card-body">Bölgenin sınırı dönme eksenine değer, böylece cismin içinde merkezi boşluk kalmaz.</div></div>
<div class="calc-card"><div class="card-title">Şerit yönü</div><div class="card-body">$dx$ genişliğinde dikey şeritler dönme eksenine (x-ekseni) diktir.</div></div>
<div class="calc-card"><div class="card-title">Yarıçap</div><div class="card-body">$f(x)$ — eksenden şeridin tepesine olan uzaklık.</div></div>
<div class="calc-card"><div class="card-title">İntegrand</div><div class="card-body">$\\pi[f(x)]^2$ — çembersel bir kesitin alanı.</div></div>
</div>

<div class="calc-example"><div class="example-label">DOĞRULUK TESTİ — SİLİNDİR</div><div class="example-body">Sabit fonksiyon $f(x) = R$'yi $[0, h]$ üzerinde x-ekseni etrafında döndürün. Disk-yöntemi integrali<br><br>$V = \\pi\\int_0^h R^2\\,dx = \\pi R^2 [x]_0^h = \\pi R^2 h$,<br><br>böylece temel silindir formülüne ulaşılır. İyi — yöntem ilkel testi geçti.</div></div>

<div class="l-note"><strong>Kesit neden $\\pi r^2$.</strong> $r$ yarıçaplı bir diskin alanı $\\pi r^2$'dir. Disk yönteminin temel geometri hakkında ihtiyaç duyduğu tek bilgi budur.</div>

<h2 class="lesson-title">3. Çözümlü Örnek — $y = \\sqrt{x}$ üzerinde $[0, 4]$</h2>

<p class="l-text">$y = \\sqrt{x}$ altındaki bölgeyi $x = 0$ ile $x = 4$ arasında x-ekseni etrafında döndürün. $x$ konumundaki yarıçap $f(x) = \\sqrt{x}$, dolayısıyla $[f(x)]^2 = x$.</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\int_0^4 (\\sqrt{x})^2\\,dx \\;=\\; \\pi\\int_0^4 x\\,dx.$$</div></div>

<p class="l-text">$x$'in ters türevi $x^2/2$. Uçlarda değerlendirin:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\left[\\frac{x^2}{2}\\right]_0^4 \\;=\\; \\pi\\left(\\frac{16}{2} - 0\\right) \\;=\\; 8\\pi.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;V \\;=\\; 8\\pi \\;\\approx\\; 25{,}13 \\text{ küp birim}\\;}$$</div><div class="formula-sub">Taban yarıçapı $2$, uzunluğu $4$ olan sağa açılan paraboloitin hacmi $8\\pi$'dir. Aynı boyutlardaki dik dairesel koniyle karşılaştırın ($V_{\\text{koni}} = \\frac{1}{3}\\pi r^2 h = \\frac{16\\pi}{3} \\approx 16{,}76$): paraboloit tepesine yakın daha şişkindir.</div></div>

<div class="think-box"><div class="think-label">KONİ DİSK YÖNTEMİYLE</div><div class="think-body">Bunun yerine $y = x/2$ doğrusunu $[0, 4]$ üzerinde x-ekseni etrafında döndürürseniz, taban yarıçapı $2$ ve yüksekliği $4$ olan bir koni elde edersiniz. Disk yöntemi: $V = \\pi\\int_0^4 (x/2)^2\\,dx = (\\pi/4)\\cdot 64/3 = 16\\pi/3$ — temel koni formülü $\\pi r^2 h/3$ ile uyumlu.</div></div>

<h2 class="lesson-title">4. Halka (Washer) Yöntemi</h2>

<p class="l-text">Şimdi iki eğri olduğunu varsayın: $y = R(x)$ (dış) ve $y = r(x)$ (iç), öyle ki $[a, b]$ üzerinde $R(x) \\geq r(x) \\geq 0$. x-ekseni etrafında döndürüldüğünde her kesit artık tam bir disk değildir — bir <strong>halka</strong>dır (ring): $R(x)$ yarıçaplı dış diskten, $r(x)$ yarıçaplı küçük iç disk çıkarılmıştır. Alanı</p>

<div class="calc-formula"><div class="formula-main">$$A_{\\text{halka}} \\;=\\; \\pi R(x)^2 - \\pi r(x)^2 \\;=\\; \\pi\\bigl[R(x)^2 - r(x)^2\\bigr].$$</div></div>

<p class="l-text">$dx$ kalınlığıyla çarpıp integral alın.</p>

<div class="calc-formula"><div class="formula-label">HALKA YÖNTEMİ</div><div class="formula-main">$$V \\;=\\; \\pi\\int_a^b \\bigl[\\,R(x)^2 - r(x)^2\\,\\bigr]\\,dx$$</div><div class="formula-sub">Dış yarıçap $R(x)$, eksenden üst eğriye olan uzaklık; iç yarıçap $r(x)$, eksenden alt eğriye olan uzaklıktır. İntegrand $R^2 - r^2$ daima negatif değildir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Disk = $r = 0$ halkası</div><div class="card-body">İç eğri eksenle çakışırsa $r(x) = 0$ olur ve formül disk yöntemine indirgenir.</div></div>
<div class="calc-card"><div class="card-title">Sık yapılan hata</div><div class="card-body">$\\pi(R - r)^2$ <em>yazmayın</em>. Kesit, yarıçapı $R - r$ olan bir çemberin alanı değil, <em>alanların</em> farkıdır.</div></div>
<div class="calc-card"><div class="card-title">İşaret</div><div class="card-body">$R$'yi her zaman eksenden uzak olan eğri seçin. Geometrik alan negatif olamaz.</div></div>
<div class="calc-card"><div class="card-title">Sınırlar</div><div class="card-body">$R(x) = r(x)$ denkleminden bulunan iki kesişim noktasının x-koordinatlarını kullanın.</div></div>
</div>

<h2 class="lesson-title">5. Çözümlü Örnek — $y = x$ ile $y = x^2$ Arasındaki Bölge</h2>

<p class="l-text">Önceki derste $y = x$ ile $y = x^2$ eğrilerinin $(0, 0)$ ve $(1, 1)$ noktalarında kesiştiğini ve $[0, 1]$ üzerinde doğrunun parabolün üstünde olduğunu bulmuştuk. Çevrelenen yaprağı x-ekseni etrafında döndürün. Dış yarıçap $R(x) = x$, iç yarıçap $r(x) = x^2$.</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\int_0^1 \\bigl[\\,x^2 - x^4\\,\\bigr]\\,dx.$$</div></div>

<p class="l-text">Ters türevler $x^3/3$ ve $x^5/5$:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; \\pi\\left[\\frac{x^3}{3} - \\frac{x^5}{5}\\right]_0^1 \\;=\\; \\pi\\left(\\frac{1}{3} - \\frac{1}{5}\\right) \\;=\\; \\pi \\cdot \\frac{5 - 3}{15} \\;=\\; \\frac{2\\pi}{15}.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;V \\;=\\; \\frac{2\\pi}{15} \\;\\approx\\; 0{,}419\\;}$$</div><div class="formula-sub">Parabolik bir çukurla içi oyulmuş küçük bir mercimek biçimi. $\\int_0^1 x^4\\,dx = 1/5$ integrali, $\\int_0^1 x^2\\,dx = 1/3$ koniden bir paraboloit çıkarılmasına karşılık gelir.</div></div>

<div class="calc-graph"><div id="plot-l33-washer-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $x = 0{,}7$ konumundaki halka kesit. $R = 0{,}7$ yarıçaplı büyük diskten $r = 0{,}49 = 0{,}7^2$ yarıçaplı küçük disk çıkarılarak halka alanı elde edilir; bu alanı $x = 0$'dan $x = 1$'e integral aldığımızda $2\\pi/15$ bulunur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];for(var k=0;k<=100;k++)th.push(2*Math.PI*k/100);
var R=0.7,r=0.49;
var outerX=th.map(function(t){return R*Math.cos(t);}),outerY=th.map(function(t){return R*Math.sin(t);});
var innerX=th.map(function(t){return r*Math.cos(t);}),innerY=th.map(function(t){return r*Math.sin(t);});
var fillX=outerX.concat(innerX.slice().reverse());
var fillY=outerY.concat(innerY.slice().reverse());
var washer={x:fillX,y:fillY,mode:'lines',fill:'toself',fillcolor:'rgba(59,130,246,0.35)',line:{color:'#3b82f6',width:2},name:'halka alanı'};
var inner={x:innerX,y:innerY,mode:'lines',line:{color:'#c8a96e',width:2,dash:'dash'},name:'iç yarıçap r = 0,49'};
var arrowR={x:[0,R],y:[0,0],mode:'lines+markers',line:{color:'#f87171',width:2},marker:{size:6},name:'R = 0,7'};
var arrowr={x:[0,-r],y:[0,0],mode:'lines+markers',line:{color:'#c8a96e',width:2},marker:{size:6},name:'r = 0,49'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.05,1.05]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.05,1.05],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.18},annotations:[{x:0.35,y:0.03,text:'R',showarrow:false,font:{color:'#f87171',size:14}},{x:-0.24,y:0.03,text:'r',showarrow:false,font:{color:'#c8a96e',size:14}}]};
Plotly.newPlot('plot-l33-washer-tr',[washer,inner,arrowR,arrowr],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Kabuk (Shell) Yöntemi</h2>

<p class="l-text">Bazen geometri diskler için zahmetli, kabuklar için doğal olur. $[a, b]$ üzerinde $y = f(x)$ altındaki bir bölgeyi alın (öyle ki $a \\geq 0$) ve <strong>y-ekseni</strong> etrafında döndürün. Eksene dik dilimlemek ($f$'i ters çevirmemizi zorlardı) yerine, bölgeyi $x$ konumunda $dx$ genişliğinde dikey şeritlere bölün ve her şeridi döndürün.</p>

<p class="l-text">$x$ konumundaki dikey şeridin genişliği $dx$, yüksekliği $f(x)$'tir. y-ekseni etrafında döndürüldüğünde ince bir <em>silindirik kabuk</em> (kılıf) tarar: yarıçap $x$, yükseklik $f(x)$, kalınlık $dx$. Kılıfı düz bir dikdörtgen olarak açın: alanı çevre $\\times$ yükseklik $= 2\\pi x \\cdot f(x)$ olur ve hacmi</p>

<div class="calc-formula"><div class="formula-main">$$dV \\;=\\; 2\\pi\\,x\\,f(x)\\,dx.$$</div></div>

<p class="l-text">Tüm kabukları birleştirmek için integral alın:</p>

<div class="calc-formula"><div class="formula-label">KABUK YÖNTEMİ (y-EKSENİ ETRAFINDA DÖNME)</div><div class="formula-main">$$V \\;=\\; 2\\pi\\int_a^b x\\,f(x)\\,dx$$</div><div class="formula-sub">Şeritler dönme eksenine paraleldir. Her biri yarıçapı $x$, yüksekliği $f(x)$ ve kalınlığı $dx$ olan bir silindirik kılıf olur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman kullanılır</div><div class="card-body">Şerit yönüyle aynı doğrultuda olmayan bir eksen etrafında dönme; özellikle $y = f(x)$'i $x = g(y)$'ye çevirmek zor ya da imkânsızsa.</div></div>
<div class="calc-card"><div class="card-title">Şerit yönü</div><div class="card-body">Şeritler dönme eksenine <em>paraleldir</em> (y-ekseni etrafında dönme için dikey şeritler).</div></div>
<div class="calc-card"><div class="card-title">Yarıçap</div><div class="card-body">$x$ — y-ekseninden şeride olan uzaklık.</div></div>
<div class="calc-card"><div class="card-title">İntegrand</div><div class="card-body">$2\\pi x\\,f(x)$ — kılıfın çevresi $\\times$ yüksekliği.</div></div>
</div>

<div class="calc-graph"><div id="plot-l33-shell-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> tek bir silindirik kabuk. $x$ yarıçapında, $f(x)$ yüksekliğinde ve $dx$ kalınlığındaki ince kılıf, genişliği $2\\pi x$ ve yüksekliği $f(x)$ olan düz bir dikdörtgen olarak açılır. Kabukları $a$'dan $b$'ye $x$ ile yığmak tüm cismi doldurur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var th=[];for(var k=0;k<=80;k++)th.push(2*Math.PI*k/80);
var x0=1.0,dx=0.12,h=1.5;
var outerX=th.map(function(t){return (x0+dx)*Math.cos(t);}),outerY=th.map(function(t){return (x0+dx)*Math.sin(t);});
var innerX=th.map(function(t){return x0*Math.cos(t);}),innerY=th.map(function(t){return x0*Math.sin(t);});
var topX=outerX.concat(innerX.slice().reverse());
var topY=outerY.concat(innerY.slice().reverse());
var topRing={x:topX,y:topY,fill:'toself',fillcolor:'rgba(59,130,246,0.45)',line:{color:'#3b82f6',width:1.5},mode:'lines',name:'kabuk halkası (üstten)'};
var unrollW=2*Math.PI*x0;
var rectX=[2.5,2.5+unrollW,2.5+unrollW,2.5,2.5];
var rectY=[-0.05,-0.05,h-0.05,h-0.05,-0.05];
var rect={x:rectX,y:rectY,fill:'toself',fillcolor:'rgba(200,169,110,0.35)',line:{color:'#c8a96e',width:2},mode:'lines',name:'açılmış dikdörtgen'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.4,10]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.4,2.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.18},annotations:[{x:0,y:1.4,text:'kabuk üstten',showarrow:false,font:{color:'#3b82f6',size:13}},{x:5.5,y:1.85,text:'açılmış: 2πx × f(x)',showarrow:false,font:{color:'#c8a96e',size:13}},{x:5.6,y:-0.45,text:'genişlik = 2πx',showarrow:false,font:{color:'rgba(235,230,220,0.7)',size:11}}]};
Plotly.newPlot('plot-l33-shell-tr',[topRing,rect],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Disk mi Kabuk mu — Hangi Zaman?</h2>

<p class="l-text">Her iki yöntem de daima aynı cevabı verir, ama cebir biriyle çok daha kolay olabilir. Belirleyici soru şudur: <em>doğal şeritler dönme eksenine göre hangi yönde uzanıyor?</em></p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">DİSK / HALKA KULLAN</div><div class="compare-item">Şeritler dönme eksenine <strong>dik</strong>tir.</div><div class="compare-item">Kesitler çember ya da halkadır.</div><div class="compare-item">Yarıçap = eksenden eğriye olan uzaklık.</div><div class="compare-item">İntegrand: $\\pi r^2$ ya da $\\pi(R^2 - r^2)$.</div><div class="compare-item">İntegrasyon değişkeni eksen yönüyle uyumlu.</div></div><div class="compare-col"><div class="compare-title">KABUK KULLAN</div><div class="compare-item">Şeritler dönme eksenine <strong>paralel</strong>dir.</div><div class="compare-item">Kesitler silindirik kılıftır.</div><div class="compare-item">Yarıçap = eksenden şeride olan uzaklık.</div><div class="compare-item">İntegrand: $2\\pi r \\cdot h$.</div><div class="compare-item">$y = f(x)$'i ters çevirmek zor olduğunda kullanışlı.</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">x-ekseni etrafında dönme, $y = f(x)$ verilmiş</div><div class="card-body">Disk/halka genellikle en doğaldır — eksene dik dikey şeritler $x$ ile integrasyonu fonksiyon formuna uydurur.</div></div>
<div class="calc-card"><div class="card-title">y-ekseni etrafında dönme, $y = f(x)$ verilmiş</div><div class="card-body">Kabuk genellikle en doğaldır — dikey şeritler eksene paraleldir, $f$'i ters çevirmeye gerek yoktur. Disk için $x = g(y)$ gerekirdi.</div></div>
<div class="calc-card"><div class="card-title">y-ekseni etrafında dönme, $x = g(y)$ verilmiş</div><div class="card-body">$y$'de diskler doğrudan çalışır: $V = \\pi\\int_c^d [g(y)]^2\\,dy$.</div></div>
<div class="calc-card"><div class="card-title">İpucu</div><div class="card-body">Tereddüt ederseniz iki kurulumu da yazın. Hangi integralin hesabı belirgin biçimde kolaysa onu seçin.</div></div>
</div>

<div class="think-box"><div class="think-label">AYNI CEVAP, FARKLI YOLLAR</div><div class="think-body">$y = x^2$ üzerinde $[0, 2]$ aralığını y-ekseni etrafında döndürün: kabuk $V = 2\\pi\\int_0^2 x \\cdot x^2\\,dx = 2\\pi \\cdot 4 = 8\\pi$ verir. $y$'de disk ise $V = \\pi\\int_0^4 (\\sqrt{y})^2\\,dy$'yi dış silindir düzeltmesiyle birlikte gerektirir — daha fazla iş. Kabuk cevabına iki satırda ulaşılır.</div></div>

<h2 class="lesson-title">8. Diskle y-Ekseni Etrafında Dönme</h2>

<p class="l-text">Profil doğal olarak $y \\in [c, d]$ için $x = g(y)$ biçiminde verildiyse, cismi y-eksenine dik olarak dilimlemek yarıçapı $g(y)$ olan diskler verir. Disk-yöntemi formülü kolayca uyarlanır:</p>

<div class="calc-formula"><div class="formula-label">DİSK YÖNTEMİ (y-EKSENİ ETRAFINDA DÖNME)</div><div class="formula-main">$$V \\;=\\; \\pi\\int_c^d [\\,g(y)\\,]^2\\,dy$$</div><div class="formula-sub">Kesitler artık $g(y)$ yarıçaplı yatay disklerdir. $c$ ve $d$ sınırları y-koordinatlarıdır.</div></div>

<p class="l-text">Çoğu zaman özgün fonksiyon $y = f(x)$ olarak verilir ve tersini almak gerekir: $x = f^{-1}(y) = g(y)$. $y = x^2$ için $[0, 2]$ üzerinde $x = \\sqrt{y}$ olur, $y \\in [0, 4]$, dolayısıyla disk integrali $\\pi\\int_0^4 y\\,dy = \\pi[y^2/2]_0^4 = 8\\pi$ olarak okunur. Hem integrandı hem de sınırları güncellemeyi unutmadığınızda muhasebe basittir.</p>

<div class="l-note"><strong>Halka uyarlaması.</strong> İki eğri arasındaki bölge y-ekseni etrafında döndürülürse, dış $R(y)$ ve iç $r(y)$ ile halka formülü $V = \\pi\\int_c^d \\bigl[R(y)^2 - r(y)^2\\bigr]\\,dy$ olur. Aynı fikir, farklı eksen.</div>

<h2 class="lesson-title">9. Çözümlü Örnek — $y = x^2$ üzerinde $[0, 2]$, y-Ekseni Etrafında (Kabuk Yöntemi)</h2>

<p class="l-text">$y = x^2$ altındaki bölgeyi $x = 0$ ile $x = 2$ arasında y-ekseni etrafında döndürün. Dönme eksenine paralel dikey şeritler, yarıçap $x$, yükseklik $f(x) = x^2$, kalınlık $dx$:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; 2\\pi\\int_0^2 x \\cdot x^2\\,dx \\;=\\; 2\\pi\\int_0^2 x^3\\,dx.$$</div></div>

<p class="l-text">$x^3$'ün ters türevi $x^4/4$:</p>

<div class="calc-formula"><div class="formula-main">$$V \\;=\\; 2\\pi\\left[\\frac{x^4}{4}\\right]_0^2 \\;=\\; 2\\pi\\left(\\frac{16}{4} - 0\\right) \\;=\\; 2\\pi \\cdot 4 \\;=\\; 8\\pi.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;V \\;=\\; 8\\pi \\;\\approx\\; 25{,}13\\;}$$</div><div class="formula-sub">Kabuk yöntemi iki satırda temiz bir cevap verir. Disk yöntemi ($y = x^2$'i ters çevirerek) aynı sayıya biraz fazla muhasebeyle ulaşır — aşağıdaki DOĞRULAMAYA bakın.</div></div>

<div class="think-box"><div class="think-label">DİSK YÖNTEMİYLE ÇAPRAZ DOĞRULAMA</div><div class="think-body">Bölge solda $y = x^2$, sağda $x = 2$ dikey doğrusuyla sınırlıdır, $y = 0$'dan $y = 4$'e kadar. y-ekseni etrafında döndürmek, $2$ yarıçaplı ve $4$ yükseklikli silindirden, $x = \\sqrt{y}$'nin taradığı paraboloidi çıkarır. Silindir hacmi: $\\pi \\cdot 4 \\cdot 4 = 16\\pi$. İç paraboloit: $\\pi\\int_0^4 y\\,dy = 8\\pi$. Fark: $16\\pi - 8\\pi = 8\\pi$. Aynı cevap.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Her problemi önce kâğıtta deneyin; aşağıda seçilen yöntemler en kısa yoldur, fakat her problemin en az iki geçerli kurulumu vardır.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — DİSK</div><div class="example-body"><strong>Bulun:</strong> $y = x$, $[0, 3]$ üzerinde x-ekseni etrafında döndürüldüğünde taranan hacim.<br><br><em>Kurulum.</em> Disk yöntemi, yarıçap $x$: $V = \\pi\\int_0^3 x^2\\,dx$.<br><em>Hesap.</em> $V = \\pi[x^3/3]_0^3 = \\pi \\cdot 27/3 = 9\\pi$.<br><em>Kontrol.</em> Koni formülü: $\\pi r^2 h/3 = \\pi \\cdot 9 \\cdot 3/3 = 9\\pi$. ✓</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — DİSK</div><div class="example-body"><strong>Bulun:</strong> Üst yarı çember $y = \\sqrt{R^2 - x^2}$'i $[-R, R]$ üzerinde x-ekseni etrafında döndürerek $R$ yarıçaplı kürenin hacmi.<br><br><em>Kurulum.</em> $V = \\pi\\int_{-R}^{R} (R^2 - x^2)\\,dx$.<br><em>Hesap.</em> $V = \\pi[R^2 x - x^3/3]_{-R}^{R} = \\pi(2R^3 - 2R^3/3) = \\pi \\cdot 4R^3/3$.<br><em>Sonuç.</em> $V = \\frac{4}{3}\\pi R^3$ — klasik küre formülü.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — HALKA</div><div class="example-body"><strong>Bulun:</strong> $y = \\sqrt{x}$ ile $y = x^2$ arasındaki bölgenin $[0, 1]$ üzerinde x-ekseni etrafında dönmesiyle oluşan hacim.<br><br><em>Kurulum.</em> Üst: $R(x) = \\sqrt{x}$, $R^2 = x$. Alt: $r(x) = x^2$, $r^2 = x^4$.<br><em>İntegral.</em> $V = \\pi\\int_0^1 (x - x^4)\\,dx = \\pi[x^2/2 - x^5/5]_0^1 = \\pi(1/2 - 1/5) = \\pi \\cdot 3/10$.<br><em>Sonuç.</em> $V = 3\\pi/10$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — KABUK</div><div class="example-body"><strong>Bulun:</strong> $y = x^2$ altındaki bölgenin $[1, 3]$ üzerinde y-ekseni etrafında dönmesiyle oluşan hacim.<br><br><em>Kurulum.</em> Kabuk: $V = 2\\pi\\int_1^3 x \\cdot x^2\\,dx = 2\\pi\\int_1^3 x^3\\,dx$.<br><em>Hesap.</em> $V = 2\\pi[x^4/4]_1^3 = 2\\pi(81/4 - 1/4) = 2\\pi \\cdot 80/4 = 40\\pi$.<br><em>Sonuç.</em> $V = 40\\pi$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — KABUK</div><div class="example-body"><strong>Bulun:</strong> $y = 2x - x^2$ ve x-ekseni ile sınırlı bölgenin y-ekseni etrafında dönmesiyle oluşan hacim.<br><br><em>Kurulum.</em> Parabol $x = 0$ ve $x = 2$'de eksene değer. Kabuk: $V = 2\\pi\\int_0^2 x(2x - x^2)\\,dx = 2\\pi\\int_0^2 (2x^2 - x^3)\\,dx$.<br><em>Hesap.</em> $V = 2\\pi[2x^3/3 - x^4/4]_0^2 = 2\\pi(16/3 - 4) = 2\\pi(16/3 - 12/3) = 2\\pi \\cdot 4/3 = 8\\pi/3$.<br><em>Sonuç.</em> $V = 8\\pi/3$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — y'DE DİSK</div><div class="example-body"><strong>Bulun:</strong> $y = 2x$, $y = 4$ ve y-ekseni ile sınırlı bölgenin y-ekseni etrafında döndürülmesiyle oluşan koninin hacmi.<br><br><em>Kurulum.</em> $y = 2x$'i $x = y/2$ olarak çözün, $y \\in [0, 4]$. $y$'de disk: $V = \\pi\\int_0^4 (y/2)^2\\,dy = (\\pi/4)\\int_0^4 y^2\\,dy$.<br><em>Hesap.</em> $V = (\\pi/4)[y^3/3]_0^4 = (\\pi/4)(64/3) = 16\\pi/3$.<br><em>Kontrol.</em> Taban yarıçapı $2$, yüksekliği $4$ olan temel koni: $\\pi r^2 h/3 = 16\\pi/3$. ✓</div></div>

<div class="think-box"><div class="think-label">İLERİYE BAKIŞ</div><div class="think-body">Aynı Riemann-dilimleme argümanı birikim gerektiren <em>her</em> fiziksel niceliği hesaplar: yay uzunluğu, dönme yüzeyinin alanı, değişen kuvvetin yaptığı iş, hidrostatik basınç, kütle merkezi, eylemsizlik momentleri. Her durumda tarif aynıdır: diferansiyel öğeyi tanımlayın, katkısını küçük bir çarpım olarak yazın, parametre üzerinden integral alın. Dönme cisimleri, bu büyük endüstriye giden en dostane kapıdır.</div></div>

<h2 class="lesson-title">11. Görsel — Bir Disk-Yöntemi Şeridi ve Kesiti</h2>

<p class="l-text">Aşağıdaki resim disk-yöntemi muhasebesini somutlaştırır. $y = \\sqrt{x}$ profili üstte uzanır; tek bir ince dikey şerit $x = 2{,}25$ konumunda durur ve yüksekliği $f(x) = 1{,}5$'tir. Şerit kesik çizgili x-ekseni etrafında döndürüldüğünde, $1{,}5$ yarıçaplı düz bir disk tarar (sağda çizilmiş). Bu diskin alanı $\\pi(1{,}5)^2$'yi $dx$ şerit kalınlığıyla çarpmak ilkel hacim $dV$'yi verir; tüm böyle şeritleri $x = 0$'dan $x = 4$'e toplamak Bölüm 3'te hesapladığımız $8\\pi$ paraboloit hacmini üretir.</p>

<div class="calc-graph"><div id="plot-l33-tr-extra" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $y = \\sqrt{x}$ profili (sol panel, mavi), dönme ekseni (kesik altın), $x = 2{,}25$ konumunda $\\sqrt{2{,}25} = 1{,}5$ yüksekliğinde tek bir şerit (kırmızı) ve ortaya çıkan $1{,}5$ yarıçaplı kesit diski (sağ panel). Her şerit, böyle bir diskin hacmini kalınlığı $dx$ ile çarparak katkı yapar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];for(var i=0;i<=80;i++){var x=4*i/80;xs.push(x);ys.push(Math.sqrt(x));}
var profile={x:xs,y:ys,mode:'lines',line:{color:'#3b82f6',width:3},name:'y = √x',xaxis:'x1',yaxis:'y1'};
var fillX=xs.concat([4,0]);var fillY=ys.concat([0,0]);
var region={x:fillX,y:fillY,fill:'toself',fillcolor:'rgba(59,130,246,0.12)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'bölge',xaxis:'x1',yaxis:'y1',showlegend:false};
var axisLine={x:[0,4.3],y:[0,0],mode:'lines',line:{color:'#c8a96e',width:2,dash:'dash'},name:'dönme ekseni',xaxis:'x1',yaxis:'y1'};
var xStrip=2.25,fStrip=1.5,stripW=0.10;
var stripX=[xStrip-stripW/2,xStrip+stripW/2,xStrip+stripW/2,xStrip-stripW/2,xStrip-stripW/2];
var stripY=[0,0,fStrip,fStrip,0];
var strip={x:stripX,y:stripY,fill:'toself',fillcolor:'rgba(248,113,113,0.55)',line:{color:'#f87171',width:2},mode:'lines',name:'x = 2,25\'te şerit',xaxis:'x1',yaxis:'y1'};
var radArrow={x:[xStrip,xStrip],y:[0,fStrip],mode:'lines+markers',line:{color:'#f87171',width:1.5,dash:'dot'},marker:{size:5,color:'#f87171'},name:'yarıçap f(x) = 1,5',xaxis:'x1',yaxis:'y1',showlegend:false};
var th=[];for(var k=0;k<=100;k++)th.push(2*Math.PI*k/100);
var diskX=th.map(function(t){return fStrip*Math.cos(t);});
var diskY=th.map(function(t){return fStrip*Math.sin(t);});
var disk={x:diskX,y:diskY,fill:'toself',fillcolor:'rgba(59,130,246,0.35)',line:{color:'#3b82f6',width:2},mode:'lines',name:'kesit diski',xaxis:'x2',yaxis:'y2'};
var rad={x:[0,fStrip],y:[0,0],mode:'lines+markers',line:{color:'#f87171',width:2},marker:{size:6,color:'#f87171'},name:'yarıçap = 1,5',xaxis:'x2',yaxis:'y2',showlegend:false};
var center={x:[0],y:[0],mode:'markers',marker:{size:7,color:'#c8a96e',symbol:'x'},name:'eksen burayı deler',xaxis:'x2',yaxis:'y2',showlegend:false};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},grid:{rows:1,columns:2,pattern:'independent'},margin:{t:40,r:30,b:60,l:50},showlegend:true,legend:{font:{color:'#ebe6dc',size:11},orientation:'h',x:0.5,xanchor:'center',y:-0.16},xaxis:{domain:[0,0.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x',range:[-0.2,4.4]},yaxis:{domain:[0,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y',range:[-0.4,2.5],scaleanchor:'x',scaleratio:1},xaxis2:{domain:[0.58,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.9,1.9],anchor:'y2'},yaxis2:{domain:[0,1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'',range:[-1.9,1.9],scaleanchor:'x2',scaleratio:1,anchor:'x2'},annotations:[{x:0.22,y:1.06,xref:'paper',yref:'paper',text:'profil + x = 2,25\'te şerit',showarrow:false,font:{color:'#3b82f6',size:12}},{x:0.79,y:1.06,xref:'paper',yref:'paper',text:'x-ekseni etrafında dön → f(x) yarıçaplı disk',showarrow:false,font:{color:'#3b82f6',size:12}},{x:xStrip+0.18,y:fStrip*0.55,xref:'x1',yref:'y1',text:'f(x)=1,5',showarrow:false,font:{color:'#f87171',size:11}},{x:2.1,y:-0.25,xref:'x1',yref:'y1',text:'dönme ekseni (kesik)',showarrow:false,font:{color:'#c8a96e',size:11}},{x:0.85,y:0.18,xref:'x2',yref:'y2',text:'r = 1,5',showarrow:false,font:{color:'#f87171',size:12}},{x:0,y:-1.55,xref:'x2',yref:'y2',text:'alan = π·(1,5)² ≈ 7,07',showarrow:false,font:{color:'rgba(235,230,220,0.85)',size:11}}]};
Plotly.newPlot('plot-l33-tr-extra',[region,profile,axisLine,strip,radArrow,disk,rad,center],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Özet Tablo — Hangi Kurulumda Hangi Yöntem</h2>

<p class="l-text">Tek bir referans kartı. Dönme eksenini bölgenin tanımlandığı biçimle eşleştirin; tablo size hangi formülü uygulayacağınızı ve örnek bir integrandı söyler.</p>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(20,20,24,0.55);color:rgba(235,230,220,0.92);font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead>
<tr style="background:#3b82f6;color:#ffffff">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Yöntem</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Formül</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Ne zaman kullanılır</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;border:1px solid rgba(255,255,255,0.12)">Örnek integrand & sınırlar</th>
</tr>
</thead>
<tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.08)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Disk (x-ekseni etrafında)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_a^b [f(x)]^2\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Bölge x-eksenine değer; x-ekseni etrafında dönme; şeritler eksene dik.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = \\sqrt{x}$, $[0, 4]$: $\\pi\\int_0^4 x\\,dx = 8\\pi$</td>
</tr>
<tr style="border-top:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Halka (x-ekseni etrafında)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_a^b [R(x)^2 - r(x)^2]\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">İç eğri eksenin üstünde kalan iki eğri arasındaki bölge; dönme bir delik bırakır.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y=x$ ile $y=x^2$ arası, $[0,1]$: $\\pi\\int_0^1 (x^2 - x^4)\\,dx = 2\\pi/15$</td>
</tr>
<tr style="border-top:1px solid rgba(255,255,255,0.08)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Kabuk (y-ekseni etrafında)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = 2\\pi\\int_a^b x\\,f(x)\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = f(x)$ verilmiş, y-ekseni etrafında dönme, $a \\geq 0$; $f$'i ters çevirmek zor.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = x^2$, $[0, 2]$: $2\\pi\\int_0^2 x^3\\,dx = 8\\pi$</td>
</tr>
<tr style="border-top:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600;color:#c8a96e">Disk (y-ekseni etrafında)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_c^d [g(y)]^2\\,dy$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Profil doğal olarak $x = g(y)$ verilmiş; y-ekseni etrafında dönme; yatay diskler.</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$x = y/2$, $[0, 4]$: $\\pi\\int_0^4 y^2/4\\,dy = 16\\pi/3$</td>
</tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>Bu kart nasıl okunur.</strong> Önce dönme eksenine bakın. Ardından, fonksiyon biçimine eksene dik şeritlerin (disk / halka) mi yoksa paralel şeritlerin (kabuk) mi daha iyi uyduğunu kontrol edin. Sağdaki sütun bu derste daha önce çözdüğümüz bir örneği gösterir — integrale girmeden önce kurulumunuzu çapraz doğrulamak için kullanın.</div>
`
};
