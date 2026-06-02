var PYTHON_L3 = {

en: '<p class="l-text"><strong>Data structures are the backbone of every program.</strong> If algorithms are the verbs of programming, data structures are the nouns — they define <em>how</em> your data is organized, accessed, and modified. Choosing the right structure can mean the difference between a program that runs in milliseconds and one that takes hours. Python gives you four built-in workhorses: <strong>lists</strong>, <strong>tuples</strong>, <strong>dictionaries</strong>, and <strong>sets</strong> — plus a treasure trove of specialized structures in the <code>collections</code> module.</p>'

+ '<p class="l-text">This lesson takes you deep into each structure: not just the syntax, but the <em>why</em> behind each design choice. We will explore time complexity, memory layout, mutability contracts, and real-world patterns that professional Python developers use daily. By the end, you will be able to pick the perfect data structure for any problem instinctively.</p>'
+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Choose between list, tuple, dict and set based on access patterns and mutability</li><li>Iterate, slice and update lists with indexing, slicing and methods</li><li>Use tuples for immutable records and dicts for keyed data</li><li>Apply set operations (union, intersection, difference) to deduplicate and compare</li><li>Write list, dict and set comprehensions for concise transformations</li><li>Pick the right data structure for common tasks like grouping and counting</li></ul></div>'


/* ============================================================
   SECTION 1: LISTS IN DEPTH
   ============================================================ */
+ '<h2 class="l-title">1. Lists In Depth</h2>'

+ '<div class="calc-highlight"><strong>What is a list, really?</strong> Under the hood, a Python list is a <strong>dynamic array</strong> — a contiguous block of pointers (references) to objects stored elsewhere in memory. When you <code>append()</code> and the internal array is full, Python allocates a <em>new, larger</em> array (typically ~1.125x the old size), copies pointers over, and frees the old one. This is why <code>append()</code> is <strong>amortized O(1)</strong> — most calls are instant, but occasionally one triggers a resize.</div>'

+ '<p class="l-text"><strong>Creating lists</strong> — Python offers multiple ways to build lists, each suited to different situations:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Literal creation</span>\nfruits = [<span class="str">"apple"</span>, <span class="str">"banana"</span>, <span class="str">"cherry"</span>]\nnumbers = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]\nmixed = [<span class="num">42</span>, <span class="str">"hello"</span>, <span class="num">3.14</span>, <span class="kw">True</span>, [<span class="num">1</span>, <span class="num">2</span>]]  <span class="cm"># heterogeneous</span>\n\n<span class="cm"># List comprehension — the Pythonic way</span>\nsquares = [x**<span class="num">2</span> <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>)]        <span class="cm"># [0, 1, 4, 9, ..., 81]</span>\nevens = [x <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>) <span class="kw">if</span> x % <span class="num">2</span> == <span class="num">0</span>] <span class="cm"># filtered</span>\n\n<span class="cm"># From other iterables</span>\nchars = <span class="fn">list</span>(<span class="str">"Python"</span>)              <span class="cm"># [\'P\', \'y\', \'t\', \'h\', \'o\', \'n\']</span>\nfrom_range = <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">5</span>))         <span class="cm"># [0, 1, 2, 3, 4]</span>\n\n<span class="cm"># Repetition operator</span>\nzeros = [<span class="num">0</span>] * <span class="num">10</span>                     <span class="cm"># [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]</span></code></pre></div>'

+ '<p class="l-text"><strong>Indexing and slicing</strong> are fundamental to list mastery. Python uses zero-based indexing, and supports negative indices that count from the end:</p>'

+ '<div class="calc-formula"><div class="cf-label">LIST INDEXING</div><div class="cf-main">list[start : stop : step]</div><div class="cf-sub">start = inclusive beginning (default 0), stop = exclusive end (default len), step = stride (default 1). Negative values count from the end.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>data = [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>, <span class="num">50</span>, <span class="num">60</span>, <span class="num">70</span>, <span class="num">80</span>]\n<span class="cm">#        0    1    2    3    4    5    6    7   (positive index)</span>\n<span class="cm">#       -8   -7   -6   -5   -4   -3   -2   -1  (negative index)</span>\n\ndata[<span class="num">0</span>]      <span class="cm"># 10   — first element</span>\ndata[-<span class="num">1</span>]     <span class="cm"># 80   — last element</span>\ndata[<span class="num">2</span>:<span class="num">5</span>]    <span class="cm"># [30, 40, 50]  — index 2, 3, 4</span>\ndata[::<span class="num">2</span>]    <span class="cm"># [10, 30, 50, 70]  — every 2nd element</span>\ndata[::-<span class="num">1</span>]   <span class="cm"># [80, 70, 60, 50, 40, 30, 20, 10]  — reversed</span>\ndata[<span class="num">1</span>::<span class="num">3</span>]   <span class="cm"># [20, 50, 80]  — start at 1, step by 3</span>\ndata[-<span class="num">3</span>:]    <span class="cm"># [60, 70, 80]  — last 3 elements</span></code></pre></div>'

+ '<div class="think-box"><strong>Think about it:</strong> Why does Python use exclusive stop in slicing? Because <code>len(data[a:b]) == b - a</code>. This makes splitting easy: <code>data[:k]</code> and <code>data[k:]</code> always give you the complete list when concatenated. No off-by-one errors. This design choice, inherited from C, is one of the most elegant in Python.</div>'

/* List Methods Reference Card */
+ '<p class="l-text"><strong>List methods</strong> — Python lists come with powerful built-in methods. Here is the complete reference:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="cc-icon">+</div><div class="cc-title">append(x)</div><div class="cc-body">Add x to end.<br>O(1) amortized.<br><code>lst.append(42)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">++</div><div class="cc-title">extend(iter)</div><div class="cc-body">Add all items from iterable.<br>O(k) where k = len(iter).<br><code>lst.extend([1,2,3])</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">^</div><div class="cc-title">insert(i, x)</div><div class="cc-body">Insert x at index i.<br>O(n) — shifts elements.<br><code>lst.insert(0, "first")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&minus;</div><div class="cc-title">remove(x)</div><div class="cc-body">Remove first occurrence of x.<br>O(n) — searches + shifts.<br><code>lst.remove("old")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&darr;</div><div class="cc-title">pop(i=-1)</div><div class="cc-body">Remove & return item at i.<br>O(1) at end, O(n) elsewhere.<br><code>val = lst.pop()</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&uarr;&darr;</div><div class="cc-title">sort() / reverse()</div><div class="cc-body">Sort in-place: O(n log n).<br>Reverse in-place: O(n).<br><code>lst.sort(key=len)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">#</div><div class="cc-title">index(x) / count(x)</div><div class="cc-body">Find first index of x / count occurrences.<br>Both O(n).<br><code>lst.index("a")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">C</div><div class="cc-title">copy()</div><div class="cc-body">Shallow copy of list.<br>O(n).<br><code>new = lst.copy()</code></div></div>'
+ '</div>'

/* List as stack/queue */
+ '<p class="l-text"><strong>Lists as stacks and queues:</strong> A list naturally works as a <strong>stack</strong> (Last-In-First-Out) using <code>append()</code> and <code>pop()</code>. For a <strong>queue</strong> (First-In-First-Out), use <code>collections.deque</code> instead, because <code>pop(0)</code> on a list is O(n) — it shifts every element.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Stack (LIFO) — use list directly</span>\nstack = []\nstack.<span class="fn">append</span>(<span class="str">"first"</span>)   <span class="cm"># push</span>\nstack.<span class="fn">append</span>(<span class="str">"second"</span>)  <span class="cm"># push</span>\ntop = stack.<span class="fn">pop</span>()       <span class="cm"># "second" — O(1)</span>\n\n<span class="cm"># Queue (FIFO) — use deque for O(1) on both ends</span>\n<span class="kw">from</span> collections <span class="kw">import</span> deque\nqueue = <span class="fn">deque</span>()\nqueue.<span class="fn">append</span>(<span class="str">"first"</span>)    <span class="cm"># enqueue right</span>\nqueue.<span class="fn">append</span>(<span class="str">"second"</span>)   <span class="cm"># enqueue right</span>\nfront = queue.<span class="fn">popleft</span>()  <span class="cm"># "first" — O(1)</span></code></pre></div>'

/* Shallow vs Deep Copy */
+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">SHALLOW COPY</div><div class="compare-item">&bull; <code>lst.copy()</code> or <code>lst[:]</code></div><div class="compare-item">&bull; Creates new list object</div><div class="compare-item">&bull; References same inner objects</div><div class="compare-item">&bull; Modifying nested lists affects both</div></div><div class="compare-col"><div class="compare-title">DEEP COPY</div><div class="compare-item">&bull; <code>copy.deepcopy(lst)</code></div><div class="compare-item">&bull; Creates new list object</div><div class="compare-item">&bull; Recursively copies all objects</div><div class="compare-item">&bull; Completely independent</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> copy\n\noriginal = [[<span class="num">1</span>, <span class="num">2</span>], [<span class="num">3</span>, <span class="num">4</span>]]\nshallow = original.<span class="fn">copy</span>()       <span class="cm"># or original[:]</span>\ndeep = copy.<span class="fn">deepcopy</span>(original)\n\noriginal[<span class="num">0</span>].<span class="fn">append</span>(<span class="num">99</span>)\n<span class="fn">print</span>(shallow)  <span class="cm"># [[1, 2, 99], [3, 4]] — affected!</span>\n<span class="fn">print</span>(deep)     <span class="cm"># [[1, 2], [3, 4]]    — independent</span></code></pre></div>'

/* Plotly: List Operations Time Complexity */
+ '<div id="plot-list-ops" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-list-ops");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var ops = ["append","pop()","insert(0)","pop(0)","index()","sort()","in"];'
+ 'var avg = [1, 1, 1000, 1000, 500, 11000, 500];'
+ 'var colors = ["#4ecdc4","#4ecdc4","#ff6b6b","#ff6b6b","#c8a96e","#ff6b6b","#c8a96e"];'
+ 'Plotly.newPlot(el,[{type:"bar",x:ops,y:avg,marker:{color:colors,line:{color:"rgba(255,255,255,0.1)",width:1}},text:["O(1)","O(1)","O(n)","O(n)","O(n)","O(n log n)","O(n)"],textposition:"outside",textfont:{color:"rgba(255,255,255,0.7)",size:11}}],{title:{text:"List Operations — Time Cost (n=1000)",font:{color:"rgba(255,255,255,.7)",size:14}},xaxis:{title:"Operation",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"}},yaxis:{title:"Relative Time (arbitrary units)",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"},gridcolor:"rgba(255,255,255,.06)"},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",margin:{l:60,r:20,t:50,b:60},height:380},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

+ '<div class="l-note"><strong>Performance takeaway:</strong> Operations at the <em>end</em> of a list are fast (O(1)). Operations at the <em>beginning</em> require shifting every element (O(n)). If you need fast operations on both ends, use <code>collections.deque</code>.</div>'

/* ============================================================
   SECTION 2: TUPLES & NAMED TUPLES
   ============================================================ */
+ '<h2 class="l-title">2. Tuples & Named Tuples</h2>'

+ '<p class="l-text">A <strong>tuple</strong> is an <em>immutable</em> sequence. Once created, you cannot add, remove, or change its elements. This might sound limiting, but immutability is a superpower: tuples are <strong>hashable</strong> (usable as dictionary keys), <strong>memory-efficient</strong> (Python optimizes their storage), and <strong>thread-safe</strong> (no locking needed). Think of tuples as records or rows — fixed collections of related data.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Creating tuples</span>\ncoords = (<span class="num">40.7128</span>, -<span class="num">74.0060</span>)   <span class="cm"># latitude, longitude</span>\nsingleton = (<span class="num">42</span>,)               <span class="cm"># trailing comma needed for single element</span>\nfrom_list = <span class="fn">tuple</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])   <span class="cm"># convert from list</span>\n\n<span class="cm"># Tuple packing and unpacking</span>\npoint = <span class="num">3</span>, <span class="num">7</span>, <span class="num">11</span>               <span class="cm"># packing — parentheses optional</span>\nx, y, z = point                <span class="cm"># unpacking</span>\n\n<span class="cm"># Extended unpacking with *</span>\nfirst, *middle, last = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]\n<span class="cm"># first=1, middle=[2, 3, 4], last=5</span>\n\n<span class="cm"># Swapping variables — tuple unpacking magic</span>\na, b = <span class="num">10</span>, <span class="num">20</span>\na, b = b, a  <span class="cm"># now a=20, b=10 — no temp variable needed</span>\n\n<span class="cm"># Tuples as dictionary keys (lists cannot do this)</span>\nlocations = {}\nlocations[(<span class="num">40.71</span>, -<span class="num">74.00</span>)] = <span class="str">"New York"</span>\nlocations[(<span class="num">51.50</span>, -<span class="num">0.12</span>)] = <span class="str">"London"</span></code></pre></div>'

+ '<div class="think-box"><strong>Think about it:</strong> Why can tuples be dictionary keys but lists cannot? Because dictionary keys must be <strong>hashable</strong>, which requires immutability. If you could mutate a key after insertion, the hash would change and the dictionary would break — the key would be stored in the wrong bucket and become unfindable. Tuples guarantee this can never happen.</div>'

/* Named Tuples */
+ '<p class="l-text"><strong>Named tuples</strong> give your tuple fields meaningful names instead of cryptic integer indices. They are like lightweight classes without the boilerplate:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Old-style: collections.namedtuple</span>\n<span class="kw">from</span> collections <span class="kw">import</span> namedtuple\n\nPoint = <span class="fn">namedtuple</span>(<span class="str">"Point"</span>, [<span class="str">"x"</span>, <span class="str">"y"</span>, <span class="str">"z"</span>])\np = <span class="fn">Point</span>(<span class="num">1.0</span>, <span class="num">2.5</span>, <span class="num">3.7</span>)\n<span class="fn">print</span>(p.x, p.y)  <span class="cm"># 1.0 2.5 — access by name</span>\n<span class="fn">print</span>(p[<span class="num">0</span>])      <span class="cm"># 1.0     — still works by index</span>\n\n<span class="cm"># Modern style: typing.NamedTuple (Python 3.6+)</span>\n<span class="kw">from</span> typing <span class="kw">import</span> NamedTuple\n\n<span class="kw">class</span> <span class="fn">Student</span>(NamedTuple):\n    name: <span class="fn">str</span>\n    gpa: <span class="fn">float</span>\n    year: <span class="fn">int</span> = <span class="num">1</span>  <span class="cm"># default value</span>\n\ns = <span class="fn">Student</span>(<span class="str">"Alice"</span>, <span class="num">3.9</span>)\n<span class="fn">print</span>(s.name, s.gpa, s.year)  <span class="cm"># Alice 3.9 1</span>\n<span class="fn">print</span>(s._asdict())  <span class="cm"># {\'name\': \'Alice\', \'gpa\': 3.9, \'year\': 1}</span></code></pre></div>'

/* Decision tree: tuple vs list */
+ '<div class="calc-steps"><div class="cs-title">Decision Tree: Tuple vs List</div>'
+ '<div class="cs-step"><div class="cs-num">?</div><div class="cs-body">Will the collection change after creation? (add/remove/modify items)</div></div>'
+ '<div class="cs-step"><div class="cs-num">Y</div><div class="cs-body">Use a <strong>list</strong> — mutable, resizable, O(1) append</div></div>'
+ '<div class="cs-step"><div class="cs-num">N</div><div class="cs-body">Is the data a fixed record (like a coordinate, RGB color, database row)?</div></div>'
+ '<div class="cs-step"><div class="cs-num">Y</div><div class="cs-body">Use a <strong>named tuple</strong> — readable, immutable, memory-efficient</div></div>'
+ '<div class="cs-step"><div class="cs-num">N</div><div class="cs-body">Do you need it as a dictionary key or set element?</div></div>'
+ '<div class="cs-step"><div class="cs-num">Y</div><div class="cs-body">Use a <strong>tuple</strong> — hashable, immutable</div></div>'
+ '<div class="cs-step"><div class="cs-num">N</div><div class="cs-body">Use a <strong>tuple</strong> for safety, or <strong>list</strong> if unsure</div></div>'
+ '</div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">TUPLE</div><div class="compare-item">&bull; Immutable</div><div class="compare-item">&bull; Hashable (can be dict key)</div><div class="compare-item">&bull; Slightly faster iteration</div><div class="compare-item">&bull; Less memory (no over-allocation)</div><div class="compare-item">&bull; Signals "this won\'t change"</div></div><div class="compare-col"><div class="compare-title">LIST</div><div class="compare-item">&bull; Mutable</div><div class="compare-item">&bull; Not hashable</div><div class="compare-item">&bull; Has append/extend/sort methods</div><div class="compare-item">&bull; More memory (over-allocates)</div><div class="compare-item">&bull; Signals "this may change"</div></div></div>'

/* ============================================================
   SECTION 3: DICTIONARIES
   ============================================================ */
+ '<h2 class="l-title">3. Dictionaries</h2>'

+ '<p class="l-text">The <strong>dictionary</strong> is arguably Python\'s most important data structure. Built on a <strong>hash table</strong>, it provides O(1) average-time lookups, insertions, and deletions. Every Python object\'s attribute namespace is a dict. Module globals are a dict. Keyword arguments are a dict. Understanding dicts is understanding Python itself.</p>'

+ '<div class="calc-highlight"><strong>How hashing works:</strong> When you write <code>d["key"] = value</code>, Python calls <code>hash("key")</code> to get an integer, maps that integer to a slot in an internal array, and stores the key-value pair there. Lookup does the same hash computation to jump directly to the right slot — no scanning. This is why dict lookup is O(1) regardless of size, while list lookup (<code>in</code>) is O(n).</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Creating dictionaries</span>\nstudent = {<span class="str">"name"</span>: <span class="str">"Alice"</span>, <span class="str">"age"</span>: <span class="num">22</span>, <span class="str">"gpa"</span>: <span class="num">3.9</span>}\nfrom_pairs = <span class="fn">dict</span>([(<span class="str">"a"</span>, <span class="num">1</span>), (<span class="str">"b"</span>, <span class="num">2</span>)])  <span class="cm"># from list of tuples</span>\nfrom_kwargs = <span class="fn">dict</span>(x=<span class="num">10</span>, y=<span class="num">20</span>)              <span class="cm"># keyword arguments</span>\n\n<span class="cm"># Dict comprehension</span>\nsquares = {x: x**<span class="num">2</span> <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">6</span>)}\n<span class="cm"># {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}</span>\n\nword_lengths = {w: <span class="fn">len</span>(w) <span class="kw">for</span> w <span class="kw">in</span> [<span class="str">"cat"</span>, <span class="str">"elephant"</span>, <span class="str">"dog"</span>]}\n<span class="cm"># {\'cat\': 3, \'elephant\': 8, \'dog\': 3}</span></code></pre></div>'

/* Dict Methods Cards */
+ '<p class="l-text"><strong>Essential dictionary methods:</strong></p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="cc-icon">?</div><div class="cc-title">get(key, default)</div><div class="cc-body">Returns value or default if key missing. Never raises KeyError.<br><code>d.get("age", 0)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">!</div><div class="cc-title">setdefault(k, v)</div><div class="cc-body">If key exists, return value. If not, insert key with default and return it.<br><code>d.setdefault("count", 0)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&oplus;</div><div class="cc-title">update(other)</div><div class="cc-body">Merge another dict or iterable of pairs. Overwrites existing keys.<br><code>d.update({"a": 1})</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&minus;</div><div class="cc-title">pop(key, default)</div><div class="cc-body">Remove key and return value. Optional default avoids KeyError.<br><code>val = d.pop("old")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&equiv;</div><div class="cc-title">items() / keys() / values()</div><div class="cc-body">Return view objects. Items gives (key, value) tuples.<br><code>for k, v in d.items():</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">|</div><div class="cc-title">Merge: | and |=</div><div class="cc-body">Python 3.9+ merge operators.<br><code>merged = d1 | d2</code><br><code>d1 |= d2</code> (in-place)</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Iteration patterns</strong> — dictionaries preserve insertion order (guaranteed since Python 3.7):</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>scores = {<span class="str">"Alice"</span>: <span class="num">95</span>, <span class="str">"Bob"</span>: <span class="num">87</span>, <span class="str">"Charlie"</span>: <span class="num">92</span>}\n\n<span class="cm"># Iterate over keys (default)</span>\n<span class="kw">for</span> name <span class="kw">in</span> scores:\n    <span class="fn">print</span>(name)\n\n<span class="cm"># Iterate over key-value pairs</span>\n<span class="kw">for</span> name, score <span class="kw">in</span> scores.<span class="fn">items</span>():\n    <span class="fn">print</span>(<span class="str">f"{name}: {score}"</span>)\n\n<span class="cm"># Sort by value</span>\nsorted_scores = <span class="fn">dict</span>(<span class="fn">sorted</span>(scores.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: x[<span class="num">1</span>], reverse=<span class="kw">True</span>))\n<span class="cm"># {\'Alice\': 95, \'Charlie\': 92, \'Bob\': 87}</span>\n\n<span class="cm"># Merge dictionaries (Python 3.9+)</span>\ndefaults = {<span class="str">"color"</span>: <span class="str">"blue"</span>, <span class="str">"size"</span>: <span class="str">"medium"</span>}\nuser_prefs = {<span class="str">"color"</span>: <span class="str">"red"</span>}\nfinal = defaults | user_prefs  <span class="cm"># {\'color\': \'red\', \'size\': \'medium\'}</span></code></pre></div>'

/* Specialized dict types */
+ '<p class="l-text"><strong>Specialized dictionaries</strong> from the <code>collections</code> module solve common patterns elegantly:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> defaultdict, Counter, OrderedDict, ChainMap\n\n<span class="cm"># defaultdict — auto-creates missing keys</span>\nword_count = <span class="fn">defaultdict</span>(<span class="fn">int</span>)  <span class="cm"># default value = 0</span>\n<span class="kw">for</span> word <span class="kw">in</span> <span class="str">"the cat sat on the mat"</span>.<span class="fn">split</span>():\n    word_count[word] += <span class="num">1</span>  <span class="cm"># no KeyError, even for new words</span>\n<span class="cm"># defaultdict(int, {\'the\': 2, \'cat\': 1, \'sat\': 1, \'on\': 1, \'mat\': 1})</span>\n\n<span class="cm"># Group items with defaultdict(list)</span>\nstudents_by_grade = <span class="fn">defaultdict</span>(<span class="fn">list</span>)\n<span class="kw">for</span> name, grade <span class="kw">in</span> [(<span class="str">"Alice"</span>,<span class="str">"A"</span>), (<span class="str">"Bob"</span>,<span class="str">"B"</span>), (<span class="str">"Carol"</span>,<span class="str">"A"</span>)]:\n    students_by_grade[grade].<span class="fn">append</span>(name)\n<span class="cm"># {\'A\': [\'Alice\', \'Carol\'], \'B\': [\'Bob\']}</span>\n\n<span class="cm"># Counter — count things effortlessly</span>\ntext = <span class="str">"to be or not to be"</span>\ncounts = <span class="fn">Counter</span>(text.<span class="fn">split</span>())\n<span class="fn">print</span>(counts.<span class="fn">most_common</span>(<span class="num">2</span>))  <span class="cm"># [(\'to\', 2), (\'be\', 2)]</span>\n\n<span class="cm"># Counter arithmetic</span>\nc1 = <span class="fn">Counter</span>(a=<span class="num">3</span>, b=<span class="num">1</span>)\nc2 = <span class="fn">Counter</span>(a=<span class="num">1</span>, b=<span class="num">2</span>)\n<span class="fn">print</span>(c1 + c2)  <span class="cm"># Counter({\'a\': 4, \'b\': 3})</span>\n<span class="fn">print</span>(c1 - c2)  <span class="cm"># Counter({\'a\': 2})  — drops zero/negative</span>\n\n<span class="cm"># ChainMap — search multiple dicts in order</span>\nenv_defaults = {<span class="str">"DEBUG"</span>: <span class="kw">False</span>, <span class="str">"PORT"</span>: <span class="num">8080</span>}\nenv_overrides = {<span class="str">"DEBUG"</span>: <span class="kw">True</span>}\nconfig = <span class="fn">ChainMap</span>(env_overrides, env_defaults)\n<span class="fn">print</span>(config[<span class="str">"DEBUG"</span>])  <span class="cm"># True  — found in first dict</span>\n<span class="fn">print</span>(config[<span class="str">"PORT"</span>])   <span class="cm"># 8080  — falls through to second</span></code></pre></div>'

/* Plotly: Hash Table Lookup vs List Search */
+ '<div id="plot-hash-lookup" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-hash-lookup");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var sizes = [100,500,1000,5000,10000,50000,100000];'
+ 'var listTime = sizes.map(function(n){return n/2;});'
+ 'var dictTime = sizes.map(function(){return 1;});'
+ 'Plotly.newPlot(el,['
+ '{x:sizes,y:listTime,name:"list (in) — O(n)",mode:"lines+markers",line:{color:"#ff6b6b",width:2},marker:{size:6}},'
+ '{x:sizes,y:dictTime,name:"dict ([ ]) — O(1)",mode:"lines+markers",line:{color:"#4ecdc4",width:2},marker:{size:6}}'
+ '],{title:{text:"Lookup Performance: List vs Dictionary",font:{color:"rgba(255,255,255,.7)",size:14}},xaxis:{title:"Number of Elements",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"},gridcolor:"rgba(255,255,255,.06)"},yaxis:{title:"Average Comparisons",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"},gridcolor:"rgba(255,255,255,.06)"},legend:{font:{color:"rgba(255,255,255,.6)"},bgcolor:"rgba(0,0,0,0)"},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",margin:{l:60,r:20,t:50,b:60},height:380},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

+ '<div class="l-note"><strong>NLP Connection:</strong> Dictionaries are everywhere in NLP. A vocabulary maps words to integer IDs. TF-IDF stores term frequencies as <code>{word: count}</code>. Word embeddings map tokens to vectors. <code>Counter</code> is the fastest way to build word frequency distributions. If you are processing text, you are using dicts.</div>'

/* ============================================================
   SECTION 4: SETS & FROZEN SETS
   ============================================================ */
+ '<h2 class="l-title">4. Sets & Frozen Sets</h2>'

+ '<p class="l-text">A <strong>set</strong> is an unordered collection of <em>unique</em> hashable elements. Like dictionaries, sets are built on hash tables, so membership testing (<code>in</code>) is O(1). Sets shine when you need to eliminate duplicates, test membership, or perform mathematical set operations like union, intersection, and difference.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Creating sets</span>\ncolors = {<span class="str">"red"</span>, <span class="str">"green"</span>, <span class="str">"blue"</span>}    <span class="cm"># set literal</span>\nempty_set = <span class="fn">set</span>()                    <span class="cm"># NOT {} — that\'s an empty dict!</span>\nfrom_list = <span class="fn">set</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">3</span>])   <span class="cm"># {1, 2, 3} — duplicates removed</span>\n\n<span class="cm"># Set comprehension</span>\nvowels = {c <span class="kw">for</span> c <span class="kw">in</span> <span class="str">"hello world"</span> <span class="kw">if</span> c <span class="kw">in</span> <span class="str">"aeiou"</span>}  <span class="cm"># {\'e\', \'o\'}</span>\n\n<span class="cm"># Membership testing — O(1)!</span>\n<span class="fn">print</span>(<span class="str">"red"</span> <span class="kw">in</span> colors)   <span class="cm"># True  — instant</span>\n\n<span class="cm"># Remove duplicates from a list (preserving order in Python 3.7+)</span>\nraw = [<span class="num">3</span>, <span class="num">1</span>, <span class="num">4</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">9</span>, <span class="num">2</span>, <span class="num">6</span>, <span class="num">5</span>]\nunique = <span class="fn">list</span>(<span class="fn">dict</span>.<span class="fn">fromkeys</span>(raw))  <span class="cm"># [3, 1, 4, 5, 9, 2, 6] — order preserved</span></code></pre></div>'

/* Set Operations */
+ '<p class="l-text"><strong>Set operations</strong> implement mathematical set theory directly in Python:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="cc-icon">&cup;</div><div class="cc-title">Union</div><div class="cc-body"><code>a | b</code> or <code>a.union(b)</code><br><br>All elements in either set.<br>{1,2,3} | {3,4,5} = {1,2,3,4,5}</div></div>'
+ '<div class="calc-card"><div class="cc-icon">&cap;</div><div class="cc-title">Intersection</div><div class="cc-body"><code>a & b</code> or <code>a.intersection(b)</code><br><br>Elements in both sets.<br>{1,2,3} & {3,4,5} = {3}</div></div>'
+ '<div class="calc-card"><div class="cc-icon">&minus;</div><div class="cc-title">Difference</div><div class="cc-body"><code>a - b</code> or <code>a.difference(b)</code><br><br>Elements in a but not b.<br>{1,2,3} - {3,4,5} = {1,2}</div></div>'
+ '<div class="calc-card"><div class="cc-icon">&Delta;</div><div class="cc-title">Symmetric Diff</div><div class="cc-body"><code>a ^ b</code> or <code>a.symmetric_difference(b)</code><br><br>In either but not both.<br>{1,2,3} ^ {3,4,5} = {1,2,4,5}</div></div>'
+ '</div>'

/* Plotly: Venn Diagram for Set Operations */
+ '<div id="plot-set-venn" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-set-venn");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var theta = [];for(var i=0;i<=360;i++) theta.push(i*Math.PI/180);'
+ 'var cx1=-0.6,cy1=0,cx2=0.6,cy2=0,r=1.2;'
+ 'var x1=[],y1=[],x2=[],y2=[];'
+ 'for(var i=0;i<theta.length;i++){'
+ '  x1.push(cx1+r*Math.cos(theta[i]));y1.push(cy1+r*Math.sin(theta[i]));'
+ '  x2.push(cx2+r*Math.cos(theta[i]));y2.push(cy2+r*Math.sin(theta[i]));'
+ '}'
+ 'Plotly.newPlot(el,['
+ '{x:x1,y:y1,mode:"lines",line:{color:"#4ecdc4",width:2.5},fill:"toself",fillcolor:"rgba(78,205,196,0.12)",name:"Set A = {1,2,3,4}"},'
+ '{x:x2,y:y2,mode:"lines",line:{color:"#c8a96e",width:2.5},fill:"toself",fillcolor:"rgba(200,169,110,0.12)",name:"Set B = {3,4,5,6}"}'
+ '],{'
+ 'annotations:['
+ '{x:-1.0,y:0,text:"1, 2",showarrow:false,font:{color:"#4ecdc4",size:15}},'
+ '{x:0,y:0,text:"3, 4",showarrow:false,font:{color:"#e0e0e0",size:15}},'
+ '{x:1.0,y:0,text:"5, 6",showarrow:false,font:{color:"#c8a96e",size:15}},'
+ '{x:-1.0,y:-1.6,text:"A - B",showarrow:false,font:{color:"#4ecdc4",size:11}},'
+ '{x:0,y:-1.6,text:"A & B",showarrow:false,font:{color:"#e0e0e0",size:11}},'
+ '{x:1.0,y:-1.6,text:"B - A",showarrow:false,font:{color:"#c8a96e",size:11}}'
+ '],'
+ 'title:{text:"Set Operations Visualized",font:{color:"rgba(255,255,255,.7)",size:14}},'
+ 'xaxis:{visible:false,range:[-2.2,2.2]},yaxis:{visible:false,range:[-2,1.8],scaleanchor:"x"},'
+ 'legend:{font:{color:"rgba(255,255,255,.6)"},bgcolor:"rgba(0,0,0,0)"},'
+ 'paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",'
+ 'margin:{l:20,r:20,t:50,b:20},height:380'
+ '},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

/* Frozen Sets */
+ '<p class="l-text"><strong>Frozenset</strong> is the immutable version of set, just as tuple is to list. Because it is hashable, you can use a frozenset as a dictionary key or as an element of another set:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Frozenset — immutable set</span>\nfs = <span class="fn">frozenset</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])\n<span class="cm"># fs.add(4)  # AttributeError — immutable!</span>\n\n<span class="cm"># Use as dict key or set element</span>\npermissions = {\n    <span class="fn">frozenset</span>({<span class="str">"read"</span>}): <span class="str">"viewer"</span>,\n    <span class="fn">frozenset</span>({<span class="str">"read"</span>, <span class="str">"write"</span>}): <span class="str">"editor"</span>,\n    <span class="fn">frozenset</span>({<span class="str">"read"</span>, <span class="str">"write"</span>, <span class="str">"admin"</span>}): <span class="str">"admin"</span>\n}\n\n<span class="cm"># Set of sets (only possible with frozenset)</span>\npower_set = {<span class="fn">frozenset</span>(), <span class="fn">frozenset</span>({<span class="num">1</span>}), <span class="fn">frozenset</span>({<span class="num">2</span>}), <span class="fn">frozenset</span>({<span class="num">1</span>,<span class="num">2</span>})}</code></pre></div>'

+ '<div class="think-box"><strong>Think about it:</strong> When processing NLP data, you often need to find common words between two documents, or unique words in one but not another. These are literally set intersection and difference. Converting your word lists to sets makes these operations both elegant and blazingly fast — O(min(len(a), len(b))) instead of O(n*m).</div>'

/* ============================================================
   SECTION 5: ADVANCED PATTERNS
   ============================================================ */
+ '<h2 class="l-title">5. Advanced Patterns</h2>'

+ '<p class="l-text">Real-world data is rarely flat. You will encounter <strong>nested structures</strong> — lists of dicts, dicts of lists, trees of arbitrary depth. Mastering these patterns and the tools to manipulate them separates beginners from professional developers.</p>'

/* Nested structures */
+ '<div class="calc-highlight"><strong>Nested data is everywhere:</strong> JSON APIs return nested dicts. DataFrames are lists of lists. NLP parse trees are recursive structures. A word embedding model is a dict mapping strings to lists of floats. Learning to navigate and transform these structures is essential.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Nested data — JSON-like structure</span>\nstudents = [\n    {<span class="str">"name"</span>: <span class="str">"Alice"</span>, <span class="str">"scores"</span>: [<span class="num">95</span>, <span class="num">87</span>, <span class="num">92</span>], <span class="str">"courses"</span>: {<span class="str">"math"</span>: <span class="str">"A"</span>}},\n    {<span class="str">"name"</span>: <span class="str">"Bob"</span>,   <span class="str">"scores"</span>: [<span class="num">78</span>, <span class="num">85</span>, <span class="num">90</span>], <span class="str">"courses"</span>: {<span class="str">"math"</span>: <span class="str">"B"</span>}},\n]\n\n<span class="cm"># Access deeply nested data</span>\nalice_math = students[<span class="num">0</span>][<span class="str">"courses"</span>][<span class="str">"math"</span>]  <span class="cm"># "A"</span>\n\n<span class="cm"># Flatten nested lists</span>\nnested = [[<span class="num">1</span>, <span class="num">2</span>], [<span class="num">3</span>, <span class="num">4</span>], [<span class="num">5</span>, <span class="num">6</span>]]\nflat = [x <span class="kw">for</span> sub <span class="kw">in</span> nested <span class="kw">for</span> x <span class="kw">in</span> sub]  <span class="cm"># [1, 2, 3, 4, 5, 6]</span>\n\n<span class="cm"># Flatten with itertools.chain (cleaner for large data)</span>\n<span class="kw">from</span> itertools <span class="kw">import</span> chain\nflat2 = <span class="fn">list</span>(chain.<span class="fn">from_iterable</span>(nested))  <span class="cm"># [1, 2, 3, 4, 5, 6]</span>\n\n<span class="cm"># Extract all scores from nested structure</span>\nall_scores = [s <span class="kw">for</span> st <span class="kw">in</span> students <span class="kw">for</span> s <span class="kw">in</span> st[<span class="str">"scores"</span>]]  <span class="cm"># [95, 87, 92, 78, 85, 90]</span></code></pre></div>'

/* itertools */
+ '<p class="l-text"><strong>itertools</strong> — the Swiss Army knife for iteration. This standard library module provides memory-efficient tools for working with iterators:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> itertools <span class="kw">import</span> chain, product, permutations, combinations, groupby\n\n<span class="cm"># chain — concatenate iterables lazily</span>\ncombined = <span class="fn">list</span>(chain.<span class="fn">from_iterable</span>([[<span class="num">1</span>,<span class="num">2</span>], [<span class="num">3</span>,<span class="num">4</span>], [<span class="num">5</span>]]))\n<span class="cm"># [1, 2, 3, 4, 5]</span>\n\n<span class="cm"># product — Cartesian product (all combinations)</span>\ncolors = [<span class="str">"red"</span>, <span class="str">"blue"</span>]\nsizes = [<span class="str">"S"</span>, <span class="str">"M"</span>, <span class="str">"L"</span>]\nvariants = <span class="fn">list</span>(<span class="fn">product</span>(colors, sizes))\n<span class="cm"># [(\'red\',\'S\'), (\'red\',\'M\'), (\'red\',\'L\'), (\'blue\',\'S\'), ...]</span>\n\n<span class="cm"># permutations — all orderings</span>\n<span class="fn">list</span>(<span class="fn">permutations</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>], <span class="num">2</span>))  <span class="cm"># [(1,2),(1,3),(2,1),(2,3),(3,1),(3,2)]</span>\n\n<span class="cm"># combinations — unique selections (order doesn\'t matter)</span>\n<span class="fn">list</span>(<span class="fn">combinations</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>], <span class="num">2</span>))  <span class="cm"># [(1,2),(1,3),(2,3)]</span>\n\n<span class="cm"># groupby — group consecutive items</span>\ndata = <span class="fn">sorted</span>([(<span class="str">"fruit"</span>,<span class="str">"apple"</span>), (<span class="str">"veg"</span>,<span class="str">"carrot"</span>), (<span class="str">"fruit"</span>,<span class="str">"banana"</span>)])\n<span class="kw">for</span> key, group <span class="kw">in</span> <span class="fn">groupby</span>(data, key=<span class="kw">lambda</span> x: x[<span class="num">0</span>]):\n    <span class="fn">print</span>(key, <span class="fn">list</span>(group))\n<span class="cm"># fruit [(\'fruit\', \'apple\'), (\'fruit\', \'banana\')]</span>\n<span class="cm"># veg   [(\'veg\', \'carrot\')]</span></code></pre></div>'

/* heapq and bisect */
+ '<p class="l-text"><strong>heapq and bisect</strong> — specialized tools for sorted data and priority queues:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">heapq (Priority Queue)</div><div class="compare-item">&bull; <code>heappush(h, item)</code> — O(log n)</div><div class="compare-item">&bull; <code>heappop(h)</code> — O(log n)</div><div class="compare-item">&bull; <code>nlargest(k, iter)</code> — top-k efficiently</div><div class="compare-item">&bull; Always a min-heap (smallest first)</div><div class="compare-item">&bull; Use for: task scheduling, Dijkstra, merge sorted streams</div></div><div class="compare-col"><div class="compare-title">bisect (Sorted Insertion)</div><div class="compare-item">&bull; <code>bisect_left(a, x)</code> — O(log n)</div><div class="compare-item">&bull; <code>insort(a, x)</code> — O(n) total</div><div class="compare-item">&bull; Binary search on sorted lists</div><div class="compare-item">&bull; Keeps list sorted after insertion</div><div class="compare-item">&bull; Use for: maintaining sorted order, binary search</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> heapq, bisect\n\n<span class="cm"># heapq — top-3 highest scores without sorting everything</span>\nscores = [<span class="num">72</span>, <span class="num">95</span>, <span class="num">88</span>, <span class="num">41</span>, <span class="num">67</span>, <span class="num">93</span>, <span class="num">55</span>, <span class="num">82</span>]\ntop3 = heapq.<span class="fn">nlargest</span>(<span class="num">3</span>, scores)   <span class="cm"># [95, 93, 88]</span>\nbot3 = heapq.<span class="fn">nsmallest</span>(<span class="num">3</span>, scores)  <span class="cm"># [41, 55, 67]</span>\n\n<span class="cm"># Priority queue pattern</span>\ntasks = []\nheapq.<span class="fn">heappush</span>(tasks, (<span class="num">3</span>, <span class="str">"low priority"</span>))\nheapq.<span class="fn">heappush</span>(tasks, (<span class="num">1</span>, <span class="str">"urgent"</span>))\nheapq.<span class="fn">heappush</span>(tasks, (<span class="num">2</span>, <span class="str">"medium"</span>))\n<span class="fn">print</span>(heapq.<span class="fn">heappop</span>(tasks))  <span class="cm"># (1, \'urgent\') — smallest first</span>\n\n<span class="cm"># bisect — insert into sorted list</span>\nsorted_data = [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>, <span class="num">50</span>]\nbisect.<span class="fn">insort</span>(sorted_data, <span class="num">25</span>)\n<span class="fn">print</span>(sorted_data)  <span class="cm"># [10, 20, 25, 30, 40, 50]</span>\n\n<span class="cm"># Binary search: find insertion point</span>\nidx = bisect.<span class="fn">bisect_left</span>(sorted_data, <span class="num">30</span>)\n<span class="fn">print</span>(idx)  <span class="cm"># 3 — where 30 lives</span></code></pre></div>'

+ '<div class="l-note"><strong>Practical tip:</strong> <code>heapq.nlargest</code> and <code>heapq.nsmallest</code> are the fastest way to find top-k elements when k is much smaller than n. For k close to n, just use <code>sorted()</code>. For k=1, use <code>min()</code> or <code>max()</code>.</div>'

/* ============================================================
   SECTION 6: CHOOSING THE RIGHT STRUCTURE
   ============================================================ */
+ '<h2 class="l-title">6. Choosing the Right Structure</h2>'

+ '<p class="l-text">Knowing all the data structures is only half the battle. The real skill is knowing <strong>when to use which one</strong>. The wrong choice can make your program 100x slower or use 10x more memory. Here is a comprehensive comparison to guide your decisions:</p>'

/* Big O Comparison Table */
+ '<div class="calc-example"><div class="ce-label">Big O Comparison Table</div><div class="ce-body">'
+ '<table style="width:100%;border-collapse:collapse;font-family:monospace;font-size:13px;">'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.15);">'
+ '<th style="text-align:left;padding:6px;color:#c8a96e;">Operation</th>'
+ '<th style="text-align:center;padding:6px;color:#4ecdc4;">list</th>'
+ '<th style="text-align:center;padding:6px;color:#a78bfa;">tuple</th>'
+ '<th style="text-align:center;padding:6px;color:#c8a96e;">dict</th>'
+ '<th style="text-align:center;padding:6px;color:#ff6b6b;">set</th></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Lookup by index</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Lookup by key</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Search (in)</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Insert at end</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)*</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Insert at start</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Delete</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Sort</td><td style="text-align:center;padding:6px;color:#c8a96e;">O(n log n)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">N/A</td></tr>'
+ '<tr><td style="padding:6px;">Memory per element</td><td style="text-align:center;padding:6px;">~8 bytes</td><td style="text-align:center;padding:6px;">~8 bytes</td><td style="text-align:center;padding:6px;">~50-70 bytes</td><td style="text-align:center;padding:6px;">~50 bytes</td></tr>'
+ '</table>'
+ '<p style="margin-top:8px;font-size:12px;opacity:0.5;">* amortized. Green = fast, Red = slow, Gold = moderate.</p>'
+ '</div></div>'

/* Decision Flowchart */
+ '<div class="calc-steps"><div class="cs-title">Decision Flowchart: Which Structure?</div>'
+ '<div class="cs-step"><div class="cs-num">1</div><div class="cs-body">Do you need <strong>key-value pairs</strong>? &rarr; Use a <strong>dict</strong> (or defaultdict, Counter, OrderedDict)</div></div>'
+ '<div class="cs-step"><div class="cs-num">2</div><div class="cs-body">Do you need only <strong>unique elements</strong> with fast membership testing? &rarr; Use a <strong>set</strong> (or frozenset if immutable)</div></div>'
+ '<div class="cs-step"><div class="cs-num">3</div><div class="cs-body">Is the data a <strong>fixed record</strong> that should not change? &rarr; Use a <strong>tuple</strong> (or NamedTuple for named fields)</div></div>'
+ '<div class="cs-step"><div class="cs-num">4</div><div class="cs-body">Do you need an <strong>ordered, mutable</strong> collection? &rarr; Use a <strong>list</strong></div></div>'
+ '<div class="cs-step"><div class="cs-num">5</div><div class="cs-body">Need fast append/pop from <strong>both ends</strong>? &rarr; Use <strong>collections.deque</strong></div></div>'
+ '<div class="cs-step"><div class="cs-num">6</div><div class="cs-body">Need to maintain a <strong>sorted</strong> collection with fast min/max? &rarr; Use <strong>heapq</strong></div></div>'
+ '</div>'

/* Plotly: Comprehensive Comparison */
+ '<div id="plot-structure-compare" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-structure-compare");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var structs = ["list","tuple","dict","set","deque"];'
+ 'var lookup = [5,5,10,10,5];'
+ 'var insert = [7,0,10,10,10];'
+ 'var search = [3,3,10,10,3];'
+ 'var memory = [8,9,4,5,7];'
+ 'Plotly.newPlot(el,['
+ '{type:"scatterpolar",r:lookup.concat(lookup[0]),theta:["Lookup","Insert","Search","Memory Eff.","Flexibility","Lookup"],fill:"toself",name:"list",line:{color:"#4ecdc4"},fillcolor:"rgba(78,205,196,0.1)"},'
+ '{type:"scatterpolar",r:[5,0,3,9,3,5],theta:["Lookup","Insert","Search","Memory Eff.","Flexibility","Lookup"],fill:"toself",name:"tuple",line:{color:"#a78bfa"},fillcolor:"rgba(167,139,250,0.1)"},'
+ '{type:"scatterpolar",r:[10,10,10,4,8,10],theta:["Lookup","Insert","Search","Memory Eff.","Flexibility","Lookup"],fill:"toself",name:"dict",line:{color:"#c8a96e"},fillcolor:"rgba(200,169,110,0.1)"},'
+ '{type:"scatterpolar",r:[0,10,10,5,4,0],theta:["Lookup","Insert","Search","Memory Eff.","Flexibility","Lookup"],fill:"toself",name:"set",line:{color:"#ff6b6b"},fillcolor:"rgba(255,107,107,0.1)"}'
+ '],{polar:{radialaxis:{visible:true,range:[0,10],tickfont:{color:"rgba(255,255,255,0.4)"},gridcolor:"rgba(255,255,255,0.08)"},angularaxis:{tickfont:{color:"rgba(255,255,255,0.6)"},gridcolor:"rgba(255,255,255,0.08)"},bgcolor:"rgba(0,0,0,0)"},title:{text:"Data Structure Strengths Comparison (0-10)",font:{color:"rgba(255,255,255,.7)",size:14}},legend:{font:{color:"rgba(255,255,255,.6)"},bgcolor:"rgba(0,0,0,0)"},paper_bgcolor:"rgba(0,0,0,0)",margin:{l:60,r:60,t:60,b:40},height:420},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

/* Real-world examples */
+ '<div class="calc-highlight"><strong>Real-world decision examples:</strong><br><br>&bull; <strong>Storing user profiles</strong> &rarr; <code>dict</code> (key: user_id, value: profile data)<br>&bull; <strong>Processing a CSV row by row</strong> &rarr; <code>list</code> of <code>tuple</code>s or <code>NamedTuple</code>s<br>&bull; <strong>Finding common words in two documents</strong> &rarr; <code>set</code> intersection<br>&bull; <strong>Counting word frequencies</strong> &rarr; <code>Counter</code> (specialized dict)<br>&bull; <strong>Caching expensive computations</strong> &rarr; <code>dict</code> as memoization table<br>&bull; <strong>BFS graph traversal</strong> &rarr; <code>deque</code> as queue + <code>set</code> for visited<br>&bull; <strong>Returning multiple values from a function</strong> &rarr; <code>tuple</code> or <code>NamedTuple</code><br>&bull; <strong>Configuration with defaults and overrides</strong> &rarr; <code>ChainMap</code></div>'

+ '<div class="calc-example"><div class="ce-label">Summary</div><div class="ce-body"><p class="l-text">You have now mastered Python\'s core data structures: <strong>lists</strong> (dynamic arrays with O(1) append), <strong>tuples</strong> (immutable records, hashable), <strong>dictionaries</strong> (O(1) key-value hash maps), and <strong>sets</strong> (unique elements with O(1) membership). You explored the <code>collections</code> module (<code>defaultdict</code>, <code>Counter</code>, <code>ChainMap</code>, <code>deque</code>), the <code>itertools</code> toolkit, and <code>heapq</code>/<code>bisect</code> for sorted data. Most importantly, you learned <strong>when</strong> to use each structure based on time complexity, memory, and the nature of your data. In the next lesson, we will explore <strong>functions and functional programming</strong> — building reusable, composable code.</p></div></div>'

,

/* ================================================================
   ================================================================
   TURKISH TRANSLATION
   ================================================================
   ================================================================ */

tr: '<p class="l-text"><strong>Veri yapıları her programın temelini oluşturur.</strong> Algoritmalar programlamanın fiilleri ise, veri yapıları isimleridir — verilerinizin nasıl organize edildiğini, erişildiğini ve değiştirildiğini tanımlarlar. Doğru yapıyı seçmek, milisaniyelerde çalışan bir program ile saatler süren bir program arasındaki fark anlamına gelebilir. Python size dört temel araç sunar: <strong>listeler</strong>, <strong>demetler</strong>, <strong>sözlükler</strong> ve <strong>kümeler</strong> — artı <code>collections</code> modülündeki uzmanlaşmış yapılar.</p>'

+ '<p class="l-text">Bu ders her yapının derinliklerine iner: sadece sözdizimi değil, her tasarım seçiminin <em>neden</em> yapıldığını öğreneceksiniz. Zaman karmaşıklığını, bellek düzenini, değişkenlik sözleşmelerini ve profesyonel Python geliştiricilerinin günlük olarak kullandığı gerçek dünya kalıplarını inceleyeceğiz. Sonunda, herhangi bir problem için mükemmel veri yapısını içgüdüsel olarak seçebileceksiniz.</p>'
+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Erişim deseni ve değişebilirliğe göre list, tuple, dict ve set arasında seç</li><li>Listeleri indeksleme, dilimleme ve metodlarla gez, dilimle ve güncelle</li><li>Değişmez kayıtlar için tuple, anahtarlı veri için dict kullan</li><li>Tekilleştirme ve karşılaştırma için küme işlemlerini (birleşim, kesişim, fark) uygula</li><li>Özlü dönüşümler için list, dict ve set comprehension yaz</li><li>Gruplama ve sayma gibi yaygın görevler için doğru veri yapısını seç</li></ul></div>'


/* ============================================================
   BÖLÜM 1: LİSTELER DETAYLI
   ============================================================ */
+ '<h2 class="l-title">1. Listeler Detaylı</h2>'

+ '<div class="calc-highlight"><strong>Liste gerçekte nedir?</strong> Python listesi aslında bir <strong>dinamik dizi</strong>dir — bellekte başka yerlerde saklanan nesnelere işaretçilerin (referansların) ardışık bir bloğudur. <code>append()</code> yaptığınızda iç dizi doluysa, Python <em>yeni, daha büyük</em> bir dizi ayırır (genellikle eskisinin ~1.125 katı), işaretçileri kopyalar ve eskisini serbest bırakır. Bu yüzden <code>append()</code> <strong>amortize O(1)</strong> dir — çoğu çağrı anında yapılır ama ara sıra biri yeniden boyutlandırma tetikler.</div>'

+ '<p class="l-text"><strong>Liste oluşturma</strong> — Python farklı durumlar için birden fazla yol sunar:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Doğrudan oluşturma</span>\nmeyveler = [<span class="str">"elma"</span>, <span class="str">"muz"</span>, <span class="str">"kiraz"</span>]\nsayilar = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]\nkarisik = [<span class="num">42</span>, <span class="str">"merhaba"</span>, <span class="num">3.14</span>, <span class="kw">True</span>, [<span class="num">1</span>, <span class="num">2</span>]]  <span class="cm"># heterojen</span>\n\n<span class="cm"># Liste kavraması — Pythonic yol</span>\nkareler = [x**<span class="num">2</span> <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>)]         <span class="cm"># [0, 1, 4, 9, ..., 81]</span>\nciftler = [x <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>) <span class="kw">if</span> x % <span class="num">2</span> == <span class="num">0</span>] <span class="cm"># filtrelenmiş</span>\n\n<span class="cm"># Diğer yinelenebilirlerden</span>\nharfler = <span class="fn">list</span>(<span class="str">"Python"</span>)               <span class="cm"># [\'P\', \'y\', \'t\', \'h\', \'o\', \'n\']</span>\naraliktan = <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">5</span>))           <span class="cm"># [0, 1, 2, 3, 4]</span>\n\n<span class="cm"># Tekrarlama operatörü</span>\nsifirlar = [<span class="num">0</span>] * <span class="num">10</span>                    <span class="cm"># [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]</span></code></pre></div>'

+ '<p class="l-text"><strong>İndeksleme ve dilimleme</strong> liste hakimiyetinin temelini oluşturur. Python sıfır tabanlı indeksleme kullanır ve sondan sayan negatif indeksleri destekler:</p>'

+ '<div class="calc-formula"><div class="cf-label">LİSTE İNDEKSLEME</div><div class="cf-main">liste[başlangıç : bitiş : adım]</div><div class="cf-sub">başlangıç = dahil başlama (varsayılan 0), bitiş = hariç son (varsayılan len), adım = atlama (varsayılan 1). Negatif değerler sondan sayar.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>veri = [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>, <span class="num">50</span>, <span class="num">60</span>, <span class="num">70</span>, <span class="num">80</span>]\n<span class="cm">#        0    1    2    3    4    5    6    7   (pozitif indeks)</span>\n<span class="cm">#       -8   -7   -6   -5   -4   -3   -2   -1  (negatif indeks)</span>\n\nveri[<span class="num">0</span>]      <span class="cm"># 10   — ilk eleman</span>\nveri[-<span class="num">1</span>]     <span class="cm"># 80   — son eleman</span>\nveri[<span class="num">2</span>:<span class="num">5</span>]    <span class="cm"># [30, 40, 50]  — indeks 2, 3, 4</span>\nveri[::<span class="num">2</span>]    <span class="cm"># [10, 30, 50, 70]  — her 2. eleman</span>\nveri[::-<span class="num">1</span>]   <span class="cm"># [80, 70, 60, 50, 40, 30, 20, 10]  — ters</span>\nveri[<span class="num">1</span>::<span class="num">3</span>]   <span class="cm"># [20, 50, 80]  — 1\'den başla, 3\'er atla</span>\nveri[-<span class="num">3</span>:]    <span class="cm"># [60, 70, 80]  — son 3 eleman</span></code></pre></div>'

+ '<div class="think-box"><strong>Düşünün:</strong> Python neden dilimlemedebitiş değerini dahil etmez? Çünkü <code>len(veri[a:b]) == b - a</code>. Bu bölmeyi kolaylaştırır: <code>veri[:k]</code> ve <code>veri[k:]</code> birleştirildiğinde her zaman tam listeyi verir. Bir-fazla-bir-eksik hatası olmaz. C\'den miras alınan bu tasarım, Python\'ın en zarif seçimlerinden biridir.</div>'

/* Liste Metotları Referans Kartı */
+ '<p class="l-text"><strong>Liste metotları</strong> — Python listeleri güçlü yerleşik metotlarla gelir. İşte tam referans:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="cc-icon">+</div><div class="cc-title">append(x)</div><div class="cc-body">Sona x ekle.<br>Amortize O(1).<br><code>lst.append(42)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">++</div><div class="cc-title">extend(iter)</div><div class="cc-body">Yinelenebilirdeki tüm elemanları ekle.<br>O(k), k = len(iter).<br><code>lst.extend([1,2,3])</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">^</div><div class="cc-title">insert(i, x)</div><div class="cc-body">i indeksine x ekle.<br>O(n) — elemanları kaydırır.<br><code>lst.insert(0, "ilk")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&minus;</div><div class="cc-title">remove(x)</div><div class="cc-body">İlk x\'i kaldır.<br>O(n) — arar + kaydırır.<br><code>lst.remove("eski")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&darr;</div><div class="cc-title">pop(i=-1)</div><div class="cc-body">i\'deki elemanı çıkar ve döndür.<br>Sonda O(1), diğer yerlerde O(n).<br><code>val = lst.pop()</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&uarr;&darr;</div><div class="cc-title">sort() / reverse()</div><div class="cc-body">Yerinde sırala: O(n log n).<br>Yerinde ters çevir: O(n).<br><code>lst.sort(key=len)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">#</div><div class="cc-title">index(x) / count(x)</div><div class="cc-body">İlk x indeksini bul / tekrar sayısı.<br>İkisi de O(n).<br><code>lst.index("a")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">C</div><div class="cc-title">copy()</div><div class="cc-body">Listenin sığ kopyası.<br>O(n).<br><code>yeni = lst.copy()</code></div></div>'
+ '</div>'

/* Yığın/Kuyruk olarak liste */
+ '<p class="l-text"><strong>Yığın ve kuyruk olarak listeler:</strong> Liste doğal olarak <code>append()</code> ve <code>pop()</code> ile bir <strong>yığın</strong> (Son-Giren-İlk-Çıkar) olarak çalışır. <strong>Kuyruk</strong> (İlk-Giren-İlk-Çıkar) için <code>collections.deque</code> kullanın, çünkü listede <code>pop(0)</code> O(n)\'dir — her elemanı kaydırır.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Yığın (LIFO) — doğrudan liste kullan</span>\nyigin = []\nyigin.<span class="fn">append</span>(<span class="str">"birinci"</span>)   <span class="cm"># it (push)</span>\nyigin.<span class="fn">append</span>(<span class="str">"ikinci"</span>)    <span class="cm"># it (push)</span>\nust = yigin.<span class="fn">pop</span>()          <span class="cm"># "ikinci" — O(1)</span>\n\n<span class="cm"># Kuyruk (FIFO) — her iki uçta O(1) için deque kullan</span>\n<span class="kw">from</span> collections <span class="kw">import</span> deque\nkuyruk = <span class="fn">deque</span>()\nkuyruk.<span class="fn">append</span>(<span class="str">"birinci"</span>)    <span class="cm"># sağdan ekle</span>\nkuyruk.<span class="fn">append</span>(<span class="str">"ikinci"</span>)     <span class="cm"># sağdan ekle</span>\non = kuyruk.<span class="fn">popleft</span>()       <span class="cm"># "birinci" — O(1)</span></code></pre></div>'

/* Sığ vs Derin Kopya */
+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIĞ KOPYA</div><div class="compare-item">&bull; <code>lst.copy()</code> veya <code>lst[:]</code></div><div class="compare-item">&bull; Yeni liste nesnesi oluşturur</div><div class="compare-item">&bull; Aynı iç nesnelere referans verir</div><div class="compare-item">&bull; İç içe listeleri değiştirmek ikisini de etkiler</div></div><div class="compare-col"><div class="compare-title">DERİN KOPYA</div><div class="compare-item">&bull; <code>copy.deepcopy(lst)</code></div><div class="compare-item">&bull; Yeni liste nesnesi oluşturur</div><div class="compare-item">&bull; Tüm nesneleri özyinelemeli kopyalar</div><div class="compare-item">&bull; Tamamen bağımsız</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> copy\n\norijinal = [[<span class="num">1</span>, <span class="num">2</span>], [<span class="num">3</span>, <span class="num">4</span>]]\nsig = orijinal.<span class="fn">copy</span>()              <span class="cm"># veya orijinal[:]</span>\nderin = copy.<span class="fn">deepcopy</span>(orijinal)\n\norijinal[<span class="num">0</span>].<span class="fn">append</span>(<span class="num">99</span>)\n<span class="fn">print</span>(sig)    <span class="cm"># [[1, 2, 99], [3, 4]] — etkilendi!</span>\n<span class="fn">print</span>(derin)  <span class="cm"># [[1, 2], [3, 4]]    — bağımsız</span></code></pre></div>'

/* Plotly: Liste İşlemleri Zaman Karmaşıklığı */
+ '<div id="plot-list-ops-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-list-ops-tr");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var ops = ["append","pop()","insert(0)","pop(0)","index()","sort()","in"];'
+ 'var avg = [1, 1, 1000, 1000, 500, 11000, 500];'
+ 'var colors = ["#4ecdc4","#4ecdc4","#ff6b6b","#ff6b6b","#c8a96e","#ff6b6b","#c8a96e"];'
+ 'Plotly.newPlot(el,[{type:"bar",x:ops,y:avg,marker:{color:colors,line:{color:"rgba(255,255,255,0.1)",width:1}},text:["O(1)","O(1)","O(n)","O(n)","O(n)","O(n log n)","O(n)"],textposition:"outside",textfont:{color:"rgba(255,255,255,0.7)",size:11}}],{title:{text:"Liste İşlemleri — Zaman Maliyeti (n=1000)",font:{color:"rgba(255,255,255,.7)",size:14}},xaxis:{title:"İşlem",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"}},yaxis:{title:"Görece Süre (rastgele birim)",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"},gridcolor:"rgba(255,255,255,.06)"},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",margin:{l:60,r:20,t:50,b:60},height:380},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

+ '<div class="l-note"><strong>Performans çıkarımı:</strong> Listenin <em>sonundaki</em> işlemler hızlıdır (O(1)). <em>Başındaki</em> işlemler her elemanı kaydırmayı gerektirir (O(n)). Her iki uçta da hızlı işlemler istiyorsanız <code>collections.deque</code> kullanın.</div>'

/* ============================================================
   BÖLÜM 2: DEMETLER VE İSİMLİ DEMETLER
   ============================================================ */
+ '<h2 class="l-title">2. Demetler ve İsimli Demetler</h2>'

+ '<p class="l-text"><strong>Demet (tuple)</strong> <em>değiştirilemez</em> bir dizidir. Oluşturulduktan sonra eleman ekleyemez, kaldıramaz veya değiştiremezsiniz. Bu kısıtlayıcı görünebilir ama değiştirilemezlik bir süper güçtür: demetler <strong>hash edilebilir</strong> (sözlük anahtarı olarak kullanılabilir), <strong>bellek tasarruflu</strong> (Python depolamalarını optimize eder) ve <strong>iş parçacığı güvenli</strong>dir (kilitleme gerekmez). Demetleri kayıtlar veya satırlar olarak düşünün — sabit, ilişkili veri koleksiyonları.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Demet oluşturma</span>\nkoordinat = (<span class="num">40.7128</span>, -<span class="num">74.0060</span>)   <span class="cm"># enlem, boylam</span>\ntekli = (<span class="num">42</span>,)                       <span class="cm"># tek elemanlı demet için virgül gerekli</span>\nlisteden = <span class="fn">tuple</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])       <span class="cm"># listeden dönüştür</span>\n\n<span class="cm"># Demet paketleme ve açma</span>\nnokta = <span class="num">3</span>, <span class="num">7</span>, <span class="num">11</span>                   <span class="cm"># paketleme — parantez isteğe bağlı</span>\nx, y, z = nokta                     <span class="cm"># açma</span>\n\n<span class="cm"># * ile genişletilmiş açma</span>\nilk, *orta, son = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]\n<span class="cm"># ilk=1, orta=[2, 3, 4], son=5</span>\n\n<span class="cm"># Değişken takası — demet açma büyüsü</span>\na, b = <span class="num">10</span>, <span class="num">20</span>\na, b = b, a  <span class="cm"># şimdi a=20, b=10 — geçici değişken yok</span>\n\n<span class="cm"># Demetler sözlük anahtarı olabilir (listeler olamaz)</span>\nkonumlar = {}\nkonumlar[(<span class="num">40.71</span>, -<span class="num">74.00</span>)] = <span class="str">"New York"</span>\nkonumlar[(<span class="num">51.50</span>, -<span class="num">0.12</span>)] = <span class="str">"Londra"</span></code></pre></div>'

+ '<div class="think-box"><strong>Düşünün:</strong> Neden demetler sözlük anahtarı olabilir ama listeler olamaz? Çünkü sözlük anahtarları <strong>hash edilebilir</strong> olmalıdır, bu da değiştirilemezlik gerektirir. Ekleme sonrası bir anahtarı değiştirirseniz hash değeri değişir ve sözlük bozulur — anahtar yanlış kovada saklanır ve bulunamaz hale gelir. Demetler bunun asla olamayacağını garanti eder.</div>'

/* İsimli Demetler */
+ '<p class="l-text"><strong>İsimli demetler</strong> demet alanlarına gizemli tamsayı indeksleri yerine anlamlı isimler verir. Şablon kodu olmadan hafif sınıflar gibidirler:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Eski stil: collections.namedtuple</span>\n<span class="kw">from</span> collections <span class="kw">import</span> namedtuple\n\nNokta = <span class="fn">namedtuple</span>(<span class="str">"Nokta"</span>, [<span class="str">"x"</span>, <span class="str">"y"</span>, <span class="str">"z"</span>])\nn = <span class="fn">Nokta</span>(<span class="num">1.0</span>, <span class="num">2.5</span>, <span class="num">3.7</span>)\n<span class="fn">print</span>(n.x, n.y)  <span class="cm"># 1.0 2.5 — isimle erişim</span>\n<span class="fn">print</span>(n[<span class="num">0</span>])      <span class="cm"># 1.0     — indeksle de çalışır</span>\n\n<span class="cm"># Modern stil: typing.NamedTuple (Python 3.6+)</span>\n<span class="kw">from</span> typing <span class="kw">import</span> NamedTuple\n\n<span class="kw">class</span> <span class="fn">Ogrenci</span>(NamedTuple):\n    isim: <span class="fn">str</span>\n    not_ort: <span class="fn">float</span>\n    sinif: <span class="fn">int</span> = <span class="num">1</span>  <span class="cm"># varsayılan değer</span>\n\no = <span class="fn">Ogrenci</span>(<span class="str">"Ayşe"</span>, <span class="num">3.9</span>)\n<span class="fn">print</span>(o.isim, o.not_ort, o.sinif)  <span class="cm"># Ayşe 3.9 1</span>\n<span class="fn">print</span>(o._asdict())  <span class="cm"># {\'isim\': \'Ayşe\', \'not_ort\': 3.9, \'sinif\': 1}</span></code></pre></div>'

/* Karar ağacı: demet vs liste */
+ '<div class="calc-steps"><div class="cs-title">Karar Ağacı: Demet mi Liste mi?</div>'
+ '<div class="cs-step"><div class="cs-num">?</div><div class="cs-body">Koleksiyon oluşturulduktan sonra değişecek mi? (eleman ekleme/kaldırma/değiştirme)</div></div>'
+ '<div class="cs-step"><div class="cs-num">E</div><div class="cs-body"><strong>Liste</strong> kullan — değiştirilebilir, yeniden boyutlanabilir, O(1) append</div></div>'
+ '<div class="cs-step"><div class="cs-num">H</div><div class="cs-body">Veri sabit bir kayıt mı? (koordinat, RGB renk, veritabanı satırı gibi)</div></div>'
+ '<div class="cs-step"><div class="cs-num">E</div><div class="cs-body"><strong>İsimli demet</strong> kullan — okunabilir, değiştirilemez, bellek tasarruflu</div></div>'
+ '<div class="cs-step"><div class="cs-num">H</div><div class="cs-body">Sözlük anahtarı veya küme elemanı olarak kullanmanız gerekiyor mu?</div></div>'
+ '<div class="cs-step"><div class="cs-num">E</div><div class="cs-body"><strong>Demet</strong> kullan — hash edilebilir, değiştirilemez</div></div>'
+ '<div class="cs-step"><div class="cs-num">H</div><div class="cs-body">Güvenlik için <strong>demet</strong>, emin değilseniz <strong>liste</strong> kullanın</div></div>'
+ '</div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">DEMET</div><div class="compare-item">&bull; Değiştirilemez</div><div class="compare-item">&bull; Hash edilebilir (sözlük anahtarı olabilir)</div><div class="compare-item">&bull; Biraz daha hızlı yineleme</div><div class="compare-item">&bull; Daha az bellek (fazla ayırma yok)</div><div class="compare-item">&bull; "Bu değişmeyecek" sinyali verir</div></div><div class="compare-col"><div class="compare-title">LİSTE</div><div class="compare-item">&bull; Değiştirilebilir</div><div class="compare-item">&bull; Hash edilemez</div><div class="compare-item">&bull; append/extend/sort metotları var</div><div class="compare-item">&bull; Daha fazla bellek (fazla ayırma var)</div><div class="compare-item">&bull; "Bu değişebilir" sinyali verir</div></div></div>'

/* ============================================================
   BÖLÜM 3: SÖZLÜKLER
   ============================================================ */
+ '<h2 class="l-title">3. Sözlükler</h2>'

+ '<p class="l-text"><strong>Sözlük</strong> muhtemelen Python\'ın en önemli veri yapısıdır. <strong>Hash tablosu</strong> üzerine kurulmuş olup O(1) ortalama zamanlı arama, ekleme ve silme sağlar. Her Python nesnesinin öznitelik ad alanı bir sözlüktür. Modül global değişkenleri bir sözlüktür. Anahtar kelime argümanları bir sözlüktür. Sözlükleri anlamak, Python\'ı anlamaktır.</p>'

+ '<div class="calc-highlight"><strong>Hash nasıl çalışır:</strong> <code>d["anahtar"] = deger</code> yazdığınızda, Python <code>hash("anahtar")</code> çağırarak bir tamsayı alır, bu tamsayıyı iç dizideki bir yuvaya eşler ve anahtar-değer çiftini oraya depolar. Arama aynı hash hesaplamasını yaparak doğrudan doğru yuvaya atlar — tarama yapmaz. Bu yüzden sözlük araması boyuttan bağımsız O(1)\'dir, liste araması (<code>in</code>) ise O(n)\'dir.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sözlük oluşturma</span>\nogrenci = {<span class="str">"isim"</span>: <span class="str">"Ayşe"</span>, <span class="str">"yas"</span>: <span class="num">22</span>, <span class="str">"not_ort"</span>: <span class="num">3.9</span>}\nciftlerden = <span class="fn">dict</span>([(<span class="str">"a"</span>, <span class="num">1</span>), (<span class="str">"b"</span>, <span class="num">2</span>)])  <span class="cm"># demet listesinden</span>\nanahtar_arg = <span class="fn">dict</span>(x=<span class="num">10</span>, y=<span class="num">20</span>)            <span class="cm"># anahtar kelime argümanları</span>\n\n<span class="cm"># Sözlük kavraması</span>\nkareler = {x: x**<span class="num">2</span> <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">6</span>)}\n<span class="cm"># {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}</span>\n\nkelime_uzunluklari = {k: <span class="fn">len</span>(k) <span class="kw">for</span> k <span class="kw">in</span> [<span class="str">"kedi"</span>, <span class="str">"fil"</span>, <span class="str">"köpek"</span>]}\n<span class="cm"># {\'kedi\': 4, \'fil\': 3, \'köpek\': 5}</span></code></pre></div>'

/* Sözlük Metotları Kartları */
+ '<p class="l-text"><strong>Temel sözlük metotları:</strong></p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="cc-icon">?</div><div class="cc-title">get(anahtar, varsayılan)</div><div class="cc-body">Değeri veya anahtar yoksa varsayılanı döndürür. Asla KeyError vermez.<br><code>d.get("yas", 0)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">!</div><div class="cc-title">setdefault(k, v)</div><div class="cc-body">Anahtar varsa değeri döndür. Yoksa anahtarı varsayılanla ekle ve döndür.<br><code>d.setdefault("sayac", 0)</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&oplus;</div><div class="cc-title">update(diger)</div><div class="cc-body">Başka bir sözlük veya çift yinelenebilirini birleştir. Mevcut anahtarların üzerine yazar.<br><code>d.update({"a": 1})</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&minus;</div><div class="cc-title">pop(anahtar, varsayılan)</div><div class="cc-body">Anahtarı kaldır ve değeri döndür. Opsiyonel varsayılan KeyError önler.<br><code>val = d.pop("eski")</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">&equiv;</div><div class="cc-title">items() / keys() / values()</div><div class="cc-body">Görünüm nesneleri döndür. Items (anahtar, değer) demetleri verir.<br><code>for k, v in d.items():</code></div></div>'
+ '<div class="calc-card"><div class="cc-icon">|</div><div class="cc-title">Birleştir: | ve |=</div><div class="cc-body">Python 3.9+ birleştirme operatörleri.<br><code>birlesik = d1 | d2</code><br><code>d1 |= d2</code> (yerinde)</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Yineleme kalıpları</strong> — sözlükler ekleme sırasını korur (Python 3.7\'den beri garantili):</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>notlar = {<span class="str">"Ayşe"</span>: <span class="num">95</span>, <span class="str">"Mehmet"</span>: <span class="num">87</span>, <span class="str">"Zeynep"</span>: <span class="num">92</span>}\n\n<span class="cm"># Anahtarlar üzerinde yinele (varsayılan)</span>\n<span class="kw">for</span> isim <span class="kw">in</span> notlar:\n    <span class="fn">print</span>(isim)\n\n<span class="cm"># Anahtar-değer çiftleri üzerinde yinele</span>\n<span class="kw">for</span> isim, notu <span class="kw">in</span> notlar.<span class="fn">items</span>():\n    <span class="fn">print</span>(<span class="str">f"{isim}: {notu}"</span>)\n\n<span class="cm"># Değere göre sırala</span>\nsirali = <span class="fn">dict</span>(<span class="fn">sorted</span>(notlar.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: x[<span class="num">1</span>], reverse=<span class="kw">True</span>))\n<span class="cm"># {\'Ayşe\': 95, \'Zeynep\': 92, \'Mehmet\': 87}</span>\n\n<span class="cm"># Sözlük birleştirme (Python 3.9+)</span>\nvarsayilanlar = {<span class="str">"renk"</span>: <span class="str">"mavi"</span>, <span class="str">"boyut"</span>: <span class="str">"orta"</span>}\nkullanici = {<span class="str">"renk"</span>: <span class="str">"kırmızı"</span>}\nsonuc = varsayilanlar | kullanici  <span class="cm"># {\'renk\': \'kırmızı\', \'boyut\': \'orta\'}</span></code></pre></div>'

/* Uzmanlaşmış sözlük türleri */
+ '<p class="l-text"><strong>Uzmanlaşmış sözlükler</strong> — <code>collections</code> modülü yaygın kalıpları zarif şekilde çözer:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> defaultdict, Counter, OrderedDict, ChainMap\n\n<span class="cm"># defaultdict — eksik anahtarları otomatik oluşturur</span>\nkelime_sayisi = <span class="fn">defaultdict</span>(<span class="fn">int</span>)  <span class="cm"># varsayılan değer = 0</span>\n<span class="kw">for</span> kelime <span class="kw">in</span> <span class="str">"kedi mat üzerinde oturdu kedi"</span>.<span class="fn">split</span>():\n    kelime_sayisi[kelime] += <span class="num">1</span>  <span class="cm"># yeni kelimeler için bile KeyError yok</span>\n<span class="cm"># defaultdict(int, {\'kedi\': 2, \'mat\': 1, \'üzerinde\': 1, \'oturdu\': 1})</span>\n\n<span class="cm"># defaultdict(list) ile gruplama</span>\nsiniflara_gore = <span class="fn">defaultdict</span>(<span class="fn">list</span>)\n<span class="kw">for</span> isim, sinif <span class="kw">in</span> [(<span class="str">"Ayşe"</span>,<span class="str">"A"</span>), (<span class="str">"Mehmet"</span>,<span class="str">"B"</span>), (<span class="str">"Zeynep"</span>,<span class="str">"A"</span>)]:\n    siniflara_gore[sinif].<span class="fn">append</span>(isim)\n<span class="cm"># {\'A\': [\'Ayşe\', \'Zeynep\'], \'B\': [\'Mehmet\']}</span>\n\n<span class="cm"># Counter — zahmetsizce say</span>\nmetin = <span class="str">"olmak ya da olmamak işte bütün mesele"</span>\nsayimlar = <span class="fn">Counter</span>(metin.<span class="fn">split</span>())\n<span class="fn">print</span>(sayimlar.<span class="fn">most_common</span>(<span class="num">2</span>))  <span class="cm"># [(\'olmak\', 1), (\'ya\', 1)]</span>\n\n<span class="cm"># Counter aritmetiği</span>\nc1 = <span class="fn">Counter</span>(a=<span class="num">3</span>, b=<span class="num">1</span>)\nc2 = <span class="fn">Counter</span>(a=<span class="num">1</span>, b=<span class="num">2</span>)\n<span class="fn">print</span>(c1 + c2)  <span class="cm"># Counter({\'a\': 4, \'b\': 3})</span>\n<span class="fn">print</span>(c1 - c2)  <span class="cm"># Counter({\'a\': 2})  — sıfır/negatifi düşürür</span>\n\n<span class="cm"># ChainMap — birden fazla sözlükte sırayla ara</span>\nenv_varsayilan = {<span class="str">"DEBUG"</span>: <span class="kw">False</span>, <span class="str">"PORT"</span>: <span class="num">8080</span>}\nenv_ozel = {<span class="str">"DEBUG"</span>: <span class="kw">True</span>}\nayar = <span class="fn">ChainMap</span>(env_ozel, env_varsayilan)\n<span class="fn">print</span>(ayar[<span class="str">"DEBUG"</span>])  <span class="cm"># True  — ilk sözlükte bulundu</span>\n<span class="fn">print</span>(ayar[<span class="str">"PORT"</span>])   <span class="cm"># 8080  — ikinciye düşer</span></code></pre></div>'

/* Plotly: Hash Tablosu Arama vs Liste Arama */
+ '<div id="plot-hash-lookup-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-hash-lookup-tr");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var sizes = [100,500,1000,5000,10000,50000,100000];'
+ 'var listTime = sizes.map(function(n){return n/2;});'
+ 'var dictTime = sizes.map(function(){return 1;});'
+ 'Plotly.newPlot(el,['
+ '{x:sizes,y:listTime,name:"liste (in) — O(n)",mode:"lines+markers",line:{color:"#ff6b6b",width:2},marker:{size:6}},'
+ '{x:sizes,y:dictTime,name:"sözlük ([ ]) — O(1)",mode:"lines+markers",line:{color:"#4ecdc4",width:2},marker:{size:6}}'
+ '],{title:{text:"Arama Performansı: Liste vs Sözlük",font:{color:"rgba(255,255,255,.7)",size:14}},xaxis:{title:"Eleman Sayısı",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"},gridcolor:"rgba(255,255,255,.06)"},yaxis:{title:"Ortalama Karşılaştırma",color:"rgba(255,255,255,.5)",tickfont:{color:"rgba(255,255,255,.5)"},gridcolor:"rgba(255,255,255,.06)"},legend:{font:{color:"rgba(255,255,255,.6)"},bgcolor:"rgba(0,0,0,0)"},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",margin:{l:60,r:20,t:50,b:60},height:380},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

+ '<div class="l-note"><strong>NLP Bağlantısı:</strong> Sözlükler NLP\'nin her yerinde. Kelime dağarcığı kelimeleri tamsayı kimliklerine eşler. TF-IDF terim frekanslarını <code>{kelime: sayı}</code> olarak saklar. Kelime gömmeleri belirteçleri vektörlere eşler. <code>Counter</code> kelime frekans dağılımları oluşturmanın en hızlı yoludur. Metin işliyorsanız, sözlük kullanıyorsunuz.</div>'

/* ============================================================
   BÖLÜM 4: KÜMELER VE DONMUŞ KÜMELER
   ============================================================ */
+ '<h2 class="l-title">4. Kümeler ve Donmuş Kümeler</h2>'

+ '<p class="l-text"><strong>Küme (set)</strong>, <em>benzersiz</em> hash edilebilir elemanların sırasız bir koleksiyonudur. Sözlükler gibi kümeler de hash tabloları üzerine kuruludur, bu yüzden üyelik testi (<code>in</code>) O(1)\'dir. Kümeler tekrarlananları ortadan kaldırmanız, üyelik test etmeniz veya birleşim, kesişim, fark gibi matematiksel küme işlemleri yapmanız gerektiğinde parlak.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Küme oluşturma</span>\nrenkler = {<span class="str">"kırmızı"</span>, <span class="str">"yeşil"</span>, <span class="str">"mavi"</span>}  <span class="cm"># küme değişmezi</span>\nbos_kume = <span class="fn">set</span>()                        <span class="cm"># {} DEĞİL — o boş sözlük!</span>\nlisteden = <span class="fn">set</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">3</span>])       <span class="cm"># {1, 2, 3} — tekrarlar kaldırıldı</span>\n\n<span class="cm"># Küme kavraması</span>\nsesliler = {c <span class="kw">for</span> c <span class="kw">in</span> <span class="str">"merhaba dünya"</span> <span class="kw">if</span> c <span class="kw">in</span> <span class="str">"aeıioöuü"</span>}  <span class="cm"># {\'e\', \'a\', \'ü\', \'a\'}</span>\n\n<span class="cm"># Üyelik testi — O(1)!</span>\n<span class="fn">print</span>(<span class="str">"kırmızı"</span> <span class="kw">in</span> renkler)  <span class="cm"># True  — anında</span>\n\n<span class="cm"># Listeden tekrarları kaldır (Python 3.7+ sırayı korur)</span>\nham = [<span class="num">3</span>, <span class="num">1</span>, <span class="num">4</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">9</span>, <span class="num">2</span>, <span class="num">6</span>, <span class="num">5</span>]\nbenzersiz = <span class="fn">list</span>(<span class="fn">dict</span>.<span class="fn">fromkeys</span>(ham))  <span class="cm"># [3, 1, 4, 5, 9, 2, 6] — sıra korundu</span></code></pre></div>'

/* Küme İşlemleri */
+ '<p class="l-text"><strong>Küme işlemleri</strong> matematiksel küme teorisini doğrudan Python\'da uygular:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="cc-icon">&cup;</div><div class="cc-title">Birleşim</div><div class="cc-body"><code>a | b</code> veya <code>a.union(b)</code><br><br>Her iki kümedeki tüm elemanlar.<br>{1,2,3} | {3,4,5} = {1,2,3,4,5}</div></div>'
+ '<div class="calc-card"><div class="cc-icon">&cap;</div><div class="cc-title">Kesişim</div><div class="cc-body"><code>a & b</code> veya <code>a.intersection(b)</code><br><br>Her iki kümedeki elemanlar.<br>{1,2,3} & {3,4,5} = {3}</div></div>'
+ '<div class="calc-card"><div class="cc-icon">&minus;</div><div class="cc-title">Fark</div><div class="cc-body"><code>a - b</code> veya <code>a.difference(b)</code><br><br>a\'da olup b\'de olmayan elemanlar.<br>{1,2,3} - {3,4,5} = {1,2}</div></div>'
+ '<div class="calc-card"><div class="cc-icon">&Delta;</div><div class="cc-title">Simetrik Fark</div><div class="cc-body"><code>a ^ b</code> veya <code>a.symmetric_difference(b)</code><br><br>Birinde olup diğerinde olmayan.<br>{1,2,3} ^ {3,4,5} = {1,2,4,5}</div></div>'
+ '</div>'

/* Plotly: Küme İşlemleri için Venn Diyagramı */
+ '<div id="plot-set-venn-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-set-venn-tr");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var theta = [];for(var i=0;i<=360;i++) theta.push(i*Math.PI/180);'
+ 'var cx1=-0.6,cy1=0,cx2=0.6,cy2=0,r=1.2;'
+ 'var x1=[],y1=[],x2=[],y2=[];'
+ 'for(var i=0;i<theta.length;i++){'
+ '  x1.push(cx1+r*Math.cos(theta[i]));y1.push(cy1+r*Math.sin(theta[i]));'
+ '  x2.push(cx2+r*Math.cos(theta[i]));y2.push(cy2+r*Math.sin(theta[i]));'
+ '}'
+ 'Plotly.newPlot(el,['
+ '{x:x1,y:y1,mode:"lines",line:{color:"#4ecdc4",width:2.5},fill:"toself",fillcolor:"rgba(78,205,196,0.12)",name:"Küme A = {1,2,3,4}"},'
+ '{x:x2,y:y2,mode:"lines",line:{color:"#c8a96e",width:2.5},fill:"toself",fillcolor:"rgba(200,169,110,0.12)",name:"Küme B = {3,4,5,6}"}'
+ '],{'
+ 'annotations:['
+ '{x:-1.0,y:0,text:"1, 2",showarrow:false,font:{color:"#4ecdc4",size:15}},'
+ '{x:0,y:0,text:"3, 4",showarrow:false,font:{color:"#e0e0e0",size:15}},'
+ '{x:1.0,y:0,text:"5, 6",showarrow:false,font:{color:"#c8a96e",size:15}},'
+ '{x:-1.0,y:-1.6,text:"A - B",showarrow:false,font:{color:"#4ecdc4",size:11}},'
+ '{x:0,y:-1.6,text:"A & B",showarrow:false,font:{color:"#e0e0e0",size:11}},'
+ '{x:1.0,y:-1.6,text:"B - A",showarrow:false,font:{color:"#c8a96e",size:11}}'
+ '],'
+ 'title:{text:"Küme İşlemleri Görselleştirmesi",font:{color:"rgba(255,255,255,.7)",size:14}},'
+ 'xaxis:{visible:false,range:[-2.2,2.2]},yaxis:{visible:false,range:[-2,1.8],scaleanchor:"x"},'
+ 'legend:{font:{color:"rgba(255,255,255,.6)"},bgcolor:"rgba(0,0,0,0)"},'
+ 'paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",'
+ 'margin:{l:20,r:20,t:50,b:20},height:380'
+ '},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

/* Donmuş Kümeler */
+ '<p class="l-text"><strong>Frozenset (donmuş küme)</strong>, liste için demet ne ise küme için odur — değiştirilemez versiyon. Hash edilebilir olduğu için sözlük anahtarı veya başka bir kümenin elemanı olarak kullanabilirsiniz:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Frozenset — değiştirilemez küme</span>\nfs = <span class="fn">frozenset</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])\n<span class="cm"># fs.add(4)  # AttributeError — değiştirilemez!</span>\n\n<span class="cm"># Sözlük anahtarı veya küme elemanı olarak kullan</span>\nizinler = {\n    <span class="fn">frozenset</span>({<span class="str">"oku"</span>}): <span class="str">"görüntüleyen"</span>,\n    <span class="fn">frozenset</span>({<span class="str">"oku"</span>, <span class="str">"yaz"</span>}): <span class="str">"editör"</span>,\n    <span class="fn">frozenset</span>({<span class="str">"oku"</span>, <span class="str">"yaz"</span>, <span class="str">"yönet"</span>}): <span class="str">"yönetici"</span>\n}\n\n<span class="cm"># Kümelerin kümesi (sadece frozenset ile mümkün)</span>\nguc_kumesi = {<span class="fn">frozenset</span>(), <span class="fn">frozenset</span>({<span class="num">1</span>}), <span class="fn">frozenset</span>({<span class="num">2</span>}), <span class="fn">frozenset</span>({<span class="num">1</span>,<span class="num">2</span>})}</code></pre></div>'

+ '<div class="think-box"><strong>Düşünün:</strong> NLP verisi işlerken, iki belge arasındaki ortak kelimeleri veya birinde olup diğerinde olmayan benzersiz kelimeleri bulmak sık gerekir. Bunlar tam olarak küme kesişimi ve farkıdır. Kelime listelerinizi kümelere dönüştürmek bu işlemleri hem zarif hem de son derece hızlı yapar — O(n*m) yerine O(min(len(a), len(b))).</div>'

/* ============================================================
   BÖLÜM 5: İLERİ KALIPLAR
   ============================================================ */
+ '<h2 class="l-title">5. İleri Kalıplar</h2>'

+ '<p class="l-text">Gerçek dünya verisi nadiren düzdür. <strong>İç içe yapılar</strong> ile karşılaşacaksınız — sözlük listeleri, liste sözlükleri, keyfi derinlikte ağaçlar. Bu kalıpları ve onları manipüle etme araçlarını ustalaşmak, yeni başlayanları profesyonel geliştiricilerden ayırır.</p>'

+ '<div class="calc-highlight"><strong>İç içe veri her yerde:</strong> JSON API\'ları iç içe sözlükler döndürür. DataFrame\'ler liste listeleridir. NLP ayrıştırma ağaçları özyinelemeli yapılardır. Kelime gömme modeli, stringleri float listelerine eşleyen bir sözlüktür. Bu yapılar arasında gezinmeyi ve dönüştürmeyi öğrenmek zorunludur.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># İç içe veri — JSON benzeri yapı</span>\nogrenciler = [\n    {<span class="str">"isim"</span>: <span class="str">"Ayşe"</span>, <span class="str">"notlar"</span>: [<span class="num">95</span>, <span class="num">87</span>, <span class="num">92</span>], <span class="str">"dersler"</span>: {<span class="str">"mat"</span>: <span class="str">"A"</span>}},\n    {<span class="str">"isim"</span>: <span class="str">"Mehmet"</span>, <span class="str">"notlar"</span>: [<span class="num">78</span>, <span class="num">85</span>, <span class="num">90</span>], <span class="str">"dersler"</span>: {<span class="str">"mat"</span>: <span class="str">"B"</span>}},\n]\n\n<span class="cm"># Derin iç içe veriye erişim</span>\nayse_mat = ogrenciler[<span class="num">0</span>][<span class="str">"dersler"</span>][<span class="str">"mat"</span>]  <span class="cm"># "A"</span>\n\n<span class="cm"># İç içe listeleri düzleştir</span>\nic_ice = [[<span class="num">1</span>, <span class="num">2</span>], [<span class="num">3</span>, <span class="num">4</span>], [<span class="num">5</span>, <span class="num">6</span>]]\nduz = [x <span class="kw">for</span> alt <span class="kw">in</span> ic_ice <span class="kw">for</span> x <span class="kw">in</span> alt]  <span class="cm"># [1, 2, 3, 4, 5, 6]</span>\n\n<span class="cm"># itertools.chain ile düzleştir (büyük veri için daha temiz)</span>\n<span class="kw">from</span> itertools <span class="kw">import</span> chain\nduz2 = <span class="fn">list</span>(chain.<span class="fn">from_iterable</span>(ic_ice))  <span class="cm"># [1, 2, 3, 4, 5, 6]</span>\n\n<span class="cm"># İç içe yapıdan tüm notları çıkar</span>\ntum_notlar = [n <span class="kw">for</span> og <span class="kw">in</span> ogrenciler <span class="kw">for</span> n <span class="kw">in</span> og[<span class="str">"notlar"</span>]]  <span class="cm"># [95, 87, 92, 78, 85, 90]</span></code></pre></div>'

/* itertools */
+ '<p class="l-text"><strong>itertools</strong> — yineleme için İsviçre Çakısı. Bu standart kütüphane modülü, yineleyicilerle çalışmak için bellek verimli araçlar sağlar:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> itertools <span class="kw">import</span> chain, product, permutations, combinations, groupby\n\n<span class="cm"># chain — yinelenebilirleri tembel birleştir</span>\nbirlesik = <span class="fn">list</span>(chain.<span class="fn">from_iterable</span>([[<span class="num">1</span>,<span class="num">2</span>], [<span class="num">3</span>,<span class="num">4</span>], [<span class="num">5</span>]]))\n<span class="cm"># [1, 2, 3, 4, 5]</span>\n\n<span class="cm"># product — Kartezyen çarpım (tüm kombinasyonlar)</span>\nrenkler = [<span class="str">"kırmızı"</span>, <span class="str">"mavi"</span>]\nboyutlar = [<span class="str">"S"</span>, <span class="str">"M"</span>, <span class="str">"L"</span>]\nvaryantlar = <span class="fn">list</span>(<span class="fn">product</span>(renkler, boyutlar))\n<span class="cm"># [(\'kırmızı\',\'S\'), (\'kırmızı\',\'M\'), (\'kırmızı\',\'L\'), (\'mavi\',\'S\'), ...]</span>\n\n<span class="cm"># permutations — tüm sıralamalar</span>\n<span class="fn">list</span>(<span class="fn">permutations</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>], <span class="num">2</span>))  <span class="cm"># [(1,2),(1,3),(2,1),(2,3),(3,1),(3,2)]</span>\n\n<span class="cm"># combinations — benzersiz seçimler (sıra önemli değil)</span>\n<span class="fn">list</span>(<span class="fn">combinations</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>], <span class="num">2</span>))  <span class="cm"># [(1,2),(1,3),(2,3)]</span>\n\n<span class="cm"># groupby — ardışık öğeleri grupla</span>\nveri = <span class="fn">sorted</span>([(<span class="str">"meyve"</span>,<span class="str">"elma"</span>), (<span class="str">"sebze"</span>,<span class="str">"havuç"</span>), (<span class="str">"meyve"</span>,<span class="str">"muz"</span>)])\n<span class="kw">for</span> anahtar, grup <span class="kw">in</span> <span class="fn">groupby</span>(veri, key=<span class="kw">lambda</span> x: x[<span class="num">0</span>]):\n    <span class="fn">print</span>(anahtar, <span class="fn">list</span>(grup))\n<span class="cm"># meyve [(\'meyve\', \'elma\'), (\'meyve\', \'muz\')]</span>\n<span class="cm"># sebze  [(\'sebze\', \'havuç\')]</span></code></pre></div>'

/* heapq ve bisect */
+ '<p class="l-text"><strong>heapq ve bisect</strong> — sıralı veri ve öncelik kuyrukları için uzmanlaşmış araçlar:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">heapq (Öncelik Kuyruğu)</div><div class="compare-item">&bull; <code>heappush(h, eleman)</code> — O(log n)</div><div class="compare-item">&bull; <code>heappop(h)</code> — O(log n)</div><div class="compare-item">&bull; <code>nlargest(k, iter)</code> — verimli top-k</div><div class="compare-item">&bull; Her zaman min-heap (en küçük önce)</div><div class="compare-item">&bull; Kullanım: görev zamanlama, Dijkstra, sıralı akışları birleştirme</div></div><div class="compare-col"><div class="compare-title">bisect (Sıralı Ekleme)</div><div class="compare-item">&bull; <code>bisect_left(a, x)</code> — O(log n)</div><div class="compare-item">&bull; <code>insort(a, x)</code> — toplam O(n)</div><div class="compare-item">&bull; Sıralı listelerde ikili arama</div><div class="compare-item">&bull; Ekleme sonrası listeyi sıralı tutar</div><div class="compare-item">&bull; Kullanım: sıralı düzeni koruma, ikili arama</div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> heapq, bisect\n\n<span class="cm"># heapq — her şeyi sıralamadan en yüksek 3 puan</span>\npuanlar = [<span class="num">72</span>, <span class="num">95</span>, <span class="num">88</span>, <span class="num">41</span>, <span class="num">67</span>, <span class="num">93</span>, <span class="num">55</span>, <span class="num">82</span>]\nen_yuksek3 = heapq.<span class="fn">nlargest</span>(<span class="num">3</span>, puanlar)   <span class="cm"># [95, 93, 88]</span>\nen_dusuk3 = heapq.<span class="fn">nsmallest</span>(<span class="num">3</span>, puanlar)  <span class="cm"># [41, 55, 67]</span>\n\n<span class="cm"># Öncelik kuyruğu kalıbı</span>\ngorevler = []\nheapq.<span class="fn">heappush</span>(gorevler, (<span class="num">3</span>, <span class="str">"düşük öncelik"</span>))\nheapq.<span class="fn">heappush</span>(gorevler, (<span class="num">1</span>, <span class="str">"acil"</span>))\nheapq.<span class="fn">heappush</span>(gorevler, (<span class="num">2</span>, <span class="str">"orta"</span>))\n<span class="fn">print</span>(heapq.<span class="fn">heappop</span>(gorevler))  <span class="cm"># (1, \'acil\') — en küçük önce</span>\n\n<span class="cm"># bisect — sıralı listeye ekle</span>\nsirali_veri = [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>, <span class="num">50</span>]\nbisect.<span class="fn">insort</span>(sirali_veri, <span class="num">25</span>)\n<span class="fn">print</span>(sirali_veri)  <span class="cm"># [10, 20, 25, 30, 40, 50]</span>\n\n<span class="cm"># İkili arama: ekleme noktasını bul</span>\nidx = bisect.<span class="fn">bisect_left</span>(sirali_veri, <span class="num">30</span>)\n<span class="fn">print</span>(idx)  <span class="cm"># 3 — 30\'un bulunduğu yer</span></code></pre></div>'

+ '<div class="l-note"><strong>Pratik ipucu:</strong> <code>heapq.nlargest</code> ve <code>heapq.nsmallest</code>, k n\'den çok küçükken top-k eleman bulmak için en hızlı yoldur. k n\'ye yakınsa sadece <code>sorted()</code> kullanın. k=1 ise <code>min()</code> veya <code>max()</code> kullanın.</div>'

/* ============================================================
   BÖLÜM 6: DOĞRU YAPIYI SEÇMEK
   ============================================================ */
+ '<h2 class="l-title">6. Doğru Yapıyı Seçmek</h2>'

+ '<p class="l-text">Tüm veri yapılarını bilmek savaşın sadece yarısıdır. Gerçek beceri <strong>hangisini ne zaman kullanacağını</strong> bilmektir. Yanlış seçim programınızı 100 kat yavaşlatabilir veya 10 kat daha fazla bellek kullanabilir. İşte kararlarınızı yönlendirecek kapsamlı bir karşılaştırma:</p>'

/* Big O Karşılaştırma Tablosu */
+ '<div class="calc-example"><div class="ce-label">Big O Karşılaştırma Tablosu</div><div class="ce-body">'
+ '<table style="width:100%;border-collapse:collapse;font-family:monospace;font-size:13px;">'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.15);">'
+ '<th style="text-align:left;padding:6px;color:#c8a96e;">İşlem</th>'
+ '<th style="text-align:center;padding:6px;color:#4ecdc4;">liste</th>'
+ '<th style="text-align:center;padding:6px;color:#a78bfa;">demet</th>'
+ '<th style="text-align:center;padding:6px;color:#c8a96e;">sözlük</th>'
+ '<th style="text-align:center;padding:6px;color:#ff6b6b;">küme</th></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">İndeksle arama</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Anahtarla arama</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Arama (in)</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Sona ekleme</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)*</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Başa ekleme</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Silme</td><td style="text-align:center;padding:6px;color:#ff6b6b;">O(n)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td><td style="text-align:center;padding:6px;color:#4ecdc4;">O(1)</td></tr>'
+ '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:6px;">Sıralama</td><td style="text-align:center;padding:6px;color:#c8a96e;">O(n log n)</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td><td style="text-align:center;padding:6px;color:rgba(255,255,255,0.3);">YOK</td></tr>'
+ '<tr><td style="padding:6px;">Eleman başına bellek</td><td style="text-align:center;padding:6px;">~8 bayt</td><td style="text-align:center;padding:6px;">~8 bayt</td><td style="text-align:center;padding:6px;">~50-70 bayt</td><td style="text-align:center;padding:6px;">~50 bayt</td></tr>'
+ '</table>'
+ '<p style="margin-top:8px;font-size:12px;opacity:0.5;">* amortize. Yeşil = hızlı, Kırmızı = yavaş, Altın = orta.</p>'
+ '</div></div>'

/* Karar Akış Şeması */
+ '<div class="calc-steps"><div class="cs-title">Karar Akış Şeması: Hangi Yapı?</div>'
+ '<div class="cs-step"><div class="cs-num">1</div><div class="cs-body"><strong>Anahtar-değer çiftlerine</strong> ihtiyacınız var mı? &rarr; <strong>Sözlük</strong> kullanın (veya defaultdict, Counter, OrderedDict)</div></div>'
+ '<div class="cs-step"><div class="cs-num">2</div><div class="cs-body">Sadece <strong>benzersiz elemanlara</strong> ve hızlı üyelik testine mi ihtiyacınız var? &rarr; <strong>Küme</strong> kullanın (değiştirilemez olacaksa frozenset)</div></div>'
+ '<div class="cs-step"><div class="cs-num">3</div><div class="cs-body">Veri değişmemesi gereken <strong>sabit bir kayıt</strong> mı? &rarr; <strong>Demet</strong> kullanın (isimli alanlar için NamedTuple)</div></div>'
+ '<div class="cs-step"><div class="cs-num">4</div><div class="cs-body"><strong>Sıralı, değiştirilebilir</strong> bir koleksiyona mı ihtiyacınız var? &rarr; <strong>Liste</strong> kullanın</div></div>'
+ '<div class="cs-step"><div class="cs-num">5</div><div class="cs-body"><strong>Her iki uçtan</strong> da hızlı append/pop gerekiyor mu? &rarr; <strong>collections.deque</strong> kullanın</div></div>'
+ '<div class="cs-step"><div class="cs-num">6</div><div class="cs-body">Hızlı min/max ile <strong>sıralı</strong> koleksiyon mu gerekiyor? &rarr; <strong>heapq</strong> kullanın</div></div>'
+ '</div>'

/* Plotly: Kapsamlı Karşılaştırma */
+ '<div id="plot-structure-compare-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ '(function(){'
+ 'var el = document.getElementById("plot-structure-compare-tr");'
+ 'if(!el || typeof Plotly === "undefined") return;'
+ 'var structs = ["liste","demet","sözlük","küme","deque"];'
+ 'Plotly.newPlot(el,['
+ '{type:"scatterpolar",r:[5,7,3,8,7,5],theta:["Arama","Ekleme","Arama (in)","Bellek Ver.","Esneklik","Arama"],fill:"toself",name:"liste",line:{color:"#4ecdc4"},fillcolor:"rgba(78,205,196,0.1)"},'
+ '{type:"scatterpolar",r:[5,0,3,9,3,5],theta:["Arama","Ekleme","Arama (in)","Bellek Ver.","Esneklik","Arama"],fill:"toself",name:"demet",line:{color:"#a78bfa"},fillcolor:"rgba(167,139,250,0.1)"},'
+ '{type:"scatterpolar",r:[10,10,10,4,8,10],theta:["Arama","Ekleme","Arama (in)","Bellek Ver.","Esneklik","Arama"],fill:"toself",name:"sözlük",line:{color:"#c8a96e"},fillcolor:"rgba(200,169,110,0.1)"},'
+ '{type:"scatterpolar",r:[0,10,10,5,4,0],theta:["Arama","Ekleme","Arama (in)","Bellek Ver.","Esneklik","Arama"],fill:"toself",name:"küme",line:{color:"#ff6b6b"},fillcolor:"rgba(255,107,107,0.1)"}'
+ '],{polar:{radialaxis:{visible:true,range:[0,10],tickfont:{color:"rgba(255,255,255,0.4)"},gridcolor:"rgba(255,255,255,0.08)"},angularaxis:{tickfont:{color:"rgba(255,255,255,0.6)"},gridcolor:"rgba(255,255,255,0.08)"},bgcolor:"rgba(0,0,0,0)"},title:{text:"Veri Yapıları Güçlü Yönleri (0-10)",font:{color:"rgba(255,255,255,.7)",size:14}},legend:{font:{color:"rgba(255,255,255,.6)"},bgcolor:"rgba(0,0,0,0)"},paper_bgcolor:"rgba(0,0,0,0)",margin:{l:60,r:60,t:60,b:40},height:420},{responsive:true,displayModeBar:false});'
+ '})();'
+ '},200)</script>'

/* Gerçek dünya örnekleri */
+ '<div class="calc-highlight"><strong>Gerçek dünya karar örnekleri:</strong><br><br>&bull; <strong>Kullanıcı profilleri saklamak</strong> &rarr; <code>sözlük</code> (anahtar: kullanici_id, değer: profil verisi)<br>&bull; <strong>CSV\'yi satır satır işlemek</strong> &rarr; <code>demet</code>lerin <code>liste</code>si veya <code>NamedTuple</code><br>&bull; <strong>İki belgedeki ortak kelimeleri bulmak</strong> &rarr; <code>küme</code> kesişimi<br>&bull; <strong>Kelime frekanslarını saymak</strong> &rarr; <code>Counter</code> (uzmanlaşmış sözlük)<br>&bull; <strong>Pahalı hesaplamaları önbelleğe almak</strong> &rarr; <code>sözlük</code> (memoizasyon tablosu)<br>&bull; <strong>BFS graf dolaşımı</strong> &rarr; kuyruk olarak <code>deque</code> + ziyaret edilenler için <code>küme</code><br>&bull; <strong>Fonksiyondan birden fazla değer döndürmek</strong> &rarr; <code>demet</code> veya <code>NamedTuple</code><br>&bull; <strong>Varsayılanlar ve geçersiz kılmalarla yapılandırma</strong> &rarr; <code>ChainMap</code></div>'

+ '<div class="calc-example"><div class="ce-label">Özet</div><div class="ce-body"><p class="l-text">Python\'ın temel veri yapılarında ustalaştınız: <strong>listeler</strong> (O(1) append ile dinamik diziler), <strong>demetler</strong> (değiştirilemez kayıtlar, hash edilebilir), <strong>sözlükler</strong> (O(1) anahtar-değer hash haritaları) ve <strong>kümeler</strong> (O(1) üyelik testi ile benzersiz elemanlar). <code>collections</code> modülünü (<code>defaultdict</code>, <code>Counter</code>, <code>ChainMap</code>, <code>deque</code>), <code>itertools</code> araç setini ve sıralı veriler için <code>heapq</code>/<code>bisect</code>\'i keşfettiniz. En önemlisi, zaman karmaşıklığına, belleğe ve verinin doğasına göre her yapıyı <strong>ne zaman</strong> kullanacağınızı öğrendiniz. Sonraki derste, <strong>fonksiyonlar ve fonksiyonel programlama</strong> konusunu inceleyeceğiz — yeniden kullanılabilir, birleştirilebilir kod yazmayı.</p></div></div>'

};
