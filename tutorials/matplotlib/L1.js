window.MATPLOTLIB_L1 = {

en: `<p class="l-text"><strong>Matplotlib is the bedrock of scientific plotting in Python.</strong> NumPy gives you arrays, Pandas gives you tables, scikit-learn gives you models -- and Matplotlib is the one that lets you actually <em>see</em> what is going on. Almost every other plotting library you have heard of (Seaborn, Pandas <code>.plot()</code>, plotnine, even some of Plotly's defaults) was built on top of, inspired by, or designed to extend Matplotlib.</p>

<p class="l-text">In this lesson we will not draw fifty kinds of charts. Instead we will build a rock-solid <strong>mental model</strong>: what a figure actually <em>is</em>, the difference between the two APIs you keep seeing in tutorials, and the canonical pattern (<code>fig, ax = plt.subplots()</code>) that you will use for the rest of your career. Once this is solid, every other Matplotlib feature becomes obvious.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Distinguish the pyplot state-machine API from the object-oriented Figure/Axes API</li><li>Build any plot with the canonical fig, ax = plt.subplots() pattern</li><li>Customize titles, axis labels, legends, and grid lines on an Axes</li><li>Save figures to PNG, SVG, and PDF at publication-ready DPI</li><li>Diagnose why a plot does not render in Jupyter or in a script</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Matplotlib? The Hook</h2>

<p class="l-text">Imagine you have just trained a sentiment classifier on 50,000 movie reviews. Your validation accuracy is 0.84. Is that good? Bad? Is the model overfitting? Are some classes systematically harder? Did training plateau early or kept improving? You cannot answer any of these questions from a single number -- you need pictures.</p>

<div class="calc-highlight"><strong>Plotting is not decoration -- it is <em>cognition</em>.</strong> A loss curve tells you when to stop training. A confusion matrix tells you which class is confused with which. A residual plot tells you the model is biased. Every serious ML practitioner spends a third of their time looking at plots, not at code.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Static & precise</div><div class="card-body">Matplotlib produces pixel-perfect, publication-ready figures. PDF, SVG, PNG -- you control every dot. This is why papers and theses use it.</div></div>
<div class="calc-card"><div class="card-title">Universal</div><div class="card-body">Pandas, scikit-learn, statsmodels, seaborn, NetworkX -- they all return Matplotlib axes. Knowing Matplotlib unlocks them all.</div></div>
<div class="calc-card"><div class="card-title">Two APIs</div><div class="card-body">A quick "MATLAB-style" pyplot API and a more powerful object-oriented API. We will master both, but lean on the OO one.</div></div>
<div class="calc-card"><div class="card-title">Composable</div><div class="card-body">Multiple subplots, twin axes, inset zooms, custom annotations -- you can build absolutely anything because every element is an object you can grab.</div></div>
<div class="calc-card"><div class="card-title">Backends</div><div class="card-body">Same code renders in Jupyter, in a script, in a PyQt window, or to a headless PNG file on a server. The drawing backend is swappable.</div></div>
<div class="calc-card"><div class="card-title">The default</div><div class="card-body">When you ask any senior data scientist "how do I plot X", their first answer references Matplotlib. It is the lingua franca of Python plotting.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: A typical NLP workflow</div><div class="example-body">You finish training a BERT sentiment model. You plot: (1) train and validation loss curves to detect overfitting, (2) confusion matrix as a heatmap to see which classes confuse each other, (3) ROC curves per class, (4) attention heatmaps for a few sample sentences, (5) embedding scatter via t-SNE coloured by predicted label. Five different plots, all Matplotlib, all in one notebook. By the end of this course you will write each in fewer than ten lines.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why is "looking at the data" before training so often the difference between a working model and a broken one? Because numbers lie about their distribution. A column with mean 5 and std 2 sounds clean -- but if you plot it you might discover a fat tail or a bimodal mixture that breaks every assumption your model is making. Plotting forces you to confront the actual shape of your data.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Anatomy of a Figure: Figure, Axes, Axis</h2>

<p class="l-text">Before any code, you need three words clear in your head: <strong>Figure</strong>, <strong>Axes</strong>, <strong>Axis</strong>. New users confuse them constantly because they sound the same. They are not.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Figure</div><div class="card-body">The whole window or page. The outer canvas. One Figure can contain many plots. Saving a figure means saving the entire canvas as one image.</div></div>
<div class="calc-card"><div class="card-title">Axes</div><div class="card-body">A single plot inside the figure (a "subplot"). It has its own x-axis, y-axis, title, data, legend. A figure with 4 subplots has 1 Figure and 4 Axes objects. Plural form, but one Axes object = one plot.</div></div>
<div class="calc-card"><div class="card-title">Axis</div><div class="card-body">A single number line: the x-axis or the y-axis of an Axes. You almost never touch Axis objects directly -- you use the Axes methods <code>ax.set_xlabel</code>, <code>ax.set_xticks</code>.</div></div>
<div class="calc-card"><div class="card-title">Artist</div><div class="card-body">Everything visible (a line, a tick label, the legend box, a text annotation) is an Artist. The Figure and Axes are Artist containers. This is why you can grab and modify any element later.</div></div>
</div>

<div id="plot-mpl-l1-anatomy-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this diagram shows:</strong> The Matplotlib hierarchy. The outermost beige rectangle is the <em>Figure</em>. Inside it, the smaller rectangle is one <em>Axes</em> -- the actual plotting region with its data, x-axis, y-axis, and title. The two coloured number lines along the bottom and the left are the two <em>Axis</em> objects. Crucially, you only ever ask the Axes for things ("draw me a line", "set the title"); the Axes then talks to its Axis children and to the Figure on your behalf.</div>

<div class="calc-highlight"><strong>Mental model:</strong> A Figure is a piece of paper. An Axes is a plot drawn on that paper. An Axis is one of the two number lines surrounding that plot. A figure can hold many axes; each axes has exactly two axis (x and y) -- or three for 3D plots.</div>

<div class="calc-example"><div class="example-label">EXAMPLE</div><div class="example-body">A 2x2 grid of subplots is one <strong>Figure</strong> object containing four <strong>Axes</strong> objects. Each of those four Axes objects has two <strong>Axis</strong> objects (x and y). So a 2x2 grid has the count: 1 Figure, 4 Axes, 8 Axis objects. Once you internalise this, the API stops feeling random.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Two APIs: pyplot vs Object-Oriented</h2>

<p class="l-text">Matplotlib offers two ways to draw the same plot. They look different in code but produce identical pixels. Knowing both -- and especially when to prefer the OO one -- separates beginners from intermediates.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">2</span> * np.pi, <span class="num">200</span>)
y = np.<span class="fn">sin</span>(x)

<span class="cm"># ---------- Style A: pyplot (MATLAB-style) ----------</span>
plt.<span class="fn">figure</span>(figsize=(<span class="num">7</span>, <span class="num">4</span>))
plt.<span class="fn">plot</span>(x, y)
plt.<span class="fn">xlabel</span>(<span class="str">"x"</span>)
plt.<span class="fn">ylabel</span>(<span class="str">"sin(x)"</span>)
plt.<span class="fn">title</span>(<span class="str">"pyplot style"</span>)
plt.<span class="fn">show</span>()

<span class="cm"># ---------- Style B: object-oriented (recommended) ----------</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">4</span>))
ax.<span class="fn">plot</span>(x, y)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(x)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"object-oriented style"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports <code>matplotlib.pyplot</code> as <code>plt</code> -- this submodule is the user-facing convenience layer. 2) Builds 200 evenly-spaced x values from 0 to 2 pi and computes sin(x). 3) Style A uses module-level functions: <code>plt.figure()</code> creates a figure, then <code>plt.plot()</code>, <code>plt.xlabel()</code>, <code>plt.title()</code> all act on whatever the "current" figure happens to be. 4) Style B explicitly creates both a Figure and an Axes via <code>plt.subplots()</code>, then calls methods on the <code>ax</code> object directly. 5) <code>plt.show()</code> renders the figure (in a script) or finalises it (in Jupyter).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">pyplot API (plt.plot)</div><div class="compare-item">Imitates MATLAB syntax</div><div class="compare-item">Implicit "current" figure and axes</div><div class="compare-item">Short and quick for one-off plots</div><div class="compare-item">Breaks down for multi-subplot figures</div><div class="compare-item">Hard to debug in long notebooks</div><div class="compare-item">Use for: throwaway exploration</div></div>
<div class="compare-col"><div class="compare-title">Object-Oriented (ax.plot)</div><div class="compare-item">Explicit Figure and Axes objects</div><div class="compare-item">You always know which axes you are touching</div><div class="compare-item">Same code scales from 1 plot to 50</div><div class="compare-item">Plays well with subplots, gridspec</div><div class="compare-item">Self-documenting, easy to refactor</div><div class="compare-item">Use for: anything you will keep</div></div>
</div>

<div class="calc-highlight"><strong>The rule:</strong> use <code>fig, ax = plt.subplots()</code> for everything from now on. The two extra characters (<code>ax.</code>) save hours of debugging when your figures get more complex. The pyplot style is fine for a quick one-liner in IPython, but the OO style scales infinitely.</div>

<div class="l-warn"><strong>Common confusion:</strong> when you read tutorials online, you will see both styles freely mixed -- e.g. <code>fig, ax = plt.subplots()</code> followed by <code>plt.title("...")</code>. This works because <code>plt.title</code> targets the "current" axes, which is the one most recently created. It is also a recipe for bugs in multi-subplot code. Stick with <code>ax.set_title("...")</code>.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Your First Real Plot: plt.subplots()</h2>

<p class="l-text">The single most important pattern in Matplotlib is one line:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Generate data: a simple parabola plus noise</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">60</span>)
y_true = x ** <span class="num">2</span>
y_obs  = y_true + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.8</span>, size=x.size)

<span class="cm"># THE PATTERN: figure + axes in one go</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

<span class="cm"># Draw two layers on the same axes</span>
ax.<span class="fn">plot</span>(x, y_true, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2.5</span>, label=<span class="str">"true: y = x^2"</span>)
ax.<span class="fn">scatter</span>(x, y_obs, s=<span class="num">22</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.8</span>, label=<span class="str">"observed"</span>)

<span class="cm"># Cosmetics</span>
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Observations around the true curve y = x^2"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper center"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># Display (or save)</span>
plt.<span class="fn">show</span>()
<span class="cm"># fig.savefig("parabola.png", dpi=150, bbox_inches="tight")</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports the canonical pair: <code>matplotlib.pyplot</code> as <code>plt</code> and <code>numpy</code> as <code>np</code>. 2) Builds a clean parabola <code>y_true = x^2</code> over 60 points and adds Gaussian noise to get <code>y_obs</code> -- a typical "true signal + noise" toy dataset. 3) <code>fig, ax = plt.subplots(figsize=(8, 5))</code> creates a Figure of size 8x5 inches and one Axes inside it; <code>fig</code> and <code>ax</code> are now the two handles you will use. 4) <code>ax.plot</code> draws the smooth curve in gold; <code>ax.scatter</code> overlays noisy points in teal. Both calls target the same Axes, so they share the same x and y scale. 5) <code>set_xlabel</code>, <code>set_ylabel</code>, <code>set_title</code> annotate the plot. 6) <code>legend</code> uses the <code>label=</code> values from <code>plot</code> and <code>scatter</code> to render a legend in the upper centre. 7) <code>grid(True, alpha=0.3)</code> draws faint reference lines. 8) <code>plt.show</code> displays the figure; <code>fig.savefig</code> would write it to a file with chosen DPI and tight bounding box.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">plt.subplots()</div><div class="card-body">Returns <code>(fig, ax)</code>. Default is one figure with one axes. <code>plt.subplots(2, 3)</code> gives 6 axes in a grid.</div></div>
<div class="calc-card"><div class="card-title">figsize=(w, h)</div><div class="card-body">Width and height in inches. Default is (6.4, 4.8). For a thesis, use (8, 5) or (10, 6).</div></div>
<div class="calc-card"><div class="card-title">ax.plot</div><div class="card-body">Draws lines (and optionally markers). One call = one line. Multiple calls stack onto the same axes.</div></div>
<div class="calc-card"><div class="card-title">ax.scatter</div><div class="card-body">Draws unconnected markers. Use when each point is independent (no temporal or sequential link).</div></div>
<div class="calc-card"><div class="card-title">ax.set_xlabel / set_ylabel / set_title</div><div class="card-body">The three text annotations every plot needs. Skipping them is the #1 way to make your plots unreadable in 6 months.</div></div>
<div class="calc-card"><div class="card-title">ax.legend()</div><div class="card-body">Reads the <code>label=</code> kwargs from previous draw calls and renders a legend. <code>loc=</code> controls position; <code>"best"</code> auto-picks.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: building intuition</div><div class="example-body">Reading the code top-to-bottom mirrors how the figure is built: open canvas (<code>fig, ax</code>), drop layers (<code>plot</code>, <code>scatter</code>), label them (<code>set_xlabel</code>, etc.), and finally finish (<code>show</code> or <code>savefig</code>). Internalise this rhythm and 90% of Matplotlib code will read like English.</div></div>

<div id="plot-mpl-l1-firstplot-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A Plotly mirror of the Matplotlib code above. The smooth gold curve is the true signal y = x^2; the teal markers are noisy observations. This is the canonical first plot of any modelling task: plot the truth, plot the data, eyeball the noise level. In ML this is what you do <em>before</em> picking a model -- you look.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Backends: Where the Pixels End Up</h2>

<p class="l-text">A <strong>backend</strong> is the rendering engine that turns Matplotlib's abstract drawing commands into real pixels (or vector ink). The same code runs on every backend; only the destination changes. You usually never touch this -- but knowing it exists explains why <code>plt.show()</code> "just works" in Jupyter and "blocks" in a script.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">inline (Jupyter default)</div><div class="card-body">Renders a static PNG into the notebook output. No interactivity. Fast and reliable. Activated by <code>%matplotlib inline</code>.</div></div>
<div class="calc-card"><div class="card-title">notebook / widget</div><div class="card-body">Renders an interactive (zoom, pan) widget in the notebook. Heavier but useful for exploration. <code>%matplotlib widget</code> in JupyterLab.</div></div>
<div class="calc-card"><div class="card-title">qt / tk</div><div class="card-body">Opens a separate desktop window with full mouse interactivity. Used when you run a Python script from the terminal.</div></div>
<div class="calc-card"><div class="card-title">agg (headless)</div><div class="card-body">Anti-Grain Geometry. Pure CPU rasteriser, no GUI. Used on servers and CI where there is no screen. <code>matplotlib.use("agg")</code>.</div></div>
<div class="calc-card"><div class="card-title">pdf / svg</div><div class="card-body">Vector backends. <code>fig.savefig("plot.pdf")</code> auto-uses pdf. Crisp at any zoom. Required for thesis figures.</div></div>
<div class="calc-card"><div class="card-title">Switching</div><div class="card-body">Set with <code>matplotlib.use("agg")</code> BEFORE importing pyplot, or via <code>%matplotlib qt</code> in IPython. Order matters.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib

<span class="cm"># Inspect the active backend</span>
<span class="fn">print</span>(matplotlib.<span class="fn">get_backend</span>())   <span class="cm"># e.g. 'module://matplotlib_inline.backend_inline'</span>

<span class="cm"># Force a non-interactive backend before importing pyplot (servers, CI, scripts)</span>
matplotlib.<span class="fn">use</span>(<span class="str">"agg"</span>)
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

fig, ax = plt.<span class="fn">subplots</span>()
ax.<span class="fn">plot</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>], [<span class="num">0</span>, <span class="num">1</span>, <span class="num">4</span>])
fig.<span class="fn">savefig</span>(<span class="str">"out.png"</span>, dpi=<span class="num">150</span>)   <span class="cm"># writes a file, no window opens</span>
<span class="cm"># plt.show()  -- silently does nothing on agg, which is exactly what we want</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>matplotlib.get_backend()</code> returns the currently active rendering target as a string. In Jupyter you usually see something like <code>module://matplotlib_inline.backend_inline</code>. 2) <code>matplotlib.use("agg")</code> switches to the headless raster backend; this MUST happen before <code>import matplotlib.pyplot as plt</code> because pyplot caches the backend at import time. 3) After import we draw a tiny three-point plot. 4) <code>fig.savefig("out.png", dpi=150)</code> serialises the figure to a 150-DPI PNG -- this is the only way to get output on a headless backend. 5) <code>plt.show()</code> would normally pop up a window; on the agg backend it is a no-op, which is exactly the desired behaviour on servers without a display.</p>

<div class="l-note"><strong>Practical advice:</strong> in Jupyter, never call <code>matplotlib.use(...)</code> -- the notebook frontend has already configured the backend correctly. Just import pyplot and start plotting. Worry about backends only when you deploy code to a server or write a CLI tool.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Mental Model: Open, Draw, Finish</h2>

<p class="l-text">If you remember nothing else from this lesson, remember the three-step rhythm. Every Matplotlib script you ever write follows it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Open the canvas</div><div class="card-body"><code>fig, ax = plt.subplots(figsize=(w, h))</code>. You now have a Figure and one Axes to draw on.</div></div>
<div class="calc-card"><div class="card-title">2. Draw layers</div><div class="card-body">Repeat as many times as needed: <code>ax.plot(...)</code>, <code>ax.scatter(...)</code>, <code>ax.bar(...)</code>, <code>ax.fill_between(...)</code>. Each call adds one more visual layer on top of the previous.</div></div>
<div class="calc-card"><div class="card-title">3. Finish</div><div class="card-body">Annotate (<code>set_xlabel</code>, <code>set_title</code>, <code>legend</code>), then either <code>plt.show()</code> (display) or <code>fig.savefig(path)</code> (export).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># ----- 1. Data -----</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
epochs = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">21</span>)
train_loss = <span class="num">0.9</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">6</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">20</span>)
val_loss   = <span class="num">0.9</span> * np.<span class="fn">exp</span>(-epochs / <span class="num">6</span>) + <span class="num">0.05</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.04</span>, <span class="num">20</span>)

<span class="cm"># ----- 2. Open the canvas -----</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

<span class="cm"># ----- 3. Draw layers -----</span>
ax.<span class="fn">plot</span>(epochs, train_loss, marker=<span class="str">"o"</span>, label=<span class="str">"train"</span>,
        color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">plot</span>(epochs, val_loss,   marker=<span class="str">"s"</span>, label=<span class="str">"val"</span>,
        color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">fill_between</span>(epochs, train_loss, val_loss,
                color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.08</span>)   <span class="cm"># the gap between the two</span>

<span class="cm"># ----- 4. Finish -----</span>
ax.<span class="fn">set_xlabel</span>(<span class="str">"epoch"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"cross-entropy loss"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Training vs validation loss (toy run)"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

plt.<span class="fn">show</span>()
<span class="cm"># fig.savefig("training_curves.pdf", bbox_inches="tight")</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates 20 epochs of fake training data: an exponentially decaying loss with small noise for train, plus a constant offset and bigger noise for val (so val never quite catches up to train -- a textbook small-overfit). 2) <code>plt.subplots(figsize=(8, 5))</code> opens an 8x5 inch canvas with one Axes. 3) Two <code>ax.plot</code> calls draw the train and val curves with their own colour, marker, and label. 4) <code>ax.fill_between</code> shades the area between the two curves with low alpha; this is the "generalisation gap" visualised -- it grows when the model overfits. 5) Standard finishing touches set the axis labels, title, legend, and a faint grid. 6) <code>plt.show</code> displays the figure interactively; <code>fig.savefig("training_curves.pdf", bbox_inches="tight")</code> would persist it as a vector PDF for inclusion in a thesis or paper.</p>

<div id="plot-mpl-l1-rhythm-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A faithful Plotly mirror of the Matplotlib code: train (teal) and val (gold) loss curves with the gap between them shaded. This is the single most-plotted figure in deep learning, and it follows the canonical rhythm of <em>open canvas, draw layers, finish</em>. Once you can produce this in your sleep, almost every other plot is a small variation: replace the two curves with histograms, add a second subplot for accuracy, swap the y-axis to log -- the skeleton stays identical.</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does <code>fig.savefig</code> belong to <code>fig</code> and not to <code>ax</code>? Because saving is a Figure-level operation -- you serialise the entire canvas (which may contain many Axes) into one file. Adding data, on the other hand, is an Axes-level operation -- you draw <em>onto</em> a specific subplot. Once you internalise "Figure = file, Axes = drawing", you stop confusing which method belongs where.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Anatomy in One Picture</h2>

<p class="l-text">Let us label every part of a real Matplotlib figure so the vocabulary becomes muscle memory. Below is one figure with one axes, and every component named.</p>

<div id="plot-mpl-l1-labelled-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this diagram shows:</strong> A labelled anatomy of a Matplotlib figure. The outer frame is the <em>Figure</em>. The inner plotting area (with grid lines) is the <em>Axes</em>. The horizontal number line at the bottom and the vertical number line on the left are the two <em>Axis</em> objects belonging to that Axes. The text above is the <em>title</em>; the words "x" and "f(x)" are the <em>axis labels</em>; the small ticks and numbers (1, 2, 3, ...) are <em>major ticks</em> and <em>tick labels</em>. The yellow line is one <em>Line2D</em> Artist; the box at the top right is the <em>legend</em>. Every one of these elements is a Python object you can fetch and modify after creation.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spines</div><div class="card-body">The four borders of the Axes. Often hidden (<code>ax.spines["top"].set_visible(False)</code>) for a cleaner look.</div></div>
<div class="calc-card"><div class="card-title">Major / minor ticks</div><div class="card-body">Major ticks have labels (1, 2, 3); minor ticks are smaller and unlabelled. Set with <code>ax.set_xticks</code>, <code>ax.minorticks_on()</code>.</div></div>
<div class="calc-card"><div class="card-title">Tick labels</div><div class="card-body">The text under (or beside) each tick. Customise with <code>ax.set_xticklabels(["a","b"])</code> or <code>FuncFormatter</code>.</div></div>
<div class="calc-card"><div class="card-title">Grid</div><div class="card-body">Faint lines extending from each tick across the plotting area. <code>ax.grid(True, alpha=0.3)</code> is the standard look.</div></div>
<div class="calc-card"><div class="card-title">Title and labels</div><div class="card-body">Three text artists: <code>ax.set_title</code>, <code>ax.set_xlabel</code>, <code>ax.set_ylabel</code>. Always present in a publication-quality figure.</div></div>
<div class="calc-card"><div class="card-title">Legend</div><div class="card-body">Auto-generated from <code>label=</code> kwargs. <code>ax.legend(loc="best")</code> picks the spot with least overlap.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: grabbing components later</div><div class="example-body">Because every visible element is an Artist, you can modify it after creating it. <code>(line,) = ax.plot(x, y)</code> -- now <code>line</code> is a <code>Line2D</code> object. <code>line.set_color("red")</code> updates it on the next redraw. <code>ax.spines["top"].set_visible(False)</code> hides the top border. This is what makes Matplotlib infinitely customisable.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Mini Cheatsheet & Wrap-up</h2>

<p class="l-text">A condensed reference you can keep open while learning the rest of the course.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Demo data for second plot</span>
x2 = np.linspace(0, 10, 50)
y2 = np.cos(x2)

<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Open the canvas</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

<span class="cm"># 2) Draw layers</span>
ax.<span class="fn">plot</span>(x, y, label=<span class="str">"series A"</span>)
ax.<span class="fn">scatter</span>(x2, y2, label=<span class="str">"series B"</span>)

<span class="cm"># 3) Annotate</span>
ax.<span class="fn">set_xlabel</span>(<span class="str">"..."</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"..."</span>)
ax.<span class="fn">set_title</span>(<span class="str">"..."</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"best"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># 4) Finish</span>
plt.<span class="fn">show</span>()                            <span class="cm"># display</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.pdf"</span>,               <span class="cm"># OR persist</span>
            dpi=<span class="num">150</span>, bbox_inches=<span class="str">"tight"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The single <code>fig, ax = plt.subplots(figsize=(...))</code> opens a Figure with one Axes. 2) Any number of <code>ax.plot</code>, <code>ax.scatter</code>, <code>ax.bar</code>, etc. calls layer data on top. 3) Annotation methods give the axes meaning -- skip these and your plot will be undecipherable to your future self. 4) <code>plt.show()</code> renders the figure to whatever backend is active; <code>fig.savefig</code> writes it to disk. The <code>bbox_inches="tight"</code> flag trims the white margins, which is essential for thesis figures that get embedded in LaTeX.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> A <em>Figure</em> is the canvas; an <em>Axes</em> is one plot on that canvas; an <em>Axis</em> is one of the two number lines on that plot. Memorise these three words.<br><strong>2.</strong> Use <code>fig, ax = plt.subplots()</code> for everything from now on. Two extra characters, infinite scalability.<br><strong>3.</strong> The OO API (<code>ax.plot</code>, <code>ax.set_title</code>) beats the pyplot API for any plot you intend to keep.<br><strong>4.</strong> The rhythm is always: <em>open canvas, draw layers, finish</em>. Every plot in the rest of this course follows it.<br><strong>5.</strong> Backends are the rendering engines. Inline in Jupyter, agg on servers. You rarely change them by hand.<br><strong>6.</strong> Every visible element is an <em>Artist</em>, which means you can fetch and modify it later. This is the source of Matplotlib's infinite flexibility.<br><strong>7.</strong> <code>fig.savefig(..., dpi=150, bbox_inches="tight")</code> exports a publication-ready file. PDF/SVG for vector, PNG for raster.<br><strong>8.</strong> If your figure looks bad, do not blame Matplotlib -- the defaults are deliberately neutral. Lesson 5 will show you how to style it like a thesis.</div></div>
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

  // 1. Anatomy diagram (figure containing axes containing axis)
  function anatomy(id){
    var el = document.getElementById(id); if(!el) return;
    var shapes = [
      {type:'rect', xref:'paper', yref:'paper', x0:0, y0:0, x1:1, y1:1, line:{color:T.accent, width:3, dash:'solid'}, fillcolor:'rgba(200,169,110,0.04)'},
      {type:'rect', xref:'paper', yref:'paper', x0:0.18, y0:0.20, x1:0.92, y1:0.85, line:{color:'#4ecdc4', width:2}, fillcolor:'rgba(78,205,196,0.06)'}
    ];
    var ann = [
      {xref:'paper',yref:'paper',x:0.02,y:0.97,text:'<b>Figure</b> (the canvas)',showarrow:false,font:{color:T.accent,size:14},xanchor:'left'},
      {xref:'paper',yref:'paper',x:0.55,y:0.78,text:'<b>Axes</b> (one plot)',showarrow:false,font:{color:'#4ecdc4',size:13}},
      {xref:'paper',yref:'paper',x:0.55,y:0.16,text:'X <b>Axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:0,ay:-30,font:{color:T.text,size:12}},
      {xref:'paper',yref:'paper',x:0.14,y:0.52,text:'Y <b>Axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:30,ay:0,font:{color:T.text,size:12}}
    ];
    var trace = {x:[1,2,3,4,5],y:[1,4,2,5,3],mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2.5},marker:{color:T.accent,size:7},xaxis:'x2',yaxis:'y2',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Figure / Axes / Axis hierarchy',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[0,1]}, yaxis:{visible:false,range:[0,1]},
      xaxis2:{domain:[0.18,0.92],anchor:'y2',gridcolor:T.grid,zerolinecolor:T.zero,title:{text:'x',font:{color:T.text,size:11}}},
      yaxis2:{domain:[0.20,0.85],anchor:'x2',gridcolor:T.grid,zerolinecolor:T.zero,title:{text:'f(x)',font:{color:T.text,size:11}}},
      shapes:shapes, annotations:ann, height:420, showlegend:false
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  anatomy('plot-mpl-l1-anatomy-en');
  anatomy('plot-mpl-l1-anatomy-tr');

  // 2. First plot: parabola + noise
  function firstplot(id, title, xl, yl, lblTrue, lblObs){
    var el = document.getElementById(id); if(!el) return;
    var x=[], yt=[], yo=[]; var seed=0;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=0;i<60;i++){var xi=-3+6*i/59;x.push(xi);yt.push(xi*xi);yo.push(xi*xi+rnd()*1.6);}
    var t1 = {x:x,y:yt,mode:'lines',type:'scatter',line:{color:T.accent,width:2.5},name:lblTrue};
    var t2 = {x:x,y:yo,mode:'markers',type:'scatter',marker:{color:'#4ecdc4',size:7,opacity:0.8},name:lblObs};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  firstplot('plot-mpl-l1-firstplot-en','Observations around the true curve y = x^2','x','y','true: y = x^2','observed');
  firstplot('plot-mpl-l1-firstplot-tr','Gercek y = x^2 egrisi etrafindaki gozlemler','x','y','gercek: y = x^2','gozlem');

  // 3. Training curves rhythm demo
  function rhythm(id, title, xl, yl, lblT, lblV){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], tr=[], va=[]; var seed=7;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=1;i<=20;i++){ep.push(i);var d=0.9*Math.exp(-i/6);tr.push(d+rnd()*0.04);va.push(d+0.05+rnd()*0.08);}
    var fill = {x:ep.concat(ep.slice().reverse()),y:tr.concat(va.slice().reverse()),fill:'toself',fillcolor:'rgba(200,169,110,0.10)',line:{color:'rgba(0,0,0,0)'},type:'scatter',name:'gap',hoverinfo:'skip',showlegend:false};
    var t1 = {x:ep,y:tr,mode:'lines+markers',type:'scatter',line:{color:'#4ecdc4',width:2},marker:{color:'#4ecdc4',size:7},name:lblT};
    var t2 = {x:ep,y:va,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:7,symbol:'square'},name:lblV};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[fill,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  rhythm('plot-mpl-l1-rhythm-en','Training vs validation loss (toy run)','epoch','cross-entropy loss','train','val');
  rhythm('plot-mpl-l1-rhythm-tr','Egitim vs dogrulama kaybi (oyuncak kosu)','epok','capraz entropi kaybi','egitim','dogrulama');

  // 4. Labelled anatomy (with title, legend, ticks)
  function labelled(id, title, xl, yl, legendName){
    var el = document.getElementById(id); if(!el) return;
    var x=[]; var y=[];
    for (var i=0;i<=10;i++){x.push(i);y.push(Math.sin(i*0.6)*2+3);}
    var t1 = {x:x,y:y,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2.5},marker:{color:T.accent,size:7},name:legendName};
    var ann = [
      {x:5,y:5.0,text:'<b>title</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:0,ay:-40,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:9.2,y:4.5,text:'<b>legend</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:-30,ay:-20,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:5,y:0.6,text:'<b>x axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:0,ay:30,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:0.5,y:3,text:'<b>y axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:-40,ay:0,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:7,y:3.5,text:'<b>Line2D Artist</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:30,ay:30,font:{color:T.text,size:11},xref:'x',yref:'y'}
    ];
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}},annotations:ann});
    Plotly.newPlot(id,[t1],layout,{responsive:true,displayModeBar:false});
  }
  labelled('plot-mpl-l1-labelled-en','A labelled Matplotlib figure','x','f(x)','f(x) = 2 sin(0.6 x) + 3');
  labelled('plot-mpl-l1-labelled-tr','Etiketli bir Matplotlib figuru','x','f(x)','f(x) = 2 sin(0.6 x) + 3');
},250);</script>`,

tr: `<p class="l-text"><strong>Matplotlib, Python'da bilimsel çizimin temel taşıdır.</strong> NumPy size dizileri verir, Pandas tabloları, scikit-learn modelleri verir -- ve Matplotlib aslında <em>ne olduğunu görmenizi</em> sağlayan kütüphanedir. Duyduğunuz neredeyse her diğer çizim kütüphanesi (Seaborn, Pandas <code>.plot()</code>, plotnine, hatta Plotly'nin bazı varsayılanları) Matplotlib'in üzerine kurulmuş, ondan ilham almış veya onu genişletmek için tasarlanmıştır.</p>

<p class="l-text">Bu derste elli çeşit grafik çizmeyeceğiz. Bunun yerine sağlam bir <strong>zihinsel model</strong> oluşturacağız: bir figürün gerçekte <em>ne olduğu</em>, eğitimlerde sürekli gördüğünüz iki API arasındaki fark ve kariyerinizin geri kalanında kullanacağınız standart kalıp (<code>fig, ax = plt.subplots()</code>). Bu sağlam olduğunda, diğer her Matplotlib özelliği bariz hale gelir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>pyplot state-machine API'sini nesne yönelimli Figure/Axes API'sinden ayır</li><li>Kanonik fig, ax = plt.subplots() deseniyle her grafiği inşa et</li><li>Bir Axes üzerinde başlık, eksen etiketi, legend ve ızgarayı özelleştir</li><li>Figürleri yayın kalitesinde DPI ile PNG, SVG ve PDF olarak kaydet</li><li>Bir grafiğin Jupyter'da veya scriptte neden render olmadığını teşhis et</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Matplotlib? Giriş</h2>

<p class="l-text">Henüz 50.000 film yorumu üzerinde bir duygu sınıflandırıcısı eğittiğinizi düşünün. Doğrulama doğruluğunuz 0.84. Bu iyi mi? Kötü mü? Model aşırı öğreniyor mu? Bazı sınıflar sistematik olarak daha mı zor? Eğitim erken mi platoya ulaştı yoksa hâlâ iyileşiyor muydu? Bu soruların hiçbirini tek bir sayıdan yanıtlayamazsınız -- resimlere ihtiyacınız var.</p>

<div class="calc-highlight"><strong>Çizim süslemenin değil, <em>düşünmenin</em> bir parçasıdır.</strong> Bir kayıp eğrisi ne zaman duracağınızı söyler. Bir karışıklık matrisi hangi sınıfın hangisiyle karıştırıldığını söyler. Bir artık (residual) grafiği modelin yanlı olduğunu söyler. Her ciddi ML uygulayıcısı zamanının üçte birini koda değil, grafiklere bakarak geçirir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Statik ve hassas</div><div class="card-body">Matplotlib piksel kusursuz, yayına hazır figürler üretir. PDF, SVG, PNG -- her noktayı kontrol edersiniz. Makaleler ve tezler bu yüzden onu kullanır.</div></div>
<div class="calc-card"><div class="card-title">Evrensel</div><div class="card-body">Pandas, scikit-learn, statsmodels, seaborn, NetworkX -- hepsi Matplotlib axes nesneleri döndürür. Matplotlib bilmek hepsini açar.</div></div>
<div class="calc-card"><div class="card-title">İki API</div><div class="card-body">Hızlı bir "MATLAB tarzı" pyplot API'si ve daha güçlü bir nesne yönelimli API. İkisini de öğreneceğiz ama ağırlık nesne yönelimli olanda.</div></div>
<div class="calc-card"><div class="card-title">Kompoze edilebilir</div><div class="card-body">Çoklu alt grafikler, ikiz eksenler, yakınlaştırma kutuları, özel notlar -- her öğe bir nesne olduğu için kesinlikle her şeyi kurabilirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Backend'ler</div><div class="card-body">Aynı kod Jupyter'de, bir betikte, bir PyQt penceresinde veya bir sunucuda başsız PNG dosyasına render olur. Çizim motoru değiştirilebilir.</div></div>
<div class="calc-card"><div class="card-title">Varsayılan</div><div class="card-body">Herhangi bir kıdemli veri bilimcisine "X'i nasıl çizerim" diye sorduğunuzda, ilk yanıtları Matplotlib'e atıfta bulunur. Python çiziminin ortak dilidir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Tipik bir NLP iş akışı</div><div class="example-body">Bir BERT duygu modelini eğitmeyi bitirdiniz. Şunları çizersiniz: (1) aşırı öğrenmeyi tespit etmek için eğitim ve doğrulama kayıp eğrileri, (2) hangi sınıfların birbirini karıştırdığını görmek için karışıklık matrisi ısı haritası, (3) sınıf başına ROC eğrileri, (4) birkaç örnek cümle için dikkat ısı haritaları, (5) tahmin edilen etikete göre renklendirilmiş t-SNE gömme grafiği. Beş farklı grafik, hepsi Matplotlib, hepsi tek defterde. Bu kursun sonunda her birini on satırın altında yazacaksınız.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Eğitimden önce "veriye bakmak" neden çoğu zaman çalışan bir model ile bozuk bir model arasındaki farktır? Çünkü sayılar dağılımları hakkında yalan söyler. Ortalaması 5, standart sapması 2 olan bir sütun temiz görünür -- ama çizdiğinizde modelinizin tüm varsayımlarını bozan kalın bir kuyruk veya iki tepeli bir karışım keşfedebilirsiniz. Çizim, verinizin gerçek şeklini sizinle yüzleştirir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bir Figürün Anatomisi: Figure, Axes, Axis</h2>

<p class="l-text">Herhangi bir koddan önce, kafanızda üç kelime net olmalı: <strong>Figure</strong>, <strong>Axes</strong>, <strong>Axis</strong>. Yeni kullanıcılar bunları sürekli karıştırır çünkü kulağa benzer gelir. Aslında değiller.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Figure</div><div class="card-body">Tüm pencere veya sayfa. Dış tuval. Bir Figure birçok grafik içerebilir. Bir figürü kaydetmek tüm tuvali tek bir görüntü olarak kaydetmektir.</div></div>
<div class="calc-card"><div class="card-title">Axes</div><div class="card-body">Figür içindeki tek bir grafik (bir "subplot"). Kendi x ekseni, y ekseni, başlığı, verisi, açıklaması vardır. 4 alt grafiği olan bir figürde 1 Figure ve 4 Axes nesnesi olur. Çoğul bir kelime ama bir Axes nesnesi = bir grafik.</div></div>
<div class="calc-card"><div class="card-title">Axis</div><div class="card-body">Tek bir sayı doğrusu: bir Axes'in x ekseni veya y ekseni. Axis nesnelerine neredeyse hiç doğrudan dokunmazsınız -- Axes metotları olan <code>ax.set_xlabel</code>, <code>ax.set_xticks</code> kullanırsınız.</div></div>
<div class="calc-card"><div class="card-title">Artist</div><div class="card-body">Görünen her şey (bir çizgi, bir tik etiketi, açıklama kutusu, bir metin notu) bir Artist'tir. Figure ve Axes, Artist konteynerleridir. Bu yüzden herhangi bir öğeyi sonradan tutup değiştirebilirsiniz.</div></div>
</div>

<div id="plot-mpl-l1-anatomy-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu diyagram neyi gösteriyor:</strong> Matplotlib hiyerarşisi. En dıştaki bej dikdörtgen <em>Figure</em>'dür. İçindeki daha küçük dikdörtgen tek bir <em>Axes</em>'tir -- verisi, x ekseni, y ekseni ve başlığı olan asıl çizim alanı. Alttaki ve soldaki iki renkli sayı doğrusu iki <em>Axis</em> nesnesidir. Önemlisi: Axes'ten her şeyi istersiniz ("bana bir çizgi çiz", "başlığı ayarla"); Axes ise sizin adınıza Axis çocuklarıyla ve Figure ile konuşur.</div>

<div class="calc-highlight"><strong>Zihinsel model:</strong> Bir Figure bir kâğıt parçasıdır. Bir Axes o kâğıda çizilmiş bir grafiktir. Bir Axis o grafiği çevreleyen iki sayı doğrusundan biridir. Bir figür birçok axes tutabilir; her axes tam olarak iki axis'e sahiptir (x ve y) -- 3B grafikler için üç.</div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">2x2'lik bir alt grafik ızgarası, dört <strong>Axes</strong> nesnesi içeren tek bir <strong>Figure</strong> nesnesidir. Bu dört Axes nesnesinin her biri iki <strong>Axis</strong> nesnesine sahiptir (x ve y). Yani 2x2 ızgarada sayım: 1 Figure, 4 Axes, 8 Axis nesnesi. Bunu içselleştirdiğinizde API rastgele görünmeyi bırakır.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. İki API: pyplot vs Nesne Yönelimli</h2>

<p class="l-text">Matplotlib aynı grafiği çizmenin iki yolunu sunar. Kodda farklı görünürler ama aynı pikselleri üretirler. İkisini de bilmek -- ve özellikle ne zaman nesne yönelimli olanı tercih edeceğinizi bilmek -- başlangıç seviyesini orta seviyeden ayırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">2</span> * np.pi, <span class="num">200</span>)
y = np.<span class="fn">sin</span>(x)

<span class="cm"># ---------- Stil A: pyplot (MATLAB tarzi) ----------</span>
plt.<span class="fn">figure</span>(figsize=(<span class="num">7</span>, <span class="num">4</span>))
plt.<span class="fn">plot</span>(x, y)
plt.<span class="fn">xlabel</span>(<span class="str">"x"</span>)
plt.<span class="fn">ylabel</span>(<span class="str">"sin(x)"</span>)
plt.<span class="fn">title</span>(<span class="str">"pyplot stili"</span>)
plt.<span class="fn">show</span>()

<span class="cm"># ---------- Stil B: nesne yonelimli (onerilen) ----------</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">7</span>, <span class="num">4</span>))
ax.<span class="fn">plot</span>(x, y)
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"sin(x)"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"nesne yonelimli stil"</span>)
plt.<span class="fn">show</span>()</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>matplotlib.pyplot</code>'ı <code>plt</code> olarak içe aktarır -- bu alt modül, kullanıcıya dönük kolaylık katmanıdır. 2) 0'dan 2π'ye 200 eşit aralıklı x değeri oluşturur ve sin(x)'i hesaplar. 3) Stil A modül seviyesi fonksiyonları kullanır: <code>plt.figure()</code> bir figür oluşturur, sonra <code>plt.plot()</code>, <code>plt.xlabel()</code>, <code>plt.title()</code> hangisi "geçerli" figürse onun üzerinde çalışır. 4) Stil B <code>plt.subplots()</code> ile hem Figure'ü hem Axes'i açıkça oluşturur, sonra metotları doğrudan <code>ax</code> nesnesi üzerinde çağırır. 5) <code>plt.show()</code> figürü render eder (bir betikte) veya tamamlar (Jupyter'de).</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">pyplot API (plt.plot)</div><div class="compare-item">MATLAB sözdizimini taklit eder</div><div class="compare-item">Örtük "geçerli" figure ve axes</div><div class="compare-item">Tek seferlik grafikler için kısa ve hızlı</div><div class="compare-item">Çok alt grafikli figürlerde dağılır</div><div class="compare-item">Uzun defterlerde hata ayıklaması zor</div><div class="compare-item">Kullanım: tek kullanımlık keşif</div></div>
<div class="compare-col"><div class="compare-title">Nesne Yönelimli (ax.plot)</div><div class="compare-item">Açık Figure ve Axes nesneleri</div><div class="compare-item">Hangi axes'e dokunduğunuzu her zaman bilirsiniz</div><div class="compare-item">Aynı kod 1 grafikten 50'ye ölçeklenir</div><div class="compare-item">Subplot, gridspec ile iyi çalışır</div><div class="compare-item">Kendini açıklayan, refactor'u kolay</div><div class="compare-item">Kullanım: saklayacağınız her şey</div></div>
</div>

<div class="calc-highlight"><strong>Kural:</strong> bundan sonra her şey için <code>fig, ax = plt.subplots()</code> kullanın. İki ekstra karakter (<code>ax.</code>) figürleriniz karmaşıklaştığında saatlerce hata ayıklama tasarrufu sağlar. Pyplot stili IPython'da hızlı tek satırlık kod için iyidir, ama nesne yönelimli stil sonsuza kadar ölçeklenir.</div>

<div class="l-warn"><strong>Yaygın karışıklık:</strong> internetteki eğitimleri okuduğunuzda iki stilin de serbestçe karıştığını göreceksiniz -- ör. <code>fig, ax = plt.subplots()</code> ardından <code>plt.title("...")</code>. Bu çalışır çünkü <code>plt.title</code> "geçerli" axes'i hedefler, ki o da en son oluşturulan olur. Aynı zamanda çok alt grafikli kodda hata reçetesidir. <code>ax.set_title("...")</code>'a sadık kalın.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İlk Gerçek Grafiğiniz: plt.subplots()</h2>

<p class="l-text">Matplotlib'deki en önemli kalıp tek bir satırdır:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Veri uret: basit bir parabol arti gurultu</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
x = np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">60</span>)
y_true = x ** <span class="num">2</span>
y_obs  = y_true + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.8</span>, size=x.size)

<span class="cm"># KALIP: figure + axes tek satirda</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

<span class="cm"># Ayni axes uzerinde iki katman</span>
ax.<span class="fn">plot</span>(x, y_true, color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2.5</span>, label=<span class="str">"gercek: y = x^2"</span>)
ax.<span class="fn">scatter</span>(x, y_obs, s=<span class="num">22</span>, color=<span class="str">"#4ecdc4"</span>, alpha=<span class="num">0.8</span>, label=<span class="str">"gozlem"</span>)

<span class="cm"># Suslemeler</span>
ax.<span class="fn">set_xlabel</span>(<span class="str">"x"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"y"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Gercek y = x^2 egrisi etrafinda gozlemler"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper center"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># Goster (ya da kaydet)</span>
plt.<span class="fn">show</span>()
<span class="cm"># fig.savefig("parabol.png", dpi=150, bbox_inches="tight")</span></code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Standart ikiliyi içe aktarır: <code>matplotlib.pyplot</code> olarak <code>plt</code> ve <code>numpy</code> olarak <code>np</code>. 2) 60 nokta üzerinde temiz bir parabol <code>y_true = x^2</code> oluşturur ve Gauss gürültüsü ekleyerek <code>y_obs</code>'u elde eder -- tipik bir "gerçek sinyal + gürültü" oyuncak veri seti. 3) <code>fig, ax = plt.subplots(figsize=(8, 5))</code> 8x5 inçlik bir Figure ve içinde bir Axes oluşturur; <code>fig</code> ve <code>ax</code> artık kullanacağınız iki tutamaçtır. 4) <code>ax.plot</code> altın renkli düzgün eğriyi çizer; <code>ax.scatter</code> üzerine teal renkli gürültülü noktaları yerleştirir. Her iki çağrı da aynı Axes'i hedefler, dolayısıyla aynı x ve y ölçeğini paylaşırlar. 5) <code>set_xlabel</code>, <code>set_ylabel</code>, <code>set_title</code> grafiği etiketler. 6) <code>legend</code>, <code>plot</code> ve <code>scatter</code>'dan gelen <code>label=</code> değerlerini kullanarak üst ortaya bir açıklama yerleştirir. 7) <code>grid(True, alpha=0.3)</code> hafif referans çizgileri çizer. 8) <code>plt.show</code> figürü gösterir; <code>fig.savefig</code> ise seçilen DPI ve sıkı sınırlama kutusuyla bir dosyaya yazar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">plt.subplots()</div><div class="card-body"><code>(fig, ax)</code> döndürür. Varsayılan: bir figür, bir axes. <code>plt.subplots(2, 3)</code> ızgarada 6 axes verir.</div></div>
<div class="calc-card"><div class="card-title">figsize=(w, h)</div><div class="card-body">İnç cinsinden genişlik ve yükseklik. Varsayılan (6.4, 4.8). Tez için (8, 5) veya (10, 6) kullanın.</div></div>
<div class="calc-card"><div class="card-title">ax.plot</div><div class="card-body">Çizgi çizer (isteğe bağlı işaretçilerle). Bir çağrı = bir çizgi. Birden çok çağrı aynı axes üzerine yığılır.</div></div>
<div class="calc-card"><div class="card-title">ax.scatter</div><div class="card-body">Bağlantısız işaretçiler çizer. Her nokta bağımsız olduğunda kullanın (zamansal veya sıralı bağ yoksa).</div></div>
<div class="calc-card"><div class="card-title">ax.set_xlabel / set_ylabel / set_title</div><div class="card-body">Her grafiğin ihtiyaç duyduğu üç metin notu. Bunları atlamak grafiğinizi 6 ay içinde okunamaz hale getirmenin 1 numaralı yoludur.</div></div>
<div class="calc-card"><div class="card-title">ax.legend()</div><div class="card-body">Önceki çizim çağrılarındaki <code>label=</code> kwargs'ları okur ve bir açıklama oluşturur. <code>loc=</code> konumu kontrol eder; <code>"best"</code> otomatik seçer.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: sezgi geliştirmek</div><div class="example-body">Kodu yukarıdan aşağıya okumak figürün nasıl inşa edildiğini yansıtır: tuvali aç (<code>fig, ax</code>), katmanları bırak (<code>plot</code>, <code>scatter</code>), etiketle (<code>set_xlabel</code>, vb.) ve sonunda bitir (<code>show</code> veya <code>savefig</code>). Bu ritmi içselleştirin ve Matplotlib kodunun %90'ı İngilizce gibi okunacaktır.</div></div>

<div id="plot-mpl-l1-firstplot-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> Yukarıdaki Matplotlib kodunun bir Plotly aynası. Düzgün altın eğri gerçek sinyal y = x^2'dir; teal renkli işaretçiler ise gürültülü gözlemlerdir. Bu, herhangi bir modelleme görevinin standart ilk grafiğidir: gerçeği çiz, veriyi çiz, gürültü seviyesini gözle değerlendir. ML'de model seçmeden <em>önce</em> yapacağınız şey budur -- bakarsınız.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Backend'ler: Pikseller Nereye Gidiyor?</h2>

<p class="l-text">Bir <strong>backend</strong>, Matplotlib'in soyut çizim komutlarını gerçek piksellere (veya vektör mürekkebine) dönüştüren render motorudur. Aynı kod her backend'de çalışır; yalnızca hedef değişir. Buna genellikle hiç dokunmazsınız -- ama varlığını bilmek <code>plt.show()</code>'un Jupyter'de neden "öylece çalıştığını" ve bir betikte neden "blokladığını" açıklar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">inline (Jupyter varsayılan)</div><div class="card-body">Defter çıktısına statik bir PNG render eder. Etkileşim yok. Hızlı ve güvenilir. <code>%matplotlib inline</code> ile etkinleştirilir.</div></div>
<div class="calc-card"><div class="card-title">notebook / widget</div><div class="card-body">Defterde etkileşimli (yakınlaştırma, kaydırma) bir widget render eder. Daha ağır ama keşif için yararlı. JupyterLab'da <code>%matplotlib widget</code>.</div></div>
<div class="calc-card"><div class="card-title">qt / tk</div><div class="card-body">Tam fare etkileşimli ayrı bir masaüstü penceresi açar. Terminalden bir Python betiği çalıştırdığınızda kullanılır.</div></div>
<div class="calc-card"><div class="card-title">agg (başsız)</div><div class="card-body">Anti-Grain Geometry. Saf CPU rasterleştirici, GUI yok. Ekran olmayan sunucularda ve CI'da kullanılır. <code>matplotlib.use("agg")</code>.</div></div>
<div class="calc-card"><div class="card-title">pdf / svg</div><div class="card-body">Vektör backend'leri. <code>fig.savefig("plot.pdf")</code> otomatik olarak pdf kullanır. Her yakınlaştırmada keskin. Tez figürleri için zorunludur.</div></div>
<div class="calc-card"><div class="card-title">Değiştirme</div><div class="card-body">Pyplot'u içe aktarmadan ÖNCE <code>matplotlib.use("agg")</code> ile veya IPython'da <code>%matplotlib qt</code> ile ayarlayın. Sıra önemlidir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib

<span class="cm"># Aktif backend'i incele</span>
<span class="fn">print</span>(matplotlib.<span class="fn">get_backend</span>())   <span class="cm"># or: 'module://matplotlib_inline.backend_inline'</span>

<span class="cm"># Pyplot'u ice aktarmadan once etkilesimsiz backend'e zorla</span>
matplotlib.<span class="fn">use</span>(<span class="str">"agg"</span>)
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

fig, ax = plt.<span class="fn">subplots</span>()
ax.<span class="fn">plot</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>], [<span class="num">0</span>, <span class="num">1</span>, <span class="num">4</span>])
fig.<span class="fn">savefig</span>(<span class="str">"out.png"</span>, dpi=<span class="num">150</span>)   <span class="cm"># dosya yazar, pencere acmaz</span>
<span class="cm"># plt.show()  -- agg'de sessizce hicbir sey yapmaz, tam istedigimiz</span></code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>matplotlib.get_backend()</code> şu anda aktif olan render hedefini string olarak döndürür. Jupyter'de genellikle <code>module://matplotlib_inline.backend_inline</code> gibi bir şey görürsünüz. 2) <code>matplotlib.use("agg")</code> başsız raster backend'ine geçer; bu MUTLAKA <code>import matplotlib.pyplot as plt</code> öncesinde olmalı çünkü pyplot backend'i içe aktarma anında önbelleğe alır. 3) İçe aktardıktan sonra üç noktalı küçük bir grafik çizeriz. 4) <code>fig.savefig("out.png", dpi=150)</code> figürü 150 DPI bir PNG'ye serileştirir -- başsız bir backend'de çıktı almanın tek yolu budur. 5) <code>plt.show()</code> normalde bir pencere açardı; agg backend'inde hiçbir şey yapmaz, ki ekransız sunucularda istediğimiz tam olarak budur.</p>

<div class="l-note"><strong>Pratik tavsiye:</strong> Jupyter'de hiçbir zaman <code>matplotlib.use(...)</code> çağırmayın -- defter ön ucu backend'i zaten doğru ayarlamıştır. Sadece pyplot'u içe aktarın ve çizmeye başlayın. Backend'ler hakkında yalnızca kodu bir sunucuya dağıttığınızda veya bir CLI aracı yazdığınızda endişelenin.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Zihinsel Model: Aç, Çiz, Bitir</h2>

<p class="l-text">Bu dersten başka hiçbir şey hatırlamasanız bile, üç adımlı ritmi hatırlayın. Yazacağınız her Matplotlib betiği bunu izler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Tuvali aç</div><div class="card-body"><code>fig, ax = plt.subplots(figsize=(w, h))</code>. Şimdi çizmek için bir Figure ve bir Axes'iniz var.</div></div>
<div class="calc-card"><div class="card-title">2. Katmanları çiz</div><div class="card-body">Gerektiği kadar tekrarla: <code>ax.plot(...)</code>, <code>ax.scatter(...)</code>, <code>ax.bar(...)</code>, <code>ax.fill_between(...)</code>. Her çağrı bir öncekinin üstüne bir görsel katman daha ekler.</div></div>
<div class="calc-card"><div class="card-title">3. Bitir</div><div class="card-body">Etiketle (<code>set_xlabel</code>, <code>set_title</code>, <code>legend</code>), sonra ya <code>plt.show()</code> (göster) ya da <code>fig.savefig(yol)</code> (dışa aktar).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># ----- 1. Veri -----</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
epoks = np.<span class="fn">arange</span>(<span class="num">1</span>, <span class="num">21</span>)
egitim_kayip = <span class="num">0.9</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">6</span>) + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.02</span>, <span class="num">20</span>)
dogrulama    = <span class="num">0.9</span> * np.<span class="fn">exp</span>(-epoks / <span class="num">6</span>) + <span class="num">0.05</span> + rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.04</span>, <span class="num">20</span>)

<span class="cm"># ----- 2. Tuvali ac -----</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

<span class="cm"># ----- 3. Katmanlari ciz -----</span>
ax.<span class="fn">plot</span>(epoks, egitim_kayip, marker=<span class="str">"o"</span>, label=<span class="str">"egitim"</span>,
        color=<span class="str">"#4ecdc4"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">plot</span>(epoks, dogrulama,    marker=<span class="str">"s"</span>, label=<span class="str">"dogrulama"</span>,
        color=<span class="str">"#c8a96e"</span>, linewidth=<span class="num">2</span>)
ax.<span class="fn">fill_between</span>(epoks, egitim_kayip, dogrulama,
                color=<span class="str">"#c8a96e"</span>, alpha=<span class="num">0.08</span>)   <span class="cm"># iki egri arasindaki aralik</span>

<span class="cm"># ----- 4. Bitir -----</span>
ax.<span class="fn">set_xlabel</span>(<span class="str">"epok"</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"capraz entropi kaybi"</span>)
ax.<span class="fn">set_title</span>(<span class="str">"Egitim vs dogrulama kaybi (oyuncak kosu)"</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"upper right"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

plt.<span class="fn">show</span>()
<span class="cm"># fig.savefig("egitim_egrileri.pdf", bbox_inches="tight")</span></code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) 20 epok sahte eğitim verisi oluşturur: train için küçük gürültülü üstel azalan kayıp, val için sabit bir kayma ve daha büyük gürültü (böylece val asla train'i tam yakalayamaz -- ders kitabı tarzı küçük bir aşırı öğrenme). 2) <code>plt.subplots(figsize=(8, 5))</code> bir Axes ile 8x5 inçlik bir tuval açar. 3) İki <code>ax.plot</code> çağrısı kendi rengi, işaretçisi ve etiketiyle eğitim ve doğrulama eğrilerini çizer. 4) <code>ax.fill_between</code> iki eğri arasındaki alanı düşük alfa ile gölgeler; bu görselleştirilmiş "genelleme açığıdır" -- model aşırı öğrendikçe büyür. 5) Standart bitirme dokunuşları eksen etiketlerini, başlığı, açıklamayı ve hafif bir ızgarayı ayarlar. 6) <code>plt.show</code> figürü etkileşimli olarak gösterir; <code>fig.savefig("egitim_egrileri.pdf", bbox_inches="tight")</code> tezde ya da makalede kullanmak üzere vektör PDF olarak kalıcılaştırır.</p>

<div id="plot-mpl-l1-rhythm-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Buradaki resim:</strong> Matplotlib kodunun sadık bir Plotly aynası: eğitim (teal) ve doğrulama (altın) kayıp eğrileri arasındaki boşluk gölgelendirilmiş. Bu, derin öğrenmedeki en çok çizilen tek figürdür ve <em>tuvali aç, katmanları çiz, bitir</em> kanonik ritmini izler. Bunu uykunuzda üretebilir hale geldiğinizde, neredeyse her diğer grafik küçük bir varyasyondur: iki eğriyi histogramlarla değiştirin, doğruluk için ikinci bir alt grafik ekleyin, y eksenini log'a çevirin -- iskelet aynı kalır.</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Neden <code>fig.savefig</code> <code>fig</code>'e ait, <code>ax</code>'a değil? Çünkü kaydetme bir Figure düzeyi işlemdir -- tüm tuvali (birçok Axes içerebilir) tek bir dosyaya serileştirirsiniz. Veri eklemek ise bir Axes düzeyi işlemdir -- belirli bir alt grafiğin <em>üzerine</em> çizersiniz. "Figure = dosya, Axes = çizim"i içselleştirdiğinizde, hangi metodun nereye ait olduğunu karıştırmayı bırakırsınız.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tek Resimde Anatomi</h2>

<p class="l-text">Sözcük dağarcığı kas hafızasına dönüşsün diye gerçek bir Matplotlib figürünün her parçasını etiketleyelim. Aşağıda bir axes'li bir figür var ve her bileşen isimlendirilmiş.</p>

<div id="plot-mpl-l1-labelled-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu diyagram neyi gösteriyor:</strong> Etiketlenmiş bir Matplotlib figür anatomisi. Dış çerçeve <em>Figure</em>'dür. İçteki çizim alanı (ızgara çizgileriyle) <em>Axes</em>'tir. Alttaki yatay sayı doğrusu ve soldaki dikey sayı doğrusu o Axes'e ait iki <em>Axis</em> nesnesidir. Üstteki metin <em>başlıktır</em>; "x" ve "f(x)" sözcükleri <em>eksen etiketleridir</em>; küçük çizgiler ve sayılar (1, 2, 3, ...) <em>ana tikler</em> ve <em>tik etiketleridir</em>. Sarı çizgi bir <em>Line2D</em> Artist'tir; sağ üstteki kutu <em>açıklamadır</em>. Bu öğelerin her biri oluşturulduktan sonra alıp değiştirebileceğiniz bir Python nesnesidir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spine'lar</div><div class="card-body">Axes'in dört sınırı. Daha temiz bir görünüm için sıklıkla gizlenir (<code>ax.spines["top"].set_visible(False)</code>).</div></div>
<div class="calc-card"><div class="card-title">Ana / minör tikler</div><div class="card-body">Ana tiklerin etiketleri vardır (1, 2, 3); minör tikler daha küçük ve etiketsizdir. <code>ax.set_xticks</code>, <code>ax.minorticks_on()</code> ile ayarlanır.</div></div>
<div class="calc-card"><div class="card-title">Tik etiketleri</div><div class="card-body">Her tikin altındaki (veya yanındaki) metin. <code>ax.set_xticklabels(["a","b"])</code> veya <code>FuncFormatter</code> ile özelleştirin.</div></div>
<div class="calc-card"><div class="card-title">Izgara</div><div class="card-body">Her tikten çizim alanı boyunca uzanan hafif çizgiler. <code>ax.grid(True, alpha=0.3)</code> standart görünümdür.</div></div>
<div class="calc-card"><div class="card-title">Başlık ve etiketler</div><div class="card-body">Üç metin artist'i: <code>ax.set_title</code>, <code>ax.set_xlabel</code>, <code>ax.set_ylabel</code>. Yayın kalitesinde bir figürde her zaman olmalı.</div></div>
<div class="calc-card"><div class="card-title">Legend (açıklama)</div><div class="card-body"><code>label=</code> kwargs'larından otomatik üretilir. <code>ax.legend(loc="best")</code> en az çakışma olan yeri seçer.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: bileşenleri sonradan tutmak</div><div class="example-body">Görünür her öğe bir Artist olduğundan, oluşturduktan sonra değiştirebilirsiniz. <code>(line,) = ax.plot(x, y)</code> -- şimdi <code>line</code> bir <code>Line2D</code> nesnesidir. <code>line.set_color("red")</code> bir sonraki yeniden çizimde günceller. <code>ax.spines["top"].set_visible(False)</code> üst sınırı gizler. Matplotlib'i sonsuz özelleştirilebilir yapan budur.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Mini Hatırlatma & Toparlama</h2>

<p class="l-text">Kursun geri kalanını öğrenirken açık tutabileceğiniz yoğunlaştırılmış bir referans.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Demo data for second plot</span>
x2 = np.linspace(0, 10, 50)
y2 = np.cos(x2)

<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># 1) Tuvali ac</span>
fig, ax = plt.<span class="fn">subplots</span>(figsize=(<span class="num">8</span>, <span class="num">5</span>))

<span class="cm"># 2) Katmanlari ciz</span>
ax.<span class="fn">plot</span>(x, y, label=<span class="str">"seri A"</span>)
ax.<span class="fn">scatter</span>(x2, y2, label=<span class="str">"seri B"</span>)

<span class="cm"># 3) Etiketle</span>
ax.<span class="fn">set_xlabel</span>(<span class="str">"..."</span>)
ax.<span class="fn">set_ylabel</span>(<span class="str">"..."</span>)
ax.<span class="fn">set_title</span>(<span class="str">"..."</span>)
ax.<span class="fn">legend</span>(loc=<span class="str">"best"</span>)
ax.<span class="fn">grid</span>(<span class="kw">True</span>, alpha=<span class="num">0.3</span>)

<span class="cm"># 4) Bitir</span>
plt.<span class="fn">show</span>()                            <span class="cm"># goster</span>
fig.<span class="fn">savefig</span>(<span class="str">"plot.pdf"</span>,               <span class="cm"># YA DA kaydet</span>
            dpi=<span class="num">150</span>, bbox_inches=<span class="str">"tight"</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Tek <code>fig, ax = plt.subplots(figsize=(...))</code> bir Axes'li bir Figure açar. 2) Herhangi sayıda <code>ax.plot</code>, <code>ax.scatter</code>, <code>ax.bar</code>, vb. çağrı veriyi katmanlar. 3) Etiketleme metotları axes'e anlam katar -- bunları atlarsanız grafiğiniz gelecekteki kendiniz için anlaşılmaz olacaktır. 4) <code>plt.show()</code> figürü aktif backend'e render eder; <code>fig.savefig</code> diske yazar. <code>bbox_inches="tight"</code> bayrağı beyaz kenar boşluklarını kırpar, bu da LaTeX'e gömülen tez figürleri için zorunludur.</p>

<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bir <em>Figure</em> tuvaldir; bir <em>Axes</em> o tuvalde bir grafiktir; bir <em>Axis</em> o grafikteki iki sayı doğrusundan biridir. Bu üç kelimeyi ezberleyin.<br><strong>2.</strong> Bundan sonra her şey için <code>fig, ax = plt.subplots()</code> kullanın. İki ekstra karakter, sonsuz ölçeklenebilirlik.<br><strong>3.</strong> OO API (<code>ax.plot</code>, <code>ax.set_title</code>) saklamayı düşündüğünüz herhangi bir grafikte pyplot API'sini geçer.<br><strong>4.</strong> Ritim her zaman: <em>tuvali aç, katmanları çiz, bitir</em>. Bu kursun geri kalanındaki her grafik bunu izler.<br><strong>5.</strong> Backend'ler render motorlarıdır. Jupyter'de inline, sunucularda agg. Elle nadiren değiştirirsiniz.<br><strong>6.</strong> Görünür her öğe bir <em>Artist</em>'tir, yani daha sonra alıp değiştirebilirsiniz. Matplotlib'in sonsuz esnekliğinin kaynağı budur.<br><strong>7.</strong> <code>fig.savefig(..., dpi=150, bbox_inches="tight")</code> yayına hazır bir dosya dışa aktarır. Vektör için PDF/SVG, raster için PNG.<br><strong>8.</strong> Figürünüz kötü görünüyorsa Matplotlib'i suçlamayın -- varsayılanlar kasıtlı olarak nötrdür. Ders 5 size onu tez gibi nasıl şekillendireceğinizi gösterecek.</div></div>
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

  // 1. Anatomy diagram (figure containing axes containing axis)
  function anatomy(id){
    var el = document.getElementById(id); if(!el) return;
    var shapes = [
      {type:'rect', xref:'paper', yref:'paper', x0:0, y0:0, x1:1, y1:1, line:{color:T.accent, width:3, dash:'solid'}, fillcolor:'rgba(200,169,110,0.04)'},
      {type:'rect', xref:'paper', yref:'paper', x0:0.18, y0:0.20, x1:0.92, y1:0.85, line:{color:'#4ecdc4', width:2}, fillcolor:'rgba(78,205,196,0.06)'}
    ];
    var ann = [
      {xref:'paper',yref:'paper',x:0.02,y:0.97,text:'<b>Figure</b> (the canvas)',showarrow:false,font:{color:T.accent,size:14},xanchor:'left'},
      {xref:'paper',yref:'paper',x:0.55,y:0.78,text:'<b>Axes</b> (one plot)',showarrow:false,font:{color:'#4ecdc4',size:13}},
      {xref:'paper',yref:'paper',x:0.55,y:0.16,text:'X <b>Axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:0,ay:-30,font:{color:T.text,size:12}},
      {xref:'paper',yref:'paper',x:0.14,y:0.52,text:'Y <b>Axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:30,ay:0,font:{color:T.text,size:12}}
    ];
    var trace = {x:[1,2,3,4,5],y:[1,4,2,5,3],mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2.5},marker:{color:T.accent,size:7},xaxis:'x2',yaxis:'y2',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Figure / Axes / Axis hiyerarşisi',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[0,1]}, yaxis:{visible:false,range:[0,1]},
      xaxis2:{domain:[0.18,0.92],anchor:'y2',gridcolor:T.grid,zerolinecolor:T.zero,title:{text:'x',font:{color:T.text,size:11}}},
      yaxis2:{domain:[0.20,0.85],anchor:'x2',gridcolor:T.grid,zerolinecolor:T.zero,title:{text:'f(x)',font:{color:T.text,size:11}}},
      shapes:shapes, annotations:ann, height:420, showlegend:false
    });
    Plotly.newPlot(id,[trace],layout,{responsive:true,displayModeBar:false});
  }
  anatomy('plot-mpl-l1-anatomy-en');
  anatomy('plot-mpl-l1-anatomy-tr');

  // 2. First plot: parabola + noise
  function firstplot(id, title, xl, yl, lblTrue, lblObs){
    var el = document.getElementById(id); if(!el) return;
    var x=[], yt=[], yo=[]; var seed=0;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=0;i<60;i++){var xi=-3+6*i/59;x.push(xi);yt.push(xi*xi);yo.push(xi*xi+rnd()*1.6);}
    var t1 = {x:x,y:yt,mode:'lines',type:'scatter',line:{color:T.accent,width:2.5},name:lblTrue};
    var t2 = {x:x,y:yo,mode:'markers',type:'scatter',marker:{color:'#4ecdc4',size:7,opacity:0.8},name:lblObs};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  firstplot('plot-mpl-l1-firstplot-en','Observations around the true curve y = x^2','x','y','true: y = x^2','observed');
  firstplot('plot-mpl-l1-firstplot-tr','Gercek y = x^2 egrisi etrafindaki gozlemler','x','y','gercek: y = x^2','gozlem');

  // 3. Training curves rhythm demo
  function rhythm(id, title, xl, yl, lblT, lblV){
    var el = document.getElementById(id); if(!el) return;
    var ep=[], tr=[], va=[]; var seed=7;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280-0.5;}
    for (var i=1;i<=20;i++){ep.push(i);var d=0.9*Math.exp(-i/6);tr.push(d+rnd()*0.04);va.push(d+0.05+rnd()*0.08);}
    var fill = {x:ep.concat(ep.slice().reverse()),y:tr.concat(va.slice().reverse()),fill:'toself',fillcolor:'rgba(200,169,110,0.10)',line:{color:'rgba(0,0,0,0)'},type:'scatter',name:'gap',hoverinfo:'skip',showlegend:false};
    var t1 = {x:ep,y:tr,mode:'lines+markers',type:'scatter',line:{color:'#4ecdc4',width:2},marker:{color:'#4ecdc4',size:7},name:lblT};
    var t2 = {x:ep,y:va,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2},marker:{color:T.accent,size:7,symbol:'square'},name:lblV};
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot(id,[fill,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  rhythm('plot-mpl-l1-rhythm-en','Training vs validation loss (toy run)','epoch','cross-entropy loss','train','val');
  rhythm('plot-mpl-l1-rhythm-tr','Egitim vs dogrulama kaybi (oyuncak kosu)','epok','capraz entropi kaybi','egitim','dogrulama');

  // 4. Labelled anatomy (with title, legend, ticks)
  function labelled(id, title, xl, yl, legendName){
    var el = document.getElementById(id); if(!el) return;
    var x=[]; var y=[];
    for (var i=0;i<=10;i++){x.push(i);y.push(Math.sin(i*0.6)*2+3);}
    var t1 = {x:x,y:y,mode:'lines+markers',type:'scatter',line:{color:T.accent,width:2.5},marker:{color:T.accent,size:7},name:legendName};
    var ann = [
      {x:5,y:5.0,text:'<b>title</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:0,ay:-40,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:9.2,y:4.5,text:'<b>legend</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:-30,ay:-20,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:5,y:0.6,text:'<b>x axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:0,ay:30,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:0.5,y:3,text:'<b>y axis</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:-40,ay:0,font:{color:T.text,size:11},xref:'x',yref:'y'},
      {x:7,y:3.5,text:'<b>Line2D Artist</b>',showarrow:true,arrowhead:2,arrowcolor:T.text,ax:30,ay:30,font:{color:T.text,size:11},xref:'x',yref:'y'}
    ];
    var layout = Object.assign({}, common, {title:{text:title,font:{color:T.text,size:14}},xaxis:{title:xl,gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:yl,gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}},annotations:ann});
    Plotly.newPlot(id,[t1],layout,{responsive:true,displayModeBar:false});
  }
  labelled('plot-mpl-l1-labelled-en','A labelled Matplotlib figure','x','f(x)','f(x) = 2 sin(0.6 x) + 3');
  labelled('plot-mpl-l1-labelled-tr','Etiketli bir Matplotlib figuru','x','f(x)','f(x) = 2 sin(0.6 x) + 3');
},250);</script>
`

};
