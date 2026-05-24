window.LISE_MAT_L73 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The determinant attaches a single number to every square matrix — and that number quietly answers most of the questions you could ask about the matrix.</strong> Is the matrix invertible? Does the system <em>A</em>x = b have a unique solution? What is the area of the parallelogram whose sides are the columns of A? The determinant settles all three at once. It is one of the most economical objects in linear algebra: one scalar, many uses.</p>

<p class="l-text">This lesson develops the determinant for the two cases that matter at high-school level — 2&times;2 and 3&times;3 matrices — together with the geometric meaning that makes the formulas memorable, the algebraic properties that turn long calculations into short ones, and the connection between det(A) = 0 and a singular (non-invertible) matrix. We will end with cofactor expansion, which generalises both cases and prepares the way for university linear algebra.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute the determinant of a 2&times;2 matrix as <em>ad &minus; bc</em> and read it as a signed area</li>
<li>Compute the determinant of a 3&times;3 matrix two ways: Sarrus' rule (the X pattern) and cofactor expansion along the first row</li>
<li>State and apply the five core properties: det(A<sup>T</sup>) = det(A), det(kA) = k<sup>n</sup>det(A), det(AB) = det(A)det(B), row swap negates det, det(A) = 0 iff rows/columns are linearly dependent</li>
<li>Connect det(A) = 0 to non-invertibility of A and non-uniqueness of solutions of <em>A</em>x = b</li>
<li>Read |det(A)| as the volume of the parallelepiped spanned by the columns in 3D</li>
<li>Diagnose and avoid the three classic mistakes: Sarrus sign error, missed alternating sign in cofactor expansion, and confusing |A| with absolute value of entries</li>
</ul>
</div>

<h2 class="lesson-title">1. The 2&times;2 Determinant</h2>

<div class="calc-highlight"><strong>For a 2&times;2 matrix, the determinant is a single subtraction.</strong> Multiply the diagonal, multiply the anti-diagonal, take the difference. That is the whole formula — and the rest of the section explains why this particular combination matters.</div>

<p class="l-text">Take a 2&times;2 matrix with real entries:</p>

<div class="calc-formula"><div class="formula-label">DEFINITION &mdash; 2&times;2 DETERMINANT</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\qquad\\Longrightarrow\\qquad \\det(A) \\;=\\; |A| \\;=\\; ad \\,-\\, bc$$</div><div class="formula-sub">The two common notations are det(A) and |A|. The vertical bars are <em>not</em> absolute value — det(A) can be positive, negative, or zero.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Compute the determinant of $A = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$.<br><br>$\\det(A) = 3 \\cdot 2 - 4 \\cdot 1 = 6 - 4 = \\mathbf{2}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute $\\det\\begin{pmatrix} 5 & 2 \\\\ 10 & 4 \\end{pmatrix}$.<br><br>$5 \\cdot 4 - 2 \\cdot 10 = 20 - 20 = \\mathbf{0}$.<br><br>The determinant is zero. Notice that the second row (10, 4) is exactly twice the first row (5, 2) — the rows are <em>linearly dependent</em>. We will see in section 4 that this is no coincidence.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Compute $\\det\\begin{pmatrix} 2 & -3 \\\\ 4 & 1 \\end{pmatrix}$.<br><br>$2 \\cdot 1 - (-3) \\cdot 4 = 2 - (-12) = 2 + 12 = \\mathbf{14}$.<br><br>Watch the sign of the &minus;3: the formula is $ad - bc$, so subtracting a negative number flips back to addition.</div></div>

<h2 class="lesson-title">2. Geometric Meaning: The Signed Area of a Parallelogram</h2>

<div class="calc-highlight"><strong>The 2&times;2 determinant is the signed area of the parallelogram spanned by the columns (or equivalently the rows) of the matrix.</strong> Magnitude = area; sign = orientation. This is the picture that makes the formula <em>ad &minus; bc</em> memorable.</div>

<p class="l-text">Think of the two columns of $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ as two vectors emerging from the origin: $\\mathbf{u} = (a, c)$ and $\\mathbf{v} = (b, d)$. These two vectors, together with the origin, define a parallelogram with vertices at $(0,0)$, $(a, c)$, $(b, d)$, and $(a+b, c+d)$. The area of that parallelogram is exactly $|ad - bc|$.</p>

<div class="calc-formula"><div class="formula-label">SIGNED AREA FORMULA</div><div class="formula-main">$$\\text{Area}(\\mathbf{u}, \\mathbf{v}) \\;=\\; |\\det(A)| \\;=\\; |ad - bc|$$</div><div class="formula-sub">Drop the absolute value bars and you get the <em>signed</em> area: positive if you can rotate $\\mathbf{u}$ counter-clockwise onto $\\mathbf{v}$ through an angle less than 180&deg;, negative otherwise.</div></div>

<p class="l-text">The sign carries orientation information. If the column vectors are in standard CCW order (you can sweep from the first column to the second going counter-clockwise the short way), the determinant is positive. If they are in CW order, it is negative. Swapping the two columns flips the orientation and therefore negates the determinant. Compare with example 1: we had columns $(3, 1)$ and $(4, 2)$. Swap them and the determinant becomes $4 \\cdot 1 - 3 \\cdot 2 = 4 - 6 = -2$ — same magnitude, flipped sign.</p>

<div class="calc-graph"><div id="plot-l73-parallelogram-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the parallelogram spanned by the column vectors of $A = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$. Vertices at (0,0), (3,1), (4,2), and (7,3). The shaded region has area $|3 \\cdot 2 - 4 \\cdot 1| = 2$ — exactly the determinant we computed.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pX=[0,3,7,4,0]; var pY=[0,1,3,2,0];
var fill={x:pX,y:pY,fill:'toself',fillcolor:'rgba(59,130,246,0.18)',mode:'lines',line:{color:'#3b82f6',width:2.2},name:'parallelogram (area = 2)'};
var u={x:[0,3],y:[0,1],mode:'lines+markers',name:'u = (3,1)',line:{color:'#10b981',width:3},marker:{size:8}};
var v={x:[0,4],y:[0,2],mode:'lines+markers',name:'v = (4,2)',line:{color:'#f59e0b',width:3},marker:{size:8}};
var ax={x:[-0.5,8],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ay={x:[0,0],y:[-0.5,3.5],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lbl={x:[3.0,4.2,7.1,0.1],y:[0.65,2.35,3.25,-0.25],mode:'text',text:['(3,1)','(4,2)','(7,3)','(0,0)'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,8.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.6,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-parallelogram-en',[ax,ay,fill,u,v,lbl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If both columns of a 2&times;2 matrix point in the same direction (one is a scalar multiple of the other), the parallelogram collapses to a line segment with zero area. The determinant must therefore be zero. This is the geometric reason for the linear-dependence property in the next section.</div></div>

<h2 class="lesson-title">3. The 3&times;3 Determinant: Sarrus' Rule</h2>

<div class="calc-highlight"><strong>For a 3&times;3 matrix, Sarrus' rule turns the determinant into six products with alternating signs.</strong> The trick is to draw the matrix and then trace three "downhill" diagonals and three "uphill" diagonals — the downhill ones get a plus sign, the uphill ones a minus.</div>

<p class="l-text">Let:</p>

<div class="calc-formula"><div class="formula-label">3&times;3 MATRIX</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$$</div></div>

<p class="l-text">Sarrus' rule says: write the matrix, then copy the first two columns to the right of the matrix, so you have a 3&times;5 array. Now trace the three "downhill" diagonals (top-left to bottom-right) — multiply each diagonal's three entries and add them. Then trace the three "uphill" diagonals (top-right to bottom-left) and subtract them.</p>

<div class="calc-formula"><div class="formula-label">SARRUS' RULE</div><div class="formula-main">$$\\det(A) \\;=\\; aei \\,+\\, bfg \\,+\\, cdh \\,-\\, ceg \\,-\\, afh \\,-\\, bdi$$</div><div class="formula-sub">Three positive products (the downhill diagonals) minus three negative products (the uphill diagonals). Six terms total.</div></div>

<div class="calc-graph"><div id="plot-l73-sarrus-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the X-pattern of Sarrus' rule. Green arrows trace the three downhill diagonals (+aei, +bfg, +cdh); red arrows trace the three uphill diagonals (&minus;ceg, &minus;afh, &minus;bdi). The first two columns are repeated on the right to make all six diagonals fit.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var letters=['a','b','c','a','b','d','e','f','d','e','g','h','i','g','h'];
var xs=[0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
var ys=[2,2,2,2,2,1,1,1,1,1,0,0,0,0,0];
var ents={x:xs,y:ys,mode:'text',text:letters,textfont:{color:'#e8e8e8',size:22},name:'entries',showlegend:false};
var box1={x:[-0.4,2.4,2.4,-0.4,-0.4],y:[-0.4,-0.4,2.4,2.4,-0.4],mode:'lines',line:{color:'rgba(255,255,255,0.4)',width:1.5},name:'matrix',showlegend:false};
var box2={x:[2.6,4.4,4.4,2.6,2.6],y:[-0.4,-0.4,2.4,2.4,-0.4],mode:'lines',line:{color:'rgba(255,255,255,0.2)',width:1,dash:'dot'},name:'copied columns',showlegend:false};
var d1={x:[0,2],y:[2,0],mode:'lines',line:{color:'#10b981',width:2.5},name:'+aei'};
var d2={x:[1,3],y:[2,0],mode:'lines',line:{color:'#10b981',width:2.5,dash:'dash'},name:'+bfg'};
var d3={x:[2,4],y:[2,0],mode:'lines',line:{color:'#10b981',width:2.5,dash:'dot'},name:'+cdh'};
var u1={x:[2,0],y:[2,0],mode:'lines',line:{color:'#ef4444',width:2.5},name:'−ceg'};
var u2={x:[3,1],y:[2,0],mode:'lines',line:{color:'#ef4444',width:2.5,dash:'dash'},name:'−afh'};
var u3={x:[4,2],y:[2,0],mode:'lines',line:{color:'#ef4444',width:2.5,dash:'dot'},name:'−bdi'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,4.8],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-0.8,2.8],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-sarrus-en',[box1,box2,d1,d2,d3,u1,u2,u3,ents],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; SARRUS</div><div class="example-body">Compute $\\det\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 4 & 5 \\\\ 1 & 0 & 6 \\end{pmatrix}$ using Sarrus' rule.<br><br>Downhill diagonals (+):<br>$\\quad aei = 1 \\cdot 4 \\cdot 6 = 24$<br>$\\quad bfg = 2 \\cdot 5 \\cdot 1 = 10$<br>$\\quad cdh = 3 \\cdot 0 \\cdot 0 = 0$<br>Sum of plus terms: $24 + 10 + 0 = 34$.<br><br>Uphill diagonals (&minus;):<br>$\\quad ceg = 3 \\cdot 4 \\cdot 1 = 12$<br>$\\quad afh = 1 \\cdot 5 \\cdot 0 = 0$<br>$\\quad bdi = 2 \\cdot 0 \\cdot 6 = 0$<br>Sum of minus terms: $12 + 0 + 0 = 12$.<br><br>Determinant: $34 - 12 = \\mathbf{22}$.</div></div>

<div class="l-note"><strong>Important caveat:</strong> Sarrus' rule works <em>only</em> for 3&times;3 matrices. There is no equivalent X-pattern for 4&times;4 or larger. For those we use cofactor expansion (section 6) or row reduction.</div>

<h2 class="lesson-title">4. The Five Core Properties</h2>

<div class="calc-highlight"><strong>Five short rules turn most determinant calculations into one-line arguments instead of brute-force expansion.</strong> Memorise them now — they appear in every exercise from here on.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Property 1 &mdash; Singular iff det = 0</div><div class="card-body">$\\det(A) = 0$ if and only if the rows (equivalently, the columns) of A are linearly dependent. Equivalently, A is non-invertible (singular).</div></div>
<div class="calc-card"><div class="card-title">Property 2 &mdash; Transpose</div><div class="card-body">$\\det(A^T) = \\det(A)$. Transposing a matrix does not change its determinant. So every property stated for rows holds equally for columns.</div></div>
<div class="calc-card"><div class="card-title">Property 3 &mdash; Scalar multiplication</div><div class="card-body">$\\det(kA) = k^n \\det(A)$ for an n&times;n matrix. Multiplying every entry by k multiplies the determinant by $k^n$, not just by k.</div></div>
<div class="calc-card"><div class="card-title">Property 4 &mdash; Product rule</div><div class="card-body">$\\det(AB) = \\det(A) \\cdot \\det(B)$ for any two square matrices of the same size. The determinant of a product is the product of the determinants — one of the most useful identities in algebra.</div></div>
<div class="calc-card"><div class="card-title">Property 5 &mdash; Row swap</div><div class="card-body">Swap any two rows (or two columns) of A, and the determinant changes sign: $\\det(A') = -\\det(A)$. Two consecutive swaps therefore restore the original determinant.</div></div>
</div>

<p class="l-text"><strong>Two more useful consequences</strong> (provable from the five above):</p>

<ul class="l-text" style="line-height:1.7">
<li>If A has a row (or column) of all zeros, then $\\det(A) = 0$.</li>
<li>If two rows (or columns) of A are identical, then $\\det(A) = 0$. (Swap them: $\\det$ negates but the matrix is unchanged, so $\\det = -\\det$, hence $\\det = 0$.)</li>
<li>Adding a multiple of one row to another row does not change the determinant. (This is how we reduce big determinants to upper-triangular form, where the determinant is just the product of the diagonal entries.)</li>
<li>For a diagonal or triangular matrix, $\\det(A)$ is the product of the diagonal entries.</li>
</ul>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; PROPERTY 3</div><div class="example-body">If $A$ is 3&times;3 with $\\det(A) = 5$, what is $\\det(2A)$?<br><br>By property 3 with $n = 3$: $\\det(2A) = 2^3 \\det(A) = 8 \\cdot 5 = \\mathbf{40}$.<br><br>Common mistake: writing $\\det(2A) = 2 \\det(A) = 10$. Wrong — the scalar pulls out as $k^n$, not $k$, because we multiply every one of the $n$ rows by k.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; PROPERTY 4</div><div class="example-body">If $\\det(A) = 3$ and $\\det(B) = -2$, what is $\\det(AB)$?<br><br>By the product rule: $\\det(AB) = \\det(A) \\cdot \\det(B) = 3 \\cdot (-2) = \\mathbf{-6}$.<br><br>Notice we did not have to compute the matrix $AB$ at all. This is the typical use of the product rule: get the determinant of a complicated product for the price of two simple ones.</div></div>

<h2 class="lesson-title">5. When det(A) = 0: Singular Matrices</h2>

<div class="calc-highlight"><strong>A square matrix is called <em>singular</em> when its determinant is zero, and <em>non-singular</em> (or invertible) otherwise.</strong> The single condition $\\det(A) = 0$ packages together three different bad behaviours: linear dependence of rows, non-existence of $A^{-1}$, and non-uniqueness of solutions to $A\\mathbf{x} = \\mathbf{b}$.</div>

<p class="l-text">Here are the equivalent statements you should have at your fingertips. For an n&times;n matrix A, the following are all equivalent — if any one of them is true, all of them are:</p>

<ul class="l-text" style="line-height:1.7">
<li>$\\det(A) = 0$.</li>
<li>The rows of A are linearly dependent (one row is a combination of the others). Same for columns.</li>
<li>A is <strong>not</strong> invertible. There is no matrix $A^{-1}$ with $A A^{-1} = I$.</li>
<li>The system $A\\mathbf{x} = \\mathbf{b}$ either has no solution or infinitely many — never exactly one — depending on the right-hand side $\\mathbf{b}$.</li>
<li>The homogeneous system $A\\mathbf{x} = \\mathbf{0}$ has a non-zero solution.</li>
<li>The columns of A span a subspace of dimension less than n (rank&lt;n).</li>
</ul>

<div class="calc-formula"><div class="formula-label">INVERSE OF A 2&times;2 (WHEN det &ne; 0)</div><div class="formula-main">$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\;\\;\\Longrightarrow\\;\\; A^{-1} = \\frac{1}{ad-bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$</div><div class="formula-sub">The factor $1/\\det(A)$ at the front explains immediately why $\\det(A) = 0$ kills the inverse: division by zero is undefined.</div></div>

<div class="calc-graph"><div id="plot-l73-singular-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two 3&times;3 column configurations. <span style="color:#10b981">Green</span>: a non-singular matrix &mdash; the three column vectors span a full 3D volume (parallelepiped). <span style="color:#ef4444">Red</span>: a singular matrix &mdash; the three column vectors lie in a single plane, so the "volume" collapses to zero. Determinant = signed volume of this parallelepiped.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nsX=[0,1,0,1,0,0,1,1,0,0,1,1,0,1,1,1];
var nsY=[0,0,1,1,0,0,0,1,1,0,1,1,0,1,1,1];
var nsZ=[0,0,0,0,1,0,0,0,0,1,1,0,1,1,0,1];
var ns={type:'scatter3d',x:nsX,y:nsY,z:nsZ,mode:'lines',line:{color:'#10b981',width:5},name:'non-singular (det ≠ 0)'};
var sX=[0,1,0,0.7,0,2,0,0.7]; var sY=[0,0,1,1,0,0,2,1.4]; var sZ=[0,0,0,0,0,0,0,0];
var sing={type:'scatter3d',x:sX,y:sY,z:sZ,mode:'lines',line:{color:'#ef4444',width:5},name:'singular (det = 0)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a',color:'#e8e8e8'}},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-singular-en',[ns,sing],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; DETECTING SINGULAR</div><div class="example-body">Is $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 0 & 1 & 1 \\end{pmatrix}$ invertible?<br><br>Look at rows 1 and 2: $(2,4,6) = 2 \\cdot (1,2,3)$. The second row is twice the first &mdash; they are linearly dependent. By property 1, $\\det(A) = 0$, so A is <strong>singular</strong> (not invertible).<br><br>You can also verify with Sarrus:<br>$+1\\cdot4\\cdot1 + 2\\cdot6\\cdot0 + 3\\cdot2\\cdot1 - 3\\cdot4\\cdot0 - 1\\cdot6\\cdot1 - 2\\cdot2\\cdot1$<br>$= 4 + 0 + 6 - 0 - 6 - 4 = 0$. Confirmed.</div></div>

<h2 class="lesson-title">6. Cofactor Expansion</h2>

<div class="calc-highlight"><strong>Cofactor expansion is the universal recipe: it works for any size matrix, not just 3&times;3.</strong> For a 3&times;3 you expand along the first row and get three smaller (2&times;2) determinants to evaluate, with alternating signs. For 4&times;4 you reduce to four 3&times;3 sub-determinants. And so on.</div>

<p class="l-text">Take the 3&times;3 matrix again:</p>

<div class="calc-formula"><div class="formula-label">SETUP</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$$</div></div>

<p class="l-text">To each entry of the first row, attach a 2&times;2 <em>minor</em> &mdash; the 2&times;2 matrix you get by deleting the row and column that entry lives in. Then attach signs in a chequerboard pattern starting with + in the top left:</p>

<div class="calc-formula"><div class="formula-label">SIGN BOARD &mdash; FIRST ROW</div><div class="formula-main">$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$</div><div class="formula-sub">Position $(i, j)$ gets sign $(-1)^{i+j}$. Top-left is +, alternating in both directions.</div></div>

<div class="calc-formula"><div class="formula-label">COFACTOR EXPANSION ALONG ROW 1</div><div class="formula-main">$$\\det(A) \\;=\\; a \\begin{vmatrix} e & f \\\\ h & i \\end{vmatrix} \\,-\\, b \\begin{vmatrix} d & f \\\\ g & i \\end{vmatrix} \\,+\\, c \\begin{vmatrix} d & e \\\\ g & h \\end{vmatrix}$$</div><div class="formula-sub">Plus, minus, plus &mdash; the alternating signs are crucial. Compute each 2&times;2 minor as $ad - bc$ in section 1.</div></div>

<p class="l-text">Expanding once more, this is exactly the same as Sarrus' rule:</p>

<p class="l-text">$\\det(A) = a(ei - fh) - b(di - fg) + c(dh - eg) = aei - afh - bdi + bfg + cdh - ceg$ &mdash; reorder the six terms and you have the Sarrus expansion of section 3.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; COFACTOR</div><div class="example-body">Compute $\\det\\begin{pmatrix} 2 & 1 & 3 \\\\ 4 & 0 & 1 \\\\ 5 & 2 & 6 \\end{pmatrix}$ by cofactor expansion along the first row.<br><br>$= 2 \\begin{vmatrix} 0 & 1 \\\\ 2 & 6 \\end{vmatrix} - 1 \\begin{vmatrix} 4 & 1 \\\\ 5 & 6 \\end{vmatrix} + 3 \\begin{vmatrix} 4 & 0 \\\\ 5 & 2 \\end{vmatrix}$<br><br>$= 2(0 \\cdot 6 - 1 \\cdot 2) - 1(4 \\cdot 6 - 1 \\cdot 5) + 3(4 \\cdot 2 - 0 \\cdot 5)$<br><br>$= 2(-2) - 1(19) + 3(8) = -4 - 19 + 24 = \\mathbf{1}$.</div></div>

<div class="l-note"><strong>Tip:</strong> if the first row has zeros, expansion is faster &mdash; a zero entry kills its whole 2&times;2 minor. So if you can choose any row or column to expand along, pick the one with the most zeros. (You can expand along any row or column, not just row 1; the chequerboard sign rule still applies.)</div>

<h2 class="lesson-title">7. Geometric Meaning in 3D: Volume of a Parallelepiped</h2>

<div class="calc-highlight"><strong>For a 3&times;3 matrix, $|\\det(A)|$ is the volume of the parallelepiped spanned by its column vectors in 3D.</strong> The 2&times;2 result generalises directly: 2D area becomes 3D volume.</div>

<p class="l-text">Take three column vectors $\\mathbf{u} = (a, d, g)$, $\\mathbf{v} = (b, e, h)$, $\\mathbf{w} = (c, f, i)$ emerging from the origin. Together with the origin they define a parallelepiped &mdash; a "skewed brick" with eight vertices. The volume of that brick is exactly $|\\det(A)|$, where A has these three vectors as its columns.</p>

<p class="l-text">The sign of $\\det(A)$ is the orientation: positive if $(\\mathbf{u}, \\mathbf{v}, \\mathbf{w})$ form a right-handed set (point your right thumb along u, index along v, middle finger along w), negative if left-handed. When the three vectors are coplanar &mdash; that is, all lying in some common 2D plane &mdash; the parallelepiped degenerates to a flat shape with no thickness, the volume is zero, and the determinant is zero. This matches property 1 exactly.</p>

<div class="calc-formula"><div class="formula-label">VOLUME FORMULA</div><div class="formula-main">$$\\text{Volume}(\\mathbf{u}, \\mathbf{v}, \\mathbf{w}) \\;=\\; |\\det(A)|$$</div><div class="formula-sub">where A is the 3&times;3 matrix whose columns are $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$. The determinant is also called the <em>scalar triple product</em> $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ in vector notation.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; VOLUME</div><div class="example-body">Find the volume of the parallelepiped spanned by $\\mathbf{u} = (1, 0, 0)$, $\\mathbf{v} = (1, 2, 0)$, $\\mathbf{w} = (1, 1, 3)$.<br><br>$A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 2 & 1 \\\\ 0 & 0 & 3 \\end{pmatrix}$. This is upper triangular, so the determinant is the product of the diagonal: $1 \\cdot 2 \\cdot 3 = 6$.<br><br>Volume = $|\\det(A)| = \\mathbf{6}$ cubic units.</div></div>

<h2 class="lesson-title">8. Common Errors and How to Avoid Them</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SARRUS SIGN ERROR</div><div class="compare-item"><strong>Mistake:</strong> Treating all six diagonals as +, or getting the sign of an uphill diagonal wrong.</div><div class="compare-item"><strong>Fix:</strong> Always draw the matrix with the first two columns repeated to the right. Trace downhill diagonals with one colour (+), uphill with another (&minus;). The arrows make the signs visible.</div></div><div class="compare-col"><div class="compare-title">COFACTOR ALTERNATING-SIGN ERROR</div><div class="compare-item"><strong>Mistake:</strong> Writing $+a\\,M_{11} + b\\,M_{12} + c\\,M_{13}$ when it should be $+a\\,M_{11} - b\\,M_{12} + c\\,M_{13}$.</div><div class="compare-item"><strong>Fix:</strong> Write the 3&times;3 chequerboard $\\begin{smallmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{smallmatrix}$ at the top of your scratch paper before you begin. The signs come from position, not from the entry.</div></div></div>

<div class="l-note"><strong>Third trap: <em>|A|</em> is not "absolute value of A".</strong> The vertical bars in $|A|$ are just notation for "the determinant of A". $|A|$ can be 0, negative, or any real number. Writing $\\left|\\det\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\right|$ and concluding "all entries are positive once we take absolute value" is double nonsense &mdash; the determinant of that matrix is $(-1)(-1) - 0 = +1$, and even if it had been negative, the notation $|A|$ does not mean "make every entry positive".</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Without computing, what is $\\det\\begin{pmatrix} 4 & 7 & 0 \\\\ 9 & 3 & 0 \\\\ 1 & 2 & 0 \\end{pmatrix}$? (Answer: zero. The third column is all zeros, so by property 1 the determinant is zero. No arithmetic needed.)</div></div>

<h2 class="lesson-title">9. Practice Problems</h2>

<p class="l-text">Eight worked exercises pulling the lesson together. Try each one yourself first, then read the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; STRAIGHT 2&times;2</div><div class="example-body"><strong>Compute</strong> $\\det\\begin{pmatrix} 5 & 3 \\\\ 2 & 4 \\end{pmatrix}$.<br><br>$ad - bc = 5 \\cdot 4 - 3 \\cdot 2 = 20 - 6 = \\mathbf{14}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; NEGATIVE ENTRIES</div><div class="example-body"><strong>Compute</strong> $\\det\\begin{pmatrix} -3 & 2 \\\\ 4 & -5 \\end{pmatrix}$.<br><br>$(-3)(-5) - 2 \\cdot 4 = 15 - 8 = \\mathbf{7}$.<br><br>Watch the signs &mdash; both diagonal entries are negative, so their product is positive.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; SINGULAR 2&times;2</div><div class="example-body"><strong>For what value of k is</strong> $\\det\\begin{pmatrix} k & 6 \\\\ 2 & 3 \\end{pmatrix} = 0$?<br><br>$3k - 12 = 0 \\implies k = \\mathbf{4}$.<br><br>At $k = 4$ the matrix $\\begin{pmatrix} 4 & 6 \\\\ 2 & 3 \\end{pmatrix}$ has its first row equal to twice the second &mdash; linear dependence, as expected.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; 3&times;3 BY SARRUS</div><div class="example-body"><strong>Compute</strong> $\\det\\begin{pmatrix} 2 & 0 & 1 \\\\ 3 & 1 & 2 \\\\ 1 & 0 & 3 \\end{pmatrix}$.<br><br>Downhill: $2 \\cdot 1 \\cdot 3 + 0 \\cdot 2 \\cdot 1 + 1 \\cdot 3 \\cdot 0 = 6 + 0 + 0 = 6$.<br>Uphill: $1 \\cdot 1 \\cdot 1 + 2 \\cdot 2 \\cdot 0 + 0 \\cdot 3 \\cdot 3 = 1 + 0 + 0 = 1$.<br>$\\det = 6 - 1 = \\mathbf{5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; 3&times;3 BY COFACTOR</div><div class="example-body"><strong>Redo Problem 4 by cofactor expansion along column 2.</strong><br><br>Column 2 entries are $(0, 1, 0)^T$. Two of them are zero, so only the middle term survives. The sign at position (2,2) is +. The minor is $\\begin{vmatrix} 2 & 1 \\\\ 1 & 3 \\end{vmatrix} = 6 - 1 = 5$.<br><br>$\\det = 0 - 1 \\cdot 5 \\cdot (-1)^{2+2}$... wait, the sign is $+$ since position (2,2) is on the diagonal: $\\det = +1 \\cdot 5 = \\mathbf{5}$. Matches Problem 4 &mdash; both methods give the same answer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; PROPERTY-BASED</div><div class="example-body"><strong>Given</strong> $\\det(A) = 4$ and $\\det(B) = -2$ for 3&times;3 matrices, find $\\det(2A^T B)$.<br><br>Step by step:<br>$\\det(2A^T B) = 2^3 \\det(A^T B)$ (property 3 with $n=3$)<br>$= 8 \\cdot \\det(A^T) \\cdot \\det(B)$ (property 4)<br>$= 8 \\cdot \\det(A) \\cdot \\det(B)$ (property 2)<br>$= 8 \\cdot 4 \\cdot (-2) = \\mathbf{-64}$.<br><br>No multiplication of actual matrices was needed.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; UPPER TRIANGULAR</div><div class="example-body"><strong>Compute</strong> $\\det\\begin{pmatrix} 3 & 5 & 7 \\\\ 0 & 2 & 4 \\\\ 0 & 0 & 6 \\end{pmatrix}$.<br><br>This is upper triangular (all entries below the diagonal are 0). For triangular matrices the determinant is the product of the diagonal: $3 \\cdot 2 \\cdot 6 = \\mathbf{36}$.<br><br>Verify with cofactor along column 1: only the top entry contributes (the other two are zero). So $\\det = 3 \\cdot \\begin{vmatrix} 2 & 4 \\\\ 0 & 6 \\end{vmatrix} = 3(12 - 0) = 36$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; AREA OF A TRIANGLE</div><div class="example-body"><strong>Find the area of the triangle with vertices $(1, 1)$, $(4, 2)$, $(2, 5)$.</strong><br><br>The area of a triangle with vertices $P_1, P_2, P_3$ equals half the magnitude of the determinant whose rows are $P_2 - P_1$ and $P_3 - P_1$:<br><br>$P_2 - P_1 = (3, 1)$, $P_3 - P_1 = (1, 4)$.<br>$\\det = 3 \\cdot 4 - 1 \\cdot 1 = 12 - 1 = 11$.<br>Area = $\\frac{1}{2} |11| = \\mathbf{5.5}$ square units.<br><br>This is a beautiful application: the 2&times;2 determinant gives the parallelogram, and half of a parallelogram is its triangle.</div></div>

<h2 class="lesson-title">10. A Last Picture: Singular vs Non-singular at a Glance</h2>

<div class="calc-graph"><div id="plot-l73-compare-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two 2&times;2 matrices and the parallelograms they generate. <span style="color:#10b981">Left (det &gt; 0)</span>: columns $(2, 1)$ and $(1, 3)$ &mdash; non-singular, area = 5. <span style="color:#ef4444">Right (det = 0)</span>: columns $(2, 1)$ and $(4, 2)$ where the second is exactly twice the first &mdash; singular, the "parallelogram" collapses to a line.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var fX=[0,2,3,1,0]; var fY=[0,1,4,3,0];
var fill={x:fX,y:fY,fill:'toself',fillcolor:'rgba(16,185,129,0.15)',mode:'lines',line:{color:'#10b981',width:2.2},name:'det = 5 (non-singular)',xaxis:'x',yaxis:'y'};
var u1={x:[0,2],y:[0,1],mode:'lines+markers',line:{color:'#10b981',width:3},marker:{size:8},showlegend:false,xaxis:'x',yaxis:'y'};
var u2={x:[0,1],y:[0,3],mode:'lines+markers',line:{color:'#10b981',width:3},marker:{size:8},showlegend:false,xaxis:'x',yaxis:'y'};
var sX=[0,2,4,0]; var sY=[0,1,2,0];
var sing={x:sX,y:sY,mode:'lines',line:{color:'#ef4444',width:2.5},name:'det = 0 (singular)',xaxis:'x2',yaxis:'y2'};
var s1={x:[0,2],y:[0,1],mode:'lines+markers',line:{color:'#ef4444',width:3},marker:{size:8},showlegend:false,xaxis:'x2',yaxis:'y2'};
var s2={x:[0,4],y:[0,2],mode:'lines+markers',line:{color:'#ef4444',width:3,dash:'dash'},marker:{size:8},showlegend:false,xaxis:'x2',yaxis:'y2'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',domain:[0,0.46],range:[-0.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},xaxis2:{title:'x',domain:[0.54,1],range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis2:{title:'y',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'x2'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-compare-en',[fill,u1,u2,sing,s1,s2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>2&times;2 determinant: $\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$ &mdash; signed area of the parallelogram spanned by the columns</li>
<li>3&times;3 determinant by Sarrus' rule: three downhill (+) and three uphill (&minus;) diagonal products, six terms total</li>
<li>3&times;3 by cofactor expansion along any row or column: $\\sum_j (-1)^{i+j} a_{ij} M_{ij}$ &mdash; chequerboard signs</li>
<li>Key properties: $\\det(A^T)=\\det(A)$, $\\det(kA)=k^n\\det(A)$, $\\det(AB)=\\det(A)\\det(B)$, row swap negates det</li>
<li>$\\det(A) = 0$ iff A is singular iff rows/columns linearly dependent iff $A^{-1}$ does not exist iff $A\\mathbf{x}=\\mathbf{b}$ lacks a unique solution</li>
<li>Geometric meaning: $|\\det|$ = area (2&times;2) or volume (3&times;3) of the parallelogram/parallelepiped spanned by the columns</li>
<li>Common errors to avoid: Sarrus sign error, missed alternating sign in cofactor, treating $|A|$ as element-wise absolute value</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Determinant, her kare matrise tek bir sayı atar &mdash; ve bu sayı, matris hakkında sorabileceğin çoğu soruyu sessizce cevaplar.</strong> Matris tersinir mi? <em>A</em>x = b sisteminin tek bir çözümü var mı? Sütunları kenar olan paralelkenarın alanı nedir? Determinant üçünü aynı anda çözer. Doğrusal cebirin en ekonomik nesnelerinden biridir: bir skaler, pek çok kullanım.</p>

<p class="l-text">Bu ders, lise düzeyinde önemli olan iki durum için determinantı geliştirir &mdash; 2&times;2 ve 3&times;3 matrisler &mdash; formülleri akılda kalıcı kılan geometrik anlamla, uzun hesapları kısaltan cebirsel özelliklerle ve det(A) = 0 ile tekil (tersinmez) matris arasındaki bağlantıyla birlikte. Hem her iki durumu genelleyen hem de üniversite doğrusal cebirine zemin hazırlayan kofaktör açılımıyla bitireceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>2&times;2 matrisin determinantını <em>ad &minus; bc</em> olarak hesaplamayı ve işaretli alan olarak okumayı</li>
<li>3&times;3 matrisin determinantını iki yöntemle hesaplamayı: Sarrus kuralı (X deseni) ve ilk satır boyunca kofaktör açılımı</li>
<li>Beş temel özelliği ifade edip uygulamayı: det(A<sup>T</sup>) = det(A), det(kA) = k<sup>n</sup>det(A), det(AB) = det(A)det(B), satır değişimi det'i işaret olarak ters çevirir, det(A) = 0 ancak ve ancak satır/sütunlar doğrusal bağımlıysa</li>
<li>det(A) = 0 ile A'nın tersinmezliği ve <em>A</em>x = b'nin tek çözümünün yokluğu arasındaki bağı kurmayı</li>
<li>|det(A)|'yı 3 boyutta sütunların oluşturduğu paralelyüzün hacmi olarak okumayı</li>
<li>Üç klasik hatayı teşhis edip kaçınmayı: Sarrus işaret hatası, kofaktör açılımında atlanan değişen işaret ve |A|'yı girdilerin mutlak değeriyle karıştırmak</li>
</ul>
</div>

<h2 class="lesson-title">1. 2&times;2 Determinantı</h2>

<div class="calc-highlight"><strong>2&times;2 matris için determinant tek bir çıkarmadır.</strong> Köşegeni çarp, ters köşegeni çarp, farklarını al. Formülün tamamı bu &mdash; bölümün geri kalanı, neden tam olarak bu kombinasyonun önemli olduğunu açıklar.</div>

<p class="l-text">Reel girdili bir 2&times;2 matris alalım:</p>

<div class="calc-formula"><div class="formula-label">TANIM &mdash; 2&times;2 DETERMİNANT</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\qquad\\Longrightarrow\\qquad \\det(A) \\;=\\; |A| \\;=\\; ad \\,-\\, bc$$</div><div class="formula-sub">İki yaygın gösterim det(A) ve |A|'dır. Dikey çubuklar mutlak değer <em>değildir</em> &mdash; det(A) pozitif, negatif veya sıfır olabilir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$A = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$ matrisinin determinantını hesapla.<br><br>$\\det(A) = 3 \\cdot 2 - 4 \\cdot 1 = 6 - 4 = \\mathbf{2}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$\\det\\begin{pmatrix} 5 & 2 \\\\ 10 & 4 \\end{pmatrix}$ değerini hesapla.<br><br>$5 \\cdot 4 - 2 \\cdot 10 = 20 - 20 = \\mathbf{0}$.<br><br>Determinant sıfır. İkinci satırın (10, 4) tam olarak birinci satırın (5, 2) iki katı olduğuna dikkat et &mdash; satırlar <em>doğrusal bağımlıdır</em>. 4. bölümde bunun tesadüf olmadığını göreceğiz.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$\\det\\begin{pmatrix} 2 & -3 \\\\ 4 & 1 \\end{pmatrix}$ değerini hesapla.<br><br>$2 \\cdot 1 - (-3) \\cdot 4 = 2 - (-12) = 2 + 12 = \\mathbf{14}$.<br><br>&minus;3'ün işaretine dikkat: formül $ad - bc$ olduğu için negatif bir sayıyı çıkarmak işlemi toplamaya çevirir.</div></div>

<h2 class="lesson-title">2. Geometrik Anlam: Paralelkenarın İşaretli Alanı</h2>

<div class="calc-highlight"><strong>2&times;2 determinantı, matrisin sütunlarının (ya da eşdeğer şekilde satırlarının) oluşturduğu paralelkenarın işaretli alanıdır.</strong> Büyüklük = alan; işaret = yönlendirme. Bu, <em>ad &minus; bc</em> formülünü akılda kalıcı kılan resimdir.</div>

<p class="l-text">$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ matrisinin iki sütununu, orijinden çıkan iki vektör olarak düşün: $\\mathbf{u} = (a, c)$ ve $\\mathbf{v} = (b, d)$. Bu iki vektör, orijinle birlikte, köşeleri $(0,0)$, $(a, c)$, $(b, d)$ ve $(a+b, c+d)$ olan bir paralelkenar tanımlar. O paralelkenarın alanı tam olarak $|ad - bc|$'dir.</p>

<div class="calc-formula"><div class="formula-label">İŞARETLİ ALAN FORMÜLÜ</div><div class="formula-main">$$\\text{Alan}(\\mathbf{u}, \\mathbf{v}) \\;=\\; |\\det(A)| \\;=\\; |ad - bc|$$</div><div class="formula-sub">Mutlak değer çubuklarını kaldırırsan <em>işaretli</em> alanı elde edersin: $\\mathbf{u}$'yu saat yönünün tersine 180&deg;'den küçük bir açıyla $\\mathbf{v}$ üzerine döndürebiliyorsan pozitif, aksi halde negatif.</div></div>

<p class="l-text">İşaret, yönlendirme bilgisini taşır. Sütun vektörleri standart CCW sırasındaysa (ilk sütundan ikinciye saat yönünün tersine kısa yoldan gidebiliyorsan), determinant pozitiftir. CW sırasındalarsa negatiftir. İki sütunu takas etmek yönlendirmeyi ters çevirir ve dolayısıyla determinantı işaret olarak negatifler. 1. örnekle karşılaştır: sütunlar $(3, 1)$ ve $(4, 2)$ idi. Onları takas et, determinant $4 \\cdot 1 - 3 \\cdot 2 = 4 - 6 = -2$ olur &mdash; aynı büyüklük, ters işaret.</p>

<div class="calc-graph"><div id="plot-l73-parallelogram-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $A = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$ matrisinin sütun vektörlerinin oluşturduğu paralelkenar. Köşeler (0,0), (3,1), (4,2) ve (7,3). Gölgeli bölgenin alanı $|3 \\cdot 2 - 4 \\cdot 1| = 2$ &mdash; tam olarak hesapladığımız determinant.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pX=[0,3,7,4,0]; var pY=[0,1,3,2,0];
var fill={x:pX,y:pY,fill:'toself',fillcolor:'rgba(59,130,246,0.18)',mode:'lines',line:{color:'#3b82f6',width:2.2},name:'paralelkenar (alan = 2)'};
var u={x:[0,3],y:[0,1],mode:'lines+markers',name:'u = (3,1)',line:{color:'#10b981',width:3},marker:{size:8}};
var v={x:[0,4],y:[0,2],mode:'lines+markers',name:'v = (4,2)',line:{color:'#f59e0b',width:3},marker:{size:8}};
var ax={x:[-0.5,8],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ay={x:[0,0],y:[-0.5,3.5],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var lbl={x:[3.0,4.2,7.1,0.1],y:[0.65,2.35,3.25,-0.25],mode:'text',text:['(3,1)','(4,2)','(7,3)','(0,0)'],textfont:{color:'#e8e8e8',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.6,8.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-0.6,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-parallelogram-tr',[ax,ay,fill,u,v,lbl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">2&times;2 matrisin her iki sütunu da aynı yönü gösteriyorsa (biri diğerinin skaler katıdır), paralelkenar sıfır alanlı bir doğru parçasına çöker. Determinant bu yüzden sıfır olmak zorundadır. Bu, sonraki bölümdeki doğrusal-bağımlılık özelliğinin geometrik nedenidir.</div></div>

<h2 class="lesson-title">3. 3&times;3 Determinantı: Sarrus Kuralı</h2>

<div class="calc-highlight"><strong>3&times;3 matris için Sarrus kuralı, determinantı işaretleri değişen altı çarpıma çevirir.</strong> Hile, matrisi çizip sonra üç "iniş" köşegenini ve üç "çıkış" köşegenini izlemektir &mdash; iniş köşegenleri artı işareti, çıkış köşegenleri eksi işareti alır.</div>

<p class="l-text">Şunu kabul edelim:</p>

<div class="calc-formula"><div class="formula-label">3&times;3 MATRİS</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$$</div></div>

<p class="l-text">Sarrus kuralı şunu söyler: matrisi yaz, sonra ilk iki sütunu matrisin sağına kopyala &mdash; böylece 3&times;5'lik bir dizi elde edersin. Şimdi üç "iniş" köşegenini izle (sol-üstten sağ-alta) &mdash; her köşegenin üç girdisini çarp ve hepsini topla. Sonra üç "çıkış" köşegenini izle (sağ-üstten sol-alta) ve onları çıkar.</p>

<div class="calc-formula"><div class="formula-label">SARRUS KURALI</div><div class="formula-main">$$\\det(A) \\;=\\; aei \\,+\\, bfg \\,+\\, cdh \\,-\\, ceg \\,-\\, afh \\,-\\, bdi$$</div><div class="formula-sub">Üç pozitif çarpım (iniş köşegenleri) eksi üç negatif çarpım (çıkış köşegenleri). Toplam altı terim.</div></div>

<div class="calc-graph"><div id="plot-l73-sarrus-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Sarrus kuralının X deseni. Yeşil oklar üç iniş köşegenini izler (+aei, +bfg, +cdh); kırmızı oklar üç çıkış köşegenini izler (&minus;ceg, &minus;afh, &minus;bdi). Altı köşegenin hepsinin sığması için ilk iki sütun sağda tekrar edilir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var letters=['a','b','c','a','b','d','e','f','d','e','g','h','i','g','h'];
var xs=[0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
var ys=[2,2,2,2,2,1,1,1,1,1,0,0,0,0,0];
var ents={x:xs,y:ys,mode:'text',text:letters,textfont:{color:'#e8e8e8',size:22},name:'girdiler',showlegend:false};
var box1={x:[-0.4,2.4,2.4,-0.4,-0.4],y:[-0.4,-0.4,2.4,2.4,-0.4],mode:'lines',line:{color:'rgba(255,255,255,0.4)',width:1.5},name:'matris',showlegend:false};
var box2={x:[2.6,4.4,4.4,2.6,2.6],y:[-0.4,-0.4,2.4,2.4,-0.4],mode:'lines',line:{color:'rgba(255,255,255,0.2)',width:1,dash:'dot'},name:'kopyalanan sütunlar',showlegend:false};
var d1={x:[0,2],y:[2,0],mode:'lines',line:{color:'#10b981',width:2.5},name:'+aei'};
var d2={x:[1,3],y:[2,0],mode:'lines',line:{color:'#10b981',width:2.5,dash:'dash'},name:'+bfg'};
var d3={x:[2,4],y:[2,0],mode:'lines',line:{color:'#10b981',width:2.5,dash:'dot'},name:'+cdh'};
var u1={x:[2,0],y:[2,0],mode:'lines',line:{color:'#ef4444',width:2.5},name:'−ceg'};
var u2={x:[3,1],y:[2,0],mode:'lines',line:{color:'#ef4444',width:2.5,dash:'dash'},name:'−afh'};
var u3={x:[4,2],y:[2,0],mode:'lines',line:{color:'#ef4444',width:2.5,dash:'dot'},name:'−bdi'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,4.8],showgrid:false,zeroline:false,showticklabels:false},yaxis:{range:[-0.8,2.8],showgrid:false,zeroline:false,showticklabels:false,scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:30,l:30},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-sarrus-tr',[box1,box2,d1,d2,d3,u1,u2,u3,ents],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; SARRUS</div><div class="example-body">$\\det\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 4 & 5 \\\\ 1 & 0 & 6 \\end{pmatrix}$ değerini Sarrus kuralıyla hesapla.<br><br>İniş köşegenleri (+):<br>$\\quad aei = 1 \\cdot 4 \\cdot 6 = 24$<br>$\\quad bfg = 2 \\cdot 5 \\cdot 1 = 10$<br>$\\quad cdh = 3 \\cdot 0 \\cdot 0 = 0$<br>Artı terimlerin toplamı: $24 + 10 + 0 = 34$.<br><br>Çıkış köşegenleri (&minus;):<br>$\\quad ceg = 3 \\cdot 4 \\cdot 1 = 12$<br>$\\quad afh = 1 \\cdot 5 \\cdot 0 = 0$<br>$\\quad bdi = 2 \\cdot 0 \\cdot 6 = 0$<br>Eksi terimlerin toplamı: $12 + 0 + 0 = 12$.<br><br>Determinant: $34 - 12 = \\mathbf{22}$.</div></div>

<div class="l-note"><strong>Önemli uyarı:</strong> Sarrus kuralı <em>sadece</em> 3&times;3 matrisler için işler. 4&times;4 ya da daha büyük matrisler için eşdeğer bir X-deseni yoktur. Onlar için kofaktör açılımını (6. bölüm) ya da satır indirgemesini kullanırız.</div>

<h2 class="lesson-title">4. Beş Temel Özellik</h2>

<div class="calc-highlight"><strong>Beş kısa kural, çoğu determinant hesabını kaba-kuvvet açılım yerine tek satırlık argümanlara çevirir.</strong> Şimdi ezberle &mdash; buradan sonraki her alıştırmada karşına çıkacaklar.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özellik 1 &mdash; Tekil ancak ve ancak det = 0</div><div class="card-body">$\\det(A) = 0$ ancak ve ancak A'nın satırları (eşdeğer şekilde sütunları) doğrusal bağımlıysa. Eşdeğer olarak, A tersinmezdir (tekil).</div></div>
<div class="calc-card"><div class="card-title">Özellik 2 &mdash; Transpoz</div><div class="card-body">$\\det(A^T) = \\det(A)$. Bir matrisin transpozunu almak determinantını değiştirmez. Yani satırlar için söylenen her özellik sütunlar için de aynen geçerlidir.</div></div>
<div class="calc-card"><div class="card-title">Özellik 3 &mdash; Skalerle çarpma</div><div class="card-body">n&times;n bir matris için $\\det(kA) = k^n \\det(A)$. Her girdiyi k ile çarpmak determinantı sadece k ile değil, $k^n$ ile çarpar.</div></div>
<div class="calc-card"><div class="card-title">Özellik 4 &mdash; Çarpım kuralı</div><div class="card-body">Aynı boyutta herhangi iki kare matris için $\\det(AB) = \\det(A) \\cdot \\det(B)$. Bir çarpımın determinantı determinantların çarpımıdır &mdash; cebirin en kullanışlı özdeşliklerinden biri.</div></div>
<div class="calc-card"><div class="card-title">Özellik 5 &mdash; Satır değişimi</div><div class="card-body">A'nın herhangi iki satırını (ya da iki sütununu) takas et, determinant işaret değiştirir: $\\det(A') = -\\det(A)$. Üst üste iki değişim böylece orijinal determinantı geri getirir.</div></div>
</div>

<p class="l-text"><strong>İki yararlı sonuç daha</strong> (yukarıdaki beşten kanıtlanabilir):</p>

<ul class="l-text" style="line-height:1.7">
<li>A'nın hepsi sıfır olan bir satırı (ya da sütunu) varsa, $\\det(A) = 0$.</li>
<li>A'nın iki satırı (ya da sütunu) özdeşse, $\\det(A) = 0$. (Takas et: $\\det$ negatifleniyor ama matris değişmiyor, dolayısıyla $\\det = -\\det$, yani $\\det = 0$.)</li>
<li>Bir satırın bir katını başka bir satıra eklemek determinantı değiştirmez. (Büyük determinantları üst üçgensel forma indirgerken bunu kullanırız; üçgensel matriste determinant sadece köşegen girdilerinin çarpımıdır.)</li>
<li>Köşegen ya da üçgensel bir matris için $\\det(A)$, köşegen girdilerinin çarpımıdır.</li>
</ul>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; ÖZELLİK 3</div><div class="example-body">A 3&times;3 ve $\\det(A) = 5$ ise, $\\det(2A)$ kaçtır?<br><br>$n = 3$ ile özellik 3'ten: $\\det(2A) = 2^3 \\det(A) = 8 \\cdot 5 = \\mathbf{40}$.<br><br>Yaygın hata: $\\det(2A) = 2 \\det(A) = 10$ yazmak. Yanlış &mdash; skaler dışarı $k^n$ olarak çıkar, $k$ olarak değil, çünkü $n$ satırın her birini k ile çarpıyoruz.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; ÖZELLİK 4</div><div class="example-body">$\\det(A) = 3$ ve $\\det(B) = -2$ ise, $\\det(AB)$ kaçtır?<br><br>Çarpım kuralından: $\\det(AB) = \\det(A) \\cdot \\det(B) = 3 \\cdot (-2) = \\mathbf{-6}$.<br><br>$AB$ matrisini hiç hesaplamamız gerekmediğine dikkat. Çarpım kuralının tipik kullanımı budur: karmaşık bir çarpımın determinantını iki basit determinantın fiyatına bul.</div></div>

<h2 class="lesson-title">5. det(A) = 0 Olduğunda: Tekil Matrisler</h2>

<div class="calc-highlight"><strong>Determinantı sıfır olan bir kare matrise <em>tekil</em>, sıfır olmayana <em>tekil olmayan</em> (ya da tersinir) denir.</strong> Tek bir $\\det(A) = 0$ koşulu üç farklı kötü davranışı bir araya getirir: satırların doğrusal bağımlılığı, $A^{-1}$'in yokluğu ve $A\\mathbf{x} = \\mathbf{b}$'nin tek çözümünün olmaması.</div>

<p class="l-text">Parmaklarının ucunda olması gereken eşdeğer ifadeler şunlar. n&times;n bir A matrisi için aşağıdakilerin hepsi eşdeğerdir &mdash; herhangi biri doğruysa hepsi doğrudur:</p>

<ul class="l-text" style="line-height:1.7">
<li>$\\det(A) = 0$.</li>
<li>A'nın satırları doğrusal bağımlıdır (bir satır diğerlerinin bir kombinasyonudur). Aynı şey sütunlar için de.</li>
<li>A tersinir <strong>değildir</strong>. $A A^{-1} = I$ olacak şekilde bir $A^{-1}$ matrisi yoktur.</li>
<li>$A\\mathbf{x} = \\mathbf{b}$ sisteminin sağ tarafa göre ya hiç çözümü yoktur ya da sonsuz çoktur &mdash; hiçbir zaman tam olarak bir tane değildir.</li>
<li>Homojen sistem $A\\mathbf{x} = \\mathbf{0}$'ın sıfır olmayan bir çözümü vardır.</li>
<li>A'nın sütunları, boyutu n'den küçük bir alt uzay gerer (rank&lt;n).</li>
</ul>

<div class="calc-formula"><div class="formula-label">2&times;2 TERSİ (det &ne; 0 İKEN)</div><div class="formula-main">$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\;\\;\\Longrightarrow\\;\\; A^{-1} = \\frac{1}{ad-bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$</div><div class="formula-sub">Başta yer alan $1/\\det(A)$ çarpanı, $\\det(A) = 0$ olunca tersin neden öldüğünü hemen açıklar: sıfıra bölme tanımsızdır.</div></div>

<div class="calc-graph"><div id="plot-l73-singular-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki 3&times;3 sütun yapılandırması. <span style="color:#10b981">Yeşil</span>: tekil olmayan bir matris &mdash; üç sütun vektörü tam bir 3B hacim (paralelyüz) gerer. <span style="color:#ef4444">Kırmızı</span>: tekil bir matris &mdash; üç sütun vektörü tek bir düzlemde yatar, dolayısıyla "hacim" sıfıra çöker. Determinant = bu paralelyüzün işaretli hacmi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nsX=[0,1,0,1,0,0,1,1,0,0,1,1,0,1,1,1];
var nsY=[0,0,1,1,0,0,0,1,1,0,1,1,0,1,1,1];
var nsZ=[0,0,0,0,1,0,0,0,0,1,1,0,1,1,0,1];
var ns={type:'scatter3d',x:nsX,y:nsY,z:nsZ,mode:'lines',line:{color:'#10b981',width:5},name:'tekil değil (det ≠ 0)'};
var sX=[0,1,0,0.7,0,2,0,0.7]; var sY=[0,0,1,1,0,0,2,1.4]; var sZ=[0,0,0,0,0,0,0,0];
var sing={type:'scatter3d',x:sX,y:sY,z:sZ,mode:'lines',line:{color:'#ef4444',width:5},name:'tekil (det = 0)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a',color:'#e8e8e8'}},margin:{t:30,r:10,b:10,l:10},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-singular-tr',[ns,sing],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; TEKİLİ TESPİT ETME</div><div class="example-body">$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 0 & 1 & 1 \\end{pmatrix}$ tersinir mi?<br><br>1. ve 2. satıra bak: $(2,4,6) = 2 \\cdot (1,2,3)$. İkinci satır birincinin iki katı &mdash; doğrusal bağımlılar. Özellik 1'den, $\\det(A) = 0$, dolayısıyla A <strong>tekildir</strong> (tersinir değil).<br><br>Sarrus ile de doğrulayabilirsin:<br>$+1\\cdot4\\cdot1 + 2\\cdot6\\cdot0 + 3\\cdot2\\cdot1 - 3\\cdot4\\cdot0 - 1\\cdot6\\cdot1 - 2\\cdot2\\cdot1$<br>$= 4 + 0 + 6 - 0 - 6 - 4 = 0$. Onaylandı.</div></div>

<h2 class="lesson-title">6. Kofaktör Açılımı</h2>

<div class="calc-highlight"><strong>Kofaktör açılımı evrensel reçetedir: sadece 3&times;3 için değil, her boyut matris için işler.</strong> 3&times;3 için ilk satır boyunca açarsın ve işaretleri değişen üç küçük (2&times;2) determinant elde edersin. 4&times;4 için dört 3&times;3 alt-determinanta indirgersin. Ve böyle devam eder.</div>

<p class="l-text">3&times;3 matrisi yeniden alalım:</p>

<div class="calc-formula"><div class="formula-label">KURULUM</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$$</div></div>

<p class="l-text">İlk satırın her girdisine bir 2&times;2 <em>minör</em> ekle &mdash; bu, o girdinin yaşadığı satır ve sütunu silerek elde edilen 2&times;2 matristir. Sonra işaretleri sol-üstte + ile başlayan bir dama deseninde ekle:</p>

<div class="calc-formula"><div class="formula-label">İŞARET TABLOSU &mdash; İLK SATIR</div><div class="formula-main">$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$</div><div class="formula-sub">$(i, j)$ konumu $(-1)^{i+j}$ işareti alır. Sol üst +, iki yönde de değişiyor.</div></div>

<div class="calc-formula"><div class="formula-label">SATIR 1 BOYUNCA KOFAKTÖR AÇILIMI</div><div class="formula-main">$$\\det(A) \\;=\\; a \\begin{vmatrix} e & f \\\\ h & i \\end{vmatrix} \\,-\\, b \\begin{vmatrix} d & f \\\\ g & i \\end{vmatrix} \\,+\\, c \\begin{vmatrix} d & e \\\\ g & h \\end{vmatrix}$$</div><div class="formula-sub">Artı, eksi, artı &mdash; değişen işaretler çok önemli. Her 2&times;2 minörü 1. bölümdeki gibi $ad - bc$ olarak hesapla.</div></div>

<p class="l-text">Bir kez daha açarsak, bu tam olarak Sarrus kuralıyla aynıdır:</p>

<p class="l-text">$\\det(A) = a(ei - fh) - b(di - fg) + c(dh - eg) = aei - afh - bdi + bfg + cdh - ceg$ &mdash; altı terimi yeniden sırala ve 3. bölümdeki Sarrus açılımını elde edersin.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; KOFAKTÖR</div><div class="example-body">$\\det\\begin{pmatrix} 2 & 1 & 3 \\\\ 4 & 0 & 1 \\\\ 5 & 2 & 6 \\end{pmatrix}$ değerini ilk satır boyunca kofaktör açılımıyla hesapla.<br><br>$= 2 \\begin{vmatrix} 0 & 1 \\\\ 2 & 6 \\end{vmatrix} - 1 \\begin{vmatrix} 4 & 1 \\\\ 5 & 6 \\end{vmatrix} + 3 \\begin{vmatrix} 4 & 0 \\\\ 5 & 2 \\end{vmatrix}$<br><br>$= 2(0 \\cdot 6 - 1 \\cdot 2) - 1(4 \\cdot 6 - 1 \\cdot 5) + 3(4 \\cdot 2 - 0 \\cdot 5)$<br><br>$= 2(-2) - 1(19) + 3(8) = -4 - 19 + 24 = \\mathbf{1}$.</div></div>

<div class="l-note"><strong>İpucu:</strong> ilk satırda sıfırlar varsa açılım hızlanır &mdash; sıfır bir girdi, kendi 2&times;2 minörünü öldürür. Yani açılım için herhangi bir satır ya da sütun seçebiliyorsan, en çok sıfırı olanı seç. (Sadece 1. satır değil, herhangi bir satır ya da sütun boyunca açabilirsin; dama deseni işaret kuralı yine geçerlidir.)</div>

<h2 class="lesson-title">7. 3 Boyutta Geometrik Anlam: Paralelyüzün Hacmi</h2>

<div class="calc-highlight"><strong>3&times;3 matris için $|\\det(A)|$, sütun vektörlerinin 3 boyutta gerdiği paralelyüzün hacmidir.</strong> 2&times;2 sonucu doğrudan genelleşir: 2B alan, 3B hacme dönüşür.</div>

<p class="l-text">Orijinden çıkan üç sütun vektörünü al: $\\mathbf{u} = (a, d, g)$, $\\mathbf{v} = (b, e, h)$, $\\mathbf{w} = (c, f, i)$. Orijinle birlikte bir paralelyüz tanımlarlar &mdash; sekiz köşesi olan "eğri bir tuğla". O tuğlanın hacmi tam olarak $|\\det(A)|$'dir &mdash; burada A'nın sütunları bu üç vektördür.</p>

<p class="l-text">$\\det(A)$'nın işareti yönlendirmedir: $(\\mathbf{u}, \\mathbf{v}, \\mathbf{w})$ sağ-el bir takım oluşturuyorsa pozitif (sağ elin baş parmağını u boyunca, işaret parmağını v boyunca, orta parmağını w boyunca konumla), sol-el ise negatif. Üç vektör eş düzlemli olduğunda &mdash; yani hepsi ortak bir 2B düzlemde yatıyorsa &mdash; paralelyüz kalınlığı olmayan düz bir şekle dejenere olur, hacim sıfırdır ve determinant sıfırdır. Bu, özellik 1 ile tam olarak örtüşür.</p>

<div class="calc-formula"><div class="formula-label">HACİM FORMÜLÜ</div><div class="formula-main">$$\\text{Hacim}(\\mathbf{u}, \\mathbf{v}, \\mathbf{w}) \\;=\\; |\\det(A)|$$</div><div class="formula-sub">A, sütunları $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ olan 3&times;3 matristir. Vektör notasyonunda determinant aynı zamanda <em>karma çarpım</em> $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ olarak da adlandırılır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; HACİM</div><div class="example-body">$\\mathbf{u} = (1, 0, 0)$, $\\mathbf{v} = (1, 2, 0)$, $\\mathbf{w} = (1, 1, 3)$ tarafından gerilen paralelyüzün hacmini bul.<br><br>$A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 2 & 1 \\\\ 0 & 0 & 3 \\end{pmatrix}$. Bu üst üçgensel, dolayısıyla determinant köşegenin çarpımıdır: $1 \\cdot 2 \\cdot 3 = 6$.<br><br>Hacim = $|\\det(A)| = \\mathbf{6}$ birim küp.</div></div>

<h2 class="lesson-title">8. Yaygın Hatalar ve Nasıl Kaçınılır</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SARRUS İŞARET HATASI</div><div class="compare-item"><strong>Hata:</strong> Altı köşegenin hepsini + olarak işlemek ya da bir çıkış köşegeninin işaretini yanlış yapmak.</div><div class="compare-item"><strong>Çözüm:</strong> Matrisi her zaman ilk iki sütun sağda tekrar edilmiş olarak çiz. İniş köşegenlerini bir renkle (+), çıkış köşegenlerini başka bir renkle (&minus;) izle. Oklar işaretleri görünür kılar.</div></div><div class="compare-col"><div class="compare-title">KOFAKTÖR DEĞİŞEN-İŞARET HATASI</div><div class="compare-item"><strong>Hata:</strong> $+a\\,M_{11} - b\\,M_{12} + c\\,M_{13}$ olması gerekirken $+a\\,M_{11} + b\\,M_{12} + c\\,M_{13}$ yazmak.</div><div class="compare-item"><strong>Çözüm:</strong> Başlamadan önce müsvedde kâğıdının başına 3&times;3 dama tahtasını $\\begin{smallmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{smallmatrix}$ yaz. İşaretler girdiden değil, konumdan gelir.</div></div></div>

<div class="l-note"><strong>Üçüncü tuzak: <em>|A|</em> "A'nın mutlak değeri" değildir.</strong> $|A|$'daki dikey çubuklar sadece "A'nın determinantı" için bir gösterimdir. $|A|$ sıfır, negatif ya da herhangi bir reel sayı olabilir. $\\left|\\det\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\right|$ yazıp "mutlak değer alınca tüm girdiler pozitif olur" sonucuna varmak çifte saçmalıktır &mdash; o matrisin determinantı zaten $(-1)(-1) - 0 = +1$'dir ve negatif olsaydı bile, $|A|$ gösterimi "her girdiyi pozitif yap" anlamına gelmez.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Hesaplamadan, $\\det\\begin{pmatrix} 4 & 7 & 0 \\\\ 9 & 3 & 0 \\\\ 1 & 2 & 0 \\end{pmatrix}$ kaçtır? (Cevap: sıfır. Üçüncü sütun tamamen sıfır, dolayısıyla özellik 1'den determinant sıfırdır. Aritmetik gerekmez.)</div></div>

<h2 class="lesson-title">9. Alıştırma Problemleri</h2>

<p class="l-text">Dersi bir araya getiren sekiz çözümlü alıştırma. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; DOĞRUDAN 2&times;2</div><div class="example-body"><strong>Hesapla:</strong> $\\det\\begin{pmatrix} 5 & 3 \\\\ 2 & 4 \\end{pmatrix}$.<br><br>$ad - bc = 5 \\cdot 4 - 3 \\cdot 2 = 20 - 6 = \\mathbf{14}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; NEGATİF GİRDİLER</div><div class="example-body"><strong>Hesapla:</strong> $\\det\\begin{pmatrix} -3 & 2 \\\\ 4 & -5 \\end{pmatrix}$.<br><br>$(-3)(-5) - 2 \\cdot 4 = 15 - 8 = \\mathbf{7}$.<br><br>İşaretlere dikkat &mdash; köşegen girdilerin ikisi de negatif, dolayısıyla çarpımları pozitif.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; TEKİL 2&times;2</div><div class="example-body"><strong>$\\det\\begin{pmatrix} k & 6 \\\\ 2 & 3 \\end{pmatrix} = 0$ olacak k değeri nedir?</strong><br><br>$3k - 12 = 0 \\implies k = \\mathbf{4}$.<br><br>$k = 4$'te $\\begin{pmatrix} 4 & 6 \\\\ 2 & 3 \\end{pmatrix}$ matrisinin ilk satırı ikincinin tam iki katıdır &mdash; beklediğimiz gibi doğrusal bağımlılık.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SARRUS İLE 3&times;3</div><div class="example-body"><strong>Hesapla:</strong> $\\det\\begin{pmatrix} 2 & 0 & 1 \\\\ 3 & 1 & 2 \\\\ 1 & 0 & 3 \\end{pmatrix}$.<br><br>İniş: $2 \\cdot 1 \\cdot 3 + 0 \\cdot 2 \\cdot 1 + 1 \\cdot 3 \\cdot 0 = 6 + 0 + 0 = 6$.<br>Çıkış: $1 \\cdot 1 \\cdot 1 + 2 \\cdot 2 \\cdot 0 + 0 \\cdot 3 \\cdot 3 = 1 + 0 + 0 = 1$.<br>$\\det = 6 - 1 = \\mathbf{5}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; KOFAKTÖR İLE 3&times;3</div><div class="example-body"><strong>4. Problemi 2. sütun boyunca kofaktör açılımıyla tekrarla.</strong><br><br>2. sütun girdileri $(0, 1, 0)^T$. İkisi sıfır olduğu için sadece ortadaki terim hayatta kalır. (2,2) konumundaki işaret +'dır (köşegende). Minör $\\begin{vmatrix} 2 & 1 \\\\ 1 & 3 \\end{vmatrix} = 6 - 1 = 5$.<br><br>$\\det = +1 \\cdot 5 = \\mathbf{5}$. 4. Problemle uyumlu &mdash; iki yöntem de aynı cevabı verir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; ÖZELLİK TABANLI</div><div class="example-body"><strong>3&times;3 matrisler için</strong> $\\det(A) = 4$ ve $\\det(B) = -2$ veriliyor; $\\det(2A^T B)$'yi bul.<br><br>Adım adım:<br>$\\det(2A^T B) = 2^3 \\det(A^T B)$ ($n=3$ ile özellik 3)<br>$= 8 \\cdot \\det(A^T) \\cdot \\det(B)$ (özellik 4)<br>$= 8 \\cdot \\det(A) \\cdot \\det(B)$ (özellik 2)<br>$= 8 \\cdot 4 \\cdot (-2) = \\mathbf{-64}$.<br><br>Gerçek matrislerin çarpımına hiç gerek kalmadı.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; ÜST ÜÇGENSEL</div><div class="example-body"><strong>Hesapla:</strong> $\\det\\begin{pmatrix} 3 & 5 & 7 \\\\ 0 & 2 & 4 \\\\ 0 & 0 & 6 \\end{pmatrix}$.<br><br>Bu üst üçgensel (köşegenin altındaki tüm girdiler 0). Üçgensel matrisler için determinant köşegenin çarpımıdır: $3 \\cdot 2 \\cdot 6 = \\mathbf{36}$.<br><br>1. sütun boyunca kofaktör ile doğrula: sadece üstteki girdi katkıda bulunur (diğer ikisi sıfır). Yani $\\det = 3 \\cdot \\begin{vmatrix} 2 & 4 \\\\ 0 & 6 \\end{vmatrix} = 3(12 - 0) = 36$. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; ÜÇGENİN ALANI</div><div class="example-body"><strong>Köşeleri $(1, 1)$, $(4, 2)$, $(2, 5)$ olan üçgenin alanını bul.</strong><br><br>Köşeleri $P_1, P_2, P_3$ olan üçgenin alanı, satırları $P_2 - P_1$ ve $P_3 - P_1$ olan determinantın büyüklüğünün yarısına eşittir:<br><br>$P_2 - P_1 = (3, 1)$, $P_3 - P_1 = (1, 4)$.<br>$\\det = 3 \\cdot 4 - 1 \\cdot 1 = 12 - 1 = 11$.<br>Alan = $\\frac{1}{2} |11| = \\mathbf{5{,}5}$ birim kare.<br><br>Bu güzel bir uygulamadır: 2&times;2 determinant paralelkenarı verir ve paralelkenarın yarısı onun üçgenidir.</div></div>

<h2 class="lesson-title">10. Son Bir Resim: Tekil ile Tekil Olmayan, Tek Bakışta</h2>

<div class="calc-graph"><div id="plot-l73-compare-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki 2&times;2 matris ve onların ürettiği paralelkenarlar. <span style="color:#10b981">Sol (det &gt; 0)</span>: sütunlar $(2, 1)$ ve $(1, 3)$ &mdash; tekil değil, alan = 5. <span style="color:#ef4444">Sağ (det = 0)</span>: sütunlar $(2, 1)$ ve $(4, 2)$ &mdash; ikincisi birincinin tam iki katı, dolayısıyla tekil, "paralelkenar" bir doğruya çöker.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var fX=[0,2,3,1,0]; var fY=[0,1,4,3,0];
var fill={x:fX,y:fY,fill:'toself',fillcolor:'rgba(16,185,129,0.15)',mode:'lines',line:{color:'#10b981',width:2.2},name:'det = 5 (tekil değil)',xaxis:'x',yaxis:'y'};
var u1={x:[0,2],y:[0,1],mode:'lines+markers',line:{color:'#10b981',width:3},marker:{size:8},showlegend:false,xaxis:'x',yaxis:'y'};
var u2={x:[0,1],y:[0,3],mode:'lines+markers',line:{color:'#10b981',width:3},marker:{size:8},showlegend:false,xaxis:'x',yaxis:'y'};
var sX=[0,2,4,0]; var sY=[0,1,2,0];
var sing={x:sX,y:sY,mode:'lines',line:{color:'#ef4444',width:2.5},name:'det = 0 (tekil)',xaxis:'x2',yaxis:'y2'};
var s1={x:[0,2],y:[0,1],mode:'lines+markers',line:{color:'#ef4444',width:3},marker:{size:8},showlegend:false,xaxis:'x2',yaxis:'y2'};
var s2={x:[0,4],y:[0,2],mode:'lines+markers',line:{color:'#ef4444',width:3,dash:'dash'},marker:{size:8},showlegend:false,xaxis:'x2',yaxis:'y2'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',domain:[0,0.46],range:[-0.5,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},xaxis2:{title:'x',domain:[0.54,1],range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis2:{title:'y',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'x2'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l73-compare-tr',[fill,u1,u2,sing,s1,s2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>2&times;2 determinant: $\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$ &mdash; sütunların gerdiği paralelkenarın işaretli alanı</li>
<li>Sarrus kuralıyla 3&times;3 determinant: üç iniş (+) ve üç çıkış (&minus;) köşegen çarpımı, toplam altı terim</li>
<li>Herhangi bir satır ya da sütun boyunca kofaktör açılımıyla 3&times;3: $\\sum_j (-1)^{i+j} a_{ij} M_{ij}$ &mdash; dama deseni işaretleri</li>
<li>Anahtar özellikler: $\\det(A^T)=\\det(A)$, $\\det(kA)=k^n\\det(A)$, $\\det(AB)=\\det(A)\\det(B)$, satır değişimi det'i negatifler</li>
<li>$\\det(A) = 0$ ancak ve ancak A tekildir ancak ve ancak satırlar/sütunlar doğrusal bağımlıdır ancak ve ancak $A^{-1}$ yoktur ancak ve ancak $A\\mathbf{x}=\\mathbf{b}$'nin tek çözümü yoktur</li>
<li>Geometrik anlam: $|\\det|$ = sütunların gerdiği paralelkenarın/paralelyüzün alanı (2&times;2) ya da hacmi (3&times;3)</li>
<li>Kaçınılması gereken yaygın hatalar: Sarrus işaret hatası, kofaktör açılımında atlanan değişen işaret, $|A|$'yı eleman bazlı mutlak değer olarak ele almak</li>
</ul>
</div>`
};
