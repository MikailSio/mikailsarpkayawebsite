var MATH_L6 = {

en: '<p class="l-text"><strong>Numerical methods are the bridge between beautiful mathematical theory and real-world computation.</strong> Everything we have studied across 21 lessons &mdash; linear algebra, calculus, probability, optimization &mdash; ultimately runs on hardware that uses finite-precision arithmetic. Computers cannot represent $\\pi$ exactly, cannot compute infinite sums, and cannot differentiate symbolically during backpropagation. Numerical methods are the algorithms that make all of this work in practice.</p>'

+ '<p class="l-text">This final lesson covers the practical realities every ML practitioner must understand: floating-point representation, numerical stability tricks (like log-sum-exp), finite-difference differentiation, condition numbers, random number generation, Monte Carlo methods, and mixed-precision training. We close with a complete roadmap connecting all 21 lessons into a coherent ML mathematics foundation.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU’LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Read float32, float16, and bfloat16 layouts and predict their precision limits</li>'
+ '<li>Apply the log-sum-exp trick to make softmax and cross-entropy numerically safe</li>'
+ '<li>Verify analytic gradients with finite-difference checks before trusting them</li>'
+ '<li>Compute the condition number of a matrix and explain ill-conditioning</li>'
+ '<li>Estimate hard integrals with Monte Carlo sampling and bound the variance</li>'
+ '<li>Use mixed-precision (fp16 + fp32 master) to train modern deep networks</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: Why Numerical Methods?
   ============================================================ */
+ '<h2 class="l-title">1. Why Numerical Methods?</h2>'

+ '<div class="calc-highlight"><strong>The fundamental tension:</strong> Mathematical theory assumes infinite precision, continuous functions, and exact arithmetic. Computers have finite memory, discrete representations, and rounding at every step. Numerical methods bridge this gap.</div>'

+ '<p class="l-text">When you write <code>loss.backward()</code> in PyTorch, the framework does not symbolically differentiate your loss function. It uses <strong>automatic differentiation</strong> &mdash; a numerical technique that computes exact derivatives by chaining elementary operations. When you train a language model with softmax outputs, the raw exponentials would overflow to infinity without the <strong>log-sum-exp trick</strong>. When you invert a matrix for linear regression, tiny perturbations in the data can cause the solution to change wildly if the matrix is <strong>ill-conditioned</strong>.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Representation Error</div><div class="card-body">$0.1$ cannot be represented exactly in binary floating point. Try <code>0.1 + 0.2</code> in Python &mdash; you get $0.30000000000000004$. Every number is an approximation.</div></div>'
+ '<div class="calc-card"><div class="card-title">Overflow</div><div class="card-body">$e^{1000}$ is finite mathematically but overflows to <code>inf</code> in float64. Softmax with large logits hits this constantly.</div></div>'
+ '<div class="calc-card"><div class="card-title">Underflow</div><div class="card-body">$e^{-1000} = 0$ in floating point. Multiplying many small probabilities underflows to zero. Log-space arithmetic fixes this.</div></div>'
+ '<div class="calc-card"><div class="card-title">Cancellation</div><div class="card-body">Subtracting nearly equal numbers destroys significant digits. $1.000001 - 1.000000 = 0.000001$ loses 6 digits of precision.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">THE DANGER IS REAL</div><div class="example-body">'
+ '<strong>Catastrophic cancellation example:</strong><br>'
+ 'Compute $f(x) = \\frac{1 - \\cos(x)}{x^2}$ for small $x$:<br><br>'
+ 'At $x = 10^{-8}$: $\\cos(x) \\approx 1 - 5 \\times 10^{-17}$<br>'
+ 'But float64 computes $\\cos(10^{-8}) = 1.0$ exactly (rounds to 1)<br>'
+ 'So $1 - \\cos(x) = 0$ and $f(x) = 0$ &mdash; <strong>wrong!</strong> True answer is $\\approx 0.5$.<br><br>'
+ '<strong>Fix:</strong> Use the identity $1 - \\cos(x) = 2\\sin^2(x/2)$, which avoids the cancellation entirely.'
+ '</div></div>'

+ '<div class="l-note"><strong>Why NLP practitioners care:</strong> Transformer attention scores involve softmax over large logit vectors. Language model training multiplies thousands of probabilities together. Gradient accumulation across long sequences amplifies rounding errors. Numerical stability is not optional &mdash; it is required for your models to train at all.</div>'

/* ============================================================
   SECTION 2: Floating Point Representation
   ============================================================ */
+ '<h2 class="l-title">2. Floating Point Representation</h2>'

+ '<p class="l-text">The <strong>IEEE 754 standard</strong> defines how computers store real numbers. Every floating-point number is represented as:</p>'

+ '<div class="calc-formula"><div class="formula-label">IEEE 754 FORMAT</div><div class="formula-main">$$(-1)^{\\text{sign}} \\times 1.\\text{mantissa} \\times 2^{\\text{exponent} - \\text{bias}}$$</div><div class="formula-sub">The sign bit determines positive/negative. The mantissa (significand) stores the fractional digits. The exponent determines the scale (how big or small).</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Float32 (Single Precision)</div>'
+ '<div class="compare-item">&#8226; 1 sign + 8 exponent + 23 mantissa = <strong>32 bits</strong></div>'
+ '<div class="compare-item">&#8226; ~7 decimal digits of precision</div>'
+ '<div class="compare-item">&#8226; Range: $\\pm 3.4 \\times 10^{38}$</div>'
+ '<div class="compare-item">&#8226; Machine epsilon: $\\varepsilon \\approx 1.19 \\times 10^{-7}$</div>'
+ '<div class="compare-item">&#8226; Default for GPU training (PyTorch/TF)</div></div>'
+ '<div class="compare-col"><div class="compare-title">Float64 (Double Precision)</div>'
+ '<div class="compare-item">&#8226; 1 sign + 11 exponent + 52 mantissa = <strong>64 bits</strong></div>'
+ '<div class="compare-item">&#8226; ~15-16 decimal digits of precision</div>'
+ '<div class="compare-item">&#8226; Range: $\\pm 1.8 \\times 10^{308}$</div>'
+ '<div class="compare-item">&#8226; Machine epsilon: $\\varepsilon \\approx 2.22 \\times 10^{-16}$</div>'
+ '<div class="compare-item">&#8226; Default for NumPy, scientific computing</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Machine Epsilon ($\\varepsilon$)</div><div class="step-detail">The smallest number such that $1 + \\varepsilon > 1$ in floating point. It represents the maximum relative error from rounding a single operation. For float32: $\\varepsilon \\approx 10^{-7}$. For float64: $\\varepsilon \\approx 10^{-16}$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Denormalized Numbers</div><div class="step-detail">Near zero, floats become "denormalized" (subnormal) &mdash; the implicit leading 1 becomes 0. This provides gradual underflow instead of a sudden jump to zero. The smallest positive float32 denorm is $\\approx 1.4 \\times 10^{-45}$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Special Values</div><div class="step-detail"><code>inf</code> (overflow), <code>-inf</code>, <code>NaN</code> (0/0, inf-inf). NaN propagates: any operation with NaN gives NaN. This is why a single NaN can kill your entire training run.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Non-Uniform Spacing</div><div class="step-detail">Floating-point numbers are NOT uniformly spaced. Near 1.0, adjacent floats differ by $\\sim 10^{-7}$ (float32). Near $10^6$, they differ by $\\sim 0.1$. Near $10^{-6}$, they differ by $\\sim 10^{-13}$. Density decreases as magnitude increases.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Machine epsilon</span>\n<span class="fn">print</span>(<span class="str">"float32 eps:"</span>, np.<span class="fn">finfo</span>(np.float32).eps)  <span class="cm"># 1.1920929e-07</span>\n<span class="fn">print</span>(<span class="str">"float64 eps:"</span>, np.<span class="fn">finfo</span>(np.float64).eps)  <span class="cm"># 2.220446049250313e-16</span>\n\n<span class="cm"># The classic 0.1 + 0.2 problem</span>\n<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span> == <span class="num">0.3</span>)      <span class="cm"># False!</span>\n<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span>)              <span class="cm"># 0.30000000000000004</span>\n<span class="fn">print</span>(np.<span class="fn">isclose</span>(<span class="num">0.1</span> + <span class="num">0.2</span>, <span class="num">0.3</span>))  <span class="cm"># True (tolerance-based)</span>\n\n<span class="cm"># Spacing between floats at different magnitudes</span>\n<span class="fn">print</span>(<span class="str">"Spacing near 1.0:"</span>, np.<span class="fn">spacing</span>(<span class="num">1.0</span>))    <span class="cm"># 2.22e-16</span>\n<span class="fn">print</span>(<span class="str">"Spacing near 1e6:"</span>, np.<span class="fn">spacing</span>(<span class="num">1e6</span>))    <span class="cm"># 1.16e-10</span>\n<span class="fn">print</span>(<span class="str">"Spacing near 1e15:"</span>, np.<span class="fn">spacing</span>(<span class="num">1e15</span>))  <span class="cm"># 0.125</span></code></pre></div>'

/* Plotly: Float spacing visualization */
+ '<div id="plot-float-spacing" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var x=[];var sp=[];for(var e=-10;e<=10;e+=0.5){var v=Math.pow(2,e);x.push(v);sp.push(v*1.1920929e-7);}'
+ 'var t1={x:x,y:sp,mode:"lines+markers",name:"Float32 spacing",line:{color:"#c8a96e",width:2},marker:{size:4}};'
+ 'var layout={title:{text:"Float32: Spacing Between Adjacent Numbers",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Value",type:"log"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Gap to Next Float",type:"log"},margin:{t:50,r:30,b:50,l:60},showlegend:false};'
+ 'Plotly.newPlot("plot-float-spacing",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Non-uniform float spacing:</strong> The gap between adjacent floating-point numbers grows proportionally with the magnitude. Near zero, floats are extremely dense. Near large numbers, the gaps become significant. This log-log plot shows the linear relationship: spacing $\\approx |x| \\cdot \\varepsilon$.</div></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does PyTorch default to float32 instead of float64 for training? Two reasons: (1) GPUs have far more float32 compute units, so training is 2-8x faster, and (2) the noise from stochastic gradient descent is much larger than float32 rounding errors, so the extra precision of float64 is wasted. The SGD noise acts as a natural regularizer that dominates over floating-point errors.</div></div>'

/* ============================================================
   SECTION 3: Numerical Overflow & Underflow
   ============================================================ */
+ '<h2 class="l-title">3. Numerical Overflow &amp; Underflow</h2>'

+ '<p class="l-text"><strong>Overflow</strong> occurs when a number exceeds the maximum representable value (becomes <code>inf</code>). <strong>Underflow</strong> occurs when a number is too close to zero to be represented (becomes <code>0</code>). Both are catastrophic in ML because they produce NaN gradients and kill training.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Overflow Example</div><div class="card-body">Softmax: $e^{1000} = $ <code>inf</code> in float32 (max ~$3.4 \\times 10^{38}$, but $e^{89} \\approx 4.5 \\times 10^{38}$). Any logit > 89 overflows the exponential.</div></div>'
+ '<div class="calc-card"><div class="card-title">Underflow Example</div><div class="card-body">Joint probability: $P(w_1, ..., w_{100}) = \\prod P(w_i)$. If each $P \\approx 0.01$, the product is $10^{-200}$ &mdash; underflows to 0.</div></div>'
+ '<div class="calc-card"><div class="card-title">Log-Space Fix</div><div class="card-body">Work in log-space: $\\log P(w_1, ..., w_n) = \\sum \\log P(w_i)$. Sums stay in representable range. Convert back only at the end.</div></div>'
+ '<div class="calc-card"><div class="card-title">NaN Propagation</div><div class="card-body">$\\text{inf} - \\text{inf} = \\text{NaN}$, $0 \\times \\text{inf} = \\text{NaN}$, $\\text{inf}/\\text{inf} = \\text{NaN}$. Once NaN appears, it spreads to every parameter through gradients.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">SOFTMAX OVERFLOW: THE CLASSIC ML FAILURE</div><div class="example-body">'
+ '<strong>Naive softmax:</strong> $\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$<br><br>'
+ 'With logits $z = [1000, 1001, 1002]$:<br>'
+ '$e^{1000} = $ <code>inf</code>, $e^{1001} = $ <code>inf</code>, $e^{1002} = $ <code>inf</code><br>'
+ 'Result: $\\frac{\\text{inf}}{\\text{inf}} = $ <code>NaN</code><br><br>'
+ '<strong>Stable softmax:</strong> Subtract max: $z\' = z - \\max(z) = [-2, -1, 0]$<br>'
+ '$e^{-2} = 0.135$, $e^{-1} = 0.368$, $e^{0} = 1.0$<br>'
+ 'Sum $= 1.503$. Result: $[0.090, 0.245, 0.665]$ &mdash; <strong>correct!</strong>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">naive_softmax</span>(z):\n    <span class="str">"""Numerically UNSTABLE softmax."""</span>\n    exp_z = np.<span class="fn">exp</span>(z)\n    <span class="kw">return</span> exp_z / np.<span class="fn">sum</span>(exp_z)\n\n<span class="kw">def</span> <span class="fn">stable_softmax</span>(z):\n    <span class="str">"""Numerically STABLE softmax (subtract max)."""</span>\n    z_shifted = z - np.<span class="fn">max</span>(z)   <span class="cm"># shift so max = 0</span>\n    exp_z = np.<span class="fn">exp</span>(z_shifted)\n    <span class="kw">return</span> exp_z / np.<span class="fn">sum</span>(exp_z)\n\nz = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">1002.0</span>])\n<span class="fn">print</span>(<span class="str">"Naive:"</span>, <span class="fn">naive_softmax</span>(z))    <span class="cm"># [nan, nan, nan]</span>\n<span class="fn">print</span>(<span class="str">"Stable:"</span>, <span class="fn">stable_softmax</span>(z))  <span class="cm"># [0.090, 0.245, 0.665]</span>\n\n<span class="cm"># Underflow example: multiplying small probabilities</span>\nprobs = np.<span class="fn">array</span>([<span class="num">0.01</span>] * <span class="num">200</span>)\n<span class="fn">print</span>(<span class="str">"Product:"</span>, np.<span class="fn">prod</span>(probs))        <span class="cm"># 0.0 (underflow!)</span>\n<span class="fn">print</span>(<span class="str">"Log-sum:"</span>, np.<span class="fn">sum</span>(np.<span class="fn">log</span>(probs))) <span class="cm"># -921.03 (correct!)</span></code></pre></div>'

+ '<div class="l-warn"><strong>Rule of thumb:</strong> Never multiply many small probabilities directly. Always work in log-space. Never exponentiate large numbers without first subtracting the maximum. These two rules alone prevent 90% of numerical issues in ML.</div>'

/* ============================================================
   SECTION 4: The Log-Sum-Exp Trick
   ============================================================ */
+ '<h2 class="l-title">4. The Log-Sum-Exp Trick</h2>'

+ '<p class="l-text">The <strong>log-sum-exp (LSE)</strong> trick is the single most important numerical stability technique in machine learning. It computes $\\log \\sum_i e^{x_i}$ without overflow or underflow, and it underlies stable implementations of softmax, cross-entropy loss, and log-likelihood computation.</p>'

+ '<div class="calc-formula"><div class="formula-label">LOG-SUM-EXP TRICK</div><div class="formula-main">$$\\log \\sum_{i} e^{x_i} = c + \\log \\sum_{i} e^{x_i - c}$$</div><div class="formula-sub">where $c = \\max_i(x_i)$. Subtracting the max ensures the largest exponential is $e^0 = 1$, preventing overflow.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Find the Maximum</div><div class="step-detail">$c = \\max(x_1, x_2, ..., x_n)$. This is a safe operation &mdash; no overflow possible.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Subtract and Exponentiate</div><div class="step-detail">Compute $e^{x_i - c}$ for each $i$. Since $x_i - c \\le 0$ for all $i$, every exponential is in $[0, 1]$. No overflow!</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sum and Log</div><div class="step-detail">$\\sum_i e^{x_i - c} \\ge 1$ (the max term contributes $e^0 = 1$), so $\\log(\\text{sum}) \\ge 0$. No underflow in the log.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Add Back the Max</div><div class="step-detail">Final result $= c + \\log(\\text{sum})$. Mathematically identical to the original, but numerically stable.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">LOG-SUM-EXP IN ACTION</div><div class="example-body">'
+ '<strong>Input:</strong> $x = [1000, 1001, 1002]$<br><br>'
+ '<strong>Naive:</strong> $\\log(e^{1000} + e^{1001} + e^{1002}) = \\log(\\text{inf}) = \\text{inf}$<br><br>'
+ '<strong>Stable (LSE trick):</strong><br>'
+ '$c = 1002$<br>'
+ '$\\log(e^{-2} + e^{-1} + e^{0}) = \\log(0.135 + 0.368 + 1.0) = \\log(1.503) = 0.407$<br>'
+ 'Final: $1002 + 0.407 = 1002.407$ &mdash; <strong>correct and finite!</strong>'
+ '</div></div>'

+ '<div class="calc-highlight"><strong>Where LSE appears in ML:</strong> (1) <em>Stable softmax</em>: $\\text{softmax}(z)_i = \\exp(z_i - \\text{LSE}(z))$. (2) <em>Cross-entropy loss</em>: PyTorch\'s <code>CrossEntropyLoss</code> uses LSE internally. (3) <em>Log-likelihood</em>: $\\log p(x) = \\log \\sum_z p(x, z) = \\text{LSE}(\\log p(x, z))$. (4) <em>CTC loss</em> in speech recognition. (5) <em>Attention scores</em> in transformers.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy.special <span class="kw">import</span> logsumexp\n\n<span class="kw">def</span> <span class="fn">my_logsumexp</span>(x):\n    <span class="str">"""Numerically stable log-sum-exp."""</span>\n    c = np.<span class="fn">max</span>(x)\n    <span class="kw">return</span> c + np.<span class="fn">log</span>(np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(x - c)))\n\n<span class="kw">def</span> <span class="fn">stable_log_softmax</span>(z):\n    <span class="str">"""Log-softmax via LSE: log(softmax(z)) = z - LSE(z)."""</span>\n    <span class="kw">return</span> z - <span class="fn">my_logsumexp</span>(z)\n\n<span class="kw">def</span> <span class="fn">stable_cross_entropy</span>(logits, target_idx):\n    <span class="str">"""Stable cross-entropy from raw logits (no softmax needed)."""</span>\n    <span class="kw">return</span> -logits[target_idx] + <span class="fn">my_logsumexp</span>(logits)\n\nx = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">1002.0</span>])\n<span class="fn">print</span>(<span class="str">"LSE:"</span>, <span class="fn">my_logsumexp</span>(x))               <span class="cm"># 1002.407</span>\n<span class="fn">print</span>(<span class="str">"scipy:"</span>, <span class="fn">logsumexp</span>(x))               <span class="cm"># 1002.407 (same)</span>\n<span class="fn">print</span>(<span class="str">"log-softmax:"</span>, <span class="fn">stable_log_softmax</span>(x)) <span class="cm"># [-2.408, -1.408, -0.408]</span>\n<span class="fn">print</span>(<span class="str">"CE loss:"</span>, <span class="fn">stable_cross_entropy</span>(x, <span class="num">2</span>)) <span class="cm"># 0.408</span></code></pre></div>'

+ '<div class="l-note"><strong>PyTorch best practice:</strong> Always use <code>F.log_softmax()</code> instead of <code>torch.log(F.softmax())</code>. The fused version uses the LSE trick internally. Similarly, use <code>nn.CrossEntropyLoss</code> which takes raw logits, not softmax outputs. This is faster AND more numerically stable.</div>'

/* ============================================================
   SECTION 5: Numerical Differentiation
   ============================================================ */
+ '<h2 class="l-title">5. Numerical Differentiation</h2>'

+ '<p class="l-text">While deep learning uses <strong>automatic differentiation</strong> (not numerical differentiation) for training, understanding finite differences is essential for (1) gradient checking during debugging, (2) understanding the trade-offs that autograd avoids, and (3) situations where you need derivatives of black-box functions.</p>'

+ '<div class="calc-formula"><div class="formula-label">THREE FINITE DIFFERENCE FORMULAS</div><div class="formula-main">$$\\begin{aligned}\\text{Forward:} \\quad &f\'(x) \\approx \\frac{f(x+h) - f(x)}{h} \\\\[8pt] \\text{Backward:} \\quad &f\'(x) \\approx \\frac{f(x) - f(x-h)}{h} \\\\[8pt] \\text{Central:} \\quad &f\'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h}\\end{aligned}$$</div><div class="formula-sub">Forward and backward are $O(h)$ accurate. Central difference is $O(h^2)$ &mdash; much more accurate for the same $h$.</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Truncation Error</div>'
+ '<div class="compare-item">&#8226; From dropping higher-order Taylor terms</div>'
+ '<div class="compare-item">&#8226; Decreases as $h \\to 0$</div>'
+ '<div class="compare-item">&#8226; Forward/backward: $O(h)$</div>'
+ '<div class="compare-item">&#8226; Central: $O(h^2)$ (much better)</div>'
+ '<div class="compare-item">&#8226; Wants $h$ as small as possible</div></div>'
+ '<div class="compare-col"><div class="compare-title">Rounding Error</div>'
+ '<div class="compare-item">&#8226; From finite-precision subtraction</div>'
+ '<div class="compare-item">&#8226; Increases as $h \\to 0$ (cancellation!)</div>'
+ '<div class="compare-item">&#8226; $\\sim \\varepsilon / h$ where $\\varepsilon$ = machine epsilon</div>'
+ '<div class="compare-item">&#8226; Dominates for very small $h$</div>'
+ '<div class="compare-item">&#8226; Wants $h$ as large as possible</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>The optimal $h$:</strong> For forward/backward differences, the optimal step size balances truncation and rounding error at $h^* \\approx \\sqrt{\\varepsilon} \\approx 10^{-8}$ (float64). For central differences, $h^* \\approx \\varepsilon^{1/3} \\approx 10^{-5}$ (float64). Too small and you get noise; too large and you get bias.</div>'

/* Plotly: Error vs step size for numerical differentiation */
+ '<div id="plot-num-diff" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var hs=[];var fwd=[];var ctr=[];var eps=2.22e-16;'
+ 'for(var e=-15;e<=0;e+=0.25){'
+ 'var h=Math.pow(10,e);hs.push(h);'
+ 'var trunc_fwd=h/2;var round_fwd=eps/h;fwd.push(trunc_fwd+round_fwd);'
+ 'var trunc_ctr=h*h/6;var round_ctr=eps/h;ctr.push(trunc_ctr+round_ctr);}'
+ 'var t1={x:hs,y:fwd,mode:"lines",name:"Forward O(h)",line:{color:"#e74c3c",width:2}};'
+ 'var t2={x:hs,y:ctr,mode:"lines",name:"Central O(h^2)",line:{color:"#4ecdc4",width:2}};'
+ 'var ann1={x:1e-8,y:2e-8,xref:"x",yref:"y",text:"Optimal h (forward)\\n~ sqrt(eps)",showarrow:true,arrowhead:2,ax:60,ay:-30,font:{color:"#e74c3c",size:10}};'
+ 'var ann2={x:6e-6,y:3e-11,xref:"x",yref:"y",text:"Optimal h (central)\\n~ eps^(1/3)",showarrow:true,arrowhead:2,ax:60,ay:-30,font:{color:"#4ecdc4",size:10}};'
+ 'var layout={title:{text:"Numerical Differentiation Error vs Step Size h",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Step size h",type:"log"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Total error",type:"log"},margin:{t:50,r:30,b:50,l:60},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-num-diff",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>The V-shaped error curve:</strong> As $h$ decreases, truncation error drops but rounding error rises. The total error has a minimum at the optimal $h$. Central differences achieve much lower minimum error than forward differences because their truncation error drops as $h^2$ instead of $h$.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">numerical_gradient</span>(f, x, h=<span class="num">1e-5</span>):\n    <span class="str">"""Central difference gradient for multivariable f."""</span>\n    grad = np.<span class="fn">zeros_like</span>(x, dtype=np.float64)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):\n        x_plus = x.<span class="fn">copy</span>(); x_plus[i] += h\n        x_minus = x.<span class="fn">copy</span>(); x_minus[i] -= h\n        grad[i] = (f(x_plus) - f(x_minus)) / (<span class="num">2</span> * h)\n    <span class="kw">return</span> grad\n\n<span class="cm"># Gradient check: verify autograd against finite differences</span>\n<span class="kw">def</span> <span class="fn">gradient_check</span>(f, x, analytic_grad, h=<span class="num">1e-5</span>, tol=<span class="num">1e-5</span>):\n    <span class="str">"""Compare analytic vs numerical gradient."""</span>\n    num_grad = <span class="fn">numerical_gradient</span>(f, x, h)\n    diff = np.<span class="fn">abs</span>(analytic_grad - num_grad)\n    rel_err = diff / (np.<span class="fn">abs</span>(analytic_grad) + np.<span class="fn">abs</span>(num_grad) + <span class="num">1e-8</span>)\n    <span class="fn">print</span>(<span class="str">"Max relative error:"</span>, np.<span class="fn">max</span>(rel_err))\n    <span class="kw">return</span> np.<span class="fn">all</span>(rel_err < tol)\n\n<span class="cm"># Example: f(x) = x^2, gradient = 2x</span>\nf = <span class="kw">lambda</span> x: np.<span class="fn">sum</span>(x**<span class="num">2</span>)\nx = np.<span class="fn">array</span>([<span class="num">3.0</span>, <span class="num">4.0</span>, <span class="num">5.0</span>])\n<span class="fn">print</span>(<span class="str">"Numerical:"</span>, <span class="fn">numerical_gradient</span>(f, x))  <span class="cm"># [6., 8., 10.]</span>\n<span class="fn">print</span>(<span class="str">"Analytic:"</span>, <span class="num">2</span> * x)                    <span class="cm"># [6., 8., 10.]</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does PyTorch use automatic differentiation instead of numerical differentiation? For a function with $n$ parameters, numerical differentiation requires $2n$ function evaluations (central differences). For a model with millions of parameters, this is impossibly expensive. Autograd computes the exact gradient in $O(1)$ backward passes regardless of $n$ &mdash; the same cost as a single forward pass.</div></div>'

/* ============================================================
   SECTION 6: Numerical Stability in Linear Algebra
   ============================================================ */
+ '<h2 class="l-title">6. Numerical Stability in Linear Algebra</h2>'

+ '<p class="l-text">Solving $Ax = b$ is fundamental to ML (linear regression, least squares, PCA). But not all systems are created equal. Some are <strong>well-conditioned</strong> &mdash; small changes in $b$ cause small changes in $x$. Others are <strong>ill-conditioned</strong> &mdash; tiny perturbations in $b$ cause the solution to change wildly.</p>'

+ '<div class="calc-formula"><div class="formula-label">CONDITION NUMBER</div><div class="formula-main">$$\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\| = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}}$$</div><div class="formula-sub">The ratio of the largest to smallest singular value. Measures how much input errors are amplified in the output. $\\kappa = 1$ is perfect; $\\kappa \\gg 1$ is ill-conditioned.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Well-Conditioned ($\\kappa \\approx 1$)</div><div class="step-detail">The identity matrix has $\\kappa = 1$. Rotation matrices also have $\\kappa = 1$. Small perturbations cause proportionally small changes in the solution. Safe to solve directly.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Moderately Conditioned ($\\kappa \\sim 10^3$)</div><div class="step-detail">You lose about $\\log_{10}(\\kappa) \\approx 3$ digits of precision. With float64 (16 digits), you keep ~13 correct digits. Usually fine.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Ill-Conditioned ($\\kappa > 10^{10}$)</div><div class="step-detail">You lose 10+ digits. With float64 you keep only ~6 digits &mdash; barely float32 quality. With float32, the solution is meaningless. Regularization is essential.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Singular ($\\kappa = \\infty$)</div><div class="step-detail">$\\sigma_{\\min} = 0$. The matrix has no inverse. The system has either no solution or infinitely many. Use pseudoinverse or SVD.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ILL-CONDITIONED SYSTEM IN ML</div><div class="example-body">'
+ '<strong>Multicollinear features in linear regression:</strong><br>'
+ 'If feature $x_2 \\approx 2 x_1 + \\epsilon$ (nearly linearly dependent), the design matrix $X^T X$ becomes ill-conditioned.<br><br>'
+ '$X^T X = \\begin{pmatrix} 100 & 200.01 \\\\ 200.01 & 400.04 \\end{pmatrix}$, $\\kappa \\approx 10^6$<br><br>'
+ 'The normal equation $\\hat{\\beta} = (X^T X)^{-1} X^T y$ amplifies any noise by a factor of $10^6$!<br><br>'
+ '<strong>Fix: Ridge regression</strong> adds $\\lambda I$:<br>'
+ '$\\hat{\\beta} = (X^T X + \\lambda I)^{-1} X^T y$<br>'
+ 'This increases $\\sigma_{\\min}$ by $\\lambda$, dramatically improving the condition number.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Well-conditioned system</span>\nA_good = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">1</span>], [<span class="num">1</span>, <span class="num">3</span>]])\n<span class="fn">print</span>(<span class="str">"Good cond:"</span>, np.linalg.<span class="fn">cond</span>(A_good))  <span class="cm"># ~2.6</span>\n\n<span class="cm"># Ill-conditioned: nearly singular (Hilbert matrix)</span>\nn = <span class="num">10</span>\nH = np.<span class="fn">array</span>([[<span class="num">1.0</span>/(i+j+<span class="num">1</span>) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n)] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])\n<span class="fn">print</span>(<span class="str">"Hilbert cond:"</span>, np.linalg.<span class="fn">cond</span>(H))  <span class="cm"># ~10^13 !</span>\n\n<span class="cm"># Solving ill-conditioned system</span>\nb = np.<span class="fn">ones</span>(n)\nx_direct = np.linalg.<span class="fn">solve</span>(H, b)    <span class="cm"># unreliable</span>\n\n<span class="cm"># Fix: Regularize (Ridge)</span>\nlam = <span class="num">1e-6</span>\nH_reg = H + lam * np.<span class="fn">eye</span>(n)\n<span class="fn">print</span>(<span class="str">"Regularized cond:"</span>, np.linalg.<span class="fn">cond</span>(H_reg))  <span class="cm"># much better</span>\nx_ridge = np.linalg.<span class="fn">solve</span>(H_reg, b)  <span class="cm"># stable solution</span>\n\n<span class="cm"># Better: Use SVD-based pseudoinverse</span>\nx_pinv = np.linalg.<span class="fn">lstsq</span>(H, b, rcond=<span class="kw">None</span>)[<span class="num">0</span>]</code></pre></div>'

+ '<div class="l-note"><strong>Connection to regularization:</strong> Now you see the deep reason why L2 regularization works in linear regression. Ridge regression does not just prevent overfitting &mdash; it also makes the computation numerically stable by improving the condition number of $X^T X$. This is why regularization is doubly important for high-dimensional data with correlated features.</div>'

/* ============================================================
   SECTION 7: Random Number Generation
   ============================================================ */
+ '<h2 class="l-title">7. Random Number Generation</h2>'

+ '<p class="l-text">Randomness is everywhere in ML: weight initialization, data shuffling, dropout, stochastic gradient descent, data augmentation, and sampling from generative models. But computers are deterministic machines. <strong>Pseudo-random number generators (PRNGs)</strong> produce sequences that appear random but are completely determined by an initial <strong>seed</strong>.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Seed</div><div class="card-body">An integer that initializes the PRNG state. Same seed = same sequence = reproducible experiments. Always set seeds when reporting ML results.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mersenne Twister</div><div class="card-body">NumPy\'s default PRNG. Period of $2^{19937}-1$. Excellent statistical properties but slow. State: 624 x 32-bit integers.</div></div>'
+ '<div class="calc-card"><div class="card-title">PCG / Philox</div><div class="card-body">Modern PRNGs used in NumPy 1.17+ and JAX. Faster, smaller state, better parallelism. PCG64 is now NumPy\'s default.</div></div>'
+ '<div class="calc-card"><div class="card-title">Uniform Base</div><div class="card-body">PRNGs produce uniform $U[0,1]$ numbers. All other distributions (Gaussian, exponential, etc.) are derived via transforms.</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Inverse CDF Method</div>'
+ '<div class="compare-item">&#8226; Generate $u \\sim U[0,1]$</div>'
+ '<div class="compare-item">&#8226; Return $F^{-1}(u)$ where $F$ is the target CDF</div>'
+ '<div class="compare-item">&#8226; Works for any distribution with known inverse CDF</div>'
+ '<div class="compare-item">&#8226; Exponential: $x = -\\lambda^{-1} \\ln(1-u)$</div>'
+ '<div class="compare-item">&#8226; Cannot easily generate multivariate distributions</div></div>'
+ '<div class="compare-col"><div class="compare-title">Box-Muller Transform</div>'
+ '<div class="compare-item">&#8226; Two uniforms $u_1, u_2 \\sim U[0,1]$</div>'
+ '<div class="compare-item">&#8226; $z_1 = \\sqrt{-2 \\ln u_1} \\cos(2\\pi u_2)$</div>'
+ '<div class="compare-item">&#8226; $z_2 = \\sqrt{-2 \\ln u_1} \\sin(2\\pi u_2)$</div>'
+ '<div class="compare-item">&#8226; Produces two independent $N(0,1)$ samples</div>'
+ '<div class="compare-item">&#8226; Used internally by many libraries</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">import</span> torch\n\n<span class="cm"># Full reproducibility recipe</span>\nSEED = <span class="num">42</span>\nnp.random.<span class="fn">seed</span>(SEED)\ntorch.<span class="fn">manual_seed</span>(SEED)\ntorch.cuda.<span class="fn">manual_seed_all</span>(SEED)  <span class="cm"># all GPUs</span>\ntorch.backends.cudnn.deterministic = <span class="kw">True</span>\ntorch.backends.cudnn.benchmark = <span class="kw">False</span>\n\n<span class="cm"># Modern NumPy: explicit Generator (recommended)</span>\nrng = np.random.<span class="fn">default_rng</span>(SEED)  <span class="cm"># PCG64 generator</span>\n<span class="fn">print</span>(rng.<span class="fn">standard_normal</span>(<span class="num">5</span>))        <span class="cm"># 5 N(0,1) samples</span>\n<span class="fn">print</span>(rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>))            <span class="cm"># 5 U[0,1] samples</span>\n\n<span class="cm"># Box-Muller from scratch</span>\n<span class="kw">def</span> <span class="fn">box_muller</span>(rng, n):\n    <span class="str">"""Generate n standard normal samples."""</span>\n    u1 = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, n)\n    u2 = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, n)\n    z = np.<span class="fn">sqrt</span>(-<span class="num">2</span> * np.<span class="fn">log</span>(u1)) * np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * u2)\n    <span class="kw">return</span> z\n\nsamples = <span class="fn">box_muller</span>(rng, <span class="num">10000</span>)\n<span class="fn">print</span>(<span class="str">"Mean:"</span>, np.<span class="fn">mean</span>(samples))  <span class="cm"># ~0.0</span>\n<span class="fn">print</span>(<span class="str">"Std:"</span>, np.<span class="fn">std</span>(samples))    <span class="cm"># ~1.0</span></code></pre></div>'

+ '<div class="l-warn"><strong>Reproducibility pitfall:</strong> Setting <code>torch.manual_seed(42)</code> is not enough! You also need to seed NumPy, Python\'s <code>random</code>, and CUDA. Even then, certain GPU operations (atomicAdd, cuDNN convolutions) are non-deterministic by default. Set <code>torch.use_deterministic_algorithms(True)</code> for full determinism, but expect a performance hit.</div>'

/* ============================================================
   SECTION 8: Monte Carlo Methods
   ============================================================ */
+ '<h2 class="l-title">8. Monte Carlo Methods</h2>'

+ '<p class="l-text"><strong>Monte Carlo methods</strong> use random sampling to estimate quantities that are analytically intractable. In ML, they appear everywhere: estimating expectations, computing integrals, sampling from posterior distributions, and training generative models. The key insight is that random samples can approximate any expectation.</p>'

+ '<div class="calc-formula"><div class="formula-label">MONTE CARLO ESTIMATION</div><div class="formula-main">$$\\mathbb{E}_{x \\sim p}[f(x)] \\approx \\frac{1}{N} \\sum_{i=1}^{N} f(x_i), \\quad x_i \\sim p$$</div><div class="formula-sub">Draw $N$ samples from distribution $p$, evaluate $f$ at each sample, and average. By the law of large numbers, this converges to the true expectation as $N \\to \\infty$.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Convergence Rate: $O(1/\\sqrt{N})$</div><div class="step-detail">Standard error of Monte Carlo estimate $= \\sigma / \\sqrt{N}$. To halve the error, you need 4x more samples. This rate is dimension-independent &mdash; a huge advantage over grid methods in high dimensions.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Importance Sampling</div><div class="step-detail">If $p$ is hard to sample from, sample from proposal $q$ instead: $\\mathbb{E}_p[f(x)] = \\mathbb{E}_q[f(x) \\cdot p(x)/q(x)]$. The ratio $w(x) = p(x)/q(x)$ is the importance weight. Key technique in reinforcement learning (PPO) and variational inference.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Markov Chain Monte Carlo (MCMC)</div><div class="step-detail">When you cannot even compute $p(x)$ up to a normalizing constant, construct a Markov chain whose stationary distribution is $p$. Metropolis-Hastings and Hamiltonian Monte Carlo (HMC) are the workhorses of Bayesian ML.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Dropout as Monte Carlo</div><div class="step-detail">MC Dropout: run inference with dropout enabled $T$ times and average the predictions. This approximates Bayesian inference and gives uncertainty estimates for free. Widely used in NLP for confidence estimation.</div></div></div>'
+ '</div>'

/* Plotly: Monte Carlo convergence */
+ '<div id="plot-monte-carlo" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var ns=[];var ests=[];var upper=[];var lower=[];var trueVal=Math.PI;'
+ 'var rng=(function(){var s=42;return function(){s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;}})();'
+ 'var inside=0;'
+ 'for(var i=1;i<=5000;i++){var x=rng();var y=rng();if(x*x+y*y<=1)inside++;'
+ 'if(i%10===0||i<=20){var est=4*inside/i;var se=Math.sqrt(est*(4-est)/i);ns.push(i);ests.push(est);upper.push(est+1.96*se);lower.push(est-1.96*se);}}'
+ 'var t1={x:ns,y:ests,mode:"lines",name:"MC estimate",line:{color:"#c8a96e",width:2}};'
+ 'var t2={x:ns,y:upper,mode:"lines",name:"95% CI",line:{color:"rgba(200,169,110,0.3)",width:1},showlegend:false};'
+ 'var t3={x:ns,y:lower,mode:"lines",name:"95% CI lower",line:{color:"rgba(200,169,110,0.3)",width:1},fill:"tonexty",fillcolor:"rgba(200,169,110,0.1)",showlegend:false};'
+ 'var t4={x:[0,5000],y:[trueVal,trueVal],mode:"lines",name:"True pi",line:{color:"#4ecdc4",width:2,dash:"dash"}};'
+ 'var layout={title:{text:"Monte Carlo Estimation of pi (circle area method)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Number of samples"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Estimate",range:[2.5,4.0]},margin:{t:50,r:30,b:50,l:50},legend:{x:0.6,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-monte-carlo",[t3,t2,t1,t4],layout,{responsive:true,displayModeBar:false});'
+ '},300)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Monte Carlo convergence:</strong> Estimating $\\pi$ by sampling random points in a unit square and counting how many fall inside the quarter circle. The estimate converges to the true value at rate $O(1/\\sqrt{N})$. The 95% confidence interval narrows slowly &mdash; you need 4x more samples to halve the error.</div></div>'

+ '<div class="calc-example"><div class="example-label">IMPORTANCE SAMPLING IN PRACTICE</div><div class="example-body">'
+ '<strong>Problem:</strong> Estimate $\\mathbb{E}_{x \\sim N(0,1)}[f(x)]$ where $f(x)$ is large only in the tail ($x > 5$).<br><br>'
+ 'Naive MC: Most samples from $N(0,1)$ fall near 0, rarely reaching $x > 5$. Need millions of samples.<br><br>'
+ '<strong>Importance sampling fix:</strong> Sample from $q = N(5, 1)$ instead (centered on the tail):<br>'
+ '$\\mathbb{E}_p[f(x)] = \\mathbb{E}_q\\left[f(x) \\cdot \\frac{p(x)}{q(x)}\\right] \\approx \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) \\cdot \\frac{p(x_i)}{q(x_i)}$<br><br>'
+ 'Now every sample is in the region where $f(x)$ matters. Much lower variance with far fewer samples.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\nrng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)\n\n<span class="cm"># Monte Carlo estimation of pi</span>\nN = <span class="num">100000</span>\nx = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, N)\ny = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, N)\npi_est = <span class="num">4</span> * np.<span class="fn">mean</span>(x**<span class="num">2</span> + y**<span class="num">2</span> <= <span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">f"Pi estimate: {pi_est:.4f}"</span>)  <span class="cm"># ~3.1416</span>\n\n<span class="cm"># Importance sampling: estimate P(X > 5) for X ~ N(0,1)</span>\n<span class="cm"># True value: ~2.87e-7</span>\np = stats.<span class="fn">norm</span>(<span class="num">0</span>, <span class="num">1</span>)   <span class="cm"># target</span>\nq = stats.<span class="fn">norm</span>(<span class="num">5</span>, <span class="num">1</span>)   <span class="cm"># proposal (centered at tail)</span>\n\nsamples = q.<span class="fn">rvs</span>(N, random_state=<span class="num">42</span>)\nweights = p.<span class="fn">pdf</span>(samples) / q.<span class="fn">pdf</span>(samples)\nf_vals = (samples > <span class="num">5</span>).<span class="fn">astype</span>(<span class="fn">float</span>)\nis_estimate = np.<span class="fn">mean</span>(f_vals * weights)\n<span class="fn">print</span>(<span class="str">f"IS estimate: {is_estimate:.2e}"</span>)    <span class="cm"># ~2.87e-7</span>\n<span class="fn">print</span>(<span class="str">f"True value:  {1 - p.cdf(5):.2e}"</span>)   <span class="cm"># 2.87e-7</span></code></pre></div>'

+ '<div class="l-note"><strong>Monte Carlo in NLP:</strong> Language models use sampling at inference time (temperature sampling, top-k, nucleus sampling). During training, dropout is a Monte Carlo approximation to Bayesian model averaging. Variational autoencoders (VAEs) use the reparameterization trick to backpropagate through Monte Carlo samples. RLHF uses Monte Carlo policy gradient estimates.</div>'

/* ============================================================
   SECTION 9: Mixed Precision Training
   ============================================================ */
+ '<h2 class="l-title">9. Mixed Precision Training</h2>'

+ '<p class="l-text"><strong>Mixed precision training</strong> uses lower-precision floating point (FP16 or BF16) for most computations while keeping critical values in FP32. This is not just an optimization trick &mdash; it is essential knowledge for training modern language models efficiently. A single GPU can train 2x faster with half the memory using mixed precision.</p>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">FP16 (Half Precision)</div>'
+ '<div class="compare-item">&#8226; 1 sign + 5 exponent + 10 mantissa = 16 bits</div>'
+ '<div class="compare-item">&#8226; ~3.3 decimal digits of precision</div>'
+ '<div class="compare-item">&#8226; Range: $\\pm 65504$ (very limited!)</div>'
+ '<div class="compare-item">&#8226; Smallest positive: $6 \\times 10^{-8}$</div>'
+ '<div class="compare-item">&#8226; Fast on NVIDIA Tensor Cores</div></div>'
+ '<div class="compare-col"><div class="compare-title">BF16 (Brain Float)</div>'
+ '<div class="compare-item">&#8226; 1 sign + 8 exponent + 7 mantissa = 16 bits</div>'
+ '<div class="compare-item">&#8226; ~2.4 decimal digits of precision</div>'
+ '<div class="compare-item">&#8226; Range: same as FP32 ($\\pm 3.4 \\times 10^{38}$)</div>'
+ '<div class="compare-item">&#8226; Less precise but much larger range</div>'
+ '<div class="compare-item">&#8226; Rarely overflows &mdash; preferred for training</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">The Overflow Problem with FP16</div><div class="step-detail">FP16 max is only 65504. Gradient values during backprop frequently exceed this, causing overflow to <code>inf</code>. Loss values in cross-entropy can also exceed 65504 for large vocabularies. This is why naive FP16 training fails.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Loss Scaling</div><div class="step-detail">Multiply the loss by a large factor (e.g., 1024) before backward pass. This scales ALL gradients up, preventing underflow in FP16. After the backward pass, unscale the gradients before the optimizer step. Dynamic loss scaling adjusts the scale factor automatically.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Master Weights in FP32</div><div class="step-detail">Keep a copy of the model weights in FP32 (the "master weights"). Forward/backward pass uses FP16 weights. The optimizer step updates FP32 master weights, then casts back to FP16. This prevents small gradient updates from being rounded to zero in FP16.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">BF16: The Simpler Alternative</div><div class="step-detail">BF16 has the same exponent range as FP32, so it almost never overflows. No loss scaling needed! The trade-off is less precision (7 mantissa bits vs. 10 in FP16). For most LLM training, BF16 is now the default choice.</div></div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">FP32 Master Weights</div><div class="flow-desc">Full precision copy</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Cast to FP16/BF16</div><div class="flow-desc">For forward pass</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Forward + Loss</div><div class="flow-desc">All in half precision</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Scale Loss</div><div class="flow-desc">Prevent gradient underflow</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Backward (FP16)</div><div class="flow-desc">Gradients in half prec</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Unscale + Update FP32</div><div class="flow-desc">Optimizer on master</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler\n\nmodel = MyModel().<span class="fn">cuda</span>()\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)\nscaler = <span class="fn">GradScaler</span>()  <span class="cm"># dynamic loss scaling</span>\n\n<span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n    optimizer.<span class="fn">zero_grad</span>()\n    \n    <span class="cm"># Forward pass in FP16 (autocast)</span>\n    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.float16):\n        logits = <span class="fn">model</span>(batch[<span class="str">"input_ids"</span>])\n        loss = F.<span class="fn">cross_entropy</span>(logits, batch[<span class="str">"labels"</span>])\n    \n    <span class="cm"># Backward with loss scaling</span>\n    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()  <span class="cm"># scaled FP16 gradients</span>\n    scaler.<span class="fn">step</span>(optimizer)          <span class="cm"># unscale + FP32 update</span>\n    scaler.<span class="fn">update</span>()                <span class="cm"># adjust scale factor</span>\n\n<span class="cm"># BF16 alternative (simpler, no scaler needed)</span>\n<span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):\n    logits = <span class="fn">model</span>(batch[<span class="str">"input_ids"</span>])\n    loss = F.<span class="fn">cross_entropy</span>(logits, batch[<span class="str">"labels"</span>])\nloss.<span class="fn">backward</span>()     <span class="cm"># no scaling needed!</span>\noptimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<div class="calc-highlight"><strong>Practical speedup:</strong> On NVIDIA A100, FP16 with Tensor Cores provides up to 8x throughput over FP32. BF16 provides similar speedup. Memory usage drops by ~50% (weights, activations, gradients all halved). This means you can train a model twice as large on the same GPU, or train the same model twice as fast.</div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does BF16 sacrifice mantissa bits for exponent bits compared to FP16? Because overflow is catastrophic (NaN kills training) while reduced precision just adds noise. In deep learning, SGD noise already dominates over rounding noise, so fewer precision bits barely matter. But a single overflow event can destroy an entire training run. BF16 trades precision for safety &mdash; an excellent engineering trade-off.</div></div>'

/* ============================================================
   SECTION 10: Course Summary & Complete ML Math Roadmap
   ============================================================ */
+ '<h2 class="l-title">10. Course Summary &amp; Complete ML Math Roadmap</h2>'

+ '<p class="l-text">You have now completed <strong>21 lessons</strong> spanning the entire mathematical foundation of machine learning. This final section ties everything together into a coherent picture: what you learned, how it connects, and where to go next.</p>'

+ '<div class="calc-highlight"><strong>The big picture:</strong> Machine learning is applied mathematics. Linear algebra gives you the language (vectors, matrices, transformations). Calculus gives you the engine (gradients, optimization). Probability and statistics give you the framework (uncertainty, inference, learning from data). Numerical methods give you the tools to make it all work on real hardware.</div>'

/* Plotly: Course roadmap as a network-style visualization */
+ '<div id="plot-roadmap" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var nodes_x=[0.5,0.15,0.35,0.55,0.75,0.85, 0.1,0.25,0.4,0.55,0.7,0.9, 0.1,0.25,0.4,0.55,0.7,0.9];'
+ 'var nodes_y=[0.95,0.72,0.72,0.72,0.72,0.72, 0.42,0.42,0.42,0.42,0.42,0.42, 0.12,0.12,0.12,0.12,0.12,0.12];'
+ 'var labels=["ML Math Foundation","L1: Vectors","L2: Matrices","L3: Eigen/SVD","L4: Probability","L5: Statistics",'
+ '"L7: Limits","L8: Diff Rules","L9: Partials","L10: Chain Rule","L11: Integration","L12: Optimization",'
+ '"L13: Distributions","L14: Info Theory","L15: Estimation","L16: Regularization","L17: Num. Methods","L18: Roadmap"];'
+ 'var colors=["#c8a96e","#e74c3c","#e74c3c","#e74c3c","#e74c3c","#e74c3c","#4ecdc4","#4ecdc4","#4ecdc4","#4ecdc4","#4ecdc4","#4ecdc4","#c8a96e","#c8a96e","#c8a96e","#c8a96e","#c8a96e","#c8a96e"];'
+ 'var sizes=[30,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,22];'
+ 'var edge_x=[];var edge_y=[];'
+ 'var edges=[[0,1],[0,2],[0,3],[0,4],[0,5],[1,6],[2,7],[3,8],[4,9],[5,10],[5,11],[6,12],[7,13],[8,14],[9,15],[10,16],[11,17]];'
+ 'for(var i=0;i<edges.length;i++){var a=edges[i][0],b=edges[i][1];edge_x.push(nodes_x[a],nodes_x[b],null);edge_y.push(nodes_y[a],nodes_y[b],null);}'
+ 'var t1={x:edge_x,y:edge_y,mode:"lines",line:{color:"rgba(200,169,110,0.3)",width:1.5},hoverinfo:"none",showlegend:false};'
+ 'var t2={x:nodes_x,y:nodes_y,mode:"markers+text",marker:{size:sizes,color:colors,line:{color:"rgba(255,255,255,0.3)",width:1}},text:labels,textposition:"bottom center",textfont:{color:"#ebe6dc",size:9},hoverinfo:"text",showlegend:false};'
+ 'var ann1={x:0.5,y:0.75,text:"Linear Algebra",showarrow:false,font:{color:"#e74c3c",size:13}};'
+ 'var ann2={x:0.5,y:0.45,text:"Calculus",showarrow:false,font:{color:"#4ecdc4",size:13}};'
+ 'var ann3={x:0.5,y:0.15,text:"Math for ML",showarrow:false,font:{color:"#c8a96e",size:13}};'
+ 'var layout={title:{text:"18-Lesson ML Math Roadmap",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{showgrid:false,zeroline:false,showticklabels:false,range:[-0.05,1.05]},yaxis:{showgrid:false,zeroline:false,showticklabels:false,range:[-0.02,1.05]},margin:{t:50,r:10,b:10,l:10},showlegend:false,annotations:[ann1,ann2,ann3]};'
+ 'Plotly.newPlot("plot-roadmap",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},400)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>The complete 18-lesson roadmap:</strong> Linear algebra (red) provides the data structures. Calculus (teal) provides the optimization machinery. Math for ML (gold) provides the statistical and practical tools. Each layer builds on the previous ones.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Linear Algebra</div><div class="card-body"><strong>L1:</strong> Vectors &amp; spaces. <strong>L2:</strong> Matrix operations. <strong>L3:</strong> Eigenvalues &amp; SVD. <strong>L4:</strong> Probability fundamentals. <strong>L5:</strong> Statistics &amp; estimation. <strong>L6:</strong> Distributions for ML.</div></div>'
+ '<div class="calc-card"><div class="card-title">Calculus</div><div class="card-body"><strong>L7:</strong> Limits &amp; derivatives. <strong>L8:</strong> Differentiation rules. <strong>L9:</strong> Partial derivatives &amp; gradients. <strong>L10:</strong> Chain rule &amp; backprop. <strong>L11:</strong> Integration. <strong>L12:</strong> Optimization &amp; GD.</div></div>'
+ '<div class="calc-card"><div class="card-title">Math for ML</div><div class="card-body"><strong>L13:</strong> Probability distributions. <strong>L14:</strong> Information theory. <strong>L15:</strong> MLE &amp; estimation. <strong>L16:</strong> Regularization. <strong>L17:</strong> Numerical methods. <strong>L18:</strong> This roadmap.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>How everything connects in a single training step of a Transformer:</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Data Loading</div><div class="step-detail"><strong>Random sampling</strong> (L17: PRNGs, shuffling) creates a mini-batch. Tokenized text becomes integer sequences, embedded as <strong>vectors</strong> (L1). Positional encodings use <strong>sinusoidal functions</strong> (L7-L8).</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Forward Pass: Attention</div><div class="step-detail"><strong>Matrix multiplications</strong> (L2) compute Q, K, V. Attention scores = $QK^T / \\sqrt{d_k}$ uses <strong>dot products</strong> (L1). <strong>Softmax</strong> (L17: log-sum-exp trick) normalizes scores. <strong>Mixed precision</strong> (L17: BF16) halves memory and doubles speed.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Forward Pass: FFN + Loss</div><div class="step-detail">Feed-forward layers apply <strong>nonlinear activations</strong> (L7: continuous functions). Layer norm uses <strong>mean and variance</strong> (L5). Cross-entropy loss combines <strong>information theory</strong> (L14) with <strong>stable log-softmax</strong> (L17).</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Backward Pass</div><div class="step-detail"><strong>Chain rule</strong> (L10) propagates gradients through every layer. <strong>Partial derivatives</strong> (L9) compute parameter-specific gradients. <strong>Loss scaling</strong> (L17) prevents FP16 gradient underflow.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Optimizer Step</div><div class="step-detail"><strong>Adam optimizer</strong> uses first and second <strong>moment estimates</strong> (L5: statistics). Learning rate scheduling uses <strong>cosine decay</strong> (L8: trig functions). Weight decay implements <strong>L2 regularization</strong> (L16). Master weights updated in <strong>FP32</strong> (L17).</div></div></div>'
+ '<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Evaluation</div><div class="step-detail"><strong>Perplexity</strong> = $2^{H(p,q)}$ uses <strong>cross-entropy</strong> (L14). BLEU/ROUGE scores use <strong>probability and counting</strong> (L4). <strong>SVD</strong> (L3) reveals what the model learned in embedding space.</div></div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>The key insight:</strong> These 21 lessons are not separate topics. They form a tightly interlocked system. You cannot understand backpropagation without the chain rule. You cannot train stably without numerical methods. You cannot design loss functions without information theory. You cannot regularize without understanding the bias-variance trade-off. Every piece connects to every other piece.</div>'

+ '<p class="l-text"><strong>What to study next:</strong></p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Convex Optimization</div><div class="card-body">Boyd &amp; Vandenberghe\'s textbook. Duality, KKT conditions, convergence proofs for gradient descent. Deepens L12 (optimization) significantly.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bayesian ML</div><div class="card-body">Prior/posterior inference, Gaussian processes, variational methods. Builds on L4-L5 (probability/statistics) and L8 (Monte Carlo). Essential for uncertainty quantification.</div></div>'
+ '<div class="calc-card"><div class="card-title">Matrix Calculus</div><div class="card-body">Jacobians, Hessians, matrix derivatives. Formalizes L9-L10 (partial derivatives, chain rule) for tensors. Required for understanding second-order optimizers.</div></div>'
+ '<div class="calc-card"><div class="card-title">Measure-Theoretic Probability</div><div class="card-body">Rigorous probability theory, sigma-algebras, Lebesgue integration. Deepens L4 (probability) for theoretical ML research and understanding PAC learning.</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Linear Algebra</div><div class="flow-desc">Language of ML</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Calculus</div><div class="flow-desc">Engine of learning</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Probability</div><div class="flow-desc">Framework of uncertainty</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Numerical Methods</div><div class="flow-desc">Making it all work</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">ML Practice</div><div class="flow-desc">Training real models</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Congratulations!</strong> You now have the complete mathematical foundation for understanding modern machine learning at a deep level. When you encounter a new technique &mdash; whether it is LoRA, flash attention, or a novel loss function &mdash; you have the tools to read the paper, understand the math, and implement it yourself. The math never changes; only the applications evolve. Go build something amazing.</div>'

,

/* ==============================================
   TURKISH TRANSLATION
   ============================================== */

tr: '<p class="l-text"><strong>Sayısal yöntemler, güzel matematik teorisi ile gerçek dünya hesaplamaları arasındaki köprüdür.</strong> 21 ders boyunca çalışmış olduğumuz her şey &mdash; lineer cebir, kalkülüs, olasılık, optimizasyon &mdash; sonuç olarak sonlu hassasiyetli aritmetik kullanan donanım üzerinde çalışır. Bilgisayarlar $\\pi$\'yı tam olarak temsil edemez, sonsuz toplamları hesaplayamaz ve geri yayılım sırasında sembolik türev alamaz. Sayısal yöntemler, tüm bunların pratikte çalışmasını sağlayan algoritmalardır.</p>'

+ '<p class="l-text">Bu son ders, her ML uygulayıcısının anlaması gereken pratik gerçekleri kapsar: kayan nokta temsili, sayısal kararlılık hileleri (log-sum-exp gibi), sonlu fark türevi, koşul sayıları, rastgele sayı üretimi, Monte Carlo yöntemleri ve karışık hassasiyet eğitimi. Tüm 21 dersi tutarlı bir ML matematik temeline bağlayan eksiksiz bir yol haritasıyla kapatırız.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>float32, float16 ve bfloat16 yerleşimlerini okuyup hassasiyet sınırlarını öngörmeyi</li>'
+ '<li>Softmax ve cross-entropy\\\'yi sayısal olarak güvenli kılmak için log-sum-exp hilesini uygulamayı</li>'
+ '<li>Analitik gradyanları güvenmeden önce sonlu fark kontrolleriyle doğrulamayı</li>'
+ '<li>Bir matrisin koşul sayısını hesaplayıp kötü koşulluluğu açıklamayı</li>'
+ '<li>Zor integralleri Monte Carlo örneklemeyle tahmin edip varyansı sınırlamayı</li>'
+ '<li>Modern derin ağları karışık hassasiyet (fp16 + fp32 master) ile eğitmeyi</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Neden Sayısal Yöntemler?</h2>'

+ '<div class="calc-highlight"><strong>Temel gerilim:</strong> Matematik teorisi sonsuz hassasiyet, sürekli fonksiyonlar ve kesin aritmetik varsayar. Bilgisayarların sonlu belleği, ayrık temsilleri vardır ve her adımda yuvarlama yapar. Sayısal yöntemler bu boşluğu doldurur.</div>'

+ '<p class="l-text">PyTorch\'ta <code>loss.backward()</code> yazdığınızda, framework kayıp fonksiyonunuzu sembolik olarak türev almaz. Temel işlemleri zincirleyerek kesin türevleri hesaplayan bir sayısal teknik olan <strong>otomatik türev alma</strong> kullanır. Softmax çıkışlarıyla bir dil modeli eğitirken, ham üstel değerler <strong>log-sum-exp hilesi</strong> olmadan sonsuzluğa taşardı. Lineer regresyon için bir matrisin tersini alırken, matris <strong>kötü koşullu</strong> ise verideki küçük değişiklikler çözümün çok değişmesine neden olabilir.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Temsil Hatası</div><div class="card-body">$0.1$ ikili kayan noktada tam olarak temsil edilemez. Python\'da <code>0.1 + 0.2</code> deneyin &mdash; $0.30000000000000004$ elde edersiniz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Taşma</div><div class="card-body">$e^{1000}$ matematiksel olarak sonludur ancak float64\'te <code>inf</code>\'e taşar. Büyük logitlerle softmax buna sürekli düşer.</div></div>'
+ '<div class="calc-card"><div class="card-title">Alt Taşma</div><div class="card-body">$e^{-1000} = 0$ kayan noktada. Çok sayıda küçük olasılığı çarpmak sıfıra düşer. Logaritmik uzay aritmetiği bunu düzeltir.</div></div>'
+ '<div class="calc-card"><div class="card-title">İptal</div><div class="card-body">Yaklaşık eşit sayıları çıkarmak anlamlı basamakları yok eder. $1.000001 - 1.000000 = 0.000001$ 6 basamak hassasiyet kaybeder.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">TEHLİKE GERÇEK</div><div class="example-body">'
+ '<strong>Felaket iptali örneği:</strong><br>'
+ 'Küçük $x$ için $f(x) = \\frac{1 - \\cos(x)}{x^2}$\\\'i hesaplayın:<br><br>'
+ '$x = 10^{-8}$\\\'de: $\\cos(x) \\approx 1 - 5 \\times 10^{-17}$<br>'
+ 'Ancak float64 tam olarak $\\cos(10^{-8}) = 1.0$ hesaplar (1\\\'e yuvarlar)<br>'
+ 'Yani $1 - \\cos(x) = 0$ ve $f(x) = 0$ &mdash; <strong>yanlış!</strong> Doğru cevap $\\approx 0.5$.<br><br>'
+ '<strong>Çözüm:</strong> İptali tamamen önleyen $1 - \\cos(x) = 2\\sin^2(x/2)$ özdeşliğini kullanın.'
+ '</div></div>'

+ '<div class="l-note"><strong>NLP uygulayıcıları neden umursar:</strong> Transformer dikkat skorları büyük logit vektörleri üzerinde softmax içerir. Dil modeli eğitimi binlerce olasılığı çarpar. Uzun dizilerde gradyan birikimi yuvarlama hatalarını büyütür. Sayısal kararlılık opsiyonel değildir &mdash; modellerinizin eğitilebilmesi için zorunludur.</div>'

+ '<h2 class="l-title">2. Kayan Nokta Temsili</h2>'

+ '<p class="l-text"><strong>IEEE 754 standardı</strong>, bilgisayarların gerçek sayıları nasıl sakladığını tanımlar. Her kayan nokta sayısı şöyle temsil edilir:</p>'

+ '<div class="calc-formula"><div class="formula-label">IEEE 754 FORMATI</div><div class="formula-main">$$(-1)^{\\text{sign}} \\times 1.\\text{mantissa} \\times 2^{\\text{exponent} - \\text{bias}}$$</div><div class="formula-sub">İşaret biti pozitif/negatif belirler. Mantis (significand) kesirli basamakları saklar. Üstel kısım ölçeği (büyüklük veya küçüklük) belirler.</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Float32 (Tek Hassasiyet)</div>'
+ '<div class="compare-item">&#8226; 1 işaret + 8 üstel + 23 mantis = <strong>32 bit</strong></div>'
+ '<div class="compare-item">&#8226; ~7 ondalık basamak hassasiyet</div>'
+ '<div class="compare-item">&#8226; Aralık: $\\pm 3.4 \\times 10^{38}$</div>'
+ '<div class="compare-item">&#8226; GPU eğitiminde varsayılan (PyTorch/TF)</div></div>'
+ '<div class="compare-col"><div class="compare-title">Float64 (Çift Hassasiyet)</div>'
+ '<div class="compare-item">&#8226; 1 işaret + 11 üstel + 52 mantis = <strong>64 bit</strong></div>'
+ '<div class="compare-item">&#8226; ~15-16 ondalık basamak hassasiyet</div>'
+ '<div class="compare-item">&#8226; Aralık: $\\pm 1.8 \\times 10^{308}$</div>'
+ '<div class="compare-item">&#8226; NumPy ve bilimsel hesaplamada varsayılan</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Makine Epsilonu ($\\varepsilon$)</div><div class="step-detail">Kayan noktada $1 + \\varepsilon > 1$ olacak en küçük sayı. Tek bir işlemden gelen yuvarlamanın maksimum bağıl hatasını temsil eder. float32 için $\\varepsilon \\approx 10^{-7}$. float64 için $\\varepsilon \\approx 10^{-16}$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Denormalize Sayılar</div><div class="step-detail">Sıfıra yakın floatlar &quot;denormalize&quot; (subnormal) hale gelir &mdash; örtük baştaki 1, 0 olur. Bu, sıfıra ani sıçrama yerine kademeli alt taşma sağlar. En küçük pozitif float32 denorm $\\approx 1.4 \\times 10^{-45}$\\\'tir.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Özel Değerler</div><div class="step-detail"><code>inf</code> (taşma), <code>-inf</code>, <code>NaN</code> (0/0, inf-inf). NaN yayılır: NaN ile herhangi bir işlem NaN verir. Bu yüzden tek bir NaN tüm eğitim sürecini öldürebilir.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Düzgün Olmayan Aralık</div><div class="step-detail">Kayan nokta sayıları düzgün aralıklı DEĞİLDİR. 1.0\\\'e yakın komşu floatlar $\\sim 10^{-7}$ kadar farklıdır (float32). $10^6$\\\'ya yakın $\\sim 0.1$ kadar. $10^{-6}$\\\'ya yakın $\\sim 10^{-13}$ kadar. Yoğunluk büyüklük arttıkça azalır.</div></div></div>'
+ '</div>'

+ '<div id="plot-float-spacing-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var x=[];var sp=[];for(var e=-10;e<=10;e+=0.5){var v=Math.pow(2,e);x.push(v);sp.push(v*1.1920929e-7);}'
+ 'var t1={x:x,y:sp,mode:"lines+markers",name:"Float32 aralığı",line:{color:"#c8a96e",width:2},marker:{size:4}};'
+ 'var layout={title:{text:"Float32: Komşu Sayılar Arası Aralık",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Değer",type:"log"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Sonraki Float Farkı",type:"log"},margin:{t:50,r:30,b:50,l:60},showlegend:false};'
+ 'Plotly.newPlot("plot-float-spacing-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Düzensiz float aralığı:</strong> Komşu kayan nokta sayıları arasındaki boşluk büyüklükle orantılı olarak büyür. Sıfıra yakın floatlar son derece yoğundur. Büyük sayılara yakın boşluklar belirgin hale gelir. Bu log-log grafik doğrusal ilişkiyi gösterir: aralık $\\approx |x| \\cdot \\varepsilon$.</div></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">PyTorch eğitim için neden float64 yerine varsayılan olarak float32 kullanır? İki neden: (1) GPU\\\'larda çok daha fazla float32 hesaplama birimi vardır, eğitim 2-8 kat daha hızlıdır, (2) stokastik gradyan inişinden gelen gürültü float32 yuvarlama hatalarından çok daha büyüktür, dolayısıyla float64\\\'ün ekstra hassasiyeti israftır. SGD gürültüsü kayan-nokta hatalarına baskın doğal bir düzenleyici gibi davranır.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Makine epsilonu</span>\n<span class="fn">print</span>(<span class="str">"float32 eps:"</span>, np.<span class="fn">finfo</span>(np.float32).eps)  <span class="cm"># 1.1920929e-07</span>\n<span class="fn">print</span>(<span class="str">"float64 eps:"</span>, np.<span class="fn">finfo</span>(np.float64).eps)  <span class="cm"># 2.220446049250313e-16</span>\n\n<span class="cm"># Klasik 0.1 + 0.2 problemi</span>\n<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span> == <span class="num">0.3</span>)      <span class="cm"># False!</span>\n<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span>)              <span class="cm"># 0.30000000000000004</span>\n<span class="fn">print</span>(np.<span class="fn">isclose</span>(<span class="num">0.1</span> + <span class="num">0.2</span>, <span class="num">0.3</span>))  <span class="cm"># True (tolerans tabanlı)</span>\n\n<span class="cm"># Farklı büyüklüklerde floatlar arası aralık</span>\n<span class="fn">print</span>(<span class="str">"1.0 yakın aralık:"</span>, np.<span class="fn">spacing</span>(<span class="num">1.0</span>))    <span class="cm"># 2.22e-16</span>\n<span class="fn">print</span>(<span class="str">"1e6 yakın aralık:"</span>, np.<span class="fn">spacing</span>(<span class="num">1e6</span>))    <span class="cm"># 1.16e-10</span>\n<span class="fn">print</span>(<span class="str">"1e15 yakın aralık:"</span>, np.<span class="fn">spacing</span>(<span class="num">1e15</span>))  <span class="cm"># 0.125</span></code></pre></div>'

+ '<h2 class="l-title">3. Sayısal Taşma ve Alt Taşma</h2>'

+ '<p class="l-text"><strong>Taşma</strong>, bir sayı temsil edilebilir maksimum değeri aştığında oluşur (<code>inf</code> olur). <strong>Alt taşma</strong>, bir sayı sıfıra çok yakın olduğu için temsil edilemediğinde oluşur (<code>0</code> olur). Her ikisi de ML\\\'de felakettir çünkü NaN gradyanlar üretir ve eğitimi öldürür.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Taşma Örneği</div><div class="card-body">Softmax: $e^{1000} = $ <code>inf</code> float32\'de. 89\'dan büyük herhangi bir logit üstel fonksiyonu taşırıya neden olur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Alt Taşma Örneği</div><div class="card-body">Ortak olasılık: $P(w_1, ..., w_{100}) = \\prod P(w_i)$. Her $P \\approx 0.01$ ise, çarpım $10^{-200}$ &mdash; sıfıra düşer.</div></div>'
+ '<div class="calc-card"><div class="card-title">Log-Uzay Çözümü</div><div class="card-body">Log uzayında çalışın: $\\log P = \\sum \\log P(w_i)$. Toplamlar temsil edilebilir aralıkta kalır.</div></div>'
+ '<div class="calc-card"><div class="card-title">NaN Yayılımı</div><div class="card-body">$\\text{inf} - \\text{inf} = \\text{NaN}$. NaN bir kez ortaya çıkınca, gradyanlar aracılığıyla her parametreye yayılır.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">SOFTMAX TAŞMASI: KLASİK ML BAŞARISIZLIĞI</div><div class="example-body">'
+ '<strong>Naif softmax:</strong> $\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$<br><br>'
+ 'Logitler $z = [1000, 1001, 1002]$ ile:<br>'
+ '$e^{1000} = $ <code>inf</code>, $e^{1001} = $ <code>inf</code>, $e^{1002} = $ <code>inf</code><br>'
+ 'Sonuç: $\\frac{\\text{inf}}{\\text{inf}} = $ <code>NaN</code><br><br>'
+ '<strong>Kararlı softmax:</strong> Maksimumu çıkar: $z\\\' = z - \\max(z) = [-2, -1, 0]$<br>'
+ '$e^{-2} = 0.135$, $e^{-1} = 0.368$, $e^{0} = 1.0$<br>'
+ 'Toplam $= 1.503$. Sonuç: $[0.090, 0.245, 0.665]$ &mdash; <strong>doğru!</strong>'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">naive_softmax</span>(z):\n    <span class="str">"""Sayısal olarak KARARSIZ softmax."""</span>\n    exp_z = np.<span class="fn">exp</span>(z)\n    <span class="kw">return</span> exp_z / np.<span class="fn">sum</span>(exp_z)\n\n<span class="kw">def</span> <span class="fn">stable_softmax</span>(z):\n    <span class="str">"""Sayısal olarak KARARLI softmax (max çıkar)."""</span>\n    z_shifted = z - np.<span class="fn">max</span>(z)   <span class="cm"># max = 0 olacak şekilde kaydır</span>\n    exp_z = np.<span class="fn">exp</span>(z_shifted)\n    <span class="kw">return</span> exp_z / np.<span class="fn">sum</span>(exp_z)\n\nz = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">1002.0</span>])\n<span class="fn">print</span>(<span class="str">"Naif:"</span>, <span class="fn">naive_softmax</span>(z))    <span class="cm"># [nan, nan, nan]</span>\n<span class="fn">print</span>(<span class="str">"Kararlı:"</span>, <span class="fn">stable_softmax</span>(z)) <span class="cm"># [0.090, 0.245, 0.665]</span>\n\n<span class="cm"># Alt taşma örneği: küçük olasılıkları çarpma</span>\nprobs = np.<span class="fn">array</span>([<span class="num">0.01</span>] * <span class="num">200</span>)\n<span class="fn">print</span>(<span class="str">"Çarpım:"</span>, np.<span class="fn">prod</span>(probs))         <span class="cm"># 0.0 (alt taşma!)</span>\n<span class="fn">print</span>(<span class="str">"Log toplamı:"</span>, np.<span class="fn">sum</span>(np.<span class="fn">log</span>(probs))) <span class="cm"># -921.03 (doğru!)</span></code></pre></div>'

+ '<div class="l-warn"><strong>Pratik kural:</strong> Çok sayıda küçük olasılığı asla doğrudan çarpmayın. Her zaman log-uzayında çalışın. Önce maksimumu çıkarmadan asla büyük sayıları üstellemeyin. Yalnızca bu iki kural ML\\\'deki sayısal sorunların %90\\\'ını önler.</div>'

+ '<h2 class="l-title">4. Log-Sum-Exp Hilesi</h2>'

+ '<p class="l-text"><strong>Log-sum-exp (LSE)</strong> hilesi makine öğreniminde tek başına en önemli sayısal kararlılık tekniğidir. Taşma veya alt taşma olmadan $\\log \\sum_i e^{x_i}$\\\'i hesaplar ve softmax, çapraz entropi kaybı ile log-olabilirlik hesaplamalarının kararlı uygulamalarının temelinde yatar.</p>'

+ '<div class="calc-formula"><div class="formula-label">LOG-SUM-EXP HİLESİ</div><div class="formula-main">$$\\log \\sum_{i} e^{x_i} = c + \\log \\sum_{i} e^{x_i - c}$$</div><div class="formula-sub">$c = \\max_i(x_i)$. Maksimumu çıkarmak en büyük üstel değerin $e^0 = 1$ olmasını sağlar ve taşmayı önler.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Maksimumu Bul</div><div class="step-detail">$c = \\max(x_1, x_2, ..., x_n)$. Güvenli bir işlem &mdash; taşma olasılığı yok.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Çıkar ve Üstel Al</div><div class="step-detail">Her $i$ için $e^{x_i - c}$ hesaplayın. $x_i - c \\le 0$ olduğu için her üstel değer $[0, 1]$ aralığında. Taşma yok!</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Topla ve Log Al</div><div class="step-detail">$\\sum_i e^{x_i - c} \\ge 1$, dolayısıyla $\\log(\\text{sum}) \\ge 0$. Logaritmada alt taşma yok.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Maksimumu Geri Ekle</div><div class="step-detail">Sonuç $= c + \\log(\\text{sum})$. Matematiksel olarak aynı, sayısal olarak kararlı.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">İŞ BAŞINDA LOG-SUM-EXP</div><div class="example-body">'
+ '<strong>Girdi:</strong> $x = [1000, 1001, 1002]$<br><br>'
+ '<strong>Naif:</strong> $\\log(e^{1000} + e^{1001} + e^{1002}) = \\log(\\text{inf}) = \\text{inf}$<br><br>'
+ '<strong>Kararlı (LSE hilesi):</strong><br>'
+ '$c = 1002$<br>'
+ '$\\log(e^{-2} + e^{-1} + e^{0}) = \\log(0.135 + 0.368 + 1.0) = \\log(1.503) = 0.407$<br>'
+ 'Sonuç: $1002 + 0.407 = 1002.407$ &mdash; <strong>doğru ve sonlu!</strong>'
+ '</div></div>'

+ '<div class="calc-highlight"><strong>LSE\\\'nin ML\\\'de göründüğü yerler:</strong> (1) <em>Kararlı softmax</em>: $\\text{softmax}(z)_i = \\exp(z_i - \\text{LSE}(z))$. (2) <em>Çapraz entropi kaybı</em>: PyTorch\\\'un <code>CrossEntropyLoss</code>\\\'u dahili LSE kullanır. (3) <em>Log-olabilirlik</em>: $\\log p(x) = \\log \\sum_z p(x, z) = \\text{LSE}(\\log p(x, z))$. (4) Konuşma tanımada <em>CTC kaybı</em>. (5) Transformer\\\'larda <em>dikkat skorları</em>.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy.special <span class="kw">import</span> logsumexp\n\n<span class="kw">def</span> <span class="fn">my_logsumexp</span>(x):\n    <span class="str">"""Sayısal olarak kararlı log-sum-exp."""</span>\n    c = np.<span class="fn">max</span>(x)\n    <span class="kw">return</span> c + np.<span class="fn">log</span>(np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(x - c)))\n\n<span class="kw">def</span> <span class="fn">stable_log_softmax</span>(z):\n    <span class="str">"""LSE ile log-softmax: log(softmax(z)) = z - LSE(z)."""</span>\n    <span class="kw">return</span> z - <span class="fn">my_logsumexp</span>(z)\n\n<span class="kw">def</span> <span class="fn">stable_cross_entropy</span>(logits, target_idx):\n    <span class="str">"""Ham logitlerden kararlı çapraz entropi (softmax gerekmez)."""</span>\n    <span class="kw">return</span> -logits[target_idx] + <span class="fn">my_logsumexp</span>(logits)\n\nx = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">1002.0</span>])\n<span class="fn">print</span>(<span class="str">"LSE:"</span>, <span class="fn">my_logsumexp</span>(x))               <span class="cm"># 1002.407</span>\n<span class="fn">print</span>(<span class="str">"scipy:"</span>, <span class="fn">logsumexp</span>(x))               <span class="cm"># 1002.407 (aynı)</span>\n<span class="fn">print</span>(<span class="str">"log-softmax:"</span>, <span class="fn">stable_log_softmax</span>(x)) <span class="cm"># [-2.408, -1.408, -0.408]</span>\n<span class="fn">print</span>(<span class="str">"CE kayıp:"</span>, <span class="fn">stable_cross_entropy</span>(x, <span class="num">2</span>)) <span class="cm"># 0.408</span></code></pre></div>'

+ '<div class="l-note"><strong>PyTorch ipucu:</strong> Her zaman <code>torch.log(F.softmax())</code> yerine <code>F.log_softmax()</code> kullanın. Birleşmiş sürüm dahili olarak LSE hilesini kullanır. Benzer şekilde, softmax çıktıları değil ham logitleri alan <code>nn.CrossEntropyLoss</code> kullanın.</div>'

+ '<h2 class="l-title">5. Sayısal Türev Alma</h2>'

+ '<p class="l-text">Derin öğrenme eğitim için <strong>otomatik türev alma</strong> (sayısal türev değil) kullansa da, sonlu farkları anlamak şu üç durumda kritiktir: (1) hata ayıklama sırasında gradyan kontrolü, (2) autograd\\\'ın atlattığı uzlaşmaları kavramak ve (3) kara-kutu fonksiyonların türevlerine ihtiyaç duyduğunuz durumlar.</p>'

+ '<div class="calc-formula"><div class="formula-label">ÜÇ SONLU FARK FORMÜLÜ</div><div class="formula-main">$$\\begin{aligned}\\text{Forward:} \\quad &f\'(x) \\approx \\frac{f(x+h) - f(x)}{h} \\\\[8pt] \\text{Backward:} \\quad &f\'(x) \\approx \\frac{f(x) - f(x-h)}{h} \\\\[8pt] \\text{Central:} \\quad &f\'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h}\\end{aligned}$$</div><div class="formula-sub">İleri ve geri $O(h)$ doğruluğundadır. Merkezi fark $O(h^2)$ &mdash; aynı $h$ için çok daha doğru.</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Kesme Hatası</div>'
+ '<div class="compare-item">&#8226; Yüksek-mertebeden Taylor terimlerini atmaktan</div>'
+ '<div class="compare-item">&#8226; $h \\to 0$ ile azalır</div>'
+ '<div class="compare-item">&#8226; İleri/geri: $O(h)$</div>'
+ '<div class="compare-item">&#8226; Merkezi: $O(h^2)$ (çok daha iyi)</div>'
+ '<div class="compare-item">&#8226; $h$\\\'yi olabildiğince küçük ister</div></div>'
+ '<div class="compare-col"><div class="compare-title">Yuvarlama Hatası</div>'
+ '<div class="compare-item">&#8226; Sonlu hassasiyetli çıkarmadan</div>'
+ '<div class="compare-item">&#8226; $h \\to 0$ ile artar (iptal!)</div>'
+ '<div class="compare-item">&#8226; $\\sim \\varepsilon / h$, $\\varepsilon$ = makine epsilonu</div>'
+ '<div class="compare-item">&#8226; Çok küçük $h$ için baskındır</div>'
+ '<div class="compare-item">&#8226; $h$\\\'yi olabildiğince büyük ister</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>Optimal $h$:</strong> İleri/geri farklarda, optimal adım boyutu kesme ve yuvarlama hatalarını $h^* \\approx \\sqrt{\\varepsilon} \\approx 10^{-8}$ (float64) noktasında dengeler. Merkezi farklarda $h^* \\approx \\varepsilon^{1/3} \\approx 10^{-5}$ (float64). Çok küçük olursa gürültü, çok büyük olursa sapma alırsınız.</div>'

+ '<div id="plot-num-diff-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var hs=[];var fwd=[];var ctr=[];var eps=2.22e-16;'
+ 'for(var e=-15;e<=0;e+=0.25){'
+ 'var h=Math.pow(10,e);hs.push(h);'
+ 'var trunc_fwd=h/2;var round_fwd=eps/h;fwd.push(trunc_fwd+round_fwd);'
+ 'var trunc_ctr=h*h/6;var round_ctr=eps/h;ctr.push(trunc_ctr+round_ctr);}'
+ 'var t1={x:hs,y:fwd,mode:"lines",name:"İleri O(h)",line:{color:"#e74c3c",width:2}};'
+ 'var t2={x:hs,y:ctr,mode:"lines",name:"Merkezi O(h^2)",line:{color:"#4ecdc4",width:2}};'
+ 'var layout={title:{text:"Sayısal Türev Hatası vs Adım Boyutu h",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Adım boyutu h",type:"log"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Toplam hata",type:"log"},margin:{t:50,r:30,b:50,l:60},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-num-diff-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>V-şeklinde hata eğrisi:</strong> $h$ azaldıkça, kesme hatası düşer ama yuvarlama hatası yükselir. Toplam hata optimal $h$\'de minimuma ulaşır.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">numerical_gradient</span>(f, x, h=<span class="num">1e-5</span>):\n    <span class="str">"""Çok değişkenli f için merkezi fark gradyanı."""</span>\n    grad = np.<span class="fn">zeros_like</span>(x, dtype=np.float64)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):\n        x_plus = x.<span class="fn">copy</span>(); x_plus[i] += h\n        x_minus = x.<span class="fn">copy</span>(); x_minus[i] -= h\n        grad[i] = (f(x_plus) - f(x_minus)) / (<span class="num">2</span> * h)\n    <span class="kw">return</span> grad\n\n<span class="cm"># Gradyan kontrolü: autograd\'ı sonlu farklara karşı doğrula</span>\n<span class="kw">def</span> <span class="fn">gradient_check</span>(f, x, analytic_grad, h=<span class="num">1e-5</span>, tol=<span class="num">1e-5</span>):\n    <span class="str">"""Analitik vs sayısal gradyanı karşılaştır."""</span>\n    num_grad = <span class="fn">numerical_gradient</span>(f, x, h)\n    diff = np.<span class="fn">abs</span>(analytic_grad - num_grad)\n    rel_err = diff / (np.<span class="fn">abs</span>(analytic_grad) + np.<span class="fn">abs</span>(num_grad) + <span class="num">1e-8</span>)\n    <span class="fn">print</span>(<span class="str">"Maks bağıl hata:"</span>, np.<span class="fn">max</span>(rel_err))\n    <span class="kw">return</span> np.<span class="fn">all</span>(rel_err < tol)\n\n<span class="cm"># Örnek: f(x) = x^2, gradyan = 2x</span>\nf = <span class="kw">lambda</span> x: np.<span class="fn">sum</span>(x**<span class="num">2</span>)\nx = np.<span class="fn">array</span>([<span class="num">3.0</span>, <span class="num">4.0</span>, <span class="num">5.0</span>])\n<span class="fn">print</span>(<span class="str">"Sayısal:"</span>, <span class="fn">numerical_gradient</span>(f, x))  <span class="cm"># [6., 8., 10.]</span>\n<span class="fn">print</span>(<span class="str">"Analitik:"</span>, <span class="num">2</span> * x)                  <span class="cm"># [6., 8., 10.]</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">PyTorch neden sayısal türev alma yerine otomatik türev alma kullanıyor? $n$ parametreli bir fonksiyon için sayısal türev alma $2n$ fonksiyon değerlendirmesi gerektirir. Milyonlarca parametreli bir model için bu imkansız derecede pahalıdır. Autograd, $n$\'den bağımsız olarak $O(1)$ geri geçişte kesin gradyanı hesaplar.</div></div>'

+ '<h2 class="l-title">6. Lineer Cebirde Sayısal Kararlılık</h2>'

+ '<p class="l-text">$Ax = b$\\\'yi çözmek ML\\\'nin temelidir (lineer regresyon, en küçük kareler, PCA). Ama bütün sistemler eşit yaratılmamıştır. Bazıları <strong>iyi koşulludur</strong> &mdash; $b$\\\'deki küçük değişiklikler $x$\\\'te küçük değişiklikler yaratır. Diğerleri <strong>kötü koşulludur</strong> &mdash; $b$\\\'deki minik bozulmalar çözümün vahşice değişmesine yol açar.</p>'

+ '<div class="calc-formula"><div class="formula-label">KOŞUL SAYISI</div><div class="formula-main">$$\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\| = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}}$$</div><div class="formula-sub">En büyük ve en küçük tekil değerin oranı. Giriş hatalarının çıktıda ne kadar büyütüldüğünü ölçer. $\\kappa = 1$ mükemmel; $\\kappa \\gg 1$ kötü koşullu.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İyi Koşullu ($\\kappa \\approx 1$)</div><div class="step-detail">Birim matrisin koşul sayısı $\\kappa = 1$\'dir. Küçük değişiklikler orantılı olarak küçük değişikliklere neden olur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Orta Koşullu ($\\kappa \\sim 10^3$)</div><div class="step-detail">Yaklaşık $\\log_{10}(\\kappa) \\approx 3$ basamak hassasiyet kaybedersiniz. Float64 ile ~13 doğru basamak kalır.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Kötü Koşullu ($\\kappa > 10^{10}$)</div><div class="step-detail">10+ basamak kaybedersiniz. Float32 ile çözüm anlamsızdır. Düzenleme şart.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Tekil ($\\kappa = \\infty$)</div><div class="step-detail">$\\sigma_{\\min} = 0$. Matrisin tersi yoktur. Sistem ya çözümsüzdür ya da sonsuz çözümlüdür. Sözde-ters veya SVD kullanın.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ML\\\'DE KÖTÜ KOŞULLU SİSTEM</div><div class="example-body">'
+ '<strong>Lineer regresyonda çoklu doğrusal özellikler:</strong><br>'
+ 'Eğer özellik $x_2 \\approx 2 x_1 + \\epsilon$ ise (neredeyse lineer bağımlı), tasarım matrisi $X^T X$ kötü koşullu hale gelir.<br><br>'
+ '$X^T X = \\begin{pmatrix} 100 & 200.01 \\\\ 200.01 & 400.04 \\end{pmatrix}$, $\\kappa \\approx 10^6$<br><br>'
+ 'Normal denklem $\\hat{\\beta} = (X^T X)^{-1} X^T y$ herhangi bir gürültüyü $10^6$ kat büyütür!<br><br>'
+ '<strong>Çözüm: Ridge regresyon</strong> $\\lambda I$ ekler:<br>'
+ '$\\hat{\\beta} = (X^T X + \\lambda I)^{-1} X^T y$<br>'
+ 'Bu $\\sigma_{\\min}$\\\'ı $\\lambda$ kadar artırır ve koşul sayısını çarpıcı biçimde iyileştirir.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># İyi koşullu sistem</span>\nA_good = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">1</span>], [<span class="num">1</span>, <span class="num">3</span>]])\n<span class="fn">print</span>(<span class="str">"İyi koşul:"</span>, np.linalg.<span class="fn">cond</span>(A_good))  <span class="cm"># ~2.6</span>\n\n<span class="cm"># Kötü koşullu: neredeyse tekil (Hilbert matrisi)</span>\nn = <span class="num">10</span>\nH = np.<span class="fn">array</span>([[<span class="num">1.0</span>/(i+j+<span class="num">1</span>) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n)] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])\n<span class="fn">print</span>(<span class="str">"Hilbert koşulu:"</span>, np.linalg.<span class="fn">cond</span>(H))  <span class="cm"># ~10^13 !</span>\n\n<span class="cm"># Kötü koşullu sistemi çözme</span>\nb = np.<span class="fn">ones</span>(n)\nx_direct = np.linalg.<span class="fn">solve</span>(H, b)    <span class="cm"># güvenilmez</span>\n\n<span class="cm"># Çözüm: Düzenle (Ridge)</span>\nlam = <span class="num">1e-6</span>\nH_reg = H + lam * np.<span class="fn">eye</span>(n)\n<span class="fn">print</span>(<span class="str">"Düzenlenmiş koşul:"</span>, np.linalg.<span class="fn">cond</span>(H_reg))  <span class="cm"># çok daha iyi</span>\nx_ridge = np.linalg.<span class="fn">solve</span>(H_reg, b)  <span class="cm"># kararlı çözüm</span>\n\n<span class="cm"># Daha iyi: SVD tabanlı sözde-ters kullan</span>\nx_pinv = np.linalg.<span class="fn">lstsq</span>(H, b, rcond=<span class="kw">None</span>)[<span class="num">0</span>]</code></pre></div>'

+ '<div class="l-note"><strong>Düzenlemeyle bağlantı:</strong> Şimdi L2 düzenlemenin lineer regresyonda neden çalıştığının derin nedenini görüyorsunuz. Ridge regresyon sadece aşırı uyumu önlemez &mdash; aynı zamanda $X^T X$\'in koşul sayısını iyileştirerek hesaplamayı sayısal olarak kararlı hale getirir.</div>'

+ '<h2 class="l-title">7. Rastgele Sayı Üretimi</h2>'

+ '<p class="l-text">Rastgelelik ML\\\'nin her yerindedir: ağırlık başlatma, veri karıştırma, dropout, stokastik gradyan inişi, veri arttırma ve üretici modellerden örnekleme. Ancak bilgisayarlar deterministik makinelerdir. <strong>Sözde rastgele sayı üreticileri (PRNG)</strong> rastgele görünen ama başlangıç <strong>tohumu</strong> tarafından tamamen belirlenen diziler üretir.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Tohum</div><div class="card-body">PRNG durumunu başlatan bir tamsayı. Aynı tohum = aynı dizi = tekrarlanabilir deneyler. ML sonuçlarını raporlarken her zaman tohum belirleyin.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mersenne Twister</div><div class="card-body">NumPy\'ın varsayılan PRNG\'si. $2^{19937}-1$ periyot. Mükemmel istatistiksel özellikler ama yavaş.</div></div>'
+ '<div class="calc-card"><div class="card-title">PCG / Philox</div><div class="card-body">NumPy 1.17+ ve JAX\'ta kullanılan modern PRNG\'ler. Daha hızlı, daha küçük durum, daha iyi paralellik.</div></div>'
+ '<div class="calc-card"><div class="card-title">Düzgün Temel</div><div class="card-body">PRNG\'ler düzgün $U[0,1]$ sayıları üretir. Diğer tüm dağılımlar dönüşümlerle elde edilir.</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Ters CDF Yöntemi</div>'
+ '<div class="compare-item">&#8226; $u \\sim U[0,1]$ üret</div>'
+ '<div class="compare-item">&#8226; Hedef CDF $F$ için $F^{-1}(u)$ döndür</div>'
+ '<div class="compare-item">&#8226; Ters CDF\\\'si bilinen herhangi bir dağılım için çalışır</div>'
+ '<div class="compare-item">&#8226; Üstel: $x = -\\lambda^{-1} \\ln(1-u)$</div>'
+ '<div class="compare-item">&#8226; Çok değişkenli dağılımları kolayca üretemez</div></div>'
+ '<div class="compare-col"><div class="compare-title">Box-Muller Dönüşümü</div>'
+ '<div class="compare-item">&#8226; İki düzgün $u_1, u_2 \\sim U[0,1]$</div>'
+ '<div class="compare-item">&#8226; $z_1 = \\sqrt{-2 \\ln u_1} \\cos(2\\pi u_2)$</div>'
+ '<div class="compare-item">&#8226; $z_2 = \\sqrt{-2 \\ln u_1} \\sin(2\\pi u_2)$</div>'
+ '<div class="compare-item">&#8226; İki bağımsız $N(0,1)$ örnek üretir</div>'
+ '<div class="compare-item">&#8226; Birçok kütüphane dahili olarak kullanır</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">import</span> torch\n\n<span class="cm"># Tam tekrarlanabilirlik tarifi</span>\nSEED = <span class="num">42</span>\nnp.random.<span class="fn">seed</span>(SEED)\ntorch.<span class="fn">manual_seed</span>(SEED)\ntorch.cuda.<span class="fn">manual_seed_all</span>(SEED)  <span class="cm"># tüm GPU\'lar</span>\ntorch.backends.cudnn.deterministic = <span class="kw">True</span>\ntorch.backends.cudnn.benchmark = <span class="kw">False</span>\n\n<span class="cm"># Modern NumPy: açık Generator (önerilen)</span>\nrng = np.random.<span class="fn">default_rng</span>(SEED)  <span class="cm"># PCG64 üreticisi</span>\n<span class="fn">print</span>(rng.<span class="fn">standard_normal</span>(<span class="num">5</span>))        <span class="cm"># 5 N(0,1) örnek</span>\n<span class="fn">print</span>(rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>))            <span class="cm"># 5 U[0,1] örnek</span>\n\n<span class="cm"># Sıfırdan Box-Muller</span>\n<span class="kw">def</span> <span class="fn">box_muller</span>(rng, n):\n    <span class="str">"""n adet standart normal örnek üret."""</span>\n    u1 = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, n)\n    u2 = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, n)\n    z = np.<span class="fn">sqrt</span>(-<span class="num">2</span> * np.<span class="fn">log</span>(u1)) * np.<span class="fn">cos</span>(<span class="num">2</span> * np.pi * u2)\n    <span class="kw">return</span> z\n\nsamples = <span class="fn">box_muller</span>(rng, <span class="num">10000</span>)\n<span class="fn">print</span>(<span class="str">"Ortalama:"</span>, np.<span class="fn">mean</span>(samples))  <span class="cm"># ~0.0</span>\n<span class="fn">print</span>(<span class="str">"Std:"</span>, np.<span class="fn">std</span>(samples))         <span class="cm"># ~1.0</span></code></pre></div>'

+ '<div class="l-warn"><strong>Tekrarlanabilirlik tuzağı:</strong> <code>torch.manual_seed(42)</code> ayarlamak yeterli değil! Ayrıca NumPy, Python\'un <code>random</code> ve CUDA\'yı da tohumlamanız gerekir. Tam determinizm için <code>torch.use_deterministic_algorithms(True)</code> ayarlayın.</div>'

+ '<h2 class="l-title">8. Monte Carlo Yöntemleri</h2>'

+ '<p class="l-text"><strong>Monte Carlo yöntemleri</strong>, analitik olarak çözülemeyen miktarları tahmin etmek için rastgele örneklemeyi kullanır. ML\\\'de her yerde karşılaşılır: beklenen değerleri tahmin etme, integralleri hesaplama, sonsal dağılımlardan örnekleme ve üretici modelleri eğitme. Temel fikir, rastgele örneklerin herhangi bir beklenen değere yaklaşabilmesidir.</p>'

+ '<div class="calc-formula"><div class="formula-label">MONTE CARLO TAHMİNİ</div><div class="formula-main">$$\\mathbb{E}_{x \\sim p}[f(x)] \\approx \\frac{1}{N} \\sum_{i=1}^{N} f(x_i), \\quad x_i \\sim p$$</div><div class="formula-sub">$p$ dağılımından $N$ örnek çekin, her örnekte $f$\'yi değerlendirin ve ortalayın. Büyük sayılar yasasına göre $N \\to \\infty$ iken gerçek beklenen değere yakınsar.</div></div>'

+ '<div id="plot-monte-carlo-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var ns=[];var ests=[];var trueVal=Math.PI;'
+ 'var rng=(function(){var s=42;return function(){s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;}})();'
+ 'var inside=0;'
+ 'for(var i=1;i<=5000;i++){var x=rng();var y=rng();if(x*x+y*y<=1)inside++;'
+ 'if(i%10===0||i<=20){var est=4*inside/i;ns.push(i);ests.push(est);}}'
+ 'var t1={x:ns,y:ests,mode:"lines",name:"MC tahmini",line:{color:"#c8a96e",width:2}};'
+ 'var t4={x:[0,5000],y:[trueVal,trueVal],mode:"lines",name:"Gerçek pi",line:{color:"#4ecdc4",width:2,dash:"dash"}};'
+ 'var layout={title:{text:"Pi\'nin Monte Carlo Tahmini",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Örnek sayısı"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Tahmin",range:[2.5,4.0]},margin:{t:50,r:30,b:50,l:50},legend:{x:0.6,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-monte-carlo-tr",[t1,t4],layout,{responsive:true,displayModeBar:false});'
+ '},300)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Monte Carlo yakınsaması:</strong> Tahmin $O(1/\\sqrt{N})$ hızında gerçek değere yakınsar. Hatayı yarılamak için 4 kat daha fazla örnek gerekir.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Yakınsama Hızı: $O(1/\\sqrt{N})$</div><div class="step-detail">MC tahmininin standart hatası $= \\sigma / \\sqrt{N}$. Bu hız boyuttan bağımsızdır &mdash; yüksek boyutlarda grid yöntemlerine göre büyük avantaj.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Önem Örneklemesi</div><div class="step-detail">$p$\'den örnekleme zorsa, öneri $q$\'dan örnekleyin: $\\mathbb{E}_p[f(x)] = \\mathbb{E}_q[f(x) \\cdot p(x)/q(x)]$. PPO ve varyasyonel çıkarımda anahtar teknik.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">MCMC</div><div class="step-detail">Durağan dağılımı $p$ olan bir Markov zinciri kurun. Metropolis-Hastings ve HMC, Bayesçi ML\'nin temel araçlarıdır.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">MC olarak Dropout</div><div class="step-detail">MC Dropout: Çıkarımı dropout açıkken $T$ kez çalıştırın ve tahminleri ortalayın. Bu Bayesçi çıkarıma yaklaşır ve bedavaya belirsizlik tahmini verir. NLP\\\'de güven tahmini için yaygın kullanılır.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">PRATİKTE ÖNEM ÖRNEKLEMESİ</div><div class="example-body">'
+ '<strong>Problem:</strong> $f(x)$\\\'in yalnızca kuyrukta ($x > 5$) büyük olduğu $\\mathbb{E}_{x \\sim N(0,1)}[f(x)]$\\\'i tahmin et.<br><br>'
+ 'Naif MC: $N(0,1)$\\\'den çoğu örnek 0\\\'a yakın düşer, nadiren $x > 5$\\\'e ulaşır. Milyonlarca örnek gerekir.<br><br>'
+ '<strong>Önem örneklemesi çözümü:</strong> $q = N(5, 1)$\\\'den (kuyrukta merkezli) örnekleyin:<br>'
+ '$\\mathbb{E}_p[f(x)] = \\mathbb{E}_q\\left[f(x) \\cdot \\frac{p(x)}{q(x)}\\right] \\approx \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) \\cdot \\frac{p(x_i)}{q(x_i)}$<br><br>'
+ 'Artık her örnek $f(x)$\\\'in önemli olduğu bölgede. Çok daha az örnekle çok daha düşük varyans.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\nrng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)\n\n<span class="cm"># Pi\'nin Monte Carlo tahmini</span>\nN = <span class="num">100000</span>\nx = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, N)\ny = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, N)\npi_est = <span class="num">4</span> * np.<span class="fn">mean</span>(x**<span class="num">2</span> + y**<span class="num">2</span> <= <span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">f"Pi tahmini: {pi_est:.4f}"</span>)  <span class="cm"># ~3.1416</span>\n\n<span class="cm"># Önem örneklemesi: X ~ N(0,1) için P(X > 5) tahmini</span>\n<span class="cm"># Gerçek değer: ~2.87e-7</span>\np = stats.<span class="fn">norm</span>(<span class="num">0</span>, <span class="num">1</span>)   <span class="cm"># hedef</span>\nq = stats.<span class="fn">norm</span>(<span class="num">5</span>, <span class="num">1</span>)   <span class="cm"># öneri (kuyrukta merkezli)</span>\n\nsamples = q.<span class="fn">rvs</span>(N, random_state=<span class="num">42</span>)\nweights = p.<span class="fn">pdf</span>(samples) / q.<span class="fn">pdf</span>(samples)\nf_vals = (samples > <span class="num">5</span>).<span class="fn">astype</span>(<span class="fn">float</span>)\nis_estimate = np.<span class="fn">mean</span>(f_vals * weights)\n<span class="fn">print</span>(<span class="str">f"IS tahmini: {is_estimate:.2e}"</span>)     <span class="cm"># ~2.87e-7</span>\n<span class="fn">print</span>(<span class="str">f"Gerçek değer: {1 - p.cdf(5):.2e}"</span>)  <span class="cm"># 2.87e-7</span></code></pre></div>'

+ '<div class="l-note"><strong>NLP\\\'de Monte Carlo:</strong> Dil modelleri çıkarım sırasında örnekleme kullanır (sıcaklık örnekleme, top-k, çekirdek örnekleme). Eğitim sırasında dropout, Bayesçi model ortalamasına bir Monte Carlo yaklaşımıdır. Varyasyonel otomatik kodlayıcılar (VAE) Monte Carlo örnekleri üzerinden geri yayılım yapmak için yeniden parametrelendirme hilesini kullanır. RLHF Monte Carlo politika gradyanı tahminleri kullanır.</div>'

+ '<h2 class="l-title">9. Karışık Hassasiyet Eğitimi</h2>'

+ '<p class="l-text"><strong>Karışık hassasiyet eğitimi</strong>, kritik değerleri FP32\\\'de tutarken çoğu hesaplama için daha düşük hassasiyetli kayan nokta (FP16 veya BF16) kullanır. Bu sadece bir optimizasyon hilesi değildir &mdash; modern dil modellerini verimli eğitmek için temel bilgidir. Tek bir GPU karışık hassasiyetle yarısı kadar bellek kullanarak 2 kat daha hızlı eğitebilir.</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">FP16 ile Taşma Sorunu</div><div class="step-detail">FP16 maksimumu yalnızca 65504. Geri yayılım sırasında gradyan değerleri sıkça bunu aşar ve <code>inf</code>\\\'e taşar. Çapraz entropideki kayıp değerleri büyük kelime hazneleri için 65504\\\'ü aşabilir. Naif FP16 eğitiminin başarısız olmasının nedeni budur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Kayıp Ölçekleme</div><div class="step-detail">Geri yayılımdan önce kaybı büyük bir faktörle (örn. 1024) çarpın. Bu TÜM gradyanları yukarı ölçeklendirir ve FP16\\\'da alt taşmayı önler. Geri yayılımdan sonra optimizer adımından önce gradyanları geri ölçekleyin. Dinamik kayıp ölçekleme faktörü otomatik ayarlar.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">FP32\\\'de Ana Ağırlıklar</div><div class="step-detail">Model ağırlıklarının FP32\\\'de bir kopyasını (&quot;ana ağırlıklar&quot;) tutun. İleri/geri geçiş FP16 ağırlıkları kullanır. Optimizer adımı FP32 ana ağırlıkları günceller, sonra FP16\\\'ya geri çevirir. Bu küçük gradyan güncellemelerinin FP16\\\'da sıfıra yuvarlanmasını engeller.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">BF16: Daha Basit Alternatif</div><div class="step-detail">BF16 üstel aralığı FP32 ile aynıdır, neredeyse hiç taşmaz. Kayıp ölçekleme gerekmez! Karşılığında daha az hassasiyet (FP16\\\'daki 10 yerine 7 mantis biti). Çoğu LLM eğitimi için artık BF16 varsayılan tercihtir.</div></div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">FP16 (Yarım Hassasiyet)</div>'
+ '<div class="compare-item">&#8226; 1 işaret + 5 üstel + 10 mantis = 16 bit</div>'
+ '<div class="compare-item">&#8226; ~3.3 ondalık basamak hassasiyet</div>'
+ '<div class="compare-item">&#8226; Aralık: $\\pm 65504$ (çok sınırlı!)</div>'
+ '<div class="compare-item">&#8226; NVIDIA Tensor Core\'larda hızlı</div></div>'
+ '<div class="compare-col"><div class="compare-title">BF16 (Brain Float)</div>'
+ '<div class="compare-item">&#8226; 1 işaret + 8 üstel + 7 mantis = 16 bit</div>'
+ '<div class="compare-item">&#8226; ~2.4 ondalık basamak hassasiyet</div>'
+ '<div class="compare-item">&#8226; Aralık: FP32 ile aynı ($\\pm 3.4 \\times 10^{38}$)</div>'
+ '<div class="compare-item">&#8226; Nadiren taşar &mdash; eğitim için tercih edilir</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">FP32 Ana Ağırlıklar</div><div class="flow-desc">Tam hassasiyet kopya</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">FP16/BF16 Dönüşüm</div><div class="flow-desc">İleri geçiş için</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">İleri + Kayıp</div><div class="flow-desc">Yarım hassasiyette</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Kayıp Ölçekleme</div><div class="flow-desc">Gradyan alt taşmasını önle</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Geri (FP16)</div><div class="flow-desc">Yarım hassas gradyanlar</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Ölçek Kaldır + FP32</div><div class="flow-desc">Ana ağırlıkları güncelle</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>Pratik hızlanma:</strong> NVIDIA A100\'de FP16 Tensor Core\'lar ile FP32\'ye göre 8 kata kadar verim artışı. Bellek kullanımı ~%50 azalır. Bu, aynı GPU\'da 2 kat daha büyük bir model eğitebileceğiniz veya aynı modeli 2 kat daha hızlı eğitebileceğiniz anlamına gelir.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler\n\nmodel = MyModel().<span class="fn">cuda</span>()\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)\nscaler = <span class="fn">GradScaler</span>()  <span class="cm"># dinamik kayıp ölçekleme</span>\n\n<span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n    optimizer.<span class="fn">zero_grad</span>()\n    \n    <span class="cm"># İleri geçiş FP16\'da (autocast)</span>\n    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.float16):\n        logits = <span class="fn">model</span>(batch[<span class="str">"input_ids"</span>])\n        loss = F.<span class="fn">cross_entropy</span>(logits, batch[<span class="str">"labels"</span>])\n    \n    <span class="cm"># Kayıp ölçeklemesi ile geri</span>\n    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()  <span class="cm"># ölçeklenmiş FP16 gradyanlar</span>\n    scaler.<span class="fn">step</span>(optimizer)          <span class="cm"># ölçek kaldır + FP32 güncelleme</span>\n    scaler.<span class="fn">update</span>()                <span class="cm"># ölçek faktörünü ayarla</span>\n\n<span class="cm"># BF16 alternatifi (daha basit, scaler gerekmez)</span>\n<span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):\n    logits = <span class="fn">model</span>(batch[<span class="str">"input_ids"</span>])\n    loss = F.<span class="fn">cross_entropy</span>(logits, batch[<span class="str">"labels"</span>])\nloss.<span class="fn">backward</span>()     <span class="cm"># ölçekleme gerekmez!</span>\noptimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">BF16 neden FP16\'ya göre mantis bitlerini üstel bitler için feda eder? Çünkü taşma felaket sonuçludur (NaN eğitimi öldürür) ancak düşük hassasiyet sadece gürültü ekler. Derin öğrenmede SGD gürültüsü yuvarlama gürültüsüne zaten baskındır, bu yüzden daha az hassasiyet neredeyse önemsizdir. Ama tek bir taşma olayı tüm eğitimi yok edebilir.</div></div>'

+ '<h2 class="l-title">10. Ders Özeti ve Eksiksiz ML Matematik Yol Haritası</h2>'

+ '<p class="l-text">Makine öğreniminin tüm matematiksel temelini kapsayan <strong>21 dersi</strong> tamamladınız. Bu son bölüm her şeyi tutarlı bir resimde birleştirir.</p>'

+ '<div class="calc-highlight"><strong>Büyük resim:</strong> Makine öğrenimi uygulamalı matematiktir. Lineer cebir size dili verir (vektörler, matrisler, dönüşümler). Kalkülüs size motoru verir (gradyanlar, optimizasyon). Olasılık ve istatistik size çerçeveyi verir (belirsizlik, çıkarım, veriden öğrenme). Sayısal yöntemler her şeyin gerçek donanım üzerinde çalışmasını sağlar.</div>'

+ '<div id="plot-roadmap-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var nodes_x=[0.5,0.15,0.35,0.55,0.75,0.85, 0.1,0.25,0.4,0.55,0.7,0.9, 0.1,0.25,0.4,0.55,0.7,0.9];'
+ 'var nodes_y=[0.95,0.72,0.72,0.72,0.72,0.72, 0.42,0.42,0.42,0.42,0.42,0.42, 0.12,0.12,0.12,0.12,0.12,0.12];'
+ 'var labels=["ML Matematik Temeli","D1: Vektörler","D2: Matrisler","D3: Özdeğer/SVD","D4: Olasılık","D5: İstatistik",'
+ '"D7: Limitler","D8: Türev Kuralları","D9: Kısmi Türev","D10: Zincir Kuralı","D11: İntegral","D12: Optimizasyon",'
+ '"D13: Dağılımlar","D14: Bilgi Teorisi","D15: Tahmin","D16: Düzenleme","D17: Sayısal Yönt.","D18: Yol Haritası"];'
+ 'var colors=["#c8a96e","#e74c3c","#e74c3c","#e74c3c","#e74c3c","#e74c3c","#4ecdc4","#4ecdc4","#4ecdc4","#4ecdc4","#4ecdc4","#4ecdc4","#c8a96e","#c8a96e","#c8a96e","#c8a96e","#c8a96e","#c8a96e"];'
+ 'var sizes=[30,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,22];'
+ 'var edge_x=[];var edge_y=[];'
+ 'var edges=[[0,1],[0,2],[0,3],[0,4],[0,5],[1,6],[2,7],[3,8],[4,9],[5,10],[5,11],[6,12],[7,13],[8,14],[9,15],[10,16],[11,17]];'
+ 'for(var i=0;i<edges.length;i++){var a=edges[i][0],b=edges[i][1];edge_x.push(nodes_x[a],nodes_x[b],null);edge_y.push(nodes_y[a],nodes_y[b],null);}'
+ 'var t1={x:edge_x,y:edge_y,mode:"lines",line:{color:"rgba(200,169,110,0.3)",width:1.5},hoverinfo:"none",showlegend:false};'
+ 'var t2={x:nodes_x,y:nodes_y,mode:"markers+text",marker:{size:sizes,color:colors,line:{color:"rgba(255,255,255,0.3)",width:1}},text:labels,textposition:"bottom center",textfont:{color:"#ebe6dc",size:9},hoverinfo:"text",showlegend:false};'
+ 'var ann1={x:0.5,y:0.75,text:"Lineer Cebir",showarrow:false,font:{color:"#e74c3c",size:13}};'
+ 'var ann2={x:0.5,y:0.45,text:"Kalkülüs",showarrow:false,font:{color:"#4ecdc4",size:13}};'
+ 'var ann3={x:0.5,y:0.15,text:"ML Matematik",showarrow:false,font:{color:"#c8a96e",size:13}};'
+ 'var layout={title:{text:"18 Derslik ML Matematik Yol Haritası",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{showgrid:false,zeroline:false,showticklabels:false,range:[-0.05,1.05]},yaxis:{showgrid:false,zeroline:false,showticklabels:false,range:[-0.02,1.05]},margin:{t:50,r:10,b:10,l:10},showlegend:false,annotations:[ann1,ann2,ann3]};'
+ 'Plotly.newPlot("plot-roadmap-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},400)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Eksiksiz 21 derslik yol haritası:</strong> Lineer cebir (kırmızı) veri yapılarını sağlar. Kalkülüs (turkuaz) optimizasyon mekanizmasını sağlar. ML Matematik (altın) istatistiksel ve pratik araçları sağlar.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Lineer Cebir</div><div class="card-body"><strong>D1:</strong> Vektörler. <strong>D2:</strong> Matris işlemleri. <strong>D3:</strong> Özdeğerler ve SVD. <strong>D4:</strong> Olasılık. <strong>D5:</strong> İstatistik. <strong>D6:</strong> ML Dağılımları.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kalkülüs</div><div class="card-body"><strong>D7:</strong> Limitler ve türevler. <strong>D8:</strong> Türev kuralları. <strong>D9:</strong> Kısmi türevler. <strong>D10:</strong> Zincir kuralı. <strong>D11:</strong> İntegral. <strong>D12:</strong> Optimizasyon.</div></div>'
+ '<div class="calc-card"><div class="card-title">ML Matematik</div><div class="card-body"><strong>D13:</strong> Olasılık dağılımları. <strong>D14:</strong> Bilgi teorisi. <strong>D15:</strong> MLE ve tahmin. <strong>D16:</strong> Düzenleme. <strong>D17:</strong> Sayısal yöntemler. <strong>D18:</strong> Bu yol haritası.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Bir Transformer eğitim adımında her şey nasıl bağlanıyor:</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Veri Yükleme</div><div class="step-detail"><strong>Rastgele örnekleme</strong> (D17) bir mini-batch oluşturur. Tokenize metin <strong>vektörlere</strong> (D1) gömülür. Konumsal kodlamalar <strong>sinüzoidal fonksiyonlar</strong> (D7-D8) kullanır.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İleri Geçiş: Dikkat</div><div class="step-detail"><strong>Matris çarpımı</strong> (D2) Q, K, V hesaplar. Dikkat skorları <strong>iç çarpım</strong> (D1) kullanır. <strong>Softmax</strong> (D17: log-sum-exp) skorları normalize eder. <strong>Karışık hassasiyet</strong> (D17: BF16) bellek ve hız kazandırır.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İleri Geçiş: FFN + Kayıp</div><div class="step-detail">FFN katmanları <strong>doğrusal olmayan aktivasyon</strong> (D7) uygular. Katman normalizasyonu <strong>ortalama ve varyans</strong> (D5) kullanır. Çapraz entropi kaybı <strong>bilgi teorisi</strong> (D14) ile <strong>kararlı log-softmax</strong> (D17) birleştirir.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Geri Geçiş</div><div class="step-detail"><strong>Zincir kuralı</strong> (D10) gradyanları her katmandan yayar. <strong>Kısmi türevler</strong> (D9) parametreye özel gradyanlar hesaplar. <strong>Kayıp ölçekleme</strong> (D17) FP16 gradyan alt taşmasını önler.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Optimizer Adımı</div><div class="step-detail"><strong>Adam optimizer</strong> birinci ve ikinci <strong>moment tahminleri</strong> (D5) kullanır. Ağırlık azalması <strong>L2 düzenleme</strong> (D16) uygular. Ana ağırlıklar <strong>FP32</strong>\'de (D17) güncellenir.</div></div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Lineer Cebir</div><div class="flow-desc">ML\'nin dili</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Kalkülüs</div><div class="flow-desc">Öğrenme motoru</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Olasılık</div><div class="flow-desc">Belirsizlik çerçevesi</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Sayısal Yöntemler</div><div class="flow-desc">Her şeyi çalıştırmak</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">ML Pratiği</div><div class="flow-desc">Gerçek model eğitimi</div></div>'
+ '</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Konveks Optimizasyon</div><div class="card-body">Dualite, KKT koşulları, gradyan iniş yakınsama kanıtı. D12\'yi (optimizasyon) önemli ölçüde derinleştirir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bayesçi ML</div><div class="card-body">Önsel/sonsal çıkarım, Gauss süreleri, varyasyonel yöntemler. D4-D5 (olasılık/istatistik) üzerine kuruludur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Matris Kalkülüsü</div><div class="card-body">Jakobiyenler, Hessianlar, matris türevleri. D9-D10\'u (kısmi türevler, zincir kuralı) tensorler için biçimlendirir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ölçü-Kuramsal Olasılık</div><div class="card-body">Titiz olasılık teorisi, sigma-cebirler, Lebesgue integrali. Teorik ML araştırması için D4\'ü derinleştirir.</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Tebrikler!</strong> Artık modern makine öğrenimini derin bir düzeyde anlamak için eksiksiz matematiksel temele sahipsiniz. Yeni bir teknikle &mdash; LoRA, flash attention veya yeni bir kayıp fonksiyonu &mdash; karşılaştığınızda, makaleyi okumak, matematiği anlamak ve kendiniz uygulamak için araçlara sahipsiniz. Matematik asla değişmez; sadece uygulamalar gelişir. Gidin harika bir şey inşa edin.</div>'

};
