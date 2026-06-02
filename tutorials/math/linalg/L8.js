window.LINALG_L8 = {

en: `<p class="l-text"><strong>Matrix calculus is the silent engine of every backward pass.</strong> The moment you call <code>loss.backward()</code> in PyTorch or <code>jax.grad(f)(x)</code> in JAX, the framework is mechanically applying matrix-calculus identities you are about to learn here — the gradient of a quadratic form, the derivative of a log-determinant, the Jacobian of softmax, the chain rule across LayerNorm. Everything that makes modern deep learning trainable lives in this lesson.</p>

<p class="l-text">Side by side with matrix calculus we will study <strong>Einstein summation (einsum)</strong>, the most expressive notation any tensor library offers. A single einsum line replaces a tangle of reshape, transpose, matmul, sum. By the end of this lesson you will be able to write multi-head attention in four einsum lines, derive the softmax Jacobian from first principles, and sketch the LayerNorm backward pass on a napkin. These are not academic exercises — they are the exact identities every transformer kernel author re-derives every time they write a fused CUDA op.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish numerator versus denominator layout and choose the right one consistently</li>
<li>Apply ten core matrix-calculus identities to scalar, vector, and matrix-valued objective functions</li>
<li>Read, write, and parse Einstein-summation strings for matmul, trace, batched matmul, outer products, and attention</li>
<li>Use the Kronecker product and vec operator to flatten matrix equations into vector equations</li>
<li>Derive the full softmax Jacobian and combine it with cross-entropy to obtain the clean residual gradient</li>
<li>Walk through every term of the LayerNorm backward pass and explain why fp16 implementations are numerically delicate</li>
<li>Implement multi-head attention forward and backward as four einsum lines with shape comments</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Matrix Calculus Deserves Its Own Lesson</h2>

<p class="l-text">If you have only ever differentiated scalar functions of a single variable, you may wonder why matrix calculus needs special treatment. The answer is bookkeeping. A modern deep network has a scalar loss that depends on a tensor of weights with millions of entries. The gradient is therefore a tensor of the same shape, the Jacobian of an intermediate vector quantity is a matrix, and the Jacobian of a matrix-valued quantity is a four-index tensor. The chain rule still works, but the indices proliferate and a single sign error or transposed axis means hours of debugging.</p>

<p class="l-text">Three skills make this tractable. First, a consistent layout convention so you never have to guess whether a Jacobian is wide or tall. Second, a small set of canonical identities (about ten cover most of deep learning) that you apply pattern-style instead of computing from scratch. Third, einsum and Kronecker notation that let you write what you mean in a way the computer can also execute. The rest of this lesson builds all three.</p>

<div class="calc-highlight"><strong>Mental model.</strong> Treat matrix calculus as ordinary calculus performed in parallel. Each output coordinate has a partial derivative with respect to each input coordinate; the Jacobian is just the matrix that collects them. The clever tricks (trace identities, vec operator, Kronecker) are bookkeeping shortcuts, not new mathematics.</div>

<h2 class="lesson-title">2. Numerator vs Denominator Layout</h2>

<p class="l-text">When you differentiate a vector with respect to a vector, the result is a two-index object. The textbooks disagree on which index goes first. Two conventions are in active use and you must commit to one and stick with it; mixing them is the single most common source of transposed-shape bugs in matrix-calculus computations.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Numerator layout</div><div class="card-body">Output index first. For $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$, $\\partial \\mathbf{f}/\\partial \\mathbf{x}$ is $m \\times n$. Row $i$ is $\\nabla f_i$ transposed. This is the default in most ML papers and in this lesson.</div></div>
<div class="calc-card"><div class="card-title">Denominator layout</div><div class="card-body">Input index first. The Jacobian becomes $n \\times m$. Some older econometrics and optimization texts use this. Visually it makes $\\nabla f$ a column vector, which feels natural in optimization.</div></div>
<div class="calc-card"><div class="card-title">Consistency rule</div><div class="card-body">Pick one and never switch within a derivation. The chain rule itself is layout-agnostic but the shape of intermediate results flips.</div></div>
<div class="calc-card"><div class="card-title">Framework default</div><div class="card-body">PyTorch returns gradients with the same shape as the parameter (so $\\nabla_W L$ has shape of $W$). This is closer to denominator layout for the gradient and numerator layout for Jacobians.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">NUMERATOR LAYOUT (USED IN THIS LESSON)</div><div class="formula-main">$$\\left(\\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}}\\right)_{ij} = \\frac{\\partial f_i}{\\partial x_j}, \\qquad \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}} \\in \\mathbb{R}^{m \\times n}$$</div><div class="formula-sub">Row index is the output; column index is the input. Gradient of a scalar is therefore a row vector under this convention (a single output).</div></div>

<p class="l-text">A small concrete example fixes the convention. Let $\\mathbf{f}(\\mathbf{x}) = (x_1^2, x_1 x_2)^T$ on $\\mathbb{R}^2$. In numerator layout</p>

$$\\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}} = \\begin{bmatrix} 2 x_1 & 0 \\\\ x_2 & x_1 \\end{bmatrix} \\in \\mathbb{R}^{2 \\times 2}.$$

<p class="l-text">In denominator layout the same Jacobian is transposed. The numbers are identical; only the indexing order differs. From here on every formula in this lesson is in numerator layout.</p>

<div id="plot-shape-diagram-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var cells = [
  {x:0.5,y:5,label:"scalar f(x)",dim:"shape ()",color:"#3b82f6"},
  {x:2.0,y:5,label:"input x in R^n",dim:"shape (n,)",color:"#3b82f6"},
  {x:3.5,y:5,label:"gradient grad f",dim:"shape (n,)",color:"#22c55e"},
  {x:5.0,y:5,label:"Hessian",dim:"shape (n, n)",color:"#f59e0b"},
  {x:0.5,y:3,label:"vector f: R^n -> R^m",dim:"output (m,)",color:"#3b82f6"},
  {x:2.0,y:3,label:"input x",dim:"shape (n,)",color:"#3b82f6"},
  {x:3.5,y:3,label:"Jacobian df/dx",dim:"shape (m, n)",color:"#22c55e"},
  {x:5.0,y:3,label:"second derivative",dim:"shape (m, n, n)",color:"#f59e0b"},
  {x:0.5,y:1,label:"matrix F: R^{p x q} -> R",dim:"input (p, q)",color:"#3b82f6"},
  {x:2.0,y:1,label:"-",dim:"",color:"#1a1a2e"},
  {x:3.5,y:1,label:"matrix gradient dF/dX",dim:"shape (p, q)",color:"#22c55e"},
  {x:5.0,y:1,label:"4-tensor of 2nd derivs",dim:"shape (p,q,p,q)",color:"#f59e0b"}
];
var traces = cells.map(function(c){return {x:[c.x],y:[c.y],mode:"markers+text",marker:{size:38,color:c.color,line:{color:"#0a0a0f",width:2}},text:[c.label+"<br>"+c.dim],textfont:{color:"#ebe6dc",size:10},textposition:"middle right",showlegend:false,hoverinfo:"text"};});
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{range:[0,7.5],showgrid:false,zeroline:false,visible:false},yaxis:{range:[0,6],showgrid:false,zeroline:false,visible:false},margin:{t:40,r:20,b:20,l:20},height:380,annotations:[{x:3.5,y:5.7,text:"SCALAR -> VECTOR",showarrow:false,font:{color:"#3b82f6",size:12}},{x:3.5,y:3.7,text:"VECTOR -> VECTOR",showarrow:false,font:{color:"#3b82f6",size:12}},{x:3.5,y:1.7,text:"MATRIX -> SCALAR",showarrow:false,font:{color:"#3b82f6",size:12}}]};
Plotly.newPlot("plot-shape-diagram-en",traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>How to read this diagram.</strong> Each row shows a different input/output shape combination. Reading left to right: the function signature, the input shape, the gradient or Jacobian shape, and the second-derivative shape. A scalar-of-vector has a vector gradient and a square Hessian. A vector-of-vector has a rectangular Jacobian. A scalar-of-matrix has a matrix gradient of the same shape as the input. Whenever you write a backward pass, mentally fill in this table for every node in the computation graph.</div></div>

<h2 class="lesson-title">3. Ten Core Matrix-Calculus Identities</h2>

<p class="l-text">The same handful of identities show up in nearly every backward derivation. Memorize them; do not re-derive every time. The proofs are short, mostly index-pushing exercises, and we sketch the two most important ones in detail.</p>

<div class="calc-formula"><div class="formula-label">CHEAT SHEET</div><div class="formula-main">
$$\\begin{aligned}
&(1) && \\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{a}^T \\mathbf{x}) = \\mathbf{a}^T \\\\
&(2) && \\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{x}^T \\mathbf{a}) = \\mathbf{a}^T \\\\
&(3) && \\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = \\mathbf{x}^T (A + A^T) \\\\
&(4) && \\frac{\\partial}{\\partial \\mathbf{x}} \\|A \\mathbf{x} - \\mathbf{b}\\|_2^2 = 2 (A \\mathbf{x} - \\mathbf{b})^T A \\\\
&(5) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(A X) = A^T \\\\
&(6) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(X^T A X) = (A + A^T) X \\\\
&(7) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(A X B) = A^T B^T \\\\
&(8) && \\frac{\\partial}{\\partial X} \\log \\det X = X^{-T} \\\\
&(9) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(X^{-1} A) = -(X^{-1} A X^{-1})^T \\\\
&(10) && \\frac{\\partial}{\\partial \\mathbf{x}} \\mathbf{x}^T \\mathbf{x} = 2 \\mathbf{x}^T
\\end{aligned}$$
</div><div class="formula-sub">All in numerator layout. Identities (5)-(9) are matrix versions; treat them as the matrix-calculus analogues of the elementary scalar rules.</div></div>

<h3 class="l-sub">3.1 Proof of identity (3): quadratic form</h3>

<p class="l-text">Write $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} = \\sum_{i,j} A_{ij} x_i x_j$. Differentiate term by term:</p>

$$\\frac{\\partial f}{\\partial x_k} = \\sum_j A_{kj} x_j + \\sum_i A_{ik} x_i = (A \\mathbf{x})_k + (A^T \\mathbf{x})_k.$$

<p class="l-text">Collecting all coordinates gives $\\nabla f = (A + A^T) \\mathbf{x}$, which in row form is $\\mathbf{x}^T (A + A^T)$. When $A$ is symmetric this collapses to $2 A \\mathbf{x}$, the familiar formula from least squares.</p>

<h3 class="l-sub">3.2 Proof of identity (8): log-determinant</h3>

<p class="l-text">Use Jacobi's formula $d (\\det X) = \\det(X) \\operatorname{tr}(X^{-1} dX)$ valid for any differentiable matrix perturbation $dX$. Dividing by $\\det X$,</p>

$$d (\\log \\det X) = \\operatorname{tr}(X^{-1} dX) = \\operatorname{tr}((X^{-T})^T dX).$$

<p class="l-text">Matching with the trace-inner-product representation $df = \\operatorname{tr}(G^T dX)$ identifies the gradient $G = X^{-T}$. This identity is the backbone of the multivariate Gaussian log-likelihood, of normalizing flows (Jacobian determinant), and of every Bayesian model that needs $\\log p(\\theta)$ with a Gaussian prior on a covariance.</p>

<div class="l-note"><strong>Why ten identities are enough.</strong> Cross-entropy, mean-squared error, weight regularization, Gaussian log-likelihood, attention scores, normalizing-flow log determinants — every common deep-learning loss is a chain of these primitives. Once you have the cheat sheet memorized, deriving the gradient of a new loss is mostly term-matching.</div>

<h2 class="lesson-title">4. The Einsum Notation</h2>

<p class="l-text"><strong>Einstein summation</strong> is a compact string-based way to describe tensor operations. The rule is brutally simple: every index that appears twice on the left of the arrow gets summed; indices that appear on the right of the arrow survive into the output. That single rule covers matmul, trace, batched matmul, outer product, transpose, reductions, and attention.</p>

<div class="calc-formula"><div class="formula-label">EINSUM ANATOMY</div><div class="formula-main">$$\\texttt{np.einsum("ij,jk -> ik", A, B)} \\iff C_{ik} = \\sum_j A_{ij} B_{jk}$$</div><div class="formula-sub">Left of arrow: input tensors with their index labels, comma-separated. Right of arrow: output indices. Repeated indices (here $j$) are summed automatically.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Implicit summation</div><div class="card-body">Any index appearing on the left but not on the right gets contracted. Example: <code>"ij -&gt;"</code> sums all entries of a matrix.</div></div>
<div class="calc-card"><div class="card-title">Diagonal extraction</div><div class="card-body">Using the same index twice in one operand picks the diagonal. <code>"ii -&gt; i"</code> returns the diagonal vector of a square matrix.</div></div>
<div class="calc-card"><div class="card-title">Transpose</div><div class="card-body"><code>"ij -&gt; ji"</code>. No sum; just swap labels. Works for any number of axes via permutations like <code>"ijk -&gt; kji"</code>.</div></div>
<div class="calc-card"><div class="card-title">Broadcasting via ellipsis</div><div class="card-body"><code>"...ij,...jk -&gt; ...ik"</code> performs batched matmul over any number of leading batch axes — exactly what attention needs.</div></div>
</div>

<p class="l-text">Below are ten einsum recipes that cover most of what you will write in a deep-learning codebase. Each is paired with the explicit index notation so the meaning is unambiguous.</p>

<div class="calc-example"><div class="example-label">TEN EINSUM RECIPES</div><div class="example-body">
<strong>1. Matmul</strong> <code>"ij,jk -&gt; ik"</code> &nbsp; $C_{ik} = \\sum_j A_{ij} B_{jk}$<br>
<strong>2. Inner product</strong> <code>"i,i -&gt;"</code> &nbsp; $c = \\sum_i a_i b_i$<br>
<strong>3. Outer product</strong> <code>"i,j -&gt; ij"</code> &nbsp; $M_{ij} = a_i b_j$<br>
<strong>4. Trace</strong> <code>"ii -&gt;"</code> &nbsp; $c = \\sum_i A_{ii}$<br>
<strong>5. Frobenius inner product</strong> <code>"ij,ij -&gt;"</code> &nbsp; $c = \\sum_{ij} A_{ij} B_{ij}$<br>
<strong>6. Element-wise multiply then sum on one axis</strong> <code>"ij,ij -&gt; i"</code><br>
<strong>7. Batched matmul</strong> <code>"bij,bjk -&gt; bik"</code><br>
<strong>8. Multi-head attention scores</strong> <code>"bhid,bhjd -&gt; bhij"</code><br>
<strong>9. Bilinear form</strong> <code>"i,ij,j -&gt;"</code> &nbsp; $c = \\sum_{ij} a_i W_{ij} b_j$<br>
<strong>10. Einsum-style reshape (kron)</strong> <code>"ij,kl -&gt; ikjl"</code> &nbsp; assemble Kronecker structure
</div></div>

<div id="plot-einsum-flow-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var nodeX = [0.5,0.5,2.5,2.5,4.5,4.5,6.5];
var nodeY = [4.0,2.0,4.0,2.0,4.0,2.0,3.0];
var nodeText = ["A index i","A index j","B index j","B index k","output i","output k","C = sum_j A_ij B_jk"];
var nodeColor = ["#3b82f6","#22c55e","#22c55e","#a78bfa","#3b82f6","#a78bfa","#f59e0b"];
var nodes = {x:nodeX,y:nodeY,mode:"markers+text",marker:{size:32,color:nodeColor,line:{color:"#0a0a0f",width:2}},text:nodeText,textfont:{color:"#ebe6dc",size:10},textposition:"top center",hoverinfo:"text",showlegend:false};
var edges = [];
function edge(x1,y1,x2,y2,c){return {x:[x1,x2],y:[y1,y2],mode:"lines",line:{color:c,width:2},showlegend:false,hoverinfo:"none"};}
edges.push(edge(0.5,4.0,4.5,4.0,"#3b82f6"));
edges.push(edge(2.5,4.0,2.5,2.0,"#22c55e"));
edges.push(edge(0.5,2.0,2.5,2.0,"#22c55e"));
edges.push(edge(2.5,2.0,4.5,2.0,"#a78bfa"));
edges.push(edge(4.5,4.0,6.5,3.0,"#3b82f6"));
edges.push(edge(4.5,2.0,6.5,3.0,"#a78bfa"));
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{range:[0,7.5],visible:false},yaxis:{range:[0.5,5.5],visible:false},margin:{t:50,r:20,b:20,l:20},height:340,annotations:[{x:1.5,y:5.0,text:"INPUT: A_ij",showarrow:false,font:{color:"#3b82f6",size:11}},{x:3.5,y:5.0,text:"SHARED INDEX j (summed)",showarrow:false,font:{color:"#22c55e",size:11}},{x:5.5,y:5.0,text:"OUTPUT: C_ik",showarrow:false,font:{color:"#a78bfa",size:11}}]};
Plotly.newPlot("plot-einsum-flow-en",edges.concat([nodes]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Reading the flow.</strong> The blue index $i$ comes from matrix $A$ and survives into the output. The green index $j$ appears in both $A$ and $B$ and gets summed away. The purple index $k$ comes from $B$ and survives. The orange output node $C_{ik}$ collects the sum $\\sum_j A_{ij} B_{jk}$. Every einsum string is just this picture in compressed form.</div></div>

<h3 class="l-sub">4.1 Performance considerations</h3>

<p class="l-text">A common worry is that einsum, being a string-driven interpreter, is slow. In practice both NumPy and PyTorch parse the einsum string once, plan a contraction order using a heuristic similar to the optimal one for tensor networks, and then dispatch to BLAS or cuBLAS. For large tensors einsum is typically within five percent of hand-tuned matmul-and-reshape code, and occasionally faster because it can choose a smarter contraction order than you would by hand. The exception is very small tensors with thousands of einsum calls per second; there the parsing overhead dominates and a hand-written kernel wins. For the deep-learning regime, write einsum first and profile only if a measurable hot spot appears.</p>

<h2 class="lesson-title">5. Kronecker Product and the vec Operator</h2>

<p class="l-text">The <strong>Kronecker product</strong> $A \\otimes B$ stacks scaled copies of $B$ in a block-structured fashion. If $A$ is $m \\times n$ and $B$ is $p \\times q$, then $A \\otimes B$ is $mp \\times nq$ and its $(i,j)$-th block is $A_{ij} B$. Concretely,</p>

$$\\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix} \\otimes B = \\begin{bmatrix} a_{11} B & a_{12} B \\\\ a_{21} B & a_{22} B \\end{bmatrix}.$$

<p class="l-text">The <strong>vec operator</strong> stacks the columns of a matrix into a single tall vector. For an $m \\times n$ matrix $X$, $\\operatorname{vec}(X) \\in \\mathbb{R}^{mn}$. Together Kronecker and vec turn matrix equations into vector equations, which is exactly what you need when applying ordinary multivariable calculus to matrix-valued unknowns.</p>

<div class="calc-formula"><div class="formula-label">THE FUNDAMENTAL VEC IDENTITY</div><div class="formula-main">$$\\operatorname{vec}(A X B) = (B^T \\otimes A)\\, \\operatorname{vec}(X)$$</div><div class="formula-sub">A bilinear map in $X$ becomes a linear map on $\\operatorname{vec}(X)$. The transposition of $B$ is essential and is the single most common source of errors when using this identity.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mixed-product</div><div class="card-body">$(A \\otimes B)(C \\otimes D) = (AC) \\otimes (BD)$ whenever the inner products are defined. Lets you simplify chains of Kronecker products.</div></div>
<div class="calc-card"><div class="card-title">Transpose</div><div class="card-body">$(A \\otimes B)^T = A^T \\otimes B^T$. Transpose distributes over Kronecker.</div></div>
<div class="calc-card"><div class="card-title">Inverse</div><div class="card-body">$(A \\otimes B)^{-1} = A^{-1} \\otimes B^{-1}$ when $A$ and $B$ are square and invertible.</div></div>
<div class="calc-card"><div class="card-title">Trace</div><div class="card-body">$\\operatorname{tr}(A \\otimes B) = \\operatorname{tr}(A) \\operatorname{tr}(B)$. Pleasingly multiplicative.</div></div>
</div>

<div id="plot-kron-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var A = [[1,2],[3,4]];
var B = [[5,6],[7,8]];
var Z = [];
for(var i=0;i<2;i++){
  for(var p=0;p<2;p++){
    var row = [];
    for(var j=0;j<2;j++){
      for(var q=0;q<2;q++){
        row.push(A[i][j]*B[p][q]);
      }
    }
    Z.push(row);
  }
}
var text = Z.map(function(r){return r.map(function(v){return String(v);});});
var trace = {z:Z,type:"heatmap",colorscale:[[0,"#0a0a0f"],[0.3,"#1a1a2e"],[0.6,"#3b82f6"],[1,"#a78bfa"]],text:text,texttemplate:"%{text}",showscale:false};
var shapes = [
  {type:"rect",x0:-0.5,y0:-0.5,x1:1.5,y1:1.5,line:{color:"#f59e0b",width:2}},
  {type:"rect",x0:1.5,y0:-0.5,x1:3.5,y1:1.5,line:{color:"#f59e0b",width:2}},
  {type:"rect",x0:-0.5,y0:1.5,x1:1.5,y1:3.5,line:{color:"#f59e0b",width:2}},
  {type:"rect",x0:1.5,y0:1.5,x1:3.5,y1:3.5,line:{color:"#f59e0b",width:2}}
];
var ann = [
  {x:0.5,y:-1.1,text:"a11*B",showarrow:false,font:{color:"#22c55e",size:11}},
  {x:2.5,y:-1.1,text:"a12*B",showarrow:false,font:{color:"#22c55e",size:11}},
  {x:0.5,y:4.1,text:"a21*B",showarrow:false,font:{color:"#22c55e",size:11}},
  {x:2.5,y:4.1,text:"a22*B",showarrow:false,font:{color:"#22c55e",size:11}}
];
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{showgrid:false,zeroline:false,visible:false},yaxis:{showgrid:false,zeroline:false,visible:false,autorange:"reversed"},margin:{t:40,r:30,b:50,l:30},height:340,shapes:shapes,annotations:ann};
Plotly.newPlot("plot-kron-en",[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Block structure of $A \\otimes B$.</strong> For $A = [[1,2],[3,4]]$ and $B = [[5,6],[7,8]]$ the Kronecker product is a $4 \\times 4$ matrix made of four scaled copies of $B$. Each orange-outlined block is $a_{ij} B$. Reading any block gives you the scalar from $A$ as a multiplier; reading along a block reveals the structure of $B$. This block-wise visualization is what makes vec identities easy to remember: <em>columns of $X$ stretched out, multiplied by columns of $B$ as blocks of $A$.</em></div></div>

<h3 class="l-sub">5.1 Why this matters for backprop</h3>

<p class="l-text">Suppose you want the gradient of a loss with respect to a parameter matrix $W$ where the forward pass is $\\mathbf{y} = W \\mathbf{x}$. Element by element the Jacobian $\\partial \\mathbf{y}/\\partial W$ is a three-index tensor, awkward to manipulate. Using vec:</p>

$$\\operatorname{vec}(\\mathbf{y}) = \\operatorname{vec}(W \\mathbf{x}) = (\\mathbf{x}^T \\otimes I) \\operatorname{vec}(W).$$

<p class="l-text">Now the relationship between $\\operatorname{vec}(W)$ and $\\mathbf{y}$ is a plain matrix equation; you can apply the ordinary gradient calculus from sections 2 and 3. After unvec'ing you get the familiar PyTorch result $\\nabla_W L = \\nabla_y L \\cdot \\mathbf{x}^T$. The vec/kron machinery makes this fall out automatically and survives intact through more complex layers.</p>

<h2 class="lesson-title">6. Softmax Jacobian: Full Derivation</h2>

<p class="l-text">The softmax function maps a vector of logits to a probability distribution:</p>

$$\\mathbf{s} = \\operatorname{softmax}(\\mathbf{x}), \\qquad s_i = \\frac{e^{x_i}}{\\sum_k e^{x_k}}.$$

<p class="l-text">We want its Jacobian $\\partial \\mathbf{s}/\\partial \\mathbf{x}$. By the quotient rule on each coordinate, with $Z = \\sum_k e^{x_k}$:</p>

$$\\frac{\\partial s_i}{\\partial x_j} = \\frac{(\\partial_j e^{x_i}) Z - e^{x_i} (\\partial_j Z)}{Z^2} = \\frac{\\delta_{ij} e^{x_i} Z - e^{x_i} e^{x_j}}{Z^2}.$$

<p class="l-text">Divide numerator and denominator by $Z^2$ and recognize $e^{x_i}/Z = s_i$ and $e^{x_j}/Z = s_j$:</p>

$$\\frac{\\partial s_i}{\\partial x_j} = s_i (\\delta_{ij} - s_j) = s_i \\delta_{ij} - s_i s_j.$$

<div class="calc-formula"><div class="formula-label">SOFTMAX JACOBIAN</div><div class="formula-main">$$J = \\frac{\\partial \\mathbf{s}}{\\partial \\mathbf{x}} = \\operatorname{diag}(\\mathbf{s}) - \\mathbf{s} \\mathbf{s}^T$$</div><div class="formula-sub">A symmetric, positive-semi-definite, rank $n-1$ matrix. Its kernel is the all-ones direction (adding a constant to every logit leaves the softmax unchanged).</div></div>

<h3 class="l-sub">6.1 Combination with cross-entropy: the famous $\\mathbf{s} - \\mathbf{y}$</h3>

<p class="l-text">Cross-entropy against a one-hot target $\\mathbf{y}$ is $L = -\\sum_i y_i \\log s_i$. Its gradient with respect to the logits is</p>

$$\\nabla_{\\mathbf{x}} L = \\left(\\nabla_{\\mathbf{s}} L\\right) J, \\qquad \\nabla_{\\mathbf{s}} L = -\\mathbf{y}/\\mathbf{s} \\text{ component-wise}.$$

<p class="l-text">Computing the product:</p>

$$\\left(\\nabla_{\\mathbf{x}} L\\right)_j = \\sum_i \\left(-\\frac{y_i}{s_i}\\right) (s_i \\delta_{ij} - s_i s_j) = -y_j + s_j \\sum_i y_i = s_j - y_j$$

<p class="l-text">where the last step uses $\\sum_i y_i = 1$ for a one-hot target. The Jacobian-by-gradient product collapses into the cleanest formula in deep learning: <strong>predicted probability minus one-hot label</strong>. Every modern framework fuses softmax and cross-entropy into a single op precisely to skip the explicit Jacobian and emit $\\mathbf{s} - \\mathbf{y}$ directly.</p>

<div id="plot-softmax-jac-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var x = [1.0, 2.0, 0.5, 1.5];
var ex = x.map(function(v){return Math.exp(v);});
var Z = ex.reduce(function(a,b){return a+b;},0);
var s = ex.map(function(v){return v/Z;});
var J = [];
for(var i=0;i<4;i++){
  var row = [];
  for(var j=0;j<4;j++){
    var d = (i===j)?1:0;
    row.push(+(s[i]*(d - s[j])).toFixed(4));
  }
  J.push(row);
}
var text = J.map(function(r){return r.map(function(v){return v.toFixed(3);});});
var trace = {z:J,type:"heatmap",colorscale:[[0,"#1e3a8a"],[0.5,"#0a0a0f"],[1,"#3b82f6"]],zmid:0,text:text,texttemplate:"%{text}",showscale:true,colorbar:{tickfont:{color:"#ebe6dc"}}};
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{tickvals:[0,1,2,3],ticktext:["x_1","x_2","x_3","x_4"],side:"top"},yaxis:{tickvals:[0,1,2,3],ticktext:["s_1","s_2","s_3","s_4"],autorange:"reversed"},margin:{t:60,r:20,b:30,l:60},height:340};
Plotly.newPlot("plot-softmax-jac-en",[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Softmax Jacobian heat map.</strong> Logits are $[1.0, 2.0, 0.5, 1.5]$, giving softmax probabilities roughly $[0.22, 0.59, 0.13, 0.36]$ then normalized. The diagonal entries are positive ($s_i (1 - s_i)$), the off-diagonal entries are negative ($-s_i s_j$), and every row sums to zero — adding a constant to every logit leaves softmax unchanged, so $J \\mathbf{1} = \\mathbf{0}$. The matrix is symmetric, positive semi-definite, and has rank three (one less than its dimension).</div></div>

<h2 class="lesson-title">7. LayerNorm Backward in Full Detail</h2>

<p class="l-text">LayerNorm is the canonical normalization layer in transformers. The forward pass for a single feature vector $\\mathbf{x} \\in \\mathbb{R}^d$ is</p>

$$\\mu = \\frac{1}{d} \\sum_i x_i, \\qquad \\sigma^2 = \\frac{1}{d} \\sum_i (x_i - \\mu)^2, \\qquad \\hat{x}_i = \\frac{x_i - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}, \\qquad y_i = \\gamma_i \\hat{x}_i + \\beta_i.$$

<p class="l-text">The backward pass needs $\\partial L/\\partial \\mathbf{x}$ given $\\partial L/\\partial \\mathbf{y}$. Three chains of dependence: $\\mathbf{y}$ depends on $\\hat{\\mathbf{x}}$, which depends on $\\mathbf{x}$ directly, on $\\mu(\\mathbf{x})$, and on $\\sigma^2(\\mathbf{x})$. We propagate the gradient through all three.</p>

<h3 class="l-sub">7.1 Step one: gradient of $L$ wrt $\\hat{\\mathbf{x}}$</h3>

<p class="l-text">Since $y_i = \\gamma_i \\hat{x}_i + \\beta_i$ is element-wise,</p>

$$\\frac{\\partial L}{\\partial \\hat{x}_i} = \\frac{\\partial L}{\\partial y_i} \\gamma_i.$$

<h3 class="l-sub">7.2 Step two: gradient of $L$ wrt $\\sigma^2$ and $\\mu$</h3>

<p class="l-text">For $\\sigma^2$ we differentiate $\\hat{x}_i = (x_i - \\mu) (\\sigma^2 + \\epsilon)^{-1/2}$:</p>

$$\\frac{\\partial L}{\\partial \\sigma^2} = \\sum_i \\frac{\\partial L}{\\partial \\hat{x}_i} \\cdot (x_i - \\mu) \\cdot \\left(-\\frac{1}{2}\\right) (\\sigma^2 + \\epsilon)^{-3/2}.$$

<p class="l-text">For $\\mu$, both the direct dependence ($\\hat{x}_i$ has $-\\mu$ in the numerator) and the indirect dependence through $\\sigma^2$ contribute:</p>

$$\\frac{\\partial L}{\\partial \\mu} = -\\frac{1}{\\sqrt{\\sigma^2 + \\epsilon}} \\sum_i \\frac{\\partial L}{\\partial \\hat{x}_i} + \\frac{\\partial L}{\\partial \\sigma^2} \\cdot \\frac{-2}{d} \\sum_i (x_i - \\mu).$$

<p class="l-text">The second sum vanishes since $\\sum_i (x_i - \\mu) = 0$ by definition of $\\mu$. So</p>

$$\\frac{\\partial L}{\\partial \\mu} = -\\frac{1}{\\sqrt{\\sigma^2 + \\epsilon}} \\sum_i \\frac{\\partial L}{\\partial \\hat{x}_i}.$$

<h3 class="l-sub">7.3 Step three: gradient of $L$ wrt $\\mathbf{x}$</h3>

<p class="l-text">Chain rule through all three paths and simplify:</p>

$$\\frac{\\partial L}{\\partial x_i} = \\frac{1}{d \\sqrt{\\sigma^2 + \\epsilon}} \\left[ d \\frac{\\partial L}{\\partial \\hat{x}_i} - \\sum_k \\frac{\\partial L}{\\partial \\hat{x}_k} - \\hat{x}_i \\sum_k \\frac{\\partial L}{\\partial \\hat{x}_k} \\hat{x}_k \\right].$$

<div class="calc-formula"><div class="formula-label">FUSED LAYERNORM BACKWARD</div><div class="formula-main">$$\\frac{\\partial L}{\\partial \\mathbf{x}} = \\frac{1}{d \\sqrt{\\sigma^2 + \\epsilon}} \\bigl( d \\mathbf{g} - \\mathbf{1} (\\mathbf{1}^T \\mathbf{g}) - \\hat{\\mathbf{x}} (\\hat{\\mathbf{x}}^T \\mathbf{g}) \\bigr), \\qquad \\mathbf{g} = \\gamma \\odot \\nabla_{\\mathbf{y}} L$$</div><div class="formula-sub">$\\odot$ is element-wise product. The two inner products $\\mathbf{1}^T \\mathbf{g}$ and $\\hat{\\mathbf{x}}^T \\mathbf{g}$ are each a single scalar, hence the fused kernel cost is $O(d)$ memory bandwidth and $O(d)$ FLOPs — same as the forward pass.</div></div>

<div class="l-warn"><strong>fp16 trap.</strong> The two inner products in the fused form are sums of $d$ products. At $d = 4096$ in half precision the running sum can lose 11 bits of mantissa before catastrophic cancellation hits when $\\hat{\\mathbf{x}}$ is centered. Production transformers therefore compute LayerNorm statistics in fp32 even when the rest of the model is fp16 or bf16. The PyTorch fused kernel implements this upcast automatically; if you hand-roll LayerNorm in pure fp16, expect NaNs after a few hundred steps.</div>

<h2 class="lesson-title">8. Multi-Head Attention as Four Einsum Lines</h2>

<p class="l-text">Multi-head attention is the most-written operation in modern deep learning. The hand-rolled version is six to eight lines of reshape, transpose, matmul, mask, softmax, matmul, reshape. With einsum it shrinks to four lines, each with a clear semantic meaning. The shape convention used below: $b$ batch, $n$ query length, $m$ key length, $h$ heads, $d$ per-head dimension.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def attention(Q, K, V, mask=None):
    # Q: (b, n, h, d)   K: (b, m, h, d)   V: (b, m, h, d)
    d = Q.shape[-1]
    scores = np.einsum("bnhd,bmhd-&gt;bhnm", Q, K) / np.sqrt(d)
    if mask is not None:
        scores = scores + mask                       # broadcastable to (b,h,n,m)
    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights = weights / weights.sum(axis=-1, keepdims=True)
    out = np.einsum("bhnm,bmhd-&gt;bnhd", weights, V)  # (b, n, h, d)
    return out</code></pre></div>

<p class="l-text">Read the einsum strings as sentences. <code>bnhd,bmhd -&gt; bhnm</code> says: take the per-head dimension $d$ from $Q$ and $K$, contract it, keep batch, heads, and the two sequence lengths. The output puts heads before queries so the softmax over the last axis covers keys. <code>bhnm,bmhd -&gt; bnhd</code> says: contract keys, restore the head-as-third-axis layout, leave per-head dimension intact. There are no transposes, no view, no contiguous calls. The compiler does all of that for you.</p>

<div id="plot-attn-timing-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var seqs = [64,128,256,512,1024,2048,4096];
var einsumTime = seqs.map(function(n){return Math.log10(n*n*64/1e6 + 0.01);});
var naiveTime = seqs.map(function(n){return Math.log10(n*n*64*3/1e6 + 0.03);});
var t1 = {x:seqs,y:einsumTime,mode:"lines+markers",name:"einsum (single op)",line:{color:"#3b82f6",width:3},marker:{size:9,color:"#3b82f6"}};
var t2 = {x:seqs,y:naiveTime,mode:"lines+markers",name:"reshape+matmul (4 ops)",line:{color:"#f59e0b",width:3,dash:"dash"},marker:{size:9,color:"#f59e0b"}};
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{type:"log",title:"sequence length",gridcolor:"rgba(255,255,255,0.08)"},yaxis:{title:"log10 time (ms, modeled)",gridcolor:"rgba(255,255,255,0.08)"},margin:{t:50,r:30,b:60,l:70},height:360,legend:{x:0.05,y:0.95,bgcolor:"rgba(0,0,0,0.3)",font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-attn-timing-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Modeled timings.</strong> A purely educational sketch comparing a single einsum call (blue) against the equivalent reshape-matmul-transpose chain (orange) for attention scores at $d = 64$. The constant offset reflects the fixed Python overhead per op call. As sequence length grows the einsum line stays ahead because the operation kernel handles all reshapes internally and the contraction order is chosen optimally. On real hardware the gap narrows once tensors exceed CPU cache, but einsum almost never loses by more than five percent.</div></div>

<h2 class="lesson-title">9. Backward Pass of Attention — All in Einsum</h2>

<p class="l-text">If the forward is four lines, the backward is six. Derive once, type forever.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Given: dout with shape (b, n, h, d)
# Cached from forward: Q, K, V, weights

# dV: pull dout back through "bhnm,bmhd-&gt;bnhd"
dV = np.einsum("bnhd,bhnm-&gt;bmhd", dout, weights)

# dweights: pull dout back through V
dweights = np.einsum("bnhd,bmhd-&gt;bhnm", dout, V)

# Softmax Jacobian-vector product, applied per head and per query
dscores = weights * (dweights - np.einsum("bhnm,bhnm-&gt;bhn",
                                          weights, dweights)[..., None])

# Scale
dscores = dscores / np.sqrt(Q.shape[-1])

# dQ and dK come from the scores einsum
dQ = np.einsum("bhnm,bmhd-&gt;bnhd", dscores, K)
dK = np.einsum("bhnm,bnhd-&gt;bmhd", dscores, Q)</code></pre></div>

<p class="l-text">Every line is a controlled application of the identities from section 3 combined with the softmax Jacobian from section 6. No tensor is materialized that did not need to exist; the same memory traffic pattern as the forward pass. This is essentially what FlashAttention does, modulo a tile-based recomputation strategy that keeps the $n \\times m$ scores matrix off the global memory.</p>

<h2 class="lesson-title">10. Verifying Identities Numerically</h2>

<p class="l-text">Whenever you derive a new identity, sanity-check it with a finite-difference comparison. Pick a tiny problem (say $d = 5$), compute the gradient analytically, compute it numerically with the symmetric difference $(f(\\mathbf{x} + h \\mathbf{e}_i) - f(\\mathbf{x} - h \\mathbf{e}_i)) / (2h)$, and compare. Differences below $10^{-6}$ confirm the analytic formula; differences around $10^{-2}$ usually mean a transpose or sign error.</p>

<div class="calc-example"><div class="example-label">FINITE-DIFFERENCE CHECK</div><div class="example-body">
For $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$ with $A$ non-symmetric, the analytic gradient is $\\mathbf{x}^T (A + A^T)$. Compute both numerically and compare:<br><br>
<code>x = np.random.randn(5)<br>
A = np.random.randn(5, 5)<br>
analytic = x @ (A + A.T)<br>
h = 1e-5<br>
numerical = np.array([(f(x + h*e_i) - f(x - h*e_i)) / (2*h) for i in range(5)])<br>
print(np.allclose(analytic, numerical))  # True</code><br><br>
This is the same trick PyTorch uses for <code>gradcheck</code>, and it catches 90% of derivation mistakes.</div></div>

<div class="l-note"><strong>The interactive Python lab below lets you run all the identities, derive softmax backward from scratch, and time einsum against naive matmul.</strong> NumPy is already loaded. Click any RUN button to execute. Modify the code and run again to explore.</div>

<h2 class="lesson-title">11. Practical Tips and Common Pitfalls</h2>

<p class="l-text">Even with all the machinery in place, there are five recurring issues that bite practitioners. Calling them out explicitly saves hours of debugging downstream.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Layout drift</div><div class="card-body">You start a derivation in numerator layout, sneakily switch to denominator halfway through, and end up with a Jacobian transposed by accident. Fix: write the input/output shapes next to every derivative on paper and check they multiply correctly under the chain rule.</div></div>
<div class="calc-card"><div class="card-title">Forgotten transpose in vec identity</div><div class="card-body">$\\operatorname{vec}(AXB) = (B^T \\otimes A) \\operatorname{vec}(X)$. The $B^T$ is non-negotiable. Half of vec/kron mistakes are missing or misplaced transposes here.</div></div>
<div class="calc-card"><div class="card-title">Softmax overflow</div><div class="card-body">Computing $e^{x_i}$ directly for large logits overflows fp32 around $x = 88$. Always subtract the max logit before exponentiating — both forward and backward.</div></div>
<div class="calc-card"><div class="card-title">Einsum letter overuse</div><div class="card-body">einsum runs out of single letters quickly in deep code. Use ellipsis <code>...</code> for variable batch axes, and prefer descriptive multi-letter axis names in PyTorch named-tensors when working on a complex op.</div></div>
<div class="calc-card"><div class="card-title">Mixing precision in normalization</div><div class="card-body">As section 7 warned: never compute LayerNorm or RMSNorm statistics in fp16. Cast to fp32 for the reduction, then cast the result back. Most modern frameworks do this automatically; pure-Python implementations do not.</div></div>
</div>

<p class="l-text">A sixth tip worth noting: when training stalls and the loss plateaus, instrument the norm of the gradients flowing through each LayerNorm. If you see the gradient through $\\hat{\\mathbf{x}}$ explode (norm growing layer by layer), you have either a softmax overflow upstream or an unscaled residual connection downstream. The matrix calculus you learned in this lesson is the diagnostic language for these problems — without it you would just be poking randomly at hyperparameters.</p>

<h2 class="lesson-title">Summary and Connection to the Next Lesson</h2>

<p class="l-text">Matrix calculus gives you the chain rule on tensors with bookkeeping done right. Ten identities cover the gradients of every common deep-learning loss. The softmax Jacobian is the cleanest illustration: derived in three lines and combined with cross-entropy to yield the famous residual gradient. LayerNorm backward is the messier real-world version: three chained dependencies that fuse into a single $O(d)$ kernel. Einsum is the notation that lets you write all of this in code that the compiler can take seriously, and Kronecker plus vec let you flatten any matrix equation into a vector equation when ordinary calculus would otherwise drown in indices. Together these tools are what every transformer engineer is silently applying every time they write or read a backward function. From here the next track moves into probability and information theory — where the gradients you derived here will reappear inside variational lower bounds, mutual information estimators, and the policy gradients of reinforcement learning.</p>
`,

tr: `<p class="l-text"><strong>Matris analizi her geri yayilim adiminin sessiz motorudur.</strong> PyTorch'ta <code>loss.backward()</code> ya da JAX'ta <code>jax.grad(f)(x)</code> cagrildigi anda framework, bu derste ogreneceginiz matris-analizi ozdesliklerini mekanik olarak uyguluyor — kuadratik formun gradyani, log-determinantin turevi, softmax Jacobian'i, LayerNorm boyunca zincir kurali. Modern derin ogrenmeyi egitilebilir kilan her sey bu dersin icinde yasiyor.</p>

<p class="l-text">Matris analizi ile yan yana <strong>Einstein toplama (einsum)</strong> calisacagiz — hicbir tensor kutuphanesinin sunmadigi en ifadeli notasyon. Tek bir einsum satiri reshape, transpose, matmul ve sum'un karisik bir yumagini degistirir. Dersin sonunda cok-basli dikkati dort einsum satiriyla yazabilecek, softmax Jacobian'ini ilk ilkelerden turetebilecek ve LayerNorm geri yayilimi pecete ustune cizebileceksiniz. Bunlar akademik egzersiz degil — her transformer cekirdek yazarinin her bir kaynastirilmis CUDA op'u yazarken sifirdan yeniden urettigi tam ozdesliklerdir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKLERINIZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Pay ve payda duzenleri arasinda ayrim yapmak ve birini tutarli bicimde secmek</li>
<li>Skaler, vektor ve matris degerli amac fonksiyonlarina on temel matris-analizi ozdesligini uygulamak</li>
<li>Matmul, iz, toplu matmul, dis carpim ve dikkat icin Einstein toplama dizgilerini okumak, yazmak ve cozumlemek</li>
<li>Matris denklemlerini vektor denklemlerine doneme icin Kronecker carpimini ve vec operatorunu kullanmak</li>
<li>Tam softmax Jacobian'ini turetmek ve carpraz entropi ile birlestirip temiz kalinti gradyanini elde etmek</li>
<li>LayerNorm geri yayiliminin her teriminden adim adim gecmek ve fp16 uygulamalarinin neden duyarli oldugunu aciklamak</li>
<li>Cok-basli dikkatin ileri ve geri yayilimini sekil yorumlariyla birlikte dort einsum satiri olarak gerceklemek</li>
</ul>
</div>

<h2 class="lesson-title">1. Matris Analizi Neden Kendi Dersini Hak Ediyor</h2>

<p class="l-text">Tek degiskenli skaler fonksiyonlardan baska bir sey turevleyemediyseniz, matris analizinin neden ozel ele alinmasi gerektigini merak edebilirsiniz. Cevap: defter tutmak. Modern bir derin agin milyonlarca girdiye sahip bir agirlik tensorune bagli skaler bir kaybi vardir. Gradyan bu yuzden ayni sekle sahip bir tensor, ara vektor niceliklerinin Jacobian'i bir matris ve matris degerli niceliklerin Jacobian'i dort-indeksli bir tensor olur. Zincir kurali hala isler, ama indeksler birikir ve tek bir isaret hatasi ya da yer degisik bir eksen saatlerce hata ayiklama demektir.</p>

<p class="l-text">Uc beceri bunu yonetilebilir kilar. Birincisi: bir Jacobian'in genis mi dar mi oldugunu hicbir zaman tahmin etmek zorunda kalmamak icin tutarli bir duzen sozlesmesi. Ikincisi: sifirdan hesaplamak yerine kalip eslestirme tarziyla uygulayacaginiz kucuk bir kanonik ozdeslikler kumesi (yaklasik on tanesi derin ogrenmenin cogunu kapsar). Ucuncusu: kastinizi bilgisayarin da yurutebilecegi sekilde yazmaniza olanak veren einsum ve Kronecker notasyonu. Dersin gerisi her ucunu de insa eder.</p>

<div class="calc-highlight"><strong>Zihin modeli.</strong> Matris analizini paralel uygulanan siradan analiz olarak dusunun. Her cikis koordinatinin her giris koordinatina gore kismi turevi vardir; Jacobian sadece bunlari toplayan matristir. Akilli numaralar (iz ozdeslikleri, vec operatoru, Kronecker) yeni matematik degil, defter tutma kisayollaridir.</div>

<h2 class="lesson-title">2. Pay ve Payda Duzeni</h2>

<p class="l-text">Bir vektoru bir vektore gore turevlediginizde sonuc iki-indeksli bir nesne olur. Ders kitaplari hangi indeksin once gelecegi konusunda anlasamiyor. Iki sozlesme aktif kullanimda ve birine baglanip orada kalmaniz gerekiyor; karistirmak, matris-analizi hesaplarinda yer degisik sekil hatalarinin tek en yaygin kaynagidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pay duzeni</div><div class="card-body">Cikti indeksi once. $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$ icin, $\\partial \\mathbf{f}/\\partial \\mathbf{x}$ $m \\times n$'dir. $i$ satiri $\\nabla f_i$'nin transpozudur. ML makalelerinin ve bu dersin varsayilani.</div></div>
<div class="calc-card"><div class="card-title">Payda duzeni</div><div class="card-body">Giris indeksi once. Jacobian $n \\times m$ olur. Bazi eski ekonometrik ve eniyileme metinleri bunu kullanir. Gorsel olarak $\\nabla f$'yi bir sutun vektoru yapar, bu da eniyilemede dogal hisseder.</div></div>
<div class="calc-card"><div class="card-title">Tutarlilik kurali</div><div class="card-body">Birini secip turetim icinde asla degistirmeyin. Zincir kurali kendi basina duzen-bagimsizdir ama ara sonuclarin sekli tersine doner.</div></div>
<div class="calc-card"><div class="card-title">Framework varsayilani</div><div class="card-body">PyTorch gradyanlari parametreyle ayni sekille dondurur (yani $\\nabla_W L$ $W$'nun sekline sahiptir). Bu, gradyan icin payda duzenine, Jacobian'lar icin pay duzenine yakindir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PAY DUZENI (BU DERSTE KULLANILAN)</div><div class="formula-main">$$\\left(\\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}}\\right)_{ij} = \\frac{\\partial f_i}{\\partial x_j}, \\qquad \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}} \\in \\mathbb{R}^{m \\times n}$$</div><div class="formula-sub">Satir indeksi cikis; sutun indeksi giris. Bu sozlesmede bir skalerin gradyani bir satir vektorudur (tek cikis).</div></div>

<p class="l-text">Kucuk somut bir ornek sozlesmeyi sabitler. $\\mathbb{R}^2$ uzerinde $\\mathbf{f}(\\mathbf{x}) = (x_1^2, x_1 x_2)^T$ olsun. Pay duzeninde</p>

$$\\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}} = \\begin{bmatrix} 2 x_1 & 0 \\\\ x_2 & x_1 \\end{bmatrix} \\in \\mathbb{R}^{2 \\times 2}.$$

<p class="l-text">Payda duzeninde ayni Jacobian transpoze edilir. Sayilar ayni; sadece indeksleme sirasi farkli. Buradan itibaren dersteki her formul pay duzeninde.</p>

<div id="plot-shape-diagram-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var cells = [
  {x:0.5,y:5,label:"skaler f(x)",dim:"sekil ()",color:"#3b82f6"},
  {x:2.0,y:5,label:"giris x in R^n",dim:"sekil (n,)",color:"#3b82f6"},
  {x:3.5,y:5,label:"gradyan grad f",dim:"sekil (n,)",color:"#22c55e"},
  {x:5.0,y:5,label:"Hessian",dim:"sekil (n, n)",color:"#f59e0b"},
  {x:0.5,y:3,label:"vektor f: R^n -> R^m",dim:"cikti (m,)",color:"#3b82f6"},
  {x:2.0,y:3,label:"giris x",dim:"sekil (n,)",color:"#3b82f6"},
  {x:3.5,y:3,label:"Jacobian df/dx",dim:"sekil (m, n)",color:"#22c55e"},
  {x:5.0,y:3,label:"ikinci turev",dim:"sekil (m, n, n)",color:"#f59e0b"},
  {x:0.5,y:1,label:"matris F: R^{p x q} -> R",dim:"giris (p, q)",color:"#3b82f6"},
  {x:2.0,y:1,label:"-",dim:"",color:"#1a1a2e"},
  {x:3.5,y:1,label:"matris gradyani dF/dX",dim:"sekil (p, q)",color:"#22c55e"},
  {x:5.0,y:1,label:"4-tensor 2. turev",dim:"sekil (p,q,p,q)",color:"#f59e0b"}
];
var traces = cells.map(function(c){return {x:[c.x],y:[c.y],mode:"markers+text",marker:{size:38,color:c.color,line:{color:"#0a0a0f",width:2}},text:[c.label+"<br>"+c.dim],textfont:{color:"#ebe6dc",size:10},textposition:"middle right",showlegend:false,hoverinfo:"text"};});
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{range:[0,7.5],showgrid:false,zeroline:false,visible:false},yaxis:{range:[0,6],showgrid:false,zeroline:false,visible:false},margin:{t:40,r:20,b:20,l:20},height:380,annotations:[{x:3.5,y:5.7,text:"SKALER -> VEKTOR",showarrow:false,font:{color:"#3b82f6",size:12}},{x:3.5,y:3.7,text:"VEKTOR -> VEKTOR",showarrow:false,font:{color:"#3b82f6",size:12}},{x:3.5,y:1.7,text:"MATRIS -> SKALER",showarrow:false,font:{color:"#3b82f6",size:12}}]};
Plotly.newPlot("plot-shape-diagram-tr",traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Diyagrami nasil okumali.</strong> Her satir farkli bir giris/cikti sekli birlesimini gosterir. Soldan saga: fonksiyon imzasi, giris sekli, gradyan ya da Jacobian sekli ve ikinci turev sekli. Vektorden-skaler bir vektor gradyana ve kare Hessian'a sahiptir. Vektorden-vektor dikdortgen bir Jacobian'a sahiptir. Matristen-skaler giris ile ayni sekle sahip matris gradyana sahiptir. Bir geri yayilim yazdiginiz her zaman, hesaplama grafindeki her dugum icin bu tabloyu zihinde doldurun.</div></div>

<h2 class="lesson-title">3. On Cekirdek Matris-Analizi Ozdesligi</h2>

<p class="l-text">Ayni avuc dolusu ozdeslik hemen her geri yayilim turetiminde gorunur. Ezberleyin; her seferinde yeniden turetmeyin. Ispatlar kisa, cogu indeks-itme egzersizleri, en onemli ikisini ayrintida cizecegiz.</p>

<div class="calc-formula"><div class="formula-label">HATA YAPMAYACAK LISTE</div><div class="formula-main">
$$\\begin{aligned}
&(1) && \\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{a}^T \\mathbf{x}) = \\mathbf{a}^T \\\\
&(2) && \\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{x}^T \\mathbf{a}) = \\mathbf{a}^T \\\\
&(3) && \\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = \\mathbf{x}^T (A + A^T) \\\\
&(4) && \\frac{\\partial}{\\partial \\mathbf{x}} \\|A \\mathbf{x} - \\mathbf{b}\\|_2^2 = 2 (A \\mathbf{x} - \\mathbf{b})^T A \\\\
&(5) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(A X) = A^T \\\\
&(6) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(X^T A X) = (A + A^T) X \\\\
&(7) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(A X B) = A^T B^T \\\\
&(8) && \\frac{\\partial}{\\partial X} \\log \\det X = X^{-T} \\\\
&(9) && \\frac{\\partial}{\\partial X} \\operatorname{tr}(X^{-1} A) = -(X^{-1} A X^{-1})^T \\\\
&(10) && \\frac{\\partial}{\\partial \\mathbf{x}} \\mathbf{x}^T \\mathbf{x} = 2 \\mathbf{x}^T
\\end{aligned}$$
</div><div class="formula-sub">Hepsi pay duzeninde. (5)-(9) matris surumleridir; onlari temel skaler kurallarin matris-analizi karsiliklari olarak gorun.</div></div>

<h3 class="l-sub">3.1 Ozdeslik (3) ispati: kuadratik form</h3>

<p class="l-text">$f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} = \\sum_{i,j} A_{ij} x_i x_j$ yazin. Terim terim turevleyin:</p>

$$\\frac{\\partial f}{\\partial x_k} = \\sum_j A_{kj} x_j + \\sum_i A_{ik} x_i = (A \\mathbf{x})_k + (A^T \\mathbf{x})_k.$$

<p class="l-text">Tum koordinatlari toplayinca $\\nabla f = (A + A^T) \\mathbf{x}$ olur, bu da satir formunda $\\mathbf{x}^T (A + A^T)$ olur. $A$ simetrik oldugunda en kucuk kareler analizinde tanidik formul olan $2 A \\mathbf{x}$ haline cokuverir.</p>

<h3 class="l-sub">3.2 Ozdeslik (8) ispati: log-determinant</h3>

<p class="l-text">Jacobi formulu $d (\\det X) = \\det(X) \\operatorname{tr}(X^{-1} dX)$ ile her turevlenebilir matris bozulumu $dX$ icin gecerli. $\\det X$'e bolerek,</p>

$$d (\\log \\det X) = \\operatorname{tr}(X^{-1} dX) = \\operatorname{tr}((X^{-T})^T dX).$$

<p class="l-text">Iz-ic-carpim gosterimi $df = \\operatorname{tr}(G^T dX)$ ile eslesterince gradyan $G = X^{-T}$ olarak belirlenir. Bu ozdeslik cok-degiskenli Gauss log-olabilirligin, normallestirme akislarinin (Jacobian determinanti) ve bir kovaryans uzerinde Gauss onseliyle her Bayes modelinin omurgasidir.</p>

<div class="l-note"><strong>Neden on ozdeslik yeterli.</strong> Carpraz entropi, ortalama kareli hata, agirlik duzenlilestirme, Gauss log-olabilirligi, dikkat skorlari, normallestirme-akis log determinantlari — her yaygin derin-ogrenme kaybi bu ilkelerin bir zinciridir. Hata yapmayacak listeyi ezberlediginizde, yeni bir kaybin gradyanini turetmek cogunlukla terim eslestirmesidir.</div>

<h2 class="lesson-title">4. Einsum Notasyonu</h2>

<p class="l-text"><strong>Einstein toplama</strong> tensor islemlerini tanimlamanin kompakt dizgi tabanli bir yoludur. Kural acimasizca basit: okun solunda iki kez gorunen her indeks toplanir; okun saginda gorunen indeksler ciktiya hayatta kalir. Bu tek kural matmul, iz, toplu matmul, dis carpim, transpoze, indirgemeler ve dikkati kapsar.</p>

<div class="calc-formula"><div class="formula-label">EINSUM ANATOMISI</div><div class="formula-main">$$\\texttt{np.einsum("ij,jk -> ik", A, B)} \\iff C_{ik} = \\sum_j A_{ij} B_{jk}$$</div><div class="formula-sub">Okun solu: giris tensorleri ve indeks etiketleri, virgulle ayrilmis. Okun sagi: cikti indeksleri. Tekrar eden indeksler (burada $j$) otomatik olarak toplanir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ortuk toplama</div><div class="card-body">Solda gorunup sagda gorunmeyen her indeks daraltilir. Ornek: <code>"ij -&gt;"</code> bir matrisin tum girdilerini toplar.</div></div>
<div class="calc-card"><div class="card-title">Kosegen cikarma</div><div class="card-body">Bir operandda ayni indeksi iki kez kullanmak kosegeni secer. <code>"ii -&gt; i"</code> kare bir matrisin kosegen vektorunu dondurur.</div></div>
<div class="calc-card"><div class="card-title">Transpoze</div><div class="card-body"><code>"ij -&gt; ji"</code>. Toplama yok; sadece etiketleri yer degistir. <code>"ijk -&gt; kji"</code> gibi permutasyonlar uzerinden herhangi sayida eksen icin calisir.</div></div>
<div class="calc-card"><div class="card-title">Uc nokta ile yayinlama</div><div class="card-body"><code>"...ij,...jk -&gt; ...ik"</code> herhangi sayida onde gelen yigin ekseni uzerinde toplu matmul yapar — tam olarak dikkatin ihtiyaci olan.</div></div>
</div>

<p class="l-text">Asagidaki on einsum tarifi derin-ogrenme kodunda yazacaginiz seyin cogunu kapsar. Her biri anlami belirsiz olmasin diye acik indeks gosterimiyle eslestirilmistir.</p>

<div class="calc-example"><div class="example-label">ON EINSUM TARIFI</div><div class="example-body">
<strong>1. Matmul</strong> <code>"ij,jk -&gt; ik"</code> &nbsp; $C_{ik} = \\sum_j A_{ij} B_{jk}$<br>
<strong>2. Ic carpim</strong> <code>"i,i -&gt;"</code> &nbsp; $c = \\sum_i a_i b_i$<br>
<strong>3. Dis carpim</strong> <code>"i,j -&gt; ij"</code> &nbsp; $M_{ij} = a_i b_j$<br>
<strong>4. Iz</strong> <code>"ii -&gt;"</code> &nbsp; $c = \\sum_i A_{ii}$<br>
<strong>5. Frobenius ic carpimi</strong> <code>"ij,ij -&gt;"</code> &nbsp; $c = \\sum_{ij} A_{ij} B_{ij}$<br>
<strong>6. Elemanwise carp sonra bir eksende topla</strong> <code>"ij,ij -&gt; i"</code><br>
<strong>7. Toplu matmul</strong> <code>"bij,bjk -&gt; bik"</code><br>
<strong>8. Cok-basli dikkat skorlari</strong> <code>"bhid,bhjd -&gt; bhij"</code><br>
<strong>9. Bilineer form</strong> <code>"i,ij,j -&gt;"</code> &nbsp; $c = \\sum_{ij} a_i W_{ij} b_j$<br>
<strong>10. Einsum tarzi reshape (kron)</strong> <code>"ij,kl -&gt; ikjl"</code> &nbsp; Kronecker yapisi insa et
</div></div>

<div id="plot-einsum-flow-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var nodeX = [0.5,0.5,2.5,2.5,4.5,4.5,6.5];
var nodeY = [4.0,2.0,4.0,2.0,4.0,2.0,3.0];
var nodeText = ["A indeks i","A indeks j","B indeks j","B indeks k","cikti i","cikti k","C = sum_j A_ij B_jk"];
var nodeColor = ["#3b82f6","#22c55e","#22c55e","#a78bfa","#3b82f6","#a78bfa","#f59e0b"];
var nodes = {x:nodeX,y:nodeY,mode:"markers+text",marker:{size:32,color:nodeColor,line:{color:"#0a0a0f",width:2}},text:nodeText,textfont:{color:"#ebe6dc",size:10},textposition:"top center",hoverinfo:"text",showlegend:false};
var edges = [];
function edge(x1,y1,x2,y2,c){return {x:[x1,x2],y:[y1,y2],mode:"lines",line:{color:c,width:2},showlegend:false,hoverinfo:"none"};}
edges.push(edge(0.5,4.0,4.5,4.0,"#3b82f6"));
edges.push(edge(2.5,4.0,2.5,2.0,"#22c55e"));
edges.push(edge(0.5,2.0,2.5,2.0,"#22c55e"));
edges.push(edge(2.5,2.0,4.5,2.0,"#a78bfa"));
edges.push(edge(4.5,4.0,6.5,3.0,"#3b82f6"));
edges.push(edge(4.5,2.0,6.5,3.0,"#a78bfa"));
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{range:[0,7.5],visible:false},yaxis:{range:[0.5,5.5],visible:false},margin:{t:50,r:20,b:20,l:20},height:340,annotations:[{x:1.5,y:5.0,text:"GIRIS: A_ij",showarrow:false,font:{color:"#3b82f6",size:11}},{x:3.5,y:5.0,text:"PAYLASILAN INDEKS j (toplandi)",showarrow:false,font:{color:"#22c55e",size:11}},{x:5.5,y:5.0,text:"CIKTI: C_ik",showarrow:false,font:{color:"#a78bfa",size:11}}]};
Plotly.newPlot("plot-einsum-flow-tr",edges.concat([nodes]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Akisi okumak.</strong> Mavi $i$ indeksi $A$ matrisinden geliyor ve cikiya hayatta kaliyor. Yesil $j$ indeksi hem $A$'da hem $B$'de gorunuyor ve toplanip yok ediliyor. Mor $k$ indeksi $B$'den geliyor ve hayatta kaliyor. Turuncu cikti dugumu $C_{ik}$ $\\sum_j A_{ij} B_{jk}$ toplamini topluyor. Her einsum dizgisi sikistirilmis halde bu resimdir.</div></div>

<h3 class="l-sub">4.1 Performans degerlendirmeleri</h3>

<p class="l-text">Yaygin bir endise, dizgi yonlendirmeli bir yorumcu olan einsum'in yavas oldugudur. Pratikte hem NumPy hem PyTorch einsum dizgisini bir kez ayristirir, tensor aglari icin optimum olana benzer bir buluşsal yontemle bir daraltma sirasi planlar ve sonra BLAS ya da cuBLAS'a yonlendirir. Buyuk tensorler icin einsum genellikle elle ayarlanmis matmul-ve-reshape kodunun yuzde besi icindedir ve bazen daha hizlidir cunku elle yapacaginizdan daha akilli bir daraltma sirasi secebilir. Istisna saniyede binlerce einsum cagrisi olan cok kucuk tensorlerdir; orada ayristirma yuku baskindir ve elle yazilmis bir cekirdek kazanir. Derin-ogrenme rejiminde once einsum yazin ve yalniz olcheb sicak bir nokta cikarsa profil cikartin.</p>

<h2 class="lesson-title">5. Kronecker Carpimi ve vec Operatoru</h2>

<p class="l-text"><strong>Kronecker carpimi</strong> $A \\otimes B$, $B$'nin olcekli kopyalarini blok yapisinda istifler. $A$ $m \\times n$ ve $B$ $p \\times q$ ise, $A \\otimes B$ $mp \\times nq$'dir ve $(i,j)$-inci blogu $A_{ij} B$'dir. Somut olarak,</p>

$$\\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix} \\otimes B = \\begin{bmatrix} a_{11} B & a_{12} B \\\\ a_{21} B & a_{22} B \\end{bmatrix}.$$

<p class="l-text"><strong>vec operatoru</strong> bir matrisin sutunlarini tek bir uzun vektore istifler. $m \\times n$ bir matris $X$ icin, $\\operatorname{vec}(X) \\in \\mathbb{R}^{mn}$. Birlikte, Kronecker ve vec matris denklemlerini vektor denklemlerine cevirir, bu da matris degerli bilinmeyenlere siradan cok-degiskenli analizi uygulamak istediginizde tam ihtiyaciniz olan seydir.</p>

<div class="calc-formula"><div class="formula-label">TEMEL VEC OZDESLIGI</div><div class="formula-main">$$\\operatorname{vec}(A X B) = (B^T \\otimes A)\\, \\operatorname{vec}(X)$$</div><div class="formula-sub">$X$'te bilineer bir donusum $\\operatorname{vec}(X)$ uzerinde dogrusal bir donusum olur. $B$'nin transpoze edilmesi esastir ve bu ozdesligi kullanirken hatanin tek en yaygin kaynagidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karisik carpim</div><div class="card-body">Ic carpimlar tanimliysa $(A \\otimes B)(C \\otimes D) = (AC) \\otimes (BD)$. Kronecker carpim zincirlerini sadelestirmenizi saglar.</div></div>
<div class="calc-card"><div class="card-title">Transpoze</div><div class="card-body">$(A \\otimes B)^T = A^T \\otimes B^T$. Transpoze Kronecker uzerine dagilir.</div></div>
<div class="calc-card"><div class="card-title">Ters</div><div class="card-body">$A$ ve $B$ kare ve tersinir oldugunda $(A \\otimes B)^{-1} = A^{-1} \\otimes B^{-1}$.</div></div>
<div class="calc-card"><div class="card-title">Iz</div><div class="card-body">$\\operatorname{tr}(A \\otimes B) = \\operatorname{tr}(A) \\operatorname{tr}(B)$. Hosca carpimsal.</div></div>
</div>

<div id="plot-kron-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var A = [[1,2],[3,4]];
var B = [[5,6],[7,8]];
var Z = [];
for(var i=0;i<2;i++){
  for(var p=0;p<2;p++){
    var row = [];
    for(var j=0;j<2;j++){
      for(var q=0;q<2;q++){
        row.push(A[i][j]*B[p][q]);
      }
    }
    Z.push(row);
  }
}
var text = Z.map(function(r){return r.map(function(v){return String(v);});});
var trace = {z:Z,type:"heatmap",colorscale:[[0,"#0a0a0f"],[0.3,"#1a1a2e"],[0.6,"#3b82f6"],[1,"#a78bfa"]],text:text,texttemplate:"%{text}",showscale:false};
var shapes = [
  {type:"rect",x0:-0.5,y0:-0.5,x1:1.5,y1:1.5,line:{color:"#f59e0b",width:2}},
  {type:"rect",x0:1.5,y0:-0.5,x1:3.5,y1:1.5,line:{color:"#f59e0b",width:2}},
  {type:"rect",x0:-0.5,y0:1.5,x1:1.5,y1:3.5,line:{color:"#f59e0b",width:2}},
  {type:"rect",x0:1.5,y0:1.5,x1:3.5,y1:3.5,line:{color:"#f59e0b",width:2}}
];
var ann = [
  {x:0.5,y:-1.1,text:"a11*B",showarrow:false,font:{color:"#22c55e",size:11}},
  {x:2.5,y:-1.1,text:"a12*B",showarrow:false,font:{color:"#22c55e",size:11}},
  {x:0.5,y:4.1,text:"a21*B",showarrow:false,font:{color:"#22c55e",size:11}},
  {x:2.5,y:4.1,text:"a22*B",showarrow:false,font:{color:"#22c55e",size:11}}
];
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{showgrid:false,zeroline:false,visible:false},yaxis:{showgrid:false,zeroline:false,visible:false,autorange:"reversed"},margin:{t:40,r:30,b:50,l:30},height:340,shapes:shapes,annotations:ann};
Plotly.newPlot("plot-kron-tr",[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>$A \\otimes B$'nin blok yapisi.</strong> $A = [[1,2],[3,4]]$ ve $B = [[5,6],[7,8]]$ icin Kronecker carpimi $B$'nin dort olcekli kopyasindan olusan $4 \\times 4$ bir matristir. Her turuncu cizgili blok $a_{ij} B$'dir. Herhangi bir bloga bakmak size $A$'dan carpan skaleri verir; bir blogun icine bakmak $B$'nin yapisini gosterir. Bu blok-yapisi gorseli vec ozdesliklerini hatirlamayi kolaylastiran seydir: <em>$X$'in sutunlari aciliyor, $A$'nin bloklari olarak $B$'nin sutunlariyla carpiliyor.</em></div></div>

<h3 class="l-sub">5.1 Bunun geri yayilim icin neden onemli oldugu</h3>

<p class="l-text">Ileri gecisin $\\mathbf{y} = W \\mathbf{x}$ oldugu bir parametre matrisi $W$'ye gore bir kaybin gradyanini istediginizi varsayin. Eleman eleman Jacobian $\\partial \\mathbf{y}/\\partial W$ uc-indeksli bir tensordur, manipule etmesi gariptir. vec kullanarak:</p>

$$\\operatorname{vec}(\\mathbf{y}) = \\operatorname{vec}(W \\mathbf{x}) = (\\mathbf{x}^T \\otimes I) \\operatorname{vec}(W).$$

<p class="l-text">Simdi $\\operatorname{vec}(W)$ ile $\\mathbf{y}$ arasindaki iliski duz bir matris denklemidir; bolum 2 ve 3'teki siradan gradyan analizini uygulayabilirsiniz. Geri vec aldiktan sonra tanidik PyTorch sonucu $\\nabla_W L = \\nabla_y L \\cdot \\mathbf{x}^T$ ortaya cikar. vec/kron makinesi bunun otomatik olarak dusmesini saglar ve daha karmasik katmanlarda saglam kalir.</p>

<h2 class="lesson-title">6. Softmax Jacobian: Tam Turetim</h2>

<p class="l-text">Softmax fonksiyonu logit vektorunu olasilik dagilimina esleyen:</p>

$$\\mathbf{s} = \\operatorname{softmax}(\\mathbf{x}), \\qquad s_i = \\frac{e^{x_i}}{\\sum_k e^{x_k}}.$$

<p class="l-text">Jacobian'ini $\\partial \\mathbf{s}/\\partial \\mathbf{x}$ istiyoruz. Her koordinat uzerinde bolum kurali ile, $Z = \\sum_k e^{x_k}$:</p>

$$\\frac{\\partial s_i}{\\partial x_j} = \\frac{(\\partial_j e^{x_i}) Z - e^{x_i} (\\partial_j Z)}{Z^2} = \\frac{\\delta_{ij} e^{x_i} Z - e^{x_i} e^{x_j}}{Z^2}.$$

<p class="l-text">Pay ve paydayi $Z^2$'ye bolun ve $e^{x_i}/Z = s_i$ ile $e^{x_j}/Z = s_j$ olduklarini taniyin:</p>

$$\\frac{\\partial s_i}{\\partial x_j} = s_i (\\delta_{ij} - s_j) = s_i \\delta_{ij} - s_i s_j.$$

<div class="calc-formula"><div class="formula-label">SOFTMAX JACOBIAN</div><div class="formula-main">$$J = \\frac{\\partial \\mathbf{s}}{\\partial \\mathbf{x}} = \\operatorname{diag}(\\mathbf{s}) - \\mathbf{s} \\mathbf{s}^T$$</div><div class="formula-sub">Simetrik, pozitif yari-tanimli, rank $n-1$ olan bir matris. Cekirdegi tum-birler yonudur (her logite bir sabit eklemek softmax'i degistirmez).</div></div>

<h3 class="l-sub">6.1 Carpraz entropi ile birlesim: meshur $\\mathbf{s} - \\mathbf{y}$</h3>

<p class="l-text">Bir one-hot hedef $\\mathbf{y}$'ye karsi carpraz entropi $L = -\\sum_i y_i \\log s_i$. Logit'lere gore gradyani</p>

$$\\nabla_{\\mathbf{x}} L = \\left(\\nabla_{\\mathbf{s}} L\\right) J, \\qquad \\nabla_{\\mathbf{s}} L = -\\mathbf{y}/\\mathbf{s} \\text{ bilesen bilesen}.$$

<p class="l-text">Carpimi hesaplama:</p>

$$\\left(\\nabla_{\\mathbf{x}} L\\right)_j = \\sum_i \\left(-\\frac{y_i}{s_i}\\right) (s_i \\delta_{ij} - s_i s_j) = -y_j + s_j \\sum_i y_i = s_j - y_j$$

<p class="l-text">son adim one-hot hedef icin $\\sum_i y_i = 1$ kullanir. Jacobian-gradyan carpim derin ogrenmedeki en temiz formule cokmus oldu: <strong>tahmin edilen olasilik eksi one-hot etiket</strong>. Her modern framework softmax ve carpraz entropiyi tek bir op'a kaynastirir tam olarak acik Jacobian'i atlamak ve $\\mathbf{s} - \\mathbf{y}$'yi dogrudan vermek icin.</p>

<div id="plot-softmax-jac-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var x = [1.0, 2.0, 0.5, 1.5];
var ex = x.map(function(v){return Math.exp(v);});
var Z = ex.reduce(function(a,b){return a+b;},0);
var s = ex.map(function(v){return v/Z;});
var J = [];
for(var i=0;i<4;i++){
  var row = [];
  for(var j=0;j<4;j++){
    var d = (i===j)?1:0;
    row.push(+(s[i]*(d - s[j])).toFixed(4));
  }
  J.push(row);
}
var text = J.map(function(r){return r.map(function(v){return v.toFixed(3);});});
var trace = {z:J,type:"heatmap",colorscale:[[0,"#1e3a8a"],[0.5,"#0a0a0f"],[1,"#3b82f6"]],zmid:0,text:text,texttemplate:"%{text}",showscale:true,colorbar:{tickfont:{color:"#ebe6dc"}}};
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{tickvals:[0,1,2,3],ticktext:["x_1","x_2","x_3","x_4"],side:"top"},yaxis:{tickvals:[0,1,2,3],ticktext:["s_1","s_2","s_3","s_4"],autorange:"reversed"},margin:{t:60,r:20,b:30,l:60},height:340};
Plotly.newPlot("plot-softmax-jac-tr",[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Softmax Jacobian isi haritasi.</strong> Logit'ler $[1.0, 2.0, 0.5, 1.5]$, yaklasik softmax olasiliklarini $[0.22, 0.59, 0.13, 0.36]$ verir. Kosegen girdileri pozitif ($s_i (1 - s_i)$), kosegen disi girdiler negatif ($-s_i s_j$) ve her satir sifira toplanir — her logite bir sabit eklemek softmax'i degistirmez, yani $J \\mathbf{1} = \\mathbf{0}$. Matris simetrik, pozitif yari-tanimli ve rank 3 (boyutundan bir az).</div></div>

<h2 class="lesson-title">7. LayerNorm Geri Yayilimi Tam Detayda</h2>

<p class="l-text">LayerNorm transformer'larda kanonik normallestirme katmanidir. Tek bir ozellik vektoru $\\mathbf{x} \\in \\mathbb{R}^d$ icin ileri gecis</p>

$$\\mu = \\frac{1}{d} \\sum_i x_i, \\qquad \\sigma^2 = \\frac{1}{d} \\sum_i (x_i - \\mu)^2, \\qquad \\hat{x}_i = \\frac{x_i - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}, \\qquad y_i = \\gamma_i \\hat{x}_i + \\beta_i.$$

<p class="l-text">Geri gecis $\\partial L/\\partial \\mathbf{y}$ verildiginde $\\partial L/\\partial \\mathbf{x}$'e ihtiyac duyar. Uc bagimlilik zinciri: $\\mathbf{y}$ $\\hat{\\mathbf{x}}$'a bagli, o da $\\mathbf{x}$'a dogrudan, $\\mu(\\mathbf{x})$'a ve $\\sigma^2(\\mathbf{x})$'a bagli. Gradyani uctaden de geciriyoruz.</p>

<h3 class="l-sub">7.1 Birinci adim: $L$'nin $\\hat{\\mathbf{x}}$'a gore gradyani</h3>

<p class="l-text">$y_i = \\gamma_i \\hat{x}_i + \\beta_i$ eleman elemanli olduğundan,</p>

$$\\frac{\\partial L}{\\partial \\hat{x}_i} = \\frac{\\partial L}{\\partial y_i} \\gamma_i.$$

<h3 class="l-sub">7.2 Ikinci adim: $L$'nin $\\sigma^2$ ve $\\mu$'ya gore gradyani</h3>

<p class="l-text">$\\sigma^2$ icin $\\hat{x}_i = (x_i - \\mu) (\\sigma^2 + \\epsilon)^{-1/2}$'yi turevliyoruz:</p>

$$\\frac{\\partial L}{\\partial \\sigma^2} = \\sum_i \\frac{\\partial L}{\\partial \\hat{x}_i} \\cdot (x_i - \\mu) \\cdot \\left(-\\frac{1}{2}\\right) (\\sigma^2 + \\epsilon)^{-3/2}.$$

<p class="l-text">$\\mu$ icin hem dogrudan bagimlilik ($\\hat{x}_i$'in payinda $-\\mu$ var) hem $\\sigma^2$ uzerinden dolayli bagimlilik katkida bulunur:</p>

$$\\frac{\\partial L}{\\partial \\mu} = -\\frac{1}{\\sqrt{\\sigma^2 + \\epsilon}} \\sum_i \\frac{\\partial L}{\\partial \\hat{x}_i} + \\frac{\\partial L}{\\partial \\sigma^2} \\cdot \\frac{-2}{d} \\sum_i (x_i - \\mu).$$

<p class="l-text">Ikinci toplam $\\mu$'nun tanimi geregi $\\sum_i (x_i - \\mu) = 0$ olduğundan kaybolur. Yani</p>

$$\\frac{\\partial L}{\\partial \\mu} = -\\frac{1}{\\sqrt{\\sigma^2 + \\epsilon}} \\sum_i \\frac{\\partial L}{\\partial \\hat{x}_i}.$$

<h3 class="l-sub">7.3 Ucuncu adim: $L$'nin $\\mathbf{x}$'a gore gradyani</h3>

<p class="l-text">Uc patika uzerinden zincir kurali ve sadelestirme:</p>

$$\\frac{\\partial L}{\\partial x_i} = \\frac{1}{d \\sqrt{\\sigma^2 + \\epsilon}} \\left[ d \\frac{\\partial L}{\\partial \\hat{x}_i} - \\sum_k \\frac{\\partial L}{\\partial \\hat{x}_k} - \\hat{x}_i \\sum_k \\frac{\\partial L}{\\partial \\hat{x}_k} \\hat{x}_k \\right].$$

<div class="calc-formula"><div class="formula-label">KAYNASTIRILMIS LAYERNORM GERI</div><div class="formula-main">$$\\frac{\\partial L}{\\partial \\mathbf{x}} = \\frac{1}{d \\sqrt{\\sigma^2 + \\epsilon}} \\bigl( d \\mathbf{g} - \\mathbf{1} (\\mathbf{1}^T \\mathbf{g}) - \\hat{\\mathbf{x}} (\\hat{\\mathbf{x}}^T \\mathbf{g}) \\bigr), \\qquad \\mathbf{g} = \\gamma \\odot \\nabla_{\\mathbf{y}} L$$</div><div class="formula-sub">$\\odot$ eleman elemanli carpimdir. Iki ic carpim $\\mathbf{1}^T \\mathbf{g}$ ve $\\hat{\\mathbf{x}}^T \\mathbf{g}$ her biri tek bir skalerdir, dolayisiyla kaynastirilmis cekirdek maliyeti $O(d)$ bellek band genisligi ve $O(d)$ FLOP'tur — ileri gecisle ayni.</div></div>

<div class="l-warn"><strong>fp16 tuzagi.</strong> Kaynastirilmis formdaki iki ic carpim $d$ carpimin toplamlaridir. $d = 4096$'da yari hassasiyette akan toplam, $\\hat{\\mathbf{x}}$ ortalanmissa felaketsel iptal vurmadan once 11 mantis biti kaybedebilir. Uretim transformer'lari bu yuzden modelin geri kalani fp16 ya da bf16 olsa bile LayerNorm istatistiklerini fp32'de hesaplar. PyTorch kaynastirilmis cekirdegi bu yukseltmeyi otomatik uygular; LayerNorm'u saf fp16'da elle yazarsaniz, birkac yuz adim sonra NaN'lar bekleyin.</div>

<h2 class="lesson-title">8. Dort Einsum Satiri Olarak Cok-Basli Dikkat</h2>

<p class="l-text">Cok-basli dikkat modern derin ogrenmede en cok yazilan islemdir. Elle yazilmis surum alti ila sekiz satir reshape, transpose, matmul, mask, softmax, matmul, reshape. einsum ile her biri net anlama sahip dort satira indirilir. Asagida kullanilan sekil sozlesmesi: $b$ yigin, $n$ sorgu uzunlugu, $m$ anahtar uzunlugu, $h$ baslar, $d$ bas basina boyut.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

def attention(Q, K, V, mask=None):
    # Q: (b, n, h, d)   K: (b, m, h, d)   V: (b, m, h, d)
    d = Q.shape[-1]
    scores = np.einsum("bnhd,bmhd-&gt;bhnm", Q, K) / np.sqrt(d)
    if mask is not None:
        scores = scores + mask                       # broadcast (b,h,n,m)
    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights = weights / weights.sum(axis=-1, keepdims=True)
    out = np.einsum("bhnm,bmhd-&gt;bnhd", weights, V)  # (b, n, h, d)
    return out</code></pre></div>

<p class="l-text">einsum dizgilerini cumle gibi okuyun. <code>bnhd,bmhd -&gt; bhnm</code> der ki: $Q$ ve $K$'dan bas basina boyut $d$'yi al, daralt, yigin, baslari ve iki dizi uzunlugunu tut. Cikti baslari sorgulardan once koyar ki son eksen ustundeki softmax anahtarlari kapsasin. <code>bhnm,bmhd -&gt; bnhd</code> der ki: anahtarlari daralt, bas-ucuncu-eksen duzenini geri yukle, bas basina boyutu olduğu gibi birak. Transpoze yok, view yok, contiguous cagrisi yok. Derleyici hepsini sizin icin yapar.</p>

<div id="plot-attn-timing-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var seqs = [64,128,256,512,1024,2048,4096];
var einsumTime = seqs.map(function(n){return Math.log10(n*n*64/1e6 + 0.01);});
var naiveTime = seqs.map(function(n){return Math.log10(n*n*64*3/1e6 + 0.03);});
var t1 = {x:seqs,y:einsumTime,mode:"lines+markers",name:"einsum (tek op)",line:{color:"#3b82f6",width:3},marker:{size:9,color:"#3b82f6"}};
var t2 = {x:seqs,y:naiveTime,mode:"lines+markers",name:"reshape+matmul (4 op)",line:{color:"#f59e0b",width:3,dash:"dash"},marker:{size:9,color:"#f59e0b"}};
var layout = {paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{type:"log",title:"dizi uzunlugu",gridcolor:"rgba(255,255,255,0.08)"},yaxis:{title:"log10 zaman (ms, modellenen)",gridcolor:"rgba(255,255,255,0.08)"},margin:{t:50,r:30,b:60,l:70},height:360,legend:{x:0.05,y:0.95,bgcolor:"rgba(0,0,0,0.3)",font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-attn-timing-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Modellenen zamanlar.</strong> $d = 64$'te dikkat skorlari icin tek bir einsum cagrisini (mavi) esdeger reshape-matmul-transpose zincirine (turuncu) karsi karsilastiran tamamen egitsel bir taslak. Sabit kayma op cagrisi basina sabit Python yukunu yansitir. Dizi uzunlugu buyudukce einsum cizgisi ondedir cunku operasyon cekirdegi tum reshape'leri dahili olarak yonetir ve daraltma sirasi optimum secilir. Gercek donanimda tensorler CPU onbellegini astiginda fark daralir, ama einsum yuzde besten fazla nadiren kaybeder.</div></div>

<h2 class="lesson-title">9. Dikkatin Geri Yayilimi — Hepsi Einsum'da</h2>

<p class="l-text">Ileri dort satirsa geri alti satirdir. Bir kez turetin, sonsuza dek yazin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Verilen: dout sekli (b, n, h, d)
# Ileriden onbelleklenen: Q, K, V, weights

# dV: dout'u "bhnm,bmhd-&gt;bnhd" uzerinden geri cek
dV = np.einsum("bnhd,bhnm-&gt;bmhd", dout, weights)

# dweights: dout'u V uzerinden geri cek
dweights = np.einsum("bnhd,bmhd-&gt;bhnm", dout, V)

# Softmax Jacobian-vektor carpimi, her bas ve her sorgu icin uygulandi
dscores = weights * (dweights - np.einsum("bhnm,bhnm-&gt;bhn",
                                          weights, dweights)[..., None])

# Olcekle
dscores = dscores / np.sqrt(Q.shape[-1])

# dQ ve dK skorlar einsum'undan gelir
dQ = np.einsum("bhnm,bmhd-&gt;bnhd", dscores, K)
dK = np.einsum("bhnm,bnhd-&gt;bmhd", dscores, Q)</code></pre></div>

<p class="l-text">Her satir, bolum 3'teki ozdesliklerin bolum 6'daki softmax Jacobian'i ile birlestirilmis kontrollu bir uygulamasidir. Olmasi gereken disinda hicbir tensor maddilestirilmez; ileri gecisle ayni bellek trafigi deseni. Bu temelde FlashAttention'in yaptigi seydir, $n \\times m$ skorlar matrisini global bellekten uzak tutan dosenmeli yeniden hesaplama stratejisi disinda.</p>

<h2 class="lesson-title">10. Ozdeslikleri Sayisal Olarak Dogrulamak</h2>

<p class="l-text">Yeni bir ozdeslik her turettiginizde sonlu fark karsilastirmasi ile mantik kontrolu yapin. Cok kucuk bir problem secin (mesela $d = 5$), gradyani analitik olarak hesaplayin, sayisal olarak simetrik farkla $(f(\\mathbf{x} + h \\mathbf{e}_i) - f(\\mathbf{x} - h \\mathbf{e}_i)) / (2h)$ hesaplayin ve karsilastirin. $10^{-6}$ altinda farklar analitik formulu onaylar; $10^{-2}$ civari farklar genellikle transpoze ya da isaret hatasini gosterir.</p>

<div class="calc-example"><div class="example-label">SONLU FARK KONTROLU</div><div class="example-body">
$A$ simetrik olmayan icin $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$ icin analitik gradyan $\\mathbf{x}^T (A + A^T)$. Her ikisini sayisal hesapla ve karsilastir:<br><br>
<code>x = np.random.randn(5)<br>
A = np.random.randn(5, 5)<br>
analytic = x @ (A + A.T)<br>
h = 1e-5<br>
numerical = np.array([(f(x + h*e_i) - f(x - h*e_i)) / (2*h) for i in range(5)])<br>
print(np.allclose(analytic, numerical))  # True</code><br><br>
Bu, PyTorch'un <code>gradcheck</code> icin kullandigi tam ayni numaradir ve turetim hatalarinin yuzde 90'ini yakalar.</div></div>

<div class="l-note"><strong>Asagidaki etkilesimli Python laboratuvari tum ozdeslikleri calistirmaniza, softmax geri yayilimini sifirdan turetmeniz ve einsum'u naif matmul'a karsi olculendirmenize olanak verir.</strong> NumPy zaten yuklu. Herhangi bir RUN dugmesine tiklayarak yurutun. Kodu degistirin ve kesfedin.</div>

<h2 class="lesson-title">11. Pratik Ipuclari ve Yaygin Tuzaklar</h2>

<p class="l-text">Tum makineler yerinde olsa bile pratisyenleri isiran bes tekrarlayan konu vardir. Bunlari acikca isaret etmek asagi yondeki saatlerce hata ayiklamadan tasarruf ettirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Duzen kaymasi</div><div class="card-body">Bir turetimi pay duzeninde baslayip ortada gizlice payda duzenine kayar ve sonunda kazara transpoze edilmis bir Jacobian elde edersiniz. Cozum: kagit uzerinde her turevin yanina giris/cikti sekillerini yazin ve zincir kurali altinda dogru carpildiklarini kontrol edin.</div></div>
<div class="calc-card"><div class="card-title">Unutulan transpoze vec ozdesliginde</div><div class="card-body">$\\operatorname{vec}(AXB) = (B^T \\otimes A) \\operatorname{vec}(X)$. $B^T$ pazarliksizdir. vec/kron hatalarinin yarisi burada eksik ya da yer degisik transpozedir.</div></div>
<div class="calc-card"><div class="card-title">Softmax tasmasi</div><div class="card-body">Buyuk logitler icin $e^{x_i}$'yi dogrudan hesaplamak fp32'de $x = 88$ civari tasar. Ustellestirmeden once her zaman maksimum logiti cikartin — hem ileri hem geri.</div></div>
<div class="calc-card"><div class="card-title">Einsum harf asiri kullanimi</div><div class="card-body">Derin kodda einsum tek harfler hizla bitkin duser. Degisken yigin eksenleri icin uc nokta <code>...</code> kullanin ve karmasik bir op uzerinde calisirken PyTorch isimli-tensor'larda aciklayici cok-harfli eksen adlarini tercih edin.</div></div>
<div class="calc-card"><div class="card-title">Normallestirmede hassasiyet karistirma</div><div class="card-body">Bolum 7 uyardigi gibi: LayerNorm ya da RMSNorm istatistiklerini asla fp16'da hesaplamayin. Indirgeme icin fp32'ye yukseltin, sonra sonucu geri kucultmek. Cogu modern framework bunu otomatik yapar; saf Python uygulamalari yapmaz.</div></div>
</div>

<p class="l-text">Bahsetmeye degecek altinci ipucu: egitim duraganlasip kayip yaylada kaldiginda, her LayerNorm uzerinden akan gradyanlarin normunu olcun. $\\hat{\\mathbf{x}}$ uzerinden gradyanin patladigini gorurseniz (norm katman katman buyuyor), ya yukari yonde softmax tasmaniz ya da asagi yonde olceklenmemis bir kalinti baglantiniz var. Bu derste ogrendiginiz matris analizi bu sorunlar icin teshis dilidir — onsuz hiperparametrelerde rastgele dürtüyor olurdunuz.</p>

<h2 class="lesson-title">Ozet ve Bir Sonraki Derse Baglanti</h2>

<p class="l-text">Matris analizi defter tutmasi dogru yapilmis tensorler uzerinde zincir kuralini size verir. On ozdeslik her yaygin derin-ogrenme kaybinin gradyanini kapsar. Softmax Jacobian'i en temiz ornektir: uc satirda turetilmis ve carpraz entropi ile birlestirilip meshur kalinti gradyanini vermek icin. LayerNorm geri yayilimi daha karisik gercek-dunya surumudur: tek bir $O(d)$ cekirdege kaynastirilmis uc zincirleme bagimlilik. einsum, tum bunlari derleyicinin ciddiye alabilecegi kodda yazmaniza olanak veren notasyondur ve Kronecker + vec, siradan analizin aksi takdirde indekslerde boğulacagi yerde herhangi bir matris denklemini bir vektor denklemine duzlestirmenizi saglar. Bunlar birlikte, her transformer muhendisinin bir geri yayilim fonksiyonu yazdiginda ya da okudugunda sessizce uyguladigi araclardir. Buradan sonraki track olasilik ve bilgi teorisine giriyor — burada turettiginiz gradyanlarin varyasyonel alt sinirlarin, karsilikli bilgi tahmincilerinin ve takviyeli ogrenmenin politika gradyanlarinin icinde yeniden gorunecegi yer.</p>
`
};
