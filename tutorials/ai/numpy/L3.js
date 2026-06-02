/* numpy-L3.js — NumPy Lesson 3: Broadcasting & Vectorization (EN + TR) */
var NUMPY_L3 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en:

'<p class="l-text"><strong>Broadcasting and vectorization</strong> are the two superpowers that make NumPy fast. Vectorization replaces Python loops with optimized C operations on entire arrays. Broadcasting lets NumPy automatically align arrays of different shapes so you can combine them without manual reshaping. Together, they let you write concise, readable code that runs 10\u2013100\u00d7 faster than pure Python.</p>'

+ '<div class="calc-highlight"><strong>The golden rule of NumPy:</strong> If you are writing a Python <code>for</code> loop over array elements, you are almost certainly doing it wrong. NumPy\u2019s element-wise operations, broadcasting, and aggregation functions replace loops with compiled C code that runs orders of magnitude faster.</div>'
+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Apply element-wise arithmetic and ufuncs across arrays of any shape</li><li>Use broadcasting to compute on shape-mismatched arrays without loops</li><li>Read broadcasting rules and predict the result shape in advance</li><li>Aggregate along chosen axes with sum, mean, std, max, and argmax</li><li>Vectorize a real ML computation that would otherwise need a Python loop</li></ul></div>'


/* ============================================================
   SECTION 1: Element-wise Operations
   ============================================================ */
+ '<h2 class="l-title">1. Element-wise Operations</h2>'

+ '<p class="l-text">When you apply an arithmetic operator to two arrays of the <strong>same shape</strong>, NumPy performs the operation <em>element by element</em>. This is called a <strong>vectorized operation</strong> because it processes an entire vector (array) in one step instead of looping.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Arithmetic</div><div class="card-body">+, -, *, /, //, %, ** all work element-wise between two arrays of the same shape.</div></div>'
+ '<div class="calc-card"><div class="card-title">Comparison</div><div class="card-body">&lt;, &gt;, &lt;=, &gt;=, ==, != return boolean arrays. Used for masking and filtering.</div></div>'
+ '<div class="calc-card"><div class="card-title">Logical</div><div class="card-body">&amp; (and), | (or), ~ (not), ^ (xor) combine boolean arrays element-wise.</div></div>'
+ '<div class="calc-card"><div class="card-title">Universal Functions</div><div class="card-body">np.add, np.multiply, np.sqrt, np.exp, np.log \u2014 optimized C implementations of math operations.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\na = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>])\nb = np.<span class="fn">array</span>([<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>])\n\n<span class="cm"># Arithmetic (element-wise)</span>\n<span class="fn">print</span>(a + b)          <span class="cm"># [11 22 33 44]</span>\n<span class="fn">print</span>(a * b)          <span class="cm"># [ 10  40  90 160]</span>\n<span class="fn">print</span>(b / a)          <span class="cm"># [10. 10. 10. 10.]</span>\n<span class="fn">print</span>(a ** <span class="num">2</span>)         <span class="cm"># [ 1  4  9 16]</span>\n\n<span class="cm"># Comparison (returns bool array)</span>\n<span class="fn">print</span>(a > <span class="num">2</span>)          <span class="cm"># [False False  True  True]</span>\n<span class="fn">print</span>(a == b)         <span class="cm"># [False False False False]</span>\n\n<span class="cm"># Logical operations on bool arrays</span>\nmask1 = a > <span class="num">1</span>\nmask2 = a < <span class="num">4</span>\n<span class="fn">print</span>(mask1 & mask2)  <span class="cm"># [False  True  True False]</span>\n<span class="fn">print</span>(a[mask1 & mask2])  <span class="cm"># [2 3]  \u2190 boolean indexing!</span></code></pre></div>'

+ '<p class="l-text"><strong>Universal functions (ufuncs)</strong> are NumPy\u2019s optimized element-wise functions. They are implemented in C and operate on entire arrays without Python-level loops:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nx = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">4</span>, <span class="num">9</span>, <span class="num">16</span>, <span class="num">25</span>])\n\n<span class="cm"># Ufunc equivalents of operators</span>\nnp.<span class="fn">add</span>(x, <span class="num">10</span>)           <span class="cm"># [11 14 19 26 35]  same as x + 10</span>\nnp.<span class="fn">multiply</span>(x, <span class="num">2</span>)       <span class="cm"># [ 2  8 18 32 50]  same as x * 2</span>\n\n<span class="cm"># Math ufuncs</span>\nnp.<span class="fn">sqrt</span>(x)               <span class="cm"># [1. 2. 3. 4. 5.]</span>\nnp.<span class="fn">exp</span>(np.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">1</span>,<span class="num">2</span>]))  <span class="cm"># [1.    2.718  7.389]</span>\nnp.<span class="fn">log</span>(np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">10</span>,<span class="num">100</span>]))  <span class="cm"># [0.    2.303  4.605]  natural log</span>\nnp.<span class="fn">log10</span>(np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">10</span>,<span class="num">100</span>]))  <span class="cm"># [0. 1. 2.]  base-10 log</span>\nnp.<span class="fn">abs</span>(np.<span class="fn">array</span>([-<span class="num">3</span>, -<span class="num">1</span>, <span class="num">2</span>]))  <span class="cm"># [3 1 2]</span>\n\n<span class="cm"># Ufuncs have useful methods</span>\nnp.<span class="fn">add</span>.<span class="fn">reduce</span>(x)        <span class="cm"># 55  (cumulative sum)</span>\nnp.<span class="fn">multiply</span>.<span class="fn">reduce</span>(x)   <span class="cm"># 14400  (cumulative product)</span>\nnp.<span class="fn">add</span>.<span class="fn">accumulate</span>(x)    <span class="cm"># [ 1  5 14 30 55]  running sum</span></code></pre></div>'

+ '<div class="calc-highlight"><strong>Performance difference:</strong> Ufuncs run in compiled C. A Python loop over 1 million elements takes ~200ms. The same operation with NumPy ufuncs takes ~2ms \u2014 that is a <strong>100\u00d7 speedup</strong>. This is why vectorization matters.</div>'

/* --- Plotly: Performance Comparison (EN) --- */
+ '<div id="plot-perf-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sizes=["1K","10K","100K","1M","10M"];'
+ 'var loop_times=[0.3,3,30,300,3000];'
+ 'var np_times=[0.01,0.05,0.4,2,18];'
+ 'var t1={x:sizes,y:loop_times,name:"Python Loop",type:"bar",marker:{color:"#f87171"}};'
+ 'var t2={x:sizes,y:np_times,name:"NumPy Vectorized",type:"bar",marker:{color:"#4de87a"}};'
+ 'var layout={title:{text:"Python Loop vs NumPy: Element-wise Multiply (ms)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"Array Size",gridcolor:"rgba(255,255,255,0.06)"},yaxis:{title:"Time (ms, log scale)",type:"log",gridcolor:"rgba(255,255,255,0.06)"},barmode:"group",margin:{t:50,r:30,b:50,l:60},legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-perf-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Log-scale comparison of Python loop vs NumPy vectorized element-wise multiply. The gap widens as array size grows \u2014 at 10M elements, NumPy is ~170\u00d7 faster. This is the core reason to use vectorized code.</div></div>'

/* ============================================================
   SECTION 2: Broadcasting Rules
   ============================================================ */
+ '<h2 class="l-title">2. Broadcasting Rules</h2>'

+ '<p class="l-text"><strong>Broadcasting</strong> is NumPy\u2019s mechanism for performing operations on arrays with <em>different shapes</em>. Instead of requiring you to manually copy data to match shapes, NumPy automatically \u201cstretches\u201d the smaller array to be compatible.</p>'

+ '<div class="calc-example"><div class="example-label">SIMPLE EXAMPLE</div><div class="example-body"><strong>Array + Scalar:</strong> When you write <code>np.array([1,2,3]) + 10</code>, NumPy broadcasts the scalar 10 to match the array shape [3], effectively computing <code>[1+10, 2+10, 3+10] = [11, 12, 13]</code>. The scalar is \u201cstretched\u201d to [10, 10, 10] conceptually (no actual memory copy).</div></div>'

+ '<p class="l-text">Broadcasting follows <strong>3 strict rules</strong> applied from the trailing (rightmost) dimension:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Pad Dimensions</div><div class="step-detail">If the arrays have different numbers of dimensions, the shape of the <strong>smaller</strong> array is padded with 1s on the <strong>left</strong> until both shapes have the same length.<br><br><strong>Example:</strong> shape (3,) becomes (1, 3) when paired with shape (2, 3).</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Check Compatibility</div><div class="step-detail">Two dimensions are compatible if they are <strong>equal</strong> or one of them is <strong>1</strong>. If neither condition holds, broadcasting fails with a ValueError.<br><br><strong>Example:</strong> (2, 3) vs (1, 3) \u2192 dimensions are (2 vs 1) and (3 vs 3) \u2192 both compatible.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Stretch</div><div class="step-detail">Any dimension of size <strong>1</strong> is \u201cstretched\u201d (repeated) to match the other array\u2019s size in that dimension. The result shape is the element-wise maximum of the two shapes.<br><br><strong>Example:</strong> (2, 3) vs (1, 3) \u2192 result shape: (2, 3). The (1,3) array is repeated along dim 0.</div></div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">COMPATIBLE</div>'
+ '<div class="compare-item">(5,3) + (5,3) \u2192 (5,3) <em>same shape</em></div>'
+ '<div class="compare-item">(5,3) + (3,) \u2192 (5,3) <em>row broadcast</em></div>'
+ '<div class="compare-item">(5,3) + (5,1) \u2192 (5,3) <em>col broadcast</em></div>'
+ '<div class="compare-item">(5,1) + (1,3) \u2192 (5,3) <em>both stretch</em></div>'
+ '<div class="compare-item">(3,1,5) + (1,4,5) \u2192 (3,4,5)</div></div>'
+ '<div class="compare-col"><div class="compare-title">INCOMPATIBLE</div>'
+ '<div class="compare-item">(5,3) + (5,) \u2192 ERROR</div>'
+ '<div class="compare-item">(5,3) + (4,3) \u2192 ERROR</div>'
+ '<div class="compare-item">(3,2) + (2,3) \u2192 ERROR</div>'
+ '<div class="compare-item"><em>Trailing dims must match or be 1</em></div>'
+ '<div class="compare-item"><em>No broadcasting if both dims &gt; 1 and unequal</em></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Rule 1: Pad with 1s on the left</span>\nA = np.<span class="fn">ones</span>((<span class="num">3</span>, <span class="num">4</span>))      <span class="cm"># shape (3, 4)</span>\nb = np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>])   <span class="cm"># shape (4,) \u2192 padded to (1, 4)</span>\nresult = A + b             <span class="cm"># (3,4) + (1,4) \u2192 (3,4)  \u2714</span>\n\n<span class="cm"># Rule 2: Dimensions must be equal or 1</span>\nC = np.<span class="fn">ones</span>((<span class="num">3</span>, <span class="num">4</span>))\nd = np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>])     <span class="cm"># shape (3,) \u2192 padded to (1, 3)</span>\n<span class="cm"># C + d  \u2192 ERROR! (3,4) vs (1,3): 4 != 3 and neither is 1</span>\n\n<span class="cm"># Rule 3: Stretch dimensions of size 1</span>\ncol = np.<span class="fn">array</span>([[<span class="num">10</span>],[<span class="num">20</span>],[<span class="num">30</span>]])  <span class="cm"># shape (3, 1)</span>\nrow = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>])    <span class="cm"># shape (4,) \u2192 (1, 4)</span>\n<span class="fn">print</span>(col + row)  <span class="cm"># shape (3,4) \u2014 outer addition!</span>\n<span class="cm"># [[11 12 13 14]</span>\n<span class="cm">#  [21 22 23 24]</span>\n<span class="cm">#  [31 32 33 34]]</span></code></pre></div>'

/* --- Plotly: Broadcasting Shape Alignment (EN) --- */
+ '<div id="plot-broadcast-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var ann=[];'
+ 'var shapes=[];'
/* Row: A (3,4) */
+ 'shapes.push({x:[0,4],y:[3.8,3.8],mode:"lines",line:{color:"#c8a96e",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[0,4],y:[3.0,3.0],mode:"lines",line:{color:"#c8a96e",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[0,4],y:[2.2,2.2],mode:"lines",line:{color:"#c8a96e",width:14},showlegend:false,hoverinfo:"skip"});'
/* Row: b (1,4) */
+ 'shapes.push({x:[0,4],y:[1.0,1.0],mode:"lines",line:{color:"#4ecdc4",width:14},showlegend:false,hoverinfo:"skip"});'
/* Arrow */
+ 'ann.push({x:2,y:0.3,text:"\u2193 Stretch row to 3 copies",showarrow:false,font:{color:"#4ecdc4",size:12}});'
/* Result rows */
+ 'shapes.push({x:[5.5,9.5],y:[3.8,3.8],mode:"lines",line:{color:"#a78bfa",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[5.5,9.5],y:[3.0,3.0],mode:"lines",line:{color:"#a78bfa",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[5.5,9.5],y:[2.2,2.2],mode:"lines",line:{color:"#a78bfa",width:14},showlegend:false,hoverinfo:"skip"});'
/* Labels */
+ 'ann.push({x:2,y:4.5,text:"A  shape (3,4)",showarrow:false,font:{color:"#c8a96e",size:13,family:"monospace"}});'
+ 'ann.push({x:2,y:1.6,text:"b  shape (1,4)",showarrow:false,font:{color:"#4ecdc4",size:13,family:"monospace"}});'
+ 'ann.push({x:7.5,y:4.5,text:"A + b  shape (3,4)",showarrow:false,font:{color:"#a78bfa",size:13,family:"monospace"}});'
+ 'ann.push({x:4.8,y:3.0,text:"+",showarrow:false,font:{color:"#ebe6dc",size:20}});'
+ 'ann.push({x:5.2,y:3.0,text:"=",showarrow:false,font:{color:"#ebe6dc",size:20}});'
/* Cell labels for A */
+ 'ann.push({x:0.5,y:3.8,text:"1",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:3.8,text:"2",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:3.8,text:"3",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:3.8,text:"4",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:0.5,y:3.0,text:"5",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:3.0,text:"6",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:3.0,text:"7",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:3.0,text:"8",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:0.5,y:2.2,text:"9",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:2.2,text:"10",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:2.2,text:"11",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:2.2,text:"12",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
/* Cell labels for b */
+ 'ann.push({x:0.5,y:1.0,text:"10",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:1.0,text:"20",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:1.0,text:"30",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:1.0,text:"40",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
/* Cell labels for result */
+ 'ann.push({x:6.0,y:3.8,text:"11",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:7.0,y:3.8,text:"22",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:8.0,y:3.8,text:"33",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:9.0,y:3.8,text:"44",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:6.0,y:3.0,text:"15",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:7.0,y:3.0,text:"26",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:8.0,y:3.0,text:"37",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:9.0,y:3.0,text:"48",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:6.0,y:2.2,text:"19",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:7.0,y:2.2,text:"30",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:8.0,y:2.2,text:"41",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:9.0,y:2.2,text:"52",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'var layout={title:{text:"Broadcasting: (3,4) + (1,4) \u2192 (3,4)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{visible:false,range:[-0.5,10]},yaxis:{visible:false,range:[-0.3,5.2]},annotations:ann,margin:{t:50,r:20,b:20,l:20},showlegend:false};'
+ 'Plotly.newPlot("plot-broadcast-en",shapes,layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Array A (3\u00d74, gold) is added to row vector b (1\u00d74, teal). Broadcasting stretches b to 3 rows to match A. The result (purple) is A + b applied row-by-row.</div></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Can you broadcast a (5,1) array with a (1,3) array? What is the result shape? <em>Answer: Yes! (5,1) + (1,3) \u2192 (5,3). Both dimensions stretch: rows of the first array repeat across 3 columns, columns of the second array repeat across 5 rows.</em></div></div>'

/* ============================================================
   SECTION 3: Broadcasting in Practice
   ============================================================ */
+ '<h2 class="l-title">3. Broadcasting in Practice</h2>'

+ '<p class="l-text">Broadcasting is not just a trick \u2014 it is the foundation of real-world data processing in NumPy. Here are the patterns you will use constantly:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">Z</div><div class="step-content"><div class="step-title">Z-Score Normalization</div><div class="step-detail">Subtract the column mean and divide by column std. Each column (feature) is normalized independently. Shape: data (n, d) - mean (d,) / std (d,) \u2192 broadcasts perfectly.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">D</div><div class="step-content"><div class="step-title">Distance Matrices</div><div class="step-detail">Compute pairwise distances between n points without a single loop. Reshape to (n,1,d) and (1,n,d), subtract, square, sum. Broadcasting handles the cross-pairs.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">\u2297</div><div class="step-content"><div class="step-title">Outer Products</div><div class="step-detail">Multiply a column (n,1) by a row (1,m) to get an (n,m) matrix. This is how you build multiplication tables, kernel matrices, or attention scores.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># === Z-Score Normalization ===</span>\n<span class="cm"># 100 samples, 4 features</span>\ndata = np.random.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">4</span>) * [<span class="num">10</span>, <span class="num">1</span>, <span class="num">0.1</span>, <span class="num">50</span>] + [<span class="num">5</span>, <span class="num">0</span>, <span class="num">3</span>, <span class="num">100</span>]\n\nmean = data.<span class="fn">mean</span>(axis=<span class="num">0</span>)   <span class="cm"># shape (4,) \u2014 one mean per column</span>\nstd  = data.<span class="fn">std</span>(axis=<span class="num">0</span>)    <span class="cm"># shape (4,) \u2014 one std per column</span>\nnormalized = (data - mean) / std  <span class="cm"># (100,4) - (4,) / (4,) \u2192 broadcast!</span>\n<span class="fn">print</span>(normalized.<span class="fn">mean</span>(axis=<span class="num">0</span>))  <span class="cm"># \u2248 [0, 0, 0, 0]</span>\n<span class="fn">print</span>(normalized.<span class="fn">std</span>(axis=<span class="num">0</span>))   <span class="cm"># \u2248 [1, 1, 1, 1]</span>\n\n<span class="cm"># === Distance Matrix (pairwise Euclidean) ===</span>\npoints = np.random.<span class="fn">randn</span>(<span class="num">5</span>, <span class="num">3</span>)  <span class="cm"># 5 points in 3D</span>\n<span class="cm"># Reshape for broadcasting: (5,1,3) - (1,5,3) \u2192 (5,5,3)</span>\ndiff = points[:, np.newaxis, :] - points[np.newaxis, :, :]\ndist_matrix = np.<span class="fn">sqrt</span>((diff ** <span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">2</span>))  <span class="cm"># (5, 5)</span>\n<span class="fn">print</span>(<span class="str">"Shape:"</span>, dist_matrix.shape)  <span class="cm"># (5, 5)</span>\n<span class="fn">print</span>(<span class="str">"Diagonal (self-dist):"</span>, np.<span class="fn">diag</span>(dist_matrix))  <span class="cm"># [0,0,0,0,0]</span>\n\n<span class="cm"># === Outer Product ===</span>\na = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])      <span class="cm"># (3,)</span>\nb = np.<span class="fn">array</span>([<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>])  <span class="cm"># (4,)</span>\nouter = a[:, np.newaxis] * b[np.newaxis, :]  <span class="cm"># (3,1)*(1,4) \u2192 (3,4)</span>\n<span class="fn">print</span>(outer)\n<span class="cm"># [[ 10  20  30  40]</span>\n<span class="cm">#  [ 20  40  60  80]</span>\n<span class="cm">#  [ 30  60  90 120]]</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Z-score normalization (above) is exactly what sklearn\'s <code>StandardScaler</code> does. Distance matrices power KNN, kernel methods, and t-SNE. Outer products appear in attention mechanisms: query \u00d7 key\u1d40 in transformers is essentially a batched outer product.</div>'

/* --- Plotly: Normalization Before/After (EN) --- */
+ '<div id="plot-norm-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var x1=[12,15,8,20,5,18,11,14,9,22];'
+ 'var x2=[0.5,0.7,0.3,0.9,0.2,0.8,0.4,0.6,0.35,0.95];'
+ 'var m1=13.4,s1=5.23,m2=0.57,s2=0.247;'
+ 'var n1=x1.map(function(v){return (v-m1)/s1;});'
+ 'var n2=x2.map(function(v){return (v-m2)/s2;});'
+ 'var t1={y:x1,name:"Feature 1 (raw)",type:"box",marker:{color:"#c8a96e"},boxpoints:"all"};'
+ 'var t2={y:x2,name:"Feature 2 (raw)",type:"box",marker:{color:"#4ecdc4"},boxpoints:"all"};'
+ 'var t3={y:n1,name:"Feature 1 (norm)",type:"box",marker:{color:"#f87171"},boxpoints:"all"};'
+ 'var t4={y:n2,name:"Feature 2 (norm)",type:"box",marker:{color:"#a78bfa"},boxpoints:"all"};'
+ 'var layout={title:{text:"Z-Score Normalization: Before vs After",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:50,r:20,b:40,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-norm-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Before normalization, Feature 1 (range 5\u201322) and Feature 2 (range 0.2\u20130.95) are on completely different scales. After z-score normalization, both center around 0 with standard deviation 1, making them comparable for ML algorithms.</div></div>'

/* ============================================================
   SECTION 4: Aggregation Functions
   ============================================================ */
+ '<h2 class="l-title">4. Aggregation Functions</h2>'

+ '<p class="l-text"><strong>Aggregation</strong> reduces an array (or a dimension of it) to a single summary value. The <code>axis</code> parameter controls <em>which dimension collapses</em>:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">np.sum</div><div class="card-body">Sum of elements. axis=0 sums each column, axis=1 sums each row, None sums everything.</div></div>'
+ '<div class="calc-card"><div class="card-title">np.mean</div><div class="card-body">Arithmetic average. Essential for statistics, normalization, and loss computation.</div></div>'
+ '<div class="calc-card"><div class="card-title">np.std / np.var</div><div class="card-body">Standard deviation and variance. Measure spread of data.</div></div>'
+ '<div class="calc-card"><div class="card-title">min/max/argmin/argmax</div><div class="card-body">Extremes and their positions. argmax returns the index of the maximum value.</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>Understanding axis:</strong> Think of <code>axis=N</code> as \u201ccollapse dimension N.\u201d For a 2D array with shape (rows, cols): <code>axis=0</code> collapses rows (result: one value per column), <code>axis=1</code> collapses columns (result: one value per row), <code>axis=None</code> collapses everything to a single number.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nM = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>],\n              [<span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>],\n              [<span class="num">7</span>, <span class="num">8</span>, <span class="num">9</span>]])\n\n<span class="cm"># Sum</span>\n<span class="fn">print</span>(np.<span class="fn">sum</span>(M))            <span class="cm"># 45       (all elements)</span>\n<span class="fn">print</span>(np.<span class="fn">sum</span>(M, axis=<span class="num">0</span>))    <span class="cm"># [12 15 18]  (sum each column)</span>\n<span class="fn">print</span>(np.<span class="fn">sum</span>(M, axis=<span class="num">1</span>))    <span class="cm"># [ 6 15 24]  (sum each row)</span>\n\n<span class="cm"># Mean and Std</span>\n<span class="fn">print</span>(np.<span class="fn">mean</span>(M, axis=<span class="num">0</span>))   <span class="cm"># [4. 5. 6.]  (column means)</span>\n<span class="fn">print</span>(np.<span class="fn">std</span>(M, axis=<span class="num">1</span>))    <span class="cm"># [0.816 0.816 0.816] (row stds)</span>\n\n<span class="cm"># Min, Max, Argmin, Argmax</span>\n<span class="fn">print</span>(np.<span class="fn">min</span>(M))            <span class="cm"># 1</span>\n<span class="fn">print</span>(np.<span class="fn">max</span>(M, axis=<span class="num">0</span>))    <span class="cm"># [7 8 9]  (max of each column)</span>\n<span class="fn">print</span>(np.<span class="fn">argmax</span>(M, axis=<span class="num">1</span>)) <span class="cm"># [2 2 2]  (index of max in each row)</span>\n\n<span class="cm"># Cumulative operations</span>\n<span class="fn">print</span>(np.<span class="fn">cumsum</span>(M, axis=<span class="num">1</span>)) <span class="cm"># [[ 1  3  6]</span>\n                             <span class="cm">#  [ 4  9 15]</span>\n                             <span class="cm">#  [ 7 15 24]]  running sum per row</span>\n<span class="fn">print</span>(np.<span class="fn">cumprod</span>(M, axis=<span class="num">0</span>))<span class="cm"># [[  1   2   3]</span>\n                             <span class="cm">#  [  4  10  18]</span>\n                             <span class="cm">#  [ 28  80 162]]  running product per col</span></code></pre></div>'

/* --- Plotly: Axis Aggregation Diagram (EN) --- */
+ '<div id="plot-axis-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var z=[[1,2,3],[4,5,6],[7,8,9]];'
+ 'var t1={z:z,type:"heatmap",colorscale:[[0,"#1a1a2e"],[1,"#c8a96e"]],showscale:false,text:[["1","2","3"],["4","5","6"],["7","8","9"]],texttemplate:"%{text}",textfont:{color:"#fff",size:16},x:["Col 0","Col 1","Col 2"],y:["Row 0","Row 1","Row 2"],hoverinfo:"skip"};'
+ 'var ann=[];'
+ 'ann.push({x:-0.7,y:0,text:"\u2192 sum=6",showarrow:false,font:{color:"#4ecdc4",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:-0.7,y:1,text:"\u2192 sum=15",showarrow:false,font:{color:"#4ecdc4",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:-0.7,y:2,text:"\u2192 sum=24",showarrow:false,font:{color:"#4ecdc4",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:0,y:-0.6,text:"\u2193 12",showarrow:false,font:{color:"#f87171",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:1,y:-0.6,text:"\u2193 15",showarrow:false,font:{color:"#f87171",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:2,y:-0.6,text:"\u2193 18",showarrow:false,font:{color:"#f87171",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:2.8,y:2.7,text:"axis=1 \u2192",showarrow:false,font:{color:"#4ecdc4",size:11}});'
+ 'ann.push({x:0,y:-1.0,text:"\u2191 axis=0",showarrow:false,font:{color:"#f87171",size:11}});'
+ 'var layout={title:{text:"np.sum() with axis Parameter",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{side:"top",gridcolor:"rgba(255,255,255,0.06)"},yaxis:{autorange:"reversed",gridcolor:"rgba(255,255,255,0.06)"},annotations:ann,margin:{t:70,r:40,b:60,l:80}};'
+ 'Plotly.newPlot("plot-axis-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> A 3\u00d73 matrix with values 1\u20139. Red numbers below show <code>axis=0</code> sums (collapse rows, get column totals). Teal numbers on the right show <code>axis=1</code> sums (collapse columns, get row totals).</div></div>'

+ '<div class="calc-example"><div class="example-label">PRACTICAL EXAMPLE</div><div class="example-body"><strong>Finding the predicted class in ML:</strong><br><br><code>logits = model.predict(X)  # shape (batch, num_classes)</code><br><code>predictions = np.argmax(logits, axis=1)  # shape (batch,)</code><br><br><code>argmax(axis=1)</code> finds the class index with highest probability for each sample. This is how every classifier produces final predictions.</div></div>'

/* ============================================================
   SECTION 5: Universal Functions
   ============================================================ */
+ '<h2 class="l-title">5. Universal Functions (Ufuncs)</h2>'

+ '<p class="l-text">Ufuncs are the engine behind NumPy\u2019s speed. Every mathematical function in NumPy is a ufunc: it takes arrays as input, operates element-wise in compiled C, and returns arrays. Here is the complete toolkit:</p>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">TRIGONOMETRIC</div>'
+ '<div class="compare-item"><strong>np.sin(x)</strong> \u2014 sine</div>'
+ '<div class="compare-item"><strong>np.cos(x)</strong> \u2014 cosine</div>'
+ '<div class="compare-item"><strong>np.tan(x)</strong> \u2014 tangent</div>'
+ '<div class="compare-item"><strong>np.arcsin(x)</strong> \u2014 inverse sine</div>'
+ '<div class="compare-item"><strong>np.arctan2(y,x)</strong> \u2014 angle from coordinates</div></div>'
+ '<div class="compare-col"><div class="compare-title">EXPONENTIAL / LOG</div>'
+ '<div class="compare-item"><strong>np.exp(x)</strong> \u2014 e\u02e3</div>'
+ '<div class="compare-item"><strong>np.log(x)</strong> \u2014 natural log (ln)</div>'
+ '<div class="compare-item"><strong>np.log2(x)</strong> \u2014 base-2 log</div>'
+ '<div class="compare-item"><strong>np.log10(x)</strong> \u2014 base-10 log</div>'
+ '<div class="compare-item"><strong>np.expm1(x)</strong> \u2014 e\u02e3 - 1 (precise for small x)</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">ROUNDING / CLIPPING</div>'
+ '<div class="compare-item"><strong>np.round(x, n)</strong> \u2014 round to n decimals</div>'
+ '<div class="compare-item"><strong>np.floor(x)</strong> \u2014 round down</div>'
+ '<div class="compare-item"><strong>np.ceil(x)</strong> \u2014 round up</div>'
+ '<div class="compare-item"><strong>np.clip(x, lo, hi)</strong> \u2014 clamp to [lo, hi]</div>'
+ '<div class="compare-item"><strong>np.abs(x)</strong> \u2014 absolute value</div></div>'
+ '<div class="compare-col"><div class="compare-title">SPECIAL / ML</div>'
+ '<div class="compare-item"><strong>np.sign(x)</strong> \u2014 -1, 0, or +1</div>'
+ '<div class="compare-item"><strong>np.maximum(a,b)</strong> \u2014 element-wise max (ReLU!)</div>'
+ '<div class="compare-item"><strong>np.where(cond,a,b)</strong> \u2014 conditional select</div>'
+ '<div class="compare-item"><strong>np.isnan(x)</strong> \u2014 detect NaN</div>'
+ '<div class="compare-item"><strong>np.isinf(x)</strong> \u2014 detect infinity</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Trig functions</span>\nangles = np.<span class="fn">array</span>([<span class="num">0</span>, np.pi/<span class="num">6</span>, np.pi/<span class="num">4</span>, np.pi/<span class="num">3</span>, np.pi/<span class="num">2</span>])\n<span class="fn">print</span>(np.<span class="fn">sin</span>(angles))    <span class="cm"># [0.   0.5  0.707 0.866 1.  ]</span>\n<span class="fn">print</span>(np.<span class="fn">cos</span>(angles))    <span class="cm"># [1.   0.866 0.707 0.5   0.  ]</span>\n\n<span class="cm"># Clip: restrict values to a range (gradient clipping!)</span>\ngradients = np.<span class="fn">array</span>([-<span class="num">5.2</span>, <span class="num">0.3</span>, <span class="num">1.1</span>, <span class="num">8.7</span>, -<span class="num">0.1</span>])\nclipped = np.<span class="fn">clip</span>(gradients, -<span class="num">1</span>, <span class="num">1</span>)\n<span class="fn">print</span>(clipped)  <span class="cm"># [-1.   0.3  1.   1.  -0.1]</span>\n\n<span class="cm"># ReLU activation function = np.maximum(0, x)</span>\nx = np.<span class="fn">array</span>([-<span class="num">2</span>, -<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>])\nrelu = np.<span class="fn">maximum</span>(<span class="num">0</span>, x)\n<span class="fn">print</span>(relu)     <span class="cm"># [0 0 0 1 2]</span>\n\n<span class="cm"># Softmax (stable version)</span>\nlogits = np.<span class="fn">array</span>([<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.1</span>])\nexp_logits = np.<span class="fn">exp</span>(logits - np.<span class="fn">max</span>(logits))  <span class="cm"># subtract max for numerical stability</span>\nsoftmax = exp_logits / np.<span class="fn">sum</span>(exp_logits)\n<span class="fn">print</span>(softmax)  <span class="cm"># [0.659 0.243 0.099]  sums to 1.0</span>\n\n<span class="cm"># np.vectorize: wrap a Python function as a ufunc</span>\n<span class="kw">def</span> <span class="fn">custom_activation</span>(x):\n    <span class="kw">return</span> x <span class="kw">if</span> x > <span class="num">0</span> <span class="kw">else</span> <span class="num">0.01</span> * x  <span class="cm"># leaky ReLU</span>\n\nvectorized_fn = np.<span class="fn">vectorize</span>(custom_activation)\n<span class="fn">print</span>(vectorized_fn(np.<span class="fn">array</span>([-<span class="num">3</span>, -<span class="num">1</span>, <span class="num">0</span>, <span class="num">2</span>, <span class="num">5</span>])))\n<span class="cm"># [-0.03 -0.01  0.    2.    5.  ]</span></code></pre></div>'

+ '<div class="l-note"><strong>Warning about np.vectorize:</strong> Despite its name, <code>np.vectorize</code> is NOT truly vectorized \u2014 it is a convenience wrapper that still uses a Python loop internally. It is useful for applying complex branching logic, but it provides no speed benefit over a loop. For performance, use native ufuncs or boolean indexing.</div>'

/* ============================================================
   SECTION 6: Performance Optimization
   ============================================================ */
+ '<h2 class="l-title">6. Performance Optimization</h2>'

+ '<p class="l-text">Writing fast NumPy code is about <strong>keeping computation inside C</strong> and <strong>minimizing Python overhead</strong>. Here are the key strategies:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Eliminate Python Loops</div><div class="step-detail">Replace <code>for i in range(n)</code> with vectorized operations, broadcasting, or fancy indexing. Every loop iteration has Python interpreter overhead (~100ns) that multiplies across millions of elements.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Use In-place Operations</div><div class="step-detail"><code>a += b</code> modifies <code>a</code> directly instead of allocating a new array. For large arrays, this saves significant memory allocation time. Also: <code>np.add(a, b, out=a)</code>.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Memory Layout (C vs F order)</div><div class="step-detail">NumPy stores arrays in <strong>row-major (C)</strong> order by default. Iterating along the last axis (columns) is fastest because data is contiguous in memory. For column operations, consider Fortran order <code>np.array(data, order=\'F\')</code>.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">np.einsum for Complex Operations</div><div class="step-detail">Einstein summation notation can express dot products, outer products, traces, transpositions, and contractions in a single optimized call. Often faster than chaining multiple operations.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">import</span> time\n\nn = <span class="num">1_000_000</span>\na = np.random.<span class="fn">randn</span>(n)\nb = np.random.<span class="fn">randn</span>(n)\n\n<span class="cm"># BAD: Python loop</span>\nt0 = time.<span class="fn">time</span>()\nresult_loop = np.<span class="fn">empty</span>(n)\n<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):\n    result_loop[i] = a[i] * b[i] + a[i]**<span class="num">2</span>\nloop_time = time.<span class="fn">time</span>() - t0\n\n<span class="cm"># GOOD: Vectorized</span>\nt0 = time.<span class="fn">time</span>()\nresult_vec = a * b + a**<span class="num">2</span>\nvec_time = time.<span class="fn">time</span>() - t0\n\n<span class="fn">print</span>(<span class="str">f"Loop: {loop_time:.3f}s"</span>)   <span class="cm"># ~0.5s</span>\n<span class="fn">print</span>(<span class="str">f"Vectorized: {vec_time:.4f}s"</span>)  <span class="cm"># ~0.004s</span>\n<span class="fn">print</span>(<span class="str">f"Speedup: {loop_time/vec_time:.0f}x"</span>)  <span class="cm"># ~125x</span></code></pre></div>'

+ '<p class="l-text"><strong>np.einsum</strong> is a powerful tool that expresses complex array operations using Einstein summation notation. It can replace many combinations of transpose, dot, sum, and multiply:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nA = np.random.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">4</span>)\nB = np.random.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">5</span>)\nv = np.random.<span class="fn">randn</span>(<span class="num">4</span>)\n\n<span class="cm"># Matrix multiply:  C_ij = sum_k A_ik * B_kj</span>\nC = np.<span class="fn">einsum</span>(<span class="str">\'ik,kj->ij\'</span>, A, B)        <span class="cm"># same as A @ B</span>\n\n<span class="cm"># Dot product:  s = sum_i a_i * b_i</span>\ns = np.<span class="fn">einsum</span>(<span class="str">\'i,i->\'</span>, v, v)              <span class="cm"># same as np.dot(v, v)</span>\n\n<span class="cm"># Trace (sum of diagonal):  t = sum_i A_ii</span>\nM = np.random.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">4</span>)\nt = np.<span class="fn">einsum</span>(<span class="str">\'ii->\'</span>, M)                  <span class="cm"># same as np.trace(M)</span>\n\n<span class="cm"># Outer product:  O_ij = a_i * b_j</span>\na = np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>])\nb = np.<span class="fn">array</span>([<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>,<span class="num">7</span>])\nO = np.<span class="fn">einsum</span>(<span class="str">\'i,j->ij\'</span>, a, b)            <span class="cm"># same as np.outer(a, b)</span>\n\n<span class="cm"># Batch matrix multiply (useful in deep learning)</span>\n<span class="cm"># batch of 10 matrices: (10,3,4) @ (10,4,5) \u2192 (10,3,5)</span>\nbatch_A = np.random.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">3</span>, <span class="num">4</span>)\nbatch_B = np.random.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">4</span>, <span class="num">5</span>)\nbatch_C = np.<span class="fn">einsum</span>(<span class="str">\'nik,nkj->nij\'</span>, batch_A, batch_B)</code></pre></div>'

+ '<div class="calc-highlight"><strong>When to use Numba:</strong> When you genuinely need a Python loop (e.g., sequential dependencies where each iteration depends on the previous), <code>@numba.jit(nopython=True)</code> compiles the loop to machine code. This gives C-level speed while keeping Python syntax. Numba is a separate package: <code>pip install numba</code>.</div>'

+ '<div class="calc-example"><div class="example-label">OPTIMIZATION CHECKLIST</div><div class="example-body"><strong>Before writing any NumPy code, ask yourself:</strong><br><br>1. Can I express this operation <strong>without a loop</strong>? (vectorize, broadcast, fancy index)<br>2. Am I <strong>creating unnecessary temporary arrays</strong>? (use in-place ops or einsum)<br>3. Am I iterating along the <strong>right axis</strong>? (last axis is fastest for C-order arrays)<br>4. Can <strong>einsum</strong> replace my chain of transpose/dot/sum?<br>5. Is there a built-in NumPy function that already does this? (check the docs!)</div></div>'

+ '<div class="l-warn"><strong>Next Lesson:</strong> In Lesson 4, we cover <strong>Array Manipulation</strong> \u2014 reshaping, stacking, splitting, sorting, and advanced indexing techniques that let you restructure arrays for any data processing task.</div>',


/* ============================================================
   =================== TURKISH VERSION =======================
   ============================================================ */

tr:

'<p class="l-text"><strong>Broadcasting ve vekt\u00f6rizasyon</strong>, NumPy\u2019yi h\u0131zl\u0131 yapan iki s\u00fcper g\u00fc\u00e7t\u00fcr. Vekt\u00f6rizasyon, Python d\u00f6ng\u00fclerini t\u00fcm diziler \u00fczerine optimize edilmi\u015f C i\u015flemleriyle de\u011fi\u015ftirir. Broadcasting, farkl\u0131 \u015fekillerdeki dizileri otomatik olarak hizalayarak manuel yeniden boyutland\u0131rma yapmadan birle\u015ftirmenizi sa\u011flar. Birlikte, saf Python\u2019dan 10\u2013100\u00d7 daha h\u0131zl\u0131 \u00e7al\u0131\u015fan k\u0131sa ve okunabilir kod yazman\u0131z\u0131 sa\u011flarlar.</p>'

+ '<div class="calc-highlight"><strong>NumPy\u2019nin alt\u0131n kurallar\u0131:</strong> E\u011fer dizi elemanlar\u0131 \u00fczerine bir Python <code>for</code> d\u00f6ng\u00fcs\u00fc yaz\u0131yorsan\u0131z, neredeyse kesinlikle yanl\u0131\u015f yap\u0131yorsunuz. NumPy\u2019nin eleman baz\u0131nda i\u015flemleri, broadcasting\u2019i ve toplama fonksiyonlar\u0131, d\u00f6ng\u00fcleri derlenmi\u015f C koduyla de\u011fi\u015ftirerek kat kat daha h\u0131zl\u0131 \u00e7al\u0131\u015f\u0131r.</div>'
+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Her şekilde dizide eleman bazında aritmetik ve ufunc uygula</li><li>Şekil uyumsuz dizilerde döngüsüz hesap için broadcasting kullan</li><li>Broadcasting kurallarını oku ve sonuç şeklini önceden tahmin et</li><li>Seçilen eksende sum, mean, std, max ve argmax ile toplulaştır</li><li>Aksi halde Python döngüsü gerektirecek bir ML hesabını vektörleştir</li></ul></div>'


/* ============================================================
   B\u00d6L\u00dcM 1: Eleman Baz\u0131nda \u0130\u015flemler
   ============================================================ */
+ '<h2 class="l-title">1. Eleman Baz\u0131nda \u0130\u015flemler</h2>'

+ '<p class="l-text">Ayn\u0131 \u015fekle sahip iki diziye aritmetik operat\u00f6r uygulad\u0131\u011f\u0131n\u0131zda, NumPy i\u015flemi <em>eleman eleman</em> ger\u00e7ekle\u015ftirir. Buna <strong>vekt\u00f6rize i\u015flem</strong> denir \u00e7\u00fcnk\u00fc d\u00f6ng\u00fc yerine t\u00fcm vekt\u00f6r\u00fc (diziyi) tek ad\u0131mda i\u015fler.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Aritmetik</div><div class="card-body">+, -, *, /, //, %, ** ayn\u0131 \u015fekildeki iki dizi aras\u0131nda eleman baz\u0131nda \u00e7al\u0131\u015f\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kar\u015f\u0131la\u015ft\u0131rma</div><div class="card-body">&lt;, &gt;, &lt;=, &gt;=, ==, != boolean dizileri d\u00f6nd\u00fcr\u00fcr. Maskeleme ve filtreleme i\u00e7in kullan\u0131l\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mant\u0131ksal</div><div class="card-body">&amp; (ve), | (veya), ~ (de\u011fil), ^ (xor) boolean dizilerini eleman baz\u0131nda birle\u015ftirir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Evrensel Fonksiyonlar</div><div class="card-body">np.add, np.multiply, np.sqrt, np.exp, np.log \u2014 matematik i\u015flemlerin optimize C uygulamalar\u0131.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\na = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>])\nb = np.<span class="fn">array</span>([<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>])\n\n<span class="cm"># Aritmetik (eleman baz\u0131nda)</span>\n<span class="fn">print</span>(a + b)          <span class="cm"># [11 22 33 44]</span>\n<span class="fn">print</span>(a * b)          <span class="cm"># [ 10  40  90 160]</span>\n<span class="fn">print</span>(b / a)          <span class="cm"># [10. 10. 10. 10.]</span>\n<span class="fn">print</span>(a ** <span class="num">2</span>)         <span class="cm"># [ 1  4  9 16]</span>\n\n<span class="cm"># Kar\u015f\u0131la\u015ft\u0131rma (bool dizisi d\u00f6nd\u00fcr\u00fcr)</span>\n<span class="fn">print</span>(a > <span class="num">2</span>)          <span class="cm"># [False False  True  True]</span>\n\n<span class="cm"># Boolean dizilerde mant\u0131ksal i\u015flemler</span>\nmask1 = a > <span class="num">1</span>\nmask2 = a < <span class="num">4</span>\n<span class="fn">print</span>(a[mask1 & mask2])  <span class="cm"># [2 3]  \u2190 boolean indeksleme!</span></code></pre></div>'

+ '<p class="l-text"><strong>Evrensel fonksiyonlar (ufunc\'ler)</strong>, NumPy\u2019nin optimize eleman baz\u0131nda fonksiyonlar\u0131d\u0131r. C\u2019de uygulanm\u0131\u015ft\u0131r ve t\u00fcm diziler \u00fczerinde Python seviyesinde d\u00f6ng\u00fc olmadan \u00e7al\u0131\u015f\u0131r:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nx = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">4</span>, <span class="num">9</span>, <span class="num">16</span>, <span class="num">25</span>])\n\n<span class="cm"># Operat\u00f6rlerin ufunc kar\u015f\u0131l\u0131klar\u0131</span>\nnp.<span class="fn">add</span>(x, <span class="num">10</span>)           <span class="cm"># [11 14 19 26 35]</span>\nnp.<span class="fn">multiply</span>(x, <span class="num">2</span>)       <span class="cm"># [ 2  8 18 32 50]</span>\n\n<span class="cm"># Matematik ufunc\u2019ler</span>\nnp.<span class="fn">sqrt</span>(x)               <span class="cm"># [1. 2. 3. 4. 5.]</span>\nnp.<span class="fn">exp</span>(np.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">1</span>,<span class="num">2</span>]))  <span class="cm"># [1.    2.718  7.389]</span>\nnp.<span class="fn">log</span>(np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">10</span>,<span class="num">100</span>]))  <span class="cm"># [0.    2.303  4.605]</span>\n\n<span class="cm"># Ufunc\u2019lerin kullan\u0131\u015fl\u0131 metodlar\u0131</span>\nnp.<span class="fn">add</span>.<span class="fn">reduce</span>(x)        <span class="cm"># 55  (k\u00fcm\u00fclatif toplam)</span>\nnp.<span class="fn">add</span>.<span class="fn">accumulate</span>(x)    <span class="cm"># [ 1  5 14 30 55]  ko\u015fan toplam</span></code></pre></div>'

+ '<div class="calc-highlight"><strong>Performans fark\u0131:</strong> Ufunc\u2019ler derlenmi\u015f C\u2019de \u00e7al\u0131\u015f\u0131r. 1 milyon elemanda bir Python d\u00f6ng\u00fcs\u00fc ~200ms s\u00fcrer. Ayn\u0131 i\u015flem NumPy ufunc\u2019lerle ~2ms s\u00fcrer \u2014 bu <strong>100\u00d7 h\u0131zlanma</strong> demektir. Vekt\u00f6rizasyonun \u00f6nemli olmas\u0131n\u0131n nedeni budur.</div>'

/* --- Plotly: Performans Kar\u015f\u0131la\u015ft\u0131rmas\u0131 (TR) --- */
+ '<div id="plot-perf-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sizes=["1K","10K","100K","1M","10M"];'
+ 'var loop_times=[0.3,3,30,300,3000];'
+ 'var np_times=[0.01,0.05,0.4,2,18];'
+ 'var t1={x:sizes,y:loop_times,name:"Python D\u00f6ng\u00fcs\u00fc",type:"bar",marker:{color:"#f87171"}};'
+ 'var t2={x:sizes,y:np_times,name:"NumPy Vekt\u00f6rize",type:"bar",marker:{color:"#4de87a"}};'
+ 'var layout={title:{text:"Python D\u00f6ng\u00fcs\u00fc vs NumPy: Eleman Baz\u0131nda \u00c7arpma (ms)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"Dizi Boyutu",gridcolor:"rgba(255,255,255,0.06)"},yaxis:{title:"S\u00fcre (ms, log \u00f6l\u00e7ek)",type:"log",gridcolor:"rgba(255,255,255,0.06)"},barmode:"group",margin:{t:50,r:30,b:50,l:60},legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-perf-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6steriyor:</strong> Python d\u00f6ng\u00fcs\u00fc ile NumPy vekt\u00f6rize eleman baz\u0131nda \u00e7arpman\u0131n log \u00f6l\u00e7ekli kar\u015f\u0131la\u015ft\u0131rmas\u0131. Dizi boyutu b\u00fcy\u00fcd\u00fck\u00e7e fark a\u00e7\u0131l\u0131r \u2014 10M elemanda NumPy ~170\u00d7 daha h\u0131zl\u0131d\u0131r.</div></div>'

/* ============================================================
   B\u00d6L\u00dcM 2: Broadcasting Kurallar\u0131
   ============================================================ */
+ '<h2 class="l-title">2. Broadcasting Kurallar\u0131</h2>'

+ '<p class="l-text"><strong>Broadcasting</strong>, NumPy\u2019nin <em>farkl\u0131 \u015fekillerdeki</em> diziler \u00fczerinde i\u015flem yapma mekanizmas\u0131d\u0131r. \u015eekilleri e\u015fle\u015ftirmek i\u00e7in manuel veri kopyalaman\u0131z gerekmez \u2014 NumPy k\u00fc\u00e7\u00fck diziyi otomatik olarak \u201cgerer\u201d.</p>'

+ '<div class="calc-example"><div class="example-label">BASIT \u00d6RNEK</div><div class="example-body"><strong>Dizi + Skaler:</strong> <code>np.array([1,2,3]) + 10</code> yazd\u0131\u011f\u0131n\u0131zda, NumPy 10 skalerini dizi \u015fekline [3] uymak i\u00e7in broadcast eder. Yani <code>[1+10, 2+10, 3+10] = [11, 12, 13]</code> hesaplan\u0131r. Skaler kavramsal olarak [10, 10, 10]\u2019a \u201cgerilir\u201d (ger\u00e7ek bellek kopyas\u0131 yap\u0131lmaz).</div></div>'

+ '<p class="l-text">Broadcasting, sondan (en sa\u011fdaki) boyuttan ba\u015flayarak uygulanan <strong>3 kat\u0131 kural</strong> izler:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Boyutlar\u0131 Doldur</div><div class="step-detail">Diziler farkl\u0131 say\u0131da boyuta sahipse, <strong>k\u00fc\u00e7\u00fck</strong> dizinin \u015fekli her iki \u015fekil ayn\u0131 uzunlu\u011fa ula\u015fana kadar <strong>soldan</strong> 1\u2019lerle doldurulur.<br><br><strong>\u00d6rnek:</strong> (3,) \u015fekli, (2, 3) ile e\u015fle\u015ftirilirken (1, 3) olur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Uyumlulu\u011fu Kontrol Et</div><div class="step-detail">\u0130ki boyut <strong>e\u015fitse</strong> veya biri <strong>1</strong> ise uyumludur. Hi\u00e7biri sa\u011flanmazsa broadcasting ValueError ile ba\u015far\u0131s\u0131z olur.<br><br><strong>\u00d6rnek:</strong> (2, 3) vs (1, 3) \u2192 boyutlar (2 vs 1) ve (3 vs 3) \u2192 ikisi de uyumlu.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Ger</div><div class="step-detail">Boyutu <strong>1</strong> olan herhangi bir boyut, di\u011fer dizinin o boyuttaki boyutuna uymak i\u00e7in \u201cgerilir\u201d (tekrarlan\u0131r). Sonu\u00e7 \u015fekli, iki \u015feklin eleman baz\u0131nda maksimumudur.<br><br><strong>\u00d6rnek:</strong> (2, 3) vs (1, 3) \u2192 sonu\u00e7 \u015fekli: (2, 3). (1,3) dizisi boyut 0 boyunca tekrarlan\u0131r.</div></div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">UYUMLU</div>'
+ '<div class="compare-item">(5,3) + (5,3) \u2192 (5,3) <em>ayn\u0131 \u015fekil</em></div>'
+ '<div class="compare-item">(5,3) + (3,) \u2192 (5,3) <em>sat\u0131r broadcast</em></div>'
+ '<div class="compare-item">(5,3) + (5,1) \u2192 (5,3) <em>s\u00fctun broadcast</em></div>'
+ '<div class="compare-item">(5,1) + (1,3) \u2192 (5,3) <em>ikisi de gerilir</em></div>'
+ '<div class="compare-item">(3,1,5) + (1,4,5) \u2192 (3,4,5)</div></div>'
+ '<div class="compare-col"><div class="compare-title">UYUMSUZ</div>'
+ '<div class="compare-item">(5,3) + (5,) \u2192 HATA</div>'
+ '<div class="compare-item">(5,3) + (4,3) \u2192 HATA</div>'
+ '<div class="compare-item">(3,2) + (2,3) \u2192 HATA</div>'
+ '<div class="compare-item"><em>Sondaki boyutlar e\u015fit veya 1 olmal\u0131</em></div>'
+ '<div class="compare-item"><em>Her iki boyut &gt;1 ve e\u015fit de\u011filse broadcast yok</em></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Kural 1: Soldan 1\u2019lerle doldur</span>\nA = np.<span class="fn">ones</span>((<span class="num">3</span>, <span class="num">4</span>))      <span class="cm"># \u015fekil (3, 4)</span>\nb = np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>])   <span class="cm"># \u015fekil (4,) \u2192 (1, 4) olarak doldurulur</span>\nresult = A + b             <span class="cm"># (3,4) + (1,4) \u2192 (3,4)  \u2714</span>\n\n<span class="cm"># Kural 2: Boyutlar e\u015fit veya 1 olmal\u0131</span>\nC = np.<span class="fn">ones</span>((<span class="num">3</span>, <span class="num">4</span>))\nd = np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>])     <span class="cm"># \u015fekil (3,) \u2192 (1, 3) olarak doldurulur</span>\n<span class="cm"># C + d  \u2192 HATA! (3,4) vs (1,3): 4 != 3 ve ikisi de 1 de\u011fil</span>\n\n<span class="cm"># Kural 3: Boyutu 1 olan boyutlar\u0131 ger</span>\ncol = np.<span class="fn">array</span>([[<span class="num">10</span>],[<span class="num">20</span>],[<span class="num">30</span>]])  <span class="cm"># \u015fekil (3, 1)</span>\nrow = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>])    <span class="cm"># \u015fekil (4,) \u2192 (1, 4)</span>\n<span class="fn">print</span>(col + row)  <span class="cm"># \u015fekil (3,4) \u2014 d\u0131\u015f toplama!</span>\n<span class="cm"># [[11 12 13 14]</span>\n<span class="cm">#  [21 22 23 24]</span>\n<span class="cm">#  [31 32 33 34]]</span></code></pre></div>'

/* --- Plotly: Broadcasting \u015eekil Hizalamas\u0131 (TR) --- */
+ '<div id="plot-broadcast-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var ann=[];'
+ 'var shapes=[];'
+ 'shapes.push({x:[0,4],y:[3.8,3.8],mode:"lines",line:{color:"#c8a96e",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[0,4],y:[3.0,3.0],mode:"lines",line:{color:"#c8a96e",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[0,4],y:[2.2,2.2],mode:"lines",line:{color:"#c8a96e",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[0,4],y:[1.0,1.0],mode:"lines",line:{color:"#4ecdc4",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'ann.push({x:2,y:0.3,text:"\u2193 Sat\u0131r\u0131 3 kopya olarak ger",showarrow:false,font:{color:"#4ecdc4",size:12}});'
+ 'shapes.push({x:[5.5,9.5],y:[3.8,3.8],mode:"lines",line:{color:"#a78bfa",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[5.5,9.5],y:[3.0,3.0],mode:"lines",line:{color:"#a78bfa",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'shapes.push({x:[5.5,9.5],y:[2.2,2.2],mode:"lines",line:{color:"#a78bfa",width:14},showlegend:false,hoverinfo:"skip"});'
+ 'ann.push({x:2,y:4.5,text:"A  \u015fekil (3,4)",showarrow:false,font:{color:"#c8a96e",size:13,family:"monospace"}});'
+ 'ann.push({x:2,y:1.6,text:"b  \u015fekil (1,4)",showarrow:false,font:{color:"#4ecdc4",size:13,family:"monospace"}});'
+ 'ann.push({x:7.5,y:4.5,text:"A + b  \u015fekil (3,4)",showarrow:false,font:{color:"#a78bfa",size:13,family:"monospace"}});'
+ 'ann.push({x:4.8,y:3.0,text:"+",showarrow:false,font:{color:"#ebe6dc",size:20}});'
+ 'ann.push({x:5.2,y:3.0,text:"=",showarrow:false,font:{color:"#ebe6dc",size:20}});'
+ 'ann.push({x:0.5,y:3.8,text:"1",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:3.8,text:"2",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:3.8,text:"3",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:3.8,text:"4",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:0.5,y:3.0,text:"5",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:3.0,text:"6",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:3.0,text:"7",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:3.0,text:"8",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:0.5,y:2.2,text:"9",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:2.2,text:"10",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:2.2,text:"11",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:2.2,text:"12",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:0.5,y:1.0,text:"10",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:1.5,y:1.0,text:"20",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:2.5,y:1.0,text:"30",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:3.5,y:1.0,text:"40",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:6.0,y:3.8,text:"11",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:7.0,y:3.8,text:"22",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:8.0,y:3.8,text:"33",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:9.0,y:3.8,text:"44",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:6.0,y:3.0,text:"15",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:7.0,y:3.0,text:"26",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:8.0,y:3.0,text:"37",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:9.0,y:3.0,text:"48",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:6.0,y:2.2,text:"19",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:7.0,y:2.2,text:"30",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:8.0,y:2.2,text:"41",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'ann.push({x:9.0,y:2.2,text:"52",showarrow:false,font:{color:"#1a1a2e",size:11,family:"monospace"}});'
+ 'var layout={title:{text:"Broadcasting: (3,4) + (1,4) \u2192 (3,4)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{visible:false,range:[-0.5,10]},yaxis:{visible:false,range:[-0.3,5.2]},annotations:ann,margin:{t:50,r:20,b:20,l:20},showlegend:false};'
+ 'Plotly.newPlot("plot-broadcast-tr",shapes,layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6steriyor:</strong> A dizisi (3\u00d74, alt\u0131n) ile sat\u0131r vekt\u00f6r\u00fc b (1\u00d74, turkuaz) toplan\u0131yor. Broadcasting, b\u2019yi A\u2019ya uymak i\u00e7in 3 sat\u0131ra gerer. Sonu\u00e7 (mor), sat\u0131r sat\u0131r A + b\u2019dir.</div></div>'

+ '<div class="think-box"><div class="think-label">D\u00dc\u015e\u00dcN\u00dcN</div><div class="think-body">Bir (5,1) diziyi bir (1,3) dizi ile broadcast edebilir misiniz? Sonu\u00e7 \u015fekli nedir? <em>Cevap: Evet! (5,1) + (1,3) \u2192 (5,3). Her iki boyut da gerilir: birinci dizinin sat\u0131rlar\u0131 3 s\u00fctun boyunca tekrarlan\u0131r, ikinci dizinin s\u00fctunlar\u0131 5 sat\u0131r boyunca tekrarlan\u0131r.</em></div></div>'

/* ============================================================
   B\u00d6L\u00dcM 3: Pratikte Broadcasting
   ============================================================ */
+ '<h2 class="l-title">3. Pratikte Broadcasting</h2>'

+ '<p class="l-text">Broadcasting sadece bir numara de\u011fil \u2014 NumPy\u2019de ger\u00e7ek d\u00fcnya veri i\u015flemenin temelidir. S\u00fcrekli kullanaca\u011f\u0131n\u0131z kal\u0131plar:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">Z</div><div class="step-content"><div class="step-title">Z-Skoru Normalizasyonu</div><div class="step-detail">S\u00fctun ortalamas\u0131n\u0131 \u00e7\u0131kar\u0131p s\u00fctun standart sapmas\u0131na b\u00f6l. Her s\u00fctun (feature) ba\u011f\u0131ms\u0131z olarak normalize edilir. \u015eekil: veri (n, d) - ortalama (d,) / std (d,) \u2192 m\u00fckemmel broadcast.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">D</div><div class="step-content"><div class="step-title">Mesafe Matrisleri</div><div class="step-detail">n nokta aras\u0131ndaki ikili mesafeleri tek bir d\u00f6ng\u00fc olmadan hesaplay\u0131n. (n,1,d) ve (1,n,d) olarak yeniden boyutland\u0131r\u0131n, \u00e7\u0131kar\u0131n, kareleyin, toplay\u0131n. Broadcasting \u00e7apraz \u00e7iftleri halleder.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">\u2297</div><div class="step-content"><div class="step-title">D\u0131\u015f \u00c7arp\u0131mlar</div><div class="step-detail">Bir s\u00fctunu (n,1) bir sat\u0131rla (1,m) \u00e7arparak (n,m) matris elde edin. \u00c7arp\u0131m tablolar\u0131, kernel matrisleri veya dikkat skorlar\u0131 b\u00f6yle olu\u015fturulur.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># === Z-Skoru Normalizasyonu ===</span>\ndata = np.random.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">4</span>) * [<span class="num">10</span>, <span class="num">1</span>, <span class="num">0.1</span>, <span class="num">50</span>] + [<span class="num">5</span>, <span class="num">0</span>, <span class="num">3</span>, <span class="num">100</span>]\n\nmean = data.<span class="fn">mean</span>(axis=<span class="num">0</span>)   <span class="cm"># \u015fekil (4,) \u2014 s\u00fctun ba\u015f\u0131na bir ortalama</span>\nstd  = data.<span class="fn">std</span>(axis=<span class="num">0</span>)    <span class="cm"># \u015fekil (4,) \u2014 s\u00fctun ba\u015f\u0131na bir std</span>\nnormalized = (data - mean) / std  <span class="cm"># (100,4) - (4,) / (4,) \u2192 broadcast!</span>\n\n<span class="cm"># === Mesafe Matrisi (ikili \u00d6klid) ===</span>\npoints = np.random.<span class="fn">randn</span>(<span class="num">5</span>, <span class="num">3</span>)  <span class="cm"># 3B\'de 5 nokta</span>\ndiff = points[:, np.newaxis, :] - points[np.newaxis, :, :]\ndist_matrix = np.<span class="fn">sqrt</span>((diff ** <span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">2</span>))  <span class="cm"># (5, 5)</span>\n\n<span class="cm"># === D\u0131\u015f \u00c7arp\u0131m ===</span>\na = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])\nb = np.<span class="fn">array</span>([<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>])\nouter = a[:, np.newaxis] * b[np.newaxis, :]  <span class="cm"># (3,1)*(1,4) \u2192 (3,4)</span>\n<span class="fn">print</span>(outer)\n<span class="cm"># [[ 10  20  30  40]</span>\n<span class="cm">#  [ 20  40  60  80]</span>\n<span class="cm">#  [ 30  60  90 120]]</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> Z-skoru normalizasyonu tam olarak sklearn\u2019in <code>StandardScaler</code>\u2019\u0131n\u0131n yapt\u0131\u011f\u0131 \u015feydir. Mesafe matrisleri KNN, kernel y\u00f6ntemleri ve t-SNE\u2019yi g\u00fc\u00e7lendirir. D\u0131\u015f \u00e7arp\u0131mlar dikkat mekanizmalar\u0131nda kar\u015f\u0131m\u0131za \u00e7\u0131kar: transformer\u2019larda query \u00d7 key\u1d40 esasen toplu d\u0131\u015f \u00e7arp\u0131md\u0131r.</div>'

/* --- Plotly: Normalizasyon \u00d6nce/Sonra (TR) --- */
+ '<div id="plot-norm-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var x1=[12,15,8,20,5,18,11,14,9,22];'
+ 'var x2=[0.5,0.7,0.3,0.9,0.2,0.8,0.4,0.6,0.35,0.95];'
+ 'var m1=13.4,s1=5.23,m2=0.57,s2=0.247;'
+ 'var n1=x1.map(function(v){return (v-m1)/s1;});'
+ 'var n2=x2.map(function(v){return (v-m2)/s2;});'
+ 'var t1={y:x1,name:"Feature 1 (ham)",type:"box",marker:{color:"#c8a96e"},boxpoints:"all"};'
+ 'var t2={y:x2,name:"Feature 2 (ham)",type:"box",marker:{color:"#4ecdc4"},boxpoints:"all"};'
+ 'var t3={y:n1,name:"Feature 1 (norm)",type:"box",marker:{color:"#f87171"},boxpoints:"all"};'
+ 'var t4={y:n2,name:"Feature 2 (norm)",type:"box",marker:{color:"#a78bfa"},boxpoints:"all"};'
+ 'var layout={title:{text:"Z-Skoru Normalizasyonu: \u00d6nce vs Sonra",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:50,r:20,b:40,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-norm-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6steriyor:</strong> Normalizasyon \u00f6ncesinde Feature 1 (aral\u0131k 5\u201322) ve Feature 2 (aral\u0131k 0.2\u20130.95) tamamen farkl\u0131 \u00f6l\u00e7eklerdedir. Z-skoru normalizasyonundan sonra ikisi de 0 etraf\u0131nda merkezlenir ve standart sapma 1 olur, ML algoritmalar\u0131 i\u00e7in kar\u015f\u0131la\u015ft\u0131r\u0131labilir hale gelir.</div></div>'

/* ============================================================
   B\u00d6L\u00dcM 4: Toplama Fonksiyonlar\u0131
   ============================================================ */
+ '<h2 class="l-title">4. Toplama Fonksiyonlar\u0131 (Aggregation)</h2>'

+ '<p class="l-text"><strong>Toplama</strong>, bir diziyi (veya bir boyutunu) tek bir \u00f6zet de\u011fere indirir. <code>axis</code> parametresi <em>hangi boyutun daralt\u0131laca\u011f\u0131n\u0131</em> kontrol eder:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">np.sum</div><div class="card-body">Elemanlar\u0131n toplam\u0131. axis=0 her s\u00fctunu toplar, axis=1 her sat\u0131r\u0131 toplar, None her \u015feyi toplar.</div></div>'
+ '<div class="calc-card"><div class="card-title">np.mean</div><div class="card-body">Aritmetik ortalama. \u0130statistik, normalizasyon ve kay\u0131p hesaplamas\u0131 i\u00e7in temel.</div></div>'
+ '<div class="calc-card"><div class="card-title">np.std / np.var</div><div class="card-body">Standart sapma ve varyans. Veri da\u011f\u0131l\u0131m\u0131n\u0131 \u00f6l\u00e7er.</div></div>'
+ '<div class="calc-card"><div class="card-title">min/max/argmin/argmax</div><div class="card-body">U\u00e7 de\u011ferler ve konumlar\u0131. argmax, maksimum de\u011ferin indeksini d\u00f6nd\u00fcr\u00fcr.</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>axis\u2019\u0131 anlamak:</strong> <code>axis=N</code>\u2019i \u201cboyut N\u2019i daralt\u201d olarak d\u00fc\u015f\u00fcn\u00fcn. (sat\u0131r, s\u00fctun) \u015feklinde bir 2B dizi i\u00e7in: <code>axis=0</code> sat\u0131rlar\u0131 daralt\u0131r (sonu\u00e7: s\u00fctun ba\u015f\u0131na bir de\u011fer), <code>axis=1</code> s\u00fctunlar\u0131 daralt\u0131r (sonu\u00e7: sat\u0131r ba\u015f\u0131na bir de\u011fer), <code>axis=None</code> her \u015feyi tek bir say\u0131ya daralt\u0131r.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nM = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>],\n              [<span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>],\n              [<span class="num">7</span>, <span class="num">8</span>, <span class="num">9</span>]])\n\n<span class="cm"># Toplam</span>\n<span class="fn">print</span>(np.<span class="fn">sum</span>(M))            <span class="cm"># 45       (t\u00fcm elemanlar)</span>\n<span class="fn">print</span>(np.<span class="fn">sum</span>(M, axis=<span class="num">0</span>))    <span class="cm"># [12 15 18]  (s\u00fctun toplamlar\u0131)</span>\n<span class="fn">print</span>(np.<span class="fn">sum</span>(M, axis=<span class="num">1</span>))    <span class="cm"># [ 6 15 24]  (sat\u0131r toplamlar\u0131)</span>\n\n<span class="cm"># Ortalama ve Std</span>\n<span class="fn">print</span>(np.<span class="fn">mean</span>(M, axis=<span class="num">0</span>))   <span class="cm"># [4. 5. 6.]  (s\u00fctun ortalamalar\u0131)</span>\n<span class="fn">print</span>(np.<span class="fn">std</span>(M, axis=<span class="num">1</span>))    <span class="cm"># [0.816 0.816 0.816] (sat\u0131r std)</span>\n\n<span class="cm"># Min, Max, Argmin, Argmax</span>\n<span class="fn">print</span>(np.<span class="fn">min</span>(M))            <span class="cm"># 1</span>\n<span class="fn">print</span>(np.<span class="fn">max</span>(M, axis=<span class="num">0</span>))    <span class="cm"># [7 8 9]  (s\u00fctun maksimumlar\u0131)</span>\n<span class="fn">print</span>(np.<span class="fn">argmax</span>(M, axis=<span class="num">1</span>)) <span class="cm"># [2 2 2]  (sat\u0131rda maks indeksi)</span>\n\n<span class="cm"># K\u00fcm\u00fclatif i\u015flemler</span>\n<span class="fn">print</span>(np.<span class="fn">cumsum</span>(M, axis=<span class="num">1</span>)) <span class="cm"># [[ 1  3  6]</span>\n                             <span class="cm">#  [ 4  9 15]</span>\n                             <span class="cm">#  [ 7 15 24]]</span>\n<span class="fn">print</span>(np.<span class="fn">cumprod</span>(M, axis=<span class="num">0</span>))<span class="cm"># [[  1   2   3]</span>\n                             <span class="cm">#  [  4  10  18]</span>\n                             <span class="cm">#  [ 28  80 162]]</span></code></pre></div>'

/* --- Plotly: Eksen Toplama Diyagram\u0131 (TR) --- */
+ '<div id="plot-axis-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var z=[[1,2,3],[4,5,6],[7,8,9]];'
+ 'var t1={z:z,type:"heatmap",colorscale:[[0,"#1a1a2e"],[1,"#c8a96e"]],showscale:false,text:[["1","2","3"],["4","5","6"],["7","8","9"]],texttemplate:"%{text}",textfont:{color:"#fff",size:16},x:["S\u00fct 0","S\u00fct 1","S\u00fct 2"],y:["Sat 0","Sat 1","Sat 2"],hoverinfo:"skip"};'
+ 'var ann=[];'
+ 'ann.push({x:-0.7,y:0,text:"\u2192 top=6",showarrow:false,font:{color:"#4ecdc4",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:-0.7,y:1,text:"\u2192 top=15",showarrow:false,font:{color:"#4ecdc4",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:-0.7,y:2,text:"\u2192 top=24",showarrow:false,font:{color:"#4ecdc4",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:0,y:-0.6,text:"\u2193 12",showarrow:false,font:{color:"#f87171",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:1,y:-0.6,text:"\u2193 15",showarrow:false,font:{color:"#f87171",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:2,y:-0.6,text:"\u2193 18",showarrow:false,font:{color:"#f87171",size:12,family:"monospace"},xref:"x",yref:"y"});'
+ 'ann.push({x:2.8,y:2.7,text:"axis=1 \u2192",showarrow:false,font:{color:"#4ecdc4",size:11}});'
+ 'ann.push({x:0,y:-1.0,text:"\u2191 axis=0",showarrow:false,font:{color:"#f87171",size:11}});'
+ 'var layout={title:{text:"np.sum() ile axis Parametresi",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{side:"top",gridcolor:"rgba(255,255,255,0.06)"},yaxis:{autorange:"reversed",gridcolor:"rgba(255,255,255,0.06)"},annotations:ann,margin:{t:70,r:40,b:60,l:80}};'
+ 'Plotly.newPlot("plot-axis-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6steriyor:</strong> 1\u20139 de\u011ferlerini i\u00e7eren 3\u00d73 matris. A\u015fa\u011f\u0131daki k\u0131rm\u0131z\u0131 say\u0131lar <code>axis=0</code> toplamlar\u0131n\u0131 (sat\u0131rlar\u0131 daralt, s\u00fctun toplamlar\u0131 al) g\u00f6sterir. Sa\u011fdaki turkuaz say\u0131lar <code>axis=1</code> toplamlar\u0131n\u0131 (s\u00fctunlar\u0131 daralt, sat\u0131r toplamlar\u0131 al) g\u00f6sterir.</div></div>'

+ '<div class="calc-example"><div class="example-label">PRAT\u0130K \u00d6RNEK</div><div class="example-body"><strong>ML\u2019de tahmin edilen s\u0131n\u0131f\u0131 bulmak:</strong><br><br><code>logits = model.predict(X)  # \u015fekil (batch, num_classes)</code><br><code>predictions = np.argmax(logits, axis=1)  # \u015fekil (batch,)</code><br><br><code>argmax(axis=1)</code> her \u00f6rnek i\u00e7in en y\u00fcksek olas\u0131l\u0131kl\u0131 s\u0131n\u0131f indeksini bulur. Her s\u0131n\u0131fland\u0131r\u0131c\u0131 nihai tahminlerini b\u00f6yle \u00fcretir.</div></div>'

/* ============================================================
   B\u00d6L\u00dcM 5: Evrensel Fonksiyonlar (Ufunc)
   ============================================================ */
+ '<h2 class="l-title">5. Evrensel Fonksiyonlar (Ufunc\u2019ler)</h2>'

+ '<p class="l-text">Ufunc\u2019ler NumPy\u2019nin h\u0131z\u0131n\u0131n motorudur. NumPy\u2019deki her matematik fonksiyonu bir ufunc\u2019tir: dizileri girdi olarak al\u0131r, derlenmi\u015f C\u2019de eleman baz\u0131nda \u00e7al\u0131\u015f\u0131r ve diziler d\u00f6nd\u00fcr\u00fcr. \u0130\u015fte tam ara\u00e7 seti:</p>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">TR\u0130GONOMETR\u0130K</div>'
+ '<div class="compare-item"><strong>np.sin(x)</strong> \u2014 sin\u00fcs</div>'
+ '<div class="compare-item"><strong>np.cos(x)</strong> \u2014 kosin\u00fcs</div>'
+ '<div class="compare-item"><strong>np.tan(x)</strong> \u2014 tanjant</div>'
+ '<div class="compare-item"><strong>np.arcsin(x)</strong> \u2014 ters sin\u00fcs</div>'
+ '<div class="compare-item"><strong>np.arctan2(y,x)</strong> \u2014 koordinatlardan a\u00e7\u0131</div></div>'
+ '<div class="compare-col"><div class="compare-title">\u00dcSTEL / LOGAR\u0130TMA</div>'
+ '<div class="compare-item"><strong>np.exp(x)</strong> \u2014 e\u02e3</div>'
+ '<div class="compare-item"><strong>np.log(x)</strong> \u2014 do\u011fal logaritma (ln)</div>'
+ '<div class="compare-item"><strong>np.log2(x)</strong> \u2014 taban-2 log</div>'
+ '<div class="compare-item"><strong>np.log10(x)</strong> \u2014 taban-10 log</div>'
+ '<div class="compare-item"><strong>np.expm1(x)</strong> \u2014 e\u02e3 - 1 (k\u00fc\u00e7\u00fck x i\u00e7in hassas)</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">YUVARLAMA / KIRPMA</div>'
+ '<div class="compare-item"><strong>np.round(x, n)</strong> \u2014 n ondal\u0131\u011fa yuvarla</div>'
+ '<div class="compare-item"><strong>np.floor(x)</strong> \u2014 a\u015fa\u011f\u0131 yuvarla</div>'
+ '<div class="compare-item"><strong>np.ceil(x)</strong> \u2014 yukar\u0131 yuvarla</div>'
+ '<div class="compare-item"><strong>np.clip(x, lo, hi)</strong> \u2014 [lo, hi] aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r</div>'
+ '<div class="compare-item"><strong>np.abs(x)</strong> \u2014 mutlak de\u011fer</div></div>'
+ '<div class="compare-col"><div class="compare-title">\u00d6ZEL / ML</div>'
+ '<div class="compare-item"><strong>np.sign(x)</strong> \u2014 -1, 0 veya +1</div>'
+ '<div class="compare-item"><strong>np.maximum(a,b)</strong> \u2014 eleman baz\u0131nda maks (ReLU!)</div>'
+ '<div class="compare-item"><strong>np.where(cond,a,b)</strong> \u2014 ko\u015fullu se\u00e7im</div>'
+ '<div class="compare-item"><strong>np.isnan(x)</strong> \u2014 NaN tespit et</div>'
+ '<div class="compare-item"><strong>np.isinf(x)</strong> \u2014 sonsuzluk tespit et</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Trig fonksiyonlar\u0131</span>\nangles = np.<span class="fn">array</span>([<span class="num">0</span>, np.pi/<span class="num">6</span>, np.pi/<span class="num">4</span>, np.pi/<span class="num">3</span>, np.pi/<span class="num">2</span>])\n<span class="fn">print</span>(np.<span class="fn">sin</span>(angles))    <span class="cm"># [0.   0.5  0.707 0.866 1.  ]</span>\n\n<span class="cm"># Clip: de\u011ferleri bir aral\u0131\u011fa s\u0131n\u0131rla (gradyan k\u0131rpma!)</span>\ngradients = np.<span class="fn">array</span>([-<span class="num">5.2</span>, <span class="num">0.3</span>, <span class="num">1.1</span>, <span class="num">8.7</span>, -<span class="num">0.1</span>])\nclipped = np.<span class="fn">clip</span>(gradients, -<span class="num">1</span>, <span class="num">1</span>)\n<span class="fn">print</span>(clipped)  <span class="cm"># [-1.   0.3  1.   1.  -0.1]</span>\n\n<span class="cm"># ReLU aktivasyon fonksiyonu = np.maximum(0, x)</span>\nx = np.<span class="fn">array</span>([-<span class="num">2</span>, -<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>])\nrelu = np.<span class="fn">maximum</span>(<span class="num">0</span>, x)\n<span class="fn">print</span>(relu)     <span class="cm"># [0 0 0 1 2]</span>\n\n<span class="cm"># Softmax (stabil versiyon)</span>\nlogits = np.<span class="fn">array</span>([<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.1</span>])\nexp_logits = np.<span class="fn">exp</span>(logits - np.<span class="fn">max</span>(logits))\nsoftmax = exp_logits / np.<span class="fn">sum</span>(exp_logits)\n<span class="fn">print</span>(softmax)  <span class="cm"># [0.659 0.243 0.099]  toplam\u0131 1.0</span>\n\n<span class="cm"># np.vectorize: Python fonksiyonunu ufunc olarak sar</span>\n<span class="kw">def</span> <span class="fn">custom_activation</span>(x):\n    <span class="kw">return</span> x <span class="kw">if</span> x > <span class="num">0</span> <span class="kw">else</span> <span class="num">0.01</span> * x  <span class="cm"># leaky ReLU</span>\n\nvectorized_fn = np.<span class="fn">vectorize</span>(custom_activation)\n<span class="fn">print</span>(vectorized_fn(np.<span class="fn">array</span>([-<span class="num">3</span>, -<span class="num">1</span>, <span class="num">0</span>, <span class="num">2</span>, <span class="num">5</span>])))\n<span class="cm"># [-0.03 -0.01  0.    2.    5.  ]</span></code></pre></div>'

+ '<div class="l-note"><strong>np.vectorize hakk\u0131nda uyar\u0131:</strong> \u0130smine ra\u011fmen, <code>np.vectorize</code> ger\u00e7ek anlamda vekt\u00f6rize DE\u011e\u0130LD\u0130R \u2014 i\u00e7eride hala Python d\u00f6ng\u00fcs\u00fc kullanan bir kolayl\u0131k sar\u0131c\u0131s\u0131d\u0131r. Karma\u015f\u0131k dallanma mant\u0131\u011f\u0131 uygulamak i\u00e7in kullan\u0131\u015fl\u0131d\u0131r, ancak d\u00f6ng\u00fcye g\u00f6re h\u0131z avantaj\u0131 sa\u011flamaz. Performans i\u00e7in yerel ufunc\u2019ler veya boolean indeksleme kullan\u0131n.</div>'

/* ============================================================
   B\u00d6L\u00dcM 6: Performans Optimizasyonu
   ============================================================ */
+ '<h2 class="l-title">6. Performans Optimizasyonu</h2>'

+ '<p class="l-text">H\u0131zl\u0131 NumPy kodu yazmak, <strong>hesaplamay\u0131 C i\u00e7inde tutmak</strong> ve <strong>Python ek y\u00fck\u00fcn\u00fc en aza indirmekle</strong> ilgilidir. Temel stratejiler:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Python D\u00f6ng\u00fclerini Ortadan Kald\u0131r\u0131n</div><div class="step-detail"><code>for i in range(n)</code> yerine vekt\u00f6rize i\u015flemler, broadcasting veya fancy indeksleme kullan\u0131n. Her d\u00f6ng\u00fc iterasyonunda ~100ns Python yorumlay\u0131c\u0131 ek y\u00fck\u00fc vard\u0131r ve milyonlarca elemanda \u00e7arp\u0131l\u0131r.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Yerinde \u0130\u015flemler Kullan\u0131n</div><div class="step-detail"><code>a += b</code>, yeni dizi ay\u0131rmak yerine <code>a</code>\u2019y\u0131 do\u011frudan de\u011fi\u015ftirir. B\u00fcy\u00fck dizilerde bu, bellek ay\u0131rma s\u00fcresinden \u00f6nemli \u00f6l\u00e7\u00fcde tasarruf sa\u011flar. Ayr\u0131ca: <code>np.add(a, b, out=a)</code>.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Bellek Yerle\u015fimi (C vs F s\u0131ras\u0131)</div><div class="step-detail">NumPy dizileri varsay\u0131lan olarak <strong>sat\u0131r-\u00f6ncelikli (C)</strong> s\u0131rada saklar. Son eksen (s\u00fctunlar) boyunca yineleme en h\u0131zl\u0131d\u0131r \u00e7\u00fcnk\u00fc veriler bellekte ard\u0131\u015f\u0131kt\u0131r.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Karma\u015f\u0131k \u0130\u015flemler i\u00e7in np.einsum</div><div class="step-detail">Einstein toplama g\u00f6sterimi, nokta \u00e7arp\u0131mlar\u0131, d\u0131\u015f \u00e7arp\u0131mlar, izler, devrikler ve daraltmalar\u0131 tek optimize edilmi\u015f \u00e7a\u011fr\u0131da ifade edebilir.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">import</span> time\n\nn = <span class="num">1_000_000</span>\na = np.random.<span class="fn">randn</span>(n)\nb = np.random.<span class="fn">randn</span>(n)\n\n<span class="cm"># K\u00d6T\u00dc: Python d\u00f6ng\u00fcs\u00fc</span>\nt0 = time.<span class="fn">time</span>()\nresult_loop = np.<span class="fn">empty</span>(n)\n<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):\n    result_loop[i] = a[i] * b[i] + a[i]**<span class="num">2</span>\nloop_time = time.<span class="fn">time</span>() - t0\n\n<span class="cm"># \u0130Y\u0130: Vekt\u00f6rize</span>\nt0 = time.<span class="fn">time</span>()\nresult_vec = a * b + a**<span class="num">2</span>\nvec_time = time.<span class="fn">time</span>() - t0\n\n<span class="fn">print</span>(<span class="str">f"D\u00f6ng\u00fc: {loop_time:.3f}s"</span>)       <span class="cm"># ~0.5s</span>\n<span class="fn">print</span>(<span class="str">f"Vekt\u00f6rize: {vec_time:.4f}s"</span>)   <span class="cm"># ~0.004s</span>\n<span class="fn">print</span>(<span class="str">f"H\u0131zlanma: {loop_time/vec_time:.0f}x"</span>)  <span class="cm"># ~125x</span></code></pre></div>'

+ '<p class="l-text"><strong>np.einsum</strong>, karma\u015f\u0131k dizi i\u015flemlerini Einstein toplama g\u00f6sterimi kullanarak ifade eden g\u00fc\u00e7l\u00fc bir ara\u00e7t\u0131r. Devrik, nokta \u00e7arp\u0131m, toplam ve \u00e7arpman\u0131n birka\u00e7 birle\u015fiminin yerini alabilir:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nA = np.random.<span class="fn">randn</span>(<span class="num">3</span>, <span class="num">4</span>)\nB = np.random.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">5</span>)\nv = np.random.<span class="fn">randn</span>(<span class="num">4</span>)\n\n<span class="cm"># Matris \u00e7arp\u0131m\u0131:  C_ij = sum_k A_ik * B_kj</span>\nC = np.<span class="fn">einsum</span>(<span class="str">\'ik,kj->ij\'</span>, A, B)        <span class="cm"># A @ B ile ayn\u0131</span>\n\n<span class="cm"># Nokta \u00e7arp\u0131m:  s = sum_i a_i * b_i</span>\ns = np.<span class="fn">einsum</span>(<span class="str">\'i,i->\'</span>, v, v)              <span class="cm"># np.dot(v, v) ile ayn\u0131</span>\n\n<span class="cm"># \u0130z (k\u00f6\u015fegen toplam\u0131):  t = sum_i A_ii</span>\nM = np.random.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">4</span>)\nt = np.<span class="fn">einsum</span>(<span class="str">\'ii->\'</span>, M)                  <span class="cm"># np.trace(M) ile ayn\u0131</span>\n\n<span class="cm"># D\u0131\u015f \u00e7arp\u0131m:  O_ij = a_i * b_j</span>\na = np.<span class="fn">array</span>([<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>])\nb = np.<span class="fn">array</span>([<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>,<span class="num">7</span>])\nO = np.<span class="fn">einsum</span>(<span class="str">\'i,j->ij\'</span>, a, b)            <span class="cm"># np.outer(a, b) ile ayn\u0131</span>\n\n<span class="cm"># Toplu matris \u00e7arp\u0131m\u0131 (derin \u00f6\u011frenmede kullan\u0131\u015fl\u0131)</span>\nbatch_A = np.random.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">3</span>, <span class="num">4</span>)\nbatch_B = np.random.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">4</span>, <span class="num">5</span>)\nbatch_C = np.<span class="fn">einsum</span>(<span class="str">\'nik,nkj->nij\'</span>, batch_A, batch_B)</code></pre></div>'

+ '<div class="calc-highlight"><strong>Numba ne zaman kullan\u0131l\u0131r:</strong> Ger\u00e7ekten bir Python d\u00f6ng\u00fcs\u00fcne ihtiyac\u0131n\u0131z oldu\u011funda (her iterasyonun \u00f6ncekine ba\u011fl\u0131 oldu\u011fu s\u0131ral\u0131 ba\u011f\u0131ml\u0131l\u0131klar gibi), <code>@numba.jit(nopython=True)</code> d\u00f6ng\u00fcy\u00fc makine koduna derler. Python s\u00f6zdizimini koruyarak C seviyesinde h\u0131z verir.</div>'

+ '<div class="calc-example"><div class="example-label">OPT\u0130M\u0130ZASYON KONTROL L\u0130STES\u0130</div><div class="example-body"><strong>NumPy kodu yazmadan \u00f6nce kendinize sorun:</strong><br><br>1. Bu i\u015flemi <strong>d\u00f6ng\u00fc olmadan</strong> ifade edebilir miyim? (vekt\u00f6rize, broadcast, fancy indeks)<br>2. <strong>Gereksiz ge\u00e7ici diziler</strong> olu\u015fturuyor muyum? (yerinde i\u015flemler veya einsum kullan)<br>3. <strong>Do\u011fru eksen</strong> boyunca m\u0131 yineliyorum? (C-s\u0131ral\u0131 dizilerde son eksen en h\u0131zl\u0131d\u0131r)<br>4. <strong>einsum</strong> devrik/nokta \u00e7arp\u0131m/toplam zincirimin yerini alabilir mi?<br>5. Bunu zaten yapan yerle\u015fik bir NumPy fonksiyonu var m\u0131? (dok\u00fcmantasyonu kontrol edin!)</div></div>'

+ '<div class="l-warn"><strong>Sonraki Ders:</strong> Ders 4\u2019te <strong>Dizi Manip\u00fclasyonu</strong>\u2019nu ele al\u0131yoruz \u2014 yeniden boyutland\u0131rma, y\u0131\u011fma, b\u00f6lme, s\u0131ralama ve her veri i\u015fleme g\u00f6revi i\u00e7in dizileri yeniden yap\u0131land\u0131rman\u0131z\u0131 sa\u011flayan geli\u015fmi\u015f indeksleme teknikleri.</div>'

};