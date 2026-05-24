window.LINALG_L3 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text"><strong>A system of linear equations is the central problem of linear algebra.</strong> Given a coefficient matrix $A$ and a right-hand side $\\mathbf{b}$, we ask: which vectors $\\mathbf{x}$ satisfy $A\\mathbf{x} = \\mathbf{b}$? The answer is always one of three things — exactly one $\\mathbf{x}$, infinitely many $\\mathbf{x}$, or no $\\mathbf{x}$ at all — and the same handful of techniques (elimination, echelon forms, rank) tells us which case we are in and produces the solution set explicitly. Every other topic in this course (eigenvalues, orthogonality, SVD) builds on this foundation.</p>

<p class="l-text">In this lesson we develop the classical machinery: the geometry of two planes meeting in a line, augmented matrices, Gaussian elimination with pivoting, reduced row echelon form (RREF), the rank theorem, the four fundamental subspaces, and the $LU$ decomposition that factors elimination into a triangular product. Every algorithm is illustrated on a small worked $3 \\times 3$ system, and the lesson closes with a set of classical exercises.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Translate a system of linear equations into the matrix equation $A\\mathbf{x} = \\mathbf{b}$ and an augmented matrix $[A \\mid \\mathbf{b}]$</li>
<li>Run Gaussian elimination with partial pivoting on a $3 \\times 3$ system and decide whether the system has a unique, infinite, or no solution</li>
<li>Reduce a matrix to row echelon form (REF) and then to reduced row echelon form (RREF), and read off the solution directly</li>
<li>Apply the Rouché–Capelli theorem $\\mathrm{rank}(A) = \\mathrm{rank}([A \\mid \\mathbf{b}])$ to test consistency</li>
<li>Identify the four fundamental subspaces — column space, null space, row space, left null space — and verify the rank–nullity theorem $\\mathrm{rank}(A) + \\dim N(A) = n$</li>
<li>Compute an $LU$ factorisation $A = LU$ from the elimination multipliers and use it to solve $A\\mathbf{x} = \\mathbf{b}$ by forward and back substitution</li>
</ul>
</div>

<h2 class="lesson-title">1. Systems of Linear Equations</h2>

<p class="l-text">A <strong>linear equation</strong> in the unknowns $x_1, x_2, \\ldots, x_n$ is any equation of the form $a_1 x_1 + a_2 x_2 + \\cdots + a_n x_n = b$, where the coefficients $a_i$ and the constant $b$ are fixed real numbers. "Linear" means the unknowns appear only to the first power, with no products $x_i x_j$, no powers $x_i^2$, and no transcendental functions $\\sin x_i$ or $e^{x_i}$. A <strong>system of linear equations</strong> is a finite list of such equations that must all hold simultaneously.</p>

<div class="calc-formula"><div class="formula-label">A SYSTEM OF $m$ EQUATIONS IN $n$ UNKNOWNS</div><div class="formula-main">$$\\begin{cases} a_{11} x_1 + a_{12} x_2 + \\cdots + a_{1n} x_n = b_1 \\\\ a_{21} x_1 + a_{22} x_2 + \\cdots + a_{2n} x_n = b_2 \\\\ \\quad \\vdots \\\\ a_{m1} x_1 + a_{m2} x_2 + \\cdots + a_{mn} x_n = b_m \\end{cases}$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coefficient $a_{ij}$</div><div class="card-body">The known multiplier of unknown $x_j$ in equation $i$. The $a_{ij}$ assemble into the $m \\times n$ coefficient matrix $A$.</div></div>
<div class="calc-card"><div class="card-title">Unknown $x_j$</div><div class="card-body">The $n$ quantities we solve for. They assemble into the column vector $\\mathbf{x} \\in \\mathbb{R}^n$.</div></div>
<div class="calc-card"><div class="card-title">Constant $b_i$</div><div class="card-body">The right-hand side of equation $i$. The $b_i$ assemble into $\\mathbf{b} \\in \\mathbb{R}^m$.</div></div>
<div class="calc-card"><div class="card-title">Solution</div><div class="card-body">Any vector $\\mathbf{x}$ that satisfies every equation simultaneously. The solution set may be empty, a single point, or an affine subspace.</div></div>
</div>

<p class="l-text">Compressed into matrix form, the entire system becomes the single equation</p>

<div class="calc-formula"><div class="formula-label">MATRIX FORM</div><div class="formula-main">$$A\\mathbf{x} = \\mathbf{b}, \\qquad A = [a_{ij}] \\in \\mathbb{R}^{m\\times n}, \\quad \\mathbf{x} \\in \\mathbb{R}^n, \\quad \\mathbf{b} \\in \\mathbb{R}^m.$$</div></div>

<p class="l-text"><strong>Geometric picture.</strong> Each equation $a_{i1} x_1 + \\cdots + a_{in} x_n = b_i$ describes a hyperplane in $\\mathbb{R}^n$. The solution set of the whole system is the intersection of these $m$ hyperplanes. In $\\mathbb{R}^2$ each equation is a line, and two lines in general position meet in a single point. In $\\mathbb{R}^3$ each equation is a plane: three planes in general position meet in a point, but two parallel planes do not meet at all, and three planes sharing a common line meet in infinitely many points.</p>

<div id="plot-l3-2d-unique-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xr=[];for(var i=-1;i<=7;i+=0.1){xr.push(i);}
var y1=xr.map(function(x){return 11-2*x;});
var y2=xr.map(function(x){return (18-x)/3;});
var t1={x:xr,y:y1,mode:'lines',name:'2x + y = 11',line:{color:'#c8a96e',width:3}};
var t2={x:xr,y:y2,mode:'lines',name:'x + 3y = 18',line:{color:'#4ecdc4',width:3}};
var pt={x:[3],y:[5],mode:'markers+text',name:'(3, 5)',marker:{color:'#f87171',size:12},text:['(3, 5)'],textposition:'top right',textfont:{color:'#f87171',size:13}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1,7]},yaxis:{title:'y',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1,8]},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5},margin:{t:30,r:30,b:60,l:50}};
Plotly.newPlot('plot-l3-2d-unique-en',[t1,t2,pt],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the two lines $2x + y = 11$ (gold) and $x + 3y = 18$ (teal) in the plane. They have different slopes, so they meet at exactly one point — the red dot at $(3, 5)$. This single intersection point is the unique solution of the two-equation system. The whole of Section 1 is the algebraic version of this picture.</div></div>

<h2 class="lesson-title">2. Augmented Matrix Notation</h2>

<p class="l-text">Writing out a system in full sentences is tedious and obscures the only thing that matters: the numerical coefficients. The <strong>augmented matrix</strong> of $A\\mathbf{x} = \\mathbf{b}$ is the $m \\times (n+1)$ matrix obtained by appending $\\mathbf{b}$ as an extra column to $A$, with a vertical bar to remind us that the last column is special:</p>

<div class="calc-formula"><div class="formula-label">AUGMENTED MATRIX</div><div class="formula-main">$$[A \\mid \\mathbf{b}] \\;=\\; \\left[\\begin{array}{cccc|c} a_{11} & a_{12} & \\cdots & a_{1n} & b_1 \\\\ a_{21} & a_{22} & \\cdots & a_{2n} & b_2 \\\\ \\vdots & \\vdots & \\ddots & \\vdots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} & b_m \\end{array}\\right].$$</div></div>

<p class="l-text">Every operation we perform on the system — multiplying an equation by a nonzero scalar, adding a multiple of one equation to another, swapping two equations — corresponds exactly to a row operation on the augmented matrix. The three <strong>elementary row operations</strong> are:</p>

<div class="calc-formula"><div class="formula-label">ELEMENTARY ROW OPERATIONS</div><div class="formula-main">$$\\begin{aligned} \\text{(I) Swap two rows:}\\quad & R_i \\leftrightarrow R_j, \\\\ \\text{(II) Scale a row:}\\quad & R_i \\leftarrow c\\, R_i \\quad (c \\neq 0), \\\\ \\text{(III) Add a multiple of one row to another:}\\quad & R_i \\leftarrow R_i + c\\, R_j. \\end{aligned}$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Each operation is reversible</div><div class="card-body">Type (I) is its own inverse; type (II) is undone by $R_i \\leftarrow c^{-1} R_i$; type (III) is undone by $R_i \\leftarrow R_i - c\\, R_j$. So row operations never lose information.</div></div>
<div class="calc-card"><div class="card-title">They preserve the solution set</div><div class="card-body">If $\\mathbf{x}$ satisfies the original system, it satisfies the new one, and vice versa. This is the entire justification for elimination — we change the equations but not their joint solution.</div></div>
<div class="calc-card"><div class="card-title">Row-equivalent matrices</div><div class="card-body">Two augmented matrices that can be transformed into each other by a finite sequence of elementary row operations are called <em>row-equivalent</em>. Row-equivalent systems have the same solution set.</div></div>
</div>

<h2 class="lesson-title">3. Gaussian Elimination</h2>

<p class="l-text"><strong>Gaussian elimination</strong> is a finite procedure that uses elementary row operations to reduce $[A \\mid \\mathbf{b}]$ to an upper triangular form from which the solution can be read by back substitution. The algorithm processes one pivot column at a time, top to bottom and left to right, creating zeros below each pivot.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Locate the pivot</div><div class="step-detail">Find the leftmost column that still has a nonzero entry in or below the current row. The topmost nonzero entry of that column is the next <strong>pivot</strong>. If a candidate pivot is zero, swap rows (operation I) until it is nonzero — this is <em>partial pivoting</em>.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Eliminate below the pivot</div><div class="step-detail">For every row $R_k$ below the pivot row $R_i$, compute the multiplier $\\ell_{ki} = a_{ki}/a_{ii}$ and replace $R_k \\leftarrow R_k - \\ell_{ki} R_i$. After this step the pivot column is zero below the pivot.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Advance and repeat</div><div class="step-detail">Move one row down and one column right, and repeat steps 1–2. Stop when no rows or no columns remain. The result is in <strong>row echelon form</strong>: a staircase of pivots, all zeros below.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Back substitute</div><div class="step-detail">Read the last pivot row, which now has a single unknown — solve for it. Substitute that value into the row above and solve for the next unknown. Continue upward until every $x_i$ is known.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A $3 \\times 3$ SYSTEM</div><div class="example-body">Solve $\\;x + 2y + z = 9,\\; 2x + 5y + 2z = 21,\\; 3x + 7y + 4z = 30.$<br><br>Augmented matrix:<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 2 & 5 & 2 & 21 \\\\ 3 & 7 & 4 & 30 \\end{array}\\right].$$<br><strong>Step 1.</strong> Pivot is $a_{11} = 1$. Eliminate column 1 below: $R_2 \\leftarrow R_2 - 2 R_1$ (multiplier $\\ell_{21} = 2$), $R_3 \\leftarrow R_3 - 3 R_1$ (multiplier $\\ell_{31} = 3$). The matrix becomes<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 1 & 1 & 3 \\end{array}\\right].$$<br><strong>Step 2.</strong> Pivot is now $a_{22} = 1$. Eliminate column 2 below: $R_3 \\leftarrow R_3 - R_2$ (multiplier $\\ell_{32} = 1$):<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & 0 \\end{array}\\right].$$<br>This is row echelon form. <strong>Step 3.</strong> Back substitute: the third equation reads $z = 0$. The second reads $y = 3$. The first reads $x + 2(3) + 1(0) = 9$, hence $x = 3$.<br><br><strong>Solution:</strong> $(x, y, z) = (3, 3, 0)$.<br><br><strong>Verification:</strong> $1(3)+2(3)+1(0) = 9\\;\\checkmark$, $\\;2(3)+5(3)+2(0) = 21\\;\\checkmark$, $\\;3(3)+7(3)+4(0) = 30\\;\\checkmark.$</div></div>

<p class="l-text">The number of arithmetic operations is the classical count $\\frac{2}{3} n^3 + O(n^2)$ for an $n \\times n$ system: $n$ outer pivot passes, each touching $O(n^2)$ entries. The cubic scaling is the reason direct elimination becomes expensive for very large systems and is replaced by iterative methods in that regime — but for $n$ up to a few thousand it remains the workhorse algorithm.</p>

<div id="plot-l3-3d-planes-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var u=[],v=[];for(var i=-1;i<=5;i+=0.5){u.push(i);v.push(i);}
var P1x=[],P1y=[],P1z=[],P2x=[],P2y=[],P2z=[],P3x=[],P3y=[],P3z=[];
for(var i=0;i<u.length;i++){var rowx=[],rowy=[],rowz1=[],rowz2=[],rowz3=[];for(var j=0;j<v.length;j++){var x=u[i],y=v[j];rowx.push(x);rowy.push(y);rowz1.push(9-x-2*y);rowz2.push((21-2*x-5*y)/2);rowz3.push((30-3*x-7*y)/4);}P1x.push(rowx);P1y.push(rowy);P1z.push(rowz1);P2x.push(rowx);P2y.push(rowy);P2z.push(rowz2);P3x.push(rowx);P3y.push(rowy);P3z.push(rowz3);}
var s1={type:'surface',x:P1x,y:P1y,z:P1z,opacity:0.6,colorscale:[[0,'#c8a96e'],[1,'#c8a96e']],showscale:false,name:'x+2y+z=9'};
var s2={type:'surface',x:P2x,y:P2y,z:P2z,opacity:0.6,colorscale:[[0,'#4ecdc4'],[1,'#4ecdc4']],showscale:false,name:'2x+5y+2z=21'};
var s3={type:'surface',x:P3x,y:P3y,z:P3z,opacity:0.6,colorscale:[[0,'#a78bfa'],[1,'#a78bfa']],showscale:false,name:'3x+7y+4z=30'};
var pt={type:'scatter3d',x:[3],y:[3],z:[0],mode:'markers+text',marker:{color:'#f87171',size:8},text:['(3,3,0)'],textposition:'top right',textfont:{color:'#f87171',size:12},name:'solution'};
var layout={paper_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},scene:{xaxis:{title:'x',gridcolor:'#374151',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},yaxis:{title:'y',gridcolor:'#374151',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},zaxis:{title:'z',gridcolor:'#374151',backgroundcolor:'#0a0a0a',color:'#e8e8e8'}},margin:{t:30,r:0,b:0,l:0}};
Plotly.newPlot('plot-l3-3d-planes-en',[s1,s2,s3,pt],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the three planes $x+2y+z=9$, $2x+5y+2z=21$, $3x+7y+4z=30$ in $\\mathbb{R}^3$. Each plane is a single linear equation, and the joint solution of all three is the single point where they all meet — the red marker at $(3, 3, 0)$. Drag the figure to confirm that pairs of planes meet in lines and that all three share exactly that one point.</div></div>

<h2 class="lesson-title">4. Reduced Row Echelon Form (RREF)</h2>

<p class="l-text">Row echelon form (REF) suffices for solving by back substitution, but a sharper canonical form makes the solution set <em>visible</em> without any further work. A matrix is in <strong>reduced row echelon form</strong> if it is in row echelon form and, in addition:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">(a) Every pivot is $1$</div><div class="card-body">Each leading nonzero entry of a row equals $1$. We achieve this by row scaling (operation II): $R_i \\leftarrow a_{ii}^{-1} R_i$.</div></div>
<div class="calc-card"><div class="card-title">(b) Pivot columns are otherwise zero</div><div class="card-body">In each pivot column, the pivot is the only nonzero entry. We achieve this by eliminating <em>above</em> each pivot as well as below, using operation (III) upward.</div></div>
<div class="calc-card"><div class="card-title">(c) Pivots form a strict staircase</div><div class="card-body">Pivots descend strictly to the right as we go down. Rows of all zeros, if any, sit at the bottom. This is inherited from REF.</div></div>
<div class="calc-card"><div class="card-title">Uniqueness</div><div class="card-body">Unlike REF, the RREF of a matrix is <em>unique</em> — independent of the elimination order. This makes RREF a true canonical form.</div></div>
</div>

<div class="calc-example"><div class="example-label">FROM REF TO RREF</div><div class="example-body">Continuing the previous example, the REF was<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & 0 \\end{array}\\right].$$<br>All pivots are already $1$. Eliminate above pivot $a_{33}=1$: $R_1 \\leftarrow R_1 - R_3$ gives row 1 = $[1, 2, 0, 9]$. Eliminate above pivot $a_{22}=1$: $R_1 \\leftarrow R_1 - 2 R_2$ gives row 1 = $[1, 0, 0, 3]$. The RREF is<br>$$\\left[\\begin{array}{ccc|c} 1 & 0 & 0 & 3 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & 0 \\end{array}\\right],$$<br>so the solution $(x, y, z) = (3, 3, 0)$ is read off directly from the last column. No back substitution needed.</div></div>

<p class="l-text">When the RREF has a column without a pivot, the corresponding variable is called <strong>free</strong>: it can take any real value, and the pivot variables are expressed in terms of it. A free variable always signals an infinite solution set.</p>

<div class="calc-example"><div class="example-label">RREF WITH A FREE VARIABLE</div><div class="example-body">Suppose after elimination we obtain<br>$$\\left[\\begin{array}{ccc|c} 1 & 0 & 3 & 7 \\\\ 0 & 1 & -1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{array}\\right].$$<br>Columns 1 and 2 have pivots ($x$ and $y$ are basic); column 3 has no pivot, so $z$ is free. Set $z = t$ for any $t \\in \\mathbb{R}$. Then $x = 7 - 3t$ and $y = 2 + t$, so the solution set is the line<br>$$\\mathbf{x}(t) \\;=\\; \\begin{bmatrix} 7 \\\\ 2 \\\\ 0 \\end{bmatrix} + t \\begin{bmatrix} -3 \\\\ 1 \\\\ 1 \\end{bmatrix}, \\qquad t \\in \\mathbb{R}.$$<br>The first vector is a particular solution; the second spans the null space of $A$.</div></div>

<h2 class="lesson-title">5. Existence and Uniqueness of Solutions</h2>

<p class="l-text">For any linear system $A\\mathbf{x} = \\mathbf{b}$ there are exactly three possibilities, distinguishable from the RREF of the augmented matrix:</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">UNIQUE SOLUTION</div><div class="compare-item">Every column of $A$ has a pivot in RREF.</div><div class="compare-item">No free variables.</div><div class="compare-item">Geometric: hyperplanes meet in a single point.</div><div class="compare-item">If $A$ is square, $\\det A \\neq 0$ and $\\mathbf{x} = A^{-1} \\mathbf{b}$.</div></div>
<div class="compare-col"><div class="compare-title">NO SOLUTION</div><div class="compare-item">A row $[0\\;0\\;\\cdots\\;0\\mid c]$ with $c \\neq 0$ appears in RREF.</div><div class="compare-item">Equations contradict each other.</div><div class="compare-item">Geometric: hyperplanes have no common point.</div><div class="compare-item">System is called <em>inconsistent</em>.</div></div>
<div class="compare-col"><div class="compare-title">INFINITELY MANY</div><div class="compare-item">Consistent and at least one column of $A$ lacks a pivot.</div><div class="compare-item">$\\geq 1$ free variable; solution set is an affine subspace.</div><div class="compare-item">Geometric: hyperplanes share a line, plane, or higher-dimensional flat.</div><div class="compare-item">Solution: particular $+$ null space combinations.</div></div>
</div>

<p class="l-text">The single criterion that unifies all three cases is the <strong>Rouché–Capelli theorem</strong>:</p>

<div class="calc-formula"><div class="formula-label">ROUCHÉ–CAPELLI</div><div class="formula-main">$$A\\mathbf{x} = \\mathbf{b}\\;\\text{ is consistent}\\;\\iff\\; \\mathrm{rank}(A) \\;=\\; \\mathrm{rank}([A \\mid \\mathbf{b}]).$$ $$\\text{If consistent,}\\;\\#\\text{solutions} = \\begin{cases} 1 & \\text{if } \\mathrm{rank}(A) = n, \\\\ \\infty & \\text{if } \\mathrm{rank}(A) < n. \\end{cases}$$</div></div>

<div class="calc-example"><div class="example-label">THREE QUICK CASES</div><div class="example-body"><strong>Case 1 (unique).</strong> $x + y = 3,\\; x - y = 1.$ RREF $[I \\mid (2,1)^T]$ so $\\mathrm{rank}(A) = \\mathrm{rank}([A\\mid \\mathbf{b}]) = 2 = n$. Unique solution $(2, 1)$.<br><br><strong>Case 2 (none).</strong> $x + y = 3,\\; x + y = 5.$ Subtracting gives $0 = 2$. RREF augmented row $[0\\;0\\mid 2]$ raises $\\mathrm{rank}([A\\mid \\mathbf{b}]) = 2$ while $\\mathrm{rank}(A) = 1$. No solution.<br><br><strong>Case 3 (infinite).</strong> $x + y = 3,\\; 2x + 2y = 6.$ Second equation is twice the first. RREF augmented is $\\left[\\begin{smallmatrix} 1 & 1 & 3 \\\\ 0 & 0 & 0 \\end{smallmatrix}\\right]$, $\\mathrm{rank}(A) = \\mathrm{rank}([A\\mid \\mathbf{b}]) = 1 < 2 = n$. One free variable, solutions $\\{(3-t, t): t \\in \\mathbb{R}\\}$.</div></div>

<h2 class="lesson-title">6. Rank and the Rank Theorem</h2>

<p class="l-text">The <strong>rank</strong> of a matrix $A$, written $\\mathrm{rank}(A)$ or $r$, is the number of pivots in any echelon form of $A$. Equivalently, it is the dimension of the column space and also the dimension of the row space. The rank is independent of the elimination order — every row-equivalent echelon form yields the same pivot count.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF RANK</div><div class="formula-main">$$\\mathrm{rank}(A) \\;=\\; \\#\\{\\text{pivots in } \\mathrm{RREF}(A)\\} \\;=\\; \\dim C(A) \\;=\\; \\dim R(A).$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bounds</div><div class="card-body">$0 \\le \\mathrm{rank}(A) \\le \\min(m, n)$. The matrix is <em>full row rank</em> if $\\mathrm{rank}(A) = m$, <em>full column rank</em> if $\\mathrm{rank}(A) = n$.</div></div>
<div class="calc-card"><div class="card-title">Row rank = column rank</div><div class="card-body">A nontrivial theorem: the maximum number of linearly independent rows equals the maximum number of linearly independent columns. Both equal the pivot count.</div></div>
<div class="calc-card"><div class="card-title">Rank under transpose</div><div class="card-body">$\\mathrm{rank}(A^T) = \\mathrm{rank}(A)$. Rows of $A$ are columns of $A^T$, and the two ranks are forced equal by the previous fact.</div></div>
<div class="calc-card"><div class="card-title">Rank of a product</div><div class="card-body">$\\mathrm{rank}(AB) \\le \\min(\\mathrm{rank}(A), \\mathrm{rank}(B))$. Matrix multiplication never increases rank.</div></div>
</div>

<p class="l-text">The <strong>rank–nullity theorem</strong> (also called the rank theorem or the dimension theorem) is the central counting identity of linear algebra. Recall that the <strong>null space</strong> $N(A) = \\{\\mathbf{x} \\in \\mathbb{R}^n : A\\mathbf{x} = \\mathbf{0}\\}$ is the solution set of the homogeneous system.</p>

<div class="calc-formula"><div class="formula-label">RANK–NULLITY THEOREM</div><div class="formula-main">$$\\boxed{\\;\\mathrm{rank}(A) \\;+\\; \\dim N(A) \\;=\\; n\\;}$$ where $n$ is the number of columns of $A$.</div></div>

<p class="l-text"><strong>Proof sketch.</strong> Reduce $A$ to RREF. The pivot columns correspond to basic variables and contribute one to the rank for each pivot. The non-pivot columns correspond to free variables and contribute one each to $\\dim N(A)$ (each free variable parameterises a basis vector of the null space). Pivot count plus free count equals total column count, which is $n$.</p>

<div class="calc-example"><div class="example-label">VERIFYING RANK–NULLITY</div><div class="example-body">Let $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{bmatrix}.$ Row reduce:<br>$R_2 \\leftarrow R_2 - 2 R_1$ gives $[0, 0, 0]$. $R_3 \\leftarrow R_3 - R_1$ gives $[0, -1, -2]$. Swap and rescale:<br>$$\\mathrm{RREF}(A) = \\begin{bmatrix} 1 & 0 & -1 \\\\ 0 & 1 & 2 \\\\ 0 & 0 & 0 \\end{bmatrix}.$$<br>Two pivots, so $\\mathrm{rank}(A) = 2$. Column 3 has no pivot, so $x_3$ is free: setting $x_3 = t$, the homogeneous solution is $\\mathbf{x} = t(1, -2, 1)^T$. Hence $\\dim N(A) = 1$ and $2 + 1 = 3 = n.$ $\\checkmark$</div></div>

<h2 class="lesson-title">7. The Four Fundamental Subspaces</h2>

<p class="l-text">Associated with every $m \\times n$ matrix $A$ are four canonical subspaces, two living in $\\mathbb{R}^n$ (column count, the input space) and two in $\\mathbb{R}^m$ (row count, the output space). They were systematised by Gilbert Strang and capture every structural fact about $A$.</p>

<div class="calc-formula"><div class="formula-label">THE FOUR FUNDAMENTAL SUBSPACES</div><div class="formula-main">$$\\begin{array}{l|l|l} \\text{Subspace} & \\text{Definition} & \\text{Dimension} \\\\ \\hline C(A) \\text{ — column space} & \\{A\\mathbf{x} : \\mathbf{x} \\in \\mathbb{R}^n\\} \\subset \\mathbb{R}^m & r = \\mathrm{rank}(A) \\\\ N(A) \\text{ — null space} & \\{\\mathbf{x} \\in \\mathbb{R}^n : A\\mathbf{x} = \\mathbf{0}\\} & n - r \\\\ R(A) \\text{ — row space} & C(A^T) \\subset \\mathbb{R}^n & r \\\\ N(A^T) \\text{ — left null space} & \\{\\mathbf{y} \\in \\mathbb{R}^m : A^T \\mathbf{y} = \\mathbf{0}\\} & m - r \\end{array}$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Column space $C(A)$</div><div class="card-body">All linear combinations of the columns of $A$. The equation $A\\mathbf{x} = \\mathbf{b}$ has a solution if and only if $\\mathbf{b} \\in C(A)$. A basis is given by the pivot columns of the <em>original</em> $A$ (not the RREF — RREF changes the column space if we mix rows).</div></div>
<div class="calc-card"><div class="card-title">Null space $N(A)$</div><div class="card-body">All solutions of the homogeneous system $A\\mathbf{x} = \\mathbf{0}$. A basis is obtained by setting each free variable in turn to $1$ and the others to $0$ in the RREF and reading off the pivot variables.</div></div>
<div class="calc-card"><div class="card-title">Row space $R(A)$</div><div class="card-body">All linear combinations of the rows of $A$. A basis is given by the nonzero rows of any echelon form of $A$ (row operations preserve the row space).</div></div>
<div class="calc-card"><div class="card-title">Left null space $N(A^T)$</div><div class="card-body">All row vectors $\\mathbf{y}^T$ with $\\mathbf{y}^T A = \\mathbf{0}^T$. These are precisely the linear dependencies among the rows of $A$ — they certify which rows became zero during elimination.</div></div>
</div>

<p class="l-text"><strong>Orthogonality relations.</strong> Two of the four subspaces sit inside $\\mathbb{R}^n$ (row and null) and two inside $\\mathbb{R}^m$ (column and left null). In each ambient space the two subspaces are <em>orthogonal complements</em>:</p>

<div class="calc-formula"><div class="formula-label">ORTHOGONALITY</div><div class="formula-main">$$N(A) \\;=\\; R(A)^{\\perp} \\quad \\text{in } \\mathbb{R}^n, \\qquad N(A^T) \\;=\\; C(A)^{\\perp} \\quad \\text{in } \\mathbb{R}^m.$$</div></div>

<p class="l-text">The first identity says every null-space vector is orthogonal to every row of $A$, which is immediate from $A\\mathbf{x} = \\mathbf{0}$ — each row of $A$ dotted with $\\mathbf{x}$ gives the corresponding entry of $A\\mathbf{x}$, namely $0$. The second is the same statement applied to $A^T$.</p>

<div class="calc-example"><div class="example-label">FINDING BASES FOR ALL FOUR SUBSPACES</div><div class="example-body">Take $A = \\begin{bmatrix} 1 & 2 & 3 & 1 \\\\ 2 & 4 & 6 & 2 \\\\ 1 & 1 & 1 & 2 \\end{bmatrix}.$ Eliminate: $R_2 \\to R_2 - 2 R_1$ gives all zeros. $R_3 \\to R_3 - R_1$ gives $[0, -1, -2, 1]$. Then $R_1 \\to R_1 + 2 R_3$ (after rescaling $R_3$ to $[0,1,2,-1]$):<br>$$\\mathrm{RREF}(A) = \\begin{bmatrix} 1 & 0 & -1 & 3 \\\\ 0 & 1 & 2 & -1 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}.$$<br>Pivot columns: 1 and 2. So $r = 2$. <strong>Column space</strong> basis: columns 1 and 2 of the original $A$: $\\{(1,2,1)^T, (2,4,1)^T\\}$. <strong>Row space</strong> basis: the nonzero rows of RREF: $\\{(1,0,-1,3), (0,1,2,-1)\\}$. <strong>Null space</strong> basis: set free vars $x_3 = 1, x_4 = 0$ then $x_3 = 0, x_4 = 1$: $\\{(1,-2,1,0)^T, (-3,1,0,1)^T\\}$. <strong>Left null space</strong> basis: row 2 of $A$ is twice row 1, so $\\mathbf{y}^T = (-2, 1, 0)$ satisfies $\\mathbf{y}^T A = \\mathbf{0}^T$; that single vector is a basis. Dimensions: $r=2,\\;n-r=2,\\;r=2,\\;m-r=1$ — all consistent.</div></div>

<h2 class="lesson-title">8. $LU$ Decomposition</h2>

<p class="l-text">During Gaussian elimination on an $n \\times n$ matrix $A$ (no row swaps needed), each elimination step $R_k \\leftarrow R_k - \\ell_{ki} R_i$ multiplies $A$ on the left by an elementary lower-triangular matrix $E_{ki}$ with $-\\ell_{ki}$ in position $(k, i)$ and $1$'s on the diagonal. The product of all these matrices reduces $A$ to upper triangular form $U$:</p>

<div class="calc-formula"><div class="formula-label">DERIVATION OF $LU$</div><div class="formula-main">$$E_k \\cdots E_2 E_1 \\,A \\;=\\; U \\quad \\Longrightarrow \\quad A \\;=\\; (E_1^{-1} E_2^{-1} \\cdots E_k^{-1})\\,U \\;=\\; LU.$$</div></div>

<p class="l-text">The miracle is that $L = E_1^{-1} E_2^{-1} \\cdots E_k^{-1}$ is simply the unit lower-triangular matrix whose $(k,i)$ entry is the multiplier $\\ell_{ki}$ used in that elimination step — no extra computation. We get the factorisation $A = LU$ as a free by-product of elimination, with</p>

<div class="calc-formula"><div class="formula-main">$$L = \\begin{bmatrix} 1 & & & \\\\ \\ell_{21} & 1 & & \\\\ \\ell_{31} & \\ell_{32} & 1 & \\\\ \\vdots & \\vdots & \\ddots & \\ddots \\\\ \\ell_{n1} & \\ell_{n2} & \\cdots & \\ell_{n,n-1} & 1 \\end{bmatrix}, \\qquad U = \\begin{bmatrix} u_{11} & u_{12} & \\cdots & u_{1n} \\\\ & u_{22} & \\cdots & u_{2n} \\\\ & & \\ddots & \\vdots \\\\ & & & u_{nn} \\end{bmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">$LU$ OF A $3 \\times 3$ MATRIX</div><div class="example-body">Continuing the elimination of $A = \\begin{bmatrix} 1 & 2 & 1 \\\\ 2 & 5 & 2 \\\\ 3 & 7 & 4 \\end{bmatrix}$ from Section 3, the multipliers were $\\ell_{21} = 2,\\; \\ell_{31} = 3,\\; \\ell_{32} = 1$, and the upper triangular result was $U = \\begin{bmatrix} 1 & 2 & 1 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}.$ Therefore<br>$$L = \\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 3 & 1 & 1 \\end{bmatrix}, \\qquad U = \\begin{bmatrix} 1 & 2 & 1 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}, \\qquad LU = \\begin{bmatrix} 1 & 2 & 1 \\\\ 2 & 5 & 2 \\\\ 3 & 7 & 4 \\end{bmatrix} = A. \\;\\checkmark$$</div></div>

<p class="l-text"><strong>Solving $A\\mathbf{x} = \\mathbf{b}$ with $LU$.</strong> Substitute $A = LU$: the equation becomes $LU\\mathbf{x} = \\mathbf{b}.$ Introduce the intermediate vector $\\mathbf{y} = U\\mathbf{x}$. Then $L\\mathbf{y} = \\mathbf{b}$. Since $L$ is lower-triangular, solve for $\\mathbf{y}$ by <strong>forward substitution</strong> (top to bottom). Then $U\\mathbf{x} = \\mathbf{y}$ is upper-triangular: solve for $\\mathbf{x}$ by <strong>back substitution</strong> (bottom to top). Each triangular solve costs $O(n^2)$ operations.</p>

<div class="calc-example"><div class="example-label">USING THE $LU$ ABOVE TO SOLVE $A\\mathbf{x} = \\mathbf{b}$</div><div class="example-body">With $\\mathbf{b} = (9, 21, 30)^T$, solve $L \\mathbf{y} = \\mathbf{b}$ by forward substitution:<br>$y_1 = 9,\\quad 2(9) + y_2 = 21 \\Rightarrow y_2 = 3,\\quad 3(9) + 1(3) + y_3 = 30 \\Rightarrow y_3 = 0.$<br>So $\\mathbf{y} = (9, 3, 0)^T$. Solve $U \\mathbf{x} = \\mathbf{y}$ by back substitution:<br>$z = 0,\\quad y = 3,\\quad x + 2(3) + 1(0) = 9 \\Rightarrow x = 3.$<br>$\\mathbf{x} = (3, 3, 0)^T$, matching Section 3.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why $LU$ is useful</div><div class="card-body">When you must solve $A\\mathbf{x} = \\mathbf{b}_k$ for many right-hand sides $\\mathbf{b}_1, \\mathbf{b}_2, \\ldots, \\mathbf{b}_K$ with the same $A$, factor once ($\\tfrac{2}{3} n^3$ work) and then each new solve costs only $O(n^2)$.</div></div>
<div class="calc-card"><div class="card-title">Pivoting</div><div class="card-body">When a pivot is zero or numerically small, row swaps are needed. The factorisation then takes the form $PA = LU$, where $P$ is a permutation matrix recording the swaps. Every invertible square matrix admits such a $PA = LU$ factorisation.</div></div>
<div class="calc-card"><div class="card-title">Determinant via $LU$</div><div class="card-body">$\\det A = \\det L \\cdot \\det U = 1 \\cdot (u_{11} u_{22} \\cdots u_{nn})$ for unit-lower $L$. With pivoting, $\\det A = (-1)^{\\#\\text{swaps}} \\prod u_{ii}$.</div></div>
<div class="calc-card"><div class="card-title">Symmetric positive definite</div><div class="card-body">If $A$ is symmetric and positive definite, the $LU$ specialises to the Cholesky factorisation $A = R^T R$ with $R$ upper triangular, halving both storage and work.</div></div>
</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">The following classical exercises consolidate every technique of the lesson. Each is solvable by hand in a few minutes; full step-by-step solutions are provided so you can self-check.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — SOLVE A $3 \\times 3$ SYSTEM BY GAUSSIAN ELIMINATION</div><div class="example-body"><strong>Problem.</strong> Solve<br>$$\\begin{cases} 2x + y - z = 8, \\\\ -3x - y + 2z = -11, \\\\ -2x + y + 2z = -3. \\end{cases}$$<br><strong>Solution.</strong> Augment and eliminate. Pivot $a_{11} = 2$.<br>$$\\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ -3 & -1 & 2 & -11 \\\\ -2 & 1 & 2 & -3 \\end{array}\\right] \\xrightarrow{R_2 + \\tfrac{3}{2} R_1,\\; R_3 + R_1} \\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ 0 & 1/2 & 1/2 & 1 \\\\ 0 & 2 & 1 & 5 \\end{array}\\right].$$<br>Pivot $a_{22} = 1/2$. $R_3 \\leftarrow R_3 - 4 R_2$ gives $[0, 0, -1, 1]$:<br>$$\\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ 0 & 1/2 & 1/2 & 1 \\\\ 0 & 0 & -1 & 1 \\end{array}\\right].$$<br>Back substitute: $-z = 1 \\Rightarrow z = -1$; $\\tfrac12 y + \\tfrac12(-1) = 1 \\Rightarrow y = 3$; $2x + 3 - (-1) = 8 \\Rightarrow x = 2.$<br><strong>Answer.</strong> $(x, y, z) = (2, 3, -1).$ Verify: $2(2)+3-(-1)=8\\;\\checkmark,\\;-3(2)-3+2(-1)=-11\\;\\checkmark,\\;-2(2)+3+2(-1)=-3\\;\\checkmark.$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — FIND THE RANK OF A MATRIX</div><div class="example-body"><strong>Problem.</strong> Determine $\\mathrm{rank}(A)$ for<br>$$A = \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 2 & 4 & 6 & 8 \\\\ 1 & 3 & 5 & 7 \\\\ 3 & 5 & 7 & 9 \\end{bmatrix}.$$<br><strong>Solution.</strong> $R_2 \\leftarrow R_2 - 2 R_1$ kills row 2: $[0,0,0,0]$. $R_3 \\leftarrow R_3 - R_1$ gives $[0,1,2,3]$. $R_4 \\leftarrow R_4 - 3 R_1$ gives $[0,-1,-2,-3]$. Then $R_4 \\leftarrow R_4 + R_3$ gives $[0,0,0,0]$:<br>$$\\xrightarrow{} \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 1 & 2 & 3 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix} \\xrightarrow{R_2 \\leftrightarrow R_3} \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 0 & 1 & 2 & 3 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}.$$<br>Two pivots in columns 1 and 2.<br><strong>Answer.</strong> $\\mathrm{rank}(A) = 2.$ Consequently $\\dim N(A) = 4 - 2 = 2$ by rank–nullity.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — BASIS OF THE NULL SPACE</div><div class="example-body"><strong>Problem.</strong> Find a basis of $N(A)$ for<br>$$A = \\begin{bmatrix} 1 & 2 & 0 & -1 \\\\ 0 & 0 & 1 & 2 \\\\ 1 & 2 & 1 & 1 \\end{bmatrix}.$$<br><strong>Solution.</strong> $R_3 \\leftarrow R_3 - R_1$ gives $[0, 0, 1, 2]$, which is row 2; then $R_3 \\leftarrow R_3 - R_2 = [0,0,0,0]$:<br>$$\\mathrm{RREF}(A) = \\begin{bmatrix} 1 & 2 & 0 & -1 \\\\ 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}.$$<br>Pivots in columns 1 and 3, so $x_1, x_3$ are basic and $x_2, x_4$ are free. Solve $x_1 = -2 x_2 + x_4$ and $x_3 = -2 x_4$.<br>Set $(x_2, x_4) = (1, 0)$: $\\mathbf{n}_1 = (-2, 1, 0, 0)^T.$<br>Set $(x_2, x_4) = (0, 1)$: $\\mathbf{n}_2 = (1, 0, -2, 1)^T.$<br><strong>Answer.</strong> $N(A) = \\mathrm{span}\\{\\mathbf{n}_1, \\mathbf{n}_2\\}.$ Verification: $A \\mathbf{n}_1 = (1(-2)+2(1)+0+0,\\;0+0+1(0)+2(0),\\;1(-2)+2(1)+0+0)^T = \\mathbf{0}\\;\\checkmark$; similarly $A \\mathbf{n}_2 = \\mathbf{0}.\\;\\checkmark$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — $LU$ DECOMPOSITION OF A $3 \\times 3$ MATRIX</div><div class="example-body"><strong>Problem.</strong> Find $L$ and $U$ such that $A = LU$ for $A = \\begin{bmatrix} 2 & 1 & 1 \\\\ 4 & 3 & 3 \\\\ 8 & 7 & 9 \\end{bmatrix}.$<br><strong>Solution.</strong> Pivot $a_{11} = 2$.<br>$\\ell_{21} = 4/2 = 2$: $R_2 \\leftarrow R_2 - 2 R_1$ gives $[0, 1, 1]$.<br>$\\ell_{31} = 8/2 = 4$: $R_3 \\leftarrow R_3 - 4 R_1$ gives $[0, 3, 5]$.<br>Pivot $a_{22} = 1$. $\\ell_{32} = 3/1 = 3$: $R_3 \\leftarrow R_3 - 3 R_2$ gives $[0, 0, 2]$.<br>$$U = \\begin{bmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 2 \\end{bmatrix}, \\qquad L = \\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 4 & 3 & 1 \\end{bmatrix}.$$<br>Check $LU$: row 3 of $LU$ is $4(2,1,1) + 3(0,1,1) + 1(0,0,2) = (8, 7, 9).\\;\\checkmark$<br><strong>Answer.</strong> $A = LU$ with $L$ and $U$ as above. Bonus: $\\det A = (1)(2 \\cdot 1 \\cdot 2) = 4.$</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — CONSISTENCY OF $A\\mathbf{x} = \\mathbf{b}$</div><div class="example-body"><strong>Problem.</strong> Decide whether the system is consistent. If so, describe the solution set.<br>$$\\begin{cases} x + y + z = 6, \\\\ 2x - y + z = 3, \\\\ 3x + 0 y + 2z = 9, \\\\ x + 2y + z = 8. \\end{cases}$$<br><strong>Solution.</strong> Augment and eliminate.<br>$$\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 2 & -1 & 1 & 3 \\\\ 3 & 0 & 2 & 9 \\\\ 1 & 2 & 1 & 8 \\end{array}\\right] \\xrightarrow{R_2-2R_1,\\; R_3-3R_1,\\; R_4-R_1} \\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & 1 & 0 & 2 \\end{array}\\right].$$<br>$R_3 \\leftarrow R_3 - R_2 = [0,0,0,0]$. $R_4 \\leftarrow R_4 + \\tfrac13 R_2 = [0, 0, -\\tfrac13, -1]$:<br>$$\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & 0 & -1/3 & -1 \\\\ 0 & 0 & 0 & 0 \\end{array}\\right].$$<br>Three pivots in $A$, three pivots in $[A\\mid \\mathbf{b}]$ (the last row is genuinely zero, not $[0\\,0\\,0\\mid c]$ with $c \\neq 0$). So $\\mathrm{rank}(A) = \\mathrm{rank}([A\\mid \\mathbf{b}]) = 3 = n$.<br><strong>Conclusion: consistent, unique solution.</strong> Back substitute: $-\\tfrac13 z = -1 \\Rightarrow z = 3$; $-3 y - 3 = -9 \\Rightarrow y = 2$; $x + 2 + 3 = 6 \\Rightarrow x = 1.$ Solution: $(1, 2, 3).$<br><br><strong>Variant.</strong> If the last entry of $\\mathbf{b}$ were $9$ instead of $8$, the final row of the augmented elimination would become $[0\\;0\\;0\\mid -2]$, raising the augmented rank to $4 > 3 = \\mathrm{rank}(A)$ — the system would be <strong>inconsistent</strong>.</div></div>

<h2 class="lesson-title">Summary</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$A\\mathbf{x} = \\mathbf{b}$</div><div class="card-body">Matrix form of every linear system. Each equation is one hyperplane; the solution set is their intersection.</div><div class="card-formula">$A \\in \\mathbb{R}^{m \\times n}$</div></div>
<div class="calc-card"><div class="card-title">Gaussian elimination</div><div class="card-body">Row operations $\\Rightarrow$ row echelon form $\\Rightarrow$ back substitution. Cost $\\tfrac{2}{3} n^3$.</div><div class="card-formula">REF</div></div>
<div class="calc-card"><div class="card-title">RREF</div><div class="card-body">Unique canonical form: pivots equal $1$ and are the only nonzero entries in their columns. Solution readable directly.</div><div class="card-formula">$\\mathrm{RREF}(A)$</div></div>
<div class="calc-card"><div class="card-title">Rouché–Capelli</div><div class="card-body">Consistent $\\iff \\mathrm{rank}(A) = \\mathrm{rank}([A\\mid\\mathbf{b}])$. Then unique if $\\mathrm{rank} = n$, else infinite.</div><div class="card-formula">$r(A) \\stackrel{?}{=} r([A\\mid\\mathbf{b}])$</div></div>
<div class="calc-card"><div class="card-title">Rank–nullity</div><div class="card-body">$\\mathrm{rank}(A) + \\dim N(A) = n$. Counts pivots versus free variables.</div><div class="card-formula">$r + (n - r) = n$</div></div>
<div class="calc-card"><div class="card-title">Four subspaces</div><div class="card-body">$C(A), N(A), R(A), N(A^T)$ — dimensions $r, n-r, r, m-r$; orthogonal in pairs.</div><div class="card-formula">$N(A) \\perp R(A)$</div></div>
<div class="calc-card"><div class="card-title">$LU$ decomposition</div><div class="card-body">$A = LU$ from elimination multipliers. Solve $L \\mathbf{y} = \\mathbf{b}$ then $U \\mathbf{x} = \\mathbf{y}$.</div><div class="card-formula">$A = LU$</div></div>
<div class="calc-card"><div class="card-title">$PA = LU$</div><div class="card-body">Generalisation with partial pivoting. Permutation $P$ records row swaps. Every invertible $A$ admits this.</div><div class="card-formula">$PA = LU$</div></div>
</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text"><strong>Doğrusal denklem sistemleri, doğrusal cebirin merkez problemidir.</strong> Bir katsayı matrisi $A$ ve sağ taraf $\\mathbf{b}$ verildiğinde sorduğumuz şudur: hangi $\\mathbf{x}$ vektörleri $A\\mathbf{x} = \\mathbf{b}$ denklemini sağlar? Cevap daima üç olasılıktan biridir — tam olarak bir $\\mathbf{x}$, sonsuz çoklukta $\\mathbf{x}$ ya da hiçbir $\\mathbf{x}$ — ve aynı sınırlı sayıda teknik (eliminasyon, eşelon formlar, rank) bize hangi durumda olduğumuzu söyler ve çözüm kümesini açıkça üretir. Bu dersteki diğer her konu (özdeğerler, dikgenlik, SVD) bu temel üzerine inşa edilir.</p>

<p class="l-text">Bu derste klasik makineyi geliştiriyoruz: iki düzlemin bir doğru boyunca buluşmasının geometrisi, eklenmiş matrisler, kısmi pivotlu Gauss eliminasyonu, indirgenmiş satır eşelon formu (RREF), rank teoremi, dört temel altuzay ve eliminasyonu üçgensel bir çarpıma çeviren $LU$ ayrışımı. Her algoritma küçük bir $3 \\times 3$ örneği üzerinde çalıştırılır ve ders bir dizi klasik alıştırma ile kapanır.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir doğrusal denklem sistemini $A\\mathbf{x} = \\mathbf{b}$ matris denklemine ve $[A \\mid \\mathbf{b}]$ eklenmiş matrisine çevirmek</li>
<li>$3 \\times 3$ bir sistemde kısmi pivotlu Gauss eliminasyonu yürütmek ve sistemin tek, sonsuz veya hiç çözümü olmadığına karar vermek</li>
<li>Bir matrisi satır eşelon formuna (REF) ve sonra indirgenmiş satır eşelon formuna (RREF) indirgeyip çözümü doğrudan okumak</li>
<li>Rouché–Capelli teoremini $\\mathrm{rank}(A) = \\mathrm{rank}([A \\mid \\mathbf{b}])$ tutarlılığı test etmek için uygulamak</li>
<li>Dört temel altuzayı — sütun uzayı, sıfır uzayı, satır uzayı, sol sıfır uzayı — tanımlamak ve rank–nullity teoremini $\\mathrm{rank}(A) + \\dim N(A) = n$ doğrulamak</li>
<li>Eliminasyon çarpanlarından $LU$ ayrışımı $A = LU$ hesaplamak ve $A\\mathbf{x} = \\mathbf{b}$'yi ileri ve geri yerine koyma ile çözmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Doğrusal Denklem Sistemleri</h2>

<p class="l-text">$x_1, x_2, \\ldots, x_n$ bilinmeyenlerinde bir <strong>doğrusal denklem</strong>, $a_1 x_1 + a_2 x_2 + \\cdots + a_n x_n = b$ formundaki bir denklemdir; burada $a_i$ katsayıları ve $b$ sabiti sabit reel sayılardır. "Doğrusal" demek bilinmeyenlerin yalnızca birinci kuvvette göründüğü, $x_i x_j$ çarpımları, $x_i^2$ üsleri ya da $\\sin x_i, e^{x_i}$ gibi aşkın fonksiyonların bulunmadığı anlamına gelir. Bir <strong>doğrusal denklem sistemi</strong>, hepsinin aynı anda sağlanması gereken böyle denklemlerin sonlu bir listesidir.</p>

<div class="calc-formula"><div class="formula-label">$n$ BİLİNMEYENLİ $m$ DENKLEMLİ SİSTEM</div><div class="formula-main">$$\\begin{cases} a_{11} x_1 + a_{12} x_2 + \\cdots + a_{1n} x_n = b_1 \\\\ a_{21} x_1 + a_{22} x_2 + \\cdots + a_{2n} x_n = b_2 \\\\ \\quad \\vdots \\\\ a_{m1} x_1 + a_{m2} x_2 + \\cdots + a_{mn} x_n = b_m \\end{cases}$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katsayı $a_{ij}$</div><div class="card-body">$i$. denklemdeki $x_j$ bilinmeyenin bilinen çarpanı. $a_{ij}$'ler $m \\times n$ katsayı matrisi $A$'yı oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Bilinmeyen $x_j$</div><div class="card-body">Çözmek istediğimiz $n$ nicelik. Sütun vektörü $\\mathbf{x} \\in \\mathbb{R}^n$ olarak toplanır.</div></div>
<div class="calc-card"><div class="card-title">Sabit $b_i$</div><div class="card-body">$i$. denklemin sağ tarafı. $b_i$'ler $\\mathbf{b} \\in \\mathbb{R}^m$ vektörünü oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Çözüm</div><div class="card-body">Tüm denklemleri aynı anda sağlayan herhangi bir $\\mathbf{x}$ vektörü. Çözüm kümesi boş, tek nokta veya bir afin altuzay olabilir.</div></div>
</div>

<p class="l-text">Tüm sistem matris formunda tek bir denkleme sıkıştırılır:</p>

<div class="calc-formula"><div class="formula-label">MATRİS FORMU</div><div class="formula-main">$$A\\mathbf{x} = \\mathbf{b}, \\qquad A = [a_{ij}] \\in \\mathbb{R}^{m\\times n}, \\quad \\mathbf{x} \\in \\mathbb{R}^n, \\quad \\mathbf{b} \\in \\mathbb{R}^m.$$</div></div>

<p class="l-text"><strong>Geometrik resim.</strong> Her $a_{i1} x_1 + \\cdots + a_{in} x_n = b_i$ denklemi $\\mathbb{R}^n$ içinde bir hiperdüzlemi tanımlar. Tüm sistemin çözüm kümesi bu $m$ hiperdüzlemin kesişimidir. $\\mathbb{R}^2$'de her denklem bir doğrudur ve genel konumdaki iki doğru tek bir noktada buluşur. $\\mathbb{R}^3$'te her denklem bir düzlemdir: genel konumdaki üç düzlem bir noktada buluşur, fakat paralel iki düzlem hiç buluşmaz ve ortak bir doğruyu paylaşan üç düzlem sonsuz noktada buluşur.</p>

<div id="plot-l3-2d-unique-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xr=[];for(var i=-1;i<=7;i+=0.1){xr.push(i);}
var y1=xr.map(function(x){return 11-2*x;});
var y2=xr.map(function(x){return (18-x)/3;});
var t1={x:xr,y:y1,mode:'lines',name:'2x + y = 11',line:{color:'#c8a96e',width:3}};
var t2={x:xr,y:y2,mode:'lines',name:'x + 3y = 18',line:{color:'#4ecdc4',width:3}};
var pt={x:[3],y:[5],mode:'markers+text',name:'(3, 5)',marker:{color:'#f87171',size:12},text:['(3, 5)'],textposition:'top right',textfont:{color:'#f87171',size:13}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1,7]},yaxis:{title:'y',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1,8]},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5},margin:{t:30,r:30,b:60,l:50}};
Plotly.newPlot('plot-l3-2d-unique-tr',[t1,t2,pt],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> düzlemde $2x + y = 11$ (altın) ve $x + 3y = 18$ (turkuaz) doğruları. Eğimleri farklı, dolayısıyla tek bir noktada buluşurlar — kırmızı nokta $(3, 5)$'te. Bu tek kesişim noktası iki denklemli sistemin yegâne çözümüdür. 1. Bölümün tamamı bu resmin cebirsel halidir.</div></div>

<h2 class="lesson-title">2. Eklenmiş Matris Notasyonu</h2>

<p class="l-text">Bir sistemi tam cümlelerle yazmak yorucudur ve önem taşıyan tek şeyi — sayısal katsayıları — gizler. $A\\mathbf{x} = \\mathbf{b}$'nin <strong>eklenmiş matrisi</strong>, $\\mathbf{b}$'yi $A$'ya ekstra sütun olarak iliştirerek elde edilen $m \\times (n+1)$ matristir; son sütunun özel olduğunu hatırlatmak için dik bir çubuk kullanılır:</p>

<div class="calc-formula"><div class="formula-label">EKLENMİŞ MATRİS</div><div class="formula-main">$$[A \\mid \\mathbf{b}] \\;=\\; \\left[\\begin{array}{cccc|c} a_{11} & a_{12} & \\cdots & a_{1n} & b_1 \\\\ a_{21} & a_{22} & \\cdots & a_{2n} & b_2 \\\\ \\vdots & \\vdots & \\ddots & \\vdots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} & b_m \\end{array}\\right].$$</div></div>

<p class="l-text">Sistem üzerinde yaptığımız her işlem — bir denklemi sıfırdan farklı bir sabitle çarpmak, bir denklemin katını diğerine eklemek, iki denklemi yer değiştirmek — eklenmiş matris üzerinde tam olarak bir satır işlemine karşılık gelir. Üç <strong>elemanter satır işlemi</strong> şunlardır:</p>

<div class="calc-formula"><div class="formula-label">ELEMANTER SATIR İŞLEMLERİ</div><div class="formula-main">$$\\begin{aligned} \\text{(I) İki satırı takasla:}\\quad & R_i \\leftrightarrow R_j, \\\\ \\text{(II) Bir satırı ölçekle:}\\quad & R_i \\leftarrow c\\, R_i \\quad (c \\neq 0), \\\\ \\text{(III) Bir satırın katını diğerine ekle:}\\quad & R_i \\leftarrow R_i + c\\, R_j. \\end{aligned}$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Her işlem tersinirdir</div><div class="card-body">(I) tipi kendi tersidir; (II) tipi $R_i \\leftarrow c^{-1} R_i$ ile geri alınır; (III) tipi $R_i \\leftarrow R_i - c\\, R_j$ ile geri alınır. Yani satır işlemleri asla bilgi kaybetmez.</div></div>
<div class="calc-card"><div class="card-title">Çözüm kümesini korurlar</div><div class="card-body">$\\mathbf{x}$ orijinal sistemi sağlıyorsa yeni sistemi de sağlar ve tersi. Bu, eliminasyonun bütün gerekçesidir — denklemleri değiştiririz ama ortak çözümlerini değil.</div></div>
<div class="calc-card"><div class="card-title">Satır-denk matrisler</div><div class="card-body">Sonlu sayıda elemanter satır işlemiyle birbirine dönüştürülebilen iki eklenmiş matrise <em>satır-denk</em> denir. Satır-denk sistemlerin çözüm kümeleri aynıdır.</div></div>
</div>

<h2 class="lesson-title">3. Gauss Eliminasyonu</h2>

<p class="l-text"><strong>Gauss eliminasyonu</strong>, $[A \\mid \\mathbf{b}]$'yi elemanter satır işlemleri kullanarak çözümün geri yerine koymayla okunabileceği üst üçgensel forma indirgeyen sonlu bir prosedürdür. Algoritma her seferinde bir pivot sütununu, yukarıdan aşağıya ve soldan sağa işler ve her pivotun altında sıfırlar oluşturur.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Pivotu konumlandır</div><div class="step-detail">Mevcut satırda veya altında hâlâ sıfırdan farklı bir girişe sahip en sol sütunu bul. O sütunun en üstteki sıfırdan farklı girişi sıradaki <strong>pivottur</strong>. Aday pivot sıfırsa, sıfırdan farklı olana kadar satırları takasla (işlem I) — bu <em>kısmi pivotlamadır</em>.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Pivotun altını sıfırla</div><div class="step-detail">Pivot satırı $R_i$'nin altındaki her $R_k$ satırı için $\\ell_{ki} = a_{ki}/a_{ii}$ çarpanını hesapla ve $R_k \\leftarrow R_k - \\ell_{ki} R_i$ ile değiştir. Bu adımdan sonra pivot sütunu altında sıfırdır.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İlerle ve tekrarla</div><div class="step-detail">Bir satır aşağı ve bir sütun sağa kay ve 1–2. adımları tekrarla. Satır veya sütun kalmadığında dur. Sonuç <strong>satır eşelon formundadır</strong>: pivotların oluşturduğu bir merdiven ve altta hep sıfırlar.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Geri yerine koy</div><div class="step-detail">Son pivot satırını oku — tek bilinmeyenli olur, çöz. Bu değeri üstteki satıra yerleştir ve bir sonraki bilinmeyeni çöz. Tüm $x_i$'ler bilinene kadar yukarı doğru devam et.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $3 \\times 3$ SİSTEM</div><div class="example-body">$\\;x + 2y + z = 9,\\; 2x + 5y + 2z = 21,\\; 3x + 7y + 4z = 30$ sistemini çöz.<br><br>Eklenmiş matris:<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 2 & 5 & 2 & 21 \\\\ 3 & 7 & 4 & 30 \\end{array}\\right].$$<br><strong>Adım 1.</strong> Pivot $a_{11} = 1$. 1. sütunda alt elimine: $R_2 \\leftarrow R_2 - 2 R_1$ (çarpan $\\ell_{21} = 2$), $R_3 \\leftarrow R_3 - 3 R_1$ (çarpan $\\ell_{31} = 3$). Matris şu hale gelir:<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 1 & 1 & 3 \\end{array}\\right].$$<br><strong>Adım 2.</strong> Pivot artık $a_{22} = 1$. 2. sütunda alt elimine: $R_3 \\leftarrow R_3 - R_2$ (çarpan $\\ell_{32} = 1$):<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & 0 \\end{array}\\right].$$<br>Bu satır eşelon formdur. <strong>Adım 3.</strong> Geri yerine koy: üçüncü denklem $z = 0$ verir. İkinci $y = 3$ verir. Birinci $x + 2(3) + 1(0) = 9$, yani $x = 3$.<br><br><strong>Çözüm:</strong> $(x, y, z) = (3, 3, 0)$.<br><br><strong>Doğrulama:</strong> $1(3)+2(3)+1(0) = 9\\;\\checkmark$, $\\;2(3)+5(3)+2(0) = 21\\;\\checkmark$, $\\;3(3)+7(3)+4(0) = 30\\;\\checkmark.$</div></div>

<p class="l-text">Aritmetik işlem sayısı $n \\times n$ bir sistem için klasik sayım olan $\\frac{2}{3} n^3 + O(n^2)$ kadardır: $n$ dış pivot geçişi, her biri $O(n^2)$ giriş dokunuyor. Kübik ölçekleme, doğrudan eliminasyonun çok büyük sistemler için pahalı hâle gelip iteratif yöntemlerle değiştirilmesinin nedenidir — fakat birkaç bine kadar $n$ için temel iş atı olmaya devam eder.</p>

<div id="plot-l3-3d-planes-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var u=[],v=[];for(var i=-1;i<=5;i+=0.5){u.push(i);v.push(i);}
var P1x=[],P1y=[],P1z=[],P2x=[],P2y=[],P2z=[],P3x=[],P3y=[],P3z=[];
for(var i=0;i<u.length;i++){var rowx=[],rowy=[],rowz1=[],rowz2=[],rowz3=[];for(var j=0;j<v.length;j++){var x=u[i],y=v[j];rowx.push(x);rowy.push(y);rowz1.push(9-x-2*y);rowz2.push((21-2*x-5*y)/2);rowz3.push((30-3*x-7*y)/4);}P1x.push(rowx);P1y.push(rowy);P1z.push(rowz1);P2x.push(rowx);P2y.push(rowy);P2z.push(rowz2);P3x.push(rowx);P3y.push(rowy);P3z.push(rowz3);}
var s1={type:'surface',x:P1x,y:P1y,z:P1z,opacity:0.6,colorscale:[[0,'#c8a96e'],[1,'#c8a96e']],showscale:false,name:'x+2y+z=9'};
var s2={type:'surface',x:P2x,y:P2y,z:P2z,opacity:0.6,colorscale:[[0,'#4ecdc4'],[1,'#4ecdc4']],showscale:false,name:'2x+5y+2z=21'};
var s3={type:'surface',x:P3x,y:P3y,z:P3z,opacity:0.6,colorscale:[[0,'#a78bfa'],[1,'#a78bfa']],showscale:false,name:'3x+7y+4z=30'};
var pt={type:'scatter3d',x:[3],y:[3],z:[0],mode:'markers+text',marker:{color:'#f87171',size:8},text:['(3,3,0)'],textposition:'top right',textfont:{color:'#f87171',size:12},name:'çözüm'};
var layout={paper_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},scene:{xaxis:{title:'x',gridcolor:'#374151',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},yaxis:{title:'y',gridcolor:'#374151',backgroundcolor:'#0a0a0a',color:'#e8e8e8'},zaxis:{title:'z',gridcolor:'#374151',backgroundcolor:'#0a0a0a',color:'#e8e8e8'}},margin:{t:30,r:0,b:0,l:0}};
Plotly.newPlot('plot-l3-3d-planes-tr',[s1,s2,s3,pt],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> $\\mathbb{R}^3$'te $x+2y+z=9$, $2x+5y+2z=21$, $3x+7y+4z=30$ düzlemleri. Her düzlem tek bir doğrusal denklemdir ve üçünün ortak çözümü hepsinin buluştuğu tek noktadır — kırmızı işaret $(3, 3, 0)$'da. Şekli sürükleyerek düzlem çiftlerinin doğrularda buluştuğunu ve üçünün de yalnız o tek noktayı paylaştığını doğrulayın.</div></div>

<h2 class="lesson-title">4. İndirgenmiş Satır Eşelon Formu (RREF)</h2>

<p class="l-text">Satır eşelon formu (REF) geri yerine koymayla çözmek için yeterlidir, fakat daha keskin bir kanonik form çözüm kümesini daha fazla iş yapmadan <em>görünür</em> kılar. Bir matris şu koşulları da sağlıyorsa <strong>indirgenmiş satır eşelon formundadır</strong>:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">(a) Her pivot $1$'dir</div><div class="card-body">Her satırın baş sıfırdan farklı girişi $1$'e eşittir. Satır ölçeklemesiyle (işlem II) sağlanır: $R_i \\leftarrow a_{ii}^{-1} R_i$.</div></div>
<div class="calc-card"><div class="card-title">(b) Pivot sütunları aksi takdirde sıfırdır</div><div class="card-body">Her pivot sütununda pivot tek sıfırdan farklı girişi. Pivotun <em>üstünü</em> de altını da elimine ederek sağlanır, işlem (III) yukarı doğru.</div></div>
<div class="calc-card"><div class="card-title">(c) Pivotlar sıkı merdiven oluşturur</div><div class="card-body">Aşağı indikçe pivotlar sıkı bir biçimde sağa doğru iner. Sıfır satırları, varsa, en alttadır. REF'ten miras alınır.</div></div>
<div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">REF'in aksine, bir matrisin RREF'i <em>tektir</em> — eliminasyon sırasından bağımsız. Bu RREF'i gerçek bir kanonik form yapar.</div></div>
</div>

<div class="calc-example"><div class="example-label">REF'TEN RREF'E</div><div class="example-body">Önceki örnekten devam edersek, REF şuydu:<br>$$\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 9 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & 0 \\end{array}\\right].$$<br>Tüm pivotlar zaten $1$. $a_{33}=1$ pivotunun üstünü elimine et: $R_1 \\leftarrow R_1 - R_3$ ile 1. satır = $[1, 2, 0, 9]$ olur. $a_{22}=1$ pivotunun üstünü elimine et: $R_1 \\leftarrow R_1 - 2 R_2$ ile 1. satır = $[1, 0, 0, 3]$ olur. RREF şudur:<br>$$\\left[\\begin{array}{ccc|c} 1 & 0 & 0 & 3 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & 0 \\end{array}\\right],$$<br>böylece $(x, y, z) = (3, 3, 0)$ çözümü son sütundan doğrudan okunur. Geri yerine koymaya gerek yok.</div></div>

<p class="l-text">RREF'te pivotsuz bir sütun varsa, ona karşılık gelen değişkene <strong>serbest</strong> denir: herhangi bir reel değer alabilir, pivot değişkenleri ise onun cinsinden ifade edilir. Bir serbest değişken daima sonsuz çözüm kümesinin habercisidir.</p>

<div class="calc-example"><div class="example-label">SERBEST DEĞİŞKENLİ RREF</div><div class="example-body">Eliminasyondan sonra şunu elde ettiğimizi varsayalım:<br>$$\\left[\\begin{array}{ccc|c} 1 & 0 & 3 & 7 \\\\ 0 & 1 & -1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{array}\\right].$$<br>1. ve 2. sütunlarda pivot var ($x$ ve $y$ temel); 3. sütunda pivot yok, dolayısıyla $z$ serbest. Herhangi bir $t \\in \\mathbb{R}$ için $z = t$ kuralım. O zaman $x = 7 - 3t$ ve $y = 2 + t$, böylece çözüm kümesi şu doğrudur:<br>$$\\mathbf{x}(t) \\;=\\; \\begin{bmatrix} 7 \\\\ 2 \\\\ 0 \\end{bmatrix} + t \\begin{bmatrix} -3 \\\\ 1 \\\\ 1 \\end{bmatrix}, \\qquad t \\in \\mathbb{R}.$$<br>Birinci vektör bir özel çözümdür; ikincisi $A$'nın sıfır uzayını gerer.</div></div>

<h2 class="lesson-title">5. Çözümlerin Varlığı ve Tekliği</h2>

<p class="l-text">Herhangi bir $A\\mathbf{x} = \\mathbf{b}$ doğrusal sistemi için tam üç olasılık vardır ve eklenmiş matrisin RREF'inden hangisi olduğu okunabilir:</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">TEK ÇÖZÜM</div><div class="compare-item">$A$'nın her sütununda RREF'te pivot var.</div><div class="compare-item">Serbest değişken yok.</div><div class="compare-item">Geometrik: hiperdüzlemler tek noktada buluşur.</div><div class="compare-item">$A$ kare ise, $\\det A \\neq 0$ ve $\\mathbf{x} = A^{-1} \\mathbf{b}$.</div></div>
<div class="compare-col"><div class="compare-title">ÇÖZÜM YOK</div><div class="compare-item">RREF'te $c \\neq 0$ ile $[0\\;0\\;\\cdots\\;0\\mid c]$ satırı görünür.</div><div class="compare-item">Denklemler birbiriyle çelişir.</div><div class="compare-item">Geometrik: hiperdüzlemlerin ortak noktası yok.</div><div class="compare-item">Sistem <em>tutarsızdır</em>.</div></div>
<div class="compare-col"><div class="compare-title">SONSUZ ÇÖZÜM</div><div class="compare-item">Tutarlı ve $A$'nın en az bir sütununda pivot eksik.</div><div class="compare-item">$\\geq 1$ serbest değişken; çözüm kümesi afin altuzaydır.</div><div class="compare-item">Geometrik: hiperdüzlemler bir doğru, düzlem veya daha yüksek boyutlu düz paylaşır.</div><div class="compare-item">Çözüm: özel + sıfır uzayı kombinasyonları.</div></div>
</div>

<p class="l-text">Üç durumu birleştiren tek ölçüt <strong>Rouché–Capelli teoremidir</strong>:</p>

<div class="calc-formula"><div class="formula-label">ROUCHÉ–CAPELLI</div><div class="formula-main">$$A\\mathbf{x} = \\mathbf{b}\\;\\text{ tutarlı}\\;\\iff\\; \\mathrm{rank}(A) \\;=\\; \\mathrm{rank}([A \\mid \\mathbf{b}]).$$ $$\\text{Tutarlı ise,}\\;\\#\\text{çözüm} = \\begin{cases} 1 & \\text{eğer } \\mathrm{rank}(A) = n, \\\\ \\infty & \\text{eğer } \\mathrm{rank}(A) < n. \\end{cases}$$</div></div>

<div class="calc-example"><div class="example-label">ÜÇ HIZLI DURUM</div><div class="example-body"><strong>Durum 1 (tek).</strong> $x + y = 3,\\; x - y = 1.$ RREF $[I \\mid (2,1)^T]$, yani $\\mathrm{rank}(A) = \\mathrm{rank}([A\\mid \\mathbf{b}]) = 2 = n$. Tek çözüm $(2, 1)$.<br><br><strong>Durum 2 (yok).</strong> $x + y = 3,\\; x + y = 5.$ Çıkarınca $0 = 2$ elde edilir. RREF eklenmiş satırı $[0\\;0\\mid 2]$ olur, $\\mathrm{rank}([A\\mid \\mathbf{b}]) = 2$ iken $\\mathrm{rank}(A) = 1$. Çözüm yok.<br><br><strong>Durum 3 (sonsuz).</strong> $x + y = 3,\\; 2x + 2y = 6.$ İkinci denklem birincinin iki katı. RREF eklenmiş $\\left[\\begin{smallmatrix} 1 & 1 & 3 \\\\ 0 & 0 & 0 \\end{smallmatrix}\\right]$, $\\mathrm{rank}(A) = \\mathrm{rank}([A\\mid \\mathbf{b}]) = 1 < 2 = n$. Bir serbest değişken, çözümler $\\{(3-t, t): t \\in \\mathbb{R}\\}$.</div></div>

<h2 class="lesson-title">6. Rank ve Rank Teoremi</h2>

<p class="l-text">$A$ matrisinin <strong>rankı</strong>, $\\mathrm{rank}(A)$ veya $r$ ile gösterilir, $A$'nın herhangi bir eşelon formundaki pivot sayısıdır. Eşdeğer olarak, sütun uzayının boyutudur ve aynı zamanda satır uzayının boyutudur. Rank eliminasyon sırasından bağımsızdır — her satır-denk eşelon form aynı pivot sayısını verir.</p>

<div class="calc-formula"><div class="formula-label">RANK TANIMI</div><div class="formula-main">$$\\mathrm{rank}(A) \\;=\\; \\#\\{\\mathrm{RREF}(A)\\text{'da pivotlar}\\} \\;=\\; \\dim C(A) \\;=\\; \\dim R(A).$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sınırlar</div><div class="card-body">$0 \\le \\mathrm{rank}(A) \\le \\min(m, n)$. Matris $\\mathrm{rank}(A) = m$ ise <em>tam satır rank</em>, $\\mathrm{rank}(A) = n$ ise <em>tam sütun rank</em>'tır.</div></div>
<div class="calc-card"><div class="card-title">Satır rankı = sütun rankı</div><div class="card-body">Önemsiz olmayan bir teorem: doğrusal bağımsız satırların maksimum sayısı doğrusal bağımsız sütunların maksimum sayısına eşittir. Her ikisi de pivot sayısına eşittir.</div></div>
<div class="calc-card"><div class="card-title">Transpoze altında rank</div><div class="card-body">$\\mathrm{rank}(A^T) = \\mathrm{rank}(A)$. $A$'nın satırları $A^T$'nin sütunlarıdır ve önceki gerçek iki rankı eşit olmaya zorlar.</div></div>
<div class="calc-card"><div class="card-title">Çarpımın rankı</div><div class="card-body">$\\mathrm{rank}(AB) \\le \\min(\\mathrm{rank}(A), \\mathrm{rank}(B))$. Matris çarpımı rankı asla artırmaz.</div></div>
</div>

<p class="l-text"><strong>Rank–nullity teoremi</strong> (rank teoremi veya boyut teoremi diye de geçer) doğrusal cebirin merkez sayma özdeşliğidir. <strong>Sıfır uzayının</strong> $N(A) = \\{\\mathbf{x} \\in \\mathbb{R}^n : A\\mathbf{x} = \\mathbf{0}\\}$ homojen sistemin çözüm kümesi olduğunu hatırlayın.</p>

<div class="calc-formula"><div class="formula-label">RANK–NULLITY TEOREMİ</div><div class="formula-main">$$\\boxed{\\;\\mathrm{rank}(A) \\;+\\; \\dim N(A) \\;=\\; n\\;}$$ burada $n$, $A$'nın sütun sayısıdır.</div></div>

<p class="l-text"><strong>İspat taslağı.</strong> $A$'yı RREF'e indirgeyin. Pivot sütunları temel değişkenlere karşılık gelir ve her pivot ranka bir katkı verir. Pivotsuz sütunlar serbest değişkenlere karşılık gelir ve her biri $\\dim N(A)$'ya bir katkı verir (her serbest değişken sıfır uzayının bir temel vektörünü parametrelendirir). Pivot sayısı artı serbest sayısı, toplam sütun sayısı $n$'ye eşittir.</p>

<div class="calc-example"><div class="example-label">RANK–NULLITY DOĞRULAMASI</div><div class="example-body">$A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{bmatrix}$ olsun. Satır indirge:<br>$R_2 \\leftarrow R_2 - 2 R_1$ ile $[0, 0, 0]$. $R_3 \\leftarrow R_3 - R_1$ ile $[0, -1, -2]$. Takasla ve yeniden ölçekle:<br>$$\\mathrm{RREF}(A) = \\begin{bmatrix} 1 & 0 & -1 \\\\ 0 & 1 & 2 \\\\ 0 & 0 & 0 \\end{bmatrix}.$$<br>İki pivot, dolayısıyla $\\mathrm{rank}(A) = 2$. 3. sütunda pivot yok, dolayısıyla $x_3$ serbest: $x_3 = t$ alınca, homojen çözüm $\\mathbf{x} = t(1, -2, 1)^T$. Yani $\\dim N(A) = 1$ ve $2 + 1 = 3 = n.$ $\\checkmark$</div></div>

<h2 class="lesson-title">7. Dört Temel Altuzay</h2>

<p class="l-text">Her $m \\times n$ matris $A$ ile birlikte dört kanonik altuzay vardır; ikisi $\\mathbb{R}^n$'de (sütun sayısı, giriş uzayı), ikisi de $\\mathbb{R}^m$'de (satır sayısı, çıkış uzayı) yaşar. Gilbert Strang tarafından sistemleştirilmiş olup $A$ hakkındaki her yapısal gerçeği yakalarlar.</p>

<div class="calc-formula"><div class="formula-label">DÖRT TEMEL ALTUZAY</div><div class="formula-main">$$\\begin{array}{l|l|l} \\text{Altuzay} & \\text{Tanım} & \\text{Boyut} \\\\ \\hline C(A) \\text{ — sütun uzayı} & \\{A\\mathbf{x} : \\mathbf{x} \\in \\mathbb{R}^n\\} \\subset \\mathbb{R}^m & r = \\mathrm{rank}(A) \\\\ N(A) \\text{ — sıfır uzayı} & \\{\\mathbf{x} \\in \\mathbb{R}^n : A\\mathbf{x} = \\mathbf{0}\\} & n - r \\\\ R(A) \\text{ — satır uzayı} & C(A^T) \\subset \\mathbb{R}^n & r \\\\ N(A^T) \\text{ — sol sıfır uzayı} & \\{\\mathbf{y} \\in \\mathbb{R}^m : A^T \\mathbf{y} = \\mathbf{0}\\} & m - r \\end{array}$$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sütun uzayı $C(A)$</div><div class="card-body">$A$'nın sütunlarının tüm doğrusal kombinasyonları. $A\\mathbf{x} = \\mathbf{b}$ ancak ve ancak $\\mathbf{b} \\in C(A)$ ise çözüme sahiptir. Temel, <em>orijinal</em> $A$'nın pivot sütunlarıdır (RREF'in değil — RREF satırları karıştırır ve sütun uzayını değiştirir).</div></div>
<div class="calc-card"><div class="card-title">Sıfır uzayı $N(A)$</div><div class="card-body">Homojen sistem $A\\mathbf{x} = \\mathbf{0}$'ın tüm çözümleri. Temel, RREF'te her serbest değişkeni sırayla $1$ ve diğerlerini $0$ yapıp pivot değişkenleri okuyarak elde edilir.</div></div>
<div class="calc-card"><div class="card-title">Satır uzayı $R(A)$</div><div class="card-body">$A$'nın satırlarının tüm doğrusal kombinasyonları. Temel, $A$'nın herhangi bir eşelon formunun sıfır olmayan satırlarıdır (satır işlemleri satır uzayını korur).</div></div>
<div class="calc-card"><div class="card-title">Sol sıfır uzayı $N(A^T)$</div><div class="card-body">$\\mathbf{y}^T A = \\mathbf{0}^T$ olan tüm satır vektörleri $\\mathbf{y}^T$. Bunlar tam olarak $A$'nın satırları arasındaki doğrusal bağımlılıklardır — eliminasyon sırasında hangi satırların sıfırlandığını belgelerler.</div></div>
</div>

<p class="l-text"><strong>Dikgenlik ilişkileri.</strong> Dört altuzaydan ikisi $\\mathbb{R}^n$'de (satır ve sıfır), ikisi de $\\mathbb{R}^m$'de (sütun ve sol sıfır) bulunur. Her bir taşıyıcı uzayda iki altuzay <em>dikey tümleyenler</em>dir:</p>

<div class="calc-formula"><div class="formula-label">DİKGENLİK</div><div class="formula-main">$$N(A) \\;=\\; R(A)^{\\perp} \\quad \\mathbb{R}^n\\text{'de}, \\qquad N(A^T) \\;=\\; C(A)^{\\perp} \\quad \\mathbb{R}^m\\text{'de}.$$</div></div>

<p class="l-text">Birinci özdeşlik her sıfır uzayı vektörünün $A$'nın her satırına dik olduğunu söyler; bu doğrudan $A\\mathbf{x} = \\mathbf{0}$'dan çıkar — $A$'nın her satırı $\\mathbf{x}$ ile noktasal çarpıldığında $A\\mathbf{x}$'in karşılık gelen girişini verir, yani $0$. İkincisi aynı ifadenin $A^T$'ye uygulanmasıdır.</p>

<div class="calc-example"><div class="example-label">DÖRT ALTUZAYIN HEPSİ İÇİN TEMEL BULMA</div><div class="example-body">$A = \\begin{bmatrix} 1 & 2 & 3 & 1 \\\\ 2 & 4 & 6 & 2 \\\\ 1 & 1 & 1 & 2 \\end{bmatrix}$ alalım. Elimine et: $R_2 \\to R_2 - 2 R_1$ tüm sıfırlar verir. $R_3 \\to R_3 - R_1$ ile $[0, -1, -2, 1]$. Sonra $R_1 \\to R_1 + 2 R_3$ ($R_3$'ü $[0,1,2,-1]$'e yeniden ölçeklemekten sonra):<br>$$\\mathrm{RREF}(A) = \\begin{bmatrix} 1 & 0 & -1 & 3 \\\\ 0 & 1 & 2 & -1 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}.$$<br>Pivot sütunları: 1 ve 2. Yani $r = 2$. <strong>Sütun uzayı</strong> temeli: orijinal $A$'nın 1. ve 2. sütunları: $\\{(1,2,1)^T, (2,4,1)^T\\}$. <strong>Satır uzayı</strong> temeli: RREF'in sıfır olmayan satırları: $\\{(1,0,-1,3), (0,1,2,-1)\\}$. <strong>Sıfır uzayı</strong> temeli: önce serbest değişkenler $x_3 = 1, x_4 = 0$ sonra $x_3 = 0, x_4 = 1$ alın: $\\{(1,-2,1,0)^T, (-3,1,0,1)^T\\}$. <strong>Sol sıfır uzayı</strong> temeli: $A$'nın 2. satırı 1. satırın iki katı, dolayısıyla $\\mathbf{y}^T = (-2, 1, 0)$ $\\mathbf{y}^T A = \\mathbf{0}^T$'yi sağlar; o tek vektör bir temeldir. Boyutlar: $r=2,\\;n-r=2,\\;r=2,\\;m-r=1$ — hepsi tutarlı.</div></div>

<h2 class="lesson-title">8. $LU$ Ayrışımı</h2>

<p class="l-text">$n \\times n$ bir $A$ matrisinde Gauss eliminasyonu sırasında (satır takası gerekmediğinde), her $R_k \\leftarrow R_k - \\ell_{ki} R_i$ eliminasyon adımı $A$'yı soldan $E_{ki}$ elemanter alt-üçgensel matrisle çarpar; $E_{ki}$'nin $(k, i)$ konumunda $-\\ell_{ki}$ ve köşegende $1$'ler bulunur. Tüm bu matrislerin çarpımı $A$'yı üst üçgensel $U$'ya indirger:</p>

<div class="calc-formula"><div class="formula-label">$LU$ TÜRETİMİ</div><div class="formula-main">$$E_k \\cdots E_2 E_1 \\,A \\;=\\; U \\quad \\Longrightarrow \\quad A \\;=\\; (E_1^{-1} E_2^{-1} \\cdots E_k^{-1})\\,U \\;=\\; LU.$$</div></div>

<p class="l-text">Mucize şudur ki $L = E_1^{-1} E_2^{-1} \\cdots E_k^{-1}$ basitçe $(k,i)$ girişinde o eliminasyon adımında kullanılan $\\ell_{ki}$ çarpanını içeren birim alt-üçgen matristir — ekstra hesap yok. $A = LU$ ayrışımını eliminasyonun ücretsiz bir yan ürünü olarak elde ederiz, burada</p>

<div class="calc-formula"><div class="formula-main">$$L = \\begin{bmatrix} 1 & & & \\\\ \\ell_{21} & 1 & & \\\\ \\ell_{31} & \\ell_{32} & 1 & \\\\ \\vdots & \\vdots & \\ddots & \\ddots \\\\ \\ell_{n1} & \\ell_{n2} & \\cdots & \\ell_{n,n-1} & 1 \\end{bmatrix}, \\qquad U = \\begin{bmatrix} u_{11} & u_{12} & \\cdots & u_{1n} \\\\ & u_{22} & \\cdots & u_{2n} \\\\ & & \\ddots & \\vdots \\\\ & & & u_{nn} \\end{bmatrix}.$$</div></div>

<div class="calc-example"><div class="example-label">$3 \\times 3$ BİR MATRİSİN $LU$'su</div><div class="example-body">3. Bölümden $A = \\begin{bmatrix} 1 & 2 & 1 \\\\ 2 & 5 & 2 \\\\ 3 & 7 & 4 \\end{bmatrix}$'nın eliminasyonuna devam edersek, çarpanlar $\\ell_{21} = 2,\\; \\ell_{31} = 3,\\; \\ell_{32} = 1$'di ve üst üçgensel sonuç $U = \\begin{bmatrix} 1 & 2 & 1 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$ idi. Dolayısıyla<br>$$L = \\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 3 & 1 & 1 \\end{bmatrix}, \\qquad U = \\begin{bmatrix} 1 & 2 & 1 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}, \\qquad LU = \\begin{bmatrix} 1 & 2 & 1 \\\\ 2 & 5 & 2 \\\\ 3 & 7 & 4 \\end{bmatrix} = A. \\;\\checkmark$$</div></div>

<p class="l-text"><strong>$LU$ ile $A\\mathbf{x} = \\mathbf{b}$ çözmek.</strong> $A = LU$ yerine koyarsak: denklem $LU\\mathbf{x} = \\mathbf{b}$ olur. Ara vektör $\\mathbf{y} = U\\mathbf{x}$ tanımlayalım. O zaman $L\\mathbf{y} = \\mathbf{b}$. $L$ alt-üçgensel olduğundan, $\\mathbf{y}$ için <strong>ileri yerine koyma</strong> ile (yukarıdan aşağı) çözün. Sonra $U\\mathbf{x} = \\mathbf{y}$ üst-üçgenseldir: $\\mathbf{x}$ için <strong>geri yerine koyma</strong> ile (aşağıdan yukarı) çözün. Her üçgensel çözüm $O(n^2)$ işlem maliyetlidir.</p>

<div class="calc-example"><div class="example-label">YUKARIDAKİ $LU$ İLE $A\\mathbf{x} = \\mathbf{b}$ ÇÖZME</div><div class="example-body">$\\mathbf{b} = (9, 21, 30)^T$ ile $L \\mathbf{y} = \\mathbf{b}$'yi ileri yerine koymayla çöz:<br>$y_1 = 9,\\quad 2(9) + y_2 = 21 \\Rightarrow y_2 = 3,\\quad 3(9) + 1(3) + y_3 = 30 \\Rightarrow y_3 = 0.$<br>Yani $\\mathbf{y} = (9, 3, 0)^T$. $U \\mathbf{x} = \\mathbf{y}$'yi geri yerine koymayla çöz:<br>$z = 0,\\quad y = 3,\\quad x + 2(3) + 1(0) = 9 \\Rightarrow x = 3.$<br>$\\mathbf{x} = (3, 3, 0)^T$, 3. Bölümle eşleşir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$LU$ neden yararlıdır</div><div class="card-body">Aynı $A$ ile çok sayıda sağ taraf $\\mathbf{b}_1, \\mathbf{b}_2, \\ldots, \\mathbf{b}_K$ için $A\\mathbf{x} = \\mathbf{b}_k$ çözmek gerektiğinde, bir kere ayrıştır ($\\tfrac{2}{3} n^3$ iş) ve sonra her yeni çözüm yalnızca $O(n^2)$ maliyetlidir.</div></div>
<div class="calc-card"><div class="card-title">Pivotlama</div><div class="card-body">Bir pivot sıfır veya sayısal olarak küçük olduğunda satır takasları gerekir. Ayrışım o zaman $PA = LU$ formunu alır; $P$ takasları kaydeden bir permütasyon matrisidir. Her tersinir kare matris böyle bir $PA = LU$ ayrışımını kabul eder.</div></div>
<div class="calc-card"><div class="card-title">$LU$ ile determinant</div><div class="card-body">Birim-alt $L$ için $\\det A = \\det L \\cdot \\det U = 1 \\cdot (u_{11} u_{22} \\cdots u_{nn})$. Pivotlamayla, $\\det A = (-1)^{\\#\\text{takas}} \\prod u_{ii}$.</div></div>
<div class="calc-card"><div class="card-title">Simetrik pozitif tanımlı</div><div class="card-body">$A$ simetrik ve pozitif tanımlı ise, $LU$ ayrışımı $R$ üst-üçgensel olmak üzere $A = R^T R$ Cholesky ayrışımına özelleşir; bu hem depolamayı hem işi yarıya indirir.</div></div>
</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<p class="l-text">Aşağıdaki klasik alıştırmalar dersin her tekniğini pekiştirir. Her biri birkaç dakikada elle çözülebilir; tam adım adım çözümler kendinizi kontrol edebilmeniz için verilmiştir.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — $3 \\times 3$ SİSTEMİ GAUSS ELİMİNASYONU İLE ÇÖZ</div><div class="example-body"><strong>Soru.</strong> Şu sistemi çöz:<br>$$\\begin{cases} 2x + y - z = 8, \\\\ -3x - y + 2z = -11, \\\\ -2x + y + 2z = -3. \\end{cases}$$<br><strong>Çözüm.</strong> Ekle ve elimine et. Pivot $a_{11} = 2$.<br>$$\\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ -3 & -1 & 2 & -11 \\\\ -2 & 1 & 2 & -3 \\end{array}\\right] \\xrightarrow{R_2 + \\tfrac{3}{2} R_1,\\; R_3 + R_1} \\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ 0 & 1/2 & 1/2 & 1 \\\\ 0 & 2 & 1 & 5 \\end{array}\\right].$$<br>Pivot $a_{22} = 1/2$. $R_3 \\leftarrow R_3 - 4 R_2$ ile $[0, 0, -1, 1]$:<br>$$\\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ 0 & 1/2 & 1/2 & 1 \\\\ 0 & 0 & -1 & 1 \\end{array}\\right].$$<br>Geri yerine koy: $-z = 1 \\Rightarrow z = -1$; $\\tfrac12 y + \\tfrac12(-1) = 1 \\Rightarrow y = 3$; $2x + 3 - (-1) = 8 \\Rightarrow x = 2.$<br><strong>Cevap.</strong> $(x, y, z) = (2, 3, -1).$ Doğrula: $2(2)+3-(-1)=8\\;\\checkmark,\\;-3(2)-3+2(-1)=-11\\;\\checkmark,\\;-2(2)+3+2(-1)=-3\\;\\checkmark.$</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — BİR MATRİSİN RANKINI BUL</div><div class="example-body"><strong>Soru.</strong> $\\mathrm{rank}(A)$'yı belirle:<br>$$A = \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 2 & 4 & 6 & 8 \\\\ 1 & 3 & 5 & 7 \\\\ 3 & 5 & 7 & 9 \\end{bmatrix}.$$<br><strong>Çözüm.</strong> $R_2 \\leftarrow R_2 - 2 R_1$ 2. satırı yok eder: $[0,0,0,0]$. $R_3 \\leftarrow R_3 - R_1$ ile $[0,1,2,3]$. $R_4 \\leftarrow R_4 - 3 R_1$ ile $[0,-1,-2,-3]$. Sonra $R_4 \\leftarrow R_4 + R_3$ ile $[0,0,0,0]$:<br>$$\\xrightarrow{} \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 1 & 2 & 3 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix} \\xrightarrow{R_2 \\leftrightarrow R_3} \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 0 & 1 & 2 & 3 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}.$$<br>1. ve 2. sütunlarda iki pivot.<br><strong>Cevap.</strong> $\\mathrm{rank}(A) = 2.$ Sonuç olarak rank–nullity ile $\\dim N(A) = 4 - 2 = 2.$</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — SIFIR UZAYININ TEMELİ</div><div class="example-body"><strong>Soru.</strong> Aşağıdaki $A$ için $N(A)$'nın bir temelini bul:<br>$$A = \\begin{bmatrix} 1 & 2 & 0 & -1 \\\\ 0 & 0 & 1 & 2 \\\\ 1 & 2 & 1 & 1 \\end{bmatrix}.$$<br><strong>Çözüm.</strong> $R_3 \\leftarrow R_3 - R_1$ ile $[0, 0, 1, 2]$ — bu 2. satırla aynı; sonra $R_3 \\leftarrow R_3 - R_2 = [0,0,0,0]$:<br>$$\\mathrm{RREF}(A) = \\begin{bmatrix} 1 & 2 & 0 & -1 \\\\ 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}.$$<br>Pivotlar 1. ve 3. sütunlarda, dolayısıyla $x_1, x_3$ temel ve $x_2, x_4$ serbest. $x_1 = -2 x_2 + x_4$ ve $x_3 = -2 x_4$ çöz.<br>$(x_2, x_4) = (1, 0)$ koy: $\\mathbf{n}_1 = (-2, 1, 0, 0)^T.$<br>$(x_2, x_4) = (0, 1)$ koy: $\\mathbf{n}_2 = (1, 0, -2, 1)^T.$<br><strong>Cevap.</strong> $N(A) = \\mathrm{span}\\{\\mathbf{n}_1, \\mathbf{n}_2\\}.$ Doğrula: $A \\mathbf{n}_1 = (1(-2)+2(1)+0+0,\\;0+0+1(0)+2(0),\\;1(-2)+2(1)+0+0)^T = \\mathbf{0}\\;\\checkmark$; benzer şekilde $A \\mathbf{n}_2 = \\mathbf{0}.\\;\\checkmark$</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — $3 \\times 3$ MATRİSİN $LU$ AYRIŞIMI</div><div class="example-body"><strong>Soru.</strong> $A = \\begin{bmatrix} 2 & 1 & 1 \\\\ 4 & 3 & 3 \\\\ 8 & 7 & 9 \\end{bmatrix}$ için $A = LU$ olacak şekilde $L$ ve $U$'yu bul.<br><strong>Çözüm.</strong> Pivot $a_{11} = 2$.<br>$\\ell_{21} = 4/2 = 2$: $R_2 \\leftarrow R_2 - 2 R_1$ ile $[0, 1, 1]$.<br>$\\ell_{31} = 8/2 = 4$: $R_3 \\leftarrow R_3 - 4 R_1$ ile $[0, 3, 5]$.<br>Pivot $a_{22} = 1$. $\\ell_{32} = 3/1 = 3$: $R_3 \\leftarrow R_3 - 3 R_2$ ile $[0, 0, 2]$.<br>$$U = \\begin{bmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 2 \\end{bmatrix}, \\qquad L = \\begin{bmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 4 & 3 & 1 \\end{bmatrix}.$$<br>$LU$ kontrolü: $LU$'nun 3. satırı $4(2,1,1) + 3(0,1,1) + 1(0,0,2) = (8, 7, 9).\\;\\checkmark$<br><strong>Cevap.</strong> $A = LU$, yukarıdaki $L$ ve $U$ ile. Bonus: $\\det A = (1)(2 \\cdot 1 \\cdot 2) = 4.$</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — $A\\mathbf{x} = \\mathbf{b}$ TUTARLILIĞI</div><div class="example-body"><strong>Soru.</strong> Sistemin tutarlı olup olmadığına karar ver. Tutarlıysa çözüm kümesini tanımla.<br>$$\\begin{cases} x + y + z = 6, \\\\ 2x - y + z = 3, \\\\ 3x + 0 y + 2z = 9, \\\\ x + 2y + z = 8. \\end{cases}$$<br><strong>Çözüm.</strong> Ekle ve elimine et.<br>$$\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 2 & -1 & 1 & 3 \\\\ 3 & 0 & 2 & 9 \\\\ 1 & 2 & 1 & 8 \\end{array}\\right] \\xrightarrow{R_2-2R_1,\\; R_3-3R_1,\\; R_4-R_1} \\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & 1 & 0 & 2 \\end{array}\\right].$$<br>$R_3 \\leftarrow R_3 - R_2 = [0,0,0,0]$. $R_4 \\leftarrow R_4 + \\tfrac13 R_2 = [0, 0, -\\tfrac13, -1]$:<br>$$\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & -3 & -1 & -9 \\\\ 0 & 0 & -1/3 & -1 \\\\ 0 & 0 & 0 & 0 \\end{array}\\right].$$<br>$A$'da üç pivot, $[A\\mid \\mathbf{b}]$'de üç pivot (son satır gerçekten sıfır, $c \\neq 0$ ile $[0\\,0\\,0\\mid c]$ değil). Yani $\\mathrm{rank}(A) = \\mathrm{rank}([A\\mid \\mathbf{b}]) = 3 = n$.<br><strong>Sonuç: tutarlı, tek çözüm.</strong> Geri yerine koy: $-\\tfrac13 z = -1 \\Rightarrow z = 3$; $-3 y - 3 = -9 \\Rightarrow y = 2$; $x + 2 + 3 = 6 \\Rightarrow x = 1.$ Çözüm: $(1, 2, 3).$<br><br><strong>Varyant.</strong> $\\mathbf{b}$'nin son girişi $8$ yerine $9$ olsaydı, eklenmiş eliminasyonun son satırı $[0\\;0\\;0\\mid -2]$ olur, eklenmiş rankı $\\mathrm{rank}(A) = 3$ iken $4$'e yükselirdi — sistem <strong>tutarsız</strong> olurdu.</div></div>

<h2 class="lesson-title">Özet</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$A\\mathbf{x} = \\mathbf{b}$</div><div class="card-body">Her doğrusal sistemin matris formu. Her denklem bir hiperdüzlem; çözüm kümesi kesişimleri.</div><div class="card-formula">$A \\in \\mathbb{R}^{m \\times n}$</div></div>
<div class="calc-card"><div class="card-title">Gauss eliminasyonu</div><div class="card-body">Satır işlemleri $\\Rightarrow$ satır eşelon form $\\Rightarrow$ geri yerine koyma. Maliyet $\\tfrac{2}{3} n^3$.</div><div class="card-formula">REF</div></div>
<div class="calc-card"><div class="card-title">RREF</div><div class="card-body">Tek kanonik form: pivotlar $1$'e eşit ve sütunlarında tek sıfırdan farklı giriş. Çözüm doğrudan okunabilir.</div><div class="card-formula">$\\mathrm{RREF}(A)$</div></div>
<div class="calc-card"><div class="card-title">Rouché–Capelli</div><div class="card-body">Tutarlı $\\iff \\mathrm{rank}(A) = \\mathrm{rank}([A\\mid\\mathbf{b}])$. O zaman $\\mathrm{rank} = n$ ise tek, yoksa sonsuz.</div><div class="card-formula">$r(A) \\stackrel{?}{=} r([A\\mid\\mathbf{b}])$</div></div>
<div class="calc-card"><div class="card-title">Rank–nullity</div><div class="card-body">$\\mathrm{rank}(A) + \\dim N(A) = n$. Pivotları serbest değişkenlere karşı sayar.</div><div class="card-formula">$r + (n - r) = n$</div></div>
<div class="calc-card"><div class="card-title">Dört altuzay</div><div class="card-body">$C(A), N(A), R(A), N(A^T)$ — boyutları $r, n-r, r, m-r$; çiftler halinde dik.</div><div class="card-formula">$N(A) \\perp R(A)$</div></div>
<div class="calc-card"><div class="card-title">$LU$ ayrışımı</div><div class="card-body">Eliminasyon çarpanlarından $A = LU$. $L \\mathbf{y} = \\mathbf{b}$ sonra $U \\mathbf{x} = \\mathbf{y}$ çöz.</div><div class="card-formula">$A = LU$</div></div>
<div class="calc-card"><div class="card-title">$PA = LU$</div><div class="card-body">Kısmi pivotlamayla genelleme. Permütasyon $P$ satır takaslarını kaydeder. Her tersinir $A$ bunu kabul eder.</div><div class="card-formula">$PA = LU$</div></div>
</div>
`

};
