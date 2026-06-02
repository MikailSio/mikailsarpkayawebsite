window.MATPLOTLIB_L5 = {

en: `<p class="l-text"><strong>Three-dimensional and matrix-like visualisations are where Matplotlib shines unexpectedly.</strong> A loss surface, a decision boundary in feature space, an attention matrix between every query and every key, a learned similarity matrix between 1000 sentence embeddings -- all of these need either a 3D surface or a 2D heatmap, and Matplotlib has both built in. In this lesson we cover the mpl_toolkits 3D API, contour plots, <code>imshow</code> heatmaps, colorbars, and a real ML use-case: visualising gradient descent walking down a loss surface.</p>

<p class="l-text">By the end you will draw a 3D surface from a meshgrid, overlay a contour map on the same data, render a confusion matrix as a heatmap, and animate the path of an optimiser stepping over a non-convex loss.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Render heatmaps with imshow and pcolormesh for matrices and confusion data</li><li>Pick perceptually uniform colormaps and avoid misleading rainbow palettes</li><li>Plot 3D surfaces and scatter plots with the mplot3d toolkit</li><li>Add colorbars and label them with units and tick formatters</li><li>Visualize gradients, decision boundaries, and 2D loss landscapes</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. mpl_toolkits.mplot3d: The 3D Module</h2>

<p class="l-text">Matplotlib's 3D plotting lives in a separate sub-package, <code>mpl_toolkits.mplot3d</code>, but you do not import it directly. You ask <code>plt.subplots</code> for a 3D projection and Matplotlib wires up a <code>Axes3D</code> object that has new methods like <code>plot_surface</code>, <code>scatter3D</code>, and <code>plot_wireframe</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Open a 3D axes (subplot_kw is the key)</span>
fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">8</span>, <span class="num">6</span>))
ax  = fig.<span class="fn">add_subplot</span>(<span class="num">111</span>, projection=<span class="str">"3d"</span>)

<span class="cm"># A simple 3D line</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">6</span> * np.pi, <span class="num">200</span>)
ax.<span class="fn">plot</span>(np.<span class="fn">cos</span>(t), np.<span class="fn">sin</span>(t), t, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)

<span class="cm"># A 3D scatter cloud</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
xs, ys, zs = rng.<span class="fn">normal</span>(size=(<span class="num">3</span>, <span class="num">200</span>))
ax.<span class="fn">scatter</span>(xs, ys, zs, c=zs, cmap=<span class="str">"viridis"</span>, s=<span class="num">18</span>, alpha=<span class="num">0.7</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>); ax.<span class="fn">set_zlabel</span>(<span class="str">"z"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"3D line + scatter"</span>)

<span class="cm"># Camera angle: elevation, azimuth</span>
ax.<span class="fn">view_init</span>(elev=<span class="num">20</span>, azim=<span class="num">35</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>fig.add_subplot(111, projection="3d")</code> is the gateway: pass <code>projection="3d"</code> and the returned axes is a <code>Axes3D</code>, with all the extra 3D methods. 2) <code>ax.plot(x, y, z, ...)</code> draws a 3D line; here a helix parameterised by t, going around in xy and rising in z. 3) <code>ax.scatter(xs, ys, zs, c=zs, cmap="viridis")</code> drops 200 points and colours them by their z value -- exactly like 2D scatter but with a third coordinate. 4) <code>set_zlabel</code> labels the third axis. 5) <code>ax.view_init(elev=20, azim=35)</code> rotates the camera: <code>elev</code> is how high above the floor you are looking down (in degrees), <code>azim</code> is the rotation around the vertical axis. Tweaking these is how you find the angle that makes your 3D plot readable.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">projection="3d"</div><div class="card-body">The single switch that turns a 2D Axes into a 3D Axes3D. Required for any 3D drawing.</div></div>
<div class="calc-card"><div class="card-title">plot, scatter</div><div class="card-body">Same names as 2D but accept a third coordinate. <code>ax.plot(x, y, z)</code>, <code>ax.scatter(x, y, z)</code>.</div></div>
<div class="calc-card"><div class="card-title">view_init</div><div class="card-body">Sets camera angle. <code>elev</code> is up-down (-90 to 90), <code>azim</code> is around the z axis (0 to 360).</div></div>
<div class="calc-card"><div class="card-title">interactivity</div><div class="card-body">In Jupyter with <code>%matplotlib widget</code> you can drag the figure to rotate. In static export you must pick a good angle and stick to it.</div></div>
</div>

<div class="l-warn"><strong>3D plots in print:</strong> 3D figures look great on screen but lose information when flattened to a static image. For papers, prefer 2D contour plots over 3D surfaces, or include both views (3D angle + top-down contour) side by side.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. plot_surface: Meshgrid + sin(x1)*cos(x2)</h2>

<p class="l-text">The classic 3D figure in any ML course is a smooth surface plotted from <code>z = f(x1, x2)</code>. The two ingredients are <code>np.meshgrid</code> (which turns 1D x and y arrays into 2D grids of pairs) and <code>ax.plot_surface</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Build the 2D grid</span>
x1 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">80</span>)
x2 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">80</span>)
X1, X2 = np.<span class="fn">meshgrid</span>(x1, x2)         <span class="cm"># X1, X2 are both (80, 80)</span>

<span class="cm"># 2) Evaluate the function at every grid point</span>
Z = np.<span class="fn">sin</span>(X1) * np.<span class="fn">cos</span>(X2)          <span class="cm"># also (80, 80)</span>

<span class="cm"># 3) Plot</span>
fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">9</span>, <span class="num">6</span>))
ax  = fig.<span class="fn">add_subplot</span>(<span class="num">111</span>, projection=<span class="str">"3d"</span>)
surf = ax.<span class="fn">plot_surface</span>(
    X1, X2, Z,
    cmap=<span class="str">"viridis"</span>,
    edgecolor=<span class="str">"none"</span>,            <span class="cm"># no wireframe lines on top</span>
    alpha=<span class="num">0.95</span>,
    rstride=<span class="num">2</span>, cstride=<span class="num">2</span>         <span class="cm"># row/col stride for speed</span>
)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x1"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"x2"</span>); ax.<span class="fn">set_zlabel</span>(<span class="str">"z"</span>)
ax.<span class="fn">set_title</span>(r<span class="str">"$z = \\\\sin(x_1)\\\\cdot \\\\cos(x_2)$"</span>)
ax.<span class="fn">view_init</span>(elev=<span class="num">28</span>, azim=-<span class="num">55</span>)
fig.<span class="fn">colorbar</span>(surf, ax=ax, shrink=<span class="num">0.6</span>, label=<span class="str">"z"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds two 1D arrays of 80 points each, from -3 to 3, for the x1 and x2 axes. 2) <code>np.meshgrid(x1, x2)</code> returns two 2D grids: <code>X1</code> contains the x1 value at every (i, j) cell, <code>X2</code> contains the x2 value. Together they parameterise the entire xy plane. 3) <code>Z = np.sin(X1) * np.cos(X2)</code> evaluates the function elementwise on every grid point in one vectorised expression -- no Python loops, NumPy broadcasts the work. 4) <code>fig.add_subplot(111, projection="3d")</code> opens a 3D axes. 5) <code>ax.plot_surface(X1, X2, Z, cmap="viridis", ...)</code> tessellates the grid into tiny coloured tiles whose heights are Z. <code>edgecolor="none"</code> removes the dark wireframe lines that <code>plot_surface</code> draws by default; the surface looks smoother. <code>rstride=2, cstride=2</code> uses every other row and column to speed rendering when grids are large. 6) <code>view_init</code> picks a viewing angle that makes both the peaks and valleys visible. 7) <code>fig.colorbar(surf, ...)</code> attaches a side bar mapping height to colour.</p>

<div id="plot-mpl-l5-surface-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 3D surface produced by evaluating sin(x1) * cos(x2) on a meshgrid. In ML, decision-boundary visualisations and loss surfaces are drawn exactly like this: build a meshgrid covering the input or parameter space, evaluate the model output or loss at every grid point, and call <code>plot_surface</code>. The colour follows the height so even in a static image the topology of the function is legible -- where it dips into valleys and rises to ridges.</div>

<div class="calc-highlight"><strong>The pattern you will reuse forever:</strong> meshgrid + vectorised function evaluation + plot_surface. This three-step recipe is how you visualise <em>any</em> two-input function: a loss landscape over two parameters, a decision boundary over two features, an objective over two hyperparameters.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Contour Plots: 2D Projection of 3D</h2>

<p class="l-text">A <strong>contour plot</strong> is the same data as a 3D surface but viewed top-down: each contour line connects all points with the same z value, like elevation lines on a topographic map. Contours are usually <em>more</em> readable than 3D surfaces in print because every point gets the same number of pixels and the line markings carry exact value information.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x1 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">200</span>)
x2 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">200</span>)
X1, X2 = np.<span class="fn">meshgrid</span>(x1, x2)
Z = np.<span class="fn">sin</span>(X1) * np.<span class="fn">cos</span>(X2)

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">2</span>, figsize=(<span class="num">12</span>, <span class="num">5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Left: contour lines (just the lines)</span>
cs = axes[<span class="num">0</span>].<span class="fn">contour</span>(X1, X2, Z, levels=<span class="num">12</span>, cmap=<span class="str">"viridis"</span>)
axes[<span class="num">0</span>].<span class="fn">clabel</span>(cs, inline=<span class="kw">True</span>, fontsize=<span class="num">9</span>, fmt=<span class="str">"%.1f"</span>)
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"contour: lines only"</span>)
axes[<span class="num">0</span>].<span class="fn">set_xlabel</span>(<span class="str">"x1"</span>); axes[<span class="num">0</span>].<span class="fn">set_ylabel</span>(<span class="str">"x2"</span>)

<span class="cm"># Right: filled contour (regions between lines coloured)</span>
cf = axes[<span class="num">1</span>].<span class="fn">contourf</span>(X1, X2, Z, levels=<span class="num">20</span>, cmap=<span class="str">"viridis"</span>)
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"contourf: filled"</span>)
axes[<span class="num">1</span>].<span class="fn">set_xlabel</span>(<span class="str">"x1"</span>); axes[<span class="num">1</span>].<span class="fn">set_ylabel</span>(<span class="str">"x2"</span>)
fig.<span class="fn">colorbar</span>(cf, ax=axes[<span class="num">1</span>], shrink=<span class="num">0.85</span>, label=<span class="str">"z"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds the same meshgrid as in section 2 and evaluates the same function. 2) The left axes uses <code>ax.contour(X1, X2, Z, levels=12, cmap="viridis")</code>: it draws 12 isolines (one per Z level) and colours each by the colormap. <code>clabel</code> writes the numeric z value inline on each line so you can read exact heights without a colorbar. 3) The right axes uses <code>ax.contourf</code> (note the f for "filled"): instead of just lines, it fills the regions <em>between</em> consecutive levels with a flat colour. The result looks like an aerial topographic map. 4) <code>fig.colorbar(cf, ...)</code> attaches a colour-to-z legend; <code>shrink=0.85</code> makes the bar a bit shorter than the axes height so it does not overpower.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">contour</div><div class="card-body">Just the isolines. Use when you want to see exact level values via inline labels.</div></div>
<div class="calc-card"><div class="card-title">contourf</div><div class="card-body">Filled regions between isolines. Use when you want to read overall topology at a glance.</div></div>
<div class="calc-card"><div class="card-title">levels</div><div class="card-body">Integer (number of evenly-spaced levels) or array (specific z values). Pass <code>levels=[-1, 0, 1]</code> to draw exactly those three.</div></div>
<div class="calc-card"><div class="card-title">clabel</div><div class="card-body">Inline numeric labels on contour lines. Combine with non-filled <code>contour</code> for self-documenting figures.</div></div>
</div>

<div id="plot-mpl-l5-contour-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The same sin(x1)*cos(x2) viewed as a filled contour. Bright yellow regions are peaks, dark purple regions are valleys, and the contour bands between them tell you exactly how steep or flat the function is at each location. Contours are the workhorse 2D visualisation of any 2-input scalar function -- and crucially they print well in greyscale, unlike 3D surfaces.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. imshow: Heatmaps for Matrices</h2>

<p class="l-text">For matrix-shaped data -- a confusion matrix, an attention matrix, a correlation matrix, a learned similarity matrix -- the right tool is <code>ax.imshow</code>. It draws each cell as a coloured pixel and you can overlay numbers on top.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Fake a confusion matrix for a 5-class problem</span>
labels = [<span class="str">"neg"</span>, <span class="str">"weak-neg"</span>, <span class="str">"neutral"</span>, <span class="str">"weak-pos"</span>, <span class="str">"pos"</span>]
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
cm = rng.<span class="fn">integers</span>(<span class="num">2</span>, <span class="num">12</span>, size=(<span class="num">5</span>, <span class="num">5</span>))
np.<span class="fn">fill_diagonal</span>(cm, rng.<span class="fn">integers</span>(<span class="num">40</span>, <span class="num">80</span>, size=<span class="num">5</span>))    <span class="cm"># strong diagonal</span>
cm = cm / cm.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)                <span class="cm"># row-normalise</span>

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">6</span>))
im = ax.<span class="fn">imshow</span>(cm, cmap=<span class="str">"Blues"</span>, vmin=<span class="num">0</span>, vmax=<span class="num">1</span>)

<span class="cm"># Tick locations and labels</span>
ax.<span class="fn">set_xticks</span>(np.<span class="fn">arange</span>(<span class="num">5</span>)); ax.<span class="fn">set_yticks</span>(np.<span class="fn">arange</span>(<span class="num">5</span>))
ax.<span class="fn">set_xticklabels</span>(labels);  ax.<span class="fn">set_yticklabels</span>(labels)
plt.<span class="fn">setp</span>(ax.<span class="fn">get_xticklabels</span>(), rotation=<span class="num">30</span>, ha=<span class="str">"right"</span>)

<span class="cm"># Print the value inside every cell</span>
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
        colour = <span class="str">"white"</span> <span class="kw">if</span> cm[i, j] &gt; <span class="num">0.5</span> <span class="kw">else</span> <span class="str">"black"</span>
        ax.<span class="fn">text</span>(j, i, f<span class="str">"{cm[i, j]:.2f}"</span>, ha=<span class="str">"center"</span>, va=<span class="str">"center"</span>,
                color=colour, fontsize=<span class="num">10</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"predicted"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"true"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Row-normalised confusion matrix"</span>)
fig.<span class="fn">colorbar</span>(im, ax=ax, label=<span class="str">"proportion"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a fake 5x5 confusion matrix: small off-diagonal values (2-12) and large diagonal values (40-80), then row-normalises so every row sums to 1 -- this turns counts into per-class recall proportions. 2) <code>ax.imshow(cm, cmap="Blues", vmin=0, vmax=1)</code> draws the matrix as a heatmap; <code>vmin/vmax=0/1</code> pins the colour scale to the proportion range so different runs are comparable. 3) Tick locations are set explicitly to the integer cell indices (<code>np.arange(5)</code>), and the tick labels are replaced with the human-readable class names. 4) <code>plt.setp(ax.get_xticklabels(), rotation=30, ha="right")</code> rotates the x labels 30 degrees so long category names do not overlap. 5) The double for-loop writes each cell's value inside the cell. The text colour is chosen by a brightness threshold: white text on dark blue cells, black text on light cells -- this guarantees readability regardless of the proportion. 6) <code>fig.colorbar(im, ...)</code> attaches a side bar mapping blue to proportion.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">imshow</div><div class="card-body">Draws a 2D array as an image. Cell (i, j) is at row i, column j -- so y axis runs top-to-bottom, like a matrix index.</div></div>
<div class="calc-card"><div class="card-title">vmin / vmax</div><div class="card-body">Pin the colour scale to a fixed range. Critical when comparing several heatmaps in a small-multiples grid.</div></div>
<div class="calc-card"><div class="card-title">aspect</div><div class="card-body"><code>aspect="equal"</code> (default for imshow) keeps cells square. <code>aspect="auto"</code> stretches to fill the axes.</div></div>
<div class="calc-card"><div class="card-title">in-cell text</div><div class="card-body">Always overlay the numeric values for confusion matrices and correlation matrices. The eye reads "0.78" much faster than the colour shade.</div></div>
</div>

<div id="plot-mpl-l5-cm-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A 5-class row-normalised confusion matrix rendered as a heatmap. Diagonal cells (correct predictions) are dark blue, near 0.6-0.8; off-diagonal cells are pale, indicating low confusion rates. The numeric overlay turns the figure into a self-contained table that does not require the colorbar to be readable. This is the canonical first plot you draw after evaluating any classifier.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Colorbars: The Side Legend for Continuous Colour</h2>

<p class="l-text">Whenever colour encodes a continuous value -- in <code>imshow</code>, <code>scatter(c=...)</code>, <code>contourf</code>, <code>plot_surface</code> -- you must include a <strong>colorbar</strong>. Without it the reader cannot decode "yellow means 0.8 vs blue means -0.2" and the figure is unreadable.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = rng.<span class="fn">normal</span>(size=<span class="num">400</span>)
y = rng.<span class="fn">normal</span>(size=<span class="num">400</span>)
v = x ** <span class="num">2</span> + y ** <span class="num">2</span>          <span class="cm"># numeric value per point</span>

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">3</span>, figsize=(<span class="num">14</span>, <span class="num">4.5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Default colorbar</span>
sc1 = axes[<span class="num">0</span>].<span class="fn">scatter</span>(x, y, c=v, cmap=<span class="str">"viridis"</span>, s=<span class="num">14</span>)
fig.<span class="fn">colorbar</span>(sc1, ax=axes[<span class="num">0</span>])
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"default colorbar"</span>)

<span class="cm"># Custom label, ticks, formatting</span>
sc2 = axes[<span class="num">1</span>].<span class="fn">scatter</span>(x, y, c=v, cmap=<span class="str">"viridis"</span>, s=<span class="num">14</span>)
cb2 = fig.<span class="fn">colorbar</span>(sc2, ax=axes[<span class="num">1</span>], shrink=<span class="num">0.85</span>, pad=<span class="num">0.02</span>)
cb2.<span class="fn">set_label</span>(r<span class="str">"radius$^2$"</span>, fontsize=<span class="num">11</span>)
cb2.<span class="fn">set_ticks</span>([<span class="num">0</span>, <span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>])
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"labelled, custom ticks"</span>)

<span class="cm"># Horizontal colorbar at the bottom</span>
sc3 = axes[<span class="num">2</span>].<span class="fn">scatter</span>(x, y, c=v, cmap=<span class="str">"viridis"</span>, s=<span class="num">14</span>)
cb3 = fig.<span class="fn">colorbar</span>(sc3, ax=axes[<span class="num">2</span>], orientation=<span class="str">"horizontal"</span>,
                   shrink=<span class="num">0.7</span>, pad=<span class="num">0.12</span>)
cb3.<span class="fn">set_label</span>(r<span class="str">"radius$^2$"</span>)
axes[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"horizontal colorbar"</span>)

<span class="kw">for</span> ax <span class="kw">in</span> axes:
    ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates 400 random (x, y) points and assigns each a numeric value v = x^2 + y^2 -- the squared distance from the origin. 2) Three scatter plots, identical data, three colorbar variants. 3) The first uses the default vertical colorbar attached to the right of the axes. 4) The second customises: <code>shrink=0.85</code> makes the bar shorter than the axes, <code>pad=0.02</code> tightens the gap, <code>set_label</code> attaches a LaTeX-formatted name, and <code>set_ticks</code> places exact tick values. 5) The third puts the colorbar horizontally below the plot via <code>orientation="horizontal"</code> -- useful when you need vertical space for the data and the colorbar can spread sideways.</p>

<div class="l-note"><strong>Decision:</strong> vertical colorbar by default, horizontal when the figure is wider than it is tall (e.g. a wide low panel where vertical space is scarce). Always set a meaningful <code>label</code> -- "radius squared" is far more informative than the unlabelled default.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gradient Descent on a Loss Surface</h2>

<p class="l-text">Time to put it all together. We will minimise a non-convex 2D loss <code>L(w1, w2)</code> with vanilla gradient descent and overlay the optimiser's path on a contour plot of the surface. This figure is the second-most-iconic ML visualisation after the loss curve.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Define the loss and its gradient</span>
<span class="kw">def</span> <span class="fn">loss</span>(w1, w2):
    <span class="kw">return</span> (<span class="num">1</span> - w1) ** <span class="num">2</span> + <span class="num">5</span> * (w2 - w1 ** <span class="num">2</span>) ** <span class="num">2</span>     <span class="cm"># Rosenbrock</span>

<span class="kw">def</span> <span class="fn">grad</span>(w1, w2):
    g1 = -<span class="num">2</span> * (<span class="num">1</span> - w1) - <span class="num">20</span> * w1 * (w2 - w1 ** <span class="num">2</span>)
    g2 = <span class="num">10</span> * (w2 - w1 ** <span class="num">2</span>)
    <span class="kw">return</span> np.<span class="fn">array</span>([g1, g2])

<span class="cm"># 2) Run gradient descent</span>
lr = <span class="num">0.005</span>
w  = np.<span class="fn">array</span>([-<span class="num">1.5</span>, <span class="num">2.5</span>])
path = [w.<span class="fn">copy</span>()]
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    w = w - lr * <span class="fn">grad</span>(*w)
    path.<span class="fn">append</span>(w.<span class="fn">copy</span>())
path = np.<span class="fn">array</span>(path)

<span class="cm"># 3) Build the contour plot of the loss</span>
w1 = np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>)
w2 = np.<span class="fn">linspace</span>(-<span class="num">1</span>, <span class="num">3</span>, <span class="num">200</span>)
W1, W2 = np.<span class="fn">meshgrid</span>(w1, w2)
Z = <span class="fn">loss</span>(W1, W2)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">6</span>))
cf = ax.<span class="fn">contourf</span>(W1, W2, Z, levels=<span class="num">30</span>, cmap=<span class="str">"viridis"</span>, alpha=<span class="num">0.85</span>)
fig.<span class="fn">colorbar</span>(cf, ax=ax, label=<span class="str">"loss"</span>)

<span class="cm"># 4) Overlay the descent path</span>
ax.<span class="fn">plot</span>(path[:, <span class="num">0</span>], path[:, <span class="num">1</span>], color=<span class="str">"white"</span>, linewidth=<span class="num">1.2</span>, alpha=<span class="num">0.7</span>)
ax.<span class="fn">scatter</span>(path[:, <span class="num">0</span>], path[:, <span class="num">1</span>], c=<span class="str">"#ff6b6b"</span>, s=<span class="num">14</span>, zorder=<span class="num">3</span>,
           edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.5</span>)
ax.<span class="fn">scatter</span>(*path[<span class="num">0</span>],  color=<span class="str">"#4ecdc4"</span>, s=<span class="num">120</span>, marker=<span class="str">"*"</span>,
           label=<span class="str">"start"</span>, edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">1.2</span>, zorder=<span class="num">4</span>)
ax.<span class="fn">scatter</span>(*path[-<span class="num">1</span>], color=<span class="str">"#c8a96e"</span>, s=<span class="num">120</span>, marker=<span class="str">"*"</span>,
           label=<span class="str">"final"</span>, edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">1.2</span>, zorder=<span class="num">4</span>)

ax.<span class="fn">set_xlabel</span>(r<span class="str">"$w_1$"</span>); ax.<span class="fn">set_ylabel</span>(r<span class="str">"$w_2$"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Gradient descent on the Rosenbrock loss"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>loss(w1, w2)</code> defines the Rosenbrock function -- a textbook non-convex landscape with a curved narrow valley. <code>grad(w1, w2)</code> returns its analytic gradient. 2) Vanilla gradient descent with learning rate 0.005 from start point (-1.5, 2.5). At every iteration, take a step in the direction of negative gradient. The full trajectory is stored in <code>path</code> as a (201, 2) array. 3) A meshgrid covers the (w1, w2) plane and <code>loss</code> is evaluated everywhere; <code>contourf</code> with 30 levels paints the landscape. 4) <code>ax.plot(path[:, 0], path[:, 1], color="white", ...)</code> overlays the path as a white line; small red dots mark each iterate so you can see step sizes; star markers mark start (teal) and end (gold) points. <code>zorder=3, 4</code> ensures the path and stars sit on top of the contour fill rather than getting hidden behind it. 5) The legend, axis labels with LaTeX subscripts, and title turn it into a self-explanatory figure.</p>

<div id="plot-mpl-l5-gd-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Gradient descent on the Rosenbrock loss surface. The colored contour map shows the loss landscape -- bright yellow is high, dark purple is low. The white line with red dots is the trajectory of the optimiser; the teal star is where it began at (-1.5, 2.5) and the gold star is where it ended after 200 steps. The path follows the curved valley exactly, slowing down as the gradient becomes small. This figure encapsulates why optimisation matters: the loss landscape constrains the path the model can take during training, and visualising it makes the dynamics tangible.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Wireframes and 3D Bars (Brief)</h2>

<p class="l-text">Two more 3D plot types worth knowing about, even if you use them rarely.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">40</span>)
y = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">40</span>)
X, Y = np.<span class="fn">meshgrid</span>(x, y)
Z = np.<span class="fn">exp</span>(-(X ** <span class="num">2</span> + Y ** <span class="num">2</span>) / <span class="num">2</span>)         <span class="cm"># Gaussian bump</span>

fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">12</span>, <span class="num">5</span>))

<span class="cm"># Wireframe: just the grid lines, no fill</span>
ax1 = fig.<span class="fn">add_subplot</span>(<span class="num">121</span>, projection=<span class="str">"3d"</span>)
ax1.<span class="fn">plot_wireframe</span>(X, Y, Z, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">0.5</span>)
ax1.<span class="fn">set_title</span>(<span class="str">"wireframe"</span>)

<span class="cm"># 3D bar chart</span>
ax2 = fig.<span class="fn">add_subplot</span>(<span class="num">122</span>, projection=<span class="str">"3d"</span>)
xb, yb = np.<span class="fn">meshgrid</span>(np.<span class="fn">arange</span>(<span class="num">5</span>), np.<span class="fn">arange</span>(<span class="num">5</span>))
xb, yb = xb.<span class="fn">flatten</span>(), yb.<span class="fn">flatten</span>()
zb = np.<span class="fn">zeros_like</span>(xb)
heights = np.<span class="fn">array</span>([<span class="num">3</span>, <span class="num">5</span>, <span class="num">2</span>, <span class="num">6</span>, <span class="num">4</span>,  <span class="num">4</span>, <span class="num">7</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">2</span>,
                    <span class="num">2</span>, <span class="num">4</span>, <span class="num">8</span>, <span class="num">5</span>, <span class="num">3</span>,  <span class="num">6</span>, <span class="num">5</span>, <span class="num">4</span>, <span class="num">7</span>, <span class="num">5</span>,
                    <span class="num">3</span>, <span class="num">6</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">9</span>])
ax2.<span class="fn">bar3d</span>(xb, yb, zb, <span class="num">0.7</span>, <span class="num">0.7</span>, heights, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.85</span>)
ax2.<span class="fn">set_title</span>(<span class="str">"bar3d"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds the same kind of meshgrid we used for surfaces. 2) <code>ax1.plot_wireframe</code> draws only the grid lines -- no surface fill, no colour-by-height. Wireframes look great when you want to suggest the shape without obscuring the empty space behind it. 3) <code>ax2.bar3d(x, y, z, dx, dy, dz)</code> draws 3D rectangular bars. <code>x, y, z</code> are the lower-left-back corners of each bar, <code>dx, dy, dz</code> are the dimensions. Useful for 2D histograms shown in 3D, or for any 5x5 quantity grid where colour is not enough.</p>

<div class="l-note"><strong>Use sparingly:</strong> 3D bar charts are cute but harder to read than a 2D heatmap of the same data. Reach for them only when the third dimension genuinely adds information that you cannot encode through colour.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-up & Recap</h2>

<p class="l-text">3D and matrix visualisation are two completely different sets of tools that you reach for in different situations.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>Open a 3D axes</strong> with <code>fig.add_subplot(111, projection="3d")</code>. Then call <code>plot</code>, <code>scatter</code>, <code>plot_surface</code>, <code>plot_wireframe</code>, <code>bar3d</code>, etc.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>Surfaces</strong>: build a meshgrid of (x, y) pairs, evaluate z = f(x, y) elementwise, call <code>plot_surface</code> with a colormap.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Contours</strong>: same data, viewed top-down. Use <code>contour</code> for lines (with inline <code>clabel</code>) or <code>contourf</code> for filled regions.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Heatmaps for matrices</strong>: <code>ax.imshow(M, cmap=...)</code>. Always set <code>vmin/vmax</code> when comparing across multiple plots, and overlay numeric values for confusion or correlation matrices.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Always include a colorbar</strong> when colour encodes a continuous value. Customise label, shrink, ticks, and orientation.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Gradient descent on a loss surface</strong>: contourf the loss, plot the path of iterates, mark start and end with stars. This is one of the most pedagogically valuable ML figures you can produce.</div></div>
<div class="step-row"><div class="step-num">7</div><div class="step-body"><strong>For static print</strong>, prefer 2D contour plots over 3D surfaces. 3D rotates beautifully on screen but loses information when frozen to a single angle.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> <code>projection="3d"</code> is the only switch you need to start drawing 3D figures.<br><strong>2.</strong> Meshgrid + vectorised evaluation + <code>plot_surface</code> is the universal recipe for visualising any two-input function.<br><strong>3.</strong> Contour plots are usually more readable than 3D surfaces in print -- and they stay readable in greyscale.<br><strong>4.</strong> <code>imshow</code> renders matrices as heatmaps; always overlay numeric values for confusion and correlation matrices.<br><strong>5.</strong> When colour encodes a continuous value, the figure is incomplete without a colorbar.<br><strong>6.</strong> The gradient-descent-on-a-loss-surface figure (contourf + path + start/end markers) is iconic and worth practising until you can write it from memory.<br><strong>7.</strong> For diverging data (e.g. weights in an attention matrix that range from -1 to 1), use <code>cmap="RdBu_r"</code> with symmetric <code>vmin/vmax</code>.<br><strong>8.</strong> <code>view_init(elev, azim)</code> controls the camera. In Jupyter, <code>%matplotlib widget</code> lets you drag to rotate -- great for exploring, less great for export.</div></div>
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

  // 1. 3D surface sin(x1)*cos(x2)
  function surfaceDemo(id, title){
    var el = document.getElementById(id); if(!el) return;
    var n=60, x1=[], x2=[], Z=[];
    for (var i=0;i<n;i++){x1.push(-3+6*i/(n-1)); x2.push(-3+6*i/(n-1));}
    for (var i=0;i<n;i++){var row=[]; for (var j=0;j<n;j++){row.push(Math.sin(x1[j])*Math.cos(x2[i]));} Z.push(row);}
    var trace = {x:x1,y:x2,z:Z,type:'surface',colorscale:'Viridis',showscale:true,colorbar:{title:'z'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      scene:{
        xaxis:{title:'x1',color:T.text,gridcolor:T.grid},
        yaxis:{title:'x2',color:T.text,gridcolor:T.grid},
        zaxis:{title:'z', color:T.text,gridcolor:T.grid},
        camera:{eye:{x:1.6,y:-1.6,z:0.9}}
      },
      height:500
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  surfaceDemo('plot-mpl-l5-surface-en','3D surface: z = sin(x1) * cos(x2)');
  surfaceDemo('plot-mpl-l5-surface-tr','3B yuzey: z = sin(x1) * cos(x2)');

  // 2. Filled contour of same function
  function contourDemo(id, title){
    var el = document.getElementById(id); if(!el) return;
    var n=120, x1=[], x2=[], Z=[];
    for (var i=0;i<n;i++){x1.push(-3+6*i/(n-1)); x2.push(-3+6*i/(n-1));}
    for (var i=0;i<n;i++){var row=[]; for (var j=0;j<n;j++){row.push(Math.sin(x1[j])*Math.cos(x2[i]));} Z.push(row);}
    var trace = {x:x1,y:x2,z:Z,type:'contour',colorscale:'Viridis',contours:{coloring:'fill',showlines:false},colorbar:{title:'z'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:'x1',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      height:480
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  contourDemo('plot-mpl-l5-contour-en','Filled contour: same function');
  contourDemo('plot-mpl-l5-contour-tr','Dolu kontur: ayni fonksiyon');

  // 3. Confusion matrix heatmap
  function cmDemo(id, title, labels){
    var el = document.getElementById(id); if(!el) return;
    // Build a 5x5 row-normalised CM with strong diagonal
    var raw = [
      [70, 8, 5, 3, 2],
      [10,55,12, 6, 4],
      [ 4,11,60,11, 5],
      [ 3, 6,14,52,12],
      [ 2, 3, 5,11,65]
    ];
    var cm=[]; for (var i=0;i<5;i++){var s=raw[i].reduce(function(a,b){return a+b;},0); var row=[]; for (var j=0;j<5;j++){row.push(raw[i][j]/s);} cm.push(row);}
    var ann=[];
    for (var i=0;i<5;i++) for (var j=0;j<5;j++){
      ann.push({x:labels[j],y:labels[i],text:cm[i][j].toFixed(2),showarrow:false,font:{color:cm[i][j]>0.5?'white':'black',size:11}});
    }
    var trace = {x:labels,y:labels,z:cm,type:'heatmap',colorscale:'Blues',zmin:0,zmax:1,colorbar:{title:'proportion'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:'predicted',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'true',gridcolor:T.grid,zerolinecolor:T.zero,autorange:'reversed'},
      annotations:ann,height:500
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  cmDemo('plot-mpl-l5-cm-en','Row-normalised confusion matrix',['neg','weak-neg','neutral','weak-pos','pos']);
  cmDemo('plot-mpl-l5-cm-tr','Satir-normalize karisiklik matrisi',['neg','zayif-neg','notr','zayif-poz','poz']);

  // 4. Gradient descent on Rosenbrock
  function gdDemo(id, title){
    var el = document.getElementById(id); if(!el) return;
    function loss(w1,w2){return Math.pow(1-w1,2)+5*Math.pow(w2-w1*w1,2);}
    function grad(w1,w2){return [-2*(1-w1)-20*w1*(w2-w1*w1), 10*(w2-w1*w1)];}
    // Run GD
    var w=[-1.5,2.5], lr=0.005, pathX=[w[0]], pathY=[w[1]];
    for (var i=0;i<200;i++){var g=grad(w[0],w[1]); w=[w[0]-lr*g[0], w[1]-lr*g[1]]; pathX.push(w[0]); pathY.push(w[1]);}
    // Surface contour
    var n=120, w1g=[], w2g=[], Zg=[];
    for (var i=0;i<n;i++){w1g.push(-2+4*i/(n-1)); w2g.push(-1+4*i/(n-1));}
    for (var i=0;i<n;i++){var row=[]; for (var j=0;j<n;j++){row.push(loss(w1g[j],w2g[i]));} Zg.push(row);}
    var traces = [
      {x:w1g,y:w2g,z:Zg,type:'contour',colorscale:'Viridis',contours:{coloring:'fill',showlines:false},colorbar:{title:'loss'},showscale:true},
      {x:pathX,y:pathY,mode:'lines+markers',line:{color:'white',width:1.4},marker:{color:'#ff6b6b',size:5,line:{color:'white',width:0.5}},name:'path',showlegend:true},
      {x:[pathX[0]],y:[pathY[0]],mode:'markers',marker:{color:'#4ecdc4',size:14,symbol:'star',line:{color:'white',width:1.5}},name:'start'},
      {x:[pathX[pathX.length-1]],y:[pathY[pathY.length-1]],mode:'markers',marker:{color:'#c8a96e',size:14,symbol:'star',line:{color:'white',width:1.5}},name:'final'}
    ];
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:'w1',gridcolor:T.grid,zerolinecolor:T.zero,range:[-2,2]},
      yaxis:{title:'w2',gridcolor:T.grid,zerolinecolor:T.zero,range:[-1,3]},
      legend:{font:{color:T.text}},height:500
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  gdDemo('plot-mpl-l5-gd-en','Gradient descent on the Rosenbrock loss');
  gdDemo('plot-mpl-l5-gd-tr','Rosenbrock kaybinda gradyan inisi');
},250);</script>`,

tr: `<p class="l-text"><strong>Üç boyutlu ve matris benzeri görselleştirmeler Matplotlib'in beklenmedik biçimde parladığı yerlerdir.</strong> Bir kayıp yüzeyi, özellik uzayında bir karar sınırı, her sorgu ve her anahtar arasındaki bir dikkat matrisi, 1000 cümle gömmesi arasında öğrenilmiş bir benzerlik matrisi -- bunların hepsi ya bir 3B yüzey ya da bir 2B ısı haritası gerektirir ve Matplotlib her ikisini de yerleşik olarak sunar. Bu derste mpl_toolkits 3B API, kontur grafikleri, <code>imshow</code> ısı haritaları, renk çubukları ve gerçek bir ML kullanım durumunu ele alacağız: gradyan inişinin bir kayıp yüzeyinde aşağı yürüyüşünü görselleştirme.</p>

<p class="l-text">Sonunda meshgrid'den 3B yüzey çizecek, aynı veri üzerine bir kontur haritası bindirecek, karışıklık matrisini ısı haritası olarak render edecek ve bir optimize edicinin dışbükey olmayan bir kayıp üzerinde adım atan yolunu canlandıracaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Matrisler ve confusion verisi için imshow ve pcolormesh ile heatmap çiz</li><li>Algısal olarak homojen colormap seç ve yanıltıcı rainbow paletinden kaçın</li><li>mplot3d araç setiyle 3B yüzey ve scatter grafikler çiz</li><li>Colorbar ekle ve onları birim ve tick formatlayıcılarla etiketle</li><li>Gradient, karar sınırı ve 2B loss yüzeylerini görselleştir</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. mpl_toolkits.mplot3d: 3B Modülü</h2>

<p class="l-text">Matplotlib'in 3B çizimi ayrı bir alt pakette, <code>mpl_toolkits.mplot3d</code>'de yaşar ama onu doğrudan içe aktarmazsınız. <code>plt.subplots</code>'tan bir 3B projeksiyon istersiniz ve Matplotlib <code>plot_surface</code>, <code>scatter3D</code>, <code>plot_wireframe</code> gibi yeni metotları olan bir <code>Axes3D</code> nesnesi bağlar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 3B axes ac (anahtar subplot_kw)</span>
fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">8</span>, <span class="num">6</span>))
ax  = fig.<span class="fn">add_subplot</span>(<span class="num">111</span>, projection=<span class="str">"3d"</span>)

<span class="cm"># Basit bir 3B cizgi</span>
t = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">6</span> * np.pi, <span class="num">200</span>)
ax.<span class="fn">plot</span>(np.<span class="fn">cos</span>(t), np.<span class="fn">sin</span>(t), t, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)

<span class="cm"># 3B sacilim bulutu</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
xs, ys, zs = rng.<span class="fn">normal</span>(size=(<span class="num">3</span>, <span class="num">200</span>))
ax.<span class="fn">scatter</span>(xs, ys, zs, c=zs, cmap=<span class="str">"viridis"</span>, s=<span class="num">18</span>, alpha=<span class="num">0.7</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>); ax.<span class="fn">set_zlabel</span>(<span class="str">"z"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"3B cizgi + sacilim"</span>)

<span class="cm"># Kamera acisi: yukseklik, yon</span>
ax.<span class="fn">view_init</span>(elev=<span class="num">20</span>, azim=<span class="num">35</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>fig.add_subplot(111, projection="3d")</code> giriş kapısıdır: <code>projection="3d"</code> geçirin ve dönen axes, tüm ekstra 3B metotlarıyla birlikte bir <code>Axes3D</code>'dir. 2) <code>ax.plot(x, y, z, ...)</code> bir 3B çizgi çizer; burada t ile parametrize edilmiş, xy'de dönen ve z'de yükselen bir helis. 3) <code>ax.scatter(xs, ys, zs, c=zs, cmap="viridis")</code> 200 nokta atar ve onları z değerlerine göre renklendirir -- 2B saçılım ile aynı, sadece üçüncü bir koordinatla. 4) <code>set_zlabel</code> üçüncü ekseni etiketler. 5) <code>ax.view_init(elev=20, azim=35)</code> kamerayı döndürür: <code>elev</code> aşağı bakarken zeminden ne kadar yüksekte olduğunuzdur (derece olarak), <code>azim</code> dikey eksen etrafında dönmedir. Bunları ayarlamak 3B grafiğinizi okunabilir kılan açıyı bulma yolunuzdur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">projection="3d"</div><div class="card-body">2B Axes'i 3B Axes3D'ye dönüştüren tek anahtar. Herhangi bir 3B çizim için gereklidir.</div></div>
<div class="calc-card"><div class="card-title">plot, scatter</div><div class="card-body">2B ile aynı isimler ama üçüncü bir koordinat kabul ederler. <code>ax.plot(x, y, z)</code>, <code>ax.scatter(x, y, z)</code>.</div></div>
<div class="calc-card"><div class="card-title">view_init</div><div class="card-body">Kamera açısını ayarlar. <code>elev</code> yukarı-aşağıdır (-90 ile 90), <code>azim</code> z ekseni etrafındadır (0 ile 360).</div></div>
<div class="calc-card"><div class="card-title">etkileşim</div><div class="card-body">Jupyter'de <code>%matplotlib widget</code> ile döndürmek için figürü sürükleyebilirsiniz. Statik dışa aktarımda iyi bir açı seçip ona sadık kalmalısınız.</div></div>
</div>

<div class="l-warn"><strong>Baskıda 3B grafikler:</strong> 3B figürler ekranda harika görünür ama statik bir görüntüye düzleştirildiğinde bilgi kaybeder. Makaleler için 3B yüzeyler yerine 2B kontur grafiklerini tercih edin veya iki görünümü yan yana (3B açı + tepeden aşağı kontur) ekleyin.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. plot_surface: Meshgrid + sin(x1)*cos(x2)</h2>

<p class="l-text">Herhangi bir ML dersindeki klasik 3B figür, <code>z = f(x1, x2)</code>'den çizilmiş düzgün bir yüzeydir. İki bileşen <code>np.meshgrid</code> (1B x ve y dizilerini 2B çift ızgaralarına dönüştürür) ve <code>ax.plot_surface</code>'tir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) 2B izgarayi kur</span>
x1 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">80</span>)
x2 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">80</span>)
X1, X2 = np.<span class="fn">meshgrid</span>(x1, x2)         <span class="cm"># X1, X2 ikisi de (80, 80)</span>

<span class="cm"># 2) Fonksiyonu her izgara noktasinda degerlendir</span>
Z = np.<span class="fn">sin</span>(X1) * np.<span class="fn">cos</span>(X2)          <span class="cm"># yine (80, 80)</span>

<span class="cm"># 3) Ciz</span>
fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">9</span>, <span class="num">6</span>))
ax  = fig.<span class="fn">add_subplot</span>(<span class="num">111</span>, projection=<span class="str">"3d"</span>)
surf = ax.<span class="fn">plot_surface</span>(
    X1, X2, Z,
    cmap=<span class="str">"viridis"</span>,
    edgecolor=<span class="str">"none"</span>,            <span class="cm"># uste tel kafes cizgisi yok</span>
    alpha=<span class="num">0.95</span>,
    rstride=<span class="num">2</span>, cstride=<span class="num">2</span>         <span class="cm"># hiz icin satir/sutun adimi</span>
)

ax.<span class="fn">set_xlabel</span>(<span class="str">"x1"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"x2"</span>); ax.<span class="fn">set_zlabel</span>(<span class="str">"z"</span>)
ax.<span class="fn">set_title</span>(r<span class="str">"$z = \\\\sin(x_1)\\\\cdot \\\\cos(x_2)$"</span>)
ax.<span class="fn">view_init</span>(elev=<span class="num">28</span>, azim=-<span class="num">55</span>)
fig.<span class="fn">colorbar</span>(surf, ax=ax, shrink=<span class="num">0.6</span>, label=<span class="str">"z"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) -3'ten 3'e her biri 80 noktalı iki 1B dizi oluşturur, x1 ve x2 eksenleri için. 2) <code>np.meshgrid(x1, x2)</code> iki 2B ızgara döndürür: <code>X1</code> her (i, j) hücresinde x1 değerini içerir, <code>X2</code> x2 değerini içerir. Birlikte tüm xy düzlemini parametrize ederler. 3) <code>Z = np.sin(X1) * np.cos(X2)</code> fonksiyonu her ızgara noktasında elemanca tek bir vektörleştirilmiş ifadede değerlendirir -- Python döngüsü yok, NumPy işi yayınlar. 4) <code>fig.add_subplot(111, projection="3d")</code> 3B axes açar. 5) <code>ax.plot_surface(X1, X2, Z, cmap="viridis", ...)</code> ızgarayı yükseklikleri Z olan küçük renkli karolara böler. <code>edgecolor="none"</code>, <code>plot_surface</code>'ün varsayılan olarak çizdiği koyu tel kafes çizgilerini kaldırır; yüzey daha pürüzsüz görünür. <code>rstride=2, cstride=2</code> ızgaralar büyük olduğunda render'ı hızlandırmak için her diğer satır ve sütunu kullanır. 6) <code>view_init</code> hem zirveleri hem de vadileri görünür kılan bir görüntüleme açısı seçer. 7) <code>fig.colorbar(surf, ...)</code> yüksekliği renge eşleyen bir yan çubuk ekler.</p>

<div id="plot-mpl-l5-surface-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Bir meshgrid üzerinde sin(x1) * cos(x2) değerlendirilerek oluşturulan 3B yüzey. ML'de karar sınırı görselleştirmeleri ve kayıp yüzeyleri tam olarak bu şekilde çizilir: girdi veya parametre uzayını kapsayan bir meshgrid kurun, model çıktısını veya kaybı her ızgara noktasında değerlendirin ve <code>plot_surface</code> çağırın. Renk yüksekliği takip eder, böylece statik bir görüntüde bile fonksiyonun topolojisi okunabilirdir -- nereye vadiye iner ve nereye sırta yükselir.</div>

<div class="calc-highlight"><strong>Sonsuza kadar yeniden kullanacağınız örüntü:</strong> meshgrid + vektörleştirilmiş fonksiyon değerlendirmesi + plot_surface. Bu üç adımlı tarif, <em>herhangi bir</em> iki girdili fonksiyonu nasıl görselleştireceğinizdir: iki parametre üzerinde bir kayıp manzarası, iki özellik üzerinde bir karar sınırı, iki hiperparametre üzerinde bir hedef.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kontur Grafikleri: 3B'nin 2B İzdüşümü</h2>

<p class="l-text">Bir <strong>kontur grafiği</strong> 3B yüzey ile aynı veridir ama tepeden aşağı görüntülenir: her kontur çizgisi aynı z değerine sahip tüm noktaları birleştirir, topografik bir haritadaki yükselti çizgileri gibi. Konturlar baskıda 3B yüzeylerden genellikle <em>daha</em> okunabilirdir çünkü her nokta aynı sayıda piksel alır ve çizgi işaretlemeleri tam değer bilgisi taşır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x1 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">200</span>)
x2 = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">200</span>)
X1, X2 = np.<span class="fn">meshgrid</span>(x1, x2)
Z = np.<span class="fn">sin</span>(X1) * np.<span class="fn">cos</span>(X2)

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">2</span>, figsize=(<span class="num">12</span>, <span class="num">5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Sol: kontur cizgileri (sadece cizgiler)</span>
cs = axes[<span class="num">0</span>].<span class="fn">contour</span>(X1, X2, Z, levels=<span class="num">12</span>, cmap=<span class="str">"viridis"</span>)
axes[<span class="num">0</span>].<span class="fn">clabel</span>(cs, inline=<span class="kw">True</span>, fontsize=<span class="num">9</span>, fmt=<span class="str">"%.1f"</span>)
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"contour: yalnizca cizgiler"</span>)
axes[<span class="num">0</span>].<span class="fn">set_xlabel</span>(<span class="str">"x1"</span>); axes[<span class="num">0</span>].<span class="fn">set_ylabel</span>(<span class="str">"x2"</span>)

<span class="cm"># Sag: dolu kontur (cizgiler arasi bolgeler renkli)</span>
cf = axes[<span class="num">1</span>].<span class="fn">contourf</span>(X1, X2, Z, levels=<span class="num">20</span>, cmap=<span class="str">"viridis"</span>)
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"contourf: dolu"</span>)
axes[<span class="num">1</span>].<span class="fn">set_xlabel</span>(<span class="str">"x1"</span>); axes[<span class="num">1</span>].<span class="fn">set_ylabel</span>(<span class="str">"x2"</span>)
fig.<span class="fn">colorbar</span>(cf, ax=axes[<span class="num">1</span>], shrink=<span class="num">0.85</span>, label=<span class="str">"z"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Bölüm 2'deki ile aynı meshgrid'i kurar ve aynı fonksiyonu değerlendirir. 2) Sol axes <code>ax.contour(X1, X2, Z, levels=12, cmap="viridis")</code> kullanır: 12 izoçizgi (Z seviyesi başına bir tane) çizer ve her birini renk haritasıyla renklendirir. <code>clabel</code> her çizgiye sayısal z değerini satır içi yazar, böylece renk çubuğu olmadan tam yükseklikleri okuyabilirsiniz. 3) Sağ axes <code>ax.contourf</code> kullanır ("dolu" için f'ye dikkat): yalnızca çizgiler yerine, ardışık seviyeler <em>arası</em> bölgeleri düz bir renkle doldurur. Sonuç havadan topografik bir harita gibi görünür. 4) <code>fig.colorbar(cf, ...)</code> renk-z açıklaması ekler; <code>shrink=0.85</code> çubuğu axes yüksekliğinden biraz daha kısa yapar, böylece baskın olmaz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">contour</div><div class="card-body">Yalnızca izoçizgiler. Satır içi etiketler aracılığıyla tam seviye değerlerini görmek istediğinizde kullanın.</div></div>
<div class="calc-card"><div class="card-title">contourf</div><div class="card-body">İzoçizgiler arası dolu bölgeler. Genel topolojiyi bir bakışta okumak istediğinizde kullanın.</div></div>
<div class="calc-card"><div class="card-title">levels</div><div class="card-body">Tam sayı (eşit aralıklı seviyelerin sayısı) veya dizi (belirli z değerleri). Tam olarak o üçünü çizmek için <code>levels=[-1, 0, 1]</code> geçirin.</div></div>
<div class="calc-card"><div class="card-title">clabel</div><div class="card-body">Kontur çizgilerinde satır içi sayısal etiketler. Kendini açıklayan figürler için dolu olmayan <code>contour</code> ile birleştirin.</div></div>
</div>

<div id="plot-mpl-l5-contour-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> Aynı sin(x1)*cos(x2), dolu kontur olarak görüntülendi. Parlak sarı bölgeler zirvelerdir, koyu mor bölgeler vadilerdir ve aralarındaki kontur bantları her konumda fonksiyonun ne kadar dik veya düz olduğunu tam olarak söyler. Konturlar herhangi bir 2 girdili skaler fonksiyonun beygir gücü 2B görselleştirmesidir -- ve 3B yüzeylerin aksine gri tonlamada da iyi yazdırılırlar.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. imshow: Matrisler için Isı Haritaları</h2>

<p class="l-text">Matris şekilli veri için -- bir karışıklık matrisi, bir dikkat matrisi, bir korelasyon matrisi, öğrenilmiş bir benzerlik matrisi -- doğru araç <code>ax.imshow</code>'dur. Her hücreyi renkli bir piksel olarak çizer ve üzerine sayıları bindirebilirsiniz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 5 sinifli bir problem icin sahte bir karisiklik matrisi</span>
labels = [<span class="str">"neg"</span>, <span class="str">"zayif-neg"</span>, <span class="str">"notr"</span>, <span class="str">"zayif-poz"</span>, <span class="str">"poz"</span>]
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
cm = rng.<span class="fn">integers</span>(<span class="num">2</span>, <span class="num">12</span>, size=(<span class="num">5</span>, <span class="num">5</span>))
np.<span class="fn">fill_diagonal</span>(cm, rng.<span class="fn">integers</span>(<span class="num">40</span>, <span class="num">80</span>, size=<span class="num">5</span>))    <span class="cm"># guclu kosegen</span>
cm = cm / cm.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)                <span class="cm"># satir-normalize</span>

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">6</span>))
im = ax.<span class="fn">imshow</span>(cm, cmap=<span class="str">"Blues"</span>, vmin=<span class="num">0</span>, vmax=<span class="num">1</span>)

<span class="cm"># Tik konumlari ve etiketleri</span>
ax.<span class="fn">set_xticks</span>(np.<span class="fn">arange</span>(<span class="num">5</span>)); ax.<span class="fn">set_yticks</span>(np.<span class="fn">arange</span>(<span class="num">5</span>))
ax.<span class="fn">set_xticklabels</span>(labels);  ax.<span class="fn">set_yticklabels</span>(labels)
plt.<span class="fn">setp</span>(ax.<span class="fn">get_xticklabels</span>(), rotation=<span class="num">30</span>, ha=<span class="str">"right"</span>)

<span class="cm"># Her hucrenin icine degeri yazdir</span>
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
        colour = <span class="str">"white"</span> <span class="kw">if</span> cm[i, j] &gt; <span class="num">0.5</span> <span class="kw">else</span> <span class="str">"black"</span>
        ax.<span class="fn">text</span>(j, i, f<span class="str">"{cm[i, j]:.2f}"</span>, ha=<span class="str">"center"</span>, va=<span class="str">"center"</span>,
                color=colour, fontsize=<span class="num">10</span>)

ax.<span class="fn">set_xlabel</span>(<span class="str">"tahmin"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"gercek"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Satir-normalize karisiklik matrisi"</span>)
fig.<span class="fn">colorbar</span>(im, ax=ax, label=<span class="str">"oran"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Sahte bir 5x5 karışıklık matrisi kurar: küçük köşegen dışı değerler (2-12) ve büyük köşegen değerler (40-80), sonra her satır 1'e toplanacak şekilde satır-normalize eder -- bu, sayıları sınıf başına geri çağırma oranlarına dönüştürür. 2) <code>ax.imshow(cm, cmap="Blues", vmin=0, vmax=1)</code> matrisi ısı haritası olarak çizer; <code>vmin/vmax=0/1</code> renk ölçeğini oran aralığına sabitler, böylece farklı koşular karşılaştırılabilir. 3) Tik konumları açıkça tam sayı hücre indekslerine (<code>np.arange(5)</code>) ayarlanır ve tik etiketleri insan-okunabilir sınıf adlarıyla değiştirilir. 4) <code>plt.setp(ax.get_xticklabels(), rotation=30, ha="right")</code> uzun kategori adlarının çakışmaması için x etiketlerini 30 derece döndürür. 5) Çift for döngüsü her hücrenin değerini hücrenin içine yazar. Metin rengi parlaklık eşiğiyle seçilir: koyu mavi hücrelerde beyaz metin, açık hücrelerde siyah metin -- bu, oran ne olursa olsun okunabilirliği garantiler. 6) <code>fig.colorbar(im, ...)</code> maviyi orana eşleyen bir yan çubuk ekler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">imshow</div><div class="card-body">2B diziyi görüntü olarak çizer. (i, j) hücresi i. satır, j. sütundadır -- yani y ekseni yukarıdan aşağıya gider, matris indeksi gibi.</div></div>
<div class="calc-card"><div class="card-title">vmin / vmax</div><div class="card-body">Renk ölçeğini sabit bir aralığa kilitler. Birden çok ısı haritasını küçük çoklamalar ızgarasında karşılaştırırken kritiktir.</div></div>
<div class="calc-card"><div class="card-title">aspect</div><div class="card-body"><code>aspect="equal"</code> (imshow için varsayılan) hücreleri kare tutar. <code>aspect="auto"</code> axes'i doldurmak için gerer.</div></div>
<div class="calc-card"><div class="card-title">hücre içi metin</div><div class="card-body">Karışıklık matrisleri ve korelasyon matrisleri için her zaman sayısal değerleri bindirin. Göz "0.78"i renk tonundan çok daha hızlı okur.</div></div>
</div>

<div id="plot-mpl-l5-cm-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Buradaki resim:</strong> Isı haritası olarak render edilmiş 5 sınıflı satır-normalize karışıklık matrisi. Köşegen hücreler (doğru tahminler) koyu mavi, 0.6-0.8 civarındadır; köşegen dışı hücreler soluk renktedir, düşük karışıklık oranlarını gösterir. Sayısal kaplama figürü, okunabilir olmak için renk çubuğunu gerektirmeyen kendi kendine yeten bir tabloya dönüştürür. Bu, herhangi bir sınıflandırıcıyı değerlendirdikten sonra çizdiğiniz standart ilk grafiktir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Renk Çubukları: Sürekli Renk için Yan Açıklama</h2>

<p class="l-text">Renk sürekli bir değeri kodladığı her zaman -- <code>imshow</code>'da, <code>scatter(c=...)</code>'da, <code>contourf</code>'ta, <code>plot_surface</code>'ta -- bir <strong>renk çubuğu</strong> içermelisiniz. Onsuz okuyucu "sarı 0.8 mi, mavi -0.2 mi demek" sorusunu çözemez ve figür okunamazdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = rng.<span class="fn">normal</span>(size=<span class="num">400</span>)
y = rng.<span class="fn">normal</span>(size=<span class="num">400</span>)
v = x ** <span class="num">2</span> + y ** <span class="num">2</span>          <span class="cm"># nokta basina sayisal deger</span>

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">3</span>, figsize=(<span class="num">14</span>, <span class="num">4.5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Varsayilan renk cubugu</span>
sc1 = axes[<span class="num">0</span>].<span class="fn">scatter</span>(x, y, c=v, cmap=<span class="str">"viridis"</span>, s=<span class="num">14</span>)
fig.<span class="fn">colorbar</span>(sc1, ax=axes[<span class="num">0</span>])
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"varsayilan renk cubugu"</span>)

<span class="cm"># Ozel etiket, tikler, bicimleme</span>
sc2 = axes[<span class="num">1</span>].<span class="fn">scatter</span>(x, y, c=v, cmap=<span class="str">"viridis"</span>, s=<span class="num">14</span>)
cb2 = fig.<span class="fn">colorbar</span>(sc2, ax=axes[<span class="num">1</span>], shrink=<span class="num">0.85</span>, pad=<span class="num">0.02</span>)
cb2.<span class="fn">set_label</span>(r<span class="str">"yaricap$^2$"</span>, fontsize=<span class="num">11</span>)
cb2.<span class="fn">set_ticks</span>([<span class="num">0</span>, <span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>])
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"etiketli, ozel tikler"</span>)

<span class="cm"># Yatay renk cubugu altta</span>
sc3 = axes[<span class="num">2</span>].<span class="fn">scatter</span>(x, y, c=v, cmap=<span class="str">"viridis"</span>, s=<span class="num">14</span>)
cb3 = fig.<span class="fn">colorbar</span>(sc3, ax=axes[<span class="num">2</span>], orientation=<span class="str">"horizontal"</span>,
                   shrink=<span class="num">0.7</span>, pad=<span class="num">0.12</span>)
cb3.<span class="fn">set_label</span>(r<span class="str">"yaricap$^2$"</span>)
axes[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"yatay renk cubugu"</span>)

<span class="kw">for</span> ax <span class="kw">in</span> axes:
    ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) 400 rastgele (x, y) nokta üretir ve her birine sayısal bir değer v = x^2 + y^2 atar -- orijine kadar olan kare uzaklık. 2) Üç saçılım grafiği, özdeş veri, üç renk çubuğu varyantı. 3) Birincisi, axes'in sağına tutturulmuş varsayılan dikey renk çubuğunu kullanır. 4) İkincisi özelleştirir: <code>shrink=0.85</code> çubuğu axes'ten kısa yapar, <code>pad=0.02</code> boşluğu sıkar, <code>set_label</code> LaTeX biçimli bir ad ekler ve <code>set_ticks</code> tam tik değerlerini yerleştirir. 5) Üçüncüsü <code>orientation="horizontal"</code> aracılığıyla renk çubuğunu grafiğin altına yatay yerleştirir -- veri için dikey alana ihtiyaç duyduğunuzda ve renk çubuğu yana yayılabildiğinde yararlıdır.</p>

<div class="l-note"><strong>Karar:</strong> varsayılan olarak dikey renk çubuğu, figür yüksekliğinden daha geniş olduğunda yatay (ör. dikey alanın az olduğu geniş alçak panel). Her zaman anlamlı bir <code>label</code> ayarlayın -- "yarıçap kare" etiketsiz varsayılandan çok daha bilgilendiricidir.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bir Kayıp Yüzeyinde Gradyan İnişi</h2>

<p class="l-text">Hepsini bir araya getirme zamanı. Vanilya gradyan inişiyle dışbükey olmayan bir 2B kaybı <code>L(w1, w2)</code> minimize edeceğiz ve optimize edicinin yolunu yüzeyin kontur grafiği üzerine bindireceğiz. Bu figür, kayıp eğrisinden sonra ML'in en ikinci ikonik görselleştirmesidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Kaybi ve gradyanini tanimla</span>
<span class="kw">def</span> <span class="fn">loss</span>(w1, w2):
    <span class="kw">return</span> (<span class="num">1</span> - w1) ** <span class="num">2</span> + <span class="num">5</span> * (w2 - w1 ** <span class="num">2</span>) ** <span class="num">2</span>     <span class="cm"># Rosenbrock</span>

<span class="kw">def</span> <span class="fn">grad</span>(w1, w2):
    g1 = -<span class="num">2</span> * (<span class="num">1</span> - w1) - <span class="num">20</span> * w1 * (w2 - w1 ** <span class="num">2</span>)
    g2 = <span class="num">10</span> * (w2 - w1 ** <span class="num">2</span>)
    <span class="kw">return</span> np.<span class="fn">array</span>([g1, g2])

<span class="cm"># 2) Gradyan inisini calistir</span>
lr = <span class="num">0.005</span>
w  = np.<span class="fn">array</span>([-<span class="num">1.5</span>, <span class="num">2.5</span>])
path = [w.<span class="fn">copy</span>()]
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    w = w - lr * <span class="fn">grad</span>(*w)
    path.<span class="fn">append</span>(w.<span class="fn">copy</span>())
path = np.<span class="fn">array</span>(path)

<span class="cm"># 3) Kaybin kontur grafigini kur</span>
w1 = np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">200</span>)
w2 = np.<span class="fn">linspace</span>(-<span class="num">1</span>, <span class="num">3</span>, <span class="num">200</span>)
W1, W2 = np.<span class="fn">meshgrid</span>(w1, w2)
Z = <span class="fn">loss</span>(W1, W2)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">6</span>))
cf = ax.<span class="fn">contourf</span>(W1, W2, Z, levels=<span class="num">30</span>, cmap=<span class="str">"viridis"</span>, alpha=<span class="num">0.85</span>)
fig.<span class="fn">colorbar</span>(cf, ax=ax, label=<span class="str">"kayip"</span>)

<span class="cm"># 4) Inis yolunu uzerine bindir</span>
ax.<span class="fn">plot</span>(path[:, <span class="num">0</span>], path[:, <span class="num">1</span>], color=<span class="str">"white"</span>, linewidth=<span class="num">1.2</span>, alpha=<span class="num">0.7</span>)
ax.<span class="fn">scatter</span>(path[:, <span class="num">0</span>], path[:, <span class="num">1</span>], c=<span class="str">"#ff6b6b"</span>, s=<span class="num">14</span>, zorder=<span class="num">3</span>,
           edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">0.5</span>)
ax.<span class="fn">scatter</span>(*path[<span class="num">0</span>],  color=<span class="str">"#4ecdc4"</span>, s=<span class="num">120</span>, marker=<span class="str">"*"</span>,
           label=<span class="str">"baslangic"</span>, edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">1.2</span>, zorder=<span class="num">4</span>)
ax.<span class="fn">scatter</span>(*path[-<span class="num">1</span>], color=<span class="str">"#c8a96e"</span>, s=<span class="num">120</span>, marker=<span class="str">"*"</span>,
           label=<span class="str">"son"</span>, edgecolor=<span class="str">"white"</span>, linewidth=<span class="num">1.2</span>, zorder=<span class="num">4</span>)

ax.<span class="fn">set_xlabel</span>(r<span class="str">"$w_1$"</span>); ax.<span class="fn">set_ylabel</span>(r<span class="str">"$w_2$"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Rosenbrock kaybinda gradyan inisi"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>loss(w1, w2)</code> Rosenbrock fonksiyonunu tanımlar -- eğri dar bir vadiyle ders kitabı dışbükey olmayan manzara. <code>grad(w1, w2)</code> analitik gradyanını döndürür. 2) (-1.5, 2.5) başlangıç noktasından öğrenme oranı 0.005 ile vanilya gradyan inişi. Her iterasyonda negatif gradyan yönünde bir adım atın. Tam yörünge <code>path</code>'te (201, 2) dizisi olarak saklanır. 3) Bir meshgrid (w1, w2) düzlemini kapsar ve <code>loss</code> her yerde değerlendirilir; 30 seviyeli <code>contourf</code> manzarayı boyar. 4) <code>ax.plot(path[:, 0], path[:, 1], color="white", ...)</code> yolu beyaz çizgi olarak bindirir; küçük kırmızı noktalar her iterasyonu işaretler, böylece adım boyutlarını görebilirsiniz; yıldız işaretçileri başlangıç (teal) ve bitiş (altın) noktalarını işaretler. <code>zorder=3, 4</code> yolun ve yıldızların kontur dolgusunun arkasına gizlenmek yerine üstte oturmasını sağlar. 5) Açıklama, LaTeX alt simgeli eksen etiketleri ve başlık onu kendi kendini açıklayan bir figüre dönüştürür.</p>

<div id="plot-mpl-l5-gd-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> Rosenbrock kayıp yüzeyinde gradyan inişi. Renkli kontur haritası kayıp manzarasını gösterir -- parlak sarı yüksek, koyu mor düşüktür. Kırmızı noktalı beyaz çizgi optimize edicinin yörüngesidir; teal yıldız (-1.5, 2.5)'te başlangıçtır ve altın yıldız 200 adım sonra bittiği yerdir. Yol eğri vadiyi tam olarak takip eder, gradyan küçüldükçe yavaşlar. Bu figür neden optimizasyonun önemli olduğunu özetler: kayıp manzarası modelin eğitim sırasında alabileceği yolu kısıtlar ve bunu görselleştirmek dinamikleri somutlaştırır.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tel Kafesler ve 3B Çubuklar (Kısa)</h2>

<p class="l-text">Nadiren kullansanız bile bilmeye değer iki 3B grafik türü daha.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">40</span>)
y = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">40</span>)
X, Y = np.<span class="fn">meshgrid</span>(x, y)
Z = np.<span class="fn">exp</span>(-(X ** <span class="num">2</span> + Y ** <span class="num">2</span>) / <span class="num">2</span>)         <span class="cm"># Gauss tepesi</span>

fig = plt.<span class="fn">figure</span>(figsize=(<span class="num">12</span>, <span class="num">5</span>))

<span class="cm"># Tel kafes: yalnizca izgara cizgileri, dolgu yok</span>
ax1 = fig.<span class="fn">add_subplot</span>(<span class="num">121</span>, projection=<span class="str">"3d"</span>)
ax1.<span class="fn">plot_wireframe</span>(X, Y, Z, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">0.5</span>)
ax1.<span class="fn">set_title</span>(<span class="str">"tel kafes"</span>)

<span class="cm"># 3B cubuk grafigi</span>
ax2 = fig.<span class="fn">add_subplot</span>(<span class="num">122</span>, projection=<span class="str">"3d"</span>)
xb, yb = np.<span class="fn">meshgrid</span>(np.<span class="fn">arange</span>(<span class="num">5</span>), np.<span class="fn">arange</span>(<span class="num">5</span>))
xb, yb = xb.<span class="fn">flatten</span>(), yb.<span class="fn">flatten</span>()
zb = np.<span class="fn">zeros_like</span>(xb)
heights = np.<span class="fn">array</span>([<span class="num">3</span>, <span class="num">5</span>, <span class="num">2</span>, <span class="num">6</span>, <span class="num">4</span>,  <span class="num">4</span>, <span class="num">7</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">2</span>,
                    <span class="num">2</span>, <span class="num">4</span>, <span class="num">8</span>, <span class="num">5</span>, <span class="num">3</span>,  <span class="num">6</span>, <span class="num">5</span>, <span class="num">4</span>, <span class="num">7</span>, <span class="num">5</span>,
                    <span class="num">3</span>, <span class="num">6</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">9</span>])
ax2.<span class="fn">bar3d</span>(xb, yb, zb, <span class="num">0.7</span>, <span class="num">0.7</span>, heights, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.85</span>)
ax2.<span class="fn">set_title</span>(<span class="str">"bar3d"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Yüzeyler için kullandığımız aynı tür meshgrid'i kurar. 2) <code>ax1.plot_wireframe</code> yalnızca ızgara çizgilerini çizer -- yüzey dolgusu yok, yüksekliğe göre renk yok. Tel kafesler şekli ima etmek istediğinizde ama arkasındaki boş alanı kapatmak istemediğinizde harika görünür. 3) <code>ax2.bar3d(x, y, z, dx, dy, dz)</code> 3B dikdörtgen çubuklar çizer. <code>x, y, z</code> her çubuğun sol-alt-arka köşeleridir, <code>dx, dy, dz</code> boyutlardır. 3B'de gösterilen 2B histogramlar veya rengin yetmediği herhangi bir 5x5 nicelik ızgarası için yararlıdır.</p>

<div class="l-note"><strong>Tasarruflu kullanın:</strong> 3B çubuk grafikleri sevimlidir ama aynı verinin 2B ısı haritasından okuması daha zordur. Yalnızca üçüncü boyut renkle kodlayamayacağınız bilgi gerçekten eklediğinde onlara uzanın.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet</h2>

<p class="l-text">3B ve matris görselleştirme, farklı durumlarda uzanacağınız tamamen farklı iki araç setidir.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>3B axes açın</strong>: <code>fig.add_subplot(111, projection="3d")</code>. Sonra <code>plot</code>, <code>scatter</code>, <code>plot_surface</code>, <code>plot_wireframe</code>, <code>bar3d</code>, vb. çağırın.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>Yüzeyler</strong>: (x, y) çiftlerinin meshgrid'ini kurun, z = f(x, y)'yi elemanca değerlendirin, renk haritalı <code>plot_surface</code> çağırın.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Konturlar</strong>: aynı veri, tepeden aşağı görüntülendi. Çizgiler için <code>contour</code> (satır içi <code>clabel</code> ile) veya dolu bölgeler için <code>contourf</code> kullanın.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Matrisler için ısı haritaları</strong>: <code>ax.imshow(M, cmap=...)</code>. Birden çok grafiği karşılaştırırken her zaman <code>vmin/vmax</code> ayarlayın ve karışıklık veya korelasyon matrisleri için sayısal değerleri bindirin.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Renk sürekli bir değeri kodladığında her zaman bir renk çubuğu ekleyin</strong>. Etiket, shrink, tikler ve yönü özelleştirin.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Bir kayıp yüzeyinde gradyan inişi</strong>: kaybı contourf yapın, iteratların yolunu çizin, başlangıç ve bitişi yıldızlarla işaretleyin. Üretebileceğiniz pedagojik açıdan en değerli ML figürlerinden biridir.</div></div>
<div class="step-row"><div class="step-num">7</div><div class="step-body"><strong>Statik baskı için</strong> 3B yüzeyler yerine 2B kontur grafiklerini tercih edin. 3B ekranda güzel döner ama tek bir açıya dondurulduğunda bilgi kaybeder.</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> <code>projection="3d"</code> 3B figürler çizmeye başlamak için ihtiyacınız olan tek anahtardır.<br><strong>2.</strong> Meshgrid + vektörleştirilmiş değerlendirme + <code>plot_surface</code>, herhangi bir iki girdili fonksiyonu görselleştirmek için evrensel tariftir.<br><strong>3.</strong> Kontur grafikleri baskıda 3B yüzeylerden genellikle daha okunabilirdir -- ve gri tonlamada okunabilir kalırlar.<br><strong>4.</strong> <code>imshow</code> matrisleri ısı haritası olarak render eder; karışıklık ve korelasyon matrisleri için her zaman sayısal değerleri bindirin.<br><strong>5.</strong> Renk sürekli bir değeri kodladığında, figür renk çubuğu olmadan eksiktir.<br><strong>6.</strong> Kayıp-yüzeyinde-gradyan-inişi figürü (contourf + yol + başlangıç/bitiş işaretçileri) ikoniktir ve ezbere yazabilene kadar pratik etmeye değerdir.<br><strong>7.</strong> Iraksak veri için (ör. -1 ile 1 arasında değişen dikkat matrisindeki ağırlıklar), simetrik <code>vmin/vmax</code> ile <code>cmap="RdBu_r"</code> kullanın.<br><strong>8.</strong> <code>view_init(elev, azim)</code> kamerayı kontrol eder. Jupyter'de <code>%matplotlib widget</code> döndürmek için sürüklemenize izin verir -- keşif için harika, dışa aktarım için daha az.</div></div>
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

  // 1. 3D surface sin(x1)*cos(x2)
  function surfaceDemo(id, title){
    var el = document.getElementById(id); if(!el) return;
    var n=60, x1=[], x2=[], Z=[];
    for (var i=0;i<n;i++){x1.push(-3+6*i/(n-1)); x2.push(-3+6*i/(n-1));}
    for (var i=0;i<n;i++){var row=[]; for (var j=0;j<n;j++){row.push(Math.sin(x1[j])*Math.cos(x2[i]));} Z.push(row);}
    var trace = {x:x1,y:x2,z:Z,type:'surface',colorscale:'Viridis',showscale:true,colorbar:{title:'z'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      scene:{
        xaxis:{title:'x1',color:T.text,gridcolor:T.grid},
        yaxis:{title:'x2',color:T.text,gridcolor:T.grid},
        zaxis:{title:'z', color:T.text,gridcolor:T.grid},
        camera:{eye:{x:1.6,y:-1.6,z:0.9}}
      },
      height:500
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  surfaceDemo('plot-mpl-l5-surface-en','3D surface: z = sin(x1) * cos(x2)');
  surfaceDemo('plot-mpl-l5-surface-tr','3B yuzey: z = sin(x1) * cos(x2)');

  // 2. Filled contour of same function
  function contourDemo(id, title){
    var el = document.getElementById(id); if(!el) return;
    var n=120, x1=[], x2=[], Z=[];
    for (var i=0;i<n;i++){x1.push(-3+6*i/(n-1)); x2.push(-3+6*i/(n-1));}
    for (var i=0;i<n;i++){var row=[]; for (var j=0;j<n;j++){row.push(Math.sin(x1[j])*Math.cos(x2[i]));} Z.push(row);}
    var trace = {x:x1,y:x2,z:Z,type:'contour',colorscale:'Viridis',contours:{coloring:'fill',showlines:false},colorbar:{title:'z'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:'x1',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      height:480
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  contourDemo('plot-mpl-l5-contour-en','Filled contour: same function');
  contourDemo('plot-mpl-l5-contour-tr','Dolu kontur: ayni fonksiyon');

  // 3. Confusion matrix heatmap
  function cmDemo(id, title, labels){
    var el = document.getElementById(id); if(!el) return;
    // Build a 5x5 row-normalised CM with strong diagonal
    var raw = [
      [70, 8, 5, 3, 2],
      [10,55,12, 6, 4],
      [ 4,11,60,11, 5],
      [ 3, 6,14,52,12],
      [ 2, 3, 5,11,65]
    ];
    var cm=[]; for (var i=0;i<5;i++){var s=raw[i].reduce(function(a,b){return a+b;},0); var row=[]; for (var j=0;j<5;j++){row.push(raw[i][j]/s);} cm.push(row);}
    var ann=[];
    for (var i=0;i<5;i++) for (var j=0;j<5;j++){
      ann.push({x:labels[j],y:labels[i],text:cm[i][j].toFixed(2),showarrow:false,font:{color:cm[i][j]>0.5?'white':'black',size:11}});
    }
    var trace = {x:labels,y:labels,z:cm,type:'heatmap',colorscale:'Blues',zmin:0,zmax:1,colorbar:{title:'proportion'}};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:'predicted',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'true',gridcolor:T.grid,zerolinecolor:T.zero,autorange:'reversed'},
      annotations:ann,height:500
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  cmDemo('plot-mpl-l5-cm-en','Row-normalised confusion matrix',['neg','weak-neg','neutral','weak-pos','pos']);
  cmDemo('plot-mpl-l5-cm-tr','Satir-normalize karisiklik matrisi',['neg','zayif-neg','notr','zayif-poz','poz']);

  // 4. Gradient descent on Rosenbrock
  function gdDemo(id, title){
    var el = document.getElementById(id); if(!el) return;
    function loss(w1,w2){return Math.pow(1-w1,2)+5*Math.pow(w2-w1*w1,2);}
    function grad(w1,w2){return [-2*(1-w1)-20*w1*(w2-w1*w1), 10*(w2-w1*w1)];}
    // Run GD
    var w=[-1.5,2.5], lr=0.005, pathX=[w[0]], pathY=[w[1]];
    for (var i=0;i<200;i++){var g=grad(w[0],w[1]); w=[w[0]-lr*g[0], w[1]-lr*g[1]]; pathX.push(w[0]); pathY.push(w[1]);}
    // Surface contour
    var n=120, w1g=[], w2g=[], Zg=[];
    for (var i=0;i<n;i++){w1g.push(-2+4*i/(n-1)); w2g.push(-1+4*i/(n-1));}
    for (var i=0;i<n;i++){var row=[]; for (var j=0;j<n;j++){row.push(loss(w1g[j],w2g[i]));} Zg.push(row);}
    var traces = [
      {x:w1g,y:w2g,z:Zg,type:'contour',colorscale:'Viridis',contours:{coloring:'fill',showlines:false},colorbar:{title:'loss'},showscale:true},
      {x:pathX,y:pathY,mode:'lines+markers',line:{color:'white',width:1.4},marker:{color:'#ff6b6b',size:5,line:{color:'white',width:0.5}},name:'path',showlegend:true},
      {x:[pathX[0]],y:[pathY[0]],mode:'markers',marker:{color:'#4ecdc4',size:14,symbol:'star',line:{color:'white',width:1.5}},name:'start'},
      {x:[pathX[pathX.length-1]],y:[pathY[pathY.length-1]],mode:'markers',marker:{color:'#c8a96e',size:14,symbol:'star',line:{color:'white',width:1.5}},name:'final'}
    ];
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:'w1',gridcolor:T.grid,zerolinecolor:T.zero,range:[-2,2]},
      yaxis:{title:'w2',gridcolor:T.grid,zerolinecolor:T.zero,range:[-1,3]},
      legend:{font:{color:T.text}},height:500
    });
    Plotly.newPlot(id,traces,layout,{responsive:true,displayModeBar:false});
  }
  gdDemo('plot-mpl-l5-gd-en','Gradient descent on the Rosenbrock loss');
  gdDemo('plot-mpl-l5-gd-tr','Rosenbrock kaybinda gradyan inisi');
},250);</script>
`
};
