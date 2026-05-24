window.LISE_MAT_L74 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already know how to add and multiply matrices.</strong> What about dividing? You cannot literally write $A / B$ for matrices — division is not a defined operation. But for ordinary numbers, dividing by 5 is the same as multiplying by $1/5$, the multiplicative inverse of 5. Matrices have their own version of this idea: the <em>inverse matrix</em>, written $A^{-1}$. When it exists, it behaves like the matrix version of "one over $A$", and it is the single tool that unlocks the matrix method for solving linear systems.</p>

<p class="l-text">By the end of this lesson you will know exactly when a matrix has an inverse, the closed-form formula for the $2\\times 2$ case, the adjugate-and-determinant recipe for the $3\\times 3$ case, the algebraic properties every inverse obeys, and — most importantly — how to use the inverse to solve a system $A\\mathbf{x} = \\mathbf{b}$ in one matrix multiplication. We will also see, geometrically, why some systems have a unique solution, some have none, and some have infinitely many.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the inverse matrix $A^{-1}$ as the unique matrix satisfying $A A^{-1} = A^{-1} A = I$</li>
<li>State the invertibility criterion: $A^{-1}$ exists if and only if $\\det(A) \\neq 0$ (and $A$ is square)</li>
<li>Compute the inverse of a $2\\times 2$ matrix using the swap-and-sign formula</li>
<li>Compute the inverse of a $3\\times 3$ matrix via cofactors, adjugate, and division by determinant</li>
<li>Apply the algebraic rules $(A^{-1})^{-1} = A$, $(AB)^{-1} = B^{-1}A^{-1}$, and $(A^{T})^{-1} = (A^{-1})^{T}$</li>
<li>Solve a linear system $A\\mathbf{x} = \\mathbf{b}$ by writing $\\mathbf{x} = A^{-1}\\mathbf{b}$, and recognise when no solution or infinitely many exist</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is an Inverse Matrix?</h2>

<div class="calc-highlight"><strong>The number 7 has an inverse: $1/7$. Multiply them and you get 1.</strong> The number 0 does not — there is no $1/0$. Matrices follow the same pattern. Some square matrices have an inverse partner; some (the "matrix zeros", in a sense) do not. The matrix that plays the role of 1 is the identity matrix $I$.</div>

<p class="l-text">Recall the <strong>identity matrix</strong>. For $n = 2$ and $n = 3$:</p>

<div class="calc-formula"><div class="formula-label">IDENTITY MATRICES</div><div class="formula-main">$$I_2 \\;=\\; \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\qquad I_3 \\;=\\; \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$</div><div class="formula-sub">Multiplying any matrix by $I$ (of compatible size) leaves it unchanged: $AI = IA = A$. The identity plays the role of the number 1 in matrix algebra.</div></div>

<p class="l-text">Now we can define the inverse precisely.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION OF THE INVERSE MATRIX</div><div class="formula-main">$$A \\cdot A^{-1} \\;=\\; A^{-1} \\cdot A \\;=\\; I$$</div><div class="formula-sub">$A^{-1}$ is the (necessarily unique) matrix that, multiplied with $A$ on either side, gives the identity. If such a matrix exists, we say $A$ is <em>invertible</em> or <em>non-singular</em>.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Square only</div><div class="card-body">Only square matrices ($n\\times n$) can have inverses. A $2\\times 3$ matrix has no inverse — the products $AA^{-1}$ and $A^{-1}A$ would have different sizes.</div></div>
<div class="calc-card"><div class="card-title">Uniqueness</div><div class="card-body">If an inverse exists, it is the only matrix that works. There is no "second inverse" hiding somewhere.</div></div>
<div class="calc-card"><div class="card-title">Two-sided</div><div class="card-body">The same $A^{-1}$ works on both sides: $A A^{-1} = I$ <em>and</em> $A^{-1} A = I$. Checking only one is enough — the other follows automatically for square matrices.</div></div>
</div>

<div class="calc-example"><div class="example-label">QUICK CHECK</div><div class="example-body">Is $B = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ the inverse of $A = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$?<br><br>Compute $A \\cdot B$:<br>$\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1\\cdot 2 + (-1)\\cdot 1 & 1\\cdot 1 + (-1)\\cdot 1 \\\\ -1\\cdot 2 + 2\\cdot 1 & -1\\cdot 1 + 2\\cdot 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$. <strong>Yes</strong>, $B = A^{-1}$.</div></div>

<h2 class="lesson-title">2. When Does an Inverse Exist? The Determinant Criterion</h2>

<div class="calc-highlight"><strong>The whole theory rests on one rule:</strong> a square matrix $A$ has an inverse if and only if its determinant is non-zero. $\\det(A) \\neq 0 \\;\\Leftrightarrow\\; A^{-1}$ exists. There are no exceptions and no edge cases. Compute the determinant first; if it is zero, stop — there is no inverse to find.</div>

<p class="l-text">Why does the determinant decide everything? You met the determinant in earlier lessons as the scalar that measures the "scaling factor" of the linear transformation. When $\\det A = 0$, the transformation squashes the plane (or space) onto a lower-dimensional set — a line, or a point. That squashing destroys information: many input points get sent to the same output, so there is no way to "undo" the map. An inverse would have to undo it, but it cannot — so no inverse exists.</p>

<div class="calc-formula"><div class="formula-label">INVERTIBILITY CRITERION</div><div class="formula-main">$$A^{-1} \\text{ exists} \\quad\\Longleftrightarrow\\quad \\det(A) \\neq 0$$</div><div class="formula-sub">A matrix with non-zero determinant is called <em>non-singular</em> or <em>invertible</em>. A matrix with $\\det = 0$ is called <em>singular</em> (no inverse exists).</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">NON-SINGULAR (INVERTIBLE)</div><div class="compare-item">$\\det(A) \\neq 0$</div><div class="compare-item">$A^{-1}$ exists and is unique</div><div class="compare-item">System $A\\mathbf{x} = \\mathbf{b}$ has a <strong>unique</strong> solution</div><div class="compare-item">Rows (and columns) are linearly independent</div></div><div class="compare-col"><div class="compare-title">SINGULAR (NOT INVERTIBLE)</div><div class="compare-item">$\\det(A) = 0$</div><div class="compare-item">No inverse exists</div><div class="compare-item">System has <strong>no solution</strong> or <strong>infinitely many</strong></div><div class="compare-item">Rows are linearly dependent (one is a combination of the others)</div></div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">For $A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$, compute the determinant: $\\det A = 2\\cdot 2 - 4\\cdot 1 = 0$. So $A$ is singular and has no inverse. Notice that the second row is half the first — that linear dependence is exactly what zero determinant detects.</div></div>

<h2 class="lesson-title">3. The 2&times;2 Inverse Formula</h2>

<div class="calc-highlight"><strong>For $2\\times 2$ matrices there is a beautiful closed-form recipe.</strong> Swap the two diagonal entries, flip the sign of the off-diagonal entries, then divide everything by the determinant. That is the entire algorithm.</div>

<div class="calc-formula"><div class="formula-label">$2\\times 2$ INVERSE FORMULA</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\quad\\Longrightarrow\\quad A^{-1} \\;=\\; \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$</div><div class="formula-sub">Valid whenever $\\det A = ad - bc \\neq 0$. Notice the pattern: $a$ and $d$ swap places; $b$ and $c$ pick up a minus sign.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — determinant</div><div class="card-body">Compute $ad - bc$. If it is zero, stop. Otherwise it becomes the divisor for every entry.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — swap diagonals</div><div class="card-body">Put $d$ where $a$ was, and $a$ where $d$ was. The two diagonal entries trade places.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — negate off-diagonals</div><div class="card-body">$b$ becomes $-b$ in its place; $c$ becomes $-c$ in its place. Don't move them — only flip signs.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — divide</div><div class="card-body">Multiply the whole matrix by $1/\\det A$. Now you have $A^{-1}$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the inverse of $A = \\begin{pmatrix} 3 & 5 \\\\ 1 & 2 \\end{pmatrix}$.<br><br><strong>Step 1.</strong> $\\det A = 3\\cdot 2 - 5\\cdot 1 = 6 - 5 = 1$. Non-zero, so the inverse exists.<br><strong>Step 2.</strong> Swap 3 and 2: diagonal becomes $\\begin{pmatrix} 2 & \\cdot \\\\ \\cdot & 3 \\end{pmatrix}$.<br><strong>Step 3.</strong> Negate 5 and 1: off-diagonals become $-5$ and $-1$.<br><strong>Step 4.</strong> Divide by 1 (no change).<br><br>Answer: $A^{-1} = \\begin{pmatrix} 2 & -5 \\\\ -1 & 3 \\end{pmatrix}$.<br><br><strong>Check:</strong> $A \\cdot A^{-1} = \\begin{pmatrix} 3 & 5 \\\\ 1 & 2 \\end{pmatrix}\\begin{pmatrix} 2 & -5 \\\\ -1 & 3 \\end{pmatrix} = \\begin{pmatrix} 6-5 & -15+15 \\\\ 2-2 & -5+6 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$. Correct.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — NON-UNIT DETERMINANT</div><div class="example-body">Find the inverse of $A = \\begin{pmatrix} 4 & 2 \\\\ 3 & 1 \\end{pmatrix}$.<br><br>$\\det A = 4\\cdot 1 - 2\\cdot 3 = 4 - 6 = -2$.<br>Swap-and-negate gives $\\begin{pmatrix} 1 & -2 \\\\ -3 & 4 \\end{pmatrix}$.<br>Divide by $-2$: $A^{-1} = \\dfrac{1}{-2}\\begin{pmatrix} 1 & -2 \\\\ -3 & 4 \\end{pmatrix} = \\begin{pmatrix} -1/2 & 1 \\\\ 3/2 & -2 \\end{pmatrix}$.</div></div>

<div class="l-note"><strong>Common error:</strong> forgetting to swap the diagonal entries, or forgetting to flip signs of the off-diagonals. Always remember: the formula has <em>both</em> a swap <em>and</em> a sign change. Skip either and your "inverse" is wrong.</div>

<h2 class="lesson-title">4. The 3&times;3 Inverse via Cofactors and Adjugate</h2>

<div class="calc-highlight"><strong>For $3\\times 3$ matrices, there is no clean swap-and-flip trick.</strong> Instead, we build the inverse from cofactors — the same building blocks you used to compute the determinant by expansion. The recipe has three named steps: cofactor matrix, adjugate (transpose), divide by determinant.</div>

<p class="l-text"><strong>Step 1: cofactors.</strong> For each entry $a_{ij}$ of $A$, the <em>cofactor</em> $C_{ij}$ is the signed determinant of the $2\\times 2$ matrix you get by deleting row $i$ and column $j$:</p>

<div class="calc-formula"><div class="formula-label">COFACTOR</div><div class="formula-main">$$C_{ij} \\;=\\; (-1)^{i+j} \\cdot \\det(M_{ij})$$</div><div class="formula-sub">$M_{ij}$ is the $2\\times 2$ minor — the matrix obtained by removing row $i$ and column $j$. The sign $(-1)^{i+j}$ alternates in a checkerboard pattern.</div></div>

<p class="l-text"><strong>Step 2: adjugate.</strong> Collect all nine cofactors into a $3\\times 3$ matrix, then <em>transpose</em> it (swap rows and columns). The result is called the <strong>adjugate</strong> (sometimes "classical adjoint") of $A$:</p>

<div class="calc-formula"><div class="formula-label">ADJUGATE MATRIX</div><div class="formula-main">$$\\text{adj}(A) \\;=\\; (C_{ij})^{T} \\;=\\; \\begin{pmatrix} C_{11} & C_{21} & C_{31} \\\\ C_{12} & C_{22} & C_{32} \\\\ C_{13} & C_{23} & C_{33} \\end{pmatrix}$$</div><div class="formula-sub">Note the index swap: $C_{ij}$ goes to row $j$ and column $i$ after transposing.</div></div>

<p class="l-text"><strong>Step 3: divide.</strong> The inverse is the adjugate divided by the determinant:</p>

<div class="calc-formula"><div class="formula-label">INVERSE VIA ADJUGATE</div><div class="formula-main">$$A^{-1} \\;=\\; \\frac{1}{\\det A} \\cdot \\text{adj}(A)$$</div><div class="formula-sub">Same logic as the $2\\times 2$ case — in fact, the $2\\times 2$ formula is just this recipe with all the steps simplified.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $3\\times 3$ INVERSE</div><div class="example-body">Find the inverse of $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}$.<br><br><strong>Step 1.</strong> Determinant (expand along the first row):<br>$\\det A = 1\\cdot(1\\cdot 0 - 4\\cdot 6) - 2\\cdot(0\\cdot 0 - 4\\cdot 5) + 3\\cdot(0\\cdot 6 - 1\\cdot 5)$<br>$= 1\\cdot(-24) - 2\\cdot(-20) + 3\\cdot(-5) = -24 + 40 - 15 = 1$. Non-zero — the inverse exists.<br><br><strong>Step 2.</strong> Compute all nine cofactors:<br>$C_{11} = +(1\\cdot 0 - 4\\cdot 6) = -24$, $\\;C_{12} = -(0\\cdot 0 - 4\\cdot 5) = 20$, $\\;C_{13} = +(0\\cdot 6 - 1\\cdot 5) = -5$<br>$C_{21} = -(2\\cdot 0 - 3\\cdot 6) = 18$, $\\;C_{22} = +(1\\cdot 0 - 3\\cdot 5) = -15$, $\\;C_{23} = -(1\\cdot 6 - 2\\cdot 5) = 4$<br>$C_{31} = +(2\\cdot 4 - 3\\cdot 1) = 5$, $\\;C_{32} = -(1\\cdot 4 - 3\\cdot 0) = -4$, $\\;C_{33} = +(1\\cdot 1 - 2\\cdot 0) = 1$<br><br><strong>Step 3.</strong> Adjugate (transpose the cofactor matrix):<br>$\\text{adj}(A) = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$.<br><br><strong>Step 4.</strong> Divide by $\\det A = 1$ (no change):<br>$A^{-1} = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$.</div></div>

<div class="l-note"><strong>Practical advice:</strong> the $3\\times 3$ adjugate method is reliable but error-prone — easy to mis-sign a cofactor or forget to transpose. Once you reach university, you will learn Gauss-Jordan elimination, which is faster for $n\\ge 3$. But for high-school exams, the cofactor method is the expected approach. Practice it.</div>

<h2 class="lesson-title">5. Algebraic Properties of the Inverse</h2>

<div class="calc-highlight"><strong>Three identities every student must know.</strong> They let you simplify expressions involving inverses without grinding through computations, and they show up constantly in exam questions.</div>

<div class="calc-formula"><div class="formula-label">PROPERTY 1 — INVOLUTION</div><div class="formula-main">$$(A^{-1})^{-1} \\;=\\; A$$</div><div class="formula-sub">The inverse of the inverse is the original matrix. Intuition: undoing the undo is the original action.</div></div>

<div class="calc-formula"><div class="formula-label">PROPERTY 2 — PRODUCT (REVERSE ORDER!)</div><div class="formula-main">$$(AB)^{-1} \\;=\\; B^{-1} A^{-1}$$</div><div class="formula-sub">The inverse of a product is the product of the inverses <em>in reverse order</em>. Think: putting on socks then shoes, you reverse by taking off shoes then socks.</div></div>

<div class="calc-formula"><div class="formula-label">PROPERTY 3 — TRANSPOSE</div><div class="formula-main">$$(A^{T})^{-1} \\;=\\; (A^{-1})^{T}$$</div><div class="formula-sub">Inversion and transposition commute. You can do either operation first and get the same result.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Determinant of an inverse</div><div class="card-body">$\\det(A^{-1}) = 1/\\det(A)$. Follows from $\\det(AB) = \\det A \\cdot \\det B$ applied to $A A^{-1} = I$.</div></div>
<div class="calc-card"><div class="card-title">Identity is self-inverse</div><div class="card-body">$I^{-1} = I$. The identity matrix is its own inverse, since $I \\cdot I = I$.</div></div>
<div class="calc-card"><div class="card-title">Inverse of a scalar multiple</div><div class="card-body">$(kA)^{-1} = \\dfrac{1}{k} A^{-1}$ for any non-zero scalar $k$.</div></div>
</div>

<div class="calc-example"><div class="example-label">USING THE PROPERTIES</div><div class="example-body">Simplify $(A B^{T})^{-1}$ assuming both $A$ and $B$ are invertible.<br><br>Apply property 2 (product, reverse order): $(A B^{T})^{-1} = (B^{T})^{-1} A^{-1}$.<br>Apply property 3 (transpose commutes with inverse): $(B^{T})^{-1} = (B^{-1})^{T}$.<br><br>Final answer: $(A B^{T})^{-1} = (B^{-1})^{T} A^{-1}$.</div></div>

<div class="l-note"><strong>Why reverse order in property 2?</strong> Quick check: $(AB)(B^{-1}A^{-1}) = A(B B^{-1})A^{-1} = A \\cdot I \\cdot A^{-1} = A A^{-1} = I$. The cancellation only works because $B$ and $B^{-1}$ meet in the middle. If you wrote $A^{-1} B^{-1}$ instead, the wrong matrices would meet and cancellation would fail.</div>

<h2 class="lesson-title">6. Solving Linear Systems with the Inverse</h2>

<div class="calc-highlight"><strong>This is the payoff.</strong> Every linear system of $n$ equations in $n$ unknowns can be written as a single matrix equation $A\\mathbf{x} = \\mathbf{b}$. If $A$ is invertible, multiplying both sides by $A^{-1}$ on the left gives $\\mathbf{x} = A^{-1}\\mathbf{b}$. The whole system is solved in one matrix multiplication.</div>

<p class="l-text">A system like<br>$\\quad 2x + 3y = 8$<br>$\\quad x - y = 1$<br>can be packaged as $A\\mathbf{x} = \\mathbf{b}$ where</p>

<div class="calc-formula"><div class="formula-label">MATRIX FORM OF A LINEAR SYSTEM</div><div class="formula-main">$$A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}, \\quad \\mathbf{x} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad \\mathbf{b} = \\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}$$</div><div class="formula-sub">$A$ holds the coefficients, $\\mathbf{x}$ the unknowns, $\\mathbf{b}$ the right-hand sides. The single equation $A\\mathbf{x} = \\mathbf{b}$ encodes the whole system.</div></div>

<div class="calc-formula"><div class="formula-label">SOLUTION BY INVERSE</div><div class="formula-main">$$A\\mathbf{x} = \\mathbf{b} \\quad\\Longrightarrow\\quad \\mathbf{x} = A^{-1}\\mathbf{b}$$</div><div class="formula-sub">Valid whenever $A$ is invertible — i.e., whenever $\\det A \\neq 0$. The solution is unique in that case.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — $2\\times 2$ SYSTEM</div><div class="example-body">Solve $\\;2x + 3y = 8, \\;\\; x - y = 1\\;$ by the matrix inverse method.<br><br><strong>Step 1.</strong> Write in matrix form: $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}$, $\\mathbf{b} = \\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}$.<br><br><strong>Step 2.</strong> Determinant: $\\det A = 2\\cdot(-1) - 3\\cdot 1 = -2 - 3 = -5$. Non-zero — proceed.<br><br><strong>Step 3.</strong> Inverse (swap diagonals, flip off-diagonals, divide by $-5$):<br>$A^{-1} = \\dfrac{1}{-5}\\begin{pmatrix} -1 & -3 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1/5 & 3/5 \\\\ 1/5 & -2/5 \\end{pmatrix}$.<br><br><strong>Step 4.</strong> Multiply $A^{-1}$ by $\\mathbf{b}$:<br>$\\mathbf{x} = \\begin{pmatrix} 1/5 & 3/5 \\\\ 1/5 & -2/5 \\end{pmatrix}\\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 8/5 + 3/5 \\\\ 8/5 - 2/5 \\end{pmatrix} = \\begin{pmatrix} 11/5 \\\\ 6/5 \\end{pmatrix}$.<br><br>Answer: $\\mathbf{x} = 11/5$, $\\mathbf{y} = 6/5$.<br><br><strong>Verify:</strong> $2\\cdot(11/5) + 3\\cdot(6/5) = 22/5 + 18/5 = 40/5 = 8$. <em>OK.</em> $(11/5) - (6/5) = 5/5 = 1$. <em>OK.</em></div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Before computing $A^{-1}\\mathbf{b}$ you should <em>always</em> check $\\det A$ first. If it is zero, the inverse method fails — you must switch to elimination or substitution, and you should expect either no solution or infinitely many.</div></div>

<h2 class="lesson-title">7. Three Types of Linear System</h2>

<div class="calc-highlight"><strong>Geometrically, a 2-equation 2-unknown system is two straight lines in the plane.</strong> Lines can interact in exactly three ways: cross at one point (unique solution), be parallel and distinct (no solution), or coincide (infinitely many solutions). The determinant tells us which case we are in <em>before</em> we look at the picture.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">UNIQUE SOLUTION</div><div class="compare-item">$\\det A \\neq 0$</div><div class="compare-item">Two lines cross at exactly one point</div><div class="compare-item">$A^{-1}$ exists; $\\mathbf{x} = A^{-1}\\mathbf{b}$ gives the answer</div><div class="compare-item">System is called <em>consistent and independent</em></div></div><div class="compare-col"><div class="compare-title">NO SOLUTION</div><div class="compare-item">$\\det A = 0$ and equations are <em>inconsistent</em></div><div class="compare-item">Two lines are parallel and distinct (never meet)</div><div class="compare-item">No $\\mathbf{x}$ satisfies the system; written $\\emptyset$ or "no solution"</div><div class="compare-item">System is called <em>inconsistent</em></div></div></div>

<div style="margin:1.2rem 0">
<div style="background:rgba(245,158,11,0.06);border-left:3px solid #f59e0b;padding:0.9rem 1.1rem;border-radius:0 6px 6px 0;font-size:0.92rem;color:rgba(235,230,220,0.9)"><strong>INFINITELY MANY SOLUTIONS.</strong> $\\det A = 0$ <em>and</em> the two equations describe the same line (one is a scalar multiple of the other). Every point on the line is a solution; the solution set is a one-parameter family. System is called <em>consistent and dependent</em>.</div>
</div>

<div class="calc-example"><div class="example-label">CASE 1 — UNIQUE SOLUTION</div><div class="example-body">$\\;2x + y = 5,\\;\\; x - y = 1.\\;$<br>$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$, $\\det A = -2 - 1 = -3 \\neq 0$.<br>Lines cross at one point. Inverse method gives $x = 2$, $y = 1$.</div></div>

<div class="calc-example"><div class="example-label">CASE 2 — NO SOLUTION</div><div class="example-body">$\\;2x + 4y = 6,\\;\\; x + 2y = 5.\\;$<br>$A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$, $\\det A = 4 - 4 = 0$. Inverse does not exist.<br>Notice: row 1 is twice row 2 on the left side ($2x+4y = 2(x+2y)$), but the right sides $6$ and $5$ are not in the same ratio ($6 \\neq 2\\cdot 5$). So the lines are parallel and distinct — they never meet. <strong>No solution.</strong></div></div>

<div class="calc-example"><div class="example-label">CASE 3 — INFINITELY MANY SOLUTIONS</div><div class="example-body">$\\;2x + 4y = 10,\\;\\; x + 2y = 5.\\;$<br>$A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$, $\\det A = 0$ again. But now the right sides $10$ and $5$ <em>are</em> in the same ratio: $10 = 2\\cdot 5$. The two equations describe the same line. <strong>Infinitely many solutions:</strong> any pair $(x, y)$ with $x + 2y = 5$ works.</div></div>

<h2 class="lesson-title">8. Visualising the Three Cases</h2>

<p class="l-text">The three plots below illustrate the geometry. Each shows the two lines of a $2\\times 2$ system; the intersection (or lack of it) is the solution set.</p>

<div class="calc-graph"><div id="plot-l74-unique-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Case 1 — unique solution:</strong> two lines crossing. The marked point is the single $(x, y)$ that satisfies both equations. The matrix $A$ has $\\det A \\neq 0$, so $A^{-1}$ exists and $\\mathbf{x} = A^{-1}\\mathbf{b}$ produces this point.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return 5-2*x;});
var l2=xs.map(function(x){return x-1;});
var line1={x:xs,y:l1,mode:'lines',name:'2x + y = 5',line:{color:'#3b82f6',width:2.5}};
var line2={x:xs,y:l2,mode:'lines',name:'x − y = 1',line:{color:'#f59e0b',width:2.5}};
var pt={x:[2],y:[1],mode:'markers+text',name:'solution',marker:{color:'#22c55e',size:12,symbol:'circle'},text:['(2, 1)'],textposition:'top right',textfont:{color:'#22c55e',size:13}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l74-unique-en',[line1,line2,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l74-none-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Case 2 — no solution:</strong> two parallel lines that never meet. Both lines have slope $-1/2$ but different intercepts. The matrix $A$ has $\\det A = 0$, and the right-hand sides are <em>not</em> in the same ratio as the coefficients, so the lines are parallel but distinct.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (6-2*x)/4;});
var l2=xs.map(function(x){return (5-x)/2;});
var line1={x:xs,y:l1,mode:'lines',name:'2x + 4y = 6',line:{color:'#3b82f6',width:2.5}};
var line2={x:xs,y:l2,mode:'lines',name:'x + 2y = 5',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l74-none-en',[line1,line2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l74-inf-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Case 3 — infinitely many solutions:</strong> two equations that describe the <em>same</em> line. Plotted on top of each other, you see only one line. Every point on it is a solution. The matrix $A$ has $\\det A = 0$, and the right-hand sides match the coefficient ratio.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (10-2*x)/4;});
var l2=xs.map(function(x){return (5-x)/2;});
var line1={x:xs,y:l1,mode:'lines',name:'2x + 4y = 10',line:{color:'#3b82f6',width:4}};
var line2={x:xs,y:l2,mode:'lines',name:'x + 2y = 5',line:{color:'#f59e0b',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l74-inf-en',[line1,line2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Common Errors and How to Avoid Them</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dividing by zero determinant</div><div class="card-body">If $\\det A = 0$, the $2\\times 2$ formula's $1/\\det A$ is undefined. Compute the determinant <em>first</em> and stop if it is zero. Do not try to "force" the formula through.</div></div>
<div class="calc-card"><div class="card-title">Swapping but forgetting signs</div><div class="card-body">The $2\\times 2$ recipe swaps $a$ and $d$ <em>and</em> negates $b$ and $c$. Doing only one half gives a matrix that looks plausible but multiplies to the wrong thing.</div></div>
<div class="calc-card"><div class="card-title">Wrong product order</div><div class="card-body">$(AB)^{-1} = B^{-1}A^{-1}$, not $A^{-1}B^{-1}$. Reverse the order. This is one of the most common exam mistakes.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to transpose the cofactor matrix</div><div class="card-body">The adjugate is the <em>transpose</em> of the cofactor matrix, not the cofactor matrix itself. Skipping the transpose gives the right entries in the wrong positions.</div></div>
<div class="calc-card"><div class="card-title">Sign-of-cofactor errors</div><div class="card-body">Cofactors carry $(-1)^{i+j}$. The checkerboard sign pattern starts with $+$ at the top-left and alternates. Miss one sign and the whole inverse is wrong.</div></div>
<div class="calc-card"><div class="card-title">Multiplying on the wrong side</div><div class="card-body">To solve $A\\mathbf{x} = \\mathbf{b}$, multiply by $A^{-1}$ on the <em>left</em>: $A^{-1}A\\mathbf{x} = A^{-1}\\mathbf{b}$, giving $\\mathbf{x} = A^{-1}\\mathbf{b}$. Multiplying on the right ($\\mathbf{x}A^{-1}$) is meaningless when $\\mathbf{x}$ is a column.</div></div>
</div>

<h2 class="lesson-title">10. Practice Problems</h2>

<p class="l-text">Eight problems combining everything in this lesson. Try each yourself before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — $2\\times 2$ INVERSE</div><div class="example-body"><strong>Find the inverse of</strong> $A = \\begin{pmatrix} 5 & 2 \\\\ 3 & 1 \\end{pmatrix}$.<br><br>$\\det A = 5\\cdot 1 - 2\\cdot 3 = 5 - 6 = -1$. Non-zero.<br>Swap-and-negate: $\\begin{pmatrix} 1 & -2 \\\\ -3 & 5 \\end{pmatrix}$. Divide by $-1$:<br>$A^{-1} = \\begin{pmatrix} -1 & 2 \\\\ 3 & -5 \\end{pmatrix}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TEST FOR SINGULARITY</div><div class="example-body"><strong>Decide whether</strong> $B = \\begin{pmatrix} 4 & 6 \\\\ 6 & 9 \\end{pmatrix}$ <strong>has an inverse.</strong><br><br>$\\det B = 4\\cdot 9 - 6\\cdot 6 = 36 - 36 = 0$. <strong>$B$ is singular.</strong> No inverse exists. (Notice that row 2 = $1.5\\,\\cdot$ row 1 — that linear dependence is exactly what zero determinant detects.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — SOLVE $2\\times 2$ SYSTEM</div><div class="example-body"><strong>Solve</strong> $\\;3x + y = 7, \\;\\; 2x - y = 3.$<br><br>$A = \\begin{pmatrix} 3 & 1 \\\\ 2 & -1 \\end{pmatrix}$, $\\det A = -3 - 2 = -5$.<br>$A^{-1} = \\dfrac{1}{-5}\\begin{pmatrix} -1 & -1 \\\\ -2 & 3 \\end{pmatrix} = \\begin{pmatrix} 1/5 & 1/5 \\\\ 2/5 & -3/5 \\end{pmatrix}$.<br>$\\mathbf{x} = A^{-1}\\begin{pmatrix} 7 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 7/5 + 3/5 \\\\ 14/5 - 9/5 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$.<br>Answer: $x = 2$, $y = 1$. <em>Check:</em> $3\\cdot 2 + 1 = 7$, $2\\cdot 2 - 1 = 3$. OK.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — INVERSE OF AN INVERSE</div><div class="example-body"><strong>If</strong> $A^{-1} = \\begin{pmatrix} 4 & -1 \\\\ -3 & 1 \\end{pmatrix}$<strong>, find</strong> $A$.<br><br>By property 1, $(A^{-1})^{-1} = A$. So just invert the given matrix.<br>$\\det(A^{-1}) = 4\\cdot 1 - (-1)\\cdot(-3) = 4 - 3 = 1$.<br>$A = (A^{-1})^{-1} = \\dfrac{1}{1}\\begin{pmatrix} 1 & 1 \\\\ 3 & 4 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 3 & 4 \\end{pmatrix}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — IDENTIFY THE CASE</div><div class="example-body"><strong>Without solving, classify the system</strong> $\\;3x - 6y = 9, \\;\\; -x + 2y = -3.$<br><br>$A = \\begin{pmatrix} 3 & -6 \\\\ -1 & 2 \\end{pmatrix}$, $\\det A = 6 - 6 = 0$. So the system is <em>not</em> uniquely solvable.<br>Check the right-hand sides: row 1 RHS is $9$, row 2 RHS is $-3$. Note row 1 = $-3\\,\\cdot$ row 2 in the coefficient matrix; on the RHS, $9 = -3\\cdot(-3)$ also holds. The two equations describe the same line.<br>Answer: <strong>infinitely many solutions</strong>. Any pair $(x, y)$ with $-x + 2y = -3$ (equivalently, $x = 2y + 3$) works.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — PRODUCT INVERSE PROPERTY</div><div class="example-body"><strong>If</strong> $A^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ <strong>and</strong> $B^{-1} = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$<strong>, find</strong> $(AB)^{-1}$.<br><br>By property 2: $(AB)^{-1} = B^{-1}A^{-1}$ (reverse order!).<br>$B^{-1}A^{-1} = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 6 & 3 \\\\ 2 & 2 \\end{pmatrix}$.<br>Answer: $(AB)^{-1} = \\begin{pmatrix} 6 & 3 \\\\ 2 & 2 \\end{pmatrix}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — $3\\times 3$ SYSTEM (HINT)</div><div class="example-body"><strong>Solve</strong> $\\;x + 2y + 3z = 6, \\;\\; y + 4z = 5, \\;\\; 5x + 6y = 11.$<br><br>This is the same $A$ as the worked example in section 4. The right-hand side is $\\mathbf{b} = (6, 5, 11)^T$.<br>From section 4: $A^{-1} = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$.<br>$\\mathbf{x} = A^{-1}\\mathbf{b}$:<br>$x = -24\\cdot 6 + 18\\cdot 5 + 5\\cdot 11 = -144 + 90 + 55 = 1$<br>$y = 20\\cdot 6 - 15\\cdot 5 - 4\\cdot 11 = 120 - 75 - 44 = 1$<br>$z = -5\\cdot 6 + 4\\cdot 5 + 1\\cdot 11 = -30 + 20 + 11 = 1$<br>Answer: $x = y = z = 1$. <em>Check the first equation:</em> $1 + 2 + 3 = 6$. OK.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — MIXED PROPERTIES</div><div class="example-body"><strong>Given</strong> $\\det A = 4$ <strong>and</strong> $A$ <strong>is</strong> $3\\times 3$<strong>, find</strong> $\\det(A^{-1})$ <strong>and</strong> $\\det(2 A^{-1})$.<br><br>$\\det(A^{-1}) = 1/\\det A = 1/4$.<br>For a $3\\times 3$ matrix, $\\det(kM) = k^3 \\det M$. So $\\det(2 A^{-1}) = 2^3 \\cdot \\det(A^{-1}) = 8 \\cdot (1/4) = 2$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Inverse $A^{-1}$ is the unique matrix with $A A^{-1} = A^{-1} A = I$; only square matrices can have inverses</li>
<li>$A^{-1}$ exists $\\Leftrightarrow$ $\\det A \\neq 0$; otherwise $A$ is singular</li>
<li>$2\\times 2$ formula: swap diagonals, negate off-diagonals, divide by determinant</li>
<li>$3\\times 3$ formula: cofactors $\\to$ adjugate (transpose) $\\to$ divide by determinant</li>
<li>Key properties: $(A^{-1})^{-1} = A$, $(AB)^{-1} = B^{-1}A^{-1}$ (reverse order), $(A^T)^{-1} = (A^{-1})^T$</li>
<li>Linear system $A\\mathbf{x} = \\mathbf{b}$ has unique solution $\\mathbf{x} = A^{-1}\\mathbf{b}$ when $\\det A \\neq 0$</li>
<li>$\\det A = 0$ means no solution (parallel lines) <em>or</em> infinitely many (coincident lines), depending on the RHS</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Matrisleri toplamayı ve çarpmayı zaten biliyorsun.</strong> Peki bölmek? Matrisler için $A / B$ doğrudan yazılamaz — bölme tanımlı bir işlem değildir. Ama sıradan sayılarda 5'e bölmek, 5'in çarpımsal tersi olan $1/5$ ile çarpmakla aynıdır. Matrislerin de bu fikrin kendi versiyonu vardır: <em>ters matris</em>, $A^{-1}$ ile gösterilir. Var olduğunda, matris dünyasındaki "bir bölü $A$" gibi davranır ve doğrusal sistemleri çözmek için matris yönteminin tek anahtarıdır.</p>

<p class="l-text">Bu dersin sonunda, bir matrisin ne zaman tersinin olduğunu, $2\\times 2$ için kapalı formülünü, $3\\times 3$ için ek matris (adjoint) tarifini, her tersin uyduğu cebirsel özellikleri ve — en önemlisi — $A\\mathbf{x} = \\mathbf{b}$ sistemini tek bir matris çarpımıyla nasıl çözeceğini bileceksin. Ayrıca geometrik olarak, neden bazı sistemlerin tek bir çözümü olduğunu, bazılarının olmadığını, bazılarının ise sonsuz çözümü olduğunu göreceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ters matris $A^{-1}$'i $A A^{-1} = A^{-1} A = I$ özelliğini sağlayan tek matris olarak tanımlamayı</li>
<li>Tersinirlik kriterini ifade etmeyi: $A^{-1}$ ancak ve ancak $\\det(A) \\neq 0$ ise vardır (ve $A$ karedir)</li>
<li>$2\\times 2$ matrisin tersini yer-değiştir-ve-işaret formülüyle hesaplamayı</li>
<li>$3\\times 3$ matrisin tersini kofaktör, ek matris (adjoint) ve determinanta bölme yöntemiyle hesaplamayı</li>
<li>$(A^{-1})^{-1} = A$, $(AB)^{-1} = B^{-1}A^{-1}$ ve $(A^{T})^{-1} = (A^{-1})^{T}$ cebirsel kurallarını uygulamayı</li>
<li>$A\\mathbf{x} = \\mathbf{b}$ doğrusal sistemini $\\mathbf{x} = A^{-1}\\mathbf{b}$ yazarak çözmeyi, çözümsüz veya sonsuz çözümlü durumları tanımayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Ters Matris Nedir?</h2>

<div class="calc-highlight"><strong>7 sayısının tersi vardır: $1/7$. Çarpınca 1 elde edilir.</strong> 0 sayısının yoktur — $1/0$ diye bir şey yoktur. Matrisler aynı örüntüyü izler. Bazı kare matrislerin ters partneri vardır; bazılarının ("matris sıfırları" denebilir) yoktur. 1 rolünü oynayan matris, birim matristir $I$.</div>

<p class="l-text"><strong>Birim matrisi</strong> hatırla. $n = 2$ ve $n = 3$ için:</p>

<div class="calc-formula"><div class="formula-label">BİRİM MATRİSLER</div><div class="formula-main">$$I_2 \\;=\\; \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\qquad I_3 \\;=\\; \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$</div><div class="formula-sub">Herhangi bir matrisi (uygun boyutta) $I$ ile çarpmak onu değiştirmez: $AI = IA = A$. Birim matris, matris cebrinde 1 sayısının rolünü oynar.</div></div>

<p class="l-text">Şimdi tersi tam olarak tanımlayabiliriz.</p>

<div class="calc-formula"><div class="formula-label">TERS MATRİS TANIMI</div><div class="formula-main">$$A \\cdot A^{-1} \\;=\\; A^{-1} \\cdot A \\;=\\; I$$</div><div class="formula-sub">$A^{-1}$, $A$ ile her iki yönde çarpıldığında birim matrisi veren (varsa tek olan) matristir. Böyle bir matris varsa, $A$'ya <em>tersinir</em> veya <em>tekil olmayan</em> (non-singular) denir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sadece kare matrisler</div><div class="card-body">Yalnızca kare matrislerin ($n\\times n$) tersi olabilir. $2\\times 3$ bir matrisin tersi yoktur — $AA^{-1}$ ve $A^{-1}A$ çarpımları farklı boyutlarda olurdu.</div></div>
<div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">Bir ters varsa, işe yarayan tek matris odur. Bir yerlerde gizlenmiş "ikinci ters" yoktur.</div></div>
<div class="calc-card"><div class="card-title">İki yönlü</div><div class="card-body">Aynı $A^{-1}$ iki tarafta da çalışır: $A A^{-1} = I$ <em>ve</em> $A^{-1} A = I$. Kare matrisler için yalnız birini kontrol etmek yeterlidir — diğeri otomatik gelir.</div></div>
</div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL</div><div class="example-body">$B = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$, $A = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$'in tersi midir?<br><br>$A \\cdot B$ hesapla:<br>$\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1\\cdot 2 + (-1)\\cdot 1 & 1\\cdot 1 + (-1)\\cdot 1 \\\\ -1\\cdot 2 + 2\\cdot 1 & -1\\cdot 1 + 2\\cdot 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$. <strong>Evet</strong>, $B = A^{-1}$.</div></div>

<h2 class="lesson-title">2. Ters Ne Zaman Vardır? Determinant Kriteri</h2>

<div class="calc-highlight"><strong>Bütün teori tek bir kurala dayanır:</strong> kare bir matrisin tersi vardır ancak ve ancak determinantı sıfırdan farklıysa. $\\det(A) \\neq 0 \\;\\Leftrightarrow\\; A^{-1}$ vardır. İstisna yok, sınır durum yok. Önce determinantı hesapla; sıfırsa dur — bulunacak ters yoktur.</div>

<p class="l-text">Neden her şeyi determinant belirler? Önceki derslerde determinantı, doğrusal dönüşümün "ölçek katsayısı"nı veren skaler olarak gördün. $\\det A = 0$ olduğunda dönüşüm, düzlemi (veya uzayı) daha düşük boyutlu bir kümeye — bir doğruya ya da bir noktaya — sıkıştırır. Bu sıkışma bilgiyi yok eder: birçok giriş noktası aynı çıkışa gönderilir, dolayısıyla haritayı "geri alma" imkânı yoktur. Ters bunu geri almak zorunda olurdu — yapamaz, bu yüzden ters yoktur.</p>

<div class="calc-formula"><div class="formula-label">TERSİNİRLİK KRİTERİ</div><div class="formula-main">$$A^{-1} \\text{ vardır} \\quad\\Longleftrightarrow\\quad \\det(A) \\neq 0$$</div><div class="formula-sub">Determinantı sıfırdan farklı matrise <em>tekil olmayan</em> (non-singular) veya <em>tersinir</em> denir. $\\det = 0$ olan matrise <em>tekil</em> (singular) denir (tersi yoktur).</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TEKİL OLMAYAN (TERSİNİR)</div><div class="compare-item">$\\det(A) \\neq 0$</div><div class="compare-item">$A^{-1}$ vardır ve tektir</div><div class="compare-item">$A\\mathbf{x} = \\mathbf{b}$ sisteminin <strong>tek bir</strong> çözümü vardır</div><div class="compare-item">Satırlar (ve sütunlar) doğrusal bağımsızdır</div></div><div class="compare-col"><div class="compare-title">TEKİL (TERSİ YOK)</div><div class="compare-item">$\\det(A) = 0$</div><div class="compare-item">Ters yoktur</div><div class="compare-item">Sistemin <strong>çözümü yoktur</strong> ya da <strong>sonsuz çözümü vardır</strong></div><div class="compare-item">Satırlar doğrusal bağımlıdır (biri diğerlerinin doğrusal birleşimidir)</div></div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$ için determinantı hesapla: $\\det A = 2\\cdot 2 - 4\\cdot 1 = 0$. Demek ki $A$ tekildir ve tersi yoktur. İkinci satırın birinci satırın yarısı olduğuna dikkat et — sıfır determinantın yakaladığı şey tam da bu doğrusal bağımlılıktır.</div></div>

<h2 class="lesson-title">3. $2\\times 2$ Ters Formülü</h2>

<div class="calc-highlight"><strong>$2\\times 2$ matrisler için zarif bir kapalı form vardır.</strong> İki köşegen elemanı yer değiştir, köşegen dışı elemanların işaretini ters çevir, sonra her şeyi determinanta böl. Algoritma bundan ibarettir.</div>

<div class="calc-formula"><div class="formula-label">$2\\times 2$ TERS FORMÜLÜ</div><div class="formula-main">$$A \\;=\\; \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\quad\\Longrightarrow\\quad A^{-1} \\;=\\; \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$</div><div class="formula-sub">$\\det A = ad - bc \\neq 0$ olduğu sürece geçerlidir. Örüntüye dikkat et: $a$ ve $d$ yer değiştirir; $b$ ve $c$ eksi işareti alır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — determinant</div><div class="card-body">$ad - bc$'yi hesapla. Sıfırsa dur. Aksi halde her elemanı bölecek bölen budur.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — köşegenleri değiştir</div><div class="card-body">$d$'yi $a$'nın olduğu yere, $a$'yı $d$'nin olduğu yere koy. Köşegen elemanları yer değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — köşegen dışlarını negatifle</div><div class="card-body">$b$ kendi yerinde $-b$ olur; $c$ kendi yerinde $-c$ olur. Hareket ettirme — sadece işareti çevir.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — böl</div><div class="card-body">Tüm matrisi $1/\\det A$ ile çarp. Şimdi elinde $A^{-1}$ var.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$A = \\begin{pmatrix} 3 & 5 \\\\ 1 & 2 \\end{pmatrix}$'in tersini bul.<br><br><strong>Adım 1.</strong> $\\det A = 3\\cdot 2 - 5\\cdot 1 = 6 - 5 = 1$. Sıfırdan farklı, ters vardır.<br><strong>Adım 2.</strong> 3 ile 2'yi yer değiştir: köşegen $\\begin{pmatrix} 2 & \\cdot \\\\ \\cdot & 3 \\end{pmatrix}$ olur.<br><strong>Adım 3.</strong> 5 ile 1'i negatifle: köşegen dışı elemanlar $-5$ ve $-1$ olur.<br><strong>Adım 4.</strong> 1'e böl (değişiklik yok).<br><br>Cevap: $A^{-1} = \\begin{pmatrix} 2 & -5 \\\\ -1 & 3 \\end{pmatrix}$.<br><br><strong>Kontrol:</strong> $A \\cdot A^{-1} = \\begin{pmatrix} 3 & 5 \\\\ 1 & 2 \\end{pmatrix}\\begin{pmatrix} 2 & -5 \\\\ -1 & 3 \\end{pmatrix} = \\begin{pmatrix} 6-5 & -15+15 \\\\ 2-2 & -5+6 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$. Doğru.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DETERMİNANT BİR DEĞİL</div><div class="example-body">$A = \\begin{pmatrix} 4 & 2 \\\\ 3 & 1 \\end{pmatrix}$'in tersini bul.<br><br>$\\det A = 4\\cdot 1 - 2\\cdot 3 = 4 - 6 = -2$.<br>Yer-değiştir-ve-negatifle: $\\begin{pmatrix} 1 & -2 \\\\ -3 & 4 \\end{pmatrix}$.<br>$-2$'ye böl: $A^{-1} = \\dfrac{1}{-2}\\begin{pmatrix} 1 & -2 \\\\ -3 & 4 \\end{pmatrix} = \\begin{pmatrix} -1/2 & 1 \\\\ 3/2 & -2 \\end{pmatrix}$.</div></div>

<div class="l-note"><strong>Sık hata:</strong> köşegen elemanlarını yer değiştirmeyi unutmak ya da köşegen dışı işaretleri çevirmeyi unutmak. Daima hatırla: formülde hem yer değişimi <em>hem de</em> işaret değişimi vardır. Birini atla, "tersin" yanlış olur.</div>

<h2 class="lesson-title">4. Kofaktör ve Ek Matris ile $3\\times 3$ Ters</h2>

<div class="calc-highlight"><strong>$3\\times 3$ matrisler için temiz bir yer-değiştir-işaret-çevir kestirmesi yoktur.</strong> Onun yerine tersi, determinantı açılımla hesaplarken kullandığın aynı yapı taşlarından — kofaktörlerden — kurarız. Tarifin üç adlandırılmış adımı vardır: kofaktör matrisi, ek matris (transpoz), determinanta bölme.</div>

<p class="l-text"><strong>Adım 1: kofaktörler.</strong> $A$'nın her $a_{ij}$ elemanı için, <em>kofaktör</em> $C_{ij}$, $i$. satır ile $j$. sütunu silerek elde edilen $2\\times 2$ matrisinin işaretli determinantıdır:</p>

<div class="calc-formula"><div class="formula-label">KOFAKTÖR</div><div class="formula-main">$$C_{ij} \\;=\\; (-1)^{i+j} \\cdot \\det(M_{ij})$$</div><div class="formula-sub">$M_{ij}$, $2\\times 2$ minördür — $i$. satır ve $j$. sütun çıkarılarak elde edilir. $(-1)^{i+j}$ işareti satranç tahtası örüntüsünde değişir.</div></div>

<p class="l-text"><strong>Adım 2: ek matris (adjoint).</strong> Dokuz kofaktörü bir $3\\times 3$ matriste topla, sonra <em>transpozunu</em> al (satır ve sütunlar yer değiştirir). Sonuca $A$'nın <strong>ek matrisi</strong> (klasik adjoint) denir:</p>

<div class="calc-formula"><div class="formula-label">EK MATRİS (ADJOİNT)</div><div class="formula-main">$$\\text{adj}(A) \\;=\\; (C_{ij})^{T} \\;=\\; \\begin{pmatrix} C_{11} & C_{21} & C_{31} \\\\ C_{12} & C_{22} & C_{32} \\\\ C_{13} & C_{23} & C_{33} \\end{pmatrix}$$</div><div class="formula-sub">İndeks değişimine dikkat: transpoz sonrası $C_{ij}$, $j$. satıra ve $i$. sütuna gider.</div></div>

<p class="l-text"><strong>Adım 3: böl.</strong> Ters, ek matrisin determinanta bölümüdür:</p>

<div class="calc-formula"><div class="formula-label">EK MATRİS YOLUYLA TERS</div><div class="formula-main">$$A^{-1} \\;=\\; \\frac{1}{\\det A} \\cdot \\text{adj}(A)$$</div><div class="formula-sub">$2\\times 2$ durumuyla aynı mantık — aslında $2\\times 2$ formülü, bu tarifin tüm adımlarının sadeleştirilmiş hali.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $3\\times 3$ TERS</div><div class="example-body">$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}$'in tersini bul.<br><br><strong>Adım 1.</strong> Determinant (birinci satıra göre aç):<br>$\\det A = 1\\cdot(1\\cdot 0 - 4\\cdot 6) - 2\\cdot(0\\cdot 0 - 4\\cdot 5) + 3\\cdot(0\\cdot 6 - 1\\cdot 5)$<br>$= 1\\cdot(-24) - 2\\cdot(-20) + 3\\cdot(-5) = -24 + 40 - 15 = 1$. Sıfırdan farklı — ters vardır.<br><br><strong>Adım 2.</strong> Dokuz kofaktörü hesapla:<br>$C_{11} = +(1\\cdot 0 - 4\\cdot 6) = -24$, $\\;C_{12} = -(0\\cdot 0 - 4\\cdot 5) = 20$, $\\;C_{13} = +(0\\cdot 6 - 1\\cdot 5) = -5$<br>$C_{21} = -(2\\cdot 0 - 3\\cdot 6) = 18$, $\\;C_{22} = +(1\\cdot 0 - 3\\cdot 5) = -15$, $\\;C_{23} = -(1\\cdot 6 - 2\\cdot 5) = 4$<br>$C_{31} = +(2\\cdot 4 - 3\\cdot 1) = 5$, $\\;C_{32} = -(1\\cdot 4 - 3\\cdot 0) = -4$, $\\;C_{33} = +(1\\cdot 1 - 2\\cdot 0) = 1$<br><br><strong>Adım 3.</strong> Ek matris (kofaktör matrisinin transpozu):<br>$\\text{adj}(A) = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$.<br><br><strong>Adım 4.</strong> $\\det A = 1$'e böl (değişiklik yok):<br>$A^{-1} = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$.</div></div>

<div class="l-note"><strong>Pratik öneri:</strong> $3\\times 3$ ek matris yöntemi güvenilirdir ama hataya açıktır — bir kofaktörün işaretini yanlış almak veya transpozu unutmak kolaydır. Üniversitede Gauss-Jordan eliminasyonunu öğreneceksin, $n\\ge 3$ için çok daha hızlıdır. Ama lise sınavları için kofaktör yöntemi beklenen yaklaşımdır. Pratiğini yap.</div>

<h2 class="lesson-title">5. Tersin Cebirsel Özellikleri</h2>

<div class="calc-highlight"><strong>Her öğrencinin bilmesi gereken üç özdeşlik.</strong> Ters içeren ifadeleri hesap yapmaya gerek kalmadan sadeleştirmeni sağlarlar ve sınav sorularında sürekli karşına çıkarlar.</div>

<div class="calc-formula"><div class="formula-label">ÖZELLİK 1 — İNVOLÜSYON</div><div class="formula-main">$$(A^{-1})^{-1} \\;=\\; A$$</div><div class="formula-sub">Tersin tersi, orijinal matristir. Sezgi: geri almayı geri almak, orijinal işlemdir.</div></div>

<div class="calc-formula"><div class="formula-label">ÖZELLİK 2 — ÇARPIM (TERS SIRADA!)</div><div class="formula-main">$$(AB)^{-1} \\;=\\; B^{-1} A^{-1}$$</div><div class="formula-sub">Çarpımın tersi, terslerin <em>ters sırada</em> çarpımıdır. Şöyle düşün: önce çorap sonra ayakkabı giyiyorsan, çıkarırken önce ayakkabı sonra çorap.</div></div>

<div class="calc-formula"><div class="formula-label">ÖZELLİK 3 — TRANSPOZ</div><div class="formula-main">$$(A^{T})^{-1} \\;=\\; (A^{-1})^{T}$$</div><div class="formula-sub">Ters alma ve transpoz alma yer değiştirir. Hangisini önce yaparsan yap, aynı sonucu alırsın.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tersin determinantı</div><div class="card-body">$\\det(A^{-1}) = 1/\\det(A)$. $A A^{-1} = I$'a $\\det(AB) = \\det A \\cdot \\det B$ uygulanarak çıkar.</div></div>
<div class="calc-card"><div class="card-title">Birim matris kendi tersidir</div><div class="card-body">$I^{-1} = I$. $I \\cdot I = I$ olduğundan birim matris kendi tersidir.</div></div>
<div class="calc-card"><div class="card-title">Skaler katın tersi</div><div class="card-body">Sıfırdan farklı her skaler $k$ için $(kA)^{-1} = \\dfrac{1}{k} A^{-1}$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖZELLİKLERİ KULLANMA</div><div class="example-body">$A$ ve $B$'nin tersinir olduğunu varsayarak $(A B^{T})^{-1}$'i sadeleştir.<br><br>Özellik 2'yi (çarpım, ters sıra) uygula: $(A B^{T})^{-1} = (B^{T})^{-1} A^{-1}$.<br>Özellik 3'ü (transpoz ile ters yer değiştirir) uygula: $(B^{T})^{-1} = (B^{-1})^{T}$.<br><br>Sonuç: $(A B^{T})^{-1} = (B^{-1})^{T} A^{-1}$.</div></div>

<div class="l-note"><strong>Özellik 2'de neden ters sıra?</strong> Hızlı kontrol: $(AB)(B^{-1}A^{-1}) = A(B B^{-1})A^{-1} = A \\cdot I \\cdot A^{-1} = A A^{-1} = I$. Sadeleşme yalnızca $B$ ile $B^{-1}$ ortada buluştuğu için işliyor. Yanlış sırada $A^{-1} B^{-1}$ yazsaydın, yanlış matrisler ortada buluşurdu ve sadeleşme başarısız olurdu.</div>

<h2 class="lesson-title">6. Ters Yardımıyla Doğrusal Sistemleri Çözmek</h2>

<div class="calc-highlight"><strong>İşte kazancı.</strong> $n$ bilinmeyenli $n$ denklemli her doğrusal sistem, tek bir matris denklemi olarak $A\\mathbf{x} = \\mathbf{b}$ biçiminde yazılabilir. $A$ tersinirse her iki tarafı soldan $A^{-1}$ ile çarpmak $\\mathbf{x} = A^{-1}\\mathbf{b}$ verir. Tüm sistem tek bir matris çarpımıyla çözülür.</div>

<p class="l-text">Şöyle bir sistem<br>$\\quad 2x + 3y = 8$<br>$\\quad x - y = 1$<br>$A\\mathbf{x} = \\mathbf{b}$ olarak paketlenebilir, burada</p>

<div class="calc-formula"><div class="formula-label">DOĞRUSAL SİSTEMİN MATRİS FORMU</div><div class="formula-main">$$A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}, \\quad \\mathbf{x} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad \\mathbf{b} = \\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}$$</div><div class="formula-sub">$A$ katsayıları, $\\mathbf{x}$ bilinmeyenleri, $\\mathbf{b}$ sağ tarafları tutar. Tek bir $A\\mathbf{x} = \\mathbf{b}$ denklemi sistemi kapsar.</div></div>

<div class="calc-formula"><div class="formula-label">TERS İLE ÇÖZÜM</div><div class="formula-main">$$A\\mathbf{x} = \\mathbf{b} \\quad\\Longrightarrow\\quad \\mathbf{x} = A^{-1}\\mathbf{b}$$</div><div class="formula-sub">$A$ tersinir olduğu sürece geçerlidir — yani $\\det A \\neq 0$ olduğunda. Bu durumda çözüm tektir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $2\\times 2$ SİSTEM</div><div class="example-body">$\\;2x + 3y = 8, \\;\\; x - y = 1\\;$ sistemini matris ters yöntemiyle çöz.<br><br><strong>Adım 1.</strong> Matris formuna yaz: $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}$, $\\mathbf{b} = \\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix}$.<br><br><strong>Adım 2.</strong> Determinant: $\\det A = 2\\cdot(-1) - 3\\cdot 1 = -2 - 3 = -5$. Sıfırdan farklı — devam.<br><br><strong>Adım 3.</strong> Ters (köşegenleri yer değiştir, köşegen dışları negatifle, $-5$'e böl):<br>$A^{-1} = \\dfrac{1}{-5}\\begin{pmatrix} -1 & -3 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1/5 & 3/5 \\\\ 1/5 & -2/5 \\end{pmatrix}$.<br><br><strong>Adım 4.</strong> $A^{-1}$'i $\\mathbf{b}$ ile çarp:<br>$\\mathbf{x} = \\begin{pmatrix} 1/5 & 3/5 \\\\ 1/5 & -2/5 \\end{pmatrix}\\begin{pmatrix} 8 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 8/5 + 3/5 \\\\ 8/5 - 2/5 \\end{pmatrix} = \\begin{pmatrix} 11/5 \\\\ 6/5 \\end{pmatrix}$.<br><br>Cevap: $x = 11/5$, $y = 6/5$.<br><br><strong>Doğrula:</strong> $2\\cdot(11/5) + 3\\cdot(6/5) = 22/5 + 18/5 = 40/5 = 8$. <em>OK.</em> $(11/5) - (6/5) = 5/5 = 1$. <em>OK.</em></div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$A^{-1}\\mathbf{b}$ hesaplamadan <em>önce</em> daima $\\det A$'yı kontrol etmelisin. Sıfırsa ters yöntemi başarısız olur — eliminasyon veya yerine koyma yöntemine geçmelisin, ve sonucun çözümsüz veya sonsuz çözümlü olmasını beklemelisin.</div></div>

<h2 class="lesson-title">7. Üç Tür Doğrusal Sistem</h2>

<div class="calc-highlight"><strong>Geometrik olarak, 2 bilinmeyenli 2 denklemli bir sistem, düzlemde iki doğrudur.</strong> Doğrular tam üç şekilde etkileşebilir: bir noktada kesişirler (tek çözüm), paralel ve farklıdırlar (çözüm yok), çakışıktırlar (sonsuz çözüm). Determinant, resme bakmadan <em>önce</em> hangi durumda olduğumuzu söyler.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TEK ÇÖZÜM</div><div class="compare-item">$\\det A \\neq 0$</div><div class="compare-item">İki doğru tam bir noktada kesişir</div><div class="compare-item">$A^{-1}$ vardır; $\\mathbf{x} = A^{-1}\\mathbf{b}$ cevabı verir</div><div class="compare-item">Sistem <em>tutarlı ve bağımsızdır</em></div></div><div class="compare-col"><div class="compare-title">ÇÖZÜM YOK</div><div class="compare-item">$\\det A = 0$ ve denklemler <em>tutarsızdır</em></div><div class="compare-item">İki doğru paralel ve farklıdır (asla kesişmezler)</div><div class="compare-item">Hiçbir $\\mathbf{x}$ sistemi sağlamaz; $\\emptyset$ veya "çözüm yok" yazılır</div><div class="compare-item">Sistem <em>tutarsızdır</em></div></div></div>

<div style="margin:1.2rem 0">
<div style="background:rgba(245,158,11,0.06);border-left:3px solid #f59e0b;padding:0.9rem 1.1rem;border-radius:0 6px 6px 0;font-size:0.92rem;color:rgba(235,230,220,0.9)"><strong>SONSUZ ÇÖZÜM.</strong> $\\det A = 0$ <em>ve</em> iki denklem aynı doğruyu tanımlar (biri diğerinin skaler katıdır). Doğru üstündeki her nokta bir çözümdür; çözüm kümesi tek parametreli bir ailedir. Sistem <em>tutarlı ve bağımlıdır</em>.</div>
</div>

<div class="calc-example"><div class="example-label">DURUM 1 — TEK ÇÖZÜM</div><div class="example-body">$\\;2x + y = 5,\\;\\; x - y = 1.\\;$<br>$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$, $\\det A = -2 - 1 = -3 \\neq 0$.<br>Doğrular bir noktada kesişir. Ters yöntemi $x = 2$, $y = 1$ verir.</div></div>

<div class="calc-example"><div class="example-label">DURUM 2 — ÇÖZÜM YOK</div><div class="example-body">$\\;2x + 4y = 6,\\;\\; x + 2y = 5.\\;$<br>$A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$, $\\det A = 4 - 4 = 0$. Ters yoktur.<br>Dikkat: sol tarafta satır 1, satır 2'nin iki katıdır ($2x+4y = 2(x+2y)$), ama sağ taraflar $6$ ve $5$ aynı oranda değil ($6 \\neq 2\\cdot 5$). Dolayısıyla doğrular paralel ve farklıdır — asla kesişmezler. <strong>Çözüm yok.</strong></div></div>

<div class="calc-example"><div class="example-label">DURUM 3 — SONSUZ ÇÖZÜM</div><div class="example-body">$\\;2x + 4y = 10,\\;\\; x + 2y = 5.\\;$<br>$A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$, $\\det A = 0$ yine. Ama şimdi sağ taraflar $10$ ve $5$ <em>aynı oranda</em>: $10 = 2\\cdot 5$. İki denklem aynı doğruyu tanımlar. <strong>Sonsuz çözüm:</strong> $x + 2y = 5$ koşulunu sağlayan her $(x, y)$ ikilisi çalışır.</div></div>

<h2 class="lesson-title">8. Üç Durumun Görselleştirilmesi</h2>

<p class="l-text">Aşağıdaki üç grafik geometriyi gösteriyor. Her biri $2\\times 2$ bir sistemin iki doğrusunu çizer; kesişim (veya yokluğu) çözüm kümesidir.</p>

<div class="calc-graph"><div id="plot-l74-unique-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Durum 1 — tek çözüm:</strong> kesişen iki doğru. İşaretli nokta, her iki denklemi sağlayan tek $(x, y)$ değeridir. Matris $A$ için $\\det A \\neq 0$, dolayısıyla $A^{-1}$ vardır ve $\\mathbf{x} = A^{-1}\\mathbf{b}$ bu noktayı üretir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return 5-2*x;});
var l2=xs.map(function(x){return x-1;});
var line1={x:xs,y:l1,mode:'lines',name:'2x + y = 5',line:{color:'#3b82f6',width:2.5}};
var line2={x:xs,y:l2,mode:'lines',name:'x − y = 1',line:{color:'#f59e0b',width:2.5}};
var pt={x:[2],y:[1],mode:'markers+text',name:'çözüm',marker:{color:'#22c55e',size:12,symbol:'circle'},text:['(2, 1)'],textposition:'top right',textfont:{color:'#22c55e',size:13}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l74-unique-tr',[line1,line2,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l74-none-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Durum 2 — çözüm yok:</strong> asla kesişmeyen iki paralel doğru. Her iki doğrunun eğimi $-1/2$ ama kesişim noktaları farklı. Matris $A$ için $\\det A = 0$ ve sağ taraflar katsayılarla aynı oranda <em>değil</em>, dolayısıyla doğrular paralel ama farklıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (6-2*x)/4;});
var l2=xs.map(function(x){return (5-x)/2;});
var line1={x:xs,y:l1,mode:'lines',name:'2x + 4y = 6',line:{color:'#3b82f6',width:2.5}};
var line2={x:xs,y:l2,mode:'lines',name:'x + 2y = 5',line:{color:'#ef4444',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l74-none-tr',[line1,line2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l74-inf-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Durum 3 — sonsuz çözüm:</strong> <em>aynı</em> doğruyu tanımlayan iki denklem. Üst üste çizdiğinde sadece tek doğru görürsün. Üstündeki her nokta bir çözümdür. Matris $A$ için $\\det A = 0$ ve sağ taraflar katsayı oranıyla uyuşur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (10-2*x)/4;});
var l2=xs.map(function(x){return (5-x)/2;});
var line1={x:xs,y:l1,mode:'lines',name:'2x + 4y = 10',line:{color:'#3b82f6',width:4}};
var line2={x:xs,y:l2,mode:'lines',name:'x + 2y = 5',line:{color:'#f59e0b',width:2,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l74-inf-tr',[line1,line2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Sık Yapılan Hatalar ve Bunlardan Kaçınma</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıfır determinanta bölme</div><div class="card-body">$\\det A = 0$ ise $2\\times 2$ formülünün $1/\\det A$ terimi tanımsızdır. Determinantı <em>önce</em> hesapla; sıfırsa dur. Formülü "zorla" ilerletmeye çalışma.</div></div>
<div class="calc-card"><div class="card-title">Yer değiştirip işareti unutmak</div><div class="card-body">$2\\times 2$ tarifi $a$ ile $d$'yi yer değiştirir <em>ve</em> $b$ ile $c$'yi negatifler. Birini atlamak makul görünen ama yanlış çarpan bir matris verir.</div></div>
<div class="calc-card"><div class="card-title">Yanlış çarpım sırası</div><div class="card-body">$(AB)^{-1} = B^{-1}A^{-1}$, $A^{-1}B^{-1}$ değil. Sırayı ters çevir. Sınavda en sık yapılan hatalardan biridir.</div></div>
<div class="calc-card"><div class="card-title">Kofaktör matrisinin transpozunu unutmak</div><div class="card-body">Ek matris, kofaktör matrisinin <em>transpozudur</em>, kofaktör matrisinin kendisi değil. Transpozu atlamak doğru elemanları yanlış konumlara koyar.</div></div>
<div class="calc-card"><div class="card-title">Kofaktör işaret hataları</div><div class="card-body">Kofaktörler $(-1)^{i+j}$ taşır. Satranç tahtası işaret örüntüsü sol üstte $+$ ile başlar ve değişir. Bir işareti kaçırırsan tüm ters yanlış olur.</div></div>
<div class="calc-card"><div class="card-title">Yanlış taraftan çarpmak</div><div class="card-body">$A\\mathbf{x} = \\mathbf{b}$'yi çözmek için $A^{-1}$ ile <em>soldan</em> çarp: $A^{-1}A\\mathbf{x} = A^{-1}\\mathbf{b}$, $\\mathbf{x} = A^{-1}\\mathbf{b}$ verir. Sağdan çarpmak ($\\mathbf{x}A^{-1}$) $\\mathbf{x}$ sütun olduğunda anlamsızdır.</div></div>
</div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<p class="l-text">Bu dersin tüm konularını birleştiren sekiz problem. Çözümü okumadan önce her birini kendin dene.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — $2\\times 2$ TERS</div><div class="example-body"><strong>$A = \\begin{pmatrix} 5 & 2 \\\\ 3 & 1 \\end{pmatrix}$'in tersini bul.</strong><br><br>$\\det A = 5\\cdot 1 - 2\\cdot 3 = 5 - 6 = -1$. Sıfırdan farklı.<br>Yer-değiştir-ve-negatifle: $\\begin{pmatrix} 1 & -2 \\\\ -3 & 5 \\end{pmatrix}$. $-1$'e böl:<br>$A^{-1} = \\begin{pmatrix} -1 & 2 \\\\ 3 & -5 \\end{pmatrix}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TEKİLLİK TESTİ</div><div class="example-body"><strong>$B = \\begin{pmatrix} 4 & 6 \\\\ 6 & 9 \\end{pmatrix}$'in tersi var mı?</strong><br><br>$\\det B = 4\\cdot 9 - 6\\cdot 6 = 36 - 36 = 0$. <strong>$B$ tekildir.</strong> Ters yoktur. (Dikkat: satır 2 = $1.5\\,\\cdot$ satır 1 — sıfır determinantın yakaladığı şey tam da bu doğrusal bağımlılıktır.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — $2\\times 2$ SİSTEM ÇÖZ</div><div class="example-body"><strong>$\\;3x + y = 7, \\;\\; 2x - y = 3\\;$ sistemini çöz.</strong><br><br>$A = \\begin{pmatrix} 3 & 1 \\\\ 2 & -1 \\end{pmatrix}$, $\\det A = -3 - 2 = -5$.<br>$A^{-1} = \\dfrac{1}{-5}\\begin{pmatrix} -1 & -1 \\\\ -2 & 3 \\end{pmatrix} = \\begin{pmatrix} 1/5 & 1/5 \\\\ 2/5 & -3/5 \\end{pmatrix}$.<br>$\\mathbf{x} = A^{-1}\\begin{pmatrix} 7 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 7/5 + 3/5 \\\\ 14/5 - 9/5 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$.<br>Cevap: $x = 2$, $y = 1$. <em>Kontrol:</em> $3\\cdot 2 + 1 = 7$, $2\\cdot 2 - 1 = 3$. OK.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — TERSİN TERSİ</div><div class="example-body"><strong>$A^{-1} = \\begin{pmatrix} 4 & -1 \\\\ -3 & 1 \\end{pmatrix}$ ise $A$'yı bul.</strong><br><br>Özellik 1'e göre $(A^{-1})^{-1} = A$. Yani verilen matrisin tersini al.<br>$\\det(A^{-1}) = 4\\cdot 1 - (-1)\\cdot(-3) = 4 - 3 = 1$.<br>$A = (A^{-1})^{-1} = \\dfrac{1}{1}\\begin{pmatrix} 1 & 1 \\\\ 3 & 4 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 3 & 4 \\end{pmatrix}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — DURUMU BELİRLE</div><div class="example-body"><strong>Çözmeden, $\\;3x - 6y = 9, \\;\\; -x + 2y = -3\\;$ sistemini sınıflandır.</strong><br><br>$A = \\begin{pmatrix} 3 & -6 \\\\ -1 & 2 \\end{pmatrix}$, $\\det A = 6 - 6 = 0$. Yani sistem tek çözümlü <em>değil</em>.<br>Sağ tarafları kontrol et: satır 1'in sağı $9$, satır 2'nin sağı $-3$. Katsayı matrisinde satır 1 = $-3\\,\\cdot$ satır 2 olduğuna dikkat et; sağ tarafta da $9 = -3\\cdot(-3)$ tutuyor. İki denklem aynı doğruyu tanımlar.<br>Cevap: <strong>sonsuz çözüm</strong>. $-x + 2y = -3$ koşulunu sağlayan her $(x, y)$ (eşdeğer biçimde $x = 2y + 3$) çalışır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — ÇARPIM TERS ÖZELLİĞİ</div><div class="example-body"><strong>$A^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ ve $B^{-1} = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$ ise $(AB)^{-1}$'i bul.</strong><br><br>Özellik 2'ye göre: $(AB)^{-1} = B^{-1}A^{-1}$ (ters sıra!).<br>$B^{-1}A^{-1} = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 6 & 3 \\\\ 2 & 2 \\end{pmatrix}$.<br>Cevap: $(AB)^{-1} = \\begin{pmatrix} 6 & 3 \\\\ 2 & 2 \\end{pmatrix}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — $3\\times 3$ SİSTEM (İPUCU)</div><div class="example-body"><strong>$\\;x + 2y + 3z = 6, \\;\\; y + 4z = 5, \\;\\; 5x + 6y = 11\\;$ sistemini çöz.</strong><br><br>Bu, bölüm 4'teki çözümlü örnekteki $A$ matrisinin aynısıdır. Sağ taraf $\\mathbf{b} = (6, 5, 11)^T$.<br>Bölüm 4'ten: $A^{-1} = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$.<br>$\\mathbf{x} = A^{-1}\\mathbf{b}$:<br>$x = -24\\cdot 6 + 18\\cdot 5 + 5\\cdot 11 = -144 + 90 + 55 = 1$<br>$y = 20\\cdot 6 - 15\\cdot 5 - 4\\cdot 11 = 120 - 75 - 44 = 1$<br>$z = -5\\cdot 6 + 4\\cdot 5 + 1\\cdot 11 = -30 + 20 + 11 = 1$<br>Cevap: $x = y = z = 1$. <em>İlk denklemi kontrol et:</em> $1 + 2 + 3 = 6$. OK.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — KARMA ÖZELLİKLER</div><div class="example-body"><strong>$\\det A = 4$ ve $A$ bir $3\\times 3$ matrisi ise $\\det(A^{-1})$ ve $\\det(2 A^{-1})$ değerlerini bul.</strong><br><br>$\\det(A^{-1}) = 1/\\det A = 1/4$.<br>$3\\times 3$ bir matris için $\\det(kM) = k^3 \\det M$. Dolayısıyla $\\det(2 A^{-1}) = 2^3 \\cdot \\det(A^{-1}) = 8 \\cdot (1/4) = 2$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ters $A^{-1}$, $A A^{-1} = A^{-1} A = I$ özelliğini sağlayan tek matristir; yalnız kare matrislerin tersi olabilir</li>
<li>$A^{-1}$ vardır $\\Leftrightarrow$ $\\det A \\neq 0$; aksi halde $A$ tekildir</li>
<li>$2\\times 2$ formülü: köşegenleri yer değiştir, köşegen dışını negatifle, determinanta böl</li>
<li>$3\\times 3$ formülü: kofaktörler $\\to$ ek matris (transpoz) $\\to$ determinanta böl</li>
<li>Temel özellikler: $(A^{-1})^{-1} = A$, $(AB)^{-1} = B^{-1}A^{-1}$ (ters sıra), $(A^T)^{-1} = (A^{-1})^T$</li>
<li>$A\\mathbf{x} = \\mathbf{b}$ doğrusal sisteminin $\\det A \\neq 0$ olduğunda tek çözümü $\\mathbf{x} = A^{-1}\\mathbf{b}$'dir</li>
<li>$\\det A = 0$, sağ tarafa bağlı olarak ya çözümsüz (paralel doğrular) ya da sonsuz çözüm (çakışık doğrular) demektir</li>
</ul>
</div>`

};
