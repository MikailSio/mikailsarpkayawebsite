var LINALG_L5 = {

en: '<p class="l-text"><strong>The Singular Value Decomposition (SVD) is the most general and geometrically transparent decomposition in linear algebra.</strong> Where eigendecomposition only applies to square matrices and may fail (defective cases), SVD applies to every real (or complex) matrix without exception, and always factorizes into two orthogonal rotations and one diagonal stretching. It is the cleanest expression of the geometric content of a linear map.</p>'

+ '<p class="l-text">This lesson develops SVD from pure linear algebra: motivation through symmetric/non-symmetric matrices, derivation from the spectral theorem applied to $A^T A$, the rotation-stretch-rotation geometry, Eckart–Young low-rank approximation, polar decomposition, and the Moore–Penrose pseudo-inverse. Every theorem is proved or sketched; every example is worked by hand.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>State and prove the SVD theorem $A = U\\Sigma V^T$ for any $m\\times n$ matrix</li>'
+ '<li>Derive singular values and singular vectors from the eigendecomposition of $A^T A$</li>'
+ '<li>Interpret SVD geometrically as a rotation followed by axis-aligned stretching followed by a rotation</li>'
+ '<li>Compute the SVD of a small matrix by hand from start to finish</li>'
+ '<li>State and prove the Eckart–Young theorem on best low-rank approximation</li>'
+ '<li>Define the polar decomposition $A = QP$ and connect it to SVD</li>'
+ '<li>Construct the Moore–Penrose pseudo-inverse and use it for least-squares</li>'
+ '<li>Compute Frobenius and spectral norms from singular values</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: From Eigenvalues to Singular Values
   ============================================================ */
+ '<h2 class="l-title">1. From Eigenvalues to Singular Values</h2>'

+ '<div class="calc-highlight"><strong>The motivating gap.</strong> Eigendecomposition $A = P D P^{-1}$ requires $A$ to be square and to have a full basis of eigenvectors. SVD removes both restrictions: it is defined for any rectangular matrix and is geometrically more revealing — every linear map is two rotations and one diagonal scaling.</div>'

+ '<p class="l-text">Recall from the spectral theorem (Lesson 4): if $S$ is a real symmetric $n\\times n$ matrix, there is an orthonormal basis $v_1,\\dots,v_n$ of $\\mathbb{R}^n$ and real numbers $\\lambda_1,\\dots,\\lambda_n$ with</p>'

+ '<div class="calc-formula"><div class="formula-label">SPECTRAL THEOREM (RECALL)</div><div class="formula-main">$$S = Q \\Lambda Q^T, \\qquad Q^T Q = I, \\qquad \\Lambda = \\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n).$$</div><div class="formula-sub">For symmetric matrices, eigenvectors can be chosen orthonormal and eigenvalues are real.</div></div>'

+ '<p class="l-text">For a general (possibly non-square, possibly non-symmetric) matrix $A\\in\\mathbb{R}^{m\\times n}$, no eigendecomposition exists in this clean form. However, two symmetric matrices are <em>always</em> available:</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">$A^T A$</div><div class="card-body">An $n\\times n$ symmetric positive semi-definite matrix. Its eigenvalues are non-negative real numbers $\\lambda_i \\ge 0$.</div></div><div class="calc-card"><div class="card-title">$A A^T$</div><div class="card-body">An $m\\times m$ symmetric positive semi-definite matrix. Its nonzero eigenvalues coincide with those of $A^T A$.</div></div><div class="calc-card"><div class="card-title">Singular value</div><div class="card-body">$\\sigma_i := \\sqrt{\\lambda_i(A^T A)} \\ge 0$. These are the natural <em>positive</em> stretching factors of $A$.</div></div></div>'

+ '<p class="l-text"><strong>Why $A^T A$ is symmetric positive semi-definite.</strong> For any $x\\in\\mathbb{R}^n$,</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x^T (A^T A) x = (Ax)^T (Ax) = \\|Ax\\|^2 \\ge 0,$$</div><div class="formula-sub">so all eigenvalues of $A^T A$ are non-negative. Equality $\\|Ax\\|^2 = 0$ iff $x \\in \\ker A$.</div></div>'

+ '<div class="l-note"><strong>Key idea.</strong> Singular values measure how much $A$ stretches unit vectors. Since $\\|Av\\|^2 = v^T A^T A\\, v$, the maximum stretch over unit vectors equals $\\sqrt{\\lambda_{\\max}(A^T A)} = \\sigma_1$ — the top singular value. This is also called the spectral norm $\\|A\\|_2$.</div>'

+ '<div class="think-box"><div class="think-label">EXERCISE</div><div class="think-body">Show that $A^T A$ and $A A^T$ have the same nonzero eigenvalues. <em>Hint: if $A^T A v = \\lambda v$ with $\\lambda \\ne 0$, consider $w = Av$ and compute $A A^T w$.</em></div></div>'

/* ============================================================
   SECTION 2: The SVD Theorem
   ============================================================ */
+ '<h2 class="l-title">2. The SVD Theorem</h2>'

+ '<div class="calc-highlight"><strong>Statement.</strong> Every real $m\\times n$ matrix factors as $A = U\\Sigma V^T$ where $U\\in\\mathbb{R}^{m\\times m}$ and $V\\in\\mathbb{R}^{n\\times n}$ are orthogonal and $\\Sigma\\in\\mathbb{R}^{m\\times n}$ is diagonal with non-negative entries $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$.</div>'

+ '<div class="calc-formula"><div class="formula-label">SVD — FULL FORM</div><div class="formula-main">$$A = U\\,\\Sigma\\,V^T, \\qquad U^T U = I_m, \\qquad V^T V = I_n.$$</div><div class="formula-sub">Columns of $U$ are left singular vectors; columns of $V$ are right singular vectors; the $\\sigma_i$ are singular values.</div></div>'

+ '<p class="l-text"><strong>Proof sketch (existence).</strong> Apply the spectral theorem to the symmetric PSD matrix $A^T A$:</p>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Spectral decomposition of $A^T A$</div><div class="step-detail">There is an orthonormal basis $v_1,\\dots,v_n$ of $\\mathbb{R}^n$ and reals $\\lambda_1 \\ge \\dots \\ge \\lambda_n \\ge 0$ with $A^T A\\,v_i = \\lambda_i v_i$. Let $r$ be the number of nonzero $\\lambda_i$ (so $r = \\operatorname{rank}(A)$).</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Define singular values and left singular vectors</div><div class="step-detail">Set $\\sigma_i = \\sqrt{\\lambda_i}$ and for $i \\le r$ define $u_i := \\dfrac{1}{\\sigma_i} A v_i \\in \\mathbb{R}^m$.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Show $\\{u_i\\}$ are orthonormal</div><div class="step-detail">$\\langle u_i, u_j\\rangle = \\dfrac{1}{\\sigma_i\\sigma_j}\\langle Av_i, Av_j\\rangle = \\dfrac{1}{\\sigma_i\\sigma_j} v_i^T A^T A v_j = \\dfrac{\\lambda_j}{\\sigma_i\\sigma_j}\\langle v_i,v_j\\rangle = \\delta_{ij}.$</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Extend $\\{u_i\\}_{i\\le r}$ to an orthonormal basis of $\\mathbb{R}^m$</div><div class="step-detail">By Gram–Schmidt, pick $u_{r+1},\\dots,u_m$ in $(\\operatorname{im} A)^\\perp = \\ker A^T$ to fill an orthonormal basis. Assemble $U=[u_1|\\dots|u_m]$, $V=[v_1|\\dots|v_n]$.</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Verify $A = U\\Sigma V^T$</div><div class="step-detail">By construction $Av_i = \\sigma_i u_i$ for $i\\le r$ and $Av_i = 0$ for $i>r$. Therefore $AV = U\\Sigma$, and right-multiplying by $V^T$ gives $A = U\\Sigma V^T$. $\\blacksquare$</div></div></div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Uniqueness</div><div class="card-body">The singular values $\\sigma_i$ are <strong>unique</strong>. The singular vectors are unique up to sign (and up to rotations within eigenspaces if $\\sigma_i$ has multiplicity $>1$).</div></div><div class="calc-card"><div class="card-title">Thin (reduced) SVD</div><div class="card-body">Keep only the $r=\\operatorname{rank}(A)$ nonzero $\\sigma_i$: $A = U_r \\Sigma_r V_r^T$ with $U_r\\in\\mathbb{R}^{m\\times r}$, $\\Sigma_r\\in\\mathbb{R}^{r\\times r}$, $V_r\\in\\mathbb{R}^{n\\times r}$.</div></div><div class="calc-card"><div class="card-title">Outer-product form</div><div class="card-body">$A = \\sum_{i=1}^{r} \\sigma_i\\, u_i v_i^T$ — a sum of rank-1 matrices weighted by singular values.</div></div><div class="calc-card"><div class="card-title">Four fundamental subspaces</div><div class="card-body">$\\{v_1,\\dots,v_r\\}$ basis of row space; $\\{v_{r+1},\\dots,v_n\\}$ basis of $\\ker A$; $\\{u_1,\\dots,u_r\\}$ basis of $\\operatorname{im} A$; $\\{u_{r+1},\\dots,u_m\\}$ basis of $\\ker A^T$.</div></div></div>'

+ '<div class="l-note"><strong>Connection to eigen-decomposition.</strong> If $A$ is symmetric with eigenvalues $\\lambda_i$ and orthonormal eigenvectors, then its SVD is $A = Q\\,|\\Lambda|\\,(\\operatorname{sgn}(\\Lambda)Q)^T$, i.e. $\\sigma_i = |\\lambda_i|$. For a general $A$, SVD strips the sign and rotation aspects apart cleanly.</div>'

/* ============================================================
   SECTION 3: Geometric Interpretation
   ============================================================ */
+ '<h2 class="l-title">3. Geometric Interpretation: Rotation – Stretch – Rotation</h2>'

+ '<div class="calc-highlight"><strong>Every linear map is three steps:</strong> rotate the input ($V^T$), stretch along the coordinate axes ($\\Sigma$), rotate the result ($U$). This is the SVD.</div>'

+ '<p class="l-text">Reading $A = U\\Sigma V^T$ right-to-left, the map $x \\mapsto Ax$ decomposes as</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x \\;\\xrightarrow{V^T}\\; V^T x \\;\\xrightarrow{\\Sigma}\\; \\Sigma V^T x \\;\\xrightarrow{U}\\; U\\Sigma V^T x = Ax.$$</div></div>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$V^T$: input rotation</div><div class="step-detail">$V^T$ is orthogonal, so it rigidly rotates (possibly reflects) $\\mathbb{R}^n$. The basis vectors $v_1,\\dots,v_n$ are sent to the standard basis $e_1,\\dots,e_n$.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\Sigma$: axis-aligned stretching</div><div class="step-detail">$\\Sigma$ is diagonal: it scales the $i$-th coordinate by $\\sigma_i$. Lengths along each axis are scaled by the corresponding singular value. This is the only step that changes lengths.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$U$: output rotation</div><div class="step-detail">$U$ orthogonally rotates $\\mathbb{R}^m$, sending $e_1,\\dots,e_r$ to $u_1,\\dots,u_r$. The stretched axes are placed into the directions of the left singular vectors.</div></div></div></div>'

+ '<p class="l-text"><strong>Image of the unit sphere.</strong> Let $S^{n-1} = \\{x \\in \\mathbb{R}^n : \\|x\\|=1\\}$. Then $A(S^{n-1})$ is the closed ellipsoid in $\\operatorname{im} A$ with semi-axes $\\sigma_1 u_1, \\sigma_2 u_2, \\dots, \\sigma_r u_r$. This is the geometric picture of SVD.</p>'

/* --- Plotly: Geometric SVD — unit circle to ellipse (EN) --- */
+ '<div id="plot-svd-geometry-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var theta=[];for(var i=0;i<=120;i++)theta.push(2*Math.PI*i/120);'
+ 'var cx=theta.map(function(t){return Math.cos(t)});'
+ 'var cy=theta.map(function(t){return Math.sin(t)});'
+ 'var s1=3,s2=1.2,angle=Math.PI/6;'
+ 'var cosA=Math.cos(angle),sinA=Math.sin(angle);'
+ 'var ex=theta.map(function(t){var x=s1*Math.cos(t),y=s2*Math.sin(t);return cosA*x-sinA*y;});'
+ 'var ey=theta.map(function(t){var x=s1*Math.cos(t),y=s2*Math.sin(t);return sinA*x+cosA*y;});'
+ 'var t1={x:cx,y:cy,mode:"lines",name:"Unit sphere S^{n-1}",line:{color:"#4ecdc4",width:2}};'
+ 'var t2={x:ex,y:ey,mode:"lines",name:"Image A(S^{n-1}) (ellipse)",line:{color:"#c8a96e",width:3}};'
+ 'var t3={x:[0,cosA*s1],y:[0,sinA*s1],mode:"lines+markers",name:"sigma_1 u_1",line:{color:"#f87171",width:2,dash:"dash"},marker:{size:[4,8]}};'
+ 'var t4={x:[0,-sinA*s2],y:[0,cosA*s2],mode:"lines+markers",name:"sigma_2 u_2",line:{color:"#a78bfa",width:2,dash:"dash"},marker:{size:[4,8]}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4],title:"x",scaleanchor:"y"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4],title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:"h",y:-0.18,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-svd-geometry-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">The unit circle (teal) is mapped to the ellipse (gold). The semi-axes have lengths $\\sigma_1$ and $\\sigma_2$ and point along the left singular vectors $u_1$ and $u_2$. SVD says: rotate input ($V^T$), stretch by $\\sigma_i$ along each axis ($\\Sigma$), then rotate to the $u_i$ frame ($U$).</div></div>'

+ '<div class="think-box"><div class="think-label">EXERCISE</div><div class="think-body">If all $\\sigma_i$ are equal to $c>0$, what is the geometric shape of $A$? <em>Answer: $A = c\\,UV^T$ where $UV^T$ is orthogonal, so $A$ acts as a uniform scaling by $c$ composed with a rotation. The unit sphere maps to a sphere of radius $c$.</em></div></div>'

/* ============================================================
   SECTION 4: Computing SVD from A^T A
   ============================================================ */
+ '<h2 class="l-title">4. Computing SVD from $A^T A$</h2>'

+ '<div class="calc-highlight">The proof of SVD is also a recipe. Diagonalize $A^T A$ to get $V$ and the $\\sigma_i^2$; recover $u_i = \\sigma_i^{-1} A v_i$ for $\\sigma_i > 0$; extend to a full orthonormal basis of $\\mathbb{R}^m$.</div>'

+ '<div class="calc-formula"><div class="formula-label">EIGEN–SVD BRIDGE</div><div class="formula-main">$$A^T A = V \\Sigma^T \\Sigma V^T, \\qquad A A^T = U \\Sigma \\Sigma^T U^T.$$</div><div class="formula-sub">The eigenvalues of $A^T A$ are $\\sigma_i^2$; the eigenvectors are the columns of $V$. Analogously for $AA^T$ and $U$.</div></div>'

+ '<p class="l-text"><strong>Algorithm (by hand, small matrices).</strong></p>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Form $A^T A$</div><div class="step-detail">An $n\\times n$ symmetric PSD matrix.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Solve $\\det(A^T A - \\lambda I) = 0$</div><div class="step-detail">Roots are $\\lambda_i \\ge 0$. Order them $\\lambda_1 \\ge \\dots \\ge \\lambda_n$ and set $\\sigma_i = \\sqrt{\\lambda_i}$.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Find orthonormal eigenvectors $v_i$</div><div class="step-detail">For each $\\lambda_i$, solve $(A^T A - \\lambda_i I) v = 0$. Normalize. Within a repeated eigenvalue, orthogonalize via Gram–Schmidt.</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Compute $u_i = \\sigma_i^{-1} A v_i$ for $\\sigma_i > 0$</div><div class="step-detail">These are automatically orthonormal (proved in Section 2). For $\\sigma_i = 0$, $u_i$ is free; pick it to complete an orthonormal basis of $\\mathbb{R}^m$.</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Assemble and verify</div><div class="step-detail">$U=[u_1|\\dots|u_m]$, $V=[v_1|\\dots|v_n]$, $\\Sigma=\\operatorname{diag}(\\sigma_i)$ padded to $m\\times n$. Check $A \\stackrel{?}{=} U\\Sigma V^T$.</div></div></div></div>'

+ '<div class="l-note"><strong>Numerical reality.</strong> Forming $A^T A$ explicitly can be numerically poor: the condition number squares. Industrial SVD algorithms (Golub–Reinsch, one-sided Jacobi, randomized SVD) avoid this. The $A^T A$ route is for understanding and hand computation.</div>'

/* ============================================================
   SECTION 5: Worked Example — 3x2 Matrix by Hand
   ============================================================ */
+ '<h2 class="l-title">5. Worked Example — SVD of a $3\\times 2$ Matrix</h2>'

+ '<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body">Compute the SVD of $A = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{bmatrix}.$ Find $U\\in\\mathbb{R}^{3\\times 3}$, $\\Sigma\\in\\mathbb{R}^{3\\times 2}$, $V\\in\\mathbb{R}^{2\\times 2}$ and verify $A = U\\Sigma V^T$.</div></div>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Form $A^T A$</div><div class="step-detail">$$A^T A = \\begin{bmatrix}1 & 0 & 1\\\\ 1 & 1 & 0\\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}.$$</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Eigenvalues of $A^T A$</div><div class="step-detail">$\\det\\!\\begin{bmatrix} 2-\\lambda & 1 \\\\ 1 & 2-\\lambda \\end{bmatrix} = (2-\\lambda)^2 - 1 = \\lambda^2 - 4\\lambda + 3 = (\\lambda-3)(\\lambda-1) = 0.$ So $\\lambda_1 = 3,\\ \\lambda_2 = 1$ and $\\sigma_1 = \\sqrt{3},\\ \\sigma_2 = 1.$</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Right singular vectors $v_i$</div><div class="step-detail">For $\\lambda=3$: $(A^T A - 3I)v = \\begin{bmatrix}-1 & 1\\\\ 1 & -1\\end{bmatrix}v = 0 \\Rightarrow v_1 = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ 1\\end{bmatrix}.$<br>For $\\lambda=1$: $v_2 = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ -1\\end{bmatrix}.$</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Left singular vectors $u_i = \\sigma_i^{-1} A v_i$</div><div class="step-detail">$u_1 = \\dfrac{1}{\\sqrt{3}}A v_1 = \\dfrac{1}{\\sqrt{6}}\\begin{bmatrix} 2 \\\\ 1 \\\\ 1\\end{bmatrix}, \\qquad u_2 = \\dfrac{1}{1}A v_2 = \\dfrac{1}{\\sqrt{2}}\\begin{bmatrix} 0 \\\\ -1 \\\\ 1\\end{bmatrix}.$<br>Check $\\|u_1\\| = \\sqrt{(4+1+1)/6} = 1,\\ \\|u_2\\| = 1,\\ \\langle u_1,u_2\\rangle = \\tfrac{1}{\\sqrt{12}}(0-1+1) = 0.$</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Extend to $u_3$</div><div class="step-detail">$u_3$ is a unit vector in $\\mathbb{R}^3$ orthogonal to $u_1,u_2$. Compute $u_3 = u_1 \\times u_2 = \\dfrac{1}{\\sqrt{3}}\\begin{bmatrix} 1 \\\\ -1 \\\\ -1\\end{bmatrix}$ (taking the cross product, normalized).</div></div></div><div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Assemble</div><div class="step-detail">$$U = \\begin{bmatrix} 2/\\sqrt{6} & 0 & 1/\\sqrt{3}\\\\ 1/\\sqrt{6} & -1/\\sqrt{2} & -1/\\sqrt{3}\\\\ 1/\\sqrt{6} & 1/\\sqrt{2} & -1/\\sqrt{3} \\end{bmatrix},\\quad \\Sigma = \\begin{bmatrix} \\sqrt{3} & 0\\\\ 0 & 1\\\\ 0 & 0\\end{bmatrix},\\quad V = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1\\\\ 1 & -1\\end{bmatrix}.$$</div></div></div><div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">Verify $A = U\\Sigma V^T$</div><div class="step-detail">Compute $\\Sigma V^T = \\begin{bmatrix} \\sqrt{3}/\\sqrt{2} & \\sqrt{3}/\\sqrt{2}\\\\ 1/\\sqrt{2} & -1/\\sqrt{2}\\\\ 0 & 0\\end{bmatrix}$. Then $U\\cdot (\\Sigma V^T)$ row by row gives $\\begin{bmatrix} 1 & 1\\\\ 0 & 1\\\\ 1 & 0\\end{bmatrix} = A.\\ \\checkmark$</div></div></div></div>'

+ '<div class="l-note"><strong>Sanity check on rank.</strong> Both singular values are nonzero, so $\\operatorname{rank}(A) = 2$. The third column of $U$ lies in $\\ker A^T$ and does not appear in the thin SVD.</div>'

/* ============================================================
   SECTION 6: Singular Values, Rank, Norms, Condition Number
   ============================================================ */
+ '<h2 class="l-title">6. Singular Values, Rank, Norms, Condition Number</h2>'

+ '<div class="calc-highlight">Singular values encode almost every quantitative invariant of $A$: rank, Frobenius norm, spectral norm, condition number, and the gap between $A$ and lower-rank matrices.</div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Rank</div><div class="card-body">$\\operatorname{rank}(A) = \\#\\{i : \\sigma_i > 0\\}$. This is the numerically stable definition (count $\\sigma_i$ above a tolerance).</div></div><div class="calc-card"><div class="card-title">Spectral norm</div><div class="card-body">$\\|A\\|_2 = \\sigma_1$ — the largest singular value. Equivalently, the operator norm $\\sup_{\\|x\\|=1}\\|Ax\\|$.</div></div><div class="calc-card"><div class="card-title">Frobenius norm</div><div class="card-body">$\\|A\\|_F = \\sqrt{\\sum_i \\sigma_i^2} = \\sqrt{\\operatorname{tr}(A^T A)}.$ A unitarily invariant norm.</div></div><div class="calc-card"><div class="card-title">Condition number</div><div class="card-body">$\\kappa_2(A) = \\sigma_1/\\sigma_r$ (for full-rank $A$). Measures sensitivity of $A^{-1}b$ to perturbations.</div></div></div>'

+ '<p class="l-text"><strong>Proof that $\\|A\\|_F^2 = \\sum \\sigma_i^2$.</strong> Using $\\|M\\|_F^2 = \\operatorname{tr}(M^T M)$ and the SVD,</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\|A\\|_F^2 = \\operatorname{tr}(V\\Sigma^T U^T U \\Sigma V^T) = \\operatorname{tr}(V \\Sigma^T \\Sigma V^T) = \\operatorname{tr}(\\Sigma^T \\Sigma) = \\sum_{i=1}^{\\min(m,n)} \\sigma_i^2.$$</div><div class="formula-sub">Trace is invariant under orthogonal similarity and is a sum of squared singular values.</div></div>'

+ '<p class="l-text"><strong>Why $\\sigma_1 = \\|A\\|_2$.</strong> For any unit $x$, write $x = \\sum c_i v_i$ with $\\sum c_i^2 = 1$. Then $Ax = \\sum c_i \\sigma_i u_i$ and $\\|Ax\\|^2 = \\sum c_i^2 \\sigma_i^2 \\le \\sigma_1^2$, with equality at $x = v_1$.</p>'

/* --- Plotly: singular value spectrum (EN) --- */
+ '<div id="plot-sv-spectrum-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sv=[10,6,3.5,2,1.2,0.8,0.5,0.3,0.15,0.08,0.04,0.02,0.01,0.005,0.002];'
+ 'var idx=sv.map(function(v,i){return i+1;});'
+ 'var sv2=sv.map(function(v){return v*v;});'
+ 'var total=sv2.reduce(function(a,b){return a+b;},0);'
+ 'var cum=[];var s=0;sv2.forEach(function(v){s+=v;cum.push(100*s/total);});'
+ 'var t1={x:idx,y:sv,type:"bar",name:"sigma_i",marker:{color:"#c8a96e"}};'
+ 'var t2={x:idx,y:cum,type:"scatter",mode:"lines+markers",name:"Cumulative energy (%)",yaxis:"y2",line:{color:"#4ecdc4",width:2},marker:{size:6}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Index i",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"sigma_i",side:"left"},yaxis2:{title:"Cumulative energy (%)",side:"right",overlaying:"y",range:[0,105],gridcolor:"rgba(255,255,255,0.03)"},margin:{t:30,r:60,b:60,l:60},showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-sv-spectrum-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Singular values typically decay (gold bars). The cumulative sum of $\\sigma_i^2$ (teal) reaches most of $\\|A\\|_F^2$ with only a few terms — the quantitative basis for low-rank approximation.</div></div>'

/* ============================================================
   SECTION 7: Low-Rank Approximation — Eckart–Young
   ============================================================ */
+ '<h2 class="l-title">7. Low-Rank Approximation: The Eckart–Young Theorem</h2>'

+ '<div class="calc-highlight"><strong>Statement.</strong> Among all matrices $B$ of rank $\\le k$, the truncated SVD $A_k = \\sum_{i=1}^{k} \\sigma_i u_i v_i^T$ minimizes both $\\|A - B\\|_2$ and $\\|A - B\\|_F$.</div>'

+ '<div class="calc-formula"><div class="formula-label">ECKART–YOUNG (–MIRSKY)</div><div class="formula-main">$$\\min_{\\operatorname{rank}(B) \\le k} \\|A - B\\|_2 = \\sigma_{k+1}, \\qquad \\min_{\\operatorname{rank}(B) \\le k} \\|A - B\\|_F = \\sqrt{\\sum_{i=k+1}^{r} \\sigma_i^2}.$$</div><div class="formula-sub">Both minima are attained by the truncated SVD $A_k$.</div></div>'

+ '<p class="l-text"><strong>Proof sketch (Frobenius norm).</strong> Use that the Frobenius norm is unitarily invariant: $\\|U^T M V\\|_F = \\|M\\|_F$ for orthogonal $U,V$. Therefore</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\|A - B\\|_F = \\|U^T(A-B)V\\|_F = \\|\\Sigma - \\tilde B\\|_F, \\qquad \\tilde B := U^T B V.$$</div></div>'

+ '<p class="l-text">$\\tilde B$ has rank $\\le k$, and $\\Sigma$ is diagonal with entries $\\sigma_i$. Minimizing $\\|\\Sigma - \\tilde B\\|_F$ over rank-$k$ matrices is the same as choosing which $k$ diagonal entries to match exactly; the rest contribute $\\sigma_i^2$ to the error. The minimum is achieved by keeping the largest $k$ values, giving error $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$. $\\blacksquare$</p>'

+ '<p class="l-text"><strong>Proof sketch (spectral norm).</strong> For any $B$ of rank $\\le k$, $\\ker B$ has dimension $\\ge n - k$. Intersect with $\\operatorname{span}\\{v_1,\\dots,v_{k+1}\\}$ (dimension $k+1$): by dimensions, the intersection contains a unit vector $x$. Then $Bx = 0$ and $Ax = \\sum_{i=1}^{k+1} \\langle x,v_i\\rangle \\sigma_i u_i$ has $\\|Ax\\| \\ge \\sigma_{k+1}\\|x\\| = \\sigma_{k+1}$. Hence $\\|A - B\\|_2 \\ge \\sigma_{k+1}$, achieved by $B = A_k$. $\\blacksquare$</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Truncation error</div><div class="card-body">$\\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\dots + \\sigma_r^2.$ The neglected energy is exactly the sum of squared tail singular values.</div></div><div class="calc-card"><div class="card-title">Energy capture</div><div class="card-body">$\\dfrac{\\|A_k\\|_F^2}{\\|A\\|_F^2} = \\dfrac{\\sum_{i=1}^k \\sigma_i^2}{\\sum_{i=1}^r \\sigma_i^2}$ — the fraction of $\\|A\\|_F^2$ retained by the rank-$k$ approximation.</div></div><div class="calc-card"><div class="card-title">Optimality is exact</div><div class="card-body">No other rank-$k$ matrix can do strictly better in either norm. SVD is not just <em>a</em> low-rank approximation — it is <em>the</em> optimal one.</div></div><div class="calc-card"><div class="card-title">Brief application note</div><div class="card-body">This theorem is the mathematical foundation behind dimensionality reduction (e.g. PCA viewed as truncated SVD of a centered data matrix). Within this lesson, PCA is just a re-reading of Eckart–Young.</div></div></div>'

/* --- Plotly: reconstruction error vs rank (EN) --- */
+ '<div id="plot-recon-error-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sv=[10,6,3.5,2,1.2,0.8,0.5,0.3,0.15,0.08,0.04,0.02,0.01,0.005,0.002];'
+ 'var sv2=sv.map(function(v){return v*v;});'
+ 'var err=[];for(var k=1;k<=sv.length;k++){var rem=0;for(var j=k;j<sv.length;j++)rem+=sv2[j];err.push(Math.sqrt(rem));}'
+ 'var idx=sv.map(function(v,i){return i+1;});'
+ 'var t1={x:idx,y:err,mode:"lines+markers",name:"||A - A_k||_F = sqrt(sum sigma_i^2)",line:{color:"#f87171",width:2},marker:{size:6}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Rank k",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Frobenius error"},margin:{t:30,r:30,b:60,l:60},showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-recon-error-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Eckart–Young in action: $\\|A - A_k\\|_F$ decreases monotonically in $k$, with the explicit formula $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$. The plot shows the optimal achievable Frobenius error at each rank.</div></div>'

/* ============================================================
   SECTION 8: Polar Decomposition
   ============================================================ */
+ '<h2 class="l-title">8. Polar Decomposition</h2>'

+ '<div class="calc-highlight">Every square matrix factors as <em>orthogonal</em> $\\times$ <em>symmetric PSD</em>. This is the matrix analogue of writing a complex number as $r e^{i\\theta}$, and it follows immediately from SVD.</div>'

+ '<div class="calc-formula"><div class="formula-label">POLAR DECOMPOSITION</div><div class="formula-main">$$A = Q P, \\qquad Q \\text{ orthogonal}, \\quad P = (A^T A)^{1/2} \\text{ symmetric PSD}.$$</div><div class="formula-sub">For invertible square $A$, $Q$ and $P$ are unique.</div></div>'

+ '<p class="l-text"><strong>Derivation from SVD.</strong> Let $A = U\\Sigma V^T$ with $A\\in\\mathbb{R}^{n\\times n}$. Define</p>'

+ '<div class="calc-formula"><div class="formula-main">$$Q := U V^T, \\qquad P := V \\Sigma V^T.$$</div></div>'

+ '<p class="l-text">Then $Q$ is a product of orthogonal matrices, hence orthogonal. And $P = V\\Sigma V^T$ is symmetric with eigenvalues $\\sigma_i \\ge 0$, hence symmetric PSD. Finally</p>'

+ '<div class="calc-formula"><div class="formula-main">$$Q P = U V^T \\cdot V \\Sigma V^T = U \\Sigma V^T = A.$$</div></div>'

+ '<p class="l-text">The factor $P$ satisfies $P^2 = V\\Sigma^2 V^T = A^T A$, so $P = (A^T A)^{1/2}$ — the unique PSD square root.</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Left polar form</div><div class="card-body">Equivalently $A = P\\,\\prime\\, Q$ with $P' = U\\Sigma U^T = (A A^T)^{1/2}$. The orthogonal factor is the same.</div></div><div class="calc-card"><div class="card-title">Geometric meaning</div><div class="card-body">$A$ acts by first stretching by $P$ along the principal axes of $V$, then rotating by $Q$. Symmetric PSD is "stretch only"; orthogonal is "rotate only".</div></div><div class="calc-card"><div class="card-title">Nearest orthogonal matrix</div><div class="card-body">For invertible $A$, $Q = UV^T$ is the orthogonal matrix closest to $A$ in Frobenius norm — used in continuum mechanics, computer graphics, and Procrustes alignment.</div></div></div>'

/* ============================================================
   SECTION 9: Pseudo-Inverse and Least Squares
   ============================================================ */
+ '<h2 class="l-title">9. Moore–Penrose Pseudo-Inverse and Least Squares</h2>'

+ '<div class="calc-highlight">The pseudo-inverse $A^+$ extends matrix inversion to non-square and rank-deficient matrices. It is defined by SVD and solves the least-squares / minimum-norm problem cleanly.</div>'

+ '<div class="calc-formula"><div class="formula-label">PSEUDO-INVERSE VIA SVD</div><div class="formula-main">$$A = U\\Sigma V^T \\quad\\Longrightarrow\\quad A^+ = V\\,\\Sigma^+\\,U^T,$$</div><div class="formula-sub">where $\\Sigma^+$ is the $n\\times m$ matrix obtained from $\\Sigma^T$ by replacing each nonzero $\\sigma_i$ with $1/\\sigma_i$.</div></div>'

+ '<p class="l-text"><strong>Moore–Penrose conditions.</strong> $A^+$ is the unique matrix satisfying</p>'

+ '<div class="calc-formula"><div class="formula-main">$$A A^+ A = A, \\quad A^+ A A^+ = A^+, \\quad (A A^+)^T = A A^+, \\quad (A^+ A)^T = A^+ A.$$</div></div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Square invertible</div><div class="card-body">If $A$ is invertible, $A^+ = A^{-1}$.</div></div><div class="calc-card"><div class="card-title">Tall full-rank ($m>n$, rank $n$)</div><div class="card-body">$A^+ = (A^T A)^{-1} A^T$. The least-squares normal equation solver.</div></div><div class="calc-card"><div class="card-title">Wide full-rank ($m<n$, rank $m$)</div><div class="card-body">$A^+ = A^T (A A^T)^{-1}$. Gives the minimum-norm solution.</div></div><div class="calc-card"><div class="card-title">Rank-deficient</div><div class="card-body">SVD definition still works; only nonzero $\\sigma_i$ are inverted. Other formulas may fail.</div></div></div>'

+ '<p class="l-text"><strong>Least-squares theorem.</strong> For any $A\\in\\mathbb{R}^{m\\times n}$ and $b\\in\\mathbb{R}^m$, the vector</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x^* := A^+ b$$</div></div>'

+ '<p class="l-text">is the (unique) minimizer of $\\|Ax - b\\|^2$ that has the smallest norm $\\|x^*\\|$ among all minimizers.</p>'

+ '<p class="l-text"><em>Proof sketch.</em> Write $b = U c$. Then $\\|Ax-b\\|^2 = \\|\\Sigma V^T x - c\\|^2 = \\|\\Sigma y - c\\|^2$ with $y = V^T x$. Componentwise this is $\\sum (\\sigma_i y_i - c_i)^2 + \\sum_{i>r} c_i^2$. Minimize by $y_i = c_i/\\sigma_i$ for $i\\le r$; the components $y_i$ for $i>r$ are free, but the minimum-norm choice is $y_i = 0$. Then $x^* = V y = V\\Sigma^+ U^T b = A^+ b$. $\\blacksquare$</p>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Take $A = \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\\\ 0 & 0\\end{bmatrix},\\ b = \\begin{bmatrix} 2 \\\\ 3 \\\\ 1\\end{bmatrix}.$ Here $\\sigma_1 = 1,\\ \\sigma_2 = 0$, so $\\Sigma^+ = \\begin{bmatrix} 1 & 0 & 0\\\\ 0 & 0 & 0\\end{bmatrix}$. With $U=V=I$ (up to ordering), $A^+ = \\Sigma^+$ and $x^* = A^+ b = \\begin{bmatrix} 2 \\\\ 0\\end{bmatrix}$. Check $\\|Ax^* - b\\|^2 = \\|(2,0,0)-(2,3,1)\\|^2 = 10$, which equals $\\sigma_2$-and-beyond residual $\\sum_{i>1} c_i^2 = 9 + 1 = 10$.</div></div>'

+ '<div class="l-note"><strong>Frame for downstream use.</strong> When this same algebra is applied to a centered data matrix, one obtains principal component analysis. When applied to a covariance matrix $\\Sigma = (n-1)^{-1} X^T X$, the right singular vectors of $X$ coincide with the eigenvectors of $\\Sigma$ — these are the principal axes. The mathematics here is exactly Sections 2 and 7 applied to a specific input.</div>'

/* ============================================================
   SECTION 10: Klasik Alıştırmalar
   ============================================================ */
+ '<h2 class="l-title">10. Classical Exercises</h2>'

+ '<div class="calc-highlight">A small but representative set of pencil-and-paper problems. Treat each as a calculation, not a coding task. Verify $A = U\\Sigma V^T$ explicitly at the end of every problem.</div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 1 — $2\\times 2$ SVD by hand</div><div class="example-body">Compute the SVD of $A = \\begin{bmatrix} 3 & 0 \\\\ 4 & 5\\end{bmatrix}.$ Find $\\sigma_1, \\sigma_2$, the right singular vectors $v_1, v_2$, and the left singular vectors $u_1, u_2$. Verify $A = U\\Sigma V^T$.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 2 — Rectangular SVD</div><div class="example-body">Compute the full and the thin SVD of $A = \\begin{bmatrix} 1 & 2\\\\ 2 & 4\\\\ 3 & 6\\end{bmatrix}.$ Note that $\\operatorname{rank}(A)=1$. Write $A$ as a single rank-1 outer product $\\sigma_1 u_1 v_1^T$.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 3 — Best rank-1 approximation</div><div class="example-body">Let $A = \\begin{bmatrix} 4 & 0\\\\ 3 & -5\\end{bmatrix}.$ Compute its SVD and write down the best rank-1 approximation $A_1$. What is $\\|A - A_1\\|_F$? What is $\\|A - A_1\\|_2$?</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 4 — Pseudo-inverse</div><div class="example-body">For $A = \\begin{bmatrix} 1 & 1\\\\ 0 & 1\\\\ 1 & 0\\end{bmatrix}$ from Section 5, compute $A^+$. Then solve the least-squares problem $\\min_x \\|Ax - b\\|^2$ for $b = (1,1,1)^T$, and show $x^* = A^+ b$.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 5 — Matrix norms from singular values</div><div class="example-body">Let $\\sigma_1, \\dots, \\sigma_r$ be the singular values of $A$. Express $\\|A\\|_2$, $\\|A\\|_F$, $\\|A\\|_*$ (nuclear norm $\\sum \\sigma_i$), and $\\det(A)$ (if square) in terms of the $\\sigma_i$. Which of these are unitarily invariant?</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 6 — Condition number</div><div class="example-body">For an invertible $A$, prove $\\kappa_2(A) = \\sigma_1/\\sigma_n$ and that the relative error in solving $Ax = b$ satisfies $\\dfrac{\\|\\delta x\\|}{\\|x\\|} \\le \\kappa_2(A)\\,\\dfrac{\\|\\delta b\\|}{\\|b\\|}.$ Find a matrix with $\\kappa_2 = 10^4$ and check.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 7 — Eckart–Young verification</div><div class="example-body">Take $A = U\\Sigma V^T$ with $\\Sigma = \\operatorname{diag}(5, 3, 1)$ in a $3\\times 3$ orthogonal frame of your choice. Build the rank-2 approximation $A_2$ and verify directly that $\\|A - A_2\\|_F = 1$, $\\|A - A_2\\|_2 = 1$.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 8 — Polar decomposition</div><div class="example-body">Compute the polar decomposition $A = QP$ for $A = \\begin{bmatrix} 2 & -1\\\\ 1 & 2\\end{bmatrix}.$ Verify $Q^T Q = I$ and $P$ is symmetric PSD. Identify the rotation angle of $Q$ and the principal stretches in $P$.</div></div>'

+ '<div class="l-warn"><strong>Next lesson.</strong> Lesson 6 continues with structured decompositions and quadratic forms — Cholesky factorization, definiteness via eigenvalues of symmetric matrices, and the geometry of level sets of $x^T A x$.</div>',

/* ============================================================
   TURKISH TRANSLATION
   ============================================================ */

tr: '<p class="l-text"><strong>Tekil Değer Ayrışımı (SVD), doğrusal cebirdeki en genel ve geometrik olarak en şeffaf ayrışımdır.</strong> Özayrışım yalnızca kare matrislere uygulanır ve bazı durumlarda başarısız olur (defektif matrisler); SVD ise istisnasız her gerçek (ya da karmaşık) matris için geçerlidir ve daima iki ortogonal döndürme ile bir köşegen germe çarpımına ayrılır. Bir doğrusal dönüşümün geometrik içeriğinin en temiz ifadesidir.</p>'

+ '<p class="l-text">Bu ders SVD\\\'yi saf doğrusal cebirden geliştirir: simetrik / simetrik olmayan matrisler üzerinden motivasyon, $A^T A$\\\'ya spektral teoremin uygulanmasıyla türetim, döndürme-germe-döndürme geometrisi, Eckart–Young düşük rank yaklaşımı, polar ayrışım ve Moore–Penrose sözde tersi. Her teorem ya kanıtlanır ya da ana hatlarıyla verilir; her örnek elle çözülür.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Herhangi bir $m\\times n$ matris için SVD teoremini $A = U\\Sigma V^T$ ifade etmek ve kanıtlamak</li>'
+ '<li>Tekil değerleri ve tekil vektörleri $A^T A$\\\'nın özayrışımından türetmek</li>'
+ '<li>SVD\\\'yi, eksenlere paralel bir germe ile çevrelenmiş iki döndürme olarak geometrik yorumlamak</li>'
+ '<li>Küçük bir matrisin SVD\\\'sini baştan sona elle hesaplamak</li>'
+ '<li>Eckart–Young teoremini en iyi düşük rank yaklaşımı üzerine ifade etmek ve kanıtlamak</li>'
+ '<li>Polar ayrışımı $A = QP$ tanımlamak ve SVD ile bağlantısını kurmak</li>'
+ '<li>Moore–Penrose sözde tersini oluşturmak ve en küçük kareler için kullanmak</li>'
+ '<li>Frobenius ve spektral normları tekil değerlerden hesaplamak</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   BÖLÜM 1: Özdeğerlerden Tekil Değerlere
   ============================================================ */
+ '<h2 class="l-title">1. Özdeğerlerden Tekil Değerlere</h2>'

+ '<div class="calc-highlight"><strong>Motivasyon.</strong> Özayrışım $A = P D P^{-1}$, $A$\\\'nın kare olmasını ve özvektörlerinin tam bir baz oluşturmasını gerektirir. SVD her iki kısıtlamayı da kaldırır: herhangi bir dikdörtgen matris için tanımlıdır ve geometrik olarak daha açıklayıcıdır — her doğrusal dönüşüm iki döndürme ve bir köşegen germe çarpımına ayrılır.</div>'

+ '<p class="l-text">Spektral teoremden (Ders 4) hatırlayın: $S$, gerçek simetrik $n\\times n$ matris ise $\\mathbb{R}^n$\\\'nin bir ortonormal bazı $v_1,\\dots,v_n$ ve gerçek sayılar $\\lambda_1,\\dots,\\lambda_n$ vardır öyle ki</p>'

+ '<div class="calc-formula"><div class="formula-label">SPEKTRAL TEOREM (HATIRLATMA)</div><div class="formula-main">$$S = Q \\Lambda Q^T, \\qquad Q^T Q = I, \\qquad \\Lambda = \\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n).$$</div><div class="formula-sub">Simetrik matrisler için özvektörler ortonormal seçilebilir ve özdeğerler gerçektir.</div></div>'

+ '<p class="l-text">Genel (muhtemelen kare olmayan, muhtemelen simetrik olmayan) bir matris $A\\in\\mathbb{R}^{m\\times n}$ için bu temiz formda özayrışım yoktur. Ancak <em>her zaman</em> iki simetrik matris mevcuttur:</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">$A^T A$</div><div class="card-body">$n\\times n$ simetrik pozitif yarı-tanımlı matris. Özdeğerleri negatif olmayan gerçek sayılardır: $\\lambda_i \\ge 0$.</div></div><div class="calc-card"><div class="card-title">$A A^T$</div><div class="card-body">$m\\times m$ simetrik pozitif yarı-tanımlı matris. Sıfırdan farklı özdeğerleri $A^T A$\\\'nınkilerle çakışır.</div></div><div class="calc-card"><div class="card-title">Tekil değer</div><div class="card-body">$\\sigma_i := \\sqrt{\\lambda_i(A^T A)} \\ge 0.$ Bunlar $A$\\\'nın doğal <em>pozitif</em> germe katsayılarıdır.</div></div></div>'

+ '<p class="l-text"><strong>$A^T A$ neden simetrik pozitif yarı-tanımlıdır.</strong> Her $x\\in\\mathbb{R}^n$ için</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x^T (A^T A) x = (Ax)^T (Ax) = \\|Ax\\|^2 \\ge 0,$$</div><div class="formula-sub">dolayısıyla $A^T A$\\\'nın tüm özdeğerleri negatif değildir. $\\|Ax\\|^2 = 0$ olması ancak ve ancak $x \\in \\ker A$ ise gerçekleşir.</div></div>'

+ '<div class="l-note"><strong>Ana fikir.</strong> Tekil değerler $A$\\\'nın birim vektörleri ne kadar gerdiğini ölçer. $\\|Av\\|^2 = v^T A^T A\\, v$ olduğundan, birim vektörler üzerinde maksimum germe $\\sqrt{\\lambda_{\\max}(A^T A)} = \\sigma_1$\\\'e eşittir — en büyük tekil değer. Buna spektral norm $\\|A\\|_2$ de denir.</div>'

+ '<div class="think-box"><div class="think-label">ALIŞTIRMA</div><div class="think-body">$A^T A$ ve $A A^T$ matrislerinin sıfırdan farklı aynı özdeğerlere sahip olduğunu gösterin. <em>İpucu: $A^T A v = \\lambda v$ ve $\\lambda \\ne 0$ ise, $w = Av$ alın ve $A A^T w$\\\'yi hesaplayın.</em></div></div>'

/* ============================================================
   BÖLÜM 2: SVD Teoremi
   ============================================================ */
+ '<h2 class="l-title">2. SVD Teoremi</h2>'

+ '<div class="calc-highlight"><strong>İfade.</strong> Her gerçek $m\\times n$ matris $A = U\\Sigma V^T$ olarak ayrılır; $U\\in\\mathbb{R}^{m\\times m}$ ve $V\\in\\mathbb{R}^{n\\times n}$ ortogonaldir ve $\\Sigma\\in\\mathbb{R}^{m\\times n}$ negatif olmayan girdileri $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$ olan köşegen bir matristir.</div>'

+ '<div class="calc-formula"><div class="formula-label">SVD — TAM BİÇİM</div><div class="formula-main">$$A = U\\,\\Sigma\\,V^T, \\qquad U^T U = I_m, \\qquad V^T V = I_n.$$</div><div class="formula-sub">$U$\\\'nun sütunları sol tekil vektörler; $V$\\\'nin sütunları sağ tekil vektörler; $\\sigma_i$ tekil değerlerdir.</div></div>'

+ '<p class="l-text"><strong>Varlık kanıtı (taslak).</strong> Simetrik PSD matrisi $A^T A$\\\'ya spektral teoremi uygulayın:</p>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A^T A$\\\'nın spektral ayrışımı</div><div class="step-detail">$\\mathbb{R}^n$\\\'nin bir ortonormal bazı $v_1,\\dots,v_n$ ve gerçek sayılar $\\lambda_1 \\ge \\dots \\ge \\lambda_n \\ge 0$ vardır öyle ki $A^T A\\,v_i = \\lambda_i v_i$. Sıfır olmayan $\\lambda_i$ sayısı $r$ olsun (yani $r = \\operatorname{rank}(A)$).</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Tekil değerleri ve sol tekil vektörleri tanımla</div><div class="step-detail">$\\sigma_i = \\sqrt{\\lambda_i}$ alın ve $i \\le r$ için $u_i := \\dfrac{1}{\\sigma_i} A v_i \\in \\mathbb{R}^m$ tanımlayın.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\{u_i\\}$ ortonormaldir</div><div class="step-detail">$\\langle u_i, u_j\\rangle = \\dfrac{1}{\\sigma_i\\sigma_j}\\langle Av_i, Av_j\\rangle = \\dfrac{1}{\\sigma_i\\sigma_j} v_i^T A^T A v_j = \\dfrac{\\lambda_j}{\\sigma_i\\sigma_j}\\langle v_i,v_j\\rangle = \\delta_{ij}.$</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$\\{u_i\\}_{i\\le r}$\\\'yi $\\mathbb{R}^m$\\\'nin ortonormal bazına genişlet</div><div class="step-detail">Gram–Schmidt ile $u_{r+1},\\dots,u_m$\\\'yi $(\\operatorname{im} A)^\\perp = \\ker A^T$ içinden seçin. $U=[u_1|\\dots|u_m]$, $V=[v_1|\\dots|v_n]$ oluşturun.</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">$A = U\\Sigma V^T$ olduğunu doğrula</div><div class="step-detail">İnşa gereği $Av_i = \\sigma_i u_i$ ($i\\le r$) ve $Av_i = 0$ ($i>r$). Dolayısıyla $AV = U\\Sigma$ ve sağdan $V^T$ ile çarparsak $A = U\\Sigma V^T$ elde edilir. $\\blacksquare$</div></div></div></div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">Tekil değerler $\\sigma_i$ <strong>tektir</strong>. Tekil vektörler işaret seçimine kadar (ve $\\sigma_i$\\\'nin katlılığı $>1$ ise özuzaylar içindeki döndürmelere kadar) tektir.</div></div><div class="calc-card"><div class="card-title">İnce (indirgenmiş) SVD</div><div class="card-body">Sadece $r=\\operatorname{rank}(A)$ tane sıfırdan farklı $\\sigma_i$\\\'yi tutun: $A = U_r \\Sigma_r V_r^T$ ile $U_r\\in\\mathbb{R}^{m\\times r}$, $\\Sigma_r\\in\\mathbb{R}^{r\\times r}$, $V_r\\in\\mathbb{R}^{n\\times r}$.</div></div><div class="calc-card"><div class="card-title">Dış çarpım biçimi</div><div class="card-body">$A = \\sum_{i=1}^{r} \\sigma_i\\, u_i v_i^T$ — tekil değerlerle ağırlıklandırılmış rank-1 matrislerin toplamı.</div></div><div class="calc-card"><div class="card-title">Dört temel altuzay</div><div class="card-body">$\\{v_1,\\dots,v_r\\}$ satır uzayının bazı; $\\{v_{r+1},\\dots,v_n\\}$ $\\ker A$\\\'nın bazı; $\\{u_1,\\dots,u_r\\}$ $\\operatorname{im} A$\\\'nın bazı; $\\{u_{r+1},\\dots,u_m\\}$ $\\ker A^T$\\\'nin bazı.</div></div></div>'

+ '<div class="l-note"><strong>Özayrışımla bağlantı.</strong> $A$ simetrik, özdeğerleri $\\lambda_i$ ve ortonormal özvektörleri varsa, SVD\\\'si $A = Q\\,|\\Lambda|\\,(\\operatorname{sgn}(\\Lambda)Q)^T$ olur, yani $\\sigma_i = |\\lambda_i|$. Genel bir $A$ için SVD işaret ve döndürme bilgisini ayrı ayrı temizce sıyırır.</div>'

/* ============================================================
   BÖLÜM 3: Geometrik Yorum
   ============================================================ */
+ '<h2 class="l-title">3. Geometrik Yorum: Döndürme – Germe – Döndürme</h2>'

+ '<div class="calc-highlight"><strong>Her doğrusal dönüşüm üç adımdır:</strong> girdiyi döndür ($V^T$), koordinat eksenleri boyunca ger ($\\Sigma$), sonucu döndür ($U$). SVD budur.</div>'

+ '<p class="l-text">$A = U\\Sigma V^T$\\\'yi sağdan sola okuyunca $x \\mapsto Ax$ dönüşümü şöyle ayrılır:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x \\;\\xrightarrow{V^T}\\; V^T x \\;\\xrightarrow{\\Sigma}\\; \\Sigma V^T x \\;\\xrightarrow{U}\\; U\\Sigma V^T x = Ax.$$</div></div>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$V^T$: girdi döndürmesi</div><div class="step-detail">$V^T$ ortogonal olduğundan $\\mathbb{R}^n$\\\'yi rijit biçimde döndürür (belki yansıtır). Baz vektörler $v_1,\\dots,v_n$ standart baza $e_1,\\dots,e_n$\\\'ye taşınır.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\Sigma$: eksenlere paralel germe</div><div class="step-detail">$\\Sigma$ köşegendir: $i$. koordinatı $\\sigma_i$ ile ölçekler. Her eksen boyunca uzunluklar ilgili tekil değerle çarpılır. Uzunlukları değiştiren tek adım budur.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$U$: çıktı döndürmesi</div><div class="step-detail">$U$ $\\mathbb{R}^m$\\\'yi ortogonal döndürür, $e_1,\\dots,e_r$\\\'yi $u_1,\\dots,u_r$\\\'ye gönderir. Gerilmiş eksenler sol tekil vektörlerin yönlerine yerleştirilir.</div></div></div></div>'

+ '<p class="l-text"><strong>Birim kürenin görüntüsü.</strong> $S^{n-1} = \\{x \\in \\mathbb{R}^n : \\|x\\|=1\\}$ olsun. O zaman $A(S^{n-1})$, $\\operatorname{im} A$ içindeki kapalı elipsoiddir; yarı-eksenleri $\\sigma_1 u_1, \\sigma_2 u_2, \\dots, \\sigma_r u_r$\\\'dir. SVD\\\'nin geometrik resmi budur.</p>'

/* --- Plotly: Geometric SVD — unit circle to ellipse (TR) --- */
+ '<div id="plot-svd-geometry-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var theta=[];for(var i=0;i<=120;i++)theta.push(2*Math.PI*i/120);'
+ 'var cx=theta.map(function(t){return Math.cos(t)});'
+ 'var cy=theta.map(function(t){return Math.sin(t)});'
+ 'var s1=3,s2=1.2,angle=Math.PI/6;'
+ 'var cosA=Math.cos(angle),sinA=Math.sin(angle);'
+ 'var ex=theta.map(function(t){var x=s1*Math.cos(t),y=s2*Math.sin(t);return cosA*x-sinA*y;});'
+ 'var ey=theta.map(function(t){var x=s1*Math.cos(t),y=s2*Math.sin(t);return sinA*x+cosA*y;});'
+ 'var t1={x:cx,y:cy,mode:"lines",name:"Birim kure S^{n-1}",line:{color:"#4ecdc4",width:2}};'
+ 'var t2={x:ex,y:ey,mode:"lines",name:"Goruntu A(S^{n-1}) (elips)",line:{color:"#c8a96e",width:3}};'
+ 'var t3={x:[0,cosA*s1],y:[0,sinA*s1],mode:"lines+markers",name:"sigma_1 u_1",line:{color:"#f87171",width:2,dash:"dash"},marker:{size:[4,8]}};'
+ 'var t4={x:[0,-sinA*s2],y:[0,cosA*s2],mode:"lines+markers",name:"sigma_2 u_2",line:{color:"#a78bfa",width:2,dash:"dash"},marker:{size:[4,8]}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4],title:"x",scaleanchor:"y"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4],title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:"h",y:-0.18,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-svd-geometry-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Birim çember (turkuaz) elipse (altın) eşlenir. Yarı-eksenlerin uzunlukları $\\sigma_1$ ve $\\sigma_2$\\\'dir ve sol tekil vektörler $u_1, u_2$ yönündedir. SVD: girdiyi döndür ($V^T$), her eksen boyunca $\\sigma_i$ ile ger ($\\Sigma$), $u_i$ çatısına döndür ($U$).</div></div>'

+ '<div class="think-box"><div class="think-label">ALIŞTIRMA</div><div class="think-body">Tüm $\\sigma_i$ aynı $c>0$ değerine eşit ise $A$\\\'nın geometrik şekli nedir? <em>Cevap: $A = c\\,UV^T$ ve $UV^T$ ortogonaldir, yani $A$ döndürme ile bileşke biçiminde tekdüze $c$ ölçeklemesi gibi davranır. Birim küre yarıçapı $c$ olan bir küreye eşlenir.</em></div></div>'

/* ============================================================
   BÖLÜM 4: A^T A Üzerinden SVD Hesabı
   ============================================================ */
+ '<h2 class="l-title">4. $A^T A$ Üzerinden SVD Hesabı</h2>'

+ '<div class="calc-highlight">SVD\\\'nin kanıtı aynı zamanda bir reçetedir. $A^T A$\\\'yı köşegenleştirerek $V$\\\'yi ve $\\sigma_i^2$\\\'leri elde edin; $\\sigma_i > 0$ için $u_i = \\sigma_i^{-1} A v_i$ ile $u_i$\\\'leri kurtarın; $\\mathbb{R}^m$\\\'nin tam ortonormal bazına genişletin.</div>'

+ '<div class="calc-formula"><div class="formula-label">ÖZAYRIŞIM–SVD KÖPRÜSÜ</div><div class="formula-main">$$A^T A = V \\Sigma^T \\Sigma V^T, \\qquad A A^T = U \\Sigma \\Sigma^T U^T.$$</div><div class="formula-sub">$A^T A$\\\'nın özdeğerleri $\\sigma_i^2$\\\'dir; özvektörleri $V$\\\'nin sütunlarıdır. $AA^T$ ve $U$ için benzer.</div></div>'

+ '<p class="l-text"><strong>Algoritma (elle, küçük matrisler).</strong></p>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A^T A$\\\'yı oluştur</div><div class="step-detail">$n\\times n$ simetrik PSD matristir.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\det(A^T A - \\lambda I) = 0$\\\'ı çöz</div><div class="step-detail">Kökler $\\lambda_i \\ge 0$. Sırala $\\lambda_1 \\ge \\dots \\ge \\lambda_n$ ve $\\sigma_i = \\sqrt{\\lambda_i}$ al.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Ortonormal özvektörleri $v_i$ bul</div><div class="step-detail">Her $\\lambda_i$ için $(A^T A - \\lambda_i I) v = 0$ çöz. Normalize et. Katlı özdeğer durumunda Gram–Schmidt ile ortogonalleştir.</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$\\sigma_i > 0$ için $u_i = \\sigma_i^{-1} A v_i$ hesapla</div><div class="step-detail">Bunlar otomatik olarak ortonormaldir (Bölüm 2\\\'de kanıtlandı). $\\sigma_i = 0$ ise $u_i$ serbesttir; $\\mathbb{R}^m$\\\'nin ortonormal bazını tamamlayacak şekilde seçin.</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Topla ve doğrula</div><div class="step-detail">$U=[u_1|\\dots|u_m]$, $V=[v_1|\\dots|v_n]$, $\\Sigma=\\operatorname{diag}(\\sigma_i)$ $m\\times n$ olacak şekilde sıfırla doldurulmuş. $A \\stackrel{?}{=} U\\Sigma V^T$ kontrol edin.</div></div></div></div>'

+ '<div class="l-note"><strong>Sayısal gerçeklik.</strong> $A^T A$\\\'yı açıkça oluşturmak sayısal olarak zayıf olabilir: koşul sayısı karelenir. Endüstriyel SVD algoritmaları (Golub–Reinsch, tek-yan Jacobi, rastgele SVD) bundan kaçınır. $A^T A$ yolu anlamak ve elle hesaplamak içindir.</div>'

/* ============================================================
   BÖLÜM 5: Çalışılmış Örnek — 3x2 Matris
   ============================================================ */
+ '<h2 class="l-title">5. Çalışılmış Örnek — $3\\times 2$ Matrisin SVD\\\'si</h2>'

+ '<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body">$A = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$ matrisinin SVD\\\'sini hesaplayın. $U\\in\\mathbb{R}^{3\\times 3}$, $\\Sigma\\in\\mathbb{R}^{3\\times 2}$, $V\\in\\mathbb{R}^{2\\times 2}$\\\'yi bulun ve $A = U\\Sigma V^T$ olduğunu doğrulayın.</div></div>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A^T A$\\\'yı oluştur</div><div class="step-detail">$$A^T A = \\begin{bmatrix}1 & 0 & 1\\\\ 1 & 1 & 0\\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}.$$</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$A^T A$\\\'nın özdeğerleri</div><div class="step-detail">$\\det\\!\\begin{bmatrix} 2-\\lambda & 1 \\\\ 1 & 2-\\lambda \\end{bmatrix} = (2-\\lambda)^2 - 1 = \\lambda^2 - 4\\lambda + 3 = (\\lambda-3)(\\lambda-1) = 0.$ Yani $\\lambda_1 = 3,\\ \\lambda_2 = 1$ ve $\\sigma_1 = \\sqrt{3},\\ \\sigma_2 = 1.$</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sağ tekil vektörler $v_i$</div><div class="step-detail">$\\lambda=3$ için: $(A^T A - 3I)v = \\begin{bmatrix}-1 & 1\\\\ 1 & -1\\end{bmatrix}v = 0 \\Rightarrow v_1 = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ 1\\end{bmatrix}.$<br>$\\lambda=1$ için: $v_2 = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ -1\\end{bmatrix}.$</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Sol tekil vektörler $u_i = \\sigma_i^{-1} A v_i$</div><div class="step-detail">$u_1 = \\dfrac{1}{\\sqrt{3}}A v_1 = \\dfrac{1}{\\sqrt{6}}\\begin{bmatrix} 2 \\\\ 1 \\\\ 1\\end{bmatrix}, \\qquad u_2 = \\dfrac{1}{1}A v_2 = \\dfrac{1}{\\sqrt{2}}\\begin{bmatrix} 0 \\\\ -1 \\\\ 1\\end{bmatrix}.$<br>Doğrula: $\\|u_1\\| = \\sqrt{(4+1+1)/6} = 1,\\ \\|u_2\\| = 1,\\ \\langle u_1,u_2\\rangle = \\tfrac{1}{\\sqrt{12}}(0-1+1) = 0.$</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">$u_3$\\\'e genişlet</div><div class="step-detail">$u_3$, $\\mathbb{R}^3$\\\'te $u_1, u_2$\\\'ye dik birim vektördür. Vektörel çarpımdan $u_3 = u_1 \\times u_2 = \\dfrac{1}{\\sqrt{3}}\\begin{bmatrix} 1 \\\\ -1 \\\\ -1\\end{bmatrix}$ (normalize edilmiş).</div></div></div><div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Topla</div><div class="step-detail">$$U = \\begin{bmatrix} 2/\\sqrt{6} & 0 & 1/\\sqrt{3}\\\\ 1/\\sqrt{6} & -1/\\sqrt{2} & -1/\\sqrt{3}\\\\ 1/\\sqrt{6} & 1/\\sqrt{2} & -1/\\sqrt{3} \\end{bmatrix},\\quad \\Sigma = \\begin{bmatrix} \\sqrt{3} & 0\\\\ 0 & 1\\\\ 0 & 0\\end{bmatrix},\\quad V = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1\\\\ 1 & -1\\end{bmatrix}.$$</div></div></div><div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">$A = U\\Sigma V^T$\\\'yi doğrula</div><div class="step-detail">$\\Sigma V^T = \\begin{bmatrix} \\sqrt{3}/\\sqrt{2} & \\sqrt{3}/\\sqrt{2}\\\\ 1/\\sqrt{2} & -1/\\sqrt{2}\\\\ 0 & 0\\end{bmatrix}$\\\'yi hesaplayın. Sonra $U\\cdot (\\Sigma V^T)$ satır satır çarpımı $\\begin{bmatrix} 1 & 1\\\\ 0 & 1\\\\ 1 & 0\\end{bmatrix} = A$\\\'yı verir. $\\checkmark$</div></div></div></div>'

+ '<div class="l-note"><strong>Rank kontrolü.</strong> Her iki tekil değer de sıfırdan farklıdır, yani $\\operatorname{rank}(A) = 2$. $U$\\\'nun üçüncü sütunu $\\ker A^T$\\\'tedir ve ince SVD\\\'de görünmez.</div>'

/* ============================================================
   BÖLÜM 6: Tekil Değerler, Rank, Normlar, Koşul Sayısı
   ============================================================ */
+ '<h2 class="l-title">6. Tekil Değerler, Rank, Normlar, Koşul Sayısı</h2>'

+ '<div class="calc-highlight">Tekil değerler $A$\\\'nın hemen her niceliksel değişmezini kodlar: rank, Frobenius normu, spektral norm, koşul sayısı ve $A$ ile daha düşük ranklı matrisler arasındaki uzaklık.</div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Rank</div><div class="card-body">$\\operatorname{rank}(A) = \\#\\{i : \\sigma_i > 0\\}$. Sayısal olarak kararlı tanım budur (bir tolerans üstündeki $\\sigma_i$\\\'leri say).</div></div><div class="calc-card"><div class="card-title">Spektral norm</div><div class="card-body">$\\|A\\|_2 = \\sigma_1$ — en büyük tekil değer. Eşdeğer biçimde operatör normu $\\sup_{\\|x\\|=1}\\|Ax\\|$.</div></div><div class="calc-card"><div class="card-title">Frobenius normu</div><div class="card-body">$\\|A\\|_F = \\sqrt{\\sum_i \\sigma_i^2} = \\sqrt{\\operatorname{tr}(A^T A)}.$ Birim ortogonal değişimler altında değişmez.</div></div><div class="calc-card"><div class="card-title">Koşul sayısı</div><div class="card-body">$\\kappa_2(A) = \\sigma_1/\\sigma_r$ (tam ranklı $A$ için). $A^{-1}b$\\\'nin perturbasyona duyarlılığını ölçer.</div></div></div>'

+ '<p class="l-text"><strong>$\\|A\\|_F^2 = \\sum \\sigma_i^2$\\\'nin kanıtı.</strong> $\\|M\\|_F^2 = \\operatorname{tr}(M^T M)$ ve SVD kullanılarak,</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\|A\\|_F^2 = \\operatorname{tr}(V\\Sigma^T U^T U \\Sigma V^T) = \\operatorname{tr}(V \\Sigma^T \\Sigma V^T) = \\operatorname{tr}(\\Sigma^T \\Sigma) = \\sum_{i=1}^{\\min(m,n)} \\sigma_i^2.$$</div><div class="formula-sub">İz, ortogonal benzerlik altında değişmezdir ve karelenmiş tekil değerlerin toplamıdır.</div></div>'

+ '<p class="l-text"><strong>$\\sigma_1 = \\|A\\|_2$ neden geçerli.</strong> Birim $x$ için $x = \\sum c_i v_i$ yazın, $\\sum c_i^2 = 1$. O zaman $Ax = \\sum c_i \\sigma_i u_i$ ve $\\|Ax\\|^2 = \\sum c_i^2 \\sigma_i^2 \\le \\sigma_1^2$; eşitlik $x = v_1$\\\'de.</p>'

/* --- Plotly: singular value spectrum (TR) --- */
+ '<div id="plot-sv-spectrum-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sv=[10,6,3.5,2,1.2,0.8,0.5,0.3,0.15,0.08,0.04,0.02,0.01,0.005,0.002];'
+ 'var idx=sv.map(function(v,i){return i+1;});'
+ 'var sv2=sv.map(function(v){return v*v;});'
+ 'var total=sv2.reduce(function(a,b){return a+b;},0);'
+ 'var cum=[];var s=0;sv2.forEach(function(v){s+=v;cum.push(100*s/total);});'
+ 'var t1={x:idx,y:sv,type:"bar",name:"sigma_i",marker:{color:"#c8a96e"}};'
+ 'var t2={x:idx,y:cum,type:"scatter",mode:"lines+markers",name:"Birikimli enerji (%)",yaxis:"y2",line:{color:"#4ecdc4",width:2},marker:{size:6}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Indeks i",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"sigma_i",side:"left"},yaxis2:{title:"Birikimli enerji (%)",side:"right",overlaying:"y",range:[0,105],gridcolor:"rgba(255,255,255,0.03)"},margin:{t:30,r:60,b:60,l:60},showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-sv-spectrum-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Tekil değerler tipik olarak azalır (altın bar). $\\sigma_i^2$\\\'lerin birikimli toplamı (turkuaz) yalnızca birkaç terimle $\\|A\\|_F^2$\\\'nin çoğuna ulaşır — düşük rank yaklaşımının niceliksel dayanağı.</div></div>'

/* ============================================================
   BÖLÜM 7: Düşük Rank Yaklaşımı — Eckart–Young
   ============================================================ */
+ '<h2 class="l-title">7. Düşük Rank Yaklaşımı: Eckart–Young Teoremi</h2>'

+ '<div class="calc-highlight"><strong>İfade.</strong> Rankı $\\le k$ olan tüm $B$ matrisleri arasında, kesilmiş SVD $A_k = \\sum_{i=1}^{k} \\sigma_i u_i v_i^T$ hem $\\|A - B\\|_2$\\\'yi hem de $\\|A - B\\|_F$\\\'yi minimize eder.</div>'

+ '<div class="calc-formula"><div class="formula-label">ECKART–YOUNG (–MIRSKY)</div><div class="formula-main">$$\\min_{\\operatorname{rank}(B) \\le k} \\|A - B\\|_2 = \\sigma_{k+1}, \\qquad \\min_{\\operatorname{rank}(B) \\le k} \\|A - B\\|_F = \\sqrt{\\sum_{i=k+1}^{r} \\sigma_i^2}.$$</div><div class="formula-sub">Her iki minimum da kesilmiş SVD $A_k$ tarafından ulaşılır.</div></div>'

+ '<p class="l-text"><strong>Kanıt taslağı (Frobenius normu).</strong> Frobenius normunun birim ortogonal değişimler altında değişmez olduğunu kullanın: $\\|U^T M V\\|_F = \\|M\\|_F$ (ortogonal $U,V$). Dolayısıyla</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\|A - B\\|_F = \\|U^T(A-B)V\\|_F = \\|\\Sigma - \\tilde B\\|_F, \\qquad \\tilde B := U^T B V.$$</div></div>'

+ '<p class="l-text">$\\tilde B$\\\'nin rankı $\\le k$\\\'dir ve $\\Sigma$ köşegen $\\sigma_i$ girdileriyle. $\\|\\Sigma - \\tilde B\\|_F$\\\'yi rank-$k$ matrisler üzerinde minimize etmek, hangi $k$ köşegen girdiyi tam eşleştireceğimizi seçmekle aynıdır; geri kalanlar hataya $\\sigma_i^2$ katar. Minimum, en büyük $k$ değeri tutarak alınır ve hata $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$\\\'dir. $\\blacksquare$</p>'

+ '<p class="l-text"><strong>Kanıt taslağı (spektral norm).</strong> Rank $\\le k$ olan herhangi bir $B$ için $\\ker B$\\\'nin boyutu $\\ge n - k$\\\'dir. $\\operatorname{span}\\{v_1,\\dots,v_{k+1}\\}$ (boyut $k+1$) ile kesişimi alın: boyut argümanıyla kesişim bir birim vektör $x$ içerir. O zaman $Bx = 0$ ve $Ax = \\sum_{i=1}^{k+1} \\langle x,v_i\\rangle \\sigma_i u_i$\\\'nin normu $\\|Ax\\| \\ge \\sigma_{k+1}\\|x\\| = \\sigma_{k+1}$\\\'dir. Dolayısıyla $\\|A - B\\|_2 \\ge \\sigma_{k+1}$, ki $B = A_k$ ile gerçekleşir. $\\blacksquare$</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Kesim hatası</div><div class="card-body">$\\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\dots + \\sigma_r^2.$ İhmal edilen enerji tam olarak kuyruk tekil değerlerin karelerinin toplamıdır.</div></div><div class="calc-card"><div class="card-title">Enerji yakalama</div><div class="card-body">$\\dfrac{\\|A_k\\|_F^2}{\\|A\\|_F^2} = \\dfrac{\\sum_{i=1}^k \\sigma_i^2}{\\sum_{i=1}^r \\sigma_i^2}$ — rank-$k$ yaklaşımının koruduğu $\\|A\\|_F^2$ oranı.</div></div><div class="calc-card"><div class="card-title">Optimallik tamdır</div><div class="card-body">Hiçbir rank-$k$ matris ne Frobenius ne spektral normda daha iyi olamaz. SVD <em>bir</em> düşük rank yaklaşımı değil, <em>en iyi</em> düşük rank yaklaşımıdır.</div></div><div class="calc-card"><div class="card-title">Kısa uygulama notu</div><div class="card-body">Bu teorem boyut indirgemenin (ör. merkezlenmiş veri matrisinin kesilmiş SVD\\\'si olarak okunan temel bileşen analizi) matematiksel temelidir. Bu derste PCA, Eckart–Young\\\'ın yeniden okunmasından ibarettir.</div></div></div>'

/* --- Plotly: reconstruction error vs rank (TR) --- */
+ '<div id="plot-recon-error-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sv=[10,6,3.5,2,1.2,0.8,0.5,0.3,0.15,0.08,0.04,0.02,0.01,0.005,0.002];'
+ 'var sv2=sv.map(function(v){return v*v;});'
+ 'var err=[];for(var k=1;k<=sv.length;k++){var rem=0;for(var j=k;j<sv.length;j++)rem+=sv2[j];err.push(Math.sqrt(rem));}'
+ 'var idx=sv.map(function(v,i){return i+1;});'
+ 'var t1={x:idx,y:err,mode:"lines+markers",name:"||A - A_k||_F",line:{color:"#f87171",width:2},marker:{size:6}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Rank k",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Frobenius hata"},margin:{t:30,r:30,b:60,l:60},showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-recon-error-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Eckart–Young iş başında: $\\|A - A_k\\|_F$ $k$\\\'ye göre monoton azalır ve formülü $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$\\\'dir. Grafik her rankta en küçük ulaşılabilir Frobenius hatasını gösterir.</div></div>'

/* ============================================================
   BÖLÜM 8: Polar Ayrışım
   ============================================================ */
+ '<h2 class="l-title">8. Polar Ayrışım</h2>'

+ '<div class="calc-highlight">Her kare matris <em>ortogonal</em> $\\times$ <em>simetrik PSD</em> olarak ayrılır. Bu, bir karmaşık sayıyı $r e^{i\\theta}$ olarak yazmanın matris karşılığıdır ve doğrudan SVD\\\'den gelir.</div>'

+ '<div class="calc-formula"><div class="formula-label">POLAR AYRIŞIM</div><div class="formula-main">$$A = Q P, \\qquad Q \\text{ ortogonal}, \\quad P = (A^T A)^{1/2} \\text{ simetrik PSD}.$$</div><div class="formula-sub">Tersinir kare $A$ için $Q$ ve $P$ tektir.</div></div>'

+ '<p class="l-text"><strong>SVD\\\'den türetim.</strong> $A = U\\Sigma V^T$ ile $A\\in\\mathbb{R}^{n\\times n}$ olsun. Tanımlayın</p>'

+ '<div class="calc-formula"><div class="formula-main">$$Q := U V^T, \\qquad P := V \\Sigma V^T.$$</div></div>'

+ '<p class="l-text">O zaman $Q$ ortogonal matrislerin çarpımı olduğundan ortogonaldir. $P = V\\Sigma V^T$ simetriktir ve özdeğerleri $\\sigma_i \\ge 0$ olduğundan simetrik PSD\\\'dir. Sonuçta</p>'

+ '<div class="calc-formula"><div class="formula-main">$$Q P = U V^T \\cdot V \\Sigma V^T = U \\Sigma V^T = A.$$</div></div>'

+ '<p class="l-text">Çarpan $P$, $P^2 = V\\Sigma^2 V^T = A^T A$ sağlar, yani $P = (A^T A)^{1/2}$ — tek PSD karekök.</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Sol polar biçim</div><div class="card-body">Eşdeğer biçimde $A = P\\,\\prime\\, Q$ ile $P' = U\\Sigma U^T = (A A^T)^{1/2}$. Ortogonal çarpan aynıdır.</div></div><div class="calc-card"><div class="card-title">Geometrik anlam</div><div class="card-body">$A$ önce $V$\\\'nin temel eksenleri boyunca $P$ ile gerer, sonra $Q$ ile döndürür. Simetrik PSD "sadece germe"; ortogonal "sadece döndürme"dir.</div></div><div class="calc-card"><div class="card-title">En yakın ortogonal matris</div><div class="card-body">Tersinir $A$ için $Q = UV^T$, Frobenius normunda $A$\\\'ya en yakın ortogonal matristir — sürekli mekanikte, bilgisayar grafiğinde ve Procrustes hizalamada kullanılır.</div></div></div>'

/* ============================================================
   BÖLÜM 9: Sözde Ters ve En Küçük Kareler
   ============================================================ */
+ '<h2 class="l-title">9. Moore–Penrose Sözde Tersi ve En Küçük Kareler</h2>'

+ '<div class="calc-highlight">Sözde ters $A^+$, matris tersini kare olmayan ve rank-eksik matrislere genişletir. SVD ile tanımlanır ve en küçük kareler / minimum-norm problemini temizce çözer.</div>'

+ '<div class="calc-formula"><div class="formula-label">SVD ÜZERİNDEN SÖZDE TERS</div><div class="formula-main">$$A = U\\Sigma V^T \\quad\\Longrightarrow\\quad A^+ = V\\,\\Sigma^+\\,U^T,$$</div><div class="formula-sub">burada $\\Sigma^+$, $\\Sigma^T$\\\'den her sıfırdan farklı $\\sigma_i$\\\'yi $1/\\sigma_i$ ile değiştirerek elde edilen $n\\times m$ matristir.</div></div>'

+ '<p class="l-text"><strong>Moore–Penrose koşulları.</strong> $A^+$, aşağıdaki dört koşulu sağlayan tek matristir:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$A A^+ A = A, \\quad A^+ A A^+ = A^+, \\quad (A A^+)^T = A A^+, \\quad (A^+ A)^T = A^+ A.$$</div></div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Kare tersinir</div><div class="card-body">$A$ tersinirse $A^+ = A^{-1}$.</div></div><div class="calc-card"><div class="card-title">Uzun tam ranklı ($m>n$, rank $n$)</div><div class="card-body">$A^+ = (A^T A)^{-1} A^T$. Klasik en küçük kareler normal denklem çözücüsü.</div></div><div class="calc-card"><div class="card-title">Geniş tam ranklı ($m<n$, rank $m$)</div><div class="card-body">$A^+ = A^T (A A^T)^{-1}$. Minimum-norm çözüm verir.</div></div><div class="calc-card"><div class="card-title">Rank eksik</div><div class="card-body">SVD tanımı yine çalışır; yalnızca sıfırdan farklı $\\sigma_i$ ters çevrilir. Diğer formüller başarısız olabilir.</div></div></div>'

+ '<p class="l-text"><strong>En küçük kareler teoremi.</strong> Her $A\\in\\mathbb{R}^{m\\times n}$ ve $b\\in\\mathbb{R}^m$ için</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x^* := A^+ b$$</div></div>'

+ '<p class="l-text">$\\|Ax - b\\|^2$\\\'nin (tek) en küçük norma sahip minimize edicisidir.</p>'

+ '<p class="l-text"><em>Kanıt taslağı.</em> $b = U c$ yazın. $\\|Ax-b\\|^2 = \\|\\Sigma V^T x - c\\|^2 = \\|\\Sigma y - c\\|^2$ ile $y = V^T x$. Bileşen bazında $\\sum (\\sigma_i y_i - c_i)^2 + \\sum_{i>r} c_i^2$. Minimum için $i\\le r$ ise $y_i = c_i/\\sigma_i$; $i>r$ için $y_i$ serbesttir ama minimum-norm seçim $y_i = 0$. O zaman $x^* = V y = V\\Sigma^+ U^T b = A^+ b$. $\\blacksquare$</p>'

+ '<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK</div><div class="example-body">$A = \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\\\ 0 & 0\\end{bmatrix},\\ b = \\begin{bmatrix} 2 \\\\ 3 \\\\ 1\\end{bmatrix}$ alın. Burada $\\sigma_1 = 1,\\ \\sigma_2 = 0$, dolayısıyla $\\Sigma^+ = \\begin{bmatrix} 1 & 0 & 0\\\\ 0 & 0 & 0\\end{bmatrix}$. $U=V=I$ (sıraya göre) ile $A^+ = \\Sigma^+$ ve $x^* = A^+ b = \\begin{bmatrix} 2 \\\\ 0\\end{bmatrix}$. Kontrol: $\\|Ax^* - b\\|^2 = \\|(2,0,0)-(2,3,1)\\|^2 = 10$; $\\sigma_2$ ve sonrasına karşılık gelen kalıntı $\\sum_{i>1} c_i^2 = 9 + 1 = 10$.</div></div>'

+ '<div class="l-note"><strong>İleri kullanım çerçevesi.</strong> Aynı cebir merkezlenmiş bir veri matrisine uygulandığında temel bileşen analizi elde edilir. Kovaryans matrisi $\\Sigma = (n-1)^{-1} X^T X$\\\'e uygulandığında, $X$\\\'in sağ tekil vektörleri $\\Sigma$\\\'nın özvektörleriyle çakışır — bunlar temel eksenlerdir. Buradaki matematik tam olarak Bölüm 2 ve 7\\\'nin belirli bir girdiye uygulanmasıdır.</div>'

/* ============================================================
   BÖLÜM 10: Klasik Alıştırmalar
   ============================================================ */
+ '<h2 class="l-title">10. Klasik Alıştırmalar</h2>'

+ '<div class="calc-highlight">Küçük ama temsili bir kâğıt-kalem problem kümesi. Her birini bir hesap olarak ele alın, kodlama görevi olarak değil. Her problemin sonunda $A = U\\Sigma V^T$\\\'yi açıkça doğrulayın.</div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — Elle $2\\times 2$ SVD</div><div class="example-body">$A = \\begin{bmatrix} 3 & 0 \\\\ 4 & 5\\end{bmatrix}$\\\'in SVD\\\'sini hesaplayın. $\\sigma_1, \\sigma_2$\\\'yi, sağ tekil vektörleri $v_1, v_2$\\\'yi ve sol tekil vektörleri $u_1, u_2$\\\'yi bulun. $A = U\\Sigma V^T$\\\'yi doğrulayın.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — Dikdörtgen SVD</div><div class="example-body">$A = \\begin{bmatrix} 1 & 2\\\\ 2 & 4\\\\ 3 & 6\\end{bmatrix}$\\\'in hem tam hem ince SVD\\\'sini hesaplayın. $\\operatorname{rank}(A)=1$ olduğunu not edin. $A$\\\'yı tek bir rank-1 dış çarpım $\\sigma_1 u_1 v_1^T$ olarak yazın.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — En iyi rank-1 yaklaşımı</div><div class="example-body">$A = \\begin{bmatrix} 4 & 0\\\\ 3 & -5\\end{bmatrix}$ olsun. SVD\\\'sini hesaplayın ve en iyi rank-1 yaklaşımı $A_1$\\\'i yazın. $\\|A - A_1\\|_F$ nedir? $\\|A - A_1\\|_2$ nedir?</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — Sözde ters</div><div class="example-body">Bölüm 5\\\'teki $A = \\begin{bmatrix} 1 & 1\\\\ 0 & 1\\\\ 1 & 0\\end{bmatrix}$ için $A^+$\\\'yı hesaplayın. Sonra $b = (1,1,1)^T$ için $\\min_x \\|Ax - b\\|^2$ en küçük kareler problemini çözün ve $x^* = A^+ b$ olduğunu gösterin.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — Tekil değerlerden matris normları</div><div class="example-body">$A$\\\'nın tekil değerleri $\\sigma_1, \\dots, \\sigma_r$ olsun. $\\|A\\|_2$, $\\|A\\|_F$, $\\|A\\|_*$ (çekirdek norm $\\sum \\sigma_i$) ve (eğer kareyse) $\\det(A)$\\\'yi $\\sigma_i$ cinsinden ifade edin. Bunlardan hangileri birim ortogonal değişimlere göre değişmezdir?</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — Koşul sayısı</div><div class="example-body">Tersinir $A$ için $\\kappa_2(A) = \\sigma_1/\\sigma_n$ olduğunu ve $Ax = b$ çözümünün göreli hatasının $\\dfrac{\\|\\delta x\\|}{\\|x\\|} \\le \\kappa_2(A)\\,\\dfrac{\\|\\delta b\\|}{\\|b\\|}$ sağladığını kanıtlayın. $\\kappa_2 = 10^4$ olan bir matris bulun ve kontrol edin.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — Eckart–Young doğrulaması</div><div class="example-body">İstediğiniz $3\\times 3$ ortogonal çerçevede $\\Sigma = \\operatorname{diag}(5, 3, 1)$ ile $A = U\\Sigma V^T$ alın. Rank-2 yaklaşım $A_2$\\\'yi oluşturun ve $\\|A - A_2\\|_F = 1$, $\\|A - A_2\\|_2 = 1$ olduğunu doğrudan doğrulayın.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 — Polar ayrışım</div><div class="example-body">$A = \\begin{bmatrix} 2 & -1\\\\ 1 & 2\\end{bmatrix}$ için polar ayrışım $A = QP$\\\'yi hesaplayın. $Q^T Q = I$ ve $P$\\\'nin simetrik PSD olduğunu doğrulayın. $Q$\\\'nun döndürme açısını ve $P$\\\'deki temel germeleri belirleyin.</div></div>'

+ '<div class="l-warn"><strong>Sonraki ders.</strong> Ders 6, yapılı ayrışımlar ve karesel formlarla devam eder — Cholesky ayrışımı, simetrik matrislerin özdeğerleri üzerinden kesinlik kavramı ve $x^T A x$ seviye kümelerinin geometrisi.</div>'

};
