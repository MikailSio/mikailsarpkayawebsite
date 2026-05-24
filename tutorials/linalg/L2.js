window.LINALG_L2 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A matrix is a rectangle of numbers that acts on space.</strong> The single most useful viewpoint in this whole lesson is the geometric one: every matrix encodes a <em>linear transformation</em> that rotates, scales, shears, or reflects vectors in a perfectly predictable way. Once you can see a matrix as "a machine that does something to space," matrix multiplication stops being a memorisation exercise and becomes a story you can read off the diagram.</p>

<p class="l-text">We will build this picture from the ground up. First we define matrices and the three core operations on them — addition, scalar multiplication, and the product. Then we meet the special matrices that act as the alphabet of linear algebra: identity, diagonal, symmetric, orthogonal. We learn the transpose and its algebraic rules. After that comes the geometric heart of the lesson — rotation, scaling, shear, and reflection matrices in the plane, and how composing them is the same as multiplying them. The lesson closes with the inverse matrix, the determinant viewed as a signed area scaling factor, and a final battery of hand-worked exercises so you can verify every formula yourself.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read matrix shape and indexing notation $A_{ij}$, $A \\in \\mathbb{R}^{m \\times n}$</li>
<li>Add matrices, scale them, and multiply two matrices by hand</li>
<li>Recognise identity, diagonal, symmetric, and orthogonal matrices and know what each one does</li>
<li>Take the transpose and prove the rule $(AB)^T = B^T A^T$</li>
<li>Read off the geometric action of rotation, scaling, shear, and reflection matrices in $\\mathbb{R}^2$</li>
<li>Compose two transformations by multiplying their matrices in the correct order</li>
<li>Compute the inverse and determinant of a $2 \\times 2$ matrix, and a $3 \\times 3$ when needed</li>
<li>Interpret $|\\det A|$ as the area or volume scaling factor of the transformation</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Matrix?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a grade book. Rows are students, columns are subjects, each cell is a number. Strip away the labels and what is left — the rectangle of numbers — is a matrix. The arithmetic in this lesson never cares whose grades they are; it only cares about the shape of the rectangle and the rules for combining rectangles.</div>

<p class="l-text">Formally, an <strong>$m \\times n$ matrix</strong> $A$ is a rectangular array of real numbers arranged in $m$ rows and $n$ columns. The entry in row $i$ and column $j$ is written $A_{ij}$ or $a_{ij}$.</p>

<div class="calc-formula"><div class="formula-label">MATRIX NOTATION</div><div class="formula-main">$$A = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix} \\in \\mathbb{R}^{m \\times n}$$</div><div class="formula-sub">Rows are indexed first ($i$), columns second ($j$). A $3 \\times 2$ matrix has $3$ rows and $2$ columns — always rows first.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The matrix $A$</div><div class="card-body">Uppercase letter. Vectors get lowercase bold ($\\mathbf{v}$); matrices get uppercase ($A$).</div></div>
<div class="calc-card"><div class="card-title">Entry $a_{ij}$</div><div class="card-body">The number in row $i$, column $j$. $a_{23}$ is "row 2, column 3."</div></div>
<div class="calc-card"><div class="card-title">Shape $m \\times n$</div><div class="card-body">$m$ rows, $n$ columns. The $i$-th row is itself an $n$-vector; the $j$-th column is an $m$-vector.</div></div>
<div class="calc-card"><div class="card-title">Square matrix</div><div class="card-body">$m = n$. Square matrices are the ones for which determinant, inverse, eigenvalues all make sense.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">$$A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix}$$This is a $2 \\times 3$ matrix.<br>$a_{12} = 2$ (row 1, column 2). $\\quad a_{23} = 6$ (row 2, column 3).<br>Row 1 is the vector $(1, 2, 3)$.<br>Column 2 is the vector $(2, 5)^T$.<br>A matrix is, simultaneously, a stack of row vectors and a list of column vectors. Both readings will be useful.</div></div>

<div class="l-note"><strong>Mental model.</strong> A matrix has two faces: an <em>algebraic</em> face (a grid of numbers obeying certain rules) and a <em>geometric</em> face (a linear map that transforms vectors). Every operation we define has both an algebraic recipe and a geometric meaning. The bridge between them is the matrix-vector product, which is where the geometric face appears.</div>

<h2 class="lesson-title">2. Matrix Addition and Scalar Multiplication</h2>

<div class="calc-highlight"><strong>Two easy operations first.</strong> Matrix addition and scalar multiplication work entry by entry, exactly like vector addition. There is nothing subtle to memorise — you just match up corresponding cells.</div>

<div class="calc-formula"><div class="formula-label">MATRIX ADDITION</div><div class="formula-main">$$\\bigl(A + B\\bigr)_{ij} \\;=\\; a_{ij} + b_{ij}$$</div><div class="formula-sub">Defined only when $A$ and $B$ have the same shape. You cannot add a $2 \\times 3$ to a $3 \\times 2$.</div></div>

<div class="calc-formula"><div class="formula-label">SCALAR MULTIPLICATION</div><div class="formula-main">$$\\bigl(c\\,A\\bigr)_{ij} \\;=\\; c \\cdot a_{ij}$$</div><div class="formula-sub">A real number $c$ multiplies every entry. Geometrically this stretches the action of $A$ by a factor of $c$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ADDITION</div><div class="example-body">$$\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & -1 \\\\ 0 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 1 \\\\ 3 & 6 \\end{bmatrix}$$Each cell is the sum of the matching cells. Nothing more.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SCALAR MULTIPLE</div><div class="example-body">$$3 \\cdot \\begin{bmatrix} 1 & -2 \\\\ 4 & 0 \\end{bmatrix} = \\begin{bmatrix} 3 & -6 \\\\ 12 & 0 \\end{bmatrix}$$Multiplying by $3$ scales every entry by $3$. Multiplying by $-1$ flips the sign of every entry.</div></div>

<p class="l-text">These two operations satisfy the obvious algebraic laws — commutativity $A + B = B + A$, associativity $(A + B) + C = A + (B + C)$, distributivity $c(A + B) = cA + cB$. The zero matrix $0$ (all entries zero) is the additive identity: $A + 0 = A$.</p>

<h2 class="lesson-title">3. Matrix Multiplication — Care With Order</h2>

<div class="calc-highlight"><strong>The one operation that genuinely needs thinking.</strong> Matrix multiplication is <em>not</em> entry-wise. Instead, the entry of $AB$ in row $i$, column $j$ is the dot product of row $i$ of $A$ with column $j$ of $B$. The shapes must match precisely, and the order $AB$ is not the same as the order $BA$.</div>

<div class="calc-formula"><div class="formula-label">MATRIX PRODUCT</div><div class="formula-main">$$\\bigl(AB\\bigr)_{ij} \\;=\\; \\sum_{k=1}^{n} a_{ik}\\, b_{kj}$$</div><div class="formula-sub">$A$ is $m \\times n$, $B$ is $n \\times p$, and $AB$ is $m \\times p$. The inner dimensions must agree; the outer dimensions become the shape of the result.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shape rule</div><div class="card-body">$(m \\times \\boxed{n}) \\cdot (\\boxed{n} \\times p) = (m \\times p)$. The two boxed numbers must match. The outer two become the result shape.</div></div>
<div class="calc-card"><div class="card-title">Row times column</div><div class="card-body">Entry $(i, j)$ of $AB$ = row $i$ of $A$ dotted with column $j$ of $B$. Nothing more, nothing less.</div></div>
<div class="calc-card"><div class="card-title">Not commutative</div><div class="card-body">In general $AB \\neq BA$. Sometimes one product is even undefined while the other works.</div></div>
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">$(AB)C = A(BC)$. You can re-bracket freely. This is what makes "composition of transformations" well-defined.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $2 \\times 2$ TIMES $2 \\times 2$</div><div class="example-body">Let $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ and $B = \\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix}$.<br><br>$(AB)_{11} = 1 \\cdot 5 + 2 \\cdot 7 = 19$<br>$(AB)_{12} = 1 \\cdot 6 + 2 \\cdot 8 = 22$<br>$(AB)_{21} = 3 \\cdot 5 + 4 \\cdot 7 = 43$<br>$(AB)_{22} = 3 \\cdot 6 + 4 \\cdot 8 = 50$<br><br>$$AB = \\begin{bmatrix} 19 & 22 \\\\ 43 & 50 \\end{bmatrix}$$Now compute $BA$ the same way: $BA = \\begin{bmatrix} 23 & 34 \\\\ 31 & 46 \\end{bmatrix}$. Different from $AB$. Multiplication order matters.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — MATRIX TIMES VECTOR</div><div class="example-body">A column vector is just an $n \\times 1$ matrix, so the rule applies. Let $A = \\begin{bmatrix} 2 & 1 \\\\ 0 & 3 \\end{bmatrix}$ and $\\mathbf{v} = \\begin{bmatrix} 4 \\\\ 5 \\end{bmatrix}$.<br><br>$$A\\mathbf{v} = \\begin{bmatrix} 2 \\cdot 4 + 1 \\cdot 5 \\\\ 0 \\cdot 4 + 3 \\cdot 5 \\end{bmatrix} = \\begin{bmatrix} 13 \\\\ 15 \\end{bmatrix}$$This is the operation that turns a matrix into a transformation: feed in a vector, read out a vector.</div></div>

<div class="l-note"><strong>Why this rule?</strong> Because it is the unique rule that makes $A(B\\mathbf{v}) = (AB)\\mathbf{v}$ — that is, applying $B$ then $A$ to a vector is the same as applying the single matrix $AB$. Matrix multiplication is <em>defined</em> so that composition of linear maps becomes ordinary multiplication of matrices. We will see this in Section 6.</div>

<h2 class="lesson-title">4. Special Matrices</h2>

<div class="calc-highlight"><strong>Vocabulary that pays for itself.</strong> A handful of matrix shapes turn up everywhere. Knowing their names and their geometric meaning saves you computation and makes the algebra readable.</div>

<div class="calc-formula"><div class="formula-label">IDENTITY MATRIX</div><div class="formula-main">$$I_n = \\begin{bmatrix} 1 & 0 & \\cdots & 0 \\\\ 0 & 1 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 1 \\end{bmatrix}$$</div><div class="formula-sub">Ones on the diagonal, zeros everywhere else. $I_n A = A I_n = A$ for any compatible $A$. Geometrically: do nothing.</div></div>

<div class="calc-formula"><div class="formula-label">DIAGONAL MATRIX</div><div class="formula-main">$$D = \\mathrm{diag}(d_1, d_2, \\ldots, d_n) = \\begin{bmatrix} d_1 & & \\\\ & d_2 & \\\\ & & \\ddots \\\\ & & & d_n \\end{bmatrix}$$</div><div class="formula-sub">All entries off the main diagonal are zero. $D \\mathbf{v}$ scales coordinate $i$ by $d_i$. Composition is trivial: $\\mathrm{diag}(a, b) \\cdot \\mathrm{diag}(c, d) = \\mathrm{diag}(ac, bd)$.</div></div>

<div class="calc-formula"><div class="formula-label">SYMMETRIC MATRIX</div><div class="formula-main">$$A = A^T \\quad \\iff \\quad a_{ij} = a_{ji} \\text{ for every } i, j$$</div><div class="formula-sub">Equal to its own transpose. Symmetric matrices have spectacular properties (real eigenvalues, orthogonal eigenvectors) that the next lesson exploits.</div></div>

<div class="calc-formula"><div class="formula-label">ORTHOGONAL MATRIX</div><div class="formula-main">$$Q^T Q = Q Q^T = I \\quad \\iff \\quad Q^{-1} = Q^T$$</div><div class="formula-sub">Columns are unit length and mutually perpendicular. Orthogonal matrices preserve lengths and angles — they are exactly the rigid motions of space (rotations and reflections).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Triangular</div><div class="card-body">Upper triangular: all entries below the diagonal are zero. Lower triangular: all above. Useful for solving linear systems by back-substitution.</div></div>
<div class="calc-card"><div class="card-title">Skew-symmetric</div><div class="card-body">$A^T = -A$. Forces zeros on the diagonal. Encodes infinitesimal rotations.</div></div>
<div class="calc-card"><div class="card-title">Zero matrix</div><div class="card-body">All entries zero. The additive identity. $A + 0 = A$, $A \\cdot 0 = 0$.</div></div>
<div class="calc-card"><div class="card-title">Permutation matrix</div><div class="card-body">A reshuffled identity. Exactly one $1$ in each row and column. Multiplying by it permutes rows or columns.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IDENTITY ACTS LIKE 1</div><div class="example-body">$$I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\quad A = \\begin{bmatrix} 7 & 9 \\\\ 2 & 5 \\end{bmatrix}$$Compute $I_2 A$: row 1 of $I_2$ dotted with column 1 of $A$ is $1 \\cdot 7 + 0 \\cdot 2 = 7$. Continuing through all four cells gives back $A$ exactly. The identity is the "$1$" of matrix multiplication.</div></div>

<h2 class="lesson-title">5. The Transpose and Its Properties</h2>

<div class="calc-highlight"><strong>Flip across the main diagonal.</strong> The transpose $A^T$ of an $m \\times n$ matrix is the $n \\times m$ matrix you get by swapping rows and columns. Rows of $A$ become columns of $A^T$, columns of $A$ become rows of $A^T$.</div>

<div class="calc-formula"><div class="formula-label">TRANSPOSE</div><div class="formula-main">$$\\bigl(A^T\\bigr)_{ij} \\;=\\; A_{ji}$$</div><div class="formula-sub">If $A$ is $m \\times n$, then $A^T$ is $n \\times m$. The entry that was in row $i$, column $j$ moves to row $j$, column $i$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">$$A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix} \\quad \\Longrightarrow \\quad A^T = \\begin{bmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{bmatrix}$$Row 1 of $A$ becomes column 1 of $A^T$. Row 2 becomes column 2. Shape goes $2 \\times 3 \\;\\to\\; 3 \\times 2$.</div></div>

<div class="calc-formula"><div class="formula-label">ALGEBRAIC RULES OF THE TRANSPOSE</div><div class="formula-main">$$\\bigl(A^T\\bigr)^T = A, \\qquad \\bigl(A + B\\bigr)^T = A^T + B^T, \\qquad \\bigl(cA\\bigr)^T = c A^T$$$$\\bigl(AB\\bigr)^T = B^T A^T$$</div><div class="formula-sub">Transposing twice gets you back. Transpose distributes over addition. The product rule reverses the order — this is the only non-obvious one.</div></div>

<div class="calc-example"><div class="example-label">PROOF SKETCH — $(AB)^T = B^T A^T$</div><div class="example-body">Compute the $(i, j)$-entry of each side.<br><br>Left side: $((AB)^T)_{ij} = (AB)_{ji} = \\sum_k a_{jk} b_{ki}$.<br><br>Right side: $(B^T A^T)_{ij} = \\sum_k (B^T)_{ik}(A^T)_{kj} = \\sum_k b_{ki} a_{jk} = \\sum_k a_{jk} b_{ki}$.<br><br>Both sums are identical. The order reversal is forced by the shape rule: if $A$ is $m \\times n$ and $B$ is $n \\times p$, then $A^T B^T$ is $(n \\times m)(p \\times n)$ — the inner dimensions $m, p$ do not match. Only $B^T A^T$ (which is $(p \\times n)(n \\times m) = p \\times m$) has the right shape to equal $(AB)^T$.</div></div>

<div class="l-note"><strong>A symmetric matrix is one for which the transpose is invisible.</strong> $A = A^T$ means the matrix looks the same when reflected across its main diagonal. Symmetric matrices show up wherever a relationship is two-way: distance between $i$ and $j$ is the same as between $j$ and $i$; correlation of variables $X$ and $Y$ equals that of $Y$ and $X$; the dot product matrix of any set of vectors is symmetric.</div>

<h2 class="lesson-title">6. Linear Transformations in $\\mathbb{R}^2$</h2>

<div class="calc-highlight"><strong>Here is the geometric heart of the lesson.</strong> A $2 \\times 2$ matrix $A$ acts on the plane: feed in any point $\\mathbf{v} = (x, y)^T$, read out the point $A\\mathbf{v}$. Doing this to every point of a shape transforms the shape. Four families of matrices cover the most important moves.</div>

<p class="l-text">The trick for reading off the geometric action of any matrix $A$ is to watch what it does to the two standard basis vectors $\\mathbf{e}_1 = (1, 0)^T$ and $\\mathbf{e}_2 = (0, 1)^T$. By the definition of matrix-vector product,</p>

<div class="calc-formula"><div class="formula-label">COLUMNS ARE IMAGES OF BASIS VECTORS</div><div class="formula-main">$$A \\mathbf{e}_1 = \\text{column 1 of } A, \\qquad A \\mathbf{e}_2 = \\text{column 2 of } A$$</div><div class="formula-sub">So if you write down where the matrix sends $\\mathbf{e}_1$ and $\\mathbf{e}_2$, you have written down the matrix. This is the single most useful trick for understanding $2 \\times 2$ matrices.</div></div>

<h3 class="lesson-subtitle">6.1 Rotation</h3>

<p class="l-text">A rotation by angle $\\theta$ counter-clockwise about the origin sends $\\mathbf{e}_1 = (1, 0)^T$ to $(\\cos\\theta, \\sin\\theta)^T$ and $\\mathbf{e}_2 = (0, 1)^T$ to $(-\\sin\\theta, \\cos\\theta)^T$.</p>

<div class="calc-formula"><div class="formula-label">ROTATION MATRIX</div><div class="formula-main">$$R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$$</div><div class="formula-sub">Preserves all distances and all angles. $R_\\theta^T R_\\theta = I$ — rotation matrices are orthogonal. $\\det R_\\theta = \\cos^2\\theta + \\sin^2\\theta = 1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ROTATE $(1, 0)$ BY $90^\\circ$</div><div class="example-body">$\\theta = \\pi/2$, so $\\cos\\theta = 0$, $\\sin\\theta = 1$, and<br><br>$$R_{90} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}, \\quad R_{90} \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}.$$The east-pointing vector rotates to the north-pointing vector, as expected.</div></div>

<h3 class="lesson-subtitle">6.2 Scaling</h3>

<p class="l-text">A scaling stretches each axis independently. Stretch the $x$-direction by $s_x$ and the $y$-direction by $s_y$:</p>

<div class="calc-formula"><div class="formula-label">SCALING MATRIX</div><div class="formula-main">$$S = \\begin{bmatrix} s_x & 0 \\\\ 0 & s_y \\end{bmatrix}$$</div><div class="formula-sub">$s_x = s_y$ gives a uniform scaling (zoom). $s_x \\neq s_y$ produces an axis-aligned stretch. Negative $s$ means flip along that axis.</div></div>

<h3 class="lesson-subtitle">6.3 Shear</h3>

<p class="l-text">A horizontal shear pushes points horizontally by an amount proportional to their height. The $x$-axis stays put; everything above moves to the right (or left, for negative shear).</p>

<div class="calc-formula"><div class="formula-label">HORIZONTAL SHEAR</div><div class="formula-main">$$H_k = \\begin{bmatrix} 1 & k \\\\ 0 & 1 \\end{bmatrix}$$</div><div class="formula-sub">Sends $(x, y)$ to $(x + ky, y)$. A unit square turns into a parallelogram with the same base and height — so the same area, even though it has tilted.</div></div>

<h3 class="lesson-subtitle">6.4 Reflection</h3>

<p class="l-text">A reflection flips space across a line through the origin. Reflection across the $x$-axis sends $(x, y) \\to (x, -y)$.</p>

<div class="calc-formula"><div class="formula-label">REFLECTION MATRICES</div><div class="formula-main">$$F_x = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}, \\qquad F_y = \\begin{bmatrix} -1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\qquad F_{y=x} = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$$</div><div class="formula-sub">All reflection matrices are orthogonal, but their determinant is $-1$ (orientation-reversing) instead of $+1$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rotation $R_\\theta$</div><div class="card-body">Preserves length and angle. Preserves area. $\\det = +1$. Orthogonal.</div></div>
<div class="calc-card"><div class="card-title">Scaling $S$</div><div class="card-body">Preserves directions of axes but stretches them. Area scaled by $|s_x s_y|$. Not orthogonal unless $|s_x| = |s_y| = 1$.</div></div>
<div class="calc-card"><div class="card-title">Shear $H_k$</div><div class="card-body">Preserves area ($\\det = 1$) but neither length nor angle. Turns squares into parallelograms.</div></div>
<div class="calc-card"><div class="card-title">Reflection $F$</div><div class="card-body">Preserves length and angle, but reverses orientation. $\\det = -1$. Orthogonal.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TRIANGLE UNDER A ROTATION</div><div class="example-body">A right triangle has vertices $(0, 0)$, $(1, 0)$, $(0, 1)$. Rotate by $45^\\circ$. The matrix is<br><br>$$R_{45} = \\begin{bmatrix} \\tfrac{\\sqrt 2}{2} & -\\tfrac{\\sqrt 2}{2} \\\\ \\tfrac{\\sqrt 2}{2} & \\tfrac{\\sqrt 2}{2} \\end{bmatrix}.$$Image of $(0, 0)$ is $(0, 0)$.<br>Image of $(1, 0)$ is $(\\tfrac{\\sqrt 2}{2}, \\tfrac{\\sqrt 2}{2})$.<br>Image of $(0, 1)$ is $(-\\tfrac{\\sqrt 2}{2}, \\tfrac{\\sqrt 2}{2})$.<br><br>The rotated triangle has the same side lengths and the same right angle — only its orientation in the plane has changed.</div></div>

<div class="calc-graph"><div id="plot-l2-transforms-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the unit square (gold) and its image under four classical $2\\times 2$ transformations. Rotation by $45^\\circ$ preserves the size and shape but tilts it; non-uniform scaling stretches it into a rectangle; horizontal shear turns it into a parallelogram with the same area; reflection across $y = x$ flips it diagonally. All four are linear maps; all four fix the origin; only their action on basis vectors differs.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function apply(M, pts){return pts.map(function(p){return [M[0][0]*p[0]+M[0][1]*p[1], M[1][0]*p[0]+M[1][1]*p[1]];});}
var square=[[0,0],[1,0],[1,1],[0,1],[0,0]];
var R45=[[Math.cos(Math.PI/4),-Math.sin(Math.PI/4)],[Math.sin(Math.PI/4),Math.cos(Math.PI/4)]];
var S=[[1.6,0],[0,0.7]];
var H=[[1,0.8],[0,1]];
var F=[[0,1],[1,0]];
function trace(name,col,M){var P=apply(M,square);return {x:P.map(function(p){return p[0];}),y:P.map(function(p){return p[1];}),mode:'lines',name:name,line:{color:col,width:2.4}};}
var orig={x:square.map(function(p){return p[0];}),y:square.map(function(p){return p[1];}),mode:'lines',name:'unit square',line:{color:'#c8a96e',width:3,dash:'dot'}};
var t1=trace('rotate 45°','#4ecdc4',R45);
var t2=trace('scale (1.6, 0.7)','#a78bfa',S);
var t3=trace('shear k=0.8','#f87171',H);
var t4=trace('reflect y=x','#f59e0b',F);
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-1.8,2.2],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.4,2.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l2-transforms-en',[orig,t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Composition of Transformations = Matrix Product</h2>

<div class="calc-highlight"><strong>The single most useful theorem in this lesson.</strong> If you apply transformation $B$ to a vector, then apply $A$ to the result, the combined map is the single transformation whose matrix is $AB$. Composition of linear maps <em>is</em> matrix multiplication. The order matters — you read it right-to-left, exactly like function composition.</div>

<div class="calc-formula"><div class="formula-label">COMPOSITION RULE</div><div class="formula-main">$$A\\bigl(B\\mathbf{v}\\bigr) \\;=\\; \\bigl(AB\\bigr)\\mathbf{v}$$</div><div class="formula-sub">Apply $B$ first, then $A$. The combined matrix is $AB$. Reverse the order and you generally get a different transformation — $BA$ applies $A$ first.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ROTATE THEN SCALE vs SCALE THEN ROTATE</div><div class="example-body">Let $R = R_{90} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$ (rotate by $90^\\circ$) and $S = \\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}$ (scale $x$ by $2$).<br><br>Scale first then rotate: $RS = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}\\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 0 & -1 \\\\ 2 & 0 \\end{bmatrix}$.<br><br>Rotate first then scale: $SR = \\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}\\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & -2 \\\\ 1 & 0 \\end{bmatrix}$.<br><br>Different matrices. Try them both on $\\mathbf{e}_1 = (1, 0)^T$: $RS \\mathbf{e}_1 = (0, 2)^T$ but $SR \\mathbf{e}_1 = (0, 1)^T$. The order in which you stretch and turn changes where you end up. Matrix multiplication is non-commutative for the simplest geometric reason.</div></div>

<div class="l-note"><strong>Reading the formula.</strong> If you see $A B C \\mathbf{v}$, read right-to-left: first $C$ acts on $\\mathbf{v}$, then $B$ acts on the result, then $A$. Matrix multiplication's associativity $(AB)C = A(BC)$ means you can choose where to put the brackets, but you cannot change the left-to-right order.</div>

<h2 class="lesson-title">8. The Inverse Matrix</h2>

<div class="calc-highlight"><strong>The inverse undoes a transformation.</strong> If $A$ rotates by $30^\\circ$, then $A^{-1}$ rotates by $-30^\\circ$. If $A$ scales by $3$, then $A^{-1}$ scales by $1/3$. Algebraically, the inverse is defined by the condition that it cancels $A$ from both sides.</div>

<div class="calc-formula"><div class="formula-label">INVERSE MATRIX</div><div class="formula-main">$$A^{-1} A \\;=\\; A A^{-1} \\;=\\; I$$</div><div class="formula-sub">Only defined for square matrices. Even then, not every square matrix has an inverse. A matrix that has one is called <em>invertible</em> or <em>non-singular</em>.</div></div>

<div class="calc-formula"><div class="formula-label">INVERSE OF A $2 \\times 2$ MATRIX</div><div class="formula-main">$$A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\quad \\Longrightarrow \\quad A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$$</div><div class="formula-sub">Swap the diagonal entries, flip the sign of the off-diagonal entries, and divide by $\\det A = ad - bc$. If $ad - bc = 0$ the matrix has no inverse.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $2 \\times 2$ INVERSE</div><div class="example-body">$A = \\begin{bmatrix} 3 & 2 \\\\ 1 & 4 \\end{bmatrix}$. Determinant: $\\det A = 3 \\cdot 4 - 2 \\cdot 1 = 10$. Apply the formula:<br><br>$$A^{-1} = \\tfrac{1}{10} \\begin{bmatrix} 4 & -2 \\\\ -1 & 3 \\end{bmatrix} = \\begin{bmatrix} 0.4 & -0.2 \\\\ -0.1 & 0.3 \\end{bmatrix}.$$Check: $A A^{-1} = \\begin{bmatrix} 3 \\cdot 0.4 + 2 \\cdot (-0.1) & 3 \\cdot (-0.2) + 2 \\cdot 0.3 \\\\ 1 \\cdot 0.4 + 4 \\cdot (-0.1) & 1 \\cdot (-0.2) + 4 \\cdot 0.3 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I_2$. The inverse passes its test.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Existence</div><div class="card-body">$A^{-1}$ exists iff $\\det A \\neq 0$. Zero determinant means the matrix collapses some direction to a single point and cannot be reversed.</div></div>
<div class="calc-card"><div class="card-title">Uniqueness</div><div class="card-body">If an inverse exists it is unique. There is no choice in the matter.</div></div>
<div class="calc-card"><div class="card-title">$(AB)^{-1} = B^{-1} A^{-1}$</div><div class="card-body">Order reverses, just like for the transpose. To undo "first $B$ then $A$," undo $A$ first and then undo $B$.</div></div>
<div class="calc-card"><div class="card-title">$(A^T)^{-1} = (A^{-1})^T$</div><div class="card-body">Inverse and transpose commute. So you can write $A^{-T}$ unambiguously.</div></div>
</div>

<div class="l-note"><strong>Computing $3 \\times 3$ and bigger inverses.</strong> The $2 \\times 2$ formula does not extend cleanly. For $3 \\times 3$ you can use Gauss–Jordan elimination on the augmented matrix $[A \\mid I]$ — row-reduce the left half to $I$, and the right half becomes $A^{-1}$. The cofactor formula $A^{-1} = \\tfrac{1}{\\det A}\\, \\mathrm{adj}(A)$ also works but is exponentially slow as the size grows. Most algebra is done by elimination.</div>

<h2 class="lesson-title">9. The Determinant — Area Scaling Factor</h2>

<div class="calc-highlight"><strong>The single number that says how much a transformation stretches space.</strong> For a $2 \\times 2$ matrix $A$, the determinant $\\det A$ is the signed area of the parallelogram with sides given by the columns of $A$. Its absolute value is the factor by which $A$ scales every area in the plane. Its sign tells you whether $A$ preserves or reverses orientation.</div>

<div class="calc-formula"><div class="formula-label">$2 \\times 2$ DETERMINANT</div><div class="formula-main">$$\\det\\!\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\;=\\; a d - b c$$</div><div class="formula-sub">Down-diagonal product minus up-diagonal product. This is the area of the parallelogram with vertices $(0, 0), (a, c), (a + b, c + d), (b, d)$.</div></div>

<div class="calc-formula"><div class="formula-label">$3 \\times 3$ DETERMINANT (cofactor expansion along the first row)</div><div class="formula-main">$$\\det\\!\\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)$$</div><div class="formula-sub">Each $2 \\times 2$ "minor" comes from striking out the row and column of its coefficient. Signs alternate $+, -, +$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\det = 0$</div><div class="card-body">Transformation crushes the plane to a line (or to the origin). No inverse exists. The columns are linearly dependent.</div></div>
<div class="calc-card"><div class="card-title">$\\det > 0$</div><div class="card-body">Orientation preserved. Counter-clockwise stays counter-clockwise. Rotations and uniform scalings live here.</div></div>
<div class="calc-card"><div class="card-title">$\\det < 0$</div><div class="card-body">Orientation reversed. Like looking at the plane in a mirror. Reflections have determinant $-1$.</div></div>
<div class="calc-card"><div class="card-title">$|\\det| = $ area factor</div><div class="card-body">Any region of area $S$ becomes a region of area $|\\det A| \\cdot S$. In $\\mathbb{R}^3$ it is the volume factor.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">KEY ALGEBRAIC PROPERTIES OF $\\det$</div><div class="formula-main">$$\\det(AB) = \\det A \\cdot \\det B, \\qquad \\det(A^T) = \\det A, \\qquad \\det(A^{-1}) = \\frac{1}{\\det A}$$$$\\det(cA) = c^n \\det A \\;\\; \\text{for } A \\in \\mathbb{R}^{n \\times n}$$</div><div class="formula-sub">The product rule is the deepest of these. It says the area-scaling factor of a composition is the product of the individual scalings — exactly what you would expect.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DETERMINANT AS AREA</div><div class="example-body">$A = \\begin{bmatrix} 3 & 1 \\\\ 0 & 2 \\end{bmatrix}$. Determinant: $3 \\cdot 2 - 1 \\cdot 0 = 6$. The unit square (area $1$) maps to a parallelogram. Its corners are $A \\mathbf{e}_1 = (3, 0)^T$, $A \\mathbf{e}_2 = (1, 2)^T$, and $A(\\mathbf{e}_1 + \\mathbf{e}_2) = (4, 2)^T$. The parallelogram with these corners has base $3$, height $2$, area $6$. The determinant called it correctly.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DETERMINANT TELLS YOU "INVERTIBLE OR NOT"</div><div class="example-body">$B = \\begin{bmatrix} 2 & 4 \\\\ 1 & 2 \\end{bmatrix}$. Determinant: $2 \\cdot 2 - 4 \\cdot 1 = 0$. So $B$ has no inverse. Geometrically: column 2 is twice column 1, so both columns lie on the same line $y = \\tfrac{1}{2}x$. The image of any vector under $B$ is on this line — the plane has been crushed to a line, and there is no way to un-crush it.</div></div>

<div class="l-note"><strong>Why the product rule.</strong> Apply $B$ to a region — area is multiplied by $|\\det B|$. Then apply $A$ to the result — area is multiplied by $|\\det A|$. The combined area factor is $|\\det A| \\cdot |\\det B|$, which must equal $|\\det(AB)|$. The signed version follows from tracking orientations as well. This perspective makes the algebraic identity $\\det(AB) = \\det A \\cdot \\det B$ feel inevitable rather than mysterious.</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Six classical hand-worked exercises. Try each one with pen and paper first; the solutions follow.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — MULTIPLY TWO $2 \\times 2$ MATRICES</div><div class="example-body"><strong>Problem.</strong> Compute $AB$ where $A = \\begin{bmatrix} 2 & 1 \\\\ -1 & 3 \\end{bmatrix}$ and $B = \\begin{bmatrix} 4 & 0 \\\\ 2 & 5 \\end{bmatrix}$.<br><br><strong>Solution.</strong><br>$(AB)_{11} = 2 \\cdot 4 + 1 \\cdot 2 = 10$<br>$(AB)_{12} = 2 \\cdot 0 + 1 \\cdot 5 = 5$<br>$(AB)_{21} = -1 \\cdot 4 + 3 \\cdot 2 = 2$<br>$(AB)_{22} = -1 \\cdot 0 + 3 \\cdot 5 = 15$<br><br>$$AB = \\begin{bmatrix} 10 & 5 \\\\ 2 & 15 \\end{bmatrix}.$$For practice, compute $BA = \\begin{bmatrix} 8 & 4 \\\\ -1 & 17 \\end{bmatrix}$ and confirm $AB \\neq BA$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — INVERSE OF A $2 \\times 2$ MATRIX</div><div class="example-body"><strong>Problem.</strong> Find $A^{-1}$ for $A = \\begin{bmatrix} 4 & 7 \\\\ 2 & 6 \\end{bmatrix}$.<br><br><strong>Solution.</strong> First compute the determinant: $\\det A = 4 \\cdot 6 - 7 \\cdot 2 = 24 - 14 = 10 \\neq 0$, so the inverse exists. Apply the $2 \\times 2$ formula:<br><br>$$A^{-1} = \\tfrac{1}{10} \\begin{bmatrix} 6 & -7 \\\\ -2 & 4 \\end{bmatrix} = \\begin{bmatrix} 0.6 & -0.7 \\\\ -0.2 & 0.4 \\end{bmatrix}.$$Verify by computing $A A^{-1}$: $(A A^{-1})_{11} = 4 \\cdot 0.6 + 7 \\cdot (-0.2) = 2.4 - 1.4 = 1$. $(A A^{-1})_{12} = 4 \\cdot (-0.7) + 7 \\cdot 0.4 = -2.8 + 2.8 = 0$. The remaining two entries similarly give $0$ and $1$. Result is $I_2$, as required.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — DETERMINANT OF A $3 \\times 3$ MATRIX</div><div class="example-body"><strong>Problem.</strong> Compute $\\det A$ for $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{bmatrix}$.<br><br><strong>Solution.</strong> Expand along the first row:<br><br>$\\det A = 1 \\cdot \\det\\!\\begin{bmatrix} 1 & 4 \\\\ 6 & 0 \\end{bmatrix} - 2 \\cdot \\det\\!\\begin{bmatrix} 0 & 4 \\\\ 5 & 0 \\end{bmatrix} + 3 \\cdot \\det\\!\\begin{bmatrix} 0 & 1 \\\\ 5 & 6 \\end{bmatrix}$<br><br>$= 1 \\cdot (1 \\cdot 0 - 4 \\cdot 6) - 2 \\cdot (0 \\cdot 0 - 4 \\cdot 5) + 3 \\cdot (0 \\cdot 6 - 1 \\cdot 5)$<br><br>$= 1 \\cdot (-24) - 2 \\cdot (-20) + 3 \\cdot (-5) = -24 + 40 - 15 = \\boxed{1}.$<br><br>The determinant is $1$, so $A$ is invertible and preserves area.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — IMAGE OF A POINT UNDER A ROTATION</div><div class="example-body"><strong>Problem.</strong> Where does the point $(2, 1)$ go under rotation by $60^\\circ$ counter-clockwise about the origin?<br><br><strong>Solution.</strong> The rotation matrix is<br><br>$$R_{60} = \\begin{bmatrix} \\cos 60^\\circ & -\\sin 60^\\circ \\\\ \\sin 60^\\circ & \\cos 60^\\circ \\end{bmatrix} = \\begin{bmatrix} \\tfrac{1}{2} & -\\tfrac{\\sqrt 3}{2} \\\\ \\tfrac{\\sqrt 3}{2} & \\tfrac{1}{2} \\end{bmatrix}.$$Apply to $(2, 1)^T$:<br><br>$$R_{60}\\!\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} \\tfrac{1}{2}\\cdot 2 - \\tfrac{\\sqrt 3}{2}\\cdot 1 \\\\ \\tfrac{\\sqrt 3}{2}\\cdot 2 + \\tfrac{1}{2}\\cdot 1 \\end{bmatrix} = \\begin{bmatrix} 1 - \\tfrac{\\sqrt 3}{2} \\\\ \\sqrt 3 + \\tfrac{1}{2} \\end{bmatrix} \\approx \\begin{bmatrix} 0.134 \\\\ 2.232 \\end{bmatrix}.$$Sanity check: the distance from the origin should be preserved. $\\|(2, 1)\\| = \\sqrt 5 \\approx 2.236$, and the image's norm is $\\sqrt{0.134^2 + 2.232^2} \\approx 2.236$. Same length, as required.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — VERIFY $(AB)^T = B^T A^T$</div><div class="example-body"><strong>Problem.</strong> Verify the rule $(AB)^T = B^T A^T$ on the matrices $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ and $B = \\begin{bmatrix} 0 & 1 \\\\ 5 & 2 \\end{bmatrix}$.<br><br><strong>Solution.</strong> Compute $AB$ first:<br>$AB = \\begin{bmatrix} 1 \\cdot 0 + 2 \\cdot 5 & 1 \\cdot 1 + 2 \\cdot 2 \\\\ 3 \\cdot 0 + 4 \\cdot 5 & 3 \\cdot 1 + 4 \\cdot 2 \\end{bmatrix} = \\begin{bmatrix} 10 & 5 \\\\ 20 & 11 \\end{bmatrix}$.<br><br>Transpose: $(AB)^T = \\begin{bmatrix} 10 & 20 \\\\ 5 & 11 \\end{bmatrix}$.<br><br>Now compute $B^T A^T$. Transposes: $A^T = \\begin{bmatrix} 1 & 3 \\\\ 2 & 4 \\end{bmatrix}$, $B^T = \\begin{bmatrix} 0 & 5 \\\\ 1 & 2 \\end{bmatrix}$.<br><br>$B^T A^T = \\begin{bmatrix} 0 \\cdot 1 + 5 \\cdot 2 & 0 \\cdot 3 + 5 \\cdot 4 \\\\ 1 \\cdot 1 + 2 \\cdot 2 & 1 \\cdot 3 + 2 \\cdot 4 \\end{bmatrix} = \\begin{bmatrix} 10 & 20 \\\\ 5 & 11 \\end{bmatrix}$. Equal to $(AB)^T$, as the rule says.<br><br>Try also $A^T B^T = \\begin{bmatrix} 3 & 11 \\\\ 4 & 18 \\end{bmatrix}$ — completely different, confirming the order reverses.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — COMPOSITION OF TWO TRANSFORMATIONS</div><div class="example-body"><strong>Problem.</strong> Let $S = \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix}$ scale the $x$-axis by $2$ and the $y$-axis by $3$. Let $R = R_{90} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$ rotate by $90^\\circ$. Find the matrix that first scales, then rotates. Apply it to the point $(1, 1)$.<br><br><strong>Solution.</strong> "First $S$, then $R$" means the combined matrix is $RS$:<br><br>$$RS = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix} \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix} = \\begin{bmatrix} 0 & -3 \\\\ 2 & 0 \\end{bmatrix}.$$Apply to $(1, 1)^T$: $RS \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 0 \\cdot 1 + (-3) \\cdot 1 \\\\ 2 \\cdot 1 + 0 \\cdot 1 \\end{bmatrix} = \\begin{bmatrix} -3 \\\\ 2 \\end{bmatrix}$.<br><br>Sanity: scaling first sends $(1, 1)$ to $(2, 3)$. Rotating $(2, 3)$ by $90^\\circ$ should send it to $(-3, 2)$ (the rotation sends $(x, y) \\to (-y, x)$). Matches. Now do it in the other order — first rotate, then scale: $SR = \\begin{bmatrix} 0 & -2 \\\\ 3 & 0 \\end{bmatrix}$, and $SR (1, 1)^T = (-2, 3)^T$. Different from $(-3, 2)$. Order matters.</div></div>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">A matrix is an $m \\times n$ rectangle of numbers that admits three core operations: addition and scalar multiplication (entry-wise, easy), and the product $(AB)_{ij} = \\sum_k a_{ik} b_{kj}$ (defined when the inner dimensions agree, non-commutative, associative). The identity $I$, diagonal, symmetric, and orthogonal matrices form a vocabulary of named shapes that show up everywhere. The transpose $A^T$ flips a matrix across its diagonal and satisfies $(AB)^T = B^T A^T$ — the order-reversal that follows from the shape rule. Geometrically, a $2 \\times 2$ matrix acts on the plane: rotation matrices preserve length and angle, scaling matrices stretch along the axes, shear matrices preserve area while turning squares into parallelograms, and reflection matrices flip orientation. Reading off the geometric meaning is easy because the columns of a matrix are the images of the standard basis vectors. Composition of transformations is matrix multiplication — applying $B$ then $A$ to a vector is the same as applying the single matrix $AB$, and order matters because matrix multiplication is non-commutative. The inverse $A^{-1}$ undoes a transformation, exists exactly when $\\det A \\neq 0$, and is given by the swap-and-flip formula for $2 \\times 2$ matrices. The determinant is the signed area scaling factor: $|\\det A|$ tells you how much area a region grows or shrinks under $A$, and the sign tells you whether orientation is preserved or reversed. The product rule $\\det(AB) = \\det A \\cdot \\det B$ is the algebraic statement of "scaling factors multiply." Everything in this lesson can be checked by hand on a $2 \\times 2$ example — that is what the six closing exercises are for.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Matris, uzaya etki eden bir sayı dikdörtgenidir.</strong> Bu dersin en yararlı bakış açısı geometriktir: her matris, vektörleri öngörülebilir biçimde döndüren, ölçekleyen, kayma uygulayan ya da yansıtan bir <em>doğrusal dönüşümü</em> kodlar. Bir matrisi "uzaya bir şey yapan makine" olarak gördüğünüzde, matris çarpımı ezberlenecek bir kural olmaktan çıkar ve diyagramdan okuyabileceğiniz bir hikâyeye dönüşür.</p>

<p class="l-text">Bu resmi sıfırdan inşa edeceğiz. Önce matrisleri ve üç temel işlemi — toplama, skalerle çarpma, çarpım — tanımlıyoruz. Sonra doğrusal cebrin alfabesini oluşturan özel matrislerle tanışıyoruz: birim, köşegen, simetrik, ortogonal. Devrik ve onun cebirsel kurallarını öğreniyoruz. Ardından dersin geometrik kalbi geliyor: düzlemde döndürme, ölçekleme, kayma ve yansıma matrisleri ve bunları birleştirmenin neden çarpmakla aynı şey olduğu. Ders, ters matris, işaretli alan ölçek katsayısı olarak determinant ve her formülü kendiniz doğrulayabileceğiniz son bir elle çözümlü alıştırma seti ile kapanıyor.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Matris boyut ve indeks gösterimi $A_{ij}$, $A \\in \\mathbb{R}^{m \\times n}$ okumayı</li>
<li>Matrisleri toplamayı, ölçeklemeyi ve iki matrisi elle çarpmayı</li>
<li>Birim, köşegen, simetrik ve ortogonal matrisleri tanımayı ve her birinin ne yaptığını bilmeyi</li>
<li>Devriği almayı ve $(AB)^T = B^T A^T$ kuralını kanıtlamayı</li>
<li>$\\mathbb{R}^2$'de döndürme, ölçekleme, kayma ve yansıma matrislerinin geometrik etkisini okumayı</li>
<li>İki dönüşümü matrislerini doğru sırayla çarparak birleştirmeyi</li>
<li>$2 \\times 2$ ve gerektiğinde $3 \\times 3$ matrisin tersini ve determinantını hesaplamayı</li>
<li>$|\\det A|$'yı dönüşümün alan veya hacim ölçek katsayısı olarak yorumlamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Matris Nedir?</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> bir not defteri. Satırlar öğrenciler, sütunlar dersler, her hücre bir sayı. Etiketleri çıkarın — geriye kalan sayı dikdörtgeni bir matristir. Bu dersteki aritmetik, notların kime ait olduğuyla hiç ilgilenmez; yalnızca dikdörtgenin biçimi ve dikdörtgenleri birleştirme kurallarıyla ilgilenir.</div>

<p class="l-text">Biçimsel olarak, bir <strong>$m \\times n$ matrisi</strong> $A$, $m$ satır ve $n$ sütun halinde düzenlenmiş bir gerçel sayı dikdörtgensel dizisidir. Satır $i$ ve sütun $j$'deki giriş $A_{ij}$ veya $a_{ij}$ olarak yazılır.</p>

<div class="calc-formula"><div class="formula-label">MATRİS GÖSTERİMİ</div><div class="formula-main">$$A = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix} \\in \\mathbb{R}^{m \\times n}$$</div><div class="formula-sub">Satırlar önce indekslenir ($i$), sütunlar sonra ($j$). $3 \\times 2$ matris $3$ satır ve $2$ sütuna sahiptir — her zaman satırlar önce.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Matris $A$</div><div class="card-body">Büyük harf. Vektörler küçük kalın harf ($\\mathbf{v}$); matrisler büyük harf ($A$) alır.</div></div>
<div class="calc-card"><div class="card-title">Giriş $a_{ij}$</div><div class="card-body">Satır $i$, sütun $j$'deki sayı. $a_{23}$ "satır 2, sütun 3" demektir.</div></div>
<div class="calc-card"><div class="card-title">Boyut $m \\times n$</div><div class="card-body">$m$ satır, $n$ sütun. $i$-inci satır kendisi bir $n$-vektörüdür; $j$-inci sütun bir $m$-vektörüdür.</div></div>
<div class="calc-card"><div class="card-title">Kare matris</div><div class="card-body">$m = n$. Kare matrisler determinant, ters, özdeğerlerin anlamlı olduğu matrislerdir.</div></div>
</div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK</div><div class="example-body">$$A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix}$$Bu $2 \\times 3$ matristir.<br>$a_{12} = 2$ (satır 1, sütun 2). $\\quad a_{23} = 6$ (satır 2, sütun 3).<br>Satır 1, $(1, 2, 3)$ vektörüdür.<br>Sütun 2, $(2, 5)^T$ vektörüdür.<br>Bir matris aynı anda satır vektörlerinin bir yığınıdır ve sütun vektörlerinin bir listesidir. Her iki okuma da yararlı olacak.</div></div>

<div class="l-note"><strong>Zihinsel model.</strong> Bir matrisin iki yüzü vardır: <em>cebirsel</em> yüz (belirli kurallara uyan sayı ızgarası) ve <em>geometrik</em> yüz (vektörleri dönüştüren doğrusal harita). Tanımladığımız her işlemin hem cebirsel bir tarifi hem de geometrik bir anlamı vardır. Aralarındaki köprü, geometrik yüzün ortaya çıktığı matris-vektör çarpımıdır.</div>

<h2 class="lesson-title">2. Matris Toplama ve Skalerle Çarpma</h2>

<div class="calc-highlight"><strong>Önce iki kolay işlem.</strong> Matris toplama ve skalerle çarpma giriş-giriş çalışır, tam olarak vektör toplama gibi. Ezberlenecek incelik yok — sadece karşılık gelen hücreleri eşleştirirsiniz.</div>

<div class="calc-formula"><div class="formula-label">MATRİS TOPLAMA</div><div class="formula-main">$$\\bigl(A + B\\bigr)_{ij} \\;=\\; a_{ij} + b_{ij}$$</div><div class="formula-sub">Yalnızca $A$ ve $B$ aynı boyuta sahip olduğunda tanımlıdır. $2 \\times 3$'ü $3 \\times 2$'ye ekleyemezsiniz.</div></div>

<div class="calc-formula"><div class="formula-label">SKALERLE ÇARPMA</div><div class="formula-main">$$\\bigl(c\\,A\\bigr)_{ij} \\;=\\; c \\cdot a_{ij}$$</div><div class="formula-sub">Bir gerçel sayı $c$ her girişi çarpar. Geometrik olarak bu, $A$'nın etkisini $c$ faktörü kadar gerer.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — TOPLAMA</div><div class="example-body">$$\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & -1 \\\\ 0 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 1 \\\\ 3 & 6 \\end{bmatrix}$$Her hücre eşleşen hücrelerin toplamıdır. Daha fazlası yok.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — SKALER KAT</div><div class="example-body">$$3 \\cdot \\begin{bmatrix} 1 & -2 \\\\ 4 & 0 \\end{bmatrix} = \\begin{bmatrix} 3 & -6 \\\\ 12 & 0 \\end{bmatrix}$$$3$ ile çarpmak her girişi $3$ ile ölçekler. $-1$ ile çarpmak her girişin işaretini ters çevirir.</div></div>

<p class="l-text">Bu iki işlem bariz cebirsel yasaları sağlar — değişme $A + B = B + A$, birleşme $(A + B) + C = A + (B + C)$, dağılma $c(A + B) = cA + cB$. Sıfır matrisi $0$ (tüm girişleri sıfır) toplamsal birimdir: $A + 0 = A$.</p>

<h2 class="lesson-title">3. Matris Çarpımı — Sıraya Dikkat</h2>

<div class="calc-highlight"><strong>Gerçekten düşünme gerektiren tek işlem.</strong> Matris çarpımı giriş-giriş <em>değildir</em>. Aksine, $AB$'nin satır $i$, sütun $j$'deki girişi, $A$'nın $i$. satırının $B$'nin $j$. sütunu ile iç çarpımıdır. Boyutlar tam olarak uymalı ve $AB$ sırası $BA$ ile aynı değildir.</div>

<div class="calc-formula"><div class="formula-label">MATRİS ÇARPIMI</div><div class="formula-main">$$\\bigl(AB\\bigr)_{ij} \\;=\\; \\sum_{k=1}^{n} a_{ik}\\, b_{kj}$$</div><div class="formula-sub">$A$ $m \\times n$, $B$ $n \\times p$ ve $AB$ $m \\times p$'dir. İç boyutlar uyuşmalı; dış boyutlar sonucun şekli olur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boyut kuralı</div><div class="card-body">$(m \\times \\boxed{n}) \\cdot (\\boxed{n} \\times p) = (m \\times p)$. İki kutulu sayı eşleşmeli. Dıştaki ikisi sonuç şeklini verir.</div></div>
<div class="calc-card"><div class="card-title">Satır kere sütun</div><div class="card-body">$AB$'nin $(i, j)$ girişi = $A$'nın $i$. satırının $B$'nin $j$. sütunuyla iç çarpımı. Daha fazlası değil, daha azı değil.</div></div>
<div class="calc-card"><div class="card-title">Değişmeli değildir</div><div class="card-body">Genellikle $AB \\neq BA$. Bazen bir çarpım tanımsız iken diğeri çalışır.</div></div>
<div class="calc-card"><div class="card-title">Birleşmelidir</div><div class="card-body">$(AB)C = A(BC)$. Parantezleri serbestçe yeniden ayarlayabilirsiniz. "Dönüşümlerin bileşimini" iyi tanımlı kılan budur.</div></div>
</div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — $2 \\times 2$ KERE $2 \\times 2$</div><div class="example-body">$A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ ve $B = \\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix}$ olsun.<br><br>$(AB)_{11} = 1 \\cdot 5 + 2 \\cdot 7 = 19$<br>$(AB)_{12} = 1 \\cdot 6 + 2 \\cdot 8 = 22$<br>$(AB)_{21} = 3 \\cdot 5 + 4 \\cdot 7 = 43$<br>$(AB)_{22} = 3 \\cdot 6 + 4 \\cdot 8 = 50$<br><br>$$AB = \\begin{bmatrix} 19 & 22 \\\\ 43 & 50 \\end{bmatrix}$$Şimdi aynı yolla $BA$'yı hesaplayın: $BA = \\begin{bmatrix} 23 & 34 \\\\ 31 & 46 \\end{bmatrix}$. $AB$'den farklı. Çarpma sırası önemlidir.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — MATRİS KERE VEKTÖR</div><div class="example-body">Sütun vektörü yalnızca $n \\times 1$ matristir, bu yüzden kural geçerlidir. $A = \\begin{bmatrix} 2 & 1 \\\\ 0 & 3 \\end{bmatrix}$ ve $\\mathbf{v} = \\begin{bmatrix} 4 \\\\ 5 \\end{bmatrix}$ olsun.<br><br>$$A\\mathbf{v} = \\begin{bmatrix} 2 \\cdot 4 + 1 \\cdot 5 \\\\ 0 \\cdot 4 + 3 \\cdot 5 \\end{bmatrix} = \\begin{bmatrix} 13 \\\\ 15 \\end{bmatrix}$$Bu, bir matrisi dönüşüme dönüştüren işlemdir: vektör girin, vektör okuyun.</div></div>

<div class="l-note"><strong>Neden bu kural?</strong> Çünkü bu, $A(B\\mathbf{v}) = (AB)\\mathbf{v}$'yi sağlayan biricik kuraldır — yani önce $B$ sonra $A$'yı bir vektöre uygulamak, tek bir $AB$ matrisini uygulamakla aynı şeydir. Matris çarpımı, doğrusal haritaların bileşiminin matrislerin sıradan çarpımı olması için <em>tanımlanmıştır</em>. Bunu 7. bölümde göreceğiz.</div>

<h2 class="lesson-title">4. Özel Matrisler</h2>

<div class="calc-highlight"><strong>Kendini ödeyen bir kelime dağarcığı.</strong> Birkaç matris biçimi her yerde karşımıza çıkar. Adlarını ve geometrik anlamlarını bilmek, hesaplamadan tasarruf ettirir ve cebiri okunabilir kılar.</div>

<div class="calc-formula"><div class="formula-label">BİRİM MATRİSİ</div><div class="formula-main">$$I_n = \\begin{bmatrix} 1 & 0 & \\cdots & 0 \\\\ 0 & 1 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 1 \\end{bmatrix}$$</div><div class="formula-sub">Köşegende birler, başka her yerde sıfırlar. Her uyumlu $A$ için $I_n A = A I_n = A$. Geometrik olarak: hiçbir şey yapma.</div></div>

<div class="calc-formula"><div class="formula-label">KÖŞEGEN MATRİS</div><div class="formula-main">$$D = \\mathrm{diag}(d_1, d_2, \\ldots, d_n) = \\begin{bmatrix} d_1 & & \\\\ & d_2 & \\\\ & & \\ddots \\\\ & & & d_n \\end{bmatrix}$$</div><div class="formula-sub">Ana köşegenin dışındaki tüm girişler sıfır. $D \\mathbf{v}$ koordinat $i$'yi $d_i$ ile ölçekler. Bileşim önemsizdir: $\\mathrm{diag}(a, b) \\cdot \\mathrm{diag}(c, d) = \\mathrm{diag}(ac, bd)$.</div></div>

<div class="calc-formula"><div class="formula-label">SİMETRİK MATRİS</div><div class="formula-main">$$A = A^T \\quad \\iff \\quad a_{ij} = a_{ji} \\text{ her } i, j \\text{ için}$$</div><div class="formula-sub">Kendi devriğine eşittir. Simetrik matrisler muhteşem özelliklere sahiptir (gerçel özdeğerler, ortogonal özvektörler), bir sonraki ders bunları kullanır.</div></div>

<div class="calc-formula"><div class="formula-label">ORTOGONAL MATRİS</div><div class="formula-main">$$Q^T Q = Q Q^T = I \\quad \\iff \\quad Q^{-1} = Q^T$$</div><div class="formula-sub">Sütunları birim uzunluktadır ve karşılıklı diktir. Ortogonal matrisler uzunlukları ve açıları korur — uzayın katı hareketleridir (döndürmeler ve yansımalar).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Üçgen</div><div class="card-body">Üst üçgen: köşegen altındaki tüm girişler sıfır. Alt üçgen: üstündekiler. Geri-yerine-koyma ile doğrusal sistemleri çözmek için yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Ters-simetrik</div><div class="card-body">$A^T = -A$. Köşegende sıfırları zorlar. Sonsuz küçük döndürmeleri kodlar.</div></div>
<div class="calc-card"><div class="card-title">Sıfır matrisi</div><div class="card-body">Tüm girişler sıfır. Toplamsal birim. $A + 0 = A$, $A \\cdot 0 = 0$.</div></div>
<div class="calc-card"><div class="card-title">Permütasyon matrisi</div><div class="card-body">Karılmış birim. Her satır ve sütunda tam olarak bir $1$. Onunla çarpmak satırları veya sütunları permüte eder.</div></div>
</div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — BİRİM 1 GİBİ DAVRANIR</div><div class="example-body">$$I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\quad A = \\begin{bmatrix} 7 & 9 \\\\ 2 & 5 \\end{bmatrix}$$$I_2 A$'yı hesaplayın: $I_2$'nin 1. satırı $A$'nın 1. sütunuyla iç çarpımı $1 \\cdot 7 + 0 \\cdot 2 = 7$'dir. Dört hücrenin tamamından geçince $A$ tam olarak geri gelir. Birim, matris çarpımının "$1$"idir.</div></div>

<h2 class="lesson-title">5. Devrik ve Özellikleri</h2>

<div class="calc-highlight"><strong>Ana köşegen boyunca çevir.</strong> $m \\times n$ matrisin devriği $A^T$, satır ve sütunları değiştirerek elde ettiğiniz $n \\times m$ matristir. $A$'nın satırları $A^T$'nin sütunları olur, $A$'nın sütunları $A^T$'nin satırları olur.</div>

<div class="calc-formula"><div class="formula-label">DEVRİK</div><div class="formula-main">$$\\bigl(A^T\\bigr)_{ij} \\;=\\; A_{ji}$$</div><div class="formula-sub">$A$ $m \\times n$ ise $A^T$ $n \\times m$'dir. Satır $i$, sütun $j$'de olan giriş, satır $j$, sütun $i$'ye taşınır.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK</div><div class="example-body">$$A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix} \\quad \\Longrightarrow \\quad A^T = \\begin{bmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{bmatrix}$$$A$'nın 1. satırı $A^T$'nin 1. sütunu olur. 2. satır 2. sütun olur. Boyut $2 \\times 3 \\;\\to\\; 3 \\times 2$.</div></div>

<div class="calc-formula"><div class="formula-label">DEVRİĞİN CEBİRSEL KURALLARI</div><div class="formula-main">$$\\bigl(A^T\\bigr)^T = A, \\qquad \\bigl(A + B\\bigr)^T = A^T + B^T, \\qquad \\bigl(cA\\bigr)^T = c A^T$$$$\\bigl(AB\\bigr)^T = B^T A^T$$</div><div class="formula-sub">İki kez devirmek başa döndürür. Devrik toplama üzerinde dağılır. Çarpım kuralı sırayı tersine çevirir — bariz olmayan tek kural budur.</div></div>

<div class="calc-example"><div class="example-label">KANIT TASLAĞI — $(AB)^T = B^T A^T$</div><div class="example-body">Her iki tarafın $(i, j)$ girişini hesapla.<br><br>Sol taraf: $((AB)^T)_{ij} = (AB)_{ji} = \\sum_k a_{jk} b_{ki}$.<br><br>Sağ taraf: $(B^T A^T)_{ij} = \\sum_k (B^T)_{ik}(A^T)_{kj} = \\sum_k b_{ki} a_{jk} = \\sum_k a_{jk} b_{ki}$.<br><br>İki toplam özdeş. Sıra tersine çevrilmesi boyut kuralı tarafından zorlanır: $A$ $m \\times n$ ve $B$ $n \\times p$ ise $A^T B^T$ $(n \\times m)(p \\times n)$'dir — iç boyutlar $m, p$ eşleşmez. Yalnızca $B^T A^T$ ($(p \\times n)(n \\times m) = p \\times m$ olan) $(AB)^T$'ye eşit olmak için doğru boyuta sahiptir.</div></div>

<div class="l-note"><strong>Simetrik matris devriğin görünmez olduğu matristir.</strong> $A = A^T$, matrisin ana köşegeni boyunca yansıtıldığında aynı göründüğü anlamına gelir. Simetrik matrisler, bir ilişkinin çift yönlü olduğu her yerde ortaya çıkar: $i$ ve $j$ arasındaki uzaklık $j$ ve $i$ arasındakiyle aynıdır; $X$ ve $Y$ değişkenlerinin korelasyonu $Y$ ve $X$'inkine eşittir; herhangi bir vektör kümesinin iç çarpım matrisi simetriktir.</div>

<h2 class="lesson-title">6. $\\mathbb{R}^2$'de Doğrusal Dönüşümler</h2>

<div class="calc-highlight"><strong>İşte dersin geometrik kalbi.</strong> Bir $2 \\times 2$ matris $A$ düzleme etki eder: herhangi bir noktayı $\\mathbf{v} = (x, y)^T$ verin, $A\\mathbf{v}$ noktasını okuyun. Bunu bir şeklin her noktasına yapmak şekli dönüştürür. Dört matris ailesi en önemli hareketleri kapsar.</div>

<p class="l-text">Herhangi bir $A$ matrisinin geometrik etkisini okuma hilesi, iki standart taban vektörü $\\mathbf{e}_1 = (1, 0)^T$ ve $\\mathbf{e}_2 = (0, 1)^T$'ye ne yaptığını izlemektir. Matris-vektör çarpımının tanımı gereği,</p>

<div class="calc-formula"><div class="formula-label">SÜTUNLAR TABAN VEKTÖRLERİNİN GÖRÜNTÜSÜDÜR</div><div class="formula-main">$$A \\mathbf{e}_1 = A\\text{'nın 1. sütunu}, \\qquad A \\mathbf{e}_2 = A\\text{'nın 2. sütunu}$$</div><div class="formula-sub">Bir matrisin $\\mathbf{e}_1$ ve $\\mathbf{e}_2$'yi nereye gönderdiğini yazarsanız, matrisi yazmış olursunuz. Bu, $2 \\times 2$ matrisleri anlamak için tek en yararlı hile.</div></div>

<h3 class="lesson-subtitle">6.1 Döndürme</h3>

<p class="l-text">Orijin etrafında saat yönünün tersine $\\theta$ açısıyla döndürme, $\\mathbf{e}_1 = (1, 0)^T$'yi $(\\cos\\theta, \\sin\\theta)^T$'ye ve $\\mathbf{e}_2 = (0, 1)^T$'yi $(-\\sin\\theta, \\cos\\theta)^T$'ye gönderir.</p>

<div class="calc-formula"><div class="formula-label">DÖNDÜRME MATRİSİ</div><div class="formula-main">$$R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$$</div><div class="formula-sub">Tüm uzaklıkları ve tüm açıları korur. $R_\\theta^T R_\\theta = I$ — döndürme matrisleri ortogonaldir. $\\det R_\\theta = \\cos^2\\theta + \\sin^2\\theta = 1$.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — $(1, 0)$'I $90^\\circ$ DÖNDÜR</div><div class="example-body">$\\theta = \\pi/2$, yani $\\cos\\theta = 0$, $\\sin\\theta = 1$, ve<br><br>$$R_{90} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}, \\quad R_{90} \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}.$$Beklendiği gibi, doğuyu gösteren vektör kuzeyi gösteren vektöre döner.</div></div>

<h3 class="lesson-subtitle">6.2 Ölçekleme</h3>

<p class="l-text">Ölçekleme her ekseni bağımsız olarak gerer. $x$-yönünü $s_x$ ile ve $y$-yönünü $s_y$ ile gerin:</p>

<div class="calc-formula"><div class="formula-label">ÖLÇEKLEME MATRİSİ</div><div class="formula-main">$$S = \\begin{bmatrix} s_x & 0 \\\\ 0 & s_y \\end{bmatrix}$$</div><div class="formula-sub">$s_x = s_y$ tek tip ölçekleme (yakınlaştırma) verir. $s_x \\neq s_y$ eksen-hizalı esnemeler üretir. Negatif $s$ o eksen boyunca yansıtma anlamına gelir.</div></div>

<h3 class="lesson-subtitle">6.3 Kayma</h3>

<p class="l-text">Yatay kayma noktaları yüksekliklerine orantılı bir miktarda yatay olarak iter. $x$-ekseni yerinde kalır; üzerindeki her şey sağa (veya negatif kayma için sola) hareket eder.</p>

<div class="calc-formula"><div class="formula-label">YATAY KAYMA</div><div class="formula-main">$$H_k = \\begin{bmatrix} 1 & k \\\\ 0 & 1 \\end{bmatrix}$$</div><div class="formula-sub">$(x, y)$'yi $(x + ky, y)$'ye gönderir. Birim kare, aynı taban ve yüksekliğe sahip bir paralelkenara dönüşür — yani eğilmiş olsa bile aynı alana.</div></div>

<h3 class="lesson-subtitle">6.4 Yansıma</h3>

<p class="l-text">Yansıma, uzayı orijinden geçen bir doğru üzerinde tersine çevirir. $x$-ekseni boyunca yansıma $(x, y) \\to (x, -y)$'ye gönderir.</p>

<div class="calc-formula"><div class="formula-label">YANSIMA MATRİSLERİ</div><div class="formula-main">$$F_x = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}, \\qquad F_y = \\begin{bmatrix} -1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\qquad F_{y=x} = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$$</div><div class="formula-sub">Tüm yansıma matrisleri ortogonaldir, ancak determinantları $+1$ değil $-1$'dir (yön-tersine-çeviren).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Döndürme $R_\\theta$</div><div class="card-body">Uzunluğu ve açıyı korur. Alanı korur. $\\det = +1$. Ortogonal.</div></div>
<div class="calc-card"><div class="card-title">Ölçekleme $S$</div><div class="card-body">Eksen yönlerini korur ama onları gerer. Alan $|s_x s_y|$ ile ölçeklenir. $|s_x| = |s_y| = 1$ olmadıkça ortogonal değildir.</div></div>
<div class="calc-card"><div class="card-title">Kayma $H_k$</div><div class="card-body">Alanı ($\\det = 1$) korur ama ne uzunluğu ne de açıyı korur. Kareleri paralelkenarlara dönüştürür.</div></div>
<div class="calc-card"><div class="card-title">Yansıma $F$</div><div class="card-body">Uzunluğu ve açıyı korur, ama yönü tersine çevirir. $\\det = -1$. Ortogonal.</div></div>
</div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — DÖNDÜRME ALTINDA ÜÇGEN</div><div class="example-body">Bir dik üçgenin köşeleri $(0, 0)$, $(1, 0)$, $(0, 1)$'dir. $45^\\circ$ ile döndürün. Matris<br><br>$$R_{45} = \\begin{bmatrix} \\tfrac{\\sqrt 2}{2} & -\\tfrac{\\sqrt 2}{2} \\\\ \\tfrac{\\sqrt 2}{2} & \\tfrac{\\sqrt 2}{2} \\end{bmatrix}.$$$(0, 0)$'ın görüntüsü $(0, 0)$.<br>$(1, 0)$'ın görüntüsü $(\\tfrac{\\sqrt 2}{2}, \\tfrac{\\sqrt 2}{2})$.<br>$(0, 1)$'in görüntüsü $(-\\tfrac{\\sqrt 2}{2}, \\tfrac{\\sqrt 2}{2})$.<br><br>Döndürülmüş üçgen aynı kenar uzunluklarına ve aynı dik açıya sahiptir — yalnızca düzlemdeki yönelimi değişmiştir.</div></div>

<div class="calc-graph"><div id="plot-l2-transforms-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> birim kare (altın) ve dört klasik $2\\times 2$ dönüşüm altındaki görüntüsü. $45^\\circ$ döndürme boyutu ve şekli korur ama eğer; tek tip olmayan ölçekleme onu bir dikdörtgene gerer; yatay kayma onu aynı alana sahip bir paralelkenara dönüştürür; $y = x$ üzerindeki yansıma onu çapraz olarak çevirir. Dördü de doğrusal haritalardır; dördü de orijini sabit tutar; yalnızca taban vektörleri üzerindeki etkileri farklıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function apply(M, pts){return pts.map(function(p){return [M[0][0]*p[0]+M[0][1]*p[1], M[1][0]*p[0]+M[1][1]*p[1]];});}
var square=[[0,0],[1,0],[1,1],[0,1],[0,0]];
var R45=[[Math.cos(Math.PI/4),-Math.sin(Math.PI/4)],[Math.sin(Math.PI/4),Math.cos(Math.PI/4)]];
var S=[[1.6,0],[0,0.7]];
var H=[[1,0.8],[0,1]];
var F=[[0,1],[1,0]];
function trace(name,col,M){var P=apply(M,square);return {x:P.map(function(p){return p[0];}),y:P.map(function(p){return p[1];}),mode:'lines',name:name,line:{color:col,width:2.4}};}
var orig={x:square.map(function(p){return p[0];}),y:square.map(function(p){return p[1];}),mode:'lines',name:'birim kare',line:{color:'#c8a96e',width:3,dash:'dot'}};
var t1=trace('döndürme 45°','#4ecdc4',R45);
var t2=trace('ölçekleme (1.6, 0.7)','#a78bfa',S);
var t3=trace('kayma k=0.8','#f87171',H);
var t4=trace('yansıma y=x','#f59e0b',F);
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-1.8,2.2],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.4,2.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{color:'#ebe6dc'}}};
Plotly.newPlot('plot-l2-transforms-tr',[orig,t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Dönüşümlerin Bileşimi = Matris Çarpımı</h2>

<div class="calc-highlight"><strong>Bu dersin tek en yararlı teoremi.</strong> Bir vektöre önce $B$ dönüşümünü, sonra sonuca $A$'yı uygularsanız, birleşik harita tek matrisi $AB$ olan dönüşümdür. Doğrusal haritaların bileşimi <em>matris çarpımıdır</em>. Sıra önemlidir — onu sağdan sola okursunuz, tıpkı fonksiyon bileşimi gibi.</div>

<div class="calc-formula"><div class="formula-label">BİLEŞİM KURALI</div><div class="formula-main">$$A\\bigl(B\\mathbf{v}\\bigr) \\;=\\; \\bigl(AB\\bigr)\\mathbf{v}$$</div><div class="formula-sub">Önce $B$'yi, sonra $A$'yı uygula. Birleşik matris $AB$'dir. Sırayı tersine çevirin ve genellikle farklı bir dönüşüm elde edersiniz — $BA$ önce $A$'yı uygular.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — DÖNDÜR SONRA ÖLÇEKLE ya da ÖLÇEKLE SONRA DÖNDÜR</div><div class="example-body">$R = R_{90} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$ ($90^\\circ$ döndürme) ve $S = \\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}$ ($x$'i $2$ ile ölçekle) olsun.<br><br>Önce ölçekle sonra döndür: $RS = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}\\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 0 & -1 \\\\ 2 & 0 \\end{bmatrix}$.<br><br>Önce döndür sonra ölçekle: $SR = \\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}\\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & -2 \\\\ 1 & 0 \\end{bmatrix}$.<br><br>Farklı matrisler. İkisini de $\\mathbf{e}_1 = (1, 0)^T$ üzerinde deneyin: $RS \\mathbf{e}_1 = (0, 2)^T$ ama $SR \\mathbf{e}_1 = (0, 1)^T$. Germe ve dönme sıranız nereye varacağınızı değiştirir. Matris çarpımı en basit geometrik sebepten ötürü değişmeli değildir.</div></div>

<div class="l-note"><strong>Formülü okuma.</strong> $A B C \\mathbf{v}$ görürseniz, sağdan sola okuyun: önce $C$ $\\mathbf{v}$'ye etki eder, sonra $B$ sonuca etki eder, sonra $A$. Matris çarpımının birleşmeliği $(AB)C = A(BC)$, parantezleri nereye koyacağınızı seçebileceğiniz anlamına gelir, ancak soldan sağa sırayı değiştiremezsiniz.</div>

<h2 class="lesson-title">8. Ters Matris</h2>

<div class="calc-highlight"><strong>Ters, bir dönüşümü geri alır.</strong> $A$ $30^\\circ$ döndürüyorsa, $A^{-1}$ $-30^\\circ$ döndürür. $A$ $3$ ile ölçekliyorsa, $A^{-1}$ $1/3$ ile ölçekler. Cebirsel olarak, ters, $A$'yı her iki taraftan iptal eden koşulla tanımlanır.</div>

<div class="calc-formula"><div class="formula-label">TERS MATRİS</div><div class="formula-main">$$A^{-1} A \\;=\\; A A^{-1} \\;=\\; I$$</div><div class="formula-sub">Yalnızca kare matrisler için tanımlıdır. O zaman bile her kare matrisin tersi yoktur. Tersi olan matrise <em>tersinir</em> veya <em>tekil olmayan</em> denir.</div></div>

<div class="calc-formula"><div class="formula-label">$2 \\times 2$ MATRİSİN TERSİ</div><div class="formula-main">$$A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\quad \\Longrightarrow \\quad A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$$</div><div class="formula-sub">Köşegen girişleri değiştirin, köşegen dışı girişlerin işaretini değiştirin ve $\\det A = ad - bc$ ile bölün. Eğer $ad - bc = 0$ ise matrisin tersi yoktur.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — $2 \\times 2$ TERS</div><div class="example-body">$A = \\begin{bmatrix} 3 & 2 \\\\ 1 & 4 \\end{bmatrix}$. Determinant: $\\det A = 3 \\cdot 4 - 2 \\cdot 1 = 10$. $2 \\times 2$ formülünü uygula:<br><br>$$A^{-1} = \\tfrac{1}{10} \\begin{bmatrix} 4 & -2 \\\\ -1 & 3 \\end{bmatrix} = \\begin{bmatrix} 0.4 & -0.2 \\\\ -0.1 & 0.3 \\end{bmatrix}.$$Kontrol: $A A^{-1} = \\begin{bmatrix} 3 \\cdot 0.4 + 2 \\cdot (-0.1) & 3 \\cdot (-0.2) + 2 \\cdot 0.3 \\\\ 1 \\cdot 0.4 + 4 \\cdot (-0.1) & 1 \\cdot (-0.2) + 4 \\cdot 0.3 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I_2$. Ters testini geçer.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Varlık</div><div class="card-body">$A^{-1}$ ancak ve ancak $\\det A \\neq 0$ olduğunda vardır. Sıfır determinant, matrisin bir yönü tek bir noktaya çökerttiği ve tersine çevrilemediği anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">Eğer bir ters varsa, tektir. Konuda seçenek yok.</div></div>
<div class="calc-card"><div class="card-title">$(AB)^{-1} = B^{-1} A^{-1}$</div><div class="card-body">Sıra tersine çevrilir, tıpkı devrik gibi. "Önce $B$ sonra $A$"yı geri almak için, önce $A$'yı geri alın ve sonra $B$'yi.</div></div>
<div class="calc-card"><div class="card-title">$(A^T)^{-1} = (A^{-1})^T$</div><div class="card-body">Ters ve devrik değişmelidir. Bu yüzden $A^{-T}$'yi belirsizlik olmadan yazabilirsiniz.</div></div>
</div>

<div class="l-note"><strong>$3 \\times 3$ ve daha büyük tersleri hesaplama.</strong> $2 \\times 2$ formülü temiz bir şekilde genişlemez. $3 \\times 3$ için $[A \\mid I]$ artırılmış matrisi üzerinde Gauss–Jordan eliminasyonunu kullanabilirsiniz — sol yarıyı $I$'ya satır-indirgeyin ve sağ yarı $A^{-1}$ olur. Kofaktör formülü $A^{-1} = \\tfrac{1}{\\det A}\\, \\mathrm{adj}(A)$ da çalışır ancak boyut büyüdükçe katlanarak yavaştır. Cebirin çoğu eliminasyonla yapılır.</div>

<h2 class="lesson-title">9. Determinant — Alan Ölçek Katsayısı</h2>

<div class="calc-highlight"><strong>Bir dönüşümün uzayı ne kadar gerdiğini söyleyen tek sayı.</strong> Bir $2 \\times 2$ matrisi $A$ için, determinant $\\det A$, sütunları $A$'nın sütunlarıyla verilen paralelkenarın işaretli alanıdır. Mutlak değeri, $A$'nın düzlemdeki her alanı ölçeklediği katsayıdır. İşareti size $A$'nın yönelimi koruyup korumadığını söyler.</div>

<div class="calc-formula"><div class="formula-label">$2 \\times 2$ DETERMİNANT</div><div class="formula-main">$$\\det\\!\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\;=\\; a d - b c$$</div><div class="formula-sub">Aşağı-köşegen çarpımı eksi yukarı-köşegen çarpımı. Bu, köşeleri $(0, 0), (a, c), (a + b, c + d), (b, d)$ olan paralelkenarın alanıdır.</div></div>

<div class="calc-formula"><div class="formula-label">$3 \\times 3$ DETERMİNANT (ilk satır boyunca kofaktör açılımı)</div><div class="formula-main">$$\\det\\!\\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)$$</div><div class="formula-sub">Her $2 \\times 2$ "minörü" katsayısının satır ve sütununu silerek elde edilir. İşaretler $+, -, +$ şeklinde değişir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\det = 0$</div><div class="card-body">Dönüşüm düzlemi bir doğruya (veya orijine) ezer. Ters yoktur. Sütunlar doğrusal bağımlıdır.</div></div>
<div class="calc-card"><div class="card-title">$\\det > 0$</div><div class="card-body">Yönelim korunur. Saat yönünün tersi saat yönünün tersi olarak kalır. Döndürmeler ve tek tip ölçeklemeler burada yaşar.</div></div>
<div class="calc-card"><div class="card-title">$\\det < 0$</div><div class="card-body">Yönelim tersine çevrilir. Düzleme aynada bakar gibi. Yansımalar $-1$ determinanta sahiptir.</div></div>
<div class="calc-card"><div class="card-title">$|\\det| = $ alan katsayısı</div><div class="card-body">Alanı $S$ olan herhangi bir bölge, alanı $|\\det A| \\cdot S$ olan bir bölge olur. $\\mathbb{R}^3$'te hacim katsayısıdır.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">$\\det$'in TEMEL CEBİRSEL ÖZELLİKLERİ</div><div class="formula-main">$$\\det(AB) = \\det A \\cdot \\det B, \\qquad \\det(A^T) = \\det A, \\qquad \\det(A^{-1}) = \\frac{1}{\\det A}$$$$\\det(cA) = c^n \\det A \\;\\; \\text{her } A \\in \\mathbb{R}^{n \\times n} \\text{ için}$$</div><div class="formula-sub">Bunlardan en derini çarpım kuralıdır. Bir bileşimin alan ölçek katsayısının, tek tek ölçeklemelerin çarpımı olduğunu söyler — beklediğiniz tam olarak budur.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — DETERMİNANT ALAN OLARAK</div><div class="example-body">$A = \\begin{bmatrix} 3 & 1 \\\\ 0 & 2 \\end{bmatrix}$. Determinant: $3 \\cdot 2 - 1 \\cdot 0 = 6$. Birim kare (alan $1$) bir paralelkenara haritalanır. Köşeleri $A \\mathbf{e}_1 = (3, 0)^T$, $A \\mathbf{e}_2 = (1, 2)^T$ ve $A(\\mathbf{e}_1 + \\mathbf{e}_2) = (4, 2)^T$'dir. Bu köşelere sahip paralelkenar taban $3$, yükseklik $2$, alan $6$'dır. Determinant bunu doğru söyledi.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — DETERMİNANT "TERSİNİR YA DA DEĞİL" DER</div><div class="example-body">$B = \\begin{bmatrix} 2 & 4 \\\\ 1 & 2 \\end{bmatrix}$. Determinant: $2 \\cdot 2 - 4 \\cdot 1 = 0$. Bu yüzden $B$'nin tersi yoktur. Geometrik olarak: sütun 2, sütun 1'in iki katıdır, bu yüzden her iki sütun da $y = \\tfrac{1}{2}x$ doğrusu üzerindedir. $B$ altındaki herhangi bir vektörün görüntüsü bu doğru üzerindedir — düzlem bir doğruya ezilmiştir ve onu geri açmanın yolu yoktur.</div></div>

<div class="l-note"><strong>Neden çarpım kuralı.</strong> Bir bölgeye $B$ uygulayın — alan $|\\det B|$ ile çarpılır. Sonra sonuca $A$ uygulayın — alan $|\\det A|$ ile çarpılır. Birleşik alan katsayısı $|\\det A| \\cdot |\\det B|$'dir ve bu $|\\det(AB)|$'ye eşit olmalıdır. İşaretli versiyon yönelimleri izleyerek de izler. Bu bakış açısı $\\det(AB) = \\det A \\cdot \\det B$ cebirsel özdeşliğini gizemli yerine kaçınılmaz yapar.</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Altı klasik elle çözümlü alıştırma. Önce her birini kalem-kâğıtla deneyin; çözümler ardından gelir.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — İKİ $2 \\times 2$ MATRİSİ ÇARP</div><div class="example-body"><strong>Problem.</strong> $A = \\begin{bmatrix} 2 & 1 \\\\ -1 & 3 \\end{bmatrix}$ ve $B = \\begin{bmatrix} 4 & 0 \\\\ 2 & 5 \\end{bmatrix}$ için $AB$'yi hesaplayın.<br><br><strong>Çözüm.</strong><br>$(AB)_{11} = 2 \\cdot 4 + 1 \\cdot 2 = 10$<br>$(AB)_{12} = 2 \\cdot 0 + 1 \\cdot 5 = 5$<br>$(AB)_{21} = -1 \\cdot 4 + 3 \\cdot 2 = 2$<br>$(AB)_{22} = -1 \\cdot 0 + 3 \\cdot 5 = 15$<br><br>$$AB = \\begin{bmatrix} 10 & 5 \\\\ 2 & 15 \\end{bmatrix}.$$Pratik için $BA = \\begin{bmatrix} 8 & 4 \\\\ -1 & 17 \\end{bmatrix}$'i hesaplayın ve $AB \\neq BA$'yı doğrulayın.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — $2 \\times 2$ MATRİSİN TERSİ</div><div class="example-body"><strong>Problem.</strong> $A = \\begin{bmatrix} 4 & 7 \\\\ 2 & 6 \\end{bmatrix}$ için $A^{-1}$'i bulun.<br><br><strong>Çözüm.</strong> Önce determinantı hesapla: $\\det A = 4 \\cdot 6 - 7 \\cdot 2 = 24 - 14 = 10 \\neq 0$, yani ters vardır. $2 \\times 2$ formülünü uygula:<br><br>$$A^{-1} = \\tfrac{1}{10} \\begin{bmatrix} 6 & -7 \\\\ -2 & 4 \\end{bmatrix} = \\begin{bmatrix} 0.6 & -0.7 \\\\ -0.2 & 0.4 \\end{bmatrix}.$$$A A^{-1}$ hesaplayarak doğrulayın: $(A A^{-1})_{11} = 4 \\cdot 0.6 + 7 \\cdot (-0.2) = 2.4 - 1.4 = 1$. $(A A^{-1})_{12} = 4 \\cdot (-0.7) + 7 \\cdot 0.4 = -2.8 + 2.8 = 0$. Kalan iki giriş benzer şekilde $0$ ve $1$ verir. Sonuç $I_2$, gerektiği gibi.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — $3 \\times 3$ MATRİSİN DETERMİNANTI</div><div class="example-body"><strong>Problem.</strong> $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{bmatrix}$ için $\\det A$'yı hesaplayın.<br><br><strong>Çözüm.</strong> İlk satır boyunca açın:<br><br>$\\det A = 1 \\cdot \\det\\!\\begin{bmatrix} 1 & 4 \\\\ 6 & 0 \\end{bmatrix} - 2 \\cdot \\det\\!\\begin{bmatrix} 0 & 4 \\\\ 5 & 0 \\end{bmatrix} + 3 \\cdot \\det\\!\\begin{bmatrix} 0 & 1 \\\\ 5 & 6 \\end{bmatrix}$<br><br>$= 1 \\cdot (1 \\cdot 0 - 4 \\cdot 6) - 2 \\cdot (0 \\cdot 0 - 4 \\cdot 5) + 3 \\cdot (0 \\cdot 6 - 1 \\cdot 5)$<br><br>$= 1 \\cdot (-24) - 2 \\cdot (-20) + 3 \\cdot (-5) = -24 + 40 - 15 = \\boxed{1}.$<br><br>Determinant $1$'dir, bu yüzden $A$ tersinirdir ve alanı korur.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — BİR NOKTANIN DÖNDÜRME ALTINDAKİ GÖRÜNTÜSÜ</div><div class="example-body"><strong>Problem.</strong> $(2, 1)$ noktası, orijin etrafında saat yönünün tersine $60^\\circ$ döndürme altında nereye gider?<br><br><strong>Çözüm.</strong> Döndürme matrisi<br><br>$$R_{60} = \\begin{bmatrix} \\cos 60^\\circ & -\\sin 60^\\circ \\\\ \\sin 60^\\circ & \\cos 60^\\circ \\end{bmatrix} = \\begin{bmatrix} \\tfrac{1}{2} & -\\tfrac{\\sqrt 3}{2} \\\\ \\tfrac{\\sqrt 3}{2} & \\tfrac{1}{2} \\end{bmatrix}.$$$(2, 1)^T$'ye uygula:<br><br>$$R_{60}\\!\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} \\tfrac{1}{2}\\cdot 2 - \\tfrac{\\sqrt 3}{2}\\cdot 1 \\\\ \\tfrac{\\sqrt 3}{2}\\cdot 2 + \\tfrac{1}{2}\\cdot 1 \\end{bmatrix} = \\begin{bmatrix} 1 - \\tfrac{\\sqrt 3}{2} \\\\ \\sqrt 3 + \\tfrac{1}{2} \\end{bmatrix} \\approx \\begin{bmatrix} 0.134 \\\\ 2.232 \\end{bmatrix}.$$Akıl kontrolü: orijine olan uzaklık korunmalı. $\\|(2, 1)\\| = \\sqrt 5 \\approx 2.236$ ve görüntünün normu $\\sqrt{0.134^2 + 2.232^2} \\approx 2.236$. Aynı uzunluk, gerektiği gibi.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — $(AB)^T = B^T A^T$'Yİ DOĞRULA</div><div class="example-body"><strong>Problem.</strong> $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ ve $B = \\begin{bmatrix} 0 & 1 \\\\ 5 & 2 \\end{bmatrix}$ matrisleri üzerinde $(AB)^T = B^T A^T$ kuralını doğrulayın.<br><br><strong>Çözüm.</strong> Önce $AB$'yi hesaplayın:<br>$AB = \\begin{bmatrix} 1 \\cdot 0 + 2 \\cdot 5 & 1 \\cdot 1 + 2 \\cdot 2 \\\\ 3 \\cdot 0 + 4 \\cdot 5 & 3 \\cdot 1 + 4 \\cdot 2 \\end{bmatrix} = \\begin{bmatrix} 10 & 5 \\\\ 20 & 11 \\end{bmatrix}$.<br><br>Devrik: $(AB)^T = \\begin{bmatrix} 10 & 20 \\\\ 5 & 11 \\end{bmatrix}$.<br><br>Şimdi $B^T A^T$'yi hesaplayın. Devrikler: $A^T = \\begin{bmatrix} 1 & 3 \\\\ 2 & 4 \\end{bmatrix}$, $B^T = \\begin{bmatrix} 0 & 5 \\\\ 1 & 2 \\end{bmatrix}$.<br><br>$B^T A^T = \\begin{bmatrix} 0 \\cdot 1 + 5 \\cdot 2 & 0 \\cdot 3 + 5 \\cdot 4 \\\\ 1 \\cdot 1 + 2 \\cdot 2 & 1 \\cdot 3 + 2 \\cdot 4 \\end{bmatrix} = \\begin{bmatrix} 10 & 20 \\\\ 5 & 11 \\end{bmatrix}$. Kuralın dediği gibi $(AB)^T$'ye eşit.<br><br>Ayrıca $A^T B^T = \\begin{bmatrix} 3 & 11 \\\\ 4 & 18 \\end{bmatrix}$'i de deneyin — tamamen farklı, sıranın tersine çevrildiğini doğruluyor.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — İKİ DÖNÜŞÜMÜN BİLEŞİMİ</div><div class="example-body"><strong>Problem.</strong> $S = \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix}$ $x$-eksenini $2$ ile, $y$-eksenini $3$ ile ölçeklesin. $R = R_{90} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$ $90^\\circ$ döndürsün. Önce ölçekleyen, sonra döndüren matrisi bulun. $(1, 1)$ noktasına uygulayın.<br><br><strong>Çözüm.</strong> "Önce $S$, sonra $R$" birleşik matrisin $RS$ olduğu anlamına gelir:<br><br>$$RS = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix} \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix} = \\begin{bmatrix} 0 & -3 \\\\ 2 & 0 \\end{bmatrix}.$$$(1, 1)^T$'ye uygula: $RS \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 0 \\cdot 1 + (-3) \\cdot 1 \\\\ 2 \\cdot 1 + 0 \\cdot 1 \\end{bmatrix} = \\begin{bmatrix} -3 \\\\ 2 \\end{bmatrix}$.<br><br>Akıl kontrolü: önce ölçeklemek $(1, 1)$'i $(2, 3)$'e gönderir. $(2, 3)$'ü $90^\\circ$ döndürmek $(-3, 2)$'ye göndermeli (döndürme $(x, y) \\to (-y, x)$'e gönderir). Eşleşiyor. Şimdi diğer sırada yapın — önce döndür, sonra ölçekle: $SR = \\begin{bmatrix} 0 & -2 \\\\ 3 & 0 \\end{bmatrix}$ ve $SR (1, 1)^T = (-2, 3)^T$. $(-3, 2)$'den farklı. Sıra önemlidir.</div></div>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Matris, üç temel işlemi kabul eden bir $m \\times n$ sayı dikdörtgenidir: toplama ve skalerle çarpma (giriş-giriş, kolay) ve çarpım $(AB)_{ij} = \\sum_k a_{ik} b_{kj}$ (iç boyutlar uyuştuğunda tanımlı, değişmeli değil, birleşmeli). Birim $I$, köşegen, simetrik ve ortogonal matrisler her yerde görünen adlandırılmış biçimlerden bir kelime dağarcığı oluşturur. Devrik $A^T$, bir matrisi köşegeni boyunca çevirir ve $(AB)^T = B^T A^T$'yi sağlar — boyut kuralından gelen sıra tersine çevrilmesi. Geometrik olarak, bir $2 \\times 2$ matris düzleme etki eder: döndürme matrisleri uzunluk ve açıyı korur, ölçekleme matrisleri eksenler boyunca gerer, kayma matrisleri kareleri paralelkenara dönüştürürken alanı korur ve yansıma matrisleri yönelimi tersine çevirir. Geometrik anlamı okumak kolaydır çünkü bir matrisin sütunları standart taban vektörlerinin görüntüleridir. Dönüşümlerin bileşimi matris çarpımıdır — bir vektöre $B$ sonra $A$ uygulamak tek bir $AB$ matrisini uygulamakla aynıdır ve sıra önemlidir çünkü matris çarpımı değişmeli değildir. Ters $A^{-1}$ bir dönüşümü geri alır, tam olarak $\\det A \\neq 0$ olduğunda vardır ve $2 \\times 2$ matrisler için değiş-çevir formülüyle verilir. Determinant işaretli alan ölçek katsayısıdır: $|\\det A|$, $A$ altında bir bölgenin ne kadar büyüdüğünü veya küçüldüğünü söyler ve işaret size yönelim korunup korunmadığını söyler. Çarpım kuralı $\\det(AB) = \\det A \\cdot \\det B$, "ölçek katsayıları çarpılır"ın cebirsel ifadesidir. Bu dersteki her şey $2 \\times 2$ örneği üzerinde elle kontrol edilebilir — son altı alıştırma tam da bunun içindir.</p>
`
};
