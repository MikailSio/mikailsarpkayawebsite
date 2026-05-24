window.FOURIER_L7 = {

en: `<p class="l-text"><strong>The Fourier Transform tells you what frequencies live in a signal, but it cannot tell you when each one happened.</strong> A bird chirp at the start of the recording and a violin tremolo at the end can produce the exact same spectrum as a stationary mixture that contained both throughout. For music, speech, EEG, seismic data, gravitational waves — basically anything non-stationary — this is a fatal limitation. The <em>Wavelet Transform</em> is the standard cure.</p>

<p class="l-text">Wavelets feel mystical to most engineers because textbooks usually open with twenty pages of functional analysis: Riesz bases, Sobolev spaces, multiresolution analysis as a tower of subspaces. We will skip all of that. The wavelet idea is geometrically simple — <em>short windows for fast events, long windows for slow events</em> — and once you see the picture, the formulas are bookkeeping. This lesson will show you the picture first, then the math, and finally let you compute a real wavelet denoising in Pyodide.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why the standard Fourier Transform cannot localize events in time and why a chirp and a stationary tone can share a spectrum</li>
<li>Define the STFT and the spectrogram, and see exactly where Heisenberg's inequality forces you to trade time vs frequency resolution</li>
<li>State the Continuous Wavelet Transform W(a,b), interpret scale a and translation b, and identify three common mother wavelets (Haar, Morlet, Mexican hat)</li>
<li>Walk through the dyadic DWT pyramid algorithm and explain why it runs in O(N) — faster than FFT</li>
<li>Apply wavelet thresholding to denoise a real signal using the Donoho-Johnstone universal threshold</li>
<li>Identify where wavelets genuinely matter in modern AI (JPEG2000 pipelines, biomedical preprocessing, scattering networks) and where they do not (Transformer-era LLMs)</li>
</ul>
</div>

<h2 class="l-title">1. The Limitation of Fourier — Time-Frequency Tradeoff</h2>

<p class="l-text">Suppose you record one second of audio that contains a low tone (200 Hz) for the first half second, then a high tone (800 Hz) for the second half second. Now suppose your friend records one second of audio that contains 200 Hz <em>and</em> 800 Hz simultaneously, throughout the whole second. Both signals have energy at exactly 200 Hz and 800 Hz. If you hand both recordings to FFT and ask "what frequencies are in this signal?", the answer for both is "200 Hz and 800 Hz, in roughly equal amounts." Fourier cannot tell them apart.</p>

<div class="calc-formula"><div class="formula-label">THE TIME BLINDNESS OF FT</div><div class="formula-main">$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i\\omega t}\\, dt$$</div><div class="formula-sub">The integral runs over ALL time. Localized events get smeared across a global spectrum.</div></div>

<p class="l-text">The root cause is the basis. Fourier expands signals in <code>e^{i\\omega t}</code> — pure sinusoids that have <em>infinite duration</em>. They are perfectly localized in frequency (a single delta in the spectrum) but completely unlocalized in time. To represent a signal that is itself localized in time (a click, a chirp, a note onset), the FT must combine many sinusoids whose tails cancel everywhere except the small region where the event lives. The information about <em>when</em> the event happened is hidden in the <em>phase</em> relationships of the spectrum, where it is essentially unusable for human inspection.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stationary signal</div><div class="card-body">A signal whose frequency content does not change with time: a continuous 440 Hz tone, a constant white noise, AC current at 50 Hz. For these, Fourier is perfect.</div></div>
<div class="calc-card"><div class="card-title">Non-stationary signal</div><div class="card-body">A signal whose frequency content changes with time: speech, music, ECG, seismic waves, gravitational wave chirps, EEG seizures. For these, Fourier loses critical information.</div></div>
<div class="calc-card"><div class="card-title">The musical notation analogy</div><div class="card-body">A musical score is a time-frequency display: horizontal axis is time, vertical axis is pitch (frequency), and the dots tell you which note plays when. Fourier gives you only the histogram of all notes used — useless for performance.</div></div>
<div class="calc-card"><div class="card-title">What we want</div><div class="card-body">A transform that decomposes a signal into building blocks that are localized in BOTH time and frequency. Each coefficient should answer two questions: "what frequency content" and "around what time".</div></div>
</div>

<div class="l-note"><strong>Concrete demonstration:</strong> consider <code>f(t) = \\sin(2\\pi \\cdot 5 t) + \\sin(2\\pi \\cdot 20 t)</code> on <code>[0, 4]</code> and <code>g(t) = \\sin(2\\pi \\cdot 5 t)</code> on <code>[0, 2]</code> followed by <code>\\sin(2\\pi \\cdot 20 t)</code> on <code>[2, 4]</code>. The magnitude spectra <code>|F(\\omega)|</code> and <code>|G(\\omega)|</code> both have peaks at 5 Hz and 20 Hz. The differences live entirely in the phase, which is hard to interpret directly.</div>

<h2 class="l-title">2. STFT (Short-Time Fourier Transform) — First Attempt</h2>

<p class="l-text">The first idea any engineer has is: <strong>slide a small window across the signal and do FFT in each window</strong>. Pick a window function <code>w(t)</code> (a rectangle, a Gaussian, a Hann), shift it by <code>\\tau</code>, multiply, and transform. This is the Short-Time Fourier Transform.</p>

<div class="calc-formula"><div class="formula-label">STFT DEFINITION</div><div class="formula-main">$$\\text{STFT}_f(\\tau, \\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, w(t - \\tau)\\, e^{-i\\omega t}\\, dt$$</div><div class="formula-sub">Two arguments now: tau (where the window sits in time) and omega (frequency). The result is a 2D function on the time-frequency plane.</div></div>

<p class="l-text">The squared magnitude <code>|\\text{STFT}_f(\\tau, \\omega)|^2</code> is called the <strong>spectrogram</strong>. It is the standard time-frequency display you see in audio editors (Audacity, Adobe Audition), speech recognition tools, and seismology software. The horizontal axis is time, the vertical axis is frequency, and color intensity encodes how much of frequency <code>\\omega</code> was present near time <code>\\tau</code>.</p>

<div class="calc-formula"><div class="formula-label">SPECTROGRAM</div><div class="formula-main">$$S(\\tau, \\omega) = \\left|\\text{STFT}_f(\\tau, \\omega)\\right|^2$$</div><div class="formula-sub">The energy density on the time-frequency plane. Always non-negative, always real.</div></div>

<p class="l-text">The STFT is enormously useful and is still the standard for short-time audio analysis (MFCCs, mel-spectrograms feeding into wav2vec and Whisper all start from STFT). But it has a <strong>fundamental flaw</strong>: the window <code>w(t)</code> has a fixed width. Once you choose it, you have committed to a <em>single</em> time-frequency resolution that applies uniformly to every part of the signal.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Narrow window</div><div class="card-body">Good time resolution: you can tell exactly when an event happened. Bad frequency resolution: a narrow window has a wide spectrum, so close frequencies smear together. Useful for percussion onsets, transients.</div></div>
<div class="calc-card"><div class="card-title">Wide window</div><div class="card-body">Good frequency resolution: you can distinguish closely-spaced sinusoids. Bad time resolution: you cannot tell exactly when a frequency turned on or off. Useful for steady tones, harmonic analysis.</div></div>
<div class="calc-card"><div class="card-title">No best choice</div><div class="card-body">For a signal that contains both transients (drum hits) AND sustained tones (violin melodies), no single window width is correct. Audio engineers compromise; wavelets simply refuse to choose.</div></div>
</div>

<div class="think-box"><div class="think-label">HEISENBERG IN ACTION (RECALL L4)</div><div class="think-body">The STFT's resolution dilemma is not a software limitation. It is the same uncertainty principle we proved in Lesson 4: <code>\\Delta t \\cdot \\Delta\\omega \\ge 1/2</code>. The product of the window's temporal width and its spectral width is bounded from below. Gabor (1946) realized that the Gaussian window saturates this bound — the Gaussian-windowed STFT is also called the <em>Gabor transform</em> and is the optimal STFT in this sense. But "optimal STFT" still means uniform tiling.</div></div>

<h2 class="l-title">3. The Wavelet Idea — Multi-Resolution</h2>

<p class="l-text">Here is the wavelet insight, stated as plainly as possible. The events in real signals have very different durations. A click lasts a millisecond. A musical note lasts a tenth of a second. A weather pattern lasts a week. <strong>Why should we use the same window width to analyze all of them?</strong></p>

<p class="l-text">High-frequency events tend to be short. Low-frequency events tend to be long. So: use a <em>short</em> window to look at high frequencies (good time localization for short events) and a <em>long</em> window to look at low frequencies (good frequency localization for slow oscillations). The window width scales inversely with the frequency.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">STFT tiling</div><div class="card-body">A uniform grid of rectangles on the time-frequency plane. Every tile has the same width <code>\\Delta t</code> and the same height <code>\\Delta\\omega</code>. One window size, everywhere.</div></div>
<div class="calc-card"><div class="card-title">Wavelet tiling</div><div class="card-body">A non-uniform partition: at high frequencies the tiles are narrow in time and tall in frequency; at low frequencies the tiles are wide in time and short in frequency. Tile area is constant (Heisenberg still rules), but the shape adapts.</div></div>
<div class="calc-card"><div class="card-title">Microscope analogy</div><div class="card-body">A wavelet transform is like a microscope with adjustable zoom. Zoom out (large scale) to see the slow structure of a signal; zoom in (small scale) to see the fast details. Same instrument, different magnifications.</div></div>
</div>

<div id="plot-tiling-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var stftShapes=[];for(var i=0;i<8;i++){for(var j=0;j<6;j++){stftShapes.push({type:"rect",xref:"x1",yref:"y1",x0:i,y0:j,x1:i+1,y1:j+1,line:{color:"#3b82f6",width:1.2},fillcolor:"rgba(59,130,246,0.08)"});}}
var wvShapes=[];
for(var i=0;i<8;i++){wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:i,y0:0,x1:i+1,y1:1,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.08)"});}
for(var i=0;i<4;i++){wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:2*i,y0:1,x1:2*i+2,y1:2.5,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.10)"});}
for(var i=0;i<2;i++){wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:4*i,y0:2.5,x1:4*i+4,y1:4.5,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.12)"});}
wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:0,y0:4.5,x1:8,y1:6,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.14)"});
var traces=[
{x:[0],y:[0],mode:"text",text:["STFT: uniform tiles"],textfont:{color:"#3b82f6",size:14},xaxis:"x1",yaxis:"y1",showlegend:false},
{x:[0],y:[0],mode:"text",text:["Wavelet: dyadic tiles"],textfont:{color:"#10b981",size:14},xaxis:"x2",yaxis:"y2",showlegend:false}
];
var layout={grid:{rows:1,columns:2,pattern:"independent"},paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{domain:[0,0.46],title:"time",range:[-0.3,8.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
yaxis:{title:"frequency",range:[-0.3,6.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
xaxis2:{domain:[0.54,1],title:"time",range:[-0.3,8.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
yaxis2:{title:"frequency",range:[-0.3,6.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
shapes:stftShapes.concat(wvShapes),showlegend:false,margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-tiling-en",traces,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Left:</strong> STFT tiling — every cell is the same shape. <strong>Right:</strong> wavelet (dyadic) tiling — high frequencies are sliced finely in time, low frequencies are sliced finely in frequency. Each tile still has the same area (Heisenberg), only the aspect ratio changes.</div></div>

<h2 class="l-title">4. The Mother Wavelet</h2>

<p class="l-text">Now to the math. A <strong>mother wavelet</strong> <code>\\psi(t)</code> is a function with two properties:</p>

<div class="calc-formula"><div class="formula-label">MOTHER WAVELET CONDITIONS</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} \\psi(t)\\, dt = 0, \\qquad \\int_{-\\infty}^{\\infty} |\\psi(t)|^2\\, dt &lt; \\infty$$</div><div class="formula-sub">Zero mean (so it is a "wave") and finite energy (so it is a "let" — a small wave that dies off).</div></div>

<p class="l-text">From this single mother we generate an entire family by <strong>scaling</strong> (parameter <code>a &gt; 0</code>) and <strong>translating</strong> (parameter <code>b \\in \\mathbb{R}</code>):</p>

<div class="calc-formula"><div class="formula-label">WAVELET FAMILY</div><div class="formula-main">$$\\psi_{a,b}(t) = \\frac{1}{\\sqrt{a}}\\, \\psi\\!\\left(\\frac{t - b}{a}\\right)$$</div><div class="formula-sub">Stretch the mother by a (larger a = wider), shift it to be centered near t=b. The 1/sqrt(a) factor preserves the L^2 norm so all wavelets in the family have the same energy.</div></div>

<p class="l-text">The <strong>Continuous Wavelet Transform (CWT)</strong> projects a signal onto every member of this family:</p>

<div class="calc-formula"><div class="formula-label">CONTINUOUS WAVELET TRANSFORM</div><div class="formula-main">$$W_f(a, b) = \\int_{-\\infty}^{\\infty} f(t)\\, \\overline{\\psi_{a,b}(t)}\\, dt = \\frac{1}{\\sqrt{a}} \\int f(t)\\, \\overline{\\psi\\!\\left(\\frac{t-b}{a}\\right)}\\, dt$$</div><div class="formula-sub">A 2D function of scale a and translation b. Inner product of f with a wavelet at scale a, centered at time b.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scale a</div><div class="card-body">Large <code>a</code> = stretched (wide) wavelet = sensitive to slow oscillations (low frequencies). Small <code>a</code> = compressed (narrow) wavelet = sensitive to fast oscillations (high frequencies). Scale is inversely related to frequency.</div></div>
<div class="calc-card"><div class="card-title">Translation b</div><div class="card-body">Where the wavelet sits in time. Sliding <code>b</code> across the signal at fixed <code>a</code> gives you a "frequency band" of the signal as a function of time.</div></div>
<div class="calc-card"><div class="card-title">Inverse CWT</div><div class="card-body">Under a mild admissibility condition on <code>\\psi</code>, the original signal can be reconstructed: <code>f(t) = (1/C_\\psi) \\int\\int W_f(a,b) \\psi_{a,b}(t) (da\\, db / a^2)</code>. So no information is lost.</div></div>
</div>

<div class="l-note"><strong>Interpretation:</strong> <code>W_f(a, b)</code> measures the correlation between the signal and a wavelet of width <code>a</code> centered at time <code>b</code>. A large value means "the signal locally looks like a stretched-and-shifted copy of the mother wavelet". Different mother wavelets are sensitive to different shapes (oscillations, edges, spikes).</div>

<h2 class="l-title">5. Common Mother Wavelets</h2>

<p class="l-text">Different applications need different mother wavelets. Four families dominate in practice:</p>

<div class="calc-formula"><div class="formula-label">HAAR WAVELET (1909)</div><div class="formula-main">$$\\psi_H(t) = \\begin{cases} +1 & 0 \\le t &lt; 1/2 \\\\ -1 & 1/2 \\le t &lt; 1 \\\\ 0 & \\text{otherwise} \\end{cases}$$</div><div class="formula-sub">The simplest wavelet: a step up then a step down. Discontinuous but extremely fast to compute. Historically first.</div></div>

<div class="calc-formula"><div class="formula-label">MORLET WAVELET</div><div class="formula-main">$$\\psi_M(t) = \\pi^{-1/4}\\, e^{i\\omega_0 t}\\, e^{-t^2 / 2}$$</div><div class="formula-sub">A complex sinusoid windowed by a Gaussian. Typical central frequency omega_0 = 5 or 6. Excellent time-frequency localization (Gabor-Morlet).</div></div>

<div class="calc-formula"><div class="formula-label">MEXICAN HAT (RICKER) WAVELET</div><div class="formula-main">$$\\psi_R(t) = \\frac{2}{\\sqrt{3}\\, \\pi^{1/4}} \\left(1 - t^2\\right) e^{-t^2 / 2}$$</div><div class="formula-sub">Second derivative of a Gaussian. Symmetric, good for detecting sharp peaks and edges in images.</div></div>

<div class="calc-formula"><div class="formula-label">DAUBECHIES FAMILY (db1=Haar, db2, db4, db8, ...)</div><div class="formula-main">$$\\psi_{dbN} : \\text{compactly supported, orthogonal, vanishing moments} = N$$</div><div class="formula-sub">No closed form. Defined by their filter coefficients. db4 and db8 are the workhorses of JPEG2000 and most signal processing tools.</div></div>

<div id="plot-mothers-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var t=[];for(var i=-400;i<=400;i++){t.push(i/100);}
var haar=t.map(function(x){if(x>=0&&x<0.5)return 1;if(x>=0.5&&x<1)return -1;return 0;});
var morlet=t.map(function(x){return Math.pow(Math.PI,-0.25)*Math.cos(5*x)*Math.exp(-x*x/2);});
var mexhat=t.map(function(x){return (2/(Math.sqrt(3)*Math.pow(Math.PI,0.25)))*(1-x*x)*Math.exp(-x*x/2);});
var db4=t.map(function(x){var u=(x+1.5)/3;if(u<0||u>1)return 0;var w=Math.sin(2.2*Math.PI*u)*Math.exp(-Math.pow((u-0.45)/0.22,2))*Math.pow(u*(1-u)*4,0.6);return w*1.4;});
var trs=[
{x:t,y:haar,mode:"lines",name:"Haar",line:{color:"#3b82f6",width:2},xaxis:"x1",yaxis:"y1"},
{x:t,y:morlet,mode:"lines",name:"Morlet (real part)",line:{color:"#10b981",width:2},xaxis:"x2",yaxis:"y2"},
{x:t,y:mexhat,mode:"lines",name:"Mexican hat",line:{color:"#f59e0b",width:2},xaxis:"x3",yaxis:"y3"},
{x:t,y:db4,mode:"lines",name:"Daubechies-4 (sketch)",line:{color:"#ef4444",width:2},xaxis:"x4",yaxis:"y4"}
];
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{domain:[0,0.46],anchor:"y1",title:"t",range:[-0.5,1.5],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis:{domain:[0.58,1],anchor:"x1",title:"psi",range:[-1.4,1.4],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
xaxis2:{domain:[0.54,1],anchor:"y2",title:"t",range:[-4,4],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis2:{domain:[0.58,1],anchor:"x2",title:"psi",range:[-0.8,0.8],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
xaxis3:{domain:[0,0.46],anchor:"y3",title:"t",range:[-4,4],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis3:{domain:[0,0.42],anchor:"x3",title:"psi",range:[-0.5,0.9],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
xaxis4:{domain:[0.54,1],anchor:"y4",title:"t",range:[-2,2],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis4:{domain:[0,0.42],anchor:"x4",title:"psi",range:[-1.5,1.5],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-mothers-en",trs,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Top-left:</strong> Haar — discontinuous, square pulses. <strong>Top-right:</strong> Morlet — windowed sinusoid, the workhorse of time-frequency analysis. <strong>Bottom-left:</strong> Mexican hat — second derivative of a Gaussian, edge detector. <strong>Bottom-right:</strong> Daubechies-4 sketch — compactly supported but jagged; the actual db4 has no closed form and is defined via filter coefficients.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Which one for which job?</div><div class="card-body"><strong>Haar:</strong> teaching, fast prototypes, signals with abrupt changes. <strong>Morlet:</strong> time-frequency analysis of EEG, music, gravitational waves (LIGO uses a variant). <strong>Mexican hat:</strong> image edge/blob detection, computer vision pre-deep-learning era. <strong>Daubechies:</strong> compression (JPEG2000 uses CDF 9/7), general signal processing.</div></div>
<div class="calc-card"><div class="card-title">Vanishing moments</div><div class="card-body">A wavelet with <code>N</code> vanishing moments is orthogonal to all polynomials of degree <code>&lt; N</code>. dbN has exactly <code>N</code> vanishing moments. Higher means smoother signals get represented by sparser wavelet coefficients — the key property exploited by compression.</div></div>
<div class="calc-card"><div class="card-title">Symmetry</div><div class="card-body">Daubechies wavelets are not symmetric (you can prove orthogonality + compact support + symmetry is impossible except for Haar). For image processing where symmetry matters, use biorthogonal wavelets like CDF 9/7.</div></div>
</div>

<h2 class="l-title">6. The Discrete Wavelet Transform (DWT) and Pyramid Algorithm</h2>

<p class="l-text">Computing the CWT at every <code>(a, b)</code> is wildly redundant. For implementation we discretize: <strong>dyadic</strong> scales <code>a = 2^{-j}</code> and translations <code>b = k \\cdot 2^{-j}</code> for integers <code>j, k</code>. This gives the Discrete Wavelet Transform (DWT):</p>

<div class="calc-formula"><div class="formula-label">DWT COEFFICIENTS</div><div class="formula-main">$$d_{j,k} = \\int f(t)\\, \\psi_{j,k}(t)\\, dt, \\qquad \\psi_{j,k}(t) = 2^{j/2}\\, \\psi(2^j t - k)$$</div><div class="formula-sub">Two integer indices: j = scale level (large j = fine scale / high frequency), k = time position at that scale.</div></div>

<p class="l-text">For orthogonal wavelets (Haar, Daubechies, ...) the <code>\\psi_{j,k}</code> form an orthonormal basis of <code>L^2(\\mathbb{R})</code>, so every signal admits an exact expansion <code>f = \\sum_{j,k} d_{j,k}\\, \\psi_{j,k}</code> and Parseval holds: total signal energy equals <code>\\sum_{j,k} |d_{j,k}|^2</code>.</p>

<p class="l-text">The breakthrough that made wavelets practical was Mallat's <strong>pyramid algorithm</strong> (1989). Instead of computing each <code>d_{j,k}</code> by integration, you use two short filters — a low-pass <code>h</code> and a high-pass <code>g</code> — and recurse:</p>

<div class="calc-formula"><div class="formula-label">PYRAMID ITERATION</div><div class="formula-main">$$a_{j-1}[n] = \\sum_k h[k - 2n]\\, a_j[k], \\qquad d_{j-1}[n] = \\sum_k g[k - 2n]\\, a_j[k]$$</div><div class="formula-sub">From level j compute level j-1: low-pass + downsample by 2 gives the next approximation a_{j-1}, high-pass + downsample gives the detail coefficients d_{j-1}.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inputs and outputs</div><div class="card-body">Start with the signal <code>a_J = f</code> of length <code>N = 2^J</code>. After one stage you have <code>N/2</code> approximation coefficients and <code>N/2</code> detail coefficients. After two stages: <code>N/4 + N/4 + N/2</code>. After <code>J</code> stages: a tree of detail bands plus a single coarse approximation.</div></div>
<div class="calc-card"><div class="card-title">Complexity: O(N)</div><div class="card-body">Each stage halves the signal length, so total work is <code>cN + c(N/2) + c(N/4) + \\ldots = 2cN</code>. The DWT is <strong>faster than FFT</strong> (which is <code>O(N \\log N)</code>). This is one of the practical reasons wavelets are popular.</div></div>
<div class="calc-card"><div class="card-title">Perfect reconstruction</div><div class="card-body">Run the filter bank backwards (upsample by 2, convolve with the synthesis filters) to recover the signal exactly. The condition on <code>(h, g)</code> for perfect reconstruction is called the <em>quadrature mirror filter</em> (QMF) condition.</div></div>
</div>

<div class="l-note"><strong>Haar filter:</strong> <code>h = (1/\\sqrt{2}, 1/\\sqrt{2})</code> and <code>g = (1/\\sqrt{2}, -1/\\sqrt{2})</code>. So the Haar DWT just takes running averages (approximation) and running differences (detail) of consecutive sample pairs, then keeps every other result. The whole algorithm fits in a few lines of Python.</div>

<h2 class="l-title">7. Multiresolution Analysis (MRA) — Mallat's Framework</h2>

<p class="l-text">The clean theory behind the pyramid algorithm is Mallat's <strong>Multiresolution Analysis</strong>. A multiresolution analysis is a nested sequence of closed subspaces of <code>L^2(\\mathbb{R})</code>:</p>

<div class="calc-formula"><div class="formula-label">MRA NESTING</div><div class="formula-main">$$\\cdots \\subset V_{-1} \\subset V_0 \\subset V_1 \\subset V_2 \\subset \\cdots \\subset L^2(\\mathbb{R})$$</div><div class="formula-sub">Each V_j is the space of "signals visible at resolution 2^j". Going up the chain refines the picture.</div></div>

<p class="l-text">The spaces must satisfy a self-similarity condition <code>f(t) \\in V_j \\Leftrightarrow f(2t) \\in V_{j+1}</code> (zooming in by 2 takes you up one level) and have dense union and trivial intersection. Crucially, there must exist a <strong>scaling function</strong> <code>\\varphi(t)</code> whose integer translates <code>\\{\\varphi(t - k)\\}_{k\\in\\mathbb{Z}}</code> form an orthonormal basis of <code>V_0</code>.</p>

<p class="l-text">The <strong>wavelet space</strong> <code>W_j</code> is the orthogonal complement of <code>V_j</code> in <code>V_{j+1}</code>: it contains exactly the "detail" needed to refine from resolution <code>2^j</code> to <code>2^{j+1}</code>. The mother wavelet <code>\\psi</code> is chosen so its translates span <code>W_0</code>. Then the whole space decomposes as</p>

<div class="calc-formula"><div class="formula-label">ORTHOGONAL DECOMPOSITION</div><div class="formula-main">$$L^2(\\mathbb{R}) = V_0 \\oplus W_0 \\oplus W_1 \\oplus W_2 \\oplus \\cdots = \\bigoplus_{j \\in \\mathbb{Z}} W_j$$</div><div class="formula-sub">Every signal splits into a coarse part (in V_0) plus details at every increasingly fine scale (in W_0, W_1, ...).</div></div>

<div class="think-box"><div class="think-label">WHY THIS MATTERS</div><div class="think-body">MRA is what makes the pyramid algorithm legitimate. The filters <code>h</code> and <code>g</code> are not chosen arbitrarily — they are forced by the choice of scaling function <code>\\varphi</code> via the <em>two-scale equation</em> <code>\\varphi(t) = \\sqrt{2} \\sum_k h[k]\\, \\varphi(2t - k)</code>. Specifying <code>\\varphi</code> determines <code>h</code>, which determines <code>g</code>, which determines <code>\\psi</code>. Daubechies's 1988 construction of compactly supported orthogonal wavelets was a tour-de-force solution of these constraints with as many vanishing moments as possible.</div></div>

<h2 class="l-title">8. Application 1: Image Compression (JPEG2000)</h2>

<p class="l-text">Classic JPEG (1992) uses the Discrete Cosine Transform on 8x8 blocks. The block structure produces the familiar "blocky" artifacts at high compression. <strong>JPEG2000 (2000)</strong> replaced DCT with a 2D wavelet transform — typically the biorthogonal CDF 9/7 filter — applied to the whole image at once. The compression pipeline is:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: 2D DWT</div><div class="card-body">Apply the 1D DWT to each row of the image, then to each column of the result. This produces four subbands: LL (low-low, the coarse approximation) and three detail bands LH, HL, HH (horizontal, vertical, diagonal edges). Recurse on LL for multi-level decomposition.</div></div>
<div class="calc-card"><div class="card-title">Step 2: Quantization</div><div class="card-body">Round the wavelet coefficients to fewer levels. Smaller coefficients (mostly noise / fine texture) get aggressively quantized; the large coefficients (edges) are preserved more carefully.</div></div>
<div class="calc-card"><div class="card-title">Step 3: Entropy coding</div><div class="card-body">Encode the quantized coefficients with an arithmetic coder (EBCOT). Most coefficients are zero or near-zero, so this compresses extremely well.</div></div>
</div>

<p class="l-text">For natural images JPEG2000 typically achieves 20-30% better compression at the same perceived quality, and the artifacts at heavy compression are <em>blurry</em> rather than blocky — generally more acceptable visually. Despite this, classic JPEG won the format war for historical reasons. JPEG2000 is heavily used in medical imaging (DICOM), digital cinema (DCI), and archival.</p>

<div class="l-note"><strong>AI relevance:</strong> in the pre-deep-learning era (roughly 2000-2012), wavelet representations of images fed many traditional computer vision pipelines: SIFT, HOG, texture classifiers. Modern CNNs replaced this. But the <em>idea</em> — represent images at multiple scales simultaneously — survives in feature pyramid networks (FPN, RetinaNet) and U-Net's encoder-decoder structure. Those are learned multiresolution analyses.</div>

<h2 class="l-title">9. Application 2: Signal Denoising</h2>

<p class="l-text">Wavelet denoising is one of the most successful and widely-used applications of wavelets, and it rests on a single empirical observation: <strong>real signals have a few large wavelet coefficients (edges, peaks, transients); noise spreads uniformly across all coefficients</strong>. So if you simply zero out the small coefficients, you destroy mostly noise and keep mostly signal.</p>

<p class="l-text">The procedure (Donoho-Johnstone, 1994) is:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: Forward DWT</div><div class="card-body">Apply the DWT to the noisy signal <code>y = f + \\varepsilon</code> where <code>\\varepsilon</code> is Gaussian noise with standard deviation <code>\\sigma</code>. You get coefficients <code>d_{j,k}</code>.</div></div>
<div class="calc-card"><div class="card-title">Step 2: Threshold</div><div class="card-body">Apply the universal threshold <code>T = \\sigma\\sqrt{2\\ln N}</code> where <code>N</code> is the signal length. Set every coefficient with <code>|d_{j,k}| &lt; T</code> to zero.</div></div>
<div class="calc-card"><div class="card-title">Step 3: Inverse DWT</div><div class="card-body">Run the pyramid algorithm in reverse on the thresholded coefficients to reconstruct the denoised signal.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">UNIVERSAL THRESHOLD (DONOHO-JOHNSTONE)</div><div class="formula-main">$$T = \\sigma \\sqrt{2 \\ln N}$$</div><div class="formula-sub">For N = 1024, T is roughly 3.72 sigma. With high probability, no noise coefficient exceeds T, so all surviving coefficients are signal.</div></div>

<p class="l-text">Two thresholding rules are standard. <strong>Hard thresholding</strong> sets <code>d \\to 0</code> if <code>|d| &lt; T</code>, else leaves <code>d</code> alone. <strong>Soft thresholding</strong> additionally shrinks the surviving coefficients toward zero by <code>T</code>: <code>d \\to \\text{sign}(d) \\cdot \\max(|d| - T, 0)</code>. Soft thresholding tends to produce smoother reconstructions; hard preserves sharp features better.</p>

<div class="think-box"><div class="think-label">WHY SHRINKAGE WORKS</div><div class="think-body">Soft thresholding is the solution to <code>\\min_x \\,(d - x)^2 + 2T|x|</code> — it's an L1-penalized denoiser. This is the same shape of optimization as LASSO regression. Donoho-Johnstone showed in 1994 that wavelet soft thresholding is <em>near-optimal</em> in a minimax sense across a wide class of function spaces. Twenty-five years before "sparse coding" became a deep-learning catchphrase, statisticians were already squeezing signal out of sparse representations.</div></div>

<div id="plot-denoise-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=512;var t=[];var clean=[];var noisy=[];var denoised=[];
function rng(s){var x=Math.sin(s)*10000;return x-Math.floor(x);}
for(var i=0;i<N;i++){var x=i/N*8;t.push(x);var c=Math.sin(2*Math.PI*x/3)+0.5*Math.sin(2*Math.PI*x);
if(x>3&&x<3.3)c+=2.5;if(x>5.5&&x<5.7)c-=1.8;clean.push(c);noisy.push(c+0.45*(rng(i+1)+rng(i+97)+rng(i+523)-1.5));}
var a=noisy.slice();var work=a.slice();var coeffs=[];var len=N;
while(len>=8){var aN=new Array(len/2);var dN=new Array(len/2);
for(var k=0;k<len/2;k++){aN[k]=(work[2*k]+work[2*k+1])/Math.SQRT2;dN[k]=(work[2*k]-work[2*k+1])/Math.SQRT2;}
coeffs.push(dN);work=aN;len=len/2;}
var allD=[];for(var ii=0;ii<coeffs.length;ii++)for(var jj=0;jj<coeffs[ii].length;jj++)allD.push(Math.abs(coeffs[ii][jj]));
allD.sort(function(a,b){return a-b;});var sigma=allD[Math.floor(allD.length*0.5)]/0.6745;var T=sigma*Math.sqrt(2*Math.log(N));
for(var ii=0;ii<coeffs.length;ii++){for(var jj=0;jj<coeffs[ii].length;jj++){var v=coeffs[ii][jj];coeffs[ii][jj]=Math.abs(v)<T?0:Math.sign(v)*(Math.abs(v)-T);}}
var rec=work.slice();for(var ii=coeffs.length-1;ii>=0;ii--){var d=coeffs[ii];var up=new Array(rec.length*2);
for(var k=0;k<rec.length;k++){up[2*k]=(rec[k]+d[k])/Math.SQRT2;up[2*k+1]=(rec[k]-d[k])/Math.SQRT2;}rec=up;}denoised=rec;
var tr1={x:t,y:noisy,mode:"lines",name:"noisy input",line:{color:"#ef4444",width:1},opacity:0.6};
var tr2={x:t,y:clean,mode:"lines",name:"clean signal (truth)",line:{color:"#3b82f6",width:2}};
var tr3={x:t,y:denoised,mode:"lines",name:"wavelet denoised",line:{color:"#10b981",width:2.2}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{title:"t",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis:{title:"amplitude",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-denoise-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">A noisy signal (red) containing two smooth sinusoids and two sharp transients (the spikes near t=3 and t=5.5). The clean truth is blue. The green line is the wavelet-denoised reconstruction using Haar DWT with soft thresholding at the Donoho-Johnstone universal threshold. The smooth structure is recovered AND the sharp transients survive — neither a low-pass filter nor a moving average could do this.</div></div>

<h2 class="l-title">10. Application 3: Time-Frequency Analysis (ECG, EEG, Seismic)</h2>

<p class="l-text">A <strong>scalogram</strong> is the wavelet analog of a spectrogram: a 2D heatmap of <code>|W_f(a, b)|^2</code> with time <code>b</code> on the horizontal axis and scale <code>a</code> (or its corresponding frequency) on the vertical axis. Scalograms shine on signals where short transients matter as much as the harmonic content — exactly the situation in biomedical signals.</p>

<p class="l-text">Consider a <strong>linear chirp</strong> <code>f(t) = \\sin(2\\pi(f_0 + (f_1 - f_0)\\cdot t/T)t)</code> whose instantaneous frequency rises linearly from <code>f_0</code> to <code>f_1</code> over duration <code>T</code>. The FT of the chirp would show energy spread between <code>f_0</code> and <code>f_1</code>, with no indication that the frequency is changing. The scalogram, by contrast, shows a clear diagonal ridge — you literally see the frequency rising over time.</p>

<div id="plot-scalogram-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=256;var t=[];var sig=[];for(var i=0;i<N;i++){var x=i/N*4;t.push(x);var inst=2+10*x/4;sig.push(Math.cos(2*Math.PI*(2*x+(10-2)*x*x/(2*4))));}
var scales=24;var freqs=[];var Z=[];
for(var s=0;s<scales;s++){var freq=2+(15-2)*s/(scales-1);freqs.push(freq);var row=[];
for(var b=0;b<N;b++){var sum=0;var width=Math.max(6,Math.round(80/freq));
for(var k=-width;k<=width;k++){var idx=b+k;if(idx<0||idx>=N)continue;var tt=k/(N/4);
var wv=Math.cos(2*Math.PI*freq*tt)*Math.exp(-tt*tt*freq*freq*0.08);sum+=sig[idx]*wv;}
row.push(Math.abs(sum));}Z.push(row);}
var trace={type:"heatmap",x:t,y:freqs,z:Z,colorscale:[[0,"#0a0a0a"],[0.25,"#1e293b"],[0.5,"#3b82f6"],[0.75,"#fbbf24"],[1,"#fef3c7"]],showscale:true,colorbar:{title:"|W|",titlefont:{color:"#e8e8e8"},tickfont:{color:"#e8e8e8"}}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{title:"time t",gridcolor:"rgba(255,255,255,0.06)"},
yaxis:{title:"frequency (Hz, from scale)",gridcolor:"rgba(255,255,255,0.06)"},
showlegend:false,margin:{t:30,b:50,l:70,r:80}};
Plotly.newPlot("plot-scalogram-en",[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Scalogram of a linear chirp from 2 Hz to 10 Hz over 4 seconds. The diagonal bright ridge directly shows the instantaneous frequency rising linearly with time. A Fourier spectrum would show energy diffusely spread from 2 to 10 Hz with no time information at all.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ECG / heart rhythm</div><div class="card-body">Wavelet decomposition separates QRS complexes (high-frequency, transient — the heartbeat spike) from baseline drift (low-frequency) and muscle artifact (mid-frequency). Standard preprocessing before any ML arrhythmia classifier.</div></div>
<div class="calc-card"><div class="card-title">EEG / seizure detection</div><div class="card-body">Seizures have characteristic time-frequency signatures (sudden onset of rhythmic activity in specific frequency bands). Scalograms are a standard input feature for both classical and deep learning seizure detectors.</div></div>
<div class="calc-card"><div class="card-title">Gravitational waves (LIGO)</div><div class="card-body">A binary black hole merger produces a chirp signal: the inspiral phase has a rising frequency. The Q-transform (a variant of the wavelet transform) is the standard visualization for LIGO detections, including GW150914 the first direct detection.</div></div>
</div>

<h2 class="l-title">11. (Brief) Wavelet Scattering Networks</h2>

<p class="l-text">In 2012 Stephane Mallat introduced the <strong>wavelet scattering transform</strong>: a deep convolutional network with <em>fixed</em> wavelet filters instead of learned filters. The architecture cascades wavelet decompositions with modulus non-linearities and averages, producing features that are provably <em>translation-invariant</em> and <em>stable under small deformations</em> — properties that learned CNNs only approximate.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Architecture sketch</div><div class="card-body">Layer 1: <code>|x \\star \\psi_{\\lambda_1}|</code> for many wavelets <code>\\lambda_1</code>. Layer 2: <code>||x \\star \\psi_{\\lambda_1}| \\star \\psi_{\\lambda_2}|</code>. Average each output with a low-pass filter to get scattering coefficients. Two or three layers suffice for many tasks.</div></div>
<div class="calc-card"><div class="card-title">Provable guarantees</div><div class="card-body">Unlike learned CNNs, scattering features come with rigorous bounds: stability under diffeomorphisms (small spatial warps don't change the features much), energy conservation, and convergence theorems.</div></div>
<div class="calc-card"><div class="card-title">Where it stands today</div><div class="card-body">For a few years (2013-2017) scattering networks were a serious alternative to CNNs on small datasets — MNIST, audio classification, quantum chemistry. End-to-end learned representations eventually overtook them on most benchmarks. Today scattering is a niche tool, still used when you have very little data or need rigorous guarantees.</div></div>
</div>

<div class="l-note"><strong>Honest take on wavelets in modern AI:</strong> Transformers do not use wavelets. CNNs do not use wavelets (their filters are learned). Modern speech models (Whisper, wav2vec 2.0) use mel-spectrograms (STFT-based), not scalograms. Where wavelets genuinely matter today: (1) JPEG2000 in medical/cinema pipelines, (2) biomedical signal preprocessing before ML, (3) anomaly detection in time series, (4) compression of weights or activations in some edge-deployment papers, (5) scattering as a strong baseline on tiny datasets. The grand vision of "wavelets as the universal feature for AI" did not happen. Don't overclaim.</div>

<h2 class="l-title">12. Practical Pyodide Exercise</h2>

<p class="l-text">Let's compute a wavelet denoising end-to-end. We'll implement the Haar DWT by hand (it's that simple) and then use it to denoise a signal with sharp features that a Fourier-domain low-pass filter would destroy.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># --- Haar DWT: pyramid algorithm in 8 lines ---------------------</span>

<span class="kw">def</span> <span class="fn">haar_dwt</span>(x, levels):
    <span class="str">"""Forward Haar DWT. Returns (final approx, [detail bands])."""</span>
    a = x.<span class="fn">astype</span>(float).<span class="fn">copy</span>()
    details = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(levels):
        even, odd = a[<span class="num">0</span>::<span class="num">2</span>], a[<span class="num">1</span>::<span class="num">2</span>]
        a = (even + odd) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        d = (even - odd) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        details.<span class="fn">append</span>(d)
    <span class="kw">return</span> a, details

<span class="kw">def</span> <span class="fn">haar_idwt</span>(a, details):
    <span class="str">"""Inverse Haar DWT — undo the pyramid."""</span>
    <span class="kw">for</span> d <span class="kw">in</span> <span class="fn">reversed</span>(details):
        x = np.<span class="fn">empty</span>(<span class="num">2</span> * <span class="fn">len</span>(a))
        x[<span class="num">0</span>::<span class="num">2</span>] = (a + d) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        x[<span class="num">1</span>::<span class="num">2</span>] = (a - d) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        a = x
    <span class="kw">return</span> a

<span class="cm"># --- Build a test signal: smooth + two sharp transients ---------</span>
np.random.<span class="fn">seed</span>(<span class="num">7</span>)
N = <span class="num">1024</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">8</span>, N)
clean = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * t / <span class="num">3</span>) + <span class="num">0.5</span> * np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * t)
clean[(t &gt; <span class="num">3.0</span>) &amp; (t &lt; <span class="num">3.05</span>)] += <span class="num">2.5</span>       <span class="cm"># spike up</span>
clean[(t &gt; <span class="num">5.5</span>) &amp; (t &lt; <span class="num">5.55</span>)] -= <span class="num">1.8</span>      <span class="cm"># spike down</span>
noise = <span class="num">0.45</span> * np.random.<span class="fn">randn</span>(N)
noisy = clean + noise

<span class="cm"># --- Forward DWT ------------------------------------------------</span>
levels = <span class="num">6</span>
approx, details = <span class="fn">haar_dwt</span>(noisy, levels)

<span class="cm"># --- Estimate noise sigma from finest band ----------------------</span>
<span class="cm"># Robust MAD estimator (Donoho 1995): sigma = MAD / 0.6745</span>
sigma_hat = np.<span class="fn">median</span>(np.<span class="fn">abs</span>(details[<span class="num">0</span>])) / <span class="num">0.6745</span>
T = sigma_hat * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.<span class="fn">log</span>(N))
<span class="fn">print</span>(<span class="str">f"Estimated sigma = {sigma_hat:.4f}    universal T = {T:.4f}"</span>)

<span class="cm"># --- Soft thresholding ------------------------------------------</span>
<span class="kw">def</span> <span class="fn">soft</span>(d, T):
    <span class="kw">return</span> np.<span class="fn">sign</span>(d) * np.<span class="fn">maximum</span>(np.<span class="fn">abs</span>(d) - T, <span class="num">0</span>)

denoised_details = [<span class="fn">soft</span>(d, T) <span class="kw">for</span> d <span class="kw">in</span> details]

<span class="cm"># --- Inverse DWT -------------------------------------------------</span>
denoised = <span class="fn">haar_idwt</span>(approx, denoised_details)

mse_noisy = np.<span class="fn">mean</span>((noisy - clean) ** <span class="num">2</span>)
mse_denoised = np.<span class="fn">mean</span>((denoised - clean) ** <span class="num">2</span>)
<span class="fn">print</span>(<span class="str">f"MSE noisy    = {mse_noisy:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"MSE denoised = {mse_denoised:.4f}    ({100*(1-mse_denoised/mse_noisy):.1f}% reduction)"</span>)

<span class="cm"># --- Plot --------------------------------------------------------</span>
fig, ax = plt.<span class="fn">subplots</span>(<span class="num">3</span>, <span class="num">1</span>, figsize=(<span class="num">10</span>, <span class="num">6</span>), sharex=<span class="kw">True</span>)
ax[<span class="num">0</span>].<span class="fn">plot</span>(t, clean, color=<span class="str">"#3b82f6"</span>); ax[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Clean signal (truth)"</span>)
ax[<span class="num">1</span>].<span class="fn">plot</span>(t, noisy, color=<span class="str">"#ef4444"</span>); ax[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Noisy input"</span>)
ax[<span class="num">2</span>].<span class="fn">plot</span>(t, denoised, color=<span class="str">"#10b981"</span>); ax[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"Wavelet denoised (Haar, soft threshold)"</span>)
<span class="kw">for</span> a <span class="kw">in</span> ax: a.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">tight_layout</span>(); plt.<span class="fn">show</span>()</code></pre></div>

<div class="l-note"><strong>Run this in the lab below.</strong> You should see roughly a 60-80% MSE reduction. The smooth sinusoidal background gets cleaned up beautifully AND the two narrow spikes survive. Try replacing the Haar with a longer Daubechies wavelet via <code>pywt</code> (if available in your Pyodide build); the smooth parts will look even better but you'll need more vanishing moments to keep the spikes sharp. Try a Fourier-domain low-pass filter for comparison — it will smear the spikes into bumps.</div>

<div class="calc-example"><div class="example-label">EXTENSIONS TO TRY</div><div class="example-body"><strong>(1)</strong> Replace the noise with non-Gaussian (Student-t or Laplacian) noise. Universal threshold still works surprisingly well.<br><strong>(2)</strong> Use <code>pywt.wavedec(noisy, "db4", level=6)</code> if PyWavelets is available. Compare reconstruction quality at sharp features vs Haar.<br><strong>(3)</strong> Replace soft thresholding with hard thresholding. Notice the surviving large coefficients are preserved at full magnitude — sharper but more "wiggly" reconstruction.<br><strong>(4)</strong> Build a 2D Haar DWT on a noisy image (rows then columns) and denoise. You will get a working wavelet image denoiser in about 40 lines of code.</div></div>

<h2 class="l-title">Summary</h2>

<p class="l-text">Fourier tells you which frequencies are present in a signal but not when. The STFT solves part of the problem by sliding a fixed-width window, but its uniform time-frequency tiling cannot adapt to events of different durations. <strong>Wavelets fix this</strong> by using narrow windows for high frequencies and wide windows for low frequencies, giving a dyadic tiling of the time-frequency plane that respects Heisenberg while gracefully adapting to local signal structure. The Continuous Wavelet Transform <code>W_f(a, b)</code> projects onto scaled and translated copies of a mother wavelet <code>\\psi</code>; the discrete version uses dyadic scales and runs via Mallat's pyramid algorithm in <code>O(N)</code> — faster than FFT. Three families dominate: Haar (simplest), Morlet (best for time-frequency analysis), Daubechies (the workhorse of JPEG2000 and signal processing). Applications include JPEG2000 image compression, signal denoising via Donoho-Johnstone universal thresholding, and time-frequency visualization of biomedical and seismic signals. In modern AI, wavelets are a niche but valuable tool: a standard preprocessing step before ML on biomedical signals, a strong baseline on tiny datasets via scattering networks, and the foundation of JPEG2000 — but they are not used in Transformers or modern learned CNNs. With your hand-coded Haar DWT and a five-line denoising loop, you now have one of the most cited results in signal processing in your toolbox.</p>
`,

tr: `<p class="l-text"><strong>Fourier Dönüşümü bir sinyalde hangi frekansların yaşadığını söyler; ne var ki her birinin ne zaman ortaya çıktığını söyleyemez.</strong> Kayıtın başındaki bir kuş ötüşü ile sonundaki bir keman tremolosu, ikisinin de boyunca devam eden durağan bir karışımın ürettiğiyle aynı spektrumu üretebilir. Müzik, konuşma, EEG, sismik veri, kütle çekim dalgaları — kısacası durağan olmayan her şey için bu, ölümcül bir kısıttır. <em>Wavelet Dönüşümü</em> bunun standart çaresidir.</p>

<p class="l-text">Wavelet'ler çoğu mühendise mistik gelir, çünkü ders kitapları genellikle yirmi sayfalık bir fonksiyonel analizle açılır: Riesz bazları, Sobolev uzayları, alt uzaylar kulesi olarak çoklu çözünürlük analizi. Hepsini atlayacağız. Wavelet fikri geometrik olarak basittir — <em>hızlı olaylar için kısa pencereler, yavaş olaylar için uzun pencereler</em> — ve resmi gördüğünüz an formüller defter tutmaya dönüşür. Bu ders önce resmi, sonra matematiği gösterecek, en sonunda Pyodide'da gerçek bir wavelet gürültü temizliği yaptıracak.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Standart Fourier Dönüşümünün olayları zamanda neden yerelleştiremediğini ve bir cıvıltı ile durağan bir tonun nasıl aynı spektrumu paylaşabildiğini açıklayın</li>
<li>STFT'yi ve spektrogramı tanımlayın, Heisenberg eşitsizliğinin sizi zaman ve frekans çözünürlüğü arasında bir takasa zorladığı tam noktayı görün</li>
<li>Sürekli Wavelet Dönüşümünü W(a,b) ifade edin, ölçek a ve öteleme b'yi yorumlayın, üç yaygın ana wavelet'i (Haar, Morlet, Mexican hat) ayırt edin</li>
<li>Dyadic DWT piramit algoritmasını adım adım uygulayın ve neden O(N) çalıştığını — FFT'den daha hızlı — açıklayın</li>
<li>Donoho-Johnstone evrensel eşiği ile wavelet eşikleme uygulayarak gerçek bir sinyali gürültüden temizleyin</li>
<li>Wavelet'lerin modern yapay zekada gerçekten önemli olduğu yerleri (JPEG2000 hatları, biyomedikal ön işleme, scattering ağları) ve olmadığı yerleri (Transformer çağı LLM'leri) ayırt edin</li>
</ul>
</div>

<h2 class="l-title">1. Fourier'nin Sınırı — Zaman-Frekans Takası</h2>

<p class="l-text">Bir saniyelik bir ses kaydettiğinizi varsayalım: ilk yarım saniyede alçak bir ton (200 Hz), ikinci yarım saniyede yüksek bir ton (800 Hz). Şimdi arkadaşınız da bir saniyelik bir kayıt yapsın: tüm süre boyunca 200 Hz <em>ve</em> 800 Hz aynı anda çalsın. Her iki sinyalin de enerjisi tam olarak 200 Hz ve 800 Hz'tedir. Her iki kaydı FFT'ye verip "bu sinyalde hangi frekanslar var?" diye sorarsanız, yanıt her ikisi için de "200 Hz ve 800 Hz, kabaca eşit oranda." Fourier ikisini birbirinden ayırt edemez.</p>

<div class="calc-formula"><div class="formula-label">FOURIER'NİN ZAMAN KÖRLÜĞÜ</div><div class="formula-main">$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-i\\omega t}\\, dt$$</div><div class="formula-sub">İntegral TÜM zaman üzerinde alınır. Yerelleşmiş olaylar küresel bir spektrum boyunca yayılır.</div></div>

<p class="l-text">Bunun kök nedeni baz seçimidir. Fourier sinyalleri <code>e^{i\\omega t}</code> üzerinden açar — <em>sonsuz süreli</em> saf sinüsler. Bunlar frekansta kusursuz yerelleşmişlerdir (spektrumda tek bir delta) ama zamanda hiç yerelleşmemişlerdir. Zamanda yerelleşmiş bir sinyali (bir tıkırtı, bir cıvıltı, bir nota başlangıcı) temsil etmek için FT, kuyrukları olayın yaşadığı küçük bölge dışında her yerde birbirini götüren çok sayıda sinüsü birleştirmek zorundadır. Olayın <em>ne zaman</em> olduğu bilgisi spektrumun <em>faz</em> ilişkilerinde gizlenir ve orada insan gözüyle pratikte okunamaz hâle gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durağan sinyal</div><div class="card-body">Frekans içeriği zamanla değişmeyen sinyal: sürekli 440 Hz'lik bir ton, sabit beyaz gürültü, 50 Hz'lik AC akım. Bunlar için Fourier mükemmeldir.</div></div>
<div class="calc-card"><div class="card-title">Durağan olmayan sinyal</div><div class="card-body">Frekans içeriği zamanla değişen sinyal: konuşma, müzik, EKG, sismik dalgalar, kütle çekim dalgası cıvıltıları, EEG nöbetleri. Bunlar için Fourier kritik bilgiyi kaybeder.</div></div>
<div class="calc-card"><div class="card-title">Müzik notasyonu analojisi</div><div class="card-body">Bir müzik partisyonu bir zaman-frekans gösterimidir: yatay eksen zaman, dikey eksen perde (frekans), noktalar hangi notanın ne zaman çalındığını söyler. Fourier size kullanılan tüm notaların yalnızca histogramını verir — icra için yararsız.</div></div>
<div class="calc-card"><div class="card-title">İstediğimiz şey</div><div class="card-body">Bir sinyali HEM zamanda HEM frekansta yerelleşmiş yapı taşlarına ayıran bir dönüşüm. Her katsayı iki soruyu yanıtlamalı: "hangi frekans içeriği" ve "hangi zaman civarında".</div></div>
</div>

<div class="l-note"><strong>Somut bir gösterim:</strong> <code>[0, 4]</code> üzerinde <code>f(t) = \\sin(2\\pi \\cdot 5 t) + \\sin(2\\pi \\cdot 20 t)</code> ile <code>[0, 2]</code> aralığında <code>\\sin(2\\pi \\cdot 5 t)</code> ve ardından <code>[2, 4]</code> aralığında <code>\\sin(2\\pi \\cdot 20 t)</code> olan <code>g(t)</code>'yi düşünün. <code>|F(\\omega)|</code> ve <code>|G(\\omega)|</code> büyüklük spektrumlarının ikisi de 5 Hz ve 20 Hz'te tepe yapar. Farklar tamamen faz içinde yaşar ve doğrudan yorumlanması zordur.</div>

<h2 class="l-title">2. STFT (Kısa Zamanlı Fourier Dönüşümü) — İlk Deneme</h2>

<p class="l-text">Her mühendisin aklına ilk gelen fikir şudur: <strong>sinyal boyunca küçük bir pencereyi kaydır ve her pencerede FFT yap</strong>. Bir pencere fonksiyonu <code>w(t)</code> seç (dikdörtgen, Gauss, Hann), <code>\\tau</code> kadar kaydır, çarp ve dönüştür. Bu, Kısa Zamanlı Fourier Dönüşümüdür.</p>

<div class="calc-formula"><div class="formula-label">STFT TANIMI</div><div class="formula-main">$$\\text{STFT}_f(\\tau, \\omega) = \\int_{-\\infty}^{\\infty} f(t)\\, w(t - \\tau)\\, e^{-i\\omega t}\\, dt$$</div><div class="formula-sub">Artık iki argüman var: tau (pencerenin zamanda nerede oturduğu) ve omega (frekans). Sonuç zaman-frekans düzleminde 2B bir fonksiyondur.</div></div>

<p class="l-text">Karesel büyüklük <code>|\\text{STFT}_f(\\tau, \\omega)|^2</code>, <strong>spektrogram</strong> olarak adlandırılır. Ses editörlerinde (Audacity, Adobe Audition), konuşma tanıma araçlarında ve sismoloji yazılımlarında gördüğünüz standart zaman-frekans gösterimidir. Yatay eksen zaman, dikey eksen frekans, renk yoğunluğu da <code>\\tau</code> zamanı civarında <code>\\omega</code> frekansının ne kadar bulunduğunu kodlar.</p>

<div class="calc-formula"><div class="formula-label">SPEKTROGRAM</div><div class="formula-main">$$S(\\tau, \\omega) = \\left|\\text{STFT}_f(\\tau, \\omega)\\right|^2$$</div><div class="formula-sub">Zaman-frekans düzleminde enerji yoğunluğu. Her zaman negatif olmayan, her zaman reel.</div></div>

<p class="l-text">STFT son derece kullanışlıdır ve hâlâ kısa zamanlı ses analizinin standardıdır (MFCC, mel-spektrogramlar wav2vec ve Whisper'a girer — hepsi STFT ile başlar). Ne var ki <strong>temel bir kusuru</strong> vardır: pencere <code>w(t)</code> sabit genişliktedir. Bir kez seçtiğinizde, sinyalin her parçasına aynı şekilde uygulanan <em>tek bir</em> zaman-frekans çözünürlüğüne bağlanmış olursunuz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dar pencere</div><div class="card-body">İyi zaman çözünürlüğü: olayın tam ne zaman olduğunu söyleyebilirsiniz. Kötü frekans çözünürlüğü: dar pencerenin spektrumu geniştir, yakın frekanslar birbirine karışır. Perküsyon vuruşları, geçici olaylar için yararlı.</div></div>
<div class="calc-card"><div class="card-title">Geniş pencere</div><div class="card-body">İyi frekans çözünürlüğü: yakın aralıklı sinüsleri ayırt edebilirsiniz. Kötü zaman çözünürlüğü: bir frekansın tam ne zaman açılıp kapandığını söyleyemezsiniz. Sürdürülen tonlar, harmonik analizi için yararlı.</div></div>
<div class="calc-card"><div class="card-title">En iyi seçim yok</div><div class="card-body">Hem geçici olaylar (davul vuruşları) HEM sürekli tonlar (keman ezgileri) içeren bir sinyal için tek bir pencere genişliği doğru değildir. Ses mühendisleri uzlaşır; wavelet'ler ise seçmeyi reddederler.</div></div>
</div>

<div class="think-box"><div class="think-label">HEISENBERG İŞ BAŞINDA (L4'TEN HATIRLAYIN)</div><div class="think-body">STFT'nin çözünürlük ikilemi bir yazılım sınırlaması değildir. Ders 4'te kanıtladığımız belirsizlik ilkesinin tam olarak aynısıdır: <code>\\Delta t \\cdot \\Delta\\omega \\ge 1/2</code>. Pencerenin zamansal genişliği ile spektral genişliğinin çarpımı aşağıdan sınırlıdır. Gabor (1946) Gauss penceresinin bu sınırı doyurduğunu fark etti — Gauss pencereli STFT aynı zamanda <em>Gabor dönüşümü</em> olarak adlandırılır ve bu anlamda en iyi STFT'dir. Ancak "en iyi STFT" yine de tek tip bir döşeme demektir.</div></div>

<h2 class="l-title">3. Wavelet Fikri — Çoklu Çözünürlük</h2>

<p class="l-text">İşte wavelet sezgisi, olabildiğince yalın ifadeyle. Gerçek sinyallerdeki olayların süreleri birbirinden çok farklıdır. Bir tıkırtı bir milisaniye sürer. Bir müzik notası saniyenin onda biri sürer. Bir hava deseni bir hafta sürer. <strong>Hepsini analiz etmek için neden aynı pencere genişliğini kullanalım?</strong></p>

<p class="l-text">Yüksek frekanslı olaylar genellikle kısadır. Düşük frekanslı olaylar genellikle uzundur. Öyleyse: yüksek frekanslara bakmak için <em>kısa</em> pencere (kısa olaylar için iyi zaman yerelleşmesi), düşük frekanslara bakmak için <em>uzun</em> pencere (yavaş salınımlar için iyi frekans yerelleşmesi) kullanın. Pencere genişliği frekansla ters orantılı olarak ölçeklenir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">STFT döşemesi</div><div class="card-body">Zaman-frekans düzleminde tek tip bir dikdörtgen ızgarası. Her hücre aynı <code>\\Delta t</code> genişliğinde ve aynı <code>\\Delta\\omega</code> yüksekliğindedir. Tek pencere boyu, her yerde.</div></div>
<div class="calc-card"><div class="card-title">Wavelet döşemesi</div><div class="card-body">Tek tip olmayan bir bölümleme: yüksek frekanslarda hücreler zamanda dar ve frekansta uzundur; düşük frekanslarda zamanda geniş ve frekansta kısadır. Hücre alanı sabittir (Heisenberg hâlâ geçerli), yalnızca en-boy oranı uyum sağlar.</div></div>
<div class="calc-card"><div class="card-title">Mikroskop analojisi</div><div class="card-body">Wavelet dönüşümü, zoom'u ayarlanabilen bir mikroskop gibidir. Uzaklaşın (büyük ölçek) ve sinyalin yavaş yapısını görün; yakınlaşın (küçük ölçek) ve hızlı detayları görün. Aynı alet, farklı büyütmeler.</div></div>
</div>

<div id="plot-tiling-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var stftShapes=[];for(var i=0;i<8;i++){for(var j=0;j<6;j++){stftShapes.push({type:"rect",xref:"x1",yref:"y1",x0:i,y0:j,x1:i+1,y1:j+1,line:{color:"#3b82f6",width:1.2},fillcolor:"rgba(59,130,246,0.08)"});}}
var wvShapes=[];
for(var i=0;i<8;i++){wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:i,y0:0,x1:i+1,y1:1,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.08)"});}
for(var i=0;i<4;i++){wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:2*i,y0:1,x1:2*i+2,y1:2.5,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.10)"});}
for(var i=0;i<2;i++){wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:4*i,y0:2.5,x1:4*i+4,y1:4.5,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.12)"});}
wvShapes.push({type:"rect",xref:"x2",yref:"y2",x0:0,y0:4.5,x1:8,y1:6,line:{color:"#10b981",width:1.2},fillcolor:"rgba(16,185,129,0.14)"});
var traces=[
{x:[0],y:[0],mode:"text",text:["STFT: tek tip döşeme"],textfont:{color:"#3b82f6",size:14},xaxis:"x1",yaxis:"y1",showlegend:false},
{x:[0],y:[0],mode:"text",text:["Wavelet: dyadic döşeme"],textfont:{color:"#10b981",size:14},xaxis:"x2",yaxis:"y2",showlegend:false}
];
var layout={grid:{rows:1,columns:2,pattern:"independent"},paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{domain:[0,0.46],title:"zaman",range:[-0.3,8.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
yaxis:{title:"frekans",range:[-0.3,6.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
xaxis2:{domain:[0.54,1],title:"zaman",range:[-0.3,8.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
yaxis2:{title:"frekans",range:[-0.3,6.3],gridcolor:"rgba(255,255,255,0.04)",zerolinecolor:"rgba(255,255,255,0.10)"},
shapes:stftShapes.concat(wvShapes),showlegend:false,margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-tiling-tr",traces,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Solda:</strong> STFT döşemesi — her hücre aynı şekilde. <strong>Sağda:</strong> wavelet (dyadic) döşemesi — yüksek frekanslar zamanda ince dilimlenir, düşük frekanslar frekansta ince dilimlenir. Her hücrenin alanı yine aynıdır (Heisenberg), yalnızca en-boy oranı değişir.</div></div>

<h2 class="l-title">4. Ana Wavelet</h2>

<p class="l-text">Şimdi matematiğe geçelim. Bir <strong>ana wavelet</strong> <code>\\psi(t)</code> iki özelliğe sahip bir fonksiyondur:</p>

<div class="calc-formula"><div class="formula-label">ANA WAVELET KOŞULLARI</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} \\psi(t)\\, dt = 0, \\qquad \\int_{-\\infty}^{\\infty} |\\psi(t)|^2\\, dt &lt; \\infty$$</div><div class="formula-sub">Sıfır ortalama (yani bir "dalga") ve sonlu enerji (yani bir "let" — sönüp giden küçük bir dalga).</div></div>

<p class="l-text">Bu tek anadan, <strong>ölçekleme</strong> (parametre <code>a &gt; 0</code>) ve <strong>öteleme</strong> (parametre <code>b \\in \\mathbb{R}</code>) ile bütün bir aile türetiriz:</p>

<div class="calc-formula"><div class="formula-label">WAVELET AİLESİ</div><div class="formula-main">$$\\psi_{a,b}(t) = \\frac{1}{\\sqrt{a}}\\, \\psi\\!\\left(\\frac{t - b}{a}\\right)$$</div><div class="formula-sub">Anayı a ile gerin (büyük a = geniş), t=b civarında ortalanmasını sağlamak için kaydırın. 1/sqrt(a) çarpanı L^2 normunu korur, böylece ailedeki tüm wavelet'ler aynı enerjiye sahip olur.</div></div>

<p class="l-text"><strong>Sürekli Wavelet Dönüşümü (CWT)</strong> sinyali bu ailenin her üyesi üzerine izdüşürür:</p>

<div class="calc-formula"><div class="formula-label">SÜREKLİ WAVELET DÖNÜŞÜMÜ</div><div class="formula-main">$$W_f(a, b) = \\int_{-\\infty}^{\\infty} f(t)\\, \\overline{\\psi_{a,b}(t)}\\, dt = \\frac{1}{\\sqrt{a}} \\int f(t)\\, \\overline{\\psi\\!\\left(\\frac{t-b}{a}\\right)}\\, dt$$</div><div class="formula-sub">Ölçek a ve öteleme b'nin 2B fonksiyonu. f'nin a ölçeğinde, b zamanına ortalanmış bir wavelet ile iç çarpımı.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ölçek a</div><div class="card-body">Büyük <code>a</code> = gerilmiş (geniş) wavelet = yavaş salınımlara (düşük frekanslara) duyarlı. Küçük <code>a</code> = sıkıştırılmış (dar) wavelet = hızlı salınımlara (yüksek frekanslara) duyarlı. Ölçek frekansla ters ilişkilidir.</div></div>
<div class="calc-card"><div class="card-title">Öteleme b</div><div class="card-body">Wavelet'in zamanda nerede oturduğu. Sabit <code>a</code>'da <code>b</code>'yi sinyal boyunca kaydırmak size sinyalin zamanın fonksiyonu olarak bir "frekans bandını" verir.</div></div>
<div class="calc-card"><div class="card-title">Ters CWT</div><div class="card-body"><code>\\psi</code> üzerine hafif bir kabul edilebilirlik koşulu altında, orijinal sinyal geri kazanılabilir: <code>f(t) = (1/C_\\psi) \\int\\int W_f(a,b) \\psi_{a,b}(t) (da\\, db / a^2)</code>. Hiçbir bilgi kaybolmaz.</div></div>
</div>

<div class="l-note"><strong>Yorum:</strong> <code>W_f(a, b)</code>, sinyal ile <code>b</code> zamanına ortalanmış <code>a</code> genişliğindeki bir wavelet arasındaki korelasyonu ölçer. Büyük bir değer "sinyal yerel olarak ana wavelet'in gerilmiş ve kaydırılmış bir kopyasına benziyor" demektir. Farklı ana wavelet'ler farklı şekillere (salınımlar, kenarlar, sivri uçlar) duyarlıdır.</div>

<h2 class="l-title">5. Yaygın Ana Wavelet'ler</h2>

<p class="l-text">Farklı uygulamaların farklı ana wavelet'lere ihtiyacı vardır. Pratikte dört aile baskın olarak öne çıkar:</p>

<div class="calc-formula"><div class="formula-label">HAAR WAVELET (1909)</div><div class="formula-main">$$\\psi_H(t) = \\begin{cases} +1 & 0 \\le t &lt; 1/2 \\\\ -1 & 1/2 \\le t &lt; 1 \\\\ 0 & \\text{aksi halde} \\end{cases}$$</div><div class="formula-sub">En basit wavelet: önce yukarı bir basamak, sonra aşağı bir basamak. Süreksiz ama hesaplaması son derece hızlı. Tarihsel olarak ilk.</div></div>

<div class="calc-formula"><div class="formula-label">MORLET WAVELET</div><div class="formula-main">$$\\psi_M(t) = \\pi^{-1/4}\\, e^{i\\omega_0 t}\\, e^{-t^2 / 2}$$</div><div class="formula-sub">Bir Gauss ile pencerelenmiş karmaşık bir sinüs. Tipik merkez frekansı omega_0 = 5 ya da 6. Mükemmel zaman-frekans yerelleşmesi (Gabor-Morlet).</div></div>

<div class="calc-formula"><div class="formula-label">MEXICAN HAT (RICKER) WAVELET</div><div class="formula-main">$$\\psi_R(t) = \\frac{2}{\\sqrt{3}\\, \\pi^{1/4}} \\left(1 - t^2\\right) e^{-t^2 / 2}$$</div><div class="formula-sub">Bir Gauss'un ikinci türevi. Simetrik, görüntülerde keskin tepe ve kenarları algılamak için iyidir.</div></div>

<div class="calc-formula"><div class="formula-label">DAUBECHIES AİLESİ (db1=Haar, db2, db4, db8, ...)</div><div class="formula-main">$$\\psi_{dbN} : \\text{kompakt destekli, ortogonal, kaybolan moment sayisi} = N$$</div><div class="formula-sub">Kapalı bir formu yoktur. Filtre katsayılarıyla tanımlanır. db4 ve db8, JPEG2000'in ve çoğu sinyal işleme aracının iş atlarıdır.</div></div>

<div id="plot-mothers-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var t=[];for(var i=-400;i<=400;i++){t.push(i/100);}
var haar=t.map(function(x){if(x>=0&&x<0.5)return 1;if(x>=0.5&&x<1)return -1;return 0;});
var morlet=t.map(function(x){return Math.pow(Math.PI,-0.25)*Math.cos(5*x)*Math.exp(-x*x/2);});
var mexhat=t.map(function(x){return (2/(Math.sqrt(3)*Math.pow(Math.PI,0.25)))*(1-x*x)*Math.exp(-x*x/2);});
var db4=t.map(function(x){var u=(x+1.5)/3;if(u<0||u>1)return 0;var w=Math.sin(2.2*Math.PI*u)*Math.exp(-Math.pow((u-0.45)/0.22,2))*Math.pow(u*(1-u)*4,0.6);return w*1.4;});
var trs=[
{x:t,y:haar,mode:"lines",name:"Haar",line:{color:"#3b82f6",width:2},xaxis:"x1",yaxis:"y1"},
{x:t,y:morlet,mode:"lines",name:"Morlet (reel kısım)",line:{color:"#10b981",width:2},xaxis:"x2",yaxis:"y2"},
{x:t,y:mexhat,mode:"lines",name:"Mexican hat",line:{color:"#f59e0b",width:2},xaxis:"x3",yaxis:"y3"},
{x:t,y:db4,mode:"lines",name:"Daubechies-4 (taslak)",line:{color:"#ef4444",width:2},xaxis:"x4",yaxis:"y4"}
];
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{domain:[0,0.46],anchor:"y1",title:"t",range:[-0.5,1.5],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis:{domain:[0.58,1],anchor:"x1",title:"psi",range:[-1.4,1.4],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
xaxis2:{domain:[0.54,1],anchor:"y2",title:"t",range:[-4,4],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis2:{domain:[0.58,1],anchor:"x2",title:"psi",range:[-0.8,0.8],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
xaxis3:{domain:[0,0.46],anchor:"y3",title:"t",range:[-4,4],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis3:{domain:[0,0.42],anchor:"x3",title:"psi",range:[-0.5,0.9],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
xaxis4:{domain:[0.54,1],anchor:"y4",title:"t",range:[-2,2],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis4:{domain:[0,0.42],anchor:"x4",title:"psi",range:[-1.5,1.5],gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-mothers-tr",trs,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Sol-üst:</strong> Haar — süreksiz, kare darbeler. <strong>Sağ-üst:</strong> Morlet — pencerelenmiş sinüs, zaman-frekans analizinin iş atı. <strong>Sol-alt:</strong> Mexican hat — Gauss'un ikinci türevi, kenar bulucu. <strong>Sağ-alt:</strong> Daubechies-4 taslak — kompakt destekli ama tırtıklı; gerçek db4'ün kapalı bir formu yoktur ve filtre katsayılarıyla tanımlanır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hangi iş için hangisi?</div><div class="card-body"><strong>Haar:</strong> öğretim, hızlı prototipler, ani değişimler içeren sinyaller. <strong>Morlet:</strong> EEG, müzik, kütle çekim dalgaları için zaman-frekans analizi (LIGO bir varyantını kullanır). <strong>Mexican hat:</strong> derin öğrenme öncesi çağda görüntü kenar/blob bulma. <strong>Daubechies:</strong> sıkıştırma (JPEG2000 CDF 9/7 kullanır), genel sinyal işleme.</div></div>
<div class="calc-card"><div class="card-title">Kaybolan momentler</div><div class="card-body"><code>N</code> kaybolan momenti olan bir wavelet, <code>N</code>'den küçük dereceli tüm polinomlara ortogonaldir. dbN'nin tam olarak <code>N</code> kaybolan momenti vardır. Daha yüksek değer, pürüzsüz sinyallerin daha seyrek wavelet katsayılarıyla temsil edilmesini sağlar — sıkıştırma tarafından sömürülen ana özellik.</div></div>
<div class="calc-card"><div class="card-title">Simetri</div><div class="card-body">Daubechies wavelet'leri simetrik değildir (ortogonallik + kompakt destek + simetrinin Haar dışında olanaksız olduğu kanıtlanmıştır). Simetrinin önemli olduğu görüntü işleme için CDF 9/7 gibi bi-ortogonal wavelet'leri kullanın.</div></div>
</div>

<h2 class="l-title">6. Ayrık Wavelet Dönüşümü (DWT) ve Piramit Algoritması</h2>

<p class="l-text">Her <code>(a, b)</code>'de CWT hesaplamak fazlasıyla artıklıdır. Uygulama için ayrıklaştırırız: tam sayılar <code>j, k</code> için <strong>dyadic</strong> ölçekler <code>a = 2^{-j}</code> ve ötelemeler <code>b = k \\cdot 2^{-j}</code>. Bu, Ayrık Wavelet Dönüşümünü (DWT) verir:</p>

<div class="calc-formula"><div class="formula-label">DWT KATSAYILARI</div><div class="formula-main">$$d_{j,k} = \\int f(t)\\, \\psi_{j,k}(t)\\, dt, \\qquad \\psi_{j,k}(t) = 2^{j/2}\\, \\psi(2^j t - k)$$</div><div class="formula-sub">İki tam sayı indeks: j = ölçek seviyesi (büyük j = ince ölçek / yüksek frekans), k = bu ölçekte zaman konumu.</div></div>

<p class="l-text">Ortogonal wavelet'ler için (Haar, Daubechies, ...) <code>\\psi_{j,k}</code>'lar <code>L^2(\\mathbb{R})</code>'nin bir ortonormal bazını oluşturur, dolayısıyla her sinyal tam bir açılım <code>f = \\sum_{j,k} d_{j,k}\\, \\psi_{j,k}</code> kabul eder ve Parseval geçerlidir: toplam sinyal enerjisi <code>\\sum_{j,k} |d_{j,k}|^2</code>'ye eşittir.</p>

<p class="l-text">Wavelet'leri pratik kılan kırılma noktası Mallat'nın <strong>piramit algoritmasıydı</strong> (1989). Her <code>d_{j,k}</code>'yı integrasyonla hesaplamak yerine, iki kısa filtre — bir alçak geçiren <code>h</code> ve bir yüksek geçiren <code>g</code> — kullanır ve özyineliriz:</p>

<div class="calc-formula"><div class="formula-label">PİRAMİT YİNELEMESİ</div><div class="formula-main">$$a_{j-1}[n] = \\sum_k h[k - 2n]\\, a_j[k], \\qquad d_{j-1}[n] = \\sum_k g[k - 2n]\\, a_j[k]$$</div><div class="formula-sub">j seviyesinden j-1 seviyesini hesapla: alçak geçiren + 2 ile alt örnekleme sonraki yaklaşıklığı a_{j-1}'i verir, yüksek geçiren + alt örnekleme ayrıntı katsayıları d_{j-1}'i verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdiler ve çıktılar</div><div class="card-body">Uzunluğu <code>N = 2^J</code> olan <code>a_J = f</code> sinyali ile başla. Bir aşama sonra <code>N/2</code> yaklaşıklık katsayın ve <code>N/2</code> ayrıntı katsayın olur. İki aşama sonra: <code>N/4 + N/4 + N/2</code>. <code>J</code> aşama sonra: ayrıntı bantlarının bir ağacı artı tek bir kaba yaklaşıklık.</div></div>
<div class="calc-card"><div class="card-title">Karmaşıklık: O(N)</div><div class="card-body">Her aşama sinyal uzunluğunu yarıya indirir, dolayısıyla toplam iş <code>cN + c(N/2) + c(N/4) + \\ldots = 2cN</code>'dir. DWT, <strong>FFT'den daha hızlıdır</strong> (FFT <code>O(N \\log N)</code>'dir). Bu, wavelet'lerin popüler olmasının pratik nedenlerinden biridir.</div></div>
<div class="calc-card"><div class="card-title">Kusursuz yeniden yapım</div><div class="card-body">Filtre bankasını geriye doğru çalıştır (2 ile üst örnekleme, sentez filtreleriyle evrişim) ve sinyali tam olarak geri kazan. <code>(h, g)</code> üzerinde kusursuz yeniden yapım için gereken koşul <em>karelik ayna filtresi</em> (QMF) koşulu olarak adlandırılır.</div></div>
</div>

<div class="l-note"><strong>Haar filtresi:</strong> <code>h = (1/\\sqrt{2}, 1/\\sqrt{2})</code> ve <code>g = (1/\\sqrt{2}, -1/\\sqrt{2})</code>. Yani Haar DWT, ardışık örnek çiftlerinin koşan ortalamalarını (yaklaşıklık) ve koşan farklarını (ayrıntı) alır, sonra her birinden bir tanesini saklar. Tüm algoritma birkaç satır Python'a sığar.</div>

<h2 class="l-title">7. Çoklu Çözünürlük Analizi (MRA) — Mallat Çerçevesi</h2>

<p class="l-text">Piramit algoritmasının arkasındaki temiz kuram Mallat'nın <strong>Çoklu Çözünürlük Analizidir</strong>. Bir çoklu çözünürlük analizi, <code>L^2(\\mathbb{R})</code>'nin iç içe geçmiş kapalı alt uzaylarının bir dizisidir:</p>

<div class="calc-formula"><div class="formula-label">MRA İÇ İÇE GEÇMESİ</div><div class="formula-main">$$\\cdots \\subset V_{-1} \\subset V_0 \\subset V_1 \\subset V_2 \\subset \\cdots \\subset L^2(\\mathbb{R})$$</div><div class="formula-sub">Her V_j, "2^j çözünürlüğünde görünen sinyallerin" uzayıdır. Zincirde yukarı çıkmak resmi inceltir.</div></div>

<p class="l-text">Bu uzayların bir öz benzerlik koşulunu sağlaması gerekir: <code>f(t) \\in V_j \\Leftrightarrow f(2t) \\in V_{j+1}</code> (2 ile yakınlaşmak sizi bir seviye yukarı taşır) ve birleşimleri yoğun, kesişimleri trivialdır. Kritik olarak, tam sayı ötelemeleri <code>\\{\\varphi(t - k)\\}_{k\\in\\mathbb{Z}}</code> <code>V_0</code>'ın ortonormal bir bazını oluşturan bir <strong>ölçekleme fonksiyonu</strong> <code>\\varphi(t)</code> var olmalıdır.</p>

<p class="l-text"><strong>Wavelet uzayı</strong> <code>W_j</code>, <code>V_j</code>'nin <code>V_{j+1}</code> içindeki ortogonal tümleyeni olarak tanımlanır: <code>2^j</code> çözünürlüğünden <code>2^{j+1}</code> çözünürlüğüne inceltmek için gereken tam "ayrıntıyı" içerir. Ana wavelet <code>\\psi</code> seçilir, öyle ki ötelemeleri <code>W_0</code>'ı kaplar. O zaman tüm uzay şöyle ayrışır:</p>

<div class="calc-formula"><div class="formula-label">ORTOGONAL AYRIŞIM</div><div class="formula-main">$$L^2(\\mathbb{R}) = V_0 \\oplus W_0 \\oplus W_1 \\oplus W_2 \\oplus \\cdots = \\bigoplus_{j \\in \\mathbb{Z}} W_j$$</div><div class="formula-sub">Her sinyal bir kaba kısma (V_0'da) artı giderek ince ölçeklerdeki ayrıntılara (W_0, W_1, ...'de) ayrılır.</div></div>

<div class="think-box"><div class="think-label">NEDEN ÖNEMLİ</div><div class="think-body">MRA, piramit algoritmasını meşru kılan şeydir. <code>h</code> ve <code>g</code> filtreleri rastgele seçilmez — <em>iki ölçek denklemi</em> <code>\\varphi(t) = \\sqrt{2} \\sum_k h[k]\\, \\varphi(2t - k)</code> aracılığıyla ölçekleme fonksiyonu <code>\\varphi</code> seçimi tarafından zorunlu kılınır. <code>\\varphi</code>'yi belirlemek <code>h</code>'yi belirler, o <code>g</code>'yi belirler, o da <code>\\psi</code>'yi belirler. Daubechies'in 1988'deki kompakt destekli ortogonal wavelet inşası, bu kısıtların olabildiğince çok kaybolan momentle bir başyapıt çözümüydü.</div></div>

<h2 class="l-title">8. Uygulama 1: Görüntü Sıkıştırma (JPEG2000)</h2>

<p class="l-text">Klasik JPEG (1992) 8x8 bloklarda Ayrık Kosinüs Dönüşümü kullanır. Blok yapısı yüksek sıkıştırmada bildiğimiz "bloklu" yapıntıları üretir. <strong>JPEG2000 (2000)</strong> DCT'yi 2B wavelet dönüşümüyle değiştirdi — tipik olarak bi-ortogonal CDF 9/7 filtresi — tüm görüntüye bir kerede uygulanır. Sıkıştırma hattı şudur:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1: 2B DWT</div><div class="card-body">Görüntünün her satırına 1B DWT uygula, sonra sonucun her sütununa. Bu dört alt bant üretir: LL (alçak-alçak, kaba yaklaşıklık) ve üç ayrıntı bandı LH, HL, HH (yatay, dikey, çapraz kenarlar). Çok seviyeli ayrışma için LL üzerinde özyinele.</div></div>
<div class="calc-card"><div class="card-title">Adım 2: Nicemleme</div><div class="card-body">Wavelet katsayılarını daha az seviyeye yuvarla. Küçük katsayılar (çoğunlukla gürültü / ince doku) agresif şekilde nicemlenir; büyük katsayılar (kenarlar) daha özenli korunur.</div></div>
<div class="calc-card"><div class="card-title">Adım 3: Entropi kodlama</div><div class="card-body">Nicemlenmiş katsayıları bir aritmetik kodlayıcıyla (EBCOT) kodla. Çoğu katsayı sıfır veya sıfıra yakındır, dolayısıyla bu çok iyi sıkıştırır.</div></div>
</div>

<p class="l-text">Doğal görüntüler için JPEG2000 tipik olarak aynı algılanan kalitede yüzde 20-30 daha iyi sıkıştırma sağlar ve ağır sıkıştırmadaki yapıntılar bloklu yerine <em>bulanıktır</em> — genellikle görsel olarak daha kabul edilebilir. Buna rağmen tarihsel nedenlerle klasik JPEG format savaşını kazandı. JPEG2000 tıbbi görüntülemede (DICOM), dijital sinemada (DCI) ve arşivlemede yoğun olarak kullanılır.</p>

<div class="l-note"><strong>YZ ile bağlantı:</strong> derin öğrenme öncesi çağda (kabaca 2000-2012) görüntülerin wavelet temsilleri pek çok klasik bilgisayarlı görme hattını besledi: SIFT, HOG, doku sınıflandırıcılar. Modern CNN'ler bunu değiştirdi. Ancak <em>fikir</em> — görüntüleri birden çok ölçekte aynı anda temsil etmek — özellik piramit ağlarında (FPN, RetinaNet) ve U-Net'in kodlayıcı-kod çözücü yapısında yaşıyor. Bunlar öğrenilmiş çoklu çözünürlük analizleridir.</div>

<h2 class="l-title">9. Uygulama 2: Sinyal Gürültü Temizleme</h2>

<p class="l-text">Wavelet gürültü temizleme, wavelet'lerin en başarılı ve en yaygın kullanılan uygulamalarından biridir ve tek bir ampirik gözleme dayanır: <strong>gerçek sinyallerin birkaç büyük wavelet katsayısı vardır (kenarlar, tepeler, geçici olaylar); gürültü tüm katsayılara eşit yayılır</strong>. Yani küçük katsayıları sıfırlarsanız, çoğunlukla gürültüyü yok eder ve çoğunlukla sinyali korursunuz.</p>

<p class="l-text">Yordam (Donoho-Johnstone, 1994) şudur:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1: İleri DWT</div><div class="card-body">Standart sapması <code>\\sigma</code> olan Gauss gürültüsü <code>\\varepsilon</code> ile gürültülü sinyale <code>y = f + \\varepsilon</code> DWT uygula. <code>d_{j,k}</code> katsayılarını al.</div></div>
<div class="calc-card"><div class="card-title">Adım 2: Eşikle</div><div class="card-body">Evrensel eşik <code>T = \\sigma\\sqrt{2\\ln N}</code> uygula; burada <code>N</code> sinyal uzunluğudur. <code>|d_{j,k}| &lt; T</code> olan her katsayıyı sıfıra koy.</div></div>
<div class="calc-card"><div class="card-title">Adım 3: Ters DWT</div><div class="card-body">Eşiklenmiş katsayılar üzerinde piramit algoritmasını ters yönde çalıştır ve gürültüden temizlenmiş sinyali yeniden kur.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EVRENSEL EŞİK (DONOHO-JOHNSTONE)</div><div class="formula-main">$$T = \\sigma \\sqrt{2 \\ln N}$$</div><div class="formula-sub">N = 1024 için T kabaca 3.72 sigma'dır. Yüksek olasılıkla hiçbir gürültü katsayısı T'yi aşmaz; dolayısıyla hayatta kalan tüm katsayılar sinyaldir.</div></div>

<p class="l-text">İki eşikleme kuralı standarttır. <strong>Sert eşikleme</strong>, <code>|d| &lt; T</code> ise <code>d \\to 0</code>, aksi halde <code>d</code>'yi olduğu gibi bırakır. <strong>Yumuşak eşikleme</strong> ayrıca hayatta kalan katsayıları <code>T</code> kadar sıfıra doğru büzer: <code>d \\to \\text{sign}(d) \\cdot \\max(|d| - T, 0)</code>. Yumuşak eşikleme daha pürüzsüz yeniden yapımlar üretir; sert keskin özellikleri daha iyi korur.</p>

<div class="think-box"><div class="think-label">BÜZÜLME NEDEN ÇALIŞIR</div><div class="think-body">Yumuşak eşikleme, <code>\\min_x \\,(d - x)^2 + 2T|x|</code>'nin çözümüdür — L1 cezalı bir gürültü gidericidir. Bu, LASSO regresyonuyla aynı optimizasyon biçimidir. Donoho-Johnstone 1994'te wavelet yumuşak eşiklemenin geniş bir fonksiyon uzayları sınıfı üzerinde minimax anlamında <em>neredeyse-optimal</em> olduğunu gösterdiler. "Seyrek kodlama" derin öğrenme moda sözcüğü olmadan yirmi beş yıl önce, istatistikçiler zaten seyrek temsillerden sinyal sıkıyorlardı.</div></div>

<div id="plot-denoise-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=512;var t=[];var clean=[];var noisy=[];var denoised=[];
function rng(s){var x=Math.sin(s)*10000;return x-Math.floor(x);}
for(var i=0;i<N;i++){var x=i/N*8;t.push(x);var c=Math.sin(2*Math.PI*x/3)+0.5*Math.sin(2*Math.PI*x);
if(x>3&&x<3.3)c+=2.5;if(x>5.5&&x<5.7)c-=1.8;clean.push(c);noisy.push(c+0.45*(rng(i+1)+rng(i+97)+rng(i+523)-1.5));}
var a=noisy.slice();var work=a.slice();var coeffs=[];var len=N;
while(len>=8){var aN=new Array(len/2);var dN=new Array(len/2);
for(var k=0;k<len/2;k++){aN[k]=(work[2*k]+work[2*k+1])/Math.SQRT2;dN[k]=(work[2*k]-work[2*k+1])/Math.SQRT2;}
coeffs.push(dN);work=aN;len=len/2;}
var allD=[];for(var ii=0;ii<coeffs.length;ii++)for(var jj=0;jj<coeffs[ii].length;jj++)allD.push(Math.abs(coeffs[ii][jj]));
allD.sort(function(a,b){return a-b;});var sigma=allD[Math.floor(allD.length*0.5)]/0.6745;var T=sigma*Math.sqrt(2*Math.log(N));
for(var ii=0;ii<coeffs.length;ii++){for(var jj=0;jj<coeffs[ii].length;jj++){var v=coeffs[ii][jj];coeffs[ii][jj]=Math.abs(v)<T?0:Math.sign(v)*(Math.abs(v)-T);}}
var rec=work.slice();for(var ii=coeffs.length-1;ii>=0;ii--){var d=coeffs[ii];var up=new Array(rec.length*2);
for(var k=0;k<rec.length;k++){up[2*k]=(rec[k]+d[k])/Math.SQRT2;up[2*k+1]=(rec[k]-d[k])/Math.SQRT2;}rec=up;}denoised=rec;
var tr1={x:t,y:noisy,mode:"lines",name:"gürültülü girdi",line:{color:"#ef4444",width:1},opacity:0.6};
var tr2={x:t,y:clean,mode:"lines",name:"temiz sinyal (gerçek)",line:{color:"#3b82f6",width:2}};
var tr3={x:t,y:denoised,mode:"lines",name:"wavelet temizlenmiş",line:{color:"#10b981",width:2.2}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{title:"t",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
yaxis:{title:"genlik",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},
showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-denoise-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Gürültülü bir sinyal (kırmızı) iki pürüzsüz sinüs ve iki keskin geçici olay içerir (t=3 ve t=5.5 yakınındaki sivri uçlar). Temiz gerçek mavidir. Yeşil çizgi, Donoho-Johnstone evrensel eşiğinde yumuşak eşikleme ile Haar DWT kullanan wavelet ile temizlenmiş yeniden yapımdır. Pürüzsüz yapı geri kazanılır VE keskin geçici olaylar hayatta kalır — ne bir alçak geçiren filtre ne de bir hareketli ortalama bunu yapabilir.</div></div>

<h2 class="l-title">10. Uygulama 3: Zaman-Frekans Analizi (EKG, EEG, Sismik)</h2>

<p class="l-text">Bir <strong>skalogram</strong>, spektrogramın wavelet karşılığıdır: yatay eksende zaman <code>b</code> ve dikey eksende ölçek <code>a</code> (ya da karşılık gelen frekans) olan <code>|W_f(a, b)|^2</code>'nin 2B bir ısı haritası. Skalogramlar, kısa geçici olayların harmonik içerik kadar önemli olduğu sinyallerde parlar — tam olarak biyomedikal sinyallerdeki durum.</p>

<p class="l-text"><strong>Doğrusal bir cıvıltıyı</strong> <code>f(t) = \\sin(2\\pi(f_0 + (f_1 - f_0)\\cdot t/T)t)</code> düşünün; anlık frekansı <code>T</code> süresi boyunca <code>f_0</code>'dan <code>f_1</code>'e doğrusal olarak yükselir. Cıvıltının FT'si enerjinin <code>f_0</code> ile <code>f_1</code> arasında yayıldığını gösterir; frekansın değiştiğine dair bir belirti vermez. Skalogram ise tam tersine net bir köşegen sırt gösterir — kelimenin tam anlamıyla frekansın zamanla yükseldiğini görürsünüz.</p>

<div id="plot-scalogram-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=256;var t=[];var sig=[];for(var i=0;i<N;i++){var x=i/N*4;t.push(x);var inst=2+10*x/4;sig.push(Math.cos(2*Math.PI*(2*x+(10-2)*x*x/(2*4))));}
var scales=24;var freqs=[];var Z=[];
for(var s=0;s<scales;s++){var freq=2+(15-2)*s/(scales-1);freqs.push(freq);var row=[];
for(var b=0;b<N;b++){var sum=0;var width=Math.max(6,Math.round(80/freq));
for(var k=-width;k<=width;k++){var idx=b+k;if(idx<0||idx>=N)continue;var tt=k/(N/4);
var wv=Math.cos(2*Math.PI*freq*tt)*Math.exp(-tt*tt*freq*freq*0.08);sum+=sig[idx]*wv;}
row.push(Math.abs(sum));}Z.push(row);}
var trace={type:"heatmap",x:t,y:freqs,z:Z,colorscale:[[0,"#0a0a0a"],[0.25,"#1e293b"],[0.5,"#3b82f6"],[0.75,"#fbbf24"],[1,"#fef3c7"]],showscale:true,colorbar:{title:"|W|",titlefont:{color:"#e8e8e8"},tickfont:{color:"#e8e8e8"}}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},
xaxis:{title:"zaman t",gridcolor:"rgba(255,255,255,0.06)"},
yaxis:{title:"frekans (Hz, ölçekten)",gridcolor:"rgba(255,255,255,0.06)"},
showlegend:false,margin:{t:30,b:50,l:70,r:80}};
Plotly.newPlot("plot-scalogram-tr",[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">2 Hz'den 10 Hz'e 4 saniye boyunca doğrusal bir cıvıltının skalogramı. Köşegen parlak sırt, anlık frekansın zamanla doğrusal olarak yükseldiğini doğrudan gösterir. Fourier spektrumu, hiçbir zaman bilgisi olmaksızın enerjiyi 2 ile 10 Hz arasında dağınık biçimde gösterirdi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EKG / kalp ritmi</div><div class="card-body">Wavelet ayrışımı, QRS komplekslerini (yüksek frekanslı, geçici — kalp atışı sivri ucu) taban kaymasından (düşük frekans) ve kas yapıntısından (orta frekans) ayırır. Herhangi bir aritmik ML sınıflandırıcısı önündeki standart ön işlemedir.</div></div>
<div class="calc-card"><div class="card-title">EEG / nöbet algılama</div><div class="card-body">Nöbetlerin karakteristik zaman-frekans imzaları vardır (belirli frekans bantlarında ritmik etkinliğin ani başlaması). Skalogramlar hem klasik hem derin öğrenme nöbet algılayıcıları için standart bir girdi özelliğidir.</div></div>
<div class="calc-card"><div class="card-title">Kütle çekim dalgaları (LIGO)</div><div class="card-body">Bir ikili kara delik birleşmesi bir cıvıltı sinyali üretir: içe sarmal evresinin frekansı yükselen bir frekansa sahiptir. Q-dönüşümü (wavelet dönüşümünün bir varyantı), GW150914 ilk doğrudan algılama dâhil olmak üzere LIGO algılamaları için standart görselleştirmedir.</div></div>
</div>

<h2 class="l-title">11. (Kısaca) Wavelet Scattering Ağları</h2>

<p class="l-text">2012'de Stephane Mallat <strong>wavelet scattering dönüşümünü</strong> tanıttı: öğrenilmiş filtreler yerine <em>sabit</em> wavelet filtreleri kullanan derin bir evrişimli ağ. Mimari, modülüs doğrusal olmayanlıkları ve ortalamalarla wavelet ayrışımlarını ardışık olarak uygular ve kanıtlanabilir şekilde <em>öteleme değişmez</em> ve <em>küçük deformasyonlar altında kararlı</em> özellikler üretir — öğrenilmiş CNN'lerin yalnızca yaklaşık olarak sağladığı özellikler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mimari taslağı</div><div class="card-body">Katman 1: pek çok wavelet <code>\\lambda_1</code> için <code>|x \\star \\psi_{\\lambda_1}|</code>. Katman 2: <code>||x \\star \\psi_{\\lambda_1}| \\star \\psi_{\\lambda_2}|</code>. Her çıktıyı bir alçak geçiren filtreyle ortala ve scattering katsayılarını al. Birçok görev için iki ya da üç katman yeterlidir.</div></div>
<div class="calc-card"><div class="card-title">Kanıtlanabilir garantiler</div><div class="card-body">Öğrenilmiş CNN'lerin aksine, scattering özellikleri katı sınırlarla gelir: diffeomorfizmler altında kararlılık (küçük mekânsal bükülmeler özellikleri çok değiştirmez), enerji korunumu ve yakınsama teoremleri.</div></div>
<div class="calc-card"><div class="card-title">Bugün durduğu yer</div><div class="card-body">Birkaç yıl boyunca (2013-2017) scattering ağları, küçük veri kümelerinde CNN'lere ciddi bir alternatifti — MNIST, ses sınıflandırma, kuantum kimyası. Uçtan uca öğrenilmiş temsiller sonunda çoğu kıyaslamada bunları geçti. Bugün scattering, çok az verinizin olduğu veya katı garantilere ihtiyaç duyduğunuz zaman hâlâ kullanılan niş bir araçtır.</div></div>
</div>

<div class="l-note"><strong>Modern YZ'de wavelet'ler hakkında dürüst değerlendirme:</strong> Transformer'lar wavelet kullanmaz. CNN'ler wavelet kullanmaz (filtreleri öğrenilmiştir). Modern konuşma modelleri (Whisper, wavelet 2.0) skalogramlar değil mel-spektrogramlar (STFT tabanlı) kullanır. Wavelet'lerin bugün gerçekten önemli olduğu yerler: (1) tıbbi/sinema hatlarında JPEG2000, (2) ML öncesinde biyomedikal sinyal ön işleme, (3) zaman serilerinde anomali algılama, (4) bazı uç dağıtım makalelerinde ağırlıkların veya etkinleştirmelerin sıkıştırılması, (5) küçük veri kümelerinde scattering güçlü bir referans olarak. "YZ için evrensel özellik olarak wavelet'ler" büyük vizyonu gerçekleşmedi. Abartmayın.</div>

<h2 class="l-title">12. Pratik Pyodide Alıştırması</h2>

<p class="l-text">Uçtan uca bir wavelet gürültü temizliği hesaplayalım. Haar DWT'yi elimizle uygulayacağız (gerçekten o kadar basit) ve ardından Fourier alanında bir alçak geçiren filtrenin yok edeceği keskin özelliklere sahip bir sinyali temizlemek için onu kullanacağız.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># --- Haar DWT: piramit algoritması 8 satırda --------------------</span>

<span class="kw">def</span> <span class="fn">haar_dwt</span>(x, levels):
    <span class="str">"""İleri Haar DWT. (son yaklaşıklık, [ayrıntı bantları]) döndürür."""</span>
    a = x.<span class="fn">astype</span>(float).<span class="fn">copy</span>()
    details = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(levels):
        even, odd = a[<span class="num">0</span>::<span class="num">2</span>], a[<span class="num">1</span>::<span class="num">2</span>]
        a = (even + odd) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        d = (even - odd) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        details.<span class="fn">append</span>(d)
    <span class="kw">return</span> a, details

<span class="kw">def</span> <span class="fn">haar_idwt</span>(a, details):
    <span class="str">"""Ters Haar DWT — piramidi geri al."""</span>
    <span class="kw">for</span> d <span class="kw">in</span> <span class="fn">reversed</span>(details):
        x = np.<span class="fn">empty</span>(<span class="num">2</span> * <span class="fn">len</span>(a))
        x[<span class="num">0</span>::<span class="num">2</span>] = (a + d) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        x[<span class="num">1</span>::<span class="num">2</span>] = (a - d) / np.<span class="fn">sqrt</span>(<span class="num">2</span>)
        a = x
    <span class="kw">return</span> a

<span class="cm"># --- Test sinyali kur: pürüzsüz + iki keskin geçici olay ---------</span>
np.random.<span class="fn">seed</span>(<span class="num">7</span>)
N = <span class="num">1024</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">8</span>, N)
clean = np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * t / <span class="num">3</span>) + <span class="num">0.5</span> * np.<span class="fn">sin</span>(<span class="num">2</span> * np.pi * t)
clean[(t &gt; <span class="num">3.0</span>) &amp; (t &lt; <span class="num">3.05</span>)] += <span class="num">2.5</span>       <span class="cm"># yukarı sivri uç</span>
clean[(t &gt; <span class="num">5.5</span>) &amp; (t &lt; <span class="num">5.55</span>)] -= <span class="num">1.8</span>      <span class="cm"># aşağı sivri uç</span>
noise = <span class="num">0.45</span> * np.random.<span class="fn">randn</span>(N)
noisy = clean + noise

<span class="cm"># --- İleri DWT ---------------------------------------------------</span>
levels = <span class="num">6</span>
approx, details = <span class="fn">haar_dwt</span>(noisy, levels)

<span class="cm"># --- En ince banttan gürültü sigma tahmini -----------------------</span>
<span class="cm"># Sağlam MAD tahmincisi (Donoho 1995): sigma = MAD / 0.6745</span>
sigma_hat = np.<span class="fn">median</span>(np.<span class="fn">abs</span>(details[<span class="num">0</span>])) / <span class="num">0.6745</span>
T = sigma_hat * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.<span class="fn">log</span>(N))
<span class="fn">print</span>(<span class="str">f"Tahmini sigma = {sigma_hat:.4f}    evrensel T = {T:.4f}"</span>)

<span class="cm"># --- Yumuşak eşikleme --------------------------------------------</span>
<span class="kw">def</span> <span class="fn">soft</span>(d, T):
    <span class="kw">return</span> np.<span class="fn">sign</span>(d) * np.<span class="fn">maximum</span>(np.<span class="fn">abs</span>(d) - T, <span class="num">0</span>)

denoised_details = [<span class="fn">soft</span>(d, T) <span class="kw">for</span> d <span class="kw">in</span> details]

<span class="cm"># --- Ters DWT ----------------------------------------------------</span>
denoised = <span class="fn">haar_idwt</span>(approx, denoised_details)

mse_noisy = np.<span class="fn">mean</span>((noisy - clean) ** <span class="num">2</span>)
mse_denoised = np.<span class="fn">mean</span>((denoised - clean) ** <span class="num">2</span>)
<span class="fn">print</span>(<span class="str">f"MSE gürültülü    = {mse_noisy:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"MSE temizlenmiş  = {mse_denoised:.4f}    (%{100*(1-mse_denoised/mse_noisy):.1f} azalma)"</span>)

<span class="cm"># --- Çiz ----------------------------------------------------------</span>
fig, ax = plt.<span class="fn">subplots</span>(<span class="num">3</span>, <span class="num">1</span>, figsize=(<span class="num">10</span>, <span class="num">6</span>), sharex=<span class="kw">True</span>)
ax[<span class="num">0</span>].<span class="fn">plot</span>(t, clean, color=<span class="str">"#3b82f6"</span>); ax[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Temiz sinyal (gerçek)"</span>)
ax[<span class="num">1</span>].<span class="fn">plot</span>(t, noisy, color=<span class="str">"#ef4444"</span>); ax[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Gürültülü girdi"</span>)
ax[<span class="num">2</span>].<span class="fn">plot</span>(t, denoised, color=<span class="str">"#10b981"</span>); ax[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"Wavelet ile temizlenmiş (Haar, yumuşak eşik)"</span>)
<span class="kw">for</span> a <span class="kw">in</span> ax: a.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">tight_layout</span>(); plt.<span class="fn">show</span>()</code></pre></div>

<div class="l-note"><strong>Bu kodu aşağıdaki lab'ta çalıştırın.</strong> Kabaca yüzde 60-80 MSE azalması görmelisiniz. Pürüzsüz sinüsoid arka plan güzelce temizlenir VE iki dar sivri uç hayatta kalır. Pyodide derlemenizde varsa <code>pywt</code> ile Haar yerine daha uzun bir Daubechies wavelet'i deneyin; pürüzsüz kısımlar daha da iyi görünecek ama sivri uçları korumak için daha çok kaybolan momente ihtiyacınız olacak. Karşılaştırma için bir Fourier alanı alçak geçiren filtre deneyin — sivri uçları tümseklere bulayacak.</div>

<div class="calc-example"><div class="example-label">DENENECEK UZANTILAR</div><div class="example-body"><strong>(1)</strong> Gürültüyü Gauss olmayan (Student-t veya Laplace) gürültüyle değiştirin. Evrensel eşik şaşırtıcı derecede iyi çalışmaya devam eder.<br><strong>(2)</strong> PyWavelets varsa <code>pywt.wavedec(noisy, "db4", level=6)</code> kullanın. Haar'a göre keskin özelliklerde yeniden yapım kalitesini karşılaştırın.<br><strong>(3)</strong> Yumuşak eşiklemeyi sert eşiklemeyle değiştirin. Hayatta kalan büyük katsayıların tam büyüklükte korunduğuna dikkat edin — daha keskin ama daha "kıvrımlı" yeniden yapım.<br><strong>(4)</strong> Gürültülü bir görüntüye 2B Haar DWT (satırlar sonra sütunlar) kurun ve temizleyin. Yaklaşık 40 satır kod ile çalışan bir wavelet görüntü temizleyiciniz olacak.</div></div>

<h2 class="l-title">Özet</h2>

<p class="l-text">Fourier bir sinyalde hangi frekansların bulunduğunu söyler ama ne zaman olduğunu söylemez. STFT, sabit genişlikte bir pencereyi kaydırarak sorunun bir kısmını çözer ama tek tip zaman-frekans döşemesi farklı sürelerdeki olaylara uyum sağlayamaz. <strong>Wavelet'ler bunu</strong> yüksek frekanslar için dar pencereler ve düşük frekanslar için geniş pencereler kullanarak düzeltir; zaman-frekans düzleminin dyadic bir döşemesini verir; Heisenberg'e saygı duyarken yerel sinyal yapısına zarif biçimde uyum sağlar. Sürekli Wavelet Dönüşümü <code>W_f(a, b)</code>, bir ana wavelet <code>\\psi</code>'nin ölçeklenmiş ve ötelenmiş kopyaları üzerine izdüşürür; ayrık sürüm dyadic ölçekler kullanır ve Mallat'ın piramit algoritmasıyla <code>O(N)</code>'de çalışır — FFT'den hızlı. Üç aile baskındır: Haar (en basit), Morlet (zaman-frekans analizi için en iyi), Daubechies (JPEG2000 ve sinyal işlemenin iş atı). Uygulamalar arasında JPEG2000 görüntü sıkıştırma, Donoho-Johnstone evrensel eşikleme ile sinyal gürültüden temizleme ve biyomedikal ile sismik sinyallerin zaman-frekans görselleştirmesi vardır. Modern YZ'de wavelet'ler niş ama değerli bir araçtır: biyomedikal sinyaller üzerinde ML öncesinde standart bir ön işleme adımı, scattering ağları üzerinden küçük veri kümelerinde güçlü bir referans ve JPEG2000'in temeli — ancak Transformer'larda veya modern öğrenilmiş CNN'lerde kullanılmazlar. Elinizle kodladığınız Haar DWT ve beş satırlık bir gürültü temizleme döngüsüyle artık sinyal işlemenin en çok atıf alan sonuçlarından birini araç çantanızda taşıyorsunuz.</p>
`
};
