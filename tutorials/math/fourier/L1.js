window.FOURIER_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/1" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Unit Circle</a> <span style="opacity:0.55;font-size:0.82em">(Math L1)</span></li>
<li><a href="/tutorials/matematik/4" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Trig Identities I</a> <span style="opacity:0.55;font-size:0.82em">(Math L4)</span></li>
<li><a href="/tutorials/matematik/8" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Trig Function Graphs</a> <span style="opacity:0.55;font-size:0.82em">(Math L8)</span></li>
<li><a href="/tutorials/matematik/27" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Antiderivative</a> <span style="opacity:0.55;font-size:0.82em">(Math L27)</span></li>
</ul>
</div>
<p class="l-text"><strong>Almost every signal worth analysing repeats itself.</strong> The voltage from the mains, the swing of a pendulum, the vibration of a guitar string, the tide rolling in and out, the rotor of an electric motor — all of them trace the same shape over and over. Fourier analysis is the mathematics that takes those repetitions apart and puts them back together. But before we touch a single integral or talk about transforms, we have to be ruthlessly comfortable with one object: the <em>sinusoid</em>. This lesson stays in that one room. We will not move forward until you can read a sinusoid the way a musician reads a single note.</p>

<p class="l-text">If signal-processing class ever felt like a fog of Greek letters with no anchor, this is where the fog lifts. We start from a tahterevalli (seesaw) and end with a one-line orthogonality integral that will, in two lessons time, become the entire reason Fourier series work.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define periodicity formally and read period <em>T</em>, frequency <em>f</em>, and angular frequency <em>ω</em> off any waveform</li>
<li>Decompose a sinusoid <em>A·sin(ωt + φ)</em> into amplitude, frequency, and phase, and sketch each by hand</li>
<li>Convert freely between sine and cosine using a phase shift of <em>π/2</em></li>
<li>Add two sinusoids of the same frequency analytically and predict the resulting amplitude and phase</li>
<li>Recognise the beat phenomenon when two close frequencies superpose, and explain why it sounds like a slow wobble</li>
<li>Derive the orthogonality of <em>sin(mωt)</em> and <em>sin(nωt)</em> for <em>m ≠ n</em> and state, in plain words, why this is the single most important fact in the rest of the course</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Periodic Function?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a child on a tahterevalli (seesaw) goes up, down, up, down with the same rhythm — every twelve seconds, say, the seat is back exactly where it was, at exactly the same speed and direction. The motion <em>repeats</em>. That is the entire content of periodicity: whatever the system is doing now, it will do again after a fixed wait.</div>

<p class="l-text">Other examples sit everywhere once you start looking: the daily cycle of sunlight, the monthly cycle of the moon, the yearly cycle of seasons, the alternating current in a wall socket (50 Hz in Türkiye, 60 Hz in the US), the pressure wave of a tuning fork, the orbit of a satellite. None of these are toy examples — every one of them was a real engineering problem that Fourier-style analysis cracked open.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION: PERIODIC FUNCTION</div><div class="formula-main">$$f(t + T) = f(t) \\quad \\text{for all } t$$</div><div class="formula-sub">A function is periodic with period T if shifting the input by T gives back the same output, no matter where you started.</div></div>

<p class="l-text">Three numbers describe any periodic motion completely, and they are tied to each other so tightly that giving any one of them gives you the other two for free:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Period T</div><div class="card-body">How long one full cycle takes. Units of time (seconds, milliseconds, years). The seesaw with T = 12 s repeats every twelve seconds.</div><div class="card-formula">[T] = s</div></div>
<div class="calc-card"><div class="card-title">Frequency f</div><div class="card-body">How many full cycles happen per second. The reciprocal of T. Units: hertz (Hz) = 1/s. A T = 12 s seesaw runs at f = 1/12 Hz.</div><div class="card-formula">f = 1/T</div></div>
<div class="calc-card"><div class="card-title">Angular Frequency ω</div><div class="card-body">How many <em>radians</em> of phase the motion sweeps through per second. Useful because sin and cos accept radians, not cycles. Units: rad/s.</div><div class="card-formula">ω = 2π f = 2π/T</div></div>
</div>

<div class="calc-formula"><div class="formula-label">THE THREE-WAY IDENTITY</div><div class="formula-main">$$\\omega = 2\\pi f = \\frac{2\\pi}{T}$$</div><div class="formula-sub">Memorise this once. Given any of T, f, ω you can compute the other two in one step.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Türkiye's mains voltage oscillates at <strong>f = 50 Hz</strong>. Then:<br><br>T = 1/f = 1/50 = <strong>0.02 s</strong> (20 ms per cycle)<br>ω = 2π·50 = <strong>314.16 rad/s</strong><br><br>So in one second the AC voltage sweeps through 50 full cycles, or equivalently 100π radians of phase.</div></div>

<div class="l-note"><strong>Important subtlety:</strong> if T is a period of f, then so is 2T, 3T, kT. The <em>fundamental</em> period is the smallest positive T that works. Whenever we say "the period" without further qualification, we mean the fundamental one.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If a clock's pendulum has T = 2 s, what is its angular frequency? (Answer: ω = π rad/s ≈ 3.14 rad/s.) If you can do this in your head, move on.</div></div>

<h2 class="lesson-title">2. The Sinusoid</h2>

<div class="calc-highlight"><strong>The cleanest periodic function in the universe.</strong> Out of all the shapes that repeat, the sine wave is the smoothest, the most symmetric, and — as we will see in section 6 — the one that lets us build every other reasonable periodic shape. If periodic functions are music, sinusoids are pure tones.</div>

<p class="l-text">A general sinusoid in time looks like this:</p>

<div class="calc-formula"><div class="formula-label">THE GENERAL SINUSOID</div><div class="formula-main">$$y(t) = A \\, \\sin(\\omega t + \\varphi)$$</div><div class="formula-sub">Three knobs: amplitude A (how tall), angular frequency ω (how fast), phase φ (where it starts).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Amplitude A</div><div class="card-body">Peak deviation from zero. The wave swings between +A and −A. For a guitar string, A is loudness. For mains voltage, A ≈ 311 V (peak of a 220 V RMS signal).</div></div>
<div class="calc-card"><div class="card-title">Angular Frequency ω</div><div class="card-body">How fast the argument grows. A larger ω compresses the wave into shorter cycles. Same role as in section 1.</div></div>
<div class="calc-card"><div class="card-title">Phase φ</div><div class="card-body">A constant added to the argument. It shifts the entire wave left or right in time. φ = 0 starts at zero going up. φ = π/2 starts at the peak.</div></div>
</div>

<p class="l-text"><strong>Geometric construction (the unit circle picture):</strong> imagine a point spinning counter-clockwise around a circle of radius A at angular speed ω rad/s. Its starting angle is φ. At time t the point has rotated to angle (ωt + φ). Now look at the <em>vertical</em> coordinate of that point — that is exactly y(t). The horizontal coordinate is A·cos(ωt + φ). Sine and cosine are nothing but the shadow of uniform circular motion.</p>

<div class="calc-graph"><div id="plot-l1-sinusoid-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three sinusoids on a common time axis. The blue reference y = sin(2π·t) has amplitude 1, frequency 1 Hz (period 1 s), and zero phase. The orange one has amplitude 1.6 — taller but otherwise identical. The green one has the same amplitude as blue but a phase shift of φ = π/3, which slides the whole wave to the <em>left</em> by φ/ω seconds.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],y1=[],y2=[],y3=[];
for(var i=0;i<=400;i++){var x=i/100;t.push(x);y1.push(Math.sin(2*Math.PI*x));y2.push(1.6*Math.sin(2*Math.PI*x));y3.push(Math.sin(2*Math.PI*x+Math.PI/3));}
var d1={x:t,y:y1,mode:'lines',name:'A=1, φ=0',line:{color:'#3b82f6',width:2.4}};
var d2={x:t,y:y2,mode:'lines',name:'A=1.6, φ=0',line:{color:'#f59e0b',width:2.4,dash:'dot'}};
var d3={x:t,y:y3,mode:'lines',name:'A=1, φ=π/3',line:{color:'#10b981',width:2.4,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2,2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-sinusoid-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Read off the parameters</strong> of y(t) = 3·sin(20t + π/4).<br><br>A = <strong>3</strong> (peak value).<br>ω = <strong>20 rad/s</strong>.<br>f = ω/(2π) = 20/(2π) ≈ <strong>3.18 Hz</strong>.<br>T = 1/f ≈ <strong>0.314 s</strong>.<br>φ = <strong>π/4 rad</strong> (the wave starts at y(0) = 3·sin(π/4) ≈ 2.12, already on its way up).</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Can you sketch, by hand, the wave 2·sin(πt − π/2) on the interval 0 ≤ t ≤ 4? Hint: it has T = 2 s, amplitude 2, and the phase shift makes it look like a cosine reflected through the x-axis. If yes, you own section 2.</div></div>

<h2 class="lesson-title">3. Cosine, Sine, and the Phase Shift</h2>

<div class="calc-highlight"><strong>Cosine is just sine that started early.</strong> Every property of cosine you have ever seen is a sine property with one extra ninety-degree push of the phase. Once that lands, the eternal "should I use sin or cos?" question stops mattering.</div>

<div class="calc-formula"><div class="formula-label">THE FUNDAMENTAL RELATIONSHIP</div><div class="formula-main">$$\\cos(x) = \\sin\\!\\left(x + \\tfrac{\\pi}{2}\\right) \\qquad \\sin(x) = \\cos\\!\\left(x - \\tfrac{\\pi}{2}\\right)$$</div><div class="formula-sub">Cosine leads sine by 90 degrees (π/2 radians). Sine lags cosine by 90 degrees. They are the same shape, separated only by a phase.</div></div>

<p class="l-text">Why does anyone use cosine at all then? Two reasons:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cosine starts at the peak</div><div class="card-body">cos(0) = 1, sin(0) = 0. If your physical setup begins at maximum displacement (a released spring), cosine matches the initial condition with no extra phase.</div></div>
<div class="calc-card"><div class="card-title">Cosine is even, sine is odd</div><div class="card-body">cos(−x) = cos(x), sin(−x) = −sin(x). Symmetric problems prefer cosines; antisymmetric ones prefer sines. The Fourier series will exploit this savagely.</div></div>
</div>

<p class="l-text">Both forms are equivalent. The general sinusoid can be written in either:</p>

<div class="calc-formula"><div class="formula-label">TWO EQUIVALENT FORMS</div><div class="formula-main">$$A \\sin(\\omega t + \\varphi) \\;=\\; A \\cos\\!\\left(\\omega t + \\varphi - \\tfrac{\\pi}{2}\\right)$$</div><div class="formula-sub">Same wave. Different phase reference. Pick whichever simplifies your problem.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Convert 5·cos(3t) into a pure sine.<br><br>5·cos(3t) = 5·sin(3t + π/2).<br><br>That is it. The amplitude (5) and angular frequency (3) are untouched; only the phase picked up a +π/2.</div></div>

<div class="l-note"><strong>Why this matters later:</strong> when we expand a function into a Fourier series, we get both sine and cosine terms. They are not redundant — together they let any phase be represented without writing a phase constant explicitly. You will appreciate this in lesson 2.</div>

<h2 class="lesson-title">4. Adding Sinusoids of the Same Frequency</h2>

<div class="calc-highlight"><strong>Magic fact:</strong> if two sine waves have the <em>same</em> ω, their sum is also a sine wave with that same ω. Nothing new appears — no harmonics, no distortion, just a different amplitude and a different phase. Mix two tones of identical pitch and you still hear that pitch; only the loudness and timing shift.</div>

<p class="l-text">Concretely, suppose we want to add a sine and a cosine of identical frequency:</p>

<div class="calc-formula"><div class="formula-label">SUM OF SAME-FREQUENCY SINUSOIDS</div><div class="formula-main">$$A \\sin(\\omega t) + B \\cos(\\omega t) \\;=\\; C \\sin(\\omega t + \\varphi)$$</div><div class="formula-sub">where C = √(A² + B²) and tan(φ) = B / A.</div></div>

<p class="l-text"><strong>Derivation, step by step.</strong> Expand the right-hand side using the sine addition formula:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Expand C·sin(ωt + φ)</div><div class="step-detail">sin(α + β) = sin(α)cos(β) + cos(α)sin(β), so C·sin(ωt + φ) = C·cos(φ)·sin(ωt) + C·sin(φ)·cos(ωt).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Match coefficients</div><div class="step-detail">Comparing with A·sin(ωt) + B·cos(ωt) we read off: A = C·cos(φ) and B = C·sin(φ).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Solve for C</div><div class="step-detail">Square and add: A² + B² = C²(cos²φ + sin²φ) = C². Therefore C = √(A² + B²).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Solve for φ</div><div class="step-detail">Divide: B/A = sin(φ)/cos(φ) = tan(φ). So φ = arctan(B/A) (with quadrant care when A is negative).</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Combine</strong> 3·sin(ωt) + 4·cos(ωt) into a single sinusoid.<br><br>C = √(3² + 4²) = √25 = <strong>5</strong>.<br>φ = arctan(4/3) ≈ <strong>0.927 rad</strong> ≈ 53.13°.<br><br>So 3·sin(ωt) + 4·cos(ωt) = <strong>5·sin(ωt + 0.927)</strong>. One tone, louder and shifted.</div></div>

<p class="l-text"><strong>Intuitive "phasor" picture (no complex numbers yet).</strong> Think of A·sin(ωt) and B·cos(ωt) as two arrows in a 2-D plane: one of length A pointing along the horizontal axis, one of length B pointing along the vertical axis (because cosine leads sine by 90°). Their tip-to-tail sum is an arrow of length C = √(A²+B²) at angle φ = arctan(B/A) from the horizontal. That single arrow <em>is</em> the resulting sinusoid. You have just done Pythagoras in disguise.</p>

<div class="calc-graph"><div id="plot-l1-sumsame-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the blue 3·sin(2π·t) and the orange 4·cos(2π·t) are two same-frequency sinusoids of different amplitude. Their sum (green, thick) is again a sinusoid of the same period — never a new shape — with amplitude exactly √(3²+4²) = 5 and a phase shift of arctan(4/3) ≈ 0.927 rad. The black dotted line is the predicted 5·sin(2π·t + 0.927); it lies exactly on top of the green sum, confirming the formula.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],a=[],b=[],s=[],p=[];
for(var i=0;i<=400;i++){var x=i/100;t.push(x);var u=3*Math.sin(2*Math.PI*x);var v=4*Math.cos(2*Math.PI*x);a.push(u);b.push(v);s.push(u+v);p.push(5*Math.sin(2*Math.PI*x+Math.atan2(4,3)));}
var d1={x:t,y:a,mode:'lines',name:'3 sin(2πt)',line:{color:'#3b82f6',width:1.8}};
var d2={x:t,y:b,mode:'lines',name:'4 cos(2πt)',line:{color:'#f59e0b',width:1.8}};
var d3={x:t,y:s,mode:'lines',name:'sum',line:{color:'#10b981',width:3}};
var d4={x:t,y:p,mode:'lines',name:'5 sin(2πt + 0.927)',line:{color:'#ffffff',width:1.4,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'amplitude',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-6,6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-sumsame-en',[d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Adding two sines of the same frequency cannot create a new frequency. Convince yourself by adding 2·sin(t) + 2·sin(t) → 4·sin(t). Same frequency, doubled amplitude. The instant the frequencies differ, all bets are off — and that is the next section.</div></div>

<h2 class="lesson-title">5. Adding Sinusoids of Different Frequencies</h2>

<div class="calc-highlight"><strong>This is where the seed of Fourier's idea sprouts.</strong> The moment two sinusoids have <em>different</em> frequencies, their sum stops being a sinusoid. The combined waveform can take on rich, complicated shapes — and yet it remains <em>periodic</em> as long as the two frequencies have a rational ratio. Fourier's insight, two centuries later, was that this process runs in reverse: any reasonable periodic function can be <em>decomposed</em> into a sum of pure sinusoids.</p>

<p class="l-text">First, what does the sum of two sinusoids look like when their frequencies are simple multiples of each other? This is the case of <strong>harmonics</strong>:</p>

<div class="calc-formula"><div class="formula-label">SUM WITH HARMONIC RELATIONSHIP</div><div class="formula-main">$$y(t) \\;=\\; \\sin(2\\pi t) \\;+\\; \\tfrac{1}{3}\\sin(6\\pi t) \\;+\\; \\tfrac{1}{5}\\sin(10\\pi t)$$</div><div class="formula-sub">Fundamental at 1 Hz plus a 3 Hz third-harmonic and a 5 Hz fifth-harmonic. (You may recognise the first three terms of a square-wave Fourier series.)</div></div>

<p class="l-text">When you plot this combination, the result is a square-wave-ish shape — flat-topped, with steeper edges than a pure sine. Add more odd harmonics with the right amplitudes and you get a cleaner square. That is exactly how a Fourier series works, and we will build it from scratch in lesson 2. For now, just notice that the sum is still periodic (its period equals the longest of the three: 1 s) but no longer sinusoidal.</p>

<p class="l-text"><strong>The other extreme: two close frequencies — the beat phenomenon.</strong> Suppose two sine waves of nearly equal frequency are added:</p>

<div class="calc-formula"><div class="formula-label">SUM OF CLOSE FREQUENCIES → BEAT</div><div class="formula-main">$$\\sin(2\\pi f_1 t) + \\sin(2\\pi f_2 t) \\;=\\; 2 \\cos\\!\\left(\\pi (f_1 - f_2) t\\right) \\, \\sin\\!\\left(\\pi (f_1 + f_2) t\\right)$$</div><div class="formula-sub">The slow cosine envelope at frequency (f₁ − f₂)/2 modulates a fast sine at the average frequency (f₁ + f₂)/2.</div></div>

<p class="l-text">In words: you hear a tone at the <em>average</em> pitch whose <em>volume swells and fades</em> at the difference frequency. Two slightly mistuned guitar strings produce a wow-wow-wow exactly because of this identity. Piano tuners use the disappearance of beats to lock two strings to the same frequency.</p>

<p class="l-text"><strong>Derivation.</strong> Start from the sum-to-product identity:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Use the identity sin(α) + sin(β) = 2·sin((α+β)/2)·cos((α−β)/2)</div><div class="step-detail">A standard trig identity, derived from the angle addition formulas applied to (α+β)/2 ± (α−β)/2.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Substitute α = 2π f₁ t and β = 2π f₂ t</div><div class="step-detail">(α+β)/2 = π(f₁+f₂)t and (α−β)/2 = π(f₁−f₂)t.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Read off the envelope and the carrier</div><div class="step-detail">The cos(π(f₁−f₂)t) factor is the slow envelope; the sin(π(f₁+f₂)t) factor is the fast inner oscillation.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Add two 440 Hz and 442 Hz pure tones (A4 and a slightly sharp A4).<br><br>Carrier frequency: (440 + 442)/2 = <strong>441 Hz</strong> — what your ear hears as the pitch.<br>Envelope frequency: (442 − 440)/2 = 1 Hz, so the loudness peaks <strong>twice per second</strong> (the envelope reaches a peak each time |cos| = 1, which happens twice per cycle).<br>You would hear a 441 Hz tone with two volume swells per second.</div></div>

<div class="calc-graph"><div id="plot-l1-beat-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the sum of two close-frequency sinusoids at 9 Hz and 10 Hz. The fast wiggle (blue) is the actual signal — a sinusoid at the average frequency, 9.5 Hz. The slow grey envelope traces ±2·|cos(π·Δf·t)| with Δf = 1 Hz; it shows how the amplitude pulses on and off at 1 Hz. This is exactly what a piano tuner hears as a "beat".</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],y=[],e1=[],e2=[];var f1=9,f2=10;
for(var i=0;i<=2000;i++){var x=i/500;t.push(x);var s=Math.sin(2*Math.PI*f1*x)+Math.sin(2*Math.PI*f2*x);y.push(s);var env=2*Math.abs(Math.cos(Math.PI*(f2-f1)*x));e1.push(env);e2.push(-env);}
var d1={x:t,y:y,mode:'lines',name:'sum (carrier 9.5 Hz)',line:{color:'#3b82f6',width:1.3}};
var d2={x:t,y:e1,mode:'lines',name:'envelope ±2|cos(π·Δf·t)|',line:{color:'#9ca3af',width:1.8,dash:'dash'}};
var d3={x:t,y:e2,mode:'lines',line:{color:'#9ca3af',width:1.8,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'amplitude',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2.6,2.6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-beat-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Connection to Fourier's idea:</strong> if a tiny difference of frequency creates a slowly-varying envelope, you can imagine that <em>any</em> non-sinusoidal periodic waveform is some careful sum of many sinusoids at different frequencies interfering with each other. Fourier was the first person to prove that the inverse is true: not only is any sum of sinusoids a periodic function, but conversely <em>any</em> reasonable periodic function is some sum of sinusoids. The whole rest of the course is unpacking that one sentence.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If you whistle 1000 Hz and someone else whistles 1003 Hz nearby, how many beats per second do you hear? (Answer: |1003 − 1000| = 3 beats per second.)</div></div>

<h2 class="lesson-title">6. Orthogonality of Sinusoids</h2>

<div class="calc-highlight"><strong>The single most important fact in all of Fourier analysis.</strong> If you forget every other formula in this lesson but remember this one, you will still be able to derive Fourier series from scratch.</div>

<p class="l-text">Take a single period T = 2π/ω of two sinusoids at multiples of the fundamental angular frequency ω. Multiply them together. Integrate. The answer is <em>exactly zero</em> unless the two frequencies are identical.</p>

<div class="calc-formula"><div class="formula-label">ORTHOGONALITY OF SINES</div><div class="formula-main">$$\\int_{0}^{T} \\sin(m \\omega t) \\, \\sin(n \\omega t) \\, dt \\;=\\; \\begin{cases} 0 & m \\ne n \\\\ \\tfrac{T}{2} & m = n \\end{cases}$$</div><div class="formula-sub">for positive integers m, n with ω = 2π/T.</div></div>

<p class="l-text"><strong>Step-by-step derivation</strong> (case m ≠ n). Use the product-to-sum identity:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Identity: sin(A) sin(B) = ½[cos(A−B) − cos(A+B)]</div><div class="step-detail">A standard trig identity. With A = mωt, B = nωt this becomes sin(mωt)·sin(nωt) = ½[cos((m−n)ωt) − cos((m+n)ωt)].</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Integrate term by term over [0, T]</div><div class="step-detail">∫₀ᵀ cos(kωt) dt = [sin(kωt)/(kω)]₀ᵀ = [sin(2πk) − sin(0)]/(kω) = 0 for any non-zero integer k.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Both halves vanish when m ≠ n</div><div class="step-detail">Both (m−n) and (m+n) are non-zero integers, so both integrals contribute zero. Total = 0. □</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Case m = n: the (m−n) term becomes cos(0) = 1</div><div class="step-detail">∫₀ᵀ ½·1 dt = T/2, while the cos((m+n)ωt) term still vanishes. Total = T/2.</div></div></div>
</div>

<p class="l-text"><strong>Why "orthogonal"?</strong> The integral ∫₀ᵀ f(t)·g(t) dt is the inner product of f and g on the interval [0, T] — exactly the function-space analogue of the dot product u·v in ℝⁿ. Two vectors are orthogonal when their dot product is zero. So the family {sin(ωt), sin(2ωt), sin(3ωt), …} is a set of mutually perpendicular "vectors" in function space, just like the standard basis vectors ê₁, ê₂, ê₃, … in ℝ³ are mutually perpendicular.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vectors in ℝ³</div><div class="card-body">ê₁·ê₂ = 0, ê₁·ê₃ = 0, ê₂·ê₃ = 0. Each basis vector is independent of the others.</div><div class="card-formula">êᵢ · êⱼ = δᵢⱼ</div></div>
<div class="calc-card"><div class="card-title">Sinusoids on [0, T]</div><div class="card-body">⟨sin(mωt), sin(nωt)⟩ = 0 for m ≠ n. Each harmonic is independent of the others.</div><div class="card-formula">∫ sin(mωt) sin(nωt) dt = δₘₙ · T/2</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-ortho-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the top blue trace is sin(2π·t) and the green is sin(2·2π·t). Their pointwise product (orange, bottom) oscillates symmetrically around zero — every positive bump is matched by a negative bump of equal area within one period. Visually, the orange area integrates to exactly zero over [0, 1]. That is orthogonality, made geometric.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],a=[],b=[],p=[];
for(var i=0;i<=400;i++){var x=i/400;t.push(x);var s1=Math.sin(2*Math.PI*x);var s2=Math.sin(2*2*Math.PI*x);a.push(s1);b.push(s2);p.push(s1*s2);}
var d1={x:t,y:a,mode:'lines',name:'sin(2πt)',line:{color:'#3b82f6',width:2}};
var d2={x:t,y:b,mode:'lines',name:'sin(4πt)',line:{color:'#10b981',width:2}};
var d3={x:t,y:p,mode:'lines',name:'product → integrates to 0',line:{color:'#f59e0b',width:2.5},fill:'tozeroy',fillcolor:'rgba(245,158,11,0.18)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (one period)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'amplitude',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.2,1.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-ortho-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Why does this matter?</strong> Imagine a periodic signal f(t) you suspect is a mix of harmonics: f(t) = a₁·sin(ωt) + a₂·sin(2ωt) + a₃·sin(3ωt) + …. How do you pick out, say, a₂? Multiply both sides by sin(2ωt) and integrate from 0 to T. Every term on the right vanishes except a₂·∫sin²(2ωt) dt = a₂·T/2. The coefficient drops out cleanly:</p>

<div class="calc-formula"><div class="formula-label">EXTRACTING A FOURIER COEFFICIENT</div><div class="formula-main">$$a_n \\;=\\; \\frac{2}{T} \\int_{0}^{T} f(t) \\, \\sin(n \\omega t) \\, dt$$</div><div class="formula-sub">Multiply by the target harmonic, integrate, divide by T/2. Orthogonality kills every other term.</div></div>

<p class="l-text">That formula is the entire Fourier series in disguise, and it is a direct, immediate consequence of the orthogonality you just proved. We will derive it properly in lesson 2 — but you have already done the hard work.</p>

<div class="l-note"><strong>Analogous facts that we will need later:</strong> ∫₀ᵀ cos(mωt)·cos(nωt) dt = 0 for m ≠ n (same proof), and ∫₀ᵀ sin(mωt)·cos(nωt) dt = 0 for <em>all</em> m and n (because sine times cosine is an odd function of phase). Together, sines and cosines form a fully orthogonal basis on [0, T].</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">In one sentence: orthogonality lets us extract each frequency component of a signal independently, the same way you read off the x, y, z components of a vector independently. If that sentence makes sense, you are ready for Fourier series.</div></div>

<h2 class="lesson-title">7. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with:</strong> change f to f = 2.01 in part 3 to see a slow 0.01 Hz beat. Set phi = pi/2 in part 1 and watch the wave reshape into a cosine. Increase the orthogonality grid to m, n ∈ {1, …, 10} and confirm the entire 10×10 matrix is diagonal — that diagonal matrix <em>is</em> the orthogonality theorem in pure numerical form.</p>

<h2 class="lesson-title">8. Summary &amp; What You Can Now Do</h2>

<p class="l-text">In one lesson we have built every primitive you will reuse throughout the rest of the course. Here is the entire mental model on one page:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periodicity</div><div class="card-body">A function repeats whenever f(t+T) = f(t). The fundamental period T is the smallest positive one.</div><div class="card-formula">f(t+T) = f(t)</div></div>
<div class="calc-card"><div class="card-title">Three numbers, one identity</div><div class="card-body">Period, frequency, angular frequency are linked by ω = 2π/T = 2πf. Know any one, get the other two.</div><div class="card-formula">ω = 2πf = 2π/T</div></div>
<div class="calc-card"><div class="card-title">The sinusoid</div><div class="card-body">A·sin(ωt + φ): amplitude, frequency, phase. The smoothest periodic shape in existence — the building block of everything that follows.</div><div class="card-formula">A sin(ωt + φ)</div></div>
<div class="calc-card"><div class="card-title">Sine ↔ cosine</div><div class="card-body">Identical shape, separated by a π/2 phase shift. Choose whichever matches the initial condition more cleanly.</div><div class="card-formula">cos(x) = sin(x + π/2)</div></div>
<div class="calc-card"><div class="card-title">Same-frequency sum</div><div class="card-body">A·sin(ωt) + B·cos(ωt) = C·sin(ωt + φ) with C = √(A²+B²). Pythagoras hiding in the trig.</div><div class="card-formula">C = √(A² + B²)</div></div>
<div class="calc-card"><div class="card-title">Different-frequency sum</div><div class="card-body">Loses the sinusoidal shape; can become any periodic waveform. Close frequencies produce beats.</div><div class="card-formula">Δf ⇒ beats at |Δf|</div></div>
<div class="calc-card"><div class="card-title">Orthogonality</div><div class="card-body">∫₀ᵀ sin(mωt)·sin(nωt) dt = 0 unless m = n. The single most important fact in the course.</div><div class="card-formula">⟨sin(mωt), sin(nωt)⟩ = δₘₙ · T/2</div></div>
<div class="calc-card"><div class="card-title">Why it matters</div><div class="card-body">Orthogonality lets us extract a single frequency component of any signal cleanly — the engine behind Fourier series, Fourier transforms, FFT, every spectrum analyser.</div><div class="card-formula">aₙ = (2/T)∫f·sin(nωt)dt</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 2):</strong> we use orthogonality to build the <strong>Fourier series</strong> — the decomposition of any periodic function into its constituent sines and cosines. The formula you saw at the end of section 6 is exactly the engine. By the end of L2 you will be reconstructing square waves, triangle waves, and sawtooth waves out of nothing but sines.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/1" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Birim Çember</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L1)</span></li>
<li><a href="/tutorials/matematik/4" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Trig Özdeşlikler I</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L4)</span></li>
<li><a href="/tutorials/matematik/8" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Trig Fonksiyon Grafikleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L8)</span></li>
<li><a href="/tutorials/matematik/27" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Ters Türev</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L27)</span></li>
</ul>
</div>
<p class="l-text"><strong>İncelenmeye değer hemen her sinyal kendini tekrar eder.</strong> Şebeke gerilimi, sarkacın salınımı, gitar telinin titreşimi, gelen-giden gelgit, elektrik motorunun rotoru — hepsi aynı şekli tekrar tekrar çizer. Fourier analizi, bu tekrarları parçalarına ayıran ve gerektiğinde yeniden birleştiren matematiktir. Ama tek bir integralle ya da dönüşümle uğraşmadan önce bir nesneye karşı acımasızca rahat olmak zorundayız: <em>sinüsoid</em>. Bu ders o tek odada kalıyor. Bir sinüsoidi bir müzisyenin tek bir notayı okuduğu rahatlıkla okuyana kadar ileri gitmeyeceğiz.</p>

<p class="l-text">Sinyal işleme dersi sana bir zamanlar tutamak bulamadığın Yunan harflerinden oluşan bir sis gibi geldiyse, sis bu derste dağılıyor. Bir tahterevalliden başlayıp, iki ders sonra Fourier serisinin neden çalıştığının tek satırlık nedeni olacak bir diklik (ortogonalite) integraline kadar geliyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Periyodikliği formel olarak tanımlamayı ve herhangi bir dalga formundan periyodu <em>T</em>, frekansı <em>f</em> ve açısal frekansı <em>ω</em> doğrudan okumayı</li>
<li><em>A·sin(ωt + φ)</em> sinüsoidini genlik, frekans ve faz bileşenlerine ayırıp her birini elle çizebilmeyi</li>
<li>Sinüs ile kosinüs arasında <em>π/2</em>'lik bir faz kaydırmasıyla rahatça geçiş yapmayı</li>
<li>Aynı frekanstaki iki sinüsoidi analitik olarak toplayıp ortaya çıkan genliği ve fazı önceden hesaplamayı</li>
<li>Birbirine yakın iki frekans üst üste bindiğinde oluşan vuru (beat) olayını tanımayı ve neden yavaş bir titreşim gibi duyulduğunu açıklamayı</li>
<li><em>m ≠ n</em> için <em>sin(mωt)</em> ile <em>sin(nωt)</em>'nin ortogonalliğini adım adım türetip, bu olgunun dersin geri kalanındaki en kritik tek olgu olduğunu sade bir cümleyle ifade etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Periyodik Fonksiyon Nedir?</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> tahterevallide bir çocuk aynı ritimle yukarı-aşağı-yukarı-aşağı gider — diyelim her on iki saniyede koltuk tam olarak aynı noktada, aynı hızda, aynı yöndedir. Hareket <em>tekrar eder</em>. Periyodikliğin tüm içeriği budur: sistem şu an ne yapıyorsa, sabit bir süre sonra tekrar yapacaktır.</div>

<p class="l-text">Bakmaya başlayınca başka örnekler her yerde: güneş ışığının günlük döngüsü, Ay'ın aylık döngüsü, mevsimlerin yıllık döngüsü, prizdeki alternatif akım (Türkiye'de 50 Hz, ABD'de 60 Hz), bir diyapazonun basınç dalgası, bir uydunun yörüngesi. Hiçbiri oyuncak örnek değil — her biri Fourier tarzı analizin çözdüğü gerçek bir mühendislik problemiydi.</p>

<div class="calc-formula"><div class="formula-label">TANIM: PERİYODİK FONKSİYON</div><div class="formula-main">$$f(t + T) = f(t) \\quad \\text{for all } t$$</div><div class="formula-sub">Bir fonksiyon, girdiyi T kadar kaydırmak çıktıyı değiştirmiyorsa T periyotludur — başlangıç noktası nerede olursa olsun.</div></div>

<p class="l-text">Üç sayı herhangi bir periyodik hareketi tam olarak tanımlar ve bu üçü birbirine öyle sıkı bağlıdır ki birini söylemek diğer ikisini bedavaya verir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periyot T</div><div class="card-body">Tam bir çevrim ne kadar sürer? Zaman birimi (saniye, milisaniye, yıl). T = 12 s'lik tahterevalli her on iki saniyede tekrar eder.</div><div class="card-formula">[T] = s</div></div>
<div class="calc-card"><div class="card-title">Frekans f</div><div class="card-body">Saniyede kaç tam çevrim olur? T'nin tersi. Birim: hertz (Hz) = 1/s. T = 12 s'lik tahterevalli f = 1/12 Hz'te çalışır.</div><div class="card-formula">f = 1/T</div></div>
<div class="calc-card"><div class="card-title">Açısal Frekans ω</div><div class="card-body">Hareketin saniyede kaç <em>radyan</em> faz taradığı. sin ve cos radyan kabul ettiği için pratiktir. Birim: rad/s.</div><div class="card-formula">ω = 2π f = 2π/T</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ÜÇLÜ ÖZDEŞLİK</div><div class="formula-main">$$\\omega = 2\\pi f = \\frac{2\\pi}{T}$$</div><div class="formula-sub">Bunu bir kez ezberle. T, f, ω'dan herhangi biri verildiğinde diğer ikisi tek adımda bulunur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">Türkiye'deki şebeke gerilimi <strong>f = 50 Hz</strong>'te salınır. Buradan:<br><br>T = 1/f = 1/50 = <strong>0.02 s</strong> (çevrim başına 20 ms)<br>ω = 2π·50 = <strong>314.16 rad/s</strong><br><br>Bir saniyede AC gerilim 50 tam çevrim, yani 100π radyanlık faz tarar.</div></div>

<div class="l-note"><strong>Önemli incelik:</strong> eğer T bir periyot ise, 2T, 3T, kT de periyottur. <em>Temel</em> periyot, işe yarayan en küçük pozitif T'dir. "Periyot" derken ek bir nitelik söylemiyorsak temel periyodu kastediyoruz.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir duvar saatinin sarkacı T = 2 s'lik periyoda sahipse açısal frekansı nedir? (Yanıt: ω = π rad/s ≈ 3.14 rad/s.) Bunu kafadan çözebiliyorsan ilerleyebilirsin.</div></div>

<h2 class="lesson-title">2. Sinüsoid</h2>

<div class="calc-highlight"><strong>Evrendeki en temiz periyodik fonksiyon.</strong> Tekrar eden tüm şekiller arasında sinüs dalgası en pürüzsüz, en simetrik olanıdır ve — 6. bölümde göreceğimiz gibi — diğer her makul periyodik şekli inşa etmemizi sağlayan tek yapı taşıdır. Periyodik fonksiyonlar müzikse, sinüsoidler saf tondur.</div>

<p class="l-text">Zaman içindeki genel bir sinüsoid şöyle görünür:</p>

<div class="calc-formula"><div class="formula-label">GENEL SİNÜSOİD</div><div class="formula-main">$$y(t) = A \\, \\sin(\\omega t + \\varphi)$$</div><div class="formula-sub">Üç düğme: genlik A (ne kadar yüksek), açısal frekans ω (ne kadar hızlı), faz φ (nereden başlıyor).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genlik A</div><div class="card-body">Sıfırdan tepe sapması. Dalga +A ile −A arasında salınır. Gitar teli için A sesin yüksekliğidir. Şebeke gerilimi için A ≈ 311 V (220 V RMS'in tepesi).</div></div>
<div class="calc-card"><div class="card-title">Açısal Frekans ω</div><div class="card-body">Argümanın ne kadar hızlı büyüdüğü. Daha büyük ω, dalgayı daha kısa çevrimlere sıkıştırır. 1. bölümdekiyle aynı rol.</div></div>
<div class="calc-card"><div class="card-title">Faz φ</div><div class="card-body">Argümana eklenen sabit. Tüm dalgayı zamanda sola ya da sağa kaydırır. φ = 0 sıfırdan yukarı çıkarak başlar. φ = π/2 doğrudan tepeden başlar.</div></div>
</div>

<p class="l-text"><strong>Geometrik kuruluş (birim çember resmi):</strong> A yarıçaplı bir çember etrafında ω rad/s açısal hızla saat yönünün tersine dönen bir nokta hayal et. Başlangıç açısı φ. t anında nokta (ωt + φ) açısına dönmüş olur. Şimdi bu noktanın <em>dikey</em> koordinatına bak — işte tam olarak y(t). Yatay koordinat ise A·cos(ωt + φ). Sinüs ile kosinüs, düzgün dairesel hareketin gölgesinden başka bir şey değildir.</p>

<div class="calc-graph"><div id="plot-l1-sinusoid-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> ortak bir zaman ekseninde üç sinüsoid. Mavi referans y = sin(2π·t) genliği 1, frekansı 1 Hz (periyot 1 s) ve fazı sıfır. Turuncu olanın genliği 1.6 — daha yüksek, ama diğer parametreler aynı. Yeşil olanın genliği maviyle aynı, ama φ = π/3'lük bir faz kayması var; bu da tüm dalgayı zamanda φ/ω saniye <em>sola</em> öteler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],y1=[],y2=[],y3=[];
for(var i=0;i<=400;i++){var x=i/100;t.push(x);y1.push(Math.sin(2*Math.PI*x));y2.push(1.6*Math.sin(2*Math.PI*x));y3.push(Math.sin(2*Math.PI*x+Math.PI/3));}
var d1={x:t,y:y1,mode:'lines',name:'A=1, φ=0',line:{color:'#3b82f6',width:2.4}};
var d2={x:t,y:y2,mode:'lines',name:'A=1.6, φ=0',line:{color:'#f59e0b',width:2.4,dash:'dot'}};
var d3={x:t,y:y3,mode:'lines',name:'A=1, φ=π/3',line:{color:'#10b981',width:2.4,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2,2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-sinusoid-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>y(t) = 3·sin(20t + π/4)</strong> ifadesinin parametrelerini oku.<br><br>A = <strong>3</strong> (tepe değeri).<br>ω = <strong>20 rad/s</strong>.<br>f = ω/(2π) = 20/(2π) ≈ <strong>3.18 Hz</strong>.<br>T = 1/f ≈ <strong>0.314 s</strong>.<br>φ = <strong>π/4 rad</strong> (dalga y(0) = 3·sin(π/4) ≈ 2.12 noktasından, zaten yukarı doğru çıkarken başlar).</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Elle, 0 ≤ t ≤ 4 aralığında 2·sin(πt − π/2) dalgasını çizebilir misin? İpucu: T = 2 s, genlik 2 ve faz kayması bu dalgayı x ekseninde yansıtılmış bir kosinüs gibi gösterir. Çizebiliyorsan 2. bölüm cebinde.</div></div>

<h2 class="lesson-title">3. Kosinüs, Sinüs ve Faz Kaydırması</h2>

<div class="calc-highlight"><strong>Kosinüs, sadece erken başlayan sinüstür.</strong> Kosinüsün şimdiye kadar gördüğün her özelliği, faza fazladan doksan derecelik bir itme verilmiş bir sinüs özelliğidir. Bu oturduğunda, sonsuza dek süren "sin mi cos mu kullansam?" sorusu önemini kaybeder.</div>

<div class="calc-formula"><div class="formula-label">TEMEL İLİŞKİ</div><div class="formula-main">$$\\cos(x) = \\sin\\!\\left(x + \\tfrac{\\pi}{2}\\right) \\qquad \\sin(x) = \\cos\\!\\left(x - \\tfrac{\\pi}{2}\\right)$$</div><div class="formula-sub">Kosinüs sinüsün 90 derece (π/2 radyan) önündedir. Sinüs kosinüsün 90 derece arkasındadır. Aynı şekil — yalnızca fazları farklı.</div></div>

<p class="l-text">Peki o zaman kosinüsü kim kullanır? İki sebepten:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kosinüs tepeden başlar</div><div class="card-body">cos(0) = 1, sin(0) = 0. Fiziksel düzeneğin maksimum yer değiştirmeden başladığı durumlar (serbest bırakılmış bir yay) kosinüsle başlangıç koşuluna ek bir faz olmadan eşleşir.</div></div>
<div class="calc-card"><div class="card-title">Kosinüs çift, sinüs tek</div><div class="card-body">cos(−x) = cos(x), sin(−x) = −sin(x). Simetrik problemler kosinüsleri tercih eder; antisimetrik olanlar sinüsleri. Fourier serileri bu ayrımı sonuna kadar sömürür.</div></div>
</div>

<p class="l-text">İki form denktir. Genel sinüsoid her iki biçimde de yazılabilir:</p>

<div class="calc-formula"><div class="formula-label">İKİ EŞDEĞER FORM</div><div class="formula-main">$$A \\sin(\\omega t + \\varphi) \\;=\\; A \\cos\\!\\left(\\omega t + \\varphi - \\tfrac{\\pi}{2}\\right)$$</div><div class="formula-sub">Aynı dalga, farklı faz referansı. Problemini hangisi sadeleştiriyorsa onu kullan.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">5·cos(3t) ifadesini saf bir sinüse çevir.<br><br>5·cos(3t) = 5·sin(3t + π/2).<br><br>İşte bu kadar. Genlik (5) ve açısal frekans (3) değişmedi; yalnızca faz +π/2 aldı.</div></div>

<div class="l-note"><strong>İleride neden işe yarayacak:</strong> bir fonksiyonu Fourier serisine açtığımızda hem sinüs hem kosinüs terimleri ortaya çıkar. Bunlar gereksiz değil — birlikte, açıkça bir faz sabiti yazmadan herhangi bir fazı temsil etmemize izin verirler. 2. derste bunun değerini fark edeceksin.</div>

<h2 class="lesson-title">4. Aynı Frekanstaki Sinüsoidleri Toplamak</h2>

<div class="calc-highlight"><strong>Sihir gibi bir olgu:</strong> iki sinüs dalgasının ω'sı <em>aynıysa</em>, toplamları da o aynı ω'lı bir sinüs dalgasıdır. Yeni bir şey ortaya çıkmaz — ne harmonik, ne bozulma — yalnızca farklı bir genlik ve faz. Aynı perdedeki iki tonu karıştırırsan hâlâ o perdeyi duyarsın; yalnızca ses yüksekliği ve zamanlama değişir.</div>

<p class="l-text">Somut olarak, aynı frekanstaki bir sinüs ile kosinüsü topladığımızı varsayalım:</p>

<div class="calc-formula"><div class="formula-label">AYNI FREKANSTAKİ SİNÜSOİDLERİN TOPLAMI</div><div class="formula-main">$$A \\sin(\\omega t) + B \\cos(\\omega t) \\;=\\; C \\sin(\\omega t + \\varphi)$$</div><div class="formula-sub">burada C = √(A² + B²) ve tan(φ) = B / A.</div></div>

<p class="l-text"><strong>Adım adım türetim.</strong> Sağ tarafı sinüsün toplam formülüyle aç:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">C·sin(ωt + φ) ifadesini aç</div><div class="step-detail">sin(α + β) = sin(α)cos(β) + cos(α)sin(β), dolayısıyla C·sin(ωt + φ) = C·cos(φ)·sin(ωt) + C·sin(φ)·cos(ωt).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Katsayıları eşle</div><div class="step-detail">A·sin(ωt) + B·cos(ωt) ile karşılaştırınca: A = C·cos(φ) ve B = C·sin(φ).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">C için çöz</div><div class="step-detail">Kareyi al ve topla: A² + B² = C²(cos²φ + sin²φ) = C². Yani C = √(A² + B²).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">φ için çöz</div><div class="step-detail">Böl: B/A = sin(φ)/cos(φ) = tan(φ). Dolayısıyla φ = arctan(B/A) (A negatifse bölge dikkatiyle).</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>Birleştir:</strong> 3·sin(ωt) + 4·cos(ωt) ifadesini tek bir sinüsoide.<br><br>C = √(3² + 4²) = √25 = <strong>5</strong>.<br>φ = arctan(4/3) ≈ <strong>0.927 rad</strong> ≈ 53.13°.<br><br>Yani 3·sin(ωt) + 4·cos(ωt) = <strong>5·sin(ωt + 0.927)</strong>. Tek ton, daha yüksek ve kaydırılmış.</div></div>

<p class="l-text"><strong>Sezgisel "fazör" resmi (henüz karmaşık sayı yok).</strong> A·sin(ωt) ile B·cos(ωt) ifadelerini 2 boyutlu düzlemde iki ok gibi düşün: biri yatay eksen boyunca A uzunluğunda, biri dikey eksen boyunca B uzunluğunda (çünkü kosinüs sinüsün 90° önünde). Bunların uç-uca toplamı, yataydan φ = arctan(B/A) açısında, C = √(A²+B²) uzunluğunda bir ok verir. Bu tek ok ortaya çıkan sinüsoidin <em>kendisidir</em>. Yeni yaptığın şey kılık değiştirmiş Pisagor.</p>

<div class="calc-graph"><div id="plot-l1-sumsame-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> mavi 3·sin(2π·t) ve turuncu 4·cos(2π·t), farklı genlikte iki aynı-frekans sinüsoididir. Toplamları (yeşil, kalın) aynı periyotlu — asla yeni bir şekil değil — bir başka sinüsoiddir; genliği tam olarak √(3²+4²) = 5, faz kayması ise arctan(4/3) ≈ 0.927 rad. Siyah noktalı çizgi, öngörülen 5·sin(2π·t + 0.927) eğrisidir; tam olarak yeşil toplam üzerine oturur ve formülü doğrular.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],a=[],b=[],s=[],p=[];
for(var i=0;i<=400;i++){var x=i/100;t.push(x);var u=3*Math.sin(2*Math.PI*x);var v=4*Math.cos(2*Math.PI*x);a.push(u);b.push(v);s.push(u+v);p.push(5*Math.sin(2*Math.PI*x+Math.atan2(4,3)));}
var d1={x:t,y:a,mode:'lines',name:'3 sin(2πt)',line:{color:'#3b82f6',width:1.8}};
var d2={x:t,y:b,mode:'lines',name:'4 cos(2πt)',line:{color:'#f59e0b',width:1.8}};
var d3={x:t,y:s,mode:'lines',name:'toplam',line:{color:'#10b981',width:3}};
var d4={x:t,y:p,mode:'lines',name:'5 sin(2πt + 0.927)',line:{color:'#ffffff',width:1.4,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-6,6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-sumsame-tr',[d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Aynı frekansta iki sinüsü toplamak yeni bir frekans yaratamaz. 2·sin(t) + 2·sin(t) → 4·sin(t) örneğiyle kendini ikna et. Aynı frekans, iki katı genlik. Frekanslar farklılaştığı anda her şey değişir — ki sıradaki bölüm tam bu.</div></div>

<h2 class="lesson-title">5. Farklı Frekansta Sinüsoidleri Toplamak</h2>

<div class="calc-highlight"><strong>Fourier'nin fikrinin tohumu burada filizleniyor.</strong> İki sinüsoidin frekansları <em>farklılaştığı</em> anda toplamı bir sinüsoid olmaktan çıkar. Bileşke dalga zengin, karmaşık şekiller alabilir — ve frekanslar arasında rasyonel oran varsa hâlâ <em>periyodiktir</em>. Fourier'nin iki yüzyıl sonra gelen kavrayışı bu sürecin tersine de çalıştığıydı: herhangi bir makul periyodik fonksiyon saf sinüsoidlerin toplamına <em>ayrıştırılabilir</em>.</p>

<p class="l-text">Önce, frekansların biri diğerinin basit katı olduğunda — yani <strong>harmonikler</strong> durumunda — iki sinüsoidin toplamı neye benzer?</p>

<div class="calc-formula"><div class="formula-label">HARMONİK İLİŞKİLİ TOPLAM</div><div class="formula-main">$$y(t) \\;=\\; \\sin(2\\pi t) \\;+\\; \\tfrac{1}{3}\\sin(6\\pi t) \\;+\\; \\tfrac{1}{5}\\sin(10\\pi t)$$</div><div class="formula-sub">1 Hz'lik temel artı 3 Hz üçüncü harmonik ve 5 Hz beşinci harmonik. (Bir kare dalganın Fourier serisinin ilk üç terimi.)</div></div>

<p class="l-text">Bu birleşimi çizdiğinde sonuç kare dalga benzeri bir şekildir — düz tepeli, saf sinüsten daha dik kenarlı. Doğru genliklerle daha fazla tek harmonik eklersen daha temiz bir kare elde edersin. Fourier serisi tam olarak böyle çalışır ve onu 2. derste sıfırdan kuracağız. Şimdilik şunu fark et: toplam hâlâ periyodiktir (periyodu üç bileşenden en uzunuyla, 1 s) ama artık sinüsoidal değildir.</p>

<p class="l-text"><strong>Öteki uç: birbirine yakın iki frekans — vuru olayı (beat).</strong> Frekansları birbirine çok yakın iki sinüs dalgası topladığını varsay:</p>

<div class="calc-formula"><div class="formula-label">YAKIN FREKANSLARIN TOPLAMI → VURU</div><div class="formula-main">$$\\sin(2\\pi f_1 t) + \\sin(2\\pi f_2 t) \\;=\\; 2 \\cos\\!\\left(\\pi (f_1 - f_2) t\\right) \\, \\sin\\!\\left(\\pi (f_1 + f_2) t\\right)$$</div><div class="formula-sub">Yavaş kosinüs zarfı (f₁ − f₂)/2 frekansında, hızlı sinüs ise ortalama frekans (f₁ + f₂)/2'de salınır.</div></div>

<p class="l-text">Sözlü olarak: <em>ortalama</em> perdede bir ton duyarsın, ama bu tonun <em>ses yüksekliği fark frekansında şişip söner</em>. Hafifçe akortsuz iki gitar teli tam da bu yüzden vuv-vuv-vuv sesi çıkarır. Piyano akortçuları iki teli aynı frekansa kilitlemek için vuruların kaybolmasını kullanır.</p>

<p class="l-text"><strong>Türetim.</strong> Toplam-çarpım özdeşliğiyle başla:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Özdeşlik: sin(α) + sin(β) = 2·sin((α+β)/2)·cos((α−β)/2)</div><div class="step-detail">Standart trigonometrik özdeşlik; (α+β)/2 ± (α−β)/2 ifadelerine açı toplam formüllerinin uygulanmasıyla türetilir.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">α = 2π f₁ t ve β = 2π f₂ t koy</div><div class="step-detail">(α+β)/2 = π(f₁+f₂)t ve (α−β)/2 = π(f₁−f₂)t.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Zarfı ve taşıyıcıyı oku</div><div class="step-detail">cos(π(f₁−f₂)t) çarpanı yavaş zarftır; sin(π(f₁+f₂)t) çarpanı hızlı iç salınımdır.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">İki saf ton 440 Hz ve 442 Hz (A4 ve hafif tiz A4) topla.<br><br>Taşıyıcı frekansı: (440 + 442)/2 = <strong>441 Hz</strong> — kulağın perde olarak duyduğu.<br>Zarf frekansı: (442 − 440)/2 = 1 Hz, dolayısıyla ses yüksekliği <strong>saniyede iki kez</strong> tepe yapar (zarf, |cos| = 1 olduğu her anda tepe yapar, bu da çevrim başına iki kere).<br>Saniyede iki ses yükselmesiyle birlikte 441 Hz'lik bir ton duyarsın.</div></div>

<div class="calc-graph"><div id="plot-l1-beat-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 9 Hz ve 10 Hz'teki yakın frekanslı iki sinüsoidin toplamı. Hızlı kıpırdama (mavi) gerçek sinyaldir — ortalama frekansta, yani 9.5 Hz'de bir sinüsoid. Yavaş gri zarf ±2·|cos(π·Δf·t)| eğrisini izler (Δf = 1 Hz); genliğin 1 Hz'te nasıl açılıp kapandığını gösterir. Bir piyano akortçusunun "vuru" olarak duyduğu tam olarak budur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],y=[],e1=[],e2=[];var f1=9,f2=10;
for(var i=0;i<=2000;i++){var x=i/500;t.push(x);var s=Math.sin(2*Math.PI*f1*x)+Math.sin(2*Math.PI*f2*x);y.push(s);var env=2*Math.abs(Math.cos(Math.PI*(f2-f1)*x));e1.push(env);e2.push(-env);}
var d1={x:t,y:y,mode:'lines',name:'toplam (taşıyıcı 9.5 Hz)',line:{color:'#3b82f6',width:1.3}};
var d2={x:t,y:e1,mode:'lines',name:'zarf ±2|cos(π·Δf·t)|',line:{color:'#9ca3af',width:1.8,dash:'dash'}};
var d3={x:t,y:e2,mode:'lines',line:{color:'#9ca3af',width:1.8,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2.6,2.6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-beat-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Fourier'nin fikriyle bağlantı:</strong> küçücük bir frekans farkı yavaş değişen bir zarf yaratıyorsa, <em>herhangi bir</em> sinüsoidal olmayan periyodik dalga formunun farklı frekanslardaki çok sayıda sinüsoidin birbirine girişiminden oluştuğunu hayal edebilirsin. Fourier, bu önermenin tersinin de doğru olduğunu ilk ispatlayan kişiydi: sinüsoidlerin her toplamı periyodik bir fonksiyondur ve karşılık olarak <em>her</em> makul periyodik fonksiyon, sinüsoidlerin bir toplamıdır. Dersin geri kalanı bu tek cümleyi açmaktan ibaret.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Sen 1000 Hz ıslık çalıyorsun, biri yanında 1003 Hz çalıyor. Saniyede kaç vuru duyarsın? (Yanıt: |1003 − 1000| = saniyede 3 vuru.)</div></div>

<h2 class="lesson-title">6. Sinüsoidlerin Ortogonalliği</h2>

<div class="calc-highlight"><strong>Tüm Fourier analizindeki tek en önemli olgu.</strong> Bu dersteki diğer her formülü unutsan bile bunu hatırlarsan Fourier serisini sıfırdan türetebilirsin.</div>

<p class="l-text">Temel açısal frekans ω'nın katlarındaki iki sinüsoidi tek bir periyot T = 2π/ω boyunca al. Bunları çarp. İntegre et. Sonuç, iki frekans birbiriyle aynı olmadıkça <em>tam olarak sıfırdır</em>.</p>

<div class="calc-formula"><div class="formula-label">SİNÜSLERİN ORTOGONALLİĞİ</div><div class="formula-main">$$\\int_{0}^{T} \\sin(m \\omega t) \\, \\sin(n \\omega t) \\, dt \\;=\\; \\begin{cases} 0 & m \\ne n \\\\ \\tfrac{T}{2} & m = n \\end{cases}$$</div><div class="formula-sub">pozitif tam sayılar m, n ve ω = 2π/T için.</div></div>

<p class="l-text"><strong>Adım adım türetim</strong> (m ≠ n durumu). Çarpım-toplam özdeşliğini kullan:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Özdeşlik: sin(A) sin(B) = ½[cos(A−B) − cos(A+B)]</div><div class="step-detail">Standart trigonometrik özdeşlik. A = mωt, B = nωt yerine konunca: sin(mωt)·sin(nωt) = ½[cos((m−n)ωt) − cos((m+n)ωt)].</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">[0, T] üzerinde terim terim integre et</div><div class="step-detail">∫₀ᵀ cos(kωt) dt = [sin(kωt)/(kω)]₀ᵀ = [sin(2πk) − sin(0)]/(kω) = 0; sıfırdan farklı her tam sayı k için.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">m ≠ n iken her iki yarı da yok olur</div><div class="step-detail">Hem (m−n) hem (m+n) sıfırdan farklı tam sayıdır, dolayısıyla iki integral de sıfır verir. Toplam = 0. □</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">m = n durumu: (m−n) terimi cos(0) = 1 olur</div><div class="step-detail">∫₀ᵀ ½·1 dt = T/2, cos((m+n)ωt) terimi ise hâlâ yok olur. Toplam = T/2.</div></div></div>
</div>

<p class="l-text"><strong>Neden "ortogonal"?</strong> ∫₀ᵀ f(t)·g(t) dt integrali, f ile g'nin [0, T] üzerindeki iç çarpımıdır — ℝⁿ'deki u·v nokta çarpımının fonksiyon uzayındaki tam karşılığı. İki vektör nokta çarpımları sıfırsa ortogonaldir. Yani {sin(ωt), sin(2ωt), sin(3ωt), …} ailesi, fonksiyon uzayında birbirine dik "vektörler" kümesidir — tıpkı ℝ³'teki standart taban vektörleri ê₁, ê₂, ê₃, … gibi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ℝ³'te vektörler</div><div class="card-body">ê₁·ê₂ = 0, ê₁·ê₃ = 0, ê₂·ê₃ = 0. Her taban vektörü diğerlerinden bağımsız.</div><div class="card-formula">êᵢ · êⱼ = δᵢⱼ</div></div>
<div class="calc-card"><div class="card-title">[0, T] üzerinde sinüsoidler</div><div class="card-body">⟨sin(mωt), sin(nωt)⟩ = 0; m ≠ n için. Her harmonik diğerlerinden bağımsızdır.</div><div class="card-formula">∫ sin(mωt) sin(nωt) dt = δₘₙ · T/2</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-ortho-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üstteki mavi eğri sin(2π·t), yeşil eğri sin(2·2π·t). Noktasal çarpımları (turuncu, altta) sıfır etrafında simetrik olarak salınır — bir periyot içinde her pozitif tümseğe eşit alanlı bir negatif tümsek karşılık gelir. Görsel olarak turuncu alan [0, 1] üzerinde tam olarak sıfıra integre olur. Ortogonalliğin geometrik hali budur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],a=[],b=[],p=[];
for(var i=0;i<=400;i++){var x=i/400;t.push(x);var s1=Math.sin(2*Math.PI*x);var s2=Math.sin(2*2*Math.PI*x);a.push(s1);b.push(s2);p.push(s1*s2);}
var d1={x:t,y:a,mode:'lines',name:'sin(2πt)',line:{color:'#3b82f6',width:2}};
var d2={x:t,y:b,mode:'lines',name:'sin(4πt)',line:{color:'#10b981',width:2}};
var d3={x:t,y:p,mode:'lines',name:'çarpım → integrali 0',line:{color:'#f59e0b',width:2.5},fill:'tozeroy',fillcolor:'rgba(245,158,11,0.18)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (bir periyot)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'genlik',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.2,1.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-ortho-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Bu neden önemli?</strong> Harmoniklerin karışımı olduğundan şüphelendiğin bir periyodik sinyal f(t) hayal et: f(t) = a₁·sin(ωt) + a₂·sin(2ωt) + a₃·sin(3ωt) + …. Diyelim a₂'yi nasıl çıkarırsın? Her iki tarafı sin(2ωt) ile çarp ve 0'dan T'ye integre et. Sağdaki her terim yok olur, yalnızca a₂·∫sin²(2ωt) dt = a₂·T/2 kalır. Katsayı temiz bir şekilde düşer:</p>

<div class="calc-formula"><div class="formula-label">BİR FOURIER KATSAYISINI ÇIKARMAK</div><div class="formula-main">$$a_n \\;=\\; \\frac{2}{T} \\int_{0}^{T} f(t) \\, \\sin(n \\omega t) \\, dt$$</div><div class="formula-sub">Hedef harmonikle çarp, integre et, T/2'ye böl. Ortogonallik diğer her terimi öldürür.</div></div>

<p class="l-text">Bu formül kılık değiştirmiş tüm Fourier serisidir ve az önce ispatladığın ortogonalliğin doğrudan, anında bir sonucudur. 2. derste düzgün şekilde türeteceğiz — ama zor işi sen zaten yaptın.</p>

<div class="l-note"><strong>İleride lazım olacak benzer olgular:</strong> ∫₀ᵀ cos(mωt)·cos(nωt) dt = 0; m ≠ n için (aynı ispat) ve ∫₀ᵀ sin(mωt)·cos(nωt) dt = 0; <em>her</em> m ve n için (sinüs çarpı kosinüs, fazın tek fonksiyonudur). Birlikte, sinüsler ve kosinüsler [0, T] üzerinde tamamen ortogonal bir taban oluştururlar.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Tek cümlede: ortogonallik bir sinyalin her frekans bileşenini birbirinden bağımsız olarak çıkarmamızı sağlar — aynı bir vektörün x, y, z bileşenlerini birbirinden bağımsız okuduğun gibi. Bu cümle mantıklı geldiyse Fourier serilerine hazırsın.</div></div>

<h2 class="lesson-title">7. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynanacak yerler:</strong> 3. parçada f'yi f = 2.01 yap; yavaş bir 0.01 Hz vurusu ortaya çıkar. 1. parçada phi = pi/2 yap ve dalganın bir kosinüse dönüşmesini izle. Ortogonallik ızgarasını m, n ∈ {1, …, 10} aralığına genişlet ve 10×10 matrisin tamamının köşegen olduğunu doğrula — o köşegen matris saf sayısal biçimiyle ortogonallik teoreminin <em>kendisidir</em>.</p>

<h2 class="lesson-title">8. Özet &amp; Artık Yapabileceklerin</h2>

<p class="l-text">Tek bir derste, dersin geri kalanında defalarca tekrar tekrar kullanacağın her temel yapı taşını kurduk. Tüm zihinsel modelin tek bir sayfa:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Periyodiklik</div><div class="card-body">f(t+T) = f(t) olduğunda fonksiyon tekrar eder. Temel periyot T, işe yarayan en küçük pozitif değerdir.</div><div class="card-formula">f(t+T) = f(t)</div></div>
<div class="calc-card"><div class="card-title">Üç sayı, tek özdeşlik</div><div class="card-body">Periyot, frekans ve açısal frekans ω = 2π/T = 2πf ile birbirine bağlı. Birini bil, diğer ikisi sende.</div><div class="card-formula">ω = 2πf = 2π/T</div></div>
<div class="calc-card"><div class="card-title">Sinüsoid</div><div class="card-body">A·sin(ωt + φ): genlik, frekans, faz. Var olan en pürüzsüz periyodik şekil — sıradaki her şeyin yapı taşı.</div><div class="card-formula">A sin(ωt + φ)</div></div>
<div class="calc-card"><div class="card-title">Sinüs ↔ kosinüs</div><div class="card-body">Aynı şekil; π/2'lik faz kaymasıyla ayrılırlar. Başlangıç koşuluna hangisi daha temiz uyuyorsa onu seç.</div><div class="card-formula">cos(x) = sin(x + π/2)</div></div>
<div class="calc-card"><div class="card-title">Aynı-frekans toplamı</div><div class="card-body">A·sin(ωt) + B·cos(ωt) = C·sin(ωt + φ), burada C = √(A²+B²). Trigonometrinin içine saklanmış Pisagor.</div><div class="card-formula">C = √(A² + B²)</div></div>
<div class="calc-card"><div class="card-title">Farklı-frekans toplamı</div><div class="card-body">Sinüsoidal şeklini kaybeder; herhangi bir periyodik dalga formuna dönüşebilir. Yakın frekanslar vuru üretir.</div><div class="card-formula">Δf ⇒ |Δf| vurusu</div></div>
<div class="calc-card"><div class="card-title">Ortogonallik</div><div class="card-body">∫₀ᵀ sin(mωt)·sin(nωt) dt = 0; m = n hariç. Dersteki tek en önemli olgu.</div><div class="card-formula">⟨sin(mωt), sin(nωt)⟩ = δₘₙ · T/2</div></div>
<div class="calc-card"><div class="card-title">Neden önemli</div><div class="card-body">Ortogonallik, sinyalin tek bir frekans bileşenini temiz şekilde çıkarmamızı sağlar — Fourier serisi, Fourier dönüşümü, FFT, her spektrum analizörünün arkasındaki motor.</div><div class="card-formula">aₙ = (2/T)∫f·sin(nωt)dt</div></div>
</div>

<div class="l-warn"><strong>Sıradaki (Ders 2):</strong> ortogonalliği kullanarak <strong>Fourier serisini</strong> kuracağız — herhangi bir periyodik fonksiyonu kendisini oluşturan sinüs ve kosinüslere ayırıyor. 6. bölümün sonunda gördüğün formül tam olarak motorudur. L2'nin sonunda kare dalgaları, üçgen dalgaları ve testere dişi dalgaları sadece sinüslerden yeniden inşa ediyor olacaksın.</p>`

};
