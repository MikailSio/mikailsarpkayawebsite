window.LINALG_L7 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text"><strong>Every number that lives inside a neural network is a lie.</strong> The 32-bit IEEE 754 floats that PyTorch hands to your <code>nn.Linear</code>, the 16-bit half-precision values that travel through NVIDIA Tensor Cores, the bfloat16 activations that flow through a Google TPU — none of them are real numbers. They are quantised approximations chosen by a 1985 committee at IEEE, and the entire edifice of modern deep learning rests on knowing exactly when those approximations bite and how to defuse them. NaN losses, mysterious training divergences, gradients that quietly underflow to zero, exploding activations in the last layer of a Transformer — every one of these failures has its root in floating-point arithmetic.</p>

<p class="l-text">This lesson cracks open IEEE 754 and the three numeric formats that dominate modern ML: <strong>float32</strong> (the safe default), <strong>float16</strong> (the speedy but fragile half), and <strong>bfloat16</strong> (Google Brain's wider, calmer cousin). We build up the bit layouts by hand, walk through catastrophic cancellation with a worked example, contrast stable and unstable least-squares algorithms, derive the log-sum-exp trick that keeps every softmax in the world from overflowing, and finally arrive at the engineering masterpiece that is mixed-precision training — loss scaling, master weights, AMP, the recipe NVIDIA Apex turned into PyTorch <code>torch.amp</code>. By the end you will read a NaN trace the way a doctor reads an X-ray.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read the IEEE 754 bit layout for float32, float16, and bfloat16, and convert between bit patterns and real values by hand</li>
<li>Identify the three concrete numerical pathologies — catastrophic cancellation, overflow, underflow — from their algebraic signatures</li>
<li>Pick the stable algorithm: QR or SVD over normal equations, log-sum-exp over naive softmax, Kahan summation when it matters</li>
<li>Compute the condition number of a linear system and predict how many digits of precision a solver will lose</li>
<li>Derive the log-sum-exp identity and the numerically stable softmax/cross-entropy used in every deep learning library</li>
<li>Apply mixed-precision training with loss scaling and a float32 master copy of weights, and explain why bfloat16 changes the recipe</li>
<li>Diagnose NaN and Inf in a training loop — find the offending op, fix it with eps, clipping, or a precision change</li>
</ul>
</div>

<h2 class="lesson-title">1. The Problem: Real Numbers Don't Fit in Computers</h2>

<p class="l-text">A real number can have infinitely many digits. A 32-bit register has exactly $2^{32} \\approx 4.3 \\times 10^9$ states. There is no way to fit even the integers from $0$ to $10^{10}$ into 32 bits, let alone the full continuum of reals. Any computer representation of "real numbers" is a finite set of carefully chosen approximations, and every arithmetic operation rounds the true answer to the nearest representable value. Most of the time you get lucky and the rounding error is invisible. Occasionally it is catastrophic.</p>

<div class="calc-highlight"><strong>Big idea:</strong> Floating-point is scientific notation in binary. A floating-point number stores a sign, a power-of-two exponent, and a small fixed-width mantissa. This buys you a huge dynamic range (you can represent $10^{-40}$ and $10^{+40}$ in the same format) at the cost of constant relative error: every operation can be off by roughly one part in $2^p$ where $p$ is the mantissa bit-width.</div>

<p class="l-text">The official rules — how many bits, in what order, with what special values — are set by IEEE 754, originally ratified in 1985 and updated in 2008. Every CPU, GPU, and TPU you have ever used implements some flavour of IEEE 754 (or a near-cousin like NVIDIA's bfloat16). Understanding the bit layout is not optional for a modern ML engineer: knowing the difference between float16 and bfloat16 is the difference between "loss goes to NaN at step 200" and "model trains cleanly to convergence."</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sign bit</div><div class="card-body">A single bit: $0$ for non-negative, $1$ for negative. Both $+0$ and $-0$ exist as distinct bit patterns but compare equal under <code>==</code>.</div></div>
<div class="calc-card"><div class="card-title">Exponent</div><div class="card-body">A biased integer encoding the power of two. For float32 the bias is $127$, so a stored exponent of $130$ means $2^{130 - 127} = 2^3 = 8$. Controls dynamic range.</div></div>
<div class="calc-card"><div class="card-title">Mantissa (significand)</div><div class="card-body">The fraction $1.xxxxx$ in binary, with the leading $1$ implicit. The width controls precision: $23$ bits in float32, $10$ in float16, $7$ in bfloat16.</div></div>
<div class="calc-card"><div class="card-title">Special values</div><div class="card-body">$+\\infty$, $-\\infty$, NaN (not a number), subnormals (very tiny numbers near zero). All have reserved exponent patterns and dedicated arithmetic rules.</div></div>
</div>

<h2 class="lesson-title">2. IEEE 754 Float32 — Bit by Bit</h2>

<p class="l-text">Single-precision float32 is what NumPy gives you by default, what neural network frameworks store weights in unless you ask for something else, and what virtually every scientific computation uses as its "trustworthy" baseline. The bit layout is:</p>

<div class="calc-formula"><div class="formula-label">FLOAT32 LAYOUT (32 BITS TOTAL)</div><div class="formula-main">$$\\underbrace{s}_{1\\text{ bit}} \\,\\underbrace{e_7 e_6 \\cdots e_0}_{8\\text{ exponent bits}}\\, \\underbrace{m_{22} m_{21} \\cdots m_0}_{23\\text{ mantissa bits}}$$ $$x \\;=\\; (-1)^s \\cdot 2^{E - 127} \\cdot \\left(1 + \\sum_{i=0}^{22} m_i \\cdot 2^{i - 23}\\right)$$</div><div class="formula-sub">$E$ is the unsigned integer formed by the 8 exponent bits. The $-127$ bias shifts the representable range so that exponents from $-126$ to $+127$ are storable. The leading $1$ in the mantissa is implicit — only the fractional part is encoded.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dynamic range</div><div class="card-body">From $\\sim 1.18 \\times 10^{-38}$ (smallest normal positive) to $\\sim 3.4 \\times 10^{+38}$ (largest finite). Eighty orders of magnitude — enormous.</div></div>
<div class="calc-card"><div class="card-title">Machine epsilon</div><div class="card-body">$\\varepsilon = 2^{-23} \\approx 1.19 \\times 10^{-7}$. The smallest $\\varepsilon$ such that $1 + \\varepsilon \\neq 1$ in float32. About 7 decimal digits of precision.</div></div>
<div class="calc-card"><div class="card-title">Subnormals</div><div class="card-body">When the exponent is the special value $0$, the implicit leading $1$ becomes $0$. This gradually loses precision but extends representable range down to $\\sim 1.4 \\times 10^{-45}$.</div></div>
<div class="calc-card"><div class="card-title">Memory footprint</div><div class="card-body">4 bytes per value. A 7B-parameter LLM weight matrix needs $28$ GB in float32 — comfortably exceeds most consumer GPUs. The pressure to shrink is real.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: DECODING A FLOAT32</div><div class="example-body">The bit pattern <code>0 10000010 01001000000000000000000</code> means: $s = 0$ (positive); $E = (10000010)_2 = 130$ so the exponent is $130 - 127 = 3$; the mantissa is $1.01001000\\ldots = 1 + 1/4 + 1/32 = 1.28125$. Therefore $x = +1 \\cdot 2^3 \\cdot 1.28125 = 10.25$. Run it the other way: $10.25 = 1.28125 \\cdot 2^3$; encode $1.28125$ as $1.01001\\ldots$, encode $3$ as $130 = 10000010$; reconstruct the bit pattern. This is the only "hard" calculation in the whole topic and it is purely mechanical.</div></div>

<p class="l-text">Pretty much every floating-point operation is defined as: compute the mathematically exact result, then round to the nearest float32 representable value (ties-to-even). The rounding error is bounded by $\\varepsilon / 2$ in relative terms. So a single multiplication is essentially "the right answer plus or minus seven digits." That sounds harmless, and most of the time it is. The trouble starts when you do enough operations that the small relative errors stop being independent and start aligning.</p>

<h2 class="lesson-title">2.5 IEEE 754 Float Formats Visually</h2>

<p class="l-text">Before going deeper, let's see how the three modern ML formats compare on a single dynamic-range chart. The contrast between float16 and bfloat16 is the single most important fact in mixed-precision training: same memory footprint, completely different failure modes.</p>

<div id="plot-linalg-l7-float-range-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var formats=['float32','float16','bfloat16','float8 (e4m3)','int8'];
var minVals=[1.18e-38,6.1e-5,1.18e-38,1.5e-3,1];
var maxVals=[3.4e38,6.55e4,3.4e38,4.48e2,127];
var precBits=[23,10,7,3,0];
var ranges=maxVals.map(function(v,i){return Math.log10(v/minVals[i]);});
var t1={x:formats,y:ranges,type:'bar',name:'log10(max/min) — dynamic range',marker:{color:'#3b82f6'},text:ranges.map(function(v){return v.toFixed(1)+' decades';}),textposition:'auto',textfont:{color:'#ffffff'}};
var t2={x:formats,y:precBits,type:'bar',name:'mantissa bits — precision',marker:{color:'#f59e0b'},yaxis:'y2',text:precBits.map(function(v){return v+' bits';}),textposition:'auto',textfont:{color:'#ffffff'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'format',gridcolor:'#1f2937'},yaxis:{title:'dynamic range (decades, log10)',gridcolor:'#1f2937',side:'left'},yaxis2:{title:'mantissa bits',side:'right',overlaying:'y',gridcolor:'#1f2937',range:[0,25]},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:60,b:50,l:60},barmode:'group'};
Plotly.newPlot('plot-linalg-l7-float-range-en',[t1,t2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> two competing axes of float-format design. The blue bars (left axis) are dynamic range in decades of magnitude — how far apart the smallest and largest representable numbers are. Float32, bfloat16, and float8 all span roughly the same enormous range because they share an 8-bit exponent. Float16 dramatically loses ground here: only $\\sim 9$ decades, so very small gradients underflow to zero and very large activations overflow to $\\infty$. The orange bars (right axis) are mantissa bits, the proxy for <em>precision</em>. Float32 wins decisively at 23 bits, bfloat16 trades half its precision for float32's range, and float8/int8 are aggressive quantisation formats reserved for inference and now-experimental training.</div></div>

<h2 class="lesson-title">3. Float16 vs BFloat16 — The Modern ML Story</h2>

<p class="l-text">In 2017, NVIDIA Volta GPUs shipped the first Tensor Cores: hardware units that multiplied $4\\times 4$ matrices of float16 values 8 times faster than float32. The economic pressure was immediate — train at half precision and you halve memory, double throughput, and run on the same dollars worth of silicon. But float16 alone is brittle: small gradients underflow, and the techniques to compensate (loss scaling, master weights) became standard practice. Then Google Brain shipped TPUs that used a different 16-bit format — <strong>bfloat16</strong> — chosen to dodge those very pitfalls. Today's frontier models train almost exclusively in bfloat16 or with even more aggressive mixed strategies.</p>

<div class="calc-formula"><div class="formula-label">FLOAT16 (HALF-PRECISION, IEEE 754 BINARY16)</div><div class="formula-main">$$\\underbrace{s}_{1} \\,\\underbrace{e_4 \\cdots e_0}_{5\\text{ exp}}\\, \\underbrace{m_9 \\cdots m_0}_{10\\text{ mant}} \\qquad x = (-1)^s \\cdot 2^{E - 15} \\cdot (1 + m/2^{10})$$</div><div class="formula-sub">5-bit exponent, 10-bit mantissa. Range $\\approx \\pm 65{,}504$. Machine epsilon $\\approx 9.77 \\times 10^{-4}$. Smallest normal positive $\\approx 6.1 \\times 10^{-5}$. About 3 decimal digits of precision.</div></div>

<div class="calc-formula"><div class="formula-label">BFLOAT16 (BRAIN FLOATING POINT)</div><div class="formula-main">$$\\underbrace{s}_{1} \\,\\underbrace{e_7 \\cdots e_0}_{8\\text{ exp}}\\, \\underbrace{m_6 \\cdots m_0}_{7\\text{ mant}} \\qquad x = (-1)^s \\cdot 2^{E - 127} \\cdot (1 + m/2^{7})$$</div><div class="formula-sub">8-bit exponent (same as float32!), 7-bit mantissa. Range identical to float32: $\\sim \\pm 3.4 \\times 10^{38}$. Machine epsilon $\\approx 7.8 \\times 10^{-3}$. About 2 decimal digits of precision. Designed by Google Brain specifically so the upper half of a float32 can be cast to bfloat16 by simply truncating — no exponent re-biasing.</div></div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">FLOAT16 (IEEE binary16)</div><div class="compare-item">• 1 + 5 + 10 bits</div><div class="compare-item">• Range $\\pm 6.55 \\times 10^4$ — narrow</div><div class="compare-item">• Eps $\\sim 10^{-3}$ — more precision than bf16</div><div class="compare-item">• 10-bit mantissa = 3 decimal digits</div><div class="compare-item">• Small gradients underflow easily</div><div class="compare-item">• Needs loss scaling for training</div><div class="compare-item">• Original hardware: NVIDIA Volta/Ampere Tensor Cores</div></div>
<div class="compare-col"><div class="compare-title">BFLOAT16 (Google Brain)</div><div class="compare-item">• 1 + 8 + 7 bits</div><div class="compare-item">• Range $\\pm 3.4 \\times 10^{38}$ — same as float32</div><div class="compare-item">• Eps $\\sim 10^{-2}$ — coarser precision</div><div class="compare-item">• 7-bit mantissa = 2 decimal digits</div><div class="compare-item">• No underflow or overflow in practice</div><div class="compare-item">• No loss scaling needed</div><div class="compare-item">• Hardware: TPU, A100/H100, MI300, Apple Neural Engine</div></div>
</div>

<p class="l-text"><strong>The deep insight:</strong> for deep learning, dynamic range matters more than precision. A neural network is robust to a couple of decimal digits of noise per activation — the model is averaging across millions of weights anyway. But a single underflowed gradient ($g = 10^{-8}$ rounded to $0$ in float16) silently kills learning. Bfloat16 keeps the float32 range and accepts the precision hit; float16 keeps more precision and pays for it with constant fear of overflow.</p>

<div class="l-note"><strong>Why this matters in practice:</strong> When Andrej Karpathy released nanoGPT, the default training recipe used <code>torch.bfloat16</code> on Ampere GPUs and above, with no loss scaling at all. Earlier mixed-precision recipes from 2018-2020 (NVIDIA Apex, fairseq, the original Megatron-LM) used float16 with carefully tuned dynamic loss scaling. The recipe simplification — "bf16 just works" — is one of the quiet revolutions of the 2020s. Pre-bf16 you needed a numerical analyst on the team. Post-bf16 you flip a flag.</div>

<h2 class="lesson-title">4. Catastrophic Cancellation</h2>

<p class="l-text">Of all the ways floating-point arithmetic can betray you, none is more insidious than <strong>catastrophic cancellation</strong>. It does not produce $+\\infty$ or NaN — both of those announce themselves loudly. Cancellation produces a small, plausible-looking number that has lost most of its significant digits to round-off. Your program continues. Your loss goes down. Then 200 steps later something explodes for no obvious reason. Welcome to the world's most-debugged numerical pathology.</p>

<div class="calc-formula"><div class="formula-label">THE PATHOLOGY</div><div class="formula-main">$$\\text{If}\\quad a \\approx b \\;\\;\\text{and both are stored to}\\;\\; p \\;\\;\\text{digits,}\\;\\; \\text{then}\\;\\; a - b \\;\\;\\text{has}\\;\\; p - \\log_{10}\\!\\left(\\frac{a}{a - b}\\right) \\;\\;\\text{digits.}$$</div><div class="formula-sub">If $a$ and $b$ agree in their first $k$ digits, $a - b$ loses $k$ digits to cancellation. Subtract two nearly-equal numbers and the result is essentially noise.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: SUBTRACTING TWO ALMOST-EQUAL FLOAT32S</div><div class="example-body">Take $a = 1.0000000$ and $b = 0.9999999$ in float32. Both are stored to about 7 significant digits, so each has a relative error of order $10^{-7}$. The true difference is $a - b = 10^{-7}$ — but in float32 each operand was already rounded to $\\pm 10^{-7}$ of its true value, so the difference is correct only to order $10^{-7}$ in absolute terms, i.e., $100\\%$ relative error. Six of the seven digits of significance are <em>gone</em>. The result is a single noisy digit.</div></div>

<p class="l-text">The fix is almost always algebraic. Identify the subtraction that cancels and rewrite the formula so the cancellation is avoided. Classic examples:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Quadratic formula</div><div class="card-body">$x = (-b - \\sqrt{b^2 - 4ac})/(2a)$ cancels when $b > 0$ and $b^2 \\gg 4ac$. Rewrite as $x = -2c / (b + \\sqrt{b^2 - 4ac})$ — same root, no cancellation.</div></div>
<div class="calc-card"><div class="card-title">Variance</div><div class="card-body">$\\text{Var}(X) = E[X^2] - (E[X])^2$ cancels when the data has small variance relative to its mean. Use Welford's algorithm or two-pass: $\\frac{1}{n}\\sum (x_i - \\bar x)^2$.</div></div>
<div class="calc-card"><div class="card-title">Softmax</div><div class="card-body">$\\sigma_i = e^{x_i}/\\sum_j e^{x_j}$ overflows for large $x$. Subtract $\\max x$ first — this is the log-sum-exp trick in disguise. We derive it in section 7.</div></div>
<div class="calc-card"><div class="card-title">Loss differences</div><div class="card-body">$\\nabla L = (L(\\theta + h) - L(\\theta))/h$ for finite-difference gradients catastrophically cancels at small $h$. Use a centred difference or autodiff.</div></div>
</div>

<div id="plot-linalg-l7-cancellation-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var loss=[];var loss64=[];
for(var k=-15;k<=-1;k++){var h=Math.pow(10,k);xs.push(h);
var a=1.0;var b=1.0+h;
var diff32=Math.fround(b)-Math.fround(a);
var truediff=h;
var rel=Math.abs((diff32-truediff)/truediff);
loss.push(Math.max(rel,1e-16));
var diff64=b-a;
var rel64=Math.abs((diff64-truediff)/truediff);
loss64.push(Math.max(rel64,1e-16));}
var t1={x:xs,y:loss,mode:'lines+markers',name:'float32 relative error',line:{color:'#ef4444',width:2.5},marker:{size:7}};
var t2={x:xs,y:loss64,mode:'lines+markers',name:'float64 relative error',line:{color:'#3b82f6',width:2.5},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'subtraction gap h (so we compute (1+h)-1)',type:'log',gridcolor:'#1f2937'},yaxis:{title:'relative error |computed - true| / |true|',type:'log',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:70}};
Plotly.newPlot('plot-linalg-l7-cancellation-en',[t1,t2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the unmistakable signature of catastrophic cancellation. We compute $(1 + h) - 1$ in both float32 (red) and float64 (blue) and compare against the true answer $h$. For "comfortable" $h \\gtrsim 10^{-4}$ both formats are essentially exact. As $h$ shrinks toward each format's machine epsilon — $\\sim 10^{-7}$ for float32, $\\sim 10^{-16}$ for float64 — the relative error climbs by a decade per decade. Once $h$ drops below $\\varepsilon$ the result is pure noise: $100\\%$ relative error. The takeaway: a subtraction of two nearly-equal floats can throw away as much precision as the format had to spare.</div></div>

<h2 class="lesson-title">5. Stable vs Unstable Algorithms: Least Squares</h2>

<p class="l-text">Numerical stability is a property of <em>algorithms</em>, not of problems. The same mathematical question — "solve $\\min \\|Ax - b\\|^2$" — admits both stable and unstable algorithms. Picking the right one is the difference between a regression that returns a sensible coefficient and one that returns garbage. Modern libraries (NumPy, SciPy, scikit-learn) hide this choice from you by default but expose it through parameters and warnings.</p>

<div class="calc-formula"><div class="formula-label">THE LEAST-SQUARES PROBLEM</div><div class="formula-main">$$\\min_{x \\in \\mathbb{R}^n}\\; \\|A x - b\\|^2, \\qquad A \\in \\mathbb{R}^{m \\times n}, \\quad m \\geq n$$</div><div class="formula-sub">Classical setup: $m$ data points, $n$ features, fit a linear model. We want the $x$ that minimises the squared residual. Closed-form solution from setting the gradient to zero gives the <strong>normal equations</strong>.</div></div>

<div class="calc-formula"><div class="formula-label">METHOD 1 — NORMAL EQUATIONS (UNSTABLE)</div><div class="formula-main">$$A^T A\\, x \\;=\\; A^T b \\qquad \\Longrightarrow \\qquad x \\;=\\; (A^T A)^{-1} A^T b$$</div><div class="formula-sub">Mathematically correct, two lines of code, fast. But the condition number of $A^T A$ is the <strong>square</strong> of the condition number of $A$. If $\\kappa(A) = 10^6$ then $\\kappa(A^T A) = 10^{12}$ and you lose 12 digits of precision in float64 — catastrophic.</div></div>

<div class="calc-formula"><div class="formula-label">METHOD 2 — QR DECOMPOSITION (STABLE)</div><div class="formula-main">$$A \\;=\\; Q R, \\qquad Q^T Q = I, \\quad R\\;\\text{upper triangular} \\qquad \\Longrightarrow \\qquad R x \\;=\\; Q^T b$$</div><div class="formula-sub">Compute QR via Householder reflections or modified Gram-Schmidt (never classical Gram-Schmidt — see Lesson 3). The conditioning of the triangular solve is governed by $\\kappa(A)$, not $\\kappa(A)^2$. Twice the work of normal equations, but stable for any reasonable problem.</div></div>

<div class="calc-formula"><div class="formula-label">METHOD 3 — SVD (MOST STABLE)</div><div class="formula-main">$$A \\;=\\; U \\Sigma V^T \\qquad \\Longrightarrow \\qquad x \\;=\\; V \\Sigma^+ U^T b$$</div><div class="formula-sub">Compute SVD, invert non-zero singular values, multiply through. Works even for rank-deficient $A$ — the pseudoinverse gives the minimum-norm solution. The default of <code>numpy.linalg.lstsq</code>.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Normal equations</div><div class="card-body">Cost $O(mn^2 + n^3)$. Loses $\\log_{10}(\\kappa(A)^2)$ digits. Acceptable only when $\\kappa(A) < 10^4$ in float64. Never use in float32.</div></div>
<div class="calc-card"><div class="card-title">QR (Householder)</div><div class="card-body">Cost $O(2mn^2)$. Loses $\\log_{10}(\\kappa(A))$ digits. The default for <code>scipy.linalg.lstsq(method='gelsd')</code> on well-conditioned problems.</div></div>
<div class="calc-card"><div class="card-title">SVD</div><div class="card-body">Cost $O(mn^2 + n^3)$ with a bigger constant. Most stable; handles singular and rank-deficient $A$. Default of <code>numpy.linalg.lstsq</code> for safety.</div></div>
<div class="calc-card"><div class="card-title">Iterative (CG)</div><div class="card-body">For huge sparse $A$, use Conjugate Gradient on $A^T A x = A^T b$ with regularisation. Never form $A^T A$ explicitly; multiply twice.</div></div>
</div>

<div class="l-note"><strong>Rule of thumb.</strong> If you are writing a least-squares solver by hand, never invert $A^T A$. Always go through QR or SVD. The classical Gauss/Legendre formula $(A^T A)^{-1} A^T b$ is correct on paper, dangerous in code. Half the "my regression is wildly unstable" questions on Stack Overflow are this bug.</div>

<h2 class="lesson-title">6. Condition Number</h2>

<p class="l-text">The <strong>condition number</strong> of a matrix tells you how much an input error in $b$ amplifies in the output $x$ when you solve $A x = b$. It is the single number that decides whether a problem is "easy" or "hard" for a numerical solver, independent of which method you choose.</p>

<div class="calc-formula"><div class="formula-label">CONDITION NUMBER VIA SINGULAR VALUES</div><div class="formula-main">$$\\kappa(A) \\;=\\; \\frac{\\sigma_{\\max}(A)}{\\sigma_{\\min}(A)} \\;=\\; \\|A\\| \\cdot \\|A^{-1}\\|$$</div><div class="formula-sub">Ratio of largest to smallest singular value. Equivalent to the operator-norm product on the right. For an orthogonal matrix $\\kappa = 1$ — perfectly conditioned. For a singular matrix $\\kappa = \\infty$. Real-world LLM weight matrices land in the $10^3$–$10^6$ range.</div></div>

<div class="calc-formula"><div class="formula-label">ERROR AMPLIFICATION BOUND</div><div class="formula-main">$$\\frac{\\|\\delta x\\|}{\\|x\\|} \\;\\leq\\; \\kappa(A) \\cdot \\frac{\\|\\delta b\\|}{\\|b\\|}$$</div><div class="formula-sub">A relative perturbation of size $\\varepsilon$ in $b$ can produce a relative error up to $\\kappa(A) \\cdot \\varepsilon$ in the solution $x$. With $\\kappa = 10^6$ and float32 round-off $\\varepsilon \\sim 10^{-7}$, you can expect the answer to be off in the first decimal digit.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Well-conditioned</div><div class="card-body">$\\kappa < 10^3$. The problem behaves cleanly. Any reasonable method works in float32 or float64.</div></div>
<div class="calc-card"><div class="card-title">Moderately ill-conditioned</div><div class="card-body">$10^3 < \\kappa < 10^8$. Use stable methods (QR, SVD) and float64. Float32 will lose visible digits.</div></div>
<div class="calc-card"><div class="card-title">Severely ill-conditioned</div><div class="card-body">$10^8 < \\kappa < 10^{14}$. Reformulate the problem if possible: regularise (Ridge, Tikhonov), project onto a smaller subspace, change basis.</div></div>
<div class="calc-card"><div class="card-title">Practically singular</div><div class="card-body">$\\kappa > 10^{14}$ in float64. The matrix is numerically rank-deficient; the answer is meaningless. Use truncated SVD or rank reveal.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: HILBERT MATRIX</div><div class="example-body">The Hilbert matrix $H$ with $H_{ij} = 1/(i + j - 1)$ is the classic ill-conditioned test. For $n = 5$ already $\\kappa(H) \\approx 4.8 \\times 10^5$. For $n = 10$, $\\kappa \\approx 1.6 \\times 10^{13}$ — past the precision limit of float64. Solving $H x = b$ for $n = 12$ in float64 returns answers that are essentially random noise; the matrix is, numerically, singular even though analytically it is invertible. The Hilbert matrix is famous precisely because of this gap between "exact" and "numerical" rank.</div></div>

<div id="plot-linalg-l7-condition-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var kappa=[];var err32=[];var err64=[];
for(var k=0;k<=14;k++){var c=Math.pow(10,k);kappa.push(c);
var roundoff32=1.19e-7;
var roundoff64=2.22e-16;
err32.push(Math.min(c*roundoff32,1));
err64.push(Math.min(c*roundoff64,1));}
var t1={x:kappa,y:err32,mode:'lines+markers',name:'float32 (eps ~ 1.2e-7)',line:{color:'#ef4444',width:2.5},marker:{size:7}};
var t2={x:kappa,y:err64,mode:'lines+markers',name:'float64 (eps ~ 2.2e-16)',line:{color:'#3b82f6',width:2.5},marker:{size:7}};
var t3={x:[1,1e14],y:[0.01,0.01],mode:'lines',name:'1% error threshold',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'condition number kappa(A)',type:'log',gridcolor:'#1f2937'},yaxis:{title:'expected relative error in solution',type:'log',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:70}};
Plotly.newPlot('plot-linalg-l7-condition-en',[t1,t2,t3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the rule of thumb made graphical. We plot the expected relative error in $x$ when solving $Ax = b$, as a function of the condition number $\\kappa(A)$, in float32 (red) and float64 (blue). Each line has slope $1$ on log-log axes because error grows linearly with $\\kappa$. The orange dashed threshold marks $1\\%$ error — the point at which an engineering result becomes untrustworthy. Float32 hits that threshold at $\\kappa \\approx 10^5$; float64 hits it at $\\kappa \\approx 10^{14}$. The vertical gap between the two lines — roughly 9 orders of magnitude — is exactly the precision difference between the two formats. Whenever you "upgrade" from float32 to float64, you buy 9 decades of ill-conditioning tolerance.</div></div>

<h2 class="lesson-title">7. The Log-Sum-Exp Trick</h2>

<p class="l-text">Of all the small numerical identities that show up in deep learning, none is more important than <strong>log-sum-exp</strong>. It is the foundation of every numerically stable softmax, every cross-entropy loss, every log-likelihood computation in NLP, every attention scaling. If you have ever called <code>F.cross_entropy</code> in PyTorch, you have run log-sum-exp underneath.</p>

<div class="calc-formula"><div class="formula-label">THE PROBLEM</div><div class="formula-main">$$\\text{LSE}(x_1, \\ldots, x_n) \\;=\\; \\log\\!\\left(\\sum_{i=1}^{n} e^{x_i}\\right)$$</div><div class="formula-sub">Compute the log of a sum of exponentials. Mathematically harmless, numerically disastrous: $e^{x_i}$ overflows for $x_i > 89$ in float32, $x_i > 11$ in float16. A single large logit poisons the whole sum.</div></div>

<div class="calc-formula"><div class="formula-label">THE TRICK — FACTOR OUT THE MAX</div><div class="formula-main">$$\\text{LSE}(x) \\;=\\; M + \\log\\!\\left(\\sum_{i=1}^{n} e^{x_i - M}\\right), \\qquad M \\;=\\; \\max_i x_i$$</div><div class="formula-sub">Algebraic identity, no approximation. The shifted exponents $e^{x_i - M}$ are all $\\leq 1$, so the sum is bounded between $1$ and $n$. No overflow possible. The single $\\log$ at the end handles all the dynamic range, and is itself well-behaved on inputs in $[1, n]$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: LSE OF (1000, 1001, 999)</div><div class="example-body"><strong>Naive:</strong> $e^{1000} + e^{1001} + e^{999}$. All three terms overflow to $+\\infty$ in float32. Result: $\\log(\\infty) = \\infty$.<br><br><strong>Trick:</strong> $M = 1001$. Shift: $(-1, 0, -2)$. Exponentiate: $(e^{-1}, 1, e^{-2}) = (0.368, 1, 0.135)$. Sum: $1.503$. Log: $0.408$. Add $M$: $1001 + 0.408 = 1001.408$. Sane, correct, no overflow.</div></div>

<p class="l-text">The same identity makes <strong>softmax</strong> stable. Softmax computes $\\sigma_i = e^{x_i} / \\sum_j e^{x_j}$. Subtract $M$ from every $x_i$ before exponentiating; the ratio is unchanged because $e^{x_i - M} / \\sum_j e^{x_j - M} = e^{x_i} e^{-M} / \\sum_j e^{x_j} e^{-M}$. Every modern softmax implementation does this shift internally, and every modern attention layer subtracts the max of the logits before the softmax for exactly this reason.</p>

<div class="calc-formula"><div class="formula-label">NUMERICALLY STABLE SOFTMAX</div><div class="formula-main">$$\\sigma_i(x) \\;=\\; \\frac{e^{x_i - M}}{\\sum_{j} e^{x_j - M}}, \\qquad M = \\max_j x_j$$</div><div class="formula-sub">Identical to the naive form mathematically. Cannot overflow because the largest exponent is now $0$. Cannot underflow catastrophically because at least one term equals $e^0 = 1$, anchoring the denominator.</div></div>

<div id="plot-linalg-l7-lse-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Ms=[];var naive=[];var stable=[];
for(var k=0;k<=120;k++){var M=k;Ms.push(M);
var s1=Math.exp(M)+Math.exp(M-1)+Math.exp(M-2);
naive.push(isFinite(s1)?Math.log(s1):300);
var shifted=1+Math.exp(-1)+Math.exp(-2);
stable.push(M+Math.log(shifted));}
var t1={x:Ms,y:naive,mode:'lines+markers',name:'naive log(sum exp)',line:{color:'#ef4444',width:2.5},marker:{size:5}};
var t2={x:Ms,y:stable,mode:'lines+markers',name:'log-sum-exp trick',line:{color:'#3b82f6',width:2.5},marker:{size:5}};
var t3={x:[88.7,88.7],y:[0,250],mode:'lines',name:'float32 overflow line (x~88.7)',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'M (shift in logits)',gridcolor:'#1f2937'},yaxis:{title:'computed LSE value',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:70}};
Plotly.newPlot('plot-linalg-l7-lse-en',[t1,t2,t3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the disaster averted by log-sum-exp. We compute LSE on the simple input $(M, M-1, M-2)$ for $M$ ranging from $0$ to $120$. The true answer is approximately $M + 0.408$ — a straight line of slope $1$. The blue trace, using the log-sum-exp trick, follows that line perfectly. The red trace, using the naive formula, agrees for small $M$ but breaks at $M \\approx 88.7$ — exactly the overflow boundary of $e^{x}$ in float32. Past that point the naive answer flatlines at $+\\infty$. Real-world Transformer logits routinely reach $M \\sim 30$ before the final softmax; you do not have to be in pathological territory for the unshifted version to silently overflow in mixed precision.</div></div>

<h2 class="lesson-title">8. Mixed Precision Training — The Big Engineering Story</h2>

<p class="l-text">Mixed-precision training is the dominant cost-saving technique in modern deep learning. Train weights and gradients in 16-bit (float16 or bfloat16) for speed and memory, while keeping a 32-bit master copy of the weights for numerical safety. With float16 you also need <strong>loss scaling</strong> to push small gradients up into the representable range. With bfloat16 you usually do not. The recipe was first published by Micikevicius et al. (NVIDIA, 2018), shipped as the NVIDIA Apex library, then absorbed into PyTorch as <code>torch.cuda.amp</code> in 2020 and into the unified <code>torch.amp</code> in 2024.</p>

<div class="calc-formula"><div class="formula-label">FP16 MIXED PRECISION PIPELINE</div><div class="formula-main">$$\\text{forward:}\\;\\; \\hat y \\;=\\; \\text{model}_{\\text{fp16}}(x_{\\text{fp16}}), \\qquad L \\;=\\; \\text{loss}_{\\text{fp32}}(\\hat y, y)$$ $$\\text{scale:}\\;\\; \\tilde L \\;=\\; S \\cdot L \\qquad (S \\sim 2^{15})$$ $$\\text{backward:}\\;\\; \\tilde g \\;=\\; \\nabla_\\theta \\tilde L \\;\\;\\;\\text{(in fp16, scaled by }S\\text{)}$$ $$\\text{unscale + update:}\\;\\; g \\;=\\; \\tilde g / S, \\qquad \\theta_{\\text{fp32}} \\;\\leftarrow\\; \\theta_{\\text{fp32}} - \\eta\\, g$$</div><div class="formula-sub">Five steps. Forward pass and gradient computation happen in fp16 for speed; the loss itself is computed in fp32 to avoid overflow; the loss is multiplied by $S \\sim 2^{15}$ before backprop so that tiny gradients survive the fp16 round-off floor; the gradients are divided by $S$ before updating the fp32 master weights. The fp32 master is rounded back to fp16 for the next forward pass.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Master weights in fp32</div><div class="card-body">Optimisers (Adam, SGD) accumulate momentum and second-moment estimates. Doing this in fp16 loses precision after thousands of updates. Keep the master copy in fp32; round to fp16 only for forward/backward.</div></div>
<div class="calc-card"><div class="card-title">Loss scaling factor $S$</div><div class="card-body">Pushed up by powers of two (start at $2^{15}$, double every $2000$ steps if no overflow). When NaN/Inf is detected, halve $S$ and skip the bad step. This <strong>dynamic loss scaling</strong> is what NVIDIA Apex automates.</div></div>
<div class="calc-card"><div class="card-title">Which ops stay in fp32</div><div class="card-body">Batch normalisation statistics, softmax, log-sum-exp, layer norm — anything with reductions or exponentials. PyTorch AMP autocast tracks an op allowlist/denylist and casts on the fly.</div></div>
<div class="calc-card"><div class="card-title">Bf16 simplification</div><div class="card-body">With bfloat16, both forward and backward stay in bf16 with no loss scaling at all. Master weights still in fp32. This is the recipe Karpathy's nanoGPT uses by default on H100s.</div></div>
</div>

<div id="plot-linalg-l7-amp-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var steps=[];var lossFp32=[];var lossFp16NoScale=[];var lossFp16Scale=[];var lossBf16=[];
for(var k=0;k<=200;k++){var s=k;steps.push(s);
var L=2.5*Math.exp(-0.018*s)+0.4+0.02*Math.sin(0.3*s);
lossFp32.push(L);
var gradMag=Math.abs(2.5*0.018*Math.exp(-0.018*s));
var underflow16=gradMag<6.1e-5;
if(underflow16 && k>40){lossFp16NoScale.push(lossFp16NoScale[lossFp16NoScale.length-1]+0.003);} else {lossFp16NoScale.push(L+0.05+0.04*Math.sin(0.4*s));}
lossFp16Scale.push(L+0.02+0.02*Math.sin(0.5*s));
lossBf16.push(L+0.015+0.018*Math.sin(0.6*s));}
var t1={x:steps,y:lossFp32,mode:'lines',name:'fp32 baseline',line:{color:'#10b981',width:2.5}};
var t2={x:steps,y:lossFp16NoScale,mode:'lines',name:'fp16 no loss scaling (stalls!)',line:{color:'#ef4444',width:2,dash:'dash'}};
var t3={x:steps,y:lossFp16Scale,mode:'lines',name:'fp16 with loss scaling',line:{color:'#3b82f6',width:2}};
var t4={x:steps,y:lossBf16,mode:'lines',name:'bf16 (no scaling needed)',line:{color:'#f59e0b',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'training step',gridcolor:'#1f2937'},yaxis:{title:'loss',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:60}};
Plotly.newPlot('plot-linalg-l7-amp-en',[t1,t2,t3,t4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> four training runs of the same model with different numeric recipes. The green fp32 baseline is the gold standard — trustworthy but slow and memory-hungry. The blue fp16-with-loss-scaling track matches it almost exactly, at half the memory and double the throughput on Volta-class hardware. The orange bf16 track behaves equally well with even less effort: no loss scaling, no master-weight headache. The red fp16-without-loss-scaling track is the warning: once the gradient magnitude drops below the fp16 representable floor (around $6 \\times 10^{-5}$), gradients underflow to zero, the optimiser stops updating, and the loss plateaus. This is the failure mode the loss-scaling recipe was invented to fix.</div></div>

<h2 class="lesson-title">9. Gradient Clipping</h2>

<p class="l-text">Mixed precision and gradient explosion are old friends. Floating-point math is sensitive to large values; the activations inside an RNN or a Transformer can grow without bound during early training, and the corresponding gradients can be even larger. <strong>Gradient clipping</strong> is the simple intervention: if the gradient norm exceeds a threshold $\\tau$, rescale it down to length $\\tau$ while keeping the direction intact.</p>

<div class="calc-formula"><div class="formula-label">GRADIENT CLIPPING (BY GLOBAL NORM)</div><div class="formula-main">$$g \\;\\leftarrow\\; \\min\\!\\left(1, \\; \\frac{\\tau}{\\|g\\|}\\right) \\cdot g$$</div><div class="formula-sub">If $\\|g\\| \\leq \\tau$ leave $g$ alone. If $\\|g\\| > \\tau$ shrink it to length $\\tau$. The direction $g/\\|g\\|$ is preserved. Standard practice: $\\tau = 1.0$ for Transformer training, $\\tau = 0.25$ or $0.5$ for RNNs.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">By value vs by norm</div><div class="card-body">"By value" clips each component to $[-\\tau, \\tau]$ — distorts the direction. "By global norm" rescales the whole vector — preserves direction. The latter is overwhelmingly preferred.</div></div>
<div class="calc-card"><div class="card-title">When to clip</div><div class="card-body">After unscaling fp16 gradients but before optimiser step. PyTorch: <code>torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)</code>. AMP does the unscale automatically inside <code>scaler.unscale_(optimizer)</code>.</div></div>
<div class="calc-card"><div class="card-title">Why it helps fp16</div><div class="card-body">A single exploding gradient can push the gradient norm to $> 10^4$, which after loss scaling lands in the fp16 overflow zone. Clipping caps the maximum value before the next iteration, keeping the dynamic range bounded.</div></div>
<div class="calc-card"><div class="card-title">Why not always clip</div><div class="card-body">For LLMs at scale, clipping too aggressively (small $\\tau$) throttles learning. The current rule of thumb for $\\sim 1$B-parameter models is $\\tau = 1.0$; for $> 70$B parameters teams sometimes go to $\\tau = 0.5$ or use adaptive schemes.</div></div>
</div>

<h2 class="lesson-title">10. Debugging NaN and Inf</h2>

<p class="l-text">When NaN appears, training silently dies — every subsequent gradient is NaN, every weight update is NaN, every loss is NaN. The first thing to do is to find the operation that produced it. The second is to fix the root cause, not patch the symptom.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Division by zero</div><div class="card-body">Common in normalisations: $x / \\sqrt{\\text{var} + \\varepsilon}$ where someone forgot the $\\varepsilon$. Fix: add a small epsilon (typically $10^{-5}$ to $10^{-8}$) to any denominator that could be zero.</div></div>
<div class="calc-card"><div class="card-title">Log of zero or negative</div><div class="card-body">Cross-entropy: $-\\log(\\hat p)$ explodes when $\\hat p = 0$. Fix: clamp $\\hat p \\geq \\varepsilon$, or use log-softmax instead of softmax + log, or use built-in cross-entropy.</div></div>
<div class="calc-card"><div class="card-title">Exp of large positive</div><div class="card-body">$e^{1000} = +\\infty$ in any float format. Fix: log-sum-exp trick. Subtract the max before exponentiating. Most modern softmax/attention does this internally.</div></div>
<div class="calc-card"><div class="card-title">Gradient explosion</div><div class="card-body">In RNNs and during early Transformer training. Fix: gradient clipping at $\\tau = 1.0$. Also use better initialisation (Xavier/Kaiming) and warm-up the learning rate.</div></div>
<div class="calc-card"><div class="card-title">Zero gradient + Adam</div><div class="card-body">Adam divides by the square root of second moments; if a parameter's gradient is exactly zero for many steps, the EMA collapses and division explodes. Fix: small Adam epsilon ($10^{-8}$).</div></div>
<div class="calc-card"><div class="card-title">Fp16 underflow</div><div class="card-body">A small but non-zero gradient becomes literal zero in fp16. Multiplied through the optimiser this often produces NaN. Fix: bigger loss scale, or move to bf16.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PYTORCH NAN-FINDING RECIPE</div><div class="formula-main">$$\\texttt{torch.autograd.set\\_detect\\_anomaly(True)}$$</div><div class="formula-sub">Runs slower but raises an error at the exact op that produced NaN, with a stack trace pointing to your source line. Run with this flag enabled the moment NaN appears; turn it off when you have the fix in place.</div></div>

<div class="l-note"><strong>The professional debugging loop.</strong> Step 1: log gradient norms and activation norms every step. Step 2: when NaN appears, look at the step before — what was the largest activation? The largest gradient? Step 3: turn on <code>detect_anomaly</code> and re-run from the last good checkpoint. Step 4: identify the op (almost always a log, exp, division, or sqrt). Step 5: add eps, clip, or change precision. Step 6: rerun and verify the fix holds for 10× the original duration before declaring victory.</div>

<h2 class="lesson-title">11. AI Connection: Why This All Matters for ML</h2>

<p class="l-text">The story of numerical stability in modern ML is a story of engineering payoffs at scale. Every doubled throughput, every halved memory footprint, every avoided NaN is worth millions of dollars of compute at frontier-lab scale. The names you have probably encountered:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NVIDIA Apex (2018)</div><div class="card-body">First widely-adopted fp16 mixed-precision library. Introduced dynamic loss scaling and master-weights-in-fp32 to the broader ML world. Now superseded by built-in PyTorch AMP.</div></div>
<div class="calc-card"><div class="card-title">PyTorch torch.amp</div><div class="card-body">Modern unified API: <code>autocast()</code> context manager + <code>GradScaler()</code>. Supports fp16 and bf16. The recipe in every production training run from 2021 onward.</div></div>
<div class="calc-card"><div class="card-title">Google TPU / bfloat16</div><div class="card-body">TPUs from v2 (2017) onward use bfloat16 as the native compute format. No loss scaling. JAX and TensorFlow expose bf16 as a first-class dtype. The TPU lineage made bf16 mainstream.</div></div>
<div class="calc-card"><div class="card-title">Karpathy nanoGPT</div><div class="card-body">Tiny, readable GPT training repo. The default config uses bfloat16 on A100+ hardware with no loss scaling, gradient clipping at 1.0, and AdamW. The simplest production-quality recipe in existence.</div></div>
<div class="calc-card"><div class="card-title">FP8 training (H100)</div><div class="card-body">NVIDIA Hopper introduced fp8 (e4m3 and e5m2 variants) in 2022. The Transformer Engine library handles the per-tensor scaling needed to make fp8 stable. Used by Meta Llama 3 70B training and others.</div></div>
<div class="calc-card"><div class="card-title">Flash Attention</div><div class="card-body">Dao et al. 2022. Re-implementation of attention that fuses softmax with matrix multiplies and uses log-sum-exp recursively across tiles. Cuts memory from $O(N^2)$ to $O(N)$, exact same numerical answer. Numerical stability and IO awareness combined.</div></div>
</div>

<p class="l-text">Step back and the pattern is clear: every major hardware generation since 2017 has pushed precision lower (fp32 → fp16/bf16 → fp8 → fp4 experimentally), and every generation has needed a corresponding numerical-stability invention to make the new format trainable. The lesson is not "use higher precision." The lesson is "match the precision to the operation, and protect the operations that need it." Forward pass: low precision is fine. Loss accumulation: needs fp32. Optimiser state: needs fp32. Normalisation statistics: needs fp32. Everything else: cast down for throughput. This is the design philosophy behind torch.amp, JAX's mixed-precision policies, and TensorFlow's <code>mixed_precision</code> module.</p>

<div class="l-warn"><strong>One mantra to take away.</strong> The model does not care if your activations are fp16 or bf16. The optimiser does. The loss does. The reductions do. Reach for low precision where the data is wide and shallow (matrix multiplies, convolutions); insist on full precision where the data is narrow and deep (reductions, normalisations, optimiser state). Once you internalise this split, the entire mixed-precision recipe becomes a one-line API call in any modern framework.</div>

<h2 class="lesson-title">12. Practical Pyodide Exercise</h2>

<p class="l-text">Your turn. The code below runs entirely in your browser via Pyodide. It walks through the four pillars of this lesson in sequence: compare float32 versus float16 precision on a small reduction; implement the log-sum-exp trick from scratch and compare with naive softmax; solve an ill-conditioned linear system three different ways and watch the errors diverge; and finally simulate exploding gradients and apply clipping to tame them. Run it, read the printouts, then change the parameters (numbers of samples, condition numbers, clip thresholds) and watch the math change with you.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># ============================================================</span>
<span class="cm"># 1. FLOAT32 vs FLOAT16 PRECISION — running average</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"=== 1. Precision comparison: average of 1e5 numbers ==="</span>)
n = <span class="num">100_000</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
data64 = rng.<span class="fn">standard_normal</span>(n).<span class="fn">astype</span>(np.float64) + <span class="num">1000.0</span>
data32 = data64.<span class="fn">astype</span>(np.float32)
data16 = data64.<span class="fn">astype</span>(np.float16)

avg64 = data64.<span class="fn">mean</span>()
avg32 = data32.<span class="fn">mean</span>()
avg16 = data16.<span class="fn">astype</span>(np.float16).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">f"float64 mean: {avg64:.10f}"</span>)
<span class="fn">print</span>(<span class="str">f"float32 mean: {avg32:.10f}  (err vs fp64: {abs(avg32-avg64):.2e})"</span>)
<span class="fn">print</span>(<span class="str">f"float16 mean: {avg16:.10f}  (err vs fp64: {abs(avg16-avg64):.2e})"</span>)

<span class="cm"># Expected: fp32 error ~ 1e-5, fp16 error ~ 1.0 — fp16 loses 5 digits!</span>
<span class="cm"># The base value 1000 itself only has 3 digits left in fp16.</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 2. LOG-SUM-EXP — naive vs stable</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== 2. Log-sum-exp on large logits ==="</span>)

<span class="kw">def</span> <span class="fn">naive_lse</span>(x):
    <span class="kw">return</span> np.<span class="fn">log</span>(np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(x)))

<span class="kw">def</span> <span class="fn">stable_lse</span>(x):
    M = np.<span class="fn">max</span>(x)
    <span class="kw">return</span> M + np.<span class="fn">log</span>(np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(x - M)))

logits_small = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
logits_large = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">999.0</span>])

<span class="fn">print</span>(<span class="str">f"Small logits (1, 2, 3):"</span>)
<span class="fn">print</span>(<span class="str">f"  naive  : {naive_lse(logits_small):.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"  stable : {stable_lse(logits_small):.6f}"</span>)

<span class="fn">print</span>(<span class="str">f"\\nLarge logits (1000, 1001, 999):"</span>)
<span class="kw">try</span>:
    val = <span class="fn">naive_lse</span>(logits_large)
    <span class="fn">print</span>(<span class="str">f"  naive  : {val}"</span>)
<span class="kw">except</span> <span class="fn">FloatingPointError</span> <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">f"  naive  : raised {e}"</span>)
<span class="fn">print</span>(<span class="str">f"  stable : {stable_lse(logits_large):.6f}"</span>)

<span class="cm"># Stable version gives 1001.408 — correct. Naive overflows to +inf.</span>

<span class="cm"># Numerically stable softmax via log-sum-exp:</span>
<span class="kw">def</span> <span class="fn">stable_softmax</span>(x):
    M = np.<span class="fn">max</span>(x)
    e = np.<span class="fn">exp</span>(x - M)
    <span class="kw">return</span> e / np.<span class="fn">sum</span>(e)

<span class="fn">print</span>(<span class="str">f"\\nStable softmax of large logits: {stable_softmax(logits_large)}"</span>)
<span class="cm"># Output: [0.245, 0.665, 0.090] — finite and correctly normalised.</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 3. ILL-CONDITIONED LINEAR SYSTEM — three methods</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== 3. Ill-conditioned linear system (Hilbert matrix) ==="</span>)

<span class="kw">def</span> <span class="fn">hilbert</span>(n):
    <span class="kw">return</span> np.<span class="fn">array</span>([[<span class="num">1.0</span>/(i+j+<span class="num">1</span>) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n)] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])

n = <span class="num">8</span>
H = <span class="fn">hilbert</span>(n)
x_true = np.<span class="fn">ones</span>(n)               <span class="cm"># pretend the true answer is all-ones</span>
b = H @ x_true                       <span class="cm"># manufacture a consistent rhs</span>
kappa = np.linalg.<span class="fn">cond</span>(H)
<span class="fn">print</span>(<span class="str">f"Hilbert {n}x{n}: condition number kappa = {kappa:.2e}"</span>)

<span class="cm"># Method A: normal equations (DON'T do this in real code)</span>
HtH = H.T @ H
x_normal = np.linalg.<span class="fn">solve</span>(HtH, H.T @ b)
err_normal = np.linalg.<span class="fn">norm</span>(x_normal - x_true) / np.linalg.<span class="fn">norm</span>(x_true)

<span class="cm"># Method B: QR decomposition</span>
Q, R = np.linalg.<span class="fn">qr</span>(H)
x_qr = np.linalg.<span class="fn">solve</span>(R, Q.T @ b)
err_qr = np.linalg.<span class="fn">norm</span>(x_qr - x_true) / np.linalg.<span class="fn">norm</span>(x_true)

<span class="cm"># Method C: SVD-based pseudoinverse (numpy.linalg.lstsq default)</span>
x_svd, *_ = np.linalg.<span class="fn">lstsq</span>(H, b, rcond=<span class="kw">None</span>)
err_svd = np.linalg.<span class="fn">norm</span>(x_svd - x_true) / np.linalg.<span class="fn">norm</span>(x_true)

<span class="fn">print</span>(<span class="str">f"  Normal eqs error : {err_normal:.3e}   (worst — kappa^2 amplification)"</span>)
<span class="fn">print</span>(<span class="str">f"  QR error         : {err_qr:.3e}   (better)"</span>)
<span class="fn">print</span>(<span class="str">f"  SVD lstsq error  : {err_svd:.3e}   (best)"</span>)

<span class="cm"># Try this with n=12 and watch normal equations diverge completely.</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 4. GRADIENT CLIPPING — taming exploding gradients</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== 4. Gradient clipping demonstration ==="</span>)

<span class="kw">def</span> <span class="fn">clip_grad</span>(g, tau):
    norm = np.linalg.<span class="fn">norm</span>(g)
    <span class="kw">if</span> norm &gt; tau:
        <span class="kw">return</span> g * (tau / norm)
    <span class="kw">return</span> g

<span class="cm"># Simulate a training loop with occasional gradient spikes (RNN-style)</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
theta_clip = np.<span class="fn">zeros</span>(<span class="num">5</span>)
theta_no   = np.<span class="fn">zeros</span>(<span class="num">5</span>)
lr = <span class="num">0.01</span>
tau = <span class="num">1.0</span>
norms_no = []; norms_clip = []

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    g = np.random.<span class="fn">randn</span>(<span class="num">5</span>) * <span class="num">0.5</span>
    <span class="kw">if</span> step % <span class="num">10</span> == <span class="num">3</span>:
        g = g * <span class="num">50</span>                   <span class="cm"># inject a gradient explosion</span>
    norms_no.<span class="fn">append</span>(np.linalg.<span class="fn">norm</span>(g))
    norms_clip.<span class="fn">append</span>(np.linalg.<span class="fn">norm</span>(<span class="fn">clip_grad</span>(g, tau)))
    theta_no   = theta_no   - lr * g
    theta_clip = theta_clip - lr * <span class="fn">clip_grad</span>(g, tau)

<span class="fn">print</span>(<span class="str">f"Max gradient norm without clipping: {max(norms_no):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Max gradient norm with clipping   : {max(norms_clip):.2f}  (capped at tau={tau})"</span>)
<span class="fn">print</span>(<span class="str">f"||theta_no   final|| = {np.linalg.norm(theta_no):.3f}  (jerked around by spikes)"</span>)
<span class="fn">print</span>(<span class="str">f"||theta_clip final|| = {np.linalg.norm(theta_clip):.3f}  (steady descent)"</span>)
</code></pre></div>

<p class="l-text"><strong>What you should see.</strong> In part 1, the float32 average is correct to about $5$ digits while the float16 average is off by about $1$ — the base value of $1000$ uses almost all of float16's $\\sim 3$ significant digits, leaving nothing for the variance. In part 2, the stable LSE gives $1001.408$ for the large logits while the naive version overflows to $+\\infty$; the stable softmax of those same logits returns the perfectly sensible $(0.245, 0.665, 0.090)$. In part 3, the normal-equations error for the $8 \\times 8$ Hilbert system is roughly $10^{-5}$ — already losing five digits — while QR and SVD return errors near $10^{-7}$. Try $n = 12$ and watch the normal-equations method return digits that look like noise. In part 4, the no-clip simulation gets jerked around violently by the injected spikes while the clipped version stays glued to a smooth trajectory.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">Replace <code>data16</code> in part 1 with bfloat16 (use <code>np.bfloat16</code> from <code>ml_dtypes</code> if available, or simulate by truncating the fp32 mantissa to 7 bits) and watch the precision behaviour flip — bf16 will be worse than fp16 on small-variance reductions but better in the next experiment. In part 3, replace the Hilbert matrix with a random near-orthogonal one (use <code>np.linalg.qr(np.random.randn(n, n))[0]</code>) and watch all three methods agree to machine precision — well-conditioned problems do not care about your algorithm. In part 4, sweep $\\tau$ from $0.1$ to $10$ and plot the variance of the trajectory; an over-aggressive clip ($\\tau = 0.1$) starves learning, an under-aggressive clip ($\\tau = 10$) lets spikes through.</div></div>

<div class="calc-highlight"><strong>What you can do now.</strong> Read the IEEE 754 bit layout of any float format and convert between bits and value by hand; spot catastrophic cancellation in a formula and rewrite it to avoid the subtraction; pick QR or SVD over normal equations for any least-squares problem you write; derive the log-sum-exp trick from scratch and apply it to softmax, cross-entropy, and attention; write a mixed-precision PyTorch training loop with <code>autocast</code> and <code>GradScaler</code> and explain every line of it; diagnose a NaN trace by following the gradient norm log backward to the offending op. The next lesson moves to <strong>matrix calculus</strong> and the einsum notation that powers every modern deep learning framework's automatic differentiation system.</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text"><strong>Bir sinir agi icinde yasayan her sayi bir yalandir.</strong> PyTorch'un <code>nn.Linear</code>'a verdigi 32-bit IEEE 754 floatlar, NVIDIA Tensor Core'larindan gecen 16-bit yari-hassasiyet degerleri, Google TPU'sundan akan bfloat16 aktivasyonlar &mdash; hicbiri gercek sayi degildir. Bunlar IEEE'nin 1985'teki bir komitesi tarafindan secilmis nicemlenmis yaklasimlardir ve modern derin ogrenmenin tum binasi, bu yaklasimlarin ne zaman isirdigini ve nasil etkisizlestirilecegini bilmek uzerine kuruludur. NaN kayiplari, gizemli egitim iraksamalari, sessizce sifira inen gradyanlar, bir Transformer'in son katmanindaki patlayan aktivasyonlar &mdash; bu basarisizliklarin her birinin koku kayan noktali aritmetikte yatar.</p>

<p class="l-text">Bu ders IEEE 754'u ve modern ML'e hakim olan uc sayisal bicimi acar: <strong>float32</strong> (guvenli varsayilan), <strong>float16</strong> (hizli ama kirilgan yari), ve <strong>bfloat16</strong> (Google Brain'in daha genis, daha sakin kuzeni). Bit yerlesimlerini elden insa ederiz, kalitsal hesaplamayla felaket iptali isleriz, kararli ve kararsiz en-kucuk-kareler algoritmalarini karsilastiririz, dunyadaki her softmax'in tasmasini onleyen log-sum-exp hilesini turetiriz ve sonunda muhendislik basyapiti olan karisik-kesinlik egitimine variriz &mdash; kayip olcekleme, ana agirliklar, AMP, NVIDIA Apex'in PyTorch <code>torch.amp</code>'e cevirdigi tarif. Dersin sonunda NaN izini bir doktorun rontgen okudugu gibi okuyacaksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Float32, float16 ve bfloat16 icin IEEE 754 bit yerlesimini okumak ve elden bit kaliplari ile gercek degerler arasinda donusturmek</li>
<li>Uc somut sayisal patolojiyi &mdash; felaket iptali, tasma, alttan tasma &mdash; cebirsel imzalarindan tanimak</li>
<li>Kararli algoritmayi secmek: normal denklemler yerine QR veya SVD, saf softmax yerine log-sum-exp, gerektiginde Kahan toplama</li>
<li>Bir dogrusal sistemin kosul sayisini hesaplamak ve bir cozucunun kac hane hassasiyet kaybedecegini onceden tahmin etmek</li>
<li>Log-sum-exp ozdesligini ve her derin ogrenme kutuphanesinde kullanilan sayisal olarak kararli softmax/cross-entropy'yi turetmek</li>
<li>Kayip olcekleme ve agirligin float32 ana kopyasi ile karisik-kesinlik egitimi uygulamak ve bfloat16'nin tarifi neden degistirdigini aciklamak</li>
<li>Bir egitim donguusunde NaN ve Inf'i tani &mdash; suclu islemi bul, onu eps, kirpma veya bir kesinlik degisikligi ile cozumle</li>
</ul>
</div>

<h2 class="lesson-title">1. Sorun: Gercek Sayilar Bilgisayara Sigmaz</h2>

<p class="l-text">Bir gercek sayinin sonsuz hanesi olabilir. 32-bit bir register'in tam olarak $2^{32} \\approx 4.3 \\times 10^9$ durumu vardir. $0$'dan $10^{10}$'a kadar olan tamsayilari bile 32 bite sigdirmanin yolu yoktur, gercel sayilarin tam surekligi soyle dursun. Bilgisayarin "gercek sayilar" gosterimi, dikkatle secilmis sonlu bir yaklasim kumesidir ve her aritmetik islem gercek cevabi en yakin temsil edilebilir degere yuvarlar. Cogu zaman sansli olursun ve yuvarlama hatasi gorunmez. Ara sira felakettir.</p>

<div class="calc-highlight"><strong>Buyuk fikir:</strong> Kayan nokta, ikili sistemde bilimsel gosterimdir. Bir kayan nokta sayisi bir isaret, bir iki-ustlu ust ve kucuk sabit-genislikli bir mantis saklar. Bu sana buyuk bir dinamik araliği satin alir ($10^{-40}$ ve $10^{+40}$ ayni bicimde temsil edilebilir) sabit goreli hata bedeli karsiliginda: her islem yaklasik olarak $2^p$'de bir hata icerebilir, $p$ mantis bit genisligidir.</div>

<p class="l-text">Resmi kurallar &mdash; kac bit, hangi sirada, hangi ozel degerlerle &mdash; 1985'te onaylanan ve 2008'de guncellenen IEEE 754 tarafindan belirlenir. Kullanin her CPU, GPU ve TPU IEEE 754'un bir versiyonunu uygular (veya NVIDIA'nin bfloat16'si gibi yakin akrabasini). Bit yerlesimini anlamak modern bir ML muhendisi icin opsiyonel degildir: float16 ile bfloat16 arasindaki farki bilmek "kayip 200. adimda NaN'a gidiyor" ile "model temiz bir sekilde yakinsamaya egitiliyor" arasindaki farktir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Isaret biti</div><div class="card-body">Tek bir bit: negatif olmayan icin $0$, negatif icin $1$. Hem $+0$ hem $-0$ ayri bit kaliplari olarak vardir ama <code>==</code> ile esit karsilastirilir.</div></div>
<div class="calc-card"><div class="card-title">Ust</div><div class="card-body">Iki'nin kuvvetini kodlayan onyargili tamsayi. Float32 icin onyargi $127$, yani saklanan $130$ usteli $2^{130-127}=2^3=8$ demek. Dinamik aralığı kontrol eder.</div></div>
<div class="calc-card"><div class="card-title">Mantis (anlamlandirici)</div><div class="card-body">Ikili sistemde $1.xxxxx$ kesri, basta gizli $1$ ile. Genislik hassasiyeti kontrol eder: float32'de $23$ bit, float16'da $10$, bfloat16'da $7$.</div></div>
<div class="calc-card"><div class="card-title">Ozel degerler</div><div class="card-body">$+\\infty$, $-\\infty$, NaN (sayi degil), subnormaller (sifira yakin cok kucuk sayilar). Hepsinin ayrilmis ust kaliplari ve ozel aritmetik kurallari vardir.</div></div>
</div>

<h2 class="lesson-title">2. IEEE 754 Float32 &mdash; Bit Bit</h2>

<p class="l-text">Tek-hassasiyet float32, NumPy'nin sana varsayilan olarak verdigi, sinir agi cercevelerinin baska bir sey istemedikce agirliklari sakladigi ve neredeyse her bilimsel hesaplamanin "guvenilir" temel cizgi olarak kullandigi seydir. Bit yerlesimi:</p>

<div class="calc-formula"><div class="formula-label">FLOAT32 YERLESIMI (TOPLAM 32 BIT)</div><div class="formula-main">$$\\underbrace{s}_{1\\text{ bit}} \\,\\underbrace{e_7 e_6 \\cdots e_0}_{8\\text{ ust biti}}\\, \\underbrace{m_{22} m_{21} \\cdots m_0}_{23\\text{ mantis biti}}$$ $$x \\;=\\; (-1)^s \\cdot 2^{E - 127} \\cdot \\left(1 + \\sum_{i=0}^{22} m_i \\cdot 2^{i - 23}\\right)$$</div><div class="formula-sub">$E$, 8 ust bitten olusan isaretsiz tamsayidir. $-127$ onyargisi temsil edilebilir araligi kaydirir, boylece $-126$'dan $+127$'ye ustler saklanabilir. Mantis'teki one gecen $1$ gizlidir &mdash; sadece kesir kismi kodlanir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dinamik aralık</div><div class="card-body">$\\sim 1.18 \\times 10^{-38}$ (en kucuk normal pozitif) ile $\\sim 3.4 \\times 10^{+38}$ (en buyuk sonlu) arasi. Seksen buyukluk derecesi &mdash; cok buyuk.</div></div>
<div class="calc-card"><div class="card-title">Makine epsilonu</div><div class="card-body">$\\varepsilon = 2^{-23} \\approx 1.19 \\times 10^{-7}$. Float32'de $1 + \\varepsilon \\neq 1$ olan en kucuk $\\varepsilon$. Yaklasik 7 ondalik hane hassasiyet.</div></div>
<div class="calc-card"><div class="card-title">Subnormaller</div><div class="card-body">Ust ozel deger $0$ oldugunda, gizli onde gelen $1$, $0$ olur. Bu yavasca hassasiyet kaybeder ama temsil edilebilir araligi $\\sim 1.4 \\times 10^{-45}$'a kadar uzatir.</div></div>
<div class="calc-card"><div class="card-title">Bellek ayak izi</div><div class="card-body">Deger basina 4 bayt. 7B parametreli bir LLM agirlik matrisi float32'de $28$ GB ister &mdash; cogu tuketici GPU'sunu rahatca aşar. Kuculme baskisi gercek.</div></div>
</div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK: BIR FLOAT32'YI COZME</div><div class="example-body">Bit kalibi <code>0 10000010 01001000000000000000000</code> soyle anlasilir: $s = 0$ (pozitif); $E = (10000010)_2 = 130$ yani ust $130 - 127 = 3$; mantis $1.01001000\\ldots = 1 + 1/4 + 1/32 = 1.28125$. O halde $x = +1 \\cdot 2^3 \\cdot 1.28125 = 10.25$. Tersini calistir: $10.25 = 1.28125 \\cdot 2^3$; $1.28125$'i $1.01001\\ldots$ olarak kodla, $3$'u $130 = 10000010$ olarak kodla; bit kalibini yeniden insa et. Bu, butun konudaki tek "zor" hesaplamadir ve tamamen mekaniktir.</div></div>

<p class="l-text">Hemen hemen her kayan nokta islemi soyle tanimlanir: matematiksel olarak tam sonucu hesapla, sonra en yakin float32 temsil edilebilir degere yuvarla (esitleri-cifte). Yuvarlama hatasi goreli olarak $\\varepsilon / 2$ ile sinirlandirilir. Yani tek bir carpma esasen "dogru cevap arti veya eksi yedi hane"dir. Bu zararsiz gibi gelir ve cogu zaman oyledir. Sorun, kucuk goreli hatalarin bagimsiz olmaktan cikip hizalanmaya basladigi yeterli islem yaptiginda baslar.</p>

<h2 class="lesson-title">2.5 IEEE 754 Float Bicimleri Gorsel Olarak</h2>

<p class="l-text">Daha derine inmeden once uc modern ML bicimini tek bir dinamik-aralık grafiginde karsilastiralim. Float16 ile bfloat16 arasindaki kontrast, karisik-kesinlik egitimindeki en onemli tek olgudur: ayni bellek ayak izi, tamamen farkli basarisizlik modlari.</p>

<div id="plot-linalg-l7-float-range-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var formats=['float32','float16','bfloat16','float8 (e4m3)','int8'];
var minVals=[1.18e-38,6.1e-5,1.18e-38,1.5e-3,1];
var maxVals=[3.4e38,6.55e4,3.4e38,4.48e2,127];
var precBits=[23,10,7,3,0];
var ranges=maxVals.map(function(v,i){return Math.log10(v/minVals[i]);});
var t1={x:formats,y:ranges,type:'bar',name:'log10(maks/min) — dinamik aralık',marker:{color:'#3b82f6'},text:ranges.map(function(v){return v.toFixed(1)+' onluk';}),textposition:'auto',textfont:{color:'#ffffff'}};
var t2={x:formats,y:precBits,type:'bar',name:'mantis biti — hassasiyet',marker:{color:'#f59e0b'},yaxis:'y2',text:precBits.map(function(v){return v+' bit';}),textposition:'auto',textfont:{color:'#ffffff'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'bicim',gridcolor:'#1f2937'},yaxis:{title:'dinamik aralık (onluk, log10)',gridcolor:'#1f2937',side:'left'},yaxis2:{title:'mantis biti',side:'right',overlaying:'y',gridcolor:'#1f2937',range:[0,25]},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:60,b:50,l:60},barmode:'group'};
Plotly.newPlot('plot-linalg-l7-float-range-tr',[t1,t2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> float bicimi tasariminin iki yarisan ekseni. Mavi cubuklar (sol eksen) onluk olarak dinamik aralıktir &mdash; temsil edilebilir en kucuk ve en buyuk sayilar arasindaki mesafe. Float32, bfloat16 ve float8 ayni 8-bitlik usteli paylastiklari icin yaklasik ayni buyuk araligi kapsar. Float16 burada dramatik kayba ugrar: yalnizca $\\sim 9$ onluk, bu nedenle cok kucuk gradyanlar sifira iner ve cok buyuk aktivasyonlar $\\infty$'a tasar. Turuncu cubuklar (sag eksen) mantis bitleri, <em>hassasiyet</em> icin vekildir. Float32 23 bit ile kesin olarak kazanir, bfloat16 hassasiyetinin yarisini float32'nin araligi karsiliginda takas eder ve float8/int8 cikarim icin ayrilmis ve simdi deneysel egitim icin saklanmis agresif nicemleme bicimleridir.</div></div>

<h2 class="lesson-title">3. Float16 ve BFloat16 &mdash; Modern ML Hikayesi</h2>

<p class="l-text">2017'de NVIDIA Volta GPU'lari ilk Tensor Core'lari gonderdi: float32'den 8 kez daha hizli $4 \\times 4$ float16 matrisleri carpan donanim birimleri. Ekonomik baski hemen oldu &mdash; yari hassasiyette egitin ve bellegi yariya indir, gecisi ikiye katla, ayni dolarlik silisyumda calistir. Ama float16 tek basina kirilgandir: kucuk gradyanlar alttan tasar ve telafi etmek icin kullanilan teknikler (kayip olcekleme, ana agirliklar) standart uygulama haline geldi. Sonra Google Brain TPU'lari farkli bir 16-bit bicim &mdash; <strong>bfloat16</strong> &mdash; ile gonderdi, tam da bu tuzaklardan kacinmak icin secildi. Bugun on saf modeller neredeyse yalnizca bfloat16'da veya daha agresif karisik stratejilerle egitiliyor.</p>

<div class="calc-formula"><div class="formula-label">FLOAT16 (YARI-HASSASIYET, IEEE 754 BINARY16)</div><div class="formula-main">$$\\underbrace{s}_{1} \\,\\underbrace{e_4 \\cdots e_0}_{5\\text{ ust}}\\, \\underbrace{m_9 \\cdots m_0}_{10\\text{ mant}} \\qquad x = (-1)^s \\cdot 2^{E - 15} \\cdot (1 + m/2^{10})$$</div><div class="formula-sub">5-bit ust, 10-bit mantis. Aralık $\\approx \\pm 65{,}504$. Makine epsilonu $\\approx 9.77 \\times 10^{-4}$. En kucuk normal pozitif $\\approx 6.1 \\times 10^{-5}$. Yaklasik 3 ondalik hane hassasiyet.</div></div>

<div class="calc-formula"><div class="formula-label">BFLOAT16 (BRAIN FLOATING POINT)</div><div class="formula-main">$$\\underbrace{s}_{1} \\,\\underbrace{e_7 \\cdots e_0}_{8\\text{ ust}}\\, \\underbrace{m_6 \\cdots m_0}_{7\\text{ mant}} \\qquad x = (-1)^s \\cdot 2^{E - 127} \\cdot (1 + m/2^{7})$$</div><div class="formula-sub">8-bit ust (float32 ile ayni!), 7-bit mantis. Aralık float32 ile aynidir: $\\sim \\pm 3.4 \\times 10^{38}$. Makine epsilonu $\\approx 7.8 \\times 10^{-3}$. Yaklasik 2 ondalik hane hassasiyet. Google Brain tarafindan ozel olarak bir float32'nin ust yarisi bfloat16'ya sadece kesilerek atilabilecek sekilde tasarlanmistir &mdash; ust onyargi yeniden ayarlanmasi yok.</div></div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">FLOAT16 (IEEE binary16)</div><div class="compare-item">• 1 + 5 + 10 bit</div><div class="compare-item">• Aralık $\\pm 6.55 \\times 10^4$ &mdash; dar</div><div class="compare-item">• Eps $\\sim 10^{-3}$ &mdash; bf16'dan daha cok hassasiyet</div><div class="compare-item">• 10 bit mantis = 3 ondalik hane</div><div class="compare-item">• Kucuk gradyanlar kolayca alttan tasar</div><div class="compare-item">• Egitim icin kayip olcekleme gerekir</div><div class="compare-item">• Orijinal donanim: NVIDIA Volta/Ampere Tensor Core</div></div>
<div class="compare-col"><div class="compare-title">BFLOAT16 (Google Brain)</div><div class="compare-item">• 1 + 8 + 7 bit</div><div class="compare-item">• Aralık $\\pm 3.4 \\times 10^{38}$ &mdash; float32 ile ayni</div><div class="compare-item">• Eps $\\sim 10^{-2}$ &mdash; daha kaba hassasiyet</div><div class="compare-item">• 7 bit mantis = 2 ondalik hane</div><div class="compare-item">• Pratikte tasma veya alttan tasma yok</div><div class="compare-item">• Kayip olcekleme gerekmez</div><div class="compare-item">• Donanim: TPU, A100/H100, MI300, Apple Neural Engine</div></div>
</div>

<p class="l-text"><strong>Derin gorus:</strong> derin ogrenme icin dinamik aralık hassasiyetten daha onemlidir. Bir sinir agi aktivasyon basina birkac ondalik hane gurultuye karsi saglamdir &mdash; model zaten milyonlarca agirlik uzerinden ortalama aliyor. Ama tek bir alttan tasmis gradyan (float16'da $g = 10^{-8}$ sifira yuvarlanir) ogrenmeyi sessizce oldurur. Bfloat16 float32 araligi tutar ve hassasiyet vurusunu kabul eder; float16 daha fazla hassasiyet tutar ve sabit tasma korkusuyla buna oder.</p>

<div class="l-note"><strong>Pratikte neden onemli:</strong> Andrej Karpathy nanoGPT'yi yayinladiginda, varsayilan egitim tarifi Ampere GPU'larda ve uzerinde <code>torch.bfloat16</code> kullaniyordu, hicbir kayip olcekleme yoktu. 2018-2020'deki onceki karisik-hassasiyet tarifleri (NVIDIA Apex, fairseq, orijinal Megatron-LM) dikkatle ayarlanmis dinamik kayip olcekleme ile float16 kullaniyordu. Tarif sadelesmesi &mdash; "bf16 sadece calisir" &mdash; 2020'lerin sessiz devrimlerinden biridir. Bf16'dan once takimda bir sayisal analist olmasi gerekirdi. Bf16'dan sonra bir bayrak cevirirsin.</div>

<h2 class="lesson-title">4. Felaket Iptali</h2>

<p class="l-text">Kayan nokta aritmetiginin sana ihanet edebilecegi tum yollar arasinda hicbiri <strong>felaket iptali</strong>nden daha sinsi degildir. $+\\infty$ veya NaN uretmez &mdash; ikisi de kendilerini yuksek sesle ilan eder. Iptal, anlamli hanelerinin cogunu yuvarlama hatasina kaybetmis kucuk, makul gorunen bir sayi uretir. Programin devam eder. Kaybin asağı iner. Sonra 200 adim sonra hicbir bariz sebep olmadan bir sey patlar. Dunyanin en cok hata ayiklanmis sayisal patolojisine hos geldin.</p>

<div class="calc-formula"><div class="formula-label">PATOLOJI</div><div class="formula-main">$$\\text{Eger}\\quad a \\approx b \\;\\;\\text{ve ikisi de}\\;\\; p \\;\\;\\text{haneye saklaniyorsa,}\\;\\; \\text{o zaman}\\;\\; a - b \\;\\;\\text{su kadar haneye sahiptir:}\\;\\; p - \\log_{10}\\!\\left(\\frac{a}{a - b}\\right)$$</div><div class="formula-sub">$a$ ve $b$ ilk $k$ hanesinde aynidirsa, $a - b$ iptalden $k$ hane kaybeder. Iki neredeyse esit sayiyi cikar ve sonuc esasen gurultudur.</div></div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK: IKI NEREDEYSE ESIT FLOAT32'YI CIKARMA</div><div class="example-body">Float32'de $a = 1.0000000$ ve $b = 0.9999999$ al. Her ikisi de yaklasik 7 anlamli haneye saklanir, yani her biri $10^{-7}$ mertebesinde goreli bir hataya sahiptir. Gercek fark $a - b = 10^{-7}$'dir &mdash; ama float32'de her isleneni gercek degerine $\\pm 10^{-7}$ icinde yuvarlandi, yani fark mutlak olarak yalnizca $10^{-7}$ mertebesinde dogrudur, yani $\\%100$ goreli hata. Anlamliligin yedi hanesinden alti tanesi <em>gitmistir</em>. Sonuc tek bir gurultulu hanedir.</div></div>

<p class="l-text">Cozum neredeyse her zaman cebirseldir. Iptal eden cikarmayi tani ve formulu iptal kacinilacak sekilde yeniden yaz. Klasik ornekler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karesel formul</div><div class="card-body">$x = (-b - \\sqrt{b^2 - 4ac})/(2a)$, $b > 0$ ve $b^2 \\gg 4ac$ oldugunda iptal eder. $x = -2c / (b + \\sqrt{b^2 - 4ac})$ olarak yeniden yaz &mdash; ayni kok, iptal yok.</div></div>
<div class="calc-card"><div class="card-title">Varyans</div><div class="card-body">$\\text{Var}(X) = E[X^2] - (E[X])^2$, verinin ortalamasina gore kucuk varyansi oldugunda iptal eder. Welford algoritmasi veya iki gecis kullan: $\\frac{1}{n}\\sum (x_i - \\bar x)^2$.</div></div>
<div class="calc-card"><div class="card-title">Softmax</div><div class="card-body">$\\sigma_i = e^{x_i}/\\sum_j e^{x_j}$, buyuk $x$ icin tasar. Once $\\max x$'i cikar &mdash; bu kilik degistirmis log-sum-exp hilesidir. Bolum 7'de turetiriz.</div></div>
<div class="calc-card"><div class="card-title">Kayip farklari</div><div class="card-body">Sonlu fark gradyanlari icin $\\nabla L = (L(\\theta + h) - L(\\theta))/h$, kucuk $h$'da felaketle iptal eder. Merkezlenmis fark veya otomatik turev kullan.</div></div>
</div>

<div id="plot-linalg-l7-cancellation-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var loss=[];var loss64=[];
for(var k=-15;k<=-1;k++){var h=Math.pow(10,k);xs.push(h);
var a=1.0;var b=1.0+h;
var diff32=Math.fround(b)-Math.fround(a);
var truediff=h;
var rel=Math.abs((diff32-truediff)/truediff);
loss.push(Math.max(rel,1e-16));
var diff64=b-a;
var rel64=Math.abs((diff64-truediff)/truediff);
loss64.push(Math.max(rel64,1e-16));}
var t1={x:xs,y:loss,mode:'lines+markers',name:'float32 goreli hata',line:{color:'#ef4444',width:2.5},marker:{size:7}};
var t2={x:xs,y:loss64,mode:'lines+markers',name:'float64 goreli hata',line:{color:'#3b82f6',width:2.5},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'cikarma bosluğu h ((1+h)-1 hesaplaniyor)',type:'log',gridcolor:'#1f2937'},yaxis:{title:'goreli hata |hesaplanan - gercek| / |gercek|',type:'log',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:70}};
Plotly.newPlot('plot-linalg-l7-cancellation-tr',[t1,t2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> felaket iptalinin yanilmaz imzasi. Hem float32 (kirmizi) hem float64'te (mavi) $(1 + h) - 1$ hesaplariz ve gercek cevap $h$ ile karsilastiririz. "Rahat" $h \\gtrsim 10^{-4}$ icin her iki bicim de esasen kesindir. $h$, her bicimin makine epsilonuna dogru kuculdukce &mdash; float32 icin $\\sim 10^{-7}$, float64 icin $\\sim 10^{-16}$ &mdash; goreli hata onluk basina onluk artar. $h$, $\\varepsilon$'in altina dustugunde sonuc saf gurultudur: $\\%100$ goreli hata. Cikarmasi: iki neredeyse esit float'in cikarilmasi, bicimin yedek olarak sahip oldugu kadar cok hassasiyeti atabilir.</div></div>

<h2 class="lesson-title">5. Kararli ve Kararsiz Algoritmalar: En Kucuk Kareler</h2>

<p class="l-text">Sayisal kararlilik <em>algoritmalarin</em> bir ozelligidir, problemlerin degil. Ayni matematiksel soru &mdash; "$\\min \\|Ax - b\\|^2$'yi cozun" &mdash; hem kararli hem de kararsiz algoritmalar kabul eder. Dogru olani secmek, mantikli bir katsayi donduren bir regresyon ile cop donduren biri arasindaki farktir. Modern kutuphaneler (NumPy, SciPy, scikit-learn) bu secimi senden varsayilan olarak gizler ama parametreler ve uyarilar araciliyla acar.</p>

<div class="calc-formula"><div class="formula-label">EN KUCUK KARELER PROBLEMI</div><div class="formula-main">$$\\min_{x \\in \\mathbb{R}^n}\\; \\|A x - b\\|^2, \\qquad A \\in \\mathbb{R}^{m \\times n}, \\quad m \\geq n$$</div><div class="formula-sub">Klasik kurulum: $m$ veri noktasi, $n$ ozellik, dogrusal model oturt. En kucuk karesel kalintilari saglayan $x$'i istiyoruz. Gradyani sifira ayarlamaktan kapali bicimli cozum <strong>normal denklemleri</strong> verir.</div></div>

<div class="calc-formula"><div class="formula-label">YONTEM 1 &mdash; NORMAL DENKLEMLER (KARARSIZ)</div><div class="formula-main">$$A^T A\\, x \\;=\\; A^T b \\qquad \\Longrightarrow \\qquad x \\;=\\; (A^T A)^{-1} A^T b$$</div><div class="formula-sub">Matematiksel olarak dogru, iki satir kod, hizli. Ama $A^T A$'nin kosul sayisi $A$'nin kosul sayisinin <strong>karesi</strong>dir. Eger $\\kappa(A) = 10^6$ ise $\\kappa(A^T A) = 10^{12}$ ve float64'te 12 hane hassasiyet kaybedersin &mdash; felaket.</div></div>

<div class="calc-formula"><div class="formula-label">YONTEM 2 &mdash; QR AYRISMASI (KARARLI)</div><div class="formula-main">$$A \\;=\\; Q R, \\qquad Q^T Q = I, \\quad R\\;\\text{ust uggen} \\qquad \\Longrightarrow \\qquad R x \\;=\\; Q^T b$$</div><div class="formula-sub">Householder yansimalari veya degistirilmis Gram-Schmidt yoluyla QR'yi hesapla (asla klasik Gram-Schmidt degil &mdash; Bolum 3'e bakin). Uggensel cozumun kosulu $\\kappa(A)^2$ degil $\\kappa(A)$ tarafindan yonetilir. Normal denklemlerin iki kati is, ama herhangi bir makul problem icin kararli.</div></div>

<div class="calc-formula"><div class="formula-label">YONTEM 3 &mdash; SVD (EN KARARLI)</div><div class="formula-main">$$A \\;=\\; U \\Sigma V^T \\qquad \\Longrightarrow \\qquad x \\;=\\; V \\Sigma^+ U^T b$$</div><div class="formula-sub">SVD'yi hesapla, sifir olmayan tekil degerleri tersine cevir, carp. Rank eksik $A$ icin bile calisir &mdash; sahte ters minimum-norm cozumu verir. <code>numpy.linalg.lstsq</code>'in varsayilani.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Normal denklemler</div><div class="card-body">Maliyet $O(mn^2 + n^3)$. $\\log_{10}(\\kappa(A)^2)$ hane kaybeder. Yalnizca float64'te $\\kappa(A) < 10^4$ oldugunda kabul edilebilir. Float32'de asla kullanma.</div></div>
<div class="calc-card"><div class="card-title">QR (Householder)</div><div class="card-body">Maliyet $O(2mn^2)$. $\\log_{10}(\\kappa(A))$ hane kaybeder. Iyi kosullanmis problemlerde <code>scipy.linalg.lstsq(method='gelsd')</code>'in varsayilani.</div></div>
<div class="calc-card"><div class="card-title">SVD</div><div class="card-body">Daha buyuk sabit ile $O(mn^2 + n^3)$ maliyet. En kararli; tekil ve rank eksik $A$'yi yonetir. Guvenlik icin <code>numpy.linalg.lstsq</code>'in varsayilani.</div></div>
<div class="calc-card"><div class="card-title">Iterativ (CG)</div><div class="card-body">Buyuk seyrek $A$ icin, $A^T A x = A^T b$ uzerinde duzenli Eslenik Gradyan kullan. Asla $A^T A$'yi acikca olusturma; iki kez carp.</div></div>
</div>

<div class="l-note"><strong>Genel kural.</strong> Elden bir en-kucuk-kareler cozucu yaziyorsan, asla $A^T A$'yi ters cevirme. Her zaman QR veya SVD'den gec. Klasik Gauss/Legendre formulu $(A^T A)^{-1} A^T b$ kagit uzerinde dogrudur, kodda tehlikelidir. Stack Overflow'taki "regresyonum cilginca kararsiz" sorularinin yarisi bu hatadir.</div>

<h2 class="lesson-title">6. Kosul Sayisi</h2>

<p class="l-text">Bir matrisin <strong>kosul sayisi</strong>, $A x = b$'yi cozdugunde $b$'deki giris hatasinin cikis $x$'te ne kadar buyuyecegini soyler. Hangi yontemi sectiginden bagimsiz olarak bir problemin sayisal bir cozucu icin "kolay" mi yoksa "zor" mu oldugunu belirleyen tek sayidir.</p>

<div class="calc-formula"><div class="formula-label">TEKIL DEGERLER ARACILIYLA KOSUL SAYISI</div><div class="formula-main">$$\\kappa(A) \\;=\\; \\frac{\\sigma_{\\max}(A)}{\\sigma_{\\min}(A)} \\;=\\; \\|A\\| \\cdot \\|A^{-1}\\|$$</div><div class="formula-sub">En buyuk ile en kucuk tekil degerin orani. Sagdaki operator-normu carpimina esdegerdir. Diksenel bir matris icin $\\kappa = 1$ &mdash; mukemmel kosullanmis. Tekil bir matris icin $\\kappa = \\infty$. Gercek dunya LLM agirlik matrisleri $10^3$-$10^6$ araliginda yer alir.</div></div>

<div class="calc-formula"><div class="formula-label">HATA BUYUTME SINIRI</div><div class="formula-main">$$\\frac{\\|\\delta x\\|}{\\|x\\|} \\;\\leq\\; \\kappa(A) \\cdot \\frac{\\|\\delta b\\|}{\\|b\\|}$$</div><div class="formula-sub">$b$'de $\\varepsilon$ boyutlu goreli bir bozulma, $x$ cozumunde $\\kappa(A) \\cdot \\varepsilon$'a kadar goreli bir hata uretebilir. $\\kappa = 10^6$ ve float32 yuvarlama $\\varepsilon \\sim 10^{-7}$ ile cevabin ilk ondalik hanesinde yanlis olmasini bekleyebilirsin.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Iyi kosullanmis</div><div class="card-body">$\\kappa < 10^3$. Problem temiz davranir. Float32 veya float64'te herhangi bir makul yontem calisir.</div></div>
<div class="calc-card"><div class="card-title">Orta derecede kotu kosullu</div><div class="card-body">$10^3 < \\kappa < 10^8$. Kararli yontemler (QR, SVD) ve float64 kullan. Float32 gorulebilir haneler kaybeder.</div></div>
<div class="calc-card"><div class="card-title">Ciddi sekilde kotu kosullu</div><div class="card-body">$10^8 < \\kappa < 10^{14}$. Mumkunse problemi yeniden formule et: duzenle (Ridge, Tikhonov), daha kucuk bir alt uzaya yansit, taban degistir.</div></div>
<div class="calc-card"><div class="card-title">Pratikte tekil</div><div class="card-body">Float64'te $\\kappa > 10^{14}$. Matris sayisal olarak rank eksiktir; cevap anlamsizdir. Kesik SVD veya rank gosterici kullan.</div></div>
</div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK: HILBERT MATRISI</div><div class="example-body">$H_{ij} = 1/(i + j - 1)$ olan Hilbert matrisi $H$ klasik kotu kosullu testtir. $n = 5$ icin bile $\\kappa(H) \\approx 4.8 \\times 10^5$. $n = 10$ icin $\\kappa \\approx 1.6 \\times 10^{13}$ &mdash; float64'un hassasiyet sinirinin otesinde. $n = 12$ icin float64'te $H x = b$ cozmek esasen rastgele gurultu olan cevaplar dondurur; matris analitik olarak ters cevrilebilir olsa da sayisal olarak tekildir. Hilbert matrisi tam olarak "kesin" ve "sayisal" rank arasindaki bu bosluk nedeniyle unludur.</div></div>

<div id="plot-linalg-l7-condition-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var kappa=[];var err32=[];var err64=[];
for(var k=0;k<=14;k++){var c=Math.pow(10,k);kappa.push(c);
var roundoff32=1.19e-7;
var roundoff64=2.22e-16;
err32.push(Math.min(c*roundoff32,1));
err64.push(Math.min(c*roundoff64,1));}
var t1={x:kappa,y:err32,mode:'lines+markers',name:'float32 (eps ~ 1.2e-7)',line:{color:'#ef4444',width:2.5},marker:{size:7}};
var t2={x:kappa,y:err64,mode:'lines+markers',name:'float64 (eps ~ 2.2e-16)',line:{color:'#3b82f6',width:2.5},marker:{size:7}};
var t3={x:[1,1e14],y:[0.01,0.01],mode:'lines',name:'%1 hata esigi',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'kosul sayisi kappa(A)',type:'log',gridcolor:'#1f2937'},yaxis:{title:'cozumdeki beklenen goreli hata',type:'log',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:70}};
Plotly.newPlot('plot-linalg-l7-condition-tr',[t1,t2,t3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> grafiksel hale getirilmis genel kural. Float32'de (kirmizi) ve float64'te (mavi) $A x = b$ cozulurken $x$'teki beklenen goreli hatayi $\\kappa(A)$ kosul sayisinin bir fonksiyonu olarak cizeriz. Hata $\\kappa$ ile dogrusal olarak buyudugu icin her cizgi log-log ekseninde 1 egime sahiptir. Turuncu kesik esik $\\%1$ hatayi isaretler &mdash; bir muhendislik sonucunun guvenilmez hale geldigi nokta. Float32 bu esige $\\kappa \\approx 10^5$'te ulasir; float64 $\\kappa \\approx 10^{14}$'te ulasir. Iki cizgi arasindaki dikey bosluk &mdash; kabaca 9 buyukluk derecesi &mdash; iki bicim arasindaki kesin hassasiyet farkidir. Float32'den float64'e "yukseltirsen", 9 onluk kotu-kosul toleransi satin alirsin.</div></div>

<h2 class="lesson-title">7. Log-Sum-Exp Hilesi</h2>

<p class="l-text">Derin ogrenmede ortaya cikan tum kucuk sayisal ozdesliklerden hicbiri <strong>log-sum-exp</strong>'ten daha onemli degildir. Sayisal olarak kararli her softmax'in, her cross-entropy kaybinin, NLP'deki her log-olasilik hesabinin, her dikkat olceklemesinin temelidir. PyTorch'ta <code>F.cross_entropy</code> cagirdiysan, altta log-sum-exp calistirmissindir.</p>

<div class="calc-formula"><div class="formula-label">SORUN</div><div class="formula-main">$$\\text{LSE}(x_1, \\ldots, x_n) \\;=\\; \\log\\!\\left(\\sum_{i=1}^{n} e^{x_i}\\right)$$</div><div class="formula-sub">Ustellerin toplaminin log'unu hesapla. Matematiksel olarak zararsiz, sayisal olarak felaket: float32'de $x_i > 89$ icin, float16'da $x_i > 11$ icin $e^{x_i}$ tasar. Tek bir buyuk logit tum toplami zehirler.</div></div>

<div class="calc-formula"><div class="formula-label">HILE &mdash; MAKSIMUMU DISARI CIKAR</div><div class="formula-main">$$\\text{LSE}(x) \\;=\\; M + \\log\\!\\left(\\sum_{i=1}^{n} e^{x_i - M}\\right), \\qquad M \\;=\\; \\max_i x_i$$</div><div class="formula-sub">Cebirsel ozdeslik, yaklasik degil. Kaydirilmis ustler $e^{x_i - M}$ hepsi $\\leq 1$, yani toplam $1$ ile $n$ arasinda sinirli. Tasma mumkun degil. Sonundaki tek $\\log$ tum dinamik aralığı yonetir ve kendisi $[1, n]$'deki girdilerde iyi davranır.</div></div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK: (1000, 1001, 999) LSE'SI</div><div class="example-body"><strong>Saf:</strong> $e^{1000} + e^{1001} + e^{999}$. Float32'de uc terim de $+\\infty$'a tasar. Sonuc: $\\log(\\infty) = \\infty$.<br><br><strong>Hile:</strong> $M = 1001$. Kaydır: $(-1, 0, -2)$. Ustel al: $(e^{-1}, 1, e^{-2}) = (0.368, 1, 0.135)$. Topla: $1.503$. Log: $0.408$. $M$ ekle: $1001 + 0.408 = 1001.408$. Mantikli, dogru, tasma yok.</div></div>

<p class="l-text">Ayni ozdeslik <strong>softmax</strong>'i kararli kilar. Softmax $\\sigma_i = e^{x_i} / \\sum_j e^{x_j}$'yi hesaplar. Ustellestirmeden once her $x_i$'den $M$ cikar; oran degismez cunku $e^{x_i - M} / \\sum_j e^{x_j - M} = e^{x_i} e^{-M} / \\sum_j e^{x_j} e^{-M}$. Her modern softmax uygulamasi bu kaydirmayi icsel olarak yapar ve her modern dikkat katmani tam olarak bu nedenle softmax'ten once logitlerin maksimumunu cikarir.</p>

<div class="calc-formula"><div class="formula-label">SAYISAL OLARAK KARARLI SOFTMAX</div><div class="formula-main">$$\\sigma_i(x) \\;=\\; \\frac{e^{x_i - M}}{\\sum_{j} e^{x_j - M}}, \\qquad M = \\max_j x_j$$</div><div class="formula-sub">Matematiksel olarak saf bicimle ozdes. En buyuk ust artik $0$ oldugundan tasamaz. En azindan bir terim $e^0 = 1$'e esit oldugundan paydayi sabitler, felaketle alttan tasamaz.</div></div>

<div id="plot-linalg-l7-lse-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Ms=[];var naive=[];var stable=[];
for(var k=0;k<=120;k++){var M=k;Ms.push(M);
var s1=Math.exp(M)+Math.exp(M-1)+Math.exp(M-2);
naive.push(isFinite(s1)?Math.log(s1):300);
var shifted=1+Math.exp(-1)+Math.exp(-2);
stable.push(M+Math.log(shifted));}
var t1={x:Ms,y:naive,mode:'lines+markers',name:'saf log(toplam exp)',line:{color:'#ef4444',width:2.5},marker:{size:5}};
var t2={x:Ms,y:stable,mode:'lines+markers',name:'log-sum-exp hilesi',line:{color:'#3b82f6',width:2.5},marker:{size:5}};
var t3={x:[88.7,88.7],y:[0,250],mode:'lines',name:'float32 tasma cizgisi (x~88.7)',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'M (logitlerde kaydirma)',gridcolor:'#1f2937'},yaxis:{title:'hesaplanan LSE degeri',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:70}};
Plotly.newPlot('plot-linalg-l7-lse-tr',[t1,t2,t3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> log-sum-exp tarafindan onlenen felaket. $M$ icin $(M, M-1, M-2)$ basit girdisinde $0$'dan $120$'ye kadar LSE hesapliyoruz. Gercek cevap yaklasik $M + 0.408$'dir &mdash; egim 1 olan duz bir cizgi. Mavi iz, log-sum-exp hilesini kullanarak bu cizgiyi mukemmel sekilde izler. Saf formulu kullanan kirmizi iz kucuk $M$ icin anlasir ama $M \\approx 88.7$'da kirilir &mdash; tam olarak float32'de $e^{x}$'in tasma sinir. Bu noktayi gectikten sonra saf cevap $+\\infty$'da duraklar. Gercek dunya Transformer logitleri sik sik son softmax'ten once $M \\sim 30$'a ulasir; karisik hassasiyette kaydirilmis olmayan versiyonun sessizce tasmasi icin patolojik bolgede olman gerekmez.</div></div>

<h2 class="lesson-title">8. Karisik Kesinlik Egitimi &mdash; Buyuk Muhendislik Hikayesi</h2>

<p class="l-text">Karisik-kesinlik egitimi modern derin ogrenmedeki baskin maliyet tasarrufu teknigidir. Hiz ve bellek icin agirliklari ve gradyanlari 16-bit (float16 veya bfloat16) olarak egit, sayisal guvenlik icin agirligin 32-bit ana kopyasini tut. Float16 ile, kucuk gradyanlari temsil edilebilir araliga itmek icin <strong>kayip olcekleme</strong>ye de ihtiyacin var. Bfloat16 ile genellikle ihtiyacin yok. Tarif ilk olarak Micikevicius vd. (NVIDIA, 2018) tarafindan yayinlandi, NVIDIA Apex kutuphanesi olarak gonderildi, sonra 2020'de PyTorch'a <code>torch.cuda.amp</code> ve 2024'te birlesik <code>torch.amp</code> olarak emildi.</p>

<div class="calc-formula"><div class="formula-label">FP16 KARISIK HASSASIYET HATTI</div><div class="formula-main">$$\\text{ileri:}\\;\\; \\hat y \\;=\\; \\text{model}_{\\text{fp16}}(x_{\\text{fp16}}), \\qquad L \\;=\\; \\text{kayip}_{\\text{fp32}}(\\hat y, y)$$ $$\\text{olcekle:}\\;\\; \\tilde L \\;=\\; S \\cdot L \\qquad (S \\sim 2^{15})$$ $$\\text{geri:}\\;\\; \\tilde g \\;=\\; \\nabla_\\theta \\tilde L \\;\\;\\;\\text{(fp16'da, }S\\text{ ile olceklendi)}$$ $$\\text{olcek kaldir + guncelle:}\\;\\; g \\;=\\; \\tilde g / S, \\qquad \\theta_{\\text{fp32}} \\;\\leftarrow\\; \\theta_{\\text{fp32}} - \\eta\\, g$$</div><div class="formula-sub">Bes adim. Hiz icin ileri gecis ve gradyan hesaplamasi fp16'da olur; kaybin kendisi tasmayi onlemek icin fp32'de hesaplanir; kucuk gradyanlarin fp16 yuvarlama tabaninda hayatta kalmasi icin kayip backprop'tan once $S \\sim 2^{15}$ ile carpilir; gradyanlar fp32 ana agirliklarini guncellemeden once $S$'ye bolunur. Fp32 ana siradaki ileri gecis icin fp16'ya yuvarlanir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fp32'de ana agirliklar</div><div class="card-body">Optimize ediciler (Adam, SGD) momentum ve ikinci moment tahminlerini biriktirir. Bunu fp16'da yapmak binlerce guncellemeden sonra hassasiyet kaybeder. Ana kopyayi fp32'de tut; sadece ileri/geri icin fp16'ya yuvarla.</div></div>
<div class="calc-card"><div class="card-title">Kayip olcekleme carpani $S$</div><div class="card-body">Iki'nin kuvvetleriyle yukari itilir (her $2000$ adimda $2^{15}$'te basla, tasma yoksa ikiye katla). NaN/Inf tespit edildiginde $S$'yi yarıya indir ve kotu adimi atla. Bu <strong>dinamik kayip olcekleme</strong> NVIDIA Apex'in otomatik yaptigidir.</div></div>
<div class="calc-card"><div class="card-title">Hangi islemler fp32'de kalir</div><div class="card-body">Batch normalleştirme istatistikleri, softmax, log-sum-exp, layer norm &mdash; indirgenmeli veya ustelli herhangi bir sey. PyTorch AMP autocast bir izin/yasak listesini takip eder ve anında cast eder.</div></div>
<div class="calc-card"><div class="card-title">Bf16 sadelesmesi</div><div class="card-body">Bfloat16 ile, hem ileri hem geri hicbir kayip olceklemesi olmadan bf16'da kalir. Ana agirliklar hala fp32'de. Bu, Karpathy'nin nanoGPT'sinin H100'larda varsayilan olarak kullandigi tariftir.</div></div>
</div>

<div id="plot-linalg-l7-amp-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var steps=[];var lossFp32=[];var lossFp16NoScale=[];var lossFp16Scale=[];var lossBf16=[];
for(var k=0;k<=200;k++){var s=k;steps.push(s);
var L=2.5*Math.exp(-0.018*s)+0.4+0.02*Math.sin(0.3*s);
lossFp32.push(L);
var gradMag=Math.abs(2.5*0.018*Math.exp(-0.018*s));
var underflow16=gradMag<6.1e-5;
if(underflow16 && k>40){lossFp16NoScale.push(lossFp16NoScale[lossFp16NoScale.length-1]+0.003);} else {lossFp16NoScale.push(L+0.05+0.04*Math.sin(0.4*s));}
lossFp16Scale.push(L+0.02+0.02*Math.sin(0.5*s));
lossBf16.push(L+0.015+0.018*Math.sin(0.6*s));}
var t1={x:steps,y:lossFp32,mode:'lines',name:'fp32 temel',line:{color:'#10b981',width:2.5}};
var t2={x:steps,y:lossFp16NoScale,mode:'lines',name:'fp16 kayip olceklemesi yok (durur!)',line:{color:'#ef4444',width:2,dash:'dash'}};
var t3={x:steps,y:lossFp16Scale,mode:'lines',name:'fp16 kayip olceklemeli',line:{color:'#3b82f6',width:2}};
var t4={x:steps,y:lossBf16,mode:'lines',name:'bf16 (olcekleme gerekmez)',line:{color:'#f59e0b',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'egitim adimi',gridcolor:'#1f2937'},yaxis:{title:'kayip',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:50,r:30,b:50,l:60}};
Plotly.newPlot('plot-linalg-l7-amp-tr',[t1,t2,t3,t4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gosteriyor:</strong> ayni modelin farkli sayisal tariflerle dort egitim calismasi. Yesil fp32 temel altin standardır &mdash; guvenilir ama yavas ve bellek-ac. Mavi kayip-olceklemeli fp16 izi ona neredeyse tam olarak uyar, Volta sınıfı donanimda yari bellek ve cift hizda. Turuncu bf16 izi daha az caba ile esit derecede iyi davranır: kayip olceklemesi yok, ana-agirlik dert yok. Kirmizi kayip-olceklemesiz fp16 izi uyaridir: gradyan buyukluğu fp16 temsil edilebilir tabanin ($\\sim 6 \\times 10^{-5}$) altina dustugunde, gradyanlar sifira iner, optimize edici guncellenmeyi durdurur ve kayip duraklar. Bu, kayip-olcekleme tarifinin onarmak icin icat edildigi basarisizlik modudur.</div></div>

<h2 class="lesson-title">9. Gradyan Kirpma</h2>

<p class="l-text">Karisik hassasiyet ve gradyan patlamasi eski dostlardir. Kayan nokta matematigi buyuk degerlere duyarlidir; bir RNN veya Transformer'in icindeki aktivasyonlar erken egitim sirasinda sinirsiz buyuyebilir ve karsilik gelen gradyanlar daha da buyuk olabilir. <strong>Gradyan kirpma</strong> basit mudahaledir: gradyan normu bir esigi $\\tau$ asarsa, yonunu bozmadan onu $\\tau$ uzunluğuna yeniden olceklendir.</p>

<div class="calc-formula"><div class="formula-label">GRADYAN KIRPMA (KURESEL NORMA GORE)</div><div class="formula-main">$$g \\;\\leftarrow\\; \\min\\!\\left(1, \\; \\frac{\\tau}{\\|g\\|}\\right) \\cdot g$$</div><div class="formula-sub">$\\|g\\| \\leq \\tau$ ise $g$'yi rahat birak. $\\|g\\| > \\tau$ ise onu $\\tau$ uzunluğuna kucult. Yon $g/\\|g\\|$ korunur. Standart uygulama: Transformer egitimi icin $\\tau = 1.0$, RNN'ler icin $\\tau = 0.25$ veya $0.5$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Degere ve norma gore</div><div class="card-body">"Degere gore" her bileseni $[-\\tau, \\tau]$'ya kirpar &mdash; yonu bozar. "Kuresel norma gore" tum vektoru yeniden olcekler &mdash; yonu korur. Ikincisi ezici sekilde tercih edilir.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kirpilmali</div><div class="card-body">Fp16 gradyanlarinin olceği kaldirildiktan sonra ama optimize edici adimindan once. PyTorch: <code>torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)</code>. AMP olceği <code>scaler.unscale_(optimizer)</code> icinde otomatik kaldirir.</div></div>
<div class="calc-card"><div class="card-title">Fp16'ya neden yardim eder</div><div class="card-body">Tek bir patlayan gradyan, gradyan normunu $> 10^4$'e itebilir, ki bu kayip olcekleme sonrasi fp16 tasma bolgesine duser. Kirpma bir sonraki yinelemeden once maksimum degeri kapatir, dinamik aralığı sinirli tutar.</div></div>
<div class="calc-card"><div class="card-title">Neden her zaman kirpilmaz</div><div class="card-body">Buyuk LLM'ler icin cok agresif kirpma (kucuk $\\tau$) ogrenmeyi bogar. $\\sim 1$B parametreli modeller icin mevcut genel kural $\\tau = 1.0$; $> 70$B parametre icin ekipler bazen $\\tau = 0.5$'e gider veya uyarlamali semalar kullanir.</div></div>
</div>

<h2 class="lesson-title">10. NaN ve Inf Hata Ayiklama</h2>

<p class="l-text">NaN gorundugunde, egitim sessizce olur &mdash; her sonraki gradyan NaN, her agirlik guncellemesi NaN, her kayip NaN. Yapilacak ilk sey onu ureten islemi bulmaktir. Ikincisi kok nedeni duzeltmek, semptomu yamamak degil.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sifira bolme</div><div class="card-body">Normalleştirmelerde yaygındir: birinin $\\varepsilon$'i unuttuğu $x / \\sqrt{\\text{var} + \\varepsilon}$. Cozum: sifir olabilecek herhangi bir paydaya kucuk bir epsilon ($10^{-5}$ ila $10^{-8}$) ekle.</div></div>
<div class="calc-card"><div class="card-title">Sifirin veya negatifin logu</div><div class="card-body">Cross-entropy: $\\hat p = 0$ oldugunda $-\\log(\\hat p)$ patlar. Cozum: $\\hat p \\geq \\varepsilon$ olarak sikistir veya softmax + log yerine log-softmax kullan veya yerlesik cross-entropy kullan.</div></div>
<div class="calc-card"><div class="card-title">Buyuk pozitifin ust ali</div><div class="card-body">Herhangi bir float bicimde $e^{1000} = +\\infty$. Cozum: log-sum-exp hilesi. Ustellestirmeden once maksimumu cikar. Cogu modern softmax/dikkat bunu icsel olarak yapar.</div></div>
<div class="calc-card"><div class="card-title">Gradyan patlamasi</div><div class="card-body">RNN'lerde ve erken Transformer egitimi sirasinda. Cozum: $\\tau = 1.0$'da gradyan kirpma. Ayrica daha iyi baslatma (Xavier/Kaiming) kullan ve ogrenme oranini isit.</div></div>
<div class="calc-card"><div class="card-title">Sifir gradyan + Adam</div><div class="card-body">Adam ikinci momentlerin karekoküne boler; bir parametrenin gradyani birçok adim icin tam olarak sifirsa, EMA cöker ve bolme patlar. Cozum: kucuk Adam epsilonu ($10^{-8}$).</div></div>
<div class="calc-card"><div class="card-title">Fp16 alttan tasma</div><div class="card-body">Kucuk ama sifir olmayan bir gradyan fp16'da tam sifira gider. Optimize edici uzerinden carpildiginda bu sik sik NaN uretir. Cozum: daha buyuk kayip olceği veya bf16'ya gec.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PYTORCH NAN BULMA TARIFI</div><div class="formula-main">$$\\texttt{torch.autograd.set\\_detect\\_anomaly(True)}$$</div><div class="formula-sub">Daha yavas calisir ama NaN ureten tam islemde, kaynak satirini gosteren bir yığın izini ile bir hata firlatir. NaN ortaya cikar ortaya cikmaz bu bayrak etkin sekilde calistir; cozum tamamlandiginda kapat.</div></div>

<div class="l-note"><strong>Profesyonel hata ayiklama dongusu.</strong> Adim 1: her adimda gradyan normlarini ve aktivasyon normlarini gunlukle. Adim 2: NaN gorunduğunde, bir önceki adima bak &mdash; en buyuk aktivasyon neydi? En buyuk gradyan? Adim 3: <code>detect_anomaly</code>'yi ac ve son iyi kontrol noktasindan yeniden calistir. Adim 4: islemi tanimla (neredeyse her zaman bir log, exp, bolme veya sqrt). Adim 5: eps ekle, kirp veya hassasiyeti degistir. Adim 6: yeniden calistir ve duzeltmenin orijinal surenin 10 katinda dayandığını dogrula, sonra zaferi ilan et.</div>

<h2 class="lesson-title">11. AI Baglantisi: Bu Niye ML Icin Onemli</h2>

<p class="l-text">Modern ML'de sayisal kararlilik hikayesi olcekte muhendislik kazanimlarinin hikayesidir. Her ikiye katlanmis veri yolu, her yariya inmis bellek ayak izi, her onlenen NaN, on saf laboratuvar olceginde milyonlarca dolar hesaplama degerindedir. Muhtemelen karsilastigin isimler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NVIDIA Apex (2018)</div><div class="card-body">Ilk genis kabulu olan fp16 karisik-hassasiyet kutuphanesi. Daha geniş ML dunyasina dinamik kayip olceklemeyi ve fp32'de ana agirliklari tanitti. Simdi yerlesik PyTorch AMP ile yerini aldı.</div></div>
<div class="calc-card"><div class="card-title">PyTorch torch.amp</div><div class="card-body">Modern birlesik API: <code>autocast()</code> baglam yoneticisi + <code>GradScaler()</code>. Fp16 ve bf16'yi destekler. 2021'den itibaren her uretim egitim calismasindaki tarif.</div></div>
<div class="calc-card"><div class="card-title">Google TPU / bfloat16</div><div class="card-body">v2'den (2017) itibaren TPU'lar bfloat16'yi yerli hesaplama bicimi olarak kullanir. Kayip olceklemesi yok. JAX ve TensorFlow bf16'yi birinci sinif dtype olarak acar. TPU soyu bf16'yi ana akima getirdi.</div></div>
<div class="calc-card"><div class="card-title">Karpathy nanoGPT</div><div class="card-body">Kucuk, okunabilir GPT egitim deposu. Varsayilan yapilandirma A100+ donaniminda bfloat16'yi hicbir kayip olceklemesi olmadan, $1.0$'da gradyan kirpma ve AdamW ile kullanir. Var olan en basit uretim kalitesindeki tarif.</div></div>
<div class="calc-card"><div class="card-title">FP8 egitimi (H100)</div><div class="card-body">NVIDIA Hopper 2022'de fp8'i (e4m3 ve e5m2 varyantlari) tanitti. Transformer Engine kutuphanesi fp8'i kararli kilmak icin gereken tensor-basina olceklemeyi yonetir. Meta Llama 3 70B egitimi ve digerleri tarafindan kullaniliyor.</div></div>
<div class="calc-card"><div class="card-title">Flash Attention</div><div class="card-body">Dao vd. 2022. Softmax'i matris carpimlariyla birlestiren ve karolar arasinda log-sum-exp'i tekrarli kullanan dikkatin yeniden uygulamasi. Bellegi $O(N^2)$'den $O(N)$'ye keser, ayni sayisal cevap. Sayisal kararlilik ve IO farkindaligi birlesti.</div></div>
</div>

<p class="l-text">Geri adim at ve patern netlesir: 2017'den beri her büyük donanim nesli hassasiyeti aşağı itti (fp32 → fp16/bf16 → fp8 → fp4 deneysel olarak) ve her nesil yeni bicimi egitilebilir kilmak icin karsilik gelen bir sayisal-kararlilik icadina ihtiyac duydu. Ders "daha yuksek hassasiyet kullan" degil. Ders "hassasiyeti operasyona uydur ve hassasiyet gereken operasyonlari koru" oldu. Ileri gecis: dusuk hassasiyet iyidir. Kayip biriktirme: fp32 gerekir. Optimize edici durumu: fp32 gerekir. Normalleştirme istatistikleri: fp32 gerekir. Diger her sey: verim icin asağı cast. Bu, torch.amp, JAX'in karisik hassasiyet politikalari ve TensorFlow'un <code>mixed_precision</code> modulunun arkasindaki tasarim felsefesidir.</p>

<div class="l-warn"><strong>Bir mantra al gotur.</strong> Aktivasyonlarinin fp16 mi bf16 mi oldugu modelin umurunda degil. Optimize edicinin umurunda. Kaybin umurunda. Indirgemelerin umurunda. Verinin geniş ve sığ olduğu yerlerde (matris carpimlari, evrişimler) dusuk hassasiyete ulaş; verinin dar ve derin olduğu yerlerde (indirgemeler, normalleştirmeler, optimize edici durumu) tam hassasiyette israr et. Bu bolunmeyi icsellestirdikten sonra, tum karisik-hassasiyet tarifi herhangi bir modern cercevedeki tek satirlik bir API cagrisi olur.</div>

<h2 class="lesson-title">12. Pratik Pyodide Alistirmasi</h2>

<p class="l-text">Sira sende. Asağıdaki kod Pyodide aracılığıyla tamamen tarayicında calisir. Bu dersin dort sutununu sırayla yurur: kucuk bir indirgemede float32'ye karsı float16 hassasiyetini karsilastir; log-sum-exp hilesini sifirdan uygula ve saf softmax ile karsilastir; kotu-kosullu bir dogrusal sistemi uc farkli yolla coz ve hatalarin nasil ayrildigini izle; ve son olarak patlayan gradyanlari simule et ve onlari evcilleştirmek icin kirpma uygula. Calistir, ciktilari oku, sonra parametreleri (ornek sayisi, kosul sayilari, kirpma esikleri) degiştir ve matematigin seninle birlikte degistigini izle.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># ============================================================</span>
<span class="cm"># 1. FLOAT32 ve FLOAT16 HASSASIYETI &mdash; calisan ortalama</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"=== 1. Hassasiyet karsilastirmasi: 1e5 sayinin ortalamasi ==="</span>)
n = <span class="num">100_000</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
data64 = rng.<span class="fn">standard_normal</span>(n).<span class="fn">astype</span>(np.float64) + <span class="num">1000.0</span>
data32 = data64.<span class="fn">astype</span>(np.float32)
data16 = data64.<span class="fn">astype</span>(np.float16)

avg64 = data64.<span class="fn">mean</span>()
avg32 = data32.<span class="fn">mean</span>()
avg16 = data16.<span class="fn">astype</span>(np.float16).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">f"float64 ortalama: {avg64:.10f}"</span>)
<span class="fn">print</span>(<span class="str">f"float32 ortalama: {avg32:.10f}  (fp64'e karsi hata: {abs(avg32-avg64):.2e})"</span>)
<span class="fn">print</span>(<span class="str">f"float16 ortalama: {avg16:.10f}  (fp64'e karsi hata: {abs(avg16-avg64):.2e})"</span>)

<span class="cm"># Beklenen: fp32 hatasi ~ 1e-5, fp16 hatasi ~ 1.0 &mdash; fp16 5 hane kaybeder!</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 2. LOG-SUM-EXP &mdash; saf vs kararli</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== 2. Buyuk logitlerde log-sum-exp ==="</span>)

<span class="kw">def</span> <span class="fn">naive_lse</span>(x):
    <span class="kw">return</span> np.<span class="fn">log</span>(np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(x)))

<span class="kw">def</span> <span class="fn">stable_lse</span>(x):
    M = np.<span class="fn">max</span>(x)
    <span class="kw">return</span> M + np.<span class="fn">log</span>(np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(x - M)))

logits_small = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">3.0</span>])
logits_large = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">999.0</span>])

<span class="fn">print</span>(<span class="str">f"Kucuk logitler (1, 2, 3):"</span>)
<span class="fn">print</span>(<span class="str">f"  saf    : {naive_lse(logits_small):.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"  kararli: {stable_lse(logits_small):.6f}"</span>)

<span class="fn">print</span>(<span class="str">f"\\nBuyuk logitler (1000, 1001, 999):"</span>)
<span class="kw">try</span>:
    val = <span class="fn">naive_lse</span>(logits_large)
    <span class="fn">print</span>(<span class="str">f"  saf    : {val}"</span>)
<span class="kw">except</span> <span class="fn">FloatingPointError</span> <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">f"  saf    : firlatti {e}"</span>)
<span class="fn">print</span>(<span class="str">f"  kararli: {stable_lse(logits_large):.6f}"</span>)

<span class="cm"># Kararli versiyon 1001.408 verir &mdash; dogru. Saf +inf'a tasar.</span>

<span class="cm"># Log-sum-exp araciligiyla sayisal olarak kararli softmax:</span>
<span class="kw">def</span> <span class="fn">stable_softmax</span>(x):
    M = np.<span class="fn">max</span>(x)
    e = np.<span class="fn">exp</span>(x - M)
    <span class="kw">return</span> e / np.<span class="fn">sum</span>(e)

<span class="fn">print</span>(<span class="str">f"\\nBuyuk logitlerin kararli softmax: {stable_softmax(logits_large)}"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 3. KOTU-KOSULLU DOGRUSAL SISTEM &mdash; uc yontem</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== 3. Kotu-kosullu dogrusal sistem (Hilbert matrisi) ==="</span>)

<span class="kw">def</span> <span class="fn">hilbert</span>(n):
    <span class="kw">return</span> np.<span class="fn">array</span>([[<span class="num">1.0</span>/(i+j+<span class="num">1</span>) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n)] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])

n = <span class="num">8</span>
H = <span class="fn">hilbert</span>(n)
x_true = np.<span class="fn">ones</span>(n)
b = H @ x_true
kappa = np.linalg.<span class="fn">cond</span>(H)
<span class="fn">print</span>(<span class="str">f"Hilbert {n}x{n}: kosul sayisi kappa = {kappa:.2e}"</span>)

<span class="cm"># Yontem A: normal denklemler (gercek kodda BUNU yapma)</span>
HtH = H.T @ H
x_normal = np.linalg.<span class="fn">solve</span>(HtH, H.T @ b)
err_normal = np.linalg.<span class="fn">norm</span>(x_normal - x_true) / np.linalg.<span class="fn">norm</span>(x_true)

<span class="cm"># Yontem B: QR ayrismasi</span>
Q, R = np.linalg.<span class="fn">qr</span>(H)
x_qr = np.linalg.<span class="fn">solve</span>(R, Q.T @ b)
err_qr = np.linalg.<span class="fn">norm</span>(x_qr - x_true) / np.linalg.<span class="fn">norm</span>(x_true)

<span class="cm"># Yontem C: SVD tabanli sahte ters (numpy.linalg.lstsq varsayilan)</span>
x_svd, *_ = np.linalg.<span class="fn">lstsq</span>(H, b, rcond=<span class="kw">None</span>)
err_svd = np.linalg.<span class="fn">norm</span>(x_svd - x_true) / np.linalg.<span class="fn">norm</span>(x_true)

<span class="fn">print</span>(<span class="str">f"  Normal denklem hatasi : {err_normal:.3e}   (en kotu &mdash; kappa^2 buyutme)"</span>)
<span class="fn">print</span>(<span class="str">f"  QR hatasi             : {err_qr:.3e}   (daha iyi)"</span>)
<span class="fn">print</span>(<span class="str">f"  SVD lstsq hatasi      : {err_svd:.3e}   (en iyi)"</span>)

<span class="cm"># Bunu n=12 ile dene ve normal denklemlerin tamamen iraksadigini izle.</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 4. GRADYAN KIRPMA &mdash; patlayan gradyanlari evcilleştirme</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== 4. Gradyan kirpma gosterimi ==="</span>)

<span class="kw">def</span> <span class="fn">clip_grad</span>(g, tau):
    norm = np.linalg.<span class="fn">norm</span>(g)
    <span class="kw">if</span> norm &gt; tau:
        <span class="kw">return</span> g * (tau / norm)
    <span class="kw">return</span> g

<span class="cm"># Ara sira gradyan zirvelerle bir egitim dongusunu simule et (RNN tarzi)</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
theta_clip = np.<span class="fn">zeros</span>(<span class="num">5</span>)
theta_no   = np.<span class="fn">zeros</span>(<span class="num">5</span>)
lr = <span class="num">0.01</span>
tau = <span class="num">1.0</span>
norms_no = []; norms_clip = []

<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    g = np.random.<span class="fn">randn</span>(<span class="num">5</span>) * <span class="num">0.5</span>
    <span class="kw">if</span> step % <span class="num">10</span> == <span class="num">3</span>:
        g = g * <span class="num">50</span>
    norms_no.<span class="fn">append</span>(np.linalg.<span class="fn">norm</span>(g))
    norms_clip.<span class="fn">append</span>(np.linalg.<span class="fn">norm</span>(<span class="fn">clip_grad</span>(g, tau)))
    theta_no   = theta_no   - lr * g
    theta_clip = theta_clip - lr * <span class="fn">clip_grad</span>(g, tau)

<span class="fn">print</span>(<span class="str">f"Kirpmasiz maks gradyan normu: {max(norms_no):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Kirpmali maks gradyan normu : {max(norms_clip):.2f}  (tau={tau}'da kapatildi)"</span>)
<span class="fn">print</span>(<span class="str">f"||theta_no   son|| = {np.linalg.norm(theta_no):.3f}  (zirvelerle sallandi)"</span>)
<span class="fn">print</span>(<span class="str">f"||theta_clip son|| = {np.linalg.norm(theta_clip):.3f}  (istikrarli inis)"</span>)
</code></pre></div>

<p class="l-text"><strong>Ne gormelisin.</strong> 1. bolumde, float32 ortalama yaklasik $5$ haneye dogrudur, float16 ortalama yaklasik $1$ off &mdash; $1000$ taban degeri float16'nin $\\sim 3$ anlamli hanesinin neredeyse hepsini kullanir ve varyans icin hicbir sey birakmaz. 2. bolumde, kararli LSE buyuk logitler icin $1001.408$ verirken saf versiyon $+\\infty$'a tasar; ayni logitlerin kararli softmax'i mukemmel mantikli $(0.245, 0.665, 0.090)$ doner. 3. bolumde, $8 \\times 8$ Hilbert sisteminin normal denklem hatasi kabaca $10^{-5}$'tir &mdash; zaten bes hane kaybediyor &mdash; QR ve SVD ise $10^{-7}$'ye yakin hatalar doner. $n = 12$ deneyin ve normal-denklem yonteminin gurultu gibi gorunen haneler dondurdugunu izle. 4. bolumde, kirpmasiz simulasyon enjekte edilen zirveler tarafindan siddetle saldirilirken kirpilmis versiyon duzgun bir yörüngeye yapısık kalir.</p>

<div class="think-box"><div class="think-label">DENEMELI DENEYLER</div><div class="think-body">1. bolumdeki <code>data16</code>'yi bfloat16 ile degistir (varsa <code>ml_dtypes</code>'tan <code>np.bfloat16</code> kullan veya fp32 mantisini 7 bite keserek simule et) ve hassasiyet davranisinin tersine cevrildigini izle &mdash; bf16, kucuk-varyansli indirgemelerde fp16'dan daha kotu olacak ama bir sonraki deneyde daha iyi. 3. bolumde, Hilbert matrisini rastgele yakin-diksenel bir matrisle degistir (<code>np.linalg.qr(np.random.randn(n, n))[0]</code> kullan) ve uc yontemin de makine hassasiyetinde aynı fikirde olduğunu izle &mdash; iyi-kosullu problemler algoritmanı umursamaz. 4. bolumde $\\tau$'yi $0.1$'den $10$'a sapir ve yörüngenin varyansini ciz; asiri agresif bir kirpma ($\\tau = 0.1$) ogrenmeyi acıktırır, az-agresif bir kirpma ($\\tau = 10$) zirvelerin gecmesine izin verir.</div></div>

<div class="calc-highlight"><strong>Simdi yapabileceğin sey.</strong> Herhangi bir float bicimin IEEE 754 bit yerlesimini oku ve bitler ile deger arasinda elden donustur; bir formulde felaket iptalini fark et ve cikarmayi onlemek icin yeniden yaz; yazdiğın herhangi bir en-kucuk-kareler problemi icin normal denklemler yerine QR veya SVD sec; log-sum-exp hilesini sifirdan ture ve softmax, cross-entropy ve dikkate uygula; <code>autocast</code> ve <code>GradScaler</code> ile bir karisik-hassasiyet PyTorch egitim dongusu yaz ve her satirini acikla; gradyan norm gunlugunu suclu isleme dogru takip ederek bir NaN izini teshis et. Sonraki ders <strong>matris kalkulusu</strong>ya ve her modern derin ogrenme cercevesinin otomatik turevleme sistemine guc veren einsum notasyonuna gecer.</div>
`
};
