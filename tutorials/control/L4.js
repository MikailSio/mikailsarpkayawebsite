window.CONTROL_L4 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The root locus is a graphical compass for closed-loop pole placement.</strong> Once you can sketch it by hand, you immediately know how a single gain knob — the proportional gain $K$ — drags the closed-loop poles around the complex plane, what damping ratios are reachable without ever leaving proportional control, and exactly when adding an integrator or a lead network will let you cross a forbidden region. Bode plots tell you about a single frequency at a time; Nyquist tells you about stability margins; the root locus tells you, geometrically, where the poles <em>live</em> as a parameter sweeps. It is the technique you will reach for when a customer says "the step response is too oscillatory at this gain, can we get closer to critical damping without adding hardware?".</p>

<p class="l-text">In this lesson you will learn the closed-loop characteristic equation, the six sketching rules (branches, real-axis segments, asymptotes, breakaways, jω-crossings, departure angles), two fully worked examples — one without zeros and one with — and how to read a design specification (damping, settling time, overshoot) directly off the locus to pick a numerical $K$. We finish by adding a PI compensator and a lead compensator and watching the locus re-shape, so that root-locus thinking becomes a tool you use not only to analyse but to <em>design</em>.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write the closed-loop characteristic equation $1 + KG(s)H(s) = 0$ for any unity-feedback configuration and explain what its roots mean physically</li>
<li>Apply the six sketching rules — number of branches, real-axis segments, asymptotes, centroid, breakaways, jω-axis crossings — to draw a root locus from open-loop pole/zero data alone</li>
<li>Walk through Examples 1 and 2 ($K/[s(s{+}1)(s{+}5)]$ with and without an added zero at $-2$) end-to-end and explain how the zero pulls branches toward it</li>
<li>Read a design target (damping $\\zeta$, settling time $T_s$, overshoot %OS) directly off the locus and pick the gain $K$ that places the closed-loop poles at the intersection of locus and design lines</li>
<li>Recognise when proportional control alone cannot meet a specification, and reach for a PI or lead compensator that reshapes the locus into the feasible region</li>
<li>Implement a numerical root-locus sweep in Python (NumPy <code>np.roots</code> over a grid of $K$) and reproduce the textbook plots in the Pyodide lab</li>
</ul>
</div>

<h2 class="lesson-title">1. The Closed-Loop Characteristic Equation</h2>

<div class="calc-highlight"><strong>One equation, all the geometry.</strong> Consider a unity-feedback loop whose forward path is $KG(s)$ and whose feedback path is $H(s)$. The closed-loop transfer function is $T(s) = KG/(1 + KGH)$ and the closed-loop poles are exactly the roots of $1 + KG(s)H(s) = 0$. As $K$ sweeps from $0$ to $\\infty$, those roots trace continuous curves in the complex plane. <em>That set of curves is the root locus.</em></div>

<p class="l-text">Let's pin down the notation. The <em>open-loop</em> transfer function $L(s) = KG(s)H(s)$ already has known poles and zeros — the ones you read off the physical plant and the controller. Call them $\\{p_1, \\dots, p_{n_p}\\}$ and $\\{z_1, \\dots, z_{n_z}\\}$. The closed-loop characteristic equation is</p>

<div class="calc-formula"><div class="formula-label">CHARACTERISTIC EQUATION</div><div class="formula-main">$$1 + K \\, G(s)\\,H(s) \\;=\\; 0 \\quad\\Longleftrightarrow\\quad K \\;=\\; -\\frac{1}{G(s)H(s)} \\;=\\; -\\frac{\\prod_{j}(s - p_j)}{\\prod_{i}(s - z_i)}$$</div><div class="formula-sub">Closed-loop poles are the values of s that satisfy this for some K in [0, ∞). The locus is the set of all such s.</div></div>

<p class="l-text">Because $K \\ge 0$ is real, a point $s$ lies on the locus iff $K \\, G(s)H(s) = -1$. Splitting into magnitude and angle conditions gives the two laws every locus point obeys:</p>

<div class="calc-formula"><div class="formula-label">MAGNITUDE AND ANGLE CONDITIONS</div><div class="formula-main">$$|K\\,G(s)H(s)| \\;=\\; 1, \\qquad \\angle\\,G(s)H(s) \\;=\\; (2k+1)\\cdot 180^\\circ, \\quad k \\in \\mathbb{Z}$$</div><div class="formula-sub">A candidate s is on the locus iff the angles from open-loop zeros minus angles from open-loop poles sum to an odd multiple of 180°. The gain that puts it there is then read off the magnitude equation.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K = 0</div><div class="card-body">When $K = 0$, the closed-loop characteristic equation becomes $\\prod_j (s - p_j) = 0$. The closed-loop poles coincide with the open-loop poles. Every branch <em>starts</em> at an open-loop pole.</div></div>
<div class="calc-card"><div class="card-title">K → ∞</div><div class="card-body">As $K \\to \\infty$, the equation forces $\\prod_i (s - z_i) = 0$. Branches <em>end</em> at open-loop zeros — including "zeros at infinity" if there are fewer zeros than poles.</div></div>
<div class="calc-card"><div class="card-title">What "branch" means</div><div class="card-body">A branch is a continuous curve traced by one of the $n_p$ closed-loop poles as $K$ varies. There are exactly $\\max(n_p, n_z)$ branches; in practice $n_p \\ge n_z$, so the count equals $n_p$.</div></div>
<div class="calc-card"><div class="card-title">Stability link</div><div class="card-body">The plant is closed-loop stable for a given $K$ iff all branches at that $K$ lie strictly in the left half-plane. Cross into the right half-plane and the loop is unstable — that crossing is the design boundary.</div></div>
</div>

<div class="calc-graph"><div id="plot-l4-cl-poles-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same plant $G(s) = 1/[s(s{+}1)(s{+}5)]$ at four representative gains. The three closed-loop poles (large dots) sit at the open-loop poles $0, -1, -5$ when $K=0$, drift toward each other as $K$ grows, collide on the real axis, then split into a complex-conjugate pair that climbs toward the right half-plane. The continuous curves connecting consecutive snapshots <em>are</em> the root locus.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ks=[0,0.5,1.5,3,5,8,12,18,25,35,50,70,100];
var allRe=[],allIm=[],Klab=[];
function rootsAtK(K){
  var a=[1,6,5,K];
  var n=a.length-1;
  var roots=[];
  if(K<0.01){return[{re:0,im:0},{re:-1,im:0},{re:-5,im:0}];}
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;
  for(var i=0;i<50;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-9)break;}
  var r1=x;
  var b1=1,b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var snapshots=[];
Ks.forEach(function(K){var r=rootsAtK(K);snapshots.push({K:K,r:r});});
var traces=[];
var colors=['#3b82f6','#10b981','#f59e0b'];
[0,1,2].forEach(function(idx){
  var xs=[],ys=[];snapshots.forEach(function(sn){xs.push(sn.r[idx].re);ys.push(sn.r[idx].im);});
  traces.push({x:xs,y:ys,mode:'lines',line:{color:colors[idx],width:2},name:'branch '+(idx+1)});
});
[0,Ks.length-1].forEach(function(j){
  snapshots[j].r.forEach(function(rt,k){
    traces.push({x:[rt.re],y:[rt.im],mode:'markers',marker:{size:11,color:colors[k],symbol:j===0?'x':'circle',line:{color:'#fff',width:1}},showlegend:false,hoverinfo:'skip'});
  });
});
traces.push({x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'open-loop poles (K=0)'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-6,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-4,x1:0,y1:4,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-cl-poles-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Every result in this lesson is a consequence of those two scalar conditions. The sketching rules in Section 2 are nothing more than shortcuts for finding the points where the angle condition is satisfied, and for understanding how the geometry forces certain qualitative features (real-axis segments, asymptotes, breakaway points).</p>

<h2 class="lesson-title">2. The Six Rules for Sketching</h2>

<div class="calc-highlight"><strong>The pen-and-paper recipe.</strong> Given the open-loop poles and zeros of $G(s)H(s)$ you can sketch the locus in a few minutes without solving a single polynomial. The rules below are not approximations — they are exact consequences of the angle condition and they let you verify a numerical plot or anticipate one before opening MATLAB.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rule 1 — Number of branches</div><div class="card-body">There are exactly $N = \\max(n_p, n_z)$ branches, one per closed-loop pole. For almost every plant of interest $n_p \\ge n_z$, so $N = n_p$. Branches are symmetric about the real axis because real-coefficient polynomials have complex-conjugate roots.</div></div>
<div class="calc-card"><div class="card-title">Rule 2 — Starts and ends</div><div class="card-body">Each branch starts at an open-loop pole (K=0) and ends at an open-loop zero (K→∞). The $n_p - n_z$ "missing" zeros are at infinity; that many branches escape to infinity along asymptotes (Rule 4).</div></div>
<div class="calc-card"><div class="card-title">Rule 3 — Real-axis segments</div><div class="card-body">A point on the real axis is on the locus iff the total number of real-axis poles and zeros lying strictly to its right is <em>odd</em>. This follows directly from the 180° angle condition: contributions from complex-conjugate pairs cancel, real-axis poles/zeros to the left contribute 0°, and to the right contribute 180°.</div></div>
<div class="calc-card"><div class="card-title">Rule 4 — Asymptote angles</div><div class="card-body">$n_p - n_z$ branches go to infinity along asymptotes at angles $\\theta_k = \\frac{(2k+1)\\cdot 180^\\circ}{n_p - n_z}, \\; k = 0, 1, \\dots, n_p - n_z - 1$. For excess 3 (three poles, no zeros): asymptotes at $\\pm 60^\\circ$ and $180^\\circ$.</div></div>
<div class="calc-card"><div class="card-title">Rule 5 — Centroid</div><div class="card-body">All asymptotes intersect the real axis at the centroid $\\sigma_a = \\dfrac{\\sum_j p_j - \\sum_i z_i}{n_p - n_z}$. For our running example $G = 1/[s(s{+}1)(s{+}5)]$: $\\sigma_a = (0 - 1 - 5)/3 = -2$.</div></div>
<div class="calc-card"><div class="card-title">Rule 6 — Breakaways and break-ins</div><div class="card-body">Where two branches collide on the real axis and split into the complex plane (a breakaway), or come back together (a break-in), the derivative $dK/ds = 0$ at that point. Set $K(s) = -1/[G(s)H(s)]$, differentiate, solve.</div></div>
</div>

<p class="l-text"><strong>Two more sub-rules that often matter.</strong> The <em>jω-axis crossing</em> (where a branch crosses from left to right half-plane, defining the critical gain $K_\\text{cr}$) is found by either Routh-Hurwitz on the characteristic polynomial or by substituting $s = j\\omega$ into the characteristic equation and solving for $\\omega$ and $K$ jointly. The <em>departure angle</em> from a complex pole $p^*$ is $\\theta_d = 180^\\circ - \\sum_{j\\ne *} \\angle(p^* - p_j) + \\sum_i \\angle(p^* - z_i)$, and is used to sketch the locus near complex open-loop poles.</p>

<div class="calc-graph"><div id="plot-l4-rules-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the qualitative sketch you would produce by hand for $G(s) = K/[s(s{+}1)(s{+}5)]$. Open-loop poles at $0$, $-1$, $-5$ (blue ×). Real-axis segments are the bold blue intervals. Three asymptotes (dashed) leave the centroid at $\\sigma_a = -2$ at angles $\\pm 60^\\circ$ and $180^\\circ$. A breakaway near $s \\approx -0.473$ launches two branches into the complex plane.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var poles={x:[0,-1,-5],y:[0,0,0]};
var segLeftEnd={x:[-5,-Infinity],y:[0,0]};
var realSeg1={x:[-1,0],y:[0,0]};
var realSeg2={x:[-7,-5],y:[0,0]};
var sigma_a=-2;
function asymp(angDeg,L){var t=angDeg*Math.PI/180;return{x:[sigma_a,sigma_a+L*Math.cos(t)],y:[0,L*Math.sin(t)]};}
var a1=asymp(60,7),a2=asymp(-60,7),a3=asymp(180,5);
var breakaway={x:[-0.473],y:[0]};
var traces=[
  {x:realSeg1.x,y:realSeg1.y,mode:'lines',line:{color:'#3b82f6',width:5},name:'real-axis segments'},
  {x:realSeg2.x,y:realSeg2.y,mode:'lines',line:{color:'#3b82f6',width:5},showlegend:false},
  {x:a1.x,y:a1.y,mode:'lines',line:{color:'rgba(245,158,11,0.7)',dash:'dash',width:1.5},name:'asymptotes'},
  {x:a2.x,y:a2.y,mode:'lines',line:{color:'rgba(245,158,11,0.7)',dash:'dash',width:1.5},showlegend:false},
  {x:a3.x,y:a3.y,mode:'lines',line:{color:'rgba(245,158,11,0.7)',dash:'dash',width:1.5},showlegend:false},
  {x:poles.x,y:poles.y,mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'open-loop poles'},
  {x:[sigma_a],y:[0],mode:'markers+text',marker:{size:9,color:'#f59e0b',symbol:'square'},text:['σ_a=-2'],textposition:'bottom center',showlegend:false},
  {x:breakaway.x,y:breakaway.y,mode:'markers+text',marker:{size:9,color:'#10b981',symbol:'diamond'},text:['breakaway ≈ -0.473'],textposition:'top center',showlegend:false}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-5,5],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-rules-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Asymptotes — Where the Branches Go at High Gain</h2>

<div class="calc-highlight"><strong>For very large $|s|$ the locus looks like its asymptotes.</strong> When $|s| \\gg$ every $|p_j|$ and $|z_i|$, the open-loop transfer function behaves like $G(s)H(s) \\approx s^{n_z - n_p}$. Plug this into the angle condition $\\angle G(s)H(s) = (2k+1) \\cdot 180^\\circ$ to derive the asymptote angles directly.</div>

<p class="l-text">The derivation: with $L(s) \\approx s^{n_z - n_p}$ at large $|s|$, the angle condition becomes $(n_z - n_p)\\angle s = (2k+1)\\cdot 180^\\circ$, so $\\angle s = \\theta_k = \\frac{(2k+1)\\cdot 180^\\circ}{n_p - n_z}$. Each distinct $\\theta_k$ gives one asymptote ray. For $n_p - n_z = 1$, the single asymptote is the negative real axis ($\\theta_0 = 180^\\circ$). For $n_p - n_z = 2$, two asymptotes at $\\pm 90^\\circ$. For $n_p - n_z = 3$, three at $\\pm 60^\\circ, 180^\\circ$. For $n_p - n_z = 4$, four at $\\pm 45^\\circ, \\pm 135^\\circ$.</p>

<div class="calc-formula"><div class="formula-label">CENTROID FORMULA</div><div class="formula-main">$$\\sigma_a \\;=\\; \\frac{\\sum_{j=1}^{n_p} p_j \\;-\\; \\sum_{i=1}^{n_z} z_i}{n_p - n_z}$$</div><div class="formula-sub">Real part of the common intersection point of all asymptotes. Derived from matching the next-leading term of L(s) at infinity.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Worked: 3 poles, 0 zeros</div><div class="card-body">$G(s) = K/[s(s{+}1)(s{+}5)]$. $n_p - n_z = 3$. Angles $\\pm 60^\\circ, 180^\\circ$. $\\sigma_a = (0 - 1 - 5)/3 = -2$. Two branches asymptote into the right half-plane at high gain — system is destabilising.</div></div>
<div class="calc-card"><div class="card-title">Worked: 3 poles, 1 zero</div><div class="card-body">$G(s) = K(s{+}2)/[s(s{+}1)(s{+}5)]$. $n_p - n_z = 2$. Angles $\\pm 90^\\circ$. $\\sigma_a = (-1 - 5 + 2)/2 = -2$. Two branches asymptote vertically; the zero "absorbs" one branch (it ends at $s = -2$ rather than escaping to infinity).</div></div>
<div class="calc-card"><div class="card-title">Why excess-3 plants are dangerous</div><div class="card-body">Excess 3+ guarantees at least one asymptote in the right half-plane (since at least one $\\theta_k \\in (-90^\\circ, 90^\\circ)$). Such systems will <em>always</em> go unstable at high enough $K$ — there is some critical gain beyond which the loop oscillates. Excess 2 with no RHP poles is conditionally stable for all positive $K$.</div></div>
<div class="calc-card"><div class="card-title">Sanity check at infinity</div><div class="card-body">If you mis-compute the asymptote count, the locus won't close. Always re-verify: # branches escaping to infinity = $n_p - n_z$.</div></div>
</div>

<h2 class="lesson-title">4. Breakaway and Break-in Points</h2>

<div class="calc-highlight"><strong>Where two branches meet on the real axis and leap into the complex plane.</strong> A breakaway is a local maximum of $K$ along a real-axis segment as $s$ moves; a break-in is a local minimum where two complex branches return to the real axis. Both satisfy $dK/ds = 0$, which gives a polynomial equation in $s$.</div>

<p class="l-text">From the characteristic equation, $K(s) = -1/[G(s)H(s)] = -\\prod_j (s - p_j) / \\prod_i (s - z_i)$. Take the derivative with respect to $s$ and set it to zero. Equivalent and often easier: write the characteristic polynomial $D(s) + K\\,N(s) = 0$ where $D(s) = \\prod_j(s-p_j)$ and $N(s) = \\prod_i(s-z_i)$, then enforce $D'(s)N(s) - D(s)N'(s) = 0$. The real roots of this polynomial that lie on a real-axis <em>segment of the locus</em> are the breakaway/break-in points.</p>

<div class="calc-formula"><div class="formula-label">BREAKAWAY CONDITION</div><div class="formula-main">$$\\frac{dK}{ds} \\;=\\; 0 \\quad\\Longleftrightarrow\\quad \\frac{D'(s)}{D(s)} \\;=\\; \\frac{N'(s)}{N(s)} \\quad\\Longleftrightarrow\\quad \\sum_{j} \\frac{1}{s - p_j} \\;=\\; \\sum_{i} \\frac{1}{s - z_i}$$</div><div class="formula-sub">For our 3-pole, 0-zero example the right side is zero, so we solve 1/s + 1/(s+1) + 1/(s+5) = 0.</div></div>

<p class="l-text"><strong>Worked breakaway for $G = K/[s(s{+}1)(s{+}5)]$.</strong> Setting the sum to zero and multiplying by $s(s+1)(s+5)$ gives $(s+1)(s+5) + s(s+5) + s(s+1) = 0 \\Rightarrow 3s^2 + 12s + 5 = 0$. Discriminant $144 - 60 = 84$, so $s = (-12 \\pm \\sqrt{84})/6 \\approx -0.473$ or $-3.527$. Only $s \\approx -0.473$ sits on the locus segment $[-1, 0]$, so it is the breakaway. The companion root $-3.527$ lies between $-5$ and $-1$, which is <em>not</em> a locus segment (Rule 3), so it is a spurious solution and discarded.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Filter out spurious roots</div><div class="card-body">Always cross-check the breakaway candidate against the real-axis-segment rule. The derivative equation can have solutions that are not on the locus and must be rejected.</div></div>
<div class="calc-card"><div class="card-title">The breakaway gain</div><div class="card-body">Once $s_b$ is known, the gain at breakaway is $K_b = -1/[G(s_b)H(s_b)]$. For our example $K_b \\approx 1.13$.</div></div>
<div class="calc-card"><div class="card-title">Departure angle from a breakaway</div><div class="card-body">If $m$ branches meet at a breakaway, they leave at equally spaced angles: $\\Delta\\theta = 360^\\circ / m$ between consecutive departures, with the first ray angled at the angle condition. For a simple two-branch breakaway on the real axis: $\\pm 90^\\circ$ — branches leave perpendicular to the axis.</div></div>
<div class="calc-card"><div class="card-title">Numerical alternative</div><div class="card-body">When the polynomial is messy, sweep $K$ numerically, compute roots with <code>numpy.roots</code>, and find where successive root sets transition from real-only to complex. The Pyodide lab in Section 10 does exactly this.</div></div>
</div>

<h2 class="lesson-title">5. The jω-Axis Crossing — Where the Loop Becomes Unstable</h2>

<div class="calc-highlight"><strong>The critical gain $K_\\text{cr}$.</strong> When the locus crosses the imaginary axis, a closed-loop pole has zero real part: the loop is on the boundary of stability. The crossing frequency $\\omega_\\text{cr}$ is the frequency at which the closed-loop oscillates (a sustained sinusoid). Two ways to find $(K_\\text{cr}, \\omega_\\text{cr})$: Routh-Hurwitz or direct substitution $s = j\\omega$.</div>

<p class="l-text"><strong>Routh-Hurwitz on the running example.</strong> Characteristic polynomial: $s^3 + 6s^2 + 5s + K = 0$. Routh array:</p>

<div class="calc-formula"><div class="formula-label">ROUTH ARRAY</div><div class="formula-main">$$\\begin{array}{c|cc} s^3 & 1 & 5 \\\\ s^2 & 6 & K \\\\ s^1 & \\dfrac{30 - K}{6} & 0 \\\\ s^0 & K & 0 \\end{array}$$</div><div class="formula-sub">All first-column entries must be positive for stability. The s¹ entry vanishes at K = 30; that is the critical gain.</div></div>

<p class="l-text">At $K = K_\\text{cr} = 30$, the auxiliary polynomial from the $s^2$ row is $6s^2 + 30 = 0$, so $s = \\pm j\\sqrt{5}$ — the crossings sit at $\\omega = \\sqrt{5} \\approx 2.236\\,\\text{rad/s}$. <em>Verify with substitution:</em> plug $s = j\\omega$ into $s^3 + 6s^2 + 5s + K = 0$: $-j\\omega^3 - 6\\omega^2 + 5j\\omega + K = 0$. Real part: $K - 6\\omega^2 = 0$. Imaginary part: $-\\omega^3 + 5\\omega = 0 \\Rightarrow \\omega^2 = 5$. Therefore $\\omega = \\sqrt{5}, \\; K = 30$.</p>

<div class="calc-graph"><div id="plot-l4-jw-cross-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two complex branches of $G = K/[s(s{+}1)(s{+}5)]$ swept from $K=0$ to $K=60$. At $K = K_\\text{cr} = 30$ they cross the imaginary axis at $\\pm j\\sqrt{5} \\approx \\pm j2.24$. For $K < 30$ the loop is stable; for $K > 30$ it is unstable (pole in the RHP). The crossing frequency is the frequency at which the closed-loop oscillates at the boundary.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function rootsAtK(K){
  var a=[1,6,5,K];
  var roots=[];
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;
  for(var i=0;i<60;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-10)break;}
  var r1=x;
  var b1=1,b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var Ks=[];for(var i=0;i<=200;i++){Ks.push(i*0.3);}
var b1x=[],b1y=[],b2x=[],b2y=[],b3x=[],b3y=[];
Ks.forEach(function(K){var r=rootsAtK(K);
  b1x.push(r[0].re);b1y.push(r[0].im);
  b2x.push(r[1].re);b2y.push(r[1].im);
  b3x.push(r[2].re);b3y.push(r[2].im);
});
var traces=[
  {x:b1x,y:b1y,mode:'lines',line:{color:'#3b82f6',width:2.2},name:'branch 1'},
  {x:b2x,y:b2y,mode:'lines',line:{color:'#10b981',width:2.2},name:'branch 2'},
  {x:b3x,y:b3y,mode:'lines',line:{color:'#f59e0b',width:2.2},name:'branch 3'},
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'open-loop poles'},
  {x:[0,0],y:[Math.sqrt(5),-Math.sqrt(5)],mode:'markers+text',marker:{size:11,color:'#f87171',symbol:'circle-open',line:{width:2.5}},text:['K_cr=30','K_cr=30'],textposition:'middle right',showlegend:false}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-4,x1:0,y1:4,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-jw-cross-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Practical takeaway.</strong> Once you have the locus and the critical gain, you have an upper bound on $K$ in any pure-proportional design. You will often pick a $K$ that gives 50% of the critical gain (a "gain margin" of 2, or 6 dB) to leave room for plant uncertainty.</div>

<h2 class="lesson-title">6. Worked Example 1 — $G(s) = K/[s(s{+}1)(s{+}5)]$</h2>

<p class="l-text">This is the canonical textbook plant for root-locus practice. Let's do the full sketch.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Inventory</div><div class="card-body">Open-loop poles: $0, -1, -5$. Open-loop zeros: none. $n_p = 3$, $n_z = 0$, excess 3. Three branches.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Real-axis segments</div><div class="card-body">Apply odd-count rule. Between $0$ and $-1$: one pole to the right ($0$ — wait, that's at $0$, which is the boundary; consider just left of $0$). Strictly right of any point in $(-1, 0)$ we have the pole at $0$ → count = 1 (odd) → on locus. In $(-5, -1)$: poles at $0$ and $-1$ to the right → count 2 → off. In $(-\\infty, -5)$: all three poles to the right → count 3 → on locus.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Asymptotes</div><div class="card-body">Three asymptotes at $\\pm 60^\\circ, 180^\\circ$. Centroid $\\sigma_a = (0 - 1 - 5)/3 = -2$. One asymptote runs along the negative real axis from $\\sigma_a$; the other two head up and down at $60^\\circ$.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Breakaway</div><div class="card-body">Solve $1/s + 1/(s+1) + 1/(s+5) = 0 \\Rightarrow 3s^2 + 12s + 5 = 0$. Roots $\\approx -0.473, -3.527$. Only $-0.473$ is on the locus, so it is the breakaway. Two branches leave at $\\pm 90^\\circ$.</div></div>
<div class="calc-card"><div class="card-title">Step 5 — jω crossing</div><div class="card-body">Routh: $K_\\text{cr} = 30$ at $\\omega = \\sqrt{5}$. So branches cross into the RHP only when $K > 30$.</div></div>
<div class="calc-card"><div class="card-title">Step 6 — Sketch</div><div class="card-body">Branch from $0$ moves left to $-0.473$. Branch from $-1$ moves right to $-0.473$. They meet, split into a complex pair, head up/down, then curve outward toward the $\\pm 60^\\circ$ asymptotes, crossing the jω-axis at $\\pm j\\sqrt{5}$ when $K = 30$. Branch from $-5$ moves left along the real axis toward $-\\infty$ along the $180^\\circ$ asymptote.</div></div>
</div>

<p class="l-text"><strong>Design exercise: pick $K$ for $\\zeta = 0.5$.</strong> The constant-damping locus is the ray from the origin at angle $\\theta = 180^\\circ - \\arccos(0.5) = 120^\\circ$ from the positive real axis. We want the closed-loop poles to land on the intersection of the root locus with this ray. Numerically, this happens at $s \\approx -0.42 \\pm j 0.73$ at $K \\approx 1.5$. The third (real) pole sits at $\\approx -5.16$ — far from the dominant pair, so its effect on the step response is small.</p>

<div class="calc-graph"><div id="plot-l4-zeta-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same root locus with the $\\zeta = 0.5$ design line drawn in red dashed. The intersection (red circle) gives the closed-loop poles at the desired damping; the corresponding $K$ is read off the magnitude condition. A second line in lighter red shows $\\zeta = 0.7$ for comparison.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function rootsAtK(K){
  var a=[1,6,5,K];var roots=[];
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;for(var i=0;i<60;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-10)break;}
  var r1=x;
  var b1=1,b2=a[1]+r1*b1,b3=a[2]+r1*b2;var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var Ks=[];for(var i=0;i<=200;i++){Ks.push(i*0.3);}
var b1x=[],b1y=[],b2x=[],b2y=[],b3x=[],b3y=[];
Ks.forEach(function(K){var r=rootsAtK(K);
  b1x.push(r[0].re);b1y.push(r[0].im);b2x.push(r[1].re);b2y.push(r[1].im);b3x.push(r[2].re);b3y.push(r[2].im);
});
function zetaLine(z,L){var phi=Math.acos(z);return{x:[0,-L*Math.cos(phi),null,0,-L*Math.cos(phi)],y:[0,L*Math.sin(phi),null,0,-L*Math.sin(phi)]};}
var z5=zetaLine(0.5,4),z7=zetaLine(0.7,4);
var traces=[
  {x:b1x,y:b1y,mode:'lines',line:{color:'#3b82f6',width:2},name:'locus'},
  {x:b2x,y:b2y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:b3x,y:b3y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:z5.x,y:z5.y,mode:'lines',line:{color:'#f87171',width:2,dash:'dash'},name:'ζ=0.5'},
  {x:z7.x,y:z7.y,mode:'lines',line:{color:'rgba(248,113,113,0.45)',width:2,dash:'dot'},name:'ζ=0.7'},
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'open-loop poles'},
  {x:[-0.42,-0.42],y:[0.73,-0.73],mode:'markers+text',marker:{size:10,color:'#10b981',symbol:'circle',line:{color:'#fff',width:1}},text:['K≈1.5',''],textposition:'top right',showlegend:false}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-6,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-zeta-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Worked Example 2 — Adding a Zero at $s = -2$</h2>

<div class="calc-highlight"><strong>Zeros pull the locus toward themselves.</strong> Replace the plant with $G(s) = K(s+2)/[s(s+1)(s+5)]$. Now $n_z = 1$, $n_p - n_z = 2$. One branch that used to escape to infinity instead terminates at the zero at $s = -2$. The asymptote angles change from $\\pm 60^\\circ, 180^\\circ$ to $\\pm 90^\\circ$. The centroid shifts.</div>

<p class="l-text">Inventory: poles $\\{0, -1, -5\\}$, zero $\\{-2\\}$. Three branches; two head off to infinity along vertical asymptotes (angles $\\pm 90^\\circ$) and one terminates at $s = -2$. Centroid: $\\sigma_a = (0 - 1 - 5 - (-2))/2 = -4/2 = -2$. Coincidentally the asymptote starts <em>at the zero</em>.</p>

<p class="l-text"><strong>Real-axis segments.</strong> Apply odd-count rule with the added zero. In $(-1, 0)$: pole at $0$ to the right → count 1 (odd) → on locus. In $(-2, -1)$: poles $0, -1$ to the right → count 2 → off. In $(-5, -2)$: poles $0, -1$ and zero $-2$ to the right → count 3 → on locus. In $(-\\infty, -5)$: all four → count 4 → off (this is a flip from Example 1!).</p>

<p class="l-text"><strong>How the locus changes qualitatively.</strong> The zero "absorbs" the branch from $s = -5$, which now moves to the right along the real axis to terminate at $s = -2$, rather than disappearing to infinity. The other two branches still meet at a breakaway between $0$ and $-1$ (closer to the zero now, around $s \\approx -0.45$), split, and head vertically rather than at $60^\\circ$. <em>The result is a much "tamer" locus</em> — branches stay in the left half-plane for a wider range of $K$, often for all $K > 0$. The system is fully stabilised by proportional control plus the added zero.</p>

<div class="calc-graph"><div id="plot-l4-with-zero-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two loci overlaid. Blue: $G = K/[s(s{+}1)(s{+}5)]$ (Example 1 — escapes to RHP at $K = 30$). Orange: $G = K(s{+}2)/[s(s{+}1)(s{+}5)]$ (Example 2 — branches stay in LHP for all $K > 0$, terminating at the zero or at $\\pm j\\infty$). Adding the zero is a tiny analytical change with a dramatic stabilising effect.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function roots3(a){
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;
  for(var i=0;i<80;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-10)break;}
  var r1=x;
  var b1=a[0],b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);return[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  var s=Math.sqrt(-disc);return[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];
}
function rootsEx1(K){return roots3([1,6,5,K]);}
function rootsEx2(K){return roots3([1,6,5+K,2*K]);}
var Ks=[];for(var i=0;i<=200;i++){Ks.push(i*0.4);}
var e1=[[],[],[]],e2=[[],[],[]];
Ks.forEach(function(K){var r=rootsEx1(K);e1[0].push(r[0]);e1[1].push(r[1]);e1[2].push(r[2]);var r2=rootsEx2(K);e2[0].push(r2[0]);e2[1].push(r2[1]);e2[2].push(r2[2]);});
function trace(arr,col,name,sh){return{x:arr.map(function(r){return r.re;}),y:arr.map(function(r){return r.im;}),mode:'lines',line:{color:col,width:2,dash:sh},name:name};}
var traces=[
  trace(e1[0],'#3b82f6','Example 1 (no zero)',null),
  trace(e1[1],'#3b82f6',null,null),
  trace(e1[2],'#3b82f6',null,null),
  trace(e2[0],'#f59e0b','Example 2 (zero at -2)','dash'),
  trace(e2[1],'#f59e0b',null,'dash'),
  trace(e2[2],'#f59e0b',null,'dash'),
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:13,color:'#cbd5e1',symbol:'x',line:{width:2}},name:'open-loop poles'},
  {x:[-2],y:[0],mode:'markers',marker:{size:13,color:'#10b981',symbol:'circle-open',line:{width:2.5}},name:'zero (Example 2)'}
];
traces[1].showlegend=false;traces[2].showlegend=false;traces[4].showlegend=false;traces[5].showlegend=false;
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-5,5],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-5,x1:0,y1:5,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-with-zero-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Designing for a Specification</h2>

<div class="calc-highlight"><strong>From requirement to gain in three steps.</strong> The customer says: "settling time $T_s \\le 8$ s, overshoot $\\le 5\\%$". Translate to constraints on the closed-loop poles, then check whether the locus passes through the feasible region. If yes, read off $K$. If no, add a compensator.</div>

<p class="l-text">Standard second-order approximations relate transient specs to dominant-pole parameters. For dominant complex poles at $-\\sigma \\pm j\\omega_d$ with damping $\\zeta$ and natural frequency $\\omega_n$:</p>

<div class="calc-formula"><div class="formula-label">DESIGN TRANSLATIONS</div><div class="formula-main">$$T_s \\;\\approx\\; \\frac{4}{\\zeta \\omega_n} \\;=\\; \\frac{4}{\\sigma}, \\qquad \\%\\text{OS} \\;=\\; 100 \\, e^{-\\zeta \\pi / \\sqrt{1-\\zeta^2}}, \\qquad T_p \\;=\\; \\frac{\\pi}{\\omega_d}$$</div><div class="formula-sub">Settling time (4% criterion), percent overshoot, peak time of a second-order underdamped step response.</div></div>

<p class="l-text"><strong>Worked.</strong> $T_s \\le 8$ s ⇒ $\\sigma \\ge 0.5$ (real part of pole must be ≤ -0.5). $\\%\\text{OS} \\le 5\\%$ ⇒ $\\zeta \\ge 0.69$ (invert the overshoot formula). On the $s$-plane these draw two constraints: a vertical line $\\text{Re}(s) = -0.5$ (poles to the left of it) and two rays from the origin at angle $\\arccos(0.69) \\approx 46.4^\\circ$ from the negative real axis (poles inside the cone). The feasible region is the intersection.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Draw the constraints</div><div class="card-body">On the same plot as the locus, draw the vertical line for settling time and the damping cone for overshoot. The feasible region is the part of the $s$-plane satisfying both.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Locus-feasible intersection</div><div class="card-body">If the locus passes through the feasible region, pick any point on the intersection and read $K$ from the magnitude condition: $K = 1/|G(s)|$. If multiple points qualify, prefer the one closer to the desired natural frequency.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Verify with a simulation</div><div class="card-body">The second-order approximation assumes a dominant complex pair. Always plot the closed-loop step response at the chosen $K$ and confirm the actual overshoot and settling time. Adjust if non-dominant poles or zeros pull the response off-target.</div></div>
<div class="calc-card"><div class="card-title">If no intersection exists</div><div class="card-body">Proportional control cannot meet the spec. You need a compensator (PI, lead, lag, PID) that <em>reshapes</em> the locus to pass through the feasible region. Section 9 walks through this for our example.</div></div>
</div>

<h2 class="lesson-title">9. Compensator Design via Root Locus</h2>

<div class="calc-highlight"><strong>Adding poles and zeros bends the locus.</strong> If proportional control alone cannot place the closed-loop poles where the specifications demand, insert a compensator $C(s)$ in series with the plant. The locus is now drawn for the augmented open-loop transfer function $K\\,C(s)G(s)H(s)$. A PI controller adds a pole at the origin and a zero in the LHP; a lead controller adds a zero and a faster pole; a lag adds them with the pole closer to the origin.</div>

<p class="l-text"><strong>PI controller: $C(s) = K_p + K_i/s = K(s + a)/s$.</strong> Net effect: add a pole at $s = 0$ (free integrator) and a zero at $s = -a$. The pole at the origin pulls the locus to the right (destabilising effect that you compensate for by placing the zero in the right spot). Choose $a$ small (zero close to the origin) for a textbook PI: the locus near the dominant region looks almost the same as without the PI, but you gain zero steady-state error to a step.</p>

<p class="l-text"><strong>Lead controller: $C(s) = K(s + z)/(s + p)$ with $p > z > 0$.</strong> Both pole and zero in the LHP, pole faster than zero. The zero pulls the locus left (faster, more damped response); the pole limits the high-frequency boost. Lead compensators are the workhorse of analog control because they look like an op-amp differentiator with a single low-pass filter. Choose $z, p$ to bend the locus so the feasible region is reached at a tractable $K$.</p>

<div class="calc-formula"><div class="formula-label">COMPENSATOR CATALOG</div><div class="formula-main">$$\\begin{aligned}\\text{PI}\\colon& \\quad C(s) = K\\,\\frac{s + a}{s} \\\\ \\text{Lead}\\colon& \\quad C(s) = K\\,\\frac{s + z}{s + p}, \\;\\; p > z > 0 \\\\ \\text{Lag}\\colon& \\quad C(s) = K\\,\\frac{s + z}{s + p}, \\;\\; z > p > 0 \\\\ \\text{PID}\\colon& \\quad C(s) = K\\,\\frac{(s + a_1)(s + a_2)}{s}\\end{aligned}$$</div><div class="formula-sub">Each compensator adds specific poles and zeros to the open-loop transfer function, reshaping the root locus.</div></div>

<div class="calc-graph"><div id="plot-l4-pi-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the original locus of $G = K/[s(s{+}1)(s{+}5)]$ (blue) compared to the locus of $C(s)G(s) = K(s{+}0.5)/[s^2(s{+}1)(s{+}5)]$ (green) where a PI compensator $C(s) = (s+0.5)/s$ has been added. The added pole at the origin and zero at $-0.5$ slightly modify the dominant branches but introduce a fourth branch from $s = 0$ that ends at the new zero. Steady-state error to a step input is now zero.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function poly_eval(c,x){var n=c.length,v=0;for(var i=0;i<n;i++){v=v*x+c[i];}return v;}
function poly_deriv(c){var n=c.length,d=[];for(var i=0;i<n-1;i++)d.push(c[i]*(n-1-i));return d;}
function newton(c,x0){var x=x0;for(var i=0;i<80;i++){var f=poly_eval(c,x),fp=poly_eval(poly_deriv(c),x);if(Math.abs(fp)<1e-14)break;var d=f/fp;x-=d;if(Math.abs(d)<1e-11)break;}return x;}
function deflate(c,r){var n=c.length,q=[c[0]];for(var i=1;i<n-1;i++)q.push(c[i]+r*q[i-1]);return q;}
function roots_n(c){
  var n=c.length-1,roots=[],cur=c.slice();
  while(n>1){
    var x=newton(cur,-1);
    if(!isFinite(x))x=0;
    roots.push({re:x,im:0});
    cur=deflate(cur,x);n--;
  }
  if(n===1){roots.push({re:-cur[1]/cur[0],im:0});}
  return roots;
}
function roots_quartic(K){
  var c=[1,6,5,K*1,K*0.5];return roots_with_complex(c);
}
function roots_with_complex(c){
  var roots=[];var cur=c.slice();var n=cur.length-1;
  while(n>2){var x=newton(cur,-1);if(!isFinite(x))x=0;roots.push({re:x,im:0});cur=deflate(cur,x);n--;}
  if(n===2){
    var a=cur[0],b=cur[1],d=cur[2];
    var disc=b*b-4*a*d;
    if(disc>=0){var s=Math.sqrt(disc);roots.push({re:(-b+s)/(2*a),im:0});roots.push({re:(-b-s)/(2*a),im:0});}
    else{var s=Math.sqrt(-disc);roots.push({re:-b/(2*a),im:s/(2*a)});roots.push({re:-b/(2*a),im:-s/(2*a)});}
  }else if(n===1){roots.push({re:-cur[1]/cur[0],im:0});}
  return roots;
}
function rootsOrig(K){
  var c=[1,6,5,K];
  var roots=[];var cur=c.slice();var a=cur[0],b=cur[1],d=cur[2],e=cur[3];
  function f(x){return a*x*x*x+b*x*x+d*x+e;}
  function fp(x){return 3*a*x*x+2*b*x+d;}
  var x=-6;for(var i=0;i<80;i++){var dd=f(x)/fp(x);if(!isFinite(dd))break;x-=dd;if(Math.abs(dd)<1e-11)break;}
  var r1=x;var b1=a,b2=b+r1*b1,b3=d+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var Ks=[];for(var i=0;i<=120;i++){Ks.push(i*0.5);}
var b1x=[],b1y=[],b2x=[],b2y=[],b3x=[],b3y=[];
Ks.forEach(function(K){var r=rootsOrig(K);b1x.push(r[0].re);b1y.push(r[0].im);b2x.push(r[1].re);b2y.push(r[1].im);b3x.push(r[2].re);b3y.push(r[2].im);});
var p1x=[],p1y=[],p2x=[],p2y=[],p3x=[],p3y=[],p4x=[],p4y=[];
Ks.forEach(function(K){var r=roots_quartic(K);if(r.length<4)return;r.sort(function(a,b){return a.re-b.re;});p1x.push(r[0].re);p1y.push(r[0].im);p2x.push(r[1].re);p2y.push(r[1].im);p3x.push(r[2].re);p3y.push(r[2].im);p4x.push(r[3].re);p4y.push(r[3].im);});
var traces=[
  {x:b1x,y:b1y,mode:'lines',line:{color:'#3b82f6',width:2},name:'no compensator'},
  {x:b2x,y:b2y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:b3x,y:b3y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:p1x,y:p1y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},name:'with PI compensator'},
  {x:p2x,y:p2y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},showlegend:false},
  {x:p3x,y:p3y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},showlegend:false},
  {x:p4x,y:p4y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},showlegend:false},
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:13,color:'#cbd5e1',symbol:'x',line:{width:2}},name:'plant poles'},
  {x:[-0.5],y:[0],mode:'markers',marker:{size:12,color:'#10b981',symbol:'circle-open',line:{width:2.5}},name:'PI zero at -0.5'}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-4,x1:0,y1:4,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-pi-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Reading the green locus.</strong> Adding the PI moves one branch into the close neighbourhood of the origin (where it meets the new zero at $-0.5$), while the other branches are only slightly shifted from the original. This is the textbook outcome: PI gives you zero steady-state error to a step without significantly disturbing the dominant transient behaviour, <em>provided the zero is placed near the origin</em>. Place the zero too far left and the locus reshapes more dramatically, sometimes destabilising the loop.</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Things to try in the lab.</strong> (1) Vary the location of the added zero in Example 2 — move it from $-2$ to $-10$ to $-0.5$ — and observe how the locus reshapes. (2) Try a PI compensator with zero at $-0.1, -0.5, -2$: which one disturbs the original locus least? (3) Add a lead compensator $(s + 1)/(s + 8)$ and see whether you can place the dominant pole at $-2 \\pm j2$ (a much faster response than proportional alone). (4) Replace the plant with $G(s) = 1/[(s+1)^4]$ (excess 4) and watch four asymptotes at $\\pm 45^\\circ, \\pm 135^\\circ$.</p>

<div class="calc-graph"><div id="plot-l4-lead-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> closed-loop step responses at three representative gains for $G = K/[s(s+1)(s+5)]$. $K = 1.5$ (blue, $\\zeta \\approx 0.5$): textbook 16% overshoot, settles in $\\approx 8$ s. $K = 5$ (orange): much more oscillatory. $K = 25$ (red): close to the stability boundary, ringing dominates the response. $K = 30$ (red dashed): pure sustained oscillation at $\\omega = \\sqrt{5}$ — the marginal stability prediction is correct.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function stepResp(K,tEnd,N){
  var dt=tEnd/N;var x1=0,x2=0,x3=0,u=1;var ts=[],ys=[];
  for(var i=0;i<=N;i++){var t=i*dt;ys.push(x3);ts.push(t);
    var dx1=-6*x1+x2;var dx2=-5*x1+x3;var dx3=K*(u-x3);
    x1+=dt*dx1;x2+=dt*dx2;x3+=dt*dx3;
  }
  return{x:ts,y:ys};
}
function clStep(K,tEnd,N){
  var dt=tEnd/N;var y=0,yd=0,ydd=0;var ts=[],ys=[];
  for(var i=0;i<=N;i++){var t=i*dt;ts.push(t);ys.push(y);
    var u=1;var yddd=-6*ydd-5*yd-K*y+K*u;
    y+=dt*yd;yd+=dt*ydd;ydd+=dt*yddd;
  }
  return{x:ts,y:ys};
}
var r1=clStep(1.5,30,3000),r2=clStep(5,30,3000),r3=clStep(25,30,3000),r4=clStep(30,30,3000);
var traces=[
  {x:r1.x,y:r1.y,mode:'lines',line:{color:'#3b82f6',width:2.2},name:'K=1.5 (ζ≈0.5)'},
  {x:r2.x,y:r2.y,mode:'lines',line:{color:'#f59e0b',width:2.2},name:'K=5'},
  {x:r3.x,y:r3.y,mode:'lines',line:{color:'#f87171',width:2.2},name:'K=25 (near limit)'},
  {x:r4.x,y:r4.y,mode:'lines',line:{color:'#f87171',width:1.6,dash:'dash'},name:'K=30 (marginal)'}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'time t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'closed-loop output y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-lead-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-warn"><strong>Where to next.</strong> Root locus is geometric and intuitive but it parameterises by a single scalar $K$. State-space pole placement (covered in a later lesson) generalises this to multi-input/multi-output systems and lets you place <em>every</em> closed-loop pole independently — at the cost of needing a state estimator if you cannot measure every state. Both tools live happily together: root locus for tuning a SISO loop on a bench, pole placement for cleanroom MIMO design.</div>

<p class="l-text"><strong>Recap.</strong> Root locus answers "what does a single gain do to my closed-loop dynamics?" with a complete geometric picture: where every closed-loop pole sits, how fast it moves, when it escapes to instability, and what compensator would re-bend the picture to your needs. With the six sketching rules in hand, the most common SISO design problems collapse to looking at a single diagram.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Kök yer eğrisi (root locus), kapalı-çevrim kutup yerleşimi için grafiksel bir pusuladır.</strong> Bir kez elle çizmeyi öğrendiğinizde, tek bir kazanç düğmesinin — orantılı kazanç $K$'nın — kapalı-çevrim kutuplarını karmaşık düzlemde nereye sürüklediğini, oranlı kontrol bölgesini terk etmeden hangi sönüm oranlarına ulaşılabildiğini ve bir integratör ya da lead ağı eklemenin yasak bir bölgeyi geçmenizi tam olarak ne zaman sağladığını anında görürsünüz. Bode grafikleri size bir seferde tek frekans hakkında bilgi verir; Nyquist size kararlılık marjlarını söyler; kök yer eğrisi ise size, bir parametre süpürdükçe kutupların <em>nerede yaşadığını</em> geometrik olarak gösterir. Müşteri "bu kazançta basamak yanıtı çok salınımlı, donanım eklemeden kritik sönüme daha yakın gelebilir miyiz?" dediğinde başvuracağınız teknik budur.</p>

<p class="l-text">Bu derste şunları öğreneceksiniz: kapalı-çevrim karakteristik denklemi, altı çizim kuralı (dallar, gerçel-eksen parçaları, asimptotlar, kopma noktaları, jω geçişleri, ayrılma açıları), tamamen çözülmüş iki örnek — biri sıfırsız, diğeri sıfırlı — ve bir tasarım gereksiniminden (sönüm, oturma süresi, aşma) sayısal bir $K$ değerini doğrudan kök yer eğrisinden okumak. Bir PI kompansatörü ve bir lead kompansatörü ekleyerek eğrinin yeniden şekillenişini izleyeceğiz; böylece kök yer eğrisi düşüncesi sadece analiz için değil <em>tasarım</em> için de kullanacağınız bir araç olacak.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her birim-geri-besleme konfigürasyonu için kapalı-çevrim karakteristik denklemi $1 + KG(s)H(s) = 0$'ı yazmak ve köklerinin fiziksel anlamını açıklamak</li>
<li>Altı çizim kuralını (dal sayısı, gerçel-eksen parçaları, asimptotlar, ağırlık merkezi, kopma noktaları, jω-ekseni geçişleri) uygulayıp yalnızca açık-çevrim kutup/sıfır verisinden eğriyi çizmek</li>
<li>1. ve 2. Örnekleri ($K/[s(s{+}1)(s{+}5)]$ — sıfırsız ve $-2$'de sıfırlı) baştan sona yürüyerek sıfırın dalları kendine nasıl çektiğini açıklamak</li>
<li>Bir tasarım hedefini (sönüm $\\zeta$, oturma süresi $T_s$, aşma %OS) doğrudan eğri üzerinden okumak ve kapalı-çevrim kutuplarını eğri ile tasarım çizgilerinin kesişimine yerleştiren $K$'yı seçmek</li>
<li>Sadece orantılı kontrolün spesifikasyonu karşılayamadığı durumu fark edip eğriyi olası bölgeye yeniden şekillendiren bir PI veya lead kompansatöre uzanmak</li>
<li>Python'da ($K$ ızgarası üzerinde NumPy <code>np.roots</code>) sayısal bir kök yer eğrisi süpürmesi uygulamak ve Pyodide labında ders kitabı grafiklerini yeniden üretmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Kapalı-Çevrim Karakteristik Denklemi</h2>

<div class="calc-highlight"><strong>Tek bir denklem, tüm geometri.</strong> İleri yolu $KG(s)$, geri-besleme yolu $H(s)$ olan birim-geri-besleme döngüsünü düşünün. Kapalı-çevrim transfer fonksiyonu $T(s) = KG/(1 + KGH)$, ve kapalı-çevrim kutupları tam olarak $1 + KG(s)H(s) = 0$'ın kökleridir. $K$, $0$'dan $\\infty$'ye süpürdükçe bu kökler karmaşık düzlemde sürekli eğriler çizer. <em>Bu eğriler kümesi kök yer eğrisidir.</em></div>

<p class="l-text">Gösterimi sabitleyelim. <em>Açık-çevrim</em> transfer fonksiyonu $L(s) = KG(s)H(s)$'in halihazırda bilinen kutupları ve sıfırları vardır — fiziksel tesisten ve kontrolörden okuduklarınız. Bunlara $\\{p_1, \\dots, p_{n_p}\\}$ ve $\\{z_1, \\dots, z_{n_z}\\}$ diyelim. Kapalı-çevrim karakteristik denklemi:</p>

<div class="calc-formula"><div class="formula-label">KARAKTERİSTİK DENKLEM</div><div class="formula-main">$$1 + K \\, G(s)\\,H(s) \\;=\\; 0 \\quad\\Longleftrightarrow\\quad K \\;=\\; -\\frac{1}{G(s)H(s)} \\;=\\; -\\frac{\\prod_{j}(s - p_j)}{\\prod_{i}(s - z_i)}$$</div><div class="formula-sub">Kapalı-çevrim kutupları, [0, ∞) aralığındaki bir K için bu denklemi sağlayan s değerleridir. Yer eğrisi tüm bu s'lerin kümesidir.</div></div>

<p class="l-text">$K \\ge 0$ reel olduğundan, bir $s$ noktası ancak ve ancak $K \\, G(s)H(s) = -1$ olduğunda yer eğrisi üzerindedir. Genlik ve açı koşullarına ayırmak, her yer eğrisi noktasının uyduğu iki yasayı verir:</p>

<div class="calc-formula"><div class="formula-label">GENLİK VE AÇI KOŞULLARI</div><div class="formula-main">$$|K\\,G(s)H(s)| \\;=\\; 1, \\qquad \\angle\\,G(s)H(s) \\;=\\; (2k+1)\\cdot 180^\\circ, \\quad k \\in \\mathbb{Z}$$</div><div class="formula-sub">Bir aday s ancak ve ancak açık-çevrim sıfırlarından gelen açıların açık-çevrim kutuplarından gelen açılar çıkarılarak elde edilen toplamı 180°'nin tek katı olduğunda yer eğrisi üzerindedir. Onu oraya yerleştiren kazanç ise genlik denkleminden okunur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K = 0</div><div class="card-body">$K = 0$ olduğunda, karakteristik denklem $\\prod_j (s - p_j) = 0$ olur. Kapalı-çevrim kutupları açık-çevrim kutuplarıyla çakışır. Her dal bir açık-çevrim kutbunda <em>başlar</em>.</div></div>
<div class="calc-card"><div class="card-title">K → ∞</div><div class="card-body">$K \\to \\infty$ olduğunda denklem $\\prod_i (s - z_i) = 0$'ı zorlar. Dallar açık-çevrim sıfırlarında <em>biter</em> — sıfır sayısı kutup sayısından azsa "sonsuzdaki sıfırlar" da dahil.</div></div>
<div class="calc-card"><div class="card-title">"Dal" ne demek</div><div class="card-body">Bir dal, $K$ değiştikçe $n_p$ kapalı-çevrim kutbundan birinin çizdiği sürekli eğridir. Tam olarak $\\max(n_p, n_z)$ dal vardır; pratikte $n_p \\ge n_z$, dolayısıyla sayım $n_p$'ye eşittir.</div></div>
<div class="calc-card"><div class="card-title">Kararlılık bağı</div><div class="card-body">Verilen bir $K$ için tesisat ancak ve ancak o $K$'daki tüm dallar sol yarı-düzlemde yatıyorsa kapalı-çevrim kararlıdır. Sağ yarı-düzleme geçiş kararsızlık demektir — o geçiş tasarım sınırıdır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l4-cl-poles-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aynı tesisat $G(s) = 1/[s(s{+}1)(s{+}5)]$, dört temsili kazançta. Üç kapalı-çevrim kutbu (büyük noktalar) $K=0$ iken açık-çevrim kutupları $0, -1, -5$'te oturuyor, $K$ büyüdükçe birbirine doğru kayıyor, gerçel eksende çarpışıyor, sonra karmaşık eşlenik çifte ayrılıp sağ yarı-düzleme tırmanıyor. Ardışık anlık görüntüleri bağlayan sürekli eğriler kök yer eğrisidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ks=[0,0.5,1.5,3,5,8,12,18,25,35,50,70,100];
function rootsAtK(K){
  var a=[1,6,5,K];
  var roots=[];
  if(K<0.01){return[{re:0,im:0},{re:-1,im:0},{re:-5,im:0}];}
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;
  for(var i=0;i<50;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-9)break;}
  var r1=x;
  var b1=1,b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var snapshots=[];
Ks.forEach(function(K){var r=rootsAtK(K);snapshots.push({K:K,r:r});});
var traces=[];
var colors=['#3b82f6','#10b981','#f59e0b'];
[0,1,2].forEach(function(idx){
  var xs=[],ys=[];snapshots.forEach(function(sn){xs.push(sn.r[idx].re);ys.push(sn.r[idx].im);});
  traces.push({x:xs,y:ys,mode:'lines',line:{color:colors[idx],width:2},name:'dal '+(idx+1)});
});
[0,Ks.length-1].forEach(function(j){
  snapshots[j].r.forEach(function(rt,k){
    traces.push({x:[rt.re],y:[rt.im],mode:'markers',marker:{size:11,color:colors[k],symbol:j===0?'x':'circle',line:{color:'#fff',width:1}},showlegend:false,hoverinfo:'skip'});
  });
});
traces.push({x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'açık-çevrim kutuplar (K=0)'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-6,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-4,x1:0,y1:4,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-cl-poles-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Bu derste her sonuç bu iki skaler koşulun sonucudur. Bölüm 2'deki çizim kuralları yalnızca açı koşulunun sağlandığı noktaları bulmak için kestirme yollardır, ve geometrinin belirli niteliksel özellikleri (gerçel-eksen parçaları, asimptotlar, kopma noktaları) nasıl zorladığını anlamamızı sağlar.</p>

<h2 class="lesson-title">2. Çizim İçin Altı Kural</h2>

<div class="calc-highlight"><strong>Kalem-kâğıt tarifi.</strong> $G(s)H(s)$'in açık-çevrim kutuplarını ve sıfırlarını bildiğinizde, tek bir polinom çözmeden birkaç dakikada eğriyi çizebilirsiniz. Aşağıdaki kurallar yaklaşıklık değildir — açı koşulunun kesin sonuçlarıdır ve MATLAB'i açmadan önce sayısal bir grafiği doğrulamanıza ya da onu önceden tahmin etmenize olanak verir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kural 1 — Dal sayısı</div><div class="card-body">Tam olarak $N = \\max(n_p, n_z)$ dal vardır, her kapalı-çevrim kutbu için bir tane. Hemen her ilgili tesisat için $n_p \\ge n_z$, yani $N = n_p$. Dallar gerçel eksene göre simetriktir çünkü gerçel-katsayılı polinomlar karmaşık-eşlenik köklere sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Kural 2 — Başlangıçlar ve bitişler</div><div class="card-body">Her dal bir açık-çevrim kutbunda başlar (K=0) ve bir açık-çevrim sıfırında biter (K→∞). $n_p - n_z$ "eksik" sıfır sonsuzdadır; o kadar dal asimptotlar boyunca sonsuza kaçar (Kural 4).</div></div>
<div class="calc-card"><div class="card-title">Kural 3 — Gerçel-eksen parçaları</div><div class="card-body">Gerçel eksen üzerindeki bir nokta, ancak ve ancak sağında <em>tek</em> sayıda gerçel-eksen kutup ve sıfır toplamı varsa yer eğrisi üzerindedir. Bu doğrudan 180° açı koşulundan gelir: karmaşık-eşlenik çiftlerden gelen katkılar birbirini iptal eder, soldaki gerçel-eksen kutup/sıfırları 0° katkı verir, sağdakiler 180° katkı verir.</div></div>
<div class="calc-card"><div class="card-title">Kural 4 — Asimptot açıları</div><div class="card-body">$n_p - n_z$ dal $\\theta_k = \\frac{(2k+1)\\cdot 180^\\circ}{n_p - n_z}, \\; k = 0, 1, \\dots, n_p - n_z - 1$ açılarındaki asimptotlar boyunca sonsuza gider. Fazlalık 3 için (üç kutup, sıfır yok): asimptotlar $\\pm 60^\\circ$ ve $180^\\circ$'de.</div></div>
<div class="calc-card"><div class="card-title">Kural 5 — Ağırlık merkezi</div><div class="card-body">Tüm asimptotlar gerçel ekseni $\\sigma_a = \\dfrac{\\sum_j p_j - \\sum_i z_i}{n_p - n_z}$ ağırlık merkezinde keser. Çalışan örneğimiz $G = 1/[s(s{+}1)(s{+}5)]$ için: $\\sigma_a = (0 - 1 - 5)/3 = -2$.</div></div>
<div class="calc-card"><div class="card-title">Kural 6 — Kopma ve birleşme noktaları</div><div class="card-body">İki dalın gerçel eksende çarpışıp karmaşık düzleme atladığı (kopma) veya geri birleştiği (birleşme) yerlerde $dK/ds = 0$. $K(s) = -1/[G(s)H(s)]$ yazıp türev alın, çözün.</div></div>
</div>

<p class="l-text"><strong>Sıkça önemli olan iki alt-kural daha.</strong> <em>jω-ekseni geçişi</em> (dalın sol yarı-düzlemden sağa geçtiği yer; kritik kazancı $K_\\text{kr}$'yi tanımlar) ya karakteristik polinom üzerinde Routh-Hurwitz ile ya da karakteristik denkleme $s = j\\omega$ yerleştirip $\\omega$ ile $K$'yı birlikte çözerek bulunur. Karmaşık bir kutup $p^*$'tan <em>ayrılma açısı</em> $\\theta_a = 180^\\circ - \\sum_{j\\ne *} \\angle(p^* - p_j) + \\sum_i \\angle(p^* - z_i)$, ve karmaşık açık-çevrim kutuplarının yakınında eğriyi taslakla çizmek için kullanılır.</p>

<div class="calc-graph"><div id="plot-l4-rules-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $G(s) = K/[s(s{+}1)(s{+}5)]$ için elle üreteceğiniz niteliksel taslak. Açık-çevrim kutuplar $0$, $-1$, $-5$'te (mavi ×). Gerçel-eksen parçaları kalın mavi aralıklar. Üç asimptot (kesik) ağırlık merkezi $\\sigma_a = -2$'den $\\pm 60^\\circ$ ve $180^\\circ$ açılarda çıkıyor. $s \\approx -0.473$ yakınındaki bir kopma iki dalı karmaşık düzleme fırlatıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var poles={x:[0,-1,-5],y:[0,0,0]};
var realSeg1={x:[-1,0],y:[0,0]};
var realSeg2={x:[-7,-5],y:[0,0]};
var sigma_a=-2;
function asymp(angDeg,L){var t=angDeg*Math.PI/180;return{x:[sigma_a,sigma_a+L*Math.cos(t)],y:[0,L*Math.sin(t)]};}
var a1=asymp(60,7),a2=asymp(-60,7),a3=asymp(180,5);
var breakaway={x:[-0.473],y:[0]};
var traces=[
  {x:realSeg1.x,y:realSeg1.y,mode:'lines',line:{color:'#3b82f6',width:5},name:'gerçel-eksen parçaları'},
  {x:realSeg2.x,y:realSeg2.y,mode:'lines',line:{color:'#3b82f6',width:5},showlegend:false},
  {x:a1.x,y:a1.y,mode:'lines',line:{color:'rgba(245,158,11,0.7)',dash:'dash',width:1.5},name:'asimptotlar'},
  {x:a2.x,y:a2.y,mode:'lines',line:{color:'rgba(245,158,11,0.7)',dash:'dash',width:1.5},showlegend:false},
  {x:a3.x,y:a3.y,mode:'lines',line:{color:'rgba(245,158,11,0.7)',dash:'dash',width:1.5},showlegend:false},
  {x:poles.x,y:poles.y,mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'açık-çevrim kutuplar'},
  {x:[sigma_a],y:[0],mode:'markers+text',marker:{size:9,color:'#f59e0b',symbol:'square'},text:['σ_a=-2'],textposition:'bottom center',showlegend:false},
  {x:breakaway.x,y:breakaway.y,mode:'markers+text',marker:{size:9,color:'#10b981',symbol:'diamond'},text:['kopma ≈ -0.473'],textposition:'top center',showlegend:false}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-5,5],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-rules-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Asimptotlar — Dallar Yüksek Kazançta Nereye Gider</h2>

<div class="calc-highlight"><strong>Çok büyük $|s|$ için eğri asimptotlarına benzer.</strong> $|s|$ her $|p_j|$ ve $|z_i|$'den çok büyük olduğunda açık-çevrim transfer fonksiyonu $G(s)H(s) \\approx s^{n_z - n_p}$ gibi davranır. Bunu açı koşuluna $\\angle G(s)H(s) = (2k+1) \\cdot 180^\\circ$ yerleştirip asimptot açılarını doğrudan türetin.</div>

<p class="l-text">Türetme: büyük $|s|$ için $L(s) \\approx s^{n_z - n_p}$ olduğundan, açı koşulu $(n_z - n_p)\\angle s = (2k+1)\\cdot 180^\\circ$ olur, dolayısıyla $\\angle s = \\theta_k = \\frac{(2k+1)\\cdot 180^\\circ}{n_p - n_z}$. Her farklı $\\theta_k$ bir asimptot ışını verir. $n_p - n_z = 1$ için tek asimptot negatif gerçel eksendir ($\\theta_0 = 180^\\circ$). $n_p - n_z = 2$ için iki asimptot $\\pm 90^\\circ$'de. $n_p - n_z = 3$ için $\\pm 60^\\circ, 180^\\circ$'de üç tane. $n_p - n_z = 4$ için $\\pm 45^\\circ, \\pm 135^\\circ$'de dört tane.</p>

<div class="calc-formula"><div class="formula-label">AĞIRLIK MERKEZİ FORMÜLÜ</div><div class="formula-main">$$\\sigma_a \\;=\\; \\frac{\\sum_{j=1}^{n_p} p_j \\;-\\; \\sum_{i=1}^{n_z} z_i}{n_p - n_z}$$</div><div class="formula-sub">Tüm asimptotların ortak kesişim noktasının gerçel bileşeni. L(s)'in sonsuzdaki bir-sonraki-baskın teriminin eşleştirilmesinden türetilir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çözüm: 3 kutup, 0 sıfır</div><div class="card-body">$G(s) = K/[s(s{+}1)(s{+}5)]$. $n_p - n_z = 3$. Açılar $\\pm 60^\\circ, 180^\\circ$. $\\sigma_a = (0 - 1 - 5)/3 = -2$. İki dal yüksek kazançta sağ yarı-düzleme doğru asimptotlanır — sistem kararsızlaşır.</div></div>
<div class="calc-card"><div class="card-title">Çözüm: 3 kutup, 1 sıfır</div><div class="card-body">$G(s) = K(s{+}2)/[s(s{+}1)(s{+}5)]$. $n_p - n_z = 2$. Açılar $\\pm 90^\\circ$. $\\sigma_a = (-1 - 5 + 2)/2 = -2$. İki dal dikey asimptotlanır; sıfır bir dalı "soğurur" (sonsuza kaçmak yerine $s = -2$'de biter).</div></div>
<div class="calc-card"><div class="card-title">Neden fazlalık-3 tesisat tehlikeli</div><div class="card-body">Fazlalık 3+ en az bir asimptotun sağ yarı-düzlemde olmasını garanti eder (çünkü en az bir $\\theta_k \\in (-90^\\circ, 90^\\circ)$). Bu sistemler yeterince yüksek $K$'da <em>her zaman</em> kararsızlaşır — döngünün salındığı bir kritik kazanç vardır. RHP kutbu olmayan fazlalık-2 her pozitif $K$ için koşullu kararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Sonsuzda sağlama</div><div class="card-body">Asimptot sayısını yanlış hesaplarsanız eğri kapanmaz. Her zaman yeniden doğrulayın: sonsuza kaçan dal sayısı = $n_p - n_z$.</div></div>
</div>

<h2 class="lesson-title">4. Kopma ve Birleşme Noktaları</h2>

<div class="calc-highlight"><strong>İki dalın gerçel eksende buluşup karmaşık düzleme atladığı yer.</strong> Kopma, gerçel-eksen parçası üzerinde $s$ hareket ederken $K$'nın bir yerel maksimumudur; birleşme ise iki karmaşık dalın gerçel eksene döndüğü yerel minimumdur. Her ikisi de $dK/ds = 0$'ı sağlar, bu da $s$ için bir polinom denklemi verir.</div>

<p class="l-text">Karakteristik denklemden $K(s) = -1/[G(s)H(s)] = -\\prod_j (s - p_j) / \\prod_i (s - z_i)$. $s$'e göre türev alın ve sıfıra eşitleyin. Eşdeğeri ve genelde daha kolay olanı: karakteristik polinomu $D(s) + K\\,N(s) = 0$ olarak yazın ($D(s) = \\prod_j(s-p_j)$, $N(s) = \\prod_i(s-z_i)$), sonra $D'(s)N(s) - D(s)N'(s) = 0$'ı uygulayın. Bu polinomun, yer eğrisinin <em>gerçel-eksen parçası</em> üzerinde olan reel kökleri kopma/birleşme noktalarıdır.</p>

<div class="calc-formula"><div class="formula-label">KOPMA KOŞULU</div><div class="formula-main">$$\\frac{dK}{ds} \\;=\\; 0 \\quad\\Longleftrightarrow\\quad \\frac{D'(s)}{D(s)} \\;=\\; \\frac{N'(s)}{N(s)} \\quad\\Longleftrightarrow\\quad \\sum_{j} \\frac{1}{s - p_j} \\;=\\; \\sum_{i} \\frac{1}{s - z_i}$$</div><div class="formula-sub">3-kutuplu 0-sıfırlı örneğimizde sağ taraf sıfır, dolayısıyla 1/s + 1/(s+1) + 1/(s+5) = 0 çözülür.</div></div>

<p class="l-text"><strong>$G = K/[s(s{+}1)(s{+}5)]$ için çözülmüş kopma.</strong> Toplamı sıfıra koyup $s(s+1)(s+5)$ ile çarpmak $(s+1)(s+5) + s(s+5) + s(s+1) = 0 \\Rightarrow 3s^2 + 12s + 5 = 0$ verir. Diskriminant $144 - 60 = 84$, dolayısıyla $s = (-12 \\pm \\sqrt{84})/6 \\approx -0.473$ ya da $-3.527$. Yalnızca $s \\approx -0.473$ eğri parçası $[-1, 0]$ üzerinde, yani o koparma noktasıdır. Eşlik kök $-3.527$ ise $-5$ ile $-1$ arasında yatıyor; bu bir yer eğrisi parçası <em>değildir</em> (Kural 3), dolayısıyla sahte bir çözümdür ve atılır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sahte kökleri ayıkla</div><div class="card-body">Kopma adayını her zaman gerçel-eksen-parçası kuralına karşı çapraz kontrol edin. Türev denkleminin yer eğrisi üzerinde olmayan çözümleri olabilir; reddedilmelidir.</div></div>
<div class="calc-card"><div class="card-title">Kopma kazancı</div><div class="card-body">$s_k$ bilindiğinde kopmadaki kazanç $K_k = -1/[G(s_k)H(s_k)]$. Örneğimizde $K_k \\approx 1.13$.</div></div>
<div class="calc-card"><div class="card-title">Kopmadan ayrılma açısı</div><div class="card-body">Bir kopmada $m$ dal buluşursa eşit aralıklı açılarla ayrılırlar: ardışık ayrılışlar arasında $\\Delta\\theta = 360^\\circ / m$, ilk ışın açı koşulunda. Gerçel eksen üzerindeki basit iki-dallı kopma için: $\\pm 90^\\circ$ — dallar eksene dik ayrılır.</div></div>
<div class="calc-card"><div class="card-title">Sayısal alternatif</div><div class="card-body">Polinom karışıksa $K$'yı sayısal olarak süpürün, kökleri <code>numpy.roots</code> ile hesaplayın ve ardışık kök kümelerinin yalnızca-reel'den karmaşığa geçtiği yeri bulun. Bölüm 10'daki Pyodide labı tam olarak bunu yapar.</div></div>
</div>

<h2 class="lesson-title">5. jω-Ekseni Geçişi — Döngünün Kararsızlaştığı Yer</h2>

<div class="calc-highlight"><strong>Kritik kazanç $K_\\text{kr}$.</strong> Eğri sanal ekseni geçtiğinde, bir kapalı-çevrim kutbunun reel bileşeni sıfır olur: döngü kararlılığın sınırındadır. Geçiş frekansı $\\omega_\\text{kr}$, kapalı-çevrimin salındığı frekanstır (sürekli sinüs). $(K_\\text{kr}, \\omega_\\text{kr})$'yi bulmanın iki yolu: Routh-Hurwitz veya doğrudan $s = j\\omega$ yerleştirme.</div>

<p class="l-text"><strong>Çalışan örnekte Routh-Hurwitz.</strong> Karakteristik polinom: $s^3 + 6s^2 + 5s + K = 0$. Routh dizisi:</p>

<div class="calc-formula"><div class="formula-label">ROUTH DİZİSİ</div><div class="formula-main">$$\\begin{array}{c|cc} s^3 & 1 & 5 \\\\ s^2 & 6 & K \\\\ s^1 & \\dfrac{30 - K}{6} & 0 \\\\ s^0 & K & 0 \\end{array}$$</div><div class="formula-sub">Kararlılık için tüm ilk-sütun girdileri pozitif olmalı. s¹ girdisi K = 30'da kaybolur; bu kritik kazançtır.</div></div>

<p class="l-text">$K = K_\\text{kr} = 30$'da, $s^2$ satırından yardımcı polinom $6s^2 + 30 = 0$, yani $s = \\pm j\\sqrt{5}$ — geçişler $\\omega = \\sqrt{5} \\approx 2.236\\,\\text{rad/s}$'de. <em>Yerleştirme ile doğrulama:</em> $s = j\\omega$'yi $s^3 + 6s^2 + 5s + K = 0$'a yerleştirin: $-j\\omega^3 - 6\\omega^2 + 5j\\omega + K = 0$. Reel kısım: $K - 6\\omega^2 = 0$. Sanal kısım: $-\\omega^3 + 5\\omega = 0 \\Rightarrow \\omega^2 = 5$. Dolayısıyla $\\omega = \\sqrt{5}, \\; K = 30$.</p>

<div class="calc-graph"><div id="plot-l4-jw-cross-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $G = K/[s(s{+}1)(s{+}5)]$'in iki karmaşık dalı $K=0$'dan $K=60$'a süpürülmüş. $K = K_\\text{kr} = 30$'da sanal ekseni $\\pm j\\sqrt{5} \\approx \\pm j2.24$'te geçerler. $K < 30$ için döngü kararlı; $K > 30$ için kararsız (RHP'de kutup). Geçiş frekansı, kapalı-çevrimin sınırda salındığı frekanstır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function rootsAtK(K){
  var a=[1,6,5,K];
  var roots=[];
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;
  for(var i=0;i<60;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-10)break;}
  var r1=x;
  var b1=1,b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var Ks=[];for(var i=0;i<=200;i++){Ks.push(i*0.3);}
var b1x=[],b1y=[],b2x=[],b2y=[],b3x=[],b3y=[];
Ks.forEach(function(K){var r=rootsAtK(K);
  b1x.push(r[0].re);b1y.push(r[0].im);
  b2x.push(r[1].re);b2y.push(r[1].im);
  b3x.push(r[2].re);b3y.push(r[2].im);
});
var traces=[
  {x:b1x,y:b1y,mode:'lines',line:{color:'#3b82f6',width:2.2},name:'dal 1'},
  {x:b2x,y:b2y,mode:'lines',line:{color:'#10b981',width:2.2},name:'dal 2'},
  {x:b3x,y:b3y,mode:'lines',line:{color:'#f59e0b',width:2.2},name:'dal 3'},
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'açık-çevrim kutuplar'},
  {x:[0,0],y:[Math.sqrt(5),-Math.sqrt(5)],mode:'markers+text',marker:{size:11,color:'#f87171',symbol:'circle-open',line:{width:2.5}},text:['K_kr=30','K_kr=30'],textposition:'middle right',showlegend:false}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-4,x1:0,y1:4,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-jw-cross-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pratik çıkarım.</strong> Eğriye ve kritik kazanca sahip olduğunuzda, her saf-orantılı tasarımda $K$ için bir üst sınırınız vardır. Tesisat belirsizliğine yer bırakmak için sıklıkla kritik kazancın %50'sini veren bir $K$ seçersiniz (kazanç marjı 2, veya 6 dB).</div>

<h2 class="lesson-title">6. Örnek 1 — $G(s) = K/[s(s{+}1)(s{+}5)]$</h2>

<p class="l-text">Bu kök yer eğrisi pratiği için klasik ders kitabı tesisatıdır. Tam çizimi yapalım.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Envanter</div><div class="card-body">Açık-çevrim kutuplar: $0, -1, -5$. Açık-çevrim sıfırları: yok. $n_p = 3$, $n_z = 0$, fazlalık 3. Üç dal.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Gerçel-eksen parçaları</div><div class="card-body">Tek-sayım kuralını uygulayın. $0$ ile $-1$ arası: sağda bir kutup (yani $0$'ın hemen solunda durduğumuzda sağımızda $0$ kutbu) → sayım = 1 (tek) → eğri üzerinde. $(-5, -1)$ aralığında: sağda $0, -1$ kutupları → sayım 2 → değil. $(-\\infty, -5)$ aralığında: sağda üç kutup → sayım 3 → eğri üzerinde.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Asimptotlar</div><div class="card-body">$\\pm 60^\\circ, 180^\\circ$'de üç asimptot. Ağırlık merkezi $\\sigma_a = (0 - 1 - 5)/3 = -2$. Bir asimptot $\\sigma_a$'dan negatif gerçel eksen boyunca koşar; diğer ikisi $60^\\circ$ açıyla yukarı ve aşağı gider.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — Kopma</div><div class="card-body">$1/s + 1/(s+1) + 1/(s+5) = 0 \\Rightarrow 3s^2 + 12s + 5 = 0$'ı çözün. Kökler $\\approx -0.473, -3.527$. Yalnızca $-0.473$ yer eğrisi üzerinde, dolayısıyla kopmadır. İki dal $\\pm 90^\\circ$'de ayrılır.</div></div>
<div class="calc-card"><div class="card-title">Adım 5 — jω geçişi</div><div class="card-body">Routh: $K_\\text{kr} = 30$, $\\omega = \\sqrt{5}$. Dolayısıyla dallar RHP'ye yalnızca $K > 30$ olduğunda geçer.</div></div>
<div class="calc-card"><div class="card-title">Adım 6 — Taslak</div><div class="card-body">$0$'dan dal sola $-0.473$'e hareket eder. $-1$'den dal sağa $-0.473$'e gider. Buluşurlar, karmaşık çifte ayrılırlar, yukarı/aşağı giderler, sonra dışa doğru $\\pm 60^\\circ$ asimptotlarına kavisli olarak yönelirler, $K = 30$ iken jω-eksenini $\\pm j\\sqrt{5}$'te geçerler. $-5$'ten dal gerçel eksen boyunca $-\\infty$'a $180^\\circ$ asimptotu boyunca gider.</div></div>
</div>

<p class="l-text"><strong>Tasarım egzersizi: $\\zeta = 0.5$ için $K$ seç.</strong> Sabit-sönüm yer eğrisi orijinden çıkan, pozitif gerçel eksenden $\\theta = 180^\\circ - \\arccos(0.5) = 120^\\circ$ açıdaki ışındır. Kapalı-çevrim kutuplarının yer eğrisinin bu ışınla kesişimine düşmesini istiyoruz. Sayısal olarak bu $K \\approx 1.5$ iken $s \\approx -0.42 \\pm j 0.73$'te olur. Üçüncü (reel) kutup $\\approx -5.16$'da oturur — baskın çiftten uzakta, dolayısıyla basamak yanıtına etkisi küçüktür.</p>

<div class="calc-graph"><div id="plot-l4-zeta-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aynı kök yer eğrisi, $\\zeta = 0.5$ tasarım çizgisi kırmızı kesik olarak çizilmiş. Kesişim (kırmızı daire) istenen sönümde kapalı-çevrim kutuplarını verir; karşılık gelen $K$ genlik koşulundan okunur. Daha açık kırmızı ikinci bir çizgi karşılaştırma için $\\zeta = 0.7$'i gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function rootsAtK(K){
  var a=[1,6,5,K];var roots=[];
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;for(var i=0;i<60;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-10)break;}
  var r1=x;
  var b1=1,b2=a[1]+r1*b1,b3=a[2]+r1*b2;var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var Ks=[];for(var i=0;i<=200;i++){Ks.push(i*0.3);}
var b1x=[],b1y=[],b2x=[],b2y=[],b3x=[],b3y=[];
Ks.forEach(function(K){var r=rootsAtK(K);
  b1x.push(r[0].re);b1y.push(r[0].im);b2x.push(r[1].re);b2y.push(r[1].im);b3x.push(r[2].re);b3y.push(r[2].im);
});
function zetaLine(z,L){var phi=Math.acos(z);return{x:[0,-L*Math.cos(phi),null,0,-L*Math.cos(phi)],y:[0,L*Math.sin(phi),null,0,-L*Math.sin(phi)]};}
var z5=zetaLine(0.5,4),z7=zetaLine(0.7,4);
var traces=[
  {x:b1x,y:b1y,mode:'lines',line:{color:'#3b82f6',width:2},name:'yer eğrisi'},
  {x:b2x,y:b2y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:b3x,y:b3y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:z5.x,y:z5.y,mode:'lines',line:{color:'#f87171',width:2,dash:'dash'},name:'ζ=0.5'},
  {x:z7.x,y:z7.y,mode:'lines',line:{color:'rgba(248,113,113,0.45)',width:2,dash:'dot'},name:'ζ=0.7'},
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:14,color:'#3b82f6',symbol:'x',line:{width:2}},name:'açık-çevrim kutuplar'},
  {x:[-0.42,-0.42],y:[0.73,-0.73],mode:'markers+text',marker:{size:10,color:'#10b981',symbol:'circle',line:{color:'#fff',width:1}},text:['K≈1.5',''],textposition:'top right',showlegend:false}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-6,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-zeta-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Örnek 2 — $s = -2$'de Sıfır Ekleme</h2>

<div class="calc-highlight"><strong>Sıfırlar yer eğrisini kendilerine çeker.</strong> Tesisatı $G(s) = K(s+2)/[s(s+1)(s+5)]$ ile değiştirin. Artık $n_z = 1$, $n_p - n_z = 2$. Eskiden sonsuza kaçan bir dal artık $s = -2$'deki sıfırda biter. Asimptot açıları $\\pm 60^\\circ, 180^\\circ$'den $\\pm 90^\\circ$'ye değişir. Ağırlık merkezi kayar.</div>

<p class="l-text">Envanter: kutuplar $\\{0, -1, -5\\}$, sıfır $\\{-2\\}$. Üç dal; ikisi dikey asimptotlar boyunca ($\\pm 90^\\circ$ açıları) sonsuza gider ve biri $s = -2$'de biter. Ağırlık merkezi: $\\sigma_a = (0 - 1 - 5 - (-2))/2 = -4/2 = -2$. Tesadüfen asimptot <em>sıfırda</em> başlar.</p>

<p class="l-text"><strong>Gerçel-eksen parçaları.</strong> Eklenen sıfırla tek-sayım kuralını uygulayın. $(-1, 0)$ aralığında: sağda $0$ kutbu → sayım 1 (tek) → eğri üzerinde. $(-2, -1)$ aralığında: sağda $0, -1$ kutupları → sayım 2 → değil. $(-5, -2)$ aralığında: sağda $0, -1$ kutupları ve $-2$ sıfırı → sayım 3 → eğri üzerinde. $(-\\infty, -5)$ aralığında: dördü de → sayım 4 → değil (bu Örnek 1'den bir tersine dönüş!).</p>

<p class="l-text"><strong>Eğri niteliksel olarak nasıl değişir.</strong> Sıfır $s = -5$'ten dalı "soğurur"; bu dal artık gerçel eksen boyunca sağa hareket edip $s = -2$'de biter, sonsuza kaybolmak yerine. Diğer iki dal hâlâ $0$ ile $-1$ arasındaki bir kopmada buluşur (şimdi sıfıra daha yakın, $s \\approx -0.45$ civarında), ayrılır ve $60^\\circ$ yerine dikey olarak yönelir. <em>Sonuç çok daha "uysal" bir yer eğrisidir</em> — dallar geniş bir $K$ aralığı için sol yarı-düzlemde kalır, çoğu zaman tüm $K > 0$ için. Sistem orantılı kontrol + eklenen sıfırla tam olarak kararlılaştırılmıştır.</p>

<div class="calc-graph"><div id="plot-l4-with-zero-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> iki yer eğrisi üst üste. Mavi: $G = K/[s(s{+}1)(s{+}5)]$ (Örnek 1 — $K = 30$'da RHP'ye kaçar). Turuncu: $G = K(s{+}2)/[s(s{+}1)(s{+}5)]$ (Örnek 2 — dallar tüm $K > 0$ için LHP'de kalır, sıfırda veya $\\pm j\\infty$'da biterler). Sıfır ekleme küçük bir analitik değişikliktir, kararlılaştırıcı etkisi dramatiktir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function roots3(a){
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;
  for(var i=0;i<80;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-10)break;}
  var r1=x;
  var b1=a[0],b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);return[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  var s=Math.sqrt(-disc);return[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];
}
function rootsEx1(K){return roots3([1,6,5,K]);}
function rootsEx2(K){return roots3([1,6,5+K,2*K]);}
var Ks=[];for(var i=0;i<=200;i++){Ks.push(i*0.4);}
var e1=[[],[],[]],e2=[[],[],[]];
Ks.forEach(function(K){var r=rootsEx1(K);e1[0].push(r[0]);e1[1].push(r[1]);e1[2].push(r[2]);var r2=rootsEx2(K);e2[0].push(r2[0]);e2[1].push(r2[1]);e2[2].push(r2[2]);});
function trace(arr,col,name,sh){return{x:arr.map(function(r){return r.re;}),y:arr.map(function(r){return r.im;}),mode:'lines',line:{color:col,width:2,dash:sh},name:name};}
var traces=[
  trace(e1[0],'#3b82f6','Örnek 1 (sıfırsız)',null),
  trace(e1[1],'#3b82f6',null,null),
  trace(e1[2],'#3b82f6',null,null),
  trace(e2[0],'#f59e0b','Örnek 2 (sıfır -2)','dash'),
  trace(e2[1],'#f59e0b',null,'dash'),
  trace(e2[2],'#f59e0b',null,'dash'),
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:13,color:'#cbd5e1',symbol:'x',line:{width:2}},name:'açık-çevrim kutuplar'},
  {x:[-2],y:[0],mode:'markers',marker:{size:13,color:'#10b981',symbol:'circle-open',line:{width:2.5}},name:'sıfır (Örnek 2)'}
];
traces[1].showlegend=false;traces[2].showlegend=false;traces[4].showlegend=false;traces[5].showlegend=false;
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-5,5],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-5,x1:0,y1:5,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-with-zero-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Bir Spesifikasyon İçin Tasarım</h2>

<div class="calc-highlight"><strong>Gereksinimden kazanca üç adımda.</strong> Müşteri "oturma süresi $T_s \\le 8$ s, aşma $\\le \\%5$" diyor. Kapalı-çevrim kutupları üzerindeki kısıtlara çevirin, sonra eğrinin olası bölgeden geçip geçmediğini kontrol edin. Geçiyorsa $K$'yı okuyun. Geçmiyorsa bir kompansatör ekleyin.</div>

<p class="l-text">Standart ikinci-mertebe yaklaşımları geçici özellikleri baskın-kutup parametrelerine bağlar. Sönüm $\\zeta$ ve doğal frekans $\\omega_n$ ile $-\\sigma \\pm j\\omega_d$ baskın karmaşık kutupları için:</p>

<div class="calc-formula"><div class="formula-label">TASARIM ÇEVİRİLERİ</div><div class="formula-main">$$T_s \\;\\approx\\; \\frac{4}{\\zeta \\omega_n} \\;=\\; \\frac{4}{\\sigma}, \\qquad \\%\\text{OS} \\;=\\; 100 \\, e^{-\\zeta \\pi / \\sqrt{1-\\zeta^2}}, \\qquad T_p \\;=\\; \\frac{\\pi}{\\omega_d}$$</div><div class="formula-sub">Oturma süresi (%4 ölçütü), yüzde aşma, ikinci-mertebe sönümlü basamak yanıtının zirve süresi.</div></div>

<p class="l-text"><strong>Çözüm.</strong> $T_s \\le 8$ s ⇒ $\\sigma \\ge 0.5$ (kutbun reel kısmı ≤ -0.5 olmalı). $\\%\\text{OS} \\le \\%5$ ⇒ $\\zeta \\ge 0.69$ (aşma formülünü tersleyin). $s$-düzleminde bunlar iki kısıt çizer: oturma süresi için dikey çizgi $\\text{Re}(s) = -0.5$ (kutuplar onun solunda olmalı) ve aşma için orijinden negatif gerçel eksenden $\\arccos(0.69) \\approx 46.4^\\circ$ açıyla iki ışın (kutuplar koni içinde olmalı). Olası bölge kesişimdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Kısıtları çiz</div><div class="card-body">Yer eğrisiyle aynı grafiğe oturma süresi için dikey çizgiyi ve aşma için sönüm konisini çizin. Olası bölge $s$-düzleminin her ikisini de sağlayan kısmıdır.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Eğri-olası kesişimi</div><div class="card-body">Yer eğrisi olası bölgeden geçiyorsa, kesişim üzerindeki herhangi bir noktayı seçin ve genlik koşulundan $K$'yı okuyun: $K = 1/|G(s)|$. Birden çok nokta uygun değerse, istenen doğal frekansa yakın olanı tercih edin.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Simülasyonla doğrula</div><div class="card-body">İkinci-mertebe yaklaşımı baskın bir karmaşık çift varsayar. Seçilen $K$'da kapalı-çevrim basamak yanıtını her zaman çizin ve gerçek aşma ile oturma süresini doğrulayın. Baskın olmayan kutuplar veya sıfırlar yanıtı hedeften saparsa düzeltin.</div></div>
<div class="calc-card"><div class="card-title">Kesişim yoksa</div><div class="card-body">Orantılı kontrol spesifikasyonu karşılayamaz. Eğriyi olası bölgeden geçecek şekilde <em>yeniden şekillendirecek</em> bir kompansatöre (PI, lead, lag, PID) ihtiyacınız var. Bölüm 9 örneğimiz için bunu adım adım gösterir.</div></div>
</div>

<h2 class="lesson-title">9. Kök Yer Eğrisi ile Kompansatör Tasarımı</h2>

<div class="calc-highlight"><strong>Kutup ve sıfır eklemek eğriyi büker.</strong> Orantılı kontrol kapalı-çevrim kutuplarını spesifikasyonların istediği yere yerleştiremiyorsa, tesisat ile seri bir kompansatör $C(s)$ ekleyin. Eğri artık genişletilmiş açık-çevrim transfer fonksiyonu $K\\,C(s)G(s)H(s)$ için çizilir. PI kontrolör orijinde bir kutup ve LHP'de bir sıfır ekler; lead kontrolör bir sıfır ve daha hızlı bir kutup ekler; lag bunları kutbu orijine daha yakın olacak şekilde ekler.</div>

<p class="l-text"><strong>PI kontrolör: $C(s) = K_p + K_i/s = K(s + a)/s$.</strong> Net etki: $s = 0$'da bir kutup (serbest integratör) ve $s = -a$'da bir sıfır ekleyin. Orijindeki kutup eğriyi sağa çeker (sıfırı doğru yere koyarak telafi ettiğiniz kararsızlaştırıcı etki). Ders kitabı PI için $a$'yı küçük seçin (sıfır orijine yakın): baskın bölge yakınında eğri PI olmadan neredeyse aynı görünür, ancak bir basamağa sıfır kalıcı-durum hatası kazanırsınız.</p>

<p class="l-text"><strong>Lead kontrolör: $C(s) = K(s + z)/(s + p)$ ile $p > z > 0$.</strong> Hem kutup hem sıfır LHP'de, kutup sıfırdan daha hızlı. Sıfır eğriyi sola çeker (daha hızlı, daha sönümlü yanıt); kutup yüksek-frekans yükselişini sınırlar. Lead kompansatörler analog kontrolün iş atıdır çünkü tek alçak-geçiren filtreli bir op-amp türevi gibi görünürler. $z, p$'yi olası bölgeye düşürülebilir bir $K$'da ulaşılacak şekilde eğriyi bükmek için seçin.</p>

<div class="calc-formula"><div class="formula-label">KOMPANSATÖR KATALOĞU</div><div class="formula-main">$$\\begin{aligned}\\text{PI}\\colon& \\quad C(s) = K\\,\\frac{s + a}{s} \\\\ \\text{Lead}\\colon& \\quad C(s) = K\\,\\frac{s + z}{s + p}, \\;\\; p > z > 0 \\\\ \\text{Lag}\\colon& \\quad C(s) = K\\,\\frac{s + z}{s + p}, \\;\\; z > p > 0 \\\\ \\text{PID}\\colon& \\quad C(s) = K\\,\\frac{(s + a_1)(s + a_2)}{s}\\end{aligned}$$</div><div class="formula-sub">Her kompansatör açık-çevrim transfer fonksiyonuna belirli kutup ve sıfırlar ekleyerek kök yer eğrisini yeniden şekillendirir.</div></div>

<div class="calc-graph"><div id="plot-l4-pi-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $G = K/[s(s{+}1)(s{+}5)]$'in özgün eğrisi (mavi) ile bir PI kompansatörü $C(s) = (s+0.5)/s$ eklendiğinde $C(s)G(s) = K(s{+}0.5)/[s^2(s{+}1)(s{+}5)]$'in eğrisi (yeşil) karşılaştırılıyor. Orijinde eklenen kutup ve $-0.5$'teki sıfır baskın dalları hafifçe değiştirir, ancak $s = 0$'dan yeni sıfırda biten dördüncü bir dal getirir. Bir basamak girişine kalıcı-durum hatası artık sıfırdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function poly_eval(c,x){var n=c.length,v=0;for(var i=0;i<n;i++){v=v*x+c[i];}return v;}
function poly_deriv(c){var n=c.length,d=[];for(var i=0;i<n-1;i++)d.push(c[i]*(n-1-i));return d;}
function newton(c,x0){var x=x0;for(var i=0;i<80;i++){var f=poly_eval(c,x),fp=poly_eval(poly_deriv(c),x);if(Math.abs(fp)<1e-14)break;var d=f/fp;x-=d;if(Math.abs(d)<1e-11)break;}return x;}
function deflate(c,r){var n=c.length,q=[c[0]];for(var i=1;i<n-1;i++)q.push(c[i]+r*q[i-1]);return q;}
function roots_with_complex(c){
  var roots=[];var cur=c.slice();var n=cur.length-1;
  while(n>2){var x=newton(cur,-1);if(!isFinite(x))x=0;roots.push({re:x,im:0});cur=deflate(cur,x);n--;}
  if(n===2){
    var a=cur[0],b=cur[1],d=cur[2];
    var disc=b*b-4*a*d;
    if(disc>=0){var s=Math.sqrt(disc);roots.push({re:(-b+s)/(2*a),im:0});roots.push({re:(-b-s)/(2*a),im:0});}
    else{var s=Math.sqrt(-disc);roots.push({re:-b/(2*a),im:s/(2*a)});roots.push({re:-b/(2*a),im:-s/(2*a)});}
  }else if(n===1){roots.push({re:-cur[1]/cur[0],im:0});}
  return roots;
}
function roots_quartic(K){var c=[1,6,5,K*1,K*0.5];return roots_with_complex(c);}
function rootsOrig(K){
  var a=[1,6,5,K];var roots=[];
  function f(x){return a[0]*x*x*x+a[1]*x*x+a[2]*x+a[3];}
  function fp(x){return 3*a[0]*x*x+2*a[1]*x+a[2];}
  var x=-6;for(var i=0;i<80;i++){var d=f(x)/fp(x);if(!isFinite(d))break;x-=d;if(Math.abs(d)<1e-11)break;}
  var r1=x;var b1=a[0],b2=a[1]+r1*b1,b3=a[2]+r1*b2;
  var disc=b2*b2-4*b1*b3;
  if(disc>=0){var s=Math.sqrt(disc);roots=[{re:r1,im:0},{re:(-b2+s)/(2*b1),im:0},{re:(-b2-s)/(2*b1),im:0}];}
  else{var s=Math.sqrt(-disc);roots=[{re:r1,im:0},{re:-b2/(2*b1),im:s/(2*b1)},{re:-b2/(2*b1),im:-s/(2*b1)}];}
  return roots;
}
var Ks=[];for(var i=0;i<=120;i++){Ks.push(i*0.5);}
var b1x=[],b1y=[],b2x=[],b2y=[],b3x=[],b3y=[];
Ks.forEach(function(K){var r=rootsOrig(K);b1x.push(r[0].re);b1y.push(r[0].im);b2x.push(r[1].re);b2y.push(r[1].im);b3x.push(r[2].re);b3y.push(r[2].im);});
var p1x=[],p1y=[],p2x=[],p2y=[],p3x=[],p3y=[],p4x=[],p4y=[];
Ks.forEach(function(K){var r=roots_quartic(K);if(r.length<4)return;r.sort(function(a,b){return a.re-b.re;});p1x.push(r[0].re);p1y.push(r[0].im);p2x.push(r[1].re);p2y.push(r[1].im);p3x.push(r[2].re);p3y.push(r[2].im);p4x.push(r[3].re);p4y.push(r[3].im);});
var traces=[
  {x:b1x,y:b1y,mode:'lines',line:{color:'#3b82f6',width:2},name:'kompansatörsüz'},
  {x:b2x,y:b2y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:b3x,y:b3y,mode:'lines',line:{color:'#3b82f6',width:2},showlegend:false},
  {x:p1x,y:p1y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},name:'PI kompansatörlü'},
  {x:p2x,y:p2y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},showlegend:false},
  {x:p3x,y:p3y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},showlegend:false},
  {x:p4x,y:p4y,mode:'lines',line:{color:'#10b981',width:2,dash:'dash'},showlegend:false},
  {x:[0,-1,-5],y:[0,0,0],mode:'markers',marker:{size:13,color:'#cbd5e1',symbol:'x',line:{width:2}},name:'tesisat kutupları'},
  {x:[-0.5],y:[0],mode:'markers',marker:{size:12,color:'#10b981',symbol:'circle-open',line:{width:2.5}},name:'PI sıfırı -0.5'}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,2]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-4,4],scaleanchor:'x',scaleratio:1},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},shapes:[{type:'line',x0:0,y0:-4,x1:0,y1:4,line:{color:'rgba(248,113,113,0.4)',width:1,dash:'dot'}}]};
Plotly.newPlot('plot-l4-pi-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yeşil eğriyi okumak.</strong> PI ekleme bir dalı orijin yakın komşuluğuna taşır (orada $-0.5$'teki yeni sıfırla buluşur), diğer dallar ise özgün dallardan yalnızca hafifçe kayar. Bu ders kitabı sonucudur: PI size baskın geçici davranışı önemli ölçüde bozmadan bir basamağa sıfır kalıcı-durum hatası verir, <em>sıfır orijine yakın yerleştirildiği sürece</em>. Sıfırı çok sola koyarsanız eğri daha dramatik şekilde yeniden şekillenir, bazen döngüyü kararsızlaştırır.</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Labda denenecekler.</strong> (1) Örnek 2'deki eklenmiş sıfırın yerini değiştirin — $-2$'den $-10$'a, sonra $-0.5$'e taşıyın — ve eğrinin nasıl yeniden şekillendiğini gözlemleyin. (2) $-0.1, -0.5, -2$'de sıfırlı bir PI kompansatörü deneyin: hangisi özgün eğriyi en az bozar? (3) Bir lead kompansatörü $(s + 1)/(s + 8)$ ekleyin ve baskın kutbu $-2 \\pm j2$'ye yerleştirebilir misiniz görün (sadece orantılıdan çok daha hızlı bir yanıt). (4) Tesisatı $G(s) = 1/[(s+1)^4]$ (fazlalık 4) ile değiştirin ve $\\pm 45^\\circ, \\pm 135^\\circ$'de dört asimptotu izleyin.</p>

<div class="calc-graph"><div id="plot-l4-lead-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $G = K/[s(s+1)(s+5)]$ için üç temsili kazançta kapalı-çevrim basamak yanıtları. $K = 1.5$ (mavi, $\\zeta \\approx 0.5$): ders kitabı %16 aşma, $\\approx 8$ s'de oturuyor. $K = 5$ (turuncu): çok daha salınımlı. $K = 25$ (kırmızı): kararlılık sınırına yakın, çınlama yanıta hâkim. $K = 30$ (kırmızı kesik): saf sürekli salınım $\\omega = \\sqrt{5}$'te — marjinal kararlılık tahmini doğru.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function clStep(K,tEnd,N){
  var dt=tEnd/N;var y=0,yd=0,ydd=0;var ts=[],ys=[];
  for(var i=0;i<=N;i++){var t=i*dt;ts.push(t);ys.push(y);
    var u=1;var yddd=-6*ydd-5*yd-K*y+K*u;
    y+=dt*yd;yd+=dt*ydd;ydd+=dt*yddd;
  }
  return{x:ts,y:ys};
}
var r1=clStep(1.5,30,3000),r2=clStep(5,30,3000),r3=clStep(25,30,3000),r4=clStep(30,30,3000);
var traces=[
  {x:r1.x,y:r1.y,mode:'lines',line:{color:'#3b82f6',width:2.2},name:'K=1.5 (ζ≈0.5)'},
  {x:r2.x,y:r2.y,mode:'lines',line:{color:'#f59e0b',width:2.2},name:'K=5'},
  {x:r3.x,y:r3.y,mode:'lines',line:{color:'#f87171',width:2.2},name:'K=25 (sınıra yakın)'},
  {x:r4.x,y:r4.y,mode:'lines',line:{color:'#f87171',width:1.6,dash:'dash'},name:'K=30 (marjinal)'}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'zaman t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'kapalı-çevrim çıkış y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l4-lead-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-warn"><strong>Sırada ne var.</strong> Kök yer eğrisi geometrik ve sezgiseldir ama tek skaler $K$ ile parametrize eder. Durum-uzayı kutup yerleşimi (ileri derste işlenecek) bunu çok-girişli/çok-çıkışlı sistemlere genelleştirir ve <em>her</em> kapalı-çevrim kutbunu bağımsız yerleştirmenize izin verir — her durumu ölçemiyorsanız bir durum kestirimcisine ihtiyacınız olması pahasına. İki araç beraber yaşar: SISO döngüyü tezgâhta ayarlamak için kök yer eğrisi, temiz oda MIMO tasarımı için kutup yerleşimi.</div>

<p class="l-text"><strong>Özet.</strong> Kök yer eğrisi "tek bir kazanç kapalı-çevrim dinamiklerime ne yapar?" sorusunu eksiksiz bir geometrik resimle cevaplar: her kapalı-çevrim kutbunun nerede oturduğu, ne kadar hızlı hareket ettiği, ne zaman kararsızlığa kaçtığı ve hangi kompansatörün resmi ihtiyaçlarınıza yeniden bükeceği. Altı çizim kuralı elinizde olduğunda, en yaygın SISO tasarım problemleri tek bir diyagrama bakmaya çöker.</p>`
};
