window.FOURIER_L6 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The Laplace transform is Fourier's broader, more practical cousin.</strong> Where the Fourier transform demands that your signal be absolutely integrable — well-behaved enough that <code>\\int|f(t)|dt</code> is finite — the Laplace transform calmly handles signals that <em>grow</em>, that <em>switch on at t=0</em>, that come with <em>non-zero initial conditions</em>. It is the workhorse of classical control theory, the language of electrical circuits, and the standard tool any mechanical engineer reaches for when a differential equation appears.</p>

<p class="l-text">This lesson is unapologetically classical. We will solve ODEs by turning them into algebra. We will draw poles and zeros on the complex s-plane and read off stability at a glance. We will analyze RC and RLC circuits with the same fluency a musician reads a score. The one place we will brush against modern machine learning — Neural ODEs and continuous dynamical systems — gets a short paragraph at the end. Don't expect Laplace to pop up in your training loop; expect it everywhere a real physical system sits behind the data.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the Laplace transform definition and explain why the complex variable <em>s = sigma + i omega</em> lets it succeed where Fourier fails</li>
<li>Compute the Laplace transform of constants, exponentials, sines, cosines, and the Dirac delta from the integral</li>
<li>Use the differentiation property to convert any linear ODE with constant coefficients into a simple algebraic equation</li>
<li>Solve a second-order ODE with initial conditions end-to-end using Laplace, partial fractions, and an inverse-transform table</li>
<li>Read the pole-zero diagram of a transfer function and predict stability, oscillation, and time-domain response shape</li>
<li>Derive and interpret the RC low-pass filter and the standard second-order RLC system, including damping ratio and natural frequency</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Laplace? When Fourier Fails</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> Fourier is a perfectly tuned spectrum analyzer that only works on signals that have <em>always existed</em> and that fade out at both ends of time. Laplace is the engineer's multimeter — switch the circuit on at t = 0, watch the transient overshoot, ride out the exponential decay, and still read every number off the screen. Both measure frequency content, but Laplace doesn't care if the signal is growing, switching on, or starting from rest.</div>

<p class="l-text">Recall the requirement that quietly haunts every Fourier integral. For <code>\\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt</code> to converge, the function must be <strong>absolutely integrable</strong> — informally, it must die down fast enough on both sides of zero. Now ask yourself which signals an engineer or physicist actually meets in the lab:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f(t) = e^{t}</div><div class="card-body">Exponentially growing — a small disturbance in an unstable amplifier, an avalanche in a Geiger counter. Fourier integral diverges immediately.</div></div>
<div class="calc-card"><div class="card-title">f(t) = u(t)</div><div class="card-body">Heaviside step — flip a switch at t = 0, voltage stays on forever. Doesn't decay, so the Fourier integral does not exist in the usual sense (only as a distribution).</div></div>
<div class="calc-card"><div class="card-title">f(t) defined only for t &gt; 0</div><div class="card-body">A relay closes at t = 0; we never knew what happened before. Half the integration domain is undefined. Fourier wants the whole real line.</div></div>
<div class="calc-card"><div class="card-title">Initial conditions y(0), y'(0)</div><div class="card-body">"Spring released from 2 cm displacement with zero velocity." Fourier has no built-in way to honour this. Laplace puts them inside the algebra.</div></div>
</div>

<p class="l-text">Laplace fixes all four by doing two things at once. First, it integrates only from <code>t = 0</code> to <code>\\infty</code> — perfect for systems that begin their life at a definite moment. Second, it multiplies the integrand by an extra exponential <code>e^{-\\sigma t}</code> with a tunable damping factor <code>\\sigma</code> large enough to crush any growth in <code>f(t)</code>. The Fourier piece <code>e^{-i\\omega t}</code> is still there, but now riding on top of a real damping envelope. The combined kernel <code>e^{-(\\sigma + i\\omega) t} = e^{-st}</code> with the <strong>complex frequency</strong> <code>s = \\sigma + i\\omega</code> is what makes the whole thing converge.</p>

<div class="l-note"><strong>One sentence:</strong> Laplace is Fourier on signals that start at t = 0, with a real damping knob bolted on so the integral converges even for explosive growth.</div>

<h2 class="lesson-title">2. The Laplace Transform Definition</h2>

<div class="calc-formula"><div class="formula-label">DEFINITION: ONE-SIDED LAPLACE TRANSFORM</div><div class="formula-main">$$F(s) = \\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} f(t)\\, e^{-st}\\, dt, \\qquad s = \\sigma + i\\omega \\in \\mathbb{C}$$</div><div class="formula-sub">Integrate from 0 to infinity. s is complex. The real part sigma damps growth; the imaginary part i omega does the spectral analysis.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The integral</div><div class="card-body">A single number for each value of s. Run f(t) against the test kernel e^{-st} and report the area.</div></div>
<div class="calc-card"><div class="card-title">sigma (real part)</div><div class="card-body">Exponential damping. Bigger sigma kills off bigger growth in f(t). The minimum sigma that makes the integral converge defines the ROC.</div></div>
<div class="calc-card"><div class="card-title">omega (imag part)</div><div class="card-body">Frequency probe — exactly like Fourier. Picks out how much f(t) oscillates at angular frequency omega.</div></div>
<div class="calc-card"><div class="card-title">F(s)</div><div class="card-body">A complex-valued function of a complex variable. Lives on the s-plane. Its poles and zeros tell you everything about the underlying system.</div></div>
</div>

<p class="l-text"><strong>Region of Convergence (ROC).</strong> The integral converges only for some values of s — specifically those whose real part is large enough to dominate any growth in f(t). For <code>f(t) = e^{at}</code> the integral <code>\\int_0^\\infty e^{(a-s)t} dt</code> converges only when <code>\\Re(s) &gt; a</code>. The set of s for which F(s) exists is the ROC. For one-sided Laplace transforms the ROC is always a half-plane <code>\\Re(s) &gt; \\sigma_0</code> to the right of some abscissa.</p>

<div class="calc-graph"><div id="plot-l6-roc-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the complex s-plane for f(t) = e^{-2t}. The pole sits at s = -2 (red dot). The ROC is the entire half-plane <em>Re(s) &gt; -2</em> (blue shaded region). Any s strictly to the right of the vertical dashed line gives a convergent integral; any s on or to the left of it does not.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=-50;i<=50;i++){for(var j=-50;j<=50;j++){xs.push(i/10);ys.push(j/10);zs.push(i/10>-2?1:0);}}
var heat={x:xs,y:ys,z:zs,type:'histogram2d',colorscale:[[0,'rgba(0,0,0,0)'],[0.5,'rgba(59,130,246,0.18)'],[1,'rgba(59,130,246,0.35)']],showscale:false,nbinsx:100,nbinsy:100};
var pole={x:[-2],y:[0],mode:'markers+text',name:'pole at s=-2',marker:{symbol:'x',size:16,color:'#f87171',line:{width:3}},text:['pole'],textposition:'top right',textfont:{color:'#f87171'}};
var line={x:[-2,-2],y:[-5,5],mode:'lines',name:'Re(s) = -2',line:{color:'#f87171',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(s) = sigma',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-5,5]},yaxis:{title:'Im(s) = omega',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-5,5],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:2.5,y:3.5,text:'ROC: Re(s) > -2',showarrow:false,font:{color:'#3b82f6',size:13}}]};
Plotly.newPlot('plot-l6-roc-en',[heat,line,pole],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Practical note:</strong> in 95% of engineering work the ROC is taken for granted — we just write F(s) and assume Re(s) is wherever it needs to be. ROC matters mainly when inverting non-causal or two-sided transforms, or when proving stability theorems rigorously.</div>

<h2 class="lesson-title">3. The Connection to Fourier</h2>

<div class="calc-highlight"><strong>Crucial picture:</strong> the Fourier transform of a causal signal lives on a single vertical line of the s-plane — the imaginary axis <code>s = i\\omega</code>. The Laplace transform lives on the whole right half-plane. Laplace is therefore a strict generalization: slide your evaluation point from anywhere in the s-plane onto the imaginary axis, and you recover Fourier.</div>

<p class="l-text">Set <code>\\sigma = 0</code> in the definition. Then <code>s = i\\omega</code> and</p>

<div class="calc-formula"><div class="formula-label">FOURIER AS A SLICE OF LAPLACE</div><div class="formula-main">$$F(i\\omega) = \\int_{0}^{\\infty} f(t)\\, e^{-i\\omega t}\\, dt$$</div><div class="formula-sub">This is the Fourier transform of f(t) restricted to t &gt; 0 — provided the integral converges, i.e., provided the imaginary axis sits inside the ROC.</div></div>

<p class="l-text">So if a system's transfer function <code>H(s)</code> has no poles on or to the right of the imaginary axis, then evaluating <code>H(i\\omega)</code> gives the frequency response — exactly what a Bode plot displays. We will exploit this in section 9 when we read the magnitude and phase response of an RC filter directly from its Laplace transfer function.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fourier exists</div><div class="card-body">Imaginary axis inside ROC. The signal is stable and its spectrum makes sense. Set s = i omega and you are done.</div></div>
<div class="calc-card"><div class="card-title">Fourier diverges</div><div class="card-body">Imaginary axis outside ROC. Signal grows or never decays. Laplace still works — Fourier is silent.</div></div>
<div class="calc-card"><div class="card-title">Causal signal</div><div class="card-body">f(t) = 0 for t &lt; 0. Both transforms agree where they both exist. This is the engineering case.</div></div>
</div>

<h2 class="lesson-title">4. Worked Examples — Five Transforms You Must Know</h2>

<p class="l-text">Five transforms appear over and over. Compute them once from the definition and put them in a table you can grab without thinking.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.1 Constant: f(t) = 1</h3>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write the integral</div><div class="step-detail">F(s) = integral from 0 to infinity of 1 * e^{-st} dt.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Compute the antiderivative</div><div class="step-detail">Antiderivative of e^{-st} with respect to t is -e^{-st}/s.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Evaluate at the limits</div><div class="step-detail">At t = infinity (with Re(s) &gt; 0): e^{-st} -&gt; 0. At t = 0: e^{0} = 1. Result: 0 - (-1/s) = 1/s.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">RESULT 1</div><div class="formula-main">$$\\mathcal{L}\\{1\\} = \\frac{1}{s}, \\qquad \\Re(s) > 0$$</div><div class="formula-sub">The Heaviside step u(t) has the same transform (since u(t) = 1 for all t in the integration range).</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.2 Exponential: f(t) = e^{-at}</h3>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Combine exponentials</div><div class="step-detail">F(s) = integral of e^{-at} e^{-st} dt = integral of e^{-(s+a)t} dt.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Antiderivative</div><div class="step-detail">-e^{-(s+a)t} / (s+a).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Limits (Re(s) &gt; -a so the upper limit dies)</div><div class="step-detail">0 - (-1/(s+a)) = 1/(s+a).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">RESULT 2</div><div class="formula-main">$$\\mathcal{L}\\{e^{-at}\\} = \\frac{1}{s+a}, \\qquad \\Re(s) > -a$$</div><div class="formula-sub">The pole moves to s = -a. If a &gt; 0 the pole is in the left half-plane (decay). If a &lt; 0 the pole is in the right half-plane (growth).</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.3 Sine: f(t) = sin(omega t)</h3>

<p class="l-text">Use the Euler identity <code>\\sin(\\omega t) = (e^{i\\omega t} - e^{-i\\omega t})/(2i)</code> and apply linearity plus the previous result twice (with <code>a = -i\\omega</code> and <code>a = i\\omega</code>):</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Linearity</div><div class="step-detail">F(s) = (1/(2i)) * [L{e^{i omega t}} - L{e^{-i omega t}}] = (1/(2i)) * [1/(s - i omega) - 1/(s + i omega)].</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Common denominator</div><div class="step-detail">Difference = [(s + i omega) - (s - i omega)] / [(s)^2 - (i omega)^2] = (2 i omega) / (s^2 + omega^2).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Cancel 2i in numerator and denominator</div><div class="step-detail">F(s) = omega / (s^2 + omega^2).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">RESULT 3</div><div class="formula-main">$$\\mathcal{L}\\{\\sin(\\omega t)\\} = \\frac{\\omega}{s^{2} + \\omega^{2}}$$</div><div class="formula-sub">Two complex-conjugate poles at s = +/- i omega — on the imaginary axis, exactly where a steady oscillation lives.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.4 Cosine: f(t) = cos(omega t)</h3>

<p class="l-text">Same Euler trick with <code>\\cos(\\omega t) = (e^{i\\omega t} + e^{-i\\omega t})/2</code>:</p>

<div class="calc-formula"><div class="formula-label">RESULT 4</div><div class="formula-main">$$\\mathcal{L}\\{\\cos(\\omega t)\\} = \\frac{s}{s^{2} + \\omega^{2}}$$</div><div class="formula-sub">Same poles as sine; only the numerator differs. Sine and cosine share spectral support but have a 90 degree phase relationship — Laplace records this in the s in the numerator.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.5 Dirac delta: f(t) = delta(t)</h3>

<p class="l-text">By the sifting property of the delta function, <code>\\int_{0}^{\\infty} \\delta(t) g(t) dt = g(0)</code> for any continuous g. Take <code>g(t) = e^{-st}</code> with <code>g(0) = 1</code>:</p>

<div class="calc-formula"><div class="formula-label">RESULT 5</div><div class="formula-main">$$\\mathcal{L}\\{\\delta(t)\\} = 1$$</div><div class="formula-sub">A pure impulse contains every frequency in equal measure — its Laplace transform is the constant 1. This is why the impulse response of a system <em>is</em> its transfer function in disguise.</div></div>

<div class="l-note"><strong>Tabular memory aid:</strong> 1 -&gt; 1/s. e^{-at} -&gt; 1/(s+a). sin -&gt; omega/(s^2+omega^2). cos -&gt; s/(s^2+omega^2). delta -&gt; 1. Memorize these five and you can derive most of an undergraduate Laplace table by combining them with the properties of section 5.</div>

<h2 class="lesson-title">5. Key Properties</h2>

<p class="l-text">These are the rules you actually use in practice. Each one converts an annoying time-domain operation (derivative, integral, time-shift) into a clean algebraic operation in the s-domain. The big one is property 4 — turning differentiation into multiplication.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Linearity</div><div class="card-body">L{a f + b g} = a F(s) + b G(s). Constants and sums fall straight through.</div><div class="card-formula">af + bg -> aF + bG</div></div>
<div class="calc-card"><div class="card-title">2. Time shift</div><div class="card-body">L{f(t - a) u(t - a)} = e^{-as} F(s). A delay in time becomes a complex exponential factor in s. This is the workhorse for systems with dead time.</div><div class="card-formula">f(t-a)u(t-a) -> e^{-as} F(s)</div></div>
<div class="calc-card"><div class="card-title">3. Frequency shift</div><div class="card-body">L{e^{at} f(t)} = F(s - a). Multiplication by an exponential in time becomes a shift of the argument in s.</div><div class="card-formula">e^{at}f(t) -> F(s-a)</div></div>
<div class="calc-card"><div class="card-title">4. Differentiation in time</div><div class="card-body">L{f'(t)} = s F(s) - f(0). And L{f''(t)} = s^2 F(s) - s f(0) - f'(0). This is the property. ODEs become algebra.</div><div class="card-formula">f' -> sF - f(0)</div></div>
<div class="calc-card"><div class="card-title">5. Integration in time</div><div class="card-body">L{integral from 0 to t of f(tau) d tau} = F(s)/s. Division by s is integration. Multiplication by s is differentiation. s acts like d/dt.</div><div class="card-formula">int f -> F/s</div></div>
<div class="calc-card"><div class="card-title">6. Initial Value Theorem</div><div class="card-body">f(0+) = lim as s -> infinity of s F(s). Reads off the initial value of f(t) directly from F(s) without inverting.</div><div class="card-formula">f(0+) = lim sF(s)</div></div>
<div class="calc-card"><div class="card-title">7. Final Value Theorem</div><div class="card-body">f(infinity) = lim as s -> 0 of s F(s), provided the limit exists (all poles of sF in the open left half-plane, allow at most a single pole at s = 0). Steady-state response without inverting.</div><div class="card-formula">f(inf) = lim sF(s)</div></div>
<div class="calc-card"><div class="card-title">8. Convolution</div><div class="card-body">L{(f * g)(t)} = F(s) G(s). The single most important fact for linear systems — output = input * impulse response in time becomes simple multiplication in s.</div><div class="card-formula">f*g -> F * G</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PROPERTY 4 PROOF (THE KILLER FEATURE)</div><div class="formula-main">$$\\mathcal{L}\\{f'(t)\\} = \\int_{0}^{\\infty} f'(t)\\, e^{-st}\\, dt \\stackrel{\\text{IBP}}{=} \\bigl[f(t)\\, e^{-st}\\bigr]_{0}^{\\infty} + s \\int_{0}^{\\infty} f(t)\\, e^{-st}\\, dt = -f(0) + s\\, F(s)$$</div><div class="formula-sub">Integration by parts with u = e^{-st}, dv = f'(t) dt. The boundary term at infinity vanishes (Re(s) inside ROC), at zero gives -f(0). Repeating once more gives the formula for f''.</div></div>

<div class="calc-example"><div class="example-label">WHY THIS MATTERS</div><div class="example-body"><strong>An ODE like</strong> y'' + 3 y' + 2 y = e^{-t} <strong>with initial conditions y(0), y'(0)</strong> becomes, under Laplace, an algebraic equation in Y(s):<br><br>[s^2 Y(s) - s y(0) - y'(0)] + 3[s Y(s) - y(0)] + 2 Y(s) = 1/(s + 1).<br><br>No derivatives. No initial-condition trickery. The initial conditions are <em>already inside</em> the algebraic equation. We solve for Y(s) by ordinary algebra and then invert. That is the entire pedagogical promise of Laplace, and we will cash it in next section.</div></div>

<h2 class="lesson-title">6. Solving an ODE with Laplace — Worked Problem</h2>

<div class="calc-highlight"><strong>This is the moment Laplace earns its place in your toolkit.</strong> We will solve a real second-order ODE end-to-end: take Laplace of both sides, solve algebraically for Y(s), split into partial fractions, look each fragment up in the table, and read off y(t). Compare with the classical homogeneous + particular method to see how much bookkeeping Laplace eliminates.</div>

<div class="calc-formula"><div class="formula-label">THE PROBLEM</div><div class="formula-main">$$y'' + 3 y' + 2 y = e^{-t}, \\qquad y(0) = 0, \\quad y'(0) = 1$$</div><div class="formula-sub">A linear second-order ODE with constant coefficients, a forcing term, and explicit initial conditions. The standard "spring with friction kicked by a fading impulse" problem.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Apply Laplace to both sides</div><div class="step-detail">Using L{y''} = s^2 Y(s) - s y(0) - y'(0) and L{y'} = s Y(s) - y(0): [s^2 Y - s(0) - 1] + 3[s Y - 0] + 2 Y = 1/(s + 1).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Collect Y(s)</div><div class="step-detail">(s^2 + 3 s + 2) Y(s) - 1 = 1/(s + 1) so (s^2 + 3 s + 2) Y(s) = 1 + 1/(s + 1) = (s + 2)/(s + 1).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Factor the characteristic polynomial</div><div class="step-detail">s^2 + 3 s + 2 = (s + 1)(s + 2). Therefore Y(s) = (s + 2) / [(s + 1)(s + 1)(s + 2)] = 1 / (s + 1)^2.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Invert from the table</div><div class="step-detail">L{t e^{-at}} = 1/(s + a)^2 (a frequency-shift of L{t} = 1/s^2). With a = 1, we get y(t) = t e^{-t}.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">SOLUTION</div><div class="formula-main">$$y(t) = t\\, e^{-t}, \\qquad t \\ge 0$$</div><div class="formula-sub">Initial conditions y(0) = 0 and y'(0) = 1 are baked in — no constants of integration to chase, no system of equations to solve. Verify by hand: y(0) = 0, y'(t) = (1-t) e^{-t} so y'(0) = 1. Plug back into the ODE: y'' + 3 y' + 2 y simplifies exactly to e^{-t}.</div></div>

<p class="l-text"><strong>Comparison with the classical method.</strong> The homogeneous solution requires solving the characteristic equation r^2 + 3 r + 2 = 0, getting r = -1, -2, writing y_h = A e^{-t} + B e^{-2t}. The particular solution requires noticing that the forcing e^{-t} hits the homogeneous solution and we must multiply by t — guess y_p = C t e^{-t}, plug in, find C = 1. Apply initial conditions to the sum, solve a 2x2 system. The arithmetic is fine, but the bookkeeping is real. Laplace did all of it inside one algebraic line.</p>

<div class="calc-graph"><div id="plot-l6-ode-en" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the solution y(t) = t e^{-t}. It starts at zero (matching y(0) = 0), shoots up with initial slope 1 (matching y'(0) = 1), peaks at t = 1 with y = 1/e ~ 0.368, then decays exponentially. The decay rate is set by the slowest pole of Y(s), which lives at s = -1 (double pole).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],y=[];
for(var i=0;i<=600;i++){var x=i/100;t.push(x);y.push(x*Math.exp(-x));}
var d={x:t,y:y,mode:'lines',name:'y(t) = t e^{-t}',line:{color:'#3b82f6',width:2.6}};
var peak={x:[1],y:[Math.exp(-1)],mode:'markers',name:'peak at t=1',marker:{size:10,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-ode-en',[d,peak],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pattern.</strong> Every linear ODE with constant coefficients and a Laplace-able forcing function follows the same recipe: (1) transform both sides, (2) solve algebraically, (3) partial-fraction decompose, (4) read each piece off the inverse table. The complicated-looking ODE in time is just polynomial algebra in s.</div>

<h2 class="lesson-title">7. Transfer Functions and Block Diagrams</h2>

<div class="calc-highlight"><strong>The transfer function is the system's DNA.</strong> Once you have it, the entire input-output behaviour is fixed. Every other engineering claim about the system — stability, frequency response, settling time, resonance — can be read off the transfer function with no further calculation.</div>

<p class="l-text">For a linear time-invariant (LTI) system with input <code>x(t)</code> and output <code>y(t)</code>, all initial conditions taken as zero, the <strong>transfer function</strong> is defined as the ratio of the output Laplace transform to the input Laplace transform:</p>

<div class="calc-formula"><div class="formula-label">TRANSFER FUNCTION</div><div class="formula-main">$$H(s) = \\frac{Y(s)}{X(s)}$$</div><div class="formula-sub">A ratio of polynomials in s for any system described by a finite-order linear ODE. The roots of the numerator are the zeros; the roots of the denominator are the poles.</div></div>

<p class="l-text">Three rules cover almost every block-diagram manipulation you will ever do:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Series connection</div><div class="card-body">Two systems H1 and H2 cascaded: overall H = H1 * H2. The signal feels each one in turn; their effects multiply in s.</div><div class="card-formula">H = H1 H2</div></div>
<div class="calc-card"><div class="card-title">Parallel connection</div><div class="card-body">Two systems on parallel paths added at the output: H = H1 + H2. Linear superposition becomes addition in s.</div><div class="card-formula">H = H1 + H2</div></div>
<div class="calc-card"><div class="card-title">Negative feedback</div><div class="card-body">Forward path G in a loop with feedback path H: closed-loop transfer = G / (1 + G H). The denominator 1 + GH is the loop gain — its roots are the closed-loop poles, the most-watched object in control theory.</div><div class="card-formula">G/(1+GH)</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: PROPORTIONAL FEEDBACK ON A FIRST-ORDER PLANT</div><div class="example-body"><strong>Plant:</strong> G(s) = 1/(s + 1) (a simple lag).<br><strong>Controller:</strong> H = K (a proportional gain).<br><strong>Closed-loop transfer:</strong><br><br>T(s) = G/(1 + G H) = (1/(s + 1)) / (1 + K/(s + 1)) = 1/(s + 1 + K).<br><br>The closed-loop pole moved from s = -1 to s = -(1 + K). Larger K pushes the pole further into the left half-plane — faster response, more stable. This is the basic miracle of feedback: a knob K that sweeps the pole around.</div></div>

<h2 class="lesson-title">8. Poles, Zeros, and Stability</h2>

<div class="calc-highlight"><strong>The complete stability test:</strong> all poles of H(s) in the open left half-plane <em>iff</em> the system is BIBO stable. Right half-plane pole? Some bounded input produces an unbounded output — the system explodes. Pole exactly on the imaginary axis? Marginally stable: it neither decays nor explodes, it oscillates forever (or, if at the origin, it integrates a constant).</div>

<p class="l-text">A first-order pole at <code>s = -a</code> contributes a term <code>A e^{-at}</code> to the time-domain response. Each pole therefore controls a single exponential mode. The map between pole location and time-domain shape is simple:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real pole at s = -a (a &gt; 0)</div><div class="card-body">Pure exponential decay e^{-at}. Larger a -&gt; faster decay. This is what you want for stable, well-damped systems.</div></div>
<div class="calc-card"><div class="card-title">Real pole at s = +a (a &gt; 0)</div><div class="card-body">Exponential growth e^{at}. Catastrophic. Means the system is unstable — any tiny disturbance blows up.</div></div>
<div class="calc-card"><div class="card-title">Complex conjugate pair at s = -alpha +/- i omega_d</div><div class="card-body">Damped oscillation e^{-alpha t} sin(omega_d t). The real part -alpha sets the decay envelope; the imaginary part omega_d sets the oscillation frequency.</div></div>
<div class="calc-card"><div class="card-title">Pair on the imaginary axis at +/- i omega_0</div><div class="card-body">Pure sinusoid sin(omega_0 t) — undamped oscillation forever. Marginally stable. A lossless LC tank or an undamped harmonic oscillator.</div></div>
<div class="calc-card"><div class="card-title">Pole at the origin s = 0</div><div class="card-body">Integrator. Input a constant, output ramps. Marginally stable on the edge between decay and growth.</div></div>
<div class="calc-card"><div class="card-title">Complex pair in right half-plane</div><div class="card-body">Growing oscillation e^{+alpha t} sin(omega t). The kind of failure mode that makes structures shake themselves apart.</div></div>
</div>

<div class="calc-graph"><div id="plot-l6-poles-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the s-plane with six pole configurations colour-coded. Open left half-plane = stable (blue). Imaginary axis = marginally stable (amber). Open right half-plane = unstable (red). The vertical line Re(s) = 0 is the stability boundary that decides everything.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var stable={x:[-3,-2,-1.5,-1.5],y:[0,0,2,-2],mode:'markers',name:'stable (LHP)',marker:{symbol:'x',size:14,color:'#3b82f6',line:{width:3}}};
var imag={x:[0,0],y:[1.5,-1.5],mode:'markers',name:'marginal (imag axis)',marker:{symbol:'x',size:14,color:'#f59e0b',line:{width:3}}};
var unstable={x:[1,2,1.5,1.5],y:[0,0,2,-2],mode:'markers',name:'unstable (RHP)',marker:{symbol:'x',size:14,color:'#f87171',line:{width:3}}};
var axis={x:[0,0],y:[-4,4],mode:'lines',line:{color:'#888',width:2,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-4,4]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-2.7,y:3,text:'STABLE',showarrow:false,font:{color:'#3b82f6',size:12}},{x:2.7,y:3,text:'UNSTABLE',showarrow:false,font:{color:'#f87171',size:12}}]};
Plotly.newPlot('plot-l6-poles-en',[axis,stable,imag,unstable],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l6-step-resp-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> step responses of a standard second-order system <code>omega_n^2 / (s^2 + 2 zeta omega_n s + omega_n^2)</code> with omega_n = 1 and four damping ratios. zeta = 0.2 (heavy oscillation overshoot), zeta = 0.7 (good engineering target: small overshoot, fast settle), zeta = 1 (critically damped, no overshoot at all), zeta = 2 (overdamped, slow). Tuning a controller is largely a hunt for the right zeta.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/40);
function step(z){
  var wn=1;
  var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i];
    var y;
    if(z<1){var wd=wn*Math.sqrt(1-z*z);y=1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z/Math.sqrt(1-z*z))*Math.sin(wd*x));}
    else if(z===1){y=1-Math.exp(-wn*x)*(1+wn*x);}
    else{var r1=-wn*(z-Math.sqrt(z*z-1));var r2=-wn*(z+Math.sqrt(z*z-1));y=1-(r2*Math.exp(r1*x)-r1*Math.exp(r2*x))/(r2-r1);}
    out.push(y);
  }
  return out;
}
var d1={x:t,y:step(0.2),mode:'lines',name:'zeta=0.2 (underdamped)',line:{color:'#f87171',width:2.4}};
var d2={x:t,y:step(0.7),mode:'lines',name:'zeta=0.7',line:{color:'#3b82f6',width:2.4}};
var d3={x:t,y:step(1.0),mode:'lines',name:'zeta=1 (critical)',line:{color:'#10b981',width:2.4}};
var d4={x:t,y:step(2.0),mode:'lines',name:'zeta=2 (overdamped)',line:{color:'#f59e0b',width:2.4,dash:'dot'}};
var target={x:[0,10],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'response',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-step-resp-en',[target,d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Engineering rule of thumb:</strong> <code>zeta = 0.7</code> is a commonly chosen sweet spot. About 4-5% overshoot, fast settle, no excessive oscillation. The Butterworth filter places its poles at exactly this damping.</div>

<h2 class="lesson-title">9. RC Circuit — The Canonical First-Order System</h2>

<div class="calc-highlight"><strong>Picture a resistor R in series with a capacitor C, driven by an input voltage <code>V_{in}(t)</code>, with output <code>V_{out}(t)</code> measured across the capacitor.</strong> This is the simplest non-trivial dynamical system in all of electronics — and its transfer function is one line.</div>

<p class="l-text">Kirchhoff's voltage law plus the capacitor relation <code>i = C \\, dV_{out}/dt</code> give the ODE</p>

<div class="calc-formula"><div class="formula-label">RC CIRCUIT ODE</div><div class="formula-main">$$R\\, C\\, \\frac{dV_{out}}{dt} + V_{out}(t) = V_{in}(t)$$</div><div class="formula-sub">A first-order linear ODE with time constant tau = R C. Driven by V_in, observed at V_out.</div></div>

<p class="l-text">Take Laplace of both sides with <code>V_{out}(0) = 0</code> (capacitor uncharged at start):</p>

<div class="calc-formula"><div class="formula-label">TRANSFER FUNCTION OF AN RC LOW-PASS</div><div class="formula-main">$$H(s) = \\frac{V_{out}(s)}{V_{in}(s)} = \\frac{1}{1 + s R C} = \\frac{1/(RC)}{s + 1/(RC)}$$</div><div class="formula-sub">A single pole at s = -1/(RC). Everything else about the circuit's behaviour follows.</div></div>

<p class="l-text"><strong>Step response.</strong> Feed in a unit step <code>V_{in}(t) = u(t)</code>, so <code>V_{in}(s) = 1/s</code>. Then</p>

<div class="calc-formula"><div class="formula-label">STEP RESPONSE OF RC LOW-PASS</div><div class="formula-main">$$V_{out}(s) = \\frac{1}{s(1 + sRC)} = \\frac{1}{s} - \\frac{1}{s + 1/(RC)} \\implies V_{out}(t) = 1 - e^{-t/(RC)}$$</div><div class="formula-sub">Partial fractions, then table lookup. The classic exponential charge-up curve everyone has seen on an oscilloscope.</div></div>

<p class="l-text"><strong>Frequency response.</strong> Set <code>s = i\\omega</code>:</p>

<div class="calc-formula"><div class="formula-label">FREQUENCY RESPONSE</div><div class="formula-main">$$H(i\\omega) = \\frac{1}{1 + i\\omega RC}, \\qquad |H(i\\omega)| = \\frac{1}{\\sqrt{1 + (\\omega R C)^{2}}}$$</div><div class="formula-sub">Magnitude is 1 at omega = 0 and rolls off as omega grows. The -3 dB cutoff sits at omega_c = 1/(RC).</div></div>

<div class="calc-graph"><div id="plot-l6-bode-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Bode plot of an RC low-pass with R = 1 kohm, C = 1 microF, so omega_c = 1/(RC) = 1000 rad/s. Magnitude (top) is flat in the passband, drops at 20 dB/decade after the corner. Phase (bottom) starts at 0, hits -45 degrees exactly at omega_c, and asymptotes at -90 degrees. The same shape, scaled, appears in every first-order system in engineering.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,1+i*4/400));
var mag=[],ph=[];var RC=1e-3;
for(var i=0;i<w.length;i++){var ww=w[i];var m=20*Math.log10(1/Math.sqrt(1+(ww*RC)*(ww*RC)));mag.push(m);ph.push(-180/Math.PI*Math.atan(ww*RC));}
var d1={x:w,y:mag,mode:'lines',name:'|H(j omega)| (dB)',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var d2={x:w,y:ph,mode:'lines',name:'phase (deg)',line:{color:'#f59e0b',width:2.4},xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'magnitude (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'phase (deg)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-bode-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this matters in practice:</strong> if you ever need a 1-pole low-pass filter — to clean up a sensor reading, to smooth a control signal, to do basic anti-aliasing — the formulas above are the entire design. Pick R and C so 1/(RC) sits at your desired cutoff. That's it. The lesson exercise in section 12 lets you do exactly this in Python.</div>

<h2 class="lesson-title">10. RLC Circuit — Resonance and the Second-Order Standard Form</h2>

<div class="calc-highlight"><strong>Add an inductor L to the RC circuit and a richer story opens up.</strong> The system is now second-order. It can oscillate. It can resonate at a specific frequency. The damping ratio tells you whether energy bleeds out smoothly, rings like a bell, or struggles to start.</div>

<p class="l-text">Consider an RLC series circuit driven by V_in, with V_out measured across the capacitor. Kirchhoff and the element laws give</p>

<div class="calc-formula"><div class="formula-label">RLC ODE</div><div class="formula-main">$$L\\,C\\,\\frac{d^{2}V_{out}}{dt^{2}} + R\\,C\\,\\frac{dV_{out}}{dt} + V_{out}(t) = V_{in}(t)$$</div><div class="formula-sub">A second-order linear ODE — the textbook companion to mass-spring-damper and to every other resonant physical system.</div></div>

<p class="l-text">Laplace with zero initial conditions yields</p>

<div class="calc-formula"><div class="formula-label">RLC TRANSFER FUNCTION (CANONICAL FORM)</div><div class="formula-main">$$H(s) = \\frac{1}{L\\,C\\,s^{2} + R\\,C\\,s + 1} = \\frac{\\omega_{n}^{2}}{s^{2} + 2\\,\\zeta\\,\\omega_{n}\\,s + \\omega_{n}^{2}}$$</div><div class="formula-sub">Standard second-order form. Natural frequency omega_n = 1/sqrt(LC). Damping ratio zeta = (R/2) sqrt(C/L).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Natural frequency omega_n</div><div class="card-body">The frequency at which an undamped (R = 0) system would oscillate forever. Set entirely by L and C. omega_n = 1/sqrt(L C).</div></div>
<div class="calc-card"><div class="card-title">Damping ratio zeta</div><div class="card-body">Dimensionless number telling you how oscillatory the system is. zeta = 0 lossless, zeta = 1 critically damped, zeta &gt; 1 overdamped.</div></div>
<div class="calc-card"><div class="card-title">Damped frequency omega_d</div><div class="card-body">The actual ringing frequency seen in an underdamped step response: omega_d = omega_n sqrt(1 - zeta^2). Slightly lower than omega_n.</div></div>
<div class="calc-card"><div class="card-title">Poles</div><div class="card-body">s = -zeta omega_n +/- i omega_d for zeta &lt; 1 (complex pair, oscillation). s = -omega_n (double real, critical damping) for zeta = 1. Two distinct negative reals for zeta &gt; 1.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Design an RLC circuit with omega_n = 1000 rad/s and zeta = 0.5.</strong><br><br>Pick L = 10 mH. Then C = 1/(L omega_n^2) = 1/(0.01 * 10^6) = 100 nF.<br>R = 2 zeta sqrt(L/C) = 2 * 0.5 * sqrt(0.01/1e-7) = 1 * sqrt(10^5) = 316 ohm.<br><br>This gives an underdamped second-order low-pass with a resonant peak in its frequency response near 1000 rad/s. Tune zeta toward 0 for a sharper peak, toward 1 to flatten it out.</div></div>

<div class="calc-graph"><div id="plot-l6-rlc-resp-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the time-domain step response of an RLC circuit at zeta = 0.15 (lightly damped) with omega_n = 1 rad/s. The output overshoots well past 1, oscillates with frequency very close to omega_n, and slowly decays under the envelope e^{-zeta omega_n t}. This is the canonical "ringing" you see on every digital trace that hits an unterminated cable.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=500;i++)t.push(i/15);
var z=0.15,wn=1;var wd=wn*Math.sqrt(1-z*z);
var y=[],env_up=[],env_dn=[];
for(var i=0;i<t.length;i++){var x=t[i];var val=1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z/Math.sqrt(1-z*z))*Math.sin(wd*x));y.push(val);env_up.push(1+Math.exp(-z*wn*x)/Math.sqrt(1-z*z));env_dn.push(1-Math.exp(-z*wn*x)/Math.sqrt(1-z*z));}
var d={x:t,y:y,mode:'lines',name:'V_out(t)',line:{color:'#3b82f6',width:2.4}};
var eu={x:t,y:env_up,mode:'lines',name:'decay envelope',line:{color:'#f87171',width:1.5,dash:'dash'}};
var ed={x:t,y:env_dn,mode:'lines',line:{color:'#f87171',width:1.5,dash:'dash'},showlegend:false};
var target={x:[0,35],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'V_out',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,2.5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-rlc-resp-en',[target,eu,ed,d],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. (Optional) Brushing Against Modern AI: Neural ODEs</h2>

<p class="l-text">The honest answer is that Laplace transforms do <strong>not</strong> appear inside modern deep-learning training loops. Backprop, optimizers, gradient flow — none of them require Laplace. So why mention it here at all?</p>

<p class="l-text">Because of one small but important corner of modern ML: <strong>continuous-time models</strong>. Neural ODEs (Chen, Rubanova, Bettencourt, Duvenaud, 2018) treat a deep network's evolution as a continuous dynamical system <code>dz/dt = f(z, t, \\theta)</code> instead of a discrete sequence of layers. Continuous normalizing flows, neural CDEs, latent ODE generative models, and the recent state-space sequence models (S4, Mamba) all share this DNA: a learned ODE you integrate forward in time. The classical questions about such systems — when do they have bounded outputs, when do they have stable fixed points, how do they respond to step inputs — are answered with the same Laplace / pole-placement machinery that this lesson has built. So while Laplace is not your everyday training tool, it is the right vocabulary for analyzing the <em>dynamical</em> behaviour of any continuous-time neural model. Treat this lesson as the bridge to that small but growing literature.</p>

<div class="l-note"><strong>One paragraph, no more.</strong> Don't go telling people that Laplace transforms power transformers (the neural-network kind). They don't. Laplace's true home remains control theory, signal processing, circuit analysis, and continuous-time physics. Use it there with confidence.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Things to try.</strong> Build a second-order system with <code>num = [1]</code>, <code>den = [1, 0.4, 1]</code> and watch the step response ring at omega_n = 1 rad/s with zeta = 0.2. Change the middle coefficient to 1.4 and the ringing disappears (zeta = 0.7 — the engineering sweet spot). Set it to 2 and the response becomes overdamped. The arithmetic from section 10 is right there in three lines of Python.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">Laplace generalizes Fourier by integrating from 0 to infinity against the complex kernel e^{-st}. The real part of s damps growth, the imaginary part probes frequency. Five transforms cover most needs: 1 -&gt; 1/s, e^{-at} -&gt; 1/(s+a), sin -&gt; omega/(s^2+omega^2), cos -&gt; s/(s^2+omega^2), delta -&gt; 1. The differentiation property L{f'} = sF(s) - f(0) is the entire reason ODEs become algebra; a single example (y'' + 3 y' + 2 y = e^{-t}, y(0) = 0, y'(0) = 1, solution y = t e^{-t}) shows the workflow end-to-end. Transfer functions and pole-zero diagrams condense system behaviour into a picture you can read at a glance: left half-plane is stable, right half-plane is unstable, imaginary axis is the borderline of oscillation. The RC low-pass (one pole at -1/(RC)) and the standard second-order RLC system (parametrised by omega_n and zeta) are the two structures that appear in nearly every signal-conditioning problem in engineering. Modern AI mostly leaves Laplace alone — the small exception is the dynamical-systems framing of Neural ODEs and continuous-time state-space models, where Laplace gives you back the right vocabulary for stability analysis. The next lesson generalizes again to the <strong>Z-transform</strong>, Laplace's discrete-time counterpart and the engine behind all digital filters and discrete-time control.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Laplace dönüşümü, Fourier'in daha geniş ve daha pratik kuzenidir.</strong> Fourier dönüşümü sinyalinizin mutlak integrallenebilir olmasını — yani <code>\\int|f(t)|dt</code> integralinin sonlu olmasını — talep ederken, Laplace dönüşümü <em>büyüyen</em> sinyalleri, <em>t=0'da devreye giren</em> sinyalleri, <em>sıfırdan farklı başlangıç koşullarıyla</em> gelen sinyalleri sakin sakin işler. Klasik kontrol teorisinin iş atı, elektrik devrelerinin dili ve karşısına bir diferansiyel denklem çıktığında her makine mühendisinin başvurduğu standart araçtır.</p>

<p class="l-text">Bu ders bilinçli olarak klasik kalıyor. Diferansiyel denklemleri cebire çevirerek çözeceğiz. Karmaşık s-düzleminde kutuplar ve sıfırlar çizip kararlılığı bir bakışta okuyacağız. RC ve RLC devrelerini bir müzisyenin notayı okuduğu rahatlıkla analiz edeceğiz. Modern makine öğrenmesine dokunduğumuz tek nokta — Neural ODE'ler ve sürekli dinamik sistemler — sonda kısa bir paragraf olarak kalıyor. Laplace'ı eğitim döngünüzde aramayın; onu, verinin arkasında gerçek bir fiziksel sistem oturan her yerde bekleyin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Laplace dönüşümünün tanımını yazmak ve karmaşık değişken <em>s = sigma + i omega</em>'nın Fourier'in başarısız olduğu yerlerde neden iş gördüğünü açıklamak</li>
<li>Sabitin, üstelin, sinüsün, kosinüsün ve Dirac delta'sının Laplace dönüşümünü integralden hesaplamak</li>
<li>Türev özelliğini kullanarak sabit katsayılı her doğrusal ODE'yi basit bir cebirsel denkleme çevirmek</li>
<li>Başlangıç koşullu ikinci mertebeden bir ODE'yi Laplace, kısmi kesirler ve ters-dönüşüm tablosuyla baştan sona çözmek</li>
<li>Bir transfer fonksiyonunun kutup-sıfır diyagramını okuyarak kararlılığı, salınımı ve zaman cevabı şeklini tahmin etmek</li>
<li>RC alçak geçiren filtreyi ve standart ikinci mertebe RLC sistemini — sönüm oranı ve doğal frekans dahil — türetip yorumlamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Laplace? Fourier Yetmediğinde</h2>

<div class="calc-highlight"><strong>Günlük benzetme:</strong> Fourier, yalnızca <em>her zaman var olmuş</em> ve zamanın her iki ucunda sönen sinyaller üzerinde çalışan, kusursuz ayarlı bir spektrum analizörüdür. Laplace ise mühendisin multimetresidir — t = 0'da devreyi aç, geçici aşımı izle, üstel sönümü atlat ve ekrandaki her sayıyı yine de oku. Her ikisi de frekans içeriğini ölçer, ama Laplace sinyalin büyüyor, devreye giriyor ya da sıfırdan başlıyor olmasına aldırış etmez.</div>

<p class="l-text">Her Fourier integralinin arkasında sessizce dolaşan koşulu hatırlayın. <code>\\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt</code> integralinin yakınsaması için fonksiyonun <strong>mutlak integrallenebilir</strong> olması gerekir — gayri resmi söyleyişle sıfırın her iki yanında yeterince hızlı sönmesi gerekir. Şimdi bir mühendisin ya da fizikçinin laboratuvarda gerçekten karşılaştığı sinyalleri düşünün:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f(t) = e^{t}</div><div class="card-body">Üstel büyüme — kararsız bir yükselteçteki küçük bir bozulma, Geiger sayacında bir çığ. Fourier integrali anında ıraksar.</div></div>
<div class="calc-card"><div class="card-title">f(t) = u(t)</div><div class="card-body">Heaviside basamak — t = 0'da bir anahtarı aç, gerilim sonsuza dek açık kalır. Sönmediği için Fourier integrali olağan anlamda yoktur (yalnızca dağılım olarak).</div></div>
<div class="calc-card"><div class="card-title">Yalnızca t &gt; 0 için tanımlı f(t)</div><div class="card-body">Bir röle t = 0'da kapanır; önceden ne olduğunu hiç bilmedik. İntegrasyon bölgesinin yarısı tanımsız. Fourier ise tüm reel ekseni ister.</div></div>
<div class="calc-card"><div class="card-title">Başlangıç koşulları y(0), y'(0)</div><div class="card-body">"Yay 2 cm yer değiştirmiş, sıfır hızla bırakıldı." Fourier'in bunu yedirecek hazır bir mekanizması yoktur. Laplace ise koşulları cebirin içine koyar.</div></div>
</div>

<p class="l-text">Laplace dördünü de aynı anda iki şey yaparak çözer. Önce yalnızca <code>t = 0</code>'dan <code>\\infty</code>'a kadar integral alır — bu, hayatına belirli bir anda başlayan sistemler için biçilmiş kaftandır. İkincisi, integranda <code>f(t)</code>'deki büyümeyi ezecek kadar büyük bir reel sönüm faktörü <code>\\sigma</code> ile ek bir <code>e^{-\\sigma t}</code> üsteli çarpar. Fourier parçası <code>e^{-i\\omega t}</code> hâlâ oradadır, ama artık reel bir sönüm zarfının üzerine biniyordur. Birleşik çekirdek <code>e^{-(\\sigma + i\\omega) t} = e^{-st}</code> ve <strong>karmaşık frekans</strong> <code>s = \\sigma + i\\omega</code>, bütün işi yakınsak kılan şeydir.</p>

<div class="l-note"><strong>Tek cümlede:</strong> Laplace, t = 0'da başlayan sinyaller için Fourier'dir; üzerine sökülemeyecek büyümede bile integralin yakınsamasını sağlayan reel bir sönüm düğmesi vidalanmıştır.</div>

<h2 class="lesson-title">2. Laplace Dönüşümünün Tanımı</h2>

<div class="calc-formula"><div class="formula-label">TANIM: TEK TARAFLI LAPLACE DÖNÜŞÜMÜ</div><div class="formula-main">$$F(s) = \\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} f(t)\\, e^{-st}\\, dt, \\qquad s = \\sigma + i\\omega \\in \\mathbb{C}$$</div><div class="formula-sub">0'dan sonsuza integral alın. s karmaşıktır. Reel kısmı sigma büyümeyi söndürür; sanal kısmı i omega spektral analizi yapar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İntegral</div><div class="card-body">Her s değeri için tek bir sayı. f(t)'yi test çekirdeği e^{-st}'ye karşı çalıştırın ve alanı raporlayın.</div></div>
<div class="calc-card"><div class="card-title">sigma (reel kısım)</div><div class="card-body">Üstel sönüm. Daha büyük sigma, f(t)'deki daha büyük büyümeyi öldürür. İntegrali yakınsak yapan en küçük sigma ROC'yi tanımlar.</div></div>
<div class="calc-card"><div class="card-title">omega (sanal kısım)</div><div class="card-body">Frekans probu — tam olarak Fourier'deki gibi. f(t)'nin omega açısal frekansında ne kadar salındığını çeker.</div></div>
<div class="calc-card"><div class="card-title">F(s)</div><div class="card-body">Karmaşık değişkenli, karmaşık değerli bir fonksiyon. s-düzleminde yaşar. Kutupları ve sıfırları, altta yatan sistem hakkında her şeyi söyler.</div></div>
</div>

<p class="l-text"><strong>Yakınsaklık bölgesi (ROC).</strong> İntegral yalnızca bazı s değerleri için yakınsar — özellikle reel kısmı f(t)'deki büyümeyi domine edecek kadar büyük olanlar için. <code>f(t) = e^{at}</code> için <code>\\int_0^\\infty e^{(a-s)t} dt</code> integrali yalnızca <code>\\Re(s) &gt; a</code> olduğunda yakınsar. F(s)'in var olduğu s kümesi ROC'dir. Tek taraflı Laplace dönüşümlerinde ROC her zaman, bir apsisin sağında kalan <code>\\Re(s) &gt; \\sigma_0</code> yarı düzlemidir.</p>

<div class="calc-graph"><div id="plot-l6-roc-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> f(t) = e^{-2t} için karmaşık s-düzlemi. Kutup s = -2'de oturuyor (kırmızı işaret). ROC, tüm <em>Re(s) &gt; -2</em> yarı düzlemidir (mavi gölge bölge). Düşey kesik çizginin kesin sağındaki her s yakınsak integral verir; çizginin üzerindeki ya da solundaki hiçbir s vermez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=-50;i<=50;i++){for(var j=-50;j<=50;j++){xs.push(i/10);ys.push(j/10);zs.push(i/10>-2?1:0);}}
var heat={x:xs,y:ys,z:zs,type:'histogram2d',colorscale:[[0,'rgba(0,0,0,0)'],[0.5,'rgba(59,130,246,0.18)'],[1,'rgba(59,130,246,0.35)']],showscale:false,nbinsx:100,nbinsy:100};
var pole={x:[-2],y:[0],mode:'markers+text',name:'s=-2 kutbu',marker:{symbol:'x',size:16,color:'#f87171',line:{width:3}},text:['kutup'],textposition:'top right',textfont:{color:'#f87171'}};
var line={x:[-2,-2],y:[-5,5],mode:'lines',name:'Re(s) = -2',line:{color:'#f87171',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(s) = sigma',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-5,5]},yaxis:{title:'Im(s) = omega',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-5,5],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:2.5,y:3.5,text:'ROC: Re(s) > -2',showarrow:false,font:{color:'#3b82f6',size:13}}]};
Plotly.newPlot('plot-l6-roc-tr',[heat,line,pole],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pratik not:</strong> mühendislik işinin %95'inde ROC veri olarak alınır — F(s)'i yazar ve Re(s)'in olması gereken yerde olduğunu varsayarız. ROC, esas olarak nedensel olmayan ya da iki taraflı dönüşümleri terslemekte ya da kararlılık teoremlerini titizlikle ispatlamakta önem kazanır.</div>

<h2 class="lesson-title">3. Fourier ile Bağlantı</h2>

<div class="calc-highlight"><strong>Kritik resim:</strong> nedensel bir sinyalin Fourier dönüşümü, s-düzleminin tek bir düşey çizgisinde — sanal eksende <code>s = i\\omega</code> — yaşar. Laplace dönüşümü ise tüm sağ yarı düzlemde yaşar. Yani Laplace tam anlamıyla bir genellemedir: değerlendirme noktanızı s-düzleminin herhangi bir yerinden sanal eksene kaydırın, Fourier'i geri kazanırsınız.</div>

<p class="l-text">Tanımda <code>\\sigma = 0</code> alın. O zaman <code>s = i\\omega</code> olur ve</p>

<div class="calc-formula"><div class="formula-label">LAPLACE'IN BİR DİLİMİ OLARAK FOURIER</div><div class="formula-main">$$F(i\\omega) = \\int_{0}^{\\infty} f(t)\\, e^{-i\\omega t}\\, dt$$</div><div class="formula-sub">Bu, t &gt; 0'a kısıtlanmış f(t)'nin Fourier dönüşümüdür — integralin yakınsadığı, yani sanal eksenin ROC içinde olduğu durumda.</div></div>

<p class="l-text">Yani bir sistemin transfer fonksiyonu <code>H(s)</code>'in sanal eksen üzerinde ya da sağında hiç kutbu yoksa, <code>H(i\\omega)</code>'i değerlendirmek frekans cevabını verir — Bode diyagramının gösterdiği şeyin tam olarak kendisi. 9. bölümde RC filtresinin genlik ve faz cevabını Laplace transfer fonksiyonundan doğrudan okurken bu yöntemi sömüreceğiz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fourier vardır</div><div class="card-body">Sanal eksen ROC içinde. Sinyal kararlıdır, spektrumu anlamlıdır. s = i omega koyun ve işiniz biter.</div></div>
<div class="calc-card"><div class="card-title">Fourier ıraksar</div><div class="card-body">Sanal eksen ROC dışında. Sinyal büyür ya da hiç sönmez. Laplace yine de çalışır — Fourier susar.</div></div>
<div class="calc-card"><div class="card-title">Nedensel sinyal</div><div class="card-body">t &lt; 0 için f(t) = 0. İki dönüşüm de ortak var oldukları yerde aynı sonucu verir. Mühendislik durumu budur.</div></div>
</div>

<h2 class="lesson-title">4. Çözümlü Örnekler — Bilmek Zorunda Olduğun Beş Dönüşüm</h2>

<p class="l-text">Beş dönüşüm tekrar tekrar karşınıza çıkar. Hepsini bir kez tanımdan hesaplayın ve düşünmeden ulaşabileceğiniz bir tabloya koyun.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.1 Sabit: f(t) = 1</h3>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İntegrali yazın</div><div class="step-detail">F(s) = 0'dan sonsuza 1 * e^{-st} dt integrali.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İlkel fonksiyonu hesaplayın</div><div class="step-detail">e^{-st}'nin t'ye göre ilkeli -e^{-st}/s.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sınırlarda değerlendirin</div><div class="step-detail">t = sonsuzda (Re(s) &gt; 0 ile): e^{-st} -&gt; 0. t = 0'da: e^{0} = 1. Sonuç: 0 - (-1/s) = 1/s.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">SONUÇ 1</div><div class="formula-main">$$\\mathcal{L}\\{1\\} = \\frac{1}{s}, \\qquad \\Re(s) > 0$$</div><div class="formula-sub">Heaviside basamağı u(t) aynı dönüşüme sahiptir (çünkü integrasyon bölgesinde her t için u(t) = 1).</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.2 Üstel: f(t) = e^{-at}</h3>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Üstelleri birleştirin</div><div class="step-detail">F(s) = e^{-at} e^{-st} dt integrali = e^{-(s+a)t} dt integrali.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İlkel</div><div class="step-detail">-e^{-(s+a)t} / (s+a).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sınırlar (üst sınır ölsün diye Re(s) &gt; -a)</div><div class="step-detail">0 - (-1/(s+a)) = 1/(s+a).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">SONUÇ 2</div><div class="formula-main">$$\\mathcal{L}\\{e^{-at}\\} = \\frac{1}{s+a}, \\qquad \\Re(s) > -a$$</div><div class="formula-sub">Kutup s = -a'ya kayar. a &gt; 0 ise kutup sol yarı düzlemdedir (sönüm). a &lt; 0 ise kutup sağ yarı düzlemdedir (büyüme).</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.3 Sinüs: f(t) = sin(omega t)</h3>

<p class="l-text">Euler özdeşliği <code>\\sin(\\omega t) = (e^{i\\omega t} - e^{-i\\omega t})/(2i)</code> ile doğrusallık ve önceki sonucu iki kez kullanın (<code>a = -i\\omega</code> ve <code>a = i\\omega</code> ile):</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Doğrusallık</div><div class="step-detail">F(s) = (1/(2i)) * [L{e^{i omega t}} - L{e^{-i omega t}}] = (1/(2i)) * [1/(s - i omega) - 1/(s + i omega)].</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Ortak payda</div><div class="step-detail">Fark = [(s + i omega) - (s - i omega)] / [(s)^2 - (i omega)^2] = (2 i omega) / (s^2 + omega^2).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Pay ve paydadaki 2i'yi sadeleştirin</div><div class="step-detail">F(s) = omega / (s^2 + omega^2).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">SONUÇ 3</div><div class="formula-main">$$\\mathcal{L}\\{\\sin(\\omega t)\\} = \\frac{\\omega}{s^{2} + \\omega^{2}}$$</div><div class="formula-sub">İki karmaşık eşlenik kutup s = +/- i omega'da — tam olarak kararlı bir salınımın yaşadığı yer olan sanal eksende.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.4 Kosinüs: f(t) = cos(omega t)</h3>

<p class="l-text">Aynı Euler hilesi <code>\\cos(\\omega t) = (e^{i\\omega t} + e^{-i\\omega t})/2</code> ile:</p>

<div class="calc-formula"><div class="formula-label">SONUÇ 4</div><div class="formula-main">$$\\mathcal{L}\\{\\cos(\\omega t)\\} = \\frac{s}{s^{2} + \\omega^{2}}$$</div><div class="formula-sub">Sinüsle aynı kutuplar; yalnızca pay farklıdır. Sinüs ve kosinüs aynı spektral desteği paylaşır ama aralarında 90 derecelik faz farkı vardır — Laplace bunu paydaki s ile kaydeder.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">4.5 Dirac delta: f(t) = delta(t)</h3>

<p class="l-text">Delta fonksiyonunun süzme özelliğine göre, herhangi sürekli g için <code>\\int_{0}^{\\infty} \\delta(t) g(t) dt = g(0)</code>. <code>g(t) = e^{-st}</code> ve <code>g(0) = 1</code> alın:</p>

<div class="calc-formula"><div class="formula-label">SONUÇ 5</div><div class="formula-main">$$\\mathcal{L}\\{\\delta(t)\\} = 1$$</div><div class="formula-sub">Saf bir darbe her frekansı eşit ölçüde içerir — Laplace dönüşümü 1 sabitidir. Bir sistemin darbe cevabının kılık değiştirmiş hâliyle transfer fonksiyonu <em>olmasının</em> nedeni budur.</div></div>

<div class="l-note"><strong>Tablo şeklinde hatırlama:</strong> 1 -&gt; 1/s. e^{-at} -&gt; 1/(s+a). sin -&gt; omega/(s^2+omega^2). cos -&gt; s/(s^2+omega^2). delta -&gt; 1. Bu beşini ezberleyin; 5. bölümün özellikleriyle birleştirerek bir lisans Laplace tablosunun büyük kısmını türetebilirsiniz.</div>

<h2 class="lesson-title">5. Temel Özellikler</h2>

<p class="l-text">Pratikte gerçekten kullandığınız kurallar bunlardır. Her biri can sıkıcı bir zaman alanı işlemini (türev, integral, zaman kayması) s alanında temiz bir cebirsel işleme dönüştürür. Büyük olanı 4 numaralı özelliktir — türevi çarpmaya çeviren özellik.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Doğrusallık</div><div class="card-body">L{a f + b g} = a F(s) + b G(s). Sabitler ve toplamlar doğrudan geçer.</div><div class="card-formula">af + bg -> aF + bG</div></div>
<div class="calc-card"><div class="card-title">2. Zaman kayması</div><div class="card-body">L{f(t - a) u(t - a)} = e^{-as} F(s). Zamanda bir gecikme, s'te karmaşık üstel bir çarpana dönüşür. Ölü zamanı olan sistemlerin iş atı.</div><div class="card-formula">f(t-a)u(t-a) -> e^{-as} F(s)</div></div>
<div class="calc-card"><div class="card-title">3. Frekans kayması</div><div class="card-body">L{e^{at} f(t)} = F(s - a). Zamanda üstelle çarpma, s'te argümanın kaymasına dönüşür.</div><div class="card-formula">e^{at}f(t) -> F(s-a)</div></div>
<div class="calc-card"><div class="card-title">4. Zamanda türev</div><div class="card-body">L{f'(t)} = s F(s) - f(0). Ve L{f''(t)} = s^2 F(s) - s f(0) - f'(0). Özellik budur. ODE'ler cebire döner.</div><div class="card-formula">f' -> sF - f(0)</div></div>
<div class="calc-card"><div class="card-title">5. Zamanda integral</div><div class="card-body">L{0'dan t'ye f(tau) d tau integrali} = F(s)/s. s'e bölmek integraldir. s ile çarpmak türevdir. s, d/dt gibi davranır.</div><div class="card-formula">int f -> F/s</div></div>
<div class="calc-card"><div class="card-title">6. Başlangıç Değer Teoremi</div><div class="card-body">f(0+) = s -&gt; sonsuzken s F(s)'in limiti. F(s)'in tersini almadan doğrudan f(t)'nin başlangıç değerini okur.</div><div class="card-formula">f(0+) = lim sF(s)</div></div>
<div class="calc-card"><div class="card-title">7. Son Değer Teoremi</div><div class="card-body">f(sonsuz) = s -&gt; 0 iken s F(s)'in limiti — limit varsa (sF'nin tüm kutupları açık sol yarı düzlemde, s = 0'da en fazla tek bir kutba izin verilir). Tersini almadan kararlı durum cevabı.</div><div class="card-formula">f(inf) = lim sF(s)</div></div>
<div class="calc-card"><div class="card-title">8. Evrişim</div><div class="card-body">L{(f * g)(t)} = F(s) G(s). Doğrusal sistemler için en önemli tek olgu — zamanda çıktı = girdi * darbe cevabı, s'te basit çarpmaya dönüşür.</div><div class="card-formula">f*g -> F * G</div></div>
</div>

<div class="calc-formula"><div class="formula-label">4 NUMARALI ÖZELLİĞİN İSPATI (KATİL ÖZELLİK)</div><div class="formula-main">$$\\mathcal{L}\\{f'(t)\\} = \\int_{0}^{\\infty} f'(t)\\, e^{-st}\\, dt \\stackrel{\\text{KIBI}}{=} \\bigl[f(t)\\, e^{-st}\\bigr]_{0}^{\\infty} + s \\int_{0}^{\\infty} f(t)\\, e^{-st}\\, dt = -f(0) + s\\, F(s)$$</div><div class="formula-sub">u = e^{-st}, dv = f'(t) dt ile kısmi integral. Sonsuzdaki sınır terimi yok olur (Re(s) ROC içinde), sıfırda -f(0) verir. Bir kez daha tekrarlamak f'' formülünü verir.</div></div>

<div class="calc-example"><div class="example-label">BUNUN ÖNEMİ NEDEN</div><div class="example-body"><strong>y(0), y'(0) başlangıç koşullarıyla</strong> y'' + 3 y' + 2 y = e^{-t} <strong>gibi bir ODE</strong>, Laplace altında Y(s)'te cebirsel bir denkleme dönüşür:<br><br>[s^2 Y(s) - s y(0) - y'(0)] + 3[s Y(s) - y(0)] + 2 Y(s) = 1/(s + 1).<br><br>Türev yok. Başlangıç koşulu numarası yok. Başlangıç koşulları <em>zaten</em> cebirsel denklemin içinde. Y(s)'i sıradan cebirle çözer, sonra tersini alırız. Laplace'ın tüm pedagojik vaadi budur ve bir sonraki bölümde bunu paraya çevireceğiz.</div></div>

<h2 class="lesson-title">6. Laplace ile ODE Çözümü — Çözümlü Problem</h2>

<div class="calc-highlight"><strong>Laplace bu noktada araç kutusundaki yerini hak ediyor.</strong> Gerçek bir ikinci mertebe ODE'yi baştan sona çözeceğiz: her iki tarafa Laplace, Y(s) için cebirsel çözüm, kısmi kesirlere ayırma, her parçayı tablodan bakma ve y(t)'yi okuma. Klasik homojen + özel yöntemiyle karşılaştırarak Laplace'ın ne kadar muhasebe işini bertaraf ettiğini görelim.</div>

<div class="calc-formula"><div class="formula-label">PROBLEM</div><div class="formula-main">$$y'' + 3 y' + 2 y = e^{-t}, \\qquad y(0) = 0, \\quad y'(0) = 1$$</div><div class="formula-sub">Sabit katsayılı, zorlayan terimli ve açık başlangıç koşullarına sahip ikinci mertebe doğrusal ODE. Klasik "sürtünmeli bir yayın sönen bir darbe ile uyarılması" problemi.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Her iki tarafa Laplace uygulayın</div><div class="step-detail">L{y''} = s^2 Y(s) - s y(0) - y'(0) ve L{y'} = s Y(s) - y(0) kullanarak: [s^2 Y - s(0) - 1] + 3[s Y - 0] + 2 Y = 1/(s + 1).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Y(s)'i toplayın</div><div class="step-detail">(s^2 + 3 s + 2) Y(s) - 1 = 1/(s + 1) yani (s^2 + 3 s + 2) Y(s) = 1 + 1/(s + 1) = (s + 2)/(s + 1).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Karakteristik polinomu çarpanlarına ayırın</div><div class="step-detail">s^2 + 3 s + 2 = (s + 1)(s + 2). Dolayısıyla Y(s) = (s + 2) / [(s + 1)(s + 1)(s + 2)] = 1 / (s + 1)^2.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Tablodan tersini alın</div><div class="step-detail">L{t e^{-at}} = 1/(s + a)^2 (L{t} = 1/s^2'nin frekans kayması). a = 1 ile y(t) = t e^{-t}.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM</div><div class="formula-main">$$y(t) = t\\, e^{-t}, \\qquad t \\ge 0$$</div><div class="formula-sub">y(0) = 0 ve y'(0) = 1 başlangıç koşulları içeride pişer — peşinden koşulacak integral sabiti yok, çözülecek denklem sistemi yok. Elle doğrulayın: y(0) = 0, y'(t) = (1-t) e^{-t} olduğundan y'(0) = 1. ODE'ye geri koyun: y'' + 3 y' + 2 y tam olarak e^{-t}'ye sadeleşir.</div></div>

<p class="l-text"><strong>Klasik yöntemle karşılaştırma.</strong> Homojen çözüm karakteristik denklem r^2 + 3 r + 2 = 0'ı çözmeyi, r = -1, -2 elde etmeyi, y_h = A e^{-t} + B e^{-2t} yazmayı gerektirir. Özel çözüm e^{-t} zorlamasının homojen çözüme çarpıştığını fark etmeyi ve t ile çarpmayı gerektirir — tahmin y_p = C t e^{-t}, yerine koy, C = 1 bul. Başlangıç koşullarını toplama uygula, 2x2 sistem çöz. Aritmetik iyidir, ama muhasebe gerçektir. Laplace bunların hepsini tek bir cebirsel satırın içinde yaptı.</p>

<div class="calc-graph"><div id="plot-l6-ode-tr" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> y(t) = t e^{-t} çözümü. Sıfırdan başlar (y(0) = 0 ile eşleşir), başlangıç eğimi 1 ile fırlar (y'(0) = 1 ile eşleşir), t = 1'de y = 1/e ~ 0.368 zirvesine çıkar, sonra üstel olarak söner. Sönüm hızı, Y(s)'in en yavaş kutbu tarafından belirlenir; bu kutup s = -1'de (çift kutup) yaşar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],y=[];
for(var i=0;i<=600;i++){var x=i/100;t.push(x);y.push(x*Math.exp(-x));}
var d={x:t,y:y,mode:'lines',name:'y(t) = t e^{-t}',line:{color:'#3b82f6',width:2.6}};
var peak={x:[1],y:[Math.exp(-1)],mode:'markers',name:'t=1 zirvesi',marker:{size:10,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-ode-tr',[d,peak],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Şablon.</strong> Sabit katsayılı ve Laplace alınabilir zorlama fonksiyonlu her doğrusal ODE aynı tarifi izler: (1) her iki tarafı dönüştür, (2) cebirsel çöz, (3) kısmi kesirlere ayır, (4) her parçayı ters tablodan oku. Zamanda karmaşık görünen ODE, s'te yalnızca polinom cebridir.</div>

<h2 class="lesson-title">7. Transfer Fonksiyonları ve Blok Diyagramları</h2>

<div class="calc-highlight"><strong>Transfer fonksiyonu sistemin DNA'sıdır.</strong> Bir kez elinizde olduğunda, girdi-çıktı davranışının tamamı sabitlenmiştir. Sistem hakkında diğer her mühendislik iddiası — kararlılık, frekans cevabı, oturma süresi, rezonans — başka hesap yapmadan transfer fonksiyonundan okunabilir.</div>

<p class="l-text">Girdi <code>x(t)</code> ve çıktı <code>y(t)</code> olan, tüm başlangıç koşulları sıfır alınmış doğrusal zaman-değişmez (LTI) bir sistem için <strong>transfer fonksiyonu</strong> çıktı Laplace dönüşümünün girdi Laplace dönüşümüne oranı olarak tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">TRANSFER FONKSİYONU</div><div class="formula-main">$$H(s) = \\frac{Y(s)}{X(s)}$$</div><div class="formula-sub">Sonlu mertebeden doğrusal bir ODE ile tanımlanan herhangi bir sistem için s'te polinomların oranı. Payın kökleri sıfırlardır; paydanın kökleri kutuplardır.</div></div>

<p class="l-text">Üç kural, hayatınızda yapacağınız neredeyse her blok-diyagramı işlemini kapsar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seri bağlantı</div><div class="card-body">İki sistem H1 ve H2 ardarda: toplam H = H1 * H2. Sinyal her birini sırayla hisseder; etkileri s'te çarpılır.</div><div class="card-formula">H = H1 H2</div></div>
<div class="calc-card"><div class="card-title">Paralel bağlantı</div><div class="card-body">Çıktıda toplanan iki paralel yolda iki sistem: H = H1 + H2. Doğrusal süperpozisyon s'te toplamaya dönüşür.</div><div class="card-formula">H = H1 + H2</div></div>
<div class="calc-card"><div class="card-title">Negatif geri besleme</div><div class="card-body">Geri besleme yolu H olan döngüdeki ileri yol G: kapalı çevrim transferi = G / (1 + G H). 1 + GH paydası döngü kazancıdır — kökleri kapalı çevrim kutuplarıdır, kontrol teorisinin en izlenen nesnesidir.</div><div class="card-formula">G/(1+GH)</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK: BİRİNCİ MERTEBE TESİS ÜZERİNDE ORANSAL GERİ BESLEME</div><div class="example-body"><strong>Tesis:</strong> G(s) = 1/(s + 1) (basit bir gecikme).<br><strong>Denetleyici:</strong> H = K (oransal kazanç).<br><strong>Kapalı çevrim transferi:</strong><br><br>T(s) = G/(1 + G H) = (1/(s + 1)) / (1 + K/(s + 1)) = 1/(s + 1 + K).<br><br>Kapalı çevrim kutbu s = -1'den s = -(1 + K)'ye kaydı. Daha büyük K, kutbu daha ileriye sol yarı düzleme iter — daha hızlı cevap, daha kararlı. Geri beslemenin temel mucizesi budur: kutbu süpüren bir K düğmesi.</div></div>

<h2 class="lesson-title">8. Kutuplar, Sıfırlar ve Kararlılık</h2>

<div class="calc-highlight"><strong>Eksiksiz kararlılık testi:</strong> H(s)'in tüm kutupları açık sol yarı düzlemde <em>ancak ve ancak</em> sistem BIBO kararlıdır. Sağ yarı düzlem kutbu mu var? Bazı sınırlı girdi, sınırsız çıktı üretir — sistem patlar. Tam sanal eksen üzerinde kutup mu? Marjinal kararlı: ne söner ne patlar, sonsuza dek salınır (ya da, başlangıç noktasındaysa, bir sabiti integre eder).</div>

<p class="l-text"><code>s = -a</code>'daki birinci mertebe bir kutup, zaman alanı cevabına <code>A e^{-at}</code> terimi katar. Yani her kutup tek bir üstel modu kontrol eder. Kutup konumu ile zaman alanı şekli arasındaki harita basittir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">s = -a'da reel kutup (a &gt; 0)</div><div class="card-body">Saf üstel sönüm e^{-at}. Daha büyük a -&gt; daha hızlı sönüm. Kararlı, iyi sönümlü sistemler için istediğiniz şey budur.</div></div>
<div class="calc-card"><div class="card-title">s = +a'da reel kutup (a &gt; 0)</div><div class="card-body">Üstel büyüme e^{at}. Felaket. Sistemin kararsız olduğu anlamına gelir — herhangi küçük bozulma patlar.</div></div>
<div class="calc-card"><div class="card-title">s = -alpha +/- i omega_d'de karmaşık eşlenik çift</div><div class="card-body">Sönümlü salınım e^{-alpha t} sin(omega_d t). Reel kısım -alpha sönüm zarfını belirler; sanal kısım omega_d salınım frekansını belirler.</div></div>
<div class="calc-card"><div class="card-title">+/- i omega_0'da sanal eksen üzerinde çift</div><div class="card-body">Saf sinüsoid sin(omega_0 t) — sonsuza dek sönümsüz salınım. Marjinal kararlı. Kayıpsız bir LC tankı ya da sönümsüz harmonik osilatör.</div></div>
<div class="calc-card"><div class="card-title">s = 0 başlangıç noktasında kutup</div><div class="card-body">İntegratör. Sabit girdi ver, çıktı rampaya dönüşür. Sönüm ve büyüme arasındaki sınırda marjinal kararlı.</div></div>
<div class="calc-card"><div class="card-title">Sağ yarı düzlemde karmaşık çift</div><div class="card-body">Büyüyen salınım e^{+alpha t} sin(omega t). Yapıları kendilerini parçalatıp ufalayan başarısızlık modu.</div></div>
</div>

<div class="calc-graph"><div id="plot-l6-poles-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> altı kutup konfigürasyonu renk kodlu s-düzlemi. Açık sol yarı düzlem = kararlı (mavi). Sanal eksen = marjinal kararlı (sarı). Açık sağ yarı düzlem = kararsız (kırmızı). Düşey çizgi Re(s) = 0 her şeye karar veren kararlılık sınırıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var stable={x:[-3,-2,-1.5,-1.5],y:[0,0,2,-2],mode:'markers',name:'kararlı (sol YD)',marker:{symbol:'x',size:14,color:'#3b82f6',line:{width:3}}};
var imag={x:[0,0],y:[1.5,-1.5],mode:'markers',name:'marjinal (sanal eksen)',marker:{symbol:'x',size:14,color:'#f59e0b',line:{width:3}}};
var unstable={x:[1,2,1.5,1.5],y:[0,0,2,-2],mode:'markers',name:'kararsız (sağ YD)',marker:{symbol:'x',size:14,color:'#f87171',line:{width:3}}};
var axis={x:[0,0],y:[-4,4],mode:'lines',line:{color:'#888',width:2,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-4,4]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-2.7,y:3,text:'KARARLI',showarrow:false,font:{color:'#3b82f6',size:12}},{x:2.7,y:3,text:'KARARSIZ',showarrow:false,font:{color:'#f87171',size:12}}]};
Plotly.newPlot('plot-l6-poles-tr',[axis,stable,imag,unstable],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l6-step-resp-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> omega_n = 1 ve dört farklı sönüm oranıyla standart ikinci mertebe sistemin <code>omega_n^2 / (s^2 + 2 zeta omega_n s + omega_n^2)</code> basamak cevapları. zeta = 0.2 (ağır salınımlı aşım), zeta = 0.7 (iyi mühendislik hedefi: küçük aşım, hızlı oturma), zeta = 1 (kritik sönümlü, hiç aşım yok), zeta = 2 (aşırı sönümlü, yavaş). Denetleyici ayarlamak büyük ölçüde doğru zeta avıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/40);
function step(z){
  var wn=1;
  var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i];
    var y;
    if(z<1){var wd=wn*Math.sqrt(1-z*z);y=1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z/Math.sqrt(1-z*z))*Math.sin(wd*x));}
    else if(z===1){y=1-Math.exp(-wn*x)*(1+wn*x);}
    else{var r1=-wn*(z-Math.sqrt(z*z-1));var r2=-wn*(z+Math.sqrt(z*z-1));y=1-(r2*Math.exp(r1*x)-r1*Math.exp(r2*x))/(r2-r1);}
    out.push(y);
  }
  return out;
}
var d1={x:t,y:step(0.2),mode:'lines',name:'zeta=0.2 (zayıf sönüm)',line:{color:'#f87171',width:2.4}};
var d2={x:t,y:step(0.7),mode:'lines',name:'zeta=0.7',line:{color:'#3b82f6',width:2.4}};
var d3={x:t,y:step(1.0),mode:'lines',name:'zeta=1 (kritik)',line:{color:'#10b981',width:2.4}};
var d4={x:t,y:step(2.0),mode:'lines',name:'zeta=2 (aşırı sönüm)',line:{color:'#f59e0b',width:2.4,dash:'dot'}};
var target={x:[0,10],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'cevap',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-step-resp-tr',[target,d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Mühendislik kural-i:</strong> <code>zeta = 0.7</code> sıkça seçilen tatlı noktadır. Yaklaşık %4-5 aşım, hızlı oturma, aşırı salınım yok. Butterworth filtresi kutuplarını tam olarak bu sönümle yerleştirir.</div>

<h2 class="lesson-title">9. RC Devresi — Klasik Birinci Mertebe Sistem</h2>

<div class="calc-highlight"><strong>Bir R direnci ile bir C kondansatörünün seri bağlandığını, <code>V_{in}(t)</code> giriş gerilimiyle sürüldüğünü ve çıkış <code>V_{out}(t)</code>'nin kondansatör uçlarından ölçüldüğünü düşünün.</strong> Bu, tüm elektronikteki en basit önemsiz olmayan dinamik sistemdir — ve transfer fonksiyonu tek satırdır.</div>

<p class="l-text">Kirchhoff'un gerilim yasası ve kondansatör bağıntısı <code>i = C \\, dV_{out}/dt</code> ODE'yi verir</p>

<div class="calc-formula"><div class="formula-label">RC DEVRESİ ODE</div><div class="formula-main">$$R\\, C\\, \\frac{dV_{out}}{dt} + V_{out}(t) = V_{in}(t)$$</div><div class="formula-sub">Zaman sabiti tau = R C olan birinci mertebe doğrusal bir ODE. V_in tarafından sürülür, V_out'ta gözlenir.</div></div>

<p class="l-text"><code>V_{out}(0) = 0</code> ile (başlangıçta yüksüz kondansatör) her iki tarafa Laplace alın:</p>

<div class="calc-formula"><div class="formula-label">RC ALÇAK GEÇİREN TRANSFER FONKSİYONU</div><div class="formula-main">$$H(s) = \\frac{V_{out}(s)}{V_{in}(s)} = \\frac{1}{1 + s R C} = \\frac{1/(RC)}{s + 1/(RC)}$$</div><div class="formula-sub">s = -1/(RC)'de tek kutup. Devrenin davranışı hakkında diğer her şey bunu takip eder.</div></div>

<p class="l-text"><strong>Basamak cevabı.</strong> Birim basamağı besleyin <code>V_{in}(t) = u(t)</code>, dolayısıyla <code>V_{in}(s) = 1/s</code>. O zaman</p>

<div class="calc-formula"><div class="formula-label">RC ALÇAK GEÇİRENİN BASAMAK CEVABI</div><div class="formula-main">$$V_{out}(s) = \\frac{1}{s(1 + sRC)} = \\frac{1}{s} - \\frac{1}{s + 1/(RC)} \\implies V_{out}(t) = 1 - e^{-t/(RC)}$$</div><div class="formula-sub">Kısmi kesirler, sonra tablodan bakma. Herkesin osiloskopta gördüğü klasik üstel doluş eğrisi.</div></div>

<p class="l-text"><strong>Frekans cevabı.</strong> <code>s = i\\omega</code> alın:</p>

<div class="calc-formula"><div class="formula-label">FREKANS CEVABI</div><div class="formula-main">$$H(i\\omega) = \\frac{1}{1 + i\\omega RC}, \\qquad |H(i\\omega)| = \\frac{1}{\\sqrt{1 + (\\omega R C)^{2}}}$$</div><div class="formula-sub">Genlik omega = 0'da 1'dir ve omega büyüdükçe düşer. -3 dB kesim omega_c = 1/(RC)'de oturur.</div></div>

<div class="calc-graph"><div id="plot-l6-bode-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> R = 1 kohm, C = 1 mikroF olan RC alçak geçirenin Bode diyagramı, dolayısıyla omega_c = 1/(RC) = 1000 rad/s. Genlik (üst) geçiş bandında düzdür, köşeden sonra decade başına 20 dB düşer. Faz (alt) 0'dan başlar, tam omega_c'de -45 dereceyi vurur ve -90 dereceye yatay yakınsar. Aynı şekil, ölçekli olarak, mühendislikteki her birinci mertebe sistemde görünür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,1+i*4/400));
var mag=[],ph=[];var RC=1e-3;
for(var i=0;i<w.length;i++){var ww=w[i];var m=20*Math.log10(1/Math.sqrt(1+(ww*RC)*(ww*RC)));mag.push(m);ph.push(-180/Math.PI*Math.atan(ww*RC));}
var d1={x:w,y:mag,mode:'lines',name:'|H(j omega)| (dB)',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var d2={x:w,y:ph,mode:'lines',name:'faz (derece)',line:{color:'#f59e0b',width:2.4},xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',title:'',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'faz (derece)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-bode-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pratikte neden önemli:</strong> 1 kutuplu bir alçak geçiren filtreye — bir sensör okumasını temizlemek, bir kontrol sinyalini düzleştirmek, temel anti-aliasing yapmak için — ihtiyacınız olursa, yukarıdaki formüller tüm tasarımdır. R ve C'yi 1/(RC) istediğiniz kesim frekansında oturacak şekilde seçin. İşte bu. 12. bölümdeki egzersizde tam olarak bunu Python'da yapacaksınız.</div>

<h2 class="lesson-title">10. RLC Devresi — Rezonans ve İkinci Mertebe Standart Form</h2>

<div class="calc-highlight"><strong>RC devresine bir L bobini ekleyin ve daha zengin bir hikâye açılır.</strong> Sistem artık ikinci mertebedir. Salınabilir. Belirli bir frekansta rezonansa girebilir. Sönüm oranı, enerjinin pürüzsüzce mi dışarı sızdığını, bir çan gibi mi çınladığını, yoksa başlamakta mı zorlandığını söyler.</div>

<p class="l-text">V_in tarafından sürülen, V_out kondansatör uçlarından ölçülen bir RLC seri devresini ele alın. Kirchhoff ve eleman yasaları şunu verir</p>

<div class="calc-formula"><div class="formula-label">RLC ODE</div><div class="formula-main">$$L\\,C\\,\\frac{d^{2}V_{out}}{dt^{2}} + R\\,C\\,\\frac{dV_{out}}{dt} + V_{out}(t) = V_{in}(t)$$</div><div class="formula-sub">İkinci mertebe doğrusal bir ODE — kütle-yay-sönümleyici ve diğer her rezonanslı fiziksel sistemin ders kitabı arkadaşı.</div></div>

<p class="l-text">Sıfır başlangıç koşullarıyla Laplace şunu verir</p>

<div class="calc-formula"><div class="formula-label">RLC TRANSFER FONKSİYONU (KANONİK FORM)</div><div class="formula-main">$$H(s) = \\frac{1}{L\\,C\\,s^{2} + R\\,C\\,s + 1} = \\frac{\\omega_{n}^{2}}{s^{2} + 2\\,\\zeta\\,\\omega_{n}\\,s + \\omega_{n}^{2}}$$</div><div class="formula-sub">Standart ikinci mertebe form. Doğal frekans omega_n = 1/sqrt(LC). Sönüm oranı zeta = (R/2) sqrt(C/L).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğal frekans omega_n</div><div class="card-body">Sönümsüz (R = 0) sistemin sonsuza dek salınacağı frekans. Tamamen L ve C tarafından belirlenir. omega_n = 1/sqrt(L C).</div></div>
<div class="calc-card"><div class="card-title">Sönüm oranı zeta</div><div class="card-body">Sistemin ne kadar salınımlı olduğunu söyleyen boyutsuz sayı. zeta = 0 kayıpsız, zeta = 1 kritik sönümlü, zeta &gt; 1 aşırı sönümlü.</div></div>
<div class="calc-card"><div class="card-title">Sönümlü frekans omega_d</div><div class="card-body">Zayıf sönümlü basamak cevabında görülen gerçek çınlama frekansı: omega_d = omega_n sqrt(1 - zeta^2). omega_n'den biraz düşük.</div></div>
<div class="calc-card"><div class="card-title">Kutuplar</div><div class="card-body">zeta &lt; 1 için s = -zeta omega_n +/- i omega_d (karmaşık çift, salınım). zeta = 1 için s = -omega_n (çift reel, kritik sönüm). zeta &gt; 1 için iki ayrı negatif reel.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>omega_n = 1000 rad/s ve zeta = 0.5 olan bir RLC devresi tasarlayın.</strong><br><br>L = 10 mH seçin. O zaman C = 1/(L omega_n^2) = 1/(0.01 * 10^6) = 100 nF.<br>R = 2 zeta sqrt(L/C) = 2 * 0.5 * sqrt(0.01/1e-7) = 1 * sqrt(10^5) = 316 ohm.<br><br>Bu, frekans cevabında 1000 rad/s yakınında rezonans tepesi olan zayıf sönümlü ikinci mertebe alçak geçiren verir. Daha keskin tepe için zeta'yı 0'a doğru, düzleştirmek için 1'e doğru ayarlayın.</div></div>

<div class="calc-graph"><div id="plot-l6-rlc-resp-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> omega_n = 1 rad/s ile zeta = 0.15 (hafif sönüm) olan RLC devresinin zaman alanı basamak cevabı. Çıktı 1'i belirgin aşar, omega_n'ye çok yakın bir frekansla salınır ve yavaşça e^{-zeta omega_n t} zarfı altında söner. Bu, sonlandırılmamış bir kabloya çarpan her dijital iz üzerinde gördüğünüz klasik "çınlama"dır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=500;i++)t.push(i/15);
var z=0.15,wn=1;var wd=wn*Math.sqrt(1-z*z);
var y=[],env_up=[],env_dn=[];
for(var i=0;i<t.length;i++){var x=t[i];var val=1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z/Math.sqrt(1-z*z))*Math.sin(wd*x));y.push(val);env_up.push(1+Math.exp(-z*wn*x)/Math.sqrt(1-z*z));env_dn.push(1-Math.exp(-z*wn*x)/Math.sqrt(1-z*z));}
var d={x:t,y:y,mode:'lines',name:'V_out(t)',line:{color:'#3b82f6',width:2.4}};
var eu={x:t,y:env_up,mode:'lines',name:'sönüm zarfı',line:{color:'#f87171',width:1.5,dash:'dash'}};
var ed={x:t,y:env_dn,mode:'lines',line:{color:'#f87171',width:1.5,dash:'dash'},showlegend:false};
var target={x:[0,35],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'V_out',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,2.5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l6-rlc-resp-tr',[target,eu,ed,d],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. (İsteğe Bağlı) Modern Yapay Zekâya Dokunmak: Neural ODE'ler</h2>

<p class="l-text">Dürüst cevap, Laplace dönüşümlerinin modern derin öğrenme eğitim döngülerinde <strong>görünmediğidir</strong>. Geri yayılım, optimize ediciler, gradyan akışı — hiçbiri Laplace gerektirmez. Öyleyse burada bunu neden anıyoruz?</p>

<p class="l-text">Modern ML'in küçük ama önemli bir köşesi yüzünden: <strong>sürekli zamanlı modeller</strong>. Neural ODE'ler (Chen, Rubanova, Bettencourt, Duvenaud, 2018) derin bir ağın evrimini, ayrık bir katmanlar dizisi yerine sürekli bir dinamik sistem <code>dz/dt = f(z, t, \\theta)</code> olarak ele alır. Sürekli normalizasyon akışları, neural CDE'ler, gizli ODE üretken modelleri ve son zamanlarda durum-uzay sıra modelleri (S4, Mamba), hepsi aynı DNA'yı paylaşır: zaman içinde ileri integre ettiğiniz öğrenilmiş bir ODE. Böyle sistemler hakkındaki klasik sorular — ne zaman sınırlı çıktıları vardır, ne zaman kararlı sabit noktaları vardır, basamak girdilerine nasıl tepki verirler — bu dersin inşa ettiği aynı Laplace / kutup-yerleştirme makinesiyle cevaplanır. Yani Laplace günlük eğitim aracınız değilse de, herhangi bir sürekli zamanlı sinir modelinin <em>dinamik</em> davranışını analiz etmek için doğru kelime dağarcığıdır. Bu dersi, o küçük ama büyüyen literatüre köprü olarak görün.</p>

<div class="l-note"><strong>Tek paragraf, fazlası değil.</strong> Laplace dönüşümlerinin transformerları (sinir ağı türünü) çalıştırdığını insanlara söylemeye gitmeyin. Çalıştırmazlar. Laplace'ın gerçek evi kontrol teorisi, sinyal işleme, devre analizi ve sürekli zamanlı fizik olmaya devam ediyor. Onu orada güvenle kullanın.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Denenecek şeyler.</strong> <code>num = [1]</code>, <code>den = [1, 0.4, 1]</code> ile ikinci mertebe bir sistem kurun ve basamak cevabının omega_n = 1 rad/s'de zeta = 0.2 ile çınladığını izleyin. Orta katsayıyı 1.4'e çevirin ve çınlama yok olur (zeta = 0.7 — mühendislik tatlı noktası). 2'ye ayarlayın ve cevap aşırı sönümlü olur. 10. bölümün aritmetiği üç satır Python'da orada.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Laplace, karmaşık çekirdek e^{-st}'ye karşı 0'dan sonsuza integral alarak Fourier'i genelleştirir. s'in reel kısmı büyümeyi söndürür, sanal kısmı frekansı probe eder. Beş dönüşüm ihtiyaçların çoğunu karşılar: 1 -&gt; 1/s, e^{-at} -&gt; 1/(s+a), sin -&gt; omega/(s^2+omega^2), cos -&gt; s/(s^2+omega^2), delta -&gt; 1. Türev özelliği L{f'} = sF(s) - f(0), ODE'lerin neden cebire döndüğünün tüm nedenidir; tek bir örnek (y'' + 3 y' + 2 y = e^{-t}, y(0) = 0, y'(0) = 1, çözüm y = t e^{-t}) iş akışını baştan sona gösterir. Transfer fonksiyonları ve kutup-sıfır diyagramları sistem davranışını bir bakışta okuyabileceğiniz bir resme sıkıştırır: sol yarı düzlem kararlıdır, sağ yarı düzlem kararsızdır, sanal eksen salınımın sınırıdır. RC alçak geçiren (-1/(RC)'de tek kutup) ve standart ikinci mertebe RLC sistemi (omega_n ve zeta ile parametrelendirilmiş), mühendislikteki hemen her sinyal-şartlandırma probleminde görünen iki yapıdır. Modern yapay zekâ Laplace'ı çoğunlukla rahat bırakır — küçük istisna, Neural ODE'lerin ve sürekli zamanlı durum-uzay modellerinin dinamik-sistem çerçevelemesi olup orada Laplace, kararlılık analizi için size doğru kelime dağarcığını geri verir. Sonraki ders bir daha genelleyerek <strong>Z-dönüşümüne</strong> geçer — Laplace'ın ayrık zamanlı karşılığı ve tüm dijital filtrelerin ve ayrık zamanlı kontrolün motoru.</p>
`

};
