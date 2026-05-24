window.LISE_MAT_L34 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Integration is much more than computing areas under curves.</strong> Once you know how to add up infinitely many infinitesimal contributions, a vast collection of physical and geometric quantities open up to you. The work done by a stretched spring, the total energy needed to pump water out of a swimming pool, the average temperature of a city over a year, the length of a winding mountain road, the surface area of a vase produced on a lathe — each of these is a sum of tiny pieces, and each is computed by an integral.</p>

<p class="l-text">In this lesson we take the integral and turn it into a multi-purpose tool. We first define work as the integral of a variable force along a path, then we generalise the idea of an arithmetic average to a continuous setting (the Mean Value Theorem for Integrals), then we measure the length of a curve, and finally we sweep that curve around an axis to produce a surface of revolution. By the end you will see the integral not as a "find-the-area" recipe but as a universal accumulator.</p>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute work as $W = \\int_a^b F(x)\\,dx$ for a variable one-dimensional force</li>
<li>Set up and evaluate spring work (Hooke's law $F = kx$) and water-pumping integrals</li>
<li>State and apply the Mean Value Theorem for Integrals: $\\exists\\,c \\in [a,b]$ with $f(c) = \\tfrac{1}{b-a}\\int_a^b f(x)\\,dx$</li>
<li>Interpret the average value of a function as the height of the equivalent rectangle</li>
<li>Use the arc length formula $L = \\int_a^b \\sqrt{1 + (f'(x))^2}\\,dx$ for smooth curves</li>
<li>Compute the surface area $S = 2\\pi\\int_a^b y\\sqrt{1 + (y')^2}\\,dx$ swept by rotating a curve about the x-axis</li>
</ul>
</div>

<h2 class="lesson-title">1. Work — Constant and Variable Force</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> push a heavy box across a flat floor with a steady force of $50$ N for $4$ m. The work you do is $W = F \\cdot d = 200$ J — force times distance, easy. But what if the force changes as the box moves? A spring pulls harder the more it is stretched; gravity grows weaker as a rocket rises. In those cases "force $\\times$ distance" must be replaced by an integral.</div>

<p class="l-text">In physics, <strong>work</strong> is the energy transferred to an object when a force acts on it along its direction of motion. For a constant force the formula is the familiar product</p>

<div class="calc-formula"><div class="formula-label">WORK FOR A CONSTANT FORCE</div><div class="formula-main">$$W \\;=\\; F \\cdot d.$$</div><div class="formula-sub">$F$ is the (constant) magnitude of the force in newtons, $d$ is the displacement in metres, and $W$ comes out in joules ($1\\,\\text{J} = 1\\,\\text{N}\\cdot\\text{m}$).</div></div>

<p class="l-text">If the force depends on position — that is, $F = F(x)$ where $x$ measures where we are along the path — then on a small step $dx$ the contribution to the work is the product of the local force and the step length:</p>

<div class="calc-formula"><div class="formula-main">$$dW \\;=\\; F(x)\\,dx.$$</div></div>

<p class="l-text">Summing (integrating) all these tiny contributions from $x = a$ to $x = b$ gives the variable-force work integral.</p>

<div class="calc-formula"><div class="formula-label">WORK FOR A VARIABLE FORCE</div><div class="formula-main">$$W \\;=\\; \\int_a^b F(x)\\,dx.$$</div><div class="formula-sub">Read: "work equals the integral of the position-dependent force from the starting point $a$ to the ending point $b$." Geometrically, $W$ is the area under the force-displacement graph on $[a, b]$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Force $F(x)$</div><div class="card-body">A function giving the magnitude of the applied force at each position $x$. For a spring this grows linearly; for gravity it falls off; for a constant push it does not change.</div></div>
<div class="calc-card"><div class="card-title">Step $dx$</div><div class="card-body">An infinitesimal change in position. The product $F(x)\\,dx$ is the work done while moving from $x$ to $x + dx$, during which the force is effectively constant.</div></div>
<div class="calc-card"><div class="card-title">Limits $a$, $b$</div><div class="card-body">Starting and ending positions. The integral accumulates work as the object moves through every intermediate position between $a$ and $b$.</div></div>
<div class="calc-card"><div class="card-title">Units</div><div class="card-body">If $F$ is in N and $x$ in m, then $W$ is in joules. If $F$ is in kgf and $x$ in cm, multiply carefully — physics problems almost always demand SI units.</div></div>
</div>

<div class="think-box"><div class="think-label">WHY AN INTEGRAL?</div><div class="think-body">A variable force changes as the object moves, so "force times distance" no longer makes sense as a single product — which value of $F$ would we use? The integral solves this by chopping the path into infinitely many short steps, treating $F$ as constant on each step, then summing up. This is exactly the same logic that turned "rectangles under a curve" into the Riemann integral.</div></div>

<h2 class="lesson-title">2. Worked Example 1 — Stretching a Spring (Hooke's Law)</h2>

<div class="calc-highlight"><strong>Hooke's law.</strong> For a spring obeying Hooke's law, the force needed to hold the spring at displacement $x$ from its natural length is $F(x) = kx$, where $k$ is the spring constant in N/m. The further you stretch, the harder you must pull — linearly.</div>

<p class="l-text"><strong>Problem.</strong> A spring with spring constant $k = 200$ N/m has a natural length of $30$ cm. How much work is required to stretch it from its natural length to a length of $50$ cm?</p>

<p class="l-text"><strong>Step 1. Convert units.</strong> The stretch is $50 - 30 = 20$ cm $= 0.20$ m. We integrate from $x = 0$ (natural length) to $x = 0.20$ m (fully stretched).</p>

<p class="l-text"><strong>Step 2. Write the force.</strong> $F(x) = kx = 200x$ N.</p>

<p class="l-text"><strong>Step 3. Set up and evaluate the integral.</strong></p>

<div class="calc-formula"><div class="formula-main">$$W \\;=\\; \\int_0^{0.20} 200x\\,dx \\;=\\; 200 \\cdot \\frac{x^2}{2}\\Bigg|_0^{0.20} \\;=\\; 100 \\cdot (0.20)^2 \\;=\\; 100 \\cdot 0.04 \\;=\\; 4\\,\\text{J}.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;W \\;=\\; 4\\,\\text{joules}\\;}$$</div><div class="formula-sub">Stretching this spring by 20 cm requires 4 J of work. Notice that the work scales with $x^2$ — to stretch twice as far costs four times as much work.</div></div>

<div id="plot-l34-spring-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],Fs=[];
for(var i=0;i<=100;i++){var x=0.20*i/100;xs.push(x);Fs.push(200*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=Fs.slice().concat(xs.map(function(){return 0;}).reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'work = area under F(x)',hoverinfo:'skip',showlegend:true};
var tLine={x:xs,y:Fs,mode:'lines',name:'F(x) = 200 x',line:{color:'#c8a96e',width:2.8}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'displacement x (m)',range:[-0.02,0.24]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'force F(x) (N)',range:[-2,50]},margin:{t:30,r:30,b:55,l:60},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0.10,y:14,text:'W = 4 J',showarrow:false,font:{color:'#22c55e',size:14}}]};
Plotly.newPlot('plot-l34-spring-en',[tFill,tLine],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the force needed to hold the spring at displacement $x$ grows linearly: $F(x) = 200x$ (gold line). The shaded green triangle under the line, from $x = 0$ to $x = 0.20$, has area $\\tfrac{1}{2}(0.20)(40) = 4$ — this is exactly the work in joules.</div></div>

<div class="l-note"><strong>Quick check by geometry.</strong> Because $F$ is linear, the area under the line is a triangle. Its base is $0.20$ m, its height is $F(0.20) = 40$ N, so the area is $\\tfrac{1}{2}(0.20)(40) = 4$ J — agreeing with the integral. For linear forces you can always read the work off as a triangle area.</div>

<h2 class="lesson-title">3. Worked Example 2 — Pumping Water Out of a Tank</h2>

<div class="calc-highlight"><strong>The new twist:</strong> different layers of water travel different distances to escape. A layer near the surface has only a short way to go; a layer at the bottom has the full depth to climb. The total pumping work is the sum of all layer contributions — an integral.</div>

<p class="l-text"><strong>Problem.</strong> A rectangular tank with base area $A = 2 \\text{ m}^2$ is filled to a depth of $3$ m with water. The water must be pumped over the top edge of the tank. Find the work required, taking the density of water as $\\rho = 1000$ kg/m³ and $g = 9.8$ m/s².</p>

<p class="l-text"><strong>Strategy.</strong> Set up a coordinate $y$ measuring depth below the top of the tank, so $y = 0$ at the top and $y = 3$ at the bottom. A thin horizontal layer of water at depth $y$ has thickness $dy$, volume $A\\,dy$, mass $\\rho A\\,dy$, and weight $\\rho g A\\,dy$. This layer must be lifted a distance $y$ to reach the top, so it contributes</p>

<div class="calc-formula"><div class="formula-main">$$dW \\;=\\; (\\text{weight of layer}) \\cdot (\\text{lift distance}) \\;=\\; \\rho g A \\cdot y\\,dy.$$</div></div>

<p class="l-text">Integrate from $y = 0$ (the top layer) down to $y = 3$ (the bottom layer):</p>

<div class="calc-formula"><div class="formula-main">$$W \\;=\\; \\int_0^3 \\rho g A \\cdot y\\,dy \\;=\\; \\rho g A \\cdot \\frac{y^2}{2}\\Bigg|_0^3 \\;=\\; \\rho g A \\cdot \\frac{9}{2}.$$</div></div>

<p class="l-text">Plugging in numbers ($\\rho = 1000$, $g = 9.8$, $A = 2$):</p>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$W \\;=\\; 1000 \\cdot 9.8 \\cdot 2 \\cdot \\frac{9}{2} \\;=\\; 88{,}200\\,\\text{J} \\;\\approx\\; 88.2\\,\\text{kJ}.$$</div><div class="formula-sub">It takes about $88$ kilojoules to pump all the water out — enough energy to power a $100$-watt bulb for almost $15$ minutes.</div></div>

<div class="think-box"><div class="think-label">WHY $y$ AND NOT $y^2$ IN THE INTEGRAND?</div><div class="think-body">Each thin layer has the <em>same</em> volume $A\\,dy$ (the cross-section is constant). What changes from layer to layer is only the <em>distance</em> $y$ it must be lifted. So $dW$ is "weight (fixed) times distance (variable)" $= \\rho g A \\cdot y\\,dy$. The integral of $y$ from $0$ to $3$ is $9/2$. For tanks whose cross-section varies with depth (a cone, a hemispherical bowl), the volume factor itself depends on $y$ and the integrand becomes more complicated.</div></div>

<h2 class="lesson-title">4. The Mean Value Theorem for Integrals</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> the temperature in your city varies hour by hour through the day. The <em>average</em> daily temperature is a single number that captures the "typical" warmth. Continuous-time averages — like the average temperature, average speed of a car, average current through a wire — are all computed with the same integral formula.</div>

<p class="l-text">For a finite list of $n$ numbers $a_1, a_2, \\dots, a_n$ the arithmetic average is just $(a_1 + \\dots + a_n)/n$. For a continuous function $f$ on $[a, b]$, we cannot list values one by one because there are infinitely many of them. The natural generalisation is</p>

<div class="calc-formula"><div class="formula-label">AVERAGE VALUE OF A FUNCTION</div><div class="formula-main">$$\\bar f \\;=\\; \\frac{1}{b - a}\\int_a^b f(x)\\,dx.$$</div><div class="formula-sub">$\\bar f$ (read "f-bar") is the average value of $f$ over $[a, b]$. The integral sums the values of $f$; dividing by the length $b - a$ converts the sum into an average.</div></div>

<p class="l-text">The <strong>Mean Value Theorem for Integrals</strong> says that this average is actually attained by the function at some point inside the interval — provided $f$ is continuous on $[a, b]$.</p>

<div class="calc-formula"><div class="formula-label">MEAN VALUE THEOREM (INTEGRAL FORM)</div><div class="formula-main">$$\\text{If } f \\text{ is continuous on } [a, b], \\;\\; \\exists\\,c \\in [a, b] \\;\\;\\text{such that}\\;\\; f(c) \\;=\\; \\frac{1}{b - a}\\int_a^b f(x)\\,dx.$$</div><div class="formula-sub">"There exists a point $c$ where the function value equals the average value." Equivalently: $\\int_a^b f(x)\\,dx = f(c) \\cdot (b - a)$ — the integral equals the area of a rectangle whose height is the function value at $c$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Continuity required</div><div class="card-body">The theorem fails if $f$ has a jump discontinuity inside $[a, b]$. Continuity guarantees that $f$ takes on every value between its min and max — including the average.</div></div>
<div class="calc-card"><div class="card-title">$c$ is not unique</div><div class="card-body">There can be more than one point where $f(c) = \\bar f$. The theorem only promises at least one exists.</div></div>
<div class="calc-card"><div class="card-title">Geometric rectangle</div><div class="card-body">Multiplying both sides by $(b - a)$ gives $\\int_a^b f\\,dx = \\bar f \\cdot (b - a)$ — the integral equals the area of a rectangle with width $b - a$ and height $\\bar f$.</div></div>
</div>

<h2 class="lesson-title">5. Geometric Meaning of the Average — Equivalent Rectangle</h2>

<p class="l-text">The average value $\\bar f$ is the height of the rectangle that, sitting on the base $[a, b]$, has the same area as the region under the graph of $f$. That is, you "flatten" all the bumps of the graph into a single uniform height.</p>

<div id="plot-l34-mvt-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];
var a=0,b=Math.PI;
for(var i=0;i<=200;i++){var x=a+(b-a)*i/200;xs.push(x);ys.push(Math.sin(x));}
var avg=2/Math.PI;
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=ys.slice().concat(xs.map(function(){return 0;}).reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.18)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'area under f',hoverinfo:'skip',showlegend:true};
var tCurve={x:xs,y:ys,mode:'lines',name:'f(x) = sin x',line:{color:'#c8a96e',width:2.8}};
var tRect={x:[a,a,b,b,a],y:[0,avg,avg,0,0],mode:'lines',name:'equivalent rectangle',line:{color:'#3b82f6',width:2.5,dash:'dash'}};
var tAvgLine={x:[a,b],y:[avg,avg],mode:'lines',name:'avg = 2/π ≈ 0.637',line:{color:'#f87171',width:2.5}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.15,Math.PI+0.15]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.15,1.2]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:Math.PI/2,y:avg,text:'f(c) = avg',showarrow:true,arrowhead:2,ax:0,ay:-40,font:{color:'#f87171',size:13}}]};
Plotly.newPlot('plot-l34-mvt-en',[tFill,tCurve,tAvgLine,tRect],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> on $[0, \\pi]$ the average value of $\\sin x$ is $\\bar f = 2/\\pi \\approx 0.637$ (red line). The blue dashed rectangle has the same base and a height equal to $\\bar f$; its area equals the green area under the sine curve, which equals $2$. The Mean Value Theorem guarantees a point $c \\in [0, \\pi]$ where $\\sin c = 2/\\pi$ — in fact there are two such points, symmetric about $\\pi/2$.</div></div>

<div class="think-box"><div class="think-label">CHECK THE NUMBERS</div><div class="think-body">$\\int_0^{\\pi}\\sin x\\,dx = [-\\cos x]_0^{\\pi} = -(-1) - (-1) = 2$. Divide by the length $\\pi - 0 = \\pi$ to get the average $2/\\pi \\approx 0.637$. The equivalent rectangle is $\\pi \\times (2/\\pi)$ wide-by-tall — its area is exactly $2$, matching the integral.</div></div>

<h2 class="lesson-title">6. Worked Example 3 — Average Yearly Temperature</h2>

<p class="l-text"><strong>Problem.</strong> Suppose the daily mean temperature in a city varies through the year (with $t$ in days from $0$ to $365$) as</p>

<div class="calc-formula"><div class="formula-main">$$T(t) \\;=\\; 14 + 12\\sin\\!\\left(\\frac{2\\pi (t - 100)}{365}\\right)\\,°\\text{C}.$$</div></div>

<p class="l-text">What is the average temperature over the whole year?</p>

<p class="l-text"><strong>Solution.</strong> The yearly average is</p>

<div class="calc-formula"><div class="formula-main">$$\\bar T \\;=\\; \\frac{1}{365}\\int_0^{365} \\left[14 + 12\\sin\\!\\left(\\frac{2\\pi (t - 100)}{365}\\right)\\right]dt.$$</div></div>

<p class="l-text">Split the integral into two pieces. The constant term integrates trivially: $\\int_0^{365} 14\\,dt = 14 \\cdot 365$. The sine term is a full sinusoidal oscillation over exactly one period (the period is $365$ days by design), so its integral over a complete period is <em>zero</em>:</p>

<div class="calc-formula"><div class="formula-main">$$\\int_0^{365} 12\\sin\\!\\left(\\frac{2\\pi (t - 100)}{365}\\right)dt \\;=\\; 0.$$</div></div>

<p class="l-text">Therefore</p>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\bar T \\;=\\; \\frac{1}{365}(14 \\cdot 365 + 0) \\;=\\; 14\\,°\\text{C}.$$</div><div class="formula-sub">The seasonal oscillation averages out to zero over a full year. The average yearly temperature is simply the offset: $14$°C.</div></div>

<div class="l-note"><strong>A pattern worth remembering.</strong> Any function of the form "constant $+$ pure sinusoid" has average value equal to the constant alone, provided you integrate over a whole number of periods. This is why the constant term of a Fourier series is exactly the average value of the function.</div>

<h2 class="lesson-title">7. Arc Length — Measuring How Long a Curve Is</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a mountain road that winds back and forth covers far more kilometres than the straight-line distance between the start and the finish. To find the actual driving distance you must follow every twist and turn — the <em>arc length</em> of the road.</div>

<p class="l-text">Suppose $y = f(x)$ is a smooth curve on $[a, b]$. Approximate it by a polygonal path: chop the interval into many tiny pieces $\\Delta x_i$, and connect the points $(x_i, f(x_i))$ by straight-line segments. The length of one segment is, by the Pythagorean theorem,</p>

<div class="calc-formula"><div class="formula-main">$$\\Delta L_i \\;\\approx\\; \\sqrt{(\\Delta x_i)^2 + (\\Delta y_i)^2} \\;=\\; \\sqrt{1 + \\left(\\frac{\\Delta y_i}{\\Delta x_i}\\right)^2}\\,\\Delta x_i.$$</div></div>

<p class="l-text">As $\\Delta x_i \\to 0$ the ratio $\\Delta y_i / \\Delta x_i$ becomes the derivative $f'(x_i)$, the sum becomes an integral, and we get the master arc-length formula.</p>

<div class="calc-formula"><div class="formula-label">ARC LENGTH FORMULA</div><div class="formula-main">$$L \\;=\\; \\int_a^b \\sqrt{1 + \\bigl(f'(x)\\bigr)^2}\\,dx.$$</div><div class="formula-sub">For a smooth curve $y = f(x)$ on $[a, b]$, the arc length is the integral of $\\sqrt{1 + (f')^2}$. The "$1$" inside the square root accounts for horizontal progress; the "$(f')^2$" accounts for the vertical rise.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sqrt{1 + (f')^2}$</div><div class="card-body">A local measure of how stretched the curve is per unit of $x$. If the curve is horizontal ($f' = 0$) this is $1$ and the arc length equals the x-span. If the curve is steep, the integrand is bigger and the arc length exceeds the x-span.</div></div>
<div class="calc-card"><div class="card-title">Smoothness</div><div class="card-body">The formula requires $f'$ to exist and be continuous on $[a, b]$. Cusps and corners need special handling (split the integral at every corner).</div></div>
<div class="calc-card"><div class="card-title">Hard integrals</div><div class="card-body">Even for innocent-looking $f$ the square root often produces nasty integrals (e.g. $y = x^2$ on $[0, 1]$ leads to an integral that needs hyperbolic substitutions). The few hand-friendly cases are the ones we teach.</div></div>
</div>

<div id="plot-l34-arc-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];
for(var i=0;i<=120;i++){var x=i/120*4;xs.push(x);ys.push(0.5*Math.sin(2*x)+0.3*x);}
var tCurve={x:xs,y:ys,mode:'lines',name:'curved path',line:{color:'#c8a96e',width:2.8}};
var tStraight={x:[0,4],y:[ys[0],ys[120]],mode:'lines',name:'straight-line distance',line:{color:'#3b82f6',width:2.2,dash:'dash'}};
var tStartEnd={x:[0,4],y:[ys[0],ys[120]],mode:'markers',name:'endpoints',marker:{size:9,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.2,4.3]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.8,2]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:2,y:1.6,text:'arc length L > straight distance',showarrow:false,font:{color:'#ebe6dc',size:12}}]};
Plotly.newPlot('plot-l34-arc-en',[tCurve,tStraight,tStartEnd],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the gold wavy curve traces an actual path; the blue dashed line shows the straight-line distance between the endpoints. The integral $\\int_a^b\\sqrt{1 + (f')^2}\\,dx$ measures the wavy path's true length, which is always at least as large as the straight-line distance and strictly larger whenever $f' \\neq 0$ somewhere.</div></div>

<p class="l-text"><strong>Zooming into one infinitesimal step.</strong> The next plot magnifies a single point of the curve and shows the right triangle whose legs are $dx$ and $dy$ and whose hypotenuse is the arc element $ds = \\sqrt{dx^2 + dy^2}$. Summing all these hypotenuses along the curve is exactly the arc length integral.</p>

<div id="plot-l34-ds-en-extra" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];
for(var i=0;i<=200;i++){var x=i/200*2.4;xs.push(x);ys.push(0.35*x*x+0.4);}
var x0=1.4,y0=0.35*x0*x0+0.4;
var dx=0.5,dy=(0.35*(x0+dx)*(x0+dx)+0.4)-y0;
var x1=x0+dx,y1=y0+dy;
var tCurve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#c8a96e',width:2.8}};
var tHorz={x:[x0,x1],y:[y0,y0],mode:'lines',name:'dx',line:{color:'#3b82f6',width:3}};
var tVert={x:[x1,x1],y:[y0,y1],mode:'lines',name:'dy',line:{color:'#22c55e',width:3}};
var tHyp={x:[x0,x1],y:[y0,y1],mode:'lines',name:'ds = √(dx² + dy²)',line:{color:'#f87171',width:3}};
var tPts={x:[x0,x1],y:[y0,y1],mode:'markers',name:'curve points',marker:{size:8,color:'#ebe6dc'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[0,2.5]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[0,2.6],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:(x0+x1)/2,y:y0-0.13,text:'dx',showarrow:false,font:{color:'#3b82f6',size:13}},{x:x1+0.12,y:(y0+y1)/2,text:'dy',showarrow:false,font:{color:'#22c55e',size:13}},{x:(x0+x1)/2-0.12,y:(y0+y1)/2+0.18,text:'ds',showarrow:false,font:{color:'#f87171',size:14}},{x:1.0,y:2.3,text:'ds² = dx² + dy²  ⇒  L = ∫ √(1 + (f′)²) dx',showarrow:false,font:{color:'#ebe6dc',size:12}}]};
Plotly.newPlot('plot-l34-ds-en-extra',[tCurve,tHorz,tVert,tHyp,tPts],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> at a chosen point on the curve $y = f(x)$, a small right triangle is drawn with horizontal leg $dx$ (blue), vertical leg $dy$ (green), and hypotenuse $ds$ (red). Pythagoras gives $ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + (dy/dx)^2}\\,dx$. Stacking these infinitesimal hypotenuses end-to-end along the curve and integrating from $a$ to $b$ produces the arc length $L = \\int_a^b\\sqrt{1 + (f'(x))^2}\\,dx$.</div></div>

<h2 class="lesson-title">8. Worked Example 4 — Arc Length of $y = \\tfrac{2}{3}x^{3/2}$ on $[0, 3]$</h2>

<p class="l-text">This curve is engineered to give a tidy answer (the $\\tfrac{2}{3}$ coefficient is chosen so the derivative is a clean square root).</p>

<p class="l-text"><strong>Step 1. Differentiate.</strong></p>

<div class="calc-formula"><div class="formula-main">$$f(x) \\;=\\; \\tfrac{2}{3}x^{3/2} \\quad\\Longrightarrow\\quad f'(x) \\;=\\; \\tfrac{2}{3} \\cdot \\tfrac{3}{2}x^{1/2} \\;=\\; \\sqrt{x}.$$</div></div>

<p class="l-text"><strong>Step 2. Square and add 1.</strong></p>

<div class="calc-formula"><div class="formula-main">$$1 + (f'(x))^2 \\;=\\; 1 + x.$$</div></div>

<p class="l-text"><strong>Step 3. Set up the arc-length integral.</strong></p>

<div class="calc-formula"><div class="formula-main">$$L \\;=\\; \\int_0^3 \\sqrt{1 + x}\\,dx.$$</div></div>

<p class="l-text"><strong>Step 4. Substitute $u = 1 + x$, so $du = dx$. When $x = 0$, $u = 1$; when $x = 3$, $u = 4$.</strong></p>

<div class="calc-formula"><div class="formula-main">$$L \\;=\\; \\int_1^4 \\sqrt{u}\\,du \\;=\\; \\frac{2}{3}u^{3/2}\\Bigg|_1^4 \\;=\\; \\frac{2}{3}(8 - 1) \\;=\\; \\frac{14}{3}.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;L \\;=\\; \\frac{14}{3} \\;\\approx\\; 4.667\\;\\text{units}\\;}$$</div><div class="formula-sub">The straight-line distance from $(0, 0)$ to $(3, 2\\sqrt{3}) \\approx (3, 3.464)$ would be $\\sqrt{9 + 12} = \\sqrt{21} \\approx 4.583$. The curve is slightly longer (as it must be), confirming our answer.</div></div>

<h2 class="lesson-title">9. Surface of Revolution — Area When a Curve Spins About an Axis</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a potter's wheel takes a curved profile and spins it around a vertical axis to make a vase. The outer surface of the vase is a <em>surface of revolution</em>. So is the outside of a wine glass, a candle holder, or a baseball bat. Each is generated by rotating a planar curve $y = f(x)$ about an axis.</div>

<p class="l-text">Imagine rotating the graph of $y = f(x) \\geq 0$ about the x-axis. A short piece of the curve at horizontal position $x$ has length $dL = \\sqrt{1 + (f'(x))^2}\\,dx$ (the arc-length element). When this short piece sweeps around the x-axis it traces out a thin band — essentially a slanted ring of radius $y = f(x)$ and slant length $dL$. The area of that band is</p>

<div class="calc-formula"><div class="formula-main">$$dS \\;=\\; 2\\pi \\cdot y \\cdot dL \\;=\\; 2\\pi y \\sqrt{1 + (f'(x))^2}\\,dx.$$</div></div>

<p class="l-text">Summing all bands from $x = a$ to $x = b$ gives the surface-area formula.</p>

<div class="calc-formula"><div class="formula-label">SURFACE OF REVOLUTION ABOUT THE x-AXIS</div><div class="formula-main">$$S \\;=\\; 2\\pi \\int_a^b y\\,\\sqrt{1 + (y')^2}\\,dx \\quad \\text{where } y = f(x).$$</div><div class="formula-sub">The factor $2\\pi y$ is the circumference traced by the point at height $y$; $\\sqrt{1 + (y')^2}\\,dx$ is the slant length of the band; together they give the band area.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why $2\\pi y$, not $\\pi y^2$?</div><div class="card-body">$2\\pi y$ is the <em>circumference</em> of the circle of radius $y$ — this is the perimeter the small band traces. $\\pi y^2$ would be the disk area, which is wrong for a surface.</div></div>
<div class="calc-card"><div class="card-title">About the y-axis</div><div class="card-body">If you rotate about the y-axis instead, the radius factor becomes $x$ (the horizontal distance to the axis), giving $S = 2\\pi\\int x\\sqrt{1 + (y')^2}\\,dx$.</div></div>
<div class="calc-card"><div class="card-title">Pappus's theorem</div><div class="card-body">A classical shortcut: the surface area equals the path length times the distance travelled by the centroid of the curve. We will not need it here, but it is a beautiful check.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK CHECK — SURFACE OF A SPHERE</div><div class="example-body"><strong>Generate a sphere</strong> by rotating the upper semicircle $y = \\sqrt{R^2 - x^2}$ about the x-axis on $[-R, R]$.<br><br>$y' = \\dfrac{-x}{\\sqrt{R^2 - x^2}}$, so $(y')^2 = \\dfrac{x^2}{R^2 - x^2}$ and $1 + (y')^2 = \\dfrac{R^2}{R^2 - x^2}$.<br><br>The integrand becomes $y\\sqrt{1 + (y')^2} = \\sqrt{R^2 - x^2} \\cdot \\dfrac{R}{\\sqrt{R^2 - x^2}} = R$ — beautifully constant.<br><br>$S = 2\\pi\\int_{-R}^{R} R\\,dx = 2\\pi R \\cdot 2R = \\boxed{4\\pi R^2}$, the well-known sphere-surface formula.</div></div>

<h2 class="lesson-title">10. Classic Exercises</h2>

<p class="l-text">Six standard problems mixing work, average value, and arc length. Solve each on paper, then read the answer.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — SPRING WORK</div><div class="example-body"><strong>A spring with $k = 120$ N/m is stretched from its natural length to $25$ cm beyond natural length.</strong> How much work is done?<br><br><em>Solution.</em> $W = \\int_0^{0.25} 120 x\\,dx = 60 x^2\\Big|_0^{0.25} = 60(0.0625) = 3.75$ J. <strong>Answer: $3.75$ J.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — VARIABLE FORCE</div><div class="example-body"><strong>A particle is moved along the x-axis from $x = 1$ to $x = 4$ by a force $F(x) = \\dfrac{6}{x^2}$ N.</strong> Find the work done.<br><br><em>Solution.</em> $W = \\int_1^4 \\dfrac{6}{x^2}\\,dx = 6 \\cdot \\left[-\\dfrac{1}{x}\\right]_1^4 = 6\\left(-\\dfrac{1}{4} + 1\\right) = 6 \\cdot \\dfrac{3}{4} = \\dfrac{9}{2} = 4.5$ J. <strong>Answer: $4.5$ J.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — AVERAGE VALUE</div><div class="example-body"><strong>Find the average value of $f(x) = x^2$ on $[0, 3]$.</strong><br><br><em>Solution.</em> $\\bar f = \\dfrac{1}{3 - 0}\\int_0^3 x^2\\,dx = \\dfrac{1}{3}\\cdot\\dfrac{x^3}{3}\\Big|_0^3 = \\dfrac{1}{3}\\cdot 9 = 3$. <strong>Answer: $\\bar f = 3$.</strong> By the MVT the value $f(c) = 3$ is attained at $c = \\sqrt{3} \\approx 1.73$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — AVERAGE OF COSINE</div><div class="example-body"><strong>Find the average value of $\\cos x$ on $[0, \\pi/2]$.</strong><br><br><em>Solution.</em> $\\bar f = \\dfrac{2}{\\pi}\\int_0^{\\pi/2}\\cos x\\,dx = \\dfrac{2}{\\pi}[\\sin x]_0^{\\pi/2} = \\dfrac{2}{\\pi}(1 - 0) = \\dfrac{2}{\\pi} \\approx 0.637$. <strong>Answer: $2/\\pi$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — ARC LENGTH</div><div class="example-body"><strong>Find the arc length of $y = \\dfrac{x^3}{6} + \\dfrac{1}{2x}$ on $[1, 2]$.</strong> (This is a classical curve engineered to factor nicely.)<br><br><em>Solution.</em> $y' = \\dfrac{x^2}{2} - \\dfrac{1}{2x^2}$, so $(y')^2 = \\dfrac{x^4}{4} - \\dfrac{1}{2} + \\dfrac{1}{4x^4}$. Then $1 + (y')^2 = \\dfrac{x^4}{4} + \\dfrac{1}{2} + \\dfrac{1}{4x^4} = \\left(\\dfrac{x^2}{2} + \\dfrac{1}{2x^2}\\right)^2$ (perfect square!).<br>So $\\sqrt{1 + (y')^2} = \\dfrac{x^2}{2} + \\dfrac{1}{2x^2}$.<br>$L = \\int_1^2\\left(\\dfrac{x^2}{2} + \\dfrac{1}{2x^2}\\right)dx = \\left[\\dfrac{x^3}{6} - \\dfrac{1}{2x}\\right]_1^2 = \\left(\\dfrac{8}{6} - \\dfrac{1}{4}\\right) - \\left(\\dfrac{1}{6} - \\dfrac{1}{2}\\right) = \\dfrac{4}{3} - \\dfrac{1}{4} - \\dfrac{1}{6} + \\dfrac{1}{2} = \\dfrac{16 - 3 - 2 + 6}{12} = \\dfrac{17}{12}$. <strong>Answer: $L = 17/12 \\approx 1.417$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — PUMPING WORK</div><div class="example-body"><strong>A cylindrical tank of radius $r = 1$ m and height $h = 4$ m is full of water.</strong> Find the work needed to pump all the water out over the top. (Use $\\rho g = 9800$ N/m³.)<br><br><em>Solution.</em> Cross-section area $A = \\pi r^2 = \\pi$. A layer at depth $y$ (measured from the top) has volume $\\pi\\,dy$, weight $9800\\pi\\,dy$, lifted distance $y$.<br>$W = \\int_0^4 9800\\pi \\cdot y\\,dy = 9800\\pi \\cdot \\dfrac{y^2}{2}\\Big|_0^4 = 9800\\pi \\cdot 8 = 78{,}400\\pi \\approx 246{,}300$ J $\\approx 246$ kJ. <strong>Answer: $\\approx 246$ kJ.</strong></div></div>

<h2 class="lesson-title">11. Summary — All the Applications of the Integral, Side by Side</h2>

<p class="l-text">Every application in this lesson follows the same template: identify the local contribution $dQ$ for an infinitesimal piece, then integrate. The table below collects the seven most common cases. Read each row as "this quantity equals the integral of that integrand from $a$ to $b$."</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(15,15,20,0.55);color:#ebe6dc;font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead>
<tr style="background:#3b82f6;color:#ffffff">
<th style="padding:0.7rem 0.9rem;text-align:left;border:1px solid rgba(255,255,255,0.18)">Application</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border:1px solid rgba(255,255,255,0.18)">Formula</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border:1px solid rgba(255,255,255,0.18)">Physical / Geometric Meaning</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Area under curve</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$A = \\int_a^b f(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Signed area between $y = f(x)$ and the x-axis on $[a, b]$.</td></tr>
<tr style="background:rgba(255,255,255,0.025)"><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Volume — disk method</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_a^b [f(x)]^2\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Solid of revolution about the x-axis as a stack of thin disks of radius $f(x)$.</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Volume — shell method</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = 2\\pi\\int_a^b x\\,f(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Solid of revolution about the y-axis as nested cylindrical shells of radius $x$, height $f(x)$.</td></tr>
<tr style="background:rgba(255,255,255,0.025)"><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Work (variable force)</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$W = \\int_a^b F(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Energy transferred when a position-dependent force $F(x)$ acts from $a$ to $b$.</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Arc length</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$L = \\int_a^b \\sqrt{1 + (f'(x))^2}\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">True curved length of $y = f(x)$; sum of infinitesimal hypotenuses $ds = \\sqrt{dx^2 + dy^2}$.</td></tr>
<tr style="background:rgba(255,255,255,0.025)"><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Average value</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\bar f = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Height of the rectangle on $[a, b]$ with the same area as the region under $f$.</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Center of mass (1D)</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\bar x = \\dfrac{\\int_a^b x\\,\\rho(x)\\,dx}{\\int_a^b \\rho(x)\\,dx}$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Balance point of a thin rod with linear mass density $\\rho(x)$; weighted average of position.</td></tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>One template, many uses.</strong> Notice the recurring pattern: for each application you (i) slice the object into infinitesimal pieces, (ii) write the contribution of one piece as "local rate $\\times\\,dx$", (iii) sum with $\\int_a^b$. Once you internalise this template, applying the integral to a new physical or geometric quantity becomes a routine exercise rather than a brand-new derivation.</div>

<div class="l-note"><strong>What you learned.</strong> The integral is a universal accumulator. Whenever a quantity is built up from infinitely many small contributions — work from tiny pushes, area from thin strips, length from short segments, surface area from skinny bands — the right formula is an integral with the local contribution as integrand. Master the move from "$d(\\text{thing}) = \\text{local rate} \\cdot dx$" to "$\\text{thing} = \\int_a^b \\text{local rate}\\,dx$"; this is calculus at its most powerful and most useful.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İntegral, eğri altındaki alanı bulmaktan çok daha fazlasıdır.</strong> Sonsuz sayıda sonsuz küçük katkıyı nasıl toplayacağınızı öğrendiğinizde, fiziksel ve geometrik niceliklerden oluşan geniş bir koleksiyon kapılarını açar. Gerilmiş bir yayın yaptığı iş, bir havuzdan suyu pompalamak için gereken toplam enerji, bir şehrin yıllık ortalama sıcaklığı, kıvrımlı bir dağ yolunun uzunluğu, tornada üretilmiş bir vazonun yüzey alanı — bunların her biri minicik parçaların toplamıdır ve her biri bir integralle hesaplanır.</p>

<p class="l-text">Bu derste integrali çok amaçlı bir araca dönüştürüyoruz. Önce işi, bir yol boyunca değişken kuvvetin integrali olarak tanımlayacağız; sonra aritmetik ortalama fikrini sürekli ortama genelleyeceğiz (İntegral için Ortalama Değer Teoremi); ardından bir eğrinin uzunluğunu ölçeceğiz; en sonunda da bu eğriyi bir eksen etrafında döndürerek dönme yüzeyi elde edeceğiz. Dersin sonunda integrali artık "alan bul" reçetesi olarak değil, evrensel bir biriktirici olarak göreceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Değişken tek boyutlu bir kuvvet için işi $W = \\int_a^b F(x)\\,dx$ olarak hesaplamak</li>
<li>Yay işi (Hooke yasası $F = kx$) ve su pompalama integrallerini kurmak ve değerlendirmek</li>
<li>İntegral için Ortalama Değer Teoremini ifade etmek ve uygulamak: $\\exists\\,c \\in [a,b]$, $f(c) = \\tfrac{1}{b-a}\\int_a^b f(x)\\,dx$</li>
<li>Bir fonksiyonun ortalama değerini eşdeğer dikdörtgenin yüksekliği olarak yorumlamak</li>
<li>Pürüzsüz eğriler için yay uzunluğu formülünü $L = \\int_a^b \\sqrt{1 + (f'(x))^2}\\,dx$ kullanmak</li>
<li>Bir eğriyi x-ekseni etrafında döndürerek elde edilen yüzeyin alanını $S = 2\\pi\\int_a^b y\\sqrt{1 + (y')^2}\\,dx$ ile hesaplamak</li>
</ul>
</div>

<h2 class="lesson-title">1. İş — Sabit ve Değişken Kuvvet</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> ağır bir kutuyu düz bir zeminde $50$ N'luk sabit kuvvetle $4$ m boyunca itin. Yaptığınız iş $W = F \\cdot d = 200$ J — kuvvet çarpı yol, kolay. Peki kutu hareket ederken kuvvet değişirse? Yay ne kadar gerilirse o kadar güçlü çeker; bir roket yükseldikçe yer çekimi zayıflar. Böyle durumlarda "kuvvet $\\times$ yol" yerine bir integral koymak zorundayız.</div>

<p class="l-text">Fizikte <strong>iş</strong>, bir cisme hareket yönünde uygulanan kuvvet sebebiyle aktarılan enerjidir. Sabit bir kuvvet için tanıdık çarpım formülünü kullanırız:</p>

<div class="calc-formula"><div class="formula-label">SABİT KUVVET İÇİN İŞ</div><div class="formula-main">$$W \\;=\\; F \\cdot d.$$</div><div class="formula-sub">$F$ kuvvetin (sabit) büyüklüğü (newton), $d$ yerdeğiştirme (metre), $W$ ise joule cinsindendir ($1\\,\\text{J} = 1\\,\\text{N}\\cdot\\text{m}$).</div></div>

<p class="l-text">Kuvvet konuma bağlıysa — yani yol boyunca konumumuz $x$ iken $F = F(x)$ — küçük bir $dx$ adımında işe katkı, yerel kuvvet ile adım uzunluğunun çarpımıdır:</p>

<div class="calc-formula"><div class="formula-main">$$dW \\;=\\; F(x)\\,dx.$$</div></div>

<p class="l-text">Bu minicik katkıları $x = a$'dan $x = b$'ye toplamak (integralle) değişken kuvvet iş integralini verir.</p>

<div class="calc-formula"><div class="formula-label">DEĞİŞKEN KUVVET İÇİN İŞ</div><div class="formula-main">$$W \\;=\\; \\int_a^b F(x)\\,dx.$$</div><div class="formula-sub">Okuma: "iş, konuma bağlı kuvvetin $a$'dan $b$'ye integralidir." Geometrik olarak $W$, $[a, b]$ üzerinde kuvvet-yol grafiğinin altında kalan alandır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kuvvet $F(x)$</div><div class="card-body">Her $x$ konumunda uygulanan kuvvetin büyüklüğünü veren fonksiyon. Yay için doğrusal artar; yer çekimi için azalır; sabit itme için değişmez.</div></div>
<div class="calc-card"><div class="card-title">Adım $dx$</div><div class="card-body">Konumdaki sonsuz küçük değişim. $F(x)\\,dx$ çarpımı, $x$'ten $x + dx$'e geçerken yapılan iştir; bu mini aralıkta kuvvet pratikte sabittir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlar $a$, $b$</div><div class="card-body">Başlangıç ve bitiş konumları. İntegral, cisim $a$ ile $b$ arasındaki tüm ara konumlardan geçerken işi biriktirir.</div></div>
<div class="calc-card"><div class="card-title">Birimler</div><div class="card-body">$F$ newton ve $x$ metre ise $W$ joule cinsindendir. $F$ kgf, $x$ cm ise dikkatli dönüşüm gerekir — fizik problemleri neredeyse her zaman SI birim ister.</div></div>
</div>

<div class="think-box"><div class="think-label">NEDEN İNTEGRAL?</div><div class="think-body">Değişken kuvvet, cisim hareket ettikçe değişir; bu yüzden "kuvvet çarpı yol" tek bir çarpım olarak anlamsızlaşır — $F$'in hangi değerini kullanırdık? İntegral bunu, yolu sonsuz sayıda kısa adıma bölüp her adımda $F$'i sabit kabul ederek toplayarak çözer. Bu, "eğri altındaki dikdörtgenler"i Riemann integraline dönüştüren mantığın aynısıdır.</div></div>

<h2 class="lesson-title">2. Birinci Çözümlü Örnek — Yay Sıkıştırma İşi (Hooke Yasası)</h2>

<div class="calc-highlight"><strong>Hooke yasası.</strong> Hooke yasasına uyan bir yayda, doğal uzunluktan $x$ kadar uzatılmış (veya sıkıştırılmış) yayda tutmak için gereken kuvvet $F(x) = kx$'tir; burada $k$ yay sabiti (N/m). Daha çok gerdikçe daha çok çekmek gerekir — doğrusal olarak.</div>

<p class="l-text"><strong>Problem.</strong> Yay sabiti $k = 200$ N/m olan bir yayın doğal uzunluğu $30$ cm'dir. Yayı doğal uzunluğundan $50$ cm uzunluğa kadar germek için ne kadar iş gerekir?</p>

<p class="l-text"><strong>Adım 1. Birim dönüşümü.</strong> Uzama $50 - 30 = 20$ cm $= 0.20$ m. $x = 0$ (doğal uzunluk) ile $x = 0.20$ m (tam gerilmiş) arasında integral alacağız.</p>

<p class="l-text"><strong>Adım 2. Kuvveti yazın.</strong> $F(x) = kx = 200x$ N.</p>

<p class="l-text"><strong>Adım 3. İntegrali kurun ve değerlendirin.</strong></p>

<div class="calc-formula"><div class="formula-main">$$W \\;=\\; \\int_0^{0.20} 200x\\,dx \\;=\\; 200 \\cdot \\frac{x^2}{2}\\Bigg|_0^{0.20} \\;=\\; 100 \\cdot (0.20)^2 \\;=\\; 100 \\cdot 0.04 \\;=\\; 4\\,\\text{J}.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;W \\;=\\; 4\\,\\text{joule}\\;}$$</div><div class="formula-sub">Bu yayı $20$ cm germek için $4$ J iş gerekir. İşin $x^2$ ile orantılı olduğuna dikkat edin — iki kat germek dört kat iş gerektirir.</div></div>

<div id="plot-l34-spring-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],Fs=[];
for(var i=0;i<=100;i++){var x=0.20*i/100;xs.push(x);Fs.push(200*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=Fs.slice().concat(xs.map(function(){return 0;}).reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'iş = F(x) altındaki alan',hoverinfo:'skip',showlegend:true};
var tLine={x:xs,y:Fs,mode:'lines',name:'F(x) = 200 x',line:{color:'#c8a96e',width:2.8}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'uzama x (m)',range:[-0.02,0.24]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'kuvvet F(x) (N)',range:[-2,50]},margin:{t:30,r:30,b:55,l:60},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0.10,y:14,text:'W = 4 J',showarrow:false,font:{color:'#22c55e',size:14}}]};
Plotly.newPlot('plot-l34-spring-tr',[tFill,tLine],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Yayı $x$ kadar uzatmak için gereken kuvvet doğrusal artar: $F(x) = 200x$ (altın çizgi). $x = 0$'dan $x = 0.20$'ye kadar çizginin altındaki yeşil üçgenin alanı $\\tfrac{1}{2}(0.20)(40) = 4$ — bu, tam olarak joule cinsinden iştir.</div></div>

<div class="l-note"><strong>Geometriyle hızlı kontrol.</strong> $F$ doğrusal olduğundan altındaki alan üçgendir. Tabanı $0.20$ m, yüksekliği $F(0.20) = 40$ N, alanı $\\tfrac{1}{2}(0.20)(40) = 4$ J — integralle uyumlu. Doğrusal kuvvetler için işi her zaman üçgen alanı olarak okuyabilirsiniz.</div>

<h2 class="lesson-title">3. İkinci Çözümlü Örnek — Bir Depodan Su Pompalama</h2>

<div class="calc-highlight"><strong>Yeni nüans:</strong> suyun farklı katmanları kaçmak için farklı mesafeler kat eder. Yüzeye yakın bir katmanın kısa, dipteki bir katmanın ise tüm derinlik kadar yolu vardır. Toplam pompalama işi, tüm katman katkılarının toplamıdır — bir integral.</div>

<p class="l-text"><strong>Problem.</strong> Taban alanı $A = 2$ m² olan dikdörtgen prizma şeklinde bir depo, $3$ m derinliğine kadar suyla doludur. Suyun depo üstünden dışarı pompalanması gerekiyor. Gerekli işi bulun; suyun yoğunluğu $\\rho = 1000$ kg/m³ ve $g = 9.8$ m/s².</p>

<p class="l-text"><strong>Strateji.</strong> Depo üstünden başlayarak aşağı doğru ölçen $y$ koordinatı kurun: $y = 0$ üstte, $y = 3$ dipte. Derinlik $y$'deki ince yatay katmanın kalınlığı $dy$, hacmi $A\\,dy$, kütlesi $\\rho A\\,dy$, ağırlığı $\\rho g A\\,dy$ olur. Bu katman üste ulaşmak için $y$ mesafe kaldırılmalıdır, dolayısıyla katkısı</p>

<div class="calc-formula"><div class="formula-main">$$dW \\;=\\; (\\text{katmanın ağırlığı}) \\cdot (\\text{kaldırma mesafesi}) \\;=\\; \\rho g A \\cdot y\\,dy.$$</div></div>

<p class="l-text">$y = 0$'dan (üst katman) $y = 3$'e (dip katman) integral alın:</p>

<div class="calc-formula"><div class="formula-main">$$W \\;=\\; \\int_0^3 \\rho g A \\cdot y\\,dy \\;=\\; \\rho g A \\cdot \\frac{y^2}{2}\\Bigg|_0^3 \\;=\\; \\rho g A \\cdot \\frac{9}{2}.$$</div></div>

<p class="l-text">Sayıları yerine koyalım ($\\rho = 1000$, $g = 9.8$, $A = 2$):</p>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$W \\;=\\; 1000 \\cdot 9.8 \\cdot 2 \\cdot \\frac{9}{2} \\;=\\; 88{,}200\\,\\text{J} \\;\\approx\\; 88.2\\,\\text{kJ}.$$</div><div class="formula-sub">Tüm suyu pompalamak için yaklaşık $88$ kilojoule gerekir — bu, $100$ watt'lık bir ampulü neredeyse $15$ dakika yakacak enerjidir.</div></div>

<div class="think-box"><div class="think-label">NEDEN İNTEGRANDA $y$, $y^2$ DEĞİL?</div><div class="think-body">Her ince katmanın hacmi <em>aynıdır</em>, $A\\,dy$ (kesit sabit). Katmandan katmana değişen tek şey kaldırma <em>mesafesi</em> $y$'dir. Yani $dW$ "ağırlık (sabit) çarpı mesafe (değişken)" $= \\rho g A \\cdot y\\,dy$. $y$'nin $0$'dan $3$'e integrali $9/2$'dir. Derinliğe bağlı kesiti olan depolar (koni, yarı küre) için hacim faktörü de $y$'ye bağlıdır ve integrand daha karmaşıklaşır.</div></div>

<h2 class="lesson-title">4. İntegral İçin Ortalama Değer Teoremi</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> şehrinizdeki sıcaklık gün içinde saatten saate değişir. <em>Ortalama</em> günlük sıcaklık, "tipik" sıcaklığı tek bir sayıyla özetler. Sürekli zaman ortalamaları — ortalama sıcaklık, bir aracın ortalama hızı, bir telden geçen ortalama akım — hepsi aynı integral formülüyle hesaplanır.</div>

<p class="l-text">Sonlu bir $n$ sayı listesi $a_1, a_2, \\dots, a_n$ için aritmetik ortalama basitçe $(a_1 + \\dots + a_n)/n$'dir. $[a, b]$ üzerindeki sürekli bir $f$ fonksiyonu için değerleri tek tek listeleyemeyiz çünkü sonsuz tane vardır. Doğal genelleme:</p>

<div class="calc-formula"><div class="formula-label">BİR FONKSİYONUN ORTALAMA DEĞERİ</div><div class="formula-main">$$\\bar f \\;=\\; \\frac{1}{b - a}\\int_a^b f(x)\\,dx.$$</div><div class="formula-sub">$\\bar f$ (okunuşu "f-bar") $[a, b]$ üzerinde $f$'nin ortalama değeridir. İntegral $f$'nin değerlerini toplar; $b - a$ uzunluğuna bölmek toplamı ortalamaya çevirir.</div></div>

<p class="l-text"><strong>İntegral için Ortalama Değer Teoremi</strong>, bu ortalamanın aslında aralığın iç noktasında fonksiyon tarafından alındığını söyler — $f$, $[a, b]$ üzerinde sürekli olduğu sürece.</p>

<div class="calc-formula"><div class="formula-label">ORTALAMA DEĞER TEOREMİ (İNTEGRAL HALİ)</div><div class="formula-main">$$\\text{Eğer } f \\text{, } [a, b] \\text{ üzerinde sürekliyse } \\;\\; \\exists\\,c \\in [a, b] \\;\\;\\text{öyle ki}\\;\\; f(c) \\;=\\; \\frac{1}{b - a}\\int_a^b f(x)\\,dx.$$</div><div class="formula-sub">"Fonksiyon değerinin ortalama değere eşit olduğu bir $c$ noktası vardır." Eşdeğer biçimde: $\\int_a^b f(x)\\,dx = f(c) \\cdot (b - a)$ — integral, yüksekliği $f(c)$ olan dikdörtgenin alanına eşittir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Süreklilik şarttır</div><div class="card-body">$f$, $[a, b]$ içinde sıçramalı süreksizliği varsa teorem geçersizdir. Süreklilik, $f$'nin minimum ile maksimum arasındaki her değeri (ortalama dahil) aldığını garanti eder.</div></div>
<div class="calc-card"><div class="card-title">$c$ tek değildir</div><div class="card-body">$f(c) = \\bar f$ olan birden çok nokta olabilir. Teorem yalnızca en az bir tanesinin var olduğunu söyler.</div></div>
<div class="calc-card"><div class="card-title">Geometrik dikdörtgen</div><div class="card-body">Her iki tarafı $(b - a)$ ile çarpmak $\\int_a^b f\\,dx = \\bar f \\cdot (b - a)$ verir — integral, genişliği $b - a$ ve yüksekliği $\\bar f$ olan dikdörtgenin alanıdır.</div></div>
</div>

<h2 class="lesson-title">5. Ortalamanın Geometrik Anlamı — Eşdeğer Dikdörtgen</h2>

<p class="l-text">$\\bar f$ ortalama değeri, $[a, b]$ tabanı üzerinde oturan ve $f$ grafiğinin altındaki bölge ile aynı alana sahip olan dikdörtgenin yüksekliğidir. Yani grafiğin tüm tümseklerini tek bir düzgün yüksekliğe "düzleştirirsiniz".</p>

<div id="plot-l34-mvt-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];
var a=0,b=Math.PI;
for(var i=0;i<=200;i++){var x=a+(b-a)*i/200;xs.push(x);ys.push(Math.sin(x));}
var avg=2/Math.PI;
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=ys.slice().concat(xs.map(function(){return 0;}).reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.18)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'f altındaki alan',hoverinfo:'skip',showlegend:true};
var tCurve={x:xs,y:ys,mode:'lines',name:'f(x) = sin x',line:{color:'#c8a96e',width:2.8}};
var tRect={x:[a,a,b,b,a],y:[0,avg,avg,0,0],mode:'lines',name:'eşdeğer dikdörtgen',line:{color:'#3b82f6',width:2.5,dash:'dash'}};
var tAvgLine={x:[a,b],y:[avg,avg],mode:'lines',name:'ort = 2/π ≈ 0.637',line:{color:'#f87171',width:2.5}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.15,Math.PI+0.15]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.15,1.2]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:Math.PI/2,y:avg,text:'f(c) = ortalama',showarrow:true,arrowhead:2,ax:0,ay:-40,font:{color:'#f87171',size:13}}]};
Plotly.newPlot('plot-l34-mvt-tr',[tFill,tCurve,tAvgLine,tRect],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $[0, \\pi]$ üzerinde $\\sin x$'in ortalama değeri $\\bar f = 2/\\pi \\approx 0.637$ (kırmızı çizgi). Mavi kesik dikdörtgen aynı tabanı ve $\\bar f$ yüksekliğini paylaşır; alanı, sinüs eğrisi altındaki yeşil alana eşit, yani $2$. Ortalama Değer Teoremi, $\\sin c = 2/\\pi$ olan bir $c \\in [0, \\pi]$ olduğunu garantiler — aslında $\\pi/2$ etrafında simetrik iki tane vardır.</div></div>

<div class="think-box"><div class="think-label">SAYILARI KONTROL</div><div class="think-body">$\\int_0^{\\pi}\\sin x\\,dx = [-\\cos x]_0^{\\pi} = -(-1) - (-1) = 2$. Uzunluk $\\pi - 0 = \\pi$'ye bölünce ortalama $2/\\pi \\approx 0.637$. Eşdeğer dikdörtgen $\\pi \\times (2/\\pi)$ genişlik-yükseklik — alanı tam olarak $2$, integralle uyumlu.</div></div>

<h2 class="lesson-title">6. Üçüncü Çözümlü Örnek — Yıllık Ortalama Sıcaklık</h2>

<p class="l-text"><strong>Problem.</strong> Bir şehirde günlük ortalama sıcaklığın yıl boyunca ($t$ gün, $0$ ile $365$ arası) şöyle değiştiğini varsayalım:</p>

<div class="calc-formula"><div class="formula-main">$$T(t) \\;=\\; 14 + 12\\sin\\!\\left(\\frac{2\\pi (t - 100)}{365}\\right)\\,°\\text{C}.$$</div></div>

<p class="l-text">Tüm yıl boyunca ortalama sıcaklık nedir?</p>

<p class="l-text"><strong>Çözüm.</strong> Yıllık ortalama:</p>

<div class="calc-formula"><div class="formula-main">$$\\bar T \\;=\\; \\frac{1}{365}\\int_0^{365} \\left[14 + 12\\sin\\!\\left(\\frac{2\\pi (t - 100)}{365}\\right)\\right]dt.$$</div></div>

<p class="l-text">İntegrali iki parçaya bölün. Sabit terim için bariz: $\\int_0^{365} 14\\,dt = 14 \\cdot 365$. Sinüs terimi ise tasarım gereği tam olarak bir periyot boyunca ($365$ gün) tam bir sinüs salınımıdır; tam bir periyot üzerindeki integrali <em>sıfırdır</em>:</p>

<div class="calc-formula"><div class="formula-main">$$\\int_0^{365} 12\\sin\\!\\left(\\frac{2\\pi (t - 100)}{365}\\right)dt \\;=\\; 0.$$</div></div>

<p class="l-text">Dolayısıyla</p>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\bar T \\;=\\; \\frac{1}{365}(14 \\cdot 365 + 0) \\;=\\; 14\\,°\\text{C}.$$</div><div class="formula-sub">Mevsimsel salınım, tüm yıl boyunca sıfıra ortalanır. Yıllık ortalama sıcaklık basitçe sabit terimdir: $14$°C.</div></div>

<div class="l-note"><strong>Hatırlanması gereken bir örüntü.</strong> "Sabit $+$ saf sinüs" biçimindeki herhangi bir fonksiyonun ortalama değeri, tam sayıda periyot üzerinde integral aldığınızda yalnızca sabit terime eşittir. Bir Fourier serisinin sabit teriminin, fonksiyonun ortalama değeri olmasının sebebi de tam olarak budur.</div>

<h2 class="lesson-title">7. Yay Uzunluğu — Bir Eğri Ne Kadar Uzun?</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> ileri-geri kıvrılan bir dağ yolu, başlangıç ile bitiş arasındaki düz çizgi mesafeden çok daha fazla kilometre kat eder. Gerçek sürüş mesafesini bulmak için her dönüşü takip etmek gerekir — yolun <em>yay uzunluğu</em>.</div>

<p class="l-text">$y = f(x)$, $[a, b]$ üzerinde pürüzsüz bir eğri olsun. Eğriyi çokgen bir yolla yaklaşıklayalım: aralığı çok sayıda küçük $\\Delta x_i$ parçaya bölün ve $(x_i, f(x_i))$ noktalarını düz çizgi parçalarıyla bağlayın. Bir parçanın uzunluğu Pisagor ile</p>

<div class="calc-formula"><div class="formula-main">$$\\Delta L_i \\;\\approx\\; \\sqrt{(\\Delta x_i)^2 + (\\Delta y_i)^2} \\;=\\; \\sqrt{1 + \\left(\\frac{\\Delta y_i}{\\Delta x_i}\\right)^2}\\,\\Delta x_i.$$</div></div>

<p class="l-text">$\\Delta x_i \\to 0$ olduğunda $\\Delta y_i / \\Delta x_i$ oranı $f'(x_i)$ türevine, toplam ise integrale dönüşür; ana yay uzunluğu formülünü elde ederiz.</p>

<div class="calc-formula"><div class="formula-label">YAY UZUNLUĞU FORMÜLÜ</div><div class="formula-main">$$L \\;=\\; \\int_a^b \\sqrt{1 + \\bigl(f'(x)\\bigr)^2}\\,dx.$$</div><div class="formula-sub">$[a, b]$ üzerinde pürüzsüz $y = f(x)$ eğrisinin yay uzunluğu $\\sqrt{1 + (f')^2}$'nin integralidir. Kareköktekiki "$1$" yatay ilerlemeyi, "$(f')^2$" düşey yükselişi temsil eder.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sqrt{1 + (f')^2}$</div><div class="card-body">Eğrinin $x$ başına ne kadar gerildiğinin yerel ölçüsü. Eğri yataysa ($f' = 0$) bu $1$'dir ve yay uzunluğu x-aralığına eşittir. Eğri dikse integrand büyür ve yay uzunluğu x-aralığını aşar.</div></div>
<div class="calc-card"><div class="card-title">Pürüzsüzlük</div><div class="card-body">Formül $f'$'nin var olmasını ve $[a, b]$ üzerinde sürekli olmasını ister. Sivri uçlar ve köşeler özel işlem gerektirir (her köşede integrali bölün).</div></div>
<div class="calc-card"><div class="card-title">Zor integraller</div><div class="card-body">Görünüşte masum $f$'ler bile karekök sayesinde sıklıkla çetin integraller doğurur (ör. $[0, 1]$ üzerinde $y = x^2$ hiperbolik dönüşüm gerektirir). Elle çözülebilir az sayıda durum vardır, onları öğretiyoruz.</div></div>
</div>

<div id="plot-l34-arc-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];
for(var i=0;i<=120;i++){var x=i/120*4;xs.push(x);ys.push(0.5*Math.sin(2*x)+0.3*x);}
var tCurve={x:xs,y:ys,mode:'lines',name:'kıvrımlı yol',line:{color:'#c8a96e',width:2.8}};
var tStraight={x:[0,4],y:[ys[0],ys[120]],mode:'lines',name:'düz çizgi mesafesi',line:{color:'#3b82f6',width:2.2,dash:'dash'}};
var tStartEnd={x:[0,4],y:[ys[0],ys[120]],mode:'markers',name:'uç noktalar',marker:{size:9,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.2,4.3]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.8,2]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:2,y:1.6,text:'yay uzunluğu L > düz mesafe',showarrow:false,font:{color:'#ebe6dc',size:12}}]};
Plotly.newPlot('plot-l34-arc-tr',[tCurve,tStraight,tStartEnd],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> altın renkli kıvrımlı eğri gerçek yolu çizer; mavi kesik çizgi uç noktalar arasındaki düz mesafedir. $\\int_a^b\\sqrt{1 + (f')^2}\\,dx$ integrali kıvrımlı yolun gerçek uzunluğunu ölçer; bu uzunluk her zaman düz çizgi mesafeden büyük veya eşittir ve $f'$ herhangi bir yerde sıfırdan farklıysa kesinlikle daha büyüktür.</div></div>

<p class="l-text"><strong>Sonsuz küçük bir adıma yakınlaşma.</strong> Bir sonraki grafik eğrinin tek bir noktasını büyütüp, dik kenarları $dx$ ve $dy$, hipotenüsü ise yay elemanı $ds = \\sqrt{dx^2 + dy^2}$ olan dik üçgeni gösterir. Bu hipotenüsleri eğri boyunca toplamak tam olarak yay uzunluğu integralidir.</p>

<div id="plot-l34-ds-tr-extra" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];
for(var i=0;i<=200;i++){var x=i/200*2.4;xs.push(x);ys.push(0.35*x*x+0.4);}
var x0=1.4,y0=0.35*x0*x0+0.4;
var dx=0.5,dy=(0.35*(x0+dx)*(x0+dx)+0.4)-y0;
var x1=x0+dx,y1=y0+dy;
var tCurve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#c8a96e',width:2.8}};
var tHorz={x:[x0,x1],y:[y0,y0],mode:'lines',name:'dx',line:{color:'#3b82f6',width:3}};
var tVert={x:[x1,x1],y:[y0,y1],mode:'lines',name:'dy',line:{color:'#22c55e',width:3}};
var tHyp={x:[x0,x1],y:[y0,y1],mode:'lines',name:'ds = √(dx² + dy²)',line:{color:'#f87171',width:3}};
var tPts={x:[x0,x1],y:[y0,y1],mode:'markers',name:'eğri noktaları',marker:{size:8,color:'#ebe6dc'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[0,2.5]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[0,2.6],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:(x0+x1)/2,y:y0-0.13,text:'dx',showarrow:false,font:{color:'#3b82f6',size:13}},{x:x1+0.12,y:(y0+y1)/2,text:'dy',showarrow:false,font:{color:'#22c55e',size:13}},{x:(x0+x1)/2-0.12,y:(y0+y1)/2+0.18,text:'ds',showarrow:false,font:{color:'#f87171',size:14}},{x:1.0,y:2.3,text:'ds² = dx² + dy²  ⇒  L = ∫ √(1 + (f′)²) dx',showarrow:false,font:{color:'#ebe6dc',size:12}}]};
Plotly.newPlot('plot-l34-ds-tr-extra',[tCurve,tHorz,tVert,tHyp,tPts],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = f(x)$ eğrisi üzerinde seçilen bir noktada, yatay kenarı $dx$ (mavi), düşey kenarı $dy$ (yeşil), hipotenüsü $ds$ (kırmızı) olan küçük bir dik üçgen çizilmiştir. Pisagor şunu verir: $ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + (dy/dx)^2}\\,dx$. Bu sonsuz küçük hipotenüsleri eğri boyunca uç uca ekleyip $a$'dan $b$'ye integral almak yay uzunluğunu üretir: $L = \\int_a^b\\sqrt{1 + (f'(x))^2}\\,dx$.</div></div>

<h2 class="lesson-title">8. Dördüncü Çözümlü Örnek — $y = \\tfrac{2}{3}x^{3/2}$ Yay Uzunluğu, $[0, 3]$</h2>

<p class="l-text">Bu eğri temiz bir sonuç vermek için tasarlanmıştır ($\\tfrac{2}{3}$ katsayısı türevin temiz bir karekök olmasını sağlar).</p>

<p class="l-text"><strong>Adım 1. Türev alın.</strong></p>

<div class="calc-formula"><div class="formula-main">$$f(x) \\;=\\; \\tfrac{2}{3}x^{3/2} \\quad\\Longrightarrow\\quad f'(x) \\;=\\; \\tfrac{2}{3} \\cdot \\tfrac{3}{2}x^{1/2} \\;=\\; \\sqrt{x}.$$</div></div>

<p class="l-text"><strong>Adım 2. Karesini alın ve $1$ ekleyin.</strong></p>

<div class="calc-formula"><div class="formula-main">$$1 + (f'(x))^2 \\;=\\; 1 + x.$$</div></div>

<p class="l-text"><strong>Adım 3. Yay uzunluğu integralini kurun.</strong></p>

<div class="calc-formula"><div class="formula-main">$$L \\;=\\; \\int_0^3 \\sqrt{1 + x}\\,dx.$$</div></div>

<p class="l-text"><strong>Adım 4. $u = 1 + x$ koyalım, $du = dx$. $x = 0$ iken $u = 1$; $x = 3$ iken $u = 4$.</strong></p>

<div class="calc-formula"><div class="formula-main">$$L \\;=\\; \\int_1^4 \\sqrt{u}\\,du \\;=\\; \\frac{2}{3}u^{3/2}\\Bigg|_1^4 \\;=\\; \\frac{2}{3}(8 - 1) \\;=\\; \\frac{14}{3}.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;L \\;=\\; \\frac{14}{3} \\;\\approx\\; 4.667\\;\\text{birim}\\;}$$</div><div class="formula-sub">$(0, 0)$ ile $(3, 2\\sqrt{3}) \\approx (3, 3.464)$ arasındaki düz çizgi mesafesi $\\sqrt{9 + 12} = \\sqrt{21} \\approx 4.583$ olurdu. Eğri biraz daha uzun (öyle olmalı), cevabımızı doğruluyor.</div></div>

<h2 class="lesson-title">9. Dönme Yüzeyi — Bir Eğri Eksen Etrafında Döndürülünce</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> bir çömlekçi çarkı, kıvrımlı bir profili dikey bir eksen etrafında döndürerek vazo yapar. Vazonun dış yüzeyi bir <em>dönme yüzeyidir</em>. Şarap kadehinin dışı, bir mum tutacağı veya bir beyzbol sopası da öyle. Her biri, düzlemsel bir $y = f(x)$ eğrisinin bir eksen etrafında döndürülmesiyle elde edilir.</div>

<p class="l-text">$y = f(x) \\geq 0$ grafiğinin x-ekseni etrafında döndürüldüğünü düşünün. Yatay konum $x$'teki eğrinin kısa bir parçası $dL = \\sqrt{1 + (f'(x))^2}\\,dx$ uzunluğundadır (yay uzunluğu elemanı). Bu kısa parça x-ekseni etrafında dönerken ince bir bant izler — yarıçapı $y = f(x)$ ve eğik uzunluğu $dL$ olan eğik bir halka. Bu bandın alanı</p>

<div class="calc-formula"><div class="formula-main">$$dS \\;=\\; 2\\pi \\cdot y \\cdot dL \\;=\\; 2\\pi y \\sqrt{1 + (f'(x))^2}\\,dx.$$</div></div>

<p class="l-text">Tüm bantları $x = a$'dan $x = b$'ye toplamak yüzey alanı formülünü verir.</p>

<div class="calc-formula"><div class="formula-label">x-EKSENİ ETRAFINDA DÖNME YÜZEYİ</div><div class="formula-main">$$S \\;=\\; 2\\pi \\int_a^b y\\,\\sqrt{1 + (y')^2}\\,dx \\quad \\text{burada } y = f(x).$$</div><div class="formula-sub">$2\\pi y$ faktörü, $y$ yüksekliğindeki noktanın izlediği çevredir; $\\sqrt{1 + (y')^2}\\,dx$ bandın eğik uzunluğudur; ikisi birlikte bandın alanını verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden $2\\pi y$, $\\pi y^2$ değil?</div><div class="card-body">$2\\pi y$, $y$ yarıçaplı çemberin <em>çevresidir</em> — küçük bandın izlediği yol. $\\pi y^2$ ise disk alanıdır, yüzey için yanlış olur.</div></div>
<div class="calc-card"><div class="card-title">y-ekseni etrafında</div><div class="card-body">Y-ekseni etrafında döndürürseniz yarıçap faktörü $x$ olur (eksene yatay mesafe) ve $S = 2\\pi\\int x\\sqrt{1 + (y')^2}\\,dx$ olur.</div></div>
<div class="calc-card"><div class="card-title">Pappus teoremi</div><div class="card-body">Klasik bir kısayol: yüzey alanı $=$ yol uzunluğu $\\times$ eğrinin ağırlık merkezinin kat ettiği mesafe. Burada kullanmayacağız ama güzel bir kontroldür.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL — KÜRE YÜZEYİ</div><div class="example-body"><strong>Üst yarım çember</strong> $y = \\sqrt{R^2 - x^2}$'i x-ekseni etrafında $[-R, R]$ üzerinde döndürerek küre üretelim.<br><br>$y' = \\dfrac{-x}{\\sqrt{R^2 - x^2}}$, dolayısıyla $(y')^2 = \\dfrac{x^2}{R^2 - x^2}$ ve $1 + (y')^2 = \\dfrac{R^2}{R^2 - x^2}$.<br><br>İntegrand $y\\sqrt{1 + (y')^2} = \\sqrt{R^2 - x^2} \\cdot \\dfrac{R}{\\sqrt{R^2 - x^2}} = R$ olur — güzelce sabit.<br><br>$S = 2\\pi\\int_{-R}^{R} R\\,dx = 2\\pi R \\cdot 2R = \\boxed{4\\pi R^2}$, bilinen küre yüzeyi formülü.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">İş, ortalama değer ve yay uzunluğunu karıştıran altı standart problem. Önce kâğıtta çözün, sonra cevaba bakın.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — YAY İŞİ</div><div class="example-body"><strong>Yay sabiti $k = 120$ N/m olan bir yay, doğal uzunluğundan $25$ cm daha gerilir.</strong> Yapılan iş nedir?<br><br><em>Çözüm.</em> $W = \\int_0^{0.25} 120 x\\,dx = 60 x^2\\Big|_0^{0.25} = 60(0.0625) = 3.75$ J. <strong>Cevap: $3.75$ J.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — DEĞİŞKEN KUVVET</div><div class="example-body"><strong>Bir parçacık $F(x) = \\dfrac{6}{x^2}$ N kuvveti altında x-ekseni boyunca $x = 1$'den $x = 4$'e hareket ediyor.</strong> Yapılan işi bulun.<br><br><em>Çözüm.</em> $W = \\int_1^4 \\dfrac{6}{x^2}\\,dx = 6 \\cdot \\left[-\\dfrac{1}{x}\\right]_1^4 = 6\\left(-\\dfrac{1}{4} + 1\\right) = 6 \\cdot \\dfrac{3}{4} = \\dfrac{9}{2} = 4.5$ J. <strong>Cevap: $4.5$ J.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — ORTALAMA DEĞER</div><div class="example-body"><strong>$f(x) = x^2$ fonksiyonunun $[0, 3]$ üzerinde ortalama değerini bulun.</strong><br><br><em>Çözüm.</em> $\\bar f = \\dfrac{1}{3 - 0}\\int_0^3 x^2\\,dx = \\dfrac{1}{3}\\cdot\\dfrac{x^3}{3}\\Big|_0^3 = \\dfrac{1}{3}\\cdot 9 = 3$. <strong>Cevap: $\\bar f = 3$.</strong> MVT'ye göre $f(c) = 3$ değeri $c = \\sqrt{3} \\approx 1.73$'te alınır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — KOSİNÜSÜN ORTALAMASI</div><div class="example-body"><strong>$\\cos x$ fonksiyonunun $[0, \\pi/2]$ üzerinde ortalama değerini bulun.</strong><br><br><em>Çözüm.</em> $\\bar f = \\dfrac{2}{\\pi}\\int_0^{\\pi/2}\\cos x\\,dx = \\dfrac{2}{\\pi}[\\sin x]_0^{\\pi/2} = \\dfrac{2}{\\pi}(1 - 0) = \\dfrac{2}{\\pi} \\approx 0.637$. <strong>Cevap: $2/\\pi$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — YAY UZUNLUĞU</div><div class="example-body"><strong>$y = \\dfrac{x^3}{6} + \\dfrac{1}{2x}$ eğrisinin $[1, 2]$ üzerinde yay uzunluğunu bulun.</strong> (Bu, güzel çarpanlara ayrılmak için tasarlanmış klasik bir eğridir.)<br><br><em>Çözüm.</em> $y' = \\dfrac{x^2}{2} - \\dfrac{1}{2x^2}$, dolayısıyla $(y')^2 = \\dfrac{x^4}{4} - \\dfrac{1}{2} + \\dfrac{1}{4x^4}$. Sonra $1 + (y')^2 = \\dfrac{x^4}{4} + \\dfrac{1}{2} + \\dfrac{1}{4x^4} = \\left(\\dfrac{x^2}{2} + \\dfrac{1}{2x^2}\\right)^2$ (tam kare!).<br>O hâlde $\\sqrt{1 + (y')^2} = \\dfrac{x^2}{2} + \\dfrac{1}{2x^2}$.<br>$L = \\int_1^2\\left(\\dfrac{x^2}{2} + \\dfrac{1}{2x^2}\\right)dx = \\left[\\dfrac{x^3}{6} - \\dfrac{1}{2x}\\right]_1^2 = \\left(\\dfrac{8}{6} - \\dfrac{1}{4}\\right) - \\left(\\dfrac{1}{6} - \\dfrac{1}{2}\\right) = \\dfrac{4}{3} - \\dfrac{1}{4} - \\dfrac{1}{6} + \\dfrac{1}{2} = \\dfrac{16 - 3 - 2 + 6}{12} = \\dfrac{17}{12}$. <strong>Cevap: $L = 17/12 \\approx 1.417$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — POMPALAMA İŞİ</div><div class="example-body"><strong>Yarıçapı $r = 1$ m ve yüksekliği $h = 4$ m olan silindirik bir depo suyla dolu.</strong> Suyun tamamını üstten dışarı pompalamak için gereken işi bulun. ($\\rho g = 9800$ N/m³ alın.)<br><br><em>Çözüm.</em> Kesit alanı $A = \\pi r^2 = \\pi$. Derinlik $y$'deki (üstten ölçülen) katmanın hacmi $\\pi\\,dy$, ağırlığı $9800\\pi\\,dy$, kaldırılma mesafesi $y$.<br>$W = \\int_0^4 9800\\pi \\cdot y\\,dy = 9800\\pi \\cdot \\dfrac{y^2}{2}\\Big|_0^4 = 9800\\pi \\cdot 8 = 78{,}400\\pi \\approx 246{,}300$ J $\\approx 246$ kJ. <strong>Cevap: $\\approx 246$ kJ.</strong></div></div>

<h2 class="lesson-title">11. Özet — İntegralin Tüm Uygulamaları, Yan Yana</h2>

<p class="l-text">Bu derste gördüğümüz her uygulama aynı şablonu izler: önce sonsuz küçük parçanın yerel katkısı $dQ$'yu yazın, sonra integralini alın. Aşağıdaki tablo en sık karşılaşılan yedi durumu bir araya getirir. Her satırı "bu nicelik, şu integrandın $a$'dan $b$'ye integraline eşittir" diye okuyun.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(15,15,20,0.55);color:#ebe6dc;font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead>
<tr style="background:#3b82f6;color:#ffffff">
<th style="padding:0.7rem 0.9rem;text-align:left;border:1px solid rgba(255,255,255,0.18)">Uygulama</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border:1px solid rgba(255,255,255,0.18)">Formül</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border:1px solid rgba(255,255,255,0.18)">Fiziksel / Geometrik Anlam</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Eğri altındaki alan</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$A = \\int_a^b f(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$[a, b]$ üzerinde $y = f(x)$ ile x-ekseni arasındaki işaretli alan.</td></tr>
<tr style="background:rgba(255,255,255,0.025)"><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Hacim — disk yöntemi</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = \\pi\\int_a^b [f(x)]^2\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">X-ekseni etrafında dönme cismi: yarıçapı $f(x)$ olan ince disklerin yığını.</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Hacim — silindirik kabuk yöntemi</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$V = 2\\pi\\int_a^b x\\,f(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Y-ekseni etrafında dönme cismi: yarıçapı $x$, yüksekliği $f(x)$ olan iç içe silindirik kabuklar.</td></tr>
<tr style="background:rgba(255,255,255,0.025)"><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">İş (değişken kuvvet)</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$W = \\int_a^b F(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Konuma bağlı $F(x)$ kuvveti $a$'dan $b$'ye etki ederken aktarılan enerji.</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Yay uzunluğu</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$L = \\int_a^b \\sqrt{1 + (f'(x))^2}\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$y = f(x)$'in gerçek kıvrımlı uzunluğu; sonsuz küçük hipotenüslerin toplamı $ds = \\sqrt{dx^2 + dy^2}$.</td></tr>
<tr style="background:rgba(255,255,255,0.025)"><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Ortalama değer</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\bar f = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$[a, b]$ tabanı üzerinde $f$'nin altındaki bölge ile aynı alana sahip dikdörtgenin yüksekliği.</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08);font-weight:600">Ağırlık merkezi (1B)</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">$\\bar x = \\dfrac{\\int_a^b x\\,\\rho(x)\\,dx}{\\int_a^b \\rho(x)\\,dx}$</td><td style="padding:0.6rem 0.9rem;border:1px solid rgba(255,255,255,0.08)">Doğrusal kütle yoğunluğu $\\rho(x)$ olan ince bir çubuğun denge noktası; konumun ağırlıklı ortalaması.</td></tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>Tek şablon, çok kullanım.</strong> Tekrarlayan örüntüye dikkat: her uygulamada (i) cismi sonsuz küçük parçalara dilimleyin, (ii) bir parçanın katkısını "yerel oran $\\times\\,dx$" olarak yazın, (iii) $\\int_a^b$ ile toplayın. Bu şablonu içselleştirdiğinizde, integrali yeni bir fiziksel veya geometrik niceliğe uygulamak yeni bir türetme değil, rutin bir alıştırma hâline gelir.</div>

<div class="l-note"><strong>Bu derste öğrendikleriniz.</strong> İntegral evrensel bir biriktiricidir. Bir nicelik sonsuz sayıda küçük katkıdan oluşuyorsa — minik itmelerden iş, ince şeritlerden alan, kısa parçalardan uzunluk, ince bantlardan yüzey alanı — doğru formül her zaman yerel katkıyı integrand olarak alan bir integraldir. "$d(\\text{şey}) = \\text{yerel oran} \\cdot dx$" denkleminden "$\\text{şey} = \\int_a^b \\text{yerel oran}\\,dx$" denklemine geçişi iyi öğrenin; bu, kalkülüsün en güçlü ve en yararlı yüzüdür.</div>`
};
