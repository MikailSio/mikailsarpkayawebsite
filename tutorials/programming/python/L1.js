var PYTHON_L1 = {

en: '<p class="l-text"><strong>Python is the lingua franca of modern data science, machine learning, and NLP.</strong> Before diving into complex algorithms and neural architectures, you need a rock-solid foundation in the language itself. This lesson covers everything from installing Python to understanding its memory model, type system, and core data types \u2014 the building blocks every ML engineer uses daily.</p>'

+ '<p class="l-text">By the end of this lesson, you will understand how Python manages objects in memory, why <code>0.1 + 0.2 != 0.3</code>, how strings are encoded, and what "duck typing" really means. These are not academic curiosities \u2014 they are practical knowledge that prevents real bugs in data pipelines and model training code.</p>'
+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Install Python 3.12+, set up a virtual environment, and manage packages with pip</li><li>Use core data types: int, float, str, bool, list, tuple, dict, and set</li><li>Explain Python\'s object model and why everything is a reference</li><li>Predict how mutability affects function arguments and aliasing</li><li>Decode why 0.1 + 0.2 != 0.3 and handle floating point safely</li></ul></div>'


/* ============================================================
   SECTION 1: Why Python & Installation
   ============================================================ */
+ '<h2 class="l-title">1. Why Python & Installation</h2>'

+ '<div class="calc-highlight"><strong>Why Python for ML?</strong> Python dominates machine learning for three reasons: (1) a massive ecosystem of scientific libraries, (2) readable syntax that lets researchers focus on algorithms instead of language mechanics, and (3) C/C++ backends (NumPy, PyTorch) that deliver high performance despite Python being interpreted. Over 90% of ML papers with code use Python.</div>'

+ '<p class="l-text"><strong>The Python Ecosystem for ML/NLP</strong> \u2014 Python alone is just a general-purpose language. Its power comes from an extraordinary ecosystem of specialized libraries:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">NumPy</div><div class="card-body">N-dimensional arrays, vectorized math, linear algebra. The foundation everything else builds on. Written in C for speed.</div></div>'
+ '<div class="calc-card"><div class="card-title">Pandas</div><div class="card-body">DataFrames for tabular data. Loading CSV/JSON, filtering, grouping, merging \u2014 essential for data preprocessing.</div></div>'
+ '<div class="calc-card"><div class="card-title">scikit-learn</div><div class="card-body">Classical ML: regression, classification, clustering, preprocessing, evaluation metrics. The Swiss Army knife of ML.</div></div>'
+ '<div class="calc-card"><div class="card-title">PyTorch</div><div class="card-body">Deep learning framework. Tensors, autograd, GPU support. Used by most NLP researchers (BERT, GPT, etc.).</div></div>'
+ '<div class="calc-card"><div class="card-title">HuggingFace</div><div class="card-body">Pre-trained transformers, tokenizers, datasets. Fine-tune BERT for sentiment in 10 lines of code.</div></div>'
+ '<div class="calc-card"><div class="card-title">Matplotlib / Plotly</div><div class="card-body">Visualization. From simple line plots to interactive 3D surfaces. Essential for EDA and result presentation.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Installing Python 3.12+:</strong> Always use the latest stable release. Python 3.12 introduced significant performance improvements (10\u201315% faster) and better error messages.</p>'

+ '<div class="calc-steps">'
+ '<div class="step-item"><div class="step-num">1</div><div class="step-content"><strong>Download Python</strong> from <code>python.org/downloads</code>. On Windows, check "Add Python to PATH" during installation. On macOS/Linux, use your package manager or pyenv.</div></div>'
+ '<div class="step-item"><div class="step-num">2</div><div class="step-content"><strong>Verify installation:</strong> Open terminal and run <code>python --version</code>. You should see <code>Python 3.12.x</code>.</div></div>'
+ '<div class="step-item"><div class="step-num">3</div><div class="step-content"><strong>Create a virtual environment:</strong> <code>python -m venv myenv</code>. This isolates your project dependencies. Activate with <code>source myenv/bin/activate</code> (Linux/Mac) or <code>myenv\\Scripts\\activate</code> (Windows).</div></div>'
+ '<div class="step-item"><div class="step-num">4</div><div class="step-content"><strong>Install VS Code</strong> + Python extension. Set the interpreter to your venv. This gives you IntelliSense, debugging, and integrated terminal.</div></div>'
+ '<div class="step-item"><div class="step-num">5</div><div class="step-content"><strong>Install key packages:</strong> <code>pip install numpy pandas matplotlib scikit-learn torch</code>. These are the building blocks of every ML project.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>REPL vs Script Mode:</strong> Python has two execution modes. The <strong>REPL</strong> (Read-Eval-Print Loop) is interactive \u2014 type a line, see the result immediately. Start it by typing <code>python</code> in your terminal. <strong>Script mode</strong> runs a <code>.py</code> file from start to finish. Use REPL for exploration, scripts for production code.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Your first Python script: hello.py</span>\n'
+ '<span class="kw">import</span> sys\n'
+ '\n'
+ '<span class="fn">print</span>(<span class="str">f"Hello from Python {sys.version}"</span>)\n'
+ '<span class="fn">print</span>(<span class="str">f"Executable: {sys.executable}"</span>)\n'
+ '\n'
+ '<span class="cm"># Run with: python hello.py</span>\n'
+ '<span class="cm"># In REPL, each line executes immediately</span>\n'
+ '<span class="cm"># In scripts, code runs top-to-bottom</span>'
+ '</pre></div>'

+ '<div class="l-note"><strong>Why Virtual Environments Matter:</strong> Without venv, all packages install globally. Project A needs PyTorch 1.13, Project B needs PyTorch 2.0 \u2014 conflict! Venvs give each project its own isolated Python with its own packages. <strong>Always use venvs.</strong></div>'

/* ============================================================
   SECTION 2: Variables & Memory Model
   ============================================================ */
+ '<h2 class="l-title">2. Variables & Memory Model</h2>'

+ '<div class="calc-highlight"><strong>Key Insight:</strong> In Python, variables are <em>not boxes that hold values</em>. They are <em>name tags</em> (labels) attached to objects. When you write <code>x = 42</code>, Python creates an integer object <code>42</code> in memory, and the name <code>x</code> points to it. This is fundamentally different from C, where <code>int x = 42</code> allocates a box and puts 42 inside.</div>'

+ '<p class="l-text">Understanding Python\u2019s memory model prevents a whole class of bugs, especially when working with mutable objects like lists and DataFrames.</p>'

/* --- SVG: Variable-Object-Value Diagram --- */
+ '<div class="calc-graph"><div class="cg-title">Python Memory Model: Names \u2192 Objects</div>'
+ '<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg">'
/* --- Name tags (left) --- */
+ '<rect x="30" y="30" width="80" height="36" rx="6" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="1.5"/>'
+ '<text x="70" y="53" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">x</text>'
+ '<rect x="30" y="90" width="80" height="36" rx="6" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="1.5"/>'
+ '<text x="70" y="113" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">y</text>'
+ '<rect x="30" y="160" width="80" height="36" rx="6" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="1.5"/>'
+ '<text x="70" y="183" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">z</text>'
/* --- Arrows --- */
+ '<line x1="110" y1="48" x2="230" y2="48" stroke="#c8a96e" stroke-width="1.5" marker-end="url(#arrowPy)"/>'
+ '<line x1="110" y1="108" x2="230" y2="48" stroke="#c8a96e" stroke-width="1.5" marker-end="url(#arrowPy)"/>'
+ '<line x1="110" y1="178" x2="230" y2="168" stroke="#c8a96e" stroke-width="1.5" marker-end="url(#arrowPy)"/>'
/* --- Arrow marker --- */
+ '<defs><marker id="arrowPy" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#c8a96e"/></marker></defs>'
/* --- Object boxes (right) --- */
+ '<rect x="230" y="22" width="160" height="52" rx="8" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" stroke-width="1.8"/>'
+ '<text x="310" y="42" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="9" text-anchor="middle">int object @ 0x7f3a</text>'
+ '<text x="310" y="62" fill="#e0e0e0" font-family="monospace" font-size="16" text-anchor="middle">42</text>'
+ '<rect x="230" y="142" width="160" height="52" rx="8" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" stroke-width="1.8"/>'
+ '<text x="310" y="162" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="9" text-anchor="middle">list object @ 0x7f3b</text>'
+ '<text x="310" y="182" fill="#e0e0e0" font-family="monospace" font-size="16" text-anchor="middle">[1, 2, 3]</text>'
/* --- Labels --- */
+ '<text x="70" y="15" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10" text-anchor="middle">NAMES (variables)</text>'
+ '<text x="310" y="10" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10" text-anchor="middle">OBJECTS (in memory)</text>'
+ '<text x="480" y="42" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="9" text-anchor="start">x and y point to</text>'
+ '<text x="480" y="55" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="9" text-anchor="start">the SAME object!</text>'
+ '</svg>'
+ '<div class="cg-caption">x = 42; y = x \u2014 both names point to the same int object. z = [1,2,3] points to a separate list object. Names are references, not containers.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Exploring Python\'s memory model</span>\n'
+ 'x = <span class="num">42</span>\n'
+ 'y = x\n'
+ '\n'
+ '<span class="fn">print</span>(<span class="fn">id</span>(x))   <span class="cm"># e.g., 140234866221232</span>\n'
+ '<span class="fn">print</span>(<span class="fn">id</span>(y))   <span class="cm"># Same! Both reference the same object</span>\n'
+ '<span class="fn">print</span>(x <span class="kw">is</span> y)  <span class="cm"># True \u2014 same object in memory</span>\n'
+ '\n'
+ '<span class="cm"># Now reassign x</span>\n'
+ 'x = <span class="num">99</span>\n'
+ '<span class="fn">print</span>(y)        <span class="cm"># Still 42! Integers are immutable.</span>\n'
+ '<span class="fn">print</span>(x <span class="kw">is</span> y)  <span class="cm"># False \u2014 x now points to a new object</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>Mutable vs Immutable \u2014 the critical distinction:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">IMMUTABLE (cannot change)</div><div class="compare-item">\u2022 <code>int</code>, <code>float</code>, <code>str</code>, <code>tuple</code>, <code>frozenset</code>, <code>bool</code></div><div class="compare-item">\u2022 Reassignment creates a <strong>new</strong> object</div><div class="compare-item">\u2022 Safe to share references</div><div class="compare-item">\u2022 Can be used as dict keys</div></div><div class="compare-col"><div class="compare-title">MUTABLE (can change in-place)</div><div class="compare-item">\u2022 <code>list</code>, <code>dict</code>, <code>set</code>, <code>bytearray</code></div><div class="compare-item">\u2022 Modifying changes the <strong>same</strong> object</div><div class="compare-item">\u2022 Shared references = shared mutations!</div><div class="compare-item">\u2022 Cannot be used as dict keys</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># The mutable trap \u2014 one of Python\'s most common bugs</span>\n'
+ 'a = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]\n'
+ 'b = a               <span class="cm"># b points to the SAME list</span>\n'
+ 'b.append(<span class="num">4</span>)\n'
+ '<span class="fn">print</span>(a)            <span class="cm"># [1, 2, 3, 4] \u2014 a changed too!</span>\n'
+ '\n'
+ '<span class="cm"># Fix: make a copy</span>\n'
+ 'c = a.copy()        <span class="cm"># or a[:] or list(a)</span>\n'
+ 'c.append(<span class="num">5</span>)\n'
+ '<span class="fn">print</span>(a)            <span class="cm"># [1, 2, 3, 4] \u2014 a is unchanged</span>\n'
+ '<span class="fn">print</span>(c)            <span class="cm"># [1, 2, 3, 4, 5]</span>'
+ '</pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why would Python use reference semantics instead of copying values? <strong>Performance.</strong> When you pass a 1GB DataFrame to a function, Python does not copy 1GB of data \u2014 it just passes the reference (a pointer). This is why Python can handle large datasets efficiently despite being an interpreted language.</div></div>'

+ '<div class="l-note"><strong>ML Relevance:</strong> This reference model is why <code>df2 = df</code> creates a view in Pandas, not a copy. Modifying <code>df2</code> modifies <code>df</code>. Use <code>df.copy()</code> to avoid subtle data corruption bugs in your preprocessing pipeline.</div>'

/* ============================================================
   SECTION 3: Numeric Types
   ============================================================ */
+ '<h2 class="l-title">3. Numeric Types</h2>'

+ '<p class="l-text">Python provides four built-in numeric types, each with distinct characteristics that matter for scientific computing:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">int</div><div class="card-body"><strong>Arbitrary precision</strong> integers. No overflow! Python seamlessly handles numbers with thousands of digits. 2**1000 works fine. Internally uses arrays of 30-bit digits.</div></div>'
+ '<div class="calc-card"><div class="card-title">float</div><div class="card-body"><strong>IEEE 754 double precision</strong> (64-bit). 15\u201317 significant digits. Fast but imprecise \u2014 0.1 + 0.2 \u2260 0.3. Default for scientific computing.</div></div>'
+ '<div class="calc-card"><div class="card-title">complex</div><div class="card-body"><strong>Complex numbers:</strong> <code>3+4j</code>. Real and imaginary parts are floats. Used in signal processing, Fourier transforms.</div></div>'
+ '<div class="calc-card"><div class="card-title">Decimal</div><div class="card-body"><strong>Exact decimal arithmetic.</strong> From <code>decimal</code> module. Slower but precise. Used in finance. Not common in ML.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">ARITHMETIC OPERATORS</div><div class="formula-main">+  \u2212  *  /  //  %  **</div><div class="formula-sub"><code>/</code> = true division (always float), <code>//</code> = floor division (rounds down), <code>%</code> = modulo (remainder), <code>**</code> = power. Example: <code>7 // 2 = 3</code>, <code>7 % 2 = 1</code>, <code>2 ** 10 = 1024</code>.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Integer: arbitrary precision (no overflow!)</span>\n'
+ 'big = <span class="num">2</span> ** <span class="num">1000</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(<span class="fn">str</span>(big)))  <span class="cm"># 302 digits!</span>\n'
+ '\n'
+ '<span class="cm"># Float: IEEE 754 precision issues</span>\n'
+ '<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span>)         <span class="cm"># 0.30000000000000004</span>\n'
+ '<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span> == <span class="num">0.3</span>)  <span class="cm"># False!</span>\n'
+ '\n'
+ '<span class="cm"># The right way to compare floats</span>\n'
+ '<span class="kw">import</span> math\n'
+ '<span class="fn">print</span>(math.isclose(<span class="num">0.1</span> + <span class="num">0.2</span>, <span class="num">0.3</span>))  <span class="cm"># True</span>\n'
+ '\n'
+ '<span class="cm"># Division operators</span>\n'
+ '<span class="fn">print</span>(<span class="num">7</span> / <span class="num">2</span>)   <span class="cm"># 3.5  (true division)</span>\n'
+ '<span class="fn">print</span>(<span class="num">7</span> // <span class="num">2</span>)  <span class="cm"># 3    (floor division)</span>\n'
+ '<span class="fn">print</span>(<span class="num">7</span> % <span class="num">2</span>)   <span class="cm"># 1    (modulo / remainder)</span>\n'
+ '\n'
+ '<span class="cm"># Complex numbers</span>\n'
+ 'z = <span class="num">3</span> + <span class="num">4j</span>\n'
+ '<span class="fn">print</span>(z.real, z.imag)     <span class="cm"># 3.0 4.0</span>\n'
+ '<span class="fn">print</span>(<span class="fn">abs</span>(z))              <span class="cm"># 5.0 (magnitude)</span>'
+ '</pre></div>'

/* --- Plotly: Float Precision Visualization --- */
+ '<div id="plot-float-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var ns=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];'
+ 'var errs=ns.map(function(n){var s=0;for(var i=0;i<Math.pow(10,n>6?6:n);i++)s+=0.1;var expected=Math.pow(10,n>6?6:n)/10;return Math.abs(s-expected);});'
+ 'var sumErrs=[];var s2=0;for(var i=0;i<20;i++){s2+=0.1;sumErrs.push(Math.abs(s2-(i+1)*0.1));}'
+ 'var t1={x:Array.from({length:20},function(_,i){return i+1}),y:sumErrs,mode:"lines+markers",name:"Cumulative error adding 0.1",line:{color:"#f87171",width:2},marker:{size:5,color:"#f87171"}};'
+ 'var layout={title:{text:"Float Precision: Error Accumulates When Adding 0.1 Repeatedly",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"Number of additions",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"Absolute error",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",tickformat:".2e"},margin:{t:50,r:30,b:50,l:70},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-float-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>What this graph shows:</strong> Each time you add 0.1, a tiny error accumulates because 0.1 cannot be represented exactly in binary. After 20 additions, the error is measurable. In ML, this is why we use float32 carefully and normalize inputs \u2014 accumulated precision errors can corrupt gradients.</div></div>'

+ '<div class="calc-highlight"><strong>Why can\u2019t 0.1 be stored exactly?</strong> Computers use binary (base 2). Just like 1/3 = 0.333... repeats infinitely in decimal, 1/10 = 0.0001100110011... repeats infinitely in binary. IEEE 754 truncates after 53 bits, introducing a tiny error. This is not a Python bug \u2014 it affects every language using hardware floats (C, Java, JavaScript, etc.).</div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If floats are imprecise, why does ML still use them? Because <strong>approximate arithmetic is fast</strong>. GPUs can do trillions of float operations per second. The tiny errors (\u223c10\u207b\u00b9\u2076) are far smaller than the noise in real data. Modern ML even uses float16 (half precision) to double throughput \u2014 trading precision for speed.</div></div>'

/* ============================================================
   SECTION 4: Strings In Depth
   ============================================================ */
+ '<h2 class="l-title">4. Strings In Depth</h2>'

+ '<p class="l-text">Strings are <strong>immutable sequences of Unicode characters</strong>. In NLP, text is your raw data \u2014 understanding string operations is as important as understanding matrix math. Python 3 made a critical improvement over Python 2: all strings are Unicode by default (UTF-8 source encoding).</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Regular Strings</div><div class="card-body"><code>"hello"</code> or <code>\'hello\'</code>. Single and double quotes are interchangeable. Use one inside the other to avoid escaping.</div></div>'
+ '<div class="calc-card"><div class="card-title">F-Strings</div><div class="card-body"><code>f"Score: {accuracy:.2%}"</code>. Embed expressions directly. The most Pythonic way to format strings since Python 3.6.</div></div>'
+ '<div class="calc-card"><div class="card-title">Raw Strings</div><div class="card-body"><code>r"C:\\Users"</code> \u2014 backslashes are literal, not escapes. Essential for regex patterns and Windows paths.</div></div>'
+ '<div class="calc-card"><div class="card-title">Triple-Quoted</div><div class="card-body"><code>"""multi\\nline"""</code>. Span multiple lines. Used for docstrings, SQL queries, and long text blocks.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># String creation and formatting</span>\n'
+ 'name = <span class="str">"Python"</span>\n'
+ 'version = <span class="num">3.12</span>\n'
+ '\n'
+ '<span class="cm"># F-strings: the modern way (Python 3.6+)</span>\n'
+ 'msg = <span class="str">f"</span>{name} {version}<span class="str"> is amazing"</span>\n'
+ 'pi = <span class="num">3.14159265</span>\n'
+ '<span class="fn">print</span>(<span class="str">f"pi = </span>{pi:<span class="num">.4f</span>}<span class="str">"</span>)  <span class="cm"># "pi = 3.1416"</span>\n'
+ '\n'
+ '<span class="cm"># Indexing and slicing</span>\n'
+ 's = <span class="str">"Hello, World!"</span>\n'
+ '<span class="fn">print</span>(s[<span class="num">0</span>])       <span class="cm"># \'H\'  (0-based indexing)</span>\n'
+ '<span class="fn">print</span>(s[-<span class="num">1</span>])      <span class="cm"># \'!\'  (negative = from end)</span>\n'
+ '<span class="fn">print</span>(s[<span class="num">7</span>:<span class="num">12</span>])    <span class="cm"># \'World\' (start:stop, stop excluded)</span>\n'
+ '<span class="fn">print</span>(s[::<span class="num">-1</span>])     <span class="cm"># \'!dlroW ,olleH\' (reverse)</span>\n'
+ '\n'
+ '<span class="cm"># Strings are IMMUTABLE</span>\n'
+ '<span class="cm"># s[0] = "h"      # TypeError! Cannot modify in place</span>\n'
+ 's = <span class="str">"h"</span> + s[<span class="num">1</span>:]  <span class="cm"># Create a NEW string instead</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>Essential String Methods for NLP:</strong> These are the methods you will use constantly when preprocessing text data:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">SEARCHING & TESTING</div><div class="compare-item">\u2022 <code>s.find("x")</code> \u2014 index or -1</div><div class="compare-item">\u2022 <code>s.startswith("Hi")</code> \u2014 bool</div><div class="compare-item">\u2022 <code>s.endswith(".txt")</code> \u2014 bool</div><div class="compare-item">\u2022 <code>s.count("a")</code> \u2014 occurrences</div><div class="compare-item">\u2022 <code>s.isdigit()</code> \u2014 all digits?</div><div class="compare-item">\u2022 <code>s.isalpha()</code> \u2014 all letters?</div></div><div class="compare-col"><div class="compare-title">TRANSFORMING</div><div class="compare-item">\u2022 <code>s.lower()</code> / <code>s.upper()</code></div><div class="compare-item">\u2022 <code>s.strip()</code> \u2014 remove whitespace</div><div class="compare-item">\u2022 <code>s.replace("a","b")</code></div><div class="compare-item">\u2022 <code>s.split(",")</code> \u2014 string \u2192 list</div><div class="compare-item">\u2022 <code>",".join(list)</code> \u2014 list \u2192 string</div><div class="compare-item">\u2022 <code>s.encode("utf-8")</code> \u2014 bytes</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># NLP-style text preprocessing</span>\n'
+ 'raw = <span class="str">"  Hello, World! This is NLP.  "</span>\n'
+ '\n'
+ '<span class="cm"># Step 1: Strip whitespace</span>\n'
+ 'text = raw.strip()               <span class="cm"># "Hello, World! This is NLP."</span>\n'
+ '\n'
+ '<span class="cm"># Step 2: Lowercase</span>\n'
+ 'text = text.lower()              <span class="cm"># "hello, world! this is nlp."</span>\n'
+ '\n'
+ '<span class="cm"># Step 3: Tokenize (simple split)</span>\n'
+ 'tokens = text.split()            <span class="cm"># ["hello,", "world!", "this", "is", "nlp."]</span>\n'
+ '\n'
+ '<span class="cm"># Step 4: Remove punctuation</span>\n'
+ '<span class="kw">import</span> string\n'
+ 'clean = [t.strip(string.punctuation) <span class="kw">for</span> t <span class="kw">in</span> tokens]\n'
+ '<span class="cm"># ["hello", "world", "this", "is", "nlp"]</span>\n'
+ '\n'
+ '<span class="cm"># Join back</span>\n'
+ 'result = <span class="str">" "</span>.join(clean)        <span class="cm"># "hello world this is nlp"</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>String Encoding (UTF-8):</strong> Computers store bytes, not characters. <strong>Encoding</strong> converts characters to bytes; <strong>decoding</strong> converts bytes back to characters. Python 3 uses Unicode internally (every character in every language is supported). UTF-8 is the standard encoding \u2014 ASCII-compatible, variable-length (1\u20134 bytes per character).</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Encoding: str \u2192 bytes</span>\n'
+ 'text = <span class="str">"caf\u00e9"</span>\n'
+ 'encoded = text.encode(<span class="str">"utf-8"</span>)\n'
+ '<span class="fn">print</span>(encoded)          <span class="cm"># b\'caf\\xc3\\xa9\' (5 bytes for 4 chars)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(text))         <span class="cm"># 4 characters</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(encoded))      <span class="cm"># 5 bytes (\u00e9 = 2 bytes in UTF-8)</span>\n'
+ '\n'
+ '<span class="cm"># Decoding: bytes \u2192 str</span>\n'
+ 'decoded = encoded.decode(<span class="str">"utf-8"</span>)\n'
+ '<span class="fn">print</span>(decoded)          <span class="cm"># "caf\u00e9"</span>\n'
+ '\n'
+ '<span class="cm"># Turkish characters in UTF-8</span>\n'
+ 'tr = <span class="str">"g\u00fcnayd\u0131n"</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(tr))                  <span class="cm"># 8 characters</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(tr.encode(<span class="str">"utf-8"</span>)))  <span class="cm"># 10 bytes (\u00fc and \u0131 = 2 bytes each)</span>'
+ '</pre></div>'

+ '<div class="l-note"><strong>NLP Relevance:</strong> When you load text from files, APIs, or web scraping, encoding errors are the #1 source of bugs. Always specify encoding: <code>open("file.txt", encoding="utf-8")</code>. Tokenizers like BERT\u2019s WordPiece and GPT\u2019s BPE operate on bytes/characters \u2014 understanding encoding is essential for debugging tokenization issues.</div>'

/* ============================================================
   SECTION 5: Boolean Logic & None
   ============================================================ */
+ '<h2 class="l-title">5. Boolean Logic & None</h2>'

+ '<p class="l-text">Boolean values (<code>True</code> / <code>False</code>) are the foundation of all control flow. But Python\u2019s boolean system goes deeper than most languages \u2014 <em>every</em> object has a truth value, and understanding "truthiness" is essential for writing idiomatic Python.</p>'

+ '<div class="calc-formula"><div class="formula-label">TRUTHINESS RULE</div><div class="formula-main">bool(x) \u2192 False if x is "empty" or "zero"</div><div class="formula-sub">Empty containers, zero numbers, None, and empty strings are all <strong>falsy</strong>. Everything else is <strong>truthy</strong>. This lets you write clean conditionals like <code>if my_list:</code> instead of <code>if len(my_list) > 0:</code>.</div></div>'

+ '<p class="l-text"><strong>The Complete Truthiness Table:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">FALSY (bool(x) = False)</div><div class="compare-item">\u2022 <code>False</code></div><div class="compare-item">\u2022 <code>None</code></div><div class="compare-item">\u2022 <code>0</code>, <code>0.0</code>, <code>0j</code></div><div class="compare-item">\u2022 <code>""</code> (empty string)</div><div class="compare-item">\u2022 <code>[]</code> (empty list)</div><div class="compare-item">\u2022 <code>()</code> (empty tuple)</div><div class="compare-item">\u2022 <code>{}</code> (empty dict)</div><div class="compare-item">\u2022 <code>set()</code> (empty set)</div></div><div class="compare-col"><div class="compare-title">TRUTHY (bool(x) = True)</div><div class="compare-item">\u2022 <code>True</code></div><div class="compare-item">\u2022 Any non-zero number</div><div class="compare-item">\u2022 <code>" "</code> (space \u2014 not empty!)</div><div class="compare-item">\u2022 <code>[0]</code> (list with item)</div><div class="compare-item">\u2022 <code>"False"</code> (string, not bool!)</div><div class="compare-item">\u2022 Any non-empty container</div><div class="compare-item">\u2022 Custom objects (by default)</div><div class="compare-item">\u2022 <code>numpy.nan</code> (surprise!)</div></div></div>'

/* --- Plotly: Truthiness Heatmap --- */
+ '<div id="plot-truthy-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var types=["False","None","0","0.0","\\"\\"","[]","()","{}","True","1","-1","0.001","\" \"","[0]","\\"0\\"","nan"];'
+ 'var vals=[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];'
+ 'var colors=vals.map(function(v){return v?"rgba(78,205,196,0.7)":"rgba(248,113,113,0.7)";});'
+ 'var t1={x:types,y:["bool()"],z:[vals],type:"heatmap",colorscale:[[0,"rgba(248,113,113,0.7)"],[1,"rgba(78,205,196,0.7)"]],showscale:false,text:[types.map(function(t,i){return vals[i]?"TRUTHY":"FALSY";})],texttemplate:"%{text}",textfont:{color:"#fff",size:10}};'
+ 'var layout={title:{text:"Python Truthiness: Which Values Are Falsy vs Truthy?",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{tickangle:-45,tickfont:{size:10}},yaxis:{visible:false},margin:{t:50,r:30,b:80,l:50},height:200};'
+ 'Plotly.newPlot("plot-truthy-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>Red = Falsy, Teal = Truthy.</strong> Note that <code>"0"</code> (string containing zero) and <code>nan</code> are truthy \u2014 common source of bugs!</div></div>'

+ '<p class="l-text"><strong><code>is</code> vs <code>==</code></strong> \u2014 this distinction trips up even experienced developers:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">== (Equality)</div><div class="compare-item">\u2022 Do the values <strong>look the same</strong>?</div><div class="compare-item">\u2022 <code>[1,2] == [1,2]</code> \u2192 <code>True</code></div><div class="compare-item">\u2022 Calls <code>__eq__</code> method</div><div class="compare-item">\u2022 Use for value comparison</div></div><div class="compare-col"><div class="compare-title">is (Identity)</div><div class="compare-item">\u2022 Are they the <strong>exact same object</strong>?</div><div class="compare-item">\u2022 <code>[1,2] is [1,2]</code> \u2192 <code>False</code></div><div class="compare-item">\u2022 Compares <code>id()</code> values</div><div class="compare-item">\u2022 Use ONLY for <code>None</code> checks</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># is vs == \u2014 know when to use each</span>\n'
+ 'a = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]\n'
+ 'b = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]\n'
+ '<span class="fn">print</span>(a == b)    <span class="cm"># True  \u2014 same values</span>\n'
+ '<span class="fn">print</span>(a <span class="kw">is</span> b)    <span class="cm"># False \u2014 different objects</span>\n'
+ '\n'
+ '<span class="cm"># Always use "is" for None checks</span>\n'
+ 'x = <span class="kw">None</span>\n'
+ '<span class="kw">if</span> x <span class="kw">is</span> <span class="kw">None</span>:   <span class="cm"># Correct \u2714</span>\n'
+ '    <span class="fn">print</span>(<span class="str">"x is None"</span>)\n'
+ '<span class="kw">if</span> x == <span class="kw">None</span>:   <span class="cm"># Works but bad practice \u2718</span>\n'
+ '    <span class="fn">print</span>(<span class="str">"x equals None"</span>)\n'
+ '\n'
+ '<span class="cm"># Short-circuit evaluation</span>\n'
+ '<span class="cm"># "and" stops at first False, "or" stops at first True</span>\n'
+ '<span class="fn">print</span>(<span class="kw">True</span> <span class="kw">and</span> <span class="str">"yes"</span>)   <span class="cm"># "yes" \u2014 returns last truthy</span>\n'
+ '<span class="fn">print</span>(<span class="kw">False</span> <span class="kw">and</span> <span class="str">"yes"</span>)  <span class="cm"># False \u2014 stops at first falsy</span>\n'
+ '<span class="fn">print</span>(<span class="str">""</span> <span class="kw">or</span> <span class="str">"default"</span>)  <span class="cm"># "default" \u2014 common pattern!</span>\n'
+ '\n'
+ '<span class="cm"># Chained comparisons (Python-unique!)</span>\n'
+ 'age = <span class="num">25</span>\n'
+ '<span class="fn">print</span>(<span class="num">18</span> <= age < <span class="num">65</span>)  <span class="cm"># True \u2014 reads like math!</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>None \u2014 Python\u2019s null:</strong> <code>None</code> is a singleton object representing "no value" or "not set." Functions without an explicit return statement return <code>None</code>. It is falsy, and you should always check for it with <code>is None</code>, never <code>== None</code>.</p>'

+ '<div class="l-note"><strong>ML Relevance:</strong> Truthiness is heavily used in data cleaning: <code>if not df.empty:</code>, <code>if results:</code>, <code>value = config.get("lr") or 0.001</code>. Understanding short-circuit evaluation helps write concise, safe code. And <code>None</code> is the default for unset optional parameters in every ML library.</div>'

/* ============================================================
   SECTION 6: Type System & Conversions
   ============================================================ */
+ '<h2 class="l-title">6. Type System & Conversions</h2>'

+ '<div class="calc-highlight"><strong>Python is dynamically typed:</strong> Variables do not have fixed types. The same name can point to an int, then a string, then a list. Types belong to <em>objects</em>, not variables. This is the opposite of statically typed languages like Java or C++, where you declare <code>int x</code> and <code>x</code> is forever an integer.</div>'

+ '<p class="l-text"><strong>Dynamic Typing vs Static Typing:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">DYNAMIC (Python, JS)</div><div class="compare-item">\u2022 Types checked at <strong>runtime</strong></div><div class="compare-item">\u2022 No type declarations required</div><div class="compare-item">\u2022 Faster to write, more flexible</div><div class="compare-item">\u2022 Type errors found late (at runtime)</div><div class="compare-item">\u2022 <code>x = 42; x = "hi"</code> \u2014 legal!</div></div><div class="compare-col"><div class="compare-title">STATIC (Java, C++, Rust)</div><div class="compare-item">\u2022 Types checked at <strong>compile time</strong></div><div class="compare-item">\u2022 Must declare types explicitly</div><div class="compare-item">\u2022 More verbose, more safety</div><div class="compare-item">\u2022 Type errors found early (at compile)</div><div class="compare-item">\u2022 <code>int x = 42; x = "hi"</code> \u2014 error!</div></div></div>'

+ '<p class="l-text"><strong>Duck Typing:</strong> "If it walks like a duck and quacks like a duck, it\u2019s a duck." Python does not care what type an object <em>is</em> \u2014 it only cares what the object <em>can do</em>. If an object has a <code>__len__</code> method, you can call <code>len()</code> on it, whether it is a list, string, dict, or your own custom class.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Duck typing in action</span>\n'
+ '<span class="kw">def</span> <span class="fn">get_length</span>(obj):\n'
+ '    <span class="kw">return</span> <span class="fn">len</span>(obj)  <span class="cm"># Works on anything with __len__</span>\n'
+ '\n'
+ '<span class="fn">print</span>(get_length(<span class="str">"hello"</span>))    <span class="cm"># 5 (string)</span>\n'
+ '<span class="fn">print</span>(get_length([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>]))   <span class="cm"># 3 (list)</span>\n'
+ '<span class="fn">print</span>(get_length({<span class="str">"a"</span>:<span class="num">1</span>}))   <span class="cm"># 1 (dict)</span>\n'
+ '\n'
+ '<span class="cm"># Type checking functions</span>\n'
+ 'x = <span class="num">42</span>\n'
+ '<span class="fn">print</span>(<span class="fn">type</span>(x))              <span class="cm"># &lt;class \'int\'&gt;</span>\n'
+ '<span class="fn">print</span>(<span class="fn">isinstance</span>(x, <span class="fn">int</span>))   <span class="cm"># True</span>\n'
+ '<span class="fn">print</span>(<span class="fn">isinstance</span>(x, (<span class="fn">int</span>, <span class="fn">float</span>)))  <span class="cm"># True (check multiple types)</span>'
+ '</pre></div>'

/* --- Plotly: Type Hierarchy Tree --- */
+ '<div id="plot-types-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var labels=["object","NoneType","bool","int","float","complex","str","bytes","list","tuple","dict","set","frozenset"];'
+ 'var parents=["","object","int","object","object","object","object","object","object","object","object","object","object"];'
+ 'var vals=[13,1,1,1,1,1,1,1,1,1,1,1,1];'
+ 'var colors=["rgba(200,169,110,0.3)","rgba(248,113,113,0.5)","rgba(78,205,196,0.5)","rgba(78,205,196,0.5)","rgba(78,205,196,0.5)","rgba(78,205,196,0.5)","rgba(130,170,255,0.5)","rgba(130,170,255,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)"];'
+ 'var t1={type:"treemap",labels:labels,parents:parents,values:vals,marker:{colors:colors,line:{width:1,color:"rgba(255,255,255,0.15)"}},textfont:{color:"#ebe6dc",size:13},textposition:"middle center"};'
+ 'var layout={title:{text:"Python Built-in Type Hierarchy (Everything Inherits from object)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},margin:{t:50,r:10,b:10,l:10},height:320};'
+ 'Plotly.newPlot("plot-types-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},300)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>Every type in Python inherits from <code>object</code>.</strong> Note that <code>bool</code> is a subclass of <code>int</code> \u2014 <code>True + True = 2</code> is valid Python! Teal = numeric types, blue = sequence/bytes, gold = containers.</div></div>'

+ '<p class="l-text"><strong>Type Conversions:</strong> Python is strongly typed \u2014 it does NOT implicitly convert types (unlike JavaScript where <code>"5" + 3 = "53"</code>). You must convert explicitly:</p>'

+ '<div class="calc-steps">'
+ '<div class="step-item"><div class="step-num">1</div><div class="step-content"><code>int("42")</code> \u2192 <code>42</code>. String to integer. Raises <code>ValueError</code> if the string is not a valid integer.</div></div>'
+ '<div class="step-item"><div class="step-num">2</div><div class="step-content"><code>float("3.14")</code> \u2192 <code>3.14</code>. String to float. Also handles <code>"inf"</code>, <code>"nan"</code>, and scientific notation <code>"1e-5"</code>.</div></div>'
+ '<div class="step-item"><div class="step-num">3</div><div class="step-content"><code>str(42)</code> \u2192 <code>"42"</code>. Any object to string. Calls the object\u2019s <code>__str__</code> method.</div></div>'
+ '<div class="step-item"><div class="step-num">4</div><div class="step-content"><code>list("abc")</code> \u2192 <code>["a", "b", "c"]</code>. Any iterable to list. Works on strings, tuples, sets, generators.</div></div>'
+ '<div class="step-item"><div class="step-num">5</div><div class="step-content"><code>bool(0)</code> \u2192 <code>False</code>. Any object to boolean. Follows the truthiness rules from Section 5.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Type conversions</span>\n'
+ '<span class="fn">print</span>(<span class="fn">int</span>(<span class="str">"42"</span>))           <span class="cm"># 42</span>\n'
+ '<span class="fn">print</span>(<span class="fn">int</span>(<span class="num">3.99</span>))           <span class="cm"># 3 (truncates, does NOT round)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">float</span>(<span class="str">"1e-5"</span>))       <span class="cm"># 1e-05 (scientific notation)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">str</span>(<span class="num">3.14</span>))           <span class="cm"># "3.14"</span>\n'
+ '<span class="fn">print</span>(<span class="fn">list</span>(<span class="str">"Python"</span>))      <span class="cm"># [\'P\', \'y\', \'t\', \'h\', \'o\', \'n\']</span>\n'
+ '<span class="fn">print</span>(<span class="fn">bool</span>(<span class="str">""</span>))            <span class="cm"># False</span>\n'
+ '<span class="fn">print</span>(<span class="fn">bool</span>(<span class="str">"0"</span>))           <span class="cm"># True (non-empty string!)</span>\n'
+ '\n'
+ '<span class="cm"># Common gotcha: int() truncates, round() rounds</span>\n'
+ '<span class="fn">print</span>(<span class="fn">int</span>(<span class="num">3.7</span>))     <span class="cm"># 3 (truncated toward zero)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">round</span>(<span class="num">3.7</span>))   <span class="cm"># 4 (proper rounding)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">round</span>(<span class="num">2.5</span>))   <span class="cm"># 2 (banker\'s rounding!)</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>Type Annotations (PEP 484):</strong> Since Python 3.5, you can add <em>optional</em> type hints. They do NOT change runtime behavior \u2014 Python still ignores them during execution. But tools like <code>mypy</code> use them for static analysis, and they serve as documentation:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Type annotations: hints for humans and tools</span>\n'
+ '<span class="kw">def</span> <span class="fn">compute_loss</span>(predictions: <span class="fn">list</span>[<span class="fn">float</span>],\n'
+ '                 targets: <span class="fn">list</span>[<span class="fn">float</span>]) -> <span class="fn">float</span>:\n'
+ '    <span class="str">"""Compute mean squared error."""</span>\n'
+ '    n: <span class="fn">int</span> = <span class="fn">len</span>(predictions)\n'
+ '    total: <span class="fn">float</span> = <span class="fn">sum</span>(\n'
+ '        (p - t) ** <span class="num">2</span> <span class="kw">for</span> p, t <span class="kw">in</span> <span class="fn">zip</span>(predictions, targets)\n'
+ '    )\n'
+ '    <span class="kw">return</span> total / n\n'
+ '\n'
+ '<span class="cm"># Type annotations do NOT enforce types at runtime!</span>\n'
+ 'result = compute_loss([<span class="num">1.0</span>, <span class="num">2.0</span>], [<span class="num">1.5</span>, <span class="num">2.5</span>])  <span class="cm"># Works fine</span>\n'
+ 'result = compute_loss(<span class="str">"hello"</span>, <span class="str">"world"</span>)      <span class="cm"># Also "works" at runtime (until it crashes)</span>'
+ '</pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If type annotations don\u2019t change runtime behavior, why use them? Three reasons: (1) They act as <strong>living documentation</strong> that stays in sync with the code. (2) Static analyzers like <code>mypy</code> catch type bugs before runtime. (3) IDEs use them for better autocomplete and error highlighting. In large ML codebases, they prevent entire categories of bugs.</div></div>'

/* --- Plotly: Type Conversion Flow --- */
+ '<div id="plot-conv-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var t1={type:"sankey",orientation:"h",node:{pad:15,thickness:20,line:{color:"rgba(255,255,255,0.2)",width:0.5},label:["str","int","float","bool","list","tuple","bytes"],color:["rgba(130,170,255,0.6)","rgba(78,205,196,0.6)","rgba(78,205,196,0.6)","rgba(78,205,196,0.6)","rgba(200,169,110,0.6)","rgba(200,169,110,0.6)","rgba(130,170,255,0.6)"]},link:{source:[0,0,0,0,1,1,1,2,2,3,4,5],target:[1,2,4,6,0,2,3,0,1,0,5,4],value:[3,3,2,1,3,3,2,3,2,2,2,2],color:["rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)"]}};'
+ 'var layout={title:{text:"Type Conversion Flows Between Python Built-in Types",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},margin:{t:50,r:30,b:30,l:30},height:300};'
+ 'Plotly.newPlot("plot-conv-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},400)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>Conversion flows between built-in types.</strong> Thicker connections indicate more common conversions. str \u2194 int/float are the most frequent in data processing. Note that not all conversions are safe \u2014 <code>int("hello")</code> raises ValueError.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Reading and converting CSV data manually</strong><br><br>Suppose a CSV row contains: <code>"Alice,25,3.85,True"</code><br><br><code>row = "Alice,25,3.85,True"</code><br><code>parts = row.split(",")</code><br><code># [\'Alice\', \'25\', \'3.85\', \'True\'] \u2014 all strings!</code><br><br><code>name = parts[0]</code> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code># str</code><br><code>age = int(parts[1])</code> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code># 25 (int)</code><br><code>gpa = float(parts[2])</code> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code># 3.85 (float)</code><br><code>active = parts[3] == "True"</code> &nbsp;<code># True (bool)</code><br><br>This is exactly what <code>pandas.read_csv()</code> does under the hood, but with automatic type inference for thousands of columns.</div></div>'

+ '<div class="l-note"><strong>Summary of Section 6:</strong> Python\u2019s type system is <strong>dynamic</strong> (types checked at runtime), <strong>strong</strong> (no implicit conversions), and uses <strong>duck typing</strong> (behavior matters, not type labels). Type annotations are optional but highly recommended for ML projects. Always validate and convert data types when loading external data.</div>'

/* ============================================================
   Summary & Next Lesson
   ============================================================ */
+ '<h2 class="l-title">Summary & What\u2019s Next</h2>'

+ '<p class="l-text">This lesson covered the foundations you will use in <strong>every</strong> Python program you write. Here is the complete concept map:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Python Setup</div><div class="card-body">Python 3.12+, pip, venv, VS Code. Always use virtual environments. REPL for exploration, scripts for production.</div></div>'
+ '<div class="calc-card"><div class="card-title">Memory Model</div><div class="card-body">Variables are name tags pointing to objects. id() shows memory address. Mutable vs immutable determines aliasing behavior.</div></div>'
+ '<div class="calc-card"><div class="card-title">Numeric Types</div><div class="card-body">int (arbitrary precision), float (IEEE 754, imprecise!), complex, Decimal. Know your operators: /, //, %, **.</div></div>'
+ '<div class="calc-card"><div class="card-title">Strings</div><div class="card-body">Immutable Unicode sequences. F-strings for formatting. split/join for NLP. UTF-8 encoding. Always specify encoding.</div></div>'
+ '<div class="calc-card"><div class="card-title">Boolean & None</div><div class="card-body">Truthiness: empty/zero = False. Use "is" for None. Short-circuit and/or. Chained comparisons.</div></div>'
+ '<div class="calc-card"><div class="card-title">Type System</div><div class="card-body">Dynamic + strong + duck typing. Explicit conversions: int(), float(), str(). Type annotations for documentation and static analysis.</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Next Lesson:</strong> In Lesson 2, we dive into <strong>Data Structures</strong> \u2014 lists, tuples, dictionaries, and sets. These are the containers you will use to organize data before it enters your ML pipeline. We will cover comprehensions, nested structures, and performance characteristics that determine which structure to use when.</div>'

,

/* ============================================================
   ============================================================
   TURKISH TRANSLATION
   ============================================================
   ============================================================ */

tr: '<p class="l-text"><strong>Python, modern veri bilimi, makine \u00f6\u011frenimi ve NLP\'nin ortak dilidir.</strong> Karma\u015f\u0131k algoritmalara ve sinir a\u011f\u0131 mimarilerine dalmadan \u00f6nce, dilin kendisinde sa\u011flam bir temele ihtiyac\u0131n\u0131z var. Bu ders, Python kurulumundan bellek modeline, tip sistemine ve temel veri tiplerine kadar her \u015feyi kapsar \u2014 her ML m\u00fchendisinin g\u00fcnl\u00fck kulland\u0131\u011f\u0131 yap\u0131 ta\u015flar\u0131.</p>'

+ '<p class="l-text">Bu dersin sonunda Python\'un nesneleri bellekte nas\u0131l y\u00f6netti\u011fini, neden <code>0.1 + 0.2 != 0.3</code> oldu\u011funu, stringlerin nas\u0131l kodland\u0131\u011f\u0131n\u0131 ve "duck typing"in ger\u00e7ekte ne anlama geldi\u011fini anlayacaks\u0131n\u0131z. Bunlar akademik meraklar de\u011fil \u2014 veri hatlar\u0131 ve model e\u011fitim kodunda ger\u00e7ek hatalar\u0131 \u00f6nleyen pratik bilgilerdir.</p>'
+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Python 3.12+ kur, sanal ortam ayarla ve pip ile paket yönet</li><li>Temel veri türlerini kullan: int, float, str, bool, list, tuple, dict ve set</li><li>Python nesne modelini ve her şeyin neden bir referans olduğunu açıkla</li><li>Mutability\'nin fonksiyon argümanlarını ve aliasing\'i nasıl etkilediğini tahmin et</li><li>0.1 + 0.2 != 0.3\'ü çöz ve floating point\'i güvenle işle</li></ul></div>'


/* ============================================================
   B\u00d6L\u00dcM 1: Neden Python & Kurulum
   ============================================================ */
+ '<h2 class="l-title">1. Neden Python & Kurulum</h2>'

+ '<div class="calc-highlight"><strong>Neden ML i\u00e7in Python?</strong> Python makine \u00f6\u011frenmesine \u00fc\u00e7 nedenle h\u00e2kimdir: (1) devasa bilimsel k\u00fct\u00fcphane ekosistemi, (2) ara\u015ft\u0131rmac\u0131lar\u0131n dil mekani\u011fi yerine algoritmalara odaklanmas\u0131n\u0131 sa\u011flayan okunabilir s\u00f6zdizimi ve (3) Python yorumlanmas\u0131na ra\u011fmen y\u00fcksek performans sunan C/C++ arka u\u00e7lar\u0131 (NumPy, PyTorch). Kodlu ML makalelerinin %90\'\u0131ndan fazlas\u0131 Python kullan\u0131r.</div>'

+ '<p class="l-text"><strong>ML/NLP i\u00e7in Python Ekosistemi</strong> \u2014 Python tek ba\u015f\u0131na genel ama\u00e7l\u0131 bir dildir. G\u00fcc\u00fc, ola\u011fan\u00fcst\u00fc uzmanla\u015fm\u0131\u015f k\u00fct\u00fcphane ekosisteminden gelir:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">NumPy</div><div class="card-body">N-boyutlu diziler, vekt\u00f6rize matematik, do\u011frusal cebir. Her \u015feyin \u00fczerine in\u015fa edildi\u011fi temel. H\u0131z i\u00e7in C ile yaz\u0131lm\u0131\u015ft\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">Pandas</div><div class="card-body">Tablo verileri i\u00e7in DataFrame\'ler. CSV/JSON y\u00fckleme, filtreleme, gruplama, birle\u015ftirme \u2014 veri \u00f6n i\u015fleme i\u00e7in gerekli.</div></div>'
+ '<div class="calc-card"><div class="card-title">scikit-learn</div><div class="card-body">Klasik ML: regresyon, s\u0131n\u0131fland\u0131rma, k\u00fcmeleme, \u00f6n i\u015fleme, de\u011ferlendirme metrikleri. ML\'nin \u0130svi\u00e7re \u00e7ak\u0131s\u0131.</div></div>'
+ '<div class="calc-card"><div class="card-title">PyTorch</div><div class="card-body">Derin \u00f6\u011frenme \u00e7er\u00e7evesi. Tens\u00f6rler, otomatik t\u00fcrev, GPU deste\u011fi. \u00c7o\u011fu NLP ara\u015ft\u0131rmac\u0131s\u0131 taraf\u0131ndan kullan\u0131l\u0131r (BERT, GPT vb.).</div></div>'
+ '<div class="calc-card"><div class="card-title">HuggingFace</div><div class="card-body">\u00d6nceden e\u011fitilmi\u015f transformer\'lar, tokenizer\'lar, veri setleri. 10 sat\u0131r kodla BERT\'i duygu analizi i\u00e7in ince ayarlay\u0131n.</div></div>'
+ '<div class="calc-card"><div class="card-title">Matplotlib / Plotly</div><div class="card-body">G\u00f6rselle\u015ftirme. Basit \u00e7izgi grafiklerinden etkile\u015fimli 3B y\u00fczeylere. EDA ve sonu\u00e7 sunumu i\u00e7in gerekli.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Python 3.12+ Kurulumu:</strong> Her zaman en son kararl\u0131 s\u00fcr\u00fcm\u00fc kullan\u0131n. Python 3.12, \u00f6nemli performans iyile\u015ftirmeleri (%10\u201315 daha h\u0131zl\u0131) ve daha iyi hata mesajlar\u0131 getirdi.</p>'

+ '<div class="calc-steps">'
+ '<div class="step-item"><div class="step-num">1</div><div class="step-content"><strong>Python\'u indirin</strong> \u2014 <code>python.org/downloads</code> adresinden. Windows\'ta kurulum s\u0131ras\u0131nda "Add Python to PATH" se\u00e7ene\u011fini i\u015faretleyin. macOS/Linux\'ta paket y\u00f6neticinizi veya pyenv\'i kullan\u0131n.</div></div>'
+ '<div class="step-item"><div class="step-num">2</div><div class="step-content"><strong>Kurulumu do\u011frulay\u0131n:</strong> Terminali a\u00e7\u0131n ve <code>python --version</code> \u00e7al\u0131\u015ft\u0131r\u0131n. <code>Python 3.12.x</code> g\u00f6rmelisiniz.</div></div>'
+ '<div class="step-item"><div class="step-num">3</div><div class="step-content"><strong>Sanal ortam olu\u015fturun:</strong> <code>python -m venv myenv</code>. Bu, proje ba\u011f\u0131ml\u0131l\u0131klar\u0131n\u0131z\u0131 izole eder. <code>source myenv/bin/activate</code> (Linux/Mac) veya <code>myenv\\Scripts\\activate</code> (Windows) ile etkinle\u015ftirin.</div></div>'
+ '<div class="step-item"><div class="step-num">4</div><div class="step-content"><strong>VS Code kurun</strong> + Python eklentisi. Yorumlay\u0131c\u0131y\u0131 venv\'inize ayarlay\u0131n. Bu size IntelliSense, hata ay\u0131klama ve entegre terminal sa\u011flar.</div></div>'
+ '<div class="step-item"><div class="step-num">5</div><div class="step-content"><strong>Temel paketleri kurun:</strong> <code>pip install numpy pandas matplotlib scikit-learn torch</code>. Bunlar her ML projesinin yap\u0131 ta\u015flar\u0131d\u0131r.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>REPL vs Script Modu:</strong> Python\'un iki \u00e7al\u0131\u015ft\u0131rma modu vard\u0131r. <strong>REPL</strong> (Oku-De\u011ferlendir-Yazd\u0131r D\u00f6ng\u00fcs\u00fc) etkile\u015fimlidir \u2014 bir sat\u0131r yaz\u0131n, sonucu hemen g\u00f6r\u00fcn. Terminalinizde <code>python</code> yazarak ba\u015flat\u0131n. <strong>Script modu</strong> bir <code>.py</code> dosyas\u0131n\u0131 ba\u015ftan sona \u00e7al\u0131\u015ft\u0131r\u0131r. Ke\u015fif i\u00e7in REPL, \u00fcretim kodu i\u00e7in script kullan\u0131n.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># \u0130lk Python scripti: hello.py</span>\n'
+ '<span class="kw">import</span> sys\n'
+ '\n'
+ '<span class="fn">print</span>(<span class="str">f"Merhaba Python {sys.version}"</span>)\n'
+ '<span class="fn">print</span>(<span class="str">f"\u00c7al\u0131\u015ft\u0131r\u0131labilir: {sys.executable}"</span>)\n'
+ '\n'
+ '<span class="cm"># \u00c7al\u0131\u015ft\u0131r: python hello.py</span>\n'
+ '<span class="cm"># REPL\'de her sat\u0131r hemen \u00e7al\u0131\u015f\u0131r</span>\n'
+ '<span class="cm"># Scriptlerde kod yukar\u0131dan a\u015fa\u011f\u0131 \u00e7al\u0131\u015f\u0131r</span>'
+ '</pre></div>'

+ '<div class="l-note"><strong>Neden Sanal Ortamlar \u00d6nemli:</strong> Venv olmadan t\u00fcm paketler global olarak kurulur. A projesi PyTorch 1.13\'e ihtiyac\u0131 var, B projesi PyTorch 2.0\'a \u2014 \u00e7at\u0131\u015fma! Venv\'ler her projeye kendi paketleriyle kendi izole Python\'unu verir. <strong>Her zaman venv kullan\u0131n.</strong></div>'

/* ============================================================
   B\u00d6L\u00dcM 2: De\u011fi\u015fkenler & Bellek Modeli
   ============================================================ */
+ '<h2 class="l-title">2. De\u011fi\u015fkenler & Bellek Modeli</h2>'

+ '<div class="calc-highlight"><strong>Temel Kavray\u0131\u015f:</strong> Python\'da de\u011fi\u015fkenler <em>de\u011fer tutan kutular de\u011fildir</em>. Nesnelere ba\u011fl\u0131 <em>etiketlerdir</em> (isim etiketleri). <code>x = 42</code> yazd\u0131\u011f\u0131n\u0131zda Python bellekte <code>42</code> tam say\u0131 nesnesi olu\u015fturur ve <code>x</code> ismi ona i\u015faret eder. Bu, C\'deki <code>int x = 42</code>\'den temelden farkl\u0131d\u0131r; orada bir kutu ayr\u0131l\u0131r ve 42 i\u00e7ine konur.</div>'

+ '<p class="l-text">Python\'un bellek modelini anlamak, \u00f6zellikle listeler ve DataFrame\'ler gibi de\u011fi\u015ftirilebilir nesnelerle \u00e7al\u0131\u015f\u0131rken, t\u00fcm bir hata s\u0131n\u0131f\u0131n\u0131 \u00f6nler.</p>'

/* --- SVG: De\u011fi\u015fken-Nesne-De\u011fer Diyagram\u0131 --- */
+ '<div class="calc-graph"><div class="cg-title">Python Bellek Modeli: \u0130simler \u2192 Nesneler</div>'
+ '<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg">'
+ '<rect x="30" y="30" width="80" height="36" rx="6" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="1.5"/>'
+ '<text x="70" y="53" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">x</text>'
+ '<rect x="30" y="90" width="80" height="36" rx="6" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="1.5"/>'
+ '<text x="70" y="113" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">y</text>'
+ '<rect x="30" y="160" width="80" height="36" rx="6" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="1.5"/>'
+ '<text x="70" y="183" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">z</text>'
+ '<line x1="110" y1="48" x2="230" y2="48" stroke="#c8a96e" stroke-width="1.5" marker-end="url(#arrowPyTr)"/>'
+ '<line x1="110" y1="108" x2="230" y2="48" stroke="#c8a96e" stroke-width="1.5" marker-end="url(#arrowPyTr)"/>'
+ '<line x1="110" y1="178" x2="230" y2="168" stroke="#c8a96e" stroke-width="1.5" marker-end="url(#arrowPyTr)"/>'
+ '<defs><marker id="arrowPyTr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#c8a96e"/></marker></defs>'
+ '<rect x="230" y="22" width="160" height="52" rx="8" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" stroke-width="1.8"/>'
+ '<text x="310" y="42" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="9" text-anchor="middle">int nesnesi @ 0x7f3a</text>'
+ '<text x="310" y="62" fill="#e0e0e0" font-family="monospace" font-size="16" text-anchor="middle">42</text>'
+ '<rect x="230" y="142" width="160" height="52" rx="8" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" stroke-width="1.8"/>'
+ '<text x="310" y="162" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="9" text-anchor="middle">list nesnesi @ 0x7f3b</text>'
+ '<text x="310" y="182" fill="#e0e0e0" font-family="monospace" font-size="16" text-anchor="middle">[1, 2, 3]</text>'
+ '<text x="70" y="15" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10" text-anchor="middle">\u0130S\u0130MLER (de\u011fi\u015fkenler)</text>'
+ '<text x="310" y="10" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10" text-anchor="middle">NESNELER (bellekte)</text>'
+ '<text x="480" y="42" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="9" text-anchor="start">x ve y AYNI nesneye</text>'
+ '<text x="480" y="55" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="9" text-anchor="start">i\u015faret ediyor!</text>'
+ '</svg>'
+ '<div class="cg-caption">x = 42; y = x \u2014 her iki isim de ayn\u0131 int nesnesine i\u015faret eder. z = [1,2,3] ayr\u0131 bir list nesnesine i\u015faret eder. \u0130simler referanst\u0131r, kap de\u011fil.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Python bellek modelini ke\u015ffetme</span>\n'
+ 'x = <span class="num">42</span>\n'
+ 'y = x\n'
+ '\n'
+ '<span class="fn">print</span>(<span class="fn">id</span>(x))   <span class="cm"># \u00f6rn: 140234866221232</span>\n'
+ '<span class="fn">print</span>(<span class="fn">id</span>(y))   <span class="cm"># Ayn\u0131! Her ikisi de ayn\u0131 nesneye referans</span>\n'
+ '<span class="fn">print</span>(x <span class="kw">is</span> y)  <span class="cm"># True \u2014 bellekte ayn\u0131 nesne</span>\n'
+ '\n'
+ '<span class="cm"># \u015eimdi x\'i yeniden ata</span>\n'
+ 'x = <span class="num">99</span>\n'
+ '<span class="fn">print</span>(y)        <span class="cm"># Hala 42! Tam say\u0131lar de\u011fi\u015fmezdir.</span>\n'
+ '<span class="fn">print</span>(x <span class="kw">is</span> y)  <span class="cm"># False \u2014 x art\u0131k yeni bir nesneye i\u015faret ediyor</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>De\u011fi\u015ftirilebilir (Mutable) vs De\u011fi\u015ftirilemez (Immutable) \u2014 kritik ayr\u0131m:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">DE\u011e\u0130\u015eT\u0130R\u0130LEMEZ</div><div class="compare-item">\u2022 <code>int</code>, <code>float</code>, <code>str</code>, <code>tuple</code>, <code>frozenset</code>, <code>bool</code></div><div class="compare-item">\u2022 Yeniden atama <strong>yeni</strong> nesne olu\u015fturur</div><div class="compare-item">\u2022 Referanslar\u0131 payla\u015fmak g\u00fcvenli</div><div class="compare-item">\u2022 Dict anahtar\u0131 olarak kullan\u0131labilir</div></div><div class="compare-col"><div class="compare-title">DE\u011e\u0130\u015eT\u0130R\u0130LEB\u0130L\u0130R</div><div class="compare-item">\u2022 <code>list</code>, <code>dict</code>, <code>set</code>, <code>bytearray</code></div><div class="compare-item">\u2022 De\u011fi\u015ftirme <strong>ayn\u0131</strong> nesneyi g\u00fcnceller</div><div class="compare-item">\u2022 Payla\u015f\u0131lan referanslar = payla\u015f\u0131lan mutasyonlar!</div><div class="compare-item">\u2022 Dict anahtar\u0131 olarak kullan\u0131lamaz</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># De\u011fi\u015ftirilebilir tuza\u011f\u0131 \u2014 Python\'un en yayg\u0131n hatalar\u0131ndan biri</span>\n'
+ 'a = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]\n'
+ 'b = a               <span class="cm"># b AYNI listeye i\u015faret ediyor</span>\n'
+ 'b.append(<span class="num">4</span>)\n'
+ '<span class="fn">print</span>(a)            <span class="cm"># [1, 2, 3, 4] \u2014 a da de\u011fi\u015fti!</span>\n'
+ '\n'
+ '<span class="cm"># \u00c7\u00f6z\u00fcm: kopya olu\u015fturun</span>\n'
+ 'c = a.copy()        <span class="cm"># veya a[:] veya list(a)</span>\n'
+ 'c.append(<span class="num">5</span>)\n'
+ '<span class="fn">print</span>(a)            <span class="cm"># [1, 2, 3, 4] \u2014 a de\u011fi\u015fmedi</span>\n'
+ '<span class="fn">print</span>(c)            <span class="cm"># [1, 2, 3, 4, 5]</span>'
+ '</pre></div>'

+ '<div class="think-box"><div class="think-label">D\u00dc\u015e\u00dcN\u00dcN</div><div class="think-body">Python neden de\u011ferleri kopyalamak yerine referans semantiklerini kullan\u0131r? <strong>Performans.</strong> 1GB\'l\u0131k bir DataFrame\'i bir fonksiyona ge\u00e7irdi\u011finizde Python 1GB veri kopyalamaz \u2014 sadece referans\u0131 (bir i\u015faret\u00e7i) ge\u00e7irir. Bu y\u00fczden Python, yorumlanm\u0131\u015f bir dil olmas\u0131na ra\u011fmen b\u00fcy\u00fck veri k\u00fcmelerini verimli \u015fekilde i\u015fleyebilir.</div></div>'

+ '<div class="l-note"><strong>ML \u0130li\u015fkisi:</strong> Bu referans modeli, Pandas\'ta <code>df2 = df</code>\'in kopya de\u011fil g\u00f6r\u00fcn\u00fcm (view) olu\u015fturmas\u0131n\u0131n nedenidir. <code>df2</code>\'yi de\u011fi\u015ftirmek <code>df</code>\'yi de\u011fi\u015ftirir. \u00d6n i\u015fleme hatt\u0131n\u0131zdaki ince veri bozulma hatalar\u0131n\u0131 \u00f6nlemek i\u00e7in <code>df.copy()</code> kullan\u0131n.</div>'

/* ============================================================
   B\u00d6L\u00dcM 3: Say\u0131sal Tipler
   ============================================================ */
+ '<h2 class="l-title">3. Say\u0131sal Tipler</h2>'

+ '<p class="l-text">Python, her biri bilimsel hesaplama i\u00e7in farkl\u0131 \u00f6zelliklere sahip d\u00f6rt yerle\u015fik say\u0131sal tip sunar:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">int</div><div class="card-body"><strong>Keyfi hassasiyet</strong> tam say\u0131lar. Ta\u015fma yok! Python binlerce basamakl\u0131 say\u0131lar\u0131 sorunsuz i\u015fler. 2**1000 \u00e7al\u0131\u015f\u0131r. Dahili olarak 30-bit basamak dizileri kullan\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">float</div><div class="card-body"><strong>IEEE 754 \u00e7ift hassasiyet</strong> (64-bit). 15\u201317 anlaml\u0131 basamak. H\u0131zl\u0131 ama kesin de\u011fil \u2014 0.1 + 0.2 \u2260 0.3. Bilimsel hesaplamada varsay\u0131lan tip.</div></div>'
+ '<div class="calc-card"><div class="card-title">complex</div><div class="card-body"><strong>Karma\u015f\u0131k say\u0131lar:</strong> <code>3+4j</code>. Reel ve sanal k\u0131s\u0131mlar float\'t\u0131r. Sinyal i\u015fleme, Fourier d\u00f6n\u00fc\u015f\u00fcmlerinde kullan\u0131l\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">Decimal</div><div class="card-body"><strong>Tam ondal\u0131k aritmetik.</strong> <code>decimal</code> mod\u00fcl\u00fcnden. Daha yava\u015f ama kesin. Finansta kullan\u0131l\u0131r. ML\'de yayg\u0131n de\u011fil.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">AR\u0130TMET\u0130K OPERAT\u00d6RLER</div><div class="formula-main">+  \u2212  *  /  //  %  **</div><div class="formula-sub"><code>/</code> = ger\u00e7ek b\u00f6lme (her zaman float), <code>//</code> = taban b\u00f6lme (a\u015fa\u011f\u0131 yuvarlar), <code>%</code> = mod\u00fclo (kalan), <code>**</code> = \u00fcs. \u00d6rnek: <code>7 // 2 = 3</code>, <code>7 % 2 = 1</code>, <code>2 ** 10 = 1024</code>.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Tam say\u0131: keyfi hassasiyet (ta\u015fma yok!)</span>\n'
+ 'big = <span class="num">2</span> ** <span class="num">1000</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(<span class="fn">str</span>(big)))  <span class="cm"># 302 basamak!</span>\n'
+ '\n'
+ '<span class="cm"># Float: IEEE 754 hassasiyet sorunlar\u0131</span>\n'
+ '<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span>)         <span class="cm"># 0.30000000000000004</span>\n'
+ '<span class="fn">print</span>(<span class="num">0.1</span> + <span class="num">0.2</span> == <span class="num">0.3</span>)  <span class="cm"># False!</span>\n'
+ '\n'
+ '<span class="cm"># Float kar\u015f\u0131la\u015ft\u0131rman\u0131n do\u011fru yolu</span>\n'
+ '<span class="kw">import</span> math\n'
+ '<span class="fn">print</span>(math.isclose(<span class="num">0.1</span> + <span class="num">0.2</span>, <span class="num">0.3</span>))  <span class="cm"># True</span>\n'
+ '\n'
+ '<span class="cm"># B\u00f6lme operat\u00f6rleri</span>\n'
+ '<span class="fn">print</span>(<span class="num">7</span> / <span class="num">2</span>)   <span class="cm"># 3.5  (ger\u00e7ek b\u00f6lme)</span>\n'
+ '<span class="fn">print</span>(<span class="num">7</span> // <span class="num">2</span>)  <span class="cm"># 3    (taban b\u00f6lme)</span>\n'
+ '<span class="fn">print</span>(<span class="num">7</span> % <span class="num">2</span>)   <span class="cm"># 1    (mod\u00fclo / kalan)</span>\n'
+ '\n'
+ '<span class="cm"># Karma\u015f\u0131k say\u0131lar</span>\n'
+ 'z = <span class="num">3</span> + <span class="num">4j</span>\n'
+ '<span class="fn">print</span>(z.real, z.imag)     <span class="cm"># 3.0 4.0</span>\n'
+ '<span class="fn">print</span>(<span class="fn">abs</span>(z))              <span class="cm"># 5.0 (b\u00fcy\u00fckl\u00fck)</span>'
+ '</pre></div>'

/* --- Plotly: Float Hassasiyet G\u00f6rselle\u015ftirmesi --- */
+ '<div id="plot-float-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sumErrs=[];var s2=0;for(var i=0;i<20;i++){s2+=0.1;sumErrs.push(Math.abs(s2-(i+1)*0.1));}'
+ 'var t1={x:Array.from({length:20},function(_,i){return i+1}),y:sumErrs,mode:"lines+markers",name:"0.1 eklerken k\u00fcm\u00fclatif hata",line:{color:"#f87171",width:2},marker:{size:5,color:"#f87171"}};'
+ 'var layout={title:{text:"Float Hassasiyeti: 0.1 Tekrar Eklerken Hata Birikir",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"Toplama say\u0131s\u0131",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},yaxis:{title:"Mutlak hata",gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",tickformat:".2e"},margin:{t:50,r:30,b:50,l:70},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-float-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>Bu grafik neyi g\u00f6steriyor:</strong> Her 0.1 ekledi\u011finizde, 0.1 ikili say\u0131 sisteminde tam olarak temsil edilemedi\u011fi i\u00e7in k\u00fc\u00e7\u00fck bir hata birikir. 20 toplamadan sonra hata \u00f6l\u00e7\u00fclebilir d\u00fczeydedir. ML\'de float32\'yi dikkatli kullanmam\u0131z\u0131n ve girdileri normalle\u015ftirmemizin nedeni budur \u2014 biriken hassasiyet hatalar\u0131 gradyanlar\u0131 bozabilir.</div></div>'

+ '<div class="calc-highlight"><strong>Neden 0.1 tam olarak saklanam\u0131yor?</strong> Bilgisayarlar ikili sistem (taban 2) kullan\u0131r. Ondal\u0131k sistemde 1/3 = 0.333... sonsuz tekrar etti\u011fi gibi, ikili sistemde 1/10 = 0.0001100110011... sonsuz tekrar eder. IEEE 754, 53 bitten sonra keser ve k\u00fc\u00e7\u00fck bir hata olu\u015fur. Bu bir Python hatas\u0131 de\u011fil \u2014 donan\u0131m float kullanan t\u00fcm dilleri etkiler (C, Java, JavaScript vb.).</div>'

+ '<div class="think-box"><div class="think-label">D\u00dc\u015e\u00dcN\u00dcN</div><div class="think-body">Float\'lar kesin de\u011filse ML neden hala bunlar\u0131 kullan\u0131yor? \u00c7\u00fcnk\u00fc <strong>yakla\u015f\u0131k aritmetik h\u0131zl\u0131d\u0131r</strong>. GPU\'lar saniyede trilyonlarca float i\u015flemi yapabilir. K\u00fc\u00e7\u00fck hatalar (\u223c10\u207b\u00b9\u2076) ger\u00e7ek verideki g\u00fcr\u00fclt\u00fcden \u00e7ok daha k\u00fc\u00e7\u00fckt\u00fcr. Modern ML, verimi ikiye katlamak i\u00e7in float16 (yar\u0131m hassasiyet) bile kullan\u0131r \u2014 h\u0131z i\u00e7in hassasiyetten fera gat eder.</div></div>'

/* ============================================================
   B\u00d6L\u00dcM 4: Stringler Derinlemesine
   ============================================================ */
+ '<h2 class="l-title">4. Stringler Derinlemesine</h2>'

+ '<p class="l-text">Stringler <strong>de\u011fi\u015ftirilemez Unicode karakter dizileridir</strong>. NLP\'de metin ham verinizdir \u2014 string i\u015flemlerini anlamak, matris matema\u011fi kadar \u00f6nemlidir. Python 3, Python 2\'ye g\u00f6re kritik bir iyile\u015ftirme yapt\u0131: t\u00fcm stringler varsay\u0131lan olarak Unicode\'dur (UTF-8 kaynak kodlamas\u0131).</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Normal Stringler</div><div class="card-body"><code>"merhaba"</code> veya <code>\'merhaba\'</code>. Tek ve \u00e7ift t\u0131rnak birbirinin yerine kullan\u0131labilir. Ka\u00e7\u0131\u015f karakterinden ka\u00e7\u0131nmak i\u00e7in birini di\u011ferinin i\u00e7inde kullan\u0131n.</div></div>'
+ '<div class="calc-card"><div class="card-title">F-Stringler</div><div class="card-body"><code>f"Skor: {accuracy:.2%}"</code>. \u0130fadeleri do\u011frudan g\u00f6m\u00fcn. Python 3.6\'dan beri stringleri bi\u00e7imlendirmenin en Pythonic yolu.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ham Stringler</div><div class="card-body"><code>r"C:\\Users"</code> \u2014 ters e\u011fik \u00e7izgiler ka\u00e7\u0131\u015f de\u011fil, kelimesi kelimesine. Regex desenleri ve Windows yollar\u0131 i\u00e7in gerekli.</div></div>'
+ '<div class="calc-card"><div class="card-title">\u00dc\u00e7l\u00fc T\u0131rnak</div><div class="card-body"><code>"""cok\\nsatirli"""</code>. Birden fazla sat\u0131ra yay\u0131l\u0131r. Docstring\'ler, SQL sorgular\u0131 ve uzun metin bloklar\u0131 i\u00e7in kullan\u0131l\u0131r.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># String olu\u015fturma ve bi\u00e7imlendirme</span>\n'
+ 'isim = <span class="str">"Python"</span>\n'
+ 'surum = <span class="num">3.12</span>\n'
+ '\n'
+ '<span class="cm"># F-stringler: modern yol (Python 3.6+)</span>\n'
+ 'mesaj = <span class="str">f"</span>{isim} {surum}<span class="str"> harika"</span>\n'
+ 'pi = <span class="num">3.14159265</span>\n'
+ '<span class="fn">print</span>(<span class="str">f"pi = </span>{pi:<span class="num">.4f</span>}<span class="str">"</span>)  <span class="cm"># "pi = 3.1416"</span>\n'
+ '\n'
+ '<span class="cm"># \u0130ndeksleme ve dilimleme</span>\n'
+ 's = <span class="str">"Merhaba, D\u00fcnya!"</span>\n'
+ '<span class="fn">print</span>(s[<span class="num">0</span>])       <span class="cm"># \'M\'  (0-tabanl\u0131 indeksleme)</span>\n'
+ '<span class="fn">print</span>(s[-<span class="num">1</span>])      <span class="cm"># \'!\'  (negatif = sondan)</span>\n'
+ '<span class="fn">print</span>(s[<span class="num">9</span>:<span class="num">14</span>])    <span class="cm"># \'D\u00fcnya\' (ba\u015flang\u0131\u00e7:biti\u015f, biti\u015f hari\u00e7)</span>\n'
+ '<span class="fn">print</span>(s[::<span class="num">-1</span>])     <span class="cm"># \'!ayn\u00fcD ,abahreM\' (ters \u00e7evir)</span>\n'
+ '\n'
+ '<span class="cm"># Stringler DE\u011e\u0130\u015eT\u0130R\u0130LEMEZ</span>\n'
+ '<span class="cm"># s[0] = "m"      # TypeError! Yerinde de\u011fi\u015ftirilemez</span>\n'
+ 's = <span class="str">"m"</span> + s[<span class="num">1</span>:]  <span class="cm"># Bunun yerine YEN\u0130 string olu\u015fturun</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>NLP i\u00e7in Temel String Metotlar\u0131:</strong> Metin verilerini \u00f6n i\u015flerken s\u00fcrekli kullanaca\u011f\u0131n\u0131z metotlar:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">ARAMA & TEST</div><div class="compare-item">\u2022 <code>s.find("x")</code> \u2014 indeks veya -1</div><div class="compare-item">\u2022 <code>s.startswith("Mer")</code> \u2014 bool</div><div class="compare-item">\u2022 <code>s.endswith(".txt")</code> \u2014 bool</div><div class="compare-item">\u2022 <code>s.count("a")</code> \u2014 tekrar say\u0131s\u0131</div><div class="compare-item">\u2022 <code>s.isdigit()</code> \u2014 hepsi rakam m\u0131?</div><div class="compare-item">\u2022 <code>s.isalpha()</code> \u2014 hepsi harf mi?</div></div><div class="compare-col"><div class="compare-title">D\u00d6N\u00dc\u015eT\u00dcRME</div><div class="compare-item">\u2022 <code>s.lower()</code> / <code>s.upper()</code></div><div class="compare-item">\u2022 <code>s.strip()</code> \u2014 bo\u015fluk temizle</div><div class="compare-item">\u2022 <code>s.replace("a","b")</code></div><div class="compare-item">\u2022 <code>s.split(",")</code> \u2014 string \u2192 liste</div><div class="compare-item">\u2022 <code>",".join(liste)</code> \u2014 liste \u2192 string</div><div class="compare-item">\u2022 <code>s.encode("utf-8")</code> \u2014 bytes</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># NLP tarz\u0131 metin \u00f6n i\u015fleme</span>\n'
+ 'ham = <span class="str">"  Merhaba, D\u00fcnya! Bu NLP.  "</span>\n'
+ '\n'
+ '<span class="cm"># Ad\u0131m 1: Bo\u015fluklar\u0131 temizle</span>\n'
+ 'metin = ham.strip()               <span class="cm"># "Merhaba, D\u00fcnya! Bu NLP."</span>\n'
+ '\n'
+ '<span class="cm"># Ad\u0131m 2: K\u00fc\u00e7\u00fck harfe \u00e7evir</span>\n'
+ 'metin = metin.lower()              <span class="cm"># "merhaba, d\u00fcnya! bu nlp."</span>\n'
+ '\n'
+ '<span class="cm"># Ad\u0131m 3: Tokenize et (basit split)</span>\n'
+ 'tokenlar = metin.split()           <span class="cm"># ["merhaba,", "d\u00fcnya!", "bu", "nlp."]</span>\n'
+ '\n'
+ '<span class="cm"># Ad\u0131m 4: Noktalama i\u015faretlerini kald\u0131r</span>\n'
+ '<span class="kw">import</span> string\n'
+ 'temiz = [t.strip(string.punctuation) <span class="kw">for</span> t <span class="kw">in</span> tokenlar]\n'
+ '<span class="cm"># ["merhaba", "d\u00fcnya", "bu", "nlp"]</span>\n'
+ '\n'
+ '<span class="cm"># Geri birle\u015ftir</span>\n'
+ 'sonuc = <span class="str">" "</span>.join(temiz)        <span class="cm"># "merhaba d\u00fcnya bu nlp"</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>String Kodlamas\u0131 (UTF-8):</strong> Bilgisayarlar byte saklar, karakter de\u011fil. <strong>Kodlama</strong> karakterleri byte\'lara d\u00f6n\u00fc\u015ft\u00fcr\u00fcr; <strong>kod \u00e7\u00f6zme</strong> byte\'lar\u0131 tekrar karakterlere d\u00f6n\u00fc\u015ft\u00fcr\u00fcr. Python 3 dahili olarak Unicode kullan\u0131r (her dildeki her karakter desteklenir). UTF-8 standart kodlamad\u0131r \u2014 ASCII uyumlu, de\u011fi\u015fken uzunluk (karakter ba\u015f\u0131na 1\u20134 byte).</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Kodlama: str \u2192 bytes</span>\n'
+ 'metin = <span class="str">"caf\u00e9"</span>\n'
+ 'kodlanmis = metin.encode(<span class="str">"utf-8"</span>)\n'
+ '<span class="fn">print</span>(kodlanmis)          <span class="cm"># b\'caf\\xc3\\xa9\' (4 karakter i\u00e7in 5 byte)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(metin))         <span class="cm"># 4 karakter</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(kodlanmis))     <span class="cm"># 5 byte (\u00e9 = UTF-8\'de 2 byte)</span>\n'
+ '\n'
+ '<span class="cm"># Kod \u00e7\u00f6zme: bytes \u2192 str</span>\n'
+ 'cozulmus = kodlanmis.decode(<span class="str">"utf-8"</span>)\n'
+ '<span class="fn">print</span>(cozulmus)          <span class="cm"># "caf\u00e9"</span>\n'
+ '\n'
+ '<span class="cm"># UTF-8\'de T\u00fcrk\u00e7e karakterler</span>\n'
+ 'tr = <span class="str">"g\u00fcnayd\u0131n"</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(tr))                  <span class="cm"># 8 karakter</span>\n'
+ '<span class="fn">print</span>(<span class="fn">len</span>(tr.encode(<span class="str">"utf-8"</span>)))  <span class="cm"># 10 byte (\u00fc ve \u0131 = her biri 2 byte)</span>'
+ '</pre></div>'

+ '<div class="l-note"><strong>NLP \u0130li\u015fkisi:</strong> Dosyalardan, API\'lerden veya web kaz\u0131ma i\u015flemlerinden metin y\u00fcklerken kodlama hatalar\u0131 1 numaral\u0131 hata kayna\u011f\u0131d\u0131r. Her zaman kodlamay\u0131 belirtin: <code>open("dosya.txt", encoding="utf-8")</code>. BERT\'in WordPiece ve GPT\'nin BPE gibi tokenizer\'lar\u0131 byte/karakter d\u00fczeyinde \u00e7al\u0131\u015f\u0131r \u2014 kodlamay\u0131 anlamak tokenizasyon sorunlar\u0131n\u0131 hata ay\u0131klamak i\u00e7in gereklidir.</div>'

/* ============================================================
   B\u00d6L\u00dcM 5: Boolean Mant\u0131k & None
   ============================================================ */
+ '<h2 class="l-title">5. Boolean Mant\u0131k & None</h2>'

+ '<p class="l-text">Boolean de\u011ferler (<code>True</code> / <code>False</code>) t\u00fcm kontrol ak\u0131\u015f\u0131n\u0131n temelidir. Ancak Python\'un boolean sistemi \u00e7o\u011fu dilden daha derine gider \u2014 <em>her</em> nesnenin bir do\u011fruluk de\u011feri vard\u0131r ve "truthiness"\u0131 anlamak Pythonic kod yazmak i\u00e7in gereklidir.</p>'

+ '<div class="calc-formula"><div class="formula-label">DO\u011eRULUK KURALI</div><div class="formula-main">bool(x) \u2192 False e\u011fer x "bo\u015f" veya "s\u0131f\u0131r" ise</div><div class="formula-sub">Bo\u015f kaplar, s\u0131f\u0131r say\u0131lar, None ve bo\u015f stringler <strong>falsy</strong>\'dir. Geri kalan her \u015fey <strong>truthy</strong>\'dir. Bu, <code>if len(my_list) > 0:</code> yerine <code>if my_list:</code> gibi temiz ko\u015fullar yazman\u0131z\u0131 sa\u011flar.</div></div>'

+ '<p class="l-text"><strong>Tam Do\u011fruluk Tablosu:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">FALSY (bool(x) = False)</div><div class="compare-item">\u2022 <code>False</code></div><div class="compare-item">\u2022 <code>None</code></div><div class="compare-item">\u2022 <code>0</code>, <code>0.0</code>, <code>0j</code></div><div class="compare-item">\u2022 <code>""</code> (bo\u015f string)</div><div class="compare-item">\u2022 <code>[]</code> (bo\u015f liste)</div><div class="compare-item">\u2022 <code>()</code> (bo\u015f tuple)</div><div class="compare-item">\u2022 <code>{}</code> (bo\u015f dict)</div><div class="compare-item">\u2022 <code>set()</code> (bo\u015f k\u00fcme)</div></div><div class="compare-col"><div class="compare-title">TRUTHY (bool(x) = True)</div><div class="compare-item">\u2022 <code>True</code></div><div class="compare-item">\u2022 S\u0131f\u0131r olmayan herhangi bir say\u0131</div><div class="compare-item">\u2022 <code>" "</code> (bo\u015fluk \u2014 bo\u015f de\u011fil!)</div><div class="compare-item">\u2022 <code>[0]</code> (elemanl\u0131 liste)</div><div class="compare-item">\u2022 <code>"False"</code> (string, bool de\u011fil!)</div><div class="compare-item">\u2022 Bo\u015f olmayan herhangi bir kap</div><div class="compare-item">\u2022 \u00d6zel nesneler (varsay\u0131lan olarak)</div><div class="compare-item">\u2022 <code>numpy.nan</code> (s\u00fcrpriz!)</div></div></div>'

/* --- Plotly: Do\u011fruluk Is\u0131 Haritas\u0131 --- */
+ '<div id="plot-truthy-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var types=["False","None","0","0.0","\\"\\"","[]","()","{}","True","1","-1","0.001","\" \"","[0]","\\"0\\"","nan"];'
+ 'var vals=[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];'
+ 'var t1={x:types,y:["bool()"],z:[vals],type:"heatmap",colorscale:[[0,"rgba(248,113,113,0.7)"],[1,"rgba(78,205,196,0.7)"]],showscale:false,text:[types.map(function(t,i){return vals[i]?"DO\u011eRU":"YANLI\u015e";})],texttemplate:"%{text}",textfont:{color:"#fff",size:10}};'
+ 'var layout={title:{text:"Python Do\u011fruluk De\u011ferleri: Hangi De\u011ferler Falsy vs Truthy?",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{tickangle:-45,tickfont:{size:10}},yaxis:{visible:false},margin:{t:50,r:30,b:80,l:50},height:200};'
+ 'Plotly.newPlot("plot-truthy-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>K\u0131rm\u0131z\u0131 = Falsy, Turkuaz = Truthy.</strong> <code>"0"</code> (s\u0131f\u0131r i\u00e7eren string) ve <code>nan</code>\'in truthy oldu\u011funa dikkat edin \u2014 yayg\u0131n hata kayna\u011f\u0131!</div></div>'

+ '<p class="l-text"><strong><code>is</code> vs <code>==</code></strong> \u2014 bu ayr\u0131m deneyimli geli\u015ftiricileri bile yan\u0131lt\u0131r:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">== (E\u015fitlik)</div><div class="compare-item">\u2022 De\u011ferler <strong>ayn\u0131 m\u0131 g\u00f6r\u00fcn\u00fcyor</strong>?</div><div class="compare-item">\u2022 <code>[1,2] == [1,2]</code> \u2192 <code>True</code></div><div class="compare-item">\u2022 <code>__eq__</code> metodunu \u00e7a\u011f\u0131r\u0131r</div><div class="compare-item">\u2022 De\u011fer kar\u015f\u0131la\u015ft\u0131rmas\u0131 i\u00e7in kullan\u0131n</div></div><div class="compare-col"><div class="compare-title">is (Kimlik)</div><div class="compare-item">\u2022 <strong>Tam olarak ayn\u0131 nesne</strong> mi?</div><div class="compare-item">\u2022 <code>[1,2] is [1,2]</code> \u2192 <code>False</code></div><div class="compare-item">\u2022 <code>id()</code> de\u011ferlerini kar\u015f\u0131la\u015ft\u0131r\u0131r</div><div class="compare-item">\u2022 SADECE <code>None</code> kontrol\u00fc i\u00e7in kullan\u0131n</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># is vs == \u2014 hangisini ne zaman kullanaca\u011f\u0131n\u0131z\u0131 bilin</span>\n'
+ 'a = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]\n'
+ 'b = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]\n'
+ '<span class="fn">print</span>(a == b)    <span class="cm"># True  \u2014 ayn\u0131 de\u011ferler</span>\n'
+ '<span class="fn">print</span>(a <span class="kw">is</span> b)    <span class="cm"># False \u2014 farkl\u0131 nesneler</span>\n'
+ '\n'
+ '<span class="cm"># None kontrol\u00fc i\u00e7in her zaman "is" kullan\u0131n</span>\n'
+ 'x = <span class="kw">None</span>\n'
+ '<span class="kw">if</span> x <span class="kw">is</span> <span class="kw">None</span>:   <span class="cm"># Do\u011fru \u2714</span>\n'
+ '    <span class="fn">print</span>(<span class="str">"x None\'dur"</span>)\n'
+ '<span class="kw">if</span> x == <span class="kw">None</span>:   <span class="cm"># \u00c7al\u0131\u015f\u0131r ama k\u00f6t\u00fc pratik \u2718</span>\n'
+ '    <span class="fn">print</span>(<span class="str">"x None\'a e\u015fit"</span>)\n'
+ '\n'
+ '<span class="cm"># K\u0131sa devre de\u011ferlendirme</span>\n'
+ '<span class="cm"># "and" ilk False\'ta durur, "or" ilk True\'da durur</span>\n'
+ '<span class="fn">print</span>(<span class="kw">True</span> <span class="kw">and</span> <span class="str">"evet"</span>)    <span class="cm"># "evet" \u2014 son truthy\'yi d\u00f6nd\u00fcr\u00fcr</span>\n'
+ '<span class="fn">print</span>(<span class="kw">False</span> <span class="kw">and</span> <span class="str">"evet"</span>)   <span class="cm"># False \u2014 ilk falsy\'de durur</span>\n'
+ '<span class="fn">print</span>(<span class="str">""</span> <span class="kw">or</span> <span class="str">"varsayilan"</span>)  <span class="cm"># "varsayilan" \u2014 yayg\u0131n desen!</span>\n'
+ '\n'
+ '<span class="cm"># Zincirli kar\u015f\u0131la\u015ft\u0131rmalar (Python\'a \u00f6zg\u00fc!)</span>\n'
+ 'yas = <span class="num">25</span>\n'
+ '<span class="fn">print</span>(<span class="num">18</span> <= yas < <span class="num">65</span>)  <span class="cm"># True \u2014 matematik gibi okunur!</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>None \u2014 Python\'un null\'u:</strong> <code>None</code>, "de\u011fer yok" veya "ayarlanmam\u0131\u015f" anlam\u0131na gelen bir tekil nesnedir. A\u00e7\u0131k bir return ifadesi olmayan fonksiyonlar <code>None</code> d\u00f6nd\u00fcr\u00fcr. Falsy\'dir ve her zaman <code>is None</code> ile kontrol edilmelidir, asla <code>== None</code> ile de\u011fil.</p>'

+ '<div class="l-note"><strong>ML \u0130li\u015fkisi:</strong> Do\u011fruluk de\u011ferleri veri temizlemede yo\u011fun kullan\u0131l\u0131r: <code>if not df.empty:</code>, <code>if results:</code>, <code>value = config.get("lr") or 0.001</code>. K\u0131sa devre de\u011ferlendirmesini anlamak \u00f6z, g\u00fcvenli kod yazman\u0131za yard\u0131mc\u0131 olur. Ve <code>None</code>, her ML k\u00fct\u00fcphanesindeki iste\u011fe ba\u011fl\u0131 parametreler i\u00e7in varsay\u0131land\u0131r.</div>'

/* ============================================================
   B\u00d6L\u00dcM 6: Tip Sistemi & D\u00f6n\u00fc\u015ft\u00fcrmeler
   ============================================================ */
+ '<h2 class="l-title">6. Tip Sistemi & D\u00f6n\u00fc\u015ft\u00fcrmeler</h2>'

+ '<div class="calc-highlight"><strong>Python dinamik olarak tiplenmi\u015ftir:</strong> De\u011fi\u015fkenlerin sabit tipleri yoktur. Ayn\u0131 isim \u00f6nce bir int\'e, sonra bir string\'e, sonra bir listeye i\u015faret edebilir. Tipler de\u011fi\u015fkenlere de\u011fil, <em>nesnelere</em> aittir. Bu, <code>int x</code> tan\u0131mlad\u0131\u011f\u0131n\u0131zda <code>x</code>\'in sonsuza dek int oldu\u011fu Java veya C++ gibi statik tipli dillerin tam tersidir.</div>'

+ '<p class="l-text"><strong>Dinamik Tipleme vs Statik Tipleme:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">D\u0130NAM\u0130K (Python, JS)</div><div class="compare-item">\u2022 Tipler <strong>\u00e7al\u0131\u015fma zaman\u0131nda</strong> kontrol edilir</div><div class="compare-item">\u2022 Tip bildirimi gerekmez</div><div class="compare-item">\u2022 Daha h\u0131zl\u0131 yaz\u0131l\u0131r, daha esnek</div><div class="compare-item">\u2022 Tip hatalar\u0131 ge\u00e7 bulunur (\u00e7al\u0131\u015fma zaman\u0131)</div><div class="compare-item">\u2022 <code>x = 42; x = "merhaba"</code> \u2014 ge\u00e7erli!</div></div><div class="compare-col"><div class="compare-title">STAT\u0130K (Java, C++, Rust)</div><div class="compare-item">\u2022 Tipler <strong>derleme zaman\u0131nda</strong> kontrol edilir</div><div class="compare-item">\u2022 Tipleri a\u00e7\u0131k\u00e7a bildirmek gerekir</div><div class="compare-item">\u2022 Daha ayr\u0131nt\u0131l\u0131, daha g\u00fcvenli</div><div class="compare-item">\u2022 Tip hatalar\u0131 erken bulunur (derlemede)</div><div class="compare-item">\u2022 <code>int x = 42; x = "merhaba"</code> \u2014 hata!</div></div></div>'

+ '<p class="l-text"><strong>Duck Typing:</strong> "\u00d6rdek gibi y\u00fcr\u00fcyor ve \u00f6rdek gibi vakliyorsa, \u00f6rdektir." Python bir nesnenin ne <em>oldu\u011funu</em> umursamaz \u2014 sadece nesnenin ne <em>yapabilece\u011fini</em> \u00f6nemser. Bir nesnenin <code>__len__</code> metodu varsa, ister list, ister string, ister dict, ister kendi \u00f6zel s\u0131n\u0131f\u0131n\u0131z olsun, \u00fczerine <code>len()</code> \u00e7a\u011f\u0131rabilirsiniz.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Duck typing uygulamada</span>\n'
+ '<span class="kw">def</span> <span class="fn">uzunluk_al</span>(obj):\n'
+ '    <span class="kw">return</span> <span class="fn">len</span>(obj)  <span class="cm"># __len__\'i olan her \u015feyde \u00e7al\u0131\u015f\u0131r</span>\n'
+ '\n'
+ '<span class="fn">print</span>(uzunluk_al(<span class="str">"merhaba"</span>))   <span class="cm"># 7 (string)</span>\n'
+ '<span class="fn">print</span>(uzunluk_al([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>]))    <span class="cm"># 3 (liste)</span>\n'
+ '<span class="fn">print</span>(uzunluk_al({<span class="str">"a"</span>:<span class="num">1</span>}))    <span class="cm"># 1 (dict)</span>\n'
+ '\n'
+ '<span class="cm"># Tip kontrol fonksiyonlar\u0131</span>\n'
+ 'x = <span class="num">42</span>\n'
+ '<span class="fn">print</span>(<span class="fn">type</span>(x))              <span class="cm"># &lt;class \'int\'&gt;</span>\n'
+ '<span class="fn">print</span>(<span class="fn">isinstance</span>(x, <span class="fn">int</span>))   <span class="cm"># True</span>\n'
+ '<span class="fn">print</span>(<span class="fn">isinstance</span>(x, (<span class="fn">int</span>, <span class="fn">float</span>)))  <span class="cm"># True (\u00e7oklu tip kontrol\u00fc)</span>'
+ '</pre></div>'

/* --- Plotly: Tip Hiyerar\u015fisi A\u011fac\u0131 --- */
+ '<div id="plot-types-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var labels=["object","NoneType","bool","int","float","complex","str","bytes","list","tuple","dict","set","frozenset"];'
+ 'var parents=["","object","int","object","object","object","object","object","object","object","object","object","object"];'
+ 'var vals=[13,1,1,1,1,1,1,1,1,1,1,1,1];'
+ 'var colors=["rgba(200,169,110,0.3)","rgba(248,113,113,0.5)","rgba(78,205,196,0.5)","rgba(78,205,196,0.5)","rgba(78,205,196,0.5)","rgba(78,205,196,0.5)","rgba(130,170,255,0.5)","rgba(130,170,255,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)","rgba(200,169,110,0.5)"];'
+ 'var t1={type:"treemap",labels:labels,parents:parents,values:vals,marker:{colors:colors,line:{width:1,color:"rgba(255,255,255,0.15)"}},textfont:{color:"#ebe6dc",size:13},textposition:"middle center"};'
+ 'var layout={title:{text:"Python Yerle\u015fik Tip Hiyerar\u015fisi (Her \u015eey object\'ten Kal\u0131t\u0131m Al\u0131r)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},margin:{t:50,r:10,b:10,l:10},height:320};'
+ 'Plotly.newPlot("plot-types-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},300)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>Python\'daki her tip <code>object</code>\'ten kal\u0131t\u0131m al\u0131r.</strong> <code>bool</code>\'un <code>int</code>\'in alt s\u0131n\u0131f\u0131 oldu\u011funa dikkat edin \u2014 <code>True + True = 2</code> ge\u00e7erli Python\'dur! Turkuaz = say\u0131sal tipler, mavi = dizi/bytes, alt\u0131n = kaplar.</div></div>'

+ '<p class="l-text"><strong>Tip D\u00f6n\u00fc\u015ft\u00fcrmeleri:</strong> Python g\u00fc\u00e7l\u00fc tiplidir \u2014 tipleri \u00f6rt\u00fck olarak d\u00f6n\u00fc\u015ft\u00fcrmez (JavaScript\'in <code>"5" + 3 = "53"</code> yapmas\u0131n\u0131n aksine). A\u00e7\u0131k\u00e7a d\u00f6n\u00fc\u015ft\u00fcrmeniz gerekir:</p>'

+ '<div class="calc-steps">'
+ '<div class="step-item"><div class="step-num">1</div><div class="step-content"><code>int("42")</code> \u2192 <code>42</code>. Stringten tam say\u0131ya. Ge\u00e7erli bir tam say\u0131 de\u011filse <code>ValueError</code> f\u0131rlat\u0131r.</div></div>'
+ '<div class="step-item"><div class="step-num">2</div><div class="step-content"><code>float("3.14")</code> \u2192 <code>3.14</code>. Stringten ondal\u0131k say\u0131ya. <code>"inf"</code>, <code>"nan"</code> ve bilimsel g\u00f6sterim <code>"1e-5"</code> de i\u015fler.</div></div>'
+ '<div class="step-item"><div class="step-num">3</div><div class="step-content"><code>str(42)</code> \u2192 <code>"42"</code>. Herhangi bir nesneden stringe. Nesnenin <code>__str__</code> metodunu \u00e7a\u011f\u0131r\u0131r.</div></div>'
+ '<div class="step-item"><div class="step-num">4</div><div class="step-content"><code>list("abc")</code> \u2192 <code>["a", "b", "c"]</code>. Herhangi bir yinelenebilirden listeye. Stringler, tuple\'lar, k\u00fcmeler, jenerat\u00f6rler i\u00e7in \u00e7al\u0131\u015f\u0131r.</div></div>'
+ '<div class="step-item"><div class="step-num">5</div><div class="step-content"><code>bool(0)</code> \u2192 <code>False</code>. Herhangi bir nesneden booleana. B\u00f6l\u00fcm 5\'teki do\u011fruluk kurallar\u0131n\u0131 izler.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Tip d\u00f6n\u00fc\u015ft\u00fcrmeleri</span>\n'
+ '<span class="fn">print</span>(<span class="fn">int</span>(<span class="str">"42"</span>))           <span class="cm"># 42</span>\n'
+ '<span class="fn">print</span>(<span class="fn">int</span>(<span class="num">3.99</span>))           <span class="cm"># 3 (keser, yuvarlamaz!)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">float</span>(<span class="str">"1e-5"</span>))       <span class="cm"># 1e-05 (bilimsel g\u00f6sterim)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">str</span>(<span class="num">3.14</span>))           <span class="cm"># "3.14"</span>\n'
+ '<span class="fn">print</span>(<span class="fn">list</span>(<span class="str">"Python"</span>))      <span class="cm"># [\'P\', \'y\', \'t\', \'h\', \'o\', \'n\']</span>\n'
+ '<span class="fn">print</span>(<span class="fn">bool</span>(<span class="str">""</span>))            <span class="cm"># False</span>\n'
+ '<span class="fn">print</span>(<span class="fn">bool</span>(<span class="str">"0"</span>))           <span class="cm"># True (bo\u015f olmayan string!)</span>\n'
+ '\n'
+ '<span class="cm"># Yayg\u0131n tuzak: int() keser, round() yuvarlar</span>\n'
+ '<span class="fn">print</span>(<span class="fn">int</span>(<span class="num">3.7</span>))     <span class="cm"># 3 (s\u0131f\u0131ra do\u011fru kesildi)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">round</span>(<span class="num">3.7</span>))   <span class="cm"># 4 (d\u00fczg\u00fcn yuvarlama)</span>\n'
+ '<span class="fn">print</span>(<span class="fn">round</span>(<span class="num">2.5</span>))   <span class="cm"># 2 (bankac\u0131 yuvarlamas\u0131!)</span>'
+ '</pre></div>'

+ '<p class="l-text"><strong>Tip \u0130pucu (PEP 484):</strong> Python 3.5\'ten beri <em>iste\u011fe ba\u011fl\u0131</em> tip ipu\u00e7lar\u0131 ekleyebilirsiniz. Bunlar \u00e7al\u0131\u015fma zaman\u0131 davran\u0131\u015f\u0131n\u0131 de\u011fi\u015ftirmez \u2014 Python bunlar\u0131 \u00e7al\u0131\u015fma s\u0131ras\u0131nda g\u00f6rmezden gelir. Ancak <code>mypy</code> gibi ara\u00e7lar bunlar\u0131 statik analiz i\u00e7in kullan\u0131r ve belge g\u00f6revi g\u00f6r\u00fcrler:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre>'
+ '<span class="cm"># Tip ipu\u00e7lar\u0131: insanlar ve ara\u00e7lar i\u00e7in ipuclar\u0131</span>\n'
+ '<span class="kw">def</span> <span class="fn">kayip_hesapla</span>(tahminler: <span class="fn">list</span>[<span class="fn">float</span>],\n'
+ '                  hedefler: <span class="fn">list</span>[<span class="fn">float</span>]) -> <span class="fn">float</span>:\n'
+ '    <span class="str">"""Ortalama kare hatas\u0131n\u0131 hesapla."""</span>\n'
+ '    n: <span class="fn">int</span> = <span class="fn">len</span>(tahminler)\n'
+ '    toplam: <span class="fn">float</span> = <span class="fn">sum</span>(\n'
+ '        (t - h) ** <span class="num">2</span> <span class="kw">for</span> t, h <span class="kw">in</span> <span class="fn">zip</span>(tahminler, hedefler)\n'
+ '    )\n'
+ '    <span class="kw">return</span> toplam / n\n'
+ '\n'
+ '<span class="cm"># Tip ipu\u00e7lar\u0131 \u00e7al\u0131\u015fma zaman\u0131nda tipleri zorlamaz!</span>\n'
+ 'sonuc = kayip_hesapla([<span class="num">1.0</span>, <span class="num">2.0</span>], [<span class="num">1.5</span>, <span class="num">2.5</span>])  <span class="cm"># D\u00fczg\u00fcn \u00e7al\u0131\u015f\u0131r</span>\n'
+ 'sonuc = kayip_hesapla(<span class="str">"merhaba"</span>, <span class="str">"dunya"</span>)      <span class="cm"># \u00c7al\u0131\u015fma zaman\u0131nda da "\u00e7al\u0131\u015f\u0131r" (\u00e7\u00f6kene kadar)</span>'
+ '</pre></div>'

+ '<div class="think-box"><div class="think-label">D\u00dc\u015e\u00dcN\u00dcN</div><div class="think-body">Tip ipu\u00e7lar\u0131 \u00e7al\u0131\u015fma zaman\u0131 davran\u0131\u015f\u0131n\u0131 de\u011fi\u015ftirmiyorsa neden kullanal\u0131m? \u00dc\u00e7 neden: (1) Kodla senkronize kalan <strong>canl\u0131 belge</strong> g\u00f6revi g\u00f6r\u00fcrler. (2) <code>mypy</code> gibi statik analiz\u00f6rler tip hatalar\u0131n\u0131 \u00e7al\u0131\u015fma zaman\u0131ndan \u00f6nce yakalar. (3) IDE\'ler daha iyi otomatik tamamlama ve hata vurgulama i\u00e7in kullan\u0131r. B\u00fcy\u00fck ML kod tabanlar\u0131nda t\u00fcm hata kategorilerini \u00f6nlerler.</div></div>'

/* --- Plotly: Tip D\u00f6n\u00fc\u015ft\u00fcrme Ak\u0131\u015f\u0131 --- */
+ '<div id="plot-conv-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var t1={type:"sankey",orientation:"h",node:{pad:15,thickness:20,line:{color:"rgba(255,255,255,0.2)",width:0.5},label:["str","int","float","bool","list","tuple","bytes"],color:["rgba(130,170,255,0.6)","rgba(78,205,196,0.6)","rgba(78,205,196,0.6)","rgba(78,205,196,0.6)","rgba(200,169,110,0.6)","rgba(200,169,110,0.6)","rgba(130,170,255,0.6)"]},link:{source:[0,0,0,0,1,1,1,2,2,3,4,5],target:[1,2,4,6,0,2,3,0,1,0,5,4],value:[3,3,2,1,3,3,2,3,2,2,2,2],color:["rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)","rgba(255,255,255,0.07)"]}};'
+ 'var layout={title:{text:"Python Yerle\u015fik Tipler Aras\u0131 D\u00f6n\u00fc\u015ft\u00fcrme Ak\u0131\u015flar\u0131",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:12},margin:{t:50,r:30,b:30,l:30},height:300};'
+ 'Plotly.newPlot("plot-conv-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},400)</script>'

+ '<div class="calc-graph"><div class="cg-caption"><strong>Yerle\u015fik tipler aras\u0131ndaki d\u00f6n\u00fc\u015ft\u00fcrme ak\u0131\u015flar\u0131.</strong> Daha kal\u0131n ba\u011flant\u0131lar daha yayg\u0131n d\u00f6n\u00fc\u015ft\u00fcrmeleri g\u00f6sterir. str \u2194 int/float veri i\u015flemede en s\u0131k kullan\u0131land\u0131r. T\u00fcm d\u00f6n\u00fc\u015ft\u00fcrmelerin g\u00fcvenli olmad\u0131\u011f\u0131n\u0131 unutmay\u0131n \u2014 <code>int("merhaba")</code> ValueError f\u0131rlat\u0131r.</div></div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>CSV verisini manuel olarak okuma ve d\u00f6n\u00fc\u015ft\u00fcrme</strong><br><br>Bir CSV sat\u0131r\u0131n\u0131n i\u00e7eri\u011fi: <code>"Ay\u015fe,25,3.85,True"</code><br><br><code>satir = "Ay\u015fe,25,3.85,True"</code><br><code>parcalar = satir.split(",")</code><br><code># [\'Ay\u015fe\', \'25\', \'3.85\', \'True\'] \u2014 hepsi string!</code><br><br><code>isim = parcalar[0]</code> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code># str</code><br><code>yas = int(parcalar[1])</code> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code># 25 (int)</code><br><code>not_ort = float(parcalar[2])</code> &nbsp;&nbsp;<code># 3.85 (float)</code><br><code>aktif = parcalar[3] == "True"</code> &nbsp;<code># True (bool)</code><br><br>Bu tam olarak <code>pandas.read_csv()</code>\'nin arka planda yapt\u0131\u011f\u0131 \u015feydir, ancak binlerce s\u00fctun i\u00e7in otomatik tip \u00e7\u0131kar\u0131m\u0131yla.</div></div>'

+ '<div class="l-note"><strong>B\u00f6l\u00fcm 6 \u00d6zeti:</strong> Python\'un tip sistemi <strong>dinamik</strong> (tipler \u00e7al\u0131\u015fma zaman\u0131nda kontrol edilir), <strong>g\u00fc\u00e7l\u00fc</strong> (\u00f6rt\u00fck d\u00f6n\u00fc\u015ft\u00fcrme yok) ve <strong>duck typing</strong> kullan\u0131r (davran\u0131\u015f \u00f6nemlidir, tip etiketi de\u011fil). Tip ipu\u00e7lar\u0131 iste\u011fe ba\u011fl\u0131d\u0131r ama ML projeleri i\u00e7in \u015fiddetle \u00f6nerilir. D\u0131\u015f veri y\u00fcklerken her zaman veri tiplerini do\u011frulay\u0131n ve d\u00f6n\u00fc\u015ft\u00fcr\u00fcn.</div>'

/* ============================================================
   \u00d6zet & Sonraki Ders
   ============================================================ */
+ '<h2 class="l-title">\u00d6zet & S\u0131radaki</h2>'

+ '<p class="l-text">Bu ders, yazaca\u011f\u0131n\u0131z <strong>her</strong> Python program\u0131nda kullanaca\u011f\u0131n\u0131z temelleri kapsad\u0131. \u0130\u015fte tam kavram haritas\u0131:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Python Kurulumu</div><div class="card-body">Python 3.12+, pip, venv, VS Code. Her zaman sanal ortamlar kullan\u0131n. Ke\u015fif i\u00e7in REPL, \u00fcretim i\u00e7in script.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bellek Modeli</div><div class="card-body">De\u011fi\u015fkenler nesnelere i\u015faret eden etiketlerdir. id() bellek adresini g\u00f6sterir. De\u011fi\u015ftirilebilir vs de\u011fi\u015ftirilemez, aliasing davran\u0131\u015f\u0131n\u0131 belirler.</div></div>'
+ '<div class="calc-card"><div class="card-title">Say\u0131sal Tipler</div><div class="card-body">int (keyfi hassasiyet), float (IEEE 754, kesin de\u011fil!), complex, Decimal. Operat\u00f6rlerinizi bilin: /, //, %, **.</div></div>'
+ '<div class="calc-card"><div class="card-title">Stringler</div><div class="card-body">De\u011fi\u015ftirilemez Unicode dizileri. Bi\u00e7imlendirme i\u00e7in f-stringler. NLP i\u00e7in split/join. UTF-8 kodlama. Her zaman kodlama belirtin.</div></div>'
+ '<div class="calc-card"><div class="card-title">Boolean & None</div><div class="card-body">Do\u011fruluk: bo\u015f/s\u0131f\u0131r = False. None i\u00e7in "is" kullan\u0131n. K\u0131sa devre and/or. Zincirli kar\u015f\u0131la\u015ft\u0131rmalar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Tip Sistemi</div><div class="card-body">Dinamik + g\u00fc\u00e7l\u00fc + duck typing. A\u00e7\u0131k d\u00f6n\u00fc\u015ft\u00fcrmeler: int(), float(), str(). Belgeleme ve statik analiz i\u00e7in tip ipu\u00e7lar\u0131.</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Sonraki Ders:</strong> Ders 2\'de <strong>Veri Yap\u0131lar\u0131</strong>\'na dal\u0131yoruz \u2014 listeler, tuple\'lar, s\u00f6zl\u00fckler ve k\u00fcmeler. Bunlar, verilerinizi ML hatt\u0131n\u0131za girmeden \u00f6nce d\u00fczenlemek i\u00e7in kullanaca\u011f\u0131n\u0131z kaplard\u0131r. Comprehension\'lar\u0131, i\u00e7 i\u00e7e yap\u0131lar\u0131 ve hangi yap\u0131y\u0131 ne zaman kullanaca\u011f\u0131n\u0131z\u0131 belirleyen performans \u00f6zelliklerini i\u015fleyece\u011fiz.</div>'

};