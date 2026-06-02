window.FOURIER_L4 = {

en: `<p class="l-text"><strong>The Continuous Fourier Transform is the great generalization.</strong> Fourier Series gave us a way to decompose <em>periodic</em> functions into a discrete spectrum of sines and cosines. But the world is full of signals that never repeat — a single clap of thunder, a transient pulse, an exponentially decaying wave. For these, the discrete spectrum of integers <code>n &middot; \\omega_0</code> is far too sparse. We need a <strong>continuous</strong> spectrum, and the Fourier Transform delivers exactly that.</p>

<p class="l-text">This lesson takes you carefully from Fourier Series to the Fourier Transform via a limiting argument, then walks through the three canonical examples every engineer must know by heart (rectangular pulse, Gaussian, exponential decay), proves the most important properties (especially the <strong>convolution theorem</strong>), and ends at one of the most profound inequalities in mathematics: the <strong>uncertainty principle</strong>, the same inequality that governs Heisenberg's quantum mechanics.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the Fourier Transform as the limit of Fourier Series as the period grows to infinity</li>
<li>State the forward and inverse transform and justify the symmetric structure and the 1/(2 pi) factor</li>
<li>Compute the Fourier Transform of a rectangular pulse, a Gaussian, and a one-sided exponential by hand</li>
<li>Apply the six core properties (linearity, time/frequency shift, scaling, convolution, differentiation)</li>
<li>Verify Parseval/Plancherel and explain why total energy is preserved between time and frequency domains</li>
<li>Connect the uncertainty principle to both signal processing and the Heisenberg inequality of quantum physics</li>
</ul>
</div>

<h2 class="l-title">1. The Problem with Fourier Series</h2>

<p class="l-text">Fourier Series, beautiful as they are, suffer from one severe restriction: <strong>they only describe periodic functions</strong>. If your signal repeats every <code>T</code> seconds, the series</p>

<div class="calc-formula"><div class="formula-label">FOURIER SERIES (REVIEW)</div><div class="formula-main">$$f(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\, e^{i n \\omega_0 t}, \\qquad \\omega_0 = \\frac{2\\pi}{T}$$</div><div class="formula-sub">Discrete spectrum at integer multiples of the fundamental frequency.</div></div>

<p class="l-text">decomposes <code>f(t)</code> into a <em>discrete</em> set of frequencies: <code>0, \\pm\\omega_0, \\pm 2\\omega_0, \\pm 3\\omega_0, \\ldots</code> — the integer harmonics. But ask yourself: what is the spectrum of a single rectangular pulse that lives only on <code>[-1, 1]</code> and is zero everywhere else? It is not periodic, so there is no <code>T</code>, no <code>\\omega_0</code>, no <code>c_n</code>. The Fourier Series machinery breaks down.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periodic Signal</div><div class="card-body">A tuning fork at 440 Hz, a square wave on an oscilloscope, AC current at 50 Hz. Fourier Series fits perfectly: discrete spectrum at integer multiples of the fundamental.</div></div>
<div class="calc-card"><div class="card-title">Aperiodic Signal</div><div class="card-body">A single click, a sonic boom, an exponential decay after touching a guitar string. No repetition. The discrete spectrum is too coarse to describe it.</div></div>
<div class="calc-card"><div class="card-title">Resolution Needed</div><div class="card-body">We need a way to assign an amplitude (or complex coefficient) to <em>every</em> real frequency, not just integer multiples. We need a continuous spectrum.</div></div>
<div class="calc-card"><div class="card-title">The Trick</div><div class="card-body">Take a Fourier Series and let the period <code>T</code> grow to infinity. Watch what happens to the discrete spectrum as the spacing between harmonics shrinks to zero.</div></div>
</div>

<div class="l-note"><strong>Intuition:</strong> Imagine zooming out on a comb. From far away the teeth look like a continuous bar. In the same way, as <code>T \\to \\infty</code> the spacing <code>\\Delta\\omega = \\omega_0 = 2\\pi/T</code> between harmonics shrinks to zero — the discrete spectrum melts into a continuum.</div>

<h2 class="l-title">2. The Limiting Trick</h2>

<p class="l-text">Start from the Fourier Series of a function defined on the interval <code>[-T/2, T/2]</code> and extended periodically:</p>

<div class="calc-formula"><div class="formula-label">FOURIER SERIES PAIR</div><div class="formula-main">$$f(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\, e^{i n \\omega_0 t}, \\qquad c_n = \\frac{1}{T}\\int_{-T/2}^{T/2} f(t)\\, e^{-i n \\omega_0 t}\\, dt$$</div><div class="formula-sub">Two formulas: synthesis (left) reconstructs f from coefficients; analysis (right) extracts them.</div></div>

<p class="l-text">Now introduce a piece of clever notation. Define</p>

<div class="calc-formula"><div class="formula-label">REPLACEMENT</div><div class="formula-main">$$\\omega_n = n \\omega_0, \\qquad \\Delta\\omega = \\omega_0 = \\frac{2\\pi}{T}, \\qquad F(\\omega_n) = T \\cdot c_n$$</div><div class="formula-sub">The new symbol F(omega_n) rescales the coefficient by T so the result stays finite as T grows.</div></div>

<p class="l-text">With these substitutions the analysis equation becomes</p>

<div class="calc-formula"><div class="formula-label">REWRITTEN ANALYSIS</div><div class="formula-main">$$F(\\omega_n) = \\int_{-T/2}^{T/2} f(t)\\, e^{-i \\omega_n t}\\, dt$$</div><div class="formula-sub">No T in front anymore — we absorbed the 1/T into our new variable.</div></div>

<p class="l-text">and the synthesis equation becomes</p>

<div class="calc-formula"><div class="formula-label">REWRITTEN SYNTHESIS</div><div class="formula-main">$$f(t) = \\sum_{n=-\\infty}^{\\infty} \\frac{F(\\omega_n)}{T}\\, e^{i \\omega_n t} = \\frac{1}{2\\pi}\\sum_{n=-\\infty}^{\\infty} F(\\omega_n)\\, e^{i \\omega_n t}\\, \\Delta\\omega$$</div><div class="formula-sub">The last step uses 1/T = Delta-omega / (2 pi). Now it looks exactly like a Riemann sum.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Let T grow without bound</div><div class="step-detail">As <code>T \\to \\infty</code> the spacing <code>\\Delta\\omega = 2\\pi/T</code> shrinks to zero, the integration interval <code>[-T/2, T/2]</code> stretches to all of <code>\\mathbb{R}</code>, and the discrete index <code>\\omega_n</code> becomes a continuous variable <code>\\omega</code>.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">The integral survives</div><div class="step-detail">The expression for <code>F(\\omega_n)</code> turns into the continuous integral <code>F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i \\omega t}\\, dt</code>. This is the <strong>forward Fourier Transform</strong>.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">The sum becomes an integral</div><div class="step-detail">The Riemann sum <code>\\sum F(\\omega_n)\\, e^{i \\omega_n t}\\, \\Delta\\omega</code> converges to the integral <code>\\int F(\\omega)\\, e^{i \\omega t}\\, d\\omega</code>. Divide by <code>2\\pi</code> and you have the <strong>inverse Fourier Transform</strong>.</div></div></div>
</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why did we have to multiply by <code>T</code> when defining <code>F(\\omega_n) = T \\cdot c_n</code>? Because for a non-periodic signal supported on a tiny region, the average <code>c_n = \\frac{1}{T}\\int f e^{-i\\omega_n t} dt</code> vanishes as <code>T \\to \\infty</code> (you are averaging over more and more empty space). Multiplying by <code>T</code> rescales so the limit is finite and meaningful.</div></div>

<h2 class="l-title">3. The Fourier Transform Definition</h2>

<p class="l-text">We are now ready to write the central pair of formulas of all signal processing:</p>

<div class="calc-formula"><div class="formula-label">CONTINUOUS FOURIER TRANSFORM (CFT)</div><div class="formula-main">$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i \\omega t}\\, dt$$</div><div class="formula-sub">FORWARD transform: time-domain signal f(t) to frequency-domain spectrum F(omega).</div></div>

<div class="calc-formula"><div class="formula-label">INVERSE CONTINUOUS FOURIER TRANSFORM (ICFT)</div><div class="formula-main">$$f(t) = \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} F(\\omega)\\, e^{i \\omega t}\\, d\\omega$$</div><div class="formula-sub">INVERSE transform: rebuild the time-domain signal by summing complex exponentials weighted by F(omega).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward = Analysis</div><div class="card-body">Given a signal in time, ask how much of each frequency it contains. The integral <code>F(\\omega)</code> measures the "amount" of pure tone <code>e^{i\\omega t}</code> hidden in <code>f(t)</code>.</div></div>
<div class="calc-card"><div class="card-title">Inverse = Synthesis</div><div class="card-body">Given the spectrum, recreate the signal by summing every frequency component weighted by <code>F(\\omega)</code>. The factor <code>1/(2\\pi)</code> normalizes the integration measure.</div></div>
<div class="calc-card"><div class="card-title">Symmetry of the Pair</div><div class="card-body">Forward and inverse differ only by the sign of the exponent and the <code>1/(2\\pi)</code> prefactor. Many books use <code>1/\\sqrt{2\\pi}</code> in <em>both</em> formulas — purely a normalization choice, no physics changes.</div></div>
<div class="calc-card"><div class="card-title">Notation</div><div class="card-body">We write <code>F(\\omega) = \\mathcal{F}\\{f(t)\\}</code> for the forward transform and <code>f(t) = \\mathcal{F}^{-1}\\{F(\\omega)\\}</code> for the inverse. The pair is also denoted <code>f(t) \\leftrightarrow F(\\omega)</code>.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">ANGULAR FREQUENCY (omega)</div>
<div class="compare-item">Variable: <code>\\omega</code> in radians per second</div>
<div class="compare-item">Forward: <code>\\int f e^{-i\\omega t} dt</code></div>
<div class="compare-item">Inverse: <code>\\frac{1}{2\\pi}\\int F e^{i\\omega t} d\\omega</code></div>
<div class="compare-item">Standard in math/physics</div>
</div>
<div class="compare-col">
<div class="compare-title">ORDINARY FREQUENCY (xi)</div>
<div class="compare-item">Variable: <code>\\xi</code> in cycles per second (Hz)</div>
<div class="compare-item">Forward: <code>\\int f e^{-i 2\\pi \\xi t} dt</code></div>
<div class="compare-item">Inverse: <code>\\int F e^{i 2\\pi \\xi t} d\\xi</code> (no <code>1/(2\\pi)</code>!)</div>
<div class="compare-item">Standard in engineering/EE</div>
</div>
</div>

<div class="l-note"><strong>Convention warning:</strong> When you read a paper or textbook always check which convention is in use. The <code>2\\pi</code> can hide in the exponent (Hz convention) or out front of the inverse (angular convention), or be split symmetrically as <code>1/\\sqrt{2\\pi}</code> in both. None of these is "right" — they differ only by where the constant lives.</div>

<h2 class="l-title">4. Existence and the L¹/L² Spaces</h2>

<p class="l-text">An integral over all of <code>\\mathbb{R}</code> does not automatically converge. We need conditions on <code>f</code> to guarantee that the Fourier Transform exists at all. The two most useful conditions involve the integrability of <code>f</code>.</p>

<div class="calc-formula"><div class="formula-label">L^1 CONDITION</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} |f(t)|\\, dt < \\infty$$</div><div class="formula-sub">f is absolutely integrable. Then F(omega) is a bounded, continuous function (Riemann-Lebesgue lemma: F vanishes at infinity).</div></div>

<div class="calc-formula"><div class="formula-label">L^2 CONDITION (PLANCHEREL)</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} |f(t)|^2\\, dt < \\infty$$</div><div class="formula-sub">f has finite energy. Then F also lies in L^2 and the integral is defined in a limit sense. This is the class of "physically meaningful" signals.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">L^1 functions</div><div class="card-body">All of <code>f(t)</code>'s mass fits under the curve. Rectangular pulses, Gaussians, one-sided exponentials — these are textbook L^1 examples. The Fourier Transform is a perfectly ordinary function.</div></div>
<div class="calc-card"><div class="card-title">L^2 functions</div><div class="card-body">Finite energy. The class includes L^1 functions but also things like <code>\\text{sinc}(t)</code>, which decays too slowly to be L^1 yet has finite energy. Plancherel extends the transform here in a careful limit.</div></div>
<div class="calc-card"><div class="card-title">Pathological cases</div><div class="card-body">Functions like <code>f(t) = 1</code> or <code>f(t) = \\cos(\\omega_0 t)</code> are neither L^1 nor L^2. They have Fourier Transforms only in the <strong>distributional</strong> sense — the answer is a Dirac delta. We will see this in Lesson 6.</div></div>
</div>

<div class="l-note"><strong>Engineer's shortcut:</strong> For everything in this lesson — pulses, Gaussians, exponentials — both <code>L^1</code> and <code>L^2</code> conditions are satisfied trivially. You may safely compute integrals and exchange limit operations without losing sleep. The functional-analytic technicalities matter only when you push to delta functions and tempered distributions.</div>

<h2 class="l-title">5. Canonical Example 1: Rectangular Pulse</h2>

<p class="l-text">The rectangular pulse is the simplest non-trivial signal. Define</p>

<div class="calc-formula"><div class="formula-label">RECTANGULAR PULSE OF HALF-WIDTH a</div><div class="formula-main">$$\\text{rect}_a(t) = \\begin{cases} 1 & \\text{if } |t| < a \\\\ 0 & \\text{otherwise} \\end{cases}$$</div><div class="formula-sub">A box of height 1 centered at the origin, supported on the interval [-a, a].</div></div>

<p class="l-text">Apply the forward transform definition:</p>

<div class="calc-formula"><div class="formula-label">DERIVATION</div><div class="formula-main">$$F(\\omega) = \\int_{-a}^{a} 1 \\cdot e^{-i\\omega t}\\, dt = \\left[\\frac{e^{-i\\omega t}}{-i\\omega}\\right]_{-a}^{a} = \\frac{e^{-i\\omega a} - e^{i\\omega a}}{-i\\omega}$$</div><div class="formula-sub">Standard antiderivative of a complex exponential, evaluated at the endpoints.</div></div>

<p class="l-text">Recall Euler's identity <code>e^{i\\theta} - e^{-i\\theta} = 2i\\sin\\theta</code>, so</p>

<div class="calc-formula"><div class="formula-label">SIMPLIFIED RESULT</div><div class="formula-main">$$F(\\omega) = \\frac{2\\sin(\\omega a)}{\\omega} = 2a \\cdot \\frac{\\sin(\\omega a)}{\\omega a}$$</div><div class="formula-sub">The famous sinc function appears (here in its "unnormalized" form sin(x)/x).</div></div>

<p class="l-text">Or, using the normalized sinc <code>\\text{sinc}(x) = \\sin(\\pi x)/(\\pi x)</code> common in engineering,</p>

<div class="calc-formula"><div class="formula-label">FOURIER TRANSFORM OF rect_a</div><div class="formula-main">$$\\mathcal{F}\\{\\text{rect}_a(t)\\} = 2a \\cdot \\text{sinc}\\!\\left(\\frac{a\\omega}{\\pi}\\right)$$</div><div class="formula-sub">A finite-width pulse in time produces an infinite ringing sinc in frequency.</div></div>

<div id="plot-rect-sinc-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0;
var t=[];var ft=[];for(var i=-400;i<=400;i++){var x=i/100;t.push(x);ft.push(Math.abs(x)<a?1:0);}
var w=[];var Fw=[];for(var j=-800;j<=800;j++){var ww=j/40;w.push(ww);Fw.push(Math.abs(ww)<1e-9?2*a:2*Math.sin(ww*a)/ww);}
var tr1={x:t,y:ft,mode:"lines",name:"rect_a(t)",line:{color:"#3b82f6",width:2.5},xaxis:"x1",yaxis:"y1"};
var tr2={x:w,y:Fw,mode:"lines",name:"F(omega)=2 sin(omega a)/omega",line:{color:"#f59e0b",width:2.5},xaxis:"x2",yaxis:"y2"};
var layout={grid:{rows:1,columns:2,pattern:"independent"},paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t (time)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3,3]},yaxis:{title:"rect_a(t)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.2,1.4]},xaxis2:{domain:[0.54,1],title:"omega (rad/s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-20,20]},yaxis2:{title:"F(omega)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.8,2.4]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-rect-sinc-en",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Left:</strong> a rectangular pulse of half-width <code>a=1</code>. <strong>Right:</strong> its Fourier Transform <code>2\\sin(\\omega)/\\omega</code> — a sinc that crosses zero at <code>\\omega = \\pi, 2\\pi, 3\\pi, \\ldots</code> with slowly decaying side lobes that ring all the way to infinity.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sharp edges = high frequencies</div><div class="card-body">The rectangular pulse has two perfectly vertical edges. Vertical edges require infinitely high frequencies to reconstruct — hence the slow <code>1/\\omega</code> decay of the sinc and the prominent ringing.</div></div>
<div class="calc-card"><div class="card-title">Narrow pulse, wide spectrum</div><div class="card-body">As <code>a \\to 0</code> the pulse narrows but the sinc <em>widens</em> (zero crossings move out to <code>\\pi/a, 2\\pi/a, \\ldots</code>). This is your first concrete glimpse of the uncertainty principle.</div></div>
<div class="calc-card"><div class="card-title">Gibbs phenomenon</div><div class="card-body">If you keep only finitely many frequencies and rebuild the pulse, you get persistent overshoot at the edges (about 9% of the jump height). It does not go away as you add more terms — only narrows.</div></div>
</div>

<h2 class="l-title">6. Canonical Example 2: Gaussian</h2>

<p class="l-text">The next example is the most magical result in elementary Fourier analysis. Define a Gaussian centered at <code>0</code> with width <code>\\sigma</code>:</p>

<div class="calc-formula"><div class="formula-label">GAUSSIAN</div><div class="formula-main">$$f(t) = e^{-t^2 / (2\\sigma^2)}$$</div><div class="formula-sub">The bell curve. No prefactor — we ignore the probability normalization for clarity.</div></div>

<p class="l-text">Plug into the forward transform:</p>

<div class="calc-formula"><div class="formula-label">SET UP</div><div class="formula-main">$$F(\\omega) = \\int_{-\\infty}^{\\infty} e^{-t^2/(2\\sigma^2)}\\, e^{-i\\omega t}\\, dt = \\int_{-\\infty}^{\\infty} e^{-\\left(t^2/(2\\sigma^2) + i\\omega t\\right)}\\, dt$$</div><div class="formula-sub">Combine both exponents into a single quadratic-plus-linear expression in t.</div></div>

<p class="l-text">Now complete the square inside the exponent. Write</p>

<div class="calc-formula"><div class="formula-label">COMPLETE THE SQUARE</div><div class="formula-main">$$\\frac{t^2}{2\\sigma^2} + i\\omega t = \\frac{1}{2\\sigma^2}\\left(t^2 + 2i\\omega\\sigma^2 t\\right) = \\frac{1}{2\\sigma^2}\\left[(t + i\\omega\\sigma^2)^2 + \\omega^2\\sigma^4\\right]$$</div><div class="formula-sub">Add and subtract (omega sigma^2)^2 inside the bracket to form a perfect square.</div></div>

<p class="l-text">Substitute back:</p>

<div class="calc-formula"><div class="formula-label">SEPARATED FORM</div><div class="formula-main">$$F(\\omega) = e^{-\\sigma^2 \\omega^2 / 2}\\int_{-\\infty}^{\\infty} e^{-(t + i\\omega\\sigma^2)^2 / (2\\sigma^2)}\\, dt$$</div><div class="formula-sub">The omega-dependent factor pulls out of the integral.</div></div>

<p class="l-text">The remaining integral is the standard Gaussian integral (the contour shift by the imaginary constant <code>i\\omega\\sigma^2</code> does not change its value, by Cauchy's theorem). We use</p>

<div class="calc-formula"><div class="formula-label">GAUSSIAN INTEGRAL</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} e^{-u^2 / (2\\sigma^2)}\\, du = \\sigma\\sqrt{2\\pi}$$</div><div class="formula-sub">A classic result, provable by squaring the integral and converting to polar coordinates.</div></div>

<p class="l-text">Putting it together:</p>

<div class="calc-formula"><div class="formula-label">FOURIER TRANSFORM OF A GAUSSIAN</div><div class="formula-main">$$\\boxed{\\,\\mathcal{F}\\!\\left\\{e^{-t^2/(2\\sigma^2)}\\right\\} = \\sigma\\sqrt{2\\pi}\\;\\, e^{-\\sigma^2 \\omega^2 / 2}\\,}$$</div><div class="formula-sub">A Gaussian in time becomes a Gaussian in frequency. The transform of a Gaussian IS a Gaussian.</div></div>

<div id="plot-gaussian-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var sig=1.0;
var t=[];var ft=[];for(var i=-500;i<=500;i++){var x=i/50;t.push(x);ft.push(Math.exp(-x*x/(2*sig*sig)));}
var w=[];var Fw=[];for(var j=-500;j<=500;j++){var ww=j/50;w.push(ww);Fw.push(sig*Math.sqrt(2*Math.PI)*Math.exp(-sig*sig*ww*ww/2));}
var tr1={x:t,y:ft,mode:"lines",name:"f(t)=exp(-t^2/(2 sigma^2))",line:{color:"#3b82f6",width:2.5},xaxis:"x1",yaxis:"y1"};
var tr2={x:w,y:Fw,mode:"lines",name:"F(omega)=sigma sqrt(2 pi) exp(-sigma^2 omega^2 /2)",line:{color:"#f59e0b",width:2.5},xaxis:"x2",yaxis:"y2"};
var layout={grid:{rows:1,columns:2,pattern:"independent"},paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t (sigma=1)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-6,6]},yaxis:{title:"f(t)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},xaxis2:{domain:[0.54,1],title:"omega (rad/s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-6,6]},yaxis2:{title:"F(omega)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.3,3]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-gaussian-en",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Left:</strong> time-domain Gaussian with <code>\\sigma = 1</code>. <strong>Right:</strong> its Fourier Transform, also a Gaussian, with width <code>1/\\sigma = 1</code>. The Gaussian is the only function whose Fourier Transform is the same shape as itself.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Width inversion</div><div class="card-body">The time-domain Gaussian has width <code>\\sigma</code>. The frequency-domain Gaussian has width <code>1/\\sigma</code>. Make the time signal narrower and the spectrum widens by exactly the same factor.</div></div>
<div class="calc-card"><div class="card-title">Eigenfunction of the FT</div><div class="card-body">The Gaussian is (up to scaling) the only function for which <code>\\mathcal{F}\\{f\\} = c \\cdot f</code>. In quantum mechanics this makes Gaussian wave packets the "minimum-uncertainty" states.</div></div>
<div class="calc-card"><div class="card-title">Why no ringing?</div><div class="card-body">Unlike the rectangular pulse, the Gaussian is smooth (infinitely differentiable). No sharp edges, hence no high-frequency tail, hence no ringing — just another smooth Gaussian.</div></div>
</div>

<div class="think-box"><div class="think-label">WHY THIS MATTERS</div><div class="think-body">The Gaussian-to-Gaussian property is the deepest fact of elementary Fourier analysis. It tells you that smoothness in time corresponds to fast decay in frequency, and vice versa. It also gives the cleanest demonstration of the uncertainty principle: <code>\\sigma_t \\cdot \\sigma_\\omega = 1</code> exactly, and the Gaussian saturates Heisenberg's inequality.</div></div>

<h2 class="l-title">7. Canonical Example 3: Exponential Decay</h2>

<p class="l-text">The third standard example arises everywhere physical systems relax to equilibrium: capacitors discharging, radioactive decay, damped oscillators. Define</p>

<div class="calc-formula"><div class="formula-label">ONE-SIDED EXPONENTIAL DECAY</div><div class="formula-main">$$f(t) = \\begin{cases} e^{-at} & \\text{if } t > 0 \\\\ 0 & \\text{if } t \\le 0 \\end{cases} \\qquad (a > 0)$$</div><div class="formula-sub">Causal exponential — zero for negative time, decaying to zero for positive time.</div></div>

<p class="l-text">The forward transform integral runs only from <code>0</code> to <code>\\infty</code>:</p>

<div class="calc-formula"><div class="formula-label">DERIVATION</div><div class="formula-main">$$F(\\omega) = \\int_{0}^{\\infty} e^{-at}\\, e^{-i\\omega t}\\, dt = \\int_{0}^{\\infty} e^{-(a + i\\omega)t}\\, dt$$</div><div class="formula-sub">Combine the exponents — a is real and positive, so the integral converges.</div></div>

<p class="l-text">This is an elementary antiderivative:</p>

<div class="calc-formula"><div class="formula-label">FOURIER TRANSFORM OF EXP DECAY</div><div class="formula-main">$$F(\\omega) = \\left[\\frac{e^{-(a+i\\omega)t}}{-(a+i\\omega)}\\right]_{0}^{\\infty} = \\frac{1}{a + i\\omega}$$</div><div class="formula-sub">The upper limit vanishes because Re(a + i omega) = a > 0. The lower limit gives the result.</div></div>

<p class="l-text">This is complex-valued. The magnitude (the <strong>Lorentzian</strong>) and phase are</p>

<div class="calc-formula"><div class="formula-label">MAGNITUDE AND PHASE</div><div class="formula-main">$$|F(\\omega)| = \\frac{1}{\\sqrt{a^2 + \\omega^2}}, \\qquad \\arg F(\\omega) = -\\arctan\\!\\left(\\frac{\\omega}{a}\\right)$$</div><div class="formula-sub">Magnitude peaks at omega=0 with height 1/a; falls as 1/omega for large omega. Phase rolls from +pi/2 to -pi/2.</div></div>

<div id="plot-exp-decay-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0;
var t=[];var ft=[];for(var i=-100;i<=500;i++){var x=i/50;t.push(x);ft.push(x>0?Math.exp(-a*x):0);}
var w=[];var mag=[];var ph=[];for(var j=-500;j<=500;j++){var ww=j/50;w.push(ww);mag.push(1/Math.sqrt(a*a+ww*ww));ph.push(-Math.atan2(ww,a));}
var tr1={x:t,y:ft,mode:"lines",name:"f(t)=exp(-a t) for t>0",line:{color:"#3b82f6",width:2.5},xaxis:"x1",yaxis:"y1"};
var tr2={x:w,y:mag,mode:"lines",name:"|F(omega)|=1/sqrt(a^2+omega^2)",line:{color:"#f59e0b",width:2.5},xaxis:"x2",yaxis:"y2"};
var tr3={x:w,y:ph,mode:"lines",name:"arg F(omega)",line:{color:"#10b981",width:2,dash:"dot"},xaxis:"x2",yaxis:"y3"};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t (a=1)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,8]},yaxis:{title:"f(t)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},xaxis2:{domain:[0.54,1],title:"omega (rad/s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-10,10],anchor:"y2"},yaxis2:{title:"|F(omega)|",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2],anchor:"x2"},yaxis3:{title:"arg F",overlaying:"y2",side:"right",range:[-2,2],showgrid:false},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:60}};
Plotly.newPlot("plot-exp-decay-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Left:</strong> the causal exponential <code>e^{-t}</code> for <code>t > 0</code>. <strong>Right:</strong> magnitude <code>|F(\\omega)| = 1/\\sqrt{1 + \\omega^2}</code> (orange, Lorentzian shape) and phase <code>\\arg F(\\omega) = -\\arctan(\\omega)</code> (green dotted, varies from <code>+\\pi/2</code> to <code>-\\pi/2</code>).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RC low-pass filter</div><div class="card-body">The impulse response of an RC low-pass filter is exactly <code>(1/\\tau) e^{-t/\\tau}</code>. Its transfer function <code>1/(1 + i\\omega\\tau)</code> is the textbook low-pass shape — high frequencies attenuated, with a phase lag that grows with <code>\\omega</code>.</div></div>
<div class="calc-card"><div class="card-title">Spectral lines</div><div class="card-body">In spectroscopy a decaying excited state has lifetime <code>1/a</code>. Its emission spectrum is a Lorentzian of width <code>\\sim 2a</code> centered at the carrier frequency. Shorter lifetime, broader line — uncertainty again.</div></div>
<div class="calc-card"><div class="card-title">Causality and the Laplace transform</div><div class="card-body">Because <code>f(t) = 0</code> for <code>t < 0</code> the Fourier integral is one-sided. Substituting <code>s = a + i\\omega</code> gives the connection to the Laplace transform — we explore this in Lesson 7.</div></div>
</div>

<h2 class="l-title">8. Key Properties</h2>

<p class="l-text">The Fourier Transform satisfies a half-dozen properties so useful they should be memorized. Each one converts a difficult operation in one domain into a simple operation in the other.</p>

<div class="calc-formula"><div class="formula-label">SIX CORE PROPERTIES</div><div class="formula-main">$$\\begin{array}{l|l|l} \\textbf{Property} & \\textbf{Time domain} & \\textbf{Frequency domain} \\\\ \\hline \\text{Linearity} & \\alpha f(t) + \\beta g(t) & \\alpha F(\\omega) + \\beta G(\\omega) \\\\ \\text{Time shift} & f(t - t_0) & F(\\omega)\\, e^{-i \\omega t_0} \\\\ \\text{Frequency shift} & f(t)\\, e^{i \\omega_0 t} & F(\\omega - \\omega_0) \\\\ \\text{Scaling} & f(a t) & \\tfrac{1}{|a|} F(\\omega / a) \\\\ \\text{Convolution} & (f * g)(t) & F(\\omega)\\, G(\\omega) \\\\ \\text{Differentiation} & \\dfrac{d f}{d t} & i \\omega\\, F(\\omega) \\end{array}$$</div><div class="formula-sub">The convolution theorem is the most consequential single property in all of signal processing.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linearity</div><div class="card-body">Sum of signals goes to sum of spectra. The Fourier Transform is a linear operator — this alone justifies using it as the natural "change of basis" of signal processing.</div></div>
<div class="calc-card"><div class="card-title">Time shift</div><div class="card-body">Delaying a signal by <code>t_0</code> multiplies the spectrum by <code>e^{-i\\omega t_0}</code>. The <em>magnitude</em> <code>|F(\\omega)|</code> is unchanged — only the phase shifts linearly with <code>\\omega</code>. This is why phase carries the time-alignment information of a signal.</div></div>
<div class="calc-card"><div class="card-title">Frequency shift (modulation)</div><div class="card-body">Multiplying a signal by <code>e^{i\\omega_0 t}</code> in time shifts its entire spectrum by <code>\\omega_0</code> in frequency. This is exactly what an AM/FM radio carrier does — bringing audio-band frequencies up to MHz for transmission.</div></div>
<div class="calc-card"><div class="card-title">Scaling (duality)</div><div class="card-body">Compress time by factor <code>a</code> and frequency expands by <code>1/a</code>. A fast signal has a wide spectrum; a slow signal has a narrow spectrum. This is the basis of the uncertainty principle.</div></div>
<div class="calc-card"><div class="card-title">Convolution theorem (the big one)</div><div class="card-body">Convolution in time becomes pointwise multiplication in frequency. <strong>Linear filtering is multiplication in the frequency domain.</strong> Every digital filter, every audio EQ, every image blur — uses this.</div></div>
<div class="calc-card"><div class="card-title">Differentiation rule</div><div class="card-body">Taking a derivative in time becomes multiplication by <code>i\\omega</code> in frequency. Linear ODEs and PDEs with constant coefficients become algebraic equations in the frequency domain — that is why Fourier methods solve them.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: Modulation</div><div class="example-body">Let <code>f(t)</code> be a baseband audio signal with spectrum <code>F(\\omega)</code> confined to <code>|\\omega| < W</code>. Multiply by a carrier: <code>g(t) = f(t)\\cos(\\omega_0 t)</code>. By Euler, <code>\\cos(\\omega_0 t) = \\tfrac{1}{2}(e^{i\\omega_0 t} + e^{-i\\omega_0 t})</code>. Applying the frequency-shift property:<br><br><code>G(\\omega) = \\tfrac{1}{2} F(\\omega - \\omega_0) + \\tfrac{1}{2} F(\\omega + \\omega_0)</code><br><br>The baseband spectrum is copied to <code>\\pm\\omega_0</code> with half amplitude each — the standard AM spectrum. Demodulation reverses this: multiply by the carrier again and low-pass filter.</div></div>

<div id="plot-modulation-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var W=2;var w0=8;
var w=[];var F=[];var G=[];
for(var j=-1500;j<=1500;j++){var ww=j/100;w.push(ww);
var f0=Math.abs(ww)<W?Math.exp(-(ww*ww)/(W*W)):0;F.push(f0);
var g1=Math.abs(ww-w0)<W?Math.exp(-((ww-w0)*(ww-w0))/(W*W)):0;
var g2=Math.abs(ww+w0)<W?Math.exp(-((ww+w0)*(ww+w0))/(W*W)):0;
G.push(0.5*(g1+g2));}
var tr1={x:w,y:F,mode:"lines",name:"F(omega) baseband",line:{color:"#3b82f6",width:2.5}};
var tr2={x:w,y:G,mode:"lines",name:"G(omega) after f(t) cos(omega_0 t)",line:{color:"#f59e0b",width:2.5}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"omega",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-14,14]},yaxis:{title:"spectrum amplitude",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-modulation-en",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Modulation by a carrier <code>\\cos(\\omega_0 t)</code> with <code>\\omega_0 = 8</code>: the baseband spectrum (blue, centered at zero) is copied to <code>\\pm\\omega_0</code> with half amplitude (orange). This is how radio works.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: Convolution Theorem</div><div class="example-body">Suppose you want to convolve two signals, <code>h(t) = (f * g)(t) = \\int f(\\tau) g(t-\\tau) d\\tau</code>. Direct evaluation is <code>O(N^2)</code> for length-<code>N</code> sampled signals. But by the convolution theorem, <code>H(\\omega) = F(\\omega) G(\\omega)</code>. Algorithm: take FFT of <code>f</code> and <code>g</code> (<code>O(N \\log N)</code>), multiply pointwise (<code>O(N)</code>), inverse FFT (<code>O(N \\log N)</code>). Total <code>O(N \\log N)</code> — a dramatic speedup. This is the foundation of every fast filter implementation.</div></div>

<div id="plot-convolution-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var t=[];var f=[];var g=[];var h=[];
for(var i=-300;i<=300;i++){var x=i/30;t.push(x);
var fv=Math.abs(x)<1?1:0;f.push(fv);
var gv=Math.exp(-x*x);g.push(gv);}
var dt=1/30;
for(var k=0;k<t.length;k++){var s=0;for(var m=0;m<t.length;m++){var idx=k-m+Math.floor(t.length/2);if(idx>=0&&idx<t.length){s+=f[m]*g[idx]*dt;}}h.push(s);}
var tr1={x:t,y:f,mode:"lines",name:"f(t) rect pulse",line:{color:"#3b82f6",width:2}};
var tr2={x:t,y:g,mode:"lines",name:"g(t) Gaussian kernel",line:{color:"#10b981",width:2}};
var tr3={x:t,y:h,mode:"lines",name:"(f * g)(t)",line:{color:"#f59e0b",width:2.5}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"t",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4]},yaxis:{title:"amplitude",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.2,2]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-convolution-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Convolution of a rectangular pulse (blue) with a Gaussian kernel (green) produces a smoothed pulse (orange) — the sharp edges have been "blurred" by the Gaussian. In frequency this is the simple product <code>F(\\omega) G(\\omega)</code>.</div></div>

<h2 class="l-title">9. Parseval/Plancherel Theorem</h2>

<p class="l-text">The Fourier Transform preserves total energy. This is the analytical sister of "rotation preserves length" in linear algebra — the FT is a (suitably normalized) <em>unitary</em> transformation.</p>

<div class="calc-formula"><div class="formula-label">PLANCHEREL'S THEOREM</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} |f(t)|^2\\, dt = \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} |F(\\omega)|^2\\, d\\omega$$</div><div class="formula-sub">Time-domain energy equals frequency-domain energy (with the 1/(2 pi) measure factor).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Energy spectral density</div><div class="card-body">The quantity <code>|F(\\omega)|^2 / (2\\pi)</code> is the <strong>energy spectral density</strong> — energy per unit angular frequency. Integrating it over a frequency band tells you how much of your signal's energy lies in that band.</div></div>
<div class="calc-card"><div class="card-title">Unitary FT</div><div class="card-body">With the symmetric convention (<code>1/\\sqrt{2\\pi}</code> in both formulas) the equality becomes literally <code>\\|f\\|_2 = \\|F\\|_2</code>. The FT is then a genuine isometry of <code>L^2(\\mathbb{R})</code>.</div></div>
<div class="calc-card"><div class="card-title">Why this is huge</div><div class="card-body">It means you can compute many quantities (norms, inner products, energies, correlations) interchangeably in either domain. Pick whichever domain makes the integral easier. The answer is the same.</div></div>
</div>

<div class="calc-example"><div class="example-label">CHECK FOR THE GAUSSIAN</div><div class="example-body">Time-domain energy: <code>\\int e^{-t^2/\\sigma^2} dt = \\sigma\\sqrt{\\pi}</code> (using <code>2\\cdot t^2/(2\\sigma^2) = t^2/\\sigma^2</code>).<br><br>Frequency side: <code>\\frac{1}{2\\pi}\\int (\\sigma\\sqrt{2\\pi})^2 e^{-\\sigma^2 \\omega^2} d\\omega = \\frac{2\\pi\\sigma^2}{2\\pi}\\int e^{-\\sigma^2 \\omega^2} d\\omega = \\sigma^2 \\cdot \\frac{\\sqrt{\\pi}}{\\sigma} = \\sigma\\sqrt{\\pi}</code>. ✔<br><br>Both sides agree — Plancherel holds.</div></div>

<h2 class="l-title">10. The Uncertainty Principle</h2>

<p class="l-text">We now reach what may be the most profound inequality in mathematical physics. Define the time and frequency spreads of a (suitably normalized) signal by</p>

<div class="calc-formula"><div class="formula-label">SPREADS</div><div class="formula-main">$$(\\Delta t)^2 = \\frac{\\int t^2 |f(t)|^2 dt}{\\int |f(t)|^2 dt}, \\qquad (\\Delta\\omega)^2 = \\frac{\\int \\omega^2 |F(\\omega)|^2 d\\omega}{\\int |F(\\omega)|^2 d\\omega}$$</div><div class="formula-sub">Standard deviation of the energy distribution in each domain (centered at the mean).</div></div>

<div class="calc-formula"><div class="formula-label">UNCERTAINTY PRINCIPLE (FOURIER)</div><div class="formula-main">$$\\boxed{\\,\\Delta t \\cdot \\Delta\\omega \\;\\ge\\; \\tfrac{1}{2}\\,}$$</div><div class="formula-sub">A signal cannot be simultaneously narrow in time and narrow in frequency. Equality is achieved only by Gaussians.</div></div>

<p class="l-text">Translate to ordinary frequency <code>\\xi = \\omega/(2\\pi)</code> and the inequality reads <code>\\Delta t \\cdot \\Delta\\xi \\ge 1/(4\\pi)</code>. In quantum mechanics, identify <code>t</code> with position and <code>\\omega</code> with momentum/<code>\\hbar</code>, and the inequality becomes the famous</p>

<div class="calc-formula"><div class="formula-label">HEISENBERG'S INEQUALITY</div><div class="formula-main">$$\\Delta x \\cdot \\Delta p \\;\\ge\\; \\frac{\\hbar}{2}$$</div><div class="formula-sub">The same inequality, dressed in physical units. Position and momentum are conjugate Fourier variables.</div></div>

<div id="plot-uncertainty-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];var colors=["#3b82f6","#10b981","#f59e0b","#ef4444"];var sigmas=[2.0,1.0,0.5,0.25];
for(var s=0;s<sigmas.length;s++){var sig=sigmas[s];
var t=[];var ft=[];for(var i=-300;i<=300;i++){var x=i/30;t.push(x);ft.push(Math.exp(-x*x/(2*sig*sig)));}
traces.push({x:t,y:ft,mode:"lines",name:"sigma_t="+sig,line:{color:colors[s],width:2},xaxis:"x1",yaxis:"y1"});
var w=[];var Fw=[];for(var j=-300;j<=300;j++){var ww=j/30;w.push(ww);Fw.push(sig*Math.sqrt(2*Math.PI)*Math.exp(-sig*sig*ww*ww/2));}
traces.push({x:w,y:Fw,mode:"lines",name:"sigma_omega=1/"+sig,line:{color:colors[s],width:2},xaxis:"x2",yaxis:"y2",showlegend:false});}
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-6,6]},yaxis:{title:"|f(t)|",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},xaxis2:{domain:[0.54,1],title:"omega",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-10,10]},yaxis2:{title:"|F(omega)|",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.3,6]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-uncertainty-en",traces,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Four Gaussians: as <code>\\sigma_t</code> shrinks from 2 down to 0.25 (left, blue to red), the corresponding spectra (right) widen by exactly the same factor. The product <code>\\sigma_t \\cdot \\sigma_\\omega = 1</code> stays constant — Gaussians saturate the uncertainty bound.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Engineering meaning</div><div class="card-body">You cannot design a filter that perfectly localizes both in time (sharp impulse response) and in frequency (sharp passband). All filter design is a negotiation with the uncertainty principle.</div></div>
<div class="calc-card"><div class="card-title">Music meaning</div><div class="card-body">A very brief click contains a wide range of frequencies; a single sustained tone is localized in frequency but spread over time. The spectrogram (Lesson 8) is exactly the tool to visualize this trade-off.</div></div>
<div class="calc-card"><div class="card-title">Physics meaning</div><div class="card-body">Heisenberg's inequality is the same inequality, transferred to position and momentum (which are Fourier conjugates of each other in quantum mechanics). The universe is constrained by the geometry of the Fourier Transform.</div></div>
</div>

<div class="think-box"><div class="think-label">PROFOUND CONNECTION</div><div class="think-body">The exact same mathematical statement — <code>\\Delta t \\cdot \\Delta\\omega \\ge 1/2</code> — controls both the behavior of audio filters and the foundational limits of quantum mechanics. Fourier analysis is not "a tool" but a fundamental aspect of how information is structured in nature. Once you internalize this, you understand why physicists, engineers, and applied mathematicians all converge on the same toolbox.</div></div>

<h2 class="l-title">11. Practical Pyodide Exercise</h2>

<p class="l-text">Time to compute Fourier Transforms ourselves. We will use NumPy to approximate the continuous integral by a Riemann sum and verify each canonical example numerically. The exercise computes the FT of a Gaussian, a rectangular pulse, and an exponential decay, and plots the magnitude (and phase, where relevant) alongside the original signal.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># --- Numerical Fourier Transform via Riemann sum -----------------</span>
<span class="cm"># F(omega) = integral f(t) exp(-i omega t) dt</span>

<span class="kw">def</span> <span class="fn">cft</span>(t, f, omega):
    <span class="str">"""Approximate the continuous FT at given omega values."""</span>
    dt = t[<span class="num">1</span>] - t[<span class="num">0</span>]
    <span class="cm"># Outer product: shape (len(omega), len(t))</span>
    kernel = np.exp(-<span class="num">1j</span> * np.outer(omega, t))
    <span class="kw">return</span> kernel @ f * dt

<span class="cm"># Time grid: wide enough that all three signals decay to ~0 at the edges</span>
t = np.linspace(-<span class="num">10</span>, <span class="num">10</span>, <span class="num">4001</span>)
omega = np.linspace(-<span class="num">10</span>, <span class="num">10</span>, <span class="num">801</span>)

<span class="cm"># --- Signal 1: Gaussian -----------------------------------------</span>
sigma = <span class="num">1.0</span>
g = np.exp(-t**<span class="num">2</span> / (<span class="num">2</span> * sigma**<span class="num">2</span>))
G_num = <span class="fn">cft</span>(t, g, omega)
G_ana = sigma * np.sqrt(<span class="num">2</span> * np.pi) * np.exp(-sigma**<span class="num">2</span> * omega**<span class="num">2</span> / <span class="num">2</span>)
err_g = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(G_num - G_ana))
<span class="fn">print</span>(<span class="str">f"Gaussian   FT max error vs analytic:    {err_g:.3e}"</span>)

<span class="cm"># --- Signal 2: Rectangular pulse --------------------------------</span>
a = <span class="num">1.0</span>
r = np.<span class="fn">where</span>(np.<span class="fn">abs</span>(t) &lt; a, <span class="num">1.0</span>, <span class="num">0.0</span>)
R_num = <span class="fn">cft</span>(t, r, omega)
<span class="cm"># Analytic: 2 sin(omega a)/omega, with limit 2a at omega=0</span>
R_ana = np.<span class="fn">where</span>(np.<span class="fn">abs</span>(omega) &lt; <span class="num">1e-9</span>, <span class="num">2</span>*a, <span class="num">2</span>*np.sin(omega*a)/omega)
err_r = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(R_num.real - R_ana))
<span class="fn">print</span>(<span class="str">f"Rect pulse FT max error vs analytic:    {err_r:.3e}"</span>)

<span class="cm"># --- Signal 3: One-sided exponential decay ----------------------</span>
alpha = <span class="num">1.0</span>
e = np.<span class="fn">where</span>(t &gt; <span class="num">0</span>, np.exp(-alpha*t), <span class="num">0.0</span>)
E_num = <span class="fn">cft</span>(t, e, omega)
E_ana = <span class="num">1.0</span> / (alpha + <span class="num">1j</span>*omega)
err_e = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(E_num - E_ana))
<span class="fn">print</span>(<span class="str">f"Exp decay  FT max error vs analytic:    {err_e:.3e}"</span>)

<span class="cm"># --- Parseval / Plancherel check on Gaussian --------------------</span>
energy_t = np.<span class="fn">sum</span>(np.<span class="fn">abs</span>(g)**<span class="num">2</span>) * (t[<span class="num">1</span>]-t[<span class="num">0</span>])
energy_w = np.<span class="fn">sum</span>(np.<span class="fn">abs</span>(G_num)**<span class="num">2</span>) * (omega[<span class="num">1</span>]-omega[<span class="num">0</span>]) / (<span class="num">2</span>*np.pi)
<span class="fn">print</span>(<span class="str">f"\\nPlancherel: time energy = {energy_t:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"Plancherel: freq energy = {energy_w:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"Analytic Gaussian energy = sigma sqrt(pi) = {sigma*np.sqrt(np.pi):.6f}"</span>)</code></pre></div>

<div class="l-note"><strong>Run this code</strong> in the lab below to see the three Fourier Transforms agree with their analytic forms to roughly 10<sup>-4</sup> precision (the residual is the Riemann sum approximation error). The Plancherel check confirms energy is conserved between the two domains. Try changing <code>sigma</code> or <code>a</code> and watch the spectra widen or narrow accordingly — the uncertainty principle in action.</div>

<div class="calc-example"><div class="example-label">EXTENSIONS TO TRY</div><div class="example-body"><strong>(1)</strong> Compute the FT of <code>f(t) = e^{-|t|}</code> (two-sided exponential). Analytic answer: <code>2/(1 + \\omega^2)</code> — a real-valued Lorentzian. Verify numerically.<br><strong>(2)</strong> Compute the FT of a chirp <code>f(t) = e^{-t^2/2} \\cos(5t)</code> and observe two peaks at <code>\\omega = \\pm 5</code>.<br><strong>(3)</strong> Verify the convolution theorem: convolve <code>\\text{rect}(t)</code> with itself in time and compare with <code>(\\text{sinc})^2</code> in frequency.</div></div>

<h2 class="l-title">12. Quick Reference: Useful Fourier Pairs</h2>

<p class="l-text">Print this table and stick it on your wall. It collects every transform pair you will use day to day, including a few standard distributions you will meet in Lesson 6 (delta, step, sign).</p>

<div class="calc-formula"><div class="formula-label">FOURIER PAIRS TABLE</div><div class="formula-main">$$\\begin{array}{l|l} \\textbf{Time domain } f(t) & \\textbf{Frequency domain } F(\\omega) \\\\ \\hline \\delta(t) & 1 \\\\ 1 & 2\\pi\\,\\delta(\\omega) \\\\ e^{i\\omega_0 t} & 2\\pi\\,\\delta(\\omega - \\omega_0) \\\\ \\cos(\\omega_0 t) & \\pi[\\delta(\\omega-\\omega_0) + \\delta(\\omega+\\omega_0)] \\\\ \\sin(\\omega_0 t) & -i\\pi[\\delta(\\omega-\\omega_0) - \\delta(\\omega+\\omega_0)] \\\\ \\text{rect}_a(t) & 2a\\,\\text{sinc}(a\\omega/\\pi) \\\\ \\text{sinc}(t/T) & T\\,\\text{rect}_{1/T}(\\omega/(2\\pi)) \\\\ e^{-t^2/(2\\sigma^2)} & \\sigma\\sqrt{2\\pi}\\,e^{-\\sigma^2\\omega^2/2} \\\\ e^{-at}u(t) & 1/(a+i\\omega) \\\\ e^{-a|t|} & 2a/(a^2+\\omega^2) \\\\ u(t) & \\pi\\delta(\\omega) + 1/(i\\omega) \\\\ \\text{sgn}(t) & 2/(i\\omega) \\end{array}$$</div><div class="formula-sub">u(t) is the unit step, sgn(t) is the sign function. Entries with delta need the distributional theory of Lesson 6.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Duality</div><div class="card-body">Notice the symmetry between row 6 (rect to sinc) and row 7 (sinc to rect). This is the <strong>duality property</strong>: <code>f(t) \\leftrightarrow F(\\omega)</code> implies <code>F(t) \\leftrightarrow 2\\pi f(-\\omega)</code>. Half the table is the other half read from the right.</div></div>
<div class="calc-card"><div class="card-title">Delta-function rows</div><div class="card-body">Rows 1 through 5 involve <code>\\delta(\\omega)</code> — they are <em>distributional</em> Fourier pairs. The corresponding signals (constant, complex exponential, cosine, sine) are neither L^1 nor L^2, so the integral does not converge in the ordinary sense. The delta is the only sensible answer.</div></div>
<div class="calc-card"><div class="card-title">Engineering shortcut</div><div class="card-body">When you need to transform a complicated signal, decompose it into a sum/product of the rows above and apply linearity/shift/scaling/convolution. You will almost never need to evaluate a Fourier integral from first principles.</div></div>
</div>

<h2 class="l-title">Summary</h2>

<p class="l-text">The Continuous Fourier Transform extends Fourier Series from periodic to general signals by letting the period grow to infinity. The forward transform <code>F(\\omega) = \\int f(t) e^{-i\\omega t} dt</code> assigns a complex amplitude to every real frequency; the inverse <code>f(t) = \\frac{1}{2\\pi}\\int F(\\omega) e^{i\\omega t} d\\omega</code> rebuilds the original signal. Three canonical examples — rectangular pulse (giving a sinc), Gaussian (giving a Gaussian), exponential decay (giving a Lorentzian) — span the qualitative behavior you will meet in practice. Six core properties (linearity, time/frequency shift, scaling, convolution, differentiation) turn hard operations into easy ones; the convolution theorem alone reshapes how every digital filter is built. Plancherel guarantees energy conservation between domains, and the uncertainty principle <code>\\Delta t \\cdot \\Delta\\omega \\ge 1/2</code> is exactly Heisenberg's inequality from quantum physics. In Lesson 5 we discretize this entire story to arrive at the DFT and the FFT.</p>
`,

tr: `<p class="l-text"><strong>Sürekli Fourier Dönüşümü büyük genellemedir.</strong> Fourier Serileri bize <em>periyodik</em> fonksiyonları sinüslerin ve kosinüslerin ayrık bir spektrumuna ayrıştırma imkânı verdi. Ne var ki dünya bir kez gelip giden sinyallerle dolu — tek bir gök gürültüsü, geçici bir darbe, gitar telini bıraktıktan sonraki üstel sönüm. Bu tür sinyaller için <code>n \\cdot \\omega_0</code> tam sayı katları üzerindeki ayrık spektrum çok seyrek kalır. <strong>Sürekli</strong> bir spektruma ihtiyacımız vardır ve Fourier Dönüşümü tam olarak bunu sağlar.</p>

<p class="l-text">Bu derste önce Fourier Serisinden Fourier Dönüşümüne dikkatli bir sınır argümanı ile geçeceğiz, sonra her mühendisin ezbere bilmesi gereken üç klasik örneği inceleyeceğiz (dikdörtgen darbe, Gauss eğrisi, üstel sönüm), en kritik özellikleri (özellikle <strong>evrişim teoremini</strong>) kanıtlayacağız ve dersi matematiğin en derin eşitsizliklerinden biriyle, <strong>belirsizlik ilkesiyle</strong> kapatacağız — bu, Heisenberg'in kuantum mekaniğindeki ilkesiyle birebir aynı eşitsizliktir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Fourier Dönüşümünü, periyot sonsuza giderken Fourier Serisinin limiti olarak türetmek</li>
<li>Forward ve inverse dönüşümleri yazmak ve simetrik yapı ile 1/(2 pi) çarpanını gerekçelendirmek</li>
<li>Dikdörtgen darbenin, Gauss eğrisinin ve tek taraflı üstelin Fourier Dönüşümlerini elle hesaplamak</li>
<li>Altı temel özelliği (doğrusallık, zaman/frekans kayması, ölçekleme, evrişim, türev) uygulamak</li>
<li>Parseval/Plancherel teoremini doğrulamak ve toplam enerjinin neden korunduğunu açıklamak</li>
<li>Belirsizlik ilkesini hem sinyal işlemeye hem de kuantum fiziğindeki Heisenberg eşitsizliğine bağlamak</li>
</ul>
</div>

<h2 class="l-title">1. Fourier Serisinin Sınırı</h2>

<p class="l-text">Ne kadar zarif olsalar da Fourier Serilerinin ciddi bir kısıtlaması vardır: <strong>yalnızca periyodik fonksiyonları temsil ederler</strong>. Sinyaliniz her <code>T</code> saniyede bir tekrar ediyorsa</p>

<div class="calc-formula"><div class="formula-label">FOURIER SERİSİ (HATIRLATMA)</div><div class="formula-main">$$f(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\, e^{i n \\omega_0 t}, \\qquad \\omega_0 = \\frac{2\\pi}{T}$$</div><div class="formula-sub">Temel frekansın tam sayı katlarında ayrık spektrum.</div></div>

<p class="l-text">ifadesi <code>f(t)</code>'yi <em>ayrık</em> bir frekans kümesine ayırır: <code>0, \\pm\\omega_0, \\pm 2\\omega_0, \\pm 3\\omega_0, \\ldots</code> — tam sayı harmonikler. Ancak şunu sorun: yalnızca <code>[-1, 1]</code> üzerinde tanımlı, geri kalan her yerde sıfır olan tek bir dikdörtgen darbenin spektrumu nedir? Bu darbe periyodik değildir; ortada <code>T</code>, <code>\\omega_0</code> veya <code>c_n</code> yoktur. Fourier Serisi makinesi burada çöker.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periyodik Sinyal</div><div class="card-body">440 Hz'lik bir akort çatalı, osiloskoptaki kare dalga, 50 Hz'lik AC akım. Fourier Serisi tam oturur: temelin tam sayı katlarında ayrık spektrum.</div></div>
<div class="calc-card"><div class="card-title">Aperiyodik Sinyal</div><div class="card-body">Tek bir tıkırtı, bir sonik patlama, gitar telini bıraktıktan sonraki üstel sönüm. Tekrar yok. Ayrık spektrum bunları tarif etmek için fazla kaba kalır.</div></div>
<div class="calc-card"><div class="card-title">Gerekli Çözünürlük</div><div class="card-body">Yalnızca tam sayı katlarına değil, <em>her</em> reel frekansa bir genlik (ya da karmaşık katsayı) atamamız gerekiyor. Sürekli bir spektrum şart.</div></div>
<div class="calc-card"><div class="card-title">Hile</div><div class="card-body">Bir Fourier Serisi alıp periyot <code>T</code>'yi sonsuza götürmek. Harmonikler arasındaki mesafe sıfıra inerken ayrık spektruma ne olacağını izlemek.</div></div>
</div>

<div class="l-note"><strong>Sezgi:</strong> Bir tarağı uzaktan izlediğinizi hayal edin. Yeterince uzaktan diş çubuğu sürekli bir bara dönüşür. Aynı şekilde <code>T \\to \\infty</code> giderken harmonikler arası mesafe <code>\\Delta\\omega = \\omega_0 = 2\\pi/T</code> sıfıra düşer — ayrık spektrum bir süreklilik içinde erir.</div>

<h2 class="l-title">2. Limit Hilesi</h2>

<p class="l-text"><code>[-T/2, T/2]</code> aralığında tanımlanmış ve periyodik olarak uzatılmış bir fonksiyonun Fourier Serisinden başlayalım:</p>

<div class="calc-formula"><div class="formula-label">FOURIER SERİSİ ÇİFTİ</div><div class="formula-main">$$f(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\, e^{i n \\omega_0 t}, \\qquad c_n = \\frac{1}{T}\\int_{-T/2}^{T/2} f(t)\\, e^{-i n \\omega_0 t}\\, dt$$</div><div class="formula-sub">İki formül: sentez (solda) katsayılardan f'yi yeniden kurar; analiz (sağda) katsayıları çıkarır.</div></div>

<p class="l-text">Şimdi temkinli bir gösterim hilesi yapalım. Şunları tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">DEĞİŞKEN DEĞİŞİMİ</div><div class="formula-main">$$\\omega_n = n \\omega_0, \\qquad \\Delta\\omega = \\omega_0 = \\frac{2\\pi}{T}, \\qquad F(\\omega_n) = T \\cdot c_n$$</div><div class="formula-sub">Yeni F(omega_n) simgesi katsayıyı T ile yeniden ölçekler, böylece T büyürken sonuç sonlu kalır.</div></div>

<p class="l-text">Bu değişimle analiz denklemi şu hale gelir:</p>

<div class="calc-formula"><div class="formula-label">YENİDEN YAZILMIŞ ANALİZ</div><div class="formula-main">$$F(\\omega_n) = \\int_{-T/2}^{T/2} f(t)\\, e^{-i \\omega_n t}\\, dt$$</div><div class="formula-sub">Önündeki 1/T kayboldu — bunu yeni değişkenimize yedirdik.</div></div>

<p class="l-text">Sentez denklemi de şuna döner:</p>

<div class="calc-formula"><div class="formula-label">YENİDEN YAZILMIŞ SENTEZ</div><div class="formula-main">$$f(t) = \\sum_{n=-\\infty}^{\\infty} \\frac{F(\\omega_n)}{T}\\, e^{i \\omega_n t} = \\frac{1}{2\\pi}\\sum_{n=-\\infty}^{\\infty} F(\\omega_n)\\, e^{i \\omega_n t}\\, \\Delta\\omega$$</div><div class="formula-sub">Son adım 1/T = Delta-omega / (2 pi) eşitliğini kullanır. Bu artık tam bir Riemann toplamı gibi görünür.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">T'yi sınırsız büyütün</div><div class="step-detail"><code>T \\to \\infty</code> giderken aralık <code>\\Delta\\omega = 2\\pi/T</code> sıfıra düşer, integrasyon aralığı <code>[-T/2, T/2]</code> tüm <code>\\mathbb{R}</code>'ye yayılır ve ayrık <code>\\omega_n</code> indisi sürekli bir <code>\\omega</code> değişkenine dönüşür.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İntegral hayatta kalır</div><div class="step-detail"><code>F(\\omega_n)</code> ifadesi sürekli integrale dönüşür: <code>F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i \\omega t}\\, dt</code>. Bu, <strong>ileri yönlü Fourier Dönüşümüdür</strong>.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Toplam integrale döner</div><div class="step-detail">Riemann toplamı <code>\\sum F(\\omega_n)\\, e^{i \\omega_n t}\\, \\Delta\\omega</code> integrale yakınsar: <code>\\int F(\\omega)\\, e^{i \\omega t}\\, d\\omega</code>. <code>2\\pi</code>'ye bölün ve <strong>ters Fourier Dönüşümü</strong> elinizdedir.</div></div></div>
</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body"><code>F(\\omega_n) = T \\cdot c_n</code> tanımlarken neden <code>T</code> ile çarpmak zorunda kaldık? Çünkü küçük bir bölgede yaşayan periyodik olmayan bir sinyal için ortalama <code>c_n = \\frac{1}{T}\\int f e^{-i\\omega_n t} dt</code>, <code>T \\to \\infty</code> giderken kaybolur (giderek daha fazla boş bölge üzerinde ortalama alıyorsunuz). <code>T</code> ile çarpmak, limitin sonlu ve anlamlı olmasını sağlar.</div></div>

<h2 class="l-title">3. Fourier Dönüşümünün Tanımı</h2>

<p class="l-text">Artık tüm sinyal işlemenin merkezi formül çiftini yazmaya hazırız:</p>

<div class="calc-formula"><div class="formula-label">SÜREKLİ FOURIER DÖNÜŞÜMÜ (CFT)</div><div class="formula-main">$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i \\omega t}\\, dt$$</div><div class="formula-sub">İLERİ dönüşüm: zaman alanındaki f(t) sinyalinden frekans alanındaki F(omega) spektrumuna.</div></div>

<div class="calc-formula"><div class="formula-label">TERS SÜREKLİ FOURIER DÖNÜŞÜMÜ (ICFT)</div><div class="formula-main">$$f(t) = \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} F(\\omega)\\, e^{i \\omega t}\\, d\\omega$$</div><div class="formula-sub">TERS dönüşüm: F(omega) ağırlıklı karmaşık üstellerin toplamı ile zaman alanı sinyalini yeniden inşa eder.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İleri = Analiz</div><div class="card-body">Zamanda verili bir sinyalin her frekanstan ne kadar içerdiğini sormak. <code>F(\\omega)</code> integrali, saf ton <code>e^{i\\omega t}</code>'nin <code>f(t)</code> içinde "ne kadar" bulunduğunu ölçer.</div></div>
<div class="calc-card"><div class="card-title">Ters = Sentez</div><div class="card-body">Spektrum verildiğinde her frekans bileşenini <code>F(\\omega)</code> ile ağırlıklandırıp toplayarak sinyali yeniden oluşturmak. <code>1/(2\\pi)</code> çarpanı integrasyon ölçüsünü normalize eder.</div></div>
<div class="calc-card"><div class="card-title">Çiftin Simetrisi</div><div class="card-body">İleri ve ters dönüşüm yalnızca üs işareti ve <code>1/(2\\pi)</code> önçarpanı bakımından ayrılır. Birçok kitap <em>her ikisinde de</em> <code>1/\\sqrt{2\\pi}</code> kullanır — tamamen normalizasyon tercihidir, fizik değişmez.</div></div>
<div class="calc-card"><div class="card-title">Gösterim</div><div class="card-body">İleri dönüşüm için <code>F(\\omega) = \\mathcal{F}\\{f(t)\\}</code>, ters dönüşüm için <code>f(t) = \\mathcal{F}^{-1}\\{F(\\omega)\\}</code> yazılır. Çift bazen <code>f(t) \\leftrightarrow F(\\omega)</code> şeklinde gösterilir.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">AÇISAL FREKANS (omega)</div>
<div class="compare-item">Değişken: rad/saniye cinsinden <code>\\omega</code></div>
<div class="compare-item">İleri: <code>\\int f e^{-i\\omega t} dt</code></div>
<div class="compare-item">Ters: <code>\\frac{1}{2\\pi}\\int F e^{i\\omega t} d\\omega</code></div>
<div class="compare-item">Matematik/fizikte standart</div>
</div>
<div class="compare-col">
<div class="compare-title">SIRADAN FREKANS (xi)</div>
<div class="compare-item">Değişken: çevrim/saniye (Hz) cinsinden <code>\\xi</code></div>
<div class="compare-item">İleri: <code>\\int f e^{-i 2\\pi \\xi t} dt</code></div>
<div class="compare-item">Ters: <code>\\int F e^{i 2\\pi \\xi t} d\\xi</code> (<code>1/(2\\pi)</code> yok!)</div>
<div class="compare-item">Mühendislik/EE'de standart</div>
</div>
</div>

<div class="l-note"><strong>Konvansiyon uyarısı:</strong> Bir makale veya kitap okurken hangi konvansiyonun kullanıldığına bakın. <code>2\\pi</code> üste girebilir (Hz konvansiyonu), tersin önünde durabilir (açısal konvansiyon) veya her ikisinde <code>1/\\sqrt{2\\pi}</code> olarak simetrik bölüşülebilir. Hiçbiri "doğru" değildir — sabitin nerede yaşadığında ayrılırlar.</div>

<h2 class="l-title">4. Var Olma ve L¹/L² Uzayları</h2>

<p class="l-text">Tüm <code>\\mathbb{R}</code> üzerinden bir integral kendiliğinden yakınsamaz. Fourier Dönüşümünün var olmasını garantilemek için <code>f</code>'ye koşullar koymalıyız. En kullanışlı iki koşul <code>f</code>'nin integrallenebilirliğine dayanır.</p>

<div class="calc-formula"><div class="formula-label">L^1 KOŞULU</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} |f(t)|\\, dt < \\infty$$</div><div class="formula-sub">f mutlak integrallenebilirdir. O zaman F(omega) sınırlı ve süreklidir (Riemann-Lebesgue lemması: F sonsuzda kaybolur).</div></div>

<div class="calc-formula"><div class="formula-label">L^2 KOŞULU (PLANCHEREL)</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} |f(t)|^2\\, dt < \\infty$$</div><div class="formula-sub">f sonlu enerjilidir. O zaman F de L^2'dedir ve integral limit anlamında tanımlanır. "Fiziksel olarak anlamlı" sinyaller sınıfı budur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">L^1 fonksiyonları</div><div class="card-body"><code>f(t)</code>'nin tüm kütlesi eğri altında sığar. Dikdörtgen darbeler, Gauss eğrileri, tek taraflı üsteller — bunlar klasik L^1 örnekleridir. Fourier Dönüşümü tamamen sıradan bir fonksiyondur.</div></div>
<div class="calc-card"><div class="card-title">L^2 fonksiyonları</div><div class="card-body">Sonlu enerji. Sınıf L^1 fonksiyonlarını kapsar ama <code>\\text{sinc}(t)</code> gibi L^1 olmayacak kadar yavaş azalan ama sonlu enerjisi olan şeyleri de içerir. Plancherel burada dönüşümü dikkatli bir limitle genişletir.</div></div>
<div class="calc-card"><div class="card-title">Patolojik durumlar</div><div class="card-body"><code>f(t) = 1</code> veya <code>f(t) = \\cos(\\omega_0 t)</code> gibi fonksiyonlar ne L^1 ne L^2'dedir. Fourier Dönüşümleri yalnızca <strong>dağılım</strong> anlamında vardır — cevap bir Dirac delta'dır. Bunu Ders 6'da göreceğiz.</div></div>
</div>

<div class="l-note"><strong>Mühendis kısa yolu:</strong> Bu derste karşılaşacağınız her şey için — darbeler, Gauss eğrileri, üsteller — hem <code>L^1</code> hem <code>L^2</code> koşulları aşikar biçimde sağlanır. İntegralleri serbestçe hesaplayabilir, limit operasyonlarını rahatça yer değiştirebilirsiniz. Fonksiyonel analitik teknikler ancak delta fonksiyonlarına ve tempered dağılımlara geçtiğinizde devreye girer.</div>

<h2 class="l-title">5. Klasik Örnek 1: Dikdörtgen Darbe</h2>

<p class="l-text">Dikdörtgen darbe en basit aşikar olmayan sinyaldir. Tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">YARI-GENİŞLİK a OLAN DİKDÖRTGEN DARBE</div><div class="formula-main">$$\\text{rect}_a(t) = \\begin{cases} 1 & \\text{eğer } |t| < a \\\\ 0 & \\text{aksi halde} \\end{cases}$$</div><div class="formula-sub">Yükseklik 1, başlangıçta merkezlenmiş, [-a, a] üzerinde desteklenen bir kutu.</div></div>

<p class="l-text">İleri dönüşüm tanımını uygulayalım:</p>

<div class="calc-formula"><div class="formula-label">TÜRETİM</div><div class="formula-main">$$F(\\omega) = \\int_{-a}^{a} 1 \\cdot e^{-i\\omega t}\\, dt = \\left[\\frac{e^{-i\\omega t}}{-i\\omega}\\right]_{-a}^{a} = \\frac{e^{-i\\omega a} - e^{i\\omega a}}{-i\\omega}$$</div><div class="formula-sub">Karmaşık üstelin standart antitürevi, sınır noktalarında değerlendirilmiş.</div></div>

<p class="l-text">Euler özdeşliğini hatırlayın: <code>e^{i\\theta} - e^{-i\\theta} = 2i\\sin\\theta</code>, dolayısıyla</p>

<div class="calc-formula"><div class="formula-label">SADELEŞTİRİLMİŞ SONUÇ</div><div class="formula-main">$$F(\\omega) = \\frac{2\\sin(\\omega a)}{\\omega} = 2a \\cdot \\frac{\\sin(\\omega a)}{\\omega a}$$</div><div class="formula-sub">Meşhur sinc fonksiyonu sahneye çıkar (burada "normalleştirilmemiş" sin(x)/x biçiminde).</div></div>

<p class="l-text">Ya da mühendislikte yaygın olan normalleştirilmiş sinc'i kullanarak <code>\\text{sinc}(x) = \\sin(\\pi x)/(\\pi x)</code>,</p>

<div class="calc-formula"><div class="formula-label">rect_a'NIN FOURIER DÖNÜŞÜMÜ</div><div class="formula-main">$$\\mathcal{F}\\{\\text{rect}_a(t)\\} = 2a \\cdot \\text{sinc}\\!\\left(\\frac{a\\omega}{\\pi}\\right)$$</div><div class="formula-sub">Zamanda sonlu genişlikli bir darbe, frekansta sonsuza dek çınlayan bir sinc üretir.</div></div>

<div id="plot-rect-sinc-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0;
var t=[];var ft=[];for(var i=-400;i<=400;i++){var x=i/100;t.push(x);ft.push(Math.abs(x)<a?1:0);}
var w=[];var Fw=[];for(var j=-800;j<=800;j++){var ww=j/40;w.push(ww);Fw.push(Math.abs(ww)<1e-9?2*a:2*Math.sin(ww*a)/ww);}
var tr1={x:t,y:ft,mode:"lines",name:"rect_a(t)",line:{color:"#3b82f6",width:2.5},xaxis:"x1",yaxis:"y1"};
var tr2={x:w,y:Fw,mode:"lines",name:"F(omega)=2 sin(omega a)/omega",line:{color:"#f59e0b",width:2.5},xaxis:"x2",yaxis:"y2"};
var layout={grid:{rows:1,columns:2,pattern:"independent"},paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t (zaman)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3,3]},yaxis:{title:"rect_a(t)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.2,1.4]},xaxis2:{domain:[0.54,1],title:"omega (rad/s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-20,20]},yaxis2:{title:"F(omega)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.8,2.4]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-rect-sinc-tr",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Sol:</strong> yarı-genişliği <code>a=1</code> olan dikdörtgen darbe. <strong>Sağ:</strong> onun Fourier Dönüşümü <code>2\\sin(\\omega)/\\omega</code> — <code>\\omega = \\pi, 2\\pi, 3\\pi, \\ldots</code>'de sıfırlanan, sonsuza dek yavaş azalan yan loblara sahip bir sinc.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Keskin kenarlar = yüksek frekanslar</div><div class="card-body">Dikdörtgen darbenin iki kusursuz dik kenarı vardır. Dik kenarları yeniden inşa etmek sonsuz yüksek frekanslar gerektirir — sinc'in yavaş <code>1/\\omega</code> sönümü ve belirgin çınlaması bundandır.</div></div>
<div class="calc-card"><div class="card-title">Dar darbe, geniş spektrum</div><div class="card-body"><code>a \\to 0</code> giderken darbe daralırken sinc <em>genişler</em> (sıfırlar <code>\\pi/a, 2\\pi/a, \\ldots</code>'ya kayar). Bu, belirsizlik ilkesinin ilk somut görüntüsüdür.</div></div>
<div class="calc-card"><div class="card-title">Gibbs olayı</div><div class="card-body">Sonlu sayıda frekans tutup darbeyi yeniden kurarsanız, kenarlarda kalıcı bir aşma (sıçrama yüksekliğinin yaklaşık %9'u) oluşur. Daha çok terim eklemek bunu yok etmez, yalnızca daraltır.</div></div>
</div>

<h2 class="l-title">6. Klasik Örnek 2: Gauss Eğrisi</h2>

<p class="l-text">Sıradaki örnek temel Fourier analizinin en büyülü sonucudur. <code>0</code>'da merkezli, genişlik <code>\\sigma</code> olan Gauss eğrisini tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">GAUSS EĞRİSİ</div><div class="formula-main">$$f(t) = e^{-t^2 / (2\\sigma^2)}$$</div><div class="formula-sub">Çan eğrisi. Önçarpan yok — netlik için olasılık normalizasyonunu ihmal ediyoruz.</div></div>

<p class="l-text">İleri dönüşüme yerleştirin:</p>

<div class="calc-formula"><div class="formula-label">KURULUM</div><div class="formula-main">$$F(\\omega) = \\int_{-\\infty}^{\\infty} e^{-t^2/(2\\sigma^2)}\\, e^{-i\\omega t}\\, dt = \\int_{-\\infty}^{\\infty} e^{-\\left(t^2/(2\\sigma^2) + i\\omega t\\right)}\\, dt$$</div><div class="formula-sub">İki üssü t cinsinden tek bir karesel-artı-doğrusal ifadede birleştirin.</div></div>

<p class="l-text">Şimdi üsteldeki kareyi tamamlayın. Şöyle yazın:</p>

<div class="calc-formula"><div class="formula-label">KARE TAMAMLAMA</div><div class="formula-main">$$\\frac{t^2}{2\\sigma^2} + i\\omega t = \\frac{1}{2\\sigma^2}\\left(t^2 + 2i\\omega\\sigma^2 t\\right) = \\frac{1}{2\\sigma^2}\\left[(t + i\\omega\\sigma^2)^2 + \\omega^2\\sigma^4\\right]$$</div><div class="formula-sub">Tam kare oluşturmak için parantez içinde (omega sigma^2)^2 ekleyip çıkarın.</div></div>

<p class="l-text">Geri yerleştirin:</p>

<div class="calc-formula"><div class="formula-label">AYRILMIŞ FORM</div><div class="formula-main">$$F(\\omega) = e^{-\\sigma^2 \\omega^2 / 2}\\int_{-\\infty}^{\\infty} e^{-(t + i\\omega\\sigma^2)^2 / (2\\sigma^2)}\\, dt$$</div><div class="formula-sub">Omega'ya bağlı çarpan integralin dışına çıkar.</div></div>

<p class="l-text">Geriye kalan integral standart Gauss integralidir (sanal <code>i\\omega\\sigma^2</code> kayması Cauchy teoremine göre değerini değiştirmez). Şunu kullanıyoruz:</p>

<div class="calc-formula"><div class="formula-label">GAUSS İNTEGRALİ</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} e^{-u^2 / (2\\sigma^2)}\\, du = \\sigma\\sqrt{2\\pi}$$</div><div class="formula-sub">Klasik sonuç, integralin karesi alınıp kutupsal koordinatlara geçirilerek ispatlanır.</div></div>

<p class="l-text">Hepsini birleştirirsek:</p>

<div class="calc-formula"><div class="formula-label">GAUSS EĞRİSİNİN FOURIER DÖNÜŞÜMÜ</div><div class="formula-main">$$\\boxed{\\,\\mathcal{F}\\!\\left\\{e^{-t^2/(2\\sigma^2)}\\right\\} = \\sigma\\sqrt{2\\pi}\\;\\, e^{-\\sigma^2 \\omega^2 / 2}\\,}$$</div><div class="formula-sub">Zamanda Gauss, frekansta Gauss olur. Gauss eğrisinin Fourier Dönüşümü bir Gauss eğrisidir.</div></div>

<div id="plot-gaussian-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var sig=1.0;
var t=[];var ft=[];for(var i=-500;i<=500;i++){var x=i/50;t.push(x);ft.push(Math.exp(-x*x/(2*sig*sig)));}
var w=[];var Fw=[];for(var j=-500;j<=500;j++){var ww=j/50;w.push(ww);Fw.push(sig*Math.sqrt(2*Math.PI)*Math.exp(-sig*sig*ww*ww/2));}
var tr1={x:t,y:ft,mode:"lines",name:"f(t)=exp(-t^2/(2 sigma^2))",line:{color:"#3b82f6",width:2.5},xaxis:"x1",yaxis:"y1"};
var tr2={x:w,y:Fw,mode:"lines",name:"F(omega)=sigma sqrt(2 pi) exp(-sigma^2 omega^2 /2)",line:{color:"#f59e0b",width:2.5},xaxis:"x2",yaxis:"y2"};
var layout={grid:{rows:1,columns:2,pattern:"independent"},paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t (sigma=1)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-6,6]},yaxis:{title:"f(t)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},xaxis2:{domain:[0.54,1],title:"omega (rad/s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-6,6]},yaxis2:{title:"F(omega)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.3,3]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-gaussian-tr",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Sol:</strong> <code>\\sigma = 1</code> olan zaman alanındaki Gauss eğrisi. <strong>Sağ:</strong> Fourier Dönüşümü, yine Gauss, fakat genişliği <code>1/\\sigma = 1</code>. Fourier Dönüşümü kendisi ile aynı biçime sahip tek fonksiyon Gauss eğrisidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genişlik tersi</div><div class="card-body">Zamandaki Gauss eğrisinin genişliği <code>\\sigma</code>'dır. Frekanstaki Gauss eğrisinin genişliği <code>1/\\sigma</code>'dır. Zaman sinyalini daraltın, spektrum tam olarak aynı oranda genişler.</div></div>
<div class="calc-card"><div class="card-title">FT'nin özfonksiyonu</div><div class="card-body">Gauss eğrisi (ölçekleme dışında) <code>\\mathcal{F}\\{f\\} = c \\cdot f</code> sağlayan tek fonksiyondur. Kuantum mekaniğinde bu, Gauss dalga paketlerini "minimum belirsizlik" durumları yapar.</div></div>
<div class="calc-card"><div class="card-title">Neden çınlama yok?</div><div class="card-body">Dikdörtgen darbenin aksine Gauss eğrisi düzgündür (sonsuz türevlenebilir). Keskin kenar yok, dolayısıyla yüksek frekans kuyruğu yok, çınlama yok — yalnızca başka bir düzgün Gauss eğrisi.</div></div>
</div>

<div class="think-box"><div class="think-label">NEDEN ÖNEMLİ</div><div class="think-body">Gauss-Gauss özelliği temel Fourier analizinin en derin gerçeğidir. Size zamandaki düzgünlüğün frekansta hızlı sönüme karşılık geldiğini, tersinin de geçerli olduğunu söyler. Belirsizlik ilkesinin en temiz gösterimini de verir: tam olarak <code>\\sigma_t \\cdot \\sigma_\\omega = 1</code> ve Gauss eğrisi Heisenberg eşitsizliğini doyurur.</div></div>

<h2 class="l-title">7. Klasik Örnek 3: Üstel Sönüm</h2>

<p class="l-text">Üçüncü standart örnek fiziksel sistemlerin dengeye gevşediği her yerde karşımıza çıkar: deşarj olan kondansatörler, radyoaktif bozunma, sönümlü osilatörler. Tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">TEK TARAFLI ÜSTEL SÖNÜM</div><div class="formula-main">$$f(t) = \\begin{cases} e^{-at} & \\text{eğer } t > 0 \\\\ 0 & \\text{eğer } t \\le 0 \\end{cases} \\qquad (a > 0)$$</div><div class="formula-sub">Nedensel üstel — negatif zaman için sıfır, pozitif zaman için sıfıra inen sönüm.</div></div>

<p class="l-text">İleri dönüşüm integrali yalnızca <code>0</code>'dan <code>\\infty</code>'a koşar:</p>

<div class="calc-formula"><div class="formula-label">TÜRETİM</div><div class="formula-main">$$F(\\omega) = \\int_{0}^{\\infty} e^{-at}\\, e^{-i\\omega t}\\, dt = \\int_{0}^{\\infty} e^{-(a + i\\omega)t}\\, dt$$</div><div class="formula-sub">Üsleri birleştirin — a reel ve pozitif olduğundan integral yakınsar.</div></div>

<p class="l-text">Bu basit bir antitürevdir:</p>

<div class="calc-formula"><div class="formula-label">ÜSTEL SÖNÜMÜN FOURIER DÖNÜŞÜMÜ</div><div class="formula-main">$$F(\\omega) = \\left[\\frac{e^{-(a+i\\omega)t}}{-(a+i\\omega)}\\right]_{0}^{\\infty} = \\frac{1}{a + i\\omega}$$</div><div class="formula-sub">Üst sınır kaybolur çünkü Re(a + i omega) = a > 0. Alt sınır sonucu verir.</div></div>

<p class="l-text">Bu karmaşık değerlidir. Büyüklük (<strong>Lorentzian</strong>) ve faz şudur:</p>

<div class="calc-formula"><div class="formula-label">BÜYÜKLÜK VE FAZ</div><div class="formula-main">$$|F(\\omega)| = \\frac{1}{\\sqrt{a^2 + \\omega^2}}, \\qquad \\arg F(\\omega) = -\\arctan\\!\\left(\\frac{\\omega}{a}\\right)$$</div><div class="formula-sub">Büyüklük omega=0'da 1/a yüksekliğinde tepe yapar; büyük omega için 1/omega gibi azalır. Faz +pi/2'den -pi/2'ye yuvarlanır.</div></div>

<div id="plot-exp-decay-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0;
var t=[];var ft=[];for(var i=-100;i<=500;i++){var x=i/50;t.push(x);ft.push(x>0?Math.exp(-a*x):0);}
var w=[];var mag=[];var ph=[];for(var j=-500;j<=500;j++){var ww=j/50;w.push(ww);mag.push(1/Math.sqrt(a*a+ww*ww));ph.push(-Math.atan2(ww,a));}
var tr1={x:t,y:ft,mode:"lines",name:"f(t)=exp(-a t) (t>0)",line:{color:"#3b82f6",width:2.5},xaxis:"x1",yaxis:"y1"};
var tr2={x:w,y:mag,mode:"lines",name:"|F(omega)|=1/sqrt(a^2+omega^2)",line:{color:"#f59e0b",width:2.5},xaxis:"x2",yaxis:"y2"};
var tr3={x:w,y:ph,mode:"lines",name:"arg F(omega)",line:{color:"#10b981",width:2,dash:"dot"},xaxis:"x2",yaxis:"y3"};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t (a=1)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,8]},yaxis:{title:"f(t)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},xaxis2:{domain:[0.54,1],title:"omega (rad/s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-10,10],anchor:"y2"},yaxis2:{title:"|F(omega)|",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2],anchor:"x2"},yaxis3:{title:"arg F",overlaying:"y2",side:"right",range:[-2,2],showgrid:false},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:60}};
Plotly.newPlot("plot-exp-decay-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Sol:</strong> <code>t > 0</code> için nedensel üstel <code>e^{-t}</code>. <strong>Sağ:</strong> büyüklük <code>|F(\\omega)| = 1/\\sqrt{1 + \\omega^2}</code> (turuncu, Lorentzian biçimi) ve faz <code>\\arg F(\\omega) = -\\arctan(\\omega)</code> (yeşil noktalı, <code>+\\pi/2</code>'den <code>-\\pi/2</code>'ye değişir).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RC alçak geçiren filtre</div><div class="card-body">Bir RC alçak geçiren filtrenin dürtü tepkisi tam olarak <code>(1/\\tau) e^{-t/\\tau}</code>'dur. Transfer fonksiyonu <code>1/(1 + i\\omega\\tau)</code> tipik alçak geçiren biçimdir — yüksek frekanslar zayıflar ve faz gecikmesi <code>\\omega</code> ile büyür.</div></div>
<div class="calc-card"><div class="card-title">Spektral çizgiler</div><div class="card-body">Spektroskopide uyarılmış bir durumun ömrü <code>1/a</code>'dır. Emisyon spektrumu, taşıyıcı frekansta merkezlenmiş yaklaşık <code>2a</code> genişlikli bir Lorentzian'dır. Daha kısa ömür, daha geniş çizgi — yine belirsizlik.</div></div>
<div class="calc-card"><div class="card-title">Nedensellik ve Laplace dönüşümü</div><div class="card-body"><code>t < 0</code> için <code>f(t) = 0</code> olduğundan Fourier integrali tek taraflıdır. <code>s = a + i\\omega</code> yerleştirildiğinde Laplace dönüşümü ile bağlantı çıkar — bunu Ders 7'de işleyeceğiz.</div></div>
</div>

<h2 class="l-title">8. Temel Özellikler</h2>

<p class="l-text">Fourier Dönüşümü ezberlenmeyi hak edecek kadar yararlı yarım düzine özelliği sağlar. Her biri, bir alandaki zor bir işlemi diğer alanda basit bir işleme dönüştürür.</p>

<div class="calc-formula"><div class="formula-label">ALTI TEMEL ÖZELLİK</div><div class="formula-main">$$\\begin{array}{l|l|l} \\textbf{Özellik} & \\textbf{Zaman alanı} & \\textbf{Frekans alanı} \\\\ \\hline \\text{Doğrusallık} & \\alpha f(t) + \\beta g(t) & \\alpha F(\\omega) + \\beta G(\\omega) \\\\ \\text{Zaman kayması} & f(t - t_0) & F(\\omega)\\, e^{-i \\omega t_0} \\\\ \\text{Frekans kayması} & f(t)\\, e^{i \\omega_0 t} & F(\\omega - \\omega_0) \\\\ \\text{Ölçekleme} & f(a t) & \\tfrac{1}{|a|} F(\\omega / a) \\\\ \\text{Evrişim} & (f * g)(t) & F(\\omega)\\, G(\\omega) \\\\ \\text{Türev} & \\dfrac{d f}{d t} & i \\omega\\, F(\\omega) \\end{array}$$</div><div class="formula-sub">Evrişim teoremi tüm sinyal işlemedeki tek özelliğin en sonuç doğurucusudur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrusallık</div><div class="card-body">Sinyallerin toplamı spektrumların toplamına gider. Fourier Dönüşümü doğrusal bir operatördür — sinyal işlemenin doğal "baz değişimi" olmasını yalnız bu özellik gerekçelendirir.</div></div>
<div class="calc-card"><div class="card-title">Zaman kayması</div><div class="card-body">Sinyali <code>t_0</code> kadar geciktirmek spektrumu <code>e^{-i\\omega t_0}</code> ile çarpar. <em>Büyüklük</em> <code>|F(\\omega)|</code> değişmez — yalnızca faz <code>\\omega</code> ile doğrusal olarak kayar. Bu yüzden faz, sinyalin zaman hizalama bilgisini taşır.</div></div>
<div class="calc-card"><div class="card-title">Frekans kayması (modülasyon)</div><div class="card-body">Sinyali zamanda <code>e^{i\\omega_0 t}</code> ile çarpmak tüm spektrumu frekansta <code>\\omega_0</code> kadar kaydırır. AM/FM radyo taşıyıcısı tam olarak bunu yapar — ses bandı frekanslarını yayım için MHz seviyesine çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Ölçekleme (ikilik)</div><div class="card-body">Zamanı <code>a</code> kadar sıkıştırın, frekans <code>1/a</code> kadar genişler. Hızlı bir sinyal geniş bir spektruma sahiptir; yavaş bir sinyal dar bir spektruma. Belirsizlik ilkesinin temeli budur.</div></div>
<div class="calc-card"><div class="card-title">Evrişim teoremi (büyük olan)</div><div class="card-body">Zamanda evrişim frekansta nokta-noktasına çarpıma dönüşür. <strong>Doğrusal süzgeçleme frekans alanında çarpmadır.</strong> Her dijital filtre, her ses ekolayzeri, her görüntü bulanıklaştırma — bunu kullanır.</div></div>
<div class="calc-card"><div class="card-title">Türev kuralı</div><div class="card-body">Zamanda türev almak frekansta <code>i\\omega</code> ile çarpmaya dönüşür. Sabit katsayılı doğrusal ODE ve PDE'ler frekans alanında cebirsel denklemlere dönüşür — Fourier yöntemlerinin onları çözmesinin sebebi budur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Modülasyon</div><div class="example-body"><code>f(t)</code>, spektrumu <code>|\\omega| < W</code> ile sınırlı olan bir taban bant ses sinyali olsun. Taşıyıcı ile çarpın: <code>g(t) = f(t)\\cos(\\omega_0 t)</code>. Euler'den <code>\\cos(\\omega_0 t) = \\tfrac{1}{2}(e^{i\\omega_0 t} + e^{-i\\omega_0 t})</code>. Frekans kayması özelliği uygulanırsa:<br><br><code>G(\\omega) = \\tfrac{1}{2} F(\\omega - \\omega_0) + \\tfrac{1}{2} F(\\omega + \\omega_0)</code><br><br>Taban bant spektrumu <code>\\pm\\omega_0</code>'a yarı genlikle kopyalanır — standart AM spektrumu. Demodülasyon bunu tersine çevirir: yeniden taşıyıcıyla çarpın ve alçak geçiren süzün.</div></div>

<div id="plot-modulation-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var W=2;var w0=8;
var w=[];var F=[];var G=[];
for(var j=-1500;j<=1500;j++){var ww=j/100;w.push(ww);
var f0=Math.abs(ww)<W?Math.exp(-(ww*ww)/(W*W)):0;F.push(f0);
var g1=Math.abs(ww-w0)<W?Math.exp(-((ww-w0)*(ww-w0))/(W*W)):0;
var g2=Math.abs(ww+w0)<W?Math.exp(-((ww+w0)*(ww+w0))/(W*W)):0;
G.push(0.5*(g1+g2));}
var tr1={x:w,y:F,mode:"lines",name:"F(omega) taban bant",line:{color:"#3b82f6",width:2.5}};
var tr2={x:w,y:G,mode:"lines",name:"G(omega): f(t) cos(omega_0 t)",line:{color:"#f59e0b",width:2.5}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"omega",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-14,14]},yaxis:{title:"spektrum genliği",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-modulation-tr",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><code>\\omega_0 = 8</code> ile <code>\\cos(\\omega_0 t)</code> taşıyıcısına modülasyon: taban bant spektrumu (mavi, sıfırda merkezli) <code>\\pm\\omega_0</code>'a yarı genlikle kopyalanır (turuncu). Radyo bu şekilde çalışır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK: Evrişim Teoremi</div><div class="example-body">İki sinyali evrişmek istediğinizi varsayın: <code>h(t) = (f * g)(t) = \\int f(\\tau) g(t-\\tau) d\\tau</code>. Uzunluğu <code>N</code> olan örneklenmiş sinyaller için doğrudan hesap <code>O(N^2)</code>'dir. Ama evrişim teoremi sayesinde, <code>H(\\omega) = F(\\omega) G(\\omega)</code>. Algoritma: <code>f</code> ve <code>g</code>'nin FFT'sini alın (<code>O(N \\log N)</code>), nokta-noktasına çarpın (<code>O(N)</code>), ters FFT alın (<code>O(N \\log N)</code>). Toplam <code>O(N \\log N)</code> — dramatik bir hızlanma. Bu, her hızlı süzgeç uygulamasının temelidir.</div></div>

<div id="plot-convolution-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var t=[];var f=[];var g=[];var h=[];
for(var i=-300;i<=300;i++){var x=i/30;t.push(x);
var fv=Math.abs(x)<1?1:0;f.push(fv);
var gv=Math.exp(-x*x);g.push(gv);}
var dt=1/30;
for(var k=0;k<t.length;k++){var s=0;for(var m=0;m<t.length;m++){var idx=k-m+Math.floor(t.length/2);if(idx>=0&&idx<t.length){s+=f[m]*g[idx]*dt;}}h.push(s);}
var tr1={x:t,y:f,mode:"lines",name:"f(t) dikdörtgen darbe",line:{color:"#3b82f6",width:2}};
var tr2={x:t,y:g,mode:"lines",name:"g(t) Gauss çekirdek",line:{color:"#10b981",width:2}};
var tr3={x:t,y:h,mode:"lines",name:"(f * g)(t)",line:{color:"#f59e0b",width:2.5}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"t",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4]},yaxis:{title:"genlik",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.2,2]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-convolution-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Bir dikdörtgen darbenin (mavi) Gauss çekirdeği (yeşil) ile evrişimi düzleştirilmiş darbeyi üretir (turuncu) — keskin kenarlar Gauss tarafından "bulanıklaştırılmıştır". Frekansta bu basit <code>F(\\omega) G(\\omega)</code> çarpımıdır.</div></div>

<h2 class="l-title">9. Parseval/Plancherel Teoremi</h2>

<p class="l-text">Fourier Dönüşümü toplam enerjiyi korur. Bu, lineer cebirdeki "döndürme uzunluğu korur" ifadesinin analitik kardeşidir — FT (uygun normalize edildiğinde) <em>üniter</em> bir dönüşümdür.</p>

<div class="calc-formula"><div class="formula-label">PLANCHEREL TEOREMİ</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} |f(t)|^2\\, dt = \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} |F(\\omega)|^2\\, d\\omega$$</div><div class="formula-sub">Zaman alanındaki enerji frekans alanındaki enerjiye eşittir (1/(2 pi) ölçü çarpanıyla).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Enerji spektral yoğunluğu</div><div class="card-body"><code>|F(\\omega)|^2 / (2\\pi)</code> miktarı <strong>enerji spektral yoğunluğudur</strong> — birim açısal frekans başına enerji. Bunu bir frekans bandı üzerinde integre ederseniz sinyalinizin enerjisinin ne kadarının o bandta yattığını öğrenirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Üniter FT</div><div class="card-body">Simetrik konvansiyonla (her iki formülde de <code>1/\\sqrt{2\\pi}</code>) eşitlik harfiyen <code>\\|f\\|_2 = \\|F\\|_2</code>'ye dönüşür. FT böylece <code>L^2(\\mathbb{R})</code>'nin gerçek bir izometrisi olur.</div></div>
<div class="calc-card"><div class="card-title">Neden büyük</div><div class="card-body">Birçok büyüklüğü (normlar, iç çarpımlar, enerjiler, korelasyonlar) iki alanda da değişimli olarak hesaplayabilirsiniz. Hangi alanda integral daha kolaysa onu seçin. Cevap aynıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">GAUSS EĞRİSİ İÇİN DOĞRULAMA</div><div class="example-body">Zaman alanı enerjisi: <code>\\int e^{-t^2/\\sigma^2} dt = \\sigma\\sqrt{\\pi}</code> (<code>2\\cdot t^2/(2\\sigma^2) = t^2/\\sigma^2</code> olduğundan).<br><br>Frekans tarafı: <code>\\frac{1}{2\\pi}\\int (\\sigma\\sqrt{2\\pi})^2 e^{-\\sigma^2 \\omega^2} d\\omega = \\frac{2\\pi\\sigma^2}{2\\pi}\\int e^{-\\sigma^2 \\omega^2} d\\omega = \\sigma^2 \\cdot \\frac{\\sqrt{\\pi}}{\\sigma} = \\sigma\\sqrt{\\pi}</code>. ✔<br><br>İki taraf da uyuşur — Plancherel geçerli.</div></div>

<h2 class="l-title">10. Belirsizlik İlkesi</h2>

<p class="l-text">Artık matematiksel fizikteki belki en derin eşitsizliğe geliyoruz. (Uygun şekilde normalize edilmiş) bir sinyalin zaman ve frekans yayılımını şöyle tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">YAYILIMLAR</div><div class="formula-main">$$(\\Delta t)^2 = \\frac{\\int t^2 |f(t)|^2 dt}{\\int |f(t)|^2 dt}, \\qquad (\\Delta\\omega)^2 = \\frac{\\int \\omega^2 |F(\\omega)|^2 d\\omega}{\\int |F(\\omega)|^2 d\\omega}$$</div><div class="formula-sub">Her alandaki enerji dağılımının standart sapması (ortalamada merkezlenmiş).</div></div>

<div class="calc-formula"><div class="formula-label">BELİRSİZLİK İLKESİ (FOURIER)</div><div class="formula-main">$$\\boxed{\\,\\Delta t \\cdot \\Delta\\omega \\;\\ge\\; \\tfrac{1}{2}\\,}$$</div><div class="formula-sub">Bir sinyal aynı anda hem zamanda dar hem frekansta dar olamaz. Eşitlik yalnızca Gauss eğrileriyle sağlanır.</div></div>

<p class="l-text">Sıradan frekansa geçin <code>\\xi = \\omega/(2\\pi)</code> ve eşitsizlik <code>\\Delta t \\cdot \\Delta\\xi \\ge 1/(4\\pi)</code> şeklini alır. Kuantum mekaniğinde <code>t</code>'yi konumla, <code>\\omega</code>'yı momentum/<code>\\hbar</code> ile özdeşleştirin ve eşitsizlik meşhur şekle bürünür:</p>

<div class="calc-formula"><div class="formula-label">HEISENBERG EŞİTSİZLİĞİ</div><div class="formula-main">$$\\Delta x \\cdot \\Delta p \\;\\ge\\; \\frac{\\hbar}{2}$$</div><div class="formula-sub">Aynı eşitsizlik, fiziksel birimlerle giydirilmiş. Konum ve momentum birbirinin Fourier eşlenikleridir.</div></div>

<div id="plot-uncertainty-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var traces=[];var colors=["#3b82f6","#10b981","#f59e0b","#ef4444"];var sigmas=[2.0,1.0,0.5,0.25];
for(var s=0;s<sigmas.length;s++){var sig=sigmas[s];
var t=[];var ft=[];for(var i=-300;i<=300;i++){var x=i/30;t.push(x);ft.push(Math.exp(-x*x/(2*sig*sig)));}
traces.push({x:t,y:ft,mode:"lines",name:"sigma_t="+sig,line:{color:colors[s],width:2},xaxis:"x1",yaxis:"y1"});
var w=[];var Fw=[];for(var j=-300;j<=300;j++){var ww=j/30;w.push(ww);Fw.push(sig*Math.sqrt(2*Math.PI)*Math.exp(-sig*sig*ww*ww/2));}
traces.push({x:w,y:Fw,mode:"lines",name:"sigma_omega=1/"+sig,line:{color:colors[s],width:2},xaxis:"x2",yaxis:"y2",showlegend:false});}
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{domain:[0,0.46],title:"t",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-6,6]},yaxis:{title:"|f(t)|",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.1,1.2]},xaxis2:{domain:[0.54,1],title:"omega",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-10,10]},yaxis2:{title:"|F(omega)|",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.3,6]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-uncertainty-tr",traces,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Dört Gauss eğrisi: <code>\\sigma_t</code> 2'den 0.25'e küçüldükçe (sol, maviden kırmızıya), karşılık gelen spektrumlar (sağ) tam aynı oranda genişler. <code>\\sigma_t \\cdot \\sigma_\\omega = 1</code> çarpımı sabit kalır — Gauss eğrileri belirsizlik sınırını doyurur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mühendislik anlamı</div><div class="card-body">Hem zamanda (keskin dürtü tepkisi) hem frekansta (keskin geçirme bandı) kusursuz yerelleşen bir filtre tasarlayamazsınız. Tüm filtre tasarımı belirsizlik ilkesiyle yapılan bir pazarlıktır.</div></div>
<div class="calc-card"><div class="card-title">Müzik anlamı</div><div class="card-body">Çok kısa bir tıkırtı geniş bir frekans aralığı içerir; tek bir sürdürülen ton frekansta yerelleşmiştir ama zamanda yayılır. Spektrogram (Ders 8) tam olarak bu ödünleşimi görselleştirme aracıdır.</div></div>
<div class="calc-card"><div class="card-title">Fizik anlamı</div><div class="card-body">Heisenberg eşitsizliği aynı eşitsizliktir, konum ve momentuma (ki bunlar kuantum mekaniğinde birbirinin Fourier eşlenikleridir) aktarılmıştır. Evren Fourier Dönüşümünün geometrisi tarafından kısıtlanmıştır.</div></div>
</div>

<div class="think-box"><div class="think-label">DERİN BAĞLANTI</div><div class="think-body">Tam olarak aynı matematiksel ifade — <code>\\Delta t \\cdot \\Delta\\omega \\ge 1/2</code> — hem ses filtrelerinin davranışını hem de kuantum mekaniğinin temel sınırlarını yönetir. Fourier analizi "bir araç" değil, doğada bilginin nasıl yapılandığının temel bir yönüdür. Bunu içselleştirdiğinizde fizikçilerin, mühendislerin ve uygulamalı matematikçilerin neden aynı alet kutusuna yöneldiğini anlarsınız.</div></div>

<h2 class="l-title">11. Pratik Pyodide Alıştırması</h2>

<p class="l-text">Şimdi Fourier Dönüşümlerini kendimiz hesaplayalım. NumPy kullanarak sürekli integrali Riemann toplamı ile yaklaşıklayacak ve her klasik örneği sayısal olarak doğrulayacağız. Alıştırma bir Gauss, bir dikdörtgen darbe ve bir üstel sönüm için FT hesaplar ve büyüklük (ve gereken yerde fazı) orijinal sinyalin yanında çizer.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># --- Riemann toplamı ile sayısal Fourier Dönüşümü ---------------</span>
<span class="cm"># F(omega) = integral f(t) exp(-i omega t) dt</span>

<span class="kw">def</span> <span class="fn">cft</span>(t, f, omega):
    <span class="str">"""Sürekli FT'yi verilen omega değerlerinde yaklaşıkla."""</span>
    dt = t[<span class="num">1</span>] - t[<span class="num">0</span>]
    <span class="cm"># Dış çarpım: şekil (len(omega), len(t))</span>
    kernel = np.exp(-<span class="num">1j</span> * np.outer(omega, t))
    <span class="kw">return</span> kernel @ f * dt

<span class="cm"># Zaman ızgarası: üç sinyal de kenarlarda ~0'a iner</span>
t = np.linspace(-<span class="num">10</span>, <span class="num">10</span>, <span class="num">4001</span>)
omega = np.linspace(-<span class="num">10</span>, <span class="num">10</span>, <span class="num">801</span>)

<span class="cm"># --- Sinyal 1: Gauss eğrisi -------------------------------------</span>
sigma = <span class="num">1.0</span>
g = np.exp(-t**<span class="num">2</span> / (<span class="num">2</span> * sigma**<span class="num">2</span>))
G_num = <span class="fn">cft</span>(t, g, omega)
G_ana = sigma * np.sqrt(<span class="num">2</span> * np.pi) * np.exp(-sigma**<span class="num">2</span> * omega**<span class="num">2</span> / <span class="num">2</span>)
err_g = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(G_num - G_ana))
<span class="fn">print</span>(<span class="str">f"Gauss      FT mak. hata vs analitik:    {err_g:.3e}"</span>)

<span class="cm"># --- Sinyal 2: Dikdörtgen darbe ---------------------------------</span>
a = <span class="num">1.0</span>
r = np.<span class="fn">where</span>(np.<span class="fn">abs</span>(t) &lt; a, <span class="num">1.0</span>, <span class="num">0.0</span>)
R_num = <span class="fn">cft</span>(t, r, omega)
<span class="cm"># Analitik: 2 sin(omega a)/omega, omega=0'da limit 2a</span>
R_ana = np.<span class="fn">where</span>(np.<span class="fn">abs</span>(omega) &lt; <span class="num">1e-9</span>, <span class="num">2</span>*a, <span class="num">2</span>*np.sin(omega*a)/omega)
err_r = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(R_num.real - R_ana))
<span class="fn">print</span>(<span class="str">f"Dikd. darbe FT mak. hata vs analitik:    {err_r:.3e}"</span>)

<span class="cm"># --- Sinyal 3: Tek taraflı üstel sönüm --------------------------</span>
alpha = <span class="num">1.0</span>
e = np.<span class="fn">where</span>(t &gt; <span class="num">0</span>, np.exp(-alpha*t), <span class="num">0.0</span>)
E_num = <span class="fn">cft</span>(t, e, omega)
E_ana = <span class="num">1.0</span> / (alpha + <span class="num">1j</span>*omega)
err_e = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(E_num - E_ana))
<span class="fn">print</span>(<span class="str">f"Üstel sön. FT mak. hata vs analitik:    {err_e:.3e}"</span>)

<span class="cm"># --- Gauss üzerinde Parseval/Plancherel doğrulaması -------------</span>
energy_t = np.<span class="fn">sum</span>(np.<span class="fn">abs</span>(g)**<span class="num">2</span>) * (t[<span class="num">1</span>]-t[<span class="num">0</span>])
energy_w = np.<span class="fn">sum</span>(np.<span class="fn">abs</span>(G_num)**<span class="num">2</span>) * (omega[<span class="num">1</span>]-omega[<span class="num">0</span>]) / (<span class="num">2</span>*np.pi)
<span class="fn">print</span>(<span class="str">f"\\nPlancherel: zaman enerjisi   = {energy_t:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"Plancherel: frekans enerjisi = {energy_w:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"Analitik Gauss enerjisi = sigma sqrt(pi) = {sigma*np.sqrt(np.pi):.6f}"</span>)</code></pre></div>

<div class="l-note"><strong>Bu kodu çalıştırın</strong> (alttaki lab'ta) ve üç Fourier Dönüşümünün analitik biçimleriyle yaklaşık 10<sup>-4</sup> hassasiyetinde uyuştuğunu görün (artık hata Riemann toplamı yaklaşımının hatasıdır). Plancherel kontrolü enerjinin iki alan arasında korunduğunu onaylar. <code>sigma</code> veya <code>a</code>'yı değiştirin ve spektrumların buna göre genişleyip daraldığını izleyin — belirsizlik ilkesi iş başında.</div>

<div class="calc-example"><div class="example-label">DENENECEK UZANTILAR</div><div class="example-body"><strong>(1)</strong> <code>f(t) = e^{-|t|}</code> (iki taraflı üstel) için FT'yi hesaplayın. Analitik cevap: <code>2/(1 + \\omega^2)</code> — gerçek değerli bir Lorentzian. Sayısal olarak doğrulayın.<br><strong>(2)</strong> Bir cıvıltı <code>f(t) = e^{-t^2/2} \\cos(5t)</code> için FT'yi hesaplayın ve <code>\\omega = \\pm 5</code>'te iki tepeyi gözlemleyin.<br><strong>(3)</strong> Evrişim teoremini doğrulayın: <code>\\text{rect}(t)</code>'yi zamanda kendisiyle evirin ve frekansta <code>(\\text{sinc})^2</code> ile karşılaştırın.</div></div>

<h2 class="l-title">12. Hızlı Başvuru: Yararlı Fourier Çiftleri</h2>

<p class="l-text">Bu tabloyu yazdırıp duvarınıza asın. Günlük olarak kullanacağınız her dönüşüm çiftini ve Ders 6'da göreceğiniz birkaç standart dağılımı (delta, basamak, işaret) toplar.</p>

<div class="calc-formula"><div class="formula-label">FOURIER ÇİFTLERİ TABLOSU</div><div class="formula-main">$$\\begin{array}{l|l} \\textbf{Zaman alanı } f(t) & \\textbf{Frekans alanı } F(\\omega) \\\\ \\hline \\delta(t) & 1 \\\\ 1 & 2\\pi\\,\\delta(\\omega) \\\\ e^{i\\omega_0 t} & 2\\pi\\,\\delta(\\omega - \\omega_0) \\\\ \\cos(\\omega_0 t) & \\pi[\\delta(\\omega-\\omega_0) + \\delta(\\omega+\\omega_0)] \\\\ \\sin(\\omega_0 t) & -i\\pi[\\delta(\\omega-\\omega_0) - \\delta(\\omega+\\omega_0)] \\\\ \\text{rect}_a(t) & 2a\\,\\text{sinc}(a\\omega/\\pi) \\\\ \\text{sinc}(t/T) & T\\,\\text{rect}_{1/T}(\\omega/(2\\pi)) \\\\ e^{-t^2/(2\\sigma^2)} & \\sigma\\sqrt{2\\pi}\\,e^{-\\sigma^2\\omega^2/2} \\\\ e^{-at}u(t) & 1/(a+i\\omega) \\\\ e^{-a|t|} & 2a/(a^2+\\omega^2) \\\\ u(t) & \\pi\\delta(\\omega) + 1/(i\\omega) \\\\ \\text{sgn}(t) & 2/(i\\omega) \\end{array}$$</div><div class="formula-sub">u(t) birim basamak, sgn(t) işaret fonksiyonudur. Delta içeren girdiler Ders 6'nın dağılım teorisini gerektirir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İkilik</div><div class="card-body">6. satır (rect'ten sinc'e) ile 7. satır (sinc'ten rect'e) arasındaki simetriye dikkat. Bu, <strong>ikilik özelliğidir</strong>: <code>f(t) \\leftrightarrow F(\\omega)</code> ise <code>F(t) \\leftrightarrow 2\\pi f(-\\omega)</code>. Tablonun yarısı diğer yarısının sağdan okunmuşudur.</div></div>
<div class="calc-card"><div class="card-title">Delta-fonksiyonlu satırlar</div><div class="card-body">1'den 5'e satırlar <code>\\delta(\\omega)</code> içerir — bunlar <em>dağılımsal</em> Fourier çiftleridir. Karşılık gelen sinyaller (sabit, karmaşık üstel, kosinüs, sinüs) ne L^1 ne L^2'dedir, dolayısıyla integral sıradan anlamda yakınsamaz. Delta tek anlamlı cevaptır.</div></div>
<div class="calc-card"><div class="card-title">Mühendis kısa yolu</div><div class="card-body">Karmaşık bir sinyali dönüştürmeniz gerektiğinde, onu yukarıdaki satırların toplamı/çarpımı olarak ayrıştırın ve doğrusallık/kayma/ölçekleme/evrişim uygulayın. Fourier integralini sıfırdan değerlendirmeniz neredeyse hiç gerekmez.</div></div>
</div>

<h2 class="l-title">Özet</h2>

<p class="l-text">Sürekli Fourier Dönüşümü, Fourier Serilerini periyot sonsuza giderken genelleştirir ve böylece periyodik olmayan genel sinyalleri kapsar. İleri dönüşüm <code>F(\\omega) = \\int f(t) e^{-i\\omega t} dt</code> her reel frekansa bir karmaşık genlik atar; ters <code>f(t) = \\frac{1}{2\\pi}\\int F(\\omega) e^{i\\omega t} d\\omega</code> orijinal sinyali yeniden inşa eder. Üç klasik örnek — dikdörtgen darbe (sinc verir), Gauss eğrisi (Gauss verir), üstel sönüm (Lorentzian verir) — pratikte göreceğiniz nitel davranışı kapsar. Altı temel özellik (doğrusallık, zaman/frekans kayması, ölçekleme, evrişim, türev) zor işlemleri kolaylara dönüştürür; tek başına evrişim teoremi her dijital filtrenin nasıl yapıldığını yeniden şekillendirir. Plancherel iki alan arasında enerji korunumunu garanti eder ve belirsizlik ilkesi <code>\\Delta t \\cdot \\Delta\\omega \\ge 1/2</code> tam olarak kuantum fiziğindeki Heisenberg eşitsizliğidir. Ders 5'te tüm bu hikâyeyi ayrıklaştırıp DFT ve FFT'ye varacağız.</p>
`
};
