window.NUMPY_L8 = {
en: `<p class="l-text"><strong>A NumPy array is not a grid of numbers — it is a pointer plus a shape plus a stride tuple.</strong> Once you internalize that, half of NumPy's "magic" disappears: transpose is free because it just swaps strides, broadcasting is free because it sets a stride to zero, and a 100-element sliding-window view of a 1-million-element array uses zero extra memory. Understanding strides is the difference between writing NumPy that copies gigabytes silently and NumPy that flies on a laptop.</p>

<p class="l-text">This lesson opens the box. We will walk through C vs Fortran order, compute strides by hand, distinguish view from copy with concrete tests, build a sliding window via <code>as_strided</code>, and visit the foot-gun where stride tricks let you read off the end of memory. By the end you will know exactly when <code>x.T @ y</code> is free and when <code>x.reshape(...)</code> silently copies the entire array.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute strides by hand for any shape and dtype, in C and F order</li>
<li>Distinguish view vs copy with <code>np.shares_memory</code> and the <code>.base</code> attribute</li>
<li>Use <code>np.lib.stride_tricks.as_strided</code> for zero-copy sliding windows</li>
<li>Use the safer <code>sliding_window_view</code> from NumPy 1.20+</li>
<li>See how broadcasting is implemented as stride=0</li>
<li>Identify when reshape can be a view and when it must copy</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Stride Equation</h2>
<p class="l-text">Given a multi-dimensional index <code>(i, j, k)</code>, the address of an element is computed as a single linear offset from the base pointer:</p>

<div class="katex-block">$$\\text{offset}(i, j, k) = i \\cdot s_0 + j \\cdot s_1 + k \\cdot s_2$$</div>

<p class="l-text">The numbers <code>(s_0, s_1, s_2)</code> are the <em>strides</em> — measured in bytes. For a contiguous C-order array, the last axis advances by <code>itemsize</code> (8 for float64), and each earlier axis advances by the product of all later dim sizes times itemsize.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

a = np.<span class="fn">arange</span>(<span class="num">24</span>, dtype=np.float64).<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"shape   :"</span>, a.shape)
<span class="fn">print</span>(<span class="str">"dtype   :"</span>, a.dtype, <span class="str">"itemsize:"</span>, a.itemsize)
<span class="fn">print</span>(<span class="str">"strides :"</span>, a.strides)        <span class="cm"># (96, 32, 8)</span>
<span class="fn">print</span>(<span class="str">"flags C :"</span>, a.flags[<span class="str">"C_CONTIGUOUS"</span>])

<span class="cm"># Manually verify: a[1, 2, 3] should sit at offset 1*96 + 2*32 + 3*8 = 184 bytes</span>
<span class="cm"># = element index 184/8 = 23</span>
<span class="fn">print</span>(<span class="str">"a[1,2,3] ="</span>, a[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], <span class="str">"(expected 23)"</span>)

<span class="cm"># C order: last axis stride = itemsize, each previous = next_stride * next_dim</span>
expected = (<span class="num">3</span> * <span class="num">4</span> * <span class="num">8</span>, <span class="num">4</span> * <span class="num">8</span>, <span class="num">8</span>)
<span class="fn">print</span>(<span class="str">"expected:"</span>, expected, <span class="str">"match:"</span>, a.strides == expected)
</code></pre></div>

<p class="l-text">If you remember one thing: <strong>strides tell you how many bytes to step to advance one position along that axis</strong>. The shape tells you the size; strides tell you the layout.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. C-order vs Fortran-order</h2>
<p class="l-text">C-order (row-major) is NumPy's default — the rightmost index varies fastest in memory. Fortran-order (column-major) is the opposite — the leftmost index varies fastest. Same data, different traversal pattern, same numerical results — but very different cache behavior.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, time

c = np.<span class="fn">arange</span>(<span class="num">12</span>, dtype=np.float64).<span class="fn">reshape</span>(<span class="num">3</span>, <span class="num">4</span>, order=<span class="str">"C"</span>)
f = np.<span class="fn">arange</span>(<span class="num">12</span>, dtype=np.float64).<span class="fn">reshape</span>(<span class="num">3</span>, <span class="num">4</span>, order=<span class="str">"F"</span>)

<span class="fn">print</span>(<span class="str">"C strides:"</span>, c.strides)   <span class="cm"># (32, 8)  -> rows stride is 4*8</span>
<span class="fn">print</span>(<span class="str">"F strides:"</span>, f.strides)   <span class="cm"># (8, 24)  -> cols stride is 3*8</span>
<span class="fn">print</span>(<span class="str">"same data?"</span>, np.<span class="fn">array_equal</span>(c, f))

<span class="cm"># Cache effect: large matrix, sum row-wise vs column-wise</span>
N = <span class="num">4096</span>
big_c = np.<span class="fn">ones</span>((N, N), dtype=np.float32, order=<span class="str">"C"</span>)
big_f = np.<span class="fn">asfortranarray</span>(big_c)

<span class="kw">def</span> <span class="fn">t</span>(fn, n=<span class="num">3</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

<span class="cm"># C-order: summing along axis=1 (last) is cache-friendly</span>
t_row_c = <span class="fn">t</span>(<span class="kw">lambda</span>: big_c.<span class="fn">sum</span>(axis=<span class="num">1</span>))
t_col_c = <span class="fn">t</span>(<span class="kw">lambda</span>: big_c.<span class="fn">sum</span>(axis=<span class="num">0</span>))
<span class="fn">print</span>(f<span class="str">"C-order sum axis=1 (fast): {t_row_c:.1f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"C-order sum axis=0 (slow): {t_col_c:.1f} ms"</span>)
</code></pre></div>

<div class="calc-highlight">The slow direction is typically 2-5x slower on large arrays purely because each step jumps further than a cache line, defeating the prefetcher. Layout choice matters before any algorithm choice.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. View vs Copy</h2>
<p class="l-text">A <strong>view</strong> shares memory with the original — modifying one mutates the other. A <strong>copy</strong> allocates fresh memory. Most NumPy operations try to return views; some are forced to copy. Confusing the two is responsible for an alarming fraction of "my model is silently broken" bugs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Always view</div><div class="card-body"><code>.T</code>, basic slicing (<code>a[2:5, ::2]</code>), <code>reshape</code> when contiguous, <code>view(dtype)</code> when itemsize matches.</div></div>
<div class="calc-card"><div class="card-title">Always copy</div><div class="card-body">Fancy indexing (<code>a[[0,2,4]]</code>), boolean indexing, arithmetic, <code>astype</code>, <code>reshape</code> when not contiguous.</div></div>
<div class="calc-card"><div class="card-title">Test it</div><div class="card-body"><code>np.shares_memory(a, b)</code> tells you definitively. <code>b.base is a</code> works for direct views.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

a = np.<span class="fn">arange</span>(<span class="num">20</span>).<span class="fn">reshape</span>(<span class="num">4</span>, <span class="num">5</span>)

<span class="cm"># Slice -> view</span>
v = a[<span class="num">1</span>:<span class="num">3</span>, ::<span class="num">2</span>]
<span class="fn">print</span>(<span class="str">"slice shares memory:"</span>, np.<span class="fn">shares_memory</span>(a, v))    <span class="cm"># True</span>
v[<span class="num">0</span>, <span class="num">0</span>] = -<span class="num">999</span>
<span class="fn">print</span>(<span class="str">"original mutated:"</span>, a[<span class="num">1</span>, <span class="num">0</span>])                       <span class="cm"># -999</span>

<span class="cm"># Fancy indexing -> copy</span>
f = a[[<span class="num">0</span>, <span class="num">2</span>, <span class="num">3</span>]]
<span class="fn">print</span>(<span class="str">"fancy shares memory:"</span>, np.<span class="fn">shares_memory</span>(a, f))    <span class="cm"># False</span>
f[<span class="num">0</span>, <span class="num">0</span>] = <span class="num">777</span>
<span class="fn">print</span>(<span class="str">"original unchanged:"</span>, a[<span class="num">0</span>, <span class="num">0</span>])                     <span class="cm"># not 777</span>

<span class="cm"># Reshape: view if contiguous, copy if not</span>
a2 = np.<span class="fn">arange</span>(<span class="num">12</span>).<span class="fn">reshape</span>(<span class="num">3</span>, <span class="num">4</span>)
r1 = a2.<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">6</span>)               <span class="cm"># view (still contiguous)</span>
<span class="fn">print</span>(<span class="str">"reshape view:"</span>, np.<span class="fn">shares_memory</span>(a2, r1))         <span class="cm"># True</span>

r2 = a2.T.<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">6</span>)             <span class="cm"># forced copy (T is not C-contig)</span>
<span class="fn">print</span>(<span class="str">"reshape after T:"</span>, np.<span class="fn">shares_memory</span>(a2, r2))      <span class="cm"># False (copy)</span>

<span class="cm"># .ravel() vs .flatten(): one views when possible, one always copies</span>
<span class="fn">print</span>(<span class="str">"ravel  shares:"</span>, np.<span class="fn">shares_memory</span>(a, a.<span class="fn">ravel</span>()))      <span class="cm"># True</span>
<span class="fn">print</span>(<span class="str">"flatten shares:"</span>, np.<span class="fn">shares_memory</span>(a, a.<span class="fn">flatten</span>()))   <span class="cm"># False</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Broadcasting Is Just Stride=0</h2>
<p class="l-text">Broadcasting feels magical, but it has a one-line implementation: <strong>set the stride along the broadcast axis to zero</strong>. Stepping by zero bytes means you read the same element repeatedly, which is logically equivalent to having tiled the array — but with no allocation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> broadcast_to

<span class="cm"># A 1D array broadcast to 2D</span>
v = np.<span class="fn">array</span>([<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>], dtype=np.float64)
b = <span class="fn">broadcast_to</span>(v, (<span class="num">4</span>, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"broadcast shape:"</span>, b.shape)
<span class="fn">print</span>(<span class="str">"broadcast strides:"</span>, b.strides)   <span class="cm"># (0, 8) -> stride 0 along the new axis!</span>
<span class="fn">print</span>(b)

<span class="cm"># Memory cost of "tiling" 1000x1000:</span>
big = <span class="fn">broadcast_to</span>(v, (<span class="num">1000</span>, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"nbytes (logical):"</span>, big.nbytes)        <span class="cm"># 24000  (1000*3*8 logical)</span>
<span class="fn">print</span>(<span class="str">"base nbytes (real):"</span>, big.base.nbytes) <span class="cm"># 24      (only the source)</span>

<span class="cm"># This is why "x[:, None] + y[None, :]" creates an outer-sum without allocating</span>
<span class="cm"># the intermediate broadcast tensors.</span>
x = np.<span class="fn">arange</span>(<span class="num">4</span>, dtype=np.float64)
y = np.<span class="fn">arange</span>(<span class="num">3</span>, dtype=np.float64)
S = x[:, <span class="kw">None</span>] + y[<span class="kw">None</span>, :]
<span class="fn">print</span>(<span class="str">"outer sum:\\n"</span>, S)
</code></pre></div>

<div class="calc-highlight">Broadcasting is not just syntax sugar — it's a memory optimization. Every <code>x[:, None]</code> creates a stride-0 view, never a copy. Use it freely.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sliding Windows With as_strided</h2>
<p class="l-text">Now the powerful (and dangerous) part. <code>np.lib.stride_tricks.as_strided</code> lets you specify shape AND strides directly, building a view that NumPy's normal API would refuse. The classic application: a sliding window with no copy.</p>

<div class="katex-block">$$\\text{window}[i] = x[i:i+w] \\quad\\text{shape: } (n - w + 1,\\ w)$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> as_strided

x = np.<span class="fn">arange</span>(<span class="num">10</span>, dtype=np.float64)
w = <span class="num">4</span>   <span class="cm"># window size</span>

<span class="cm"># Build the sliding window view: shape (n - w + 1, w)</span>
n = x.shape[<span class="num">0</span>]
windows = <span class="fn">as_strided</span>(
    x,
    shape=(n - w + <span class="num">1</span>, w),
    strides=(x.strides[<span class="num">0</span>], x.strides[<span class="num">0</span>]),   <span class="cm"># both step by 8 bytes</span>
)
<span class="fn">print</span>(windows)
<span class="fn">print</span>(<span class="str">"shares memory:"</span>, np.<span class="fn">shares_memory</span>(x, windows))    <span class="cm"># True</span>

<span class="cm"># Compute rolling mean in one line</span>
<span class="fn">print</span>(<span class="str">"rolling mean:"</span>, windows.<span class="fn">mean</span>(axis=<span class="num">1</span>))

<span class="cm"># Memory math: full materialization would be (n-w+1) * w = 7 * 4 = 28 floats</span>
<span class="cm"># View uses 0 extra: it's pointers into the same 10 floats.</span>
<span class="fn">print</span>(<span class="str">"view nbytes (logical):"</span>, windows.nbytes,
      <span class="str">"  base nbytes:"</span>, x.nbytes)
</code></pre></div>

<p class="l-text">This is the foundation of fast time-series feature engineering, image patching, and 1D convolution. The catch: there is no bounds checking. If you set <code>shape=(100, w)</code> on a 10-element array, you will read off the end of allocated memory and get garbage — or a segfault.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Safer Alternative: sliding_window_view</h2>
<p class="l-text">NumPy 1.20+ ships <code>sliding_window_view</code> — a bounds-checked wrapper around <code>as_strided</code>. Use it whenever you can. Reach for raw <code>as_strided</code> only when you need non-uniform strides or odd shapes.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> sliding_window_view

x = np.<span class="fn">arange</span>(<span class="num">10</span>, dtype=np.float64)

<span class="cm"># 1D sliding window</span>
w1 = <span class="fn">sliding_window_view</span>(x, window_shape=<span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"1D window shape:"</span>, w1.shape)        <span class="cm"># (7, 4)</span>

<span class="cm"># 2D sliding window over an image</span>
img = np.<span class="fn">arange</span>(<span class="num">36</span>).<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">6</span>)
patches = <span class="fn">sliding_window_view</span>(img, window_shape=(<span class="num">3</span>, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"patch tensor shape:"</span>, patches.shape)   <span class="cm"># (4, 4, 3, 3)</span>
<span class="cm"># patches[i, j] is the 3x3 patch at top-left (i, j)</span>
<span class="fn">print</span>(<span class="str">"patch at (0,0):\\n"</span>, patches[<span class="num">0</span>, <span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"patch at (3,3):\\n"</span>, patches[<span class="num">3</span>, <span class="num">3</span>])

<span class="cm"># Apply a kernel: mean filter == patches.mean(axis=(-2, -1))</span>
mean_filtered = patches.<span class="fn">mean</span>(axis=(-<span class="num">2</span>, -<span class="num">1</span>))
<span class="fn">print</span>(<span class="str">"mean-filtered shape:"</span>, mean_filtered.shape)
</code></pre></div>

<div class="calc-highlight">Anywhere you have a loop like <code>for i in range(n - w + 1): out[i] = f(x[i:i+w])</code>, replace it with <code>sliding_window_view(x, w)</code> followed by a vectorized op along the last axis. Speedups of 10-100x are routine.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Reshape Surprises</h2>
<p class="l-text"><code>reshape</code> is a frequent source of "why is my code suddenly 10x slower?" The rule: reshape returns a view if the new shape can be expressed by walking memory linearly with the same itemsize. If the array isn't contiguous (e.g., after transpose, slicing with step &gt; 1, or weird stride manipulation), reshape silently copies.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

a = np.<span class="fn">arange</span>(<span class="num">24</span>).<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"a flags:"</span>, a.flags[<span class="str">"C_CONTIGUOUS"</span>], a.flags[<span class="str">"F_CONTIGUOUS"</span>])

<span class="cm"># Reshape on contiguous -> view</span>
r1 = a.<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"contig reshape view:"</span>, np.<span class="fn">shares_memory</span>(a, r1))   <span class="cm"># True</span>

<span class="cm"># Transpose breaks contiguity</span>
t = a.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">0</span>, <span class="num">2</span>)
<span class="fn">print</span>(<span class="str">"after T contig:"</span>, t.flags[<span class="str">"C_CONTIGUOUS"</span>])         <span class="cm"># False</span>
r2 = t.<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"non-contig reshape:"</span>, np.<span class="fn">shares_memory</span>(a, r2))     <span class="cm"># False (copy!)</span>

<span class="cm"># To force a no-copy reshape, use .reshape(...) with a contiguous source</span>
<span class="cm"># or, to require a view (raise if it would copy), assign directly to .shape</span>
b = np.<span class="fn">arange</span>(<span class="num">24</span>).<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="kw">try</span>:
    b.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">0</span>, <span class="num">2</span>).shape = (<span class="num">6</span>, <span class="num">4</span>)   <span class="cm"># raises: cannot do without copy</span>
<span class="kw">except</span> AttributeError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"forced view failed:"</span>, <span class="fn">str</span>(e)[:<span class="num">60</span>])

<span class="cm"># Use np.ascontiguousarray to make an explicit copy when you know you need one</span>
clean = np.<span class="fn">ascontiguousarray</span>(t).<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"now contig:"</span>, clean.flags[<span class="str">"C_CONTIGUOUS"</span>])
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Stride Tricks in the Wild</h2>
<p class="l-text">Three production-flavored applications you can drop into real code today.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> sliding_window_view

<span class="cm"># (1) Rolling z-score over a price series, no Python loop</span>
prices = np.<span class="fn">cumsum</span>(np.random.<span class="fn">default_rng</span>(<span class="num">0</span>).<span class="fn">standard_normal</span>(<span class="num">200</span>)) + <span class="num">100</span>
w = <span class="num">20</span>
windows = <span class="fn">sliding_window_view</span>(prices, window_shape=w)
mu  = windows.<span class="fn">mean</span>(axis=<span class="num">1</span>)
sd  = windows.<span class="fn">std</span>(axis=<span class="num">1</span>) + <span class="num">1e-9</span>
z   = (prices[w-<span class="num">1</span>:] - mu) / sd
<span class="fn">print</span>(<span class="str">"rolling z first 3:"</span>, np.<span class="fn">round</span>(z[:<span class="num">3</span>], <span class="num">3</span>))

<span class="cm"># (2) Image patches for a tiny "im2col"-style pipeline</span>
img = np.<span class="fn">arange</span>(<span class="num">64</span>).<span class="fn">reshape</span>(<span class="num">8</span>, <span class="num">8</span>).<span class="fn">astype</span>(np.float32)
patches = <span class="fn">sliding_window_view</span>(img, window_shape=(<span class="num">3</span>, <span class="num">3</span>))
flat_patches = patches.<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">9</span>)            <span class="cm"># (rows*cols, 9)</span>
<span class="fn">print</span>(<span class="str">"im2col patches:"</span>, flat_patches.shape)
<span class="cm"># A 3x3 mean kernel becomes a single matmul</span>
kernel = np.<span class="fn">ones</span>(<span class="num">9</span>, dtype=np.float32) / <span class="num">9</span>
conv_out = (flat_patches @ kernel).<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">6</span>)
<span class="fn">print</span>(<span class="str">"convolved corner:\\n"</span>, np.<span class="fn">round</span>(conv_out[:<span class="num">3</span>, :<span class="num">3</span>], <span class="num">2</span>))

<span class="cm"># (3) Audio framing: split a 1D waveform into overlapping frames</span>
wav = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">1024</span>).<span class="fn">astype</span>(np.float32)
frame_len, hop = <span class="num">64</span>, <span class="num">16</span>
n_frames = <span class="num">1</span> + (<span class="fn">len</span>(wav) - frame_len) // hop
frames = np.lib.stride_tricks.<span class="fn">as_strided</span>(
    wav,
    shape=(n_frames, frame_len),
    strides=(wav.strides[<span class="num">0</span>] * hop, wav.strides[<span class="num">0</span>]),
)
<span class="fn">print</span>(<span class="str">"audio frames:"</span>, frames.shape, <span class="str">"shares memory:"</span>, np.<span class="fn">shares_memory</span>(wav, frames))
</code></pre></div>

<p class="l-text">Each of these would otherwise require a Python loop over indices and would be 50-200x slower. Once strides click, you stop allocating — and that is when NumPy code stops being "fast" and starts being "production-fast".</p>
</div>
`,
tr: `<p class="l-text"><strong>Bir NumPy dizisi sayıların ızgarası değildir — bir pointer artı bir şekil artı bir <em>strides</em> tuple'ıdır.</strong> Bunu içselleştirdiğinde NumPy'nin "sihrinin" yarısı kaybolur: transpose bedavadır çünkü sadece strides'ı takas eder, broadcasting bedavadır çünkü stride'ı sıfıra ayarlar ve 1 milyon elemanlı bir dizinin 100 elemanlı kayan-pencere görünümü sıfır ekstra bellek kullanır. <em>strides</em>'ı anlamak, sessizce gigabyte'lar kopyalayan NumPy ile bir laptop'ta uçan NumPy arasındaki farktır.</p>

<p class="l-text">Bu ders kutuyu açar. C ve Fortran sıralamasını yürüyeceğiz, strides'ı elle hesaplayacağız, somut testlerle görünüm vs kopyayı ayıracağız, <code>as_strided</code> ile kayan pencere kuracağız ve <em>stride</em> hilelerinin belleğin sonunu okumana izin verdiği tehlikeyi ziyaret edeceğiz. Sonunda <code>x.T @ y</code>'nin tam olarak ne zaman bedava olduğunu ve <code>x.reshape(...)</code>'nin tüm diziyi sessizce ne zaman kopyaladığını bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir şekil ve dtype için, C ve F sıralamasında strides'ı elle hesaplama</li>
<li><code>np.shares_memory</code> ve <code>.base</code> özelliği ile görünüm vs kopyayı ayırma</li>
<li>Sıfır-kopya kayan pencereler için <code>np.lib.stride_tricks.as_strided</code> kullanma</li>
<li>NumPy 1.20+'tan daha güvenli <code>sliding_window_view</code>'i kullanma</li>
<li>Yayılımın stride=0 olarak nasıl uygulandığını görme</li>
<li>reshape'in ne zaman görünüm olabileceğini ne zaman kopyalamak zorunda olduğunu belirleme</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Stride Denklemi</h2>
<p class="l-text">Çok boyutlu bir indeks <code>(i, j, k)</code> verildiğinde, bir elemanın adresi temel pointer'dan tek bir doğrusal offset olarak hesaplanır:</p>

<div class="katex-block">$$\\text{offset}(i, j, k) = i \\cdot s_0 + j \\cdot s_1 + k \\cdot s_2$$</div>

<p class="l-text"><code>(s_0, s_1, s_2)</code> sayıları <em>strides</em>'tır — byte cinsinden ölçülür. Bitişik bir C sıralı dizide son eksen <code>itemsize</code> kadar ilerler (float64 için 8) ve her önceki eksen daha sonraki tüm boyutların çarpımı çarpı itemsize kadar ilerler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

a = np.<span class="fn">arange</span>(<span class="num">24</span>, dtype=np.float64).<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"şekil    :"</span>, a.shape)
<span class="fn">print</span>(<span class="str">"dtype    :"</span>, a.dtype, <span class="str">"itemsize:"</span>, a.itemsize)
<span class="fn">print</span>(<span class="str">"strides  :"</span>, a.strides)        <span class="cm"># (96, 32, 8)</span>
<span class="fn">print</span>(<span class="str">"flags C  :"</span>, a.flags[<span class="str">"C_CONTIGUOUS"</span>])

<span class="cm"># Manuel doğrula: a[1, 2, 3] offset 1*96 + 2*32 + 3*8 = 184 byte'ta olmalı</span>
<span class="cm"># = eleman indeksi 184/8 = 23</span>
<span class="fn">print</span>(<span class="str">"a[1,2,3] ="</span>, a[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], <span class="str">"(beklenen 23)"</span>)

<span class="cm"># C sıralaması: son eksen stride = itemsize, her önceki = sonraki_stride * sonraki_dim</span>
expected = (<span class="num">3</span> * <span class="num">4</span> * <span class="num">8</span>, <span class="num">4</span> * <span class="num">8</span>, <span class="num">8</span>)
<span class="fn">print</span>(<span class="str">"beklenen:"</span>, expected, <span class="str">"eşleşme:"</span>, a.strides == expected)
</code></pre></div>

<p class="l-text">Tek bir şey hatırlayacaksan: <strong>strides sana o eksen boyunca bir pozisyon ilerlemek için kaç byte adım atman gerektiğini söyler</strong>. Şekil boyutu söyler; strides düzeni söyler.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. C-sıra vs Fortran-sıra</h2>
<p class="l-text">C sıralaması (satır-büyük) NumPy'nin varsayılanıdır — en sağdaki indeks bellekte en hızlı değişir. Fortran sıralaması (sütun-büyük) tersidir — en soldaki indeks en hızlı değişir. Aynı veri, farklı dolaşma deseni, aynı sayısal sonuçlar — ama çok farklı cache davranışı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, time

c = np.<span class="fn">arange</span>(<span class="num">12</span>, dtype=np.float64).<span class="fn">reshape</span>(<span class="num">3</span>, <span class="num">4</span>, order=<span class="str">"C"</span>)
f = np.<span class="fn">arange</span>(<span class="num">12</span>, dtype=np.float64).<span class="fn">reshape</span>(<span class="num">3</span>, <span class="num">4</span>, order=<span class="str">"F"</span>)

<span class="fn">print</span>(<span class="str">"C strides:"</span>, c.strides)   <span class="cm"># (32, 8)  -> satır stride 4*8</span>
<span class="fn">print</span>(<span class="str">"F strides:"</span>, f.strides)   <span class="cm"># (8, 24)  -> sütun stride 3*8</span>
<span class="fn">print</span>(<span class="str">"aynı veri?"</span>, np.<span class="fn">array_equal</span>(c, f))

<span class="cm"># Cache etkisi: büyük matris, satır-bazlı vs sütun-bazlı toplam</span>
N = <span class="num">4096</span>
big_c = np.<span class="fn">ones</span>((N, N), dtype=np.float32, order=<span class="str">"C"</span>)
big_f = np.<span class="fn">asfortranarray</span>(big_c)

<span class="kw">def</span> <span class="fn">t</span>(fn, n=<span class="num">3</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

<span class="cm"># C sıralaması: axis=1 (son) boyunca toplama cache-dostu</span>
t_row_c = <span class="fn">t</span>(<span class="kw">lambda</span>: big_c.<span class="fn">sum</span>(axis=<span class="num">1</span>))
t_col_c = <span class="fn">t</span>(<span class="kw">lambda</span>: big_c.<span class="fn">sum</span>(axis=<span class="num">0</span>))
<span class="fn">print</span>(f<span class="str">"C-sıra toplam axis=1 (hızlı): {t_row_c:.1f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"C-sıra toplam axis=0 (yavaş): {t_col_c:.1f} ms"</span>)
</code></pre></div>

<div class="calc-highlight">Yavaş yön büyük dizilerde tipik olarak 2-5x daha yavaştır çünkü her adım bir cache satırından daha uzağa atlar ve prefetcher'ı yener. Düzen seçimi herhangi bir algoritma seçiminden önce gelir.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Görünüm vs Kopya</h2>
<p class="l-text">Bir <strong>görünüm</strong> orijinal ile bellek paylaşır — birini değiştirmek diğerini değiştirir. Bir <strong>kopya</strong> taze bellek ayırır. Çoğu NumPy işlemi görünüm dönmeye çalışır; bazıları kopyalamak zorundadır. İkisini karıştırmak "modelim sessizce bozuldu" bug'larının korkutucu bir kısmından sorumludur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Her zaman görünüm</div><div class="card-body"><code>.T</code>, temel dilimleme (<code>a[2:5, ::2]</code>), bitişikken <code>reshape</code>, itemsize uyduğunda <code>view(dtype)</code>.</div></div>
<div class="calc-card"><div class="card-title">Her zaman kopya</div><div class="card-body">Fancy indeksleme (<code>a[[0,2,4]]</code>), boolean indeksleme, aritmetik, <code>astype</code>, bitişik olmadığında <code>reshape</code>.</div></div>
<div class="calc-card"><div class="card-title">Test et</div><div class="card-body"><code>np.shares_memory(a, b)</code> sana kesin söyler. <code>b.base is a</code> doğrudan görünümler için çalışır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

a = np.<span class="fn">arange</span>(<span class="num">20</span>).<span class="fn">reshape</span>(<span class="num">4</span>, <span class="num">5</span>)

<span class="cm"># Dilim -> görünüm</span>
v = a[<span class="num">1</span>:<span class="num">3</span>, ::<span class="num">2</span>]
<span class="fn">print</span>(<span class="str">"dilim bellek paylaşır:"</span>, np.<span class="fn">shares_memory</span>(a, v))    <span class="cm"># True</span>
v[<span class="num">0</span>, <span class="num">0</span>] = -<span class="num">999</span>
<span class="fn">print</span>(<span class="str">"orijinal değişti:"</span>, a[<span class="num">1</span>, <span class="num">0</span>])                       <span class="cm"># -999</span>

<span class="cm"># Fancy indeksleme -> kopya</span>
f = a[[<span class="num">0</span>, <span class="num">2</span>, <span class="num">3</span>]]
<span class="fn">print</span>(<span class="str">"fancy bellek paylaşır:"</span>, np.<span class="fn">shares_memory</span>(a, f))    <span class="cm"># False</span>
f[<span class="num">0</span>, <span class="num">0</span>] = <span class="num">777</span>
<span class="fn">print</span>(<span class="str">"orijinal değişmedi:"</span>, a[<span class="num">0</span>, <span class="num">0</span>])                     <span class="cm"># 777 değil</span>

<span class="cm"># Reshape: bitişikse görünüm, değilse kopya</span>
a2 = np.<span class="fn">arange</span>(<span class="num">12</span>).<span class="fn">reshape</span>(<span class="num">3</span>, <span class="num">4</span>)
r1 = a2.<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">6</span>)               <span class="cm"># görünüm (hâlâ bitişik)</span>
<span class="fn">print</span>(<span class="str">"reshape görünüm:"</span>, np.<span class="fn">shares_memory</span>(a2, r1))         <span class="cm"># True</span>

r2 = a2.T.<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">6</span>)             <span class="cm"># zorla kopya (T C-bitişik değil)</span>
<span class="fn">print</span>(<span class="str">"T sonrası reshape:"</span>, np.<span class="fn">shares_memory</span>(a2, r2))      <span class="cm"># False (kopya)</span>

<span class="cm"># .ravel() vs .flatten(): biri mümkünse görünür, diğeri her zaman kopyalar</span>
<span class="fn">print</span>(<span class="str">"ravel  paylaşır:"</span>, np.<span class="fn">shares_memory</span>(a, a.<span class="fn">ravel</span>()))      <span class="cm"># True</span>
<span class="fn">print</span>(<span class="str">"flatten paylaşır:"</span>, np.<span class="fn">shares_memory</span>(a, a.<span class="fn">flatten</span>()))   <span class="cm"># False</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yayılım Sadece Stride=0'dır</h2>
<p class="l-text">Yayılım sihirli hissettirir, ama tek satırlık bir uygulaması var: <strong>yayılan eksen boyunca stride'ı sıfıra ayarla</strong>. Sıfır byte adım atmak aynı elemanı tekrar tekrar okumak demektir; bu mantıken diziyi döşemiş gibi olmakla eşdeğerdir — ama tahsisat olmadan.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> broadcast_to

<span class="cm"># 2D'ye yayılan 1D dizi</span>
v = np.<span class="fn">array</span>([<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>], dtype=np.float64)
b = <span class="fn">broadcast_to</span>(v, (<span class="num">4</span>, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"yayın şekli:"</span>, b.shape)
<span class="fn">print</span>(<span class="str">"yayın strides:"</span>, b.strides)   <span class="cm"># (0, 8) -> yeni eksende stride 0!</span>
<span class="fn">print</span>(b)

<span class="cm"># 1000x1000 "döşeme"nin bellek maliyeti:</span>
big = <span class="fn">broadcast_to</span>(v, (<span class="num">1000</span>, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"nbytes (mantıksal):"</span>, big.nbytes)        <span class="cm"># 24000  (1000*3*8 mantıksal)</span>
<span class="fn">print</span>(<span class="str">"base nbytes (gerçek):"</span>, big.base.nbytes) <span class="cm"># 24      (sadece kaynak)</span>

<span class="cm"># Bu yüzden "x[:, None] + y[None, :]" ara yayın tensörlerini ayırmadan</span>
<span class="cm"># bir dış-toplam oluşturur.</span>
x = np.<span class="fn">arange</span>(<span class="num">4</span>, dtype=np.float64)
y = np.<span class="fn">arange</span>(<span class="num">3</span>, dtype=np.float64)
S = x[:, <span class="kw">None</span>] + y[<span class="kw">None</span>, :]
<span class="fn">print</span>(<span class="str">"dış toplam:\\n"</span>, S)
</code></pre></div>

<div class="calc-highlight">Yayılım sadece sözdizimsel şeker değil — bir bellek optimizasyonudur. Her <code>x[:, None]</code> bir stride-0 görünüm oluşturur, asla kopya değil. Onu özgürce kullan.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. as_strided ile Kayan Pencereler</h2>
<p class="l-text">Şimdi güçlü (ve tehlikeli) kısım. <code>np.lib.stride_tricks.as_strided</code> şekil VE strides'ı doğrudan belirtmene izin verir; NumPy'nin normal API'sinin reddedeceği bir görünüm inşa eder. Klasik uygulama: kopyasız kayan pencere.</p>

<div class="katex-block">$$\\text{window}[i] = x[i:i+w] \\quad\\text{shape: } (n - w + 1,\\ w)$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> as_strided

x = np.<span class="fn">arange</span>(<span class="num">10</span>, dtype=np.float64)
w = <span class="num">4</span>   <span class="cm"># pencere boyutu</span>

<span class="cm"># Kayan pencere görünümünü inşa et: şekil (n - w + 1, w)</span>
n = x.shape[<span class="num">0</span>]
windows = <span class="fn">as_strided</span>(
    x,
    shape=(n - w + <span class="num">1</span>, w),
    strides=(x.strides[<span class="num">0</span>], x.strides[<span class="num">0</span>]),   <span class="cm"># ikisi de 8 byte ile ilerler</span>
)
<span class="fn">print</span>(windows)
<span class="fn">print</span>(<span class="str">"bellek paylaşır:"</span>, np.<span class="fn">shares_memory</span>(x, windows))    <span class="cm"># True</span>

<span class="cm"># Tek satırda yuvarlanan ortalama hesapla</span>
<span class="fn">print</span>(<span class="str">"yuvarlanan ortalama:"</span>, windows.<span class="fn">mean</span>(axis=<span class="num">1</span>))

<span class="cm"># Bellek matematiği: tam materyalleştirme (n-w+1) * w = 7 * 4 = 28 float olurdu</span>
<span class="cm"># Görünüm 0 ekstra kullanır: aynı 10 float'a pointer'lardır.</span>
<span class="fn">print</span>(<span class="str">"görünüm nbytes (mantıksal):"</span>, windows.nbytes,
      <span class="str">"  base nbytes:"</span>, x.nbytes)
</code></pre></div>

<p class="l-text">Bu hızlı zaman serisi özellik mühendisliğinin, görüntü patch'lemenin ve 1D konvolüsyonun temelidir. Gönüllü olarak yakalanış: sınır kontrolü yoktur. 10 elemanlı bir dizide <code>shape=(100, w)</code> ayarlarsan, ayrılan belleğin sonunu okur ve çöp veya bir segfault alırsın.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Daha Güvenli Alternatif: sliding_window_view</h2>
<p class="l-text">NumPy 1.20+ <code>sliding_window_view</code> sunar — <code>as_strided</code> etrafında sınır kontrollü bir sarmalayıcı. Mümkün olduğunda onu kullan. Ham <code>as_strided</code>'a yalnızca düzgün olmayan strides veya tuhaf şekiller gerektiğinde başvur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> sliding_window_view

x = np.<span class="fn">arange</span>(<span class="num">10</span>, dtype=np.float64)

<span class="cm"># 1D kayan pencere</span>
w1 = <span class="fn">sliding_window_view</span>(x, window_shape=<span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"1D pencere şekli:"</span>, w1.shape)        <span class="cm"># (7, 4)</span>

<span class="cm"># Görüntü üzerinde 2D kayan pencere</span>
img = np.<span class="fn">arange</span>(<span class="num">36</span>).<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">6</span>)
patches = <span class="fn">sliding_window_view</span>(img, window_shape=(<span class="num">3</span>, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"patch tensör şekli:"</span>, patches.shape)   <span class="cm"># (4, 4, 3, 3)</span>
<span class="cm"># patches[i, j] sol-üstü (i, j) olan 3x3 patch'tir</span>
<span class="fn">print</span>(<span class="str">"patch (0,0):\\n"</span>, patches[<span class="num">0</span>, <span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"patch (3,3):\\n"</span>, patches[<span class="num">3</span>, <span class="num">3</span>])

<span class="cm"># Bir kernel uygula: ortalama filtre == patches.mean(axis=(-2, -1))</span>
mean_filtered = patches.<span class="fn">mean</span>(axis=(-<span class="num">2</span>, -<span class="num">1</span>))
<span class="fn">print</span>(<span class="str">"ortalama-filtreli şekil:"</span>, mean_filtered.shape)
</code></pre></div>

<div class="calc-highlight">Nerede <code>for i in range(n - w + 1): out[i] = f(x[i:i+w])</code> gibi bir döngün varsa, son eksen boyunca vektörize op ile <code>sliding_window_view(x, w)</code> ile değiştir. 10-100x hızlanmalar rutindir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Reshape Sürprizleri</h2>
<p class="l-text"><code>reshape</code> sıkça "kodum neden birden 10x yavaşladı?" kaynağıdır. Kural: yeni şekil aynı itemsize ile belleği doğrusal yürüyerek ifade edilebiliyorsa reshape görünüm döndürür. Dizi bitişik değilse (örn. transpose, adım &gt; 1 ile dilimleme veya tuhaf stride manipülasyonundan sonra) reshape sessizce kopyalar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

a = np.<span class="fn">arange</span>(<span class="num">24</span>).<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"a flags:"</span>, a.flags[<span class="str">"C_CONTIGUOUS"</span>], a.flags[<span class="str">"F_CONTIGUOUS"</span>])

<span class="cm"># Bitişikte reshape -> görünüm</span>
r1 = a.<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"bitişik reshape görünüm:"</span>, np.<span class="fn">shares_memory</span>(a, r1))   <span class="cm"># True</span>

<span class="cm"># Transpose bitişikliği bozar</span>
t = a.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">0</span>, <span class="num">2</span>)
<span class="fn">print</span>(<span class="str">"T sonrası bitişik:"</span>, t.flags[<span class="str">"C_CONTIGUOUS"</span>])         <span class="cm"># False</span>
r2 = t.<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"bitişik-değil reshape:"</span>, np.<span class="fn">shares_memory</span>(a, r2))     <span class="cm"># False (kopya!)</span>

<span class="cm"># Kopyasız reshape'i zorlamak için, bitişik bir kaynakla .reshape(...) kullan</span>
<span class="cm"># veya görünümü zorunlu kılmak için (kopyalarsa hata verir) doğrudan .shape'e ata</span>
b = np.<span class="fn">arange</span>(<span class="num">24</span>).<span class="fn">reshape</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>)
<span class="kw">try</span>:
    b.<span class="fn">transpose</span>(<span class="num">1</span>, <span class="num">0</span>, <span class="num">2</span>).shape = (<span class="num">6</span>, <span class="num">4</span>)   <span class="cm"># hata: kopya olmadan yapılamaz</span>
<span class="kw">except</span> AttributeError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"zorunlu görünüm başarısız:"</span>, <span class="fn">str</span>(e)[:<span class="num">60</span>])

<span class="cm"># Açık kopyaya ihtiyacın olduğunu bildiğinde np.ascontiguousarray kullan</span>
clean = np.<span class="fn">ascontiguousarray</span>(t).<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">4</span>)
<span class="fn">print</span>(<span class="str">"artık bitişik:"</span>, clean.flags[<span class="str">"C_CONTIGUOUS"</span>])
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Vahşi Doğada Stride Hileleri</h2>
<p class="l-text">Bugün gerçek koda bırakabileceğin üç üretim-tatlı uygulama.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> numpy.lib.stride_tricks <span class="kw">import</span> sliding_window_view

<span class="cm"># (1) Bir fiyat serisinde yuvarlanan z-skor, Python döngüsü olmadan</span>
prices = np.<span class="fn">cumsum</span>(np.random.<span class="fn">default_rng</span>(<span class="num">0</span>).<span class="fn">standard_normal</span>(<span class="num">200</span>)) + <span class="num">100</span>
w = <span class="num">20</span>
windows = <span class="fn">sliding_window_view</span>(prices, window_shape=w)
mu  = windows.<span class="fn">mean</span>(axis=<span class="num">1</span>)
sd  = windows.<span class="fn">std</span>(axis=<span class="num">1</span>) + <span class="num">1e-9</span>
z   = (prices[w-<span class="num">1</span>:] - mu) / sd
<span class="fn">print</span>(<span class="str">"yuvarlanan z ilk 3:"</span>, np.<span class="fn">round</span>(z[:<span class="num">3</span>], <span class="num">3</span>))

<span class="cm"># (2) Minik "im2col"-stili pipeline için görüntü patch'leri</span>
img = np.<span class="fn">arange</span>(<span class="num">64</span>).<span class="fn">reshape</span>(<span class="num">8</span>, <span class="num">8</span>).<span class="fn">astype</span>(np.float32)
patches = <span class="fn">sliding_window_view</span>(img, window_shape=(<span class="num">3</span>, <span class="num">3</span>))
flat_patches = patches.<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">9</span>)            <span class="cm"># (rows*cols, 9)</span>
<span class="fn">print</span>(<span class="str">"im2col patch'ler:"</span>, flat_patches.shape)
<span class="cm"># 3x3 ortalama kernel tek bir matmul olur</span>
kernel = np.<span class="fn">ones</span>(<span class="num">9</span>, dtype=np.float32) / <span class="num">9</span>
conv_out = (flat_patches @ kernel).<span class="fn">reshape</span>(<span class="num">6</span>, <span class="num">6</span>)
<span class="fn">print</span>(<span class="str">"konvolüsyonlu köşe:\\n"</span>, np.<span class="fn">round</span>(conv_out[:<span class="num">3</span>, :<span class="num">3</span>], <span class="num">2</span>))

<span class="cm"># (3) Ses çerçeveleme: 1D dalga formunu örtüşen çerçevelere böl</span>
wav = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, <span class="num">1024</span>).<span class="fn">astype</span>(np.float32)
frame_len, hop = <span class="num">64</span>, <span class="num">16</span>
n_frames = <span class="num">1</span> + (<span class="fn">len</span>(wav) - frame_len) // hop
frames = np.lib.stride_tricks.<span class="fn">as_strided</span>(
    wav,
    shape=(n_frames, frame_len),
    strides=(wav.strides[<span class="num">0</span>] * hop, wav.strides[<span class="num">0</span>]),
)
<span class="fn">print</span>(<span class="str">"ses çerçeveleri:"</span>, frames.shape, <span class="str">"bellek paylaşır:"</span>, np.<span class="fn">shares_memory</span>(wav, frames))
</code></pre></div>

<p class="l-text">Bunların her biri aksi takdirde indeksler üzerinde Python döngüsü gerektirirdi ve 50-200x daha yavaş olurdu. Strides bir kez kavrandığında tahsis etmeyi bırakırsın — ve NumPy kodunun "hızlı" olmaktan çıkıp "üretim-hızlı" olmaya başladığı an budur.</p>
</div>
`
};
