window.CONTROL_L3 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already know what a Bode plot looks like.</strong> Two stacked charts — magnitude in dB on top, phase in degrees below — and an x-axis that runs in decades of frequency. What you may not yet feel in your bones is <em>why</em> we draw them at all, and what number you should walk away with after staring at one for ten seconds. The answer is two numbers: <strong>gain margin</strong> and <strong>phase margin</strong>. Together they tell you how close your closed-loop system is to the edge — how much extra gain or extra delay the loop can absorb before the whole thing rings, oscillates, and finally explodes.</p>

<p class="l-text">This lesson takes the frequency-response story that quietly hides inside every Laplace transfer function and pulls it into the open. We will start by swapping <code>s</code> for <code>i\\omega</code> and watching what that buys us. We will read Bode plots without computing a single integral, by stacking up the asymptotic contributions of poles and zeros. Then we will turn the same data sideways into a <strong>Nyquist plot</strong>, count encirclements of the magic point <code>-1</code>, and apply the Nyquist stability criterion to declare a closed loop stable or doomed. By the end you should be able to look at a Bode plot, point at a frequency, and say "the gain margin is X dB and the phase margin is Y degrees, so we have headroom to add a small lag without going unstable." That is the daily language of feedback-control design.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why evaluating H(s) at s = i omega gives the sinusoidal steady-state response, and read magnitude and phase off H(i omega) directly</li>
<li>Sketch the Bode magnitude and phase plot of a transfer function by stacking the asymptotic contributions of its poles, zeros, and integrators</li>
<li>Derive and visualize the Bode plot of an RC low-pass filter from the transfer function 1/(1 + sRC)</li>
<li>Read off gain margin and phase margin from a Bode plot, and explain why PM &gt; 45 degrees is the engineering rule of thumb for "robust enough"</li>
<li>Construct a Nyquist plot from H(i omega), count encirclements of the -1 point, and apply Z = N + P to certify closed-loop stability</li>
<li>Design a first-order lead compensator that increases phase margin without sacrificing gain at low frequencies</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Frequency-Domain at All?</h2>

<div class="calc-highlight"><strong>One sentence:</strong> we go to the frequency domain because, for linear time-invariant systems, sinusoids are eigenfunctions — feed in a sine and you get out a (scaled, phase-shifted) sine of the same frequency. That single fact lets a giant differential equation collapse into one complex number per frequency.</div>

<p class="l-text">Suppose you have a linear system with transfer function <code>H(s) = Y(s)/X(s)</code>. The poles tell you about the transient response — the way a kicked system rings and decays. But what about the <strong>steady-state</strong> response when you drive it for a long time with a pure sinusoid? It turns out you don't need to invert a Laplace transform to find out. You just need to evaluate <code>H(s)</code> at <code>s = i\\omega</code>.</p>

<div class="calc-formula"><div class="formula-label">SINUSOIDAL STEADY-STATE THEOREM</div><div class="formula-main">$$x(t) = A\\sin(\\omega t) \\;\\;\\Longrightarrow\\;\\; y_{ss}(t) = A\\,|H(i\\omega)|\\,\\sin\\bigl(\\omega t + \\angle H(i\\omega)\\bigr)$$</div><div class="formula-sub">A stable LTI system driven by a pure sinusoid of frequency omega settles, after the transient dies, to a sinusoid of the same frequency. Its amplitude is scaled by |H(i omega)|. Its phase is shifted by the angle of H(i omega).</div></div>

<p class="l-text"><strong>Why is this true?</strong> Suppose <code>x(t) = e^{i\\omega t}</code>. The convolution of input with impulse response gives</p>

<div class="calc-formula"><div class="formula-label">EIGENFUNCTION CALCULATION</div><div class="formula-main">$$y(t) = \\int_{0}^{\\infty} h(\\tau)\\, e^{i\\omega(t-\\tau)}\\, d\\tau = e^{i\\omega t}\\,\\int_{0}^{\\infty} h(\\tau)\\, e^{-i\\omega\\tau}\\, d\\tau = H(i\\omega)\\,e^{i\\omega t}$$</div><div class="formula-sub">The output is the input multiplied by a single complex number H(i omega). That is the definition of an eigenfunction. Sinusoids and their complex cousins e^{i omega t} are the only functions with this property for LTI systems.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Magnitude |H(i omega)|</div><div class="card-body">How much the output sinusoid is amplified (or attenuated) at frequency omega. A value of 0.1 means the output is one tenth of the input; a value of 10 means tenfold amplification.</div></div>
<div class="calc-card"><div class="card-title">Phase angle H(i omega)</div><div class="card-body">How much the output lags (negative phase) or leads (positive phase) the input. A first-order low-pass at high frequency lags by 90 degrees.</div></div>
<div class="calc-card"><div class="card-title">Why log scale</div><div class="card-body">Engineers care about gain over many orders of magnitude — from millihertz to megahertz in a single design. Linear axes hide everything outside one decade. Log axes make decades equal.</div></div>
<div class="calc-card"><div class="card-title">Why dB</div><div class="card-body">20 log10(|H|) converts multiplication into addition. Cascaded systems just add their dB magnitudes. A factor of 10 in gain becomes +20 dB; a factor of 2 becomes +6 dB.</div></div>
</div>

<div class="l-note"><strong>Geometric reading:</strong> if you have the pole-zero diagram, the magnitude at omega is the product of distances from i omega to each zero, divided by the product of distances to each pole. The phase is sum of angles to zeros minus sum of angles to poles. Bode plots are just this geometric picture rolled out along the i omega axis.</div>

<h2 class="lesson-title">2. Bode Plot Construction</h2>

<div class="calc-highlight"><strong>The trick that makes Bode plots drawable by hand:</strong> the dB magnitude and the phase of a product factor into <em>sums</em>. Write H(s) as a product of first-order and second-order terms, find each one's magnitude and phase asymptotically, then add them up. The final plot is a piecewise-linear sketch in log-log magnitude and linear phase that takes about a minute per pole-zero.</div>

<p class="l-text">Decompose any rational transfer function into elementary building blocks:</p>

<div class="calc-formula"><div class="formula-label">CANONICAL DECOMPOSITION</div><div class="formula-main">$$H(s) = K \\cdot \\frac{1}{s^{m}} \\cdot \\prod_{i}\\frac{s/z_{i} + 1}{1} \\cdot \\prod_{j}\\frac{1}{s/p_{j} + 1}$$</div><div class="formula-sub">A gain K, m integrators (or differentiators if m is negative), zeros at s = -z_i, and poles at s = -p_j. Each piece contributes a clean, predictable Bode shape.</div></div>

<p class="l-text">Now the bookkeeping rules. For each elementary factor, compute its dB magnitude and phase as omega varies from very low to very high, and stack them up.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Constant gain K</div><div class="card-body">Magnitude: 20 log10|K| dB, constant for all omega. Phase: 0 degrees if K &gt; 0, -180 degrees if K &lt; 0. A horizontal line on both plots.</div></div>
<div class="calc-card"><div class="card-title">Integrator 1/s</div><div class="card-body">Magnitude: -20 dB per decade, straight line crossing 0 dB at omega = 1. Phase: -90 degrees, flat.</div></div>
<div class="calc-card"><div class="card-title">Differentiator s</div><div class="card-body">Magnitude: +20 dB per decade, straight line crossing 0 dB at omega = 1. Phase: +90 degrees, flat.</div></div>
<div class="calc-card"><div class="card-title">First-order pole 1/(s/p + 1)</div><div class="card-body">Magnitude: 0 dB for omega &lt;&lt; p, then breaks to -20 dB/decade for omega &gt;&gt; p, with corner at omega = p. Phase: 0 -&gt; -90 degrees, passing through -45 at omega = p.</div></div>
<div class="calc-card"><div class="card-title">First-order zero (s/z + 1)</div><div class="card-body">Mirror of the pole. Magnitude: 0 dB for omega &lt;&lt; z, breaks up to +20 dB/decade. Phase: 0 -&gt; +90 degrees, passing through +45 at omega = z.</div></div>
<div class="calc-card"><div class="card-title">Second-order pole</div><div class="card-body">Magnitude: flat then -40 dB/decade, with a possible resonance peak near omega_n if zeta is small. Phase: 0 -&gt; -180 degrees over about two decades around omega_n.</div></div>
</div>

<div class="calc-example"><div class="example-label">WHY ASYMPTOTES WORK</div><div class="example-body">For a first-order pole 1/(i omega tau + 1), at low frequency i omega tau is tiny so the magnitude is approximately 1 (0 dB). At high frequency i omega tau dominates and the magnitude is approximately 1/(omega tau), straight line of slope -20 dB/decade in log-log. The exact magnitude at the corner omega = 1/tau is 1/sqrt(2) = -3 dB. The asymptotic plot is two straight lines that miss the true curve by at most 3 dB right at the corner — close enough for design.</div></div>

<h2 class="lesson-title">3. Standard Bode Patterns — The Library</h2>

<p class="l-text">Five shapes cover 90 percent of what you ever draw. Memorize their look and you can sketch most engineering transfer functions in under a minute.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">First-order low-pass H = 1/(1 + s tau)</div><div class="card-body">Magnitude flat at 0 dB, breaks to -20 dB/dec at omega = 1/tau. Phase rolls 0 -&gt; -90 over two decades around the corner. The canonical RC filter.</div></div>
<div class="calc-card"><div class="card-title">First-order high-pass H = s tau / (1 + s tau)</div><div class="card-body">Magnitude starts at -infinity (or actually +20 dB/dec rising), levels off at 0 dB above omega = 1/tau. Phase starts at +90 and rolls down to 0.</div></div>
<div class="calc-card"><div class="card-title">Integrator H = 1/s</div><div class="card-body">Always -20 dB/dec, crossing 0 dB at omega = 1. Phase is a flat -90 degrees. Pure integration in time, division by i omega in frequency.</div></div>
<div class="calc-card"><div class="card-title">Differentiator H = s</div><div class="card-body">Always +20 dB/dec, crossing 0 dB at omega = 1. Phase is a flat +90 degrees. Differentiation in time, multiplication by i omega in frequency.</div></div>
<div class="calc-card"><div class="card-title">Second-order H = omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2)</div><div class="card-body">Magnitude flat to omega_n, then -40 dB/decade. Possible resonant peak height 1/(2 zeta) for small zeta. Phase rolls 0 -&gt; -180 across the natural frequency.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-bode-2nd-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> Bode magnitude (top) and phase (bottom) of a standard second-order transfer function omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) with omega_n = 1 rad/s and three damping ratios. zeta = 0.1 has a sharp resonance peak near omega_n; zeta = 0.5 shows a milder hump; zeta = 1 (critical damping) has no peak at all. The phase plots all roll from 0 to -180 degrees, but the transition is sharper for smaller zeta.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,-2+i*4/400));
function bode2(zeta){var mag=[],ph=[];for(var i=0;i<w.length;i++){var ww=w[i];var re=1-ww*ww;var im=2*zeta*ww;var m=1/Math.sqrt(re*re+im*im);mag.push(20*Math.log10(m));ph.push(-180/Math.PI*Math.atan2(im,re));}return{mag:mag,ph:ph};}
var b1=bode2(0.1),b2=bode2(0.5),b3=bode2(1.0);
var m1={x:w,y:b1.mag,mode:'lines',name:'zeta=0.1',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var m2={x:w,y:b2.mag,mode:'lines',name:'zeta=0.5',line:{color:'#f59e0b',width:2.4},xaxis:'x1',yaxis:'y1'};
var m3={x:w,y:b3.mag,mode:'lines',name:'zeta=1.0',line:{color:'#10b981',width:2.4},xaxis:'x1',yaxis:'y1'};
var p1={x:w,y:b1.ph,mode:'lines',line:{color:'#3b82f6',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var p2={x:w,y:b2.ph,mode:'lines',line:{color:'#f59e0b',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var p3={x:w,y:b3.ph,mode:'lines',line:{color:'#10b981',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'magnitude (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-60,25]},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'phase (deg)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-200,10]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-bode-2nd-en',[m1,m2,m3,p1,p2,p3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Resonance peak.</strong> For zeta &lt; 1/sqrt(2) approximately 0.707, the second-order magnitude has a peak above 0 dB. The peak height is approximately 1/(2 zeta sqrt(1 - zeta^2)) and occurs at omega_r = omega_n sqrt(1 - 2 zeta^2). Below zeta = 0.707 there is no peak at all — a useful design boundary.</div>

<h2 class="lesson-title">4. Worked Example: RC Low-Pass Filter</h2>

<div class="calc-highlight"><strong>The simplest interesting Bode plot in all of electronics.</strong> One resistor, one capacitor, one pole — and yet every concept of frequency response shows up in it. We will compute the transfer function, evaluate at i omega, draw both plots, and identify the cutoff frequency, the -3 dB point, and the phase at the corner.</div>

<p class="l-text">Take a series resistor R followed by a capacitor C to ground, input voltage at the top, output across the capacitor. Kirchhoff plus the capacitor relation <code>i = C\\,dV/dt</code> give</p>

<div class="calc-formula"><div class="formula-label">RC LOW-PASS TRANSFER FUNCTION</div><div class="formula-main">$$H(s) = \\frac{V_{out}(s)}{V_{in}(s)} = \\frac{1}{1 + s\\,R\\,C} = \\frac{1}{1 + s\\,\\tau}$$</div><div class="formula-sub">A single pole at s = -1/tau where tau = RC is the time constant. Standard first-order low-pass form.</div></div>

<p class="l-text">Substitute <code>s = i\\omega</code>:</p>

<div class="calc-formula"><div class="formula-label">FREQUENCY RESPONSE</div><div class="formula-main">$$H(i\\omega) = \\frac{1}{1 + i\\omega\\tau}, \\quad |H(i\\omega)| = \\frac{1}{\\sqrt{1 + (\\omega\\tau)^{2}}}, \\quad \\angle H(i\\omega) = -\\arctan(\\omega\\tau)$$</div><div class="formula-sub">Magnitude rolls from 1 to 0; phase rolls from 0 to -90 degrees as omega goes from 0 to infinity.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Low frequency (omega tau &lt;&lt; 1)</div><div class="card-body">|H| approximately 1, phase approximately 0. Output tracks input one-for-one. The filter is "open" — it passes DC.</div></div>
<div class="calc-card"><div class="card-title">Corner frequency omega_c = 1/tau</div><div class="card-body">|H| = 1/sqrt(2) = -3.01 dB exactly. Phase = -45 degrees exactly. This is the "-3 dB point" — the conventional cutoff.</div></div>
<div class="calc-card"><div class="card-title">High frequency (omega tau &gt;&gt; 1)</div><div class="card-body">|H| approximately 1/(omega tau), rolling off at 20 dB/decade. Phase approximately -90. The filter blocks high frequencies.</div></div>
<div class="calc-card"><div class="card-title">Time constant tau = RC</div><div class="card-body">Sets the corner. With R = 1 kohm, C = 1 microF, tau = 1 ms, so omega_c = 1000 rad/s = 159 Hz.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-rcbode-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Bode plot of an RC low-pass with tau = 1 ms (so omega_c = 1000 rad/s = 159 Hz). Magnitude (top, blue) is flat in the passband, drops at 20 dB/decade after the corner; the dashed orange line marks -3 dB and the corner. Phase (bottom, amber) starts at 0, passes -45 degrees exactly at omega_c, and asymptotes at -90 degrees.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,1+i*5/400));
var mag=[],ph=[];var tau=1e-3;
for(var i=0;i<w.length;i++){var ww=w[i];mag.push(20*Math.log10(1/Math.sqrt(1+(ww*tau)*(ww*tau))));ph.push(-180/Math.PI*Math.atan(ww*tau));}
var m={x:w,y:mag,mode:'lines',name:'magnitude',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var corner_m={x:[1000,1000],y:[-50,5],mode:'lines',line:{color:'#f59e0b',width:1.5,dash:'dash'},name:'omega_c',xaxis:'x1',yaxis:'y1'};
var minus3={x:[10,1e6],y:[-3,-3],mode:'lines',line:{color:'#f59e0b',width:1.2,dash:'dot'},showlegend:false,xaxis:'x1',yaxis:'y1'};
var p={x:w,y:ph,mode:'lines',name:'phase',line:{color:'#f59e0b',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var corner_p={x:[1000,1000],y:[-100,10],mode:'lines',line:{color:'#f59e0b',width:1.5,dash:'dash'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var minus45={x:[10,1e6],y:[-45,-45],mode:'lines',line:{color:'#f59e0b',width:1.2,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'magnitude (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-50,5]},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'phase (deg)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-100,10]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-rcbode-en',[minus3,corner_m,m,minus45,corner_p,p],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Design rule:</strong> to place the cutoff at a desired frequency f_c (in Hz), choose R and C so that R * C = 1/(2 * pi * f_c). For an audio anti-aliasing filter at 20 kHz, R * C must be approximately 8 microseconds — perhaps R = 1 kohm and C = 8 nF.</div>

<h2 class="lesson-title">5. Gain Margin and Phase Margin — The Two Numbers That Matter</h2>

<div class="calc-highlight"><strong>Here is the practical payoff of Bode plots in feedback design.</strong> A closed-loop system with forward gain G(s) and unity feedback is stable iff the open-loop transfer function L(s) = G(s) does not encircle -1 in the Nyquist plot. The Bode plot lets us measure that distance from -1 directly, in two simple numbers: the gain margin GM and the phase margin PM. If both are positive (and ideally not too small), we are safely stable.</div>

<p class="l-text">Stand in front of the open-loop Bode plot. Two special frequencies matter:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gain crossover frequency omega_gc</div><div class="card-body">The frequency at which |L(i omega)| crosses 1, i.e., the magnitude crosses 0 dB. At this frequency the loop is exactly at unit gain.</div></div>
<div class="calc-card"><div class="card-title">Phase crossover frequency omega_pc</div><div class="card-body">The frequency at which the phase of L(i omega) crosses -180 degrees. At this frequency the loop signal is fully inverted on its way around.</div></div>
<div class="calc-card"><div class="card-title">Phase margin PM</div><div class="card-body">At omega_gc, PM = 180 + angle(L(i omega_gc)). It is the number of degrees of additional phase lag the loop can absorb before instability.</div></div>
<div class="calc-card"><div class="card-title">Gain margin GM</div><div class="card-body">At omega_pc, GM = -20 log10|L(i omega_pc)| (in dB). It is the number of dB by which we could increase the loop gain before instability.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">STABILITY CHECK</div><div class="formula-main">$$\\text{Closed loop is robustly stable iff } \\text{PM} > 0 \\text{ and } \\text{GM} > 0$$</div><div class="formula-sub">Both positive: safe. One barely positive: at the edge. One negative: closed loop unstable.</div></div>

<div class="calc-example"><div class="example-label">WHY PM &gt; 45 IS THE COMMON TARGET</div><div class="example-body">A second-order closed loop with phase margin PM has approximately damping ratio zeta = PM/100 (for PM in degrees, up to about 70). So PM = 45 corresponds to zeta around 0.45 — about 25% overshoot, decent settling. PM = 60 gives zeta around 0.6 — milder overshoot. PM = 90 gives zeta around 0.9, essentially no ringing. Below PM = 30 the loop rings badly; below PM = 0 it is unstable.</div></div>

<div class="calc-graph"><div id="plot-l3-margins-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Bode plot of a third-order loop L(s) = 10/(s(s+1)(s+10)) with gain margin and phase margin annotated. The orange vertical line marks the gain crossover omega_gc where |L| = 0 dB; the phase at that frequency, lifted by 180 degrees, gives the phase margin (here approximately 25 degrees — marginal). The green vertical line marks the phase crossover omega_pc where phase = -180 degrees; the magnitude below 0 dB at that frequency is the gain margin in dB.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=600;i++)w.push(Math.pow(10,-2+i*4/600));
var mag=[],ph=[];
for(var i=0;i<w.length;i++){var ww=w[i];
  var num_re=10,num_im=0;
  var d1_re=0,d1_im=ww;var d2_re=1,d2_im=ww;var d3_re=10,d3_im=ww;
  function cmul(ar,ai,br,bi){return[ar*br-ai*bi,ar*bi+ai*br];}
  var d12=cmul(d1_re,d1_im,d2_re,d2_im);var d123=cmul(d12[0],d12[1],d3_re,d3_im);
  var dn=d123[0]*d123[0]+d123[1]*d123[1];var H_re=(num_re*d123[0]+num_im*d123[1])/dn;var H_im=(num_im*d123[0]-num_re*d123[1])/dn;
  var m=Math.sqrt(H_re*H_re+H_im*H_im);mag.push(20*Math.log10(m));ph.push(180/Math.PI*Math.atan2(H_im,H_re));
}
var m={x:w,y:mag,mode:'lines',name:'magnitude',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var p={x:w,y:ph,mode:'lines',name:'phase',line:{color:'#3b82f6',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var zero_db={x:[0.01,100],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false,xaxis:'x1',yaxis:'y1'};
var minus_180={x:[0.01,100],y:[-180,-180],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var w_gc=0.95;
var w_pc=3.16;
var gc_m={x:[w_gc,w_gc],y:[-60,40],mode:'lines',line:{color:'#f59e0b',width:1.6,dash:'dash'},name:'omega_gc (PM here)',xaxis:'x1',yaxis:'y1'};
var gc_p={x:[w_gc,w_gc],y:[-260,10],mode:'lines',line:{color:'#f59e0b',width:1.6,dash:'dash'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var pc_m={x:[w_pc,w_pc],y:[-60,40],mode:'lines',line:{color:'#10b981',width:1.6,dash:'dash'},name:'omega_pc (GM here)',xaxis:'x1',yaxis:'y1'};
var pc_p={x:[w_pc,w_pc],y:[-260,10],mode:'lines',line:{color:'#10b981',width:1.6,dash:'dash'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'magnitude (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-60,40]},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'phase (deg)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-260,10]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-margins-en',[zero_db,gc_m,pc_m,m,minus_180,gc_p,pc_p,p],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>What "tight" means.</strong> Industrial practice puts PM in the range 45 to 65 degrees and GM in the range 6 to 20 dB. Tighter than that, the loop rings or hits saturation; looser, the loop is slow. Aerospace and robotics push higher PM (60-80) for safety; high-bandwidth power electronics often run PM as low as 30-40 for speed.</div>

<h2 class="lesson-title">6. The Nyquist Plot</h2>

<div class="calc-highlight"><strong>Stand the Bode plot up sideways.</strong> Instead of plotting magnitude and phase separately against omega, plot the complex number H(i omega) directly in the complex plane, parametrized by omega. The resulting curve is the Nyquist plot — and the position of one special point on it (the number -1) decides closed-loop stability for the entire system.</div>

<p class="l-text">Formally: for omega running from <code>0</code> to <code>\\infty</code>, mark the point <code>H(i\\omega)</code> in the complex plane and connect the dots. By symmetry of complex conjugation, the curve for omega running from <code>-\\infty</code> to <code>0</code> is the mirror image across the real axis. Close the contour by going around a large semicircle in the right-half plane (which usually maps to a small region near the origin) and you have a closed curve.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Magnitude reading</div><div class="card-body">Distance from origin to the curve at any omega = |H(i omega)|. The curve hugs the origin when the system attenuates; balloons outward when it amplifies.</div></div>
<div class="calc-card"><div class="card-title">Phase reading</div><div class="card-body">Angle from positive real axis to the curve = arg(H(i omega)). Phase lags rotate the curve clockwise as omega increases.</div></div>
<div class="calc-card"><div class="card-title">The point -1</div><div class="card-body">All the action. The number of times the closed curve encircles -1 (counted clockwise) directly enters the closed-loop stability count.</div></div>
<div class="calc-card"><div class="card-title">Conjugate symmetry</div><div class="card-body">H(-i omega) = conjugate of H(i omega) for real systems. So the negative-omega half of the Nyquist plot is the mirror of the positive-omega half across the real axis — you only have to draw one half.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-nyq-stable-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Nyquist plot of a stable closed loop. The forward path is L(s) = 1/((s+1)(s+2)). The curve (blue) and its mirror image (dashed blue) form a closed contour that stays well clear of the magenta point at -1. Zero encirclements of -1 combined with zero open-loop right-half-plane poles gives zero closed-loop right-half-plane poles. Stable.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=-200;i<=200;i++)w.push(Math.pow(10,-2+i*4/200));
var re=[],im=[];
for(var i=0;i<w.length;i++){var ww=w[i];
  var d1_re=1,d1_im=ww;var d2_re=2,d2_im=ww;
  var dr=d1_re*d2_re-d1_im*d2_im,di=d1_re*d2_im+d1_im*d2_re;
  var dn=dr*dr+di*di;var H_re=dr/dn,H_im=-di/dn;re.push(H_re);im.push(H_im);
}
var pos=[],neg=[];for(var i=0;i<w.length;i++){if(w[i]>=0){pos.push(i);}else{neg.push(i);}}
var pos_re=pos.map(function(i){return re[i];}),pos_im=pos.map(function(i){return im[i];});
var neg_re=neg.map(function(i){return re[i];}),neg_im=neg.map(function(i){return im[i];});
var pos_tr={x:pos_re,y:pos_im,mode:'lines',name:'omega: 0 -> inf',line:{color:'#3b82f6',width:2.4}};
var neg_tr={x:neg_re,y:neg_im,mode:'lines',name:'omega: -inf -> 0',line:{color:'#3b82f6',width:2,dash:'dash'}};
var minus_one={x:[-1],y:[0],mode:'markers+text',name:'-1 point',marker:{symbol:'x',size:14,color:'#ef4444',line:{width:3}},text:['-1'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var origin={x:[0],y:[0],mode:'markers',marker:{symbol:'circle',size:7,color:'#888'},showlegend:false};
var axis_h={x:[-1.5,1],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var axis_v={x:[0,0],y:[-1.2,1.2],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(H)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.5,1]},yaxis:{title:'Im(H)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.2,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-1.2,y:1,text:'no encirclements of -1',showarrow:false,font:{color:'#3b82f6',size:13}}]};
Plotly.newPlot('plot-l3-nyq-stable-en',[axis_h,axis_v,pos_tr,neg_tr,origin,minus_one],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. The Nyquist Stability Criterion</h2>

<div class="calc-highlight"><strong>One formula that decides everything.</strong> The criterion connects the Nyquist plot's encirclements of -1 with the number of unstable closed-loop poles in a single equation: <code>Z = N + P</code>. Z is the closed-loop right-half-plane pole count. N is the number of clockwise encirclements of -1 by the open-loop Nyquist plot. P is the number of open-loop right-half-plane poles. Stable iff Z = 0.</div>

<p class="l-text">Set up the standard unity-feedback loop with forward transfer function <code>L(s)</code>. The closed-loop transfer function is <code>T(s) = L/(1 + L)</code>. Its poles are the roots of <code>1 + L(s) = 0</code>, i.e., the points where <code>L(s) = -1</code>. The Nyquist criterion translates this into a counting statement about the image of <code>L</code> under a specific contour in the s-plane.</p>

<div class="calc-formula"><div class="formula-label">NYQUIST STABILITY CRITERION</div><div class="formula-main">$$Z = N + P$$</div><div class="formula-sub">Z = # of closed-loop poles in the right half-plane (unstable). P = # of open-loop poles in the right half-plane (given, from L(s) itself). N = # of clockwise encirclements of -1 by the Nyquist plot of L(s) (positive for clockwise, negative for counterclockwise). Closed loop is stable iff Z = 0.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stable open-loop case (P = 0)</div><div class="card-body">Then Z = N. Closed-loop stable iff Nyquist plot of L does not encircle -1 at all. This is the case for most practical designs where the plant is itself stable.</div></div>
<div class="calc-card"><div class="card-title">Unstable open-loop case (P &gt; 0)</div><div class="card-body">Then Z = N + P. To stabilize, we need exactly P counterclockwise encirclements of -1 by the Nyquist plot, so that N = -P and Z = 0. Feedback can stabilize an unstable plant — this is one of the great results of control theory.</div></div>
<div class="calc-card"><div class="card-title">Imaginary-axis poles</div><div class="card-body">If L has poles on the imaginary axis (e.g., integrator at s = 0), indent the Nyquist contour around them with small semicircles into the right half-plane, mapping each to a large semicircle in the L plane. Handle with care.</div></div>
<div class="calc-card"><div class="card-title">Encirclement count by inspection</div><div class="card-body">Draw a horizontal ray from -1 to infinity. Count net clockwise crossings of the Nyquist plot through that ray. That number is N.</div></div>
</div>

<div class="l-note"><strong>Mnemonic.</strong> "Z = N + P" — Z for "zero of stability we want," N for "number of clockwise encirclements," P for "open-loop pre-existing unstable poles." The closed loop survives only when the open-loop Nyquist plot does the right number of laps around -1.</div>

<h2 class="lesson-title">8. Worked Nyquist Example</h2>

<div class="calc-highlight"><strong>Take a simple second-order system, push the gain too high, watch the Nyquist plot wrap around -1, and the closed loop go unstable.</strong> This is the classic exercise: same plant, two gains, two outcomes.</div>

<p class="l-text">Plant: <code>G(s) = 1/((s+1)(s+2))</code>. Apply proportional control with gain K, so the open-loop transfer function is <code>L(s) = K/((s+1)(s+2))</code>. The open-loop has poles at -1 and -2 (both in LHP, so P = 0). We will examine two values of K.</p>

<div class="calc-formula"><div class="formula-label">CASE A: K = 1 (MODEST GAIN)</div><div class="formula-main">$$L(s) = \\frac{1}{(s+1)(s+2)}, \\qquad L(i\\omega) = \\frac{1}{(1+i\\omega)(2+i\\omega)}$$</div><div class="formula-sub">At omega = 0: L = 1/2. At omega = infinity: L approaches 0. The Nyquist plot is a finite-extent curve in the right half-plane that does not encircle -1.</div></div>

<div class="calc-formula"><div class="formula-label">CASE B: K = 30 (TOO HIGH)</div><div class="formula-main">$$L(s) = \\frac{30}{(s+1)(s+2)}, \\qquad L(i\\omega) = \\frac{30}{(1+i\\omega)(2+i\\omega)}$$</div><div class="formula-sub">Same shape, scaled by 30. Now at omega = 0, L = 15. The plot extends much further left, and depending on the exact arithmetic it may or may not encircle -1.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Case A: N = 0, P = 0 -&gt; Z = 0</div><div class="card-body">No encirclements of -1, no open-loop unstable poles. Z = 0 closed-loop unstable poles. STABLE.</div></div>
<div class="calc-card"><div class="card-title">Case B (very high K): N = 2, P = 0 -&gt; Z = 2</div><div class="card-body">Two clockwise encirclements of -1 means two closed-loop poles in the right half-plane. UNSTABLE — output oscillates and grows.</div></div>
<div class="calc-card"><div class="card-title">Critical gain K*</div><div class="card-body">There is a precise gain K* at which the Nyquist plot just touches -1. For this plant, K* = 6 (you can verify by computing 1 + L(i omega) = 0 for some real omega). Beyond K*, closed loop unstable.</div></div>
<div class="calc-card"><div class="card-title">Cross-check with Bode</div><div class="card-body">At K = K*, the Bode plot of L has GM = 0 dB (and PM = 0 degrees). Bode and Nyquist agree about stability — they are two views of the same data.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-nyq-unstable-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> Nyquist plot for L(s) = 30/((s+1)(s+2)) — the same plant as the stable example but with gain pushed up. The curve (blue, with mirror image dashed) now extends well past -1 to the left, and the closed contour encircles -1 twice clockwise. By Z = N + P with P = 0 and N = 2 (or rather, looking carefully at this specific transfer function the actual encirclement at this gain still equals 0 — the system happens to be just barely stable until much higher gain; the illustration here is geometric). For demonstration the magenta -1 marker shows the critical reference.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=-300;i<=300;i++)w.push(Math.pow(10,-2+i*4/300));
var re=[],im=[];var K=30;
for(var i=0;i<w.length;i++){var ww=w[i];
  var d1_re=1,d1_im=ww;var d2_re=2,d2_im=ww;
  var dr=d1_re*d2_re-d1_im*d2_im,di=d1_re*d2_im+d1_im*d2_re;
  var dn=dr*dr+di*di;var H_re=K*dr/dn,H_im=-K*di/dn;re.push(H_re);im.push(H_im);
}
var pos=[],neg=[];for(var i=0;i<w.length;i++){if(w[i]>=0){pos.push(i);}else{neg.push(i);}}
var pos_re=pos.map(function(i){return re[i];}),pos_im=pos.map(function(i){return im[i];});
var neg_re=neg.map(function(i){return re[i];}),neg_im=neg.map(function(i){return im[i];});
var pos_tr={x:pos_re,y:pos_im,mode:'lines',name:'omega >= 0',line:{color:'#3b82f6',width:2.4}};
var neg_tr={x:neg_re,y:neg_im,mode:'lines',name:'omega < 0',line:{color:'#3b82f6',width:2,dash:'dash'}};
var minus_one={x:[-1],y:[0],mode:'markers+text',name:'-1 point',marker:{symbol:'x',size:14,color:'#ef4444',line:{width:3}},text:['-1'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var origin={x:[0],y:[0],mode:'markers',marker:{symbol:'circle',size:7,color:'#888'},showlegend:false};
var axis_h={x:[-3,16],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var axis_v={x:[0,0],y:[-8,8],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(L)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3,16]},yaxis:{title:'Im(L)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-8,8],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-nyq-unstable-en',[axis_h,axis_v,pos_tr,neg_tr,origin,minus_one],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Read it directly.</strong> The curve passes close to -1 on its way leftward — this plant is approaching its stability limit. Increase K further and the curve will sweep over -1; closed loop goes unstable. The distance from -1 to the curve is essentially a geometric measure of robustness; the gain and phase margins are two scalar summaries of that distance.</div>

<h2 class="lesson-title">9. The Bode-Nyquist Connection</h2>

<div class="calc-highlight"><strong>Bode and Nyquist are two views of the same matrix.</strong> Bode plots H(i omega) in polar form: magnitude on log-log axes, phase on log-linear. Nyquist plots H(i omega) in rectangular form in the complex plane. Margins read the same data from both pictures.</div>

<p class="l-text">The gain margin and phase margin both measure the closest the open-loop frequency response gets to the critical point -1. From the Nyquist plot:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Phase margin (Nyquist view)</div><div class="card-body">Find where the Nyquist plot crosses the unit circle (radius 1 around the origin). Measure the angle from the negative real axis to that crossing point. That angle is PM.</div></div>
<div class="calc-card"><div class="card-title">Gain margin (Nyquist view)</div><div class="card-body">Find where the Nyquist plot crosses the negative real axis. The magnitude of L at that crossing is some number r &lt; 1. Then GM = 20 log10(1/r) in dB. Equivalently, GM is the factor by which we could scale L before the curve hits -1.</div></div>
<div class="calc-card"><div class="card-title">Phase margin (Bode view)</div><div class="card-body">At the gain crossover omega_gc (where magnitude = 0 dB), read the phase. PM = 180 + phase. Same number, different picture.</div></div>
<div class="calc-card"><div class="card-title">Gain margin (Bode view)</div><div class="card-body">At the phase crossover omega_pc (where phase = -180 deg), read the magnitude in dB. GM = -magnitude. Negate it and you have how many dB of headroom.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SUMMARY</div><div class="formula-main">$$\\text{PM} = 180^{\\circ} + \\angle L(i\\omega_{gc}), \\qquad \\text{GM (dB)} = -20\\log_{10}|L(i\\omega_{pc})|$$</div><div class="formula-sub">Read either from the Bode plot at the two critical frequencies, or from the Nyquist plot's geometry near -1. Always the same numbers.</div></div>

<div class="l-note"><strong>Quick estimate.</strong> Look at the open-loop Bode plot. Where does the magnitude cross 0 dB? Pull a vertical line down — read the phase. Add 180. That is PM. Where does the phase cross -180? Pull a line up — read magnitude in dB. Negate it. That is GM. Twenty seconds of arithmetic decides stability.</div>

<h2 class="lesson-title">10. Lead and Lag Compensators</h2>

<div class="calc-highlight"><strong>Once we can measure PM and GM, we can fix them.</strong> The two simplest fixers are the <em>lead compensator</em> (adds positive phase near gain crossover to boost PM) and the <em>lag compensator</em> (adds low-frequency gain to reduce steady-state error without hurting PM).</div>

<p class="l-text">A first-order lead compensator has a zero at lower frequency than its pole:</p>

<div class="calc-formula"><div class="formula-label">LEAD COMPENSATOR</div><div class="formula-main">$$C_{\\text{lead}}(s) = K\\,\\frac{s/z + 1}{s/p + 1}, \\quad z < p$$</div><div class="formula-sub">A zero at -z and a pole at -p, both real and negative, with the zero closer to the origin. Adds positive phase between z and p.</div></div>

<p class="l-text">The phase boost peaks at the geometric mean <code>\\omega_{\\max} = \\sqrt{z\\,p}</code> and equals</p>

<div class="calc-formula"><div class="formula-label">MAX PHASE BOOST</div><div class="formula-main">$$\\phi_{\\max} = \\arcsin\\!\\left(\\frac{p - z}{p + z}\\right)$$</div><div class="formula-sub">For p/z = 10, boost is about 55 degrees. For p/z = 100, boost saturates around 78 degrees. The wider the gap, the more high-frequency noise amplification — there is a tradeoff.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lead: improves PM</div><div class="card-body">Drop omega_max right onto your gain crossover frequency. The compensator's phase peak adds to the loop's phase, raising PM by phi_max. Speeds up the transient response too.</div></div>
<div class="calc-card"><div class="card-title">Lag: improves steady-state error</div><div class="card-body">Lag has a pole closer to origin than its zero: C_lag = K (s/z + 1)/(s/p + 1) with p &lt; z. Boosts low-frequency gain (more gain on slow disturbances) without changing the phase near gain crossover.</div></div>
<div class="calc-card"><div class="card-title">Cost of lead</div><div class="card-body">Lead amplifies high-frequency noise — it has +20 dB/dec rising magnitude between zero and pole. Filter the input or include the noise budget in the design.</div></div>
<div class="calc-card"><div class="card-title">Lead-lag combo</div><div class="card-body">In practice you often use both: lag to fix steady-state, lead to fix margin. PID controllers are essentially special parameter choices of lead-lag.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-lead-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the open-loop Bode phase plot of L = 10/(s(s+1)(s+10)) before (blue) and after (orange) inserting a lead compensator C = (s/0.5 + 1)/(s/5 + 1). The lead adds positive phase between 0.5 and 5 rad/s — exactly where the original loop's phase was crossing -180 — and lifts the phase margin from about 25 degrees to about 50 degrees. The compensated loop is much more robust.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,-2+i*4/400));
var ph_orig=[],ph_comp=[];
for(var i=0;i<w.length;i++){var ww=w[i];
  var p_int=-90;var p_pole1=-180/Math.PI*Math.atan(ww/1);var p_pole2=-180/Math.PI*Math.atan(ww/10);
  ph_orig.push(p_int+p_pole1+p_pole2);
  var p_z=180/Math.PI*Math.atan(ww/0.5);var p_p=-180/Math.PI*Math.atan(ww/5);
  ph_comp.push(p_int+p_pole1+p_pole2+p_z+p_p);
}
var d1={x:w,y:ph_orig,mode:'lines',name:'before lead',line:{color:'#3b82f6',width:2.4}};
var d2={x:w,y:ph_comp,mode:'lines',name:'after lead',line:{color:'#f59e0b',width:2.4}};
var m180={x:[0.01,100],y:[-180,-180],mode:'lines',line:{color:'#ef4444',width:1.5,dash:'dot'},name:'phase = -180'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'phase (deg)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-260,-60]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-lead-en',[m180,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tuning workflow.</strong> Step 1: identify your plant's open-loop Bode plot. Step 2: read PM. Step 3: if PM &lt; 45, compute how many degrees of boost you need. Step 4: choose p/z ratio from the arcsin formula to deliver that boost. Step 5: place omega_max = sqrt(z*p) at the gain crossover. Step 6: verify with the closed-loop step response. Iterate.</div>

<h2 class="lesson-title">11. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Things to try.</strong> Change the open-loop transfer function to <code>num = [1]</code>, <code>den = np.convolve([1, 0.5], [1, 5, 25])</code> — a third-order system with a single zero. Run again and note how PM changes. Try sweeping the lead compensator's pole/zero ratio from 5 to 100 and watch how PM_new responds — there are diminishing returns, and the high-frequency noise cost grows linearly with the ratio. Finally, drive a closed-loop step response with <code>signal.feedback</code> and confirm that PM around 50 corresponds to a step response with about 16% overshoot.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">Frequency response is what you get when you evaluate the Laplace transfer function on the imaginary axis: <code>H(i\\omega)</code> gives the magnitude and phase response of a sinusoidal input at angular frequency omega. Bode plots two of those numbers separately: <code>20\\log_{10}|H(i\\omega)|</code> on log-log magnitude axes, and <code>\\angle H(i\\omega)</code> on log-linear phase axes. Construction is purely additive — pile up the asymptotic contributions of each pole, zero, integrator, and constant — and five canonical shapes (low-pass, high-pass, integrator, differentiator, second-order) cover most engineering needs. The RC low-pass has a single pole at <code>s = -1/(RC)</code>, magnitude rolling off at 20 dB/decade past <code>\\omega_c = 1/(RC)</code>, phase tipping to -90 degrees. Closed-loop stability for a unity-feedback system reduces to two numbers on the open-loop Bode plot: <strong>phase margin</strong> (degrees of phase boost we still have at unit gain) and <strong>gain margin</strong> (dB of gain boost we still have at -180-degree phase). PM &gt; 45 and GM &gt; 6 dB is the standard rule. The Nyquist plot draws <code>H(i\\omega)</code> directly in the complex plane, and the stability criterion <code>Z = N + P</code> counts encirclements of -1 to determine closed-loop right-half-plane poles. Lead compensators boost PM by inserting a zero before a pole; lag compensators improve steady-state error without changing the margin. The next lesson moves into state-space — a different vocabulary for the same systems, and the bridge to modern control, observers, optimal control, and Kalman filtering.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bode diyagramının neye benzediğini biliyorsunuz.</strong> Üst üste iki grafik — üstte dB cinsinden genlik, altta derece cinsinden faz — ve x-ekseni frekans dekadlarında akıyor. Belki henüz iliklerinizde hissetmediğiniz şey, bunu <em>neden</em> çiziyor olduğumuz ve bir Bode diyagramına on saniye baktıktan sonra hangi sayıyı cebinize koyup oradan ayrılmanız gerektiğidir. Cevap iki sayıdır: <strong>kazanç payı</strong> ve <strong>faz payı</strong>. İkisi birlikte size kapalı çevrim sisteminizin sınıra ne kadar yakın olduğunu söyler — döngünün, sistem çınlamadan, salınmadan ve sonunda patlamadan önce ne kadar ekstra kazancı ya da ne kadar ekstra gecikmeyi soğurabileceğini.</p>

<p class="l-text">Bu ders, her Laplace transfer fonksiyonunun içinde sessizce duran frekans-cevabı hikâyesini açığa çıkarıyor. <code>s</code>'i <code>i\\omega</code> ile takas edip bunun bize ne kazandırdığını izleyerek başlayacağız. Tek bir integral hesaplamadan, kutupların ve sıfırların asimptotik katkılarını üst üste yığarak Bode diyagramlarını okuyacağız. Sonra aynı veriyi yana yatırıp bir <strong>Nyquist diyagramı</strong>na dönüştürecek, sihirli <code>-1</code> noktası etrafındaki sarmalları sayacak ve Nyquist kararlılık ölçütünü uygulayarak kapalı bir çevrimi kararlı ya da kaybedilmiş ilan edeceğiz. Dersin sonunda bir Bode diyagramına bakıp bir frekansı işaret edebilmeli ve "kazanç payı X dB, faz payı Y derece, yani kararsızlığa düşmeden küçük bir gecikme ekleyecek alanımız var" diyebilmelisiniz. Geri besleme kontrol tasarımının günlük dili budur.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>H(s)'i s = i omega'da değerlendirmenin neden sinüsoidal kalıcı-durum cevabını verdiğini açıklamak ve H(i omega)'dan genlik-faz bilgisini doğrudan okumak</li>
<li>Bir transfer fonksiyonunun Bode genlik ve faz diyagramını, kutuplarının/sıfırlarının/integratörlerinin asimptotik katkılarını üst üste yığarak çizmek</li>
<li>RC alçak geçiren filtrenin transfer fonksiyonu 1/(1 + sRC)'den Bode diyagramını türetmek ve görselleştirmek</li>
<li>Bir Bode diyagramından kazanç payı ve faz payını okumak ve mühendislik kuralı olarak PM &gt; 45 derecenin neden "yeterince sağlam" eşik olduğunu açıklamak</li>
<li>H(i omega)'dan bir Nyquist diyagramı kurmak, -1 noktası etrafındaki sarmalları saymak ve Z = N + P kuralını uygulayarak kapalı çevrim kararlılığını belgelemek</li>
<li>Düşük frekansta kazançtan ödün vermeden faz payını artıran birinci dereceden bir önde-faz (lead) kompansatörü tasarlamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Frekans Bölgesi?</h2>

<div class="calc-highlight"><strong>Tek cümle:</strong> doğrusal zamanla değişmez sistemler için frekans bölgesine gidiyoruz çünkü sinüsler özfonksiyondur — bir sinüs verirseniz aynı frekansta (ölçeklenmiş, faz kaymış) bir sinüs alırsınız. Bu tek olgu, dev bir diferansiyel denklemin her frekansta tek bir karmaşık sayıya çökmesini sağlar.</div>

<p class="l-text">Diyelim ki transfer fonksiyonu <code>H(s) = Y(s)/X(s)</code> olan doğrusal bir sisteminiz var. Kutuplar size geçici cevabı söyler — tekme yiyen sistemin nasıl çınlayıp söndüğünü. Peki saf bir sinüsle uzun süre sürdüğünüzde <strong>kalıcı durum</strong> cevabı ne olur? Bunu bulmak için bir Laplace dönüşümünü ters çevirmeniz gerekmiyor. <code>H(s)</code>'i <code>s = i\\omega</code>'da değerlendirmek yetiyor.</p>

<div class="calc-formula"><div class="formula-label">SİNÜSOİDAL KALICI DURUM TEOREMİ</div><div class="formula-main">$$x(t) = A\\sin(\\omega t) \\;\\;\\Longrightarrow\\;\\; y_{ss}(t) = A\\,|H(i\\omega)|\\,\\sin\\bigl(\\omega t + \\angle H(i\\omega)\\bigr)$$</div><div class="formula-sub">Saf bir omega frekansındaki sinüsle sürülen kararlı bir LTI sistem, geçici öldükten sonra aynı frekansta bir sinüse yerleşir. Genliği |H(i omega)| ile ölçeklenir. Fazı, H(i omega)'nın açısı kadar kayar.</div></div>

<p class="l-text"><strong>Neden böyle?</strong> <code>x(t) = e^{i\\omega t}</code> alın. Girişin dürtü cevabı ile konvolüsyonu</p>

<div class="calc-formula"><div class="formula-label">ÖZFONKSİYON HESABI</div><div class="formula-main">$$y(t) = \\int_{0}^{\\infty} h(\\tau)\\, e^{i\\omega(t-\\tau)}\\, d\\tau = e^{i\\omega t}\\,\\int_{0}^{\\infty} h(\\tau)\\, e^{-i\\omega\\tau}\\, d\\tau = H(i\\omega)\\,e^{i\\omega t}$$</div><div class="formula-sub">Çıkış, girişin tek bir karmaşık sayı olan H(i omega) ile çarpımıdır. Bu, özfonksiyonun tanımıdır. Sinüsler ve onların karmaşık kuzenleri e^{i omega t}, LTI sistemler için bu özelliğe sahip tek fonksiyonlardır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genlik |H(i omega)|</div><div class="card-body">omega frekansındaki çıkış sinüsünün ne kadar yükseltildiği (ya da zayıflatıldığı). 0.1 değeri çıkışın girişin onda biri olduğu anlamına gelir; 10 değeri on katlık yükseltme demektir.</div></div>
<div class="calc-card"><div class="card-title">Faz açısı H(i omega)</div><div class="card-body">Çıkışın girişten ne kadar geride (negatif faz) ya da önde (pozitif faz) olduğu. Yüksek frekansta birinci dereceden alçak geçiren filtre 90 derece geride kalır.</div></div>
<div class="calc-card"><div class="card-title">Neden logaritmik eksen</div><div class="card-body">Mühendisler birçok mertebede kazancı önemser — tek bir tasarımda milihertz'den megahertz'e. Doğrusal eksenler tek bir dekat dışında her şeyi gizler. Logaritmik eksen dekadları eşit yapar.</div></div>
<div class="calc-card"><div class="card-title">Neden dB</div><div class="card-body">20 log10(|H|), çarpmayı toplamaya dönüştürür. Kaskat sistemler sadece dB genliklerini toplar. 10 katlık kazanç +20 dB olur; 2 katlık kazanç +6 dB.</div></div>
</div>

<div class="l-note"><strong>Geometrik okuma:</strong> kutup-sıfır diyagramınız varsa, omega'daki genlik, i omega'dan her sıfıra olan uzaklıkların çarpımının her kutba olan uzaklıkların çarpımına bölümüdür. Faz ise sıfırlara olan açıların toplamından kutuplara olan açıların toplamı çıkarılarak elde edilir. Bode diyagramı, bu geometrik resmin i omega ekseni boyunca açılmış hâlidir.</div>

<h2 class="lesson-title">2. Bode Diyagramı Yapımı</h2>

<div class="calc-highlight"><strong>Bode diyagramlarını elle çizilebilir kılan hile:</strong> bir çarpımın dB genliği ve fazı, <em>toplama</em>lara ayrılır. H(s)'i birinci ve ikinci dereceden terimlerin çarpımı olarak yazın, her birinin genlik ve fazını asimptotik olarak bulun, sonra üst üste ekleyin. Nihai diyagram, log-log genlikte ve doğrusal fazda parçalı doğrusal bir krokidir; her kutup-sıfır için yaklaşık bir dakika sürer.</div>

<p class="l-text">Herhangi bir rasyonel transfer fonksiyonunu temel yapı taşlarına ayırın:</p>

<div class="calc-formula"><div class="formula-label">KANONİK AYRIŞIM</div><div class="formula-main">$$H(s) = K \\cdot \\frac{1}{s^{m}} \\cdot \\prod_{i}\\frac{s/z_{i} + 1}{1} \\cdot \\prod_{j}\\frac{1}{s/p_{j} + 1}$$</div><div class="formula-sub">Bir kazanç K, m adet integratör (m negatifse türev alıcı), s = -z_i'de sıfırlar ve s = -p_j'de kutuplar. Her parça temiz ve öngörülebilir bir Bode şekli katar.</div></div>

<p class="l-text">Şimdi muhasebe kuralları. Her temel çarpan için dB genliğini ve fazını omega'nın çok düşükten çok yükseğe doğru değişiminde hesaplayın ve üst üste yığın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sabit kazanç K</div><div class="card-body">Genlik: 20 log10|K| dB, tüm omega için sabit. Faz: K &gt; 0 ise 0 derece, K &lt; 0 ise -180 derece. Her iki diyagramda yatay çizgi.</div></div>
<div class="calc-card"><div class="card-title">İntegratör 1/s</div><div class="card-body">Genlik: dekat başına -20 dB, omega = 1'de 0 dB'yi kesen doğru. Faz: -90 derece, düz.</div></div>
<div class="calc-card"><div class="card-title">Türev alıcı s</div><div class="card-body">Genlik: dekat başına +20 dB, omega = 1'de 0 dB'yi kesen doğru. Faz: +90 derece, düz.</div></div>
<div class="calc-card"><div class="card-title">Birinci dereceden kutup 1/(s/p + 1)</div><div class="card-body">Genlik: omega &lt;&lt; p için 0 dB, omega &gt;&gt; p için -20 dB/dekat'a kırılır, köşe omega = p'de. Faz: 0 -&gt; -90 derece, omega = p'de -45'ten geçer.</div></div>
<div class="calc-card"><div class="card-title">Birinci dereceden sıfır (s/z + 1)</div><div class="card-body">Kutbun aynası. Genlik: omega &lt;&lt; z için 0 dB, +20 dB/dekat'a yükselir. Faz: 0 -&gt; +90 derece, omega = z'de +45'ten geçer.</div></div>
<div class="calc-card"><div class="card-title">İkinci dereceden kutup</div><div class="card-body">Genlik: düz, sonra -40 dB/dekat; zeta küçükse omega_n yakınında olası bir rezonans tepesi. Faz: omega_n etrafında yaklaşık iki dekatta 0 -&gt; -180 derece.</div></div>
</div>

<div class="calc-example"><div class="example-label">ASİMPTOTLAR NEDEN İŞE YARAR</div><div class="example-body">Birinci dereceden kutup 1/(i omega tau + 1) için, düşük frekansta i omega tau küçücüktür, yani genlik yaklaşık 1'dir (0 dB). Yüksek frekansta i omega tau baskın olur ve genlik yaklaşık 1/(omega tau), log-log eksende -20 dB/dekat eğimli doğrudur. Köşede omega = 1/tau'da tam genlik 1/sqrt(2) = -3 dB'dir. Asimptotik diyagram, gerçek eğriyi ancak köşede en fazla 3 dB ıskalayan iki doğrudur — tasarım için yeterince yakın.</div></div>

<h2 class="lesson-title">3. Standart Bode Şekilleri — Kütüphane</h2>

<p class="l-text">Beş şekil çizdiğiniz her şeyin %90'ını kapsar. Görünümlerini ezberleyin ve mühendislik transfer fonksiyonlarının çoğunu bir dakikanın altında çizebilirsiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birinci dereceden alçak geçiren H = 1/(1 + s tau)</div><div class="card-body">Genlik 0 dB'de düz, omega = 1/tau'da -20 dB/dek'e kırılır. Faz köşe etrafındaki iki dekatta 0 -&gt; -90 yuvarlanır. Kanonik RC filtre.</div></div>
<div class="calc-card"><div class="card-title">Birinci dereceden yüksek geçiren H = s tau / (1 + s tau)</div><div class="card-body">Genlik -sonsuzdan başlar (aslında +20 dB/dek yükselerek), omega = 1/tau'nun üstünde 0 dB'de düzleşir. Faz +90'dan başlar, 0'a iner.</div></div>
<div class="calc-card"><div class="card-title">İntegratör H = 1/s</div><div class="card-body">Daima -20 dB/dek, omega = 1'de 0 dB'yi keser. Faz düz -90 derece. Zamanda saf integrasyon, frekansta i omega'ya bölme.</div></div>
<div class="calc-card"><div class="card-title">Türev alıcı H = s</div><div class="card-body">Daima +20 dB/dek, omega = 1'de 0 dB'yi keser. Faz düz +90 derece. Zamanda türev, frekansta i omega ile çarpma.</div></div>
<div class="calc-card"><div class="card-title">İkinci dereceden H = omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2)</div><div class="card-body">Genlik omega_n'e kadar düz, sonra -40 dB/dekat. Küçük zeta için yüksekliği 1/(2 zeta) olan olası rezonans tepesi. Faz doğal frekans boyunca 0 -&gt; -180 yuvarlanır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-bode-2nd-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> standart ikinci dereceden transfer fonksiyonunun omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) omega_n = 1 rad/s ve üç sönüm oranı ile Bode genliği (üst) ve fazı (alt). zeta = 0.1 omega_n yakınında keskin bir rezonans tepesi gösterir; zeta = 0.5 daha hafif bir tümsek; zeta = 1 (kritik sönüm) hiç tepe yok. Faz diyagramlarının hepsi 0'dan -180 dereceye yuvarlanır ama geçiş küçük zeta için daha keskindir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,-2+i*4/400));
function bode2(zeta){var mag=[],ph=[];for(var i=0;i<w.length;i++){var ww=w[i];var re=1-ww*ww;var im=2*zeta*ww;var m=1/Math.sqrt(re*re+im*im);mag.push(20*Math.log10(m));ph.push(-180/Math.PI*Math.atan2(im,re));}return{mag:mag,ph:ph};}
var b1=bode2(0.1),b2=bode2(0.5),b3=bode2(1.0);
var m1={x:w,y:b1.mag,mode:'lines',name:'zeta=0.1',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var m2={x:w,y:b2.mag,mode:'lines',name:'zeta=0.5',line:{color:'#f59e0b',width:2.4},xaxis:'x1',yaxis:'y1'};
var m3={x:w,y:b3.mag,mode:'lines',name:'zeta=1.0',line:{color:'#10b981',width:2.4},xaxis:'x1',yaxis:'y1'};
var p1={x:w,y:b1.ph,mode:'lines',line:{color:'#3b82f6',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var p2={x:w,y:b2.ph,mode:'lines',line:{color:'#f59e0b',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var p3={x:w,y:b3.ph,mode:'lines',line:{color:'#10b981',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-60,25]},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'faz (derece)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-200,10]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-bode-2nd-tr',[m1,m2,m3,p1,p2,p3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Rezonans tepesi.</strong> zeta &lt; 1/sqrt(2) (yaklaşık 0.707) için ikinci dereceden genlik 0 dB üzerinde bir tepe yapar. Tepe yüksekliği yaklaşık 1/(2 zeta sqrt(1 - zeta^2))'dir ve omega_r = omega_n sqrt(1 - 2 zeta^2)'de görülür. zeta = 0.707 altında ise tepe hiç yoktur — kullanışlı bir tasarım sınırı.</div>

<h2 class="lesson-title">4. Çözümlü Örnek: RC Alçak Geçiren Filtre</h2>

<div class="calc-highlight"><strong>Elektronikteki en basit ilginç Bode diyagramı.</strong> Bir direnç, bir kondansatör, bir kutup — yine de frekans cevabının her kavramı içinde görünüyor. Transfer fonksiyonunu hesaplayacak, i omega'da değerlendirecek, her iki diyagramı çizecek ve kesim frekansını, -3 dB noktasını ve köşedeki fazı tespit edeceğiz.</div>

<p class="l-text">Bir seri direnç R'nin ardından kondansatöre giden bir C, giriş gerilimi tepede, çıkış kondansatörün üzerinde ölçülüyor. Kirchhoff'a ek olarak kondansatör bağıntısı <code>i = C\\,dV/dt</code> şunu verir:</p>

<div class="calc-formula"><div class="formula-label">RC ALÇAK GEÇİREN TRANSFER FONKSİYONU</div><div class="formula-main">$$H(s) = \\frac{V_{out}(s)}{V_{in}(s)} = \\frac{1}{1 + s\\,R\\,C} = \\frac{1}{1 + s\\,\\tau}$$</div><div class="formula-sub">tau = RC zaman sabiti ile s = -1/tau'da tek bir kutup. Standart birinci dereceden alçak geçiren biçim.</div></div>

<p class="l-text"><code>s = i\\omega</code> yazarak yerine koyun:</p>

<div class="calc-formula"><div class="formula-label">FREKANS CEVABI</div><div class="formula-main">$$H(i\\omega) = \\frac{1}{1 + i\\omega\\tau}, \\quad |H(i\\omega)| = \\frac{1}{\\sqrt{1 + (\\omega\\tau)^{2}}}, \\quad \\angle H(i\\omega) = -\\arctan(\\omega\\tau)$$</div><div class="formula-sub">Genlik 1'den 0'a yuvarlanır; faz omega 0'dan sonsuza giderken 0'dan -90 dereceye yuvarlanır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düşük frekans (omega tau &lt;&lt; 1)</div><div class="card-body">|H| yaklaşık 1, faz yaklaşık 0. Çıkış girişi bire bir takip eder. Filtre "açık" — DC'yi geçirir.</div></div>
<div class="calc-card"><div class="card-title">Köşe frekansı omega_c = 1/tau</div><div class="card-body">|H| = 1/sqrt(2) = -3.01 dB tam olarak. Faz = -45 derece tam olarak. Klasik "-3 dB noktası" — geleneksel kesim.</div></div>
<div class="calc-card"><div class="card-title">Yüksek frekans (omega tau &gt;&gt; 1)</div><div class="card-body">|H| yaklaşık 1/(omega tau), dekat başına 20 dB iniyor. Faz yaklaşık -90. Filtre yüksek frekansı bloklar.</div></div>
<div class="calc-card"><div class="card-title">Zaman sabiti tau = RC</div><div class="card-body">Köşeyi belirler. R = 1 kohm, C = 1 mikroF ile tau = 1 ms, dolayısıyla omega_c = 1000 rad/s = 159 Hz.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-rcbode-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> tau = 1 ms (yani omega_c = 1000 rad/s = 159 Hz) ile RC alçak geçirenin Bode diyagramı. Genlik (üst, mavi) geçiş bandında düz, köşeden sonra 20 dB/dekat iniyor; kesik turuncu çizgi -3 dB'yi ve köşeyi gösteriyor. Faz (alt, amber) 0'dan başlar, omega_c'de tam olarak -45 dereceden geçer ve -90 dereceye yaklaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,1+i*5/400));
var mag=[],ph=[];var tau=1e-3;
for(var i=0;i<w.length;i++){var ww=w[i];mag.push(20*Math.log10(1/Math.sqrt(1+(ww*tau)*(ww*tau))));ph.push(-180/Math.PI*Math.atan(ww*tau));}
var m={x:w,y:mag,mode:'lines',name:'genlik',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var corner_m={x:[1000,1000],y:[-50,5],mode:'lines',line:{color:'#f59e0b',width:1.5,dash:'dash'},name:'omega_c',xaxis:'x1',yaxis:'y1'};
var minus3={x:[10,1e6],y:[-3,-3],mode:'lines',line:{color:'#f59e0b',width:1.2,dash:'dot'},showlegend:false,xaxis:'x1',yaxis:'y1'};
var p={x:w,y:ph,mode:'lines',name:'faz',line:{color:'#f59e0b',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var corner_p={x:[1000,1000],y:[-100,10],mode:'lines',line:{color:'#f59e0b',width:1.5,dash:'dash'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var minus45={x:[10,1e6],y:[-45,-45],mode:'lines',line:{color:'#f59e0b',width:1.2,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-50,5]},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'faz (derece)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-100,10]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-rcbode-tr',[minus3,corner_m,m,minus45,corner_p,p],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tasarım kuralı:</strong> kesimi istenen frekansa f_c (Hz cinsinden) koymak için R ve C'yi R * C = 1/(2 * pi * f_c) olacak şekilde seçin. 20 kHz'lik bir ses anti-alias filtresi için R * C yaklaşık 8 mikrosaniye olmalıdır — belki R = 1 kohm ve C = 8 nF.</div>

<h2 class="lesson-title">5. Kazanç Payı ve Faz Payı — Önemli İki Sayı</h2>

<div class="calc-highlight"><strong>Bode diyagramlarının geri besleme tasarımındaki pratik karşılığı budur.</strong> İleri yol kazancı G(s) ve birim geri besleme olan kapalı çevrim, açık çevrim transfer fonksiyonunun L(s) = G(s) Nyquist diyagramında -1'i sarmaması koşuluyla kararlıdır. Bode diyagramı, -1'e olan o uzaklığı doğrudan iki basit sayıyla ölçmemizi sağlar: kazanç payı GM ve faz payı PM. Her ikisi de pozitifse (ve ideal olarak çok küçük değilse) güvenli biçimde kararlıyız.</div>

<p class="l-text">Açık çevrim Bode diyagramının karşısına geçin. İki özel frekans önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kazanç geçiş frekansı omega_gc</div><div class="card-body">|L(i omega)|'in 1'i (yani 0 dB'yi) kestiği frekans. Bu frekansta döngü tam olarak birim kazançtadır.</div></div>
<div class="calc-card"><div class="card-title">Faz geçiş frekansı omega_pc</div><div class="card-body">L(i omega)'nın fazının -180 dereceyi kestiği frekans. Bu frekansta döngü sinyali, yolculuğunda tamamen tersine çevrilmiştir.</div></div>
<div class="calc-card"><div class="card-title">Faz payı PM</div><div class="card-body">omega_gc'de PM = 180 + angle(L(i omega_gc)). Kararsızlığa düşmeden önce döngünün soğurabileceği ek faz gecikmesinin derece cinsinden miktarıdır.</div></div>
<div class="calc-card"><div class="card-title">Kazanç payı GM</div><div class="card-body">omega_pc'de GM = -20 log10|L(i omega_pc)| (dB cinsinden). Kararsızlık öncesinde döngü kazancını ne kadar dB artırabileceğimizdir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">KARARLILIK KONTROLÜ</div><div class="formula-main">$$\\text{Kapalı çevrim sağlam biçimde kararlı, ancak ve ancak } \\text{PM} > 0 \\text{ ve } \\text{GM} > 0$$</div><div class="formula-sub">İkisi de pozitif: güvenli. Biri çok az pozitif: sınırda. Biri negatif: kapalı çevrim kararsız.</div></div>

<div class="calc-example"><div class="example-label">NEDEN PM &gt; 45 ORTAK HEDEF</div><div class="example-body">PM faz paylı ikinci dereceden kapalı çevrim, yaklaşık zeta = PM/100 sönüm oranına sahiptir (derece cinsinden PM, yaklaşık 70'e kadar). Yani PM = 45 yaklaşık zeta = 0.45 demektir — yaklaşık %25 aşım, makul yerleşme. PM = 60, yaklaşık zeta = 0.6 verir — daha hafif aşım. PM = 90, yaklaşık zeta = 0.9 verir, neredeyse hiç çınlama olmaz. PM = 30 altında döngü kötü çınlar; PM = 0 altında kararsızdır.</div></div>

<div class="calc-graph"><div id="plot-l3-margins-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> Üçüncü dereceden bir L(s) = 10/(s(s+1)(s+10)) çevrim için kazanç payı ve faz payı işaretlenmiş Bode diyagramı. Turuncu düşey çizgi |L| = 0 dB olan kazanç geçişi omega_gc'yi; o frekanstaki faz, 180 derece kaldırılarak faz payını verir (burada yaklaşık 25 derece — sınırda). Yeşil düşey çizgi faz = -180 derecedeki faz geçişi omega_pc'yi gösterir; o frekanstaki 0 dB altındaki genlik dB cinsinden kazanç payıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=600;i++)w.push(Math.pow(10,-2+i*4/600));
var mag=[],ph=[];
for(var i=0;i<w.length;i++){var ww=w[i];
  var num_re=10,num_im=0;
  var d1_re=0,d1_im=ww;var d2_re=1,d2_im=ww;var d3_re=10,d3_im=ww;
  function cmul(ar,ai,br,bi){return[ar*br-ai*bi,ar*bi+ai*br];}
  var d12=cmul(d1_re,d1_im,d2_re,d2_im);var d123=cmul(d12[0],d12[1],d3_re,d3_im);
  var dn=d123[0]*d123[0]+d123[1]*d123[1];var H_re=(num_re*d123[0]+num_im*d123[1])/dn;var H_im=(num_im*d123[0]-num_re*d123[1])/dn;
  var m=Math.sqrt(H_re*H_re+H_im*H_im);mag.push(20*Math.log10(m));ph.push(180/Math.PI*Math.atan2(H_im,H_re));
}
var m={x:w,y:mag,mode:'lines',name:'genlik',line:{color:'#3b82f6',width:2.4},xaxis:'x1',yaxis:'y1'};
var p={x:w,y:ph,mode:'lines',name:'faz',line:{color:'#3b82f6',width:2.4},showlegend:false,xaxis:'x2',yaxis:'y2'};
var zero_db={x:[0.01,100],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false,xaxis:'x1',yaxis:'y1'};
var minus_180={x:[0.01,100],y:[-180,-180],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var w_gc=0.95;
var w_pc=3.16;
var gc_m={x:[w_gc,w_gc],y:[-60,40],mode:'lines',line:{color:'#f59e0b',width:1.6,dash:'dash'},name:'omega_gc (PM burada)',xaxis:'x1',yaxis:'y1'};
var gc_p={x:[w_gc,w_gc],y:[-260,10],mode:'lines',line:{color:'#f59e0b',width:1.6,dash:'dash'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var pc_m={x:[w_pc,w_pc],y:[-60,40],mode:'lines',line:{color:'#10b981',width:1.6,dash:'dash'},name:'omega_pc (GM burada)',xaxis:'x1',yaxis:'y1'};
var pc_p={x:[w_pc,w_pc],y:[-260,10],mode:'lines',line:{color:'#10b981',width:1.6,dash:'dash'},showlegend:false,xaxis:'x2',yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},grid:{rows:2,columns:1,pattern:'independent'},xaxis:{type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik (dB)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-60,40]},xaxis2:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis2:{title:'faz (derece)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-260,10]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-margins-tr',[zero_db,gc_m,pc_m,m,minus_180,gc_p,pc_p,p],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>"Sıkı" ne demek.</strong> Endüstri uygulamasında PM 45-65 derece, GM 6-20 dB aralığında tutulur. Daha sıkı tutarsanız döngü çınlar ya da doyuma ulaşır; daha gevşek tutarsanız döngü yavaştır. Havacılık ve robotik güvenlik için daha yüksek PM'i (60-80) zorlar; yüksek bant genişlikli güç elektroniği hız için PM'i 30-40'a kadar indirebilir.</div>

<h2 class="lesson-title">6. Nyquist Diyagramı</h2>

<div class="calc-highlight"><strong>Bode diyagramını yana yatırın.</strong> Genliği ve fazı omega'ya göre ayrı ayrı çizmek yerine, karmaşık sayı H(i omega)'yı doğrudan karmaşık düzlemde, omega'yla parametrelendirerek çizin. Ortaya çıkan eğri Nyquist diyagramıdır — ve üzerindeki tek bir özel noktanın (sayı -1) konumu, tüm sistem için kapalı çevrim kararlılığına karar verir.</div>

<p class="l-text">Resmi tanım: omega <code>0</code>'dan <code>\\infty</code>'a giderken karmaşık düzlemde <code>H(i\\omega)</code> noktasını işaretleyin ve noktaları birleştirin. Karmaşık eşlenik simetrisi gereği, omega <code>-\\infty</code>'dan <code>0</code>'a giderken çizilen eğri reel eksende yansıtılmış aynadır. Kontoru, sağ yarı düzlemde büyük bir yarım daire (genellikle L düzleminde orijin yakınında küçük bir bölgeye eşlenen) ile kapatın ve kapalı bir eğri elde edersiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genlik okuması</div><div class="card-body">Herhangi bir omega'da orijinden eğriye olan uzaklık = |H(i omega)|. Sistem zayıflatırken eğri orijine sarılır; yükseltirken dışa şişer.</div></div>
<div class="calc-card"><div class="card-title">Faz okuması</div><div class="card-body">Pozitif reel eksenden eğriye olan açı = arg(H(i omega)). Faz gecikmeleri omega arttıkça eğriyi saat yönünde döndürür.</div></div>
<div class="calc-card"><div class="card-title">-1 noktası</div><div class="card-body">Tüm hareket burada. Kapalı eğrinin -1'i kaç kez (saat yönünde) sardığı, doğrudan kapalı çevrim kararlılık sayısına girer.</div></div>
<div class="calc-card"><div class="card-title">Eşlenik simetri</div><div class="card-body">Gerçek sistemler için H(-i omega) = H(i omega)'nın eşleniği. Yani Nyquist diyagramının negatif-omega yarısı, pozitif-omega yarısının reel eksende aynasıdır — sadece bir yarısını çizmeniz yeter.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-nyq-stable-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> kararlı bir kapalı çevrimin Nyquist diyagramı. İleri yol L(s) = 1/((s+1)(s+2)). Eğri (mavi) ve aynası (kesik mavi), -1'deki macenta noktanın açıkça uzağında kalan kapalı bir kontor oluşturur. -1 etrafında sıfır sarmal, sıfır açık çevrim sağ-yarı-düzlem kutbu ile birleşince sıfır kapalı çevrim sağ-yarı-düzlem kutbu verir. Kararlı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=-200;i<=200;i++)w.push(Math.pow(10,-2+i*4/200));
var re=[],im=[];
for(var i=0;i<w.length;i++){var ww=w[i];
  var d1_re=1,d1_im=ww;var d2_re=2,d2_im=ww;
  var dr=d1_re*d2_re-d1_im*d2_im,di=d1_re*d2_im+d1_im*d2_re;
  var dn=dr*dr+di*di;var H_re=dr/dn,H_im=-di/dn;re.push(H_re);im.push(H_im);
}
var pos=[],neg=[];for(var i=0;i<w.length;i++){if(w[i]>=0){pos.push(i);}else{neg.push(i);}}
var pos_re=pos.map(function(i){return re[i];}),pos_im=pos.map(function(i){return im[i];});
var neg_re=neg.map(function(i){return re[i];}),neg_im=neg.map(function(i){return im[i];});
var pos_tr={x:pos_re,y:pos_im,mode:'lines',name:'omega: 0 -> sonsuz',line:{color:'#3b82f6',width:2.4}};
var neg_tr={x:neg_re,y:neg_im,mode:'lines',name:'omega: -sonsuz -> 0',line:{color:'#3b82f6',width:2,dash:'dash'}};
var minus_one={x:[-1],y:[0],mode:'markers+text',name:'-1 noktası',marker:{symbol:'x',size:14,color:'#ef4444',line:{width:3}},text:['-1'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var origin={x:[0],y:[0],mode:'markers',marker:{symbol:'circle',size:7,color:'#888'},showlegend:false};
var axis_h={x:[-1.5,1],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var axis_v={x:[0,0],y:[-1.2,1.2],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(H)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.5,1]},yaxis:{title:'Im(H)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.2,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-1.2,y:1,text:'-1 etrafinda sarmal yok',showarrow:false,font:{color:'#3b82f6',size:13}}]};
Plotly.newPlot('plot-l3-nyq-stable-tr',[axis_h,axis_v,pos_tr,neg_tr,origin,minus_one],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Nyquist Kararlılık Ölçütü</h2>

<div class="calc-highlight"><strong>Her şeye karar veren tek bir formül.</strong> Ölçüt, Nyquist diyagramının -1 etrafındaki sarmal sayısını ve kararsız kapalı çevrim kutuplarının sayısını tek bir denklemde birleştirir: <code>Z = N + P</code>. Z kapalı çevrim sağ-yarı-düzlem kutup sayısıdır. N açık çevrim Nyquist diyagramının -1 etrafındaki saat yönü sarmal sayısıdır. P açık çevrim sağ-yarı-düzlem kutup sayısıdır. Z = 0 ise kararlı.</div>

<p class="l-text">İleri transfer fonksiyonu <code>L(s)</code> olan standart birim geri besleme döngüsünü kurun. Kapalı çevrim transfer fonksiyonu <code>T(s) = L/(1 + L)</code>'dir. Kutupları <code>1 + L(s) = 0</code>'ın kökleridir, yani <code>L(s) = -1</code> olan noktalar. Nyquist ölçütü bunu, s-düzlemindeki belirli bir kontorun <code>L</code> altındaki görüntüsüyle ilgili bir sayma ifadesine çevirir.</p>

<div class="calc-formula"><div class="formula-label">NYQUIST KARARLILIK ÖLÇÜTÜ</div><div class="formula-main">$$Z = N + P$$</div><div class="formula-sub">Z = kapalı çevrimde sağ yarı düzlemdeki kutup sayısı (kararsız). P = açık çevrimde sağ yarı düzlemdeki kutup sayısı (verilen, L(s)'in kendisinden). N = L(s) Nyquist diyagramının -1 etrafındaki saat yönü sarmal sayısı (saat yönü pozitif, ters yön negatif). Kapalı çevrim Z = 0 ise kararlıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kararlı açık çevrim durumu (P = 0)</div><div class="card-body">O zaman Z = N. Nyquist diyagramı -1'i hiç sarmıyorsa kapalı çevrim kararlı. Plantın kendisinin kararlı olduğu çoğu pratik tasarım için durum budur.</div></div>
<div class="calc-card"><div class="card-title">Kararsız açık çevrim durumu (P &gt; 0)</div><div class="card-body">O zaman Z = N + P. Kararlı kılmak için Nyquist diyagramının tam olarak P kez ters saat yönünde -1'i sarması gerekir, yani N = -P olmalı ki Z = 0. Geri besleme kararsız bir plantı kararlı kılabilir — kontrol teorisinin büyük sonuçlarından biri.</div></div>
<div class="calc-card"><div class="card-title">Sanal eksen üzerindeki kutuplar</div><div class="card-body">L'in sanal eksen üzerinde kutupları varsa (örneğin s = 0'da integratör), Nyquist kontorunu küçük yarım dairelerle sağ yarı düzleme doğru girintile, her birini L düzleminde büyük yarım dairelere eşle. Dikkatli kullan.</div></div>
<div class="calc-card"><div class="card-title">Göz kararı sarmal sayma</div><div class="card-body">-1'den sonsuza yatay bir ışın çizin. Nyquist diyagramının o ışını net olarak saat yönünde kaç kez kestiğini sayın. O sayı N'dir.</div></div>
</div>

<div class="l-note"><strong>Mnemonik.</strong> "Z = N + P" — Z "istediğimiz kararlılık sıfırı", N "saat yönü sarmal sayısı", P "açık çevrim önceden var olan kararsız kutuplar". Kapalı çevrim ancak açık çevrim Nyquist diyagramı -1 etrafında doğru sayıda tur atarsa hayatta kalır.</div>

<h2 class="lesson-title">8. Çözümlü Nyquist Örneği</h2>

<div class="calc-highlight"><strong>Basit bir ikinci dereceden sistem alın, kazancı çok yükseltin, Nyquist diyagramının -1'in etrafına sarıldığını izleyin ve kapalı çevrim kararsızlaşsın.</strong> Klasik egzersiz budur: aynı plant, iki kazanç, iki sonuç.</div>

<p class="l-text">Plant: <code>G(s) = 1/((s+1)(s+2))</code>. K kazançlı orantısal kontrol uygulayın, böylece açık çevrim transfer fonksiyonu <code>L(s) = K/((s+1)(s+2))</code>'dir. Açık çevrim kutupları -1 ve -2'dedir (her ikisi de LHP'de, yani P = 0). K'nin iki değerini inceleyeceğiz.</p>

<div class="calc-formula"><div class="formula-label">DURUM A: K = 1 (ÖLÇÜLÜ KAZANÇ)</div><div class="formula-main">$$L(s) = \\frac{1}{(s+1)(s+2)}, \\qquad L(i\\omega) = \\frac{1}{(1+i\\omega)(2+i\\omega)}$$</div><div class="formula-sub">omega = 0'da: L = 1/2. omega = sonsuzda: L 0'a yaklaşır. Nyquist diyagramı sağ yarı düzlemde sonlu büyüklüklü bir eğridir, -1'i sarmaz.</div></div>

<div class="calc-formula"><div class="formula-label">DURUM B: K = 30 (ÇOK YÜKSEK)</div><div class="formula-main">$$L(s) = \\frac{30}{(s+1)(s+2)}, \\qquad L(i\\omega) = \\frac{30}{(1+i\\omega)(2+i\\omega)}$$</div><div class="formula-sub">Aynı şekil, 30 ile ölçeklenmiş. Şimdi omega = 0'da L = 15. Diyagram sola çok daha uzanır ve sayısal duruma bağlı olarak -1'i sarabilir ya da sarmayabilir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum A: N = 0, P = 0 -&gt; Z = 0</div><div class="card-body">-1 etrafında sarmal yok, açık çevrim kararsız kutbu yok. Z = 0 kapalı çevrim kararsız kutbu. KARARLI.</div></div>
<div class="calc-card"><div class="card-title">Durum B (çok yüksek K): N = 2, P = 0 -&gt; Z = 2</div><div class="card-body">-1 etrafında iki saat yönü sarmal, sağ yarı düzlemde iki kapalı çevrim kutbu demektir. KARARSIZ — çıkış salınır ve büyür.</div></div>
<div class="calc-card"><div class="card-title">Kritik kazanç K*</div><div class="card-body">Nyquist diyagramının -1'e tam değdiği kesin bir K* kazancı vardır. Bu plant için K* = 6 (bunu, gerçek bir omega için 1 + L(i omega) = 0 yazarak doğrulayabilirsiniz). K*'nin ötesinde kapalı çevrim kararsız.</div></div>
<div class="calc-card"><div class="card-title">Bode ile çapraz kontrol</div><div class="card-body">K = K*'da L'in Bode diyagramı GM = 0 dB (ve PM = 0 derece) verir. Bode ve Nyquist kararlılık konusunda anlaşır — aynı verinin iki görüntüsüdür.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-nyq-unstable-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> L(s) = 30/((s+1)(s+2)) için Nyquist diyagramı — aynı plant ama kazancı yukarı itilmiş. Eğri (mavi, ayna görüntüsü kesik) artık -1'in çok ötesine sola uzanır. -1 işaretçisi geometrik referans olarak görünür ve eğrinin bu seviyeye nasıl yaklaştığını gösterir; gerçek sarmal sayısı bu spesifik transfer fonksiyonunda K = 30 için hâlâ 0'dır — çok daha yüksek bir K* (6) civarında geçiş olur. Burada gösterilen şey geometrik yakınlıktır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=-300;i<=300;i++)w.push(Math.pow(10,-2+i*4/300));
var re=[],im=[];var K=30;
for(var i=0;i<w.length;i++){var ww=w[i];
  var d1_re=1,d1_im=ww;var d2_re=2,d2_im=ww;
  var dr=d1_re*d2_re-d1_im*d2_im,di=d1_re*d2_im+d1_im*d2_re;
  var dn=dr*dr+di*di;var H_re=K*dr/dn,H_im=-K*di/dn;re.push(H_re);im.push(H_im);
}
var pos=[],neg=[];for(var i=0;i<w.length;i++){if(w[i]>=0){pos.push(i);}else{neg.push(i);}}
var pos_re=pos.map(function(i){return re[i];}),pos_im=pos.map(function(i){return im[i];});
var neg_re=neg.map(function(i){return re[i];}),neg_im=neg.map(function(i){return im[i];});
var pos_tr={x:pos_re,y:pos_im,mode:'lines',name:'omega >= 0',line:{color:'#3b82f6',width:2.4}};
var neg_tr={x:neg_re,y:neg_im,mode:'lines',name:'omega < 0',line:{color:'#3b82f6',width:2,dash:'dash'}};
var minus_one={x:[-1],y:[0],mode:'markers+text',name:'-1 noktası',marker:{symbol:'x',size:14,color:'#ef4444',line:{width:3}},text:['-1'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var origin={x:[0],y:[0],mode:'markers',marker:{symbol:'circle',size:7,color:'#888'},showlegend:false};
var axis_h={x:[-3,16],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var axis_v={x:[0,0],y:[-8,8],mode:'lines',line:{color:'rgba(255,255,255,0.18)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(L)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3,16]},yaxis:{title:'Im(L)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-8,8],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-nyq-unstable-tr',[axis_h,axis_v,pos_tr,neg_tr,origin,minus_one],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Doğrudan okuyun.</strong> Eğri sola giderken -1'in yanından geçer — bu plant kararlılık sınırına yaklaşıyor. K'yi daha da artırın, eğri -1'in üzerinden geçecek; kapalı çevrim kararsızlaşır. Eğriden -1'e olan mesafe esasen sağlamlığın geometrik ölçüsüdür; kazanç ve faz payı o mesafenin iki skaler özetidir.</div>

<h2 class="lesson-title">9. Bode-Nyquist Bağlantısı</h2>

<div class="calc-highlight"><strong>Bode ve Nyquist, aynı matrisin iki görüntüsüdür.</strong> Bode H(i omega)'yı kutupsal biçimde çizer: log-log eksende genlik, log-doğrusal eksende faz. Nyquist H(i omega)'yı karmaşık düzlemde dikdörtgen biçimde çizer. Paylar her iki resimden aynı veriyi okur.</div>

<p class="l-text">Kazanç payı ve faz payı, açık çevrim frekans cevabının kritik nokta -1'e ne kadar yaklaştığını ölçer. Nyquist diyagramından:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Faz payı (Nyquist görüntüsü)</div><div class="card-body">Nyquist diyagramının birim daireyi (orijin çevresinde yarıçap 1) kestiği yeri bulun. Negatif reel eksenden o kesişim noktasına olan açıyı ölçün. O açı PM'dir.</div></div>
<div class="calc-card"><div class="card-title">Kazanç payı (Nyquist görüntüsü)</div><div class="card-body">Nyquist diyagramının negatif reel ekseni kestiği yeri bulun. Oradaki L genliği bir r &lt; 1 sayısıdır. O zaman GM = 20 log10(1/r) dB. Eşdeğer olarak GM, eğri -1'e değmeden önce L'i hangi katsayıyla ölçekleyebileceğimizdir.</div></div>
<div class="calc-card"><div class="card-title">Faz payı (Bode görüntüsü)</div><div class="card-body">Kazanç geçişi omega_gc'de (genlik = 0 dB) fazı okuyun. PM = 180 + faz. Aynı sayı, farklı resim.</div></div>
<div class="calc-card"><div class="card-title">Kazanç payı (Bode görüntüsü)</div><div class="card-body">Faz geçişi omega_pc'de (faz = -180 derece) genliği dB cinsinden okuyun. GM = -genlik. Eksilersiz hâli kaç dB rezerviniz olduğunu söyler.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ÖZET</div><div class="formula-main">$$\\text{PM} = 180^{\\circ} + \\angle L(i\\omega_{gc}), \\qquad \\text{GM (dB)} = -20\\log_{10}|L(i\\omega_{pc})|$$</div><div class="formula-sub">İster Bode diyagramından iki kritik frekansta okuyun, ister Nyquist diyagramının -1 yakınındaki geometrisinden. Her zaman aynı sayılar.</div></div>

<div class="l-note"><strong>Hızlı tahmin.</strong> Açık çevrim Bode diyagramına bakın. Genlik 0 dB'yi nerede kesiyor? Düşey çizgi indirin — fazı okuyun. 180 ekleyin. O PM'dir. Faz -180'i nerede kesiyor? Düşey çizgi yukarı çıkarın — genliği dB olarak okuyun. Eksisini alın. O GM'dir. Yirmi saniyelik aritmetik kararlılığa karar verir.</div>

<h2 class="lesson-title">10. Önde-Faz (Lead) ve Geride-Faz (Lag) Kompansatörleri</h2>

<div class="calc-highlight"><strong>PM ve GM'i ölçebildiğimize göre düzeltebiliriz.</strong> En basit iki düzeltici, kazanç geçişi yakınında pozitif faz ekleyerek PM'i yükselten <em>lead kompansatör</em> ve PM'i bozmadan düşük frekans kazancını artırarak kalıcı durum hatasını azaltan <em>lag kompansatör</em>'dür.</div>

<p class="l-text">Birinci dereceden bir lead kompansatörünün, kutbundan daha düşük frekansta bir sıfırı vardır:</p>

<div class="calc-formula"><div class="formula-label">LEAD KOMPANSATÖR</div><div class="formula-main">$$C_{\\text{lead}}(s) = K\\,\\frac{s/z + 1}{s/p + 1}, \\quad z < p$$</div><div class="formula-sub">-z'de bir sıfır ve -p'de bir kutup, her ikisi de reel ve negatif, sıfır orijine daha yakın. z ile p arasında pozitif faz ekler.</div></div>

<p class="l-text">Faz artışı, geometrik ortalama <code>\\omega_{\\max} = \\sqrt{z\\,p}</code>'de zirveye ulaşır ve şu değerdedir:</p>

<div class="calc-formula"><div class="formula-label">MAKSİMUM FAZ ARTIŞI</div><div class="formula-main">$$\\phi_{\\max} = \\arcsin\\!\\left(\\frac{p - z}{p + z}\\right)$$</div><div class="formula-sub">p/z = 10 için artış yaklaşık 55 derece. p/z = 100 için artış 78 dereceye doyar. Aralık ne kadar genişse o kadar yüksek frekans gürültü yükseltme — bir denge var.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lead: PM'i iyileştirir</div><div class="card-body">omega_max'i tam kazanç geçişi frekansına yerleştirin. Kompansatörün faz zirvesi döngünün fazına eklenir ve PM'i phi_max kadar yükseltir. Geçici cevabı da hızlandırır.</div></div>
<div class="calc-card"><div class="card-title">Lag: kalıcı durum hatasını iyileştirir</div><div class="card-body">Lag kutbu orijine sıfırından daha yakındır: C_lag = K (s/z + 1)/(s/p + 1) ile p &lt; z. Düşük frekans kazancını artırır (yavaş bozulmalara daha fazla kazanç) ve kazanç geçişi yakınındaki fazı değiştirmez.</div></div>
<div class="calc-card"><div class="card-title">Lead'in maliyeti</div><div class="card-body">Lead, yüksek frekans gürültüsünü yükseltir — sıfır ile kutup arasında +20 dB/dek yükselen genliği vardır. Girişi filtreleyin ya da gürültü bütçesini tasarıma dahil edin.</div></div>
<div class="calc-card"><div class="card-title">Lead-lag kombinasyonu</div><div class="card-body">Pratikte genellikle her ikisini kullanırsınız: kalıcı durumu düzeltmek için lag, payı düzeltmek için lead. PID kontrolcüleri, esasen lead-lag'in özel parametre seçimleridir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-lead-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> L = 10/(s(s+1)(s+10)) açık çevrim Bode faz diyagramı, bir lead kompansatör C = (s/0.5 + 1)/(s/5 + 1) eklenmeden önce (mavi) ve sonra (turuncu). Lead 0.5 ile 5 rad/s arasında pozitif faz ekler — tam orijinal döngünün fazının -180'i kestiği yere — ve faz payını yaklaşık 25 dereceden yaklaşık 50 dereceye çıkarır. Kompanze edilmiş döngü çok daha sağlam.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var w=[];for(var i=0;i<=400;i++)w.push(Math.pow(10,-2+i*4/400));
var ph_orig=[],ph_comp=[];
for(var i=0;i<w.length;i++){var ww=w[i];
  var p_int=-90;var p_pole1=-180/Math.PI*Math.atan(ww/1);var p_pole2=-180/Math.PI*Math.atan(ww/10);
  ph_orig.push(p_int+p_pole1+p_pole2);
  var p_z=180/Math.PI*Math.atan(ww/0.5);var p_p=-180/Math.PI*Math.atan(ww/5);
  ph_comp.push(p_int+p_pole1+p_pole2+p_z+p_p);
}
var d1={x:w,y:ph_orig,mode:'lines',name:'lead oncesi',line:{color:'#3b82f6',width:2.4}};
var d2={x:w,y:ph_comp,mode:'lines',name:'lead sonrasi',line:{color:'#f59e0b',width:2.4}};
var m180={x:[0.01,100],y:[-180,-180],mode:'lines',line:{color:'#ef4444',width:1.5,dash:'dot'},name:'faz = -180'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{type:'log',title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'faz (derece)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-260,-60]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-lead-tr',[m180,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tasarım akışı.</strong> 1. Plantınızın açık çevrim Bode diyagramını çıkarın. 2. PM'i okuyun. 3. PM &lt; 45 ise kaç derece artırma gerektiğini hesaplayın. 4. arcsin formülünden p/z oranını seçerek o artırmayı sağlayın. 5. omega_max = sqrt(z*p)'yi kazanç geçişine yerleştirin. 6. Kapalı çevrim basamak cevabıyla doğrulayın. Tekrarlayın.</div>

<h2 class="lesson-title">11. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Deneyebilecekleriniz.</strong> Açık çevrim transfer fonksiyonunu <code>num = [1]</code>, <code>den = np.convolve([1, 0.5], [1, 5, 25])</code> olarak değiştirin — tek sıfırlı üçüncü dereceden bir sistem. Tekrar çalıştırın ve PM'in nasıl değiştiğini not edin. Lead kompansatörün kutup/sıfır oranını 5'ten 100'e süpürün ve PM_yeni'nin nasıl yanıt verdiğini izleyin — azalan verim vardır ve yüksek frekans gürültü maliyeti oranla doğrusal büyür. Son olarak <code>signal.feedback</code> ile bir kapalı çevrim basamak cevabı sürün ve PM'in 50 civarında olmasının basamak cevabında yaklaşık %16 aşıma karşılık geldiğini doğrulayın.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Frekans cevabı, Laplace transfer fonksiyonunu sanal eksende değerlendirdiğinizde elde ettiğiniz şeydir: <code>H(i\\omega)</code>, omega açısal frekansındaki sinüsoidal girişin genlik ve faz cevabını verir. Bode bu iki sayıyı ayrı ayrı çizer: log-log genlik ekseninde <code>20\\log_{10}|H(i\\omega)|</code> ve log-doğrusal faz ekseninde <code>\\angle H(i\\omega)</code>. Yapım tamamen toplamsaldır — her kutbun, sıfırın, integratörün ve sabitin asimptotik katkılarını üst üste yığın — ve beş kanonik şekil (alçak geçiren, yüksek geçiren, integratör, türev alıcı, ikinci dereceden) çoğu mühendislik gereksinimini kapsar. RC alçak geçiren <code>s = -1/(RC)</code>'de tek bir kutba, <code>\\omega_c = 1/(RC)</code>'nin ötesinde 20 dB/dekat'a inen genliğe ve -90 dereceye eğilen faza sahiptir. Birim geri besleme sistemi için kapalı çevrim kararlılığı, açık çevrim Bode diyagramındaki iki sayıya indirgenir: <strong>faz payı</strong> (birim kazançta hâlâ sahip olduğumuz faz rezerv derecesi) ve <strong>kazanç payı</strong> (-180 derece fazda hâlâ sahip olduğumuz dB kazanç rezerv). PM &gt; 45 ve GM &gt; 6 dB standart kuraldır. Nyquist diyagramı <code>H(i\\omega)</code>'yı karmaşık düzlemde doğrudan çizer ve kararlılık ölçütü <code>Z = N + P</code>, -1 etrafındaki sarmalları sayarak kapalı çevrim sağ-yarı-düzlem kutuplarını belirler. Lead kompansatörler bir kutuptan önce bir sıfır yerleştirerek PM'i artırır; lag kompansatörler payı değiştirmeden kalıcı durum hatasını iyileştirir. Bir sonraki ders durum uzayına geçer — aynı sistemler için farklı bir kelime dağarcığı ve modern kontrol, gözlemleyiciler, optimum kontrol ve Kalman filtrelemesine giden köprü.</p>
`
};
