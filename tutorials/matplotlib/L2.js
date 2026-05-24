window.MATPLOTLIB_L2 = {

en: `<p class="l-text"><strong>The line plot is the workhorse of data visualisation.</strong> Loss curves, time series, learning rates, predicted vs actual, attention weights as functions of position -- almost every "how does X change as Y changes" question becomes a line plot. In this lesson we go deep into <code>ax.plot</code>: every parameter that matters, every styling trick that turns a plain line into a publication-ready figure, and the LaTeX formula support that makes Matplotlib indispensable for theses and papers.</p>

<p class="l-text">By the end you will know how to draw multiple lines on the same axes with sensible colours and markers, position a legend automatically, swap in pre-made themes (ggplot, seaborn) for a five-second beautification, and embed real LaTeX formulas in axis labels and titles.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Draw line, scatter, and bar plots and choose the right one per use case</li><li>Style plots with markers, line styles, colors, and alpha transparency</li><li>Add multiple series to one Axes and build a clear legend</li><li>Use log scales and twin axes to visualize wide-range or two-unit data</li><li>Annotate points and regions with text, arrows, and shaded patches</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ax.plot: The Full Signature</h2>

<p class="l-text">Most people know <code>ax.plot(x, y)</code>. But the function takes a generous handful of styling kwargs that you need to internalise to control the look of your figures. Here is the canonical, parameter-rich version.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">50</span>)
y = np.<span class="fn">sin</span>(x) * np.<span class="fn">exp</span>(-x / <span class="num">8</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

ax.<span class="fn">plot</span>(
    x, y,
    color=<span class="str">"#c8a96e"</span>,         <span class="cm"># any hex, named, or rgb tuple</span>
    linestyle=<span class="str">"-"</span>,            <span class="cm"># '-', '--', '-.', ':', or '' (no line)</span>
    linewidth=<span class="num">2.5</span>,            <span class="cm"># in points (1 pt = 1/72 inch)</span>
    marker=<span class="str">"o"</span>,               <span class="cm"># 'o', 's', '^', 'D', 'x', '*', etc.</span>
    markersize=<span class="num">6</span>,             <span class="cm"># marker diameter in points</span>
    markerfacecolor=<span class="str">"white"</span>,  <span class="cm"># interior of markers</span>
    markeredgecolor=<span class="str">"#c8a96e"</span>,<span class="cm"># border colour</span>
    markeredgewidth=<span class="num">1.2</span>,
    alpha=<span class="num">0.9</span>,                <span class="cm"># transparency 0..1</span>
    label=r<span class="str">"$\\sin(x) \\cdot e^{-x/8}$"</span>
)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Damped sine: every kwarg in one call"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds 50 x values from 0 to 10 and computes a damped sine -- a sin wave whose amplitude decays exponentially. This shape mirrors a learning rate schedule with cosine decay or a vibration dying out. 2) Opens the canvas with <code>plt.subplots</code>. 3) The single <code>ax.plot</code> call uses every common styling kwarg at once: <code>color</code> sets the line colour (here a warm gold hex), <code>linestyle="-"</code> picks solid (other options are dashed, dash-dot, dotted), <code>linewidth=2.5</code> sets the line thickness in points, <code>marker="o"</code> draws filled circles at each data point, <code>markersize=6</code> controls their diameter, <code>markerfacecolor="white"</code> hollows them out, <code>markeredgecolor</code> matches the line, <code>alpha=0.9</code> adds slight transparency. 4) The <code>label=</code> uses raw-string LaTeX (<code>r"..."</code> + <code>$...$</code>) so the legend renders sin(x) and e to the minus x over 8 with proper math typography.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">color</div><div class="card-body">Accepts any of: named (<code>"red"</code>), hex (<code>"#c8a96e"</code>), rgb tuple (<code>(0.78, 0.66, 0.43)</code>), or one-letter shortcuts (<code>"r"</code>, <code>"b"</code>).</div></div>
<div class="calc-card"><div class="card-title">linestyle</div><div class="card-body"><code>"-"</code> solid, <code>"--"</code> dashed, <code>"-."</code> dash-dot, <code>":"</code> dotted. Use <code>linestyle=""</code> for markers only.</div></div>
<div class="calc-card"><div class="card-title">linewidth</div><div class="card-body">In points. Default 1.5; use 2.0-2.5 for slides, 1.0-1.5 for paper figures so they do not over-bold next to text.</div></div>
<div class="calc-card"><div class="card-title">marker</div><div class="card-body"><code>"o"</code> circle, <code>"s"</code> square, <code>"^"</code> triangle, <code>"D"</code> diamond, <code>"x"</code> cross, <code>"*"</code> star. <code>"None"</code> hides them.</div></div>
<div class="calc-card"><div class="card-title">alpha</div><div class="card-body">0 transparent, 1 opaque. Use 0.6-0.8 when many lines overlap, so the eye can see overlap density.</div></div>
<div class="calc-card"><div class="card-title">label</div><div class="card-body">String shown in the legend (after <code>ax.legend()</code> is called). Wrap in raw-string + dollar signs for LaTeX math.</div></div>
</div>

<div class="l-note"><strong>Shorthand format strings:</strong> Matplotlib also accepts MATLAB-style format strings like <code>ax.plot(x, y, "g--o")</code>, which means green dashed line with circle markers. Cute for one-offs, but unreadable in long code -- prefer the explicit kwargs above.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Multiple Lines on the Same Axes</h2>

<p class="l-text">Showing two or three series side by side is the most common ML plot: train vs validation, baseline vs proposed, three different learning rates. Each call to <code>ax.plot</code> stacks one more line on the same Axes -- and Matplotlib auto-cycles through colours so adjacent lines never look identical.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

epochs = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">31</span>)
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Three runs with different learning rates</span>
lr_high = <span class="num">0.6</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">4</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">30</span>)
lr_mid  = <span class="num">0.6</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">8</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">30</span>)
lr_low  = <span class="num">0.6</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">16</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">30</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8.5</span>, <span class="num">5</span>))

ax.<span class="fn">plot</span>(epochs, lr_high, marker=<span class="str">"o"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"lr = 1e-2"</span>)
ax.<span class="fn">plot</span>(epochs, lr_mid,  marker=<span class="str">"s"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"lr = 1e-3"</span>)
ax.<span class="fn">plot</span>(epochs, lr_low,  marker=<span class="str">"^"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"lr = 1e-4"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"epoch"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"training loss"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Effect of learning rate on convergence speed"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"best"</span>, framealpha=<span class="num">0.9</span>)   <span class="cm"># auto-pick least-overlap location</span>
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds three synthetic loss curves that decay at different rates -- mimicking a real ML experiment where you sweep over learning rates. The high LR converges fast but might miss the minimum, the low LR is slow but stable, the middle is the sweet spot. 2) Three <code>ax.plot</code> calls draw all three on the same axes. We did NOT specify a <code>color</code> -- Matplotlib's default colour cycle (the "tab10" palette) auto-assigns blue, orange, green so neighbouring lines are easy to tell apart. 3) Each call uses a different <code>marker</code>: o, s, ^ -- this gives a second visual channel beyond colour, which is critical for colour-blind readers and for printed black-and-white papers. 4) <code>ax.legend(loc="best")</code> evaluates a few candidate positions and picks the one with least data overlap. 5) <code>framealpha=0.9</code> gives the legend box a slightly transparent background so it floats over the plot without obscuring data.</p>

<div id="plot-mpl-l2-multi-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A Plotly mirror of three convergence curves at different learning rates. The high LR (dark blue) drops fast but plateaus high; the low LR (green) is steady but slow; the middle LR (orange) reaches the lowest loss in a reasonable time. This is the canonical "LR sweep" plot every ML paper has at least once. Notice how marker shape supplements colour -- you can identify each curve even in grayscale.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: when to use marker vs no marker</div><div class="example-body">Use markers when each x value is a discrete observation (epochs, sample IDs). Skip markers when x is continuous and dense (e.g. 1000 noisy time-series points where markers would clutter the line). Rule of thumb: under 50 points, add markers; over 200 points, skip them.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Legend: Position, Frame, Multi-Column</h2>

<p class="l-text">A legend is read more times than the figure title. Spending 30 seconds on legend positioning often makes a plot twice as readable. Matplotlib gives you fine control via <code>ax.legend(...)</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">6.28</span>, <span class="num">200</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))

<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]:
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(k * x) / k,
            linewidth=<span class="num">2</span>,
            label=f<span class="str">"k = {k}"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(k x) / k"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Fourier-style series with five harmonics"</span>)

<span class="cm"># A polished legend</span>
ax.<span class="fn">legend</span>(
    loc=<span class="str">"upper right"</span>,       <span class="cm"># 'best','upper left','center', or coord tuple</span>
    ncol=<span class="num">2</span>,                  <span class="cm"># split into 2 columns</span>
    framealpha=<span class="num">0.9</span>,          <span class="cm"># box transparency</span>
    edgecolor=<span class="str">"0.8"</span>,         <span class="cm"># box border</span>
    fontsize=<span class="num">10</span>,
    title=<span class="str">"harmonic"</span>,
    title_fontsize=<span class="num">11</span>
)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds 200 x values across one period and loops over harmonics k = 1..5. Each iteration adds a sin(kx)/k curve -- this is exactly the Fourier series construction of a square wave. 2) Each <code>ax.plot</code> uses an f-string label like "k = 3"; Matplotlib auto-picks colours from the cycle. 3) <code>ax.legend</code> with a rich kwarg set: <code>loc="upper right"</code> pins the legend's anchor; <code>ncol=2</code> splits the five entries into two columns to save vertical space; <code>framealpha=0.9</code> gives a slightly transparent white box; <code>edgecolor="0.8"</code> uses a light grey border (a single number 0..1 maps to a gray level); <code>title="harmonic"</code> adds a header above the entries. 4) For very crowded plots, you can also pass <code>bbox_to_anchor=(1.02, 1)</code> to push the legend OUTSIDE the axes -- super useful when nothing inside the plot has free space.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">loc</div><div class="card-body">Strings: <code>"best"</code>, <code>"upper right"</code>, <code>"center left"</code>, etc. Or numeric codes 0..10.</div></div>
<div class="calc-card"><div class="card-title">bbox_to_anchor</div><div class="card-body">Tuple <code>(x, y)</code> in axes coordinates (0..1). <code>(1.02, 1)</code> places the legend just outside the right edge.</div></div>
<div class="calc-card"><div class="card-title">ncol</div><div class="card-body">Number of columns. Use 2 or 3 when you have many entries.</div></div>
<div class="calc-card"><div class="card-title">framealpha / edgecolor</div><div class="card-body">Background transparency and border colour of the legend box.</div></div>
<div class="calc-card"><div class="card-title">fontsize / title_fontsize</div><div class="card-body">Independent control of entry text and the legend's own title.</div></div>
<div class="calc-card"><div class="card-title">handlelength / handletextpad</div><div class="card-body">Control the size of the line/marker swatch and its distance to the label text. Subtle but tightens dense legends.</div></div>
</div>

<div class="l-warn"><strong>Common bug:</strong> if your legend appears empty, you forgot the <code>label=</code> kwarg on the <code>plot</code> call. The legend reads only from labelled artists. Conversely, if a plot call has no label and you do not want it in the legend, you do not need to do anything -- unlabelled artists are skipped automatically.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Colours: Named, Hex, Cycles, Colormaps</h2>

<p class="l-text">Colour choice is more than aesthetics -- it carries semantic information (e.g. "red = bad"), aids accessibility (colour-blind safe palettes), and respects greyscale printing. Matplotlib supports five different colour specifications.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">100</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))

<span class="cm"># 1. Named colours (148 CSS colour names supported)</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">4</span>, color=<span class="str">"crimson"</span>,       label=<span class="str">"named: crimson"</span>)

<span class="cm"># 2. Hex strings (web designer style)</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">3</span>, color=<span class="str">"#4ecdc4"</span>,       label=<span class="str">"hex: #4ecdc4"</span>)

<span class="cm"># 3. RGB tuples in [0, 1] range</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">2</span>, color=(<span class="num">0.78</span>, <span class="num">0.66</span>, <span class="num">0.43</span>), label=<span class="str">"rgb tuple"</span>)

<span class="cm"># 4. Single letter shortcuts: r g b c m y k w</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">1</span>, color=<span class="str">"m"</span>,             label=<span class="str">"shortcut: m (magenta)"</span>)

<span class="cm"># 5. From a colormap by index</span>
cmap = plt.<span class="fn">get_cmap</span>(<span class="str">"viridis"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">0</span>, color=<span class="fn">cmap</span>(<span class="num">0.7</span>),       label=<span class="str">"cmap viridis at 0.7"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(x) + offset"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Five ways to specify a colour in Matplotlib"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>, ncol=<span class="num">2</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Plots five identical sine waves vertically offset by 0..4 so they do not overlap. 2) Each line uses a different colour specification: a CSS-style named colour (<code>"crimson"</code>), a hex string (web standard <code>#rrggbb</code>), an RGB tuple where each channel is in [0, 1] (NOT 0..255 as in CSS), a one-letter shortcut (8 such shortcuts exist), and a sample drawn from a colormap by passing a float in [0, 1] -- 0 picks the start colour of the map, 1 picks the end. 3) <code>plt.get_cmap("viridis")</code> retrieves the famous viridis perceptually-uniform colormap; <code>cmap(0.7)</code> samples it 70% along, returning an RGBA tuple. 4) The legend with <code>ncol=2</code> shows all five swatches side by side.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Named</div><div class="card-body">148 CSS names: <code>"red"</code>, <code>"crimson"</code>, <code>"steelblue"</code>, <code>"forestgreen"</code>. Readable in code, slow to remember exact shades.</div></div>
<div class="calc-card"><div class="card-title">Hex</div><div class="card-body"><code>"#c8a96e"</code> -- six hex digits = three bytes (R, G, B). Web-designer standard. Pixel-precise.</div></div>
<div class="calc-card"><div class="card-title">RGB tuple</div><div class="card-body"><code>(0.78, 0.66, 0.43)</code>. Each value is 0..1 (NOT 0..255). Add a fourth value for alpha: <code>(r, g, b, a)</code>.</div></div>
<div class="calc-card"><div class="card-title">Shortcuts</div><div class="card-body">One letter: <code>r g b c m y k w</code>. Cute but limited. Avoid in serious code.</div></div>
<div class="calc-card"><div class="card-title">Colormap sample</div><div class="card-body"><code>cmap(0.7)</code> picks one colour from a continuous palette. Use to sweep colours across a numeric variable.</div></div>
<div class="calc-card"><div class="card-title">Greyscale</div><div class="card-body"><code>color="0.6"</code> -- a single number 0..1 maps to a gray level. <code>"0"</code> is black, <code>"1"</code> is white.</div></div>
</div>

<div class="l-note"><strong>Default colour cycle:</strong> when you do not specify <code>color=</code>, Matplotlib pulls from the "tab10" cycle: blue, orange, green, red, purple, brown, pink, gray, olive, cyan. After 10 lines it wraps. To use a different cycle, set <code>plt.rcParams["axes.prop_cycle"] = cycler(color=["#c8a96e","#4ecdc4","#f87171"])</code>.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Style Sheets: ggplot, seaborn, dark</h2>

<p class="l-text">Matplotlib ships with a few dozen pre-made style sheets that change every default at once -- background colour, grid behaviour, font, marker shape -- so you can swap an entire visual identity in one line. This is the fastest way to make a plot look professional.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># List all available styles</span>
<span class="fn">print</span>(plt.style.available[:<span class="num">10</span>])
<span class="cm"># ['Solarize_Light2', '_classic_test_patch',</span>
<span class="cm">#  'bmh', 'classic', 'dark_background',</span>
<span class="cm">#  'fast', 'fivethirtyeight', 'ggplot',</span>
<span class="cm">#  'grayscale', 'seaborn-v0_8']</span>

<span class="cm"># Apply a style globally for everything that follows</span>
plt.style.<span class="fn">use</span>(<span class="str">"ggplot"</span>)

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">100</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), label=<span class="str">"sin(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x), label=<span class="str">"cos(x)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"ggplot style: pinkish background, white grid"</span>)
ax.<span class="fn">legend</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Use a style temporarily, only inside the with-block</span>
<span class="kw">with</span> plt.style.<span class="fn">context</span>(<span class="str">"dark_background"</span>):
    fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), color=<span class="str">"#c8a96e"</span>, label=<span class="str">"sin(x)"</span>)
    ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x), color=<span class="str">"#4ecdc4"</span>, label=<span class="str">"cos(x)"</span>)
    ax.<span class="fn">set_title</span>(<span class="str">"dark_background: black, light text"</span>)
    ax.<span class="fn">legend</span>()
    plt.<span class="fn">show</span>()
<span class="cm"># Once the with-block ends, defaults are restored</span>

<span class="cm"># Reset to default</span>
plt.style.<span class="fn">use</span>(<span class="str">"default"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plt.style.available</code> returns a list of every installed style name -- you can pick any one. 2) <code>plt.style.use("ggplot")</code> permanently switches the rcParams for this Python process; every subsequent figure inherits the ggplot look (cream background, light pink axes, white grid). 3) The first <code>fig, ax</code> uses ggplot defaults -- you did not write a single colour or grid command. 4) <code>plt.style.context("dark_background")</code> is a context manager: inside the <code>with</code> block, the dark style is active; outside, the previous style is restored. This is perfect for a single dark figure inside a light report. 5) <code>plt.style.use("default")</code> at the end resets to Matplotlib's vanilla defaults.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ggplot</div><div class="card-body">Imitates R's ggplot2 -- cream background, pinkish axes, white grid. Friendly and a bit dated.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8</div><div class="card-body">Clean light-grey background, soft palette. Used by the seaborn library. The most "modern" default.</div></div>
<div class="calc-card"><div class="card-title">dark_background</div><div class="card-body">Black background, white text. Good for slides on dark themes; bad for printed papers.</div></div>
<div class="calc-card"><div class="card-title">fivethirtyeight</div><div class="card-body">Bold, journalistic look. Thick lines, large fonts. Recognisable but loud.</div></div>
<div class="calc-card"><div class="card-title">bmh</div><div class="card-body">"Bayesian Methods for Hackers" book style. Subtle, scientific, often a good thesis default.</div></div>
<div class="calc-card"><div class="card-title">grayscale</div><div class="card-body">Black, white, and shades of grey. Forces you to use linestyle and marker shape to differentiate -- great discipline.</div></div>
</div>

<div id="plot-mpl-l2-styles-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A Plotly mirror of three styles compared side by side -- default, ggplot-like, dark. Background colour, grid colour, and palette all change together. Picking a style is the cheapest and most reliable way to make a figure look intentional. For a thesis, "seaborn-v0_8" or "bmh" are usually the safest defaults.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis workflow</div><div class="example-body">Pick one style at the top of every notebook (<code>plt.style.use("seaborn-v0_8")</code>) and stick with it for the entire document. Mixing styles between figures looks unprofessional. Save your custom rcParams in a file <code>thesis.mplstyle</code> and load it via <code>plt.style.use("./thesis.mplstyle")</code> -- L5 covers this in depth.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LaTeX Math in Labels and Titles</h2>

<p class="l-text">For a thesis, paper, or any technical writing, your axis labels and legends must contain real maths -- alpha, beta, integrals, fractions, subscripts, Greek letters. Matplotlib has built-in mathtext that renders LaTeX-style markup without any external LaTeX installation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0.1</span>, <span class="num">4</span>, <span class="num">200</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))

<span class="cm"># Each label is a raw string r"..." with LaTeX between $...$</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x),     linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = e^{-x}$"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x**<span class="num">2</span>),  linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = e^{-x^{2}}$"</span>)
ax.<span class="fn">plot</span>(x, <span class="num">1</span> / (<span class="num">1</span> + x**<span class="num">2</span>), linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = \\frac{1}{1 + x^{2}}$"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">log</span>(<span class="num">1</span> + x),  linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = \\ln(1 + x)$"</span>)

ax.<span class="fn">set_xlabel</span>(r<span class="str">"$x$"</span>)
ax.<span class="fn">set_ylabel</span>(r<span class="str">"$f(x)$"</span>)
ax.<span class="fn">set_title</span>(r<span class="str">"Four common decay shapes: $\\alpha$, $\\beta$, $\\gamma$ regimes"</span>)

<span class="cm"># Math also works in annotations and tick labels</span>
ax.<span class="fn">annotate</span>(r<span class="str">"peak at $x = 0$"</span>,
            xy=(<span class="num">0.1</span>, <span class="num">1.0</span>), xytext=(<span class="num">1.2</span>, <span class="num">0.85</span>),
            arrowprops=<span class="fn">dict</span>(arrowstyle=<span class="str">"-&gt;"</span>, color=<span class="str">"gray"</span>),
            fontsize=<span class="num">11</span>)

ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>, fontsize=<span class="num">11</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds 200 x values in [0.1, 4] -- starting away from 0 to avoid log(0). 2) Plots four classic decay functions: e^-x, e^-x^2 (Gaussian-shaped), 1/(1+x^2) (Cauchy-like), and ln(1+x) (slow growth). 3) Each <code>label=</code> is a raw Python string <code>r"..."</code> so backslashes are literal, with LaTeX wrapped in <code>$...$</code>: <code>e^{-x}</code> renders as e to the minus x, <code>\\frac{1}{1+x^2}</code> renders as a vertical fraction, <code>\\ln</code> renders as the proper log operator. 4) <code>set_xlabel</code> and <code>set_ylabel</code> use bare <code>$x$</code> and <code>$f(x)$</code> for italicised math letters -- different from non-italic plain text. 5) The title mixes plain words with three Greek letters: <code>$\\alpha$</code>, <code>$\\beta$</code>, <code>$\\gamma$</code>. 6) <code>ax.annotate</code> places "peak at x = 0" with an arrow pointing to the leftmost point; the label itself contains math.</p>

<div class="katex-block">$$f(x) = \\frac{1}{1 + x^{2}}$$</div>

<p class="l-text">This is the formula rendered above (in the lesson HTML) -- the same syntax goes inside Matplotlib labels. Note that in Python you must DOUBLE-backslash inside regular strings (or use raw strings <code>r"..."</code>), because <code>\\f</code> is interpreted as a form-feed character.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$x^{2}$</div><div class="card-body">Superscript. Use braces for multi-character: <code>$x^{ab}$</code>. Without braces only the next character is raised.</div></div>
<div class="calc-card"><div class="card-title">$x_{i}$</div><div class="card-body">Subscript. Same brace rule. <code>$x_i$</code> works for one char too.</div></div>
<div class="calc-card"><div class="card-title">$\\frac{a}{b}$</div><div class="card-body">Fraction. Stacks numerator over denominator with a horizontal bar.</div></div>
<div class="calc-card"><div class="card-title">$\\sqrt{x}$</div><div class="card-body">Square root. <code>$\\sqrt[3]{x}$</code> for cube root.</div></div>
<div class="calc-card"><div class="card-title">$\\sum_{i=1}^{n}$</div><div class="card-body">Summation with limits. <code>$\\int_{0}^{1}$</code> for integrals. Just like real LaTeX.</div></div>
<div class="calc-card"><div class="card-title">$\\alpha, \\beta, \\gamma$</div><div class="card-body">Greek letters via backslash names. <code>$\\Alpha$</code> for capitals. Full LaTeX list works.</div></div>
</div>

<div class="l-warn"><strong>Common pitfall:</strong> if your label shows literal text "f(x) = \\frac{1}{2}" instead of a fraction, you forgot to wrap in <code>$...$</code>. Mathtext only activates between dollar signs. Outside them, characters are typeset as plain text.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Putting It Together: A Polished Loss Curve</h2>

<p class="l-text">Combining everything from this lesson, here is the kind of figure you would put in a paper or thesis. It uses an explicit style, a custom colour palette, multiple lines, well-positioned legend, LaTeX labels, and a touch of annotation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

plt.style.<span class="fn">use</span>(<span class="str">"seaborn-v0_8"</span>)   <span class="cm"># one-line theme</span>

epochs = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">51</span>)
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)

<span class="cm"># Three optimisers</span>
sgd      = <span class="num">1.2</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">18</span>) + <span class="num">0.05</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">50</span>)
momentum = <span class="num">1.2</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">11</span>) + <span class="num">0.04</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">50</span>)
adam     = <span class="num">1.2</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">7</span>)  + <span class="num">0.03</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">50</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5.5</span>))

palette = [<span class="str">"#c8a96e"</span>, <span class="str">"#4ecdc4"</span>, <span class="str">"#f87171"</span>]
labels  = [<span class="str">"SGD"</span>, <span class="str">"SGD + momentum"</span>, <span class="str">"Adam"</span>]
markers = [<span class="str">"o"</span>, <span class="str">"s"</span>, <span class="str">"^"</span>]

<span class="kw">for</span> run, color, label, marker <span class="kw">in</span> <span class="fn">zip</span>([sgd, momentum, adam], palette, labels, markers):
    ax.<span class="fn">plot</span>(epochs, run, color=color, marker=marker,
            markersize=<span class="num">5</span>, markevery=<span class="num">4</span>, linewidth=<span class="num">2</span>, label=label, alpha=<span class="num">0.95</span>)

<span class="cm"># Highlight the convergence epoch for Adam</span>
adam_conv = <span class="fn">int</span>(np.<span class="fn">argmin</span>(np.<span class="fn">abs</span>(adam - <span class="num">0.10</span>))) + <span class="num">1</span>
ax.<span class="fn">axvline</span>(adam_conv, color=<span class="str">"#f87171"</span>, linestyle=<span class="str">"--"</span>, alpha=<span class="num">0.5</span>)
ax.<span class="fn">annotate</span>(rf<span class="str">"Adam reaches 0.10 at epoch {adam_conv}"</span>,
            xy=(adam_conv, <span class="num">0.10</span>), xytext=(adam_conv + <span class="num">5</span>, <span class="num">0.55</span>),
            arrowprops=<span class="fn">dict</span>(arrowstyle=<span class="str">"-&gt;"</span>, color=<span class="str">"gray"</span>),
            fontsize=<span class="num">10</span>)

ax.<span class="fn">set_xlabel</span>(r<span class="str">"epoch"</span>)
ax.<span class="fn">set_ylabel</span>(r<span class="str">"validation loss $\\mathcal{L}$"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Convergence speed of three optimisers (50 epochs, seed 42)"</span>)
ax.<span class="fn">set_yscale</span>(<span class="str">"log"</span>)           <span class="cm"># log y is standard for loss</span>
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>, framealpha=<span class="num">0.9</span>, edgecolor=<span class="str">"0.7"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, which=<span class="str">"both"</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plt.style.use("seaborn-v0_8")</code> sets a clean modern theme as the default for everything below. 2) Three synthetic loss curves represent SGD (slow), SGD+momentum (medium), Adam (fast) -- the textbook ordering. 3) The <code>for</code>-loop with <code>zip</code> draws all three with their own colour, marker shape, and label in five lines instead of three repeated <code>plot</code> calls. 4) <code>markevery=4</code> draws a marker every 4 points so that with 50 points we see ~12 markers, not 50 (which would clutter). 5) <code>ax.axvline(adam_conv, ...)</code> drops a dashed vertical reference line at the epoch where Adam first crossed 0.10. 6) <code>ax.annotate</code> with arrowprops places a small floating note that points to a specific data feature -- this is how you guide the reader's eye in a busy plot. 7) <code>set_yscale("log")</code> uses a logarithmic y-axis -- standard for losses because the interesting differences happen near zero. 8) The <code>which="both"</code> grid argument turns on both major and minor gridlines, which is appropriate on a log scale.</p>

<div id="plot-mpl-l2-polished-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A Plotly mirror of the polished Matplotlib loss curve. Three optimisers overlaid on a log-y axis, each with its own colour and marker, plus an annotated reference line. This is roughly the level of polish a thesis figure or a top-conference paper figure should hit. Notice that you can read this plot in greyscale and still tell the curves apart -- because marker shape carries information independent of colour.</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why a log y-axis for losses? Because most of the interesting decay happens in the first few epochs, after which the loss is small but still meaningfully decreasing. On a linear axis, a curve dropping from 1.2 to 0.1 looks like the optimiser is "done"; on a log axis, you see the same curve continue to descend through 0.1 to 0.05 to 0.02. Log scale lets you see proportional progress -- exactly what matters for convergence.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-up & Mini Cheatsheet</h2>

<p class="l-text">Eight kwargs to remember, four positions for the legend, three styles for paper/slides, one LaTeX rule.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">color, linewidth, linestyle</div><div class="card-body">The three "line geometry" kwargs. Hex strings give you precision, named gives you readability.</div></div>
<div class="calc-card"><div class="card-title">marker, markersize, markevery</div><div class="card-body">The three "marker geometry" kwargs. Use <code>markevery</code> on dense series so markers do not turn into a brick wall.</div></div>
<div class="calc-card"><div class="card-title">label + ax.legend()</div><div class="card-body">Pair: every line that should appear in the legend needs a <code>label=</code>; <code>ax.legend()</code> renders it. Skip a label, skip the legend entry.</div></div>
<div class="calc-card"><div class="card-title">plt.style.use(...)</div><div class="card-body">One line, total visual makeover. <code>"seaborn-v0_8"</code> for clean modern, <code>"bmh"</code> for thesis, <code>"dark_background"</code> for slides.</div></div>
<div class="calc-card"><div class="card-title">r"$\\alpha$"</div><div class="card-body">LaTeX inside labels: raw string + dollar signs. Greek letters, fractions, subscripts -- all work.</div></div>
<div class="calc-card"><div class="card-title">ax.set_yscale("log")</div><div class="card-body">Log axis for losses, populations, anything spanning orders of magnitude. Pair with <code>which="both"</code> grid.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> <code>ax.plot</code> takes ~10 styling kwargs. Mastering them = mastering 80% of Matplotlib aesthetics.<br><strong>2.</strong> Multiple <code>plot</code> calls stack on the same axes. Matplotlib auto-cycles colours; use marker shape as a second channel for greyscale-friendly figures.<br><strong>3.</strong> <code>ax.legend(loc="best", ncol=2, framealpha=0.9)</code> is your default. Use <code>bbox_to_anchor</code> to push it outside.<br><strong>4.</strong> Five colour spec ways: named, hex, rgb tuple, shortcut, colormap sample. Hex is most precise; named is most readable.<br><strong>5.</strong> Style sheets (<code>plt.style.use</code>) are a one-line beautification. Use the same style for every figure in a document.<br><strong>6.</strong> LaTeX in labels: raw string + <code>$...$</code>. <code>r"$\\alpha = \\frac{1}{2}$"</code>. Required for any technical writing.<br><strong>7.</strong> Log y-scale for losses; linear y-scale for accuracies/probabilities. Match the scale to the quantity.<br><strong>8.</strong> Polish = style sheet + custom palette + markers + LaTeX labels + an arrow annotation pointing to the punchline. That is the recipe for a paper figure.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};

  // multi-line LR sweep
  function multi(id, title, xl, yl, l1, l2, l3){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], h=[], m=[], lo=[]; var seed=0;
    function r(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=1;i<=30;i++){ep.push(i);h.push(0.6*Math.exp(-i/4)+r()*0.04);m.push(0.6*Math.exp(-i/8)+r()*0.04);lo.push(0.6*Math.exp(-i/16)+r()*0.04);}
    var t1 = {x:ep,y:h,mode:'lines+markers',type:'scatter',line:{color:'#5b8def',width:2},marker:{color:'#5b8def',size:6},name:l1};
    var t2 = {x:ep,y:m,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:6,symbol:'square'},name:l2};
    var t3 = {x:ep,y:lo,mode:'lines+markers',type:'scatter',line:{color:'#4ecdc4',width:2},marker:{color:'#4ecdc4',size:6,symbol:'triangle-up'},name:l3};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  multi('plot-mpl-l2-multi-en','Effect of learning rate on convergence','epoch','training loss','lr = 1e-2','lr = 1e-3','lr = 1e-4');
  multi('plot-mpl-l2-multi-tr','Ogrenme oraninin yakinsamaya etkisi','epok','egitim kaybi','lr = 1e-2','lr = 1e-3','lr = 1e-4');

  // styles compare (3 small lines)
  function styles(id, title){
    var el = document.getElementById(id); if(!el) return;
    var x=[]; for (var i=0;i<60;i++) x.push(i*0.2);
    var s1=[], s2=[], s3=[];
    for (var i=0;i<60;i++){var v=Math.sin(x[i]);s1.push(v+3);s2.push(v+1.5);s3.push(v);}
    var t1 = {x:x,y:s1,mode:'lines',type:'scatter',line:{color:T.accent,width:2.5},name:'default'};
    var t2 = {x:x,y:s2,mode:'lines',type:'scatter',line:{color:'#f87171',width:2.5},name:'ggplot-like'};
    var t3 = {x:x,y:s3,mode:'lines',type:'scatter',line:{color:'#4ecdc4',width:2.5},name:'dark / accent'};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'sin(x) + offset',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  styles('plot-mpl-l2-styles-en','Three style sheets: same data, different identity');
  styles('plot-mpl-l2-styles-tr','Uc stil sayfasi: ayni veri, farkli kimlik');

  // polished loss
  function polished(id, title, xl, yl, l1, l2, l3, ann){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], a=[], b=[], c=[]; var seed=42;
    function r(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=1;i<=50;i++){ep.push(i);a.push(1.2*Math.exp(-i/18)+0.05+r()*0.04);b.push(1.2*Math.exp(-i/11)+0.04+r()*0.04);c.push(1.2*Math.exp(-i/7)+0.03+r()*0.04);}
    var t1 = {x:ep,y:a,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:5,symbol:'circle'},name:l1};
    var t2 = {x:ep,y:b,mode:'lines+markers',type:'scatter',line:{color:'#4ecdc4',width:2},marker:{color:'#4ecdc4',size:5,symbol:'square'},name:l2};
    var t3 = {x:ep,y:c,mode:'lines+markers',type:'scatter',line:{color:'#f87171',width:2},marker:{color:'#f87171',size:5,symbol:'triangle-up'},name:l3};
    var conv = 0; for (var i=0;i<c.length;i++){if(c[i]<=0.10){conv=i+1;break;}}
    var vline = {type:'line',x0:conv,x1:conv,y0:0.02,y1:1.5,xref:'x',yref:'y',line:{color:'#f87171',width:1.5,dash:'dash'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero,type:'log'},
      legend:{font:{color:T.text}},
      shapes:[vline],
      annotations:[{x:conv,y:0.10,xref:'x',yref:'y',text:ann+conv,showarrow:true,arrowhead:2,ax:60,ay:-30,arrowcolor:T.text,font:{color:T.text,size:11}}]
    });
    Plotly.newPlot(id,[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  polished('plot-mpl-l2-polished-en','Convergence of three optimisers (log y, 50 epochs)','epoch','validation loss','SGD','SGD + momentum','Adam','Adam reaches 0.10 at epoch ');
  polished('plot-mpl-l2-polished-tr','Uc optimize edicinin yakinsamasi (log y, 50 epok)','epok','dogrulama kaybi','SGD','SGD + momentum','Adam','Adam 0.10 a ulasiyor: epok ');
},250);</script>`,

tr: `<p class="l-text"><strong>Çizgi grafiği veri görselleştirmenin beygiridir.</strong> Kayıp eğrileri, zaman serileri, öğrenme oranları, tahmin vs gerçek, konuma göre dikkat ağırlıkları -- neredeyse her "X, Y değiştikçe nasıl değişiyor" sorusu bir çizgi grafiğine dönüşür. Bu derste <code>ax.plot</code>'a derinlemesine giriyoruz: önemli her parametre, sade bir çizgiyi yayına hazır bir figüre dönüştüren her stil hilesi ve Matplotlib'i tezler ve makaleler için vazgeçilmez kılan LaTeX formül desteği.</p>

<p class="l-text">Ders sonunda aynı eksen üzerinde mantıklı renkler ve işaretçilerle birden fazla çizgi çizebilecek, bir açıklamayı otomatik konumlandırabilecek, beş saniyelik bir güzelleştirme için hazır temaları (ggplot, seaborn) takabilecek ve eksen etiketlerine ve başlıklarına gerçek LaTeX formülleri gömebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Çizgi, scatter ve bar grafik çiz ve duruma göre doğru olanı seç</li><li>Marker, çizgi stili, renk ve alpha şeffaflığı ile grafikleri stilize et</li><li>Bir Axes'a birden fazla seri ekle ve net bir legend kur</li><li>Geniş aralıklı veya iki birimli veriyi göstermek için log skala ve twin axes kullan</li><li>Metin, ok ve gölgeli yamalarla noktaları ve bölgeleri etiketle</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ax.plot: Tam İmza</h2>

<p class="l-text">Çoğu insan <code>ax.plot(x, y)</code>'yi bilir. Ama fonksiyon, figürlerinizin görünümünü kontrol etmek için içselleştirmeniz gereken cömert bir avuç stil kwarg'ı alır. İşte standart, parametre zengin versiyon.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">50</span>)
y = np.<span class="fn">sin</span>(x) * np.<span class="fn">exp</span>(-x / <span class="num">8</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

ax.<span class="fn">plot</span>(
    x, y,
    color=<span class="str">"#c8a96e"</span>,         <span class="cm"># hex, isim veya rgb tuple</span>
    linestyle=<span class="str">"-"</span>,            <span class="cm"># '-', '--', '-.', ':', ya da '' (cizgisiz)</span>
    linewidth=<span class="num">2.5</span>,            <span class="cm"># punto cinsinden (1 pt = 1/72 inc)</span>
    marker=<span class="str">"o"</span>,               <span class="cm"># 'o', 's', '^', 'D', 'x', '*', vb.</span>
    markersize=<span class="num">6</span>,             <span class="cm"># isaretci capi</span>
    markerfacecolor=<span class="str">"white"</span>,  <span class="cm"># ic dolgu</span>
    markeredgecolor=<span class="str">"#c8a96e"</span>,<span class="cm"># kenar rengi</span>
    markeredgewidth=<span class="num">1.2</span>,
    alpha=<span class="num">0.9</span>,                <span class="cm"># seffaflik 0..1</span>
    label=r<span class="str">"$\\sin(x) \\cdot e^{-x/8}$"</span>
)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Sonumlu sinus: tum kwarglar tek cagride"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 0'dan 10'a 50 x değeri oluşturur ve sönümlü bir sinüs hesaplar -- genliği üstel olarak azalan bir sin dalgası. Bu şekil, kosinüs azalmalı bir öğrenme oranı zamanlaması veya sönen bir titreşimi yansıtır. 2) <code>plt.subplots</code> ile tuvali açar. 3) Tek <code>ax.plot</code> çağrısı her ortak stil kwarg'ını aynı anda kullanır: <code>color</code> çizgi rengini ayarlar (burada sıcak altın bir hex), <code>linestyle="-"</code> düz seçer (diğer seçenekler kesik, kesik-nokta, noktalı), <code>linewidth=2.5</code> çizgi kalınlığını puntoda ayarlar, <code>marker="o"</code> her veri noktasına dolu daire çizer, <code>markersize=6</code> çaplarını kontrol eder, <code>markerfacecolor="white"</code> içlerini boşaltır, <code>markeredgecolor</code> çizgiyle eşleşir, <code>alpha=0.9</code> hafif şeffaflık katar. 4) <code>label=</code> ham string LaTeX (<code>r"..."</code> + <code>$...$</code>) kullanır, böylece açıklamada sin(x) ve eksi x bölü 8'in üssü doğru matematik tipografisiyle render olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">color</div><div class="card-body">Şunları kabul eder: isim (<code>"red"</code>), hex (<code>"#c8a96e"</code>), rgb tuple (<code>(0.78, 0.66, 0.43)</code>) veya tek harf kısayollar (<code>"r"</code>, <code>"b"</code>).</div></div>
<div class="calc-card"><div class="card-title">linestyle</div><div class="card-body"><code>"-"</code> düz, <code>"--"</code> kesik, <code>"-."</code> kesik-nokta, <code>":"</code> noktalı. Yalnızca işaretçiler için <code>linestyle=""</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">linewidth</div><div class="card-body">Punto cinsinden. Varsayılan 1.5; slaytlarda 2.0-2.5, makale figürlerinde 1.0-1.5 kullanın ki metin yanında fazla kalın görünmesinler.</div></div>
<div class="calc-card"><div class="card-title">marker</div><div class="card-body"><code>"o"</code> daire, <code>"s"</code> kare, <code>"^"</code> üçgen, <code>"D"</code> elmas, <code>"x"</code> çarpı, <code>"*"</code> yıldız. <code>"None"</code> gizler.</div></div>
<div class="calc-card"><div class="card-title">alpha</div><div class="card-body">0 şeffaf, 1 opak. Birçok çizgi üst üste bindiğinde 0.6-0.8 kullanın, böylece göz çakışma yoğunluğunu görebilir.</div></div>
<div class="calc-card"><div class="card-title">label</div><div class="card-body"><code>ax.legend()</code> çağrıldıktan sonra açıklamada gösterilen string. LaTeX matematik için ham string + dolar işaretleriyle sarın.</div></div>
</div>

<div class="l-note"><strong>Kısayol format stringleri:</strong> Matplotlib ayrıca <code>ax.plot(x, y, "g--o")</code> gibi MATLAB tarzı format stringlerini de kabul eder, yani daire işaretçili yeşil kesik çizgi. Tek seferlikler için sevimli ama uzun kodda okunmaz -- yukarıdaki açık kwarg'ları tercih edin.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Aynı Axes Üzerinde Çoklu Çizgi</h2>

<p class="l-text">İki veya üç seriyi yan yana göstermek en yaygın ML grafiğidir: eğitim vs doğrulama, taban vs önerilen, üç farklı öğrenme oranı. Her <code>ax.plot</code> çağrısı aynı Axes'e bir çizgi daha yığar -- ve Matplotlib renkleri otomatik döndürür, böylece komşu çizgiler asla aynı görünmez.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

epoks = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">31</span>)
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Farkli ogrenme oranlariyla uc kosu</span>
yuksek = <span class="num">0.6</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">4</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">30</span>)
orta   = <span class="num">0.6</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">8</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">30</span>)
dusuk  = <span class="num">0.6</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">16</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">30</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8.5</span>, <span class="num">5</span>))

ax.<span class="fn">plot</span>(epoks, yuksek, marker=<span class="str">"o"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"lr = 1e-2"</span>)
ax.<span class="fn">plot</span>(epoks, orta,   marker=<span class="str">"s"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"lr = 1e-3"</span>)
ax.<span class="fn">plot</span>(epoks, dusuk,  marker=<span class="str">"^"</span>, linewidth=<span class="num">2</span>, label=<span class="str">"lr = 1e-4"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"epok"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"egitim kaybi"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Ogrenme oraninin yakinsama hizina etkisi"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"best"</span>, framealpha=<span class="num">0.9</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Farklı hızlarda azalan üç sentetik kayıp eğrisi oluşturur -- öğrenme oranlarında tarama yaptığınız gerçek bir ML deneyini taklit eder. Yüksek LR hızlı yakınsar ama minimumu kaçırabilir, düşük LR yavaş ama kararlıdır, orta optimum noktadır. 2) Üç <code>ax.plot</code> çağrısı hepsini aynı axes üzerine çizer. <code>color</code> belirtmedik -- Matplotlib'in varsayılan renk döngüsü ("tab10" paleti) otomatik olarak mavi, turuncu, yeşil atar, böylece komşu çizgiler kolayca ayırt edilir. 3) Her çağrı farklı bir <code>marker</code> kullanır: o, s, ^ -- bu, renk dışında ikinci bir görsel kanal sağlar, ki bu renk körü okuyucular ve siyah-beyaz basılı makaleler için kritiktir. 4) <code>ax.legend(loc="best")</code> birkaç aday konumu değerlendirir ve en az veri çakışması olanı seçer. 5) <code>framealpha=0.9</code> açıklama kutusuna hafif şeffaf bir arka plan verir, böylece veriyi gizlemeden grafiğin üzerinde yüzer.</p>

<div id="plot-mpl-l2-multi-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin özü:</strong> Farklı öğrenme oranlarında üç yakınsama eğrisinin Plotly aynası. Yüksek LR (koyu mavi) hızlı düşer ama yüksekte plato yapar; düşük LR (yeşil) sabit ama yavaştır; orta LR (turuncu) makul bir sürede en düşük kayba ulaşır. Bu, her ML makalesinin en az bir kez içerdiği standart "LR taraması" grafiğidir. İşaretçi şeklinin rengi nasıl tamamladığına dikkat edin -- gri tonlarda bile her eğriyi tanıyabilirsiniz.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: ne zaman işaretçi, ne zaman değil</div><div class="example-body">Her x değeri ayrık bir gözlem olduğunda işaretçi kullanın (epoklar, örnek ID'leri). x sürekli ve yoğunsa atlayın (ör. işaretçilerin karmaşa yaratacağı 1000 gürültülü zaman serisi noktası). Pratik kural: 50 noktanın altında işaretçi ekleyin; 200 noktanın üstünde atlayın.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Açıklama: Konum, Çerçeve, Çoklu Sütun</h2>

<p class="l-text">Bir açıklama, figür başlığından daha çok kez okunur. Açıklama konumlandırmaya 30 saniye harcamak çoğu zaman bir grafiği iki kat daha okunabilir yapar. Matplotlib size <code>ax.legend(...)</code> aracılığıyla ince kontrol verir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">6.28</span>, <span class="num">200</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))

<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]:
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(k * x) / k,
            linewidth=<span class="num">2</span>,
            label=f<span class="str">"k = {k}"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(k x) / k"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Bes harmonikli Fourier-tarzi seri"</span>)

<span class="cm"># Cilali bir aciklama</span>
ax.<span class="fn">legend</span>(
    loc=<span class="str">"upper right"</span>,
    ncol=<span class="num">2</span>,
    framealpha=<span class="num">0.9</span>,
    edgecolor=<span class="str">"0.8"</span>,
    fontsize=<span class="num">10</span>,
    title=<span class="str">"harmonik"</span>,
    title_fontsize=<span class="num">11</span>
)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Bir periyot boyunca 200 x değeri oluşturur ve harmonikler k = 1..5 üzerinde döner. Her yineleme bir sin(kx)/k eğrisi ekler -- bu tam olarak bir kare dalganın Fourier serisi inşasıdır. 2) Her <code>ax.plot</code> "k = 3" gibi bir f-string etiketi kullanır; Matplotlib renkleri döngüden otomatik seçer. 3) Zengin kwarg setiyle <code>ax.legend</code>: <code>loc="upper right"</code> açıklamanın çapasını sabitler; <code>ncol=2</code> beş girdiyi dikey alan tasarrufu için iki sütuna böler; <code>framealpha=0.9</code> hafif şeffaf beyaz bir kutu verir; <code>edgecolor="0.8"</code> açık gri kenar kullanır (tek bir sayı 0..1 bir gri seviyesine eşlenir); <code>title="harmonik"</code> girdilerin üstüne bir başlık ekler. 4) Çok kalabalık grafikler için <code>bbox_to_anchor=(1.02, 1)</code> da geçirebilirsiniz, bu açıklamayı eksenlerin DIŞINA iter -- grafiğin içinde boş alan yokken süper yararlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">loc</div><div class="card-body">Stringler: <code>"best"</code>, <code>"upper right"</code>, <code>"center left"</code>, vb. Veya 0..10 sayısal kodlar.</div></div>
<div class="calc-card"><div class="card-title">bbox_to_anchor</div><div class="card-body">Eksen koordinatlarında (0..1) <code>(x, y)</code> tuple'ı. <code>(1.02, 1)</code> açıklamayı sağ kenarın hemen dışına yerleştirir.</div></div>
<div class="calc-card"><div class="card-title">ncol</div><div class="card-body">Sütun sayısı. Çok girdiniz olduğunda 2 veya 3 kullanın.</div></div>
<div class="calc-card"><div class="card-title">framealpha / edgecolor</div><div class="card-body">Açıklama kutusunun arka plan şeffaflığı ve kenar rengi.</div></div>
<div class="calc-card"><div class="card-title">fontsize / title_fontsize</div><div class="card-body">Girdi metni ve açıklamanın kendi başlığının bağımsız kontrolü.</div></div>
<div class="calc-card"><div class="card-title">handlelength / handletextpad</div><div class="card-body">Çizgi/işaretçi örneğinin boyutunu ve etiket metnine olan mesafeyi kontrol eder. İnce ama yoğun açıklamaları sıkılaştırır.</div></div>
</div>

<div class="l-warn"><strong>Yaygın hata:</strong> Açıklamanız boş görünüyorsa, <code>plot</code> çağrısında <code>label=</code> kwarg'ını unuttunuz demektir. Açıklama yalnızca etiketli artist'lerden okur. Tersine, bir plot çağrısının etiketi yoksa ve onu açıklamada istemiyorsanız, hiçbir şey yapmanıza gerek yok -- etiketsiz artist'ler otomatik atlanır.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Renkler: İsim, Hex, Döngüler, Renk Haritaları</h2>

<p class="l-text">Renk seçimi estetikten fazlasıdır -- semantik bilgi taşır (ör. "kırmızı = kötü"), erişilebilirliğe yardımcı olur (renk körü güvenli paletler) ve gri tonlamalı baskıya saygı duyar. Matplotlib beş farklı renk belirtimini destekler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">100</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))

<span class="cm"># 1. Isimli renkler (148 CSS renk adi destekli)</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">4</span>, color=<span class="str">"crimson"</span>,       label=<span class="str">"isim: crimson"</span>)

<span class="cm"># 2. Hex stringleri (web tasarimci tarzi)</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">3</span>, color=<span class="str">"#4ecdc4"</span>,       label=<span class="str">"hex: #4ecdc4"</span>)

<span class="cm"># 3. [0, 1] araliginda RGB tuple'lari</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">2</span>, color=(<span class="num">0.78</span>, <span class="num">0.66</span>, <span class="num">0.43</span>), label=<span class="str">"rgb tuple"</span>)

<span class="cm"># 4. Tek harf kisayollar: r g b c m y k w</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">1</span>, color=<span class="str">"m"</span>,             label=<span class="str">"kisayol: m (magenta)"</span>)

<span class="cm"># 5. Renk haritasindan indeks ile</span>
cmap = plt.<span class="fn">get_cmap</span>(<span class="str">"viridis"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) + <span class="num">0</span>, color=<span class="fn">cmap</span>(<span class="num">0.7</span>),       label=<span class="str">"cmap viridis 0.7'de"</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(x) + ofset"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Matplotlib'de bir rengi belirtmenin bes yolu"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>, ncol=<span class="num">2</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 0..4 dikey ofsetlerle çakışmayan beş aynı sinüs dalgası çizer. 2) Her çizgi farklı bir renk belirtimi kullanır: bir CSS-tarzı isimli renk (<code>"crimson"</code>), bir hex string (web standardı <code>#rrggbb</code>), her kanalın [0, 1] aralığında olduğu bir RGB tuple (CSS'deki gibi 0..255 DEĞİL), tek harf kısayolu (8 tane var) ve bir colormap'ten [0, 1] aralığında bir float geçirilerek alınan örnek -- 0 haritanın başlangıç rengini seçer, 1 sonu seçer. 3) <code>plt.get_cmap("viridis")</code> ünlü algısal-tekdüze viridis colormap'ini alır; <code>cmap(0.7)</code> %70 boyunca örnekleyerek bir RGBA tuple döndürür. 4) <code>ncol=2</code> ile açıklama beş örneği yan yana gösterir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İsimli</div><div class="card-body">148 CSS adı: <code>"red"</code>, <code>"crimson"</code>, <code>"steelblue"</code>, <code>"forestgreen"</code>. Kodda okunaklı, tam tonu hatırlaması yavaş.</div></div>
<div class="calc-card"><div class="card-title">Hex</div><div class="card-body"><code>"#c8a96e"</code> -- altı hex hane = üç byte (R, G, B). Web tasarımcı standardı. Piksel hassasiyetli.</div></div>
<div class="calc-card"><div class="card-title">RGB tuple</div><div class="card-body"><code>(0.78, 0.66, 0.43)</code>. Her değer 0..1 (0..255 DEĞİL). Alpha için dördüncü değer ekleyin: <code>(r, g, b, a)</code>.</div></div>
<div class="calc-card"><div class="card-title">Kısayollar</div><div class="card-body">Tek harf: <code>r g b c m y k w</code>. Sevimli ama sınırlı. Ciddi kodda kullanmayın.</div></div>
<div class="calc-card"><div class="card-title">Colormap örneği</div><div class="card-body"><code>cmap(0.7)</code> sürekli bir paletten bir renk seçer. Sayısal bir değişken üzerinde renk taraması için kullanın.</div></div>
<div class="calc-card"><div class="card-title">Gri tonu</div><div class="card-body"><code>color="0.6"</code> -- tek bir sayı 0..1 bir gri seviyesine eşlenir. <code>"0"</code> siyah, <code>"1"</code> beyazdır.</div></div>
</div>

<div class="l-note"><strong>Varsayılan renk döngüsü:</strong> <code>color=</code> belirtmediğinizde Matplotlib "tab10" döngüsünden çeker: mavi, turuncu, yeşil, kırmızı, mor, kahverengi, pembe, gri, zeytin, camgöbeği. 10 çizgiden sonra başa döner. Farklı bir döngü kullanmak için <code>plt.rcParams["axes.prop_cycle"] = cycler(color=["#c8a96e","#4ecdc4","#f87171"])</code>.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Stil Sayfaları: ggplot, seaborn, dark</h2>

<p class="l-text">Matplotlib her varsayılanı aynı anda değiştiren onlarca hazır stil sayfasıyla gelir -- arka plan rengi, ızgara davranışı, font, işaretçi şekli -- böylece tüm görsel kimliği tek satırda değiştirebilirsiniz. Bu, bir grafiği profesyonel göstermenin en hızlı yoludur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Mevcut tum stilleri listele</span>
<span class="fn">print</span>(plt.style.available[:<span class="num">10</span>])

<span class="cm"># Bir stili global olarak uygula</span>
plt.style.<span class="fn">use</span>(<span class="str">"ggplot"</span>)

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">100</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), label=<span class="str">"sin(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x), label=<span class="str">"cos(x)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"ggplot stili: pembemsi arka plan, beyaz izgara"</span>)
ax.<span class="fn">legend</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Stili gecici olarak yalnizca with-blogu icinde kullan</span>
<span class="kw">with</span> plt.style.<span class="fn">context</span>(<span class="str">"dark_background"</span>):
    fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), color=<span class="str">"#c8a96e"</span>, label=<span class="str">"sin(x)"</span>)
    ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x), color=<span class="str">"#4ecdc4"</span>, label=<span class="str">"cos(x)"</span>)
    ax.<span class="fn">set_title</span>(<span class="str">"dark_background: siyah, acik metin"</span>)
    ax.<span class="fn">legend</span>()
    plt.<span class="fn">show</span>()
<span class="cm"># with-blogu bitince varsayilanlar geri yuklenir</span>

<span class="cm"># Varsayilanlara sifirla</span>
plt.style.<span class="fn">use</span>(<span class="str">"default"</span>)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>plt.style.available</code> kurulu her stil adının listesini döndürür -- herhangi birini seçebilirsiniz. 2) <code>plt.style.use("ggplot")</code> bu Python süreci için rcParams'ı kalıcı olarak değiştirir; sonraki her figür ggplot görünümünü miras alır (krem arka plan, açık pembe eksenler, beyaz ızgara). 3) İlk <code>fig, ax</code> ggplot varsayılanlarını kullanır -- tek bir renk veya ızgara komutu yazmadınız. 4) <code>plt.style.context("dark_background")</code> bir bağlam yöneticisidir: <code>with</code> bloğunun içinde karanlık stil aktiftir; dışarıda önceki stil geri yüklenir. Bu, açık bir raporun içinde tek bir karanlık figür için mükemmeldir. 5) Sondaki <code>plt.style.use("default")</code> Matplotlib'in vanilya varsayılanlarına döndürür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ggplot</div><div class="card-body">R'nin ggplot2'sini taklit eder -- krem arka plan, pembemsi eksenler, beyaz ızgara. Sıcak ve biraz tarihli.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8</div><div class="card-body">Temiz açık gri arka plan, yumuşak palet. Seaborn kütüphanesi tarafından kullanılır. En "modern" varsayılan.</div></div>
<div class="calc-card"><div class="card-title">dark_background</div><div class="card-body">Siyah arka plan, beyaz metin. Karanlık temalı slaytlar için iyi; basılı makaleler için kötü.</div></div>
<div class="calc-card"><div class="card-title">fivethirtyeight</div><div class="card-body">Cesur, gazetecilik görünümü. Kalın çizgiler, büyük fontlar. Tanınabilir ama yüksek sesli.</div></div>
<div class="calc-card"><div class="card-title">bmh</div><div class="card-body">"Bayesian Methods for Hackers" kitap stili. İnce, bilimsel, çoğu zaman iyi bir tez varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">grayscale</div><div class="card-body">Siyah, beyaz ve gri tonları. Ayırt etmek için linestyle ve marker şeklini kullanmaya zorlar -- harika disiplin.</div></div>
</div>

<div id="plot-mpl-l2-styles-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> Üç stilin yan yana karşılaştırılmış Plotly aynası -- varsayılan, ggplot-benzeri, koyu. Arka plan rengi, ızgara rengi ve palet hep birlikte değişir. Bir stil seçmek, bir figürü kasıtlı göstermenin en ucuz ve en güvenilir yoludur. Bir tez için "seaborn-v0_8" veya "bmh" genellikle en güvenli varsayılanlardır.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: tez iş akışı</div><div class="example-body">Her defterin tepesinde bir stil seçin (<code>plt.style.use("seaborn-v0_8")</code>) ve tüm belge boyunca ona sadık kalın. Figürler arasında stil karıştırmak profesyonelce görünmez. Özel rcParams'ınızı bir <code>tez.mplstyle</code> dosyasına kaydedin ve <code>plt.style.use("./tez.mplstyle")</code> ile yükleyin -- L5 bunu derinlemesine ele alır.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Etiketlerde ve Başlıklarda LaTeX Matematiği</h2>

<p class="l-text">Bir tez, makale veya herhangi bir teknik yazı için eksen etiketleriniz ve açıklamalarınız gerçek matematik içermelidir -- alfa, beta, integraller, kesirler, alt indisler, Yunan harfleri. Matplotlib, harici LaTeX kurulumu olmadan LaTeX-tarzı işaretlemeyi render eden yerleşik mathtext'e sahiptir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0.1</span>, <span class="num">4</span>, <span class="num">200</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))

<span class="cm"># Her etiket ham bir string r"..." ve LaTeX $...$ arasinda</span>
ax.<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x),     linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = e^{-x}$"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x**<span class="num">2</span>),  linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = e^{-x^{2}}$"</span>)
ax.<span class="fn">plot</span>(x, <span class="num">1</span> / (<span class="num">1</span> + x**<span class="num">2</span>), linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = \\frac{1}{1 + x^{2}}$"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">log</span>(<span class="num">1</span> + x),  linewidth=<span class="num">2</span>,
        label=r<span class="str">"$f(x) = \\ln(1 + x)$"</span>)

ax.<span class="fn">set_xlabel</span>(r<span class="str">"$x$"</span>)
ax.<span class="fn">set_ylabel</span>(r<span class="str">"$f(x)$"</span>)
ax.<span class="fn">set_title</span>(r<span class="str">"Dort yaygin azalma sekli: $\\alpha$, $\\beta$, $\\gamma$ rejimleri"</span>)

ax.<span class="fn">annotate</span>(r<span class="str">"x = 0 da tepe"</span>,
            xy=(<span class="num">0.1</span>, <span class="num">1.0</span>), xytext=(<span class="num">1.2</span>, <span class="num">0.85</span>),
            arrowprops=<span class="fn">dict</span>(arrowstyle=<span class="str">"-&gt;"</span>, color=<span class="str">"gray"</span>),
            fontsize=<span class="num">11</span>)

ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>, fontsize=<span class="num">11</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) [0.1, 4] aralığında 200 x değeri oluşturur -- log(0)'dan kaçınmak için 0'dan uzakta başlar. 2) Dört klasik azalma fonksiyonu çizer: e^-x, e^-x^2 (Gauss şeklinde), 1/(1+x^2) (Cauchy benzeri) ve ln(1+x) (yavaş büyüme). 3) Her <code>label=</code> ham bir Python stringidir <code>r"..."</code>, böylece ters eğik çizgiler değişmez kalır, ve LaTeX <code>$...$</code> içinde sarılıdır: <code>e^{-x}</code> e üzeri eksi x, <code>\\frac{1}{1+x^2}</code> dikey kesir, <code>\\ln</code> doğru log operatörü olarak render olur. 4) <code>set_xlabel</code> ve <code>set_ylabel</code> italik matematik harfleri için çıplak <code>$x$</code> ve <code>$f(x)$</code> kullanır -- italik olmayan düz metinden farklı. 5) Başlık düz kelimeleri üç Yunan harfiyle karıştırır: <code>$\\alpha$</code>, <code>$\\beta$</code>, <code>$\\gamma$</code>. 6) <code>ax.annotate</code> en soldaki noktaya işaret eden bir okla "x = 0 da tepe" yerleştirir; etiketin kendisi matematik içerir.</p>

<div class="katex-block">$$f(x) = \\frac{1}{1 + x^{2}}$$</div>

<p class="l-text">Yukarıda render edilen formül budur (ders HTML'inde) -- aynı sözdizimi Matplotlib etiketlerinin içine girer. Python'da normal stringlerin içinde ÇİFT-ters-eğik-çizgi kullanmanız gerektiğine dikkat edin (veya ham stringler <code>r"..."</code>), çünkü <code>\\f</code> form-feed karakteri olarak yorumlanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$x^{2}$</div><div class="card-body">Üst indis. Çok karakter için süslü parantez kullanın: <code>$x^{ab}$</code>. Parantez yoksa yalnızca sonraki karakter yükselir.</div></div>
<div class="calc-card"><div class="card-title">$x_{i}$</div><div class="card-body">Alt indis. Aynı parantez kuralı. Tek karakter için <code>$x_i$</code> de çalışır.</div></div>
<div class="calc-card"><div class="card-title">$\\frac{a}{b}$</div><div class="card-body">Kesir. Pay ve paydayı yatay çubukla üst üste yığar.</div></div>
<div class="calc-card"><div class="card-title">$\\sqrt{x}$</div><div class="card-body">Karekök. Küp kök için <code>$\\sqrt[3]{x}$</code>.</div></div>
<div class="calc-card"><div class="card-title">$\\sum_{i=1}^{n}$</div><div class="card-body">Sınırlarla toplam. İntegraller için <code>$\\int_{0}^{1}$</code>. Tıpkı gerçek LaTeX gibi.</div></div>
<div class="calc-card"><div class="card-title">$\\alpha, \\beta, \\gamma$</div><div class="card-body">Ters eğik çizgi adlarıyla Yunan harfleri. Büyükler için <code>$\\Alpha$</code>. Tüm LaTeX listesi çalışır.</div></div>
</div>

<div class="l-warn"><strong>Yaygın tuzak:</strong> Etiketiniz kesir yerine "f(x) = \\frac{1}{2}" değişmez metnini gösteriyorsa, <code>$...$</code> içine sarmayı unuttunuz. Mathtext yalnızca dolar işaretleri arasında etkinleşir. Dışarıda karakterler düz metin olarak dizgilenir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hepsini Bir Araya Getirme: Cilalı Bir Kayıp Eğrisi</h2>

<p class="l-text">Bu dersten her şeyi birleştirerek, bir makaleye veya teze koyacağınız türden bir figür. Açık bir stil, özel bir renk paleti, çoklu çizgiler, iyi konumlandırılmış açıklama, LaTeX etiketleri ve bir tutam not kullanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

plt.style.<span class="fn">use</span>(<span class="str">"seaborn-v0_8"</span>)

epoks = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">51</span>)
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)

sgd      = <span class="num">1.2</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">18</span>) + <span class="num">0.05</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">50</span>)
momentum = <span class="num">1.2</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">11</span>) + <span class="num">0.04</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">50</span>)
adam     = <span class="num">1.2</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">7</span>)  + <span class="num">0.03</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">50</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5.5</span>))

palet = [<span class="str">"#c8a96e"</span>, <span class="str">"#4ecdc4"</span>, <span class="str">"#f87171"</span>]
etk   = [<span class="str">"SGD"</span>, <span class="str">"SGD + momentum"</span>, <span class="str">"Adam"</span>]
mark  = [<span class="str">"o"</span>, <span class="str">"s"</span>, <span class="str">"^"</span>]

<span class="kw">for</span> kosu, c, e, m <span class="kw">in</span> <span class="fn">zip</span>([sgd, momentum, adam], palet, etk, mark):
    ax.<span class="fn">plot</span>(epoks, kosu, color=c, marker=m,
            markersize=<span class="num">5</span>, markevery=<span class="num">4</span>, linewidth=<span class="num">2</span>, label=e, alpha=<span class="num">0.95</span>)

adam_yak = <span class="fn">int</span>(np.<span class="fn">argmin</span>(np.<span class="fn">abs</span>(adam - <span class="num">0.10</span>))) + <span class="num">1</span>
ax.<span class="fn">axvline</span>(adam_yak, color=<span class="str">"#f87171"</span>, linestyle=<span class="str">"--"</span>, alpha=<span class="num">0.5</span>)
ax.<span class="fn">annotate</span>(rf<span class="str">"Adam 0.10 a ulasiyor: epok {adam_yak}"</span>,
            xy=(adam_yak, <span class="num">0.10</span>), xytext=(adam_yak + <span class="num">5</span>, <span class="num">0.55</span>),
            arrowprops=<span class="fn">dict</span>(arrowstyle=<span class="str">"-&gt;"</span>, color=<span class="str">"gray"</span>),
            fontsize=<span class="num">10</span>)

ax.<span class="fn">set_xlabel</span>(r<span class="str">"epok"</span>)
ax.<span class="fn">set_ylabel</span>(r<span class="str">"dogrulama kaybi $\\mathcal{L}$"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Uc optimize edicinin yakinsama hizi (50 epok, seed 42)"</span>)
ax.<span class="fn">set_yscale</span>(<span class="str">"log"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>, framealpha=<span class="num">0.9</span>, edgecolor=<span class="str">"0.7"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, which=<span class="str">"both"</span>, alpha=<span class="num">0.3</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>plt.style.use("seaborn-v0_8")</code> aşağıdaki her şey için varsayılan olarak temiz modern bir tema ayarlar. 2) Üç sentetik kayıp eğrisi SGD'yi (yavaş), SGD+momentum'u (orta), Adam'ı (hızlı) temsil eder -- ders kitabı sıralaması. 3) <code>zip</code> ile <code>for</code>-döngüsü hepsini kendi rengi, işaretçi şekli ve etiketiyle üç tekrarlanan <code>plot</code> çağrısı yerine beş satırda çizer. 4) <code>markevery=4</code> her 4 noktada bir işaretçi çizer, böylece 50 noktada ~12 işaretçi görürüz, 50 değil (ki bu karmaşa yapardı). 5) <code>ax.axvline(adam_yak, ...)</code> Adam'ın 0.10'u ilk geçtiği epoğa kesik bir dikey referans çizgisi düşürür. 6) <code>ax.annotate</code> arrowprops ile belirli bir veri özelliğine işaret eden küçük bir yüzen not yerleştirir -- yoğun bir grafikte okuyucunun gözünü yönlendirme şekli budur. 7) <code>set_yscale("log")</code> logaritmik y ekseni kullanır -- kayıplar için standarttır çünkü ilginç farklar sıfıra yakın gerçekleşir. 8) <code>which="both"</code> ızgara argümanı hem ana hem minör ızgara çizgilerini açar, ki bu log ölçeğinde uygundur.</p>

<div id="plot-mpl-l2-polished-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> Cilalı Matplotlib kayıp eğrisinin Plotly aynası. Log-y ekseninde üç optimize edici üst üste, her biri kendi renk ve işaretçisiyle, ayrıca etiketli bir referans çizgisi. Bu kabaca bir tez figürünün veya en iyi konferans makalesinin figürünün ulaşması gereken cila seviyesidir. Bu grafiği gri tonlarda da okuyabilir ve eğrileri yine ayırt edebilirsiniz -- çünkü işaretçi şekli renkten bağımsız bilgi taşır.</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Kayıplar için neden log y ekseni? Çünkü ilginç azalmanın çoğu ilk birkaç epokta gerçekleşir, sonrasında kayıp küçüktür ama yine de anlamlı şekilde azalır. Doğrusal eksende 1.2'den 0.1'e düşen bir eğri optimize edicinin "bittiğini" gösterir; log eksende aynı eğrinin 0.1'den 0.05'e 0.02'ye inmeye devam ettiğini görürsünüz. Log ölçek size oransal ilerlemeyi görmenizi sağlar -- yakınsama için tam da önemli olan budur.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Toparlama & Mini Hatırlatma</h2>

<p class="l-text">Sekiz kwarg, açıklama için dört konum, makale/slayt için üç stil, tek LaTeX kuralı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">color, linewidth, linestyle</div><div class="card-body">Üç "çizgi geometrisi" kwarg'ı. Hex stringler hassasiyet, isimler okunaklılık verir.</div></div>
<div class="calc-card"><div class="card-title">marker, markersize, markevery</div><div class="card-body">Üç "işaretçi geometrisi" kwarg'ı. Yoğun serilerde <code>markevery</code> kullanın ki işaretçiler tuğla duvarına dönüşmesin.</div></div>
<div class="calc-card"><div class="card-title">label + ax.legend()</div><div class="card-body">Çift: açıklamada görünmesi gereken her çizginin <code>label=</code>'a ihtiyacı vardır; <code>ax.legend()</code> render eder. Etiketi atlayın, açıklama girdisini atlayın.</div></div>
<div class="calc-card"><div class="card-title">plt.style.use(...)</div><div class="card-body">Tek satır, toplam görsel makyaj. Temiz modern için <code>"seaborn-v0_8"</code>, tez için <code>"bmh"</code>, slaytlar için <code>"dark_background"</code>.</div></div>
<div class="calc-card"><div class="card-title">r"$\\alpha$"</div><div class="card-body">Etiketler içinde LaTeX: ham string + dolar işaretleri. Yunan harfleri, kesirler, alt indisler -- hepsi çalışır.</div></div>
<div class="calc-card"><div class="card-title">ax.set_yscale("log")</div><div class="card-body">Kayıplar, popülasyonlar, büyüklük mertebeleri yayan her şey için log eksen. <code>which="both"</code> ızgara ile eşleştirin.</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> <code>ax.plot</code> ~10 stil kwarg'ı alır. Bunlara hakim olmak = Matplotlib estetiğinin %80'ine hakim olmak.<br><strong>2.</strong> Birden çok <code>plot</code> çağrısı aynı axes üzerine yığılır. Matplotlib renkleri otomatik döndürür; gri-tonu dostu figürler için işaretçi şeklini ikinci kanal olarak kullanın.<br><strong>3.</strong> <code>ax.legend(loc="best", ncol=2, framealpha=0.9)</code> varsayılanınızdır. Dışarı itmek için <code>bbox_to_anchor</code> kullanın.<br><strong>4.</strong> Beş renk belirtim yolu: isimli, hex, rgb tuple, kısayol, colormap örneği. Hex en hassas; isimli en okunaklı.<br><strong>5.</strong> Stil sayfaları (<code>plt.style.use</code>) tek satırlık güzelleştirmedir. Bir belgedeki her figür için aynı stili kullanın.<br><strong>6.</strong> Etiketlerde LaTeX: ham string + <code>$...$</code>. <code>r"$\\alpha = \\frac{1}{2}$"</code>. Herhangi bir teknik yazı için zorunlu.<br><strong>7.</strong> Kayıplar için log y; doğruluklar/olasılıklar için doğrusal y. Ölçeği niceliğe uydurun.<br><strong>8.</strong> Cila = stil sayfası + özel palet + işaretçiler + LaTeX etiketleri + son sözü gösteren bir ok notu. Makale figürü tarifi budur.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};

  // multi-line LR sweep
  function multi(id, title, xl, yl, l1, l2, l3){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], h=[], m=[], lo=[]; var seed=0;
    function r(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=1;i<=30;i++){ep.push(i);h.push(0.6*Math.exp(-i/4)+r()*0.04);m.push(0.6*Math.exp(-i/8)+r()*0.04);lo.push(0.6*Math.exp(-i/16)+r()*0.04);}
    var t1 = {x:ep,y:h,mode:'lines+markers',type:'scatter',line:{color:'#5b8def',width:2},marker:{color:'#5b8def',size:6},name:l1};
    var t2 = {x:ep,y:m,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:6,symbol:'square'},name:l2};
    var t3 = {x:ep,y:lo,mode:'lines+markers',type:'scatter',line:{color:'#4ecdc4',width:2},marker:{color:'#4ecdc4',size:6,symbol:'triangle-up'},name:l3};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  multi('plot-mpl-l2-multi-en','Effect of learning rate on convergence','epoch','training loss','lr = 1e-2','lr = 1e-3','lr = 1e-4');
  multi('plot-mpl-l2-multi-tr','Ogrenme oraninin yakinsamaya etkisi','epok','egitim kaybi','lr = 1e-2','lr = 1e-3','lr = 1e-4');

  // styles compare (3 small lines)
  function styles(id, title){
    var el = document.getElementById(id); if(!el) return;
    var x=[]; for (var i=0;i<60;i++) x.push(i*0.2);
    var s1=[], s2=[], s3=[];
    for (var i=0;i<60;i++){var v=Math.sin(x[i]);s1.push(v+3);s2.push(v+1.5);s3.push(v);}
    var t1 = {x:x,y:s1,mode:'lines',type:'scatter',line:{color:T.accent,width:2.5},name:'default'};
    var t2 = {x:x,y:s2,mode:'lines',type:'scatter',line:{color:'#f87171',width:2.5},name:'ggplot-like'};
    var t3 = {x:x,y:s3,mode:'lines',type:'scatter',line:{color:'#4ecdc4',width:2.5},name:'dark / accent'};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'sin(x) + offset',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  styles('plot-mpl-l2-styles-en','Three style sheets: same data, different identity');
  styles('plot-mpl-l2-styles-tr','Uc stil sayfasi: ayni veri, farkli kimlik');

  // polished loss
  function polished(id, title, xl, yl, l1, l2, l3, ann){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], a=[], b=[], c=[]; var seed=42;
    function r(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=1;i<=50;i++){ep.push(i);a.push(1.2*Math.exp(-i/18)+0.05+r()*0.04);b.push(1.2*Math.exp(-i/11)+0.04+r()*0.04);c.push(1.2*Math.exp(-i/7)+0.03+r()*0.04);}
    var t1 = {x:ep,y:a,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:5,symbol:'circle'},name:l1};
    var t2 = {x:ep,y:b,mode:'lines+markers',type:'scatter',line:{color:'#4ecdc4',width:2},marker:{color:'#4ecdc4',size:5,symbol:'square'},name:l2};
    var t3 = {x:ep,y:c,mode:'lines+markers',type:'scatter',line:{color:'#f87171',width:2},marker:{color:'#f87171',size:5,symbol:'triangle-up'},name:l3};
    var conv = 0; for (var i=0;i<c.length;i++){if(c[i]<=0.10){conv=i+1;break;}}
    var vline = {type:'line',x0:conv,x1:conv,y0:0.02,y1:1.5,xref:'x',yref:'y',line:{color:'#f87171',width:1.5,dash:'dash'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero,type:'log'},
      legend:{font:{color:T.text}},
      shapes:[vline],
      annotations:[{x:conv,y:0.10,xref:'x',yref:'y',text:ann+conv,showarrow:true,arrowhead:2,ax:60,ay:-30,arrowcolor:T.text,font:{color:T.text,size:11}}]
    });
    Plotly.newPlot(id,[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  polished('plot-mpl-l2-polished-en','Convergence of three optimisers (log y, 50 epochs)','epoch','validation loss','SGD','SGD + momentum','Adam','Adam reaches 0.10 at epoch ');
  polished('plot-mpl-l2-polished-tr','Uc optimize edicinin yakinsamasi (log y, 50 epok)','epok','dogrulama kaybi','SGD','SGD + momentum','Adam','Adam 0.10 a ulasiyor: epok ');
},250);</script>
`

};
