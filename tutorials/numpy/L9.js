window.NUMPY_L9 = {
en: `<p class="l-text"><strong>Floating point is not real numbers.</strong> Every NumPy programmer eventually meets the moment when a perfectly correct algebraic formula returns <code>nan</code>, <code>inf</code>, or — worst — a plausible-looking number that is silently wrong by a factor of a thousand. The fix is almost never "use float64 instead of float32"; the fix is rewriting the formula so that intermediate values stay in a numerically safe range. This is numerical stability.</p>

<p class="l-text">In this lesson we'll meet the canonical traps: subtracting nearly-equal numbers, exponentiating large logits, inverting ill-conditioned matrices, mixing float16 and float32 in deep nets. We'll fix each with a one-line trick: <code>logsumexp</code>, <code>log1p</code>, condition-number checks, <code>np.errstate</code> for selective warnings, and <code>np.isfinite</code> sweeps to localize NaN sources. By the end you will know the half-dozen patterns that cover 95% of stability bugs in production ML code.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The log-sum-exp trick and why softmax needs it</li>
<li><code>log1p</code>, <code>expm1</code>, and the catastrophic-cancellation family</li>
<li>Condition number diagnostics for least-squares and matrix inversion</li>
<li>Mixed precision pitfalls — when float16 silently truncates a gradient</li>
<li>Localizing NaN/Inf with <code>np.isfinite</code>, <code>np.errstate</code>, and <code>seterr</code></li>
<li>Numerical hygiene patterns you can drop into any training loop</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Float Arithmetic Has a Range</h2>
<p class="l-text">A 32-bit float has roughly 7 decimal digits of precision and a maximum value near <code>3.4e38</code>. A 16-bit float (float16) has only 3 digits and a max near <code>65504</code>. Cross those bounds and arithmetic returns <code>inf</code>; subtract two values that agree in 6 digits, and you lose 6 digits of precision in one step.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="fn">print</span>(<span class="str">"float32 max:"</span>, np.<span class="fn">finfo</span>(np.float32).<span class="fn">max</span>)        <span class="cm"># ~3.4e38</span>
<span class="fn">print</span>(<span class="str">"float32 eps:"</span>, np.<span class="fn">finfo</span>(np.float32).eps)        <span class="cm"># ~1.19e-7</span>
<span class="fn">print</span>(<span class="str">"float16 max:"</span>, np.<span class="fn">finfo</span>(np.float16).<span class="fn">max</span>)        <span class="cm"># 65504.0</span>
<span class="fn">print</span>(<span class="str">"float16 eps:"</span>, np.<span class="fn">finfo</span>(np.float16).eps)        <span class="cm"># ~9.77e-4</span>

<span class="cm"># Overflow: exp(100) fits float32 (e^100 ~ 2.7e43? no, ~2.7e43 > 3.4e38 -> inf)</span>
<span class="fn">print</span>(<span class="str">"exp(100) f32:"</span>, np.<span class="fn">exp</span>(np.<span class="fn">float32</span>(<span class="num">100</span>)))         <span class="cm"># inf</span>
<span class="fn">print</span>(<span class="str">"exp(100) f64:"</span>, np.<span class="fn">exp</span>(np.<span class="fn">float64</span>(<span class="num">100</span>)))         <span class="cm"># finite, ~2.7e43</span>

<span class="cm"># Catastrophic cancellation</span>
a = np.<span class="fn">float64</span>(<span class="num">1.0000001</span>)
b = np.<span class="fn">float64</span>(<span class="num">1.0000000</span>)
<span class="fn">print</span>(<span class="str">"a - b:"</span>, a - b, <span class="str">"  (true value: 1e-7, but lost ~6 digits)"</span>)

<span class="cm"># float16 underflow</span>
<span class="fn">print</span>(<span class="str">"1e-5 in f16:"</span>, np.<span class="fn">float16</span>(<span class="num">1e-5</span>))                  <span class="cm"># rounded to 0 or denormal</span>
</code></pre></div>

<div class="calc-highlight">Three numbers worth memorizing: <strong>float32 dies at ~3e38</strong>, <strong>float16 dies at 65504</strong>, <strong>float32 has ~7 digits of precision</strong>. Most stability bugs are some combination of these.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Log-Sum-Exp Trick</h2>
<p class="l-text">Softmax appears in every classifier and every attention head. Naive softmax overflows the moment any logit exceeds ~89 (in float32). The fix is one line: subtract the max before exponentiating. Mathematically it's a no-op; numerically it shifts all logits into a safe range.</p>

<div class="katex-block">$$\\log \\sum_i e^{x_i} = m + \\log \\sum_i e^{x_i - m}, \\quad m = \\max_i x_i$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.special <span class="kw">import</span> logsumexp

<span class="cm"># Simulate a transformer logit vector with one huge value</span>
logits = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">999.0</span>, <span class="num">1002.0</span>])

<span class="cm"># Naive: overflows</span>
naive_softmax = np.<span class="fn">exp</span>(logits) / np.<span class="fn">exp</span>(logits).<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"naive  :"</span>, naive_softmax)        <span class="cm"># nan everywhere</span>

<span class="cm"># Stable: subtract the max first</span>
m = logits.<span class="fn">max</span>()
shifted = logits - m
stable = np.<span class="fn">exp</span>(shifted) / np.<span class="fn">exp</span>(shifted).<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"stable :"</span>, np.<span class="fn">round</span>(stable, <span class="num">4</span>))

<span class="cm"># scipy ships logsumexp -> log of partition function, also stable</span>
lse = <span class="fn">logsumexp</span>(logits)
<span class="fn">print</span>(<span class="str">"logsumexp:"</span>, lse, <span class="str">"  (expected ~1002.44)"</span>)

<span class="cm"># Log-softmax in one stable line</span>
log_softmax = logits - <span class="fn">logsumexp</span>(logits)
<span class="fn">print</span>(<span class="str">"log_softmax:"</span>, np.<span class="fn">round</span>(log_softmax, <span class="num">4</span>))
</code></pre></div>

<p class="l-text">In any cross-entropy loss, work in log-space: compute <code>log_softmax</code>, then <code>loss = -log_softmax[true_class]</code>. This is exactly what <code>torch.nn.functional.cross_entropy</code> does internally — and why you should never write softmax + log separately.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. log1p, expm1, and Their Friends</h2>
<p class="l-text">Computing <code>log(1 + x)</code> for tiny <code>x</code> is a classic cancellation trap: <code>1 + 1e-10</code> rounds to <code>1.0</code> in float32, then <code>log(1.0) = 0</code>, and you've lost the entire signal. <code>log1p(x)</code> computes <code>log(1+x)</code> directly without ever forming <code>1 + x</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

x = <span class="num">1e-10</span>
<span class="fn">print</span>(<span class="str">"naive log(1+x) :"</span>, np.<span class="fn">log</span>(<span class="num">1</span> + x))    <span class="cm"># 0.0  (lost all precision)</span>
<span class="fn">print</span>(<span class="str">"np.log1p(x)    :"</span>, np.<span class="fn">log1p</span>(x))      <span class="cm"># 1e-10 (correct)</span>

<span class="cm"># Symmetric: exp(x) - 1 for tiny x</span>
y = <span class="num">1e-10</span>
<span class="fn">print</span>(<span class="str">"naive exp(y)-1 :"</span>, np.<span class="fn">exp</span>(y) - <span class="num">1</span>)    <span class="cm"># 0.0</span>
<span class="fn">print</span>(<span class="str">"np.expm1(y)    :"</span>, np.<span class="fn">expm1</span>(y))      <span class="cm"># 1e-10</span>

<span class="cm"># Practical example: log of geometric mean of probabilities</span>
<span class="cm"># product of small probs underflows; sum of logs is stable</span>
probs = np.<span class="fn">full</span>(<span class="num">1000</span>, <span class="num">0.01</span>)
log_geo = np.<span class="fn">mean</span>(np.<span class="fn">log</span>(probs))
<span class="fn">print</span>(<span class="str">"log geometric mean:"</span>, <span class="fn">round</span>(log_geo, <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"naive product    :"</span>, np.<span class="fn">prod</span>(probs))   <span class="cm"># 0.0 by underflow</span>

<span class="cm"># Logistic / sigmoid stable form: avoid exp of large positive</span>
<span class="kw">def</span> <span class="fn">stable_sigmoid</span>(x):
    <span class="cm"># branchless stable form</span>
    <span class="kw">return</span> np.<span class="fn">where</span>(x &gt;= <span class="num">0</span>, <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-x)), np.<span class="fn">exp</span>(x) / (<span class="num">1</span> + np.<span class="fn">exp</span>(x)))

<span class="fn">print</span>(<span class="str">"naive sigmoid(-1000):"</span>, <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(<span class="num">1000</span>)))     <span class="cm"># nan or 0</span>
<span class="fn">print</span>(<span class="str">"stable           :"</span>, <span class="fn">stable_sigmoid</span>(np.<span class="fn">array</span>([-<span class="num">1000.0</span>, <span class="num">0.0</span>, <span class="num">1000.0</span>])))
</code></pre></div>

<div class="calc-highlight">Anywhere you write <code>log(1 + ...)</code>, <code>exp(...) - 1</code>, or <code>1 / (1 + exp(-x))</code> — pause and reach for <code>log1p</code>, <code>expm1</code>, or a branchless sigmoid.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Condition Number &amp; Matrix Inversion</h2>
<p class="l-text">When you solve <code>Ax = b</code>, the error in <code>x</code> is bounded by the <strong>condition number</strong> <code>k(A)</code> times the error in <code>b</code>. If <code>k(A)</code> is <code>1e8</code> and you're in float32 (7 digits), the answer has zero correct digits. <code>np.linalg.cond</code> tells you before you waste an hour debugging.</p>

<div class="katex-block">$$\\kappa(A) = \\sigma_{\\max}(A) / \\sigma_{\\min}(A)$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># A well-conditioned matrix</span>
A_good = rng.<span class="fn">standard_normal</span>((<span class="num">50</span>, <span class="num">50</span>))
<span class="fn">print</span>(<span class="str">"good cond:"</span>, <span class="fn">round</span>(np.linalg.<span class="fn">cond</span>(A_good), <span class="num">2</span>))

<span class="cm"># A nearly-singular matrix: two almost-identical columns</span>
A_bad = rng.<span class="fn">standard_normal</span>((<span class="num">50</span>, <span class="num">50</span>))
A_bad[:, <span class="num">1</span>] = A_bad[:, <span class="num">0</span>] + <span class="num">1e-10</span> * rng.<span class="fn">standard_normal</span>(<span class="num">50</span>)
<span class="fn">print</span>(<span class="str">"bad cond :"</span>, f<span class="str">"{np.linalg.cond(A_bad):.2e}"</span>)

<span class="cm"># Solve and measure error</span>
b = rng.<span class="fn">standard_normal</span>(<span class="num">50</span>)
x_good = np.linalg.<span class="fn">solve</span>(A_good, b)
x_bad  = np.linalg.<span class="fn">solve</span>(A_bad,  b)

<span class="cm"># Reconstruction error</span>
<span class="fn">print</span>(<span class="str">"good resid:"</span>, f<span class="str">"{np.linalg.norm(A_good @ x_good - b):.2e}"</span>)
<span class="fn">print</span>(<span class="str">"bad  resid:"</span>, f<span class="str">"{np.linalg.norm(A_bad  @ x_bad  - b):.2e}"</span>)

<span class="cm"># In production, ALWAYS check cond before trusting an inverse</span>
<span class="kw">def</span> <span class="fn">safe_solve</span>(A, b, max_cond=<span class="num">1e10</span>):
    k = np.linalg.<span class="fn">cond</span>(A)
    <span class="kw">if</span> k &gt; max_cond:
        <span class="cm"># fall back to least-squares with regularization</span>
        <span class="kw">return</span> np.linalg.<span class="fn">lstsq</span>(A, b, rcond=<span class="kw">None</span>)[<span class="num">0</span>], k, <span class="str">"lstsq"</span>
    <span class="kw">return</span> np.linalg.<span class="fn">solve</span>(A, b), k, <span class="str">"direct"</span>

x, k, method = <span class="fn">safe_solve</span>(A_bad, b)
<span class="fn">print</span>(f<span class="str">"used: {method} (k={k:.1e})"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Mixed Precision Pitfalls</h2>
<p class="l-text">Mixed-precision training (float16 forward + float32 master weights) is the standard for modern deep learning. The win is real (2-4x throughput), but it introduces three new ways for things to silently break.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Underflow</div><div class="card-body">Gradients with magnitude &lt; ~6e-5 round to zero in float16. The famous "loss scaling" trick multiplies the loss by 2^N before backward to push gradients into the float16 sweet spot, then divides them out before the optimizer step.</div></div>
<div class="calc-card"><div class="card-title">Overflow</div><div class="card-body">Activations &gt; 65504 become Inf, propagate to NaN in the next op. Common after a bad weight init or an exploding ReLU.</div></div>
<div class="calc-card"><div class="card-title">Reduction precision</div><div class="card-body">Summing 10000 numbers in float16 loses ~3 digits to roundoff. Always reduce in float32 then cast back. Frameworks do this automatically; bespoke kernels do not.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># (1) Underflow: a tiny gradient disappears in float16</span>
g_f32 = np.<span class="fn">float32</span>(<span class="num">1e-6</span>)
g_f16 = np.<span class="fn">float16</span>(g_f32)
<span class="fn">print</span>(<span class="str">"grad in f16:"</span>, g_f16)              <span class="cm"># 1e-06 -> 9.54e-07 (denormal) or 0</span>

<span class="cm"># Loss scaling fix: scale up before downcast, scale down after</span>
scale = <span class="num">2.0</span>**<span class="num">16</span>
g_scaled = np.<span class="fn">float16</span>(g_f32 * scale)
g_back = np.<span class="fn">float32</span>(g_scaled) / scale
<span class="fn">print</span>(<span class="str">"scaled round-trip:"</span>, g_back, <span class="str">"vs original"</span>, g_f32)

<span class="cm"># (2) Overflow on a sum of large values</span>
big = np.<span class="fn">full</span>(<span class="num">1000</span>, <span class="num">100.0</span>, dtype=np.float16)
<span class="fn">print</span>(<span class="str">"f16 sum:"</span>, big.<span class="fn">sum</span>())              <span class="cm"># OVERFLOW -> inf</span>
<span class="fn">print</span>(<span class="str">"f32 sum:"</span>, big.<span class="fn">astype</span>(np.float32).<span class="fn">sum</span>())   <span class="cm"># 100000.0 (correct)</span>

<span class="cm"># (3) Reduction precision loss</span>
n = 10_000
small = np.<span class="fn">full</span>(n, <span class="num">1e-3</span>, dtype=np.float16)
true_total = n * <span class="num">1e-3</span>
<span class="fn">print</span>(<span class="str">"f16 reduce:"</span>, small.<span class="fn">sum</span>(), <span class="str">"vs true"</span>, true_total)
<span class="fn">print</span>(<span class="str">"f32 reduce:"</span>, small.<span class="fn">astype</span>(np.float32).<span class="fn">sum</span>())   <span class="cm"># accurate</span>

<span class="cm"># Production pattern: cast up, reduce, cast down</span>
<span class="kw">def</span> <span class="fn">safe_mean</span>(x):
    <span class="kw">return</span> x.<span class="fn">astype</span>(np.float32).<span class="fn">mean</span>().<span class="fn">astype</span>(x.dtype)

<span class="fn">print</span>(<span class="str">"safe mean:"</span>, <span class="fn">safe_mean</span>(small))
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hunting NaN &amp; Inf</h2>
<p class="l-text">Once a NaN appears, every downstream operation produces NaN. The hard part is finding <em>where</em> it first appeared. Here are the four tools you need.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Build a tensor with planted issues</span>
x = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, np.nan, <span class="num">4.0</span>, np.inf, -np.inf, <span class="num">7.0</span>])

<span class="cm"># (1) Detect existence</span>
<span class="fn">print</span>(<span class="str">"any nan :"</span>, np.<span class="fn">isnan</span>(x).<span class="fn">any</span>())
<span class="fn">print</span>(<span class="str">"any inf :"</span>, np.<span class="fn">isinf</span>(x).<span class="fn">any</span>())
<span class="fn">print</span>(<span class="str">"any non-finite:"</span>, (~np.<span class="fn">isfinite</span>(x)).<span class="fn">any</span>())

<span class="cm"># (2) Locate them</span>
<span class="fn">print</span>(<span class="str">"nan idx :"</span>, np.<span class="fn">where</span>(np.<span class="fn">isnan</span>(x))[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"inf idx :"</span>, np.<span class="fn">where</span>(np.<span class="fn">isinf</span>(x))[<span class="num">0</span>])

<span class="cm"># (3) Sanitize on the fly</span>
clean = np.<span class="fn">nan_to_num</span>(x, nan=<span class="num">0.0</span>, posinf=<span class="num">1e6</span>, neginf=-<span class="num">1e6</span>)
<span class="fn">print</span>(<span class="str">"cleaned :"</span>, clean)

<span class="cm"># (4) Use np.errstate to convert silent NaN-producing ops into exceptions</span>
<span class="kw">def</span> <span class="fn">safe_log</span>(arr):
    <span class="kw">with</span> np.<span class="fn">errstate</span>(invalid=<span class="str">"raise"</span>, divide=<span class="str">"raise"</span>):
        <span class="kw">try</span>:
            <span class="kw">return</span> np.<span class="fn">log</span>(arr)
        <span class="kw">except</span> FloatingPointError <span class="kw">as</span> e:
            <span class="fn">print</span>(<span class="str">"caught:"</span>, e)
            <span class="kw">return</span> np.<span class="fn">log</span>(np.<span class="fn">maximum</span>(arr, <span class="num">1e-30</span>))

bad = np.<span class="fn">array</span>([<span class="num">1.0</span>, -<span class="num">1.0</span>, <span class="num">0.0</span>])
<span class="fn">print</span>(<span class="str">"safe_log:"</span>, <span class="fn">safe_log</span>(bad))

<span class="cm"># Global control: turn all FP warnings into errors during a debug run</span>
old = np.<span class="fn">seterr</span>(<span class="fn">all</span>=<span class="str">"warn"</span>)     <span class="cm"># default: silent</span>
<span class="cm"># np.seterr(all="raise")        # uncomment to make every overflow throw</span>
<span class="fn">print</span>(<span class="str">"current err state:"</span>, np.<span class="fn">geterr</span>())
np.<span class="fn">seterr</span>(**old)                <span class="cm"># restore</span>
</code></pre></div>

<div class="calc-highlight">When a training loop starts emitting NaN, wrap the suspect block in <code>with np.errstate(invalid='raise', divide='raise', over='raise'):</code> and re-run. The traceback will point to the exact op — usually a <code>log(0)</code> or <code>0/0</code>.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sanity-Check Patterns for Training Loops</h2>
<p class="l-text">Three drop-in checks that pay for themselves the first time they fire. Add them to every training script.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">assert_finite</span>(name, arr):
    <span class="str">"""Raise loudly if any non-finite value sneaks in."""</span>
    <span class="kw">if</span> <span class="kw">not</span> np.<span class="fn">all</span>(np.<span class="fn">isfinite</span>(arr)):
        n_nan = <span class="fn">int</span>(np.<span class="fn">isnan</span>(arr).<span class="fn">sum</span>())
        n_inf = <span class="fn">int</span>(np.<span class="fn">isinf</span>(arr).<span class="fn">sum</span>())
        <span class="kw">raise</span> <span class="fn">FloatingPointError</span>(
            f<span class="str">"{name}: {n_nan} NaN, {n_inf} Inf in shape {arr.shape}"</span>
        )

<span class="kw">def</span> <span class="fn">grad_health</span>(name, grad):
    <span class="str">"""One-line norm + min/max for a gradient tensor."""</span>
    g = grad.<span class="fn">ravel</span>()
    <span class="fn">print</span>(f<span class="str">"{name:12s}  norm={np.linalg.norm(g):.3e}  "</span>
          f<span class="str">"min={g.min():+.2e}  max={g.max():+.2e}  "</span>
          f<span class="str">"abs-mean={np.abs(g).mean():.2e}"</span>)

<span class="kw">def</span> <span class="fn">cosine_drift</span>(prev, curr):
    <span class="str">"""Cosine sim between successive parameter updates -- detects oscillation."""</span>
    a, b = prev.<span class="fn">ravel</span>(), curr.<span class="fn">ravel</span>()
    <span class="kw">return</span> <span class="fn">float</span>(a @ b / (np.linalg.<span class="fn">norm</span>(a) * np.linalg.<span class="fn">norm</span>(b) + <span class="num">1e-12</span>))

<span class="cm"># Demo</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
weights = rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>)
grad    = rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>) * <span class="num">0.01</span>

<span class="fn">assert_finite</span>(<span class="str">"weights"</span>, weights)
<span class="fn">assert_finite</span>(<span class="str">"grad"</span>,    grad)
<span class="fn">grad_health</span>(<span class="str">"layer.weight"</span>, grad)

prev_g = rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>)
curr_g = prev_g + <span class="num">0.05</span> * rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>)
<span class="fn">print</span>(<span class="str">"update cosine:"</span>, <span class="fn">round</span>(<span class="fn">cosine_drift</span>(prev_g, curr_g), <span class="num">3</span>),
      <span class="str">"  (~1.0 = stable, ~0 = chaos, &lt;0 = oscillation)"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Cheat Sheet</h2>
<p class="l-text">Stick this on the wall next to your monitor. It is roughly 80% of all numerical-stability fixes you will ever need.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Softmax / cross-entropy</div><div class="card-body">Subtract the max before <code>exp</code>. Use <code>scipy.special.logsumexp</code> for the log partition.</div></div>
<div class="calc-card"><div class="card-title"><code>log(1+x)</code> for tiny x</div><div class="card-body">Use <code>np.log1p(x)</code>. Symmetrically, <code>np.expm1(x)</code> for <code>exp(x)-1</code>.</div></div>
<div class="calc-card"><div class="card-title">Sigmoid for large |x|</div><div class="card-body">Branchless form with <code>np.where(x &gt;= 0, ...)</code> avoids overflow on either side.</div></div>
<div class="calc-card"><div class="card-title">Solving Ax=b</div><div class="card-body">Check <code>np.linalg.cond(A)</code>. If &gt; 1e10, use <code>lstsq</code> with regularization, not <code>solve</code>.</div></div>
<div class="calc-card"><div class="card-title">Mixed precision</div><div class="card-body">Cast up to float32 for any reduction (sum, mean, norm). Use loss scaling for gradients.</div></div>
<div class="calc-card"><div class="card-title">Hunting NaN</div><div class="card-body">Wrap suspect block in <code>np.errstate(invalid='raise')</code> for a traceback at the source.</div></div>
<div class="calc-card"><div class="card-title">Variance for streaming</div><div class="card-body">Use Welford's algorithm, not <code>E[X^2] - E[X]^2</code> (which catastrophically cancels).</div></div>
<div class="calc-card"><div class="card-title">Always sanitize inputs</div><div class="card-body"><code>np.nan_to_num(x)</code> at the top of every numerical kernel. Cheap insurance.</div></div>
</div>

<p class="l-text">Numerical stability is unfashionable, low-status, and the difference between a model that ships and a model that mysteriously NaNs in epoch 4. Spend an afternoon installing these patterns into muscle memory and you will spend zero afternoons later debugging them.</p>
</div>
`,
tr: `<p class="l-text"><strong>Kayan nokta gerçek sayılar değildir.</strong> Her NumPy programcısı eninde sonunda mükemmel doğru bir cebirsel formülün <code>nan</code>, <code>inf</code> ya da — en kötüsü — bin kat ile sessizce yanlış makul görünen bir sayı döndürdüğü ana gelir. Çözüm neredeyse hiç "float32 yerine float64 kullan" değildir; çözüm formülü ara değerlerin sayısal olarak güvenli aralıkta kalmasını sağlayacak şekilde yeniden yazmaktır. Bu sayısal kararlılıktır.</p>

<p class="l-text">Bu derste kanonik tuzaklarla tanışacağız: neredeyse eşit sayıları çıkarma, büyük logit'leri exp etme, kötü-koşullu matrisleri tersleme, derin ağlarda float16 ve float32 karıştırma. Her birini tek satırlık bir hileyle düzelteceğiz: <code>logsumexp</code>, <code>log1p</code>, koşul-sayısı kontrolleri, seçici uyarılar için <code>np.errstate</code> ve NaN kaynaklarını yerelleştirmek için <code>np.isfinite</code> taramaları. Sonunda üretim ML kodundaki kararlılık bug'larının %95'ini kapsayan yarım düzine deseni bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>log-sum-exp hilesi ve softmax'ın neden ona ihtiyaç duyduğu</li>
<li><code>log1p</code>, <code>expm1</code> ve felaketsel iptal ailesi</li>
<li>En küçük kareler ve matris terslemesi için koşul sayısı tanılaması</li>
<li>Karma hassasiyet tuzakları — float16 bir gradyanı sessizce ne zaman kırpar</li>
<li><code>np.isfinite</code>, <code>np.errstate</code> ve <code>seterr</code> ile NaN/Inf'i yerelleştirme</li>
<li>Herhangi bir eğitim döngüsüne bırakabileceğin sayısal hijyen desenleri</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Float Aritmetiğinin Bir Aralığı Vardır</h2>
<p class="l-text">32-bit float kabaca 7 ondalık basamak hassasiyetine ve <code>3.4e38</code>'e yakın maksimum değere sahiptir. 16-bit float (float16) yalnızca 3 basamağa ve <code>65504</code>'e yakın maksimuma sahiptir. Bu sınırları aş ve aritmetik <code>inf</code> döner; 6 basamakta uyuşan iki değeri çıkar ve tek adımda 6 basamak hassasiyet kaybedersin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="fn">print</span>(<span class="str">"float32 max:"</span>, np.<span class="fn">finfo</span>(np.float32).<span class="fn">max</span>)        <span class="cm"># ~3.4e38</span>
<span class="fn">print</span>(<span class="str">"float32 eps:"</span>, np.<span class="fn">finfo</span>(np.float32).eps)        <span class="cm"># ~1.19e-7</span>
<span class="fn">print</span>(<span class="str">"float16 max:"</span>, np.<span class="fn">finfo</span>(np.float16).<span class="fn">max</span>)        <span class="cm"># 65504.0</span>
<span class="fn">print</span>(<span class="str">"float16 eps:"</span>, np.<span class="fn">finfo</span>(np.float16).eps)        <span class="cm"># ~9.77e-4</span>

<span class="cm"># Taşma: exp(100) float32'ye sığar mı (e^100 ~ 2.7e43? hayır, ~2.7e43 > 3.4e38 -> inf)</span>
<span class="fn">print</span>(<span class="str">"exp(100) f32:"</span>, np.<span class="fn">exp</span>(np.<span class="fn">float32</span>(<span class="num">100</span>)))         <span class="cm"># inf</span>
<span class="fn">print</span>(<span class="str">"exp(100) f64:"</span>, np.<span class="fn">exp</span>(np.<span class="fn">float64</span>(<span class="num">100</span>)))         <span class="cm"># sonlu, ~2.7e43</span>

<span class="cm"># Felaketsel iptal</span>
a = np.<span class="fn">float64</span>(<span class="num">1.0000001</span>)
b = np.<span class="fn">float64</span>(<span class="num">1.0000000</span>)
<span class="fn">print</span>(<span class="str">"a - b:"</span>, a - b, <span class="str">"  (gerçek değer: 1e-7, ama ~6 basamak kaybedildi)"</span>)

<span class="cm"># float16 alttan taşma</span>
<span class="fn">print</span>(<span class="str">"1e-5 f16'da:"</span>, np.<span class="fn">float16</span>(<span class="num">1e-5</span>))                  <span class="cm"># 0'a yuvarlanır veya denormal</span>
</code></pre></div>

<div class="calc-highlight">Ezberlenmeye değer üç sayı: <strong>float32 ~3e38'de ölür</strong>, <strong>float16 65504'te ölür</strong>, <strong>float32'nin ~7 basamak hassasiyeti vardır</strong>. Çoğu kararlılık bug'ı bunların bir kombinasyonudur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Log-Sum-Exp Hilesi</h2>
<p class="l-text">Softmax her sınıflandırıcıda ve her attention head'inde görünür. Naif softmax, herhangi bir logit ~89'u (float32'de) aştığı anda taşar. Çözüm tek satırdır: exp etmeden önce maksimumu çıkar. Matematiksel olarak no-op'tür; sayısal olarak tüm logit'leri güvenli aralığa kaydırır.</p>

<div class="katex-block">$$\\log \\sum_i e^{x_i} = m + \\log \\sum_i e^{x_i - m}, \\quad m = \\max_i x_i$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.special <span class="kw">import</span> logsumexp

<span class="cm"># Tek bir devasa değerle bir transformer logit vektörü simüle et</span>
logits = np.<span class="fn">array</span>([<span class="num">1000.0</span>, <span class="num">1001.0</span>, <span class="num">999.0</span>, <span class="num">1002.0</span>])

<span class="cm"># Naif: taşar</span>
naive_softmax = np.<span class="fn">exp</span>(logits) / np.<span class="fn">exp</span>(logits).<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"naif   :"</span>, naive_softmax)        <span class="cm"># her yerde nan</span>

<span class="cm"># Kararlı: önce max'ı çıkar</span>
m = logits.<span class="fn">max</span>()
shifted = logits - m
stable = np.<span class="fn">exp</span>(shifted) / np.<span class="fn">exp</span>(shifted).<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"kararlı:"</span>, np.<span class="fn">round</span>(stable, <span class="num">4</span>))

<span class="cm"># scipy logsumexp sunar -> partition fonksiyonunun log'u, ayrıca kararlı</span>
lse = <span class="fn">logsumexp</span>(logits)
<span class="fn">print</span>(<span class="str">"logsumexp:"</span>, lse, <span class="str">"  (beklenen ~1002.44)"</span>)

<span class="cm"># Tek kararlı satırda log-softmax</span>
log_softmax = logits - <span class="fn">logsumexp</span>(logits)
<span class="fn">print</span>(<span class="str">"log_softmax:"</span>, np.<span class="fn">round</span>(log_softmax, <span class="num">4</span>))
</code></pre></div>

<p class="l-text">Herhangi bir cross-entropy loss'unda log-uzayında çalış: <code>log_softmax</code> hesapla, sonra <code>loss = -log_softmax[true_class]</code>. Bu <code>torch.nn.functional.cross_entropy</code>'nin içeride yaptığı şeydir — ve neden softmax + log'u ayrı ayrı hiç yazmaman gerektiğinin nedenidir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. log1p, expm1 ve Dostları</h2>
<p class="l-text">Küçük <code>x</code> için <code>log(1 + x)</code> hesaplamak klasik bir iptal tuzağıdır: float32'de <code>1 + 1e-10</code>, <code>1.0</code>'a yuvarlanır, sonra <code>log(1.0) = 0</code> olur ve tüm sinyali kaybedersin. <code>log1p(x)</code>, <code>1 + x</code>'i hiç oluşturmadan doğrudan <code>log(1+x)</code>'i hesaplar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

x = <span class="num">1e-10</span>
<span class="fn">print</span>(<span class="str">"naif log(1+x) :"</span>, np.<span class="fn">log</span>(<span class="num">1</span> + x))    <span class="cm"># 0.0  (tüm hassasiyeti kaybetti)</span>
<span class="fn">print</span>(<span class="str">"np.log1p(x)   :"</span>, np.<span class="fn">log1p</span>(x))      <span class="cm"># 1e-10 (doğru)</span>

<span class="cm"># Simetrik: küçük x için exp(x) - 1</span>
y = <span class="num">1e-10</span>
<span class="fn">print</span>(<span class="str">"naif exp(y)-1 :"</span>, np.<span class="fn">exp</span>(y) - <span class="num">1</span>)    <span class="cm"># 0.0</span>
<span class="fn">print</span>(<span class="str">"np.expm1(y)   :"</span>, np.<span class="fn">expm1</span>(y))      <span class="cm"># 1e-10</span>

<span class="cm"># Pratik örnek: olasılıkların geometrik ortalamasının log'u</span>
<span class="cm"># küçük olasılıkların çarpımı alttan taşar; log toplamı kararlıdır</span>
probs = np.<span class="fn">full</span>(<span class="num">1000</span>, <span class="num">0.01</span>)
log_geo = np.<span class="fn">mean</span>(np.<span class="fn">log</span>(probs))
<span class="fn">print</span>(<span class="str">"log geometrik ortalama:"</span>, <span class="fn">round</span>(log_geo, <span class="num">4</span>))
<span class="fn">print</span>(<span class="str">"naif çarpım           :"</span>, np.<span class="fn">prod</span>(probs))   <span class="cm"># alttan taşma ile 0.0</span>

<span class="cm"># Lojistik / sigmoid kararlı form: büyük pozitifin exp'inden kaçın</span>
<span class="kw">def</span> <span class="fn">stable_sigmoid</span>(x):
    <span class="cm"># dalsız kararlı form</span>
    <span class="kw">return</span> np.<span class="fn">where</span>(x &gt;= <span class="num">0</span>, <span class="num">1</span> / (<span class="num">1</span> + np.<span class="fn">exp</span>(-x)), np.<span class="fn">exp</span>(x) / (<span class="num">1</span> + np.<span class="fn">exp</span>(x)))

<span class="fn">print</span>(<span class="str">"naif sigmoid(-1000):"</span>, <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(<span class="num">1000</span>)))     <span class="cm"># nan veya 0</span>
<span class="fn">print</span>(<span class="str">"kararlı            :"</span>, <span class="fn">stable_sigmoid</span>(np.<span class="fn">array</span>([-<span class="num">1000.0</span>, <span class="num">0.0</span>, <span class="num">1000.0</span>])))
</code></pre></div>

<div class="calc-highlight">Nerede <code>log(1 + ...)</code>, <code>exp(...) - 1</code> veya <code>1 / (1 + exp(-x))</code> yazıyorsan — dur ve <code>log1p</code>, <code>expm1</code> veya dalsız sigmoid'e başvur.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Koşul Sayısı &amp; Matris Terslemesi</h2>
<p class="l-text"><code>Ax = b</code>'yi çözdüğünde, <code>x</code>'teki hata <strong>koşul sayısı</strong> <code>k(A)</code> çarpı <code>b</code>'deki hata ile sınırlıdır. <code>k(A)</code> <code>1e8</code> ise ve float32'desin (7 basamak), cevabın sıfır doğru basamağa sahiptir. <code>np.linalg.cond</code> bir saat ayıklamadan önce sana söyler.</p>

<div class="katex-block">$$\\kappa(A) = \\sigma_{\\max}(A) / \\sigma_{\\min}(A)$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># İyi koşullu matris</span>
A_good = rng.<span class="fn">standard_normal</span>((<span class="num">50</span>, <span class="num">50</span>))
<span class="fn">print</span>(<span class="str">"iyi koşul:"</span>, <span class="fn">round</span>(np.linalg.<span class="fn">cond</span>(A_good), <span class="num">2</span>))

<span class="cm"># Neredeyse tekil matris: iki neredeyse aynı sütun</span>
A_bad = rng.<span class="fn">standard_normal</span>((<span class="num">50</span>, <span class="num">50</span>))
A_bad[:, <span class="num">1</span>] = A_bad[:, <span class="num">0</span>] + <span class="num">1e-10</span> * rng.<span class="fn">standard_normal</span>(<span class="num">50</span>)
<span class="fn">print</span>(<span class="str">"kötü koşul :"</span>, f<span class="str">"{np.linalg.cond(A_bad):.2e}"</span>)

<span class="cm"># Çöz ve hatayı ölç</span>
b = rng.<span class="fn">standard_normal</span>(<span class="num">50</span>)
x_good = np.linalg.<span class="fn">solve</span>(A_good, b)
x_bad  = np.linalg.<span class="fn">solve</span>(A_bad,  b)

<span class="cm"># Yeniden inşa hatası</span>
<span class="fn">print</span>(<span class="str">"iyi resid:"</span>, f<span class="str">"{np.linalg.norm(A_good @ x_good - b):.2e}"</span>)
<span class="fn">print</span>(<span class="str">"kötü resid:"</span>, f<span class="str">"{np.linalg.norm(A_bad  @ x_bad  - b):.2e}"</span>)

<span class="cm"># Üretimde tersine GÜVENMEDEN ÖNCE her zaman cond'u kontrol et</span>
<span class="kw">def</span> <span class="fn">safe_solve</span>(A, b, max_cond=<span class="num">1e10</span>):
    k = np.linalg.<span class="fn">cond</span>(A)
    <span class="kw">if</span> k &gt; max_cond:
        <span class="cm"># regülarizasyonlu en küçük karelere düş</span>
        <span class="kw">return</span> np.linalg.<span class="fn">lstsq</span>(A, b, rcond=<span class="kw">None</span>)[<span class="num">0</span>], k, <span class="str">"lstsq"</span>
    <span class="kw">return</span> np.linalg.<span class="fn">solve</span>(A, b), k, <span class="str">"direct"</span>

x, k, method = <span class="fn">safe_solve</span>(A_bad, b)
<span class="fn">print</span>(f<span class="str">"kullanıldı: {method} (k={k:.1e})"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Karma Hassasiyet Tuzakları</h2>
<p class="l-text">Karma hassasiyetli eğitim (float16 ileri + float32 master ağırlık) modern derin öğrenme için standarttır. Kazanç gerçektir (2-4x throughput), ama sessizce bozulmanın üç yeni yolunu getirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Alttan taşma</div><div class="card-body">Büyüklüğü &lt; ~6e-5 olan gradyanlar float16'da sıfıra yuvarlanır. Ünlü "loss scaling" hilesi gradyanları float16 tatlı noktasına itmek için backward'dan önce loss'u 2^N ile çarpar, optimizer adımından önce onları geri böler.</div></div>
<div class="calc-card"><div class="card-title">Üstten taşma</div><div class="card-body">&gt; 65504 aktivasyonlar Inf olur, sonraki op'ta NaN'a yayılır. Kötü ağırlık başlatma veya patlayan ReLU sonrası yaygındır.</div></div>
<div class="calc-card"><div class="card-title">İndirgeme hassasiyeti</div><div class="card-body">10000 sayıyı float16'da toplamak yuvarlama hatasıyla ~3 basamak kaybeder. Her zaman float32'de indirgeyip sonra geri cast et. Framework'ler bunu otomatik yapar; özel çekirdekler yapmaz.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># (1) Alttan taşma: minik gradyan float16'da kaybolur</span>
g_f32 = np.<span class="fn">float32</span>(<span class="num">1e-6</span>)
g_f16 = np.<span class="fn">float16</span>(g_f32)
<span class="fn">print</span>(<span class="str">"f16'da grad:"</span>, g_f16)              <span class="cm"># 1e-06 -> 9.54e-07 (denormal) veya 0</span>

<span class="cm"># Loss scaling düzeltmesi: aşağı cast'ten önce ölçekle, sonra geri ölçekle</span>
scale = <span class="num">2.0</span>**<span class="num">16</span>
g_scaled = np.<span class="fn">float16</span>(g_f32 * scale)
g_back = np.<span class="fn">float32</span>(g_scaled) / scale
<span class="fn">print</span>(<span class="str">"ölçekli tur-dönüş:"</span>, g_back, <span class="str">"vs orijinal"</span>, g_f32)

<span class="cm"># (2) Büyük değerlerin toplamında üstten taşma</span>
big = np.<span class="fn">full</span>(<span class="num">1000</span>, <span class="num">100.0</span>, dtype=np.float16)
<span class="fn">print</span>(<span class="str">"f16 toplam:"</span>, big.<span class="fn">sum</span>())              <span class="cm"># ÜSTTEN TAŞMA -> inf</span>
<span class="fn">print</span>(<span class="str">"f32 toplam:"</span>, big.<span class="fn">astype</span>(np.float32).<span class="fn">sum</span>())   <span class="cm"># 100000.0 (doğru)</span>

<span class="cm"># (3) İndirgeme hassasiyet kaybı</span>
n = 10_000
small = np.<span class="fn">full</span>(n, <span class="num">1e-3</span>, dtype=np.float16)
true_total = n * <span class="num">1e-3</span>
<span class="fn">print</span>(<span class="str">"f16 indirge:"</span>, small.<span class="fn">sum</span>(), <span class="str">"vs gerçek"</span>, true_total)
<span class="fn">print</span>(<span class="str">"f32 indirge:"</span>, small.<span class="fn">astype</span>(np.float32).<span class="fn">sum</span>())   <span class="cm"># doğru</span>

<span class="cm"># Üretim deseni: yukarı cast et, indirge, aşağı cast et</span>
<span class="kw">def</span> <span class="fn">safe_mean</span>(x):
    <span class="kw">return</span> x.<span class="fn">astype</span>(np.float32).<span class="fn">mean</span>().<span class="fn">astype</span>(x.dtype)

<span class="fn">print</span>(<span class="str">"güvenli ortalama:"</span>, <span class="fn">safe_mean</span>(small))
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. NaN &amp; Inf Avı</h2>
<p class="l-text">Bir NaN ortaya çıktığında, her aşağı-akım işlemi NaN üretir. Zor kısım <em>nerede</em> ilk göründüğünü bulmaktır. İhtiyacın olan dört araç.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Yerleştirilmiş sorunlarla bir tensör oluştur</span>
x = np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">2.0</span>, np.nan, <span class="num">4.0</span>, np.inf, -np.inf, <span class="num">7.0</span>])

<span class="cm"># (1) Varlık tespiti</span>
<span class="fn">print</span>(<span class="str">"herhangi nan :"</span>, np.<span class="fn">isnan</span>(x).<span class="fn">any</span>())
<span class="fn">print</span>(<span class="str">"herhangi inf :"</span>, np.<span class="fn">isinf</span>(x).<span class="fn">any</span>())
<span class="fn">print</span>(<span class="str">"herhangi sonlu-değil:"</span>, (~np.<span class="fn">isfinite</span>(x)).<span class="fn">any</span>())

<span class="cm"># (2) Konumlarını bul</span>
<span class="fn">print</span>(<span class="str">"nan idx :"</span>, np.<span class="fn">where</span>(np.<span class="fn">isnan</span>(x))[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"inf idx :"</span>, np.<span class="fn">where</span>(np.<span class="fn">isinf</span>(x))[<span class="num">0</span>])

<span class="cm"># (3) Anında temizle</span>
clean = np.<span class="fn">nan_to_num</span>(x, nan=<span class="num">0.0</span>, posinf=<span class="num">1e6</span>, neginf=-<span class="num">1e6</span>)
<span class="fn">print</span>(<span class="str">"temizlendi:"</span>, clean)

<span class="cm"># (4) Sessiz NaN üreten op'ları istisnaya çevirmek için np.errstate kullan</span>
<span class="kw">def</span> <span class="fn">safe_log</span>(arr):
    <span class="kw">with</span> np.<span class="fn">errstate</span>(invalid=<span class="str">"raise"</span>, divide=<span class="str">"raise"</span>):
        <span class="kw">try</span>:
            <span class="kw">return</span> np.<span class="fn">log</span>(arr)
        <span class="kw">except</span> FloatingPointError <span class="kw">as</span> e:
            <span class="fn">print</span>(<span class="str">"yakalandı:"</span>, e)
            <span class="kw">return</span> np.<span class="fn">log</span>(np.<span class="fn">maximum</span>(arr, <span class="num">1e-30</span>))

bad = np.<span class="fn">array</span>([<span class="num">1.0</span>, -<span class="num">1.0</span>, <span class="num">0.0</span>])
<span class="fn">print</span>(<span class="str">"safe_log:"</span>, <span class="fn">safe_log</span>(bad))

<span class="cm"># Global kontrol: ayıklama çalıştırması sırasında tüm FP uyarılarını hataya çevir</span>
old = np.<span class="fn">seterr</span>(<span class="fn">all</span>=<span class="str">"warn"</span>)     <span class="cm"># varsayılan: sessiz</span>
<span class="cm"># np.seterr(all="raise")        # her taşmayı throw etmek için aç</span>
<span class="fn">print</span>(<span class="str">"güncel hata durumu:"</span>, np.<span class="fn">geterr</span>())
np.<span class="fn">seterr</span>(**old)                <span class="cm"># geri yükle</span>
</code></pre></div>

<div class="calc-highlight">Bir eğitim döngüsü NaN üretmeye başladığında, şüpheli bloğu <code>with np.errstate(invalid='raise', divide='raise', over='raise'):</code> ile sar ve yeniden çalıştır. Traceback tam op'a işaret eder — genellikle <code>log(0)</code> veya <code>0/0</code>.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Eğitim Döngüleri için Akıl-Sağlığı Desenleri</h2>
<p class="l-text">İlk tetiklendiğinde kendi maliyetini ödeyen üç bırak-çalışsın kontrol. Her eğitim scriptine ekle.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">assert_finite</span>(name, arr):
    <span class="str">"""Sonlu olmayan değer sızarsa yüksek sesle hata ver."""</span>
    <span class="kw">if</span> <span class="kw">not</span> np.<span class="fn">all</span>(np.<span class="fn">isfinite</span>(arr)):
        n_nan = <span class="fn">int</span>(np.<span class="fn">isnan</span>(arr).<span class="fn">sum</span>())
        n_inf = <span class="fn">int</span>(np.<span class="fn">isinf</span>(arr).<span class="fn">sum</span>())
        <span class="kw">raise</span> <span class="fn">FloatingPointError</span>(
            f<span class="str">"{name}: şekil {arr.shape} içinde {n_nan} NaN, {n_inf} Inf"</span>
        )

<span class="kw">def</span> <span class="fn">grad_health</span>(name, grad):
    <span class="str">"""Bir gradyan tensörü için tek satır norm + min/max."""</span>
    g = grad.<span class="fn">ravel</span>()
    <span class="fn">print</span>(f<span class="str">"{name:12s}  norm={np.linalg.norm(g):.3e}  "</span>
          f<span class="str">"min={g.min():+.2e}  max={g.max():+.2e}  "</span>
          f<span class="str">"mutlak-ort={np.abs(g).mean():.2e}"</span>)

<span class="kw">def</span> <span class="fn">cosine_drift</span>(prev, curr):
    <span class="str">"""Ardışık parametre güncellemeleri arasında kosinüs benzerliği -- salınımı tespit eder."""</span>
    a, b = prev.<span class="fn">ravel</span>(), curr.<span class="fn">ravel</span>()
    <span class="kw">return</span> <span class="fn">float</span>(a @ b / (np.linalg.<span class="fn">norm</span>(a) * np.linalg.<span class="fn">norm</span>(b) + <span class="num">1e-12</span>))

<span class="cm"># Demo</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
weights = rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>)
grad    = rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>) * <span class="num">0.01</span>

<span class="fn">assert_finite</span>(<span class="str">"weights"</span>, weights)
<span class="fn">assert_finite</span>(<span class="str">"grad"</span>,    grad)
<span class="fn">grad_health</span>(<span class="str">"layer.weight"</span>, grad)

prev_g = rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>)
curr_g = prev_g + <span class="num">0.05</span> * rng.<span class="fn">standard_normal</span>(<span class="num">1000</span>)
<span class="fn">print</span>(<span class="str">"güncelleme kosinüs:"</span>, <span class="fn">round</span>(<span class="fn">cosine_drift</span>(prev_g, curr_g), <span class="num">3</span>),
      <span class="str">"  (~1.0 = kararlı, ~0 = kaos, &lt;0 = salınım)"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hile Kâğıdı</h2>
<p class="l-text">Bunu monitörünün yanına duvara yapıştır. İhtiyaç duyacağın tüm sayısal-kararlılık düzeltmelerinin kabaca %80'idir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Softmax / cross-entropy</div><div class="card-body"><code>exp</code>'den önce maksimumu çıkar. Log partition için <code>scipy.special.logsumexp</code> kullan.</div></div>
<div class="calc-card"><div class="card-title">Küçük x için <code>log(1+x)</code></div><div class="card-body"><code>np.log1p(x)</code> kullan. Simetrik olarak <code>exp(x)-1</code> için <code>np.expm1(x)</code>.</div></div>
<div class="calc-card"><div class="card-title">Büyük |x| için sigmoid</div><div class="card-body"><code>np.where(x &gt;= 0, ...)</code> ile dalsız form her iki tarafta da taşmadan kaçınır.</div></div>
<div class="calc-card"><div class="card-title">Ax=b çözme</div><div class="card-body"><code>np.linalg.cond(A)</code>'yı kontrol et. &gt; 1e10 ise <code>solve</code> yerine regülarizasyonlu <code>lstsq</code> kullan.</div></div>
<div class="calc-card"><div class="card-title">Karma hassasiyet</div><div class="card-body">Herhangi bir indirgeme (sum, mean, norm) için float32'ye yukarı cast et. Gradyanlar için loss scaling kullan.</div></div>
<div class="calc-card"><div class="card-title">NaN avı</div><div class="card-body">Şüpheli bloğu kaynakta traceback için <code>np.errstate(invalid='raise')</code> ile sar.</div></div>
<div class="calc-card"><div class="card-title">Akış için varyans</div><div class="card-body"><code>E[X^2] - E[X]^2</code> (felaketsel iptal) yerine Welford algoritması kullan.</div></div>
<div class="calc-card"><div class="card-title">Girdileri her zaman temizle</div><div class="card-body">Her sayısal çekirdeğin tepesinde <code>np.nan_to_num(x)</code>. Ucuz sigorta.</div></div>
</div>

<p class="l-text">Sayısal kararlılık modaya uygun değil, düşük statülü ve yayınlanan modelle epoch 4'te gizemli şekilde NaN olan model arasındaki farktır. Bu desenleri kas hafızasına kurmak için bir öğleden sonra harca; sonradan ayıklama için sıfır öğleden sonra harcarsın.</p>
</div>
`
};
