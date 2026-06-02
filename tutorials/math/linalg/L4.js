var LINALG_L4 = {

en: `<p class="l-text"><strong>Eigenvalues and eigenvectors expose the hidden axes of a linear map.</strong> For a square matrix $A$, almost every vector gets rotated and rescaled when you multiply by $A$. But certain special directions are left invariant — the map only stretches them by some scalar. Those directions are the eigenvectors, and the scalars are the eigenvalues. Once you know them, you understand the matrix.</p>

<p class="l-text">This lesson is pure mathematics. We define the eigenvalue problem, build the characteristic polynomial, compute eigenvectors by hand, distinguish algebraic from geometric multiplicity, diagonalize a matrix, raise it to a power, and state the spectral theorem for symmetric matrices. Every example is a $2\\times 2$ or $3\\times 3$ matrix you can verify on paper.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the eigenvalue equation $A\\mathbf{v}=\\lambda\\mathbf{v}$ and interpret it geometrically</li>
<li>Build the characteristic polynomial $\\det(A-\\lambda I)$ and factor it to find eigenvalues</li>
<li>Solve $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$ to extract eigenvectors</li>
<li>Distinguish algebraic from geometric multiplicity; recognize defective matrices</li>
<li>Diagonalize $A=PDP^{-1}$ and use it to compute $A^k$ exactly</li>
<li>Apply the spectral theorem to symmetric matrices</li>
<li>Decide whether a symmetric matrix is positive definite</li>
</ul>
</div>

<h2 class="l-title">1. The Eigenvalue Problem $A\\mathbf{v} = \\lambda \\mathbf{v}$</h2>

<div class="calc-highlight"><strong>Geometric idea.</strong> A square matrix $A$ acts on every vector by sending $\\mathbf{x}\\mapsto A\\mathbf{x}$. For most starting vectors the output points in a brand-new direction. An <em>eigenvector</em> is a non-zero vector whose direction survives the transformation — $A\\mathbf{v}$ lies on the same line through the origin as $\\mathbf{v}$ itself. The <em>eigenvalue</em> $\\lambda$ records how much that line is stretched (or flipped, if $\\lambda<0$).</div>

<div class="calc-formula"><div class="formula-label">DEFINITION</div><div class="formula-main">$$A\\mathbf{v} = \\lambda \\mathbf{v}, \\qquad \\mathbf{v} \\neq \\mathbf{0}$$</div><div class="formula-sub">$A$ is an $n\\times n$ matrix, $\\lambda\\in\\mathbb{R}$ (or $\\mathbb{C}$) is the eigenvalue, $\\mathbf{v}\\in\\mathbb{R}^n$ is the eigenvector. The zero vector is excluded — otherwise every scalar would be an eigenvalue trivially.</div></div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Matrix $A$</div><div class="card-body">Square, $n\\times n$. The linear map whose invariant directions we want.</div></div><div class="calc-card"><div class="card-title">Eigenvector $\\mathbf{v}$</div><div class="card-body">Non-zero, with $A\\mathbf{v}$ parallel to $\\mathbf{v}$. The line $\\operatorname{span}\\{\\mathbf{v}\\}$ is invariant under $A$.</div></div><div class="calc-card"><div class="card-title">Eigenvalue $\\lambda$</div><div class="card-body">The scaling factor. $\\lambda>1$ stretches, $0<\\lambda<1$ contracts, $\\lambda<0$ flips, $\\lambda=0$ collapses.</div></div></div>

<p class="l-text"><strong>Scalar multiples are also eigenvectors.</strong> If $A\\mathbf{v}=\\lambda\\mathbf{v}$ and $c\\neq 0$, then $A(c\\mathbf{v}) = c\\,A\\mathbf{v} = c\\lambda\\mathbf{v} = \\lambda(c\\mathbf{v})$. So eigenvectors are defined up to a non-zero scalar — the whole line through the origin is an invariant subspace. We usually pick a representative (often normalized to unit length).</p>

<div class="calc-example"><div class="example-label">QUICK CHECK BY HAND</div><div class="example-body">Let $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.
<br><br>Try $\\mathbf{v}=(1,1)^{T}$: $A\\mathbf{v} = (3,3)^{T} = 3\\mathbf{v}$. Eigenvalue $\\lambda=3$.
<br>Try $\\mathbf{w}=(1,-1)^{T}$: $A\\mathbf{w} = (1,-1)^{T} = 1\\cdot\\mathbf{w}$. Eigenvalue $\\lambda=1$.
<br>Try $\\mathbf{u}=(1,0)^{T}$: $A\\mathbf{u} = (2,1)^{T}$, not parallel to $\\mathbf{u}$. Not an eigenvector.</div></div>

<div id="plot-eigen-transform" class="plotly-graph"></div>
<script>setTimeout(function(){
var t1={x:[0,1],y:[0,1],mode:"lines+markers",name:"v = (1,1)",line:{color:"#c8a96e",width:3},marker:{size:[6,10]}};
var t2={x:[0,3],y:[0,3],mode:"lines+markers",name:"Av = 3v",line:{color:"#c8a96e",width:3,dash:"dash"},marker:{size:[6,10]}};
var t3={x:[0,1],y:[0,-1],mode:"lines+markers",name:"w = (1,-1)",line:{color:"#4ecdc4",width:3},marker:{size:[6,10]}};
var t4={x:[0,1],y:[0,-1],mode:"lines+markers",name:"Aw = 1·w",line:{color:"#4ecdc4",width:3,dash:"dash"},marker:{size:[6,10]}};
var t5={x:[0,1],y:[0,0],mode:"lines+markers",name:"u = (1,0)",line:{color:"#f87171",width:3},marker:{size:[6,10]}};
var t6={x:[0,2],y:[0,1],mode:"lines+markers",name:"Au (not eigen)",line:{color:"#f87171",width:3,dash:"dash"},marker:{size:[6,10]}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,4],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,4],scaleanchor:"x",title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc",size:10},orientation:"h",y:-0.18}};
Plotly.newPlot("plot-eigen-transform",[t1,t2,t3,t4,t5,t6],layout,{responsive:true,displayModeBar:false});
},150)</script>

<div class="calc-graph"><div class="graph-caption">Gold and teal vectors stay on their own line after applying $A$ — they are eigenvectors. The gold direction is stretched by $\\lambda=3$, the teal direction is fixed ($\\lambda=1$). The red vector $(1,0)^T$ rotates off its line and is therefore not an eigenvector.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If $\\mathbf{v}$ is an eigenvector of $A$ with eigenvalue $\\lambda$, is $\\mathbf{v}$ also an eigenvector of $A^2$? What is its eigenvalue? <em>Apply $A$ twice: $A^2\\mathbf{v}=A(A\\mathbf{v})=A(\\lambda\\mathbf{v})=\\lambda A\\mathbf{v}=\\lambda^2\\mathbf{v}$. So yes, with eigenvalue $\\lambda^2$.</em></div></div>

<h2 class="l-title">2. Finding Eigenvalues: The Characteristic Polynomial</h2>

<div class="calc-highlight"><strong>Strategy.</strong> Rearrange $A\\mathbf{v}=\\lambda\\mathbf{v}$ as $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$. For this homogeneous system to have a non-zero solution $\\mathbf{v}$, the matrix $A-\\lambda I$ must be singular — equivalently $\\det(A-\\lambda I)=0$. This is one polynomial equation in $\\lambda$, and its roots are exactly the eigenvalues of $A$.</div>

<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Start from $A\\mathbf{v}=\\lambda\\mathbf{v}$</div><div class="step-detail">Write $\\lambda\\mathbf{v}=\\lambda I\\mathbf{v}$ so both sides have a matrix acting on $\\mathbf{v}$.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Move everything to one side</div><div class="step-detail">$(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$. We need a non-zero $\\mathbf{v}$ in the null space of $A-\\lambda I$.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Demand $A-\\lambda I$ singular</div><div class="step-detail">A homogeneous system has a non-trivial solution iff the coefficient matrix has zero determinant. So $\\det(A-\\lambda I)=0$.</div></div></div></div>

<div class="calc-formula"><div class="formula-label">CHARACTERISTIC EQUATION</div><div class="formula-main">$$p_A(\\lambda) \\;=\\; \\det(A - \\lambda I) \\;=\\; 0$$</div><div class="formula-sub">$p_A(\\lambda)$ is the <em>characteristic polynomial</em> of $A$. For an $n\\times n$ matrix it has degree $n$, so by the fundamental theorem of algebra it has $n$ roots in $\\mathbb{C}$ (counted with multiplicity).</div></div>

<div class="calc-formula"><div class="formula-label">$2\\times 2$ SHORTCUT</div><div class="formula-main">$$p_A(\\lambda) = \\lambda^2 - \\operatorname{tr}(A)\\,\\lambda + \\det(A)$$</div><div class="formula-sub">For $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$: $\\operatorname{tr}(A)=a+d$, $\\det(A)=ad-bc$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $2\\times 2$</div><div class="example-body">Find the eigenvalues of $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$.
<br><br>$\\operatorname{tr}(A)=7$, $\\det(A)=4\\cdot 3-2\\cdot 1=10$. Characteristic polynomial:
$$p_A(\\lambda)=\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2).$$
Eigenvalues: $\\lambda_1=5$, $\\lambda_2=2$.
<br><br><strong>Sanity check.</strong> Sum of eigenvalues $=5+2=7=\\operatorname{tr}(A)$. Product $=5\\cdot 2=10=\\det(A)$. Both identities hold for every matrix and are the easiest hand-check.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $3\\times 3$ TRIANGULAR</div><div class="example-body">Let $A=\\begin{bmatrix}2&5&0\\\\0&-1&3\\\\0&0&4\\end{bmatrix}$. Since $A$ is upper-triangular,
$$\\det(A-\\lambda I)=(2-\\lambda)(-1-\\lambda)(4-\\lambda),$$
and the eigenvalues are exactly the diagonal entries: $\\lambda_1=2$, $\\lambda_2=-1$, $\\lambda_3=4$. The same fact holds for any triangular matrix — the spectrum lives on the diagonal.</div></div>

<div class="l-note"><strong>Identities you should remember.</strong> For every $n\\times n$ matrix $A$ with eigenvalues $\\lambda_1,\\ldots,\\lambda_n$ (counted with algebraic multiplicity): $\\sum_i \\lambda_i=\\operatorname{tr}(A)$ and $\\prod_i \\lambda_i=\\det(A)$. These follow from expanding $\\det(A-\\lambda I)$ and comparing coefficients of $\\lambda^{n-1}$ and $\\lambda^0$.</div>

<h2 class="l-title">3. Finding Eigenvectors</h2>

<div class="calc-highlight"><strong>Strategy.</strong> Once an eigenvalue $\\lambda$ is known, substitute it back into $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$ and solve the homogeneous system. The solution set is a subspace — the <em>eigenspace</em> $E_\\lambda=\\ker(A-\\lambda I)$. Every non-zero vector in $E_\\lambda$ is an eigenvector for $\\lambda$.</div>

<div class="calc-example"><div class="example-label">EIGENVECTORS FOR $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$</div><div class="example-body"><strong>For $\\lambda_1=5$:</strong>
$$A-5I=\\begin{bmatrix}-1&2\\\\1&-2\\end{bmatrix}.$$
The two rows are linearly dependent (one is $-1$ times the other), as they must be when $\\det(A-\\lambda I)=0$. Solving $-v_1+2v_2=0$ gives $v_1=2v_2$. Taking $v_2=1$ produces
$$\\mathbf{v}_1=\\begin{bmatrix}2\\\\1\\end{bmatrix}.$$
Verify: $A\\mathbf{v}_1=\\begin{bmatrix}4\\cdot 2+2\\cdot 1\\\\1\\cdot 2+3\\cdot 1\\end{bmatrix}=\\begin{bmatrix}10\\\\5\\end{bmatrix}=5\\mathbf{v}_1$.
<br><br><strong>For $\\lambda_2=2$:</strong>
$$A-2I=\\begin{bmatrix}2&2\\\\1&1\\end{bmatrix}, \\qquad 2v_1+2v_2=0 \\Rightarrow v_1=-v_2.$$
Choosing $v_2=1$: $\\mathbf{v}_2=\\begin{bmatrix}-1\\\\1\\end{bmatrix}$. Check: $A\\mathbf{v}_2=(-2,2)^T=2\\mathbf{v}_2$.</div></div>

<div class="calc-example"><div class="example-label">EIGENSPACE OF A REPEATED EIGENVALUE</div><div class="example-body">Take $A=\\begin{bmatrix}3&0\\\\0&3\\end{bmatrix}=3I$. Characteristic polynomial $(3-\\lambda)^2$, so $\\lambda=3$ is a double root. Every vector $\\mathbf{v}\\in\\mathbb{R}^2$ satisfies $A\\mathbf{v}=3\\mathbf{v}$, so $E_3=\\mathbb{R}^2$ — a two-dimensional eigenspace.
<br><br>By contrast take $B=\\begin{bmatrix}3&1\\\\0&3\\end{bmatrix}$. Same characteristic polynomial $(3-\\lambda)^2$, but $B-3I=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$ has rank $1$, so the eigenspace is one-dimensional: spanned by $(1,0)^T$. There is no second linearly independent eigenvector — $B$ is <em>defective</em>.</div></div>

<h2 class="l-title">4. Geometric Meaning — Rotations, Reflections, Stretches</h2>

<div class="calc-highlight"><strong>Reading a matrix through its eigenvalues.</strong> The pattern of eigenvalues (real vs complex, positive vs negative, in $(-1,1)$ vs outside) tells you what kind of linear map you are looking at.</div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Pure stretch</div><div class="card-body">$\\operatorname{diag}(\\lambda_1,\\lambda_2)$ stretches the $x$-axis by $\\lambda_1$ and the $y$-axis by $\\lambda_2$. Both axes are eigenvectors.</div></div><div class="calc-card"><div class="card-title">Rotation by $\\theta$</div><div class="card-body">$R_\\theta=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$ has eigenvalues $e^{\\pm i\\theta}$. No real eigenvectors unless $\\theta\\in\\{0,\\pi\\}$ — rotations preserve no real line.</div></div><div class="calc-card"><div class="card-title">Reflection</div><div class="card-body">Reflection across a line through the origin has eigenvalues $+1$ (the mirror line) and $-1$ (the perpendicular).</div></div><div class="calc-card"><div class="card-title">Projection</div><div class="card-body">Orthogonal projection onto a subspace $W$ has eigenvalue $1$ on $W$ and eigenvalue $0$ on $W^\\perp$.</div></div></div>

<div class="calc-example"><div class="example-label">ROTATION — COMPLEX EIGENVALUES</div><div class="example-body">Let $R_{\\pi/2}=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ (rotation by $90^\\circ$). Then
$$p_R(\\lambda)=\\lambda^2+1=0 \\Rightarrow \\lambda=\\pm i.$$
The eigenvalues are purely imaginary. Geometrically: a $90^\\circ$ rotation does not fix any real direction, which is why no real $\\lambda$ exists. Eigenvectors in $\\mathbb{C}^2$ are $(1,\\mp i)^T$.</div></div>

<div class="calc-example"><div class="example-label">REFLECTION</div><div class="example-body">Reflection across the $x$-axis: $S=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Eigenvalues $1$ and $-1$. Eigenvector for $1$ is $(1,0)^T$ (the mirror line). Eigenvector for $-1$ is $(0,1)^T$ (the direction flipped). Determinant $=-1$ — reflections always have determinant $-1$.</div></div>

<h2 class="l-title">5. Algebraic and Geometric Multiplicity</h2>

<div class="calc-highlight"><strong>Two ways to count an eigenvalue.</strong> The same $\\lambda$ can have a different "weight" in the characteristic polynomial and in the eigenspace. The relationship between these two counts determines whether $A$ is diagonalizable.</div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Algebraic multiplicity $m_a(\\lambda)$</div><div class="card-body">The multiplicity of $\\lambda$ as a root of $p_A$. If $p_A(\\lambda)=(\\lambda-3)^2(\\lambda+1)$, then $m_a(3)=2$ and $m_a(-1)=1$.</div></div><div class="calc-card"><div class="card-title">Geometric multiplicity $m_g(\\lambda)$</div><div class="card-body">The dimension of the eigenspace: $m_g(\\lambda)=\\dim\\ker(A-\\lambda I)$. The number of linearly independent eigenvectors for $\\lambda$.</div></div></div>

<div class="calc-formula"><div class="formula-label">FUNDAMENTAL INEQUALITY</div><div class="formula-main">$$1 \\;\\le\\; m_g(\\lambda) \\;\\le\\; m_a(\\lambda)$$</div><div class="formula-sub">Geometric multiplicity is at least $1$ (otherwise $\\lambda$ would not be an eigenvalue) and never exceeds the algebraic multiplicity. When the equality $m_g=m_a$ holds for every eigenvalue, $A$ is diagonalizable.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$A=\\begin{bmatrix}3&0\\\\0&3\\end{bmatrix}$ — NON-DEFECTIVE</div><div class="compare-item">$p_A=(\\lambda-3)^2$, so $m_a(3)=2$</div><div class="compare-item">$A-3I=0$, kernel is all of $\\mathbb{R}^2$, $m_g(3)=2$</div><div class="compare-item">$m_a=m_g$ — diagonalizable (already diagonal)</div></div><div class="compare-col"><div class="compare-title">$B=\\begin{bmatrix}3&1\\\\0&3\\end{bmatrix}$ — DEFECTIVE</div><div class="compare-item">$p_B=(\\lambda-3)^2$, so $m_a(3)=2$</div><div class="compare-item">$B-3I$ has rank $1$, kernel is $1$-dim, $m_g(3)=1$</div><div class="compare-item">$m_a>m_g$ — not diagonalizable</div></div></div>

<div class="l-note"><strong>Eigenvectors for distinct eigenvalues are linearly independent.</strong> If $A\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i$ and the $\\lambda_i$ are pairwise distinct, then $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$ is linearly independent. So a matrix with $n$ distinct eigenvalues automatically has $n$ independent eigenvectors and is diagonalizable.</div>

<h2 class="l-title">6. Diagonalization $A = PDP^{-1}$</h2>

<div class="calc-highlight"><strong>Change of basis.</strong> If $A$ has $n$ linearly independent eigenvectors, we can collect them into a matrix $P=[\\,\\mathbf{v}_1\\;\\mathbf{v}_2\\;\\cdots\\;\\mathbf{v}_n\\,]$ and write $A=PDP^{-1}$ with $D$ diagonal. In the eigenvector basis the action of $A$ becomes coordinate-by-coordinate scaling.</div>

<div class="calc-formula"><div class="formula-label">DIAGONALIZATION</div><div class="formula-main">$$A = P\\,D\\,P^{-1}, \\qquad D = \\operatorname{diag}(\\lambda_1,\\lambda_2,\\ldots,\\lambda_n)$$</div><div class="formula-sub">Column $i$ of $P$ is the eigenvector $\\mathbf{v}_i$; entry $D_{ii}$ is the matching eigenvalue $\\lambda_i$. The factorization exists iff $A$ has $n$ linearly independent eigenvectors.</div></div>

<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">From $A\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i$ for $i=1,\\ldots,n$</div><div class="step-detail">Stack all $n$ equations side by side: $A[\\mathbf{v}_1\\;\\cdots\\;\\mathbf{v}_n] = [\\lambda_1\\mathbf{v}_1\\;\\cdots\\;\\lambda_n\\mathbf{v}_n]$.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Recognize the right side as $PD$</div><div class="step-detail">The right side equals $P$ times the diagonal matrix $D$ of eigenvalues. Hence $AP=PD$.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Multiply by $P^{-1}$</div><div class="step-detail">If $P$ is invertible (i.e. the eigenvectors are independent), $A=PDP^{-1}$.</div></div></div></div>

<div class="calc-example"><div class="example-label">DIAGONALIZE $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$</div><div class="example-body">From Sections 2–3: $\\lambda_1=5$ with $\\mathbf{v}_1=(2,1)^T$ and $\\lambda_2=2$ with $\\mathbf{v}_2=(-1,1)^T$. Build
$$P=\\begin{bmatrix}2&-1\\\\1&1\\end{bmatrix}, \\quad D=\\begin{bmatrix}5&0\\\\0&2\\end{bmatrix}.$$
Since $\\det(P)=2\\cdot 1-(-1)\\cdot 1=3$,
$$P^{-1}=\\frac{1}{3}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}.$$
Check: $PD = \\begin{bmatrix}2\\cdot 5&-1\\cdot 2\\\\1\\cdot 5&1\\cdot 2\\end{bmatrix}=\\begin{bmatrix}10&-2\\\\5&2\\end{bmatrix}$, and $PDP^{-1}=\\frac{1}{3}\\begin{bmatrix}10&-2\\\\5&2\\end{bmatrix}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}=A$.</div></div>

<div class="l-warn"><strong>When diagonalization fails.</strong> If some eigenvalue has $m_g<m_a$, the columns of $P$ cannot be made linearly independent and $A$ is not diagonalizable over $\\mathbb{R}$ or $\\mathbb{C}$. The defective matrix $\\begin{bmatrix}3&1\\\\0&3\\end{bmatrix}$ is the smallest example. Such matrices admit a weaker <em>Jordan normal form</em> $A=PJP^{-1}$ where $J$ has $1$s above the diagonal in blocks corresponding to defective eigenvalues — a topic for a more advanced course.</div>

<h2 class="l-title">7. Powers of a Matrix via Diagonalization</h2>

<div class="calc-highlight"><strong>Why diagonalization is useful.</strong> Multiplying a general matrix by itself $k$ times costs $\\Theta(n^3 k)$ work, and the entries explode in magnitude long before $k=100$. Diagonalization turns this into one diagonal exponentiation: $A^k = PD^kP^{-1}$, where $D^k=\\operatorname{diag}(\\lambda_1^k,\\ldots,\\lambda_n^k)$ takes a single line.</div>

<div class="calc-formula"><div class="formula-label">POWER FORMULA</div><div class="formula-main">$$A^k \\;=\\; P\\,D^k\\,P^{-1} \\;=\\; P\\begin{bmatrix}\\lambda_1^k&&\\\\&\\ddots&\\\\&&\\lambda_n^k\\end{bmatrix}P^{-1}$$</div></div>

<div class="calc-example"><div class="example-label">COMPUTE $A^{10}$ FOR $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$</div><div class="example-body">With $P=\\begin{bmatrix}2&-1\\\\1&1\\end{bmatrix}$, $D=\\operatorname{diag}(5,2)$, $P^{-1}=\\tfrac{1}{3}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}$:
$$A^{10}=P\\begin{bmatrix}5^{10}&0\\\\0&2^{10}\\end{bmatrix}P^{-1}=\\frac{1}{3}\\begin{bmatrix}2&-1\\\\1&1\\end{bmatrix}\\begin{bmatrix}9765625&0\\\\0&1024\\end{bmatrix}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}.$$
Multiplying out yields an integer matrix; the dominant entry grows like $5^{10}\\approx 9.77\\cdot 10^6$, which would have been completely impractical to read off by repeated multiplication.</div></div>

<div class="calc-example"><div class="example-label">FIBONACCI VIA EIGENVALUES</div><div class="example-body">The Fibonacci recurrence $F_{n+1}=F_n+F_{n-1}$ can be written
$$\\begin{bmatrix}F_{n+1}\\\\F_n\\end{bmatrix}=\\underbrace{\\begin{bmatrix}1&1\\\\1&0\\end{bmatrix}}_{A}\\begin{bmatrix}F_n\\\\F_{n-1}\\end{bmatrix}, \\qquad \\begin{bmatrix}F_n\\\\F_{n-1}\\end{bmatrix}=A^{n-1}\\begin{bmatrix}1\\\\0\\end{bmatrix}.$$
The eigenvalues of $A$ are $\\varphi=\\tfrac{1+\\sqrt{5}}{2}$ and $\\psi=\\tfrac{1-\\sqrt{5}}{2}$. Diagonalizing and reading off the top entry gives Binet's formula:
$$F_n = \\frac{\\varphi^n-\\psi^n}{\\sqrt{5}}.$$
A closed form for an infinite recurrence — entirely from a $2\\times 2$ eigenvalue computation.</div></div>

<h2 class="l-title">8. The Spectral Theorem for Symmetric Matrices</h2>

<div class="calc-highlight"><strong>Symmetric matrices are the friendliest case.</strong> When $A=A^T$, every eigenvalue is real, eigenvectors for different eigenvalues are automatically orthogonal, and $A$ can be diagonalized by an orthogonal matrix. This is the cleanest spectral decomposition that linear algebra has to offer.</div>

<div class="calc-formula"><div class="formula-label">SPECTRAL THEOREM</div><div class="formula-main">$$A = A^T \\quad\\Longrightarrow\\quad A = Q\\,\\Lambda\\,Q^T$$</div><div class="formula-sub">$Q$ is orthogonal ($Q^TQ=I$, so $Q^{-1}=Q^T$), its columns are an orthonormal basis of eigenvectors, and $\\Lambda=\\operatorname{diag}(\\lambda_1,\\ldots,\\lambda_n)$ holds the (real) eigenvalues.</div></div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Real eigenvalues</div><div class="card-body">If $A=A^T\\in\\mathbb{R}^{n\\times n}$, all roots of $p_A$ are real. Proof: for a complex eigenpair $(A\\mathbf{v}=\\lambda\\mathbf{v}, \\mathbf{v}\\neq 0)$ one computes $\\overline{\\mathbf{v}}^T A\\mathbf{v}$ two ways and concludes $\\lambda=\\overline\\lambda$.</div></div><div class="calc-card"><div class="card-title">Orthogonal eigenvectors</div><div class="card-body">If $A\\mathbf{v}_1=\\lambda_1\\mathbf{v}_1$ and $A\\mathbf{v}_2=\\lambda_2\\mathbf{v}_2$ with $\\lambda_1\\neq\\lambda_2$, then $\\mathbf{v}_1^T\\mathbf{v}_2=0$. The eigenspaces are mutually perpendicular.</div></div><div class="calc-card"><div class="card-title">$Q^{-1}=Q^T$</div><div class="card-body">Inverting $Q$ is free — just transpose. So $A\\mathbf{x}=Q\\Lambda Q^T\\mathbf{x}$ reduces $A$-action to (rotate by $Q^T$, scale by $\\Lambda$, rotate back by $Q$).</div></div></div>

<div class="calc-example"><div class="example-label">SPECTRAL DECOMPOSITION OF $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$</div><div class="example-body">$A=A^T$, so the spectral theorem applies. From Section 1: $\\lambda_1=3$ with $\\mathbf{v}_1=(1,1)^T$, $\\lambda_2=1$ with $\\mathbf{v}_2=(1,-1)^T$. The two eigenvectors are orthogonal: $\\mathbf{v}_1^T\\mathbf{v}_2 = 1-1 = 0$. Normalize:
$$\\hat{\\mathbf{v}}_1=\\tfrac{1}{\\sqrt{2}}\\binom{1}{1}, \\quad \\hat{\\mathbf{v}}_2=\\tfrac{1}{\\sqrt{2}}\\binom{1}{-1}, \\quad Q=\\tfrac{1}{\\sqrt{2}}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}, \\quad \\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}.$$
Verify $Q^TQ=I$ and $Q\\Lambda Q^T=A$ by direct multiplication.</div></div>

<div class="l-note"><strong>Application from the geometry of data.</strong> The sample covariance of a real dataset is a symmetric matrix. The spectral theorem says it has an orthonormal eigenbasis — these are the directions of maximum variance ("principal components"), pairwise perpendicular by construction. This is one geometric application of the theorem; the algebra here is the same, and we will not pursue the data-analysis side further in this lesson.</div>

<h2 class="l-title">9. Positive Definite Matrices</h2>

<div class="calc-highlight"><strong>Definition.</strong> A symmetric matrix $A\\in\\mathbb{R}^{n\\times n}$ is <em>positive definite</em> (write $A\\succ 0$) when $\\mathbf{x}^T A\\mathbf{x}>0$ for every non-zero $\\mathbf{x}\\in\\mathbb{R}^n$. It is <em>positive semidefinite</em> ($A\\succeq 0$) when the inequality is $\\ge 0$.</div>

<div class="calc-formula"><div class="formula-label">EIGENVALUE CHARACTERIZATION</div><div class="formula-main">$$A=A^T \\text{ is positive definite} \\;\\iff\\; \\lambda_i>0 \\text{ for every eigenvalue}$$</div><div class="formula-sub">Use the spectral decomposition $A=Q\\Lambda Q^T$. Writing $\\mathbf{y}=Q^T\\mathbf{x}$, $\\mathbf{x}^TA\\mathbf{x}=\\mathbf{y}^T\\Lambda\\mathbf{y}=\\sum_i \\lambda_i y_i^2$. This is positive for all non-zero $\\mathbf{x}$ iff every $\\lambda_i>0$.</div></div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Eigenvalue test</div><div class="card-body">Compute the spectrum: if every eigenvalue is positive, $A\\succ 0$. If some are zero (but none negative), $A\\succeq 0$.</div></div><div class="calc-card"><div class="card-title">Leading minors</div><div class="card-body">Sylvester's criterion: $A\\succ 0$ iff every leading principal minor $\\det(A_k)>0$ for $k=1,\\ldots,n$. Often quicker by hand.</div></div><div class="calc-card"><div class="card-title">Cholesky test</div><div class="card-body">$A\\succ 0$ iff $A=LL^T$ for a lower-triangular $L$ with positive diagonal. Constructive, useful computationally.</div></div></div>

<div class="calc-example"><div class="example-label">IS $A=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$ POSITIVE DEFINITE?</div><div class="example-body"><strong>Eigenvalue route.</strong> $\\operatorname{tr}(A)=7$, $\\det(A)=11$, so $p_A(\\lambda)=\\lambda^2-7\\lambda+11$. Discriminant $49-44=5$, eigenvalues $\\lambda=\\tfrac{7\\pm\\sqrt{5}}{2}\\approx 4.618,\\,2.382$. Both positive, so $A\\succ 0$.
<br><br><strong>Sylvester route.</strong> Leading minors: $\\det(A_1)=4>0$, $\\det(A_2)=11>0$. Conclusion: $A\\succ 0$. Faster than computing eigenvalues by hand.</div></div>

<div class="calc-example"><div class="example-label">NOT POSITIVE DEFINITE</div><div class="example-body">$B=\\begin{bmatrix}1&3\\\\3&1\\end{bmatrix}$ has $\\det(B)=1-9=-8<0$. Since the product of eigenvalues equals the determinant, at least one eigenvalue is negative — indeed $\\lambda=4,\\,-2$. So $B$ is symmetric but indefinite, not positive definite.</div></div>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Solve each problem by hand. Every computation reduces to a polynomial root-finding step and a homogeneous linear system. Worked solutions follow.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — EIGENVALUES OF A $2\\times 2$</div><div class="example-body"><strong>Problem.</strong> Find the eigenvalues of $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}$.
<br><br><strong>Solution.</strong> $\\operatorname{tr}(A)=13$, $\\det(A)=40-4=36$. Characteristic polynomial $\\lambda^2-13\\lambda+36=(\\lambda-4)(\\lambda-9)$. Eigenvalues $\\lambda_1=4$, $\\lambda_2=9$. Sanity: $4+9=13$, $4\\cdot 9=36$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — EIGENVECTORS</div><div class="example-body"><strong>Problem.</strong> Find a basis of each eigenspace of $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}$.
<br><br><strong>Solution.</strong> <em>For $\\lambda=4$:</em> $A-4I=\\begin{bmatrix}1&-2\\\\-2&4\\end{bmatrix}$. The equation $v_1-2v_2=0$ gives $v_1=2v_2$, so $\\mathbf{v}_1=(2,1)^T$ spans $E_4$.
<br><em>For $\\lambda=9$:</em> $A-9I=\\begin{bmatrix}-4&-2\\\\-2&-1\\end{bmatrix}$. The equation $-4v_1-2v_2=0$ gives $v_2=-2v_1$, so $\\mathbf{v}_2=(1,-2)^T$ spans $E_9$. Note $\\mathbf{v}_1^T\\mathbf{v}_2=2-2=0$ — orthogonal, as expected for a symmetric matrix.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — DIAGONALIZE</div><div class="example-body"><strong>Problem.</strong> Write $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}=PDP^{-1}$.
<br><br><strong>Solution.</strong> With the eigenpairs from Exercise 2:
$$P=\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}, \\quad D=\\begin{bmatrix}4&0\\\\0&9\\end{bmatrix}, \\quad \\det(P)=-5, \\quad P^{-1}=-\\tfrac{1}{5}\\begin{bmatrix}-2&-1\\\\-1&2\\end{bmatrix}=\\tfrac{1}{5}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}.$$
Verify $PDP^{-1}=A$ by multiplying out. Because $A=A^T$ and the eigenvalues are distinct, the orthogonalized version is $A=Q\\Lambda Q^T$ with $Q=\\tfrac{1}{\\sqrt{5}}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}$ (note $Q^TQ=I$).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — COMPUTE $A^{10}$</div><div class="example-body"><strong>Problem.</strong> Express $A^{10}$ for $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}$ as $PD^{10}P^{-1}$.
<br><br><strong>Solution.</strong> Using $P,D,P^{-1}$ from Exercise 3,
$$A^{10}=P\\begin{bmatrix}4^{10}&0\\\\0&9^{10}\\end{bmatrix}P^{-1}=\\tfrac{1}{5}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}\\begin{bmatrix}1048576&0\\\\0&3486784401\\end{bmatrix}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}.$$
Carrying out the multiplication entry by entry gives an explicit integer matrix dominated by the $9^{10}$ term — the largest eigenvalue controls the asymptotics of $A^k$ as $k\\to\\infty$, a fact that recurs throughout analysis.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — POSITIVE DEFINITENESS</div><div class="example-body"><strong>Problem.</strong> For which real $a$ is $M=\\begin{bmatrix}2&a\\\\a&2\\end{bmatrix}$ positive definite?
<br><br><strong>Solution.</strong> $M$ is symmetric. Sylvester's criterion: $\\det(M_1)=2>0$ automatically, and $\\det(M_2)=4-a^2>0$ iff $|a|<2$. Eigenvalue check: $\\lambda^2-4\\lambda+(4-a^2)=0$ has roots $2\\pm|a|$, both positive iff $|a|<2$. Conclusion: $M\\succ 0\\iff -2<a<2$. At $|a|=2$ one eigenvalue is zero ($M\\succeq 0$ but not strictly definite); for $|a|>2$ one eigenvalue is negative.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — TRIANGULAR EIGENVALUES</div><div class="example-body"><strong>Problem.</strong> List the eigenvalues of $T=\\begin{bmatrix}3&7&-2\\\\0&-1&4\\\\0&0&5\\end{bmatrix}$ and find a single eigenvector for each.
<br><br><strong>Solution.</strong> Triangular, so eigenvalues are the diagonal entries: $3,-1,5$. For $\\lambda=3$: $T-3I=\\begin{bmatrix}0&7&-2\\\\0&-4&4\\\\0&0&2\\end{bmatrix}$ has $(1,0,0)^T$ in its kernel. For $\\lambda=-1$: back-substitution in $T+I$ yields $\\mathbf{v}=(7,4,0)^T$ (up to scale). For $\\lambda=5$: back-substitution in $T-5I$ yields $\\mathbf{v}=(15,8,4)^T$ (one valid representative; any non-zero scalar multiple is also correct).</div></div>

<h2 class="l-title">Summary</h2>

<p class="l-text">The eigenvalue problem $A\\mathbf{v}=\\lambda\\mathbf{v}$ asks for directions left invariant by a square matrix. The characteristic polynomial $\\det(A-\\lambda I)$ is a degree-$n$ polynomial in $\\lambda$ whose roots are the eigenvalues; for distinct eigenvalues, eigenvectors are linearly independent and the matrix is diagonalizable as $A=PDP^{-1}$. When an eigenvalue is repeated, geometric multiplicity may be smaller than algebraic multiplicity — the matrix is then defective and admits only a Jordan form, not a diagonal one. Diagonalization makes powers cheap ($A^k=PD^kP^{-1}$) and closes recurrences such as Fibonacci in one shot. Symmetric matrices enjoy the spectral theorem: real eigenvalues, an orthonormal eigenbasis, and the clean factorization $A=Q\\Lambda Q^T$. Adding the sign condition $\\lambda_i>0$ characterizes positive-definite matrices, whose quadratic forms $\\mathbf{x}^TA\\mathbf{x}$ are strictly positive on the punctured space. From two-by-two calculations to triangular spectra, the same recipe applies — factor the polynomial, solve the kernel, read off the geometry.</p>`,

tr: `<p class="l-text"><strong>Özdeğerler ve özvektörler, bir doğrusal dönüşümün gizli eksenlerini açığa çıkarır.</strong> Kare matris $A$ ile çarpıldığında hemen her vektör hem döner hem ölçeklenir. Ancak bazı özel yönler değişmeden kalır — dönüşüm onları yalnızca bir skalerle gerer. Bu yönler özvektörlerdir; skalerler de özdeğerlerdir. Onları bildiğinizde matrisin tüm yapısı görünür hale gelir.</p>

<p class="l-text">Bu ders saf matematiktir. Özdeğer problemini tanımlar, karakteristik polinomu kurar, özvektörleri elle hesaplar, cebirsel ile geometrik çokluğu ayırt eder, matrisi köşegenleştirir, kuvvetini alır ve simetrik matrisler için spektral teoremi ifade ederiz. Her örnek $2\\times 2$ veya $3\\times 3$ bir matristir; kalemle doğrulayabilirsiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Özdeğer denklemi $A\\mathbf{v}=\\lambda\\mathbf{v}$'yi ifade etmek ve geometrik anlamını okumak</li>
<li>$\\det(A-\\lambda I)$ karakteristik polinomunu kurup özdeğerleri çarpanlarına ayırmak</li>
<li>$(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$'ı çözerek özvektörleri elde etmek</li>
<li>Cebirsel ile geometrik çokluğu ayırt etmek; defektif matrisleri tanımak</li>
<li>$A=PDP^{-1}$ olarak köşegenleştirip $A^k$'yı tam olarak hesaplamak</li>
<li>Spektral teoremi simetrik matrislere uygulamak</li>
<li>Bir simetrik matrisin pozitif tanımlı olup olmadığına karar vermek</li>
</ul>
</div>

<h2 class="l-title">1. Özdeğer Problemi $A\\mathbf{v} = \\lambda \\mathbf{v}$</h2>

<div class="calc-highlight"><strong>Geometrik fikir.</strong> Kare matris $A$, her vektör için $\\mathbf{x}\\mapsto A\\mathbf{x}$ kuralıyla davranır. Başlangıç vektörlerinin çoğu için çıktı tamamen yeni bir yöne döner. <em>Özvektör</em>, dönüşümden sonra da yönü korunan sıfırdan farklı bir vektördür — $A\\mathbf{v}$, $\\mathbf{v}$'nin geçtiği orijinli doğru üzerinde kalır. <em>Özdeğer</em> $\\lambda$, bu doğrunun ne kadar gerildiğini (ya da $\\lambda<0$ ise döndürüldüğünü) söyler.</div>

<div class="calc-formula"><div class="formula-label">TANIM</div><div class="formula-main">$$A\\mathbf{v} = \\lambda \\mathbf{v}, \\qquad \\mathbf{v} \\neq \\mathbf{0}$$</div><div class="formula-sub">$A$ bir $n\\times n$ matristir, $\\lambda\\in\\mathbb{R}$ (veya $\\mathbb{C}$) özdeğerdir, $\\mathbf{v}\\in\\mathbb{R}^n$ özvektördür. Sıfır vektör dışlanır — aksi takdirde her skaler önemsizce özdeğer olurdu.</div></div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Matris $A$</div><div class="card-body">Kare, $n\\times n$. Değişmez yönlerini aradığımız doğrusal dönüşüm.</div></div><div class="calc-card"><div class="card-title">Özvektör $\\mathbf{v}$</div><div class="card-body">Sıfırdan farklı, $A\\mathbf{v}$ ile paralel. $\\operatorname{span}\\{\\mathbf{v}\\}$ doğrusu $A$ altında değişmezdir.</div></div><div class="calc-card"><div class="card-title">Özdeğer $\\lambda$</div><div class="card-body">Ölçeklendirme katsayısı. $\\lambda>1$ uzatır, $0<\\lambda<1$ kısaltır, $\\lambda<0$ yönü çevirir, $\\lambda=0$ ezilir.</div></div></div>

<p class="l-text"><strong>Skaler katlar da özvektördür.</strong> $A\\mathbf{v}=\\lambda\\mathbf{v}$ ve $c\\neq 0$ ise $A(c\\mathbf{v}) = c\\,A\\mathbf{v} = c\\lambda\\mathbf{v} = \\lambda(c\\mathbf{v})$. Yani özvektörler sıfırdan farklı bir skalere göre tanımlanır — orijinden geçen tüm doğru değişmez bir altuzaydır. Genellikle bir temsilci seçeriz (sıklıkla birim uzunluğa normalize ederiz).</p>

<div class="calc-example"><div class="example-label">ELLE HIZLI KONTROL</div><div class="example-body">$A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ olsun.
<br><br>$\\mathbf{v}=(1,1)^{T}$ denersek: $A\\mathbf{v} = (3,3)^{T} = 3\\mathbf{v}$. Özdeğer $\\lambda=3$.
<br>$\\mathbf{w}=(1,-1)^{T}$ denersek: $A\\mathbf{w} = (1,-1)^{T} = 1\\cdot\\mathbf{w}$. Özdeğer $\\lambda=1$.
<br>$\\mathbf{u}=(1,0)^{T}$ denersek: $A\\mathbf{u} = (2,1)^{T}$, $\\mathbf{u}$ ile paralel değil. Özvektör değildir.</div></div>

<div id="plot-eigen-transform-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var t1={x:[0,1],y:[0,1],mode:"lines+markers",name:"v = (1,1)",line:{color:"#c8a96e",width:3},marker:{size:[6,10]}};
var t2={x:[0,3],y:[0,3],mode:"lines+markers",name:"Av = 3v",line:{color:"#c8a96e",width:3,dash:"dash"},marker:{size:[6,10]}};
var t3={x:[0,1],y:[0,-1],mode:"lines+markers",name:"w = (1,-1)",line:{color:"#4ecdc4",width:3},marker:{size:[6,10]}};
var t4={x:[0,1],y:[0,-1],mode:"lines+markers",name:"Aw = 1·w",line:{color:"#4ecdc4",width:3,dash:"dash"},marker:{size:[6,10]}};
var t5={x:[0,1],y:[0,0],mode:"lines+markers",name:"u = (1,0)",line:{color:"#f87171",width:3},marker:{size:[6,10]}};
var t6={x:[0,2],y:[0,1],mode:"lines+markers",name:"Au (özvektör değil)",line:{color:"#f87171",width:3,dash:"dash"},marker:{size:[6,10]}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,4],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,4],scaleanchor:"x",title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc",size:10},orientation:"h",y:-0.18}};
Plotly.newPlot("plot-eigen-transform-tr",[t1,t2,t3,t4,t5,t6],layout,{responsive:true,displayModeBar:false});
},150)</script>

<div class="calc-graph"><div class="graph-caption">Altın ve turkuaz vektörler $A$ uygulandıktan sonra kendi doğrularında kalır — bunlar özvektörlerdir. Altın yön $\\lambda=3$ ile uzar; turkuaz yön sabit kalır ($\\lambda=1$). Kırmızı vektör $(1,0)^T$ kendi doğrusundan döner ve dolayısıyla özvektör değildir.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">$\\mathbf{v}$, $A$'nın $\\lambda$ özdeğerli özvektörüyse, $A^2$ için de özvektör müdür? Özdeğeri nedir? <em>İki kez uygula: $A^2\\mathbf{v}=A(A\\mathbf{v})=A(\\lambda\\mathbf{v})=\\lambda A\\mathbf{v}=\\lambda^2\\mathbf{v}$. Evet, özdeğeri $\\lambda^2$ olur.</em></div></div>

<h2 class="l-title">2. Özdeğerleri Bulmak: Karakteristik Polinom</h2>

<div class="calc-highlight"><strong>Strateji.</strong> $A\\mathbf{v}=\\lambda\\mathbf{v}$'yi $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$ olarak yeniden yazın. Bu homojen sistemin sıfırdan farklı $\\mathbf{v}$ çözümüne sahip olması için $A-\\lambda I$ matrisi tekil olmalıdır — eşdeğer olarak $\\det(A-\\lambda I)=0$. Bu, $\\lambda$ cinsinden tek bir polinom denklemidir ve kökleri tam olarak $A$'nın özdeğerleridir.</div>

<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A\\mathbf{v}=\\lambda\\mathbf{v}$'den başla</div><div class="step-detail">$\\lambda\\mathbf{v}=\\lambda I\\mathbf{v}$ yazarak iki tarafa da $\\mathbf{v}$ üzerinde matris elde et.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Her şeyi tek tarafa topla</div><div class="step-detail">$(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$. $A-\\lambda I$'nin çekirdeğinde sıfırdan farklı bir $\\mathbf{v}$ aranıyor.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$A-\\lambda I$ tekil olsun</div><div class="step-detail">Homojen sistemin sıfırdan farklı çözümü olması, katsayı matrisinin determinantının sıfır olmasına denktir. Yani $\\det(A-\\lambda I)=0$.</div></div></div></div>

<div class="calc-formula"><div class="formula-label">KARAKTERİSTİK DENKLEM</div><div class="formula-main">$$p_A(\\lambda) \\;=\\; \\det(A - \\lambda I) \\;=\\; 0$$</div><div class="formula-sub">$p_A(\\lambda)$ matrisin <em>karakteristik polinomudur</em>. $n\\times n$ matris için derecesi $n$ olur; cebirin temel teoremine göre $\\mathbb{C}$'de (çokluklarıyla birlikte) $n$ kökü vardır.</div></div>

<div class="calc-formula"><div class="formula-label">$2\\times 2$ KISAYOLU</div><div class="formula-main">$$p_A(\\lambda) = \\lambda^2 - \\operatorname{iz}(A)\\,\\lambda + \\det(A)$$</div><div class="formula-sub">$A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$ için: $\\operatorname{iz}(A)=a+d$, $\\det(A)=ad-bc$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $2\\times 2$</div><div class="example-body">$A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$ matrisinin özdeğerlerini bulun.
<br><br>$\\operatorname{iz}(A)=7$, $\\det(A)=4\\cdot 3-2\\cdot 1=10$. Karakteristik polinom:
$$p_A(\\lambda)=\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2).$$
Özdeğerler: $\\lambda_1=5$, $\\lambda_2=2$.
<br><br><strong>Sağlama.</strong> Özdeğerlerin toplamı $=5+2=7=\\operatorname{iz}(A)$. Çarpımı $=5\\cdot 2=10=\\det(A)$. Bu iki özdeşlik her matriste tutar ve elle en kolay kontroldür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $3\\times 3$ ÜÇGEN</div><div class="example-body">$A=\\begin{bmatrix}2&5&0\\\\0&-1&3\\\\0&0&4\\end{bmatrix}$. $A$ üst üçgen olduğundan
$$\\det(A-\\lambda I)=(2-\\lambda)(-1-\\lambda)(4-\\lambda),$$
ve özdeğerler tam olarak köşegen girişleridir: $\\lambda_1=2$, $\\lambda_2=-1$, $\\lambda_3=4$. Aynı gerçek her üçgen matriste geçerlidir — spektrum köşegende yaşar.</div></div>

<div class="l-note"><strong>Aklınızda tutmanız gereken özdeşlikler.</strong> Cebirsel çokluklarıyla sayıldığında $\\lambda_1,\\ldots,\\lambda_n$ özdeğerlerine sahip her $n\\times n$ $A$ matrisi için: $\\sum_i \\lambda_i=\\operatorname{iz}(A)$ ve $\\prod_i \\lambda_i=\\det(A)$. Bunlar $\\det(A-\\lambda I)$'nın açılımındaki $\\lambda^{n-1}$ ve $\\lambda^0$ katsayılarının karşılaştırılmasından gelir.</div>

<h2 class="l-title">3. Özvektörleri Bulmak</h2>

<div class="calc-highlight"><strong>Strateji.</strong> Bir $\\lambda$ özdeğeri bilindiğinde, onu $(A-\\lambda I)\\mathbf{v}=\\mathbf{0}$'a yerleştirin ve homojen sistemi çözün. Çözüm kümesi bir altuzaydır — <em>özuzay</em> $E_\\lambda=\\ker(A-\\lambda I)$. $E_\\lambda$ içindeki her sıfırdan farklı vektör $\\lambda$ için bir özvektördür.</div>

<div class="calc-example"><div class="example-label">$A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$ İÇİN ÖZVEKTÖRLER</div><div class="example-body"><strong>$\\lambda_1=5$ için:</strong>
$$A-5I=\\begin{bmatrix}-1&2\\\\1&-2\\end{bmatrix}.$$
İki satır lineer bağımlıdır (biri diğerinin $-1$ katıdır); $\\det(A-\\lambda I)=0$ olduğunda bu kaçınılmazdır. $-v_1+2v_2=0$ denkleminden $v_1=2v_2$. $v_2=1$ seçince
$$\\mathbf{v}_1=\\begin{bmatrix}2\\\\1\\end{bmatrix}.$$
Doğrulama: $A\\mathbf{v}_1=\\begin{bmatrix}4\\cdot 2+2\\cdot 1\\\\1\\cdot 2+3\\cdot 1\\end{bmatrix}=\\begin{bmatrix}10\\\\5\\end{bmatrix}=5\\mathbf{v}_1$.
<br><br><strong>$\\lambda_2=2$ için:</strong>
$$A-2I=\\begin{bmatrix}2&2\\\\1&1\\end{bmatrix}, \\qquad 2v_1+2v_2=0 \\Rightarrow v_1=-v_2.$$
$v_2=1$ seçince: $\\mathbf{v}_2=\\begin{bmatrix}-1\\\\1\\end{bmatrix}$. Sağlama: $A\\mathbf{v}_2=(-2,2)^T=2\\mathbf{v}_2$.</div></div>

<div class="calc-example"><div class="example-label">TEKRARLAYAN ÖZDEĞER İÇİN ÖZUZAY</div><div class="example-body">$A=\\begin{bmatrix}3&0\\\\0&3\\end{bmatrix}=3I$ olsun. Karakteristik polinom $(3-\\lambda)^2$, yani $\\lambda=3$ iki katlı köktür. Her $\\mathbf{v}\\in\\mathbb{R}^2$ vektörü $A\\mathbf{v}=3\\mathbf{v}$ sağlar, dolayısıyla $E_3=\\mathbb{R}^2$ — iki boyutlu özuzay.
<br><br>Karşıt olarak $B=\\begin{bmatrix}3&1\\\\0&3\\end{bmatrix}$. Aynı karakteristik polinom $(3-\\lambda)^2$, ama $B-3I=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$'in rangı $1$ olduğundan özuzay tek boyutludur: $(1,0)^T$ tarafından gerilir. İkinci bir lineer bağımsız özvektör yoktur — $B$ <em>defektiftir</em>.</div></div>

<h2 class="l-title">4. Geometrik Anlam — Dönmeler, Yansımalar, Gerilmeler</h2>

<div class="calc-highlight"><strong>Bir matrisi özdeğerleriyle okumak.</strong> Özdeğerlerin örüntüsü (reel vs karmaşık, pozitif vs negatif, $(-1,1)$ içinde vs dışında) önünüzdeki doğrusal dönüşümün türünü söyler.</div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Saf gerilme</div><div class="card-body">$\\operatorname{diag}(\\lambda_1,\\lambda_2)$, $x$-eksenini $\\lambda_1$ ile, $y$-eksenini $\\lambda_2$ ile uzatır. İki eksen de özvektördür.</div></div><div class="calc-card"><div class="card-title">$\\theta$ kadar dönme</div><div class="card-body">$R_\\theta=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$'nın özdeğerleri $e^{\\pm i\\theta}$. $\\theta\\in\\{0,\\pi\\}$ değilse hiçbir reel özvektör yoktur — dönmeler hiçbir reel doğruyu korumaz.</div></div><div class="calc-card"><div class="card-title">Yansıma</div><div class="card-body">Orijinden geçen bir doğru etrafında yansımanın özdeğerleri $+1$ (ayna doğrusu) ve $-1$ (dik doğru).</div></div><div class="calc-card"><div class="card-title">İzdüşüm</div><div class="card-body">$W$ altuzayına ortogonal izdüşümün $W$ üzerinde özdeğeri $1$, $W^\\perp$ üzerinde özdeğeri $0$'dır.</div></div></div>

<div class="calc-example"><div class="example-label">DÖNME — KARMAŞIK ÖZDEĞERLER</div><div class="example-body">$R_{\\pi/2}=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ olsun ($90^\\circ$ dönme). O zaman
$$p_R(\\lambda)=\\lambda^2+1=0 \\Rightarrow \\lambda=\\pm i.$$
Özdeğerler tam sanaldır. Geometrik olarak: $90^\\circ$ dönme hiçbir reel yönü sabit bırakmaz, bu yüzden reel $\\lambda$ yoktur. $\\mathbb{C}^2$'de özvektörler $(1,\\mp i)^T$'dir.</div></div>

<div class="calc-example"><div class="example-label">YANSIMA</div><div class="example-body">$x$-ekseni etrafında yansıma: $S=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Özdeğerler $1$ ve $-1$. $1$ için özvektör $(1,0)^T$ (ayna doğrusu). $-1$ için özvektör $(0,1)^T$ (çevrilen yön). Determinant $=-1$ — yansımaların determinantı her zaman $-1$'dir.</div></div>

<h2 class="l-title">5. Cebirsel ve Geometrik Çokluk</h2>

<div class="calc-highlight"><strong>Bir özdeğeri saymanın iki yolu.</strong> Aynı $\\lambda$'nın karakteristik polinomdaki "ağırlığı" ile özuzaydaki "ağırlığı" farklı olabilir. Bu iki sayım arasındaki ilişki, $A$'nın köşegenleştirilebilir olup olmadığını belirler.</div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Cebirsel çokluk $m_a(\\lambda)$</div><div class="card-body">$\\lambda$'nın $p_A$'nin kökü olarak çokluğu. $p_A(\\lambda)=(\\lambda-3)^2(\\lambda+1)$ ise $m_a(3)=2$ ve $m_a(-1)=1$.</div></div><div class="calc-card"><div class="card-title">Geometrik çokluk $m_g(\\lambda)$</div><div class="card-body">Özuzayın boyutu: $m_g(\\lambda)=\\dim\\ker(A-\\lambda I)$. $\\lambda$ için lineer bağımsız özvektörlerin sayısı.</div></div></div>

<div class="calc-formula"><div class="formula-label">TEMEL EŞİTSİZLİK</div><div class="formula-main">$$1 \\;\\le\\; m_g(\\lambda) \\;\\le\\; m_a(\\lambda)$$</div><div class="formula-sub">Geometrik çokluk en az $1$'dir (aksi takdirde $\\lambda$ özdeğer olmazdı) ve hiçbir zaman cebirsel çokluğu aşmaz. Her özdeğer için $m_g=m_a$ olduğunda $A$ köşegenleştirilebilirdir.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$A=\\begin{bmatrix}3&0\\\\0&3\\end{bmatrix}$ — DEFEKTİF DEĞİL</div><div class="compare-item">$p_A=(\\lambda-3)^2$, yani $m_a(3)=2$</div><div class="compare-item">$A-3I=0$, çekirdek tüm $\\mathbb{R}^2$, $m_g(3)=2$</div><div class="compare-item">$m_a=m_g$ — köşegenleştirilebilir (zaten köşegen)</div></div><div class="compare-col"><div class="compare-title">$B=\\begin{bmatrix}3&1\\\\0&3\\end{bmatrix}$ — DEFEKTİF</div><div class="compare-item">$p_B=(\\lambda-3)^2$, yani $m_a(3)=2$</div><div class="compare-item">$B-3I$'nin rangı $1$, çekirdek $1$-boyutlu, $m_g(3)=1$</div><div class="compare-item">$m_a>m_g$ — köşegenleştirilemez</div></div></div>

<div class="l-note"><strong>Farklı özdeğerlerin özvektörleri lineer bağımsızdır.</strong> $A\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i$ ve $\\lambda_i$'ler ikişerli farklıysa $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$ lineer bağımsızdır. Bu nedenle $n$ farklı özdeğere sahip bir matrisin otomatik olarak $n$ bağımsız özvektörü vardır ve köşegenleştirilebilirdir.</div>

<h2 class="l-title">6. Köşegenleştirme $A = PDP^{-1}$</h2>

<div class="calc-highlight"><strong>Baz değiştirme.</strong> $A$'nın $n$ tane lineer bağımsız özvektörü varsa, bunları $P=[\\,\\mathbf{v}_1\\;\\mathbf{v}_2\\;\\cdots\\;\\mathbf{v}_n\\,]$ matrisinde toplayıp $A=PDP^{-1}$ yazabiliriz; $D$ köşegendir. Özvektör bazında $A$'nın etkisi koordinat-koordinat ölçeklendirmeye dönüşür.</div>

<div class="calc-formula"><div class="formula-label">KÖŞEGENLEŞTİRME</div><div class="formula-main">$$A = P\\,D\\,P^{-1}, \\qquad D = \\operatorname{diag}(\\lambda_1,\\lambda_2,\\ldots,\\lambda_n)$$</div><div class="formula-sub">$P$'nin $i$. sütunu özvektör $\\mathbf{v}_i$'dir; $D_{ii}$ girişi eşleşen $\\lambda_i$ özdeğeridir. $A$'nın $n$ tane lineer bağımsız özvektörü varsa bu ayrışım vardır.</div></div>

<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$i=1,\\ldots,n$ için $A\\mathbf{v}_i=\\lambda_i\\mathbf{v}_i$</div><div class="step-detail">$n$ denklemi yan yana yığ: $A[\\mathbf{v}_1\\;\\cdots\\;\\mathbf{v}_n] = [\\lambda_1\\mathbf{v}_1\\;\\cdots\\;\\lambda_n\\mathbf{v}_n]$.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sağ tarafın $PD$ olduğunu fark et</div><div class="step-detail">Sağ taraf $P$ ile özdeğerlerin köşegen matrisi $D$'nin çarpımıdır. Yani $AP=PD$.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$P^{-1}$ ile sağdan çarp</div><div class="step-detail">$P$ tersinirse (yani özvektörler bağımsızsa) $A=PDP^{-1}$.</div></div></div></div>

<div class="calc-example"><div class="example-label">$A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$ KÖŞEGENLEŞTİR</div><div class="example-body">Bölüm 2–3'ten: $\\lambda_1=5$ ile $\\mathbf{v}_1=(2,1)^T$ ve $\\lambda_2=2$ ile $\\mathbf{v}_2=(-1,1)^T$. Kur
$$P=\\begin{bmatrix}2&-1\\\\1&1\\end{bmatrix}, \\quad D=\\begin{bmatrix}5&0\\\\0&2\\end{bmatrix}.$$
$\\det(P)=2\\cdot 1-(-1)\\cdot 1=3$ olduğundan,
$$P^{-1}=\\frac{1}{3}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}.$$
Kontrol: $PD = \\begin{bmatrix}10&-2\\\\5&2\\end{bmatrix}$ ve $PDP^{-1}=\\frac{1}{3}\\begin{bmatrix}10&-2\\\\5&2\\end{bmatrix}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}=A$.</div></div>

<div class="l-warn"><strong>Köşegenleştirme ne zaman başarısız olur.</strong> Bir özdeğer için $m_g<m_a$ ise $P$ sütunları lineer bağımsız yapılamaz ve $A$ ne $\\mathbb{R}$ ne de $\\mathbb{C}$ üzerinde köşegenleştirilebilir olur. Defektif $\\begin{bmatrix}3&1\\\\0&3\\end{bmatrix}$ en küçük örnektir. Böyle matrisler daha zayıf bir <em>Jordan normal formu</em> $A=PJP^{-1}$ kabul eder; $J$ defektif özdeğerlere karşılık gelen bloklarda köşegen üstünde $1$'ler içerir — daha ileri bir dersin konusudur.</div>

<h2 class="l-title">7. Köşegenleştirme ile Matris Kuvvetleri</h2>

<div class="calc-highlight"><strong>Köşegenleştirme neden faydalıdır.</strong> Genel bir matrisi kendisiyle $k$ kez çarpmak $\\Theta(n^3 k)$ iş ister ve $k=100$'e ulaşmadan girişler patlar. Köşegenleştirme bunu tek bir köşegen kuvvet alma işlemine indirger: $A^k = PD^kP^{-1}$, ve $D^k=\\operatorname{diag}(\\lambda_1^k,\\ldots,\\lambda_n^k)$ tek satırlık bir hesaptır.</div>

<div class="calc-formula"><div class="formula-label">KUVVET FORMÜLÜ</div><div class="formula-main">$$A^k \\;=\\; P\\,D^k\\,P^{-1} \\;=\\; P\\begin{bmatrix}\\lambda_1^k&&\\\\&\\ddots&\\\\&&\\lambda_n^k\\end{bmatrix}P^{-1}$$</div></div>

<div class="calc-example"><div class="example-label">$A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$ İÇİN $A^{10}$ HESAPLA</div><div class="example-body">$P=\\begin{bmatrix}2&-1\\\\1&1\\end{bmatrix}$, $D=\\operatorname{diag}(5,2)$, $P^{-1}=\\tfrac{1}{3}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}$ ile:
$$A^{10}=P\\begin{bmatrix}5^{10}&0\\\\0&2^{10}\\end{bmatrix}P^{-1}=\\frac{1}{3}\\begin{bmatrix}2&-1\\\\1&1\\end{bmatrix}\\begin{bmatrix}9765625&0\\\\0&1024\\end{bmatrix}\\begin{bmatrix}1&1\\\\-1&2\\end{bmatrix}.$$
Çarpımı satır satır yaparak tam sayı matrisi elde ederiz; baskın giriş $5^{10}\\approx 9{,}77\\cdot 10^6$ mertebesinde büyür ki tekrarlı çarpımla okumak tamamen pratiksizdi.</div></div>

<div class="calc-example"><div class="example-label">FIBONACCI ÖZDEĞERLERLE</div><div class="example-body">$F_{n+1}=F_n+F_{n-1}$ Fibonacci özyinelemesi şöyle yazılabilir:
$$\\begin{bmatrix}F_{n+1}\\\\F_n\\end{bmatrix}=\\underbrace{\\begin{bmatrix}1&1\\\\1&0\\end{bmatrix}}_{A}\\begin{bmatrix}F_n\\\\F_{n-1}\\end{bmatrix}, \\qquad \\begin{bmatrix}F_n\\\\F_{n-1}\\end{bmatrix}=A^{n-1}\\begin{bmatrix}1\\\\0\\end{bmatrix}.$$
$A$'nın özdeğerleri $\\varphi=\\tfrac{1+\\sqrt{5}}{2}$ ve $\\psi=\\tfrac{1-\\sqrt{5}}{2}$'dir. Köşegenleştirip üst girişi okuyunca Binet formülü çıkar:
$$F_n = \\frac{\\varphi^n-\\psi^n}{\\sqrt{5}}.$$
Sonsuz bir özyineleme için kapalı form — tamamen $2\\times 2$ bir özdeğer hesabından.</div></div>

<h2 class="l-title">8. Simetrik Matrisler için Spektral Teorem</h2>

<div class="calc-highlight"><strong>Simetrik matrisler en dost canlısı durumdur.</strong> $A=A^T$ olduğunda her özdeğer reeldir, farklı özdeğerlerin özvektörleri otomatik olarak ortogonaldir ve $A$ bir ortogonal matrisle köşegenleştirilebilir. Bu, lineer cebirin sunduğu en temiz spektral ayrışımdır.</div>

<div class="calc-formula"><div class="formula-label">SPEKTRAL TEOREM</div><div class="formula-main">$$A = A^T \\quad\\Longrightarrow\\quad A = Q\\,\\Lambda\\,Q^T$$</div><div class="formula-sub">$Q$ ortogonaldir ($Q^TQ=I$, yani $Q^{-1}=Q^T$), sütunları özvektörlerden oluşan bir ortonormal bazdır ve $\\Lambda=\\operatorname{diag}(\\lambda_1,\\ldots,\\lambda_n)$ (reel) özdeğerleri taşır.</div></div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Reel özdeğerler</div><div class="card-body">$A=A^T\\in\\mathbb{R}^{n\\times n}$ ise $p_A$'nın tüm kökleri reeldir. Kanıt: karmaşık bir özçift $(A\\mathbf{v}=\\lambda\\mathbf{v}, \\mathbf{v}\\neq 0)$ için $\\overline{\\mathbf{v}}^T A\\mathbf{v}$ iki yoldan hesaplanır ve $\\lambda=\\overline\\lambda$ sonucu çıkar.</div></div><div class="calc-card"><div class="card-title">Ortogonal özvektörler</div><div class="card-body">$A\\mathbf{v}_1=\\lambda_1\\mathbf{v}_1$, $A\\mathbf{v}_2=\\lambda_2\\mathbf{v}_2$ ve $\\lambda_1\\neq\\lambda_2$ ise $\\mathbf{v}_1^T\\mathbf{v}_2=0$. Özuzaylar birbirine diktir.</div></div><div class="calc-card"><div class="card-title">$Q^{-1}=Q^T$</div><div class="card-body">$Q$'yu tersine çevirmek bedavadır — sadece devriği. Yani $A\\mathbf{x}=Q\\Lambda Q^T\\mathbf{x}$ uygulaması ($Q^T$ ile döndür, $\\Lambda$ ile ölçekle, $Q$ ile geri döndür) şeklinde yorumlanır.</div></div></div>

<div class="calc-example"><div class="example-label">$A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ SPEKTRAL AYRIŞIMI</div><div class="example-body">$A=A^T$, dolayısıyla spektral teorem uygulanır. Bölüm 1'den: $\\lambda_1=3$ ile $\\mathbf{v}_1=(1,1)^T$, $\\lambda_2=1$ ile $\\mathbf{v}_2=(1,-1)^T$. İki özvektör ortogonaldir: $\\mathbf{v}_1^T\\mathbf{v}_2 = 1-1 = 0$. Normalleştir:
$$\\hat{\\mathbf{v}}_1=\\tfrac{1}{\\sqrt{2}}\\binom{1}{1}, \\quad \\hat{\\mathbf{v}}_2=\\tfrac{1}{\\sqrt{2}}\\binom{1}{-1}, \\quad Q=\\tfrac{1}{\\sqrt{2}}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}, \\quad \\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}.$$
Doğrudan çarpımla $Q^TQ=I$ ve $Q\\Lambda Q^T=A$ olduğunu doğrulayın.</div></div>

<div class="l-note"><strong>Verinin geometrisinden bir uygulama.</strong> Reel veri kümesinin örnek kovaryansı simetrik bir matristir. Spektral teorem onun bir ortonormal özbazı olduğunu söyler — bunlar maksimum varyans yönleridir ("temel bileşenler") ve yapım gereği ikişerli diktir. Bu, teoremin geometrik bir uygulamasıdır; buradaki cebir aynıdır ve veri analizi tarafını bu derste daha fazla işlemeyeceğiz.</div>

<h2 class="l-title">9. Pozitif Tanımlı Matrisler</h2>

<div class="calc-highlight"><strong>Tanım.</strong> Simetrik $A\\in\\mathbb{R}^{n\\times n}$ matrisi, her sıfırdan farklı $\\mathbf{x}\\in\\mathbb{R}^n$ için $\\mathbf{x}^T A\\mathbf{x}>0$ ise <em>pozitif tanımlıdır</em> ($A\\succ 0$ yazılır). Eşitsizlik $\\ge 0$ ise <em>pozitif yarı-tanımlıdır</em> ($A\\succeq 0$).</div>

<div class="calc-formula"><div class="formula-label">ÖZDEĞER KARAKTERİZASYONU</div><div class="formula-main">$$A=A^T \\text{ pozitif tanımlı} \\;\\iff\\; \\text{her özdeğer için } \\lambda_i>0$$</div><div class="formula-sub">Spektral ayrışımı $A=Q\\Lambda Q^T$ kullan. $\\mathbf{y}=Q^T\\mathbf{x}$ yazarak $\\mathbf{x}^TA\\mathbf{x}=\\mathbf{y}^T\\Lambda\\mathbf{y}=\\sum_i \\lambda_i y_i^2$. Bu ifade tüm sıfırdan farklı $\\mathbf{x}$ için pozitif olur ancak ve ancak her $\\lambda_i>0$ ise.</div></div>

<div class="calc-cards"><div class="calc-card"><div class="card-title">Özdeğer testi</div><div class="card-body">Spektrumu hesapla: her özdeğer pozitif ise $A\\succ 0$. Bazıları sıfırsa (ama negatif yoksa) $A\\succeq 0$.</div></div><div class="calc-card"><div class="card-title">Önde gelen minörler</div><div class="card-body">Sylvester kriteri: $A\\succ 0$ ancak ve ancak her $k=1,\\ldots,n$ için her önde gelen ana minör $\\det(A_k)>0$. Elle çoğunlukla daha hızlıdır.</div></div><div class="calc-card"><div class="card-title">Cholesky testi</div><div class="card-body">$A\\succ 0$ ancak ve ancak alt üçgensel, köşegeni pozitif $L$ için $A=LL^T$. Yapıcı, hesaplamada yararlıdır.</div></div></div>

<div class="calc-example"><div class="example-label">$A=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$ POZİTİF TANIMLI MI?</div><div class="example-body"><strong>Özdeğer yolu.</strong> $\\operatorname{iz}(A)=7$, $\\det(A)=11$, yani $p_A(\\lambda)=\\lambda^2-7\\lambda+11$. Diskriminant $49-44=5$, özdeğerler $\\lambda=\\tfrac{7\\pm\\sqrt{5}}{2}\\approx 4{,}618,\\,2{,}382$. İkisi de pozitif, yani $A\\succ 0$.
<br><br><strong>Sylvester yolu.</strong> Önde gelen minörler: $\\det(A_1)=4>0$, $\\det(A_2)=11>0$. Sonuç: $A\\succ 0$. Elle özdeğer hesaplamaktan hızlıdır.</div></div>

<div class="calc-example"><div class="example-label">POZİTİF TANIMLI DEĞİL</div><div class="example-body">$B=\\begin{bmatrix}1&3\\\\3&1\\end{bmatrix}$ için $\\det(B)=1-9=-8<0$. Özdeğerlerin çarpımı determinanta eşit olduğundan en az bir özdeğer negatiftir — gerçekten $\\lambda=4,\\,-2$. Yani $B$ simetriktir ama belirsizdir, pozitif tanımlı değildir.</div></div>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Her problemi elle çözün. Her hesap bir polinom kök bulma adımına ve bir homojen lineer sisteme indirgenir. Çözümler aşağıdadır.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — $2\\times 2$ ÖZDEĞERLERİ</div><div class="example-body"><strong>Problem.</strong> $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}$ matrisinin özdeğerlerini bulun.
<br><br><strong>Çözüm.</strong> $\\operatorname{iz}(A)=13$, $\\det(A)=40-4=36$. Karakteristik polinom $\\lambda^2-13\\lambda+36=(\\lambda-4)(\\lambda-9)$. Özdeğerler $\\lambda_1=4$, $\\lambda_2=9$. Sağlama: $4+9=13$, $4\\cdot 9=36$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — ÖZVEKTÖRLER</div><div class="example-body"><strong>Problem.</strong> $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}$ matrisinin her özuzayı için bir baz bulun.
<br><br><strong>Çözüm.</strong> <em>$\\lambda=4$ için:</em> $A-4I=\\begin{bmatrix}1&-2\\\\-2&4\\end{bmatrix}$. $v_1-2v_2=0$ denkleminden $v_1=2v_2$, dolayısıyla $\\mathbf{v}_1=(2,1)^T$, $E_4$'ü gerer.
<br><em>$\\lambda=9$ için:</em> $A-9I=\\begin{bmatrix}-4&-2\\\\-2&-1\\end{bmatrix}$. $-4v_1-2v_2=0$ denkleminden $v_2=-2v_1$, dolayısıyla $\\mathbf{v}_2=(1,-2)^T$, $E_9$'u gerer. $\\mathbf{v}_1^T\\mathbf{v}_2=2-2=0$ — simetrik bir matristen beklendiği gibi ortogonal.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — KÖŞEGENLEŞTİR</div><div class="example-body"><strong>Problem.</strong> $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}=PDP^{-1}$ olarak yazın.
<br><br><strong>Çözüm.</strong> Alıştırma 2'deki özçiftlerle:
$$P=\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}, \\quad D=\\begin{bmatrix}4&0\\\\0&9\\end{bmatrix}, \\quad \\det(P)=-5, \\quad P^{-1}=\\tfrac{1}{5}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}.$$
Çarpımı yaparak $PDP^{-1}=A$ olduğunu doğrula. $A=A^T$ ve özdeğerler farklı olduğundan, ortogonalleştirilmiş versiyonu $A=Q\\Lambda Q^T$, $Q=\\tfrac{1}{\\sqrt{5}}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}$ ($Q^TQ=I$).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — $A^{10}$ HESAPLA</div><div class="example-body"><strong>Problem.</strong> $A=\\begin{bmatrix}5&-2\\\\-2&8\\end{bmatrix}$ için $A^{10}$'u $PD^{10}P^{-1}$ olarak ifade edin.
<br><br><strong>Çözüm.</strong> Alıştırma 3'teki $P,D,P^{-1}$ ile,
$$A^{10}=P\\begin{bmatrix}4^{10}&0\\\\0&9^{10}\\end{bmatrix}P^{-1}=\\tfrac{1}{5}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}\\begin{bmatrix}1048576&0\\\\0&3486784401\\end{bmatrix}\\begin{bmatrix}2&1\\\\1&-2\\end{bmatrix}.$$
Çarpımı giriş giriş yaparak açık bir tam sayı matrisi elde ederiz; baskın katkı $9^{10}$ teriminden gelir — en büyük özdeğer $k\\to\\infty$ iken $A^k$'nın asimptotiğini yönetir; bu olgu analizin pek çok yerinde tekrar eder.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — POZİTİF TANIMLILIK</div><div class="example-body"><strong>Problem.</strong> $M=\\begin{bmatrix}2&a\\\\a&2\\end{bmatrix}$ hangi reel $a$ için pozitif tanımlıdır?
<br><br><strong>Çözüm.</strong> $M$ simetriktir. Sylvester kriteri: $\\det(M_1)=2>0$ otomatik ve $\\det(M_2)=4-a^2>0$ ancak ve ancak $|a|<2$. Özdeğer kontrolü: $\\lambda^2-4\\lambda+(4-a^2)=0$'ın kökleri $2\\pm|a|$'dır, ikisi de pozitif ancak ve ancak $|a|<2$. Sonuç: $M\\succ 0\\iff -2<a<2$. $|a|=2$'de bir özdeğer sıfırdır ($M\\succeq 0$ ama tam tanımlı değil); $|a|>2$ için bir özdeğer negatiftir.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — ÜÇGEN ÖZDEĞERLERİ</div><div class="example-body"><strong>Problem.</strong> $T=\\begin{bmatrix}3&7&-2\\\\0&-1&4\\\\0&0&5\\end{bmatrix}$ matrisinin özdeğerlerini listeleyin ve her biri için bir özvektör bulun.
<br><br><strong>Çözüm.</strong> Üçgen olduğundan özdeğerler köşegen girişleridir: $3,-1,5$. $\\lambda=3$ için: $T-3I=\\begin{bmatrix}0&7&-2\\\\0&-4&4\\\\0&0&2\\end{bmatrix}$'in çekirdeğinde $(1,0,0)^T$ var. $\\lambda=-1$ için: $T+I$'de geri yerine koyma $\\mathbf{v}=(7,4,0)^T$ verir (skaler katlara kadar). $\\lambda=5$ için: $T-5I$'de geri yerine koyma $\\mathbf{v}=(15,8,4)^T$ verir (bir geçerli temsilci; sıfırdan farklı her skaler katı da doğrudur).</div></div>

<h2 class="l-title">Özet</h2>

<p class="l-text">Özdeğer problemi $A\\mathbf{v}=\\lambda\\mathbf{v}$, kare bir matris tarafından değişmez bırakılan yönleri arar. Karakteristik polinom $\\det(A-\\lambda I)$, kökleri özdeğerler olan derecesi $n$ olan bir polinomdur; özdeğerler farklı olduğunda özvektörler lineer bağımsızdır ve matris $A=PDP^{-1}$ olarak köşegenleştirilebilir. Bir özdeğer tekrarlandığında geometrik çokluk cebirsel çokluktan küçük olabilir — bu durumda matris defektif olur ve yalnızca Jordan formunu kabul eder, köşegen biçimi değil. Köşegenleştirme kuvvetleri ucuzlatır ($A^k=PD^kP^{-1}$) ve Fibonacci gibi özyinelemeleri tek hamlede kapatır. Simetrik matrisler spektral teoremin hediyesini taşır: reel özdeğerler, ortonormal özbaz ve temiz $A=Q\\Lambda Q^T$ ayrışımı. $\\lambda_i>0$ işaret koşulunu eklemek pozitif tanımlı matrisleri karakterize eder; bunların $\\mathbf{x}^TA\\mathbf{x}$ ikinci dereceden formları sıfırdan farklı uzayda kesinlikle pozitiftir. İki-iki hesaplardan üçgen spektrumlara kadar aynı reçete geçerlidir — polinomu çarpanlarına ayır, çekirdeği çöz, geometriyi oku.</p>`

};
