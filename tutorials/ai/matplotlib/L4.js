window.MATPLOTLIB_L4 = {

en: `<p class="l-text"><strong>Default Matplotlib looks like 2008.</strong> Pale blue lines, Helvetica labels at 10pt, a faint white grid -- functional, but no thesis or paper would publish it as-is. Ten minutes of styling, however, turns the same code into a figure that could go on the cover of a journal. This lesson is about those ten minutes: rcParams (the global config), built-in style sheets (ggplot, seaborn), colormap selection (viridis, plasma, sequential vs diverging), font management, annotations, and a custom thesis theme you can copy-paste into every project.</p>

<p class="l-text">By the end you will own a small <code>thesis_style.py</code> snippet that, when imported at the top of every notebook, makes every plot you draw publication-ready by default.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Set global defaults with <code>plt.rcParams</code> so every later plot inherits your style</li><li>Switch entire looks via built-in style sheets (<code>ggplot</code>, <code>seaborn</code>, <code>fivethirtyeight</code>)</li><li>Pick the right colormap family: sequential, diverging, cyclic, and qualitative</li><li>Manage colour cycles and named brand colours for consistent series styling</li><li>Configure fonts (sans / serif / LaTeX) and build a clean font hierarchy</li><li>Add arrows, callouts, and highlight regions with <code>annotate</code> and <code>axvspan</code></li><li>Bundle everything into a reusable <code>thesis_theme.py</code> snippet you import in every notebook</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. rcParams: The Global Defaults</h2>

<p class="l-text">Every Matplotlib setting -- font, line width, default colour, tick direction, figure DPI -- has a "rc" key. <code>plt.rcParams</code> is the dictionary of these defaults; modifying it once changes every plot you draw afterwards in the session.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Inspect the current values</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"font.size"</span>])         <span class="cm"># 10.0</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"lines.linewidth"</span>])   <span class="cm"># 1.5</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"figure.dpi"</span>])        <span class="cm"># 100.0</span>

<span class="cm"># Set new defaults that apply for the rest of the session</span>
plt.rcParams.<span class="fn">update</span>({
    <span class="str">"figure.figsize"</span>: (<span class="num">8</span>, <span class="num">5</span>),
    <span class="str">"figure.dpi"</span>:     <span class="num">110</span>,
    <span class="str">"font.family"</span>:    <span class="str">"DejaVu Sans"</span>,
    <span class="str">"font.size"</span>:      <span class="num">11</span>,
    <span class="str">"axes.titlesize"</span>: <span class="num">13</span>,
    <span class="str">"axes.labelsize"</span>: <span class="num">11</span>,
    <span class="str">"axes.spines.top"</span>:   <span class="kw">False</span>,
    <span class="str">"axes.spines.right"</span>: <span class="kw">False</span>,
    <span class="str">"axes.grid"</span>:      <span class="kw">True</span>,
    <span class="str">"grid.alpha"</span>:     <span class="num">0.25</span>,
    <span class="str">"lines.linewidth"</span>: <span class="num">2.0</span>,
    <span class="str">"legend.frameon"</span>:  <span class="kw">False</span>,
    <span class="str">"savefig.dpi"</span>:     <span class="num">200</span>,
    <span class="str">"savefig.bbox"</span>:    <span class="str">"tight"</span>,
})

<span class="kw">import</span> numpy <span class="kw">as</span> np
x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

fig, ax = plt.<span class="fn">subplots</span>()
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x),       label=<span class="str">"sin(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x),       label=<span class="str">"cos(x)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Same plot, different defaults"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">legend</span>()
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reads three current rcParam values to show that they are just floats and strings sitting in a dictionary. 2) <code>plt.rcParams.update({...})</code> bulk-overwrites a handful of keys: figure size and DPI, font family and size, title and label sizes, spine visibility (hides the top and right border for a cleaner look), grid on with low alpha, thicker lines, frameless legend, and high-DPI sharp output for <code>savefig</code>. 3) Once those defaults are set, the plot below them inherits all of it -- <code>plt.subplots()</code> uses (8, 5), <code>ax.plot</code> uses linewidth 2.0, <code>ax.legend()</code> draws frameless. 4) The same six lines of plotting code now produce a figure that looks like it was hand-styled, but you wrote zero per-call styling.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">plt.rcParams</div><div class="card-body">A global dict-like object holding every default. Persists for the life of the Python process.</div></div>
<div class="calc-card"><div class="card-title">rcParams.update(...)</div><div class="card-body">Bulk-set many keys at once. Idiomatic at the top of a notebook.</div></div>
<div class="calc-card"><div class="card-title">matplotlibrc file</div><div class="card-body">Per-user config file with the same keys, found via <code>matplotlib.matplotlib_fname()</code>. Edit once, applies forever.</div></div>
<div class="calc-card"><div class="card-title">temporary override</div><div class="card-body"><code>with plt.rc_context({"font.size": 14}):</code> -- changes only inside the <code>with</code> block.</div></div>
<div class="calc-card"><div class="card-title">discoverability</div><div class="card-body"><code>list(plt.rcParams.keys())</code> -- there are ~300 keys covering everything.</div></div>
<div class="calc-card"><div class="card-title">reset</div><div class="card-body"><code>plt.rcdefaults()</code> reverts to factory defaults. Handy when an experiment leaves rcParams in a weird state.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Style Sheets: ggplot, seaborn, fivethirtyeight</h2>

<p class="l-text">A <strong>style sheet</strong> is a pre-bundled rcParams set that mimics a popular look. <code>plt.style.use("ggplot")</code> instantly turns your figures into ggplot-style charts; <code>plt.style.use("seaborn-v0_8-darkgrid")</code> gives them the seaborn look. Five seconds of typing, complete visual makeover.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># List every available style</span>
<span class="fn">print</span>(plt.style.available)
<span class="cm"># ['Solarize_Light2', '_classic_test_patch', 'bmh', 'classic',</span>
<span class="cm">#  'dark_background', 'fast', 'fivethirtyeight', 'ggplot',</span>
<span class="cm">#  'seaborn-v0_8', 'seaborn-v0_8-darkgrid', 'seaborn-v0_8-paper',</span>
<span class="cm">#  'seaborn-v0_8-poster', 'tableau-colorblind10', ...]</span>

<span class="cm"># Apply a style</span>
plt.style.<span class="fn">use</span>(<span class="str">"ggplot"</span>)

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">100</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">4</span>))
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x),     label=<span class="str">"sin(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x),     label=<span class="str">"cos(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x / <span class="num">2</span>), label=<span class="str">"sin(x/2)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"ggplot style"</span>); ax.<span class="fn">legend</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Combine multiple styles -- right-most wins ties</span>
plt.style.<span class="fn">use</span>([<span class="str">"seaborn-v0_8-darkgrid"</span>, <span class="str">"seaborn-v0_8-paper"</span>])

<span class="cm"># Use a style only inside a with-block</span>
<span class="kw">with</span> plt.style.<span class="fn">context</span>(<span class="str">"dark_background"</span>):
    fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">4</span>))
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), color=<span class="str">"cyan"</span>)
    ax.<span class="fn">set_title</span>(<span class="str">"dark_background style (only in this block)"</span>)
    plt.<span class="fn">show</span>()
<span class="cm"># After the block, the previous style returns automatically</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plt.style.available</code> lists every bundled style sheet -- about 30 of them, ranging from publication-friendly (<code>seaborn-v0_8-paper</code>) to presentation-friendly (<code>seaborn-v0_8-poster</code>) to themed (<code>dark_background</code>, <code>tableau-colorblind10</code>). 2) <code>plt.style.use("ggplot")</code> copies ggplot's rcParams into the global state -- pale grey background, white grid, soft red and blue defaults. Every plot drawn afterwards looks ggplot-y. 3) Passing a list combines styles; rightmost values win ties. This is how you stack a base look ("seaborn-darkgrid") with a paper-tuned overlay ("seaborn-paper"). 4) <code>plt.style.context(...)</code> is the temporary version: inside the <code>with</code> block the style is active, outside it the previous setting is restored automatically -- perfect for one-off "make this single plot dark themed" without touching everything else.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ggplot</div><div class="card-body">Grey background, white grid, soft palette. Reads as "data analysis chart".</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8</div><div class="card-body">Modern, clean, white grid, pleasant colours. Most popular default in modern Python notebooks.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8-paper</div><div class="card-body">Smaller fonts, thinner lines -- sized for journal columns rather than slides.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8-poster</div><div class="card-body">Bigger fonts, thicker lines -- sized for presentations and posters.</div></div>
<div class="calc-card"><div class="card-title">dark_background</div><div class="card-body">Black plot area, light text. Matches dark slide decks and websites.</div></div>
<div class="calc-card"><div class="card-title">tableau-colorblind10</div><div class="card-body">10-colour palette tested for colour blindness. Use for production charts seen by many people.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Colours and Cycles</h2>

<p class="l-text">When you call <code>ax.plot</code> three times without specifying <code>color</code>, the lines come out in different default colours. Where do those come from? The <strong>property cycler</strong>: an iterable of colour codes (and optionally line styles) that Matplotlib walks through call by call.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> cycler <span class="kw">import</span> cycler
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Inspect the current colour cycle</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"axes.prop_cycle"</span>].<span class="fn">by_key</span>()[<span class="str">"color"</span>])
<span class="cm"># ['#1f77b4', '#ff7f0e', '#2ca02c', ...]   (the 'tab10' palette)</span>

<span class="cm"># Replace it with a custom 5-colour palette</span>
custom_cycle = <span class="fn">cycler</span>(color=[
    <span class="str">"#c8a96e"</span>,   <span class="cm"># gold</span>
    <span class="str">"#4ecdc4"</span>,   <span class="cm"># teal</span>
    <span class="str">"#ff6b6b"</span>,   <span class="cm"># coral</span>
    <span class="str">"#a78bfa"</span>,   <span class="cm"># violet</span>
    <span class="str">"#f4d35e"</span>,   <span class="cm"># mustard</span>
])
plt.rcParams[<span class="str">"axes.prop_cycle"</span>] = custom_cycle

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x + k * <span class="num">0.6</span>) + k * <span class="num">0.3</span>, label=f<span class="str">"series {k}"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Custom 5-colour cycle"</span>); ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
plt.<span class="fn">show</span>()

<span class="cm"># Combine colour cycle with linestyle cycle so seven series are still distinguishable</span>
mixed = (<span class="fn">cycler</span>(color=plt.cm.tab10.colors[:<span class="num">7</span>]) +
         <span class="fn">cycler</span>(linestyle=[<span class="str">"-"</span>, <span class="str">"--"</span>, <span class="str">"-."</span>, <span class="str">":"</span>, <span class="str">"-"</span>, <span class="str">"--"</span>, <span class="str">"-."</span>]))
plt.rcParams[<span class="str">"axes.prop_cycle"</span>] = mixed</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plt.rcParams["axes.prop_cycle"].by_key()["color"]</code> reads the current colour list; out of the box it is <code>tab10</code> -- ten distinct colours optimised for categorical data. 2) <code>cycler(color=[...])</code> from the <code>cycler</code> library builds a new five-colour palette in your project's accent colours. Assigning it to <code>plt.rcParams["axes.prop_cycle"]</code> swaps it in globally. 3) The for-loop draws five sin curves; without specifying <code>color=</code> at all, each pulls the next entry from the cycle -- gold, teal, coral, violet, mustard. 4) The <code>mixed</code> example shows that you can <em>add</em> two cyclers to vary multiple properties together; the result yields seven distinguishable line styles even when colours start to repeat -- useful when you have many series in one plot.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">tab10 / tab20</div><div class="card-body">Default categorical palettes -- 10 or 20 distinct hues. Use when your categories have no order.</div></div>
<div class="calc-card"><div class="card-title">single named colour</div><div class="card-body"><code>color="firebrick"</code> or <code>color="C0"</code> ("first colour in the cycle") -- both valid in any draw call.</div></div>
<div class="calc-card"><div class="card-title">hex codes</div><div class="card-body">Most reliable. <code>"#c8a96e"</code> always renders identically across machines.</div></div>
<div class="calc-card"><div class="card-title">cycler combinations</div><div class="card-body"><code>cycler(color=...) + cycler(linestyle=...)</code> zips them; <code>* cycler(...)</code> takes the cartesian product.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Colormaps: Sequential, Diverging, Qualitative</h2>

<p class="l-text">For continuous data -- a heatmap, a 2D histogram, a 3D surface, a scatter coloured by a numeric variable -- you need a <strong>colormap</strong>: a function from a number to a colour. Picking the right one is one of the highest-leverage decisions you can make for figure quality.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sequential</div><div class="card-body">Light to dark, single hue. Use when values run from low to high with no special meaning at zero. Examples: <code>viridis</code>, <code>plasma</code>, <code>magma</code>, <code>cividis</code>, <code>Blues</code>.</div></div>
<div class="calc-card"><div class="card-title">Diverging</div><div class="card-body">Colour-neutral-colour, e.g. blue-white-red. Use when zero (or another centre value) is meaningful and you want to highlight deviations. Examples: <code>RdBu_r</code>, <code>coolwarm</code>, <code>seismic</code>.</div></div>
<div class="calc-card"><div class="card-title">Qualitative</div><div class="card-body">Distinct hues with no order. Use for categorical data (class labels, model names). Examples: <code>tab10</code>, <code>Set1</code>, <code>Paired</code>.</div></div>
<div class="calc-card"><div class="card-title">Cyclic</div><div class="card-body">Colour-A-colour-A. Use for angular data (phase, hour of day). Examples: <code>twilight</code>, <code>hsv</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = rng.<span class="fn">normal</span>(size=<span class="num">1000</span>)
y = rng.<span class="fn">normal</span>(size=<span class="num">1000</span>)
density = np.<span class="fn">exp</span>(-(x ** <span class="num">2</span> + y ** <span class="num">2</span>) / <span class="num">2</span>)   <span class="cm"># numeric label per point</span>

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">3</span>, figsize=(<span class="num">15</span>, <span class="num">4.5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Sequential: low-to-high, no special centre</span>
sc1 = axes[<span class="num">0</span>].<span class="fn">scatter</span>(x, y, c=density, cmap=<span class="str">"viridis"</span>, s=<span class="num">10</span>)
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"viridis (sequential)"</span>)
fig.<span class="fn">colorbar</span>(sc1, ax=axes[<span class="num">0</span>])

<span class="cm"># Diverging: positive vs negative</span>
diff = x - y
sc2 = axes[<span class="num">1</span>].<span class="fn">scatter</span>(x, y, c=diff, cmap=<span class="str">"RdBu_r"</span>,
                      vmin=-<span class="num">3</span>, vmax=<span class="num">3</span>, s=<span class="num">10</span>)
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"RdBu_r (diverging, centred at 0)"</span>)
fig.<span class="fn">colorbar</span>(sc2, ax=axes[<span class="num">1</span>])

<span class="cm"># Qualitative: discrete categories</span>
labels = (rng.<span class="fn">uniform</span>(size=<span class="num">1000</span>) * <span class="num">5</span>).<span class="fn">astype</span>(<span class="ty">int</span>)
sc3 = axes[<span class="num">2</span>].<span class="fn">scatter</span>(x, y, c=labels, cmap=<span class="str">"tab10"</span>, s=<span class="num">10</span>)
axes[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"tab10 (qualitative)"</span>)
fig.<span class="fn">colorbar</span>(sc3, ax=axes[<span class="num">2</span>], ticks=<span class="fn">range</span>(<span class="num">5</span>))

<span class="kw">for</span> ax <span class="kw">in</span> axes:
    ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates 1000 random (x, y) points and a "density" value per point computed from a 2D Gaussian. 2) The first subplot uses <code>cmap="viridis"</code> -- the modern default sequential map. Viridis is perceptually uniform: equal numerical jumps look like equal visual jumps to the human eye, and it stays readable when printed in greyscale. 3) The second uses <code>cmap="RdBu_r"</code> with <code>vmin=-3, vmax=3</code>: red for positive, blue for negative, white at zero. The <code>vmin/vmax</code> symmetric clipping is what makes the white sit exactly at zero; without it, an unbalanced data range would shift the white off-centre and lie about where zero actually is. 4) The third uses <code>cmap="tab10"</code> for discrete labels 0-4; the colorbar ticks are set explicitly to the integer values. 5) <code>fig.colorbar</code> attaches a colour legend to each subplot, decoded automatically from the <code>scatter</code> handle.</p>

<div class="l-warn"><strong>Two rules you must never break:</strong> (1) Never use <code>jet</code> -- it has perceptual artifacts (a hard yellow-green band) that lie about your data. Use <code>viridis</code> or <code>plasma</code>. (2) For diverging maps, always set symmetric <code>vmin</code> and <code>vmax</code>; otherwise the central neutral colour will not align with zero and the figure will misrepresent the data.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Fonts: Sans, Serif, LaTeX</h2>

<p class="l-text">A figure that uses a serif font in its body and a sans-serif font in its plots looks unprofessional. Synchronising the two is a small but enormously impactful detail.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Family-level setting</span>
plt.rcParams.<span class="fn">update</span>({
    <span class="str">"font.family"</span>:     <span class="str">"serif"</span>,         <span class="cm"># 'serif', 'sans-serif', 'monospace', or 'cursive'</span>
    <span class="str">"font.serif"</span>:      [<span class="str">"DejaVu Serif"</span>, <span class="str">"Computer Modern Roman"</span>, <span class="str">"Times New Roman"</span>],
    <span class="str">"mathtext.fontset"</span>:<span class="str">"cm"</span>,             <span class="cm"># Computer Modern math (LaTeX-like)</span>
})

<span class="cm"># Per-element overrides</span>
fig, ax = plt.<span class="fn">subplots</span>()
ax.<span class="fn">plot</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], [<span class="num">1</span>, <span class="num">4</span>, <span class="num">9</span>])
ax.<span class="fn">set_title</span>(<span class="str">"Serif headings"</span>,  fontsize=<span class="num">14</span>, fontweight=<span class="str">"bold"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>, fontsize=<span class="num">12</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>, fontsize=<span class="num">12</span>)
ax.<span class="fn">text</span>(<span class="num">1.5</span>, <span class="num">7</span>, <span class="str">"annotation in italic"</span>,
        fontstyle=<span class="str">"italic"</span>, fontsize=<span class="num">11</span>, color=<span class="str">"#c8a96e"</span>)
plt.<span class="fn">show</span>()

<span class="cm"># True LaTeX (requires a working LaTeX install on the system)</span>
<span class="cm"># plt.rcParams.update({</span>
<span class="cm">#     "text.usetex":      True,</span>
<span class="cm">#     "font.family":      "serif",</span>
<span class="cm">#     "font.serif":       ["Computer Modern Roman"],</span>
<span class="cm"># })</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>font.family = "serif"</code> tells Matplotlib to render every text element with a serif typeface. 2) <code>font.serif = [...]</code> is the priority list of actual serif fonts to try -- the first one available on the system wins. DejaVu Serif ships with Matplotlib so it always works; Computer Modern matches LaTeX papers; Times is a classic fallback. 3) <code>mathtext.fontset = "cm"</code> sets the math typeface to Computer Modern, the LaTeX default -- this matters for axis labels containing dollar signs like <code>r"$\\\\sigma$"</code>. 4) Per-element overrides (<code>fontsize</code>, <code>fontweight</code>, <code>fontstyle</code>) trump the global defaults for that one text artist. 5) The commented section enables <code>usetex=True</code>, which actually shells out to a real LaTeX install -- highest typographical fidelity, but slower and dependent on a working LaTeX installation.</p>

<div class="calc-highlight"><strong>For a thesis:</strong> match your document. If your thesis is set in Computer Modern serif, use the same in your figures (with or without <code>usetex=True</code>). If it is set in Helvetica/Arial sans-serif, use that. Inconsistency between document body and figure text is the single most common amateur mistake.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Annotations: Arrows, Labels, Highlights</h2>

<p class="l-text">A good plot does not just show data -- it tells the reader exactly what to look at. <code>ax.annotate</code> is the workhorse: text plus an optional arrow pointing from the text to a specific data point.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)
y = np.<span class="fn">sin</span>(x) * np.<span class="fn">exp</span>(-x / <span class="num">8</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, y, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Damped sine with annotations"</span>)

<span class="cm"># Find and annotate the global maximum</span>
imax = <span class="fn">int</span>(y.<span class="fn">argmax</span>())
ax.<span class="fn">annotate</span>(
    f<span class="str">"global max: ({x[imax]:.2f}, {y[imax]:.2f})"</span>,
    xy=(x[imax], y[imax]),                       <span class="cm"># point to annotate</span>
    xytext=(x[imax] + <span class="num">1.5</span>, y[imax] + <span class="num">0.15</span>),      <span class="cm"># text position</span>
    fontsize=<span class="num">11</span>,
    arrowprops=<span class="fn">dict</span>(
        arrowstyle=<span class="str">"->"</span>,
        color=<span class="str">"#4ecdc4"</span>,
        connectionstyle=<span class="str">"arc3,rad=0.2"</span>
    ),
    bbox=<span class="fn">dict</span>(boxstyle=<span class="str">"round,pad=0.4"</span>,
              facecolor=<span class="str">"white"</span>,
              edgecolor=<span class="str">"#4ecdc4"</span>)
)

<span class="cm"># Plain text without an arrow</span>
ax.<span class="fn">text</span>(<span class="num">0.5</span>, -<span class="num">0.55</span>,
        <span class="str">"envelope: e^(-x/8)"</span>,
        fontsize=<span class="num">11</span>, fontstyle=<span class="str">"italic"</span>, color=<span class="str">"#888"</span>)

<span class="cm"># Highlight a region with axvspan</span>
ax.<span class="fn">axvspan</span>(<span class="num">2</span>, <span class="num">4</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.10</span>)
ax.<span class="fn">text</span>(<span class="num">3</span>, <span class="num">0.55</span>, <span class="str">"region of interest"</span>,
        ha=<span class="str">"center"</span>, fontsize=<span class="num">10</span>, color=<span class="str">"#c8a96e"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a damped sine and plots it. 2) Finds the index of the global max via <code>y.argmax()</code> -- this is how you mark "the interesting point" programmatically rather than hard-coding coordinates. 3) <code>ax.annotate</code> with <code>xy=</code> (the point being annotated, in data coordinates) and <code>xytext=</code> (where the text label sits, also in data coordinates) draws both the label and an arrow from text to point. <code>arrowprops</code> styles the arrow: arrowhead style, colour, and a slight curvature via <code>connectionstyle="arc3,rad=0.2"</code> which makes it look hand-drawn rather than rigid. 4) <code>bbox=dict(boxstyle="round,pad=0.4", ...)</code> wraps the label in a rounded white box with a teal border -- so it stays readable on top of busy data. 5) <code>ax.text</code> places loose explanatory text without an arrow. 6) <code>ax.axvspan(2, 4, alpha=0.10)</code> shades the vertical strip between x=2 and x=4 in faint gold to mark a region of interest, and a centred label sits inside it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ax.annotate</div><div class="card-body">Text + arrow. Use to point at a specific data point with a label.</div></div>
<div class="calc-card"><div class="card-title">ax.text</div><div class="card-body">Just text, no arrow. Use for headings, side notes, equations on the plot.</div></div>
<div class="calc-card"><div class="card-title">arrowstyle</div><div class="card-body"><code>"-&gt;"</code>, <code>"-|&gt;"</code>, <code>"-["</code>, <code>"&lt;-&gt;"</code>, ... -- nine arrowhead variants.</div></div>
<div class="calc-card"><div class="card-title">connectionstyle</div><div class="card-body"><code>"arc3,rad=0.2"</code> for curved, <code>"angle3"</code> for right-angle bent, <code>"arc"</code> for simple arc.</div></div>
<div class="calc-card"><div class="card-title">bbox</div><div class="card-body">Round, square, or rounded box behind the text. Improves legibility over busy data.</div></div>
<div class="calc-card"><div class="card-title">axvspan / axhspan</div><div class="card-body">Shaded vertical / horizontal stripes. Use for "training region", "evaluation period", "outlier zone".</div></div>
</div>

<div id="plot-mpl-l4-annot-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A damped sine with three layers of annotation. A teal arrow with a rounded white box points at the global maximum. A faint gold vertical strip marks a region of interest with a centred label. A grey italic note at the bottom explains the analytical envelope. Each annotation guides the eye to a different fact, and together they turn a curve into a story.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. A Reusable Thesis Theme</h2>

<p class="l-text">Putting it all together: a single function you import at the top of every notebook to make every plot publication-ready by default.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># thesis_style.py</span>
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> cycler <span class="kw">import</span> cycler

<span class="kw">def</span> <span class="fn">apply_thesis_style</span>():
    <span class="str">"""Call once at the top of every notebook."""</span>
    plt.rcParams.<span class="fn">update</span>({
        <span class="cm"># Figure</span>
        <span class="str">"figure.figsize"</span>:      (<span class="num">8</span>, <span class="num">5</span>),
        <span class="str">"figure.dpi"</span>:          <span class="num">110</span>,
        <span class="str">"savefig.dpi"</span>:         <span class="num">300</span>,
        <span class="str">"savefig.bbox"</span>:        <span class="str">"tight"</span>,
        <span class="str">"savefig.pad_inches"</span>:  <span class="num">0.05</span>,
        <span class="cm"># Font</span>
        <span class="str">"font.family"</span>:         <span class="str">"serif"</span>,
        <span class="str">"font.serif"</span>:          [<span class="str">"DejaVu Serif"</span>, <span class="str">"Computer Modern Roman"</span>, <span class="str">"Times New Roman"</span>],
        <span class="str">"font.size"</span>:           <span class="num">11</span>,
        <span class="str">"mathtext.fontset"</span>:    <span class="str">"cm"</span>,
        <span class="cm"># Axes</span>
        <span class="str">"axes.titlesize"</span>:      <span class="num">13</span>,
        <span class="str">"axes.titleweight"</span>:    <span class="str">"bold"</span>,
        <span class="str">"axes.labelsize"</span>:      <span class="num">11</span>,
        <span class="str">"axes.spines.top"</span>:     <span class="kw">False</span>,
        <span class="str">"axes.spines.right"</span>:   <span class="kw">False</span>,
        <span class="str">"axes.linewidth"</span>:      <span class="num">0.9</span>,
        <span class="str">"axes.grid"</span>:           <span class="kw">True</span>,
        <span class="str">"axes.grid.which"</span>:     <span class="str">"major"</span>,
        <span class="str">"grid.alpha"</span>:          <span class="num">0.25</span>,
        <span class="str">"grid.linewidth"</span>:      <span class="num">0.6</span>,
        <span class="cm"># Lines and markers</span>
        <span class="str">"lines.linewidth"</span>:     <span class="num">2.0</span>,
        <span class="str">"lines.markersize"</span>:    <span class="num">5.5</span>,
        <span class="cm"># Ticks</span>
        <span class="str">"xtick.direction"</span>:     <span class="str">"out"</span>,
        <span class="str">"ytick.direction"</span>:     <span class="str">"out"</span>,
        <span class="str">"xtick.major.size"</span>:    <span class="num">4</span>,
        <span class="str">"ytick.major.size"</span>:    <span class="num">4</span>,
        <span class="cm"># Legend</span>
        <span class="str">"legend.frameon"</span>:      <span class="kw">False</span>,
        <span class="str">"legend.fontsize"</span>:     <span class="num">10</span>,
        <span class="cm"># Colour cycle: muted, colourblind-aware</span>
        <span class="str">"axes.prop_cycle"</span>: <span class="fn">cycler</span>(color=[
            <span class="str">"#c8a96e"</span>, <span class="str">"#4ecdc4"</span>, <span class="str">"#ff6b6b"</span>,
            <span class="str">"#a78bfa"</span>, <span class="str">"#f4d35e"</span>, <span class="str">"#5599e9"</span>,
            <span class="str">"#82c91e"</span>, <span class="str">"#fa5252"</span>,
        ]),
    })

<span class="cm"># At the top of every notebook:</span>
<span class="cm"># from thesis_style import apply_thesis_style</span>
<span class="cm"># apply_thesis_style()</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a function so the user gets one clear entry point: import it, call it, done. 2) Figure block sets a sensible default size for both screen and paper, and high-DPI <code>savefig</code> with tight bounding box -- so any saved figure is publication-ready without tweaking. 3) Font block locks down a serif typeface that both matches LaTeX-typeset bodies and falls back gracefully to fonts shipped with Matplotlib. 4) Axes block kills the top and right spines (modern minimalist look), turns on a faint grid, and sets readable but not heavy line widths. 5) Lines and markers tune visual weight to match prose body text. 6) Ticks point outwards, classic publication style. 7) Legend has no frame -- cleaner against the soft grid. 8) The custom <code>prop_cycle</code> uses a muted, colourblind-friendly palette so categorical plots are accessible. 9) The intended usage is two lines at the top of every notebook -- after that, every plot is automatically themed.</p>

<div class="calc-highlight"><strong>The pay-off:</strong> stop hand-styling each plot. Set the global theme once, write the actual plotting code, save, ship. Your figures stay consistent across the entire thesis or paper, and you never have to remember whether you used 1.8 or 2.0 line width on figure 12.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Wrap-up & Recap</h2>

<p class="l-text">Styling Matplotlib is much smaller and more systematic than it looks. Five concepts cover 90% of the work.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>rcParams</strong> is the global config dictionary. Modify once, every plot inherits.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>Style sheets</strong> (<code>plt.style.use</code>) are pre-bundled rcParams sets. Five seconds of typing for a complete makeover.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Colormaps</strong> matter: sequential for low-to-high, diverging for plus-minus around zero, qualitative for categories. Never use <code>jet</code>.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Fonts</strong> should match your document. Serif for LaTeX papers, sans-serif for slides, always synchronised with the body text.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Annotations</strong> turn a chart into a story: arrows for "look here", text boxes for context, axvspan for "region of interest".</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>A custom theme</strong> bottles all of the above into one function you call at the top of every notebook. Stop hand-styling.</div></div>
</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> <code>plt.rcParams.update({...})</code> at the top of a notebook saves hours of per-plot styling.<br><strong>2.</strong> Built-in style sheets (<code>ggplot</code>, <code>seaborn-v0_8</code>, <code>seaborn-v0_8-paper</code>) are the cheapest visual upgrade you can buy.<br><strong>3.</strong> Use <code>viridis</code> or <code>plasma</code> for sequential data, <code>RdBu_r</code> with symmetric vmin/vmax for diverging, <code>tab10</code> for categorical.<br><strong>4.</strong> Set <code>font.family</code> to match your document body text. <code>mathtext.fontset = "cm"</code> aligns dollar-sign math with LaTeX.<br><strong>5.</strong> <code>ax.annotate(text, xy=..., xytext=..., arrowprops=...)</code> draws an arrow from text to data point. <code>bbox=dict(...)</code> wraps the label in a readable box.<br><strong>6.</strong> A 30-line <code>apply_thesis_style()</code> function bottles everything: import once at the top, every plot becomes publication-ready.<br><strong>7.</strong> Per-element overrides (<code>color=</code>, <code>fontsize=</code> in a single call) always trump global rcParams -- so you can break the theme on the few plots that need it.<br><strong>8.</strong> Style is downstream of clarity: a clean default theme exists to make the data shine, not to make the chart look "designed".</div></div>
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

  // Annotations demo
  function annotDemo(id, title, xl, yl, maxLbl, regionLbl, envLbl){
    var el = document.getElementById(id); if(!el) return;
    var x=[],y=[];
    for (var i=0;i<200;i++){var xi=10*i/199;x.push(xi);y.push(Math.sin(xi)*Math.exp(-xi/8));}
    var iMax=0; for (var k=1;k<y.length;k++) if (y[k]>y[iMax]) iMax=k;
    var trace = {x:x,y:y,mode:'lines',line:{color:T.accent,width:2},name:'damped',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},
      shapes:[
        {type:'rect',xref:'x',yref:'paper',x0:2,x1:4,y0:0,y1:1,fillcolor:'rgba(200,169,110,0.12)',line:{width:0}}
      ],
      annotations:[
        {x:x[iMax],y:y[iMax],text:maxLbl+': ('+x[iMax].toFixed(2)+', '+y[iMax].toFixed(2)+')',showarrow:true,arrowhead:2,arrowcolor:'#4ecdc4',ax:60,ay:-50,font:{color:T.text,size:11},bgcolor:'rgba(255,255,255,0.85)',bordercolor:'#4ecdc4',borderwidth:1,borderpad:4},
        {x:3,y:0.55,text:regionLbl,showarrow:false,font:{color:T.accent,size:11}},
        {x:0.5,y:-0.55,text:envLbl,showarrow:false,font:{color:'#888',size:10,family:'serif'},xanchor:'left'}
      ],
      height:420
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  annotDemo('plot-mpl-l4-annot-en','Damped sine with annotations','x','y','global max','region of interest','envelope: e^(-x/8)');
  annotDemo('plot-mpl-l4-annot-tr','Notlu sonumlu sinus','x','y','genel maks','ilgi bolgesi','zarf: e^(-x/8)');
},250);</script>`,

tr: `<p class="l-text"><strong>Varsayılan Matplotlib 2008 görünümlü.</strong> Soluk mavi çizgiler, 10pt'de Helvetica etiketleri, soluk beyaz bir ızgara -- işlevsel ama hiçbir tez veya makale onu olduğu gibi yayımlamaz. Ancak on dakikalık biçimleme aynı kodu bir derginin kapağına çıkacak bir figüre dönüştürür. Bu ders o on dakika hakkında: rcParams (genel yapılandırma), yerleşik stil sayfaları (ggplot, seaborn), renk haritası seçimi (viridis, plasma, sıralı vs ıraksak), font yönetimi, notlar ve her projeye kopyalayıp yapıştırabileceğiniz özel bir tez teması.</p>

<p class="l-text">Sonunda her not defterinin üstüne içe aktardığınızda, çizdiğiniz her grafiği varsayılan olarak yayına hazır hale getiren küçük bir <code>thesis_style.py</code> parçanız olacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li><code>plt.rcParams</code> ile genel varsayılanları ayarla; sonraki tüm grafikler stilini miras alsın</li><li>Hazır stil sayfalarıyla görünümü tek satırda değiştir (<code>ggplot</code>, <code>seaborn</code>, <code>fivethirtyeight</code>)</li><li>Doğru renk haritası ailesini seç: sıralı (sequential), ıraksak (diverging), döngüsel (cyclic) ve niteliksel (qualitative)</li><li>Renk döngülerini ve isimli marka renklerini yönetip seri stilinde tutarlılık sağla</li><li>Font ayarlarını yap (sans / serif / LaTeX) ve temiz bir font hiyerarşisi kur</li><li><code>annotate</code> ve <code>axvspan</code> ile ok, açıklama ve vurgu bölgeleri ekle</li><li>Her şeyi yeniden kullanılabilir bir <code>thesis_theme.py</code> parçasında topla ve her not defterine import et</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. rcParams: Genel Varsayılanlar</h2>

<p class="l-text">Her Matplotlib ayarının -- font, çizgi genişliği, varsayılan renk, tik yönü, figür DPI'si -- bir "rc" anahtarı vardır. <code>plt.rcParams</code> bu varsayılanların sözlüğüdür; bir kez değiştirmek, oturum boyunca sonradan çizdiğiniz her grafiği değiştirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Mevcut degerleri incele</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"font.size"</span>])         <span class="cm"># 10.0</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"lines.linewidth"</span>])   <span class="cm"># 1.5</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"figure.dpi"</span>])        <span class="cm"># 100.0</span>

<span class="cm"># Oturumun geri kalani icin gecerli yeni varsayilanlar ayarla</span>
plt.rcParams.<span class="fn">update</span>({
    <span class="str">"figure.figsize"</span>: (<span class="num">8</span>, <span class="num">5</span>),
    <span class="str">"figure.dpi"</span>:     <span class="num">110</span>,
    <span class="str">"font.family"</span>:    <span class="str">"DejaVu Sans"</span>,
    <span class="str">"font.size"</span>:      <span class="num">11</span>,
    <span class="str">"axes.titlesize"</span>: <span class="num">13</span>,
    <span class="str">"axes.labelsize"</span>: <span class="num">11</span>,
    <span class="str">"axes.spines.top"</span>:   <span class="kw">False</span>,
    <span class="str">"axes.spines.right"</span>: <span class="kw">False</span>,
    <span class="str">"axes.grid"</span>:      <span class="kw">True</span>,
    <span class="str">"grid.alpha"</span>:     <span class="num">0.25</span>,
    <span class="str">"lines.linewidth"</span>: <span class="num">2.0</span>,
    <span class="str">"legend.frameon"</span>:  <span class="kw">False</span>,
    <span class="str">"savefig.dpi"</span>:     <span class="num">200</span>,
    <span class="str">"savefig.bbox"</span>:    <span class="str">"tight"</span>,
})

<span class="kw">import</span> numpy <span class="kw">as</span> np
x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)

fig, ax = plt.<span class="fn">subplots</span>()
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x),       label=<span class="str">"sin(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x),       label=<span class="str">"cos(x)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Ayni grafik, farkli varsayilanlar"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">legend</span>()
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Üç mevcut rcParam değerini okuyarak bunların sadece bir sözlükte oturan float ve string'ler olduğunu gösterir. 2) <code>plt.rcParams.update({...})</code> bir avuç anahtarı toplu üzerine yazar: figür boyutu ve DPI, font ailesi ve boyutu, başlık ve etiket boyutları, omurga görünürlüğü (daha temiz bir görünüm için üst ve sağ kenarlığı gizler), düşük alpha ile ızgara açık, daha kalın çizgiler, çerçevesiz açıklama ve <code>savefig</code> için yüksek-DPI keskin çıktı. 3) Bu varsayılanlar ayarlandıktan sonra, altındaki grafik hepsini miras alır -- <code>plt.subplots()</code> (8, 5) kullanır, <code>ax.plot</code> linewidth 2.0 kullanır, <code>ax.legend()</code> çerçevesiz çizer. 4) Aynı altı satırlık çizim kodu artık elle biçimlenmiş gibi görünen bir figür üretir, ama siz her çağrı için sıfır biçimleme yazdınız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">plt.rcParams</div><div class="card-body">Her varsayılanı tutan global sözlük benzeri bir nesne. Python sürecinin yaşamı boyunca kalıcıdır.</div></div>
<div class="calc-card"><div class="card-title">rcParams.update(...)</div><div class="card-body">Birçok anahtarı bir kerede toplu ayarlayın. Bir not defterinin üstünde standart kullanım.</div></div>
<div class="calc-card"><div class="card-title">matplotlibrc dosyası</div><div class="card-body">Aynı anahtarlara sahip kullanıcı başına yapılandırma dosyası, <code>matplotlib.matplotlib_fname()</code> ile bulunur. Bir kez düzenleyin, sonsuza kadar uygulanır.</div></div>
<div class="calc-card"><div class="card-title">geçici geçersiz kılma</div><div class="card-body"><code>with plt.rc_context({"font.size": 14}):</code> -- yalnızca <code>with</code> bloğu içinde değişir.</div></div>
<div class="calc-card"><div class="card-title">keşfedilebilirlik</div><div class="card-body"><code>list(plt.rcParams.keys())</code> -- her şeyi kapsayan ~300 anahtar vardır.</div></div>
<div class="calc-card"><div class="card-title">sıfırlama</div><div class="card-body"><code>plt.rcdefaults()</code> fabrika varsayılanlarına döner. Bir deney rcParams'ı garip bir durumda bıraktığında işe yarar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Stil Sayfaları: ggplot, seaborn, fivethirtyeight</h2>

<p class="l-text">Bir <strong>stil sayfası</strong>, popüler bir görünümü taklit eden önceden paketlenmiş bir rcParams setidir. <code>plt.style.use("ggplot")</code> figürlerinizi anında ggplot tarzı grafiklere dönüştürür; <code>plt.style.use("seaborn-v0_8-darkgrid")</code> seaborn görünümünü verir. Beş saniye yazma, eksiksiz görsel yenilenme.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Mevcut tum stilleri listele</span>
<span class="fn">print</span>(plt.style.available)
<span class="cm"># ['Solarize_Light2', '_classic_test_patch', 'bmh', 'classic',</span>
<span class="cm">#  'dark_background', 'fast', 'fivethirtyeight', 'ggplot',</span>
<span class="cm">#  'seaborn-v0_8', 'seaborn-v0_8-darkgrid', 'seaborn-v0_8-paper',</span>
<span class="cm">#  'seaborn-v0_8-poster', 'tableau-colorblind10', ...]</span>

<span class="cm"># Bir stil uygula</span>
plt.style.<span class="fn">use</span>(<span class="str">"ggplot"</span>)

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">100</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">4</span>))
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x),     label=<span class="str">"sin(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">cos</span>(x),     label=<span class="str">"cos(x)"</span>)
ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x / <span class="num">2</span>), label=<span class="str">"sin(x/2)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"ggplot stili"</span>); ax.<span class="fn">legend</span>()
plt.<span class="fn">show</span>()

<span class="cm"># Birden cok stil birlestir -- en sagdaki kazanir</span>
plt.style.<span class="fn">use</span>([<span class="str">"seaborn-v0_8-darkgrid"</span>, <span class="str">"seaborn-v0_8-paper"</span>])

<span class="cm"># Bir stili yalnizca with bloku icinde kullan</span>
<span class="kw">with</span> plt.style.<span class="fn">context</span>(<span class="str">"dark_background"</span>):
    fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">4</span>))
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x), color=<span class="str">"cyan"</span>)
    ax.<span class="fn">set_title</span>(<span class="str">"dark_background stili (yalnizca bu blokta)"</span>)
    plt.<span class="fn">show</span>()
<span class="cm"># Bloktan sonra onceki stil otomatik olarak doner</span></code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>plt.style.available</code> her paketlenmiş stil sayfasını listeler -- yayın dostu (<code>seaborn-v0_8-paper</code>) ile sunum dostu (<code>seaborn-v0_8-poster</code>) ve temalı (<code>dark_background</code>, <code>tableau-colorblind10</code>) arasında değişen yaklaşık 30 tanesi. 2) <code>plt.style.use("ggplot")</code> ggplot'un rcParams'ını global duruma kopyalar -- soluk gri arka plan, beyaz ızgara, yumuşak kırmızı ve mavi varsayılanlar. Sonra çizilen her grafik ggplot-vari görünür. 3) Bir liste geçmek stilleri birleştirir; en sağdaki değerler kazanır. Bu, bir taban görünümünü ("seaborn-darkgrid") makaleye uyarlanmış bir kaplamayla ("seaborn-paper") nasıl üst üste yığacağınızdır. 4) <code>plt.style.context(...)</code> geçici versiyondur: <code>with</code> bloğu içinde stil etkindir, dışında önceki ayar otomatik olarak geri yüklenir -- her şeye dokunmadan tek seferlik "bu tek grafiği koyu temalı yap" için mükemmel.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ggplot</div><div class="card-body">Gri arka plan, beyaz ızgara, yumuşak palet. "Veri analizi grafiği" gibi okunur.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8</div><div class="card-body">Modern, temiz, beyaz ızgara, hoş renkler. Modern Python not defterlerinde en popüler varsayılan.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8-paper</div><div class="card-body">Daha küçük yazı tipleri, daha ince çizgiler -- slaytlar yerine dergi sütunları için boyutlandırılmış.</div></div>
<div class="calc-card"><div class="card-title">seaborn-v0_8-poster</div><div class="card-body">Daha büyük yazı tipleri, daha kalın çizgiler -- sunumlar ve posterler için boyutlandırılmış.</div></div>
<div class="calc-card"><div class="card-title">dark_background</div><div class="card-body">Siyah grafik alanı, açık metin. Koyu slayt destelerine ve web sitelerine uyar.</div></div>
<div class="calc-card"><div class="card-title">tableau-colorblind10</div><div class="card-body">Renk körlüğü için test edilmiş 10 renk paleti. Çok kişi tarafından görülen üretim grafikleri için kullanın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Renkler ve Döngüler</h2>

<p class="l-text"><code>ax.plot</code>'u <code>color</code> belirtmeden üç kez çağırdığınızda, çizgiler farklı varsayılan renklerle çıkar. Bunlar nereden gelir? <strong>Özellik döngüsü</strong>'nden: Matplotlib'in çağrı çağrı dolaştığı, renk kodları (ve isteğe bağlı olarak çizgi stilleri) için yinelenen bir nesne.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> cycler <span class="kw">import</span> cycler
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Mevcut renk dongusunu incele</span>
<span class="fn">print</span>(plt.rcParams[<span class="str">"axes.prop_cycle"</span>].<span class="fn">by_key</span>()[<span class="str">"color"</span>])
<span class="cm"># ['#1f77b4', '#ff7f0e', '#2ca02c', ...]   ('tab10' paleti)</span>

<span class="cm"># Ozel 5 renkli paletle degistir</span>
custom_cycle = <span class="fn">cycler</span>(color=[
    <span class="str">"#c8a96e"</span>,   <span class="cm"># altin</span>
    <span class="str">"#4ecdc4"</span>,   <span class="cm"># teal</span>
    <span class="str">"#ff6b6b"</span>,   <span class="cm"># mercan</span>
    <span class="str">"#a78bfa"</span>,   <span class="cm"># menekse</span>
    <span class="str">"#f4d35e"</span>,   <span class="cm"># hardal</span>
])
plt.rcParams[<span class="str">"axes.prop_cycle"</span>] = custom_cycle

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">9</span>, <span class="num">5</span>))
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    ax.<span class="fn">plot</span>(x, np.<span class="fn">sin</span>(x + k * <span class="num">0.6</span>) + k * <span class="num">0.3</span>, label=f<span class="str">"seri {k}"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Ozel 5 renkli dongu"</span>); ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
plt.<span class="fn">show</span>()

<span class="cm"># Renk dongusunu cizgi stili dongusuyle birlestir, yedi seri hala ayirt edilebilir</span>
mixed = (<span class="fn">cycler</span>(color=plt.cm.tab10.colors[:<span class="num">7</span>]) +
         <span class="fn">cycler</span>(linestyle=[<span class="str">"-"</span>, <span class="str">"--"</span>, <span class="str">"-."</span>, <span class="str">":"</span>, <span class="str">"-"</span>, <span class="str">"--"</span>, <span class="str">"-."</span>]))
plt.rcParams[<span class="str">"axes.prop_cycle"</span>] = mixed</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>plt.rcParams["axes.prop_cycle"].by_key()["color"]</code> mevcut renk listesini okur; kutudan çıktığı gibi <code>tab10</code>'dur -- kategorik veri için optimize edilmiş on farklı renk. 2) <code>cycler</code> kütüphanesinden <code>cycler(color=[...])</code>, projenizin vurgu renklerinde yeni bir beş renkli palet kurar. Bunu <code>plt.rcParams["axes.prop_cycle"]</code>'a atamak global olarak değiştirir. 3) For döngüsü beş sin eğrisi çizer; <code>color=</code>'u hiç belirtmeden, her biri döngünün bir sonraki girdisini çeker -- altın, teal, mercan, menekşe, hardal. 4) <code>mixed</code> örneği iki cycler'ı birden çok özelliği birlikte değiştirmek için <em>topla</em>yabileceğinizi gösterir; sonuç, renkler tekrar etmeye başladığında bile yedi ayırt edilebilir çizgi stili verir -- bir grafikte çok sayıda seriniz olduğunda yararlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">tab10 / tab20</div><div class="card-body">Varsayılan kategorik paletler -- 10 veya 20 farklı ton. Kategorilerinizin sırası olmadığında kullanın.</div></div>
<div class="calc-card"><div class="card-title">tek isimli renk</div><div class="card-body"><code>color="firebrick"</code> veya <code>color="C0"</code> ("döngüdeki ilk renk") -- ikisi de herhangi bir çizim çağrısında geçerli.</div></div>
<div class="calc-card"><div class="card-title">hex kodları</div><div class="card-body">En güvenilir. <code>"#c8a96e"</code> her zaman makineler arasında özdeş şekilde render olur.</div></div>
<div class="calc-card"><div class="card-title">cycler kombinasyonları</div><div class="card-body"><code>cycler(color=...) + cycler(linestyle=...)</code> onları sıkıştırır; <code>* cycler(...)</code> kartezyen çarpımı alır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Renk Haritaları: Sıralı, Iraksak, Niteliksel</h2>

<p class="l-text">Sürekli veri için -- bir ısı haritası, bir 2B histogram, bir 3B yüzey, sayısal bir değişkenle renklendirilmiş bir saçılım -- bir <strong>renk haritası</strong>na ihtiyacınız var: bir sayıdan bir renge giden bir fonksiyon. Doğru olanı seçmek figür kalitesi için yapabileceğiniz en yüksek getirili kararlardan biridir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıralı</div><div class="card-body">Açıktan koyuya, tek ton. Değerler düşükten yükseğe gittiğinde ve sıfırda özel bir anlam olmadığında kullanın. Örnekler: <code>viridis</code>, <code>plasma</code>, <code>magma</code>, <code>cividis</code>, <code>Blues</code>.</div></div>
<div class="calc-card"><div class="card-title">Iraksak</div><div class="card-body">Renk-nötr-renk, ör. mavi-beyaz-kırmızı. Sıfır (veya başka bir merkez değer) anlamlı olduğunda ve sapmaları vurgulamak istediğinizde kullanın. Örnekler: <code>RdBu_r</code>, <code>coolwarm</code>, <code>seismic</code>.</div></div>
<div class="calc-card"><div class="card-title">Niteliksel</div><div class="card-body">Sırasız ayrı tonlar. Kategorik veri için (sınıf etiketleri, model adları) kullanın. Örnekler: <code>tab10</code>, <code>Set1</code>, <code>Paired</code>.</div></div>
<div class="calc-card"><div class="card-title">Döngüsel</div><div class="card-body">Renk-A-renk-A. Açısal veri için (faz, günün saati) kullanın. Örnekler: <code>twilight</code>, <code>hsv</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = rng.<span class="fn">normal</span>(size=<span class="num">1000</span>)
y = rng.<span class="fn">normal</span>(size=<span class="num">1000</span>)
density = np.<span class="fn">exp</span>(-(x ** <span class="num">2</span> + y ** <span class="num">2</span>) / <span class="num">2</span>)   <span class="cm"># nokta basina sayisal etiket</span>

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">3</span>, figsize=(<span class="num">15</span>, <span class="num">4.5</span>), constrained_layout=<span class="kw">True</span>)

<span class="cm"># Sirali: dusuk-yuksek, ozel merkez yok</span>
sc1 = axes[<span class="num">0</span>].<span class="fn">scatter</span>(x, y, c=density, cmap=<span class="str">"viridis"</span>, s=<span class="num">10</span>)
axes[<span class="num">0</span>].<span class="fn">set_title</span>(<span class="str">"viridis (sirali)"</span>)
fig.<span class="fn">colorbar</span>(sc1, ax=axes[<span class="num">0</span>])

<span class="cm"># Iraksak: pozitif vs negatif</span>
diff = x - y
sc2 = axes[<span class="num">1</span>].<span class="fn">scatter</span>(x, y, c=diff, cmap=<span class="str">"RdBu_r"</span>,
                      vmin=-<span class="num">3</span>, vmax=<span class="num">3</span>, s=<span class="num">10</span>)
axes[<span class="num">1</span>].<span class="fn">set_title</span>(<span class="str">"RdBu_r (iraksak, 0'da merkezli)"</span>)
fig.<span class="fn">colorbar</span>(sc2, ax=axes[<span class="num">1</span>])

<span class="cm"># Niteliksel: ayrik kategoriler</span>
labels = (rng.<span class="fn">uniform</span>(size=<span class="num">1000</span>) * <span class="num">5</span>).<span class="fn">astype</span>(<span class="ty">int</span>)
sc3 = axes[<span class="num">2</span>].<span class="fn">scatter</span>(x, y, c=labels, cmap=<span class="str">"tab10"</span>, s=<span class="num">10</span>)
axes[<span class="num">2</span>].<span class="fn">set_title</span>(<span class="str">"tab10 (niteliksel)"</span>)
fig.<span class="fn">colorbar</span>(sc3, ax=axes[<span class="num">2</span>], ticks=<span class="fn">range</span>(<span class="num">5</span>))

<span class="kw">for</span> ax <span class="kw">in</span> axes:
    ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) 1000 rastgele (x, y) nokta ve nokta başına 2B Gauss'tan hesaplanan bir "yoğunluk" değeri üretir. 2) Birinci alt grafik <code>cmap="viridis"</code> kullanır -- modern varsayılan sıralı harita. Viridis algısal olarak tekdüzedir: eşit sayısal sıçramalar insan gözüne eşit görsel sıçramalar gibi görünür ve gri tonlamalı yazdırıldığında okunabilir kalır. 3) İkinci, <code>vmin=-3, vmax=3</code> ile <code>cmap="RdBu_r"</code> kullanır: pozitif için kırmızı, negatif için mavi, sıfırda beyaz. <code>vmin/vmax</code> simetrik kırpma, beyazın tam olarak sıfıra oturmasını sağlayan şeydir; bu olmadan dengesiz bir veri aralığı beyazı merkez dışına kaydırır ve sıfırın aslında nerede olduğu hakkında yalan söyler. 4) Üçüncü, ayrık etiketler 0-4 için <code>cmap="tab10"</code> kullanır; renk çubuğu tikleri açıkça tam sayı değerlerine ayarlanmıştır. 5) <code>fig.colorbar</code> her alt grafiğe <code>scatter</code> tutamacından otomatik olarak çözülen bir renk açıklaması ekler.</p>

<div class="l-warn"><strong>Asla çiğnememeniz gereken iki kural:</strong> (1) <code>jet</code>'i asla kullanmayın -- veriniz hakkında yalan söyleyen algısal bozuklukları (sert sarı-yeşil bant) vardır. <code>viridis</code> veya <code>plasma</code> kullanın. (2) Iraksak haritalar için her zaman simetrik <code>vmin</code> ve <code>vmax</code> ayarlayın; aksi halde merkezi nötr renk sıfırla hizalanmayacak ve figür veriyi yanlış temsil edecektir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Fontlar: Sans, Serif, LaTeX</h2>

<p class="l-text">Gövdesinde serif font, grafiklerinde sans-serif font kullanan bir figür profesyonelce görünmez. İkisini senkronize etmek küçük ama muazzam etkili bir ayrıntıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Aile-seviyesi ayar</span>
plt.rcParams.<span class="fn">update</span>({
    <span class="str">"font.family"</span>:     <span class="str">"serif"</span>,         <span class="cm"># 'serif', 'sans-serif', 'monospace' veya 'cursive'</span>
    <span class="str">"font.serif"</span>:      [<span class="str">"DejaVu Serif"</span>, <span class="str">"Computer Modern Roman"</span>, <span class="str">"Times New Roman"</span>],
    <span class="str">"mathtext.fontset"</span>:<span class="str">"cm"</span>,             <span class="cm"># Computer Modern math (LaTeX-benzeri)</span>
})

<span class="cm"># Element basi gecersiz kilmalar</span>
fig, ax = plt.<span class="fn">subplots</span>()
ax.<span class="fn">plot</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], [<span class="num">1</span>, <span class="num">4</span>, <span class="num">9</span>])
ax.<span class="fn">set_title</span>(<span class="str">"Serif basliklar"</span>,  fontsize=<span class="num">14</span>, fontweight=<span class="str">"bold"</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>, fontsize=<span class="num">12</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>, fontsize=<span class="num">12</span>)
ax.<span class="fn">text</span>(<span class="num">1.5</span>, <span class="num">7</span>, <span class="str">"italic notu"</span>,
        fontstyle=<span class="str">"italic"</span>, fontsize=<span class="num">11</span>, color=<span class="str">"#c8a96e"</span>)
plt.<span class="fn">show</span>()

<span class="cm"># Gercek LaTeX (sistemde calisan bir LaTeX kurulumu gerektirir)</span>
<span class="cm"># plt.rcParams.update({</span>
<span class="cm">#     "text.usetex":      True,</span>
<span class="cm">#     "font.family":      "serif",</span>
<span class="cm">#     "font.serif":       ["Computer Modern Roman"],</span>
<span class="cm"># })</span></code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>font.family = "serif"</code> Matplotlib'e her metin öğesini bir serif yazı tipiyle render etmesini söyler. 2) <code>font.serif = [...]</code> denenecek gerçek serif fontlarının öncelik listesidir -- sistemde bulunan ilki kazanır. DejaVu Serif Matplotlib ile gönderilir bu yüzden her zaman çalışır; Computer Modern LaTeX makaleleriyle eşleşir; Times klasik bir yedektir. 3) <code>mathtext.fontset = "cm"</code> matematik yazı tipini Computer Modern'a, LaTeX varsayılanına ayarlar -- bu, <code>r"$\\\\sigma$"</code> gibi dolar işareti içeren eksen etiketleri için önemlidir. 4) Element başı geçersiz kılmalar (<code>fontsize</code>, <code>fontweight</code>, <code>fontstyle</code>) o tek metin sanatçısı için global varsayılanları geçersiz kılar. 5) Yorumlanmış bölüm <code>usetex=True</code>'yu etkinleştirir, ki bu gerçekten gerçek bir LaTeX kurulumuna kabuk açar -- en yüksek tipografik sadakat ama daha yavaş ve çalışan bir LaTeX kurulumuna bağımlı.</p>

<div class="calc-highlight"><strong>Bir tez için:</strong> belgenizi eşleştirin. Tezniz Computer Modern serif'te ise figürlerinizde aynısını kullanın (<code>usetex=True</code> ile veya onsuz). Helvetica/Arial sans-serif'te ise onu kullanın. Belge gövdesi ile figür metni arasındaki tutarsızlık, en yaygın amatör hatadır.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Notlar: Oklar, Etiketler, Vurgular</h2>

<p class="l-text">İyi bir grafik sadece veri göstermez -- okuyucuya tam olarak neye bakacağını söyler. <code>ax.annotate</code> beygir gücüdür: metin artı metinden belirli bir veri noktasına işaret eden isteğe bağlı bir ok.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">10</span>, <span class="num">200</span>)
y = np.<span class="fn">sin</span>(x) * np.<span class="fn">exp</span>(-x / <span class="num">8</span>)

fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">10</span>, <span class="num">5</span>))
ax.<span class="fn">plot</span>(x, y, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>); ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Notlu sonumlu sinus"</span>)

<span class="cm"># Genel maksimumu bul ve isaretle</span>
imax = <span class="fn">int</span>(y.<span class="fn">argmax</span>())
ax.<span class="fn">annotate</span>(
    f<span class="str">"genel maks: ({x[imax]:.2f}, {y[imax]:.2f})"</span>,
    xy=(x[imax], y[imax]),                       <span class="cm"># isaretlenecek nokta</span>
    xytext=(x[imax] + <span class="num">1.5</span>, y[imax] + <span class="num">0.15</span>),      <span class="cm"># metin konumu</span>
    fontsize=<span class="num">11</span>,
    arrowprops=<span class="fn">dict</span>(
        arrowstyle=<span class="str">"->"</span>,
        color=<span class="str">"#4ecdc4"</span>,
        connectionstyle=<span class="str">"arc3,rad=0.2"</span>
    ),
    bbox=<span class="fn">dict</span>(boxstyle=<span class="str">"round,pad=0.4"</span>,
              facecolor=<span class="str">"white"</span>,
              edgecolor=<span class="str">"#4ecdc4"</span>)
)

<span class="cm"># Oksuz duz metin</span>
ax.<span class="fn">text</span>(<span class="num">0.5</span>, -<span class="num">0.55</span>,
        <span class="str">"zarf: e^(-x/8)"</span>,
        fontsize=<span class="num">11</span>, fontstyle=<span class="str">"italic"</span>, color=<span class="str">"#888"</span>)

<span class="cm"># axvspan ile bir bolge vurgula</span>
ax.<span class="fn">axvspan</span>(<span class="num">2</span>, <span class="num">4</span>, color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.10</span>)
ax.<span class="fn">text</span>(<span class="num">3</span>, <span class="num">0.55</span>, <span class="str">"ilgi bolgesi"</span>,
        ha=<span class="str">"center"</span>, fontsize=<span class="num">10</span>, color=<span class="str">"#c8a96e"</span>)

plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Sönümlü bir sinüs kurar ve çizer. 2) Genel maks indeksini <code>y.argmax()</code> ile bulur -- "ilginç noktayı" sabit kodlanmış koordinatlar yerine programatik olarak işaretleme yolunuz budur. 3) <code>ax.annotate</code>, <code>xy=</code> (notlanan nokta, veri koordinatlarında) ve <code>xytext=</code> (metin etiketinin oturduğu yer, yine veri koordinatlarında) ile hem etiketi hem de metinden noktaya bir oku çizer. <code>arrowprops</code> oku biçimler: ok ucu stili, renk ve katı yerine elle çizilmiş gibi gösteren <code>connectionstyle="arc3,rad=0.2"</code> aracılığıyla hafif bir kavis. 4) <code>bbox=dict(boxstyle="round,pad=0.4", ...)</code> etiketi teal kenarlıklı yuvarlatılmış beyaz bir kutuya sarar -- böylece yoğun verinin üstünde okunabilir kalır. 5) <code>ax.text</code> oksuz, gevşek açıklayıcı metin yerleştirir. 6) <code>ax.axvspan(2, 4, alpha=0.10)</code> x=2 ve x=4 arasındaki dikey şeridi soluk altın renginde gölgeleyip ilgi bölgesi olarak işaretler ve içine ortalanmış bir etiket oturtur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ax.annotate</div><div class="card-body">Metin + ok. Bir etiketle belirli bir veri noktasına işaret etmek için kullanın.</div></div>
<div class="calc-card"><div class="card-title">ax.text</div><div class="card-body">Yalnızca metin, ok yok. Başlıklar, yan notlar, grafiğin üstündeki denklemler için kullanın.</div></div>
<div class="calc-card"><div class="card-title">arrowstyle</div><div class="card-body"><code>"-&gt;"</code>, <code>"-|&gt;"</code>, <code>"-["</code>, <code>"&lt;-&gt;"</code>, ... -- dokuz ok ucu varyantı.</div></div>
<div class="calc-card"><div class="card-title">connectionstyle</div><div class="card-body">Eğri için <code>"arc3,rad=0.2"</code>, dik açı bükük için <code>"angle3"</code>, basit yay için <code>"arc"</code>.</div></div>
<div class="calc-card"><div class="card-title">bbox</div><div class="card-body">Metnin arkasında yuvarlak, kare veya yuvarlatılmış kutu. Yoğun verinin üzerinde okunabilirliği iyileştirir.</div></div>
<div class="calc-card"><div class="card-title">axvspan / axhspan</div><div class="card-body">Gölgeli dikey / yatay şeritler. "Eğitim bölgesi", "değerlendirme dönemi", "aykırı değer alanı" için kullanın.</div></div>
</div>

<div id="plot-mpl-l4-annot-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin özü:</strong> Üç katman notla sönümlü bir sinüs. Yuvarlatılmış beyaz kutulu teal bir ok genel maksimuma işaret eder. Ortalanmış etiketli soluk altın dikey şerit bir ilgi bölgesini işaretler. Alttaki gri italik not analitik zarfı açıklar. Her not gözü farklı bir gerçeğe yönlendirir ve birlikte bir eğriyi bir hikâyeye dönüştürürler.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yeniden Kullanılabilir Bir Tez Teması</h2>

<p class="l-text">Hepsini bir araya getirme: her grafiği varsayılan olarak yayına hazır hale getirmek için her not defterinin üstüne içe aktardığınız tek bir fonksiyon.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># thesis_style.py</span>
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> cycler <span class="kw">import</span> cycler

<span class="kw">def</span> <span class="fn">apply_thesis_style</span>():
    <span class="str">"""Her not defterinin ustunde bir kez cagirin."""</span>
    plt.rcParams.<span class="fn">update</span>({
        <span class="cm"># Figur</span>
        <span class="str">"figure.figsize"</span>:      (<span class="num">8</span>, <span class="num">5</span>),
        <span class="str">"figure.dpi"</span>:          <span class="num">110</span>,
        <span class="str">"savefig.dpi"</span>:         <span class="num">300</span>,
        <span class="str">"savefig.bbox"</span>:        <span class="str">"tight"</span>,
        <span class="str">"savefig.pad_inches"</span>:  <span class="num">0.05</span>,
        <span class="cm"># Font</span>
        <span class="str">"font.family"</span>:         <span class="str">"serif"</span>,
        <span class="str">"font.serif"</span>:          [<span class="str">"DejaVu Serif"</span>, <span class="str">"Computer Modern Roman"</span>, <span class="str">"Times New Roman"</span>],
        <span class="str">"font.size"</span>:           <span class="num">11</span>,
        <span class="str">"mathtext.fontset"</span>:    <span class="str">"cm"</span>,
        <span class="cm"># Eksenler</span>
        <span class="str">"axes.titlesize"</span>:      <span class="num">13</span>,
        <span class="str">"axes.titleweight"</span>:    <span class="str">"bold"</span>,
        <span class="str">"axes.labelsize"</span>:      <span class="num">11</span>,
        <span class="str">"axes.spines.top"</span>:     <span class="kw">False</span>,
        <span class="str">"axes.spines.right"</span>:   <span class="kw">False</span>,
        <span class="str">"axes.linewidth"</span>:      <span class="num">0.9</span>,
        <span class="str">"axes.grid"</span>:           <span class="kw">True</span>,
        <span class="str">"axes.grid.which"</span>:     <span class="str">"major"</span>,
        <span class="str">"grid.alpha"</span>:          <span class="num">0.25</span>,
        <span class="str">"grid.linewidth"</span>:      <span class="num">0.6</span>,
        <span class="cm"># Cizgiler ve isaretciler</span>
        <span class="str">"lines.linewidth"</span>:     <span class="num">2.0</span>,
        <span class="str">"lines.markersize"</span>:    <span class="num">5.5</span>,
        <span class="cm"># Tikler</span>
        <span class="str">"xtick.direction"</span>:     <span class="str">"out"</span>,
        <span class="str">"ytick.direction"</span>:     <span class="str">"out"</span>,
        <span class="str">"xtick.major.size"</span>:    <span class="num">4</span>,
        <span class="str">"ytick.major.size"</span>:    <span class="num">4</span>,
        <span class="cm"># Aciklama</span>
        <span class="str">"legend.frameon"</span>:      <span class="kw">False</span>,
        <span class="str">"legend.fontsize"</span>:     <span class="num">10</span>,
        <span class="cm"># Renk dongusu: yumusak, renk korlugune duyarli</span>
        <span class="str">"axes.prop_cycle"</span>: <span class="fn">cycler</span>(color=[
            <span class="str">"#c8a96e"</span>, <span class="str">"#4ecdc4"</span>, <span class="str">"#ff6b6b"</span>,
            <span class="str">"#a78bfa"</span>, <span class="str">"#f4d35e"</span>, <span class="str">"#5599e9"</span>,
            <span class="str">"#82c91e"</span>, <span class="str">"#fa5252"</span>,
        ]),
    })

<span class="cm"># Her not defterinin ustunde:</span>
<span class="cm"># from thesis_style import apply_thesis_style</span>
<span class="cm"># apply_thesis_style()</span></code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Bir fonksiyon tanımlar, böylece kullanıcı tek net bir giriş noktası alır: içe aktar, çağır, bitti. 2) Figür bloğu hem ekran hem de kâğıt için makul bir varsayılan boyut ayarlar ve sıkı sınırlama kutulu yüksek-DPI <code>savefig</code> -- böylece kaydedilen herhangi bir figür ince ayar yapmadan yayına hazır olur. 3) Font bloğu hem LaTeX-dizgili gövdelere uyan hem de Matplotlib ile gönderilen fontlara zarafetle geri dönen bir serif yazı tipini kilitler. 4) Eksen bloğu üst ve sağ omurgaları öldürür (modern minimalist görünüm), soluk bir ızgarayı açar ve okunabilir ama ağır olmayan çizgi genişliklerini ayarlar. 5) Çizgiler ve işaretçiler görsel ağırlığı düz gövde metniyle eşleşecek şekilde ayarlar. 6) Tikler dışarıyı işaret eder, klasik yayın stili. 7) Açıklamada çerçeve yok -- yumuşak ızgaraya karşı daha temiz. 8) Özel <code>prop_cycle</code> yumuşak, renk körlüğü dostu bir palet kullanır, böylece kategorik grafikler erişilebilir olur. 9) Amaçlanan kullanım, her not defterinin üstünde iki satırdır -- ondan sonra her grafik otomatik olarak temalanır.</p>

<div class="calc-highlight"><strong>Kazanç:</strong> her grafiği elle biçimlemeyi bırakın. Genel temayı bir kez ayarlayın, gerçek çizim kodunu yazın, kaydedin, gönderin. Figürleriniz tüm tez veya makale boyunca tutarlı kalır ve şekil 12'de 1.8 mi yoksa 2.0 çizgi genişliği mi kullandığınızı asla hatırlamak zorunda kalmazsınız.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet</h2>

<p class="l-text">Matplotlib biçimlemek göründüğünden çok daha küçük ve sistematiktir. Beş kavram işin %90'ını kapsar.</p>

<div class="calc-steps">
<div class="step-row"><div class="step-num">1</div><div class="step-body"><strong>rcParams</strong> genel yapılandırma sözlüğüdür. Bir kez değiştirin, her grafik miras alır.</div></div>
<div class="step-row"><div class="step-num">2</div><div class="step-body"><strong>Stil sayfaları</strong> (<code>plt.style.use</code>) önceden paketlenmiş rcParams setleridir. Eksiksiz bir yenilenme için beş saniye yazma.</div></div>
<div class="step-row"><div class="step-num">3</div><div class="step-body"><strong>Renk haritaları</strong> önemlidir: düşük-yüksek için sıralı, sıfır etrafında artı-eksi için ıraksak, kategoriler için niteliksel. <code>jet</code>'i asla kullanmayın.</div></div>
<div class="step-row"><div class="step-num">4</div><div class="step-body"><strong>Fontlar</strong> belgenizle eşleşmelidir. LaTeX makaleleri için serif, slaytlar için sans-serif, her zaman gövde metniyle senkronize.</div></div>
<div class="step-row"><div class="step-num">5</div><div class="step-body"><strong>Notlar</strong> bir grafiği bir hikâyeye dönüştürür: "buraya bak" için oklar, bağlam için metin kutuları, "ilgi bölgesi" için axvspan.</div></div>
<div class="step-row"><div class="step-num">6</div><div class="step-body"><strong>Özel bir tema</strong> yukarıdakilerin hepsini her not defterinin üstünde çağırdığınız tek bir fonksiyona şişeler. Elle biçimlemeyi bırakın.</div></div>
</div>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bir not defterinin üstünde <code>plt.rcParams.update({...})</code> her grafik için biçimleme saatlerinden tasarruf ettirir.<br><strong>2.</strong> Yerleşik stil sayfaları (<code>ggplot</code>, <code>seaborn-v0_8</code>, <code>seaborn-v0_8-paper</code>) satın alabileceğiniz en ucuz görsel yükseltmedir.<br><strong>3.</strong> Sıralı veri için <code>viridis</code> veya <code>plasma</code>, ıraksak için simetrik vmin/vmax ile <code>RdBu_r</code>, kategorik için <code>tab10</code> kullanın.<br><strong>4.</strong> Belge gövde metniyle eşleşmek için <code>font.family</code>'yi ayarlayın. <code>mathtext.fontset = "cm"</code> dolar işaretli matematiği LaTeX ile hizalar.<br><strong>5.</strong> <code>ax.annotate(text, xy=..., xytext=..., arrowprops=...)</code> metinden veri noktasına bir ok çizer. <code>bbox=dict(...)</code> etiketi okunabilir bir kutuya sarar.<br><strong>6.</strong> 30 satırlık bir <code>apply_thesis_style()</code> fonksiyonu her şeyi şişeler: üstte bir kez içe aktarın, her grafik yayına hazır olur.<br><strong>7.</strong> Element başı geçersiz kılmalar (tek bir çağrıda <code>color=</code>, <code>fontsize=</code>) her zaman global rcParams'ı geçersiz kılar -- böylece ihtiyaç duyan birkaç grafikte temayı kırabilirsiniz.<br><strong>8.</strong> Stil, netliğin alt akışıdır: temiz bir varsayılan tema, grafiği "tasarlanmış" göstermek için değil, verinin parlamasını sağlamak için vardır.</div></div>
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

  // Annotations demo
  function annotDemo(id, title, xl, yl, maxLbl, regionLbl, envLbl){
    var el = document.getElementById(id); if(!el) return;
    var x=[],y=[];
    for (var i=0;i<200;i++){var xi=10*i/199;x.push(xi);y.push(Math.sin(xi)*Math.exp(-xi/8));}
    var iMax=0; for (var k=1;k<y.length;k++) if (y[k]>y[iMax]) iMax=k;
    var trace = {x:x,y:y,mode:'lines',line:{color:T.accent,width:2},name:'damped',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:title,font:{color:T.text,size:14}},
      xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},
      shapes:[
        {type:'rect',xref:'x',yref:'paper',x0:2,x1:4,y0:0,y1:1,fillcolor:'rgba(200,169,110,0.12)',line:{width:0}}
      ],
      annotations:[
        {x:x[iMax],y:y[iMax],text:maxLbl+': ('+x[iMax].toFixed(2)+', '+y[iMax].toFixed(2)+')',showarrow:true,arrowhead:2,arrowcolor:'#4ecdc4',ax:60,ay:-50,font:{color:T.text,size:11},bgcolor:'rgba(255,255,255,0.85)',bordercolor:'#4ecdc4',borderwidth:1,borderpad:4},
        {x:3,y:0.55,text:regionLbl,showarrow:false,font:{color:T.accent,size:11}},
        {x:0.5,y:-0.55,text:envLbl,showarrow:false,font:{color:'#888',size:10,family:'serif'},xanchor:'left'}
      ],
      height:420
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  annotDemo('plot-mpl-l4-annot-en','Damped sine with annotations','x','y','global max','region of interest','envelope: e^(-x/8)');
  annotDemo('plot-mpl-l4-annot-tr','Notlu sonumlu sinus','x','y','genel maks','ilgi bolgesi','zarf: e^(-x/8)');
},250);</script>
`
};
