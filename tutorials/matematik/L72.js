window.LISE_MAT_L72 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A matrix is a rectangle of numbers.</strong> That is the entire definition, and you can stop reading right there if you want — every algebraic rule about matrices in the next 30 pages flows from that one sentence. What gives matrices their power is not the rectangle itself but what you can <em>do</em> with one: add it to another, multiply it by a number, multiply it by a different matrix to glue two transformations together, flip it across a diagonal. Each of these operations has a precise rule, and learning those rules is the entire content of this lesson.</p>

<p class="l-text">By the end you will know what an <em>m&times;n</em> matrix looks like, how to refer to its entries, which special types have names you should memorise, and how to add, subtract, scalar-multiply, multiply, and transpose them. We stay strictly at high-school level: no determinants yet, no inverses, no row-reduction. Just the grammar of matrices as objects you can manipulate. Later lessons turn this grammar into a language for solving systems of equations and describing geometric transformations.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define an <em>m&times;n</em> matrix and refer to any entry as <em>a<sub>ij</sub></em> with i = row, j = column</li>
<li>Recognise the special types: row vector, column vector, square, zero, identity, diagonal, symmetric</li>
<li>Add and subtract two matrices entry by entry (only when they have the same size)</li>
<li>Multiply a matrix by a scalar (every entry scales)</li>
<li>Multiply two matrices using the row-dot-column rule, after checking the dimensions match</li>
<li>Transpose a matrix and use the rule <em>(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup></em></li>
<li>Spot the three most common student mistakes before they cost you points</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Matrix?</h2>

<div class="calc-highlight"><strong>Definition.</strong> A <em>matrix</em> is a rectangular arrangement of numbers organised into rows (horizontal lines) and columns (vertical lines). If there are <em>m</em> rows and <em>n</em> columns, we call it an <strong>m&times;n matrix</strong> (read "m by n") and say its <strong>size</strong> (or order, or dimension) is <em>m&times;n</em>.</div>

<p class="l-text">Matrices are written between large brackets or parentheses. The choice is purely stylistic; this lesson uses parentheses. Here is a 2&times;3 matrix:</p>

<div class="calc-formula"><div class="formula-label">A 2&times;3 MATRIX</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} 1 & 4 & 7 \\\\ 2 & 5 & 8 \\end{pmatrix}$$</div><div class="formula-sub">Two rows, three columns. We say "A is a 2&times;3 matrix" or "A has size 2&times;3."</div></div>

<p class="l-text">Notice the order: <strong>rows first, columns second</strong>. A 5&times;2 matrix has 5 rows and 2 columns, which makes it tall and narrow. A 2&times;5 matrix has 2 rows and 5 columns, which makes it short and wide. Confusing the order is the single most common error students make in their first week with matrices.</p>

<div class="calc-formula"><div class="formula-label">INDEX NOTATION</div><div class="formula-main">$$A \\;=\\; [a_{ij}] \\qquad\\text{where } i = 1, 2, \\ldots, m \\;\\;\\text{and}\\;\\; j = 1, 2, \\ldots, n$$</div><div class="formula-sub">The entry <em>a<sub>ij</sub></em> sits in row <em>i</em> and column <em>j</em>. Row index always comes first.</div></div>

<p class="l-text">For the 2&times;3 matrix above, we have <em>a</em><sub>11</sub> = 1, <em>a</em><sub>12</sub> = 4, <em>a</em><sub>13</sub> = 7, <em>a</em><sub>21</sub> = 2, <em>a</em><sub>22</sub> = 5, <em>a</em><sub>23</sub> = 8. Read each index aloud: "a-one-one is one, a-one-two is four, ..." It feels slow at first; in a week it will be automatic.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Row index <em>i</em></div><div class="card-body">Counts rows from top to bottom. The top row is row 1. Always the first subscript.</div></div>
<div class="calc-card"><div class="card-title">Column index <em>j</em></div><div class="card-body">Counts columns from left to right. The leftmost column is column 1. Always the second subscript.</div></div>
<div class="calc-card"><div class="card-title">Entry <em>a<sub>ij</sub></em></div><div class="card-body">The single number sitting at the intersection of row <em>i</em> and column <em>j</em>. Also called the (<em>i</em>, <em>j</em>)-entry.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">In the matrix above, what is <em>a</em><sub>22</sub>? (Answer: 5 — row 2, column 2.) What is <em>a</em><sub>13</sub>? (Answer: 7 — row 1, column 3.) Why does <em>a</em><sub>32</sub> not exist? (Because this matrix only has 2 rows; there is no row 3.)</div></div>

<h2 class="lesson-title">2. Visualising a Matrix as a Coloured Grid</h2>

<p class="l-text">A nice way to see matrices is as a coloured grid where the colour of each cell encodes its number. Bright colours mean large entries, dim colours mean small entries. This visual representation is the same one used in neural networks, in medical images (an MRI slice is a matrix), and in spreadsheets when you "conditional format" the cells.</p>

<div class="calc-graph"><div id="plot-l72-grid-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a 4&times;4 matrix displayed as a heatmap. Each cell shows its numeric value as text and its colour as a visual cue (brighter blue = larger number). Notice the (1,1) entry is in the top-left, exactly as written on paper. Hovering the mouse over any cell reveals the (row, column) index.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Z=[[1,4,7,2],[3,5,8,1],[6,2,9,4],[5,7,3,8]];
var xs=['col 1','col 2','col 3','col 4'];
var ys=['row 1','row 2','row 3','row 4'];
var annoEN=[];
for(var i=0;i<4;i++){for(var j=0;j<4;j++){annoEN.push({x:xs[j],y:ys[i],text:String(Z[i][j]),showarrow:false,font:{color:'#0a0a0a',size:18,family:'Geist'}});}}
var heatEN={z:Z,x:xs,y:ys,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.5,'#3b82f6'],[1,'#93c5fd']],showscale:true,hovertemplate:'%{y}, %{x}<br>value: %{z}<extra></extra>'};
var layoutEN={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{side:'top',showgrid:false,zeroline:false},yaxis:{autorange:'reversed',showgrid:false,zeroline:false},margin:{t:50,r:30,b:40,l:80},annotations:annoEN};
Plotly.newPlot('plot-l72-grid-en',[heatEN],layoutEN,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Special Types of Matrices</h2>

<div class="calc-highlight"><strong>Most matrices you meet in school have one of a few standard shapes.</strong> Knowing the names saves communication: when a problem says "let A be a 3&times;3 identity matrix", you should immediately picture exactly one matrix and start computing.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Row vector (1&times;n)</div><div class="card-body">Just one row, <em>n</em> columns. Example: $\\begin{pmatrix} 2 & 5 & 7 \\end{pmatrix}$ is a 1&times;3 row vector. Often used to store the coordinates of a point.</div></div>
<div class="calc-card"><div class="card-title">Column vector (n&times;1)</div><div class="card-body">One column, <em>n</em> rows. Example: $\\begin{pmatrix} 2 \\\\ 5 \\\\ 7 \\end{pmatrix}$ is a 3&times;1 column vector. Standard form for vectors in linear algebra.</div></div>
<div class="calc-card"><div class="card-title">Square matrix (n&times;n)</div><div class="card-body">Same number of rows and columns. Example: a 3&times;3 matrix is square. Only square matrices have determinants and inverses (you will learn this later).</div></div>
<div class="calc-card"><div class="card-title">Zero matrix (0)</div><div class="card-body">Every entry is 0. There is one zero matrix for each size. Acts like 0 in number arithmetic: A + 0 = A.</div></div>
<div class="calc-card"><div class="card-title">Identity I<sub>n</sub></div><div class="card-body">Square, with 1's on the main diagonal and 0's everywhere else. Acts like 1: AI = IA = A whenever the multiplication is defined.</div></div>
<div class="calc-card"><div class="card-title">Diagonal matrix</div><div class="card-body">Square, with non-zero entries only on the main diagonal. Example: $\\begin{pmatrix} 3 & 0 \\\\ 0 & 7 \\end{pmatrix}$. The identity is a special diagonal matrix.</div></div>
<div class="calc-card"><div class="card-title">Symmetric matrix</div><div class="card-body">Square, with <em>a<sub>ij</sub></em> = <em>a<sub>ji</sub></em> for every <em>i</em>, <em>j</em>. Looks the same after a reflection across the main diagonal. Example: $\\begin{pmatrix} 2 & 5 \\\\ 5 & 9 \\end{pmatrix}$.</div></div>
<div class="calc-card"><div class="card-title">Upper / lower triangular</div><div class="card-body">All entries below (upper) or above (lower) the main diagonal are 0. Comes up later in Gaussian elimination.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">THE 3&times;3 IDENTITY MATRIX</div><div class="formula-main">$$I_3 \\;=\\; \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$</div><div class="formula-sub">A diagonal of 1's, zeroes elsewhere. Every size has its own identity: I<sub>2</sub>, I<sub>3</sub>, I<sub>4</sub>, ...</div></div>

<div class="calc-graph"><div id="plot-l72-identity-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 5&times;5 identity matrix as a heatmap. The bright diagonal of 1's against the dark background of 0's is the visual signature of an identity matrix — once you have seen this picture, you will recognise it instantly in any context.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=5;var Zi=[];for(var i=0;i<n;i++){var row=[];for(var j=0;j<n;j++){row.push(i===j?1:0);}Zi.push(row);}
var xsi=['c1','c2','c3','c4','c5'];var ysi=['r1','r2','r3','r4','r5'];
var annoI=[];for(var i=0;i<n;i++){for(var j=0;j<n;j++){annoI.push({x:xsi[j],y:ysi[i],text:i===j?'1':'0',showarrow:false,font:{color:i===j?'#0a0a0a':'#e8e8e8',size:16,family:'Geist'}});}}
var heatI={z:Zi,x:xsi,y:ysi,type:'heatmap',colorscale:[[0,'#0a0a0a'],[1,'#3b82f6']],showscale:false,hovertemplate:'%{y}, %{x}<br>value: %{z}<extra></extra>'};
var layI={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{side:'top',showgrid:false,zeroline:false},yaxis:{autorange:'reversed',showgrid:false,zeroline:false},margin:{t:50,r:30,b:40,l:60},annotations:annoI};
Plotly.newPlot('plot-l72-identity-en',[heatI],layI,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Matrix Equality</h2>

<div class="calc-highlight"><strong>Two matrices are equal when (i) they have exactly the same size, and (ii) every corresponding entry is equal.</strong> Both conditions are required. A 2&times;3 matrix can never equal a 3&times;2 matrix, even if they happen to contain the same numbers.</div>

<div class="calc-formula"><div class="formula-label">EQUALITY OF MATRICES</div><div class="formula-main">$$A = B \\;\\iff\\; \\text{size}(A) = \\text{size}(B) \\;\\text{ and }\\; a_{ij} = b_{ij} \\;\\text{ for all } i, j$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find <em>x</em> and <em>y</em> if $\\begin{pmatrix} x & 4 \\\\ 7 & y \\end{pmatrix} = \\begin{pmatrix} 3 & 4 \\\\ 7 & -2 \\end{pmatrix}$.<br><br>By matrix equality, corresponding entries must match. From the (1,1) entry: <em>x</em> = 3. From the (2,2) entry: <em>y</em> = &minus;2.<br><br>Answer: <strong>x = 3, y = &minus;2</strong>.</div></div>

<h2 class="lesson-title">5. Addition and Subtraction</h2>

<div class="calc-highlight"><strong>Matrix addition is element-wise.</strong> Add corresponding entries one at a time. The result has the same size as the original two matrices. There is no shortcut and no special rule for special types — just line them up and add.</div>

<div class="calc-formula"><div class="formula-label">MATRIX ADDITION</div><div class="formula-main">$$(A + B)_{ij} \\;=\\; a_{ij} + b_{ij}$$</div><div class="formula-sub">Defined only when A and B have the same size. Subtraction works the same way: <em>(A &minus; B)<sub>ij</sub></em> = <em>a<sub>ij</sub></em> &minus; <em>b<sub>ij</sub></em>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ADDITION</div><div class="example-body">Compute $A + B$ where $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$.<br><br>Both are 2&times;2, so the sum is defined.<br>$$A + B \\;=\\; \\begin{pmatrix} 1+5 & 2+6 \\\\ 3+7 & 4+8 \\end{pmatrix} \\;=\\; \\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SUBTRACTION</div><div class="example-body">Compute $A - B$ for the matrices above.<br><br>$$A - B \\;=\\; \\begin{pmatrix} 1-5 & 2-6 \\\\ 3-7 & 4-8 \\end{pmatrix} \\;=\\; \\begin{pmatrix} -4 & -4 \\\\ -4 & -4 \\end{pmatrix}.$$</div></div>

<div class="l-note"><strong>What happens for mismatched sizes?</strong> If A is 2&times;3 and B is 3&times;2, then A + B is <em>undefined</em> — not zero, not "approximately the answer", simply meaningless. Matrix addition requires identical dimensions. Always check size before you compute.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Commutative</div><div class="card-body">$A + B = B + A$ — same as ordinary numbers, because each entry-wise sum is commutative.</div></div>
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">$(A + B) + C = A + (B + C)$ — you can regroup parentheses freely.</div></div>
<div class="calc-card"><div class="card-title">Zero identity</div><div class="card-body">$A + 0 = A$ where 0 is the zero matrix of the same size.</div></div>
</div>

<h2 class="lesson-title">6. Scalar Multiplication</h2>

<div class="calc-highlight"><strong>Multiplying a matrix by a scalar (an ordinary number) scales every entry by that number.</strong> A scalar is just a single real number — to keep it apart from a matrix we sometimes use lower-case Greek letters like <em>&alpha;</em>, <em>&beta;</em>, <em>&lambda;</em>.</div>

<div class="calc-formula"><div class="formula-label">SCALAR MULTIPLICATION</div><div class="formula-main">$$(kA)_{ij} \\;=\\; k \\cdot a_{ij}$$</div><div class="formula-sub">Every entry of A gets multiplied by <em>k</em>. The size of the matrix does not change.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">If $A = \\begin{pmatrix} 1 & -2 \\\\ 3 & 4 \\end{pmatrix}$, compute $3A$ and $-2A$.<br><br>$$3A \\;=\\; \\begin{pmatrix} 3 & -6 \\\\ 9 & 12 \\end{pmatrix}, \\qquad -2A \\;=\\; \\begin{pmatrix} -2 & 4 \\\\ -6 & -8 \\end{pmatrix}.$$<br>Notice that $-A$ (with $k = -1$) just flips every sign.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Distributive over matrix sum</div><div class="card-body">$k(A + B) = kA + kB$. Pull the scalar through brackets.</div></div>
<div class="calc-card"><div class="card-title">Distributive over scalar sum</div><div class="card-body">$(k + \\ell)A = kA + \\ell A$. Split a sum of scalars.</div></div>
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">$k(\\ell A) = (k\\ell)A$. Multiply the scalars first, or do them one at a time — same result.</div></div>
</div>

<h2 class="lesson-title">7. Matrix Multiplication</h2>

<div class="calc-highlight"><strong>This is the operation that makes matrices interesting.</strong> Unlike addition, matrix multiplication is <em>not</em> entry-wise. The (i, j) entry of the product AB is built from a whole row of A and a whole column of B. The rule looks strange at first, but the reason behind it (composition of linear transformations) appears in later lessons and makes it inevitable.</div>

<p class="l-text"><strong>The dimension rule comes first.</strong> The product <em>AB</em> is only defined when:</p>

<div class="calc-formula"><div class="formula-label">DIMENSION RULE FOR AB</div><div class="formula-main">$$\\text{(number of columns of A)} \\;=\\; \\text{(number of rows of B)}$$</div><div class="formula-sub">If A is m&times;n and B is n&times;p, then AB is defined and has size m&times;p. The two inner numbers must match; the outer two become the size of the result.</div></div>

<p class="l-text">Visualise it as $\\boxed{m \\times \\underline{n}}_{A}\\;\\cdot\\;\\boxed{\\underline{n} \\times p}_{B} \\;=\\; m \\times p$. The underlined n's cancel; what remains on the outside is the size of the product.</p>

<div class="calc-formula"><div class="formula-label">ENTRIES OF AB</div><div class="formula-main">$$(AB)_{ij} \\;=\\; \\sum_{k=1}^{n} a_{ik} \\, b_{kj} \\;=\\; a_{i1}b_{1j} + a_{i2}b_{2j} + \\cdots + a_{in}b_{nj}$$</div><div class="formula-sub">The (i, j) entry of AB is the dot product of row i of A with column j of B.</div></div>

<p class="l-text">In words: to find the entry at row <em>i</em>, column <em>j</em> of the product, walk across row <em>i</em> of A and down column <em>j</em> of B, multiply the matched pairs, and add them up. Repeat for every (i, j) entry.</p>

<div class="calc-graph"><div id="plot-l72-product-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a 2&times;3 matrix A multiplied by a 3&times;2 matrix B, yielding a 2&times;2 product AB. Each cell of the product is highlighted in the result on the right. Notice how the inner dimension (3) is "summed away" while the outer dimensions (2 and 2) survive into the answer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var A=[[1,2,3],[4,5,6]];
var B=[[7,8],[9,10],[11,12]];
var C=[[0,0],[0,0]];
for(var i=0;i<2;i++){for(var j=0;j<2;j++){for(var k=0;k<3;k++){C[i][j]+=A[i][k]*B[k][j];}}}
var traceA={z:A,x:['a·1','a·2','a·3'],y:['A r1','A r2'],type:'heatmap',xaxis:'x1',yaxis:'y1',colorscale:[[0,'#0a0a0a'],[1,'#3b82f6']],showscale:false};
var traceB={z:B,x:['b·1','b·2'],y:['B r1','B r2','B r3'],type:'heatmap',xaxis:'x2',yaxis:'y2',colorscale:[[0,'#0a0a0a'],[1,'#1d4ed8']],showscale:false};
var traceC={z:C,x:['c·1','c·2'],y:['AB r1','AB r2'],type:'heatmap',xaxis:'x3',yaxis:'y3',colorscale:[[0,'#0a0a0a'],[1,'#60a5fa']],showscale:false};
var annoP=[];
for(var i=0;i<2;i++){for(var j=0;j<3;j++){annoP.push({x:['a·1','a·2','a·3'][j],y:['A r1','A r2'][i],text:String(A[i][j]),showarrow:false,xref:'x1',yref:'y1',font:{color:'#0a0a0a',size:16,family:'Geist'}});}}
for(var i=0;i<3;i++){for(var j=0;j<2;j++){annoP.push({x:['b·1','b·2'][j],y:['B r1','B r2','B r3'][i],text:String(B[i][j]),showarrow:false,xref:'x2',yref:'y2',font:{color:'#0a0a0a',size:16,family:'Geist'}});}}
for(var i=0;i<2;i++){for(var j=0;j<2;j++){annoP.push({x:['c·1','c·2'][j],y:['AB r1','AB r2'][i],text:String(C[i][j]),showarrow:false,xref:'x3',yref:'y3',font:{color:'#0a0a0a',size:18,family:'Geist'}});}}
annoP.push({x:0.18,y:1.06,xref:'paper',yref:'paper',text:'<b>A</b> (2×3)',showarrow:false,font:{color:'#3b82f6',size:14}});
annoP.push({x:0.5,y:1.06,xref:'paper',yref:'paper',text:'<b>B</b> (3×2)',showarrow:false,font:{color:'#3b82f6',size:14}});
annoP.push({x:0.85,y:1.06,xref:'paper',yref:'paper',text:'<b>AB</b> (2×2)',showarrow:false,font:{color:'#3b82f6',size:14}});
var layP={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{domain:[0,0.30],side:'top',showgrid:false,zeroline:false},yaxis:{domain:[0,0.95],autorange:'reversed',showgrid:false,zeroline:false},xaxis2:{domain:[0.35,0.62],side:'top',showgrid:false,zeroline:false,anchor:'y2'},yaxis2:{domain:[0,0.95],autorange:'reversed',showgrid:false,zeroline:false,anchor:'x2'},xaxis3:{domain:[0.70,0.97],side:'top',showgrid:false,zeroline:false,anchor:'y3'},yaxis3:{domain:[0,0.95],autorange:'reversed',showgrid:false,zeroline:false,anchor:'x3'},margin:{t:50,r:10,b:30,l:60},annotations:annoP};
Plotly.newPlot('plot-l72-product-en',[traceA,traceB,traceC],layP,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 2&times;2 PRODUCT</div><div class="example-body">Compute $AB$ where $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$.<br><br>A is 2&times;2 and B is 2&times;2. Inner dimensions match (2 = 2), so AB is defined and will be 2&times;2.<br><br>$(AB)_{11}$ = row 1 of A dotted with column 1 of B = $1 \\cdot 5 + 2 \\cdot 7 = 5 + 14 = 19$.<br>$(AB)_{12}$ = row 1 of A dotted with column 2 of B = $1 \\cdot 6 + 2 \\cdot 8 = 6 + 16 = 22$.<br>$(AB)_{21}$ = row 2 of A dotted with column 1 of B = $3 \\cdot 5 + 4 \\cdot 7 = 15 + 28 = 43$.<br>$(AB)_{22}$ = row 2 of A dotted with column 2 of B = $3 \\cdot 6 + 4 \\cdot 8 = 18 + 32 = 50$.<br><br>$$AB \\;=\\; \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — NON-COMMUTATIVITY</div><div class="example-body">With the same A and B, compute $BA$ and compare with $AB$.<br><br>$(BA)_{11} = 5 \\cdot 1 + 6 \\cdot 3 = 5 + 18 = 23$.<br>$(BA)_{12} = 5 \\cdot 2 + 6 \\cdot 4 = 10 + 24 = 34$.<br>$(BA)_{21} = 7 \\cdot 1 + 8 \\cdot 3 = 7 + 24 = 31$.<br>$(BA)_{22} = 7 \\cdot 2 + 8 \\cdot 4 = 14 + 32 = 46$.<br><br>$$BA \\;=\\; \\begin{pmatrix} 23 & 34 \\\\ 31 & 46 \\end{pmatrix} \\;\\;\\neq\\;\\; AB.$$<br><strong>Conclusion: $AB \\neq BA$ in general.</strong> Matrix multiplication is <em>not commutative</em>. This is the single most important way matrices differ from ordinary numbers.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — NON-SQUARE PRODUCT</div><div class="example-body">Compute $CD$ where $C = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$ (size 2&times;3) and $D = \\begin{pmatrix} 7 & 8 \\\\ 9 & 10 \\\\ 11 & 12 \\end{pmatrix}$ (size 3&times;2).<br><br>Inner dimensions: 3 = 3. ✓ Product will be 2&times;2.<br><br>$(CD)_{11} = 1 \\cdot 7 + 2 \\cdot 9 + 3 \\cdot 11 = 7 + 18 + 33 = 58$.<br>$(CD)_{12} = 1 \\cdot 8 + 2 \\cdot 10 + 3 \\cdot 12 = 8 + 20 + 36 = 64$.<br>$(CD)_{21} = 4 \\cdot 7 + 5 \\cdot 9 + 6 \\cdot 11 = 28 + 45 + 66 = 139$.<br>$(CD)_{22} = 4 \\cdot 8 + 5 \\cdot 10 + 6 \\cdot 12 = 32 + 50 + 72 = 154$.<br><br>$$CD \\;=\\; \\begin{pmatrix} 58 & 64 \\\\ 139 & 154 \\end{pmatrix}.$$<br>Notice that $DC$ (a 3&times;2 times a 2&times;3) is also defined, but would be 3&times;3 — a completely different size from CD. Matrix multiplication is fundamentally one-sided.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">$(AB)C = A(BC)$. You can regroup but not reorder. Useful when chaining many products.</div></div>
<div class="calc-card"><div class="card-title">Distributive</div><div class="card-body">$A(B + C) = AB + AC$ and $(B + C)A = BA + CA$. Multiplication distributes over addition.</div></div>
<div class="calc-card"><div class="card-title">Identity acts as 1</div><div class="card-body">$I_m A = A$ and $A I_n = A$ for any m&times;n matrix A. The identity matrix is the multiplicative neutral element.</div></div>
<div class="calc-card"><div class="card-title">Zero acts as 0</div><div class="card-body">$0 \\cdot A = A \\cdot 0 = 0$ (zero matrices of the correct sizes). Zero in, zero out.</div></div>
</div>

<h2 class="lesson-title">8. Transpose</h2>

<div class="calc-highlight"><strong>The transpose of a matrix is what you get by flipping it across its main diagonal.</strong> Rows become columns and columns become rows. A 2&times;3 matrix has a 3&times;2 transpose.</div>

<div class="calc-formula"><div class="formula-label">TRANSPOSE</div><div class="formula-main">$$(A^T)_{ij} \\;=\\; a_{ji}$$</div><div class="formula-sub">The row and column indices swap. If A is m&times;n then A<sup>T</sup> is n&times;m.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the transpose of $A = \\begin{pmatrix} 1 & 4 & 7 \\\\ 2 & 5 & 8 \\end{pmatrix}$.<br><br>A is 2&times;3, so A<sup>T</sup> is 3&times;2. Row 1 of A becomes column 1 of A<sup>T</sup>.<br><br>$$A^T \\;=\\; \\begin{pmatrix} 1 & 2 \\\\ 4 & 5 \\\\ 7 & 8 \\end{pmatrix}.$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$(A^T)^T = A$</div><div class="card-body">Flipping twice gets you back where you started.</div></div>
<div class="calc-card"><div class="card-title">$(A + B)^T = A^T + B^T$</div><div class="card-body">Transpose distributes over addition.</div></div>
<div class="calc-card"><div class="card-title">$(kA)^T = k A^T$</div><div class="card-body">Scalars pass through the transpose untouched.</div></div>
<div class="calc-card"><div class="card-title">$(AB)^T = B^T A^T$</div><div class="card-body"><strong>Order reverses!</strong> This is the rule students forget. Memorise it now.</div></div>
</div>

<div class="l-note"><strong>Symmetric in one line.</strong> A square matrix A is <em>symmetric</em> exactly when A<sup>T</sup> = A. That is the cleanest possible definition. Try it on $\\begin{pmatrix} 2 & 5 \\\\ 5 & 9 \\end{pmatrix}$ — swap the off-diagonal entries and you get the same matrix back.</div>

<h2 class="lesson-title">9. Common Errors to Avoid</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIZE-MISMATCH IN ADDITION</div><div class="compare-item">Wrong: writing $\\begin{pmatrix} 1 & 2 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$ as anything.</div><div class="compare-item">A 1&times;2 row vector and a 2&times;1 column vector have the <em>same numbers</em> but different sizes. Their sum is undefined.</div><div class="compare-item">Fix: always check size first. Same size = same shape, not same total count.</div></div><div class="compare-col"><div class="compare-title">DIMENSION-MISMATCH IN MULTIPLICATION</div><div class="compare-item">Wrong: multiplying a 2&times;3 by a 2&times;3 directly.</div><div class="compare-item">Inner dimensions don't match (3 ≠ 2). You would need to transpose one of them first.</div><div class="compare-item">Fix: write the sizes side by side as (2&times;3)(2&times;3) and check the inner pair.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ASSUMING AB = BA</div><div class="compare-item">Wrong: simplifying $(A + B)^2$ as $A^2 + 2AB + B^2$.</div><div class="compare-item">For matrices, the binomial expansion gives $(A + B)^2 = A^2 + AB + BA + B^2$, and the two middle terms are usually different.</div><div class="compare-item">Fix: treat AB and BA as separate objects unless told otherwise.</div></div><div class="compare-col"><div class="compare-title">TRANSPOSE OF A PRODUCT</div><div class="compare-item">Wrong: writing $(AB)^T = A^T B^T$.</div><div class="compare-item">The correct rule is $(AB)^T = B^T A^T$ — the order reverses.</div><div class="compare-item">Fix: think "socks and shoes": to undo putting on socks then shoes, you take off shoes then socks. Operations reverse.</div></div></div>

<h2 class="lesson-title">10. Practice Problems</h2>

<p class="l-text">Eight problems to lock in the operations. Compute by hand first, then check against the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — IDENTIFY THE ENTRY</div><div class="example-body">For $A = \\begin{pmatrix} 3 & -1 & 5 \\\\ 0 & 7 & -2 \\\\ 4 & 6 & 8 \\end{pmatrix}$, list $a_{12}$, $a_{31}$, and $a_{23}$.<br><br><strong>Answer:</strong> $a_{12} = -1$ (row 1, col 2), $a_{31} = 4$ (row 3, col 1), $a_{23} = -2$ (row 2, col 3).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — ADDITION</div><div class="example-body">Compute $A + B$ where $A = \\begin{pmatrix} 2 & -1 \\\\ 4 & 0 \\end{pmatrix}$ and $B = \\begin{pmatrix} -3 & 5 \\\\ 1 & 2 \\end{pmatrix}$.<br><br>Same size (2&times;2), so add entry by entry.<br>$$A + B \\;=\\; \\begin{pmatrix} 2 + (-3) & -1 + 5 \\\\ 4 + 1 & 0 + 2 \\end{pmatrix} \\;=\\; \\begin{pmatrix} -1 & 4 \\\\ 5 & 2 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — SCALAR MULTIPLICATION</div><div class="example-body">Compute $4A - 2B$ for the matrices in Problem 2.<br><br>$4A = \\begin{pmatrix} 8 & -4 \\\\ 16 & 0 \\end{pmatrix}, \\;\\; 2B = \\begin{pmatrix} -6 & 10 \\\\ 2 & 4 \\end{pmatrix}.$<br>$$4A - 2B \\;=\\; \\begin{pmatrix} 8 - (-6) & -4 - 10 \\\\ 16 - 2 & 0 - 4 \\end{pmatrix} \\;=\\; \\begin{pmatrix} 14 & -14 \\\\ 14 & -4 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — 2&times;2 PRODUCT</div><div class="example-body">Compute $AB$ where $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ and $B = \\begin{pmatrix} 4 & -1 \\\\ 2 & 5 \\end{pmatrix}$.<br><br>$(AB)_{11} = 2 \\cdot 4 + 1 \\cdot 2 = 10$.<br>$(AB)_{12} = 2 \\cdot (-1) + 1 \\cdot 5 = 3$.<br>$(AB)_{21} = 0 \\cdot 4 + 3 \\cdot 2 = 6$.<br>$(AB)_{22} = 0 \\cdot (-1) + 3 \\cdot 5 = 15$.<br>$$AB \\;=\\; \\begin{pmatrix} 10 & 3 \\\\ 6 & 15 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — NON-SQUARE PRODUCT</div><div class="example-body">Compute $PQ$ where $P = \\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\end{pmatrix}$ (size 2&times;3) and $Q = \\begin{pmatrix} 1 & 2 \\\\ 0 & -1 \\\\ 3 & 4 \\end{pmatrix}$ (size 3&times;2).<br><br>Inner dimensions: 3 = 3. ✓ Product is 2&times;2.<br><br>$(PQ)_{11} = 1 \\cdot 1 + 0 \\cdot 0 + 2 \\cdot 3 = 7$.<br>$(PQ)_{12} = 1 \\cdot 2 + 0 \\cdot (-1) + 2 \\cdot 4 = 10$.<br>$(PQ)_{21} = -1 \\cdot 1 + 3 \\cdot 0 + 1 \\cdot 3 = 2$.<br>$(PQ)_{22} = -1 \\cdot 2 + 3 \\cdot (-1) + 1 \\cdot 4 = -1$.<br>$$PQ \\;=\\; \\begin{pmatrix} 7 & 10 \\\\ 2 & -1 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — TRANSPOSE</div><div class="example-body">Write $M^T$ for $M = \\begin{pmatrix} 1 & 2 & 3 & 4 \\\\ 5 & 6 & 7 & 8 \\end{pmatrix}$.<br><br>M is 2&times;4, so M<sup>T</sup> is 4&times;2. Row 1 becomes column 1, row 2 becomes column 2.<br><br>$$M^T \\;=\\; \\begin{pmatrix} 1 & 5 \\\\ 2 & 6 \\\\ 3 & 7 \\\\ 4 & 8 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — SOLVE FOR UNKNOWNS</div><div class="example-body">Find $x$, $y$, $z$ if $\\begin{pmatrix} 2x & 6 \\\\ -1 & y + 3 \\end{pmatrix} + \\begin{pmatrix} 3 & -1 \\\\ 2 & 4 \\end{pmatrix} = \\begin{pmatrix} 11 & 5 \\\\ 1 & z \\end{pmatrix}$.<br><br>Add the left side, then match entries:<br>(1,1): $2x + 3 = 11 \\Rightarrow x = 4$.<br>(1,2): $6 - 1 = 5$ ✓ (no unknown).<br>(2,1): $-1 + 2 = 1$ ✓ (no unknown).<br>(2,2): $(y + 3) + 4 = z \\Rightarrow z = y + 7$. With no further info, the answer is the relationship $z = y + 7$ (one equation in two unknowns).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — VERIFY $(AB)^T = B^T A^T$</div><div class="example-body">For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$, compute both sides.<br><br>From section 7: $AB = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$, so $(AB)^T = \\begin{pmatrix} 19 & 43 \\\\ 22 & 50 \\end{pmatrix}$.<br><br>$B^T = \\begin{pmatrix} 5 & 7 \\\\ 6 & 8 \\end{pmatrix}, \\quad A^T = \\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}$.<br>$(B^T A^T)_{11} = 5 \\cdot 1 + 7 \\cdot 2 = 19$. $(B^T A^T)_{12} = 5 \\cdot 3 + 7 \\cdot 4 = 43$.<br>$(B^T A^T)_{21} = 6 \\cdot 1 + 8 \\cdot 2 = 22$. $(B^T A^T)_{22} = 6 \\cdot 3 + 8 \\cdot 4 = 50$.<br>$$B^T A^T \\;=\\; \\begin{pmatrix} 19 & 43 \\\\ 22 & 50 \\end{pmatrix} \\;=\\; (AB)^T. \\;\\;\\checkmark$$<br>Note that $A^T B^T = \\begin{pmatrix} 23 & 31 \\\\ 34 & 46 \\end{pmatrix}$, which is the transpose of $BA$ — not of $AB$. The order really does matter.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Lesson 73 turns matrix multiplication into a tool for solving systems of linear equations. The matrix becomes a way to package the coefficients of a system; multiplying it by a column vector of unknowns reproduces the entire system. Lessons 74 and 75 introduce the determinant and the inverse — both defined only for square matrices and both extending the arithmetic of this lesson.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>An m&times;n matrix is a rectangular array with m rows and n columns; entry <em>a<sub>ij</sub></em> sits at row i, column j</li>
<li>Special types: row vector (1&times;n), column vector (n&times;1), square (n&times;n), zero, identity I<sub>n</sub>, diagonal, symmetric</li>
<li>Equality requires identical size and matching entries everywhere</li>
<li>Addition and subtraction are entry-wise, defined only for matrices of the same size</li>
<li>Scalar multiplication scales every entry; distributive and associative laws hold</li>
<li>Matrix multiplication: (AB)<sub>ij</sub> = sum of <em>a<sub>ik</sub>b<sub>kj</sub></em>; defined when cols(A) = rows(B); produces m&times;p; not commutative</li>
<li>Transpose flips rows and columns; (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup> (order reverses)</li>
<li>Three top mistakes: size mismatch in addition, dimension mismatch in multiplication, assuming AB = BA</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir matris, sayılardan oluşan bir dikdörtgendir.</strong> Tanım tamamen bu kadar — istersen burada okumayı bırakabilirsin, çünkü önümüzdeki 30 sayfadaki tüm cebirsel kurallar bu tek cümleden çıkar. Matrisleri güçlü kılan dikdörtgenin kendisi değil, onunla <em>yapabildiklerin</em>: bir matrisi diğerine eklemek, bir sayıyla çarpmak, iki dönüşümü birleştirmek için başka bir matrisle çarpmak, köşegen boyunca aynalamak. Her birinin kesin bir kuralı vardır ve bu kuralları öğrenmek bu dersin tamamıdır.</p>

<p class="l-text">Bu dersin sonunda bir <em>m&times;n</em> matrisin nasıl göründüğünü, girdilerine nasıl atıfta bulunulacağını, hangi özel türlerin ezberlemen gereken isimleri olduğunu ve nasıl toplanıp çıkarılacağını, skalerle ve başka bir matrisle nasıl çarpılacağını, nasıl transpoze edileceğini bileceksin. Tamamen lise düzeyinde kalıyoruz: henüz determinant yok, ters matris yok, satır indirgeme yok. Sadece üzerinde işlem yapabileceğin nesneler olarak matrislerin grameri. Sonraki dersler bu grameri denklem sistemlerini çözmek ve geometrik dönüşümleri tanımlamak için bir dile dönüştürecek.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir <em>m&times;n</em> matrisi tanımlamayı ve herhangi bir girdiyi <em>a<sub>ij</sub></em> (i = satır, j = sütun) olarak adlandırmayı</li>
<li>Özel türleri tanımayı: satır vektörü, sütun vektörü, kare, sıfır, birim, köşegen, simetrik matris</li>
<li>İki matrisi girdi-girdi eklemeyi ve çıkarmayı (yalnızca boyutları aynıysa)</li>
<li>Bir matrisi skalerle çarpmayı (her girdi ölçeklenir)</li>
<li>Boyutların uyduğunu kontrol ettikten sonra iki matrisi satır-nokta-sütun kuralıyla çarpmayı</li>
<li>Bir matrisi transpoze etmeyi ve <em>(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup></em> kuralını kullanmayı</li>
<li>Sınavda puan kaybettiren üç klasik hatayı fark etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Matris Nedir?</h2>

<div class="calc-highlight"><strong>Tanım.</strong> <em>Matris</em>, satırlara (yatay sıralar) ve sütunlara (dikey sıralar) organize edilmiş dikdörtgen biçimli bir sayı dizilişidir. <em>m</em> satır ve <em>n</em> sütun varsa, ona <strong>m&times;n matrisi</strong> ("m'ye n" diye okunur) denir ve <strong>boyutunun</strong> (mertebe veya boyut) <em>m&times;n</em> olduğu söylenir.</div>

<p class="l-text">Matrisler büyük köşeli parantezler ya da yuvarlak parantezler arasına yazılır. Seçim tamamen üslupsaldır; bu derste yuvarlak parantez kullanıyoruz. İşte 2&times;3'lük bir matris:</p>

<div class="calc-formula"><div class="formula-label">2&times;3 MATRİS</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} 1 & 4 & 7 \\\\ 2 & 5 & 8 \\end{pmatrix}$$</div><div class="formula-sub">İki satır, üç sütun. "A bir 2&times;3 matristir" ya da "A'nın boyutu 2&times;3'tür" deriz.</div></div>

<p class="l-text">Sıraya dikkat: <strong>önce satır, sonra sütun</strong>. 5&times;2'lik bir matrisin 5 satırı, 2 sütunu vardır — bu onu uzun ve dar yapar. 2&times;5'lik bir matrisin 2 satırı, 5 sütunu vardır — bu onu kısa ve geniş yapar. Sırayı karıştırmak, matrislerle ilk haftalarında öğrencilerin yaptığı en yaygın hatadır.</p>

<div class="calc-formula"><div class="formula-label">İNDİS GÖSTERİMİ</div><div class="formula-main">$$A \\;=\\; [a_{ij}] \\qquad i = 1, 2, \\ldots, m \\;\\;\\text{ve}\\;\\; j = 1, 2, \\ldots, n$$</div><div class="formula-sub"><em>a<sub>ij</sub></em> girdisi <em>i</em>. satır ve <em>j</em>. sütundadır. Satır indisi her zaman önce gelir.</div></div>

<p class="l-text">Yukarıdaki 2&times;3 matriste <em>a</em><sub>11</sub> = 1, <em>a</em><sub>12</sub> = 4, <em>a</em><sub>13</sub> = 7, <em>a</em><sub>21</sub> = 2, <em>a</em><sub>22</sub> = 5, <em>a</em><sub>23</sub> = 8'dir. Her indisi sesli oku: "a-bir-bir bir, a-bir-iki dört, ..." Başta yavaş gelir; bir hafta içinde otomatikleşir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Satır indisi <em>i</em></div><div class="card-body">Satırları yukarıdan aşağıya sayar. En üst satır 1. satırdır. Her zaman birinci alt indis.</div></div>
<div class="calc-card"><div class="card-title">Sütun indisi <em>j</em></div><div class="card-body">Sütunları soldan sağa sayar. En soldaki sütun 1. sütundur. Her zaman ikinci alt indis.</div></div>
<div class="calc-card"><div class="card-title">Girdi <em>a<sub>ij</sub></em></div><div class="card-body"><em>i</em>. satır ve <em>j</em>. sütunun kesişimindeki tek sayı. (<em>i</em>, <em>j</em>)-girdisi olarak da adlandırılır.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Yukarıdaki matriste <em>a</em><sub>22</sub> nedir? (Cevap: 5 — 2. satır, 2. sütun.) <em>a</em><sub>13</sub> nedir? (Cevap: 7 — 1. satır, 3. sütun.) <em>a</em><sub>32</sub> neden tanımsızdır? (Çünkü bu matrisin sadece 2 satırı var; 3. satır yok.)</div></div>

<h2 class="lesson-title">2. Matrisi Renkli Bir Izgara Olarak Görmek</h2>

<p class="l-text">Matrisleri görmenin güzel bir yolu, her hücresinin rengi içindeki sayıyı kodlayan renkli bir ızgaradır. Parlak renkler büyük girdileri, sönük renkler küçük girdileri belirtir. Bu görsel temsil, yapay sinir ağlarında, tıbbi görüntülerde (bir MR kesiti bir matristir) ve elektronik tablolarda hücreleri "koşullu biçimlendirdiğinde" kullanılan temsilin aynısıdır.</p>

<div class="calc-graph"><div id="plot-l72-grid-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ısı haritası olarak gösterilen 4&times;4'lük bir matris. Her hücre değerini metin olarak, rengini ise görsel ipucu olarak gösterir (parlak mavi = büyük sayı). (1,1) girdisinin tam olarak kağıt üzerinde yazıldığı gibi sol üstte olduğuna dikkat et. Fareyi herhangi bir hücrenin üzerine getirdiğinde (satır, sütun) indisini ortaya çıkarır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Zt=[[1,4,7,2],[3,5,8,1],[6,2,9,4],[5,7,3,8]];
var xst=['sütun 1','sütun 2','sütun 3','sütun 4'];
var yst=['satır 1','satır 2','satır 3','satır 4'];
var annoTR=[];
for(var i=0;i<4;i++){for(var j=0;j<4;j++){annoTR.push({x:xst[j],y:yst[i],text:String(Zt[i][j]),showarrow:false,font:{color:'#0a0a0a',size:18,family:'Geist'}});}}
var heatTR={z:Zt,x:xst,y:yst,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.5,'#3b82f6'],[1,'#93c5fd']],showscale:true,hovertemplate:'%{y}, %{x}<br>değer: %{z}<extra></extra>'};
var layoutTR={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{side:'top',showgrid:false,zeroline:false},yaxis:{autorange:'reversed',showgrid:false,zeroline:false},margin:{t:50,r:30,b:40,l:80},annotations:annoTR};
Plotly.newPlot('plot-l72-grid-tr',[heatTR],layoutTR,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Özel Matris Türleri</h2>

<div class="calc-highlight"><strong>Okulda karşılaştığın matrislerin çoğu birkaç standart biçimden birine sahiptir.</strong> İsimlerini bilmek iletişimi kolaylaştırır: bir soruda "A 3&times;3'lük birim matris olsun" yazıyorsa, anında tek bir matrisi zihninde canlandırıp hesaba başlamalısın.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Satır vektörü (1&times;n)</div><div class="card-body">Yalnızca bir satır, <em>n</em> sütun. Örnek: $\\begin{pmatrix} 2 & 5 & 7 \\end{pmatrix}$ bir 1&times;3 satır vektörüdür. Genellikle bir noktanın koordinatlarını saklamak için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Sütun vektörü (n&times;1)</div><div class="card-body">Bir sütun, <em>n</em> satır. Örnek: $\\begin{pmatrix} 2 \\\\ 5 \\\\ 7 \\end{pmatrix}$ bir 3&times;1 sütun vektörüdür. Lineer cebirde vektörlerin standart biçimidir.</div></div>
<div class="calc-card"><div class="card-title">Kare matris (n&times;n)</div><div class="card-body">Satır ve sütun sayısı eşit. Örnek: 3&times;3 bir matris karedir. Yalnızca kare matrislerin determinantı ve tersi vardır (sonra öğreneceksin).</div></div>
<div class="calc-card"><div class="card-title">Sıfır matrisi (0)</div><div class="card-body">Her girdisi 0'dır. Her boyut için bir sıfır matrisi vardır. Sayılarda 0 gibi davranır: A + 0 = A.</div></div>
<div class="calc-card"><div class="card-title">Birim matris I<sub>n</sub></div><div class="card-body">Kare, ana köşegende 1'ler, başka her yerde 0'lar. 1 gibi davranır: çarpım tanımlı olduğunda AI = IA = A.</div></div>
<div class="calc-card"><div class="card-title">Köşegen matris</div><div class="card-body">Kare, sıfırdan farklı girdiler yalnızca ana köşegende. Örnek: $\\begin{pmatrix} 3 & 0 \\\\ 0 & 7 \\end{pmatrix}$. Birim matris özel bir köşegen matristir.</div></div>
<div class="calc-card"><div class="card-title">Simetrik matris</div><div class="card-body">Kare, her <em>i</em>, <em>j</em> için <em>a<sub>ij</sub></em> = <em>a<sub>ji</sub></em>. Ana köşegene göre yansıtıldığında aynı görünür. Örnek: $\\begin{pmatrix} 2 & 5 \\\\ 5 & 9 \\end{pmatrix}$.</div></div>
<div class="calc-card"><div class="card-title">Üst / alt üçgen</div><div class="card-body">Ana köşegenin altındaki (üst) ya da üstündeki (alt) tüm girdiler 0'dır. Sonra Gauss eliminasyonunda karşımıza çıkacak.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">3&times;3 BİRİM MATRİS</div><div class="formula-main">$$I_3 \\;=\\; \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$</div><div class="formula-sub">1'lerden oluşan köşegen, başka her yerde sıfır. Her boyutun kendi birim matrisi var: I<sub>2</sub>, I<sub>3</sub>, I<sub>4</sub>, ...</div></div>

<div class="calc-graph"><div id="plot-l72-identity-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 5&times;5'lik birim matris bir ısı haritası olarak. 0'ların koyu arka planına karşı parlak 1'ler köşegeni, birim matrisin görsel imzasıdır — bu resmi bir kez gördükten sonra her bağlamda onu anında tanırsın.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=5;var Zit=[];for(var i=0;i<n;i++){var rw=[];for(var j=0;j<n;j++){rw.push(i===j?1:0);}Zit.push(rw);}
var xsit=['s1','s2','s3','s4','s5'];var ysit=['r1','r2','r3','r4','r5'];
var annoIT=[];for(var i=0;i<n;i++){for(var j=0;j<n;j++){annoIT.push({x:xsit[j],y:ysit[i],text:i===j?'1':'0',showarrow:false,font:{color:i===j?'#0a0a0a':'#e8e8e8',size:16,family:'Geist'}});}}
var heatIT={z:Zit,x:xsit,y:ysit,type:'heatmap',colorscale:[[0,'#0a0a0a'],[1,'#3b82f6']],showscale:false,hovertemplate:'%{y}, %{x}<br>değer: %{z}<extra></extra>'};
var layIT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{side:'top',showgrid:false,zeroline:false},yaxis:{autorange:'reversed',showgrid:false,zeroline:false},margin:{t:50,r:30,b:40,l:60},annotations:annoIT};
Plotly.newPlot('plot-l72-identity-tr',[heatIT],layIT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Matris Eşitliği</h2>

<div class="calc-highlight"><strong>İki matris eşittir ancak (i) boyutları tam olarak aynıysa ve (ii) karşılık gelen tüm girdiler eşitse.</strong> Her iki koşul da gereklidir. 2&times;3 bir matris 3&times;2 bir matrise asla eşit olamaz — aynı sayıları içerseler bile.</div>

<div class="calc-formula"><div class="formula-label">MATRİS EŞİTLİĞİ</div><div class="formula-main">$$A = B \\;\\iff\\; \\text{boyut}(A) = \\text{boyut}(B) \\;\\text{ ve }\\; a_{ij} = b_{ij} \\;\\text{ tüm } i, j \\text{ için}$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\begin{pmatrix} x & 4 \\\\ 7 & y \\end{pmatrix} = \\begin{pmatrix} 3 & 4 \\\\ 7 & -2 \\end{pmatrix}$ ise <em>x</em> ve <em>y</em>'yi bul.<br><br>Matris eşitliğinden, karşılık gelen girdiler eşleşmelidir. (1,1) girdisinden: <em>x</em> = 3. (2,2) girdisinden: <em>y</em> = &minus;2.<br><br>Cevap: <strong>x = 3, y = &minus;2</strong>.</div></div>

<h2 class="lesson-title">5. Toplama ve Çıkarma</h2>

<div class="calc-highlight"><strong>Matris toplama girdi-girdidir.</strong> Karşılık gelen girdileri tek tek topla. Sonuç orijinal iki matrisle aynı boyuttadır. Kısayol yok, özel türler için özel kural yok — sadece hizala ve topla.</div>

<div class="calc-formula"><div class="formula-label">MATRİS TOPLAMA</div><div class="formula-main">$$(A + B)_{ij} \\;=\\; a_{ij} + b_{ij}$$</div><div class="formula-sub">Yalnızca A ve B aynı boyutta olduğunda tanımlıdır. Çıkarma aynı şekilde çalışır: <em>(A &minus; B)<sub>ij</sub></em> = <em>a<sub>ij</sub></em> &minus; <em>b<sub>ij</sub></em>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TOPLAMA</div><div class="example-body">$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ ve $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$ için $A + B$'yi hesapla.<br><br>İkisi de 2&times;2, yani toplam tanımlı.<br>$$A + B \\;=\\; \\begin{pmatrix} 1+5 & 2+6 \\\\ 3+7 & 4+8 \\end{pmatrix} \\;=\\; \\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÇIKARMA</div><div class="example-body">Yukarıdaki matrisler için $A - B$'yi hesapla.<br><br>$$A - B \\;=\\; \\begin{pmatrix} 1-5 & 2-6 \\\\ 3-7 & 4-8 \\end{pmatrix} \\;=\\; \\begin{pmatrix} -4 & -4 \\\\ -4 & -4 \\end{pmatrix}.$$</div></div>

<div class="l-note"><strong>Uyumsuz boyutlarda ne olur?</strong> A 2&times;3 ve B 3&times;2 ise, A + B <em>tanımsızdır</em> — sıfır değil, "yaklaşık cevap" değil, anlamsız. Matris toplaması özdeş boyutlar gerektirir. Hesaplamadan önce her zaman boyutu kontrol et.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değişme özelliği</div><div class="card-body">$A + B = B + A$ — sıradan sayılarla aynı; çünkü her girdi-girdi toplam değişmelidir.</div></div>
<div class="calc-card"><div class="card-title">Birleşme özelliği</div><div class="card-body">$(A + B) + C = A + (B + C)$ — parantezleri serbestçe yeniden gruplandırabilirsin.</div></div>
<div class="calc-card"><div class="card-title">Sıfır etkisiz elemandır</div><div class="card-body">$A + 0 = A$, burada 0 aynı boyuttaki sıfır matristir.</div></div>
</div>

<h2 class="lesson-title">6. Skalerle Çarpma</h2>

<div class="calc-highlight"><strong>Bir matrisi bir skalerle (sıradan bir sayıyla) çarpmak, her girdiyi o sayıyla ölçeklendirir.</strong> Skaler, tek bir gerçek sayıdır — matristen ayırt etmek için bazen <em>&alpha;</em>, <em>&beta;</em>, <em>&lambda;</em> gibi küçük Yunan harfleri kullanırız.</div>

<div class="calc-formula"><div class="formula-label">SKALERLE ÇARPMA</div><div class="formula-main">$$(kA)_{ij} \\;=\\; k \\cdot a_{ij}$$</div><div class="formula-sub">A'nın her girdisi <em>k</em> ile çarpılır. Matrisin boyutu değişmez.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A = \\begin{pmatrix} 1 & -2 \\\\ 3 & 4 \\end{pmatrix}$ ise $3A$ ve $-2A$ hesapla.<br><br>$$3A \\;=\\; \\begin{pmatrix} 3 & -6 \\\\ 9 & 12 \\end{pmatrix}, \\qquad -2A \\;=\\; \\begin{pmatrix} -2 & 4 \\\\ -6 & -8 \\end{pmatrix}.$$<br>$-A$ ($k = -1$ ile) sadece her işareti tersine çevirir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Matris toplamı üzerine dağılma</div><div class="card-body">$k(A + B) = kA + kB$. Skaleri parantezin içinden geçir.</div></div>
<div class="calc-card"><div class="card-title">Skaler toplamı üzerine dağılma</div><div class="card-body">$(k + \\ell)A = kA + \\ell A$. Skalerlerin toplamını ayır.</div></div>
<div class="calc-card"><div class="card-title">Birleşme özelliği</div><div class="card-body">$k(\\ell A) = (k\\ell)A$. Önce skalerleri çarp ya da tek tek yap — sonuç aynı.</div></div>
</div>

<h2 class="lesson-title">7. Matris Çarpma</h2>

<div class="calc-highlight"><strong>Matrisleri ilginç kılan işlem budur.</strong> Toplamanın aksine, matris çarpma girdi-girdi <em>değildir</em>. AB çarpımının (i, j) girdisi, A'nın bir tam satırı ile B'nin bir tam sütunundan inşa edilir. Kural başta tuhaf görünür ama arkasındaki neden (doğrusal dönüşümlerin bileşimi) sonraki derslerde ortaya çıkar ve onu kaçınılmaz kılar.</div>

<p class="l-text"><strong>Önce boyut kuralı.</strong> <em>AB</em> çarpımı yalnızca şu durumda tanımlıdır:</p>

<div class="calc-formula"><div class="formula-label">AB İÇİN BOYUT KURALI</div><div class="formula-main">$$\\text{(A'nın sütun sayısı)} \\;=\\; \\text{(B'nin satır sayısı)}$$</div><div class="formula-sub">A m&times;n ve B n&times;p ise, AB tanımlıdır ve boyutu m&times;p'dir. İçteki iki sayı eşleşmeli; dıştaki ikisi sonucun boyutu olur.</div></div>

<p class="l-text">Şöyle düşün: $\\boxed{m \\times \\underline{n}}_{A}\\;\\cdot\\;\\boxed{\\underline{n} \\times p}_{B} \\;=\\; m \\times p$. Altı çizili n'ler birbirini götürür; dışta kalanlar çarpımın boyutudur.</p>

<div class="calc-formula"><div class="formula-label">AB'NİN GİRDİLERİ</div><div class="formula-main">$$(AB)_{ij} \\;=\\; \\sum_{k=1}^{n} a_{ik} \\, b_{kj} \\;=\\; a_{i1}b_{1j} + a_{i2}b_{2j} + \\cdots + a_{in}b_{nj}$$</div><div class="formula-sub">AB'nin (i, j) girdisi, A'nın i. satırı ile B'nin j. sütununun nokta çarpımıdır.</div></div>

<p class="l-text">Sözcüklerle: çarpımın <em>i</em>. satır, <em>j</em>. sütunundaki girdiyi bulmak için A'nın <em>i</em>. satırı boyunca yürü ve B'nin <em>j</em>. sütunundan aşağı in, eşleşen çiftleri çarp ve topla. Her (i, j) girdisi için tekrarla.</p>

<div class="calc-graph"><div id="plot-l72-product-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> 2&times;3 bir A matrisi, 3&times;2 bir B matrisiyle çarpılarak 2&times;2'lik AB çarpımı veriyor. Sağdaki sonuçta her hücre vurgulu. İç boyutun (3) nasıl "toplanarak yok olduğuna" ve dış boyutların (2 ve 2) cevaba nasıl taşındığına dikkat et.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Atr=[[1,2,3],[4,5,6]];
var Btr=[[7,8],[9,10],[11,12]];
var Ctr=[[0,0],[0,0]];
for(var i=0;i<2;i++){for(var j=0;j<2;j++){for(var k=0;k<3;k++){Ctr[i][j]+=Atr[i][k]*Btr[k][j];}}}
var trA={z:Atr,x:['a·1','a·2','a·3'],y:['A s1','A s2'],type:'heatmap',xaxis:'x1',yaxis:'y1',colorscale:[[0,'#0a0a0a'],[1,'#3b82f6']],showscale:false};
var trB={z:Btr,x:['b·1','b·2'],y:['B s1','B s2','B s3'],type:'heatmap',xaxis:'x2',yaxis:'y2',colorscale:[[0,'#0a0a0a'],[1,'#1d4ed8']],showscale:false};
var trC={z:Ctr,x:['c·1','c·2'],y:['AB s1','AB s2'],type:'heatmap',xaxis:'x3',yaxis:'y3',colorscale:[[0,'#0a0a0a'],[1,'#60a5fa']],showscale:false};
var annoPT=[];
for(var i=0;i<2;i++){for(var j=0;j<3;j++){annoPT.push({x:['a·1','a·2','a·3'][j],y:['A s1','A s2'][i],text:String(Atr[i][j]),showarrow:false,xref:'x1',yref:'y1',font:{color:'#0a0a0a',size:16,family:'Geist'}});}}
for(var i=0;i<3;i++){for(var j=0;j<2;j++){annoPT.push({x:['b·1','b·2'][j],y:['B s1','B s2','B s3'][i],text:String(Btr[i][j]),showarrow:false,xref:'x2',yref:'y2',font:{color:'#0a0a0a',size:16,family:'Geist'}});}}
for(var i=0;i<2;i++){for(var j=0;j<2;j++){annoPT.push({x:['c·1','c·2'][j],y:['AB s1','AB s2'][i],text:String(Ctr[i][j]),showarrow:false,xref:'x3',yref:'y3',font:{color:'#0a0a0a',size:18,family:'Geist'}});}}
annoPT.push({x:0.18,y:1.06,xref:'paper',yref:'paper',text:'<b>A</b> (2×3)',showarrow:false,font:{color:'#3b82f6',size:14}});
annoPT.push({x:0.5,y:1.06,xref:'paper',yref:'paper',text:'<b>B</b> (3×2)',showarrow:false,font:{color:'#3b82f6',size:14}});
annoPT.push({x:0.85,y:1.06,xref:'paper',yref:'paper',text:'<b>AB</b> (2×2)',showarrow:false,font:{color:'#3b82f6',size:14}});
var layPT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{domain:[0,0.30],side:'top',showgrid:false,zeroline:false},yaxis:{domain:[0,0.95],autorange:'reversed',showgrid:false,zeroline:false},xaxis2:{domain:[0.35,0.62],side:'top',showgrid:false,zeroline:false,anchor:'y2'},yaxis2:{domain:[0,0.95],autorange:'reversed',showgrid:false,zeroline:false,anchor:'x2'},xaxis3:{domain:[0.70,0.97],side:'top',showgrid:false,zeroline:false,anchor:'y3'},yaxis3:{domain:[0,0.95],autorange:'reversed',showgrid:false,zeroline:false,anchor:'x3'},margin:{t:50,r:10,b:30,l:60},annotations:annoPT};
Plotly.newPlot('plot-l72-product-tr',[trA,trB,trC],layPT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 2&times;2 ÇARPIM</div><div class="example-body">$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ ve $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$ ise $AB$ hesapla.<br><br>A 2&times;2, B 2&times;2. İç boyutlar eşleşiyor (2 = 2), AB tanımlı ve 2&times;2 olacak.<br><br>$(AB)_{11}$ = A'nın 1. satırı ile B'nin 1. sütununun nokta çarpımı = $1 \\cdot 5 + 2 \\cdot 7 = 5 + 14 = 19$.<br>$(AB)_{12}$ = A'nın 1. satırı ile B'nin 2. sütunu = $1 \\cdot 6 + 2 \\cdot 8 = 6 + 16 = 22$.<br>$(AB)_{21}$ = A'nın 2. satırı ile B'nin 1. sütunu = $3 \\cdot 5 + 4 \\cdot 7 = 15 + 28 = 43$.<br>$(AB)_{22}$ = A'nın 2. satırı ile B'nin 2. sütunu = $3 \\cdot 6 + 4 \\cdot 8 = 18 + 32 = 50$.<br><br>$$AB \\;=\\; \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DEĞİŞMEZLİK</div><div class="example-body">Aynı A ve B için $BA$ hesapla ve $AB$ ile karşılaştır.<br><br>$(BA)_{11} = 5 \\cdot 1 + 6 \\cdot 3 = 5 + 18 = 23$.<br>$(BA)_{12} = 5 \\cdot 2 + 6 \\cdot 4 = 10 + 24 = 34$.<br>$(BA)_{21} = 7 \\cdot 1 + 8 \\cdot 3 = 7 + 24 = 31$.<br>$(BA)_{22} = 7 \\cdot 2 + 8 \\cdot 4 = 14 + 32 = 46$.<br><br>$$BA \\;=\\; \\begin{pmatrix} 23 & 34 \\\\ 31 & 46 \\end{pmatrix} \\;\\;\\neq\\;\\; AB.$$<br><strong>Sonuç: Genel olarak $AB \\neq BA$.</strong> Matris çarpması <em>değişmeli değildir</em>. Bu, matrislerin sıradan sayılardan ayrıldığı en önemli noktadır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KARE OLMAYAN ÇARPIM</div><div class="example-body">$C = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$ (2&times;3) ve $D = \\begin{pmatrix} 7 & 8 \\\\ 9 & 10 \\\\ 11 & 12 \\end{pmatrix}$ (3&times;2) ise $CD$ hesapla.<br><br>İç boyutlar: 3 = 3. ✓ Çarpım 2&times;2 olacak.<br><br>$(CD)_{11} = 1 \\cdot 7 + 2 \\cdot 9 + 3 \\cdot 11 = 7 + 18 + 33 = 58$.<br>$(CD)_{12} = 1 \\cdot 8 + 2 \\cdot 10 + 3 \\cdot 12 = 8 + 20 + 36 = 64$.<br>$(CD)_{21} = 4 \\cdot 7 + 5 \\cdot 9 + 6 \\cdot 11 = 28 + 45 + 66 = 139$.<br>$(CD)_{22} = 4 \\cdot 8 + 5 \\cdot 10 + 6 \\cdot 12 = 32 + 50 + 72 = 154$.<br><br>$$CD \\;=\\; \\begin{pmatrix} 58 & 64 \\\\ 139 & 154 \\end{pmatrix}.$$<br>$DC$ (3&times;2 ile 2&times;3) de tanımlıdır ama 3&times;3 olur — CD'den tamamen farklı boyut. Matris çarpması özünde tek yönlüdür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birleşme özelliği</div><div class="card-body">$(AB)C = A(BC)$. Yeniden gruplandırabilirsin ama yeniden sıralayamazsın. Çok sayıda çarpım zincirlerken faydalı.</div></div>
<div class="calc-card"><div class="card-title">Dağılma özelliği</div><div class="card-body">$A(B + C) = AB + AC$ ve $(B + C)A = BA + CA$. Çarpma toplama üzerine dağılır.</div></div>
<div class="calc-card"><div class="card-title">Birim 1 gibi davranır</div><div class="card-body">Herhangi bir m&times;n A matrisi için $I_m A = A$ ve $A I_n = A$. Birim matris çarpmanın etkisiz elemanıdır.</div></div>
<div class="calc-card"><div class="card-title">Sıfır 0 gibi davranır</div><div class="card-body">$0 \\cdot A = A \\cdot 0 = 0$ (doğru boyutlu sıfır matrisler). Sıfır girer, sıfır çıkar.</div></div>
</div>

<h2 class="lesson-title">8. Transpoze</h2>

<div class="calc-highlight"><strong>Bir matrisin transpozesi, onu ana köşegeni boyunca yansıttığında elde ettiğin matristir.</strong> Satırlar sütun, sütunlar satır olur. 2&times;3 bir matrisin transpozesi 3&times;2'dir.</div>

<div class="calc-formula"><div class="formula-label">TRANSPOZE</div><div class="formula-main">$$(A^T)_{ij} \\;=\\; a_{ji}$$</div><div class="formula-sub">Satır ve sütun indisleri yer değiştirir. A m&times;n ise A<sup>T</sup> n&times;m'dir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A = \\begin{pmatrix} 1 & 4 & 7 \\\\ 2 & 5 & 8 \\end{pmatrix}$ matrisinin transpozesini bul.<br><br>A 2&times;3, yani A<sup>T</sup> 3&times;2 olur. A'nın 1. satırı A<sup>T</sup>'nin 1. sütunu olur.<br><br>$$A^T \\;=\\; \\begin{pmatrix} 1 & 2 \\\\ 4 & 5 \\\\ 7 & 8 \\end{pmatrix}.$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$(A^T)^T = A$</div><div class="card-body">İki kez ters çevirmek seni başladığın yere geri getirir.</div></div>
<div class="calc-card"><div class="card-title">$(A + B)^T = A^T + B^T$</div><div class="card-body">Transpoze toplama üzerine dağılır.</div></div>
<div class="calc-card"><div class="card-title">$(kA)^T = k A^T$</div><div class="card-body">Skalerler transpozeden dokunulmadan geçer.</div></div>
<div class="calc-card"><div class="card-title">$(AB)^T = B^T A^T$</div><div class="card-body"><strong>Sıra tersine döner!</strong> Öğrencilerin unuttuğu kural. Şimdi ezberle.</div></div>
</div>

<div class="l-note"><strong>Tek satırda simetrik.</strong> Bir A kare matrisi <em>simetriktir</em> ancak A<sup>T</sup> = A ise. Bu en temiz tanım. $\\begin{pmatrix} 2 & 5 \\\\ 5 & 9 \\end{pmatrix}$ üzerinde dene — köşegen dışı girdileri yer değiştir, aynı matrisi geri alırsın.</div>

<h2 class="lesson-title">9. Kaçınılması Gereken Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TOPLAMADA BOYUT UYUMSUZLUĞU</div><div class="compare-item">Yanlış: $\\begin{pmatrix} 1 & 2 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$ yazıp herhangi bir cevap vermek.</div><div class="compare-item">1&times;2 satır vektörü ile 2&times;1 sütun vektörü <em>aynı sayıları</em> içerir ama farklı boyuttadır. Toplamları tanımsızdır.</div><div class="compare-item">Çare: önce her zaman boyutu kontrol et. Aynı boyut = aynı şekil, aynı toplam eleman sayısı değil.</div></div><div class="compare-col"><div class="compare-title">ÇARPMADA BOYUT UYUMSUZLUĞU</div><div class="compare-item">Yanlış: 2&times;3 ile 2&times;3 matrisi doğrudan çarpmak.</div><div class="compare-item">İç boyutlar uyuşmuyor (3 ≠ 2). Birini önce transpoze etmen gerekir.</div><div class="compare-item">Çare: boyutları yan yana (2&times;3)(2&times;3) yaz ve içteki çifti kontrol et.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">AB = BA VARSAYMAK</div><div class="compare-item">Yanlış: $(A + B)^2$'yi $A^2 + 2AB + B^2$ olarak sadeleştirmek.</div><div class="compare-item">Matrislerde binom açılımı $(A + B)^2 = A^2 + AB + BA + B^2$ verir ve ortadaki iki terim genellikle farklıdır.</div><div class="compare-item">Çare: aksi söylenmedikçe AB ile BA'yı ayrı nesneler olarak ele al.</div></div><div class="compare-col"><div class="compare-title">ÇARPIMIN TRANSPOZESİ</div><div class="compare-item">Yanlış: $(AB)^T = A^T B^T$ yazmak.</div><div class="compare-item">Doğru kural $(AB)^T = B^T A^T$ — sıra tersine döner.</div><div class="compare-item">Çare: "çorap-ayakkabı" düşün: önce çorap, sonra ayakkabı giyersen; çıkarmak için önce ayakkabı, sonra çorap. İşlemler tersine döner.</div></div></div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<p class="l-text">İşlemleri sağlamlaştırmak için sekiz problem. Önce kendin çöz, sonra çözümlü cevaba karşı kontrol et.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — GİRDİYİ TANI</div><div class="example-body">$A = \\begin{pmatrix} 3 & -1 & 5 \\\\ 0 & 7 & -2 \\\\ 4 & 6 & 8 \\end{pmatrix}$ matrisi için $a_{12}$, $a_{31}$ ve $a_{23}$ değerlerini listele.<br><br><strong>Cevap:</strong> $a_{12} = -1$ (1. satır, 2. sütun), $a_{31} = 4$ (3. satır, 1. sütun), $a_{23} = -2$ (2. satır, 3. sütun).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TOPLAMA</div><div class="example-body">$A = \\begin{pmatrix} 2 & -1 \\\\ 4 & 0 \\end{pmatrix}$ ve $B = \\begin{pmatrix} -3 & 5 \\\\ 1 & 2 \\end{pmatrix}$ için $A + B$ hesapla.<br><br>Aynı boyut (2&times;2), girdi-girdi topla.<br>$$A + B \\;=\\; \\begin{pmatrix} 2 + (-3) & -1 + 5 \\\\ 4 + 1 & 0 + 2 \\end{pmatrix} \\;=\\; \\begin{pmatrix} -1 & 4 \\\\ 5 & 2 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — SKALERLE ÇARPMA</div><div class="example-body">Problem 2'deki matrisler için $4A - 2B$ hesapla.<br><br>$4A = \\begin{pmatrix} 8 & -4 \\\\ 16 & 0 \\end{pmatrix}, \\;\\; 2B = \\begin{pmatrix} -6 & 10 \\\\ 2 & 4 \\end{pmatrix}.$<br>$$4A - 2B \\;=\\; \\begin{pmatrix} 8 - (-6) & -4 - 10 \\\\ 16 - 2 & 0 - 4 \\end{pmatrix} \\;=\\; \\begin{pmatrix} 14 & -14 \\\\ 14 & -4 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — 2&times;2 ÇARPIM</div><div class="example-body">$A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ ve $B = \\begin{pmatrix} 4 & -1 \\\\ 2 & 5 \\end{pmatrix}$ için $AB$ hesapla.<br><br>$(AB)_{11} = 2 \\cdot 4 + 1 \\cdot 2 = 10$.<br>$(AB)_{12} = 2 \\cdot (-1) + 1 \\cdot 5 = 3$.<br>$(AB)_{21} = 0 \\cdot 4 + 3 \\cdot 2 = 6$.<br>$(AB)_{22} = 0 \\cdot (-1) + 3 \\cdot 5 = 15$.<br>$$AB \\;=\\; \\begin{pmatrix} 10 & 3 \\\\ 6 & 15 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — KARE OLMAYAN ÇARPIM</div><div class="example-body">$P = \\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\end{pmatrix}$ (2&times;3) ve $Q = \\begin{pmatrix} 1 & 2 \\\\ 0 & -1 \\\\ 3 & 4 \\end{pmatrix}$ (3&times;2) için $PQ$ hesapla.<br><br>İç boyutlar: 3 = 3. ✓ Çarpım 2&times;2.<br><br>$(PQ)_{11} = 1 \\cdot 1 + 0 \\cdot 0 + 2 \\cdot 3 = 7$.<br>$(PQ)_{12} = 1 \\cdot 2 + 0 \\cdot (-1) + 2 \\cdot 4 = 10$.<br>$(PQ)_{21} = -1 \\cdot 1 + 3 \\cdot 0 + 1 \\cdot 3 = 2$.<br>$(PQ)_{22} = -1 \\cdot 2 + 3 \\cdot (-1) + 1 \\cdot 4 = -1$.<br>$$PQ \\;=\\; \\begin{pmatrix} 7 & 10 \\\\ 2 & -1 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — TRANSPOZE</div><div class="example-body">$M = \\begin{pmatrix} 1 & 2 & 3 & 4 \\\\ 5 & 6 & 7 & 8 \\end{pmatrix}$ için $M^T$ yaz.<br><br>M 2&times;4, yani M<sup>T</sup> 4&times;2. 1. satır 1. sütun olur, 2. satır 2. sütun olur.<br><br>$$M^T \\;=\\; \\begin{pmatrix} 1 & 5 \\\\ 2 & 6 \\\\ 3 & 7 \\\\ 4 & 8 \\end{pmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — BİLİNMEYENLERİ BUL</div><div class="example-body">$\\begin{pmatrix} 2x & 6 \\\\ -1 & y + 3 \\end{pmatrix} + \\begin{pmatrix} 3 & -1 \\\\ 2 & 4 \\end{pmatrix} = \\begin{pmatrix} 11 & 5 \\\\ 1 & z \\end{pmatrix}$ ise $x$, $y$, $z$'yi bul.<br><br>Sol tarafı topla, sonra girdileri eşleştir:<br>(1,1): $2x + 3 = 11 \\Rightarrow x = 4$.<br>(1,2): $6 - 1 = 5$ ✓ (bilinmeyen yok).<br>(2,1): $-1 + 2 = 1$ ✓ (bilinmeyen yok).<br>(2,2): $(y + 3) + 4 = z \\Rightarrow z = y + 7$. Daha fazla bilgi olmadan cevap $z = y + 7$ ilişkisidir (iki bilinmeyenli tek denklem).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — $(AB)^T = B^T A^T$ DOĞRULAMA</div><div class="example-body">$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ ve $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$ için her iki tarafı hesapla.<br><br>7. bölümden: $AB = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$, yani $(AB)^T = \\begin{pmatrix} 19 & 43 \\\\ 22 & 50 \\end{pmatrix}$.<br><br>$B^T = \\begin{pmatrix} 5 & 7 \\\\ 6 & 8 \\end{pmatrix}, \\quad A^T = \\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}$.<br>$(B^T A^T)_{11} = 5 \\cdot 1 + 7 \\cdot 2 = 19$. $(B^T A^T)_{12} = 5 \\cdot 3 + 7 \\cdot 4 = 43$.<br>$(B^T A^T)_{21} = 6 \\cdot 1 + 8 \\cdot 2 = 22$. $(B^T A^T)_{22} = 6 \\cdot 3 + 8 \\cdot 4 = 50$.<br>$$B^T A^T \\;=\\; \\begin{pmatrix} 19 & 43 \\\\ 22 & 50 \\end{pmatrix} \\;=\\; (AB)^T. \\;\\;\\checkmark$$<br>$A^T B^T = \\begin{pmatrix} 23 & 31 \\\\ 34 & 46 \\end{pmatrix}$ ise $BA$'nın transpozesidir — AB'nin değil. Sıra gerçekten önemli.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> 73. ders matris çarpmasını doğrusal denklem sistemlerini çözmek için bir araca dönüştürür. Matris, bir sistemin katsayılarını paketleyen bir yöntem haline gelir; bunu bilinmeyenlerin sütun vektörüyle çarpmak tüm sistemi yeniden üretir. 74. ve 75. dersler determinant ve ters matrisi tanıtır — her ikisi de yalnızca kare matrisler için tanımlıdır ve bu dersin aritmetiğini genişletir.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir m&times;n matris, m satır ve n sütundan oluşan dikdörtgen bir dizilimdir; <em>a<sub>ij</sub></em> girdisi i. satır, j. sütundadır</li>
<li>Özel türler: satır vektörü (1&times;n), sütun vektörü (n&times;1), kare (n&times;n), sıfır, birim I<sub>n</sub>, köşegen, simetrik</li>
<li>Eşitlik özdeş boyut ve her yerde eşleşen girdiler gerektirir</li>
<li>Toplama ve çıkarma girdi-girdidir, yalnızca aynı boyuttaki matrisler için tanımlıdır</li>
<li>Skalerle çarpma her girdiyi ölçeklendirir; dağılma ve birleşme kuralları geçerlidir</li>
<li>Matris çarpması: (AB)<sub>ij</sub> = <em>a<sub>ik</sub>b<sub>kj</sub></em> toplamı; sütun(A) = satır(B) iken tanımlı; m&times;p üretir; değişmeli değildir</li>
<li>Transpoze satır ile sütunu yer değiştirir; (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup> (sıra tersine döner)</li>
<li>En sık üç hata: toplamada boyut uyumsuzluğu, çarpmada boyut uyumsuzluğu, AB = BA varsayımı</li>
</ul>
</div>`
};
