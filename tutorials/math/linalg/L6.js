window.LINALG_L6 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text"><strong>A tensor is not a multidimensional array.</strong> An array is a way to <em>store</em> numbers; a tensor is a geometric object whose components happen to fit into such a storage. The distinction is not pedantic: it is the whole reason classical mechanics, general relativity, continuum mechanics, and differential geometry can be written down at all. When physicists say "the stress tensor", "the metric tensor", or "the moment of inertia tensor", they mean an object that exists independently of any coordinate system — and whose component values transform according to a precise rule when the basis is changed. The array is only one of infinitely many faithful descriptions of the same underlying geometric thing.</p>

<p class="l-text">This lesson develops tensors the way mathematicians do: as <strong>multilinear maps</strong>. We will define the tensor product $\\otimes$, work in Einstein summation index notation, separate covariant and contravariant indices, look at outer products and contractions, and finish with the three classical tensors that gave the subject its physical urgency — the stress tensor of Cauchy, the metric tensor of Riemann, and the inertia tensor of the rigid body. By the end you should be able to read $T^{ij}{}_{kl}$ aloud, change the basis on a $(0,2)$ tensor, and compute a partial contraction without consulting a textbook.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a tensor as a multilinear map and distinguish tensor order from matrix rank</li>
<li>Construct the tensor product $V \\otimes W$ of two vector spaces and read its dimension</li>
<li>Use Einstein summation convention to manipulate $T^{ij}{}_{kl}$ expressions cleanly</li>
<li>Apply the covariant and contravariant transformation rules under a change of basis</li>
<li>Compute outer products $\\mathbf{u} \\otimes \\mathbf{v}$ and recognise rank-one tensors</li>
<li>Contract a pair of indices and recover trace, divergence, and inner products as special cases</li>
<li>Read the stress, metric, and inertia tensors and identify their order and symmetry</li>
</ul>
</div>

<h2 class="l-title">1. From Scalar to Vector to Matrix to Tensor</h2>

<div class="calc-highlight"><strong>Core idea:</strong> the progression scalar $\\to$ vector $\\to$ matrix $\\to$ tensor is not "more numbers" but "more arguments". A scalar is a function of zero vectors. A vector (via inner product) is a linear function of one vector. A matrix is a bilinear function of two vectors. A tensor of order $k$ is a multilinear function of $k$ vectors.</div>

<p class="l-text">Begin with the familiar objects and ask, for each, <em>what does it eat and what does it produce?</em> The answers, taken together, force the definition of a tensor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scalar</div><div class="card-body">An element of the underlying field, typically $\\mathbb{R}$. Eats nothing, returns a number. Order $0$. Examples: temperature at a point, mass, electric charge, the determinant of a square matrix.</div></div>
<div class="calc-card"><div class="card-title">Vector</div><div class="card-body">An element of a vector space $V$. Equivalently, via the inner product, a linear map $V^* \\to \\mathbb{R}$ — eats one covector, returns a number. Order $1$. Examples: position, velocity, force.</div></div>
<div class="calc-card"><div class="card-title">Matrix (as bilinear form)</div><div class="card-body">A bilinear map $V \\times V \\to \\mathbb{R}$ sending $(\\mathbf{u}, \\mathbf{v}) \\mapsto \\mathbf{u}^\\top A \\mathbf{v}$. Order $2$. Examples: the metric $g_{ij}$ measuring lengths, the second fundamental form of a surface.</div></div>
<div class="calc-card"><div class="card-title">Tensor of order $k$</div><div class="card-body">A multilinear map $V \\times V \\times \\cdots \\times V \\to \\mathbb{R}$ ($k$ slots). Equivalently, an element of $V^{\\otimes k}$ or of an appropriate tensor product space. Order $k$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">THE COMMON THREAD</div><div class="formula-main">$$\\text{Scalar} = T(\\,) , \\quad \\text{Vector} = T(\\boldsymbol{\\omega}), \\quad \\text{Matrix} = T(\\mathbf{u}, \\mathbf{v}), \\quad \\text{Tensor of order } k = T(\\mathbf{v}_1, \\mathbf{v}_2, \\ldots, \\mathbf{v}_k).$$</div><div class="formula-sub">"Order" counts how many vector slots a tensor has. Every entry is required to be linear in <em>each</em> argument with the others held fixed.</div></div>

<p class="l-text"><strong>Why this view, not the array view?</strong> If you only ever needed to <em>store</em> numbers, an array would suffice. But the moment you want to <em>change coordinates</em> — rotate the frame, switch from Cartesian to spherical, push a vector through a coordinate transformation — the storage view is not enough. You need a rule that tells you how the numbers in the array transform. That rule is forced by, and only by, the multilinear-map definition. Mathematical tensors come with their transformation law baked in; bare arrays do not.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: TWO BILINEAR FORMS ON $\\mathbb{R}^2$</div><div class="example-body">Let $g(\\mathbf{u}, \\mathbf{v}) = u_1 v_1 + u_2 v_2$ be the standard dot product, and let $h(\\mathbf{u}, \\mathbf{v}) = 2 u_1 v_1 + u_1 v_2 + u_2 v_1 + 3 u_2 v_2$. Both are bilinear maps $\\mathbb{R}^2 \\times \\mathbb{R}^2 \\to \\mathbb{R}$. Their matrices in the standard basis are $G = I$ and $H = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$. Both are tensors of order $2$. They are different geometric objects even though their arrays have the same shape $(2,2)$.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If a tensor "really is" a multilinear map, why do we ever write down its components in a basis? <em>Answer: because real computations require numbers. The components are a faithful description in one basis; the multilinear-map definition tells us how to translate them when we switch bases.</em></div></div>

<h2 class="l-title">2. Tensors as Multilinear Maps</h2>

<p class="l-text">Fix a finite-dimensional real vector space $V$ with dual space $V^*$. A <strong>tensor of type $(p, q)$</strong> — also called a $(p, q)$-tensor or a tensor with $p$ contravariant and $q$ covariant indices — is a multilinear map</p>

<div class="calc-formula"><div class="formula-label">TYPE $(p,q)$ TENSOR</div><div class="formula-main">$$T : \\underbrace{V^* \\times V^* \\times \\cdots \\times V^*}_{p \\text{ copies}} \\;\\times\\; \\underbrace{V \\times V \\times \\cdots \\times V}_{q \\text{ copies}} \\;\\to\\; \\mathbb{R}.$$</div><div class="formula-sub">Multilinear means linear in each argument separately: $T(\\ldots, \\alpha \\mathbf{v} + \\beta \\mathbf{w}, \\ldots) = \\alpha\\, T(\\ldots, \\mathbf{v}, \\ldots) + \\beta\\, T(\\ldots, \\mathbf{w}, \\ldots)$ for each slot.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$(0, 0)$</div><div class="card-body">No slots: just a real number. Order $0$, a <strong>scalar</strong>.</div></div>
<div class="calc-card"><div class="card-title">$(1, 0)$</div><div class="card-body">One covector slot: a linear functional on $V^*$ — that is, a <strong>vector</strong> in $V$ itself. Order $1$, contravariant.</div></div>
<div class="calc-card"><div class="card-title">$(0, 1)$</div><div class="card-body">One vector slot: a linear functional on $V$ — that is, a <strong>covector</strong> in $V^*$. Order $1$, covariant.</div></div>
<div class="calc-card"><div class="card-title">$(1, 1)$</div><div class="card-body">One covector and one vector slot: bilinear, isomorphic to <strong>linear endomorphisms</strong> $V \\to V$. Includes the identity map, all square matrices viewed as transformations.</div></div>
<div class="calc-card"><div class="card-title">$(0, 2)$</div><div class="card-body">Two vector slots, returning a number: <strong>bilinear forms</strong>. Includes inner products, the metric tensor, the second fundamental form.</div></div>
<div class="calc-card"><div class="card-title">$(2, 0)$</div><div class="card-body">Two covector slots: think of it as a linear combination of $\\mathbf{u} \\otimes \\mathbf{v}$ where $\\mathbf{u}, \\mathbf{v} \\in V$ — for instance the inverse metric $g^{ij}$.</div></div>
</div>

<p class="l-text">If $V$ has dimension $n$ with basis $\\{\\mathbf{e}_1, \\ldots, \\mathbf{e}_n\\}$ and $V^*$ has the dual basis $\\{\\mathbf{e}^1, \\ldots, \\mathbf{e}^n\\}$ defined by $\\mathbf{e}^i(\\mathbf{e}_j) = \\delta^i_j$, then a $(p, q)$ tensor $T$ is completely determined by its $n^{p+q}$ components</p>

<div class="calc-formula"><div class="formula-label">COMPONENTS IN A BASIS</div><div class="formula-main">$$T^{i_1 \\cdots i_p}{}_{j_1 \\cdots j_q} \\;\\equiv\\; T(\\mathbf{e}^{i_1}, \\ldots, \\mathbf{e}^{i_p}, \\mathbf{e}_{j_1}, \\ldots, \\mathbf{e}_{j_q}).$$</div><div class="formula-sub">Upper indices count contravariant slots (covectors fed in). Lower indices count covariant slots (vectors fed in). Total order is $p + q$.</div></div>

<p class="l-text">The collection of all $(p, q)$ tensors on $V$ forms a vector space — call it $T^p_q(V)$ — of dimension $n^{p+q}$. A scalar lives in a $1$-dimensional space, a vector or covector in an $n$-dimensional space, a $(1,1)$ or $(0,2)$ tensor in an $n^2$-dimensional space, and so on. This dimension count will reappear in section 4 once we have the tensor product in hand.</p>

<div class="l-note"><strong>Notation conventions vary.</strong> Some authors call a $(p, q)$-tensor an "order-$(p+q)$" tensor and reserve "rank" for the lowest number of simple tensors needed to express it (see section 3). Others use "rank" and "order" interchangeably. In this lesson <em>order</em> always means the total number of slots; <em>rank</em> is reserved for decomposition.</p>

<h2 class="l-title">3. Tensor Order/Rank vs Matrix Rank</h2>

<div class="calc-highlight"><strong>A crucial distinction.</strong> A matrix has both an <em>order</em> (always $2$, because matrices are $(0,2)$ or $(1,1)$ tensors) and a <em>rank</em> (between $0$ and $\\min(m, n)$, the number of linearly independent rows/columns). For general tensors these are still different concepts — but the definition of rank itself generalises in a subtle way.</div>

<p class="l-text">For matrices, the rank theorem is comforting: the column rank equals the row rank, and both equal the size of the largest non-zero minor. There is one well-defined non-negative integer attached to every matrix. For higher-order tensors none of this is true. The analogue of "row rank" and the analogue of "column rank" can differ, and computing the rank of a $3$-tensor is in general an NP-hard problem.</p>

<div class="calc-formula"><div class="formula-label">TENSOR RANK (DECOMPOSITION RANK)</div><div class="formula-main">$$\\operatorname{rank}(T) \\;=\\; \\min \\Bigl\\{\\, r \\;\\Bigm|\\; T = \\sum_{k=1}^{r} \\mathbf{u}_k \\otimes \\mathbf{v}_k \\otimes \\cdots \\otimes \\mathbf{w}_k \\,\\Bigr\\}.$$</div><div class="formula-sub">The smallest number of <strong>simple tensors</strong> (single tensor products of vectors) whose sum equals $T$. For matrices this coincides with the linear-algebra rank.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Matrix order</div><div class="card-body">Always $2$. A matrix is the same shape of object whether it has rank $1$ or rank $\\min(m, n)$.</div></div>
<div class="calc-card"><div class="card-title">Matrix rank</div><div class="card-body">Between $0$ and $\\min(m, n)$. Counts linearly independent rows/columns. Equals the smallest $r$ with $A = \\sum_{k=1}^r \\mathbf{u}_k \\mathbf{v}_k^\\top$.</div></div>
<div class="calc-card"><div class="card-title">Tensor order</div><div class="card-body">For a $(p, q)$ tensor, the order is $p + q$. A $3$-tensor stays a $3$-tensor regardless of how complicated its components are.</div></div>
<div class="calc-card"><div class="card-title">Tensor rank</div><div class="card-body">The minimum length of a decomposition into simple tensors $\\mathbf{u} \\otimes \\mathbf{v} \\otimes \\mathbf{w}$. Bounded above by $\\dim V$ in some cases but can exceed it for $k \\geq 3$.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: RANK OF A SIMPLE TENSOR</div><div class="example-body">Let $\\mathbf{u} = (1, 0)$ and $\\mathbf{v} = (0, 1)$ in $\\mathbb{R}^2$. The outer product $\\mathbf{u} \\otimes \\mathbf{v}$ has the matrix representation $\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ — order $2$, rank $1$. Adding a second simple tensor $\\mathbf{e}_2 \\otimes \\mathbf{e}_1$ gives $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ — still order $2$, but rank $2$.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why can a tensor of order $3$ have rank greater than every individual dimension? <em>Hint: rank-$r$ decompositions live in a space that is in general not closed; a generic $3$-tensor of small dimensions can require more terms than $\\dim V$ to be written exactly.</em></div></div>

<h2 class="l-title">4. The Tensor Product $\\otimes$</h2>

<p class="l-text">The <strong>tensor product</strong> is the canonical operation that combines two tensors of orders $r$ and $s$ to produce one of order $r + s$. It is the algebraic engine of multilinear algebra: every tensor space is built from copies of $V$ and $V^*$ glued together by $\\otimes$.</p>

<div class="calc-formula"><div class="formula-label">TENSOR PRODUCT OF VECTORS</div><div class="formula-main">$$(\\mathbf{u} \\otimes \\mathbf{v})(\\boldsymbol{\\alpha}, \\boldsymbol{\\beta}) \\;=\\; \\boldsymbol{\\alpha}(\\mathbf{u}) \\cdot \\boldsymbol{\\beta}(\\mathbf{v}), \\qquad \\boldsymbol{\\alpha}, \\boldsymbol{\\beta} \\in V^*.$$</div><div class="formula-sub">The right-hand side is a product of two scalars; the resulting object is a bilinear map $V^* \\times V^* \\to \\mathbb{R}$, i.e. a $(2, 0)$-tensor.</div></div>

<p class="l-text">Equivalently — and this is the more computational definition — if $\\mathbf{u}$ has components $u^i$ and $\\mathbf{v}$ has components $v^j$, then $\\mathbf{u} \\otimes \\mathbf{v}$ has components $(\\mathbf{u} \\otimes \\mathbf{v})^{ij} = u^i v^j$. The same idea applies between any two tensors: multiply their components, concatenate their index labels.</p>

<div class="calc-formula"><div class="formula-label">TENSOR PRODUCT OF SPACES</div><div class="formula-main">$$V \\otimes W \\;=\\; \\operatorname{span} \\bigl\\{\\, \\mathbf{v} \\otimes \\mathbf{w} \\;:\\; \\mathbf{v} \\in V,\\; \\mathbf{w} \\in W \\,\\bigr\\}\\!\\Big/ \\sim,$$</div><div class="formula-sub">where $\\sim$ enforces bilinearity. If $\\dim V = m$ and $\\dim W = n$, then $\\dim(V \\otimes W) = mn$. The basis is $\\{\\mathbf{e}_i \\otimes \\mathbf{f}_j\\}$ where $\\{\\mathbf{e}_i\\}$ is a basis of $V$ and $\\{\\mathbf{f}_j\\}$ a basis of $W$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bilinearity</div><div class="card-body">$(\\alpha \\mathbf{u}_1 + \\beta \\mathbf{u}_2) \\otimes \\mathbf{v} = \\alpha\\, \\mathbf{u}_1 \\otimes \\mathbf{v} + \\beta\\, \\mathbf{u}_2 \\otimes \\mathbf{v}$, and similarly in the second slot. This is exactly the defining property of $\\otimes$.</div></div>
<div class="calc-card"><div class="card-title">Non-commutative</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{v} \\neq \\mathbf{v} \\otimes \\mathbf{u}$ in general. The slots are ordered; the indices $u^i v^j$ and $v^i u^j$ describe different components of different tensors.</div></div>
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">$(U \\otimes V) \\otimes W \\cong U \\otimes (V \\otimes W)$ canonically, so we just write $U \\otimes V \\otimes W$.</div></div>
<div class="calc-card"><div class="card-title">Simple tensors</div><div class="card-body">An element of the form $\\mathbf{u} \\otimes \\mathbf{v}$ is called a <strong>simple</strong> (or <strong>decomposable</strong>) tensor. Most elements of $V \\otimes W$ are <em>not</em> simple; they are sums of several simple tensors.</div></div>
</div>

<div id="plot-linalg-l6-tensor-product-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var u=[1,2,3];var v=[4,5];
var z=[];var text=[];
for(var i=0;i<3;i++){var row=[];var trow=[];for(var j=0;j<2;j++){row.push(u[i]*v[j]);trow.push('u'+(i+1)+'·v'+(j+1)+'='+(u[i]*v[j]));}z.push(row);text.push(trow);}
var trace={z:z,type:'heatmap',colorscale:[[0,'#1a1a2e'],[0.5,'#c8a96e'],[1,'#f87171']],text:text,texttemplate:'%{text}',showscale:true,colorbar:{title:'value',tickfont:{color:'#ebe6dc'}}};
var ann=[];
for(var i=0;i<3;i++){ann.push({x:-0.7,y:i,text:'u'+(i+1)+'='+u[i],showarrow:false,font:{color:'#4ecdc4',size:13}});}
for(var j=0;j<2;j++){ann.push({x:j,y:-0.55,text:'v'+(j+1)+'='+v[j],showarrow:false,font:{color:'#a78bfa',size:13}});}
var layout={title:{text:'Outer product u ⊗ v ∈ R³ ⊗ R² has dim 3·2 = 6',font:{color:'#ebe6dc',size:14}},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{showgrid:false,zeroline:false,tickvals:[0,1],ticktext:['j=1','j=2'],side:'top'},yaxis:{showgrid:false,zeroline:false,tickvals:[0,1,2],ticktext:['i=1','i=2','i=3'],autorange:'reversed'},margin:{t:70,r:60,b:40,l:80},annotations:ann};
Plotly.newPlot('plot-linalg-l6-tensor-product-en',[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the outer product of $\\mathbf{u} = (1,2,3)$ and $\\mathbf{v} = (4,5)$. Each cell of the resulting $3 \\times 2$ array is the product $u_i v_j$ of the corresponding component from the left margin (teal) and the top margin (purple). The result lives in $\\mathbb{R}^3 \\otimes \\mathbb{R}^2$, a $6$-dimensional space. It is a rank-$1$ tensor: it can be written as a single tensor product.</div></div>

<p class="l-text">The tensor product also acts on tensor <em>spaces</em>: the space of $(p, q)$ tensors on $V$ is</p>

<div class="calc-formula"><div class="formula-label">SPACE OF $(p,q)$-TENSORS</div><div class="formula-main">$$T^p_q(V) \\;\\cong\\; \\underbrace{V \\otimes V \\otimes \\cdots \\otimes V}_{p \\text{ copies}} \\,\\otimes\\, \\underbrace{V^* \\otimes V^* \\otimes \\cdots \\otimes V^*}_{q \\text{ copies}}.$$</div><div class="formula-sub">Dimension $n^{p+q}$, as promised in section 2. The basis tensor is $\\mathbf{e}_{i_1} \\otimes \\cdots \\otimes \\mathbf{e}_{i_p} \\otimes \\mathbf{e}^{j_1} \\otimes \\cdots \\otimes \\mathbf{e}^{j_q}$.</div></div>

<h2 class="l-title">5. Index Notation (Einstein Summation Convention)</h2>

<p class="l-text"><strong>Einstein's convention:</strong> whenever an index appears once as a superscript and once as a subscript in the same term, it is implicitly summed over its range. Repeated indices that are <em>both</em> up or <em>both</em> down do not get summed automatically — that would be a notation error in standard mathematical (as opposed to library-style) conventions, because such pairs do not produce a coordinate-invariant scalar.</p>

<div class="calc-formula"><div class="formula-label">EINSTEIN SUMMATION</div><div class="formula-main">$$A^i{}_j v^j \\;\\equiv\\; \\sum_{j=1}^{n} A^i{}_j v^j, \\qquad T^i{}_i \\;\\equiv\\; \\sum_{i=1}^{n} T^i{}_i.$$</div><div class="formula-sub">The summation sign is suppressed when an index appears once up and once down. The free indices (those not summed) determine the type of the resulting tensor.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Free vs dummy indices</div><div class="card-body">A <strong>free</strong> index appears once in a term; it must appear on both sides of an equation and labels a slot. A <strong>dummy</strong> index appears twice (once up, once down) and is summed over.</div></div>
<div class="calc-card"><div class="card-title">Matrix multiplication</div><div class="card-body">$(AB)^i{}_k = A^i{}_j B^j{}_k$. The shared index $j$ is summed; the free indices $i, k$ label the rows and columns of the result.</div></div>
<div class="calc-card"><div class="card-title">Inner product</div><div class="card-body">$g_{ij} u^i v^j$ is a scalar (no free indices). The metric $g_{ij}$ converts two contravariant vectors into a number by contracting each with one of its slots.</div></div>
<div class="calc-card"><div class="card-title">Trace</div><div class="card-body">$T^i{}_i$ is a scalar: contract a $(1,1)$ tensor's two slots against each other. For a matrix this is the ordinary trace.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: REWRITING MATRIX OPERATIONS IN INDEX NOTATION</div><div class="example-body">Let $A$ be a square matrix, $\\mathbf{x}$ a column vector. Then:<br>
$\\bullet$ $\\mathbf{y} = A\\mathbf{x}$ becomes $y^i = A^i{}_j x^j$.<br>
$\\bullet$ $\\mathbf{x}^\\top A \\mathbf{y}$ becomes $A_{ij} x^i y^j$ (where $A_{ij}$ is the matrix viewed as a $(0,2)$ tensor).<br>
$\\bullet$ $\\operatorname{tr}(A)$ becomes $A^i{}_i$.<br>
$\\bullet$ $\\operatorname{tr}(AB)$ becomes $A^i{}_j B^j{}_i$.<br>
$\\bullet$ The Kronecker delta $\\delta^i_j$ is the identity tensor: $\\delta^i_j x^j = x^i$.</div></div>

<div class="calc-formula"><div class="formula-label">RAISING AND LOWERING INDICES WITH THE METRIC</div><div class="formula-main">$$v_i \\;=\\; g_{ij} v^j, \\qquad \\alpha^i \\;=\\; g^{ij} \\alpha_j.$$</div><div class="formula-sub">In a space with a metric $g_{ij}$ (with inverse $g^{ij}$ so that $g^{ik} g_{kj} = \\delta^i_j$), contravariant and covariant indices can be converted into each other. Without a metric, the distinction is genuine and cannot be eliminated.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why is the expression $T^{ii}$ not a valid Einstein-summation contraction? <em>Answer: both indices are contravariant. Summing them produces a quantity that depends on the choice of basis and is therefore not a tensor scalar. The metric must be inserted: $g_{ij} T^{ij}$ is a legitimate scalar.</em></div></div>

<h2 class="l-title">6. Covariance and Contravariance</h2>

<p class="l-text">Suppose we change the basis of $V$ from $\\{\\mathbf{e}_i\\}$ to $\\{\\mathbf{e}'_i\\}$, related by an invertible matrix $A$:</p>

<div class="calc-formula"><div class="formula-label">CHANGE OF BASIS</div><div class="formula-main">$$\\mathbf{e}'_i \\;=\\; A^j{}_i \\,\\mathbf{e}_j, \\qquad \\mathbf{e}^{\\prime i} \\;=\\; (A^{-1})^i{}_j\\, \\mathbf{e}^j.$$</div><div class="formula-sub">Basis covectors transform by the <em>inverse</em> matrix because $\\mathbf{e}^{\\prime i}(\\mathbf{e}'_j) = \\delta^i_j$ must still hold.</div></div>

<p class="l-text">A tensor exists independently of any basis. Therefore its <em>components</em> must transform in such a way that the multilinear form they describe is unchanged. The rule is forced upon us:</p>

<div class="calc-formula"><div class="formula-label">TRANSFORMATION LAW FOR $(p,q)$ TENSORS</div><div class="formula-main">$$T^{\\prime i_1 \\cdots i_p}{}_{j_1 \\cdots j_q} \\;=\\; (A^{-1})^{i_1}{}_{k_1} \\cdots (A^{-1})^{i_p}{}_{k_p}\\; A^{l_1}{}_{j_1} \\cdots A^{l_q}{}_{j_q}\\; T^{k_1 \\cdots k_p}{}_{l_1 \\cdots l_q}.$$</div><div class="formula-sub">Contravariant indices transform with $A^{-1}$; covariant indices transform with $A$. This is the precise statement that components transform "oppositely" to the basis.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Contravariant (upper index)</div><div class="card-body">Components transform with $A^{-1}$. Example: a position vector $\\mathbf{v} = v^i \\mathbf{e}_i$ has $v^{\\prime i} = (A^{-1})^i{}_j v^j$. The components "go against" the basis change.</div></div>
<div class="calc-card"><div class="card-title">Covariant (lower index)</div><div class="card-body">Components transform with $A$. Example: a gradient $\\partial_i f$ (treated as a covector) transforms with $A$. The components "co-vary" with the basis.</div></div>
<div class="calc-card"><div class="card-title">Mixed tensors</div><div class="card-body">Each upper index drags in a factor of $A^{-1}$, each lower index a factor of $A$. The number of free factors equals the order.</div></div>
<div class="calc-card"><div class="card-title">Invariants</div><div class="card-body">Scalars (type $(0,0)$) have no factors and are basis-independent: $T' = T$. A trace $T^i{}_i$ is invariant because the $A$ and $A^{-1}$ factors cancel.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: ROTATING A $(0,2)$-TENSOR</div><div class="example-body">Take the metric $g_{ij} = \\delta_{ij}$ on $\\mathbb{R}^2$ (the standard dot product). Rotate the basis by angle $\\theta$: $A = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$. The transformed components are<br>
$g'_{kl} = A^i{}_k A^j{}_l\\, g_{ij} = A^i{}_k A^j{}_l\\, \\delta_{ij} = \\sum_i A^i{}_k A^i{}_l = (A^\\top A)_{kl} = \\delta_{kl}$,<br>
since $A$ is orthogonal. The metric is invariant under rotation, as it should be — distances do not depend on orientation.</div></div>

<div id="plot-linalg-l6-cov-contra-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var theta=Math.PI/6;var c=Math.cos(theta),s=Math.sin(theta);
var v=[1.2,0.6];
var vprime=[c*v[0]+s*v[1],-s*v[0]+c*v[1]];
var e1=[1,0],e2=[0,1];
var e1p=[c,s],e2p=[-s,c];
var traces=[
{x:[0,e1[0]],y:[0,e1[1]],mode:'lines+markers',name:'e₁ (old)',line:{color:'#c8a96e',width:2}},
{x:[0,e2[0]],y:[0,e2[1]],mode:'lines+markers',name:'e₂ (old)',line:{color:'#c8a96e',width:2,dash:'dash'}},
{x:[0,e1p[0]],y:[0,e1p[1]],mode:'lines+markers',name:'e\\'₁ (new)',line:{color:'#a78bfa',width:2}},
{x:[0,e2p[0]],y:[0,e2p[1]],mode:'lines+markers',name:'e\\'₂ (new)',line:{color:'#a78bfa',width:2,dash:'dash'}},
{x:[0,v[0]],y:[0,v[1]],mode:'lines+markers',name:'v (the vector itself)',line:{color:'#f87171',width:3},marker:{size:[4,10]}},
{x:[v[0]],y:[v[1]],mode:'text',text:['v'],textposition:'top right',textfont:{color:'#f87171',size:14},showlegend:false}
];
var layout={title:{text:'Vector v is fixed; only its components change',font:{color:'#ebe6dc',size:14}},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-0.4,1.6],title:'',scaleanchor:'y'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-0.4,1.2],title:''},margin:{t:50,r:30,b:30,l:30},legend:{font:{color:'#ebe6dc',size:10}},annotations:[{x:v[0]-0.05,y:v[1]+0.1,text:'(v¹,v²)=('+v[0].toFixed(2)+','+v[1].toFixed(2)+')',showarrow:false,font:{color:'#c8a96e',size:11}},{x:v[0]-0.05,y:v[1]+0.22,text:"(v'¹,v'²)=("+vprime[0].toFixed(2)+","+vprime[1].toFixed(2)+')',showarrow:false,font:{color:'#a78bfa',size:11}}]};
Plotly.newPlot('plot-linalg-l6-cov-contra-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the geometric content of contravariance. The red arrow is the vector $\\mathbf{v}$ — a real geometric object that does not move. The gold basis $\\{\\mathbf{e}_1, \\mathbf{e}_2\\}$ is rotated by $30°$ to obtain the purple basis $\\{\\mathbf{e}'_1, \\mathbf{e}'_2\\}$. The numerical components $(v^1, v^2)$ <em>change</em> when read against the new basis, even though $\\mathbf{v}$ itself is unchanged. This is exactly the transformation $v^{\\prime i} = (A^{-1})^i{}_j v^j$ at work.</div></div>

<h2 class="l-title">7. Outer Products and Tensor Decompositions</h2>

<p class="l-text">The simplest non-trivial tensors are <strong>simple</strong> (also called <strong>pure</strong> or <strong>decomposable</strong>): they can be written as a single tensor product of vectors. An <strong>outer product</strong> is the special case of two vectors:</p>

<div class="calc-formula"><div class="formula-label">OUTER PRODUCT</div><div class="formula-main">$$(\\mathbf{u} \\otimes \\mathbf{v})^{ij} \\;=\\; u^i v^j \\qquad \\text{or equivalently} \\qquad \\mathbf{u} \\mathbf{v}^\\top \\in \\mathbb{R}^{m \\times n}.$$</div><div class="formula-sub">A matrix of rank exactly $1$ (assuming both vectors are non-zero). The columns are scalar multiples of $\\mathbf{u}$; the rows are scalar multiples of $\\mathbf{v}^\\top$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rank-$1$ matrix</div><div class="card-body">Any matrix of the form $\\mathbf{u} \\mathbf{v}^\\top$ has rank $1$. Conversely, every rank-$1$ matrix can be written this way (with the decomposition unique up to scaling).</div></div>
<div class="calc-card"><div class="card-title">Sum of outer products</div><div class="card-body">A rank-$r$ matrix can always be written as $\\sum_{k=1}^r \\mathbf{u}_k \\mathbf{v}_k^\\top$. The singular value decomposition is the canonical such expression.</div></div>
<div class="calc-card"><div class="card-title">Symmetric outer product</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{u}$ is symmetric and positive semi-definite. Used to build correlation tensors and the second-moment matrix in statistics.</div></div>
<div class="calc-card"><div class="card-title">Higher-order analogue</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{v} \\otimes \\mathbf{w}$ is a rank-$1$ tensor of order $3$ with components $u^i v^j w^k$. Sums of such terms give CP / Tucker decompositions for order-$3$ tensors.</div></div>
</div>

<p class="l-text"><strong>The CP (Canonical Polyadic) decomposition</strong> generalises SVD to higher-order tensors:</p>

<div class="calc-formula"><div class="formula-label">CP DECOMPOSITION (ORDER-$3$)</div><div class="formula-main">$$T^{ijk} \\;=\\; \\sum_{r=1}^{R} \\sigma_r\\, u_r^i\\, v_r^j\\, w_r^k.$$</div><div class="formula-sub">The smallest $R$ for which such an expression is exact is the <strong>tensor rank</strong> (section 3). Unlike the matrix case ($k = 2$), this rank can exceed every individual dimension, and computing it exactly is NP-hard in general.</div></div>

<div class="l-note"><strong>Aside.</strong> Beyond CP there are several other tensor decompositions used in pure mathematics and physics: the <strong>Tucker decomposition</strong> (a higher-order analogue of SVD with a small core tensor and orthogonal factor matrices), the <strong>tensor train</strong> (writes a high-order tensor as a chain of low-order ones), and the <strong>Schmidt decomposition</strong> (the canonical bi-partite tensor decomposition used in quantum mechanics).</div>

<h2 class="l-title">8. Contractions: Trace, Inner Product, and Beyond</h2>

<p class="l-text">A <strong>contraction</strong> reduces the order of a tensor by $2$ by summing one upper index against one lower index. It is the only basic operation that <em>removes</em> indices, and it is the source of nearly every coordinate-invariant scalar in tensor algebra.</p>

<div class="calc-formula"><div class="formula-label">CONTRACTION</div><div class="formula-main">$$C(T)^{i_1 \\cdots \\hat{i}_a \\cdots i_p}{}_{j_1 \\cdots \\hat{j}_b \\cdots j_q} \\;=\\; T^{i_1 \\cdots k \\cdots i_p}{}_{j_1 \\cdots k \\cdots j_q},$$</div><div class="formula-sub">where the $a$-th contravariant index has been identified and summed with the $b$-th covariant index. The hatted slots are removed; total order drops from $p + q$ to $p + q - 2$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trace of a $(1,1)$ tensor</div><div class="card-body">$T^i{}_i$ takes a $(1,1)$ tensor (order $2$) to a scalar (order $0$). For a matrix this is the ordinary trace $\\sum_i A_{ii}$.</div></div>
<div class="calc-card"><div class="card-title">Dot product</div><div class="card-body">$\\alpha_i v^i$ contracts the covector $\\alpha_i$ against the vector $v^i$. In Euclidean space, with the metric raising and lowering indices, this becomes the familiar $\\mathbf{u} \\cdot \\mathbf{v} = g_{ij} u^i v^j$.</div></div>
<div class="calc-card"><div class="card-title">Matrix product</div><div class="card-body">$(AB)^i{}_k = A^i{}_j B^j{}_k$ — contraction of the second index of $A$ with the first index of $B$. The result is a $(1,1)$ tensor of order $2$.</div></div>
<div class="calc-card"><div class="card-title">Partial trace</div><div class="card-body">For a $(2,2)$ tensor, contracting one pair of upper/lower indices leaves a $(1,1)$ tensor. Standard tool in quantum mechanics for reducing a bipartite state to a single subsystem.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: TRACE AS A CONTRACTION</div><div class="example-body">Let $A = \\begin{pmatrix} 2 & 3 \\\\ 5 & 7 \\end{pmatrix}$ be viewed as a $(1,1)$ tensor $A^i{}_j$. The contraction $A^i{}_i$ sums $A^1{}_1 + A^2{}_2 = 2 + 7 = 9 = \\operatorname{tr}(A)$. Under a change of basis $A' = P A P^{-1}$ the trace is invariant because $(P A P^{-1})^i{}_i = P^i{}_k A^k{}_l (P^{-1})^l{}_i = A^k{}_l \\delta^l_k = A^k{}_k$ — the $P$ and $P^{-1}$ contract against each other, leaving the same scalar.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why must contraction always pair one upper index with one lower index? <em>Answer: a $(p,q) \\to (p-1, q-1)$ contraction cancels the $A$ factor (covariant) against the $A^{-1}$ factor (contravariant) in the transformation law. Pairing two upper or two lower indices does not produce a coordinate-invariant result.</em></div></div>

<h2 class="l-title">9. Classical Examples: Stress, Metric, Inertia</h2>

<p class="l-text">Three tensors gave the subject its urgency in the nineteenth century, and a fourth in the early twentieth. Each is a $(p,q)$ tensor of low order; together they motivate every abstraction in this lesson.</p>

<div class="calc-formula"><div class="formula-label">CAUCHY STRESS TENSOR — $(0,2)$ ON $\\mathbb{R}^3$</div><div class="formula-main">$$\\boldsymbol{\\sigma} = \\sigma_{ij}\\, \\mathbf{e}^i \\otimes \\mathbf{e}^j, \\qquad \\mathbf{t}(\\mathbf{n}) = \\sigma_{ij}\\, n^j\\, \\mathbf{e}^i.$$</div><div class="formula-sub">Acting on a unit normal $\\mathbf{n}$ to a surface element, the stress tensor returns the traction vector $\\mathbf{t}(\\mathbf{n})$ — the force per unit area exerted across the surface. Symmetric: $\\sigma_{ij} = \\sigma_{ji}$ (Cauchy 1822, conservation of angular momentum).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stress tensor</div><div class="card-body">Order $2$, symmetric. $9$ components in $\\mathbb{R}^3$, of which $6$ are independent. Diagonal entries are normal stresses (tension or compression); off-diagonals are shear stresses.</div></div>
<div class="calc-card"><div class="card-title">Metric tensor $g_{ij}$</div><div class="card-body">Order $2$, symmetric, positive-definite (in Riemannian geometry). Defines lengths and angles: $\\|\\mathbf{v}\\|^2 = g_{ij} v^i v^j$. The Euclidean metric is $\\delta_{ij}$; the Minkowski metric is $\\eta_{ij} = \\operatorname{diag}(-1, +1, +1, +1)$.</div></div>
<div class="calc-card"><div class="card-title">Inertia tensor $I_{ij}$</div><div class="card-body">Order $2$, symmetric, positive-definite. For a rigid body $\\mathcal{B}$: $I_{ij} = \\int_{\\mathcal{B}} \\rho \\bigl( \\|\\mathbf{r}\\|^2 \\delta_{ij} - r_i r_j \\bigr)\\, dV$. Relates angular velocity to angular momentum: $\\mathbf{L} = I \\boldsymbol{\\omega}$.</div></div>
<div class="calc-card"><div class="card-title">Riemann curvature tensor</div><div class="card-body">Order $4$, type $(1, 3)$: $R^i{}_{jkl}$. Measures the failure of parallel transport to commute. In general relativity, governs how matter (encoded in the stress-energy tensor $T_{\\mu\\nu}$) curves spacetime via Einstein's field equations.</div></div>
</div>

<div class="calc-example"><div class="example-label">PRINCIPAL STRESSES AS EIGENVALUES</div><div class="example-body">Because the stress tensor is symmetric, the spectral theorem applies: there exists an orthonormal basis of <strong>principal directions</strong> in which $\\sigma_{ij}$ is diagonal. The three diagonal entries $\\sigma_1, \\sigma_2, \\sigma_3$ are the <strong>principal stresses</strong>. In these directions the traction across any surface is purely normal — no shear. This is the eigenvalue decomposition of a $(0,2)$ tensor, and it is the reason engineers care so much about diagonalising symmetric matrices.</div></div>

<div class="calc-example"><div class="example-label">METRIC IN POLAR COORDINATES</div><div class="example-body">In Cartesian coordinates on $\\mathbb{R}^2$, $g_{ij} = \\delta_{ij}$ and $ds^2 = dx^2 + dy^2$. Change to polar coordinates $(r, \\theta)$ via $x = r\\cos\\theta$, $y = r\\sin\\theta$. The transformation law of section 6 gives $g'_{kl} = \\frac{\\partial x^i}{\\partial x^{\\prime k}} \\frac{\\partial x^j}{\\partial x^{\\prime l}} g_{ij}$, producing $g' = \\operatorname{diag}(1, r^2)$ and $ds^2 = dr^2 + r^2 d\\theta^2$. Same geometric object, different components.</div></div>

<div id="plot-linalg-l6-stress-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=20;var x=[],y=[],u=[],v=[];
var sigma=[[3,1],[1,2]];
for(var i=0;i<Nx;i++){
var theta=2*Math.PI*i/Nx;
var nx=Math.cos(theta),ny=Math.sin(theta);
var tx=sigma[0][0]*nx+sigma[0][1]*ny;
var ty=sigma[1][0]*nx+sigma[1][1]*ny;
x.push(nx);y.push(ny);u.push(tx*0.18);v.push(ty*0.18);
}
var circle_t=[];for(var k=0;k<=100;k++)circle_t.push(2*Math.PI*k/100);
var cx=circle_t.map(function(t){return Math.cos(t)});
var cy=circle_t.map(function(t){return Math.sin(t)});
var traces=[{x:cx,y:cy,mode:'lines',name:'unit normals n',line:{color:'#4ecdc4',width:1.5}}];
for(var i=0;i<Nx;i++){
traces.push({x:[x[i],x[i]+u[i]],y:[y[i],y[i]+v[i]],mode:'lines',line:{color:'#f87171',width:1.5},showlegend:i===0,name:i===0?'traction t(n)':undefined});
}
var layout={title:{text:'Stress tensor σ acting on unit normals: t(n) = σ·n',font:{color:'#ebe6dc',size:14}},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-1.8,1.8],scaleanchor:'y',title:''},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-1.8,1.8],title:''},margin:{t:50,r:30,b:30,l:30},legend:{font:{color:'#ebe6dc',size:11}}};
Plotly.newPlot('plot-linalg-l6-stress-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the action of a $2 \\times 2$ stress tensor $\\sigma = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ on the unit normals (teal circle) of a planar body. Each red arrow is the traction $\\mathbf{t}(\\mathbf{n}) = \\sigma \\mathbf{n}$ across the surface element with that normal direction. The lengths are scaled down by $0.18$ for readability. The directions where the traction is parallel to $\\mathbf{n}$ (no shear) are the principal directions — eigenvectors of $\\sigma$.</div></div>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<div class="calc-highlight"><strong>Pencil-and-paper exercises.</strong> Work each one through without a computer. These are the kinds of computations a multilinear-algebra textbook would expect you to do in a problem set.</div>

<div class="calc-example"><div class="example-label">EXERCISE 1 — OUTER PRODUCT OF TWO VECTORS</div><div class="example-body">Let $\\mathbf{u} = (2, -1, 3)$ and $\\mathbf{v} = (1, 4)$ in $\\mathbb{R}^3$ and $\\mathbb{R}^2$. Write the outer product $\\mathbf{u} \\otimes \\mathbf{v}$ as a $3 \\times 2$ matrix. What is its rank? Compute also $\\mathbf{v} \\otimes \\mathbf{u}$ and confirm that it is the transpose of $\\mathbf{u} \\otimes \\mathbf{v}$ (up to the relabelling of indices).<br><br>
<em>Solution sketch.</em> $(\\mathbf{u} \\otimes \\mathbf{v})_{ij} = u_i v_j$ gives $\\begin{pmatrix} 2 & 8 \\\\ -1 & -4 \\\\ 3 & 12 \\end{pmatrix}$. Every column is a scalar multiple of $\\mathbf{u}$, so the rank is $1$. Swapping yields $\\mathbf{v} \\otimes \\mathbf{u} \\in \\mathbb{R}^{2 \\times 3}$, which is indeed the transpose.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — TENSOR PRODUCT OF TWO MATRICES</div><div class="example-body">Let $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix}$ and $B = \\begin{pmatrix} 3 & 1 \\\\ 1 & 4 \\end{pmatrix}$. Compute the Kronecker product $A \\otimes B$, which represents the tensor product as a $4 \\times 4$ matrix:<br>
$A \\otimes B = \\begin{pmatrix} a_{11} B & a_{12} B \\\\ a_{21} B & a_{22} B \\end{pmatrix}$.<br>
Verify that $\\operatorname{tr}(A \\otimes B) = \\operatorname{tr}(A) \\cdot \\operatorname{tr}(B)$ and $\\det(A \\otimes B) = \\det(A)^2 \\det(B)^2$.<br><br>
<em>Solution sketch.</em> Substituting yields $A \\otimes B = \\begin{pmatrix} 3 & 1 & 0 & 0 \\\\ 1 & 4 & 0 & 0 \\\\ 0 & 0 & 6 & 2 \\\\ 0 & 0 & 2 & 8 \\end{pmatrix}$. Trace $= 3+4+6+8 = 21 = 3 \\cdot 7 = \\operatorname{tr}(A) \\operatorname{tr}(B)$. ✓</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — VERIFY MULTILINEARITY</div><div class="example-body">Let $T(\\mathbf{u}, \\mathbf{v}) = u_1 v_2 - u_2 v_1$ on $\\mathbb{R}^2$. Verify by direct computation that $T$ is bilinear: that is,<br>
$T(\\alpha \\mathbf{u}_1 + \\beta \\mathbf{u}_2, \\mathbf{v}) = \\alpha T(\\mathbf{u}_1, \\mathbf{v}) + \\beta T(\\mathbf{u}_2, \\mathbf{v})$,<br>
and similarly in the second argument. What is $T$ geometrically?<br><br>
<em>Solution sketch.</em> Linearity in $\\mathbf{u}$: $(\\alpha u_1^{(1)} + \\beta u_1^{(2)}) v_2 - (\\alpha u_2^{(1)} + \\beta u_2^{(2)}) v_1 = \\alpha (u_1^{(1)} v_2 - u_2^{(1)} v_1) + \\beta (u_1^{(2)} v_2 - u_2^{(2)} v_1)$. ✓ Geometrically $T$ is the signed area of the parallelogram spanned by $\\mathbf{u}$ and $\\mathbf{v}$ — equivalently $\\det \\begin{pmatrix} \\mathbf{u} & \\mathbf{v} \\end{pmatrix}$. It is an antisymmetric $(0,2)$-tensor (a $2$-form).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — CHANGE OF BASIS: VECTOR VS $(0,2)$-TENSOR</div><div class="example-body">Take the standard basis of $\\mathbb{R}^2$ and rotate by $\\theta = 45°$ to a new basis. The transition matrix is $A = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & -1 \\\\ 1 & 1 \\end{pmatrix}$.<br><br>
<strong>(a)</strong> A vector $\\mathbf{v}$ with old components $(1, 0)$ — what are its new components?<br>
<strong>(b)</strong> A $(0,2)$-tensor $g$ with old components $g_{ij} = \\delta_{ij}$ — what are its new components?<br><br>
<em>Solution sketch.</em> (a) Components are contravariant: $v^{\\prime i} = (A^{-1})^i{}_j v^j$. Since $A$ is orthogonal, $A^{-1} = A^\\top = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ -1 & 1 \\end{pmatrix}$, so $v' = \\frac{1}{\\sqrt{2}}(1, -1)$. (b) Components are doubly covariant: $g'_{kl} = A^i{}_k A^j{}_l g_{ij} = (A^\\top A)_{kl} = \\delta_{kl}$, since $A$ is orthogonal. The metric is preserved. <strong>Lesson:</strong> the vector's components rotate, but the metric's components stay the same — the two transformation rules genuinely differ.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — TRACE AS CONTRACTION</div><div class="example-body">Let $T$ be a $(1,1)$-tensor on $\\mathbb{R}^3$ with components<br>
$T^i{}_j = \\begin{pmatrix} 4 & -1 & 0 \\\\ 2 & 3 & 1 \\\\ 0 & 5 & -2 \\end{pmatrix}$.<br>
Compute the contraction $T^i{}_i$. Then transform to a new basis via $P = \\operatorname{diag}(2, 1, 3)$ (a stretching), and recompute $T^{\\prime i}{}_i$. Confirm that the answer is unchanged.<br><br>
<em>Solution sketch.</em> $T^i{}_i = 4 + 3 + (-2) = 5$. Under $P$ the new components are $T^{\\prime i}{}_j = (P^{-1})^i{}_k T^k{}_l P^l{}_j$. For a diagonal $P = \\operatorname{diag}(p_1, p_2, p_3)$, $T^{\\prime i}{}_j = (p_i^{-1} p_j) T^i{}_j$ (no sum), so diagonal entries are $T^{\\prime i}{}_i = T^i{}_i$. Summing: $T^{\\prime i}{}_i = 5$. ✓ This is the trace's invariance under similarity, written in index notation.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — PARTIAL CONTRACTION OF A $(2,2)$-TENSOR</div><div class="example-body">Let $T^{ij}{}_{kl}$ be a $(2,2)$-tensor on $\\mathbb{R}^2$ with components $T^{ij}{}_{kl} = \\delta^i_k \\delta^j_l + \\delta^i_l \\delta^j_k$. Form the contraction $S^i{}_k = T^{ij}{}_{kj}$ (sum on $j$) and identify $S$.<br><br>
<em>Solution sketch.</em> $S^i{}_k = \\sum_j (\\delta^i_k \\delta^j_j + \\delta^i_j \\delta^j_k) = \\delta^i_k \\cdot n + \\delta^i_k = (n+1)\\, \\delta^i_k$ in dimension $n$. So $S = (n+1) I$, a scalar multiple of the identity. In $\\mathbb{R}^2$ this is $3 I$.</div></div>

<div class="calc-highlight"><strong>What you can now do.</strong> Read $T^{ij}{}_{kl}$ aloud and identify it as a $(2,2)$ tensor of order $4$; construct and dimension-count the tensor product space $V \\otimes W$; apply the Einstein convention correctly, knowing which index pairs are summed and which are free; transform tensor components under a change of basis, using $A^{-1}$ for upper indices and $A$ for lower indices; form outer products and contractions, recognising trace, dot product, and matrix multiplication as instances of contraction; recognise the stress, metric, and inertia tensors as $(0,2)$ tensors and know why their symmetry matters. The next lessons of the track will use this vocabulary freely: $g_{ij}$ for the metric, $T_{\\mu\\nu}$ for the stress-energy tensor, $R^i{}_{jkl}$ for the Riemann curvature.</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text"><strong>Bir tensör çok boyutlu bir dizi değildir.</strong> Dizi sayıları <em>saklamanın</em> bir yoludur; tensör ise bileşenleri böyle bir saklama biçimine denk gelen geometrik bir nesnedir. Bu ayrım yapay değildir: klasik mekaniğin, genel göreliliğin, sürekli ortamlar mekaniğinin ve diferansiyel geometrinin yazılabilmesinin tek nedenidir. Fizikçiler "gerilme tensörü", "metrik tensörü" veya "atalet tensörü" dediğinde, herhangi bir koordinat sisteminden bağımsız var olan — ve bileşen değerleri taban değiştiğinde belirli bir kurala göre dönüşen — bir nesneyi kasteder. Dizi, aynı geometrik şeyin sonsuz tarif yolundan yalnızca biridir.</p>

<p class="l-text">Bu derste tensörleri matematikçilerin yaptığı gibi geliştireceğiz: <strong>çok-doğrusal eşlemler</strong> olarak. Tensör çarpımı $\\otimes$ kuracağız, Einstein toplam yakınsamasında index notasyonu ile çalışacağız, kovaryant ve kontravaryant indisleri ayıracağız, dış çarpımlar ve daralmalar inceleyeceğiz ve konunun fiziksel önceliğini veren üç klasik tensörle bitireceğiz: Cauchy'nin gerilme tensörü, Riemann'ın metrik tensörü ve katı cismin atalet tensörü. Ders sonunda $T^{ij}{}_{kl}$ ifadesini sesli okuyabilmeli, bir $(0,2)$-tensörünün tabanını değiştirebilmeli ve bir kitaba bakmadan kısmi bir daralma hesaplayabilmelisiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tensörü çok-doğrusal eşlem olarak tanımlamak ve tensör derecesini matris rankından ayırmak</li>
<li>İki vektör uzayının tensör çarpımı $V \\otimes W$ uzayını kurmak ve boyutunu okumak</li>
<li>Einstein toplam yakınsamasını kullanarak $T^{ij}{}_{kl}$ ifadelerini sade biçimde işlemek</li>
<li>Taban değişimi altında kovaryant ve kontravaryant dönüşüm kurallarını uygulamak</li>
<li>Dış çarpımları $\\mathbf{u} \\otimes \\mathbf{v}$ hesaplamak ve rank-bir tensörleri tanımak</li>
<li>Bir çift indis üzerinde daralma yapmak ve özel hal olarak iz, ıraksama ve iç çarpımı elde etmek</li>
<li>Gerilme, metrik ve atalet tensörlerini okumak, derecelerini ve simetrilerini saptamak</li>
</ul>
</div>

<h2 class="l-title">1. Skalar → Vektör → Matris → Tensör</h2>

<div class="calc-highlight"><strong>Temel fikir:</strong> skalar $\\to$ vektör $\\to$ matris $\\to$ tensör ilerlemesi "daha çok sayı" değil "daha çok argüman" demektir. Skalar, sıfır vektörün fonksiyonudur. Vektör (iç çarpım yoluyla) tek vektörün doğrusal fonksiyonudur. Matris iki vektörün iki-doğrusal fonksiyonudur. $k$ dereceli tensör, $k$ vektörün çok-doğrusal fonksiyonudur.</div>

<p class="l-text">Tanıdık nesnelerle başlayın ve her biri için sorun: <em>ne yer, ne üretir?</em> Verilen yanıtlar, bir araya geldiğinde, tensör tanımını zorunlu kılar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Skalar</div><div class="card-body">Temel cismin bir elemanı; genellikle $\\mathbb{R}$. Hiçbir şey yemez, sayı verir. Derece $0$. Örnekler: bir noktadaki sıcaklık, kütle, elektrik yükü, bir kare matrisin determinantı.</div></div>
<div class="calc-card"><div class="card-title">Vektör</div><div class="card-body">$V$ vektör uzayının bir elemanı. İç çarpım yoluyla, $V^* \\to \\mathbb{R}$ doğrusal eşlemine denk: bir kovektör yer, sayı verir. Derece $1$. Örnekler: konum, hız, kuvvet.</div></div>
<div class="calc-card"><div class="card-title">Matris (iki-doğrusal form)</div><div class="card-body">$V \\times V \\to \\mathbb{R}$ iki-doğrusal eşlemi; $(\\mathbf{u}, \\mathbf{v}) \\mapsto \\mathbf{u}^\\top A \\mathbf{v}$. Derece $2$. Örnekler: uzunlukları ölçen metrik $g_{ij}$, bir yüzeyin ikinci temel formu.</div></div>
<div class="calc-card"><div class="card-title">$k$ dereceli tensör</div><div class="card-body">$V \\times V \\times \\cdots \\times V \\to \\mathbb{R}$ çok-doğrusal eşlemi ($k$ yuva). Eşdeğer olarak: $V^{\\otimes k}$ veya uygun bir tensör çarpım uzayının elemanı. Derece $k$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ORTAK YAPI</div><div class="formula-main">$$\\text{Skalar} = T(\\,) , \\quad \\text{Vektör} = T(\\boldsymbol{\\omega}), \\quad \\text{Matris} = T(\\mathbf{u}, \\mathbf{v}), \\quad k \\text{ dereceli tensör} = T(\\mathbf{v}_1, \\mathbf{v}_2, \\ldots, \\mathbf{v}_k).$$</div><div class="formula-sub">"Derece" bir tensörün kaç vektör yuvasına sahip olduğunu sayar. Diğerlerini sabit tutarken her argümanda doğrusallık şarttır.</div></div>

<p class="l-text"><strong>Neden bu bakış, dizi bakışı değil?</strong> Sadece sayı <em>saklamak</em> isteseydiniz dizi yeterli olurdu. Ama koordinat değiştirmek istediğiniz an — çerçeveyi döndürmek, Kartezyen'den küresele geçmek, bir vektörü bir koordinat dönüşümünden geçirmek — saklama bakışı yetersiz kalır. Dizideki sayıların nasıl dönüşeceğini söyleyen bir kurala ihtiyaç duyarsınız. O kural çok-doğrusal eşlem tanımı tarafından, sadece o tanım tarafından, dayatılır. Matematiksel tensörler dönüşüm kurallarını içinde taşır; çıplak diziler taşımaz.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: $\\mathbb{R}^2$ ÜZERİNDE İKİ İKİ-DOĞRUSAL FORM</div><div class="example-body">$g(\\mathbf{u}, \\mathbf{v}) = u_1 v_1 + u_2 v_2$ standart skalar çarpım ve $h(\\mathbf{u}, \\mathbf{v}) = 2 u_1 v_1 + u_1 v_2 + u_2 v_1 + 3 u_2 v_2$ olsun. Her ikisi de $\\mathbb{R}^2 \\times \\mathbb{R}^2 \\to \\mathbb{R}$ iki-doğrusal eşlemleridir. Standart tabandaki matrisleri $G = I$ ve $H = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$. Her ikisi de derece-$2$ tensörlerdir. Dizileri aynı $(2,2)$ şekline sahip olsa da farklı geometrik nesnelerdir.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Bir tensör "aslında" çok-doğrusal bir eşlemse, bileşenlerini neden bir tabanda yazıyoruz? <em>Cevap: gerçek hesaplamalar sayı gerektirir. Bileşenler, bir tabanda sadık bir tariftir; çok-doğrusal eşlem tanımı tabanları değiştirdiğimizde bunları nasıl çevireceğimizi söyler.</em></div></div>

<h2 class="l-title">2. Çok-Doğrusal Eşlem Olarak Tensörler</h2>

<p class="l-text">Sonlu boyutlu reel bir $V$ vektör uzayı ve onun dual uzayı $V^*$ alın. <strong>$(p, q)$ tipi tensör</strong> — diğer adıyla $p$ kontravaryant ve $q$ kovaryant indise sahip $(p, q)$-tensör — şu çok-doğrusal eşlemdir:</p>

<div class="calc-formula"><div class="formula-label">$(p,q)$ TİPİ TENSÖR</div><div class="formula-main">$$T : \\underbrace{V^* \\times V^* \\times \\cdots \\times V^*}_{p \\text{ kopya}} \\;\\times\\; \\underbrace{V \\times V \\times \\cdots \\times V}_{q \\text{ kopya}} \\;\\to\\; \\mathbb{R}.$$</div><div class="formula-sub">Çok-doğrusal olmak, her argümanda ayrı ayrı doğrusal olmak demektir: diğer yuvalar sabit tutulurken her yuva için $T(\\ldots, \\alpha \\mathbf{v} + \\beta \\mathbf{w}, \\ldots) = \\alpha\\, T(\\ldots, \\mathbf{v}, \\ldots) + \\beta\\, T(\\ldots, \\mathbf{w}, \\ldots)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$(0, 0)$</div><div class="card-body">Yuva yok: sadece bir reel sayı. Derece $0$, <strong>skalar</strong>.</div></div>
<div class="calc-card"><div class="card-title">$(1, 0)$</div><div class="card-body">Tek kovektör yuvası: $V^*$ üzerinde doğrusal fonksiyonel — yani $V$'deki bir <strong>vektör</strong>. Derece $1$, kontravaryant.</div></div>
<div class="calc-card"><div class="card-title">$(0, 1)$</div><div class="card-body">Tek vektör yuvası: $V$ üzerinde doğrusal fonksiyonel — yani $V^*$'deki bir <strong>kovektör</strong>. Derece $1$, kovaryant.</div></div>
<div class="calc-card"><div class="card-title">$(1, 1)$</div><div class="card-body">Bir kovektör ve bir vektör yuvası: iki-doğrusal, $V \\to V$ doğrusal endomorfizmleriyle izomorf. Birim eşlem, tüm kare matrisler bu tipte.</div></div>
<div class="calc-card"><div class="card-title">$(0, 2)$</div><div class="card-body">İki vektör yuvası, sayı verir: <strong>iki-doğrusal formlar</strong>. İç çarpımlar, metrik tensör, ikinci temel form bu tipte.</div></div>
<div class="calc-card"><div class="card-title">$(2, 0)$</div><div class="card-body">İki kovektör yuvası: $\\mathbf{u} \\otimes \\mathbf{v}$ ($\\mathbf{u}, \\mathbf{v} \\in V$) biçimindeki ifadelerin doğrusal birleşimi — örneğin ters metrik $g^{ij}$.</div></div>
</div>

<p class="l-text">$V$'nin boyutu $n$ ve tabanı $\\{\\mathbf{e}_1, \\ldots, \\mathbf{e}_n\\}$ ise, $V^*$'nin dual tabanı $\\mathbf{e}^i(\\mathbf{e}_j) = \\delta^i_j$ ile tanımlanan $\\{\\mathbf{e}^1, \\ldots, \\mathbf{e}^n\\}$ olur. Bir $(p, q)$-tensörü $T$, $n^{p+q}$ bileşeni tarafından tamamen belirlenir:</p>

<div class="calc-formula"><div class="formula-label">BİR TABANDAKİ BİLEŞENLER</div><div class="formula-main">$$T^{i_1 \\cdots i_p}{}_{j_1 \\cdots j_q} \\;\\equiv\\; T(\\mathbf{e}^{i_1}, \\ldots, \\mathbf{e}^{i_p}, \\mathbf{e}_{j_1}, \\ldots, \\mathbf{e}_{j_q}).$$</div><div class="formula-sub">Üst indisler kontravaryant yuvaları sayar (içeri verilen kovektörler). Alt indisler kovaryant yuvaları sayar (içeri verilen vektörler). Toplam derece $p + q$.</div></div>

<p class="l-text">$V$ üzerindeki tüm $(p, q)$-tensörler kümesi $T^p_q(V)$ adlı bir vektör uzayı oluşturur; boyutu $n^{p+q}$'dir. Bir skalar $1$-boyutlu uzayda, bir vektör veya kovektör $n$-boyutlu uzayda, bir $(1,1)$ veya $(0,2)$-tensörü $n^2$-boyutlu uzayda yaşar. Bu boyut hesabı tensör çarpımını ele aldığımız bölüm 4'te yeniden çıkacak.</p>

<div class="l-note"><strong>Notasyon kuralları değişir.</strong> Bazı yazarlar bir $(p, q)$-tensörüne "derece-$(p+q)$" tensör der ve "rank"i en az kaç basit tensör toplamı gerektiğini sayar (bölüm 3). Diğerleri "rank" ile "derece"yi birbirinin yerine kullanır. Bu derste <em>derece</em> her zaman toplam yuva sayısıdır; <em>rank</em> ayrışım için saklıdır.</p>

<h2 class="l-title">3. Tensör Derecesi/Rankı vs Matris Rankı</h2>

<div class="calc-highlight"><strong>Önemli bir ayrım.</strong> Bir matrisin hem <em>derecesi</em> (her zaman $2$, çünkü matrisler $(0,2)$ veya $(1,1)$-tensörleridir) hem de <em>rankı</em> ($0$ ile $\\min(m, n)$ arası, doğrusal bağımsız satır/sütun sayısı) vardır. Genel tensörler için bunlar hâlâ farklı kavramlardır — ama rank kavramının tanımı ince bir biçimde genelleşir.</div>

<p class="l-text">Matrisler için rank teoremi rahatlatıcıdır: sütun rankı satır rankına eşittir, ve ikisi de sıfırdan farklı en büyük minörün boyutuna eşittir. Her matrise iyi tanımlanmış tek bir negatif olmayan tamsayı bağlanır. Yüksek dereceli tensörler için bunların hiçbiri doğru değildir. "Satır rankı" analoğu ile "sütun rankı" analoğu farklı olabilir, ve bir $3$-tensörünün rankını hesaplamak genelde NP-zor bir problemdir.</p>

<div class="calc-formula"><div class="formula-label">TENSÖR RANKI (AYRIŞIM RANKI)</div><div class="formula-main">$$\\operatorname{rank}(T) \\;=\\; \\min \\Bigl\\{\\, r \\;\\Bigm|\\; T = \\sum_{k=1}^{r} \\mathbf{u}_k \\otimes \\mathbf{v}_k \\otimes \\cdots \\otimes \\mathbf{w}_k \\,\\Bigr\\}.$$</div><div class="formula-sub">Toplamı $T$'ye eşit olan en küçük sayıdaki <strong>basit tensör</strong> (vektörlerin tek tensör çarpımı). Matrisler için bu doğrusal cebirdeki rank ile çakışır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Matris derecesi</div><div class="card-body">Her zaman $2$. Bir matris rank $1$ veya rank $\\min(m, n)$ olsun, aynı tipte bir nesnedir.</div></div>
<div class="calc-card"><div class="card-title">Matris rankı</div><div class="card-body">$0$ ile $\\min(m, n)$ arasında. Doğrusal bağımsız satır/sütunları sayar. $A = \\sum_{k=1}^r \\mathbf{u}_k \\mathbf{v}_k^\\top$ olabilen en küçük $r$'ye eşittir.</div></div>
<div class="calc-card"><div class="card-title">Tensör derecesi</div><div class="card-body">Bir $(p, q)$-tensörü için derece $p + q$. Bir $3$-tensör, bileşenleri ne kadar karmaşık olursa olsun, $3$-tensör olarak kalır.</div></div>
<div class="calc-card"><div class="card-title">Tensör rankı</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{v} \\otimes \\mathbf{w}$ basit tensörlerinin toplamına ayrışım için minimum uzunluk. Bazı durumlarda $\\dim V$ ile sınırlıdır; ama $k \\geq 3$ için bunu aşabilir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: BASİT TENSÖRÜN RANKI</div><div class="example-body">$\\mathbf{u} = (1, 0)$ ve $\\mathbf{v} = (0, 1)$ ($\\mathbb{R}^2$ içinde). Dış çarpım $\\mathbf{u} \\otimes \\mathbf{v}$ matris gösteriminde $\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ — derece $2$, rank $1$. Buna ikinci bir basit tensör $\\mathbf{e}_2 \\otimes \\mathbf{e}_1$ ekleyince $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ elde edilir — hâlâ derece $2$, ama rank $2$.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Neden bir $3$-dereceli tensörün rankı her bir tek boyutu aşabilir? <em>İpucu: rank-$r$ ayrışımları genelde kapalı olmayan bir uzayda yaşar; küçük boyutlu jenerik bir $3$-tensörü tam yazılabilmek için $\\dim V$'den fazla terim isteyebilir.</em></div></div>

<h2 class="l-title">4. Tensör Çarpımı $\\otimes$</h2>

<p class="l-text"><strong>Tensör çarpımı</strong>, derecesi $r$ ve $s$ olan iki tensörü derecesi $r + s$ olan bir tensöre dönüştüren kanonik işlemdir. Çok-doğrusal cebirin cebirsel motorudur: her tensör uzayı, $V$ ve $V^*$ kopyalarının $\\otimes$ ile yapıştırılmasıyla kurulur.</p>

<div class="calc-formula"><div class="formula-label">VEKTÖRLERİN TENSÖR ÇARPIMI</div><div class="formula-main">$$(\\mathbf{u} \\otimes \\mathbf{v})(\\boldsymbol{\\alpha}, \\boldsymbol{\\beta}) \\;=\\; \\boldsymbol{\\alpha}(\\mathbf{u}) \\cdot \\boldsymbol{\\beta}(\\mathbf{v}), \\qquad \\boldsymbol{\\alpha}, \\boldsymbol{\\beta} \\in V^*.$$</div><div class="formula-sub">Sağ taraf iki skaların çarpımıdır; sonuç $V^* \\times V^* \\to \\mathbb{R}$ iki-doğrusal eşlemi, yani $(2, 0)$-tensörüdür.</div></div>

<p class="l-text">Eşdeğer olarak — ve bu daha hesaplamalı tanımdır — eğer $\\mathbf{u}$'nun bileşenleri $u^i$ ve $\\mathbf{v}$'nin bileşenleri $v^j$ ise, $\\mathbf{u} \\otimes \\mathbf{v}$'nin bileşenleri $(\\mathbf{u} \\otimes \\mathbf{v})^{ij} = u^i v^j$ olur. Aynı fikir herhangi iki tensör arasında uygulanır: bileşenleri çarp, indis etiketlerini birleştir.</p>

<div class="calc-formula"><div class="formula-label">UZAYLARIN TENSÖR ÇARPIMI</div><div class="formula-main">$$V \\otimes W \\;=\\; \\operatorname{span} \\bigl\\{\\, \\mathbf{v} \\otimes \\mathbf{w} \\;:\\; \\mathbf{v} \\in V,\\; \\mathbf{w} \\in W \\,\\bigr\\}\\!\\Big/ \\sim,$$</div><div class="formula-sub">burada $\\sim$ iki-doğrusallığı zorlar. $\\dim V = m$ ve $\\dim W = n$ ise, $\\dim(V \\otimes W) = mn$. Taban $\\{\\mathbf{e}_i \\otimes \\mathbf{f}_j\\}$, burada $\\{\\mathbf{e}_i\\}$ $V$'nin tabanı ve $\\{\\mathbf{f}_j\\}$ $W$'nin tabanıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki-doğrusallık</div><div class="card-body">$(\\alpha \\mathbf{u}_1 + \\beta \\mathbf{u}_2) \\otimes \\mathbf{v} = \\alpha\\, \\mathbf{u}_1 \\otimes \\mathbf{v} + \\beta\\, \\mathbf{u}_2 \\otimes \\mathbf{v}$, ve ikinci yuvada da benzer. $\\otimes$'in tanımlayıcı özelliği tam budur.</div></div>
<div class="calc-card"><div class="card-title">Değişmeli değil</div><div class="card-body">Genelde $\\mathbf{u} \\otimes \\mathbf{v} \\neq \\mathbf{v} \\otimes \\mathbf{u}$. Yuvalar sıralıdır; $u^i v^j$ ve $v^i u^j$ farklı tensörlerin farklı bileşenlerini tarif eder.</div></div>
<div class="calc-card"><div class="card-title">Birleşmeli</div><div class="card-body">$(U \\otimes V) \\otimes W \\cong U \\otimes (V \\otimes W)$ kanonik olarak, bu yüzden sadece $U \\otimes V \\otimes W$ yazarız.</div></div>
<div class="calc-card"><div class="card-title">Basit tensörler</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{v}$ biçimindeki bir elemana <strong>basit</strong> (veya <strong>ayrıştırılabilir</strong>) tensör denir. $V \\otimes W$'nın çoğu elemanı basit <em>değildir</em>; birkaç basit tensörün toplamıdır.</div></div>
</div>

<div id="plot-linalg-l6-tensor-product-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var u=[1,2,3];var v=[4,5];
var z=[];var text=[];
for(var i=0;i<3;i++){var row=[];var trow=[];for(var j=0;j<2;j++){row.push(u[i]*v[j]);trow.push('u'+(i+1)+'·v'+(j+1)+'='+(u[i]*v[j]));}z.push(row);text.push(trow);}
var trace={z:z,type:'heatmap',colorscale:[[0,'#1a1a2e'],[0.5,'#c8a96e'],[1,'#f87171']],text:text,texttemplate:'%{text}',showscale:true,colorbar:{title:'değer',tickfont:{color:'#ebe6dc'}}};
var ann=[];
for(var i=0;i<3;i++){ann.push({x:-0.7,y:i,text:'u'+(i+1)+'='+u[i],showarrow:false,font:{color:'#4ecdc4',size:13}});}
for(var j=0;j<2;j++){ann.push({x:j,y:-0.55,text:'v'+(j+1)+'='+v[j],showarrow:false,font:{color:'#a78bfa',size:13}});}
var layout={title:{text:'Dış çarpım u ⊗ v ∈ R³ ⊗ R²  boyut 3·2 = 6',font:{color:'#ebe6dc',size:14}},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{showgrid:false,zeroline:false,tickvals:[0,1],ticktext:['j=1','j=2'],side:'top'},yaxis:{showgrid:false,zeroline:false,tickvals:[0,1,2],ticktext:['i=1','i=2','i=3'],autorange:'reversed'},margin:{t:70,r:60,b:40,l:80},annotations:ann};
Plotly.newPlot('plot-linalg-l6-tensor-product-tr',[trace],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $\\mathbf{u} = (1,2,3)$ ve $\\mathbf{v} = (4,5)$'in dış çarpımı. Sonuçtaki $3 \\times 2$ dizinin her hücresi, soldaki kenardan gelen bileşenle (teal) üstteki kenardan gelen bileşenin (mor) çarpımı $u_i v_j$'dir. Sonuç $\\mathbb{R}^3 \\otimes \\mathbb{R}^2$ — $6$-boyutlu bir uzayda — yaşar. Rank-$1$ bir tensördür: tek bir tensör çarpımı olarak yazılabilir.</div></div>

<p class="l-text">Tensör çarpımı tensör <em>uzayları</em> üzerinde de çalışır: $V$ üzerindeki $(p, q)$-tensörlerinin uzayı</p>

<div class="calc-formula"><div class="formula-label">$(p,q)$-TENSÖR UZAYI</div><div class="formula-main">$$T^p_q(V) \\;\\cong\\; \\underbrace{V \\otimes V \\otimes \\cdots \\otimes V}_{p \\text{ kopya}} \\,\\otimes\\, \\underbrace{V^* \\otimes V^* \\otimes \\cdots \\otimes V^*}_{q \\text{ kopya}}.$$</div><div class="formula-sub">Boyut $n^{p+q}$, bölüm 2'de söylenen gibi. Taban tensörü $\\mathbf{e}_{i_1} \\otimes \\cdots \\otimes \\mathbf{e}_{i_p} \\otimes \\mathbf{e}^{j_1} \\otimes \\cdots \\otimes \\mathbf{e}^{j_q}$.</div></div>

<h2 class="l-title">5. İndis Notasyonu (Einstein Toplam Yakınsaması)</h2>

<p class="l-text"><strong>Einstein yakınsaması:</strong> aynı terimde bir indis bir kere üst, bir kere alt indis olarak görünürse, kendi aralığı üzerinde örtük olarak toplanır. Hem ikisi üstte hem ikisi altta tekrar eden indisler otomatik toplanmaz — bu, standart matematiksel (kütüphane stili değil) notasyonda bir hata olurdu, çünkü bu tür çiftler koordinat-değişmez bir skalar üretmez.</p>

<div class="calc-formula"><div class="formula-label">EINSTEIN YAKINSAMASI</div><div class="formula-main">$$A^i{}_j v^j \\;\\equiv\\; \\sum_{j=1}^{n} A^i{}_j v^j, \\qquad T^i{}_i \\;\\equiv\\; \\sum_{i=1}^{n} T^i{}_i.$$</div><div class="formula-sub">Bir indis bir kere üstte bir kere altta göründüğünde toplam işareti gizlenir. Toplanmamış (serbest) indisler sonuç tensörünün tipini belirler.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Serbest ve sahte indisler</div><div class="card-body"><strong>Serbest</strong> indis bir terimde tek kez görünür; bir denklemin her iki tarafında da görünmek zorundadır ve bir yuvayı etiketler. <strong>Sahte</strong> indis iki kez görünür (bir üst, bir alt) ve toplanır.</div></div>
<div class="calc-card"><div class="card-title">Matris çarpımı</div><div class="card-body">$(AB)^i{}_k = A^i{}_j B^j{}_k$. Paylaşılan $j$ indisi toplanır; serbest $i, k$ indisleri sonucun satır ve sütununu etiketler.</div></div>
<div class="calc-card"><div class="card-title">İç çarpım</div><div class="card-body">$g_{ij} u^i v^j$ skalardır (serbest indis yok). $g_{ij}$ metriği iki kontravaryant vektörü her birini bir yuvasıyla daraltarak sayıya dönüştürür.</div></div>
<div class="calc-card"><div class="card-title">İz</div><div class="card-body">$T^i{}_i$ skalardır: bir $(1,1)$-tensörünün iki yuvasını birbirine karşı daralt. Matris için bu sıradan izdir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞMA: MATRİS İŞLEMLERİNİ İNDİS NOTASYONUNDA YENİDEN YAZMA</div><div class="example-body">$A$ kare matris, $\\mathbf{x}$ sütun vektör olsun. O zaman:<br>
$\\bullet$ $\\mathbf{y} = A\\mathbf{x}$ olur $y^i = A^i{}_j x^j$.<br>
$\\bullet$ $\\mathbf{x}^\\top A \\mathbf{y}$ olur $A_{ij} x^i y^j$ ($A_{ij}$, matris $(0,2)$-tensör olarak görüldüğünde).<br>
$\\bullet$ $\\operatorname{tr}(A)$ olur $A^i{}_i$.<br>
$\\bullet$ $\\operatorname{tr}(AB)$ olur $A^i{}_j B^j{}_i$.<br>
$\\bullet$ Kronecker delta $\\delta^i_j$ birim tensördür: $\\delta^i_j x^j = x^i$.</div></div>

<div class="calc-formula"><div class="formula-label">METRİK İLE İNDİS YÜKSELTME / DÜŞÜRME</div><div class="formula-main">$$v_i \\;=\\; g_{ij} v^j, \\qquad \\alpha^i \\;=\\; g^{ij} \\alpha_j.$$</div><div class="formula-sub">$g_{ij}$ metrik (tersi $g^{ij}$, $g^{ik} g_{kj} = \\delta^i_j$) verili bir uzayda, kontravaryant ve kovaryant indisler birbirine dönüştürülebilir. Metrik olmadan bu ayrım gerçektir ve ortadan kaldırılamaz.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">$T^{ii}$ ifadesi neden geçerli bir Einstein toplam yakınsaması daralması değildir? <em>Cevap: iki indis de kontravaryanttır. Bunları toplamak tabana bağlı bir nicelik üretir; bu yüzden bir tensör skaları değildir. Metrik araya sokulmalıdır: $g_{ij} T^{ij}$ meşru bir skalardır.</em></div></div>

<h2 class="l-title">6. Kovaryans ve Kontravaryans</h2>

<p class="l-text">$V$'nin tabanını $\\{\\mathbf{e}_i\\}$'den $\\{\\mathbf{e}'_i\\}$'ya değiştirelim; ilişki tersinir bir $A$ matrisiyle verilsin:</p>

<div class="calc-formula"><div class="formula-label">TABAN DEĞİŞİMİ</div><div class="formula-main">$$\\mathbf{e}'_i \\;=\\; A^j{}_i \\,\\mathbf{e}_j, \\qquad \\mathbf{e}^{\\prime i} \\;=\\; (A^{-1})^i{}_j\\, \\mathbf{e}^j.$$</div><div class="formula-sub">Taban kovektörleri <em>ters</em> matris ile dönüşür çünkü $\\mathbf{e}^{\\prime i}(\\mathbf{e}'_j) = \\delta^i_j$ hâlâ sağlanmak zorundadır.</div></div>

<p class="l-text">Bir tensör herhangi bir tabandan bağımsız var olur. Bu yüzden <em>bileşenleri</em> öyle bir dönüşmek zorundadır ki tarif ettikleri çok-doğrusal form değişmesin. Kural bize dayatılır:</p>

<div class="calc-formula"><div class="formula-label">$(p,q)$-TENSÖRLER İÇİN DÖNÜŞÜM KURALI</div><div class="formula-main">$$T^{\\prime i_1 \\cdots i_p}{}_{j_1 \\cdots j_q} \\;=\\; (A^{-1})^{i_1}{}_{k_1} \\cdots (A^{-1})^{i_p}{}_{k_p}\\; A^{l_1}{}_{j_1} \\cdots A^{l_q}{}_{j_q}\\; T^{k_1 \\cdots k_p}{}_{l_1 \\cdots l_q}.$$</div><div class="formula-sub">Kontravaryant indisler $A^{-1}$ ile, kovaryant indisler $A$ ile dönüşür. Bu, bileşenlerin tabana "ters yönde" dönüştüğü ifadesidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kontravaryant (üst indis)</div><div class="card-body">Bileşenler $A^{-1}$ ile dönüşür. Örnek: $\\mathbf{v} = v^i \\mathbf{e}_i$ konum vektörü için $v^{\\prime i} = (A^{-1})^i{}_j v^j$. Bileşenler taban değişimine "karşı gider".</div></div>
<div class="calc-card"><div class="card-title">Kovaryant (alt indis)</div><div class="card-body">Bileşenler $A$ ile dönüşür. Örnek: bir gradyan $\\partial_i f$ (kovektör olarak) $A$ ile dönüşür. Bileşenler tabanla "birlikte değişir".</div></div>
<div class="calc-card"><div class="card-title">Karışık tensörler</div><div class="card-body">Her üst indis bir $A^{-1}$ faktörü, her alt indis bir $A$ faktörü getirir. Serbest faktör sayısı dereceye eşittir.</div></div>
<div class="calc-card"><div class="card-title">Değişmezler</div><div class="card-body">Skalarların (tip $(0,0)$) faktörü yoktur ve tabandan bağımsızdır: $T' = T$. Bir iz $T^i{}_i$ değişmezdir çünkü $A$ ve $A^{-1}$ faktörleri birbirini götürür.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞMA: BİR $(0,2)$-TENSÖRÜ DÖNDÜRMEK</div><div class="example-body">$\\mathbb{R}^2$'de standart metrik $g_{ij} = \\delta_{ij}$ alalım. Tabanı $\\theta$ açısıyla döndürelim: $A = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$. Dönüşmüş bileşenler<br>
$g'_{kl} = A^i{}_k A^j{}_l\\, g_{ij} = A^i{}_k A^j{}_l\\, \\delta_{ij} = \\sum_i A^i{}_k A^i{}_l = (A^\\top A)_{kl} = \\delta_{kl}$,<br>
çünkü $A$ ortogonaldir. Metrik dönme altında değişmezdir, olması gerektiği gibi — uzaklıklar yön seçimine bağlı değildir.</div></div>

<div id="plot-linalg-l6-cov-contra-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var theta=Math.PI/6;var c=Math.cos(theta),s=Math.sin(theta);
var v=[1.2,0.6];
var vprime=[c*v[0]+s*v[1],-s*v[0]+c*v[1]];
var e1=[1,0],e2=[0,1];
var e1p=[c,s],e2p=[-s,c];
var traces=[
{x:[0,e1[0]],y:[0,e1[1]],mode:'lines+markers',name:'e₁ (eski)',line:{color:'#c8a96e',width:2}},
{x:[0,e2[0]],y:[0,e2[1]],mode:'lines+markers',name:'e₂ (eski)',line:{color:'#c8a96e',width:2,dash:'dash'}},
{x:[0,e1p[0]],y:[0,e1p[1]],mode:'lines+markers',name:'e\\'₁ (yeni)',line:{color:'#a78bfa',width:2}},
{x:[0,e2p[0]],y:[0,e2p[1]],mode:'lines+markers',name:'e\\'₂ (yeni)',line:{color:'#a78bfa',width:2,dash:'dash'}},
{x:[0,v[0]],y:[0,v[1]],mode:'lines+markers',name:'v (vektörün kendisi)',line:{color:'#f87171',width:3},marker:{size:[4,10]}},
{x:[v[0]],y:[v[1]],mode:'text',text:['v'],textposition:'top right',textfont:{color:'#f87171',size:14},showlegend:false}
];
var layout={title:{text:'v vektörü sabit; yalnız bileşenleri değişir',font:{color:'#ebe6dc',size:14}},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-0.4,1.6],title:'',scaleanchor:'y'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-0.4,1.2],title:''},margin:{t:50,r:30,b:30,l:30},legend:{font:{color:'#ebe6dc',size:10}},annotations:[{x:v[0]-0.05,y:v[1]+0.1,text:'(v¹,v²)=('+v[0].toFixed(2)+','+v[1].toFixed(2)+')',showarrow:false,font:{color:'#c8a96e',size:11}},{x:v[0]-0.05,y:v[1]+0.22,text:"(v'¹,v'²)=("+vprime[0].toFixed(2)+","+vprime[1].toFixed(2)+')',showarrow:false,font:{color:'#a78bfa',size:11}}]};
Plotly.newPlot('plot-linalg-l6-cov-contra-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> kontravaryansın geometrik içeriği. Kırmızı ok $\\mathbf{v}$ vektörüdür — yerinden oynamayan gerçek bir geometrik nesne. Gold $\\{\\mathbf{e}_1, \\mathbf{e}_2\\}$ tabanı $30°$ döndürülerek mor $\\{\\mathbf{e}'_1, \\mathbf{e}'_2\\}$ tabanı elde edilir. $(v^1, v^2)$ sayısal bileşenleri, $\\mathbf{v}$ değişmemiş olsa bile, yeni tabana göre okunduğunda <em>değişir</em>. Bu tam olarak $v^{\\prime i} = (A^{-1})^i{}_j v^j$ dönüşümünün iş başındaki halidir.</div></div>

<h2 class="l-title">7. Dış Çarpımlar ve Tensör Ayrışımları</h2>

<p class="l-text">En basit non-trivial tensörler <strong>basit</strong>tir (saf veya ayrıştırılabilir de denir): vektörlerin tek bir tensör çarpımı olarak yazılabilirler. <strong>Dış çarpım</strong>, bunun iki vektör için özel halidir:</p>

<div class="calc-formula"><div class="formula-label">DIŞ ÇARPIM</div><div class="formula-main">$$(\\mathbf{u} \\otimes \\mathbf{v})^{ij} \\;=\\; u^i v^j \\qquad \\text{veya eşdeğer olarak} \\qquad \\mathbf{u} \\mathbf{v}^\\top \\in \\mathbb{R}^{m \\times n}.$$</div><div class="formula-sub">Rankı tam olarak $1$ olan bir matris (her iki vektör de sıfırdan farklı kabul edildiğinde). Sütunları $\\mathbf{u}$'nun skalar katlarıdır; satırları $\\mathbf{v}^\\top$'nin skalar katlarıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rank-$1$ matris</div><div class="card-body">$\\mathbf{u} \\mathbf{v}^\\top$ biçimindeki her matrisin rankı $1$'dir. Tersine, her rank-$1$ matris bu şekilde yazılabilir (ayrışım skaler bir çarpana kadar tektir).</div></div>
<div class="calc-card"><div class="card-title">Dış çarpımların toplamı</div><div class="card-body">Bir rank-$r$ matris her zaman $\\sum_{k=1}^r \\mathbf{u}_k \\mathbf{v}_k^\\top$ olarak yazılabilir. Singüler değer ayrışımı bu ifadenin kanonik halidir.</div></div>
<div class="calc-card"><div class="card-title">Simetrik dış çarpım</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{u}$ simetrik ve pozitif yarı-tanımlıdır. Korelasyon tensörleri ve istatistikteki ikinci moment matrisini kurmak için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Yüksek derece analoğu</div><div class="card-body">$\\mathbf{u} \\otimes \\mathbf{v} \\otimes \\mathbf{w}$ bileşenleri $u^i v^j w^k$ olan derece-$3$ rank-$1$ tensördür. Bu tür terimlerin toplamları derece-$3$ tensörler için CP / Tucker ayrışımlarını verir.</div></div>
</div>

<p class="l-text"><strong>CP (Canonical Polyadic) ayrışımı</strong> SVD'yi yüksek dereceli tensörlere genişletir:</p>

<div class="calc-formula"><div class="formula-label">CP AYRIŞIMI (DERECE-$3$)</div><div class="formula-main">$$T^{ijk} \\;=\\; \\sum_{r=1}^{R} \\sigma_r\\, u_r^i\\, v_r^j\\, w_r^k.$$</div><div class="formula-sub">Böyle bir ifadenin tam olduğu en küçük $R$ değeri <strong>tensör rankı</strong>dır (bölüm 3). Matris durumunun ($k = 2$) aksine, bu rank her bir boyutu aşabilir ve tam olarak hesaplamak genelde NP-zordur.</div></div>

<div class="l-note"><strong>Not.</strong> CP'nin ötesinde, saf matematik ve fizikte kullanılan birkaç başka tensör ayrışımı vardır: <strong>Tucker ayrışımı</strong> (küçük çekirdek tensör ve ortogonal çarpan matrislerle SVD'nin yüksek derece analoğu), <strong>tensör treni</strong> (yüksek dereceli bir tensörü düşük dereceli zincire dönüştürür) ve <strong>Schmidt ayrışımı</strong> (kuantum mekaniğinde iki-parçalı tensörler için kanonik ayrışım).</p>

<h2 class="l-title">8. Daralma: İz, İç Çarpım ve Ötesi</h2>

<p class="l-text">Bir <strong>daralma</strong>, bir üst indisi bir alt indise karşı toplayarak tensörün derecesini $2$ azaltır. İndisleri <em>kaldıran</em> tek temel işlemdir ve tensör cebrindeki koordinat-değişmez skalarların neredeyse tamamının kaynağıdır.</p>

<div class="calc-formula"><div class="formula-label">DARALMA</div><div class="formula-main">$$C(T)^{i_1 \\cdots \\hat{i}_a \\cdots i_p}{}_{j_1 \\cdots \\hat{j}_b \\cdots j_q} \\;=\\; T^{i_1 \\cdots k \\cdots i_p}{}_{j_1 \\cdots k \\cdots j_q},$$</div><div class="formula-sub">burada $a$-ıncı kontravaryant indis $b$-inci kovaryant indise eşitlenip toplanmıştır. Şapkalı yuvalar kaldırılmıştır; toplam derece $p + q$'dan $p + q - 2$'ye düşer.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$(1,1)$ tensörünün izi</div><div class="card-body">$T^i{}_i$ derece $2$ olan $(1,1)$-tensörünü skalara (derece $0$) götürür. Matris için bu sıradan iz $\\sum_i A_{ii}$.</div></div>
<div class="calc-card"><div class="card-title">Skalar çarpım</div><div class="card-body">$\\alpha_i v^i$ $\\alpha_i$ kovektörünü $v^i$ vektörüne karşı daraltır. Öklid uzayında, metrik indis yükseltip düşürdüğünde bu tanıdık $\\mathbf{u} \\cdot \\mathbf{v} = g_{ij} u^i v^j$ olur.</div></div>
<div class="calc-card"><div class="card-title">Matris çarpımı</div><div class="card-body">$(AB)^i{}_k = A^i{}_j B^j{}_k$ — $A$'nın ikinci indisini $B$'nin birinci indisiyle daraltma. Sonuç derece $2$ olan bir $(1,1)$-tensörüdür.</div></div>
<div class="calc-card"><div class="card-title">Kısmi iz</div><div class="card-body">Bir $(2,2)$-tensörü için bir çift üst/alt indisi daraltmak $(1,1)$-tensörü bırakır. İki-parçalı bir hali tek alt sistemle indirgemek için kuantum mekaniğinin standart aracıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞMA: DARALMA OLARAK İZ</div><div class="example-body">$A = \\begin{pmatrix} 2 & 3 \\\\ 5 & 7 \\end{pmatrix}$ matrisini $(1,1)$-tensörü $A^i{}_j$ olarak görelim. $A^i{}_i$ daralması $A^1{}_1 + A^2{}_2 = 2 + 7 = 9 = \\operatorname{tr}(A)$. Taban değişimi $A' = P A P^{-1}$ altında iz değişmezdir çünkü $(P A P^{-1})^i{}_i = P^i{}_k A^k{}_l (P^{-1})^l{}_i = A^k{}_l \\delta^l_k = A^k{}_k$ — $P$ ve $P^{-1}$ birbirine karşı daralır, aynı skalar kalır.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Daralma neden hep bir üst indisi bir alt indisle eşleştirmelidir? <em>Cevap: $(p,q) \\to (p-1, q-1)$ daralması dönüşüm kuralındaki $A$ faktörünü (kovaryant) $A^{-1}$ faktörüne (kontravaryant) karşı götürür. İki üstü veya iki altı eşleştirmek koordinat-değişmez sonuç vermez.</em></div></div>

<h2 class="l-title">9. Klasik Örnekler: Gerilme, Metrik, Atalet</h2>

<p class="l-text">Üç tensör 19. yüzyılda konuya aciliyet kazandırdı, bir dördüncüsü 20. yüzyıl başında. Her biri düşük dereceli bir $(p,q)$-tensörüdür; birlikte bu dersin tüm soyutlamalarını motive ederler.</p>

<div class="calc-formula"><div class="formula-label">CAUCHY GERİLME TENSÖRÜ — $\\mathbb{R}^3$ ÜZERİNDE $(0,2)$</div><div class="formula-main">$$\\boldsymbol{\\sigma} = \\sigma_{ij}\\, \\mathbf{e}^i \\otimes \\mathbf{e}^j, \\qquad \\mathbf{t}(\\mathbf{n}) = \\sigma_{ij}\\, n^j\\, \\mathbf{e}^i.$$</div><div class="formula-sub">Bir yüzey elemanına dik birim $\\mathbf{n}$ üzerine etki ettiğinde, gerilme tensörü $\\mathbf{t}(\\mathbf{n})$ traksiyon vektörünü — yüzeyden geçen birim alan başına kuvveti — verir. Simetriktir: $\\sigma_{ij} = \\sigma_{ji}$ (Cauchy 1822, açısal momentumun korunumu).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gerilme tensörü</div><div class="card-body">Derece $2$, simetrik. $\\mathbb{R}^3$'te $9$ bileşen, bunların $6$'sı bağımsız. Köşegen girdileri normal gerilmeler (gerilme veya basınç); köşegen-dışı girdiler kesme gerilmeleridir.</div></div>
<div class="calc-card"><div class="card-title">Metrik tensör $g_{ij}$</div><div class="card-body">Derece $2$, simetrik, pozitif-tanımlı (Riemann geometrisinde). Uzunlukları ve açıları tanımlar: $\\|\\mathbf{v}\\|^2 = g_{ij} v^i v^j$. Öklid metriği $\\delta_{ij}$; Minkowski metriği $\\eta_{ij} = \\operatorname{diag}(-1, +1, +1, +1)$.</div></div>
<div class="calc-card"><div class="card-title">Atalet tensörü $I_{ij}$</div><div class="card-body">Derece $2$, simetrik, pozitif-tanımlı. Bir $\\mathcal{B}$ katı cismi için: $I_{ij} = \\int_{\\mathcal{B}} \\rho \\bigl( \\|\\mathbf{r}\\|^2 \\delta_{ij} - r_i r_j \\bigr)\\, dV$. Açısal hızı açısal momentuma bağlar: $\\mathbf{L} = I \\boldsymbol{\\omega}$.</div></div>
<div class="calc-card"><div class="card-title">Riemann eğrilik tensörü</div><div class="card-body">Derece $4$, tip $(1, 3)$: $R^i{}_{jkl}$. Paralel taşımanın değişmeli olmayışını ölçer. Genel görelilikte, maddenin (gerilme-enerji tensörü $T_{\\mu\\nu}$'da kodlanmıştır) uzay-zamanı nasıl büktüğünü Einstein alan denklemleri aracılığıyla yönetir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖZ DEĞER OLARAK ANA GERİLMELER</div><div class="example-body">Gerilme tensörü simetrik olduğundan, spektral teorem uygulanır: $\\sigma_{ij}$'ı köşegen yapan ortonormal bir <strong>ana yön</strong> tabanı vardır. Üç köşegen girdi $\\sigma_1, \\sigma_2, \\sigma_3$ <strong>ana gerilmeler</strong>dir. Bu yönlerde herhangi bir yüzeyden geçen traksiyon saf olarak normaldir — kesme yok. Bu, bir $(0,2)$-tensörünün özdeğer ayrışımıdır ve mühendislerin simetrik matrisleri köşegenleştirmeyi bu kadar önemsemesinin nedenidir.</div></div>

<div class="calc-example"><div class="example-label">KUTUPSAL KOORDİNATLARDA METRİK</div><div class="example-body">$\\mathbb{R}^2$'de Kartezyen koordinatlarda $g_{ij} = \\delta_{ij}$ ve $ds^2 = dx^2 + dy^2$. Kutupsal koordinatlara $x = r\\cos\\theta$, $y = r\\sin\\theta$ ile geçelim. Bölüm 6'daki dönüşüm kuralı $g'_{kl} = \\frac{\\partial x^i}{\\partial x^{\\prime k}} \\frac{\\partial x^j}{\\partial x^{\\prime l}} g_{ij}$ verir, sonuç $g' = \\operatorname{diag}(1, r^2)$ ve $ds^2 = dr^2 + r^2 d\\theta^2$. Aynı geometrik nesne, farklı bileşenler.</div></div>

<div id="plot-linalg-l6-stress-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=20;var x=[],y=[],u=[],v=[];
var sigma=[[3,1],[1,2]];
for(var i=0;i<Nx;i++){
var theta=2*Math.PI*i/Nx;
var nx=Math.cos(theta),ny=Math.sin(theta);
var tx=sigma[0][0]*nx+sigma[0][1]*ny;
var ty=sigma[1][0]*nx+sigma[1][1]*ny;
x.push(nx);y.push(ny);u.push(tx*0.18);v.push(ty*0.18);
}
var circle_t=[];for(var k=0;k<=100;k++)circle_t.push(2*Math.PI*k/100);
var cx=circle_t.map(function(t){return Math.cos(t)});
var cy=circle_t.map(function(t){return Math.sin(t)});
var traces=[{x:cx,y:cy,mode:'lines',name:'birim dik n',line:{color:'#4ecdc4',width:1.5}}];
for(var i=0;i<Nx;i++){
traces.push({x:[x[i],x[i]+u[i]],y:[y[i],y[i]+v[i]],mode:'lines',line:{color:'#f87171',width:1.5},showlegend:i===0,name:i===0?'traksiyon t(n)':undefined});
}
var layout={title:{text:'Gerilme tensörü σ birim diklere etki: t(n) = σ·n',font:{color:'#ebe6dc',size:14}},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-1.8,1.8],scaleanchor:'y',title:''},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',range:[-1.8,1.8],title:''},margin:{t:50,r:30,b:30,l:30},legend:{font:{color:'#ebe6dc',size:11}}};
Plotly.newPlot('plot-linalg-l6-stress-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $\\sigma = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ olan bir $2 \\times 2$ gerilme tensörünün düzlem cismin birim diklerine (teal çember) etkisi. Her kırmızı ok, o normal yöndeki yüzey elemanından geçen $\\mathbf{t}(\\mathbf{n}) = \\sigma \\mathbf{n}$ traksiyonudur. Uzunluklar görünürlük için $0.18$ ile ölçeklenmiştir. Traksiyonun $\\mathbf{n}$'ye paralel olduğu yönler (kesme yok) ana yönlerdir — $\\sigma$'nın özvektörleri.</div></div>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<div class="calc-highlight"><strong>Kâğıt-kalem alıştırmaları.</strong> Her birini bilgisayar kullanmadan çözün. Bunlar bir çok-doğrusal cebir ders kitabının problem listesinde isteyebileceği türden hesaplamalardır.</div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — İKİ VEKTÖRÜN DIŞ ÇARPIMI</div><div class="example-body">$\\mathbf{u} = (2, -1, 3)$ ve $\\mathbf{v} = (1, 4)$ olsun ($\\mathbb{R}^3$ ve $\\mathbb{R}^2$'de). $\\mathbf{u} \\otimes \\mathbf{v}$ dış çarpımını $3 \\times 2$ matris olarak yazın. Rankı nedir? Ayrıca $\\mathbf{v} \\otimes \\mathbf{u}$ hesaplayın ve $\\mathbf{u} \\otimes \\mathbf{v}$'in transpozu olduğunu (indis etiketlenmesine kadar) doğrulayın.<br><br>
<em>Çözüm taslağı.</em> $(\\mathbf{u} \\otimes \\mathbf{v})_{ij} = u_i v_j$ formülü $\\begin{pmatrix} 2 & 8 \\\\ -1 & -4 \\\\ 3 & 12 \\end{pmatrix}$ verir. Her sütun $\\mathbf{u}$'nun skalar katıdır, dolayısıyla rank $1$'dir. Yer değiştirme $\\mathbf{v} \\otimes \\mathbf{u} \\in \\mathbb{R}^{2 \\times 3}$ verir; bu gerçekten transpozdur.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — İKİ MATRİSİN TENSÖR ÇARPIMI</div><div class="example-body">$A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix}$ ve $B = \\begin{pmatrix} 3 & 1 \\\\ 1 & 4 \\end{pmatrix}$ olsun. Tensör çarpımını $4 \\times 4$ matris olarak temsil eden Kronecker çarpımı $A \\otimes B$'yi hesaplayın:<br>
$A \\otimes B = \\begin{pmatrix} a_{11} B & a_{12} B \\\\ a_{21} B & a_{22} B \\end{pmatrix}$.<br>
$\\operatorname{tr}(A \\otimes B) = \\operatorname{tr}(A) \\cdot \\operatorname{tr}(B)$ ve $\\det(A \\otimes B) = \\det(A)^2 \\det(B)^2$ olduğunu doğrulayın.<br><br>
<em>Çözüm taslağı.</em> Yerine koyarak $A \\otimes B = \\begin{pmatrix} 3 & 1 & 0 & 0 \\\\ 1 & 4 & 0 & 0 \\\\ 0 & 0 & 6 & 2 \\\\ 0 & 0 & 2 & 8 \\end{pmatrix}$. İz $= 3+4+6+8 = 21 = 3 \\cdot 7 = \\operatorname{tr}(A) \\operatorname{tr}(B)$. ✓</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — ÇOK-DOĞRUSALLIĞI DOĞRULAYIN</div><div class="example-body">$T(\\mathbf{u}, \\mathbf{v}) = u_1 v_2 - u_2 v_1$ olsun ($\\mathbb{R}^2$ üzerinde). $T$'nin iki-doğrusal olduğunu doğrudan hesaplayarak doğrulayın: yani<br>
$T(\\alpha \\mathbf{u}_1 + \\beta \\mathbf{u}_2, \\mathbf{v}) = \\alpha T(\\mathbf{u}_1, \\mathbf{v}) + \\beta T(\\mathbf{u}_2, \\mathbf{v})$,<br>
ve ikinci argümanda da benzer biçimde. $T$ geometrik olarak nedir?<br><br>
<em>Çözüm taslağı.</em> $\\mathbf{u}$'da doğrusallık: $(\\alpha u_1^{(1)} + \\beta u_1^{(2)}) v_2 - (\\alpha u_2^{(1)} + \\beta u_2^{(2)}) v_1 = \\alpha (u_1^{(1)} v_2 - u_2^{(1)} v_1) + \\beta (u_1^{(2)} v_2 - u_2^{(2)} v_1)$. ✓ Geometrik olarak $T$, $\\mathbf{u}$ ve $\\mathbf{v}$ tarafından gerilen paralelkenarın işaretli alanıdır — eşdeğer olarak $\\det \\begin{pmatrix} \\mathbf{u} & \\mathbf{v} \\end{pmatrix}$. Antisimetrik bir $(0,2)$-tensörüdür (bir $2$-form).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — TABAN DEĞİŞİMİ: VEKTÖR VS $(0,2)$-TENSÖR</div><div class="example-body">$\\mathbb{R}^2$'nin standart tabanını alın ve $\\theta = 45°$ ile yeni bir tabana döndürün. Geçiş matrisi $A = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & -1 \\\\ 1 & 1 \\end{pmatrix}$.<br><br>
<strong>(a)</strong> Eski bileşenleri $(1, 0)$ olan $\\mathbf{v}$ vektörünün yeni bileşenleri nedir?<br>
<strong>(b)</strong> $g_{ij} = \\delta_{ij}$ eski bileşenleri olan $g$ $(0,2)$-tensörünün yeni bileşenleri nedir?<br><br>
<em>Çözüm taslağı.</em> (a) Bileşenler kontravaryanttır: $v^{\\prime i} = (A^{-1})^i{}_j v^j$. $A$ ortogonal olduğundan $A^{-1} = A^\\top = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ -1 & 1 \\end{pmatrix}$, dolayısıyla $v' = \\frac{1}{\\sqrt{2}}(1, -1)$. (b) Bileşenler çift kovaryanttır: $g'_{kl} = A^i{}_k A^j{}_l g_{ij} = (A^\\top A)_{kl} = \\delta_{kl}$, çünkü $A$ ortogonaldir. Metrik korunur. <strong>Sonuç:</strong> vektörün bileşenleri döner, ama metriğin bileşenleri aynı kalır — iki dönüşüm kuralı gerçekten farklıdır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — DARALMA OLARAK İZ</div><div class="example-body">$\\mathbb{R}^3$ üzerinde bir $(1,1)$-tensörü $T$ bileşenleriyle verilsin:<br>
$T^i{}_j = \\begin{pmatrix} 4 & -1 & 0 \\\\ 2 & 3 & 1 \\\\ 0 & 5 & -2 \\end{pmatrix}$.<br>
$T^i{}_i$ daralmasını hesaplayın. Sonra $P = \\operatorname{diag}(2, 1, 3)$ (bir gerilme) ile yeni bir tabana geçin ve $T^{\\prime i}{}_i$'yi yeniden hesaplayın. Sonucun değişmediğini doğrulayın.<br><br>
<em>Çözüm taslağı.</em> $T^i{}_i = 4 + 3 + (-2) = 5$. $P$ altında yeni bileşenler $T^{\\prime i}{}_j = (P^{-1})^i{}_k T^k{}_l P^l{}_j$. Köşegen $P = \\operatorname{diag}(p_1, p_2, p_3)$ için $T^{\\prime i}{}_j = (p_i^{-1} p_j) T^i{}_j$ (toplam yok), dolayısıyla köşegen girdiler $T^{\\prime i}{}_i = T^i{}_i$. Toplam: $T^{\\prime i}{}_i = 5$. ✓ Bu, izin benzerlik altında değişmezliğinin indis notasyonunda yazılmış halidir.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — $(2,2)$-TENSÖRÜN KISMİ DARALMASI</div><div class="example-body">$\\mathbb{R}^2$ üzerinde bir $(2,2)$-tensörü $T^{ij}{}_{kl}$ bileşenleri $T^{ij}{}_{kl} = \\delta^i_k \\delta^j_l + \\delta^i_l \\delta^j_k$ olsun. $S^i{}_k = T^{ij}{}_{kj}$ daralmasını ($j$ üzerinde topla) oluşturun ve $S$'yi belirleyin.<br><br>
<em>Çözüm taslağı.</em> $S^i{}_k = \\sum_j (\\delta^i_k \\delta^j_j + \\delta^i_j \\delta^j_k) = \\delta^i_k \\cdot n + \\delta^i_k = (n+1)\\, \\delta^i_k$ ($n$ boyutta). Dolayısıyla $S = (n+1) I$, birim matrisin skalar katı. $\\mathbb{R}^2$'de bu $3 I$.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceğin şey.</strong> $T^{ij}{}_{kl}$'yi sesli okumak ve onu derece $4$ olan $(2,2)$-tensörü olarak tanımlamak; $V \\otimes W$ tensör çarpım uzayını kurmak ve boyutunu saymak; Einstein yakınsamasını doğru uygulamak (hangi indis çiftlerinin toplandığını, hangilerinin serbest kaldığını bilerek); tensör bileşenlerini taban değişimi altında, üst indisler için $A^{-1}$ ve alt indisler için $A$ kullanarak dönüştürmek; dış çarpım ve daralma oluşturmak, izin, skalar çarpımın ve matris çarpımının daralmanın özel halleri olduğunu fark etmek; gerilme, metrik ve atalet tensörlerini $(0,2)$-tensörü olarak tanımak ve simetrilerinin neden önemli olduğunu bilmek. Track'in sonraki dersleri bu sözlüğü serbestçe kullanacak: metrik için $g_{ij}$, gerilme-enerji tensörü için $T_{\\mu\\nu}$, Riemann eğriliği için $R^i{}_{jkl}$.</div>
`
};
