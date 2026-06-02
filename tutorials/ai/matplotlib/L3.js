window.MATPLOTLIB_L3 = {

en: `<p class="l-text"><strong>One plot is rarely enough.</strong> A real analysis -- the kind you put in a thesis or a report -- almost always shows several views of the same dataset side by side: the raw distribution next to its log transform, train and validation curves above accuracy curves, twelve class-conditional histograms in a 3x4 grid. The skill that makes those layouts look <em>professional</em> rather than thrown-together is layout management: subplots, gridspec, shared axes, inset zooms, tight and constrained layout.</p>

<p class="l-text">In this lesson we move past the "one figure, one axes" mental model and master the multi-panel figure. By the end you will reach for <code>plt.subplots(2, 3, sharey=True)</code>, drop a zoom-inset over an outlier, and produce a thirty-axes "small multiples" wall that tells a story at a glance.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Build NxM panel grids with <code>plt.subplots(rows, cols)</code> and index the Axes array correctly</li><li>Fix overlapping labels with <code>tight_layout</code>, <code>constrained_layout</code>, and <code>subplots_adjust</code></li><li>Compose asymmetric layouts (one wide row over two small panels) using <code>GridSpec</code></li><li>Share axes via <code>sharex</code>/<code>sharey</code> so panels read on a common scale</li><li>Drop zoom insets over outliers with <code>inset_axes</code> and <code>indicate_inset_zoom</code></li><li>Design small-multiples walls that tell one story across many panels</li><li>Sketch named layouts with <code>subplot_mosaic</code> ASCII art and pick the right tool from a decision tree</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. plt.subplots(rows, cols): The Grid Constructor</h2>

<p class="l-text">The single function <code>plt.subplots(rows, cols)</code> covers 80% of all multi-panel layouts you will ever need. It returns a Figure plus a NumPy array of Axes objects, ready to be indexed.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

<span class="cm"># 2 rows, 3 cols => 6 axes in a (2, 3) array</span>
fig, axes = plt.<span class="fn">subplots</span>(<span class="num">2</span>, <span class="num">3</span>, figsize=(<span class="num">12</span>, <span class="num">6</span>))

<span class="cm"># axes is a 2D NumPy array: index it like axes[row, col]</span>
axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x))
axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"sin(x)"</span>)

axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x))
axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"cos(x)"</span>)

axes[<span class="num">0</span>, <span class="num">2</span>].<span class="fn">plot</span>(x, np.<span class="fn">tan</span>(x))
axes[<span class="num">0</span>, <span class="num">2</span>].<span class="fn">set_ylim</span>(-<span class="num">5</span>, <span class="num">5</span>)
axes[<span class="num">0</span>, <span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"tan(x)"</span>)

axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">hist</span>(rng.<span class="fn">normal</span>(size=<span class="num">500</span>), bins=<span class="num">30</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.8</span>)
axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Gaussian"</span>)

axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">hist</span>(rng.<span class="fn">exponential</span>(size=<span class="num">500</span>), bins=<span class="num">30</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.8</span>)
axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Exponential"</span>)

axes[<span class="num">1</span>, <span class="num">2</span>].<span class="fn">scatter</span>(rng.<span class="fn">normal</span>(size=<span class="num">200</span>), rng.<span class="fn">normal</span>(size=<span class="num">200</span>), s=<span class="num">12</span>, alpha=<span class="num">0.6</span>)
axes[<span class="num">1</span>, <span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"scatter"</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"plt.subplots(2, 3): six panels, one figure"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports pyplot and numpy, then makes a reproducible RNG and an x grid for the trig curves. 2) <code>plt.subplots(2, 3, figsize=(12, 6))</code> opens one Figure and lays out a 2x3 grid of Axes inside it; the figure handle goes into <code>fig</code> and the six axes go into <code>axes</code> as a NumPy array of shape <code>(2, 3)</code>. 3) Each cell is filled by indexing: <code>axes[0, 0]</code>, <code>axes[0, 1]</code>, ... -- top row trig functions, bottom row two histograms and a scatter. 4) <code>set_ylim</code> on the tan panel is essential because tan blows up at pi/2; without clamping the y-axis the plot would be unreadable. 5) <code>fig.suptitle</code> draws a single title spanning the whole figure -- subplots have their own per-axes titles via <code>set_title</code>. 6) <code>plt.tight_layout()</code> auto-adjusts the spacing so labels do not overlap. 7) <code>plt.show()</code> renders the lot.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">return value</div><div class="card-body"><code>plt.subplots(r, c)</code> returns <code>(fig, axes)</code>. <code>axes</code> is a NumPy array of shape <code>(r, c)</code> if both r and c are >= 2, a 1D array if one of them is 1, or a single Axes if r=c=1.</div></div>
<div class="calc-card"><div class="card-title">indexing</div><div class="card-body">2D grid: <code>axes[row, col]</code>. 1D row of plots: <code>axes[i]</code>. Always check the shape with <code>axes.shape</code> if you are unsure.</div></div>
<div class="calc-card"><div class="card-title">figsize</div><div class="card-body">In inches. A 2x3 grid usually wants something like (12, 6) or (14, 8). Bigger if labels feel cramped.</div></div>
<div class="calc-card"><div class="card-title">flatten()</div><div class="card-body"><code>for ax in axes.flatten(): ax.set_xlabel("x")</code> applies a setting to every axes regardless of grid shape.</div></div>
<div class="calc-card"><div class="card-title">suptitle</div><div class="card-body"><code>fig.suptitle("...")</code> draws a figure-wide title. Each subplot still has its own <code>ax.set_title</code> for the local label.</div></div>
<div class="calc-card"><div class="card-title">tight_layout</div><div class="card-body">Run once at the end to auto-fix margin overlap. Modern alternative: pass <code>constrained_layout=True</code> to <code>plt.subplots</code>.</div></div>
</div>

<div id="plot-mpl-l3-grid-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A Plotly mirror of a 2x3 Matplotlib subplot grid. Top row: three deterministic curves (sin, cos, tan with clamped y). Bottom row: histograms of two distributions and a Gaussian-vs-Gaussian scatter. The same Figure holds six panels, each with its own scale, its own title, and full independence -- yet they share a single canvas you can save as one image.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. tight_layout, constrained_layout, subplots_adjust</h2>

<p class="l-text">When subplots are first laid out, default spacing usually clips axis labels and title bars. There are three tools to fix this; you should understand which to reach for and when.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">plt.tight_layout()</div><div class="compare-item">Call once at the end</div><div class="compare-item">Auto-adjusts pad/margins</div><div class="compare-item">Greedy, can squeeze suptitles</div><div class="compare-item">Old, well-tested</div><div class="compare-item">Use for: 90% of casual figures</div></div>
<div class="compare-col"><div class="compare-title">constrained_layout=True</div><div class="compare-item">Pass at <code>plt.subplots</code> creation</div><div class="compare-item">Continuous re-layout while drawing</div><div class="compare-item">Handles colorbars and suptitles cleanly</div><div class="compare-item">Modern, recommended for new code</div><div class="compare-item">Use for: complex multi-panel figures</div></div>
<div class="compare-col"><div class="compare-title">subplots_adjust(...)</div><div class="compare-item">Manual control: left, right, top, bottom, wspace, hspace</div><div class="compare-item">No automatic anything</div><div class="compare-item">Used to tune the final 5%</div><div class="compare-item">Override after auto-layout</div><div class="compare-item">Use for: precise journal layouts</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">5</span>, <span class="num">100</span>)

<span class="cm"># Modern preferred path: constrained_layout</span>
fig, axes = plt.<span class="fn">subplots</span>(
    <span class="num">2</span>, <span class="num">2</span>,
    figsize=(<span class="num">9</span>, <span class="num">6</span>),
    constrained_layout=<span class="kw">True</span>   <span class="cm"># auto-resizes spacing as you draw</span>
)

axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x));     axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"sin(x)"</span>)
axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x));     axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"cos(x)"</span>)
axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x));    axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"exp(-x)"</span>)
axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">log1p</span>(x));   axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"log(1 + x)"</span>)

<span class="kw">for</span> ax <span class="kw">in</span> axes.<span class="fn">flatten</span>():
    ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
    ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
    ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"Four panels with constrained_layout"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()

<span class="cm"># --- Manual override of the final 5% ---</span>
<span class="cm"># fig.subplots_adjust(top=0.90, bottom=0.10, left=0.08, right=0.97,</span>
<span class="cm">#                     wspace=0.30, hspace=0.40)</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds an x grid of 100 points. 2) <code>plt.subplots(2, 2, ..., constrained_layout=True)</code> creates a 2x2 grid and turns on the modern auto-layout engine; this is the recommended replacement for <code>tight_layout</code> in new code. 3) Four functions are drawn one per cell, each with its own title. 4) <code>for ax in axes.flatten()</code> applies common styling (xlabel, ylabel, grid) to every panel without writing four near-identical lines. 5) <code>suptitle</code> adds the overall heading; constrained_layout knows about it and reserves room. 6) The commented <code>subplots_adjust</code> call shows how to override spacing if you need pixel-level control after auto-layout has done its best.</p>

<div class="l-warn"><strong>Common pitfall:</strong> mixing both. If you set <code>constrained_layout=True</code> and then call <code>plt.tight_layout()</code> you will get warnings and unpredictable results. Choose one. For new code, choose constrained_layout.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GridSpec: Asymmetric Layouts</h2>

<p class="l-text">When the panels are not all the same size -- a wide top banner, two equal halves below, a tall colorbar on the right -- <code>plt.subplots</code> is too rigid. The escape hatch is <strong>GridSpec</strong>: define a grid of slots, then claim arbitrary rectangular spans of those slots.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> matplotlib.gridspec <span class="kw">as</span> gridspec
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
x = rng.<span class="fn">normal</span>(size=<span class="num">500</span>)
y = rng.<span class="fn">normal</span>(size=<span class="num">500</span>)

fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">10</span>, <span class="num">7</span>), constrained_layout=<span class="kw">True</span>)
gs  = gridspec.<span class="fn">GridSpec</span>(<span class="num">3</span>, <span class="num">3</span>, figure=fig)

<span class="cm"># Big main scatter occupies a 2x2 block in the bottom-left</span>
ax_main = fig.<span class="fn">add_subplot</span>(gs[<span class="num">1</span>:<span class="num">3</span>, <span class="num">0</span>:<span class="num">2</span>])
<span class="cm"># Marginal histograms</span>
ax_top  = fig.<span class="fn">add_subplot</span>(gs[<span class="num">0</span>,    <span class="num">0</span>:<span class="num">2</span>], sharex=ax_main)
ax_right= fig.<span class="fn">add_subplot</span>(gs[<span class="num">1</span>:<span class="num">3</span>,  <span class="num">2</span>  ], sharey=ax_main)

ax_main.<span class="fn">scatter</span>(x, y, s=<span class="num">12</span>, alpha=<span class="num">0.5</span>, color=<span class="str">"#c8a96e"</span>)
ax_main.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax_main.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)

ax_top.<span class="fn">hist</span>(x, bins=<span class="num">30</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.7</span>)
ax_top.<span class="fn">tick_params</span>(labelbottom=<span class="kw">False</span>)             <span class="cm"># hide redundant x labels</span>

ax_right.<span class="fn">hist</span>(y, bins=<span class="num">30</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.7</span>,
              orientation=<span class="str">"horizontal"</span>)
ax_right.<span class="fn">tick_params</span>(labelleft=<span class="kw">False</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"Joint scatter + marginal histograms (GridSpec)"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates 500 random (x, y) pairs from independent Gaussians -- the canonical "joint plot" dataset. 2) <code>plt.figure</code> opens an empty Figure of size 10x7 with constrained_layout enabled. 3) <code>gridspec.GridSpec(3, 3, figure=fig)</code> divides the figure conceptually into a 3x3 grid of slots. 4) <code>fig.add_subplot(gs[1:3, 0:2])</code> claims the bottom-left 2x2 block as the main scatter axes; <code>gs[0, 0:2]</code> claims the top row first two columns for the x-margin histogram; <code>gs[1:3, 2]</code> claims the right column for the y-margin. 5) <code>sharex=ax_main</code> on the top axes means panning/zooming x stays consistent; <code>sharey=ax_main</code> on the right axes shares the y range. 6) <code>tick_params(labelbottom=False)</code> hides the redundant x tick labels on the top histogram (they are the same as the main axes anyway). 7) The right histogram is drawn horizontally so its bars line up with the y axis of the main scatter.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GridSpec(rows, cols)</div><div class="card-body">Defines a virtual grid. You then carve subplots out of it with slicing: <code>gs[1:3, 0:2]</code> claims rows 1-2 and cols 0-1.</div></div>
<div class="calc-card"><div class="card-title">add_subplot(gs[...])</div><div class="card-body">Creates an Axes that fills the slice. The slice can be any rectangle, including disjoint pieces (you would call add_subplot multiple times).</div></div>
<div class="calc-card"><div class="card-title">width_ratios, height_ratios</div><div class="card-body"><code>GridSpec(2, 2, width_ratios=[3, 1])</code> makes the left column three times wider than the right.</div></div>
<div class="calc-card"><div class="card-title">subplot_mosaic</div><div class="card-body">Modern shortcut: <code>fig.subplot_mosaic("AAB\nCCB")</code> uses ASCII art -- letters that touch are merged into one axes.</div></div>
</div>

<div id="plot-mpl-l3-gridspec-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A joint scatter with marginal histograms, the canonical use of GridSpec. The main axes (gold scatter) lives in a 2x2 block; the top axes (gold histogram of x) shares its x-axis; the right axes (teal horizontal histogram of y) shares its y-axis. This compact "joint plot" view is one of the most informative two-variable diagnostics in EDA.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Shared Axes: sharex, sharey</h2>

<p class="l-text">When several panels show the same variable on one axis, you usually want them to share that axis exactly: zoom in one and the others zoom too, and the common ticks render only once. <code>sharex</code> and <code>sharey</code> are how you ask for that.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

<span class="cm"># Three panels stacked vertically, all sharing the same x axis</span>
fig, axes = plt.<span class="fn">subplots</span>(
    <span class="num">3</span>, <span class="num">1</span>,
    figsize=(<span class="num">8</span>, <span class="num">7</span>),
    sharex=<span class="kw">True</span>,                 <span class="cm"># all three use the same x range and ticks</span>
    constrained_layout=<span class="kw">True</span>
)

axes[<span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x),       color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
axes[<span class="num">0</span>].<span class="fn">set_ylabel</span>(<span class="str">"sin(x)"</span>)

axes[<span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) ** <span class="num">2</span>,  color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>)
axes[<span class="num">1</span>].<span class="fn">set_ylabel</span>(<span class="str">"sin^2(x)"</span>)

axes[<span class="num">2</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) ** <span class="num">3</span>,  color=<span class="str">"#ff6b6b"</span>, linewidth=<span class="num">2</span>)
axes[<span class="num">2</span>].<span class="fn">set_ylabel</span>(<span class="str">"sin^3(x)"</span>)
axes[<span class="num">2</span>].<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)          <span class="cm"># only the bottom panel needs the x label</span>

fig.<span class="fn">suptitle</span>(<span class="str">"Three signals, one shared x axis"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds an x grid of 200 points from 0 to 10. 2) <code>plt.subplots(3, 1, sharex=True)</code> stacks three axes vertically and ties their x axes together; whatever range the first axes ends up with, the other two adopt automatically, and tick labels only appear on the bottom panel. 3) Each panel plots a different power of sin(x): the original, its square, and its cube. 4) Only the bottom axes gets <code>set_xlabel</code> because the upper two share its x-axis and would otherwise repeat the label uselessly. 5) <code>suptitle</code> adds the figure-wide heading. 6) <code>constrained_layout=True</code> handles the spacing automatically.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">sharex=True / sharey=True</div><div class="card-body">All axes share the same x or y. Useful when comparing several signals over the same time axis.</div></div>
<div class="calc-card"><div class="card-title">sharex="row" / "col"</div><div class="card-body">Share within rows or within columns only. Great for a 2x3 grid where each row plots a different metric and each column a different model.</div></div>
<div class="calc-card"><div class="card-title">sharex=ax_main</div><div class="card-body">Share with a specific Axes object you already created (used in the GridSpec joint-plot from section 3).</div></div>
<div class="calc-card"><div class="card-title">tick_params</div><div class="card-body">Even with sharex, you sometimes want intermediate axes to hide their tick labels: <code>ax.tick_params(labelbottom=False)</code>.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: training diagnostics</div><div class="example-body">A common 3x1 figure during training: top panel = loss curves (train, val), middle panel = accuracy curves (train, val), bottom panel = learning rate schedule. All three share the epoch axis. With <code>sharex=True</code> you write <code>set_xlabel("epoch")</code> exactly once on the bottom panel and the figure looks instantly publication-ready.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Inset Axes: Zoom Into a Region</h2>

<p class="l-text">Sometimes one tiny region of your data is the entire story -- the spike at iteration 3000, the outlier cluster, the elbow in the loss curve. An <strong>inset</strong> is a small auxiliary axes that lives <em>inside</em> the main axes and zooms into that region.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">2</span>)
x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">100</span>, <span class="num">1000</span>)
y = np.<span class="fn">exp</span>(-x / <span class="num">30</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, x.size)
<span class="cm"># Plant an artificial spike around x = 60</span>
y[<span class="num">600</span>:<span class="num">610</span>] += <span class="num">0.4</span>

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, y, linewidth=<span class="num">1.2</span>, color=<span class="str">"#c8a96e"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"iteration"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"loss"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Training loss with a spike around iteration 60"</span>)

<span class="cm"># --- Inset zoom ---</span>
axins = ax.<span class="fn">inset_axes</span>([<span class="num">0.55</span>, <span class="num">0.45</span>, <span class="num">0.40</span>, <span class="num">0.45</span>])  <span class="cm"># x, y, w, h in axes fraction</span>
axins.<span class="fn">plot</span>(x, y, linewidth=<span class="num">1.2</span>, color=<span class="str">"#c8a96e"</span>)
axins.<span class="fn">set_xlim</span>(<span class="num">55</span>, <span class="num">70</span>)
axins.<span class="fn">set_ylim</span>(<span class="num">0</span>, <span class="num">0.8</span>)
axins.<span class="fn">set_xticklabels</span>([])    <span class="cm"># cleaner look</span>
axins.<span class="fn">set_yticklabels</span>([])
ax.<span class="fn">indicate_inset_zoom</span>(axins, edgecolor=<span class="str">"#4ecdc4"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds 1000 iterations of an exponential decay loss with small Gaussian noise, then surgically adds a spike between iterations 600 and 610 to imitate a training instability. 2) Draws the full curve on the main axes. 3) <code>ax.inset_axes([0.55, 0.45, 0.40, 0.45])</code> creates a sub-axes in the upper-right quadrant of the main axes -- the four numbers are (x, y, width, height) as fractions of the parent axes, not data coordinates. 4) The same loss is replotted on the inset, then <code>set_xlim</code> and <code>set_ylim</code> zoom into iterations 55-70 where the spike lives. 5) Tick labels are hidden on the inset to keep it visually clean. 6) <code>ax.indicate_inset_zoom(axins, edgecolor=...)</code> draws the rectangle on the main axes plus the connecting lines that show "this little box on the inset corresponds to that region on the main plot" -- this is what makes a zoom inset readable.</p>

<div class="l-note"><strong>When to use insets:</strong> any time the eye of your reader needs to be guided to a small region without losing the global context. Common in optimisation papers (zoom on the convergence tail), in spectroscopy (zoom on a peak), and in NLP attention plots (zoom on a few interesting tokens).</div>

<div id="plot-mpl-l3-inset-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A long training-loss curve with a deliberate spike near iteration 60, and a small inset axes in the top-right corner that zooms into that exact region. The inset uses the same data, just clipped via x and y limits, and is connected to the main plot via the rectangle indicator. This is how research papers signal "look here" without breaking the global narrative.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Small Multiples: One Story, Many Panels</h2>

<p class="l-text">A <strong>small multiples</strong> figure shows the same chart repeated many times across one categorical dimension: one histogram per class, one curve per model, one heatmap per attention head. The eye scans the grid, picks up patterns, and a single picture replaces an entire table.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">3</span>)
n_classes = <span class="num">9</span>
x = np.<span class="fn">linspace</span>(-<span class="num">4</span>, <span class="num">4</span>, <span class="num">200</span>)

fig, axes = plt.<span class="fn">subplots</span>(
    <span class="num">3</span>, <span class="num">3</span>,
    figsize=(<span class="num">10</span>, <span class="num">8</span>),
    sharex=<span class="kw">True</span>, sharey=<span class="kw">True</span>,            <span class="cm"># identical scales => fair comparison</span>
    constrained_layout=<span class="kw">True</span>
)

<span class="kw">for</span> k, ax <span class="kw">in</span> <span class="fn">enumerate</span>(axes.<span class="fn">flatten</span>()):
    mu, sigma = rng.<span class="fn">uniform</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>), rng.<span class="fn">uniform</span>(<span class="num">0.4</span>, <span class="num">1.2</span>)
    samples = rng.<span class="fn">normal</span>(mu, sigma, <span class="num">500</span>)
    ax.<span class="fn">hist</span>(samples, bins=<span class="num">25</span>, density=<span class="kw">True</span>,
            color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.7</span>, edgecolor=<span class="str">"white"</span>)
    <span class="cm"># Overlay the true Gaussian for context</span>
    ax.<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-(x - mu) ** <span class="num">2</span> / (<span class="num">2</span> * sigma ** <span class="num">2</span>)) /
                 (sigma * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.pi)),
            color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>)
    ax.<span class="fn">set_title</span>(f<span class="str">"class {k}: mu={mu:.1f}, sigma={sigma:.1f}"</span>, fontsize=<span class="num">10</span>)
    ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.2</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"Small multiples: 9 class-conditional distributions"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets a seed for reproducibility and chooses nine classes. 2) Defines an x grid for overlaying the analytic Gaussian curves later. 3) <code>plt.subplots(3, 3, sharex=True, sharey=True)</code> creates a 3x3 grid where every panel uses identical x and y limits -- this is non-negotiable for small multiples; without shared scales the eye cannot fairly compare the histograms. 4) <code>for k, ax in enumerate(axes.flatten())</code> iterates over all nine axes regardless of grid shape. 5) For each, a different mu and sigma are drawn, 500 samples are generated, and the empirical histogram is plotted; <code>density=True</code> normalises to a probability density. 6) The true Gaussian PDF is overlaid in teal so the reader can compare the empirical distribution to the analytical truth. 7) Each subplot title shows its parameters so the figure is self-explanatory.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">shared scales</div><div class="card-body">Always pass <code>sharex=True, sharey=True</code> for small multiples. Otherwise the panels are visually incomparable.</div></div>
<div class="calc-card"><div class="card-title">mini-titles</div><div class="card-body">Each panel needs a label of the slice it represents (class id, model name, head index). Keep them short -- 10-15 characters max.</div></div>
<div class="calc-card"><div class="card-title">density=True</div><div class="card-body">In <code>hist</code>, normalises area to 1 -- useful for comparing distributions of different sample counts.</div></div>
<div class="calc-card"><div class="card-title">ML use-cases</div><div class="card-body">Per-class confusion matrices, per-head attention maps, per-feature distributions, learning curves across hyperparameter sweeps.</div></div>
</div>

<div id="plot-mpl-l3-small-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 3x3 grid of class-conditional Gaussian samples, with the analytical PDF overlaid on each. Because all panels share the same x and y scales, your eye can immediately compare which classes have wide vs narrow distributions and which are centred far from zero. This pattern -- one chart per slice of a categorical variable -- is the small-multiples idiom that Edward Tufte popularised, and it is by far the most informative way to visualise a multi-class problem.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. subplot_mosaic: ASCII-Art Layouts</h2>

<p class="l-text">When you want a complex layout but find GridSpec verbose, <code>fig.subplot_mosaic</code> lets you draw your layout as ASCII art. Letters that touch get merged into one axes.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

fig, axd = plt.<span class="fn">subplot_mosaic</span>(
    <span class="str">"""
    AAB
    CCB
    DDD
    """</span>,
    figsize=(<span class="num">10</span>, <span class="num">7</span>),
    constrained_layout=<span class="kw">True</span>
)

axd[<span class="str">"A"</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), color=<span class="str">"#c8a96e"</span>); axd[<span class="str">"A"</span>].<span class="fn">set_title</span>(<span class="str">"A"</span>)
axd[<span class="str">"B"</span>].<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x), color=<span class="str">"#4ecdc4"</span>); axd[<span class="str">"B"</span>].<span class="fn">set_title</span>(<span class="str">"B (tall)"</span>)
axd[<span class="str">"C"</span>].<span class="fn">plot</span>(x, np.<span class="fn">tan</span>(x).<span class="fn">clip</span>(-<span class="num">3</span>, <span class="num">3</span>), color=<span class="str">"#ff6b6b"</span>); axd[<span class="str">"C"</span>].<span class="fn">set_title</span>(<span class="str">"C"</span>)
axd[<span class="str">"D"</span>].<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x / <span class="num">3</span>), color=<span class="str">"#a78bfa"</span>); axd[<span class="str">"D"</span>].<span class="fn">set_title</span>(<span class="str">"D (wide bottom banner)"</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"subplot_mosaic: ASCII layout"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The triple-quoted string is the layout: row 1 is "AAB", row 2 is "CCB", row 3 is "DDD". The two A's are adjacent so they merge into a wide axes covering the top-left 2 columns; B occupies the right column across rows 1-2 so it becomes a tall axes; the three D's merge into a wide bottom banner. 2) <code>fig.subplot_mosaic(...)</code> returns a dictionary mapping each letter to its Axes object. 3) <code>axd["A"]</code>, <code>axd["B"]</code>, etc. give you the four merged axes ready to plot on. 4) Each gets its own curve and title; the canvas-wide title is added with <code>suptitle</code>. 5) <code>constrained_layout=True</code> handles spacing automatically.</p>

<div class="calc-highlight"><strong>Rule of thumb:</strong> if your layout is a regular rectangular grid, use <code>plt.subplots</code>. If panels have different sizes but the layout is simple, use <code>subplot_mosaic</code>. Reach for <code>GridSpec</code> only when neither of the first two is enough -- e.g. you need width_ratios or you are programmatically generating the layout.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap & Layout Decision Tree</h2>

<p class="l-text">A condensed decision tree for picking the right tool when laying out multiple panels.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>One plot?</strong> <code>fig, ax = plt.subplots()</code>. Done.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>Regular grid (NxM, all panels equal)?</strong> <code>fig, axes = plt.subplots(N, M, constrained_layout=True)</code>. Index with <code>axes[r, c]</code>.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Same x-axis or y-axis across panels?</strong> Add <code>sharex=True</code> and/or <code>sharey=True</code>.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Some panels bigger than others, but layout is simple?</strong> <code>fig.subplot_mosaic("AAB\\nCCB")</code>. Letters that touch merge.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Need width_ratios, height_ratios, or programmatic generation?</strong> <code>gridspec.GridSpec(...)</code> + <code>fig.add_subplot(gs[...])</code>.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Want to zoom into a region of one axes?</strong> <code>axins = ax.inset_axes([x, y, w, h])</code> and <code>ax.indicate_inset_zoom(axins)</code>.</div></div>
<div class="step-row"><div class="step-num">7</div><div class="step-body"><strong>Spacing looks cramped?</strong> Pass <code>constrained_layout=True</code> at creation time, or call <code>plt.tight_layout()</code> at the end. Never both.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> <code>plt.subplots(rows, cols)</code> is the workhorse: returns a Figure plus a NumPy array of axes you index normally.<br><strong>2.</strong> Use <code>constrained_layout=True</code> at creation, not <code>tight_layout</code> at the end -- and never both.<br><strong>3.</strong> <code>sharex</code> and <code>sharey</code> tie axes together so panning, zooming, and tick labels stay consistent.<br><strong>4.</strong> <code>GridSpec</code> escapes the regular-grid limitation: claim arbitrary rectangular spans for asymmetric layouts.<br><strong>5.</strong> <code>subplot_mosaic</code> writes layouts as ASCII art -- great for moderately irregular figures without GridSpec verbosity.<br><strong>6.</strong> <code>inset_axes</code> + <code>indicate_inset_zoom</code> are how you guide the reader to a tiny important region without losing global context.<br><strong>7.</strong> Small multiples (NxM grid + shared axes) is the most powerful diagnostic layout in ML: one panel per class, head, model, or split.<br><strong>8.</strong> The order of decision: regular -&gt; subplots, irregular-but-simple -&gt; subplot_mosaic, complex -&gt; GridSpec.</div></div>
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

  // 1. 2x3 subplot grid
  function gridDemo(id, suptitle, lblHist1, lblHist2, lblScatter){
    var el = document.getElementById(id); if(!el) return;
    var x=[]; for (var i=0;i<200;i++) x.push(i/20);
    var sin = x.map(function(v){return Math.sin(v);});
    var cos = x.map(function(v){return Math.cos(v);});
    var tan = x.map(function(v){var t=Math.tan(v);return Math.max(-5,Math.min(5,t));});
    function rndSeed(s){return function(){s=(s*9301+49297)%233280;return s/233280-0.5;}}
    var rng = rndSeed(0);
    var gauss=[]; for (var j=0;j<500;j++){var u1=Math.random()||1e-9,u2=Math.random();gauss.push(Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));}
    var expo=[]; for (var k=0;k<500;k++){expo.push(-Math.log(Math.random()||1e-9));}
    var sx=[],sy=[]; for (var l=0;l<200;l++){var u3=Math.random()||1e-9,u4=Math.random();sx.push(Math.sqrt(-2*Math.log(u3))*Math.cos(2*Math.PI*u4));sy.push(Math.sqrt(-2*Math.log(u3))*Math.sin(2*Math.PI*u4));}
    var traces = [
      {x:x,y:sin,mode:'lines',line:{color:T.accent,width:2},name:'sin(x)',xaxis:'x1',yaxis:'y1'},
      {x:x,y:cos,mode:'lines',line:{color:'#4ecdc4',width:2},name:'cos(x)',xaxis:'x2',yaxis:'y2'},
      {x:x,y:tan,mode:'lines',line:{color:'#ff6b6b',width:2},name:'tan(x)',xaxis:'x3',yaxis:'y3'},
      {x:gauss,type:'histogram',marker:{color:T.accent,opacity:0.8},name:lblHist1,xaxis:'x4',yaxis:'y4'},
      {x:expo,type:'histogram',marker:{color:'#4ecdc4',opacity:0.8},name:lblHist2,xaxis:'x5',yaxis:'y5'},
      {x:sx,y:sy,mode:'markers',marker:{color:'#a78bfa',size:5,opacity:0.6},type:'scatter',name:lblScatter,xaxis:'x6',yaxis:'y6'}
    ];
    var layout = Object.assign({}, common, {
      title:{text:suptitle,font:{color:T.text,size:14}},
      grid:{rows:2,columns:3,pattern:'independent'},
      height:480, showlegend:false,
      xaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      xaxis2:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      xaxis3:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      xaxis4:{gridcolor:T.grid,zerolinecolor:T.zero,title:'value'},
      xaxis5:{gridcolor:T.grid,zerolinecolor:T.zero,title:'value'},
      xaxis6:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      yaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'sin'},
      yaxis2:{gridcolor:T.grid,zerolinecolor:T.zero,title:'cos'},
      yaxis3:{gridcolor:T.grid,zerolinecolor:T.zero,title:'tan',range:[-5,5]},
      yaxis4:{gridcolor:T.grid,zerolinecolor:T.zero,title:'count'},
      yaxis5:{gridcolor:T.grid,zerolinecolor:T.zero,title:'count'},
      yaxis6:{gridcolor:T.grid,zerolinecolor:T.zero,title:'y'}
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  gridDemo('plot-mpl-l3-grid-en','plt.subplots(2, 3): six panels','Gaussian','Exponential','scatter');
  gridDemo('plot-mpl-l3-grid-tr','plt.subplots(2, 3): alti panel','Gauss','Ustel','sacilim');

  // 2. GridSpec joint plot
  function jointPlot(id, suptitle){
    var el = document.getElementById(id); if(!el) return;
    var x=[],y=[];
    for (var i=0;i<500;i++){
      var u1=Math.random()||1e-9,u2=Math.random();
      x.push(Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));
      y.push(Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2));
    }
    var traces = [
      {x:x,y:y,mode:'markers',type:'scatter',marker:{color:T.accent,size:6,opacity:0.5},xaxis:'x',yaxis:'y',name:'data',showlegend:false},
      {x:x,type:'histogram',marker:{color:T.accent,opacity:0.7},xaxis:'x',yaxis:'y2',name:'x',showlegend:false},
      {y:y,type:'histogram',marker:{color:'#4ecdc4',opacity:0.7},xaxis:'x2',yaxis:'y',name:'y',showlegend:false}
    ];
    var layout = Object.assign({}, common, {
      title:{text:suptitle,font:{color:T.text,size:14}},
      xaxis:{domain:[0,0.78],gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      yaxis:{domain:[0,0.78],gridcolor:T.grid,zerolinecolor:T.zero,title:'y'},
      xaxis2:{domain:[0.80,1.0],gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{domain:[0.80,1.0],gridcolor:T.grid,zerolinecolor:T.zero},
      bargap:0.05, height:520, showlegend:false
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  jointPlot('plot-mpl-l3-gridspec-en','Joint scatter + marginal histograms (GridSpec)');
  jointPlot('plot-mpl-l3-gridspec-tr','Eklem sacilim + marjinal histogramlar (GridSpec)');

  // 3. Inset zoom
  function insetDemo(id, title, xl, yl){
    var el = document.getElementById(id); if(!el) return;
    var x=[],y=[];
    for (var i=0;i<1000;i++){
      var xi = i/10;
      var yi = Math.exp(-xi/30) + (Math.random()-0.5)*0.04;
      if (i>=600 && i<610) yi += 0.4;
      x.push(xi); y.push(yi);
    }
    var x2 = x.slice(550,700);
    var y2 = y.slice(550,700);
    var traces = [
      {x:x,y:y,mode:'lines',line:{color:T.accent,width:1.4},name:'main',xaxis:'x',yaxis:'y',showlegend:false},
      {x:x2,y:y2,mode:'lines',line:{color:T.accent,width:1.4},name:'inset',xaxis:'x2',yaxis:'y2',showlegend:false}
    ];
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{domain:[0,1],gridcolor:T.grid,zerolinecolor:T.zero,title:xl},
      yaxis:{domain:[0,1],gridcolor:T.grid,zerolinecolor:T.zero,title:yl},
      xaxis2:{domain:[0.55,0.96],anchor:'y2',gridcolor:T.grid,zerolinecolor:T.zero,range:[55,70]},
      yaxis2:{domain:[0.45,0.92],anchor:'x2',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,0.8]},
      shapes:[
        {type:'rect',xref:'x',yref:'y',x0:55,y0:0,x1:70,y1:0.8,line:{color:'#4ecdc4',width:1.5,dash:'dash'},fillcolor:'rgba(78,205,196,0.05)'}
      ],
      height:420, showlegend:false
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  insetDemo('plot-mpl-l3-inset-en','Training loss with inset zoom on the spike','iteration','loss');
  insetDemo('plot-mpl-l3-inset-tr','Egitim kaybi: ani tirmanmaya yakinlasma kutusu','iterasyon','kayip');

  // 4. Small multiples 3x3
  function smallMultiples(id, suptitle){
    var el = document.getElementById(id); if(!el) return;
    var traces = [];
    var seed = 3;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var xGrid=[]; for (var i=0;i<200;i++) xGrid.push(-4+8*i/199);
    for (var k=0;k<9;k++){
      var mu = -1.5 + 3*rnd();
      var sigma = 0.4 + 0.8*rnd();
      var samples=[];
      for (var n=0;n<500;n++){
        var u1=Math.random()||1e-9,u2=Math.random();
        samples.push(mu + sigma*Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));
      }
      var pdf = xGrid.map(function(v){return Math.exp(-(v-mu)*(v-mu)/(2*sigma*sigma))/(sigma*Math.sqrt(2*Math.PI));});
      var ax = 'x'+(k+1), ay = 'y'+(k+1);
      traces.push({x:samples,type:'histogram',histnorm:'probability density',marker:{color:T.accent,opacity:0.7},xaxis:ax,yaxis:ay,showlegend:false,name:'class '+k});
      traces.push({x:xGrid,y:pdf,mode:'lines',line:{color:'#4ecdc4',width:2},xaxis:ax,yaxis:ay,showlegend:false,name:'PDF'});
    }
    var layout = Object.assign({}, common, {
      title:{text:suptitle,font:{color:T.text,size:14}},
      grid:{rows:3,columns:3,pattern:'independent'},
      height:560, showlegend:false, bargap:0.05
    });
    for (var j=1;j<=9;j++){
      layout['xaxis'+(j===1?'':j)] = {gridcolor:T.grid,zerolinecolor:T.zero,range:[-4,4]};
      layout['yaxis'+(j===1?'':j)] = {gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.1]};
    }
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  smallMultiples('plot-mpl-l3-small-en','Small multiples: 9 class-conditional distributions');
  smallMultiples('plot-mpl-l3-small-tr','Kucuk coklamalar: 9 sinif kosullu dagilim');
},250);</script>`,

tr: `<p class="l-text"><strong>Bir grafik nadiren yeterlidir.</strong> Gerçek bir analiz -- tezde ya da raporda yer alan türden -- neredeyse her zaman aynı veri setinin birkaç görünümünü yan yana gösterir: ham dağılım yanında log dönüşümü, doğruluk eğrilerinin üstünde eğitim ve doğrulama eğrileri, 3x4'lük bir ızgarada on iki sınıf koşullu histogram. Bu düzenlerin "rastgele yığılmış" yerine <em>profesyonel</em> görünmesini sağlayan beceri yerleşim yönetimidir: subplots, gridspec, paylaşılan eksenler, yakınlaştırma kutuları, tight ve constrained layout.</p>

<p class="l-text">Bu derste "tek figür, tek axes" zihinsel modelinden çıkıp çoklu panel figüre hâkim oluyoruz. Sonunda <code>plt.subplots(2, 3, sharey=True)</code>'ı düşünmeden yazacak, bir aykırı değerin üzerine yakınlaştırma kutusu yerleştirecek ve bir bakışta hikâye anlatan otuz axes'lik "küçük çoklamalar" duvarı üreteceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li><code>plt.subplots(rows, cols)</code> ile NxM panel ızgaraları kur ve Axes dizisini doğru indeksle</li><li><code>tight_layout</code>, <code>constrained_layout</code> ve <code>subplots_adjust</code> ile üst üste binen etiketleri çöz</li><li><code>GridSpec</code> ile asimetrik düzenler tasarla (geniş bir satırın altında iki küçük panel)</li><li><code>sharex</code>/<code>sharey</code> ile eksenleri paylaşıp panelleri ortak ölçekte oku</li><li><code>inset_axes</code> ve <code>indicate_inset_zoom</code> ile aykırı değerlerin üzerine yakınlaştırma kutusu yerleştir</li><li>Birçok panelde tek hikâye anlatan küçük çoklamalar (small multiples) duvarı tasarla</li><li><code>subplot_mosaic</code> ASCII gösterimiyle isimli düzenler çiz ve karar ağacından doğru aracı seç</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. plt.subplots(rows, cols): Izgara Yapıcısı</h2>

<p class="l-text">Tek başına <code>plt.subplots(rows, cols)</code> fonksiyonu, ihtiyaç duyacağınız çoklu panel düzenlerin %80'ini karşılar. Bir Figure ile birlikte indekslenmeye hazır bir Axes NumPy dizisi döndürür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

<span class="cm"># 2 satir, 3 sutun => (2, 3) dizisinde 6 axes</span>
fig, axes = plt.<span class="fn">subplots</span>(<span class="num">2</span>, <span class="num">3</span>, figsize=(<span class="num">12</span>, <span class="num">6</span>))

<span class="cm"># axes 2B NumPy dizisidir: axes[satir, sutun] gibi indeksleyin</span>
axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x))
axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"sin(x)"</span>)

axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x))
axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"cos(x)"</span>)

axes[<span class="num">0</span>, <span class="num">2</span>].<span class="fn">plot</span>(x, np.<span class="fn">tan</span>(x))
axes[<span class="num">0</span>, <span class="num">2</span>].<span class="fn">set_ylim</span>(-<span class="num">5</span>, <span class="num">5</span>)
axes[<span class="num">0</span>, <span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"tan(x)"</span>)

axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">hist</span>(rng.<span class="fn">normal</span>(size=<span class="num">500</span>), bins=<span class="num">30</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.8</span>)
axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"Gauss"</span>)

axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">hist</span>(rng.<span class="fn">exponential</span>(size=<span class="num">500</span>), bins=<span class="num">30</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.8</span>)
axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"Ustel"</span>)

axes[<span class="num">1</span>, <span class="num">2</span>].<span class="fn">scatter</span>(rng.<span class="fn">normal</span>(size=<span class="num">200</span>), rng.<span class="fn">normal</span>(size=<span class="num">200</span>), s=<span class="num">12</span>, alpha=<span class="num">0.6</span>)
axes[<span class="num">1</span>, <span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"sacilim"</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"plt.subplots(2, 3): alti panel, tek figur"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">tight_layout</span>()
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) pyplot ve numpy'ı içe aktarır, sonra üretilebilir bir RNG ve trigonometri eğrileri için bir x ızgarası kurar. 2) <code>plt.subplots(2, 3, figsize=(12, 6))</code> tek bir Figure açar ve içine 2x3'lük bir Axes ızgarası yerleştirir; figür tutamacı <code>fig</code>'e, altı axes ise <code>(2, 3)</code> şekilli bir NumPy dizisi olarak <code>axes</code>'e gider. 3) Her hücre indeksleme ile doldurulur: <code>axes[0, 0]</code>, <code>axes[0, 1]</code>, ... -- üst satır trig fonksiyonları, alt satır iki histogram ve bir saçılım. 4) Tan panelinde <code>set_ylim</code> şarttır çünkü tan, π/2'de patlar; y eksenini sınırlamadan grafik okunamaz olurdu. 5) <code>fig.suptitle</code> tüm figürü kapsayan tek bir başlık çizer -- alt grafiklerin <code>set_title</code> ile kendi başlıkları olur. 6) <code>plt.tight_layout()</code> aralıkları otomatik ayarlar, böylece etiketler çakışmaz. 7) <code>plt.show()</code> hepsini render eder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">dönüş değeri</div><div class="card-body"><code>plt.subplots(r, c)</code>, <code>(fig, axes)</code> döndürür. r ve c'nin ikisi de >= 2 ise <code>axes</code>, <code>(r, c)</code> şekilli bir NumPy dizisidir; biri 1 ise 1B dizidir; r=c=1 ise tek bir Axes'tir.</div></div>
<div class="calc-card"><div class="card-title">indeksleme</div><div class="card-body">2B ızgara: <code>axes[satir, sutun]</code>. 1B grafik dizisi: <code>axes[i]</code>. Emin değilseniz her zaman <code>axes.shape</code> ile kontrol edin.</div></div>
<div class="calc-card"><div class="card-title">figsize</div><div class="card-body">İnç cinsinden. 2x3 ızgara genellikle (12, 6) veya (14, 8) gibi bir şey ister. Etiketler sıkışık görünüyorsa daha büyük yapın.</div></div>
<div class="calc-card"><div class="card-title">flatten()</div><div class="card-body"><code>for ax in axes.flatten(): ax.set_xlabel("x")</code> ızgaranın şeklinden bağımsız olarak her axes'e bir ayar uygular.</div></div>
<div class="calc-card"><div class="card-title">suptitle</div><div class="card-body"><code>fig.suptitle("...")</code> tüm figüre yayılan bir başlık çizer. Her alt grafik yine yerel etiketi için kendi <code>ax.set_title</code>'ına sahiptir.</div></div>
<div class="calc-card"><div class="card-title">tight_layout</div><div class="card-body">Sonda bir kez çalıştırarak kenar boşluğu çakışmasını otomatik düzeltir. Modern alternatif: <code>plt.subplots</code>'a <code>constrained_layout=True</code> geçirmek.</div></div>
</div>

<div id="plot-mpl-l3-grid-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> 2x3'lük bir Matplotlib subplot ızgarasının Plotly aynası. Üst satır: üç deterministik eğri (sin, cos, sınırlı y ile tan). Alt satır: iki dağılımın histogramları ve bir Gauss-vs-Gauss saçılımı. Aynı Figure altı paneli barındırır, her birinin kendi ölçeği, kendi başlığı ve tam bağımsızlığı vardır -- yine de tek bir görüntü olarak kaydedebileceğiniz tek bir tuvali paylaşırlar.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. tight_layout, constrained_layout, subplots_adjust</h2>

<p class="l-text">Alt grafikler ilk yerleştirildiğinde, varsayılan aralık genellikle eksen etiketlerini ve başlık çubuklarını kırpar. Bunu düzeltmek için üç araç vardır; hangisine ne zaman uzanacağınızı bilmeniz gerekir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">plt.tight_layout()</div><div class="compare-item">Sonda bir kez çağırın</div><div class="compare-item">Kenar boşluğu/dolguyu otomatik ayarlar</div><div class="compare-item">Açgözlü, suptitle'ı sıkıştırabilir</div><div class="compare-item">Eski, iyi test edilmiş</div><div class="compare-item">Kullanım: rastgele figürlerin %90'ı</div></div>
<div class="compare-col"><div class="compare-title">constrained_layout=True</div><div class="compare-item"><code>plt.subplots</code> oluşturulurken geçirilir</div><div class="compare-item">Çizim sırasında sürekli yeniden düzen</div><div class="compare-item">Renk çubuklarını ve suptitle'ları temiz tutar</div><div class="compare-item">Modern, yeni kod için önerilen</div><div class="compare-item">Kullanım: karmaşık çoklu panel figürler</div></div>
<div class="compare-col"><div class="compare-title">subplots_adjust(...)</div><div class="compare-item">Manuel kontrol: left, right, top, bottom, wspace, hspace</div><div class="compare-item">Hiçbir şey otomatik değil</div><div class="compare-item">Son %5'i ayarlamak için kullanılır</div><div class="compare-item">Otomatik düzenden sonra geçersiz kılar</div><div class="compare-item">Kullanım: hassas dergi düzenleri</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">5</span>, <span class="num">100</span>)

<span class="cm"># Modern tercih edilen yol: constrained_layout</span>
fig, axes = plt.<span class="fn">subplots</span>(
    <span class="num">2</span>, <span class="num">2</span>,
    figsize=(<span class="num">9</span>, <span class="num">6</span>),
    constrained_layout=<span class="kw">True</span>   <span class="cm"># cizim sirasinda araliklari otomatik ayarlar</span>
)

axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x));     axes[<span class="num">0</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"sin(x)"</span>)
axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x));     axes[<span class="num">0</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"cos(x)"</span>)
axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x));    axes[<span class="num">1</span>, <span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"exp(-x)"</span>)
axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">log1p</span>(x));   axes[<span class="num">1</span>, <span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"log(1 + x)"</span>)

<span class="kw">for</span> ax <span class="kw">in</span> axes.<span class="fn">flatten</span>():
    ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
    ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
    ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"constrained_layout ile dort panel"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()

<span class="cm"># --- Son %5'in manuel ayari ---</span>
<span class="cm"># fig.subplots_adjust(top=0.90, bottom=0.10, left=0.08, right=0.97,</span>
<span class="cm">#                     wspace=0.30, hspace=0.40)</span></code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 100 noktalık bir x ızgarası oluşturur. 2) <code>plt.subplots(2, 2, ..., constrained_layout=True)</code> 2x2'lik bir ızgara oluşturur ve modern otomatik düzen motorunu açar; bu, yeni kodda <code>tight_layout</code>'un önerilen yerine geçenidir. 3) Her hücreye bir fonksiyon çizilir, her birinin kendi başlığı vardır. 4) <code>for ax in axes.flatten()</code> dört neredeyse aynı satır yazmadan her panele ortak biçimleme (xlabel, ylabel, grid) uygular. 5) <code>suptitle</code> genel başlığı ekler; constrained_layout onu bilir ve yer ayırır. 6) Yorum satırındaki <code>subplots_adjust</code> çağrısı, otomatik düzen elinden geleni yaptıktan sonra piksel düzeyinde kontrole ihtiyacınız varsa aralığı nasıl geçersiz kılacağınızı gösterir.</p>

<div class="l-warn"><strong>Yaygın tuzak:</strong> ikisini birlikte kullanmak. <code>constrained_layout=True</code> ayarladıktan sonra <code>plt.tight_layout()</code> çağırırsanız uyarılar ve öngörülemez sonuçlar alırsınız. Birini seçin. Yeni kod için constrained_layout'u seçin.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GridSpec: Asimetrik Düzenler</h2>

<p class="l-text">Paneller hep aynı boyutta olmadığında -- geniş bir üst banner, altta iki eşit yarım, sağda uzun bir renk çubuğu -- <code>plt.subplots</code> çok katıdır. Kaçış kapısı <strong>GridSpec</strong>'tir: bir slot ızgarası tanımlayın, sonra o slotların keyfi dikdörtgen aralıklarını talep edin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> matplotlib.gridspec <span class="kw">as</span> gridspec
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
x = rng.<span class="fn">normal</span>(size=<span class="num">500</span>)
y = rng.<span class="fn">normal</span>(size=<span class="num">500</span>)

fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">10</span>, <span class="num">7</span>), constrained_layout=<span class="kw">True</span>)
gs  = gridspec.<span class="fn">GridSpec</span>(<span class="num">3</span>, <span class="num">3</span>, figure=fig)

<span class="cm"># Buyuk ana sacilim sol-altta 2x2 blok kaplar</span>
ax_main = fig.<span class="fn">add_subplot</span>(gs[<span class="num">1</span>:<span class="num">3</span>, <span class="num">0</span>:<span class="num">2</span>])
<span class="cm"># Marjinal histogramlar</span>
ax_top  = fig.<span class="fn">add_subplot</span>(gs[<span class="num">0</span>,    <span class="num">0</span>:<span class="num">2</span>], sharex=ax_main)
ax_right= fig.<span class="fn">add_subplot</span>(gs[<span class="num">1</span>:<span class="num">3</span>,  <span class="num">2</span>  ], sharey=ax_main)

ax_main.<span class="fn">scatter</span>(x, y, s=<span class="num">12</span>, alpha=<span class="num">0.5</span>, color=<span class="str">"#c8a96e"</span>)
ax_main.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax_main.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)

ax_top.<span class="fn">hist</span>(x, bins=<span class="num">30</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.7</span>)
ax_top.<span class="fn">tick_params</span>(labelbottom=<span class="kw">False</span>)             <span class="cm"># gereksiz x etiketleri gizle</span>

ax_right.<span class="fn">hist</span>(y, bins=<span class="num">30</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.7</span>,
              orientation=<span class="str">"horizontal"</span>)
ax_right.<span class="fn">tick_params</span>(labelleft=<span class="kw">False</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"Eklem sacilim + marjinal histogramlar (GridSpec)"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Bağımsız Gauss'lardan 500 rastgele (x, y) çifti üretir -- standart "joint plot" veri seti. 2) <code>plt.figure</code> 10x7 boyutlu boş bir Figure açar ve constrained_layout etkindir. 3) <code>gridspec.GridSpec(3, 3, figure=fig)</code> figürü kavramsal olarak 3x3'lük slot ızgarasına böler. 4) <code>fig.add_subplot(gs[1:3, 0:2])</code> ana saçılım axes'i olarak sol-alttaki 2x2 bloğu talep eder; <code>gs[0, 0:2]</code> üst satırın ilk iki sütununu x-marjin histogramı için talep eder; <code>gs[1:3, 2]</code> sağ sütunu y-marjin için talep eder. 5) Üst axes'teki <code>sharex=ax_main</code>, x'in pan/zoom'unun tutarlı kalacağı anlamına gelir; sağ axes'teki <code>sharey=ax_main</code> y aralığını paylaşır. 6) <code>tick_params(labelbottom=False)</code> üst histogramda gereksiz x tik etiketlerini gizler (zaten ana axes ile aynıdırlar). 7) Sağ histogram yatay çizilir, böylece çubukları ana saçılımın y eksenine hizalanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GridSpec(rows, cols)</div><div class="card-body">Sanal bir ızgara tanımlar. Sonra dilimleme ile alt grafikleri ondan oyarsınız: <code>gs[1:3, 0:2]</code> 1-2 satırlarını ve 0-1 sütunlarını talep eder.</div></div>
<div class="calc-card"><div class="card-title">add_subplot(gs[...])</div><div class="card-body">Dilimi dolduran bir Axes oluşturur. Dilim, ayrık parçalar dahil herhangi bir dikdörtgen olabilir (add_subplot'u birden çok kez çağırırsınız).</div></div>
<div class="calc-card"><div class="card-title">width_ratios, height_ratios</div><div class="card-body"><code>GridSpec(2, 2, width_ratios=[3, 1])</code> sol sütunu sağdan üç kat geniş yapar.</div></div>
<div class="calc-card"><div class="card-title">subplot_mosaic</div><div class="card-body">Modern kısayol: <code>fig.subplot_mosaic("AAB\nCCB")</code> ASCII sanat kullanır -- birbirine değen harfler tek bir axes'e birleşir.</div></div>
</div>

<div id="plot-mpl-l3-gridspec-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Buradaki resim:</strong> Marjinal histogramlı bir eklem saçılım, GridSpec'in standart kullanımı. Ana axes (altın saçılım) 2x2 blokta yaşar; üst axes (x'in altın histogramı) x eksenini paylaşır; sağ axes (y'nin teal yatay histogramı) y eksenini paylaşır. Bu kompakt "joint plot" görünümü, EDA'daki en bilgilendirici iki değişkenli tanılardan biridir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Paylaşılan Eksenler: sharex, sharey</h2>

<p class="l-text">Birden çok panel bir eksende aynı değişkeni gösterdiğinde, genellikle o ekseni tam olarak paylaşmalarını istersiniz: birinde yakınlaştırın, diğerleri de yakınlaşsın ve ortak tikler yalnızca bir kez render olsun. <code>sharex</code> ve <code>sharey</code> bunu istemenin yoludur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

<span class="cm"># Dikey istiflenmis uc panel, hepsi ayni x eksenini paylasiyor</span>
fig, axes = plt.<span class="fn">subplots</span>(
    <span class="num">3</span>, <span class="num">1</span>,
    figsize=(<span class="num">8</span>, <span class="num">7</span>),
    sharex=<span class="kw">True</span>,                 <span class="cm"># ucu de ayni x araligini ve tikleri kullanir</span>
    constrained_layout=<span class="kw">True</span>
)

axes[<span class="num">0</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x),       color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
axes[<span class="num">0</span>].<span class="fn">set_ylabel</span>(<span class="str">"sin(x)"</span>)

axes[<span class="num">1</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) ** <span class="num">2</span>,  color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>)
axes[<span class="num">1</span>].<span class="fn">set_ylabel</span>(<span class="str">"sin^2(x)"</span>)

axes[<span class="num">2</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x) ** <span class="num">3</span>,  color=<span class="str">"#ff6b6b"</span>, linewidth=<span class="num">2</span>)
axes[<span class="num">2</span>].<span class="fn">set_ylabel</span>(<span class="str">"sin^3(x)"</span>)
axes[<span class="num">2</span>].<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)          <span class="cm"># yalnizca alt panel x etiketine ihtiyac duyar</span>

fig.<span class="fn">suptitle</span>(<span class="str">"Uc sinyal, paylasilan tek x ekseni"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) 0'dan 10'a 200 noktalık bir x ızgarası kurar. 2) <code>plt.subplots(3, 1, sharex=True)</code> üç axes'i dikey istifler ve x eksenlerini birbirine bağlar; ilk axes hangi aralıkta biterse, diğer ikisi otomatik olarak onu benimser ve tik etiketleri yalnızca alt panelde görünür. 3) Her panel sin(x)'in farklı bir kuvvetini çizer: orijinal, karesi ve küpü. 4) Yalnızca alt axes <code>set_xlabel</code> alır çünkü üstteki ikisi onun x eksenini paylaşır ve aksi halde etiketi boşuna tekrarlarlardı. 5) <code>suptitle</code> figür-geneli başlığı ekler. 6) <code>constrained_layout=True</code> aralığı otomatik halleder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">sharex=True / sharey=True</div><div class="card-body">Tüm axes'ler aynı x veya y'yi paylaşır. Birden çok sinyali aynı zaman ekseninde karşılaştırırken yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">sharex="row" / "col"</div><div class="card-body">Yalnızca satır içinde veya sütun içinde paylaşır. Her satırın farklı bir metrik, her sütunun farklı bir model çizdiği 2x3 ızgara için harikadır.</div></div>
<div class="calc-card"><div class="card-title">sharex=ax_main</div><div class="card-body">Daha önce oluşturduğunuz belirli bir Axes nesnesi ile paylaşır (bölüm 3'teki GridSpec joint-plot'ta kullanılmıştır).</div></div>
<div class="calc-card"><div class="card-title">tick_params</div><div class="card-body">sharex olsa bile bazen ara axes'lerin tik etiketlerini gizlemek istersiniz: <code>ax.tick_params(labelbottom=False)</code>.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: eğitim tanıları</div><div class="example-body">Eğitim sırasında yaygın bir 3x1 figür: üst panel = kayıp eğrileri (eğitim, doğrulama), orta panel = doğruluk eğrileri (eğitim, doğrulama), alt panel = öğrenme oranı planlaması. Üçü de epok eksenini paylaşır. <code>sharex=True</code> ile <code>set_xlabel("epok")</code>'u tam olarak alt panelde bir kez yazarsınız ve figür anında yayına hazır görünür.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Inset Axes: Bir Bölgeye Yakınlaştırma</h2>

<p class="l-text">Bazen verinizin küçük bir bölgesi tüm hikâyedir -- iterasyon 3000'deki ani sıçrama, aykırı küme, kayıp eğrisindeki dirsek. <strong>Inset</strong>, ana axes'in <em>içinde</em> yaşayan ve o bölgeye yakınlaşan küçük bir yardımcı axes'tir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">2</span>)
x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">100</span>, <span class="num">1000</span>)
y = np.<span class="fn">exp</span>(-x / <span class="num">30</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, x.size)
<span class="cm"># x = 60 civarinda yapay bir sicrama yerlestir</span>
y[<span class="num">600</span>:<span class="num">610</span>] += <span class="num">0.4</span>

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, y, linewidth=<span class="num">1.2</span>, color=<span class="str">"#c8a96e"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"iterasyon"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"kayip"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Iterasyon 60 civarinda sicrama olan egitim kaybi"</span>)

<span class="cm"># --- Inset yakinlastirmasi ---</span>
axins = ax.<span class="fn">inset_axes</span>([<span class="num">0.55</span>, <span class="num">0.45</span>, <span class="num">0.40</span>, <span class="num">0.45</span>])  <span class="cm"># x, y, w, h axes oraninda</span>
axins.<span class="fn">plot</span>(x, y, linewidth=<span class="num">1.2</span>, color=<span class="str">"#c8a96e"</span>)
axins.<span class="fn">set_xlim</span>(<span class="num">55</span>, <span class="num">70</span>)
axins.<span class="fn">set_ylim</span>(<span class="num">0</span>, <span class="num">0.8</span>)
axins.<span class="fn">set_xticklabels</span>([])    <span class="cm"># daha temiz gorunum</span>
axins.<span class="fn">set_yticklabels</span>([])
ax.<span class="fn">indicate_inset_zoom</span>(axins, edgecolor=<span class="str">"#4ecdc4"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Küçük Gauss gürültülü 1000 iterasyonluk üstel azalan kayıp oluşturur, sonra eğitim instabilitesini taklit etmek için iterasyon 600 ile 610 arasına bir sıçrama ekler. 2) Tam eğriyi ana axes'e çizer. 3) <code>ax.inset_axes([0.55, 0.45, 0.40, 0.45])</code> ana axes'in sağ üst çeyreğinde bir alt-axes oluşturur -- dört sayı (x, y, genişlik, yükseklik), veri koordinatlarında değil, ebeveyn axes'in oranlarında. 4) Aynı kayıp inset'e yeniden çizilir, sonra <code>set_xlim</code> ve <code>set_ylim</code> sıçramanın yaşadığı 55-70 iterasyonlarına yakınlaşır. 5) Inset'in tik etiketleri görsel olarak temiz tutmak için gizlenir. 6) <code>ax.indicate_inset_zoom(axins, edgecolor=...)</code> ana axes'te dikdörtgeni ve "inset'teki bu küçük kutu, ana grafikteki şu bölgeye karşılık gelir" diyen bağlantı çizgilerini çizer -- bir yakınlaştırma kutusunu okunabilir kılan budur.</p>

<div class="l-note"><strong>Inset'leri ne zaman kullanmalı:</strong> okuyucunun gözünün küresel bağlamı kaybetmeden küçük bir bölgeye yönlendirilmesi gereken her zaman. Optimizasyon makalelerinde (yakınsama kuyruğuna yakınlaştırma), spektroskopi'de (bir tepeye yakınlaştırma) ve NLP dikkat grafiklerinde (birkaç ilginç token'a yakınlaştırma) yaygındır.</div>

<div id="plot-mpl-l3-inset-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin özü:</strong> İterasyon 60 civarında kasıtlı bir sıçrama olan uzun bir eğitim kayıp eğrisi ve sağ üst köşede tam o bölgeye yakınlaşan küçük bir inset axes. Inset aynı veriyi kullanır, sadece x ve y sınırlarıyla kırpılmıştır ve dikdörtgen göstergeci aracılığıyla ana grafiğe bağlanır. Araştırma makaleleri "buraya bak" mesajını küresel anlatıyı bozmadan böyle verir.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Küçük Çoklamalar: Bir Hikâye, Çok Panel</h2>

<p class="l-text">Bir <strong>küçük çoklamalar</strong> figürü, aynı grafiği bir kategorik boyutta birçok kez tekrarlanmış olarak gösterir: sınıf başına bir histogram, model başına bir eğri, dikkat başlığı başına bir ısı haritası. Göz ızgarayı tarar, örüntüleri yakalar ve tek bir resim koca bir tabloyu yerinden eder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">3</span>)
n_classes = <span class="num">9</span>
x = np.<span class="fn">linspace</span>(-<span class="num">4</span>, <span class="num">4</span>, <span class="num">200</span>)

fig, axes = plt.<span class="fn">subplots</span>(
    <span class="num">3</span>, <span class="num">3</span>,
    figsize=(<span class="num">10</span>, <span class="num">8</span>),
    sharex=<span class="kw">True</span>, sharey=<span class="kw">True</span>,            <span class="cm"># ozdes olcekler => adil karsilastirma</span>
    constrained_layout=<span class="kw">True</span>
)

<span class="kw">for</span> k, ax <span class="kw">in</span> <span class="fn">enumerate</span>(axes.<span class="fn">flatten</span>()):
    mu, sigma = rng.<span class="fn">uniform</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>), rng.<span class="fn">uniform</span>(<span class="num">0.4</span>, <span class="num">1.2</span>)
    samples = rng.<span class="fn">normal</span>(mu, sigma, <span class="num">500</span>)
    ax.<span class="fn">hist</span>(samples, bins=<span class="num">25</span>, density=<span class="kw">True</span>,
            color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.7</span>, edgecolor=<span class="str">"white"</span>)
    <span class="cm"># Baglam icin gercek Gauss'u uzerine bindir</span>
    ax.<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-(x - mu) ** <span class="num">2</span> / (<span class="num">2</span> * sigma ** <span class="num">2</span>)) /
                 (sigma * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.pi)),
            color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>)
    ax.<span class="fn">set_title</span>(f<span class="str">"sinif {k}: mu={mu:.1f}, sigma={sigma:.1f}"</span>, fontsize=<span class="num">10</span>)
    ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.2</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"Kucuk coklamalar: 9 sinif kosullu dagilim"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Yeniden üretilebilirlik için tohum ayarlar ve dokuz sınıf seçer. 2) Daha sonra analitik Gauss eğrilerini üst üste bindirmek için bir x ızgarası tanımlar. 3) <code>plt.subplots(3, 3, sharex=True, sharey=True)</code> her panelin özdeş x ve y sınırları kullandığı 3x3'lük bir ızgara oluşturur -- bu, küçük çoklamalar için tartışılmazdır; paylaşılan ölçekler olmadan göz histogramları adil karşılaştıramaz. 4) <code>for k, ax in enumerate(axes.flatten())</code> ızgaranın şeklinden bağımsız olarak dokuz axes'in tümünü dolaşır. 5) Her biri için farklı bir mu ve sigma çekilir, 500 örnek üretilir ve ampirik histogram çizilir; <code>density=True</code> olasılık yoğunluğuna normalize eder. 6) Gerçek Gauss PDF'i teal renginde üst üste bindirilir, böylece okuyucu ampirik dağılımı analitik gerçekle karşılaştırabilir. 7) Her alt grafiğin başlığı parametrelerini gösterir, böylece figür kendini açıklar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">paylaşılan ölçekler</div><div class="card-body">Küçük çoklamalar için her zaman <code>sharex=True, sharey=True</code> geçirin. Aksi halde paneller görsel olarak karşılaştırılamaz.</div></div>
<div class="calc-card"><div class="card-title">mini başlıklar</div><div class="card-body">Her panelin temsil ettiği dilimin etiketine ihtiyacı vardır (sınıf id, model adı, başlık dizini). Kısa tutun -- en fazla 10-15 karakter.</div></div>
<div class="calc-card"><div class="card-title">density=True</div><div class="card-body"><code>hist</code>'te alanı 1'e normalize eder -- farklı örnek sayılarına sahip dağılımları karşılaştırmak için yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">ML kullanım örnekleri</div><div class="card-body">Sınıf başına karışıklık matrisleri, başlık başına dikkat haritaları, özellik başına dağılımlar, hiperparametre taramalarındaki öğrenme eğrileri.</div></div>
</div>

<div id="plot-mpl-l3-small-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> 3x3'lük bir sınıf koşullu Gauss örnekleri ızgarası, her birine analitik PDF üst üste bindirilmiştir. Tüm paneller aynı x ve y ölçeklerini paylaştığı için gözünüz hangi sınıfların geniş veya dar dağılımlara sahip olduğunu ve hangilerinin sıfırdan uzak ortalandığını anında karşılaştırabilir. Bu örüntü -- kategorik bir değişkenin her dilimi için bir grafik -- Edward Tufte'nin popülerleştirdiği "küçük çoklamalar" deyimidir ve çok sınıflı bir problemi görselleştirmenin açık ara en bilgilendirici yoludur.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. subplot_mosaic: ASCII-Sanat Düzenleri</h2>

<p class="l-text">Karmaşık bir düzen istiyorsanız ama GridSpec'i fazla ayrıntılı buluyorsanız, <code>fig.subplot_mosaic</code> düzeninizi ASCII sanat olarak çizmenize izin verir. Birbirine değen harfler tek bir axes'e birleşir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

fig, axd = plt.<span class="fn">subplot_mosaic</span>(
    <span class="str">"""
    AAB
    CCB
    DDD
    """</span>,
    figsize=(<span class="num">10</span>, <span class="num">7</span>),
    constrained_layout=<span class="kw">True</span>
)

axd[<span class="str">"A"</span>].<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), color=<span class="str">"#c8a96e"</span>); axd[<span class="str">"A"</span>].<span class="fn">set_title</span>(<span class="str">"A"</span>)
axd[<span class="str">"B"</span>].<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x), color=<span class="str">"#4ecdc4"</span>); axd[<span class="str">"B"</span>].<span class="fn">set_title</span>(<span class="str">"B (uzun)"</span>)
axd[<span class="str">"C"</span>].<span class="fn">plot</span>(x, np.<span class="fn">tan</span>(x).<span class="fn">clip</span>(-<span class="num">3</span>, <span class="num">3</span>), color=<span class="str">"#ff6b6b"</span>); axd[<span class="str">"C"</span>].<span class="fn">set_title</span>(<span class="str">"C"</span>)
axd[<span class="str">"D"</span>].<span class="fn">plot</span>(x, np.<span class="fn">exp</span>(-x / <span class="num">3</span>), color=<span class="str">"#a78bfa"</span>); axd[<span class="str">"D"</span>].<span class="fn">set_title</span>(<span class="str">"D (genis alt seritu)"</span>)

fig.<span class="fn">suptitle</span>(<span class="str">"subplot_mosaic: ASCII duzeni"</span>, fontsize=<span class="num">14</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Üçlü tırnaklı dize düzendir: 1. satır "AAB", 2. satır "CCB", 3. satır "DDD". İki A bitişik olduğu için sol-üstün 2 sütununu kapsayan geniş bir axes'e birleşirler; B sağ sütunu 1-2 satırlarında işgal ettiği için uzun bir axes olur; üç D geniş bir alt banner'a birleşir. 2) <code>fig.subplot_mosaic(...)</code> her harfi Axes nesnesine eşleyen bir sözlük döndürür. 3) <code>axd["A"]</code>, <code>axd["B"]</code>, vb. dört birleştirilmiş axes'i çizmeye hazır verir. 4) Her biri kendi eğrisini ve başlığını alır; tuval-geneli başlık <code>suptitle</code> ile eklenir. 5) <code>constrained_layout=True</code> aralıkları otomatik halleder.</p>

<div class="calc-highlight"><strong>Genel kural:</strong> düzeniniz düzenli bir dikdörtgen ızgaraysa <code>plt.subplots</code> kullanın. Paneller farklı boyutlardaysa ama düzen basitse <code>subplot_mosaic</code> kullanın. Yalnızca ilk iki yetmediğinde <code>GridSpec</code>'e uzanın -- ör. width_ratios'a ihtiyacınız varsa veya düzeni programatik olarak üretiyorsanız.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Düzen Karar Ağacı</h2>

<p class="l-text">Birden çok panel yerleştirirken doğru aracı seçmek için yoğunlaştırılmış bir karar ağacı.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>Tek grafik?</strong> <code>fig, ax = plt.subplots()</code>. Bitti.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>Düzenli ızgara (NxM, tüm paneller eşit)?</strong> <code>fig, axes = plt.subplots(N, M, constrained_layout=True)</code>. <code>axes[r, c]</code> ile indeksleyin.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Paneller boyunca aynı x veya y ekseni?</strong> <code>sharex=True</code> ve/veya <code>sharey=True</code> ekleyin.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Bazı paneller diğerlerinden büyük ama düzen basit?</strong> <code>fig.subplot_mosaic("AAB\\nCCB")</code>. Birbirine değen harfler birleşir.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>width_ratios, height_ratios veya programatik üretime ihtiyaç var?</strong> <code>gridspec.GridSpec(...)</code> + <code>fig.add_subplot(gs[...])</code>.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Bir axes'in bir bölgesine yakınlaşmak ister misiniz?</strong> <code>axins = ax.inset_axes([x, y, w, h])</code> ve <code>ax.indicate_inset_zoom(axins)</code>.</div></div>
<div class="step-row"><div class="step-num">7</div><div class="step-body"><strong>Aralık sıkışık mı görünüyor?</strong> Oluşturma zamanında <code>constrained_layout=True</code> geçirin veya sonda <code>plt.tight_layout()</code> çağırın. İkisini birden asla.</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> <code>plt.subplots(rows, cols)</code> beygir gücüdür: bir Figure ve normal şekilde indekslediğiniz bir NumPy axes dizisi döndürür.<br><strong>2.</strong> Sonda <code>tight_layout</code> yerine oluşturmada <code>constrained_layout=True</code> kullanın -- ve asla ikisini birden.<br><strong>3.</strong> <code>sharex</code> ve <code>sharey</code> eksenleri birbirine bağlar, böylece pan, zoom ve tik etiketleri tutarlı kalır.<br><strong>4.</strong> <code>GridSpec</code> düzenli ızgara sınırlamasından kaçar: asimetrik düzenler için keyfi dikdörtgen aralıkları talep edin.<br><strong>5.</strong> <code>subplot_mosaic</code> düzenleri ASCII sanat olarak yazar -- GridSpec ayrıntıcılığı olmadan orta düzeyde düzensiz figürler için harika.<br><strong>6.</strong> <code>inset_axes</code> + <code>indicate_inset_zoom</code> okuyucuyu küresel bağlamı kaybetmeden küçük önemli bir bölgeye yönlendirme yolunuzdur.<br><strong>7.</strong> Küçük çoklamalar (NxM ızgara + paylaşılan eksenler) ML'deki en güçlü tanı düzenidir: sınıf, başlık, model veya bölme başına bir panel.<br><strong>8.</strong> Karar sırası: düzenli -&gt; subplots, düzensiz-ama-basit -&gt; subplot_mosaic, karmaşık -&gt; GridSpec.</div></div>
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

  // 1. 2x3 subplot grid
  function gridDemo(id, suptitle, lblHist1, lblHist2, lblScatter){
    var el = document.getElementById(id); if(!el) return;
    var x=[]; for (var i=0;i<200;i++) x.push(i/20);
    var sin = x.map(function(v){return Math.sin(v);});
    var cos = x.map(function(v){return Math.cos(v);});
    var tan = x.map(function(v){var t=Math.tan(v);return Math.max(-5,Math.min(5,t));});
    function rndSeed(s){return function(){s=(s*9301+49297)%233280;return s/233280-0.5;}}
    var rng = rndSeed(0);
    var gauss=[]; for (var j=0;j<500;j++){var u1=Math.random()||1e-9,u2=Math.random();gauss.push(Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));}
    var expo=[]; for (var k=0;k<500;k++){expo.push(-Math.log(Math.random()||1e-9));}
    var sx=[],sy=[]; for (var l=0;l<200;l++){var u3=Math.random()||1e-9,u4=Math.random();sx.push(Math.sqrt(-2*Math.log(u3))*Math.cos(2*Math.PI*u4));sy.push(Math.sqrt(-2*Math.log(u3))*Math.sin(2*Math.PI*u4));}
    var traces = [
      {x:x,y:sin,mode:'lines',line:{color:T.accent,width:2},name:'sin(x)',xaxis:'x1',yaxis:'y1'},
      {x:x,y:cos,mode:'lines',line:{color:'#4ecdc4',width:2},name:'cos(x)',xaxis:'x2',yaxis:'y2'},
      {x:x,y:tan,mode:'lines',line:{color:'#ff6b6b',width:2},name:'tan(x)',xaxis:'x3',yaxis:'y3'},
      {x:gauss,type:'histogram',marker:{color:T.accent,opacity:0.8},name:lblHist1,xaxis:'x4',yaxis:'y4'},
      {x:expo,type:'histogram',marker:{color:'#4ecdc4',opacity:0.8},name:lblHist2,xaxis:'x5',yaxis:'y5'},
      {x:sx,y:sy,mode:'markers',marker:{color:'#a78bfa',size:5,opacity:0.6},type:'scatter',name:lblScatter,xaxis:'x6',yaxis:'y6'}
    ];
    var layout = Object.assign({}, common, {
      title:{text:suptitle,font:{color:T.text,size:14}},
      grid:{rows:2,columns:3,pattern:'independent'},
      height:480, showlegend:false,
      xaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      xaxis2:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      xaxis3:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      xaxis4:{gridcolor:T.grid,zerolinecolor:T.zero,title:'value'},
      xaxis5:{gridcolor:T.grid,zerolinecolor:T.zero,title:'value'},
      xaxis6:{gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      yaxis:{gridcolor:T.grid,zerolinecolor:T.zero,title:'sin'},
      yaxis2:{gridcolor:T.grid,zerolinecolor:T.zero,title:'cos'},
      yaxis3:{gridcolor:T.grid,zerolinecolor:T.zero,title:'tan',range:[-5,5]},
      yaxis4:{gridcolor:T.grid,zerolinecolor:T.zero,title:'count'},
      yaxis5:{gridcolor:T.grid,zerolinecolor:T.zero,title:'count'},
      yaxis6:{gridcolor:T.grid,zerolinecolor:T.zero,title:'y'}
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  gridDemo('plot-mpl-l3-grid-en','plt.subplots(2, 3): six panels','Gaussian','Exponential','scatter');
  gridDemo('plot-mpl-l3-grid-tr','plt.subplots(2, 3): alti panel','Gauss','Ustel','sacilim');

  // 2. GridSpec joint plot
  function jointPlot(id, suptitle){
    var el = document.getElementById(id); if(!el) return;
    var x=[],y=[];
    for (var i=0;i<500;i++){
      var u1=Math.random()||1e-9,u2=Math.random();
      x.push(Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));
      y.push(Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2));
    }
    var traces = [
      {x:x,y:y,mode:'markers',type:'scatter',marker:{color:T.accent,size:6,opacity:0.5},xaxis:'x',yaxis:'y',name:'data',showlegend:false},
      {x:x,type:'histogram',marker:{color:T.accent,opacity:0.7},xaxis:'x',yaxis:'y2',name:'x',showlegend:false},
      {y:y,type:'histogram',marker:{color:'#4ecdc4',opacity:0.7},xaxis:'x2',yaxis:'y',name:'y',showlegend:false}
    ];
    var layout = Object.assign({}, common, {
      title:{text:suptitle,font:{color:T.text,size:14}},
      xaxis:{domain:[0,0.78],gridcolor:T.grid,zerolinecolor:T.zero,title:'x'},
      yaxis:{domain:[0,0.78],gridcolor:T.grid,zerolinecolor:T.zero,title:'y'},
      xaxis2:{domain:[0.80,1.0],gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{domain:[0.80,1.0],gridcolor:T.grid,zerolinecolor:T.zero},
      bargap:0.05, height:520, showlegend:false
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  jointPlot('plot-mpl-l3-gridspec-en','Joint scatter + marginal histograms (GridSpec)');
  jointPlot('plot-mpl-l3-gridspec-tr','Eklem sacilim + marjinal histogramlar (GridSpec)');

  // 3. Inset zoom
  function insetDemo(id, title, xl, yl){
    var el = document.getElementById(id); if(!el) return;
    var x=[],y=[];
    for (var i=0;i<1000;i++){
      var xi = i/10;
      var yi = Math.exp(-xi/30) + (Math.random()-0.5)*0.04;
      if (i>=600 && i<610) yi += 0.4;
      x.push(xi); y.push(yi);
    }
    var x2 = x.slice(550,700);
    var y2 = y.slice(550,700);
    var traces = [
      {x:x,y:y,mode:'lines',line:{color:T.accent,width:1.4},name:'main',xaxis:'x',yaxis:'y',showlegend:false},
      {x:x2,y:y2,mode:'lines',line:{color:T.accent,width:1.4},name:'inset',xaxis:'x2',yaxis:'y2',showlegend:false}
    ];
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{domain:[0,1],gridcolor:T.grid,zerolinecolor:T.zero,title:xl},
      yaxis:{domain:[0,1],gridcolor:T.grid,zerolinecolor:T.zero,title:yl},
      xaxis2:{domain:[0.55,0.96],anchor:'y2',gridcolor:T.grid,zerolinecolor:T.zero,range:[55,70]},
      yaxis2:{domain:[0.45,0.92],anchor:'x2',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,0.8]},
      shapes:[
        {type:'rect',xref:'x',yref:'y',x0:55,y0:0,x1:70,y1:0.8,line:{color:'#4ecdc4',width:1.5,dash:'dash'},fillcolor:'rgba(78,205,196,0.05)'}
      ],
      height:420, showlegend:false
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  insetDemo('plot-mpl-l3-inset-en','Training loss with inset zoom on the spike','iteration','loss');
  insetDemo('plot-mpl-l3-inset-tr','Egitim kaybi: ani tirmanmaya yakinlasma kutusu','iterasyon','kayip');

  // 4. Small multiples 3x3
  function smallMultiples(id, suptitle){
    var el = document.getElementById(id); if(!el) return;
    var traces = [];
    var seed = 3;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var xGrid=[]; for (var i=0;i<200;i++) xGrid.push(-4+8*i/199);
    for (var k=0;k<9;k++){
      var mu = -1.5 + 3*rnd();
      var sigma = 0.4 + 0.8*rnd();
      var samples=[];
      for (var n=0;n<500;n++){
        var u1=Math.random()||1e-9,u2=Math.random();
        samples.push(mu + sigma*Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));
      }
      var pdf = xGrid.map(function(v){return Math.exp(-(v-mu)*(v-mu)/(2*sigma*sigma))/(sigma*Math.sqrt(2*Math.PI));});
      var ax = 'x'+(k+1), ay = 'y'+(k+1);
      traces.push({x:samples,type:'histogram',histnorm:'probability density',marker:{color:T.accent,opacity:0.7},xaxis:ax,yaxis:ay,showlegend:false,name:'class '+k});
      traces.push({x:xGrid,y:pdf,mode:'lines',line:{color:'#4ecdc4',width:2},xaxis:ax,yaxis:ay,showlegend:false,name:'PDF'});
    }
    var layout = Object.assign({}, common, {
      title:{text:suptitle,font:{color:T.text,size:14}},
      grid:{rows:3,columns:3,pattern:'independent'},
      height:560, showlegend:false, bargap:0.05
    });
    for (var j=1;j<=9;j++){
      layout['xaxis'+(j===1?'':j)] = {gridcolor:T.grid,zerolinecolor:T.zero,range:[-4,4]};
      layout['yaxis'+(j===1?'':j)] = {gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.1]};
    }
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  smallMultiples('plot-mpl-l3-small-en','Small multiples: 9 class-conditional distributions');
  smallMultiples('plot-mpl-l3-small-tr','Kucuk coklamalar: 9 sinif kosullu dagilim');
},250);</script>
`
};
