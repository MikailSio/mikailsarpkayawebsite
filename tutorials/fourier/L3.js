window.FOURIER_L3 = {

en: `<p class="l-text"><strong>This lesson is the bridge.</strong> On one side: the real-valued Fourier series with its two coefficient families <span class="kw">a<sub>n</sub></span> and <span class="kw">b<sub>n</sub></span>, two trigonometric functions, and a vague sense that "sines and cosines somehow encode signals." On the other side: every modern textbook, every signal processing library, every DSP paper writes the Fourier transform as a single, compact expression involving <span class="kw">e<sup>iωt</sup></span>. How do we get from there to here?</p>`

+ `<p class="l-text">The answer is <strong>Euler's formula</strong> — the most surprising equation in all of mathematics, and the single most important identity in signal processing. Once you internalise it, the complex exponential form of the Fourier series is not just convenient notation — it is the natural language of oscillation itself.</p>`

+ `<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">`
+ `<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>`
+ `<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">`
+ `<li>Read complex numbers geometrically as points in the plane with magnitude and phase</li>`
+ `<li>Derive Euler's formula from the Taylor series of e<sup>x</sup>, cos(x), sin(x)</li>`
+ `<li>Visualise e<sup>iωt</sup> as a unit-speed rotation around the unit circle</li>`
+ `<li>Convert a real Fourier series into the compact form Σ c<sub>n</sub>·e<sup>inω₀t</sup></li>`
+ `<li>Interpret negative frequencies as counter-rotating phasors that pair into real signals</li>`
+ `<li>Compute c<sub>n</sub> directly with a single projection integral and read its magnitude and phase</li>`
+ `</ul>`
+ `</div>`

/* ============================================================
   SECTION 1: Quick Review of Complex Numbers
   ============================================================ */
+ `<h2 class="l-title">1. Quick Review: Complex Numbers</h2>`

+ `<div class="l-highlight"><strong>A confession:</strong> many engineering students have a working but uncomfortable relationship with complex numbers. We will start from scratch — no assumed memory from high school — because every concept in this lesson rests on this foundation.</div>`

+ `<p class="l-text">A <strong>complex number</strong> is an ordered pair of real numbers written as</p>`

+ `<div class="calc-formula"><div class="formula-label">RECTANGULAR FORM</div><div class="formula-main">$$z = a + b\\,i, \\qquad a, b \\in \\mathbb{R}, \\qquad i^2 = -1$$</div><div class="formula-sub">Here <em>a</em> is the real part, <em>b</em> is the imaginary part, and <em>i</em> is the unit such that i² = -1.</div></div>`

+ `<p class="l-text">There is nothing mystical about the symbol <em>i</em>. It is simply a token we use to label the "second coordinate" of a two-dimensional number. The rule i² = -1 is what makes the algebra interesting — and ultimately what gives us rotation.</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Real part Re(z)</div><div class="card-body">The number <em>a</em> in z = a + bi. Plotted along the horizontal axis. Everything you already know about real numbers applies here.</div></div>`
+ `<div class="calc-card"><div class="card-title">Imaginary part Im(z)</div><div class="card-body">The number <em>b</em> in z = a + bi. Plotted along the vertical axis. Despite the name, <em>b</em> is a perfectly ordinary real number — the word "imaginary" is a historical accident.</div></div>`
+ `<div class="calc-card"><div class="card-title">Complex conjugate</div><div class="card-body">Written z̄ = a − bi. Reflects z across the real axis. Will appear constantly when we discuss real signals and negative frequencies.</div></div>`
+ `</div>`

+ `<p class="l-text">Geometrically, every complex number <em>z</em> is a single point in a 2D plane (called the <strong>complex plane</strong> or <strong>Argand diagram</strong>). The horizontal axis carries the real part, the vertical axis carries the imaginary part. Once you see <em>z</em> as a point — equivalently, as a 2D vector from the origin — two more quantities appear naturally:</p>`

+ `<div class="calc-formula"><div class="formula-label">MODULUS AND ARGUMENT</div><div class="formula-main">$$|z| = \\sqrt{a^2 + b^2}, \\qquad \\arg(z) = \\operatorname{atan2}(b, a)$$</div><div class="formula-sub">The modulus is the length of the vector. The argument is the angle from the positive real axis, measured counter-clockwise.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Modulus |z|</div><div class="card-body">The Euclidean distance from the origin to the point. Always non-negative. Also called the <em>magnitude</em> or <em>absolute value</em> of z.</div></div>`
+ `<div class="calc-card"><div class="card-title">Argument arg(z)</div><div class="card-body">The angle the vector makes with the positive real axis. Also called the <em>phase</em>. The function atan2 picks the correct quadrant — plain atan(b/a) loses information.</div></div>`
+ `<div class="calc-card"><div class="card-title">Polar form</div><div class="card-body">Any complex number can be written z = r(cos θ + i sin θ) with r = |z|, θ = arg(z). This is the gateway to Euler's formula.</div></div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Take z = 3 + 4i:</strong><br><br>|z| = √(3² + 4²) = √25 = <strong>5</strong><br>arg(z) = atan2(4, 3) ≈ 0.9273 rad ≈ <strong>53.13°</strong><br><br>In polar form: z = 5·(cos 53.13° + i sin 53.13°). Same number, different lens.</div></div>`

+ `<p class="l-text">The single most important geometric fact about complex multiplication is this:</p>`

+ `<div class="calc-formula"><div class="formula-label">MULTIPLICATION = ROTATION + SCALING</div><div class="formula-main">$$z_1 z_2 \\quad \\text{has modulus } |z_1||z_2| \\text{ and argument } \\arg(z_1) + \\arg(z_2)$$</div><div class="formula-sub">Lengths multiply, angles add. This is why complex numbers describe oscillation so naturally.</div></div>`

+ `<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Multiplying by <em>i</em> rotates a complex number 90° counter-clockwise without changing its length, because |i| = 1 and arg(i) = π/2. Multiplying by <em>i</em> four times returns the original (i⁴ = 1). The unit circle is hiding in plain sight.</div></div>`

/* ============================================================
   SECTION 2: Euler's Formula
   ============================================================ */
+ `<h2 class="l-title">2. Euler's Formula — Derived from Scratch</h2>`

+ `<div class="l-highlight"><strong>The single most important equation in signal processing:</strong> $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$. Most students see this written on a board and accept it as magic. We are going to <em>derive</em> it, slowly, from things you already trust.</div>`

+ `<p class="l-text">Recall three Taylor series you have met before — three infinite sums that <em>define</em> their respective functions for every real input:</p>`

+ `<div class="calc-formula"><div class="formula-label">TAYLOR SERIES — THE THREE BUILDING BLOCKS</div><div class="formula-main">$$e^{x} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\frac{x^5}{5!} + \\cdots$$</div><div class="formula-sub">The exponential function: every term contributes equally as we keep adding.</div></div>`

+ `<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots$$</div><div class="formula-sub">Only even powers, signs alternating + − + − ...</div></div>`

+ `<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\cdots$$</div><div class="formula-sub">Only odd powers, signs alternating + − + − ...</div></div>`

+ `<p class="l-text">These three series are the official definitions of the functions. They converge for every real number. Now comes the moment of insight: <strong>substitute</strong> x = iθ into the exponential series. We are bravely plugging an imaginary number into a formula derived for real ones — but Taylor series are just polynomials, and polynomials accept any input.</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Start with the e<sup>x</sup> series and substitute x = iθ</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta + \\frac{(i\\theta)^2}{2!} + \\frac{(i\\theta)^3}{3!} + \\frac{(i\\theta)^4}{4!} + \\frac{(i\\theta)^5}{5!} + \\cdots$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Simplify the powers of i</div><div class="step-detail">i¹ = i, i² = −1, i³ = −i, i⁴ = 1, i⁵ = i, i⁶ = −1, ... The cycle of length 4 is the key.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Apply the cycle term by term</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + i\\frac{\\theta^5}{5!} - \\frac{\\theta^6}{6!} - i\\frac{\\theta^7}{7!} + \\cdots$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Group the real terms and the imaginary terms</div><div class="step-detail">$$e^{i\\theta} = \\underbrace{\\Bigl(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\frac{\\theta^6}{6!} + \\cdots\\Bigr)}_{=\\,\\cos\\theta} + i\\underbrace{\\Bigl(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\frac{\\theta^7}{7!} + \\cdots\\Bigr)}_{=\\,\\sin\\theta}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Recognise the cosine and sine series exactly</div><div class="step-detail">The real-part series is the Taylor series of cos θ. The imaginary-part series is the Taylor series of sin θ. They line up perfectly term for term.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">EULER'S FORMULA</div><div class="formula-main">$$\\boxed{\\,e^{i\\theta} = \\cos\\theta + i\\sin\\theta\\,}$$</div><div class="formula-sub">This is not a trick or a definition imposed by decree — it is forced upon us by the Taylor series. Cosine and sine were hiding inside the exponential all along.</div></div>`

+ `<p class="l-text">Pause and feel what just happened. We started with three independent functions and discovered they are deeply entangled: the exponential, evaluated on the imaginary axis, <em>is</em> a combination of cosine and sine. Three of the most important functions in mathematics turn out to be three faces of one object.</p>`

+ `<div class="l-highlight"><strong>The most beautiful corollary:</strong> set θ = π in Euler's formula. We get $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1 + 0i = -1$. Rearranging: $\\boxed{e^{i\\pi} + 1 = 0}$. Five fundamental constants — 0, 1, π, e, i — bound together in a single equation. Many mathematicians call it the most beautiful identity ever written.</div>`

+ `<div class="l-note"><strong>Practical reading:</strong> Euler's formula lets us replace every "cos and sin" pair in a formula with a single exponential. Long trigonometric derivations collapse into a few lines of algebra. We are about to see exactly that happen to the Fourier series.</div>`

/* ============================================================
   SECTION 3: The Unit Circle Re-imagined
   ============================================================ */
+ `<h2 class="l-title">3. The Unit Circle Re-imagined</h2>`

+ `<div class="l-highlight"><strong>Geometric picture:</strong> When θ varies from 0 to 2π, the point $e^{i\\theta}$ traces out the unit circle in the complex plane, exactly once, counter-clockwise. Euler's formula is the parametric equation of the unit circle, hiding inside a single symbol.</div>`

+ `<p class="l-text">Now let θ depend on time: set θ = ωt where ω is a constant angular frequency (radians per second). The function $e^{i\\omega t}$ becomes a <strong>point that rotates around the unit circle at constant angular speed ω</strong>. Faster ω, faster rotation. Negative ω, reverse direction.</p>`

+ `<div class="calc-formula"><div class="formula-label">A ROTATING PHASOR</div><div class="formula-main">$$e^{i\\omega t} = \\cos(\\omega t) + i\\sin(\\omega t)$$</div><div class="formula-sub">A unit-length vector spinning at angular speed ω. Its real shadow on the horizontal axis is cos(ωt). Its imaginary shadow on the vertical axis is sin(ωt).</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Modulus is always 1</div><div class="card-body">|e<sup>iωt</sup>| = √(cos² + sin²) = 1 for every t. The phasor lives on the unit circle, never inside or outside.</div></div>`
+ `<div class="calc-card"><div class="card-title">Argument is ωt</div><div class="card-body">arg(e<sup>iωt</sup>) = ωt. The angle increases linearly with time. After T = 2π/ω seconds, the phasor has come back to its starting angle.</div></div>`
+ `<div class="calc-card"><div class="card-title">Real shadow = cos(ωt)</div><div class="card-body">Project the spinning point onto the real axis and you see exactly a cosine. The cosine you knew from trigonometry is the horizontal shadow of a rotating arrow.</div></div>`
+ `<div class="calc-card"><div class="card-title">Imag shadow = sin(ωt)</div><div class="card-body">Project the same point onto the imaginary axis and you see exactly a sine. Sines and cosines are not two separate functions — they are two views of the same rotation.</div></div>`
+ `</div>`

/* --- Plotly: unit circle + e^(iωt) trajectory + projections --- */
+ `<div id="plot-l3-circle-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var th=[];for(var i=0;i<=200;i++){th.push(i*2*Math.PI/200);}
var cx=th.map(function(t){return Math.cos(t);});
var cy=th.map(function(t){return Math.sin(t);});
var circle={x:cx,y:cy,mode:"lines",name:"Unit circle |z|=1",line:{color:"rgba(59,130,246,0.35)",width:1.5}};
var pts=[Math.PI/6,Math.PI/3,Math.PI/2,2*Math.PI/3,5*Math.PI/6,Math.PI,7*Math.PI/6,4*Math.PI/3,3*Math.PI/2,5*Math.PI/3,11*Math.PI/6];
var px=pts.map(function(t){return Math.cos(t);});var py=pts.map(function(t){return Math.sin(t);});
var snapshots={x:px,y:py,mode:"markers",name:"e^(iωt) at successive t",marker:{size:9,color:"#3b82f6",opacity:0.85}};
var p0={x:[Math.cos(Math.PI/3)],y:[Math.sin(Math.PI/3)],mode:"markers+text",name:"e^(iωt) (current)",marker:{size:14,color:"#f97316",symbol:"star"},text:["e^(iωt)"],textposition:"top right",textfont:{color:"#f97316",size:13}};
var arrow={x:[0,Math.cos(Math.PI/3)],y:[0,Math.sin(Math.PI/3)],mode:"lines",name:"radius vector",line:{color:"#f97316",width:2.5}};
var realDrop={x:[Math.cos(Math.PI/3),Math.cos(Math.PI/3)],y:[Math.sin(Math.PI/3),0],mode:"lines",name:"sin(ωt) (drop to real axis)",line:{color:"#10b981",width:2,dash:"dot"}};
var imagDrop={x:[Math.cos(Math.PI/3),0],y:[Math.sin(Math.PI/3),Math.sin(Math.PI/3)],mode:"lines",name:"cos(ωt) (drop to imag axis)",line:{color:"#a855f7",width:2,dash:"dot"}};
var realPt={x:[Math.cos(Math.PI/3)],y:[0],mode:"markers",name:"cos(ωt) shadow",marker:{size:10,color:"#10b981"}};
var imagPt={x:[0],y:[Math.sin(Math.PI/3)],mode:"markers",name:"sin(ωt) shadow",marker:{size:10,color:"#a855f7"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.5,1.7],title:"Real axis",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.5,1.5],title:"Imaginary axis"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:-0.18,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-circle-en",[circle,snapshots,realDrop,imagDrop,arrow,p0,realPt,imagPt],layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The faint blue ring is the unit circle. The small blue dots are snapshots of e<sup>iωt</sup> at successive moments — they trace the circle counter-clockwise. The orange star is the phasor at one chosen instant. The green dotted line drops to the real axis (the green dot is cos(ωt)). The purple dotted line projects to the imaginary axis (the purple dot is sin(ωt)). Cosine and sine are literally the horizontal and vertical shadows of the spinning arrow.</div></div>`

+ `<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If e<sup>iωt</sup> rotates counter-clockwise, what does e<sup>−iωt</sup> do? It rotates <em>clockwise</em> at the same speed — same circle, opposite direction. Hold this image: positive frequencies spin one way, negative frequencies spin the other. We will need it in section 5.</div></div>`

/* ============================================================
   SECTION 4: From Real Fourier Series to Complex
   ============================================================ */
+ `<h2 class="l-title">4. From Real Fourier Series to Complex</h2>`

+ `<p class="l-text">Recall the real-valued Fourier series from L2. Any reasonable periodic function f(t) with period T (fundamental frequency ω₀ = 2π/T) can be expanded as</p>`

+ `<div class="calc-formula"><div class="formula-label">REAL FOURIER SERIES</div><div class="formula-main">$$f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\bigl[\\,a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t)\\,\\bigr]$$</div><div class="formula-sub">Two coefficient families a<sub>n</sub> and b<sub>n</sub>, two integral formulas, two trig functions per term. Workable but bulky.</div></div>`

+ `<p class="l-text">Euler's formula lets us rewrite cosine and sine in terms of complex exponentials. Solve the two-equation system</p>`

+ `<div class="calc-formula"><div class="formula-label">EULER, REARRANGED</div><div class="formula-main">$$\\cos\\theta = \\frac{e^{i\\theta} + e^{-i\\theta}}{2}, \\qquad \\sin\\theta = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}$$</div><div class="formula-sub">Add e<sup>iθ</sup> and e<sup>−iθ</sup> to get 2cos. Subtract to get 2i·sin. These two identities will swallow the entire trig formulation.</div></div>`

+ `<p class="l-text">Substitute these into each term of the Fourier series:</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Replace each cos and sin with their exponential form</div><div class="step-detail">$$a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t) = a_n \\frac{e^{in\\omega_0 t} + e^{-in\\omega_0 t}}{2} + b_n \\frac{e^{in\\omega_0 t} - e^{-in\\omega_0 t}}{2i}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Use 1/i = −i to clean up the denominator</div><div class="step-detail">The b<sub>n</sub> term becomes $\\frac{b_n}{2i}(e^{in\\omega_0 t} - e^{-in\\omega_0 t}) = \\frac{-i\\,b_n}{2}(e^{in\\omega_0 t} - e^{-in\\omega_0 t})$.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Collect the coefficients of e<sup>+inω₀t</sup> and e<sup>−inω₀t</sup></div><div class="step-detail">$$= \\left(\\frac{a_n - i\\,b_n}{2}\\right)e^{in\\omega_0 t} + \\left(\\frac{a_n + i\\,b_n}{2}\\right)e^{-in\\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Define new complex coefficients</div><div class="step-detail">Let $c_n = \\tfrac{1}{2}(a_n - i b_n)$ for n ≥ 1 and $c_{-n} = \\tfrac{1}{2}(a_n + i b_n) = \\overline{c_n}$. Set $c_0 = a_0/2$.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Combine positive and negative indices into one sum</div><div class="step-detail">The DC term and every (n, −n) pair fold together into a single sum over all integers n from −∞ to +∞.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">COMPLEX FOURIER SERIES</div><div class="formula-main">$$\\boxed{\\;f(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\, e^{i n \\omega_0 t}\\;}$$</div><div class="formula-sub">One formula. One coefficient family c<sub>n</sub>. One function family e<sup>inω₀t</sup>. The bulk of the trig formulation has collapsed.</div></div>`

+ `<div class="calc-formula"><div class="formula-label">RELATING THE TWO FAMILIES</div><div class="formula-main">$$c_n = \\frac{a_n - i\\,b_n}{2}\\ (n>0), \\qquad c_{-n} = \\overline{c_n}, \\qquad c_0 = \\frac{a_0}{2}$$</div><div class="formula-sub">Going the other way: a<sub>n</sub> = 2·Re(c<sub>n</sub>), b<sub>n</sub> = −2·Im(c<sub>n</sub>). The two representations carry identical information.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">One sum instead of two</div><div class="card-body">No more separating cosine and sine contributions. A single c<sub>n</sub> packages both amplitude and phase of the n-th harmonic into one complex number.</div></div>`
+ `<div class="calc-card"><div class="card-title">One basis function</div><div class="card-body">Instead of cos(nω₀t) and sin(nω₀t) appearing as a pair, the single function e<sup>inω₀t</sup> handles both. Algebra becomes uniform.</div></div>`
+ `<div class="calc-card"><div class="card-title">Sum over all integers</div><div class="card-body">The index n now runs from −∞ to +∞. Negative indices are not new physics — they encode the second half of each (cos, sin) pair.</div></div>`
+ `</div>`

+ `<div class="l-note"><strong>Key reading:</strong> nothing has been added or removed from the Fourier series. We simply relabelled the same expansion in a coordinate system (complex exponentials) that respects the natural rotation symmetry. Same signal, same harmonics, lighter notation.</div>`

/* ============================================================
   SECTION 5: Negative Frequencies
   ============================================================ */
+ `<h2 class="l-title">5. Negative Frequencies — What Do They Mean?</h2>`

+ `<div class="l-highlight"><strong>The classic puzzle:</strong> a 60 Hz mains hum has a frequency of 60 Hz. What on earth is a frequency of <em>−60 Hz</em>? Did we run time backwards? Are we generating energy? No — negative frequencies are a mathematical consequence of using a rotation-based basis, and they always pair up beautifully with positive ones to give real signals.</div>`

+ `<p class="l-text">A real-valued signal — anything you can measure on an oscilloscope, microphone, or thermometer — produces coefficients that obey a strict symmetry:</p>`

+ `<div class="calc-formula"><div class="formula-label">CONJUGATE SYMMETRY FOR REAL SIGNALS</div><div class="formula-main">$$f(t) \\in \\mathbb{R} \\iff c_{-n} = \\overline{c_n} \\quad \\forall n$$</div><div class="formula-sub">If the signal is real-valued, the coefficient at frequency −n is the complex conjugate of the coefficient at +n. Magnitudes match; phases are opposite.</div></div>`

+ `<p class="l-text">Why does this symmetry rescue reality? Consider what happens when you sum a (+n, −n) pair:</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write the pair with c<sub>n</sub> = A·e<sup>iφ</sup> and c<sub>−n</sub> = A·e<sup>−iφ</sup></div><div class="step-detail">Both have modulus A. The phases are exactly opposite. This is what "conjugate" means in polar form.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sum the two complex exponentials</div><div class="step-detail">$$c_n e^{in\\omega_0 t} + c_{-n} e^{-in\\omega_0 t} = A e^{i\\phi} e^{in\\omega_0 t} + A e^{-i\\phi} e^{-in\\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Factor and apply Euler</div><div class="step-detail">$$= A \\bigl[ e^{i(n\\omega_0 t + \\phi)} + e^{-i(n\\omega_0 t + \\phi)} \\bigr] = 2A \\cos(n\\omega_0 t + \\phi)$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">A real-valued cosine emerges</div><div class="step-detail">The complex pieces conspire so that the imaginary parts cancel exactly. What remains is a single real sinusoid of amplitude 2A and phase φ.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">TWO COUNTER-ROTATING PHASORS = ONE REAL SINUSOID</div><div class="formula-main">$$A e^{i(\\omega t + \\phi)} + A e^{-i(\\omega t + \\phi)} = 2 A \\cos(\\omega t + \\phi)$$</div><div class="formula-sub">A pair of complex phasors spinning in opposite directions at the same speed, with mirror-image phase, adds up to a real cosine. This is the geometric meaning of "negative frequency."</div></div>`

/* --- Plotly: counter-rotating phasors summing to real cosine --- */
+ `<div id="plot-l3-counter-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var T=[];for(var i=0;i<=400;i++){T.push(i*4*Math.PI/400);}
var posRe=T.map(function(t){return Math.cos(t);});
var posIm=T.map(function(t){return Math.sin(t);});
var negRe=T.map(function(t){return Math.cos(-t);});
var negIm=T.map(function(t){return Math.sin(-t);});
var sumRe=T.map(function(t){return 2*Math.cos(t);});
var pos={x:T,y:posRe,mode:"lines",name:"Re[e^(+iωt)] = cos(ωt)",line:{color:"#3b82f6",width:2}};
var neg={x:T,y:negRe,mode:"lines",name:"Re[e^(−iωt)] = cos(ωt)",line:{color:"#f97316",width:2,dash:"dot"}};
var posI={x:T,y:posIm,mode:"lines",name:"Im[e^(+iωt)] = +sin(ωt)",line:{color:"#3b82f6",width:1.2,dash:"dash"},visible:"legendonly"};
var negI={x:T,y:negIm,mode:"lines",name:"Im[e^(−iωt)] = −sin(ωt)",line:{color:"#f97316",width:1.2,dash:"dash"},visible:"legendonly"};
var sum={x:T,y:sumRe,mode:"lines",name:"Sum = 2 cos(ωt)",line:{color:"#10b981",width:3}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-2.4,2.4],title:"value"},margin:{t:60,r:30,b:50,l:50},showlegend:true,legend:{orientation:"h",y:-0.18,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-counter-en",[pos,neg,sum],layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Blue is the real part of the +ω phasor, orange is the real part of the −ω phasor — they look identical because cos is an even function. The hidden imaginary parts (toggle the dashed traces in the legend) are exact mirrors (+sin and −sin) and cancel perfectly. The green curve is their sum, a pure real cosine of double amplitude. Negative frequencies are not exotic — they are the silent partner that makes the imaginary parts cancel.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Real signals = balanced spectra</div><div class="card-body">For every coefficient at frequency +n there is a matching conjugate at −n. The magnitude spectrum |c<sub>n</sub>| is mirror-symmetric about n = 0. The phase spectrum arg(c<sub>n</sub>) is anti-symmetric.</div></div>`
+ `<div class="calc-card"><div class="card-title">Complex signals = unbalanced</div><div class="card-body">In communications (analytic signals, IQ modulation), we deliberately use signals with non-symmetric spectra — they carry twice the information per Hz of bandwidth. Negative frequencies become physically distinct.</div></div>`
+ `<div class="calc-card"><div class="card-title">Total power is unchanged</div><div class="card-body">By Parseval's theorem, the total energy is Σ |c<sub>n</sub>|². For real signals this sum is exactly twice what the one-sided (positive-only) spectrum suggests — exactly because positive and negative frequencies each carry half.</div></div>`
+ `</div>`

+ `<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">An engineer plotting a spectrum analyser sees only positive frequencies. The instrument has implicitly added the (+n, −n) magnitudes together — that is why the on-screen amplitude matches the original sinusoid's amplitude, not double it. The negative half lives, but the display folds it into the positive half automatically.</div></div>`

/* ============================================================
   SECTION 6: Computing c_n directly
   ============================================================ */
+ `<h2 class="l-title">6. Computing c<sub>n</sub> Directly</h2>`

+ `<p class="l-text">The complex Fourier series would be incomplete without a direct way to compute c<sub>n</sub> from f(t). Just as a<sub>n</sub> and b<sub>n</sub> came from projecting f against cosines and sines, c<sub>n</sub> comes from projecting f against e<sup>inω₀t</sup>. The projection uses the fundamental <strong>orthogonality of the complex exponentials</strong>:</p>`

+ `<div class="calc-formula"><div class="formula-label">ORTHOGONALITY</div><div class="formula-main">$$\\frac{1}{T}\\int_0^T e^{i m \\omega_0 t}\\,e^{-i n \\omega_0 t}\\,dt = \\delta_{mn} = \\begin{cases} 1 & m = n \\\\ 0 & m \\neq n \\end{cases}$$</div><div class="formula-sub">The exponentials form an orthonormal basis on [0, T]. Projection picks out exactly one coefficient — δ<sub>mn</sub> is the Kronecker delta.</div></div>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Start from the complex series</div><div class="step-detail">$$f(t) = \\sum_{m=-\\infty}^{\\infty} c_m e^{i m \\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Multiply both sides by e<sup>−inω₀t</sup></div><div class="step-detail">$$f(t) e^{-i n \\omega_0 t} = \\sum_{m=-\\infty}^{\\infty} c_m e^{i (m-n) \\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Integrate both sides over one full period</div><div class="step-detail">$$\\int_0^T f(t) e^{-i n \\omega_0 t}\\,dt = \\sum_{m=-\\infty}^{\\infty} c_m \\int_0^T e^{i(m-n)\\omega_0 t}\\,dt$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Apply orthogonality — every term vanishes except m = n</div><div class="step-detail">The integral on the right is T·δ<sub>mn</sub>. The sum collapses to one survivor: c<sub>n</sub>·T.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Solve for c<sub>n</sub></div><div class="step-detail">Divide by T.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">ANALYSIS FORMULA</div><div class="formula-main">$$\\boxed{\\;c_n = \\frac{1}{T}\\int_0^T f(t)\\,e^{-i n \\omega_0 t}\\,dt\\;}$$</div><div class="formula-sub">A single integral. A single complex number. Both amplitude and phase, packaged together. Notice the negative sign in the exponent — that is the "projection onto the e<sup>inω₀t</sup> basis." It is not a typo.</div></div>`

+ `<div class="l-note"><strong>Why the minus sign?</strong> To project onto the basis function e<sup>inω₀t</sup>, we take its complex conjugate (since the inner product on complex functions is &lt;f, g&gt; = ∫f·ḡ). The conjugate of e<sup>inω₀t</sup> is e<sup>−inω₀t</sup>. This minus sign survives all the way into the modern Fourier transform.</div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Magnitude |c<sub>n</sub>|</div><div class="card-body">Tells you how much of frequency nω₀ is present in f. The plot of |c<sub>n</sub>| vs n is the <strong>magnitude spectrum</strong> — the signal's "fingerprint."</div></div>`
+ `<div class="calc-card"><div class="card-title">Phase arg(c<sub>n</sub>)</div><div class="card-body">Tells you the time-shift of that frequency component. Shifting f(t) in time multiplies every c<sub>n</sub> by a pure phase. Magnitude does not change; phase rotates.</div></div>`
+ `<div class="calc-card"><div class="card-title">DC term c<sub>0</sub></div><div class="card-body">$c_0 = \\tfrac{1}{T}\\int_0^T f(t)\\,dt$ — the average value of the signal. The "zero-frequency" component. Always real for real signals.</div></div>`
+ `</div>`

/* ============================================================
   SECTION 7: Why this form is superior
   ============================================================ */
+ `<h2 class="l-title">7. Why This Form Is Superior</h2>`

+ `<p class="l-text">The complex form is not just cosmetically nicer. It has structural properties that make it the unavoidable choice for working analysis and computation.</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">One coefficient family, one basis</div><div class="card-body">Replace two integrals (for a<sub>n</sub> and b<sub>n</sub>) with one (for c<sub>n</sub>). Replace cos+sin pairs with a single e<sup>inω₀t</sup>. Code becomes shorter, proofs become shorter, formulas become readable.</div></div>`
+ `<div class="calc-card"><div class="card-title">Time shift = phase rotation</div><div class="card-body">If g(t) = f(t − τ), then the n-th coefficient of g is c<sub>n</sub>·e<sup>−inω₀τ</sup>. A time delay simply rotates each complex coefficient by a frequency-proportional phase. Trying to express this in the (a<sub>n</sub>, b<sub>n</sub>) form requires multi-line algebra.</div></div>`
+ `<div class="calc-card"><div class="card-title">Differentiation = multiplication by inω</div><div class="card-body">$\\frac{d}{dt}\\bigl[e^{i n \\omega_0 t}\\bigr] = i n \\omega_0 \\cdot e^{i n \\omega_0 t}$. Derivatives become algebraic. This is the eigenvalue property that turns linear differential equations into polynomial equations.</div></div>`
+ `<div class="calc-card"><div class="card-title">Convolution becomes multiplication</div><div class="card-body">The Fourier coefficients of (f * g) are the products c<sub>n</sub>(f)·c<sub>n</sub>(g). Without the complex form, this elegant identity is buried under sum-of-products trig identities.</div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">EIGENVALUE PROPERTY OF d/dt</div><div class="formula-main">$$\\frac{d}{dt}\\bigl[e^{i n \\omega_0 t}\\bigr] = (i n \\omega_0)\\,e^{i n \\omega_0 t}$$</div><div class="formula-sub">Complex exponentials are <em>eigenfunctions</em> of the differentiation operator. The eigenvalue is inω₀. This single property is the reason every linear time-invariant system is "diagonalised" by the Fourier transform.</div></div>`

+ `<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">When a physicist solves a linear ODE with constant coefficients, they "try" a solution of the form e<sup>iωt</sup>. The ODE becomes a polynomial equation in ω. The reason this works is the eigenvalue property above. The complex exponential is the eigenvector of the operator d/dt, exactly as e<sub>1</sub>, e<sub>2</sub>, e<sub>3</sub> are eigenvectors of a diagonal matrix.</div></div>`

+ `<div class="l-note"><strong>Engineering punchline:</strong> Every modern signal processing pipeline — FFT, digital filters, communications, image compression, audio coding — is written in the complex form. Learning to think directly in c<sub>n</sub> rather than (a<sub>n</sub>, b<sub>n</sub>) is the cultural threshold between "I have studied Fourier" and "I work with Fourier."</div>`

/* ============================================================
   SECTION 8: Example — square wave in complex form
   ============================================================ */
+ `<h2 class="l-title">8. Example: Square Wave in Complex Form</h2>`

+ `<p class="l-text">Let us recompute the coefficients of the square wave from L2, this time using c<sub>n</sub>, and verify that the two representations agree.</p>`

+ `<p class="l-text">Consider the odd square wave with period T = 2π (so ω₀ = 1):</p>`

+ `<div class="calc-formula"><div class="formula-label">SQUARE WAVE</div><div class="formula-main">$$f(t) = \\begin{cases} +1, & 0 < t < \\pi \\\\ -1, & \\pi < t < 2\\pi \\end{cases}$$</div><div class="formula-sub">Average value zero, odd about t = π. We want every c<sub>n</sub>.</div></div>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Plug into the analysis formula</div><div class="step-detail">$$c_n = \\frac{1}{2\\pi}\\int_0^{2\\pi} f(t)\\,e^{-i n t}\\,dt = \\frac{1}{2\\pi}\\left[\\int_0^{\\pi} e^{-i n t}\\,dt - \\int_{\\pi}^{2\\pi} e^{-i n t}\\,dt\\right]$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Antiderivative of e<sup>−int</sup> is (e<sup>−int</sup>) / (−in) for n ≠ 0</div><div class="step-detail">$$c_n = \\frac{1}{2\\pi}\\cdot\\frac{1}{-in}\\Bigl[(e^{-i n \\pi} - 1) - (e^{-i n \\cdot 2\\pi} - e^{-i n \\pi})\\Bigr]$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Use e<sup>−in·2π</sup> = 1 (any integer n)</div><div class="step-detail">$$= \\frac{1}{2\\pi}\\cdot\\frac{1}{-in}\\bigl[2 e^{-i n \\pi} - 2\\bigr] = \\frac{e^{-i n \\pi} - 1}{-i n \\pi}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Use e<sup>−inπ</sup> = (−1)<sup>n</sup></div><div class="step-detail">$$c_n = \\frac{(-1)^n - 1}{-i n \\pi}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Final result, splitting by parity of n</div><div class="step-detail">For even n ≠ 0 the numerator is 0, so c<sub>n</sub> = 0. For odd n, (−1)<sup>n</sup> − 1 = −2, so $c_n = \\frac{-2}{-i n \\pi} = \\frac{2}{i n \\pi} = \\frac{-2i}{n \\pi}$. And c<sub>0</sub> = 0 (zero average).</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">SQUARE WAVE — COMPLEX COEFFICIENTS</div><div class="formula-main">$$c_n = \\begin{cases} \\dfrac{-2 i}{n \\pi}, & n \\text{ odd} \\\\[4pt] 0, & n \\text{ even (including } n = 0)\\end{cases}$$</div><div class="formula-sub">Purely imaginary — consistent with the signal being odd. Magnitude |c<sub>n</sub>| = 2/(|n|π) for odd n, falling off as 1/n.</div></div>`

+ `<p class="l-text"><strong>Consistency check.</strong> From L2 the real coefficients are a<sub>n</sub> = 0, b<sub>n</sub> = 4/(nπ) for odd n. Applying $c_n = \\tfrac{1}{2}(a_n - i b_n) = \\tfrac{1}{2}\\bigl(0 - i \\cdot 4/(n\\pi)\\bigr) = -2i/(n\\pi)$. Agreement, as promised.</p>`

/* --- Plotly: square wave |c_n| stem plot --- */
+ `<div id="plot-l3-sqstem-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var ns=[];var mags=[];for(var n=-15;n<=15;n++){ns.push(n);if(n===0||n%2===0){mags.push(0);}else{mags.push(2/(Math.abs(n)*Math.PI));}}
var stems=[];for(var i=0;i<ns.length;i++){stems.push({x:[ns[i],ns[i]],y:[0,mags[i]],mode:"lines",line:{color:"#3b82f6",width:2.5},showlegend:false,hoverinfo:"skip"});}
var heads={x:ns,y:mags,mode:"markers",name:"|c_n| of square wave",marker:{size:9,color:"#3b82f6"}};
var data=stems.concat([heads]);
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"harmonic index n",dtick:2,range:[-16,16]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"|c_n|",range:[0,0.75]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:-0.18,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-sqstem-en",data,layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Magnitude of the complex Fourier coefficients of the square wave for n = −15 to +15. Only odd harmonics survive, and their magnitudes decay as 2/(|n|π). The plot is mirror-symmetric about n = 0 — exactly the conjugate symmetry of a real signal. Compare with the b<sub>n</sub> stem plot from L2: each spike here is half the height of the corresponding b<sub>n</sub> because the energy is now split between +n and −n.</div></div>`

/* ============================================================
   SECTION 9: Practical Pyodide Exercise
   ============================================================ */
+ `<h2 class="l-title">9. Practical Exercise: Computing c<sub>n</sub> Numerically</h2>`

+ `<p class="l-text">Time to compute Fourier coefficients with code rather than pencil-and-paper. We will set up an arbitrary periodic signal, integrate to find c<sub>n</sub> for many n, and plot both the magnitude spectrum and the phase spectrum.</p>`

+ `<div class="code-wrap"><div class="code-label"><span>PYTHON · NUMERICAL FOURIER COEFFICIENTS</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># A custom periodic signal: half-cosine pulse with phase offset.</span>
<span class="cm"># period T = 2*pi, fundamental omega0 = 1.</span>
T = <span class="num">2</span> * np.pi
omega0 = <span class="num">2</span> * np.pi / T
N_pts = <span class="num">4096</span>                       <span class="cm"># dense grid for integration</span>
t = np.linspace(<span class="num">0</span>, T, N_pts, endpoint=<span class="kw">False</span>)
dt = t[<span class="num">1</span>] - t[<span class="num">0</span>]

<span class="cm"># Signal: sum of a few cosines + a phase-shifted tone</span>
f = <span class="num">1.0</span>*np.cos(<span class="num">1</span>*t) + <span class="num">0.5</span>*np.cos(<span class="num">3</span>*t + np.pi/<span class="num">4</span>) + <span class="num">0.25</span>*np.cos(<span class="num">5</span>*t - np.pi/<span class="num">3</span>)

<span class="kw">def</span> <span class="fn">cn</span>(n):
    <span class="cm">"""Numerical integration of c_n = (1/T) int_0^T f(t) e^{-i n omega0 t} dt."""</span>
    integrand = f * np.exp(-<span class="num">1j</span> * n * omega0 * t)
    <span class="kw">return</span> np.sum(integrand) * dt / T

ns = np.arange(-<span class="num">10</span>, <span class="num">11</span>)
coeffs = np.array([<span class="fn">cn</span>(n) <span class="kw">for</span> n <span class="kw">in</span> ns])

<span class="fn">print</span>(<span class="str">"n   |    Re(c_n)    Im(c_n)   |c_n|     arg(c_n) [rad]"</span>)
<span class="kw">for</span> n, c <span class="kw">in</span> <span class="fn">zip</span>(ns, coeffs):
    <span class="fn">print</span>(<span class="str">f"{n:+3d} | {c.real:+8.4f}  {c.imag:+8.4f}  {abs(c):6.4f}  {np.angle(c):+7.4f}"</span>)

<span class="cm"># Sanity check: for the first cosine at n=1 we expect c_1 = c_{-1} = 0.5 (real)</span>
<span class="cm"># For the third harmonic with phase pi/4: |c_3| = 0.25, arg = pi/4 (and conjugate at n=-3)</span>
<span class="cm"># For the fifth harmonic with phase -pi/3: |c_5| = 0.125, arg = -pi/3</span>
</code></pre></div>`

+ `<p class="l-text">Once you have the array of coefficients, plotting the spectra is straightforward:</p>`

+ `<div class="code-wrap"><div class="code-label"><span>PYTHON · MAGNITUDE & PHASE SPECTRUM</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

mag = np.abs(coeffs)
phase = np.angle(coeffs)
<span class="cm"># Zero out the phase where magnitude is essentially zero to avoid noise.</span>
phase[mag &lt; <span class="num">1e-6</span>] = <span class="num">0</span>

fig, (ax1, ax2) = plt.subplots(<span class="num">2</span>, <span class="num">1</span>, figsize=(<span class="num">9</span>, <span class="num">5</span>), sharex=<span class="kw">True</span>)
ax1.stem(ns, mag, basefmt=<span class="str">" "</span>)
ax1.set_ylabel(<span class="str">"|c_n|"</span>); ax1.set_title(<span class="str">"Magnitude spectrum"</span>); ax1.grid(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

ax2.stem(ns, phase, basefmt=<span class="str">" "</span>, linefmt=<span class="str">"C1-"</span>, markerfmt=<span class="str">"C1o"</span>)
ax2.set_ylabel(<span class="str">"arg(c_n) [rad]"</span>); ax2.set_xlabel(<span class="str">"harmonic index n"</span>)
ax2.set_title(<span class="str">"Phase spectrum"</span>); ax2.grid(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
ax2.axhline(<span class="num">0</span>, color=<span class="str">"k"</span>, lw=<span class="num">0.5</span>)
plt.tight_layout(); plt.show()
</code></pre></div>`

/* --- Plotly: magnitude + phase spectrum of the test signal --- */
+ `<div id="plot-l3-spec-en" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var ns=[];var mag=[];var ph=[];
for(var n=-10;n<=10;n++){
ns.push(n);
var an=Math.abs(n);
if(an===1){mag.push(0.5);ph.push(n>0?0:0);}
else if(an===3){mag.push(0.25);ph.push(n>0?Math.PI/4:-Math.PI/4);}
else if(an===5){mag.push(0.125);ph.push(n>0?-Math.PI/3:Math.PI/3);}
else{mag.push(0);ph.push(0);}
}
var stems1=[];for(var i=0;i<ns.length;i++){stems1.push({x:[ns[i],ns[i]],y:[0,mag[i]],mode:"lines",line:{color:"#3b82f6",width:2.5},showlegend:false,hoverinfo:"skip",xaxis:"x",yaxis:"y"});}
var heads1={x:ns,y:mag,mode:"markers",name:"|c_n|",marker:{size:8,color:"#3b82f6"},xaxis:"x",yaxis:"y"};
var stems2=[];for(var i=0;i<ns.length;i++){if(mag[i]>1e-9){stems2.push({x:[ns[i],ns[i]],y:[0,ph[i]],mode:"lines",line:{color:"#f97316",width:2.5},showlegend:false,hoverinfo:"skip",xaxis:"x2",yaxis:"y2"});}}
var phShow=ph.map(function(v,i){return mag[i]>1e-9?v:null;});
var heads2={x:ns,y:phShow,mode:"markers",name:"arg(c_n)",marker:{size:8,color:"#f97316"},xaxis:"x2",yaxis:"y2"};
var data=stems1.concat([heads1]).concat(stems2).concat([heads2]);
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},grid:{rows:2,columns:1,pattern:"independent"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",dtick:2,range:[-11,11]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"|c_n|",range:[0,0.6]},xaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"harmonic index n",dtick:2,range:[-11,11]},yaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"arg(c_n) [rad]",range:[-1.3,1.3]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:-0.13,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-spec-en",data,layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Top: the magnitude spectrum |c<sub>n</sub>| of the test signal 1·cos(t) + 0.5·cos(3t + π/4) + 0.25·cos(5t − π/3). Three pairs of spikes appear at n = ±1, ±3, ±5 with heights 0.5, 0.25, 0.125 — exactly half of each cosine's amplitude, the rest hiding on the negative side. Bottom: the phase spectrum arg(c<sub>n</sub>). The phases of positive-n components match the cosine phase shifts; negative-n phases are the mirror image, exactly the conjugate symmetry of a real signal.</div></div>`

+ `<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">A real cosine of amplitude A and phase φ produces c<sub>n</sub> = (A/2)·e<sup>iφ</sup> and c<sub>−n</sub> = (A/2)·e<sup>−iφ</sup>. The amplitude on the spectrum is half, not the full A — because the other half lives at the mirror frequency. When engineers say "a 1 Vrms tone is 0 dB on the spectrum analyser," the instrument has already folded the negative half on top of the positive half for them.</div></div>`

+ `<div class="l-warn"><strong>Next lesson:</strong> in L4 we will let the period T grow to infinity. The discrete index n becomes a continuous frequency variable ω, the sum becomes an integral, and the complex Fourier series turns into the <strong>continuous Fourier transform</strong>. Everything you have learned here will scale up unchanged — the e<sup>−iωt</sup> projection survives, the conjugate symmetry survives, the eigenvalue property survives.</div>`

/* ============================================================
   SUMMARY
   ============================================================ */
+ `<h2 class="l-title">10. Summary</h2>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Complex number</div><div class="card-body">A point in the plane with a real part, an imaginary part, a length |z|, and an angle arg(z). Multiplication adds angles.</div><div class="card-formula">z = a + bi</div></div>`
+ `<div class="calc-card"><div class="card-title">Euler's formula</div><div class="card-body">Derived from Taylor series: the exponential evaluated on the imaginary axis is cos + i·sin.</div><div class="card-formula">e^(iθ) = cosθ + i·sinθ</div></div>`
+ `<div class="calc-card"><div class="card-title">Phasor</div><div class="card-body">e^(iωt) is a unit-length vector rotating at angular speed ω. Its real shadow is cosine, its imaginary shadow is sine.</div><div class="card-formula">|e^(iωt)| = 1</div></div>`
+ `<div class="calc-card"><div class="card-title">Complex Fourier series</div><div class="card-body">A single sum over all integer indices replaces the (a<sub>n</sub>, b<sub>n</sub>) pair. Coefficients c<sub>n</sub> are complex.</div><div class="card-formula">f(t) = Σ c<sub>n</sub> e^(inω₀t)</div></div>`
+ `<div class="calc-card"><div class="card-title">Conjugate symmetry</div><div class="card-body">For a real signal, c<sub>−n</sub> = conj(c<sub>n</sub>). Positive and negative frequencies pair up so the imaginary parts cancel.</div><div class="card-formula">c<sub>-n</sub> = conj(c<sub>n</sub>)</div></div>`
+ `<div class="calc-card"><div class="card-title">Analysis formula</div><div class="card-body">Each c<sub>n</sub> is obtained by projecting f against the basis function e^(inω₀t) with conjugation (hence the minus sign).</div><div class="card-formula">c<sub>n</sub> = (1/T)∫f(t)e^(-inω₀t)dt</div></div>`
+ `<div class="calc-card"><div class="card-title">Eigenfunction of d/dt</div><div class="card-body">Differentiation multiplies e^(inωt) by the eigenvalue inω. Linear differential equations become algebraic.</div><div class="card-formula">d/dt[e^(iωt)] = iω·e^(iωt)</div></div>`
+ `<div class="calc-card"><div class="card-title">Magnitude and phase</div><div class="card-body">|c<sub>n</sub>| measures how much of frequency nω₀ is present. arg(c<sub>n</sub>) measures its time-shift.</div><div class="card-formula">|c<sub>n</sub>|, arg(c<sub>n</sub>)</div></div>`
+ `</div>`

+ `<div class="l-note"><strong>Cultural shift:</strong> the rest of the course — Fourier transform, DFT, FFT, Laplace, Z-transform — will be written almost exclusively in the complex form. If a section in L4 onwards feels opaque, return here and rebuild the picture: a rotating phasor, two of them counter-rotating, and an integral that picks out one of them.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu ders bir köprüdür.</strong> Bir yanda: iki katsayı ailesi (<span class="kw">a<sub>n</sub></span> ve <span class="kw">b<sub>n</sub></span>), iki trigonometrik fonksiyon ve "sinüsler ile kosinüsler bir şekilde sinyalleri kodluyor" şeklinde bulanık bir his içeren reel değerli Fourier serisi. Öbür yanda: her modern ders kitabı, her sinyal işleme kütüphanesi, her DSP makalesi Fourier dönüşümünü tek ve sıkı bir ifade ile yazıyor — <span class="kw">e<sup>iωt</sup></span> üzerinden. Oradan buraya nasıl gelinir?</p>`

+ `<p class="l-text">Cevap <strong>Euler formülü</strong>. Matematikteki en şaşırtıcı denklem ve sinyal işlemenin en önemli özdeşliği. Onu içselleştirdiğinizde, Fourier serisinin karmaşık üstel formu sadece kullanışlı bir gösterim değil — salınımın kendi doğal dili haline gelir.</p>`

+ `<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">`
+ `<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>`
+ `<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">`
+ `<li>Karmaşık sayıları düzlemde modül ve faz ile bir nokta olarak geometrik okumayı</li>`
+ `<li>Euler formülünü e<sup>x</sup>, cos(x), sin(x) Taylor serilerinden türetmeyi</li>`
+ `<li>e<sup>iωt</sup>'yi birim çember etrafında sabit hızlı bir dönme olarak görselleştirmeyi</li>`
+ `<li>Reel Fourier serisini kompakt Σ c<sub>n</sub>·e<sup>inω₀t</sup> formuna dönüştürmeyi</li>`
+ `<li>Negatif frekansları, gerçel sinyal oluşturan zıt yönde dönen faz vektörleri olarak yorumlamayı</li>`
+ `<li>c<sub>n</sub>'yi tek bir izdüşüm integraliyle hesaplamayı ve modül-faz olarak okumayı</li>`
+ `</ul>`
+ `</div>`

/* ============================================================
   BÖLÜM 1: Karmaşık Sayılar Hızlı Tekrar
   ============================================================ */
+ `<h2 class="l-title">1. Hızlı Tekrar: Karmaşık Sayılar</h2>`

+ `<div class="l-highlight"><strong>Bir itiraf:</strong> Pek çok mühendislik öğrencisinin karmaşık sayılarla ilişkisi çalışıyor ama rahatsız edici. Sıfırdan başlayacağız — lisedeki bilgi varsayılmıyor — çünkü bu dersteki her kavram bu temele dayanıyor.</div>`

+ `<p class="l-text">Bir <strong>karmaşık sayı</strong>, sıralı bir reel sayı çiftidir ve şöyle yazılır:</p>`

+ `<div class="calc-formula"><div class="formula-label">DİKDÖRTGEN FORM</div><div class="formula-main">$$z = a + b\\,i, \\qquad a, b \\in \\mathbb{R}, \\qquad i^2 = -1$$</div><div class="formula-sub">Burada <em>a</em> reel kısım, <em>b</em> sanal kısım, <em>i</em> ise i² = −1 koşulunu sağlayan birim.</div></div>`

+ `<p class="l-text"><em>i</em> sembolünde gizemli hiçbir şey yok. İki boyutlu bir sayının "ikinci koordinatını" işaretlemek için kullandığımız bir etiket. i² = −1 kuralı cebri ilginç kılan şeydir — ve sonunda bize dönmeyi armağan eden.</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Reel kısım Re(z)</div><div class="card-body">z = a + bi içindeki <em>a</em>. Yatay eksende çizilir. Reel sayılar hakkında bildiğiniz her şey burada da geçerli.</div></div>`
+ `<div class="calc-card"><div class="card-title">Sanal kısım Im(z)</div><div class="card-body">z = a + bi içindeki <em>b</em>. Düşey eksende çizilir. Adına rağmen <em>b</em> tamamen sıradan bir reel sayıdır — "sanal" sözcüğü tarihsel bir kazadır.</div></div>`
+ `<div class="calc-card"><div class="card-title">Karmaşık eşlenik</div><div class="card-body">z̄ = a − bi olarak yazılır. z'yi reel eksen etrafında yansıtır. Gerçel sinyaller ve negatif frekanslar konusunda sürekli karşımıza çıkacak.</div></div>`
+ `</div>`

+ `<p class="l-text">Geometrik olarak her karmaşık sayı <em>z</em>, 2B bir düzlemde (<strong>karmaşık düzlem</strong> ya da <strong>Argand diyagramı</strong>) tek bir noktadır. Yatay eksen reel kısmı, düşey eksen sanal kısmı taşır. <em>z</em>'yi bir nokta — eşdeğer olarak, başlangıçtan çıkan bir 2B vektör — olarak gördüğünüzde iki büyüklük doğal biçimde belirir:</p>`

+ `<div class="calc-formula"><div class="formula-label">MODÜL VE ARGÜMAN</div><div class="formula-main">$$|z| = \\sqrt{a^2 + b^2}, \\qquad \\arg(z) = \\operatorname{atan2}(b, a)$$</div><div class="formula-sub">Modül, vektörün boyu. Argüman ise pozitif reel eksenden saat yönünün tersine ölçülen açı.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Modül |z|</div><div class="card-body">Başlangıçtan noktaya olan Öklit uzaklığı. Daima negatif değildir. <em>Büyüklük</em> ya da <em>mutlak değer</em> de denir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Argüman arg(z)</div><div class="card-body">Vektörün pozitif reel eksenle yaptığı açı. <em>Faz</em> olarak da bilinir. atan2 fonksiyonu doğru bölgeyi seçer — düz atan(b/a) bilgi kaybettirir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Kutupsal form</div><div class="card-body">Her karmaşık sayı z = r(cos θ + i sin θ) olarak yazılabilir; r = |z|, θ = arg(z). Bu, Euler formülünün eşiğidir.</div></div>`
+ `</div>`

+ `<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>z = 3 + 4i alalım:</strong><br><br>|z| = √(3² + 4²) = √25 = <strong>5</strong><br>arg(z) = atan2(4, 3) ≈ 0.9273 rad ≈ <strong>53.13°</strong><br><br>Kutupsal formda: z = 5·(cos 53.13° + i sin 53.13°). Aynı sayı, farklı mercek.</div></div>`

+ `<p class="l-text">Karmaşık çarpmanın en önemli geometrik gerçeği şudur:</p>`

+ `<div class="calc-formula"><div class="formula-label">ÇARPMA = DÖNME + ÖLÇEKLEME</div><div class="formula-main">$$z_1 z_2 \\quad \\text{modülü } |z_1||z_2|, \\text{ argümanı } \\arg(z_1) + \\arg(z_2)$$</div><div class="formula-sub">Boylar çarpılır, açılar toplanır. Karmaşık sayıların salınımı bu kadar doğal anlatmasının nedeni budur.</div></div>`

+ `<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">i ile çarpmak, bir karmaşık sayıyı boyunu değiştirmeden 90° saat yönünün tersine döndürür — çünkü |i| = 1 ve arg(i) = π/2. i ile dört kez çarpma orijinale döndürür (i⁴ = 1). Birim çember göz önünde, ama gizleniyor.</div></div>`

/* ============================================================
   BÖLÜM 2: Euler Formülü
   ============================================================ */
+ `<h2 class="l-title">2. Euler Formülü — Sıfırdan Türetilmiş</h2>`

+ `<div class="l-highlight"><strong>Sinyal işlemenin tek en önemli denklemi:</strong> $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$. Çoğu öğrenci bunu tahtada görür ve büyü gibi kabul eder. Biz <em>türeteceğiz</em>; yavaşça, zaten güvendiğiniz şeylerden başlayarak.</div>`

+ `<p class="l-text">Daha önce karşılaşmış olduğunuz üç Taylor serisini hatırlayın — her reel girdi için karşılığı olan fonksiyonu <em>tanımlayan</em> üç sonsuz toplam:</p>`

+ `<div class="calc-formula"><div class="formula-label">TAYLOR SERİLERİ — ÜÇ YAPI TAŞI</div><div class="formula-main">$$e^{x} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\frac{x^5}{5!} + \\cdots$$</div><div class="formula-sub">Üstel fonksiyon: her terim eşit ağırlıkla katkı sağlar.</div></div>`

+ `<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots$$</div><div class="formula-sub">Sadece çift kuvvetler, işaretler + − + − ... şeklinde sırayla.</div></div>`

+ `<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\cdots$$</div><div class="formula-sub">Sadece tek kuvvetler, işaretler + − + − ... şeklinde sırayla.</div></div>`

+ `<p class="l-text">Bu üç seri fonksiyonların resmi tanımlarıdır. Her reel sayı için yakınsarlar. Şimdi içgörü anı: üstel seriye x = iθ <strong>yerleştir</strong>. Reel sayılar için türetilmiş bir formüle cesurca sanal bir sayı koyuyoruz — ama Taylor serileri yalnızca polinomdur ve polinomlar her girdiyi kabul eder.</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">e<sup>x</sup> serisinden başla ve x = iθ koy</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta + \\frac{(i\\theta)^2}{2!} + \\frac{(i\\theta)^3}{3!} + \\frac{(i\\theta)^4}{4!} + \\frac{(i\\theta)^5}{5!} + \\cdots$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">i'nin kuvvetlerini sadeleştir</div><div class="step-detail">i¹ = i, i² = −1, i³ = −i, i⁴ = 1, i⁵ = i, i⁶ = −1, ... Dört uzunluğundaki bu döngü anahtar.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Döngüyü terim terim uygula</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + i\\frac{\\theta^5}{5!} - \\frac{\\theta^6}{6!} - i\\frac{\\theta^7}{7!} + \\cdots$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Reel terimleri ve sanal terimleri grupla</div><div class="step-detail">$$e^{i\\theta} = \\underbrace{\\Bigl(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\frac{\\theta^6}{6!} + \\cdots\\Bigr)}_{=\\,\\cos\\theta} + i\\underbrace{\\Bigl(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\frac{\\theta^7}{7!} + \\cdots\\Bigr)}_{=\\,\\sin\\theta}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Kosinüs ve sinüs serilerini tam olarak tanı</div><div class="step-detail">Reel kısmın serisi cos θ'nin Taylor serisidir. Sanal kısmın serisi sin θ'nin Taylor serisidir. Terim terim birebir örtüşürler.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">EULER FORMÜLÜ</div><div class="formula-main">$$\\boxed{\\,e^{i\\theta} = \\cos\\theta + i\\sin\\theta\\,}$$</div><div class="formula-sub">Bu bir hile ya da emirle dayatılan bir tanım değil — Taylor serileri tarafından bize zorla kabul ettirilen bir gerçek. Kosinüs ve sinüs hep üstelin içinde gizliymiş.</div></div>`

+ `<p class="l-text">Bir an durun ve az önce olanı hissedin. Üç bağımsız fonksiyonla başladık ve onların derin biçimde iç içe geçtiğini keşfettik: üstel fonksiyon, sanal eksende değerlendirildiğinde, kosinüs ve sinüsün bir bileşimi <em>haline geliyor</em>. Matematiğin en önemli üç fonksiyonu tek bir nesnenin üç yüzü oluyor.</p>`

+ `<div class="l-highlight"><strong>En güzel sonuç:</strong> Euler formülünde θ = π koyalım. $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1 + 0i = -1$ elde ederiz. Düzenleyince: $\\boxed{e^{i\\pi} + 1 = 0}$. Beş temel sabit — 0, 1, π, e, i — tek bir denklemde birleşmiş. Birçok matematikçi bunu yazılmış en güzel özdeşlik olarak nitelendirir.</div>`

+ `<div class="l-note"><strong>Pratik okuma:</strong> Euler formülü, bir formüldeki her "cos ve sin" çiftini tek bir üstelle değiştirmemizi sağlar. Uzun trigonometrik türetmeler birkaç satır cebir haline gelir. Tam da bunun Fourier serisine olduğunu görmek üzereyiz.</div>`

/* ============================================================
   BÖLÜM 3: Birim Çember Yeniden
   ============================================================ */
+ `<h2 class="l-title">3. Birim Çember Yeniden</h2>`

+ `<div class="l-highlight"><strong>Geometrik resim:</strong> θ 0'dan 2π'ye değişirken $e^{i\\theta}$ noktası karmaşık düzlemde birim çemberi tam bir kez ve saat yönünün tersine çizer. Euler formülü, birim çemberin tek bir sembol içinde gizlenmiş parametrik denklemidir.</div>`

+ `<p class="l-text">Şimdi θ'yi zamana bağlı yapalım: θ = ωt koyalım; burada ω sabit bir açısal frekans (radyan/saniye). $e^{i\\omega t}$ fonksiyonu artık <strong>birim çember etrafında sabit ω açısal hızıyla dönen bir nokta</strong> olur. ω daha büyükse daha hızlı döner. ω negatifse ters yöne döner.</p>`

+ `<div class="calc-formula"><div class="formula-label">DÖNEN FAZ VEKTÖRÜ (PHASOR)</div><div class="formula-main">$$e^{i\\omega t} = \\cos(\\omega t) + i\\sin(\\omega t)$$</div><div class="formula-sub">ω açısal hızıyla dönen birim uzunluklu bir vektör. Yatay eksendeki reel gölgesi cos(ωt). Düşey eksendeki sanal gölgesi sin(ωt).</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Modül her zaman 1</div><div class="card-body">|e<sup>iωt</sup>| = √(cos² + sin²) = 1, her t için. Faz vektörü birim çember üzerinde yaşar; içinde ya da dışında değil.</div></div>`
+ `<div class="calc-card"><div class="card-title">Argüman ωt</div><div class="card-body">arg(e<sup>iωt</sup>) = ωt. Açı zamanla doğrusal artar. T = 2π/ω saniye sonra faz vektörü başlangıç açısına döner.</div></div>`
+ `<div class="calc-card"><div class="card-title">Reel gölge = cos(ωt)</div><div class="card-body">Dönen noktayı reel eksene düşürdüğünüzde tam olarak bir kosinüs görürsünüz. Trigonometriden bildiğiniz kosinüs, dönen bir okun yatay gölgesidir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Sanal gölge = sin(ωt)</div><div class="card-body">Aynı noktayı sanal eksene düşürdüğünüzde tam olarak bir sinüs görürsünüz. Sinüs ve kosinüs iki farklı fonksiyon değil — aynı dönmenin iki görünümü.</div></div>`
+ `</div>`

/* --- Plotly TR: birim çember --- */
+ `<div id="plot-l3-circle-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var th=[];for(var i=0;i<=200;i++){th.push(i*2*Math.PI/200);}
var cx=th.map(function(t){return Math.cos(t);});
var cy=th.map(function(t){return Math.sin(t);});
var circle={x:cx,y:cy,mode:"lines",name:"Birim çember |z|=1",line:{color:"rgba(59,130,246,0.35)",width:1.5}};
var pts=[Math.PI/6,Math.PI/3,Math.PI/2,2*Math.PI/3,5*Math.PI/6,Math.PI,7*Math.PI/6,4*Math.PI/3,3*Math.PI/2,5*Math.PI/3,11*Math.PI/6];
var px=pts.map(function(t){return Math.cos(t);});var py=pts.map(function(t){return Math.sin(t);});
var snapshots={x:px,y:py,mode:"markers",name:"e^(iωt) ardışık t'lerde",marker:{size:9,color:"#3b82f6",opacity:0.85}};
var p0={x:[Math.cos(Math.PI/3)],y:[Math.sin(Math.PI/3)],mode:"markers+text",name:"e^(iωt) (anlık)",marker:{size:14,color:"#f97316",symbol:"star"},text:["e^(iωt)"],textposition:"top right",textfont:{color:"#f97316",size:13}};
var arrow={x:[0,Math.cos(Math.PI/3)],y:[0,Math.sin(Math.PI/3)],mode:"lines",name:"yarıçap vektörü",line:{color:"#f97316",width:2.5}};
var realDrop={x:[Math.cos(Math.PI/3),Math.cos(Math.PI/3)],y:[Math.sin(Math.PI/3),0],mode:"lines",name:"sin(ωt) (reel eksene)",line:{color:"#10b981",width:2,dash:"dot"}};
var imagDrop={x:[Math.cos(Math.PI/3),0],y:[Math.sin(Math.PI/3),Math.sin(Math.PI/3)],mode:"lines",name:"cos(ωt) (sanal eksene)",line:{color:"#a855f7",width:2,dash:"dot"}};
var realPt={x:[Math.cos(Math.PI/3)],y:[0],mode:"markers",name:"cos(ωt) gölgesi",marker:{size:10,color:"#10b981"}};
var imagPt={x:[0],y:[Math.sin(Math.PI/3)],mode:"markers",name:"sin(ωt) gölgesi",marker:{size:10,color:"#a855f7"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.5,1.7],title:"Reel eksen",scaleanchor:"y",scaleratio:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-1.5,1.5],title:"Sanal eksen"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:-0.18,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-circle-tr",[circle,snapshots,realDrop,imagDrop,arrow,p0,realPt,imagPt],layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Soluk mavi halka birim çember. Küçük mavi noktalar e<sup>iωt</sup>'nin ardışık anlardaki anlık görüntüleri — çemberi saat yönünün tersine çiziyorlar. Turuncu yıldız seçilmiş bir andaki faz vektörü. Yeşil noktalı çizgi reel eksene iniyor (yeşil nokta cos(ωt)). Mor noktalı çizgi sanal eksene iniyor (mor nokta sin(ωt)). Kosinüs ve sinüs harfi harfine dönen okun yatay ve düşey gölgeleri.</div></div>`

+ `<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">e<sup>iωt</sup> saat yönünün tersine dönüyorsa, e<sup>−iωt</sup> ne yapar? Aynı hızda <em>saat yönünde</em> döner — aynı çember, ters yön. Bu görüntüyü aklınızda tutun: pozitif frekanslar bir yöne, negatif frekanslar diğer yöne döner. 5. bölümde gerekecek.</div></div>`

/* ============================================================
   BÖLÜM 4: Reel Fourier'den Karmaşığa
   ============================================================ */
+ `<h2 class="l-title">4. Reel Fourier'den Karmaşık Fourier'e</h2>`

+ `<p class="l-text">L2'deki reel değerli Fourier serisini hatırlayın. Periyodu T (temel frekansı ω₀ = 2π/T) olan makul her periyodik f(t) fonksiyonu şu şekilde açılabilir:</p>`

+ `<div class="calc-formula"><div class="formula-label">REEL FOURIER SERİSİ</div><div class="formula-main">$$f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\bigl[\\,a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t)\\,\\bigr]$$</div><div class="formula-sub">İki katsayı ailesi a<sub>n</sub> ve b<sub>n</sub>, iki integral formülü, her terim için iki trig fonksiyonu. İşliyor ama hantal.</div></div>`

+ `<p class="l-text">Euler formülü kosinüs ve sinüsü karmaşık üstellerle yeniden yazmamızı sağlar. İki denklemli sistemi çözelim:</p>`

+ `<div class="calc-formula"><div class="formula-label">EULER, YENİDEN DÜZENLENMİŞ</div><div class="formula-main">$$\\cos\\theta = \\frac{e^{i\\theta} + e^{-i\\theta}}{2}, \\qquad \\sin\\theta = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}$$</div><div class="formula-sub">e<sup>iθ</sup> ve e<sup>−iθ</sup>'yi toplayın, 2cos elde edersiniz. Çıkartın, 2i·sin elde edersiniz. Bu iki özdeşlik tüm trig formülasyonunu yutacak.</div></div>`

+ `<p class="l-text">Bunları Fourier serisinin her terimine koyun:</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Her cos ve sin'i üstel formuyla değiştir</div><div class="step-detail">$$a_n \\cos(n\\omega_0 t) + b_n \\sin(n\\omega_0 t) = a_n \\frac{e^{in\\omega_0 t} + e^{-in\\omega_0 t}}{2} + b_n \\frac{e^{in\\omega_0 t} - e^{-in\\omega_0 t}}{2i}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">1/i = −i ile paydayı temizle</div><div class="step-detail">b<sub>n</sub> terimi şu hale gelir: $\\frac{b_n}{2i}(e^{in\\omega_0 t} - e^{-in\\omega_0 t}) = \\frac{-i\\,b_n}{2}(e^{in\\omega_0 t} - e^{-in\\omega_0 t})$.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">e<sup>+inω₀t</sup> ve e<sup>−inω₀t</sup>'nin katsayılarını topla</div><div class="step-detail">$$= \\left(\\frac{a_n - i\\,b_n}{2}\\right)e^{in\\omega_0 t} + \\left(\\frac{a_n + i\\,b_n}{2}\\right)e^{-in\\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Yeni karmaşık katsayıları tanımla</div><div class="step-detail">n ≥ 1 için $c_n = \\tfrac{1}{2}(a_n - i b_n)$ ve $c_{-n} = \\tfrac{1}{2}(a_n + i b_n) = \\overline{c_n}$ olsun. $c_0 = a_0/2$ alınır.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Pozitif ve negatif indisleri tek toplamda birleştir</div><div class="step-detail">DC terimi ve her (n, −n) çifti −∞'dan +∞'a kadar tüm tamsayılar üzerinden tek bir toplamda katlanır.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">KARMAŞIK FOURIER SERİSİ</div><div class="formula-main">$$\\boxed{\\;f(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\, e^{i n \\omega_0 t}\\;}$$</div><div class="formula-sub">Tek formül. Tek katsayı ailesi c<sub>n</sub>. Tek fonksiyon ailesi e<sup>inω₀t</sup>. Trig formülasyonunun şişkinliği eridi.</div></div>`

+ `<div class="calc-formula"><div class="formula-label">İKİ AİLE ARASINDAKİ İLİŞKİ</div><div class="formula-main">$$c_n = \\frac{a_n - i\\,b_n}{2}\\ (n>0), \\qquad c_{-n} = \\overline{c_n}, \\qquad c_0 = \\frac{a_0}{2}$$</div><div class="formula-sub">Diğer yöne: a<sub>n</sub> = 2·Re(c<sub>n</sub>), b<sub>n</sub> = −2·Im(c<sub>n</sub>). İki temsil aynı bilgiyi taşır.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">İki toplam yerine tek</div><div class="card-body">Artık kosinüs ve sinüs katkılarını ayırmak yok. Tek bir c<sub>n</sub> hem n. harmoniğin genliğini hem de fazını tek bir karmaşık sayıda paketler.</div></div>`
+ `<div class="calc-card"><div class="card-title">Tek baz fonksiyonu</div><div class="card-body">cos(nω₀t) ve sin(nω₀t) çiftleri yerine e<sup>inω₀t</sup> tek başına yeter. Cebir tekdüze hale gelir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Tüm tamsayılar üzerine toplam</div><div class="card-body">n indisi şimdi −∞'dan +∞'a uzanır. Negatif indisler yeni bir fizik değil — her (cos, sin) çiftinin ikinci yarısını kodluyorlar.</div></div>`
+ `</div>`

+ `<div class="l-note"><strong>Anahtar okuma:</strong> Fourier serisine hiçbir şey eklenmedi ya da çıkarılmadı. Aynı açılımı, doğal dönme simetrisine saygı duyan bir koordinat sisteminde (karmaşık üsteller) yeniden etiketledik. Aynı sinyal, aynı harmonikler, daha hafif gösterim.</div>`

/* ============================================================
   BÖLÜM 5: Negatif Frekanslar
   ============================================================ */
+ `<h2 class="l-title">5. Negatif Frekanslar — Ne Anlama Geliyorlar?</h2>`

+ `<div class="l-highlight"><strong>Klasik bulmaca:</strong> 60 Hz şebeke uğultusunun frekansı 60 Hz. Peki <em>−60 Hz</em> frekansı tam olarak nedir? Zamanı geri mi sardık? Enerji mi üretiyoruz? Hayır — negatif frekanslar dönme tabanlı bir baz kullanmanın matematiksel sonucudur ve gerçel sinyalleri vermek için her zaman pozitif olanlarla güzel biçimde eşleşirler.</div>`

+ `<p class="l-text">Gerçel değerli bir sinyal — osiloskopta, mikrofonda ya da termometrede ölçebileceğiniz her şey — sıkı bir simetriye uyan katsayılar üretir:</p>`

+ `<div class="calc-formula"><div class="formula-label">GERÇEL SİNYALLER İÇİN EŞLENİK SİMETRİ</div><div class="formula-main">$$f(t) \\in \\mathbb{R} \\iff c_{-n} = \\overline{c_n} \\quad \\forall n$$</div><div class="formula-sub">Sinyal gerçel değerli ise, −n frekansındaki katsayı +n'deki katsayının karmaşık eşleniğidir. Modüller eşleşir; fazlar zıttır.</div></div>`

+ `<p class="l-text">Bu simetri gerçekliği nasıl kurtarır? Bir (+n, −n) çiftini topladığınızda ne olduğuna bakın:</p>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Çifti c<sub>n</sub> = A·e<sup>iφ</sup> ve c<sub>−n</sub> = A·e<sup>−iφ</sup> ile yaz</div><div class="step-detail">İkisinin de modülü A. Fazlar tam zıt. "Eşlenik" kelimesinin kutupsal formdaki anlamı bu.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İki karmaşık üsteli topla</div><div class="step-detail">$$c_n e^{in\\omega_0 t} + c_{-n} e^{-in\\omega_0 t} = A e^{i\\phi} e^{in\\omega_0 t} + A e^{-i\\phi} e^{-in\\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Çarpanlara ayır ve Euler'i uygula</div><div class="step-detail">$$= A \\bigl[ e^{i(n\\omega_0 t + \\phi)} + e^{-i(n\\omega_0 t + \\phi)} \\bigr] = 2A \\cos(n\\omega_0 t + \\phi)$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Gerçel değerli bir kosinüs çıkar</div><div class="step-detail">Karmaşık parçalar sanal kısımlar tam olarak iptal olacak şekilde anlaşır. Geriye genliği 2A, fazı φ olan tek bir gerçel sinüs kalır.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">İKİ ZIT YÖNDE DÖNEN FAZ VEKTÖRÜ = TEK GERÇEL SİNÜS</div><div class="formula-main">$$A e^{i(\\omega t + \\phi)} + A e^{-i(\\omega t + \\phi)} = 2 A \\cos(\\omega t + \\phi)$$</div><div class="formula-sub">Aynı hızda, ayna fazla, zıt yönlerde dönen iki karmaşık faz vektörü gerçel bir kosinüse toplanır. "Negatif frekansın" geometrik anlamı budur.</div></div>`

/* --- Plotly TR: counter-rotating phasors --- */
+ `<div id="plot-l3-counter-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var T=[];for(var i=0;i<=400;i++){T.push(i*4*Math.PI/400);}
var posRe=T.map(function(t){return Math.cos(t);});
var posIm=T.map(function(t){return Math.sin(t);});
var negRe=T.map(function(t){return Math.cos(-t);});
var negIm=T.map(function(t){return Math.sin(-t);});
var sumRe=T.map(function(t){return 2*Math.cos(t);});
var pos={x:T,y:posRe,mode:"lines",name:"Re[e^(+iωt)] = cos(ωt)",line:{color:"#3b82f6",width:2}};
var neg={x:T,y:negRe,mode:"lines",name:"Re[e^(−iωt)] = cos(ωt)",line:{color:"#f97316",width:2,dash:"dot"}};
var posI={x:T,y:posIm,mode:"lines",name:"Im[e^(+iωt)] = +sin(ωt)",line:{color:"#3b82f6",width:1.2,dash:"dash"},visible:"legendonly"};
var negI={x:T,y:negIm,mode:"lines",name:"Im[e^(−iωt)] = −sin(ωt)",line:{color:"#f97316",width:1.2,dash:"dash"},visible:"legendonly"};
var sum={x:T,y:sumRe,mode:"lines",name:"Toplam = 2 cos(ωt)",line:{color:"#10b981",width:3}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",range:[-2.4,2.4],title:"değer"},margin:{t:60,r:30,b:50,l:50},showlegend:true,legend:{orientation:"h",y:-0.18,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-counter-tr",[pos,neg,sum],layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Mavi, +ω faz vektörünün reel kısmı; turuncu ise −ω faz vektörünün reel kısmı — kosinüs çift bir fonksiyon olduğundan ikisi de aynı görünüyor. Gizlenen sanal kısımlar (efsanedeki kesik çizgilerini açın) tam ayna görüntüsü (+sin ve −sin) olup mükemmel biçimde iptal oluyor. Yeşil eğri toplamlarıdır; çift genlikli saf gerçel bir kosinüs. Negatif frekanslar egzotik değil — sanal kısımların iptalini sağlayan sessiz ortaktır.</div></div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Gerçel sinyaller = dengeli spektrum</div><div class="card-body">+n frekansındaki her katsayı için −n'de eşleşen bir eşlenik vardır. Modül spektrumu |c<sub>n</sub>| n = 0 etrafında ayna simetriktir. Faz spektrumu anti-simetriktir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Karmaşık sinyaller = dengesiz</div><div class="card-body">İletişimde (analitik sinyaller, IQ modülasyon), bilinçli olarak simetrik olmayan spektrumlu sinyaller kullanırız — birim bant başına iki kat bilgi taşırlar. Negatif frekanslar fiziksel olarak farklı hale gelir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Toplam güç değişmez</div><div class="card-body">Parseval teoremine göre toplam enerji Σ |c<sub>n</sub>|² . Gerçel sinyaller için bu toplam, tek-taraflı (sadece pozitif) spektrumun gösterdiğinin tam olarak iki katıdır — çünkü pozitif ve negatif frekanslar yarımı taşır.</div></div>`
+ `</div>`

+ `<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Spektrum analizöründe sadece pozitif frekansları gören bir mühendis düşünün. Cihaz, (+n, −n) modüllerini örtük olarak toplamış durumda — ekrandaki genliğin orijinal sinüsün genliği ile eşleşmesinin, çift olmamasının sebebi bu. Negatif yarı yaşar ama ekran onu pozitif yarıya kendiliğinden katlar.</div></div>`

/* ============================================================
   BÖLÜM 6: c_n'i doğrudan hesaplama
   ============================================================ */
+ `<h2 class="l-title">6. c<sub>n</sub>'i Doğrudan Hesaplama</h2>`

+ `<p class="l-text">Karmaşık Fourier serisi, c<sub>n</sub>'i f(t)'den doğrudan hesaplamanın bir yolu olmadan eksik kalır. Tıpkı a<sub>n</sub> ve b<sub>n</sub>'in f'i kosinüs ve sinüslere izdüşümleyerek geldiği gibi, c<sub>n</sub> de f'i e<sup>inω₀t</sup>'ye izdüşümleyerek gelir. İzdüşüm <strong>karmaşık üstellerin temel diklik ilişkisini</strong> kullanır:</p>`

+ `<div class="calc-formula"><div class="formula-label">DİKLİK</div><div class="formula-main">$$\\frac{1}{T}\\int_0^T e^{i m \\omega_0 t}\\,e^{-i n \\omega_0 t}\\,dt = \\delta_{mn} = \\begin{cases} 1 & m = n \\\\ 0 & m \\neq n \\end{cases}$$</div><div class="formula-sub">Üsteller [0, T] üzerinde ortonormal bir baz oluşturur. İzdüşüm tam olarak tek bir katsayıyı seçer — δ<sub>mn</sub> Kronecker deltasıdır.</div></div>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Karmaşık seriden başla</div><div class="step-detail">$$f(t) = \\sum_{m=-\\infty}^{\\infty} c_m e^{i m \\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Her iki tarafı e<sup>−inω₀t</sup> ile çarp</div><div class="step-detail">$$f(t) e^{-i n \\omega_0 t} = \\sum_{m=-\\infty}^{\\infty} c_m e^{i (m-n) \\omega_0 t}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İki tarafı bir tam periyot üzerinde integralle</div><div class="step-detail">$$\\int_0^T f(t) e^{-i n \\omega_0 t}\\,dt = \\sum_{m=-\\infty}^{\\infty} c_m \\int_0^T e^{i(m-n)\\omega_0 t}\\,dt$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Dikliği uygula — m = n hariç her terim sıfır</div><div class="step-detail">Sağdaki integral T·δ<sub>mn</sub>. Toplam tek bir hayatta kalana çöker: c<sub>n</sub>·T.</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">c<sub>n</sub>'yi çek</div><div class="step-detail">T'ye böl.</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">ANALİZ FORMÜLÜ</div><div class="formula-main">$$\\boxed{\\;c_n = \\frac{1}{T}\\int_0^T f(t)\\,e^{-i n \\omega_0 t}\\,dt\\;}$$</div><div class="formula-sub">Tek bir integral. Tek bir karmaşık sayı. Hem genlik hem faz, tek pakette. Üsteldeki negatif işarete dikkat — "e<sup>inω₀t</sup> bazına izdüşüm" budur. Yazım hatası değil.</div></div>`

+ `<div class="l-note"><strong>Eksi neden var?</strong> e<sup>inω₀t</sup> baz fonksiyonuna izdüşüm yapmak için karmaşık eşleniğini alırız (çünkü karmaşık fonksiyonlardaki iç çarpım &lt;f, g&gt; = ∫f·ḡ). e<sup>inω₀t</sup>'nin eşleniği e<sup>−inω₀t</sup>. Bu eksi işareti modern Fourier dönüşümüne kadar hayatta kalır.</div>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Modül |c<sub>n</sub>|</div><div class="card-body">f'de nω₀ frekansının ne kadar bulunduğunu söyler. |c<sub>n</sub>| - n grafiği <strong>modül spektrumudur</strong> — sinyalin "parmak izi."</div></div>`
+ `<div class="calc-card"><div class="card-title">Faz arg(c<sub>n</sub>)</div><div class="card-body">O frekans bileşeninin zaman kaymasını söyler. f(t)'yi zamanda kaydırmak her c<sub>n</sub>'yi saf bir faz ile çarpar. Modül değişmez; faz döner.</div></div>`
+ `<div class="calc-card"><div class="card-title">DC terimi c<sub>0</sub></div><div class="card-body">$c_0 = \\tfrac{1}{T}\\int_0^T f(t)\\,dt$ — sinyalin ortalama değeri. "Sıfır frekans" bileşeni. Gerçel sinyaller için daima reeldir.</div></div>`
+ `</div>`

/* ============================================================
   BÖLÜM 7: Neden bu form üstün
   ============================================================ */
+ `<h2 class="l-title">7. Bu Form Neden Üstün</h2>`

+ `<p class="l-text">Karmaşık form sadece kozmetik olarak hoş değil. Onu çalışan analiz ve hesaplama için kaçınılmaz kılan yapısal özelliklere sahip.</p>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Tek katsayı ailesi, tek baz</div><div class="card-body">İki integrali (a<sub>n</sub> ve b<sub>n</sub> için) bir integralle (c<sub>n</sub> için) değiştirin. cos+sin çiftlerini tek e<sup>inω₀t</sup> ile değiştirin. Kod kısalır, ispatlar kısalır, formüller okunaklı hale gelir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Zaman kayması = faz dönmesi</div><div class="card-body">g(t) = f(t − τ) ise, g'nin n. katsayısı c<sub>n</sub>·e<sup>−inω₀τ</sup>'dir. Bir zaman gecikmesi her karmaşık katsayıyı frekansla orantılı bir fazla döndürür. Bunu (a<sub>n</sub>, b<sub>n</sub>) formunda ifade etmek çok satırlı cebir gerektirir.</div></div>`
+ `<div class="calc-card"><div class="card-title">Türev = inω ile çarpma</div><div class="card-body">$\\frac{d}{dt}\\bigl[e^{i n \\omega_0 t}\\bigr] = i n \\omega_0 \\cdot e^{i n \\omega_0 t}$. Türevler cebirsel hale gelir. Doğrusal diferansiyel denklemleri polinom denklemlerine çeviren özdeğer özelliği budur.</div></div>`
+ `<div class="calc-card"><div class="card-title">Konvolüsyon = çarpma</div><div class="card-body">(f * g) konvolüsyonunun Fourier katsayıları c<sub>n</sub>(f)·c<sub>n</sub>(g) çarpımlarıdır. Karmaşık form olmadan bu zarif özdeşlik trig çarpım-toplam özdeşlikleri altında gömülür.</div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">d/dt'NİN ÖZDEĞER ÖZELLİĞİ</div><div class="formula-main">$$\\frac{d}{dt}\\bigl[e^{i n \\omega_0 t}\\bigr] = (i n \\omega_0)\\,e^{i n \\omega_0 t}$$</div><div class="formula-sub">Karmaşık üsteller türev operatörünün <em>özfonksiyonlarıdır</em>. Özdeğer inω₀'dır. Bu tek özellik, her doğrusal-zamanla-değişmez sistemin Fourier dönüşümü tarafından "köşegenleştirilmesinin" nedenidir.</div></div>`

+ `<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Bir fizikçi sabit katsayılı doğrusal bir ADD'yi çözerken e<sup>iωt</sup> formunda bir çözüm "dener". ADD ω'da polinom bir denkleme dönüşür. Bu yaklaşımın işe yaramasının nedeni yukarıdaki özdeğer özelliğidir. Karmaşık üstel, e<sub>1</sub>, e<sub>2</sub>, e<sub>3</sub>'ün köşegen matrisin özvektörleri olduğu gibi d/dt operatörünün özvektörüdür.</div></div>`

+ `<div class="l-note"><strong>Mühendislik vurgusu:</strong> Her modern sinyal işleme boru hattı — FFT, sayısal filtreler, iletişim, görüntü sıkıştırma, ses kodlama — karmaşık formda yazılır. (a<sub>n</sub>, b<sub>n</sub>) yerine doğrudan c<sub>n</sub> ile düşünmeyi öğrenmek, "Fourier okudum" ile "Fourier ile çalışıyorum" arasındaki kültürel eşiktir.</div>`

/* ============================================================
   BÖLÜM 8: Örnek — kare dalga karmaşık formda
   ============================================================ */
+ `<h2 class="l-title">8. Örnek: Karmaşık Formda Kare Dalga</h2>`

+ `<p class="l-text">L2'deki kare dalga katsayılarını bu kez c<sub>n</sub> kullanarak yeniden hesaplayalım ve iki temsilin uyuştuğunu doğrulayalım.</p>`

+ `<p class="l-text">T = 2π periyotlu (yani ω₀ = 1) tek (odd) kare dalgayı düşünün:</p>`

+ `<div class="calc-formula"><div class="formula-label">KARE DALGA</div><div class="formula-main">$$f(t) = \\begin{cases} +1, & 0 < t < \\pi \\\\ -1, & \\pi < t < 2\\pi \\end{cases}$$</div><div class="formula-sub">Ortalama değeri sıfır, t = π etrafında tek. Her c<sub>n</sub>'yi istiyoruz.</div></div>`

+ `<div class="calc-steps">`
+ `<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Analiz formülüne yerleştir</div><div class="step-detail">$$c_n = \\frac{1}{2\\pi}\\int_0^{2\\pi} f(t)\\,e^{-i n t}\\,dt = \\frac{1}{2\\pi}\\left[\\int_0^{\\pi} e^{-i n t}\\,dt - \\int_{\\pi}^{2\\pi} e^{-i n t}\\,dt\\right]$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">e<sup>−int</sup>'nin ilkel fonksiyonu (e<sup>−int</sup>) / (−in) (n ≠ 0)</div><div class="step-detail">$$c_n = \\frac{1}{2\\pi}\\cdot\\frac{1}{-in}\\Bigl[(e^{-i n \\pi} - 1) - (e^{-i n \\cdot 2\\pi} - e^{-i n \\pi})\\Bigr]$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">e<sup>−in·2π</sup> = 1 kullan (her tamsayı n)</div><div class="step-detail">$$= \\frac{1}{2\\pi}\\cdot\\frac{1}{-in}\\bigl[2 e^{-i n \\pi} - 2\\bigr] = \\frac{e^{-i n \\pi} - 1}{-i n \\pi}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">e<sup>−inπ</sup> = (−1)<sup>n</sup> kullan</div><div class="step-detail">$$c_n = \\frac{(-1)^n - 1}{-i n \\pi}$$</div></div></div>`
+ `<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">n'nin parite durumuna göre sonuç</div><div class="step-detail">Çift n ≠ 0 için pay 0, bu yüzden c<sub>n</sub> = 0. Tek n için (−1)<sup>n</sup> − 1 = −2, dolayısıyla $c_n = \\frac{-2}{-i n \\pi} = \\frac{2}{i n \\pi} = \\frac{-2i}{n \\pi}$. Ve c<sub>0</sub> = 0 (sıfır ortalama).</div></div></div>`
+ `</div>`

+ `<div class="calc-formula"><div class="formula-label">KARE DALGA — KARMAŞIK KATSAYILAR</div><div class="formula-main">$$c_n = \\begin{cases} \\dfrac{-2 i}{n \\pi}, & n \\text{ tek} \\\\[4pt] 0, & n \\text{ çift (n = 0 dahil)}\\end{cases}$$</div><div class="formula-sub">Tamamen sanal — sinyalin tek olmasıyla tutarlı. Modül |c<sub>n</sub>| = 2/(|n|π) tek n için, 1/n hızıyla azalır.</div></div>`

+ `<p class="l-text"><strong>Tutarlılık kontrolü.</strong> L2'den reel katsayılar a<sub>n</sub> = 0, b<sub>n</sub> = 4/(nπ) tek n için. $c_n = \\tfrac{1}{2}(a_n - i b_n) = \\tfrac{1}{2}\\bigl(0 - i \\cdot 4/(n\\pi)\\bigr) = -2i/(n\\pi)$ uygulanır. Sözünü tuttuk: eşleşme tam.</p>`

/* --- Plotly TR: kare dalga stem --- */
+ `<div id="plot-l3-sqstem-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var ns=[];var mags=[];for(var n=-15;n<=15;n++){ns.push(n);if(n===0||n%2===0){mags.push(0);}else{mags.push(2/(Math.abs(n)*Math.PI));}}
var stems=[];for(var i=0;i<ns.length;i++){stems.push({x:[ns[i],ns[i]],y:[0,mags[i]],mode:"lines",line:{color:"#3b82f6",width:2.5},showlegend:false,hoverinfo:"skip"});}
var heads={x:ns,y:mags,mode:"markers",name:"|c_n| kare dalga",marker:{size:9,color:"#3b82f6"}};
var data=stems.concat([heads]);
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"harmonik indeks n",dtick:2,range:[-16,16]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"|c_n|",range:[0,0.75]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:-0.18,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-sqstem-tr",data,layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Kare dalganın n = −15 ile +15 arasındaki karmaşık Fourier katsayılarının modülü. Yalnızca tek harmonikler hayatta kalır ve modülleri 2/(|n|π) ile azalır. Grafik n = 0 etrafında ayna simetriktir — gerçel sinyalin eşlenik simetrisi. L2'deki b<sub>n</sub> stem grafiği ile karşılaştırın: buradaki her sivri uç oradaki karşılığının yarısı kadardır, çünkü enerji şimdi +n ve −n arasında bölünmüş.</div></div>`

/* ============================================================
   BÖLÜM 9: Pratik egzersiz
   ============================================================ */
+ `<h2 class="l-title">9. Pratik Egzersiz: c<sub>n</sub>'i Sayısal Hesaplama</h2>`

+ `<p class="l-text">Şimdi kalem-kağıt yerine kodla Fourier katsayıları hesaplama vakti. Keyfi bir periyodik sinyal kuracak, birçok n için c<sub>n</sub>'yi bulmak üzere integral alacak ve hem modül hem faz spektrumlarını çizeceğiz.</p>`

+ `<div class="code-wrap"><div class="code-label"><span>PYTHON · SAYISAL FOURIER KATSAYILARI</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Özel periyodik sinyal: faz kaymalı yarım-kosinüs darbe.</span>
<span class="cm"># periyot T = 2*pi, temel omega0 = 1.</span>
T = <span class="num">2</span> * np.pi
omega0 = <span class="num">2</span> * np.pi / T
N_pts = <span class="num">4096</span>                       <span class="cm"># integrasyon için yoğun ızgara</span>
t = np.linspace(<span class="num">0</span>, T, N_pts, endpoint=<span class="kw">False</span>)
dt = t[<span class="num">1</span>] - t[<span class="num">0</span>]

<span class="cm"># Sinyal: birkaç kosinüs + faz kaymalı bir ton</span>
f = <span class="num">1.0</span>*np.cos(<span class="num">1</span>*t) + <span class="num">0.5</span>*np.cos(<span class="num">3</span>*t + np.pi/<span class="num">4</span>) + <span class="num">0.25</span>*np.cos(<span class="num">5</span>*t - np.pi/<span class="num">3</span>)

<span class="kw">def</span> <span class="fn">cn</span>(n):
    <span class="cm">"""Sayısal integrasyon ile c_n = (1/T) int_0^T f(t) e^{-i n omega0 t} dt."""</span>
    integrand = f * np.exp(-<span class="num">1j</span> * n * omega0 * t)
    <span class="kw">return</span> np.sum(integrand) * dt / T

ns = np.arange(-<span class="num">10</span>, <span class="num">11</span>)
coeffs = np.array([<span class="fn">cn</span>(n) <span class="kw">for</span> n <span class="kw">in</span> ns])

<span class="fn">print</span>(<span class="str">"n   |    Re(c_n)    Im(c_n)   |c_n|     arg(c_n) [rad]"</span>)
<span class="kw">for</span> n, c <span class="kw">in</span> <span class="fn">zip</span>(ns, coeffs):
    <span class="fn">print</span>(<span class="str">f"{n:+3d} | {c.real:+8.4f}  {c.imag:+8.4f}  {abs(c):6.4f}  {np.angle(c):+7.4f}"</span>)

<span class="cm"># Tutarlılık kontrolü: n=1'deki ilk kosinüs için c_1 = c_{-1} = 0.5 (reel) beklenir</span>
<span class="cm"># 3. harmonik için faz pi/4: |c_3| = 0.25, arg = pi/4 (ve n=-3'te eşlenik)</span>
<span class="cm"># 5. harmonik için faz -pi/3: |c_5| = 0.125, arg = -pi/3</span>
</code></pre></div>`

+ `<p class="l-text">Katsayı dizinizi aldığınızda spektrumları çizmek çok basit:</p>`

+ `<div class="code-wrap"><div class="code-label"><span>PYTHON · MODÜL & FAZ SPEKTRUMU</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

mag = np.abs(coeffs)
phase = np.angle(coeffs)
<span class="cm"># Modülün esas olarak sıfır olduğu yerlerde fazı sıfırlayın (gürültüyü temizler).</span>
phase[mag &lt; <span class="num">1e-6</span>] = <span class="num">0</span>

fig, (ax1, ax2) = plt.subplots(<span class="num">2</span>, <span class="num">1</span>, figsize=(<span class="num">9</span>, <span class="num">5</span>), sharex=<span class="kw">True</span>)
ax1.stem(ns, mag, basefmt=<span class="str">" "</span>)
ax1.set_ylabel(<span class="str">"|c_n|"</span>); ax1.set_title(<span class="str">"Modül spektrumu"</span>); ax1.grid(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

ax2.stem(ns, phase, basefmt=<span class="str">" "</span>, linefmt=<span class="str">"C1-"</span>, markerfmt=<span class="str">"C1o"</span>)
ax2.set_ylabel(<span class="str">"arg(c_n) [rad]"</span>); ax2.set_xlabel(<span class="str">"harmonik indeks n"</span>)
ax2.set_title(<span class="str">"Faz spektrumu"</span>); ax2.grid(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
ax2.axhline(<span class="num">0</span>, color=<span class="str">"k"</span>, lw=<span class="num">0.5</span>)
plt.tight_layout(); plt.show()
</code></pre></div>`

/* --- Plotly TR: modül + faz spektrumu --- */
+ `<div id="plot-l3-spec-tr" class="plotly-graph"></div>`
+ `<script>setTimeout(function(){
var ns=[];var mag=[];var ph=[];
for(var n=-10;n<=10;n++){
ns.push(n);
var an=Math.abs(n);
if(an===1){mag.push(0.5);ph.push(n>0?0:0);}
else if(an===3){mag.push(0.25);ph.push(n>0?Math.PI/4:-Math.PI/4);}
else if(an===5){mag.push(0.125);ph.push(n>0?-Math.PI/3:Math.PI/3);}
else{mag.push(0);ph.push(0);}
}
var stems1=[];for(var i=0;i<ns.length;i++){stems1.push({x:[ns[i],ns[i]],y:[0,mag[i]],mode:"lines",line:{color:"#3b82f6",width:2.5},showlegend:false,hoverinfo:"skip",xaxis:"x",yaxis:"y"});}
var heads1={x:ns,y:mag,mode:"markers",name:"|c_n|",marker:{size:8,color:"#3b82f6"},xaxis:"x",yaxis:"y"};
var stems2=[];for(var i=0;i<ns.length;i++){if(mag[i]>1e-9){stems2.push({x:[ns[i],ns[i]],y:[0,ph[i]],mode:"lines",line:{color:"#f97316",width:2.5},showlegend:false,hoverinfo:"skip",xaxis:"x2",yaxis:"y2"});}}
var phShow=ph.map(function(v,i){return mag[i]>1e-9?v:null;});
var heads2={x:ns,y:phShow,mode:"markers",name:"arg(c_n)",marker:{size:8,color:"#f97316"},xaxis:"x2",yaxis:"y2"};
var data=stems1.concat([heads1]).concat(stems2).concat([heads2]);
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},grid:{rows:2,columns:1,pattern:"independent"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",dtick:2,range:[-11,11]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"|c_n|",range:[0,0.6]},xaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"harmonik indeks n",dtick:2,range:[-11,11]},yaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.25)",title:"arg(c_n) [rad]",range:[-1.3,1.3]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:-0.13,x:0.5,xanchor:"center",font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l3-spec-tr",data,layout,{responsive:true,displayModeBar:false});
},250)</script>`

+ `<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Üstte: 1·cos(t) + 0.5·cos(3t + π/4) + 0.25·cos(5t − π/3) test sinyalinin modül spektrumu |c<sub>n</sub>|. n = ±1, ±3, ±5 noktalarında üç çift sivri uç 0.5, 0.25, 0.125 yüksekliklerinde — her bir kosinüs genliğinin tam olarak yarısı, kalanı negatif tarafta gizli. Altta: faz spektrumu arg(c<sub>n</sub>). Pozitif-n bileşenlerinin fazları kosinüs faz kaymalarıyla eşleşir; negatif-n fazları ayna görüntüsüdür — gerçel sinyalin eşlenik simetrisi.</div></div>`

+ `<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Genliği A, fazı φ olan gerçel bir kosinüs c<sub>n</sub> = (A/2)·e<sup>iφ</sup> ve c<sub>−n</sub> = (A/2)·e<sup>−iφ</sup> üretir. Spektrumdaki genlik yarımdır, tam A değil — çünkü diğer yarı ayna frekansta yaşıyor. Mühendisler "spektrum analizöründe 1 Vrms tonu 0 dB'dir" derken cihaz, negatif yarıyı zaten pozitif yarının üzerine katlamıştır.</div></div>`

+ `<div class="l-warn"><strong>Sonraki ders:</strong> L4'te T periyodunu sonsuza götürmeye izin vereceğiz. Ayrık indeks n sürekli bir frekans değişkeni ω haline gelir, toplam integrale dönüşür ve karmaşık Fourier serisi <strong>sürekli Fourier dönüşümüne</strong> evrilir. Burada öğrendiğiniz her şey değişmeden ölçeklenecek — e<sup>−iωt</sup> izdüşümü hayatta kalır, eşlenik simetri hayatta kalır, özdeğer özelliği hayatta kalır.</div>`

/* ============================================================
   ÖZET
   ============================================================ */
+ `<h2 class="l-title">10. Özet</h2>`

+ `<div class="calc-cards">`
+ `<div class="calc-card"><div class="card-title">Karmaşık sayı</div><div class="card-body">Reel kısmı, sanal kısmı, uzunluğu |z| ve açısı arg(z) olan düzlemdeki bir nokta. Çarpma açıları toplar.</div><div class="card-formula">z = a + bi</div></div>`
+ `<div class="calc-card"><div class="card-title">Euler formülü</div><div class="card-body">Taylor serilerinden türetilmiş: sanal eksende değerlendirilen üstel, cos + i·sin'dir.</div><div class="card-formula">e^(iθ) = cosθ + i·sinθ</div></div>`
+ `<div class="calc-card"><div class="card-title">Faz vektörü (phasor)</div><div class="card-body">e^(iωt) ω açısal hızıyla dönen birim uzunluklu bir vektördür. Reel gölgesi kosinüs, sanal gölgesi sinüstür.</div><div class="card-formula">|e^(iωt)| = 1</div></div>`
+ `<div class="calc-card"><div class="card-title">Karmaşık Fourier serisi</div><div class="card-body">(a<sub>n</sub>, b<sub>n</sub>) çiftinin yerini tüm tamsayı indislere uzanan tek bir toplam alır. Katsayılar c<sub>n</sub> karmaşıktır.</div><div class="card-formula">f(t) = Σ c<sub>n</sub> e^(inω₀t)</div></div>`
+ `<div class="calc-card"><div class="card-title">Eşlenik simetri</div><div class="card-body">Gerçel bir sinyal için c<sub>−n</sub> = conj(c<sub>n</sub>). Pozitif ve negatif frekanslar sanal kısımları iptal edecek biçimde eşleşir.</div><div class="card-formula">c<sub>-n</sub> = conj(c<sub>n</sub>)</div></div>`
+ `<div class="calc-card"><div class="card-title">Analiz formülü</div><div class="card-body">Her c<sub>n</sub>, f'i e^(inω₀t) baz fonksiyonuna eşlenik alarak izdüşümleyerek elde edilir (eksi işaretinin nedeni).</div><div class="card-formula">c<sub>n</sub> = (1/T)∫f(t)e^(-inω₀t)dt</div></div>`
+ `<div class="calc-card"><div class="card-title">d/dt'nin özfonksiyonu</div><div class="card-body">Türev e^(inωt)'yi özdeğer inω ile çarpar. Doğrusal diferansiyel denklemler cebirsel hale gelir.</div><div class="card-formula">d/dt[e^(iωt)] = iω·e^(iωt)</div></div>`
+ `<div class="calc-card"><div class="card-title">Modül ve faz</div><div class="card-body">|c<sub>n</sub>| nω₀ frekansının ne kadarının bulunduğunu ölçer. arg(c<sub>n</sub>) zaman kaymasını ölçer.</div><div class="card-formula">|c<sub>n</sub>|, arg(c<sub>n</sub>)</div></div>`
+ `</div>`

+ `<div class="l-note"><strong>Kültürel kayma:</strong> Dersin geri kalanı — Fourier dönüşümü, DFT, FFT, Laplace, Z-dönüşümü — neredeyse tamamen karmaşık formda yazılacak. L4'ten itibaren bir bölüm opak hissettirirse buraya geri dönün ve görüntüyü yeniden kurun: dönen bir faz vektörü, zıt yönde dönen iki tane, ve birini seçen bir integral.</div>`
};
