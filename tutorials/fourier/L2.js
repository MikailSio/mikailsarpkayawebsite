window.FOURIER_L2 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text">In Lesson 1 you met the periodic atoms of the universe: sines and cosines, each labelled by an amplitude, a frequency, and a phase. The natural next question is the one Joseph Fourier asked in 1822 and that shocked the entire mathematical establishment of Paris: <strong>given any periodic signal you can draw, can you always write it as a sum of these atoms?</strong> Fourier's answer was yes. The price was an infinite sum, the reward was a complete new vocabulary for analysing music, heat, vibration, electricity, and eventually almost every signal that engineers and physicists touch.</p>

<p class="l-text">This lesson walks the same road Fourier walked, but with the modern hindsight of the orthogonality machinery from Lesson 1. We will state the series, derive the formulas for its coefficients, watch a square wave being built one harmonic at a time, meet the stubborn Gibbs overshoot, list the conditions under which the series actually converges, and finish with Parseval's theorem, which says that decomposing a signal does not destroy its energy. The audience is the engineer who survived a Fourier course at university but never quite trusted the formulas. By the end the formulas should feel obvious.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the Fourier series of a periodic signal and read every symbol in it</li>
<li>Derive the integral formulas for the coefficients $a_n$ and $b_n$ using orthogonality</li>
<li>Compute the Fourier series of the canonical square wave by hand and check the first three terms</li>
<li>Explain the Gibbs phenomenon and predict where the ringing will appear in a partial sum</li>
<li>Check whether a candidate signal satisfies the Dirichlet conditions for convergence</li>
<li>Use Parseval's theorem to balance time-domain energy against frequency-domain energy</li>
</ul>
</div>

<h2 class="lesson-title">1. Fourier's Big Idea</h2>

<div class="calc-highlight"><strong>The historical scandal:</strong> In December 1807 a young French engineer named Joseph Fourier handed a memoir on heat conduction to the Paris Academy of Sciences. Hidden inside was the claim that any function describing a temperature profile, no matter how jagged, could be written as an infinite sum of sines and cosines. Lagrange, the most respected analyst alive, refused to believe it and blocked publication. Fourier rewrote and expanded the work and finally published it as <em>Théorie analytique de la chaleur</em> in 1822. The book changed mathematics forever.</div>

<p class="l-text">To understand why Fourier's claim was so disturbing, picture the world of 1800. Functions, to a mathematician of that era, were polite objects: polynomials, sines, exponentials. They had derivatives everywhere, no corners, no jumps. Fourier was now insisting that even a square wave, a triangle wave, a sawtooth full of straight-line cliffs, could be assembled from smooth sinusoids. To Lagrange this felt like building a brick wall out of soap bubbles.</p>

<p class="l-text">Yet the physics demanded it. Fourier was studying how heat flows through a metal bar. He set up the partial differential equation, then noticed that pure sinusoids decay in a particularly clean way. If only every initial temperature profile could be written as a sum of sinusoids, the heat problem would solve itself, one frequency at a time. So Fourier dared to write:</p>

<div class="calc-formula"><div class="formula-label">FOURIER'S AUDACIOUS CLAIM (1822)</div><div class="formula-main">$$f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\left[\\, a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t)\\,\\right]$$</div><div class="formula-sub">Any periodic signal $f(t)$ with period $T$ can be expressed as an infinite sum of sines and cosines whose frequencies are integer multiples of a single fundamental frequency $\\omega_0 = 2\\pi/T$.</div></div>

<p class="l-text">Two things are remarkable about this statement. First, the set of allowed frequencies is <em>discrete</em>: only $\\omega_0, 2\\omega_0, 3\\omega_0, \\ldots$ appear, never $1.7\\omega_0$. Periodicity forces the spacing. Second, the formula promises an <em>equality</em>, not just an approximation. Fourier really believed the infinite series would reproduce $f(t)$ exactly. It took another century of work by Dirichlet, Riemann, Lebesgue and Carleson to pin down the precise sense in which this equality holds, but Fourier's instinct was essentially right.</p>

<div class="l-note"><strong>Why this matters classically:</strong> Heat conduction, vibrating strings, organ pipes, alternating current circuits, ocean tides, the orbits of binary stars, the chatter of a milling machine, the squeal of brake pads — every one of these phenomena is periodic and therefore has a Fourier series. Engineering moved into the modern era the moment Fourier's series was accepted as a calculation tool, not a mathematical curiosity.</div>

<h2 class="lesson-title">2. The Fourier Series Formula</h2>

<p class="l-text">Let us state the formula carefully and unpack every symbol. Suppose $f(t)$ is periodic with period $T$. Define the fundamental angular frequency as</p>

<div class="calc-formula"><div class="formula-label">FUNDAMENTAL FREQUENCY</div><div class="formula-main">$$\\omega_0 = \\frac{2\\pi}{T} \\qquad(\\text{radians per second})$$</div><div class="formula-sub">One fundamental period fits in $T$ seconds, so the angular frequency is $2\\pi$ radians divided by $T$.</div></div>

<p class="l-text">The full Fourier series is</p>

<div class="calc-formula"><div class="formula-label">FOURIER SERIES (TRIGONOMETRIC FORM)</div><div class="formula-main">$$f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\bigl[\\, a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t)\\,\\bigr]$$</div><div class="formula-sub">A constant piece, plus an infinite list of pairs (cosine harmonic, sine harmonic) of frequencies $n\\omega_0$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a_0 / 2$ &mdash; the DC term</div><div class="card-body">The <strong>average value</strong> of $f(t)$ over one period. The peculiar factor of $1/2$ is a notational convenience: it lets a single formula handle $a_0$ and all the other $a_n$.</div></div>
<div class="calc-card"><div class="card-title">$a_n$ &mdash; cosine coefficient at harmonic $n$</div><div class="card-body">How much of $\\cos(n\\omega_0 t)$ is present in $f(t)$. Captures the <strong>even</strong> (symmetric about $t=0$) part of the signal at frequency $n\\omega_0$.</div></div>
<div class="calc-card"><div class="card-title">$b_n$ &mdash; sine coefficient at harmonic $n$</div><div class="card-body">How much of $\\sin(n\\omega_0 t)$ is present. Captures the <strong>odd</strong> (antisymmetric about $t=0$) part of the signal at the same frequency.</div></div>
<div class="calc-card"><div class="card-title">$n\\omega_0$ &mdash; the $n$th harmonic</div><div class="card-body">An integer multiple of the fundamental. $n=1$ is the first harmonic (the fundamental itself), $n=2$ the second, etc. A piano's middle C and the harmonics above it follow exactly this pattern.</div></div>
</div>

<p class="l-text"><strong>An even / odd intuition that pays off later.</strong> Cosine is even ($\\cos(-x) = \\cos(x)$) and sine is odd ($\\sin(-x) = -\\sin(x)$). So the $a_n$ describe the symmetric content of $f(t)$ around $t=0$ and the $b_n$ describe the antisymmetric content. A purely even signal (a triangle wave centred at zero, for example) has $b_n = 0$ for every $n$. A purely odd signal (a sawtooth that passes through zero with a jump) has $a_n = 0$. Spotting these symmetries before you start integrating can halve your work.</p>

<div class="think-box"><div class="think-label">A FIRST CHECK</div><div class="think-body">Suppose $f(t) = 3 + 5\\cos(\\omega_0 t)$. By inspection: $a_0/2 = 3$ so $a_0 = 6$; $a_1 = 5$; every other coefficient is zero. The series collapses to two terms, exactly the signal we started with. No infinity needed when the signal is already a finite sum of sinusoids.</div></div>

<h2 class="lesson-title">3. Computing the Coefficients</h2>

<p class="l-text">We now derive the integral formulas that give the numerical values of $a_n$ and $b_n$. The whole derivation rests on the <strong>orthogonality</strong> properties you proved in Lesson 1, namely that over a full period the integral of $\\cos(m\\omega_0 t)\\cos(n\\omega_0 t)$ vanishes when $m \\neq n$, and similarly for sines and for sine-cosine cross terms.</p>

<div class="calc-formula"><div class="formula-label">ORTHOGONALITY RELATIONS (recap from Lesson 1)</div><div class="formula-main">$$\\int_0^T \\cos(m\\omega_0 t)\\cos(n\\omega_0 t)\\,dt = \\begin{cases} T/2 & m=n\\neq 0 \\\\ T & m=n=0 \\\\ 0 & m \\neq n \\end{cases}$$ $$\\int_0^T \\sin(m\\omega_0 t)\\sin(n\\omega_0 t)\\,dt = \\begin{cases} T/2 & m=n\\neq 0 \\\\ 0 & \\text{otherwise} \\end{cases}$$ $$\\int_0^T \\cos(m\\omega_0 t)\\sin(n\\omega_0 t)\\,dt = 0 \\quad \\text{for all } m,n.$$</div><div class="formula-sub">Sines and cosines at integer harmonics form a mutually orthogonal family on any one full period.</div></div>

<p class="l-text"><strong>Strategy.</strong> To extract the coefficient $a_n$, multiply both sides of the Fourier series by $\\cos(n\\omega_0 t)$ and integrate over a period. All but one of the terms on the right will integrate to zero, isolating $a_n$. The procedure is identical to projecting a vector onto a basis direction by taking the inner product with that direction.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Multiply the series by $\\cos(n\\omega_0 t)$</div><div class="step-detail">We pick a fixed integer $n \\geq 1$ and write $f(t)\\cos(n\\omega_0 t) = \\frac{a_0}{2}\\cos(n\\omega_0 t) + \\sum_m a_m\\cos(m\\omega_0 t)\\cos(n\\omega_0 t) + \\sum_m b_m\\sin(m\\omega_0 t)\\cos(n\\omega_0 t)$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Integrate over one full period</div><div class="step-detail">By orthogonality, the cross terms $\\sin\\cdot\\cos$ all vanish, the cosine-cosine cross terms vanish whenever $m \\neq n$, and the DC term integrates to zero because $\\int_0^T \\cos(n\\omega_0 t)\\,dt = 0$ for $n\\geq 1$. Only the $m=n$ cosine term survives, contributing $a_n \\cdot T/2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Solve for $a_n$</div><div class="step-detail">The integral $\\int_0^T f(t)\\cos(n\\omega_0 t)\\,dt$ equals $a_n T/2$, so $a_n = (2/T) \\int_0^T f(t)\\cos(n\\omega_0 t)\\,dt$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Repeat with $\\sin(n\\omega_0 t)$ for $b_n$</div><div class="step-detail">The same orthogonality argument, applied with a sine multiplier, gives $b_n = (2/T) \\int_0^T f(t)\\sin(n\\omega_0 t)\\,dt$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">The DC coefficient $a_0$</div><div class="step-detail">Setting $n=0$ in the cosine formula gives $a_0 = (2/T)\\int_0^T f(t)\\,dt$, so $a_0/2$ is precisely the average value of $f(t)$ &mdash; exactly as the cards in Section 2 promised.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">EULER-FOURIER COEFFICIENT FORMULAS</div><div class="formula-main">$$a_n = \\frac{2}{T}\\int_0^T f(t)\\cos(n\\omega_0 t)\\,dt, \\qquad b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega_0 t)\\,dt$$ $$a_0 = \\frac{2}{T}\\int_0^T f(t)\\,dt$$</div><div class="formula-sub">These three lines are the operational heart of Fourier analysis. Every textbook formula you will ever meet follows from them.</div></div>

<div class="l-note"><strong>Geometric reading:</strong> Think of the space of periodic signals as an infinite-dimensional inner-product space. The functions $\\{1, \\cos(\\omega_0 t), \\sin(\\omega_0 t), \\cos(2\\omega_0 t), \\sin(2\\omega_0 t), \\ldots\\}$ are an orthogonal basis. Computing $a_n$ is computing the component of $f(t)$ along the basis direction $\\cos(n\\omega_0 t)$. The factor $2/T$ is just the normalising constant for that basis vector.</div>

<h2 class="lesson-title">4. Example: The Square Wave</h2>

<div class="calc-highlight"><strong>Why this example?</strong> The square wave is the simplest non-trivial periodic function with a jump discontinuity. Its Fourier series exhibits every interesting feature at once: a clean coefficient formula, slow convergence, the Gibbs overshoot, and a beautiful sum that historically convinced sceptics the series was real.</div>

<p class="l-text">Take a square wave of period $T = 2\\pi$ that jumps between $+1$ and $-1$:</p>

<div class="calc-formula"><div class="formula-label">SQUARE WAVE</div><div class="formula-main">$$f(t) = \\begin{cases} +1 & 0 < t < \\pi \\\\ -1 & \\pi < t < 2\\pi \\end{cases}$$</div><div class="formula-sub">Period $T = 2\\pi$, fundamental frequency $\\omega_0 = 1$. The signal is odd around $t = 0$, so we expect every $a_n$ to vanish.</div></div>

<p class="l-text"><strong>The $a_n$ are zero.</strong> Since $f(t)$ is odd around the origin and $\\cos(n\\omega_0 t)$ is even, the integrand $f(t)\\cos(n\\omega_0 t)$ is odd, and odd functions integrate to zero over a symmetric interval. So $a_n = 0$ for every $n$, including $a_0$ (the average value is zero by inspection). All the action is in the $b_n$.</p>

<p class="l-text"><strong>Computing $b_n$.</strong> Using $T = 2\\pi$ and $\\omega_0 = 1$:</p>

<div class="calc-formula"><div class="formula-label">SQUARE WAVE COEFFICIENTS</div><div class="formula-main">$$b_n = \\frac{2}{2\\pi}\\int_0^{2\\pi} f(t)\\sin(nt)\\,dt = \\frac{1}{\\pi}\\left[\\int_0^{\\pi}\\sin(nt)\\,dt - \\int_{\\pi}^{2\\pi}\\sin(nt)\\,dt\\right]$$</div><div class="formula-sub">Split the period into the $+1$ half and the $-1$ half.</div></div>

<p class="l-text">Evaluating each piece using $\\int \\sin(nt)\\,dt = -\\cos(nt)/n$ and tidying up gives</p>

<div class="calc-formula"><div class="formula-label">CLEAN RESULT</div><div class="formula-main">$$b_n = \\frac{2}{n\\pi}\\bigl[\\,1 - \\cos(n\\pi)\\,\\bigr] = \\begin{cases} \\dfrac{4}{n\\pi} & n \\text{ odd} \\\\[2pt] 0 & n \\text{ even} \\end{cases}$$</div><div class="formula-sub">Only odd harmonics survive. The even harmonics cancel exactly because of the symmetry of the wave.</div></div>

<div class="calc-formula"><div class="formula-label">SQUARE WAVE FOURIER SERIES</div><div class="formula-main">$$f(t) = \\frac{4}{\\pi}\\left[\\,\\sin t + \\frac{1}{3}\\sin 3t + \\frac{1}{5}\\sin 5t + \\frac{1}{7}\\sin 7t + \\cdots\\,\\right]$$</div><div class="formula-sub">Pure odd harmonics, amplitudes decreasing as $1/n$. The first three terms already capture most of the shape.</div></div>

<div class="calc-example"><div class="example-label">HISTORICAL CHECK</div><div class="example-body"><strong>Evaluate the series at $t = \\pi/2$, where the square wave equals $+1$:</strong><br><br>$1 = (4/\\pi)\\bigl[\\sin(\\pi/2) + (1/3)\\sin(3\\pi/2) + (1/5)\\sin(5\\pi/2) + \\cdots\\bigr]$<br><br>$= (4/\\pi)\\bigl[1 - 1/3 + 1/5 - 1/7 + \\cdots\\bigr]$<br><br>Rearranging gives the celebrated <strong>Leibniz formula</strong>: $\\pi/4 = 1 - 1/3 + 1/5 - 1/7 + \\cdots$. Fourier's series silently delivers a formula that Leibniz had discovered by very different means a century earlier &mdash; a strong vote of confidence.</div></div>

<div id="plot-l2-square-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=600;var xs=[];var sq=[];var h1=[];var h3=[];var h5=[];
for(var i=0;i<N;i++){var t=-Math.PI+2*Math.PI*i/(N-1);xs.push(t);
sq.push(t>0?1:-1);
h1.push((4/Math.PI)*Math.sin(t));
h3.push((4/Math.PI)*(Math.sin(t)+Math.sin(3*t)/3));
h5.push((4/Math.PI)*(Math.sin(t)+Math.sin(3*t)/3+Math.sin(5*t)/5));}
var d0={x:xs,y:sq,mode:'lines',name:'square wave',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:xs,y:h1,mode:'lines',name:'N=1 (fundamental)',line:{color:'#60a5fa',width:2}};
var d2={x:xs,y:h3,mode:'lines',name:'N=2 (+ 3rd)',line:{color:'#34d399',width:2}};
var d3={x:xs,y:h5,mode:'lines',name:'N=3 (+ 5th)',line:{color:'#f59e0b',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'f(t)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.5,1.5]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-square-en',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the dotted grey is the target square wave; each coloured curve adds one more odd harmonic. Already with just the 1st, 3rd and 5th harmonics the partial sum is unmistakably square-shaped, though the edges are still wavy. Add more harmonics and the wavy edges get squeezed closer to the jumps, but they never disappear &mdash; the next section explains why.</div></div>

<h2 class="lesson-title">5. The Gibbs Phenomenon</h2>

<div class="calc-highlight"><strong>The puzzle:</strong> If you compute the Fourier series of a square wave with 9, 27, 99 or 999 terms and zoom in on the jump at $t=0$, you will see the partial sum overshoot the value $+1$ by roughly $9\\%$. The overshoot never goes away. It just gets narrower. This is the <strong>Gibbs phenomenon</strong>, discovered by Henry Wilbraham in 1848, forgotten, then rediscovered by Albert Michelson with his mechanical harmonic analyser in 1898 and finally explained by J. Willard Gibbs in 1899.</div>

<p class="l-text">Numerically, the maximum value of the $N$-term partial sum approaches</p>

<div class="calc-formula"><div class="formula-label">GIBBS CONSTANT</div><div class="formula-main">$$\\max_{t} S_N(t) \\xrightarrow{N\\to\\infty}\\; \\frac{2}{\\pi}\\int_0^{\\pi}\\frac{\\sin u}{u}\\,du \\approx 1.0894898\\ldots$$</div><div class="formula-sub">The overshoot is about $8.95\\%$ of the jump size. It is universal: any signal with a jump discontinuity exhibits the same overshoot regardless of the particular shape.</div></div>

<p class="l-text"><strong>Why does it happen?</strong> The partial sum $S_N(t)$ is a smooth, bandlimited function (it contains no frequencies above $N\\omega_0$). A bandlimited function cannot jump instantaneously, so near a discontinuity it has to swing up, overshoot, and swing back. As $N$ grows, the swing gets squeezed into a narrower window, but the height of the swing settles to roughly $9\\%$ of the jump. The series converges pointwise away from the jump and to the midpoint <em>at</em> the jump, but it does <strong>not</strong> converge uniformly.</p>

<p class="l-text"><strong>Why engineers care.</strong> Anywhere you reconstruct a sharp signal from a finite frequency band &mdash; digital filters, JPEG compression with too few coefficients, abrupt waveforms passing through low-pass circuits &mdash; you get ringing artefacts on either side of every edge. Audio engineers know it as <em>pre-ringing</em> and <em>post-ringing</em>; image processing calls it <em>ringing</em>. All three are direct descendants of Gibbs.</p>

<div id="plot-l2-gibbs-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=2000;var xs=[];var partial1=[];var partial3=[];var partial9=[];var partial27=[];
for(var i=0;i<N;i++){var t=-Math.PI+2*Math.PI*i/(N-1);xs.push(t);
var s1=0,s3=0,s9=0,s27=0;
for(var k=1;k<=53;k+=2){var term=Math.sin(k*t)/k;
  if(k<=1)s1+=term;
  if(k<=5)s3+=term;
  if(k<=17)s9+=term;
  s27+=term;}
partial1.push((4/Math.PI)*s1);partial3.push((4/Math.PI)*s3);
partial9.push((4/Math.PI)*s9);partial27.push((4/Math.PI)*s27);}
var sq=xs.map(function(t){return t>0?1:-1;});
var d0={x:xs,y:sq,mode:'lines',name:'target',line:{color:'#9ca3af',width:1.5,dash:'dot'}};
var d1={x:xs,y:partial1,mode:'lines',name:'N=1',line:{color:'#60a5fa',width:1.5}};
var d2={x:xs,y:partial3,mode:'lines',name:'N=3',line:{color:'#34d399',width:1.5}};
var d3={x:xs,y:partial9,mode:'lines',name:'N=9',line:{color:'#f59e0b',width:1.8}};
var d4={x:xs,y:partial27,mode:'lines',name:'N=27 (overshoot ≈ 1.09)',line:{color:'#ef4444',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'partial sum',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.3,1.3]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-gibbs-en',[d0,d1,d2,d3,d4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the $N=27$ partial sum (red) is visually almost a perfect square wave, except at the jumps near $t=0$ and $t=\\pm\\pi$, where it overshoots by about $9\\%$. Increasing $N$ further makes the overshoot narrower but never shorter. This is Gibbs in action.</div></div>

<div class="think-box"><div class="think-label">PRACTICAL TAKEAWAY</div><div class="think-body">If you ever need a sharp edge from a finite Fourier sum &mdash; in graphics, in synthesis, in a filter design &mdash; you cannot avoid the overshoot by using more harmonics. You have to either accept it, smooth the edge in advance (so it stops being a discontinuity), or use a windowed sum that trades sharpness for a smaller overshoot. There is no free lunch.</div></div>

<h2 class="lesson-title">6. More Examples: Sawtooth and Triangle</h2>

<p class="l-text">Two more canonical waveforms round out the picture. Both can be computed by the same integral recipe; both reveal how the smoothness of the signal controls how fast the Fourier coefficients decay.</p>

<p class="l-text"><strong>The sawtooth wave.</strong> Define $f(t) = t$ on $-\\pi < t < \\pi$ and extend periodically with period $2\\pi$. The signal is odd around the origin, so again $a_n = 0$. A short integration by parts gives</p>

<div class="calc-formula"><div class="formula-label">SAWTOOTH COEFFICIENTS</div><div class="formula-main">$$b_n = \\frac{2}{\\pi}\\int_0^{\\pi} t\\sin(nt)\\,dt = \\frac{2}{n}(-1)^{n+1}$$</div><div class="formula-sub">Coefficients alternate in sign and decay as $1/n$ &mdash; the same slow decay as the square wave, because the sawtooth also has a jump discontinuity at $\\pm\\pi$.</div></div>

<div class="calc-formula"><div class="formula-label">SAWTOOTH SERIES</div><div class="formula-main">$$t = 2\\left[\\,\\sin t - \\frac{\\sin 2t}{2} + \\frac{\\sin 3t}{3} - \\frac{\\sin 4t}{4} + \\cdots\\,\\right] \\quad (-\\pi < t < \\pi)$$</div><div class="formula-sub">Same Gibbs phenomenon at the jumps, same overshoot of about $9\\%$.</div></div>

<p class="l-text"><strong>The triangle wave.</strong> Define $f(t) = |t|$ on $-\\pi < t < \\pi$ and extend periodically. This signal is continuous everywhere and only its slope jumps at $t=0$. The signal is even, so all $b_n = 0$. The cosine coefficients work out to</p>

<div class="calc-formula"><div class="formula-label">TRIANGLE COEFFICIENTS</div><div class="formula-main">$$a_0 = \\pi, \\qquad a_n = \\frac{2}{\\pi}\\int_0^{\\pi} t\\cos(nt)\\,dt = \\begin{cases} -\\dfrac{4}{\\pi n^2} & n \\text{ odd} \\\\ 0 & n \\text{ even, } n\\geq 2 \\end{cases}$$</div><div class="formula-sub">Coefficients now decay as $1/n^2$ &mdash; one full power faster than the square wave.</div></div>

<div class="calc-formula"><div class="formula-label">TRIANGLE SERIES</div><div class="formula-main">$$|t| = \\frac{\\pi}{2} - \\frac{4}{\\pi}\\left[\\cos t + \\frac{\\cos 3t}{9} + \\frac{\\cos 5t}{25} + \\cdots\\right]$$</div><div class="formula-sub">Convergence is much faster than the square wave; no Gibbs overshoot because there is no jump in the function itself.</div></div>

<div id="plot-l2-sawtooth-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=600;var xs=[];var saw=[];var s1=[];var s3=[];var s10=[];
for(var i=0;i<N;i++){var t=-Math.PI+2*Math.PI*i/(N-1);xs.push(t);
saw.push(t);
var a=0,b=0,c=0;
for(var k=1;k<=30;k++){var term=2*Math.pow(-1,k+1)*Math.sin(k*t)/k;
  if(k<=1)a+=term;
  if(k<=3)b+=term;
  c+=term;}
s1.push(a);s3.push(b);s10.push(c);}
var d0={x:xs,y:saw,mode:'lines',name:'sawtooth (t)',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:xs,y:s1,mode:'lines',name:'N=1',line:{color:'#60a5fa',width:1.8}};
var d2={x:xs,y:s3,mode:'lines',name:'N=3',line:{color:'#34d399',width:1.8}};
var d3={x:xs,y:s10,mode:'lines',name:'N=30',line:{color:'#ef4444',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'partial sum',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-4,4]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-sawtooth-en',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the sawtooth target (dotted grey) reconstructed with one, three, and thirty harmonics. Notice the same Gibbs overshoot near the jumps at $\\pm\\pi$, again $\\approx 9\\%$ of the jump height.</div></div>

<div class="l-note"><strong>Decay rate matters:</strong> coefficients of the square wave fall like $1/n$, the triangle like $1/n^2$, a $C^2$ smooth periodic signal like $1/n^3$ or faster. The rule of thumb is simple: <em>the smoother the signal, the faster its Fourier coefficients vanish</em>. Conversely, slow decay is a warning sign that the underlying signal has a sharp corner or a jump somewhere.</div>

<h2 class="lesson-title">7. Convergence: The Dirichlet Conditions</h2>

<p class="l-text">Fourier wrote his series with breathtaking confidence, but rigorous mathematicians needed conditions under which the equality $f(t) = \\sum \\ldots$ actually holds. The first widely accepted answer came from <strong>Peter Gustav Lejeune Dirichlet</strong> in 1829.</p>

<div class="calc-formula"><div class="formula-label">DIRICHLET CONDITIONS</div><div class="formula-main">$$\\text{A periodic signal } f(t) \\text{ has a convergent Fourier series at every point if, on one period, } f \\text{ is:}$$</div><div class="formula-sub">(1) bounded; (2) has at most finitely many maxima and minima; (3) has at most finitely many finite discontinuities; (4) is absolutely integrable, i.e. $\\int_0^T |f(t)|\\,dt < \\infty$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bounded</div><div class="card-body">$|f(t)| \\leq M$ for some finite $M$. Rules out signals that shoot off to infinity inside a period.</div></div>
<div class="calc-card"><div class="card-title">Finitely many extrema</div><div class="card-body">No infinitely rapid oscillations within a finite interval. The signal $\\sin(1/t)$ near $t=0$ is the classic counter-example.</div></div>
<div class="calc-card"><div class="card-title">Finitely many discontinuities</div><div class="card-body">Jumps are allowed (a square wave is fine), but only a finite number per period and each jump must be finite in size.</div></div>
<div class="calc-card"><div class="card-title">Absolutely integrable</div><div class="card-body">The area of $|f|$ over a period is finite. Almost every physically realisable signal satisfies this automatically.</div></div>
</div>

<p class="l-text"><strong>What does the series converge to?</strong> Where $f$ is continuous, the series converges to $f(t)$ itself. <em>At</em> a jump from $f(t_0^-)$ to $f(t_0^+)$, the series converges to the midpoint $\\bigl(f(t_0^-) + f(t_0^+)\\bigr)/2$ &mdash; not to either side. For the square wave this means the series evaluates to $0$ exactly at $t = 0$ and $t = \\pi$, even though the wave itself is discontinuous there. This is a feature, not a bug.</p>

<div class="think-box"><div class="think-label">A QUICK SANITY TEST</div><div class="think-body">Does the square wave satisfy all four Dirichlet conditions? Bounded: yes ($|f| \\leq 1$). Finitely many extrema: yes, just two per period. Finitely many finite jumps: yes, two per period of size $2$. Absolutely integrable: yes ($\\int_0^{2\\pi} 1\\,dt = 2\\pi$). So the series converges &mdash; to $\\pm 1$ away from the jumps and to $0$ at the jumps, which matches what the plots showed.</div></div>

<div class="l-note"><strong>Modern refinement (Carleson, 1966):</strong> Lennart Carleson proved that for any function that is merely square integrable on a period, the Fourier series converges to $f(t)$ at almost every point. This is far weaker than Dirichlet's conditions and silences most theoretical worries for engineering applications.</div>

<h2 class="lesson-title">8. Parseval's Theorem: Energy Stays Where It Belongs</h2>

<p class="l-text">A Fourier series is just a re-expression of $f(t)$. Nothing physical should change. In particular, the <strong>energy</strong> &mdash; defined as the time-averaged square of the signal &mdash; should be exactly the same whether you compute it in the time domain or by adding the squared amplitudes of the harmonics. This is the content of Parseval's theorem.</p>

<div class="calc-formula"><div class="formula-label">PARSEVAL'S THEOREM (TRIGONOMETRIC FORM)</div><div class="formula-main">$$\\frac{1}{T}\\int_0^T |f(t)|^2\\,dt = \\left(\\frac{a_0}{2}\\right)^{\\!2} + \\frac{1}{2}\\sum_{n=1}^{\\infty}\\bigl(a_n^2 + b_n^2\\bigr)$$</div><div class="formula-sub">Time-averaged power on the left; sum of squared harmonic amplitudes on the right. The two are equal.</div></div>

<p class="l-text"><strong>The factor of $1/2$.</strong> A pure cosine of amplitude $A$ has time-averaged power $A^2/2$, not $A^2$. The factor $1/2$ in Parseval's formula simply records that each sinusoidal harmonic contributes half of its squared amplitude to the average power.</p>

<div class="calc-example"><div class="example-label">CHECK ON THE SQUARE WAVE</div><div class="example-body"><strong>Left side:</strong> $(1/T)\\int_0^T |f|^2\\,dt = 1$ because $|f|^2 = 1$ everywhere.<br><br><strong>Right side:</strong> the only non-zero coefficients are $b_n = 4/(n\\pi)$ for odd $n$, so the sum becomes<br><br>$\\frac{1}{2}\\sum_{n\\,\\text{odd}} \\bigl(4/n\\pi\\bigr)^2 = \\frac{8}{\\pi^2}\\sum_{n\\,\\text{odd}} \\frac{1}{n^2}$.<br><br>Using the classical identity $\\sum_{n\\,\\text{odd}} 1/n^2 = \\pi^2/8$, the right side equals $1$. Parseval holds, and as a byproduct we have rederived a famous closed-form sum.</div></div>

<div id="plot-l2-energy-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nmax=40;var ns=[];var energy=[];var total=0;
for(var k=1;k<=Nmax;k+=2){var bn=4/(k*Math.PI);total+=0.5*bn*bn;}
var running=0;
for(var k=1;k<=Nmax;k+=2){var bn=4/(k*Math.PI);running+=0.5*bn*bn;ns.push(k);energy.push(running/total);}
var d1={x:ns,y:energy,mode:'lines+markers',name:'cumulative energy fraction',line:{color:'#60a5fa',width:2.5},marker:{size:7,color:'#60a5fa'}};
var d2={x:[0,Nmax],y:[1,1],mode:'lines',name:'total (Parseval limit)',line:{color:'#34d399',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'highest odd harmonic included',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'fraction of total power',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[0,1.05]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l2-energy-en',[d1,d2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the cumulative fraction of the square wave's total power captured by the first $k$ odd harmonics. The fundamental alone holds about $81\\%$ of the energy; adding the 3rd harmonic gets you past $90\\%$; the first three odd harmonics together hold about $95\\%$. The remaining $5\\%$ is spread across an infinite tail and is responsible for the sharp edges (and the Gibbs ringing).</div></div>

<div id="plot-l2-coefs-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var ks=[];var bs=[];
for(var k=1;k<=15;k++){ks.push(k);bs.push(k%2===1?4/(k*Math.PI):0);}
var d1={x:ks,y:bs,type:'bar',name:'|bₙ| square wave',marker:{color:'#60a5fa'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'harmonic n',gridcolor:'#1f2937',zerolinecolor:'#374151',dtick:1},yaxis:{title:'|bₙ|',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-coefs-en',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the magnitudes $|b_n|$ for the square wave. Only odd harmonics are present; their heights decrease as $1/n$. The bar chart is the signal's <em>spectrum</em> and contains every piece of information needed to reconstruct $f(t)$.</div></div>

<div class="l-note"><strong>Why Parseval matters in practice:</strong> it gives you a quantitative way to decide how many harmonics you need. If you want to keep $99\\%$ of a signal's energy, you can stop adding harmonics as soon as the cumulative power crosses $0.99$. The theorem turns the vague question "is this approximation good enough?" into a hard numerical criterion.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>What you should observe.</strong> The numerical $b_n$ match the theoretical $4/(n\\pi)$ for odd $n$ to four decimals and are essentially zero for even $n$. As $N$ grows, the overshoot stabilises around $0.089$, exactly the Gibbs prediction. The energy-kept ratio approaches one but climbs slowly &mdash; you need many harmonics to capture the high-frequency tail that produces the sharp corners.</p>

<div class="think-box"><div class="think-label">A FEW EXPERIMENTS TO TRY</div><div class="think-body">Change the period $T$ and re-run: do the formulas still work? Replace <code>np.sign(np.sin(...))</code> with <code>t</code> (cropped to one period) for a sawtooth and watch the alternating signs of $b_n$ appear. Replace it with <code>np.abs(t-np.pi)</code> for a triangle and observe that suddenly the $a_n$ are non-zero and the $b_n$ vanish. The same code, three different waveforms.</div></div>

<div class="calc-highlight"><strong>What you can do now:</strong> you can write down the Fourier series of any reasonable periodic signal, compute its coefficients either by hand or numerically, predict where the Gibbs overshoot will appear, and use Parseval's theorem to estimate how many harmonics are enough. The next lesson re-encodes everything we have done in the much cleaner language of complex exponentials &mdash; the form that every modern textbook and software library actually uses.</div>
`,

/* ============================================================
   TURKISH TRANSLATION
   ============================================================ */
tr: `
<p class="l-text">Ders 1'de evrenin periyodik atomlarıyla tanıştın: her biri bir genlik, bir frekans ve bir fazla etiketlenen sinüs ve kosinüsler. Doğal olarak akla gelen bir sonraki soru, 1822'de Joseph Fourier'in sorduğu ve tüm Paris matematik dünyasını şoke eden sorudur: <strong>çizebileceğin her periyodik sinyali, her zaman bu atomların toplamı olarak yazabilir misin?</strong> Fourier'in yanıtı evetti. Bedeli sonsuz bir toplamdı, ödülü ise müzik, ısı, titreşim, elektrik ve sonunda mühendis ve fizikçilerin dokunduğu hemen hemen her sinyali analiz etmek için tamamen yeni bir kelime dağarcığıydı.</p>

<p class="l-text">Bu ders Fourier'in yürüdüğü yolu yürür, ama Ders 1'deki diklik makinesinin modern bakış açısıyla. Seriyi ifade edeceğiz, katsayılarının integral formüllerini türeteceğiz, bir kare dalganın armonik armonik nasıl oluştuğunu izleyeceğiz, inatçı Gibbs aşımıyla tanışacağız, serinin gerçekten yakınsadığı koşulları listeleyeceğiz ve Parseval teoremiyle bitireceğiz &mdash; sinyali ayrıştırmanın enerjisini bozmadığını söyleyen teorem. Hedef kitle, üniversitede Fourier dersinden çıkmış ama formüllere asla tam güvenememiş mühendistir. Ders bitince formüllerin apaçık görünmesi gerekir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Periyodik bir sinyalin Fourier serisini yazmak ve her sembolünü okumak</li>
<li>$a_n$ ve $b_n$ katsayılarının integral formüllerini diklik kullanarak türetmek</li>
<li>Klasik kare dalganın Fourier serisini elle hesaplamak ve ilk üç terimi doğrulamak</li>
<li>Gibbs olgusunu açıklamak ve kısmi toplamda titremenin nerede çıkacağını öngörmek</li>
<li>Bir sinyalin Dirichlet yakınsama koşullarını sağlayıp sağlamadığını kontrol etmek</li>
<li>Parseval teoremiyle zaman alanındaki enerjiyi frekans alanındaki enerjiyle dengelemek</li>
</ul>
</div>

<h2 class="lesson-title">1. Fourier'in Büyük Fikri</h2>

<div class="calc-highlight"><strong>Tarihsel skandal:</strong> Aralık 1807'de Joseph Fourier adında genç bir Fransız mühendis, ısı iletimi üzerine bir muhtırasını Paris Bilimler Akademisi'ne sundu. İçinde gizli olan iddia şuydu: bir sıcaklık profilini tanımlayan herhangi bir fonksiyon, ne kadar pürüzlü olursa olsun, sonsuz bir sinüs ve kosinüs toplamı olarak yazılabilir. Yaşayan en saygın analist Lagrange buna inanmayı reddetti ve yayını engelledi. Fourier çalışmayı yeniden yazıp genişletti ve sonunda 1822'de <em>Théorie analytique de la chaleur</em> olarak yayımladı. Kitap matematiği sonsuza dek değiştirdi.</div>

<p class="l-text">Fourier'in iddiasının neden bu kadar rahatsız edici olduğunu anlamak için 1800'lerin dünyasını canlandır. Bir matematikçi için fonksiyonlar terbiyeli nesnelerdi: polinomlar, sinüsler, üsteller. Her yerde türevleri vardı, köşeleri yoktu, sıçramaları yoktu. Fourier şimdi diyordu ki bir kare dalga bile, bir üçgen dalga, dimdik kenarlarla dolu bir testere dişi &mdash; bunların hepsi düz sinüsoidlerden inşa edilebilirdi. Lagrange için bu sabun köpüğünden tuğla duvar örmek gibiydi.</p>

<p class="l-text">Yine de fizik bunu gerektiriyordu. Fourier metal bir çubukta ısının nasıl aktığını çalışıyordu. Kısmi diferansiyel denklemi kurdu, sonra saf sinüsoidlerin özellikle temiz bir şekilde söndüğünü fark etti. Eğer her başlangıç sıcaklık profili sinüsoidlerin toplamı olarak yazılabilirse, ısı problemi tek tek frekanslarla kendiliğinden çözülürdü. Bu yüzden Fourier şu cesareti gösterdi:</p>

<div class="calc-formula"><div class="formula-label">FOURIER'IN CESUR İDDİASI (1822)</div><div class="formula-main">$$f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\left[\\, a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t)\\,\\right]$$</div><div class="formula-sub">Periyodu $T$ olan herhangi bir periyodik $f(t)$ sinyali, frekansları tek bir temel frekans $\\omega_0 = 2\\pi/T$'nin tam katları olan sinüs ve kosinüslerin sonsuz toplamı olarak ifade edilebilir.</div></div>

<p class="l-text">Bu ifadenin iki dikkat çekici yanı var. Birincisi, izin verilen frekansların kümesi <em>ayrıktır</em>: yalnızca $\\omega_0, 2\\omega_0, 3\\omega_0, \\ldots$ görünür, asla $1.7\\omega_0$ değil. Periyodiklik aralığı zorlar. İkincisi, formül bir <em>eşitlik</em> vaat ediyor, yalnızca bir yaklaşıklık değil. Fourier sonsuz serinin $f(t)$'yi tam olarak yeniden üreteceğine gerçekten inanıyordu. Bu eşitliğin tam olarak hangi anlamda geçerli olduğunu netleştirmek için Dirichlet, Riemann, Lebesgue ve Carleson'un bir yüzyıllık çalışması gerekti, ama Fourier'in sezgisi temelde doğruydu.</p>

<div class="l-note"><strong>Klasik anlamda neden önemli:</strong> Isı iletimi, titreşen teller, org boruları, alternatif akım devreleri, okyanus gelgitleri, çift yıldız sistemlerinin yörüngeleri, freze tezgâhının gürültüsü, fren balatalarının çığlığı &mdash; bu olayların her biri periyodiktir ve dolayısıyla bir Fourier serisine sahiptir. Fourier serisi matematiksel bir merak değil bir hesaplama aracı olarak kabul edildiği an, mühendislik modern çağa geçti.</div>

<h2 class="lesson-title">2. Fourier Serisi Formülü</h2>

<p class="l-text">Formülü dikkatle ifade edip her sembolünü açalım. $f(t)$'nin periyodu $T$ olan periyodik bir fonksiyon olduğunu varsay. Temel açısal frekansı şöyle tanımla:</p>

<div class="calc-formula"><div class="formula-label">TEMEL FREKANS</div><div class="formula-main">$$\\omega_0 = \\frac{2\\pi}{T} \\qquad(\\text{radyan/saniye})$$</div><div class="formula-sub">Bir temel periyot $T$ saniyeye sığar, yani açısal frekans $2\\pi$ radyanın $T$'ye bölümüdür.</div></div>

<p class="l-text">Tam Fourier serisi şudur:</p>

<div class="calc-formula"><div class="formula-label">FOURIER SERİSİ (TRİGONOMETRİK BİÇİM)</div><div class="formula-main">$$f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\bigl[\\, a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t)\\,\\bigr]$$</div><div class="formula-sub">Bir sabit terim, artı $n\\omega_0$ frekanslarındaki sonsuz sayıda çift (kosinüs armonik, sinüs armonik).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a_0/2$ &mdash; DC terimi</div><div class="card-body">$f(t)$'nin bir periyot üzerindeki <strong>ortalama değeri</strong>. Garip görünen $1/2$ çarpanı bir gösterim kolaylığıdır: tek bir formülün $a_0$'ı ve diğer tüm $a_n$'leri ele almasını sağlar.</div></div>
<div class="calc-card"><div class="card-title">$a_n$ &mdash; $n$. armonikteki kosinüs katsayısı</div><div class="card-body">$f(t)$ içinde ne kadar $\\cos(n\\omega_0 t)$ bulunduğu. Sinyalin $n\\omega_0$ frekansındaki <strong>çift</strong> ($t=0$'a göre simetrik) bileşenini yakalar.</div></div>
<div class="calc-card"><div class="card-title">$b_n$ &mdash; $n$. armonikteki sinüs katsayısı</div><div class="card-body">$f(t)$ içinde ne kadar $\\sin(n\\omega_0 t)$ bulunduğu. Aynı frekanstaki <strong>tek</strong> ($t=0$'a göre antisimetrik) bileşeni yakalar.</div></div>
<div class="calc-card"><div class="card-title">$n\\omega_0$ &mdash; $n$. armonik</div><div class="card-body">Temel frekansın tam katı. $n=1$ birinci armoniktir (temel armoniğin kendisi), $n=2$ ikinci, ve böyle devam eder. Bir piyanonun do orta notası ve üst armonikleri tam olarak bu deseni izler.</div></div>
</div>

<p class="l-text"><strong>İleride işe yarayacak bir çift/tek sezgisi.</strong> Kosinüs çift ($\\cos(-x) = \\cos(x)$), sinüs tektir ($\\sin(-x) = -\\sin(x)$). Bu yüzden $a_n$ katsayıları $f(t)$'nin $t=0$ etrafındaki simetrik içeriğini, $b_n$'ler ise antisimetrik içeriğini tanımlar. Tamamen çift bir sinyal (sıfırda merkezlenmiş bir üçgen dalga gibi) her $n$ için $b_n = 0$'a sahiptir. Tamamen tek bir sinyal (sıfırdan sıçramayla geçen bir testere dişi) için $a_n = 0$. Bu simetrileri integral almadan önce fark etmek işini yarıya indirebilir.</p>

<div class="think-box"><div class="think-label">İLK BİR KONTROL</div><div class="think-body">$f(t) = 3 + 5\\cos(\\omega_0 t)$ olsun. Gözle: $a_0/2 = 3$ olduğundan $a_0 = 6$; $a_1 = 5$; geri kalan tüm katsayılar sıfır. Seri iki terime daralır, tam başladığımız sinyal. Sinyal zaten sonlu bir sinüsoid toplamıysa sonsuza ihtiyaç yok.</div></div>

<h2 class="lesson-title">3. Katsayıları Hesaplamak</h2>

<p class="l-text">Şimdi $a_n$ ve $b_n$'in sayısal değerlerini veren integral formüllerini türetiyoruz. Tüm türetme Ders 1'de kanıtladığın <strong>diklik</strong> özelliklerine dayanır; yani $m \\neq n$ olduğunda $\\cos(m\\omega_0 t)\\cos(n\\omega_0 t)$'nin tam bir periyot üzerindeki integralinin yok olması, ve aynısının sinüsler ve sinüs-kosinüs çapraz terimleri için de geçerli olması.</p>

<div class="calc-formula"><div class="formula-label">DİKLİK BAĞINTILARI (Ders 1'den özet)</div><div class="formula-main">$$\\int_0^T \\cos(m\\omega_0 t)\\cos(n\\omega_0 t)\\,dt = \\begin{cases} T/2 & m=n\\neq 0 \\\\ T & m=n=0 \\\\ 0 & m \\neq n \\end{cases}$$ $$\\int_0^T \\sin(m\\omega_0 t)\\sin(n\\omega_0 t)\\,dt = \\begin{cases} T/2 & m=n\\neq 0 \\\\ 0 & \\text{aksi halde} \\end{cases}$$ $$\\int_0^T \\cos(m\\omega_0 t)\\sin(n\\omega_0 t)\\,dt = 0 \\quad \\text{tüm } m,n \\text{ için.}$$</div><div class="formula-sub">Tam katsayılı armoniklerdeki sinüs ve kosinüsler, herhangi bir tam periyot üzerinde karşılıklı dik bir aile oluşturur.</div></div>

<p class="l-text"><strong>Strateji.</strong> $a_n$ katsayısını çıkarmak için Fourier serisinin her iki tarafını $\\cos(n\\omega_0 t)$ ile çarp ve bir periyot üzerinde integral al. Sağdaki terimlerin biri hariç hepsi sıfıra integral alır ve $a_n$ yalnız kalır. Yöntem, bir vektörü bir taban yönüne o yönle iç çarpım alarak izdüşürmekle aynıdır.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Seriyi $\\cos(n\\omega_0 t)$ ile çarp</div><div class="step-detail">Sabit bir $n \\geq 1$ tamsayısı seç ve şunu yaz: $f(t)\\cos(n\\omega_0 t) = \\frac{a_0}{2}\\cos(n\\omega_0 t) + \\sum_m a_m\\cos(m\\omega_0 t)\\cos(n\\omega_0 t) + \\sum_m b_m\\sin(m\\omega_0 t)\\cos(n\\omega_0 t)$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Bir tam periyot üzerinde integral al</div><div class="step-detail">Diklik gereği, $\\sin\\cdot\\cos$ çapraz terimleri kaybolur, kosinüs-kosinüs çapraz terimleri $m \\neq n$ olduğunda kaybolur, ve DC terim de kaybolur çünkü $n\\geq 1$ için $\\int_0^T \\cos(n\\omega_0 t)\\,dt = 0$. Yalnızca $m=n$ olduğu kosinüs terimi hayatta kalır ve $a_n \\cdot T/2$ katkı yapar.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$a_n$'i çöz</div><div class="step-detail">$\\int_0^T f(t)\\cos(n\\omega_0 t)\\,dt$ integrali $a_n T/2$'ye eşittir, yani $a_n = (2/T) \\int_0^T f(t)\\cos(n\\omega_0 t)\\,dt$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$b_n$ için $\\sin(n\\omega_0 t)$ ile aynısını yap</div><div class="step-detail">Sinüs çarpanı ile uygulanan aynı diklik argümanı $b_n = (2/T) \\int_0^T f(t)\\sin(n\\omega_0 t)\\,dt$ verir.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">DC katsayısı $a_0$</div><div class="step-detail">Kosinüs formülünde $n=0$ koymak $a_0 = (2/T)\\int_0^T f(t)\\,dt$ verir, yani $a_0/2$ tam olarak $f(t)$'nin ortalama değeridir &mdash; Bölüm 2'deki kartların söz verdiği gibi.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">EULER-FOURIER KATSAYI FORMÜLLERİ</div><div class="formula-main">$$a_n = \\frac{2}{T}\\int_0^T f(t)\\cos(n\\omega_0 t)\\,dt, \\qquad b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega_0 t)\\,dt$$ $$a_0 = \\frac{2}{T}\\int_0^T f(t)\\,dt$$</div><div class="formula-sub">Bu üç satır Fourier analizinin işlevsel kalbidir. Karşılaşacağın her ders kitabı formülü bunlardan türer.</div></div>

<div class="l-note"><strong>Geometrik okuma:</strong> Periyodik sinyallerin uzayını sonsuz boyutlu bir iç çarpım uzayı olarak düşün. $\\{1, \\cos(\\omega_0 t), \\sin(\\omega_0 t), \\cos(2\\omega_0 t), \\sin(2\\omega_0 t), \\ldots\\}$ fonksiyonları bir dik tabandır. $a_n$ hesaplamak, $f(t)$'nin $\\cos(n\\omega_0 t)$ taban yönündeki bileşenini hesaplamaktır. $2/T$ çarpanı yalnızca o taban vektörünü normalleyen sabittir.</div>

<h2 class="lesson-title">4. Örnek: Kare Dalga</h2>

<div class="calc-highlight"><strong>Bu örnek neden seçildi?</strong> Kare dalga, sıçrama süreksizliği olan en basit önemsiz periyodik fonksiyondur. Fourier serisi her ilginç özelliği aynı anda sergiler: temiz bir katsayı formülü, yavaş yakınsama, Gibbs aşımı, ve tarihsel olarak şüphecileri serinin gerçek olduğuna ikna eden güzel bir toplam.</div>

<p class="l-text">Periyodu $T = 2\\pi$ olan ve $+1$ ile $-1$ arasında sıçrayan bir kare dalga al:</p>

<div class="calc-formula"><div class="formula-label">KARE DALGA</div><div class="formula-main">$$f(t) = \\begin{cases} +1 & 0 < t < \\pi \\\\ -1 & \\pi < t < 2\\pi \\end{cases}$$</div><div class="formula-sub">Periyot $T = 2\\pi$, temel frekans $\\omega_0 = 1$. Sinyal $t=0$ etrafında tektir, dolayısıyla her $a_n$'in kaybolmasını bekleriz.</div></div>

<p class="l-text"><strong>$a_n$ sıfırdır.</strong> $f(t)$ orijin etrafında tek ve $\\cos(n\\omega_0 t)$ çift olduğundan, integrand $f(t)\\cos(n\\omega_0 t)$ tektir; tek fonksiyonlar simetrik aralıkta sıfıra integral alır. Yani $a_0$ dahil her $n$ için $a_n = 0$ (ortalama değer gözle sıfır). Tüm hareket $b_n$'lerde.</p>

<p class="l-text"><strong>$b_n$'i hesaplamak.</strong> $T = 2\\pi$ ve $\\omega_0 = 1$ ile:</p>

<div class="calc-formula"><div class="formula-label">KARE DALGA KATSAYILARI</div><div class="formula-main">$$b_n = \\frac{2}{2\\pi}\\int_0^{2\\pi} f(t)\\sin(nt)\\,dt = \\frac{1}{\\pi}\\left[\\int_0^{\\pi}\\sin(nt)\\,dt - \\int_{\\pi}^{2\\pi}\\sin(nt)\\,dt\\right]$$</div><div class="formula-sub">Periyodu $+1$ yarısına ve $-1$ yarısına böl.</div></div>

<p class="l-text">$\\int \\sin(nt)\\,dt = -\\cos(nt)/n$ kullanarak her parçayı değerlendirip toparlamak şunu verir:</p>

<div class="calc-formula"><div class="formula-label">TEMİZ SONUÇ</div><div class="formula-main">$$b_n = \\frac{2}{n\\pi}\\bigl[\\,1 - \\cos(n\\pi)\\,\\bigr] = \\begin{cases} \\dfrac{4}{n\\pi} & n \\text{ tek} \\\\[2pt] 0 & n \\text{ çift} \\end{cases}$$</div><div class="formula-sub">Yalnızca tek armonikler hayatta kalır. Çift armonikler dalganın simetrisi nedeniyle tam olarak iptal olur.</div></div>

<div class="calc-formula"><div class="formula-label">KARE DALGANIN FOURIER SERİSİ</div><div class="formula-main">$$f(t) = \\frac{4}{\\pi}\\left[\\,\\sin t + \\frac{1}{3}\\sin 3t + \\frac{1}{5}\\sin 5t + \\frac{1}{7}\\sin 7t + \\cdots\\,\\right]$$</div><div class="formula-sub">Saf tek armonikler, genlikleri $1/n$ ile azalıyor. İlk üç terim şeklin çoğunu zaten yakalar.</div></div>

<div class="calc-example"><div class="example-label">TARİHSEL KONTROL</div><div class="example-body"><strong>Seriyi $t = \\pi/2$'de değerlendir; orada kare dalga $+1$'e eşit:</strong><br><br>$1 = (4/\\pi)\\bigl[\\sin(\\pi/2) + (1/3)\\sin(3\\pi/2) + (1/5)\\sin(5\\pi/2) + \\cdots\\bigr]$<br><br>$= (4/\\pi)\\bigl[1 - 1/3 + 1/5 - 1/7 + \\cdots\\bigr]$<br><br>Düzenleyince ünlü <strong>Leibniz formülü</strong> çıkar: $\\pi/4 = 1 - 1/3 + 1/5 - 1/7 + \\cdots$. Fourier'in serisi, Leibniz'in bir yüzyıl önce çok farklı yöntemlerle keşfettiği bir formülü sessizce sunar &mdash; güçlü bir güven oyu.</div></div>

<div id="plot-l2-square-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=600;var xs=[];var sq=[];var h1=[];var h3=[];var h5=[];
for(var i=0;i<N;i++){var t=-Math.PI+2*Math.PI*i/(N-1);xs.push(t);
sq.push(t>0?1:-1);
h1.push((4/Math.PI)*Math.sin(t));
h3.push((4/Math.PI)*(Math.sin(t)+Math.sin(3*t)/3));
h5.push((4/Math.PI)*(Math.sin(t)+Math.sin(3*t)/3+Math.sin(5*t)/5));}
var d0={x:xs,y:sq,mode:'lines',name:'kare dalga',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:xs,y:h1,mode:'lines',name:'N=1 (temel)',line:{color:'#60a5fa',width:2}};
var d2={x:xs,y:h3,mode:'lines',name:'N=2 (+ 3. armonik)',line:{color:'#34d399',width:2}};
var d3={x:xs,y:h5,mode:'lines',name:'N=3 (+ 5. armonik)',line:{color:'#f59e0b',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'f(t)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.5,1.5]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-square-tr',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> noktalı gri çizgi hedef kare dalga; her renkli eğri bir tek armonik daha ekliyor. Yalnızca 1., 3. ve 5. armoniklerle bile kısmi toplam tartışmasız kare biçimli, ama kenarlar hâlâ dalgalı. Daha çok armonik ekleyince dalgalı kenarlar sıçramalara doğru sıkışır ama hiç kaybolmaz &mdash; sonraki bölüm bunun nedenini açıklıyor.</div></div>

<h2 class="lesson-title">5. Gibbs Olayı</h2>

<div class="calc-highlight"><strong>Bilmece:</strong> Bir kare dalganın Fourier serisini 9, 27, 99 ya da 999 terimle hesaplayıp $t=0$'daki sıçramaya yakınlaştırırsan, kısmi toplamın $+1$ değerini yaklaşık %9 oranında aştığını görürsün. Aşım hiç gitmez. Yalnızca daralır. Bu, 1848'de Henry Wilbraham'ın keşfettiği, unutulan, 1898'de Albert Michelson'ın mekanik harmonik analizörüyle yeniden keşfedilen ve nihayet 1899'da J. Willard Gibbs tarafından açıklanan <strong>Gibbs olayıdır</strong>.</div>

<p class="l-text">Sayısal olarak $N$ terimli kısmi toplamın maksimum değeri şuna yaklaşır:</p>

<div class="calc-formula"><div class="formula-label">GIBBS SABİTİ</div><div class="formula-main">$$\\max_{t} S_N(t) \\xrightarrow{N\\to\\infty}\\; \\frac{2}{\\pi}\\int_0^{\\pi}\\frac{\\sin u}{u}\\,du \\approx 1.0894898\\ldots$$</div><div class="formula-sub">Aşım sıçrama boyutunun yaklaşık %8.95'idir. Evrenseldir: sıçrama süreksizliği olan her sinyal, biçimi ne olursa olsun aynı aşımı sergiler.</div></div>

<p class="l-text"><strong>Neden oluyor?</strong> $S_N(t)$ kısmi toplamı düzgün ve bant sınırlı bir fonksiyondur ($N\\omega_0$ üstünde hiçbir frekans içermez). Bant sınırlı bir fonksiyon anında sıçrayamaz, dolayısıyla süreksizliğin yakınında yukarı salınmak, aşmak ve geri salınmak zorundadır. $N$ büyüdükçe salınım daha dar bir pencereye sıkışır, ama salınımın yüksekliği sıçramanın yaklaşık %9'unda yerleşir. Seri sıçrama dışında noktasal olarak yakınsar ve sıçramada orta noktaya yakınsar, ama düzgün olarak <strong>yakınsamaz</strong>.</p>

<p class="l-text"><strong>Mühendislerin neden umursaması.</strong> Sınırlı bir frekans bandından keskin bir sinyali yeniden inşa ettiğin her yerde &mdash; sayısal filtreler, az katsayılı JPEG sıkıştırma, alçak geçişli devrelerden geçen ani dalga biçimleri &mdash; her kenarın iki tarafında çınlama yapay sesleri alırsın. Ses mühendisleri bunu <em>ön-çınlama</em> ve <em>arka-çınlama</em> olarak bilir; görüntü işleme <em>çınlama</em> der. Üçü de doğrudan Gibbs'in soyudur.</p>

<div id="plot-l2-gibbs-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=2000;var xs=[];var partial1=[];var partial3=[];var partial9=[];var partial27=[];
for(var i=0;i<N;i++){var t=-Math.PI+2*Math.PI*i/(N-1);xs.push(t);
var s1=0,s3=0,s9=0,s27=0;
for(var k=1;k<=53;k+=2){var term=Math.sin(k*t)/k;
  if(k<=1)s1+=term;
  if(k<=5)s3+=term;
  if(k<=17)s9+=term;
  s27+=term;}
partial1.push((4/Math.PI)*s1);partial3.push((4/Math.PI)*s3);
partial9.push((4/Math.PI)*s9);partial27.push((4/Math.PI)*s27);}
var sq=xs.map(function(t){return t>0?1:-1;});
var d0={x:xs,y:sq,mode:'lines',name:'hedef',line:{color:'#9ca3af',width:1.5,dash:'dot'}};
var d1={x:xs,y:partial1,mode:'lines',name:'N=1',line:{color:'#60a5fa',width:1.5}};
var d2={x:xs,y:partial3,mode:'lines',name:'N=3',line:{color:'#34d399',width:1.5}};
var d3={x:xs,y:partial9,mode:'lines',name:'N=9',line:{color:'#f59e0b',width:1.8}};
var d4={x:xs,y:partial27,mode:'lines',name:'N=27 (aşım ≈ 1.09)',line:{color:'#ef4444',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'kısmi toplam',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.3,1.3]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-gibbs-tr',[d0,d1,d2,d3,d4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $N=27$ kısmi toplamı (kırmızı) görsel olarak neredeyse mükemmel bir kare dalga, $t=0$ ve $t=\\pm\\pi$ yakınındaki sıçramalar hariç &mdash; orada yaklaşık %9 aşıyor. $N$'i daha çok artırmak aşımı daraltır ama hiç kısaltmaz. Gibbs iş başında.</div></div>

<div class="think-box"><div class="think-label">PRATİK ÇIKARIM</div><div class="think-body">Sınırlı bir Fourier toplamından keskin bir kenar almak zorunda kaldığında &mdash; grafik tasarımda, ses sentezinde, filtre tasarımında &mdash; aşımı daha fazla armonik kullanarak engelleyemezsin. Ya kabul etmek, ya kenarı önceden yumuşatmak (artık süreksizlik olmasın), ya da keskinliği daha küçük bir aşımla takas eden pencerelenmiş bir toplam kullanmak zorundasın. Bedava öğle yemeği yok.</div></div>

<h2 class="lesson-title">6. Daha Fazla Örnek: Testere Dişi ve Üçgen</h2>

<p class="l-text">İki kanonik dalga biçimi daha resmi tamamlar. Her ikisi de aynı integral tarifiyle hesaplanabilir; her ikisi de sinyalin pürüzsüzlüğünün Fourier katsayılarının ne kadar hızlı söndüğünü nasıl kontrol ettiğini ortaya koyar.</p>

<p class="l-text"><strong>Testere dişi dalgası.</strong> $-\\pi < t < \\pi$ aralığında $f(t) = t$ olarak tanımla ve $2\\pi$ periyoduyla periyodik olarak genişlet. Sinyal orijin etrafında tektir, yani yine $a_n = 0$. Kısa bir parçalı integrasyon şunu verir:</p>

<div class="calc-formula"><div class="formula-label">TESTERE DİŞİ KATSAYILARI</div><div class="formula-main">$$b_n = \\frac{2}{\\pi}\\int_0^{\\pi} t\\sin(nt)\\,dt = \\frac{2}{n}(-1)^{n+1}$$</div><div class="formula-sub">Katsayılar işaret değiştirir ve $1/n$ ile söner &mdash; kare dalgayla aynı yavaş sönüm, çünkü testere dişinin de $\\pm\\pi$'de sıçrama süreksizliği var.</div></div>

<div class="calc-formula"><div class="formula-label">TESTERE DİŞİ SERİSİ</div><div class="formula-main">$$t = 2\\left[\\,\\sin t - \\frac{\\sin 2t}{2} + \\frac{\\sin 3t}{3} - \\frac{\\sin 4t}{4} + \\cdots\\,\\right] \\quad (-\\pi < t < \\pi)$$</div><div class="formula-sub">Sıçramalarda aynı Gibbs olayı, aynı yaklaşık %9 aşım.</div></div>

<p class="l-text"><strong>Üçgen dalgası.</strong> $-\\pi < t < \\pi$ aralığında $f(t) = |t|$ olarak tanımla ve periyodik olarak genişlet. Bu sinyal her yerde süreklidir ve yalnızca eğimi $t=0$'da sıçrar. Sinyal çifttir, yani tüm $b_n = 0$. Kosinüs katsayıları şu şekilde çıkar:</p>

<div class="calc-formula"><div class="formula-label">ÜÇGEN KATSAYILARI</div><div class="formula-main">$$a_0 = \\pi, \\qquad a_n = \\frac{2}{\\pi}\\int_0^{\\pi} t\\cos(nt)\\,dt = \\begin{cases} -\\dfrac{4}{\\pi n^2} & n \\text{ tek} \\\\ 0 & n \\text{ çift, } n\\geq 2 \\end{cases}$$</div><div class="formula-sub">Katsayılar şimdi $1/n^2$ ile söner &mdash; kare dalgaya göre bir tam derece daha hızlı.</div></div>

<div class="calc-formula"><div class="formula-label">ÜÇGEN SERİSİ</div><div class="formula-main">$$|t| = \\frac{\\pi}{2} - \\frac{4}{\\pi}\\left[\\cos t + \\frac{\\cos 3t}{9} + \\frac{\\cos 5t}{25} + \\cdots\\right]$$</div><div class="formula-sub">Yakınsama kare dalgaya göre çok daha hızlı; fonksiyonun kendisinde sıçrama olmadığından Gibbs aşımı yok.</div></div>

<div id="plot-l2-sawtooth-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=600;var xs=[];var saw=[];var s1=[];var s3=[];var s10=[];
for(var i=0;i<N;i++){var t=-Math.PI+2*Math.PI*i/(N-1);xs.push(t);
saw.push(t);
var a=0,b=0,c=0;
for(var k=1;k<=30;k++){var term=2*Math.pow(-1,k+1)*Math.sin(k*t)/k;
  if(k<=1)a+=term;
  if(k<=3)b+=term;
  c+=term;}
s1.push(a);s3.push(b);s10.push(c);}
var d0={x:xs,y:saw,mode:'lines',name:'testere dişi (t)',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:xs,y:s1,mode:'lines',name:'N=1',line:{color:'#60a5fa',width:1.8}};
var d2={x:xs,y:s3,mode:'lines',name:'N=3',line:{color:'#34d399',width:1.8}};
var d3={x:xs,y:s10,mode:'lines',name:'N=30',line:{color:'#ef4444',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'kısmi toplam',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-4,4]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-sawtooth-tr',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> bir, üç ve otuz armonikle yeniden inşa edilen testere dişi hedef (noktalı gri). $\\pm\\pi$'deki sıçramaların yakınında aynı Gibbs aşımına dikkat et, yine sıçrama yüksekliğinin yaklaşık %9'u.</div></div>

<div class="l-note"><strong>Sönüm hızı önemli:</strong> kare dalganın katsayıları $1/n$ gibi düşer, üçgen $1/n^2$, $C^2$ pürüzsüz periyodik bir sinyal $1/n^3$ veya daha hızlı. Pratik kural basittir: <em>sinyal ne kadar pürüzsüzse Fourier katsayıları o kadar hızlı kaybolur</em>. Tersine, yavaş sönüm altta yatan sinyalin bir yerlerde keskin köşe veya sıçrama olduğunun uyarı işaretidir.</div>

<h2 class="lesson-title">7. Yakınsama: Dirichlet Koşulları</h2>

<p class="l-text">Fourier serisini nefes kesici bir özgüvenle yazdı, ama matematikçilerin sıkı $f(t) = \\sum \\ldots$ eşitliğinin gerçekten geçerli olduğu koşullara ihtiyacı vardı. İlk geniş kabul gören cevap 1829'da <strong>Peter Gustav Lejeune Dirichlet</strong>'ten geldi.</p>

<div class="calc-formula"><div class="formula-label">DİRİCHLET KOŞULLARI</div><div class="formula-main">$$\\text{Periyodik bir } f(t) \\text{ sinyalinin Fourier serisi her noktada yakınsar, eğer bir periyot üzerinde } f \\text{:}$$</div><div class="formula-sub">(1) sınırlıysa; (2) en fazla sonlu sayıda maksimum ve minimuma sahipse; (3) en fazla sonlu sayıda sonlu süreksizliğe sahipse; (4) mutlak integrallenebilirse, yani $\\int_0^T |f(t)|\\,dt < \\infty$ ise.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sınırlı</div><div class="card-body">Bazı sonlu $M$ için $|f(t)| \\leq M$. Bir periyot içinde sonsuza giden sinyalleri dışlar.</div></div>
<div class="calc-card"><div class="card-title">Sonlu sayıda ekstremum</div><div class="card-body">Sonlu bir aralıkta sonsuz hızlı salınım yok. $t=0$ yakınındaki $\\sin(1/t)$ sinyali klasik karşı örnektir.</div></div>
<div class="calc-card"><div class="card-title">Sonlu sayıda süreksizlik</div><div class="card-body">Sıçramalara izin verilir (bir kare dalga sorun değil), ama periyot başına sınırlı sayıda ve her sıçrama büyüklük olarak sonlu olmalı.</div></div>
<div class="calc-card"><div class="card-title">Mutlak integrallenebilir</div><div class="card-body">$|f|$'in bir periyot üzerindeki alanı sonludur. Hemen hemen her fiziksel olarak gerçekleştirilebilir sinyal bunu otomatik sağlar.</div></div>
</div>

<p class="l-text"><strong>Seri neye yakınsar?</strong> $f$'in sürekli olduğu yerlerde seri $f(t)$'nin kendisine yakınsar. Bir sıçrama $f(t_0^-)$'den $f(t_0^+)$'a giderken, seri orta nokta $\\bigl(f(t_0^-) + f(t_0^+)\\bigr)/2$'ye yakınsar &mdash; iki yandan birine değil. Kare dalga için bu, serinin $t = 0$ ve $t = \\pi$'de tam olarak $0$'a değerlendiği anlamına gelir, dalganın orada süreksiz olmasına rağmen. Bu bir özellik, hata değil.</p>

<div class="think-box"><div class="think-label">HIZLI BİR SAĞLAMA</div><div class="think-body">Kare dalga dört Dirichlet koşulunu da sağlıyor mu? Sınırlı: evet ($|f| \\leq 1$). Sonlu sayıda ekstremum: evet, periyot başına iki. Sonlu sayıda sonlu sıçrama: evet, $2$ büyüklüğünde periyot başına iki tane. Mutlak integrallenebilir: evet ($\\int_0^{2\\pi} 1\\,dt = 2\\pi$). Yani seri yakınsar &mdash; sıçramaların dışında $\\pm 1$'e ve sıçramalarda $0$'a, bu grafiklerin gösterdiğiyle uyuşuyor.</div></div>

<div class="l-note"><strong>Modern bir incelik (Carleson, 1966):</strong> Lennart Carleson, bir periyot üzerinde yalnızca kare integrallenebilir herhangi bir fonksiyon için Fourier serisinin neredeyse her noktada $f(t)$'ye yakınsadığını kanıtladı. Bu Dirichlet'in koşullarından çok daha zayıftır ve mühendislik uygulamaları için çoğu teorik kaygıyı susturur.</div>

<h2 class="lesson-title">8. Parseval Teoremi: Enerji Olduğu Yerde Kalır</h2>

<p class="l-text">Bir Fourier serisi $f(t)$'nin yalnızca yeniden ifadesidir. Fiziksel olarak hiçbir şey değişmemelidir. Özellikle, <strong>enerji</strong> &mdash; sinyalin karesinin zaman ortalaması olarak tanımlanan &mdash; ister zaman alanında ister armoniklerin karesi alınmış genliklerini toplayarak hesaplansın tam olarak aynı olmalıdır. Bu Parseval teoreminin içeriğidir.</p>

<div class="calc-formula"><div class="formula-label">PARSEVAL TEOREMİ (TRİGONOMETRİK BİÇİM)</div><div class="formula-main">$$\\frac{1}{T}\\int_0^T |f(t)|^2\\,dt = \\left(\\frac{a_0}{2}\\right)^{\\!2} + \\frac{1}{2}\\sum_{n=1}^{\\infty}\\bigl(a_n^2 + b_n^2\\bigr)$$</div><div class="formula-sub">Solda zaman-ortalamalı güç; sağda karesi alınmış armonik genliklerinin toplamı. İkisi eşittir.</div></div>

<p class="l-text"><strong>$1/2$ çarpanı.</strong> Genliği $A$ olan saf bir kosinüsün zaman-ortalamalı gücü $A^2/2$'dir, $A^2$ değil. Parseval formülündeki $1/2$ çarpanı yalnızca her sinüsoidal armoniğin ortalama güce karesi alınmış genliğinin yarısı kadar katkıda bulunduğunu kaydeder.</p>

<div class="calc-example"><div class="example-label">KARE DALGADA KONTROL</div><div class="example-body"><strong>Sol taraf:</strong> $(1/T)\\int_0^T |f|^2\\,dt = 1$, çünkü $|f|^2 = 1$ her yerde.<br><br><strong>Sağ taraf:</strong> sıfır olmayan tek katsayılar tek $n$ için $b_n = 4/(n\\pi)$, dolayısıyla toplam şu olur:<br><br>$\\frac{1}{2}\\sum_{n\\,\\text{tek}} \\bigl(4/n\\pi\\bigr)^2 = \\frac{8}{\\pi^2}\\sum_{n\\,\\text{tek}} \\frac{1}{n^2}$.<br><br>Klasik özdeşlik $\\sum_{n\\,\\text{tek}} 1/n^2 = \\pi^2/8$ kullanılarak sağ taraf $1$'e eşittir. Parseval geçerli ve yan ürün olarak ünlü bir kapalı-form toplamı yeniden türetmiş olduk.</div></div>

<div id="plot-l2-energy-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nmax=40;var ns=[];var energy=[];var total=0;
for(var k=1;k<=Nmax;k+=2){var bn=4/(k*Math.PI);total+=0.5*bn*bn;}
var running=0;
for(var k=1;k<=Nmax;k+=2){var bn=4/(k*Math.PI);running+=0.5*bn*bn;ns.push(k);energy.push(running/total);}
var d1={x:ns,y:energy,mode:'lines+markers',name:'kümülatif enerji oranı',line:{color:'#60a5fa',width:2.5},marker:{size:7,color:'#60a5fa'}};
var d2={x:[0,Nmax],y:[1,1],mode:'lines',name:'toplam (Parseval limiti)',line:{color:'#34d399',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'dahil edilen en yüksek tek armonik',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'toplam gücün oranı',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[0,1.05]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l2-energy-tr',[d1,d2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> kare dalganın toplam gücünün ilk $k$ tek armonik tarafından yakalanan kümülatif oranı. Yalnızca temel frekans enerjinin yaklaşık %81'ini tutar; 3. armoniği eklemek %90'ın üzerine çıkarır; ilk üç tek armonik birlikte yaklaşık %95'i tutar. Kalan %5 sonsuz bir kuyruğa yayılmıştır ve keskin kenarlardan (ve Gibbs çınlamasından) sorumludur.</div></div>

<div id="plot-l2-coefs-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var ks=[];var bs=[];
for(var k=1;k<=15;k++){ks.push(k);bs.push(k%2===1?4/(k*Math.PI):0);}
var d1={x:ks,y:bs,type:'bar',name:'|bₙ| kare dalga',marker:{color:'#60a5fa'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'armonik n',gridcolor:'#1f2937',zerolinecolor:'#374151',dtick:1},yaxis:{title:'|bₙ|',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-coefs-tr',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> kare dalga için $|b_n|$ büyüklükleri. Yalnızca tek armonikler mevcut; yükseklikleri $1/n$ ile azalır. Çubuk grafiği sinyalin <em>spektrumudur</em> ve $f(t)$'yi yeniden inşa etmek için gereken her bilgiyi içerir.</div></div>

<div class="l-note"><strong>Parseval pratikte neden önemli:</strong> kaç armoniğe ihtiyacın olduğuna karar vermek için sayısal bir yol sunar. Bir sinyalin enerjisinin %99'unu tutmak istiyorsan, kümülatif güç $0.99$'u geçtiği anda armonik eklemeyi durdurabilirsin. Teorem "bu yaklaşıklık yeterince iyi mi?" gibi belirsiz bir soruyu sert bir sayısal ölçüte dönüştürür.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Ne gözlemlemelisin.</strong> Sayısal $b_n$'ler tek $n$ için teorik $4/(n\\pi)$ ile dört ondalık basamağa kadar uyuşur ve çift $n$ için temelde sıfırdır. $N$ büyüdükçe aşım yaklaşık $0.089$'da kararlı kalır, tam olarak Gibbs öngörüsü. Tutulan enerji oranı bire yaklaşır ama yavaş tırmanır &mdash; keskin köşeleri üreten yüksek frekans kuyruğunu yakalamak için çok armoniğe ihtiyacın olur.</p>

<div class="think-box"><div class="think-label">DENENECEK BİRKAÇ DENEY</div><div class="think-body">$T$ periyodunu değiştir ve yeniden çalıştır: formüller hâlâ çalışıyor mu? <code>np.sign(np.sin(...))</code> yerine <code>t</code> (bir periyoda kırpılmış) yaz, testere dişi için yap ve $b_n$'in işaretlerinin değiştiğini izle. <code>np.abs(t-np.pi)</code> yaz, üçgen için yap ve birdenbire $a_n$'in sıfırdan farklı, $b_n$'in sıfır olduğunu gözlemle. Aynı kod, üç farklı dalga biçimi.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceklerin:</strong> makul herhangi bir periyodik sinyalin Fourier serisini yazabilir, katsayılarını ister elle ister sayısal olarak hesaplayabilir, Gibbs aşımının nerede çıkacağını öngörebilir, ve kaç armoniğin yeterli olduğunu tahmin etmek için Parseval teoremini kullanabilirsin. Bir sonraki ders, yaptığımız her şeyi karmaşık üstellerin çok daha temiz diline yeniden kodlayacak &mdash; her modern ders kitabının ve yazılım kütüphanesinin gerçekten kullandığı biçim.</div>
`
};
