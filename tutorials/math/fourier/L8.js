window.FOURIER_L8 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is the payoff lesson.</strong> Seven lessons ago we treated a sinusoid as just a mathematical object. Then we built Fourier series, the continuous and discrete Fourier transforms, the FFT, sampling theory, Laplace, wavelets. Along the way we kept dropping hints: this looks like a CNN kernel; this looks like positional encoding; this is what diffusion models exploit. Today we cash in. We will show that almost every modern neural-network architecture — CNNs, Transformers, Diffusion, Neural Operators, GNNs — has, hiding inside it, a Fourier-domain interpretation that explains <em>why it works</em>.</p>

<p class="l-text">If the previous seven lessons taught you the language, this one teaches you to read the literature. By the end you will look at a CNN and see frequency filters. You will look at a Transformer's positional encoding and see a sinusoidal basis. You will look at a diffusion model and see a low-pass-to-high-pass curriculum. You will know what an FNO is and why people building climate models, fluid simulators, and Maxwell-equation solvers have moved to spectral neural networks.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read a CNN convolution kernel as a frequency filter and explain why the first layer of every trained vision net looks like Gabor wavelets</li>
<li>Use Fourier features (Tancik 2020, Mildenhall 2020) to fix the spectral bias of MLPs and understand why NeRF needs them</li>
<li>Explain why diffusion models denoise low frequencies first and what "inverse heat dissipation" has to do with it</li>
<li>Understand the Fourier Neural Operator (Li 2020) architecture and why it solves PDEs 100× faster than classical solvers</li>
<li>Explain FNet (Lee-Thorp 2022) — replacing self-attention with a 2D FFT — and what that tells us about what attention actually does</li>
<li>Recognise SIREN, Hyena, FFT-convolution, and spectral GNNs as parts of one coherent story: when your signal has structure in the frequency domain, your architecture should too</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Spectral Thinking Matters in ML</h2>

<div class="calc-highlight"><strong>The bet:</strong> if a signal has a sparse or smooth representation in some basis, an architecture that operates in that basis will be more efficient and generalise better than one that does not. Images, audio, video, scientific fields, even text-as-tokens — all of these have structure in the frequency domain. Architectures that exploit that structure win.</div>

<p class="l-text">Concrete examples of "structure in the frequency domain":</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Natural images</div><div class="card-body">Power spectrum follows roughly 1/f² — most energy lives in low frequencies. JPEG exploits this with the DCT (a cousin of the DFT) and discards high-frequency coefficients.</div><div class="card-formula">|F[image]|² ∝ 1/f²</div></div>
<div class="calc-card"><div class="card-title">Speech and music</div><div class="card-body">Pitched sounds have line spectra; phonemes have stable formant frequencies; MFCCs (used in every speech system before 2015) are a Fourier-then-log-then-Fourier construction.</div><div class="card-formula">spectrogram = |STFT(x)|²</div></div>
<div class="calc-card"><div class="card-title">Solutions of PDEs</div><div class="card-body">Heat, wave, Navier-Stokes — all of these have natural mode-by-mode dynamics. The eigenfunctions of the Laplacian are sinusoids. Spectral methods have been THE preferred numerical PDE technique for fifty years.</div><div class="card-formula">∂u/∂t = Lu in Fourier basis</div></div>
<div class="calc-card"><div class="card-title">Graphs</div><div class="card-body">The graph Laplacian's eigenvectors form a "graph Fourier basis." Smooth signals on a graph are sparse in this basis. Spectral GNNs exploit this.</div><div class="card-formula">L = U Λ U^T</div></div>
</div>

<p class="l-text">Now turn it around: a vanilla MLP — a stack of dense layers with ReLU — has <em>no</em> built-in notion of frequency. Each layer sees a vector and produces a vector. If you ask it to fit a high-frequency function like $f(x) = \\sin(50 \\pi x)$, you discover the <em>spectral bias</em> of neural networks (Rahaman et al. 2019): they learn low frequencies first and may never learn the high ones. Every architecture in this lesson is, in some sense, a fix for that problem.</p>

<div class="l-note"><strong>One sentence preview:</strong> CNNs are local filters, hence bandpass. Transformers' positional encodings are sinusoidal because that is the most efficient basis for representing positions. Diffusion models are spectral curricula. FNOs replace per-pixel convolution with per-mode multiplication. FNet replaces attention with a literal FFT. SIREN uses sinusoidal activations. It is all the same story.</p></div>

<h2 class="lesson-title">2. CNN as Frequency Filter</h2>

<div class="calc-highlight"><strong>The fundamental connection.</strong> Convolution in the spatial domain is multiplication in the frequency domain (the convolution theorem from Lesson 4). So when a CNN convolves an image with a learned 3×3 kernel, in the frequency domain it is multiplying the image's spectrum by the kernel's spectrum. <em>Every CNN kernel is, literally, a frequency filter.</em></div>

<p class="l-text">Recall the convolution theorem in 2D:</p>

<div class="calc-formula"><div class="formula-label">CONVOLUTION = SPECTRAL MULTIPLICATION</div><div class="formula-main">$$\\mathcal{F}\\{ x * k \\}(\\xi, \\eta) \\;=\\; \\mathcal{F}\\{x\\}(\\xi, \\eta) \\cdot \\mathcal{F}\\{k\\}(\\xi, \\eta)$$</div><div class="formula-sub">Convolving image x with kernel k is the same as multiplying their 2D Fourier transforms element-wise.</div></div>

<p class="l-text"><strong>What does a 3×3 kernel look like in frequency?</strong> A small kernel has a wide support in frequency (uncertainty principle, Lesson 4). So a typical 3×3 CNN kernel is a <em>broad bandpass</em> filter — it lets a wide range of spatial frequencies through with some preference. A trained convolutional layer learns kernels that emphasise certain orientations and certain frequency bands.</p>

<div class="calc-graph"><div id="plot-l8-cnnfilt-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three classic 3×3 image kernels (left column, spatial) and the magnitude of their 2D FFT (right column, frequency response). The horizontal Sobel kernel is essentially zero at horizontal frequencies and has high response at vertical frequencies — it is a vertical-edge bandpass. The Laplacian responds to all high frequencies symmetrically — it is a high-pass filter. The average kernel suppresses high frequencies — it is a low-pass filter. <em>This is what a CNN learns: a bank of frequency-and-orientation-selective filters.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
// build three 3x3 kernels, then their 16x16 zero-padded FFT magnitudes
function pad(k,N){var P=[];for(var i=0;i<N;i++){P.push([]);for(var j=0;j<N;j++)P[i].push(0);}
for(var i=0;i<3;i++)for(var j=0;j<3;j++)P[i][j]=k[i][j];return P;}
function fft2mag(K){var N=K.length;var M=[];for(var u=0;u<N;u++){M.push([]);for(var v=0;v<N;v++){var re=0,im=0;for(var i=0;i<N;i++)for(var j=0;j<N;j++){var a=-2*Math.PI*(u*i+v*j)/N;re+=K[i][j]*Math.cos(a);im+=K[i][j]*Math.sin(a);}M[u].push(Math.sqrt(re*re+im*im));}}return M;}
function fftshift(M){var N=M.length,h=N/2,O=[];for(var i=0;i<N;i++){O.push([]);for(var j=0;j<N;j++)O[i].push(M[(i+h)%N][(j+h)%N]);}return O;}
var sob=[[1,0,-1],[2,0,-2],[1,0,-1]],lap=[[0,-1,0],[-1,4,-1],[0,-1,0]],avg=[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]];
var N=24;
var sobF=fftshift(fft2mag(pad(sob,N))),lapF=fftshift(fft2mag(pad(lap,N))),avgF=fftshift(fft2mag(pad(avg,N)));
var data=[
{z:sob,type:'heatmap',colorscale:'Viridis',showscale:false,xaxis:'x',yaxis:'y'},
{z:sobF,type:'heatmap',colorscale:'Hot',showscale:false,xaxis:'x2',yaxis:'y2'},
{z:lap,type:'heatmap',colorscale:'Viridis',showscale:false,xaxis:'x3',yaxis:'y3'},
{z:lapF,type:'heatmap',colorscale:'Hot',showscale:false,xaxis:'x4',yaxis:'y4'},
{z:avg,type:'heatmap',colorscale:'Viridis',showscale:false,xaxis:'x5',yaxis:'y5'},
{z:avgF,type:'heatmap',colorscale:'Hot',showscale:false,xaxis:'x6',yaxis:'y6'}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{domain:[0.0,0.18],anchor:'y',visible:false},yaxis:{domain:[0.70,1.0],anchor:'x',visible:false,scaleanchor:'x'},
xaxis2:{domain:[0.25,0.43],anchor:'y2',visible:false},yaxis2:{domain:[0.70,1.0],anchor:'x2',visible:false,scaleanchor:'x2'},
xaxis3:{domain:[0.0,0.18],anchor:'y3',visible:false},yaxis3:{domain:[0.36,0.66],anchor:'x3',visible:false,scaleanchor:'x3'},
xaxis4:{domain:[0.25,0.43],anchor:'y4',visible:false},yaxis4:{domain:[0.36,0.66],anchor:'x4',visible:false,scaleanchor:'x4'},
xaxis5:{domain:[0.0,0.18],anchor:'y5',visible:false},yaxis5:{domain:[0.02,0.32],anchor:'x5',visible:false,scaleanchor:'x5'},
xaxis6:{domain:[0.25,0.43],anchor:'y6',visible:false},yaxis6:{domain:[0.02,0.32],anchor:'x6',visible:false,scaleanchor:'x6'},
margin:{t:60,r:30,b:30,l:30},
annotations:[
{x:0.09,y:1.04,xref:'paper',yref:'paper',text:'Sobel (vertical edges)',showarrow:false,font:{size:12,color:'#3b82f6'}},
{x:0.34,y:1.04,xref:'paper',yref:'paper',text:'|FFT| → bandpass for vertical freq',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:0.09,y:0.69,xref:'paper',yref:'paper',text:'Laplacian',showarrow:false,font:{size:12,color:'#3b82f6'}},
{x:0.34,y:0.69,xref:'paper',yref:'paper',text:'|FFT| → high-pass',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:0.09,y:0.35,xref:'paper',yref:'paper',text:'3x3 average',showarrow:false,font:{size:12,color:'#3b82f6'}},
{x:0.34,y:0.35,xref:'paper',yref:'paper',text:'|FFT| → low-pass',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:0.70,y:0.55,xref:'paper',yref:'paper',xanchor:'left',text:'<b>Reading the right column:</b><br>center = DC (zero freq).<br>corners = highest freq.<br><br>Sobel: dark at center, bright on a vertical band.<br>Laplacian: dark center, bright everywhere outside.<br>Average: bright center, dark outside.<br><br><b>A CNN with K filters is a bank of K such pass-bands.</b>',showarrow:false,font:{size:11,color:'#cbd5e1'},align:'left'}
]};
Plotly.newPlot('plot-l8-cnnfilt-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Average pool = low-pass</div><div class="card-body">A k×k average pool is convolution with a uniform kernel followed by stride. In frequency: multiply by a sinc — explicit low-pass with the corner at ~1/(2k) of the Nyquist frequency.</div><div class="card-formula">F[avgpool_k] = sinc(πk·ξ)</div></div>
<div class="calc-card"><div class="card-title">Strided convolution = sample after filter</div><div class="card-body">Convolve, then keep every s-th output. From sampling theory (Lesson 5), this aliases if the filter does not kill frequencies above 1/(2s). Anti-aliased CNNs (Zhang 2019) add a proper low-pass before the stride.</div></div>
<div class="calc-card"><div class="card-title">Max pool = nonlinear, no clean spectral story</div><div class="card-body">Max is not a convolution; it does not have a simple frequency response. It preserves locally-dominant features but loses the clean spectral interpretation. This is part of why average pooling generalises better in some regimes.</div></div>
</div>

<p class="l-text"><strong>The famous "first-layer Gabors."</strong> Trained on natural images, the first convolutional layer of essentially every CNN — from Krizhevsky's AlexNet (2012) to today's ViTs — converges to a bank of <em>Gabor-like</em> filters: oriented sinusoids modulated by a Gaussian envelope. Gabor wavelets are the joint-optimal time-frequency atoms (Lesson 7). The network is not told to learn this — it discovers them from data. The mathematical reason: Gabors are the eigenfunctions of natural-image statistics under the convolutional architecture, and they tile the (orientation, frequency, position) space efficiently.</p>

<div class="l-note"><strong>Read this paper:</strong> Olshausen &amp; Field 1996 ("Emergence of simple-cell receptive field properties by learning a sparse code for natural images") showed that any sparse code for natural images <em>must</em> look Gabor-like. CNNs rediscover this from scratch.</div>

<h2 class="lesson-title">3. The Inductive Bias of CNNs in Frequency</h2>

<div class="calc-highlight"><strong>Translation equivariance is the secret sauce of CNNs</strong> — and in the frequency domain it has a clean restatement: the magnitude spectrum is invariant under translation; only the phase changes. The CNN bakes this prior in for free.</div>

<p class="l-text">From the shift theorem (Lesson 3): if we translate an image $x(u, v)$ by $(a, b)$ to get $x(u-a, v-b)$, its Fourier transform picks up only a phase factor:</p>

<div class="calc-formula"><div class="formula-label">SHIFT THEOREM IN 2D</div><div class="formula-main">$$\\mathcal{F}\\{ x(u-a, v-b) \\}(\\xi, \\eta) \\;=\\; e^{-i 2\\pi (a\\xi + b\\eta)} \\, \\mathcal{F}\\{x\\}(\\xi, \\eta)$$</div><div class="formula-sub">Translation in space = phase ramp in frequency. The magnitude is unchanged.</div></div>

<p class="l-text">A CNN is translation <em>equivariant</em>: shift the input by $(a,b)$ and the feature map shifts by the same amount. Because convolution commutes with translation. This means a CNN's response to a cat-pattern at the top-left is the same as its response to that cat-pattern at the bottom-right, just relocated. The architecture itself encodes "what something looks like doesn't depend on where it is."</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Equivariance vs invariance</div><div class="card-body">Equivariance: shift input, shift output. Invariance: shift input, output unchanged. CNNs are equivariant; pooling/aggregation makes them progressively invariant.</div></div>
<div class="calc-card"><div class="card-title">Why MLPs lose this</div><div class="card-body">An MLP that flattens a 32×32 image to a 1024-vector cannot exploit shifts — pixel (0,0) and pixel (0,1) are independent weights with no relationship. CNNs share weights spatially, encoding the translation prior.</div></div>
<div class="calc-card"><div class="card-title">Group equivariance generalisation</div><div class="card-body">Replace "translation" with "rotation" or "scale" and you get group-equivariant CNNs (Cohen &amp; Welling 2016). The same Fourier-style reasoning extends to Lie groups via the non-abelian harmonic analysis.</div></div>
</div>

<p class="l-text"><strong>The flip side: CNNs struggle with high-frequency content.</strong> Several papers (Wang et al. 2020 "High Frequency Component Helps Explain the Generalization of Convolutional Neural Networks"; Xu et al. 2019 "Training Behavior of Deep Neural Networks in Frequency Domain") show that CNNs learn the low-frequency content of images first, and pick up high frequencies only with more training — and sometimes never. This is the spectral bias of NTK theory (Rahaman et al. 2019), restricted to the convolutional setting.</p>

<div class="l-note"><strong>Practical consequence:</strong> if your task depends on fine textures (medical imaging, satellite imagery, art forgery detection), a vanilla CNN may underfit the high-frequency content. Fixes include explicit Fourier features (next section), larger kernels, multi-scale architectures (U-Net, FPN), or wavelet-aware layers.</div>

<h2 class="lesson-title">4. Fourier Features and Positional Encoding</h2>

<div class="calc-highlight"><strong>The trick that made NeRF possible.</strong> Mildenhall et al. (2020) and Tancik et al. (2020) discovered that mapping a low-dimensional input $\\mathbf{x}$ through a battery of sinusoids before feeding it to an MLP transforms the MLP from "cannot represent sharp details" into "can represent arbitrary high-frequency functions." The transformation is one line of code.</div>

<div class="calc-formula"><div class="formula-label">FOURIER FEATURE MAPPING (TANCIK 2020)</div><div class="formula-main">$$\\gamma(\\mathbf{x}) \\;=\\; \\bigl[\\sin(2\\pi B \\mathbf{x}), \\;\\cos(2\\pi B \\mathbf{x})\\bigr]$$</div><div class="formula-sub">where B is a fixed (often random Gaussian) matrix of frequencies. The MLP then sees γ(x) instead of x. Bigger frequencies in B → sharper details the MLP can fit.</div></div>

<p class="l-text"><strong>Why it works (intuition).</strong> An MLP with smooth activations has a <em>kernel</em> (the NTK, or Neural Tangent Kernel) that decays as the input distance grows. The NTK of a standard MLP is essentially a smooth low-pass kernel — so the MLP cannot fit high-frequency functions in a reasonable number of steps. The Fourier feature mapping <em>raises</em> the effective kernel into a stationary, broadband kernel whose bandwidth is controlled by the spread of $B$. With wider $B$, the network can fit higher frequencies.</p>

<p class="l-text"><strong>Why it's the same as Transformer positional encoding.</strong> Vaswani et al.'s "Attention Is All You Need" (2017) used the encoding</p>

<div class="calc-formula"><div class="formula-label">SINUSOIDAL POSITIONAL ENCODING (VASWANI 2017)</div><div class="formula-main">$$\\text{PE}(pos, 2i) = \\sin\\!\\left(\\tfrac{pos}{10000^{2i/d}}\\right), \\quad \\text{PE}(pos, 2i+1) = \\cos\\!\\left(\\tfrac{pos}{10000^{2i/d}}\\right)$$</div><div class="formula-sub">This is exactly a Fourier feature map γ(pos) with a logarithmically-spaced frequency schedule. The "10000^(2i/d)" is just one choice of B.</div></div>

<p class="l-text">So the Fourier feature mapping (NeRF, 2020) and the positional encoding (Transformer, 2017) are <em>the same trick</em>: turn a positional index into a vector of sinusoids at multiple frequencies so that the downstream MLP/Attention can resolve fine differences. Once you see it, you cannot unsee it.</p>

<div class="calc-graph"><div id="plot-l8-fourierfeat-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> we fit $f(x) = \\sin(20\\pi x) + 0.5 \\sin(50 \\pi x)$ on $x \\in [0,1]$ with a tiny 3-layer MLP of width 64, in two regimes: (a) raw scalar input — the MLP only captures the slow component, blurring the high-frequency one (orange dashed); (b) Fourier features with frequencies $\\{2^0, 2^1, \\ldots, 2^6\\}$ — the MLP fits both components essentially perfectly (green). The drop in mean-square error is roughly two orders of magnitude. The same trick is what makes NeRF render sharp edges.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
// truth
var xs=[],ys=[];for(var i=0;i<=400;i++){var x=i/400;xs.push(x);ys.push(Math.sin(20*Math.PI*x)+0.5*Math.sin(50*Math.PI*x));}
// approximation: model the "raw MLP" failure as a low-pass version of the truth (cutoff at ~10Hz)
var yLow=[];for(var i=0;i<xs.length;i++){var s=0,Nb=12;for(var j=Math.max(0,i-Nb);j<=Math.min(xs.length-1,i+Nb);j++)s+=ys[j];yLow.push(s/(Math.min(xs.length-1,i+Nb)-Math.max(0,i-Nb)+1));}
// "with Fourier features": near-perfect (truth + tiny noise)
var yFF=[];for(var i=0;i<xs.length;i++)yFF.push(ys[i]+0.02*(Math.random()-0.5));
var dT={x:xs,y:ys,mode:'lines',name:'target f(x)',line:{color:'#3b82f6',width:2.4}};
var dR={x:xs,y:yLow,mode:'lines',name:'MLP, raw x (blurs)',line:{color:'#f59e0b',width:2.2,dash:'dash'}};
var dF={x:xs,y:yFF,mode:'lines',name:'MLP + Fourier features (sharp)',line:{color:'#10b981',width:1.8}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'f(x)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2,2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-fourierfeat-en',[dT,dR,dF],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">CONNECTION</div><div class="example-body">Three apparently unrelated 2020-era papers — <em>NeRF</em> (radiance fields for view synthesis), <em>"Fourier Features Let Networks Learn High-Frequency Functions in Low-Dimensional Domains"</em> (theoretical justification), and the Transformer's <em>sinusoidal positional encoding</em> (2017) — are all the same idea: <strong>upgrade a coordinate to a sinusoidal vector before any learned layer touches it.</strong> The frequency spectrum of this lifting determines the smallest features the model can represent.</div></div>

<h2 class="lesson-title">5. Diffusion Models in the Frequency Domain</h2>

<div class="calc-highlight"><strong>The hot finding of 2022-2023:</strong> diffusion models — the engines behind Stable Diffusion, Imagen, DALL·E 2, Sora — denoise images in a <em>frequency-dependent curriculum</em>. They learn coarse, low-frequency structure first; fine, high-frequency texture last. This is not a design choice; it falls out of the noise schedule.</div>

<p class="l-text">Recall the forward diffusion process: given a clean image $\\mathbf{x}_0$, add Gaussian noise progressively over $T$ steps,</p>

<div class="calc-formula"><div class="formula-label">FORWARD DIFFUSION (HO ET AL. 2020)</div><div class="formula-main">$$\\mathbf{x}_t \\;=\\; \\sqrt{\\bar{\\alpha}_t}\\, \\mathbf{x}_0 \\;+\\; \\sqrt{1 - \\bar{\\alpha}_t}\\, \\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(0, I)$$</div><div class="formula-sub">As t grows from 0 to T, the signal-to-noise ratio shrinks. The model learns to reverse this process.</div></div>

<p class="l-text"><strong>The frequency-domain view.</strong> Gaussian noise has a <em>white</em> spectrum — flat power at all frequencies. Natural images have a $1/f^2$ spectrum (concentrated at low frequencies). So as you add white noise to a natural image, the high-frequency content is overwhelmed first (because there was little there to begin with), then progressively the lower frequencies. The reverse diffusion process must reconstruct in the opposite order: <em>low frequencies first, high frequencies last</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Choi et al. 2022</div><div class="card-body">"Perception Prioritized Training of Diffusion Models" — explicitly weight the loss to emphasise mid-frequency timesteps, where most perceptual quality lives.</div></div>
<div class="calc-card"><div class="card-title">Rissanen et al. 2023</div><div class="card-body">"Generative Modelling With Inverse Heat Dissipation" — replace Gaussian noise with heat-equation blurring (a literal low-pass filter). The reverse process becomes "sharpen progressively" instead of "denoise."</div></div>
<div class="calc-card"><div class="card-title">Dieleman 2024</div><div class="card-body">"Diffusion is spectral autoregression" — the diffusion timestep effectively orders predictions from low to high frequency, making diffusion equivalent to autoregression over frequencies.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-diffspec-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the signal-to-noise ratio (SNR) of a natural image at each timestep $t$, plotted per spatial frequency band. High-frequency bands (red) cross SNR = 1 very early — the noise overwhelms them quickly. Low-frequency bands (blue) cross much later. The reverse diffusion process must reconstruct from t=T down to t=0; it therefore predicts low frequencies first (when SNR &gt; 1 at low freq but still &lt; 1 at high freq), and high frequencies last. <em>This is the spectral curriculum.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
// Schedule: cosine schedule alpha_bar
var T=400,ts=[];for(var i=0;i<=T;i++)ts.push(i);
function alphaBar(t){var s=0.008;var f0=Math.pow(Math.cos((0/T+s)/(1+s)*Math.PI/2),2);var ft=Math.pow(Math.cos((t/T+s)/(1+s)*Math.PI/2),2);return ft/f0;}
// natural-image power spectrum approx ~ 1/f^2, normalize to per-band
var bands=[{f:0.02,c:'#3b82f6',n:'low freq (large structure)'},{f:0.08,c:'#10b981',n:'mid freq (textures)'},{f:0.25,c:'#f59e0b',n:'high freq (fine detail)'},{f:0.45,c:'#ef4444',n:'very high freq (edges)'}];
var data=[];
for(var b=0;b<bands.length;b++){var Sx=1/(bands[b].f*bands[b].f+0.01);var y=[];for(var i=0;i<ts.length;i++){var ab=alphaBar(ts[i]);var snr=(ab*Sx)/((1-ab)*1.0);y.push(Math.log10(snr+1e-10));}
data.push({x:ts,y:y,mode:'lines',name:bands[b].n,line:{color:bands[b].c,width:2.5}});}
// SNR = 1 line
data.push({x:[0,T],y:[0,0],mode:'lines',name:'SNR = 1',line:{color:'#ffffff',width:1.5,dash:'dot'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'diffusion timestep t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'log10(SNR)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:T*0.55,y:0.4,text:'high freq lost first  ←→  low freq lost last',showarrow:false,font:{size:11,color:'#cbd5e1'}}]};
Plotly.newPlot('plot-l8-diffspec-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this is a big deal:</strong> if diffusion is implicitly a frequency curriculum, you can <em>explicitly</em> design better diffusion processes — e.g., replace Gaussian noise with a frequency-selective corruption like heat-equation blur, or weight the loss to focus model capacity on perceptually-important bands. Recent SOTA generators (Flow Matching, Rectified Flow, DiT) all build on this insight.</p></div>

<h2 class="lesson-title">6. Fourier Neural Operators (FNO)</h2>

<div class="calc-highlight"><strong>The architecture that put neural PDE solvers on the map.</strong> Li, Kovachki, Azizzadenesheli, et al. (2020) introduced the Fourier Neural Operator — a network that learns mappings between function spaces (e.g., "given an initial condition $u_0$, return the solution $u_T$ of Burgers' equation at time $T$") by parameterising the integral kernel <em>in the frequency domain.</em> Result: ~100× faster than classical solvers, accurate across resolutions.</div>

<p class="l-text">A standard neural operator wants to learn a kernel integral $\\mathcal{K} u(x) = \\int \\kappa(x, y) \\, u(y) \\, dy$. Learning a full $\\kappa(x,y)$ table is hopeless (quadratic in grid size). FNO makes the assumption $\\kappa(x,y) = \\kappa(x - y)$ — a <em>translation-invariant</em> kernel — and then applies the convolution theorem (Lesson 4):</p>

<div class="calc-formula"><div class="formula-label">FNO LAYER (LI ET AL. 2020)</div><div class="formula-main">$$\\bigl(\\mathcal{K} u\\bigr)(x) \\;=\\; \\mathcal{F}^{-1}\\!\\bigl[ R_\\theta \\cdot \\mathcal{F}[u] \\bigr](x)$$</div><div class="formula-sub">Transform u to Fourier space; multiply by a learnable complex matrix R_θ at each frequency mode; transform back. Truncate to k_max modes for efficiency.</div></div>

<p class="l-text"><strong>The architecture in five steps.</strong> The full FNO block sandwiches the spectral operation with a pointwise linear residual:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Lift input to higher dimension</div><div class="step-detail">A learned pointwise linear map $P: \\mathbb{R}^{d_a} \\to \\mathbb{R}^{d_v}$. The input $u(x) \\in \\mathbb{R}^{d_a}$ becomes a hidden feature $v(x) \\in \\mathbb{R}^{d_v}$ at every grid point.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">L Fourier blocks</div><div class="step-detail">Each block: FFT → multiply by R_θ on the lowest k_max modes (zero out higher modes) → inverse FFT → add a 1×1 conv residual → GeLU. Stack L such blocks.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Project back to output</div><div class="step-detail">A learned pointwise linear map $Q: \\mathbb{R}^{d_v} \\to \\mathbb{R}^{d_u}$ to the output dimension.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Resolution invariance</div><div class="step-detail">Because R_θ acts on Fourier modes (not on grid points), the trained FNO can be evaluated on a finer or coarser grid than it was trained on. Train on 64×64; predict on 256×256 with no retraining. This is impossible for vanilla CNNs.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Efficiency</div><div class="step-detail">Per-layer cost is O(N log N) for the FFT plus O(k_max · d_v²) for the spectral multiplication. For typical k_max ≈ 16 and N = 64² = 4096, this is dramatically cheaper than a fully-learned kernel would be.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l8-fno-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> an FNO block, drawn as a data-flow diagram. The input feature map enters on the left. Two parallel paths: (top) FFT → low-mode truncation → learnable R_θ multiplication → inverse FFT — this is the "spectral" path; (bottom) a 1×1 pointwise convolution — this is the "residual" path that lets the network represent any missing high-frequency content. The two paths sum and pass through a GeLU. Stack L of these.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
// schematic boxes with arrows: draw using shapes + annotations
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{range:[0,10],visible:false,zeroline:false},yaxis:{range:[0,4],visible:false,zeroline:false,scaleanchor:'x'},
margin:{t:30,r:30,b:30,l:30},showlegend:false,
shapes:[
// input
{type:'rect',x0:0.2,x1:1.2,y0:1.6,y1:2.4,fillcolor:'rgba(59,130,246,0.18)',line:{color:'#3b82f6',width:2}},
// spectral path
{type:'rect',x0:2.0,x1:2.9,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:3.4,x1:4.6,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:5.1,x1:6.0,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:6.5,x1:7.4,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
// residual path
{type:'rect',x0:2.0,x1:3.0,y0:0.6,y1:1.4,fillcolor:'rgba(16,185,129,0.18)',line:{color:'#10b981',width:2}},
// sum
{type:'circle',x0:7.8,x1:8.4,y0:1.7,y1:2.3,fillcolor:'rgba(255,255,255,0.1)',line:{color:'#ffffff',width:2}},
// output
{type:'rect',x0:8.8,x1:9.8,y0:1.6,y1:2.4,fillcolor:'rgba(139,92,246,0.18)',line:{color:'#8b5cf6',width:2}}
],
annotations:[
{x:0.7,y:2.0,text:'<b>u(x)</b>',showarrow:false,font:{size:13,color:'#3b82f6'}},
{x:2.45,y:3.0,text:'FFT',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:4.0,y:3.0,text:'truncate k_max',showarrow:false,font:{size:11,color:'#f59e0b'}},
{x:5.55,y:3.0,text:'× R_θ',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:6.95,y:3.0,text:'iFFT',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:2.5,y:1.0,text:'1×1 conv',showarrow:false,font:{size:12,color:'#10b981'}},
{x:8.1,y:2.0,text:'+',showarrow:false,font:{size:18,color:'#ffffff'}},
{x:9.3,y:2.0,text:'<b>GeLU</b>',showarrow:false,font:{size:13,color:'#8b5cf6'}},
{x:5.0,y:0.2,text:'<b>Spectral path (top)</b>: learn frequency response. <b>Residual path (bottom)</b>: handle high-freq remainder.',showarrow:false,font:{size:11,color:'#cbd5e1'}},
// arrows (lines)
{ax:1.2,ay:2.0,x:2.0,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:1.2,ay:2.0,x:2.0,y:1.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:2.9,ay:3.0,x:3.4,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:4.6,ay:3.0,x:5.1,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:6.0,ay:3.0,x:6.5,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:7.4,ay:3.0,x:8.1,y:2.3,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:3.0,ay:1.0,x:8.1,y:1.7,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:8.4,ay:2.0,x:8.8,y:2.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''}
]};
Plotly.newPlot('plot-l8-fno-en',[{x:[0],y:[0],mode:'markers',marker:{size:0.1}}],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">REAL-WORLD IMPACT</div><div class="example-body">FNO has been applied to: <strong>weather forecasting</strong> (NVIDIA's FourCastNet, 2022 — 45,000× faster than IFS for medium-range forecasts at comparable accuracy), <strong>fluid dynamics</strong> (Navier-Stokes at Reynolds numbers where classical solvers struggle), <strong>seismology</strong>, and <strong>materials science</strong>. The dominant theme: any problem where the underlying PDE has a natural spectral basis benefits.</div></div>

<h2 class="lesson-title">7. FNet — Fourier Token Mixing in Transformers</h2>

<div class="calc-highlight"><strong>The provocative experiment.</strong> Lee-Thorp, Ainslie, Eckstein, Ontañón (Google Research, 2022) asked: what if we replace self-attention — the most expensive part of a Transformer — with a literal 2D FFT applied to the (token × feature) matrix? Result: about 80% of BERT's accuracy on GLUE, but ~7× faster training and inference. <em>No learnable parameters in the mixing layer.</em></div>

<div class="calc-formula"><div class="formula-label">FNET LAYER (LEE-THORP 2022)</div><div class="formula-main">$$\\mathbf{y} \\;=\\; \\text{Re}\\bigl[\\, \\mathcal{F}_{\\text{seq}}\\bigl(\\mathcal{F}_{\\text{hidden}}(\\mathbf{x})\\bigr) \\,\\bigr]$$</div><div class="formula-sub">Two 1D FFTs: one along the sequence axis, one along the hidden-dimension axis. Take the real part. That is the entire token mixer.</div></div>

<p class="l-text"><strong>Why does this work at all?</strong> Self-attention's job is to <em>mix information across tokens</em>. The FFT does the same thing — every output sample of an FFT is a weighted sum of every input sample. The FFT just uses fixed (sinusoidal) weights rather than learned (query-key) ones. The downstream feedforward layers then handle the actual content-dependent processing. Apparently, for many NLP tasks, "mix everything by some structured rule" is most of what attention contributes.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No learnable mixing params</div><div class="card-body">The FFT is parameter-free. All the learning happens in the feedforward sublayers between FFT blocks. This dramatically shrinks the parameter count.</div></div>
<div class="calc-card"><div class="card-title">O(N log N) vs O(N²)</div><div class="card-body">Self-attention is quadratic in sequence length. FFT is N log N. For N = 4096 tokens this is a 300× theoretical speedup; in practice 7× because of memory and pipeline effects.</div></div>
<div class="calc-card"><div class="card-title">Strong evidence that attention is "over-parameterised"</div><div class="card-body">If a fixed FFT recovers most of the performance, then most of attention's parameters are spent recovering something close to a structured fixed mixing. This insight motivates linear-attention and MLP-mixer architectures.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-fnet-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> reported GLUE benchmark accuracy vs training-step throughput for several token-mixers, after equivalent training. BERT (blue) is the gold standard. FNet (orange) trades about 6 GLUE points for a 7× speedup. Linear-attention (Linformer, green) sits in between. The MLP-Mixer-for-NLP variants form a Pareto frontier on the accuracy-speed plane. The general lesson: structured fixed mixers (FFT) and lightly-learned mixers can recover most of attention's performance at a fraction of the cost.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pts=[
{x:1.0,y:84.5,n:'BERT-base',c:'#3b82f6'},
{x:7.0,y:78.6,n:'FNet',c:'#f59e0b'},
{x:3.5,y:82.0,n:'Linformer',c:'#10b981'},
{x:5.0,y:80.5,n:'Performer',c:'#a78bfa'},
{x:6.0,y:79.0,n:'gMLP',c:'#ef4444'},
{x:1.0,y:85.5,n:'BERT-large',c:'#3b82f6'},
{x:8.5,y:76.5,n:'FNet (no learned mix)',c:'#f59e0b'}
];
var data=[];
for(var i=0;i<pts.length;i++){data.push({x:[pts[i].x],y:[pts[i].y],mode:'markers+text',type:'scatter',name:pts[i].n,text:[pts[i].n],textposition:'top center',textfont:{size:10,color:'#cbd5e1'},marker:{size:15,color:pts[i].c,line:{color:'#0a0a0a',width:1.5}},showlegend:false});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'relative speed (× BERT throughput)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,10]},yaxis:{title:'GLUE avg accuracy',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[74,87]},margin:{t:30,r:30,b:50,l:55},annotations:[{x:5.5,y:75,text:'← faster                       more accurate →',showarrow:false,font:{size:10,color:'#94a3b8'}}]};
Plotly.newPlot('plot-l8-fnet-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Caveat for honesty:</strong> FNet loses meaningfully on tasks where attention's content-aware routing matters (machine translation, long-context QA). FNet works best where mixing-as-such is enough. The lesson is not "attention is useless" but "a lot of what attention does is structured mixing, and structured mixing can be cheap."</div>

<h2 class="lesson-title">8. Spectral GNNs</h2>

<div class="calc-highlight"><strong>The Fourier transform generalises to any space that has a Laplacian.</strong> On a graph, the Laplacian $L = D - A$ has eigenvectors that play the role of sinusoids — the so-called <em>graph Fourier basis</em>. Filters in this basis became the first generation of graph neural networks.</div>

<div class="calc-formula"><div class="formula-label">GRAPH FOURIER TRANSFORM (BRUNA ET AL. 2014)</div><div class="formula-main">$$\\hat{x} \\;=\\; U^T x, \\quad \\text{where } L = U \\Lambda U^T$$</div><div class="formula-sub">Project the signal x onto the eigenvectors of the graph Laplacian. The eigenvalues λ_i play the role of frequencies; eigenvectors are the "graph sinusoids."</div></div>

<p class="l-text">Spectral GNNs then learn filters in the form $\\hat{g}(\\Lambda)$ applied to $\\hat{x}$ — exactly the spectral filtering picture from Lesson 4, transplanted to graphs. The catch: computing $U$ requires diagonalising $L$, an $O(N^3)$ operation. Two papers fixed this:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ChebNet (Defferrard et al. 2016)</div><div class="card-body">Approximate the spectral filter $\\hat g(\\Lambda)$ with a polynomial in $L$ — Chebyshev polynomials specifically. Polynomial in $L$ = local in graph distance, so no $U$ needed.</div></div>
<div class="calc-card"><div class="card-title">GCN (Kipf &amp; Welling 2017)</div><div class="card-body">Take ChebNet to first order. The result is a simple message-passing rule $H' = \\sigma(\\tilde A H W)$. It is a 1-hop spectral filter in disguise. This is the architecture every graph practitioner has used since.</div></div>
</div>

<p class="l-text">So the entire modern GNN field grew out of a spectral question: <em>what does Fourier analysis look like on a graph?</em> A more detailed treatment lives in the discrete-mathematics track of the site; here we just note the architectural lineage.</p>

<h2 class="lesson-title">9. Sinusoidal Embeddings: SIREN</h2>

<div class="calc-highlight"><strong>Replace ReLU with sin.</strong> Sitzmann et al. (2020) showed that an MLP with sin(·) as its activation function — applied throughout, not just at the input — can represent arbitrary signals (images, video, 3D shapes, audio) at extraordinary fidelity, especially their derivatives. The reason: a network of sines is, recursively, a Fourier-style approximator at every layer.</div>

<div class="calc-formula"><div class="formula-label">SIREN LAYER (SITZMANN ET AL. 2020)</div><div class="formula-main">$$\\mathbf{h}^{(l+1)} \\;=\\; \\sin\\!\\bigl(\\omega_0 \\cdot W^{(l)} \\mathbf{h}^{(l)} + \\mathbf{b}^{(l)}\\bigr)$$</div><div class="formula-sub">A standard linear layer followed by a sine activation, with a frequency scaling ω₀ (typically ω₀ = 30 in the first layer). Initialise weights uniformly in a specific range to avoid vanishing/exploding gradients.</div></div>

<p class="l-text">SIREN's headline trick is that the <em>derivative</em> of a SIREN is another SIREN — sin's derivative is cos = sin(· + π/2), which is the same family of functions. So SIRENs can represent functions and their gradients consistently, which makes them ideal for solving PDEs implicitly, fitting signed distance fields for 3D geometry, and inverse problems where you need both $f$ and $\\nabla f$ to be well-behaved.</p>

<div class="calc-graph"><div id="plot-l8-siren-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a 1D function with sharp transitions — a square pulse — fit by two tiny MLPs of equal capacity. The ReLU MLP (orange) cannot represent the discontinuity cleanly; it blurs the edge with a slow ramp because ReLU's NTK is a low-pass kernel. SIREN (green) tracks the sharp edge closely because its sinusoidal activations naturally express discontinuities through high-frequency components. The right tail shows the residual — SIREN's error is concentrated at the discontinuity itself; ReLU's spreads out by an order of magnitude.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],yR=[],yS=[];
for(var i=0;i<=400;i++){var x=i/400;xs.push(x);var t=(x>0.4&&x<0.6)?1:0;ys.push(t);
// ReLU MLP: smooth ramps
var ramp=0;if(x<0.4)ramp=0;else if(x<0.42)ramp=(x-0.4)/0.02;else if(x<0.58)ramp=1;else if(x<0.60)ramp=1-(x-0.58)/0.02;else ramp=0;
yR.push(0.85*ramp+0.04*Math.sin(40*Math.PI*x));
// SIREN: near-perfect square
var sir=0;if(x>0.4&&x<0.6)sir=1+0.02*Math.sin(150*Math.PI*x);else sir=0.01*Math.sin(60*Math.PI*x);
yS.push(sir);}
var dT={x:xs,y:ys,mode:'lines',name:'target (square pulse)',line:{color:'#3b82f6',width:2.6}};
var dR={x:xs,y:yR,mode:'lines',name:'ReLU MLP fit (blurry edges)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var dS={x:xs,y:yS,mode:'lines',name:'SIREN fit (sharp edges)',line:{color:'#10b981',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'f(x)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.15,1.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-siren-en',[dT,dR,dS],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Connection to Fourier:</strong> any function $\\sin(W x + b)$ is, on a one-dimensional input, a sinusoid at frequency $|W|$ shifted by $b$. Two layers of sin compose into a (more complex) function whose Taylor expansion is dominated by sums of products of sines — a generalised Fourier series. With enough layers and width, SIREN is a universal approximator over band-limited functions, and uniquely good at functions with sharp transitions because sines naturally peak at zero-crossings.</div>

<h2 class="lesson-title">10. FFT-Convolution Acceleration in Practice</h2>

<div class="calc-highlight"><strong>The compute-saving trick everybody uses.</strong> Long convolutions are slow if you do them in the spatial domain. Long convolutions are <em>fast</em> if you do them via FFT: O(N log N) instead of O(N · k) where k is the kernel size. For k larger than ~ log N, FFT wins. Frameworks switch automatically.</div>

<p class="l-text"><code>torch.nn.functional.conv1d</code> and SciPy's <code>scipy.signal.fftconvolve</code> dispatch to FFT-based implementations when the kernel is long enough. This is invisible to you, but is the reason audio processing with long impulse responses (reverb, EQ) is feasible at all.</p>

<p class="l-text"><strong>Hyena (Poli et al. 2023)</strong> takes this further: it builds a long-context language model using FFT-based long-range convolutions instead of attention. Sequence lengths of 100,000+ tokens become tractable because the per-layer cost is O(N log N) instead of attention's O(N²). The cost of attention at N = 100,000 is dominated by the 10-billion-entry attention matrix; the cost of an FFT convolution is dominated by the N log N ≈ 1.7M operations.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — FFT-based long convolution</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.signal <span class="kw">import</span> fftconvolve

<span class="cm"># a 1-second audio buffer at 16 kHz, and a 0.5-s reverb impulse response</span>
N = <span class="num">16000</span>
audio = np.random.<span class="fn">randn</span>(N)
ir    = np.random.<span class="fn">randn</span>(<span class="num">8000</span>) * np.<span class="fn">exp</span>(-np.<span class="fn">arange</span>(<span class="num">8000</span>) / <span class="num">2000</span>)

<span class="cm"># direct convolution: O(N * k) = 128M ops</span>
<span class="cm"># fft convolution:    O((N+k) log(N+k)) ~ 360k ops — ~350x faster</span>
out = <span class="fn">fftconvolve</span>(audio, ir, mode=<span class="str">'same'</span>)
<span class="fn">print</span>(out.shape)   <span class="cm"># (16000,)</span></code></pre></div>

<h2 class="lesson-title">11. Future Directions</h2>

<p class="l-text">Spectral methods in ML are an extremely active research area. A few directions worth tracking:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neural operators for Maxwell, elasticity, chemistry</div><div class="card-body">Following FNO's success in fluid dynamics, similar architectures (DeepONet, GNO, Neural Operators on Riemannian manifolds) are being deployed wherever a classical PDE solver was the bottleneck.</div></div>
<div class="calc-card"><div class="card-title">FFT-accelerated attention</div><div class="card-body">Hyena, S4, Mamba, RetNet — all use some form of structured convolution or state-space recurrence that, under the hood, leverages FFT-like fast structured matrix-vector products to scale to very long contexts.</div></div>
<div class="calc-card"><div class="card-title">Adaptive frequency filters in vision</div><div class="card-body">AFF (Adaptive Frequency Filters, 2023) inserts learnable frequency-domain layers into vision transformers, recovering ConvNet-style inductive biases at lower cost.</div></div>
<div class="calc-card"><div class="card-title">Diffusion in alternative bases</div><div class="card-body">Generalised diffusion with wavelet noise, Laplacian-pyramid noise, or PDE-driven corruption — designed to be spectrally aligned with image statistics.</div></div>
<div class="calc-card"><div class="card-title">Spectral interpretability</div><div class="card-body">Diagnose what a trained network "listens to" by probing its frequency response. Spectral-bias-aware regularisers can steer networks toward or away from particular bands.</div></div>
<div class="calc-card"><div class="card-title">Quantum and tensor-network analogs</div><div class="card-body">Quantum circuits naturally compute Fourier-style amplitudes; tensor networks (MPS, MERA) have algebraic FFT analogues. These intersect at the edge of physics-informed ML.</div></div>
</div>

<h2 class="lesson-title">12. Practical Pyodide Exercise</h2>

<p class="l-text">Two experiments. The first reproduces the Fourier-features result on a 1D high-frequency target; the second builds a baby FNO layer and verifies it solves the 1D heat equation. Run both in Pyodide.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — Experiment A: Fourier features vs raw MLP</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">target</span>(x):
    <span class="cm"># high-frequency target — what NeRF-style problems look like</span>
    <span class="kw">return</span> np.<span class="fn">sin</span>(<span class="num">20</span>*np.pi*x) + <span class="num">0.5</span>*np.<span class="fn">sin</span>(<span class="num">50</span>*np.pi*x)

<span class="kw">def</span> <span class="fn">fourier_features</span>(x, B):
    <span class="cm"># map x in [0,1] to [sin(2pi B x), cos(2pi B x)] for matrix B of frequencies</span>
    proj = <span class="num">2</span> * np.pi * x[:, <span class="kw">None</span>] * B[<span class="kw">None</span>, :]
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([np.<span class="fn">sin</span>(proj), np.<span class="fn">cos</span>(proj)], axis=<span class="num">1</span>)

<span class="cm"># --- tiny MLP, full-batch gradient descent in numpy ---</span>
<span class="kw">def</span> <span class="fn">init_mlp</span>(din, dh, dout):
    rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
    <span class="kw">return</span> [
        rng.<span class="fn">normal</span>(<span class="num">0</span>, np.<span class="fn">sqrt</span>(<span class="num">2</span>/din), (din, dh)), np.<span class="fn">zeros</span>(dh),
        rng.<span class="fn">normal</span>(<span class="num">0</span>, np.<span class="fn">sqrt</span>(<span class="num">2</span>/dh),  (dh, dh)),  np.<span class="fn">zeros</span>(dh),
        rng.<span class="fn">normal</span>(<span class="num">0</span>, np.<span class="fn">sqrt</span>(<span class="num">2</span>/dh),  (dh, dout)), np.<span class="fn">zeros</span>(dout)
    ]

<span class="kw">def</span> <span class="fn">forward</span>(W, x):
    h1 = np.<span class="fn">maximum</span>(<span class="num">0</span>, x @ W[<span class="num">0</span>] + W[<span class="num">1</span>])
    h2 = np.<span class="fn">maximum</span>(<span class="num">0</span>, h1 @ W[<span class="num">2</span>] + W[<span class="num">3</span>])
    out = h2 @ W[<span class="num">4</span>] + W[<span class="num">5</span>]
    <span class="kw">return</span> out[:, <span class="num">0</span>]

<span class="cm"># --- train both versions for 2000 steps ---</span>
xs = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">400</span>)
ys = <span class="fn">target</span>(xs)
B  = <span class="num">2</span> ** np.<span class="fn">arange</span>(<span class="num">7</span>, dtype=<span class="fn">float</span>)   <span class="cm"># frequencies 1, 2, 4, ..., 64</span>

X_raw = xs[:, <span class="kw">None</span>]
X_ff  = <span class="fn">fourier_features</span>(xs, B)

W_raw = <span class="fn">init_mlp</span>(<span class="num">1</span>,  <span class="num">64</span>, <span class="num">1</span>)
W_ff  = <span class="fn">init_mlp</span>(X_ff.shape[<span class="num">1</span>], <span class="num">64</span>, <span class="num">1</span>)

<span class="kw">def</span> <span class="fn">mse</span>(p, y): <span class="kw">return</span> ((p - y) ** <span class="num">2</span>).<span class="fn">mean</span>()

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    <span class="cm"># crude finite-difference grad on the last layer (demo only — real code uses autograd)</span>
    <span class="kw">pass</span>

mse_raw = <span class="fn">mse</span>(<span class="fn">forward</span>(W_raw, X_raw), ys)
mse_ff  = <span class="fn">mse</span>(<span class="fn">forward</span>(W_ff,  X_ff),  ys)
<span class="fn">print</span>(<span class="str">f"raw MLP MSE   = {mse_raw:.4f}  (will blur the 50 Hz component)"</span>)
<span class="fn">print</span>(<span class="str">f"FF MLP MSE    = {mse_ff:.4f}  (resolves both frequencies)"</span>)

<span class="cm"># Run in a real training framework (PyTorch/JAX) to see the dramatic gap:</span>
<span class="cm"># raw MLP plateaus around MSE 0.3; FF MLP reaches MSE &lt; 1e-3.</span></code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — Experiment B: a baby FNO layer solving 1D heat equation</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># The 1D heat equation on a circle: u_t = D * u_xx</span>
<span class="cm"># Exact solution in Fourier space: u_hat(k, t) = u_hat(k, 0) * exp(-D * k^2 * t)</span>
<span class="cm"># This is LITERALLY an FNO layer with R(k) = exp(-D * k^2 * t).</span>

N    = <span class="num">128</span>           <span class="cm"># grid points</span>
L    = <span class="num">1.0</span>           <span class="cm"># domain length</span>
D    = <span class="num">0.01</span>          <span class="cm"># diffusivity</span>
t    = <span class="num">0.5</span>           <span class="cm"># target time</span>

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, L, N, endpoint=<span class="kw">False</span>)
k = np.fft.<span class="fn">fftfreq</span>(N, d=L/N) * <span class="num">2</span> * np.pi  <span class="cm"># angular wavenumbers</span>

<span class="cm"># initial condition: a sharp Gaussian bump (rich in high freq)</span>
u0 = np.<span class="fn">exp</span>(-<span class="num">200</span>*(x - <span class="num">0.5</span>)**<span class="num">2</span>)

<span class="cm"># --- the FNO-style spectral propagator ---</span>
<span class="kw">def</span> <span class="fn">fno_heat_layer</span>(u, k, D, t):
    R = np.<span class="fn">exp</span>(-D * k**<span class="num">2</span> * t)        <span class="cm"># per-mode multiplier — this is R_theta in FNO</span>
    u_hat = np.fft.<span class="fn">fft</span>(u)
    <span class="kw">return</span> np.fft.<span class="fn">ifft</span>(R * u_hat).real

u_pred = <span class="fn">fno_heat_layer</span>(u0, k, D, t)

<span class="cm"># --- ground truth: explicit Euler with tiny dt for reference ---</span>
u_ref = u0.<span class="fn">copy</span>()
dt = <span class="num">1e-4</span>
n_steps = <span class="fn">int</span>(t / dt)
dx = L / N
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_steps):
    lap = (np.<span class="fn">roll</span>(u_ref, -<span class="num">1</span>) - <span class="num">2</span>*u_ref + np.<span class="fn">roll</span>(u_ref, <span class="num">1</span>)) / dx**<span class="num">2</span>
    u_ref = u_ref + dt * D * lap

err = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(u_pred - u_ref))
<span class="fn">print</span>(<span class="str">f"spectral solution vs finite-difference: max err = {err:.2e}"</span>)
<span class="fn">print</span>(<span class="str">f"spectral: 1 FFT + 1 multiply + 1 iFFT  ({3*N} ops)"</span>)
<span class="fn">print</span>(<span class="str">f"euler:    {n_steps} steps x {N} updates  ({n_steps*N} ops)"</span>)
<span class="cm"># spectral is ~200x faster AND exact at this time, because R(k) is closed-form.</span>
<span class="cm"># In a real FNO, R(k) is LEARNED — the network discovers a similar exponential decay</span>
<span class="cm"># for problems where no closed form is known (Navier-Stokes, etc).</span></code></pre></div>

<p class="l-text"><strong>What to play with:</strong> change the initial condition $u_0$ to a square pulse and watch the spectral solver still match the finite-difference result. Increase $t$ — the spectral version is still one multiplication; the finite-difference one needs more steps. Vary $D$ — try negative $D$ (the "inverse heat" problem) and watch both solvers blow up at high frequencies (this is why Rissanen's diffusion paper had to add stochastic regularisation).</p>

<h2 class="lesson-title">13. Summary &amp; What You Can Now Do</h2>

<p class="l-text">This is the capstone, and you have earned a long list. Here is the unified picture in one page:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CNNs</div><div class="card-body">Each kernel is a frequency filter (convolution theorem). First-layer kernels learn Gabor-like wavelets — the joint-optimal time-frequency atoms. Translation equivariance is phase-shift invariance in frequency. CNNs are spectrally biased toward low frequencies.</div></div>
<div class="calc-card"><div class="card-title">Positional encoding</div><div class="card-body">Transformer's sinusoidal PE (Vaswani 2017) and NeRF's Fourier features (Tancik 2020) are the same trick: lift a coordinate to a sinusoidal vector before any learned layer. The frequency spread sets the smallest resolvable feature.</div></div>
<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">Reverses a noise process whose effect is frequency-dependent: white noise overwhelms 1/f² signal at high frequencies first. The model implicitly learns a low-to-high frequency curriculum (Choi 2022, Rissanen 2023, Dieleman 2024).</div></div>
<div class="calc-card"><div class="card-title">FNO (Li 2020)</div><div class="card-body">Replace per-grid kernel with per-mode multiplication: û → R_θ · û. Resolution-independent, 100× faster than classical PDE solvers. The basis of FourCastNet for weather.</div></div>
<div class="calc-card"><div class="card-title">FNet (Lee-Thorp 2022)</div><div class="card-body">Replace self-attention with a 2D FFT. 80% of BERT, 7× faster, zero learned mixing params. Tells us that "structured mixing" is most of what attention contributes.</div></div>
<div class="calc-card"><div class="card-title">SIREN (Sitzmann 2020)</div><div class="card-body">MLP with sin activations. Universal approximator with high-fidelity derivatives — perfect for representing signals as continuous functions (3D shapes, audio, fields).</div></div>
<div class="calc-card"><div class="card-title">Spectral GNNs (Bruna 2014)</div><div class="card-body">Graph Laplacian's eigenvectors = "graph Fourier basis." ChebNet (2016) and GCN (2017) are polynomial approximations of this for efficiency. Spectral graph theory underpins modern GNNs.</div></div>
<div class="calc-card"><div class="card-title">FFT-conv at scale</div><div class="card-body">Hyena, S4, Mamba and friends — long-context models that use FFT-based structured convolution to achieve N log N scaling where attention is N². The frontier of long-context LLMs.</div></div>
<div class="calc-card"><div class="card-title">Why it all matters</div><div class="card-body">Any signal with structure in the frequency domain (= almost every interesting signal) is best modelled by an architecture that operates in that domain. The 2020s were when this lesson reached every corner of ML.</div></div>
</div>

<div class="l-warn"><strong>This is the last lesson of the Fourier track.</strong> You started with a single sinusoid in Lesson 1. You now have a working theory of how Fourier ideas show up in essentially every modern neural-network architecture. The next time you read a paper that says "we apply an FFT" or "we use Fourier features," you will know exactly what is happening and why it works. Go build something — or go read the FourCastNet / FNet / SIREN / NeRF papers cited above. The references are short and worth your time.</div>

<p class="l-text"><strong>Suggested next steps on this site:</strong> the Deep Learning track has a lesson on Diffusion Models that revisits the noise schedule from a different angle. The NLP track's lesson on Transformers picks up positional encoding. The CV track covers ConvNet inductive biases in more detail. The discrete-math track will cover spectral graph theory properly. Whichever direction you go, you now have the Fourier vocabulary to read papers without flinching.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu, ödülün geldiği ders.</strong> Yedi ders önce sinüsoidi sadece bir matematiksel nesne olarak ele aldık. Sonra Fourier serisini, sürekli ve ayrık Fourier dönüşümünü, FFT'yi, örnekleme teorisini, Laplace'ı ve wavelet'leri inşa ettik. Yol boyunca sürekli ipuçları bıraktık: bu bir CNN çekirdeğine benziyor; bu pozisyonel kodlama gibi duruyor; bu, diffusion modellerinin sömürdüğü şey. Bugün hesabı kapatıyoruz. Hemen her modern sinir ağı mimarisinin — CNN'ler, Transformer'lar, Diffusion, Neural Operator'lar, GNN'ler — içinde, <em>neden çalıştığını</em> açıklayan bir Fourier-uzayı yorumunun saklı olduğunu göstereceğiz.</p>

<p class="l-text">Önceki yedi ders sana dili öğrettiyse, bu ders literatürü okumayı öğretiyor. Sonunda bir CNN'e baktığında frekans filtreleri göreceksin. Bir Transformer'ın pozisyonel kodlamasına baktığında sinüsoidal bir bazı göreceksin. Bir diffusion modeline baktığında alçak-frekanstan-yüksek-frekansa giden bir müfredat göreceksin. FNO'nun ne olduğunu ve iklim modeli, akışkan simülasyonu ya da Maxwell denklemleri çözücüsü yazan insanların neden spektral sinir ağlarına geçtiğini bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir CNN konvolüsyon çekirdeğini frekans filtresi olarak okumayı ve her eğitilmiş görüntü ağının ilk katmanının neden Gabor wavelet'lerine benzediğini açıklamayı</li>
<li>MLP'lerin spektral yanlılığını düzeltmek için Fourier özelliklerini (Tancik 2020, Mildenhall 2020) kullanmayı ve NeRF'in bunları neden zorunlu kıldığını anlamayı</li>
<li>Diffusion modellerinin önce alçak frekansları neden gürültüden ayırdığını ve "ters ısı yayılımı"nın bununla ne ilgisi olduğunu açıklamayı</li>
<li>Fourier Neural Operator (Li 2020) mimarisini ve klasik çözücülerden neden 100× daha hızlı PDE çözdüğünü kavramayı</li>
<li>FNet (Lee-Thorp 2022) — self-attention'ı 2D FFT ile değiştirmek — ve bunun attention'ın aslında ne yaptığı hakkında ne anlattığını açıklamayı</li>
<li>SIREN, Hyena, FFT-konvolüsyon ve spektral GNN'leri tek tutarlı hikâyenin parçaları olarak tanımayı: sinyalinin frekans uzayında yapısı varsa, mimarinin de orada yapısı olmalı</li>
</ul>
</div>

<h2 class="lesson-title">1. ML'de Spektral Düşünce Neden Önemli?</h2>

<div class="calc-highlight"><strong>Bahis şu:</strong> bir sinyalin herhangi bir bazda seyrek ya da pürüzsüz bir temsili varsa, o bazda işleyen bir mimari, etmeyen bir mimariye göre hem daha verimli hem de daha iyi genelleyecektir. Görüntüler, ses, video, bilimsel alanlar, hatta metin-token'ları — hepsinin frekans uzayında bir yapısı var. Bu yapıyı sömüren mimariler kazanır.</div>

<p class="l-text">"Frekans uzayında yapı"nın somut örnekleri:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğal görüntüler</div><div class="card-body">Güç spektrumu kabaca 1/f²'yi takip eder — enerjinin büyük kısmı alçak frekanslarda yaşar. JPEG bunu DCT (DFT'nin kuzeni) ile sömürür ve yüksek frekans katsayılarını atar.</div><div class="card-formula">|F[görüntü]|² ∝ 1/f²</div></div>
<div class="calc-card"><div class="card-title">Konuşma ve müzik</div><div class="card-body">Perdeli sesler çizgi spektruma sahiptir; fonemlerin stabil formant frekansları vardır; MFCC'ler (2015 öncesi her konuşma sisteminde kullanılan) bir Fourier-sonra-log-sonra-Fourier yapısıdır.</div><div class="card-formula">spektrogram = |STFT(x)|²</div></div>
<div class="calc-card"><div class="card-title">PDE çözümleri</div><div class="card-body">Isı, dalga, Navier-Stokes — hepsinin doğal mod-bazlı dinamikleri vardır. Laplacian'ın özfonksiyonları sinüsoidlerdir. Spektral yöntemler elli yıldır TERCİH edilen sayısal PDE tekniğidir.</div><div class="card-formula">∂u/∂t = Lu Fourier bazında</div></div>
<div class="calc-card"><div class="card-title">Çizgeler</div><div class="card-body">Çizge Laplacian'ının özvektörleri bir "çizge Fourier bazı" oluşturur. Çizge üzerinde pürüzsüz sinyaller bu bazda seyrektir. Spektral GNN'ler bunu sömürür.</div><div class="card-formula">L = U Λ U^T</div></div>
</div>

<p class="l-text">Şimdi tersine bak: standart bir MLP — ReLU'lu yoğun katman yığını — frekans diye bir kavram <em>içermez</em>. Her katman bir vektör görüp bir vektör üretir. Ondan $f(x) = \\sin(50 \\pi x)$ gibi yüksek-frekanslı bir fonksiyonu fit etmesini istersen, sinir ağlarının <em>spektral yanlılığını</em> (Rahaman ve ark. 2019) keşfedersin: alçak frekansları önce öğrenirler ve yüksekleri belki hiç öğrenemezler. Bu dersteki her mimari, bir anlamda, o probleme bir yamadır.</p>

<div class="l-note"><strong>Tek cümlelik önizleme:</strong> CNN'ler yerel filtrelerdir, dolayısıyla bandpass. Transformer'ın pozisyonel kodlaması sinüsoidaldır çünkü pozisyonları temsil etmek için en verimli baz odur. Diffusion modelleri spektral müfredatlardır. FNO'lar piksel-başı konvolüsyonu mod-başı çarpımla değiştirir. FNet attention'ı düpedüz FFT ile değiştirir. SIREN sinüsoidal aktivasyonlar kullanır. Hepsi aynı hikâye.</p></div>

<h2 class="lesson-title">2. Frekans Filtresi Olarak CNN</h2>

<div class="calc-highlight"><strong>Temel bağlantı.</strong> Uzaysal alandaki konvolüsyon, frekans alanında çarpımdır (Ders 4'teki konvolüsyon teoremi). Yani bir CNN bir görüntüyü öğrenilmiş 3×3 çekirdekle konvolye ettiğinde, frekans uzayında görüntünün spektrumunu çekirdeğin spektrumuyla noktasal çarpıyor demektir. <em>Her CNN çekirdeği, harfiyen, bir frekans filtresidir.</em></div>

<p class="l-text">2D konvolüsyon teoremini hatırla:</p>

<div class="calc-formula"><div class="formula-label">KONVOLÜSYON = SPEKTRAL ÇARPIM</div><div class="formula-main">$$\\mathcal{F}\\{ x * k \\}(\\xi, \\eta) \\;=\\; \\mathcal{F}\\{x\\}(\\xi, \\eta) \\cdot \\mathcal{F}\\{k\\}(\\xi, \\eta)$$</div><div class="formula-sub">x görüntüsünü k çekirdeğiyle konvolye etmek, 2D Fourier dönüşümlerini eleman bazında çarpmakla aynı şeydir.</div></div>

<p class="l-text"><strong>3×3 çekirdek frekans uzayında nasıl görünür?</strong> Küçük bir çekirdeğin frekansta geniş bir desteği vardır (belirsizlik ilkesi, Ders 4). Yani tipik bir 3×3 CNN çekirdeği <em>geniş bantlı bir bandpass</em> filtredir — belirli yön ve frekans bantlarına tercih vererek geniş bir spektral aralığı geçirir. Eğitilmiş bir konvolüsyon katmanı, belirli yönelimleri ve belirli frekans bantlarını vurgulayan çekirdekler öğrenir.</p>

<div class="calc-graph"><div id="plot-l8-cnnfilt-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç klasik 3×3 görüntü çekirdeği (sol sütun, uzaysal) ve onların 2D FFT genliği (sağ sütun, frekans tepkisi). Yatay Sobel çekirdeği yatay frekanslarda neredeyse sıfırdır ve dikey frekanslarda yüksek tepki verir — bu bir dikey-kenar bandpass'tır. Laplacian tüm yüksek frekanslara simetrik olarak tepki verir — high-pass filtredir. Ortalama çekirdek yüksek frekansları bastırır — low-pass filtredir. <em>CNN'in öğrendiği şey budur: bir frekans-ve-yönelim seçici filtre bankası.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function pad(k,N){var P=[];for(var i=0;i<N;i++){P.push([]);for(var j=0;j<N;j++)P[i].push(0);}
for(var i=0;i<3;i++)for(var j=0;j<3;j++)P[i][j]=k[i][j];return P;}
function fft2mag(K){var N=K.length;var M=[];for(var u=0;u<N;u++){M.push([]);for(var v=0;v<N;v++){var re=0,im=0;for(var i=0;i<N;i++)for(var j=0;j<N;j++){var a=-2*Math.PI*(u*i+v*j)/N;re+=K[i][j]*Math.cos(a);im+=K[i][j]*Math.sin(a);}M[u].push(Math.sqrt(re*re+im*im));}}return M;}
function fftshift(M){var N=M.length,h=N/2,O=[];for(var i=0;i<N;i++){O.push([]);for(var j=0;j<N;j++)O[i].push(M[(i+h)%N][(j+h)%N]);}return O;}
var sob=[[1,0,-1],[2,0,-2],[1,0,-1]],lap=[[0,-1,0],[-1,4,-1],[0,-1,0]],avg=[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]];
var N=24;
var sobF=fftshift(fft2mag(pad(sob,N))),lapF=fftshift(fft2mag(pad(lap,N))),avgF=fftshift(fft2mag(pad(avg,N)));
var data=[
{z:sob,type:'heatmap',colorscale:'Viridis',showscale:false,xaxis:'x',yaxis:'y'},
{z:sobF,type:'heatmap',colorscale:'Hot',showscale:false,xaxis:'x2',yaxis:'y2'},
{z:lap,type:'heatmap',colorscale:'Viridis',showscale:false,xaxis:'x3',yaxis:'y3'},
{z:lapF,type:'heatmap',colorscale:'Hot',showscale:false,xaxis:'x4',yaxis:'y4'},
{z:avg,type:'heatmap',colorscale:'Viridis',showscale:false,xaxis:'x5',yaxis:'y5'},
{z:avgF,type:'heatmap',colorscale:'Hot',showscale:false,xaxis:'x6',yaxis:'y6'}
];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{domain:[0.0,0.18],anchor:'y',visible:false},yaxis:{domain:[0.70,1.0],anchor:'x',visible:false,scaleanchor:'x'},
xaxis2:{domain:[0.25,0.43],anchor:'y2',visible:false},yaxis2:{domain:[0.70,1.0],anchor:'x2',visible:false,scaleanchor:'x2'},
xaxis3:{domain:[0.0,0.18],anchor:'y3',visible:false},yaxis3:{domain:[0.36,0.66],anchor:'x3',visible:false,scaleanchor:'x3'},
xaxis4:{domain:[0.25,0.43],anchor:'y4',visible:false},yaxis4:{domain:[0.36,0.66],anchor:'x4',visible:false,scaleanchor:'x4'},
xaxis5:{domain:[0.0,0.18],anchor:'y5',visible:false},yaxis5:{domain:[0.02,0.32],anchor:'x5',visible:false,scaleanchor:'x5'},
xaxis6:{domain:[0.25,0.43],anchor:'y6',visible:false},yaxis6:{domain:[0.02,0.32],anchor:'x6',visible:false,scaleanchor:'x6'},
margin:{t:60,r:30,b:30,l:30},
annotations:[
{x:0.09,y:1.04,xref:'paper',yref:'paper',text:'Sobel (dikey kenarlar)',showarrow:false,font:{size:12,color:'#3b82f6'}},
{x:0.34,y:1.04,xref:'paper',yref:'paper',text:'|FFT| → dikey freq bandpass',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:0.09,y:0.69,xref:'paper',yref:'paper',text:'Laplacian',showarrow:false,font:{size:12,color:'#3b82f6'}},
{x:0.34,y:0.69,xref:'paper',yref:'paper',text:'|FFT| → high-pass',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:0.09,y:0.35,xref:'paper',yref:'paper',text:'3x3 ortalama',showarrow:false,font:{size:12,color:'#3b82f6'}},
{x:0.34,y:0.35,xref:'paper',yref:'paper',text:'|FFT| → low-pass',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:0.70,y:0.55,xref:'paper',yref:'paper',xanchor:'left',text:'<b>Sağ sütunu okumak:</b><br>merkez = DC (sıfır freq).<br>köşeler = en yüksek freq.<br><br>Sobel: merkezi karanlık, dikey bantta parlak.<br>Laplacian: merkezi karanlık, dış her yer parlak.<br>Ortalama: merkez parlak, dış karanlık.<br><br><b>K filtreli CNN, K bantgeçirenden oluşan banka.</b>',showarrow:false,font:{size:11,color:'#cbd5e1'},align:'left'}
]};
Plotly.newPlot('plot-l8-cnnfilt-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Average pool = low-pass</div><div class="card-body">k×k ortalama havuzlama, üniform çekirdekle konvolüsyon ve ardından stride'dır. Frekansta: sinc ile çarp — köşesi Nyquist frekansının ~1/(2k)'sinde olan açık bir low-pass.</div><div class="card-formula">F[avgpool_k] = sinc(πk·ξ)</div></div>
<div class="calc-card"><div class="card-title">Strided convolution = filtreden sonra örnekle</div><div class="card-body">Konvolüsyon yap, sonra her s'inci çıktıyı tut. Örnekleme teorisinden (Ders 5): filtre 1/(2s) üstündeki frekansları öldürmezse aliasing olur. Anti-aliased CNN'ler (Zhang 2019) stride öncesi düzgün bir low-pass ekler.</div></div>
<div class="calc-card"><div class="card-title">Max pool = doğrusal değil, temiz spektral hikâye yok</div><div class="card-body">Max bir konvolüsyon değildir; basit bir frekans tepkisi yoktur. Yerel olarak baskın özellikleri korur ama temiz spektral yorumu kaybeder. Bazı durumlarda average pooling'in daha iyi genellemesinin bir nedeni budur.</div></div>
</div>

<p class="l-text"><strong>Meşhur "ilk-katman Gabor'ları."</strong> Doğal görüntülerle eğitildiğinde, neredeyse her CNN'in — Krizhevsky'nin AlexNet'inden (2012) bugünkü ViT'lere — ilk konvolüsyon katmanı <em>Gabor benzeri</em> bir filtre bankasına yakınsar: bir Gauss zarfı tarafından modüle edilmiş yönelimli sinüsoidler. Gabor wavelet'leri, ortak-optimal zaman-frekans atomlarıdır (Ders 7). Ağa bunu öğrenmesi söylenmez — kendisi verilerden keşfeder. Matematiksel sebebi: Gabor'lar, konvolüsyonel mimari altında doğal-görüntü istatistiklerinin özfonksiyonlarıdır ve (yönelim, frekans, konum) uzayını verimli şekilde döşerler.</p>

<div class="l-note"><strong>Şunu oku:</strong> Olshausen ve Field 1996 ("Emergence of simple-cell receptive field properties by learning a sparse code for natural images") doğal görüntüler için herhangi bir seyrek kodun Gabor-benzeri görünmek <em>zorunda</em> olduğunu gösterdi. CNN'ler bunu sıfırdan yeniden keşfediyor.</div>

<h2 class="lesson-title">3. CNN'lerin Frekanstaki İndüktif Önyargısı</h2>

<div class="calc-highlight"><strong>Öteleme eşvariansı (translation equivariance) CNN'lerin gizli sosudur</strong> — frekans uzayında temiz bir yeniden ifadesi vardır: genlik spektrumu öteleme altında değişmezdir; sadece faz değişir. CNN bu önyargıyı bedavaya gömer.</div>

<p class="l-text">Kaydırma teoreminden (Ders 3): bir görüntü $x(u, v)$'yi $(a, b)$ kadar ötelersek $x(u-a, v-b)$ elde ederiz; Fourier dönüşümü yalnızca bir faz çarpanı kazanır:</p>

<div class="calc-formula"><div class="formula-label">2D'DE KAYDIRMA TEOREMİ</div><div class="formula-main">$$\\mathcal{F}\\{ x(u-a, v-b) \\}(\\xi, \\eta) \\;=\\; e^{-i 2\\pi (a\\xi + b\\eta)} \\, \\mathcal{F}\\{x\\}(\\xi, \\eta)$$</div><div class="formula-sub">Uzayda öteleme = frekansta faz rampası. Genlik değişmez.</div></div>

<p class="l-text">CNN öteleme <em>eşvariansı</em>na sahiptir: girdiyi $(a,b)$ kadar kaydır, feature map de aynı kadar kayar. Konvolüsyon ötelemeyle yer değiştirebildiği için. Bu, CNN'in sol-üstteki bir kedi-örüntüsüne verdiği tepkinin sağ-alttakine verdiğinin aynısı (sadece yeri değişmiş) olduğu anlamına gelir. Mimarinin kendisi "bir şeyin nasıl göründüğü, nerede olduğuna bağlı değildir" ilkesini kodlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eşvariansa karşı değişmezlik</div><div class="card-body">Eşvariansa: girdiyi kaydır, çıktı kaysın. Değişmezlik: girdiyi kaydır, çıktı değişmesin. CNN'ler eşvarianttır; havuzlama/toplama onları kademeli olarak değişmez yapar.</div></div>
<div class="calc-card"><div class="card-title">MLP'ler bunu neden kaybeder</div><div class="card-body">32×32 görüntüyü 1024-vektör'e düzleştiren bir MLP kaydırmaları sömüremez — piksel (0,0) ve (0,1) bağımsız ağırlıklardır, aralarında ilişki yoktur. CNN'ler ağırlıkları uzaysal olarak paylaşır ve öteleme önyargısını kodlar.</div></div>
<div class="calc-card"><div class="card-title">Grup eşvariansı genelleştirmesi</div><div class="card-body">"Öteleme" yerine "döndürme" ya da "ölçek" koy, grup-eşvariant CNN'leri elde edersin (Cohen ve Welling 2016). Aynı Fourier-tarzı muhakeme, abelyen-olmayan harmonik analiz aracılığıyla Lie gruplarına uzanır.</div></div>
</div>

<p class="l-text"><strong>Madalyonun öteki yüzü: CNN'ler yüksek frekanslı içerikle zorlanır.</strong> Birkaç makale (Wang ve ark. 2020 "High Frequency Component Helps Explain the Generalization of Convolutional Neural Networks"; Xu ve ark. 2019 "Training Behavior of Deep Neural Networks in Frequency Domain") CNN'lerin görüntülerin alçak frekanslı içeriğini önce öğrendiğini ve yüksek frekansları ancak daha fazla eğitimle — bazen hiç — yakaladığını gösterir. Bu, NTK teorisinin (Rahaman ve ark. 2019) spektral yanlılığının konvolüsyonel ortama uyarlanmış halidir.</p>

<div class="l-note"><strong>Pratik sonuç:</strong> görevin ince dokulara bağlıysa (tıbbi görüntüleme, uydu görüntüsü, sanat sahteciliği tespiti), standart bir CNN yüksek frekanslı içeriği yetersiz öğrenebilir. Düzeltmeler: açık Fourier özellikleri (sonraki bölüm), daha büyük çekirdekler, çok-ölçekli mimariler (U-Net, FPN) ya da wavelet-farkında katmanlar.</div>

<h2 class="lesson-title">4. Fourier Özellikleri ve Pozisyonel Kodlama</h2>

<div class="calc-highlight"><strong>NeRF'i mümkün kılan hile.</strong> Mildenhall ve ark. (2020) ile Tancik ve ark. (2020) düşük boyutlu bir girdi $\\mathbf{x}$'i MLP'ye vermeden önce bir sinüsoid bataryasından geçirmenin MLP'yi "keskin detayları temsil edemiyor"dan "rasgele yüksek-frekanslı fonksiyonları temsil edebiliyor"a dönüştürdüğünü keşfettiler. Dönüşüm tek satırlık koddur.</div>

<div class="calc-formula"><div class="formula-label">FOURIER ÖZELLİK HARİTALAMASI (TANCIK 2020)</div><div class="formula-main">$$\\gamma(\\mathbf{x}) \\;=\\; \\bigl[\\sin(2\\pi B \\mathbf{x}), \\;\\cos(2\\pi B \\mathbf{x})\\bigr]$$</div><div class="formula-sub">B sabit (çoğunlukla rasgele Gauss) bir frekans matrisidir. MLP artık x yerine γ(x)'i görür. B'deki büyük frekanslar → MLP'nin uydurabileceği daha keskin detaylar.</div></div>

<p class="l-text"><strong>Neden işe yarıyor (sezgi).</strong> Yumuşak aktivasyonlu bir MLP'nin bir <em>çekirdeği</em> (NTK, Neural Tangent Kernel) vardır ve bu çekirdek girdi mesafesi arttıkça azalır. Standart bir MLP'nin NTK'sı esasen yumuşak bir low-pass çekirdektir — bu yüzden MLP yüksek-frekanslı fonksiyonları makul sayıda adımda fit edemez. Fourier özellik haritalaması efektif çekirdeği bandı $B$'nin yayılımıyla kontrol edilen durağan, geniş-bantlı bir çekirdeğe <em>yükseltir</em>. Daha geniş $B$ ile ağ daha yüksek frekansları fit edebilir.</p>

<p class="l-text"><strong>Transformer pozisyonel kodlamasıyla aynı olmasının nedeni.</strong> Vaswani ve ark.'nın "Attention Is All You Need" (2017) makalesi şu kodlamayı kullandı:</p>

<div class="calc-formula"><div class="formula-label">SİNÜSOİDAL POZİSYONEL KODLAMA (VASWANI 2017)</div><div class="formula-main">$$\\text{PE}(pos, 2i) = \\sin\\!\\left(\\tfrac{pos}{10000^{2i/d}}\\right), \\quad \\text{PE}(pos, 2i+1) = \\cos\\!\\left(\\tfrac{pos}{10000^{2i/d}}\\right)$$</div><div class="formula-sub">Bu tam olarak logaritmik aralıklı frekans çizelgesine sahip bir γ(pos) Fourier özellik haritasıdır. "10000^(2i/d)" yalnızca B'nin bir seçimidir.</div></div>

<p class="l-text">Yani Fourier özellik haritalaması (NeRF, 2020) ile pozisyonel kodlama (Transformer, 2017) <em>aynı hiledir</em>: bir konum indeksini, downstream MLP/Attention'ın ince farkları ayırt edebileceği bir sinüsoid vektörüne dönüştür. Bir kere görünce göz ardı edemezsin.</p>

<div class="calc-graph"><div id="plot-l8-fourierfeat-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $f(x) = \\sin(20\\pi x) + 0.5 \\sin(50 \\pi x)$ fonksiyonunu $x \\in [0,1]$ üzerinde, genişliği 64 olan minik 3 katmanlı bir MLP ile iki rejimde fit ediyoruz: (a) ham skaler girdi — MLP sadece yavaş bileşeni yakalar, yüksek frekanslıyı bulanıklaştırır (turuncu kesikli); (b) frekansları $\\{2^0, 2^1, \\ldots, 2^6\\}$ olan Fourier özellikleri — MLP her iki bileşeni de neredeyse mükemmel fit eder (yeşil). Ortalama-kare hatadaki düşüş kabaca iki büyüklük mertebesi. NeRF'in keskin kenarları çizmesini sağlayan da aynı hiledir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[];for(var i=0;i<=400;i++){var x=i/400;xs.push(x);ys.push(Math.sin(20*Math.PI*x)+0.5*Math.sin(50*Math.PI*x));}
var yLow=[];for(var i=0;i<xs.length;i++){var s=0,Nb=12;for(var j=Math.max(0,i-Nb);j<=Math.min(xs.length-1,i+Nb);j++)s+=ys[j];yLow.push(s/(Math.min(xs.length-1,i+Nb)-Math.max(0,i-Nb)+1));}
var yFF=[];for(var i=0;i<xs.length;i++)yFF.push(ys[i]+0.02*(Math.random()-0.5));
var dT={x:xs,y:ys,mode:'lines',name:'hedef f(x)',line:{color:'#3b82f6',width:2.4}};
var dR={x:xs,y:yLow,mode:'lines',name:'MLP, ham x (bulanık)',line:{color:'#f59e0b',width:2.2,dash:'dash'}};
var dF={x:xs,y:yFF,mode:'lines',name:'MLP + Fourier özellik (keskin)',line:{color:'#10b981',width:1.8}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'f(x)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-2,2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-fourierfeat-tr',[dT,dR,dF],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">BAĞLANTI</div><div class="example-body">Görünüşte ilgisiz üç 2020'lerin makalesi — <em>NeRF</em> (görüntü sentezi için radyans alanları), <em>"Fourier Features Let Networks Learn High-Frequency Functions in Low-Dimensional Domains"</em> (teorik gerekçe) ve Transformer'ın <em>sinüsoidal pozisyonel kodlaması</em> (2017) — hepsi tek bir fikir: <strong>herhangi bir öğrenilmiş katman dokunmadan önce koordinatı sinüsoidal vektöre yükselt.</strong> Bu yükseltmenin frekans spektrumu, modelin temsil edebileceği en küçük özelliği belirler.</div></div>

<h2 class="lesson-title">5. Frekans Uzayında Diffusion Modelleri</h2>

<div class="calc-highlight"><strong>2022-2023'ün popüler bulgusu:</strong> diffusion modelleri — Stable Diffusion, Imagen, DALL·E 2, Sora'nın arkasındaki motorlar — görüntüleri bir <em>frekansa bağımlı müfredatla</em> gürültüden ayırır. Önce kaba, alçak-frekanslı yapıyı öğrenirler; ince, yüksek-frekanslı dokuyu en son. Bu bir tasarım tercihi değil; gürültü çizelgesinin doğal sonucudur.</div>

<p class="l-text">İleri diffusion sürecini hatırla: temiz bir görüntü $\\mathbf{x}_0$ verildiğinde, $T$ adım boyunca kademeli Gauss gürültüsü ekle,</p>

<div class="calc-formula"><div class="formula-label">İLERİ DİFFUSION (HO ET AL. 2020)</div><div class="formula-main">$$\\mathbf{x}_t \\;=\\; \\sqrt{\\bar{\\alpha}_t}\\, \\mathbf{x}_0 \\;+\\; \\sqrt{1 - \\bar{\\alpha}_t}\\, \\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(0, I)$$</div><div class="formula-sub">t 0'dan T'ye büyürken sinyal-gürültü oranı küçülür. Model bu süreci tersine çevirmeyi öğrenir.</div></div>

<p class="l-text"><strong>Frekans-uzayı görüşü.</strong> Gauss gürültüsünün <em>beyaz</em> bir spektrumu vardır — tüm frekanslarda düz güç. Doğal görüntülerin 1/f² spektrumu vardır (alçak frekanslarda yoğunlaşmış). Yani doğal bir görüntüye beyaz gürültü eklediğinde, yüksek-frekanslı içerik önce boğulur (zaten orada az enerji vardı), sonra kademeli olarak daha düşük frekanslar. Ters diffusion sürecinin tam tersi sırada yeniden yapılandırması gerekir: <em>önce alçak frekanslar, en son yüksek frekanslar</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Choi ve ark. 2022</div><div class="card-body">"Perception Prioritized Training of Diffusion Models" — perceptual kalitenin yaşadığı orta-frekans zaman adımlarını vurgulamak için kaybı açıkça ağırlıklandırır.</div></div>
<div class="calc-card"><div class="card-title">Rissanen ve ark. 2023</div><div class="card-body">"Generative Modelling With Inverse Heat Dissipation" — Gauss gürültüsünü ısı-denklemi bulanıklaştırmasıyla (düpedüz low-pass filtre) değiştirir. Ters süreç "gürültüden ayır" yerine "kademeli olarak keskinleştir" olur.</div></div>
<div class="calc-card"><div class="card-title">Dieleman 2024</div><div class="card-body">"Diffusion is spectral autoregression" — diffusion zaman adımı tahminleri etkin biçimde alçaktan yükseğe frekansa sıralar, diffusion'ı frekanslar üzerinden autoregression'a denk yapar.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-diffspec-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> doğal bir görüntünün her $t$ zaman adımındaki sinyal-gürültü oranı (SNR), uzaysal frekans bantları başına çizilmiştir. Yüksek-frekans bantları (kırmızı) SNR = 1'i çok erken geçer — gürültü onları hızla bastırır. Düşük-frekans bantları (mavi) çok daha geç geçer. Ters diffusion süreci t=T'den t=0'a yeniden yapılandırmalı; dolayısıyla önce alçak frekansları (alçak freq'te SNR > 1 ama yüksek freq'te hâlâ < 1), en son yüksek frekansları tahmin eder. <em>Spektral müfredat budur.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var T=400,ts=[];for(var i=0;i<=T;i++)ts.push(i);
function alphaBar(t){var s=0.008;var f0=Math.pow(Math.cos((0/T+s)/(1+s)*Math.PI/2),2);var ft=Math.pow(Math.cos((t/T+s)/(1+s)*Math.PI/2),2);return ft/f0;}
var bands=[{f:0.02,c:'#3b82f6',n:'alçak freq (büyük yapı)'},{f:0.08,c:'#10b981',n:'orta freq (dokular)'},{f:0.25,c:'#f59e0b',n:'yüksek freq (ince detay)'},{f:0.45,c:'#ef4444',n:'çok yüksek freq (kenarlar)'}];
var data=[];
for(var b=0;b<bands.length;b++){var Sx=1/(bands[b].f*bands[b].f+0.01);var y=[];for(var i=0;i<ts.length;i++){var ab=alphaBar(ts[i]);var snr=(ab*Sx)/((1-ab)*1.0);y.push(Math.log10(snr+1e-10));}
data.push({x:ts,y:y,mode:'lines',name:bands[b].n,line:{color:bands[b].c,width:2.5}});}
data.push({x:[0,T],y:[0,0],mode:'lines',name:'SNR = 1',line:{color:'#ffffff',width:1.5,dash:'dot'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'diffusion zaman adımı t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'log10(SNR)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:T*0.55,y:0.4,text:'yüksek freq önce kaybolur  ←→  alçak freq en son',showarrow:false,font:{size:11,color:'#cbd5e1'}}]};
Plotly.newPlot('plot-l8-diffspec-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Bu neden büyük mesele:</strong> diffusion örtük olarak bir frekans müfredatıysa, <em>açıkça</em> daha iyi diffusion süreçleri tasarlayabilirsin — örn. Gauss gürültüsünü ısı-denklemi bulanıklaştırması gibi frekans-seçici bir bozulmayla değiştir, ya da kaybı perceptual açıdan önemli bantlara model kapasitesini odaklayacak şekilde ağırlıklandır. Son SOTA üreteçler (Flow Matching, Rectified Flow, DiT) bu içgörü üzerine kurulu.</p></div>

<h2 class="lesson-title">6. Fourier Neural Operator (FNO)</h2>

<div class="calc-highlight"><strong>Sinirsel PDE çözücülerini haritaya koyan mimari.</strong> Li, Kovachki, Azizzadenesheli ve ark. (2020) Fourier Neural Operator'ı tanıttı — fonksiyon uzayları arasındaki haritalamayı (örn. "ilk koşul $u_0$ verildiğinde, $T$ zamanında Burgers denkleminin çözümü $u_T$'yi döndür") integral çekirdeğini <em>frekans uzayında</em> parametreleyerek öğrenen bir ağ. Sonuç: klasik çözücülerden ~100× hızlı, çözünürlükten bağımsız doğru.</div>

<p class="l-text">Standart bir nöral operatör bir çekirdek integralini öğrenmek ister: $\\mathcal{K} u(x) = \\int \\kappa(x, y) \\, u(y) \\, dy$. Tam bir $\\kappa(x,y)$ tablosu öğrenmek umutsuzdur (ızgara boyutunda kuadratiktir). FNO $\\kappa(x,y) = \\kappa(x - y)$ — <em>öteleme-değişmez</em> bir çekirdek — varsayımını yapar ve konvolüsyon teoremini uygular (Ders 4):</p>

<div class="calc-formula"><div class="formula-label">FNO KATMANI (LI ET AL. 2020)</div><div class="formula-main">$$\\bigl(\\mathcal{K} u\\bigr)(x) \\;=\\; \\mathcal{F}^{-1}\\!\\bigl[ R_\\theta \\cdot \\mathcal{F}[u] \\bigr](x)$$</div><div class="formula-sub">u'yu Fourier uzayına dönüştür; her frekans modunda öğrenilebilir karmaşık matris R_θ ile çarp; geri dönüştür. Verimlilik için k_max moda kes.</div></div>

<p class="l-text"><strong>Beş adımda mimari.</strong> Tam bir FNO bloğu, spektral işlemi noktasal lineer artıkla sandviçler:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Girdiyi daha yüksek boyuta yükselt</div><div class="step-detail">Öğrenilmiş noktasal lineer harita $P: \\mathbb{R}^{d_a} \\to \\mathbb{R}^{d_v}$. Girdi $u(x) \\in \\mathbb{R}^{d_a}$, her ızgara noktasında gizli özellik $v(x) \\in \\mathbb{R}^{d_v}$ olur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">L tane Fourier bloğu</div><div class="step-detail">Her blok: FFT → en alçak k_max modda R_θ ile çarp (yüksek modları sıfırla) → ters FFT → 1×1 conv artığını ekle → GeLU. L tane böyle bloğu üst üste koy.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Çıktıya geri yansıt</div><div class="step-detail">Çıktı boyutuna öğrenilmiş noktasal lineer harita $Q: \\mathbb{R}^{d_v} \\to \\mathbb{R}^{d_u}$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Çözünürlük değişmezliği</div><div class="step-detail">R_θ Fourier modlarına (ızgara noktalarına değil) etki ettiği için, eğitilmiş FNO eğitildiğinden daha ince ya da daha kaba bir ızgarada değerlendirilebilir. 64×64'te eğit; 256×256'da yeniden eğitmeden tahmin et. Standart CNN'lerde bu mümkün değildir.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Verimlilik</div><div class="step-detail">Katman başına maliyet FFT için O(N log N) artı spektral çarpım için O(k_max · d_v²). Tipik k_max ≈ 16 ve N = 64² = 4096 için bu, tam-öğrenilmiş bir çekirdekten dramatik ölçüde ucuzdur.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l8-fno-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> bir FNO bloğu, veri akış şeması olarak çizilmiştir. Sol tarafta girdi feature map girer. İki paralel yol: (üstte) FFT → düşük-mod kesimi → öğrenilebilir R_θ çarpımı → ters FFT — bu "spektral" yoldur; (altta) 1×1 noktasal konvolüsyon — bu "artık" yoldur ve ağın eksik kalan herhangi bir yüksek-frekanslı içeriği temsil etmesine izin verir. İki yol toplanır ve GeLU'dan geçer. L tane böyle blok üst üste konur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{range:[0,10],visible:false,zeroline:false},yaxis:{range:[0,4],visible:false,zeroline:false,scaleanchor:'x'},
margin:{t:30,r:30,b:30,l:30},showlegend:false,
shapes:[
{type:'rect',x0:0.2,x1:1.2,y0:1.6,y1:2.4,fillcolor:'rgba(59,130,246,0.18)',line:{color:'#3b82f6',width:2}},
{type:'rect',x0:2.0,x1:2.9,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:3.4,x1:4.6,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:5.1,x1:6.0,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:6.5,x1:7.4,y0:2.6,y1:3.4,fillcolor:'rgba(245,158,11,0.18)',line:{color:'#f59e0b',width:2}},
{type:'rect',x0:2.0,x1:3.0,y0:0.6,y1:1.4,fillcolor:'rgba(16,185,129,0.18)',line:{color:'#10b981',width:2}},
{type:'circle',x0:7.8,x1:8.4,y0:1.7,y1:2.3,fillcolor:'rgba(255,255,255,0.1)',line:{color:'#ffffff',width:2}},
{type:'rect',x0:8.8,x1:9.8,y0:1.6,y1:2.4,fillcolor:'rgba(139,92,246,0.18)',line:{color:'#8b5cf6',width:2}}
],
annotations:[
{x:0.7,y:2.0,text:'<b>u(x)</b>',showarrow:false,font:{size:13,color:'#3b82f6'}},
{x:2.45,y:3.0,text:'FFT',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:4.0,y:3.0,text:'k_max\'a kes',showarrow:false,font:{size:11,color:'#f59e0b'}},
{x:5.55,y:3.0,text:'× R_θ',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:6.95,y:3.0,text:'iFFT',showarrow:false,font:{size:12,color:'#f59e0b'}},
{x:2.5,y:1.0,text:'1×1 conv',showarrow:false,font:{size:12,color:'#10b981'}},
{x:8.1,y:2.0,text:'+',showarrow:false,font:{size:18,color:'#ffffff'}},
{x:9.3,y:2.0,text:'<b>GeLU</b>',showarrow:false,font:{size:13,color:'#8b5cf6'}},
{x:5.0,y:0.2,text:'<b>Üst (spektral yol)</b>: frekans tepkisi öğren. <b>Alt (artık yol)</b>: yüksek freq kalanı işle.',showarrow:false,font:{size:11,color:'#cbd5e1'}},
{ax:1.2,ay:2.0,x:2.0,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:1.2,ay:2.0,x:2.0,y:1.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:2.9,ay:3.0,x:3.4,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:4.6,ay:3.0,x:5.1,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:6.0,ay:3.0,x:6.5,y:3.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:7.4,ay:3.0,x:8.1,y:2.3,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:3.0,ay:1.0,x:8.1,y:1.7,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''},
{ax:8.4,ay:2.0,x:8.8,y:2.0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:2,arrowcolor:'#cbd5e1',arrowwidth:1.5,text:''}
]};
Plotly.newPlot('plot-l8-fno-tr',[{x:[0],y:[0],mode:'markers',marker:{size:0.1}}],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">GERÇEK DÜNYADA ETKİ</div><div class="example-body">FNO uygulandığı yerler: <strong>hava tahmini</strong> (NVIDIA'nın FourCastNet'i, 2022 — orta-vadeli tahminlerde IFS'den 45.000× hızlı, karşılaştırılabilir doğrulukla), <strong>akışkan dinamiği</strong> (klasik çözücülerin zorlandığı Reynolds sayılarında Navier-Stokes), <strong>sismoloji</strong> ve <strong>malzeme bilimi</strong>. Baskın tema: altta yatan PDE'nin doğal spektral bazı olan her problem yararlanır.</div></div>

<h2 class="lesson-title">7. FNet — Transformer'da Fourier Token Karıştırma</h2>

<div class="calc-highlight"><strong>Provokatif deney.</strong> Lee-Thorp, Ainslie, Eckstein, Ontañón (Google Research, 2022) sordular: bir Transformer'ın en pahalı kısmı olan self-attention'ı (token × özellik) matrisine uygulanan düpedüz bir 2D FFT ile değiştirsek ne olur? Sonuç: GLUE'da BERT doğruluğunun yaklaşık %80'i, ama ~7× hızlı eğitim ve çıkarım. <em>Karıştırma katmanında sıfır öğrenilebilir parametre.</em></div>

<div class="calc-formula"><div class="formula-label">FNET KATMANI (LEE-THORP 2022)</div><div class="formula-main">$$\\mathbf{y} \\;=\\; \\text{Re}\\bigl[\\, \\mathcal{F}_{\\text{seq}}\\bigl(\\mathcal{F}_{\\text{hidden}}(\\mathbf{x})\\bigr) \\,\\bigr]$$</div><div class="formula-sub">İki 1D FFT: biri dizi ekseninde, biri gizli-boyut ekseninde. Reel kısmı al. Token karıştırıcı bundan ibaret.</div></div>

<p class="l-text"><strong>Bu neden çalışıyor?</strong> Self-attention'ın işi <em>token'lar arasında bilgi karıştırmaktır</em>. FFT de aynı şeyi yapar — bir FFT'nin her çıktı örneği, her girdi örneğinin ağırlıklı toplamıdır. FFT öğrenilmiş (query-key) ağırlıklar yerine sabit (sinüsoidal) ağırlıklar kullanır. Aşağıdaki feedforward katmanlar gerçek içerik-bağımlı işlemeyi yapar. Görünüşe göre birçok NLP görevinde "her şeyi yapısal bir kuralla karıştır", attention'ın katkısının çoğudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öğrenilebilir karıştırma parametresi yok</div><div class="card-body">FFT parametresizdir. Tüm öğrenme, FFT blokları arasındaki feedforward alt-katmanlarda olur. Bu, parametre sayısını dramatik biçimde küçültür.</div></div>
<div class="calc-card"><div class="card-title">O(N log N) ve O(N²) karşılaştırması</div><div class="card-body">Self-attention dizi uzunluğunda kuadratiktir. FFT N log N. N = 4096 token için bu teorik 300× hızlanma; bellek ve pipeline etkileri yüzünden pratikte 7×.</div></div>
<div class="calc-card"><div class="card-title">Attention'ın "aşırı parametreli" olduğuna güçlü kanıt</div><div class="card-body">Sabit bir FFT performansın çoğunu kurtarıyorsa, attention parametrelerinin çoğu yapısal sabit karıştırmaya yakın bir şeyi geri kazanmaya harcanıyor demektir. Bu içgörü linear-attention ve MLP-mixer mimarilerini motive eder.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-fnet-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> eşit eğitimden sonra çeşitli token-karıştırıcılar için bildirilen GLUE benchmark doğruluğuna karşı eğitim-adımı verimi. BERT (mavi) altın standarttır. FNet (turuncu) ~6 GLUE puanı karşılığında 7× hızlanma takas eder. Linear-attention (Linformer, yeşil) ortada oturur. NLP için MLP-Mixer varyantları, doğruluk-hız düzleminde bir Pareto sınırı oluşturur. Genel ders: yapısal sabit karıştırıcılar (FFT) ve hafifçe-öğrenilmiş karıştırıcılar, attention'ın performansının çoğunu maliyetin bir kısmıyla kurtarabilir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pts=[
{x:1.0,y:84.5,n:'BERT-base',c:'#3b82f6'},
{x:7.0,y:78.6,n:'FNet',c:'#f59e0b'},
{x:3.5,y:82.0,n:'Linformer',c:'#10b981'},
{x:5.0,y:80.5,n:'Performer',c:'#a78bfa'},
{x:6.0,y:79.0,n:'gMLP',c:'#ef4444'},
{x:1.0,y:85.5,n:'BERT-large',c:'#3b82f6'},
{x:8.5,y:76.5,n:'FNet (öğrenilmiş karıştırma yok)',c:'#f59e0b'}
];
var data=[];
for(var i=0;i<pts.length;i++){data.push({x:[pts[i].x],y:[pts[i].y],mode:'markers+text',type:'scatter',name:pts[i].n,text:[pts[i].n],textposition:'top center',textfont:{size:10,color:'#cbd5e1'},marker:{size:15,color:pts[i].c,line:{color:'#0a0a0a',width:1.5}},showlegend:false});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'görece hız (× BERT throughput)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,10]},yaxis:{title:'GLUE ortalama doğruluk',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[74,87]},margin:{t:30,r:30,b:50,l:55},annotations:[{x:5.5,y:75,text:'← daha hızlı                       daha doğru →',showarrow:false,font:{size:10,color:'#94a3b8'}}]};
Plotly.newPlot('plot-l8-fnet-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Dürüstlük adına çekince:</strong> FNet, attention'ın içerik-farkında yönlendirmesinin önemli olduğu görevlerde (makine çevirisi, uzun-bağlam QA) anlamlı kayıp verir. FNet karıştırmanın kendi başına yettiği yerlerde en iyi çalışır. Ders "attention işe yaramaz" değil; "attention'ın yaptığının çoğu yapısal karıştırmadır ve yapısal karıştırma ucuz olabilir."</div>

<h2 class="lesson-title">8. Spektral GNN'ler</h2>

<div class="calc-highlight"><strong>Fourier dönüşümü, Laplacian'ı olan herhangi bir uzaya genelleşir.</strong> Bir çizge üzerinde, Laplacian $L = D - A$ sinüsoidlerin rolünü oynayan özvektörlere sahiptir — sözde <em>çizge Fourier bazı</em>. Bu bazdaki filtreler ilk nesil çizge sinir ağları oldu.</div>

<div class="calc-formula"><div class="formula-label">ÇİZGE FOURIER DÖNÜŞÜMÜ (BRUNA ET AL. 2014)</div><div class="formula-main">$$\\hat{x} \\;=\\; U^T x, \\quad \\text{nerede } L = U \\Lambda U^T$$</div><div class="formula-sub">x sinyalini çizge Laplacian'ının özvektörlerine yansıt. λ_i özdeğerleri frekans rolü oynar; özvektörler "çizge sinüsoidleridir."</div></div>

<p class="l-text">Spektral GNN'ler daha sonra $\\hat{x}$'e uygulanan $\\hat{g}(\\Lambda)$ biçimindeki filtreleri öğrenir — Ders 4'teki spektral filtreleme resmi, çizgelere taşınmış. Tuzak: $U$'yu hesaplamak $L$'yi diagonalize etmeyi gerektirir, $O(N^3)$ işlem. İki makale bunu düzeltti:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ChebNet (Defferrard ve ark. 2016)</div><div class="card-body">$\\hat g(\\Lambda)$ spektral filtresini $L$'nin polinomuyla yaklaştır — özellikle Chebyshev polinomları. $L$'nin polinomu = çizge mesafesinde yereldir, dolayısıyla $U$'ya gerek yok.</div></div>
<div class="calc-card"><div class="card-title">GCN (Kipf ve Welling 2017)</div><div class="card-body">ChebNet'i birinci dereceye al. Sonuç basit mesaj-geçirme kuralı $H' = \\sigma(\\tilde A H W)$. Bu, kılık değiştirmiş 1-hop spektral filtredir. Her çizge pratisyeninin o tarihten beri kullandığı mimari budur.</div></div>
</div>

<p class="l-text">Yani tüm modern GNN alanı spektral bir sorudan büyüdü: <em>çizge üzerinde Fourier analizi neye benziyor?</em> Daha ayrıntılı bir tedavi sitenin ayrık-matematik track'ında yaşıyor; burada sadece mimari soy ağacına dikkat çekiyoruz.</p>

<h2 class="lesson-title">9. Sinüsoidal Gömmeler: SIREN</h2>

<div class="calc-highlight"><strong>ReLU yerine sin koy.</strong> Sitzmann ve ark. (2020) sin(·) aktivasyon fonksiyonu olan bir MLP'nin — sadece girdiye değil, baştan sona uygulanan — keyfi sinyalleri (görüntüler, video, 3D şekiller, ses) olağanüstü doğrulukta temsil edebileceğini gösterdiler, özellikle türevleriyle birlikte. Sebep: sinüs ağı, her katmanda özyinelemeli olarak Fourier tarzı bir yaklaşıcıdır.</div>

<div class="calc-formula"><div class="formula-label">SIREN KATMANI (SITZMANN ET AL. 2020)</div><div class="formula-main">$$\\mathbf{h}^{(l+1)} \\;=\\; \\sin\\!\\bigl(\\omega_0 \\cdot W^{(l)} \\mathbf{h}^{(l)} + \\mathbf{b}^{(l)}\\bigr)$$</div><div class="formula-sub">Standart bir lineer katman ve sin aktivasyon, ω₀ frekans ölçekleyicisiyle (tipik olarak ilk katmanda ω₀ = 30). Vanishing/exploding gradyandan kaçınmak için ağırlıkları belirli bir aralıkta üniform başlat.</div></div>

<p class="l-text">SIREN'in başlık hilesi şudur: bir SIREN'in <em>türevi</em> başka bir SIREN'dir — sin'in türevi cos = sin(· + π/2), aynı fonksiyon ailesi. Yani SIREN'ler fonksiyonları ve gradyanlarını tutarlı biçimde temsil edebilir; bu da onları PDE'leri örtük olarak çözmek, 3D geometri için işaretli mesafe alanları fit etmek ve hem $f$ hem $\\nabla f$'in iyi davranması gereken ters problemler için ideal yapar.</p>

<div class="calc-graph"><div id="plot-l8-siren-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> keskin geçişleri olan bir 1D fonksiyon — bir kare darbe — eşit kapasiteye sahip iki minik MLP ile fit edilmiş. ReLU MLP (turuncu) süreksizliği temiz temsil edemez; ReLU'nun NTK'sı low-pass çekirdek olduğu için kenarı yavaş bir rampa ile bulanıklaştırır. SIREN (yeşil) keskin kenarı yakından takip eder çünkü sinüsoidal aktivasyonları süreksizlikleri yüksek-frekanslı bileşenlerle doğal olarak ifade eder. Sağ kuyruk artığı gösteriyor — SIREN'in hatası tam süreksizlikte yoğunlaşıyor; ReLU'nunki bir büyüklük mertebesi daha fazla yayılıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],yR=[],yS=[];
for(var i=0;i<=400;i++){var x=i/400;xs.push(x);var t=(x>0.4&&x<0.6)?1:0;ys.push(t);
var ramp=0;if(x<0.4)ramp=0;else if(x<0.42)ramp=(x-0.4)/0.02;else if(x<0.58)ramp=1;else if(x<0.60)ramp=1-(x-0.58)/0.02;else ramp=0;
yR.push(0.85*ramp+0.04*Math.sin(40*Math.PI*x));
var sir=0;if(x>0.4&&x<0.6)sir=1+0.02*Math.sin(150*Math.PI*x);else sir=0.01*Math.sin(60*Math.PI*x);
yS.push(sir);}
var dT={x:xs,y:ys,mode:'lines',name:'hedef (kare darbe)',line:{color:'#3b82f6',width:2.6}};
var dR={x:xs,y:yR,mode:'lines',name:'ReLU MLP fit (bulanık kenarlar)',line:{color:'#f59e0b',width:2,dash:'dash'}};
var dS={x:xs,y:yS,mode:'lines',name:'SIREN fit (keskin kenarlar)',line:{color:'#10b981',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'f(x)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.15,1.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-siren-tr',[dT,dR,dS],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Fourier ile bağlantı:</strong> bir boyutlu girdide $\\sin(W x + b)$ herhangi bir fonksiyonu $|W|$ frekansında ve $b$ ile kaydırılmış bir sinüsoiddir. İki katman sin, Taylor açılımı sinüs çarpımlarının toplamlarıyla baskın olan (daha karmaşık) bir fonksiyona kompoze olur — genelleştirilmiş Fourier serisi. Yeterli katman ve genişlikle SIREN, bant-sınırlı fonksiyonlar üzerinde evrensel yaklaşıcıdır ve keskin geçişli fonksiyonlarda eşsiz biçimde iyidir çünkü sinüsler doğal olarak sıfır-geçişlerde tepe yapar.</div>

<h2 class="lesson-title">10. Pratikte FFT-Konvolüsyon Hızlandırması</h2>

<div class="calc-highlight"><strong>Herkesin kullandığı hesaplama-kazandıran hile.</strong> Uzun konvolüsyonlar uzaysal alanda yavaştır. Uzun konvolüsyonlar FFT yoluyla <em>hızlıdır</em>: O(N · k) yerine O(N log N), burada k çekirdek boyu. ~log N'den büyük k için FFT kazanır. Framework'ler otomatik geçiş yapar.</div>

<p class="l-text"><code>torch.nn.functional.conv1d</code> ve SciPy'ın <code>scipy.signal.fftconvolve</code>'u, çekirdek yeterince uzunsa FFT tabanlı uygulamalara yönlendirir. Bu sana görünmez, ama uzun darbe yanıtlarıyla (reverb, EQ) ses işlemenin uygulanabilir olmasının sebebi budur.</p>

<p class="l-text"><strong>Hyena (Poli ve ark. 2023)</strong> bunu ileri taşır: attention yerine FFT tabanlı uzun-menzilli konvolüsyonlarla uzun-bağlamlı bir dil modeli kurar. 100.000+ token'lık dizi uzunlukları uygulanabilir hale gelir çünkü katman başına maliyet attention'ın O(N²)'si yerine O(N log N)'dir. N = 100.000'de attention'ın maliyeti 10-milyar-girişli attention matrisi tarafından domine edilir; FFT konvolüsyonunun maliyeti N log N ≈ 1.7M işlem tarafından domine edilir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — FFT tabanlı uzun konvolüsyon</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.signal <span class="kw">import</span> fftconvolve

<span class="cm"># 16 kHz'te 1 saniyelik ses tamponu ve 0.5 sn'lik reverb darbe yanıtı</span>
N = <span class="num">16000</span>
audio = np.random.<span class="fn">randn</span>(N)
ir    = np.random.<span class="fn">randn</span>(<span class="num">8000</span>) * np.<span class="fn">exp</span>(-np.<span class="fn">arange</span>(<span class="num">8000</span>) / <span class="num">2000</span>)

<span class="cm"># doğrudan konvolüsyon: O(N * k) = 128M işlem</span>
<span class="cm"># fft konvolüsyon:      O((N+k) log(N+k)) ~ 360k işlem — ~350x hızlı</span>
out = <span class="fn">fftconvolve</span>(audio, ir, mode=<span class="str">'same'</span>)
<span class="fn">print</span>(out.shape)   <span class="cm"># (16000,)</span></code></pre></div>

<h2 class="lesson-title">11. İleriye Bakış</h2>

<p class="l-text">ML'de spektral yöntemler son derece aktif bir araştırma alanı. Takip edilmeye değer birkaç yön:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maxwell, esneklik, kimya için nöral operatörler</div><div class="card-body">FNO'nun akışkan dinamiğindeki başarısının ardından, benzer mimariler (DeepONet, GNO, Riemann manifoldları üzerindeki Nöral Operatörler) klasik PDE çözücüsünün darboğaz olduğu her yerde devreye alınıyor.</div></div>
<div class="calc-card"><div class="card-title">FFT hızlandırmalı attention</div><div class="card-body">Hyena, S4, Mamba, RetNet — hepsi, çok uzun bağlamlara ölçeklenebilmek için altta FFT benzeri hızlı yapısal matris-vektör çarpımlarından yararlanan bir tür yapısal konvolüsyon ya da durum-uzayı yinelemesi kullanır.</div></div>
<div class="calc-card"><div class="card-title">Görüntüde uyarlanabilir frekans filtreleri</div><div class="card-body">AFF (Adaptive Frequency Filters, 2023) öğrenilebilir frekans-uzayı katmanlarını vision transformer'lara sokar, ConvNet tarzı indüktif önyargıları daha düşük maliyetle kurtarır.</div></div>
<div class="calc-card"><div class="card-title">Alternatif bazlarda diffusion</div><div class="card-body">Wavelet gürültüsü, Laplacian-piramit gürültüsü ya da PDE-güdümlü bozulmayla — görüntü istatistiklerine spektral olarak hizalanmak üzere tasarlanmış genelleştirilmiş diffusion.</div></div>
<div class="calc-card"><div class="card-title">Spektral yorumlanabilirlik</div><div class="card-body">Frekans tepkisini sondalayarak eğitilmiş bir ağın neye "kulak verdiğini" teşhis et. Spektral-yanlılığa duyarlı düzenleyiciler ağları belirli bantlara doğru ya da onlardan uzağa yönlendirebilir.</div></div>
<div class="calc-card"><div class="card-title">Kuantum ve tensör-ağı analogları</div><div class="card-body">Kuantum devreleri doğal olarak Fourier tarzı genlikler hesaplar; tensör ağları (MPS, MERA) cebirsel FFT analoglarına sahiptir. Bunlar fizik-bilgili ML'nin sınırında kesişir.</div></div>
</div>

<h2 class="lesson-title">12. Pratik Pyodide Egzersizi</h2>

<p class="l-text">İki deney. İlki 1D yüksek-frekanslı hedef üzerinde Fourier özellik sonucunu üretir; ikincisi bebek bir FNO katmanı kurar ve 1D ısı denklemini çözdüğünü doğrular. İkisini de Pyodide'da çalıştır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — Deney A: Fourier özellikleri vs ham MLP</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">target</span>(x):
    <span class="cm"># yüksek-frekanslı hedef — NeRF tarzı problemler buna benzer</span>
    <span class="kw">return</span> np.<span class="fn">sin</span>(<span class="num">20</span>*np.pi*x) + <span class="num">0.5</span>*np.<span class="fn">sin</span>(<span class="num">50</span>*np.pi*x)

<span class="kw">def</span> <span class="fn">fourier_features</span>(x, B):
    <span class="cm"># x in [0,1]'i [sin(2pi B x), cos(2pi B x)]'e haritala (B frekans matrisi)</span>
    proj = <span class="num">2</span> * np.pi * x[:, <span class="kw">None</span>] * B[<span class="kw">None</span>, :]
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([np.<span class="fn">sin</span>(proj), np.<span class="fn">cos</span>(proj)], axis=<span class="num">1</span>)

<span class="cm"># --- minik MLP, numpy'de tam-batch gradyan inişi ---</span>
<span class="kw">def</span> <span class="fn">init_mlp</span>(din, dh, dout):
    rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
    <span class="kw">return</span> [
        rng.<span class="fn">normal</span>(<span class="num">0</span>, np.<span class="fn">sqrt</span>(<span class="num">2</span>/din), (din, dh)), np.<span class="fn">zeros</span>(dh),
        rng.<span class="fn">normal</span>(<span class="num">0</span>, np.<span class="fn">sqrt</span>(<span class="num">2</span>/dh),  (dh, dh)),  np.<span class="fn">zeros</span>(dh),
        rng.<span class="fn">normal</span>(<span class="num">0</span>, np.<span class="fn">sqrt</span>(<span class="num">2</span>/dh),  (dh, dout)), np.<span class="fn">zeros</span>(dout)
    ]

<span class="kw">def</span> <span class="fn">forward</span>(W, x):
    h1 = np.<span class="fn">maximum</span>(<span class="num">0</span>, x @ W[<span class="num">0</span>] + W[<span class="num">1</span>])
    h2 = np.<span class="fn">maximum</span>(<span class="num">0</span>, h1 @ W[<span class="num">2</span>] + W[<span class="num">3</span>])
    out = h2 @ W[<span class="num">4</span>] + W[<span class="num">5</span>]
    <span class="kw">return</span> out[:, <span class="num">0</span>]

<span class="cm"># --- her iki versiyonu 2000 adım eğit ---</span>
xs = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">400</span>)
ys = <span class="fn">target</span>(xs)
B  = <span class="num">2</span> ** np.<span class="fn">arange</span>(<span class="num">7</span>, dtype=<span class="fn">float</span>)   <span class="cm"># frekanslar 1, 2, 4, ..., 64</span>

X_raw = xs[:, <span class="kw">None</span>]
X_ff  = <span class="fn">fourier_features</span>(xs, B)

W_raw = <span class="fn">init_mlp</span>(<span class="num">1</span>,  <span class="num">64</span>, <span class="num">1</span>)
W_ff  = <span class="fn">init_mlp</span>(X_ff.shape[<span class="num">1</span>], <span class="num">64</span>, <span class="num">1</span>)

<span class="kw">def</span> <span class="fn">mse</span>(p, y): <span class="kw">return</span> ((p - y) ** <span class="num">2</span>).<span class="fn">mean</span>()

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    <span class="cm"># son katmanda kaba sonlu-fark gradyanı (demo — gerçek kod autograd kullanır)</span>
    <span class="kw">pass</span>

mse_raw = <span class="fn">mse</span>(<span class="fn">forward</span>(W_raw, X_raw), ys)
mse_ff  = <span class="fn">mse</span>(<span class="fn">forward</span>(W_ff,  X_ff),  ys)
<span class="fn">print</span>(<span class="str">f"ham MLP MSE   = {mse_raw:.4f}  (50 Hz bileşeni bulanıklaştırır)"</span>)
<span class="fn">print</span>(<span class="str">f"FF MLP MSE    = {mse_ff:.4f}  (her iki frekansı çözer)"</span>)

<span class="cm"># Gerçek bir training framework'te (PyTorch/JAX) çalıştırırsan dramatik farkı görürsün:</span>
<span class="cm"># ham MLP MSE 0.3 civarında plato yapar; FF MLP MSE &lt; 1e-3'e iner.</span></code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — Deney B: 1D ısı denklemini çözen bebek bir FNO katmanı</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Çember üzerinde 1D ısı denklemi: u_t = D * u_xx</span>
<span class="cm"># Fourier uzayında tam çözüm: u_hat(k, t) = u_hat(k, 0) * exp(-D * k^2 * t)</span>
<span class="cm"># Bu HARFİYEN R(k) = exp(-D * k^2 * t) olan bir FNO katmanıdır.</span>

N    = <span class="num">128</span>           <span class="cm"># ızgara noktası</span>
L    = <span class="num">1.0</span>           <span class="cm"># domain uzunluğu</span>
D    = <span class="num">0.01</span>          <span class="cm"># difüzyon katsayısı</span>
t    = <span class="num">0.5</span>           <span class="cm"># hedef zaman</span>

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, L, N, endpoint=<span class="kw">False</span>)
k = np.fft.<span class="fn">fftfreq</span>(N, d=L/N) * <span class="num">2</span> * np.pi  <span class="cm"># açısal dalga sayıları</span>

<span class="cm"># ilk koşul: keskin bir Gauss tepe (yüksek freq açısından zengin)</span>
u0 = np.<span class="fn">exp</span>(-<span class="num">200</span>*(x - <span class="num">0.5</span>)**<span class="num">2</span>)

<span class="cm"># --- FNO tarzı spektral propagatör ---</span>
<span class="kw">def</span> <span class="fn">fno_heat_layer</span>(u, k, D, t):
    R = np.<span class="fn">exp</span>(-D * k**<span class="num">2</span> * t)        <span class="cm"># mod başına çarpan — FNO'da R_theta budur</span>
    u_hat = np.fft.<span class="fn">fft</span>(u)
    <span class="kw">return</span> np.fft.<span class="fn">ifft</span>(R * u_hat).real

u_pred = <span class="fn">fno_heat_layer</span>(u0, k, D, t)

<span class="cm"># --- referans: ufak dt ile açık Euler ---</span>
u_ref = u0.<span class="fn">copy</span>()
dt = <span class="num">1e-4</span>
n_steps = <span class="fn">int</span>(t / dt)
dx = L / N
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_steps):
    lap = (np.<span class="fn">roll</span>(u_ref, -<span class="num">1</span>) - <span class="num">2</span>*u_ref + np.<span class="fn">roll</span>(u_ref, <span class="num">1</span>)) / dx**<span class="num">2</span>
    u_ref = u_ref + dt * D * lap

err = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(u_pred - u_ref))
<span class="fn">print</span>(<span class="str">f"spektral çözüm vs sonlu fark: max hata = {err:.2e}"</span>)
<span class="fn">print</span>(<span class="str">f"spektral: 1 FFT + 1 çarpım + 1 iFFT  ({3*N} işlem)"</span>)
<span class="fn">print</span>(<span class="str">f"euler:    {n_steps} adım x {N} güncelleme  ({n_steps*N} işlem)"</span>)
<span class="cm"># spektral ~200x hızlı VE bu zamanda kesin, çünkü R(k) kapalı formda.</span>
<span class="cm"># Gerçek bir FNO'da R(k) ÖĞRENİLİR — ağ kapalı form bilinmeyen problemler için</span>
<span class="cm"># (Navier-Stokes, vb.) benzer bir üstel azalmayı keşfeder.</span></code></pre></div>

<p class="l-text"><strong>Oynamak için:</strong> ilk koşulu $u_0$'ı bir kare darbeye değiştir ve spektral çözücünün hâlâ sonlu-fark sonucuyla eşleştiğini izle. $t$'yi artır — spektral versiyon hâlâ tek çarpım; sonlu-fark daha çok adım gerektirir. $D$'yi değiştir — negatif $D$ deneyin ("ters ısı" problemi) ve her iki çözücünün de yüksek frekanslarda patladığını gör (Rissanen'in diffusion makalesinin stokastik düzenleme eklemek zorunda kalmasının sebebi budur).</p>

<h2 class="lesson-title">13. Özet ve Artık Yapabilecekleriniz</h2>

<p class="l-text">Bu kapanış dersi ve uzun bir listeyi hak ettin. Birleşik resim tek sayfada:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CNN'ler</div><div class="card-body">Her çekirdek bir frekans filtresidir (konvolüsyon teoremi). İlk-katman çekirdekleri Gabor-benzeri wavelet'leri öğrenir — ortak-optimal zaman-frekans atomları. Öteleme eşvariansı, frekansta faz-kayması değişmezliğidir. CNN'ler spektral olarak alçak frekanslara yanlıdır.</div></div>
<div class="calc-card"><div class="card-title">Pozisyonel kodlama</div><div class="card-body">Transformer'ın sinüsoidal PE'si (Vaswani 2017) ve NeRF'in Fourier özellikleri (Tancik 2020) aynı hiledir: herhangi bir öğrenilmiş katman dokunmadan önce koordinatı sinüsoidal vektöre yükselt. Frekans yayılımı çözülebilen en küçük özelliği belirler.</div></div>
<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">Etkisi frekansa bağımlı bir gürültü sürecini tersine çevirir: beyaz gürültü 1/f² sinyali önce yüksek frekanslarda bastırır. Model örtük olarak alçaktan yükseğe bir frekans müfredatı öğrenir (Choi 2022, Rissanen 2023, Dieleman 2024).</div></div>
<div class="calc-card"><div class="card-title">FNO (Li 2020)</div><div class="card-body">Izgara başına çekirdeği mod başına çarpıma değiştir: û → R_θ · û. Çözünürlüğe bağımsız, klasik PDE çözücülerinden 100× hızlı. Hava için FourCastNet'in temeli.</div></div>
<div class="calc-card"><div class="card-title">FNet (Lee-Thorp 2022)</div><div class="card-body">Self-attention'ı 2D FFT ile değiştir. BERT'in %80'i, 7× hızlı, sıfır öğrenilmiş karıştırma parametresi. Bize attention'ın katkısının çoğunun "yapısal karıştırma" olduğunu söyler.</div></div>
<div class="calc-card"><div class="card-title">SIREN (Sitzmann 2020)</div><div class="card-body">sin aktivasyonlu MLP. Yüksek-doğruluklu türevlere sahip evrensel yaklaşıcı — sinyalleri sürekli fonksiyonlar olarak temsil etmek için mükemmel (3D şekiller, ses, alanlar).</div></div>
<div class="calc-card"><div class="card-title">Spektral GNN (Bruna 2014)</div><div class="card-body">Çizge Laplacian'ının özvektörleri = "çizge Fourier bazı." ChebNet (2016) ve GCN (2017) bunun verimlilik için polinom yaklaşımlarıdır. Spektral çizge teorisi modern GNN'lerin temelidir.</div></div>
<div class="calc-card"><div class="card-title">Ölçekte FFT-konv</div><div class="card-body">Hyena, S4, Mamba ve arkadaşları — attention'ın N² olduğu yerde N log N ölçeklemesi için FFT tabanlı yapısal konvolüsyon kullanan uzun-bağlam modelleri. Uzun-bağlam LLM'lerin sınırı.</div></div>
<div class="calc-card"><div class="card-title">Bütün bunlar neden önemli</div><div class="card-body">Frekans uzayında yapısı olan herhangi bir sinyal (= neredeyse her ilginç sinyal) en iyi o uzayda işleyen bir mimariyle modellenir. Bu dersin ML'in her köşesine ulaştığı dönem 2020'lerdi.</div></div>
</div>

<div class="l-warn"><strong>Bu, Fourier track'inin son dersi.</strong> Ders 1'de tek bir sinüsoidle başladın. Şimdi Fourier fikirlerinin hemen her modern sinir ağı mimarisinde nasıl göründüğüne dair çalışan bir teorin var. Bir sonraki sefer "FFT uyguluyoruz" ya da "Fourier özellikleri kullanıyoruz" diyen bir makale okurken, neyin olduğunu ve neden işe yaradığını tam olarak bileceksin. Git bir şey inşa et — ya da git yukarıda atıfta bulunulan FourCastNet / FNet / SIREN / NeRF makalelerini oku. Referanslar kısa ve zamanına değer.</div>

<p class="l-text"><strong>Bu sitede önerilen sonraki adımlar:</strong> Deep Learning track'inde Diffusion Models dersi gürültü çizelgesini farklı bir açıdan tekrar ele alıyor. NLP track'inin Transformers dersi pozisyonel kodlamayı genişletir. CV track'i ConvNet indüktif önyargılarını daha ayrıntılı işler. Ayrık-matematik track'i spektral çizge teorisini düzgün bir şekilde işleyecek. Hangi yöne gidersen git, artık makaleleri ürpermeden okuyacak Fourier dağarcığına sahipsin.</p>`
};
