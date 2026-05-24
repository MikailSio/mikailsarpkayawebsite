window.FOURIER_L5 = {

en: `<p class="l-text"><strong>Computers cannot integrate.</strong> They can only add and multiply finite lists of numbers. Yet every audio file you have ever listened to, every spectrogram inside Whisper, every frequency-domain convolution in a long-context language model, every Fourier feature inside a neural radiance field — all of these rely on a single algorithm that takes the continuous Fourier Transform of the previous lesson and reshapes it into something a CPU can actually compute. That algorithm is the <strong>Discrete Fourier Transform (DFT)</strong>, and the trick that made it fast enough to change the world is the <strong>Fast Fourier Transform (FFT)</strong>.</p>

<p class="l-text">Gilbert Strang once called FFT "the most important algorithm of our generation." The naïve DFT costs <code>O(N^2)</code> operations; the FFT brings it down to <code>O(N \\log N)</code>. For a one-second audio clip at <code>48\\,000</code> Hz the speed-up is roughly <code>3{,}000{\\times}</code>. For an hour of 4K video frames it is a factor of millions. Without the FFT, modern signal processing — and therefore the entire deep-learning audio stack — would not be computationally feasible.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the Nyquist-Shannon sampling theorem and recognise aliasing in undersampled signals</li>
<li>Compute a DFT by hand for small N and interpret each output bin as an amplitude at frequency k*f_s/N</li>
<li>Derive Cooley-Tukey's divide-and-conquer recursion and explain why FFT runs in O(N log N)</li>
<li>Diagnose spectral leakage and apply Hann, Hamming, or Blackman windows to mitigate it</li>
<li>Build a spectrogram (STFT) and recognise it as the front end of Whisper and Wav2Vec</li>
<li>Connect Fourier features in NeRF, SIREN, and positional encodings to the same DFT machinery</li>
</ul>
</div>

<h2 class="l-title">1. From Continuous to Discrete</h2>

<p class="l-text">The integrals of Lesson 4 are mathematical idealizations. A computer storing an audio signal only has access to a finite list of samples: <code>x[0], x[1], x[2], \\ldots, x[N-1]</code>, taken at a uniform spacing <code>T_s</code> seconds apart. The <strong>sampling rate</strong> <code>f_s = 1/T_s</code> measures how many samples per second your converter captured. Studio audio is sampled at <code>44.1</code> or <code>48</code> kHz; mobile telephony at <code>8</code> kHz; modern speech models often resample to <code>16</code> kHz.</p>

<p class="l-text">The first question that ever arises is: <em>does this finite, sampled stream lose information about the original continuous signal?</em> The answer is the most famous theorem of signal processing.</p>

<div class="calc-formula"><div class="formula-label">NYQUIST-SHANNON SAMPLING THEOREM</div><div class="formula-main">$$f_s \\;\\ge\\; 2\\, f_{\\max}$$</div><div class="formula-sub">If your signal contains no frequencies above f_max Hz, sampling at rate f_s = 2 f_max or higher preserves it exactly — the continuous signal can be reconstructed perfectly from its samples.</div></div>

<p class="l-text">The intuition is geometric. Sampling at rate <code>f_s</code> is mathematically equivalent to multiplying the continuous signal by a Dirac comb of period <code>T_s</code>. In the frequency domain this convolves the spectrum with another comb of spacing <code>f_s</code>. The original spectrum is therefore <em>copied</em> at every multiple of <code>f_s</code>. If the spectrum was contained in <code>[-f_s/2,\\, f_s/2]</code>, the copies stay separate and we can recover the original by filtering out everything above <code>f_s/2</code>. If not — the copies overlap, and the high-frequency content of the original sneaks into low frequencies as <strong>aliasing</strong>.</p>

<div id="plot-aliasing-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var tc=[];var sc=[];for(var i=0;i<=600;i++){var x=i/100;tc.push(x);sc.push(Math.sin(2*Math.PI*5*x));}
var ts=[];var ss=[];for(var k=0;k<=42;k++){var x=k/7;ts.push(x);ss.push(Math.sin(2*Math.PI*5*x));}
var ta=[];var sa=[];for(var j=0;j<=600;j++){var x=j/100;ta.push(x);sa.push(Math.sin(2*Math.PI*2*x));}
var tr1={x:tc,y:sc,mode:"lines",name:"true 5 Hz signal",line:{color:"#3b82f6",width:2}};
var tr2={x:ts,y:ss,mode:"markers",name:"samples at f_s = 7 Hz",marker:{color:"#ef4444",size:9}};
var tr3={x:ta,y:sa,mode:"lines",name:"aliased reconstruction (-2 Hz)",line:{color:"#f59e0b",width:2,dash:"dash"}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"time (s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[0,6]},yaxis:{title:"amplitude",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-1.5,1.5]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-aliasing-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">A 5 Hz sinusoid (blue) sampled at <code>f_s = 7</code> Hz (red dots) — below the Nyquist rate of <code>10</code> Hz. The samples are equally consistent with a much lower frequency, the aliased 2 Hz reconstruction (orange dashed). Information about the true frequency has been lost; the samples alone cannot tell us which curve generated them.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Audio CD</div><div class="card-body">Sampling rate <code>44.1</code> kHz, designed to capture frequencies up to <code>22.05</code> kHz — slightly above the upper limit of human hearing. Anything sharper than that needs an analog low-pass filter <em>before</em> the ADC, otherwise it aliases into the audible band.</div></div>
<div class="calc-card"><div class="card-title">Whisper input</div><div class="card-body">OpenAI's Whisper expects audio at <code>16</code> kHz, which preserves frequencies up to <code>8</code> kHz — well above the spectral content of human speech (which is dominantly below <code>4</code> kHz). Higher rates would waste FLOPs.</div></div>
<div class="calc-card"><div class="card-title">Anti-aliasing filter</div><div class="card-body">Every real ADC includes a sharp analog low-pass filter that kills content above <code>f_s/2</code> before sampling. Without it, ultrasonic interference (or even radio pickup on the wiring) would alias into audible artifacts.</div></div>
<div class="calc-card"><div class="card-title">Image aliasing</div><div class="card-body">2D version: undersampled images of a striped shirt or a brick wall show Moiré patterns. Modern cameras and graphics renderers use anti-aliasing (gaussian pre-blur or supersampling) to satisfy the 2D Nyquist criterion.</div></div>
</div>

<div class="l-note"><strong>Numerical anchor:</strong> If you sample a pure <code>5</code> kHz tone at <code>f_s = 8</code> kHz (Nyquist <code>= 4</code> kHz, so we are above the limit), the tone aliases to <code>|5 - 8| = 3</code> kHz. You will literally hear it as a different note. This is why the analog anti-alias filter is non-negotiable in every audio interface.</div>

<h2 class="l-title">2. The DFT Definition</h2>

<p class="l-text">Once we accept a finite list of samples <code>x[0], x[1], \\ldots, x[N-1]</code> we need a discrete counterpart of the continuous Fourier integral. The integral becomes a sum, the continuous frequency variable becomes a discrete index, and the complex exponential becomes a finite set of N-th roots of unity. The result is the Discrete Fourier Transform:</p>

<div class="calc-formula"><div class="formula-label">DISCRETE FOURIER TRANSFORM (DFT)</div><div class="formula-main">$$X[k] \\;=\\; \\sum_{n=0}^{N-1} x[n]\\, e^{-i\\, 2\\pi k n / N}, \\qquad k = 0, 1, \\ldots, N-1$$</div><div class="formula-sub">Length-N input x[n] to length-N output X[k]. Both are arrays of complex numbers in general.</div></div>

<div class="calc-formula"><div class="formula-label">INVERSE DFT (IDFT)</div><div class="formula-main">$$x[n] \\;=\\; \\frac{1}{N}\\sum_{k=0}^{N-1} X[k]\\, e^{+i\\, 2\\pi k n / N}, \\qquad n = 0, 1, \\ldots, N-1$$</div><div class="formula-sub">Identical structure with opposite sign on the exponent and a 1/N normalization in front. Forward followed by inverse recovers x exactly.</div></div>

<p class="l-text">Three observations are worth burning into memory before we go further:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Square transformation</div><div class="card-body">N samples in, N coefficients out. The DFT is a linear map from <code>\\mathbb{C}^N</code> to <code>\\mathbb{C}^N</code> represented by an <code>N \\times N</code> matrix <code>W</code> whose entry at position <code>(k, n)</code> is <code>e^{-i 2\\pi k n / N}</code>. Multiplying by this matrix <em>is</em> the DFT.</div></div>
<div class="calc-card"><div class="card-title">Same complex exponentials</div><div class="card-body">The kernel <code>e^{-i 2\\pi k n / N}</code> is exactly the continuous <code>e^{-i\\omega t}</code> evaluated at the discrete frequencies <code>\\omega_k = 2\\pi k / N</code> and the discrete times <code>t_n = n</code>. The DFT really is a sampled version of the CFT.</div></div>
<div class="calc-card"><div class="card-title">Periodic by construction</div><div class="card-body">Since <code>e^{-i 2\\pi (k+N) n / N} = e^{-i 2\\pi k n / N}</code>, the indices <code>k</code> and <code>n</code> are interpreted modulo <code>N</code>. The DFT treats the finite list <code>x[n]</code> as one period of an infinite periodic signal — a fact that returns to bite us in section 7 as spectral leakage.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: N = 4 BY HAND</div><div class="example-body">Take <code>x = [1, 2, 3, 4]</code> with <code>N = 4</code>. The twiddle factor is <code>W = e^{-i 2\\pi / 4} = -i</code>. Compute each output:<br><br>
<code>X[0] = 1 + 2 + 3 + 4 = 10</code><br>
<code>X[1] = 1 + 2(-i) + 3(-1) + 4(i) = (1 - 3) + (-2 + 4)i = -2 + 2i</code><br>
<code>X[2] = 1 + 2(-1) + 3(1) + 4(-1) = -2</code><br>
<code>X[3] = 1 + 2(i) + 3(-1) + 4(-i) = -2 - 2i</code><br><br>
So <code>X = [10, -2+2i, -2, -2-2i]</code>. Notice <code>X[3] = \\overline{X[1]}</code> — the complex conjugate symmetry that always holds for real input (we revisit this in section 8). Notice also that <code>X[0]</code> is the sum, the so-called <strong>DC component</strong> measuring the signal's mean.</div></div>

<h2 class="l-title">3. Interpreting DFT Output</h2>

<p class="l-text">An array of complex numbers <code>X[k]</code> is not yet useful — we need to know what each index <code>k</code> physically represents. The DFT computes the amplitude and phase of the discrete sinusoid that completes exactly <code>k</code> cycles across the <code>N</code>-sample window:</p>

<div class="calc-formula"><div class="formula-label">FREQUENCY OF BIN k</div><div class="formula-main">$$f_k \\;=\\; \\frac{k}{N}\\, f_s, \\qquad k = 0, 1, \\ldots, N-1$$</div><div class="formula-sub">Bin spacing Delta f = f_s / N. Smaller bins require either a longer window (larger N) or a lower sample rate.</div></div>

<p class="l-text">For <code>N = 1024</code> samples at <code>f_s = 48\\,000</code> Hz the bin spacing is about <code>46.9</code> Hz — fine enough to resolve adjacent musical notes around middle C. The amplitude of frequency <code>f_k</code> in the input is <code>|X[k]| / N</code> (the <code>1/N</code> is just the normalization convention), and its phase is <code>\\arg X[k]</code>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DC bin (k = 0)</div><div class="card-body"><code>X[0] = \\sum_n x[n]</code> is the sum of the samples, proportional to the signal's mean. A non-zero <code>X[0]</code> means your signal has a DC offset — useful to spot and remove before any frequency analysis.</div></div>
<div class="calc-card"><div class="card-title">Nyquist bin (k = N/2)</div><div class="card-body">The highest unambiguous frequency, <code>f_{N/2} = f_s/2</code>, lives in bin <code>N/2</code>. For real input this bin is always real-valued and represents the alternating signal <code>+1, -1, +1, -1, \\ldots</code></div></div>
<div class="calc-card"><div class="card-title">Negative frequencies wrap</div><div class="card-body">By periodicity, <code>X[N - k] = \\overline{X[k]}</code> for real input. The "upper half" of the array (bins <code>N/2 + 1</code> through <code>N - 1</code>) corresponds to <em>negative</em> frequencies. NumPy's <code>fftshift</code> reorders the array so DC sits in the middle and negative frequencies appear on the left.</div></div>
<div class="calc-card"><div class="card-title">Resolution vs locality</div><div class="card-body">Larger <code>N</code> gives finer frequency resolution but worse time localization (the analysis covers a longer window). This is the discrete echo of the uncertainty principle from Lesson 4.</div></div>
</div>

<div class="calc-example"><div class="example-label">CHECK: PURE SINUSOID</div><div class="example-body">Take <code>x[n] = \\cos(2\\pi \\cdot 100\\, n / f_s)</code> with <code>f_s = 1000</code> Hz and <code>N = 100</code>. The signal completes exactly <code>10</code> cycles in the window, so all energy lands in <code>X[10]</code> (and its conjugate mate <code>X[90]</code>). Every other bin is zero. The two non-zero bins each have magnitude <code>N/2 = 50</code>: half the energy goes to the positive frequency, half to the negative. Total recovered amplitude <code>2 \\cdot 50 / N = 1.0</code> — exactly the cosine's amplitude.</div></div>

<h2 class="l-title">4. The Cost: O(N²) Naïve</h2>

<p class="l-text">Look back at the DFT definition. Computing one output <code>X[k]</code> requires <code>N</code> complex multiplications and <code>N - 1</code> complex additions. Producing all <code>N</code> outputs therefore costs roughly</p>

<div class="calc-formula"><div class="formula-label">DIRECT DFT COST</div><div class="formula-main">$$\\text{ops}_{\\text{direct}} \\;\\approx\\; N \\cdot N \\;=\\; N^2 \\quad \\text{complex multiply-adds}$$</div><div class="formula-sub">Equivalently 4 N^2 real multiplications (each complex multiply is 4 real multiplies).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N = 1024</div><div class="card-body">A modest audio frame. Direct DFT: roughly <code>10^6</code> multiply-adds. Modern CPUs do this in milliseconds — still tolerable.</div></div>
<div class="calc-card"><div class="card-title">N = 65{,}536 (64K)</div><div class="card-body">A common transform size for long FFT windows. Direct: <code>4.3 \\times 10^9</code> multiply-adds. Already seconds per transform on a single core. Painful in real-time audio.</div></div>
<div class="calc-card"><div class="card-title">N = 1{,}048{,}576 (1M)</div><div class="card-body">Large-context language models, scientific simulations. Direct: <code>10^{12}</code> multiply-adds. Hours per transform — utterly infeasible.</div></div>
<div class="calc-card"><div class="card-title">The wall</div><div class="card-body"><code>N^2</code> growth means doubling N quadruples the cost. The naïve DFT hits a hard wall at <code>N \\approx 10^5</code>. We need a sub-quadratic algorithm or whole problem classes become unsolvable.</div></div>
</div>

<div class="think-box"><div class="think-label">A SECOND LOOK AT THE MATRIX</div><div class="think-body">The direct DFT computes the matrix-vector product <code>X = W x</code> where <code>W_{k, n} = e^{-i 2\\pi k n / N}</code>. A general matrix-vector product on a dense <code>N \\times N</code> matrix costs <code>O(N^2)</code>. The miracle of the FFT is that <code>W</code> is <em>not</em> a generic matrix — it has a recursive block structure that allows the multiplication to be factored, reducing the cost dramatically. The math is the same, but the structure unlocks an exponential speed-up.</div></div>

<h2 class="l-title">5. Cooley-Tukey FFT — The Divide-and-Conquer Insight</h2>

<p class="l-text">In 1965 James Cooley and John Tukey published the modern Fast Fourier Transform — though Gauss had discovered essentially the same algorithm by hand in 1805 for orbital calculations. The idea is so clean it can fit on a napkin. Assume <code>N</code> is even and split the input by parity:</p>

<div class="calc-formula"><div class="formula-label">SPLIT INTO EVEN AND ODD INDICES</div><div class="formula-main">$$X[k] = \\sum_{m=0}^{N/2-1} x[2m]\\, e^{-i\\, 2\\pi k (2m)/N} \\;+\\; \\sum_{m=0}^{N/2-1} x[2m+1]\\, e^{-i\\, 2\\pi k (2m+1)/N}$$</div><div class="formula-sub">Two sums of length N/2: one over even-indexed samples, one over odd.</div></div>

<p class="l-text">In the second sum factor out <code>e^{-i 2\\pi k / N}</code>, which is independent of <code>m</code>. In both sums note that <code>e^{-i 2\\pi k (2m)/N} = e^{-i 2\\pi k m / (N/2)}</code>. The result is</p>

<div class="calc-formula"><div class="formula-label">FFT RECURSION</div><div class="formula-main">$$X[k] \\;=\\; E[k] \\;+\\; W_N^{\\,k}\\, O[k], \\qquad W_N \\;=\\; e^{-i\\, 2\\pi / N}$$</div><div class="formula-sub">E[k] and O[k] are the DFTs of length N/2 over the even and odd subsequences respectively. W_N is called the twiddle factor.</div></div>

<p class="l-text">This buys us only half the outputs (<code>k = 0, \\ldots, N/2 - 1</code>). For the upper half we use the periodicity <code>E[k + N/2] = E[k]</code>, <code>O[k + N/2] = O[k]</code>, and the symmetry <code>W_N^{k + N/2} = -W_N^k</code> to write</p>

<div class="calc-formula"><div class="formula-label">UPPER HALF FROM LOWER HALF</div><div class="formula-main">$$X[k + N/2] \\;=\\; E[k] \\;-\\; W_N^{\\,k}\\, O[k]$$</div><div class="formula-sub">Same E[k] and O[k] — no recomputation. The minus sign is the famous "butterfly" pattern.</div></div>

<p class="l-text">So a length-<code>N</code> DFT reduces to two length-<code>N/2</code> DFTs plus <code>N</code> butterfly combinations (two complex multiplies plus two complex adds per output pair). The cost satisfies</p>

<div class="calc-formula"><div class="formula-label">FFT COMPLEXITY RECURSION</div><div class="formula-main">$$T(N) \\;=\\; 2\\, T(N/2) \\;+\\; O(N)$$</div><div class="formula-sub">By the master theorem this solves to T(N) = O(N log N).</div></div>

<div id="plot-butterfly-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=8;
var labels=["x[0]","x[4]","x[2]","x[6]","x[1]","x[5]","x[3]","x[7]"];
var outs=["X[0]","X[1]","X[2]","X[3]","X[4]","X[5]","X[6]","X[7]"];
var xinL=0.05;var xs1=0.30;var xs2=0.55;var xs3=0.80;
var yIn=[];for(var i=0;i<N;i++){yIn.push(N-1-i);}
var inX=[];var inY=[];var inT=[];for(var i=0;i<N;i++){inX.push(xinL);inY.push(yIn[i]);inT.push(labels[i]);}
var trIn={x:inX,y:inY,mode:"markers+text",text:inT,textposition:"left",marker:{color:"#3b82f6",size:14},showlegend:false,textfont:{size:13,color:"#3b82f6"}};
var s1X=[];var s1Y=[];var s1T=[];for(var i=0;i<N;i++){s1X.push(xs1);s1Y.push(yIn[i]);}
var trS1={x:s1X,y:s1Y,mode:"markers",marker:{color:"#10b981",size:10},showlegend:false};
var s2X=[];var s2Y=[];for(var i=0;i<N;i++){s2X.push(xs2);s2Y.push(yIn[i]);}
var trS2={x:s2X,y:s2Y,mode:"markers",marker:{color:"#10b981",size:10},showlegend:false};
var s3X=[];var s3Y=[];var s3T=[];for(var i=0;i<N;i++){s3X.push(xs3);s3Y.push(yIn[i]);s3T.push(outs[i]);}
var trS3={x:s3X,y:s3Y,mode:"markers+text",text:s3T,textposition:"right",marker:{color:"#f59e0b",size:14},showlegend:false,textfont:{size:13,color:"#f59e0b"}};
var shapes=[];
function lineSeg(x0,y0,x1,y1,c){shapes.push({type:"line",x0:x0,y0:y0,x1:x1,y1:y1,line:{color:c,width:1.5}});}
for(var i=0;i<N;i+=2){lineSeg(xinL,yIn[i],xs1,yIn[i],"#3b82f6");lineSeg(xinL,yIn[i+1],xs1,yIn[i+1],"#3b82f6");lineSeg(xinL,yIn[i],xs1,yIn[i+1],"#94a3b8");lineSeg(xinL,yIn[i+1],xs1,yIn[i],"#94a3b8");}
for(var i=0;i<N;i+=4){for(var j=0;j<2;j++){lineSeg(xs1,yIn[i+j],xs2,yIn[i+j],"#10b981");lineSeg(xs1,yIn[i+j+2],xs2,yIn[i+j+2],"#10b981");lineSeg(xs1,yIn[i+j],xs2,yIn[i+j+2],"#94a3b8");lineSeg(xs1,yIn[i+j+2],xs2,yIn[i+j],"#94a3b8");}}
for(var i=0;i<4;i++){lineSeg(xs2,yIn[i],xs3,yIn[i],"#10b981");lineSeg(xs2,yIn[i+4],xs3,yIn[i+4],"#10b981");lineSeg(xs2,yIn[i],xs3,yIn[i+4],"#94a3b8");lineSeg(xs2,yIn[i+4],xs3,yIn[i],"#94a3b8");}
var annotations=[
{x:(xinL+xs1)/2,y:N+0.2,text:"Stage 1: 2-point",showarrow:false,font:{color:"#94a3b8",size:11}},
{x:(xs1+xs2)/2,y:N+0.2,text:"Stage 2: 4-point",showarrow:false,font:{color:"#94a3b8",size:11}},
{x:(xs2+xs3)/2,y:N+0.2,text:"Stage 3: 8-point",showarrow:false,font:{color:"#94a3b8",size:11}}
];
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{range:[-0.05,1.05],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-1,N+1],showgrid:false,zeroline:false,showticklabels:false},shapes:shapes,annotations:annotations,showlegend:false,margin:{t:40,b:20,l:30,r:30}};
Plotly.newPlot("plot-butterfly-en",[trIn,trS1,trS2,trS3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">The radix-2 FFT butterfly diagram for <code>N = 8</code>. Input samples on the left are in <strong>bit-reversed order</strong>. Three stages of butterflies (log<sub>2</sub> 8 = 3) combine pairs, then quadruples, then the full octuple. Each stage performs <code>N/2</code> butterflies — total work per stage is <code>O(N)</code>, total work across all <code>\\log_2 N</code> stages is <code>O(N \\log N)</code>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: TRACE FFT FOR N = 4</div><div class="example-body">Reuse <code>x = [1, 2, 3, 4]</code>. Even-indexed: <code>[1, 3]</code>; odd-indexed: <code>[2, 4]</code>.<br><br>
Length-2 DFT of even: <code>E[0] = 1 + 3 = 4</code>, <code>E[1] = 1 - 3 = -2</code>.<br>
Length-2 DFT of odd:  <code>O[0] = 2 + 4 = 6</code>, <code>O[1] = 2 - 4 = -2</code>.<br><br>
Twiddle <code>W_4 = e^{-i\\pi/2} = -i</code>. Apply the butterflies:<br>
<code>X[0] = E[0] + W_4^0 O[0] = 4 + 6 = 10</code><br>
<code>X[1] = E[1] + W_4^1 O[1] = -2 + (-i)(-2) = -2 + 2i</code><br>
<code>X[2] = E[0] - W_4^0 O[0] = 4 - 6 = -2</code><br>
<code>X[3] = E[1] - W_4^1 O[1] = -2 - 2i</code><br><br>
Exactly the same result as the direct DFT in section 2, but obtained with two length-2 DFTs (3 ops each) plus 4 butterflies. The factor is small at <code>N = 4</code>, enormous at <code>N = 10^6</code>.</div></div>

<div id="plot-cost-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nv=[];var direct=[];var fft=[];
for(var p=4;p<=20;p++){var n=Math.pow(2,p);Nv.push(n);direct.push(n*n);fft.push(5*n*Math.log2(n));}
var tr1={x:Nv,y:direct,mode:"lines+markers",name:"O(N^2) direct DFT",line:{color:"#ef4444",width:2.5},marker:{size:7}};
var tr2={x:Nv,y:fft,mode:"lines+markers",name:"O(N log N) FFT",line:{color:"#3b82f6",width:2.5},marker:{size:7}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"N (transform length)",type:"log",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"operations",type:"log",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:70,r:30}};
Plotly.newPlot("plot-cost-en",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Operation count on a log-log plot for <code>N</code> from <code>16</code> to <code>10^6</code>. The two curves diverge dramatically: at <code>N = 10^6</code> the direct DFT costs roughly <code>10^{12}</code> operations, the FFT only <code>10^8</code> — a <code>10{,}000{\\times}</code> speed-up. This single algorithmic insight is what made signal processing computationally tractable.</div></div>

<h2 class="l-title">6. Twiddle Factors</h2>

<p class="l-text">The numbers <code>W_N^k = e^{-i 2\\pi k / N}</code> appearing in every butterfly are called <strong>twiddle factors</strong>. They are the <code>N</code>-th roots of unity, equally spaced around the unit circle in the complex plane. In a production FFT they are computed once and stored in a table — every butterfly is then a table lookup plus one complex multiply and one complex add.</p>

<div class="calc-formula"><div class="formula-label">SYMMETRY OF THE TWIDDLE</div><div class="formula-main">$$W_N^{\\,k + N/2} \\;=\\; e^{-i\\, 2\\pi (k + N/2)/N} \\;=\\; e^{-i\\, 2\\pi k / N}\\, e^{-i\\pi} \\;=\\; -\\, W_N^{\\,k}$$</div><div class="formula-sub">Two opposite points on the unit circle differ only by a sign. This single fact lets us compute upper-half outputs for free.</div></div>

<div class="calc-formula"><div class="formula-label">PERIODICITY</div><div class="formula-main">$$W_N^{\\,k+N} \\;=\\; W_N^{\\,k}, \\qquad W_N^{\\,k}\\, W_N^{\\,j} \\;=\\; W_N^{\\,k+j}$$</div><div class="formula-sub">All multiplications are angle additions on the unit circle. The recursion exploits this group structure relentlessly.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Memory layout</div><div class="card-body">For a length-<code>2^p</code> FFT only <code>N/2</code> distinct twiddles are needed. They are typically stored as a single precomputed <code>complex64</code> array. Modern libraries (FFTW, MKL, cuFFT) tune the layout for SIMD vector instructions.</div></div>
<div class="calc-card"><div class="card-title">Real arithmetic</div><div class="card-body">Each complex multiply is 4 real multiplies and 2 real adds; each complex add is 2 real adds. The leading-order FLOP count of a radix-2 FFT is therefore <code>5 N \\log_2 N</code> real ops — the constant the plot in section 5 used.</div></div>
<div class="calc-card"><div class="card-title">Higher radices</div><div class="card-body">Radix-4 and radix-8 variants combine several radix-2 stages and save a few multiplications. The famous "split-radix" algorithm achieves <code>4 N \\log_2 N</code> ops — the asymptotic record for power-of-two sizes.</div></div>
<div class="calc-card"><div class="card-title">Non-power-of-two N</div><div class="card-body">When <code>N</code> is not a power of two, libraries fall back to mixed-radix (Bluestein, Rader, prime-factor) variants. Pure prime <code>N</code> uses Bluestein's chirp z-transform trick, which is itself an FFT.</div></div>
</div>

<h2 class="l-title">7. Practical Numerics: When FFT Goes Wrong</h2>

<p class="l-text">The DFT treats your <code>N</code>-sample window as one period of an infinite periodic signal. If the actual signal you fed in is not periodic in that window — for example, a sinusoid whose frequency does not exactly hit a bin — the implicit periodic extension has a jump discontinuity at the window boundary. The DFT, being mathematically exact, reports the spectrum of <em>that</em> signal, including the broad smear of frequencies needed to reproduce the jump. This artifact is called <strong>spectral leakage</strong>.</p>

<div class="calc-formula"><div class="formula-label">MITIGATION: WINDOWING</div><div class="formula-main">$$x_{\\text{win}}[n] \\;=\\; w[n]\\, x[n], \\qquad w[n] = \\text{Hann, Hamming, Blackman, } \\ldots$$</div><div class="formula-sub">Multiply the time-domain signal by a smooth window that tapers to zero at both endpoints. The DFT now sees a periodic-looking signal with no jump.</div></div>

<p class="l-text">The cost of windowing is a slightly wider main lobe (worse resolution between closely spaced tones) in exchange for dramatically lower side lobes (cleaner spectrum away from each tone). Common choices and their trade-offs:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rectangular (no window)</div><div class="card-body">Narrowest main lobe, awful side lobes (only <code>-13</code> dB). Use only when the signal really is periodic in your window (e.g., a synthesized test tone at an integer multiple of <code>f_s/N</code>).</div></div>
<div class="calc-card"><div class="card-title">Hann</div><div class="card-body"><code>w[n] = 0.5 (1 - \\cos(2\\pi n/(N-1)))</code>. Smooth taper, <code>-31</code> dB side lobes. The default in <code>scipy.signal.spectrogram</code> and most STFT pipelines.</div></div>
<div class="calc-card"><div class="card-title">Hamming</div><div class="card-body">Slight variant of Hann with non-zero endpoints. Marginally better near-in side lobes (<code>-43</code> dB), worse far-out ones. Historical favorite in speech.</div></div>
<div class="calc-card"><div class="card-title">Blackman</div><div class="card-body">Adds a third cosine term. Side lobes down to <code>-58</code> dB at the cost of an even wider main lobe. Use when you need to detect a weak tone next to a strong one.</div></div>
</div>

<div id="plot-leakage-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=128;var f=10.5;var x=[];for(var n=0;n<N;n++){x.push(Math.cos(2*Math.PI*f*n/N));}
var hann=[];for(var n=0;n<N;n++){hann.push(0.5*(1-Math.cos(2*Math.PI*n/(N-1))));}
function dft(arr){var out=[];for(var k=0;k<N;k++){var re=0,im=0;for(var n=0;n<N;n++){var ang=-2*Math.PI*k*n/N;re+=arr[n]*Math.cos(ang);im+=arr[n]*Math.sin(ang);}out.push(Math.sqrt(re*re+im*im));}return out;}
var Xrect=dft(x);var Xwin=dft(x.map(function(v,i){return v*hann[i];}));
var bins=[];var Xr=[];var Xw=[];for(var k=0;k<N/2;k++){bins.push(k);Xr.push(20*Math.log10(Math.max(Xrect[k],1e-6)));Xw.push(20*Math.log10(Math.max(Xwin[k],1e-6)));}
var tr1={x:bins,y:Xr,mode:"lines",name:"rectangular (no window)",line:{color:"#ef4444",width:2}};
var tr2={x:bins,y:Xw,mode:"lines",name:"Hann window",line:{color:"#3b82f6",width:2}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"frequency bin k",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[0,40]},yaxis:{title:"magnitude (dB)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-60,50]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-leakage-en",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">A pure cosine at frequency <code>10.5</code> bins (not on an integer bin). With no window (red) energy leaks across many bins. With a Hann window (blue) the main lobe widens slightly but side lobes drop by <code>20</code>+ dB — the spectrum looks clean. This is why every real spectrogram applies a window.</div></div>

<div class="l-note"><strong>Engineer's rule:</strong> Use Hann by default. Switch to Blackman if you must detect a weak tone next to a strong one. Use rectangular only for synthetic tones designed to land exactly on a bin (which never happens for natural signals).</div>

<h2 class="l-title">8. The Real FFT (RFFT)</h2>

<p class="l-text">For real-valued input — which covers audio, sensor data, images, and basically every physical measurement — the DFT output is constrained by Hermitian symmetry:</p>

<div class="calc-formula"><div class="formula-label">HERMITIAN SYMMETRY OF DFT FOR REAL INPUT</div><div class="formula-main">$$X[N - k] \\;=\\; \\overline{X[k]}, \\qquad k = 1, 2, \\ldots, N/2 - 1$$</div><div class="formula-sub">Upper half is the conjugate of the lower half. Only N/2 + 1 outputs carry independent information.</div></div>

<p class="l-text">The <strong>Real FFT</strong> exploits this redundancy: it skips computing the upper half entirely. The function <code>np.fft.rfft</code> for real input of length <code>N</code> returns an array of length <code>N/2 + 1</code> at roughly half the cost of <code>np.fft.fft</code>. Always prefer it when your input is real — which is almost always.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Memory savings</div><div class="card-body">For <code>N = 4096</code> the full FFT output is <code>4096</code> complex numbers (<code>32</code> KB at <code>float32</code>). The rfft output is <code>2049</code> complex numbers (<code>16</code> KB). Halved memory for downstream processing.</div></div>
<div class="calc-card"><div class="card-title">Inverse</div><div class="card-body"><code>np.fft.irfft</code> takes <code>N/2 + 1</code> complex bins and returns <code>N</code> real samples. The size argument is mandatory because the length of the original signal cannot be inferred uniquely from the rfft output.</div></div>
<div class="calc-card"><div class="card-title">Energy interpretation</div><div class="card-body">Each rfft bin from <code>1</code> to <code>N/2 - 1</code> represents <em>two</em> conjugate frequencies in the full spectrum. To compute total energy from the rfft, double the contribution of those interior bins (but not bin <code>0</code> or bin <code>N/2</code>).</div></div>
<div class="calc-card"><div class="card-title">When you must use full FFT</div><div class="card-body">If your signal is genuinely complex-valued (e.g., I/Q baseband data from a software-defined radio, or filtered analytic signals) the Hermitian symmetry does not hold and you need the full <code>fft</code>.</div></div>
</div>

<h2 class="l-title">9. AI Application 1: Spectrograms for Speech</h2>

<p class="l-text">Now we reach one of the biggest reasons modern AI cares about the DFT. Speech and music are non-stationary: their frequency content changes from millisecond to millisecond. A single global DFT averages everything together and loses time information. The standard fix is the <strong>Short-Time Fourier Transform (STFT)</strong>: slice the signal into overlapping short frames, window each frame, FFT each frame, and stack the magnitudes into a 2D image. The result is a <strong>spectrogram</strong> — the canonical input representation for every modern speech model.</p>

<div class="calc-formula"><div class="formula-label">SHORT-TIME FOURIER TRANSFORM</div><div class="formula-main">$$X[m, k] \\;=\\; \\sum_{n=0}^{L-1} w[n]\\, x[m H + n]\\, e^{-i\\, 2\\pi k n / L}$$</div><div class="formula-sub">L = window length, H = hop size (typically L/4 for 75% overlap), m indexes frame, k indexes frequency bin.</div></div>

<p class="l-text">For Whisper the pipeline is, end to end:</p>

<div class="calc-formula"><div class="formula-label">WHISPER FRONT-END (LITERAL)</div><div class="formula-main">$$\\text{audio}_{16\\text{kHz}} \\xrightarrow{\\text{frame, } L=400, H=160} \\text{STFT with Hann} \\xrightarrow{|\\cdot|^2} \\text{power} \\xrightarrow{\\text{mel filterbank, 80 bins}} \\text{log mel}$$</div><div class="formula-sub">The output is an 80-channel time-frequency image at 100 frames/second, which is what the Transformer encoder actually receives.</div></div>

<p class="l-text">The <strong>mel scale</strong> is a perceptually motivated nonlinear frequency warp that places more bins at low frequencies where the ear is most discriminating. The <strong>log</strong> compression converts ratios into differences, matching the logarithmic loudness perception. None of this changes the underlying DFT — every cell in the mel spectrogram is a (positive, weighted, log-compressed) function of the original FFT magnitudes. The entire input "modality" of Whisper, Wav2Vec, HuBERT, EnCodec, MusicGen, and Bark is exactly this output.</p>

<div id="plot-spectrogram-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var fs=8000;var T=2;var Ntot=fs*T;
var x=[];for(var n=0;n<Ntot;n++){var t=n/fs;var f=200+(1500-200)*(t/T);x.push(Math.sin(2*Math.PI*f*t*0.5+2*Math.PI*200*t));}
var L=256;var H=64;var Nf=Math.floor((Ntot-L)/H);
var hann=[];for(var i=0;i<L;i++){hann.push(0.5*(1-Math.cos(2*Math.PI*i/(L-1))));}
var Z=[];for(var m=0;m<Nf;m++){var frame=[];for(var i=0;i<L;i++){frame.push(x[m*H+i]*hann[i]);}var mag=[];for(var k=0;k<L/2;k++){var re=0,im=0;for(var n=0;n<L;n++){var ang=-2*Math.PI*k*n/L;re+=frame[n]*Math.cos(ang);im+=frame[n]*Math.sin(ang);}mag.push(20*Math.log10(Math.sqrt(re*re+im*im)+1e-6));}Z.push(mag);}
var Zt=[];for(var k=0;k<L/2;k++){var row=[];for(var m=0;m<Nf;m++){row.push(Z[m][k]);}Zt.push(row);}
var times=[];for(var m=0;m<Nf;m++){times.push(m*H/fs);}
var freqs=[];for(var k=0;k<L/2;k++){freqs.push(k*fs/L);}
var tr={z:Zt,x:times,y:freqs,type:"heatmap",colorscale:"Viridis",showscale:true,colorbar:{title:"dB",titlefont:{color:"#e8e8e8"},tickfont:{color:"#e8e8e8"}}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"time (s)",gridcolor:"rgba(255,255,255,0.06)"},yaxis:{title:"frequency (Hz)",gridcolor:"rgba(255,255,255,0.06)",range:[0,2500]},margin:{t:30,b:50,l:70,r:30}};
Plotly.newPlot("plot-spectrogram-en",[tr],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Spectrogram of a chirp signal (frequency sweeping linearly from <code>200</code> Hz to <code>1500</code> Hz over 2 seconds). The diagonal yellow stripe is the instantaneous frequency over time. Every pixel is the magnitude of one DFT bin in one frame. This is exactly the shape of input that Whisper's encoder consumes (with an additional mel projection and log compression).</div></div>

<div class="think-box"><div class="think-label">WHY THIS PIPELINE IS UNCONTESTED</div><div class="think-body">Researchers have tried for decades to replace mel spectrograms with raw waveforms (WaveNet, SincNet, RawNet). The best raw-audio models match but rarely beat the spectrogram pipeline on standard benchmarks, while costing 10-50x more compute. The mel-FFT representation is so well matched to both human perception and to convolutional/attention inductive biases that it remains the universal speech front end as of 2026. Every percentage point on LibriSpeech WER, every Whisper checkpoint, every text-to-speech voice clone — they all start with a DFT.</div></div>

<h2 class="l-title">10. AI Application 2: Positional Encoding and Fourier Features</h2>

<p class="l-text">A second, less obvious place where the discrete Fourier basis appears in modern AI is positional encoding. Vaswani et al.'s 2017 Transformer encoded token positions as sinusoids at exponentially spaced frequencies:</p>

<div class="calc-formula"><div class="formula-label">TRANSFORMER POSITIONAL ENCODING</div><div class="formula-main">$$\\text{PE}(p, 2i) \\;=\\; \\sin\\!\\left(\\frac{p}{10000^{2i/d}}\\right), \\quad \\text{PE}(p, 2i+1) \\;=\\; \\cos\\!\\left(\\frac{p}{10000^{2i/d}}\\right)$$</div><div class="formula-sub">p = token position, i = dimension index, d = embedding size. A Fourier basis with d/2 pairs of frequencies.</div></div>

<p class="l-text">This is literally a Fourier basis truncated to <code>d/2</code> frequency pairs. The genius is that it lets the model encode relative positions as linear combinations: <code>\\sin(p + k) = \\sin p \\cos k + \\cos p \\sin k</code>. Attention heads can learn rotation-by-<code>k</code> matrices that implement "look <code>k</code> tokens back" without ever being told the absolute position.</p>

<p class="l-text">A more dramatic example comes from <strong>NeRF</strong> (Mildenhall et al., 2020). A vanilla MLP that takes a 3D coordinate <code>(x, y, z)</code> and predicts color/density learns only low-frequency content: rendered images come out blurry. Map the input through a Fourier feature embedding first:</p>

<div class="calc-formula"><div class="formula-label">FOURIER FEATURE EMBEDDING (NeRF)</div><div class="formula-main">$$\\gamma(x) \\;=\\; \\bigl[\\sin(2^0 \\pi x),\\, \\cos(2^0 \\pi x),\\, \\sin(2^1 \\pi x),\\, \\cos(2^1 \\pi x),\\, \\ldots,\\, \\sin(2^{L-1}\\pi x),\\, \\cos(2^{L-1}\\pi x)\\bigr]$$</div><div class="formula-sub">Each input coordinate becomes a 2L-vector of sinusoids at geometrically growing frequencies. The MLP now sees a Fourier basis instead of a raw scalar.</div></div>

<p class="l-text">The result is dramatic: the same MLP architecture goes from blurry to photorealistic. Tancik et al. (2020, "Fourier Features Let Networks Learn High Frequency Functions in Low Dimensional Domains") prove the reason via Neural Tangent Kernel theory: the eigenvalues of the NTK for an MLP fall off rapidly, biasing it toward low-frequency learning. Fourier features amplify high frequencies in the input, counteracting this bias.</p>

<div id="plot-fourier-features-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];var y=[];for(var i=0;i<=500;i++){var u=i/500;x.push(u);y.push(Math.sin(2*Math.PI*8*u)+0.5*Math.sin(2*Math.PI*32*u));}
var yPlain=[];for(var i=0;i<=500;i++){var u=i/500;yPlain.push(Math.sin(2*Math.PI*8*u)*0.4+0.2*Math.sin(2*Math.PI*2*u));}
var yFF=[];for(var i=0;i<=500;i++){var u=i/500;yFF.push(0.98*Math.sin(2*Math.PI*8*u)+0.48*Math.sin(2*Math.PI*32*u));}
var tr1={x:x,y:y,mode:"lines",name:"target signal",line:{color:"#94a3b8",width:2,dash:"dot"}};
var tr2={x:x,y:yPlain,mode:"lines",name:"MLP without Fourier features",line:{color:"#ef4444",width:2}};
var tr3={x:x,y:yFF,mode:"lines",name:"MLP with Fourier features",line:{color:"#3b82f6",width:2}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"input coordinate x",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"f(x)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-fourier-features-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Stylized fit of a high-frequency target (gray dotted) by two identical MLPs. Without Fourier features the network captures only the slow envelope and misses the fast oscillations (red). With Fourier feature embedding of the input (blue) the same network reproduces both scales. This single trick is why NeRF, SIREN, instant-NGP, and modern positional encodings all work.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NeRF</div><div class="card-body">Volumetric scene representation. Input: <code>(x, y, z, \\theta, \\phi)</code>. Without Fourier features: blurry, geometry hallucinated. With <code>L = 10</code> frequencies: photorealistic reconstructions from 50 input images.</div></div>
<div class="calc-card"><div class="card-title">SIREN</div><div class="card-body">Sitzmann et al., 2020. Uses <code>\\sin</code> activations <em>throughout</em> the network (not just at the input). Equivalent to interleaving Fourier features at every layer. Achieves state-of-the-art on implicit representations of images, audio, and PDE solutions.</div></div>
<div class="calc-card"><div class="card-title">RoPE</div><div class="card-body">Rotary Position Embedding (Su et al., 2021). Used in Llama, GPT-NeoX, PaLM. Instead of adding sinusoidal position to embeddings, <em>rotates</em> the query/key vectors at frequencies <code>10000^{-2i/d}</code>. Same Fourier basis, now applied multiplicatively inside attention.</div></div>
<div class="calc-card"><div class="card-title">Instant-NGP</div><div class="card-body">Müller et al., 2022. Combines Fourier-like multi-resolution hash encodings with a small MLP. Trains NeRF in seconds instead of hours. The hash grid replaces explicit Fourier bins but plays the same role: high-frequency input lift.</div></div>
</div>

<h2 class="l-title">11. AI Application 3: FFT-based Convolution</h2>

<p class="l-text">The third deep AI connection comes straight from the convolution theorem of Lesson 4. Direct convolution of a signal of length <code>N</code> with a kernel of length <code>K</code> costs <code>O(N K)</code>. FFT-based convolution costs <code>O((N+K) \\log(N+K))</code>. When both <code>N</code> and <code>K</code> are large, the FFT wins by orders of magnitude.</p>

<div class="calc-formula"><div class="formula-label">FFT CONVOLUTION RECIPE</div><div class="formula-main">$$y \\;=\\; x * h \\quad\\longleftrightarrow\\quad y \\;=\\; \\mathcal{F}^{-1}\\bigl(\\,\\mathcal{F}(x_{\\text{pad}}) \\cdot \\mathcal{F}(h_{\\text{pad}})\\,\\bigr)$$</div><div class="formula-sub">Zero-pad both inputs to length N+K-1 to avoid circular wraparound, then three FFTs (forward, forward, inverse) and one pointwise multiply.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to use it</div><div class="card-body">Rule of thumb: FFT convolution beats direct when the kernel has more than <code>\\sim 30</code> elements. For audio reverbs (kernels of <code>10^5</code>+ samples) it is roughly <code>1000{\\times}</code> faster. Every commercial convolution reverb uses it.</div></div>
<div class="calc-card"><div class="card-title">Long convolutions in LLMs</div><div class="card-body">Models in the Hyena / H3 / S4 family replace attention with long convolutions parameterized in the frequency domain. Sequence length up to <code>1M</code> tokens becomes feasible because the convolution is done via FFT, not the <code>O(L^2)</code> attention matrix.</div></div>
<div class="calc-card"><div class="card-title">Large-kernel CNNs</div><div class="card-body">RepLKNet (Ding et al., 2022), SLaK (Liu et al., 2022). Show that <code>31 \\times 31</code> kernels rival Transformers on ImageNet. Training these is only practical with FFT convolution and clever depthwise factorizations.</div></div>
<div class="calc-card"><div class="card-title">Diffusion samplers</div><div class="card-body">Many fast diffusion solvers (DPM-Solver, DEIS) rely on spectral methods for the score field. FFT-based operators on the latent grid keep step time low even at high resolution.</div></div>
</div>

<div class="calc-example"><div class="example-label">CONCRETE: AUDIO REVERB CONVOLUTION</div><div class="example-body">Convolve a <code>30</code>-second song (<code>N = 1.44 \\times 10^6</code> samples at <code>48</code> kHz) with a <code>3</code>-second impulse response of a concert hall (<code>K = 1.44 \\times 10^5</code>).<br><br>
Direct: <code>N \\cdot K \\approx 2 \\times 10^{11}</code> multiply-adds — about <code>30</code> seconds on a single CPU core.<br>
FFT: <code>5(N+K) \\log_2(N+K) \\approx 1.2 \\times 10^8</code> ops — about <code>20</code> ms on the same core.<br><br>
That is a <code>1500{\\times}</code> speed-up. Every convolution reverb plugin you have ever used relies on this. The math is exactly the Lesson 4 convolution theorem, computed via the FFT of Lesson 5.</div></div>

<h2 class="l-title">12. Practical Pyodide Exercise</h2>

<p class="l-text">Time to compute some FFTs. We synthesize a mixture of three sinusoids plus white noise, FFT it, and identify the peaks. Then we compute the spectrogram of a linear chirp and visualize the diagonal frequency sweep.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># --- Synthesize a multi-tone test signal ------------------------</span>
fs = <span class="num">1000</span>                 <span class="cm"># sample rate, Hz</span>
T = <span class="num">2.0</span>                  <span class="cm"># duration, s</span>
N = <span class="fn">int</span>(fs * T)            <span class="cm"># 2000 samples</span>
t = np.arange(N) / fs

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = (<span class="num">1.0</span>*np.sin(<span class="num">2</span>*np.pi*<span class="num">50</span>*t)
   + <span class="num">0.5</span>*np.sin(<span class="num">2</span>*np.pi*<span class="num">120</span>*t)
   + <span class="num">0.3</span>*np.sin(<span class="num">2</span>*np.pi*<span class="num">240</span>*t)
   + <span class="num">0.2</span>*rng.<span class="fn">standard_normal</span>(N))

<span class="cm"># --- Real FFT (we have real input) ------------------------------</span>
X = np.fft.<span class="fn">rfft</span>(x)
freqs = np.fft.<span class="fn">rfftfreq</span>(N, <span class="num">1</span>/fs)
mag = np.<span class="fn">abs</span>(X) * <span class="num">2</span> / N    <span class="cm"># amplitude scaling</span>

<span class="cm"># --- Pick the three loudest peaks -------------------------------</span>
top = np.<span class="fn">argsort</span>(mag)[-<span class="num">3</span>:][::-<span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"Top 3 spectral peaks:"</span>)
<span class="kw">for</span> k <span class="kw">in</span> top:
    <span class="fn">print</span>(<span class="str">f"  f = {freqs[k]:7.1f} Hz   amplitude = {mag[k]:.3f}"</span>)

<span class="cm"># --- Now apply a Hann window and see leakage clean up -----------</span>
hann = np.<span class="fn">hanning</span>(N)
X_win = np.fft.<span class="fn">rfft</span>(x * hann)
mag_win = np.<span class="fn">abs</span>(X_win) * <span class="num">2</span> / np.<span class="fn">sum</span>(hann)

<span class="cm"># --- Verify O(N log N) timing for FFT vs O(N^2) direct ----------</span>
<span class="kw">import</span> time

<span class="kw">def</span> <span class="fn">direct_dft</span>(x):
    N = <span class="fn">len</span>(x)
    n = np.<span class="fn">arange</span>(N)
    k = n.<span class="fn">reshape</span>((N, <span class="num">1</span>))
    W = np.exp(-<span class="num">1j</span> * <span class="num">2</span> * np.pi * k * n / N)
    <span class="kw">return</span> W @ x

<span class="kw">for</span> Nt <span class="kw">in</span> [<span class="num">256</span>, <span class="num">1024</span>, <span class="num">4096</span>]:
    z = rng.<span class="fn">standard_normal</span>(Nt)
    t0 = time.<span class="fn">perf_counter</span>()
    Zd = <span class="fn">direct_dft</span>(z)
    td = time.<span class="fn">perf_counter</span>() - t0
    t0 = time.<span class="fn">perf_counter</span>()
    Zf = np.fft.<span class="fn">fft</span>(z)
    tf = time.<span class="fn">perf_counter</span>() - t0
    err = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(Zd - Zf))
    <span class="fn">print</span>(<span class="str">f"N={Nt:5d}  direct={td*1000:7.2f} ms   FFT={tf*1000:6.2f} ms   speedup={td/tf:6.1f}x   max err={err:.2e}"</span>)

<span class="cm"># --- Spectrogram of a chirp -------------------------------------</span>
fs2 = <span class="num">2000</span>
T2 = <span class="num">2.0</span>
N2 = <span class="fn">int</span>(fs2 * T2)
t2 = np.<span class="fn">arange</span>(N2) / fs2
<span class="cm"># Instantaneous frequency sweeps linearly 100 -&gt; 800 Hz</span>
phase = <span class="num">2</span>*np.pi * (<span class="num">100</span>*t2 + (<span class="num">800</span>-<span class="num">100</span>)/(<span class="num">2</span>*T2)*t2**<span class="num">2</span>)
chirp = np.sin(phase)

L = <span class="num">256</span>
H = <span class="num">64</span>
hann = np.<span class="fn">hanning</span>(L)
nframes = (N2 - L) // H + <span class="num">1</span>
S = np.<span class="fn">empty</span>((L//<span class="num">2</span> + <span class="num">1</span>, nframes))
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(nframes):
    frame = chirp[m*H : m*H + L] * hann
    S[:, m] = np.<span class="fn">abs</span>(np.fft.<span class="fn">rfft</span>(frame))

S_db = <span class="num">20</span> * np.<span class="fn">log10</span>(S + <span class="num">1e-6</span>)
<span class="fn">print</span>(<span class="str">f"\\nSpectrogram shape: {S.shape}  (freq bins x frames)"</span>)
<span class="fn">print</span>(<span class="str">f"Peak frequency in first frame:  {np.argmax(S[:, 0])  * fs2/L:6.1f} Hz"</span>)
<span class="fn">print</span>(<span class="str">f"Peak frequency in middle frame: {np.argmax(S[:, nframes//2]) * fs2/L:6.1f} Hz"</span>)
<span class="fn">print</span>(<span class="str">f"Peak frequency in last frame:   {np.argmax(S[:, -1]) * fs2/L:6.1f} Hz"</span>)</code></pre></div>

<div class="l-note"><strong>Run this code</strong> in the lab below. You should see (1) the three planted peaks at <code>50</code>, <code>120</code>, and <code>240</code> Hz recovered to within a fraction of a percent; (2) the FFT becoming dramatically faster than the direct DFT as <code>N</code> grows, with the speed-up reaching <code>100{\\times}</code>+ by <code>N = 4096</code>; (3) the chirp's instantaneous frequency walking from <code>100</code> Hz at the start to <code>800</code> Hz at the end — exactly as designed.</div>

<div class="calc-example"><div class="example-label">EXTENSIONS TO TRY</div><div class="example-body"><strong>(1)</strong> Replace <code>np.hanning(N)</code> with <code>np.blackman(N)</code> and observe the spectrum get cleaner at the cost of slightly wider peaks.<br><strong>(2)</strong> Add an aliased component: <code>1.0 * np.sin(2*np.pi*900*t)</code> on top of the existing mix. Since <code>900</code> Hz is well above <code>f_s/2 = 500</code> Hz, NumPy still computes its DFT but the energy lands at the aliased frequency <code>|900 - 1000| = 100</code> Hz. Verify this.<br><strong>(3)</strong> Compute a 1D Fourier feature embedding <code>\\gamma(x) = [\\sin(2^i \\pi x), \\cos(2^i \\pi x)]_{i=0}^{L-1}</code> with <code>L = 6</code> and visualize how it maps a single scalar input into a 12-dimensional vector. This is exactly the embedding that NeRF uses on each input coordinate.</div></div>

<h2 class="l-title">Summary</h2>

<p class="l-text">The Discrete Fourier Transform replaces the continuous Fourier integral with a finite sum: <code>X[k] = \\sum_n x[n] e^{-i 2\\pi k n/N}</code>. Sampling at rate <code>f_s \\ge 2 f_{\\max}</code> guarantees no information is lost (Nyquist-Shannon); otherwise aliasing folds high frequencies into low ones. Each DFT bin <code>k</code> represents the discrete frequency <code>f_k = k f_s / N</code>. The naïve DFT costs <code>O(N^2)</code>, but Cooley-Tukey's divide-and-conquer recursion <code>T(N) = 2 T(N/2) + O(N)</code> reduces it to <code>O(N \\log N)</code> — a speed-up that ranges from <code>3000{\\times}</code> at <code>N = 10^4</code> to <code>10\\,000{\\times}</code> at <code>N = 10^6</code>. Windowing (Hann, Hamming, Blackman) mitigates spectral leakage from non-periodic signals; the real FFT exploits Hermitian symmetry to halve the work for real input. The DFT/FFT machinery is not academic: it powers Whisper's mel spectrogram front-end, NeRF's Fourier feature embeddings, transformer positional encodings (sinusoidal and RoPE), long-convolution language models (Hyena, H3, S4), and every FFT-based convolution in scientific and large-kernel CNN workloads. In Lesson 6 we close the loop with distributional Fourier theory and the Dirac comb that makes the sampling theorem rigorous.</p>
`,

tr: `<p class="l-text"><strong>Bilgisayarlar integral alamaz.</strong> Yalnızca sonlu sayı listelerini toplayıp çarpabilirler. Yine de hayatınızda dinlediğiniz her ses dosyası, Whisper'ın içindeki her spektrogram, uzun-bağlamlı bir dil modelinin her frekans-alanı evrişimi, bir sinir radyans alanının (NeRF) içindeki her Fourier özelliği — bunların hepsi, önceki dersin sürekli Fourier Dönüşümünü alıp CPU'nun gerçekten hesaplayabileceği bir şeye dönüştüren tek bir algoritmaya dayanır. Bu algoritma <strong>Ayrık Fourier Dönüşümüdür (DFT)</strong>, ve onu dünyayı değiştirecek kadar hızlı kılan numara da <strong>Hızlı Fourier Dönüşümüdür (FFT)</strong>.</p>

<p class="l-text">Gilbert Strang bir keresinde FFT için "neslimizin en önemli algoritması" demişti. Naif DFT <code>O(N^2)</code> işleme mal olur; FFT bunu <code>O(N \\log N)</code>'e indirir. <code>48\\,000</code> Hz'de bir saniyelik bir ses parçası için hızlanma yaklaşık <code>3000{\\times}</code>. Bir saatlik 4K video kareleri için milyonlarca kat. FFT olmasaydı modern sinyal işleme — dolayısıyla tüm derin öğrenme ses yığını — hesaplama açısından mümkün olmazdı.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Nyquist-Shannon örnekleme teoremini ifade etmek ve eksik örneklenmiş sinyallerdeki örtüşmeyi (aliasing) tanımak</li>
<li>Küçük N için elle DFT hesaplamak ve her çıkış bin'ini k*f_s/N frekansındaki bir genlik olarak yorumlamak</li>
<li>Cooley-Tukey'in böl-ve-yönet özyinelemesini türetmek ve FFT'nin neden O(N log N)'de çalıştığını açıklamak</li>
<li>Spektral sızıntıyı teşhis etmek ve Hann, Hamming veya Blackman pencereleri ile azaltmak</li>
<li>Bir spektrogram (STFT) oluşturmak ve onun Whisper ile Wav2Vec'in ön ucu olduğunu fark etmek</li>
<li>NeRF, SIREN ve konum kodlamalarındaki Fourier özelliklerini aynı DFT mekanizmasına bağlamak</li>
</ul>
</div>

<h2 class="l-title">1. Sürekliden Ayrığa</h2>

<p class="l-text">Ders 4'teki integraller matematiksel idealizasyonlardır. Bir bilgisayar bir ses sinyalini saklarken yalnızca sonlu bir örnek listesine erişebilir: <code>x[0], x[1], x[2], \\ldots, x[N-1]</code>, birbirinden <code>T_s</code> saniye aralıkla alınmış. <strong>Örnekleme oranı</strong> <code>f_s = 1/T_s</code>, çeviricinizin saniyede kaç örnek aldığını ölçer. Stüdyo sesi <code>44.1</code> veya <code>48</code> kHz'de örneklenir; mobil telefonculuk <code>8</code> kHz'de; modern konuşma modelleri sıklıkla <code>16</code> kHz'e yeniden örnekler.</p>

<p class="l-text">Sorulan ilk soru şudur: <em>bu sonlu, örneklenmiş akış orijinal sürekli sinyal hakkında bilgi kaybeder mi?</em> Cevap, sinyal işlemenin en ünlü teoremidir.</p>

<div class="calc-formula"><div class="formula-label">NYQUIST-SHANNON ÖRNEKLEME TEOREMİ</div><div class="formula-main">$$f_s \\;\\ge\\; 2\\, f_{\\max}$$</div><div class="formula-sub">Sinyaliniz f_max Hz üzerinde frekans içermiyorsa, f_s = 2 f_max veya daha yüksek oranda örnekleme onu tam olarak korur — sürekli sinyal örneklerinden kusursuzca yeniden inşa edilebilir.</div></div>

<p class="l-text">Sezgi geometriktir. <code>f_s</code> oranında örneklemek matematiksel olarak sürekli sinyali <code>T_s</code> periyotlu bir Dirac tarağıyla çarpmaya eşdeğerdir. Frekans alanında bu, spektrumu <code>f_s</code> aralıklı başka bir tarakla evirir. Orijinal spektrum böylece <code>f_s</code>'nin her katında <em>kopyalanır</em>. Spektrum <code>[-f_s/2,\\, f_s/2]</code> içinde tutulmuşsa, kopyalar ayrı kalır ve <code>f_s/2</code> üzerini filtreleyerek orijinali kurtarabiliriz. Değilse — kopyalar üst üste biner, ve orijinalin yüksek frekanslı içeriği düşük frekanslara <strong>aliasing</strong> olarak sızar.</p>

<div id="plot-aliasing-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var tc=[];var sc=[];for(var i=0;i<=600;i++){var x=i/100;tc.push(x);sc.push(Math.sin(2*Math.PI*5*x));}
var ts=[];var ss=[];for(var k=0;k<=42;k++){var x=k/7;ts.push(x);ss.push(Math.sin(2*Math.PI*5*x));}
var ta=[];var sa=[];for(var j=0;j<=600;j++){var x=j/100;ta.push(x);sa.push(Math.sin(2*Math.PI*2*x));}
var tr1={x:tc,y:sc,mode:"lines",name:"gercek 5 Hz sinyal",line:{color:"#3b82f6",width:2}};
var tr2={x:ts,y:ss,mode:"markers",name:"f_s = 7 Hz'de ornekler",marker:{color:"#ef4444",size:9}};
var tr3={x:ta,y:sa,mode:"lines",name:"aliased yeniden insa (-2 Hz)",line:{color:"#f59e0b",width:2,dash:"dash"}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"zaman (s)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[0,6]},yaxis:{title:"genlik",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-1.5,1.5]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-aliasing-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">5 Hz'lik bir sinüsoid (mavi), <code>10</code> Hz Nyquist oranının altındaki <code>f_s = 7</code> Hz'de örnekleniyor (kırmızı noktalar). Örnekler çok daha düşük bir frekansla, 2 Hz aliased yeniden inşayla da (turuncu kesik çizgi) eşit derecede tutarlıdır. Gerçek frekans bilgisi kaybolmuştur; örnekler tek başına onları hangi eğrinin ürettiğini söyleyemez.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Audio CD</div><div class="card-body">Örnekleme oranı <code>44.1</code> kHz, insan işitmesinin üst sınırının biraz üzerindeki <code>22.05</code> kHz'e kadar frekansları yakalamak için tasarlandı. Bundan keskin olan her şey ADC'den <em>önce</em> analog bir alçak-geçiren filtre gerektirir, aksi takdirde duyulur banda alias eder.</div></div>
<div class="calc-card"><div class="card-title">Whisper girdisi</div><div class="card-body">OpenAI'nin Whisper'ı <code>16</code> kHz sesi bekler; bu, <code>8</code> kHz'e kadar frekansları korur — insan konuşmasının (baskın olarak <code>4</code> kHz altında) spektral içeriğinin oldukça üstünde. Daha yüksek oranlar FLOP israfı olurdu.</div></div>
<div class="calc-card"><div class="card-title">Anti-aliasing filtresi</div><div class="card-body">Her gerçek ADC, örneklemeden önce <code>f_s/2</code> üzerindeki içeriği yok eden keskin bir analog alçak-geçiren filtre içerir. Bu olmadan ultrasonik girişim (veya kablolardaki radyo alımı) duyulur sanal arızalara alias olurdu.</div></div>
<div class="calc-card"><div class="card-title">Görüntü aliasing'i</div><div class="card-body">2B sürüm: çizgili bir gömlek veya tuğla duvarın eksik örneklenmiş görüntüleri Moiré desenleri gösterir. Modern kameralar ve grafik renderleyiciler 2B Nyquist kriterini sağlamak için anti-aliasing (gauss ön-bulanıklaştırma veya supersampling) kullanır.</div></div>
</div>

<div class="l-note"><strong>Sayısal çapa:</strong> Saf bir <code>5</code> kHz tonu <code>f_s = 8</code> kHz'de örneklerseniz (Nyquist <code>= 4</code> kHz, yani sınırın üzerindeyiz), ton <code>|5 - 8| = 3</code> kHz'e alias eder. Onu kelimenin tam anlamıyla farklı bir nota olarak duyarsınız. İşte bu yüzden her ses arayüzünde analog anti-alias filtresi pazarlık konusu değildir.</div>

<h2 class="l-title">2. DFT Tanımı</h2>

<p class="l-text"><code>x[0], x[1], \\ldots, x[N-1]</code> sonlu örnek listesini kabul ettiğimizde, sürekli Fourier integralinin ayrık karşılığına ihtiyacımız vardır. İntegral bir toplama, sürekli frekans değişkeni ayrık bir indise ve karmaşık üstel N'nci birim köklerinin sonlu kümesine dönüşür. Sonuç Ayrık Fourier Dönüşümüdür:</p>

<div class="calc-formula"><div class="formula-label">AYRIK FOURIER DÖNÜŞÜMÜ (DFT)</div><div class="formula-main">$$X[k] \\;=\\; \\sum_{n=0}^{N-1} x[n]\\, e^{-i\\, 2\\pi k n / N}, \\qquad k = 0, 1, \\ldots, N-1$$</div><div class="formula-sub">N uzunluğunda girdi x[n], N uzunluğunda çıktı X[k]'ya dönüşür. Her ikisi de genel olarak karmaşık sayı dizileridir.</div></div>

<div class="calc-formula"><div class="formula-label">TERS DFT (IDFT)</div><div class="formula-main">$$x[n] \\;=\\; \\frac{1}{N}\\sum_{k=0}^{N-1} X[k]\\, e^{+i\\, 2\\pi k n / N}, \\qquad n = 0, 1, \\ldots, N-1$$</div><div class="formula-sub">Aynı yapı, üstte ters işaret ve önde 1/N normalizasyonu. İleri ve ters art arda uygulanırsa x tam olarak geri gelir.</div></div>

<p class="l-text">Daha ileri gitmeden hafızaya kazınması gereken üç gözlem var:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kare dönüşüm</div><div class="card-body">N girdi, N katsayı. DFT, <code>(k, n)</code> konumundaki girdisi <code>e^{-i 2\\pi k n / N}</code> olan bir <code>N \\times N</code> matris <code>W</code> ile temsil edilen <code>\\mathbb{C}^N</code>'den <code>\\mathbb{C}^N</code>'e doğrusal bir haritadır. Bu matrisle çarpmak <em>DFT'dir</em>.</div></div>
<div class="calc-card"><div class="card-title">Aynı karmaşık üsteller</div><div class="card-body">Çekirdek <code>e^{-i 2\\pi k n / N}</code>, sürekli <code>e^{-i\\omega t}</code>'nin tam olarak ayrık frekanslar <code>\\omega_k = 2\\pi k / N</code> ve ayrık zamanlar <code>t_n = n</code>'de değerlendirilmiş halidir. DFT gerçekten CFT'nin örneklenmiş bir sürümüdür.</div></div>
<div class="calc-card"><div class="card-title">Yapı gereği periyodik</div><div class="card-body"><code>e^{-i 2\\pi (k+N) n / N} = e^{-i 2\\pi k n / N}</code> olduğu için <code>k</code> ve <code>n</code> indisleri <code>N</code> modunda yorumlanır. DFT, sonlu <code>x[n]</code> listesini sonsuz periyodik bir sinyalin bir periyodu olarak ele alır — bu olgu bizi 7. bölümde spektral sızıntı olarak geri ısıracak.</div></div>
</div>

<div class="calc-example"><div class="example-label">ELLE ÖRNEK: N = 4</div><div class="example-body"><code>x = [1, 2, 3, 4]</code>, <code>N = 4</code> alın. Twiddle çarpanı <code>W = e^{-i 2\\pi / 4} = -i</code>. Her çıkışı hesaplayın:<br><br>
<code>X[0] = 1 + 2 + 3 + 4 = 10</code><br>
<code>X[1] = 1 + 2(-i) + 3(-1) + 4(i) = (1 - 3) + (-2 + 4)i = -2 + 2i</code><br>
<code>X[2] = 1 + 2(-1) + 3(1) + 4(-1) = -2</code><br>
<code>X[3] = 1 + 2(i) + 3(-1) + 4(-i) = -2 - 2i</code><br><br>
Yani <code>X = [10, -2+2i, -2, -2-2i]</code>. Dikkat: <code>X[3] = \\overline{X[1]}</code> — gerçek girdi için her zaman geçerli olan karmaşık eşlenik simetrisi (8. bölümde geri döneceğiz). Ayrıca <code>X[0]</code> toplamdır, sinyalin ortalamasını ölçen <strong>DC bileşeni</strong>.</div></div>

<h2 class="l-title">3. DFT Çıktısının Yorumlanması</h2>

<p class="l-text">Bir karmaşık sayı dizisi <code>X[k]</code> henüz kullanışlı değildir — her <code>k</code> indisinin fiziksel olarak neyi temsil ettiğini bilmeliyiz. DFT, <code>N</code> örneklik pencerede tam olarak <code>k</code> çevrim tamamlayan ayrık sinüsoidin genlik ve fazını hesaplar:</p>

<div class="calc-formula"><div class="formula-label">k BİN'İNİN FREKANSI</div><div class="formula-main">$$f_k \\;=\\; \\frac{k}{N}\\, f_s, \\qquad k = 0, 1, \\ldots, N-1$$</div><div class="formula-sub">Bin aralığı Delta f = f_s / N. Daha küçük bin'ler ya daha uzun pencere (daha büyük N) ya da daha düşük örnekleme oranı gerektirir.</div></div>

<p class="l-text"><code>N = 1024</code> örnek için <code>f_s = 48\\,000</code> Hz'de bin aralığı yaklaşık <code>46.9</code> Hz — orta C civarındaki komşu müzik notalarını ayırt edecek kadar ince. Girdideki <code>f_k</code> frekansının genliği <code>|X[k]| / N</code>'dir (<code>1/N</code> sadece normalizasyon konvansiyonu) ve fazı <code>\\arg X[k]</code>'dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DC bin (k = 0)</div><div class="card-body"><code>X[0] = \\sum_n x[n]</code> örneklerin toplamıdır, sinyalin ortalamasıyla orantılı. Sıfırdan farklı <code>X[0]</code>, sinyalinizin DC ofseti olduğu anlamına gelir — herhangi bir frekans analizinden önce fark edip çıkarmak için yararlı.</div></div>
<div class="calc-card"><div class="card-title">Nyquist bin (k = N/2)</div><div class="card-body">En yüksek belirsizliksiz frekans, <code>f_{N/2} = f_s/2</code>, <code>N/2</code> bin'inde yaşar. Gerçek girdi için bu bin her zaman gerçek değerlidir ve <code>+1, -1, +1, -1, \\ldots</code> alternatif sinyalini temsil eder.</div></div>
<div class="calc-card"><div class="card-title">Negatif frekanslar sarmalanır</div><div class="card-body">Periyodiklikten dolayı, gerçek girdi için <code>X[N - k] = \\overline{X[k]}</code>. Dizinin "üst yarısı" (bin <code>N/2 + 1</code>'den <code>N - 1</code>'e) <em>negatif</em> frekanslara karşılık gelir. NumPy'nin <code>fftshift</code>'i diziyi DC'yi ortaya, negatif frekansları sola koyacak şekilde yeniden sıralar.</div></div>
<div class="calc-card"><div class="card-title">Çözünürlük vs konum</div><div class="card-body">Daha büyük <code>N</code> daha ince frekans çözünürlüğü verir ama zamanda lokalizasyonu kötüleştirir (analiz daha uzun bir pencereyi kapsar). Bu, Ders 4'teki belirsizlik ilkesinin ayrık yankısıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">KONTROL: SAF SİNÜSOID</div><div class="example-body"><code>x[n] = \\cos(2\\pi \\cdot 100\\, n / f_s)</code> alın, <code>f_s = 1000</code> Hz ve <code>N = 100</code> ile. Sinyal pencerede tam olarak <code>10</code> çevrim tamamlar, dolayısıyla tüm enerji <code>X[10]</code>'a (ve eşleniği <code>X[90]</code>'a) iner. Diğer her bin sıfırdır. İki sıfır olmayan bin'in her biri <code>N/2 = 50</code> büyüklüğündedir: enerjinin yarısı pozitif frekansa, yarısı negatif frekansa gider. Toplam kurtarılmış genlik <code>2 \\cdot 50 / N = 1.0</code> — tam olarak kosinüsün genliği.</div></div>

<h2 class="l-title">4. Maliyet: O(N²) Naif</h2>

<p class="l-text">DFT tanımına geri bakın. Bir çıkış <code>X[k]</code>'yı hesaplamak <code>N</code> karmaşık çarpma ve <code>N - 1</code> karmaşık toplama gerektirir. Tüm <code>N</code> çıktıyı üretmek bu yüzden yaklaşık şuna mal olur:</p>

<div class="calc-formula"><div class="formula-label">DOĞRUDAN DFT MALİYETİ</div><div class="formula-main">$$\\text{islem}_{\\text{dogrudan}} \\;\\approx\\; N \\cdot N \\;=\\; N^2 \\quad \\text{karmasik carp-topla}$$</div><div class="formula-sub">Eşdeğer olarak 4 N^2 gerçek çarpma (her karmaşık çarpma 4 gerçek çarpmadır).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N = 1024</div><div class="card-body">Orta boy bir ses çerçevesi. Doğrudan DFT: yaklaşık <code>10^6</code> çarp-topla. Modern CPU'lar bunu milisaniyelerde yapar — hâlâ katlanılabilir.</div></div>
<div class="calc-card"><div class="card-title">N = 65{,}536 (64K)</div><div class="card-body">Uzun FFT pencereleri için yaygın bir dönüşüm boyutu. Doğrudan: <code>4.3 \\times 10^9</code> çarp-topla. Tek bir çekirdekte zaten dönüşüm başına saniyeler. Gerçek-zamanlı seste acı verici.</div></div>
<div class="calc-card"><div class="card-title">N = 1{,}048{,}576 (1M)</div><div class="card-body">Uzun-bağlamlı dil modelleri, bilimsel simülasyonlar. Doğrudan: <code>10^{12}</code> çarp-topla. Dönüşüm başına saatler — tamamen olanaksız.</div></div>
<div class="calc-card"><div class="card-title">Duvar</div><div class="card-body"><code>N^2</code> büyümesi, N'yi iki katına çıkarmanın maliyeti dört katına çıkardığı anlamına gelir. Naif DFT <code>N \\approx 10^5</code>'te sert bir duvara çarpar. Alt-kuadratik bir algoritmaya ihtiyacımız var yoksa bütün problem sınıfları çözülemez hale geliyor.</div></div>
</div>

<div class="think-box"><div class="think-label">MATRİSE İKİNCİ BAKIŞ</div><div class="think-body">Doğrudan DFT, <code>W_{k, n} = e^{-i 2\\pi k n / N}</code> olan matris-vektör çarpımı <code>X = W x</code>'i hesaplar. Yoğun bir <code>N \\times N</code> matris üzerinde genel bir matris-vektör çarpımı <code>O(N^2)</code>'ye mal olur. FFT'nin mucizesi, <code>W</code>'nin <em>genel</em> bir matris olmaması — çarpmanın faktörize edilmesine ve maliyetin dramatik biçimde azaltılmasına olanak tanıyan özyinelemeli bir blok yapısına sahip olmasıdır. Matematik aynı, ancak yapı katsal bir hızlanmanın kilidini açar.</div></div>

<h2 class="l-title">5. Cooley-Tukey FFT — Böl-ve-Yönet Sezgisi</h2>

<p class="l-text">1965'te James Cooley ve John Tukey modern Hızlı Fourier Dönüşümünü yayımladılar — ancak Gauss aslında aynı algoritmayı 1805'te yörünge hesaplamaları için elle keşfetmişti. Fikir bir peçeteye sığacak kadar temizdir. <code>N</code>'nin çift olduğunu varsayın ve girdiyi pariteye göre bölün:</p>

<div class="calc-formula"><div class="formula-label">ÇİFT VE TEK İNDİSLERE BÖLME</div><div class="formula-main">$$X[k] = \\sum_{m=0}^{N/2-1} x[2m]\\, e^{-i\\, 2\\pi k (2m)/N} \\;+\\; \\sum_{m=0}^{N/2-1} x[2m+1]\\, e^{-i\\, 2\\pi k (2m+1)/N}$$</div><div class="formula-sub">N/2 uzunluğunda iki toplam: biri çift indisli örnekler üzerinden, diğeri tek üzerinden.</div></div>

<p class="l-text">İkinci toplamda, <code>m</code>'den bağımsız olan <code>e^{-i 2\\pi k / N}</code>'yi dışarı çekin. Her iki toplamda da <code>e^{-i 2\\pi k (2m)/N} = e^{-i 2\\pi k m / (N/2)}</code> olduğuna dikkat edin. Sonuç şudur:</p>

<div class="calc-formula"><div class="formula-label">FFT ÖZYİNELEMESİ</div><div class="formula-main">$$X[k] \\;=\\; E[k] \\;+\\; W_N^{\\,k}\\, O[k], \\qquad W_N \\;=\\; e^{-i\\, 2\\pi / N}$$</div><div class="formula-sub">E[k] ve O[k], sırasıyla çift ve tek alt dizilerin N/2 uzunluğundaki DFT'leridir. W_N twiddle çarpanı olarak adlandırılır.</div></div>

<p class="l-text">Bu bize çıktıların yalnızca yarısını verir (<code>k = 0, \\ldots, N/2 - 1</code>). Üst yarı için periyodiklik <code>E[k + N/2] = E[k]</code>, <code>O[k + N/2] = O[k]</code> ve simetri <code>W_N^{k + N/2} = -W_N^k</code>'yi kullanarak şöyle yazarız:</p>

<div class="calc-formula"><div class="formula-label">ÜST YARI ALT YARIDAN</div><div class="formula-main">$$X[k + N/2] \\;=\\; E[k] \\;-\\; W_N^{\\,k}\\, O[k]$$</div><div class="formula-sub">Aynı E[k] ve O[k] — yeniden hesaplama yok. Eksi işareti meşhur "kelebek" desenidir.</div></div>

<p class="l-text">Yani <code>N</code> uzunluğunda bir DFT, iki <code>N/2</code> uzunluğunda DFT ile <code>N</code> kelebek birleşimine (çıkış çifti başına iki karmaşık çarpma artı iki karmaşık toplama) indirgenir. Maliyet şunu sağlar:</p>

<div class="calc-formula"><div class="formula-label">FFT KARMAŞIKLIK ÖZYİNELEMESİ</div><div class="formula-main">$$T(N) \\;=\\; 2\\, T(N/2) \\;+\\; O(N)$$</div><div class="formula-sub">Master teoremine göre bu T(N) = O(N log N)'e çözülür.</div></div>

<div id="plot-butterfly-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=8;
var labels=["x[0]","x[4]","x[2]","x[6]","x[1]","x[5]","x[3]","x[7]"];
var outs=["X[0]","X[1]","X[2]","X[3]","X[4]","X[5]","X[6]","X[7]"];
var xinL=0.05;var xs1=0.30;var xs2=0.55;var xs3=0.80;
var yIn=[];for(var i=0;i<N;i++){yIn.push(N-1-i);}
var inX=[];var inY=[];var inT=[];for(var i=0;i<N;i++){inX.push(xinL);inY.push(yIn[i]);inT.push(labels[i]);}
var trIn={x:inX,y:inY,mode:"markers+text",text:inT,textposition:"left",marker:{color:"#3b82f6",size:14},showlegend:false,textfont:{size:13,color:"#3b82f6"}};
var s1X=[];var s1Y=[];for(var i=0;i<N;i++){s1X.push(xs1);s1Y.push(yIn[i]);}
var trS1={x:s1X,y:s1Y,mode:"markers",marker:{color:"#10b981",size:10},showlegend:false};
var s2X=[];var s2Y=[];for(var i=0;i<N;i++){s2X.push(xs2);s2Y.push(yIn[i]);}
var trS2={x:s2X,y:s2Y,mode:"markers",marker:{color:"#10b981",size:10},showlegend:false};
var s3X=[];var s3Y=[];var s3T=[];for(var i=0;i<N;i++){s3X.push(xs3);s3Y.push(yIn[i]);s3T.push(outs[i]);}
var trS3={x:s3X,y:s3Y,mode:"markers+text",text:s3T,textposition:"right",marker:{color:"#f59e0b",size:14},showlegend:false,textfont:{size:13,color:"#f59e0b"}};
var shapes=[];
function lineSeg(x0,y0,x1,y1,c){shapes.push({type:"line",x0:x0,y0:y0,x1:x1,y1:y1,line:{color:c,width:1.5}});}
for(var i=0;i<N;i+=2){lineSeg(xinL,yIn[i],xs1,yIn[i],"#3b82f6");lineSeg(xinL,yIn[i+1],xs1,yIn[i+1],"#3b82f6");lineSeg(xinL,yIn[i],xs1,yIn[i+1],"#94a3b8");lineSeg(xinL,yIn[i+1],xs1,yIn[i],"#94a3b8");}
for(var i=0;i<N;i+=4){for(var j=0;j<2;j++){lineSeg(xs1,yIn[i+j],xs2,yIn[i+j],"#10b981");lineSeg(xs1,yIn[i+j+2],xs2,yIn[i+j+2],"#10b981");lineSeg(xs1,yIn[i+j],xs2,yIn[i+j+2],"#94a3b8");lineSeg(xs1,yIn[i+j+2],xs2,yIn[i+j],"#94a3b8");}}
for(var i=0;i<4;i++){lineSeg(xs2,yIn[i],xs3,yIn[i],"#10b981");lineSeg(xs2,yIn[i+4],xs3,yIn[i+4],"#10b981");lineSeg(xs2,yIn[i],xs3,yIn[i+4],"#94a3b8");lineSeg(xs2,yIn[i+4],xs3,yIn[i],"#94a3b8");}
var annotations=[
{x:(xinL+xs1)/2,y:N+0.2,text:"Asama 1: 2-nokta",showarrow:false,font:{color:"#94a3b8",size:11}},
{x:(xs1+xs2)/2,y:N+0.2,text:"Asama 2: 4-nokta",showarrow:false,font:{color:"#94a3b8",size:11}},
{x:(xs2+xs3)/2,y:N+0.2,text:"Asama 3: 8-nokta",showarrow:false,font:{color:"#94a3b8",size:11}}
];
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{range:[-0.05,1.05],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-1,N+1],showgrid:false,zeroline:false,showticklabels:false},shapes:shapes,annotations:annotations,showlegend:false,margin:{t:40,b:20,l:30,r:30}};
Plotly.newPlot("plot-butterfly-tr",[trIn,trS1,trS2,trS3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><code>N = 8</code> için radix-2 FFT kelebek diyagramı. Soldaki girdi örnekleri <strong>bit-ters sırada</strong>dır. Üç kelebek aşaması (log<sub>2</sub> 8 = 3) önce çiftleri, sonra dörtlüleri, sonra tam sekizliyi birleştirir. Her aşama <code>N/2</code> kelebek gerçekleştirir — aşama başına toplam iş <code>O(N)</code>, tüm <code>\\log_2 N</code> aşama boyunca toplam iş <code>O(N \\log N)</code>'dir.</div></div>

<div class="calc-example"><div class="example-label">ELLE ÖRNEK: N = 4 İÇİN FFT İZLEME</div><div class="example-body"><code>x = [1, 2, 3, 4]</code>'ü yeniden kullanın. Çift indisli: <code>[1, 3]</code>; tek indisli: <code>[2, 4]</code>.<br><br>
Çiftin 2-uzunluk DFT'si: <code>E[0] = 1 + 3 = 4</code>, <code>E[1] = 1 - 3 = -2</code>.<br>
Tekin 2-uzunluk DFT'si: <code>O[0] = 2 + 4 = 6</code>, <code>O[1] = 2 - 4 = -2</code>.<br><br>
Twiddle <code>W_4 = e^{-i\\pi/2} = -i</code>. Kelebekleri uygulayın:<br>
<code>X[0] = E[0] + W_4^0 O[0] = 4 + 6 = 10</code><br>
<code>X[1] = E[1] + W_4^1 O[1] = -2 + (-i)(-2) = -2 + 2i</code><br>
<code>X[2] = E[0] - W_4^0 O[0] = 4 - 6 = -2</code><br>
<code>X[3] = E[1] - W_4^1 O[1] = -2 - 2i</code><br><br>
2. bölümdeki doğrudan DFT ile tam olarak aynı sonuç, ancak iki 2-uzunluk DFT (her biri 3 işlem) artı 4 kelebek ile elde edildi. Faktör <code>N = 4</code>'te küçük, <code>N = 10^6</code>'da devasadır.</div></div>

<div id="plot-cost-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nv=[];var direct=[];var fft=[];
for(var p=4;p<=20;p++){var n=Math.pow(2,p);Nv.push(n);direct.push(n*n);fft.push(5*n*Math.log2(n));}
var tr1={x:Nv,y:direct,mode:"lines+markers",name:"O(N^2) dogrudan DFT",line:{color:"#ef4444",width:2.5},marker:{size:7}};
var tr2={x:Nv,y:fft,mode:"lines+markers",name:"O(N log N) FFT",line:{color:"#3b82f6",width:2.5},marker:{size:7}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"N (donusum uzunlugu)",type:"log",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"islemler",type:"log",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:70,r:30}};
Plotly.newPlot("plot-cost-tr",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><code>N</code>'nin <code>16</code>'dan <code>10^6</code>'ya kadar log-log grafikte işlem sayısı. İki eğri dramatik biçimde ayrışır: <code>N = 10^6</code>'da doğrudan DFT yaklaşık <code>10^{12}</code> işleme mal olur, FFT yalnızca <code>10^8</code>'e — <code>10{,}000{\\times}</code> hızlanma. Bu tek algoritmik sezgi sinyal işlemeyi hesaplama açısından makul kılan şeydir.</div></div>

<h2 class="l-title">6. Twiddle Çarpanları</h2>

<p class="l-text">Her kelebekte görünen <code>W_N^k = e^{-i 2\\pi k / N}</code> sayıları <strong>twiddle çarpanları</strong> olarak adlandırılır. Bunlar karmaşık düzlemde birim çember etrafında eşit aralıklı <code>N</code>'nci birim köklerdir. Üretim seviyesi bir FFT'de bir kez hesaplanıp bir tabloda saklanırlar — her kelebek sonra bir tablo araması artı bir karmaşık çarpma ve bir karmaşık toplamadır.</p>

<div class="calc-formula"><div class="formula-label">TWIDDLE SİMETRİSİ</div><div class="formula-main">$$W_N^{\\,k + N/2} \\;=\\; e^{-i\\, 2\\pi (k + N/2)/N} \\;=\\; e^{-i\\, 2\\pi k / N}\\, e^{-i\\pi} \\;=\\; -\\, W_N^{\\,k}$$</div><div class="formula-sub">Birim çember üzerindeki iki karşıt nokta yalnızca işaret olarak farklıdır. Bu tek olgu, üst-yarı çıktıları ücretsiz hesaplamamızı sağlar.</div></div>

<div class="calc-formula"><div class="formula-label">PERİYODİKLİK</div><div class="formula-main">$$W_N^{\\,k+N} \\;=\\; W_N^{\\,k}, \\qquad W_N^{\\,k}\\, W_N^{\\,j} \\;=\\; W_N^{\\,k+j}$$</div><div class="formula-sub">Tüm çarpmalar birim çember üzerinde açı toplamalarıdır. Özyineleme bu grup yapısını acımasızca kullanır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bellek düzeni</div><div class="card-body"><code>2^p</code> uzunluğunda bir FFT için yalnızca <code>N/2</code> ayrı twiddle gerekir. Genellikle önceden hesaplanmış tek bir <code>complex64</code> dizisi olarak saklanırlar. Modern kütüphaneler (FFTW, MKL, cuFFT) düzeni SIMD vektör komutları için ayarlar.</div></div>
<div class="calc-card"><div class="card-title">Gerçek aritmetik</div><div class="card-body">Her karmaşık çarpma 4 gerçek çarpma ve 2 gerçek toplama; her karmaşık toplama 2 gerçek toplamadır. Radix-2 FFT'nin önde gelen FLOP sayısı bu yüzden <code>5 N \\log_2 N</code> gerçek işlemdir — 5. bölümdeki grafiğin kullandığı sabit.</div></div>
<div class="calc-card"><div class="card-title">Daha yüksek radikslar</div><div class="card-body">Radix-4 ve radix-8 varyantları birkaç radix-2 aşamasını birleştirir ve birkaç çarpma tasarrufu sağlar. Ünlü "split-radix" algoritması <code>4 N \\log_2 N</code> işlem başarır — iki kuvveti boyutları için asimptotik rekor.</div></div>
<div class="calc-card"><div class="card-title">İki olmayan N</div><div class="card-body"><code>N</code> ikinin kuvveti olmadığında, kütüphaneler karışık-radiks (Bluestein, Rader, prime-factor) varyantlarına geri döner. Saf asal <code>N</code> Bluestein'ın chirp z-dönüşümü hilesini kullanır, ki kendisi bir FFT'dir.</div></div>
</div>

<h2 class="l-title">7. Pratik Sayısal: FFT Yanlış Gittiğinde</h2>

<p class="l-text">DFT, <code>N</code> örneklik pencerenizi sonsuz periyodik bir sinyalin bir periyodu olarak ele alır. Beslediğiniz gerçek sinyal o pencerede periyodik değilse — örneğin frekansı tam olarak bir bin'e gelmeyen bir sinüsoid — örtük periyodik uzatma pencere sınırında bir sıçrama süreksizliğine sahiptir. Matematiksel olarak tam olan DFT, o sıçramayı yeniden üretmek için gereken frekansların geniş bulaşması dahil <em>o</em> sinyalin spektrumunu bildirir. Bu yapay yansımaya <strong>spektral sızıntı</strong> denir.</p>

<div class="calc-formula"><div class="formula-label">AZALTMA: PENCERELEME</div><div class="formula-main">$$x_{\\text{pen}}[n] \\;=\\; w[n]\\, x[n], \\qquad w[n] = \\text{Hann, Hamming, Blackman, } \\ldots$$</div><div class="formula-sub">Zaman alanı sinyalini her iki uç noktada sıfıra eğilen pürüzsüz bir pencere ile çarpın. DFT artık sıçraması olmayan, periyodik görünen bir sinyal görür.</div></div>

<p class="l-text">Pencereleme maliyeti biraz daha geniş bir ana lobudur (yakın aralıklı tonlar arasında daha kötü çözünürlük), buna karşılık dramatik biçimde daha düşük yan loblar (her tonun uzağında daha temiz spektrum). Yaygın seçimler ve takasları:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dikdörtgensel (pencere yok)</div><div class="card-body">En dar ana lob, korkunç yan loblar (yalnızca <code>-13</code> dB). Yalnızca sinyal pencerenizde gerçekten periyodikse kullanın (örneğin <code>f_s/N</code>'nin tam katında sentezlenmiş bir test tonu).</div></div>
<div class="calc-card"><div class="card-title">Hann</div><div class="card-body"><code>w[n] = 0.5 (1 - \\cos(2\\pi n/(N-1)))</code>. Pürüzsüz konikleşme, <code>-31</code> dB yan loblar. <code>scipy.signal.spectrogram</code> ve çoğu STFT hattındaki varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Hamming</div><div class="card-body">Hann'ın sıfır olmayan uç noktalara sahip küçük varyantı. Hafifçe daha iyi yakın yan loblar (<code>-43</code> dB), daha kötü uzaktakiler. Konuşmada tarihsel favori.</div></div>
<div class="calc-card"><div class="card-title">Blackman</div><div class="card-body">Üçüncü bir kosinüs terimi ekler. Daha geniş bir ana lob pahasına yan loblar <code>-58</code> dB'ye kadar. Güçlü bir tonun yanında zayıf bir tonu tespit etmeniz gerektiğinde kullanın.</div></div>
</div>

<div id="plot-leakage-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=128;var f=10.5;var x=[];for(var n=0;n<N;n++){x.push(Math.cos(2*Math.PI*f*n/N));}
var hann=[];for(var n=0;n<N;n++){hann.push(0.5*(1-Math.cos(2*Math.PI*n/(N-1))));}
function dft(arr){var out=[];for(var k=0;k<N;k++){var re=0,im=0;for(var n=0;n<N;n++){var ang=-2*Math.PI*k*n/N;re+=arr[n]*Math.cos(ang);im+=arr[n]*Math.sin(ang);}out.push(Math.sqrt(re*re+im*im));}return out;}
var Xrect=dft(x);var Xwin=dft(x.map(function(v,i){return v*hann[i];}));
var bins=[];var Xr=[];var Xw=[];for(var k=0;k<N/2;k++){bins.push(k);Xr.push(20*Math.log10(Math.max(Xrect[k],1e-6)));Xw.push(20*Math.log10(Math.max(Xwin[k],1e-6)));}
var tr1={x:bins,y:Xr,mode:"lines",name:"dikdortgensel (pencere yok)",line:{color:"#ef4444",width:2}};
var tr2={x:bins,y:Xw,mode:"lines",name:"Hann penceresi",line:{color:"#3b82f6",width:2}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"frekans bin'i k",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[0,40]},yaxis:{title:"buyukluk (dB)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-60,50]},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-leakage-tr",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><code>10.5</code> bin frekansında (tam sayı bin'de değil) saf bir kosinüs. Pencere olmadan (kırmızı) enerji birçok bin'e sızıyor. Hann penceresi ile (mavi) ana lob biraz genişliyor ama yan loblar <code>20</code>+ dB düşüyor — spektrum temiz görünüyor. İşte bu yüzden her gerçek spektrogram bir pencere uygular.</div></div>

<div class="l-note"><strong>Mühendis kuralı:</strong> Varsayılan olarak Hann kullanın. Güçlü bir tonun yanında zayıf bir tonu tespit etmeniz gerekirse Blackman'a geçin. Dikdörtgenseli yalnızca tam olarak bir bin'e oturmak üzere tasarlanmış sentetik tonlar için kullanın (ki bu doğal sinyaller için asla olmaz).</div>

<h2 class="l-title">8. Gerçek FFT (RFFT)</h2>

<p class="l-text">Gerçek değerli girdi için — ki bu ses, sensör verileri, görüntüler ve temelde her fiziksel ölçümü kapsar — DFT çıktısı Hermitsel simetri ile kısıtlanır:</p>

<div class="calc-formula"><div class="formula-label">GERÇEK GİRDİ İÇİN DFT HERMİTSEL SİMETRİSİ</div><div class="formula-main">$$X[N - k] \\;=\\; \\overline{X[k]}, \\qquad k = 1, 2, \\ldots, N/2 - 1$$</div><div class="formula-sub">Üst yarı alt yarının eşleniğidir. Yalnızca N/2 + 1 çıktı bağımsız bilgi taşır.</div></div>

<p class="l-text"><strong>Gerçek FFT</strong> bu fazlalığı kullanır: üst yarıyı tamamen hesaplamayı atlar. <code>N</code> uzunluğunda gerçek girdi için <code>np.fft.rfft</code> fonksiyonu, <code>np.fft.fft</code>'nin yaklaşık yarı maliyetiyle <code>N/2 + 1</code> uzunluğunda bir dizi döndürür. Girdiniz gerçekse — ki neredeyse her zaman — onu tercih edin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bellek tasarrufu</div><div class="card-body"><code>N = 4096</code> için tam FFT çıktısı <code>4096</code> karmaşık sayıdır (<code>float32</code>'de <code>32</code> KB). Rfft çıktısı <code>2049</code> karmaşık sayıdır (<code>16</code> KB). Aşağı akış işleme için yarıya inmiş bellek.</div></div>
<div class="calc-card"><div class="card-title">Ters</div><div class="card-body"><code>np.fft.irfft</code> <code>N/2 + 1</code> karmaşık bin alır ve <code>N</code> gerçek örnek döndürür. Boyut argümanı zorunludur çünkü orijinal sinyalin uzunluğu rfft çıktısından benzersiz olarak çıkarılamaz.</div></div>
<div class="calc-card"><div class="card-title">Enerji yorumu</div><div class="card-body"><code>1</code>'den <code>N/2 - 1</code>'e kadar her rfft bin'i tam spektrumda <em>iki</em> eşlenik frekansı temsil eder. Toplam enerjiyi rfft'den hesaplamak için, o iç bin'lerin katkısını ikiye katlayın (ancak bin <code>0</code> veya bin <code>N/2</code>'yi değil).</div></div>
<div class="calc-card"><div class="card-title">Tam FFT kullanmanız gerektiğinde</div><div class="card-body">Sinyaliniz gerçekten karmaşık değerliyse (örneğin bir yazılım tanımlı radyodan I/Q taban bandı verisi veya filtrelenmiş analitik sinyaller) Hermitsel simetri tutmaz ve tam <code>fft</code>'ye ihtiyacınız vardır.</div></div>
</div>

<h2 class="l-title">9. AI Uygulaması 1: Konuşma için Spektrogramlar</h2>

<p class="l-text">Şimdi modern AI'nın DFT'yi neden bu kadar önemsediğinin en büyük nedenlerinden birine geliyoruz. Konuşma ve müzik sabit değildir: frekans içerikleri milisaniyeden milisaniyeye değişir. Tek bir küresel DFT her şeyi birbirine ortalar ve zaman bilgisini kaybeder. Standart düzeltme <strong>Kısa Süreli Fourier Dönüşümüdür (STFT)</strong>: sinyali örtüşen kısa çerçevelere böl, her çerçeveyi pencerele, her çerçevenin FFT'sini al ve büyüklükleri bir 2B görüntü olarak yığ. Sonuç bir <strong>spektrogramdır</strong> — her modern konuşma modelinin kanonik girdi temsili.</p>

<div class="calc-formula"><div class="formula-label">KISA SÜRELİ FOURIER DÖNÜŞÜMÜ</div><div class="formula-main">$$X[m, k] \\;=\\; \\sum_{n=0}^{L-1} w[n]\\, x[m H + n]\\, e^{-i\\, 2\\pi k n / L}$$</div><div class="formula-sub">L = pencere uzunluğu, H = atlama boyutu (genellikle %75 örtüşme için L/4), m çerçeveyi indeksler, k frekans bin'ini indeksler.</div></div>

<p class="l-text">Whisper için hat baştan sona şudur:</p>

<div class="calc-formula"><div class="formula-label">WHISPER ÖN-UCU (LİTERAL)</div><div class="formula-main">$$\\text{ses}_{16\\text{kHz}} \\xrightarrow{\\text{cerceve, } L=400, H=160} \\text{Hann ile STFT} \\xrightarrow{|\\cdot|^2} \\text{guc} \\xrightarrow{\\text{mel filtresi, 80 bin}} \\text{log mel}$$</div><div class="formula-sub">Çıktı, Transformer kodlayıcının gerçekte aldığı saniyede 100 çerçeve hızında 80 kanallı bir zaman-frekans görüntüsüdür.</div></div>

<p class="l-text"><strong>Mel ölçeği</strong>, kulağın en ayrıştırıcı olduğu düşük frekanslara daha fazla bin yerleştiren algısal güdülenmiş doğrusal olmayan bir frekans çarpıklığıdır. <strong>Log</strong> sıkıştırması oranları farklara dönüştürür, logaritmik yüksek ses algısıyla eşleşir. Bunların hiçbiri altta yatan DFT'yi değiştirmez — mel spektrogramındaki her hücre orijinal FFT büyüklüklerinin (pozitif, ağırlıklı, log-sıkıştırılmış) bir fonksiyonudur. Whisper, Wav2Vec, HuBERT, EnCodec, MusicGen ve Bark'ın tüm girdi "modalitesi" tam olarak bu çıktıdır.</p>

<div id="plot-spectrogram-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var fs=8000;var T=2;var Ntot=fs*T;
var x=[];for(var n=0;n<Ntot;n++){var t=n/fs;var f=200+(1500-200)*(t/T);x.push(Math.sin(2*Math.PI*f*t*0.5+2*Math.PI*200*t));}
var L=256;var H=64;var Nf=Math.floor((Ntot-L)/H);
var hann=[];for(var i=0;i<L;i++){hann.push(0.5*(1-Math.cos(2*Math.PI*i/(L-1))));}
var Z=[];for(var m=0;m<Nf;m++){var frame=[];for(var i=0;i<L;i++){frame.push(x[m*H+i]*hann[i]);}var mag=[];for(var k=0;k<L/2;k++){var re=0,im=0;for(var n=0;n<L;n++){var ang=-2*Math.PI*k*n/L;re+=frame[n]*Math.cos(ang);im+=frame[n]*Math.sin(ang);}mag.push(20*Math.log10(Math.sqrt(re*re+im*im)+1e-6));}Z.push(mag);}
var Zt=[];for(var k=0;k<L/2;k++){var row=[];for(var m=0;m<Nf;m++){row.push(Z[m][k]);}Zt.push(row);}
var times=[];for(var m=0;m<Nf;m++){times.push(m*H/fs);}
var freqs=[];for(var k=0;k<L/2;k++){freqs.push(k*fs/L);}
var tr={z:Zt,x:times,y:freqs,type:"heatmap",colorscale:"Viridis",showscale:true,colorbar:{title:"dB",titlefont:{color:"#e8e8e8"},tickfont:{color:"#e8e8e8"}}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"zaman (s)",gridcolor:"rgba(255,255,255,0.06)"},yaxis:{title:"frekans (Hz)",gridcolor:"rgba(255,255,255,0.06)",range:[0,2500]},margin:{t:30,b:50,l:70,r:30}};
Plotly.newPlot("plot-spectrogram-tr",[tr],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Bir cıvıltı sinyalinin spektrogramı (frekans 2 saniyede <code>200</code> Hz'den <code>1500</code> Hz'e doğrusal olarak süpürülüyor). Diyagonal sarı şerit zaman boyunca anlık frekanstır. Her piksel bir çerçevedeki bir DFT bin'inin büyüklüğüdür. Whisper'ın kodlayıcısının aldığı girdinin şekli tam olarak budur (ek bir mel projeksiyonu ve log sıkıştırma ile).</div></div>

<div class="think-box"><div class="think-label">BU HATTIN NEDEN İTİRAZ EDİLMEZ OLDUĞU</div><div class="think-body">Araştırmacılar onlarca yıl mel spektrogramlarını ham dalga formlarıyla değiştirmeye çalıştı (WaveNet, SincNet, RawNet). En iyi ham-ses modelleri standart kıyaslamalarda spektrogram hattıyla eşleşir ama nadiren onu geçer, üstelik 10-50 kat daha fazla hesaplamaya mal olur. Mel-FFT temsili hem insan algısına hem de evrişimli/dikkat tümevarımsal eğilimlerine o kadar iyi eşleştirilmiştir ki 2026 itibarıyla evrensel konuşma ön ucu olarak kalır. LibriSpeech WER'de her yüzde puanı, her Whisper kontrol noktası, her metinden konuşmaya ses klonu — hepsi bir DFT ile başlar.</div></div>

<h2 class="l-title">10. AI Uygulaması 2: Konum Kodlaması ve Fourier Özellikleri</h2>

<p class="l-text">Ayrık Fourier tabanının modern AI'da göründüğü ikinci, daha az aşikar yer konum kodlamasıdır. Vaswani ve diğerlerinin 2017 Transformer'ı token konumlarını üstel olarak aralıklı frekanslarda sinüsoidler olarak kodladı:</p>

<div class="calc-formula"><div class="formula-label">TRANSFORMER KONUM KODLAMASI</div><div class="formula-main">$$\\text{PE}(p, 2i) \\;=\\; \\sin\\!\\left(\\frac{p}{10000^{2i/d}}\\right), \\quad \\text{PE}(p, 2i+1) \\;=\\; \\cos\\!\\left(\\frac{p}{10000^{2i/d}}\\right)$$</div><div class="formula-sub">p = token konumu, i = boyut indisi, d = gömme boyutu. d/2 frekans çiftine kesilmiş bir Fourier tabanı.</div></div>

<p class="l-text">Bu kelimenin tam anlamıyla <code>d/2</code> frekans çiftine kesilmiş bir Fourier tabanıdır. Dehâ, modelin göreli konumları doğrusal kombinasyonlar olarak kodlamasına izin vermesidir: <code>\\sin(p + k) = \\sin p \\cos k + \\cos p \\sin k</code>. Dikkat başlıkları, mutlak konum hakkında hiçbir bilgi verilmeden "k token geriye bak"ı uygulayan k-derece-döndürme matrisleri öğrenebilir.</p>

<p class="l-text">Daha çarpıcı bir örnek <strong>NeRF</strong>'tendir (Mildenhall ve diğ., 2020). 3B koordinat <code>(x, y, z)</code> alıp renk/yoğunluk tahmin eden vanilya bir MLP yalnızca düşük frekanslı içeriği öğrenir: renderlanmış görüntüler bulanık çıkar. Girdiyi önce bir Fourier özelliği gömmesinden geçirin:</p>

<div class="calc-formula"><div class="formula-label">FOURIER ÖZELLİK GÖMMESİ (NeRF)</div><div class="formula-main">$$\\gamma(x) \\;=\\; \\bigl[\\sin(2^0 \\pi x),\\, \\cos(2^0 \\pi x),\\, \\sin(2^1 \\pi x),\\, \\cos(2^1 \\pi x),\\, \\ldots,\\, \\sin(2^{L-1}\\pi x),\\, \\cos(2^{L-1}\\pi x)\\bigr]$$</div><div class="formula-sub">Her girdi koordinatı geometrik olarak büyüyen frekanslarda sinüsoidlerin 2L-vektörü olur. MLP artık ham bir skaler yerine bir Fourier tabanı görür.</div></div>

<p class="l-text">Sonuç dramatiktir: aynı MLP mimarisi bulanıktan fotogerçekçiye geçer. Tancik ve diğ. (2020, "Fourier Features Let Networks Learn High Frequency Functions in Low Dimensional Domains") nedenini Sinir Tanjant Çekirdeği teorisi ile kanıtlar: bir MLP için NTK'nın özdeğerleri hızla düşer, onu düşük frekanslı öğrenmeye yönlendirir. Fourier özellikleri girdideki yüksek frekansları güçlendirir, bu önyargıyı dengeler.</p>

<div id="plot-fourier-features-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x=[];var y=[];for(var i=0;i<=500;i++){var u=i/500;x.push(u);y.push(Math.sin(2*Math.PI*8*u)+0.5*Math.sin(2*Math.PI*32*u));}
var yPlain=[];for(var i=0;i<=500;i++){var u=i/500;yPlain.push(Math.sin(2*Math.PI*8*u)*0.4+0.2*Math.sin(2*Math.PI*2*u));}
var yFF=[];for(var i=0;i<=500;i++){var u=i/500;yFF.push(0.98*Math.sin(2*Math.PI*8*u)+0.48*Math.sin(2*Math.PI*32*u));}
var tr1={x:x,y:y,mode:"lines",name:"hedef sinyal",line:{color:"#94a3b8",width:2,dash:"dot"}};
var tr2={x:x,y:yPlain,mode:"lines",name:"Fourier ozellikleri olmadan MLP",line:{color:"#ef4444",width:2}};
var tr3={x:x,y:yFF,mode:"lines",name:"Fourier ozellikleri ile MLP",line:{color:"#3b82f6",width:2}};
var layout={paper_bgcolor:"#0a0a0a",plot_bgcolor:"#0a0a0a",font:{color:"#e8e8e8",family:"Geist"},xaxis:{title:"girdi koordinati x",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"f(x)",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},showlegend:true,legend:{orientation:"h",y:1.08,x:0.5,xanchor:"center"},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot("plot-fourier-features-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption">Yüksek frekanslı bir hedefin (gri kesik çizgi) iki özdeş MLP tarafından stilize uydurması. Fourier özellikleri olmadan ağ yalnızca yavaş zarfı yakalar ve hızlı salınımları kaçırır (kırmızı). Girdinin Fourier özellik gömmesiyle (mavi) aynı ağ her iki ölçeği de yeniden üretir. Bu tek hile, NeRF, SIREN, instant-NGP ve modern konum kodlamalarının çalışmasının nedenidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NeRF</div><div class="card-body">Hacimsel sahne temsili. Girdi: <code>(x, y, z, \\theta, \\phi)</code>. Fourier özellikleri olmadan: bulanık, geometri halüsinasyonlu. <code>L = 10</code> frekansla: 50 girdi görüntüsünden fotogerçekçi yeniden inşalar.</div></div>
<div class="calc-card"><div class="card-title">SIREN</div><div class="card-body">Sitzmann ve diğ., 2020. Tüm ağ boyunca <code>\\sin</code> aktivasyonlarını kullanır (yalnızca girdide değil). Her katmana Fourier özellikleri yerleştirmeye eşdeğer. Görüntülerin, sesin ve PDE çözümlerinin örtük temsillerinde son durum sanat başarır.</div></div>
<div class="calc-card"><div class="card-title">RoPE</div><div class="card-body">Rotary Position Embedding (Su ve diğ., 2021). Llama, GPT-NeoX, PaLM'de kullanılır. Gömmelere sinüsoidal konum eklemek yerine, sorgu/anahtar vektörlerini <code>10000^{-2i/d}</code> frekanslarında <em>döndürür</em>. Aynı Fourier tabanı, şimdi dikkatin içinde çarpımsal olarak uygulanıyor.</div></div>
<div class="calc-card"><div class="card-title">Instant-NGP</div><div class="card-body">Müller ve diğ., 2022. Fourier benzeri çok çözünürlüklü karma kodlamaları küçük bir MLP ile birleştirir. NeRF'i saatler yerine saniyelerde eğitir. Karma ızgarası açık Fourier bin'lerini değiştirir ama aynı rolü oynar: yüksek frekanslı girdi yükseltme.</div></div>
</div>

<h2 class="l-title">11. AI Uygulaması 3: FFT-tabanlı Evrişim</h2>

<p class="l-text">Üçüncü derin AI bağlantısı doğrudan Ders 4'ün evrişim teoreminden gelir. <code>N</code> uzunluğunda bir sinyalin <code>K</code> uzunluğunda bir çekirdekle doğrudan evrişimi <code>O(N K)</code>'ya mal olur. FFT-tabanlı evrişim <code>O((N+K) \\log(N+K))</code>'ya mal olur. Hem <code>N</code> hem de <code>K</code> büyük olduğunda, FFT mertebelerce kazanır.</p>

<div class="calc-formula"><div class="formula-label">FFT EVRİŞİM REÇETESİ</div><div class="formula-main">$$y \\;=\\; x * h \\quad\\longleftrightarrow\\quad y \\;=\\; \\mathcal{F}^{-1}\\bigl(\\,\\mathcal{F}(x_{\\text{ped}}) \\cdot \\mathcal{F}(h_{\\text{ped}})\\,\\bigr)$$</div><div class="formula-sub">Dairesel sarmalanmayı önlemek için her iki girdiyi N+K-1 uzunluğa sıfır-doldurun, sonra üç FFT (ileri, ileri, ters) ve bir noktasal çarpma.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman kullanmalı</div><div class="card-body">Pratik kural: çekirdek <code>\\sim 30</code> elemandan büyük olduğunda FFT evrişimi doğrudanı geçer. Ses reverbleri (<code>10^5</code>+ örneklik çekirdekler) için yaklaşık <code>1000{\\times}</code> daha hızlıdır. Her ticari evrişim reverbi bunu kullanır.</div></div>
<div class="calc-card"><div class="card-title">LLM'lerde uzun evrişimler</div><div class="card-body">Hyena / H3 / S4 ailesindeki modeller dikkati frekans alanında parametrelendirilmiş uzun evrişimlerle değiştirir. <code>1M</code> tokena kadar dizi uzunluğu mümkün olur çünkü evrişim FFT ile yapılır, <code>O(L^2)</code> dikkat matrisi ile değil.</div></div>
<div class="calc-card"><div class="card-title">Büyük çekirdekli CNN'ler</div><div class="card-body">RepLKNet (Ding ve diğ., 2022), SLaK (Liu ve diğ., 2022). <code>31 \\times 31</code> çekirdeklerin ImageNet'te Transformer'larla yarıştığını gösterir. Bunları eğitmek yalnızca FFT evrişimi ve akıllı derinlikte faktörizasyonlarla pratiktir.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon örnekleyicileri</div><div class="card-body">Birçok hızlı difüzyon çözücüsü (DPM-Solver, DEIS) skor alanı için spektral yöntemlere dayanır. Gizli ızgaradaki FFT-tabanlı operatörler yüksek çözünürlükte bile adım süresini düşük tutar.</div></div>
</div>

<div class="calc-example"><div class="example-label">SOMUT: SES REVERB EVRİŞİMİ</div><div class="example-body"><code>30</code> saniyelik bir şarkıyı (<code>48</code> kHz'de <code>N = 1.44 \\times 10^6</code> örnek) bir konser salonunun <code>3</code> saniyelik darbe yanıtıyla (<code>K = 1.44 \\times 10^5</code>) evirin.<br><br>
Doğrudan: <code>N \\cdot K \\approx 2 \\times 10^{11}</code> çarp-topla — tek bir CPU çekirdeğinde yaklaşık <code>30</code> saniye.<br>
FFT: <code>5(N+K) \\log_2(N+K) \\approx 1.2 \\times 10^8</code> işlem — aynı çekirdekte yaklaşık <code>20</code> ms.<br><br>
Bu <code>1500{\\times}</code> bir hızlanmadır. Hayatınızda kullandığınız her evrişim reverb eklentisi buna dayanır. Matematik tam olarak Ders 4'ün evrişim teoremidir, Ders 5'in FFT'si aracılığıyla hesaplanır.</div></div>

<h2 class="l-title">12. Pratik Pyodide Egzersizi</h2>

<p class="l-text">Biraz FFT hesaplama zamanı. Üç sinüsoid ve beyaz gürültünün bir karışımını sentezliyor, FFT'sini alıyor ve tepeleri belirliyoruz. Sonra doğrusal bir cıvıltının spektrogramını hesaplıyor ve diyagonal frekans süpürmesini görselleştiriyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># --- Çok-tonlu test sinyali sentezle ----------------------------</span>
fs = <span class="num">1000</span>                 <span class="cm"># örnekleme oranı, Hz</span>
T = <span class="num">2.0</span>                  <span class="cm"># süre, s</span>
N = <span class="fn">int</span>(fs * T)            <span class="cm"># 2000 örnek</span>
t = np.arange(N) / fs

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = (<span class="num">1.0</span>*np.sin(<span class="num">2</span>*np.pi*<span class="num">50</span>*t)
   + <span class="num">0.5</span>*np.sin(<span class="num">2</span>*np.pi*<span class="num">120</span>*t)
   + <span class="num">0.3</span>*np.sin(<span class="num">2</span>*np.pi*<span class="num">240</span>*t)
   + <span class="num">0.2</span>*rng.<span class="fn">standard_normal</span>(N))

<span class="cm"># --- Gerçek FFT (gerçek girdimiz var) ---------------------------</span>
X = np.fft.<span class="fn">rfft</span>(x)
freqs = np.fft.<span class="fn">rfftfreq</span>(N, <span class="num">1</span>/fs)
mag = np.<span class="fn">abs</span>(X) * <span class="num">2</span> / N    <span class="cm"># genlik ölçeklendirme</span>

<span class="cm"># --- En yüksek üç tepeyi seç ------------------------------------</span>
top = np.<span class="fn">argsort</span>(mag)[-<span class="num">3</span>:][::-<span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"En yüksek 3 spektral tepe:"</span>)
<span class="kw">for</span> k <span class="kw">in</span> top:
    <span class="fn">print</span>(<span class="str">f"  f = {freqs[k]:7.1f} Hz   genlik = {mag[k]:.3f}"</span>)

<span class="cm"># --- Şimdi Hann penceresi uygulayın ve sızıntının temizlendiğini görün</span>
hann = np.<span class="fn">hanning</span>(N)
X_win = np.fft.<span class="fn">rfft</span>(x * hann)
mag_win = np.<span class="fn">abs</span>(X_win) * <span class="num">2</span> / np.<span class="fn">sum</span>(hann)

<span class="cm"># --- FFT vs O(N^2) doğrudan için O(N log N) zamanlamasını doğrula</span>
<span class="kw">import</span> time

<span class="kw">def</span> <span class="fn">direct_dft</span>(x):
    N = <span class="fn">len</span>(x)
    n = np.<span class="fn">arange</span>(N)
    k = n.<span class="fn">reshape</span>((N, <span class="num">1</span>))
    W = np.exp(-<span class="num">1j</span> * <span class="num">2</span> * np.pi * k * n / N)
    <span class="kw">return</span> W @ x

<span class="kw">for</span> Nt <span class="kw">in</span> [<span class="num">256</span>, <span class="num">1024</span>, <span class="num">4096</span>]:
    z = rng.<span class="fn">standard_normal</span>(Nt)
    t0 = time.<span class="fn">perf_counter</span>()
    Zd = <span class="fn">direct_dft</span>(z)
    td = time.<span class="fn">perf_counter</span>() - t0
    t0 = time.<span class="fn">perf_counter</span>()
    Zf = np.fft.<span class="fn">fft</span>(z)
    tf = time.<span class="fn">perf_counter</span>() - t0
    err = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(Zd - Zf))
    <span class="fn">print</span>(<span class="str">f"N={Nt:5d}  dogrudan={td*1000:7.2f} ms   FFT={tf*1000:6.2f} ms   hizlanma={td/tf:6.1f}x   mak hata={err:.2e}"</span>)

<span class="cm"># --- Bir cıvıltının spektrogramı --------------------------------</span>
fs2 = <span class="num">2000</span>
T2 = <span class="num">2.0</span>
N2 = <span class="fn">int</span>(fs2 * T2)
t2 = np.<span class="fn">arange</span>(N2) / fs2
<span class="cm"># Anlık frekans doğrusal olarak 100 -&gt; 800 Hz süpürür</span>
phase = <span class="num">2</span>*np.pi * (<span class="num">100</span>*t2 + (<span class="num">800</span>-<span class="num">100</span>)/(<span class="num">2</span>*T2)*t2**<span class="num">2</span>)
chirp = np.sin(phase)

L = <span class="num">256</span>
H = <span class="num">64</span>
hann = np.<span class="fn">hanning</span>(L)
nframes = (N2 - L) // H + <span class="num">1</span>
S = np.<span class="fn">empty</span>((L//<span class="num">2</span> + <span class="num">1</span>, nframes))
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(nframes):
    frame = chirp[m*H : m*H + L] * hann
    S[:, m] = np.<span class="fn">abs</span>(np.fft.<span class="fn">rfft</span>(frame))

S_db = <span class="num">20</span> * np.<span class="fn">log10</span>(S + <span class="num">1e-6</span>)
<span class="fn">print</span>(<span class="str">f"\\nSpektrogram sekli: {S.shape}  (frekans bin x cerceve)"</span>)
<span class="fn">print</span>(<span class="str">f"Ilk cercevedeki tepe frekansi:   {np.argmax(S[:, 0])  * fs2/L:6.1f} Hz"</span>)
<span class="fn">print</span>(<span class="str">f"Orta cercevedeki tepe frekansi:  {np.argmax(S[:, nframes//2]) * fs2/L:6.1f} Hz"</span>)
<span class="fn">print</span>(<span class="str">f"Son cercevedeki tepe frekansi:   {np.argmax(S[:, -1]) * fs2/L:6.1f} Hz"</span>)</code></pre></div>

<div class="l-note"><strong>Bu kodu çalıştırın</strong> (alttaki lab'ta). Şunu görmelisiniz: (1) ekilen üç tepe <code>50</code>, <code>120</code> ve <code>240</code> Hz'de yüzde'nin küçük bir kısmına kadar kurtarılmış; (2) FFT, <code>N</code> büyüdükçe doğrudan DFT'den dramatik biçimde daha hızlı hale gelir ve hızlanma <code>N = 4096</code>'ya kadar <code>100{\\times}</code>+ ulaşır; (3) cıvıltının anlık frekansı başlangıçta <code>100</code> Hz'den sona <code>800</code> Hz'e yürür — tam tasarlandığı gibi.</div>

<div class="calc-example"><div class="example-label">DENENECEK UZANTILAR</div><div class="example-body"><strong>(1)</strong> <code>np.hanning(N)</code>'yi <code>np.blackman(N)</code> ile değiştirin ve hafifçe daha geniş tepeler pahasına spektrumun daha temiz hale geldiğini gözlemleyin.<br><strong>(2)</strong> Aliased bir bileşen ekleyin: mevcut karışıma <code>1.0 * np.sin(2*np.pi*900*t)</code> ekleyin. <code>900</code> Hz, <code>f_s/2 = 500</code> Hz'in çok üzerinde olduğundan, NumPy yine DFT'sini hesaplar ama enerji aliased frekans <code>|900 - 1000| = 100</code> Hz'e iner. Bunu doğrulayın.<br><strong>(3)</strong> <code>L = 6</code> ile 1B Fourier özellik gömmesi <code>\\gamma(x) = [\\sin(2^i \\pi x), \\cos(2^i \\pi x)]_{i=0}^{L-1}</code>'i hesaplayın ve tek bir skaler girdiyi 12 boyutlu bir vektöre nasıl haritaladığını görselleştirin. NeRF'in her girdi koordinatına uyguladığı gömme tam olarak budur.</div></div>

<h2 class="l-title">Özet</h2>

<p class="l-text">Ayrık Fourier Dönüşümü sürekli Fourier integralini sonlu bir toplamla değiştirir: <code>X[k] = \\sum_n x[n] e^{-i 2\\pi k n/N}</code>. <code>f_s \\ge 2 f_{\\max}</code> oranında örnekleme hiçbir bilginin kaybolmadığını garanti eder (Nyquist-Shannon); aksi takdirde aliasing yüksek frekansları düşük frekanslara katlar. Her DFT bin'i <code>k</code> ayrık frekans <code>f_k = k f_s / N</code>'yi temsil eder. Naif DFT <code>O(N^2)</code>'ye mal olur, ancak Cooley-Tukey'in böl-ve-yönet özyinelemesi <code>T(N) = 2 T(N/2) + O(N)</code> bunu <code>O(N \\log N)</code>'e indirir — <code>N = 10^4</code>'te <code>3000{\\times}</code>'den <code>N = 10^6</code>'da <code>10\\,000{\\times}</code>'e kadar değişen bir hızlanma. Pencereleme (Hann, Hamming, Blackman) periyodik olmayan sinyallerden gelen spektral sızıntıyı azaltır; gerçek FFT, gerçek girdi için işi yarıya indirmek için Hermitsel simetriyi kullanır. DFT/FFT mekanizması akademik değildir: Whisper'ın mel spektrogram ön-ucunu, NeRF'in Fourier özellik gömmelerini, transformer konum kodlamalarını (sinüsoidal ve RoPE), uzun-evrişim dil modellerini (Hyena, H3, S4) ve bilimsel ve büyük çekirdekli CNN iş yüklerindeki her FFT-tabanlı evrişimi besler. Ders 6'da dağılımsal Fourier teorisi ve örnekleme teoremini katı kılan Dirac tarağı ile döngüyü kapatıyoruz.</p>
`
};
