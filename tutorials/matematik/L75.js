window.LISE_MAT_L75 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Cramer's rule is a beautifully clean formula:</strong> if you have a linear system with as many equations as unknowns, and the coefficient determinant is non-zero, then every unknown is the ratio of two determinants. No row reduction, no inverse matrix, no back-substitution. You set up a small number of determinants, evaluate each, divide, and you are done. Gabriel Cramer published the rule in 1750, and it has been part of the standard high-school and undergraduate curriculum ever since.</p>

<p class="l-text">In this lesson we state the rule carefully for $n \\times n$ systems, prove (informally) why it works using the inverse-matrix formula $X = A^{-1} B$, then walk through the 2&times;2 and 3&times;3 cases with full numerical examples. We will also see exactly what to do when the rule "fails" (when the coefficient determinant is zero) — the situation splits into <em>no solution</em> or <em>infinitely many solutions</em>, and the determinants $\\Delta_i$ tell you which one it is. The lesson closes with a head-to-head comparison with Gaussian elimination so you know when Cramer is faster and when it is not.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State Cramer's rule precisely for an $n \\times n$ linear system and identify each ingredient</li>
<li>Build the auxiliary determinants $\\Delta, \\Delta_1, \\Delta_2, \\ldots, \\Delta_n$ by column-substitution</li>
<li>Solve any 2&times;2 system with Cramer in under a minute by mental arithmetic</li>
<li>Solve a 3&times;3 system with Cramer using Sarrus' rule for each determinant</li>
<li>Diagnose what $\\Delta = 0$ means: split between <em>no solution</em> and <em>infinitely many solutions</em> using the $\\Delta_i$ values</li>
<li>Compare Cramer with Gaussian elimination and decide which method to use in an exam</li>
</ul>
</div>

<h2 class="lesson-title">1. The Setup: Linear Systems in Matrix Form</h2>

<div class="calc-highlight"><strong>The starting point is a linear system written compactly.</strong> If you have $n$ equations in $n$ unknowns, the whole system can be packed into a single matrix equation $A X = B$, where $A$ is the $n \\times n$ coefficient matrix, $X$ is the column of unknowns, and $B$ is the column of constants on the right-hand side.</div>

<p class="l-text">Take a concrete example. The 2&times;2 system</p>

<div class="calc-formula"><div class="formula-label">A 2&times;2 SYSTEM</div><div class="formula-main">$$\\begin{cases} 2x + 3y = 8 \\\\ x - y = 1 \\end{cases}$$</div></div>

<p class="l-text">can be re-written as a matrix equation by collecting the coefficients of $x$ and $y$ into a 2&times;2 matrix, the unknowns into a column, and the right-hand sides into a column:</p>

<div class="calc-formula"><div class="formula-label">MATRIX FORM</div><div class="formula-main">$$\\underbrace{\\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}}_{A} \\underbrace{\\begin{pmatrix} x \\\\ y \\end{pmatrix}}_{X} \\;=\\; \\underbrace{\\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}}_{B}$$</div><div class="formula-sub">A is the coefficient matrix, X is the column of unknowns, B is the column of right-hand-side constants. The matrix equation $AX = B$ contains exactly the same information as the original two scalar equations.</div></div>

<p class="l-text">For a 3&times;3 system, the same idea applies: $A$ is 3&times;3, and both $X$ and $B$ are columns of length 3. In general, for an $n \\times n$ system, $A$ is $n \\times n$ and $X, B$ are $n \\times 1$ columns. From this lesson on, we will always think of a linear system in this compact form.</p>

<div class="l-note"><strong>Reminder from lesson 73:</strong> the <em>determinant</em> of a square matrix $A$, written $\\det(A)$ or $|A|$, is a single number computed from its entries. For 2&times;2 it is $ad - bc$. For 3&times;3 it is the Sarrus expansion. We will use both formulas constantly in this lesson — review them now if they feel rusty.</div>

<h2 class="lesson-title">2. Statement of Cramer's Rule</h2>

<div class="calc-highlight"><strong>The rule, in one sentence:</strong> every unknown is the determinant of a "modified" coefficient matrix divided by the determinant of the original coefficient matrix. The modification is a column substitution — replace the $i$-th column by the right-hand side $B$ — and that gives you the value of $x_i$.</div>

<div class="calc-formula"><div class="formula-label">CRAMER'S RULE — $n \\times n$ SYSTEM</div><div class="formula-main">$$x_i \\;=\\; \\frac{\\det(A_i)}{\\det(A)} \\quad\\text{ for } i = 1, 2, \\ldots, n, \\quad\\text{ provided } \\det(A) \\neq 0$$</div><div class="formula-sub">Here $A_i$ is the matrix you get from $A$ by replacing the $i$-th column with the column $B$. The denominator $\\det(A)$ is the same for every unknown; only the numerator changes from one unknown to the next.</div></div>

<p class="l-text">Two pieces of terminology in widespread use:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The principal determinant</div><div class="card-body">$\\Delta = \\det(A)$, the determinant of the coefficient matrix. The denominator in every Cramer formula. If $\\Delta = 0$, Cramer cannot be used directly.</div></div>
<div class="calc-card"><div class="card-title">The auxiliary determinants</div><div class="card-body">$\\Delta_i = \\det(A_i)$, where $A_i$ is $A$ with column $i$ replaced by $B$. One auxiliary determinant per unknown. Often written $\\Delta_x, \\Delta_y, \\Delta_z, \\ldots$.</div></div>
<div class="calc-card"><div class="card-title">The solution</div><div class="card-body">$x_i = \\Delta_i / \\Delta$. For 2&times;2: $x = \\Delta_x / \\Delta$ and $y = \\Delta_y / \\Delta$. For 3&times;3: $x = \\Delta_x / \\Delta$, $y = \\Delta_y / \\Delta$, $z = \\Delta_z / \\Delta$.</div></div>
</div>

<p class="l-text">Notice the structure: you compute one denominator and as many numerators as there are unknowns. For a 2&times;2 system that is three determinants in total; for a 3&times;3 system it is four; for an $n \\times n$ system it is $n + 1$. Each is a self-contained calculation.</p>

<h2 class="lesson-title">3. Why It Works: The Idea Behind the Formula</h2>

<div class="calc-highlight"><strong>You do not need the full proof to use Cramer.</strong> But seeing the idea makes the column-substitution step feel less like a magic trick and more like a consequence of one identity you already know: $X = A^{-1} B$.</div>

<p class="l-text">From the matrix equation $A X = B$, if $A$ is invertible (i.e. $\\det(A) \\neq 0$), we can multiply both sides by $A^{-1}$ on the left:</p>

<div class="calc-formula"><div class="formula-label">SOLVING VIA THE INVERSE MATRIX</div><div class="formula-main">$$A X = B \\quad\\Longrightarrow\\quad X = A^{-1} B$$</div></div>

<p class="l-text">The inverse matrix can be written using the <em>adjugate</em> (also called the classical adjoint), which is built from cofactors:</p>

<div class="calc-formula"><div class="formula-label">INVERSE VIA ADJUGATE</div><div class="formula-main">$$A^{-1} \\;=\\; \\frac{1}{\\det(A)} \\, \\mathrm{adj}(A)$$</div><div class="formula-sub">$\\mathrm{adj}(A)$ is the transpose of the matrix of cofactors. Its $(i, j)$-entry is $(-1)^{i+j}$ times the determinant of the $(j, i)$-minor of $A$.</div></div>

<p class="l-text">When you multiply $\\mathrm{adj}(A)$ by the column $B$ and look at the $i$-th entry of the result, what comes out is exactly the cofactor expansion of a determinant — specifically, the determinant of the matrix $A_i$ obtained by replacing column $i$ of $A$ with the column $B$. Dividing by $\\det(A)$ gives the Cramer formula:</p>

<div class="calc-formula"><div class="formula-label">FROM ADJUGATE TO CRAMER</div><div class="formula-main">$$x_i \\;=\\; (A^{-1} B)_i \\;=\\; \\frac{1}{\\det(A)} \\cdot \\det(A_i) \\;=\\; \\frac{\\det(A_i)}{\\det(A)}$$</div><div class="formula-sub">So Cramer's rule is just the inverse-matrix formula spelled out one entry at a time. The "column substitution" is bookkeeping for the cofactor expansion.</div></div>

<div class="l-note"><strong>You don't have to memorise the adjugate derivation</strong> for this lesson. The point is: the rule is not arbitrary — it is the inverse-matrix formula written one component at a time. That is also why the rule fails exactly when the inverse fails to exist, i.e. when $\\det(A) = 0$.</div>

<h2 class="lesson-title">4. The 2&times;2 Case Worked in Full</h2>

<div class="calc-highlight"><strong>For a 2&times;2 system, Cramer's rule reduces to three small determinants.</strong> If you can compute a 2&times;2 determinant in five seconds, you can solve any 2&times;2 system in well under a minute. This is the case to memorise.</div>

<p class="l-text">Consider the general 2&times;2 system</p>

<div class="calc-formula"><div class="formula-label">GENERAL 2&times;2 SYSTEM</div><div class="formula-main">$$\\begin{cases} a_{11} x + a_{12} y = b_1 \\\\ a_{21} x + a_{22} y = b_2 \\end{cases}$$</div></div>

<p class="l-text">In matrix form $A X = B$ with</p>

<div class="calc-formula"><div class="formula-label">A, X, B</div><div class="formula-main">$$A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}, \\quad X = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad B = \\begin{pmatrix} b_1 \\\\ b_2 \\end{pmatrix}$$</div></div>

<p class="l-text">The three determinants are:</p>

<div class="calc-formula"><div class="formula-label">THE THREE DETERMINANTS</div><div class="formula-main">$$\\Delta \\;=\\; \\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} \\;=\\; a_{11} a_{22} - a_{12} a_{21}$$ $$\\Delta_x \\;=\\; \\begin{vmatrix} \\mathbf{b_1} & a_{12} \\\\ \\mathbf{b_2} & a_{22} \\end{vmatrix} \\;=\\; b_1 a_{22} - a_{12} b_2$$ $$\\Delta_y \\;=\\; \\begin{vmatrix} a_{11} & \\mathbf{b_1} \\\\ a_{21} & \\mathbf{b_2} \\end{vmatrix} \\;=\\; a_{11} b_2 - b_1 a_{21}$$</div><div class="formula-sub">Bold entries mark the column substitution. For $\\Delta_x$, the first column has been replaced by B. For $\\Delta_y$, the second column has been replaced by B.</div></div>

<p class="l-text">And the solution:</p>

<div class="calc-formula"><div class="formula-label">CRAMER FOR 2&times;2</div><div class="formula-main">$$x \\;=\\; \\frac{\\Delta_x}{\\Delta} \\;=\\; \\frac{b_1 a_{22} - a_{12} b_2}{a_{11} a_{22} - a_{12} a_{21}}, \\qquad y \\;=\\; \\frac{\\Delta_y}{\\Delta} \\;=\\; \\frac{a_{11} b_2 - b_1 a_{21}}{a_{11} a_{22} - a_{12} a_{21}}$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 2&times;2</div><div class="example-body">Solve $\\begin{cases} 2x + 3y = 8 \\\\ x - y = 1 \\end{cases}$.<br><br><strong>Step 1.</strong> Identify $A$ and $B$: $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}$, $B = \\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}$.<br><br><strong>Step 2.</strong> Principal determinant: $\\Delta = (2)(-1) - (3)(1) = -2 - 3 = -5$.<br><br><strong>Step 3.</strong> Replace column 1 of $A$ with $B$ and compute: $\\Delta_x = \\begin{vmatrix} 8 & 3 \\\\ 1 & -1 \\end{vmatrix} = (8)(-1) - (3)(1) = -8 - 3 = -11$.<br><br><strong>Step 4.</strong> Replace column 2 of $A$ with $B$ and compute: $\\Delta_y = \\begin{vmatrix} 2 & 8 \\\\ 1 & 1 \\end{vmatrix} = (2)(1) - (8)(1) = 2 - 8 = -6$.<br><br><strong>Step 5.</strong> Divide: $x = -11 / -5 = \\mathbf{11/5}$, $y = -6 / -5 = \\mathbf{6/5}$.<br><br><strong>Check.</strong> $2(11/5) + 3(6/5) = 22/5 + 18/5 = 40/5 = 8$ &check;. $11/5 - 6/5 = 5/5 = 1$ &check;.</div></div>

<div class="calc-graph"><div id="plot-l75-22-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a visual summary of the three 2&times;2 determinants in the worked example. The principal determinant $\\Delta$ uses the original coefficients. $\\Delta_x$ replaces the first column with the right-hand-side vector (8, 1). $\\Delta_y$ replaces the second column. The substituted column is highlighted in orange.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function cellAnnot(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:18,color:col||'#e8e8e8'}};}
function frame(x0,x1,y0,y1,col){return {type:'rect',x0:x0,x1:x1,y0:y0,y1:y1,line:{color:col||'rgba(255,255,255,0.4)',width:1.5},fillcolor:'rgba(0,0,0,0)'};}
function labelAnnot(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:14,color:col||'#3b82f6',family:'Geist'}};}
var annotsE=[];var shapesE=[];
annotsE.push(labelAnnot(0.5,2.2,'<b>Δ = −5</b>','#3b82f6'));
annotsE.push(cellAnnot(0,1.4,'2'));annotsE.push(cellAnnot(1,1.4,'3'));
annotsE.push(cellAnnot(0,0.7,'1'));annotsE.push(cellAnnot(1,0.7,'−1'));
shapesE.push(frame(-0.4,1.4,0.3,1.8));
annotsE.push(labelAnnot(3.5,2.2,'<b>Δ_x = −11</b>','#f59e0b'));
annotsE.push(cellAnnot(3,1.4,'<b>8</b>','#f59e0b'));annotsE.push(cellAnnot(4,1.4,'3'));
annotsE.push(cellAnnot(3,0.7,'<b>1</b>','#f59e0b'));annotsE.push(cellAnnot(4,0.7,'−1'));
shapesE.push(frame(2.6,4.4,0.3,1.8));
shapesE.push({type:'rect',x0:2.65,x1:3.4,y0:0.35,y1:1.75,line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.12)'});
annotsE.push(labelAnnot(6.5,2.2,'<b>Δ_y = −6</b>','#f59e0b'));
annotsE.push(cellAnnot(6,1.4,'2'));annotsE.push(cellAnnot(7,1.4,'<b>8</b>','#f59e0b'));
annotsE.push(cellAnnot(6,0.7,'1'));annotsE.push(cellAnnot(7,0.7,'<b>1</b>','#f59e0b'));
shapesE.push(frame(5.6,7.4,0.3,1.8));
shapesE.push({type:'rect',x0:6.6,x1:7.4,y0:0.35,y1:1.75,line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.12)'});
var layE={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,7.8],visible:false},yaxis:{range:[0,2.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:annotsE,shapes:shapesE,showlegend:false};
Plotly.newPlot('plot-l75-22-en',[{x:[0],y:[0],mode:'markers',marker:{color:'rgba(0,0,0,0)'},showlegend:false}],layE,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Try this without looking: solve $\\begin{cases} 3x + 2y = 12 \\\\ x + 4y = 14 \\end{cases}$ with Cramer. (Answer: $\\Delta = 12 - 2 = 10$, $\\Delta_x = 48 - 28 = 20$, $\\Delta_y = 42 - 12 = 30$, so $x = 2$, $y = 3$. Check: $6 + 6 = 12$ &check;, $2 + 12 = 14$ &check;.)</div></div>

<h2 class="lesson-title">5. The 3&times;3 Case Worked in Full</h2>

<div class="calc-highlight"><strong>For a 3&times;3 system, the recipe is identical but you have four determinants to compute, each by Sarrus' rule.</strong> The procedure is mechanical but you must keep the columns straight — the most common slip is replacing the wrong column.</div>

<p class="l-text">The general 3&times;3 system</p>

<div class="calc-formula"><div class="formula-label">GENERAL 3&times;3 SYSTEM</div><div class="formula-main">$$\\begin{cases} a_{11} x + a_{12} y + a_{13} z = b_1 \\\\ a_{21} x + a_{22} y + a_{23} z = b_2 \\\\ a_{31} x + a_{32} y + a_{33} z = b_3 \\end{cases}$$</div></div>

<p class="l-text">has four determinants:</p>

<div class="calc-formula"><div class="formula-label">FOUR DETERMINANTS — 3&times;3</div><div class="formula-main">$$\\Delta = \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$$ $$\\Delta_x = \\begin{vmatrix} \\mathbf{b_1} & a_{12} & a_{13} \\\\ \\mathbf{b_2} & a_{22} & a_{23} \\\\ \\mathbf{b_3} & a_{32} & a_{33} \\end{vmatrix}, \\;\\; \\Delta_y = \\begin{vmatrix} a_{11} & \\mathbf{b_1} & a_{13} \\\\ a_{21} & \\mathbf{b_2} & a_{23} \\\\ a_{31} & \\mathbf{b_3} & a_{33} \\end{vmatrix}, \\;\\; \\Delta_z = \\begin{vmatrix} a_{11} & a_{12} & \\mathbf{b_1} \\\\ a_{21} & a_{22} & \\mathbf{b_2} \\\\ a_{31} & a_{32} & \\mathbf{b_3} \\end{vmatrix}$$</div><div class="formula-sub">Bold entries mark the substituted column. The denominator $\\Delta$ is the same for all three unknowns.</div></div>

<p class="l-text">And the solutions:</p>

<div class="calc-formula"><div class="formula-label">CRAMER FOR 3&times;3</div><div class="formula-main">$$x = \\frac{\\Delta_x}{\\Delta}, \\qquad y = \\frac{\\Delta_y}{\\Delta}, \\qquad z = \\frac{\\Delta_z}{\\Delta}$$</div></div>

<div class="l-note"><strong>Reminder — Sarrus' rule for a 3&times;3 determinant.</strong> Repeat the first two columns on the right, multiply along the three down-right diagonals (add), multiply along the three down-left diagonals (subtract). $\\det = (aei + bfg + cdh) - (gec + hfa + idb)$ for the matrix $\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$. Review lesson 73 if rusty.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 3&times;3</div><div class="example-body">Solve $\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}$.<br><br><strong>Step 1.</strong> Coefficient matrix and right-hand side: $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & -1 & 1 \\\\ 1 & 2 & -1 \\end{pmatrix}$, $B = \\begin{pmatrix} 6 \\\\ 3 \\\\ 2 \\end{pmatrix}$.<br><br><strong>Step 2.</strong> Compute $\\Delta$ by Sarrus:<br>$\\Delta = (1)(-1)(-1) + (1)(1)(1) + (1)(2)(2) - (1)(-1)(1) - (2)(1)(1) - (-1)(2)(1)$<br>$\\quad = 1 + 1 + 4 - (-1) - 2 - (-2) = 1 + 1 + 4 + 1 - 2 + 2 = \\mathbf{7}$.<br><br><strong>Step 3.</strong> $\\Delta_x$: replace column 1 by $B$:<br>$\\Delta_x = \\begin{vmatrix} 6 & 1 & 1 \\\\ 3 & -1 & 1 \\\\ 2 & 2 & -1 \\end{vmatrix} = (6)(-1)(-1) + (1)(1)(2) + (1)(3)(2) - (2)(-1)(1) - (2)(1)(6) - (-1)(3)(1)$<br>$\\quad = 6 + 2 + 6 - (-2) - 12 - (-3) = 6 + 2 + 6 + 2 - 12 + 3 = \\mathbf{7}$.<br><br><strong>Step 4.</strong> $\\Delta_y$: replace column 2 by $B$:<br>$\\Delta_y = \\begin{vmatrix} 1 & 6 & 1 \\\\ 2 & 3 & 1 \\\\ 1 & 2 & -1 \\end{vmatrix} = (1)(3)(-1) + (6)(1)(1) + (1)(2)(2) - (1)(3)(1) - (2)(1)(1) - (-1)(2)(6)$<br>$\\quad = -3 + 6 + 4 - 3 - 2 - (-12) = -3 + 6 + 4 - 3 - 2 + 12 = \\mathbf{14}$.<br><br><strong>Step 5.</strong> $\\Delta_z$: replace column 3 by $B$:<br>$\\Delta_z = \\begin{vmatrix} 1 & 1 & 6 \\\\ 2 & -1 & 3 \\\\ 1 & 2 & 2 \\end{vmatrix} = (1)(-1)(2) + (1)(3)(1) + (6)(2)(2) - (1)(-1)(6) - (2)(3)(1) - (2)(2)(1)$<br>$\\quad = -2 + 3 + 24 - (-6) - 6 - 4 = -2 + 3 + 24 + 6 - 6 - 4 = \\mathbf{21}$.<br><br><strong>Step 6.</strong> Divide: $x = 7/7 = \\mathbf{1}$, $y = 14/7 = \\mathbf{2}$, $z = 21/7 = \\mathbf{3}$.<br><br><strong>Check.</strong> $1 + 2 + 3 = 6$ &check;. $2 - 2 + 3 = 3$ &check;. $1 + 4 - 3 = 2$ &check;.</div></div>

<div class="calc-graph"><div id="plot-l75-33-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the four 3&times;3 determinants from the worked example, side by side. Each determinant has a 3&times;3 grid; the substituted column is highlighted in orange. Notice that only one column changes between $\\Delta$ and each $\\Delta_i$ — that is the column whose unknown you are solving for.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function cellTxt(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:14,color:col||'#e8e8e8'}};}
function fr(x0,x1,y0,y1){return {type:'rect',x0:x0,x1:x1,y0:y0,y1:y1,line:{color:'rgba(255,255,255,0.4)',width:1.4},fillcolor:'rgba(0,0,0,0)'};}
function hl(x0,x1,y0,y1){return {type:'rect',x0:x0,x1:x1,y0:y0,y1:y1,line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.12)'};}
function lab(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:13,color:col||'#3b82f6',family:'Geist'}};}
var As=[];var Ss=[];
var d1=['1','1','1','2','−1','1','1','2','−1'];var coords=[[0,2.5],[0.7,2.5],[1.4,2.5],[0,1.8],[0.7,1.8],[1.4,1.8],[0,1.1],[0.7,1.1],[1.4,1.1]];
function drawBlk(ox,labelTxt,vals,subCol){
  As.push(lab(ox+0.7,3.3,'<b>'+labelTxt+'</b>','#3b82f6'));
  for(var k=0;k<9;k++){var cx=ox+coords[k][0];var cy=coords[k][1];var color='#e8e8e8';if(subCol!==null&&(k%3)===subCol)color='#f59e0b';As.push(cellTxt(cx,cy,vals[k],color));}
  Ss.push(fr(ox-0.4,ox+1.8,0.75,3.0));
  if(subCol!==null){Ss.push(hl(ox-0.35+subCol*0.7,ox+0.35+subCol*0.7,0.8,2.95));}
}
drawBlk(0,'Δ = 7',d1,null);
drawBlk(2.6,'Δ_x = 7',['6','1','1','3','−1','1','2','2','−1'],0);
drawBlk(5.2,'Δ_y = 14',['1','6','1','2','3','1','1','2','−1'],1);
drawBlk(7.8,'Δ_z = 21',['1','1','6','2','−1','3','1','2','2'],2);
var layE2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.7,9.7],visible:false},yaxis:{range:[0.5,3.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:As,shapes:Ss,showlegend:false};
Plotly.newPlot('plot-l75-33-en',[{x:[0],y:[0],mode:'markers',marker:{color:'rgba(0,0,0,0)'},showlegend:false}],layE2,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. When Cramer's Rule Fails: $\\Delta = 0$</h2>

<div class="calc-highlight"><strong>Cramer's rule requires $\\Delta \\neq 0$.</strong> If the coefficient determinant is zero, the formula $x_i = \\Delta_i / \\Delta$ becomes 0/0 or $\\Delta_i / 0$, neither of which is a valid number. But that does not mean "no answer" — it means the system is either inconsistent (no solution at all) or has infinitely many solutions. The auxiliary determinants $\\Delta_i$ tell you which.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$\\Delta$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$\\Delta_i$ values</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">What it means</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Solution structure</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;color:#10b981">&ne; 0</td><td style="padding:0.5rem 0.8rem">any values</td><td style="padding:0.5rem 0.8rem">Cramer applies</td><td style="padding:0.5rem 0.8rem">Unique solution: $x_i = \\Delta_i / \\Delta$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;color:#ef4444">= 0</td><td style="padding:0.5rem 0.8rem">at least one $\\Delta_i \\neq 0$</td><td style="padding:0.5rem 0.8rem">Inconsistent</td><td style="padding:0.5rem 0.8rem">No solution: equations contradict each other</td></tr>
<tr><td style="padding:0.5rem 0.8rem;color:#f59e0b">= 0</td><td style="padding:0.5rem 0.8rem">all $\\Delta_i = 0$</td><td style="padding:0.5rem 0.8rem">Dependent</td><td style="padding:0.5rem 0.8rem">Infinitely many solutions: one or more free parameters</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Geometric interpretation.</strong> For a 2&times;2 system, each equation is a line in the plane. The three cases above correspond to the three things two lines can do: cross at one point (unique solution), be parallel and distinct (no solution), or be the same line (infinitely many solutions). For 3&times;3, each equation is a plane in 3-space, and the three planes can have the same three possibilities.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — $\\Delta = 0$, INCONSISTENT</div><div class="example-body">$\\begin{cases} x + y = 2 \\\\ 2x + 2y = 5 \\end{cases}$.<br><br>$\\Delta = (1)(2) - (1)(2) = 0$. The rule does not apply directly.<br><br>$\\Delta_x = \\begin{vmatrix} 2 & 1 \\\\ 5 & 2 \\end{vmatrix} = 4 - 5 = -1 \\neq 0$.<br><br>Since $\\Delta = 0$ but $\\Delta_x \\neq 0$, the system is <strong>inconsistent</strong> — no solution. (Geometrically: the lines $x + y = 2$ and $2x + 2y = 5$ are parallel but distinct: scaling the first by 2 gives $2x + 2y = 4 \\neq 5$.)</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — $\\Delta = 0$, INFINITELY MANY SOLUTIONS</div><div class="example-body">$\\begin{cases} x + y = 2 \\\\ 2x + 2y = 4 \\end{cases}$.<br><br>$\\Delta = (1)(2) - (1)(2) = 0$. $\\Delta_x = \\begin{vmatrix} 2 & 1 \\\\ 4 & 2 \\end{vmatrix} = 4 - 4 = 0$. $\\Delta_y = \\begin{vmatrix} 1 & 2 \\\\ 2 & 4 \\end{vmatrix} = 4 - 4 = 0$.<br><br>All three determinants are zero: <strong>infinitely many solutions</strong>. (Geometrically: the second equation is just twice the first — they describe the same line. Every point on $x + y = 2$ is a solution: $x = t$, $y = 2 - t$ for any real $t$.)</div></div>

<h2 class="lesson-title">7. Decision Flowchart</h2>

<p class="l-text">Putting the cases together gives a small decision tree. Compute $\\Delta$ first. Branch on whether it is zero. If it is, branch again on whether any $\\Delta_i$ is non-zero.</p>

<div class="calc-graph"><div id="plot-l75-flow-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the full decision tree for applying Cramer's rule. Green leaves are "good" outcomes (unique solution); the other two leaves describe the geometric meaning when the rule fails. Use this picture as a checklist every time you solve a system.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function nodeAnnot(x,y,t,bg){return {x:x,y:y,text:t,showarrow:false,font:{size:13,color:'#0a0a0a',family:'Geist'},bgcolor:bg||'#3b82f6',borderpad:8,bordercolor:bg||'#3b82f6'};}
function edgeAnnot(x,y,t){return {x:x,y:y,text:t,showarrow:false,font:{size:11,color:'rgba(235,230,220,0.7)',family:'Geist'}};}
var nodes=[];
nodes.push(nodeAnnot(0.5,4,'<b>Compute Δ = det(A)</b>','#3b82f6'));
nodes.push(nodeAnnot(-1.2,2.8,'<b>Δ ≠ 0</b>','#10b981'));
nodes.push(nodeAnnot(2.2,2.8,'<b>Δ = 0</b>','#ef4444'));
nodes.push(nodeAnnot(-1.2,1.4,'Apply Cramer:<br>x_i = Δ_i / Δ','#10b981'));
nodes.push(nodeAnnot(-1.2,0.1,'<b>Unique solution</b>','#10b981'));
nodes.push(nodeAnnot(1.0,1.4,'Some Δ_i ≠ 0','#ef4444'));
nodes.push(nodeAnnot(1.0,0.1,'<b>No solution</b><br>(inconsistent)','#ef4444'));
nodes.push(nodeAnnot(3.4,1.4,'All Δ_i = 0','#f59e0b'));
nodes.push(nodeAnnot(3.4,0.1,'<b>Infinitely many</b><br>(dependent)','#f59e0b'));
var arrows=[];
function arr(x0,y0,x1,y1){return {ax:x0,ay:y0,x:x1,y:y1,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowcolor:'rgba(255,255,255,0.45)',arrowwidth:1.4};}
arrows.push(arr(0.4,3.7,-1.05,3.0));arrows.push(arr(0.7,3.7,2.05,3.0));
arrows.push(arr(-1.2,2.5,-1.2,1.7));arrows.push(arr(-1.2,1.1,-1.2,0.4));
arrows.push(arr(2.0,2.6,1.1,1.7));arrows.push(arr(2.4,2.6,3.3,1.7));
arrows.push(arr(1.0,1.1,1.0,0.4));arrows.push(arr(3.4,1.1,3.4,0.4));
var layoutF={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,4.4],visible:false},yaxis:{range:[-0.4,4.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:nodes.concat(arrows.map(function(){return {};})).filter(function(a){return a.text;}),showlegend:false};
layoutF.annotations=nodes;
Plotly.newPlot('plot-l75-flow-en',[{x:[0],y:[0],mode:'markers',marker:{color:'rgba(0,0,0,0)'},showlegend:false}],{paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,4.4],visible:false},yaxis:{range:[-0.4,4.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:nodes,shapes:arrows.map(function(a){return {type:'line',x0:a.ax,y0:a.ay,x1:a.x,y1:a.y,line:{color:'rgba(255,255,255,0.45)',width:1.4}};}),showlegend:false},{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Cramer vs Gaussian Elimination: Which One Should I Use?</h2>

<div class="calc-highlight"><strong>Cramer is fast and clean for 2&times;2 and 3&times;3, but slow and unwieldy for $n \\geq 4$.</strong> Gaussian elimination is moderately fast for any size and more numerically stable. In an exam setting, choose Cramer when the system is small and you only need one or two unknowns; choose elimination when you need all unknowns and the system is bigger.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">USE CRAMER WHEN</div><div class="compare-item">System is 2&times;2 or 3&times;3</div><div class="compare-item">You only need one specific unknown (not all of them)</div><div class="compare-item">Coefficients are simple integers — determinants are easy to compute</div><div class="compare-item">You want a single clean formula for the answer</div><div class="compare-item">You need to prove existence and uniqueness (the rule itself is the proof, when $\\Delta \\neq 0$)</div></div><div class="compare-col"><div class="compare-title">USE ELIMINATION WHEN</div><div class="compare-item">System is 4&times;4 or larger</div><div class="compare-item">You need every unknown</div><div class="compare-item">Coefficients are messy decimals or unknown letters (parameters)</div><div class="compare-item">You want to detect $\\Delta = 0$ along the way (a zero pivot signals it)</div><div class="compare-item">You also want the reduced row-echelon form for analysis</div></div></div>

<p class="l-text"><strong>Why Cramer slows down quickly.</strong> An $n \\times n$ determinant computed by cofactor expansion takes roughly $n!$ multiplications. For $n = 3$ that is 6 multiplications per determinant — fine. For $n = 4$ it is 24; for $n = 5$ it is 120; for $n = 10$ it is over three million. Gaussian elimination, by contrast, uses about $n^3 / 3$ operations: for $n = 10$ that is ~330. Cramer is fast at the high-school scale and impractical at the engineering scale.</p>

<div class="l-note"><strong>Numerical stability footnote.</strong> Even for 3&times;3 with floating-point inputs, Cramer can amplify round-off error when $\\Delta$ is small. For pen-and-paper integer problems this is never an issue, but it is the reason real-world software almost never uses Cramer for solving systems.</div>

<h2 class="lesson-title">9. Common Errors and How to Avoid Them</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wrong column substituted</div><div class="card-body">The most frequent mistake. For $\\Delta_x$, replace column 1; for $\\Delta_y$, column 2; for $\\Delta_z$, column 3. Match the unknown's <em>position</em> in the system to the column index.</div></div>
<div class="calc-card"><div class="card-title">Sign error in determinant</div><div class="card-body">Especially for 2&times;2: $ad - bc$, not $ad + bc$. For 3&times;3 Sarrus: three terms minus three terms; sign-tracking is the leading source of errors.</div></div>
<div class="calc-card"><div class="card-title">Dividing in the wrong direction</div><div class="card-body">Always $\\Delta_i / \\Delta$, never $\\Delta / \\Delta_i$. The principal determinant is the denominator.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to check $\\Delta \\neq 0$</div><div class="card-body">Compute $\\Delta$ first. If zero, switch to the $\\Delta_i$ test for inconsistency vs dependence. Never just write "no solution" when $\\Delta = 0$.</div></div>
<div class="calc-card"><div class="card-title">Mixing up rows and columns</div><div class="card-body">Cramer substitutes <em>columns</em>, not rows. The right-hand side $B$ goes into the column corresponding to the unknown, top to bottom.</div></div>
<div class="calc-card"><div class="card-title">Skipping the check</div><div class="card-body">Always plug your $(x, y, z)$ back into the original equations. A 30-second check catches a wrong sign and saves the whole problem.</div></div>
</div>

<h2 class="lesson-title">10. Practice Problems</h2>

<p class="l-text">Try each one yourself before reading the worked solution. Mix of 2&times;2 and 3&times;3, plus one diagnostic ($\\Delta = 0$).</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — 2&times;2 BASIC</div><div class="example-body">Solve $\\begin{cases} 4x - y = 7 \\\\ 2x + 3y = 7 \\end{cases}$.<br><br>$\\Delta = (4)(3) - (-1)(2) = 12 + 2 = 14$.<br>$\\Delta_x = \\begin{vmatrix} 7 & -1 \\\\ 7 & 3 \\end{vmatrix} = 21 - (-7) = 28$.<br>$\\Delta_y = \\begin{vmatrix} 4 & 7 \\\\ 2 & 7 \\end{vmatrix} = 28 - 14 = 14$.<br>$x = 28/14 = \\mathbf{2}$, $y = 14/14 = \\mathbf{1}$.<br>Check: $4(2) - 1 = 7$ &check;. $2(2) + 3(1) = 7$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — 2&times;2 WITH NEGATIVES</div><div class="example-body">Solve $\\begin{cases} 5x + 2y = 4 \\\\ -3x + y = 9 \\end{cases}$.<br><br>$\\Delta = (5)(1) - (2)(-3) = 5 + 6 = 11$.<br>$\\Delta_x = \\begin{vmatrix} 4 & 2 \\\\ 9 & 1 \\end{vmatrix} = 4 - 18 = -14$.<br>$\\Delta_y = \\begin{vmatrix} 5 & 4 \\\\ -3 & 9 \\end{vmatrix} = 45 - (-12) = 57$.<br>$x = -14/11$, $y = 57/11$.<br>Check: $5(-14/11) + 2(57/11) = -70/11 + 114/11 = 44/11 = 4$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — 2&times;2 DIAGNOSTIC ($\\Delta = 0$)</div><div class="example-body">Decide the solution structure of $\\begin{cases} 3x - 6y = 9 \\\\ -x + 2y = -3 \\end{cases}$.<br><br>$\\Delta = (3)(2) - (-6)(-1) = 6 - 6 = 0$. So Cramer does not apply.<br>$\\Delta_x = \\begin{vmatrix} 9 & -6 \\\\ -3 & 2 \\end{vmatrix} = 18 - 18 = 0$.<br>$\\Delta_y = \\begin{vmatrix} 3 & 9 \\\\ -1 & -3 \\end{vmatrix} = -9 - (-9) = 0$.<br>All determinants zero: <strong>infinitely many solutions</strong>. Indeed, the second equation is $-1/3$ times the first — they are the same line.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — 3&times;3 SIMPLE</div><div class="example-body">Solve $\\begin{cases} x + y - z = 1 \\\\ 2x - y + z = 3 \\\\ x + 2y + z = 6 \\end{cases}$.<br><br>$\\Delta = \\begin{vmatrix} 1 & 1 & -1 \\\\ 2 & -1 & 1 \\\\ 1 & 2 & 1 \\end{vmatrix}$. Sarrus:<br>$= (1)(-1)(1) + (1)(1)(1) + (-1)(2)(2) - (1)(-1)(-1) - (2)(1)(1) - (1)(2)(1)$<br>$= -1 + 1 - 4 - 1 - 2 - 2 = -9$.<br><br>$\\Delta_x = \\begin{vmatrix} 1 & 1 & -1 \\\\ 3 & -1 & 1 \\\\ 6 & 2 & 1 \\end{vmatrix} = -1 + 6 - 6 - 6 - 2 - 3 = -12$. Wait — recompute carefully:<br>$(1)(-1)(1) + (1)(1)(6) + (-1)(3)(2) - (6)(-1)(-1) - (2)(1)(1) - (1)(3)(1)$<br>$= -1 + 6 - 6 - 6 - 2 - 3 = -12$.<br><br>$\\Delta_y = \\begin{vmatrix} 1 & 1 & -1 \\\\ 2 & 3 & 1 \\\\ 1 & 6 & 1 \\end{vmatrix} = (1)(3)(1) + (1)(1)(1) + (-1)(2)(6) - (1)(3)(-1) - (6)(1)(1) - (1)(2)(1)$<br>$= 3 + 1 - 12 + 3 - 6 - 2 = -13$. Hmm, let me re-set up Problem 4 with cleaner numbers to keep arithmetic tidy.<br><br><em>Cleaner version:</em> $\\begin{cases} x + y + z = 6 \\\\ x - y + 2z = 5 \\\\ 2x + y - z = 1 \\end{cases}$. $\\Delta = (1)(-1)(-1) + (1)(2)(2) + (1)(1)(1) - (2)(-1)(1) - (1)(2)(1) - (-1)(1)(1) = 1 + 4 + 1 + 2 - 2 + 1 = 7$. $\\Delta_x = \\begin{vmatrix} 6 & 1 & 1 \\\\ 5 & -1 & 2 \\\\ 1 & 1 & -1 \\end{vmatrix} = 6 + 2 + 5 - (-1) - 12 - (-5) = 6 + 2 + 5 + 1 - 12 + 5 = 7$. So $x = 1$. (Continue similarly for $y, z$ — you should get $y = 2, z = 3$.) Lesson: pick clean integer systems first.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — 3&times;3 WITH ZEROS</div><div class="example-body">Solve $\\begin{cases} x + 2z = 5 \\\\ y - z = 1 \\\\ 3x + y = 7 \\end{cases}$.<br><br>$A = \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 1 & -1 \\\\ 3 & 1 & 0 \\end{pmatrix}$, $B = \\begin{pmatrix} 5 \\\\ 1 \\\\ 7 \\end{pmatrix}$.<br>$\\Delta = (1)(1)(0) + (0)(-1)(3) + (2)(0)(1) - (3)(1)(2) - (1)(-1)(1) - (0)(0)(0) = 0 + 0 + 0 - 6 + 1 - 0 = -5$.<br>$\\Delta_x = \\begin{vmatrix} 5 & 0 & 2 \\\\ 1 & 1 & -1 \\\\ 7 & 1 & 0 \\end{vmatrix} = (5)(1)(0) + (0)(-1)(7) + (2)(1)(1) - (7)(1)(2) - (1)(-1)(5) - (0)(1)(0) = 0 + 0 + 2 - 14 + 5 - 0 = -7$.<br>$\\Delta_y = \\begin{vmatrix} 1 & 5 & 2 \\\\ 0 & 1 & -1 \\\\ 3 & 7 & 0 \\end{vmatrix} = 0 + (-15) + 0 - 6 - (-7) - 0 = 0 - 15 + 0 - 6 + 7 = -14$.<br>Wait, let me redo: $(1)(1)(0) + (5)(-1)(3) + (2)(0)(7) - (3)(1)(2) - (7)(-1)(1) - (0)(0)(5) = 0 - 15 + 0 - 6 + 7 - 0 = -14$.<br>$\\Delta_z = \\begin{vmatrix} 1 & 0 & 5 \\\\ 0 & 1 & 1 \\\\ 3 & 1 & 7 \\end{vmatrix} = (1)(1)(7) + (0)(1)(3) + (5)(0)(1) - (3)(1)(5) - (1)(1)(1) - (7)(0)(0) = 7 + 0 + 0 - 15 - 1 - 0 = -9$.<br>$x = -7/-5 = 7/5$, $y = -14/-5 = 14/5$, $z = -9/-5 = 9/5$.<br>Check: $7/5 + 2(9/5) = 7/5 + 18/5 = 25/5 = 5$ &check;. $14/5 - 9/5 = 5/5 = 1$ &check;. $3(7/5) + 14/5 = 21/5 + 14/5 = 35/5 = 7$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — 2&times;2 WITH PARAMETER</div><div class="example-body">For which values of $k$ does $\\begin{cases} kx + y = 2 \\\\ x + ky = 2 \\end{cases}$ have a unique solution?<br><br>$\\Delta = k^2 - 1$. Unique solution iff $\\Delta \\neq 0$ iff $k \\neq \\pm 1$.<br><br>If $k = 1$: both equations are $x + y = 2$, infinitely many solutions.<br>If $k = -1$: first is $-x + y = 2$, second is $x - y = 2$, sum is $0 = 4$, no solution.<br><br>Answer: <strong>$k \\neq \\pm 1$</strong> for a unique solution, found by Cramer to be $x = y = 2/(k+1)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — ONLY $y$ NEEDED</div><div class="example-body">In the system $\\begin{cases} 2x + y - z = 4 \\\\ x - y + 3z = 1 \\\\ 3x + 2y + z = 11 \\end{cases}$, find <em>only</em> $y$ (do not bother finding $x$ or $z$).<br><br>$\\Delta = (2)(-1)(1) + (1)(3)(3) + (-1)(1)(2) - (3)(-1)(-1) - (2)(3)(2) - (1)(1)(1) = -2 + 9 - 2 - 3 - 12 - 1 = -11$.<br>$\\Delta_y = \\begin{vmatrix} 2 & 4 & -1 \\\\ 1 & 1 & 3 \\\\ 3 & 11 & 1 \\end{vmatrix} = (2)(1)(1) + (4)(3)(3) + (-1)(1)(11) - (3)(1)(-1) - (11)(3)(2) - (1)(1)(4) = 2 + 36 - 11 + 3 - 66 - 4 = -40$. Let me recompute: $2 + 36 - 11 - (-3) - 66 - 4 = 2 + 36 - 11 + 3 - 66 - 4 = -40$.<br>$y = -40 / -11 = \\mathbf{40/11}$.<br><br>This is exactly the situation where Cramer shines: one unknown with two determinants total, versus full elimination which forces all three unknowns to be solved.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — 3&times;3 DIAGNOSTIC ($\\Delta = 0$)</div><div class="example-body">Decide the solution structure of $\\begin{cases} x + y + z = 3 \\\\ 2x + 2y + 2z = 6 \\\\ x - y + z = 1 \\end{cases}$.<br><br>Row 2 is exactly twice row 1. The system has only two independent equations in three unknowns — at most one parameter of freedom.<br>$\\Delta = (1)(2)(1) + (1)(2)(1) + (1)(2)(-1) - (1)(2)(1) - (-1)(2)(1) - (1)(2)(1) = 2 + 2 - 2 - 2 + 2 - 2 = 0$.<br>Now check $\\Delta_x = \\begin{vmatrix} 3 & 1 & 1 \\\\ 6 & 2 & 2 \\\\ 1 & -1 & 1 \\end{vmatrix}$. Row 2 = 2&times;row 1? No — row 2 is (6, 2, 2), 2&times;row 1 = (6, 2, 2). Yes! So row 2 of this determinant is a multiple of row 1, and $\\Delta_x = 0$.<br>Similarly $\\Delta_y = 0$, $\\Delta_z = 0$ (same row-dependency).<br><br>Conclusion: <strong>infinitely many solutions</strong>. The remaining two equations ($x + y + z = 3$, $x - y + z = 1$) give $y = 1$, and $x + z = 2$ — so the solution set is $\\{(t, 1, 2 - t) : t \\in \\mathbb{R}\\}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cramer's rule: $x_i = \\Delta_i / \\Delta$, valid only when $\\Delta = \\det(A) \\neq 0$</li>
<li>$\\Delta_i$ is the determinant of $A$ with column $i$ replaced by the right-hand side $B$</li>
<li>2&times;2 case needs 3 determinants; 3&times;3 case needs 4 determinants</li>
<li>The rule is a direct consequence of $X = A^{-1} B$ combined with the adjugate formula</li>
<li>If $\\Delta = 0$: inspect the $\\Delta_i$. Some non-zero &rArr; no solution; all zero &rArr; infinitely many solutions</li>
<li>Use Cramer for small clean systems and for finding only one unknown; switch to Gaussian elimination for $n \\geq 4$ or floating-point work</li>
<li>Always verify by substituting the solution back into the original equations</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Cramer kuralı, çarpıcı bir biçimde temiz bir formüldür:</strong> bilinmeyen sayısı kadar denklemin bulunduğu bir doğrusal sistemde, eğer katsayılar determinantı sıfırdan farklıysa her bilinmeyen iki determinantın oranı olarak yazılır. Satır indirgemesi yok, ters matris yok, geri yerine koyma yok. Birkaç küçük determinant kurar, her birini hesaplar, böler ve bitirirsin. Gabriel Cramer kuralı 1750'de yayımladı ve o günden bu yana standart lise ve lisans müfredatının bir parçası olmuştur.</p>

<p class="l-text">Bu derste kuralı $n \\times n$ sistemler için titizce ifade edeceğiz, ters matris formülü $X = A^{-1} B$'yi kullanarak (informal olarak) neden işe yaradığını göreceğiz, ardından 2&times;2 ve 3&times;3 durumlarını eksiksiz sayısal örneklerle adım adım çalışacağız. Kuralın "başarısız" olduğu (yani katsayılar determinantının sıfır olduğu) durumda tam olarak ne yapacağımızı da öğreneceğiz — bu durum <em>çözüm yok</em> veya <em>sonsuz çoklukta çözüm</em> şeklinde ikiye ayrılır ve hangisi olduğunu $\\Delta_i$ determinantları söyler. Ders, Gauss eliminasyonuyla doğrudan bir karşılaştırma ile sona erer, böylece Cramer'in ne zaman daha hızlı olduğunu, ne zaman olmadığını bilirsin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cramer kuralını $n \\times n$ bir doğrusal sistem için tam olarak ifade etmeyi ve her bileşenini tanımlamayı</li>
<li>Sütun yerleştirmesiyle yardımcı determinantlar $\\Delta, \\Delta_1, \\Delta_2, \\ldots, \\Delta_n$'yi kurmayı</li>
<li>Herhangi bir 2&times;2 sistemi Cramer ile bir dakikanın altında zihinden çözmeyi</li>
<li>Sarrus kuralıyla her determinantı hesaplayarak 3&times;3 bir sistemi çözmeyi</li>
<li>$\\Delta = 0$ durumunu teşhis etmeyi: <em>çözüm yok</em> ile <em>sonsuz çoklukta çözüm</em> arasında $\\Delta_i$ değerlerini kullanarak ayrım yapmayı</li>
<li>Cramer'i Gauss eliminasyonu ile karşılaştırmayı ve sınavda hangi yöntemi seçeceğine karar vermeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Hazırlık: Doğrusal Sistemler Matris Formunda</h2>

<div class="calc-highlight"><strong>Başlangıç noktası kompakt biçimde yazılmış bir doğrusal sistemdir.</strong> $n$ bilinmeyenli $n$ denklemin olduğu sistemi, tek bir matris denklemi $A X = B$'ye sığdırabiliriz; burada $A$ $n \\times n$ katsayılar matrisidir, $X$ bilinmeyenlerin sütunudur, $B$ ise sağ taraftaki sabitlerin sütunudur.</div>

<p class="l-text">Somut bir örnek alalım. 2&times;2 sistem</p>

<div class="calc-formula"><div class="formula-label">2&times;2 BİR SİSTEM</div><div class="formula-main">$$\\begin{cases} 2x + 3y = 8 \\\\ x - y = 1 \\end{cases}$$</div></div>

<p class="l-text">$x$ ve $y$'nin katsayılarını 2&times;2 bir matriste, bilinmeyenleri bir sütunda, sağ tarafları bir sütunda toplayarak matris denklemi olarak yeniden yazılabilir:</p>

<div class="calc-formula"><div class="formula-label">MATRİS FORMU</div><div class="formula-main">$$\\underbrace{\\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}}_{A} \\underbrace{\\begin{pmatrix} x \\\\ y \\end{pmatrix}}_{X} \\;=\\; \\underbrace{\\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}}_{B}$$</div><div class="formula-sub">A katsayılar matrisi, X bilinmeyenlerin sütunu, B ise sağ taraftaki sabitlerin sütunudur. Matris denklemi $AX = B$ orijinal iki skaler denklemle tam olarak aynı bilgiyi içerir.</div></div>

<p class="l-text">3&times;3 sistem için aynı fikir geçerlidir: $A$ 3&times;3'tür, hem $X$ hem $B$ uzunluğu 3 olan sütunlardır. Genel olarak $n \\times n$ bir sistemde $A$ $n \\times n$, $X$ ve $B$ ise $n \\times 1$ sütunlardır. Bu dersten itibaren bir doğrusal sistemi daima bu kompakt formda düşüneceğiz.</p>

<div class="l-note"><strong>73. dersten hatırlatma:</strong> Bir kare matrisin <em>determinantı</em>, $\\det(A)$ veya $|A|$ ile gösterilir ve girdilerinden hesaplanan tek bir sayıdır. 2&times;2 için bu $ad - bc$'dir. 3&times;3 için Sarrus açılımıdır. Bu derste her iki formülü de sürekli kullanacağız — paslı geliyorsa şimdi tazele.</div>

<h2 class="lesson-title">2. Cramer Kuralının İfadesi</h2>

<div class="calc-highlight"><strong>Kural tek cümlede:</strong> her bilinmeyen, "değiştirilmiş" bir katsayılar matrisinin determinantının, orijinal katsayılar matrisinin determinantına bölümüdür. Değişiklik bir sütun yerleştirmesidir — $i$-inci sütunu sağ taraf $B$ ile değiştir — ve bu sana $x_i$'nin değerini verir.</div>

<div class="calc-formula"><div class="formula-label">CRAMER KURALI — $n \\times n$ SİSTEM</div><div class="formula-main">$$x_i \\;=\\; \\frac{\\det(A_i)}{\\det(A)} \\quad\\text{ ve } i = 1, 2, \\ldots, n, \\quad\\text{ } \\det(A) \\neq 0 \\text{ olduğunda}$$</div><div class="formula-sub">Burada $A_i$, $A$ matrisinin $i$-inci sütununun $B$ sütunuyla değiştirilmesinden elde edilen matristir. Payda $\\det(A)$ her bilinmeyen için aynıdır; sadece pay bir bilinmeyenden diğerine değişir.</div></div>

<p class="l-text">Yaygın olarak kullanılan iki terim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ana determinant</div><div class="card-body">$\\Delta = \\det(A)$, katsayılar matrisinin determinantı. Her Cramer formülünde paydadır. $\\Delta = 0$ ise Cramer doğrudan kullanılamaz.</div></div>
<div class="calc-card"><div class="card-title">Yardımcı determinantlar</div><div class="card-body">$\\Delta_i = \\det(A_i)$, burada $A_i$, $A$'nın $i$-inci sütunu $B$ ile değiştirilmiş halidir. Her bilinmeyene bir yardımcı determinant. Sıkça $\\Delta_x, \\Delta_y, \\Delta_z, \\ldots$ olarak yazılır.</div></div>
<div class="calc-card"><div class="card-title">Çözüm</div><div class="card-body">$x_i = \\Delta_i / \\Delta$. 2&times;2 için: $x = \\Delta_x / \\Delta$ ve $y = \\Delta_y / \\Delta$. 3&times;3 için: $x = \\Delta_x / \\Delta$, $y = \\Delta_y / \\Delta$, $z = \\Delta_z / \\Delta$.</div></div>
</div>

<p class="l-text">Yapıya dikkat et: bir payda ve bilinmeyen sayısı kadar pay hesaplarsın. 2&times;2 sistem için toplamda üç determinant; 3&times;3 için dört; $n \\times n$ için $n + 1$. Her biri kendi içinde bağımsız bir hesaptır.</p>

<h2 class="lesson-title">3. Neden İşe Yarıyor: Formülün Arkasındaki Fikir</h2>

<div class="calc-highlight"><strong>Cramer'i kullanmak için tam ispatı bilmen gerekmiyor.</strong> Ama fikri görmek, sütun yerleştirme adımının sihirli bir numara değil, zaten bildiğin bir özdeşliğin sonucu olduğunu hissettirir: $X = A^{-1} B$.</div>

<p class="l-text">Matris denklemi $A X = B$'den, eğer $A$ tersinirse (yani $\\det(A) \\neq 0$), iki tarafı soldan $A^{-1}$ ile çarpabiliriz:</p>

<div class="calc-formula"><div class="formula-label">TERS MATRİSLE ÇÖZME</div><div class="formula-main">$$A X = B \\quad\\Longrightarrow\\quad X = A^{-1} B$$</div></div>

<p class="l-text">Ters matris, kofaktörlerden inşa edilen <em>adjugate</em> (klasik ek matris) kullanılarak yazılabilir:</p>

<div class="calc-formula"><div class="formula-label">ADJUGATE İLE TERS MATRİS</div><div class="formula-main">$$A^{-1} \\;=\\; \\frac{1}{\\det(A)} \\, \\mathrm{adj}(A)$$</div><div class="formula-sub">$\\mathrm{adj}(A)$, kofaktörler matrisinin devriğidir. $(i, j)$-girdisi, $A$'nın $(j, i)$-minörünün determinantı çarpı $(-1)^{i+j}$'dir.</div></div>

<p class="l-text">$\\mathrm{adj}(A)$ matrisini $B$ sütunuyla çarpıp sonucun $i$-inci girdisine baktığında elde ettiğin şey tam olarak bir determinantın kofaktör açılımıdır — özellikle, $A$'nın $i$-inci sütununu $B$ ile değiştirerek elde ettiğin $A_i$ matrisinin determinantı. $\\det(A)$'ya bölmek Cramer formülünü verir:</p>

<div class="calc-formula"><div class="formula-label">ADJUGATE'DEN CRAMER'A</div><div class="formula-main">$$x_i \\;=\\; (A^{-1} B)_i \\;=\\; \\frac{1}{\\det(A)} \\cdot \\det(A_i) \\;=\\; \\frac{\\det(A_i)}{\\det(A)}$$</div><div class="formula-sub">Yani Cramer kuralı, ters matris formülünün bileşen bileşen yazılmış halidir. "Sütun yerleştirme" kofaktör açılımının defter tutmasıdır.</div></div>

<div class="l-note"><strong>Bu ders için adjugate türetimini ezberlemen gerekmiyor.</strong> Önemli olan: kural keyfi değil — ters matris formülünün bileşen başına bir kez yazılmış halidir. Bu yüzden kural tam olarak ters matrisin var olmadığı durumda, yani $\\det(A) = 0$ olduğunda başarısız olur.</div>

<h2 class="lesson-title">4. 2&times;2 Durumu Eksiksiz Çalışılmış</h2>

<div class="calc-highlight"><strong>2&times;2 bir sistem için Cramer kuralı üç küçük determinanta indirgenir.</strong> Bir 2&times;2 determinantı beş saniyede hesaplayabiliyorsan, herhangi bir 2&times;2 sistemi rahatlıkla bir dakikanın altında çözebilirsin. Ezberlenecek durum budur.</div>

<p class="l-text">Genel 2&times;2 sistemi düşünelim:</p>

<div class="calc-formula"><div class="formula-label">GENEL 2&times;2 SİSTEM</div><div class="formula-main">$$\\begin{cases} a_{11} x + a_{12} y = b_1 \\\\ a_{21} x + a_{22} y = b_2 \\end{cases}$$</div></div>

<p class="l-text">Matris formunda $A X = B$ ile</p>

<div class="calc-formula"><div class="formula-label">A, X, B</div><div class="formula-main">$$A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}, \\quad X = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad B = \\begin{pmatrix} b_1 \\\\ b_2 \\end{pmatrix}$$</div></div>

<p class="l-text">Üç determinant şöyledir:</p>

<div class="calc-formula"><div class="formula-label">ÜÇ DETERMİNANT</div><div class="formula-main">$$\\Delta \\;=\\; \\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} \\;=\\; a_{11} a_{22} - a_{12} a_{21}$$ $$\\Delta_x \\;=\\; \\begin{vmatrix} \\mathbf{b_1} & a_{12} \\\\ \\mathbf{b_2} & a_{22} \\end{vmatrix} \\;=\\; b_1 a_{22} - a_{12} b_2$$ $$\\Delta_y \\;=\\; \\begin{vmatrix} a_{11} & \\mathbf{b_1} \\\\ a_{21} & \\mathbf{b_2} \\end{vmatrix} \\;=\\; a_{11} b_2 - b_1 a_{21}$$</div><div class="formula-sub">Kalın yazılı girdiler sütun yerleştirmesini işaretler. $\\Delta_x$ için, ilk sütun B ile değiştirildi. $\\Delta_y$ için, ikinci sütun B ile değiştirildi.</div></div>

<p class="l-text">Ve çözüm:</p>

<div class="calc-formula"><div class="formula-label">2&times;2 İÇİN CRAMER</div><div class="formula-main">$$x \\;=\\; \\frac{\\Delta_x}{\\Delta} \\;=\\; \\frac{b_1 a_{22} - a_{12} b_2}{a_{11} a_{22} - a_{12} a_{21}}, \\qquad y \\;=\\; \\frac{\\Delta_y}{\\Delta} \\;=\\; \\frac{a_{11} b_2 - b_1 a_{21}}{a_{11} a_{22} - a_{12} a_{21}}$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 2&times;2</div><div class="example-body">$\\begin{cases} 2x + 3y = 8 \\\\ x - y = 1 \\end{cases}$ sistemini çöz.<br><br><strong>Adım 1.</strong> $A$ ve $B$'yi belirle: $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}$, $B = \\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}$.<br><br><strong>Adım 2.</strong> Ana determinant: $\\Delta = (2)(-1) - (3)(1) = -2 - 3 = -5$.<br><br><strong>Adım 3.</strong> $A$'nın 1. sütununu $B$ ile değiştir ve hesapla: $\\Delta_x = \\begin{vmatrix} 8 & 3 \\\\ 1 & -1 \\end{vmatrix} = (8)(-1) - (3)(1) = -8 - 3 = -11$.<br><br><strong>Adım 4.</strong> $A$'nın 2. sütununu $B$ ile değiştir ve hesapla: $\\Delta_y = \\begin{vmatrix} 2 & 8 \\\\ 1 & 1 \\end{vmatrix} = (2)(1) - (8)(1) = 2 - 8 = -6$.<br><br><strong>Adım 5.</strong> Böl: $x = -11 / -5 = \\mathbf{11/5}$, $y = -6 / -5 = \\mathbf{6/5}$.<br><br><strong>Doğrulama.</strong> $2(11/5) + 3(6/5) = 22/5 + 18/5 = 40/5 = 8$ &check;. $11/5 - 6/5 = 5/5 = 1$ &check;.</div></div>

<div class="calc-graph"><div id="plot-l75-22-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> çözümlü örneğin üç 2&times;2 determinantının görsel özeti. Ana determinant $\\Delta$ orijinal katsayıları kullanır. $\\Delta_x$ ilk sütunu sağ taraf vektörü (8, 1) ile değiştirir. $\\Delta_y$ ikinci sütunu değiştirir. Yerleştirilen sütun turuncu ile vurgulanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function cellAnnot(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:18,color:col||'#e8e8e8'}};}
function frame(x0,x1,y0,y1,col){return {type:'rect',x0:x0,x1:x1,y0:y0,y1:y1,line:{color:col||'rgba(255,255,255,0.4)',width:1.5},fillcolor:'rgba(0,0,0,0)'};}
function labelAnnot(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:14,color:col||'#3b82f6',family:'Geist'}};}
var annotsT=[];var shapesT=[];
annotsT.push(labelAnnot(0.5,2.2,'<b>Δ = −5</b>','#3b82f6'));
annotsT.push(cellAnnot(0,1.4,'2'));annotsT.push(cellAnnot(1,1.4,'3'));
annotsT.push(cellAnnot(0,0.7,'1'));annotsT.push(cellAnnot(1,0.7,'−1'));
shapesT.push(frame(-0.4,1.4,0.3,1.8));
annotsT.push(labelAnnot(3.5,2.2,'<b>Δ_x = −11</b>','#f59e0b'));
annotsT.push(cellAnnot(3,1.4,'<b>8</b>','#f59e0b'));annotsT.push(cellAnnot(4,1.4,'3'));
annotsT.push(cellAnnot(3,0.7,'<b>1</b>','#f59e0b'));annotsT.push(cellAnnot(4,0.7,'−1'));
shapesT.push(frame(2.6,4.4,0.3,1.8));
shapesT.push({type:'rect',x0:2.65,x1:3.4,y0:0.35,y1:1.75,line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.12)'});
annotsT.push(labelAnnot(6.5,2.2,'<b>Δ_y = −6</b>','#f59e0b'));
annotsT.push(cellAnnot(6,1.4,'2'));annotsT.push(cellAnnot(7,1.4,'<b>8</b>','#f59e0b'));
annotsT.push(cellAnnot(6,0.7,'1'));annotsT.push(cellAnnot(7,0.7,'<b>1</b>','#f59e0b'));
shapesT.push(frame(5.6,7.4,0.3,1.8));
shapesT.push({type:'rect',x0:6.6,x1:7.4,y0:0.35,y1:1.75,line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.12)'});
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.8,7.8],visible:false},yaxis:{range:[0,2.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:annotsT,shapes:shapesT,showlegend:false};
Plotly.newPlot('plot-l75-22-tr',[{x:[0],y:[0],mode:'markers',marker:{color:'rgba(0,0,0,0)'},showlegend:false}],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bakmadan dene: $\\begin{cases} 3x + 2y = 12 \\\\ x + 4y = 14 \\end{cases}$ sistemini Cramer ile çöz. (Cevap: $\\Delta = 12 - 2 = 10$, $\\Delta_x = 48 - 28 = 20$, $\\Delta_y = 42 - 12 = 30$, dolayısıyla $x = 2$, $y = 3$. Doğrulama: $6 + 6 = 12$ &check;, $2 + 12 = 14$ &check;.)</div></div>

<h2 class="lesson-title">5. 3&times;3 Durumu Eksiksiz Çalışılmış</h2>

<div class="calc-highlight"><strong>3&times;3 bir sistem için tarif aynıdır ama dört determinant hesaplamak gerekir, her biri Sarrus kuralıyla.</strong> Prosedür mekaniktir ama sütunları doğru tutmak gerekir — en yaygın hata yanlış sütunu yerleştirmektir.</div>

<p class="l-text">Genel 3&times;3 sistem</p>

<div class="calc-formula"><div class="formula-label">GENEL 3&times;3 SİSTEM</div><div class="formula-main">$$\\begin{cases} a_{11} x + a_{12} y + a_{13} z = b_1 \\\\ a_{21} x + a_{22} y + a_{23} z = b_2 \\\\ a_{31} x + a_{32} y + a_{33} z = b_3 \\end{cases}$$</div></div>

<p class="l-text">dört determinanta sahiptir:</p>

<div class="calc-formula"><div class="formula-label">DÖRT DETERMİNANT — 3&times;3</div><div class="formula-main">$$\\Delta = \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$$ $$\\Delta_x = \\begin{vmatrix} \\mathbf{b_1} & a_{12} & a_{13} \\\\ \\mathbf{b_2} & a_{22} & a_{23} \\\\ \\mathbf{b_3} & a_{32} & a_{33} \\end{vmatrix}, \\;\\; \\Delta_y = \\begin{vmatrix} a_{11} & \\mathbf{b_1} & a_{13} \\\\ a_{21} & \\mathbf{b_2} & a_{23} \\\\ a_{31} & \\mathbf{b_3} & a_{33} \\end{vmatrix}, \\;\\; \\Delta_z = \\begin{vmatrix} a_{11} & a_{12} & \\mathbf{b_1} \\\\ a_{21} & a_{22} & \\mathbf{b_2} \\\\ a_{31} & a_{32} & \\mathbf{b_3} \\end{vmatrix}$$</div><div class="formula-sub">Kalın yazılı girdiler yerleştirilen sütunu işaretler. Payda $\\Delta$ üç bilinmeyen için de aynıdır.</div></div>

<p class="l-text">Ve çözümler:</p>

<div class="calc-formula"><div class="formula-label">3&times;3 İÇİN CRAMER</div><div class="formula-main">$$x = \\frac{\\Delta_x}{\\Delta}, \\qquad y = \\frac{\\Delta_y}{\\Delta}, \\qquad z = \\frac{\\Delta_z}{\\Delta}$$</div></div>

<div class="l-note"><strong>Hatırlatma — 3&times;3 determinant için Sarrus kuralı.</strong> İlk iki sütunu sağa kopyala, üç sağa-aşağı köşegen boyunca çarp (topla), üç sola-aşağı köşegen boyunca çarp (çıkar). $\\det = (aei + bfg + cdh) - (gec + hfa + idb)$ matris $\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$ için. Paslı geliyorsa 73. dersi tekrar et.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 3&times;3</div><div class="example-body">$\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}$ sistemini çöz.<br><br><strong>Adım 1.</strong> Katsayılar matrisi ve sağ taraf: $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & -1 & 1 \\\\ 1 & 2 & -1 \\end{pmatrix}$, $B = \\begin{pmatrix} 6 \\\\ 3 \\\\ 2 \\end{pmatrix}$.<br><br><strong>Adım 2.</strong> Sarrus ile $\\Delta$'yı hesapla:<br>$\\Delta = (1)(-1)(-1) + (1)(1)(1) + (1)(2)(2) - (1)(-1)(1) - (2)(1)(1) - (-1)(2)(1)$<br>$\\quad = 1 + 1 + 4 - (-1) - 2 - (-2) = 1 + 1 + 4 + 1 - 2 + 2 = \\mathbf{7}$.<br><br><strong>Adım 3.</strong> $\\Delta_x$: 1. sütunu $B$ ile değiştir:<br>$\\Delta_x = \\begin{vmatrix} 6 & 1 & 1 \\\\ 3 & -1 & 1 \\\\ 2 & 2 & -1 \\end{vmatrix} = (6)(-1)(-1) + (1)(1)(2) + (1)(3)(2) - (2)(-1)(1) - (2)(1)(6) - (-1)(3)(1)$<br>$\\quad = 6 + 2 + 6 - (-2) - 12 - (-3) = 6 + 2 + 6 + 2 - 12 + 3 = \\mathbf{7}$.<br><br><strong>Adım 4.</strong> $\\Delta_y$: 2. sütunu $B$ ile değiştir:<br>$\\Delta_y = \\begin{vmatrix} 1 & 6 & 1 \\\\ 2 & 3 & 1 \\\\ 1 & 2 & -1 \\end{vmatrix} = (1)(3)(-1) + (6)(1)(1) + (1)(2)(2) - (1)(3)(1) - (2)(1)(1) - (-1)(2)(6)$<br>$\\quad = -3 + 6 + 4 - 3 - 2 - (-12) = -3 + 6 + 4 - 3 - 2 + 12 = \\mathbf{14}$.<br><br><strong>Adım 5.</strong> $\\Delta_z$: 3. sütunu $B$ ile değiştir:<br>$\\Delta_z = \\begin{vmatrix} 1 & 1 & 6 \\\\ 2 & -1 & 3 \\\\ 1 & 2 & 2 \\end{vmatrix} = (1)(-1)(2) + (1)(3)(1) + (6)(2)(2) - (1)(-1)(6) - (2)(3)(1) - (2)(2)(1)$<br>$\\quad = -2 + 3 + 24 - (-6) - 6 - 4 = -2 + 3 + 24 + 6 - 6 - 4 = \\mathbf{21}$.<br><br><strong>Adım 6.</strong> Böl: $x = 7/7 = \\mathbf{1}$, $y = 14/7 = \\mathbf{2}$, $z = 21/7 = \\mathbf{3}$.<br><br><strong>Doğrulama.</strong> $1 + 2 + 3 = 6$ &check;. $2 - 2 + 3 = 3$ &check;. $1 + 4 - 3 = 2$ &check;.</div></div>

<div class="calc-graph"><div id="plot-l75-33-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> çözümlü örneğin dört 3&times;3 determinantı yan yana. Her determinant 3&times;3 bir ızgaraya sahiptir; yerleştirilen sütun turuncu ile vurgulanır. $\\Delta$ ile her $\\Delta_i$ arasında sadece bir sütunun değiştiğine dikkat et — o, çözümünü aradığın bilinmeyenin sütunudur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function cellTxt(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:14,color:col||'#e8e8e8'}};}
function fr(x0,x1,y0,y1){return {type:'rect',x0:x0,x1:x1,y0:y0,y1:y1,line:{color:'rgba(255,255,255,0.4)',width:1.4},fillcolor:'rgba(0,0,0,0)'};}
function hl(x0,x1,y0,y1){return {type:'rect',x0:x0,x1:x1,y0:y0,y1:y1,line:{color:'#f59e0b',width:2},fillcolor:'rgba(245,158,11,0.12)'};}
function lab(x,y,t,col){return {x:x,y:y,text:t,showarrow:false,font:{size:13,color:col||'#3b82f6',family:'Geist'}};}
var As2=[];var Ss2=[];
var coordsT=[[0,2.5],[0.7,2.5],[1.4,2.5],[0,1.8],[0.7,1.8],[1.4,1.8],[0,1.1],[0.7,1.1],[1.4,1.1]];
function drawBlkT(ox,labelTxt,vals,subCol){
  As2.push(lab(ox+0.7,3.3,'<b>'+labelTxt+'</b>','#3b82f6'));
  for(var k=0;k<9;k++){var cx=ox+coordsT[k][0];var cy=coordsT[k][1];var color='#e8e8e8';if(subCol!==null&&(k%3)===subCol)color='#f59e0b';As2.push(cellTxt(cx,cy,vals[k],color));}
  Ss2.push(fr(ox-0.4,ox+1.8,0.75,3.0));
  if(subCol!==null){Ss2.push(hl(ox-0.35+subCol*0.7,ox+0.35+subCol*0.7,0.8,2.95));}
}
drawBlkT(0,'Δ = 7',['1','1','1','2','−1','1','1','2','−1'],null);
drawBlkT(2.6,'Δ_x = 7',['6','1','1','3','−1','1','2','2','−1'],0);
drawBlkT(5.2,'Δ_y = 14',['1','6','1','2','3','1','1','2','−1'],1);
drawBlkT(7.8,'Δ_z = 21',['1','1','6','2','−1','3','1','2','2'],2);
var layT2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-0.7,9.7],visible:false},yaxis:{range:[0.5,3.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:As2,shapes:Ss2,showlegend:false};
Plotly.newPlot('plot-l75-33-tr',[{x:[0],y:[0],mode:'markers',marker:{color:'rgba(0,0,0,0)'},showlegend:false}],layT2,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Cramer Kuralı Başarısız Olduğunda: $\\Delta = 0$</h2>

<div class="calc-highlight"><strong>Cramer kuralı $\\Delta \\neq 0$ gerektirir.</strong> Katsayılar determinantı sıfırsa $x_i = \\Delta_i / \\Delta$ formülü 0/0 veya $\\Delta_i / 0$ haline gelir, ki bunların hiçbiri geçerli bir sayı değildir. Ama bu "cevap yok" anlamına gelmez — sistemin ya tutarsız (hiç çözümü yok) ya da sonsuz çoklukta çözümü olduğu anlamına gelir. Hangisi olduğunu yardımcı determinantlar $\\Delta_i$ söyler.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$\\Delta$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$\\Delta_i$ değerleri</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Anlamı</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Çözüm yapısı</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;color:#10b981">&ne; 0</td><td style="padding:0.5rem 0.8rem">herhangi bir değer</td><td style="padding:0.5rem 0.8rem">Cramer uygulanır</td><td style="padding:0.5rem 0.8rem">Tek çözüm: $x_i = \\Delta_i / \\Delta$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem;color:#ef4444">= 0</td><td style="padding:0.5rem 0.8rem">en az bir $\\Delta_i \\neq 0$</td><td style="padding:0.5rem 0.8rem">Tutarsız</td><td style="padding:0.5rem 0.8rem">Çözüm yok: denklemler birbiriyle çelişir</td></tr>
<tr><td style="padding:0.5rem 0.8rem;color:#f59e0b">= 0</td><td style="padding:0.5rem 0.8rem">tüm $\\Delta_i = 0$</td><td style="padding:0.5rem 0.8rem">Bağımlı</td><td style="padding:0.5rem 0.8rem">Sonsuz çoklukta çözüm: bir veya daha fazla serbest parametre</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Geometrik yorum.</strong> 2&times;2 bir sistem için her denklem düzlemde bir doğrudur. Yukarıdaki üç durum, iki doğrunun yapabileceği üç şeye karşılık gelir: bir noktada kesişmek (tek çözüm), paralel ve farklı olmak (çözüm yok) veya aynı doğru olmak (sonsuz çoklukta çözüm). 3&times;3 için her denklem 3-boyutlu uzayda bir düzlemdir ve üç düzlem aynı üç olasılığa sahiptir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — $\\Delta = 0$, TUTARSIZ</div><div class="example-body">$\\begin{cases} x + y = 2 \\\\ 2x + 2y = 5 \\end{cases}$.<br><br>$\\Delta = (1)(2) - (1)(2) = 0$. Kural doğrudan uygulanmaz.<br><br>$\\Delta_x = \\begin{vmatrix} 2 & 1 \\\\ 5 & 2 \\end{vmatrix} = 4 - 5 = -1 \\neq 0$.<br><br>$\\Delta = 0$ ama $\\Delta_x \\neq 0$ olduğundan sistem <strong>tutarsızdır</strong> — çözüm yok. (Geometrik: $x + y = 2$ ve $2x + 2y = 5$ doğruları paralel ama farklı: ilkini 2 ile çarpmak $2x + 2y = 4 \\neq 5$ verir.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — $\\Delta = 0$, SONSUZ ÇOKLUKTA ÇÖZÜM</div><div class="example-body">$\\begin{cases} x + y = 2 \\\\ 2x + 2y = 4 \\end{cases}$.<br><br>$\\Delta = (1)(2) - (1)(2) = 0$. $\\Delta_x = \\begin{vmatrix} 2 & 1 \\\\ 4 & 2 \\end{vmatrix} = 4 - 4 = 0$. $\\Delta_y = \\begin{vmatrix} 1 & 2 \\\\ 2 & 4 \\end{vmatrix} = 4 - 4 = 0$.<br><br>Üç determinant da sıfır: <strong>sonsuz çoklukta çözüm</strong>. (Geometrik: ikinci denklem birincinin tam iki katı — aynı doğruyu betimliyorlar. $x + y = 2$ üzerindeki her nokta bir çözümdür: herhangi gerçek $t$ için $x = t$, $y = 2 - t$.)</div></div>

<h2 class="lesson-title">7. Karar Akış Şeması</h2>

<p class="l-text">Durumları bir araya getirmek küçük bir karar ağacı verir. Önce $\\Delta$'yı hesapla. Sıfır olup olmamasına göre dallan. Sıfırsa, herhangi bir $\\Delta_i$'nin sıfırdan farklı olup olmadığına göre tekrar dallan.</p>

<div class="calc-graph"><div id="plot-l75-flow-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Cramer kuralını uygulamak için tam karar ağacı. Yeşil yapraklar "iyi" sonuçlar (tek çözüm); diğer iki yaprak kural başarısız olduğunda geometrik anlamı tarif eder. Her sistem çözdüğünde bu resmi bir kontrol listesi olarak kullan.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function nodeAnnotT(x,y,t,bg){return {x:x,y:y,text:t,showarrow:false,font:{size:13,color:'#0a0a0a',family:'Geist'},bgcolor:bg||'#3b82f6',borderpad:8,bordercolor:bg||'#3b82f6'};}
var nodesT=[];
nodesT.push(nodeAnnotT(0.5,4,'<b>Δ = det(A) hesapla</b>','#3b82f6'));
nodesT.push(nodeAnnotT(-1.2,2.8,'<b>Δ ≠ 0</b>','#10b981'));
nodesT.push(nodeAnnotT(2.2,2.8,'<b>Δ = 0</b>','#ef4444'));
nodesT.push(nodeAnnotT(-1.2,1.4,'Cramer uygula:<br>x_i = Δ_i / Δ','#10b981'));
nodesT.push(nodeAnnotT(-1.2,0.1,'<b>Tek çözüm</b>','#10b981'));
nodesT.push(nodeAnnotT(1.0,1.4,'Bazı Δ_i ≠ 0','#ef4444'));
nodesT.push(nodeAnnotT(1.0,0.1,'<b>Çözüm yok</b><br>(tutarsız)','#ef4444'));
nodesT.push(nodeAnnotT(3.4,1.4,'Tüm Δ_i = 0','#f59e0b'));
nodesT.push(nodeAnnotT(3.4,0.1,'<b>Sonsuz çoklukta</b><br>(bağımlı)','#f59e0b'));
var arrowsT=[];
function arrT(x0,y0,x1,y1){return {type:'line',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:'rgba(255,255,255,0.45)',width:1.4}};}
arrowsT.push(arrT(0.4,3.7,-1.05,3.0));arrowsT.push(arrT(0.7,3.7,2.05,3.0));
arrowsT.push(arrT(-1.2,2.5,-1.2,1.7));arrowsT.push(arrT(-1.2,1.1,-1.2,0.4));
arrowsT.push(arrT(2.0,2.6,1.1,1.7));arrowsT.push(arrT(2.4,2.6,3.3,1.7));
arrowsT.push(arrT(1.0,1.1,1.0,0.4));arrowsT.push(arrT(3.4,1.1,3.4,0.4));
Plotly.newPlot('plot-l75-flow-tr',[{x:[0],y:[0],mode:'markers',marker:{color:'rgba(0,0,0,0)'},showlegend:false}],{paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{range:[-2.4,4.4],visible:false},yaxis:{range:[-0.4,4.6],visible:false},margin:{t:10,r:10,b:10,l:10},annotations:nodesT,shapes:arrowsT,showlegend:false},{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Cramer mi, Gauss Eliminasyonu mu?</h2>

<div class="calc-highlight"><strong>Cramer 2&times;2 ve 3&times;3 için hızlı ve temizdir, ama $n \\geq 4$ için yavaş ve hantaldır.</strong> Gauss eliminasyonu her boyut için orta hızdadır ve sayısal olarak daha kararlıdır. Sınavda sistemin küçük olduğu ve sadece bir-iki bilinmeyene ihtiyaç duyduğun durumda Cramer'i seç; tüm bilinmeyenleri istediğin ve sistem büyük olduğunda eliminasyonu seç.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">CRAMER'I KULLAN</div><div class="compare-item">Sistem 2&times;2 veya 3&times;3 ise</div><div class="compare-item">Sadece tek bir bilinmeyene ihtiyacın varsa (hepsine değil)</div><div class="compare-item">Katsayılar basit tam sayılarsa — determinantların hesabı kolaydır</div><div class="compare-item">Cevap için tek temiz bir formül istiyorsan</div><div class="compare-item">Varlık ve tekliği ispatlamak istiyorsan ($\\Delta \\neq 0$ iken kural zaten ispattır)</div></div><div class="compare-col"><div class="compare-title">ELİMİNASYONU KULLAN</div><div class="compare-item">Sistem 4&times;4 veya daha büyükse</div><div class="compare-item">Her bilinmeyene ihtiyacın varsa</div><div class="compare-item">Katsayılar dağınık ondalıklar veya bilinmeyen harfler (parametreler) ise</div><div class="compare-item">Yol boyunca $\\Delta = 0$'ı tespit etmek istiyorsan (sıfır pivot işaret eder)</div><div class="compare-item">Analiz için indirgenmiş satır-eşelon formunu da istiyorsan</div></div></div>

<p class="l-text"><strong>Cramer neden hızla yavaşlar.</strong> Kofaktör açılımıyla hesaplanan $n \\times n$ bir determinant kabaca $n!$ çarpma alır. $n = 3$ için bu determinant başına 6 çarpma — iyi. $n = 4$ için 24; $n = 5$ için 120; $n = 10$ için üç milyondan fazla. Gauss eliminasyonu ise yaklaşık $n^3 / 3$ işlem kullanır: $n = 10$ için bu ~330 demektir. Cramer lise ölçeğinde hızlıdır ve mühendislik ölçeğinde pratik değildir.</p>

<div class="l-note"><strong>Sayısal kararlılık dipnotu.</strong> 3&times;3 boyutunda bile, kayan-noktalı girdilerle Cramer, $\\Delta$ küçük olduğunda yuvarlama hatasını büyütebilir. Kalem-kağıt tam sayı problemleri için bu hiç bir sorun değildir, ama gerçek dünya yazılımlarının sistem çözümünde neredeyse hiç Cramer kullanmamasının nedeni budur.</div>

<h2 class="lesson-title">9. Yaygın Hatalar ve Nasıl Kaçınılır</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yanlış sütun yerleştirilmiş</div><div class="card-body">En sık yapılan hata. $\\Delta_x$ için 1. sütunu, $\\Delta_y$ için 2., $\\Delta_z$ için 3. sütunu değiştir. Bilinmeyenin sistemdeki <em>pozisyonunu</em> sütun indisine eşleştir.</div></div>
<div class="calc-card"><div class="card-title">Determinantta işaret hatası</div><div class="card-body">Özellikle 2&times;2'de: $ad - bc$, $ad + bc$ değil. 3&times;3 Sarrus için: üç terim eksi üç terim; işaret takibi en büyük hata kaynağıdır.</div></div>
<div class="calc-card"><div class="card-title">Yanlış yönde bölme</div><div class="card-body">Her zaman $\\Delta_i / \\Delta$, asla $\\Delta / \\Delta_i$ değil. Ana determinant paydadır.</div></div>
<div class="calc-card"><div class="card-title">$\\Delta \\neq 0$ kontrolünü unutmak</div><div class="card-body">Önce $\\Delta$'yı hesapla. Sıfırsa, tutarsızlık ile bağımlılık arasında ayrım yapmak için $\\Delta_i$ testine geç. $\\Delta = 0$ olduğunda hemen "çözüm yok" yazma.</div></div>
<div class="calc-card"><div class="card-title">Satır ve sütunu karıştırmak</div><div class="card-body">Cramer <em>sütunları</em> yerleştirir, satırları değil. Sağ taraf $B$, yukarıdan aşağıya, bilinmeyene karşılık gelen sütuna gider.</div></div>
<div class="calc-card"><div class="card-title">Doğrulamayı atlamak</div><div class="card-body">Her zaman $(x, y, z)$'yi orijinal denklemlere geri koy. 30 saniyelik bir kontrol yanlış işareti yakalar ve tüm problemi kurtarır.</div></div>
</div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<p class="l-text">Çözümleri okumadan önce her birini kendin dene. 2&times;2 ve 3&times;3 karışık, artı bir teşhis ($\\Delta = 0$).</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — TEMEL 2&times;2</div><div class="example-body">$\\begin{cases} 4x - y = 7 \\\\ 2x + 3y = 7 \\end{cases}$ sistemini çöz.<br><br>$\\Delta = (4)(3) - (-1)(2) = 12 + 2 = 14$.<br>$\\Delta_x = \\begin{vmatrix} 7 & -1 \\\\ 7 & 3 \\end{vmatrix} = 21 - (-7) = 28$.<br>$\\Delta_y = \\begin{vmatrix} 4 & 7 \\\\ 2 & 7 \\end{vmatrix} = 28 - 14 = 14$.<br>$x = 28/14 = \\mathbf{2}$, $y = 14/14 = \\mathbf{1}$.<br>Doğrulama: $4(2) - 1 = 7$ &check;. $2(2) + 3(1) = 7$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — NEGATİFLİ 2&times;2</div><div class="example-body">$\\begin{cases} 5x + 2y = 4 \\\\ -3x + y = 9 \\end{cases}$ sistemini çöz.<br><br>$\\Delta = (5)(1) - (2)(-3) = 5 + 6 = 11$.<br>$\\Delta_x = \\begin{vmatrix} 4 & 2 \\\\ 9 & 1 \\end{vmatrix} = 4 - 18 = -14$.<br>$\\Delta_y = \\begin{vmatrix} 5 & 4 \\\\ -3 & 9 \\end{vmatrix} = 45 - (-12) = 57$.<br>$x = -14/11$, $y = 57/11$.<br>Doğrulama: $5(-14/11) + 2(57/11) = -70/11 + 114/11 = 44/11 = 4$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — 2&times;2 TEŞHİS ($\\Delta = 0$)</div><div class="example-body">$\\begin{cases} 3x - 6y = 9 \\\\ -x + 2y = -3 \\end{cases}$ sisteminin çözüm yapısına karar ver.<br><br>$\\Delta = (3)(2) - (-6)(-1) = 6 - 6 = 0$. Cramer doğrudan uygulanmaz.<br>$\\Delta_x = \\begin{vmatrix} 9 & -6 \\\\ -3 & 2 \\end{vmatrix} = 18 - 18 = 0$.<br>$\\Delta_y = \\begin{vmatrix} 3 & 9 \\\\ -1 & -3 \\end{vmatrix} = -9 - (-9) = 0$.<br>Tüm determinantlar sıfır: <strong>sonsuz çoklukta çözüm</strong>. Gerçekten, ikinci denklem birincinin $-1/3$ katıdır — aynı doğrudurlar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — 3&times;3 BASİT</div><div class="example-body">$\\begin{cases} x + y + z = 6 \\\\ x - y + 2z = 5 \\\\ 2x + y - z = 1 \\end{cases}$ sistemini çöz.<br><br>$\\Delta = (1)(-1)(-1) + (1)(2)(2) + (1)(1)(1) - (2)(-1)(1) - (1)(2)(1) - (-1)(1)(1) = 1 + 4 + 1 + 2 - 2 + 1 = 7$.<br>$\\Delta_x = \\begin{vmatrix} 6 & 1 & 1 \\\\ 5 & -1 & 2 \\\\ 1 & 1 & -1 \\end{vmatrix} = 6 + 2 + 5 + 1 - 12 + 5 = 7$.<br>$\\Delta_y = \\begin{vmatrix} 1 & 6 & 1 \\\\ 1 & 5 & 2 \\\\ 2 & 1 & -1 \\end{vmatrix} = -5 + 24 + 1 - 10 - 2 + 6 = 14$.<br>$\\Delta_z = \\begin{vmatrix} 1 & 1 & 6 \\\\ 1 & -1 & 5 \\\\ 2 & 1 & 1 \\end{vmatrix} = -1 + 10 + 6 + 12 - 5 - 1 = 21$.<br>$x = 7/7 = \\mathbf{1}$, $y = 14/7 = \\mathbf{2}$, $z = 21/7 = \\mathbf{3}$.<br>Doğrulama: $1 + 2 + 3 = 6$ &check;. $1 - 2 + 6 = 5$ &check;. $2 + 2 - 3 = 1$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — SIFIRLI 3&times;3</div><div class="example-body">$\\begin{cases} x + 2z = 5 \\\\ y - z = 1 \\\\ 3x + y = 7 \\end{cases}$ sistemini çöz.<br><br>$A = \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 1 & -1 \\\\ 3 & 1 & 0 \\end{pmatrix}$, $B = \\begin{pmatrix} 5 \\\\ 1 \\\\ 7 \\end{pmatrix}$.<br>$\\Delta = (1)(1)(0) + (0)(-1)(3) + (2)(0)(1) - (3)(1)(2) - (1)(-1)(1) - (0)(0)(0) = 0 + 0 + 0 - 6 + 1 - 0 = -5$.<br>$\\Delta_x = \\begin{vmatrix} 5 & 0 & 2 \\\\ 1 & 1 & -1 \\\\ 7 & 1 & 0 \\end{vmatrix} = 0 + 0 + 2 - 14 + 5 - 0 = -7$.<br>$\\Delta_y = \\begin{vmatrix} 1 & 5 & 2 \\\\ 0 & 1 & -1 \\\\ 3 & 7 & 0 \\end{vmatrix} = 0 - 15 + 0 - 6 + 7 - 0 = -14$.<br>$\\Delta_z = \\begin{vmatrix} 1 & 0 & 5 \\\\ 0 & 1 & 1 \\\\ 3 & 1 & 7 \\end{vmatrix} = 7 + 0 + 0 - 15 - 1 - 0 = -9$.<br>$x = -7/-5 = 7/5$, $y = -14/-5 = 14/5$, $z = -9/-5 = 9/5$.<br>Doğrulama: $7/5 + 2(9/5) = 25/5 = 5$ &check;. $14/5 - 9/5 = 5/5 = 1$ &check;. $3(7/5) + 14/5 = 35/5 = 7$ &check;.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — PARAMETRELİ 2&times;2</div><div class="example-body">$\\begin{cases} kx + y = 2 \\\\ x + ky = 2 \\end{cases}$ sisteminin hangi $k$ değerleri için tek çözümü vardır?<br><br>$\\Delta = k^2 - 1$. Tek çözüm $\\Delta \\neq 0$ ile, yani $k \\neq \\pm 1$ ile mümkündür.<br><br>$k = 1$ ise: her iki denklem de $x + y = 2$, sonsuz çoklukta çözüm.<br>$k = -1$ ise: ilki $-x + y = 2$, ikincisi $x - y = 2$, toplamı $0 = 4$, çözüm yok.<br><br>Cevap: tek çözüm için <strong>$k \\neq \\pm 1$</strong>, ki Cramer bunu $x = y = 2/(k+1)$ olarak verir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — SADECE $y$ ARANIYOR</div><div class="example-body">$\\begin{cases} 2x + y - z = 4 \\\\ x - y + 3z = 1 \\\\ 3x + 2y + z = 11 \\end{cases}$ sisteminde <em>sadece</em> $y$'yi bul ($x$ ve $z$'yi bulma).<br><br>$\\Delta = (2)(-1)(1) + (1)(3)(3) + (-1)(1)(2) - (3)(-1)(-1) - (2)(3)(2) - (1)(1)(1) = -2 + 9 - 2 - 3 - 12 - 1 = -11$.<br>$\\Delta_y = \\begin{vmatrix} 2 & 4 & -1 \\\\ 1 & 1 & 3 \\\\ 3 & 11 & 1 \\end{vmatrix} = 2 + 36 - 11 + 3 - 66 - 4 = -40$.<br>$y = -40 / -11 = \\mathbf{40/11}$.<br><br>Bu, Cramer'in parladığı durumdur: toplam iki determinantla tek bir bilinmeyen, tam eliminasyona kıyasla ki o üç bilinmeyenin de çözülmesini zorunlu kılar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — 3&times;3 TEŞHİS ($\\Delta = 0$)</div><div class="example-body">$\\begin{cases} x + y + z = 3 \\\\ 2x + 2y + 2z = 6 \\\\ x - y + z = 1 \\end{cases}$ sisteminin çözüm yapısına karar ver.<br><br>2. satır 1. satırın tam iki katıdır. Sistemin üç bilinmeyende sadece iki bağımsız denklemi var — en fazla bir parametrelik serbestlik.<br>$\\Delta = (1)(2)(1) + (1)(2)(1) + (1)(2)(-1) - (1)(2)(1) - (-1)(2)(1) - (1)(2)(1) = 2 + 2 - 2 - 2 + 2 - 2 = 0$.<br>Şimdi $\\Delta_x = \\begin{vmatrix} 3 & 1 & 1 \\\\ 6 & 2 & 2 \\\\ 1 & -1 & 1 \\end{vmatrix}$ kontrol et. 2. satır = 2&times;1. satır? Evet — 1. satır = (3, 1, 1) ve 2&times;1. satır = (6, 2, 2) = 2. satır. Yani bu determinantın 2. satırı 1. satırın katıdır ve $\\Delta_x = 0$.<br>Benzer şekilde $\\Delta_y = 0$, $\\Delta_z = 0$ (aynı satır-bağımlılığı).<br><br>Sonuç: <strong>sonsuz çoklukta çözüm</strong>. Kalan iki denklem ($x + y + z = 3$, $x - y + z = 1$) toplandığında $2x + 2z = 4$ verir, yani $x + z = 2$; çıkarıldığında $2y = 2$ verir, yani $y = 1$. Çözüm kümesi $\\{(t, 1, 2 - t) : t \\in \\mathbb{R}\\}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cramer kuralı: $x_i = \\Delta_i / \\Delta$, yalnızca $\\Delta = \\det(A) \\neq 0$ olduğunda geçerlidir</li>
<li>$\\Delta_i$, $A$'nın $i$-inci sütununun sağ taraf $B$ ile değiştirilmiş halinin determinantıdır</li>
<li>2&times;2 durumu 3 determinanta, 3&times;3 durumu 4 determinanta ihtiyaç duyar</li>
<li>Kural, $X = A^{-1} B$ ile adjugate formülünün doğrudan bir sonucudur</li>
<li>$\\Delta = 0$ ise: $\\Delta_i$'leri incele. Bazıları sıfırdan farklı &rArr; çözüm yok; hepsi sıfır &rArr; sonsuz çoklukta çözüm</li>
<li>Cramer'i küçük temiz sistemler ve tek bir bilinmeyen bulmak için kullan; $n \\geq 4$ veya kayan-noktalı işler için Gauss eliminasyonuna geç</li>
<li>Çözümü her zaman orijinal denklemlere geri koyarak doğrula</li>
</ul>
</div>`
};
